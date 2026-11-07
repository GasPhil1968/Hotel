// BUG-009 (Softlock): Als Mala auf einen Geisterausgang tippen (K1: Archivtür im Hafenbüro) und, während sie hingeht, auf das Porträt tippen →
// der Übergang nimmt die jetzt aktive Figur mit: Marko steht im Archiv, das nur Mala betreten kann und das für ihn keinen Ausgang hat.
// Eingaben ausschließlich über Zeigerereignisse auf Bildschirmpunkte (Hotspot, Wechselknopf), wie ein Finger.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-009', title: 'Figurenwechsel auf dem Weg zu einem Geisterausgang bringt Marko nicht in einen Mala-Raum (Softlock)', async run(html) {
  const rows = [];
  for (const k of [0, 3, 8]) { const D = await open({ seed: 7, html }); await D.ev(() => { window.__QA_CHAINED = true; }); await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
    let res = null;
    await C.runPath('walkthrough', D, {}, null, { afterStep: async (l) => { if (res || !/1948 gefunden/.test(l)) return; await D.settle();
      const tap = (q) => D.ev((p) => { M.pointerDown(p.x, p.y, true); M.pointerUp(p.x, p.y, true); }, q);
      const sw = () => D.ev(() => { M.renderFrame(); for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 2) if (M.uiHit(x, y) === 'sw') return { x, y }; return null; });
      await tap(await sw()); await D.page.waitForTimeout(600); await D.settle();   // zu Mala wechseln (Porträt)
      const p = await D.ev((id) => { const E = M.E, h = E.room.byId[id], r = E.hsRect(h), cam = Math.round(E.camX); for (let y = r[1]; y < r[1] + r[3]; y++) for (let x = r[0]; x < r[0] + r[2]; x++) if (E.hotspotAt(x, y) === h) return { x: x - cam, y }; return null; }, 'archive_door');
      const a0 = await D.ev(() => M.GS.active);
      await tap(p); await D.page.waitForTimeout(16 * k); await tap(await sw()); await D.page.waitForTimeout(3000); await D.settle(60000).catch(() => {});
      res = await D.ev(() => ({ room: M.E.room.id, active: M.GS.active, marko: M.GS.pos.marko.room, mala: M.GS.pos.mala.room, markoExits: M.E.room.hotspots.filter(h => h.exit).length }));
      res.a0 = a0; throw Object.assign(new Error('stop'), { kind: 'qa-stop' }); } }).catch(() => {});
    rows.push(Object.assign({ k }, res)); }
  const ok = rows.length === 3 && rows.every(r => r && r.a0 === 'mala' && r.marko === 'office');
  return { ok, detail: rows.map(r => 'k=' + r.k + ' Bilder: Marko in ' + (r && r.marko) + ', Mala in ' + (r && r.mala) + (r && r.marko === 'archive' ? ' (Ausgänge für Marko: ' + r.markoExits + ')' : '')).join('; ') };
} };
