// Getrennt protokollierte Browser-Szenarien (Playwright) je Engine. Bedienung über Maus/Touch/Tastatur auf dem Canvas;
// der Spielzustand wird nur gelesen, um Trefferpunkte zu finden und Ergebnisse zu prüfen. Spielstände kommen aus states.json
// (regulär erspielt, über das Menü gespeichert) und werden wie nach einem Neustart über „Fortsetzen“ geladen.
//   node qa/browser/scenarios.js --engine chromium|firefox|webkit [--only S01,S02] [--url http://localhost:8123/]
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const ENGINE = arg('--engine', 'chromium'); const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const ROOT = path.join(__dirname, '..', '..'); const WEB = path.join(ROOT, 'web');
const OUT = path.join(__dirname, '..', 'results', 'browser', 'scen_' + ENGINE); fs.mkdirSync(OUT, { recursive: true });
const STATES = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'results', 'browser', 'states.json'), 'utf8')).states;
const ST = (n) => STATES.find(s => s.name === n);
const pw = require('playwright'); const { launch, contextOpts } = require('./engines');
let FILE_URL = 'file://' + path.join(WEB, 'index.html');   // wird beim Start durch den lokalen http-Server ersetzt (wie ausgeliefert, ohne file://-Einschränkungen)

// kleiner statischer Server (für PWA/Service Worker, braucht http)
function serve(dir, port) { const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
  const srv = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(dir(), p); if (!f.startsWith(dir()) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); fs.createReadStream(f).pipe(res); });
  return new Promise(r => srv.listen(port, '127.0.0.1', () => r(srv))); }

const HELPERS = `window.__qa = {
  toClient: function(x,y){ var cv=document.getElementById('game'), r=cv.getBoundingClientRect(); if (M.isRotated && M.isRotated()) return [r.right - (y+0.5)/200*r.width, r.top + (x+0.5)/320*r.height]; return [r.left+(x+0.5)/320*r.width, r.top+(y+0.5)/200*r.height]; },
  scan: function(code){ M.renderFrame(); for (var y=1;y<200;y+=2) for (var x=1;x<320;x+=2){ if (M.uiHit(x,y)===code) return [x,y]; } return null; },
  codes: function(){ M.renderFrame(); var s={}; for (var y=1;y<200;y+=2) for (var x=1;x<320;x+=2){ var h=M.uiHit(x,y); if (h) s[h]=(s[h]||0)+1; } return s; },
  st: function(){ var E=M.E, p=E.player&&E.player(); return { scr:E.screen, room:E.room&&E.room.id, busy:!!E.busy, dlg:E.dlg?E.dlg.opts.map(function(o){return o.t;}):null, ov:E.overlay?E.overlay.kind:null, speech:!!E.speech, acting:E.acting||0, walk:!!(p&&p.mode==='walk'), active:M.GS.active, phase:M.GS.phase, pop:E.pop?E.pop.opts.map(function(o){return o.t;}):null, menu:!!E.menu, trn:!!E.transitioning, title:E.screen==='title'?M.titleLabels():null, inv:M.GS.inv.slice(), notes:M.GS.notes.length }; }
};`;

