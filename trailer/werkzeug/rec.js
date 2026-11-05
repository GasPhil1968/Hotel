// MALA – Trailer-Aufnahme. Nimmt echte Spielszenen aus der laufenden Engine auf: jedes Bild des Spiel-Canvas (320×200)
// mit Zeitstempel der Audio-Uhr und den Ton, den die Engine live erzeugt (verlustfrei als PCM vom Master-Ausgang).
// Eingaben laufen über die echten Zeiger-Funktionen des Spiels (Maus: Cursor sichtbar, Menüs, Ziehen, Wechselknopf).
// Spielstände kommen aus den Durchläufen (walkthrough*.js, MALA_DUMPALL) – also aus echtem Spielverlauf.
//   node rec.js <shot-id> [<shot-id> …]        Aufnahmen nach takes/<id>/  (f_00000.png …, frames.json, audio.f32, meta.json)
// Das Spiel selbst wird nicht verändert: Messpunkte (AudioContext, Master-Knoten) werden nur zur Laufzeit angehängt.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const T = __dirname, HTML = path.join(T, 'game', 'index.html');
const SHOTS = require('./shots.js');

function initScript() {
  // Audio-Uhr und Master-Knoten finden, ohne den Spielcode anzufassen
  const AC0 = window.AudioContext || window.webkitAudioContext;
  window.AudioContext = function (o) { const c = new AC0(o); window.__ac = c; return c; };
  window.AudioContext.prototype = AC0.prototype; window.webkitAudioContext = window.AudioContext;
  const con = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dst) { if (dst && window.__ac && dst === window.__ac.destination && !window.__master) window.__master = this; return con.apply(this, arguments); };
}

async function run(id) {
  const S = SHOTS[id]; if (!S) throw new Error('unbekannte Einstellung ' + id);
  const OUT = path.join(T, 'takes', id); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: !!S.touch });
  await ctx.addInitScript(initScript);
  if (S.prefs) await ctx.addInitScript((p) => { try { Object.keys(p).forEach(k => localStorage.setItem(k, p[k])); } catch (e) {} }, S.prefs);
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + HTML); await page.waitForTimeout(700);
  // Grundeinstellungen wie für einen neuen Spieler: Deutsch, Text normal, Notizbuch als Liste, Ton an, Musik nach Einstellung
  await page.evaluate((S) => { M.setLang('de'); M.E.setText(1, false); M.E.setNbStyle('list'); M.TEST = false; M.audioInit(); M.setSound(true); M.setMusic(!!S.music); }, { music: S.music });
  const R = helpers(page, OUT);
  if (S.dump) await R.loadDump(S.dump);
  if (S.setup) await S.setup(R);
  await R.startRec();
  let err = null; try { await S.play(R); } catch (e) { err = e; console.error('Fehler in', id, e.message); }
  await R.stopRec();
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ id, title: S.title, dump: S.dump || null, music: !!S.music, errors, err: err && err.message, log: R.log }, null, 1));
  await browser.close(); console.log(id, 'fertig', R.stats(), errors.length ? 'Seitenfehler: ' + errors.slice(0, 2).join(' | ') : '');
  if (err) throw err;
}

