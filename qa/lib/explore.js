// Zufallserkundung, Belastung und Navigation – ausschließlich über reguläre Spieleraktionen (M.TA wie Tippen auf Hotspots,
// Ausgänge, Inventar, Stadtplan, Figurenwechsel, Notizbuch). Kein Setzen von Schaltern, kein Teleport, keine Gegenstände.
'use strict';
const { mulberry32 } = require('../vmdriver');

// im Spiel: Aktionen, die ein Spieler jetzt sehen kann (entspricht hsOpts/itemOpts der Oberfläche)
const LIST_ACTIONS = function () {
  const E = M.E, G = M.GS, R = E.room; if (!R || E.screen !== 'game') return { none: true };
  const isG = G.active === 'mala', S = M.RS(R.id), out = [];
  // antippbar wie in der Oberfläche: E.hotspotAt muss den Hotspot an mindestens einem Punkt liefern (sichtbar, beleuchtet, nicht ganz überdeckt)
  const tapC = {}; const tappable = (h) => { if (tapC[h.id] !== undefined) return tapC[h.id]; let ok = false; try { const r = E.hsRect(h); if (r) { for (let y = Math.max(0, r[1]); y < Math.min(144, r[1] + r[3]) && !ok; y += 3) for (let x = r[0]; x < r[0] + r[2] && !ok; x += 3) if (E.hotspotAt(x, y) === h) ok = true;
      if (!ok) for (let y = Math.max(0, r[1]); y < Math.min(144, r[1] + r[3]) && !ok; y++) for (let x = r[0]; x < r[0] + r[2] && !ok; x++) if (E.hotspotAt(x, y) === h) ok = true; } } catch (e) { ok = true; } return (tapC[h.id] = ok); };
  const vis = (h) => { try { if (h.vis && !h.vis(S, G)) return false; } catch (e) { return false; } if (h.who === 'm' && isG) return false; if (h.who === 'g' && !isG) return false; if (h.npc) { const a = E.ACT && E.ACT[h.npc]; if (!a || a.visible === false) return false; } return tappable(h); };
  R.hotspots.forEach(h => { if (!vis(h)) return; let ex = null; try { ex = isG ? (h.gexit || (h.exit && (h.exit.gok || (M.malaFree && M.malaFree(G, h))) ? h.exit : null)) : h.exit; if (typeof ex === 'function') ex = ex(S, G); } catch (e) { ex = null; }
    if (ex || (isG && h.gexit)) out.push(['exit', h.id]);
    if (R.noVerbs) return;
    if (isG) { const gv = h.g || {}; ['talk', 'sense', 'listen', 'cross'].forEach(v => { if (gv[v] === undefined) return; if (v === 'cross' && gv.crossIf) { let ok = false; try { ok = !!gv.crossIf(S, G); } catch (e) {} if (!ok) return; } out.push(['act', v, h.id]); }); /* wie hsOpts der Oberfläche: „Hinüberbringen“ nur, wenn crossIf gilt */ if (h.npc && !gv.talk && E.ACT[h.npc] && E.ACT[h.npc].ghost) out.push(['act', 'talk', h.id]); }
    else { ['talk', 'take', 'open', 'use', 'push', 'read'].forEach(v => { if (h[v] !== undefined) out.push(['act', v, h.id]); }); if (h.npc && h.talk === undefined) out.push(['act', 'talk', h.id]); }
    out.push(['act', 'look', h.id]); });
  const inv = (G.inv || []).slice();
  if (!isG && !R.noVerbs) { inv.forEach(id => { const it = M.ITEMS[id]; out.push(['item', 'look', id]); ['read', 'open', 'use2'].forEach(v => { if (it[v] !== undefined) out.push(['item', v, id]); }); }); }
  if (G.malaOn && G.pos.mala.room === R.id && !isG) { out.push(['act', 'talk', '_mala']); }   // nur Marko kann Mala ansprechen (hsOpts: MALA_HS)
  if (E.canSwitch && E.canSwitch()) out.push(['switch', isG ? 'marko' : 'mala']);
  let L = []; try { L = M.mapLocs(G).filter(l => G.map && G.map[l.id]).map(l => l.id); } catch (e) {}
  const nb = E.nbOpen ? E.nbOpen(false) : [];
  const hsIds = R.hotspots.filter(vis).filter(h => !h.exit).map(h => h.id);
  return { room: R.id, active: G.active, acts: out, inv: isG ? [] : inv, hsIds, locs: L, notes: nb, malaHere: !isG && G.malaOn && G.pos.mala.room === R.id };
};

