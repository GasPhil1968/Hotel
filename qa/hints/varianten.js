'use strict';
/* ===== qa/hints/varianten.js — Stände abseits der Musterlösung für die Hinweisprobe (ANALYSE_GILBERT.md, P12) =====
   Jede Variante beginnt bei einem Spielstand aus den Durchläufen (qa/regress/fixtures) und weicht ab: anderer Weg, verpasster Schritt,
   abgebrochenes Gespräch. Aufgezeichnet werden die Stände, die dabei entstehen; geprüft werden sie wie jede andere Folge.
   Abgedeckt sind die Stellen, die die Analyse als Hinweisfehler abseits der Musterlösung beschrieben hat:
     K1-B05  Nina behält den Zettel nach einem abgebrochenen Gespräch (Thema schloss, „Briefkasten“ öffnete wieder und riet zum Spachtel)
     K2-B05  „Zwei Siebenen“ ohne Malas Spüren an Tomaž (der Hinweis schickte zu Nedžads Auftragsbuch, Nedžad hat keinen Einstieg)
     K2-B07  das Wärmefach ist leer, die Nachricht liegt ungelesen im Gepäck (älterer Spielstand; der Hinweis riet wieder zum Wärmefach)
     K5-B02  beide Sätze gesagt, „Zwei Hälften“ fehlt (der Hinweis riet zum Vorschlag, den das Spiel ablehnt) */
const { open } = require('../vmdriver');
const FX = require('../regress/fixtures/lib');

async function build(html) {
  const D = await open({ seed: 21, html });
  const seqs = [];
  const snap = async (label) => ({ label, GS: await D.ev(() => JSON.parse(JSON.stringify(M.GS))) });
  const drain = async () => { try { await D.drain(); } catch (e) { /* weiter */ } };
  const choose = async (re) => { const s = await D.st(); if (!s.dlg) return false; const i = await D.ev((src) => { const r = new RegExp(src); return M.E.dlg ? M.E.dlg.opts.findIndex((o) => r.test(o.t)) : -1; }, re.source); if (i < 0) return false; await D.ev((k) => M.E.chooseDone(k), i); await drain(); return true; };

  // K1-B05: Gespräch mit Nina nach dem Zettel abbrechen
  {
    await FX.load(D, 'k1_47_vor_nina.json', { pos: 'shop' }); await drain();
    const st = [await snap('K1-B05 vor dem Gespräch mit Nina')];
    await D.act('talk', 'nina'); await choose(/Ich war in der Ledana/); await choose(/Ninas Zettel zeigen/);
    for (let i = 0; i < 6; i++) { const s = await D.st(); if (!s.dlg) break; if (!(await choose(/Bis später|Auf Wiedersehen|Danke|Tschüss|\(Gehen\.\)|Doviđenja/))) { await D.ev(() => { const d = M.E.dlg; if (!d) return; const k = d.opts.findIndex((o) => o.bye); M.E.chooseDone(k >= 0 ? k : d.opts.length - 1); }); await drain(); } }
    st.push(await snap('K1-B05 Gespräch nach dem Zettel abgebrochen (Nina behält ihn)'));
    seqs.push({ src: 'variante:K1-B05', states: st });
  }
  // K2-B05: Zwei Siebenen, aber Mala hat Tomaž nicht gespürt
  {
    await FX.load(D, 'k2_14_zwei_siebenen.json', { delNotes: ['s1_bracelet'] }); await drain();
    seqs.push({ src: 'variante:K2-B05', states: [await snap('K2-B05 Zwei Siebenen ohne das Armband')] });
  }
  // K2-B07 (f4): Wärmefach aufgebrochen, Nachricht ungelesen im Gepäck (Spielstand von vor P01)
  {
    await FX.load(D, 'k2_58_finale.json', { pos: 'kuca', addInv: ['rcm', 'key_kuca', 'chisel'], addNotes: ['f2_postcard', 'f2_oven'], delNotes: ['f2_rcm'], setFlags: { 'k2.f2.kuca': true }, rooms: { kuca: { msgTaken: true } } }); await drain();
    seqs.push({ src: 'variante:K2-B07', states: [await snap('K2-B07 Wärmefach leer, Nachricht ungelesen')] });
  }
  // K5-B02: beide Sätze gesagt, ohne „Zwei Hälften“
  {
    await FX.load(D, 'k5_038_zwei_namen.json', { delFlags: ['k5.s.agreed'], delNotes: ['s5_teile'] }); await drain();
    seqs.push({ src: 'variante:K5-B02', states: [await snap('K5-B02 beide Sätze gesagt, „Zwei Hälften“ fehlt')] });
  }
  await D.close2();
  return seqs;
}
module.exports = { build };
