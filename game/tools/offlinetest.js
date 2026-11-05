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
  check(!errs.length, 'keine JS-Fehler' + (errs.length ? ': ' + errs[0] : ''));
  await browser.close(); srv.close(); console.log(ok ? 'OFFLINETEST OK' : 'OFFLINETEST FEHLER'); process.exit(ok ? 0 : 1);
})();
