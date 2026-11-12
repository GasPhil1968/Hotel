// Musterbild „feinere Pixelart in 640 × 360“ (Vergleich zum Spiel in 320 × 200): die Bar „Bura“ aus Kapitel 1 am Abend,
// Marko und Mala vor dem Tresen, Sanja dahinter, die beiden Alten beim Kartenspiel am Fenster.
// Eigenständig, ändert am Spiel nichts. Gezeichnet wie im Spiel im Code, aber mit doppelter Pixeldichte, einer größeren Palette
// (Rampen mit 8–14 Stufen, Schatten kühler, Lichter wärmer) und wenig Raster (nur schmale Übergänge).
//   node design/tools/hd640_beispiel.js [ausgabeordner]   → bar_640x360.png (nativ), bar_640x360_x3.png (1920 × 1080)
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const OUT = process.argv[2] || path.join(__dirname, '..', 'hd640'); fs.mkdirSync(OUT, { recursive: true });
const W = 640, H = 360;

// ---------------------------------------------------------------- PNG
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc(buf) { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); }
function writePNG(file, w, h, rgb, scale) { scale = scale || 1; const W2 = w * scale, H2 = h * scale, raw = Buffer.alloc((W2 * 3 + 1) * H2);
  for (let y = 0; y < H2; y++) { raw[y * (W2 * 3 + 1)] = 0; for (let x = 0; x < W2; x++) { const si = (((y / scale) | 0) * w + ((x / scale) | 0)) * 3, di = y * (W2 * 3 + 1) + 1 + x * 3; raw[di] = rgb[si]; raw[di + 1] = rgb[si + 1]; raw[di + 2] = rgb[si + 2]; } }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W2, 0); ih.writeUInt32BE(H2, 4); ih[8] = 8; ih[9] = 2;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])); }

// ---------------------------------------------------------------- Farben: Rampen mit Farbverschiebung
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function rgb2hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : (mx === g ? (b - r) / d + 2 : (r - g) / d + 4); h *= 60; } return [h, s, l]; }
function hsl2rgb(h, s, l) { h = (((h % 360) + 360) % 360) / 360; if (s <= 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const f = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [f(p, q, h + 1 / 3), f(p, q, h), f(p, q, h - 1 / 3)].map(v => Math.round(Math.max(0, Math.min(1, v)) * 255)); }
const adiff = (a, b) => ((b - a) % 360 + 540) % 360 - 180;
const RAMPS = [], R = {};
// n Stufen von dunkel nach hell; Schatten drehen zum Blauviolett (sh), Lichter zum Gelb (lh), die Sättigung ist in der Mitte am höchsten
function ramp(name, base, n, o) { o = o || {}; const [h0, s0, l0] = rgb2hsl(...hex(base));
  const lo = o.lo !== undefined ? o.lo : Math.max(0.035, l0 * 0.2), hi = o.hi !== undefined ? o.hi : Math.min(0.95, l0 + (1 - l0) * 0.66);
  const sh = o.sh !== undefined ? o.sh : 252, lh = o.lh !== undefined ? o.lh : 48, ks = o.ks !== undefined ? o.ks : 0.3, kl = o.kl !== undefined ? o.kl : 0.2;
  const cols = []; for (let i = 0; i < n; i++) { const t = i / (n - 1), l = lo + (hi - lo) * Math.pow(t, o.g || 1);
    const h = t < 0.5 ? h0 + adiff(h0, sh) * ks * (1 - t * 2) : h0 + adiff(h0, lh) * kl * (t * 2 - 1);
    const s = Math.min(1, s0 * (o.sat || 1) * (1 - Math.pow(Math.abs(t - 0.55), 1.6) * 0.8)); cols.push(hsl2rgb(h, s, l)); }
  R[name] = RAMPS.length; RAMPS.push({ name, cols, n }); return R[name]; }
// Rampe aus festen Stützfarben (Himmel, Geisterlicht)
function rampList(name, list, n) { const P = list.map(hex), cols = []; for (let i = 0; i < n; i++) { const t = i / (n - 1) * (P.length - 1), k = Math.min(P.length - 2, Math.floor(t)), f = t - k;
    cols.push(P[k].map((v, j) => Math.round(v + (P[k + 1][j] - v) * f))); } R[name] = RAMPS.length; RAMPS.push({ name, cols, n }); return R[name]; }

// Raum
ramp('wall', '#8f6c48', 12, { lo: 0.07, hi: 0.78 }); ramp('woodD', '#5c301c', 12, { lo: 0.04, hi: 0.62 }); ramp('woodM', '#8a5630', 12, { lo: 0.05, hi: 0.74 });
ramp('woodL', '#b4874e', 11, { lo: 0.1, hi: 0.86 }); ramp('ceil', '#3c2418', 10, { lo: 0.03, hi: 0.5 }); ramp('brass', '#b88f2e', 10, { lo: 0.06, hi: 0.92, kl: 0.35 });
ramp('chrome', '#8e96a2', 11, { lo: 0.06, hi: 0.97, sat: 0.6 }); ramp('tileR', '#8a3a2a', 12, { lo: 0.05, hi: 0.7 }); ramp('tileD', '#3e2620', 10, { lo: 0.03, hi: 0.5 }); ramp('tileC', '#b49a78', 12, { lo: 0.08, hi: 0.84, sat: 0.7 });
ramp('green', '#2e6a48', 10, { lo: 0.04, hi: 0.8 }); rampList('bulb', ['#c87a2a', '#f0b850', '#ffe08a', '#fff6d6'], 6);
ramp('glassG', '#2f7a44', 10, { lo: 0.05, hi: 0.86 }); ramp('glassA', '#b0661e', 10, { lo: 0.06, hi: 0.92 }); ramp('glassC', '#9cb4ae', 10, { lo: 0.08, hi: 0.97, sat: 0.5 });
ramp('glassR', '#6e1a2a', 10, { lo: 0.04, hi: 0.72 }); ramp('glassB', '#2a4a7e', 10, { lo: 0.05, hi: 0.8 }); ramp('label', '#d6c49a', 8, { lo: 0.18, hi: 0.95 });
ramp('mirror', '#3e3a44', 10, { lo: 0.04, hi: 0.72, sat: 0.7 }); ramp('gold', '#cc9a34', 10, { lo: 0.1, hi: 0.95, kl: 0.4 });
rampList('sky', ['#141432', '#2c2058', '#5a2e72', '#934a7a', '#d06e72', '#f2a066', '#fbd08a'], 16); ramp('sea', '#283656', 10, { lo: 0.04, hi: 0.62 });
rampList('sil', ['#0e0a18', '#1a1428', '#2a1e38', '#3a2a48'], 6); rampList('lite', ['#b8702c', '#f0b44c', '#ffe08c', '#fff8dc'], 6);
ramp('curtain', '#7c1e2c', 12, { lo: 0.04, hi: 0.66 }); ramp('radiator', '#c4b89c', 10, { lo: 0.1, hi: 0.9, sat: 0.6 }); rampList('frost', ['#2a1e3a', '#5a3e6a', '#9a6e8e', '#d8a8a0', '#f4d8b8'], 10);
ramp('paper', '#e4d8bc', 8, { lo: 0.25, hi: 0.97 }); ramp('ink', '#2a2430', 6, { lo: 0.05, hi: 0.4 }); ramp('cloth', '#e6e2da', 8, { lo: 0.2, hi: 0.98, sat: 0.3 });
ramp('felt', '#2e5a3a', 10, { lo: 0.04, hi: 0.66 }); ramp('red', '#b02a2a', 8, { lo: 0.08, hi: 0.8 });
// Figuren
ramp('skinM', '#b07a56', 12, { lo: 0.07, hi: 0.86, ks: 0.22 }); ramp('skinS', '#d49c7a', 12, { lo: 0.1, hi: 0.92, ks: 0.22 }); ramp('skinG', '#dcb49e', 12, { lo: 0.1, hi: 0.94, ks: 0.22 });
ramp('skinO', '#c08c6c', 12, { lo: 0.08, hi: 0.9, ks: 0.22 });
ramp('stub', '#5a4a4c', 8, { lo: 0.06, hi: 0.56, sat: 0.5 }); ramp('eyeW', '#e8e0dc', 4, { lo: 0.55, hi: 0.95, sat: 0.4 });
ramp('hairM', '#30201a', 10, { lo: 0.03, hi: 0.5 }); ramp('hairS', '#1c1620', 10, { lo: 0.02, hi: 0.42 }); ramp('hairG', '#3c2618', 10, { lo: 0.03, hi: 0.56 });
ramp('hairW', '#b8b4b0', 10, { lo: 0.12, hi: 0.95, sat: 0.4 });
ramp('coat', '#2c3a5a', 12, { lo: 0.03, hi: 0.66 }); ramp('shirt', '#8a8e98', 10, { lo: 0.1, hi: 0.9 }); ramp('trou', '#262834', 10, { lo: 0.02, hi: 0.46 });
ramp('shoeB', '#5c3220', 10, { lo: 0.03, hi: 0.66 }); ramp('denim', '#4a6a9c', 12, { lo: 0.05, hi: 0.84 }); ramp('scarf', '#8a8a92', 10, { lo: 0.08, hi: 0.9, sat: 0.4 });
ramp('jeans', '#2e3e62', 10, { lo: 0.03, hi: 0.66 }); ramp('sneak', '#e6e0d0', 8, { lo: 0.3, hi: 0.98, sat: 0.3 });
ramp('black', '#26222c', 10, { lo: 0.02, hi: 0.5 }); ramp('apron', '#701c28', 10, { lo: 0.04, hi: 0.66 });
ramp('jacketB', '#6a4628', 10, { lo: 0.04, hi: 0.7 }); ramp('jacketG', '#5c6068', 10, { lo: 0.05, hi: 0.78, sat: 0.6 }); ramp('cap', '#4a4a50', 8, { lo: 0.05, hi: 0.66, sat: 0.4 });
rampList('ghost', ['#0c1a30', '#16304e', '#24506e', '#3a7690', '#5ea2b2', '#8ccad0', '#bfe6e8', '#ecfbfb'], 12);

// ---------------------------------------------------------------- Puffer: je Pixel Rampe + Stufe (Kommazahl); am Ende gerastert
const MAT = new Int16Array(W * H).fill(-1), LEV = new Float32Array(W * H), EMI = new Uint8Array(W * H), LIGHT = new Float32Array(W * H);
function put(x, y, r, l, em) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; MAT[i] = r; LEV[i] = l; EMI[i] = em ? 1 : 0; }
function lev(x, y) { return LEV[(y | 0) * W + (x | 0)]; }
function addLev(x, y, d) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; LEV[y * W + x] += d; }
// Formen: Rückruf f(x,y,xa,xb) liefert [rampe, stufe, leuchtend] oder nichts
function rect(x0, y0, w, h, f) { for (let y = Math.max(0, y0); y < Math.min(H, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) { const v = f(x, y, x0, x0 + w - 1); if (v) put(x, y, v[0], v[1], v[2]); } }
function polyScan(pts, cb, h) { let mn = 1e9, mx = -1e9; for (const p of pts) { mn = Math.min(mn, p[1]); mx = Math.max(mx, p[1]); } mn = Math.max(0, Math.floor(mn)); mx = Math.min(h - 1, Math.ceil(mx));
  for (let y = mn; y <= mx; y++) { const yc = y + 0.5, xs = []; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a[1] > yc) !== (b[1] > yc)) xs.push(a[0] + (yc - a[1]) * (b[0] - a[0]) / (b[1] - a[1])); }
    xs.sort((p, q) => p - q); for (let k = 0; k + 1 < xs.length; k += 2) { const xa = Math.ceil(xs[k] - 0.5), xb = Math.floor(xs[k + 1] - 0.5); for (let x = xa; x <= xb; x++) cb(x, y, xa, xb); } } }
