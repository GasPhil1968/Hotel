// Musterbild „große Pixelfiguren mit modernem Licht“ für MALA: dieselbe Vijećnica-Szene wie design/tools/hd_modern_beispiel.js,
// aber in grober Pixelgröße (320 × 180, sechsfach) und mit von Hand gepixelten Figuren (Marko ~60 px, Mala ~47 px), die das Licht
// der Szene annehmen (Kerze warm, Mond kalt als Saum, Malas eigenes Leuchten). Gemalt wie das 640×360-Musterbild (design/tools/hd640_beispiel.js, Figuren von dort), dazu aber, was den modernen
// Stil ausmacht und im Spiel bewusst fehlt: weiches farbiges Licht über den Pixeln (Mond durch die offene Kuppel, Kerze, Mala),
// Lichtkegel mit Regen und Staub, Nebel in der Tiefe, Leuchten (Bloom) über das Pixelraster hinaus, dunkle Vordergrund-Silhouetten.
// Eigenständig, ändert am Spiel nichts.
//   node design/tools/hd_figuren_beispiel.js [ausgabeordner]  → figuren_modern_1920x1080.png, figuren_bogen.png
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const OUT = process.argv[2] || path.join(__dirname, '..', 'hdmodern'); fs.mkdirSync(OUT, { recursive: true });
const W = 640, H = 360, S = 3, OW = W * S, OH = H * S;
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

// ================================================================ Vijećnica bei Nacht
// Rampen des Raums
ramp('sand', '#a8805c', 12, { lo: 0.05, hi: 0.8 }); ramp('stripeR', '#8e3a2c', 11, { lo: 0.04, hi: 0.66 }); ramp('stripeO', '#c49856', 11, { lo: 0.06, hi: 0.82 });
ramp('stoneD', '#4a3e4a', 10, { lo: 0.03, hi: 0.55, sat: 0.6 }); ramp('floorS', '#5a5460', 12, { lo: 0.03, hi: 0.66, sat: 0.6 }); ramp('char', '#2e2420', 10, { lo: 0.02, hi: 0.42 });
ramp('woodK', '#3a2418', 11, { lo: 0.02, hi: 0.52 }); ramp('steel', '#5e6676', 11, { lo: 0.03, hi: 0.78, sat: 0.6 }); ramp('tarp', '#3a5a72', 10, { lo: 0.03, hi: 0.6 });
ramp('book', '#6a2a24', 9, { lo: 0.03, hi: 0.56 }); rampList('night', ['#04060e', '#0a1226', '#14223e', '#223456', '#36507a', '#5a76a2', '#90aed0'], 12);
rampList('flame', ['#9a3a10', '#e07a22', '#ffb84a', '#ffe8a0', '#fffbea'], 6); ramp('candle', '#d8ccb0', 8, { lo: 0.2, hi: 0.95, sat: 0.4 });
ramp('wet', '#3c4252', 10, { lo: 0.02, hi: 0.6, sat: 0.7 });

// Tiefe je Pixel (0 vorn … 1 ganz hinten) für Nebel, Pfützen-Maske, Vordergrund
const DEPTH = new Float32Array(W * H), PUD = new Uint8Array(W * H), FG = new Uint8Array(W * H); let CUR_D = 0.5, CUR_FG = 0;
const put0 = put; put = function (x, y, r, l, em) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; put0(x, y, r, l, em); const i = y * W + x; DEPTH[i] = CUR_D; FG[i] = CUR_FG; };
const FLOOR = 272;

// ---- Himmel durch die offene Kuppel und Decke
CUR_D = 1;
rect(0, 0, W, 40, (x, y) => [R.night, 2.2 + (1 - y / 40) * 2 + (fbm(x * 0.02, y * 0.08, 41) - 0.5) * 2.2 + Math.max(0, 1 - Math.hypot(x - 440, y + 18) / 120) * 4]);
// Decke mit Kassetten, in der Mitte aufgerissen (unregelmäßige Kante)
const holeL = x => 296 + Math.sin(x * 0.11) * 4, holeEdge = x => 30 - Math.max(0, Math.min(x - 300, 480 - x)) * 0.17 + fbm(x * 0.15, 3, 44) * 9;
CUR_D = 0.85;
rect(0, 0, W, 44, (x, y) => { const open = x > 300 && x < 480 && y < holeEdge(x); if (open) return null;
  const cx = x % 40, cy = y % 22, edge = cx < 2 || cy < 2; return [R.stoneD, 2.2 + (edge ? 1.4 : 0) + fbm(x * 0.05, y * 0.1, 45) * 1.2 - (y > 38 ? 0.8 : 0) - (Math.abs(x - 390) < 110 && h2(x >> 2, y >> 2, 46) > 0.72 ? 1.2 : 0)]; });
// verbrannte Kanten der Öffnung
for (let x = 300; x < 480; x++) { const e = Math.floor(holeEdge(x)); for (let k = 0; k < 3; k++) put(x, e + k, R.char, 1.4 - k * 0.3); }

