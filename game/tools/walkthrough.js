// Automatischer Komplett-Durchlauf: spielt das ganze Kapitel mit der Musterlösung durch und prüft, ob es lösbar ist.
// node game/tools/walkthrough.js [screenshot-ordner]
const { open } = require('./driver');
const SHOTS = process.argv[2] || null;
(async () => {
  const D = await open({ turbo: 25 });
  // MALA_LANG=bhs: das ganze Kapitel in der Sprachfassung spielen und jeden noch deutschen Text melden
  const LANG = process.env.MALA_LANG || null;
  if (LANG) await D.ev((l) => { M.setLang(l); M.trLogUI = true; M.trMiss = {}; M.trOverflow = {}; }, LANG);
  // MALA_TX=datei: jeder gesprochene Satz und jede Auswahl mit Sprecher, Angesprochenem, Original und Übersetzung (zum Gegenlesen)
  const TX = process.env.MALA_TX || null;
  if (TX) await D.ev(() => { window.__tx = []; const seen = new Set(), tr0 = M.tr;
    M.tr = function (s, ctx) { const r = tr0(s, ctx);
      try { if (s && ctx && ctx.log) { const who = String(ctx.who || '').replace(/^@/, ''), k = who + '|' + (ctx.to || '') + '|' + s;
        if (!seen.has(k)) { seen.add(k); window.__tx.push({ cat: ctx.cat || '', who, to: ctx.to || '', de: String(s), tr: String(r) }); } } } catch (e) {}
      return r; }; });
  const CAPS = process.env.MALA_CAPSPEECH || null;   // Ordner: erster Satz jeder Figur als Bild
  if (CAPS) await D.ev(() => { M.__caps = {}; });
  const t0 = Date.now(); let step = 0;
  // MALA_DUMPALL=ordner: legt nach jedem Schritt den Spielstand ab (für Vergleichsbilder und Tests)
  const log = async (...a) => { const gm = await D.ev(() => ((M.E.gt() - (M.__gt0 || 0)) / 60000).toFixed(1)); console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s | Spielzeit ${gm} min] #${++step}`, ...a);
    if (process.env.MALA_DUMPALL) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); require('fs').writeFileSync(`${process.env.MALA_DUMPALL}/${String(step).padStart(2, '0')}.json`, JSON.stringify({ step, label: a.join(' '), GS: g })); } };
  const expect = async (cond, what) => { if (!cond) { const s = await D.st(); throw new Error('Erwartung verfehlt: ' + what + ' | ' + JSON.stringify(s)); } };
  const note = async (id) => expect(await D.hasNote(id), 'Notiz ' + id);
  const inv = async (id) => expect((await D.st()).inv.indexOf(id) >= 0, 'Gegenstand ' + id);
  const flag = async (k) => expect(await D.flag(k), 'Flag ' + k);
  const shot = async (n) => { if (SHOTS) await D.shot(`${SHOTS}/wt_${String(step).padStart(3, '0')}_${n}.png`); };
  const talk = async (id, ...choices) => { await D.act('talk', id); await D.drain(); for (const c of choices) { await D.choose(c); await D.drain(); } };
  const room = async () => (await D.st()).room;
  try {
    // ================= PROLOG
    if (process.env.MALA_NB) await D.ev((v) => M.E.setNbStyle(v), process.env.MALA_NB);
    await D.ev(() => { M.__gt0 = M.E.gt(); M.E.setSlot(1); M.E.newGame(); }); await D.drain(); await log('Start', await room()); await shot('start');
    await D.act('use', 'answer'); await D.drain(); await note('pro_auftrag'); await note('pro_noone'); await log('Anrufbeantworter: Vesna und Sanja');
    await expect(await D.flag('met.sanja'), 'Sanja gilt als bekannt');
    await D.exit('door'); await D.drain(); await expect(await room() === 'flat', 'erst die Übersetzung');
    // Seite 31: Welche Leuchte? Die Antwort steht auf Seite 30
    await D.act('use', 'laptop'); await D.choose('Der letzte Satz'); await D.drain(); await note('pro_spia');
    await D.choose('fertig übersetzen'); await D.choose('rote Druckleuchte'); await D.drain(); await expect(!(await D.flag('pro.translated')), 'ohne Seite 30 nicht abschicken');
    await D.choose('Seite 30'); await D.drain(); await note('pro_red');
    await D.choose('fertig übersetzen'); await D.choose('rote Druckleuchte'); await D.drain(); await flag('pro.translated'); await flag('split.intro.desk');
    await expect((await D.flag('split.intro.translation')) === 'careful', 'sorgfältige Abgabe'); await log('Übersetzung abgegeben, Schwindel beim Aufstehen');
    await D.act('take', 'dzezva'); await D.act('use', 'sink', 'dzezva'); await D.act('use', 'stove', 'dzezvaW'); await D.drain(); await flag('pro.coffee'); await log('Kaffee');
    await D.act('take', 'photo'); await D.drain();
    await D.exit('door'); await D.drain(); await expect(await room() === 'map', 'Stadtplan'); await shot('map');
    await D.act('walk', 'loc_varos'); await D.drain(); await expect(await room() === 'map', 'erst Sanja, dann Varoš');
    await D.travel('bar'); await D.drain(); await log('Bar „Bura“ am Dienstag'); await shot('bar_pro');
    await D.act('talk', 'sanja'); await D.drain(); await expect(!(await D.flag('split.intro.sanja')), 'Sanja ist beschäftigt');
    await D.act('use', 'marko_table'); await D.drain(); await D.choose('Wörtlich'); await D.choose('Fest'); await D.choose('Ich bin Übersetzer'); await D.drain();
    await flag('split.intro.sanja'); await expect((await D.flag('split.intro.health')) === 'joke', 'Antwort auf Sanjas Frage'); await log('Sanjas Brief nach Triest'); await shot('bar_pro2');
    await D.exit('door'); await D.drain(); await D.travel('varos'); await D.drain(); await log('Varoš'); await shot('varos');
    await expect(!(await D.flag('split.intro.glimpse')), 'noch keine Erscheinung');
    await talk('zdenka', 'Wie war sie?', 'Hatte sie wirklich', 'Was hat sie den Tag', 'Kann ich mir die Wohnung', 'Ein paar Zeilen', 'Danke, Gospođa Zdenka');
    await inv('key_ivka'); await note('pro_knit'); await log('Schlüssel');
    await D.act('open', 'ivka_door'); await D.drain(); await expect(await room() === 'ivka', 'Ivkas Wohnung'); await shot('ivka');
    await D.act('open', 'shoebox'); await D.drain(); await expect(!(await D.st()).inv.includes('postcard'), 'Knoten hält');
    await D.act('take', 'basket'); await D.drain(); await inv('needle'); await D.act('use', 'shoebox', 'needle'); await D.drain(); await log('Knoten gelöst');
    await D.act('open', 'shoebox'); await D.drain(); await inv('postcard'); await note('c1_boat7');
    await D.act('take', 'photo_boat'); await D.drain(); await inv('photo1');
    await D.act('use', 'radio'); await D.drain(); await D.act('look', 'stove'); await D.drain();
    await D.exit('door'); await D.drain(); await expect(await room() === 'ivka', 'Tür: noch nichts, das von ihr erzählt');
    await D.act('read', 'basket'); await D.drain(); await note('pro_list'); await log('Ivkas Strickheft');
    await D.exit('door'); await D.drain(); await log('zurück', await room(), (await D.st()).phase);
    await talk('zdenka', 'Hier ist Ihr Schlüssel', 'Danke, Gospođa Zdenka'); await inv('key_ivka');
    await D.ev(() => { M.E.openNotes(); }); await D.page.waitForTimeout(150); await D.settle();
    const rows = await D.ev(() => { const s = {}; for (let p = 0; p < 4; p++) { for (let y = 0; y < 200; y += 2) for (let x = 0; x < 320; x += 2) { const h = M.uiHit(x, y); if (h && h.indexOf('n:') === 0) s[h] = 1; } } return Object.keys(s); });
    await D.ev(() => M.TA.closeOverlay()); await D.drain();
    await expect(rows.includes('n:pro_noone') && rows.includes('n:pro_list'), 'Notizbuch zeigt die Notiz der Stadt und das Strickheft zum Verbinden: ' + rows.join(','));
    let r0 = await D.combine('pro_noone', 'pro_knit'); await expect(!r0.ok, 'Zdenkas Wort allein reicht nicht');
    r0 = await D.combine('pro_noone', 'pro_list'); await expect(r0.ok, 'Kombination pro_people'); await note('pro_people');
    await talk('zdenka', 'In ihrem Heft stehen Namen', 'Hier ist Ihr Schlüssel'); await note('pro_gasse'); await expect(!(await D.st()).inv.includes('key_ivka'), 'Schlüssel zurück');
    await flag('split.intro.glimpse'); await expect((await D.st()).phase === 'pro_eve', 'Abend'); await log('Recherche, Erscheinung an der Kirchentreppe');
    await D.exit('exit'); await D.drain(); await D.act('walk', 'loc_flat'); await D.drain(); await expect(await room() === 'map', 'erst die Riva');
    await D.travel('riva'); await D.drain(); await D.ev(() => M.E.walkPlayerTo(600, 116)); await D.drain(); await D.page.waitForTimeout(300); await D.drain();
    await flag('split.intro.dizzy'); await expect(!(await D.flag('found.ivka')), 'Ivka noch nicht sichtbar'); await log('Schwindel am letzten Poller'); await shot('riva_pro');
    await D.exit('exit'); await D.drain(); await D.travel('flat'); await D.drain();
    await D.act('use', 'laptop'); await D.choose('Jeden Abend um sieben'); await D.choose('Familie hatte sie keine mehr'); await D.drain(); await flag('pro.article');
    await expect((await D.flag('leadKnit')) === 1, 'genaues Detail im Nachruf'); await log('Text geschrieben');
    await D.act('use', 'bed'); await D.drain(); await shot('night');
    await D.choose('Licht machen'); await D.drain(); await note('m_window'); await expect(!(await D.hasNote('m_find')), 'keine Prämisse in der Nacht');
    await expect((await D.st()).phase === 'c1', 'Fall 1 begonnen'); await log('Nacht mit Mala, Fall 1');
    // ================= FALL 1
    await flag('mala.voice'); await D.act('look', 'window'); await D.drain(); await note('m_tram'); await D.act('use', 'window'); await D.drain(); await log('Straßenbahn auf der Scheibe'); await shot('c1_flat');
    // das erste lange Kennenlernen, in der Wohnung: Tür, um sie herumgehen, ein Glas Wasser, dann die Fragen
    await D.exit('door'); await D.drain(); await expect(await room() === 'flat', 'Kennenlernen statt Gehen'); await flag('split.intro.meet'); await expect(!(await D.flag('mala.voice')), 'jetzt eine Gestalt');
    await D.exit('door'); await D.drain(); await flag('split.intro.door');
    await D.act('look', '_mala'); await D.drain(); await flag('split.intro.round');
    await D.act('take', 'glasses'); await D.drain(); await inv('glass'); await D.act('use', 'sink', 'glass'); await D.drain(); await inv('glassW');
    await D.act('use', '_mala', 'glassW'); await D.choose('Wer bist du?'); await expect(!(await D.ev(() => M.uiHit(20, 170) === 'sw')), 'kein Wechselknopf, solange der Wechsel gesperrt ist'); await D.choose('Was kannst du'); await D.choose('Seit wann'); await D.choose('Genug für heute'); await D.choose('In der Bar'); await D.choose('An der Riva'); await D.drain();
    await flag('split.intro.met'); await flag('split.intro.glass'); await note('m_name'); await note('m_first'); await expect(!(await D.flag('mala.unknown')), 'Name bekannt');
    await expect(!(await D.ev(() => M.E.canSwitch())), 'Wechsel erst nach dem Praxistest'); await log('Kennenlernen in der Wohnung'); await shot('c1_meet');
    await D.exit('door'); await D.drain(); await expect(await room() === 'map', 'jetzt geht er'); await D.travel('riva'); await log('Riva');
    await D.ev(() => M.E.walkPlayerTo(560, 116)); await D.drain(); await D.page.waitForTimeout(300); await D.choose('Nicht hinsehen'); await D.drain();
    await flag('c1.met'); await expect((await D.st()).dlg === null, 'kein Dialog'); await expect(!(await D.ev(() => M.E.canSwitch())), 'noch kein Wechsel'); await log('Begegnung mit Ivka'); await shot('riva_meet');
    await talk('ivka', 'Welches Boot', 'Welcher Tag', 'Das Boot ist spät', 'Ich gehe ein Stück'); await note('c1_askoffice');
    await D.exit('office_door'); await D.drain(); await expect(await room() === 'office', 'Hafenbüro'); await shot('office');
    await talk('mladen', 'Frage zu einer Fähre', 'Für einen Text', 'Dann sieh nach', 'Danke. Laku'); await flag('c1.searched'); await flag('mk.test');
    await expect(await D.ev(() => M.E.canSwitch()), 'Wechsel möglich'); await expect(!(await D.hasNote('m_voice')), 'keine zweite Vorstellung'); await log('Praxistest: Marko lässt sie nachsehen'); await shot('office_test');
    await D.switchTo('mala'); await D.exit('archive_door'); await D.drain(); await expect(await room() === 'archive', 'Archiv'); await shot('archive');
    await D.act('look', 'binder_1948'); await D.drain(); await expect(!(await D.hasNote('c1_1948')), 'Schild ausgeblichen: Ansehen reicht nicht'); await D.act('sense', 'binder_1948'); await D.drain(); await note('c1_1948'); await D.exit('door'); await D.drain(); await D.switchTo('marko'); await log('1948 gefunden');
    await talk('mladen', 'Schauen Sie mal', 'Danke. Laku'); await flag('c1.logRead'); await note('c1_ferry'); await log('Fahrtenbuch');
    let r = await D.combine('c1_boat7', 'c1_ferry'); await expect(r.ok, 'Kombination c1_came'); await note('c1_came');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('matejuska'); await log('Matejuška'); await shot('matejuska');
    await D.act('use', 'dinko', 'photo1'); await D.drain(); await note('c1_brother');
    await D.switchTo('mala'); await D.exit('shed_door'); await D.drain(); await expect(await room() === 'shed', 'Schuppen'); await shot('shed');
    await D.act('sense', 'seabag'); await D.drain(); await note('c1_words'); await D.exit('door'); await D.drain(); await D.switchTo('marko'); await log('Seesack');
    await talk('dinko', 'Ich weiß, was Tonći', 'Ivka wartet noch'); await flag('c1.dinkoTold'); await inv('gloves'); await inv('letter_t'); await log('Dinkos Geständnis');
    await D.act('use', '_mala', 'letter_t'); await D.drain(); await expect(!(await D.hasNote('c1_letter')), 'Brief noch zu');
    await D.item('read', 'letter_t'); await D.drain(); await note('c1_stuck'); await log('Brief klebt');
    await D.exit('exit'); await D.drain(); await D.travel('flat'); await D.drain(); await expect(await room() === 'flat', 'Wohnung');
    await D.act('use', 'stove', 'letter_t'); await D.drain(); await expect(!(await D.flag('c1.letterOpen')), 'nicht über der Flamme');
    await D.act('take', 'dzezva'); await D.act('use', 'sink', 'dzezva'); await D.act('use', 'stove', 'dzezvaW'); await D.drain(); await D.act('use', 'stove', 'letter_t'); await D.drain(); await flag('c1.letterOpen'); await log('Brief über Dampf geöffnet');
    await D.act('use', '_mala', 'letter_t'); await D.drain(); await note('c1_letter'); await log('Mala liest den Brief');
    await D.exit('door'); await D.drain(); await D.travel('sustipan'); await D.act('look', 'plaque'); await D.drain(); await note('c1_plaque'); await shot('sustipan1');
    await D.exit('exit'); await D.drain(); await D.travel('riva'); await D.ev(() => M.E.walkPlayerTo(560, 116)); await D.drain();
    await D.switchTo('mala'); await D.act('sense', 'bollard'); await D.drain(); await note('c1_years'); await D.act('talk', 'ivka'); await D.drain(); await note('m_mother'); await D.switchTo('marko'); await log('Mala an der Mole');
    if (process.env.MALA_PRESET) { const g = await D.ev(() => { M.saveGame(); return JSON.parse(JSON.stringify(M.GS)); }); require('fs').writeFileSync(process.env.MALA_PRESET, JSON.stringify(g)); console.log('Spielstand gespeichert:', process.env.MALA_PRESET); await D.close2(); process.exit(0); }
    if (process.env.MALA_DUMPS) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); require('fs').writeFileSync(process.env.MALA_DUMPS + '/ivka.json', JSON.stringify(g)); }
    await D.act('use', 'ivka', 'letter_t'); await D.drain();
    await D.pickNote('c1_ferry'); await D.drain(); await D.pickNote('c1_came'); await D.drain();
    await D.choose('Brief vorlesen'); await D.drain(); await D.choose('Handschuhe'); await D.drain(); await D.choose('nicht mehr hier'); await D.drain();
    await flag('c1.release'); await expect((await D.st()).active === 'mala', 'Mala aktiv'); await log('Ivka erkennt, dass sie tot ist'); await shot('ivka_release');
    await inv('gloves'); await D.act('cross', 'ivka'); await D.drain(); await D.choose('Ihre Hand nehmen'); await D.drain(); await expect(await room() === 'limbo', 'Zwischenwelt'); await shot('limbo_ivka');
    await D.exit('arch'); await D.drain(); await expect(await room() === 'limbo', 'noch nicht zurück');
    await talk('ghost', 'Was sehen Sie im Licht', '(Schweigen.)'); await D.act('use', 'ghost', 'gloves'); await D.drain(); await flag('c1.done'); await log('Ivka geht ins Licht, mit den Handschuhen'); await shot('limbo_ivka2');
    await D.exit('arch'); await D.drain(); await D.until(s => s.phase === 'i1m' && s.room === 'flat' && !s.busy && !s.card, 90000, 'Morgen'); await D.drain(); await log('Heimweg, Schlaf, Donnerstagmorgen'); await shot('i1m_flat');
    // allein: keine Mala, kein Wechsel, keine Geisterzeile
    const away = async (what) => { const g = await D.ev(() => ({ on: M.GS.malaOn, sw: M.E.canSwitch(), away: !!M.GS.flags['split.afterIvka.away'], mala: !!M.ACT.mala })); await expect(!g.on && !g.sw && g.away && !g.mala, 'Mala abwesend: ' + what + ' ' + JSON.stringify(g)); };
    await away('Aufwachen'); await expect(!(await D.st()).inv.includes('gloves'), 'Handschuhe sind drüben geblieben'); await flag('split.afterIvka.wake');
    const g0 = await D.ev(() => M.E.gSuppressed || 0);
    await D.act('look', 'deskglass'); await D.drain(); await D.act('take', 'deskglass'); await D.drain(); await flag('split.afterIvka.glass');
    await D.act('use', 'laptop'); await D.choose('Mail aus Graz'); await D.drain(); await D.choose('Nachruf noch einmal'); await D.drain(); await D.choose('Zuklappen'); await D.drain();
    await D.ev(() => { M.E.openNotes(); }); await D.page.waitForTimeout(200); await D.settle(); await D.ev(() => M.TA.closeOverlay()); await D.drain(); await flag('split.afterIvka.notes');
    await D.ev(() => M.E.switchChar()); await away('Tab/M');
    await D.ev(() => M.saveGame()); await D.ev(() => M.loadGame(1)); await D.drain(); await away('Speichern und Laden');
    await D.exit('door'); await D.drain(); await D.travel('riva'); await D.drain(); await D.act('look', 'mole'); await D.drain(); await D.act('use', 'bench'); await D.drain(); await away('Riva');
    await D.exit('exit'); await D.drain(); await D.travel('bar'); await D.drain(); await flag('split.afterIvka.bar'); await away('Bura vor dem Tisch'); await log('Bura am Morgen'); await shot('i1m_bar');
    await expect((await D.ev(() => M.E.gSuppressed || 0)) === g0, 'keine Geisterzeile in der Solophase');
    await D.act('use', 'marko_table'); await D.choose('Dann zeig mir'); await D.drain(); await flag('split.afterIvka.back'); await expect(await D.ev(() => M.E.canSwitch()), 'Wechsel wieder möglich'); await shot('i1m_return');
    await talk('sanja', 'Danke für den Kaffee'); await expect(!(await D.flag('split.afterIvka.verified')), 'ohne Zettel keine Frage');
    await D.switchTo('mala'); await D.act('look', 'note'); await D.drain(); await note('i1_note'); await D.switchTo('marko'); await log('Mala liest Sanjas Zettel');
    await talk('sanja', 'Du machst am Montag zu', 'Gute Augen'); await flag('split.afterIvka.verified'); await log('Sanja bestätigt den Zettel');
    await D.exit('door'); await D.drain(); await D.travel('riva'); await D.drain();
    await D.act('use', 'bench'); await D.choose('Was ist in der Dose'); await D.choose('Gehen wir'); await D.choose('Hier ist das Meer'); await D.choose('Was soll ich da'); await D.choose('Gib mir noch einen Tag'); await D.drain();
    await expect(!(await D.flag('mk.accept')), 'noch keine Zusage'); await D.act('use', 'bench'); await D.choose('Ich weiß immer noch nicht'); await D.drain();
    await flag('mk.accept'); await note('m_tin'); await expect((await D.flag('i1.answer')) === 0 && (await D.flag('i1.sarajevo')) === 0, 'Entscheidungen gespeichert');
    await expect((await D.st()).phase === 'c2', 'Fall 2'); await log('Bank am Morgen → Fall 2', await room()); await shot('c2_riva');
    await D.exit('exit'); await D.drain(); await D.travel('bar'); await D.drain(); await shot('bar');
    // ================= FALL 2
    await talk('sanja', 'Was ist mit der alten Ledana', 'Danke für den Kaffee'); await note('c2_demolish');
    await D.act('talk', 'stipe'); await D.drain(); await note('c2_boy');
    await D.act('take', 'newspaper'); await D.drain(); await inv('newspaper');
    await D.exit('door'); await D.travel('matejuska');
    await talk('dinko', 'Brecheisen', 'Für die alte Ledana', 'Danke, Dinko'); await inv('crowbar'); await log('Brecheisen');
    await D.switchTo('mala'); await D.act('look', 'crates'); await D.drain(); await note('c2_gap'); await D.switchTo('marko');
    await D.act('push', 'crates'); await D.drain(); await D.exit('gap'); await D.drain(); await expect(await room() === 'ledana', 'Ledana'); await log('Ledana'); await shot('ledana');
    await D.switchTo('mala'); await talk('luka', 'Worauf wartest du', 'Welcher Tag', 'Warum bist du hier oben', 'Wie sagt ihr euch', 'Da unten ist jemand', 'Ich lasse dich');
    await note('c2_meet'); await note('c2_mailbox'); await flag('found.luka'); await log('Luka gefunden');
    await D.act('look', 'brick'); await D.drain(); await note('c2_paper');
    await D.exit('colddoor'); await D.drain(); await expect(await room() === 'coldroom', 'Kühlraum (Mala)'); await D.act('sense', 'debris'); await D.drain(); await note('c2_under'); await D.exit('door'); await D.drain(); await D.switchTo('marko');
    await D.act('use', 'colddoor', 'crowbar'); await D.drain(); await D.exit('colddoor'); await D.drain(); await expect(await room() === 'coldroom', 'Kühlraum'); await note('c2_dark'); await shot('coldroom');
    await D.act('use', 'debris', 'crowbar'); await D.drain(); await expect(await D.ev(() => !!M.RS('coldroom').caseOut), 'Koffer ausgegraben');
    await D.act('open', 'case'); await D.drain(); await inv('tickets'); await inv('cassette'); await D.exit('door'); await D.drain(); await log('im Dunkeln: Koffer ausgegraben, Tickets und Kassette');
    await D.act('use', 'brick', 'crowbar'); await D.drain(); await note('c2_thin');
    await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('bar');
    await talk('sanja', 'Luka. Luka und Nina', 'Wo finde ich Nina', 'Wer war damals', 'Danke für den Kaffee'); await note('c2_shop'); await log('Sanja erzählt');
    await D.exit('door'); await D.travel('oldtown'); await log('Peristil'); await shot('oldtown');
    await D.exit('shop_door'); await D.drain(); await expect(await room() === 'shop', 'Laden'); await shot('shop');
    await talk('nina', 'Spachtel', 'Danke. Auf Wiedersehen'); await inv('spatula');
    await D.switchTo('mala'); await D.exit('private'); await D.drain(); await expect(await room() === 'backroom', 'Hinterzimmer'); await shot('backroom');
    await D.act('look', 'ticket'); await D.drain(); await D.act('sense', 'ticket'); await D.drain(); await note('c2_unused'); await note('c2_echo'); await D.exit('door'); await D.drain(); await D.switchTo('marko');
    r = await D.combine('c2_unused', 'c2_meet'); await expect(r.ok, 'Kombination c2_waited'); await log('Nina hat gewartet');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('varos');
    await talk('zdenka', 'Zeitung mitgebracht', 'Bis bald'); await inv('radio'); await log('Radio');
    await D.travel('terminal'); await shot('terminal');
    await talk('mira', 'Batterien', 'Erinnern Sie sich', 'Danke, Gospođa Mira'); await inv('batteries'); await note('c2_mira1');
    await D.item('use', 'radio', 'batteries'); await D.drain(); await inv('radioB'); await D.item('use', 'radioB', 'cassette'); await D.drain(); await inv('radioT'); await log('Radio mit Kassette');
    await D.exit('exit'); await D.drain(); await D.travel('matejuska'); await D.exit('gap'); await D.drain();
    await D.act('use', 'brick', 'spatula'); await D.drain(); await inv('note_n'); await note('c2_note'); await log('Ninas Zettel');
    await talk('luka', 'Briefkasten aufgemacht', 'Bis später'); await flag('c2.lukaKnows'); await log('Luka bittet um das Lied');
    await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('oldtown'); await D.exit('shop_door'); await D.drain();
    await talk('nina', 'Ich war in der Ledana', 'Ninas Zettel', 'Er hat es mir gesagt', 'Lukas Tickets', 'Die Kassette', 'Wollen Sie es hören');
    await expect(!(await D.flag('c2.tonight')), 'Nina will zuerst nicht an die Rampe'); await D.pickNote('c2_mira1'); await D.drain(); await D.choose('Dann bin ich da'); await D.drain();
    await D.drain(); await flag('c2.tonight'); await expect((await D.st()).phase === 'c2_night', 'Abend'); await expect(await room() === 'ledana', 'Ledana nachts'); await log('Abend an der Ledana'); await shot('ledana_night');
    if (process.env.MALA_DUMPS) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); require('fs').writeFileSync(process.env.MALA_DUMPS + '/luka.json', JSON.stringify(g)); }
    await D.act('use', 'nina', 'radioT'); await D.drain(); await flag('c2.release'); await expect((await D.st()).active === 'mala', 'Mala aktiv'); await log('Luka erkennt, dass er tot ist'); await shot('luka_release');
    await D.act('cross', 'luka'); await D.drain(); await expect(await room() === 'limbo', 'Zwischenwelt (Luka)'); await shot('limbo_luka');
    await D.act('use', 'ghost_l', 'tickets'); await D.drain(); await flag('c2.done'); await inv('ticket_n'); await log('Luka nimmt ein Ticket mit');
    await D.exit('arch'); await D.drain(); await expect(await room() === 'ledana', 'zurück an der Rampe');
    await D.act('use', 'nina', 'ticket_n'); await D.drain(); await log('Nina bekommt ihr Ticket'); await shot('sustipan');
    await D.choose('Meine Großmutter'); await D.drain(); await D.choose('Hast du jemanden'); await D.drain(); await D.choose('Gehen wir nach Hause'); await D.drain();
    await expect((await D.st()).phase === 'c3', 'Fall 3'); await flag('c3.call'); await log('Fall 3', await room());
    // ================= FALL 3
    await D.exit('door'); await D.travel('palma'); await shot('palma');
    await talk('ljerka', 'Was soll ich übersetzen', 'Ihr Vater', 'Was ist oben', 'Danke. Ich fange an'); await inv('documents');
    await D.act('use', 'reading_table'); await D.drain(); await flag('c3.read'); await expect((await D.st()).phase === 'c3_night', 'Nacht im Hotel'); await log('Übersetzt, Nacht');
    await D.act('read', 'register'); await D.drain(); await note('m_register');
    await D.switchTo('mala'); await D.act('sense', 'lodge'); await D.drain(); await flag('found.bruno');
    await talk('bruno', 'Was siehst du', '(Gehen.)'); await note('m_31'); await D.switchTo('marko'); await log('Bruno gefunden'); await shot('palma_night');
    await talk('bruno', 'Schlüssel für den Salon', 'Was ist oben im Salon', 'Laku noć');
    await D.act('use', 'coat13'); await D.drain(); await inv('keyring');
    await D.act('take', 'phonebook'); await D.drain(); await inv('crank');
    await D.act('take', 'photo_dance'); await D.drain(); await inv('photo2');
    await D.act('use', 'bruno', 'photo2'); await D.drain(); await note('c3_sunday'); await log('Bruno: Danica');
    await D.exit('stairs'); await D.drain(); await expect(await room() === 'salon', 'Salon'); await shot('salon');
    await D.act('take', 'sheet'); await D.drain(); await D.act('take', 'piano'); await D.drain(); await inv('musicbook');
    await D.act('open', 'cabinet'); await D.drain(); await inv('record');
    await D.act('use', 'gramophone', 'crank'); await D.drain(); await D.act('use', 'gramophone', 'record'); await D.drain(); await flag('c3.brunoUp'); await log('Musik');
    await D.act('use', 'bench', 'keyring'); await D.drain(); await inv('envelope'); await inv('brunoletter');
    await D.act('use', 'bruno', 'musicbook'); await D.drain(); await D.act('use', 'bruno', 'envelope'); await D.drain();
    await expect((await D.ev(() => M.GS.flags['c3.lvl'])) >= 3, 'Bruno Stufe 3');
    await D.act('talk', 'bruno'); await D.drain(); await D.choose('übersetzen'); await D.drain();
    await D.until(s => s.overlay === 'puzzle', 20000, 'Brunos Rätsel'); for (let i = 0; i < 50 && !(await D.ev(() => !!(M.E.overlay && M.E.overlay.sel))); i++) await D.page.waitForTimeout(40);
    await expect(await D.ev(() => M.E.overlay && M.E.overlay.sel.every(v => v === -1)), 'Brunos Felder beginnen leer');
    await D.ev(() => { const ov = M.E.overlay, r = ov.data.check([0, 0, 0, 0, 0]); if (r.ok) throw new Error('erste Fassungen sind nicht die Lösung'); const s2 = [1, 2, 0, 1, 2]; if (!ov.data.check(s2).ok) throw new Error('Lösung falsch'); M.TA.closeOverlay(s2); });
    await D.drain(); await D.choose('Laku noć'); await D.drain(); await flag('c3.translated'); await log('Satz übersetzt');
    r = await D.combine('c3_zagreb', 'c3_accept'); await expect(r.ok, 'Kombination c3_hid');
    await D.exit('door'); await D.drain(); await expect(await room() === 'palma', 'Halle');
    if (process.env.MALA_DUMPS) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); require('fs').writeFileSync(process.env.MALA_DUMPS + '/bruno.json', JSON.stringify(g)); }
    await D.act('use', 'private'); await D.drain(); await D.choose('Umschlag'); await D.drain(); await D.choose('Brunos Brief'); await D.drain(); await D.choose('Satz sagen'); await D.drain(); await D.choose('Übersetzer'); await D.drain();
    await D.choose('nicht verzeihen'); await D.drain(); await expect((await D.flag('c3.ljerkaLoss')) === 'free', 'Ljerka: eigener Moment für das, was sie verloren hat');
    await flag('c3.release'); await expect((await D.st()).active === 'mala', 'Mala aktiv'); await log('Bruno erkennt, dass er tot ist'); await shot('bruno_release');
    await D.act('cross', 'bruno'); await D.drain(); await expect(await room() === 'limbo', 'Zwischenwelt (Bruno)'); await shot('limbo_bruno');
    await talk('ghost_b', 'Wer löst Sie ab', '(Schweigen.)'); await D.act('use', 'prop'); await D.drain(); await flag('c3.gone'); await log('Die Glocke um sieben');
    await D.exit('arch'); await D.drain();
    await flag('c3.done'); await expect((await D.st()).phase === 'epi', 'Epilog'); await log('Ljerka spielt, Epilog'); await shot('epi');
    // ================= EPILOG
    await D.act('use', 'ticket_counter'); await D.drain(); await D.choose('Nur hin'); await D.drain(); await inv('busticket'); await flag('epi.mala');
    await D.act('use', 'bus'); await D.drain(); await D.choose('Warst du im Hotel'); await D.drain(); await D.choose('Kommst du mit'); await D.drain(); await D.until(s => s.dlg, 20000, 'letzte Auswahl'); await D.ev(() => M.TA.choose('Es ist Zeit'));
    for (let i = 0; i < 400; i++) { const s = await D.st(); if (s.screen === 'credits' || s.screen === 'title') break; if (s.overlay && s.overlay !== 'notebook') await D.ev(() => M.TA.closeOverlay()); if (s.card) await D.ev(() => M.TA.skip()); await D.page.waitForTimeout(100); }
    await D.until(s => s.screen === 'credits' || s.screen === 'title', 60000, 'Abspann');
    await log('ENDE erreicht:', (await D.st()).screen, 'Spielzeit (Spieluhr, beschleunigt):', await D.ev(() => Math.round(M.GS.playMs / 1000)) + 's');
    console.log('Spieltakt der Musterlösung (ohne Umwege, Pflichtdialoge in Normaltempo, inkl. Wartezeiten des Testtreibers): ' + (await D.ev(() => M.E.gt() - (M.__gt0 || 0)) / 60000).toFixed(1) + ' min');
    if (LANG) { const miss = await D.ev(() => M.trMiss); const ks = Object.keys(miss);
      console.log('Sprachfassung ' + LANG + ': ' + ks.length + ' angezeigte Texte ohne Übersetzung');
      ks.slice(0, 400).forEach(k => console.log('  [' + miss[k] + '] ' + k)); if (ks.length) process.exitCode = 3;
      const ov = await D.ev(() => M.trOverflow || {}); const ok2 = Object.keys(ov); console.log('Texte, die aus dem Bild laufen: ' + ok2.length); ok2.slice(0, 50).forEach(k => console.log('  [' + ov[k] + '] ' + k)); }
    if (TX) { const tx = await D.ev(() => window.__tx || []);
      require('fs').writeFileSync(TX, tx.map(e => `[${e.cat} ${e.who}${e.to ? '→' + e.to : ''}] ${e.tr}\n    DE: ${e.de}`).join('\n') + '\n');
      console.log('Transkript: ' + tx.length + ' Sätze in ' + TX); }
    if (CAPS) { const caps = await D.ev(() => M.__caps || {}); const fs2 = require('fs'); fs2.mkdirSync(CAPS, { recursive: true });
      Object.keys(caps).forEach(k => { if (typeof caps[k] === 'string' && caps[k].startsWith('data:image/png;base64,')) fs2.writeFileSync(CAPS + '/' + k + '.png', Buffer.from(caps[k].split(',')[1], 'base64')); });
      console.log('Sprecherbilder: ' + Object.keys(caps).join(', ')); }
    console.log('DURCHLAUF OK');
  } catch (e) { console.log('FEHLER bei Schritt', step, e.message); try { await D.shot((SHOTS || '/tmp') + '/wt_error.png'); } catch (_) {} }
  console.log(D.errors.length ? 'JS-FEHLER:\n' + D.errors.slice(0, 8).join('\n') : 'keine JS-Fehler');
  await D.close2();
})();