function poly(pts, f) { polyScan(pts, (x, y, xa, xb) => { const v = f(x, y, xa, xb); if (v) put(x, y, v[0], v[1], v[2]); }, H); }
function ellipse(cx, cy, rx, ry, f) { for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) { const v = f(x, y, dx, dy); if (v) put(x, y, v[0], v[1], v[2]); } } }
function line(x0, y0, x1, y1, f) { const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))); for (let i = 0; i <= n; i++) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n), v = f(x, y, i / n); if (v) put(x, y, v[0], v[1], v[2]); } }
// Rauschen
function h2(x, y, s) { const n = Math.sin(x * 127.1 + y * 311.7 + (s || 0) * 74.7) * 43758.5453; return n - Math.floor(n); }
function vn(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = h2(xi, yi, s), b = h2(xi + 1, yi, s), c = h2(xi, yi + 1, s), d = h2(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
const fbm = (x, y, s) => vn(x, y, s) * 0.6 + vn(x * 2.1, y * 2.1, (s || 0) + 3) * 0.3 + vn(x * 4.3, y * 4.3, (s || 0) + 7) * 0.1;
const BY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], bay = (x, y) => (BY[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);

// ---------------------------------------------------------------- Licht: drei Pendellampen über dem Tresen, Wandleuchte, Fenster (Dämmerung)
const LAMPS = [[186, 76], [305, 76], [424, 76]], SCONCE = [114, 116];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let L = 0;
  for (const [lx, ly] of LAMPS) { const dx = x - lx, dy = y - ly, d = Math.hypot(dx * 0.9, dy);
    if (dy > -6) { const fall = Math.max(0, 1 - d / 200), cone = dy > 0 ? Math.max(0, 1 - Math.abs(dx) / (dy * 0.62 + 18)) : 0; L += fall * fall * 2.0 + cone * Math.max(0, 1 - dy / 260) * 2.6 + (y > 220 && y < 236 ? cone * 1.4 : 0); }
    L += Math.max(0, 1 - Math.hypot(dx, dy * 1.6) / 46) * 1.8; }
  { const dx = x - SCONCE[0], dy = y - SCONCE[1]; L += Math.max(0, 1 - Math.hypot(dx, dy * 1.3) / 60) * 1.7; }
  // Fensterlicht: ein schräger Streifen auf dem Boden links vor dem Fenster, schwach an der Wand daneben
  if (y > 255) { const t = (y - 255) / 105, xa = 486 - t * 70, xb = 616 - t * 40; if (x > xa && x < xb) L += 0.9 * (1 - t * 0.6) * Math.min(1, (x - xa) / 18, (xb - x) / 18); }
  LIGHT[y * W + x] = L; }
// wie stark eine Rampe auf Licht reagiert (Glas und Metall weniger, matte Wand mehr)
const RESP = new Float32Array(RAMPS.length + 8).fill(1);
['glassG', 'glassA', 'glassC', 'glassR', 'glassB', 'chrome', 'brass', 'gold', 'mirror'].forEach(n => RESP[R[n]] = 0.55); RESP[R.ceil] = 0.7; RESP[R.sky] = 0; RESP[R.sea] = 0; RESP[R.sil] = 0;

// ---------------------------------------------------------------- Raum
// Decke: dunkle Bretter, vorn ein Balken
rect(0, 0, W, 38, (x, y) => { const p = Math.floor((x + (y > 20 ? 0 : 7)) / 26), e = (x + (y > 20 ? 0 : 7)) % 26 === 0; return [R.ceil, 2.4 + fbm(x * 0.03, y * 0.25, p) * 1.6 - (e ? 1.3 : 0) - (y < 6 ? 0.8 : 0)]; });
rect(0, 30, W, 8, (x, y) => [R.woodD, (y === 30 ? 4.6 : (y >= 36 ? 1 : 2.8)) + fbm(x * 0.04, y * 0.5, 9) * 0.9]);
// Wand: Putz oben (fleckig, unter dem Balken im Schatten), Holztäfelung unten
rect(0, 38, W, 116, (x, y) => [R.wall, 3.6 + (fbm(x * 0.025, y * 0.03, 2) - 0.5) * 1.7 - (y < 46 ? (46 - y) * 0.18 : 0) - (fbm(x * 0.2, y * 0.2, 5) > 0.82 ? 0.6 : 0)]);
rect(0, 150, W, 6, (x, y) => [R.woodM, y === 150 ? 6.5 : (y === 155 ? 2 : 4.2)]);
function wainscot(x0, x1) { const pw = 38; for (let x = x0; x < x1; x++) for (let y = 156; y < 256; y++) { const px = (x - x0) % pw, inner = px > 4 && px < pw - 4 && y > 164 && y < 248;
    let l = 2.6 + fbm(x * 0.02, y * 0.4, 11) * 0.9; if (inner) { l = 2.0 + fbm(x * 0.03, y * 0.25, 12) * 0.8; if (px === 5 || y === 165) l -= 0.9; if (px === pw - 5 || y === 247) l += 1.1; } else if (px === 0) l -= 1.2; put(x, y, R.woodD, l); } }
wainscot(0, 128); wainscot(472, W);
// Tür links (Milchglas mit Abendlicht), Wandleuchte, Garderobe
rect(18, 84, 84, 172, (x, y) => { const fr = x < 24 || x > 95 || y < 90; return fr ? [R.woodM, (x < 21 || y < 87) ? 6 : (x > 98 ? 1.8 : 3.8)] : null; });
rect(24, 90, 72, 166, (x, y) => [R.woodD, 3 + fbm(x * 0.03, y * 0.3, 21) * 0.8 + (x === 24 ? 1.4 : 0)]);
rect(32, 100, 56, 70, (x, y) => { const u = (x - 32) / 55, v = (y - 100) / 69; return [R.frost, 2.2 + 4.6 * Math.max(0, 1 - Math.hypot(u - 0.6, v - 0.35) * 1.4) + fbm(x * 0.08, y * 0.08, 4) * 1.1 - (y > 160 ? 0.8 : 0), 1]; });
rect(32, 100, 56, 70, (x, y) => (x === 59 || x === 60 || y === 134) ? [R.woodD, x === 59 || y === 134 ? 4.5 : 2.5] : null);   // Sprossen
[[32, 180, 56, 30], [32, 214, 56, 32]].forEach(([px, py, pw, ph]) => rect(px, py, pw, ph, (x, y) => { let l = 2.6; if (x === px || y === py) l = 1.4; if (x === px + pw - 1 || y === py + ph - 1) l = 4.4; if (x > px + 3 && x < px + pw - 4 && y > py + 3 && y < py + ph - 4) l = 3.0 + fbm(x * 0.04, y * 0.2, 31) * 0.6; return [R.woodD, l]; }));
ellipse(88, 198, 2.6, 2.6, (x, y, dx, dy) => [R.brass, 5 - dx * 2 - dy * 2]); rect(84, 197, 5, 2, (x, y) => [R.brass, y === 197 ? 7 : 4]);
for (let i = 0; i < 4; i++) { const t = ['U', 'L', 'A', 'Z'][i]; }
// Wandleuchte
rect(111, 108, 7, 3, (x, y) => [R.brass, y === 108 ? 7 : 4]); ellipse(114.5, 116, 7, 6, (x, y, dx, dy) => dy < 0.4 ? [R.cloth, 6.2 - dy * 2 + (1 - Math.abs(dx)) * 1.2, 1] : [R.bulb, 3.4, 1]);
// Garderobe mit Hut und Schal
rect(102, 128, 24, 3, (x, y) => [R.woodM, y === 128 ? 6 : 3]); [106, 120].forEach(hx => rect(hx, 131, 2, 4, (x, y) => [R.brass, 5]));
ellipse(119, 136, 6, 2.4, (x, y, dx, dy) => [R.cap, 3.6 - dy]); ellipse(119, 133, 4, 3, (x, y, dx, dy) => dy < 0.2 ? [R.cap, 4.4 - dy * 2 + dx] : null);
poly([[103, 133], [109, 133], [110, 170], [106, 176], [102, 168]], (x, y, xa, xb) => [R.scarf, 3.6 + ((x - xa) / Math.max(1, xb - xa)) * 2 - ((y + x) % 7 === 0 ? 0.8 : 0)]);

// Tresenrückwand: dunkles Holz, Gesims, zwei Regale mit Flaschen, Spiegel mit Schriftzug, Unterschrank
rect(128, 58, 344, 172, (x, y) => [R.woodD, 1.8 + fbm(x * 0.015, y * 0.2, 41) * 0.9]);
rect(124, 52, 352, 8, (x, y) => [R.woodM, y === 52 ? 7.5 : (y === 53 ? 6 : (y > 57 ? 2 : 4.4)) + fbm(x * 0.05, y, 42) * 0.5]);
function shelfUnit(x0, x1) { for (const [a, b] of [[x0, x0 + 4], [x1 - 4, x1]]) rect(a, 60, b - a, 140, (x, y) => [R.woodM, x === a ? 6 : (x === b - 1 ? 2.2 : 4)]);
  for (const sy of [102, 142, 182]) { rect(x0, sy, x1 - x0, 5, (x, y) => [R.woodM, y === sy ? 7.2 : (y === sy + 4 ? 2 : 4.8)]); rect(x0 + 4, sy + 5, x1 - x0 - 8, 3, (x, y) => [R.woodD, 0.6 + (y - sy - 5) * 0.4]); } }
shelfUnit(136, 248); shelfUnit(352, 464);
// Flaschen: Körper mit Schulter, Hals, Kappe, Etikett, Glanzstreifen links und Spitzlicht
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function bottle(x, base, h, w, rm, opt) { opt = opt || {}; const neckH = Math.round(h * (opt.neck || 0.36)), body = h - neckH, nw = Math.max(2, Math.round(w * 0.36));
  for (let y = base - body; y < base; y++) { const sh = y < base - body + 3 ? (base - body + 3 - y) : 0, ww = w - sh * 2 * 0.5; const xa = Math.round(x - ww / 2), xb = Math.round(x + ww / 2) - 1;
    for (let xx = xa; xx <= xb; xx++) { const u = (xx - xa) / Math.max(1, xb - xa); let l = 3.2 + Math.sin(u * Math.PI) * 1.6 - u * 1.2; if (xx === xa + 1 && y < base - 2) l += 2.4; if (xx === xb) l -= 1; put(xx, y, rm, l); } }
  for (let y = base - h; y < base - body; y++) for (let xx = Math.round(x - nw / 2); xx < Math.round(x - nw / 2) + nw; xx++) put(xx, y, rm, 3.4 + (xx === Math.round(x - nw / 2) ? 2.2 : 0));
  const cr = opt.cap === undefined ? R.gold : opt.cap; rect(Math.round(x - nw / 2), base - h - 2, nw, 3, (xx, y) => [cr, y === base - h - 2 ? 6 : 3.6]);
  if (!opt.noLabel) { const ly0 = base - Math.round(body * 0.72), lh = Math.max(3, Math.round(body * 0.38)), lw = Math.max(2, w - 2); rect(Math.round(x - lw / 2), ly0, lw, lh, (xx, y) => [opt.label || R.label, 3.6 + (xx === Math.round(x - lw / 2) ? 1.6 : 0) - (y === ly0 + lh - 1 ? 1 : 0)]);
    if (lw > 3) rect(Math.round(x - lw / 2) + 1, ly0 + 1, lw - 2, 1, (xx, y) => [R.ink, 2.6]); }
  put(Math.round(x - w / 2) + 1, base - body + 4, rm, 9.2); put(Math.round(x - w / 2) + 1, base - body + 5, rm, 8); }
function fillShelf(x0, x1, base, sd) { seed = sd; let x = x0 + 8; const kinds = [R.glassG, R.glassA, R.glassC, R.glassR, R.glassB, R.glassG, R.glassA];
  while (x < x1 - 8) { const w = 5 + Math.floor(rnd() * 4), h = 18 + Math.floor(rnd() * 14), k = kinds[Math.floor(rnd() * kinds.length)]; bottle(x + w / 2, base, Math.min(h, 36), w, k, { neck: 0.3 + rnd() * 0.15, cap: rnd() < 0.5 ? R.gold : R.red, noLabel: rnd() < 0.2 }); x += w + 2 + Math.floor(rnd() * 3); } }
for (const [sx0, sx1] of [[140, 244], [356, 460]]) { fillShelf(sx0, sx1, 102, sx0 + 1); fillShelf(sx0, sx1, 142, sx0 + 2); fillShelf(sx0, sx1, 182, sx0 + 3); }
// Spiegel: Rahmen, Goldkante, dunkles Glas mit schrägen Glanzstreifen und gespiegelten Lampen, Schriftzug BURA
rect(252, 66, 96, 134, (x, y) => { const e = Math.min(x - 252, 347 - x, y - 66, 199 - y); if (e < 5) return [R.woodM, e === 0 ? 2 : (e === 1 ? 6.4 : 4.2 - e * 0.3)]; if (e === 5) return [R.gold, 6.5]; return null; });
rect(258, 72, 84, 122, (x, y) => { const s = ((x - 258) * 0.55 + (y - 72)) % 46; return [R.mirror, 2.4 + (y - 72) / 122 * 0.8 + (s > 6 && s < 12 ? 1.4 : 0) + (s > 14 && s < 16 ? 0.8 : 0) + fbm(x * 0.05, y * 0.05, 51) * 0.5]; });
for (const lx of [290, 318]) ellipse(lx, 154, 9, 3, (x, y, dx, dy) => [R.bulb, 3.2 - Math.hypot(dx, dy) * 2, 1]);
const FONT = { B: ['#######.', '.##...##', '.##...##', '.######.', '.##...##', '.##...##', '.##...##', '#######.'], U: ['###..###', '.#....#.', '.#....#.', '.#....#.', '.#....#.', '.#....#.', '.##..##.', '..####..'],
  R: ['#######.', '.##...##', '.##...##', '.######.', '.##.##..', '.##..##.', '.##...##', '###...##'], A: ['...##...', '..####..', '.##..##.', '.##..##.', '.######.', '.##..##.', '.##..##.', '###..###'] };
function word(s, x0, y0) { let x = x0; for (const ch of s) { const g = FONT[ch]; for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === '#') { put(x + c, y0 + r, R.gold, 7.6 - r * 0.6 + (c < 3 ? 0.6 : 0)); }
      for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === '#' && (!g[r + 1] || g[r + 1][c] !== '#')) put(x + c, y0 + r + 1, R.woodD, 0.4); x += 10; } }