// alle offenen Auswahlen/Overlays zufällig, aber regulär behandeln; liefert Zahl der Schritte
async function handleOpen(I, rnd, rec, opts = {}) {
  let n = 0, inDlg = 0;
  for (let guard = 0; guard < (opts.maxDlg || 40); guard++) {
    const s = await I.settle(opts.settleMs || 60000);
    if (s.dlg) {
      const o = await I.ev(() => M.E.dlg.opts.map(x => ({ t: x.t, bye: !!x.bye })));
      inDlg++;
      let k;
      const byeIdx = o.map((x, i) => (x.bye || /^\((Gehen|Doch nichts|Nicht mehr|Warten)|^(Danke|Auf Wiedersehen|Bis |Servus|Später|Ich gehe|Gute Nacht)/.test(x.t)) ? i : -1).filter(i => i >= 0);
      if (inDlg > (opts.dlgDepth || 8) && byeIdx.length) k = byeIdx[0];
      else { const cand = o.map((x, i) => i).filter(i => !/nicht weiter/.test(o[i].t) || rnd() < 0.15); k = cand[Math.floor(rnd() * cand.length)]; if (k === undefined) k = 0; }
      if (opts.preferChoice) { const pk = opts.preferChoice(o.map(x => x.t)); if (pk >= 0) k = pk; }
      rec.push(['choose', o[k].t]); await I.ev((x) => M.E.chooseDone(x), k); await I.page.waitForTimeout(60); n++; continue;
    }
    if (s.overlay) {
      const kind = s.overlay;
      if (kind === 'puzzle' && opts.solvePuzzles) { await solvePuzzleUI(I, rnd, rec); n++; continue; }
      if (kind === 'arrange' && opts.solvePuzzles) { await solveArrangeUI(I, rnd, rec); n++; continue; }
      if (kind === 'notebook') { const L = await I.ev(() => { const d = M.E.overlay.data || {}; return d.mode === 'ask' ? M.E.nbOpen(true, d.also) : []; }); /* nur im Fragemodus wird gewählt; dieselbe Liste wie in der Oberfläche */ const pref = (L.length && opts.preferNote) ? opts.preferNote(L) : null; if (L.length && (pref || rnd() < 0.7)) { const id = pref || L[Math.floor(rnd() * L.length)]; rec.push(['note', id]); try { await I.ev((x) => M.TA.pickNote(x), id); } catch (e) { rec.push(['note-EXC', String(e.message).slice(0, 100)]); await I.ev(() => { if (M.E.overlay) M.TA.closeOverlay(null); }); } } else { rec.push(['close', kind]); await I.ev(() => M.TA.closeOverlay(null)); } }
      else if (kind === 'map') { rec.push(['close', 'map']); await I.ev(() => M.closeMap ? M.closeMap() : M.TA.closeOverlay(null)); }
      else { rec.push(['close', kind]); await I.ev(() => M.TA.closeOverlay(null)); }
      await I.page.waitForTimeout(60); n++; continue;
    }
    return n;
  }
  return n;
}

function pick(rnd, a) { return a[Math.floor(rnd() * a.length)]; }

// eine zufällige reguläre Aktion ausführen
async function randomAction(I, rnd, rec, weights = {}) {
  const A = await I.ev(LIST_ACTIONS); if (A.none) { await I.page.waitForTimeout(200); return 'none'; }
  const W = Object.assign({ hs: 6, exit: 2, item: 1.5, useOn: 2, mala: 0.6, switch: 1.2, travel: 1.2, combine: 1, wait: 0.3, hint: 0.15, notes: 0.3 }, weights);
  const kinds = []; const add = (k, ok) => { if (ok && W[k] > 0) kinds.push([k, W[k]]); };
  const acts = A.acts.filter(a => a[0] === 'act' && a[2] !== '_mala'), exits = A.acts.filter(a => a[0] === 'exit'), items = A.acts.filter(a => a[0] === 'item');
  add('hs', acts.length); add('exit', exits.length); add('item', items.length); add('useOn', A.inv.length && A.hsIds.length); add('mala', A.malaHere); add('switch', A.acts.some(a => a[0] === 'switch'));
  add('travel', A.locs.length); add('combine', A.notes.length >= 2); add('wait', true); add('hint', true); add('notes', true);
  const tot = kinds.reduce((s, k) => s + k[1], 0); let r = rnd() * tot, kind = kinds[0][0]; for (const k of kinds) { if ((r -= k[1]) <= 0) { kind = k[0]; break; } }
  let label;
  try {
    switch (kind) {
      case 'hs': { const a = pick(rnd, acts); label = ['act', a[1], a[2], A.room]; await I.ev((x) => M.TA.act(x[0], x[1]), [a[1], a[2]]); break; }
      case 'exit': { const a = pick(rnd, exits); label = ['exit', a[1], A.room]; await I.ev((x) => M.TA.exit(x), a[1]); break; }
      case 'item': { const a = pick(rnd, items); label = ['item', a[1], a[2]]; await I.ev((x) => M.TA.item(x[0], x[1]), [a[1], a[2]]); break; }
      case 'useOn': { const it = pick(rnd, A.inv), h = rnd() < 0.15 && A.inv.length > 1 ? null : pick(rnd, A.hsIds);
        if (h) { label = ['use', h, it, A.room]; await I.ev((x) => M.TA.act('use', x[0], x[1]), [h, it]); } else { const o = pick(rnd, A.inv.filter(x => x !== it)); label = ['itemitem', it, o]; await I.ev((x) => M.TA.item('use', x[0], x[1]), [it, o]); } break; }
      case 'mala': { if (rnd() < 0.5 && A.inv.length) { const it = pick(rnd, A.inv); label = ['use', '_mala', it]; await I.ev((x) => M.TA.act('use', '_mala', x), it); } else { label = ['act', 'talk', '_mala']; await I.ev(() => M.TA.act('talk', '_mala')); } break; }
      case 'switch': { label = ['switch']; await I.ev(() => { if (M.E.canSwitch()) M.TA.switchTo(M.GS.active === 'marko' ? 'mala' : 'marko'); }); break; }
      case 'travel': { const l = pick(rnd, A.locs); label = ['travel', l, A.room]; await I.ev((x) => M.TA.travel(x), l); break; }
      case 'combine': { const a = pick(rnd, A.notes); let b = pick(rnd, A.notes); if (b === a) b = A.notes[(A.notes.indexOf(a) + 1) % A.notes.length]; label = ['combine', a, b]; await I.ev((x) => M.TA.combine(x[0], x[1]), [a, b]); break; }
      case 'wait': { label = ['wait']; await I.page.waitForTimeout(400 + Math.floor(rnd() * 1600)); break; }
      case 'hint': { label = ['hint']; await I.ev(() => { if (M.showHints && !M.E.busy) M.showHints('menu'); }); break; }
      case 'notes': { label = ['notebook']; await I.ev(() => { if (!M.E.busy) M.E.openNotes(); }); break; }
    }
  } catch (e) { label = (label || [kind]).concat(['EXC ' + String(e.message || e).slice(0, 120)]); }
  rec.push(label); await I.page.waitForTimeout(60);
  await handleOpen(I, rnd, rec);
  return kind;
}

// Belastung: über den EINGABEWEG der Oberfläche (M.pointerDown/Up auf Bildschirmpunkte wie ein Finger, M.key wie eine Tastatur).
// Kein Doppelaufruf der Test-API: die Oberfläche sperrt Tipps während Szenen (E.busy), das muss mitgeprüft werden, nicht umgangen.
// Ein Bild entspricht 400 ms Spielzeit (TURBO 25); Tipps im selben Bild liegen innerhalb der Doppeltipp-Zeit (350 ms), Tipps ein Bild später nicht.
const UI_TAP = function (a) { const t = a.t; const x = a.x, y = a.y; M.pointerDown(x, y, true); M.pointerUp(x, y, true); return M.E.pop ? M.E.pop.opts.map(o => o.t) : null; };
const UI_HSPT = function (id) { const E = M.E, R = E.room; if (!R) return null; const h = R.byId[id]; if (!h) return null; const r = E.hsRect(h); if (!r) return null; const cam = Math.round(E.camX);
  for (let yy = r[1] + 1; yy < r[1] + r[3]; yy += 2) for (let xx = r[0] + 1; xx < r[0] + r[2]; xx += 2) { if (yy < 0 || yy >= 144) continue; const sx = xx - cam; if (sx < 0 || sx >= 320) continue; if (E.hotspotAt(xx, yy) === h) return { x: sx, y: yy }; } return null; };
const UI_CODE = function (code) { for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 2) if (M.uiHit(x, y) === code) return { x, y }; return null; };
async function tapPt(I, p) { if (!p) return null; return I.ev(UI_TAP, p); }
async function tapHsUI(I, id) { const p = await I.ev(UI_HSPT, id); if (!p) return 'nicht im Bild'; const pop = await tapPt(I, p); return pop; }
async function tapCodeUI(I, code) { await I.ev(() => M.renderFrame()); const p = await I.ev(UI_CODE, code); if (!p) return false; await tapPt(I, p); return true; }
async function pickPopUI(I, rnd) { const o = await I.ev(() => (M.E.pop ? M.E.pop.opts.map(x => x.t) : null)); if (!o) return null; const k = Math.floor(rnd() * o.length); await I.ev(() => M.renderFrame()); const p = await I.ev(UI_CODE, 'p:' + k); if (p) await tapPt(I, p); return o[k]; }
async function stressBurst(I, rnd, rec) {
  const A = await I.ev(LIST_ACTIONS); if (A.none) return 0;
  const exits = A.acts.filter(a => a[0] === 'exit').map(a => a[1]), hs = Array.from(new Set(A.acts.filter(a => a[0] === 'act' && a[2] !== '_mala').map(a => a[2])));
  const kind = pick(rnd, ['dblExit', 'tripleExit', 'switchWhileWalk', 'repeatTap', 'badCombo', 'mapSpam', 'switchSpam', 'tapDuringSpeech', 'keySpam', 'tapDuringTransition']);
  const lab = ['stress', kind]; const w = (n) => I.page.waitForTimeout(16 * n);
  try {
    switch (kind) {
      case 'dblExit': if (exits.length) { const e = pick(rnd, exits); lab.push(e); const p = await I.ev(UI_HSPT, e); lab.push(p ? 'tippen' : 'nicht im Bild'); if (p) { await tapPt(I, p); await tapPt(I, p); } } break;   // zwei Tipps im selben Bild = Doppeltipp
      case 'tripleExit': if (exits.length) { const e = pick(rnd, exits); lab.push(e); const p = await I.ev(UI_HSPT, e); if (p) { await tapPt(I, p); await w(1); await tapPt(I, p); await w(1 + Math.floor(rnd() * 3)); await tapPt(I, p); } } break;
      case 'switchWhileWalk': if (exits.length) { const e = pick(rnd, exits); lab.push(e); const p = await I.ev(UI_HSPT, e); if (p) { await tapPt(I, p); await w(1 + Math.floor(rnd() * 3)); lab.push('sw:' + await tapCodeUI(I, 'sw')); } } break;
      case 'repeatTap': if (hs.length) { const h = pick(rnd, hs); lab.push(h); const n = 2 + Math.floor(rnd() * 4); for (let i = 0; i < n; i++) { const pop = await tapHsUI(I, h); if (Array.isArray(pop)) lab.push('→' + await pickPopUI(I, rnd)); await w(Math.floor(rnd() * 3)); } } break;
      case 'badCombo': if (A.inv.length >= 1) { const it = pick(rnd, A.inv); const tgt = rnd() < 0.6 && A.hsIds.length ? pick(rnd, A.hsIds) : null; lab.push(it, tgt);
        const ok = await I.ev(() => !M.E.busy && !M.E.dlg && !M.E.overlay); if (ok) { if (tgt) await I.ev((x) => M.TA.act('use', x[1], x[0]), [it, tgt]); else if (A.inv.length > 1) await I.ev((x) => M.TA.item('use', x, M.GS.inv.find(y => y !== x)), it); } } break;   // ein einzelner, regulärer Bedienschritt im Ruhezustand
      case 'mapSpam': { lab.push('map:' + await tapCodeUI(I, 'map')); await w(1); if (A.locs.length) { const l1 = pick(rnd, A.locs), l2 = pick(rnd, A.locs); lab.push(l1, l2); await tapCodeUI(I, 'o:' + l1); await tapCodeUI(I, 'o:' + l2); } break; }
      case 'switchSpam': { const n = 3 + Math.floor(rnd() * 5); lab.push(n); for (let i = 0; i < n; i++) { await tapCodeUI(I, 'sw'); await w(Math.floor(rnd() * 3)); } break; }
      case 'tapDuringSpeech': if (hs.length) { const a1 = pick(rnd, hs), a2 = pick(rnd, hs); lab.push(a1, a2); const pop = await tapHsUI(I, a1); if (Array.isArray(pop)) lab.push('→' + await pickPopUI(I, rnd)); await w(3); await tapHsUI(I, a2); await tapPt(I, { x: 160, y: 60 }); await I.ev(() => M.key(' ')); } break;
      case 'keySpam': { const keys = ['Escape', 'k', 'n', 'Tab', 'm', 'z', ' ', 'Escape', 'k', 'Escape']; const n = 4 + Math.floor(rnd() * 6); const seq = []; for (let i = 0; i < n; i++) seq.push(pick(rnd, keys)); lab.push(seq.join(',')); for (const k of seq) { await I.ev((x) => M.key(x), k); await w(Math.floor(rnd() * 2)); } await I.ev(() => { if (M.E.menu) M.key('Escape'); }); break; }
      case 'tapDuringTransition': if (exits.length && hs.length) { const e = pick(rnd, exits), h = pick(rnd, hs); lab.push(e, h); const p = await I.ev(UI_HSPT, e), q = await I.ev(UI_HSPT, h); if (p) { await tapPt(I, p); await tapPt(I, p); for (let i = 0; i < 4; i++) { await w(1); if (q) await tapPt(I, q); } } } break;
    }
  } catch (e) { lab.push('EXC ' + String(e.message || e).slice(0, 120)); }
  rec.push(lab);
  await handleOpen(I, rnd, rec);
  return 1;
}

