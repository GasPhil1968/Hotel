// Spielerhandlungen für Kapitel 4 (München), gemeinsam für walkthrough4.js und k4tests.js.
// Alles geht über die Wege eines Spielers: M.TA (Hotspots, Ausgänge, Auswahl, Notizbuch, Stadtplan), Trefferflächen der Overlays.
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
  // In München kommen keine Anrufe mit Auswahl von selbst (Frau Kolars Anruf am Dienstagmorgen ist Teil der Szene); die Liste bleibt für spätere Fassungen.
  P.AUTO = [];   // [Muster der Auswahl, gewählte Zeile, Text für das Protokoll]
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
  P.talk = async (id, ...choices) => { await P.act('talk', id); for (const c of choices) { if (c.startsWith('NOTE:')) await P.pick(c.slice(5)); else await P.choose(c); } };
  P.ask = async (id, noteId, ...more) => P.talk(id, 'Nach etwas aus dem Notizbuch', 'NOTE:' + noteId, ...more);
  P.bye = async (...subs) => { for (let i = 0; i < 6; i++) { const s = await D.st(); if (!s.dlg) return; const b = subs.find(x => s.dlg.some(t => t.indexOf(x) >= 0)); if (!b) await P.fail('kein Ausgang aus der Auswahl (' + subs.join(' / ') + ')'); await P.choose(b); } };
  P.comb = async (a, b, to) => { const r = await D.combine(a, b); await P.expect(r && r.ok, 'Schluss ' + a + ' + ' + b + ' → ' + to + ' | ' + JSON.stringify(r)); await P.note(to); await D.page.waitForTimeout(250); return P.calm(); };
  P.mala = async () => { await D.switchTo('mala'); const s = await P.calm(); await P.expect(s.active === 'mala', 'Mala gespielt'); };
  P.marko = async () => { await D.switchTo('marko'); const s = await P.calm(); await P.expect(s.active === 'marko', 'Marko gespielt'); };
  P.travel = async (loc) => { await D.ev((l) => M.TA.travel(l), loc); await D.page.waitForTimeout(80); return P.calm(); };
  P.go = async (loc, r) => { await P.travel(loc); await P.at(r || loc); };
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
  // Gespräch führen wie ein Spieler: bei jeder Auswahl die erste passende Zeile aus prefs (Reihenfolge der Liste zählt), bei jeder Frage nach dem Notizbuch
  // die erste passende Notiz aus notes; bis until(s) gilt. Steht am Ende noch eine Auswahl offen, wird sie mit einer Abschiedszeile geschlossen.
  // Ohne passende Zeile bricht der Lauf ab (strict, Vorgabe) oder nimmt die erste Zeile, die kein Hinweis ist (strict:false). Jede Wahl landet in P.trace.
  P.trace = [];
  P.BYE = /^(Servus|Auf Wiedersehen|Bis später|Bis heute Abend|Ich gehe|Später|Schönen Tag|Komm\.|\(Warten\.\)|\(Gehen\.\)|Ich lasse dich|Danke|Arrivederci|Wiederschauen|Pfiat|Ich muss los|Gute Nacht|Bis morgen|\(Doch nichts\.\))/;
  P.dlgOpts = () => D.ev(() => M.E.dlg ? M.E.dlg.opts.map(o => ({ t: o.t, id: o.id })) : null);
  P.drive = async (prefs, until, o = {}) => { const notes = (o.notes || []).slice(), max = o.max || 120, strict = o.strict !== false, used = [];
    for (let i = 0; i < max; i++) {
      // Kapitelende: Abspann oder Titelbild (danach ist M.GS schon ein neuer Stand)
      const endNow = async () => { const x = await D.st(); return (x.screen === 'credits' || x.screen === 'title' || await D.ev(() => !!M.GS.ended)) ? x : null; };
      let e0 = await endNow(); if (e0) return e0;
      let s; try { s = await P.calm(); } catch (err) { e0 = await endNow(); if (e0) return e0; throw err; }
      const done = await until(Object.assign({}, s));
      if (done) { if (!s.dlg) return s; const k = s.dlg.findIndex(t => P.BYE.test(t)); if (k < 0) return s; await D.ev((x) => M.E.chooseDone(x), k); P.trace.push('  > ' + s.dlg[k]); await D.page.waitForTimeout(40); continue; }
      if (s.dlg) { const opts = await P.dlgOpts(); if (!opts) continue;
        const nk = opts.findIndex(x => notes.indexOf(x.id) >= 0);
        if (nk >= 0) { notes.splice(notes.indexOf(opts[nk].id), 1); P.trace.push('  > [Notiz] ' + opts[nk].t); await D.ev((x) => M.E.chooseDone(x), nk); await D.page.waitForTimeout(40); continue; }
        // Zeilen, die in diesem Gespräch schon gewählt wurden, kommen zuletzt dran (Menüs, die sich wiederholen)
        let pick = -1; for (const p of prefs) { pick = opts.findIndex(x => x.t.indexOf(p) >= 0 && used.indexOf(x.t) < 0); if (pick >= 0) break; }
        if (pick < 0) for (const p of prefs) { pick = opts.findIndex(x => x.t.indexOf(p) >= 0 && (!o.once || used.indexOf(x.t) < 0)); if (pick >= 0) break; }
        if (pick >= 0) used.push(opts[pick].t);
        if (pick < 0) { if (strict && opts.length > 1) await P.fail('drive' + (o.label ? ' (' + o.label + ')' : '') + ': keine passende Zeile in ' + JSON.stringify(opts.map(x => x.t)));
          pick = opts.findIndex(x => !/hintTalk|nicht weiter|^Komm\.$/.test(x.t)); if (pick < 0) pick = 0; }
        P.trace.push('  > ' + opts[pick].t); await D.ev((k) => M.E.chooseDone(k), pick); await D.page.waitForTimeout(40); continue; }
      if (s.overlay === 'notebook') { const avail = await D.ev(() => M.E.nbOpen(true, M.E.overlay.data && M.E.overlay.data.also));
        const id = notes.find(n => avail.indexOf(n) >= 0); if (id) notes.splice(notes.indexOf(id), 1); else if (strict) await P.fail('drive' + (o.label ? ' (' + o.label + ')' : '') + ': keine passende Notiz in ' + JSON.stringify(avail));
        P.trace.push('  > [Notiz] ' + (id || '(nichts)')); await D.ev((x) => M.TA.pickNote(x || null), id || null); await D.page.waitForTimeout(40); continue; }
      if (s.screen !== 'game' || s.card || s.busy) { await D.page.waitForTimeout(150); continue; }
      await P.fail('drive' + (o.label ? ' (' + o.label + ')' : '') + ': das Spiel wartet, aber die Bedingung ist nicht erfüllt');
    }
    await P.fail('drive' + (o.label ? ' (' + o.label + ')' : '') + ': zu viele Schritte'); };
  // Bedingungen für drive
  P.F = (k) => D.flag(k); P.N = (id) => D.hasNote(id);
  P.flagIs = (k, v) => async () => { const x = await D.flag(k); return v === undefined ? !!x : x === v; };
  P.noteIs = (id) => async () => D.hasNote(id);
  P.phaseIs = (p) => async (s) => s.phase === p && !s.busy;
  P.noDlg = async (s) => !s.dlg && !s.overlay;
  return P;
}
module.exports = { play };
