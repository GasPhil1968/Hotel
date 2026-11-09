// Baut design/prototype/kapitelwahl/index.html aus src.html: bettet die Spielschrift, die Leseschrift (OFL) und die Szenenbilder ein
// (design/tools/kapitelshots.js erzeugt die Bilder).   node design/tools/buildkapitel.js
'use strict';
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'prototype', 'kapitelwahl'), A = path.join(__dirname, '..', 'assets');
const b64 = (f) => fs.readFileSync(f).toString('base64');
let out = fs.readFileSync(path.join(P, 'src.html'), 'utf8');
out = out.replace('__FONT__', b64(path.join(A, 'MALAPixel.otf')));
const atk = (w, sub) => b64(path.join(A, 'atkinson-hyperlegible-next-' + sub + '-' + w + '-normal.woff2'));
out = out.replace('__ATK400L__', atk(400, 'latin')).replace('__ATK400E__', atk(400, 'latin-ext')).replace('__ATK700L__', atk(700, 'latin')).replace('__ATK700E__', atk(700, 'latin-ext'));
const img = (name, ext) => 'data:image/' + (ext === 'jpg' ? 'jpeg' : 'png') + ';base64,' + b64(path.join(P, 'img', name + '.' + ext));
for (const n of ['title', 'k1_riva', 'k2_kula', 'k3_starimost', 'k4_gleis11', 'k5_neboder']) out = out.split('__IMG_' + n + '__').join(img(n, 'png'));
out = out.split('__IMG_ist__').join(img('ist_foto', 'jpg'));
if (/__[A-Z0-9_]+__/.test(out)) throw new Error('Platzhalter offen: ' + out.match(/__[A-Z0-9_]+__/)[0]);
fs.writeFileSync(path.join(P, 'index.html'), out);
console.log('index.html: ' + (out.length / 1024).toFixed(0) + ' KB');
