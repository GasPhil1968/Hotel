// MALA-Simulationen A–E gegen die Produktionsdatei web/index.html.
//   node qa/sim.js --plan full --out qa/results/<tag> [--workers 4]        A1000 B1000 C800 D600 E600
//   node qa/sim.js --cat A --count 20 --out qa/results/<tag>               einzelne Kategorie
//   node qa/sim.js --replay <run-id> --from qa/results/<tag>/runs.jsonl    einen Lauf mit gleichem Seed wiederholen (mit Bildbeleg)
//   node qa/sim.js --canon --out qa/results/canon                          kanonische Aktionsfolge je Kapitel (für Kategorie C)
// Jede Zeile in runs.jsonl ist ein eigenständiger Lauf: eigene VM, eigener localStorage, eigener Seed.
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2), arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; }, has = (k) => args.indexOf(k) >= 0;

const PLAN_FULL = { A: 1000, B: 1000, C: 800, D: 600, E: 600 };
const CH_PATH = { 1: 'walkthrough', 2: 'walkthrough2', 3: 'walkthrough3', 4: 'walkthrough4' };
const CH_TITLE = { 1: 'Kapitel 1: Split', 2: 'Kapitel 2: Sarajevo', 3: 'Kapitel 3: Mostar', 4: 'Kapitel 4: München' };
const ENDPOINT = 'K4 Abspann → Titelbild ohne „Weiter mit Kapitel 5“ (Ende des implementierten Umfangs)';

