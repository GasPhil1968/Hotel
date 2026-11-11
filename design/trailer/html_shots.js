// Bilder der HTML-Schicht des Spiels (Menüs, Kapitelwahl, Aktionsleiste für Finger), die das Canvas nicht enthält.
// Fenster 1600 × 1000: das Spielbild steht dann genau fünffach (wie die Canvas-Aufnahmen), die Menüs in ihrer echten Größe dazu.
//   node design/trailer/html_shots.js <ausgabeordner>
'use strict';
const path = require('path'), fs = require('fs'); const { chromium, devices } = require('playwright'); const R = require('./rec_lib');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const HTML = path.join(R.ROOT, 'web', 'index.html');
async function page(opts) { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const ctx = await b.newContext(Object.assign({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 }, opts || {}));
  const p = await ctx.newPage(); p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); return { b, ctx, p }; }
(async () => {
  // 1 · Kapitelwahl „Die Reise“: neuer Spieler (nur Kapitel 1 offen) und nach vier Kapiteln
  for (const [tag, done] of [['neu', []], ['vier', [1, 2, 3, 4]]]) {
    const { b, ctx, p } = await page();
    await ctx.addInitScript((done) => { if (sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i', '1'); localStorage.clear(); done.forEach(n => localStorage.setItem('mala.c' + n + 'end', JSON.stringify({ at: Date.now() - 86400000 * (6 - n) }))); }, done);
    await p.goto('file://' + HTML); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); await p.waitForTimeout(800);
    await p.click('text=Kapitel wählen'); await p.waitForTimeout(900); await p.screenshot({ path: path.join(OUT, 'kapitel_' + tag + '.png') });
    console.log('Kapitelwahl', tag, p.errs.length ? p.errs.join(' | ') : 'ok'); await b.close(); }
  // 2 · Pause: Speichern, Laden, Hinweise, „Automatisch gespeichert … ✓“ (Kapitel 3, Ankunft)
  { const { b, p } = await page(); await p.goto('file://' + HTML); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
    await R.loadState(p, 'qa/regress/fixtures/k3x_ankunft.json', "G.pos.marko={room:'ostbus',x:150,y:116,f:'R'}; G.pos.mala={room:'ostbus',x:128,y:114,f:'R'};");
    await p.evaluate(() => { M.API.save(); }); await p.waitForTimeout(1500);
    await p.mouse.move(305 * 5 + 2, 151 * 5 + 2); await p.waitForTimeout(200); await p.mouse.click(305 * 5 + 2, 151 * 5 + 2); await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(OUT, 'pause.png') }); console.log('Pause', p.errs.length ? p.errs.join(' | ') : 'ok'); await b.close(); }
  // 3 · Finger: ein Tipp auf ein Ding öffnet die Aktionsleiste mit großen Knöpfen (Touch-Bedienung, Emulation in Chromium)
  { const { b, p } = await page({ hasTouch: true, isMobile: false }); await p.goto('file://' + HTML); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
    await R.loadState(p, 'qa/regress/fixtures/k3x_ankunft.json', "G.pos.marko={room:'ostbus',x:240,y:120,f:'R'}; G.pos.mala={room:'ostbus',x:218,y:118,f:'R'};");
    const q = await p.evaluate(() => { const E = M.E, h = E.room.byId.board; const r = E.hsRect(h), cam = Math.round(E.camX); return [r[0] + r[2] / 2 - cam, r[1] + r[3] / 2]; });
    await p.touchscreen.tap(q[0] * 5, q[1] * 5); await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(OUT, 'touch.png') }); console.log('Touch', JSON.stringify(q), p.errs.length ? p.errs.join(' | ') : 'ok'); await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
