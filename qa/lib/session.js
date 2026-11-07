// Sitzung = ein Simulationslauf. Kapselt den VM-Treiber hinter einem austauschbaren Proxy (für "Laden in einem frischen
// Kontext" mitten in einem Pfadskript), zeichnet jede Spieleraktion auf M.TA-Ebene auf, sammelt Abdeckung und prüft Invarianten.
'use strict';
const vmd = require('../vmdriver');

const TRACE_INSTALL = function () {
  if (M.__qaInstalled) return; M.__qaInstalled = true;
  const T = M.__qaTrace = []; const now = () => M.E.gt();
  const cov = M.__qaCov = { hs: {}, opts: {}, deduce: {}, realize: {}, cross: {}, ends: {}, overlays: {}, rejected: 0, speech: 0 };
  const wrap = (obj, name, kind, fmt) => { const f = obj[name]; if (typeof f !== 'function' || f.__qa) return; const g = function () { try { T.push([now(), kind].concat(fmt ? fmt.apply(null, arguments) : [].slice.call(arguments))); } catch (e) {} return f.apply(this, arguments); }; g.__qa = true; obj[name] = g; };
  const room = () => (M.E.room ? M.E.room.id : null);
  wrap(M.TA, 'act', 'act', (v, id, it) => { cov.hs[room() + '.' + id + '.' + v + (it ? '+' + it : '') + (M.GS.active === 'mala' ? '@g' : '')] = 1; return [v, id, it || null, room(), M.GS.active]; });
  wrap(M.TA, 'exit', 'exit', (id) => { cov.hs[room() + '.' + id + '.exit' + (M.GS.active === 'mala' ? '@g' : '')] = 1; return [id, room(), M.GS.active]; });
  wrap(M.TA, 'item', 'item', (v, a, b) => [v, a, b || null]);
  wrap(M.TA, 'switchTo', 'switch', (w) => { let legal = true; try { legal = M.GS.active === w || M.E.canSwitch(); } catch (e) {} if (!legal) { (M.__qaIllegal = M.__qaIllegal || []).push([now(), 'switch', w, room(), M.GS.phase]); } return [w, legal ? 1 : 'UNERLAUBT']; });   // Figurenwechsel, den die Oberfläche nicht zuließe (canSwitch)
  wrap(M.TA, 'travel', 'travel', (l) => [l, room()]);
  wrap(M.TA, 'closeOverlay', 'close', (v) => [M.E.overlay ? M.E.overlay.kind : null]);
  wrap(M.TA, 'pickNote', 'note', (id) => [id]);
  const cn = M.TA.combine; M.TA.combine = function (a, b) { let vis = null; try { const L = M.E.nbOpen ? M.E.nbOpen(false) : null; vis = L ? (L.indexOf(a) >= 0 && L.indexOf(b) >= 0) : null; } catch (e) {} const held = M.GS.notes.indexOf(a) >= 0 && M.GS.notes.indexOf(b) >= 0; if (!held) cov.unheld = (cov.unheld || 0) + 1; T.push([now(), 'combine', a, b, held ? 'held' : 'UNHELD', vis === false ? 'hidden' : 'visible']); const r = cn.apply(this, arguments); Promise.resolve(r).then(x => { if (x && x.ok) cov.deduce[a + '+' + b] = 1; }); return r; };
  const cd = M.E.chooseDone; M.E.chooseDone = function (i) { try { const o = M.E.dlg && M.E.dlg.opts[i]; if (o) { T.push([now(), 'choose', o.t]); cov.opts[room() + '|' + o.t] = 1; } } catch (e) {} return cd.apply(this, arguments); };
  const pd = M.pointerDown, pu = M.pointerUp; M.pointerUp = function (x, y, t) { T.push([now(), 'tap', Math.round(x), Math.round(y), M.E.screen]); return pu.apply(this, arguments); };
  const rz = M.API.realize; M.API.realize = function (id) { const k = M.GS.phase.replace(/_.*/, '') + ':' + id; cov.realize[k] = (cov.realize[k] || 0) + 1; T.push([now(), 'REALIZE', id]); return rz.apply(this, arguments); };
  const co = M.API.crossOpen; M.API.crossOpen = function () { const k = room(); cov.cross[k] = (cov.cross[k] || 0) + 1; T.push([now(), 'CROSS', k]); return co.apply(this, arguments); };
  ['endChapter', 'endChapter2', 'endChapter3', 'endChapter4'].forEach(n => { const f = M[n]; if (typeof f !== 'function') return; M[n] = function () { cov.ends[n] = (cov.ends[n] || 0) + 1; T.push([now(), 'END', n]); return f.apply(this, arguments); }; });
  const so = M.E.showOverlay; void so;
};

