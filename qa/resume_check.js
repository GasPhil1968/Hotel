// Stichprobenprüfung für „Fortschritt möglich“-Läufe: Lauf deterministisch wiederholen (Run-ID + Salz), vom erreichten Zustand aus die
// aufgezeichnete Lösungsfolge des Kapitels (Kanon) AB DER ABBRUCHSTELLE der Reihe nach nachspielen – wie ein Spieler mit Lösungsheft:
// zum Raum gehen (über Ausgänge/Stadtplan), Figur nur wechseln, wenn der Wechselknopf es erlaubt, Hotspot/Ausgang benutzen,
// Dialogzeilen und Notizen in der aufgezeichneten Reihenfolge wählen, Notizen verbinden, Rätsel über die sichtbaren Bedienelemente lösen.
// Schritte, die im abweichenden Zustand nicht gehen, werden übersprungen. Erfolg = Phasen- oder Kapitelwechsel.
//   node qa/resume_check.js <Salz> <Run-ID> [<Run-ID> …]   → qa/results/<Salz>/resume_check.jsonl (anhängend)
'use strict';
const fs = require('fs'), path = require('path');
const sim = require('./sim'); const X = require('./lib/explore');
const canon = require('./results/canon/canon.json');
const [salt, ...ids] = process.argv.slice(2);
const OUT = path.join(__dirname, 'results', salt, 'resume_check.jsonl');
const SNAP = function () { const G = M.GS; return { phase: G.phase, ended: !!G.ended, screen: M.E.screen, room: M.E.room && M.E.room.id, active: G.active }; };

