// BUG-002: Wechsel der Figur, während sie zu einem Hotspot geht, und der Wechsel lädt einen anderen Raum → approach() bleibt ewig offen, E.acting hängt.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-002', title: 'Figurenwechsel während eines Wegs lässt keine Aktion hängen (E.acting)', async run(html) {
  const D = await open({ seed: 5, html }); await C.tapTitle(D, 'Kapitel 4: München'); await C.tapTitle(D, 'Platz 1');
  let res = null;
  const r = await C.runPath('walkthrough4', D, {}, null, { afterStep: async (l) => { if (res || !/Mala fährt allein zum Hauptbahnhof/.test(l)) return;
    const info = await D.ev(() => { const R = M.E.room, p = M.ACT.mala; let best = null, bd = -1; R.hotspots.forEach(h => { const st = M.E.hsStand(h); if (!st || h.exit) return; const d = Math.abs(st[0] - p.x); if (d > bd) { bd = d; best = h.id; } }); return { room: R.id, active: M.GS.active, mk: M.GS.pos.marko.room, hs: best }; });
    await D.ev((h) => M.TA.act('look', h), info.hs); await D.page.waitForTimeout(16); await D.ev(() => { M.TA.switchTo('marko'); }); await D.page.waitForTimeout(8000);
    const st = await D.ev(() => ({ acting: M.E.acting, room: M.E.room.id, active: M.GS.active }));
    // danach muss das Kapitel regulär weitergehen
    res = { info, st }; } });
  if (!res) return { ok: false, detail: 'Stelle nicht erreicht: ' + r.err };
  const ok = res.st.acting === 0 && res.st.active === 'marko' && res.info.room !== res.st.room;
  return { ok: ok && r.ok, detail: 'Mala in ' + res.info.room + ' geht zu „' + res.info.hs + '“, Wechsel zu Marko (' + res.st.room + '): E.acting=' + res.st.acting + '; Kapitel danach ' + (r.ok ? 'bis zum Ende gespielt' : 'abgebrochen: ' + r.err) };
} };
