// BUG-016 (ANALYSE_GILBERT.md K4-B04; Soll-Liste P14):
// (1) Prolog: Nach der Probe beendete „(Ein Hemd anziehen.)“ das Gespräch, bevor „Ich habe Lana gefunden“ fallen konnte; der Prolog war vorbei.
//     Jetzt endet der Prolog erst mit Lana; Marko sagt, was fehlt.
// (2) Christtag: Waren Peppino und Gerda erledigt, beendete die Stiefel-Erinnerung den Tag sofort; Straßenbahn und Lanas Tod waren weg.
//     Jetzt endet der Tag erst beim Weggehen (oder nach „Lana ist tot“).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const ph = (D) => D.ev(() => M.GS.phase);
module.exports = { id: 'BUG-016', title: 'K4: Prolog endet erst mit Lana; Christtag endet nicht mitten auf der Wiesn', async run(html) {
  const D = await open({ seed: 16, html }); const out = [];
  // (1) Probe schon angesprochen, Lana noch nicht
  await FX.load(D, 'k4_012_kaffee.json', { setFlags: { 'k4.p.jasna': true, 'k4.p.hansi': true }, delFlags: ['k4.p.lana'] }); await D.settle();
  await D.act('talk', 'jasna'); await D.drain(); const labels1 = await D.ev(() => (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || []);
  await FX.closeMenu(D); await D.drain(); const t1 = await FX.said(D); const p1 = await ph(D);
  const ok1a = labels1.indexOf('(Ein Hemd anziehen.)') < 0 && p1 === 'k4_pro' && /Mama weiß noch nicht, dass ich sie gefunden habe/.test(t1);
  out.push('ohne Lana kein Prologende=' + ok1a + (ok1a ? '' : ' (' + labels1.join(' / ') + ' | ' + p1 + ')'));
  await D.act('talk', 'jasna'); await D.choose('Ich muss dir etwas erzählen'); await D.choose('Ich habe Lana gefunden'); await D.drain();
  for (let i = 0; i < 40 && (await ph(D)) === 'k4_pro'; i++) { const s = await D.st(); if (s.dlg) { const L = s.dlg; const b = L.find(t => /Hemd/.test(t)) || L[L.length - 1]; await D.choose(b); } await D.drain(); }
  const ok1b = (await ph(D)) === 'k4_pro_n'; out.push('mit Lana zum Heiligabend=' + ok1b);
  // (2) Peppino und Gerda erledigt, dann die Wiesn: das Foto weckt die Stiefel-Erinnerung
  await FX.load(D, 'k4_018_wiesn.json', { addNotes: ['s4_peppino', 'g4_gerda'] }); await D.settle();
  await D.act('talk', 'ana'); await D.choose('Zeigst du mir'); await D.drain();
  const s2 = await D.ev(() => ({ ph: M.GS.phase, st: M.GS.notes.indexOf('z4_stiefel') >= 0, opts: (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || [] }));
  const ok2a = s2.ph === 'k4_d1' && s2.st && s2.opts.some(t => /Straßenbahn gemalt/.test(t)); out.push('nach der Erinnerung bleibt der Tag, Straßenbahn wählbar=' + ok2a + (ok2a ? '' : ' (' + JSON.stringify(s2) + ')'));
  await FX.closeMenu(D); await D.drain(); const p2 = await ph(D);
  await D.travel('westend'); await D.drain(); for (let i = 0; i < 30 && (await ph(D)) === 'k4_d1'; i++) await D.page.waitForTimeout(500);
  const ok2b = p2 === 'k4_d1' && (await ph(D)) === 'k4_d1_n'; out.push('Tag endet beim Weggehen=' + ok2b + (ok2b ? '' : ' (' + p2 + ' → ' + (await ph(D)) + ')'));
  return { ok: ok1a && ok1b && ok2a && ok2b, detail: out.join('; ') };
} };
