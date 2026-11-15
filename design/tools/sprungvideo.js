// Video von Dinos Sprung an der Alten Brücke (Kapitel 3, Samstag nach dem ganzen Lied) mit Ton: Spielbild 320 × 200 und der Audioausgang
// der Engine, vierfach ohne Glättung. Die Szene ist dieselbe wie im Spiel (rooms/starimost.js, M.k3DinoJumpForLena): Dino ruft, geht zur
// Auffahrt, Nahaufnahme „sprung“ (97_k3_nah.js), danach Lena, Davor, Mala und der nasse Dino an den Uferstufen.
//   node design/tools/sprungvideo.js <ausgabeordner>      Ergebnis: dino_sprung.mp4 (1280 × 800, 30 fps, AAC); braucht ffmpeg.
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const OUT = process.argv[2]; if (!OUT) { console.error('Aufruf: node design/tools/sprungvideo.js <ausgabeordner>'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const ROOT = path.join(__dirname, '..', '..'), HTML = path.join(ROOT, 'web', 'index.html'), FX = path.join(ROOT, 'qa', 'regress', 'fixtures');
const FLAGS = { 'k3.rules': 2, 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.s.photoTrip': true, 'k3.s.spot': true, 'k3.s.initials': true, 'k3.s.photo': true,
  'k3.x.vaga': true, 'k3.s.words': true, 'k3.s.dinoOk': true, 'k3.s.perf': true, 'k3.s.lenaVerse': true };
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y'].concat(args));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 });
  const d = JSON.parse(fs.readFileSync(path.join(FX, 'k3x_samstag.json'), 'utf8'));
  await p.evaluate(({ GS, F }) => { const base = M.freshGame(); Object.keys(base).forEach(k => { if (GS[k] !== undefined) base[k] = GS[k]; }); const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
    Object.assign(G.flags, F); ['b3_photo65', 'b3_initials', 'b3_lenaphoto', 's3_words', 'b3_hum', 's3_verse'].forEach(n => { if (G.notes.indexOf(n) < 0) G.notes.push(n); });
    G.pos.marko = { room: 'starimost', x: 266, y: 134, f: 'R' }; G.pos.mala = { room: 'starimost', x: 204, y: 135, f: 'R' }; G.active = 'marko'; G.malaOn = true;
    localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.TURBO = 20; M.E.loadKey('mala.qafx'); }, { GS: d.GS, F: FLAGS });
  await p.waitForFunction(() => M.E.screen === 'game' && M.E.room && M.E.room.id === 'starimost' && !M.E.busy, null, { timeout: 30000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { M.TURBO = 1; M.HD_ALWAYS = true; M.ROOMS.starimost.camLock = 150; M.audioInit(); M.audioResume(); M.setMusic(true); M.setSound(true); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const cv = document.getElementById('game'); const st = cv.captureStream(30); const au = M.audioStream(); if (au) au.getAudioTracks().forEach(t => st.addTrack(t));
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 8e6, audioBitsPerSecond: 192000 });
    window.__ch = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__ch.push(e.data); }; window.__r = r; r.start(500); });
  await p.waitForTimeout(1600);
  await p.evaluate(() => { window.__done = false; (async () => { M.E.busy = true; try { await M.k3DinoJumpForLena(M.API); } finally { M.E.busy = false; window.__done = true; } })(); });
  await p.waitForFunction(() => window.__done, null, { timeout: 180000 }); await p.waitForTimeout(1800);
  const b64 = await p.evaluate(() => new Promise(res => { const r = window.__r; r.onstop = () => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(new Blob(window.__ch, { type: 'video/webm' })); }; r.stop(); }));
  const raw = path.join(OUT, 'sprung_raw.webm'), tmp = path.join(OUT, 'sprung_tmp.mp4'), mp4 = path.join(OUT, 'dino_sprung.mp4'); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  ff(['-i', raw, '-vf', 'fps=30,scale=1280:800:flags=neighbor', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', tmp]);
  const D = dur(tmp); ff(['-i', tmp, '-vf', 'fade=t=in:st=0:d=0.5,fade=t=out:st=' + Math.max(0, D - 0.7).toFixed(2) + ':d=0.7', '-af', 'afade=t=in:st=0:d=0.4,afade=t=out:st=' + Math.max(0, D - 0.7).toFixed(2) + ':d=0.7',
    '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', mp4]);
  fs.unlinkSync(tmp); fs.unlinkSync(raw);
  console.log('dino_sprung.mp4:', D.toFixed(1) + ' s', errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await b.close(); })().catch(e => { console.error(e); process.exit(1); });
