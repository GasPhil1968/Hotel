// MALA-QA: Headless-Treiber für die PRODUKTIONSDATEI web/index.html.
// Lädt das erste <script> der gebauten index.html unverändert in eine Node-VM (kein Nachbau der Spielwelt).
// Ohne `document` steigt 99_main.js (Canvas, Eingabe, rAF) aus; der Treiber übernimmt die Bildschleife:
// pro Bild M.update(16) und M.renderFrame() (die Zeichenroutine legt Trefferflächen der Overlays an und
// enthält etwas Logik, deshalb wird sie wie im Browser jedes Bild aufgerufen).
// Kontrolliert: Math.random (Seed, mulberry32), Date.now/performance.now/setTimeout (virtuelle Uhr),
// localStorage (eigener Speicher je Lauf, Inhalt kann exportiert/importiert werden = "frischer Kontext").
// Schnittstelle wie game/tools/driver.js (Playwright), damit dieselben Spielerhandlungen laufen.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), zlib = require('zlib');

const DEFAULT_HTML = path.join(__dirname, '..', 'web', 'index.html');
const scriptCache = {};
function loadScript(htmlPath) {
  htmlPath = path.resolve(htmlPath || process.env.MALA_HTML || DEFAULT_HTML);
  if (scriptCache[htmlPath]) return scriptCache[htmlPath];
  const html = fs.readFileSync(htmlPath, 'utf8');
  const a = html.indexOf('<script>'), b = html.indexOf('</script>', a);
  if (a < 0 || b < 0) throw new Error('kein <script> in ' + htmlPath);
  const code = html.slice(a + 8, b);
  const sha = crypto.createHash('sha256').update(html).digest('hex');
  const res = { htmlPath, sha, sha12: sha.slice(0, 12), script: new vm.Script(code, { filename: 'index.html#script' }) };
  scriptCache[htmlPath] = res; return res;
}

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function makeStorage(init) {
  const m = new Map(Object.entries(init || {}));
  return {
    getItem: k => (m.has(String(k)) ? m.get(String(k)) : null),
    setItem: (k, v) => { m.set(String(k), String(v)); },
    removeItem: k => { m.delete(String(k)); },
    clear: () => m.clear(),
    key: i => Array.from(m.keys())[i] || null,
    get length() { return m.size; },
    __dump: () => Object.fromEntries(m)
  };
}

const renderModeOf = (opts) => (opts.render === undefined ? (process.env.MALA_RENDER || 'smart') : opts.render);   // 'full' | 'smart' | false
const drainMicro = () => new Promise(r => setImmediate(r));