// ---- obere Galerie: kleine Hufeisenbögen, Mauer mit Streifen
CUR_D = 0.8;
rect(0, 44, W, 64, (x, y) => [((y >> 3) & 1) ? R.stripeO : R.sand, 3.4 + fbm(x * 0.04, y * 0.06, 47) * 1.6 + ((y & 7) === 0 ? -1 : 0)]);
function horseshoe(cx, cy, r, jambY) { return (x, y) => { const dx = x + 0.5 - cx, dy = y + 0.5 - cy; if (y < cy + r * 0.5) return dx * dx + dy * dy <= r * r; return y <= jambY && Math.abs(dx) <= r * 0.86; }; }
for (let cx = 23; cx < W; cx += 46) { const inside = horseshoe(cx, 70, 14, 104); CUR_D = 1;
  rect(cx - 16, 52, 32, 54, (x, y) => inside(x, y) ? [R.night, 0.6 + Math.max(0, (y - 70) / 34) * 0.8 + (h2(x, y, 48) > 0.97 ? 1.5 : 0)] : null);
  CUR_D = 0.8; for (let a = -Math.PI; a <= 0.52; a += 0.012) { for (let rr = 14; rr < 19; rr++) { const x = cx + Math.cos(a) * rr, y = 70 + Math.sin(a) * rr; const seg = Math.floor((a + Math.PI) / 0.33); put(x, y, seg & 1 ? R.stripeR : R.stripeO, 4.2 + (rr === 18 ? -1.4 : 0) + (rr === 14 ? 1.2 : 0)); } } }
// Balustrade
CUR_D = 0.75;
rect(0, 104, W, 18, (x, y) => { if (y < 107) return [R.stripeO, 5.6 - (y - 104)]; if (y > 118) return [R.sand, 4.8 - (y - 118) * 0.8]; const p = x % 12; return p < 4 ? [R.sand, 4.2 + (p === 0 ? 1.4 : 0)] : [R.night, 0.8]; });

// ---- untere Arkade: große Hufeisenbögen mit gestreiften Keilsteinen, Säulen; dahinter die verkohlte Halle
CUR_D = 0.7;
rect(0, 122, W, FLOOR - 122, (x, y) => [((y >> 3) & 1) ? R.stripeO : R.sand, 3.6 + fbm(x * 0.03, y * 0.05, 49) * 1.8 + ((y & 7) === 0 ? -1.1 : 0) - (y > 250 ? (y - 250) * 0.05 : 0)]);
const ARCH = [100, 220, 340, 460, 580];
for (const cx of ARCH) { const r = 46, cy = 184, inside = horseshoe(cx, cy, r, FLOOR);
  CUR_D = 1;   // tiefe Halle: Regalgerippe, verkohlt, im Dunst
  rect(cx - r - 2, cy - r - 2, 2 * r + 4, FLOOR - cy + r + 2, (x, y) => { if (!inside(x, y)) return null; const sx = (x + 7) % 26, shelf = sx < 3, board = (y % 18) < 2 && y > 150;
    if (shelf || board) return [R.char, 1.6 + (shelf && sx === 2 ? 0.9 : 0) + fbm(x * 0.1, y * 0.1, 50)]; return [R.night, 0.9 + Math.max(0, (y - 150) / 120) * 1.2 + fbm(x * 0.04, y * 0.04, 51) * 0.8]; });
  CUR_D = 0.68; for (let a = -Math.PI - 0.52; a <= 0.52; a += 0.008) { for (let rr = r; rr < r + 10; rr++) { const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; const seg = Math.floor((a + Math.PI + 0.52) / 0.27);
      put(x, y, seg & 1 ? R.stripeR : R.stripeO, 4.6 + (rr === r + 9 ? -1.6 : 0) + (rr === r ? 1.4 : 0) + (Math.abs(((a + Math.PI + 0.52) % 0.27)) < 0.012 ? -1.6 : 0)); } } }
// Säulen mit Kapitell und Basis
for (const cx of [40, 160, 280, 400, 520, 640]) { CUR_D = 0.65;
  rect(cx - 6, 150, 13, FLOOR - 150, (x, y) => [R.sand, 3.2 + Math.sin((x - cx + 6) / 12 * Math.PI) * 2.6 - (y > FLOOR - 10 ? 1 : 0)]);
  rect(cx - 10, 142, 21, 10, (x, y) => [R.stripeO, 5.4 - (y - 142) * 0.3 + ((x + y) % 4 === 0 ? -1 : 0)]); rect(cx - 9, FLOOR - 8, 19, 8, (x, y) => [R.sand, 4.6 - (y - FLOOR + 8) * 0.3]); }
// Baugerüst in der Halle (hinter der Arkade sichtbar, und ein Mast vorn rechts)
CUR_D = 0.9; for (const gx of [300, 470]) { rect(gx, 20, 3, FLOOR - 20, (x, y) => [R.steel, x === gx ? 4.4 : 2.4]); }
for (let y = 60; y < FLOOR; y += 52) line(300, y, 470, y + 6, () => [R.steel, 3.2]);
line(300, 60, 470, 112, () => [R.steel, 2.6]); line(300, 164, 470, 112, () => [R.steel, 2.6]);

