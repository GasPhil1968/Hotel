// Musterbilder „neuer Stil“ für MALA an vier Orten aus vier Kapiteln: Split (Riva bei Nacht), Sarajevo (Baščaršija im Abendnebel),
// Mostar (Alte Brücke im Regen), München (Gleis 11 im Schnee). Grobe Pixelgröße 320 × 180, sechsfach; von Hand gepixelte Figuren
// (aus design/tools/hd_figuren_beispiel.js), weiches farbiges Licht über den Pixeln, Nebel, Regen und Schnee, Leuchten.
// Eigenständig, ändert am Spiel nichts.
//   node design/tools/hd_orte_beispiel.js [ausgabeordner]  → ort_split.png, ort_sarajevo.png, ort_mostar.png, ort_muenchen.png
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const OUT = process.argv[2] || path.join(__dirname, '..', 'hdmodern'); fs.mkdirSync(OUT, { recursive: true });
const W = 320, H = 180, S = 6, OW = W * S, OH = H * S;
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
function blur(src, w, h, r, passes) { let a = Float32Array.from(src), b = new Float32Array(src.length); for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) for (let k = 0; k < 3; k++) { let acc = 0; for (let x = -r; x <= r; x++) acc += a[(y * w + clamp(x, 0, w - 1)) * 3 + k];
      for (let x = 0; x < w; x++) { b[(y * w + x) * 3 + k] = acc / (2 * r + 1); acc += a[(y * w + clamp(x + r + 1, 0, w - 1)) * 3 + k] - a[(y * w + clamp(x - r, 0, w - 1)) * 3 + k]; } }
    for (let x = 0; x < w; x++) for (let k = 0; k < 3; k++) { let acc = 0; for (let y = -r; y <= r; y++) acc += b[(clamp(y, 0, h - 1) * w + x) * 3 + k];
      for (let y = 0; y < h; y++) { a[(y * w + x) * 3 + k] = acc / (2 * r + 1); acc += b[(clamp(y + r + 1, 0, h - 1) * w + x) * 3 + k] - b[(clamp(y - r, 0, h - 1) * w + x) * 3 + k]; } } } return a; }
function bil(a, w, h, fx, fy, k) { const x = clamp(fx, 0, w - 1.001), y = clamp(fy, 0, h - 1.001), x0 = Math.floor(x), y0 = Math.floor(y), u = x - x0, v = y - y0, i00 = (y0 * w + x0) * 3 + k, i10 = i00 + 3, i01 = i00 + w * 3, i11 = i01 + 3;
  return (a[i00] * (1 - u) + a[i10] * u) * (1 - v) + (a[i01] * (1 - u) + a[i11] * u) * v; }
// ================================================================ Figuren von Hand (Legende: Zeichen → Farbe); Marko sieht nach links, Mala nach rechts
const FPAL = {"K": "#0e0b13", "h": "#16100c", "H": "#2a1c14", "i": "#43301f", "j": "#634631", "q": "#4a281d", "s": "#7a4631", "S": "#a4664a", "t": "#c98a66", "T": "#e6ad88", "b": "#7c5444", "d": "#58382c", "e": "#140c0e", "w": "#cdc1b8", "m": "#80382e", "c": "#0d1220", "C": "#161e36", "D": "#223152", "E": "#354b7a", "F": "#566fa0", "v": "#25232d", "V": "#3c3946", "g": "#6e727e", "G": "#adb1bc", "p": "#101016", "P": "#1f1f29", "Q": "#30303c", "R": "#454554", "o": "#190d08", "O": "#3f2318", "u": "#673b25", "U": "#94593a", "y": "#8e94a2", "a": "#1e120b", "A": "#3e2414", "B": "#633a20", "I": "#8a5530", "f": "#8e5a44", "k": "#b57c62", "l": "#d9a486", "n": "#f0c6a8", "J": "#1a2944", "L": "#2a4068", "M": "#40608f", "N": "#6486b8", "x": "#3c3b44", "X": "#5e5d68", "Z": "#8a8996", "z": "#b4b3be", "r": "#121a2e", "W": "#20304e", "Y": "#33486e", "1": "#77736a", "2": "#bdb7a8", "3": "#ece8dc", "4": "#5a1f22", "5": "#b88566", "6": "#8a5844"};
const SPR_MARKO = [
"...........KKKK...........",
".........KKjjiiKK.........",
"........KjjiiiHHhK........",
".......KjiiiHHHHHhK.......",
".......KiiHHHHHHhhhK......",
"......KiHHHHHHHhhhhK......",
"......KHTTTtHHHhhhhK......",
"......KTTTTTttSHhhhK......",
"......KTiiTTiiSSshhK......",
"......KTTeTTeTSssshK......",
".....KTTTTTtSSSsshK.......",
"......KTSTTttSSssK........",
"......K5TSSSt6SsK.........",
"......K55TT56SSqK.........",
".......KK5566sqK..........",
"........KsSSsqK...........",
"......KKEFKgGgKCcKK.......",
"....KKFFEEKgGgKDCccKK.....",
"...KFFEEEKvVVvKDDCccK.....",
"..KFFEEEDKvVVvKDDCCccK....",
"..KFEEEDDKvVvKDDDCCccK....",
".KFFEEDDDDKvvKDDDCCcccK...",
".KFEEEDDDDKvKDDDDCCcccK...",
".KFEEDDDDDDKyDDDDCCccccK..",
".KFEEDKDDDDKDDDDCCcKcccK..",
".KFEEDKEDDDKDDDDCCcKcccK..",
".KEEDDKEDDDKyDDDCCcKcccK..",
".KEDDDKEEDDKDDDDCCcKccK...",
".KFDDDKEEDDKDDDDCCcKccK...",
".KEEDDKEDDDKDDDDCCcKccK...",
".KEEDDKEDDDKyDDDCCcKccK...",
".KEDDDKEDDDKDDDDCCKKcK....",
".KDDDDKEDDDKDDDCCKccK.....",
".KGGgKKEDDDKDDDCCCcK......",
".KTTtsKEEDDKDDDCCCcK......",
".KTTtsKEEDDKDDDCCCcK......",
"..KTtsqKEDDKDDDCCCcK......",
"...KKKKEEDDKDDCCCccK......",
"......KEEDDKDDCCCccK......",
"......KEEDDKDDCCCccK......",
".....KFEDDDKDDCCCcccK.....",
".....KFEDDDKDDCCCcccK.....",
".....KEEDDDKDDCCCcccK.....",
".....KKKKKKKKKKKKKKKK.....",
"......KRQPpKKQPPPpK.......",
"......KRQPPpKQPPPpK.......",
"......KRQPPpKQPPPpK.......",
"......KRQPPpKQPPPpK.......",
"......KRRQPpKQQPPpK.......",
"......KRRQPpKQQPPpK.......",
"......KRQPPpKQPPPpK.......",
"......KRQPPpKQPPpK........",
"......KRQPPpKQPPpK........",
"......KRQPPpKQPPpK........",
"......KRQPPpKQPPpK........",
"......KRQPPKKQPPpK........",
".....KKRQPPK.KQPPK........",
"....KUuuuOOK.KUuOOK.......",
"...KUuuuOOOK.KuuOOOK......",
"...KuOOOOOoK.KOOOOoK......",
"...KKKKKKKKK.KKKKKKK......"];
const SPR_MALA = [
".........KKKKK........",
".......KKBBIIBKK......",
"......KABBBIIIBBK.....",
".....KABBBBBIIIBBK....",
".....KAABBBBBBBBBK....",
"....KaAABBAAAABBBK....",
"....KaAABkllnnABBK....",
"....KaAAkllnnnnABK....",
"....KaAkkAAlnAAnBK....",
"....KaAkkweklwenBK....",
"....KaAAkklllnnnnK....",
".....KaAfkkllllnnK....",
".....KaAAfkk4lnnK.....",
"....KaAAKKfkklnK......",
"....KaAKzXxkklkK......",
"...KaAKzzZZXXZZzK.....",
"...KaKNzZZXxZZzzzK....",
"..KaAKNMzzXZZzzNNNK...",
"..KaAKMMMzZzzLMNNNNK..",
"..KaAKLMMMXZzLMMNNNK..",
"..KAAKLLMMzZLLMMKNNK..",
"..KAKJLLMMzZLLMKNNnK..",
"..KKKJLLKMzLLLKNNnK...",
"....KJLLKLLzLKnnlK....",
".....JLLKLLzLLKlnK....",
".....KLLKLLLyLLMKK....",
".....KLLKLLLLLMMK.....",
".....KLLKLLyLLMMK.....",
".....KLLKLLLLMMNK.....",
".....KklKMMMMMNNK.....",
".....KklKJJJJJJJK.....",
"......KKKWWYYWWYK.....",
"......KrWWYYKWYYYK....",
"......KrWWYYKWYYYK....",
"......KrWWYYKWWYYK....",
"......KrWWYYKWWYYK....",
"......KrWWYYKWWYYK....",
"......KrWYYYKWYYYK....",
"......KrWYYYKWYYYK....",
"......KrWWYYKWWYYK....",
"......KrWWYYKWWYYK....",
"......KrWWYYKWWYYK....",
"......KrWWYKKWWYYK....",
"......KrWWYK.KWWYK....",
"......KrWWYK.KWWYK....",
".....KK223K..K2233K...",
"....K12233K.K122333K..",
"....K11111K.K111111K..",
"....KKKKKKK.KKKKKKKK.."];
const hexc = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
// Kontur nur, wo nötig: außen die dunkelste Farbe der Fläche daneben statt Schwarz, unten und zur Schattenseite Schwarz
function selout(rows) { const h = rows.length, w = rows[0].length, g = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? '.' : rows[y][x];
  const dark = { E: 'C', F: 'D', D: 'C', C: 'c', G: 'g', T: 't', t: 's', S: 's', s: 'q', n: 'l', l: 'k', k: 'f', L: 'J', M: 'L', N: 'M', z: 'Z', Z: 'X', X: 'x', H: 'h', i: 'H', j: 'i', A: 'a', B: 'A', I: 'B', Q: 'P', P: 'p', R: 'Q', W: 'r', Y: 'W', '2': '1', '3': '2', O: 'o', u: 'O', U: 'u', V: 'v', J: 'J', '5': 'S', '6': 's' };
  return rows.map((r, y) => r.split('').map((ch, x) => { if (ch !== 'K') return ch; const nb = [g(x + 1, y), g(x, y - 1), g(x - 1, y)].filter(c => c !== '.' && c !== 'K');
    const below = g(x, y + 1) === '.' || g(x, y + 1) === 'K'; if (!nb.length || (below && y > h - 6)) return 'K'; const n = nb[0]; const d = dark[n]; return (x < w * 0.55 && d && g(x + 1, y) !== '.' ) ? d : 'K'; }).join('')); }

