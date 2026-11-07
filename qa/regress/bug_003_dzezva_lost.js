// BUG-003: Wasser aufsetzen, Dampf verfallen lassen → Džezva verschwand (weder Regal noch Inventar), Herdweg dauerhaft zu, Hinweise verweisen weiter darauf.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-003', title: 'Verkochtes Wasser: Džezva bleibt verfügbar, Brief über Dampf weiter lösbar', async run(html) {
  const D = await open({ seed: 9, html }); await D.ev(() => { M.__speechLog = []; }); await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
  let res = null;
  await C.runPath('walkthrough', D, {}, null, { afterStep: async (l) => { if (res || !/^Brief klebt/.test(l)) return;
    await D.exit('exit'); await D.drain(); await D.travel('flat'); await D.drain();
    await D.act('take', 'dzezva'); await D.act('use', 'sink', 'dzezva'); await D.act('use', 'stove', 'dzezvaW'); await D.drain();
    await D.page.waitForTimeout(2600);   // > 45 s Spielzeit vergehen
    await D.act('use', 'stove', 'letter_t'); await D.drain();
    const a = await D.ev(() => ({ open: !!M.GS.flags['c1.letterOpen'], dzVisible: (() => { const h = M.E.room.byId.dzezva; return !h.vis || h.vis(M.RS('flat'), M.GS); })(), inv: M.GS.inv.slice() }));
    let again = false; if (a.dzVisible) { await D.act('take', 'dzezva'); await D.act('use', 'sink', 'dzezva'); await D.act('use', 'stove', 'dzezvaW'); await D.drain(); await D.act('use', 'stove', 'letter_t'); await D.drain(); again = !!(await D.flag('c1.letterOpen')); }
    res = { a, again }; throw Object.assign(new Error('fertig'), { kind: 'qa-stop' }); } });
  if (!res) return { ok: false, detail: 'Stelle nicht erreicht' };
  return { ok: !res.a.open && res.a.dzVisible && res.again, detail: 'nach Verfall: Brief offen=' + res.a.open + ', Džezva sichtbar=' + res.a.dzVisible + ', zweiter Versuch öffnet den Brief=' + res.again };
} };
