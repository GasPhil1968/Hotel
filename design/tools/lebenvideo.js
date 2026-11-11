// Video „Eigenleben“: Marko geht durch Räume mit Nebenfiguren, bleibt stehen (Gesten im Leerlauf), geht hinter Leuten vorbei
// (sie drehen sich um oder sehen über die Schulter), spricht (wechselnde Sprechgesten). Aufnahme direkt vom Spielbild (320 × 200),
// ohne Ton, danach vierfach vergrößert (Nächster Nachbar).
//   node design/tools/lebenvideo.js <ausgabeordner> [raum@phase[@figur],… ] [--html pfad]   (figur: hinter wen Marko geht)
// Ergebnis: leben.mp4 (1280 × 800, 30 fps) und je Raum einige Standbilder; braucht ffmpeg.
'use strict';
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const a = process.argv.slice(2), OUT = a[0]; fs.mkdirSync(OUT, { recursive: true });
const hi = a.indexOf('--html'), HTML = hi >= 0 ? path.resolve(a[hi + 1]) : path.join(__dirname, '..', '..', 'web', 'index.html');
const LIST = (a[1] && !a[1].startsWith('--') ? a[1] : 'riva@c1,heim_flur@k4_d1@kraus,matejuska@c1@dinko,office@c1@mladen,kafana@k2_s1@lejla,bar@c1@sanja').split(',').map(s => s.split('@'));
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  const go = (room, ph) => p.evaluate(async ({ room, ph }) => { M.setPhase(ph); M.GS.malaOn = true; const R = M.ROOMS[room]; const st = R.start || [160, 120, 'R'];
    M.GS.rooms[room] = Object.assign(R.state ? R.state(M.GS) : {}, M.GS.rooms[room] || {}); M.GS.pos.marko = { room, x: st[0], y: st[1], f: st[2] || 'R' };
    await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: st[0], y: st[1], f: st[2] }); M.API.malaJoin({ fadeIn: false }); M.E.screen = 'game'; if (M.shell && M.shell.closeAll) try { M.shell.closeAll(); } catch (e) { } }, { room, ph });
  await go(LIST[0][0], LIST[0][1]);
  await p.evaluate(() => { const cv = document.getElementById('game'); const st = cv.captureStream(30); const mt = ['video/webm;codecs=vp9', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
    const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 6e6 }); window.__ch = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__ch.push(e.data); }; window.__r = r; r.start(500); });
  let shot = 0; const snap = async (n) => { await p.screenshot({ path: path.join(OUT, String(++shot).padStart(2, '0') + '_' + n + '.png'), clip: { x: 0, y: 0, width: 1280, height: 576 } }); };
  for (let i = 0; i < LIST.length; i++) { const [room, ph, who] = LIST[i]; if (i) await go(room, ph);
    const info = await p.evaluate(() => { const pl = M.E.player(), npcs = Object.keys(M.ACT).map(k => M.ACT[k]).filter(x => !x.player && x.id !== 'mala' && x.id !== 'marko' && x.visible); return { x: pl.x, y: pl.y, npcs: npcs.map(n => ({ id: n.id, x: n.x, y: n.y, f: n.f, idle: n.idle })) }; });
    await p.waitForTimeout(1500);
    // hinter die erste stehende Figur ohne Tätigkeit gehen (sonst hinter irgendeine), dort warten
    const n = (who && info.npcs.find(q => q.id === who)) || info.npcs.find(q => !q.idle && (q.f === 'L' || q.f === 'R')) || info.npcs.find(q => q.f === 'L' || q.f === 'R') || info.npcs[0];
    if (n) { const tx = n.f === 'F' ? n.x - 34 : n.x + (n.f === 'R' ? -26 : 26); await p.evaluate(({ x, y }) => M.API.walk(x, y), { x: tx, y: n.y + 2 }); await p.waitForTimeout(2600); await snap(room + '_hinter_' + n.id); await p.waitForTimeout(3000); }
    if (!n) { await p.waitForTimeout(9000); await snap(room + '_steht_allein'); }
    await p.evaluate(() => M.API.m('Guten Abend.')); await p.waitForTimeout(400); await snap(room + '_spricht');
    await p.waitForTimeout(6500); await snap(room + '_steht');
    await p.evaluate(({ x, y }) => M.API.walk(x, y), { x: info.x, y: info.y }); await p.waitForTimeout(4200);
    await p.evaluate(() => M.API.m('Na gut.')); await p.waitForTimeout(3200); }
  const b64 = await p.evaluate(() => new Promise(res => { const r = window.__r; r.onstop = () => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(new Blob(window.__ch, { type: 'video/webm' })); }; r.stop(); }));
  const raw = path.join(OUT, 'leben_raw.webm'); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-vf', 'fps=30,scale=1280:800:flags=neighbor', '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, 'leben.mp4')]);
  fs.unlinkSync(raw); console.log('Video', path.join(OUT, 'leben.mp4'), errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
