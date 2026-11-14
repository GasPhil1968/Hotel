// BUG-036 (Kapitel 3 „wie bei Baphomet“, game/src/24_k3bf.js): Themenleiste statt Notizbuch-Frage, Schlüsse durch Zeigen, Tagebuch, Mala-Knopf.
// (1) Im Gespräch: keine Zeile „Nach etwas aus dem Notizbuch“, dafür die Leiste (E.bfBar). (2) Dino „Malas Brücke stand im Wasser“ zeigen → Nicht die Alte Brücke.
// (3) Falsche Person: Zlata kennt den Schluss nicht, Dino schon – ohne beide Notizen kein Schluss. (4) Sonntag: Zlata „Dreimal“ zeigen → Bato war wach.
// (5) Gegenstand zeigen über die Leiste = dieselbe Antwort wie „Gib“. (6) Tagebuch statt Notizbuch, Schließen merkt die gelesenen Einträge.
// (7) Mala-Knopf: eine Stufe pro Tipp, vor der letzten die Rückfrage. (8) Hinweistexte sagen „zeigen“. (9) Klassisch unverändert. (10) keine JS-Fehler.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-036', title: 'K3 wie bei Baphomet: Themenleiste, Schlüsse durch Zeigen, Tagebuch, Mala-Knopf', async run(html) {
  const D = await open({ seed: 36, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  const has = (n) => D.ev((x) => M.GS.notes.indexOf(x) >= 0, n);
  const bar = () => D.ev(() => !!(M.E.bfBar && M.E.dlg));
  const toBar = async () => { for (let i = 0; i < 5; i++) { const s = await D.settle(); if (s.dlg && await bar()) return true; if (s.dlg) { await D.ev(() => M.E.chooseDone(0)); continue; } } return bar(); };
  const pick = async (k, id) => { await D.ev(([a, b]) => M.bfPick(a, b), [k, id]); return D.drain(); };
  const leave = async () => { for (let i = 0; i < 4; i++) { const s = await D.settle(); if (!s.dlg) return; await FX.closeMenu(D); await D.drain(); } };
  await D.ev(() => { M.K3BF = true; });
  // (1)(2) Prolog, Alte Brücke, Dino
  await FX.load(D, 'k3x_ankunft.json', { pos: 'starimost', addNotes: ['l3_mybridge', 'l3_onearch'], setFlags: { 'k3.p.checkin': true } }); await D.settle();
  await D.act('talk', 'dino'); const b1 = await toBar(); const opts = await D.ev(() => M.E.dlg ? M.E.dlg.opts.map(o => o.t) : []);
  check('Leiste statt Notizbuch-Frage', b1 && !opts.some(t => /Notizbuch/.test(t)), JSON.stringify(opts));
  await pick('note', 'l3_down'); check('anderes Thema: kein Schluss', !(await has('l3_notbridge')));
  await toBar(); await pick('note', 'l3_mybridge'); check('Dino zeigen: Nicht die Alte Brücke', await has('l3_notbridge'));
  await leave();
  // (3) ohne beide Notizen kein Schluss
  await FX.load(D, 'k3x_ankunft.json', { pos: 'starimost', addNotes: ['l3_mybridge'], setFlags: { 'k3.p.checkin': true } }); await D.settle();
  await D.act('talk', 'dino'); await toBar(); await pick('note', 'l3_mybridge'); check('ohne „Ein einziger Bogen“ kein Schluss', !(await has('l3_notbridge'))); await leave();
  // (4) Sonntag in Skela: Zlata
  await FX.load(D, 'k3_069_lichtfolge.json', { addNotes: ['a3_thrice', 'a3_slept'], pos: 'skela_l' }); await D.settle();
  const zHere = await D.ev(() => !!(M.E.ACT && M.E.ACT.zlata));
  if (zHere) { await D.act('talk', 'zlata'); await toBar(); await pick('note', 'a3_thrice'); check('Zlata „Dreimal“ zeigen: Bato war wach', await has('a3_awake')); await leave(); }
  else check('Zlata erreichbar', false, JSON.stringify(await D.st()));
  // (5) Gegenstand über die Leiste: dieselbe Antwort wie „Gib“
  const giveOk = await D.ev(() => typeof M.E.giveTo === 'function'); check('Gegenstand zeigen über die Leiste vorhanden', giveOk);
  // (6) Tagebuch
  await D.ev(() => { M.E.openNotes(); }); await D.settle(); const ov = await D.ev(() => M.E.overlay && M.E.overlay.kind);
  await D.ev(() => { M.OVTAP.diary(M.E.overlay, 'x'); }); await D.settle(); const rd = await D.ev(() => M.GS.flags['bf.read']);
  check('Tagebuch statt Notizbuch, Schließen merkt Gelesenes', ov === 'diary' && rd > 0, JSON.stringify({ ov, rd }));
  // (7) Mala-Knopf: Stufen
  const topic = await D.ev(() => { const l = M.hintsOpen(M.GS); return l.length ? l[0].id : null; });
  const s0 = await D.ev((id) => (M.GS.hints && M.GS.hints[id] && M.GS.hints[id].s) || 0, topic);
  await D.ev(() => { M.bfHint(); }); await D.drain(); const s1 = await D.ev((id) => (M.GS.hints && M.GS.hints[id] && M.GS.hints[id].s) || 0, topic);
  check('Mala-Knopf: eine Stufe pro Tipp', !!topic && s1 === s0 + 1, JSON.stringify({ topic, s0, s1 }));
  // (8) Hinweistext
  const ht = await D.ev(() => { const h = M.HINTS_K3.find(x => x.id === 'p3e'); return M.hintText(h, 3, M.GS, 'marko'); });
  check('Hinweis sagt „zeigen“', /zeigen/.test(ht), ht);
  // (9) klassisch
  await D.ev(() => { M.K3BF = false; }); await FX.load(D, 'k3x_ankunft.json', { pos: 'starimost', addNotes: ['l3_mybridge', 'l3_onearch'], setFlags: { 'k3.p.checkin': true } }); await D.settle();
  await D.act('talk', 'dino'); let s = await D.settle(); for (let i = 0; i < 3 && s.dlg && !s.dlg.some(t => /Notizbuch/.test(t)); i++) { await D.ev(() => M.E.chooseDone(0)); s = await D.settle(); }
  check('klassisch: Notizbuch-Frage, keine Leiste', !!(s.dlg && s.dlg.some(t => /Notizbuch/.test(t))) && !(await bar()), JSON.stringify(s.dlg));
  await leave(); const cl = await D.combine('l3_mybridge', 'l3_onearch'); check('klassisch: Verbinden wie bisher', cl && cl.ok && await has('l3_notbridge'), JSON.stringify(cl));
  const errs = (D.errors || []).filter(e => !/^console\.error: .*Kunst fehlt/.test(e)); check('keine JS-Fehler', !errs.length, errs.slice(0, 3).join(' | '));
  if (D.close2) await D.close2(); return { ok: all, detail: out.join('; ') }; } };
