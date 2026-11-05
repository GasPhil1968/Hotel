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
    // Bedienung wie ein Spieler: Zeile im Titelmenü suchen und antippen (echter Eingabeweg über pointerDown/pointerUp)
    const tapTitle = async (label) => D.ev((lb) => { const L = M.titleLabels(); const i = L.findIndex(t => t.indexOf(lb) >= 0); if (i < 0) throw new Error('Titelzeile fehlt: ' + lb + ' | ' + L.join(' | '));
      for (let y = 0; y < 200; y++) for (let x = 40; x < 280; x += 2) if (M.uiHit(x, y) === 't:' + i) { M.pointerDown(x, y + 3, true); M.pointerUp(x, y + 3, true); return true; } throw new Error('Zeile nicht antippbar: ' + lb); }, label);
    await D.ev(() => { M.E.toTitle(); M.E.titleMode = 'main'; });
    const labels = await D.ev(() => M.titleLabels());
    ok(labels.indexOf('Kapitel 1: Split') >= 0 && labels.indexOf('Kapitel 2: Sarajevo') >= 0, 'Hauptmenü zeigt beide Kapitel direkt (' + labels.join(' · ') + ')');
    ok(await D.ev(() => !M.ch2Unlocked()), 'ohne Split-Ende ist kein Split-Ende gespeichert (es gelten Vorgaben)');
    await tapTitle('Kapitel 2: Sarajevo'); ok(await D.ev(() => M.E.titleMode === 'slots' && M.E.newCh === 2), 'Kapitel 2 direkt gewählt: sofort die Speicherplätze, keine Sperre und keine Rückfrage');
    await tapTitle('Platz 2'); if (await D.ev(() => M.E.titleMode === 'confirm')) await tapTitle('Ja');
    await D.page.waitForTimeout(300); await D.drain();
    let s = await st(); ok(s.phase === 'k2_pro' && s.room === 'stanica', 'Sarajevo startet direkt aus dem Hauptmenü am Busbahnhof (' + s.phase + ', ' + s.room + ')');
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
    ok(await D.ev(() => M.hintsOpen().length > 0 && M.hintsOpen().every(h => M.HINTS_K1.indexOf(h) >= 0)), 'in Kapitel 1 gibt es jetzt Hinweise, und nur solche aus Kapitel 1');
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
    await D.ev(() => { M.showHints('menu'); }); await D.until(s => s.dlg, 20000, 'Hinweisliste'); const h0 = await D.ev(() => M.hintsOpen()[0]); await D.choose(h0.t); await D.drain();
    ok(await D.ev((id) => ((M.GS.hints[id] || {}).s || 0) === 1 && !M.GS.flags['hint.' + id], h0.id), 'erste Hinweisstufe gezeigt (Hinweisgeschichte getrennt in GS.hints)');
    await D.ev(() => { if (M.E.dlg) M.E.chooseDone(M.E.dlg.opts.findIndex(o => o.bye)); }); await D.drain();
    // Glocke ohne Mala unten
    n = findStep('Šehićs Schlüssel'); await loadDump(n); await D.act('open', 'shelter_door'); await D.drain(); await D.act('push', 'bell_button'); await D.drain();
    ok(!(await D.flag('k2.s3.rang')) && !!(await D.flag('k2.s3.bellTried')), 'Klingel ohne Mala unten: „gehört hat es keiner“, kein Fortschritt, wiederholbar');
    // Kein Karton vor der Zeit
    n = findStep('SMS: Paket'); await loadDump(n); await D.travel && null;
    const kOk = await D.ev(() => M.GS.notes.indexOf('m2_lana') >= 0 && !!M.GS.flags['k2.s3.done']); ok(kOk, 'beim Paket sind Lana und Zoras Satz bekannt (Karton öffnet sich)');
    // Tomaž mit falschen Argumenten
    n = findStep('Emina überzeugt'); await loadDump(n); await D.act('talk', 'tomaz'); await D.drain(); await D.until(s => s.overlay === 'notebook', 8000, 'Notizbuch');
    const wrong = await D.ev(() => M.E.nbOpen(true).find(id => ['s1_campus', 's1_twosevens', 's1_2316'].indexOf(id) < 0)); ok(!!wrong, 'eine sichtbare, aber falsche Notiz steht zur Wahl (' + wrong + ')'); await D.pickNote(wrong); await D.drain();
    ok(!(await D.flag('k2.s1.stay')), 'Tomaž mit falschem Argument: bleibt unruhig, geht aber nicht');
    await D.pickNote('s1_campus'); await D.drain(); await D.pickNote('s1_twosevens'); await D.drain(); ok(!!(await D.flag('k2.s1.free')), 'mit den richtigen Argumenten: die Kula schlägt sieben');
    // Hinweise an jedem Zwischenstand des Durchlaufs: nie ohne Hilfe festsitzen
    out.push('Hinweise an jedem Zwischenstand des Durchlaufs');
    { const fsx = fs.readdirSync(DUMPS).filter(f => f.endsWith('.json')).sort(); const empty = [], bad = []; const used = new Set();
      for (const f of fsx) { const d = JSON.parse(fs.readFileSync(path.join(DUMPS, f), 'utf8'));
        const r = await D.ev((g) => { const old = M.GS; M.GS = JSON.parse(JSON.stringify(g)); try { return M.hintsOpen().map(h => [h.id, h.s.length]); } finally { M.GS = old; } }, d.GS);
        if (!r.length) empty.push(d.step + ' „' + d.label + '“'); r.forEach(x => { used.add(x[0]); if (x[1] !== 4) bad.push(x[0]); }); }
      const all = await D.ev(() => M.HINTS_K2.map(h => h.id)); const never = all.filter(id => !used.has(id));
      ok(!bad.length, 'jeder offene Hinweis hat vier Stufen' + (bad.length ? ' (nicht: ' + [...new Set(bad)].join(', ') + ')' : ''));
      ok(empty.length <= 1, 'an ' + (fsx.length - empty.length) + ' von ' + fsx.length + ' Zwischenständen ist mindestens ein Hinweis offen' + (empty.length ? ' (ohne Hinweis: ' + empty.join(' · ') + ')' : ''));
      out.push('  info ' + used.size + ' von ' + all.length + ' Hinweisthemen kommen im Durchlauf vor' + (never.length ? '; nicht berührt: ' + never.join(', ') : '')); }
  } catch (e) { fail++; out.push('ABBRUCH: ' + e.message); }
  const errs = D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e)); if (errs.length) { fail++; out.push('JS-Fehler:\n' + errs.slice(0, 8).join('\n')); }
  console.log(out.join('\n')); console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`); process.exitCode = fail ? 1 : 0; await D.close2();
})();
