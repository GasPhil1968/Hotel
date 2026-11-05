// Prüfung: automatisches Speichern beim Ortswechsel über einen normalen Ausgang (Hafenbüro → Riva), Spielstand aus dem Durchlauf.
// Aufruf: node verify3.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const T = __dirname, HTML = path.join(T, 'game', 'index.html');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(); const p = await ctx.newPage(); await p.goto('file://' + HTML); await p.waitForTimeout(700);
  const d = JSON.parse(fs.readFileSync(path.join(T, 'd1', '19.json'), 'utf8'));
  const out = await p.evaluate(async (g) => { localStorage.clear(); M.PRESETS = { __t: { GS: g } }; M.E.loadPreset('__t', 2); const w = ms => new Promise(r => setTimeout(r, ms));
    const idle = async () => { for (let i = 0; i < 300; i++) { const s = M.TA.status(); if (s.speech || s.card) M.TA.skip(); if (!s.busy && !s.speech && !s.card && !s.acting && !s.walk && s.screen === 'game' && !s.dlg) return true; if (s.dlg) { try { M.TA.choose(s.dlg[s.dlg.length - 1]); } catch (e) {} } await w(100); } return false; };
    await idle(); const raw0 = localStorage.getItem('mala.save.2'); const before = raw0 ? JSON.parse(raw0) : null; const r0 = M.E.room.id;
    await w(1100); const byId = (M.E.room && M.E.room.byId) || {}; const exits = Object.keys(byId).filter(k => byId[k].exit && byId[k].exit.to !== 'map'); if (!exits.length) return { fehler: 'kein einfacher Ausgang', raum: r0, alle: Object.keys(byId) }; const ex = exits[0]; M.TA.exit(ex); let moved = false; for (let i = 0; i < 200; i++) { if (M.E.room.id !== r0) { moved = true; break; } await w(100); }
    await idle(); await w(400); const after = JSON.parse(localStorage.getItem('mala.save.2'));
    return { slot: 2, ausgang: ex, raum_vorher: r0, gespeichert_vorher: before ? before.GS.pos[before.GS.active].room : null, raum_jetzt: M.E.room.id, gewechselt: moved,
      gespeichert_nachher: after.GS.pos[after.GS.active].room, neuer_zeitstempel: !!before && after.at > before.at, andere_plaetze: [1, 3].map(n => !!localStorage.getItem('mala.save.' + n)) }; }, d.GS);
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
