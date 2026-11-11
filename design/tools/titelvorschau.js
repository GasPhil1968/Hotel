// Vorschau der Titelbilder: rendert jedes Titelbild (M.TITLES) zu festen Zeitpunkten als PNG (×3), mit Titel und Unterzeile,
// ohne die HTML-Schicht (das Menü liegt im Spiel darüber).   node design/tools/titelvorschau.js <ausgabeordner> [id …] [--t 0,3,7]
// --video 12: statt Einzelbildern je Titelbild ein Video (12 s, 15 fps, ×3) als <id>.mp4 (braucht ffmpeg)
'use strict';
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const args = process.argv.slice(2), OUT = args[0]; const ti = args.indexOf('--t'); const TS = ti >= 0 ? args[ti + 1].split(',').map(Number) : [0, 3, 7];
const vi = args.indexOf('--video'), VSEC = vi >= 0 ? +args[vi + 1] : 0;
const IDS = args.slice(1).filter((a, i, all) => !a.startsWith('--') && all[i - 1] !== '--t' && all[i - 1] !== '--video');
const HTML = path.join(__dirname, '..', '..', 'web', 'index.html'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
  const ids = IDS.length ? IDS : await p.evaluate(() => (M.TITLES || []).map(t => t.id));
  if (VSEC) { const { execFileSync } = require('child_process');
    for (const id of ids) { const dir = path.join(OUT, id + '_frames'); fs.mkdirSync(dir, { recursive: true });
      for (let f = 0; f < VSEC * 15; f++) { const t = f / 15; const url = await p.evaluate(({ id, t }) => { const k = M.TITLES.findIndex(x => x.id === id); M.titleIndex = k; M.__titleT = t; const fb = M.renderFrame(); M.__titleT = null;
          const c = document.createElement('canvas'); c.width = 320; c.height = 200; const g = c.getContext('2d'); const img = g.createImageData(320, 200);
          for (let i = 0; i < 64000; i++) { const rgb = M.RGB[fb.d[i]] || [0, 0, 0]; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
          g.putImageData(img, 0, 0); return c.toDataURL('image/png'); }, { id, t });
        fs.writeFileSync(path.join(dir, 'f' + String(f).padStart(4, '0') + '.png'), Buffer.from(url.split(',')[1], 'base64')); }
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '15', '-i', path.join(dir, 'f%04d.png'), '-vf', 'scale=960:600:flags=neighbor', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(OUT, id + '.mp4')]); }
    console.log('Videos:', ids.join(', '), errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await b.close(); return; }
  for (const id of ids) for (const t of TS) {
    const url = await p.evaluate(({ id, t }) => { const k = M.TITLES.findIndex(x => x.id === id); M.titleIndex = k; M.__titleT = t;
      const fb = M.renderFrame(); M.__titleT = null;
      const c = document.createElement('canvas'); c.width = 960; c.height = 600; const g = c.getContext('2d'); const img = g.createImageData(320, 200);
      for (let i = 0; i < 64000; i++) { const rgb = M.RGB[fb.d[i]] || [0, 0, 0]; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
      const tc = document.createElement('canvas'); tc.width = 320; tc.height = 200; tc.getContext('2d').putImageData(img, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(tc, 0, 0, 960, 600); return c.toDataURL('image/png'); }, { id, t });
    fs.writeFileSync(path.join(OUT, id + '_' + String(t).replace('.', '_') + '.png'), Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log('Titelbilder:', ids.join(', '), '· Zeiten', TS.join(', '), errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