// ---- Boden: Steinplatten, nass, Pfützen
CUR_D = 0.35;
rect(0, FLOOR, W, H - FLOOR, (x, y) => { const t = (y - FLOOR) / (H - FLOOR), vx = 320 + (x - 320) / (0.35 + t * 0.65), row = Math.floor(Math.pow(t, 0.7) * 9), col = Math.floor(vx / 42);
  const seam = Math.abs(vx % 42) < 1.2 / (0.35 + t) || Math.abs(Math.pow(t, 0.7) * 9 - row) < 0.06; CUR_D = 0.35 - t * 0.33;
  return [R.floorS, 2.4 + t * 1.2 + (h2(col, row, 52) - 0.5) * 1.4 + fbm(x * 0.05, y * 0.12, 53) * 0.8 - (seam ? 1.3 : 0)]; });
function puddle(cx, cy, rx, ry) { ellipse(cx, cy, rx, ry, (x, y, dx, dy) => { PUD[y * W + x] = 1; return [R.wet, 1.6 + (1 - dx * dx - dy * dy) * 1.2]; }); }
puddle(232, 322, 40, 5); puddle(430, 334, 30, 4); puddle(120, 344, 26, 4); puddle(560, 306, 22, 3);
// verstreute Seiten und verkohlte Bücher
for (let k = 0; k < 18; k++) { const px = Math.floor(60 + h2(k, 1, 54) * 520), py = Math.floor(FLOOR + 8 + h2(k, 2, 54) * 70), w = 4 + Math.floor(h2(k, 3, 54) * 4); CUR_D = 0.2;
  rect(px, py, w, 2, (x, y) => [h2(k, 4, 54) > 0.4 ? R.paper : R.char, h2(k, 4, 54) > 0.4 ? 4.4 - (y - py) : 2]); }

// ---- Ausleihtheke: schwarz verkohltes Holz, Messingleiste, das Buch, die Kerze
CUR_D = 0.25;
poly([[156, 210], [304, 210], [300, 216], [160, 216]], (x, y) => [R.woodK, 3.2 + (y === 210 ? 1.4 : 0) + fbm(x * 0.2, y, 55) * 0.8]);   // Platte
rect(160, 216, 141, 2, (x, y) => [R.brass, y === 216 ? 6.8 : 4.4]);
rect(160, 218, 141, FLOOR + 8 - 218, (x, y) => { const p = (x - 160) % 47, frame = p < 4 || p > 43 || y < 224 || y > FLOOR + 2; const burn = fbm(x * 0.07, y * 0.09, 56);
  return [burn > 0.62 ? R.char : R.woodK, (frame ? 3 : 2.1) + (p === 4 || y === 224 ? -1 : 0) + (p === 43 ? 1 : 0) + (burn > 0.62 ? -0.4 : 0) - (y > FLOOR ? 0.8 : 0)]; });
// das Buch (Rilke, aufgeschlagen), Seiten hell, Ränder verkohlt
poly([[200, 206], [226, 204], [228, 209], [202, 211]], (x, y, xa, xb) => { const u = (x - xa) / Math.max(1, xb - xa); return [u > 0.94 || u < 0.06 ? R.char : R.paper, 5.4 - Math.abs(u - 0.5) * 2.4 - (Math.abs(u - 0.5) < 0.04 ? 1.6 : 0)]; });
rect(201, 209, 27, 2, (x, y) => [R.book, 3]);
// Kerze in einem Glas
rect(266, 196, 4, 14, (x, y) => [R.candle, x === 267 ? 6.4 : 4.6 - (y - 196) * 0.1]); rect(264, 206, 8, 4, (x, y) => [R.steel, x === 264 ? 5 : 3.4]);
ellipse(268, 191, 1.6, 3.6, (x, y, dx, dy) => [R.flame, 3.4 + (1 - Math.abs(dy)) * 1.6, 1]); put(268, 195, R.flame, 2, 1);
const CANDLE = [268, 191];

// ---- verkohlter Bücherstapel rechts, Planke
CUR_D = 0.3; for (let i = 0; i < 7; i++) rect(468 + (i % 2) * 3, 288 - i * 5, 40 - i * 2, 5, (x, y) => [i % 3 ? R.book : R.char, (y === 288 - i * 5 ? 3.4 : 1.8) + fbm(x * 0.3, y, 57 + i) * 0.8]);

// Figuren werden erst in 320 × 180 eingesetzt; hier nur Markos Schatten und Malas Lichtmitte (in 640er Koordinaten)
function shadowAt(fx, fy, rx, len) { for (let y = fy - 2; y < fy + 4; y++) for (let x = fx - rx - len; x <= fx + rx; x++) { const dx = (x - fx + len * 0.5 * Math.max(0, (fy + 4 - y) / 6)) / (rx + len * 0.5), dy = (y - fy - 0.5) / 3.2; if (dx * dx + dy * dy <= 1) addLev(x, y, -2.0 * (1 - dx * dx * 0.5)); } }
shadowAt(372 + 14, 318, 16, 24);
const MALA_C = [126, 248];

