// Aufnahmen für die Vorstellung: (1) das Intro mit Ton (Bild des Spiels + Audioausgang der Engine, wie „Intro ansehen“),
// (2) die vier Titelbilder mit Menü (Bildschirmfotos der ganzen Seite, 15 fps, ohne Ton).
//   node design/tools/introaufnahme.js <ausgabeordner> [intro|titel]
// Ergebnis: intro_mit_ton.mp4 (1280 × 800, 30 fps, AAC) und titelbilder.mp4 (1280 × 800, 15 fps); braucht ffmpeg.
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const OUT = process.argv[2], WHAT = process.argv[3] || 'beide'; fs.mkdirSync(OUT, { recursive: true });
const HTML = path.join(__dirname, '..', '..', 'web', 'index.html');
async function intro(b) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0&titel=split'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  await p.evaluate(() => { M.audioInit(); M.audioResume(); M.setMusic(true); M.setSound(true); M.music(null); });
  await p.waitForTimeout(2200);
  // Aufnahme: Spielbild 320 × 200 (Canvas des Spiels) + Ton der Engine
  await p.evaluate(() => { const cv = document.getElementById('game'); const st = cv.captureStream(30); const au = M.audioStream(); if (au) au.getAudioTracks().forEach(t => st.addTrack(t));
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 8e6, audioBitsPerSecond: 192000 });
    window.__ch = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__ch.push(e.data); }; window.__r = r; r.start(500); });
  await p.evaluate(() => M.startIntro()); await p.waitForFunction(() => M.E.screen === 'title', null, { timeout: 60000 }); await p.waitForTimeout(3500);
  const b64 = await p.evaluate(() => new Promise(res => { const r = window.__r; r.onstop = () => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(new Blob(window.__ch, { type: 'video/webm' })); }; r.stop(); }));
  const raw = path.join(OUT, 'intro_raw.webm'); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-vf', 'fps=30,scale=1280:800:flags=neighbor', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', path.join(OUT, 'intro_mit_ton.mp4')]);
  console.log('Intro aufgenommen', errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); }
async function titel(b) { const dir = path.join(OUT, 'titel_frames'); fs.mkdirSync(dir, { recursive: true }); let f = 0;
  for (const id of ['split', 'sarajevo', 'mostar', 'muenchen']) {
    const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
    await p.goto('file://' + HTML + '?intro=0&titel=' + id); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); await p.waitForTimeout(1200);
    await p.evaluate(() => { const pn = document.querySelector('#shell .pnote button'); if (pn) pn.click(); });
    const t0 = await p.evaluate(() => M.E.gt());
    for (let k = 0; k < 15 * 7; k++) { await p.evaluate(({ t0, k }) => new Promise(res => { M.__titleT = (t0 / 1000) + k / 15; requestAnimationFrame(() => requestAnimationFrame(res)); }), { t0, k }); await p.screenshot({ path: path.join(dir, 'f' + String(f++).padStart(4, '0') + '.png') }); }
    await p.evaluate(() => { M.__titleT = null; }); await p.context().close(); }
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '15', '-i', path.join(dir, 'f%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, 'titelbilder.mp4')]);
  console.log('Titelbilder:', f, 'Bilder'); }
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  if (WHAT !== 'titel') await intro(b); if (WHAT !== 'intro') await titel(b); await b.close(); })().catch(e => { console.error(e); process.exit(1); });