// ================================================================ Rampen der Orte
ramp('nsky', '#1a2448', 12, { lo: 0.03, hi: 0.5 }); ramp('sea2', '#1e3454', 12, { lo: 0.02, hi: 0.6 }); ramp('stoneL', '#c4b496', 12, { lo: 0.06, hi: 0.9, sat: 0.7 });
ramp('stoneG', '#8c8a90', 12, { lo: 0.04, hi: 0.86, sat: 0.5 }); ramp('palmT', '#5a4430', 10, { lo: 0.03, hi: 0.6 }); ramp('palmL', '#2a5a3a', 10, { lo: 0.02, hi: 0.6 });
ramp('iron', '#2e3038', 9, { lo: 0.02, hi: 0.5 }); ramp('lamp', '#ffcf7a', 8, { lo: 0.35, hi: 0.99, kl: 0.4 }); ramp('hillN', '#1c2234', 8, { lo: 0.02, hi: 0.35 });
ramp('ferry', '#d8d4cc', 10, { lo: 0.08, hi: 0.95, sat: 0.3 }); ramp('woodS', '#6a4228', 12, { lo: 0.03, hi: 0.7 }); ramp('copper', '#4a8a72', 10, { lo: 0.04, hi: 0.78 });
ramp('roofT', '#8a4430', 10, { lo: 0.03, hi: 0.66 }); ramp('plaster', '#d8c8a8', 12, { lo: 0.06, hi: 0.94, sat: 0.6 }); rampList('dusk', ['#1c1a34', '#3a2a50', '#6a3a5a', '#a4526a', '#d07a6a', '#eaa676', '#f6cf96'], 14);
ramp('cobble', '#7a7078', 12, { lo: 0.03, hi: 0.78, sat: 0.6 }); ramp('pigeon', '#8a8a96', 6, { lo: 0.15, hi: 0.85, sat: 0.4 });
rampList('grey', ['#3a3e4a', '#5a606e', '#7c8494', '#a2aab8', '#c8ced8'], 10); ramp('lime', '#d8d0bc', 12, { lo: 0.08, hi: 0.96, sat: 0.5 }); ramp('river', '#1e7a66', 12, { lo: 0.03, hi: 0.8 });
ramp('slate', '#6e6a72', 10, { lo: 0.04, hi: 0.78, sat: 0.5 }); ramp('mount', '#6a6a7e', 10, { lo: 0.1, hi: 0.8, sat: 0.4 });
ramp('steel2', '#56606e', 12, { lo: 0.03, hi: 0.82, sat: 0.5 }); ramp('glass2', '#2a3a52', 10, { lo: 0.03, hi: 0.66 }); ramp('train', '#a82a2a', 12, { lo: 0.04, hi: 0.78 });
ramp('plat', '#8e8c90', 12, { lo: 0.05, hi: 0.86, sat: 0.4 }); ramp('yellow', '#e0b62a', 8, { lo: 0.15, hi: 0.95 }); ramp('signB', '#1e4a9a', 8, { lo: 0.05, hi: 0.8 });
ramp('snow', '#dfe6f0', 10, { lo: 0.2, hi: 0.99, sat: 0.4 }); ramp('kiosk', '#3a6a4a', 10, { lo: 0.04, hi: 0.72 }); ramp('paperC', '#e6dcc4', 8, { lo: 0.3, hi: 0.98 });
ramp('fluo', '#dff0ff', 6, { lo: 0.5, hi: 1, sat: 0.4 });