function helpers(page, OUT) {
  let n = 0, rec = false, pump = null, aChunks = 0; const frames = []; const log = []; const t0 = Date.now();
  const ev = (f, a) => page.evaluate(f, a);
  const wait = ms => page.waitForTimeout(ms);
  const st = () => ev(() => { const s = M.TA.status(); return Object.assign(s, { active: M.GS.active, phase: M.GS.phase, pop: M.E.pop ? M.E.pop.opts.map(o => o.t) : null, flash: M.E.msg ? M.E.msg.t : null }); });
  const R = {
    page, ev, wait, st, log,
    note(...a) { const s = '[' + ((Date.now() - t0) / 1000).toFixed(1) + 's] ' + a.join(' '); log.push(s); console.log(s); },
    async loadDump(rel) { const d = JSON.parse(fs.readFileSync(path.join(T, rel), 'utf8'));
      await ev((g) => { M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: g }; M.E.loadPreset('__t', 1); }, d.GS); await wait(600); R.note('Spielstand', rel, d.label); },
    // ---------------------------------------------------------------- Aufnahme
    async startRec() {
      await ev(() => { const ac = window.__ac, mst = window.__master; window.__fr = []; window.__au = []; window.__rec = true;
        if (ac && mst) { const sp = ac.createScriptProcessor(4096, 2, 2); const sink = ac.createGain(); sink.gain.value = 0;
          sp.onaudioprocess = e => { if (!window.__rec) return; const b = e.inputBuffer; window.__au.push([e.playbackTime, Array.from(b.getChannelData(0)), Array.from(b.numberOfChannels > 1 ? b.getChannelData(1) : b.getChannelData(0))]); };
          mst.connect(sp); sp.connect(sink); sink.connect(ac.destination); window.__sp = sp; window.__sr = ac.sampleRate; }
        const cv = document.getElementById('game');
        window.__evq = []; let last = '';
        const grab = () => { if (!window.__rec) return; const t = ac ? ac.currentTime : performance.now() / 1000;
          try { window.__fr.push([t, cv.toDataURL('image/png')]); } catch (e) {}
          try { const E = M.E, sp = E.speech, d = E.dlg, ov = E.overlay; const sig = JSON.stringify([sp ? (sp.who + ': ' + sp.text) : '', d ? d.opts.map(o => o.t).join(' / ') : '', ov ? ov.kind : '', E.room ? E.room.id : '', M.GS.active, E.msg && E.gt() < E.msg.until ? E.msg.t : '', E.pop ? E.pop.opts.map(o => o.t).join('/') : '', E.screen]);
            if (sig !== last) { last = sig; window.__evq.push([t, JSON.parse(sig)]); } } catch (e) {}
          requestAnimationFrame(grab); };
        requestAnimationFrame(grab); });
      rec = true; fs.writeFileSync(path.join(OUT, 'audio.f32'), Buffer.alloc(0));
      pump = (async () => { while (rec) { await R.flush(); await wait(300); } })();
      R.note('Aufnahme läuft'); },
    async flush() { const r = await ev(() => { const f = window.__fr, a = window.__au, q = window.__evq || []; window.__fr = []; window.__au = []; window.__evq = []; return { f, a, q, sr: window.__sr || 0 }; });
      if (r.q.length) fs.appendFileSync(path.join(OUT, 'events.jsonl'), r.q.map(x => JSON.stringify(x)).join('\n') + '\n');
      for (const [t, d] of r.f) { const fn = `f_${String(n++).padStart(5, '0')}.png`; fs.writeFileSync(path.join(OUT, fn), Buffer.from(d.split(',')[1], 'base64')); frames.push([fn, t]); }
      if (r.a.length) { const parts = []; for (const [t, L, Rr] of r.a) { const buf = Buffer.alloc(8 + L.length * 8); buf.writeDoubleLE(t, 0); for (let i = 0; i < L.length; i++) { buf.writeFloatLE(L[i], 8 + i * 8); buf.writeFloatLE(Rr[i], 12 + i * 8); } parts.push(buf); aChunks++; }
        fs.appendFileSync(path.join(OUT, 'audio.f32'), Buffer.concat(parts)); fs.writeFileSync(path.join(OUT, 'audio.json'), JSON.stringify({ sr: r.sr, block: 4096, chunks: aChunks })); } },
    async stopRec() { await wait(400); await ev(() => { window.__rec = false; }); rec = false; await pump; await R.flush(); fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify(frames)); R.note('Aufnahme beendet', frames.length, 'Bilder'); },
    stats() { return frames.length + ' Bilder, ' + aChunks + ' Tonblöcke, ' + (frames.length ? (frames[frames.length - 1][1] - frames[0][1]).toFixed(1) + ' s' : ''); },
    // ---------------------------------------------------------------- Eingabe wie ein Spieler (Maus)
    async moveTo(x, y, ms = 450) { await ev(([x, y, ms]) => new Promise(res => { const p = M.__ptr || { x: 160, y: 100 }; const x0 = p.x, y0 = p.y, t0 = performance.now();
      const step = () => { const k = Math.min(1, (performance.now() - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; const xx = x0 + (x - x0) * e, yy = y0 + (y - y0) * e; M.pointerMove(xx, yy, false); M.__ptr = { x: xx, y: yy }; if (k < 1) requestAnimationFrame(step); else res(); }; step(); }), [x, y, ms]); },
    async click(x, y, ms) { if (x !== undefined) await R.moveTo(x, y, ms); await wait(120); await ev(() => { const p = M.__ptr; M.pointerDown(p.x, p.y, false); }); await wait(90); await ev(() => { const p = M.__ptr; M.pointerUp(p.x, p.y, false); }); await wait(120); },
    async hide() { await ev(() => { M.pointerMove(-20, -20, false); M.__ptr = { x: -20, y: -20 }; }); },
    async findHit(pred) { return ev((src) => { const f = new Function('k', 'return (' + src + ')(k)'); for (let y = 0; y < 200; y += 1) for (let x = 0; x < 320; x += 2) { const k = M.uiHit(x, y); if (k && f(k)) return [x, y, k]; } return null; }, pred.toString()); },
    async hsPoint(id) { return ev((id) => { const pts = []; const cam = Math.round(M.E.camX || 0);
      for (let y = 2; y < 144; y += 2) for (let x = 2; x < 320; x += 2) { const h = M.E.hotspotAt(x + cam, y); if (h && h.id === id) pts.push([x, y]); }
      if (!pts.length) return null; pts.sort((a, b) => a[1] - b[1] || a[0] - b[0]); const mid = pts[Math.floor(pts.length / 2)];
      const sx = pts.reduce((s, p) => s + p[0], 0) / pts.length, sy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      // nimm den Treffer, der dem Schwerpunkt am nächsten liegt (bei unregelmäßigen Flächen bleibt der Punkt auf dem Objekt)
      let best = mid, bd = 1e9; for (const p of pts) { const d = (p[0] - sx) ** 2 + (p[1] - sy) ** 2; if (d < bd) { bd = d; best = p; } } return best; }, id); },
    async clickHs(id, dx = 0, dy = 0) { const p = await R.hsPoint(id); if (!p) throw new Error('kein Punkt für ' + id); R.note('klickt', id); await R.click(p[0] + dx, p[1] + dy); },
    async clickAt(x, y) { R.note('klickt bei', x, y); await R.click(x, y); },
    async pick(label) { await R.until(s => !!s.pop, 4000, 'Menü'); const idx = await ev((l) => M.E.pop.opts.findIndex(o => o.t.indexOf(l) >= 0), label); if (idx < 0) throw new Error('Menüpunkt fehlt: ' + label);
      const pt = await R.findHit(new Function('return k=>k==="p:' + idx + '"')()); R.note('wählt im Menü', label); await R.click(pt[0] + 12, pt[1] + 3, 380); },
    async choose(sub, ms = 600) { await R.until(s => !!s.dlg, 90000, 'Auswahl'); const key = await ev((sub) => { const o = M.E.dlg.opts.find(o => o.t.indexOf(sub) >= 0); return o ? (o.k !== undefined ? o.k : M.E.dlg.opts.indexOf(o)) : null; }, sub);
      let rows = []; for (let k = 0; k < 20; k++) { await wait(80); rows = await ev(() => (M.E.dlg && M.E.dlg.lay && M.E.dlg.lay.rows || []).map(r => [r.k, r.r])); if (rows.length) break; }
      let row = rows.find(r => String(r[0]) === String(key));
      if (!row) { const i = await ev((sub) => M.E.dlg.opts.findIndex(o => o.t.indexOf(sub) >= 0), sub); row = rows[i]; }
      for (let k = 0; !row && k < 6; k++) { const dn = await R.findHit(k => k === 'cd'); if (!dn) break; await R.click(dn[0] + 3, dn[1] + 3, 300); await wait(300); const rr = await ev(() => (M.E.dlg.lay && M.E.dlg.lay.rows || []).map(r => [r.k, r.r])); row = rr.find(r => String(r[0]) === String(key)); }
      if (!row) throw new Error('Option nicht sichtbar: ' + sub); const r = row[1]; R.note('wählt', sub); await R.click(r[0] + Math.min(40, r[2] / 3), r[1] + r[3] / 2, ms); },
    async switchFig() { const pt = await R.findHit(k => k === 'sw'); if (!pt) throw new Error('kein Wechselknopf'); R.note('wechselt Figur'); await R.click(pt[0] + 8, pt[1] + 10, 500); },
    async dragItem(itemId, tx, ty) { const slot = await ev((id) => { const L = M.GS.inv; return L.indexOf(id); }, itemId); if (slot < 0) throw new Error('nicht im Inventar: ' + itemId);
      const pt = await R.findHit(new Function('return k=>k==="i:' + slot + '"')()); R.note('zieht', itemId); await R.moveTo(pt[0] + 14, pt[1] + 8, 500); await wait(150);
      await ev(() => { const p = M.__ptr; M.pointerDown(p.x, p.y, false); }); await wait(120); await R.moveTo(pt[0] + 14, pt[1] - 14, 200); await R.moveTo(tx, ty, 900); await wait(350); await ev(() => { const p = M.__ptr; M.pointerUp(p.x, p.y, false); }); await wait(150); },
    async btn(id) { const pt = await R.findHit(new Function('return k=>k==="' + id + '"')()); if (!pt) throw new Error('kein Knopf ' + id); R.note('Knopf', id); await R.click(pt[0] + 8, pt[1] + 5, 500); },
    async tapNote(id) { for (let p = 0; p < 6; p++) { const r = await R.findHit(new Function('return k=>k==="n:' + id + '"')()); if (r) { R.note('Notiz', id); await R.click(r[0] + 24, r[1] + 3, 500); return; }
        const nx = await R.findHit(k => k === 'nnext'); if (!nx) break; await R.click(nx[0] + 4, nx[1] + 3, 300); await wait(500); } throw new Error('Notiz nicht sichtbar: ' + id); },
    // ---------------------------------------------------------------- Warten
    async until(pred, max = 30000, what = '') { const e = Date.now() + max; while (Date.now() < e) { const s = await st(); if (await pred(s)) return s; await wait(80); } const s = await st(); throw new Error('Zeit abgelaufen: ' + what + ' ' + JSON.stringify({ room: s.room, busy: s.busy, dlg: s.dlg, overlay: s.overlay, speech: s.speech, pop: s.pop })); },
    idle: s => !s.busy && !s.speech && !s.dlg && !s.overlay && !s.acting && !s.walk && s.screen === 'game',
    async waitIdle(max = 40000) { return R.until(R.idle, max, 'Ruhe'); },
    async waitSpeech(max = 15000) { return R.until(s => s.speech, max, 'Sprechen'); },
    async waitNoSpeech(max = 20000) { return R.until(s => !s.speech, max, 'Ende Sprechen'); },
    // nur zur Vorbereitung vor der Aufnahme (nicht im Bild): Testschnittstelle
    async ta(fn, a) { return ev(fn, a); }
  };
  return R;
}

(async () => { const ids = process.argv.slice(2); if (!ids.length) { console.log('Einstellungen:', Object.keys(SHOTS).join(' ')); return; }
  for (const id of ids) { try { await run(id); } catch (e) { console.error('ABBRUCH', id, e.message); process.exitCode = 1; } } })();
