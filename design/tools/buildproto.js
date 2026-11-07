// Baut design/prototype/index.html aus src.html: bettet die erzeugte Schrift (design/assets/MALAPixel.otf), die Leseschrift
// Atkinson Hyperlegible Next (OFL, design/assets/*.woff2) und die echten Hotspot-Daten (design/prototype/hotspots.json) ein.   node design/tools/buildproto.js
'use strict';
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'prototype');
const src = fs.readFileSync(path.join(P, 'src.html'), 'utf8');
const font = fs.readFileSync(path.join(__dirname, '..', 'assets', 'MALAPixel.otf')).toString('base64');
const hot = fs.readFileSync(path.join(P, 'hotspots.json'), 'utf8');
const A = path.join(__dirname, '..', 'assets'), atk = (w, sub) => fs.readFileSync(path.join(A, 'atkinson-hyperlegible-next-' + sub + '-' + w + '-normal.woff2')).toString('base64');
const out = src.replace('__FONT__', font).replace('__HOTSPOTS__', hot.trim())
  .replace('__ATK400L__', atk(400, 'latin')).replace('__ATK400E__', atk(400, 'latin-ext')).replace('__ATK700L__', atk(700, 'latin')).replace('__ATK700E__', atk(700, 'latin-ext'));
fs.writeFileSync(path.join(P, 'index.html'), out);
console.log('index.html: ' + (out.length / 1024).toFixed(0) + ' KB');
