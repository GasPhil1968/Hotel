// Prüft die Befunde des externen Prüfberichts (November 2026) im echten Spiel: jeder Fall wird so nachgestellt, wie er beim Spielen entsteht.
//   node game/build.js
//   MALA_DUMPALL=<k1> node game/tools/walkthrough.js ; MALA_DUMPALL=<k2> node game/tools/walkthrough2.js
//   node game/tools/pruefbericht.js <k1-ordner> <k2-ordner> [bilder-ordner]
const { open } = require('./driver');
const fs = require('fs'), path = require('path');
const K1 = process.argv[2], K2 = process.argv[3], SHOTS = process.argv[4];
let pass = 0, fail = 0; const out = [];
function ok(c, what, info) { if (c) { pass++; out.push('  ok   ' + what); } else { fail++; out.push('  FEHLER ' + what + (info ? '  | ' + info : '')); } }
const dumps = (dir) => fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const byLabel = (dir, label) => { const d = dumps(dir).find(x => x.label.indexOf(label) >= 0); if (!d) throw new Error('Schritt fehlt: ' + label); return JSON.parse(JSON.stringify(d.GS)); };
const lastWhere = (dir, pred) => { const L = dumps(dir).filter(x => pred(x.GS)); if (!L.length) throw new Error('kein passender Stand'); return JSON.parse(JSON.stringify(L[L.length - 1].GS)); };
(async () => {
  const D = await open({ turbo: 25 });
  const load = async (gs) => { await D.ev((g) => { M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: g }; M.E.loadPreset('__t', 3); }, gs); await D.page.waitForTimeout(200); await D.drain(); };
  const reload = async () => { const okL = await D.ev(() => M.E.loadGame(3)); await D.page.waitForTimeout(200); await D.drain(); return okL; };
  const st = () => D.st(); const F = (k) => D.flag(k);
  const inv = async (id) => (await st()).inv.indexOf(id) >= 0;
  const talk = async (id, ...c) => { await D.act('talk', id); await D.drain(); for (const x of c) { if (x.startsWith('NOTE:')) await D.pickNote(x.slice(5)); else await D.choose(x); await D.drain(); } };
  const said = () => D.ev(() => (M.__speechLog || []).map(x => x[1]));
  const shot = async (n) => { if (SHOTS) await D.shot(path.join(SHOTS, n + '.png')); };
  try {
    // ================================================================ 1. Ivkas Handschuhe: Unterbrechung mitten im Abschied
    out.push('1. Ivkas Abschied unterbrochen (Titelbild, App-Wechsel), alter beschädigter Stand');
    const toGloves = async () => { await D.ev(() => M.E.loadPreset('ivka', 3)); await D.page.waitForTimeout(200); await D.drain();
      await D.act('use', 'ivka', 'letter_t'); await D.drain(); await D.pickNote('c1_ferry'); await D.drain(); await D.pickNote('c1_came'); await D.drain();
      await D.choose('Brief vorlesen'); await D.drain(); await D.choose('Handschuhe'); await D.drain(); };   // jetzt: die Handschuhe sind übergeben, die Auswahl „Weil Sie nicht mehr hier sind …“ ist offen
    await toGloves(); let s = await st();
    ok(!!s.dlg && !(await inv('gloves')) && !(await F('c1.release')) && s.busy, 'Ausgangslage wie im Bericht: Handschuhe übergeben, Schluss noch offen, Szene läuft');
    await D.ev(() => M.E.toTitle()); await D.page.waitForTimeout(100);   // Menü „Zum Titelbild“ (speichert)
    ok(await reload(), 'Spielstand nach „Zum Titelbild“ lädt');
    ok(await inv('gloves') && !(await F('c1.release')) && (await st()).room === 'riva', 'nach dem Laden: Handschuhe wieder da, Abschied noch offen, an der Riva');
    await D.act('use', 'ivka', 'letter_t'); await D.drain(); await D.pickNote('c1_ferry'); await D.drain(); await D.pickNote('c1_came'); await D.drain();
    await D.choose('Brief vorlesen'); await D.drain(); await D.choose('Handschuhe'); await D.drain(); await D.choose('nicht mehr hier'); await D.drain();
    ok(await F('c1.release') && await inv('gloves'), 'der Abschied lässt sich nach dem Laden vollständig spielen (Leine los, Handschuhe aufgehoben)');
    ok(await reload() && await F('c1.release') && await inv('gloves'), 'das A.save() am Ende des Abschieds speichert den Stand nach der Szene');
    await toGloves(); await D.ev(() => { document.dispatchEvent(new Event('visibilitychange')); M.saveGame(); });   // App-Wechsel/Schließen: derselbe Aufruf wie in 99_main.js
    ok(await reload() && await inv('gloves') && !(await F('c1.release')), 'App-Wechsel mitten im Abschied: es gilt der Stand vom Beginn der Szene');
    const broken = await D.ev(() => { const g = JSON.parse(JSON.stringify(M.PRESETS.ivka.GS)); g.inv = g.inv.filter(i => i !== 'gloves'); return g; });   // so sah ein betroffener Stand der Vorversion aus
    await load(broken); ok(await inv('gloves'), 'beschädigter alter Stand (Handschuhe weg, Abschied offen) bekommt die Handschuhe beim Laden zurück');
    const gone = await D.ev(() => { const g = JSON.parse(JSON.stringify(M.PRESETS.ivka.GS)); g.inv = g.inv.filter(i => i !== 'gloves'); g.flags['c1.done'] = true; g.phase = 'i1'; g.flags['split.afterIvka.done'] = true; g.flags['i1.done'] = true; return g; });
    await load(gone); ok(!(await inv('gloves')), 'nach Ivkas Abschied (c1.done) kommen keine Handschuhe zurück');
    // ================================================================ 2. Tomažs Nacht ohne Lejlas Auskunft über die Kaserne
    out.push('2. Tomažs Nacht, ohne vorher Lejla nach der Kaserne gefragt zu haben');
    let g2 = byLabel(K2, 'Briefe übersetzt'); g2.notes = g2.notes.filter(n => n !== 's1_campus'); delete g2.noteNew.s1_campus;
    await load(g2); await D.exit('door'); await D.drain(); s = await st(); ok(s.room === 'kafana' && !(await D.hasNote('s1_campus')), 'Ausgangslage: Kafana, Auskunft über die Kaserne fehlt');
    await talk('emina', 'NOTE:s1_missed', 'NOTE:s1_betrayal'); s = await st(); ok(s.phase === 'k2_s1_n' && s.room === 'kula', 'Emina ist überzeugt, die Nacht beginnt (wie im Bericht)');
    await D.exit('exit'); await D.drain(); ok((await st()).room === 'kula', 'die Ausgänge sind nachts weiter gesperrt (die Nacht bleibt an der Kula)');
    ok(await D.ev(() => !!M.E.room.byId.lejla && M.E.room.byId.lejla.vis(M.E.room.S || {}, M.GS)), 'Lejla sitzt nachts vor der Kafana');
    await D.act('talk', 'tomaz'); await D.drain(); await D.pickNote('s1_twosevens'); await D.drain();
    s = await st(); if (s.overlay === 'notebook') { await D.close(null); await D.drain(); }
    ok(!(await F('k2.s1.stay')), 'mit den zwei Siebenen allein bleibt Tomaž nicht (die Kaserne fehlt noch)');
    await talk('lejla', 'Was war früher die Kaserne', '(Leise.) Bis gleich'); ok(await D.hasNote('s1_campus'), 'Lejla gibt nachts die Auskunft: die Kaserne ist heute der Campus');
    await D.act('talk', 'tomaz'); await D.drain(); s = await st();
    if (s.overlay === 'notebook') { await D.pickNote('s1_campus'); await D.drain(); }
    ok(await F('k2.s1.stay') && await F('k2.s1.free'), 'Tomaž bleibt, die Kula schlägt sieben, er erkennt es (die Siebenen von vorhin zählen weiter)');
    // ================================================================ 3. Nedžads Stemmeisen zu früh zurückgegeben
    out.push('3. Stemmeisen nach dem Spiegel zurückgegeben, im Finale am Herd gebraucht');
    let g3 = byLabel(K2, 'Briefe übersetzt'); await load(g3);
    await D.exit('door'); await D.drain(); await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.exit('lane_kazan'); await D.drain(); ok((await st()).room === 'kazandziluk', 'zu Nedžad');
    await D.act('use', 'nedzad', 'chisel'); await D.drain(); ok(!(await inv('chisel')) && await F('k2.chisel.back'), 'ordentlich zurückgegeben (wie das Spiel es verlangt)');
    let g3b = byLabel(K2, 'Lanas Zimmer, die Postkarte'); g3b.inv = g3b.inv.filter(i => i !== 'chisel'); g3b.flags['k2.chisel.back'] = true; await load(g3b);
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('pansion'); await talk('hajra', 'Haben Sie noch einen Schlüssel', 'Danke, teta Hajra');
    await D.exit('door'); await D.drain(); await D.travel('vratnik'); await D.act('open', 'ruza_gate'); await D.drain(); ok((await st()).room === 'kuca', 'in Großmutters Küche, ohne Stemmeisen');
    await D.switchTo('mala'); await D.act('sense', 'stove'); await D.drain(); await D.switchTo('marko'); await D.act('use', 'compartment'); await D.drain();
    ok(!(await inv('rcm')) && await F('k2.f2.needChisel'), 'die Klappe sitzt fest, Marko denkt an Nedžads Stemmeisen');
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); s = await st(); if (s.room !== 'map') { await D.exit('exit'); await D.drain(); }
    await D.travel('carsija'); await D.exit('lane_kazan'); await D.drain(); await D.act('talk', 'nedzad'); await D.drain();
    ok(await inv('chisel'), 'Nedžad leiht es noch einmal');
    await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('vratnik'); await D.act('open', 'ruza_gate'); await D.drain();
    await D.act('use', 'compartment', 'chisel'); await D.drain(); ok(await inv('rcm'), 'das Wärmefach ist offen, die Nachricht vom Roten Kreuz gefunden');
    let g3c = byLabel(K2, 'Lanas Zimmer, die Postkarte'); g3c.inv = g3c.inv.filter(i => i !== 'chisel'); g3c.flags['k2.f2.chiselBack'] = true; g3c.notes.push('f2_oven'); await load(g3c);
    await D.exit('door'); await D.drain(); await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('carsija'); await D.exit('lane_kazan'); await D.drain(); await D.act('talk', 'nedzad'); await D.drain();
    ok(await inv('chisel'), 'auch ein Stand der Vorversion (zurückgegeben, alte Markierung) bekommt es wieder');
    // ================================================================ 4. Notizbuch: „Danach fragen“ vollständig sichtbar
    out.push('4. Notizbuch im Gespräch: Bestätigung sichtbar und groß genug');
    await load(byLabel(K2, 'Emina überzeugt, Nacht')); await D.act('talk', 'tomaz'); await D.drain(); await D.until(x => x.overlay === 'notebook', 8000, 'Notizbuch');
    const geo = await D.ev(() => { const hits = {}; for (let y = 0; y < 200; y++) for (let x = 0; x < 320; x++) { const u = M.uiHit(x, y); if (!u) continue; const r = hits[u] || (hits[u] = [x, y, x, y]); r[0] = Math.min(r[0], x); r[1] = Math.min(r[1], y); r[2] = Math.max(r[2], x); r[3] = Math.max(r[3], y); } return hits; });
    const row = Object.keys(geo).find(k => k.startsWith('n:')); ok(!!row, 'Notizen im Notizbuch antippbar');
    const r0 = geo[row]; await D.ev(([x, y]) => { M.pointerDown(x, y, true); M.pointerUp(x, y, true); }, [r0[0] + 10, r0[1] + 6]); await D.page.waitForTimeout(150);
    const geo2 = await D.ev(() => { let b = null; for (let y = 0; y < 200; y++) for (let x = 0; x < 320; x++) if (M.uiHit(x, y) === 'nb') { if (!b) b = [x, y, x, y]; b[0] = Math.min(b[0], x); b[1] = Math.min(b[1], y); b[2] = Math.max(b[2], x); b[3] = Math.max(b[3], y); } return b; });
    ok(!!geo2 && geo2[3] <= 192 && geo2[3] - geo2[1] + 1 >= 16 && geo2[2] - geo2[0] + 1 >= 60, '„Danach fragen“ liegt ganz im Bild und ist groß genug', JSON.stringify(geo2));
    await shot('pb_notizbuch_frage');
    const rows = Object.keys(geo).filter(k => k.startsWith('n:')).map(k => geo[k]); ok(rows.every(r => r[3] < 140), 'alle Zeilen oberhalb des Beschreibungsbereichs');
    await D.ev(() => { window.__ov = M.E.overlay; M.__speechLog = []; });
    await D.ev(([x, y]) => { M.pointerDown(x, y, true); M.pointerUp(x, y, true); }, [(geo2[0] + geo2[2]) >> 1, (geo2[1] + geo2[3]) >> 1]); await D.page.waitForTimeout(300);
    ok(await D.ev(() => M.E.overlay !== window.__ov && (M.__speechLog || []).length > 0), 'Antippen von „Danach fragen“ stellt die Frage (Notizbuch schließt, Marko spricht)');
    // ================================================================ 5. Zdenka: Schlüssel als Gegenstand = Dialogzeile
    out.push('5. Zdenka den Schlüssel als Gegenstand geben');
    let g5 = lastWhere(K1, g => g.phase === 'pro' && g.inv.indexOf('key_ivka') >= 0 && g.pos.marko.room === 'varos' && g.notes.indexOf('pro_list') >= 0);
    await load(g5); await D.ev(() => { M.__speechLog = []; });
    await D.act('use', 'zdenka', 'key_ivka'); await D.drain(); let L = await said();
    ok(await inv('key_ivka') && L.some(t => t.indexOf('Beides kann nicht stimmen') >= 0), 'vor dem Verbinden der Notizen: dieselbe Reaktion wie bei der Dialogzeile („Beides kann nicht stimmen“)');
    const cb = await D.combine('pro_noone', 'pro_list'); ok(cb && cb.ok, 'Notizen verbunden: Keine Familie heißt nicht niemand');
    await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'zdenka', 'key_ivka'); await D.drain(); L = await said();
    ok(await inv('key_ivka') && L.some(t => t.indexOf('Eine Frage habe ich noch') >= 0), 'ohne Zdenkas Antwort zu den Namen: dieselbe Reaktion wie bei der Dialogzeile („Eine Frage habe ich noch“)');
    await talk('zdenka', 'In ihrem Heft stehen Namen'); s = await st(); if (s.dlg) { await D.choose('Danke, Gospođa'); await D.drain(); }
    await D.act('use', 'zdenka', 'key_ivka'); await D.drain();
    ok(!(await inv('key_ivka')) && await F('split.intro.glimpse') && (await st()).phase === 'pro_eve', 'mit beiden Notizen: Schlüssel angenommen, danach die Kirchentreppe, Abend');
    // ================================================================ 6. Malas Frage nach dem ersten Schwindel
    out.push('6. Malas Frage nach dem ersten Schwindel: Schreibtisch als Antwort');
    let g6 = lastWhere(K1, g => g.phase === 'c1' && !g.flags['split.intro.meet']); await load(g6);
    await D.ev(() => { M.__speechLog = []; });
    await D.exit('door'); await D.drain(); await D.exit('door'); await D.drain(); await D.act('look', '_mala'); await D.drain();
    await D.act('take', 'glasses'); await D.drain(); await D.act('use', 'sink', 'glass'); await D.drain(); await D.act('use', '_mala', 'glassW'); await D.drain();
    for (const c of ['Wer bist du?', 'Kann dich außer mir', 'Was kannst du', 'Seit wann', 'Warum fühle ich mich', 'Genug für heute']) { await D.choose(c); await D.drain(); }
    L = await said(); ok(L.some(t => t.indexOf('Nicht der halbe Schritt beim Aufstehen') >= 0), 'die Frage schließt das Aufstehen am Schreibtisch ausdrücklich aus');
    await D.choose('am Schreibtisch'); await D.drain(); L = await said();
    ok(L.some(t => t.indexOf('Am Schreibtisch, ja. Da hast du dich an der Kante festgehalten.') >= 0) && !(await F('split.intro.first')), 'Schreibtisch: Mala bestätigt das Festhalten und fragt nach dem anderen Moment');
    await D.choose('An der Riva'); await D.drain(); ok((await F('split.intro.first')) === 'riva' && await F('split.intro.met'), 'danach die Riva: Gespräch endet wie vorgesehen');
  } catch (e) { fail++; out.push('ABBRUCH ' + e.message); }
  console.log(out.join('\n')); console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`); console.log(D.errors.slice(0, 5).join('\n') || 'keine JS-Fehler');
  await D.close2(); process.exitCode = fail ? 1 : 0;
})();