word('BURA', 280, 80);
// Unterschrank hinter dem Tresen mit Gläsern
rect(128, 196, 344, 34, (x, y) => [R.woodD, (y === 196 ? 4.8 : 2.2) + fbm(x * 0.02, y * 0.4, 61) * 0.6 - (((x - 128) % 57) === 0 ? 1.2 : 0)]);
for (let gx = 140; gx < 460; gx += 9) if (gx < 250 || gx > 350) { rect(gx, 188, 5, 8, (x, y) => [R.glassC, (x === gx ? 7 : 4.2) + (y === 188 ? 1.5 : 0)]); }

// Pendellampen: Kabel, grüner Emailleschirm, Glühbirne von unten, Lichtkegel
for (const [lx, ly] of LAMPS) { line(lx, 38, lx, ly - 18, () => [R.ink, 1.2]);
  poly([[lx - 5, ly - 18], [lx + 5, ly - 18], [lx + 18, ly - 3], [lx - 18, ly - 3]], (x, y, xa, xb) => { const u = (x - xa) / Math.max(1, xb - xa); return [R.green, 3.2 + Math.sin(u * Math.PI) * 2.4 - u * 1.2 + (y === ly - 18 ? 1 : 0)]; });
  rect(lx - 18, ly - 3, 37, 2, (x, y) => [R.green, y === ly - 3 ? 7.4 : 5]); rect(lx - 6, ly - 20, 13, 2, (x, y) => [R.brass, y === ly - 20 ? 6 : 3]);
  ellipse(lx, ly, 10, 2.6, (x, y, dx, dy) => [R.bulb, 5 - Math.hypot(dx, dy) * 2.4, 1]); }

