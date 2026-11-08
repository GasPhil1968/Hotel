// Vergleicht den Leistenbereich (Zeilen 144–199) zweier Fassungen im selben Spielzustand auf Desktop und Tablet – Nachweis, dass die
// gewohnte Leiste pixelgleich bleibt (UI-Konzept F22).   node qa/ui/hudcmp.js <alt/index.html> [neu/index.html]
const pw = require('playwright'), crypto = require('crypto'), fs = require('fs'), path = require('path');
const STATES = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'results', 'browser', 'states.json'), 'utf8')).states;
async function hudHash(b, html, st, dev) { const ctx = await b.newContext(dev); const S = STATES.find(s => s.name === st).storage;
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__i')) { sessionStorage.setItem('__i', '1'); localStorage.clear(); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } }, S);
  const p = await ctx.newPage(); await p.goto('file://' + html); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  const r = await p.evaluate(async () => { M.TURBO = 20; M.E.loadGame(1); for (let i = 0; i < 400; i++) { await new Promise(r => setTimeout(r, 25)); const E = M.E; if (E.screen === 'card') E.closeCard(); if (E.speech) E.endSpeech(); if (E.screen === 'game' && !E.busy && !E.speech && !E.dlg && !E.overlay) break; }
    M.TURBO = 1; M.E.invNew = null; M.pointerMove(-80, -80); const g = M.E.gt(); const ph = (g + 900) % 4300; if (ph < 200) M.E.gtAdd(300); M.E.paused(true);
    const fb = M.renderFrame(); return Array.from(fb.d.slice(144 * 320, 200 * 320)); });
  await ctx.close(); return crypto.createHash('sha1').update(Buffer.from(r)).digest('hex').slice(0, 16); }
(async () => { const b = await pw.chromium.launch(); const OLD = path.resolve(process.argv[2]), NEW = path.resolve(process.argv[3] || path.join(__dirname, '..', '..', 'web', 'index.html')); let diff = 0;
  for (const st of ['k1_start', 'k2_limbo', 'k3_bato', 'k4_heim']) for (const [dn, dev] of [['desktop', { viewport: { width: 1280, height: 800 } }], ['tablet', { viewport: { width: 1080, height: 810 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }]]) {
    const a = await hudHash(b, OLD, st, dev), c = await hudHash(b, NEW, st, dev);
    if (a !== c) diff++; console.log((a === c ? 'gleich   ' : 'ANDERS   ') + st + ' ' + dn + '  ' + a + ' / ' + c); }
  await b.close(); process.exitCode = diff ? 1 : 0; })();