// ---- Vordergrund: Gerüstmast und herabhängende Plane links, umgestürzter Balken und Bücher rechts (Silhouetten)
CUR_D = 0; CUR_FG = 1;
rect(14, 0, 14, H, (x, y) => [R.sil, 1.2 + (x === 27 ? 1.4 : 0) + (x === 14 ? -0.6 : 0)]);
for (let y = 0; y < H; y += 74) rect(10, y + 30, 22, 6, (x, yy) => [R.sil, yy === y + 30 ? 2.2 : 0.8]);
poly([[0, 0], [118, 0], [96, 40], [74, 96], [58, 150], [36, 168], [0, 190]], (x, y) => [R.tarp, 1.6 + Math.sin(x * 0.16 + y * 0.04) * 0.9 + Math.sin(x * 0.05 - y * 0.02) * 0.6]);
poly([[0, 300], [92, 334], [104, 360], [0, 360]], (x, y) => [R.sil, 1 + (y < 304 + x * 0.36 ? 1.2 : 0)]);
poly([[640, 270], [640, 300], [500, 360], [462, 360]], (x, y) => [R.sil, 1.1]);
for (let i = 0; i < 6; i++) rect(560 + (i % 2) * 6, 352 - i * 9, 80 - i * 4, 9, (x, y) => [R.sil, (y === 352 - i * 9 ? 2 : 0.9)]);
CUR_FG = 0;

// ================================================================ Licht, Nebel, Leuchten (über den Pixeln, nicht in Palettenstufen)
const DITH = 0.5, base = new Float32Array(W * H * 3), GH = new Float32Array(W * H * 4);
for (let i = 0; i < W * H; i++) { const m = MAT[i]; if (m < 0) continue; const Rm = RAMPS[m], x = i % W, y = (i / W) | 0;
  const q = clamp(Math.round(LEV[i] + (bay(x, y) - 0.5) * DITH), 0, Rm.n - 1), c = Rm.cols[q]; base[i * 3] = c[0] / 255; base[i * 3 + 1] = c[1] / 255; base[i * 3 + 2] = c[2] / 255; }
// Mala: Helligkeit in kalten Geisterfarben, zu zwei Dritteln deckend, heller Saum
const gr = RAMPS[R.ghost];
for (const [x, y, m, l, edge] of GHOST) { if (x < 0 || y < 0 || x >= W || y >= H) continue; const Rm = RAMPS[m], q = clamp(Math.round(l + (bay(x, y) - 0.5) * DITH), 0, Rm.n - 1), c = Rm.cols[q];
  const lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255, g = gr.cols[clamp(Math.round(lum * 12 + 2 + (edge ? 3 : 0)), 0, gr.n - 1)], i = y * W + x; GH[i * 4] = g[0] / 255; GH[i * 4 + 1] = g[1] / 255; GH[i * 4 + 2] = g[2] / 255; GH[i * 4 + 3] = edge ? 0.9 : 0.62; }
// Lichtkegel des Mondes: von der Kuppelöffnung schräg nach links unten
const shaftU = (x, y) => x + 0.47 * y;
function shaft(x, y) { const u = shaftU(x, y), a = 336, b = 452; if (y > FLOOR + 40) return 0; const e = Math.min((u - a) / 26, (b - u) / 26); if (e <= 0) return 0;
  const streak = 0.55 + 0.45 * vn(u * 0.09, 0.5, 60) * (0.6 + 0.4 * vn(u * 0.31, y * 0.004, 61)); return Math.min(1, e) * streak * (y < 44 ? 0.6 : 1) * (1 - Math.max(0, y - FLOOR) / 60); }
const MOON = [0.55, 0.72, 1.0], WARM = [1.0, 0.6, 0.28], GLOW = [0.45, 0.88, 0.95], AMB = [0.2, 0.25, 0.4], FOG = [0.07, 0.1, 0.19];
const col = new Float32Array(W * H * 3);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, d = DEPTH[i], fg = FG[i];
  const s = fg ? 0 : shaft(x, y), dc = Math.hypot(x - CANDLE[0], (y - CANDLE[1]) * 1.15), dm = Math.hypot(x - MALA_C[0], (y - MALA_C[1]) * 0.8);
  const kc = Math.pow(Math.max(0, 1 - dc / 200), 2) * 2.2 * (d > 0.9 ? 0.15 : (d > 0.5 ? 0.45 : 1)), km = Math.pow(Math.max(0, 1 - dm / 120), 2) * 0.9 * (d > 0.9 ? 0.3 : 1), ks = s * (y > FLOOR - 4 ? 2.6 : 1.7);
  for (let k = 0; k < 3; k++) { let L = AMB[k] * (fg ? 0.55 : 1) * (1 - Math.max(0, 0.35 - y / 360) ) * (d > 0.6 ? 0.75 : 1) + MOON[k] * ks + WARM[k] * kc + GLOW[k] * km; let c = base[i * 3 + k] * L;
    // Geist darüber, leuchtet selbst
    if (GH[i * 4 + 3] > 0) c = c * (1 - GH[i * 4 + 3]) + GH[i * 4 + k] * GH[i * 4 + 3] * 1.05;
    // Nebel in der Tiefe (unten dichter), Streulicht im Kegel, Halos um Kerze und Mala
    const fogK = Math.pow(d, 1.2) * (0.6 + Math.max(0, (y - 120) / 150) * 0.6);
    c = c * (1 - fogK * 0.55) + FOG[k] * fogK * 1.6;
    if (!fg) c += MOON[k] * s * 0.26 + WARM[k] * Math.exp(-dc * dc / (2 * 16 * 16)) * 0.55 + WARM[k] * Math.exp(-dc * dc / (2 * 70 * 70)) * 0.08 + GLOW[k] * Math.exp(-dm * dm / (2 * 46 * 46)) * 0.1;
    if (MAT[i] >= 0 && EMI[i] && RAMPS[MAT[i]] === RAMPS[R.flame]) c = base[i * 3 + k] * 1.4;
    col[i * 3 + k] = c; }
  // Randlicht vom Mond auf den Vordergrund-Silhouetten (Kante zur Öffnung hin)
  if (fg && (x + 1 < W && !FG[i + 1] || y > 0 && !FG[i - W])) { const s2 = shaft(Math.min(W - 1, x + 3), y); for (let k = 0; k < 3; k++) col[i * 3 + k] += MOON[k] * (0.12 + s2 * 0.4); } }
