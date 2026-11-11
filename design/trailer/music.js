// Spielmusik für den Trailer aufnehmen (nur Musik, Geräusche aus): node design/trailer/music.js <ausgabeordner> [stück:sekunden …]
// Die Stücke erzeugt das Spiel selbst (04_audio.js, 16_k*_audio.js); aufgenommen wird die Ausgabe der Engine (M.audioStream).
'use strict';
const path = require('path'), fs = require('fs'), R = require('./rec_lib');
const [out, ...list] = process.argv.slice(2);
const SONGS = list.length ? list.map(s => s.split(':')) : [['title', 75], ['ghost', 40], ['k3_istraga', 60], ['case1', 45], ['vecerPiano', 45], ['end', 45]];
(async () => { fs.mkdirSync(out, { recursive: true });
  for (const [name, sec] of SONGS) {
    const { b, p } = await R.launch();
    // Titelmusik aus (sie blendet 1,7 s lang aus), erst danach das gewünschte Stück
    await p.evaluate(() => { M.audioInit(); M.audioResume(); M.setSound(false); M.setMusic(true); M.music(null); });
    await p.waitForTimeout(2200);
    await p.evaluate(() => { const st = M.audioStream(); const mt = ['audio/webm;codecs=opus', 'audio/webm'].find(t => MediaRecorder.isTypeSupported(t)); const r = new MediaRecorder(st, { mimeType: mt, audioBitsPerSecond: 256000 }); window.__chunks = []; r.ondataavailable = e => { if (e.data && e.data.size) window.__chunks.push(e.data); }; window.__rec = r; r.start(500); });
    await p.evaluate((n) => { M.music(n); }, name);
    await p.waitForTimeout(1500); const lvl = await p.evaluate(() => M.currentSong());   // Kontrolle: läuft das Stück?
    if (lvl !== name) throw new Error('Stück läuft nicht: ' + name + ' / ' + lvl);
    await p.waitForTimeout(sec * 1000);
    const size = await p.evaluate(() => new Promise(res => { const r = window.__rec; r.onstop = () => { window.__blob = new Blob(window.__chunks, { type: 'audio/webm' }); res(window.__blob.size); }; r.stop(); }));
    const b64 = await p.evaluate(() => new Promise(res => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(window.__blob); }));
    fs.writeFileSync(path.join(out, name + '.webm'), Buffer.from(b64, 'base64')); console.log(name, sec + ' s', (size / 1e3).toFixed(0) + ' kB', p.errs.length ? p.errs.join(' | ') : '');
    await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
