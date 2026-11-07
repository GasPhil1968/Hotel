// QA-Kopie von game/tools/walkthrough3.js als ladbares Modul (verketteter Lauf, Variantenschalter über __ctx.proc.env). Spielerhandlungen unverändert.
// Automatischer Komplett-Durchlauf von Kapitel 3 (Mostar): von M.E.newGame(3) bis zum Abspann, nur mit Spielerhandlungen.
// Reisen über den Stadtplan (M.TA.travel), Gespräche mit den sichtbaren Auswahltexten, Ansehen/Benutzen/Geben, Notizen verbinden,
// Wechsel zu Mala, die Peilung über M.k3PeilTap, Rätsel-Overlays über ihre check. Kein gesetzter Schalter, keine gesetzte Notiz.
//   node game/tools/walkthrough3.js [screenshot-ordner]
//   MALA_HTML=<build>/index.html   anderer Bau
//   MALA_DUMPALL=<ordner>          Spielstand nach jedem Schritt (für hintcheck.js und k3tests.js)
//   MALA_HINTLOG=<datei>           offene Hinweisthemen nach jeder Aktion (über den Treiber)
//   MALA_SNAP=<ordner>             Stand zu Beginn jedes Abschnitts; MALA_FROM=<abschnitt> spielt ab dort weiter (nur Fehlersuche)
const { open } = require('./driver');
const { play } = require('./k3play');
const fs = require('fs'), path = require('path');
const SHOTS = process.argv[2] || null;
const DUMP = process.env.MALA_DUMPALL || null, SNAP = process.env.MALA_SNAP || null, FROM = process.env.MALA_FROM || null;
module.exports = async function (__ctx) { const process = __ctx.proc, console = __ctx.console;
  const D = __ctx.D;
  const t0 = Date.now(); let step = 0, section = '';
  const log = async (...a) => { if (__ctx.afterStep) await __ctx.afterStep(a.join(' ')); step++; console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] #${step} ${section ? section + ': ' : ''}${a.join(' ')}`);
    if (DUMP) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); fs.writeFileSync(path.join(DUMP, String(step).padStart(3, '0') + '.json'), JSON.stringify({ step, section, label: a.join(' '), GS: g })); } };
  // Spielerhandlungen (gemeinsam mit k3tests.js); Anrufe, die von selbst kommen, werden als eigener Schritt protokolliert
  const P = play(D, { onStep: (t) => log(t) });
  const { st, fail, expect, note, flag, inv, room, phase, at, inPhase, said, expectSaid, calm, act, exit, choose, pick, dlgHas, waitDlg, talk, ask, bye, comb, mala, marko, travel, go, peil, solve, arrange } = P;
  const shot = async (n) => { if (SHOTS) await D.shot(`${SHOTS}/w3_${String(step).padStart(3, '0')}_${n}.png`); };
  const snapSave = async (name) => { if (!SNAP) return; fs.mkdirSync(SNAP, { recursive: true }); const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); fs.writeFileSync(path.join(SNAP, name + '.json'), JSON.stringify({ step, GS: g })); };
  const snapLoad = async (name) => { const d = JSON.parse(fs.readFileSync(path.join(SNAP, name + '.json'), 'utf8')); step = d.step;
    await D.ev((g) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__wt = { GS: g }; M.E.loadPreset('__wt', 1); }, d.GS); await D.page.waitForTimeout(400); await calm(); };

  // ======================================================================= Abschnitte
  const SECTIONS = [];
  const part = (name, fn) => SECTIONS.push([name, fn]);

  // ----------------------------------------------------------------------- Prolog: Ankunft, Herberge, Alte Brücke
  part('prolog', async () => {
    await D.ev(() => { M.__gt0 = M.E.gt(); M.__speechLog = []; if (!window.__QA_CHAINED) { M.E.setSlot(1); M.E.newGame(3); } });
    await calm(); await waitDlg('(Antworten.)'); await at('ostbus'); await inPhase('k3_pro'); await note('p3_sms'); await note('k3_c_promise'); await shot('ankunft');
    await log('Kapitelstart: Karte „Mostar“, Bild „Im Bus“, Ankunft am Ostbusbahnhof, Nadas SMS');
    await choose('(Antworten.)'); await flag('k3.p.sms', 'yes'); await log('Nada geantwortet: „Stigao sam. Javim se.“');
    await act('read', 'board'); await note('p3_munich'); await log('Tafel: MÜNCHEN · subota');
    await talk('kioskm', 'Einen Stadtplan'); await bye('Danke'); await inv('plan'); await flag('k3.p.plan');
    await expect(await D.ev(() => !!(M.GS.map.herberge && M.GS.map.kujundziluk && M.GS.map.starimost)), 'Herberge, Kujundžiluk und Alte Brücke auf dem Plan'); await log('Stadtplan vom Kiosk');
    await go('herberge'); await log('Herberge „Neretva“');
    await talk('maja', 'Ich möchte mich eintragen'); await choose('(Bei Abreise „28.11.'); await bye('Danke, Maja'); await flag('k3.p.checkin'); await log('bei Maja eingetragen, Abreise 28.11.');
    await go('starimost'); await shot('starimost');
    if (await dlgHas('Landessprache')) { await choose('(In der Landessprache.)'); await log('Dino stellt sich vor: „A, naš si.“'); }
    await talk('_mala', 'Ist sie es'); await note('l3_mybridge'); await log('„Ist sie es?“ – Malas Brücke stand im Wasser (Splitter)');
    await choose('Im Januar vierundneunzig'); await flag('k3.p.objection'); await log('Einwand: „Kaputt schon. Aber stand sie je im Wasser?“');
    await choose('Wohin zeigt die Leine'); await note('l3_down'); await bye('Komm.'); await log('Leine: flussab');
    await talk('dino', 'Erzähl mir von der Brücke'); await note('p3_history'); await choose('Stand die Brücke je im Wasser'); await note('l3_onearch'); await flag('k3.p.src', 'dino'); await bye('Bis später'); await log('Dino: gefallen 1993, „Stari most stand nie im Wasser“');
    await act('use', 'steps'); await note('l3_onedir'); await flag('k3.p.followed'); await log('der Leine am Ufer gefolgt: „Eine Richtung reicht nicht.“');
    await comb('l3_mybridge', 'l3_onearch', 'l3_notbridge'); await log('Schluss: Nicht die Alte Brücke');
  });
  // ----------------------------------------------------------------------- Donnerstagabend: Gespräch 1, Malas Nacht, Schlaf
  part('abend', async () => {
    await waitDlg('Versprochen.'); await inPhase('k3_pro_n'); await at('herberge'); await shot('talk1'); await log('Tagesende: „Es wird dunkel.“ – Terrasse, Gespräch 1 „Mich hast du nicht gefragt“');
    await choose('Versprochen.'); await flag('k3.p.talk1'); await flag('k3.ask'); await flag('k3.p.promise', 'a'); await log('Versprechen: „Versprochen.“ – „Mala fragen“ ist offen');
    await mala(); await exit('railing'); await at('starimost'); await flag('k3.p.springerSeen'); await log('Mala allein an den Uferstufen: der Springer');
    await talk('springer', '(Klatschen.)'); await flag('k3.p.springer'); await bye('(Zusehen.)'); await log('Mala klatscht ohne Ton');
    await exit('steps'); await at('herberge'); await marko(); await exit('stairs'); await at('zimmer');
    await act('use', 'bed'); await D.until(s => s.phase === 'k3_d1' && s.room === 'zimmer', 60000, 'Freitag'); await calm(); await inPhase('k3_d1'); await at('zimmer'); await shot('freitag');
    await log('Schlaf. Karte „Erster Tag – Die Peilung“, Morgen im Zimmer');
  });
  // ----------------------------------------------------------------------- Freitag: Peilung, Mala über den Fluss, Mate, alte Karte, Vulkanizer
  part('freitag', async () => {
    await exit('door'); await at('herberge');
    await D.item('use2', 'mobitel'); await calm(); await choose('Sanja in Split'); await flag('k3.d1.sanja'); await log('Sanja angerufen: Ljerka ruft zurück');
    await go('starimost'); await act('use', 'bridgehead'); await peil('bridgehead'); await flag('k3.peil.bridgehead'); await note('l3_m1');
    await expect(await D.ev(() => !!M.GS.map.koski), 'Koski-Moschee auf dem Plan'); await log('Peilung 1 am Brückenkopf');
    await go('koski'); await flag('k3.d1.ljerka'); await note('l3_ljerka_pic');
    await talk('kasir', 'Eine Karte fürs Minarett'); await bye('Danke'); await flag('k3.koski.ticket'); await inv('ulaznica'); await log('Karte fürs Minarett');
    await exit('minaret_door'); await at('minarett'); await act('use', 'view'); await peil('minaret'); await flag('k3.peil.minaret'); await note('l3_m2'); await log('Peilung 2 vom Minarett');
    await exit('stairs'); await at('koski');
    await comb('l3_m1', 'l3_m2', 'l3_flat'); await expect(await D.ev(() => !!M.GS.map.strassenbr), 'Straßenbrücke auf dem Plan'); await log('Schluss: zu flach geschnitten; Mala: „Über den Fluss. Nein.“');
    await go('strassenbr'); await D.until(s => s.active === 'mala' && !s.busy, 30000, 'Mala führt'); await shot('strasse');
    await log('Straßenbrücke: „Das ist eine Straße mit Geländer.“ – Mala macht die Augen zu');
    await D.ev(() => M.E.walkPlayerTo(380, 126)); await D.until(s => s.active === 'marko' && !s.busy, 60000, 'drüben'); await calm(); await flag('k3.mala.crossed');
    await expect(await D.ev(() => !!(M.GS.map.bulevar && M.GS.map.westbus)), 'Westufer auf dem Plan'); await log('Mala geht mit geschlossenen Augen hinüber');
    await go('partizan'); await flag('k3.bellsOut'); await log('Partisanenfriedhof: Glocken, Mala ist fort');
    for (let i = 0; i < 80 && !(await D.flag('k3.bells1')); i++) { await D.page.waitForTimeout(200); await calm(); }
    await flag('k3.bells1'); await expectSaid('Wenn ich es weiß.'); await log('Mala ist zurück: „Zu laut.“ – „Wenn ich es weiß.“');
    await act('use', 'view'); await peil('partizan'); await flag('k3.peil.partizan'); await note('l3_m3'); await log('Peilung 3 am Westhang; „Doch. Wir.“');
    await comb('l3_flat', 'l3_m3', 'l3_area'); await log('Schluss: der Bereich liegt hinter dem Kartenrand');
    await go('westbus'); await exit('cafe_door'); await at('kafic'); await flag('found.mate'); await note('b3_mate'); await shot('kafic'); await log('Café „Zdravko“: Mala sieht Mate am Fenstertisch');
    await act('look', 'oldmap'); await D.until(s => s.overlay === 'peil', 20000, 'alte Karte'); await D.ev(() => M.k3PeilTap('go')); await calm(); await note('l3_oldmap'); await log('Zdravkos Karte von 1985');
    await comb('l3_area', 'l3_oldmap', 'l3_skela'); await expect(await D.ev(() => !!M.GS.map.skela), 'Skela auf dem Plan'); await log('Schluss: Skela heißt Fähre');
    await talk('mate', 'Ich suche einen Fahrer', 'Auf Wiedersehen', 'Ich sehe nach'); await note('v3_mate'); await flag('k3.v.known'); await flag('k3.b.promise'); await log('Mate: „Rajić? Der Raucher?“; „Ich sehe nach.“');
    await exit('door'); await go('bulevar'); await exit('to_vulk'); await at('vulkanizer'); await shot('vulk'); await log('Vulkanizer Rajić: Kata und Vlado');
    await talk('vlado', 'Im Januar vierundneunzig'); await bye('(Gehen.)'); await note('v3_denial'); await flag('k3.v.met'); await log('Vlado: „Ich habe nie jemanden mitgenommen. Nie.“');
    await talk('kata', 'Was steht da hinten'); await choose('Ich bin Übersetzer'); await solve([1, 1, 0, 0]); await note('v3_typenschein'); await flag('k3.v.which');
    await waitDlg('Ich weiß es nicht'); await choose('Ich weiß es nicht'); await bye('(Gehen.)'); await log('Katas E-Mail übersetzt; „Welche?“ – Marko weiß es noch nicht');
    await mala(); await act('look', 'drawer3'); await note('v3_drawer'); await log('Mala sieht durch das Holz: unten die Mappe „TAM 4500“ und ein Schlüssel „31“');
    await exit('yard_door'); await at('vhof'); await act('sense', 'cab'); await note('v3_cab'); await note('v3_hewas'); await log('Mala im Führerhaus: „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“');
    await exit('door'); await at('vulkanizer'); await marko();
    await talk('kata', 'Die Schublade'); await choose('Die unterste'); await calm(); await flag('k3.v.drawer'); await note('v3_tomorrow'); await log('„Die unterste.“ Zeichnung und Schlüssel 31; Vlado: „Morgen.“');
  });
  // ----------------------------------------------------------------------- Freitagnacht: das Vatergespräch
  part('freitag_nacht', async () => {
    await D.until(s => s.phase === 'k3_d1_n', 60000, 'Freitag · Nacht'); await calm(); await at('herberge'); await flag('k3.d1.father'); await note('e3_father'); await log('Tagesende: Freitag · Nacht, die Australier singen, das Vatergespräch');
    await exit('stairs'); await act('use', 'bed'); await D.until(s => s.phase === 'k3_d2' && s.room === 'zimmer', 60000, 'Samstag'); await calm(); await note('l3_city'); await flag('k3.d2.wake'); await log('Schlaf. Samstag: „Sie zeigt heute woandershin. In die Stadt.“');
  });
  // ----------------------------------------------------------------------- Samstag: Tepa, Vlado Teil 1, der Bus aus München, Jela
  part('samstag', async () => {
    await comb('l3_skela', 'l3_city', 'l3_person'); await log('Schluss: ein Mensch, kein Ort');
    await exit('door'); await at('herberge'); await note('l3_tepa'); await expect(await D.ev(() => !!M.GS.map.tepa), 'Tepa auf dem Plan'); await log('Maja: Samstags kommen die Leute aus den Dörfern auf die Tepa');
    await comb('l3_ljerka_pic', 'k3_c_name', 'l3_onetrail'); await comb('l3_onetrail', 'k3_c_missing', 'l3_twosearches'); await log('Schlüsse: Mala und Lana sind eine Spur; zwei Suchen, die sich nie trafen');
    await go('tepa'); await shot('tepa');
    await talk('zlata', 'Kennen Sie Lana Delić'); await choose('Ich suche ein Mädchen'); await bye('Doviđenja'); await flag('k3.z.asked'); await log('die Eierfrau: „Ne.“ – „Jede Mutter sucht ein Kind.“');
    await mala(); await act('listen', 'susjeda'); await note('l3_dreams'); await marko(); await log('Mala lauscht: „Sanjam je opet. Treću noć.“');
    await talk('zlata', 'Kannten Sie eine Mala'); await waitDlg('Ein Freund'); await choose('Ein Freund'); await flag('k3.z.mala'); await note('l3_eggwoman'); await log('„Mala“: das Ei fällt, „Ko ste vi?“, sie packt zusammen');
    await go('bulevar'); await exit('to_vulk'); await at('vulkanizer');
    await act('look', 'desk'); await note('v3_forlater'); await log('die Zeichnung auf Vlados Tisch, Rückseite: „Für später.“');
    await talk('vlado', 'Der Schlüssel auf Ihrem Tisch'); await waitDlg('Und dann?'); await choose('Und dann?'); await flag('k3.v.part1'); await note('v3_mala'); await note('v3_part1'); await note('v3_mala_left');
    await log('Vlado, Teil 1: „Sie hat gesagt, sie heißt Mala. Wie jede.“ – Mala: „Er ist gefahren.“');
    await exit('door'); await go('westbus'); await waitDlg('Ich komme mit'); await shot('bus'); await choose('Ich komme mit'); await flag('k3.b.arrived'); await note('b3_notson'); await log('der Bus aus München: „Er kommt mit dem nächsten. Mein Sohn ist jung.“; „Ich komme mit.“');
    await go('zelenika'); await waitDlg('Jetzt kommt er'); await choose('Jetzt kommt er'); await flag('k3.b.jela'); await note('b3_gate'); await note('b3_figs'); await log('Haus Zelenika: Jela mit dem Schlüssel, Marko übersetzt');
    await D.until(s => s.dlg && s.dlg.some(t => /Mala fragen/.test(t)), 60000, 'Nadas Anruf'); await log('Tagesende: Nada ruft an: „Weißt du etwas?“');
    await choose('(Mala fragen.)'); await flag('k3.asked.nada2'); await choose('Ich habe eine Spur'); await flag('k3.d2.nada', 'truth'); await log('Mala gefragt: „Aber sag ihr nicht nichts.“ – „Ich habe eine Spur.“');
  });
  // ----------------------------------------------------------------------- Samstagnacht in Skela
  part('samstag_nacht', async () => {
    await D.until(s => s.phase === 'k3_d2_n', 60000, 'Samstagnacht'); await calm(); await at('herberge'); await log('Karte „Die Glocke · Samstag · Nacht“, Herberge');
    await go('skela', 'skela_d'); await note('a3_stumps'); await shot('skela_n'); await log('mit dem Taxi nach Skela; die Pfeilerstümpfe');
    await mala(); await act('look', 'far_shed'); await flag('k3.bato.found'); await note('a3_bato'); await log('Mala findet Bato: „Seine Leine hängt an der Glocke.“');
    await act('sense', 'hut'); await note('a3_hut'); await act('sense', 'bell'); await note('a3_bell3'); await note('a3_voice'); await act('sense', 'anchor'); await note('a3_mine'); await log('Nachhall: Hütte, Glocke („Halo! Ima li koga?“), Seilanker („Das ist meins.“)');
    await marko(); await act('use', 'bell'); await flag('k3.n2.rung'); await log('Marko läutet: Bato ruft „Geht!“, der Nachbar kommt');
    await exit('to_bridge'); await at('skela_most'); await act('read', 'plaque'); await note('a3_plaque'); await exit('exit_l'); await at('skela_l'); await log('über die neue Brücke ans linke Ufer (Mala bleibt)');
    await talk('bato'); await note('a3_soldier'); await choose('Sie sind tot'); await expectSaid('Was? Der Fluss ist zu laut.'); await bye('(Gehen.)'); await log('Bato: „Es war ein Mann. Ein Soldat.“; „tot“ hört er nicht');
    await calm(); await flag('k3.z.tomorrow'); await note('a3_tomorrow'); await log('Zlata mit der Lampe: „Vi.“ … „Sutra. Danju.“');
    await exit('to_bridge'); await exit('exit_d'); await D.until(s => s.phase === 'k3_d3', 60000, 'Sonntag'); await calm(); await at('zimmer'); await log('zurück zu Mala; Taxi; Karte „Dritter Tag – Zwei Ufer“');
  });
  // ----------------------------------------------------------------------- Sonntag: Rekonstruktion in Skela, Vlado Teil 2, Gespräch 2, die Botschaft, Mate
  part('sonntag', async () => {
    await exit('door'); await at('herberge'); await go('skela', 'skela_d'); await log('Sonntag in Skela');
    await exit('to_bridge'); await exit('exit_l'); await at('skela_l'); await flag('k3.d3.zlata1');
    await talk('zlata', 'Gab es hier eine Mala', 'Was ist mit ihr geschehen', 'Was ist mit ihr geschehen', 'Und Ihr Mann', '(Nach den Hühnern fragen.)', 'Was lag morgens an der Glocke'); await bye('Danke.');
    await note('a3_slept'); await note('a3_pencil'); await note('a3_morning'); await log('Zlata: „Er hat geschlafen.“; der Bleistift von der Glocke');
    await act('look', 'board'); await note('a3_grave'); await log('das Grab unter dem Quittenbaum');
    await comb('a3_voice', 'a3_pencil', 'a3_girl'); await log('Schluss: Es war das Mädchen');
    await act('use', 'house', 'mobitel'); await choose('(Ins Dachfenster.)'); await flag('k3.lit', 'roof'); await mala(); await at('skela_d'); await act('look', 'far_house'); await note('a3_roof'); await log('Lichtprobe: das Dachfenster, Batos Kammer');
    await act('sense', 'bell'); await note('a3_lightseq'); await marko(); await at('skela_l'); await log('Mala ordnet ihren Nachhall: dunkel, Licht, dunkel');
    await exit('house_door'); await at('zlata_k'); await act('use', 'table'); await choose('(Die Nacht der Reihe nach'); await arrange(); await note('a3_lightroom'); await flag('k3.d3.order'); await log('am Küchentisch die Nacht geordnet: Licht in Batos Kammer');
    await exit('door'); await at('skela_l'); await ask('bato', 'a3_lightroom'); await bye('(Gehen.)'); await note('a3_thrice'); await flag('k3.bato.slip'); await log('Bato: „Dreimal hat er geläutet, dann war Ruhe.“');
    await comb('a3_thrice', 'a3_slept', 'a3_awake'); await log('Widerspruch: Bato war wach');
    await talk('bato', 'Nach etwas aus dem Notizbuch', 'NOTE:a3_awake', 'Nach etwas aus dem Notizbuch', 'NOTE:a3_girl'); await bye('(Gehen.)'); await flag('k3.bato.uneasy'); await log('Bato wird unruhig: „Es war ein Soldat.“');
    await talk('zlata', '(Ihr sagen, dass Bato wach war.)', '(Mala fragen.)'); await bye('Danke.'); await flag('k3.asked.zlata_awake'); await log('über den Fluss Mala gefragt: zwei Finger, sie schüttelt den Kopf');
    await exit('to_bridge'); await flag('k3.z.deka'); await inv('deka'); await note('a3_fromzlata'); await log('Zlata: „Uzmite deku. Hladno je kod vode.“');
    await exit('exit_d'); await at('skela_d'); await act('use', '_mala', 'deka'); await note('a3_blanket'); await expectSaid('Ich war noch da'); await log('Mala liest die Decke: „Ich war noch da, Marko.“');
    await comb('a3_blanket', 'a3_fromzlata', 'l3_survived'); await log('Schluss: Sie hat den Fluss überlebt');
    await exit('to_bridge'); await exit('exit_l'); await ask('zlata', 'l3_survived'); await bye('Danke.'); await note('a3_alive'); await log('Zlata: „Ja. Im Schilf. Sie hat noch gelebt.“');
    await exit('to_bridge'); await exit('exit_d'); await at('skela_d');
    await go('bulevar'); await exit('to_vulk'); await at('vulkanizer');
    await talk('vlado', 'Ich war in Skela', 'NOTE:a3_girl', 'NOTE:a3_lightroom', 'NOTE:l3_survived'); await calm(); await flag('k3.v.part2'); await note('v3_sent'); await note('v3_two'); await log('Vlado, Teil 2: „Sie hat mich weggeschickt.“ – „Um zwei war ich wieder da.“');
    await comb('v3_sent', 'v3_mala_left', 'v3_who'); await log('Widerspruch: Wer hat wen stehen lassen?');
    await exit('yard_door'); await at('vhof'); await talk('_mala', 'Er sagt, du hast ihn weggeschickt'); await waitDlg('Ich frage dich'); await choose('Ich frage dich'); await calm();
    await flag('k3.d3.talk2'); await flag('k3.d3.talk2v', 'a'); await note('l3_rope'); await note('v3_message'); await log('Gespräch 2 „Wie Großmutter“: das Seil; „Ich frage dich, was ich damit machen soll.“');
    await exit('door'); await at('vulkanizer'); await talk('vlado', 'Ich soll Ihnen etwas sagen', '(Mala fragen.)', '(Ihm sagen', 'NOTE:v3_cab'); await calm();
    await flag('k3.v.free'); await note('v3_tonight'); await log('die Botschaft: „Dann fahr still.“ – „Woher …?“ – „Ich bin Übersetzer.“ Vlado fährt heute Nacht');
    await exit('door'); await go('zelenika'); await log('Haus Zelenika am Sonntag: Mate am Pfosten');
    await exit('house_door'); await at('zelenika_in'); await talk('davor', 'Darf ich die Briefe lesen'); await bye('(Gehen.)'); await note('b3_letters');
    await act('use', 'stairs'); await note('b3_kidsroom'); await act('open', 'drawer'); await note('b3_cards'); await note('b3_pencil'); await log('Mates Briefe, das Kinderzimmer von 1998, Lenas Postkarten mit „Dragi dida“');
    await comb('b3_letters', 'b3_kidsroom', 'b3_invite'); await comb('b3_cards', 'b3_pencil', 'b3_dida'); await log('Schlüsse: eine Einladung, die sich nicht traut; so wollte er heißen');
    await talk('davor', 'Kad ćete doći'); await calm(); await flag('k3.b.invite'); await at('zelenika'); await log('Davor hört die Einladung; Jela gibt nach');
    await talk('lena', 'Du wolltest deinem Großvater', 'Došli smo, dida'); await calm(); await flag('k3.b.son'); await log('„Došli smo, dida.“ – Mate: „Das ist Davor.“');
    await talk('lena', 'Stell dich ans Tor'); await calm(); await flag('k3.b.dead'); await log('der Schlüssel am Tor: „Ich bin nicht mehr da.“');
    await talk('jela', 'Zeigen Sie ihm'); await choose('Von unten nach oben'); await calm(); await bye('Hvala'); await flag('k3.b.figs'); await flag('k3.b.keyFree'); await log('die Feigen; der Schlüssel liegt in der Astgabel');
    await act('take', 'fork'); await inv('kljuc_mate'); await act('give', 'lena', 'kljuc_mate'); await flag('k3.b.keyLena'); await log('den Schlüssel bekommt die Kleinste');
    await expect((await st()).active === 'mala', 'Mala übernimmt'); await act('cross', 'mate'); await choose('(Ihre Hand nehmen.)'); await at('limbo'); await shot('limbo_mate');
    await act('use', 'prop'); await choose('Bitte einsteigen'); await flag('k3.b.limbo'); await log('Zwischenwelt: „Bitte einsteigen.“ – „Dreißig Jahre habe ich das gehört.“');
    await exit('arch'); await D.until(s => s.phase === 'k3_fin_n' || s.dlg, 90000, 'Davors Karte, Finale'); await flag('k3.b.done'); await inv('vizitka'); await log('Davor: „Falls Sie mal in München sind.“');
  });
  // ----------------------------------------------------------------------- Finale: Abfahrt, Glocke, Überfahrt, Zlata, Grab, Zwischenwelt
  part('finale', async () => {
    await D.until(s => s.phase === 'k3_fin_n', 90000, 'Finalnacht'); await calm(); await log('Tagesende: „Es ist bald elf.“ Karte „Finale – Die letzte Fähre“, Hof des Vulkanizers');
    if (await dlgHas('(Einsteigen.)')) { await choose('(Einsteigen.)'); await log('in Vlados TAM eingestiegen'); }
    await D.until(s => s.room === 'skela_d' || s.realRoom === 'skela_d', 90000, 'Ankunft in Skela'); await calm(); await flag('k3.fin.drive'); await flag('k3.fin.arrived'); await shot('fin_arrive'); await log('die Fahrt mit Vlado und Kata; Ankunft in Skela');
    await act('use', 'bell'); await flag('k3.fin.rung'); await flag('k3.fin.bato'); await flag('k3.fin.ferry', 'here'); await flag('k3.fin.cp', 1); await expect((await st()).active === 'mala', 'Mala gespielt');
    await log('Marko läutet; die Geisterfähre; Batos Erkenntnis: „Steig ein. Diesmal fahre ich.“ (Zwischenstand 1)');
    await act('look', 'landing'); await choose('(Einsteigen.)'); await flag('k3.fin.boarded'); await expect((await st()).active === 'marko', 'Marko gespielt'); await log('Mala steigt ein');
    await exit('to_bridge'); await at('skela_most'); await exit('exit_l'); await waitDlg('(Mala ansehen.)', 120000); await flag('k3.fin.crossed'); await note('l3_bells'); await flag('k3.fin.cp', 2); await shot('fin_story');
    await log('über die Brücke ans linke Ufer: „Darum die Glocken.“ – „Heute ist einer gekommen.“ (Zwischenstand 2); „Zvono.“; Zlatas Erzählung');
    await choose('(Mala ansehen.)'); await choose('(Schweigen.)'); await choose('Zlata. Bato war wach.'); await calm(); await flag('k3.fin.told'); await note('l3_oven'); await flag('k3.fin.free'); await flag('k3.fin.cp', 3);
    await log('„Bato war wach.“ – Erinnerung „Der Ofen“; die Leine löst sich (Zwischenstand 3)');
    await talk('_mala', 'Ich bringe dich nach Hause'); await expectSaid('Schon wieder.'); await choose('Was willst du?'); await waitDlg('Ja. Und wenn es zu schwer wird', 120000); await flag('k3.fin.ask'); await log('am Grab: „Schon wieder.“ – dann gefragt: „Was willst du?“');
    const QC = process.env.QA_CONSENT || 'b'; await choose({ a: 'Ja.', b: 'Ja. Und wenn es zu schwer wird', c: 'Frag mich in München' }[QC]); await waitDlg('(Ihre Hand nehmen.)', 120000); await flag('k3.fin.consent', QC); await flag('k3.fin.bond'); await flag('k3.fin.cp', 4); await log('Zustimmung b: „Beide.“; der neue Faden (Zwischenstand 4)');
    await choose('(Ihre Hand nehmen.)'); await at('limbo'); await shot('limbo_bato');
    await act('use', 'prop'); await flag('k3.a.limbo'); await expectSaid('Oprosti, mala.'); await log('Zwischenwelt: zusammen am Seil; „Oprosti, mala.“ – „Du bist gekommen. Nur später.“');
    await exit('arch'); await D.until(s => s.phase === 'k3_epi', 90000, 'Epilog'); await calm(); await at('herberge'); await flag('k3.e.call'); await log('Karte „Epilog – Hin und zurück“; Morgengrauen: „Teta Nada. Ich habe sie gefunden.“');
  });
  // ----------------------------------------------------------------------- Epilog: Brücke, Nada, zwei Mütter, Vermisstenstelle, Mutter, Bus
  part('epilog', async () => {
    await go('starimost'); await act('use', 'crest'); await D.until(s => s.phase === 'k3_epi_d' && (s.room === 'ostbus' || s.realRoom === 'ostbus'), 120000, 'Gegen Mittag');
    await calm(); await note('e3_since'); await flag('k3.e.bridge'); await flag('k3.e.nada'); await log('Mala auf dem Scheitel der Brücke: „Aber es ist meine.“; gegen Mittag kommt Nada');
    await go('skela', 'skela_d'); await exit('to_bridge'); await exit('exit_l'); await at('skela_l'); await log('mit Vlado und Nada nach Skela; „Sedamnaest godina. Svakog petnaestog.“');
    await exit('house_door'); await at('zlata_k'); await act('open', 'drawer'); await inv('brief1996'); await act('give', 'nada', 'brief1996'); await expectSaid('Sie haben geschrieben.'); await inv('skizzenbuch'); await log('Zlatas Brief von 1996 für Nada, das Skizzenbuch');
    await act('give', 'nada', 'skizzenbuch'); await waitDlg('(Mala fragen.)'); await choose('(Mala fragen.)'); await choose('Alles. Von Anfang an.'); await calm(); await flag('k3.e.mothers'); await log('die zwei Mütter: Marko erzählt alles; „Mama.“');
    if ((await room()) === 'zlata_k') await exit('door');
    await at('skela_l'); await exit('to_bridge'); await exit('exit_d'); await at('skela_d');
    await go('vermisst'); await talk('kolar', 'Ich möchte ein Grab anzeigen'); await flag('k3.e.report'); await log('Vermisstenstelle: Frau Kolar nimmt die Anzeige auf');
    await choose('Das Formular'); await inv('formular'); await choose('(Mala fragen.)'); await choose('eigenen Satz'); await flag('k3.e.form'); await note('e3_kolar'); await log('das Formular: „Dann brauche ich ein größeres Feld.“');
    if (process.env.QA_SAMPLE === 'no') { await choose('Heute nicht.'); await choose('Heute nicht.'); await flag('k3.e.sampleDone'); await note('e3_mothersample'); await expect(!(await D.flag('k3.e.sample')), 'keine Probe'); await log('Probe zweimal abgelehnt („Heute nicht.“); Kolar fragt nicht ein drittes Mal'); }
    else { await choose('(Eine Probe abgeben.)'); await flag('k3.e.sample'); await note('e3_mothersample'); await log('Probe für den Vater abgegeben; „Lebt Ihre Mutter?“'); }
    if (!(await dlgHas('telefonieren'))) { await bye('(Warten.)'); await act('talk', 'kolar'); }
    await choose('Ich muss telefonieren'); await calm(); await flag('k3.e.mother'); await log('der Anruf bei der Mutter: „Komm. Wir reden, wenn du hier bist.“');
    await bye('(Warten.)');
    await go('ostbus'); await D.ev(() => M.TA.act('use', 'bus')); await D.page.waitForTimeout(200);   // die Abfahrt endet im Abspann: hier nicht auf das Spiel warten
    for (let i = 0; i < 200; i++) { const s = await st(); if (s.screen === 'credits' || s.screen === 'title') break; if (s.dlg) await fail('unerwartete Auswahl bei der Abfahrt'); if (s.overlay === 'memory') { await D.ev(() => M.TA.closeOverlay()); await log('Erinnerungsbild „Im Bus nach Sarajevo“: Nada am Fenster, Mala neben ihr, Marko dahinter'); } await D.page.waitForTimeout(150); }
    await D.until(s => s.screen === 'credits' || s.screen === 'title', 90000, 'Abspann'); await flag('k3.e.bus'); await flag('k3.e.mother');
    await expect(await D.ev(() => M.GS.ended === true && !!localStorage.getItem('mala.c3end')), 'M.endChapter3: Kapitel beendet und gemerkt');
    await log('Ende des dritten Kapitels · Fortsetzung: München; Abspann');
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
    const errs = D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e)); console.log(errs.length ? 'FEHLER:\n' + errs.join('\n') : `DURCHLAUF KAPITEL 3 OK: ${step} Schritte in ${((Date.now() - t0) / 1000).toFixed(0)} s, keine JS-Fehler`);
    if (errs.length) process.exitCode = 1;
  } catch (e) { console.error('ABBRUCH in Abschnitt „' + section + '“ nach Schritt ' + step + ': ' + e.message); console.error(D.errors.slice(0, 8).join('\n')); await D.shot(path.join(SHOTS || DUMP || '.', 'w3_abbruch.png')).catch(() => {}); process.exitCode = 1; }
  return __ctx.done();
};
