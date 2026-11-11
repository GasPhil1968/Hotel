// Eine Trailer-Szene aufnehmen: node design/trailer/record.js <szene> <ausgabeordner> [--dry]
// --dry: ohne Aufnahme durchspielen (zum Prüfen der Eingaben). Musik der Szene aus (nur Geräusche und Raumklang), außer music:true;
// die Musik des Trailers kommt aus eigenen Aufnahmen der Spielmusik (music.js).
'use strict';
const path = require('path'), fs = require('fs');
const R = require('./rec_lib'), { S } = require('./scenes');
const [name, outDir, flag] = process.argv.slice(2); const dry = flag === '--dry';
(async () => {
  const sc = S[name]; if (!sc) throw new Error('keine Szene ' + name + ' (' + Object.keys(S).join(', ') + ')');
  const { b, p } = await R.launch();
  // die einmalige Erklärung zum Doppelklick (pro Gerät) gilt als schon gesehen – außer in der Szene, die genau das zeigt
  if (!sc.dblTip) await p.evaluate(() => { try { localStorage.setItem('mala.dblTip', '1'); } catch (e) {} });
  await R.loadState(p, sc.src(), sc.patch);
  await R.audioOn(p); await p.evaluate((m) => { M.setMusic(!!m); M.setSound(true); }, !!sc.music);
  if (sc.pre) await sc.pre(p);
  const t0 = Date.now(); let res = null;
  if (!dry) await R.startRec(p);
  try { await sc.run(p); } catch (e) { console.error('Szene', name, 'abgebrochen:', e.message); try { console.error('Marken:', JSON.stringify(await p.evaluate(() => window.__marks || [])), 'Zustand:', JSON.stringify(await p.evaluate(() => ({ room: M.E.room.id, busy: M.E.busy, speech: M.E.speech && M.E.speech.src, dlg: M.E.dlg && M.E.dlg.opts.map(o => o.t), pop: M.E.pop && M.E.pop.opts.map(o => o.t), active: M.GS.active, trn: M.E.transitioning, overlay: M.E.overlay && M.E.overlay.kind })))); } catch (e2) {} if (!dry) { const out = path.join(outDir, name + '_FEHLER.webm'); await R.stopRec(p, out); } await b.close(); process.exit(1); }
  if (!dry) { fs.mkdirSync(outDir, { recursive: true }); const out = path.join(outDir, name + '.webm'); res = await R.stopRec(p, out); console.log(name, (res.size / 1e6).toFixed(1) + ' MB', ((Date.now() - t0) / 1000).toFixed(1) + ' s'); res.marks.forEach(m => console.log('  ' + m[0].toFixed(2).padStart(6) + '  ' + m[1])); }
  else console.log(name, 'trocken durchgespielt', ((Date.now() - t0) / 1000).toFixed(1) + ' s');
  console.log('JS-Fehler:', p.errs.length ? p.errs.join(' | ') : 'keine');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