// Pfützen spiegeln, was darüber ist (gekräuselt), und den Mond
for (let y = FLOOR; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!PUD[i]) continue; const ry = 2 * FLOOR - y + 10 + Math.round(Math.sin(x * 0.45 + y * 1.3) * 0.6); if (ry < 0) continue; const j = ry * W + x;
  for (let k = 0; k < 3; k++) col[i * 3 + k] = col[i * 3 + k] * 0.5 + col[j * 3 + k] * 0.38 + MOON[k] * shaft(x, j / W | 0) * 0.15; }
// Regen und Staub im Lichtkegel (scharfe Punkte und kurze Striche)
for (let k = 0; k < 900; k++) { const y = Math.floor(h2(k, 7, 62) * FLOOR), x = Math.floor(h2(k, 8, 62) * W), s = shaft(x, y); if (s < 0.25) continue; const i = y * W + x; if (FG[i]) continue;
  if (k % 3) { for (let t = 0; t < 5; t++) { const yy = y + t * 2, xx = x - t; if (yy >= H || xx < 0) break; const j = yy * W + xx; for (let c = 0; c < 3; c++) col[j * 3 + c] += MOON[c] * 0.18 * s; } }
  else for (let c = 0; c < 3; c++) col[i * 3 + c] += MOON[c] * 0.55 * s; }
// Lichtpunkte um Mala und Glutfunken über dem Bücherstapel
for (let k = 0; k < 26; k++) { const x = Math.floor(MALA_C[0] - 26 + h2(k, 9, 63) * 52), y = Math.floor(MALA_C[1] - 70 + h2(k, 10, 63) * 130), i = y * W + x; for (let c = 0; c < 3; c++) col[i * 3 + c] += GLOW[c] * (0.5 + h2(k, 11, 63) * 0.5); }
for (let k = 0; k < 10; k++) { const x = Math.floor(472 + h2(k, 12, 64) * 40), y = Math.floor(240 + h2(k, 13, 64) * 40), i = y * W + x; for (let c = 0; c < 3; c++) col[i * 3 + c] += WARM[c] * 0.9; }
// Abbildung auf den Bildschirm (weiche Schulter) und Vignette
const tone = v => { v = Math.max(0, v); return v * (1 + v / 4) / (1 + v); };
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, vg = 1 - 0.45 * Math.pow(Math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2)) / 1.414, 2.2); for (let k = 0; k < 3; k++) col[i * 3 + k] = tone(col[i * 3 + k] * 1.18) * vg; }
function blur(src, w, h, r, passes) { let a = Float32Array.from(src), b = new Float32Array(src.length); for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) for (let k = 0; k < 3; k++) { let acc = 0; for (let x = -r; x <= r; x++) acc += a[(y * w + clamp(x, 0, w - 1)) * 3 + k];
      for (let x = 0; x < w; x++) { b[(y * w + x) * 3 + k] = acc / (2 * r + 1); acc += a[(y * w + clamp(x + r + 1, 0, w - 1)) * 3 + k] - a[(y * w + clamp(x - r, 0, w - 1)) * 3 + k]; } }
    for (let x = 0; x < w; x++) for (let k = 0; k < 3; k++) { let acc = 0; for (let y = -r; y <= r; y++) acc += b[(clamp(y, 0, h - 1) * w + x) * 3 + k];
      for (let y = 0; y < h; y++) { a[(y * w + x) * 3 + k] = acc / (2 * r + 1); acc += b[(clamp(y + r + 1, 0, h - 1) * w + x) * 3 + k] - b[(clamp(y - r, 0, h - 1) * w + x) * 3 + k]; } } } return a; }
function bil(a, w, h, fx, fy, k) { const x = clamp(fx, 0, w - 1.001), y = clamp(fy, 0, h - 1.001), x0 = Math.floor(x), y0 = Math.floor(y), u = x - x0, v = y - y0, i00 = (y0 * w + x0) * 3 + k, i10 = i00 + 3, i01 = i00 + w * 3, i11 = i01 + 3;
  return (a[i00] * (1 - u) + a[i10] * u) * (1 - v) + (a[i01] * (1 - u) + a[i11] * u) * v; }
