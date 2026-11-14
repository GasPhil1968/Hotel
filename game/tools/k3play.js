// Spielerhandlungen für Kapitel 3 (Mostar), gemeinsam für walkthrough3.js und k3tests.js.
// Alles geht über die Wege eines Spielers: M.TA (Hotspots, Ausgänge, Auswahl, Notizbuch, Stadtplan), M.k3PeilTap, Trefferflächen der Overlays.
// play(D, { onStep }) → Helfer; onStep(text) wird für Anrufe aufgerufen, die von selbst kommen und beantwortet werden.
function play(D, opts = {}) {
  const P = {};
  const onStep = opts.onStep || (async () => {});
  P.st = () => D.st();
  P.fail = async (what) => { const s = await D.st().catch(() => ({})); const last = await D.ev(() => (M.__speechLog || []).slice(-6).map(x => x[0] + ': ' + x[1])).catch(() => []);
    throw new Error(what + '\n  Zustand: ' + JSON.stringify({ room: s.room, phase: s.phase, active: s.active, busy: s.busy, dlg: s.dlg, overlay: s.overlay, screen: s.screen }) + '\n  zuletzt gesagt: ' + JSON.stringify(last)); };
  P.expect = async (cond, what) => { if (!cond) await P.fail('Erwartung verfehlt: ' + what); };
  P.note = async (id) => P.expect(await D.hasNote(id), 'Notiz ' + id);
  P.flag = async (k, v) => { const x = await D.flag(k); await P.expect(v === undefined ? !!x : x === v, 'Schalter ' + k + (v !== undefined ? '=' + JSON.stringify(v) : '') + ' (ist ' + JSON.stringify(x) + ')'); };
  P.inv = async (id) => P.expect((await D.st()).inv.indexOf(id) >= 0, 'Gegenstand ' + id);
  P.room = async () => (await D.st()).room;
  P.phase = async () => (await D.st()).phase;
  P.at = async (r) => { const s = await D.st(); await P.expect(s.room === r || s.realRoom === r, 'Raum ' + r + ' (ist ' + s.room + ')'); };
  P.inPhase = async (p) => { const x = await P.phase(); await P.expect(x === p, 'Phase ' + p + ' (ist ' + x + ')'); };
  P.clearLog = () => D.ev(() => { M.__speechLog = []; });
  P.said = (sub) => D.ev((x) => (M.__speechLog || []).some(l => l[1].indexOf(x) >= 0), sub);
  P.expectSaid = async (sub) => P.expect(await P.said(sub), 'gesagt: „' + sub + '“');
  // Anrufe, die von selbst kommen: ihre Auswahl wird wie vom Spieler beantwortet
  P.AUTO = [[/Wie hieß er weiter/, 'Wie hieß er weiter', 'Ljerka ruft zurück: Vlado, der Raucher; Brunos Bild; Schlüssel 31; „Abreise“ leer'],
    [/Sie hat daran gerochen/, 'Sie hat daran gerochen', 'Hajra ruft an: die Pita']];
  // warten, bis das Spiel wieder auf den Spieler wartet und auch der Leerlauf (Reaktionen auf Schlüsse, Tageswechsel) nichts mehr anstößt
  P.calm = async (maxMs = 120000) => { const tA = Date.now();
    for (;;) { const s = await D.drain(20);
      if (s.dlg) { const hit = P.AUTO.find(a => s.dlg.some(t => a[0].test(t))); if (hit) { await D.ev((x) => M.TA.choose(x), hit[1]); await D.page.waitForTimeout(60); await onStep('(Anruf) ' + hit[2]); continue; } return s; }
      if (s.overlay || s.screen !== 'game') return s;
      await D.page.waitForTimeout(140); const s2 = await D.st();
      if (!s2.busy && !s2.speech && !s2.card && !s2.dlg && !s2.overlay && !s2.walk && !s2.acting && s2.screen === 'game') { await D.page.waitForTimeout(140); const s3 = await D.st(); if (!s3.busy && !s3.speech && !s3.card && !s3.dlg && !s3.overlay && !s3.walk) return s3; }
      if (Date.now() - tA > maxMs) await P.fail('Das Spiel kommt nicht zur Ruhe'); } };
  P.act = async (v, id, item) => { await D.act(v, id, item); return P.calm(); };
  P.exit = async (id) => { await D.exit(id); return P.calm(); };
  P.choose = async (sub) => { await D.choose(sub); return P.calm(); };
  P.pick = async (id) => { await D.pickNote(id); return P.calm(); };
  P.opts = async () => ((await D.st()).dlg || []);
  P.dlgHas = async (sub) => (await P.opts()).some(t => t.indexOf(sub) >= 0);
  P.waitDlg = async (sub, ms = 60000) => { await D.until(s => s.dlg && s.dlg.some(t => t.indexOf(sub) >= 0), ms, 'Auswahl „' + sub + '“'); };
  P.talk = async (id, ...choices) => { await P.act('talk', id); const bf = await D.ev(() => !!(M.k3bf && M.k3bf()));
    for (const c of choices) { if (bf && /^Nach etwas aus dem Notizbuch/.test(c)) continue; if (c.startsWith('NOTE:')) { if (bf) await P.bfNote(c.slice(5)); else await P.pick(c.slice(5)); } else await P.choose(c); } };
  // Kapitel 3 „wie bei Baphomet“ (MALA_K3BF=1, 24_k3bf.js): Fragen über die Themenleiste statt über das Notizbuch
  P.bf = () => D.ev(() => !!(M.k3bf && M.k3bf()));
  P.barPick = async (k, id) => { await D.until(s => s.dlg, 20000, 'Themenleiste'); const ok = await D.ev(([a, b]) => M.bfPick(a, b), [k, id]); await P.expect(ok, 'Themenleiste: ' + k + ' ' + id); await D.page.waitForTimeout(60); return P.calm(); };
  // eine Notiz wählen: im Gespräch über die Leiste; fragt das Spiel selbst nach einer Notiz (A.askNote), über die Polaroids
  P.bfNote = async (id) => { const s = await D.until(s => s.dlg || s.overlay === 'evidence', 20000, 'Leiste oder Polaroids');
    if (s.overlay === 'evidence') { await D.ev((x) => { const ov = M.E.overlay; M.OVTAP.evidence(ov, 'n:' + x); M.OVTAP.evidence(ov, 'n:' + x); }, id); await D.page.waitForTimeout(60); return P.calm(); }
    return P.barPick('note', id); };
  P.ask = async (id, noteId, ...more) => { if (await P.bf()) { await P.act('talk', id); await P.bfNote(noteId); for (const c of more) await P.choose(c); return; }
    return P.talk(id, 'Nach etwas aus dem Notizbuch', 'NOTE:' + noteId, ...more); };
  P.bye = async (...subs) => { for (let i = 0; i < 6; i++) { const s = await D.st(); if (!s.dlg) return; const b = subs.find(x => s.dlg.some(t => t.indexOf(x) >= 0)); if (!b) await P.fail('kein Ausgang aus der Auswahl (' + subs.join(' / ') + ')'); await P.choose(b); } };
  // Schluss: klassisch verbinden; im Modus „wie bei Baphomet“ der richtigen Person zeigen (wer da ist), Peilung und Karte zieht Marko selbst
  P.combBF = async (a, b, to) => { if (await D.hasNote(to)) return P.calm();
    const plan = await D.ev(([x, y, z]) => { const d = (M.K3BFD || []).find(e => e.to === z); if (!d) return null; const here = [];
      Object.keys(d.who).forEach(w => { if (w === 'mala') { if (M.API.malaHere()) here.push(w); } else if (M.E.room.hotspots.some(h => h.npc === w && M.E.hsRect(h))) here.push(w); });
      return { who: here, note: M.k3bfFor(M.GS, here[0], x) ? x : y }; }, [a, b, to]);
    await P.expect(plan && plan.who.length, 'Schluss ' + to + ': niemand da, dem ich es zeigen kann | ' + JSON.stringify(plan));
    const w = plan.who[0]; await P.act('talk', w === 'mala' ? '_mala' : w); await P.barPick('note', plan.note); await P.note(to);
    for (let i = 0; i < 4; i++) { const open = await D.ev(() => !!(M.E.dlg && M.E.bfBar)); if (!open) break;   // nur das eigene Gespräch schließen, keine Szene danach
      await D.ev(() => { const d = M.E.dlg; const k = d.opts.findIndex(o => o.bye); M.E.chooseDone(k >= 0 ? k : d.opts.length - 1); }); await P.calm(); }
    return P.calm(); };
  P.comb = async (a, b, to) => { if (await P.bf()) return P.combBF(a, b, to); const r = await D.combine(a, b); await P.expect(r && r.ok, 'Schluss ' + a + ' + ' + b + ' → ' + to + ' | ' + JSON.stringify(r)); await P.note(to); await D.page.waitForTimeout(250); return P.calm(); };
  P.mala = async () => { await D.switchTo('mala'); const s = await P.calm(); await P.expect(s.active === 'mala', 'Mala gespielt'); };
  P.marko = async () => { await D.switchTo('marko'); const s = await P.calm(); await P.expect(s.active === 'marko', 'Marko gespielt'); };
  P.travel = async (loc) => { await D.ev((l) => M.TA.travel(l), loc); await D.page.waitForTimeout(80); return P.calm(); };
  P.go = async (loc, r) => { await P.travel(loc); await P.at(r || loc); };
  // Peilung: Malas zwei Landmarken antippen und einzeichnen; dann „Weiter“
  P.peilPick = (a, b) => D.ev(([x, y]) => { M.k3PeilTap(x); M.k3PeilTap(y); M.k3PeilTap('go'); const d = M.E.overlay.data; return { mode: d.mode, bad: !!d.bad, msg: d.msg || '' }; }, [a, b]);
  P.peil = async (station) => { await D.until(s => s.overlay === 'peil', 30000, 'Peilung ' + station);
    const a = await D.ev((stn) => M.PEIL.answer[stn], station); const r = await P.peilPick(a[0], a[1]); await P.expect(r.mode === 'done', 'Peilung eingezeichnet');
    await D.ev(() => M.k3PeilTap('go')); await D.page.waitForTimeout(80); return P.calm(); };
  // Rätsel-Overlays wie in walkthrough2.js: Auswahl setzen, check des Spiels laufen lassen, schließen
  P.solve = async (sel) => { await D.until(s => s.overlay === 'puzzle', 20000, 'Rätsel');
    await D.ev((v) => { const ov = M.E.overlay; ov.sel = v.slice(); const r = ov.data.check ? ov.data.check(ov.sel) : { ok: true }; if (!r.ok) throw new Error('Rätsel falsch gelöst: ' + JSON.stringify(r)); M.TA.closeOverlay(v.slice()); }, sel);
    await D.page.waitForTimeout(60); return P.calm(); };
  P.tapHit = async (id) => { await D.page.waitForTimeout(120); await D.ev((i) => { const h = ((M.E.overlay && M.E.overlay.lay && M.E.overlay.lay.hits) || []).find(x => x.id === i); if (!h) throw new Error('Feld fehlt: ' + i); const x = h.r[0] + (h.r[2] >> 1), y = h.r[1] + (h.r[3] >> 1); M.pointerDown(x, y, true); M.pointerUp(x, y, true); }, id); await D.page.waitForTimeout(80); };
  // Ordnen: Karten antippen und tauschen wie ein Spieler, bis die Reihenfolge stimmt, dann den Knopf („So war es“)
  P.arrangeOrder = () => D.ev(() => { const ov = M.E.overlay; return (ov.ord || ov.data.start).slice(); });
  P.arrange = async () => { await D.until(s => s.overlay === 'arrange', 30000, 'Ordnen'); await D.page.waitForTimeout(150);
    for (let guard = 0; guard < 12; guard++) { const ord = await P.arrangeOrder(); const i = ord.findIndex((k, j) => k !== j); if (i < 0) break;   // die Karten stehen in data.items in der richtigen Folge
      await P.tapHit('r' + i); await P.tapHit('r' + ord.indexOf(i)); }
    await P.tapHit('go'); return P.calm(); };
  return P;
}
module.exports = { play };
