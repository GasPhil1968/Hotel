// Prüft die Funktionen, die der Trailer bewirbt, an einer Arbeitskopie des Builds:
//   1. Offline: über http://localhost laden, auf „Offline bereit“ warten, Netz abschalten, neu laden, Titelbild vorhanden?
//   2. Speichern/Laden: neues Spiel, Aktion, Seite neu laden, Titel „Weiter“, Stand wieder da?
//   3. Touch: Kontext mit Touch, Antippen per Touchscreen öffnet/bewegt im Spiel
// Aufruf: node verify.js <ordner-mit-index.html> <port>
const { chromium } = require('playwright'); const path = require('path'); const http = require('http'); const fs = require('fs');
const DIR = process.argv[2], PORT = +(process.argv[3] || 8765);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(DIR, p);
  if (!f.startsWith(DIR) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
const out = {};
(async () => {
  await new Promise(res => srv.listen(PORT, '127.0.0.1', res));
  const browser = await chromium.launch();
  // ---------------------------------------------------------------- 1. Offline
  { const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage(); const msgs = [];
    page.on('console', m => msgs.push(m.text()));
    await page.goto(`http://127.0.0.1:${PORT}/index.html`);
    const ready = await page.evaluate(() => new Promise(res => { let done = false; const fin = v => { if (!done) { done = true; res(v); } };
      navigator.serviceWorker.addEventListener('message', e => { if (e.data === 'offline-ready') fin('message'); });
      navigator.serviceWorker.ready.then(reg => { const iv = setInterval(async () => { const keys = await caches.keys(); if (keys.length) { const c = await caches.open(keys[0]); const k = await c.keys(); if (k.length >= 6) { clearInterval(iv); fin('cache:' + k.length); } } }, 300); });
      setTimeout(() => fin('timeout'), 20000); }));
    out.offline_sw = ready;
    await ctx.setOffline(true);
    let ok = false, err = null; try { await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
      ok = await page.evaluate(() => !!(window.M && M.E && document.getElementById('game'))); } catch (e) { err = e.message; }
    // Ein frischer Tab im selben (offline) Kontext: startet das Spiel aus dem Speicher?
    let ok2 = false; try { const p2 = await ctx.newPage(); await p2.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load' }); await p2.waitForTimeout(1500); ok2 = await p2.evaluate(() => !!(window.M && M.E && M.E.screen)); await p2.screenshot({ path: path.join(path.dirname(DIR), 'verify_offline.png') }); } catch (e) { err = (err || '') + ' | ' + e.message; }
    out.offline_reload = ok; out.offline_newtab = ok2; out.offline_err = err;
    // Gegenprobe: ein Kontext ohne vorheriges Laden kann offline nicht starten
    const ctxB = await browser.newContext(); await ctxB.setOffline(true); const pb = await ctxB.newPage(); let cold = 'unbekannt';
    try { await pb.goto(`http://127.0.0.1:${PORT}/index.html`, { timeout: 8000 }); cold = await pb.evaluate(() => !!window.M) ? 'startet (unerwartet)' : 'leer'; } catch (e) { cold = 'startet nicht (' + e.message.split('\n')[0].slice(0, 60) + ')'; }
    out.offline_cold = cold; await ctxB.close(); await ctx.close(); }
  // ---------------------------------------------------------------- 2. Speichern und Laden (Datei-Fassung wie im ZIP)
  { const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.join(DIR, 'index.html')); await page.waitForTimeout(800);
    await page.evaluate(() => { localStorage.clear(); M.E.setSlot(1); M.E.newGame(); });
    await page.waitForTimeout(1500);
    // wie ein Spieler: Džezva nehmen (Hotspot im Prolog), dann Raum wechseln lässt speichern; hier über die Testschnittstelle
    const before = await page.evaluate(async () => { const s = () => M.TA.status(); for (let i = 0; i < 80 && (s().busy || s().speech || s().card); i++) { M.TA.skip(); await new Promise(r => setTimeout(r, 150)); }
      M.TA.act('take', 'dzezva'); for (let i = 0; i < 80; i++) { await new Promise(r => setTimeout(r, 150)); M.TA.skip(); const st = s(); if (!st.busy && !st.speech && !st.acting && !st.walk) break; }
      M.E.saveGame && M.E.saveGame(); return { inv: M.GS.inv.slice(), room: M.GS.pos.marko.room, keys: Object.keys(localStorage) }; });
    await page.reload(); await page.waitForTimeout(1000);
    const after = await page.evaluate(async () => { const t = M.E.titleMode; const items = (M.E.titleItems ? M.E.titleItems() : null); return { screen: M.E.screen, titleMode: t, hasSave: Object.keys(localStorage).filter(k => /save/.test(k)) }; });
    const loaded = await page.evaluate(async () => { try { M.E.setSlot(1); M.E.loadGame ? M.E.loadGame() : null; } catch (e) { return 'err ' + e.message; } await new Promise(r => setTimeout(r, 1200)); return { inv: M.GS.inv.slice(), room: M.GS.pos.marko.room, screen: M.E.screen }; });
    out.save_before = before; out.save_after_reload = after; out.save_loaded = loaded; out.save_errors = errs.slice(0, 3); await ctx.close(); }
  // ---------------------------------------------------------------- 3. Touch (Emulation, kein echtes Gerät)
  { const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
    await page.goto('file://' + path.join(DIR, 'index.html')); await page.waitForTimeout(800);
    await page.evaluate(() => { localStorage.clear(); M.E.setSlot(1); M.E.newGame(); }); await page.waitForTimeout(1500);
    await page.evaluate(async () => { for (let i = 0; i < 80; i++) { const st = M.TA.status(); if (!st.busy && !st.speech && !st.card) break; M.TA.skip(); await new Promise(r => setTimeout(r, 150)); } });
    const box = await page.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const x0 = await page.evaluate(() => Math.round(M.E.room ? (M.GS.pos.marko.x) : -1));
    // auf den Boden links tippen (Spielkoordinate 60,128)
    await page.touchscreen.tap(box.x + box.w * (60 / 320), box.y + box.h * (128 / 200)); await page.waitForTimeout(2500);
    const x1 = await page.evaluate(() => Math.round(M.GS.pos.marko.x));
    out.touch = { canvas: box, xBefore: x0, xAfter: x1, moved: Math.abs(x1 - x0) > 4 }; await ctx.close(); }
  await browser.close(); srv.close();
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