// Navigation zu einem Raum (und zur gespielten Figur) über Ausgänge und den Stadtplan
const PLAN = function (target) {
  const G = M.GS, cur = M.E.room && M.E.room.id; if (!cur) return null; if (cur === target) return { done: true };
  const exitsOf = (rid, live) => { const R = M.ROOMS[rid]; if (!R) return []; const S = M.RS(rid), out = [];
    R.hotspots.forEach(h => { try { if (h.who === 'g') return; if (live && h.vis && !h.vis(S, G)) return; let ex = h.exit; if (typeof ex === 'function') { if (!live) return; ex = ex(S, G); } if (ex && ex.to) out.push([h.id, ex.to]); } catch (e) {} }); return out; };
  const bfs = (from, goal) => { const prev = {}, q = [from]; prev[from] = null; while (q.length) { const r = q.shift(); if (goal(r)) { const path = []; let x = r; while (prev[x]) { path.unshift(prev[x]); x = prev[x][2]; } return path; }
      exitsOf(r, r === from).forEach(([id, to]) => { if (to === 'map' || prev[to] !== undefined || !M.ROOMS[to]) return; prev[to] = [id, to, r]; q.push(to); }); } return null; };
  const direct = bfs(cur, r => r === target); if (direct && direct.length) return { exit: direct[0][0] };
  const loc = M.mapStreetOf(target, G); const street = M.mapExit(M.ROOMS[cur], G);
  if (loc && street && G.map && G.map[loc.id]) return { travel: loc.id };
  const toStreet = bfs(cur, r => !!M.mapExit(M.ROOMS[r], G)); if (toStreet && toStreet.length) return { exit: toStreet[0][0] };
  return null;
};
async function navigate(I, rnd, rec, target, budget = 14) {
  for (let i = 0; i < budget; i++) {
    await handleOpen(I, rnd, rec, { dlgDepth: 0 });
    const p = await I.ev(PLAN, target); if (!p) return false; if (p.done) return true;
    /* Wege plant PLAN über Markos Ausgänge: ist Mala aktiv, erst (wie über das Porträt) zu Marko wechseln, sofern erlaubt */
    if (await I.ev(() => M.GS.active === 'mala' && M.E.canSwitch())) { rec.push(['nav-switch', 'marko']); await I.ev(() => M.TA.switchTo('marko')); await I.page.waitForTimeout(100); continue; }
    if (p.exit) { rec.push(['nav-exit', p.exit]); await I.ev((x) => M.TA.exit(x), p.exit); }
    else if (p.travel) { rec.push(['nav-travel', p.travel]); await I.ev((x) => M.TA.travel(x), p.travel); }
    await I.page.waitForTimeout(60);
  }
  await handleOpen(I, rnd, rec, { dlgDepth: 0 });
  return (await I.ev(() => M.E.room && M.E.room.id)) === target;
}
// Ankerpunkt (vor einer Störung) und Rückkehr dorthin
async function anchor(I) { return I.ev(() => ({ room: M.E.room && M.E.room.id, active: M.GS.active, mala: M.GS.pos.mala.room, malaOn: M.GS.malaOn, phase: M.GS.phase })); }
async function returnTo(I, rnd, rec, a) {
  await handleOpen(I, rnd, rec, { dlgDepth: 0 });
  let s = await I.st(); if (s.active !== 'marko' && await I.ev(() => M.E.canSwitch())) { rec.push(['nav-switch', 'marko']); await I.ev(() => M.TA.switchTo('marko')); await I.page.waitForTimeout(100); await handleOpen(I, rnd, rec, { dlgDepth: 0 }); }
  // Marko zum Raum, in dem der Anker gespielt wurde (Anker mit Mala: Markos Raum zum Ankerzeitpunkt ist unbekannt → Malas Raum)
  const target = a.active === 'marko' ? a.room : a.room;
  let ok = await navigate(I, rnd, rec, target);
  // Mala zurück an ihren Ankerplatz (Kapitel 4: sie bleibt, wo sie ist, wenn Marko geht)
  const m = await I.ev(() => ({ on: M.GS.malaOn, room: M.GS.pos.mala.room, can: M.E.canSwitch() }));
  if (a.malaOn && m.on && m.room !== a.mala && m.can) { rec.push(['nav-switch', 'mala']); await I.ev(() => M.TA.switchTo('mala')); await I.page.waitForTimeout(100); await navigate(I, rnd, rec, a.mala); if (await I.ev(() => M.E.canSwitch())) { rec.push(['nav-switch', 'marko']); await I.ev(() => M.TA.switchTo('marko')); } await I.page.waitForTimeout(100); }
  if (a.active === 'mala' && await I.ev(() => M.GS.active !== 'mala' && M.E.canSwitch())) { rec.push(['nav-switch', 'mala']); await I.ev(() => M.TA.switchTo('mala')); await I.page.waitForTimeout(100); }
  await handleOpen(I, rnd, rec, { dlgDepth: 0 });
  const end = await anchor(I);
  return { ok: ok && end.room === a.room && end.active === a.active, end };
}