// ---------------------------------------------------------------- Spezifikationen (deterministisch aus Kategorie und Index)
function hashSeed(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function makeSpec(cat, i, salt) {
  const runId = cat + '-' + String(i).padStart(4, '0');
  const seed = hashSeed((salt || 'mala') + ':' + runId);
  const { mulberry32 } = require('./vmdriver'); const r = mulberry32(seed ^ 0x5bd1e995);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const v = { nb: r() < 0.3 ? 'think' : 'list', order2: r() < 0.5 ? 'alt' : 'normal', consent: pick(['a', 'b', 'c']), sample: r() < 0.35 ? 'no' : 'yes', konsEarly: r() < 0.5 ? '1' : '0',
    c2: pick(['Ja. Und wenn es zu schwer wird, sage ich es', 'Ja. Diesmal weiß ich, wozu', 'Ich weiß es nicht. Das ist die ehrliche Antwort']) };
  const startCh = cat === 'A' ? 1 : (1 + Math.floor(r() * 4));
  const spec = { runId, cat, seed, startCh, variant: v };
  if (cat === 'A') { spec.goal = 'Kritischer Pfad ab Spielbeginn (Titel → Kapitel 1 → … → Kapitel 4) bis ' + ENDPOINT; }
  if (cat === 'B') { spec.points = 1 + Math.floor(r() * 3); spec.actions = 15 + Math.floor(r() * 66); spec.goal = 'Zufallserkundung (' + spec.points + '× je ' + spec.actions + ' Aktionen) in Kapitel ' + startCh + ', danach regulär bis ' + ENDPOINT; }
  if (cat === 'C') { spec.premature = 1 + Math.floor(r() * 3); spec.absence = r() < 0.6 ? 1 + Math.floor(r() * 3) : 0; spec.goal = 'Variierte Reihenfolge (Varianten, ' + spec.premature + ' verfrühte Lösungsversuche, ' + spec.absence + ' Abwesenheiten) ab Kapitel ' + startCh + ' bis ' + ENDPOINT; }
  if (cat === 'D') { spec.points = 1 + Math.floor(r() * 4); spec.modes = Array.from({ length: spec.points }, () => pick(['fresh', 'fresh', 'same', 'double'])); spec.goal = 'Speichern/Laden an ' + spec.points + ' Stellen (' + spec.modes.join(',') + ') ab Kapitel ' + startCh + ', dann weiter bis ' + ENDPOINT; }
  if (cat === 'E') { spec.points = 2 + Math.floor(r() * 4); spec.bursts = 3 + Math.floor(r() * 8); spec.goal = 'Belastung/Fehlbedienung (' + spec.points + '× je ' + spec.bursts + ' Stöße) in Kapitel ' + startCh + ', danach bis ' + ENDPOINT; }
  spec.stepLimit = 12000; spec.wallLimitMs = 900000; spec.vLimitMs = 6 * 3600 * 1000;
  return spec;
}

// Spielstand für Save/Load-Vergleiche: abgeleitete Raumschlüssel (in actors() bei jedem Betreten aus dem Spielzustand berechnet)
// und die Kartenbekanntheit (beim Öffnen der Karte neu berechnet) werden vor dem Vergleich auf dieselbe Weise neu abgeleitet bzw. entfernt.
const NORM_GS = function () { const g = JSON.parse(JSON.stringify(M.GS)); M.mapRefresh(g);
  /* Sitzungsstempel der laufenden Spielzeit werden beim Laden absichtlich entfernt (loadData, seit BUG-004 auch steam/nudge): nicht vergleichen */
  Object.keys(g.rooms || {}).forEach(id => { ['ferryAt', 'ferryGo', 'radioT', 'steam', 'nudge'].forEach(k => { if (g.rooms[id]) delete g.rooms[id][k]; }); });
  Object.keys(g.rooms || {}).forEach(id => { const R = M.ROOMS[id]; if (!R || !R.actors) return; const rec = {};
    const px = new Proxy(Object.assign({}, g.rooms[id]), { set(t, k, v) { rec[k] = 1; t[k] = v; return true; } });
    try { R.actors(px, g); } catch (e) {} Object.keys(rec).forEach(k => { delete g.rooms[id][k]; }); });
  return g; };
// ---------------------------------------------------------------- ein Lauf (im Kindprozess)
async function runOne(spec, opt = {}) {
  const C = require('./lib/common'); const { Session, menuTap } = require('./lib/session'); const X = require('./lib/explore');
  const { mulberry32 } = require('./vmdriver');
  const t0 = Date.now();
  const rnd = mulberry32(spec.seed ^ 0x2f6b9a13);
  const S = new Session({ seed: spec.seed, render: opt.render, html: opt.html, deadline: t0 + spec.wallLimitMs, vlimit: spec.vLimitMs });
  const res = { runId: spec.runId, cat: spec.cat, seed: spec.seed, startCh: spec.startCh, variant: spec.variant, goal: spec.goal, stepLimit: spec.stepLimit, wallLimitMs: spec.wallLimitMs,
    start: spec.startCh === 1 ? 'Neues Spiel über das Titelmenü (Kapitel 1: Split, Platz 1), leerer localStorage' : 'Neues Spiel über das Titelmenü (' + CH_TITLE[spec.startCh] + ', Platz 1), leerer localStorage, Vorgaben für frühere Kapitel',
    chapters: [], events: [], perturb: [], saveload: [], result: null, reason: null };
  const env = (ch) => { const v = spec.variant || {}; const e = {};
    if (spec.cat !== 'B' && spec.cat !== 'E') { if (ch <= 2 && v.nb === 'think') e.MALA_NB = 'think'; if (ch === 2 && v.order2 === 'alt') e.MALA_ORDER = 'alt'; if (ch === 3) { e.QA_CONSENT = v.consent; e.QA_SAMPLE = v.sample; } if (ch === 4) { e.QA_KONSULAT_EARLY = v.konsEarly; e.QA_C2 = v.c2; } }
    else if (ch === 3) { e.QA_CONSENT = v.consent; }
    return e; };
  let I = await S.open({}); await I.ev(() => { window.__QA_CHAINED = true; });
  const D = S.D;
  let step = 0, chStep = 0, curCh = 0, perturbedCh = false;
  const failBag = [];
  // Haken nach jedem Skriptschritt
  let hookPlan = {};   // ch -> Set(chStep)
  const planHooks = (ch, nPoints, nStepsGuess) => { const s = new Set(); for (let k = 0; k < nPoints; k++) s.add(1 + Math.floor(rnd() * Math.max(2, nStepsGuess - 2))); hookPlan[ch] = s; };
  const STEPS_GUESS = { 1: 60, 2: 66, 3: 110, 4: 84 };
  const canon = opt.canon || null;
  const afterStep = async (label) => {
    step++; chStep++;
    if (step > spec.stepLimit) { const e = new Error('Schrittlimit erreicht'); e.kind = 'limit'; throw e; }
    const hp = hookPlan[curCh]; if (!hp || !hp.has(chStep)) return;
    const s0 = await I.settle(60000).catch(() => null); if (!s0 || s0.dlg || s0.overlay || s0.screen !== 'game') { res.perturb.push({ ch: curCh, step: chStep, label, skipped: 'nicht ruhig' }); return; }
    const a = await X.anchor(I); const rec = []; const p = { ch: curCh, step: chStep, label: label.slice(0, 120), anchor: a, kind: spec.cat };
    try { await perturbBody(a, rec, p, label); } catch (e) { p.error = String(e.message || e).slice(0, 300); p.rec = rec.slice(-60); res.perturb.push(p); S.tolerant = true; perturbedCh = true; throw e; }
  };
  const perturbBody = async (a, rec, p, label) => {
    if (spec.cat === 'B') { for (let k = 0; k < spec.actions; k++) await X.randomAction(I, rnd, rec); }
    if (spec.cat === 'E') { for (let k = 0; k < spec.bursts; k++) await X.stressBurst(I, rnd, rec); }
    if (spec.cat === 'C') {
      const fut = canon && canon[curCh] ? canon[curCh].filter(x => x.step > chStep && x.step <= chStep + 25 && x.kind === 'act') : [];
      for (let k = 0; k < spec.premature; k++) { const A = await I.ev(X.LIST_ACTIONS); const ok = fut.filter(f => f.room === A.room && f.active === A.active && A.acts.some(z => z[0] === 'act' && z[1] === f.verb && z[2] === f.id));
        if (!ok.length) { rec.push(['premature-none']); continue; } const f = ok[Math.floor(rnd() * ok.length)]; rec.push(['premature', f.verb, f.id, 'aus Schritt ' + f.step]);
        const before = await I.ev(() => ({ n: M.GS.notes.length, inv: M.GS.inv.length, ph: M.GS.phase, f: Object.keys(M.GS.flags).length })); await I.ev((x) => M.TA.act(x[0], x[1], x[2] || undefined), [f.verb, f.id, f.item]); await I.page.waitForTimeout(60); await X.handleOpen(I, rnd, rec, { dlgDepth: 3 });
        const after = await I.ev(() => ({ n: M.GS.notes.length, inv: M.GS.inv.length, ph: M.GS.phase, f: Object.keys(M.GS.flags).length, said: M.__speechLog ? M.__speechLog.length : null })); rec.push(['premature-effect', before, after]); }
      for (let k = 0; k < (spec.absence || 0); k++) { const A = await I.ev(X.LIST_ACTIONS); if (A.locs && A.locs.length) { const l = A.locs[Math.floor(rnd() * A.locs.length)]; await X.navigate(I, rnd, rec, (await I.ev((x) => { const L = M.mapLoc(x); return L ? L.to : null; }, l)) || a.room, 8); await I.page.waitForTimeout(2000 + Math.floor(rnd() * 6000)); } }
    }
    if (spec.cat === 'D') { await saveLoadPoint(p); res.perturb.push(p); return; }
    const back = await X.returnTo(I, rnd, rec, a); p.returned = back.ok; p.end = back.end; p.actions = rec.length; p.rec = rec.slice(0, 400);
    res.perturb.push(p); S.tolerant = true; perturbedCh = true;
  };
  // Bekannte, beabsichtigte Rücksetzungen beim Laden (QA-Triage Erstlauf D-0379/D-0223/D-0376):
  //  - Straßenbrücke: rooms/strassenbr.js load() setzt crossing/noSwitch zurück → die Überquerung beginnt neu; Spieler tippt erneut das Westende an.
  //  - Partisanenfriedhof: resume() holt Mala nach 3 s zurück (bellsEnd) → bells1 gesetzt, Zeitstempel neu.
  const SCENE_RESETS = [
    { why: 'Straßenbrücke: Laden setzt die geführte Überquerung zurück (strassenbr.load), sie beginnt neu', keys: ['GS.rooms.strassenbr.crossing', 'GS.flags.mala.noSwitch'],
      when: d => d.some(x => /^GS\.rooms\.strassenbr\.crossing: true ≠ false/.test(x)),
      recover: { label: 'zu Marko wechseln, Westufer antippen (Überquerung beginnt neu)', run: async (J) => { if (await J.ev(() => M.GS.active) !== 'marko') { await J.ev(() => M.TA.switchTo('marko')); await J.page.waitForTimeout(600); await J.settle(30000).catch(() => {}); } await J.ev(() => M.TA.exit('exit_w')); await J.page.waitForTimeout(400); } } },
    { why: 'Partisanenfriedhof: Glocken-Szene läuft nach dem Laden weiter, Mala kehrt nach 3 s zurück (partizan.resume/bellsEnd)', keys: ['GS.flags.k3.bellsOut', 'GS.flags.mala.noSwitch', 'GS.flags.k3.bells1', 'GS.rooms.partizan.bellBack', 'GS.rooms.partizan.nextBell'],
      when: d => d.some(x => /^GS\.flags\.k3\.bellsOut: true ≠ false/.test(x)) }
  ];
  // Kategorie D: Speichern im Menü, Laden im frischen Kontext / im selben Kontext / zweimal
  let dIdx = 0;
  const saveLoadPoint = async (p) => {
    const mode = spec.modes[dIdx++ % spec.modes.length]; p.mode = mode;
    const sv = await menuTap(I, 1); p.save = sv.msg;
    if (!/Gespeichert/.test(sv.msg || '')) { p.note = 'Speichern abgelehnt: ' + sv.msg; res.saveload.push(p); return; }
    const before = C.relevant(await I.ev(NORM_GS));
    const stored = JSON.parse(I.exportStorage()['mala.save.' + (await I.ev(() => M.E.slot()))] || 'null');
    p.storedOk = !!(stored && stored.GS);
    if (mode === 'fresh' || mode === 'double') {
      const st = I.exportStorage(); S.loads++; I = await S.open(st); await I.ev(() => { window.__QA_CHAINED = true; });
      await C.tapTitle(I, 'Fortsetzen'); await C.tapTitle(I, 'Platz ' + (stored ? 1 : 1)); await I.settle(60000);
      if (mode === 'double') { const l2 = await menuTap(I, 2); p.load2 = l2.msg; await I.settle(60000); }
    } else { const l = await menuTap(I, 2); p.load = l.msg; await I.settle(60000); }
    let after = C.relevant(await I.ev(NORM_GS));
    let diff = C.diffRelevant(before, after);
    // Im Spiel vorgesehene Szenen-Rücksetzungen beim Laden (siehe Raumcode load/resume) – protokolliert, aber kein Fehler:
    const exp = SCENE_RESETS.filter(r => r.when(diff)); if (exp.length) {
      p.expectedReset = exp.map(r => r.why); const keys = exp.reduce((a, r) => a.concat(r.keys), []);
      p.diffAll = diff.slice(0, 30); diff = diff.filter(d => !keys.some(k => d.indexOf(k + ':') === 0));
      for (const r of exp) if (r.recover) { p.recover = r.recover.label; await r.recover.run(I); await I.settle(60000).catch(() => {}); p.recoverState = await I.ev(() => ({ crossing: M.RS('strassenbr').crossing, active: M.GS.active, busy: M.E.busy, ma: M.ACT.mala && Math.round(M.ACT.mala.x), said: (M.__speechLog || []).slice(-2).map(x => String(x[1]).slice(0, 50)) })).catch(e => String(e)); } }
    p.diff = diff.slice(0, 30); p.equal = diff.length === 0; res.saveload.push(p);
    if (!p.equal) failBag.push('Save/Load-Abweichung (' + mode + ', K' + curCh + ' Schritt ' + p.step + '): ' + diff.slice(0, 5).join(' | '));
  };
  const dPlan = {}; if (spec.cat === 'D') for (let k = 0; k < spec.points; k++) { const c = spec.startCh + Math.floor(rnd() * (5 - spec.startCh)); dPlan[c] = (dPlan[c] || 0) + 1; }
  let lastErr = null;
  try {
    // Kapitelstart über das Titelmenü
    await C.tapTitle(I, CH_TITLE[spec.startCh]); await C.tapTitle(I, 'Platz 1');
    for (let ch = spec.startCh; ch <= 4; ch++) {
      curCh = ch; chStep = 0; S.tolerant = false;
      if (['B', 'C', 'E'].indexOf(spec.cat) >= 0 && ch === spec.startCh) planHooks(ch, spec.cat === 'C' ? (spec.premature + (spec.absence ? 1 : 0) > 0 ? 1 + Math.floor(rnd() * 2) : 0) : spec.points, STEPS_GUESS[ch]);
      if (spec.cat === 'D') planHooks(ch, dPlan[ch] || 0, STEPS_GUESS[ch]);
      const chStart = await I.ev(() => ({ phase: M.GS.phase, room: M.E.room && M.E.room.id, map: Object.keys(M.GS.map || {}).filter(k => M.GS.map[k]).sort(), inv: M.GS.inv.slice(), notes: M.GS.notes.slice(), carry: Object.keys(localStorage).filter(k => /c\dend/.test(k)), k4c3: { consent: M.GS.flags['k4.c3.consent'], sample: M.GS.flags['k4.c3.sample'], fromSave: M.GS.flags['k4.c3.fromSave'] } })).catch(() => null);
      // Übernahme K3 → K4: was am Ende von Mostar gespeichert wurde, muss in München ankommen (Zustimmung, Probe)
      if (ch === 4 && chStart) { const prev = res.chapters.find(c => c.ch === 3 && c.endKey); if (prev) { const e = prev.endKey; if (chStart.k4c3.consent !== e.consent || chStart.k4c3.sample !== !!e.sample || !chStart.k4c3.fromSave) failBag.push('Übernahme K3→K4 falsch: Ende K3 ' + JSON.stringify({ consent: e.consent, sample: e.sample }) + ', Start K4 ' + JSON.stringify(chStart.k4c3)); } }
      const r = await C.runPath(CH_PATH[ch], D, env(ch), null, { afterStep });
      I = S.inner;
      const endInfo = await I.ev(() => ({ ended: !!M.GS.ended, screen: M.E.screen, key: localStorage.getItem('mala.c' + (M.GS.phase && /^k4/.test(M.GS.phase) ? 4 : /^k3/.test(M.GS.phase) ? 3 : /^k2/.test(M.GS.phase) ? 2 : 1) + 'end'), phase: M.GS.phase }));
      const endKey = I.exportStorage()['mala.c' + ch + 'end'];
      const chRes = { ch, ok: r.ok && !!endKey && endInfo.ended, err: r.err, lines: r.lines.length, last: r.lines.slice(-3), start: chStart, endKey: endKey ? JSON.parse(endKey) : null, skips: S.skips.length, perturbed: perturbedCh && ch === spec.startCh };
      res.chapters.push(chRes); S.skips = [];
      if (!chRes.ok) { lastErr = r.err || 'Kapitelende nicht erreicht'; break; }
      const tn = await C.waitTitleNext(I);
      chRes.titleAfter = tn.labels;
      if (ch < 4) { if (tn.labels.indexOf('Weiter mit ' + CH_TITLE[ch + 1].replace('Kapitel', 'Kapitel')) < 0 && !tn.labels.some(l => l.indexOf('Weiter mit Kapitel ' + (ch + 1)) >= 0)) { lastErr = 'Kein „Weiter mit Kapitel ' + (ch + 1) + '“ nach dem Abspann: ' + JSON.stringify(tn.labels); break; }
        await C.tapTitle(I, 'Weiter mit Kapitel ' + (ch + 1)); }
      else { chRes.finalTitle = tn; if (tn.labels.some(l => /Weiter mit Kapitel 5/.test(l))) failBag.push('unerwartetes Kapitel 5 angeboten'); }
    }
  } catch (e) { lastErr = (e.kind === 'limit' ? 'LIMIT ' : 'EXC ') + (e.message || e); res.exc = String(e.stack || e).split('\n').slice(0, 6).join('\n'); }
  const fin = S.finish();
  const errs = fin.errors.filter(e => !/Kunst fehlt|Spot fehlt/.test(e));
  // Abdeckung und Invarianten
  const cov = { rooms: Object.keys(S.monitor.rooms), edges: Object.keys(S.monitor.edges), phases: Object.keys(S.monitor.phases).filter(k => k.indexOf('>') < 0), phaseEdges: Object.keys(S.monitor.phases).filter(k => k.indexOf('>') > 0), hs: [], opts: [], deduce: [], realize: {}, cross: {}, ends: {}, unheld: 0 };
  fin.cov.forEach(c => { cov.hs.push(...Object.keys(c.hs || {})); cov.opts.push(...Object.keys(c.opts || {})); cov.deduce.push(...Object.keys(c.deduce || {})); Object.entries(c.realize || {}).forEach(([k, v]) => { cov.realize[k] = (cov.realize[k] || 0) + v; }); Object.entries(c.cross || {}).forEach(([k, v]) => { cov.cross[k] = (cov.cross[k] || 0) + v; }); Object.entries(c.ends || {}).forEach(([k, v]) => { cov.ends[k] = (cov.ends[k] || 0) + v; }); cov.unheld += c.unheld || 0; });
  ['hs', 'opts', 'deduce'].forEach(k => { cov[k] = Array.from(new Set(cov[k])); });
  const inv = S.monitor.invariant.slice();
  // mehrfach ausgelöste Erkenntnisse/Abschlüsse (Laden im Kategorie-D-Lauf setzt die Zeitlinie zurück, dort nicht gewertet)
  if (spec.cat !== 'D') { Object.entries(cov.realize).forEach(([k, v]) => { if (v > 1) inv.push('Erkenntnis mehrfach ausgelöst: ' + k + ' ×' + v); }); Object.entries(cov.ends).forEach(([k, v]) => { if (v > 1) inv.push('Kapitelende mehrfach: ' + k + ' ×' + v); }); }
  if (cov.unheld) inv.push('Testadapter: ' + cov.unheld + ' Verbindung(en) mit nicht vorhandenen Notizen');
  const allCh = res.chapters.length === 5 - spec.startCh && res.chapters.every(c => c.ok);
  const finalOk = allCh && res.chapters[res.chapters.length - 1].finalTitle && res.chapters[res.chapters.length - 1].finalTitle.mode === 'main';
  res.errors = errs.slice(0, 12); res.invariants = inv.slice(0, 20); res.failBag = failBag;
  res.lostItems = S.monitor.invChanges.filter(c => c[3].length).slice(0, 80);
  res.trace = fin.trace.length > 6000 ? fin.trace.slice(0, 3000).concat([['…gekürzt', fin.trace.length]]).concat(fin.trace.slice(-2000)) : fin.trace;
  res.steps = fin.trace.length; res.scriptSteps = step; res.wallMs = Date.now() - t0; res.vtimeMs = S.inner ? S.inner.vtime() : null;
  res.coverage = cov; res.phaseSeq = S.monitor.phaseSeq; res.roomSeqLen = S.monitor.roomSeq.length;
  res.sha = S.inner ? S.inner.sha12 : null;
  const perturbedFail = res.chapters.some(c => !c.ok && c.perturbed);
  res.illegalSwitch = (fin.illegal || []).slice(0, 10);
  if (res.illegalSwitch.length) { res.result = 'infra'; res.reason = 'Harness: Figurenwechsel, den die Oberfläche nicht zuließe (canSwitch=false): ' + JSON.stringify(res.illegalSwitch[0]); }
  else if (errs.length || inv.length || failBag.length) { res.result = 'fail'; res.reason = (errs[0] || inv[0] || failBag[0]).split('\n')[0]; }
  else if (finalOk) { res.result = 'pass'; res.endpoint = ENDPOINT; }
  else if (lastErr && /^LIMIT/.test(lastErr)) { res.result = 'undecided'; res.reason = lastErr; }
  else if (lastErr && /^EXC/.test(lastErr) && !/Zeitüberschreitung|Erwartung|Option nicht|Gedanke|kein Hotspot|kein Ausgang|Auswahl/.test(lastErr)) { res.result = 'infra'; res.reason = lastErr; }
  else if (perturbedFail) { res.result = 'undecided'; res.reason = 'Fortsetzung nach Störung gescheitert: ' + lastErr; }
  else { res.result = 'fail'; res.reason = 'Regulärer Pfad gescheitert: ' + lastErr; }
  res.endpointReached = finalOk ? ENDPOINT : null;
  // Sackgassen-Sonde: Bei „unentschieden“ (Skript fand nach der Störung nicht weiter) prüft eine begrenzte Suche mit regulären Spielerhandlungen
  // (zufällige Aktionen, bevorzugt die im Lösungsweg dieses Kapitels vorkommenden Hotspot-Aktionen, Notizkombinationen, Reisen), ob die
  // Geschichte von diesem Zustand aus noch vorankommt. Keine Flags, kein Teleport. Ergebnis: kein Softlock / Fortschritt möglich / Verdacht.
  if (res.result === 'undecided' && !opt.noProbe) { try { res.softlock = await probe(I, spec, canon, curCh, chStep); } catch (e) { res.softlock = { cls: 'Sonde gescheitert', err: String(e.message || e).slice(0, 200) }; } }
  if (opt.evidenceDir && res.result !== 'pass') { try { fs.mkdirSync(opt.evidenceDir, { recursive: true }); S.inner.page.screenshot({ path: path.join(opt.evidenceDir, spec.runId + '.png') }); fs.writeFileSync(path.join(opt.evidenceDir, spec.runId + '.state.json'), JSON.stringify(await S.inner.ev(() => JSON.parse(JSON.stringify(M.GS))))); fs.writeFileSync(path.join(opt.evidenceDir, spec.runId + '.storage.json'), JSON.stringify(S.inner.exportStorage())); } catch (e) {} }
  if (opt.onEnd) { try { await opt.onEnd(S.inner, res); } catch (e) { res.onEndErr = String(e.message || e); } }
  try { await S.inner.close2(); } catch (e) {}
  return res;
}

const PROBE_SNAP = function () { const G = M.GS; return { phase: G.phase, notes: (G.notes || []).slice(), inv: (G.inv || []).slice(), map: Object.keys(G.map || {}).filter(k => G.map[k]), ended: !!G.ended, screen: M.E.screen, room: M.E.room && M.E.room.id }; };
async function probe(I, spec, canon, stuckCh, stuckStep) { const X = require("./lib/explore");
  const t0 = Date.now(); const rnd = require('./vmdriver').mulberry32((spec.seed ^ 0x5eed) >>> 0); const rec = [];
  const s0 = await I.ev(PROBE_SNAP); if (s0.screen !== 'game') return { cls: 'kein Spielbildschirm', start: s0 };
  const ch = /^k4/.test(s0.phase) ? 4 : /^k3/.test(s0.phase) ? 3 : /^k2/.test(s0.phase) ? 2 : 1; const all = (canon && canon[ch]) || []; let can = (ch === stuckCh && stuckStep) ? all.filter(c => c.step >= stuckStep - 2 && c.step <= stuckStep + 15) : all; if (!can.length) can = all; can = can.slice().sort((a, b) => a.step - b.step);   // frühe Schritte bevorzugt (Gewicht rnd³)
  let best = null, n = 0; const MAX = 260, WALL = 120000; const tried = new Map();
  for (; n < MAX && Date.now() - t0 < WALL; n++) {
    const A = await I.ev(X.LIST_ACTIONS).catch(() => ({ none: true }));
    const HO = { dlgDepth: 6, solvePuzzles: true }, RW = { hint: 0, notes: 0.1, combine: 2.5, travel: 2 };
    const fits = (c) => c.kind === 'exit' ? A.acts.some(z => z[0] === 'exit' && z[1] === c.id) : (A.acts.some(z => z[0] === 'act' && z[1] === c.verb && z[2] === c.id) || (c.item && A.inv.indexOf(c.item) >= 0 && A.hsIds.indexOf(c.id) >= 0) || (c.verb === 'talk' && A.hsIds.indexOf(c.id) >= 0));
    const fresh = (c) => (tried.get(c) || 0) < 3;
    const avail = (c) => fresh(c) && c.room === A.room && c.active === A.active && fits(c);
    const u = rnd();
    if (!A.none && u < 0.45) { const ok = can.filter(avail);
      const other = !ok.length && A.acts.some(z => z[0] === 'switch') ? can.filter(c => fresh(c) && c.room === A.room && c.active !== A.active) : [];
      if (ok.length) { const c = ok[Math.floor(ok.length * Math.pow(rnd(), 3))]; tried.set(c, (tried.get(c) || 0) + 1);
        if (c.kind === 'exit') { rec.push(['canon-exit', c.id]); await I.ev((x) => M.TA.exit(x), c.id).catch(() => {}); }
        else { rec.push(['canon', c.verb, c.id, c.item]); await I.ev((x) => M.TA.act(x[0], x[1], x[2] || undefined), [c.verb, c.id, c.item]).catch(() => {}); }
        await I.page.waitForTimeout(60); await X.handleOpen(I, rnd, rec, HO).catch(() => {}); }
      else if (other.length) { rec.push(['canon-switch', other[0].active]); await I.ev(() => { if (M.E.canSwitch()) M.TA.switchTo(M.GS.active === 'marko' ? 'mala' : 'marko'); }); await I.page.waitForTimeout(200); await X.handleOpen(I, rnd, rec, HO).catch(() => {}); }
      else if (rnd() < 0.5) { const far = can.filter(c => c.active === A.active && c.room !== A.room); if (far.length) { const c = far[Math.floor(far.length * Math.pow(rnd(), 3))]; rec.push(['canon-goto', c.room]); await X.navigate(I, rnd, rec, c.room, 8).catch(() => {}); await X.handleOpen(I, rnd, rec, HO).catch(() => {}); } }
      else await X.randomAction(I, rnd, rec, RW).catch(() => {}); }
    else { await X.randomAction(I, rnd, rec, RW).catch(() => {}); await X.handleOpen(I, rnd, rec, HO).catch(() => {}); }
    const s = await I.ev(PROBE_SNAP).catch(() => null); if (!s) continue;
    const prog = { phase: s.phase !== s0.phase, end: s.ended || s.screen !== 'game', notes: s.notes.filter(x => s0.notes.indexOf(x) < 0), inv: s.inv.filter(x => s0.inv.indexOf(x) < 0), map: s.map.filter(x => s0.map.indexOf(x) < 0) };
    if (prog.phase || prog.end) { best = Object.assign(prog, { at: n + 1, phaseTo: s.phase }); break; }
    if (!best && (prog.notes.length || prog.inv.length || prog.map.length)) best = Object.assign(prog, { at: n + 1 });
  }
  const cls = best && (best.phase || best.end) ? 'kein Softlock (Phase/Kapitel geht weiter)' : best ? 'kein Softlock nachgewiesen bis Phasenwechsel, aber Fortschritt möglich' : 'Verdacht (kein Fortschritt in ' + n + ' Aktionen)';
  return { cls, start: { phase: s0.phase, room: s0.room }, progress: best, actions: n, wallMs: Date.now() - t0, rec: best ? rec.slice(-14) : rec.slice(0, 40).concat([['…']], rec.slice(-30)) };
}

// ---------------------------------------------------------------- kanonische Aktionsfolge (für verfrühte Versuche in C)
async function makeCanon(out) {
  const C = require('./lib/common'); const { Session } = require('./lib/session');
  const S = new Session({ seed: 1 }); let I = await S.open({}); await I.ev(() => { window.__QA_CHAINED = true; });
  const canon = {}; let ch = 1, st = 0;
  await C.tapTitle(I, CH_TITLE[1]); await C.tapTitle(I, 'Platz 1');
  for (ch = 1; ch <= 4; ch++) { st = 0; canon[ch] = []; const startLen = (I.M.__qaTrace || []).length;
    const hookTrace = async () => { st++; const T = I.M.__qaTrace; for (let i = hookTrace.last || startLen; i < T.length; i++) { const t = T[i]; if (t[1] === 'act') canon[ch].push({ step: st, kind: 'act', verb: t[2], id: t[3], item: t[4], room: t[5], active: t[6] }); else if (t[1] === 'exit') canon[ch].push({ step: st, kind: 'exit', id: t[2], room: t[3], active: t[4] }); } hookTrace.last = T.length; };
    const fn = C.loadPath(CH_PATH[ch]); void fn;
    const r = await C.runPath(CH_PATH[ch], S.D, {}, null, { afterStep: hookTrace }); if (!r.ok) throw new Error("Kanon K" + ch + ": " + r.err);   // QA-Korrektur: Schrittzähler je Skriptschritt (vorher alle Einträge Schritt 1)
    await hookTrace(); await C.waitTitleNext(I); if (ch < 4) await C.tapTitle(I, 'Weiter mit Kapitel ' + (ch + 1)); }
  fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'canon.json'), JSON.stringify(canon));
  console.log('canon', Object.keys(canon).map(k => k + ':' + canon[k].length).join(' '));
}

