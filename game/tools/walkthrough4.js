// Automatischer Komplett-Durchlauf von Kapitel 4 (München): von „Neues Spiel Kapitel 4“ (M.E.newGame(4)) bis zum Abspann, nur mit Spielerhandlungen.
// Reisen über den Stadtplan (M.TA.travel), Gespräche mit den sichtbaren Auswahltexten, Ansehen/Benutzen/Geben, Notizen verbinden (M.TA.combine),
// Wechsel zu Mala (M.TA.switchTo), Dokumente und Erinnerungsbilder schließen. Kein gesetzter Schalter, keine gesetzte Notiz.
// Ohne Stand aus Kapitel 3 (localStorage leer): Vorgaben des Gerüsts (Zustimmung b, Probe ja).
//   node game/tools/walkthrough4.js [screenshot-ordner]
//   MALA_HTML=<build>/index.html   anderer Bau
//   MALA_DUMPALL=<ordner>          Spielstand nach jedem Schritt (für hintcheck.js und k4tests.js)
//   MALA_HINTLOG=<datei>           offene Hinweisthemen nach jeder Aktion (über den Treiber)
//   MALA_TRACE=1                   jede gewählte Gesprächszeile mit ausgeben (Grundlage für LOESUNG4.md)
//   MALA_SNAP=<ordner>             Stand zu Beginn jedes Abschnitts; MALA_FROM=<abschnitt> spielt ab dort weiter (nur Fehlersuche)
const { open } = require('./driver');
const { play } = require('./k4play');
const fs = require('fs'), path = require('path');
const SHOTS = process.argv[2] || null;
const DUMP = process.env.MALA_DUMPALL || null, SNAP = process.env.MALA_SNAP || null, FROM = process.env.MALA_FROM || null, TRACE = !!process.env.MALA_TRACE;
(async () => {
  const D = await open({ turbo: 25 });
  const t0 = Date.now(); let step = 0, section = '';
  const log = async (...a) => { step++; console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] #${step} ${section ? section + ': ' : ''}${a.join(' ')}`);
    if (TRACE && P.trace.length) { console.log(P.trace.join('\n')); } P.trace.length = 0;
    if (DUMP) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); fs.writeFileSync(path.join(DUMP, String(step).padStart(3, '0') + '.json'), JSON.stringify({ step, section, label: a.join(' '), GS: g })); } };
  // Spielerhandlungen (gemeinsam mit k4tests.js)
  const P = play(D, { onStep: (t) => log(t) });
  const { st, fail, expect, note, flag, inv, room, at, inPhase, said, expectSaid, calm, act, exit, choose, pick, dlgHas, waitDlg, talk, ask, bye, comb, mala, marko, travel, go, drive, F, N, flagIs, noteIs, phaseIs, noDlg } = P;
  const shot = async (n) => { if (SHOTS) await D.shot(`${SHOTS}/w4_${String(step).padStart(3, '0')}_${n}.png`); };
  const snapSave = async (name) => { if (!SNAP) return; fs.mkdirSync(SNAP, { recursive: true }); const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); fs.writeFileSync(path.join(SNAP, name + '.json'), JSON.stringify({ step, GS: g })); };
  const snapLoad = async (name) => { const d = JSON.parse(fs.readFileSync(path.join(SNAP, name + '.json'), 'utf8')); step = d.step;
    await D.ev((g) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__wt = { GS: g }; M.E.loadPreset('__wt', 1); }, d.GS); await D.page.waitForTimeout(400); await calm(); };
  // ein Tageswechsel kommt von selbst: warten, bis die neue Phase steht und das Spiel wieder auf den Spieler wartet
  const untilPhase = async (p, what, ms = 120000) => { await D.until(s => s.phase === p, ms, what || p); return calm(); };
  const mapHas = (id) => D.ev((x) => !!M.GS.map[x], id);

  // ======================================================================= Abschnitte
  const SECTIONS = [];
  const part = (name, fn) => SECTIONS.push([name, fn]);

  // ----------------------------------------------------------------------- Prolog: Ankunft am ZOB, Hansi, Mamas Wohnung, Mama
  part('prolog', async () => {
    await D.ev(() => { M.__gt0 = M.E.gt(); M.__speechLog = []; try { localStorage.removeItem('mala.c3end'); localStorage.removeItem('mala.c2end'); } catch (e) {} M.E.setSlot(1); M.E.newGame(4); });
    await calm(); await waitDlg('(Antworten', 90000); await at('zob'); await inPhase('k4_pro'); await note('u4_sms'); await note('k4_c_lana'); await shot('ankunft');
    await log('Kapitelstart: Karte „München“, Bild „Im Bus nach München“, Ankunft am ZOB, Anas SMS');
    await choose('(Antworten: „Bin da.“)'); await calm(); await flag('k4.p.arriveDone'); await log('Ana geantwortet: „Bin da.“; Markos Kopf pocht');
    await mala(); await act('look', 'pillar'); await flag('k4.h.found'); await marko(); await log('Mala findet Hansi am Pfeiler: „Kirchmaier. Hansi.“');
    await act('talk', 'hansi'); await drive(['Worauf warten', 'Feierabend, Herr', 'Ihre Schicht', 'Wer darf', 'Servus'], async s => !s.dlg && await F('k4.h.local'), { label: 'Hansi' });
    await log('Hansi wartet auf seine Ablösung; Marko klingt „wia d’ Zeitung“; „Der Wastl, der wo do drüben lehnt“');
    await act('talk', 'wastl'); await drive(['Kannten Sie', 'Würden Sie etwas', 'Er hat gesagt'], async s => !s.dlg && await F('k4.p.hansi'), { label: 'Wastl' });
    await flag('k4.p.hansi'); await log('Wastl löst Hansi ab: „Feierabend, Hansi.“');
    await exit('to_bridge'); await at('hacker'); await log('auf der Hackerbrücke');
    await exit('exit'); await go('westend', 'jhaus'); await log('Westend, Mamas Haus');
    await act('talk', 'huber'); await drive(['Ana schreibt', 'Wie heißt Ihre Katze', 'Arbeitet meine', 'Auf Wiedersehen'], async s => !s.dlg && await F('k4.p.key'), { label: 'Huber' });
    await flag('k4.p.key'); await log('Frau Huber gibt den Schlüssel; Mucki');
    await exit('up'); await at('jwohnung'); await act('look', 'slippers'); await note('u4_pantoffeln'); await act('look', 'photo'); await act('read', 'folder'); await note('u4_dach'); await log('Mamas Wohnung: Pantoffeln Größe 44, das Foto, die Mappe „Vratnik – krov“');
    await drive(['Ich war nie fertig'], async s => !s.dlg && await F('k4.p.knock'), { label: 'Klopfen' }); await log('11:10, Malas Klopfen');
    await exit('bedroom'); await at('jschlaf'); await act('look', 'box'); await note('u4_kiste'); await exit('door'); await at('jwohnung'); await log('im Schlafzimmer die verschlossene Kiste');
    await act('use', 'stove'); await flag('k4.p.coffee'); await log('Kaffee in Großmutters Džezva');
    await drive(['Nadas Dose', 'Ich muss dir etwas erzählen', 'Mala fragen', 'Ich habe Lana gefunden', 'Wegen der Probe', 'Ein Hemd'], async s => s.phase === 'k4_pro_n', { label: 'Jasna' });
    await flag('k4.p.vanilice'); await flag('k4.p.lana'); await note('u4_klopfen'); await note('u4_nichtheute'); await log('Mama kommt heim: Nadas Dose, Lana, „Nicht heute. Heute ist Heiligabend.“');
  });
  // ----------------------------------------------------------------------- Heiligabend bei Ana, Schlüsseldialog 1
  part('heiligabend', async () => {
    await drive(['Hvala'], async s => s.room === 'ana' && !s.dlg && await F('k4.p.eveIntro'), { label: 'Ankunft bei Ana' }); await at('ana'); await shot('ana'); await log('Karte „Heiligabend“, bei Ana in Giesing; Niko sieht Mala');
    await act('talk', 'tobias'); await drive(['Wie geht es mit dem Bosnisch', 'Bis später'], noDlg, { label: 'Tobias' }); await log('Tobias lernt Bosnisch aus dem Buch');
    await act('use', 'table');
    await drive(['Na zdravlje', 'In München sind', 'Seine Größe', 'Nur müde', 'Auf den Bus', 'Sie will keinen', 'Was siehst du', 'Wer ist da', 'Du bist es nicht'], async s => s.phase === 'k4_d1' && !s.dlg && !s.busy && await F('k4.wake.k4_d1'), { label: 'Essen und Dialog 1', max: 200 });
    await flag('k4.p.eve'); await flag('k4.p.talk1'); await note('r4_kopf'); await at('jwohnung'); await log('das Essen; Schlüsseldialog 1 „Nur müde“; Karte „Erster Tag · Christtag“');
  });
  // ----------------------------------------------------------------------- Christtag: Brot, Spaziergang, Sepp, Gerda
  part('christtag', async () => {
    await act('take', 'table'); await inv('brot'); await flag('k4.d1.bread'); await expect(await mapHas('heim'), 'Heim auf dem Plan'); await log('Mamas vergessene Brotdose');
    await exit('door'); await exit('exit'); await go('wiesn'); await log('Theresienwiese');
    await act('talk', 'ana'); await drive(['Zeigst du mir', 'Lana hat dir eine Straßenbahn', 'Ich weiß es eben', 'Ich muss dir etwas sagen', 'Mala fragen', 'Lana ist tot', 'Schweigen', 'Ich gehe noch'], async s => !s.dlg && await F('k4.d1.walk'), { label: 'Spaziergang' });
    await note('z4_stiefel'); await log('Spaziergang mit Ana: die gelben Stiefel; Lana ist tot');
    await mala(); await travel('hbf'); await at('gleis11'); await flag('k4.s.found'); await log('Mala fährt allein zum Hauptbahnhof und findet den Gepäckträger an Gleis 11: „Siebzehn. Wie ich, als ich aufgehört habe.“');
    await marko(); await travel('hbf'); await at('gleis11'); await flag('k4.s.told'); await log('Marko kommt nach; Mala zeigt ihm den Gepäckträger');
    await act('talk', 'sepp'); await note('s4_peppino'); await drive(['Wie heißen Sie weiter', 'Arrivederci'], noDlg, { label: 'Peppino' }); await note('s4_genommen'); await log('„Mi chiamo Peppino.“ – „Me l’hanno preso qui. Al binario undici.“');
    await act('talk', 'kioskg'); await drive(['Kannten Sie einen alten Gepäckträger', 'Kennen Sie einen Peppino', 'Was war früher unter dem Gleis', 'Wiederschauen'], noDlg, { label: 'Kioskfrau' });
    await note('s4_bairisch'); await flag('k4.s.bunkerKnown'); await expect(await mapHas('bhfviertel'), 'Bahnhofsviertel auf dem Plan'); await log('die Kioskfrau: „A Urmünchner“; unter dem Gleis war ein Bunker; Peppino? Fragen Sie in der Bar Sport');
    await exit('mission'); await at('bmission'); await act('talk', 'wimmer'); await drive(['Kannten Sie einen alten Gepäckträger', 'Ich bin Übersetzer', 'Woher kam er', 'Danke, Frau Wimmer'], noDlg, { label: 'Frau Wimmer' });
    await note('s4_fluch'); await flag('k4.s.wimmer'); await expect(await mapHas('friedhof'), 'Städtische Friedhöfe auf dem Plan'); await log('Frau Wimmer: „Der Sepp hat italienisch g’flucht“; die Stadt bestattet ihn von Amts wegen');
    await comb('s4_bairisch', 's4_fluch', 's4_tarnung'); await log('Schluss: Er konnte beides');
    await exit('door'); await go('bhfviertel', 'barsport'); await act('talk', 'enzo'); await drive(['Kennen Sie einen Peppino', 'Er ist tot.', 'Arrivederci'], noDlg, { label: 'Enzo' });
    await note('s4_enzo'); await log('Bar Sport: Enzo, „Per noi era Peppino“');
    await go('heim'); await exit('elevator'); await at('heim_flur'); await act('give', 'jasna', 'brot'); await flag('k4.g.bread'); await log('Haus am Bavariapark: Mama bekommt ihr Brot');
    await mala(); await act('look', 'bench'); await note('g4_gerda'); await log('Mala findet Gerda auf der Bank am Aufzug: „Das macht er immer, der Alois. Bis ich da bin.“');
  });
  // ----------------------------------------------------------------------- Christtag-Abend: Džezva, Malas Kiste
  part('christtag_abend', async () => {
    await drive(['Du hast heute dein Brot', 'Erzähl mir von Baka', 'Was hat Baka', 'Mama …'], async s => s.phase === 'k4_d1_n' && s.active === 'mala' && !s.busy && !s.dlg, { label: 'Džezva-Abend' });
    await note('z4_lesart'); await flag('k4.d1.dzezva'); await log('Karte „Christtag · Abend“; Mama und die Džezva: „Ich kann lesen.“ Mala ist wach');
    await exit('bedroom'); await at('jschlaf'); await act('look', 'box'); await drive(['(Lesen.)'], async s => !s.dlg && await F('k4.d1.box'), { label: 'Kiste' });
    await note('z4_nachricht'); await note('z4_antrag'); await note('z4_passierschein'); await log('Mala liest die Kiste: Rotkreuz-Nachricht 1993, Suchantrag 1994, Passierschein 1992 (bleibt ihr Geheimnis)');
    await marko(); await act('use', 'sofa'); await untilPhase('k4_d2', 'Dienstag'); await log('Schlaf; Karte „Zweiter Feiertag“, Karte „Zweiter Tag · Der Anruf“');
  });

  // ----------------------------------------------------------------------- Dienstag: Kolars Anruf, Ana 2004, Josef Rugiero, drei Uhr
  part('dienstag', async () => {
    await drive(['Ana hat eine Probe', 'Das ist er', 'Meine Großmutter'], async s => s.phase === 'k4_d2' && !s.dlg && !s.busy && await F('k4.d2.kolar'), { label: 'Kolars Anruf' });
    await note('z4_kolar'); await note('z4_kode'); await note('z4_ana2004'); await log('Frau Kolar ruft an: die Brauerei, April 1993, der Rechenschieber „Z. V.“; Anas Probe von 2004; „nije se vratio“ in den Akten');
    await mala(); await comb('z4_nachricht', 'z4_kode', 'z4_tot'); await marko(); await log('Mala zieht ihren eigenen Schluss: In Sarajevo hieß es tot (bleibt ihr Geheimnis)');
    await exit('door'); await exit('exit'); await go('giesing', 'ana');
    await act('talk', 'ana'); await drive(['Ana. Zweitausendvier', 'Warum nicht', 'Gut. Nach Neujahr', 'Ich gehe'], async s => !s.dlg && await F('k4.d2.wait'), { label: 'Ana 2004' });
    await flag('k4.d2.ana'); await log('Ana gibt zu: 2004 hat sie in München eine Probe gegeben; die Geschwister warten bis nach Neujahr');
    await go('friedhof', 'friedamt'); await act('talk', 'obermaier'); await drive(['Es geht um den Gepäckträger', 'Was passiert jetzt mit ihm', 'Auf Wiedersehen'], noDlg, { label: 'Obermaier' });
    await note('s4_ausweis'); await note('s4_termin'); await log('Herr Obermaier: Gepäckträgerausweis „Josef Rugiero, Nr. 17“; Bestattung von Amts wegen am Donnerstag');
    await comb('s4_peppino', 's4_ausweis', 's4_derselbe'); await log('Schluss: Peppino ist der Sepp (?)');
    await go('hbf', 'gleis11'); await mala(); await exit('hatch'); await at('bunker'); await act('sense', 'desk'); await note('s4_bunker'); await log('Mala durch die Luke in den Bunker: der Nachhall von 1962, „Giuseppe? Das schreibt keiner. Josef.“');
    await exit('up'); await at('gleis11'); await flag('k4.s.bunkerTold'); await marko(); await log('Mala erzählt Marko vom Bunker');
    await comb('s4_derselbe', 's4_bunker', 's4_name'); await log('Schluss: Josef Rugiero ist Giuseppe Ruggiero');
    await act('talk', 'kioskg'); await drive(['Darf ich einen von den Zetteln', 'Wiederschauen'], noDlg, { label: 'Aushang' }); await inv('aushang'); await log('ein Aushang vom Kiosk: „Wer kannte diesen Mann?“');
    await act('talk', 'sepp'); await drive(['Giuseppe Ruggiero.', 'Arrivederci'], noDlg, { label: 'Name' }); await note('s4_bitte'); await log('„Giuseppe Ruggiero.“ – „Adesso scriva. Cara Carmela, sto bene.“');
    await exit('mission'); await at('bmission'); await act('talk', 'wimmer'); await drive(['Nach etwas aus dem Notizbuch', '(Den ältesten lesen.)', '(Den letzten lesen', '(Den kurzen lesen', '(Genug gelesen.)', 'Danke, Frau Wimmer'], noDlg, { label: 'Briefe', notes: ['s4_name'] });
    await flag('k4.s.letters'); await note('s4_brief79'); await log('Frau Wimmer öffnet den Koffer: Carmelas Briefe; 1979: „Ti ho visto con le valigie.“');
    await mala(); await act('sense', 'suitcase'); await note('s4_carmela_hall'); await marko(); await log('Mala am Brief von 1979: eine Frau, die beim Schreiben weint');
    await comb('s4_brief79', 's4_carmela_hall', 's4_wusste'); await log('Schluss: Carmela wusste es seit 1979');
    await exit('door'); await go('heim'); await exit('elevator'); await at('heim_flur');
    await act('use', 'clock'); await drive(['(Bis drei warten.)'], async s => !s.dlg && await N('g4_drei'), { label: 'drei Uhr' });
    for (const n of ['g4_drei', 'g4_gong', 'g4_kalt', 'g4_spaeter']) await note(n); await log('um drei: Alois steht auf, der Gong, Gerda nimmt seine Hand und er friert, „Ihre Gerda kommt später“');
  });
  // ----------------------------------------------------------------------- Dienstagabend: Mama erkennt Sepp
  part('dienstag_abend', async () => {
    await untilPhase('k4_d2_n', 'Dienstag · Abend');
    await drive(['Erzähl weiter', 'Und die Abfahrt', 'Hast du ihn je', 'Danke, dass du', 'Gute Nacht'], async s => s.phase === 'k4_d2_n' && !s.dlg && !s.busy && await N('z4_ankunft'), { label: 'Jasna erkennt Sepp' });
    await flag('k4.d2.notice'); await note('z4_ankunft'); await log('Karte „Dienstag · Abend“; Mama sieht den Aushang: Juni 1992, „Polako, gospođo.“');
    await act('use', 'sofa'); await untilPhase('k4_d3', 'Mittwoch'); await log('Schlaf; Karte „Dritter Tag · Namen“');
  });

  // ======================================================================= Ablauf
  try {
    if (DUMP) fs.mkdirSync(DUMP, { recursive: true });
    let started = !FROM;
    for (const [name, fn] of SECTIONS) {
      if (!started) { if (name !== FROM) continue; started = true; await snapLoad(name); console.log('weiter ab Abschnitt ' + name + ' (Stand ' + step + ')'); }
      else if (name !== 'prolog') { await calm(); await snapSave(name); }
      section = name; await fn();
    }
    console.log('Spieltakt der Musterlösung (Pflichtdialoge in Normaltempo, inkl. Wartezeiten des Testtreibers): ' + (await D.ev(() => M.E.gt() - (M.__gt0 || 0)) / 60000).toFixed(1) + ' min');
    const errs = D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e)); console.log(errs.length ? 'FEHLER:\n' + errs.join('\n') : `DURCHLAUF KAPITEL 4 OK: ${step} Schritte in ${((Date.now() - t0) / 1000).toFixed(0)} s, keine JS-Fehler`);
    if (errs.length) process.exitCode = 1;
  } catch (e) { console.error('ABBRUCH in Abschnitt „' + section + '“ nach Schritt ' + step + ': ' + e.message); if (TRACE) console.error(P.trace.join('\n')); console.error(D.errors.slice(0, 8).join('\n')); await D.shot(path.join(SHOTS || DUMP || '.', 'w4_abbruch.png')).catch(() => {}); process.exitCode = 1; }
  await D.close2();
})();