module.exports = { LIST_ACTIONS, handleOpen, randomAction, stressBurst, navigate, anchor, returnTo, mulberry32 };

// Rätsel-Overlay „puzzle“ wie ein Spieler über die sichtbaren Bedienelemente lösen: „Vorlesen“ tippen, die Rückmeldung zeigt die falsche Zeile,
// diese Zeile weiterschalten (Tipp auf die Zeile). Ohne Zeilenhinweis wird eine zufällige Zeile weitergeschaltet. Nur für die Sackgassen-Sonde.
async function solvePuzzleUI(I, rnd, rec, maxTries = 80) {
  for (let k = 0; k < maxTries; k++) {
    const st = await I.ev(() => { const ov = M.E.overlay; if (!ov || ov.kind !== 'puzzle') return null; M.renderFrame(); return { bad: ov.bad, rows: ov.data.slots.length }; });
    if (!st) { rec.push(['puzzle-solved', k]); return true; }
    let code = 'zgo'; if (k > 0) { const b = st.bad; code = b >= 0 ? 'z:' + b : (rnd() < 0.5 ? 'zgo' : 'z:' + Math.floor(rnd() * st.rows)); }
    const p = await I.ev((c) => { for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 2) if (M.uiHit(x, y) === c) return { x, y }; return null; }, code);
    if (!p) { rec.push(['puzzle-noctl', code]); return false; }
    await I.ev((q) => { M.pointerDown(q.x, q.y, true); M.pointerUp(q.x, q.y, true); }, p); await I.page.waitForTimeout(120);
    if (code !== 'zgo') { const p2 = await I.ev(() => { for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 2) if (M.uiHit(x, y) === 'zgo') return { x, y }; return null; }); if (p2) { await I.ev((q) => { M.pointerDown(q.x, q.y, true); M.pointerUp(q.x, q.y, true); }, p2); await I.page.waitForTimeout(120); } }
  }
  rec.push(['puzzle-gaveup']); return false;
}
module.exports.solvePuzzleUI = solvePuzzleUI;

