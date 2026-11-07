// BUG-005: Rückkehr aus dem Lager mit den Briefen – „Emina. Zurück von Tante Sabira.“, aber Emina wird nicht erzeugt (Figurenliste vor der Szene gebaut).
// Für den Spieler ist sie unsichtbar und nicht antippbar, bis er den Raum verlässt und wieder betritt.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-005', title: 'Emina ist nach ihrer angekündigten Rückkehr sichtbar und antippbar', async run(html) {
  const D = await open({ seed: 4, html }); await D.ev(() => { M.__speechLog = []; window.__QA_CHAINED = true; }); await C.tapTitle(D, 'Kapitel 2: Sarajevo'); await C.tapTitle(D, 'Platz 1');
  let res = null; const ex0 = D.exit;
  D.exit = async (id) => { const r0 = await D.ev(() => M.E.room && M.E.room.id); const out = await ex0(id);
    if (!res && r0 === 'ostava') { const s = await D.ev(() => { const E = M.E, h = E.room.byId.emina, a = M.ACT.emina; let pt = null; const r = h && E.hsRect(h); if (r) for (let y = r[1]; y < r[1] + r[3] && !pt; y += 2) for (let x = r[0]; x < r[0] + r[2]; x += 2) if (E.hotspotAt(x, y) === h) { pt = [x, y]; break; }
        return { room: E.room.id, back: !!M.GS.flags['k2.s1.eminaBack'], actor: !!a, visible: !!(a && a.visible), tappable: !!pt, said: (M.__speechLog || []).slice(-3).map(x => x[1]) }; }); if (s.back) res = s; }
    return out; };
  const r = await C.runPath('walkthrough2', D, {});
  if (!res) return { ok: false, detail: 'Rückkehr aus dem Lager nicht erreicht: ' + r.err };
  return { ok: res.actor && res.visible && res.tappable, detail: 'nach „' + (res.said.find(t => /Emina/.test(t)) || '') + '“: Figur=' + res.actor + ', sichtbar=' + res.visible + ', antippbar=' + res.tappable };
} };