// Invarianten, die zu jedem Zeitpunkt gelten müssen (aus Design und Datenmodell, nicht aus einzelnen Skriptbedingungen):
// keine doppelten / unbekannten Gegenstände, nur bekannte Notizen, gültige Phase, gespielte Figur existiert, Mala nur aktiv wenn anwesend,
// beide Figuren in existierenden Räumen.
function checkInvariants(M) {
  const G = M.GS, out = [];
  if (!G) return out;
  const inv = G.inv || []; const seen = {};
  inv.forEach(id => { if (seen[id]) out.push('Gegenstand doppelt: ' + id); seen[id] = 1; if (!M.ITEMS[id]) out.push('unbekannter Gegenstand: ' + id); });
  (G.notes || []).forEach(id => { if (!M.NOTES[id]) out.push('unbekannte Notiz: ' + id); });
  if (!M.PHASES[G.phase]) out.push('unbekannte Phase: ' + G.phase);
  if (G.active !== 'marko' && G.active !== 'mala') out.push('ungültige Figur: ' + G.active);
  if (G.active === 'mala' && !G.malaOn && M.E.screen === 'game') out.push('Mala gespielt, aber nicht anwesend');
  ['marko', 'mala'].forEach(k => { const r = G.pos && G.pos[k] && G.pos[k].room; if (r && !M.ROOMS[r]) out.push('Raum existiert nicht: ' + k + '@' + r); });
  return out;
}