// Fenster rechts: Riva in der Dämmerung (Himmel, Marjan, Glockenturm, Palmen, Promenade, Meer), Rahmen, Sprossen, Vorhänge, Heizkörper
const WX0 = 494, WX1 = 614, WY0 = 74, WY1 = 214;
rect(WX0 + 6, WY0 + 6, WX1 - WX0 - 12, WY1 - WY0 - 12, (x, y) => { const hz = 172; if (y < hz) { const t = (y - WY0) / (hz - WY0); let l = 1 + t * 12.4 + (fbm(x * 0.04, y * 0.18, 71) - 0.5) * 1.6; if (Math.abs(y - (110 + Math.sin(x * 0.05) * 3)) < 2) l += 1.2; return [R.sky, l, 1]; }
  const t = (y - hz) / (WY1 - hz); return [R.sea, 3.2 - t * 1.6 + (((y * 7 + Math.floor(x / 5)) % 9) === 0 ? 2 : 0) + (Math.sin(x * 0.4 + y * 1.3) > 0.85 ? 1.2 : 0), 1]; });
// Marjan-Hügel, Stadt, Glockenturm
rect(WX0 + 6, 150, WX1 - WX0 - 12, 22, (x, y) => { const top = 160 - Math.sin((x - 500) * 0.045) * 6 - (x > 560 ? 4 : 0); return y >= top ? [R.sil, 1.6 + (y > 166 ? 0.6 : 0), 1] : null; });
for (let i = 0; i < 26; i++) { const lx = WX0 + 8 + Math.floor(h2(i, 3) * 104), ly = 160 + Math.floor(h2(i, 4) * 11); if (MAT[ly * W + lx] === R.sil) put(lx, ly, R.lite, 2 + h2(i, 5) * 2.5, 1); }
rect(588, 112, 9, 60, (x, y) => [R.sil, 2.4 + (x === 588 ? 0.8 : 0), 1]); poly([[587, 112], [598, 112], [592.5, 100]], () => [R.sil, 2.6, 1]); rect(592, 96, 1, 5, () => [R.sil, 3, 1]);
for (const wy of [120, 132, 144]) rect(591, wy, 3, 4, (x, y) => [R.lite, 2.6, 1]);
// Promenade mit Laternen, Spiegelungen auf dem Wasser
rect(WX0 + 6, 170, WX1 - WX0 - 12, 3, (x, y) => [R.sil, y === 170 ? 3.4 : 2, 1]);
for (const px of [512, 548, 604]) { rect(px, 156, 1, 15, () => [R.sil, 3.2, 1]); ellipse(px + 0.5, 155, 2.2, 2.2, (x, y, dx, dy) => [R.lite, 4.6 - Math.hypot(dx, dy) * 2, 1]);
  for (let y = 174; y < WY1 - 6; y++) if ((y + px) % 3 !== 0) put(px + Math.round(Math.sin(y * 0.7) * 1.2), y, R.lite, 2.2 - (y - 174) / 30, 1); }
// Palmen als Silhouetten
function palm(px, base, hgt, s) { for (let y = 0; y < hgt; y++) { const x = px + Math.sin(y / hgt * 1.6) * 4 * s; put(x, base - y, R.sil, 1.2, 1); put(x + 1, base - y, R.sil, 1.2, 1); }
  const tx = px + Math.sin(1.6) * 4 * s, ty = base - hgt; for (let k = 0; k < 9; k++) { const a = -Math.PI * 0.95 + k * (Math.PI * 0.95 / 8) * 2.2, len = 14 + (k % 3) * 3;
    for (let t = 0; t < len; t++) { const xx = tx + Math.cos(a) * t, yy = ty + Math.sin(a) * t * 0.55 + (t * t) / 70; put(xx, yy, R.sil, 1, 1); if (t % 3 === 0) put(xx, yy + 1, R.sil, 1, 1); } } }
palm(526, 171, 46, 1); palm(570, 171, 38, -1);
// Rahmen und Sprossen
rect(WX0, WY0, WX1 - WX0, WY1 - WY0, (x, y) => { const e = Math.min(x - WX0, WX1 - 1 - x, y - WY0, WY1 - 1 - y); if (e < 6) return [R.woodM, e === 0 ? 2 : (e === 1 ? 6.6 : 4.4 - (e > 4 ? 1.4 : 0))]; if (x === 553 || x === 554 || x === 555) return [R.woodM, x === 553 ? 6 : (x === 555 ? 2.4 : 4.2)]; if (y >= 126 && y <= 128) return [R.woodM, y === 126 ? 6.4 : (y === 128 ? 2.2 : 4.2)]; return null; });
rect(WX0 - 8, WY1, WX1 - WX0 + 16, 7, (x, y) => [R.woodL, y === WY1 ? 8.4 : (y === WY1 + 1 ? 6.6 : 3.6 - (y - WY1) * 0.3)]);
rect(472, 62, 168, 4, (x, y) => [R.brass, y === 62 ? 7 : 3.6]);
function curtain(x0, x1, flip) { for (let x = x0; x < x1; x++) for (let y = 66; y < 236; y++) { const u = (x - x0) / (x1 - x0), tie = y > 150 && y < 158; const pinch = y > 150 ? Math.min(1, (y - 150) / 40) : 0;
    const fold = Math.sin((x - x0) * 0.9 + (y < 150 ? 0 : (y - 150) * 0.04)) * 1.7; let l = 4.0 + fold + (flip ? (1 - u) : u) * 0.8 - (y < 72 ? 1.2 : 0); if (tie) l = 3; if (pinch && (flip ? u < pinch * 0.35 : u > 1 - pinch * 0.35)) continue; put(x, y, R.curtain, l); } }
curtain(474, 496, false); curtain(612, 634, true);
rect(474, 150, 22, 6, (x, y) => [R.gold, y === 150 ? 6.4 : 3.6]); rect(612, 150, 22, 6, (x, y) => [R.gold, y === 150 ? 6.4 : 3.6]);
// Heizkörper
rect(508, 226, 94, 28, (x, y) => { const fin = (x - 508) % 6; let l = 4.2 + (fin === 0 ? 2.4 : (fin === 5 ? -1.8 : (fin === 4 ? -0.8 : 0.4))) - (y > 250 ? 1.2 : 0); if (y === 226 || y === 227) l = 6.4; return [R.radiator, l]; });

// Boden: Fliesen in Perspektive (rot und dunkel im Wechsel), Fugen, Glanz unter den Lampen, Spiegelung des Tresens
const VPX = 320, VPY = 150, FLOOR0 = 256;
for (let y = FLOOR0; y < H; y++) { const z = 9000 / (y - VPY); for (let x = 0; x < W; x++) { const X = (x - VPX) * z / 260, T = 9.5;
    const tx = Math.floor(X / T), tz = Math.floor(z / T), fx = X / T - tx, fz = z / T - tz, gw = 0.07 * (y < 300 ? 1.6 : 1), gr = fx < gw || fz < gw * 1.4;
    const dark = (tx + tz) & 1, va = (h2(tx, tz, 3) - 0.5) * 0.8; let l = (dark ? 2.9 : 3.5) + va + (fbm(x * 0.06, y * 0.15, 81) - 0.5) * 0.6;
    if (!gr && fz > 0.55 && fz < 0.75 && fx > 0.2 && fx < 0.8) l += 0.5;   // Glanz auf jeder Fliese
    put(x, y, gr ? R.tileD : (dark ? R.tileR : R.tileC), gr ? 1.4 : l); } }
// Tresen: Platte (Oberseite, Kante), Front mit sechs Füllungen, Messing-Fußleiste, Sockel
rect(122, 224, 356, 8, (x, y) => [R.woodL, y === 224 ? 8 : (y < 229 ? 6 - (y - 225) * 0.4 + fbm(x * 0.03, y, 91) * 0.6 : (y === 229 ? 8.6 : 3.2))]);
rect(126, 232, 348, 70, (x, y) => { const px = (x - 126) % 58, inner = px > 5 && px < 53 && y > 240 && y < 282; let l = 2.4 + fbm(x * 0.02, y * 0.35, 92) * 0.9 - (y < 236 ? 1.2 : 0);
  if (inner) { l = 1.9 + fbm(x * 0.025, y * 0.2, 93) * 0.7; if (px === 6 || y === 241) l -= 1; if (px === 52 || y === 281) l += 1.4; if (px === 7 || y === 242) l -= 0.4; } else if (px === 0) l -= 1.3; else if (px === 1) l += 0.8;
  if (y > 292) l = 1.2 + (y === 293 ? 1.4 : 0); return [R.woodD, l]; });
