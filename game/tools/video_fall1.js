// Video: Kapitel 1, erster Fall „Das Boot um sieben“ (vom Ende des Prologs bis Ivka hinübergeht), in Echtzeit mit Ton.
// Ablauf:
//   1. node game/build.js
//   2. MALA_LANG=bhs MALA_DUMPALL=<dumps> node game/tools/walkthrough.js       (Spielstand nach jedem Schritt; 14.json = Abend vor der Nacht, Text geschrieben)
//   3. MALA_LANG=bhs node game/tools/video_fall1.js <bilder-ordner> <dumps>     (dauert so lange wie das Video, etwa 19 Minuten)
//      DRY=1: achtfach schneller, ohne Bilder (Probelauf); am Ende stehen noch deutsche Texte und zu breite Zeilen im Protokoll
//   4. cd <bilder-ordner> && ffmpeg -framerate $(cat fps.txt) -i f_%05d.png -i audio.webm \
//        -vf "scale=1280:800:flags=neighbor,format=yuv420p" -r 25 -c:v libx264 -preset medium -crf 21 -tune animation \
//        -af "loudnorm=I=-19:TP=-1.5:LRA=11" -c:a aac -b:a 160k -ar 48000 -shortest -movflags +faststart ../video.mp4
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const DIR = process.argv[2], DUMPS = process.argv[3], DRY = !!process.env.DRY, SPEEDUP = DRY ? 8 : 1, LANG = process.env.MALA_LANG || 'bhs';
const HTML = process.env.MALA_HTML || path.join(__dirname, '..', '..', 'web', 'index.html');
if (!DIR || !DUMPS) { console.log('Aufruf: video_fall1.js <bilder-ordner> <dumps-ordner>'); process.exit(2); }
fs.mkdirSync(DIR, { recursive: true });
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(HTML)); await page.waitForTimeout(600); if (DRY) await page.evaluate(() => { window.__dry = true; });
  await page.evaluate((lang) => { try { localStorage.clear(); } catch (e) {} M.setLang(lang); M.trLogUI = !!window.__dry; M.audioInit(); M.setMusic && M.setMusic(true); M.setSound && M.setSound(true); M.E.setNbStyle('list');
    const st = M.audioStream(); window.__chunks = []; const mr = new MediaRecorder(st, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 }); mr.ondataavailable = e => { if (e.data.size) window.__chunks.push(e.data); }; window.__mr = mr;
    // Bilder im Takt von 25/s auf der Seite selbst aufnehmen (gleichmäßiger als Abholen von außen)
    window.__frames = []; if (!window.__dry) window.__grab = setInterval(() => { try { window.__frames.push(document.getElementById('game').toDataURL('image/png')); } catch (e) {} }, 40); }, LANG);
  let n = 0, rec = true; const t0 = Date.now();
  const flush = async () => { const arr = await page.evaluate(() => { const a = window.__frames; window.__frames = []; return a; });
    for (const d of arr) fs.writeFileSync(`${DIR}/f_${String(n++).padStart(5, '0')}.png`, Buffer.from(d.split(',')[1], 'base64')); };
  const pump = (async () => { while (rec) { await flush(); await page.waitForTimeout(250); } })();
  const st = () => page.evaluate(() => M.TA.status()), wait = ms => page.waitForTimeout(Math.max(30, Math.round(ms / SPEEDUP)));
  const tapAt = (x, y) => page.evaluate(([x, y]) => { M.pointerDown(x, y, true); M.pointerUp(x, y, true); }, [x, y]);
  // wartet in Lesegeschwindigkeit; Erinnerungen und Dokumente werden nach einer Lesepause weitergetippt
  async function until(pred, max = DRY ? 60000 : 240000) { const e = Date.now() + max; let ovT = 0, ovStep = -1;
    while (Date.now() < e) { const s = await st();
      if (s.overlay === 'memory' || s.overlay === 'doc') { const step = await page.evaluate(() => M.E.overlay ? (M.E.overlay.step || 0) : -1);
        if (step !== ovStep) { ovStep = step; ovT = Date.now(); }
        if (Date.now() - ovT > (s.overlay === 'doc' ? 5200 : 3400)) { await tapAt(160, 100); ovT = Date.now(); } await wait(100); continue; }
      ovT = 0; ovStep = -1;
      if (await pred(s)) return s; await wait(90); }
    const s2 = await st(); throw new Error('Zeit abgelaufen bei ' + pred.toString().slice(0, 60) + ' | ' + JSON.stringify({ room: s2.room, screen: s2.screen, busy: s2.busy, dlg: s2.dlg, overlay: s2.overlay, phase: s2.phase, walk: s2.walk, acting: s2.acting })); }
  const idle = s => !s.busy && !s.speech && !s.dlg && !s.overlay && !s.acting && !s.walk && s.screen === 'game';
  const log = (...a) => console.log('[' + ((Date.now() - t0) / 1000).toFixed(1) + 's]', ...a);
  const choose = async sub => { log('wählt', sub); await until(s => !!s.dlg); await wait(1900); await page.evaluate(x => M.TA.choose(x), sub); await wait(200); };
  const pick = async id => { log('Notiz', id); await until(s => s.overlay === 'notebook' || !!s.dlg); await wait(1800); await page.evaluate(x => M.TA.pickNote(x), id); await wait(200); };
  const act = async (v, id, it) => { log(v, id, it || ''); await until(idle); await wait(650); await page.evaluate(([v, i, it]) => M.TA.act(v, i, it), [v, id, it]); await wait(300); };
  const item = async (v, id) => { await until(idle); await wait(650); await page.evaluate(([v, i]) => M.TA.item(v, i), [v, id]); await wait(300); };
  const exit = async id => { log('Ausgang', id); await until(idle); await wait(500); await page.evaluate(x => M.TA.exit(x), id); await wait(400); };
  const travel = async loc => { log('Stadtplan', loc); await until(idle); await wait(1400); await page.evaluate(x => M.TA.travel(x), loc); await wait(500); };
  const sw = async w => { await until(idle); await wait(500); await page.evaluate(x => M.TA.switchTo(x), w); await wait(900); };
  const walkTo = async (x, y) => { await until(idle); await page.evaluate(([x, y]) => M.E.walkPlayerTo(x, y), [x, y]); await wait(300); };
  const talk = async (id, ...opts) => { await act('talk', id); for (const o of opts) await choose(o); };
  // Notizbuch wie ein Spieler: öffnen, erste Notiz antippen, zweite antippen, Schluss lesen, schließen
  const findHit = key => page.evaluate((key) => { for (let y = 0; y < 200; y += 2) for (let x = 40; x < 290; x += 4) if (M.uiHit(x, y) === key) return [x, y]; return null; }, key);
  const tapRow = async id => { for (let p = 0; p < 6; p++) { const r = await findHit('n:' + id); if (r) { await tapAt(r[0] + 20, r[1] + 4); return; }
      const nx = await findHit('nnext'); if (!nx) break; await tapAt(nx[0] + 4, nx[1] + 4); await wait(700); }
    throw new Error('Notiz nicht gefunden: ' + id); };
  const combine = async (a, b) => { await until(idle); await wait(600); log('Notizbuch', a, '+', b); await page.evaluate(() => { M.E.openNotes(); }); await wait(1600); await tapRow(a); await wait(1100); await tapRow(b); await wait(4500);
    await page.evaluate(() => M.TA.closeOverlay()); await wait(500); };
  const load = async (name) => { const g = JSON.parse(fs.readFileSync(`${DUMPS}/${name}.json`, 'utf8'));
    await page.evaluate((g) => { M.TEST = false; M.TURBO = window.__dry ? 8 : 1; M.E.setText(1, false); M.PRESETS = M.PRESETS || {}; M.PRESETS.v = { GS: g }; M.E.loadPreset('v', 3); }, g.GS); await wait(1500); };
  await page.evaluate(() => window.__mr.start(500));
  try {
    await load(process.env.MALA_DUMP || '14');                           // Wohnung, Abend: der Text über Ivka ist geschrieben
    await act('use', 'bed'); await choose('Licht machen');                // Nacht: Malas Stimme, der erste Fall beginnt
    await until(s => s.phase === 'c1' && idle(s));
    await act('look', 'window'); await act('use', 'window');              // die Straßenbahn auf der Scheibe
    // Mittwochabend in der Wohnung: das Kennenlernen (Tür, um sie herum, ein Glas Wasser, die Fragen)
    await exit('door'); await exit('door'); await act('look', '_mala');
    await act('take', 'glasses'); await act('use', 'sink', 'glass'); await act('use', '_mala', 'glassW');
    await choose('Wer bist du?'); await choose('Was kannst du'); await choose('Seit wann'); await choose('Genug für heute'); await choose('An der Riva');
    await exit('door'); await travel('riva');
    await walkTo(560, 116); await choose('Nicht hinsehen');               // Ivka auf der Mole
    await talk('ivka', 'Welches Boot', 'Welcher Tag', 'Das Boot ist spät', 'Ich gehe ein Stück');
    await exit('office_door');
    await talk('mladen', 'Frage zu einer Fähre', 'Für einen Text', 'Dann sieh nach', 'Danke. Laku');   // der erste gemeinsame Test
    await sw('mala'); await exit('archive_door'); await act('look', 'binder_1948'); await exit('door'); await sw('marko');
    await talk('mladen', 'Schauen Sie mal', 'Danke. Laku');               // das Fahrtenbuch
    await combine('c1_boat7', 'c1_ferry');                                // Notizbuch: das Boot um sieben + die Fähre fiel aus
    await exit('door'); await exit('exit'); await travel('matejuska');
    await act('use', 'dinko', 'photo1');
    await sw('mala'); await exit('shed_door'); await act('sense', 'seabag'); await exit('door'); await sw('marko');
    await talk('dinko', 'Ich weiß, was Tonći', 'Ivka wartet noch');       // Dinkos Geständnis
    await act('use', '_mala', 'letter_t'); await item('read', 'letter_t'); // der Brief klebt
    await exit('exit'); await travel('flat');
    await act('use', 'stove', 'letter_t');
    await act('take', 'dzezva'); await act('use', 'sink', 'dzezva'); await act('use', 'stove', 'dzezvaW'); await act('use', 'stove', 'letter_t');   // über Dampf geöffnet
    await act('use', '_mala', 'letter_t');                                // Mala liest den Brief
    await exit('door'); await travel('sustipan'); await act('look', 'plaque');
    await exit('exit'); await travel('riva'); await walkTo(560, 116);
    await sw('mala'); await act('sense', 'bollard'); await act('talk', 'ivka'); await sw('marko');
    await act('use', 'ivka', 'letter_t'); await pick('c1_ferry'); await pick('c1_came');   // die Wahrheit, Schritt für Schritt
    await choose('Brief vorlesen'); await choose('Handschuhe'); await choose('nicht mehr hier');
    await until(s => s.active === 'mala' && idle(s)); await act('cross', 'ivka'); await choose('Ihre Hand nehmen');
    await until(s => s.room === 'limbo' && idle(s));
    await talk('ghost', 'Was sehen Sie im Licht', '(Schweigen.)'); await act('use', 'ghost', 'gloves');
    await until(async s => (await page.evaluate(() => !!M.GS.flags['c1.done'])) && idle(s));
    await exit('arch'); await until(s => s.room === 'riva'); await wait(9000);   // zurück an der Riva: „Ich muss mich setzen.“ Ende
  } catch (e) { console.log('FEHLER', e.message); process.exitCode = 1; }
  await page.evaluate(() => clearInterval(window.__grab)); rec = false; await pump; await flush(); const dur = (Date.now() - t0) / 1000;
  const b64 = await page.evaluate(() => new Promise(res => { if (window.__mr.state === 'inactive') { res(''); return; } setTimeout(() => res(''), 20000); window.__mr.onstop = async () => { const b = new Blob(window.__chunks, { type: 'audio/webm' }); const buf = await b.arrayBuffer(); let s = ''; const u = new Uint8Array(buf);
    for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); res(btoa(s)); }; window.__mr.stop(); }));
  fs.writeFileSync(`${DIR}/audio.webm`, Buffer.from(b64, 'base64'));
  console.log('Bilder', n, 'Dauer', dur.toFixed(1), 's, fps', (n / dur).toFixed(3)); fs.writeFileSync(`${DIR}/fps.txt`, String(n / dur));
  if (DRY) { const mm = await page.evaluate(() => ({ miss: M.trMiss, over: M.trOverflow }));
    console.log('noch deutsch:', Object.keys(mm.miss).length, JSON.stringify(mm.miss).slice(0, 1500)); console.log('zu breit:', Object.keys(mm.over).length, JSON.stringify(mm.over).slice(0, 800)); }
  console.log(errors.slice(0, 5).join('\n') || 'keine JS-Fehler'); await browser.close();
})();
