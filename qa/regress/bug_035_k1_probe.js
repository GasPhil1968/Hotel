// BUG-035 (Probe Kapitel 1, game/src/23_k1probe.js): Kreuzverhör statt Kombinieren, Nachruf als Lückentext.
// (1) Ivka: Beinahe-Treffer kostet nichts, falscher Beleg kostet Geduld, Treffer bringt die nächste Runde; danach Brief und Handschuhe wie bisher.
// (2) Geduld aufgebraucht: Gespräch endet, Fortschritt der Runden bleibt. (3) Luka: Kiosk-Beleg bringt „Nina hat gewartet“.
// (4) Jakov: zwei Runden, am Ende „Er hat sie umgebettet“. (5) Notizbuch kombiniert nicht mehr. (6) Nachruf: zwei Fehler → „fast“,
// Lücke aufdecken, richtig → gedruckt. (7) Klassischer Modus unverändert (Kombinieren geht).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-035', title: 'K1-Probe: Kreuzverhöre Ivka, Luka, Jakov; Nachruf; Notizbuch ohne Kombinieren', async run(html) {
  const D = await open({ seed: 35, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  const has = (n) => D.ev((x) => M.GS.notes.indexOf(x) >= 0, n), fl = (k) => D.ev((x) => M.GS.flags[x], k);
  const ovk = () => D.ev(() => M.E.overlay && M.E.overlay.kind);
  const title = () => D.ev(() => (M.E.dlg && M.E.dlg.title) || '');
  // Beleg zeigen: Menüpunkt, dann im Polaroid-Overlay zweimal antippen (Auswahl, Bestätigung)
  const show = async (id) => { await D.choose('Beleg zeigen'); await D.until(s => s.overlay === 'evidence', 20000, 'Belege');
    await D.ev((n) => { const ov = M.E.overlay; M.OVTAP.evidence(ov, 'n:' + n); M.OVTAP.evidence(ov, 'n:' + n); }, id); await D.settle(); };
  await D.ev(() => { M.K1NEU = true; });
  // (1) Ivka
  await FX.load(D, 'k1_30_mole_vor_wahrheit.json', { delNotes: ['c1_came', 'c1_aboard'], pos: 'riva' }); await D.settle();
  await D.act('talk', 'ivka'); await D.drain(); await D.choose('Ich muss Ihnen etwas sagen');
  const t0 = await title(); check('Kreuzverhör beginnt (Aussage, Geduld)', /Ivka · Das Boot um sieben · Aussage 1\/3 · Geduld 3\/3/.test(t0), t0);
  await D.choose('Nächste Aussage'); await show('c1_boat7'); const t1 = await title();
  await show('c1_letter'); const t2 = await title();
  check('Beinahe-Treffer kostet nichts, falscher Beleg kostet Geduld', /Geduld 3\/3/.test(t1) && /Geduld 2\/3/.test(t2), t1 + ' | ' + t2);
  await show('c1_ferry'); const t3 = await title(); check('Treffer: zweite Runde', /Morgen früh/.test(t3), t3);
  await D.choose('Nächste Aussage'); await show('c1_capsized'); await D.drain();
  check('Ivka-Schluss als Notiz', (await has('c1_came')) && await has('c1_aboard'));
  await D.choose('Seinen Brief vorlesen'); await D.drain(); await D.choose('grauen Handschuhe'); await D.drain(); await D.choose('nicht mehr hier'); await D.drain();
  check('danach Brief und Handschuhe wie bisher', !!(await fl('c1.release')));
  // (2) Geduld aufgebraucht, Fortschritt bleibt (Jakov, Runde 1 schon geschafft)
  await FX.load(D, 'k1_53_jakov.json', { pos: 'sustipan', addNotes: ['cj_1958', 'cj_stipe', 'cj_tree', 'cj_roots', 'cj_path'] }); await D.settle();
  await D.act('talk', 'jakov'); await D.drain(); await D.choose('Jakov zur Rede stellen');
  await D.choose('Nächste Aussage'); await show('cj_stipe'); await D.drain();
  const r1 = await fl('cx.jakov'); await show('cj_path'); await show('cj_path'); await show('cj_path'); await D.drain();
  const dlgGone = !(await D.ev(() => M.E.dlg && /Jakov ·/.test(M.E.dlg.title || '')));
  check('drei falsche Belege: er dreht sich weg, Runde 2 bleibt', r1 === 1 && dlgGone && (await fl('cx.jakov')) === 1, JSON.stringify({ r1, dlgGone }));
  // (4) Jakov, zweiter Anlauf: Runde 2
  await D.ev(() => { if (M.E.dlg) M.TA.closeMenu && M.TA.closeMenu(); }); await FX.closeMenu(D); await D.drain();
  await D.act('talk', 'jakov'); await D.drain(); await D.choose('Jakov zur Rede stellen'); const t4 = await title();
  await D.choose('Nächste Aussage'); await show('cj_roots'); await show('cj_tree'); await D.drain();
  check('Jakov: Runde 2 beginnt sofort, Treffer bringt den Schluss', /Wo Anka schläft/.test(t4) && await has('cj_where'), t4);
  // (5) Notizbuch kombiniert nicht mehr
  await FX.closeMenu(D); await D.drain(); const cmb = await D.combine('cj_path', 'cj_roots');
  check('Notizbuch verbindet nichts mehr', cmb && !cmb.ok && /im Gespräch/.test(cmb.t || ''), JSON.stringify(cmb));
  // (3) Luka
  await FX.load(D, 'k1_44_nina_gewartet.json', { delNotes: ['c2_waited'], pos: 'ledana' }); await D.settle();
  await D.act('talk', 'luka'); await D.drain(); await D.choose('Luka zur Rede stellen'); await D.choose('Nächste Aussage');
  await show('c2_unused'); const t5 = await title(); await show('c2_echo'); await D.drain();
  check('Luka: Reservierung knapp daneben, Kiosk-Nachhall bringt „Nina hat gewartet“', /Geduld 3\/3/.test(t5) && await has('c2_waited'), t5);
  // (6) Nachruf
  await FX.load(D, 'k1_53_jakov.json', { pos: 'sustipan' }); await D.settle();
  D.ev(() => { M.k1Obit(M.API, 'anka'); }); await D.until(s => s.overlay === 'obit', 20000, 'Nachruf');
  const res = await D.ev(() => { const ov = M.E.overlay, B = ov.data.parts.filter(s => typeof s !== 'string'), T = M.OVTAP.obit;
    const words = B.map(b => b.a); words[0] = 'Perić'; words[2] = '1959';
    words.forEach((w, k) => { T(ov, 'b' + k); T(ov, 'w:' + w); }); T(ov, 'go'); const m1 = ov.msg;
    T(ov, 'go'); T(ov, 'rv'); T(ov, 'b2'); T(ov, 'b2'); T(ov, 'w:1947'); T(ov, 'go'); const done = !!ov.done; T(ov, 'go'); return { m1, done }; });
  await D.drain(); const printed = await fl('obit.anka');
  check('Nachruf: zwei Fehler „fast“, aufdecken, dann gedruckt', /Fast/.test(res.m1 || '') && res.done && !!printed, JSON.stringify(res));
  // (7) klassisch
  await D.ev(() => { M.K1NEU = false; }); await FX.load(D, 'k1_53_jakov.json', { pos: 'sustipan', addNotes: ['cj_stipe', 'cj_tree'] }); await D.settle();
  const cl = await D.combine('cj_stipe', 'cj_tree'); check('klassisch: Kombinieren wie bisher', cl && cl.ok && await has('cj_where'), JSON.stringify(cl));
  const errs = (D.errors || []).filter(e => !/^console\.error: .*Kunst fehlt/.test(e)); check('keine JS-Fehler', !errs.length, errs.slice(0, 3).join(' | '));
  if (D.close2) await D.close2(); return { ok: all, detail: out.join('; ') }; } };