// ================================================================ Rahmen: Puffer je Ort, Licht, Wetter, Figuren, Text, Ausgabe
const DEPTH = new Float32Array(W * H), WATER = new Uint8Array(W * H); let CUR_D = 0.5, CUR_W = 0;
const put0 = put; put = function (x, y, r, l, em) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; put0(x, y, r, l, em); const i = y * W + x; DEPTH[i] = CUR_D; WATER[i] = CUR_W; };
function reset() { MAT.fill(-1); LEV.fill(0); EMI.fill(0); DEPTH.fill(0); WATER.fill(0); CUR_D = 0.5; CUR_W = 0; }
const MK = selout(SPR_MARKO), ML = selout(SPR_MALA);
const TXT = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'hdmodern', 'textmaske_orte.json'), 'utf8'));
const tone = v => { v = Math.max(0, v); return v * (1 + v / 4) / (1 + v); };
function lightAt(sc, x, y, d) { const L = [sc.amb[0], sc.amb[1], sc.amb[2]];
  for (const l of sc.lights) { const dd = Math.hypot(x - l.x, (y - l.y) * (l.sy || 1)); if (dd >= l.r) continue; const f = Math.pow(1 - dd / l.r, 2) * l.k * (d > 0.85 && !l.far ? 0.3 : 1); for (let k = 0; k < 3; k++) L[k] += l.col[k] * f; }
  return L; }
function render(sc, file) {
  // 1 Grundfarben aus den Rampen (leicht gerastert)
  const col = new Float32Array(W * H * 3);
  for (let i = 0; i < W * H; i++) { const m = MAT[i]; if (m < 0) continue; const Rm = RAMPS[m], x = i % W, y = (i / W) | 0, q = clamp(Math.round(LEV[i] + (bay(x, y) - 0.5) * 0.45), 0, Rm.n - 1), c = Rm.cols[q];
    const b = [c[0] / 255, c[1] / 255, c[2] / 255], d = DEPTH[i];
    if (EMI[i]) { for (let k = 0; k < 3; k++) col[i * 3 + k] = b[k] * (sc.emi || 1.3); continue; }
    const L = lightAt(sc, x, y, d), fogK = Math.min(0.92, Math.pow(d, 1.3) * sc.fog.k * (sc.fog.ground ? 0.7 + Math.max(0, (y - 60) / 120) * 0.6 : 1));
    for (let k = 0; k < 3; k++) { let v = b[k] * L[k]; v = v * (1 - fogK) + sc.fog.col[k] * fogK; col[i * 3 + k] = v; } }
  // 2 Lichthöfe (Streulicht in der Luft) und Spiegelungen im Wasser oder auf nassem Boden
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x;
    for (const l of sc.lights) { if (!l.halo) continue; const dd = Math.hypot(x - l.x, y - l.y); for (let k = 0; k < 3; k++) col[i * 3 + k] += l.col[k] * l.halo * Math.exp(-dd * dd / (2 * l.hr * l.hr)); }
    if (WATER[i]) for (const l of sc.lights) { if (!l.refl) continue; const dx = Math.abs(x - l.x + Math.sin(y * 0.9) * (sc.ripple || 1.5)); const w = l.rw || 3; if (dx < w && y > l.y) { const f = (1 - dx / w) * l.refl * Math.max(0, 1 - (y - l.y) / (l.rlen || 120)) * ((y + (x >> 1)) % 3 === 0 ? 0.5 : 1); for (let k = 0; k < 3; k++) col[i * 3 + k] += l.col[k] * f; } } }
  // 3 Wetter
  if (sc.weather === 'rain') for (let k = 0; k < 520; k++) { let x = Math.floor(h2(k, 1, 80) * (W + 40)), y = Math.floor(h2(k, 2, 80) * H); const len = 4 + Math.floor(h2(k, 3, 80) * 5), a = 0.1 + h2(k, 4, 80) * 0.12;
    for (let t = 0; t < len; t++) { const xx = x - Math.floor(t * 0.4), yy = y + t; if (xx < 0 || xx >= W || yy >= H) break; const j = yy * W + xx; for (let c = 0; c < 3; c++) col[j * 3 + c] += [0.6, 0.7, 0.85][c] * a; } }
  if (sc.weather === 'snow') for (let k = 0; k < 420; k++) { const x = Math.floor(h2(k, 5, 81) * W), y = Math.floor(h2(k, 6, 81) * H), j = y * W + x; if (sc.snowMask && !sc.snowMask(x, y)) continue; const a = 0.35 + h2(k, 7, 81) * 0.5;
    for (let c = 0; c < 3; c++) col[j * 3 + c] = col[j * 3 + c] * (1 - a) + 0.92 * a; if (h2(k, 8, 81) > 0.7 && x + 1 < W) for (let c = 0; c < 3; c++) col[(j + 1) * 3 + c] = col[(j + 1) * 3 + c] * 0.6 + 0.9 * 0.4; }
  if (sc.weather === 'fog') for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = fbm(x * 0.02, y * 0.05, 82), f = Math.max(0, n - 0.42) * (0.25 + Math.max(0, (y - 40) / 140) * 0.35); const i = y * W + x; for (let c = 0; c < 3; c++) col[i * 3 + c] += sc.fog.col[c] * f * 1.6; }
  // 4 Figuren mit dem Licht des Ortes
  for (const f of sc.figs) placeFig(sc, col, f.rows, f.x, f.y, f.flip, f.ghost);
  if (sc.figs.some(f => f.ghost)) { const g = sc.figs.find(f => f.ghost); for (let k = 0; k < 14; k++) { const x = Math.floor(g.x - 12 + h2(k, 21, 70) * 24), y = Math.floor(g.y - 50 + h2(k, 22, 70) * 56), i = (y * W + x) * 3; if (h2(k, 23, 70) < 0.5) continue; for (let c = 0; c < 3; c++) col[i + c] += [0.45, 0.88, 0.95][c] * 0.4; } }
  // 5 Abbildung, Vignette, Leuchten, Text, Ausgabe sechsfach
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, vg = 1 - 0.4 * Math.pow(Math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2)) / 1.414, 2.2); for (let k = 0; k < 3; k++) col[i * 3 + k] = tone(col[i * 3 + k] * (sc.expo || 1.15)) * vg; }
  const br = new Float32Array(W * H * 3); for (let i = 0; i < W * H; i++) { const l = col[i * 3] * 0.3 + col[i * 3 + 1] * 0.59 + col[i * 3 + 2] * 0.11, f = Math.max(0, l - 0.52) / Math.max(0.001, l); for (let k = 0; k < 3; k++) br[i * 3 + k] = col[i * 3 + k] * f; }
  const g1 = blur(br, W, H, 1, 3), g2 = blur(br, W, H, 5, 3);
  const TM = new Uint8Array(W * H), TO = new Uint8Array(W * H);
  sc.text.lines.forEach((li, n) => { const rows = TXT[li], tw = rows[0].length, x0 = Math.round(clamp(sc.text.x - tw / 2, 4, W - tw - 4)), y0 = sc.text.y + n * 11; rows.forEach((r, ry) => { for (let rx = 0; rx < r.length; rx++) if (r[rx] === '#') TM[(y0 + ry) * W + x0 + rx] = 1; }); });
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (!TM[y * W + x] && (TM[y * W + x - 1] || TM[y * W + x + 1] || TM[(y - 1) * W + x] || TM[(y + 1) * W + x] || TM[(y + 1) * W + x + 1] || TM[(y - 1) * W + x - 1])) TO[y * W + x] = 1;
  const tg = new Float32Array(W * H * 3); for (let i = 0; i < W * H; i++) if (TM[i]) tg[i * 3] = tg[i * 3 + 1] = tg[i * 3 + 2] = 1; const tgl = blur(tg, W, H, 2, 3);
  const TC = sc.text.col, out = Buffer.alloc(OW * OH * 3);
  for (let Y = 0; Y < OH; Y++) for (let X = 0; X < OW; X++) { const x = (X / S) | 0, y = (Y / S) | 0, i = y * W + x, fx = (X + 0.5) / S - 0.5, fy = (Y + 0.5) / S - 0.5, o = (Y * OW + X) * 3;
    for (let k = 0; k < 3; k++) { let c = col[i * 3 + k] + bil(g1, W, H, fx, fy, k) * 0.5 + bil(g2, W, H, fx, fy, k) * 0.65 + bil(tgl, W, H, fx, fy, k) * TC[k] * 0.3;
      if (TO[i]) c = c * 0.25 + 0.01; if (TM[i]) c = TC[k]; out[o + k] = clamp(Math.round(c * 255), 0, 255); } }
  const raw = Buffer.alloc((OW * 3 + 1) * OH); for (let y = 0; y < OH; y++) { raw[y * (OW * 3 + 1)] = 0; out.copy(raw, y * (OW * 3 + 1) + 1, y * OW * 3, (y + 1) * OW * 3); }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(OW, 0); ih.writeUInt32BE(OH, 4); ih[8] = 8; ih[9] = 2;
  fs.writeFileSync(path.join(OUT, file), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
  console.log('Musterbild', path.join(OUT, file)); }
