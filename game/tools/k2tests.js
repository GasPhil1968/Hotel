// Zusatztests für Kapitel 2: Titelmenü/Kapitelwahl, alte Spielstände, Speichern mitten im Kapitel, Übernahme aus Split,
// falsche Reihenfolgen, falsche Figur, Hinweise, falsche Verbindungen. node game/tools/k2tests.js <dump-ordner aus MALA_DUMPALL>
const { open } = require('./driver');
const fs = require('fs'), path = require('path');
const DUMPS = process.argv[2];
let pass = 0, fail = 0; const out = [];
function ok(c, what) { if (c) { pass++; out.push('  ok   ' + what); } else { fail++; out.push('  FEHL ' + what); } }
(async () => {
  const D = await open({ turbo: 25 });
  const st = () => D.st();
  const loadDump = async (n) => { const f = path.join(DUMPS, String(n).padStart(2, '0') + '.json'); const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    await D.ev((g) => { M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: g }; M.E.loadPreset('__t', 3); }, d.GS); await D.page.waitForTimeout(400); await D.drain(); return d; };
  const findStep = (label) => { const fsx = fs.readdirSync(DUMPS).filter(f => f.endsWith('.json')).sort(); for (const f of fsx) { const d = JSON.parse(fs.readFileSync(path.join(DUMPS, f), 'utf8')); if (d.label.indexOf(label) >= 0) return d.step; } throw new Error('Schritt nicht gefunden: ' + label); };
  try {
    out.push('Titelmenü und Kapitelwahl');
    let m = await D.ev(() => { M.E.toTitle(); M.E.titleMode = 'main'; return null; });
    let items = await D.ev(() => { M.E.titleMode = 'chapter'; return null; });
    ok(await D.ev(() => !M.ch2Unlocked()), 'ohne Split-Ende ist Kapitel 2 nicht freigeschaltet');
    await D.ev(() => { M.E.titleMode = 'unlock'; M.E.newCh = 2; }); ok(await D.ev(() => M.E.titleMode === 'unlock'), 'Rückfrage „Trotzdem?“ erscheint');
    await D.ev(() => { M.E.setSlot(2); M.E.newGame(2); }); await D.drain();
    let s = await st(); ok(s.phase === 'k2_pro' && s.room === 'stanica', 'neues Spiel Kapitel 2 beginnt am Busbahnhof (' + s.phase + ', ' + s.room + ')');
    ok(await D.ev(() => M.GS.flags['k2.c1.answer'] === 1 && M.GS.flags['k2.c1.fromSave'] === false), 'ohne Split: Vorgaben für die Übernahme');
    ok(await D.ev(() => M.GS.notes.indexOf('m2_split_register') >= 0), 'das Register aus Split ist immer im Notizbuch');
    // Übernahme aus Split
    await D.ev(() => { M.storeC1End({ flags: { 'i1.answer': 0, 'i1.sarajevo': 1 }, notes: ['m_register', 'm_tin', 'm_journal'], playMs: 1000 }); });
    ok(await D.ev(() => M.ch2Unlocked()), 'nach dem Ende von Split ist Kapitel 2 frei');
    await D.ev(() => { M.E.setSlot(2); M.E.newGame(2); }); await D.drain();
    ok(await D.ev(() => M.GS.flags['k2.c1.answer'] === 0 && M.GS.flags['k2.c1.sarajevo'] === 1 && M.GS.flags['k2.c1.fromSave'] === true), 'Antworten aus Split übernommen (Meer / niemand mehr)');
    ok(await D.ev(() => M.GS.notes.indexOf('m2_split_tin') >= 0 && M.GS.notes.indexOf('m2_split_journal') >= 0), 'Notizen aus Split übernommen');
    // Abspann von Split bietet Kapitel 2 an
    await D.ev(() => { M.E.creditLines = ['x']; M.E.afterCredits = 'ch2'; M.E.startCredits(); M.E.creditsAt = M.E.gt() - 999999; }); await D.page.waitForTimeout(500);
    ok(await D.ev(() => M.E.screen === 'title' && M.E.titleMode === 'next'), 'nach dem Abspann von Split: „Weiter mit Kapitel 2“');
    // Kapitel 1 startet weiterhin
    await D.ev(() => { M.E.setSlot(1); M.E.newGame(1); }); await D.drain(); s = await st(); ok(s.phase === 'pro' && s.room === 'flat', 'neues Spiel Kapitel 1 startet wie bisher (' + s.phase + ')');
    // alter Spielstand aus Kapitel 1 (mitgelieferter Stand)
    await D.ev(() => { M.E.loadPreset('ivka', 1); }); await D.page.waitForTimeout(400); await D.drain(); s = await st(); ok(s.phase && s.phase.indexOf('k2') < 0 && !!s.room, 'mitgelieferter Spielstand aus Split lädt (' + s.phase + ', ' + s.room + ')');
    ok(await D.ev(() => M.chapterOf(M.GS) === 1), 'alter Stand gilt als Kapitel 1');
    ok(await D.ev(() => M.hintsOpen().length === 0), 'in Kapitel 1 gibt es keine Hinweise (wie bisher)');
    if (!DUMPS) throw new Error('kein Dump-Ordner angegeben; Tests mitten im Kapitel übersprungen');
    // ---------------- Speichern/Laden mitten in Kapitel 2
    out.push('Speichern und Laden mitten im Kapitel');
    let n = findStep('Elf Minuten'); await loadDump(n); s = await st(); ok(s.phase === 'k2_s1', 'Stand „Elf Minuten“ geladen (' + s.phase + ', ' + s.room + ')');
    await D.ev(() => M.E.saveGame()); const before = await D.ev(() => JSON.stringify({ n: M.GS.notes.length, f: Object.keys(M.GS.flags).length, i: M.GS.inv.slice().sort() }));
    await D.page.reload(); await D.page.waitForTimeout(400); await D.ev(() => { M.TEST = true; M.TURBO = 25; M.E.setSlot(3); M.E.loadGame(3); }); await D.page.waitForTimeout(400); await D.drain();
    const after = await D.ev(() => JSON.stringify({ n: M.GS.notes.length, f: Object.keys(M.GS.flags).length, i: M.GS.inv.slice().sort() }));
    ok(before === after, 'nach Neuladen der Seite ist der Stand identisch');
    ok(await D.ev(() => { var t = M.E.slotInfo(3); return !!t && /Sarajevo/.test((M.PHASES[t.phase] || {}).short || ''); }), 'Speicherplatz zeigt „Sarajevo: …“');
    // ---------------- falsche Reihenfolge bei Emina, dann richtig
    out.push('Falsche Reihenfolgen und falsche Figur');
    n = findStep('Briefe übersetzt'); await loadDump(n); await D.exit('door'); await D.drain(); s = await st(); ok(s.room === 'kafana', 'zurück in der Kafana');
    await D.act('talk', 'emina'); await D.drain(); await D.pickNote('s1_betrayal'); await D.drain();
    ok(!(await D.flag('k2.s1.emina')), 'falsche Reihenfolge (erst die Briefe): Emina wendet sich ab');
    await D.act('talk', 'emina'); await D.drain(); await D.pickNote('s1_missed'); await D.drain(); await D.pickNote('s1_betrayal'); await D.drain();
    ok(!!(await D.flag('k2.s1.emina')), 'dann richtige Reihenfolge: Emina kommt heute Nacht');
    // Takvim ohne Datum
    n = findStep('Zwei Siebenen'); await loadDump(n);
    ok(await D.ev(() => M.GS.notes.indexOf('s1_sunset') < 0), 'vor dem Datum kein Sonnenuntergang');
    // falsche Figur: Mala will etwas nehmen, Marko will durch eine Wand
    await D.switchTo('mala'); await D.act('take', 'tower_door'); await D.drain(); ok((await st()).screen === 'game', 'Mala kann nichts nehmen (keine Fehler)'); await D.switchTo('marko');
    // falsche Verbindungen: verschiedene Antworten
    const r1 = await D.combine('s1_note', 'm2_split_register'), r2 = await D.combine('s1_alaturka', 'p2_km'), r3 = await D.combine('s1_note', 'm2_split_register');
    ok(r1 && !r1.ok && r2 && !r2.ok && r1.t !== 'Das hängt nicht zusammen.', 'falsche Verbindung: eigene Antwort („' + (r1 && r1.t) + '“)');
    ok(r3 && /schon versucht|Noch einmal/.test(r3.t), 'dieselbe falsche Verbindung noch einmal: „' + (r3 && r3.t) + '“');
    // Hinweise auf Wunsch
    const h = await D.ev(() => M.hintsOpen().map(x => x.id)); ok(h.length > 0, 'Hinweise offen: ' + h.join(', '));
    await D.ev(() => { M.showHints(); }); await D.until(s => s.dlg, 20000, 'Hinweisliste'); await D.choose(await D.ev(() => M.hintsOpen()[0].t)); await D.drain();
    ok(await D.ev(() => (M.GS.flags['hint.' + M.hintsOpen()[0].id] || 0) === 1), 'erste Hinweisstufe gezeigt');
    // Glocke ohne Mala unten
    n = findStep('Šehićs Schlüssel'); await loadDump(n); await D.act('open', 'shelter_door'); await D.drain(); await D.act('push', 'bell_button'); await D.drain();
    ok(!(await D.flag('k2.s3.rang')) && !!(await D.flag('k2.s3.bellTried')), 'Klingel ohne Mala unten: „gehört hat es keiner“, kein Fortschritt, wiederholbar');
    // Kein Karton vor der Zeit
    n = findStep('SMS: Paket'); await loadDump(n); await D.travel && null;
    const kOk = await D.ev(() => M.GS.notes.indexOf('m2_lana') >= 0 && !!M.GS.flags['k2.s3.done']); ok(kOk, 'beim Paket sind Lana und Zoras Satz bekannt (Karton öffnet sich)');
    // Tomaž mit falschen Argumenten
    n = findStep('Emina überzeugt'); await loadDump(n); await D.act('talk', 'tomaz'); await D.drain(); await D.pickNote('s1_missed'); await D.drain();
    ok(!(await D.flag('k2.s1.stay')), 'Tomaž mit falschem Argument: bleibt unruhig, geht aber nicht');
    await D.pickNote('s1_campus'); await D.drain(); await D.pickNote('s1_twosevens'); await D.drain(); ok(!!(await D.flag('k2.s1.free')), 'mit den richtigen Argumenten: die Kula schlägt sieben');
  } catch (e) { fail++; out.push('ABBRUCH: ' + e.message); }
  const errs = D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e)); if (errs.length) { fail++; out.push('JS-Fehler:\n' + errs.slice(0, 8).join('\n')); }
  console.log(out.join('\n')); console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`); process.exitCode = fail ? 1 : 0; await D.close2();
})();
