// Video ohne Ton: Kapitel 1 vom Titelbild bis zum Ende des ersten Gesprächs mit Mala in Markos Wohnung (Mittwochabend).
// Echtzeit, normale Lesegeschwindigkeit; Dokumente und Erinnerungen werden nach einer Lesepause weitergetippt.
//   node game/build.js
//   node game/tools/video_einstieg.js <bilder-ordner>          (MALA_LANG=bhs für Bosnisch/Kroatisch; DRY=1: achtfach schneller, ohne Bilder)
//   cd <bilder-ordner> && ffmpeg -framerate $(cat fps.txt) -i f_%05d.png -vf "scale=1280:800:flags=neighbor,format=yuv420p" \
//        -r 25 -c:v libx264 -preset medium -crf 21 -tune animation -an -movflags +faststart ../video.mp4
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const DIR = process.argv[2], DRY = !!process.env.DRY, SPEEDUP = DRY ? 8 : 1, LANG = process.env.MALA_LANG || 'de';
const HTML = process.env.MALA_HTML || path.join(__dirname, '..', '..', 'web', 'index.html');
if (!DIR) { console.log('Aufruf: video_einstieg.js <bilder-ordner>'); process.exit(2); }
fs.mkdirSync(DIR, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(HTML)); await page.waitForTimeout(600); if (DRY) await page.evaluate(() => { window.__dry = true; });
  await page.evaluate((lang) => { try { localStorage.clear(); } catch (e) {} M.setLang(lang); M.trLogUI = !!window.__dry; M.E.setNbStyle('list'); M.E.setText(1, false); M.TEST = false; M.TURBO = window.__dry ? 8 : 1;
    window.__frames = []; if (!window.__dry) window.__grab = setInterval(() => { try { window.__frames.push(document.getElementById('game').toDataURL('image/png')); } catch (e) {} }, 40); }, LANG);
  let n = 0, rec = true; const t0 = Date.now();
  const flush = async () => { const arr = await page.evaluate(() => { const a = window.__frames; window.__frames = []; return a; });
    for (const d of arr) fs.writeFileSync(`${DIR}/f_${String(n++).padStart(5, '0')}.png`, Buffer.from(d.split(',')[1], 'base64')); };
  const pump = (async () => { while (rec) { await flush(); await page.waitForTimeout(250); } })();
  const st = () => page.evaluate(() => M.TA.status()), wait = ms => page.waitForTimeout(Math.max(30, Math.round(ms / SPEEDUP)));
  const tapAt = (x, y) => page.evaluate(([x, y]) => { M.pointerDown(x, y, true); M.pointerUp(x, y, true); }, [x, y]);
  async function until(pred, max = DRY ? 60000 : 240000) { const e = Date.now() + max; let ovT = 0, ovStep = -1;
    while (Date.now() < e) { const s = await st();
      if (s.card) { await wait(100); continue; }
      if (s.overlay === 'memory' || s.overlay === 'doc') { const step = await page.evaluate(() => M.E.overlay ? (M.E.overlay.step || 0) : -1);
        if (step !== ovStep) { ovStep = step; ovT = Date.now(); }
        if (Date.now() - ovT > (s.overlay === 'doc' ? 5600 : 3600)) { await tapAt(160, 100); ovT = Date.now(); } await wait(100); continue; }
      ovT = 0; ovStep = -1;
      if (await pred(s)) return s; await wait(90); }
    const s2 = await st(); throw new Error('Zeit abgelaufen bei ' + pred.toString().slice(0, 60) + ' | ' + JSON.stringify({ room: s2.room, screen: s2.screen, busy: s2.busy, dlg: s2.dlg, overlay: s2.overlay, phase: s2.phase })); }
  const idle = s => !s.busy && !s.speech && !s.dlg && !s.overlay && !s.acting && !s.walk && s.screen === 'game';
  const log = (...a) => console.log('[' + ((Date.now() - t0) / 1000).toFixed(1) + 's]', ...a);
  const choose = async sub => { log('wählt', sub); await until(s => !!s.dlg); await wait(2000); await page.evaluate(x => M.TA.choose(x), sub); await wait(200); };
  const act = async (v, id, it) => { log(v, id, it || ''); await until(idle); await wait(700); await page.evaluate(([v, i, it]) => M.TA.act(v, i, it), [v, id, it]); await wait(300); };
  const exit = async id => { log('Ausgang', id); await until(idle); await wait(600); await page.evaluate(x => M.TA.exit(x), id); await wait(400); };
  const travel = async loc => { log('Stadtplan', loc); await until(s => idle(s) && s.room === 'map'); await wait(1800); await page.evaluate(x => M.TA.travel(x), loc); await wait(500); };
  const walkTo = async (x, y) => { await until(idle); await page.evaluate(([x, y]) => M.E.walkPlayerTo(x, y), [x, y]); await wait(300); };
  const talk = async (id, ...opts) => { await act('talk', id); for (const o of opts) await choose(o); };
  // Notizbuch wie ein Spieler: öffnen, erste Notiz antippen, zweite antippen, Schluss lesen, schließen
  const findHit = key => page.evaluate((key) => { for (let y = 0; y < 200; y += 2) for (let x = 40; x < 290; x += 4) if (M.uiHit(x, y) === key) return [x, y]; return null; }, key);
  const tapRow = async id => { for (let p = 0; p < 6; p++) { const r = await findHit('n:' + id); if (r) { await tapAt(r[0] + 20, r[1] + 4); return; }
      const nx = await findHit('nnext'); if (!nx) break; await tapAt(nx[0] + 4, nx[1] + 4); await wait(700); }
    throw new Error('Notiz nicht gefunden: ' + id); };
  const combine = async (a, b) => { await until(idle); await wait(700); log('Notizbuch', a, '+', b); await page.evaluate(() => { M.E.openNotes(); }); await wait(1800); await tapRow(a); await wait(1300); await tapRow(b); await wait(5000);
    await page.evaluate(() => M.TA.closeOverlay()); await wait(600); };
  try {
    // ---------------------------------------------------------------- Titelbild, dann ein neues Spiel
    await page.evaluate(() => { M.E.screen = 'title'; M.E.titleMode = 'main'; }); await wait(4000);
    await page.evaluate(() => { M.E.setSlot(1); M.E.newGame(); }); log('neues Spiel');
    // ---------------------------------------------------------------- Dienstag, Wohnung
    await act('use', 'answer');                                                     // Vesna und Sanja auf dem Anrufbeantworter
    await act('use', 'laptop'); await choose('Der letzte Satz'); await choose('Seite 30'); await choose('fertig übersetzen'); await choose('rote Druckleuchte');   // Seite 31
    await act('look', 'photo'); await act('look', 'box');
    await act('take', 'dzezva'); await act('use', 'sink', 'dzezva'); await act('use', 'stove', 'dzezvaW');   // Kaffee
    await exit('door'); await travel('bar');
    // ---------------------------------------------------------------- Bar „Bura“: Sanjas Brief nach Triest
    await act('talk', 'sanja'); await act('use', 'marko_table'); await choose('Wörtlich'); await choose('Fest'); await choose('Ich bin Übersetzer');
    await exit('door'); await travel('varos');
    // ---------------------------------------------------------------- Veli Varoš, Ivkas Wohnung
    await talk('zdenka', 'Wie war sie?', 'Hatte sie wirklich', 'Was hat sie den Tag', 'Kann ich mir die Wohnung', 'Ein paar Zeilen', 'Danke, Gospođa Zdenka');
    await act('open', 'ivka_door');
    await act('look', 'chair'); await act('open', 'shoebox'); await act('take', 'basket'); await act('use', 'shoebox', 'needle'); await act('open', 'shoebox');
    await act('take', 'photo_boat'); await act('look', 'stove'); await act('read', 'basket');
    await exit('door');
    await combine('pro_noone', 'pro_list');                                         // „Keine Familie heißt nicht: niemand.“
    await talk('zdenka', 'In ihrem Heft stehen Namen', 'Hier ist Ihr Schlüssel');    // danach: die Kirchentreppe
    await until(s => idle(s) && s.phase === 'pro_eve'); await wait(1500);
    // ---------------------------------------------------------------- Riva am Dienstagabend: der Poller
    await exit('exit'); await travel('riva'); await walkTo(600, 116);
    await until(async s => idle(s) && (await page.evaluate(() => !!M.GS.flags['split.intro.dizzy'])));
    await exit('exit'); await travel('flat');
    // ---------------------------------------------------------------- Nachruf, Nacht
    await act('use', 'laptop'); await choose('Jeden Abend um sieben'); await choose('Familie hatte sie keine mehr');
    await act('use', 'bed'); await choose('Licht machen');
    await until(s => s.phase === 'c1' && idle(s)); await wait(1200);
    // ---------------------------------------------------------------- Mittwochabend: das Kennenlernen
    await act('look', 'window'); await act('look', 'photo');
    await exit('door'); await exit('door'); await act('look', '_mala');
    await act('take', 'glasses'); await act('use', 'sink', 'glass'); await act('use', '_mala', 'glassW');
    await choose('Wer bist du?'); await choose('Kann dich außer mir'); await choose('Was kannst du'); await choose('Seit wann'); await choose('Warum fühle ich mich'); await choose('Genug für heute');
    await choose('In der Bar'); await choose('An der Riva');
    await until(async s => idle(s) && (await page.evaluate(() => !!M.GS.flags['split.intro.met']))); await wait(4500);   // Ende: „Weit weg von dir kann ich nicht.“
  } catch (e) { console.log('FEHLER', e.message); process.exitCode = 1; }
  await page.evaluate(() => clearInterval(window.__grab)); rec = false; await pump; await flush(); const dur = (Date.now() - t0) / 1000;
  console.log('Bilder', n, 'Dauer', dur.toFixed(1), 's, fps', (n / dur).toFixed(3)); fs.writeFileSync(`${DIR}/fps.txt`, String(n / dur));
  if (DRY) { const mm = await page.evaluate(() => ({ miss: M.trMiss, over: M.trOverflow })); console.log('ohne Übersetzung:', Object.keys(mm.miss).length, 'zu breit:', Object.keys(mm.over).length); }
  console.log(errors.slice(0, 5).join('\n') || 'keine JS-Fehler'); await browser.close();
})();
