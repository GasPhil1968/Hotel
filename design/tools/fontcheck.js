// Prüft, ob die Leseschrift (Atkinson Hyperlegible Next, Untermengen latin + latin-ext, Schnitte 400 und 700) jedes Zeichen
// enthält, das in den Spieltexten (alle .js unter game/src/, auch rooms/ und lang/) und im Entwurf vorkommt. Fehlende Zeichen kommen
// über die Schriftenfolge aus „MALA Pixel“ (design/assets/MALAPixel.otf) – auch das wird geprüft.
//   FONTSOURCE=<pfad>/node_modules/@fontsource/atkinson-hyperlegible-next OPENTYPE=<pfad>/node_modules/opentype.js node design/tools/fontcheck.js
// (opentype.js@1.3.4 liest kein woff2; geprüft werden die woff-Dateien desselben Pakets und derselben Untermengen wie die eingebetteten woff2.)
'use strict';
const fs = require('fs'), path = require('path');
const opentype = require(process.env.OPENTYPE || 'opentype.js');
const FS = process.env.FONTSOURCE; if (!FS) { console.error('FONTSOURCE nicht gesetzt'); process.exit(2); }
const ROOT = path.join(__dirname, '..', '..');
const load = (f) => { const b = fs.readFileSync(f); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const has = (font, cp) => { const g = font.charToGlyph(String.fromCodePoint(cp)); return !!(g && g.index > 0); };
// Zeichen aus Zeichenketten-Literalen der Spielquellen (grob: alles zwischen Anführungszeichen) und aus dem Entwurf
const chars = new Map();
const add = (s, where) => { for (const ch of s) { const cp = ch.codePointAt(0); if (cp < 0x20 || (cp >= 0x7f && cp < 0xa0)) continue; const e = chars.get(cp) || { n: 0, where: new Set() }; e.n++; e.where.add(where); chars.set(cp, e); } };
const SRC = path.join(ROOT, 'game', 'src');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []);
const files = walk(SRC).map(f => path.relative(SRC, f)).sort(); console.log('Quellen: ' + files.length + ' Dateien unter game/src/ (mit rooms/, lang/, portraits/)');
for (const f of files) {
  const t = fs.readFileSync(path.join(SRC, f), 'utf8'); const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g; let m;
  while ((m = re.exec(t))) add((m[1] !== undefined ? m[1] : m[2]).replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\(.)/g, '$1'), f);
}
const game = new Map(chars); chars.clear();
// Entwurf nur zur Information: Bedienzeichen, die dort aus der Systemschrift kommen (bei der Umsetzung als Glyphen ergänzen)
const proto = fs.readFileSync(path.join(ROOT, 'design', 'prototype', 'src.html'), 'utf8').replace(/<style>[\s\S]*?<\/style>/g, '');
add(proto, 'prototype/src.html'); const draft = new Map(chars);
const subsets = ['latin', 'latin-ext'], weights = [400, 700];
const fonts = {}; for (const w of weights) fonts[w] = subsets.map(s => load(path.join(FS, 'files', 'atkinson-hyperlegible-next-' + s + '-' + w + '-normal.woff')));
const pix = load(path.join(ROOT, 'design', 'assets', 'MALAPixel.otf'));
const inAtk = (w, cp) => fonts[w].some(f => has(f, cp));
const fmt = (map) => (cp) => { const e = map.get(cp); return 'U+' + cp.toString(16).toUpperCase().padStart(4, '0') + ' ' + JSON.stringify(String.fromCodePoint(cp)) + ' ×' + e.n + ' (' + [...e.where].slice(0, 3).join(', ') + (e.where.size > 3 ? ', …' : '') + ')'; };
const sorted = (map) => [...map.keys()].sort((a, b) => a - b);
const nonAscii = sorted(game).filter(cp => cp > 0x7e);
console.log('Spieltexte: ' + game.size + ' verschiedene Zeichen, davon ' + nonAscii.length + ' außerhalb ASCII:');
console.log('  ' + nonAscii.map(cp => String.fromCodePoint(cp)).join(' '));
const letters = (cp) => /\p{L}/u.test(String.fromCodePoint(cp));
let fail = 0;
for (const w of weights) { const miss = sorted(game).filter(cp => !inAtk(w, cp)); const missL = miss.filter(letters);
  console.log('Atkinson Hyperlegible Next ' + w + ': ' + (miss.length ? miss.length + ' fehlen, davon Buchstaben: ' + (missL.length ? missL.map(cp => String.fromCodePoint(cp)).join(' ') : 'keine') + '\n    ' + miss.map(fmt(game)).join('\n    ') : 'alle enthalten')); }
const nowhere = sorted(game).filter(cp => !inAtk(400, cp) && !has(pix, cp)); fail += nowhere.length;
console.log('Spieltexte, weder in der Leseschrift noch in MALA Pixel: ' + (nowhere.length ? nowhere.map(fmt(game)).join(', ') : 'keine'));
const must = 'ÄÖÜäöüßČčĆćŠšŽžĐđ„“‚‘…–'; const bad = [...must].filter(ch => weights.some(w => !inAtk(w, ch.codePointAt(0)))); fail += bad.length;
console.log('Pflichtzeichen Deutsch/BHS (' + must + '): ' + (bad.length ? 'FEHLEN ' + bad.join(' ') : 'alle enthalten'));
const sys = sorted(draft).filter(cp => !inAtk(400, cp) && !has(pix, cp));
console.log('Nur Information – im Entwurf aus der Systemschrift: ' + (sys.length ? sys.map(fmt(draft)).join(', ') : 'keine'));
process.exit(fail ? 1 : 0);
