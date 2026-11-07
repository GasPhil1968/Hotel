// QA-Kopie von game/tools/walkthrough4.js als ladbares Modul (verketteter Lauf, Variantenschalter über __ctx.proc.env). Spielerhandlungen unverändert.
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
module.exports = async function (__ctx) { const process = __ctx.proc, console = __ctx.console;
  const D = __ctx.D;
  const t0 = Date.now(); let step = 0, section = '';
  const log = async (...a) => { if (__ctx.afterStep) await __ctx.afterStep(a.join(' ')); step++; console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] #${step} ${section ? section + ': ' : ''}${a.join(' ')}`);
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
    await D.ev(() => { M.__gt0 = M.E.gt(); M.__speechLog = []; if (!window.__QA_CHAINED) { try { localStorage.removeItem('mala.c3end'); localStorage.removeItem('mala.c2end'); } catch (e) {} M.E.setSlot(1); M.E.newGame(4); } });
    await calm(); await waitDlg('(Antworten', 90000); await at('zob'); await inPhase('k4_pro'); await note('u4_sms'); await note('k4_c_lana'); await shot('ankunft');
    await log('Kapitelstart: Karte „München“, Bild „Im Bus nach München“, Ankunft am ZOB, Anas SMS');
    await choose('(Antworten: „Bin da.“)'); await calm(); await flag('k4.p.arriveDone'); await log('Ana geantwortet: „Bin da.“; Markos Kopf pocht');
    await mala(); await act('look', 'pillar'); await flag('k4.h.found'); await marko(); await log('Mala findet Hansi am Pfeiler: „Kirchmaier. Hansi.“');
    await act('talk', 'hansi'); await drive(['Worauf warten', 'Feierabend, Herr', 'Ihre Schicht', 'Wer darf', 'Servus'], async s => !s.dlg && !s.overlay && await F('k4.h.local'), { label: 'Hansi' });
    await log('Hansi wartet auf seine Ablösung; Marko klingt „wia d’ Zeitung“; „Der Wastl, der wo do drüben lehnt“');
    await act('talk', 'wastl'); await drive(['Kannten Sie', 'Würden Sie etwas', 'Er hat gesagt'], async s => !s.dlg && !s.overlay && await F('k4.p.hansi'), { label: 'Wastl' });
    await flag('k4.p.hansi'); await log('Wastl löst Hansi ab: „Feierabend, Hansi.“');
    await exit('to_bridge'); await at('hacker'); await log('auf der Hackerbrücke');
    await exit('exit'); await go('westend', 'jhaus'); await log('Westend, Mamas Haus');
    await act('talk', 'huber'); await drive(['Ana schreibt', 'Wie heißt Ihre Katze', 'Arbeitet meine', 'Auf Wiedersehen'], async s => !s.dlg && !s.overlay && await F('k4.p.key'), { label: 'Huber' });
    await flag('k4.p.key'); await log('Frau Huber gibt den Schlüssel; Mucki');
    await exit('up'); await at('jwohnung'); await act('look', 'slippers'); await note('u4_pantoffeln'); await act('look', 'photo'); await act('read', 'folder'); await note('u4_dach'); await log('Mamas Wohnung: Pantoffeln Größe 44, das Foto, die Mappe „Vratnik – krov“');
    await drive(['Ich war nie fertig'], async s => !s.dlg && !s.overlay && await F('k4.p.knock'), { label: 'Klopfen' }); await log('11:10, Malas Klopfen');
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
    await act('talk', 'ana'); await drive(['Zeigst du mir', 'Lana hat dir eine Straßenbahn', 'Ich weiß es eben', 'Ich muss dir etwas sagen', 'Mala fragen', 'Lana ist tot', 'Schweigen', 'Ich gehe noch'], async s => !s.dlg && !s.overlay && await F('k4.d1.walk'), { label: 'Spaziergang' });
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
    await exit('bedroom'); await at('jschlaf'); await act('look', 'box'); await drive(['(Lesen.)'], async s => !s.dlg && !s.overlay && await F('k4.d1.box'), { label: 'Kiste' });
    await note('z4_nachricht'); await note('z4_antrag'); await note('z4_passierschein'); await log('Mala liest die Kiste: Rotkreuz-Nachricht 1993, Suchantrag 1994, Passierschein 1992 (bleibt ihr Geheimnis)');
    await marko(); await act('use', 'sofa'); await untilPhase('k4_d2', 'Dienstag'); await log('Schlaf; Karte „Zweiter Feiertag“, Karte „Zweiter Tag · Der Anruf“');
  });

  // ----------------------------------------------------------------------- Dienstag: Kolars Anruf, Ana 2004, Josef Rugiero, drei Uhr
  part('dienstag', async () => {
    const SAMPLE = await D.ev(() => M.k4Carry.sample);   // Übernahme aus Mostar (Probe ja/nein), nicht gesetzt, nur gelesen
    if (SAMPLE) await drive(['Ana hat eine Probe', 'Das ist er', 'Meine Großmutter'], async s => s.phase === 'k4_d2' && !s.dlg && !s.busy && await F('k4.d2.kolar'), { label: 'Kolars Anruf' });
    else await drive(['Ein Rechenschieber', 'Was steht noch', 'Das ist er', 'Meine Großmutter'], async s => s.phase === 'k4_d2' && !s.dlg && !s.busy && await F('k4.d2.kolar'), { label: 'Kolars Anruf (Probe nein)', strict: false });
    await note('z4_kolar'); await note('z4_kode'); if (SAMPLE) await note('z4_ana2004'); else await expect(!(await N('z4_ana2004')) && await D.ev(() => !!M.GS.map.konsulat), 'Probe nein: noch kein z4_ana2004, Konsulat auf dem Plan'); await log('Frau Kolar ruft an: die Brauerei, April 1993, der Rechenschieber „Z. V.“; Anas Probe von 2004; „nije se vratio“ in den Akten');
    await mala(); await comb('z4_nachricht', 'z4_kode', 'z4_tot'); await marko(); await log('Mala zieht ihren eigenen Schluss: In Sarajevo hieß es tot (bleibt ihr Geheimnis)');
    await exit('door'); await exit('exit'); await go('giesing', 'ana');
    if (!SAMPLE && process.env.QA_KONSULAT_EARLY === '1') { await go('konsulat'); await act('talk', 'beamtin'); await drive(['Ich komme wegen', 'Auf Wiedersehen'], async s => !s.dlg && !s.overlay, { label: 'Konsulat Dienstag', strict: false }); await expect(!(await F('k4.e.sample2')), 'Dienstag: Karte noch nicht da'); await log('Konsulat am Dienstag: die Karte ist noch nicht da'); await go('giesing', 'ana'); }
    if (SAMPLE) { await act('talk', 'ana'); await drive(['Ana. Zweitausendvier', 'Warum nicht', 'Gut. Nach Neujahr', 'Ich gehe'], async s => !s.dlg && !s.overlay && await F('k4.d2.wait'), { label: 'Ana 2004' }); }
    else { await act('talk', 'ana'); await drive(['Frau Kolar hat eine Probe', '(Schweigen.)', 'Sie hat ein Recht', 'Gut. Nach Neujahr', 'Ich gehe'], async s => !s.dlg && !s.overlay && await F('k4.d2.wait'), { label: 'Ana (Probe nein)', strict: false }); await note('z4_ana2004'); }
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
    await act('use', 'clock'); await drive(['(Bis drei warten.)'], async () => await N('g4_drei'), { label: 'drei Uhr' });   // mit g4_drei endet der Dienstag von selbst
    for (const n of ['g4_drei', 'g4_gong', 'g4_kalt', 'g4_spaeter']) await note(n); await log('um drei: Alois steht auf, der Gong, Gerda nimmt seine Hand und er friert, „Ihre Gerda kommt später“');
  });
  // ----------------------------------------------------------------------- Dienstagabend: Mama erkennt Sepp
  part('dienstag_abend', async () => {
    await untilPhase('k4_d2_n', 'Dienstag · Abend');
    await drive(['Erzähl weiter', 'Und die Abfahrt', 'Hast du ihn je', 'Danke, dass du', 'Gute Nacht'], async s => s.phase === 'k4_d2_n' && !s.dlg && !s.busy && await N('z4_ankunft'), { label: 'Jasna erkennt Sepp' });
    await flag('k4.d2.notice'); await note('z4_ankunft'); await log('Karte „Dienstag · Abend“; Mama sieht den Aushang: Juni 1992, „Polako, gospođo.“');
    await act('use', 'sofa'); await untilPhase('k4_d3', 'Mittwoch'); await log('Schlaf; Karte „Dritter Tag · Namen“');
  });

  // ----------------------------------------------------------------------- Mittwoch: Davor und Lena, Carmela, Sepps Zwischenwelt, die Versuche um drei, Gerdas Entschluss
  part('mittwoch', async () => {
    await D.item('use2', 'vizitka'); await calm(); await drive(['Bei meiner Mutter', 'Ich bin kein Gärtner'], async s => !s.dlg && !s.overlay && await F('k4.v.called'), { label: 'Anruf bei Davor' });
    await expect(await mapHas('moosach'), 'Moosach auf dem Plan'); await log('Davors Karte: Anruf; „Ich bin kein Gärtner.“ – er lädt ein nach Moosach');
    await exit('door'); await exit('exit'); await go('moosach', 'balkon'); await flag('k4.v.visit'); await log('Moosach: Davors Balkon, Lena und der Feigenzweig');
    await mala(); await act('sense', 'pot'); await flag('k4.v.sleeps'); await marko(); await log('Mala: Der Zweig schläft nur');
    await act('talk', 'lena'); await drive(['Er schläft nur', 'Wir rufen Jela an', 'Sie sagt, du hast es gut gemeint', 'Vielleicht an Silvester', '(Gehen.)'], async s => !s.dlg && !s.overlay && await F('k4.v.car'), { label: 'Lena und Jela' });
    await flag('k4.v.jela'); await log('Jela am Telefon: „Pusti ga. Zimi spava. Ne zalijevaj.“; Davor bietet an, an Silvester zu fahren');
    if (!(await D.ev(() => M.k4Carry.sample))) { await go('konsulat'); await act('talk', 'beamtin'); await drive(['Ich komme wegen', '(Den Finger hinhalten.)'], async () => await F('k4.e.sample2'), { label: 'Konsulat Mittwoch', strict: false }); await calm(); await flag('k4.e.sample2'); await log('Probe nein: Mittwoch im Konsulat die Probe abgegeben („Den Finger hinhalten.“)'); }
    await go('hbf', 'gleis11'); await act('talk', 'sepp');
    await drive(['Ich rufe Carmela an', 'Ich habe seine Briefe gelesen', 'Seit neunzehnhundertneunundsiebzig', 'Er ist tot.', 'Er hört zu'], async s => await F('k4.s.call') && !s.dlg && !s.busy, { label: 'Carmela' });
    await expect((await st()).active === 'mala', 'Mala am Zug'); await log('Anruf in Pietrafonda Nuova: Carmela, „Lo sapevo. Da trent’anni.“');
    await act('cross', 'sepp'); await choose('(Ihre Hand nehmen.)'); await at('limbo'); await shot('limbo_sepp');
    await act('talk', 'ghost_s'); await drive(['(Den Koffer tragen.)'], async s => !s.dlg && !s.overlay && await F('k4.s.crossed'), { label: 'Zwischenwelt Sepp' }); await expectSaid('Facchino!'); await log('Zwischenwelt: Marko trägt den Koffer in den Zug, „Facchino!“');
    await exit('arch'); await at('gleis11'); await log('zurück an Gleis 11');
    await exit('mission'); await act('talk', 'wimmer'); await drive(['Ich habe seine Schwester angerufen', 'Danke, Frau Wimmer'], noDlg, { label: 'Wimmer Abschied' }); await flag('k4.s.wimmerFw'); await log('Frau Wimmer plant den Abschied am Donnerstag');
    await exit('door'); await go('bhfviertel', 'barsport'); await act('talk', 'enzo'); await drive(['Am Donnerstag verabschieden wir ihn', 'Arrivederci'], noDlg, { label: 'Enzo' }); await flag('k4.s.enzoInv'); await log('Enzo kommt zum Abschied');
    await go('friedhof', 'friedamt'); await act('talk', 'obermaier'); await drive(['Seine Schwester will ihn heimholen', 'Auf Wiedersehen'], noDlg, { label: 'Obermaier' }); await flag('k4.s.amtOff'); await log('Herr Obermaier sagt die Bestattung von Amts wegen ab');
    await go('heim'); await exit('elevator'); await at('heim_flur');
    await act('talk', 'kraus'); await drive(['Können Sie den Gong abstellen', 'Herr Lechner erschrickt', 'Danke'], noDlg, { label: 'Kraus' }); await flag('k4.g.chimeOff'); await log('Herr Kraus stellt den Gong für heute um drei ab');
    await act('use', 'clock'); await drive(['(Bis drei warten.)'], async s => !s.dlg && !s.overlay && await N('g4_versuch1'), { label: 'Versuch 1' }); await log('Versuch 1 (ohne Gong, Gerda bei ihm): Er steht nicht auf, aber er friert');
    await mala(); await exit('door214'); await at('heim214'); await act('sense', 'depot_photo'); await note('g4_depot'); await exit('door'); await at('heim_flur'); await marko(); await log('Mala an den Fotos in Zimmer 214: Gerda am Depottor, fünfunddreißig Jahre');
    await exit('elevator'); await at('heim'); await exit('door'); await travel('westend'); await go('heim'); await exit('elevator'); await at('heim_flur'); await log('hinaus und wieder herein: ein neuer Nachmittag');
    await mala(); await act('talk', 'gerda'); await drive(['Sie haben immer draußen gewartet', '(Gehen.)'], noDlg, { label: 'Gerda am Fenster' }); await flag('k4.g.hall'); await marko(); await log('Mala bittet Gerda, heute am Fenster zu warten: „Am Fenster. Einmal.“');
    await act('use', 'bench'); await drive(['(Bis drei warten.)'], async s => !s.dlg && !s.overlay && await N('g4_versuch2'), { label: 'Versuch 2' }); await log('Versuch 2 (mit Gong, Gerda am Fenster): Er steht auf, aber er friert nicht');
    await comb('g4_versuch1', 'g4_versuch2', 'g4_beides'); await comb('g4_beides', 'g4_depot', 'g4_worte'); await log('Schlüsse: Gong und Hand; in seiner Sprache: Feierabend, sie wartet am Depot');
    await exit('door_raum'); await act('talk', 'ertl'); await drive(['Nach etwas aus dem Notizbuch', 'Danke'], noDlg, { label: 'Frau Ertl', notes: ['g4_worte'] }); await flag('k4.g.ertl'); await exit('door'); await at('heim_flur'); await log('Frau Ertl erlaubt einen Versuch mit der Wahrheit');
    await mala(); await act('talk', 'gerda');
    await drive(['(Ihr sagen, was die Versuche', '(Die Versuche erzählen.)', 'Hat er früher gefroren'], async () => await F('k4.g.decided'), { label: 'Gerdas Entschluss', notes: ['g4_beides'] });
    await log('Mala sagt es Gerda: „Hat er früher gefroren, wenn Sie da waren?“ – Gerda geht, am Donnerstag');
  });
  // ----------------------------------------------------------------------- Donnerstag: Sepps Abschied mit Mama, Gerdas Abschied, die Kanne
  part('donnerstag', async () => {
    await untilPhase('k4_d4', 'Donnerstag'); await at('jwohnung'); await log('„Morgen ist Donnerstag.“ Karte „Vierter Tag · Abschiede“; Mamas Zettel: „Ich komme mit“');
    await exit('door'); await exit('exit'); await go('hbf', 'gleis11'); await exit('mission');
    await drive(['(Mit seinem Namen anfangen.)', '(Neben sie treten.)'], async s => !s.dlg && !s.busy && await F('k4.s.farewell'), { label: 'Sepps Abschied' });
    await flag('k4.s.jasna'); await note('z4_riss'); await log('Abschied in der Bahnhofsmission, Mama ist dabei: „Ich war auf keiner Beerdigung seit 1992. Ich wusste nicht, für wen.“');
    await exit('door'); await go('heim'); await exit('elevator'); await at('heim_flur');
    await act('use', 'clock'); await drive(['(Bis drei warten.)', 'Endstation, Herr Lechner', '(Ihre Hand nehmen.)'], async s => s.room === 'limbo' && !s.dlg, { label: 'Endstation' });
    await flag('k4.g.goodbye'); await shot('limbo_gerda'); await log('um drei: „Endstation, Herr Lechner.“ – Gerda: „Dann fahr i ei.“ Zwischenwelt');
    await act('talk', 'ghost_gd'); await drive(['Was sehen Sie im Licht', '(Ihr die Stufe hinaufhelfen.)'], async s => !s.dlg && !s.overlay && await said('Wer losgelassen hat'), { label: 'Zwischenwelt Gerda' });
    await exit('arch'); await at('heim_flur'); await inv('kanne'); await log('Zwischenwelt: Marko hilft Gerda die hohe Stufe hinauf; die Kanne wird stofflich');
    await act('give', 'alois', 'kanne'); await flag('k4.g.thermos'); await log('Alois bekommt die Kanne; Mama hat es gesehen');
  });
  // ----------------------------------------------------------------------- Donnerstagabend: der Streit
  part('streit', async () => {
    await untilPhase('k4_d4_n', 'Donnerstag · Abend');
    await drive(['Woher weißt du', 'Du hast in meinem Leben'], async s => s.phase === 'k4_d4_n' && !s.busy && !s.dlg && await F('k4.d4.fight'), { label: 'Streit' });
    await flag('k4.r.shared'); await flag('k4.d4.slip'); await expect(!(await D.ev(() => M.GS.malaOn)), 'Mala ist fort'); await log('Karte „Donnerstag · Abend“; der Streit: „Du hast in meinem Leben gelesen.“ – die Kanister; Mala ist fort');
    await act('use', 'sofa'); await untilPhase('k4_d5', 'Freitag'); await log('Schlaf; Karte „Fünfter Tag · Ohne Mala“');
  });
  // ----------------------------------------------------------------------- Freitag: Ana, ein Satz in zwei Städten
  part('freitag', async () => {
    await exit('door'); await exit('exit'); await go('giesing', 'ana');
    await act('talk', 'ana'); await drive(['Was weißt du noch', 'Ich gehe'], async s => !s.dlg && !s.overlay && await F('k4.d5.ana'), { label: 'Ana Freitag' }); await note('z4_kurve_ana'); await log('Ana: „Mama stand bis zur Kurve am Fenster.“');
    await comb('z4_lesart', 'z4_antrag', 'z4_vermisst'); await comb('z4_passierschein', 'z4_kurve_ana', 'z4_kurve'); await log('Schlüsse: Mama hat „vermisst“ gelesen; sie hat zurückgesehen');
    await comb('z4_vermisst', 'z4_tot', 'z4_zweistaedte'); await log('Schluss: derselbe Satz, zwei Städte');
  });
  // ----------------------------------------------------------------------- Freitagnacht: die Hackerbrücke
  part('bruecke', async () => {
    await untilPhase('k4_d5_n', 'Freitag · Nacht'); await at('hacker'); await shot('bruecke');
    await drive(['Ich habe dich gesucht', 'Das war gemein', '(Erzählen.)', 'Und ich habe gesagt', 'Fünf Tage', 'Ich nicht. Morgen', 'Und wenn ich nicht mehr kann', '(Zum Käse.)'], async s => s.phase === 'k4_fin_a' && !s.busy && !s.dlg && await F('k4.fin.eve'), { label: 'Brücke', max: 200 });
    await note('z4_dabei'); await flag('k4.d5.bridge'); await log('Karte „Freitag · Nacht“; Schlüsseldialog 2 auf der Hackerbrücke: „Ich war dabei.“ Erinnerung „April 1993“');
  });
  // ----------------------------------------------------------------------- Silvester: Bleigießen, Mama ist fort, die Spur, die Fahrt mit Davor, Zimmer 214
  part('silvester', async () => {
    await at('ana'); await log('Karte „Finale · Silvester“, bei Ana');
    await act('use', 'table'); await drive(['(Blei gießen.)'], async s => s.phase === 'k4_fin_n' && s.active === 'mala' && !s.busy && !s.dlg, { label: 'Bleigießen' });
    await flag('k4.fin.gone'); await log('Bleigießen um elf; 23:15: Mama ist fort');
    await exit('door'); await flag('k4.fin.trail'); await expect((await st()).active === 'marko', 'zurück bei Marko'); await log('Mala liest die Spur im Treppenhaus: „Jedan, dva, tri …“; Ana: „Sonst arbeitet sie Silvester.“');
    await exit('door'); await D.ev(() => M.TA.travel('heim')); await drive(['(Davor anrufen.)'], async s => s.room === 'heim' && !s.busy && !s.dlg, { label: 'Fahrt' });
    await flag('k4.fin.ride', 'davor'); await log('Davor fährt: „Diesmal ist keiner zu spät.“');
    await act('talk', 'kevin'); await drive(['Wie jedes Jahr', 'Danke, Kevin'], noDlg, { label: 'Kevin' }); await log('Kevin an der Tür');
    await exit('stairs'); await at('heim_flur'); await exit('door214'); await at('heim214'); await shot('zimmer214');
    await drive(['Erzählen. Nur', 'Warten', 'Etwas aus dem Notizbuch', 'Sie haben ihn', 'Weil er weiß', 'Ich komme mit'], async s => s.phase === 'k4_epi' && !s.busy, { label: 'Silvestergespräch', notes: ['z4_dabei', 'z4_zweistaedte', 'z4_kurve'], max: 200 });
    await flag('k4.fin.done'); await flag('k4.fin.decide'); await flag('k4.fin.ana'); await flag('k4.fin.kurve'); await log('Zimmer 214: das Silvestergespräch in acht Zügen; „Ich fahre hin.“ Ana kommt um 00:40');
  });
  // ----------------------------------------------------------------------- Epilog: Neujahr
  part('epilog', async () => {
    await at('jwohnung'); await log('Karte „Epilog · Neujahr“, Mamas Küche');
    await act('talk', 'jasna'); await drive(['Nada wartet', 'Woran denkst', 'Wie geht es dir', '(Den Nachruf schreiben.)', 'Das Dach in Vratnik', 'Bist du wütend', ...(process.env.QA_C2 ? [process.env.QA_C2] : []), 'Ja. Und wenn'], async () => false, { label: 'Epilog', max: 200 });   // läuft bis zum Abspann
    const c4 = await D.ev(() => JSON.parse(localStorage.getItem('mala.c4end') || 'null'));
    for (let i = 0; i < 200; i++) { const s = await st(); if (s.screen === 'credits' || s.screen === 'title') break; if (s.overlay === 'memory' || s.overlay === 'doc') await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(150); }
    await D.until(s => s.screen === 'credits' || s.screen === 'title', 90000, 'Abspann');
    await expect(c4 && c4.slippers && c4.nada && c4.kurve && c4.davor, 'M.endChapter4: Kapitel beendet und in mala.c4end gemerkt (' + JSON.stringify(c4) + ')');
    await log('Pantoffeln, Nada, der Nachruf, Malas Frage; Ende des vierten Kapitels · Fortsetzung: Sarajevo; Abspann');
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
  return __ctx.done();
};