// ================================================================ Figuren von Hand (Legende: Zeichen → Farbe), Licht von links (Kerze)
const FPAL = {"K": "#120f18", "h": "#1c140f", "H": "#33241a", "i": "#54392a", "q": "#5e3426", "s": "#94583a", "S": "#c07c58", "t": "#e0a47c", "b": "#7a5040", "e": "#160f12", "m": "#5a2420", "w": "#d8cfc8", "c": "#121729", "C": "#1b2540", "D": "#2a3a60", "E": "#41588a", "F": "#6a82b0", "g": "#5e6270", "G": "#9ea2ae", "p": "#15141c", "P": "#272734", "Q": "#3c3c4e", "o": "#24130c", "O": "#56301e", "u": "#82502e", "y": "#b0b4be", "j": "#1c2c4a", "J": "#2c4670", "L": "#4a6a9c", "M": "#7092c4", "x": "#3a3a42", "X": "#646470", "Z": "#9a9aa6", "n": "#16203a", "N": "#25365a", "V": "#3a5080", "k": "#8a8478", "l": "#d6d0c0", "r": "#f2eee2", "a": "#22140c", "A": "#4a2c18", "B": "#74462a", "f": "#a46a4c", "T": "#dca888", "U": "#f0c8a8"};
const SPR_MARKO = [
"..........KKKKK.........",
"........KKhhhhhK........",
".......KhHHiHHhhK.......",
".......KhHiiHHhhhK......",
"......KhHHHHHhhhhK......",
"......KHttSShhhhhK......",
".....KthhShhhSshhK......",
".....KteStSeSSsssK......",
"....KttSSSSSSsssqK......",
".....KsbSSSSbssqK.......",
".....KbmmmbbbsqK........",
"......KbbbbbbqK.........",
".......KsSSsqK..........",
"....KKKFEgGgCcKK........",
"...KFEEEKgGgKCCcK.......",
"..KFEEEDKgGgKDCCcK......",
"..KEEEDDDKgKDDCCccK.....",
".KFEEDDDDKgKDDCCcccK....",
".KEEEDDDDDKDDDCCcccK....",
".KEEDDDDDDyDDDCCccccK...",
".KEEDKDDDDDDDCCCKcccK...",
".KEEDKDDDDDDDCCCKcccK...",
".KEDDKDDDDyDDCCCKcccK...",
".KEDDKDDDDDDDCCCKcccK...",
".KEDDKDDDDDDCCCCKccK....",
".KEDDKDDDDDDCCCCKccK....",
".KEDDKDDDDyDCCCCKccK....",
".KEDDKEDDDDDCCCCKccK....",
".KEDDKEDDDDDCCCCKKKK....",
".KtSSKEDDDDDCCCCcK......",
".KtSSsKDDDDDCCCCcK......",
".KtSSsKDDDDDCCCCcK......",
"..KSsKKEDDDDCCCCcK......",
"...KK.KEDDDDDCCCcK......",
"......KEDDDDDCCCccK.....",
"......KEDDDDDCCCccK.....",
"......KEDDDDDCCCccK.....",
"......KEDDDDDCCCccK.....",
"......KEDDDDCCCCccK.....",
"......KEDDDDCCCCccK.....",
"......KEDDDDCCCCccK.....",
"......KKEDDDCCCcccK.....",
"......KKKKKKKKKKKKK.....",
"......KQPPpKPPPppK......",
"......KQPPpKPPPppK......",
"......KQPPpKQPPppK......",
"......KQPPpKQPPppK......",
"......KQPPpKQPPppK......",
"......KQPPpKQPPppK......",
"......KQPPpKQPPpK.......",
"......KQPPpKQPPpK.......",
"......KQPPpKQPPpK.......",
"......KQPPpKQPPpK.......",
"......KQPPpKQPPpK.......",
"......KQPPKKQPPpK.......",
".....KKQPPK.KQPPK.......",
"....KuOOOOK.KuOOOK......",
"...KuOOOOOK.KuOOOOK.....",
"...KOOOOOoK.KOOOOoK.....",
"...KKKKKKKK.KKKKKKK....."];
const SPR_MALA = [
"........KKKKK.........",
"......KKaAAAaKK.......",
".....KaABBBBAAaK......",
"....KaBBAAAAAAAaK.....",
"....KaAAaaaaaAAAK.....",
"....KAUUTTTTaAAaK.....",
"....KUUTTTTTTaAaK.....",
"...KUaaTTaaTTfAaK.....",
"...KUTeTTTTeTffAaK....",
"..KUUTTTTTTTTffaAaK...",
"..KUTTTTTTTTffaaAaK...",
"...KTTTmmTTffaKAaK....",
"....KTTTTTffaKKAaK....",
".....KKTTffKKXKAaK....",
"......KXZZXXXXKAaK....",
"....KKZZZZXXXxxKaK....",
"...KMLZZZXXxxJJKaK....",
"..KMMLLZXXxxJJjjKK....",
"..KMLLLLXxJJJjjjjK....",
".KMLLLLLXxJJJJjjjK....",
".KMLLLLLLXJJJJjjjjK...",
".KMLLLLLLXJJJJjjjjK...",
".KMLLKLLLXJJJJKjjjK...",
".KMLLKLLLXJJJJKjjjK...",
".KMLLKLLLyJJJJKjjjK...",
".KMLLKLLLLJJJJKjjjK...",
".KMLLKLLLLJJJJKjjK....",
".KMLLKLLLLyJJJKjjK....",
".KLLLKLLLLJJJJKjjK....",
".KTUTKLLLLJJJJKjjK....",
".KTUTKMMLLLLJJKTfK....",
"..KTKKKKKKKKKKKKfK....",
"..KK.KVVNNKKNNNKK.....",
".....KVVNNnKNNNnK.....",
".....KVVNNnKVNNnK.....",
".....KVVNNnKVNNnK.....",
".....KVVNNnKVNNnK.....",
".....KVVNNnKVNNnK.....",
".....KVVNNnKVNNnK.....",
".....KVVNNnKVNNnK.....",
".....KVVNNKKVNNnK.....",
".....KVVNNK.KVNNK.....",
".....KVVNNK.KVNNK.....",
"....KKrrrlK.KrrrlK....",
"...KrrrrllK.KrrrrlK...",
"...KkkkkkkK.KkkkkkK...",
"...KKKKKKKK.KKKKKKK..."];
const hexc = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
// Kontur nur, wo nötig: außen die dunkelste Farbe der Fläche daneben statt Schwarz, unten und zur Schattenseite Schwarz
function selout(rows) { const h = rows.length, w = rows[0].length, g = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? '.' : rows[y][x];
  const dark = { E: 'C', F: 'D', D: 'C', C: 'c', G: 'g', t: 's', S: 's', s: 'q', T: 'f', U: 'f', L: 'J', M: 'J', Z: 'X', X: 'x', h: 'h', H: 'h', i: 'h', a: 'a', A: 'a', B: 'A', Q: 'P', P: 'p', V: 'N', N: 'n', r: 'k', l: 'k', O: 'o', u: 'O', J: 'j' };
  return rows.map((r, y) => r.split('').map((ch, x) => { if (ch !== 'K') return ch; const nb = [g(x + 1, y), g(x, y - 1), g(x - 1, y)].filter(c => c !== '.' && c !== 'K');
    const below = g(x, y + 1) === '.' || g(x, y + 1) === 'K'; if (!nb.length || (below && y > h - 6)) return 'K'; const n = nb[0]; const d = dark[n]; return (x < w * 0.55 && d && g(x + 1, y) !== '.' ) ? d : 'K'; }).join('')); }
