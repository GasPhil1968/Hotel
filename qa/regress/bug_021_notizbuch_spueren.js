// BUG-021 (ANALYSE_GILBERT.md Muster 1 und 6, K1-B07, K1-B09 ff., K2-B09; Kann-Liste P21–P24):
// (1) P21: Mala kann auch an alltäglichen Dingen „Spüren“; der Satz ist je Ding fest. In Malas Zuhause gibt es kein neutrales „Spüren“.
// (2) P22: Quellen eines Schlusses, dessen Inhalt anders bekannt wurde, stehen unter „Erledigt“ (l3_notbridge); Quellen aus einer anderen
//     Frage bleiben offen (k3_c_bridge). „Offen“ ist nach Frage gruppiert.
// (3) P23: Was das Spiel sich im Hintergrund merkt, steht unter „Gehört“ (Kapitel 1: „trinaest … Haken“).
// (4) P24: Antworten auf solche Notizen sind im Gespräch erreichbar (Tomaž, Kapitel 2); Miras Antwort hing an einer Notiz, die es nicht gab.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const capture = (D) => D.ev(() => { const L = []; const t0 = M.text; M.text = function (b, s) { L.push(String(s)); return t0.apply(this, arguments); }; try { M.renderFrame(); } finally { M.text = t0; } return L; });
module.exports = { id: 'BUG-021', title: 'Notizbuch: Seiten „Erledigt“ und „Gehört“, Gruppen, erreichbare Antworten; „Spüren“ an mehr Stellen', async run(html) {
  const D = await open({ seed: 21, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  // (1) Kapitel 1, in der Bar: der Tresen
  await FX.load(D, 'k1_43_nina.json', { pos: 'bar' }); await D.settle(); await D.switchTo('mala');
  const o1 = await D.ev(() => (M.E.hsOpts(M.E.room.byId.counter) || []).map(o => o.v));
  await D.ev(() => { M.__speechLog = []; }); await D.act('sense', 'counter'); await D.drain(); const s1 = await FX.said(D);
  await D.ev(() => { M.__speechLog = []; }); await D.act('sense', 'counter'); await D.drain(); const s2 = await FX.said(D);
  const lines = await D.ev(() => [].concat(...Object.values(M.SENSE_LINES)));
  const home = await D.ev(() => { const R = M.ROOMS.stan; return R.hotspots.filter(h => M.senseNeutral(h, 'stan')).length; });
  check('P21 Spüren am Tresen', o1.includes('sense') && lines.includes(s1) && s1 === s2 && home === 0, JSON.stringify({ o1, s1, s2, home }));
  // (2) Kapitel 3, Freitag: die Brücke ist anders geklärt, Malas Splitter bleibt offen; Gruppen im Notizbuch
  await FX.load(D, 'k3_037_kata.json', {}); await D.settle();
  const L2 = await D.ev(() => { const L = M.E.nbLists(false); return { open: L.open, done: L.done, held: M.GS.notes.includes('l3_notbridge'), unc: M.GS.notes.includes('l3_uncounted') }; });
  await D.ev(() => { M.E.openNotes(); }); await D.page.waitForTimeout(200); const t2 = await capture(D); await D.ev(() => M.E.closeOverlay(null));
  check('P22 Quelle erledigt, andere Frage offen', L2.held && !L2.unc && !L2.open.includes('l3_notbridge') && L2.done.includes('l3_notbridge') && L2.open.includes('k3_c_bridge'), JSON.stringify({ held: L2.held, unc: L2.unc, nb: L2.open.includes('l3_notbridge') }));
  check('P22 Gruppen und Seiten', t2.includes('Offen') && t2.includes('Erledigt') && t2.some(s => /^(Aus Sarajevo|Die Brücke|Die Leine|Die Peilung|Zwei Namen)$/.test(s)), t2.slice(0, 12).join(' / '));
  // (3) Kapitel 1, Bruno: „trinaest … Haken“ steht unter „Gehört“
  await FX.load(D, 'k1_55_bruno.json', {}); await D.settle();
  const L3 = await D.ev(() => M.E.nbLists(false));
  await D.ev(() => { M.E.openNotes(); }); await D.page.waitForTimeout(200); await D.ev(() => M.E.nbTab('heard')); const t3 = await capture(D); await D.ev(() => M.E.closeOverlay(null));
  check('P23 Seite Gehört', L3.heard.includes('c3_f13') && !L3.open.includes('c3_f13') && t3.includes('Gehört'), JSON.stringify({ heard: L3.heard.length }));
  // (4a) Kapitel 2, Tomaž am Tag: nach seinem Namen fragen (die Notiz stand nie im Notizbuch)
  await FX.load(D, 'k2_14_zwei_siebenen.json', { addNotes: ['s1_name'] }); await D.settle(); await D.ev(() => { M.__speechLog = []; M.__nbOlder = []; });
  await D.act('talk', 'tomaz'); await D.drain(); await D.choose('Nach etwas aus dem Notizbuch'); await D.pickNote('s1_name'); await D.drain(); await FX.closeMenu(D); await D.drain();
  const t4 = await FX.said(D), older = await D.ev(() => M.__nbOlder || []);
  check('P24 Tomaž: Antwort auf eine Notiz unter „Gehört“', /Zupan\. Tomaž Zupan/.test(t4) && older.some(x => /s1_name/.test(x)), t4.slice(0, 160));
  // (4b) Kapitel 1, Mira am Fährterminal: die Tickets aus dem Koffer
  await FX.load(D, 'k1_43_nina.json', { pos: 'terminal', addNotes: ['c2_case'] }); await D.settle(); await D.ev(() => { M.__speechLog = []; });
  await D.act('talk', 'mira'); await D.drain(); await D.choose('Nach etwas aus dem Notizbuch'); await D.pickNote('c2_case'); await D.drain(); await FX.closeMenu(D); await D.drain();
  const t5 = await FX.said(D); check('P24 Mira: Antwort auf den Koffer', /als wären sie aus Glas/.test(t5), t5.slice(0, 160));
  return { ok: all, detail: out.join('; ') };
} };