rect(130, 284, 340, 3, (x, y) => [R.brass, y === 284 ? 8 : (y === 285 ? 5.4 : 3)]); for (let bx = 150; bx < 470; bx += 64) rect(bx, 287, 3, 6, (x, y) => [R.brass, x === bx ? 6 : 3]);
rect(122, 302, 356, 4, (x, y) => { addLev(x, y, -1.6 + (y - 302) * 0.35); return null; });
// Spiegelung der Tresenfront und der Lampen auf den Fliesen
for (let y = 306; y < 336; y++) for (let x = 126; x < 474; x++) { const k = 1 - (y - 306) / 30; if (((x + y) & 1) === 0) addLev(x, y, -0.5 * k); }
for (const [lx] of LAMPS) for (let y = 308; y < 344; y += 1) for (let x = lx - 10; x <= lx + 10; x++) { const k = (1 - Math.abs(x - lx) / 10) * (1 - (y - 308) / 36); if (k > 0 && bay(x, y) < k * 0.9) addLev(x, y, 1.6 * k); }
// Dinge auf dem Tresen: Espressomaschine, Zapfhähne, Gläser, Aschenbecher, Serviettenhalter
rect(156, 192, 48, 33, (x, y) => { const u = (x - 156) / 47; let l = 4 + Math.sin(u * Math.PI) * 2.6 - u * 1.4; if (x === 158) l += 3; if (y === 192 || y === 193) l += 1.8; if (y > 210 && y < 213) l -= 2.4; return [R.chrome, l]; });
rect(160, 186, 40, 6, (x, y) => [R.chrome, y === 186 ? 8.4 : 5.4 - (x - 160) / 40 * 1.6]); for (const gx of [168, 188]) { rect(gx, 213, 6, 3, (x, y) => [R.chrome, 6]); rect(gx - 4, 214, 5, 2, (x, y) => [R.ink, 2]); rect(gx + 1, 218, 4, 6, (x, y) => [R.paper, x === gx + 1 ? 6.6 : 5]); }
put(196, 198, R.red, 7, 1); put(197, 198, R.red, 5, 1); rect(162, 196, 10, 6, (x, y) => [R.ink, 1.5 + (x + y) % 2]);
for (const tx of [382, 394, 406]) { rect(tx, 196, 4, 22, (x, y) => [R.chrome, x === tx ? 8.6 : 4.6]); rect(tx - 1, 190, 6, 7, (x, y) => [R.ink, x === tx - 1 ? 3 : 1.4]); rect(tx - 1, 189, 6, 1, (x, y) => [R.gold, 6]); }
rect(376, 216, 38, 6, (x, y) => [R.chrome, y === 216 ? 7.4 : 4]);
for (const gx of [428, 438, 448]) { rect(gx, 211, 7, 13, (x, y) => [R.glassC, (x === gx + 1 ? 8.4 : 4.6) + (y === 211 ? 1.6 : 0) + (y > 216 && x > gx ? (gx === 438 ? -1 : 0) : 0)]); if (gx === 438) rect(gx + 1, 216, 5, 7, (x, y) => [R.glassA, 5.6 + (x === gx + 1 ? 2 : 0)]); }
ellipse(236, 222, 7, 2.2, (x, y, dx, dy) => [R.glassC, 5.4 - dy * 1.6]); rect(236, 219, 6, 1, (x, y) => [R.paper, 6]);
rect(330, 210, 10, 14, (x, y) => [R.chrome, x === 330 ? 8 : 4.6]); rect(332, 208, 6, 10, (x, y) => [R.paper, 6.4 - (x - 332) * 0.3]);

// ---------------------------------------------------------------- Figuren: eigene Puffer, Glieder als Polygone mit Licht, Köpfe von Hand
class Spr { constructor(w, h) { this.w = w; this.h = h; this.mat = new Int16Array(w * h).fill(-1); this.lev = new Float32Array(w * h); }
  put(x, y, r, l) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = y * this.w + x; this.mat[i] = r; this.lev[i] = l; }
  get(x, y) { return (x < 0 || y < 0 || x >= this.w || y >= this.h) ? -1 : this.mat[y * this.w + x]; }
  // Fläche mit Wölbung: Querschnitt halbrund, Licht L=[x,y,z]; extra(x,y,u,v) für Falten, Säume
  shade(pts, rm, base, amp, L, extra) { let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    polyScan(pts, (x, y, xa, xb) => { const u = (x + 0.5 - xa) / Math.max(1, xb - xa + 1), v = (y - y0) / Math.max(1, y1 - y0), nx = u * 2 - 1, nz = Math.sqrt(Math.max(0.05, 1 - nx * nx)), ny = v < 0.15 ? -(0.15 - v) * 4 : 0;
      const d = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]); let l = base + amp * (d - 0.55); if (extra) l += extra(x, y, u, v) || 0; this.put(x, y, rm, l); }, this.h); }
  // Glied als Kapselkette mit Licht senkrecht zur Achse
  limb(a, b, r0, r1, rm, base, amp, L, extra) { const vx = b[0] - a[0], vy = b[1] - a[1], len = Math.hypot(vx, vy) || 1, nx = -vy / len, ny = vx / len;
    for (let y = Math.floor(Math.min(a[1], b[1]) - r0 - 1); y <= Math.ceil(Math.max(a[1], b[1]) + r0 + 1); y++) for (let x = Math.floor(Math.min(a[0], b[0]) - r0 - 1); x <= Math.ceil(Math.max(a[0], b[0]) + r0 + 1); x++) {
      const px = x + 0.5 - a[0], py = y + 0.5 - a[1], t = clamp((px * vx + py * vy) / (len * len), 0, 1), qx = px - t * vx, qy = py - t * vy, d = Math.hypot(qx, qy), r = r0 + (r1 - r0) * t;
      if (d > r) continue; const s = (qx * nx + qy * ny) / r, sx = s * Math.sign(nx || 1), nz = Math.sqrt(Math.max(0.05, 1 - s * s)); const dd = Math.max(0, sx * L[0] + nz * L[2]);
      let l = base + amp * (dd - 0.55); if (extra) l += extra(x, y, t, s) || 0; this.put(x, y, rm, l); } }
  stamp(rows, leg, ox, oy, flip) { for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) { const ch = rows[r][flip ? rows[r].length - 1 - c : c]; if (ch === '.' || ch === ' ') continue; const v = leg[ch]; if (!v) throw new Error('Legende ohne ' + ch); this.put(ox + c, oy + r, v[0], v[1]); } }
  rim(right, k) { const add = []; for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) { if (this.get(x, y) < 0) continue; const n = right ? this.get(x + 1, y) : this.get(x - 1, y); if (n < 0) add.push(y * this.w + x); } for (const i of add) this.lev[i] += k; }
  // Kontur: außen eine Stufe dunkler als die dunkelste Stufe der Fläche daneben; oben und zur Lichtseite etwas heller (selektiv)
  outline(litRight) { const add = []; for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) { if (this.get(x, y) >= 0) continue;
      const nb = [[x, y + 1, 0], [x - 1, y, litRight ? 0 : 1], [x + 1, y, litRight ? 1 : 0], [x, y - 1, 1]]; for (const [nx2, ny2, lit] of nb) { const m = this.get(nx2, ny2); if (m >= 0) { add.push([x, y, m, lit ? 1.1 : 0]); break; } } }
    for (const [x, y, m, l] of add) this.put(x, y, m, l); }
  // in die Szene: Füße bei (fx,fy); ghost: in eine Liste für das Überblenden am Ende
  blit(fx, fy, ax, ay, opt) { opt = opt || {}; for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) { const m = this.mat[y * this.w + x]; if (m < 0) continue; const X = fx - ax + x, Y = fy - ay + y; if (opt.clipY && Y >= opt.clipY) continue;
      if (opt.ghost) GHOST.push([X, Y, m, this.lev[y * this.w + x], opt.edge && this.isEdge(x, y)]); else put(X, Y, m, this.lev[y * this.w + x], 1); } }
  isEdge(x, y) { return this.get(x - 1, y) < 0 || this.get(x + 1, y) < 0 || this.get(x, y - 1) < 0 || this.get(x, y + 1) < 0; } }
const GHOST = [];
const Lm = [0.62, -0.5, 0.6];   // Licht für Marko und Mala: von rechts oben (Lampen über dem Tresen)