// Figur: Farbe × Licht des Ortes; Saum zur hellsten Lichtquelle warm/kalt, oben ein Hauch Himmelslicht; Mala als Geist
function placeFig(sc, col, rows, fx, fy, flip, ghost) { const h = rows.length, w = rows[0].length, x0 = fx - (w >> 1), y0 = fy - h + 1, at = (x, y) => (y < 0 || y >= h || x < 0 || x >= w) ? '.' : rows[y][flip ? w - 1 - x : x], tr = (x, y) => at(x, y) === '.';
  const key = sc.lights.slice().sort((a, b) => b.k / Math.max(30, Math.hypot(a.x - fx, a.y - fy + 30)) - a.k / Math.max(30, Math.hypot(b.x - fx, b.y - fy + 30)))[0];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (tr(x, y)) continue; const X = x0 + x, Y = y0 + y; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const b = hexc(FPAL[at(x, y)]), i = (Y * W + X) * 3;
    const L = lightAt(sc, X, Y, 0), keySide = key && (key.x < X ? tr(x - 1, y) : tr(x + 1, y)), backSide = key && (key.x < X ? tr(x + 1, y) : tr(x - 1, y)), top = tr(x, y - 1);
    for (let k = 0; k < 3; k++) { let l = L[k] * 1.25 + 0.06; if (keySide) l += key.col[k] * key.k * 0.35; if (backSide || top) l += sc.rim[k]; let v = b[k] * l;
      if (ghost) { const lum = b[0] * 0.3 + b[1] * 0.59 + b[2] * 0.11, lc = Math.pow(lum, 0.85) * 1.25, g = [0.12 + lc * 0.78, 0.34 + lc * 0.66, 0.46 + lc * 0.56][k] * (tr(x - 1, y) || tr(x + 1, y) || top ? 1.12 : 0.95); v = col[i + k] * 0.22 + g * 0.8; }
      col[i + k] = v; } } }
function shadowAt(fx, fy, rx) { for (let y = fy - 1; y <= fy + 2; y++) for (let x = fx - rx; x <= fx + rx; x++) { const dx = (x - fx) / rx, dy = (y - fy - 0.5) / 2; if (dx * dx + dy * dy <= 1) addLev(x, y, -1.8 * (1 - dx * dx * 0.6)); } }
const sky = (r, f) => rect(0, 0, W, H, (x, y) => f(x, y) !== null ? [r, f(x, y)] : null);

