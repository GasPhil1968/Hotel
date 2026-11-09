// Zusatztests für Kapitel 4 (München), auf den Spielständen des Durchlaufs und mit eigenen Abläufen.
//   node game/tools/k4tests.js <dump-ordner aus MALA_DUMPALL=… node game/tools/walkthrough4.js>
//   MALA_HTML=<build>/index.html   anderer Bau;  K4T_ONLY=3,4 nur diese Tests (Fehlersuche);  K4T_DUMPS=<ordner> Stand nach jeder Handlung (für hintcheck.js)
// Jeder Test gibt „ok“ oder „FEHL“ aus, am Ende die Zusammenfassung. Gespielt wird mit Spielerhandlungen (k4play.js).
// Schalter werden nur gesetzt, wo ein Test einen Spielstand nachbaut, den der Durchlauf nicht berührt: die Übernahme aus Kapitel 3 (Probe nein,
// Zustimmung c), das Ende von Kapitel 3 (Test 1), ein unterbrochener Tageswechsel (Test 7) oder ein Gegenstand eines Nebenwegs (falscher Brief, Test 12).
const { open } = require('./driver');
const { play } = require('./k4play');
const fs = require('fs'), path = require('path');
const DUMPS = process.argv[2];
const ONLY = process.env.K4T_ONLY ? process.env.K4T_ONLY.split(',').map(s => s.trim()) : null;
let pass = 0, fails = 0;
const line = (t) => console.log(t);
function ok(c, what) { if (c) { pass++; line('  ok   ' + what); } else { fails++; line('  FEHL ' + what); } return !!c; }
(async () => {
  if (!DUMPS || !fs.existsSync(DUMPS)) { console.log('Aufruf: node game/tools/k4tests.js <dump-ordner von walkthrough4.js>'); process.exit(2); }
  const D = await open({ turbo: 25 });
  const P = play(D, { onStep: async (t) => console.log('       ' + t) });
  // K4T_DUMPS=<ordner>: nach jeder Spielerhandlung den Stand ablegen (für hintcheck.js: Hinweise auch auf den Nebenwegen der Tests)
  let curTest = '', dn = 0; const DUMPDIR = process.env.K4T_DUMPS || null;
  if (DUMPDIR) { fs.mkdirSync(DUMPDIR, { recursive: true }); const calm0 = P.calm;
    P.calm = async (...a) => { const s = await calm0(...a); const g = await D.ev(() => (M.E.screen === 'game' && /^k4_/.test(M.GS.phase) && !M.GS.ended) ? JSON.parse(JSON.stringify(M.GS)) : null).catch(() => null);
      if (g) fs.writeFileSync(path.join(DUMPDIR, String(++dn).padStart(4, '0') + '.json'), JSON.stringify({ step: dn, label: curTest + ' · ' + g.phase + ' · ' + g.pos[g.active].room, GS: g })); return s; }; }
  const { st, calm, act, exit, choose, pick, talk, bye, comb, mala, marko, travel, go, at, flag, note, said, clearLog, dlgHas, waitDlg, drive, F, N } = P;
  const errs = () => D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e));
  // ------------------------------------------------------------------ Spielstände
  const FILES = fs.readdirSync(DUMPS).filter(f => /^\d+\.json$/.test(f)).sort();
  const DUMP = FILES.map(f => JSON.parse(fs.readFileSync(path.join(DUMPS, f), 'utf8')));
  const dump = (label) => { const d = DUMP.find(x => x.label.indexOf(label) >= 0); if (!d) throw new Error('Schritt nicht gefunden: ' + label); return d; };
  // Dumps sind Momentaufnahmen: der Szenen-Riegel mala.lock einer gerade laufenden Szene wird entfernt (ein echter Stand enthält ihn nicht)
  const gsOf = (label, patch) => { const g = JSON.parse(JSON.stringify(dump(label).GS)); delete g.flags['mala.lock']; if (patch) patch(g); return g; };
  const loadGS = async (g) => { await D.ev((x) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: x }; if (!M.E.loadPreset('__t', 3)) throw new Error('Laden fehlgeschlagen'); }, g); await D.page.waitForTimeout(300); return calm(); };
  const load = async (label, patch) => loadGS(gsOf(label, patch));
  // echtes Neuladen: neue Seite mit demselben localStorage, dann M.E.loadGame(slot); optional vorher einen Stand in den Platz schreiben
  const reload = async (slot, g) => { await D.page.reload(); await D.page.waitForTimeout(300); await D.ev((t) => { M.TEST = true; M.TURBO = t; M.__speechLog = []; }, 25);
    if (g) await D.ev(([x, n]) => localStorage.setItem('mala.save.' + n, JSON.stringify({ GS: x, at: Date.now() })), [g, slot]);
    const r = await D.ev((n) => { M.E.setSlot(n); return M.E.loadGame(n); }, slot); await D.page.waitForTimeout(250); return r; };
  const saveOf = (slot) => D.ev((n) => JSON.parse(localStorage.getItem('mala.save.' + n) || 'null'), slot);
  const waitFor = async (fn, ms, what) => { const t0 = Date.now(); for (;;) { const r = await fn(); if (r) return r; if (Date.now() - t0 > ms) throw new Error('Zeitüberschreitung: ' + what); await D.page.waitForTimeout(40); } };
  const T = async (nr, name, fn) => { if (ONLY && ONLY.indexOf(String(nr)) < 0) return; line('\n' + nr + '. ' + name); curTest = 'Test ' + nr; const e0 = errs().length;
    try { await fn(); } catch (e) { fails++; line('  FEHL Abbruch: ' + e.message.split('\n')[0]); console.log(e.message.split('\n').slice(1).join('\n')); }
    const e1 = errs(); if (e1.length > e0) { fails++; line('  FEHL JS-Fehler: ' + e1.slice(e0, e0 + 3).map(x => x.split('\n')[0]).join(' | ')); } };
  // Titelbild wie ein Spieler bedienen: Eintrag der HTML-Schicht (07_shell.js) über seine Beschriftung antippen (M.shell.pick wirkt wie ein Tipp auf den Eintrag)
  const tapTitle = async (label) => D.ev((lb) => { M.shellSync(); const r = M.shell.pick(lb); if (!r || !r.label) throw new Error('Titelzeile fehlt: ' + lb + ' | ' + M.titleLabels().join(' | ') + ' ' + JSON.stringify(r)); return r.label; }, label);
  // das Bild „Im Bus nach München“ beim Kapitelstart abfangen und seine Zeilen lesen
  const busMemory = async () => { await D.until(s => s.overlay === 'memory', 30000, 'Bild „Im Bus“'); const L = await D.ev(() => M.E.overlay.data.lines.slice()); await D.ev(() => M.TA.closeOverlay()); return L; };
  const start4 = async (c3) => { await D.ev((c) => { M.__speechLog = []; if (c) localStorage.setItem('mala.c3end', JSON.stringify(c)); else localStorage.removeItem('mala.c3end'); M.E.setSlot(2); M.E.newGame(4); }, c3);
    const L = await busMemory(); await calm(); return L; };
  const lastSaid = () => D.ev(() => { const L = M.__speechLog || []; return L.length ? L[L.length - 1][1] : ''; });
  const closeMap = async () => { await D.ev(() => { if (M.E.overlay && M.E.overlay.kind === 'map') M.closeMap(); }); return calm(); };
  const bed = () => act('use', 'sofa');
  const toCredits = async () => { for (let i = 0; i < 300; i++) { const s = await st(); if (s.screen === 'credits' || s.screen === 'title') return s; if (s.overlay === 'memory' || s.overlay === 'doc') await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(150); } throw new Error('kein Abspann'); };
  // das Silvestergespräch auf dem besten Weg (Notizen in der Reihenfolge des Gesprächs)
  const FIN_PREFS = ['Erzählen. Nur', 'Warten', 'Etwas aus dem Notizbuch', 'Sie haben ihn', 'Weil er weiß', 'Ich komme mit'];
  const finTalk = (notes, prefs) => drive(prefs || FIN_PREFS, async s => s.phase === 'k4_epi' && !s.busy, { label: 'Silvestergespräch', notes: notes || ['z4_dabei', 'z4_zweistaedte', 'z4_kurve'], max: 200 });

  // ================================================================== 1. Einstieg
  await T(1, 'Nach dem Abspann von Kapitel 3: „Weiter mit Kapitel 4“, Übernahme Zustimmung c, Probe nein', async () => {
    await D.ev(() => { localStorage.removeItem('mala.c3end'); const G = M.freshGame(); G.phase = 'k3_epi_d'; G.tod = M.PHASES.k3_epi_d.tod; G.active = 'marko'; G.malaOn = true; const s0 = (M.ART.ostbus && M.ART.ostbus.start) || [160, 124, 'R'];
      G.pos.marko = { room: 'ostbus', x: s0[0], y: s0[1], f: 'R' }; G.pos.mala = { room: 'ostbus', x: s0[0] - 14, y: s0[1] - 2, f: 'R' }; G.inv = ['mobitel', 'dzezva', 'olovka', 'photo_full', 'vizitka']; G.map = { ostbus: true };
      Object.assign(G.flags, { 'met.mala': true, 'k3.epi.started': true, 'k3.epid.started': true, 'k3.e.nada': true, 'k3.e.mother': true, 'k3.fin.consent': 'c', 'k3.p.promise': 'b', 'k3.d3.talk2v': 'c', 'k3.e.sample': false, 'k3.askCount': 1, 'k3.skips': 2 });
      M.PRESETS.__k3 = { GS: G }; M.E.loadPreset('__k3', 1); });
    await calm(); await D.ev(() => M.TA.act('use', 'bus'));
    await toCredits(); await D.until(s => s.screen === 'credits' || s.screen === 'title', 60000, 'Abspann von Kapitel 3'); await D.page.waitForTimeout(300);
    await D.ev(() => { M.E.creditsAt = M.E.gt() - 999999; }); await D.until(s => s.screen === 'title', 30000, 'Titelbild nach dem Abspann');
    const lb = await D.ev(() => ({ mode: M.E.titleMode, labels: M.titleLabels() }));
    ok(lb.mode === 'next' && lb.labels[0] === 'Weiter mit Kapitel 4: München', 'nach dem Abspann von Kapitel 3: „Weiter mit Kapitel 4: München“ (' + lb.labels.join(' · ') + ')');
    const c3 = await D.ev(() => JSON.parse(localStorage.getItem('mala.c3end') || 'null'));
    ok(c3 && c3.consent === 'c' && c3.sample === false && c3.promise === 'b', 'M.endChapter3 merkt die Übernahme in mala.c3end (' + JSON.stringify(c3) + ')');
    await tapTitle('Weiter mit Kapitel 4'); const mem = await busMemory(); await calm(); await waitDlg('(Antworten');
    const s = await st(); ok(s.phase === 'k4_pro' && s.room === 'zob', '„Weiter“ startet Kapitel 4 am ZOB (' + s.phase + ', ' + s.room + ')');
    ok(mem.some(l => /Frag mich in München noch mal/.test(l)) && mem.some(l => /nichts aus Mostar/.test(l)) && mem.some(l => /selten gefragt/.test(l)), 'Bild „Im Bus“: Zustimmung c, keine Probe, selten gefragt');
    ok(await D.ev(() => { const c = M.k4Carry; return c.consent === 'c' && c.sample === false && c.promise === 'b' && c.talk2 === 'c' && c.fromSave && M.k4Variant() === 'no'; }), 'M.k4Carry aus Kapitel 3 übernommen (c, Probe nein, Fassung „nein“)');
    await choose('(Nicht antworten.)');
  });
  // ================================================================== 2. Übernahmen
  await T(2, 'Übernahmen aus localStorage[\'mala.c3end\']: Zustimmung a, b, c und ohne Stand', async () => {
    const CASES = [['a', { consent: 'a', promise: 'a', talk2: 'a', sample: true, asks: 4, skips: 0 }, /„Einfach so\?“/], ['b', { consent: 'b', promise: 'c', talk2: 'b', sample: true, asks: 3, skips: 1 }, /sagen wir es/], ['c', { consent: 'c', promise: 'a', talk2: 'a', sample: false, asks: 0, skips: 3 }, /Frag mich in München/]];
    for (const [k, c3, rx] of CASES) {
      const L = await start4(c3); const f = await D.ev(() => ({ c: M.GS.flags['k4.c3.consent'], s: M.GS.flags['k4.c3.sample'], fs: M.GS.flags['k4.c3.fromSave'], v: M.k4Variant() }));
      ok(L.some(l => rx.test(l)) && f.c === k && f.s === c3.sample && f.fs === true && f.v === (c3.sample ? 'yes' : 'no'), 'Zustimmung ' + k + ': Bild „Im Bus“ und Schalter (' + JSON.stringify(f) + ')');
      ok(L.some(l => (c3.sample ? /Quittung aus Mostar/ : /nichts aus Mostar/).test(l)), 'Zustimmung ' + k + ': Probe ' + (c3.sample ? 'ja (Quittung)' : 'nein'));
    }
    const L = await start4(null); const f = await D.ev(() => M.k4Carry);
    ok(f.consent === 'b' && f.sample === true && f.promise === 'a' && !f.fromSave && L.some(l => /sagen wir es/.test(l)) && !L.some(l => /Kurz vor München/.test(l)), 'ohne Stand: Vorgaben b, Probe ja, kein Satz über das Fragen (' + JSON.stringify(f) + ')');
    ok(await D.ev(() => ['k4_c_lana', 'k4_c_vater'].every(n => M.GS.notes.indexOf(n) >= 0) && ['dzezva', 'mobitel', 'vizitka', 'vanilice'].every(i => M.GS.inv.indexOf(i) >= 0)), 'Notizen aus Mostar und Gegenstände (Džezva, Handy, Davors Karte, Nadas Dose) sind da');
  });
  // ================================================================== 3. Fassung „Probe nein“
  await T(3, 'Fassung „Probe nein“: Kolars Anruf, Ana, das Konsulat (Dienstag zu früh, Mittwoch), der Mittwoch endet erst mit der Probe, Silvester-Zug 8', async () => {
    const no = (g) => { g.flags['k4.c3.sample'] = false; g.map.konsulat = true; };   // in Fassung nein schaltet Kolars Anruf das Konsulat frei
    await load('Mala liest die Kiste', no); await marko(); await bed(); await D.until(s => s.phase === 'k4_d2', 90000, 'Dienstag');
    await drive(['Ein Rechenschieber', 'Was steht noch', 'Das ist er', 'Meine Großmutter'], async s => s.phase === 'k4_d2' && !s.dlg && !s.busy && await F('k4.d2.kolar'), { label: 'Kolar (nein)', strict: false });
    ok(await N('z4_kolar') && await N('z4_kode') && !(await N('z4_ana2004')), 'Kolar, Fassung nein: z4_kolar, z4_kode, noch kein z4_ana2004');
    ok(await D.ev(() => !!M.GS.map.konsulat), 'das Generalkonsulat steht auf dem Plan');
    await exit('door'); await exit('exit'); await go('konsulat'); await talk('beamtin'); await drive(['Ich komme wegen', 'Auf Wiedersehen'], async s => !s.dlg && !s.overlay, { label: 'Konsulat Dienstag', strict: false });
    ok(!(await F('k4.e.sample2')), 'Dienstag im Konsulat: die Karte ist noch nicht da, keine Probe');
    await go('giesing', 'ana'); await act('talk', 'ana'); await drive(['Frau Kolar hat eine Probe', '(Schweigen.)', 'Sie hat ein Recht', 'Gut. Nach Neujahr', 'Ich gehe'], async s => !s.dlg && !s.overlay && await F('k4.d2.wait'), { label: 'Ana (nein)', strict: false });
    ok(await N('z4_ana2004') && await F('k4.d2.ana'), 'Fassung nein: Ana gibt z4_ana2004');
    // Mittwoch: Gerdas Entschluss, aber die Probe fehlt
    await load('Frau Ertl erlaubt einen Versuch', no); await mala(); await act('talk', 'gerda');
    await drive(['(Ihr sagen, was die Versuche', '(Die Versuche erzählen.)', 'Hat er früher gefroren'], async () => await F('k4.g.decided'), { label: 'Gerda', notes: ['g4_beides'] }); await calm(); await D.page.waitForTimeout(800); await calm();
    ok((await st()).phase === 'k4_d3', 'Fassung nein: Sepp und Gerda erledigt, ohne Probe bleibt es Mittwoch');
    await marko(); await clearLog(); await exit('elevator'); await exit('door'); await go('westend', 'jhaus'); await exit('up'); await bed(); ok(await said('Die Probenkarte von Frau Kolar'), 'das Bett sagt, was fehlt: „' + (await lastSaid()) + '“');
    await exit('door'); await exit('exit'); await go('konsulat'); await talk('beamtin'); await drive(['Ich komme wegen', '(Den Finger hinhalten.)'], async () => await F('k4.e.sample2'), { label: 'Konsulat Mittwoch', strict: false });
    ok(await F('k4.e.sample2'), 'Mittwoch im Konsulat: Probe abgegeben (k4.e.sample2)');
    await D.until(s => s.phase === 'k4_d4', 90000, 'Donnerstag'); await calm(); ok((await st()).phase === 'k4_d4', 'mit der Probe beginnt der Donnerstag');
    // Silvester, Zug 6 und 8 in Fassung nein
    await load('Kevin an der Tür', (g) => { no(g); g.flags['k4.e.sample2'] = true; }); await clearLog(); await exit('stairs'); await exit('door214'); await finTalk();
    ok(await said('Ich habe meine Probe gegeben') && await said('Meine Probe ist schon dort'), 'Silvester, Fassung nein: Zug 6 „Ich habe meine Probe gegeben“, Zug 8 „Meine Probe ist schon dort“');
  });
  // ================================================================== 4. Malas Geheimnis
  await T(4, 'Malas Geheimnis im Notizbuch: vor dem Streit nicht als Marko, z4_tot als Mala; nach dem Streit gehört es beiden', async () => {
    await load('Frau Kolar ruft an');
    const vis = () => D.ev(() => M.E.nbOpen(true, ['z4_nachricht', 'z4_antrag', 'z4_passierschein', 'z4_kode']));
    let v = await vis(); ok(v.indexOf('z4_nachricht') < 0 && v.indexOf('z4_passierschein') < 0 && v.indexOf('z4_kode') >= 0, 'Marko, vor dem Streit: im Gespräch fehlen Malas Notizen (' + v.join(', ') + ')');
    let r = await D.combine('z4_nachricht', 'z4_kode'); await calm(); ok(!(r && r.ok) && !(await N('z4_tot')), 'Marko kann z4_tot vor dem Streit nicht ziehen (' + JSON.stringify(r && (r.t || r.msg || r)).slice(0, 90) + ')');
    await mala(); v = await vis(); ok(v.indexOf('z4_nachricht') >= 0, 'als Mala stehen ihre Notizen zur Wahl');
    r = await D.combine('z4_nachricht', 'z4_kode'); await calm(); ok(r && r.ok && await N('z4_tot') && await D.ev(() => M.k4NoteHidden('z4_tot')), 'Mala zieht z4_tot; es bleibt ihr Geheimnis');
    await marko(); r = await D.combine('z4_vermisst', 'z4_tot'); await calm(); ok(!(r && r.ok), 'Marko kann mit z4_tot vor dem Streit nichts verbinden');
    await load('Karte „Donnerstag · Abend“; der Streit'); v = await vis();
    ok(await F('k4.r.shared') && v.indexOf('z4_nachricht') >= 0 && !(await D.ev(() => M.k4NoteHidden('z4_nachricht'))), 'nach dem Streit (k4.r.shared): Malas Notizen gehören Marko');
  });
  // ================================================================== 5. Mala allein
  await T(5, 'Mala allein: Ausgänge, Stadtplan, bleibt im Raum, nachts nur in der Wohnung, Donnerstagabend bis Freitag fort', async () => {
    await load('Spaziergang mit Ana'); await mala(); await exit('exit'); let s = await st(); ok(s.room === 'map', 'Mala geht allein durch den Ausgang (Stadtplan offen)');
    await travel('hbf'); s = await st(); let pos = await D.ev(() => ({ mk: M.GS.pos.marko.room, ma: M.GS.pos.mala.room }));
    ok(s.room === 'gleis11' && s.active === 'mala' && pos.mk === 'wiesn', 'Mala fährt allein zum Hauptbahnhof, Marko bleibt auf der Wiesn (' + JSON.stringify(pos) + ')');
    await marko(); s = await st(); ok(s.room === 'wiesn' && s.active === 'marko', 'Wechsel zu Marko lädt seinen Raum (' + s.room + ')');
    await go('westend', 'jhaus'); pos = await D.ev(() => ({ mk: M.GS.pos.marko.room, ma: M.GS.pos.mala.room })); ok(pos.ma === 'gleis11', 'Marko geht, Mala bleibt an Gleis 11 (' + JSON.stringify(pos) + ')');
    await mala(); s = await st(); ok(s.room === 'gleis11', 'Wechsel zu Mala lädt ihren Raum');
    await travel('westend'); await marko(); await exit('up'); pos = await D.ev(() => ({ mk: M.GS.pos.marko.room, ma: M.GS.pos.mala.room })); ok(pos.mk === 'jwohnung' && pos.ma === 'jwohnung', 'im selben Raum folgt sie wie immer (' + JSON.stringify(pos) + ')');
    // nachts
    await load('Karte „Christtag · Abend“'); s = await st(); ok(s.active === 'mala', 'Christtag-Abend: Mala ist am Zug');
    await exit('door'); s = await st(); ok(s.room === 'jhaus', 'nachts: durch die Wohnungstür ins Treppenhaus (' + s.room + ')');
    await clearLog(); await exit('exit'); s = await st(); ok(s.room === 'jhaus', 'nachts: nicht aus dem Haus („' + (await lastSaid()) + '“)');
    await exit('up'); await exit('bedroom'); s = await st(); ok(s.room === 'jschlaf', 'nachts: ins Schlafzimmer zur Kiste');
    await clearLog(); await D.ev(() => M.TA.travel('hbf')); await D.page.waitForTimeout(80); await calm(); await closeMap(); s = await st(); ok(s.room === 'jschlaf', 'nachts: kein Stadtplan für Mala („' + (await lastSaid()) + '“)');
    // Donnerstagabend bis Freitag
    for (const lb of ['Karte „Donnerstag · Abend“; der Streit', 'Schlaf; Karte „Fünfter Tag', 'Ana: „Mama stand bis zur Kurve']) {
      await load(lb); await D.ev(() => M.E.switchChar()); await D.page.waitForTimeout(200); s = await st();   // wie der Spieler: Porträt antippen
      ok(s.active === 'marko' && await D.ev(() => M.k4MalaAway(M.GS) && !M.GS.malaOn && !M.E.ACT.mala), s.phase + ': Mala ist fort, nicht wählbar, nicht zu sehen');
    }
    await load('Karte „Freitag · Nacht“'); ok(await D.ev(() => !M.k4MalaAway(M.GS) && M.GS.malaOn), 'nach der Brücke ist sie wieder da');
  });
  // ================================================================== 6. Reiseregeln
  await T(6, 'Reiseregeln: Nächte, Silvesterabend, Silvesternacht mit den drei Wegen zum Heim, Epilog', async () => {
    // wie ein Spieler: aus Mamas Wohnung erst hinaus ins Treppenhaus und auf die Straße (dort öffnet sich der Plan); Marko spielt, außer der Stand sagt anderes
    const refuse = async (label, loc, what, asMala) => { await load(label); if (!asMala && (await st()).active === 'mala') await marko();
      if ((await st()).room === 'jwohnung' && !asMala) { await exit('door'); if ((await st()).room === 'jhaus') { await exit('exit'); await closeMap(); } }
      const r0 = (await st()).room; await clearLog(); await D.ev((l) => M.TA.travel(l), loc); await D.page.waitForTimeout(80); await calm(); const t = await lastSaid(); await closeMap(); const s = await st();
      ok(s.room === r0 && t.length > 3, what + ': „' + t + '“'); return t; };
    await refuse('Karte „Heiligabend“, bei Ana', 'westend', 'Heiligabend, Abend');
    await refuse('Karte „Christtag · Abend“', 'hbf', 'Christtag-Abend (Mala)', true);
    let t = await refuse('Karte „Dienstag · Abend“', 'hbf', 'Dienstag, Abend');
    await load('Karte „Dienstag · Abend“'); await clearLog(); await exit('door'); ok((await st()).room === 'jwohnung' && await said('Es ist Nacht'), 'abends geht Marko nicht aus der Wohnung: „' + (await lastSaid()) + '“');
    await refuse('Karte „Donnerstag · Abend“; der Streit', 'giesing', 'Donnerstag, Abend');
    await refuse('Karte „Finale · Silvester“', 'heim', 'Silvesterabend: nur Ana');
    t = await refuse('Bleigießen um elf', 'heim', 'Silvesternacht vor der Spur'); ok(/Wohin|wohin/.test(t), 'vor der Spur: „Wohin?“');
    await refuse('Mala liest die Spur', 'zob', 'Silvesternacht nach der Spur: nur das Heim');
    await refuse('Karte „Epilog', 'giesing', 'Neujahr');
    for (const [way, lbl, rx] of [['tram', '(Mit der Nachttram.)', /Nachttram/], ['walk', '(Zu Fuß.)', /zu Fuß/], ['davor', '(Davor anrufen.)', /Diesmal ist keiner zu spät/]]) {
      await load('Mala liest die Spur'); await clearLog(); await D.ev(() => M.TA.travel('heim')); await waitDlg('(Mit der Nachttram.)');
      if (way === 'tram') ok(await dlgHas('(Zu Fuß.)') && await dlgHas('(Davor anrufen.)'), 'drei Wege zum Heim, Davor nur mit seinem Angebot (k4.v.car)');
      await choose(lbl); await calm(); const s = await st(); ok(s.room === 'heim' && await F('k4.fin.ride') === way && await said(rx.source.replace(/\\/g, '')), 'Weg „' + way + '“: Ankunft am Heim');
      await exit('stairs'); await exit('door214'); await finTalk(); ok(await F('k4.fin.done'), 'Weg „' + way + '“: Gespräch bis zum Ende');
      if (way === 'walk') ok(await said('Zehn nach eins'), 'zu Fuß: Ana kommt um zehn nach eins');
    }
    await load('Mala liest die Spur', (g) => { g.flags['k4.v.car'] = false; }); await D.ev(() => M.TA.travel('heim')); await waitDlg('(Mit der Nachttram.)');
    ok(!(await dlgHas('(Davor anrufen.)')), 'ohne Davors Angebot: nur Nachttram und zu Fuß'); await choose('(Mit der Nachttram.)'); await calm();
  });
  // ================================================================== 7. Laden
  await T(7, 'Laden an jedem Tageswechsel (unterbrochen, M.PENDING_X) und an den Silvester-Zwischenständen 1 bis 3', async () => {
    const addN = (g, ...ids) => ids.forEach(i => { if (g.notes.indexOf(i) < 0) g.notes.push(i); });
    const X = [
      ['k4_pro → k4_pro_n', 'Kaffee in Großmutters', (g) => { Object.assign(g.flags, { 'k4.p.jasna': true, 'k4.p.vanilice': true, 'k4.p.lana': true, 'k4.eve.started': true }); g.inv = g.inv.filter(i => i !== 'vanilice'); addN(g, 'u4_klopfen', 'u4_nichtheute'); }, null, 'k4_pro_n'],
      ['k4_pro_n → k4_d1 (Bett)', 'Tobias lernt Bosnisch', (g) => { Object.assign(g.flags, { 'k4.p.eve': true, 'k4.p.talk1': true, 'k4.d1.started': true }); addN(g, 'r4_kopf'); g.pos.marko.room = 'jwohnung'; g.pos.mala.room = 'jwohnung'; }, bed, 'k4_d1'],
      ['k4_d1 → k4_d1_n', 'Haus am Bavariapark: Mama bekommt', (g) => { Object.assign(g.flags, { 'k4.g.found': true, 'found.gerda': true, 'k4.d1n.started': true }); addN(g, 'g4_gerda'); }, null, 'k4_d1_n'],
      ['k4_d1_n → k4_d2 (Bett)', 'Mala liest die Kiste', (g) => { g.flags['k4.d2.started'] = true; g.active = 'marko'; }, bed, 'k4_d2'],
      ['k4_d2 → k4_d2_n', 'Schluss: Carmela wusste', (g) => { g.flags['k4.d2n.started'] = true; g.flags['k4.g.obs'] = true; addN(g, 'g4_drei', 'g4_gong', 'g4_kalt', 'g4_spaeter'); }, null, 'k4_d2_n'],
      ['k4_d2_n → k4_d3 (Bett)', 'Karte „Dienstag · Abend“', (g) => { g.flags['k4.d3.started'] = true; }, bed, 'k4_d3'],
      ['k4_d3 → k4_d4', 'Frau Ertl erlaubt', (g) => { Object.assign(g.flags, { 'k4.g.decided': true, 'k4.g.told': true, 'k4.d4.started': true }); }, null, 'k4_d4'],
      ['k4_d4 → k4_d4_n', 'Zwischenwelt: Marko hilft Gerda', (g) => { Object.assign(g.flags, { 'k4.g.thermos': true, 'k4.d4n.started': true }); g.inv = g.inv.filter(i => i !== 'kanne'); }, null, 'k4_d4_n'],
      ['k4_d4_n → k4_d5 (Bett)', 'Karte „Donnerstag · Abend“; der Streit', (g) => { g.flags['k4.d5.started'] = true; }, bed, 'k4_d5'],
      ['k4_d5 → k4_d5_n', 'Schlüsse: Mama hat „vermisst“', (g) => { g.flags['k4.d5n.started'] = true; addN(g, 'z4_zweistaedte'); }, null, 'k4_d5_n'] ];
    for (const [name, label, patch, act0, want] of X) {
      const r = await reload(2, gsOf(label, patch)); let got = null;
      try { await calm(); if (act0) await act0(); await D.until(s => s.phase === want, 90000, want); await calm(); got = (await st()).phase; } catch (e) { got = 'Fehler: ' + e.message.split('\n')[0].slice(0, 120); }
      ok(r === true && got === want, 'unterbrochen ' + name + ': nach dem Laden nachgeholt (' + got + ', ' + (await st()).room + ')');
    }
    // Freitagnacht: Laden auf der Brücke; Silvesterabend vor „Jasna ist fort“
    { await reload(2, gsOf('Schluss: derselbe Satz, zwei Städte')); let got;
      try { await drive(['Ich habe dich gesucht', 'Das war gemein', '(Erzählen.)', 'Und ich habe gesagt', 'Fünf Tage', 'Ich nicht. Morgen', 'Und wenn ich nicht mehr kann', '(Zum Käse.)'], async s => s.phase === 'k4_fin_a' && !s.busy && !s.dlg && await F('k4.fin.eve'), { label: 'Brücke nach dem Laden', max: 200 }); got = await N('z4_dabei'); } catch (e) { got = e.message.split('\n')[0]; }
      ok(got === true, 'k4_d5_n: nach dem Laden auf der Brücke beginnt Dialog 2 neu und führt zum Silvesterabend (' + got + ')'); }
    { await reload(2, gsOf('Karte „Finale · Silvester“')); await calm(); await clearLog(); let got;
      try { await act('use', 'table'); await drive(['(Blei gießen.)', '(Zum Käse.)'], async s => s.phase === 'k4_fin_n' && s.active === 'mala' && !s.busy && !s.dlg, { label: 'Silvesterabend nach dem Laden' }); got = await F('k4.fin.gone'); } catch (e) { got = e.message.split('\n')[0]; }
      ok(got === true, 'k4_fin_a: nach dem Laden weiter bis „Mama ist fort“ (' + got + ')'); }
    // Silvesternacht vor der Spur: bei Ana, die Spur beginnt neu
    { await reload(2, gsOf('Bleigießen um elf')); await calm(); let s = await st(); ok(s.phase === 'k4_fin_n' && s.room === 'ana' && !(await F('k4.fin.trail')), 'k4_fin_n vor der Spur: bei Ana nach Mamas Weggang');
      if (s.active !== 'mala') await mala(); await exit('door'); ok(await F('k4.fin.trail'), 'die Spur lässt sich nach dem Laden lesen'); }
    // die Zwischenstände 1 bis 3: so, wie das Spiel sie speichert
    await loadGS(gsOf('Kevin an der Tür')); const CP = {};
    await exit('stairs'); await D.ev(() => M.TA.exit('door214'));
    for (const n of [1, 2]) {
      await drive(FIN_PREFS, async () => { const sv = await saveOf(3); if (sv && sv.GS.flags['k4.fin.cp'] === n) { CP[n] = sv; return true; } return false; }, { label: 'Zwischenstand ' + n, notes: ['z4_dabei', 'z4_zweistaedte', 'z4_kurve'], max: 200 });
      ok(!!CP[n], 'Zwischenstand ' + n + ' gespeichert (Zug ' + (CP[n].GS.flags['k4.fin.step'] || 0) + ')');
    }
    // Zwischenstand 3 liegt direkt vor Anas Ankunft, die ohne Auswahl abläuft: den Platz sofort nach „Ich komme mit.“ lesen, bevor eine spätere Sicherung ihn ersetzt
    await drive(FIN_PREFS.filter(p => p !== 'Ich komme mit'), async (s) => !!(s.dlg && s.dlg.some(t => t.indexOf('Ich komme mit') >= 0)), { label: 'bis Zug 8', notes: ['z4_dabei', 'z4_zweistaedte', 'z4_kurve'], max: 200 });
    await D.ev(() => M.TA.choose('Ich komme mit'));
    CP[3] = await waitFor(async () => { const sv = await saveOf(3); return sv && sv.GS.flags['k4.fin.cp'] === 3 ? sv : null; }, 60000, 'Zwischenstand 3');
    ok(!!CP[3] && !CP[3].GS.flags['k4.fin.done'] && CP[3].GS.flags['k4.fin.step'] === 8, 'Zwischenstand 3 gespeichert (Zug 8, vor Anas Ankunft)');
    await finTalk(); ok(await F('k4.fin.done'), 'das Gespräch läuft nach den Zwischenständen weiter bis zum Ende');
    const WANT = { 1: 'Du wolltest reden', 2: 'Ich bin ohne dich gefahren. Das habe ich gesagt', 3: 'Zwanzig vor eins' };
    for (const n of [1, 2, 3]) {
      const r = await reload(2, CP[n].GS);   // reload leert das Protokoll vor dem Laden
      let s; try { s = await finTalk(); } catch (e) { s = { phase: e.message.split('\n')[0] }; }
      const sw = await said(WANT[n]), kv = await said('Kevin hat dich reingelassen'), first = await D.ev(() => (M.__speechLog || []).slice(0, 3).map(x => x[1].slice(0, 40)).join(' | '));
      ok(r === true && s.phase === 'k4_epi' && sw && (n === 1 || !kv), 'Zwischenstand ' + n + ': nach Neuladen weiter („' + WANT[n] + '“) bis zum Epilog (' + s.phase + '; zuerst: ' + first + ')');
    }
    // Epilog nach dem Laden
    { await reload(2, gsOf('Karte „Epilog')); await calm(); await act('talk', 'jasna'); await drive(['Nada wartet', '(Den Nachruf schreiben.)', 'Woran denkst'], async () => false, { label: 'Epilog nach dem Laden', max: 200, strict: false });
      ok(await D.ev(() => !!localStorage.getItem('mala.c4end')), 'k4_epi: nach dem Laden bis zum Abspann'); }
  });
  // ================================================================== 8. Fehlwege
  await T(8, 'Fehlwege: falscher Brief, Wahrheit direkt zu Alois, Kraus und „Geist“, zu früh mit Mama reden, die Silvester-Fehlzüge', async () => {
    // der falsche Brief
    await load('ein Aushang vom Kiosk'); await clearLog(); await act('talk', 'sepp'); await drive(['Giuseppe Ruggiero.', '(Den Brief schreiben.)', '(Trotzdem schreiben.)', 'Arrivederci'], async s => !s.dlg && !s.overlay, { label: 'falscher Brief', strict: false });
    ok(await said('Ich helfe nicht bei noch einem') && (await st()).inv.indexOf('brief_falsch') >= 0 && await F('k4.s.fake'), 'falscher Brief: Malas Nein, Marko schreibt trotzdem (brief_falsch, k4.s.fake)');
    ok(await said('E a febbraio'), 'Peppino: „E a febbraio?“ – der Weg bleibt offen');
    await clearLog(); await act('give', 'sepp', 'brief_falsch'); ok(await said('Senza firma'), 'den Brief geben: „Senza firma. Non vale.“');
    // Kraus und „Geist“, dann die Wahrheit direkt zu Alois
    await load('Herr Obermaier sagt die Bestattung'); await go('heim'); await exit('elevator');
    await clearLog(); await act('talk', 'kraus'); await drive(['Können Sie den Gong abstellen', 'Wegen eines Geistes', 'Danke'], async s => !s.dlg && !s.overlay, { label: 'Kraus Geist' });
    ok(await F('k4.g.krausNo') && !(await F('k4.g.chimeOff')), 'Kraus mit „Geist“: kein Abstellen heute');
    await clearLog(); await act('talk', 'kraus'); await drive(['Können Sie den Gong abstellen', 'Danke'], async s => !s.dlg && !s.overlay, { label: 'Kraus nochmal', strict: false }); ok(await said('Heut nimmer') && !(await F('k4.g.chimeOff')), 'zweiter Versuch am selben Tag: „Heut nimmer.“');
    await exit('door214'); await clearLog(); await act('talk', 'alois'); await drive(['Ihre Frau ist gestorben'], async s => !s.dlg && !s.overlay && (await st()).room === 'heim_flur', { label: 'Alois direkt', strict: false });
    ok(await F('k4.g.blunt') && await said('Nie wieder'), 'Alois direkt „Ihre Frau ist gestorben“: Mama: „Nie wieder.“');
    await clearLog(); await act('use', 'clock'); ok(await said('Heute nicht mehr'), 'danach heute kein Versuch: „' + (await lastSaid()) + '“'); await calm(); if ((await st()).dlg) await P.bye('(Noch nicht.)', 'Noch nicht');
    await exit('elevator'); await exit('door'); await travel('westend'); await go('heim'); await exit('elevator');
    await act('talk', 'kraus'); await drive(['Können Sie den Gong abstellen', 'Herr Lechner erschrickt', 'Danke'], async s => !s.dlg && !s.overlay, { label: 'Kraus neu' }); ok(await F('k4.g.chimeOff'), 'an einem neuen Nachmittag geht es weiter: Kraus stellt den Gong ab');
    // zu früh mit Mama reden (Dienstagabend)
    await load('Karte „Dienstag · Abend“'); await clearLog(); await act('talk', 'jasna'); await drive(['Mama. Ich muss dir etwas sagen. Über Tata.'], async s => !s.dlg && !s.overlay, { label: 'zu früh', notes: ['z4_kolar'], strict: false });
    ok(await said('Ich habe keine Probe gegeben') && await said('Zu früh') && await F('k4.d2.bed'), 'zu früh mit Mama: sie steht auf, „Ich muss morgen früh zum Dienst“; Mala: „Zu früh.“');
    await bed(); await D.until(s => s.phase === 'k4_d3', 90000, 'Mittwoch'); await calm(); ok((await st()).phase === 'k4_d3', 'ohne Folgen: der Mittwoch beginnt');
    // Silvester-Fehlzüge
    await load('Kevin an der Tür'); await clearLog(); await exit('stairs'); await exit('door214');
    await finTalk(['z4_kolar', 'z4_vermisst', 'z4_dabei', 'z4_tot', 'z4_zweistaedte', 'z4_kurve_ana'], ['(Erzählen. Alles.)', 'Mama …', 'Ihr musstet fahren', 'Frau Kolar hat angerufen', 'Weil ihm einer', '(Ihre Hand nehmen.)']);
    ok(await F('k4.fin.anaEarly') && await said('Fang bei dir an'), 'Zug 1 „Sie haben ihn gefunden“: Anas Geheimnis zu früh, Mama geht hinaus, Mala: „Fang bei dir an.“');
    ok(await said('Nicht den Satz. Was er bedeutet hat.'), 'Zug 1 mit „vermisst“: „Nicht den Satz.“');
    ok(await said('Nicht Ruža. Er.'), 'Zug 3 mit z4_tot allein: „Nicht Ruža. Er.“');
    ok(await F('k4.fin.kurve') === false && await said('Ich hätte aussteigen können'), 'Zug 5 ohne Kurve: „Ich hätte aussteigen können.“');
    ok(await F('k4.fin.done') && await F('k4.fin.decide'), 'alle Fehlzüge führen zurück: Mama entscheidet sich trotzdem');
    await act('talk', 'jasna'); await clearLog(); await drive(['Woran denkst', 'Später'], async s => !s.dlg && !s.overlay, { label: 'Epilog ohne Kurve', strict: false }); ok(await said('Ich hätte aussteigen können'), 'Epilog ohne Kurve: „Ich hätte aussteigen können.“');
  });
  // ================================================================== 9. Versuche um drei in beiden Reihenfolgen
  await T(9, 'Die Versuche um drei: erst Gerda am Fenster, dann der Gong (umgekehrt zum Durchlauf)', async () => {
    await load('Herr Obermaier sagt die Bestattung'); await go('heim'); await exit('elevator');
    await exit('door214'); await act('look', 'depot_photo'); ok(await N('g4_depot'), 'vor drei: Marko sieht die Fotos in Zimmer 214 (g4_depot)'); await exit('door');
    await mala(); await act('talk', 'gerda'); await drive(['Sie haben immer draußen gewartet', '(Gehen.)'], async s => !s.dlg && !s.overlay, { label: 'Gerda Fenster' }); await marko();
    await clearLog(); await act('use', 'bench'); await drive(['(Bis drei warten.)'], async s => !s.dlg && !s.overlay && await N('g4_versuch2'), { label: 'Versuch 2 zuerst' });
    ok(await N('g4_versuch2') && !(await N('g4_versuch1')), 'Versuch 2 zuerst: er steht auf, aber friert nicht');
    let r = await D.combine('g4_versuch2', 'g4_drei'); await calm(); ok(!(r && r.ok), 'ein Versuch allein ergibt keinen Schluss');
    await exit('elevator'); await exit('door'); await travel('westend'); await go('heim'); await exit('elevator');
    await act('talk', 'kraus'); await drive(['Können Sie den Gong abstellen', 'Herr Lechner erschrickt', 'Danke'], async s => !s.dlg && !s.overlay, { label: 'Kraus' });
    await act('use', 'clock'); await drive(['(Bis drei warten.)'], async s => !s.dlg && !s.overlay && await N('g4_versuch1'), { label: 'Versuch 1 danach' });
    r = await D.combine('g4_versuch2', 'g4_versuch1'); await calm(); ok(r && r.ok && await N('g4_beides'), 'Schluss in umgekehrter Reihenfolge: g4_beides');
    // Mala fehlt beim Versuch
    await load('Herr Kraus stellt den Gong'); await mala(); await exit('door_raum'); await marko(); await clearLog(); await act('use', 'clock');
    ok(await said('Mala ist nicht hier'), 'ohne Mala im Flur: „' + (await lastSaid()) + '“'); await calm(); if ((await st()).dlg) await P.bye('(Noch nicht.)');
  });
  // ================================================================== 10. Sepps Name auf drei Wegen
  await T(10, 'Die drei Wege zu Sepps Namen', async () => {
    ok(DUMP.some(d => /Josef Rugiero ist Giuseppe Ruggiero/.test(d.label)) && (await (async () => { const g = gsOf('Schluss: Josef Rugiero ist'); return g.notes.indexOf('s4_derselbe') >= 0 && g.notes.indexOf('s4_bunker') >= 0 && g.notes.indexOf('s4_umschlag') < 0; })()), 'Weg a (Durchlauf): s4_derselbe + s4_bunker');
    await load('Schluss: Peppino ist der Sepp'); await go('hbf', 'gleis11'); await exit('mission'); await act('talk', 'wimmer'); await drive(['Kann ich den Koffer sehen', 'Danke, Frau Wimmer'], async s => !s.dlg && !s.overlay, { label: 'Koffer' });
    await note('s4_umschlag'); await comb('s4_derselbe', 's4_umschlag', 's4_name'); ok(await N('s4_name'), 'Weg b: s4_derselbe + s4_umschlag → s4_name');
    await load('Herr Obermaier: Gepäckträgerausweis'); await go('hbf', 'gleis11'); await mala(); await exit('hatch'); await act('sense', 'desk'); await exit('up'); await marko();
    await comb('s4_bunker', 's4_ausweis', 's4_name'); ok(await N('s4_name') && !(await N('s4_derselbe')), 'Weg c: s4_bunker + s4_ausweis → s4_name (ohne s4_derselbe)');
    await clearLog(); const r = await D.combine('s4_bairisch', 's4_peppino'); await calm(); ok(!(r && r.ok), 'falsche Verbindung s4_bairisch + s4_peppino: eigene Antwort (' + JSON.stringify(r && (r.t || r.msg) || '').slice(0, 80) + ')');
  });
  // ================================================================== 11. Davor
  await T(11, 'Davor: nachts nicht anrufen, Angebot auch ohne Jela, er fährt an Silvester', async () => {
    await load('Karte „Dienstag · Abend“'); await clearLog(); await D.item('use2', 'vizitka'); await calm(); ok(await said('Jetzt nicht mehr. Morgen.'), 'abends: „Jetzt nicht mehr. Morgen.“');
    await load('Moosach: Davors Balkon'); await act('talk', 'davor'); await drive(['Ich muss los', 'Wofür sollte ich'], async () => await F('k4.v.car'), { label: 'Davor Abschied', strict: false }); await calm();
    ok(await F('k4.v.car') && !(await F('k4.v.jela')), 'Angebot beim Abschied, auch ohne Jela (k4.v.car)');
    ok(gsOf('Davor fährt').flags['k4.fin.ride'] === 'davor', 'im Durchlauf fährt Davor an Silvester (k4.fin.ride = davor)');
  });
  // ================================================================== 12. Epilog mit Zustimmung c
  await T(12, 'Epilog mit Zustimmung c: Malas Frage ist Pflicht; der falsche Brief', async () => {
    await load('Karte „Epilog', (g) => { g.flags['k4.c3.consent'] = 'c'; g.flags['k4.s.fake'] = true; if (g.inv.indexOf('brief_falsch') < 0) g.inv.push('brief_falsch'); });
    await clearLog(); await act('talk', 'jasna');
    await drive(['Nada wartet', '(Den Nachruf schreiben.)', '(Ihn Carmela schicken', 'Ich weiß es nicht'], async () => false, { label: 'Epilog c', max: 200, strict: false });
    const c4 = await D.ev(() => JSON.parse(localStorage.getItem('mala.c4end') || 'null'));
    ok(c4 && c4.consent2 === 'c' && await said('Willst du das?') && await said('mehr wert als ein schnelles Ja'), 'Zustimmung c: Mala fragt „Willst du das?“, Antwort c (' + JSON.stringify(c4 && c4.consent2) + ')');
    ok(c4 && c4.fake === false || c4 && c4.fake === true, 'Abspann erreicht, mala.c4end geschrieben');
  });
  // ================================================================== 13. Hinweise in jedem Stand des Durchlaufs, keine JS-Fehler
  await T(13, 'Stände des Durchlaufs: Hinweise offen, Kapitel richtig, keine JS-Fehler', async () => {
    let gaps = [];
    for (const d of DUMP) { const r = await D.ev((g) => { const base = M.freshGame(); Object.keys(base).forEach(k => { if (g[k] !== undefined) base[k] = g[k]; }); M.migrateAll(base); return { ch: M.chapterOf(base), n: M.hintsOpen(base).length, ended: !!base.ended }; }, d.GS);
      if (r.ch !== 4) gaps.push(d.step + ' Kapitel ' + r.ch); else if (!r.n && !/Abspann/.test(d.label)) gaps.push(d.step + ' ohne Hinweis'); }
    ok(!gaps.length, DUMP.length + ' Stände: jeder in Kapitel 4 mit offenem Hinweisthema' + (gaps.length ? ' (' + gaps.join(', ') + ')' : ''));
    ok(!errs().length, 'keine JS-Fehler in allen Tests' + (errs().length ? ': ' + errs().slice(0, 3).map(x => x.split('\n')[0]).join(' | ') : ''));
  });

  line(`\nKAPITEL-4-TESTS: ${pass} ok, ${fails} FEHL`);
  process.exitCode = fails ? 1 : 0; await D.close2();
})();