// Rätsel-Overlay „arrange“ (Reihenfolge) wie ein Spieler: „Ordnen“ tippen; die Rückmeldung markiert die erste falsche Zeile; diese Zeile
// antippen und mit einer späteren Zeile tauschen (zwei Tipps). Nur sichtbare Bedienelemente (M.uiHit-Codes o:go, o:rN).
async function solveArrangeUI(I, rnd, rec, maxTries = 200) {
  const find = (c) => I.ev((code) => { M.renderFrame(); for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 2) if (M.uiHit(x, y) === code) return { x, y }; return null; }, c);
  const tap = (q) => I.ev((p) => { M.pointerDown(p.x, p.y, true); M.pointerUp(p.x, p.y, true); }, q);
  for (let k = 0; k < maxTries; k++) {
    const st = await I.ev(() => { const ov = M.E.overlay; if (!ov || ov.kind !== 'arrange') return null; return { bad: ov.bad, n: (ov.ord || ov.data.start).length, pick: ov.pick }; });
    if (!st) { rec.push(['arrange-solved', k]); return true; }
    if (st.bad === undefined || st.bad === null || st.bad < 0 || k === 0) { const g = await find('o:go'); if (!g) { rec.push(['arrange-noctl']); return false; } await tap(g); await I.page.waitForTimeout(120); continue; }
    const j = st.bad + 1 + Math.floor(rnd() * Math.max(1, st.n - st.bad - 1)); const a = await find('o:r' + st.bad), b = await find('o:r' + Math.min(st.n - 1, j));
    if (!a || !b) { rec.push(['arrange-noctl']); return false; } await tap(a); await I.page.waitForTimeout(60); await tap(b); await I.page.waitForTimeout(60);
    const g = await find('o:go'); if (g) { await tap(g); await I.page.waitForTimeout(120); }
  }
  rec.push(['arrange-gaveup']); return false;
}
module.exports.solveArrangeUI = solveArrangeUI;
