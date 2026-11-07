// BUG-004: Spielzeit-Stempel S.steam (Prolog-Kaffee) blieb im Spielstand. Nach Laden in einem frischen Kontext beginnt die Spielzeit bei 0,
// der alte Dampf galt als frisch: der verklebte Brief öffnete sich am kalten Herd (Rätsel übersprungen).
const { open } = require('../vmdriver'); const C = require('../lib/common'); const { menuTap } = require('../lib/session');
module.exports = { id: 'BUG-004', title: 'Laden in frischem Kontext macht alten Dampf nicht wieder wirksam', async run(html) {
  const D = await open({ seed: 9, html }); await D.ev(() => { M.__speechLog = []; }); await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
  let storage = null;
  await C.runPath('walkthrough', D, {}, null, { afterStep: async (l) => { if (storage || !/^Brief klebt/.test(l)) return; const sv = await menuTap(D, 1); if (!/Gespeichert/.test(sv.msg || '')) throw new Error('Speichern abgelehnt: ' + sv.msg); storage = D.exportStorage(); throw Object.assign(new Error('fertig'), { kind: 'qa-stop' }); } });
  if (!storage) return { ok: false, detail: 'Stelle nicht erreicht' };
  const D2 = await open({ seed: 10, html, storage }); await D2.ev(() => { M.__speechLog = []; }); await C.tapTitle(D2, 'Fortsetzen'); await C.tapTitle(D2, 'Platz 1'); await D2.drain();
  const room = await D2.ev(() => M.E.room.id); if (room !== 'flat') { if (room !== 'map') { const ex = await D2.ev(() => { const R = M.E.room; const h = R.hotspots.find(h => h.exit && (typeof h.exit === 'object') && h.exit.to === 'map'); return h && h.id; }); if (ex) { await D2.exit(ex); } } await D2.travel('flat'); await D2.drain(); }
  await D2.act('use', 'stove', 'letter_t'); await D2.drain();
  const r = await D2.ev(() => ({ open: !!M.GS.flags['c1.letterOpen'], said: (M.__speechLog || []).slice(-1)[0], room: M.E.room.id }));
  return { ok: !r.open && r.room === 'flat', detail: 'nach Laden (frischer Kontext) Brief am Herd ohne Dampf: geöffnet=' + r.open + ' („' + (r.said ? r.said[1] : '') + '“)' };
} };
