// Vorschau des Intros (89_intro.js): Einzelbilder zu festen Zeiten oder ein Video (15 fps, ×3), ohne Ton.
//   node design/tools/introvorschau.js <ausgabeordner> [--t 2,10,20] [--video]
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const args = process.argv.slice(2), OUT = args[0]; const ti = args.indexOf('--t'); const TS = ti >= 0 ? args[ti + 1].split(',').map(Number) : null; const VIDEO = args.includes('--video');
const HTML = path.join(__dirname, '..', '..', 'web', 'index.html'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=1'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'intro', null, { timeout: 30000 });
  const len = await p.evaluate(() => M.INTRO_LEN);
  const shot = (t) => p.evaluate((t) => { const E = M.E; M.OPENING.at = E.gt() - t * 1000; const fb = M.renderFrame();
    const c = document.createElement('canvas'); c.width = 320; c.height = 200; const g = c.getContext('2d'); const img = g.createImageData(320, 200);
    for (let i = 0; i < 64000; i++) { const rgb = M.RGB[fb.d[i]] || [0, 0, 0]; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
    g.putImageData(img, 0, 0); return c.toDataURL('image/png'); }, t);
  if (VIDEO) { const dir = path.join(OUT, 'intro_frames'); fs.mkdirSync(dir, { recursive: true });
    for (let f = 0; f < Math.ceil(len * 15); f++) { const u = await shot(f / 15); fs.writeFileSync(path.join(dir, 'f' + String(f).padStart(4, '0') + '.png'), Buffer.from(u.split(',')[1], 'base64')); }
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '15', '-i', path.join(dir, 'f%04d.png'), '-vf', 'scale=960:600:flags=neighbor', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(OUT, 'intro.mp4')]); }
  for (const t of (TS || [])) { const u = await shot(t); fs.writeFileSync(path.join(OUT, 'intro_' + String(t).replace('.', '_') + '.png'), Buffer.from(u.split(',')[1], 'base64')); }
  console.log('Intro', len + ' s', errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
