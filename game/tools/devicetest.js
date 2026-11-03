// Gerätetest: iPad im Querformat mit Touch, Offline-Betrieb (Service Worker) und Bildzeit je Raum.
// node game/tools/devicetest.js [web-ordner]      Standard: ../../web (vorher node game/build.js)
// Die Bildzeit wird in Chromium mit vierfach gedrosselter CPU gemessen. Das ist eine Näherung, kein echtes iPad.
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'web'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8' };
const srv = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
let pass = 0, fail = 0; const ok = (c, w) => { console.log((c ? '  ok   ' : '  FEHL ') + w); if (c) pass++; else fail++; };
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch();
  const devName = ['iPad (gen 7) landscape', 'iPad Pro 11 landscape', 'iPad Mini landscape'].find(n => devices[n]);
  const dev = devName ? devices[devName] : { viewport: { width: 1080, height: 810 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
  console.log('Gerät: ' + (devName || 'eigenes iPad-Profil') + ', ' + dev.viewport.width + '×' + dev.viewport.height + ', Touch ' + !!dev.hasTouch);
  const ctx = await b.newContext({ ...dev });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(base + 'index.html');
  await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });

  console.log('Offline-Speicher');
  const sw = await p.evaluate(async () => { if (!navigator.serviceWorker) return null; const r = await navigator.serviceWorker.ready;
    for (let i = 0; i < 150; i++) { const ks = await caches.keys(); if (ks.length) { const c = await caches.open(ks[0]); const k = await c.keys(); if (k.length >= 6) return { active: !!r.active, n: k.length, name: ks[0] }; } await new Promise(z => setTimeout(z, 200)); }
    return { active: !!r.active, n: 0 }; });
  ok(sw && sw.active && sw.n >= 6, 'Service Worker aktiv, ' + (sw ? sw.n + ' Dateien im Speicher „' + sw.name + '“' : 'nicht verfügbar'));

  console.log('Darstellung');
  const rect = () => p.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; });
  const L0 = await rect();
  ok(L0.l >= -0.5 && L0.t >= -0.5 && L0.l + L0.w <= L0.vw + 0.5 && L0.t + L0.h <= L0.vh + 0.5, `Spielbild passt ganz auf den Bildschirm (${Math.round(L0.w)}×${Math.round(L0.h)} in ${L0.vw}×${L0.vh})`);
  ok(Math.abs(L0.w / L0.h - 1.6) < 0.02, 'Seitenverhältnis 320:200 bleibt');
  ok(L0.w / L0.vw > 0.8, 'Spielbild nutzt die Breite (' + Math.round(100 * L0.w / L0.vw) + ' %)');

  console.log('Touch');
  const tapL = async (x, y) => { const r = await rect(); await p.touchscreen.tap(r.l + (x + 0.5) / 320 * r.w, r.t + (y + 0.5) / 200 * r.h); await p.waitForTimeout(260); };
  const uiMap = () => p.evaluate(() => { const m = {}; for (let y = 0; y < 200; y++) for (let x = 0; x < 320; x += 2) { const u = M.uiHit(x, y); if (u) { const e = m[u] || (m[u] = { n: 0, x: 0, y: 0 }); e.n++; e.x += x; e.y += y; } }
    for (const k in m) m[k] = [Math.round(m[k].x / m[k].n), Math.round(m[k].y / m[k].n)]; return m; });
  const tapTitle = async (label) => { const Ls = await p.evaluate(() => M.titleLabels()); const i = Ls.findIndex(t => t.indexOf(label) >= 0);
    if (i < 0) throw new Error('Titelzeile fehlt: ' + label + ' | ' + Ls.join(' | ')); const m = await uiMap(); const c = m['t:' + i]; if (!c) throw new Error('Zeile nicht antippbar: ' + label); await tapL(c[0], c[1]); };
  const st = () => p.evaluate(() => ({ screen: M.E.screen, mode: M.E.titleMode, room: M.E.room && M.E.room.id, phase: M.GS && M.GS.phase, busy: !!M.E.busy, speech: !!M.E.speech, dlg: !!M.E.dlg, overlay: M.E.overlay && M.E.overlay.kind, card: !!M.E.card, pop: !!M.E.pop }));
  await tapL(160, 100); // erste Berührung schaltet den Ton frei
  await tapTitle('Neues Spiel'); ok((await st()).mode === 'chapter', 'Tippen auf „Neues Spiel“ öffnet die Kapitelwahl');
  await tapTitle('Kapitel 2'); ok((await st()).mode === 'unlock', 'Kapitel 2 ohne Split-Ende: Rückfrage erscheint');
  await tapTitle('Ja, in Sarajevo'); ok((await st()).mode === 'slots', 'Rückfrage bestätigt: Speicherplätze');
  await tapTitle('1'); await p.waitForTimeout(600);
  let s = await st(); if (s.screen === 'title' && s.mode === 'confirm') { await tapTitle('Ja'); await p.waitForTimeout(600); s = await st(); }
  ok(s.screen !== 'title', 'Kapitel 2 beginnt nach Tippen (' + s.screen + ')');
  for (let i = 0; i < 200; i++) { s = await st(); if (s.screen === 'game' && !s.busy && !s.overlay && !s.dlg && !s.speech) break; if (s.dlg) { const m = await uiMap(); const c = m['c:0']; if (c) await tapL(c[0], c[1]); else await p.waitForTimeout(300); } else await tapL(160, 60); }
  ok(s.screen === 'game' && s.room === 'stanica' && !s.busy, 'Einleitung per Tippen durchgeklickt, Spieler steht im Busbahnhof');
  // ein sichtbarer Gegenstand im aktuellen Bildausschnitt (der Kiosk am Busbahnhof)
  const tap = await p.evaluate(() => { const r = M.spot('stanica', 'kiosk'), cx = Math.round(M.E.camX); return r ? [r[0] + r[2] / 2 - cx, r[1] + r[3] / 2] : null; });
  ok(!!tap && tap[0] >= 0 && tap[0] < 320, 'Kiosk im Bild');
  if (tap) { await tapL(tap[0], tap[1]); s = await st();
    ok(s.pop, 'Tippen auf den Kiosk öffnet das Verbmenü');
    const opts = await p.evaluate(() => M.E.pop ? M.E.pop.opts.map(o => o.v) : []); const li = opts.indexOf('look');
    if (li >= 0) { const m = await uiMap(); const c = m['p:' + li]; if (c) await tapL(c[0], c[1]); for (let i = 0; i < 30; i++) { s = await st(); if (s.speech) break; await p.waitForTimeout(150); } }
    ok(s.speech, 'Verb „Ansehen“ per Tippen: Marko spricht'); }
  for (let i = 0; i < 40; i++) { s = await st(); if (!s.busy && !s.speech) break; await tapL(160, 60); }
  const inv = await uiMap(); ok(!!inv['i:0'], 'Inventarleiste antippbar'); ok(!!inv['menu'] || Object.keys(inv).some(k => /menu/.test(k)), 'Menüknopf antippbar');
  const saved = await p.evaluate(() => { M.E.saveGame && M.E.saveGame(); return !!localStorage.getItem('mala.save1') || Object.keys(localStorage).some(k => /save/.test(k)); });
  ok(saved, 'Spielstand im Gerät gespeichert');

  console.log('Ohne Netz');
  await ctx.setOffline(true); srv.close();
  await p.reload(); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 }).catch(() => {});
  const off = await p.evaluate(() => ({ ok: !!(window.M && M.ROOMS && Object.keys(M.ROOMS).length > 30), save: M.E && M.E.hasSave ? M.E.hasSave(1) : null }));
  ok(off.ok, 'Seite lädt offline aus dem Speicher (' + (off.ok ? 'alle Räume da' : 'fehlt') + ')');
  ok(off.save === true, 'Spielstand ist nach dem Neuladen noch da');

  console.log('Bildzeit (Chromium, CPU vierfach gedrosselt)');
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const ROOMS = [['stanica', 'k2_pro'], ['tramvaj', 'k2_pro'], ['carsija', 'k2_pro'], ['kula', 'k2_s1_n'], ['kafana', 'k2_s1'], ['kazandziluk', 'k2_s1'], ['pansion', 'k2_s2'], ['ferhadija', 'k2_s2_n'],
    ['antikvarijat', 'k2_s2'], ['obala', 'k2_s2_n'], ['vijecnica', 'k2_s2_n'], ['neboder', 'k2_fin_n'], ['haustor', 'k2_s3'], ['skloniste', 'k2_s3_n'], ['stan', 'k2_fin'], ['vratnik', 'k2_i'], ['kuca', 'k2_fin'], ['map', 'k2_fin'],
    ['riva', 'c1_night'], ['palma', 'pro']];
  const rows = [];
  for (const [room, phase] of ROOMS) {
    const r = await p.evaluate(async ({ room, phase }) => {
      M.E.overlay = null; M.E.card = null; M.E.speech = null; M.E.dlg = null; M.E.busy = false; M.E.screen = 'game'; M.TEST = true;
      M.setPhase(phase); const G = M.GS; G.malaOn = room !== 'map'; const R = M.ROOMS[room], A = M.ART[room], s0 = (A && A.start) || R.start || [160, 120, 'R'];
      G.pos.marko = { room, x: s0[0], y: s0[1], f: s0[2] || 'R' };
      const t0 = performance.now(); await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: s0[0], y: s0[1], f: s0[2] });
      if (G.malaOn) M.API.malaJoin({ fadeIn: false }); M.E.fade = 0; M.update(16.7); M.renderFrame(); const tEnter = performance.now() - t0; // Raumwechsel samt erstem Bild
      const run = (n) => { const ts = []; for (let i = 0; i < n; i++) { const a = performance.now(); M.update(16.7); M.renderFrame(); ts.push(performance.now() - a); } ts.sort((x, y) => x - y); return { avg: ts.reduce((x, y) => x + y, 0) / n, p95: ts[Math.floor(n * 0.95)] }; };
      run(10); const m = run(90); let g = null;
      if (G.malaOn) { M.E.switchTo('mala', true); run(10); g = run(60); M.E.switchTo('marko', true); }
      return { enter: tEnter, avg: m.avg, p95: m.p95, gavg: g && g.avg, gp95: g && g.p95 }; }, { room, phase });
    rows.push([room, phase, r]);
    console.log(`  ${(room + ' ' + phase).padEnd(24)} Betreten ${r.enter.toFixed(0).padStart(5)} ms · Bild Ø ${r.avg.toFixed(2)} ms (95 % ${r.p95.toFixed(2)})` + (r.gavg != null ? ` · Geistersicht Ø ${r.gavg.toFixed(2)} ms (95 % ${r.gp95.toFixed(2)})` : ''));
  }
  const worst = Math.max(...rows.map(x => Math.max(x[2].p95, x[2].gp95 || 0)));
  ok(worst < 16.7, 'jedes Bild unter 16,7 ms (60 Bilder/s) auch gedrosselt, schlechtester 95-%-Wert ' + worst.toFixed(2) + ' ms');
  ok(!errs.length, 'keine JS-Fehler' + (errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''));
  console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`);
  await b.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ABBRUCH', e); process.exit(2); });
