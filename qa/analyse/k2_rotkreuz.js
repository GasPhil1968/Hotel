// K2-B01 (ANALYSE_GILBERT.md): ungelesene Rotkreuz-Nachricht im Finale an Nada geben → Kapitel nicht mehr abschließbar.
// Aufruf: DUMPS=<ordner> node qa/analyse/k2_rotkreuz.js   (braucht <ordner>/k2/62.json aus walkthrough2.js mit MALA_DUMPALL)
const path = require('path');
const { open } = require(path.join(__dirname, '..', '..', 'game', 'tools', 'driver.js'));
const DUMPS = process.env.DUMPS || process.argv[2]; if (!DUMPS) { console.log('Aufruf: DUMPS=<ordner> node '+path.basename(__filename)); process.exit(2); }
(async () => {
  const D = await open({ turbo: 10 });
  const dump = require(path.resolve(DUMPS, 'k2', '62.json'));
  const r0 = await D.ev((dump) => {
    const base = M.freshGame(); Object.keys(base).forEach(k => { if (dump.GS[k] !== undefined) base[k] = dump.GS[k]; });
    const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
    G.notes = G.notes.filter(n => ['f2_rcm', 'f2_cameback', 'f2_whyabreise'].indexOf(n) < 0);
    ['k2.f2.rcmRead', 'deduced.f2_cameback', 'deduced.f2_whyabreise'].forEach(k => delete G.flags[k]);
    const st = M.ROOMS.stan.start || [160, 120, 'R'];
    G.pos.marko = { room: 'stan', x: st[0], y: st[1], f: st[2] || 'R' }; G.pos.mala = { room: 'stan', x: st[0] - 14, y: st[1] - 2, f: 'R' }; G.active = 'marko';
    localStorage.setItem('mala.repro', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() }));
    const ok = M.E.loadKey('mala.repro');
    return { ok, phase: M.GS.phase, room: M.API.room.id, inv: M.GS.inv.slice(), rcmNote: M.GS.notes.indexOf('f2_rcm') >= 0, nadaVisible: !!M.API.room.hotspots.find(h => h.id === 'nada' && (!h.vis || h.vis(M.API.S, M.GS))) };
  }, dump);
  console.log('vorher:', JSON.stringify(r0));
  await D.settle();
  await D.ev(() => M.TA.act('use', 'nada', 'rcm')); await D.drain();
  const dl = await D.st(); console.log('offene Auswahl nach der Übergabe:', dl.dlg ? JSON.stringify(dl.dlg) : 'keine');
  if (dl.dlg) { await D.choose('Brücke'); await D.drain(); }
  const s2 = await D.ev(() => ({ epiNada: !!M.GS.flags['k2.epi.nada'], nightFlag: !!M.GS.flags['k2.f2.night'], phase: M.GS.phase }));
  console.log('nach der Auswahl:', JSON.stringify(s2));
  // Malas Gesprächsangebot prüfen: gibt es „Fahren wir. Mit der Drei.“?
  await D.ev(() => M.TA.act('talk', '_mala')); await D.until(s => s.dlg, 15000, 'Malas Menü').catch(() => {});
  const mm = await D.st(); console.log('Malas Menü:', mm.dlg ? JSON.stringify(mm.dlg) : 'keins');
  const r1 = await D.ev(() => ({ inv: M.GS.inv.slice(), rcmItem: M.GS.inv.indexOf('rcm') >= 0, rcmNote: M.GS.notes.indexOf('f2_rcm') >= 0, cameback: M.GS.notes.indexOf('f2_cameback') >= 0, epiNada: !!M.GS.flags['k2.epi.nada'], phase: M.GS.phase,
    hints: M.hintsOpen(M.GS).map(h => h.id + ': ' + [0, 1, 2, 3].map(i => M.hintText(h, i, M.GS, 'marko')).join(' | ')),
    malaOffer: typeof M.k2FinNightOffer, ovenEmpty: !!(M.GS.rooms.kuca && M.GS.rooms.kuca.msgTaken) }));
  console.log('nachher:', JSON.stringify(r1, null, 1));
  // Gibt es noch einen Weg zu f2_rcm? Alle Stellen, die die Notiz vergeben, brauchen den Gegenstand (M.k2ReadRCM); Verbindung testen:
  const c = await D.ev(() => M.TA.combine('f2_postcard', 'm2_split_register'));
  console.log('Notizbuch-Versuch Postkarte+Register:', JSON.stringify(c));
  console.log('JS-Fehler:', D.errors.length ? D.errors.join(' | ') : 'keine');
  await D.close2();
})().catch(e => { console.error('ABBRUCH', e.message); process.exit(1); });