// ================================================================ 1 Split: Riva bei Nacht
reset();
CUR_D = 1; rect(0, 0, W, 94, (x, y) => [R.nsky, 0.8 + Math.pow(y / 94, 1.3) * 4 + (fbm(x * 0.02, y * 0.05, 90) - 0.5) * 1.2 + Math.max(0, 1 - Math.hypot(x - 252, y - 24) / 70) * 2.4]);
for (let k = 0; k < 70; k++) { const x = Math.floor(h2(k, 1, 91) * W), y = Math.floor(h2(k, 2, 91) * 70); if (Math.hypot(x - 252, y - 24) < 22) continue; put(x, y, R.ferry, 4 + h2(k, 3, 91) * 4, 1); }
ellipse(252, 24, 6, 6, (x, y, dx, dy) => [R.ferry, 9 - (dx + dy + 2) * 0.5 - ((x === 250 && y === 23) || (x === 254 && y === 26) ? 1.4 : 0), 1]);
CUR_D = 0.97; poly([[0, 86], [30, 80], [70, 82], [120, 75], [170, 80], [220, 77], [270, 82], [320, 79], [320, 96], [0, 96]], (x, y) => [R.hillN, 1.8 + (y - 75) * 0.06 + (fbm(x * 0.06, y * 0.1, 92) - 0.5) * 0.8]);
for (let k = 0; k < 34; k++) { const x = Math.floor(h2(k, 4, 92) * W), y = 85 + Math.floor(h2(k, 5, 92) * 9); put(x, y, R.lamp, 2.5 + h2(k, 6, 92) * 3, 1); }
CUR_D = 0.85; CUR_W = 1; rect(0, 95, W, 36, (x, y) => [R.sea2, 1.8 + (y - 95) * 0.07 + (Math.sin(x * 0.31 + y * 1.9 + Math.sin(y) * 2) > 0.9 ? 1.8 : 0) + (fbm(x * 0.05, y * 0.4, 93) - 0.5) * 1.1]); CUR_W = 0;
CUR_D = 0.92; poly([[46, 89], [120, 89], [113, 96], [53, 96]], (x, y) => [R.ferry, 4.6 - (y - 89) * 0.5]); rect(60, 84, 42, 5, (x, y) => [R.ferry, 5.6 - (y - 84) * 0.3]); rect(78, 80, 10, 4, () => [R.ferry, 4]); rect(83, 76, 3, 4, () => [R.roofT, 4]);
for (let x = 54; x < 112; x += 3) put(x, 92, R.lamp, 5.4, 1); for (let x = 63; x < 100; x += 3) put(x, 86, R.lamp, 5, 1);
// Kaimauer und Promenade aus hellem Kalkstein
CUR_D = 0.5; rect(0, 130, W, 5, (x, y) => [R.stoneL, y === 130 ? 7 : (y === 134 ? 2 : 4.2) - ((x % 22) === 0 ? 1 : 0)]);
rect(0, 135, W, H - 135, (x, y) => { const t = (y - 135) / 45, rf = Math.pow(t, 0.8) * 7, row = Math.floor(rf), w = 26 + row * 3, off = row % 2 ? w >> 1 : 0, seam = ((x + off) % w < 1) || (rf - row) < 0.1; CUR_D = 0.48 - t * 0.44;
  return [R.stoneL, 3.2 + t * 1.8 - (seam ? 1.3 : 0) + (h2(((x + off) / w) | 0, row, 94) - 0.5) * 1 + (fbm(x * 0.1, y * 0.2, 95) - 0.5) * 0.6]; });
for (const bx of [16, 104, 304]) { CUR_D = 0.5; rect(bx, 122, 6, 9, (x, y) => [R.iron, x === bx ? 4.4 : 2.2]); rect(bx - 1, 121, 8, 2, (x, y) => [R.iron, 5]); }
for (let x = 22; x < 104; x++) put(x, 125 + Math.round(Math.sin((x - 22) / 82 * Math.PI) * 3), R.iron, 3.4);
function palmTree(px, base, hgt) { CUR_D = 0.55; for (let y = 0; y < hgt; y++) { const x = Math.round(px + Math.sin(y / hgt * 1.4) * 3); for (let k = -1; k <= 1; k++) put(x + k, base - y, R.palmT, 2.6 + (k === -1 ? 1.6 : (k === 1 ? -0.6 : 0)) + ((y % 4) === 0 ? -0.9 : 0)); }
  const tx = Math.round(px + Math.sin(1.4) * 3), ty = base - hgt; for (let a = 0; a < 11; a++) { const ang = -Math.PI - 0.15 + a / 10 * (Math.PI + 0.3), len = 17 + (a % 3) * 5; for (let t = 0; t < len; t++) { const x = tx + Math.cos(ang) * t, y = ty + Math.sin(ang) * t * 0.5 + t * t * 0.024; put(x, y, R.palmL, 2.4 + (t < len * 0.5 ? 1.6 : 0.4)); put(x, y + 1, R.palmL, 1.2); if (t % 2 === 0) put(x + (Math.cos(ang) > 0 ? 1 : -1), y + 2, R.palmL, 0.8); } }
  ellipse(tx, ty + 1, 3, 2, () => [R.palmT, 2]); }
palmTree(44, 133, 66); palmTree(226, 133, 72);
function lampPost(lx, base, top) { CUR_D = 0.5; rect(lx - 1, top, 3, base - top, (x, y) => [R.iron, x === lx - 1 ? 3.8 : 1.8]); rect(lx - 3, base - 5, 7, 5, (x, y) => [R.iron, 3.2 - (x - lx + 3) * 0.2]);
  rect(lx - 4, top - 9, 9, 2, (x, y) => [R.iron, 4]); rect(lx - 3, top - 7, 7, 7, (x, y) => [R.lamp, 7 - Math.abs(x - lx) * 0.6, 1]); rect(lx - 2, top - 11, 5, 2, (x, y) => [R.iron, 3.4]); put(lx, top - 12, R.iron, 3); }
lampPost(128, 133, 72); lampPost(286, 133, 74);
CUR_D = 0.48; rect(148, 137, 36, 3, (x, y) => [R.woodS, y === 137 ? 6.4 : 4]); rect(148, 130, 36, 2, (x, y) => [R.woodS, 5.4]); rect(148, 133, 36, 1, () => [R.woodS, 3]); rect(150, 140, 2, 6, () => [R.iron, 2]); rect(180, 140, 2, 6, () => [R.iron, 2]);
shadowAt(178, 172, 9); shadowAt(92, 167, 7);
render({ amb: [0.3, 0.34, 0.5], fog: { col: [0.08, 0.1, 0.2], k: 0.45 }, rim: [0.12, 0.15, 0.25], expo: 1.25,
  lights: [{ x: 128, y: 69, r: 130, k: 1.6, col: [1, 0.68, 0.32], halo: 0.5, hr: 9, refl: 0.55, rw: 3, rlen: 60 }, { x: 286, y: 71, r: 130, k: 1.6, col: [1, 0.68, 0.32], halo: 0.5, hr: 9, refl: 0.55, rw: 3, rlen: 60 },
    { x: 128, y: 150, r: 60, k: 0.6, col: [1, 0.66, 0.3] }, { x: 286, y: 150, r: 60, k: 0.6, col: [1, 0.66, 0.3] },
    { x: 252, y: 24, r: 360, k: 0.38, col: [0.55, 0.7, 1.0], halo: 0.28, hr: 16, refl: 0.8, rw: 7, rlen: 140, far: true }],
  figs: [{ rows: ML, x: 92, y: 166, flip: false, ghost: true }, { rows: MK, x: 178, y: 172, flip: false }],
  text: { lines: [0], x: 96, y: 92, col: [0.74, 0.95, 1.0] } }, 'ort_split.png');

