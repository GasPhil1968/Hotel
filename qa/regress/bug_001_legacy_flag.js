// BUG-001: Laden eines Spielstands aus Kapitel 2–4 setzt die Kapitel-1-Altstandsmarke split.intro.legacy (M.migrateSave).
const { open } = require('../vmdriver'); const C = require('../lib/common'); const { menuTap } = require('../lib/session');
module.exports = { id: 'BUG-001', title: 'Laden eines K2–K4-Stands verändert keine Kapitel-1-Marken', async run(html) {
  const bad = [];
  for (const ch of [2, 3, 4]) {
    const D = await open({ seed: 100 + ch, html }); await C.tapTitle(D, ['', '', 'Kapitel 2: Sarajevo', 'Kapitel 3: Mostar', 'Kapitel 4: München'][ch]); await C.tapTitle(D, 'Platz 1');
    for (let i = 0; i < 80; i++) { const s = await D.drain(); if (s.dlg) { await D.ev(() => M.E.chooseDone(0)); continue; } if (s.screen === 'game' && !s.busy && !s.overlay && s.room) break; await D.page.waitForTimeout(300); }
    const sv = await menuTap(D, 1); const before = await D.ev(() => Object.keys(M.GS.flags).filter(k => /^split\./.test(k)));
    const D2 = await open({ seed: 200 + ch, html, storage: D.exportStorage() }); await C.tapTitle(D2, 'Fortsetzen'); await C.tapTitle(D2, 'Platz 1'); await D2.settle();
    const after = await D2.ev(() => ({ ph: M.GS.phase, f: Object.keys(M.GS.flags).filter(k => /^split\./.test(k)) }));
    if (!/Gespeichert/.test(sv.msg || '')) bad.push('K' + ch + ': Speichern abgelehnt (' + sv.msg + ')');
    else if (JSON.stringify(before) !== JSON.stringify(after.f)) bad.push('K' + ch + ' (' + after.ph + '): vor dem Laden ' + JSON.stringify(before) + ', danach ' + JSON.stringify(after.f));
  }
  // Gegenprobe: ein echter Altstand aus Kapitel 1 (ohne split.intro.v) wird weiterhin als alt markiert
  const D3 = await open({ seed: 7, html }); const old = await D3.ev(() => { const g = M.freshGame(); g.phase = 'c1'; g.flags = { 'mk.test': true }; g.pos.marko = { room: 'flat', x: 160, y: 120, f: 'R' }; M.migrateAll(g); return g.flags; });
  if (!old['split.intro.legacy'] || !old['split.intro.met']) bad.push('Gegenprobe K1-Altstand: Marke fehlt ' + JSON.stringify(old));
  return { ok: !bad.length, detail: bad.join(' | ') };
} };
