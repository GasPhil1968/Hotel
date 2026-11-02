// Rendert alle Erinnerungsbilder (M.mem) mit ihrer Färbung auf ein Blatt: node game/tools/memsheet.js out.png
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || path.join(__dirname, 'memsheet.png');
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await page.goto('file://' + path.join(__dirname, '..', '..', 'web', 'index.html'));
  await page.waitForFunction(() => window.M && M.mem && M.drawPose, null, { timeout: 15000 });
  const dims = await page.evaluate(() => {
    const tints = { pier: 'memory', storm: 'ghost', letter: 'ghost', kiosk: 'ghost', guitarcase: 'ghost', fall: 'ghost', bus: 'memory' };
    const ids = Object.keys(tints), w = 232, h = 104, S = 3, cols = 2, pad = 6;
    const W = cols * (w + pad) + pad, H = Math.ceil(ids.length / cols) * (h + pad) + pad;
    const sheet = new M.Buf(W, H, M.P.s2);
    ids.forEach((id, i) => { const b = new M.Buf(w, h, M.P.k0); try { M.mem[id](b, 0); } catch (e) { console.log('ERR', id, e.message); }
      M.tintApply(b, tints[id] === 'ghost' ? M.TINT.ghost : M.TINT.memory);
      const ox = pad + (i % cols) * (w + pad), oy = pad + Math.floor(i / cols) * (h + pad);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) sheet.d[(oy + y) * W + ox + x] = b.d[y * w + x];
      M.text(sheet, id, ox + 2, oy + 2, M.P.l1); });
    const cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:99999';
    document.body.appendChild(cv); const x = cv.getContext('2d'); const img = x.createImageData(W, H);
    for (let i = 0; i < W * H; i++) { const q = M.RGB[sheet.d[i]] || [255, 0, 255]; img.data[i * 4] = q[0]; img.data[i * 4 + 1] = q[1]; img.data[i * 4 + 2] = q[2]; img.data[i * 4 + 3] = 255; }
    const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(img, 0, 0); x.imageSmoothingEnabled = false; x.drawImage(t, 0, 0, W * S, H * S);
    return [W * S, H * S];
  });
  await page.setViewportSize({ width: dims[0], height: dims[1] });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: dims[0], height: dims[1] } });
  await browser.close(); console.log('ok', out, dims);
})();