// ================================================================ 2 Sarajevo: Baščaršija im Abendnebel
reset();
CUR_D = 1; rect(0, 0, W, 104, (x, y) => [R.dusk, 2 + Math.pow(y / 104, 1.2) * 9 + (fbm(x * 0.02, y * 0.06, 95) - 0.5) * 1.4]);
CUR_D = 0.98; poly([[0, 66], [60, 54], [130, 60], [200, 48], [270, 56], [320, 52], [320, 104], [0, 104]], (x, y) => [R.hillN, 2.2 + (y - 48) * 0.05]);
for (let k = 0; k < 90; k++) { const x = Math.floor(h2(k, 1, 96) * W), y = 58 + Math.floor(h2(k, 2, 96) * 40); if (y < 66 - x * 0.0) {} if (h2(k, 3, 96) > 0.55) put(x, y, R.lamp, 3 + h2(k, 4, 96) * 2.5, 1); else rect(x, y, 3, 2, () => [R.plaster, 2.4]); }
// hintere Häuserzeile (füllt alles bis zum Platz)
CUR_D = 0.85; for (let hx = -6; hx < W; hx += 22) { const hh = 26 + Math.floor(h2(hx, 1, 97) * 14), top = 140 - hh - 10; rect(hx, top, 22, 140 - top, (x, y) => [R.plaster, 2.6 + fbm(x * 0.1, y * 0.1, 98) * 1.2 - (x === hx ? 0.8 : 0)]);
  poly([[hx - 2, top], [hx + 24, top], [hx + 11, top - 9]], (x, y) => [R.roofT, 2 + (y - top + 9) * 0.15]); if (h2(hx, 2, 97) > 0.4) rect(hx + 8, top + 8, 5, 5, () => [R.lamp, 3.6, 1]); }
// Moschee mit Kuppel und Minarett (hinten rechts)
CUR_D = 0.9; ellipse(262, 76, 22, 16, (x, y, dx, dy) => y < 76 ? [R.slate, 3.4 - dx * 1.2] : null); rect(238, 76, 48, 24, (x, y) => [R.plaster, 3.2 + (x % 12 === 0 ? -0.8 : 0)]);
rect(292, 22, 5, 80, (x, y) => [R.plaster, x === 292 ? 4.6 : 3]); poly([[291, 22], [298, 22], [294.5, 8]], () => [R.slate, 3.4]); rect(290, 40, 9, 2, () => [R.plaster, 4.6]);
// Läden vorn: Holz, Vordächer, warme Fenster, Laternen
function shop(x0, x1, top, base, lit) { CUR_D = 0.6; rect(x0, top, x1 - x0, base - top, (x, y) => [R.woodS, 2.8 + ((x - x0) % 10 === 0 ? -1 : 0) + fbm(x * 0.1, y * 0.2, 99) * 0.8]);
  poly([[x0 - 6, top], [x1 + 6, top], [x1, top - 10], [x0, top - 10]], (x, y) => [R.roofT, 2.4 + (top - y) * 0.22 + ((x % 4) === 0 ? -0.6 : 0)]);
  for (let wx = x0 + 6; wx < x1 - 12; wx += 20) { rect(wx, top + 8, 12, 12, (x, y) => lit ? [R.lamp, 4.6 - (y - top - 8) * 0.15 - ((x - wx) === 6 ? 1.6 : 0), 1] : [R.woodS, 1.2]); rect(wx - 1, top + 7, 14, 1, () => [R.woodS, 4.6]); }
  rect(x0, base - 22, x1 - x0, 3, (x, y) => [R.woodS, 4.6]); }
shop(0, 70, 94, 141, true); shop(96, 130, 104, 141, false); shop(214, 320, 98, 142, true);
for (const lx of [74, 210]) { CUR_D = 0.58; rect(lx, 92, 1, 10, () => [R.iron, 3]); rect(lx - 2, 102, 5, 6, (x, y) => [R.lamp, 6, 1]); }
// Sebilj
CUR_D = 0.5; rect(150, 106, 34, 32, (x, y) => [R.woodS, 3.2 + Math.sin((x - 150) / 34 * Math.PI) * 2.4 - ((x - 150) % 6 === 0 ? 1 : 0)]);
for (let ax = 153; ax < 182; ax += 6) ellipse(ax + 2, 114, 2.6, 4, () => [R.woodS, 1]);
poly([[145, 106], [189, 106], [181, 99], [153, 99]], (x, y) => [R.woodS, 5 - (106 - y) * 0.1]); ellipse(167, 99, 15, 14, (x, y, dx, dy) => y <= 99 ? [R.copper, 4.6 - dx * 1.8 - dy * 0.6] : null);
rect(166, 81, 2, 6, () => [R.copper, 6.4]); rect(147, 138, 40, 4, (x, y) => [R.stoneG, 5.4 - (y - 138)]);
CUR_D = 0.42; rect(0, 141, W, H - 141, (x, y) => { const t = (y - 141) / 39; CUR_D = 0.42 - t * 0.4; const sw = Math.round(4 + t * 3), cx = Math.floor(x / sw), cy = Math.floor((y - 141) / (2 + t * 2)); return [R.cobble, 2.6 + t * 1.6 + (h2(cx + cy * 7, cy, 100) - 0.5) * 1.8 + ((x % sw) === 0 ? -1 : 0)]; });
CUR_W = 1; for (const ry of [160, 171]) rect(0, ry, W, 2, (x, y) => [R.steel2, y === ry ? 7.4 : 3]); CUR_W = 0;
for (let k = 0; k < 11; k++) { const x = 112 + Math.floor(h2(k, 1, 101) * 100), y = 145 + Math.floor(h2(k, 2, 101) * 10); rect(x, y, 3, 2, (xx, yy) => [R.pigeon, yy === y ? 4.4 : 2.6]); put(x + 3, y, R.pigeon, 3.4); }
shadowAt(236, 172, 9);
render({ amb: [0.46, 0.38, 0.44], fog: { col: [0.42, 0.33, 0.37], k: 0.62, ground: true }, rim: [0.22, 0.15, 0.15], weather: 'fog', expo: 1.12,
  lights: [{ x: 36, y: 108, r: 110, k: 1.0, col: [1, 0.66, 0.34], halo: 0.18, hr: 18, refl: 0.45, rw: 5, rlen: 40 }, { x: 266, y: 112, r: 120, k: 1.1, col: [1, 0.66, 0.34], halo: 0.2, hr: 20, refl: 0.5, rw: 5, rlen: 40 },
    { x: 74, y: 105, r: 50, k: 0.8, col: [1, 0.62, 0.3], halo: 0.35, hr: 6 }, { x: 210, y: 105, r: 50, k: 0.8, col: [1, 0.62, 0.3], halo: 0.35, hr: 6 }, { x: 240, y: 10, r: 420, k: 0.32, col: [1.0, 0.6, 0.45], far: true }],
  figs: [{ rows: MK, x: 236, y: 172, flip: false }],
  text: { lines: [1, 2], x: 222, y: 76, col: [0.96, 0.9, 0.76] } }, 'ort_sarajevo.png');

