// BUG-020 (ANALYSE_GILBERT.md K3-B10, K5-B04 zweiter Fall; Restpunkte der Kann-Liste):
// (1) K3: Ein Ortswechsel bewegte nur die aktive Figur. Endete ein Abschnitt, während Mala spielte, blieb Marko am alten Ort zurück.
//     Jetzt spielt vor den Übergängen Marko, und Mala kommt mit (wie bring() in Kapitel 4 und 5). Kapitel 2 hat dieselbe Regel bekommen.
// (2) K5, Freitagabend beim Totenmahl: Ist „Die Fahrscheine sind für Mama“ schon geschlossen, beginnt mit „Mama?“ die Nacht auf der Bastei.
//     Danach darf kein Rest des Tischgesprächs offen bleiben (Gesprächsschleife, P10).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-020', title: 'Abschnittswechsel als Mala (K2, K3) und Freitagabend ohne übriges Menü (K5)', async run(html) {
  const D = await open({ seed: 20, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  // (1) Freitag in Mostar: alles für den Tag erledigt, Mala spielt, der Abschnitt endet
  await FX.load(D, 'k3_037_kata.json', { addNotes: ['l3_skela'], setFlags: { 'k3.v.drawer': true }, active: 'mala' }); await D.settle();
  // seit der Revision (Prüfbericht K3-02) endet der Tag bewusst: der Übergang selbst wird aufgerufen, wie in Teil (1b)
  await D.ev(() => M.k3StartD1Night(M.API)); await D.drain(); for (let i = 0; i < 20 && (await D.ev(() => M.GS.phase)) === 'k3_d1'; i++) await D.page.waitForTimeout(500);
  const s1 = await D.ev(() => ({ ph: M.GS.phase, act: M.GS.active, marko: M.GS.pos.marko.room, mala: M.GS.pos.mala.room }));
  check('K3 Abschnittswechsel als Mala', s1.ph === 'k3_d1_n' && s1.act === 'marko' && s1.marko === 'herberge' && s1.mala === 'herberge', JSON.stringify(s1));
  // (1b) Kapitel 2: Sonntagabend beginnt, während Mala in der Kafana spielt (Übergang direkt aufgerufen)
  await FX.load(D, 'k2_22_kafana.json', { active: 'mala' }); await D.settle();
  const e2 = await D.ev(async () => { try { await M.k2StartS1Night(M.API); return ''; } catch (e) { return String(e); } }); await D.drain();
  const s1b = await D.ev(() => ({ ph: M.GS.phase, act: M.GS.active, marko: M.GS.pos.marko.room, mala: M.GS.pos.mala.room }));
  check('K2 Abschnittswechsel als Mala', !e2 && s1b.ph === 'k2_s1_n' && s1b.act === 'marko' && s1b.marko === 'kula' && s1b.mala === 'kula', e2 || JSON.stringify(s1b));
  // (2) Totenmahl: Nada ist bedankt, die Fahrscheine sind schon gedeutet; „Mama?“ schließt den Abend
  await FX.load(D, 'k5_042_totenmahl.json', { addNotes: ['f5_jasna'], setFlags: { 'k5.e.mealN': true } }); await D.settle();
  await D.act('talk', 'jasna'); await D.choose('Mama?'); await D.drain();
  for (let i = 0; i < 40; i++) { const s = await D.st(); if (s.phase !== 'k5_d2_n' || (!s.busy && !s.dlg)) break; if (s.dlg && s.dlg.some(t => /Gute Nacht, Mama|Morgen um elf/.test(t))) break; if (s.dlg) await D.choose(s.dlg[0]); await D.drain(); }
  const s2 = await D.ev(() => ({ room: M.API.room.id, n2: !!M.GS.flags['k5.n2.started'], dlg: (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || [] }));
  check('K5 Freitagabend ohne übriges Menü', s2.n2 && s2.room !== 'stan5' && !s2.dlg.some(t => /Gute Nacht, Mama|Morgen um elf|Die zwei Taschen/.test(t)), JSON.stringify(s2));
  return { ok: all, detail: out.join('; ') };
} };
