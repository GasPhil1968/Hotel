// Porträt-Blatt: alle (oder ausgewählte) Porträts in den Varianten n / o / b, Geister zusätzlich eingefärbt,
// je auf dunklem und hellem Grund und als Szene mit Textkasten (Entwicklungswerkzeug)
// node game/tools/portraitsheet.js --out blatt.png [--html pfad/index.html] [--ids marko,mala] [--scale 3]
const { chromium } = require('playwright');
const path = require('path');
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
(async () => {
  const html = arg('--html', path.join(__dirname, '..', '..', 'web', 'index.html'));
  const out = arg('--out', 'portraits.png'), ids = arg('--ids'), S = +arg('--scale', 3);
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto('file://' + path.resolve(html)); await page.waitForFunction(() => window.M && M.PORTRAITS, null, { timeout: 15000 });
  const dims = await page.evaluate(({ ids, S }) => {
    const list = (ids ? ids.split(',') : Object.keys(M.PORTRAITS)).filter(id => M.PORTRAITS[id]);
    const PW = M.PORTRAIT_W, PH = M.PORTRAIT_H, pad = 6, lab = 10, colW = PW + pad;
    const W = pad + colW * 8 + 330, rowH = PH + lab + pad, H = Math.max(1, list.length) * rowH + pad;
    const b = new M.Buf(W, H, M.P.k2);
    const blit = (src, x, y, bg, flip) => { for (let j = 0; j < src.h; j++) for (let i = 0; i < src.w; i++) { const c = src.d[j * src.w + (flip ? src.w - 1 - i : i)]; if (c === M.T) { if (bg !== null) b.px(x + i, y + j, bg); } else b.px(x + i, y + j, c); } };
    list.forEach((id, r) => {
      const y = pad + r * rowH; let x = pad; const ghost = !!M.PORTRAIT_GHOSTS[id];
      M.text(b, id + (ghost ? ' (Geist)' : ''), x, y, M.P.s6);
      [['n', false, M.P.k1], ['o', false, M.P.k1], ['b', false, M.P.k1], ['n', false, M.P.s4], ['n', true, M.P.k1], ['o', true, M.P.k1], ['n', false, M.P.n2], ['n', true, M.P.s3]].forEach((v, i) => {
        const pb = M.portrait(id, v[0], v[1]); if (!pb) return; blit(pb, x + i * colW, y + lab, v[2]); });
      // Szene: Porträt links oben, Textkasten daneben
      const sx = pad + colW * 8, sw = 320, sh = PH + 4;
      for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) b.px(sx + i, y + lab + j, M.rampAt(M.R('n0 n1 c1 c2'), j / sh, sx + i, y + j));
      const pb = M.portrait(id, 'n'); if (pb) blit(pb, sx + 2, y + lab + 2, null);
      const tx = sx + PW + 8, tw = 180; b.rect(tx, y + lab + 6, tw, 22, M.P.s6); b.rect(tx + 1, y + lab + 7, tw - 2, 20, M.P.k0);
      M.text(b, 'Probe: Ein Satz im Kasten.', tx + 5, y + lab + 12, M.CAST_COLORS[id] || M.P.s6);
    });
    const cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:99999';
    document.body.innerHTML = ''; document.body.appendChild(cv); const x = cv.getContext('2d'); const img = x.createImageData(W, H);
    for (let i = 0; i < W * H; i++) { const q = M.RGB[b.d[i]] || [255, 0, 255]; img.data[i * 4] = q[0]; img.data[i * 4 + 1] = q[1]; img.data[i * 4 + 2] = q[2]; img.data[i * 4 + 3] = 255; }
    const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(img, 0, 0); x.imageSmoothingEnabled = false; x.drawImage(t, 0, 0, W * S, H * S);
    return [W * S, H * S, list.length];
  }, { ids, S });
  await page.setViewportSize({ width: Math.min(dims[0], 4000), height: Math.min(dims[1], 6000) });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: dims[0], height: dims[1] } });
  await browser.close(); console.log('ok', out, dims[2], 'Porträts', errs.length ? '\nFEHLER: ' + errs.join('\n') : '');
})();