// ---------------------------------------------------------------- Kindprozess
if (process.env.MALA_SIM_CHILD) {
  const HARNESS = require('crypto').createHash('sha1').update(['sim.js', 'vmdriver.js', 'lib/session.js', 'lib/explore.js', 'lib/common.js', 'paths/walkthrough.js', 'paths/walkthrough2.js', 'paths/walkthrough3.js', 'paths/walkthrough4.js'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n')).digest('hex').slice(0, 10);
  let canon = null; try { canon = JSON.parse(fs.readFileSync(process.env.MALA_CANON, 'utf8')); } catch (e) {}
  process.on('message', async (m) => { if (m.quit) process.exit(0);
    let r; try { r = await runOne(m.spec, { canon, evidenceDir: m.evidenceDir, render: m.render }); } catch (e) { r = { runId: m.spec.runId, cat: m.spec.cat, seed: m.spec.seed, result: 'infra', reason: 'Harness: ' + (e.stack || e).toString().split('\n').slice(0, 4).join(' | ') }; }
    r.harness = HARNESS; process.send({ res: r }); });
  process.send({ ready: true });
  return;
}

// ---------------------------------------------------------------- Hauptprozess: Planen, Verteilen, Protokollieren
async function main() {
  const out = path.resolve(arg('--out', path.join(ROOT, 'qa', 'results', 'run-' + Date.now())));
  if (has('--canon')) { await makeCanon(out); return; }
  fs.mkdirSync(out, { recursive: true });
  const salt = arg('--salt', 'mala');
  let specs = [];
  if (has('--replay')) { const id = arg('--replay'); const line = fs.readFileSync(arg('--from'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).find(x => x.runId === id); if (!line) throw new Error('Lauf nicht gefunden'); const cat = id.split('-')[0], n = +id.split('-')[1]; specs = [makeSpec(cat, n, line.salt || salt)]; }
  else { const plan = has('--plan') ? PLAN_FULL : { [arg('--cat', 'A')]: +arg('--count', 10) }; const off = +arg('--offset', 0);
    Object.entries(plan).forEach(([cat, n]) => { for (let i = 0; i < n; i++) specs.push(makeSpec(cat, i + off, salt)); }); }
  if (has('--only')) { const set = new Set(arg('--only').split(',')); specs = specs.filter(s => set.has(s.runId)); }
  const html = require('./vmdriver').loadScript(); const sha = html.sha12;
  const meta = { started: new Date().toISOString(), sha256: html.sha, html: path.relative(ROOT, html.htmlPath), planned: specs.length, plan: specs.reduce((o, s) => { o[s.cat] = (o[s.cat] || 0) + 1; return o; }, {}), salt, node: process.version, workers: 0, endpoint: ENDPOINT };
  const W = +arg('--workers', Math.max(1, Math.min(4, os.cpus().length)));
  meta.workers = W; fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 1));
  const jsonl = fs.createWriteStream(path.join(out, 'runs.jsonl'), { flags: has('--append') ? 'a' : 'w' });
  const canonPath = arg('--canon-file', path.join(ROOT, 'qa', 'results', 'canon', 'canon.json'));
  let next = 0, done = 0, started = 0; const counts = {}; const t0 = Date.now();
  // Specs abwechselnd nach Kategorie mischen, damit Teilergebnisse alle Kategorien enthalten
  specs.sort((a, b) => (+a.runId.split('-')[1] - +b.runId.split('-')[1]) || a.cat.localeCompare(b.cat));
  await new Promise((resolve) => {
    let alive = 0;
    const spawn = () => { const c = cp.fork(__filename, [], { env: Object.assign({}, process.env, { MALA_SIM_CHILD: '1', MALA_CANON: canonPath }), execArgv: ['--max-old-space-size=2048'] }); alive++;
      let cur = null, runs = 0;   // Kindprozess nach 25 Läufen durch einen neuen ersetzen (Speicher)
      const feed = () => { if (next >= specs.length || runs++ >= 25) { c.send({ quit: true }); return; } cur = specs[next++]; started++; c.send({ spec: cur, evidenceDir: path.join(out, 'evidence'), render: arg('--render') }); };
      c.on('message', (m) => { if (m.ready) return feed(); if (m.res) { m.res.salt = salt; m.res.shaFile = sha; jsonl.write(JSON.stringify(m.res) + '\n'); done++; counts[m.res.result] = (counts[m.res.result] || 0) + 1; cur = null;
        if (done % 10 === 0 || done === specs.length) { const el = (Date.now() - t0) / 1000; process.stdout.write(`[${el.toFixed(0)}s] ${done}/${specs.length} ${JSON.stringify(counts)} ~${((specs.length - done) * el / done / 60).toFixed(0)} min übrig\n`); fs.writeFileSync(path.join(out, 'progress.json'), JSON.stringify({ done, planned: specs.length, started, counts, elapsedS: el })); }
        feed(); } });
      c.on('exit', (code) => { alive--; if (cur) { jsonl.write(JSON.stringify({ runId: cur.runId, cat: cur.cat, seed: cur.seed, result: 'infra', reason: 'Kindprozess beendet (' + code + ')', salt, shaFile: sha }) + '\n'); done++; counts.infra = (counts.infra || 0) + 1; cur = null; }
        if (next < specs.length) spawn();
        if (alive === 0) resolve(); }); };
    for (let i = 0; i < Math.min(W, specs.length); i++) spawn();
  });
  await new Promise(r => jsonl.end(r));
  meta.finished = new Date().toISOString(); meta.started_runs = started; meta.completed = done; meta.counts = counts; fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 1));
  console.log('FERTIG', out, JSON.stringify(counts));
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { makeSpec, runOne };