// opts: { seed, turbo, html, storage (Objekt), frameMs, render }
async function open(opts = {}) {
  const S = loadScript(opts.html);
  const seed = (opts.seed >>> 0) || 1;
  const rnd = mulberry32(seed);
  const storage = makeStorage(opts.storage);
  const FRAME = opts.frameMs || 16;
  let realMs = 0;               // virtuelle "Echtzeit" (vor TURBO)
  const vtimers = [];           // setTimeout der Seite auf virtueller Uhr
  let vtid = 1;
  const errors = [], consoleErr = [], events = [];
  const EPOCH = Date.UTC(2026, 10, 7, 9, 0, 0);
  const sandbox = {
    console: {
      log: () => {}, info: () => {}, debug: () => {},
      warn: (...a) => { events.push(['warn', a.map(String).join(' ')]); },
      error: (...a) => { const t = a.map(x => (x && x.stack) ? x.stack : String(x)).join(' '); consoleErr.push(t); errors.push('console.error: ' + t); }
    },
    localStorage: storage,
    setTimeout: (fn, ms) => { const id = vtid++; vtimers.push({ id, t: realMs + (+ms || 0), fn }); return id; },
    clearTimeout: id => { const i = vtimers.findIndex(t => t.id === id); if (i >= 0) vtimers.splice(i, 1); },
    setInterval: () => 0, clearInterval: () => {},
    performance: { now: () => realMs },
    navigator: { maxTouchPoints: 0, userAgent: 'mala-qa-vm' },
    queueMicrotask: (f) => Promise.resolve().then(f),
    structuredClone: (x) => JSON.parse(JSON.stringify(x))
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(`var window=globalThis; (function(){ var D=Date, E=${EPOCH}; Date=function(a,b,c,d,e,f,g){ if(!(this instanceof Date)) return new D(E+globalThis.__realMs()).toString(); if(arguments.length===0) return new D(E+globalThis.__realMs()); return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))(); }; Date.prototype=D.prototype; Date.now=function(){ return E+globalThis.__realMs(); }; Date.UTC=D.UTC; Date.parse=D.parse; })();`, ctx);
  sandbox.__realMs = () => realMs;
  sandbox.__rnd = rnd;
  vm.runInContext('Math.random=function(){ return __rnd(); };', ctx);
  // unbehandelte Promise-Rejections aus Spielskripten mitschreiben (Node meldet sie global)
  const onRej = (reason) => { errors.push('UNHANDLED ' + ((reason && reason.stack) || String(reason))); };
  process.setMaxListeners(0); process.on('unhandledRejection', onRej);
  try { S.script.runInContext(ctx); } catch (e) { errors.push('LOAD ' + e.stack); throw e; }
  const M = sandbox.M || vm.runInContext('M', ctx);
  if (M.boot) M.boot();
  M.TEST = true; M.TURBO = opts.turbo || 25;
  // 'smart': gezeichnet wird nur, wo Spiellogik an der Zeichnung hängt (Abspann-Ende, Overlay-Trefferflächen, Auto-Schließen).
  // Dabei wird der Raum für die Dauer der Zeichnung ausgeblendet (M.E.room=null), sodass renderFrame den vorhandenen Zweig
  // „Overlay/Sprechtext ohne Szene“ nimmt. Die Szene selbst (Hintergrundmalerei, Figuren) zeichnen nur 'full'-Läufe und die Browsertests.
  const smartRender = () => { const r = M.E.room; M.E.room = null; try { return M.renderFrame(); } finally { M.E.room = r; } };
  let frames = 0;
  const renderMode = renderModeOf(opts);   // 'full' | 'smart' | false
  let renders = 0;
  let lastOv = null;
  const needRender = () => { if (renderMode === 'full') return true; if (!renderMode) return false; const E = M.E;
    if (E.screen === 'credits') return frames % 8 === 0;                       // Abspann-Ende (creditsDone) hängt an der Zeichnung
    if (E.overlay && (E.overlay.kind === 'map' || E.overlay.kind === 'doc' || E.overlay.kind === 'memory')) return false;   // Stadtplan/Dokument/Erinnerungsbild: Zeichnung ohne Spiellogik
    if (E.overlay) { if (E.overlay !== lastOv) { lastOv = E.overlay; return true; } return frames % 8 === 0; }   // Trefferflächen, Auto-Schließen
    lastOv = null; return frames % 2000 === 0; };
  function frame() {
    realMs += FRAME; frames++;
    for (let i = vtimers.length - 1; i >= 0; i--) if (vtimers[i].t <= realMs) { const t = vtimers.splice(i, 1)[0]; try { t.fn(); } catch (e) { errors.push('TIMEOUT ' + e.stack); } }
    try { M.update(FRAME); if (opts.onFrame) opts.onFrame(M, realMs); if (needRender()) { renders++; if (renderMode === 'full') M.renderFrame(); else smartRender(); } } catch (err) { errors.push('FRAME ' + (err.stack || err)); }
  }
  async function wait(ms) { if (opts.deadline && Date.now() > opts.deadline) { const e = new Error('Zeitrahmen überschritten (Wanduhr)'); e.kind = 'limit'; throw e; } if (opts.vlimit && realMs > opts.vlimit) { const e = new Error('Zeitrahmen überschritten (Spielzeit)'); e.kind = 'limit'; throw e; } const n = Math.max(1, Math.ceil(ms / FRAME)); for (let i = 0; i < n; i++) { frame(); await drainMicro(); } }
  const ev = async (fn, arg) => { await drainMicro(); const src = '(' + fn.toString() + ')(' + (arg === undefined ? '' : 'JSON.parse(' + JSON.stringify(JSON.stringify(arg)) + ')') + ')';
    let r = vm.runInContext(src, ctx);
    if (r && typeof r.then === 'function') {   // wie page.evaluate: die Seite läuft weiter, während auf das Promise gewartet wird
      let done = false, val, err; r.then(v => { done = true; val = v; }, e => { done = true; err = e; });
      await drainMicro(); const t0 = realMs;
      while (!done) { if (realMs - t0 > 120000) { const e = new Error('ev: Promise nach 120 s nicht erfüllt'); e.kind = 'timeout'; throw e; } frame(); await drainMicro(); }
      if (err) throw err; r = val; }
    await drainMicro(); return r === undefined ? undefined : JSON.parse(JSON.stringify(r)); };
  const page = {
    waitForTimeout: wait,
    evaluate: ev,
    screenshot: async (o) => { if (o && o.path) writePNG(o.path, M); },
    mouse: null
  };
  const D = {
    vm: true, M, ctx, page, errors, consoleErr, events, storage, seed, sha: S.sha, sha12: S.sha12,
    frames: () => frames, renders: () => renders, vtime: () => realMs,
    st: () => { const s = M.TA.status(); s.realRoom = s.room; if (s.map) s.room = 'map'; return Promise.resolve(s); },
    stSync: () => { const s = M.TA.status(); s.realRoom = s.room; if (s.map) s.room = 'map'; return s; },
    async until(pred, ms = 20000, what = '') { const t0 = realMs; let s; while (realMs - t0 < ms) { s = D.stSync(); if (pred(s)) return s; await wait(40); } const e = new Error('Zeitüberschreitung: ' + what + ' | ' + JSON.stringify(s)); e.kind = 'timeout'; throw e; },
    async settle(ms = 30000) { return D.until(s => (s.screen === 'game' && !s.busy && !s.speech && !s.card && !s.acting && !s.walk) || s.dlg || (s.overlay && !(s.map && (s.mapActing || s.speech))), ms, 'settle'); },
    async idle(ms = 30000) { const s = await D.settle(ms); if (s.dlg || s.overlay) throw new Error('Unerwartet offen: ' + JSON.stringify(s)); return s; },
    async act(verb, id, item) { if (item) { const s0 = D.stSync(); if (s0.inv.indexOf(item) < 0 && s0.active === 'marko') throw new Error('Gegenstand nicht im Inventar: ' + item); } M.TA.act(verb, id, item); await wait(60); return D.settle(); },
    async exit(id) { M.TA.exit(id); await wait(60); return D.settle(); },
    async item(verb, id, other) { const s0 = D.stSync(); [id, other].forEach(x => { if (x && s0.inv.indexOf(x) < 0 && s0.active === 'marko') throw new Error('Gegenstand nicht im Inventar: ' + x); }); M.TA.item(verb, id, other); await wait(60); return D.settle(); },
    async choose(sub) { await D.until(s => s.dlg, 20000, 'Auswahl für ' + sub); M.TA.choose(sub); await wait(60); return D.settle(); },
    async pickNote(id) { await D.until(s => s.overlay === 'notebook' || s.dlg, 20000, 'Notizbuch'); M.TA.pickNote(id); await wait(60); return D.settle(); },
    async close(v) { await D.until(s => s.overlay, 20000, 'Overlay'); M.TA.closeOverlay(v); await wait(60); return D.settle(); },
    async drain(max = 12) { for (let i = 0; i < max; i++) { const s = await D.settle(); if (s.overlay && ['notebook', 'puzzle', 'arrange', 'halves', 'glyphs', 'map', 'peil'].indexOf(s.overlay) < 0) { M.TA.closeOverlay(); await wait(60); continue; } return s; } return D.st(); },
    async combine(a, b) { let r = M.TA.combine(a, b); if (r && typeof r.then === 'function') r = await r; await drainMicro(); return r === undefined ? undefined : JSON.parse(JSON.stringify(r)); },
    async travel(loc) { M.TA.travel(loc); await wait(60); return D.drain(); },
    async switchTo(w) { M.TA.switchTo(w); await wait(100); return D.settle(); },
    async shot(file) { writePNG(file, M); },
    ev,
    hasNote: (id) => Promise.resolve(M.GS.notes.indexOf(id) >= 0),
    flag: (k) => Promise.resolve(M.GS.flags[k]),
    async close2() { process.removeListener('unhandledRejection', onRej); },
    exportStorage: () => storage.__dump()
  };
  return D;
}

// PNG aus dem Bildpuffer des Spiels (320×200, Palette M.RGB) – für Fehlerbelege
function crcTable() { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; }
const CRC = crcTable();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, c]); }
function writePNG(file, M) {
  const fb = M.renderFrame(), d = fb.d, W = 320, H = 200, raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; for (let x = 0; x < W; x++) { const q = M.RGB[d[y * W + x]] || M.RGB[0], o = y * (W * 3 + 1) + 1 + x * 3; raw[o] = q[0]; raw[o + 1] = q[1]; raw[o + 2] = q[2]; } }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}

module.exports = { open, loadScript, mulberry32, writePNG };
