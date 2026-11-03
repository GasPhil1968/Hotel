// Automatischer Komplett-Durchlauf von Kapitel 2 (Sarajevo): spielt die Musterlösung und prüft, ob es lösbar ist.
// node game/tools/walkthrough2.js [screenshot-ordner]      MALA_HTML=… für einen anderen Build, MALA_DUMPALL=ordner für Spielstände je Schritt
const { open } = require('./driver');
const SHOTS = process.argv[2] || null;
(async () => {
  const D = await open({ turbo: 25 });
  const t0 = Date.now(); let step = 0;
  const log = async (...a) => { console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] #${++step}`, ...a);
    if (process.env.MALA_DUMPALL) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); require('fs').writeFileSync(`${process.env.MALA_DUMPALL}/${String(step).padStart(2, '0')}.json`, JSON.stringify({ step, label: a.join(' '), GS: g })); } };
  const expect = async (cond, what) => { if (!cond) { const s = await D.st(); throw new Error('Erwartung verfehlt: ' + what + ' | ' + JSON.stringify(s)); } };
  const note = async (id) => expect(await D.hasNote(id), 'Notiz ' + id);
  const inv = async (id) => expect((await D.st()).inv.indexOf(id) >= 0, 'Gegenstand ' + id);
  const flag = async (k) => expect(await D.flag(k), 'Flag ' + k);
  const shot = async (n) => { if (SHOTS) await D.shot(`${SHOTS}/w2_${String(step).padStart(3, '0')}_${n}.png`); };
  const room = async () => (await D.st()).room;
  const phase = async () => (await D.st()).phase;
  const at = async (r) => expect(await room() === r, 'Raum ' + r + ' (ist ' + (await room()) + ')');
  // Gespräch: Hotspot ansprechen, dann Auswahl für Auswahl (Teilstrings); 'NOTE:id' wählt eine Notiz
  const talk = async (id, ...choices) => { await D.act('talk', id); await D.drain(); for (const c of choices) { if (c.startsWith('NOTE:')) { await D.pickNote(c.slice(5)); } else await D.choose(c); await D.drain(); } };
  const ask = async (id, noteId, bye) => talk(id, 'Nach etwas aus dem Notizbuch', 'NOTE:' + noteId, ...(bye ? [bye] : []));
  const comb = async (a, b, to) => { const r = await D.combine(a, b); await expect(r && r.ok, 'Schluss ' + a + '+' + b + ' → ' + to + ' | ' + JSON.stringify(r)); await note(to); };
  // Übersetzungsrätsel: Auswahl setzen, Prüfung des Spiels laufen lassen, schließen
  const solve = async (sel) => { await D.until(s => s.overlay === 'puzzle', 20000, 'Rätsel');
    await D.ev((v) => { const ov = M.E.overlay; ov.sel = v.slice(); const r = ov.data.check ? ov.data.check(ov.sel) : { ok: true }; if (!r.ok) throw new Error('Rätsel falsch gelöst: ' + JSON.stringify(r)); M.TA.closeOverlay(v.slice()); }, sel);
    await D.page.waitForTimeout(60); await D.drain(); };
  const mala = async () => D.switchTo('mala'); const marko = async () => D.switchTo('marko');
  const go = async (loc) => { if ((await room()) !== 'map') { throw new Error('nicht auf dem Stadtplan'); } await D.travel(loc); await D.drain(); };
  const toMap = async (exitId) => { await D.exit(exitId || 'exit'); await D.drain(); await at('map'); };
  try {
    if (process.env.MALA_NB) await D.ev((v) => M.E.setNbStyle(v), process.env.MALA_NB);
    // ================= PROLOG: die Linie Drei
    await D.ev(() => { M.E.setSlot(1); M.E.newGame(2); }); await D.drain(); await at('stanica'); await expect(await phase() === 'k2_pro', 'Prolog'); await note('p2_mala_gone'); await note('m2_split_register'); await log('Ankunft in Sarajevo'); await shot('arrive');
    await talk('senada', 'Einen Fahrschein'); await note('p2_km'); await log('Kune? Ne.');
    await D.act('talk', 'fikret'); await D.drain(); await D.choose('Was ist das für ein Brief'); await D.drain(); await solve([1, 1, 2, 1, 2]); await D.choose('Gute Geschäfte'); await D.drain(); await inv('km'); await flag('k2.p1.km'); await log('Fikrets Brief übersetzt, 10 KM');
    await talk('senada', 'Einen Fahrschein'); await inv('tramkarta'); await log('Fahrschein');
    await D.act('use', 'tram_stop'); await D.drain(); await at('tramvaj'); await shot('tram');
    await D.act('use', 'validator', 'tramkarta'); await D.drain(); await inv('tramkarta_v'); await flag('k2.p1.rode'); await log('entwertet, Fahrt');
    await D.exit('door'); await D.drain(); await at('carsija'); await log('Baščaršija'); await shot('carsija');
    await D.act('talk', 'malaBench'); await D.drain(); await note('p2_bench');
    await D.act('use', 'malaBench', 'tramkarta_v'); await D.drain(); await flag('k2.p2.back'); await note('m2_f_saturday'); await expect(await D.ev(() => M.GS.malaOn), 'Mala ist wieder da'); await log('Mala kommt mit (Splitter: Samstags)');
    await talk('rade', 'Ich suche Kovači', 'Auf Wiedersehen'); await note('p2_rade_ruza'); await log('Rade kennt Ruža');
    await toMap(); await go('pansion'); await at('pansion'); await shot('pansion');
    await talk('hajra', 'Kennen Sie diese Džezva', 'Danke, teta Hajra'); await note('p2_hajra'); await log('Ružas Džezva');
    await D.act('use', 'bed'); await D.drain(); await expect(await phase() === 'k2_pro_n', 'Nacht'); await flag('k2.pro.sing'); await log('Nacht: jemand singt');
    await toMap('door'); await go('carsija'); await D.exit('lane_kula'); await D.drain(); await at('kula'); await shot('kula_night');
    await talk('tomaz', 'Wie lange warten Sie schon', '(Schweigen.)'); await note('s1_tomaz'); await note('s1_curfew'); await flag('k2.pro.tomaz'); await log('Tomaž unter der Uhr');
    await D.exit('exit'); await D.drain(); await toMap(); await go('pansion'); await D.act('use', 'bed'); await D.drain(); await expect(await phase() === 'k2_s1', 'Fall 1'); await log('Erster Fall');
    // ================= FALL 1: Sieben am Turm
    await toMap('door'); await go('carsija'); await D.exit('lane_kula'); await D.drain(); await at('kula');
    await D.act('look', 'clock'); await D.drain(); await note('s1_clock'); await D.act('read', 'plaque'); await D.drain(); await note('s1_alaturka');
    await mala(); await D.act('look', 'tomaz'); await D.drain(); await note('s1_note'); await D.act('sense', 'tomaz'); await D.drain(); await note('s1_bracelet'); await marko(); await log('Zettel und Armband (Mala)');
    await comb('s1_note', 's1_alaturka', 's1_twosevens'); await log('Zwei Siebenen');
    await D.exit('kafana_door'); await D.drain(); await at('kafana'); await shot('kafana');
    await talk('emina', 'Erinnern Sie sich an den November', 'Danke.'); await flag('k2.s1.eminaAsked');
    await mala(); await D.act('listen', 'emina'); await D.drain(); await note('s1_waited'); await marko(); await log('Mala lauscht: Emina hat gewartet');
    await talk('lejla', 'Was ist mit Ihrer Großmutter', 'Was war früher die Kaserne', 'Was machen Sie, wenn', 'Zeigen Sie mir Ihren Brief'); await solve([1, 2, 1]); await D.choose('Bis später'); await D.drain(); await flag('k2.s1.letterFixed'); await note('s1_campus'); await note('s1_married'); await log('Lejlas Brief');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.exit('lane_kazan'); await D.drain(); await at('kazandziluk'); await shot('kazan');
    await talk('nedzad', 'Haben Sie dieses Armband'); await D.choose('Ich helfe Ihnen'); await D.drain(); await solve([1, 0, 1]); await D.choose('Danke, Nedžad'); await D.drain(); await flag('k2.s1.engraved');
    await D.act('read', 'workbench'); await D.drain(); await note('s1_date'); await note('s1_name'); await mala(); await D.act('sense', 'workbench'); await D.drain(); await note('s1_father'); await marko(); await log('Auftragsbuch 1972');
    await D.exit('exit'); await D.drain(); await toMap(); await go('ferhadija'); await D.exit('passage'); await D.drain(); await at('antikvarijat'); await shot('antik');
    await D.act('read', 'almanacs'); await D.drain(); await note('s1_sunset'); await comb('s1_twosevens', 's1_sunset', 's1_2316'); await log('Takvim: 23:16');
    await D.act('use', 'photobox'); await D.drain(); await inv('photo_stop'); await note('m2_photo'); await D.act('use', '_mala', 'photo_stop'); await D.drain(); await note('m2_f_voice'); await log('Foto der Haltestelle, Splitter');
    await D.exit('door'); await D.drain(); await toMap(); await go('carsija'); await D.exit('lane_kula'); await D.drain(); await D.exit('kafana_door'); await D.drain(); await at('kafana');
    await talk('sacir', 'Erinnern Sie sich an einen jungen Soldaten', 'Danke, Gospodine'); await note('s1_soldier'); await note('s1_closed');
    await comb('s1_closed', 's1_curfew', 's1_left'); await comb('s1_left', 's1_2316', 's1_missed'); await comb('s1_soldier', 's1_waited', 's1_both'); await log('Elf Minuten, beide haben gewartet');
    await ask('emina', 's1_missed', 'Danke.'); await note('s1_nowrite'); await log('„Warum hat er nie geschrieben?“');
    await talk('sacir', 'Hat der Soldat etwas dagelassen', 'Danke, Gospodine'); await note('s1_gave');
    await mala(); await D.exit('ostava_door'); await D.drain(); await at('ostava'); await D.act('sense', 'frame'); await D.drain(); await note('s1_hidden'); await D.exit('door'); await D.drain(); await at('kafana');
    await D.act('listen', 'emina'); await D.drain(); await note('s1_away'); await marko(); await log('Halid hat versteckt; Emina geht');
    await talk('lejla', 'Kommen Sie in die Kammer', 'Bis später'); await flag('k2.s1.ostavaOpen');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.exit('lane_kazan'); await D.drain(); await talk('nedzad', 'Können Sie mir etwas Schmales', 'Danke, Nedžad'); await inv('chisel'); await log('Stemmeisen');
    await D.exit('exit'); await D.drain(); await D.exit('lane_kula'); await D.drain(); await D.exit('kafana_door'); await D.drain(); await D.exit('ostava_door'); await D.drain(); await at('ostava'); await shot('ostava');
    await D.act('use', 'frame', 'chisel'); await D.drain(); await inv('letters_tz'); await inv('bracelet'); await log('Hinter dem Spiegel');
    await D.item('read', 'letters_tz'); await D.drain(); await solve([0, 0, 0, 0]); await note('s1_letters'); await comb('s1_letters', 's1_hidden', 's1_betrayal'); await log('Briefe übersetzt');
    await D.exit('door'); await D.drain(); await at('kafana'); await flag('k2.s1.eminaBack');
    await D.act('talk', 'emina'); await D.drain(); await D.pickNote('s1_missed'); await D.drain(); await D.pickNote('s1_betrayal'); await D.drain(); await flag('k2.s1.emina'); await expect(await phase() === 'k2_s1_n', 'Nacht unter der Uhr'); await at('kula'); await log('Emina überzeugt, Nacht'); await shot('kula_n');
    await D.act('talk', 'tomaz'); await D.drain(); await D.pickNote('s1_campus'); await D.drain(); await D.pickNote('s1_twosevens'); await D.drain(); await flag('k2.s1.free'); await log('Die Kula schlägt sieben, Erkenntnis');
    await expect((await D.st()).active === 'mala', 'Mala aktiv'); await D.act('cross', 'tomaz'); await D.drain(); await D.choose('Ihre Hand'); await D.drain(); await at('limbo'); await shot('limbo_tomaz');
    await D.act('use', 'prop'); await D.drain(); await D.choose('auf sieben'); await D.drain(); await D.exit('arch'); await D.drain(); await at('kula');
    await D.choose('Sie war da'); await D.drain(); await flag('k2.s1.done'); await note('m2_f_clock'); await log('Tomaž ist hinüber, Splitter: Uhr');
    await D.exit('exit'); await D.drain(); await toMap(); await go('pansion'); await D.act('use', 'bed'); await D.drain(); await expect(await phase() === 'k2_s2', 'Fall 2'); await log('Zweiter Fall');
    // ================= MALAS SPUR I
    await toMap('door'); await go('carsija'); await talk('rade', 'Ihm das Foto zeigen', 'Auf Wiedersehen'); await note('m2_clocktower'); await note('m2_kids'); await comb('m2_f_clock', 'm2_clocktower', 'm2_building'); await log('Das Siebener');
    await toMap(); await go('neboder'); await at('neboder'); await note('m2_marko7'); await shot('neboder');
    await mala(); await talk('alija', 'Was habe ich zuletzt', '(Gehen.)'); await note('m2_alija'); await marko(); await log('Alija: zwei Fahrscheine');
    await talk('_mala', 'Darf ich sehen, was in deiner Dose', 'Komm.'); await note('m2_ticket'); await comb('m2_kids', 'm2_marko7', 'm2_mali'); await log('Malas Fahrschein; ich war Mali');
    await toMap(); await go('carsija'); await talk('rade', 'Fuhren im November', 'Auf Wiedersehen'); await note('m2_notrams'); await comb('m2_ticket', 'm2_notrams', 'm2_promise');
    await D.act('talk', '_mala'); await D.drain(); await note('m2_f_ninth'); await log('Ein Versprechen; neunter Stock');
    // ================= FALL 2: Die Leihfrist
    await toMap(); await go('ferhadija'); await D.exit('passage'); await D.drain(); await at('antikvarijat');
    await talk('jakob', 'Was ist mit dem Buch in der Vitrine', 'Sie hatten einen Brief aus Frankfurt', 'Danke, Gospodine'); await note('s2_spook'); await note('s2_buyer');
    await mala(); await D.act('look', 'book'); await D.drain(); await note('s2_stamp'); await talk('ivan', 'Was lesen Sie', '(Schweigen.)'); await note('s2_due'); await marko(); await log('Der Leser im Sessel');
    await talk('jakob', 'Was wissen Sie über die Nationalbibliothek', 'Woher haben Sie das Buch', 'Danke, Gospodine'); await note('s2_fire'); await D.act('read', 'ledger'); await D.drain(); await note('s2_ledger');
    await comb('s2_stamp', 's2_ledger', 's2_provenance'); await comb('s2_due', 's2_fire', 's2_noreturn'); await log('Leser 2204');
    await D.exit('door'); await D.drain(); await toMap(); await go('pansion'); await D.act('use', 'phone'); await D.drain(); await D.choose('Petar'); await D.drain(); await D.choose('Er war nicht alt'); await D.drain(); await note('s2_relic'); await log('Petar in Wien');
    await toMap('door'); await go('obala'); await at('obala'); await shot('obala');
    await talk('milka', 'Kannten Sie Professor', 'Erinnern Sie sich an den August', 'Danke, Gospođa'); await note('s2_ash'); await comb('s2_ash', 's2_relic', 's2_fragments');
    await mala(); await D.act('sense', 'bridge_mid'); await D.drain(); await note('m2_f_snow'); await marko(); await log('Schwarzer Schnee');
    await talk('amra', 'Was machen Sie hier', 'Viel Glück'); await flag('k2.s2.amraAsk');
    await toMap(); await go('ferhadija'); await D.exit('passage'); await D.drain(); await talk('jakob', 'Kann ich Ihre Kurrent-Tafel', 'Das Buch gehört der Bibliothek', 'Danke, Gospodine'); await inv('kurrent'); await inv('rilke'); await log('Kurrent-Tafel und Buch');
    await D.exit('door'); await D.drain(); await toMap(); await go('obala');
    await talk('amra', 'Ich lese Kurrent'); await solve([1, 0, 0]); await D.choose('Viel Glück'); await D.drain(); await inv('pass');
    await D.act('talk', 'amra'); await D.drain(); await expect(await phase() === 'k2_s2_n', 'Abend an der Vijećnica'); await log('Passierschein, Abend');
    await talk('ilija', 'Ich möchte hinein', 'Ehrlich gesagt'); await D.exit('gate'); await D.drain(); await at('vijecnica'); await shot('vijecnica');
    await D.act('use', 'desk', 'rilke'); await D.drain(); await flag('k2.s2.line'); await D.act('use', 'desk', 'olovka'); await D.drain(); await flag('k2.s2.free'); await log('Vraćeno: Erkenntnis');
    await D.act('cross', 'ivan'); await D.drain(); await D.choose('Ihre Hand'); await D.drain(); await at('limbo'); await D.act('use', 'prop'); await D.drain(); await solve([1, 2, 1]); await D.exit('arch'); await D.drain();
    await expect(await phase() === 'k2_i', 'Zwischenspiel'); await at('vratnik'); await log('Ivan ist hinüber; Zwischenspiel'); await shot('vratnik');
    // ================= ZWISCHENSPIEL
    await D.act('use', 'bench'); await D.drain(); await D.choose('Ich erzähle dir von meinem Vater'); await D.drain(); await D.choose('Gehen wir weiter'); await D.drain(); await D.choose('Ich lasse ihn mir schicken'); await D.drain(); await flag('k2.i.done'); await log('Gelbe Bastei');
    await toMap(); await go('pansion'); await D.act('use', 'bed'); await D.drain(); await expect(await phase() === 'k2_s3', 'Fall 3'); await log('Dritter Fall');
    // ================= FALL 3: Das verschlossene Zimmer
    await D.act('use', 'phone'); await D.drain(); await D.choose('Sanja'); await D.drain(); await D.choose('im Regal liegt ein Foto'); await D.drain(); await D.choose('Ja.'); await D.drain(); await flag('k2.s3.called'); await log('Sanja schickt den Karton');
    await toMap('door'); await go('neboder'); await D.exit('haustor_door'); await D.drain(); await at('haustor'); await note('s3_dragica'); await shot('haustor');
    await talk('dragica', 'Wer wohnt hier noch', 'Was war im Keller', 'Kann ich das Hausbuch', 'Danke, teta Dragica'); await note('s3_zora');
    await D.act('read', 'housebook'); await D.drain(); await note('m2_housebook'); await comb('m2_split_register', 'm2_housebook', 'm2_lana'); await log('Lana Delić?');
    await mala(); await D.exit('shelter_door'); await D.drain(); await at('skloniste'); await talk('zora', 'Was wollen Sie ihnen geben', 'Wo sind die Zeugnisse', '(Schweigen.)'); await note('s3_stamp'); await note('s3_roll');
    await D.act('look', 'blackboard'); await D.drain(); await note('s3_board'); await comb('m2_split_chalk', 's3_board', 'm2_drewtrams'); await D.exit('exit'); await D.drain(); await at('haustor'); await log('Zora im Dunkeln');
    await D.act('listen', 'sehic_door'); await D.drain(); await note('s3_hanka'); await marko();
    await talk('sehic', 'Ich brauche den Schlüssel'); await D.choose('Nach etwas aus dem Notizbuch'); await D.drain(); await D.pickNote('s3_hanka'); await D.drain(); await D.choose('Sie haben den Keller zugesperrt'); await D.drain(); await D.choose('Auf Wiedersehen'); await D.drain(); await inv('key_shelter'); await log('Šehićs Schlüssel');
    await D.act('open', 'shelter_door'); await D.drain(); await flag('k2.s3.inShelter');
    await talk('mirza', 'Wie hat Zora die Kinder', 'Danke.'); await note('s3_bell');
    await mala(); await D.exit('shelter_door'); await D.drain(); await at('skloniste'); await marko(); await at('haustor');
    await D.act('push', 'bell_button'); await D.drain(); await flag('k2.s3.rang'); await mala(); await D.drain(); await note('s3_deskkey'); await log('Klingel oben, Schlüssel unten');
    await marko(); await D.exit('shelter_door'); await D.drain(); await at('skloniste'); await D.act('use', 'under_desk'); await D.drain(); await inv('deskkey'); await D.act('open', 'cabinet'); await D.drain(); await inv('dnevnik'); await inv('svjedocanstva');
    await D.item('read', 'dnevnik'); await D.drain(); await note('s3_guilt'); await note('m2_pupil'); await log('Klassenbuch');
    await D.exit('exit'); await D.drain(); await at('haustor');
    await talk('mirza', 'Zora wollte Zeugnisse'); await inv('pecat'); await D.choose('Nach etwas aus dem Notizbuch'); await D.drain(); await D.pickNote('s3_guilt'); await D.drain(); await D.choose('Kommen Sie heute Abend'); await D.drain(); await D.choose('Danke.'); await D.drain(); await flag('k2.s3.mirza'); await note('s3_rescued');
    await comb('s3_guilt', 's3_rescued', 's3_truth'); await log('Mirza: gerettet, nicht verschuldet');
    await talk('selma', 'Kann ich Ihnen helfen', 'Kommen Sie heute Abend'); await flag('k2.s3.selma'); await log('Selmas Kinderwagen');
    await D.exit('shelter_door'); await D.drain(); await D.act('use', 'desk', 'pecat'); await D.drain(); await flag('k2.s3.stamped'); await D.exit('exit'); await D.drain(); await log('gestempelt');
    await D.exit('exit'); await D.drain(); await toMap(); await go('carsija'); await talk('damir', 'Ihm das Klassenbuch zeigen'); await D.drain(); await flag('k2.s3.damir');
    await expect(await phase() === 'k2_s3_n', 'Nacht: die letzte Stunde'); await at('haustor'); await log('Damir kommt; Nacht'); await shot('haustor_n');
    await D.exit('shelter_door'); await D.drain(); await at('skloniste'); await D.act('use', 'desk', 'dnevnik'); await D.drain(); await flag('k2.s3.free'); await note('m2_lore'); await note('m2_lana_teacher'); await log('Prisutna. Erkenntnis.');
    await D.act('cross', 'zora'); await D.drain(); await D.choose('Ihre Hand'); await D.drain(); await at('limbo'); await D.act('use', 'prop'); await D.drain(); await D.exit('arch'); await D.drain(); await at('skloniste'); await flag('k2.s3.done'); await log('Zora ist hinüber');
    await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await toMap(); await go('pansion'); await D.act('use', 'bed'); await D.drain(); await expect(await phase() === 'k2_fin', 'Finale'); await log('Finale');
    // ================= FINALE: Malas Spur
    await D.act('use', 'socket', 'mobitel'); await D.drain(); await flag('k2.f2.charging'); await D.exit('door'); await D.drain(); await note('f2_parcel'); await log('SMS: Paket 4471');
    await toMap('door'); await go('stanica'); await talk('fadila', 'Ich möchte ein Paket'); await inv('karton'); await D.item('open', 'karton'); await D.drain(); await inv('photo_m'); await inv('ticket_m'); await log('Der Karton aus Split ist offen');
    await D.act('use', '_mala', 'ticket_m'); await D.drain(); await solve([1, 1]); await note('f2_photo'); await note('f2_memory'); await log('Die zwei Hälften. Lana.');
    await toMap(); await go('neboder'); await D.exit('haustor_door'); await D.drain(); await D.exit('stairs'); await D.drain(); await at('stan'); await shot('stan');
    await talk('nada', 'Darf ich Lanas Zimmer'); await D.choose('Danke, Frau Delić'); await D.drain(); await flag('k2.f2.lanaOpen');
    await D.act('read', 'postcard'); await D.drain(); await note('f2_postcard'); await talk('nada', 'Was ist mit Lana geschehen', 'Danke, Frau Delić'); await note('f2_missing'); await log('Lanas Zimmer, die Postkarte');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await toMap(); await go('pansion'); await talk('hajra', 'Haben Sie noch einen Schlüssel', 'Danke, teta Hajra'); await inv('key_kuca');
    await toMap('door'); await go('vratnik'); await D.act('open', 'ruza_gate'); await D.drain(); await at('kuca'); await shot('kuca');
    await mala(); await D.act('sense', 'stove'); await D.drain(); await note('f2_oven'); await marko(); await D.act('use', 'compartment', 'chisel'); await D.drain(); await inv('rcm');
    await D.item('read', 'rcm'); await D.drain(); await note('f2_rcm'); await comb('f2_rcm', 'f2_postcard', 'f2_cameback'); await comb('f2_cameback', 'm2_split_register', 'f2_whyabreise'); await log('Die Nachricht vom Roten Kreuz');
    await D.exit('door'); await D.drain(); await D.choose('Heute Nacht'); await D.drain(); await expect(await phase() === 'k2_fin_n', 'letzte Nacht'); await at('neboder'); await log('Die letzte Fahrt'); await shot('neboder_n');
    await talk('_mala', 'Gib mir deinen Fahrschein', 'Komm.'); await inv('ticket_l'); await D.act('use', 'tram_stop'); await D.drain(); await at('tramvaj');
    await D.act('use', 'validator', 'ticket_m'); await D.drain(); await D.act('use', 'validator', 'ticket_l'); await D.drain(); await D.choose('Ich bin nicht gekommen'); await D.drain(); await flag('k2.f2.rideEnd'); await log('Beide entwertet, Geständnis');
    await D.exit('door'); await D.drain(); await at('carsija'); await D.act('use', 'bench'); await D.drain(); await note('f2_bridge'); await expect(await phase() === 'k2_epi', 'Epilog'); await log('Die Leine zeigt nach Südwesten');
    // ================= EPILOG
    await D.exit('haustor_door'); await D.drain(); await D.exit('stairs'); await D.drain(); await at('stan'); await D.act('use', 'nada', 'rcm'); await D.drain(); await D.choose('Brücke'); await D.drain(); await flag('k2.epi.nada'); await log('Nada: Bring sie mir nach Hause');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await toMap(); await go('stanica'); await talk('fadila'); await D.choose('Hin und zurück'); await D.drain(); await inv('busticket2');
    await D.act('use', 'bus'); await D.drain(); await D.choose('Steigen wir ein'); await D.drain(); await D.until(s => s.screen === 'credits' || s.screen === 'title', 60000, 'Abspann'); await log('Abspann');
    const errs = D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e)); console.log(errs.length ? 'FEHLER:\n' + errs.join('\n') : 'DURCHLAUF KAPITEL 2 OK, keine JS-Fehler');
  } catch (e) { console.error('ABBRUCH:', e.message); const s = await D.st().catch(() => null); console.error('Zustand:', JSON.stringify(s)); console.error(D.errors.slice(0, 8).join('\n')); process.exitCode = 1; }
  await D.close2();
})();