// ---- Köpfe (Legenden: Rampe, Stufe)
function headLeg(skin, hair, extra) { return Object.assign({ K: [hair, 0.2], A: [hair, 1.6], B: [hair, 3.2], C: [hair, 4.8], D: [hair, 6.4], o: [skin, 1.2], '1': [skin, 3], '2': [skin, 4.6], '3': [skin, 6.2], '4': [skin, 7.8], '5': [skin, 9.4],
  w: [R.eyeW, 1.6], e: [R.hairS, 0.4], b: [hair, 1.2], m: [skin, 2.2], n: [skin, 5.4], s: [R.stub, 2.9], S: [R.stub, 3.8] }, extra || {}); }
// Marko, drei Viertel nach rechts: kurzes Haar mit Seitenscheitel, Ohr links, Bartstoppeln, Nase mit Schatten links
const MK_HEAD = [
  '.......KKKKK.......',
  '.....KKABBBBKK.....',
  '....KABBBCCBBBK....',
  '...KABBBBBCCBBBK...',
  '..KABBBCBBBBCBBBK..',
  '..KAABBBBCBBBBBBBK.',
  '.KAAABBBBBBBBABBBK.',
  '.KAAAABBBBAA3344BK.',
  '.KAAAABA3344444444o',
  '.KAAAAA33bbb34bb4o.',
  '.KAAAo332we344we4o.',
  '.KAAo213333334344o.',
  '.KAAo312333334445o.',
  '.KAAAo22333334444o.',
  '..KAAo2s3333334o...',
  '..KKAos23s33mmm3o..',
  '...KKos2s333n3s3o..',
  '....Kos2s3s3s33o...',
  '.....oos2s3s3so....',
  '......o1ssssso.....',
  '......o112oooo.....',
  '......o1122o.......',
  '......o12222o......',
  '......o12232o......',
  '......o12232o......'];
const MALA_HEAD = [
  '.......KKKKK......',
  '.....KKAABBBKK....',
  '....KABBCCCBBBK...',
  '...KABBCCDCCBBBK..',
  '..KABBBCCCCBBBBBK.',
  '..KABBBBBBBBBBBBK.',
  '.KAABBBBBBBBABBBK.',
  '.KAABBBBAA3344BBK.',
  '.KAABBBA33444444Bo',
  '.KAABBA33bb34bb4o.',
  '.KAABBA32we44we4o.',
  '.KAABBA3333334344o',
  '.KAABBA3333334445o',
  '.KAABBA2333334444o',
  '.KAABBA22333334o..',
  '.KAABBAo22333nn3o.',
  '.KAABBAKo2333333o.',
  '.KAABBAK.oo22222o.',
  '.KAABBBK...o222o..',
  '.KAABBBK...o232o..',
  '..KABBBK...o232o..'];
const SA_HEAD = [   // Sanja von vorn: kurzes schwarzes Haar, Pony nach rechts, rote Lippen, sieht zu Marko
  '.....KKKKKK.....',
  '...KKAABBBAKK...',
  '..KABBCCCCBBAK..',
  '.KABBCDDCCBBBAK.',
  '.KABBCCCCBBBBBAK',
  'KAABBBBBBBBBBBAK',
  'KAABBBBBBAABBBAK',
  'KAAB33AAAA4443AK',
  'KAo23444444443oK',
  'KAo2bbb444bbb3oK',
  'Ko22ew3444ew32oK',
  'Ko2333344443332o',
  '.o23333443333 2o'.replace(' ', '3'),
  '.o22333244333 2o'.replace(' ', '3'),
  '.o22333322333 2o'.replace(' ', '3'),
  '.o2233rRRr3332o.',
  '..o2233rr3332o..',
  '..o2223333322o..',
  '...o22233322o...',
  '....oo22222oo...',
  '......o232o.....',
  '......o232o.....'];
// ---- Marko (Füße bei 35,129), Mantel bis zum Knie, rechte Hand in der Manteltasche
function drawMarko() { const s = new Spr(72, 132), X = 35, top = 4;
  // Beine und Schuhe
  s.limb([X - 8, 92], [X - 9, 121], 5.2, 3.8, R.trou, 3.6, 3.4, Lm, (x, y, t, q) => (Math.abs(q - 0.3) < 0.12 ? 1.4 : 0) + (t > 0.93 ? -0.8 : 0));
  s.limb([X + 6, 92], [X + 8, 120], 5, 3.6, R.trou, 4.2, 3.4, Lm, (x, y, t, q) => (Math.abs(q - 0.3) < 0.12 ? 1.4 : 0) + (t > 0.93 ? -0.8 : 0));
  const SH = ['....oooo......', '..oo3344oo....', '.o122334445oo.', 'o1222333344445o', 'ooooooooooooooo'];
  s.stamp(SH, { o: [R.shoeB, 0.4], '1': [R.shoeB, 2], '2': [R.shoeB, 3.4], '3': [R.shoeB, 4.6], '4': [R.shoeB, 6], '5': [R.shoeB, 8] }, X - 15, 122);
  s.stamp(SH, { o: [R.shoeB, 0.4], '1': [R.shoeB, 2], '2': [R.shoeB, 3.4], '3': [R.shoeB, 4.6], '4': [R.shoeB, 6], '5': [R.shoeB, 8] }, X + 1, 121);
  // ferner Arm (Hand in der Tasche), hinter dem Mantel
  s.limb([X + 11, 33], [X + 16, 54], 4.4, 3.8, R.coat, 3.6, 4, Lm); s.limb([X + 16, 54], [X + 11, 70], 3.8, 3.2, R.coat, 4, 4, Lm);
  // Mantel
  const coat = [[X - 13, 30], [X - 6, 26], [X + 7, 26], [X + 13, 30], [X + 13, 42], [X + 10, 62], [X + 12, 76], [X + 15, 97], [X - 15, 97], [X - 13, 76], [X - 12, 62], [X - 14, 42]];
  s.shade(coat, R.coat, 5.2, 5.4, Lm, (x, y, u, v) => { let d = 0; if (y > 94) d -= 1.2; // Saum
    if (Math.abs((x - X) - (5 + (y - 50) * 0.04)) < 0.6 && y > 48) d -= 2.2; if (Math.abs((x - X) - (6 + (y - 50) * 0.04)) < 0.6 && y > 48) d += 1.6;   // Vorderkante
    if (Math.abs(y - 72) < 0.6 && ((x > X - 12 && x < X - 2) || (x > X + 8 && x < X + 14))) d -= 2; if (Math.abs(y - 71) < 0.6 && ((x > X - 12 && x < X - 2) || (x > X + 8 && x < X + 14))) d += 1.2;   // Taschenklappen
    if (Math.abs((x - X) + 10 - (y - 40) * 0.25) < 0.7 && y > 40 && y < 60) d -= 1.3;   // Falte von der Achsel
    if (Math.abs((x - X) - 9 + (y - 80) * 0.35) < 0.7 && y > 78 && y < 95) d -= 1;   // Zugfalte
    return d; });
  // Hemd im Ausschnitt, Revers, Kragen
  poly2(s, [[X - 1, 27], [X + 7, 27], [X + 4, 47]], (x, y, xa, xb) => [R.shirt, 5 + (x - xa) / Math.max(1, xb - xa) * 2 - (y < 30 ? 1 : 0)]);
  poly2(s, [[X - 4, 25], [X, 25], [X + 4, 48], [X + 2, 48]], (x, y, xa, xb) => [R.coat, 6.4 + (x === xb ? 1.4 : 0)]);
  poly2(s, [[X + 6, 25], [X + 9, 25], [X + 5, 48], [X + 4, 48]], (x, y, xa, xb) => [R.coat, 7.4 + (x === xb ? 1.2 : 0)]);
  poly2(s, [[X - 7, 22], [X - 3, 20], [X - 2, 28], [X - 6, 29]], (x, y, xa, xb) => [R.coat, 4.4 + (x - xa) * 0.4]);
  poly2(s, [[X + 6, 20], [X + 10, 22], [X + 10, 29], [X + 7, 28]], (x, y, xa, xb) => [R.coat, 6.6 + (x - xa) * 0.3]);
  for (const by of [54, 66, 80]) { s.put(X + 5, by, R.ink, 1.2); s.put(X + 6, by, R.ink, 1.8); s.put(X + 5, by + 1, R.ink, 1); s.put(X + 6, by + 1, R.ink, 2.6); s.put(X + 6, by, R.chrome, 6); }
  // naher Arm, hängend; Hemdmanschette; Hand
  s.limb([X - 12, 32], [X - 16, 55], 4.6, 4, R.coat, 3.4, 4.2, Lm, (x, y, t) => t < 0.12 ? 0.6 : 0);
  s.limb([X - 16, 55], [X - 14, 75], 4, 3.4, R.coat, 3.6, 4.2, Lm, (x, y, t) => t > 0.92 ? -1.2 : 0);
  s.limb([X - 14, 74], [X - 14, 77], 3.3, 3.1, R.shirt, 4.4, 3, Lm);
  const HAND = ['.o33o.', 'o3444o', 'o2344o', 'o23345', 'o2234o', '.o223o', '.o12o.', '..oo..'];
  s.stamp(HAND, { o: [R.skinM, 1.4], '1': [R.skinM, 3], '2': [R.skinM, 4.4], '3': [R.skinM, 5.8], '4': [R.skinM, 7.2], '5': [R.skinM, 8.6] }, X - 17, 76);
  // Kopf
  s.stamp(MK_HEAD, headLeg(R.skinM, R.hairM), X - 8, top);
  s.rim(true, 2.2); s.outline(true); return s; }