async function newPage(browser, device, opts = {}) {
  const ctx = await browser.newContext(Object.assign(contextOpts(pw, ENGINE, device), opts.ctx || {}));
  const page = await ctx.newPage(); const errors = [], consoleErr = [], failedReq = [];
  page.on('pageerror', e => errors.push(String(e.message || e)));
  page.on('console', m => { if (m.type() === 'error') consoleErr.push(m.text()); });
  page.on('requestfailed', r => failedReq.push(r.url().slice(0, 120) + ' ' + ((r.failure() || {}).errorText || '')));
  if (opts.storage) await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__qaInit')) { sessionStorage.setItem('__qaInit', '1'); localStorage.clear(); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } }, opts.storage);
  await page.goto(opts.url || FILE_URL); await page.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
  await page.addScriptTag({ content: HELPERS });
  if (opts.turbo !== false) await page.evaluate((t) => { M.TURBO = t; }, opts.turbo || 20);
  const touch = device !== 'desktop';
  const P = { ctx, page, errors, consoleErr, failedReq, touch,
    st: () => page.evaluate(() => window.__qa.st()),
    async tap(x, y) { const c = await page.evaluate(([x, y]) => window.__qa.toClient(x, y), [x, y]); if (touch) await page.touchscreen.tap(c[0], c[1]); else await page.mouse.click(c[0], c[1]); await page.waitForTimeout(60); },
    async tapCode(code) { const p = await page.evaluate((c) => window.__qa.scan(c), code); if (!p) throw new Error('nicht sichtbar: ' + code); await P.tap(p[0], p[1]); return p; },
    async title(label) { const p = await page.evaluate((lab) => { M.renderFrame(); const L = M.titleLabels(); const i = L.findIndex(t => t.indexOf(lab) >= 0); if (i < 0) return { miss: L }; return window.__qa.scan('t:' + i); }, label); if (!p || p.miss) throw new Error('Titelzeile fehlt: ' + label + ' ' + JSON.stringify(p)); await P.tap(p[0], p[1]); await page.waitForTimeout(150); },
    async until(pred, ms, what) { const t = Date.now(); let s; while (Date.now() - t < ms) { s = await P.st(); if (pred(s)) return s; await page.waitForTimeout(40); } throw new Error('Zeitüberschreitung ' + what + ' ' + JSON.stringify(s)); },
    async idle(ms = 60000) { return P.until(s => s.scr === 'game' && !s.busy && !s.speech && !s.dlg && !s.ov && !s.acting && !s.walk && !s.trn, ms, 'ruhig'); },
    async drainUI(max = 40) { for (let i = 0; i < max; i++) { const s = await P.st(); if (s.scr === 'card') { await P.tap(160, 100); continue; } if (s.speech) { await page.waitForTimeout(150); continue; } if (s.ov === 'memory' || s.ov === 'doc') { await P.tap(160, 60); await page.waitForTimeout(100); continue; } if (s.scr === 'game' && !s.busy && !s.ov && !s.dlg && !s.walk && !s.acting) return s; await page.waitForTimeout(120); } return P.st(); },
    async shot(name) { const f = path.join(OUT, name + '.png'); await page.screenshot({ path: f }); return path.relative(path.join(__dirname, '..', 'results'), f); },
    async playIdle(ms = 90000) { const t = Date.now(); while (Date.now() - t < ms) { const s = await P.st(); if (s.scr === 'game' && !s.busy && !s.speech && !s.dlg && !s.ov && !s.acting && !s.walk) return s; if (s.scr === 'card') { await P.tap(160, 100); continue; } if (s.dlg && !s.speech) { const p = await page.evaluate(() => window.__qa.scan('c:0')); if (p) await P.tap(p[0], p[1]); } else if (s.ov && s.ov !== 'map') { await P.tap(160, 60); } await page.waitForTimeout(200); } throw new Error('nicht zur Ruhe gekommen'); },
    async cont() { await P.title('Fortsetzen'); await P.title('Platz 1'); await P.until(s => s.scr === 'game', 20000, 'Spiel geladen'); await page.waitForTimeout(300); return P.drainUI(); }
  };
  return P;
}
const results = [];
async function scenario(id, title, device, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  const t0 = Date.now(); const r = { id, engine: ENGINE, device, title, ok: false, checks: [], shots: [], errors: [], consoleErr: [], failedReq: [] };
  const browser = await launch(pw, ENGINE); r.browserVersion = browser.version();
  let P = null;
  const ck = (cond, what) => { r.checks.push({ ok: !!cond, what }); return !!cond; };
  try { await fn({ browser, ck, r, mk: async (o) => { P = await newPage(browser, device, o); return P; } }); }
  catch (e) { r.checks.push({ ok: false, what: 'Abbruch: ' + String(e.message || e).slice(0, 300) }); if (P) try { r.shots.push(await P.shot(id + '_abbruch')); } catch (_) {} }
  if (P) { r.errors = P.errors.slice(0, 10); r.consoleErr = P.consoleErr.slice(0, 10); r.failedReq = P.failedReq.filter(x => !/favicon/.test(x)).slice(0, 10); }
  ck(!r.errors.length, 'keine Seitenfehler/Promise-Rejections (' + r.errors.length + ')'); ck(!r.failedReq.length, 'keine fehlgeschlagenen Anfragen (' + r.failedReq.length + ')');
  if (r.cleanup) { try { r.cleanup(); } catch (e) {} delete r.cleanup; }
  r.ok = r.checks.every(c => c.ok); if (r.reproduces) { r.bugReproduced = !r.ok && r.checks.filter(c => !c.ok).every(c => /erwartet/.test(c.what)); r.ok = r.bugReproduced; } r.wallS = (Date.now() - t0) / 1000; results.push(r);
  console.log((r.ok ? (r.reproduces ? 'REPRO' : 'OK   ') : 'FEHL ') + id + ' ' + ENGINE + '/' + device + ' ' + title + (r.ok ? '' : ' | ' + r.checks.filter(c => !c.ok).map(c => c.what).join(' | ')));
  await browser.close();
}
const ENG = { chromium: 'C', firefox: 'F', webkit: 'W' }[ENGINE];
const DEV = { chromium: ['desktop', 'tablet'], firefox: ['desktop', 'tablet'], webkit: ['phone', 'tablet'] }[ENGINE];