const MK = selout(SPR_MARKO), ML = selout(SPR_MALA);

// ---- auf 320 × 180: Hintergrund aus dem 640er Bild (je 2 × 2 gemittelt)
const W2 = W / 2, H2 = H / 2, S2 = 6, OW2 = W2 * S2, OH2 = H2 * S2, c2 = new Float32Array(W2 * H2 * 3);
for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) for (let k = 0; k < 3; k++) { let a = 0; for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) a += col[((2 * y + dy) * W + 2 * x + dx) * 3 + k]; c2[(y * W2 + x) * 3 + k] = a / 4; }
// Figur einsetzen: Farbe × Licht der Szene an dieser Stelle; Saum: Kerze warm auf der ihr zugewandten Kante, Mond kalt auf der anderen
function placeFig(rows, fx, fy, flip, ghost) { const h = rows.length, w = rows[0].length, x0 = fx - (w >> 1), y0 = fy - h + 1, tr = (x, y) => { const c = rows[y] && rows[y][flip ? w - 1 - x : x]; return !c || c === '.'; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (tr(x, y)) continue; const ch = rows[y][flip ? w - 1 - x : x], X = x0 + x, Y = y0 + y; if (X < 0 || Y < 0 || X >= W2 || Y >= H2) continue;
    const b = hexc(FPAL[ch]), PX = 2 * X + 1, PY = 2 * Y + 1, dc = Math.hypot(PX - CANDLE[0], (PY - CANDLE[1]) * 1.15), s = shaft(PX, PY);
    const kc = Math.pow(Math.max(0, 1 - dc / 210), 2) * 2.3, toCandle = (CANDLE[0] < PX) ? tr(x - (flip ? -1 : 1) * 0, y) : false;
    const edgeL = tr(x - 1, y), edgeR = tr(x + 1, y), edgeT = tr(x, y - 1), candleSide = CANDLE[0] < PX ? edgeL : edgeR, moonSide = CANDLE[0] < PX ? edgeR : edgeL;
    const i = (Y * W2 + X) * 3;
    for (let k = 0; k < 3; k++) { let L = AMB[k] * 1.1 + WARM[k] * kc + MOON[k] * s * 1.6; if (candleSide) L += WARM[k] * kc * 0.9; if (moonSide || edgeT) L += MOON[k] * 0.35;
      let v = b[k] * L; if (ghost) { const lum = b[0] * 0.3 + b[1] * 0.59 + b[2] * 0.11, g = [0.35 + lum * 0.55, 0.62 + lum * 0.38, 0.72 + lum * 0.3][k] * (edgeL || edgeR || edgeT ? 1.15 : 0.92); v = c2[i + k] * 0.32 + g * 0.66; }
      c2[i + k] = tone(v * 1.1); } } }