// ================================================================ 3 Mostar: Alte Brücke im Regen
reset();
CUR_D = 1; rect(0, 0, W, H, (x, y) => [R.grey, 5.2 + (y / 90) * 1.6 + (fbm(x * 0.015, y * 0.04, 102) - 0.5) * 2.2]);
CUR_D = 0.96; poly([[0, 46], [50, 32], [110, 42], [170, 28], [230, 38], [290, 30], [320, 36], [320, 110], [0, 110]], (x, y) => [R.mount, 4 + (y - 28) * 0.025 + (fbm(x * 0.05, y * 0.05, 103) - 0.5) * 1.8]);
// Schlucht: hintere Felswände, Grün darauf, der Fluss weit unten
CUR_D = 0.88; rect(0, 90, W, 50, (x, y) => [R.lime, 2.6 + (fbm(x * 0.06, y * 0.08, 104) - 0.5) * 2.4 - (y - 90) * 0.02]);
for (let k = 0; k < 40; k++) { const x = Math.floor(h2(k, 1, 105) * W), y = 92 + Math.floor(h2(k, 2, 105) * 30); ellipse(x, y, 3 + h2(k, 3, 105) * 4, 2 + h2(k, 4, 105) * 2, (xx, yy, dx, dy) => [R.palmL, 2.4 - dy]); }
CUR_D = 0.75; CUR_W = 1; rect(0, 132, W, 48, (x, y) => [R.river, 3.2 + (y - 132) * 0.04 + (Math.sin(x * 0.17 + y * 0.9) > 0.82 ? 2.6 : 0) + (fbm(x * 0.06, y * 0.3, 106) - 0.5) * 1.6]); CUR_W = 0;
// Ufer links und rechts (näher), mit Häusern
CUR_D = 0.7; poly([[0, 86], [62, 92], [78, 124], [88, 150], [0, 150]], (x, y) => [R.lime, 3.4 + (fbm(x * 0.08, y * 0.08, 107) - 0.5) * 2.4 - (y - 86) * 0.02]);
poly([[320, 84], [258, 90], [244, 124], [234, 150], [320, 150]], (x, y) => [R.lime, 3 + (fbm(x * 0.08, y * 0.08, 108) - 0.5) * 2.4]);
function house(x, y, w, h) { CUR_D = 0.78; rect(x, y, w, h, (xx, yy) => [R.lime, 4.8 + fbm(xx * 0.1, yy * 0.1, 109) * 1.2 - (xx === x ? 1 : 0)]); poly([[x - 3, y], [x + w + 3, y], [x + w / 2, y - h * 0.5]], (xx, yy) => [R.slate, 3 + (yy - y + h * 0.5) * 0.12 + ((xx + yy) % 3 === 0 ? -0.6 : 0)]);
  rect(x + 3, y + 5, 3, 4, () => [R.slate, 1.2]); if (w > 14) rect(x + w - 7, y + 5, 3, 4, () => [R.slate, 1.2]); }
for (const [x, y, w, h] of [[0, 68, 18, 22], [16, 74, 16, 18], [292, 64, 20, 24], [272, 72, 16, 18], [306, 74, 16, 20]]) house(x, y, w, h);
rect(3, 73, 3, 4, () => [R.lamp, 4.4, 1]);
// Türme
CUR_D = 0.66; rect(42, 50, 24, 48, (x, y) => [R.lime, 3.6 + Math.sin((x - 42) / 24 * Math.PI) * 2.2 - (y % 7 === 0 ? 0.8 : 0)]); poly([[39, 50], [69, 50], [54, 36]], (x, y) => [R.slate, 3 + (y - 36) * 0.12]); rect(52, 62, 4, 6, () => [R.slate, 1]);
rect(254, 48, 24, 50, (x, y) => [R.lime, 3.2 + Math.sin((x - 254) / 24 * Math.PI) * 2.2 - (y % 7 === 0 ? 0.8 : 0)]); ellipse(266, 48, 13, 8, (x, y, dx, dy) => y <= 48 ? [R.slate, 3.6 - dx] : null); rect(264, 60, 4, 6, () => [R.slate, 1]);
// die Brücke: ein hoher, schlanker Bogen; Unterseite dunkler, Brüstung hell
CUR_D = 0.62; for (let x = 64; x <= 256; x++) { const u = (x - 160) / 96, a = Math.sqrt(Math.max(0, 1 - u * u)), yIn = 130 - a * 66, yTop = 60 + u * u * 22 - 1;
  for (let y = Math.floor(yTop) - 3; y < Math.floor(yTop); y++) put(x, y, R.lime, 6.4 - (y === Math.floor(yTop) - 3 ? 1.2 : 0));
  for (let y = Math.floor(yTop); y < yIn; y++) { const t = (y - yTop) / Math.max(1, yIn - yTop); put(x, y, R.lime, 4.8 - t * 1.6 + ((Math.floor(y / 3) + Math.floor(x / 6)) % 2 === 0 && t < 0.4 ? -0.5 : 0)); }
  for (let y = Math.floor(yIn); y < yIn + 2; y++) put(x, y, R.lime, 2.2); }
// Terrasse vorn links: Pflaster, Geländer, Pfützen
CUR_D = 0.3; rect(0, 150, 172, 30, (x, y) => { const t = (y - 150) / 30; CUR_D = 0.3 - t * 0.28; const sw = Math.round(5 + t * 3), cx = Math.floor(x / sw), cy = Math.floor((y - 150) / (2 + t * 2)); return [R.cobble, 3 + t * 1.2 + (h2(cx + cy * 5, cy, 110) - 0.5) * 1.8 - ((x % sw) === 0 ? 0.8 : 0)]; });
CUR_W = 1; ellipse(40, 174, 22, 3, () => [R.cobble, 1.6]); ellipse(150, 164, 14, 2, () => [R.cobble, 1.6]); CUR_W = 0;
CUR_D = 0.25; rect(0, 140, 172, 2, (x, y) => [R.iron, y === 140 ? 4.6 : 2.6]); for (let x = 4; x < 172; x += 12) rect(x, 142, 2, 9, () => [R.iron, 2.8]); rect(170, 140, 3, 40, () => [R.iron, 3]);
shadowAt(116, 176, 9); shadowAt(70, 171, 7);
render({ amb: [0.74, 0.78, 0.84], fog: { col: [0.56, 0.6, 0.66], k: 0.5 }, rim: [0.2, 0.22, 0.26], weather: 'rain', expo: 1.05, ripple: 2,
  lights: [{ x: 160, y: -20, r: 300, k: 0.22, col: [0.7, 0.78, 0.9], refl: 0.22, rw: 26, rlen: 200, far: true }, { x: 4, y: 75, r: 50, k: 0.6, col: [1, 0.7, 0.4], halo: 0.18, hr: 6 }],
  figs: [{ rows: ML, x: 70, y: 170, flip: false, ghost: true }, { rows: MK, x: 116, y: 176, flip: true }],
  text: { lines: [3, 4], x: 118, y: 92, col: [0.96, 0.9, 0.76] } }, 'ort_mostar.png');

