// K5-B04 (ANALYSE_GILBERT.md): Brauerei zuerst, dann Nedžad „Nadas Tafel …“ → nach dem Abendwechsel bleibt Nedžads Menü offen.
// Aufruf: DUMPS=<ordner> node qa/analyse/k5_menue.js   (braucht <ordner>/k5/014.json aus walkthrough5.js mit MALA_DUMPALL)
const path = require('path');
const { open } = require(path.join(__dirname, '..', '..', 'game', 'tools', 'driver.js'));
const DUMPS = process.env.DUMPS || process.argv[2]; if (!DUMPS) { console.log('Aufruf: DUMPS=<ordner> node '+path.basename(__filename)); process.exit(2); }
(async () => {
  const D = await open({ turbo: 10 });
  const dump = require(path.resolve(DUMPS, 'k5', '014.json'));
  const r0 = await D.ev((dump) => {
    const base = M.freshGame(); Object.keys(base).forEach(k => { if (dump.GS[k] !== undefined) base[k] = dump.GS[k]; });
    const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
    if (G.notes.indexOf('b5_reihe') < 0) G.notes.push('b5_reihe');
    const st = (M.ROOMS.kazandziluk5.entries && M.ROOMS.kazandziluk5.entries.map) || M.ROOMS.kazandziluk5.start || [160, 120, 'R'];
    G.pos.marko = { room: 'kazandziluk5', x: st[0], y: st[1], f: st[2] || 'R' }; G.pos.mala = { room: 'kazandziluk5', x: st[0] - 14, y: st[1] - 2, f: 'R' }; G.active = 'marko';
    localStorage.setItem('mala.repro', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() }));
    const ok = M.E.loadKey('mala.repro'); return { ok, phase: M.GS.phase, room: M.API.room.id };
  }, dump);
  console.log('vorher:', JSON.stringify(r0));
  await D.settle();
  await D.ev(() => M.TA.act('talk', 'nedzad')); await D.choose('Nadas Tafel');
  // jetzt alles ablaufen lassen, Dokumente/Erinnerungen schließen, bis eine Auswahl offen ist oder Ruhe herrscht
  let s; for (let i = 0; i < 40; i++) { s = await D.settle(120000); if (s.overlay && !s.dlg) { await D.ev(() => M.TA.closeOverlay()); continue; } break; }
  const r1 = await D.ev(() => ({ phase: M.GS.phase, room: M.API.room && M.API.room.id, dlg: M.E.dlg ? M.E.dlg.opts.map(o => o.t) : null, conv: M.E.conv && M.E.conv.npc }));
  console.log('nachher:', JSON.stringify(r1));
  console.log('JS-Fehler:', D.errors.length ? D.errors.join(' | ').slice(0, 400) : 'keine');
  await D.close2();
})().catch(e => { console.error('ABBRUCH', e.message.slice(0, 600)); process.exit(1); });
