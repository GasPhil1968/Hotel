// Zusatztests für Kapitel 3 (Mostar), auf den Spielständen des Durchlaufs und mit eigenen Abläufen.
//   node game/tools/k3tests.js <dump-ordner aus MALA_DUMPALL=… node game/tools/walkthrough3.js>
//   MALA_HTML=<build>/index.html   anderer Bau;  K3T_ONLY=3,4 nur diese Tests (Fehlersuche);  K3T_DUMPS=<ordner> Stand nach jeder Handlung (für hintcheck.js)
// Jeder Test gibt „ok“ oder „FEHL“ aus, am Ende die Zusammenfassung. Gespielt wird mit Spielerhandlungen (k3play.js);
// Schalter werden nur gesetzt, wo ein Test einen unterbrochenen Spielstand nachbaut (Test 14) oder das Ende von Kapitel 2 darstellt (Test 1).
const { open } = require('./driver');
const { play } = require('./k3play');
const fs = require('fs'), path = require('path');
const DUMPS = process.argv[2];
const ONLY = process.env.K3T_ONLY ? process.env.K3T_ONLY.split(',').map(s => s.trim()) : null;
let pass = 0, fails = 0; const out = [];
const line = (t) => { out.push(t); console.log(t); };
function ok(c, what) { if (c) { pass++; line('  ok   ' + what); } else { fails++; line('  FEHL ' + what); } return !!c; }
(async () => {
  if (!DUMPS || !fs.existsSync(DUMPS)) { console.log('Aufruf: node game/tools/k3tests.js <dump-ordner von walkthrough3.js>'); process.exit(2); }
  const D = await open({ turbo: 25 });
  const P = play(D, { onStep: async (t) => console.log('       ' + t) });
  // K3T_DUMPS=<ordner>: nach jeder Spielerhandlung den Stand ablegen (für hintcheck.js: Hinweise auch auf den Nebenwegen der Tests)
  let curTest = '', dn = 0; const DUMPDIR = process.env.K3T_DUMPS || null;
  if (DUMPDIR) { fs.mkdirSync(DUMPDIR, { recursive: true }); const calm0 = P.calm;
    P.calm = async (...a) => { const s = await calm0(...a); const g = await D.ev(() => (M.E.screen === 'game' && /^k3_/.test(M.GS.phase)) ? JSON.parse(JSON.stringify(M.GS)) : null).catch(() => null);
      if (g) fs.writeFileSync(path.join(DUMPDIR, String(++dn).padStart(4, '0') + '.json'), JSON.stringify({ step: dn, label: curTest + ' · ' + g.phase + ' · ' + g.pos[g.active].room, GS: g })); return s; }; }
  const { st, calm, act, exit, choose, pick, talk, ask, bye, comb, mala, marko, travel, go, at, flag, note, said, clearLog, dlgHas, waitDlg } = P;
  const errs = () => D.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e));
  const F = (k) => D.flag(k);
  const N = (id) => D.hasNote(id);
  const RS = (r) => D.ev((x) => JSON.parse(JSON.stringify(M.RS(x) || {})), r);
  // ------------------------------------------------------------------ Spielstände
  const FILES = fs.readdirSync(DUMPS).filter(f => /^\d+\.json$/.test(f)).sort();
  const DUMP = FILES.map(f => JSON.parse(fs.readFileSync(path.join(DUMPS, f), 'utf8')));
  const dump = (label) => { const d = DUMP.find(x => x.label.indexOf(label) >= 0); if (!d) throw new Error('Schritt nicht gefunden: ' + label); return d; };
  // Dumps sind Momentaufnahmen, keine Spielstände: der Szenen-Riegel mala.lock einer gerade laufenden Szene wird entfernt (ein echter Stand enthält ihn nicht)
  const gsOf = (label, patch) => { const g = JSON.parse(JSON.stringify(dump(label).GS)); delete g.flags['mala.lock']; if (patch) patch(g); return g; };
  // wie „Laden“ im Menü, ohne Neustart der Seite (Stand in Platz 3)
  const loadGS = async (g) => { await D.ev((x) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: x }; if (!M.E.loadPreset('__t', 3)) throw new Error('Laden fehlgeschlagen'); }, g); await D.page.waitForTimeout(300); return calm(); };
  const load = async (label, patch) => loadGS(gsOf(label, patch));
  // echtes Neuladen: neue Seite mit demselben localStorage, dann M.E.loadGame(slot); optional vorher einen Stand in den Platz schreiben
  // (der Stand wird erst nach dem Neuladen in den Platz geschrieben: beim Verlassen sichert die alte Seite ihren eigenen Stand, pagehide in 99_main.js)
  const reload = async (slot, g) => { await D.page.reload(); await D.page.waitForTimeout(300); await D.ev((t) => { M.TEST = true; M.TURBO = t; M.__speechLog = []; }, 25);
    if (g) await D.ev(([x, n]) => localStorage.setItem('mala.save.' + n, JSON.stringify({ GS: x, at: Date.now() })), [g, slot]);
    const r = await D.ev((n) => { M.E.setSlot(n); return M.E.loadGame(n); }, slot); await D.page.waitForTimeout(200); return r; };
  const saveOf = (slot) => D.ev((n) => JSON.parse(localStorage.getItem('mala.save.' + n) || 'null'), slot);
  // warten, bis eine Bedingung (async) gilt
  const waitFor = async (fn, ms, what) => { const t0 = Date.now(); for (;;) { const r = await fn(); if (r) return r; if (Date.now() - t0 > ms) throw new Error('Zeitüberschreitung: ' + what); await D.page.waitForTimeout(40); } };
  // den Stand abfangen, den das Spiel gerade in den Platz schreibt (z. B. beim Wechsel oder am Zwischenstand), noch bevor eine spätere Sicherung ihn ersetzt
  // (Erinnerungsbilder und Dokumente schließt der Spieler unterdessen wie sonst auch)
  const captureSave = (slot, pred, what) => waitFor(async () => { const sv = await saveOf(slot); if (sv && pred(sv.GS)) return sv;
    await D.ev(() => { const o = M.E.overlay; if (o && (o.kind === 'memory' || o.kind === 'doc')) M.TA.closeOverlay(); }); return null; }, 90000, what);
  const SLOT = 3;   // loadGS lädt in Platz 3
  const T = async (nr, name, fn) => { if (ONLY && ONLY.indexOf(String(nr)) < 0) return; line('\n' + nr + '. ' + name); curTest = 'Test ' + nr; const e0 = errs().length;
    try { await fn(); } catch (e) { fails++; line('  FEHL Abbruch: ' + e.message.split('\n')[0]); console.log(e.message.split('\n').slice(1).join('\n')); }
    const e1 = errs(); if (e1.length > e0) { fails++; line('  FEHL JS-Fehler: ' + e1.slice(e0, e0 + 3).map(x => x.split('\n')[0]).join(' | ')); } };
  // Titelbild wie ein Spieler bedienen: Zeile suchen und über die Trefferfläche antippen (wie k2tests.js)
  const tapTitle = async (label) => D.ev((lb) => { const L = M.titleLabels(); const i = L.findIndex(t => t.indexOf(lb) >= 0); if (i < 0) throw new Error('Titelzeile fehlt: ' + lb + ' | ' + L.join(' | '));
    for (let y = 0; y < 200; y++) for (let x = 40; x < 280; x += 2) if (M.uiHit(x, y) === 't:' + i) { M.pointerDown(x, y + 3, true); M.pointerUp(x, y + 3, true); return true; } throw new Error('Zeile nicht antippbar: ' + lb); }, label);
  // das Bild „Im Bus“ beim Kapitelstart abfangen und seine Zeilen lesen
  const busMemory = async () => { await D.until(s => s.overlay === 'memory', 30000, 'Bild „Im Bus“'); const L = await D.ev(() => M.E.overlay.data.lines.slice()); await D.ev(() => M.TA.closeOverlay()); return L; };
  const stillPhase = async (p, what) => ok((await st()).phase === p, what + ' (Phase ' + (await st()).phase + ')');
  const bed = async () => { await clearLog(); await act('use', 'bed'); };
  const lastSaid = () => D.ev(() => { const L = M.__speechLog || []; return L.length ? L[L.length - 1][1] : ''; });

  // ================================================================== 1. Einstieg
  await T(1, 'Einstieg: Titelmenü, Weiter nach dem Ende von Kapitel 2, Übernahme aus Sarajevo', async () => {
    await D.ev(() => { localStorage.removeItem('mala.c2end'); M.E.toTitle(); M.E.titleMode = 'main'; });
    const labels = await D.ev(() => M.titleLabels());
    ok(labels.indexOf('Kapitel 3: Mostar') >= 0, 'Titelmenü zeigt „Kapitel 3: Mostar“ (' + labels.join(' · ') + ')');
    await tapTitle('Kapitel 3: Mostar'); ok(await D.ev(() => M.E.titleMode === 'slots' && M.E.newCh === 3), 'Kapitel 3 angetippt: die Speicherplätze erscheinen');
    await tapTitle('Platz 2'); if (await D.ev(() => M.E.titleMode === 'confirm')) await tapTitle('Ja');
    let mem = await busMemory(); await calm(); await waitDlg('(Antworten.)');
    let s = await st(); ok(s.phase === 'k3_pro' && s.room === 'ostbus', 'Kapitel 3 startet aus dem Titelmenü am Ostbusbahnhof (' + s.phase + ', ' + s.room + ')');
    ok(await D.ev(() => { const c = M.k3Carry; return c.confess === 'came' && c.whyMostar === 'bridge' && !c.hajra && !c.ana && !c.father && !c.fromSave; }), 'ohne Übernahme gelten die Vorgaben (M.k3Carry: came, bridge, keine Pita, kein Vater)');
    ok(!mem.some(l => /Pita/.test(l)), 'ohne Übernahme keine Pita im Bus');
    ok(await D.ev(() => ['k3_c_bridge', 'k3_c_name', 'k3_c_missing', 'k3_c_promise'].every(n => M.GS.notes.indexOf(n) >= 0) && ['dzezva', 'mobitel', 'photo_full', 'rueckfahrt'].every(i => M.GS.inv.indexOf(i) >= 0)), 'Notizen und Gegenstände aus Kapitel 2 sind da');
    await choose('(Nicht antworten.)');
    // Ende von Kapitel 2 wie im Spiel: Epilog am Busbahnhof Sarajevo, Fahrkarte in der Hand, „Bus nach Mostar“ benutzen (Stand nachgebaut)
    await D.ev(() => { const G = M.freshGame(); G.phase = 'k2_epi'; G.tod = M.PHASES.k2_epi.tod; G.active = 'marko'; G.malaOn = true; const st0 = (M.ART.stanica && M.ART.stanica.start) || [160, 124, 'R'];
      G.pos.marko = { room: 'stanica', x: st0[0], y: st0[1], f: 'R' }; G.pos.mala = { room: 'stanica', x: st0[0] - 14, y: st0[1] - 2, f: 'R' }; G.inv = ['busticket2', 'mobitel', 'dzezva'];
      Object.assign(G.flags, { 'met.mala': true, 'k2.epi.started': true, 'k2.epi.nada': true, 'k2.epi.ticket': true, 'k2.f2.confess': 'ruza', 'k2.epi.whyMostar': 'truck', 'k2.f2.ana': true, 'k2.i.father': true }); G.seen['pansion:hjEpi'] = 1;
      M.PRESETS.__k2 = { GS: G }; M.E.loadPreset('__k2', 1); });
    await calm(); await act('use', 'bus'); await waitDlg('Steigen wir ein.'); await D.ev(() => M.TA.choose('Steigen wir ein.'));
    for (let i = 0; i < 200; i++) { const s2 = await st(); if (s2.screen === 'credits') break; if (s2.overlay) await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(150); }
    await D.until(s => s.screen === 'credits', 60000, 'Abspann von Kapitel 2'); await D.page.waitForTimeout(300);
    await D.ev(() => { M.E.creditsAt = M.E.gt() - 999999; }); await D.until(s => s.screen === 'title', 30000, 'Titelbild nach dem Abspann');
    const lb2 = await D.ev(() => ({ mode: M.E.titleMode, labels: M.titleLabels() }));
    ok(lb2.mode === 'next' && lb2.labels[0] === 'Weiter mit Kapitel 3: Mostar', 'nach dem Abspann von Kapitel 2: „Weiter mit Kapitel 3: Mostar“ (' + lb2.labels.join(' · ') + ')');
    const c2 = await D.ev(() => JSON.parse(localStorage.getItem('mala.c2end') || 'null'));
    ok(c2 && c2.hajra === true && c2.confess === 'ruza' && c2.whyMostar === 'truck' && c2.ana === true && c2.father === true, 'M.endChapter2 merkt die Übernahme in mala.c2end (' + JSON.stringify(c2) + ')');
    await tapTitle('Weiter mit Kapitel 3'); mem = await busMemory(); await calm(); await waitDlg('(Antworten.)');
    s = await st(); ok(s.phase === 'k3_pro' && s.room === 'ostbus', '„Weiter“ startet Kapitel 3 (' + s.phase + ', ' + s.room + ')');
    ok(mem.some(l => /Hajras Pita/.test(l)), 'Übernahme wirkt: Hajras Pita auf dem leeren Sitz im Bus');
    ok(await D.ev(() => { const c = M.k3Carry; return c.confess === 'ruza' && c.whyMostar === 'truck' && c.hajra && c.ana && c.father && c.fromSave; }), 'M.k3Carry aus Kapitel 2 übernommen (ruza, truck, Pita, Ana, Vater)');
    await choose('(Antworten.)'); await D.ev(() => localStorage.removeItem('mala.c2end'));
  });

  // ================================================================== 2. Westufer vor der Überquerung
  await T(2, 'Westufer vor der Überquerung: Mala weigert sich, „(Allein gehen.)“ kehrt zurück', async () => {
    await load('Schluss: zu flach geschnitten'); const s0 = await st(); const mv0 = await F('k3.moves');
    ok(s0.phase === 'k3_d1' && !(await F('k3.mala.crossed')), 'Freitag, Mala ist noch nicht über den Fluss (' + s0.room + ')');
    await clearLog(); await D.ev(() => M.TA.travel('partizan')); await D.page.waitForTimeout(80); await calm();
    ok(await dlgHas('(Allein gehen.)') && await dlgHas('(Bei ihr bleiben.)'), 'Partisanenfriedhof gewählt: Mala weigert sich, Auswahl „(Allein gehen.)“ / „(Bei ihr bleiben.)“');
    ok(await said('Nicht über den Fluss') || await said('Ich gehe über keine Brücke'), 'Malas Satz: „' + (await D.ev(() => (M.__speechLog || []).filter(l => l[0] === 'mala').map(l => l[1]).slice(-1)[0] || '')) + '“');
    await choose('(Allein gehen.)'); await calm();
    const s1 = await st(); ok(s1.realRoom === s0.room, 'nach „(Allein gehen.)“: Marko kehrt um, kein Ortswechsel (' + s1.realRoom + ', Stadtplan bleibt offen)');
    ok((await F('k3.moves')) === mv0 && !(await F('k3.mala.crossed')), 'keine Reise gezählt, Westufer weiter zu');
    ok(await said('Ich bleibe stehen. Ich gehe zurück.'), 'die Leine zieht: „Ich bleibe stehen. Ich gehe zurück.“');
    await D.ev(() => M.TA.travel('partizan')); await D.page.waitForTimeout(80); await calm(); await choose('(Bei ihr bleiben.)'); ok((await st()).realRoom === s0.room, '„(Bei ihr bleiben.)“: ebenfalls keine Reise');
    await D.ev(() => M.closeMap()); await calm();
  });

  // ================================================================== 3. Vlado vergrault
  await T(3, 'Vlado vergrault: Laden zu, nach einem Ortswechsel am selben Tag wieder offen', async () => {
    await load('Vulkanizer Rajić: Kata und Vlado'); await at('vulkanizer');
    await talk('vlado', 'Im Januar vierundneunzig', 'Ihre Mutter sucht sie'); await calm();
    const r1 = await RS('vulkanizer'); ok(await F('k3.v.angry') && r1.closed === true, 'zu früh „Ihre Mutter sucht sie“: Vlado geht nach hinten, Laden zu');
    await clearLog(); await act('talk', 'kata'); ok(await said('Eine Stunde.') || await said('Kommen Sie wieder, wenn er drei Reifen geflickt hat.'), 'Kata: „' + (await lastSaid()) + '“');
    ok(!(await D.ev(() => !!(M.E.ACT.vlado && M.E.actorShown(M.E.ACT.vlado)))), 'Vlado ist nicht zu sehen');
    await exit('door'); await at('bulevar'); await exit('to_vulk'); await at('vulkanizer');
    const r2 = await RS('vulkanizer'); ok(!r2.closed && await D.ev(() => !!(M.E.ACT.vlado && M.E.actorShown(M.E.ACT.vlado))), 'nach einem Ortswechsel (Bulevar und zurück) ist der Laden wieder offen, Vlado vorn');
    await stillPhase('k3_d1', 'noch derselbe Tag');
    await talk('kata', 'Was steht da hinten', 'Ich bin Übersetzer'); ok((await st()).overlay === 'puzzle', 'es geht weiter: Katas E-Mail');
    await D.ev(() => M.TA.closeOverlay(null)); await calm(); await bye('(Gehen.)', 'Ich weiß es nicht');
  });

  // ================================================================== 4. Kata und die Schublade
  await T(4, 'Kata und die Schublade: „Welche?“ vor Malas Blick, kein Raten, danach mit Malas Blick', async () => {
    await load('Vulkanizer Rajić: Kata und Vlado');
    await talk('kata', 'Was steht da hinten', 'Ich bin Übersetzer');
    await D.until(s => s.overlay === 'puzzle', 20000, 'E-Mail');
    const wrong = await D.ev(() => { const c = M.E.overlay.data.check; return [c([0, 1, 0, 0]), c([1, 0, 0, 0]), c([1, 1, 2, 0]), c([1, 1, 0, 1])]; });
    ok(wrong.every(r => !r.ok && r.msg && r.msg.length > 10) && new Set(wrong.map(r => r.msg)).size === 4, 'E-Mail: jede falsche Zeile hat eine eigene Antwort');
    await P.solve([1, 1, 0, 0]); await waitDlg('Ich weiß es nicht');
    ok(await flag('k3.v.which').then(() => true) && !(await dlgHas('Die unterste')), 'Kata fragt „Welche?“; ohne Malas Blick gibt es „Die unterste.“ nicht');
    ok(await dlgHas('Eine davon wird es schon sein'), 'Raten wird angeboten …');
    await clearLog(); await choose('Eine davon wird es schon sein');
    ok(!(await F('k3.v.drawer')) && await said('Wenn ich ihn frage, muss es die richtige sein.'), '… und abgelehnt: „Wenn ich ihn frage, muss es die richtige sein.“');
    await bye('(Gehen.)');
    await talk('kata', 'Die Schublade.'); await clearLog(); await choose('Ich weiß es nicht'); ok(!(await F('k3.v.drawer')) && await said('Dann warte ich.'), '„Ich weiß es nicht.“ – Kata: „Dann warte ich.“');
    await bye('(Gehen.)');
    await mala(); await act('look', 'drawer1'); await act('look', 'drawer3'); ok(await N('v3_drawer'), 'Mala sieht durch das Holz: unten die Mappe und der Schlüssel „31“'); await marko();
    await talk('kata', 'Die Schublade.'); ok(await dlgHas('Die unterste') && !(await dlgHas('Eine davon')), 'jetzt: „Die unterste.“, kein Raten mehr');
    await choose('Die unterste'); await calm(); ok(await F('k3.v.drawer') && await N('v3_tomorrow'), 'Zeichnung und Schlüssel 31 auf dem Tisch, Vlado: „Morgen.“');
    // andere Reihenfolge: Mala sieht zuerst nach, dann die E-Mail
    await load('Vulkanizer Rajić: Kata und Vlado'); await mala(); await act('look', 'drawer3'); await marko();
    await talk('kata', 'Was steht da hinten', 'Ich bin Übersetzer'); await P.solve([1, 1, 0, 0]); await waitDlg('Die unterste');
    ok(!(await dlgHas('Eine davon')), 'Mala zuerst: Kata fragt „Welche?“, und „Die unterste.“ steht gleich zur Wahl');
    await choose('Die unterste'); await calm(); ok(await F('k3.v.drawer'), 'auch so öffnet sich die Schublade');
  });

  // ================================================================== 5. Skela ohne Dino und mit Dinos Roller
  await T(5, 'Skela mit dem Taxi und mit Dinos Roller', async () => {
    await load('Karte „Die Glocke · Samstag · Nacht“'); await clearLog(); await travel('skela');
    let s = await st(); ok(s.room === 'skela_d' && (await F('k3.ride')) === 'taxi', 'ohne Dino: Taxi vom Ostbusbahnhof nach Skela (' + s.room + ')');
    ok(await said('Skela? Da ist nichts. Eine Brücke und Hunde.'), 'der Taxifahrer: „Skela? Da ist nichts. Eine Brücke und Hunde.“');
    await load('zurück zu Mala; Taxi; Karte'); await exit('door'); await go('starimost'); await talk('dino', 'Kennst du Skela'); await bye('Bis später');
    ok(await F('k3.dino.ride'), 'Sonntag: Dino bietet den Roller an');
    await D.ev(() => M.TA.travel('skela')); await D.page.waitForTimeout(80); await calm();
    ok(await dlgHas('(Mit dem Taxi.)') && await dlgHas('(Mit Dino auf dem Roller.)'), 'Auswahl Taxi oder Roller');
    await choose('(Mit Dino auf dem Roller.)'); if (await dlgHas('(Von der Drei')) await choose('(Von der Drei');
    s = await st(); ok(s.room === 'skela_d' && (await F('k3.ride')) === 'dino' && await N('l3_current'), 'mit Dino auf dem Roller nach Skela, unterwegs die Strömung (l3_current)');
    await clearLog(); await travel('herberge'); s = await st(); ok(s.room === 'herberge' && await said('Dino ist längst weg.'), 'zurück: „Dino ist längst weg.“ – das Taxi kommt (' + s.room + ')');
  });

  // ================================================================== 6. Falsche Versuche
  await T(6, 'Falsche Versuche: Peilung, Lichtprobe, Ordnen', async () => {
    const msgs = {};
    for (const [label, station, prep] of [['Sanja angerufen', 'bridgehead', async () => { await go('starimost'); await act('use', 'bridgehead'); }],
      ['Karte fürs Minarett', 'minaret', async () => { await exit('minaret_door'); await act('use', 'view'); }],
      ['Mala ist zurück', 'partizan', async () => { await act('use', 'view'); }]]) {
      await load(label); await prep(); await D.until(s => s.overlay === 'peil', 30000, 'Peilung ' + station);
      const bad = await D.ev((stn) => { const a = M.PEIL.answer[stn]; return Object.keys(M.PEIL.landmarks).filter(i => a.indexOf(i) < 0).slice(0, 2); }, station);
      const r = await P.peilPick(bad[0], bad[1]); msgs[station] = r.msg;
      ok(r.mode === 'pick' && r.bad && /^Mala: „Nein\./.test(r.msg), 'Peilung ' + station + ': falsche Landmarken abgewiesen („' + r.msg + '“)');
      await P.peil(station); ok(await F('k3.peil.' + station), 'Peilung ' + station + ': danach richtig eingezeichnet');
    }
    ok(new Set(Object.values(msgs)).size === 3, 'jede Station hat ihre eigene Antwort');
    // Lichtprobe
    await load('Schluss: Es war das Mädchen'); await at('skela_l');
    const tries = [['(Ins Küchenfenster.)', 'kitchen', 'Zu breit.'], ['(Ins Stubenfenster.)', 'stube', 'Zu tief.']];
    for (const [opt, id, ans] of tries) { await act('use', 'house', 'mobitel'); await choose(opt); await mala(); await clearLog(); await act('look', 'far_house');
      ok(await F('k3.lp.' + id) && await said(ans) && !(await N('a3_roof')), 'Lichtprobe ' + id + ': Mala vergleicht: „' + ans + '“'); await marko(); }
    await act('use', 'house', 'mobitel'); await choose('(Ins Dachfenster.)'); await mala(); await act('look', 'far_house'); ok(await N('a3_roof'), 'danach das Dachfenster: „Das war es.“ (a3_roof)'); await marko();
    // Ordnen
    await load('Mala ordnet ihren Nachhall'); await at('skela_l'); await exit('house_door'); await act('use', 'table'); await choose('(Die Nacht der Reihe nach');
    await D.until(s => s.overlay === 'arrange', 20000, 'Ordnen'); await P.tapHit('go');
    const m1 = await D.ev(() => ({ msg: M.E.overlay && M.E.overlay.msg, bad: M.E.overlay && M.E.overlay.bad, open: !!M.E.overlay }));
    ok(m1.open && m1.msg && m1.bad >= 0, 'Ordnen: falsche Reihenfolge abgewiesen („' + m1.msg + '“)');
    // eine andere falsche Reihenfolge: nur die ersten beiden richtig legen
    for (let k = 0; k < 2; k++) { const ord = await P.arrangeOrder(); if (ord[k] !== k) { await P.tapHit('r' + k); await P.tapHit('r' + ord.indexOf(k)); } }
    await P.tapHit('go'); const m2 = await D.ev(() => ({ msg: M.E.overlay && M.E.overlay.msg, open: !!M.E.overlay }));
    ok(m2.open && m2.msg && m2.msg !== m1.msg, 'andere falsche Reihenfolge, eigene Antwort („' + m2.msg + '“)');
    await P.arrange(); ok(await N('a3_lightroom') && await F('k3.d3.order'), 'danach richtig geordnet: Licht in Batos Kammer');
  });

  // ================================================================== 7. Glocke und Bato
  await T(7, 'Glocke und Bato: bei Tag, bei Nacht vor der Rekonstruktion, „tot“', async () => {
    await load('Sonntag in Skela'); await at('skela_d'); await clearLog(); await act('use', 'bell');
    ok(await said('Die Skela fährt seit achtundneunzig nicht mehr'), 'bei Tag läuten: der Nachbar: „Die Skela fährt seit achtundneunzig nicht mehr …“');
    await clearLog(); await act('use', 'bell'); ok(!(await F('k3.fin.rung')) && (await D.ev(() => (M.__speechLog || []).length)) > 0, 'noch einmal: eigene Antwort, kein Fortschritt');
    await load('Mala findet Bato'); await marko(); await at('skela_d'); await clearLog(); await act('use', 'bell');
    ok(await said('Bei Hochwasser nicht!') && await F('k3.n2.rung'), 'bei Nacht vor der Rekonstruktion: Bato ruft „Bei Nacht fährt keiner! Bei Hochwasser nicht!“');
    ok(!(await F('k3.fin.bato')) && !(await F('k3.fin.ferry')), 'keine Fähre, keine Erkenntnis');
    await clearLog(); await act('use', 'bell'); ok(await said('Ich habe gesagt: Geht!') || await said('Nachts nicht!') || await said('Herr. Bitte.'), 'wiederholbar mit eigener Antwort („' + (await lastSaid()) + '“)');
    await exit('to_bridge'); await exit('exit_l'); await at('skela_l'); await act('talk', 'bato'); await clearLog(); await choose('Sie sind tot');
    ok(await said('Was? Der Fluss ist zu laut.'), 'Bato direkt „Sie sind tot“: „Was? Der Fluss ist zu laut.“');
    await clearLog(); await choose('Sie sind tot'); ok(!(await F('realized.bato')) && (await lastSaid()).length > 0, 'noch einmal: „' + (await lastSaid()) + '“, er hört es nicht');
    await bye('(Gehen.)'); await calm();
  });

  // ================================================================== 8. Botschaft an Vlado
  await T(8, 'Botschaft an Vlado: falsche Botschaften mit eigener Antwort, dann die richtige', async () => {
    await load('Gespräch 2 „Wie Großmutter“'); await exit('door'); await at('vulkanizer');
    await talk('vlado', 'Ich soll Ihnen etwas sagen');
    const answers = [];
    for (const [n, a] of [['v3_forlater', 'Das haben Sie gelesen.'], ['v3_sent', 'Das habe ich Ihnen selbst erzählt.'], ['v3_two', 'Das habe ich Ihnen auch erzählt.'], ['l3_rope', 'Das kann jeder sagen, der nicht dabei war.']]) {
      await clearLog(); await choose('(Ihm sagen'); await pick(n); answers.push(await said(a)); ok(await said(a) && !(await F('k3.v.free')), 'falsch: ' + n + ' – Vlado: „' + a + '“'); }
    ok((await F('k3.v.msgTry')) === 4, 'vier falsche Versuche gezählt, Vlado hört weiter zu');
    await choose('(Ihm sagen'); await pick('v3_cab'); await calm(); ok(await F('k3.v.free') && await N('v3_tonight') && await said('Woher …?'), 'richtig: „Dann fahr still.“ – „Woher …?“ – Vlado fährt heute Nacht');
  });

  // ================================================================== 9. Lenas Satz
  await T(9, 'Lenas Satz: „djede“, dann Deutsch, dann richtig', async () => {
    await load('Davor hört die Einladung'); await at('zelenika');
    await talk('lena', 'Du wolltest deinem Großvater'); await clearLog(); await choose('Djede');
    ok(!(await F('k3.b.son')) && await said('So sagt man in der Schule.'), '„Djede, došli smo.“ – Mate: „So sagt man in der Schule.“');
    await choose('Du wolltest deinem Großvater'); await clearLog(); await choose('auf Deutsch');
    ok(!(await F('k3.b.son')) && await said('Aber das ist nicht für mich.'), 'Deutsch – Mate: „Schön. Aber das ist nicht für mich.“');
    await choose('Du wolltest deinem Großvater'); await choose('Došli smo, dida'); await calm(); ok(await F('k3.b.son') && await said('Das ist Davor.'), '„Došli smo, dida.“ – Mate: „Das ist Davor.“');
    await bye('(Gehen.)');
  });

  // ================================================================== 10. Am Grab
  await T(10, 'Am Grab: erst das Versprechen, dann die Frage; Zustimmung a, b, c', async () => {
    const SAY = { a: ['Ja.', 'Nein. Aber ja.'], b: ['Ja. Und wenn es zu schwer wird', 'Beide.'], c: ['Frag mich in München', 'Dann ja. Bis München.'] };
    for (const v of ['a', 'b', 'c']) {
      await load('die Leine löst sich (Zwischenstand 3)'); await at('skela_l');
      if (v === 'a') { await talk('_mala'); await clearLog(); await choose('Ich bringe dich nach Hause'); ok(await said('Schon wieder.') && !(await F('k3.fin.ask')), 'zuerst „Ich bringe dich nach Hause.“ – Mala: „Schon wieder.“'); }
      else await talk('_mala');
      await choose('Was willst du?'); await waitDlg(SAY[v][0], 120000);
      if (v === 'a') ok(!(await P.opts()).some(t => /^Nein/.test(t)), 'die Frage: Malas Entscheidungen; eine Ablehnung wird nicht angeboten');
      await clearLog(); await choose(SAY[v][0]); await waitDlg('(Ihre Hand nehmen.)', 120000);
      ok((await F('k3.fin.consent')) === v && await F('k3.fin.bond') && (await F('k3.fin.cp')) === 4 && await said(SAY[v][1]), 'Fassung ' + v + ': k3.fin.consent=' + v + ', der neue Faden (k3.fin.bond), „' + SAY[v][1] + '“');
      ok(await said('Den habe ich nicht festgemacht. Den haben wir gemacht.'), 'Fassung ' + v + ': „Den haben wir gemacht.“');
    }
  });

  // ================================================================== 11. Laden an jedem Zwischenstand, mit echtem Neuladen
  await T(11, 'Finale: Laden an jedem Zwischenstand 1–4 nach Neustart der Seite, dann bis zum Epilog', async () => {
    // die Zwischenstände so, wie das Spiel sie speichert: einmal durch das Finale, an jedem Zwischenstand den Platz lesen, sobald er geschrieben ist
    await load('Ankunft in Skela'); const CP = {};
    const grab = async (n, trigger) => { await trigger(); CP[n] = await captureSave(SLOT, (g) => g.flags['k3.fin.cp'] === n, 'Zwischenstand ' + n); await calm();
      ok(!!CP[n], 'Zwischenstand ' + n + ' gespeichert (' + CP[n].GS.pos[CP[n].GS.active].room + ')'); };
    await grab(1, () => D.ev(() => M.TA.act('use', 'bell')));
    await act('look', 'landing'); await choose('(Einsteigen.)'); await exit('to_bridge'); await at('skela_most');
    await grab(2, () => D.ev(() => M.TA.exit('exit_l'))); await waitDlg('(Mala ansehen.)', 120000); await choose('(Mala ansehen.)'); await choose('(Schweigen.)');
    await grab(3, () => D.ev(() => M.TA.choose('Zlata. Bato war wach.')));
    await talk('_mala', 'Was willst du?'); await waitDlg('Ja. Und wenn es zu schwer wird', 120000);
    await grab(4, () => D.ev(() => M.TA.choose('Ja. Und wenn es zu schwer wird'))); await waitDlg('(Ihre Hand nehmen.)', 120000);
    // so, wie ein Spieler neu lädt: nichts eingeschoben, mitten in der Szene; die alte Seite sichert beim Verlassen selbst (pagehide)
    { const r = await reload(SLOT); ok(r === true, 'Neuladen mitten in der Szene nach Zwischenstand 4, ohne eingeschobenen Stand');
      await waitDlg('(Ihre Hand nehmen.)', 120000); ok(await F('k3.fin.bond') && (await st()).room === 'skela_l', 'danach wieder am Grab, die Schwelle zur Zwischenwelt'); }
    // bis zum Epilog weiterspielen, ab einem Zwischenstand
    const toEpi = async (from) => {
      if (from <= 1) { await act('look', 'landing'); await choose('(Einsteigen.)'); await exit('to_bridge'); await exit('exit_l'); }
      if (from <= 2) { await waitDlg('(Mala ansehen.)', 120000); await choose('(Mala ansehen.)'); await choose('(Schweigen.)'); await choose('Zlata. Bato war wach.'); await calm(); }
      if (from <= 3) { await talk('_mala', 'Was willst du?'); await waitDlg('Frag mich in München', 120000); await choose('Frag mich in München'); }
      await waitDlg('(Ihre Hand nehmen.)', 120000); await choose('(Ihre Hand nehmen.)'); await at('limbo'); await act('use', 'prop'); await exit('arch');
      await D.until(s => s.phase === 'k3_epi', 90000, 'Epilog'); return calm(); };
    const ctr = (sp) => sp ? (sp.length === 4 ? sp[0] + (sp[2] >> 1) : sp[0]) : 0;
    const CHECK = {
      1: async () => { const b = await D.ev(() => ({ room: M.E.room.id, active: M.GS.active, bato: !!M.E.ACT.bato, vlado: !!M.E.ACT.vlado, kata: !!M.E.ACT.kata, ferry: M.GS.flags['k3.fin.ferry'], mk: M.GS.pos.marko.room, mx: Math.round(M.GS.pos.marko.x), bell: M.stand('skela_d', 'bell') || M.spot('skela_d', 'bell') }));
        b.dx = Math.abs(b.mx - ctr(b.bell)); delete b.bell;
        return [b.room === 'skela_d' && b.ferry === 'here' && b.bato && b.vlado && b.kata && b.mk === 'skela_d' && b.dx < 60 && b.active === 'mala', JSON.stringify(b)]; },
      2: async () => { await waitDlg('(Mala ansehen.)', 120000); const b = await D.ev(() => ({ room: M.E.room.id, ferry: M.GS.flags['k3.fin.ferry'], ma: M.GS.pos.mala.room, mx: Math.round(M.GS.pos.mala.x), land: M.spot('skela_l', 'landing'), mk: M.GS.pos.marko.room, vlado: !!M.E.ACT.vlado, kata: !!M.E.ACT.kata, zlata: !!M.E.ACT.zlata }));
        b.dx = Math.abs(b.mx - ctr(b.land)); delete b.land;
        return [b.room === 'skela_l' && b.ferry === 'left' && b.ma === 'skela_l' && b.dx < 90 && b.mk === 'skela_l' && b.vlado && b.kata, JSON.stringify(b) + '; Zlatas Erzählung läuft wieder an']; },
      3: async () => { const b = await D.ev(() => ({ room: M.E.room.id, ma: M.GS.pos.mala.room, mx: Math.round(M.GS.pos.mala.x), grave: M.spot('skela_l', 'grave'), zlata: !!M.E.ACT.zlata, free: !!M.GS.flags['k3.fin.free'], nf: !!M.E.room.noFollow }));
        b.dx = Math.abs(b.mx - ctr(b.grave)); delete b.grave;
        return [b.room === 'skela_l' && b.ma === 'skela_l' && b.dx < 60 && b.zlata && b.free && b.nf, JSON.stringify(b)]; },
      4: async () => { await waitDlg('(Ihre Hand nehmen.)', 120000); const b = await D.ev(() => ({ room: M.E.room.id, bond: !!M.GS.flags['k3.fin.bond'], consent: M.GS.flags['k3.fin.consent'] })); return [b.room === 'skela_l' && b.bond && b.consent === 'b', JSON.stringify(b) + '; gleich die Schwelle zur Zwischenwelt']; } };
    for (const n of [1, 2, 3, 4]) {
      const r = await reload(2, CP[n].GS); ok(r === true, 'Zwischenstand ' + n + ': neue Seite mit demselben localStorage, M.E.loadGame(2)');
      if (n === 1 || n === 3) await calm();
      const [good, info] = await CHECK[n](); ok(good, 'Zwischenstand ' + n + ': Aufbau stimmt (' + info + ')');
      const s = await toEpi(n); ok(s.phase === 'k3_epi' && s.room === 'herberge' && await F('k3.a.limbo'), 'Zwischenstand ' + n + ': weitergespielt bis zum Epilog (' + s.phase + ', ' + s.room + ')');
    }
  });

  // ================================================================== 12. Tagesende-Prüfung
  await T(12, 'Tagesende: das Bett verweigert mit einem Satz, solange Pflichtschritte fehlen; dann kommt der Wechsel', async () => {
    const refused = async (p, what) => { const t = await lastSaid(); ok((await st()).phase === p && t.length > 3, what + ': „' + t + '“'); };
    // Donnerstag
    await load('der Leine am Ufer gefolgt'); await go('herberge'); await exit('stairs'); await bed(); await refused('k3_pro', 'Donnerstag ohne „Nicht die Alte Brücke“, das Bett');
    await exit('door'); await comb('l3_mybridge', 'l3_onearch', 'l3_notbridge'); await stillPhase('k3_pro_n', 'mit dem Schluss beginnt der Abend von selbst');
    const svN0 = await captureSave(SLOT, (g) => g.phase === 'k3_pro_n' && !g.flags['k3.p.talk1'], 'Stand beim Wechsel in den Abend');
    // Donnerstagnacht: der Stand, den das Spiel beim Wechsel gespeichert hat (Gespräch 1 steht aus), nach Neustart der Seite
    await reload(2, svN0.GS); await calm(); await at('herberge'); await exit('stairs'); await bed(); await refused('k3_pro_n', 'Donnerstagnacht vor Gespräch 1 (nach Neuladen), das Bett');
    await exit('door'); await act('use', 'table'); await waitDlg('Versprochen.'); await choose('Versprochen.'); await exit('stairs'); await bed(); await D.until(s => s.phase === 'k3_d1', 60000, 'Freitag'); await calm(); await stillPhase('k3_d1', 'nach Gespräch 1: das Bett, Freitag');
    // Freitag
    await load('Katas E-Mail übersetzt'); await exit('door'); await go('herberge'); await exit('stairs'); await bed(); await refused('k3_d1', 'Freitag ohne Schublade, das Bett');
    await exit('door'); await go('bulevar'); await exit('to_vulk'); await mala(); await act('look', 'drawer3'); await marko(); await talk('kata', 'Die Schublade.');
    await D.ev(() => M.TA.choose('Die unterste'));
    const svN1 = await captureSave(SLOT, (g) => g.phase === 'k3_d1_n' && !g.flags['k3.d1.father'], 'Stand beim Wechsel in die Freitagnacht'); await calm();
    await stillPhase('k3_d1_n', 'mit der Schublade beginnt die Freitagnacht von selbst');
    // Freitagnacht: der beim Wechsel gespeicherte Stand (Vatergespräch steht aus), nach Neustart der Seite
    await reload(2, svN1.GS); await calm(); await at('herberge'); await exit('stairs'); await bed(); await refused('k3_d1_n', 'Freitagnacht vor dem Vatergespräch (nach Neuladen), das Bett');
    await exit('door'); await act('use', 'table'); await calm(); await flag('k3.d1.father'); await exit('stairs'); await bed(); await D.until(s => s.phase === 'k3_d2', 60000, 'Samstag'); await calm(); await stillPhase('k3_d2', 'nach dem Vatergespräch: das Bett, Samstag');
    // Samstag: Davor zugesagt, Jela fehlt
    await load('der Bus aus München'); await clearLog(); await D.ev(() => M.TA.travel('skela')); await D.page.waitForTimeout(80); await calm(); ok((await st()).realRoom !== 'skela_d' && await said('Ich habe Davor gesagt, ich komme mit.'), 'Samstag, Jela fehlt: nicht nach Skela, „' + (await lastSaid()) + '“');
    await D.ev(() => { if (M.E.overlay && M.E.overlay.kind === 'map') M.closeMap(); }); await calm();
    await go('herberge'); await exit('stairs'); await bed(); await refused('k3_d2', 'Samstag, Jela fehlt, das Bett');
    await exit('door'); await go('zelenika'); await choose('Jetzt kommt er'); await waitDlg('Noch nichts', 60000); await choose('Noch nichts'); await D.until(s => s.phase === 'k3_d2_n', 60000, 'Samstagnacht'); await calm();
    await stillPhase('k3_d2_n', 'mit Jela: Nadas Anruf, dann Samstagnacht');
    // Samstag, Davor abgesagt: der Tag endet mit dem Bus
    await load('Vlado, Teil 1'); await exit('door'); await go('westbus'); await waitDlg('Heute habe ich zu tun'); await choose('Heute habe ich zu tun'); await waitDlg('Noch nichts', 60000);
    ok(!(await F('k3.b.jela')), 'Davor abgesagt („Heute habe ich zu tun.“): der Tag endet ohne Jela, Nada ruft an'); await choose('Noch nichts'); await calm();
    // Samstagnacht
    await load('Karte „Die Glocke · Samstag · Nacht“'); await exit('stairs'); await bed(); await refused('k3_d2_n', 'Samstagnacht in der Herberge, das Bett');
    await load('Zlata mit der Lampe'); await at('skela_l'); await D.page.waitForTimeout(500); await calm(); await stillPhase('k3_d2_n', 'am linken Ufer, Bato und Zlata erledigt: noch kein Wechsel');
    await exit('to_bridge'); await exit('exit_d'); await D.until(s => s.phase === 'k3_d3', 60000, 'Sonntag'); await calm(); await stillPhase('k3_d3', 'zurück bei Mala am rechten Ufer: Sonntag');
    // Sonntag
    await load('zurück zu Mala; Taxi; Karte'); await at('zimmer'); await bed(); await refused('k3_d3', 'Sonntag, das Bett');
    await load('den Schlüssel bekommt die Kleinste'); await D.page.waitForTimeout(500); await calm(); await stillPhase('k3_d3', 'Sonntag, Mate noch nicht hinüber: noch kein Finale');
    await act('cross', 'mate'); await choose('(Ihre Hand nehmen.)'); await at('limbo'); await act('use', 'prop'); await choose('Bitte einsteigen'); await exit('arch');
    await D.until(s => s.phase === 'k3_fin_n', 90000, 'Finale'); await calm(); await stillPhase('k3_fin_n', 'Mate ist hinüber, Davors Abschied: das Finale beginnt von selbst');
  });

  // ================================================================== 13. Die Probe für den Vater, zweimal verweigert
  await T(13, 'Die Probe für den Vater zweimal verweigert: der Anruf bei der Mutter geht trotzdem, das Kapitel endet', async () => {
    await load('Vermisstenstelle: Frau Kolar nimmt die Anzeige auf'); await at('vermisst');
    await talk('kolar', 'Das Formular'); await choose('(Einen eigenen Satz schreiben.)'); await waitDlg('Heute nicht', 60000);
    await clearLog(); await choose('Heute nicht'); ok(await said('Du suchst mich, damit du ihn nicht suchen musst.') && await said('Ich frage immer zweimal.'), 'erste Weigerung: Mala: „Du suchst mich, damit du ihn nicht suchen musst.“ – Kolar fragt noch einmal');
    await waitDlg('Heute nicht'); await choose('Heute nicht'); await calm();
    ok(!(await F('k3.e.sample')) && await F('k3.e.sampleDone') && await N('e3_mothersample'), 'zweite Weigerung: keine Probe; „Lebt Ihre Mutter?“ (e3_mothersample)');
    await bye('(Warten.)'); await D.item('use2', 'mobitel'); await calm(); await choose('Mama in München'); await calm();
    ok(await F('k3.e.mother') && await said('Komm. Wir reden, wenn du hier bist.'), 'der Anruf bei der Mutter mit dem Handy: „Komm. Wir reden, wenn du hier bist.“');
    await go('ostbus'); await D.ev(() => M.TA.act('use', 'bus'));
    for (let i = 0; i < 200; i++) { const s = await st(); if (s.screen === 'credits' || s.screen === 'title') break; if (s.overlay) await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(150); }
    await D.until(s => s.screen === 'credits' || s.screen === 'title', 60000, 'Abspann');
    const c3 = await D.ev(() => JSON.parse(localStorage.getItem('mala.c3end') || 'null'));
    ok(await D.ev(() => M.GS.ended === true) && c3 && c3.sample === false, 'das Kapitel endet (M.endChapter3, mala.c3end: sample=false)');
  });

  // ================================================================== 14. Laden in jeder Phase, Laderegeln
  await T(14, 'Laden in jeder Phase (neue Seite) und unterbrochene Wechsel', async () => {
    const PH = [['k3_pro', 'Herberge „Neretva“'], ['k3_pro_n', 'Mala klatscht ohne Ton'], ['k3_d1', 'Peilung 2 vom Minarett'], ['k3_d1_n', 'Tagesende: Freitag · Nacht'], ['k3_d2', 'Maja: Samstags kommen'],
      ['k3_d2_n', 'Mala findet Bato'], ['k3_d3', 'Lichtprobe'], ['k3_fin_n', 'Mala steigt ein'], ['k3_epi', 'Karte „Epilog'], ['k3_epi_d', 'die zwei Mütter']];
    for (const [ph, label] of PH) {
      const g = gsOf(label); const r = await reload(2, g); await calm();
      const s = await st(); const room0 = g.pos[g.active].room;
      ok(r === true && s.phase === ph && s.room === room0 && !s.busy, ph + ': geladen („' + label + '“), Raum ' + s.room + (s.room === room0 ? '' : ' statt ' + room0));
      const hs = await D.ev(() => M.E.room.hotspots.filter(h => !h.exit && !h.npc && (!h.vis || h.vis(M.RS(M.E.room.id), M.GS))).map(h => h.id)[0]);
      await act('look', hs); const s2 = await st(); const hints = await D.ev(() => M.hintsOpen(M.GS).length);
      ok(!s2.busy && s2.screen === 'game' && hints > 0, ph + ': es geht weiter (Ansehen „' + hs + '“, ' + hints + ' Hinweisthema/-themen offen)');
    }
    // Finale nach dem Laden mitten in der Überfahrt: weiter bis Zwischenstand 2
    await reload(2, gsOf('Mala steigt ein')); await calm(); await exit('to_bridge'); await D.exit('exit_l'); await waitDlg('(Mala ansehen.)', 120000); ok(await F('k3.fin.crossed') && (await F('k3.fin.cp')) === 2, 'k3_fin_n: nach dem Laden auf der Fähre weiter bis zum linken Ufer (Zwischenstand 2)');
    // unterbrochene Wechsel: Stand gespeichert, nachdem der Wechsel begonnen hat (Schalter gesetzt), aber bevor die neue Phase stand
    const X = [
      ['k3_pro → k3_pro_n', 'der Leine am Ufer gefolgt', (g) => { g.notes.push('l3_notbridge'); g.flags['k3.ev0.started'] = true; }, async () => { await D.until(s => s.phase === 'k3_pro_n', 60000, 'Abend'); return 'k3_pro_n'; }],
      ['k3_pro_n → k3_d1 (Bett)', 'Versprechen: „Versprochen.“', (g) => { g.flags['k3.d1.started'] = true; }, async () => { await exit('stairs'); await bed(); await D.until(s => s.phase === 'k3_d1', 60000, 'Freitag'); return 'k3_d1'; }],
      ['k3_d1 → k3_d1_n', 'Katas E-Mail übersetzt', (g) => { g.flags['k3.v.drawer'] = true; g.notes.push('v3_drawer', 'v3_tomorrow'); g.flags['k3.d1n.started'] = true; }, async () => { await D.until(s => s.phase === 'k3_d1_n', 60000, 'Freitag · Nacht'); return 'k3_d1_n'; }],
      ['k3_d1_n → k3_d2 (Bett)', 'Tagesende: Freitag · Nacht', (g) => { g.flags['k3.d2.started'] = true; }, async () => { await exit('stairs'); await bed(); await D.until(s => s.phase === 'k3_d2', 60000, 'Samstag'); return 'k3_d2'; }],
      ['k3_d2 → k3_d2_n (Nadas Anruf unterbrochen)', 'Haus Zelenika: Jela mit dem Schlüssel', null, async () => { await waitDlg('Noch nichts', 60000); await choose('Ich habe eine Spur'); await D.until(s => s.phase === 'k3_d2_n', 60000, 'Samstagnacht'); return 'k3_d2_n'; }],
      ['k3_d2_n → k3_d3', 'Zlata mit der Lampe', (g) => { g.flags['k3.d3.started'] = true; }, async () => { await exit('to_bridge'); await exit('exit_d'); await D.until(s => s.phase === 'k3_d3', 60000, 'Sonntag'); return 'k3_d3'; }],
      ['k3_d3 → k3_fin_n (Abfahrt unterbrochen)', 'Davor: „Falls Sie mal in München sind.“', null, async () => { await waitDlg('(Einsteigen.)', 60000); await choose('(Einsteigen.)'); await D.until(s => s.room === 'skela_d' || s.realRoom === 'skela_d', 90000, 'Skela'); await calm(); return (await F('k3.fin.drive')) ? 'k3_fin_n' : 'ohne Fahrt'; }],
      ['k3_fin_n → k3_epi (k3.a.limbo)', 'der neue Faden (Zwischenstand 4)', (g) => { g.flags['k3.a.limbo'] = true; }, async () => { await D.until(s => s.phase === 'k3_epi', 60000, 'Epilog'); return 'k3_epi'; }],
      ['k3_epi → k3_epi_d', 'Karte „Epilog', (g) => { g.flags['k3.e.bridge'] = true; g.flags['k3.e.bridgeOn'] = true; g.notes.push('e3_since'); g.flags['k3.epid.started'] = true; }, async () => { await D.until(s => s.phase === 'k3_epi_d', 60000, 'Montag'); return 'k3_epi_d'; }] ];
    for (const [name, label, patch, cont] of X) {
      const g = gsOf(label, patch); await reload(2, g); await calm(); const want = name.split('→')[1].trim().split(' ')[0];
      let got = null; try { got = await cont(); } catch (e) { got = 'Fehler: ' + e.message.split('\n')[0]; }
      ok(got === want, 'unterbrochen ' + name + ': nach dem Laden nachgeholt (' + got + ', ' + (await st()).room + ')');
    }
    // nach Zwischenstand 4 ohne k3.a.limbo: M.k3FinResume betritt die Zwischenwelt neu
    await reload(2, gsOf('der neue Faden (Zwischenstand 4)')); await waitDlg('(Ihre Hand nehmen.)', 90000); await choose('(Ihre Hand nehmen.)'); ok((await st()).room === 'limbo', 'nach Zwischenstand 4: die Zwischenwelt wird neu betreten');
  });

  // ================================================================== 15. Davor abgesagt, am Samstag nie bei Jela: Sonntag
  await T(15, 'Davor abgesagt, am Samstag nie bei Jela: am Sonntag sagt Jela es Marko selbst, Fall B geht zu Ende', async () => {
    // Stand des Durchlaufs vor dem Haus Zelenika am Sonntag, ohne alles, was nur Jelas Samstagsszene gibt (wie nach „Heute habe ich zu tun.“ ohne Besuch)
    await load('die Botschaft: „Dann fahr still.“', (g) => { ['k3.b.jela', 'k3.b.helper', 'k3.b.jelaTr', 'k3.b.tree97', 'met.jela'].forEach(k => { delete g.flags[k]; });
      g.notes = g.notes.filter(n => ['b3_gate', 'b3_lenakey', 'b3_figs', 'b3_sell'].indexOf(n) < 0); });
    ok((await st()).phase === 'k3_d3' && !(await F('k3.b.jela')) && !(await N('b3_gate')), 'Ausgangslage: Sonntag, kein Samstag bei Jela, keine Notiz b3_gate');
    await clearLog(); await go('zelenika');
    ok(await F('k3.b.jelaSun') && await N('b3_gate') && await N('b3_figs') && await said('Ti si taj prevodilac') && await said('Ključ je uvik dobijo najmlađi'), 'Jela spricht Marko an: „Den Schlüssel bekam der Kleinste.“ (b3_gate, b3_figs)');
    await clearLog(); await exit('house_door'); await at('zelenika_in'); ok(await said('Sie sind doch gekommen.'), 'Davor: „Sie sind doch gekommen.“');
    await talk('davor', 'Darf ich die Briefe lesen'); await bye('(Gehen.)'); await act('use', 'stairs'); await act('open', 'drawer');
    await comb('b3_letters', 'b3_kidsroom', 'b3_invite'); await comb('b3_cards', 'b3_pencil', 'b3_dida');
    await talk('davor', 'Kad ćete doći'); await calm(); await at('zelenika'); ok(await F('k3.b.invite'), 'die Einladung übersetzt, alle im Hof');
    await talk('lena', 'Du wolltest deinem Großvater', 'Došli smo, dida'); await calm(); ok(await F('k3.b.son'), '„Došli smo, dida.“ – Mate erkennt seinen Sohn');
    await clearLog(); await talk('lena', 'Stell dich ans Tor'); await calm();
    ok(await F('k3.b.dead') && await said('Ans Tor? Wieso?') && !(await said('Wie Jela gesagt hat')) && await N('b3_lenakey'), 'der Schlüssel am Tor ohne Rückgriff auf den Samstag („Ans Tor? Wieso?“), Mate: „Ich bin nicht mehr da.“');
    await act('talk', 'jela'); ok(await dlgHas('Haben Sie Mate noch gesehen'), 'Jela: die Frage nach Mates letzten Tagen ist da');
    await choose('Zeigen Sie ihm'); await choose('Von unten nach oben'); await calm(); await bye('Hvala');
    await act('take', 'fork'); await act('give', 'lena', 'kljuc_mate'); ok(await F('k3.b.keyLena'), 'die Feigen eingepackt, der Schlüssel für Lena');
    await act('cross', 'mate'); await choose('(Ihre Hand nehmen.)'); await at('limbo'); await act('use', 'prop'); await choose('Bitte einsteigen'); await exit('arch');
    await D.until(s => s.phase === 'k3_fin_n' || s.dlg, 90000, 'Davors Karte'); await calm();
    ok(await F('k3.b.limbo') && await F('k3.b.done'), 'Mate ist hinüber, Davors Karte: Fall B abgeschlossen');
  });

  const e = errs(); if (e.length) { line('\nJS-Fehler (' + e.length + '):'); e.slice(0, 8).forEach(x => line('  ' + x.split('\n')[0])); }
  line(`\n${pass} bestanden, ${fails} fehlgeschlagen`);
  process.exitCode = fails ? 1 : 0; await D.close2();
})();
