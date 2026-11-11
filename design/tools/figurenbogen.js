// Figurenbogen: Figuren in mehreren Posen groß nebeneinander (zum Vergleichen vorher/nachher).
//   node design/tools/figurenbogen.js <ausgabe.png> [figur,figur,…|alle] [--scale 5] [--html pfad] [--anims] [--grid 8] [--lut nacht]
// Ohne Liste: Marko, Mala und eine Auswahl Nebenfiguren aus allen Kapiteln. Je Figur: Seite, vorn, hinten, zwei Gehbilder, Sprechen, links.
// --anims: statt der Figurenreihe die Gehschritte (8) und Leerlaufbilder von Marko.
// --grid N: kompakt, je Figur Seite + vorn + Gehbild in einer Zelle, N Zellen je Zeile (für die ganze Besetzung: Liste „alle“).
// --lut nacht: mit der Nachtfarbtabelle der Räume (so wie Figuren nachts im Spiel aussehen).
'use strict';
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const a = process.argv.slice(2), OUT = a[0]; const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const SC = +opt('--scale', 5), GRID = +opt('--grid', 0), LUT = opt('--lut', '');
const HTML = path.resolve(opt('--html', path.join(__dirname, '..', '..', 'web', 'index.html')));
const LIST = (a[1] && !a[1].startsWith('--')) ? a[1].split(',') : null; const ANIMS = a.includes('--anims');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  const url = await p.evaluate(({ LIST, SC, ANIMS, GRID, LUT }) => {
    let ids = LIST || ['marko', 'mala', 'sanja', 'mladen', 'zdenka', 'dinko', 'nina', 'fikret', 'emina', 'maja', 'dino', 'lena', 'mama', 'gerda'];
    if (ids[0] === 'alle') ids = Object.keys(M.CHARS); ids = ids.filter(id => M.CHARS[id]);
    const A = M.ANIMS, S = M.poseS, F = M.poseF, lut = LUT === 'nacht' && M.TINT && M.TINT.night ? M.TINT.night.a : null;
    let rows;
    if (ANIMS) rows = [['marko', A.walkS.map(q => [q, 'R']).concat(A.idleS.map(q => [q[0], 'R']))], ['marko', A.walkF.map(q => [q, 'F']).concat(A.walkB.map(q => [q, 'B']))]];
    else if (GRID) { rows = []; for (let i = 0; i < ids.length; i += GRID) { const r = []; ids.slice(i, i + GRID).forEach(id => { r.push([S({}), 'R', id], [F({}), 'F', id], [A.walkS[1], 'R', id]); }); rows.push([null, r]); } }
    else rows = ids.map(id => [id, [[S({}), 'R'], [F({}), 'F'], [F({}, 'B'), 'B'], [A.walkS[1], 'R'], [A.walkS[5], 'R'], [A.talkS[2][0], 'R'], [S({}), 'L']]]);
    const cw = GRID ? 30 : 40, chh = 62, cols = Math.max(...rows.map(r => r[1].length));
    const W = cols * cw, H = rows.length * chh, fb = new M.Buf(W, H, M.P.m3);
    rows.forEach((r, ri) => r[1].forEach((q, ci) => { const pose = q[0], f = q[1], id = q[2] || r[0];
      const cell = GRID ? Math.floor(ci / 3) : ci;
      for (let y = ri * chh; y < (ri + 1) * chh; y++) for (let x = ci * cw; x < (ci + 1) * cw; x++) fb.d[y * W + x] = (GRID ? cell % 2 : ((x >> 3) + (y >> 3)) % 2) ? M.P.m3 : M.P.m2;
      try { M.drawPose(fb, ci * cw + Math.floor(cw / 2), ri * chh + 56, pose, f, id, { h: H, lut }); } catch (e) { }
      if (GRID && ci % 3 === 0 && M.text) { try { M.text(fb, id, ci * cw + 1, ri * chh + 1, M.P.s6); } catch (e) { } } }));
    const c = document.createElement('canvas'); c.width = W * SC; c.height = H * SC; const g = c.getContext('2d'); const img = g.createImageData(W, H);
    for (let i = 0; i < W * H; i++) { const rgb = M.RGB[fb.d[i]] || [0, 0, 0]; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
    const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(img, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, W * SC, H * SC);
    return c.toDataURL('image/png'); }, { LIST, SC, ANIMS, GRID, LUT });
  fs.writeFileSync(OUT, Buffer.from(url.split(',')[1], 'base64')); console.log('Figurenbogen', OUT, errs.length ? 'JS-Fehler: ' + errs.join(' | ') : ''); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
