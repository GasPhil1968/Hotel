// Prüft den neuen Einstieg und die Passage nach Ivka mit echten alten Spielständen (game/tools/fixtures, aus dem Durchlauf der Vorversion)
// und mit gezielten Eingriffen: Migration, Laden mitten im Übergang, Malas Abwesenheit über alle Eingabewege, Sanjas Begrüßung je nach Verlauf.
// node game/tools/einstiegtests.js
const { open } = require('./driver');
const fs = require('fs'), path = require('path');
const FIX = path.join(__dirname, 'fixtures');
const fx = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n + '.json'), 'utf8')).GS;
let pass = 0, fail = 0; const out = [];
function check(ok, what, info) { if (ok) { pass++; out.push('  ok   ' + what); } else { fail++; out.push('  FEHLER ' + what + (info ? '  | ' + info : '')); } }
(async () => {
  const D = await open({ turbo: 25 });
  const load = async (gs) => { await D.ev((g) => { M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: g }; M.E.loadPreset('__t', 3); }, gs); await D.drain(); };
  const st = () => D.st(); const F = (k) => D.flag(k);
  const talk = async (id, ...c) => { await D.act('talk', id); await D.drain(); for (const x of c) { await D.choose(x); await D.drain(); } };
  const awayState = () => D.ev(() => ({ on: M.GS.malaOn, sw: M.E.canSwitch(), away: !!M.GS.flags['split.afterIvka.away'], act: !!M.ACT.mala, hs: (function () { for (let y = 0; y < 144; y += 3) for (let x = 0; x < 320; x += 3) { const h = M.E.hotspotAt(x + M.E.camX, y); if (h && h.id === '_mala') return true; } return false; })() }));
  const isAway = (g) => !g.on && !g.sw && g.away && !g.act && !g.hs;
  try {
    // ---------------------------------------------------------------- 1. alter Prolog-Stand (Abend, Text noch nicht geschrieben)
    out.push('1. Alter Prolog-Stand (Vorversion, Dienstagabend)');
    await load(fx('alt_08'));
    check(await F('split.intro.legacy'), 'als alter Stand erkannt (split.intro.legacy)');
    await D.act('use', 'laptop'); await D.choose('Jeden Abend um sieben'); await D.drain();
    check(await F('pro.article'), 'Text schreiben ohne neue Pflichtschritte (keine Riva, keine Strickliste)');
    check((await F('leadKnit')) === undefined, 'keine zweite Auswahl für alte Stände');
    await D.act('use', 'bed'); await D.drain(); await D.choose('Licht machen'); await D.drain();
    check((await st()).phase === 'c1' && await F('mala.voice'), 'Nacht und Fall 1 wie in der Vorversion (Stimmenphase)');
    await D.exit('door'); await D.drain(); check((await st()).room === 'map', 'kein Kennenlernen in der Wohnung für alte Stände (Tür geht)');
    // ---------------------------------------------------------------- 2. alte Stimmenphase im Hafenamt
    out.push('2. Alter Stand in der Stimmenphase, Hafenamt nach der Suche');
    await load(fx('alt_14'));
    check(await F('mala.voice') && !(await F('mk.test')), 'Stimmenphase, noch kein Test');
    await D.act('talk', '_mala'); await D.drain(); await D.choose('Wenn du da bist'); await D.drain();
    check(await F('mk.test') && await D.hasNote('m_name') && await D.ev(() => M.E.canSwitch()), 'alte Erstvorstellung im Hafenamt (für diesen Stand die erste): Name, Test, Wechsel');
    // ---------------------------------------------------------------- 3. der mitgelieferte Stand der Vorversion: Finale, Zwischenwelt, neue Passage
    out.push('3. Mitgelieferter Ivka-Stand der Vorversion');
    await load(fx('alt_preset_ivka'));
    check(await F('split.intro.legacy') && await F('split.intro.met'), 'alt, Kennenlernen gilt durch den Praxistest als erfolgt');
    await D.act('use', 'ivka', 'letter_t'); await D.drain(); await D.pickNote('c1_ferry'); await D.drain(); await D.pickNote('c1_came'); await D.drain();
    await D.choose('Brief vorlesen'); await D.drain(); await D.choose('Handschuhe'); await D.drain(); await D.choose('nicht mehr hier'); await D.drain();
    check(await F('c1.release') && !(await F('c1.done')), 'Ivka erkennt ihren Tod; c1.done noch nicht gesetzt');
    check((await st()).phase !== 'i1m', 'die neue Passage beginnt nicht schon bei c1.release');
    await D.act('cross', 'ivka'); await D.drain(); await D.choose('Ihre Hand nehmen'); await D.drain();
    await talk('ghost', 'Was sehen Sie im Licht', '(Schweigen.)'); await D.act('use', 'ghost', 'gloves'); await D.drain();
    check(await F('c1.done'), 'c1.done erst in der Zwischenwelt');
    await D.exit('arch'); await D.drain(); await D.until(s => s.phase === 'i1m' && s.room === 'flat' && !s.busy && !s.card, 90000, 'Morgen');
    let g = await awayState(); check(isAway(g), 'Donnerstagmorgen: Mala nicht da (Figur, Hotspot, Wechsel)', JSON.stringify(g));
    check(!(await st()).inv.includes('gloves'), 'die Handschuhe sind drüben geblieben');
    check((await F('i1.answer')) === undefined && !(await F('mk.accept')), 'Bankgespräch und Zusage noch nicht passiert');
    // Eingabewege während der Abwesenheit: Tastatur, Wechselknopf antippen, Hilfe, Raumwechsel
    const g0 = await D.ev(() => M.E.gSuppressed || 0);
    await D.ev(() => { M.key('Tab'); M.key('m'); });
    const sw = await D.ev(() => { for (let y = 140; y < 200; y += 2) for (let x = 0; x < 80; x += 2) { if (M.uiHit(x, y) === 'sw') return [x, y]; } return null; });
    check(sw === null, 'Wechselknopf ist während der Abwesenheit nicht da', JSON.stringify(sw));
    await D.ev(() => { M.pointerDown(20, 180, true); M.pointerUp(20, 180, true); }); await D.drain();
    await D.ev(() => { M.__speechLog = []; M.help(); }); await D.drain(); await D.settle();
    const helpLines = await D.ev(() => (M.__speechLog || []).filter(l => /mala/.test(l[0])));
    check(helpLines.length === 0, 'Hilfe: keine Zeile von Mala', JSON.stringify(helpLines));
    g = await awayState(); check(isAway(g), 'nach Tab, M, Tippen und Hilfe weiter allein', JSON.stringify(g));
    await D.ev(() => { M.__speechLog = []; });
    await D.exit('door'); await D.drain(); await D.travel('riva'); await D.drain(); await D.act('look', 'mole'); await D.drain(); await D.act('use', 'bench'); await D.drain();
    await D.ev(() => M.saveGame()); await D.ev(() => M.loadGame(3)); await D.drain();
    g = await awayState(); check(isAway(g), 'nach Raumwechsel, Speichern und Laden weiter allein', JSON.stringify(g));
    const malaSaid = await D.ev(() => (M.__speechLog || []).filter(l => /mala/.test(l[0])));
    check(malaSaid.length === 0 && (await D.ev(() => M.E.gSuppressed || 0)) === g0, 'keine Mala-Zeile in der Solophase (auch keine unterdrückte)', JSON.stringify(malaSaid));
    // Sanjas Begrüßung: alter Stand ohne Dienstag in der Bar → keine Behauptung über frühere Besuche
    await D.ev(() => { M.__speechLog = []; }); await D.exit('exit'); await D.drain(); await D.travel('bar'); await D.drain();
    const greet = await D.ev(() => (M.__speechLog || []).filter(l => /sanja/.test(l[0])).map(l => l[1]));
    check(greet[0] === 'Marko. Wie immer?' && !greet.some(t => /Gestern|Dienstag|schwindlig|Übersetzer/.test(t)), 'Sanja begrüßt ohne falsche Annahmen über den Verlauf', JSON.stringify(greet));
    await D.act('use', 'marko_table'); await D.choose('Steh auf'); await D.drain();
    check(await F('split.afterIvka.back') && (await D.ev(() => M.GS.malaOn)) && (await D.ev(() => M.E.canSwitch())), 'Wiederkehr am Tisch: Mala sichtbar, Wechsel möglich');
    check((await F('split.afterIvka.reaction')) === 'away', 'abwehrende Reaktion gespeichert, keine Sackgasse');
    await D.switchTo('mala'); await D.act('look', 'note'); await D.drain(); check(await D.hasNote('i1_note'), 'Mala liest den Zettel hinter dem Tresen');
    const mp = await D.ev(() => [Math.round(M.ACT.mala.x), Math.round(M.ACT.mala.y)]); check(mp[1] < 116 && mp[0] > 86 && mp[0] < 182, 'Mala steht dafür wirklich hinter dem Tresen', JSON.stringify(mp));
    await D.switchTo('marko'); await talk('sanja', 'Du machst am Montag zu', 'Jemand hat es mir vorgelesen'); check(await F('split.afterIvka.verified'), 'Sanja bestätigt den Zettel');
    await D.exit('door'); await D.drain(); await D.travel('riva'); await D.drain();
    await D.act('use', 'bench'); await D.choose('Gehen wir'); await D.choose('Ich bin hier hängen'); await D.choose('Da ist niemand mehr'); await D.choose('Ich weiß immer noch nicht'); await D.drain();
    check((await st()).phase === 'c2' && await F('mk.accept') && (await F('i1.answer')) === 1 && (await F('i1.sarajevo')) === 1, 'Zusage, Entscheidungen, Fall 2 (einmalig)');
    await D.exit('exit'); await D.drain(); await D.ev(() => { M.__speechLog = []; }); await D.travel('bar'); await D.drain();
    await talk('sanja', 'Danke für den Kaffee'); const s2 = await D.ev(() => (M.__speechLog || []).map(l => l[1]));
    check(s2.some(t => /Inzwischen sind Stipe und Frane/.test(t)) && !s2.some(t => /Du warst in der Zeitung/.test(t)), 'Fall 2: keine zweite Einführung der Bar, keine doppelte Zeitungszeile', JSON.stringify(s2.slice(0, 6)));
    // ---------------------------------------------------------------- 4. alter Stand mitten im alten Zwischenspiel (nach der Zwischenwelt)
    out.push('4. Alter Stand nach der Zwischenwelt, vor dem Bankgespräch');
    await load(fx('alt_27')); await D.until(s => s.phase === 'i1m' && s.room === 'flat' && !s.busy && !s.card, 90000, 'Wiederaufnahme');
    g = await awayState(); check(isAway(g) && await F('split.afterIvka.home'), 'Laden führt in die neue Passage (Bank, Heimweg, Morgen allein)', JSON.stringify(g));
    // ---------------------------------------------------------------- 5. spätere alte Stände bleiben, wo sie sind
    out.push('5. Alte Stände in Fall 2, Fall 3 und im Epilog');
    for (const [n, ph] of [['alt_28', 'c2'], ['alt_44', 'c3'], ['alt_52', 'epi']]) { await load(fx(n)); const s = await st(); check(s.phase === ph && s.screen === 'game', n + ': bleibt in ' + ph + ' (' + s.room + ')', JSON.stringify({ phase: s.phase, room: s.room })); }
    await load(fx('alt_28')); await D.ev(() => { M.__speechLog = []; }); await talk('sanja', 'Danke für den Kaffee'); const s3 = await D.ev(() => (M.__speechLog || []).map(l => l[1]));
    check(s3.some(t => /Du warst in der Zeitung/.test(t)), 'alter Stand in Fall 2: Sanjas Zeitungszeile wie bisher (sie hatte keinen Morgen)', JSON.stringify(s3.slice(0, 4)));
    // ---------------------------------------------------------------- 6. Sanjas Morgen je nach Antwort am Dienstag
    out.push('6. Sanjas Begrüßung am Donnerstag nach Markos Antwort am Dienstag');
    await load(fx('alt_27')); await D.until(s => s.phase === 'i1m' && s.room === 'flat' && !s.busy && !s.card, 90000, 'Morgen');
    for (const [h, re] of [['honest', /Dreht sich der Boden/], ['joke', /Heute genau oder heute gut/], ['deflect', /Mein Kaffee war es übrigens nicht/]]) {
      await D.ev((h) => { M.GS.flags['split.intro.health'] = h; delete M.GS.flags['split.afterIvka.bar']; M.GS.seen['bar:barC1'] = 1; M.__speechLog = []; }, h);
      await D.travel('bar'); await D.drain(); const l = await D.ev(() => (M.__speechLog || []).filter(x => /sanja/.test(x[0])).map(x => x[1]));
      check(re.test(l[0] || '') && l.some(t => /Gestern Abend warst du noch grau/.test(t)), 'Antwort „' + h + '“ → passende Begrüßung', JSON.stringify(l.slice(0, 2)));
      await D.exit('door'); await D.drain(); await D.travel('flat'); await D.drain(); }   // wieder hinein: erst weg (der aktuelle Ort auf dem Plan betritt den Raum nicht neu)
    // ---------------------------------------------------------------- 7. der neue mitgelieferte Stand (mit dem neuen Einstieg erzeugt)
    out.push('7. Neuer mitgelieferter Ivka-Stand');
    await D.ev(() => { M.E.loadPreset('ivka', 2); }); await D.drain();
    check(!(await F('split.intro.legacy')) && await F('split.intro.met') && await F('mk.test'), 'neuer Stand: Kennenlernen und Praxistest erledigt, nicht als alt markiert');
    await D.act('use', 'ivka', 'letter_t'); await D.drain(); await D.pickNote('c1_ferry'); await D.drain(); await D.pickNote('c1_came'); await D.drain();
    await D.choose('Brief vorlesen'); await D.drain(); await D.choose('Handschuhe'); await D.drain(); await D.choose('nicht mehr hier'); await D.drain();
    await D.act('cross', 'ivka'); await D.drain(); await D.choose('Ihre Hand nehmen'); await D.drain(); await talk('ghost', 'Was sehen Sie im Licht', '(Schweigen.)'); await D.act('use', 'ghost', 'gloves'); await D.drain();
    await D.exit('arch'); await D.drain(); await D.until(s => s.phase === 'i1m' && s.room === 'flat' && !s.busy && !s.card, 90000, 'Morgen');
    g = await awayState(); check(isAway(g), 'nach der Erlösung: Morgen allein', JSON.stringify(g));
    await D.act('use', 'laptop'); await D.choose('Mail aus Graz'); await D.drain(); await D.choose('Zuklappen'); await D.drain();
    check(await D.ev(() => !M.GS.flags['split.afterIvka.fixed']), 'sorgfältige Abgabe am Dienstag: nichts zu korrigieren');
    await D.ev(() => { M.__speechLog = []; }); await D.exit('door'); await D.drain(); await D.travel('bar'); await D.drain();
    const gr = await D.ev(() => (M.__speechLog || []).filter(l => /sanja/.test(l[0])).map(l => l[1]));
    check(/Heute genau oder heute gut/.test(gr[0] || '') && gr.some(t => /Mützen/.test(t)), 'Sanja erinnert sich an den Witz vom Dienstag und an das Detail im Nachruf', JSON.stringify(gr.slice(0, 4)));
  } catch (e) { fail++; out.push('ABBRUCH: ' + e.message); }
  console.log(out.join('\n'));
  console.log(`\n${pass} bestanden, ${fail} Fehler`); console.log(D.errors.length ? 'JS-FEHLER:\n' + D.errors.slice(0, 6).join('\n') : 'keine JS-Fehler');
  await D.close2(); process.exit(fail || D.errors.length ? 1 : 0);
})();