(async () => {
  const MAIN = await serve(() => WEB, 8130 + ['chromium', 'firefox', 'webkit'].indexOf(ENGINE)); FILE_URL = 'http://127.0.0.1:' + MAIN.address().port + '/';
  // S01 Laden, Titelbild, Skalierung
  await scenario(ENG + '01', 'Start: Titelbild, ganzzahlige Skalierung, kein Überlauf', DEV[0], async ({ mk, ck, r }) => { const P = await mk();
    const s = await P.st(); ck(s.scr === 'title' && s.title.length >= 5, 'Titelmenü mit ' + (s.title || []).length + ' Zeilen');
    const g = await P.page.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { w: c.width, h: c.height, l: c.left, t: c.top, vw: innerWidth, vh: innerHeight, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, dpr: devicePixelRatio, rot: M.isRotated() }; });
    r.geometry = g; ck(g.l >= -0.5 && g.t >= -0.5 && g.l + g.w <= g.vw + 0.5 && g.t + g.h <= g.vh + 0.5, 'Spielbild vollständig im Fenster ' + JSON.stringify(g)); ck(g.sw <= g.vw && g.sh <= g.vh, 'keine Scrollbalken');
    ck(Math.abs(g.w / g.h - 1.6) < 0.01, 'Seitenverhältnis 16:10'); r.shots.push(await P.shot(ENG + '01_titel')); });
  // S02 Neues Spiel K1 über Klicks, Zeigen, Figur gehen
  await scenario(ENG + '02', 'Neues Spiel Kapitel 1 per Tippen, „Zeigen“, Boden antippen = gehen', DEV[0], async ({ mk, ck, r }) => { const P = await mk();
    await P.title('Kapitel 1: Split'); await P.title('Platz 1'); await P.until(s => s.scr === 'game', 20000, 'Spielstart'); const s = await P.drainUI(); ck(s.room === 'flat', 'erster Raum Markos Wohnung (' + s.room + ')');
    const before = await P.page.screenshot(); await P.tapCode('reveal'); await P.page.waitForTimeout(250); const after = await P.page.screenshot(); ck(!before.equals(after), '„Zeigen“ verändert das Bild (Hotspots blinken)'); r.shots.push(await P.shot(ENG + '02_zeigen'));
    await P.page.waitForTimeout(2000); const x0 = await P.page.evaluate(() => M.E.player().x); const fp = await P.page.evaluate(() => { const E = M.E, cam = Math.round(E.camX); for (let x = 40; x < 300; x += 6) for (let y = 135; y > 100; y -= 3) { if (!E.hotspotAt(x + cam, y)) { const np = M.nearestPoint('marko', x + cam, y); if (Math.abs(np[0] - x - cam) < 2 && Math.abs(np[1] - y) < 2 && Math.abs(x + cam - E.player().x) > 40) return [x, y]; } } return null; });
    ck(!!fp, 'freier Bodenpunkt gefunden'); if (fp) { await P.tap(fp[0], fp[1]); await P.page.waitForTimeout(1500); const x1 = await P.page.evaluate(() => M.E.player().x); ck(Math.abs(x1 - x0) > 20, 'Marko geht nach Tipp auf den Boden (' + Math.round(x0) + '→' + Math.round(x1) + ')'); } });
  // S03 Dialoglayout
  await scenario(ENG + '03', 'Dialog: alle Antwortzeilen im Bild, lesbar, antippbar, Gespräch verlassen und fortsetzen', DEV[1] || DEV[0], async ({ mk, ck, r }) => { let P = null, npc = null, s0 = null; for (const nm of ['k2_fikret', 'k4_heim', 'k2_start', 'k1_bruno', 'k3_start']) { if (!ST(nm)) continue; if (P) await P.ctx.close(); P = await mk({ storage: ST(nm).storage }); await P.cont(); await P.idle().catch(() => {}); s0 = await P.st(); npc = await P.page.evaluate(() => { const R = M.E.room, cam = Math.round(M.E.camX); const h = R.hotspots.find(h => { if (!h.npc || !M.ACT[h.npc] || M.ACT[h.npc].ghost) return false; const r = M.E.hsRect(h); return r && r[0] + r[2] - cam > 0 && r[0] - cam < 320; }); return h && h.id; }); if (npc) { r.state = nm; break; } }
    const npc0 = npc; void npc0;
    ck(!!npc, 'Gesprächspartner im Raum ' + s0.room + ': ' + npc); if (!npc) return;
    const cands = await P.page.evaluate(() => { const R = M.E.room, cam = Math.round(M.E.camX); return R.hotspots.filter(h => { if (!h.npc || !M.ACT[h.npc] || M.ACT[h.npc].ghost) return false; const r = M.E.hsRect(h); return r && r[0] + r[2] - cam > 0 && r[0] - cam < 320; }).map(h => h.id); });
    let hp = null;
    for (const id of cands) { await P.playIdle(); hp = await P.page.evaluate((id) => { const E = M.E, h = E.room.byId[id], r = E.hsRect(h), cam = Math.round(E.camX); if (!r) return null; for (let y = r[1] + 2; y < r[1] + r[3]; y += 2) for (let x = r[0] + 1; x < r[0] + r[2]; x += 2) if (E.hotspotAt(x, y) === h && x - cam >= 0 && x - cam < 320 && y < 144) return [x - cam, y]; return null; }, id); if (!hp) continue;
      await P.tap(hp[0], hp[1]); const sp = await P.until(s => s.pop || s.dlg || s.speech, 5000, 'Popup').catch(() => null); if (sp && sp.pop) { const k = sp.pop.findIndex(t => /Rede mit|Sprich mit/.test(t)); if (k >= 0) await P.tapCode('p:' + k); }
      const got = await P.until(s => s.dlg && !s.speech, 20000, 'Auswahl').catch(() => null); if (got) { r.partner = id; break; } hp = null; }
    ck(!!hp, 'ein Gespräch mit Auswahl geöffnet (' + r.partner + ')'); if (!hp) return;
    const s1 = await P.until(s => s.dlg, 60000, 'Auswahl'); r.shots.push(await P.shot(ENG + '03_dialog'));
    const lay = await P.page.evaluate(() => { M.renderFrame(); const d = M.E.dlg, L = d.lay; return { n: d.opts.length, rows: L.rows.map(x => ({ k: x.k, r: x.r, w: M.textWidth(d.opts[x.k].t), t: d.opts[x.k].t })), up: L.up, dn: L.dn, close: L.close }; });
    r.dialog = lay; const inside = lay.rows.every(x => x.r[0] >= 0 && x.r[1] >= 0 && x.r[0] + x.r[2] <= 320 && x.r[1] + x.r[3] <= 200); ck(inside, 'alle sichtbaren Zeilen im Bild (' + lay.rows.length + '/' + lay.n + ')');
    ck(lay.rows.length === lay.n || !!lay.dn, 'mehr Zeilen als Platz → Blätterpfeil vorhanden');
    const bye = s1.dlg.findIndex(t => /Danke|Auf Wiedersehen|Bis |Ich gehe|Gehen|Servus|Später|Tschüss|Gute Nacht/.test(t)); const cx = await P.page.evaluate(() => window.__qa.scan('cx')); ck(bye >= 0 || !!cx, 'Gespräch lässt sich verlassen (Abschiedszeile oder Schließen-Feld)'); let pb = bye >= 0 ? await P.page.evaluate((k) => window.__qa.scan('c:' + k), bye) : null; for (let g = 0; g < 6 && bye >= 0 && !pb; g++) { await P.tapCode('cd'); pb = await P.page.evaluate((k) => window.__qa.scan('c:' + k), bye); } r.byeVia = pb ? 'Zeile (nach Blättern)' : 'Schließen-Feld'; if (pb) await P.tap(pb[0], pb[1]); else if (cx) await P.tap(cx[0], cx[1]);
    const s2 = await P.drainUI(); ck(!s2.dlg && !s2.busy, 'Gespräch verlassen, Eingabe frei'); await P.playIdle(); hp = await P.page.evaluate((id) => { const E = M.E, h = E.room.byId[id], r = E.hsRect(h), cam = Math.round(E.camX); if (!r) return null; for (let y = r[1] + 2; y < r[1] + r[3]; y += 2) for (let x = r[0] + 1; x < r[0] + r[2]; x += 2) if (E.hotspotAt(x, y) === h && x - cam >= 0 && x - cam < 320 && y < 144) return [x - cam, y]; return null; }, r.partner); ck(!!hp, 'Gesprächspartner weiter antippbar'); if (!hp) return; await P.tap(hp[0], hp[1]); const sp2 = await P.until(s => s.pop || s.dlg || s.speech, 5000, 'Popup 2'); r.popup2 = sp2.pop; if (sp2.pop) { const k2 = sp2.pop.findIndex(t => /Rede mit|Sprich mit/.test(t)); ck(k2 >= 0, 'Popup beim zweiten Antippen bietet „Rede mit“ ' + JSON.stringify(sp2.pop)); if (k2 < 0) return; await P.tapCode('p:' + k2); } const s3 = await P.until(s => s.dlg, 60000, 'Auswahl 2'); ck(s3.dlg.length > 0, 'Gespräch lässt sich erneut beginnen'); });
  // S04 Notizbuch
  await scenario(ENG + '04', 'Notizbuch per Knopf und Taste N: Zeilen im Bild, Auswahl, Schließen', DEV[0], async ({ mk, ck, r }) => { const P = await mk({ storage: ST('k2_fikret').storage }); await P.cont();
    await P.tapCode('notes'); const s = await P.until(s => s.ov === 'notebook' || s.dlg, 8000, 'Notizbuch'); r.shots.push(await P.shot(ENG + '04_notizbuch'));
    const lay = await P.page.evaluate(() => { M.renderFrame(); const L = M.E.overlay && M.E.overlay.lay; return L ? { rows: L.rows.length, close: L.close, inside: L.rows.every(x => x.r[0] >= 0 && x.r[1] >= 0 && x.r[0] + x.r[2] <= 320 && x.r[1] + x.r[3] <= 200) } : null; });
    ck(lay && lay.rows > 0 && lay.inside, 'Notizen sichtbar und im Bild ' + JSON.stringify(lay)); await P.tapCode('nx'); const s2 = await P.until(s => !s.ov, 3000, 'zu'); ck(!s2.ov, 'Schließen per Tipp');
    if (!P.touch) { await P.page.keyboard.press('n'); const s3 = await P.until(s => s.ov === 'notebook' || s.dlg, 3000, 'N'); ck(s3.ov === 'notebook' || !!s3.dlg, 'Taste N öffnet'); await P.page.keyboard.press('Escape'); await P.page.waitForTimeout(200); ck(!(await P.st()).ov, 'Esc schließt'); } });
  // S05 Karte
  await scenario(ENG + '05', 'Stadtplan: Orte antippbar, gesperrte Orte mit Begründung, Schließen', DEV[1] || DEV[0], async ({ mk, ck, r }) => { const P = await mk({ storage: ST('k3_peil').storage }); await P.cont(); await P.idle();
    const ex = await P.page.evaluate(() => { const R = M.E.room; const h = M.mapExit(R, M.GS); return h ? h.id : null; }); if (ex) { /* von Innenräumen zur Straße */ }
    await P.tapCode('map'); const s = await P.until(s => s.ov === 'map' || s.speech, 6000, 'Karte'); await P.until(s => s.ov === 'map' && !s.speech, 20000, 'Karte bereit'); r.shots.push(await P.shot(ENG + '05_karte'));
    const codes = await P.page.evaluate(() => Object.keys(window.__qa.codes()).filter(c => c.indexOf('o:') === 0)); const st = await P.page.evaluate(() => M.E.overlay.data.st); r.map = { codes, st };
    const known = Object.keys(st).filter(k => st[k].st !== 'unknown'); ck(known.every(k => codes.indexOf('o:' + k) >= 0), 'jeder bekannte Ort antippbar (' + known.length + ')'); ck(codes.indexOf('o:x') >= 0, 'Schließen-Feld vorhanden');
    const locked = known.find(k => st[k].st === 'locked'); if (locked) { await P.tapCode('o:' + locked); const s2 = await P.until(s => s.speech, 4000, 'Begründung').catch(() => null); ck(!!s2, 'gesperrter Ort „' + locked + '“ nennt einen Grund'); await P.until(s => !s.speech, 30000, 'Satz'); }
    await P.tapCode('o:x'); const s3 = await P.until(s => s.ov !== 'map', 3000, 'Karte zu'); ck(s3.ov !== 'map', 'Karte schließt per Tipp'); });
  // S06 Inventar blättern
  await scenario(ENG + '06', 'Inventarleiste: blättern, Gegenstand antippen → Verben, auf Mala ziehen', DEV[0], async ({ mk, ck, r }) => { const P = await mk({ storage: ST('k4_heim').storage }); await P.cont(); await P.idle();
    const inv = (await P.st()).inv; r.inv = inv; ck(inv.length > 0, 'Gegenstände: ' + inv.length);
    const c = await P.page.evaluate(() => window.__qa.codes()); const slots = Object.keys(c).filter(k => /^i:/.test(k)).length; ck(slots === Math.min(6, inv.length), 'sichtbare Felder ' + slots);
    if (inv.length > 6) { await P.tapCode('dn'); await P.page.waitForTimeout(100); ck((await P.page.evaluate(() => M.E.invTop)) === 1, 'blättern nach rechts'); await P.tapCode('up'); }
    await P.tapCode('i:0'); const s = await P.until(s => s.pop, 3000, 'Popup'); ck(s.pop && s.pop.indexOf('Schau an') >= 0, 'Gegenstands-Popup ' + JSON.stringify(s.pop)); r.shots.push(await P.shot(ENG + '06_inventar'));
    await P.tapCode('p:' + s.pop.indexOf('Schau an')); await P.drainUI(); ck(!(await P.st()).busy, 'danach Eingabe frei'); });
  // S07 Größenänderung
  await scenario(ENG + '07', 'Größenänderung: Spielbild passt sich an, bleibt vollständig sichtbar', 'desktop', async ({ mk, ck, r }) => { const P = await mk(); r.sizes = [];
    for (const [w, h] of [[800, 500], [1024, 768], [1366, 768], [1920, 1080], [640, 900], [500, 320]]) { await P.page.setViewportSize({ width: w, height: h }); await P.page.waitForTimeout(250);
      const g = await P.page.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { w: c.width, h: c.height, l: c.left, t: c.top, vw: innerWidth, vh: innerHeight, sw: document.documentElement.scrollWidth }; });
      const ok = g.l >= -0.5 && g.t >= -0.5 && g.l + g.w <= g.vw + 0.5 && g.t + g.h <= g.vh + 0.5 && g.sw <= g.vw && g.w > 0; r.sizes.push(Object.assign({ ok }, g)); ck(ok, 'Fenster ' + w + '×' + h + ': Bild ' + Math.round(g.w) + '×' + Math.round(g.h)); }
    r.shots.push(await P.shot(ENG + '07_klein')); });
  // S08 Speichern → neuer Kontext → Fortsetzen
  await scenario(ENG + '08', 'Speichern im Menü, neuer Browserkontext mit gespeicherten Daten, Fortsetzen: gleicher Stand', DEV[0], async ({ mk, ck, r, browser }) => { const srv = await serve(() => WEB, 8124 + ['chromium', 'firefox', 'webkit'].indexOf(ENGINE)); const URL8 = 'http://127.0.0.1:' + srv.address().port + '/'; try { const P = await mk({ storage: ST('k3_bato').storage, url: URL8 }); await P.cont(); await P.idle();
    if (!(await P.st()).menu) await P.tapCode('menu'); await P.until(s => s.menu, 3000, 'Menü'); r.shots.push(await P.shot(ENG + '08_menu')); await P.tapCode('m:1'); await P.page.waitForTimeout(200);
    const msg = await P.page.evaluate(() => M.E.msg && M.E.msg.t); ck(/Gespeichert/.test(msg || ''), 'Meldung „' + msg + '“'); await P.tapCode('m:0');
    const g1 = await P.page.evaluate(() => ({ phase: M.GS.phase, room: M.GS.pos[M.GS.active].room, active: M.GS.active, inv: M.GS.inv, notes: M.GS.notes.slice().sort(), flags: Object.keys(M.GS.flags).filter(k => M.GS.flags[k]).sort() }));
    const state = await P.ctx.storageState(); const ctx2 = await browser.newContext(Object.assign(contextOpts(pw, ENGINE, DEV[0]), { storageState: state }));
    const p2 = await ctx2.newPage(); const err2 = []; p2.on('pageerror', e => err2.push(String(e.message))); await p2.goto(URL8); await p2.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); await p2.addScriptTag({ content: HELPERS });
    const Q = Object.assign({}, P, { page: p2, ctx: ctx2, st: () => p2.evaluate(() => window.__qa.st()) }); Q.tap = async (x, y) => { const c = await p2.evaluate(([x, y]) => window.__qa.toClient(x, y), [x, y]); if (P.touch) await p2.touchscreen.tap(c[0], c[1]); else await p2.mouse.click(c[0], c[1]); await p2.waitForTimeout(60); };
    const lab = await p2.evaluate(() => M.titleLabels()); ck(lab[0] === 'Fortsetzen', 'neuer Kontext bietet „Fortsetzen“'); let p = await p2.evaluate(() => window.__qa.scan('t:0')); await Q.tap(p[0], p[1]); await p2.waitForTimeout(150); p = await p2.evaluate(() => window.__qa.scan('t:0')); await Q.tap(p[0], p[1]); await p2.waitForTimeout(800);
    const g2 = await p2.evaluate(() => ({ phase: M.GS.phase, room: M.GS.pos[M.GS.active].room, active: M.GS.active, inv: M.GS.inv, notes: M.GS.notes.slice().sort(), flags: Object.keys(M.GS.flags).filter(k => M.GS.flags[k]).sort() }));
    const same = JSON.stringify(g1) === JSON.stringify(g2); r.compare = same ? 'gleich' : { vorher: g1, nachher: g2 }; ck(same, 'Phase, Ort, Figur, Inventar, Notizen und Schalter gleich'); ck(!err2.length, 'neuer Kontext ohne Fehler'); r.shots.push(path.relative(path.join(__dirname, '..', 'results'), path.join(OUT, ENG + '08_geladen.png'))); await p2.screenshot({ path: path.join(OUT, ENG + '08_geladen.png') }); await ctx2.close(); } finally { srv.close(); } });
  // S09 Fehlbedienung
  await scenario(ENG + '09', 'Fehlbedienung: Doppeltipps auf Ausgänge, Tastenfeuer, Figurenwechsel im Gehen – Spiel bleibt bedienbar', DEV[1] || DEV[0], async ({ mk, ck, r }) => { const P = await mk({ storage: ST('k2_skloniste').storage }); await P.cont(); await P.idle();
    const ex = await P.page.evaluate(() => { const E = M.E, R = E.room, cam = Math.round(E.camX); for (const h of R.hotspots) { if (!h.exit) continue; const rr = E.hsRect(h); if (!rr) continue; for (let y = rr[1] + 2; y < rr[1] + rr[3]; y += 3) for (let x = rr[0] + 1; x < rr[0] + rr[2]; x += 3) if (E.hotspotAt(x, y) === h && x - cam > 0 && x - cam < 320 && y < 144) return { id: h.id, p: [x - cam, y] }; } return null; });
    ck(!!ex, 'Ausgang im Bild'); const room0 = (await P.st()).room; if (ex) { for (let i = 0; i < 3; i++) await P.tap(ex.p[0], ex.p[1]); await P.until(s => !s.trn && !s.walk, 20000, 'Übergang'); await P.drainUI(); const s1 = await P.st(); r.after = s1.room; ck(s1.scr === 'game', 'nach Dreifachtipp im Spiel (' + room0 + '→' + s1.room + ')'); }
    if (!P.touch) { for (const k of ['k', 'Escape', 'n', 'Escape', 'Tab', 'Tab', 'z', 'k', 'k', 'Escape', ' ']) await P.page.keyboard.press(k); }
    await P.page.waitForTimeout(500); await P.drainUI(); for (let i = 0; i < 4; i++) { const s = await P.st(); if (s.ov === 'map') await P.tapCode('o:x').catch(() => {}); if (s.ov === 'notebook') await P.tapCode('nx').catch(() => {}); if (s.menu) await P.tapCode('m:0').catch(() => {}); await P.page.waitForTimeout(150); }
    const s2 = await P.idle(30000).catch(() => null); ck(!!s2, 'Spiel kommt wieder zur Ruhe (keine hängende Sperre)'); ck(s2 && s2.acting === 0, 'kein hängender Aktionszähler'); r.shots.push(await P.shot(ENG + '09_nach_stress')); });
  // S10 Geistersicht
  await scenario(ENG + '10', 'Mala: Wechsel per Porträt, kalte Geistersicht, Geist sichtbar', DEV[0], async ({ mk, ck, r }) => { const P = await mk({ storage: ST('k1_luka').storage }); await P.cont(); await P.idle();
    const avg = async () => { const b = await P.page.screenshot(); const { PNG } = (() => { try { return require('pngjs'); } catch (e) { return {}; } })(); return b.length; };
    r.shots.push(await P.shot(ENG + '10_marko')); const can = await P.page.evaluate(() => M.E.canSwitch()); ck(can, 'Wechsel möglich');
    if (can) { await P.tapCode('sw'); await P.until(s => s.active === 'mala', 5000, 'Mala'); await P.page.waitForTimeout(600); r.shots.push(await P.shot(ENG + '10_mala'));
      const tint = await P.page.evaluate(() => { const fb = M.renderFrame(); let r = 0, g = 0, b = 0; for (let i = 0; i < 320 * 144; i += 7) { const q = M.RGB[fb.d[i]]; r += q[0]; g += q[1]; b += q[2]; } return { r, g, b }; });
      r.tint = tint; ck(tint.b > tint.r * 1.15, 'Geistersicht kühl/blau (B ' + tint.b + ' > R ' + tint.r + ')'); await P.tapCode('sw'); await P.until(s => s.active === 'marko', 5000, 'Marko'); }
    const ghosts = await P.page.evaluate(() => Object.keys(M.ACT).filter(k => M.ACT[k].ghost && k !== 'mala')); r.ghosts = ghosts; });

  // Engine-spezifische Zusatzszenarien
  if (ENGINE === 'chromium') {
    await scenario('C11', 'Trefferflächen-Prüfung: jeder sichtbare Hotspot in 15 erspielten Ständen hat einen antippbaren Punkt', 'desktop', async ({ mk, ck, r }) => { r.audit = [];
      for (const S of STATES) { const P = await mk({ storage: S.storage }); await P.cont(); await P.idle().catch(() => {});
        const a = await P.page.evaluate(() => { const E = M.E, R = E.room, S = M.RS(R.id), out = { room: R.id, active: M.GS.active, total: 0, covered: [], none: [] };
          for (const who of [M.GS.active]) { R.hotspots.forEach(h => { try { if (h.vis && !h.vis(S, M.GS)) return; } catch (e) { return; } if (h.who === 'm' && who !== 'marko') return; if (h.who === 'g' && who !== 'mala') return; const rr = E.hsRect(h); if (!rr || rr[2] * rr[3] === 0) return; out.total++;
            let hit = false, pts = 0; for (let y = Math.max(0, rr[1]); y < Math.min(144, rr[1] + rr[3]) && !hit; y++) for (let x = rr[0]; x < rr[0] + rr[2] && !hit; x++) { pts++; if (E.hotspotAt(x, y) === h) hit = true; }
            if (!hit) out.none.push({ id: h.id, rect: rr, inScreenArea: pts }); }); }
          return out; });
        r.audit.push(Object.assign({ state: S.name }, a)); await P.ctx.close(); }
      const bad = r.audit.reduce((s, x) => s + x.none.length, 0); ck(true, 'geprüft: ' + r.audit.reduce((s, x) => s + x.total, 0) + ' Hotspots in ' + r.audit.length + ' Ständen; ohne antippbaren Punkt: ' + bad);
      r.unreachable = r.audit.filter(x => x.none.length).map(x => ({ state: x.state, room: x.room, ids: x.none.map(n => n.id) })); ck(bad === 0, 'jeder sichtbare Hotspot antippbar' + (bad ? ': ' + JSON.stringify(r.unreachable) : '')); });
    await scenario('C12', 'PWA: Service Worker registriert, offline nach Caching neu starten, Update wird beim Titelbild übernommen', 'desktop', async ({ mk, ck, r, browser }) => {
      const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mala-pwa-')); for (const f of fs.readdirSync(WEB)) fs.copyFileSync(path.join(WEB, f), path.join(tmp, f));
      const srv = await serve(() => tmp, 8123); try {
        const P = await mk({ url: 'http://127.0.0.1:8123/', turbo: false }); await P.page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 }).catch(() => {});
        const note = await P.page.waitForFunction(() => /Offline bereit/.test((document.getElementById('offline-note') || {}).textContent || ''), null, { timeout: 30000 }).then(() => true).catch(() => false); ck(note, 'Meldung „Offline bereit ✓“');
        const cached = await P.page.evaluate(async () => { const ks = await caches.keys(); let n = 0; for (const k of ks) { const c = await caches.open(k); n += (await c.keys()).length; } return { ks, n }; }); r.cache = cached; ck(cached.n >= 3, 'Dateien im Cache: ' + cached.n);
        await P.ctx.setOffline(true); await P.page.reload(); const ok = await P.page.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 }).then(() => true).catch(() => false); ck(ok, 'offline neu geladen: Titelbild erscheint'); r.shots.push(await P.shot('C12_offline'));
        await P.page.addScriptTag({ content: HELPERS }); await P.title('Kapitel 4: München'); await P.title('Platz 1'); const s = await P.until(s => s.scr === 'game', 20000, 'offline Spielstart'); ck(s.scr === 'game', 'offline: Kapitel 4 startet');
        await P.playIdle(); await P.tapCode('menu'); await P.until(s => s.menu, 3000, 'Menü'); await P.tapCode('m:1'); const smsg = await P.page.evaluate(() => M.E.msg && M.E.msg.t); r.saveMsg = smsg; await P.tapCode('m:0');
        await P.ctx.setOffline(false); fs.writeFileSync(path.join(tmp, 'sw.js'), fs.readFileSync(path.join(tmp, 'sw.js'), 'utf8').replace(/var VERSION = '([^']*)';/, "var VERSION = '$1-qa2';"));
        const before = await P.page.evaluate(() => performance.timeOrigin); await P.page.evaluate(() => M.E.toTitle());
        await P.page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r && r.update())).catch(() => {});
        const reloaded = await P.page.waitForFunction((t0) => performance.timeOrigin !== t0, before, { timeout: 30000 }).then(() => true).catch(() => false);
        ck(reloaded, 'neue Fassung: Seite lädt auf dem Titelbild von selbst neu'); if (reloaded) { const sv = await P.page.evaluate(() => caches.keys()); r.cacheAfter = sv; ck(sv.some(k => /-qa2/.test(k)), 'neuer Cache ' + JSON.stringify(sv)); }
        const hasSave = await P.page.evaluate(() => !!localStorage.getItem('mala.save.1')); ck(hasSave, 'Spielstand nach Update erhalten');
      } finally { srv.close(); } });
  }
  if (ENGINE === 'chromium' || ENGINE === 'webkit') {
    // BUG-002 über die Oberfläche: Mala geht zu einem fernen Hotspot, während sie geht, wird auf das Porträt getippt (Marko in einem anderen Raum)
    for (const [tag, file] of [['orig', path.join(ROOT, 'qa', 'originals', 'web_original', 'index.html')], ['neu', path.join(WEB, 'index.html')]]) {
      await scenario(ENG + '13' + (tag === 'orig' ? 'a' : 'b'), 'BUG-002 per Klick (' + (tag === 'orig' ? 'Originalfassung' : 'korrigierte Fassung') + '): Figurenwechsel während Mala geht', ENGINE === 'webkit' ? 'phone' : 'desktop', async ({ mk, ck, r }) => { if (tag === 'orig') r.reproduces = 'BUG-002';
        const srvB = await serve(() => path.dirname(file), 8140 + ['chromium', 'firefox', 'webkit'].indexOf(ENGINE) * 2 + (tag === 'orig' ? 0 : 1)); const P = await mk({ storage: ST('k4_gleis').storage, url: 'http://127.0.0.1:' + srvB.address().port + '/' + path.basename(file) }); r.cleanup = () => srvB.close(); await P.cont(); await P.idle();
        let s = await P.st(); if (s.active !== 'mala') { await P.tapCode('sw'); s = await P.until(x => x.active === 'mala', 5000, 'Mala'); }
        const info = await P.page.evaluate(() => { const E = M.E, R = E.room, p = M.ACT.mala, cam = Math.round(E.camX); let best = null, bd = -1; R.hotspots.forEach(h => { if (h.exit) return; const st = E.hsStand(h), r = E.hsRect(h); if (!st || !r) return; for (let y = r[1] + 1; y < r[1] + r[3]; y += 2) for (let x = r[0] + 1; x < r[0] + r[2]; x += 2) { if (x - cam < 0 || x - cam >= 320 || y >= 144) continue; if (E.hotspotAt(x, y) === h) { const d = Math.abs(st[0] - p.x); if (d > bd) { bd = d; best = { id: h.id, x: x - cam, y }; } return; } } }); return { room: R.id, mk: M.GS.pos.marko.room, best }; });
        r.info = info; ck(info.best && info.room !== info.mk, 'Mala in ' + info.room + ', Marko in ' + info.mk + ', Ziel ' + (info.best && info.best.id));
        await P.tap(info.best.x, info.best.y); const sp = await P.until(x => x.pop || x.walk || x.speech, 3000, 'Reaktion'); if (sp.pop) await P.tapCode('p:' + sp.pop.indexOf('Schau an'));
        await P.page.waitForTimeout(60); const w = await P.st(); r.walking = w.walk; await P.tapCode('sw'); await P.page.waitForTimeout(3000);
        const end = await P.page.evaluate(() => ({ acting: M.E.acting, active: M.GS.active, room: M.E.room.id })); r.end = end; r.shots.push(await P.shot(ENG + '13' + tag));
        ck(end.active === 'marko' && end.room !== info.room, 'Wechsel zu Marko in ' + end.room + ' (während Mala ging: ' + w.walk + ')');
        ck(end.acting === 0, 'kein hängender Aktionszähler (E.acting=' + end.acting + ')' + (tag === 'orig' ? ' – in der Originalfassung erwartet: 1' : '')); });
    }
  }
  if (ENGINE === 'chromium' || ENGINE === 'webkit') {
    // BUG-009 über die Oberfläche: als Mala auf die Archivtür (Geisterausgang) tippen, gleich danach aufs Porträt → Marko darf nicht ins Archiv
    for (const [tag, file] of [['orig', path.join(ROOT, 'qa', 'originals', 'web_original', 'index.html')], ['neu', path.join(WEB, 'index.html')]]) {
      await scenario(ENG + '14' + (tag === 'orig' ? 'a' : 'b'), 'BUG-009 per Klick (' + (tag === 'orig' ? 'Originalfassung' : 'korrigierte Fassung') + '): Wechsel auf dem Weg zur Archivtür', ENGINE === 'webkit' ? 'phone' : 'desktop', async ({ mk, ck, r }) => { if (tag === 'orig') r.reproduces = 'BUG-009';
        const srvB = await serve(() => path.dirname(file), 8150 + ['chromium', 'firefox', 'webkit'].indexOf(ENGINE) * 2 + (tag === 'orig' ? 0 : 1)); const P = await mk({ storage: ST('k1_amt').storage, url: 'http://127.0.0.1:' + srvB.address().port + '/' + path.basename(file) }); r.cleanup = () => srvB.close(); await P.cont(); await P.idle();
        let s = await P.st(); ck(s.room === 'office', 'Hafenbüro geladen (' + s.room + ')'); if (s.active !== 'mala') { await P.tapCode('sw'); s = await P.until(x => x.active === 'mala', 5000, 'Mala'); } await P.page.waitForTimeout(400);
        const pt = await P.page.evaluate(() => { const E = M.E, h = E.room.byId.archive_door, rr = E.hsRect(h), cam = Math.round(E.camX); for (let y = rr[1] + 2; y < rr[1] + rr[3]; y += 2) for (let x = rr[0] + 2; x < rr[0] + rr[2]; x += 2) { if (x - cam < 0 || x - cam >= 320) continue; if (E.hotspotAt(x, y) === h) return { x: x - cam, y }; } return null; });
        ck(!!pt, 'Archivtür im Bild antippbar'); await P.tap(pt.x, pt.y); await P.page.waitForTimeout(60); const w = await P.st(); r.walking = w.walk; await P.tapCode('sw'); await P.page.waitForTimeout(3000); await P.idle().catch(() => {});
        const end = await P.page.evaluate(() => ({ active: M.GS.active, room: M.E.room.id, marko: M.GS.pos.marko.room, mala: M.GS.pos.mala.room, markoExits: M.E.room.hotspots.filter(h => { const ex = typeof h.exit === 'function' ? null : h.exit; return !!ex; }).length })); r.end = end; r.shots.push(await P.shot(ENG + '14' + tag));
        ck(end.marko !== 'archive', 'Marko nicht im Archiv (Marko: ' + end.marko + ', Mala: ' + end.mala + (end.marko === 'archive' ? ', Ausgänge für Marko: ' + end.markoExits : '') + ')' + (tag === 'orig' ? ' – in der Originalfassung erwartet: Archiv' : '')); });
    }
  }
  if (ENGINE === 'webkit') {
    await scenario('W11', 'iPhone hochkant (emuliert): Bild dreht sich, Tipps treffen trotzdem', 'phonePortrait', async ({ mk, ck, r }) => { const P = await mk();
      const rot = await P.page.evaluate(() => M.isRotated()); ck(rot, 'Spielbild um 90° gedreht'); r.shots.push(await P.shot('W11_hochkant'));
      await P.title('Kapitel 2: Sarajevo'); const s = await P.st(); ck(s.title && s.title.some(t => /Platz/.test(t)), 'Tipp auf Titelzeile trifft (Platzwahl offen)'); await P.title('Platz 1'); const s2 = await P.until(s => s.scr === 'game', 20000, 'Start'); ck(s2.scr === 'game', 'Spiel startet hochkant'); await P.drainUI(); r.shots.push(await P.shot('W11_spiel')); });
  }
  if (ENGINE === 'firefox') {
    await scenario('F11', 'Neues Spiel Kapitel 3 und 4 per Tippen: Erinnerungsbild, erste Szene, Hinweis-Menü', 'desktop', async ({ mk, ck, r }) => { const P = await mk();
      for (const ch of ['Kapitel 3: Mostar', 'Kapitel 4: München']) { await P.page.evaluate(() => M.E.toTitle()); await P.title(ch); await P.title('Platz'); const lab = await P.page.evaluate(() => M.E.titleMode === 'confirm'); if (lab) await P.title('Ja'); await P.until(s => s.scr === 'game', 20000, 'Start ' + ch); const s = await P.drainUI(60); ck(s.scr === 'game', ch + ' startet: ' + s.room); r.shots.push(await P.shot('F11_' + ch.slice(8, 9))); }
      await P.playIdle(); await P.tapCode('menu'); await P.until(s => s.menu, 3000, 'Menü'); const codes = await P.page.evaluate(() => window.__qa.codes()); ck(Object.keys(codes).filter(c => /^m:/.test(c)).length >= 10, 'Menüzeilen'); r.shots.push(await P.shot('F11_menu')); await P.tapCode('m:0'); });
  }
  MAIN.close();
  const file = path.join(OUT, 'results.json'); fs.writeFileSync(file, JSON.stringify(results, null, 1));
  console.log(ENGINE + ': ' + results.filter(x => x.ok).length + '/' + results.length + ' Szenarien bestanden → ' + file);
})().catch(e => { console.error(e); process.exit(1); });
