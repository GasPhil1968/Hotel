// Bildmaterial für die Entwürfe direkt aus dem Spiel (Produktionsdatei im Browser): Titelszene ohne Schrift (ein Bild, in dem nur
// M.text/M.big unterdrückt sind), Szenenbilder ohne Bedienleiste aus regulär erspielten Ständen, Vorschaubilder für Spielstände.
// Keine neuen Grafiken – nur Ausschnitte der vorhandenen Spielgrafik.
//   node design/tools/assets.js  → design/prototype/img/*.png
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..'); const OUT = path.join(ROOT, 'design', 'prototype', 'img'); fs.mkdirSync(OUT, { recursive: true });
const STATES = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa', 'results', 'browser', 'states.json'), 'utf8')).states;
const pw = require('playwright');
const GRAB = function (opt) {   // aktuelles Bild aus dem Framebuffer (indizierte Farben) → PNG-DataURL, optional ohne Text, Ausschnitt, Skalierung
  if (M.pointerMove) M.pointerMove(-80, -80);   /* Fadenkreuz-Zeiger aus dem Bild */
  const t = M.text, b = M.big; if (opt.noText) { M.text = function () {}; M.big = function () {}; }
  let fb; try { fb = M.renderFrame(); } finally { M.text = t; M.big = b; }
  const W = 320, x0 = opt.x || 0, y0 = opt.y || 0, w = opt.w || 320, h = opt.h || 200, s = opt.scale || 1;
  const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'); const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const q = M.RGB[fb.d[(y + y0) * W + x + x0]] || [0, 0, 0]; const i = (y * w + x) * 4; img.data[i] = q[0]; img.data[i + 1] = q[1]; img.data[i + 2] = q[2]; img.data[i + 3] = 255; }
  ctx.putImageData(img, 0, 0); if (s === 1) return c.toDataURL('image/png');
  const c2 = document.createElement('canvas'); c2.width = Math.round(w * s); c2.height = Math.round(h * s); const k = c2.getContext('2d'); k.imageSmoothingEnabled = s >= 1 ? false : true; k.drawImage(c, 0, 0, c2.width, c2.height); return c2.toDataURL('image/png');
};
const save = (name, dataUrl) => { fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64')); console.log('  ' + name); };
(async () => {
  const b = await pw.chromium.launch(); const url = 'file://' + path.join(ROOT, 'web', 'index.html');
  const page0 = async (storage) => { const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); if (storage) await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__i')) { sessionStorage.setItem('__i', '1'); localStorage.clear(); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } }, storage); const p = await ctx.newPage(); await p.goto(url); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); return p; };
  // Titel: einige Sekunden laufen lassen (Fähre, Schimmer), dann ohne Schrift greifen
  let p = await page0(); await p.waitForTimeout(6000);
  save('title_clean.png', await p.evaluate(GRAB, { noText: true })); save('title_clean_scene.png', await p.evaluate(GRAB, { noText: true, h: 144 }));
  save('title_original.png', await p.evaluate(GRAB, {}));
  await p.context().close();
  // Szenen aus erspielten Ständen (Fortsetzen → Platz 1), Bedienleiste abgeschnitten
  const tapT = async (p, lab) => { const c = await p.evaluate((lab) => { M.renderFrame(); const L = M.titleLabels(); const i = L.findIndex(t => t.indexOf(lab) >= 0); for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 2) if (M.uiHit(x, y) === 't:' + i) { const r = document.getElementById('game').getBoundingClientRect(); return [r.left + (x + .5) / 320 * r.width, r.top + (y + .5) / 200 * r.height]; } return null; }, lab); if (c) { await p.mouse.click(c[0], c[1]); await p.waitForTimeout(250); } };
  const scenes = [['k1_start', 'flat'], ['k1_amt', 'office'], ['k1_ivka', 'k1_riva'], ['k2_start', 'busbahnhof'], ['k2_limbo', 'vratnik'], ['k3_start', 'mostar'], ['k3_peil', 'k3_peil'], ['k4_silvester', 'muenchen'], ['k4_heim', 'heim']];
  for (const [st, name] of scenes) { const S = STATES.find(s => s.name === st); if (!S) continue; p = await page0(S.storage); await p.evaluate(() => { M.TURBO = 20; });
    await tapT(p, 'Fortsetzen'); await tapT(p, 'Platz 1'); await p.waitForTimeout(2500);
    for (let i = 0; i < 40; i++) { const s = await p.evaluate(() => ({ scr: M.E.screen, busy: M.E.busy, sp: !!M.E.speech, ov: !!M.E.overlay, dlg: !!M.E.dlg })); if (s.scr === 'game' && !s.busy && !s.sp && !s.ov && !s.dlg) break; if (s.scr === 'card' || s.ov) await p.mouse.click(640, 300); await p.waitForTimeout(250); }
    save('scene_' + name + '.png', await p.evaluate(GRAB, { h: 144 })); save('thumb_' + name + '.png', await p.evaluate(GRAB, { h: 144, scale: 0.5 }));
    if (name === 'mostar' || name === 'vratnik' || name === 'muenchen') { const can = await p.evaluate(() => M.E.canSwitch && M.E.canSwitch()); if (can) { await p.evaluate(() => { M.TURBO = 1; M.E.switchChar(); }); await p.waitForTimeout(900); save('scene_' + name + '_mala.png', await p.evaluate(GRAB, { h: 144 })); } }
    await p.context().close(); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
