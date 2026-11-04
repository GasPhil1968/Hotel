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
    // ================================================================ 7. Malas Fähigkeit vor dem Brief: das ausgeblichene Ordnerschild im Hafenamt
    out.push('7. Hafenamt: Mala liest eine Schrift, die nicht mehr da ist (Vorbereitung für Tonćis Brief)');
    await load(byLabel(K1, 'Praxistest: Marko lässt sie nachsehen')); await D.switchTo('mala'); await D.exit('archive_door'); await D.drain();
    await D.act('look', 'binder_1948'); await D.drain(); ok(!(await D.hasNote('c1_1948')), 'Ansehen allein: das Schild ist ausgeblichen, keine Jahreszahl');
    await D.ev(() => { M.__speechLog = []; }); await D.act('sense', 'binder_1948'); await D.drain(); L = await said();
    ok(await D.hasNote('c1_1948') && L.some(t => t.indexOf('Die Hand, die sie geschrieben hat, nicht') >= 0), 'Spüren: Mala liest die verschwundene Schrift (1984 bei 1948)');
    // ================================================================ 8. Sanja und der geöffnete Brief
    out.push('8. Sanja erkennt, in welchem Zustand Tonćis Brief ist');
    await load(byLabel(K1, 'Brief über Dampf geöffnet')); await D.exit('door'); await D.drain(); await D.travel('bar'); s = await st();
    if (s.room === 'bar'){ await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'sanja', 'letter_t'); await D.drain(); L = await said();
      ok(L.some(t => t.indexOf('Lesen kann ihn so keiner mehr') >= 0) && !L.some(t => t.indexOf('Lies ihn') >= 0), 'geöffnet, aber unlesbar: Sanja sagt nicht mehr „Lies ihn“, sondern dass das Salz die Tinte genommen hat'); }
    else ok(false, 'Bar erreichbar', s.room);
    await load(byLabel(K1, 'Mala liest den Brief')); await D.exit('door'); await D.drain(); await D.travel('bar'); await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'sanja', 'letter_t'); await D.drain(); L = await said();
    ok(L.some(t => t.indexOf('Den hast du doch gelesen') >= 0), 'nach Malas Lesung: Sanja sieht, dass er ihn gelesen hat');
    // ================================================================ 9. Brunos Satz: keine Abkürzung, leere Felder
    out.push('9. Brunos Satz: erst aus drei Erinnerungen, Rätsel beginnt leer');
    const g9 = byLabel(K1, 'Musik'); g9.flags['c3.lvl'] = 0; ['c3.ins.danica', 'c3.ins.ljerka', 'c3.ins.zagreb'].forEach(k => delete g9.flags[k]); await load(g9);
    s = await st(); const toBruno = async () => { if ((await st()).room !== 'salon') { await D.exit('stairs'); await D.drain(); } };
    await toBruno(); if (!(await inv('envelope'))) { await D.act('use', 'bench', 'keyring'); await D.drain(); }
    await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'bruno', 'envelope'); await D.drain(); L = await said();
    ok((await D.ev(() => M.GS.flags['c3.lvl'] || 0)) < 3 && !L.some(t => t.indexOf('perdonami') >= 0), 'Umschlag zuerst: Bruno bekommt den Satz noch nicht zusammen (keine Abkürzung)');
    await D.act('use', 'bruno', 'musicbook'); await D.drain(); ok((await D.ev(() => M.GS.flags['c3.lvl'] || 0)) === 2, 'Klavierschule: zweite Erinnerung');
    await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'bruno', 'photo2'); await D.drain(); L = await said();
    ok((await D.ev(() => M.GS.flags['c3.lvl'])) === 3 && L.some(t => t.indexOf('perdonami') >= 0), 'Foto als dritte: jetzt der ganze Satz (Reihenfolge frei)');
    await D.act('talk', 'bruno'); await D.drain(); await D.choose('übersetzen'); await D.until(x => x.overlay === 'puzzle', 8000, 'Rätsel'); for (let i = 0; i < 50 && !(await D.ev(() => !!(M.E.overlay && M.E.overlay.sel))); i++) await D.page.waitForTimeout(40);
    ok(await D.ev(() => M.E.overlay.sel.every(v => v === -1)), 'die Antwortfelder beginnen leer');
    await D.ev(() => { let b = null; for (let y = 0; y < 200 && !b; y++) for (let x = 0; x < 320; x++) if (M.uiHit(x, y) === 'zgo') { b = [x, y]; break; } if (b) { M.pointerDown(b[0] + 3, b[1] + 3, true); M.pointerUp(b[0] + 3, b[1] + 3, true); } });
    await D.page.waitForTimeout(150); const gapMsg = await D.ev(() => M.E.overlay && M.E.overlay.msg);
    ok(gapMsg === 'Da fehlt noch etwas.', '„Vorlesen“ mit leeren Feldern: „Da fehlt noch etwas.“', gapMsg);
    ok(await D.ev(() => !M.E.overlay.data.check([0, 0, 0, 0, 0]).ok && M.E.overlay.data.check([1, 2, 0, 1, 2]).ok), 'die ersten Fassungen sind nicht die Lösung, die richtige Auswahl schon');
    await D.close(null); await D.drain(); s = await st(); if (s.dlg) { await D.choose('Laku noć'); await D.drain(); }
    // ================================================================ 10.–12. neue Rätselformen, nur über Antippen gelöst
    const tapHit = async (id) => { await D.page.waitForTimeout(120); await D.ev((i) => { const h = ((M.E.overlay && M.E.overlay.lay && M.E.overlay.lay.hits) || []).find(x => x.id === i); if (!h) throw new Error('Feld fehlt: ' + i); const x = h.r[0] + (h.r[2] >> 1), y = h.r[1] + (h.r[3] >> 1); M.pointerDown(x, y, true); M.pointerUp(x, y, true); }, id); await D.page.waitForTimeout(100); };
    const ovMsg = () => D.ev(() => M.E.overlay && M.E.overlay.msg);
    out.push('10. Tomažs Briefe ordnen (statt Auswahlzeilen)');
    await load(byLabel(K2, 'Hinter dem Spiegel')); await D.item('read', 'letters_tz'); await D.drain(); await D.until(x => x.overlay === 'arrange', 8000, 'Ordnen');
    ok(await D.ev(() => { const ov = M.E.overlay; const ids = (ov.ord || ov.data.start).map(k => ov.data.items[k].id); return !ov.data.check(ids).ok; }), 'zu Beginn nicht geordnet');
    await tapHit('r0'); ok(await D.ev(() => M.E.overlay.pick === 0), 'ein Brief ist gewählt (oben steht Markos Übersetzung)'); await shot('pb_briefe_gewaehlt');
    await tapHit('r0'); await tapHit('go'); ok(!!(await ovMsg()), 'falsche Reihenfolge: ein Gedanke, woran es liegt', await ovMsg());
    for (let i = 0; i < 6; i++) { const j = await D.ev((i) => M.E.overlay.ord.findIndex(k => M.E.overlay.data.items[k].id === 'l' + (i + 1)), i); if (j !== i) { await tapHit('r' + i); await tapHit('r' + j); } }
    await shot('pb_briefe_geordnet'); await tapHit('go'); await D.drain(); ok(await D.hasNote('s1_letters'), 'durch Tauschen geordnet: die Briefe sind gelesen (s1_letters)');
    out.push('11. Bauakte: Kurrent mit der Tafel vergleichen (statt Auswahlzeilen)');
    await load(byLabel(K2, 'Kurrent-Tafel und Buch')); await D.exit('door'); await D.drain(); if ((await st()).room !== 'map') { await D.exit('exit'); await D.drain(); } await D.travel('obala');
    await talk('amra', 'Ich lese Kurrent'); await D.until(x => x.overlay === 'glyphs', 8000, 'Schrift'); await shot('pb_kurrent_start');
    await tapHit('go'); ok((await ovMsg()) === 'Da fehlt noch etwas.', 'ohne Lesarten: „Da fehlt noch etwas.“');
    const cells = await D.ev(() => { const L = []; M.E.overlay.data.words.forEach((w, wi) => w.forEach((c, ci) => { if (c.k) L.push([wi, ci, c.ok]); })); return L; });
    for (const [wi, ci] of cells) await tapHit('g' + wi + '_' + ci);   // jede Lesart einmal antippen: erste Lesart
    await tapHit('go'); ok(/Grnndmaner/.test((await ovMsg()) || ''), 'erste Lesarten: Amra hört „Grnndmaner“', await ovMsg());
    for (const [wi, ci, want] of cells) { for (let k = 0; k < 4; k++) { const cur = await D.ev(([w, c]) => M.E.overlay.rd[w][c], [wi, ci]); if (cur === want) break; await tapHit('g' + wi + '_' + ci); } }
    await shot('pb_kurrent_richtig'); await tapHit('go'); await D.drain(); s = await st(); if (s.dlg) { await D.choose('Viel Glück'); await D.drain(); }
    ok(await inv('pass') && await F('k2.s2.pass'), 'mit der Tafel richtig gelesen: Amra stellt den Passierschein aus');
    out.push('12. Die zwei Hälften: drehen und tauschen (statt Auswahlzeilen)');
    await load(byLabel(K2, 'Der Karton aus Split ist offen')); await D.act('use', '_mala', 'ticket_m'); await D.drain(); await D.until(x => x.overlay === 'halves', 8000, 'Hälften'); await shot('pb_haelften_start');
    await tapHit('go'); ok(/Riss passt nicht/.test((await ovMsg()) || ''), 'falsche Seiten: der Riss passt nicht');
    await tapHit('sw'); await tapHit('go'); ok(/auf dem Kopf/.test((await ovMsg()) || ''), 'getauscht, eine Hälfte noch verkehrt: „So stehen die Leute auf dem Kopf.“');
    await tapHit('p1'); await shot('pb_haelften_richtig'); await tapHit('go'); await D.until(x => x.overlay !== 'halves', 8000, 'zusammengelegt'); await D.drain();
    ok(await D.hasNote('f2_photo') && await inv('photo_full'), 'zusammengelegt: das ganze Foto, Malas Erinnerungen beginnen');
    // ================================================================ 13. Malas Erinnerungen verteilt
    out.push('13. Malas Erinnerungen: früher durch eigene Handlungen, die Nacht des Busses in der letzten Drei');
    const memTitles = async () => { const T = []; for (let i = 0; i < 40; i++) { const s0 = await D.settle(); if (s0.overlay === 'memory') { T.push(await D.ev(() => M.E.overlay.data.title)); await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(60); continue; } if (s0.overlay && ['notebook', 'puzzle', 'arrange', 'halves', 'glyphs'].indexOf(s0.overlay) < 0) { await D.ev(() => M.TA.closeOverlay()); await D.page.waitForTimeout(60); continue; } break; } return T; };
    const gZb = byLabel(K2, 'Zora ist hinüber'); delete gZb.flags['k2.mem.cellar']; await load(gZb); await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'benches'); let MT = await memTitles(); L = await said();
    ok(MT.indexOf('Erinnerung – der Keller') >= 0 && await F('k2.mem.cellar') && L.some(t => t.indexOf('Ein Mädchen mit Zopf') >= 0 || t === 'Mali.'), 'Kellerschule: am Tisch mit dem M kommt die Erinnerung, ohne Lanas Namen', JSON.stringify(MT));
    const g13 = byLabel(K2, 'Der Karton aus Split ist offen'); g13.flags['k2.mem.cellar'] = true; delete g13.flags['k2.mem.ash']; await load(g13);
    await D.act('use', '_mala', 'ticket_m'); await D.until(x => x.overlay === 'halves', 8000, 'Hälften'); await tapHit('sw'); await tapHit('p1'); await tapHit('go'); await D.until(x => x.overlay !== 'halves', 8000, 'zusammengelegt');
    MT = await memTitles();
    ok(MT.indexOf('Erinnerung – der Keller') < 0 && MT.indexOf('Erinnerung – das schwarze Blatt') >= 0 && MT.indexOf('Erinnerung – die Nacht des Busses') < 0 && MT.length <= 3, 'beim Foto: kein Keller (schon gesehen), das schwarze Blatt nachgeholt, die Nacht des Busses noch nicht', JSON.stringify(MT));
    await load(byLabel(K2, 'Die letzte Fahrt')); await talk('_mala', 'Gib mir deinen Fahrschein', 'Komm.'); await D.act('use', 'tram_stop'); await D.drain();
    await D.act('use', 'validator', 'ticket_m'); await D.drain(); await D.act('use', 'validator', 'ticket_l'); MT = await memTitles();
    ok(MT.indexOf('Erinnerung – die Nacht des Busses') >= 0, 'in der letzten Drei: die Erinnerung an die Nacht des Busses, vor dem Geständnis', JSON.stringify(MT));
    s = await st(); if (s.dlg) { await D.choose('Ich bin nicht gekommen'); await D.drain(); } ok(await F('k2.f2.rideEnd'), 'die Fahrt endet wie vorgesehen');
    // ================================================================ 14. (Nachprüfung) Zusage gespeichert, Wechsel stand aus
    out.push('14. Nach dem Laden: ausstehende Abschnittswechsel werden nachgeholt (Emina und alle ähnlichen Stellen)');
    const phaseAfter = async (ph, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const x = await st(); if (x.dlg) { const o = x.dlg; const bye = o.find(t => /Gehen wir nach Hause|Gute Nacht|Danke/.test(t)); await D.ev((t) => M.TA.choose(t), bye || o[o.length - 1]); } else if (x.overlay && x.overlay !== 'notebook') await D.ev(() => M.TA.closeOverlay()); else if (x.card) await D.ev(() => M.TA.skip && M.TA.skip()); if (x.phase === ph && x.screen === 'game' && !x.busy && !x.card) return ph; await D.page.waitForTimeout(80); } return (await st()).phase; };
    // a) wie im Bericht: Eminas Zusage, dann sofort „Zum Titelbild“, bevor der Nachtwechsel abgeschlossen ist
    await load(byLabel(K2, 'Briefe übersetzt')); await D.exit('door'); await D.drain(); await D.act('talk', 'emina'); await D.drain(); await D.pickNote('s1_missed'); await D.drain();
    await D.until(x => x.overlay === 'notebook', 8000, 'Notizbuch'); await D.ev(() => M.TA.pickNote('s1_betrayal'));
    for (let i = 0; i < 600 && !(await F('k2.s1.emina')); i++) await D.page.waitForTimeout(20);
    ok(await F('k2.s1.emina') && (await st()).phase === 'k2_s1', 'Ausgangslage: Emina hat zugesagt, die Nacht hat noch nicht begonnen');
    await D.ev(() => M.E.toTitle()); await reload(); s = await st();
    if (s.phase === 'k2_s1' && !(await F('k2.s1.emina'))) { await D.act('talk', 'emina'); await D.drain(); s = await st(); if (s.overlay === 'notebook') { await D.pickNote('s1_missed'); await D.drain(); await D.pickNote('s1_betrayal'); } }
    ok((await phaseAfter('k2_s1_n')) === 'k2_s1_n' && (await st()).room === 'kula', 'nach dem Laden: die Nacht unter der Uhr beginnt (Szene wiederholt oder Wechsel nachgeholt)');
    // b) ein Stand der Vorversion, gespeichert zwischen Zusage und Nachtwechsel (so wie im Bericht beschrieben)
    const gE = byLabel(K2, 'Briefe übersetzt'); Object.assign(gE.flags, { 'k2.s1.eminaBack': true, 'k2.s1.given': true, 'k2.s1.emina': true }); gE.inv = gE.inv.filter(i => i !== 'letters_tz' && i !== 'bracelet'); gE.pos.marko = { room: 'kafana', x: 160, y: 124, f: 'L' };
    await load(gE); ok((await phaseAfter('k2_s1_n')) === 'k2_s1_n', 'alter Stand mit Eminas Zusage: die Nacht beginnt beim Laden');
    const gE2 = JSON.parse(JSON.stringify(gE)); gE2.flags['k2.s1.night'] = true; await load(gE2); ok((await phaseAfter('k2_s1_n')) === 'k2_s1_n', 'alter Stand mitten im Nachtwechsel (Schalter gesetzt, Abschnitt alt): der Wechsel läuft erneut');
    // c) die übrigen Stellen mit demselben Muster
    const gZ = byLabel(K2, 'gestempelt'); Object.assign(gZ.flags, { 'k2.s3.mirza': true, 'k2.s3.selma': true, 'k2.s3.damir': true, 'k2.s3.stamped': true }); if (gZ.inv.indexOf('dnevnik') < 0) gZ.inv.push('dnevnik');
    await load(gZ); ok((await phaseAfter('k2_s3_n')) === 'k2_s3_n', 'Zoras Fall: alle haben zugesagt, die Nacht beginnt beim Laden');
    const gI = byLabel(K2, 'Vraćeno: Erkenntnis'); gI.flags['k2.s2.gone'] = true; await load(gI); ok((await phaseAfter('k2_i')) === 'k2_i', 'nach Ivan: das Zwischenspiel auf der Bastei beginnt beim Laden');
    const gF = byLabel(K2, 'Beide entwertet, Geständnis'); if (gF.notes.indexOf('f2_bridge') < 0) gF.notes.push('f2_bridge'); await load(gF); ok((await phaseAfter('k2_epi')) === 'k2_epi', 'nach der Bank in der Baščaršija: der Epilog beginnt beim Laden');
    const gN = byLabel(K1, 'Luka erkennt, dass er tot ist'); Object.assign(gN.flags, { 'c2.done': true, 'c2.ninaGone': true }); await load(gN); ok((await phaseAfter('c3', 40000)) === 'c3', 'nach Ninas Abschied: Sustipan, dann der dritte Fall');
    // ================================================================ 15. (Nachprüfung) Ninas gültige Antworten stehen im Notizbuch
    out.push('15. Nina: alle gültigen Antworten sind im Notizbuch wählbar (über die Oberfläche)');
    const gNi = lastWhere(K1, g => g.phase === 'c2' && g.inv.indexOf('radioT') >= 0 && !g.flags['c2.tonight']); await load(gNi);
    for (const id of ['c2_paintings', 'c2_echo', 'c2_mira1']) await D.ev((i) => { if (M.GS.notes.indexOf(i) < 0) M.GS.notes.push(i); }, id);
    await D.exit('exit'); await D.drain(); await D.exit('exit'); await D.drain(); await D.travel('oldtown'); await D.exit('shop_door'); await D.drain();
    await talk('nina', 'Ich war in der Ledana', 'Ninas Zettel', 'Er hat es mir gesagt', 'Lukas Tickets', 'Die Kassette', 'Wollen Sie es hören'); await D.until(x => x.overlay === 'notebook', 8000, 'Notizbuch'); await D.page.waitForTimeout(250);
    const listed = await D.ev(() => { const seen = new Set(); for (let pg = 0; pg < 6; pg++) { for (let y = 0; y < 200; y += 2) for (let x = 40; x < 290; x += 4) { const u = M.uiHit(x, y); if (u && u.startsWith('n:')) seen.add(u.slice(2)); } let nx = null; for (let y = 0; y < 200 && !nx; y += 2) for (let x = 40; x < 290; x += 4) if (M.uiHit(x, y) === 'nnext') { nx = [x, y]; break; } if (!nx) break; M.pointerDown(nx[0] + 3, nx[1] + 3, true); M.pointerUp(nx[0] + 3, nx[1] + 3, true); } return [...seen]; });
    await D.page.waitForTimeout(150);
    ok(['c2_paintings', 'c2_echo', 'c2_mira1'].every(i => listed.indexOf(i) >= 0), 'Bilder, Nachhall am Kiosk und Miras Aussage stehen zur Wahl', JSON.stringify(listed));
    await D.ev(() => { M.E.closeOverlay(null); }); await D.drain(); s = await st(); if (s.dlg) { await D.choose('Danke'); await D.drain(); }
    await talk('nina', 'Wollen Sie es hören'); await D.until(x => x.overlay === 'notebook', 8000, 'Notizbuch'); await D.page.waitForTimeout(250);
    await D.ev(() => { for (let pg = 0; pg < 6; pg++) { let hit = null; for (let y = 0; y < 200 && !hit; y += 2) for (let x = 40; x < 290; x += 4) if (M.uiHit(x, y) === 'n:c2_paintings') { hit = [x, y]; break; } if (hit) { M.pointerDown(hit[0] + 20, hit[1] + 4, true); M.pointerUp(hit[0] + 20, hit[1] + 4, true); M.pointerDown(hit[0] + 20, hit[1] + 4, true); M.pointerUp(hit[0] + 20, hit[1] + 4, true); return; } let nx = null; for (let y = 0; y < 200 && !nx; y += 2) for (let x = 40; x < 290; x += 4) if (M.uiHit(x, y) === 'nnext') { nx = [x, y]; break; } if (!nx) return; M.pointerDown(nx[0] + 3, nx[1] + 3, true); M.pointerUp(nx[0] + 3, nx[1] + 3, true); } });
    await D.drain(); s = await st(); if (s.dlg) { await D.choose('Dann wissen Sie es'); await D.drain(); }
    ok(await F('c2.tonight'), 'über die Bilder überzeugt (zweimal angetippt): Nina kommt heute Abend an die Rampe');
    const gB = byLabel(K1, 'Bruno erkennt, dass er tot ist'); Object.assign(gB.flags, { 'c3.done': true, 'c3.gone': true }); await load(gB); ok((await phaseAfter('epi')) === 'epi', 'nach Brunos Abschied: der Epilog beginnt beim Laden');
    // ================================================================ 16.–20. (Nachprüfung) Folgedialoge, Gegenstandsregel, Bruno, Ivka, Markos Haltung
    out.push('16. Klassenbuch und Karton passen zu den Erinnerungen; beim Foto höchstens zwei hintereinander');
    const gK = byLabel(K2, 'Šehićs Schlüssel'); await load(gK); const regRead = async () => { await D.ev(() => { M.__speechLog = []; }); await D.item('read', 'dnevnik'); return memTitles(); };
    const hasDn = await D.ev(() => M.GS.inv.indexOf('dnevnik') >= 0);
    if (hasDn) { MT = await regRead(); L = await said(); ok(MT.indexOf('Erinnerung – der Keller') >= 0 && await F('k2.mem.cellar') && !L.some(t => /An gar nichts/.test(t)), 'ohne die Bank: beim eigenen Namen im Klassenbuch kommt die Kellerschule zurück', JSON.stringify(MT)); }
    else { const gK2 = byLabel(K2, 'Klassenbuch'); gK2.notes = gK2.notes.filter(n => ['s3_register', 's3_guilt', 's3_helper', 'm2_pupil'].indexOf(n) < 0); delete gK2.flags['k2.mem.cellar']; await load(gK2); MT = await regRead(); L = await said(); ok(MT.indexOf('Erinnerung – der Keller') >= 0 && !L.some(t => /An gar nichts/.test(t)), 'ohne die Bank: beim eigenen Namen im Klassenbuch kommt die Kellerschule zurück', JSON.stringify(MT)); }
    const gK3 = byLabel(K2, 'Klassenbuch'); gK3.notes = gK3.notes.filter(n => ['s3_register', 's3_guilt', 's3_helper', 'm2_pupil'].indexOf(n) < 0); gK3.flags['k2.mem.cellar'] = true; await load(gK3); MT = await regRead(); L = await said();
    ok(MT.indexOf('Erinnerung – der Keller') < 0 && L.some(t => t.indexOf('Jetzt haben die Bilder Namen.') >= 0) && !L.some(t => /An gar nichts/.test(t)), 'nach der Bank: Marko sagt nicht mehr, er erinnere sich an nichts');
    const gC = byLabel(K2, 'SMS: Paket 4471'); gC.flags['k2.mem.cellar'] = true; delete gC.flags['k2.mem.ash']; await load(gC); await D.travel && 0;
    s = await st(); if (s.room !== 'stanica') { try { await D.exit('door'); await D.drain(); await D.travel('stanica'); } catch (e) {} }
    await talk('fadila', 'Ich möchte ein Paket'); await D.ev(() => { M.__speechLog = []; }); await D.item('open', 'karton'); MT = await memTitles();
    ok(MT.indexOf('Erinnerung – das schwarze Blatt') >= 0 && await F('k2.mem.ash'), 'Karton: das verkohlte Blatt bringt die Erinnerung, auch ohne die Bastei', JSON.stringify(MT));
    await D.act('use', '_mala', 'ticket_m'); await D.until(x => x.overlay === 'halves', 8000, 'Hälften'); await tapHit('sw'); await tapHit('p1'); await tapHit('go'); await D.until(x => x.overlay !== 'halves', 8000, 'zusammengelegt'); MT = await memTitles();
    ok(MT.length === 2 && MT[0] === 'Erinnerung – Samstage' && MT[1] === 'Erinnerung – zwei Fahrscheine', 'beim Foto: nur noch Samstage und Fahrscheine', JSON.stringify(MT));
    out.push('17. Gegenstandsregel: Tomažs Zettel bleibt und geht an Emina; Foto und Fahrschein passen dazu');
    ok(byLabel(K2, 'Die Kula schlägt sieben, Erkenntnis').inv.indexOf('note_e') >= 0, 'nach Tomažs Erkenntnis: Eminas Zettel ist in Markos Leiste (er bleibt)');
    ok(byLabel(K2, 'Tomaž ist hinüber, Splitter: Uhr').inv.indexOf('note_e') < 0, 'nach dem Hinübergehen: Marko hat ihn Emina gegeben');
    const srcM = fs.readFileSync(path.join(__dirname, '..', 'src', '97_k2_mala.js'), 'utf8'), srcK = fs.readFileSync(path.join(__dirname, '..', 'src', 'rooms', 'kula.js'), 'utf8');
    ok(!/noch nie etwas hergegeben/.test(srcM) && !/etwas hergeben\. Einmal/.test(srcK) && /Die konnte ich loslassen/.test(srcM), 'keine widersprüchlichen Sätze mehr (\u201enie etwas hergegeben\u201c, \u201eeinmal\u201c); Mala lässt die Fotohälfte ausdrücklich los');
    out.push('18. Bruno: die zweite Kerze');
    const gBr = byLabel(K1, 'Bruno erkennt, dass er tot ist'); ok(gBr.rooms.salon && gBr.rooms.salon.candles === 2, 'Ljerka hat zwei Kerzen auf den Flügel gestellt, als Bruno es erkennt');
    out.push('19. Ivka: Handschuhe aus der Leiste');
    const gIv = await D.ev(() => JSON.parse(JSON.stringify(M.PRESETS.ivka.GS))); gIv.notes = gIv.notes.filter(n => n !== 'c1_ferry'); await load(gIv); await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'ivka', 'gloves'); await D.drain(); L = await said();
    ok(L.some(t => t.indexOf('Ich trage keine') >= 0) && !L.some(t => /mitten im Satz/.test(t)) && (await st()).overlay !== 'notebook', 'noch nicht alles beisammen: Ivka sagt, dass sie keine trägt (kein „mitten im Satz“)');
    await D.ev(() => M.E.loadPreset('ivka', 3)); await D.page.waitForTimeout(200); await D.drain(); await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'ivka', 'gloves'); await D.until(x => x.overlay === 'notebook', 8000, 'Notizbuch'); L = await said();
    ok(L.some(t => t.indexOf('Wer schickt mir Handschuhe') >= 0), 'alles beisammen: die Handschuhe beginnen das Abschiedsgespräch');
    await D.ev(() => M.E.closeOverlay(null)); await D.drain();
    out.push('20. Markos Haltung nach der Bura');
    await load(byLabel(K1, 'Sanja bestätigt den Zettel')); await D.ev(() => { M.__speechLog = []; }); await D.exit('door'); await D.drain(); await D.act('walk', 'loc_varos'); await D.drain(); L = await said();
    ok(L.some(t => t.indexOf('Mala will ans Wasser') >= 0) && !L.some(t => /einrede/.test(t)), 'Reisesperre nach dem Zettel: kein Zweifel mehr, ob er sich alles einredet');
    await D.travel('riva'); await D.ev(() => { M.__speechLog = []; }); await D.act('use', 'bench'); for (let i = 0; i < 6; i++) { s = await st(); if (s.dlg) { await D.choose(s.dlg.find(t => /Gehen wir/.test(t)) ? 'Gehen wir' : s.dlg[0]); await D.drain(); } } L = await said();
    ok(L.some(t => t.indexOf('An dich schon. Das ist schlimmer.') >= 0), 'auf der Bank: nicht der alte Zweifel, sondern was es heißt, ihr zu glauben');
  } catch (e) { fail++; out.push('ABBRUCH ' + e.message); }
  console.log(out.join('\n')); console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`); console.log(D.errors.slice(0, 5).join('\n') || 'keine JS-Fehler');
  await D.close2(); process.exitCode = fail ? 1 : 0;
})();