// ================================================================ 4 München: Gleis 11 im Schnee
reset();
// draußen: Schneelicht, Stadtsilhouette hinter der offenen Halle
CUR_D = 1; rect(0, 0, W, H, (x, y) => [R.grey, 6 + (y / H) * 2.4]);
CUR_D = 0.97; for (let bx = 120; bx < W; bx += 18) { const hh = 22 + Math.floor(h2(bx, 1, 111) * 22); rect(bx, 136 - hh, 18, hh, (x, y) => [R.grey, 4.4 - (x === bx ? 0.6 : 0)]); for (let wy = 140 - hh; wy < 130; wy += 7) if (h2(bx, wy, 112) > 0.5) rect(bx + 5, wy, 3, 3, () => [R.lamp, 3.6, 1]); }
// Stirnseite der Halle: Stahlrahmen mit großem Bogenfenster
CUR_D = 0.72; for (let y = 72; y < 140; y++) for (let x = 112; x < W; x++) { const inArch = Math.pow((x - 216) / 100, 2) + Math.pow((y - 140) / 64, 2) < 1; if (inArch) { if ((x - 116) % 26 < 2 || (y - 72) % 14 < 1) put(x, y, R.steel2, 3); continue; } put(x, y, R.stoneG, 3 + (y % 9 === 0 ? -0.8 : 0) + fbm(x * 0.06, y * 0.06, 113) * 0.8); }
// Hallendach: Bögen, Glas mit Schnee auf einzelnen Scheiben
CUR_D = 0.7; for (let y = 0; y < 74; y++) for (let x = 0; x < W; x++) { const arch = 74 - Math.sqrt(Math.max(0, 1 - Math.pow((x - 160) / 250, 2))) * 74; if (y < arch) continue; const px = Math.floor(x / 20), py = Math.floor(y / 12), truss = (x % 20) < 1 || (y % 12) < 1, snow = h2(px, py, 114) > 0.55 && (y % 12) > 7;
  put(x, y, truss ? R.steel2 : (snow ? R.snow : R.glass2), truss ? 2.6 + ((x % 40) === 0 ? 1.4 : 0) : (snow ? 4.6 : 2.2 + (y / 74) * 1.4)); }
for (let x = 0; x < W; x += 40) line(x, 73, x + 20, 30, () => [R.steel2, 2.4]);
// Wand links hinter dem Zug, Zug mit Fenstern und Türen
CUR_D = 0.68; rect(0, 74, 112, 64, (x, y) => [R.stoneG, 2.2 + (y % 10 === 0 ? -0.8 : 0) + fbm(x * 0.05, y * 0.05, 115)]);
CUR_D = 0.52; rect(0, 90, 112, 46, (x, y) => [R.train, 4.4 + (y < 94 ? 2 : 0) - (y > 128 ? 1.6 : 0) + (y === 115 ? -1.4 : 0)]); rect(0, 88, 112, 2, () => [R.steel2, 4]);
for (let wx = 4; wx < 106; wx += 20) { if (wx === 44) { rect(wx, 96, 12, 36, (x, y) => [R.train, x === wx || x === wx + 11 ? 2 : 3.6]); rect(wx + 2, 99, 8, 10, () => [R.lamp, 3.4, 1]); continue; } rect(wx, 98, 14, 12, (x, y) => [R.lamp, 3.6 - (y - 98) * 0.12 - ((x - wx) === 7 ? 1.4 : 0), 1]); }
rect(0, 132, 112, 4, () => [R.iron, 1.6]);
// Säulen und Leuchtröhren
for (const cx of [124, 236]) { CUR_D = 0.5; rect(cx - 2, 64, 5, 76, (x, y) => [R.steel2, x === cx - 2 ? 5 : 3 - (x - cx) * 0.4]); }
for (const fx of [60, 180, 290]) { CUR_D = 0.55; rect(fx - 12, 78, 24, 2, () => [R.fluo, 5, 1]); rect(fx - 12, 77, 24, 1, () => [R.steel2, 3]); }
// Gleisschild
CUR_D = 0.5; rect(150, 40, 2, 16, () => [R.iron, 3]); rect(140, 56, 22, 14, (x, y) => [R.signB, 4.4 + (y === 56 ? 1.6 : 0)]); for (const dx of [146, 153]) { rect(dx, 59, 2, 8, () => [R.ferry, 9]); put(dx - 1, 60, R.ferry, 9); }
// Bahnsteig
CUR_D = 0.45; rect(0, 138, W, H - 138, (x, y) => { const t = (y - 138) / 42; CUR_D = 0.45 - t * 0.42; return [R.plat, 3.8 + t * 1.6 + (fbm(x * 0.05, y * 0.2, 116) - 0.5) * 0.9 + ((x + Math.floor(t * 30)) % 36 === 0 ? -1 : 0)]; });
rect(0, 140, W, 2, () => [R.yellow, 5.4]);
for (let k = 0; k < 46; k++) { const x = Math.floor(h2(k, 1, 117) * W), y = 146 + Math.floor(h2(k, 2, 117) * 32); rect(x, y, 4 + Math.floor(h2(k, 3, 117) * 7), 1, () => [R.snow, 6.4]); }
// Kiosk
CUR_D = 0.42; rect(250, 96, 56, 46, (x, y) => [R.kiosk, 3 + (x === 250 ? -0.6 : 0)]); rect(246, 92, 64, 6, (x, y) => [R.kiosk, 4.8 - (y - 92) * 0.3]);
rect(256, 104, 44, 18, (x, y) => [R.lamp, 3.4 + fbm(x * 0.3, y * 0.3, 118) * 1.2, 1]); for (let x = 256; x < 300; x += 6) rect(x, 124, 5, 12, (xx, yy) => [R.paperC, 5.2 - (yy - 124) * 0.2 + (xx % 3 === 0 ? -1 : 0)]);
shadowAt(206, 174, 9); shadowAt(168, 169, 7);
render({ amb: [0.5, 0.54, 0.64], fog: { col: [0.66, 0.7, 0.78], k: 0.45 }, rim: [0.18, 0.2, 0.26], weather: 'snow', expo: 1.05, snowMask: (x, y) => y > 72 || x > 230,
  lights: [{ x: 60, y: 79, r: 110, k: 0.6, col: [0.75, 0.88, 1.0], halo: 0.25, hr: 10 }, { x: 180, y: 79, r: 110, k: 0.6, col: [0.75, 0.88, 1.0], halo: 0.25, hr: 10 }, { x: 290, y: 79, r: 100, k: 0.5, col: [0.75, 0.88, 1.0], halo: 0.25, hr: 10 },
    { x: 278, y: 114, r: 120, k: 1.2, col: [1, 0.7, 0.38], halo: 0.28, hr: 16 }, { x: 56, y: 104, r: 90, k: 0.6, col: [1, 0.74, 0.44] }],
  figs: [{ rows: ML, x: 168, y: 168, flip: false, ghost: true }, { rows: MK, x: 206, y: 174, flip: false }],
  text: { lines: [5], x: 196, y: 94, col: [0.96, 0.9, 0.76] } }, 'ort_muenchen.png');
