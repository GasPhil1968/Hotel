// BUG-006: Kapitel 2, Finale: Der Schluss f2_whyabreise („Darum steht bei Abreise nichts“) war über die Oberfläche nicht ziehbar –
// m2_split_register galt seit m2_lana (Fall 3) als erledigt, f2_rcm seit f2_cameback; beide fehlten in Notizliste und Auswahl.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-006', title: 'K2-Finale: „Darum steht bei Abreise nichts“ ist mit sichtbaren Notizen ziehbar', async run(html) {
  const D = await open({ seed: 2, html }); await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; }); await C.tapTitle(D, 'Kapitel 2: Sarajevo'); await C.tapTitle(D, 'Platz 1');
  let res = null; const c0 = D.combine;
  D.combine = async (a, b) => { if (!res && a === 'f2_cameback' && b === 'm2_split_register') { res = await D.ev(() => { const L = M.E.nbOpen(false); const ok1 = L.indexOf('f2_cameback') >= 0 && L.indexOf('m2_split_register') >= 0; const ok2 = L.indexOf('f2_rcm') >= 0 && L.indexOf('m2_split_journal') >= 0; return { ok1, ok2, list: L }; }); } return c0(a, b); };
  const r = await C.runPath('walkthrough2', D, {});
  if (!res) return { ok: false, detail: 'Stelle nicht erreicht: ' + r.err };
  const after = await D.ev(() => ({ reg: M.NOTES.m2_split_register && (function () { return M.E.nbOpen(false).indexOf('m2_split_register') >= 0; })() }));
  return { ok: (res.ok1 || res.ok2) && r.ok, detail: 'im Finale sichtbar: Weg 1 (cameback+register)=' + res.ok1 + ', Weg 2 (rcm+journal)=' + res.ok2 + '; Kapitel ' + (r.ok ? 'bis zum Ende gespielt' : 'abgebrochen: ' + r.err) };
} };