async function drain(I, list, iRef, rnd, rec) {
  for (let g = 0; g < 60; g++) {
    const s = await I.settle(60000).catch(() => null); if (!s) return;
    if (s.dlg) { const o = await I.ev(() => M.E.dlg.opts.map(x => x.t)); let k = -1;
      for (let j = iRef.i; j < Math.min(list.length, iRef.i + 10) && k < 0; j++) if (list[j].kind === 'choose') { const q = o.indexOf(list[j].t); if (q >= 0) { k = q; iRef.i = j + 1; } }
      if (k < 0) k = o.findIndex(t => /^\((Gehen|Schweigen)|^(Danke|Auf Wiedersehen|Bis |Tschüss|Servus|Später|Ich gehe|Gute)/.test(t)); if (k < 0) k = o.length - 1;
      rec.push(['choose', o[k]]); await I.ev((x) => M.E.chooseDone(x), k); await I.page.waitForTimeout(60); continue; }
    if (s.overlay) { const kind = s.overlay;
      if (kind === 'notebook') { const L = await I.ev(() => { const d = M.E.overlay.data || {}; return d.mode === 'ask' ? (M.E.nbAll ? M.E.nbAll(true, d.also) : M.E.nbOpen(true, d.also)) : []; }); let id = null;
        for (let j = iRef.i; j < Math.min(list.length, iRef.i + 10) && !id; j++) if (list[j].kind === 'note' && L.indexOf(list[j].id) >= 0) { id = list[j].id; iRef.i = j + 1; }
        if (id) { rec.push(['note', id]); await I.ev((x) => M.TA.pickNote(x), id).catch(() => {}); } else { rec.push(['close', kind]); await I.ev(() => M.TA.closeOverlay(null)); } }
      else if (kind === 'puzzle') await X.solvePuzzleUI(I, rnd, rec);
      else if (kind === 'arrange') await X.solveArrangeUI(I, rnd, rec);
      else if (kind === 'map') { rec.push(['close', 'map']); await I.ev(() => (M.closeMap ? M.closeMap() : M.TA.closeOverlay(null))); }
      else { rec.push(['close', kind]); await I.ev(() => M.TA.closeOverlay(null)); }
      await I.page.waitForTimeout(60); continue; }
    return;
  }
}

async function resume(I, ch, fromStep, rec) {
  const rnd = require('./vmdriver').mulberry32(7);
  const list = (canon[ch] || []).filter(c => c.step >= fromStep - 2);
  const s0 = await I.ev(SNAP); const iRef = { i: 0 }; let tried = 0, skipped = 0;
  while (iRef.i < list.length) {
    const e = list[iRef.i++]; const now = await I.ev(SNAP);
    if (now.phase !== s0.phase || now.ended || now.screen !== 'game') return { ok: true, at: iRef.i, phaseFrom: s0.phase, phaseTo: now.phase, tried, skipped };
    if (e.kind === 'act' || e.kind === 'exit') {
      if (now.room !== e.room) await X.navigate(I, rnd, rec, e.room, 10).catch(() => {});
      const st = await I.ev(SNAP); if (st.room !== e.room) { skipped++; rec.push(['skip-room', e.room, st.room, e.verb || 'exit', e.id]); continue; }
      if (st.active !== e.active) { const can = await I.ev(() => M.E.canSwitch()); if (!can) { skipped++; rec.push(['skip-switch', e.active, e.verb || 'exit', e.id]); continue; } rec.push(['switch', e.active]); await I.ev((w) => M.TA.switchTo(w), e.active); await I.page.waitForTimeout(150); await drain(I, list, iRef, rnd, rec); }
      const A = await I.ev(X.LIST_ACTIONS); const ok = e.kind === 'exit' ? A.acts.some(z => z[0] === 'exit' && z[1] === e.id) : (A.acts.some(z => z[0] === 'act' && z[1] === e.verb && z[2] === e.id) || (e.item && A.inv.indexOf(e.item) >= 0 && A.hsIds.indexOf(e.id) >= 0) || ((e.verb === 'talk' || e.verb === 'give') && A.hsIds.indexOf(e.id) >= 0) || e.id === '_mala');
      if (!ok) { skipped++; rec.push(['skip-na', e.verb || 'exit', e.id, e.room]); continue; } tried++;
      if (e.kind === 'exit') { rec.push(['exit', e.id]); await I.ev((x) => M.TA.exit(x), e.id).catch(() => {}); }
      else { rec.push(['act', e.verb, e.id, e.item]); await I.ev((x) => M.TA.act(x[0], x[1], x[2] || undefined), [e.verb, e.id, e.item]).catch(() => {}); }
      await I.page.waitForTimeout(80); await drain(I, list, iRef, rnd, rec);
    } else if (e.kind === 'combine') { const A = await I.ev(X.LIST_ACTIONS); if (A.notes && A.notes.indexOf(e.a) >= 0 && A.notes.indexOf(e.b) >= 0) { tried++; rec.push(['combine', e.a, e.b]); await I.ev((x) => M.TA.combine(x[0], x[1]), [e.a, e.b]).catch(() => {}); await I.page.waitForTimeout(80); await drain(I, list, iRef, rnd, rec); } else skipped++; }
    else skipped++;   // choose/note ohne offenen Dialog: übersprungen
  }
  const end = await I.ev(SNAP); return { ok: end.phase !== s0.phase || end.ended, phaseFrom: s0.phase, phaseTo: end.phase, tried, skipped, end };
}

(async () => {
  for (const id of ids) { const [cat, n] = id.split('-'); const spec = sim.makeSpec(cat, +n, salt); spec.vLimitMs = (spec.vLimitMs || 0) * 6; spec.wallLimitMs *= 4; let out = null;
    const r = await sim.runOne(spec, { canon, noProbe: true, onEnd: async (I, res) => { if (res.result !== 'undecided') { out = { note: 'Lauf nicht unentschieden: ' + res.result }; return; }
      const curCh = (res.chapters[res.chapters.length - 1] || {}).ch; const m = /nach Schritt (\d+)|bei Schritt (\d+)/.exec(String(res.reason)); const stuck = m ? +(m[1] || m[2]) : 1; const rec = [];
      const t0 = Date.now(); out = await resume(I, curCh, stuck, rec).catch(e => ({ ok: false, err: String(e.message || e) })); out.ch = curCh; out.fromStep = stuck; out.wallS = Math.round((Date.now() - t0) / 1000); out.rec = rec.slice(0, 60); } });
    const line = Object.assign({ runId: id, salt, result: r.result }, out); fs.appendFileSync(OUT, JSON.stringify(line) + '\n');
    console.log(id, out && out.ok ? 'WEITER: ' + out.phaseFrom + ' → ' + out.phaseTo : 'NICHT WEITER: ' + JSON.stringify(out && { from: out.phaseFrom, to: out.phaseTo, err: out.err, note: out.note, tried: out.tried, skipped: out.skipped }), out && out.ch ? '(K' + out.ch + ' ab Schritt ' + out.fromStep + ', ' + out.wallS + ' s)' : ''); }
})().catch(e => { console.error(e); process.exit(1); });
