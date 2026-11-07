// Erzeugt aus der Bitmap-Schrift des Spiels (M.FONT, game/src/00_core.js) eine Webfont „MALA Pixel“ (OpenType/CFF).
// Eine Quelle für Canvas und HTML: dieselben Glyphen, pixelgenau bei 10 px · n (1 Schriftpixel = n CSS-px).
// Nur Build-Werkzeug; opentype.js wird nicht ausgeliefert.
//   OPENTYPE=/pfad/zu/node_modules/opentype.js node design/tools/makefont.js [--out design/assets/MALAPixel.otf]
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const OUT = path.resolve(arg('--out', path.join(ROOT, 'design', 'assets', 'MALAPixel.otf')));
const opentype = require(process.env.OPENTYPE || 'opentype.js');
const { open } = require(path.join(ROOT, 'qa', 'vmdriver'));
(async () => {
  const D = await open({ seed: 1 });
  const FONT = await D.ev(() => JSON.parse(JSON.stringify(M.FONT)));
  const U = 100, BASE = 7;   // 1 Schriftpixel = 100 Einheiten; Grundlinie unter Zeile 6 (Versalhöhe 7)
  const glyphs = [new opentype.Glyph({ name: '.notdef', unicode: undefined, advanceWidth: 500, path: (() => { const p = new opentype.Path(); p.moveTo(50, 0); p.lineTo(50, 700); p.lineTo(450, 700); p.lineTo(450, 0); p.close(); p.moveTo(150, 100); p.lineTo(350, 100); p.lineTo(350, 600); p.lineTo(150, 600); p.close(); return p; })() })];
  let n = 0;
  for (const ch of Object.keys(FONT).sort()) {
    const g = FONT[ch]; const rows = {};
    for (let k = 0; k < g.px.length; k += 2) { const x = g.px[k], y = g.px[k + 1]; (rows[y] = rows[y] || new Set()).add(x); }
    const p = new opentype.Path();
    for (const [ys, set] of Object.entries(rows)) { const y = +ys, xs = Array.from(set).sort((m, q) => m - q); let s = 0;
      while (s < xs.length) { let e = s; while (e + 1 < xs.length && xs[e + 1] === xs[e] + 1) e++;
        const x0 = xs[s] * U, x1 = (xs[e] + 1) * U, yt = (BASE - y) * U, yb = (BASE - y - 1) * U;
        p.moveTo(x0, yb); p.lineTo(x1, yb); p.lineTo(x1, yt); p.lineTo(x0, yt); p.close(); s = e + 1; } }
    const cp = ch.codePointAt(0);
    glyphs.push(new opentype.Glyph({ name: 'u' + cp.toString(16).toUpperCase().padStart(4, '0'), unicode: cp, advanceWidth: (g.w + 1) * U, path: p })); n++;
  }
  const font = new opentype.Font({ familyName: 'MALA Pixel', styleName: 'Regular', unitsPerEm: 1000, ascender: 900, descender: -200, glyphs });
  fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, Buffer.from(font.toArrayBuffer()));
  console.log('MALA Pixel: ' + n + ' Glyphen → ' + path.relative(ROOT, OUT) + ' (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  console.log('Zeichen: ' + Object.keys(FONT).sort().join(''));
})().catch(e => { console.error(e); process.exit(1); });