function poly2(s, pts, f) { polyScan(pts, (x, y, xa, xb) => { const v = f(x, y, xa, xb); if (v) s.put(x, y, v[0], v[1]); }, s.h); }

// ---- Mala (schwebt), Jeansjacke, grauer Schal, Jeans, helle Turnschuhe, langer Zopf
function drawMala() { const s = new Spr(64, 124), X = 30, top = 4;
  s.limb([X - 6, 82], [X - 7, 111], 4.6, 3.4, R.jeans, 4, 3.6, Lm, (x, y, t, q) => Math.abs(q - 0.35) < 0.12 ? 1.6 : 0);
  s.limb([X + 5, 82], [X + 7, 110], 4.4, 3.2, R.jeans, 4.6, 3.6, Lm, (x, y, t, q) => Math.abs(q - 0.35) < 0.12 ? 1.6 : 0);
  const SN = ['...oooo....', '.oo4455oo..', 'o344455566o', 'o2333444555o', 'oooooooooooo'];
  const sl = { o: [R.sneak, 0.6], '2': [R.sneak, 2.4], '3': [R.sneak, 3.6], '4': [R.sneak, 4.8], '5': [R.sneak, 6], '6': [R.sneak, 7.2] };
  s.stamp(SN, sl, X - 12, 112); s.stamp(SN, sl, X + 1, 111);
  // Zopf hinten (links), über den Rücken
  for (let i = 0; i < 46; i++) { const y = 18 + i, x = X - 10 + Math.sin(i * 0.12) * 1.5; const seg = (i % 6); for (let k = -2; k <= 2; k++) s.put(x + k, y, R.hairG, 2.6 + (seg < 3 ? 1.6 : 0) - Math.abs(k) * 0.6 + (k === 1 && seg < 2 ? 1.4 : 0)); }
  for (let k = -1; k <= 1; k++) s.put(X - 10 + Math.sin(46 * 0.12) * 1.5 + k, 64, R.scarf, 4);
  // Jacke
  const jk = [[X - 13, 28], [X - 5, 24], [X + 6, 24], [X + 13, 28], [X + 13, 40], [X + 11, 58], [X + 12, 76], [X - 12, 76], [X - 12, 58], [X - 14, 40]];
  s.shade(jk, R.denim, 5.4, 5.2, Lm, (x, y, u, v) => { let d = 0; if (y > 72) d -= 0.6; if (y === 74) d -= 1.6; if (Math.abs((x - X) - 4) < 0.6 && y > 40) d -= 1.8; if (Math.abs((x - X) - 5) < 0.6 && y > 40) d += 1.4;
    if (Math.abs(y - 44) < 0.6 && ((x > X - 11 && x < X - 3) || (x > X + 6 && x < X + 12))) d += 1.6; if (Math.abs(y - 45) < 0.6 && ((x > X - 11 && x < X - 3) || (x > X + 6 && x < X + 12))) d -= 1.6;   // Brusttaschen
    if (((x * 3 + y) % 13) === 0) d += 0.6; return d; });
  for (const by of [46, 56, 66]) { s.put(X + 5, by, R.gold, 6); s.put(X + 5, by + 1, R.gold, 3.6); }
  // Schal: um den Hals, ein Ende vorn
  poly2(s, [[X - 8, 22], [X + 9, 22], [X + 10, 31], [X - 9, 31]], (x, y, xa, xb) => [R.scarf, 4.6 + (x - xa) / Math.max(1, xb - xa) * 2.4 - ((x + y) % 5 === 0 ? 1.2 : 0) + (y === 22 ? 1 : 0)]);
  poly2(s, [[X + 3, 30], [X + 9, 30], [X + 8, 52], [X + 4, 52]], (x, y, xa, xb) => [R.scarf, 4 + (x - xa) * 0.6 - ((y % 6) === 0 ? 1.2 : 0)]);
  // Arme
  s.limb([X - 12, 30], [X - 15, 52], 4.2, 3.8, R.denim, 3.8, 4, Lm); s.limb([X - 15, 52], [X - 14, 70], 3.8, 3.2, R.denim, 4, 4, Lm, (x, y, t) => t > 0.88 ? 1.4 : 0);
  s.limb([X + 12, 30], [X + 15, 50], 4, 3.6, R.denim, 4.4, 4, Lm); s.limb([X + 15, 50], [X + 14, 68], 3.6, 3, R.denim, 4.6, 4, Lm);
  const HAND = ['.o33o.', 'o3444o', 'o2344o', 'o23345', '.o234o', '.o12o.', '..oo..'], hl = { o: [R.skinG, 1.6], '1': [R.skinG, 3.2], '2': [R.skinG, 4.6], '3': [R.skinG, 6], '4': [R.skinG, 7.4], '5': [R.skinG, 8.8] };
  s.stamp(HAND, hl, X - 17, 70); s.stamp(HAND, hl, X + 11, 68);
  s.stamp(MALA_HEAD, headLeg(R.skinG, R.hairG), X - 8, top);
  s.outline(true); return s; }

// ---- Sanja hinter dem Tresen (von vorn): schwarzes Shirt, dunkelrote Latzschürze, poliert ein Glas
function drawSanja() { const s = new Spr(60, 80), X = 30, top = 2, Ls = [0.15, -0.8, 0.58];
  const body = [[X - 15, 30], [X - 6, 25], [X + 6, 25], [X + 15, 30], [X + 15, 44], [X + 12, 62], [X + 13, 80], [X - 13, 80], [X - 12, 62], [X - 15, 44]];
  s.shade(body, R.black, 4.4, 4.4, Ls);
  poly2(s, [[X - 8, 36], [X + 8, 36], [X + 11, 80], [X - 11, 80]], (x, y, xa, xb) => [R.apron, 4.4 + Math.sin((x - xa) / Math.max(1, xb - xa) * Math.PI) * 2 - (y === 36 ? -1 : 0) + ((x - X) % 7 === 0 && y > 50 ? -0.8 : 0)]);
  line(X - 8, 36, X - 4, 25, () => [R.apron, 3.4]); line(X + 8, 36, X + 4, 25, () => [R.apron, 3.4]);
  rect2(s, X - 3, 58, 7, 6, (x, y) => [R.apron, y === 58 ? 6.4 : 3.2]);   // Tasche
  // Arme: kurze Ärmel, Unterarme hautfarben nach vorn zur Mitte, Glas und Tuch
  s.limb([X - 14, 31], [X - 17, 44], 4, 3.6, R.black, 4, 3.6, Ls); s.limb([X + 14, 31], [X + 17, 44], 4, 3.6, R.black, 4.4, 3.6, Ls);
  s.limb([X - 17, 44], [X - 8, 52], 3.2, 2.8, R.skinS, 5.6, 3.4, Ls); s.limb([X - 17, 40], [X - 17, 46], 3.1, 2.9, R.skinS, 5.6, 3, Ls);
  s.limb([X + 17, 44], [X + 9, 50], 3.2, 2.8, R.skinS, 6, 3.4, Ls); s.limb([X + 17, 40], [X + 17, 46], 3.1, 2.9, R.skinS, 6, 3, Ls);
  rect2(s, X + 2, 38, 9, 13, (x, y) => [R.glassC, (x === X + 3 ? 8.6 : 4.4 + (x - X - 2) * 0.2) + (y === 38 ? 1.6 : 0)]);
  poly2(s, [[X - 10, 44], [X + 4, 41], [X + 6, 54], [X - 8, 56]], (x, y, xa, xb) => [R.cloth, 5.2 + ((x + y * 2) % 6 < 2 ? -1.2 : 0.6) + (x === xa ? -1 : 0)]);
  s.stamp(SA_HEAD, headLeg(R.skinS, R.hairS, { r: [R.red, 3.4], R: [R.red, 5] }), X - 8, top);
  s.rim(true, 1.4); s.rim(false, 0.8); s.outline(false); return s; }
function rect2(s, x0, y0, w, h, f) { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const v = f(x, y); if (v) s.put(x, y, v[0], v[1]); } }

