// Spielstände bleiben gültig: alle regulär erspielten Stände aus qa/results/browser/states.json (mit früheren Fassungen gespeichert)
// im aktuellen Stand laden – mit dem Finger auf einem iPhone (Telefon-Layout, Aktionsleiste) und mit der Maus am Desktop – und mit dem
// gespeicherten Inhalt vergleichen: Kapitelphase, aktive Figur, Raum, Inventar, Notizen, Merker. Danach einmal speichern und neu laden.
//   node qa/ui/savecompat.js        (Exitcode 1 bei Fehlern)
'use strict';
const { pw, checker, open, settle, STATES } = require('./lib');
const DEVS = [['iPhone 16 quer, Finger', { viewport: { width: 734, height: 343 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true }], ['Desktop, Maus', { viewport: { width: 1280, height: 800 } }]];
(async () => {
  const T = checker('Spielstände'); const b = await pw.chromium.launch(); const errs = [];
  try {
    for (const [dn, dev] of DEVS) { T.section(dn);
      for (const st of STATES) {
        const p = await open(b, st.name, dev);
        const want = JSON.parse(st.storage['mala.save.' + (st.storage['mala.slot'] || '1')] || st.storage['mala.save.1']), G = want.GS || want;
        const got = await p.evaluate(async () => { M.TURBO = 20; const ok = M.E.loadGame(+(localStorage.getItem('mala.slot') || 1)); for (let i = 0; i < 300 && (M.E.screen !== 'game' || M.E.transitioning); i++) await new Promise(r => setTimeout(r, 20)); M.TURBO = 1;
          const g = M.GS; return { ok: ok !== false, scr: M.E.screen, phase: g.phase, active: g.active, room: g.pos[g.active].room, inv: g.inv.slice(), notes: g.notes.slice(), flags: Object.keys(g.flags).length, wide: M.isWide() }; });
        const same = got.ok && got.scr === 'game' && got.phase === G.phase && got.active === G.active && got.room === G.pos[G.active].room && JSON.stringify(got.inv) === JSON.stringify(G.inv) && JSON.stringify(got.notes) === JSON.stringify(G.notes) && got.flags === Object.keys(G.flags).length;
        // speichern und wieder laden: gleicher Inhalt
        const rt = same ? await p.evaluate(async () => { await new Promise(r => setTimeout(r, 400)); const g0 = JSON.stringify({ i: M.GS.inv, n: M.GS.notes, p: M.GS.phase }); M.saveGame(); M.TURBO = 20; M.E.loadGame(M.E.slot()); for (let i = 0; i < 300 && (M.E.screen !== 'game' || M.E.transitioning); i++) await new Promise(r => setTimeout(r, 20)); M.TURBO = 1; return g0 === JSON.stringify({ i: M.GS.inv, n: M.GS.notes, p: M.GS.phase }); }) : false;
        T.ck(same && rt, st.name + ' (' + G.phase + ', ' + G.pos[G.active].room + '): geladen, Inhalt gleich, Speichern/Laden ohne Abweichung' + (same ? '' : ' – ' + JSON.stringify({ got: { phase: got.phase, room: got.room, inv: got.inv.length, notes: got.notes.length }, want: { phase: G.phase, room: G.pos[G.active].room, inv: G.inv.length, notes: G.notes.length } })));
        errs.push(...p.errs); await p.context().close(); } }
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
