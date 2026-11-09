// QA-Kopie von game/tools/walkthrough5.js als ladbares Modul für qa/sim.js (Start über das Titelmenü, Kapitel 5 mit Vorgaben). Spielerhandlungen unverändert.
// Automatischer Komplett-Durchlauf von Kapitel 5 (Sarajevo, „Angekommen“): von „Neues Spiel Kapitel 5“ (M.E.newGame(5)) bis zum Abspann,
// nur mit Spielerhandlungen: Reisen über den Stadtplan (M.TA.travel), Ausgänge, Gespräche mit den sichtbaren Auswahltexten, Ansehen/Benutzen/Geben,
// Notizen verbinden (M.TA.combine), Wechsel zu Mala (M.TA.switchTo), Malas Verben (Spüre, Zeichne, Hinüberbringen), Rätsel, Dokumente schließen.
// Kein gesetzter Schalter, keine gesetzte Notiz. Ohne Stand aus Kapitel 4 (localStorage leer): Vorgaben des Gerüsts (Zustimmung b, Versprechen a, Probe ja).
//   node game/tools/walkthrough5.js [screenshot-ordner]
//   MALA_HTML=<build>/index.html   anderer Bau
//   MALA_DUMPALL=<ordner>          Spielstand nach jedem Schritt (für hintcheck.js)
//   MALA_TRACE=1                   jede gewählte Gesprächszeile mit ausgeben (Grundlage für LOESUNG5.md)
//   MALA_SNAP=<ordner>             Stand zu Beginn jedes Abschnitts; MALA_FROM=<abschnitt> spielt ab dort weiter (nur Fehlersuche)
//   MALA_K5VAR=1                   Variante: Übernahme aus Kapitel 3/4 (Zustimmung c, Probe nein/Konsulat, Kurve, ohne Pantoffeln und Dose, Davor),
//                                  Taxi nach Vratnik, ohne Fahrschein, ohne Rade und Damir, andere Antworten (Bastei C, Mütze gerade, „Das ist …“)
const { open } = require('./driver');
const { play } = require('./k4play');
const fs = require('fs'), path = require('path');
const SHOTS = process.env.QA_SHOTS || null;   // QA: nicht aus der Kommandozeile (sonst Bildordner aus fremden Argumenten)
const DUMP = process.env.MALA_DUMPALL || null, SNAP = process.env.MALA_SNAP || null, FROM = process.env.MALA_FROM || null, TRACE = !!process.env.MALA_TRACE;
module.exports = async function (__ctx) { const process = __ctx.proc, console = __ctx.console;
  const D = __ctx.D; const VAR = !!process.env.MALA_K5VAR;   // QA: Variante je Lauf über __ctx.proc.env
  const t0 = Date.now(); let step = 0, section = '';
  const log = async (...a) => { if (__ctx.afterStep) await __ctx.afterStep(a.join(' ')); step++; console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] #${step} ${section ? section + ': ' : ''}${a.join(' ')}`);
    if (TRACE && P.trace.length) { console.log(P.trace.join('\n')); } P.trace.length = 0;
    if (DUMP) { const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); fs.writeFileSync(path.join(DUMP, String(step).padStart(3, '0') + '.json'), JSON.stringify({ step, section, label: a.join(' '), GS: g })); } };
  const P = play(D, { onStep: (t) => log(t) });
  const { st, fail, expect, note, flag, inv, at, inPhase, calm, act, exit, choose, comb, mala, marko, drive, noDlg } = P;
  const shot = async (n) => { if (SHOTS) await D.shot(`${SHOTS}/w5_${String(step).padStart(3, '0')}_${n}.png`); };
  const snapSave = async (name) => { if (!SNAP) return; fs.mkdirSync(SNAP, { recursive: true }); const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS))); fs.writeFileSync(path.join(SNAP, name + '.json'), JSON.stringify({ step, GS: g })); };
  const snapLoad = async (name) => { const d = JSON.parse(fs.readFileSync(path.join(SNAP, name + '.json'), 'utf8')); step = d.step;
    await D.ev((g) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__wt = { GS: g }; M.E.loadPreset('__wt', 1); }, d.GS); await D.page.waitForTimeout(400); await calm(); };
  const untilPhase = async (p, what, ms = 120000) => { await D.until(s => s.phase === p, ms, what || p); return calm(); };
  const travel = async (loc, room) => { await D.ev((l) => M.TA.travel(l), loc); await D.page.waitForTimeout(80); await calm(); if (room) await at(room); };
  const use = async (id, item) => act('use', id, item);
  const toHof = async () => { await exit('door'); await at('stiege5'); await exit('down'); await at('haustor5'); await exit('exit'); await at('neboder5'); };
  const toNada = async () => { await exit('haustor_door'); await at('haustor5'); await exit('stairs'); await at('stiege5'); await exit('up'); await at('stan5'); };

  const SECTIONS = [];
  const part = (name, fn) => SECTIONS.push([name, fn]);

  // ----------------------------------------------------------------------- Prolog: Busbahnhof, Hajra, Vratnik, Haus 7, Nada
  part('prolog', async () => {
    await D.ev((v) => { M.__gt0 = M.E.gt(); M.__speechLog = []; if (window.__QA_CHAINED && !v) return;   // QA: über das Titelmenü schon mit Vorgaben gestartet
      try { localStorage.removeItem('mala.c4end'); localStorage.removeItem('mala.c3end');
      if (v){ localStorage.setItem('mala.c3end', JSON.stringify({ consent: 'c', promise: 'c', sample: false })); localStorage.setItem('mala.c4end', JSON.stringify({ consent2: 'b', sample: false, sample2: true, kurve: true, slippers: false, nada: false, davor: true })); } } catch (e) {} M.E.setSlot(1); M.E.newGame(5); }, VAR);
    await calm(); await at('stanica5'); await inPhase('k5_pro'); await note('k5_c_muenchen'); await shot('ankunft');
    await log('Kapitelkarte, im Bus (Erinnerung), Bahnsteig: „Du siehst ausgeschlafen aus.“ – „Acht …“ – „Acht Grad.“');
    await act('talk', '_mala'); await choose('Später.'); await flag('k5.p.lie'); await log('Mit Mala reden: „Mit wem redest du?“ – „Mit dem Kiosk.“');
    if (!VAR) { await use('kiosk'); await flag('k5.p.ticket'); await log('Kiosk: Fahrschein für die Drei'); }
    if (VAR) { await use('taxi'); await choose('Vratnik.'); await at('vratnik5'); await flag('k5.p.hajra'); await flag('k5.p.gate'); await log('Variante: Taxi nach Vratnik; Hajra kommt mit dem Schlüssel den Hang herauf; Mala am Tor: „Hier.“'); }
    else { await use('taxi'); await choose('Kovači.'); await at('pansion5'); await flag('k5.p.hajra'); await log('Taxi: Mama sagt das Wort nicht, Marko sagt „Kovači.“; Hajra: „Ružina snaha.“, Mačak, der Schlüssel');
    await travel('vratnik', 'vratnik5'); await flag('k5.p.gate'); await log('Vratnik: Mala am Tor: „Hier.“ – „Später.“; Mama geht ins Haus'); }
    await use('garden'); await log('Die Plane (ohne Mala): „Ich hebe eine Ecke der Plane. Nur Holz.“');
    await mala(); await act('sense', 'garden'); await flag('k5.p.sensed'); await marko();
    await use('garden'); await note('b5_hand'); await note('j5_wo'); await inv('kanister'); await shot('kanister'); await log('Mala spürt Blau unter der Plane; Marko hebt sie: Papas Kanister, Malas Nachhall „Nemoj gledati, mali.“; Mama: „Ich will sehen, wo es war.“');
    await travel('neboder', 'neboder5'); await note('j5_nichtdrei'); await log('Taxi nach Alipašino Polje: „Nicht die Drei. Noch nicht.“');
    await exit('haustor_door'); await at('haustor5'); await log('Eingangshalle: Dragica, Šehić und das Hausbuch von 1991');
    await exit('stairs'); await at('stiege5'); await note('f5_tuer'); await note('j5_treppe'); await note('j5_samstag'); await shot('siebter'); await log('Siebter Stock: „Zweimal kurz, einmal lang.“ – „Ich kann da nicht hinauf.“ Šehić: Samstag um elf');
    await exit('up'); await untilPhase('k5_d1', 'Donnerstag'); await at('stan5'); await note('s5_tafel'); await log('Nada: die Tafel bei Nedžad, „Es kommt noch jemand.“ Karte „Erster Tag – Donnerstag“');
  });
  // ----------------------------------------------------------------------- Donnerstag
  part('donnerstag', async () => {
    await act('talk', 'nada'); await drive(['Die Fahrscheine', 'Bis später'], noDlg, { label: 'Nada' }); await note('f5_eursamstag'); await flag('k5.d1.lana'); await log('Nada: „Das war euer Samstag.“ Lanas Zimmer steht offen');
    await act('read', 'lana_desk'); await note('s5_mappe'); await log('Lanas Schreibtisch: die Mappe, siebzehn Januare');
    await mala(); await act('sense', 'lana_desk'); await note('s5_nh_mappe'); await marko(); await log('Mala spürt die Mappe: „Lana Delić. Da je nađu.“');
    await toHof(); await travel('kazandziluk', 'kazandziluk5');
    await act('talk', 'nedzad'); await drive(['Nadas Tafel', 'Bis später'], noDlg, { label: 'Nedžad' }); await note('s5_frist'); await log('Nedžad: „Ich graviere, was man mir sagt. Nicht, was man meint.“ Bis Freitag, zwölf');
    await exit('exit'); await at('carsija5');
    if (!VAR) { await act('talk', 'rade'); await drive(['alten Hefte', 'Auf Wiedersehen'], noDlg, { label: 'Rade' }); await note('f5_plaetze'); await log('Rade: „Subota, 11:10. Dvoje djece.“ Der Kleine am Fenster, sie daneben');
    await act('talk', 'damir'); await drive(['Am Freitag ist ein Begräbnis', 'Bis bald'], noDlg, { label: 'Damir' }); await flag('k5.d2.damir'); await log('Damir kommt am Freitag in Uniform'); }
    await travel('pivara', 'pivara'); await log('An der Brauerei: Kopfweh, „Hier ist einer. Aber er zeigt sich nicht.“');
    await mala(); await act('sense', 'tap'); await note('b5_reihe'); await log('Mala am Hahn: „Kanisteri u red! Jedan po jedan!“');
    await untilPhase('k5_n1', 'Donnerstagabend'); await at('stan5'); await note('s5_brett'); await shot('abend'); await log('Abend bei Nada: Zlata und Vlado mit dem Brett; „Na grobu moje kćerke …“; Ana und die Kinder, Niko sieht Mala');
  });
  // ----------------------------------------------------------------------- Donnerstagabend und Nacht
  part('nacht', async () => {
    await mala(); await act('sense', 'board'); await note('s5_nh_brett'); await marko(); await log('Mala spürt das Brett: „Piši kako je rekla. Mala. Da je nađu.“');
    await comb('s5_nh_brett', 's5_nh_mappe', 's5_beide'); await log('Schluss: Beide haben ihren Namen geschrieben, damit man sie findet');
    await comb('s5_beide', 's5_brett', 's5_teile'); await log('Schluss: Zwei Hälften. Oben das Messing, unten das Holz');
    await exit('door'); await choose('(Gute Nacht'); await at('pansion5'); await flag('k5.n1.home'); await log('Gute Nacht; die Pension in der Nacht');
    await use('window'); await drive(VAR ? ['Noch einmal', 'Versuch es auf dem Spiegel', '(Nichts sagen.)'] : ['Versuch es auf dem Spiegel', 'Noch einmal', 'Acht Wochen kein Kopfweh'], async () => !!(await D.flag('k5.n1.atem')), { label: 'Acht Wochen' });
    await note('a5_atem'); await note('f5_dose'); await shot('atem'); await log('Das kalte Fenster: Mala zeichnet in Markos Atem eine Drei; Spiegel und Mia: nichts. „Für Mama. Wer sonst?“');
    await comb('f5_dose', 'f5_eursamstag', 'f5_wem'); await log('Schluss: Nicht Nada. Die Fahrscheine gehören zu den Samstagen');
    await travel('pivara', 'pivara'); await use('middle', 'kanister'); await note('b5_hamdija'); await shot('hamdija'); await log('Nachts an der Brauerei, mit dem Kanister: Hamdija erscheint. „Der Ingenieur ist nach vorn, nach dem Druck fragen.“');
    await act('talk', 'hamdija'); await drive(['Welches Jahr', 'Was ist in dem Kasten', 'Ich warte'], noDlg, { label: 'Hamdija' }); await log('Hamdija: „Es ist April.“ – „Fass den Kasten nicht an!“');
    await mala(); await act('look', 'box'); await note('b5_kasten'); await marko(); await log('Mala im Blechkasten: ein Einmachglas, „Sedam.“');
    await travel('pansion', 'pansion5'); await use('bed'); await untilPhase('k5_d2', 'Freitag'); await log('Schlafen; Karte „Zweiter Tag – Freitag“');
  });
  // ----------------------------------------------------------------------- Freitag
  part('freitag', async () => {
    await travel('institut', 'institut'); await flag('k5.d2.inst'); await note('b5_drei'); await log('Gerichtsmedizin: „Zdravo, Zorane.“ Sieben Tote, drei ohne Namen');
    await travel('pivara', 'pivara'); await mala(); await act('sense', 'tap'); await act('sense', 'middle'); await act('sense', 'bridge'); await note('b5_tag'); await marko(); await log('Mala spürt den neunzehnten April an drei Stellen');
    await comb('b5_hand', 'b5_tag', 'b5_wer'); await log('Schluss: Der vorn die Hand hob, hat mich festgehalten');
    await act('talk', 'hamdija'); await drive(['beide Kanister gefüllt', 'Rechenschieber', 'Ich warte'], noDlg, { label: 'Hamdija überzeugen' }); await flag('k5.b.trust'); await log('„Ti si mali.“ – „Otvori.“');
    await act('open', 'box'); await inv('liste'); await note('b5_liste'); await shot('liste'); await log('Der Kasten: Hamdijas Liste, sieben Zeilen');
    await travel('institut', 'institut'); await use('kolar', 'liste'); await flag('k5.b.listKolar'); await log('Frau Kolar: drei Beschreibungen, ein Abgleich mit den Familien');
    await travel('pivara', 'pivara'); await act('talk', 'hamdija'); await drive(['Sie sind gefunden'], async () => !!(await D.flag('k5.b.ready')), { label: 'Hamdija frei' });
    await mala(); await act('cross', 'hamdija'); await flag('k5.b.gone'); await marko(); await log('„Sie sind gefunden.“ Mala bringt Hamdija hinüber: „Česma. Teče. I niko ne čeka.“');
    await travel('neboder', 'neboder5'); await toNada();
    await act('talk', 'zlata'); await drive(['Siebzehn Briefe', 'Bis später'], noDlg, { label: 'Zlata' }); await flag('k5.s.toZlata');
    await act('talk', 'nada'); await drive(['In Skela hat sie selbst', 'Ein Vorschlag'], async () => !!(await D.flag('k5.s.agreed')), { label: 'Nada' }); await log('Übersetzen an beide; die zwei Hälften: „Oben ihr Name.“ – „Unten das Brett.“');
    await toHof(); await travel('kazandziluk', 'kazandziluk5'); await act('talk', 'nedzad'); await D.ev((x) => M.TA.choose(x), 'Wir haben den Text'); await P.solve([0, 0, 0]); await flag('k5.s.engraved'); await log('Nedžads Gravur: LANA DELIĆ · 3. 3. 1976, keine dritte Zeile');
    await exit('exit'); await at('carsija5'); await travel('neboder', 'neboder5'); await toNada(); await act('talk', 'vlado'); await log('Vlado: „Drži.“ Die Tafel auf dem Pfosten');
    await untilPhase('k5_fun', 'Begräbnis'); await at('bare'); await shot('begraebnis');
    await drive([VAR ? '(Stehen bleiben.)' : '(Eine Schaufel Erde.)'], async () => !!(await D.flag('k5.fun.done')), { label: 'Begräbnis' }); await log('Lanas Begräbnis: „Jetzt passen sie zusammen.“ Der Ableger, „Schief.“ Eine Schaufel Erde');
    await untilPhase('k5_d2_n', 'Freitagabend'); await at('stan5'); await note('f5_bild'); await log('Totenmahl: „Voll.“ – „Hvala.“ Anas Zeichnung: „Uvijek lica u prozorima.“');
  });
  // ----------------------------------------------------------------------- Freitagabend, Nacht auf der Bastei
  part('tabija', async () => {
    await act('talk', 'jasna'); await drive(['Mama?', 'Gute Nacht'], noDlg, { label: 'Mama' }); await act('talk', 'nada'); await drive(['Danke, Nada', 'Bis gleich'], noDlg, { label: 'Nada' }); await flag('k5.e.meal');
    await mala(); await act('sense', 'jasna'); await note('f5_schuld'); await marko(); await log('Mala spürt Mama: „Wenn ich ihn mitgenommen hätte …“');
    await comb('f5_wem', 'j5_treppe', 'f5_jasna'); await log('Schluss: Die Fahrscheine sind für Mama. Am Fenster und daneben');
    await D.until(s => s.room === 'vratnik5', 60000, 'Bastei');
    if (VAR) await note('f5_plaetze');   // ohne Rade: Malas Erinnerung beim Totenmahl
    await drive(VAR ? ['Ich weiß nicht, was ich will', 'Bist du sicher?', '(Die Dose nehmen.)'] : ['Ich will, dass du bleibst', '(Die Dose nehmen.)'], async () => !!(await D.flag('k5.n2.done')), { label: 'Bis es hell wird' }); await inv('dose_lana'); await shot('bastei'); await log('Žuta tabija: „Ich will, dass du bleibst.“ – „Ich gehe.“ Die Dose; „Sretan rođendan.“');
    await use('bench'); await choose('(Den Samstag beginnen.)'); await untilPhase('k5_sat', 'Samstag');
    const sat = await D.ev(() => !!localStorage.getItem('mala.mark.1.sat')); await expect(sat, 'Spielstand „Vor dem Samstag“ angelegt'); await log('Punkt ohne Rückkehr, eigener Stand „Vor dem Samstag“; Karte „Zehn nach elf“');
  });
  // ----------------------------------------------------------------------- Samstag
  part('samstag', async () => {
    await at('pansion5'); await use('jasna', 'dose_lana'); await inv('dose_lana'); await log('Frühstück: Die Dose am Tisch? „Was soll ich damit hier?“ – „Nicht hier. An der Tür.“');
    await exit('door'); await D.until(s => s.map || s.room === 'map', 15000, 'Stadtplan').catch(() => {}); await travel('neboder', 'neboder5');
    await exit('haustor_door'); await exit('stairs'); await at('stiege5'); await act('open', 'door7');
    await use('jasna', 'dose_lana'); await drive(VAR ? ['(Nichts sagen.)', 'Geh hinauf und klopf.', '(Zur Tür gehen.)'] : ['Von Lana.', '(Zurücktreten.)', '(Zur Tür gehen.)'], async (s) => s.room === 'stan5' && s.active === 'marko' && !!(await D.flag('k5.sat.knock')), { label: 'Siebter Stock' });
    await shot('klopfen'); await log('Die Fahrscheine an der Tür; Zurücktreten; zehn nach elf: Mala hört ihr eigenes Klopfen. „Uđi.“');
    await use('balcony'); await mala(); await act('draw', 'balcony'); await marko(); await use('balcony'); await mala(); await act('draw', 'balcony'); await marko(); await shot('zeichnung');
    await use('balcony'); await drive([VAR ? 'Das ist' : '(Nichts sagen.)'], async (s) => !!(await D.flag('k5.sat.rode')) && s.room === 'carsija5', { label: 'Küche' }); await note('f5_stigla'); await log('Anhauchen, zeichnen, anhauchen, zeichnen, die Räder: „Stigla si.“ – „Jesam, mama.“ Die Drei, Endstation, „Dva.“');
    await use('lane_kula'); await drive(VAR ? ['(Warten.)', 'Noch nicht.', '(Den Kopf schütteln.)', '(Die Mütze gerade', '(Loslassen.)'] : ['Was siehst du im Licht?', 'Nein.', '(Sie schief lassen.)', '(Loslassen.)'], async (s) => !!(await D.flag('k5.sat.lunch')), { label: 'Am Tor' }); await shot('tor'); await log('Am Tor: „Kommst du?“ – „Nein.“ Loslassen. „Jetzt bin ich fertig.“ Mittagessen, sechs Tassen');
    await act('talk', 'jasna'); await untilPhase('k5_epi', 'Montag'); await log('„Behalte ich.“; Sonntag; Karte „Epilog – Montag“');
  });
  // ----------------------------------------------------------------------- Montag
  part('montag', async () => {
    await travel('pivara', 'pivara'); await use('tap', 'kanister'); await inv('kanister_voll'); await log('Der Kanister am Hahn: keiner wartet');
    await travel('vratnik', 'vratnik5'); await exit('ruza_gate'); await D.until(s => s.room === 'kuca5', 30000, 'Ružas Küche'); await calm(); await log('Das Wasser in Ružas Küche: „Keinen Tropfen verschüttet.“');
    await D.until(async s => !!(await D.flag('k5.e.final')), 180000, 'Zorans Begräbnis und Ružas Küche').catch(async e => { await calm(); });
    await calm(); await flag('k5.e.zoranDone'); await flag('k5.e.final'); await shot('kueche'); await log('Zorans Begräbnis: „Poginuo.“ Ružas Küche, Kolar, Vesna, das beschlagene Fenster');
    await shot('fenster'); await use('window'); await drive([VAR ? '(Nichts sagen.)' : 'Seit Samstag.'], async () => false, { label: 'Letzte Zeichnung', max: 60 });
    for (let i = 0; i < 200; i++) { const s = await st(); if (s.screen === 'credits' || s.screen === 'title') break; if (s.overlay === 'memory' || s.overlay === 'doc') await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(150); }
    await D.until(s => s.screen === 'credits' || s.screen === 'title', 90000, 'Abspann');
    const c5 = await D.ev(() => JSON.parse(localStorage.getItem('mala.c5end') || 'null'));
    await expect(c5 && c5.answer === (VAR ? 'c' : 'a') && c5.cap === (VAR ? 'straight' : 'crooked') && c5.silent === !VAR, 'M.endChapter5: Kapitel beendet und in mala.c5end gemerkt (' + JSON.stringify(c5) + ')');
    if (VAR) { await P.expectSaid('Die Dose habe ich vergessen'); await P.expectSaid('Konsulat'); await P.expectSaid('Feigenzweig'); await P.expectSaid('Er ist ja da'); }
    await log('Die letzte Zeichnung, mit Rädern; „Dahinter ist die Stadt.“ Ende; Abspann');
  });

  try {
    if (DUMP) fs.mkdirSync(DUMP, { recursive: true });
    let started = !FROM;
    for (const [name, fn] of SECTIONS) {
      if (!started) { if (name !== FROM) continue; started = true; await snapLoad(name); console.log('weiter ab Abschnitt ' + name + ' (Stand ' + step + ')'); }
      else if (name !== 'prolog') { await calm(); await snapSave(name); }
      section = name; await fn();
    }
    console.log('Spieltakt der Musterlösung (Pflichtdialoge in Normaltempo, inkl. Wartezeiten des Testtreibers): ' + (await D.ev(() => M.E.gt() - (M.__gt0 || 0)) / 60000).toFixed(1) + ' min');
    const errs = D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e)); console.log(errs.length ? 'FEHLER:\n' + errs.join('\n') : `DURCHLAUF KAPITEL 5 OK: ${step} Schritte in ${((Date.now() - t0) / 1000).toFixed(0)} s, keine JS-Fehler`);
    if (errs.length) process.exitCode = 1;
  } catch (e) { console.error('ABBRUCH in Abschnitt „' + section + '“ nach Schritt ' + step + ': ' + e.message); if (TRACE) console.error(P.trace.join('\n')); console.error(D.errors.slice(0, 8).join('\n'));
    try { await D.shot(path.join(SHOTS || require('os').tmpdir(), 'w5_abbruch.png')); } catch (e2) {} process.exitCode = 1; }
  return __ctx.done();
};
