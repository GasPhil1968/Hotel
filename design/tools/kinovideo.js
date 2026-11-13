// Video aller Zwischenfilme (89_kino.js, 89_kinoszenen.js) und des Spiel-Intros (89_intro.js), mit Ton, vierfach ohne Glättung.
//   node design/tools/kinovideo.js <ausgabeordner> [film,film,…]     Filme: spiel, k1_in, k1_out, … k5_out
// Ergebnis: <film>.mp4 je Film und zwischenfilme.mp4 (alle hintereinander, 1280 × 800, 30 fps, AAC); braucht ffmpeg.
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const OUT = process.argv[2]; if (!OUT) { console.error('Aufruf: node design/tools/kinovideo.js <ausgabeordner> [filme]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const HTML = path.join(__dirname, '..', '..', 'web', 'index.html');
const ALL = ['spiel', 'k1_in', 'k1_out', 'k2_in', 'k2_out', 'k3_in', 'k3_out', 'k4_in', 'k4_out', 'k5_in', 'k5_out'];
const WANT = (process.argv[3] || ALL.join(',')).split(',');
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y'].concat(args));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
async function film(b, id) { const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0&kino=1'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
  await p.evaluate(() => { M.audioInit(); M.audioResume(); M.setMusic(true); M.setSound(true); M.music('silence'); });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const cv = document.getElementById('game'); const st = cv.captureStream(30); const au = M.audioStream(); if (au) au.getAudioTracks().forEach(t => st.addTrack(t));
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 8e6, audioBitsPerSecond: 160000 });
    window.__ch = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__ch.push(e.data); }; window.__r = r; r.start(500); });
  await p.evaluate(async (id) => { if (id === 'spiel') { M.startIntro(); await new Promise(res => { const iv = setInterval(() => { if (M.E.screen !== 'intro') { clearInterval(iv); res(); } }, 50); }); await new Promise(r => setTimeout(r, 1800)); }
    else { await M.kinoStart(id, { back: 'title' }); M.E.screen = 'kinoEnd'; await new Promise(r => setTimeout(r, 300)); } }, id);
  const b64 = await p.evaluate(() => new Promise(res => { const r = window.__r; r.onstop = () => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(new Blob(window.__ch, { type: 'video/webm' })); }; r.stop(); }));
  const raw = path.join(OUT, id + '_raw.webm'), mp4 = path.join(OUT, id + '.mp4'); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  ff(['-i', raw, '-vf', 'fps=30,crop=320:200:0:0,scale=1280:800:flags=neighbor', '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', mp4]);
  fs.unlinkSync(raw); console.log(id + ': ' + dur(mp4).toFixed(1) + ' s', errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await p.context().close(); return mp4; }
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const files = [];
  for (const k of WANT) files.push(await film(b, k));
  await b.close();
  if (files.length > 1) { const inp = [], fc = []; files.forEach((f, i) => { inp.push('-i', f); fc.push('[' + i + ':v][' + i + ':a]'); });
    ff(inp.concat(['-filter_complex', fc.join('') + 'concat=n=' + files.length + ':v=1:a=1[v][a]', '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', path.join(OUT, 'zwischenfilme.mp4')]));
    console.log('Gesamt:', dur(path.join(OUT, 'zwischenfilme.mp4')).toFixed(1) + ' s'); } })().catch(e => { console.error(e); process.exit(1); });
