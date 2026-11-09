// Szenenbilder für die Kapitelwahl („Die Reise“, design/KAPITELWAHL.md): je Kapitel ein Ort als indizierte PNG in Originalgröße (320×144),
// aus dem Spiel selbst (M.sceneSnap). game/build.js bettet sie als M.CHAPTER_ART ein.   node design/tools/kapitelart.js
'use strict';
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs'), zlib = require('zlib');
const ROOT = path.join(__dirname, '..', '..'), OUT = path.join(ROOT, 'game', 'art', 'kapitel'); fs.mkdirSync(OUT, { recursive: true });
const SHOTS = [[1, 'riva', 'c1'], [2, 'kula', 'k2_s1'], [3, 'starimost', 'k3_d1'], [4, 'gleis11', 'k4_d1'], [5, 'neboder5', 'k5_pro']];
// PNG, Farbtyp 3 (Palette), Filter 0 je Zeile
const CRC = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
function crc32(buf) { let c = -1; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'ascii'), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(w, h, idx, pal) { const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 3; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const plte = Buffer.from(pal.flatMap(q => [q[0], q[1], q[2]])); const raw = Buffer.alloc((w + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w + 1)] = 0; for (let x = 0; x < w; x++) raw[y * (w + 1) + 1 + x] = idx[y * w + x]; }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', plte), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]); }
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto('file://' + path.join(ROOT, 'web', 'index.html')); await page.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 }); await page.waitForTimeout(800);
  for (const [n, room, phase] of SHOTS) {
    await page.evaluate(async ({ room, phase }) => { M.TEST = true; M.setPhase(phase); M.GS.malaOn = false; const R = M.ROOMS[room]; const st = R.start || [160, 120, 'R'];
      M.GS.rooms[room] = Object.assign(R.state ? R.state(M.GS) : {}, M.GS.rooms[room] || {}); M.GS.pos.marko = { room, x: st[0], y: st[1], f: st[2] || 'R' };
      M.E.screen = 'game'; await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: st[0], y: st[1], f: st[2] }); }, { room, phase });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => { const s = M.sceneSnap(); return s ? { idx: Array.from(s), pal: M.RGB.slice(0, M.NCOL).map(q => q || [0, 0, 0]) } : null; });
    if (!r) { console.log('FEHLER ' + room + ': kein Bild'); continue; }
    const f = path.join(OUT, 'k' + n + '.png'); fs.writeFileSync(f, png(320, 144, r.idx, r.pal)); console.log('k' + n + '.png ' + room + ' ' + Math.round(fs.statSync(f).size / 1024) + ' KB');
  }
  console.log(errs.length ? errs.join('\n') : 'keine JS-Fehler'); await browser.close();
})();
