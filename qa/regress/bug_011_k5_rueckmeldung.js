// BUG-011 (ANALYSE_GILBERT.md K5-B04, K5-B02, K5-B01, Muster 7):
// (1) Nach einem Abschnittswechsel aus einem Gespräch heraus blieb das alte Menü offen (Nedžads Optionen in Nadas Wohnung).
// (2) „Ein Vorschlag“ stand ohne „Zwei Hälften“ im Menü und wurde abgelehnt; der Hinweis riet genau dazu (Schleife).
// (3) Plausible Paare zu „Wem gehören die Fahrscheine?“ bekamen Pool-Sätze, fallübergreifende sogar „nicht ineinanderschieben“.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-011', title: 'K5: kein Menü nach Abschnittswechsel; Vorschlag erst mit „Zwei Hälften“; Beinahe-Treffer bei den Fahrscheinen', async run(html) {
  const D = await open({ seed: 11, html }); const out = [];
  // (1) Brauerei schon erledigt, dann Nedžad „Nadas Tafel …“ → Abend; danach darf kein Menü Nedžads mehr offen sein
  await FX.load(D, 'k5_014_donnerstag.json', { addNotes: ['b5_reihe'], pos: 'kazandziluk5' }); await D.settle();
  await D.act('talk', 'nedzad'); await D.choose('Nadas Tafel');
  for (let i = 0; i < 40; i++) { const s = await D.settle(120000); if (s.overlay && !s.dlg) { await D.ev(() => M.TA.closeOverlay()); continue; } break; }
  const s1 = await D.ev(() => ({ phase: M.GS.phase, room: M.API.room && M.API.room.id, dlg: M.E.dlg ? M.E.dlg.opts.map(o => o.t) : [] }));
  const ok1 = s1.phase === 'k5_n1' && !s1.dlg.some(t => /Stemmeisen|Bis später, Nedžad/.test(t)); out.push('Menü nach Abendwechsel weg=' + ok1 + ' (' + s1.room + ', ' + JSON.stringify(s1.dlg) + ')');
  // (2) Beide Sätze gesagt, „Zwei Hälften“ fehlt: kein Vorschlag, Hinweis zeigt aufs Notizbuch; mit dem Schluss ist der Vorschlag da
  await FX.load(D, 'k5_038_zwei_namen.json', { delFlags: ['k5.s.agreed'], delNotes: ['s5_teile'] }); await D.settle();
  await D.act('talk', 'nada'); await D.until(s => s.dlg, 20000, 'Nadas Menü'); const m1 = await D.ev(() => M.E.dlg.opts.map(o => o.t)); await FX.closeMenu(D); await D.drain();
  const hint = await D.ev(() => { const h = M.hintsOpen(M.GS).find(x => x.id === 'h5j'); return h ? M.hintText(h, 3, M.GS, 'marko') : ''; });
  const c = await D.ev(() => M.TA.combine('s5_beide', 's5_brett'));
  await D.act('talk', 'nada'); await D.until(s => s.dlg, 20000, 'Nadas Menü'); const m2 = await D.ev(() => M.E.dlg.opts.map(o => o.t)); await FX.closeMenu(D); await D.drain();
  const ok2 = !m1.some(t => /Ein Vorschlag/.test(t)) && /Notizbuch/.test(hint) && c && c.ok && m2.some(t => /Ein Vorschlag/.test(t)); out.push('Vorschlag erst mit Zwei Hälften, Hinweis aufs Notizbuch=' + ok2);
  // (3) Fahrscheine: plausible Paare zeigen auf die Treppe; fallfremde Absage neutral
  await FX.load(D, 'k5_030_freitag.json', {}); await D.settle();
  const r = await D.ev(async () => ({ tuer: await M.TA.combine('f5_wem', 'f5_tuer'), fenster: await M.TA.combine('f5_wem', 'k5_c_muenchen'), plaetze: await M.TA.combine('f5_wem', 'f5_plaetze'), quer: await M.TA.combine('f5_tuer', 's5_brett') }));
  const t = (x) => (x && x.t) || '';
  const ok3 = /Treppe/.test(t(r.tuer)) && /zweite/.test(t(r.fenster)) && /holt/.test(t(r.plaetze)) && !/ineinanderschieben|verschiedene Geschichten/.test(t(r.quer)); out.push('Beinahe-Treffer und neutrale Absage=' + ok3 + ' („' + t(r.quer) + '“)');
  return { ok: ok1 && ok2 && ok3, detail: out.join('; ') };
} };
