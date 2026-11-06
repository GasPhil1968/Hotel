// Offline-Start mit Service Worker: Seite über http laden, Offline-Speicher abwarten, Netz trennen, neu laden.
//   node game/tools/offlinetest.js
// Prüft: neue Service-Worker-Version aktiv, Spiel startet ohne Netz, Karten- und Hinweisdaten sind da,
// ein Spielstand mit Hinweisgeschichte und bekannten Orten lädt offline unverändert.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const WEB = path.join(__dirname, '..', '..', 'web');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.txt': 'text/plain' };
const srv = http.createServer((q, r) => { let f = decodeURIComponent(q.url.split('?')[0]); if (f === '/') f = '/index.html'; const p = path.join(WEB, f); if (!p.startsWith(WEB) || !fs.existsSync(p)) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); });
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const want = (fs.readFileSync(path.join(WEB, 'sw.js'), 'utf8').match(/VERSION = '([^']+)'/) || [])[1];
  const browser = await chromium.launch(); const ctx = await browser.newContext(); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  let ok = true; const check = (c, t) => { console.log((c ? 'OK     ' : 'FEHLER ') + t); if (!c) ok = false; };
  await page.goto(url); await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const keys = await page.evaluate(() => caches.keys()); check(keys.indexOf(want) >= 0, 'Offline-Speicher mit neuer Version ' + want + ' angelegt (' + keys.join(', ') + ')');
  // Spielstand mit Hinweisgeschichte und bekannten Orten
  const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'nav', 'k1_40.json'), 'utf8')).GS; fx.hints = { k2_case: { s: 2, n: 2 } }; fx.notes.push('c2_meet');
  await page.evaluate((g) => { localStorage.setItem('mala.save.2', JSON.stringify({ GS: g, at: 1 })); }, fx);
  await ctx.setOffline(true); await page.reload(); await page.waitForTimeout(800);
  const r = await page.evaluate(() => { M.TEST = true; const ok = M.E.loadGame(2); return { ok, k1: (M.HINTS_K1 || []).length, k2: (M.HINTS_K2 || []).length, map: typeof M.openMap, hints: M.GS.hints, known: M.GS.mapKnown, room: M.TA.status().room }; });
  check(r.ok && r.room === 'ledana', 'Ohne Netz neu geladen: Spielstand lädt (' + r.room + ')');
  check(r.k1 > 50 && r.k2 > 40 && r.map === 'function', 'Hinweisdaten (' + r.k1 + ' + ' + r.k2 + ' Themen) und Stadtplan offline vorhanden');
  check(r.hints.k2_case && r.hints.k2_case.s === 2 && r.known.terminal, 'Hinweisgeschichte und bekannte Orte nach dem Offline-Laden erhalten');
  await page.evaluate(() => M.openMap()); await page.waitForTimeout(300); check(await page.evaluate(() => M.TA.status().map), 'Stadtplan öffnet offline');
  // Kapitel 3 (Mostar) offline: Daten da, ein neues Spiel in Mostar startet am Ostbusbahnhof
  const r3 = await page.evaluate(() => ({ k3: (M.HINTS_K3 || []).length, map3: !!M.MAP3_POS, rooms: ['ostbus', 'skela_l', 'zelenika'].every(id => M.ROOMS[id] && M.ART[id]), song: !!(M.SONGS && M.SONGS.k3_skela) }));
  check(r3.k3 > 80 && r3.map3 && r3.rooms && r3.song, 'Kapitel 3 offline vorhanden (' + r3.k3 + ' Hinweisthemen, Stadtplan von Mostar, Räume, Musik)');
  await page.evaluate(() => { if (M.closeMap) M.closeMap(); M.TURBO = 25; M.E.newGame(3); });
  let s3 = null; for (let i = 0; i < 150; i++) { s3 = await page.evaluate(() => { const ov = M.E.overlay; if (ov && ov.kind === 'memory') M.TA.closeOverlay(); return { phase: M.GS.phase, room: M.TA.status().room }; }); if (s3.phase === 'k3_pro' && s3.room === 'ostbus') break; await page.waitForTimeout(200); }
  check(s3 && s3.phase === 'k3_pro' && s3.room === 'ostbus', 'neues Spiel in Mostar startet offline am Ostbusbahnhof (' + (s3 && s3.phase) + ', ' + (s3 && s3.room) + ')');
  // Kapitel 4 (München) offline: Daten da, ein neues Spiel in München startet am ZOB
  const r4 = await page.evaluate(() => ({ k4: (M.HINTS_K4 || []).length, map4: typeof M.paintMap4 === 'function', rooms: ['zob', 'jwohnung', 'gleis11', 'heim214'].every(id => M.ROOMS[id] && M.ART[id]), song: !!(M.SONGS && M.SONGS.k4_gerda) }));
  check(r4.k4 > 40 && r4.map4 && r4.rooms && r4.song, 'Kapitel 4 offline vorhanden (' + r4.k4 + ' Hinweisthemen, Stadtplan von München, Räume, Musik)');
  await page.evaluate(() => { if (M.closeMap) M.closeMap(); M.TURBO = 25; M.E.newGame(4); });
  let s4 = null; for (let i = 0; i < 150; i++) { s4 = await page.evaluate(() => { const ov = M.E.overlay; if (ov && ov.kind === 'memory') M.TA.closeOverlay(); return { phase: M.GS.phase, room: M.TA.status().room }; }); if (s4.phase === 'k4_pro' && s4.room === 'zob') break; await page.waitForTimeout(200); }
  check(s4 && s4.phase === 'k4_pro' && s4.room === 'zob', 'neues Spiel in München startet offline am ZOB (' + (s4 && s4.phase) + ', ' + (s4 && s4.room) + ')');
  check(!errs.length, 'keine JS-Fehler' + (errs.length ? ': ' + errs[0] : ''));
  await browser.close(); srv.close(); console.log(ok ? 'OFFLINETEST OK' : 'OFFLINETEST FEHLER'); process.exit(ok ? 0 : 1);
})();
