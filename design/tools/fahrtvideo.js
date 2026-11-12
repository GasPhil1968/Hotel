// Video der Fahrten nach Skela (Kapitel 3, rooms/k3_fahrt.js) mit Ton: Spielbild 320 × 200 und der Audioausgang der Engine, wie im Spiel
// über den Stadtplan ausgelöst (Auswahl „Mit dem Taxi“ / „Mit Dino auf dem Roller“), vierfach ohne Glättung.
//   node design/tools/fahrtvideo.js <ausgabeordner> [taxi,roller,zurueck,nacht]
// Spielstände aus qa/regress/fixtures (Samstag, Samstagnacht). Ergebnis: fahrt_<teil>.mp4 je Teil und fahrten_skela.mp4 (alle Teile
// hintereinander, 1280 × 800, 30 fps, AAC); braucht ffmpeg.
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const OUT = process.argv[2]; if (!OUT) { console.error('Aufruf: node design/tools/fahrtvideo.js <ausgabeordner> [teile]'); process.exit(2); }
const WHAT = (process.argv[3] || 'taxi,roller,zurueck,nacht').split(','); fs.mkdirSync(OUT, { recursive: true });
const ROOT = path.join(__dirname, '..', '..'), HTML = path.join(ROOT, 'web', 'index.html'), FX = path.join(ROOT, 'qa', 'regress', 'fixtures');
// Samstag: alle Bedingungen für Skela erfüllt (Mala hat ihren Faden, Vlado, Bus aus München, Haus Zelenika, Foto)
const SAT = { 'k3.rules': 2, 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.photo': true };
const PARTS = {
  taxi: { fx: 'k3x_samstag.json', start: 'ostbus', dest: 'skela', arrive: 'skela_d', pick: /Taxi/, flags: Object.assign({ 'k3.dino.ride': true }, SAT) },
  roller: { fx: 'k3x_samstag.json', start: 'ostbus', dest: 'skela', arrive: 'skela_d', pick: /Roller/, flags: Object.assign({ 'k3.dino.ride': true }, SAT) },
  zurueck: { fx: 'k3x_samstag.json', start: 'skela_d', dest: 'ostbus', arrive: 'ostbus', flags: Object.assign({ 'k3.ride': 'taxi', 'k3.taxi1': true }, SAT) },
  nacht: { fx: 'k3x_samstag_nacht.json', start: 'ostbus', dest: 'skela', arrive: 'skela_d', flags: Object.assign({}, SAT) }
};
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y'].concat(args));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
async function part(b, key) { const P = PARTS[key];
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 });
  const d = JSON.parse(fs.readFileSync(path.join(FX, P.fx), 'utf8'));
  await p.evaluate(({ GS, P }) => { const base = M.freshGame(); Object.keys(base).forEach(k => { if (GS[k] !== undefined) base[k] = GS[k]; }); const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
    Object.assign(G.flags, P.flags); if (P.flags['k3.taxi1']) G.seen['k3.taxi1'] = true; if (G.inv.indexOf('plan') < 0) G.inv.push('plan');
    const st = M.ROOMS[P.start].start || [160, 120, 'R']; G.pos.marko = { room: P.start, x: st[0], y: st[1], f: st[2] || 'R' }; G.pos.mala = { room: P.start, x: st[0] + 30, y: st[1] - 2, f: st[2] || 'R' }; G.active = 'marko'; G.malaOn = true;
    localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.TURBO = 20; M.E.loadKey('mala.qafx'); }, { GS: d.GS, P });
  await p.waitForFunction(() => M.E.screen === 'game' && M.E.room && !M.E.busy, null, { timeout: 30000 }); await p.waitForTimeout(600);
  await p.evaluate(() => { M.TURBO = 1; M.audioInit(); M.audioResume(); M.setMusic(true); M.setSound(true); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const cv = document.getElementById('game'); const st = cv.captureStream(30); const au = M.audioStream(); if (au) au.getAudioTracks().forEach(t => st.addTrack(t));
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)); const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 8e6, audioBitsPerSecond: 192000 });
    window.__ch = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__ch.push(e.data); }; window.__r = r; r.start(500); });
  await p.waitForTimeout(1400); await p.evaluate(() => M.openMap()); await p.waitForTimeout(1800);   // erst der Ort, dann der Stadtplan
  p.evaluate((dest) => M.mapGo(dest), P.dest).catch(() => {});
  const t0 = Date.now(); let arrived = 0, rode = false, picks = [];
  while (Date.now() - t0 < 240000) { const s = await p.evaluate(() => ({ room: M.E.room && M.E.room.id, dlg: M.E.dlg ? M.E.dlg.opts.map(o => o.t) : null }));
    if (s.room === 'k3_fahrt') rode = true;
    if (s.dlg) { await p.waitForTimeout(1700); let i = 0; if (P.pick) { const j = s.dlg.findIndex(t => P.pick.test(t)); if (j >= 0) i = j; } picks.push(s.dlg[i]); await p.evaluate(i => M.E.chooseDone(i), i); await p.waitForTimeout(300); continue; }
    if (rode && s.room === P.arrive) { if (!arrived) arrived = Date.now(); else if (Date.now() - arrived > 3200) break; }
    await p.waitForTimeout(120); }
  const b64 = await p.evaluate(() => new Promise(res => { const r = window.__r; r.onstop = () => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(new Blob(window.__ch, { type: 'video/webm' })); }; r.stop(); }));
  const raw = path.join(OUT, 'fahrt_' + key + '_raw.webm'), mp4 = path.join(OUT, 'fahrt_' + key + '.mp4'); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  const tmp = path.join(OUT, 'fahrt_' + key + '_tmp.mp4');
  ff(['-i', raw, '-vf', 'fps=30,scale=1280:800:flags=neighbor', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', tmp]);
  const D = dur(tmp); ff(['-i', tmp, '-vf', 'fade=t=in:st=0:d=0.5,fade=t=out:st=' + Math.max(0, D - 0.6).toFixed(2) + ':d=0.6', '-af', 'afade=t=in:st=0:d=0.4,afade=t=out:st=' + Math.max(0, D - 0.6).toFixed(2) + ':d=0.6',
    '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', mp4]);
  fs.unlinkSync(tmp); fs.unlinkSync(raw);
  console.log(key + ':', D.toFixed(1) + ' s', rode ? 'Fahrtszene' : 'KEINE Fahrtszene', 'Auswahl:', JSON.stringify(picks), errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler');
  await p.context().close(); return mp4; }
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const files = [];
  for (const k of WHAT) { if (!PARTS[k]) { console.error('unbekannter Teil', k); continue; } files.push(await part(b, k)); }
  await b.close();
  if (files.length > 1) { const inp = [], fc = []; files.forEach((f, i) => { inp.push('-i', f); fc.push('[' + i + ':v][' + i + ':a]'); });
    ff(inp.concat(['-filter_complex', fc.join('') + 'concat=n=' + files.length + ':v=1:a=1[v][a]', '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', path.join(OUT, 'fahrten_skela.mp4')]));
    console.log('Gesamt:', dur(path.join(OUT, 'fahrten_skela.mp4')).toFixed(1) + ' s'); } })().catch(e => { console.error(e); process.exit(1); });