class Session {
  constructor(o) { this.o = o; this.inner = null; this.monitor = { rooms: {}, edges: {}, phases: {}, phaseSeq: [], roomSeq: [], invChanges: [], invLost: [], notesAdded: [], invariant: [], lastPhase: null, lastRoom: null, lastInv: '' }; this.loads = 0; this.tolerant = false; this.skips = []; this.D = this.makeProxy(); this.traceAll = []; this.covAll = []; }
  async open(storage) {
    if (this.inner) this.collect();
    const mon = this.monitor;
    this.inner = await vmd.open({ seed: this.o.seed + this.loads * 7919, turbo: 25, storage, render: this.o.render, html: this.o.html, deadline: this.o.deadline, vlimit: this.o.vlimit,
      onFrame: (M) => { const G = M.GS; const r = M.E.room && M.E.room.id; if (!G) return;
        if (G.phase !== mon.lastPhase) { if (mon.lastPhase) mon.phases[mon.lastPhase + '>' + G.phase] = 1; mon.phaseSeq.push(G.phase); mon.lastPhase = G.phase; mon.phases[G.phase] = 1; }
        if (r && r !== mon.lastRoom) { if (mon.lastRoom) mon.edges[mon.lastRoom + '>' + r] = 1; mon.rooms[r] = 1; mon.roomSeq.push(r); mon.lastRoom = r; }
        const iv = (G.inv || []).join(','); if (iv !== mon.lastInv) { const a = mon.lastInv ? mon.lastInv.split(',') : [], b = G.inv || []; const lost = a.filter(x => b.indexOf(x) < 0), got = b.filter(x => a.indexOf(x) < 0);
          if (lost.length || got.length) mon.invChanges.push([G.phase, r, got, lost]); mon.lastInv = iv; }
        const E = M.E; if (E.acting > 0 && !E.busy && !E.speech && !E.dlg && !E.overlay && E.screen === 'game') { if (!mon.actSince) { mon.actSince = E.gt(); mon.actTrace = (M.__qaTrace || []).length; } else if (E.gt() - mon.actSince > 120000) { const x = 'Aktion hängt: E.acting=' + E.acting + ' seit ' + Math.round((E.gt() - mon.actSince) / 1000) + ' s Spielzeit ohne Szene (Raum ' + r + ', nach Aktion ' + JSON.stringify((M.__qaTrace || [])[mon.actTrace - 1] || null) + ')'; if (!mon.invariant.some(y => /^Aktion hängt/.test(y))) mon.invariant.push(x); } } else mon.actSince = 0;
        if ((this.frameN = (this.frameN || 0) + 1) % 10 === 0) { const v = checkInvariants(M); if (v.length) v.forEach(x => { if (mon.invariant.indexOf(x) < 0) mon.invariant.push(x); }); } } });
    mon.lastRoom = null; mon.lastInv = '';
    this.inner.M.TA && (await this.inner.ev(TRACE_INSTALL));
    if (process.env.QA_DEBUG_INSTALL) await this.inner.ev(new Function(process.env.QA_DEBUG_INSTALL));   // nur zur Fehlersuche
    await this.inner.ev(() => { if (!M.__speechLog) M.__speechLog = []; });   // Sprachprotokoll der Testskripte (expectSaid) auch im frischen Kontext
    return this.inner;
  }
  collect() { try { this.traceAll.push(this.inner.M.__qaTrace || []); this.covAll.push(this.inner.M.__qaCov || {}); this.errorsAll = (this.errorsAll || []).concat(this.inner.errors); this.illegalAll = (this.illegalAll || []).concat(this.inner.M.__qaIllegal || []); } catch (e) {} try { this.inner.close2(); } catch (e) {} }
  finish() { this.collect(); const errors = this.errorsAll || []; return { trace: [].concat(...this.traceAll), cov: this.covAll, errors, illegal: this.illegalAll || [] }; }
  get M() { return this.inner.M; }
  makeProxy() {
    const S = this;
    const page = { waitForTimeout: (ms) => S.inner.page.waitForTimeout(ms), evaluate: (f, a) => S.inner.ev(f, a), screenshot: (o) => S.inner.page.screenshot(o) };
    const tol = {
      async choose(sub) { const I = S.inner; try { await I.until(s => s.dlg, 20000, 'Auswahl für ' + sub); } catch (e) { if (e.kind !== 'timeout') throw e; S.skips.push(['choose-nodlg', sub]); return I.settle(); } const opts = I.stSync().dlg; if (opts.some(t => t.indexOf(sub) >= 0)) return I.choose(sub);
        S.skips.push(['choose', sub, opts]); const bye = opts.findIndex(t => /^(\(Gehen|\(Doch nichts|\(Nicht mehr|Danke|Auf Wiedersehen|Bis |Servus|Tschüss|Ich gehe|Gute Nacht|\(Warten)/.test(t)); I.M.E.chooseDone(bye >= 0 ? bye : opts.length - 1); await I.page.waitForTimeout(60); return I.settle(); },
      async act(v, id, it) { const I = S.inner; if (!I.M.E.room || !I.M.E.room.byId[id]) { if (!(I.M.E.overlay && I.M.E.overlay.kind === 'map' && /^loc/.test(id)) && id !== '_mala' && id !== '_marko') { S.skips.push(['act', v, id, I.M.E.room && I.M.E.room.id]); return I.settle(); } } return I.act(v, id, it); },
      async pickNote(id) { const I = S.inner; try { await I.until(s => s.overlay === 'notebook' || s.dlg, 20000, 'Notizbuch'); } catch (e) { if (e.kind !== 'timeout') throw e; S.skips.push(['note-nodlg', id]); return I.settle(); }
        try { I.M.TA.pickNote(id); } catch (e) { S.skips.push(['note-missing', id]); if (I.M.E.dlg) { const o = I.M.E.dlg.opts; const k = o.findIndex(x => /Doch nichts|Nicht mehr/.test(x.t)); I.M.E.chooseDone(k >= 0 ? k : o.length - 1); } else I.M.TA.closeOverlay(null); } await I.page.waitForTimeout(60); return I.settle(); },
      async exit(id) { const I = S.inner; if (!I.M.E.room || !I.M.E.room.byId[id]) { S.skips.push(['exit', id, I.M.E.room && I.M.E.room.id]); return I.settle(); } return I.exit(id); },
      async combine(a, b) { const I = S.inner; const r = await I.combine(a, b); if (r && r.ok) return r; const d = I.M.DEDUCE[a + '+' + b] || I.M.DEDUCE[b + '+' + a]; const to = d && (d.to || d.note || d.n); if (to && I.M.GS.notes.indexOf(to) >= 0) { S.skips.push(['combine-done', a, b, to]); return { ok: true, tolerated: true }; } return r; }
    };
    return new Proxy({}, { get(_, k) { if (k === 'page') return page; if (k === 'session') return S; if (S.tolerant && tol[k]) return tol[k]; const v = S.inner[k]; return typeof v === 'function' ? v.bind(S.inner) : v; } });
  }
}

// Menü über die Tastatur (Esc, wie am Rechner) öffnen und Zeile i über pointerDown/Up antippen; 1 = Speichern, 2 = Laden
async function menuTap(I, index) {
  await I.ev(() => { if (!M.E.menu) M.key('Escape'); });
  await I.page.waitForTimeout(60);
  const r = await I.ev((ix) => { if (!M.E.menu) return { err: 'Menü nicht offen' }; M.renderFrame(); for (let y = 0; y < 200; y++) { if (M.uiHit(160, y) === 'm:' + ix) { M.pointerDown(160, y + 2, true); M.pointerUp(160, y + 2, true); return { y: y + 2, msg: M.E.msg && M.E.msg.t }; } } return { err: 'Zeile nicht gefunden' }; }, index);
  await I.page.waitForTimeout(60);
  const msg = await I.ev(() => (M.E.msg ? M.E.msg.t : null));
  await I.ev(() => { if (M.E.menu) M.key('Escape'); }); await I.page.waitForTimeout(40);
  return Object.assign(r, { msg });
}

module.exports = { Session, checkInvariants, menuTap, TRACE_INSTALL };
