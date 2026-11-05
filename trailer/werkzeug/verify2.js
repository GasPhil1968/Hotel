// Zweite Prüfung: (a) automatisches Speichern beim Ortswechsel (echter Spielstand aus dem Durchlauf), (b) Datei-Fassung startet ohne Netz,
// (c) „Zeigen“ blendet die anklickbaren Stellen ein. Aufruf: node verify2.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const T = __dirname, HTML = path.join(T, 'game', 'index.html'); const out = {};
(async () => {
  const b = await chromium.launch();
  { const ctx = await b.newContext(); const p = await ctx.newPage(); await p.goto('file://' + HTML); await p.waitForTimeout(700);
    const d = JSON.parse(fs.readFileSync(path.join(T, 'd1', '18.json'), 'utf8'));
    out.autosave = await p.evaluate(async (g) => { localStorage.clear(); M.PRESETS = { __t: { GS: g } }; M.E.loadPreset('__t', 2); const w = ms => new Promise(r => setTimeout(r, ms));
      const idle = async () => { for (let i = 0; i < 200; i++) { const s = M.TA.status(); if (s.speech || s.card) M.TA.skip(); if (!s.busy && !s.speech && !s.card && !s.acting && !s.walk && s.screen === 'game') return; await w(100); } };
      await idle(); const before = JSON.parse(localStorage.getItem('mala.save.2')); const r0 = before.GS.pos[before.GS.active].room;
      M.TA.exit('office_door'); await w(600); await idle(); const after = JSON.parse(localStorage.getItem('mala.save.2'));
      return { slot: 2, vorher: r0, nachher: after.GS.pos[after.GS.active].room, jetzt: M.E.room.id, gespeichertUm: after.at > before.at }; }, d.GS);
    await ctx.close(); }
  { const ctx = await b.newContext(); await ctx.setOffline(true); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + HTML); await p.waitForTimeout(900); out.file_offline = await p.evaluate(() => ({ M: !!window.M, screen: M.E.screen, title: M.titleLabels ? M.titleLabels() : null })); out.file_offline.errors = errs; await ctx.close(); }
  { const ctx = await b.newContext(); const p = await ctx.newPage(); await p.goto('file://' + HTML); await p.waitForTimeout(700);
    const d = JSON.parse(fs.readFileSync(path.join(T, 'd2', '08.json'), 'utf8'));
    out.reveal = await p.evaluate(async (g) => { localStorage.clear(); M.PRESETS = { __t: { GS: g } }; M.E.loadPreset('__t', 1); await new Promise(r => setTimeout(r, 800));
      let pt = null; for (let y = 140; y < 160 && !pt; y++) for (let x = 0; x < 320 && !pt; x += 2) if (M.uiHit(x, y) === 'reveal') pt = [x, y];
      M.pointerDown(pt[0] + 6, pt[1] + 4, false); M.pointerUp(pt[0] + 6, pt[1] + 4, false); await new Promise(r => setTimeout(r, 400)); return { knopf: pt, aktiv: !!(M.E.reveal || M.E.revealOn || M.E.showAll) }; }, d.GS);
    await p.evaluate(() => {}); const shot = await p.evaluate(() => document.getElementById('game').toDataURL('image/png')); fs.writeFileSync(path.join(T, 'ex', 'reveal.png'), Buffer.from(shot.split(',')[1], 'base64'));
    await ctx.close(); }
  await b.close(); console.log(JSON.stringify(out, null, 1));
})();