// ---- die beiden Alten am Kartentisch vor dem Fenster
function drawSitter(face, cfg) { const s = new Spr(54, 86), X = 26, L = cfg.light;
  // Stuhllehne hinten
  if (cfg.chairBack) rect2(s, cfg.dir > 0 ? X - 15 : X + 11, 34, 4, 40, (x, y) => [R.woodM, 3 + (x % 4 === 0 ? 1.6 : 0)]);
  // Beine sitzend (Oberschenkel waagrecht), Schuhe
  s.limb([X, 62], [X + 14 * cfg.dir, 64], 5, 4.6, R.trou, 3.6, 3, L); s.limb([X + 14 * cfg.dir, 64], [X + 15 * cfg.dir, 80], 4.4, 3.8, R.trou, 3.4, 3, L);
  rect2(s, X + 11 * cfg.dir - (cfg.dir < 0 ? 9 : 0), 80, 11, 4, (x, y) => [R.shoeB, y === 80 ? 4 : 2]);
  const body = [[X - 12, 28], [X - 4, 24], [X + 5, 24], [X + 12, 28], [X + 12, 42], [X + 11, 64], [X - 11, 64], [X - 12, 42]];
  s.shade(body, cfg.jacket, 4.8, 4.6, L, (x, y) => (y > 61 ? -1 : 0) + (Math.abs(x - X - cfg.dir * 3) < 0.6 && y > 30 ? -1.6 : 0));
  // Arme nach vorn zum Tisch, Karten in den Händen
  s.limb([X + 9 * cfg.dir, 31], [X + 13 * cfg.dir, 46], 4.2, 3.8, cfg.jacket, 4, 4, L); s.limb([X + 13 * cfg.dir, 46], [X + 21 * cfg.dir, 48], 3.8, 3.2, cfg.jacket, 4.4, 4, L);
  rect2(s, X + 20 * cfg.dir - 2, 45, 5, 5, (x, y) => [cfg.skin, 6 - (y - 45) * 0.5]);
  rect2(s, X + 21 * cfg.dir - 1, 38, 6, 8, (x, y) => [R.paper, 7 - (x + y) % 3 * 0.6 + ((x * 2 + y) % 5 === 0 ? -3 : 0)]);
  s.stamp(face, headLeg(cfg.skin, cfg.hair, cfg.leg || {}), X - 7, 4, cfg.dir < 0);
  s.outline(cfg.dir > 0); return s; }
const STIPE_HEAD = [   // Stipe: Schiebermütze, graue Haare, Schnurrbart (drei Viertel nach links, wird gespiegelt gezeichnet)
  '....cccccccc....', '..cccddddddcc...', '.cccdddeeddddc..', 'ccccccccccccccccc', '.KAo334444444oo..', '.KAo23bbb4bb45o.', '.KAo2we34we445o.', '.KAo3333344445o.', '.KAo233334443345o', '.KAo222wwwww3o..',
  '..KAo2www222o...', '...Koo22222o....', '.....o2332o.....', '.....o2332o.....'];
const FRANE_HEAD = [  // Frane: Glatze mit weißem Haarkranz, weißer Bart (drei Viertel nach rechts)
  '.....oooooo.....', '...oo344455oo...', '..o23444455544o.', '.o2334444555544o', '.CCo3344444544o.', '.CDo33bb34bb44o.', '.CDo23we34we44o.', '.CCo2333344445o.', '.CCo23333444455o', '..CoCDDDDDDD3o..',
  '..CoCDDDDDDDCo..', '...CCDDDDDDCo...', '....oCDDDCo.....', '.....o2332o.....'];

// ---------------------------------------------------------------- Zusammensetzen
// Kartentisch (rund) mit Gläsern und Karten
const sitF = drawSitter(FRANE_HEAD, { dir: 1, light: [0.5, -0.6, 0.62], jacket: R.jacketG, skin: R.skinO, hair: R.hairW, leg: { c: [R.hairW, 4], C: [R.hairW, 5.6], D: [R.hairW, 7.4] }, chairBack: true });
const sitS = drawSitter(STIPE_HEAD, { dir: -1, light: [-0.4, -0.6, 0.66], jacket: R.jacketB, skin: R.skinO, hair: R.hairW, leg: { c: [R.cap, 2.4], d: [R.cap, 3.6], e: [R.cap, 5] }, chairBack: true });
sitF.blit(514, 304, 26, 84); sitS.blit(604, 304, 26, 84);
ellipse(559, 268, 34, 8, (x, y, dx, dy) => [R.woodM, 5.4 - dy * 1.6 + (dy < -0.7 ? 1.6 : 0)]); rect(527, 268, 65, 4, (x, y) => [R.woodM, y === 268 ? 2.6 : 2]);
rect(556, 272, 6, 34, (x, y) => [R.woodD, x === 556 ? 4 : 2.2]); ellipse(559, 307, 14, 3, (x, y, dx, dy) => [R.woodD, 2.4 - dy]);
for (const [cx, cy] of [[548, 265], [566, 266], [556, 263]]) rect(cx, cy, 5, 2, (x, y) => [R.paper, 7 - (x % 2)]);
for (const gx of [538, 578]) { rect(gx, 256, 5, 9, (x, y) => [R.glassC, x === gx ? 8 : 4.4]); rect(gx + 1, 260, 3, 4, (x, y) => [R.glassR, 5]); }
// Schatten der Figuren auf dem Boden (vom Licht weg nach links unten), dann die Figuren
function shadowAt(fx, fy, rx, len) { for (let y = fy - 2; y < fy + 4; y++) for (let x = fx - rx - len; x <= fx + rx; x++) { const dx = (x - fx + len * 0.5 * Math.max(0, (fy + 4 - y) / 6)) / (rx + len * 0.5), dy = (y - fy - 0.5) / 3.2; if (dx * dx + dy * dy <= 1) addLev(x, y, -2.2 * (1 - dx * dx * 0.5)); } }
shadowAt(245, 341, 18, 22); shadowAt(160, 343, 12, 14);
const sanja = drawSanja(); sanja.blit(318, 248, 30, 80, { clipY: 224 });
const marko = drawMarko(); marko.blit(245, 340, 35, 129);
const mala = drawMala(); mala.blit(160, 336, 30, 120, { ghost: true, edge: true });

// ---------------------------------------------------------------- Ausgabe: Licht anwenden, rastern, Geist überblenden
const rgb = Buffer.alloc(W * H * 3), DITH = 0.55;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, m = MAT[i]; if (m < 0) continue; const Rm = RAMPS[m];
  const L = LEV[i] + (EMI[i] ? 0 : LIGHT[i] * RESP[m]); const q = clamp(Math.round(L + (bay(x, y) - 0.5) * DITH), 0, Rm.n - 1), c = Rm.cols[q]; rgb[i * 3] = c[0]; rgb[i * 3 + 1] = c[1]; rgb[i * 3 + 2] = c[2]; }
// Mala: ihre Helligkeit in kalten Geisterfarben, zu drei Vierteln deckend, außen ein heller Saum, ein paar Lichtpunkte um sie
const gr = RAMPS[R.ghost];
for (const [x, y, m, l, edge] of GHOST) { if (x < 0 || y < 0 || x >= W || y >= H) continue; const Rm = RAMPS[m], q = clamp(Math.round(l + (bay(x, y) - 0.5) * DITH), 0, Rm.n - 1), c = Rm.cols[q];
  const lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255, g = gr.cols[clamp(Math.round(lum * 12 + 1.5 + (edge ? 3 : 0)), 0, gr.n - 1)], a = edge ? 0.95 : 0.66, i = (y * W + x) * 3;
  for (let k = 0; k < 3; k++) rgb[i + k] = Math.round(rgb[i + k] * (1 - a) + g[k] * a); }
for (let k = 0; k < 14; k++) { const x = 160 - 22 + Math.floor(h2(k, 91) * 44), y = 240 + Math.floor(h2(k, 92) * 90), i = (y * W + x) * 3, g = gr.cols[gr.n - 1 - (k % 3)]; for (let j = 0; j < 3; j++) rgb[i + j] = g[j]; }
if (process.argv.includes('--koepfe')) { const heads = [[MK_HEAD, headLeg(R.skinM, R.hairM)], [MALA_HEAD, headLeg(R.skinG, R.hairG)], [SA_HEAD, headLeg(R.skinS, R.hairS, { r: [R.red, 3.4], R: [R.red, 5] })], [STIPE_HEAD, headLeg(R.skinO, R.hairW, { c: [R.cap, 2.4], d: [R.cap, 3.6], e: [R.cap, 5] })], [FRANE_HEAD, headLeg(R.skinO, R.hairW, { c: [R.hairW, 4], C: [R.hairW, 5.6], D: [R.hairW, 7.4] })]];
  const hs = new Spr(22 * heads.length, 28); heads.forEach(([rows, leg], i) => hs.stamp(rows, leg, i * 22 + 1, 1)); const hr = Buffer.alloc(hs.w * hs.h * 3);
  for (let i = 0; i < hs.w * hs.h; i++) { const m = hs.mat[i], c = m < 0 ? [70, 66, 80] : RAMPS[m].cols[clamp(Math.round(hs.lev[i]), 0, RAMPS[m].n - 1)]; hr[i * 3] = c[0]; hr[i * 3 + 1] = c[1]; hr[i * 3 + 2] = c[2]; }
  writePNG(path.join(OUT, 'koepfe.png'), hs.w, hs.h, hr, 12); }
writePNG(path.join(OUT, 'bar_640x360.png'), W, H, rgb, 1); writePNG(path.join(OUT, 'bar_640x360_x3.png'), W, H, rgb, 3);
console.log('Musterbild', path.join(OUT, 'bar_640x360.png'), RAMPS.reduce((n, r) => n + r.n, 0) + ' Farben in ' + RAMPS.length + ' Rampen');
