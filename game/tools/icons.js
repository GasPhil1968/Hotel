// Zeichnet das App-Icon mit der Spiel-Engine (32×32 Pixel, ganzzahlig hochskaliert) und speichert die PNGs nach web/.
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, '..', '..', 'web', 'index.html')); await page.waitForTimeout(300);
  const urls = await page.evaluate(() => {
    var P = M.P, b = new M.Buf(32, 32, P.k0);
    M.sky(b, 0, 0, 32, 20, 'night', 3); M.moon(b, 24, 6, 2);
    M.scn.belltower(b, 9, 20, 14, P.k1, true); for (var x = 0; x < 32; x++) { var h = 2 + Math.round(Math.sin(x * 0.7) * 1.2); for (var y = 20 - h; y < 20; y++) if (x < 6 || x > 12) b.px(x, y, P.k1); }
    M.sea(b, 0, 20, 32, 12, 'night', 0, 0);
    for (var x2 = 0; x2 < 20; x2++) { b.px(x2, 23, P.s1); b.px(x2, 24, P.s0); }
    // Mala als Schimmer am Ende der Mole
    var mx = 17; b.rect(mx, 11, 2, 2, P.x5); b.px(mx - 1, 11, P.x2); b.vl(mx - 1, 12, 15, P.x2); b.rect(mx - 1, 14, 4, 2, P.x4); b.rect(mx - 2, 15, 6, 1, P.x3); b.rect(mx - 1, 16, 4, 4, P.x3); b.vl(mx - 2, 16, 19, P.x2); b.vl(mx + 3, 16, 18, P.x2); b.vl(mx, 20, 22, P.x4); b.vl(mx + 2, 20, 22, P.x4); b.px(mx, 15, P.x5);
    for (var i = 0; i < 6; i++) b.px(mx + ((i % 2) ? 1 : -1), 25 + i, i % 2 ? P.x3 : P.x2);
    b.px(26, 25, P.y4); b.px(27, 25, P.y3);
    function png(size) { var c = document.createElement('canvas'); c.width = size; c.height = size; var x = c.getContext('2d'); var img = x.createImageData(32, 32);
      for (var i = 0; i < 1024; i++) { var q = M.RGB[b.d[i]] || [0, 0, 0]; img.data[i * 4] = q[0]; img.data[i * 4 + 1] = q[1]; img.data[i * 4 + 2] = q[2]; img.data[i * 4 + 3] = 255; }
      var t = document.createElement('canvas'); t.width = 32; t.height = 32; t.getContext('2d').putImageData(img, 0, 0); x.imageSmoothingEnabled = false; x.drawImage(t, 0, 0, size, size); return c.toDataURL('image/png'); }
    return { 180: png(180), 192: png(192), 512: png(512) };
  });
  for (const k of Object.keys(urls)) fs.writeFileSync(path.join(__dirname, '..', '..', 'web', 'icon-' + k + '.png'), Buffer.from(urls[k].split(',')[1], 'base64'));
  console.log('Icons geschrieben'); await browser.close();
})();
