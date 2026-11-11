// BUG-031 (Wunsch des Autors nach der zweiten Prüfung): Die Aufführung der Australier ist eine animierte Szene, kein Erzähltext.
// (1) Mit Text: Kamera fest auf dem Brückenkopf, Koffer offen, zwei Passanten, Noten; die sechs Zeilen im Original als gesungene Zeilen
//     (mit Übersetzung) in der Reihenfolge des Lieds; Lenas Wiedererkennen genau zwischen der Fensterzeile und dem Rest; Münzen im Koffer;
//     danach aufgeräumt (keine Passanten, Kamera frei, niemand eingefroren, Musik zurück), Notizen und Schalter wie vorher, Koffer bleibt liegen.
// (2) Ohne Text: Abbruch am Fenster, Summen, „That’s all we’ve got.“, die Familie, keine Zeile danach. (3) Text nachgereicht, noch einmal:
//     kein zweites Wiedererkennen, das Ende wird gesungen. (4) Laden mitten in der Szene: Kamera wieder frei. (5) Samstagnacht in der Herberge:
//     zwei gesungene Zeilen, dann Mala.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-031', title: 'K3: animierte Aufführung an der Brücke (mit/ohne Text, Wiederholung, Laden), Lied in der Herberge', async run(html) {
  const D = await open({ seed: 31, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const settle = async () => { await D.page.waitForTimeout(300); await P.calm(); };
  const sat = { 'k3.rules': 2, 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.s.photoTrip': true, 'k3.s.spot': true, 'k3.s.initials': true, 'k3.s.photo': true, 'k3.x.vaga': true, 'k3.s.dinoOk': true };
  const notes = ['b3_photo65', 'b3_initials', 'b3_lenaphoto'];
  const log = () => D.ev(() => (M.__speechLog || []).map(l => l[1]));
  // Szene starten und währenddessen beobachten, bis das Menü wieder offen ist
  const watch = async () => { const seen = { cam: false, caseOn: false, tours: false, notes: false, song: 0, gloss: 0, frozen: false };
    for (let i = 0; i < 1500; i++) { const s = await D.ev(() => { const R = M.ROOMS.starimost, PF = M.K3PERF, sp = M.E.speech;
        return { cam: R.camLock, caseOn: PF.caseOn, tours: !!(M.E.ACT.k3tour1 && M.E.ACT.k3tour2), notes: !!PF.src.liam, song: !!(sp && sp.opt && sp.opt.song), gloss: !!(sp && sp.opt && sp.opt.gloss), dlg: !!M.E.dlg, busy: M.E.busy }; });
      if (s.cam === 150) seen.cam = true; if (s.caseOn) seen.caseOn = true; if (s.tours) seen.tours = true; if (s.notes) seen.notes = true; if (s.song) seen.song++; if (s.gloss) seen.gloss++;
      if (s.dlg && i > 5) break; await D.page.waitForTimeout(80); }
    return seen; };
  const SONG = await D.ev(() => M.K3X.SONG.map(s => s.o));
  // (1) mit Text
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.words': true }, sat), addNotes: notes.concat(['s3_words']), pos: 'starimost' }); await settle();
  await D.ev(() => { M.__speechLog = []; }); await P.act('talk', 'aussie3_b'); await D.ev(() => { M.TA.choose('Play it'); });
  let w = await watch();
  ck(w.cam && w.caseOn && w.tours && w.notes, 'während der Szene: Kamera am Brückenkopf, Koffer offen, zwei Passanten, Noten ' + JSON.stringify(w));
  ck(w.song > 0 && w.gloss > 0, 'gesungene Zeilen mit Übersetzung');
  let L = await log(); const idx = SONG.map(t => L.indexOf(t));
  ck(idx.every(i => i >= 0) && idx.every((v, k) => k === 0 || v > idx[k - 1]), 'alle sechs Zeilen im Original, in der Reihenfolge des Lieds');
  const kenn = L.indexOf('Das kenn ich.'); ck(kenn > idx[3] && kenn < idx[4], 'Lena erkennt das Summen genau zwischen der Fensterzeile und dem Rest');
  ck(await D.ev(() => M.K3PERF.caseCoins) >= 4, 'Münzen im Koffer (' + (await D.ev(() => M.K3PERF.caseCoins)) + ')');
  if ((await D.st()).dlg) await P.bye('See you'); await D.page.waitForTimeout(1600);
  const after = await D.ev(() => ({ tours: !!(M.E.ACT.k3tour1 || M.E.ACT.k3tour2), cam: M.ROOMS.starimost.camLock, frozen: !!(M.E.ACT.aussie1 && M.E.ACT.aussie1.frozen), song: M.currentSong(), src: Object.keys(M.K3PERF.src).length, caseShown: M.k3CaseShown(M.GS) }));
  ck(!after.tours && after.cam === undefined && !after.frozen && after.src === 0 && after.song === 'k3_mostar', 'danach aufgeräumt ' + JSON.stringify(after));
  ck(after.caseShown, 'der offene Koffer bleibt liegen, solange sie spielen');
  ck(await D.hasNote('b3_hum') && await D.hasNote('s3_verse') && await D.flag('k3.s.lenaVerse') && await D.flag('k3.s.perf'), 'Notizen und Schalter wie vorher (b3_hum, s3_verse)');
  // (2) ohne Text
  await FX.load(D, 'k3x_samstag.json', { setFlags: sat, addNotes: notes, pos: 'starimost' }); await settle();
  await D.ev(() => { M.__speechLog = []; }); await P.act('talk', 'aussie3_b'); await D.ev(() => { M.TA.choose('Play it'); }); w = await watch(); L = await log();
  ck(L.indexOf(SONG[2]) >= 0 && L.some(t => /^samo moja mila draga… na… na…/.test(t)) && L.some(t => /^Hm-hm/.test(t)) && L.indexOf('That’s all we’ve got.') >= 0, 'ohne Text: bis zum Fenster, Summen, Abbruch');
  ck(L.indexOf('Das kenn ich.') > L.indexOf('That’s all we’ve got.') && L.indexOf('Da hört er auch auf? Der mit der Gitarre?') > L.indexOf('Das kenn ich.'), 'danach die Familie: „Da hört er auch auf?“');
  ck(L.indexOf(SONG[4]) < 0 && L.indexOf(SONG[5]) < 0 && !(await D.flag('k3.s.lenaVerse')) && await D.flag('k3.s.perf') && await D.hasNote('b3_hum'), 'kein Rest des Lieds, b3_hum gesetzt, Lenas Strophe nicht');
  // (3) Text nachgereicht, noch einmal: kein zweites Wiedererkennen, das Ende wird gesungen
  if ((await D.st()).dlg) { await P.choose('Do you want the words'); await P.arrange(); await P.calm(); }
  await D.ev(() => { M.__speechLog = []; }); if (!(await D.st()).dlg) await P.act('talk', 'aussie3_b'); await D.ev(() => { M.TA.choose('Play it'); }); w = await watch(); L = await log();
  ck(L.indexOf('Das kenn ich.') < 0 && L.indexOf(SONG[4]) >= 0 && L.indexOf(SONG[5]) >= 0 && await D.flag('k3.s.lenaVerse'), 'Wiederholung: kein zweites „Das kenn ich.“, das Ende wird gesungen, Lenas Strophe');
  if ((await D.st()).dlg) await P.bye('See you');
  // (4) Laden mitten in der Szene
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.words': true }, sat), addNotes: notes.concat(['s3_words']), pos: 'starimost' }); await settle();
  await P.act('talk', 'aussie3_b'); await D.ev(() => { M.TA.choose('Play it'); }); for (let i = 0; i < 200; i++) { if (await D.ev(() => M.ROOMS.starimost.camLock === 150)) break; await D.page.waitForTimeout(50); }
  await FX.load(D, 'k3x_samstag.json', { setFlags: sat, addNotes: notes, pos: 'starimost' }); await settle();
  const ld = await D.ev(() => ({ cam: M.ROOMS.starimost.camLock, room: M.K3PERF.room, tours: !!(M.E.ACT.k3tour1 || M.E.ACT.k3tour2) }));
  ck(ld.cam === undefined && ld.room === null && !ld.tours, 'Laden mitten in der Szene: Kamera frei, keine Passanten ' + JSON.stringify(ld));
  // (5) Samstagnacht in der Herberge
  await FX.load(D, 'k3x_samstag_nacht.json', { setFlags: { 'k3.s.words': true }, pos: 'starimost' }); await settle(); await D.ev(() => { M.__speechLog = []; });
  await P.exit('exit'); await P.travel('herberge'); await P.calm(); L = await log();
  ck(L.indexOf(SONG[0]) >= 0 && L.indexOf(SONG[5]) > L.indexOf(SONG[0]) && L.indexOf('Nein. Schön richtig.') > L.indexOf(SONG[5]), 'Herberge, Samstagnacht: zwei gesungene Zeilen, dann Mala');
  const jsErr = (D.events || []).filter(e => e[0] === 'error').length; ck(jsErr === 0, 'keine JS-Fehler (' + jsErr + ')');
  return { ok, detail: out.join('; ') };
} };