const MK_F = [186, 159], ML_F = [63, 152];
placeFig(MK, MK_F[0], MK_F[1], false, false);
placeFig(ML, ML_F[0], ML_F[1], true, true);
// Lichtpunkte um Mala (auf dem groben Raster)
for (let k = 0; k < 14; k++) { const x = Math.floor(ML_F[0] - 12 + h2(k, 21, 70) * 24), y = Math.floor(ML_F[1] - 50 + h2(k, 22, 70) * 56), i = (y * W2 + x) * 3; if (h2(k, 23, 70) < 0.5) continue; for (let c = 0; c < 3; c++) c2[i + c] = Math.min(1, c2[i + c] + GLOW[c] * 0.45); }

// ---- Leuchten auf 320 × 180, Text 1 : 1 in der Spielschrift (wie im Spiel), Ausgabe sechsfach
const br2 = new Float32Array(W2 * H2 * 3); for (let i = 0; i < W2 * H2; i++) { const l = c2[i * 3] * 0.3 + c2[i * 3 + 1] * 0.59 + c2[i * 3 + 2] * 0.11, f = Math.max(0, l - 0.5) / Math.max(0.001, l); for (let k = 0; k < 3; k++) br2[i * 3 + k] = c2[i * 3 + k] * f; }
const g1 = blur(br2, W2, H2, 1, 3), g2 = blur(br2, W2, H2, 5, 3);
const TXT = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'hdmodern', 'textmaske.json'), 'utf8'));
const TM2 = new Uint8Array(W2 * H2), TO2 = new Uint8Array(W2 * H2);
TXT.forEach((rows, li) => { const tw = rows[0].length, x0 = Math.round(W2 * 0.44 - tw / 2), y0 = 42 + li * 11; rows.forEach((r, ry) => { for (let rx = 0; rx < r.length; rx++) if (r[rx] === '#') TM2[(y0 + ry) * W2 + x0 + rx] = 1; }); });
for (let y = 1; y < H2 - 1; y++) for (let x = 1; x < W2 - 1; x++) if (!TM2[y * W2 + x] && (TM2[y * W2 + x - 1] || TM2[y * W2 + x + 1] || TM2[(y - 1) * W2 + x] || TM2[(y + 1) * W2 + x] || TM2[(y - 1) * W2 + x - 1] || TM2[(y + 1) * W2 + x + 1])) TO2[y * W2 + x] = 1;
const tg = new Float32Array(W2 * H2 * 3); for (let i = 0; i < W2 * H2; i++) if (TM2[i]) { tg[i * 3] = tg[i * 3 + 1] = tg[i * 3 + 2] = 1; } const tgl = blur(tg, W2, H2, 2, 3);
const TXC2 = [0.74, 0.95, 1.0], out2 = Buffer.alloc(OW2 * OH2 * 3);
for (let Y = 0; Y < OH2; Y++) for (let X = 0; X < OW2; X++) { const x = (X / S2) | 0, y = (Y / S2) | 0, i = y * W2 + x, fx = (X + 0.5) / S2 - 0.5, fy = (Y + 0.5) / S2 - 0.5, o = (Y * OW2 + X) * 3;
  for (let k = 0; k < 3; k++) { let c = c2[i * 3 + k] + bil(g1, W2, H2, fx, fy, k) * 0.5 + bil(g2, W2, H2, fx, fy, k) * 0.65 + bil(tgl, W2, H2, fx, fy, k) * TXC2[k] * 0.35;
    if (TO2[i]) c = c * 0.25 + 0.01; if (TM2[i]) c = TXC2[k]; out2[o + k] = clamp(Math.round(c * 255), 0, 255); } }
function writeRGB2(file, w, h, rgb) { const raw = Buffer.alloc((w * 3 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])); }
writeRGB2(path.join(OUT, 'figuren_modern_1920x1080.png'), OW2, OH2, out2);
// Figurenbogen: beide Figuren ohne Licht, achtfach
{ const SC = 10, bw = (MK[0].length + ML[0].length + 6) * SC, bh = (MK.length + 4) * SC, bb = Buffer.alloc(bw * bh * 3); for (let i = 0; i < bw * bh; i++) { bb[i * 3] = 70; bb[i * 3 + 1] = 66; bb[i * 3 + 2] = 80; }
  const draw = (rows, ox, oy) => rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (ch === '.') return; const c = hexc(FPAL[ch]); for (let yy = 0; yy < SC; yy++) for (let xx = 0; xx < SC; xx++) { const o = (((oy + y) * SC + yy) * bw + (ox + x) * SC + xx) * 3; bb[o] = c[0] * 255; bb[o + 1] = c[1] * 255; bb[o + 2] = c[2] * 255; } }));
  draw(MK, 2, 2); draw(ML, MK[0].length + 4, 2 + MK.length - ML.length); writeRGB2(path.join(OUT, 'figuren_bogen.png'), bw, bh, bb); }
console.log('Musterbild', path.join(OUT, 'figuren_modern_1920x1080.png'));
