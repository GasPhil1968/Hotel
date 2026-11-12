// Rundgang durch Mostar mit den elf Grafikpunkten (design/K3_GRAFIK.md): kurze Szenen aus dem Spiel, mit Ton, vierfach ohne Glättung.
//   node design/tools/k3grafik_video.js <ausgabeordner> [szene,szene,…]
// Ergebnis: k3_<szene>.mp4 je Szene und rundgang.mp4 (alle hintereinander, 1280 × 800, 30 fps, AAC); braucht ffmpeg.
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const OUT = process.argv[2]; if (!OUT) { console.error('Aufruf: node design/tools/k3grafik_video.js <ausgabeordner> [szenen]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const HTML = path.join(__dirname, '..', '..', 'web', 'index.html');
// je Szene: Raum, Phase, Marko, Mala, Kamera, Ablauf (läuft im Browser, A = M.API)
const SC = {
  brueckeTag: { room: 'starimost', ph: 'k3_d2', mk: [40, 124, 'R'], ml: [14, 120, 'R'], run: "await A.npc('marko').walk(470,124); await A.wait(600);" },
  regen: { room: 'starimost', ph: 'k3_pro', mk: [60, 126, 'R'], ml: [30, 122, 'R'], run: "await A.npc('marko').walk(190,126); await A.wait(900); await A.m('Nass bis auf die Knochen.'); await A.wait(400);" },
  laterneNacht: { room: 'starimost', ph: 'k3_pro_n', mk: [40, 128, 'R'], ml: [14, 124, 'R'], run: "await A.npc('marko').walk(200,128); await A.wait(500); await A.npc('marko').walk(90,128); await A.wait(700);" },
  bura: { room: 'ostbus', ph: 'k3_d1', mk: [200, 126, 'L'], ml: [236, 122, 'L'], run: "await A.wait(1500); await A.m('Kalt heute. Und dieser Wind!'); await A.wait(800); await A.npc('marko').walk(150,126); await A.wait(1200);" },
  kujNacht: { room: 'kujundziluk', ph: 'k3_d1_n', mk: [40, 124, 'R'], ml: [14, 120, 'R'], run: "await A.npc('marko').walk(300,124); await A.wait(900);" },
  bulevarNacht: { room: 'bulevar', ph: 'k3_d2_n', mk: [60, 128, 'R'], ml: [30, 124, 'R'], run: "await A.wait(1200); await A.npc('marko').walk(260,128); await A.wait(1500);" },
  skela: { room: 'skela_d', ph: 'k3_d2', mk: [250, 124, 'L'], ml: [280, 120, 'L'], run: "await A.wait(1000); await A.npc('marko').walk(150,124); await A.wait(1500); await A.m('Hier ist nichts. Eine Brücke und Hunde.'); await A.wait(500);" },
  frost: { room: 'skela_d', ph: 'k3_fin_n', mk: [160, 124, 'R'], ml: [130, 120, 'R'], run: "await A.wait(1200); await A.m('Frost. Und kein Licht drüben.'); await A.wait(1500);" },
  nahGlocke: { room: 'skela_d', ph: 'k3_d2_n', mk: [160, 124, 'R'], ml: [130, 120, 'R'], run: "await A.wait(400); A.sfx('ferrybell'); await M.k3Close(A,'glocke',async function(){ await A.m('Ich ziehe am Seil. Die Glocke schlägt einmal, grün und rau, und der Ton geht über das Wasser und kommt vom anderen Ufer zurück.'); await A.wait(900); }); await A.wait(300);" },
  nahHaende: { room: 'skela_d', ph: 'k3_fin_n', mk: [160, 124, 'R'], ml: [130, 120, 'R'], run: "await A.wait(300); await M.k3Close(A,'haende',async function(){ await A.wait(800); await A.narrate('Er sieht auf seine Hände. Die Laterne zittert.'); }); await A.wait(300);" },
  nahScheitel: { room: 'starimost', ph: 'k3_epi', mk: [300, 124, 'R'], ml: [330, 120, 'L'], run: "await A.wait(300); await M.k3Close(A,'scheitel',async function(){ await A.wait(700); await A.g('Tief unten.'); await A.wait(600); await A.m('Hast du Angst?'); await A.wait(800); await A.g('Ja.'); await A.wait(500); await A.g('Aber es ist meine.'); }); await A.wait(300);" }
};
const WANT = (process.argv[3] || Object.keys(SC).join(',')).split(',');
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y'].concat(args));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
async function scene(b, key) { const sc = SC[key]; const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
  await p.evaluate(async (sc) => { M.setPhase(sc.ph); const G = M.GS; G.malaOn = !!sc.ml; G.flags['k3.rules'] = 2; const R = M.ROOMS[sc.room]; G.rooms[sc.room] = Object.assign(R.state ? R.state(G) : {}, G.rooms[sc.room] || {});
    G.pos.marko = { room: sc.room, x: sc.mk[0], y: sc.mk[1], f: sc.mk[2] }; if (sc.ml) G.pos.mala = { room: sc.room, x: sc.ml[0], y: sc.ml[1], f: sc.ml[2] };
    await M.gotoRoom(sc.room, { fade: false, noEnter: true, noSave: true, keepPos: true, x: sc.mk[0], y: sc.mk[1], f: sc.mk[2] }); if (sc.ml) { M.API.malaJoin({ fadeIn: false }); const m = M.E.ACT.mala; if (m) { m.x = sc.ml[0]; m.y = sc.ml[1]; m.f = sc.ml[2]; } }
    M.E.screen = 'game'; M.E.busy = true; M.audioInit(); M.audioResume(); M.setMusic(false); M.setSound(true); }, sc);
  await p.waitForTimeout(1200);
  await p.evaluate(() => { const cv = document.getElementById('game'); const st = cv.captureStream(30); const au = M.audioStream(); if (au) au.getAudioTracks().forEach(t => st.addTrack(t));
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 8e6, audioBitsPerSecond: 160000 });
    window.__ch = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__ch.push(e.data); }; window.__r = r; r.start(500); });
  await p.evaluate(async (code) => { const A = M.API; await (new Function('A', 'M', 'return (async function(){ ' + code + ' })();'))(A, M); }, sc.run);
  const b64 = await p.evaluate(() => new Promise(res => { const r = window.__r; r.onstop = () => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(new Blob(window.__ch, { type: 'video/webm' })); }; r.stop(); }));
  const raw = path.join(OUT, key + '_raw.webm'), tmp = path.join(OUT, key + '_tmp.mp4'), mp4 = path.join(OUT, 'k3_' + key + '.mp4'); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  // nur die Szene (320 × 144), vierfach
  ff(['-i', raw, '-vf', 'fps=30,crop=320:144:0:0,scale=1280:576:flags=neighbor', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', tmp]);
  const D = dur(tmp); ff(['-i', tmp, '-vf', 'fade=t=in:st=0:d=0.4,fade=t=out:st=' + Math.max(0, D - 0.5).toFixed(2) + ':d=0.5', '-af', 'afade=t=in:st=0:d=0.3,afade=t=out:st=' + Math.max(0, D - 0.5).toFixed(2) + ':d=0.5,volume=8dB', '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', mp4]);
  fs.unlinkSync(raw); fs.unlinkSync(tmp); console.log(key + ': ' + D.toFixed(1) + ' s', errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await p.context().close(); return mp4; }
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const files = [];
  for (const k of WANT) { if (SC[k]) files.push(await scene(b, k)); }
  await b.close();
  if (files.length > 1) { const inp = [], fc = []; files.forEach((f, i) => { inp.push('-i', f); fc.push('[' + i + ':v][' + i + ':a]'); });
    ff(inp.concat(['-filter_complex', fc.join('') + 'concat=n=' + files.length + ':v=1:a=1[v][a]', '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', path.join(OUT, 'rundgang.mp4')]));
    files.forEach(f => fs.unlinkSync(f)); console.log('Rundgang:', dur(path.join(OUT, 'rundgang.mp4')).toFixed(1) + ' s'); } })().catch(e => { console.error(e); process.exit(1); });
