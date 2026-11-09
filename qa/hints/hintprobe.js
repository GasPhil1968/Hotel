'use strict';
/* ===== qa/hints/hintprobe.js — Hinweise abseits der Musterlösung prüfen (ANALYSE_GILBERT.md, Muster 10, Vorschlag P12) =====
   Aufruf:
     node qa/hints/hintprobe.js [--html <index.html>] [--dumps <ordner>]… [--states <datei.jsonl>]… [--varianten] [--only id,id] [--pick <muster auf den Standnamen>] [--json <bericht.json>] [-v]
   Quellen (jede ist eine Folge von Spielständen):
     --dumps <ordner>    ein Stand nach jedem Schritt der Musterlösung: MALA_DUMPALL=<ordner> node game/tools/walkthroughN.js
     --states <ordner|datei>  Stände aus Zufalls- und Variantenläufen: node qa/sim.js --cat B|C --count N --states <ordner> (eine Folge je Lauf)
     --varianten         die Abweichungen aus qa/hints/varianten.js (andere Reihenfolge, verpasster Schritt, früher Schluss)
   Je Stand und offenem Hinweisthema:
     A  Stufe 4 ausführen. Die Handlung, die der Satz der Stufe 4 nennt (zugeordnet in qa/hints/stufe4.js), wird im Spiel ausgeführt.
        Sie muss möglich sein (Figur, Gegenstand, Ort, Notiz da) und das Thema voranbringen: das Thema schließt, ein Stufentext ändert sich,
        der Abschnitt wechselt oder ein Schalter, eine Notiz, ein Gegenstand bzw. ein Raumzustand, den das Thema abfragt, ändert sich.
        Ein erstmals betretener Ort zählt nur bei Geh- und Reiseschritten. Rätselfelder löst die Probe wie die Durchläufe (Übersetzung,
        Ordnen, Schrift, Hälften). Sätze, die selbst „Morgen …“ sagen, und Zuordnungen mit P.skip werden übersprungen (gezählt).
     B  Abdeckung: mindestens ein offenes Thema, solange das Kapitel läuft.
   Je Folge:
     C  Wiederöffnung: ein Thema war offen, wurde geschlossen und öffnet wieder (rät meist Erledigtes).
     D  Strang-Lücke: die Themen eines durchgehenden Strangs (qa/hints/stufe4.js, STRANDS; Kennung bis zur ersten Ziffer, etwa „m1“ für m1a–m1e)
        setzen aus und später wieder ein.
   Ausgabe: FEHLER (A–D), PRÜFEN (Zuordnung passt nicht zum Text), Zusammenfassung; Rückgabewert 1 bei Fehlern.
   -v zeigt auch bestandene Proben und die letzten Schritte jeder Probe; HP_DEBUG=1 zeigt jeden Zustand beim Abarbeiten eines Gesprächs. */
const path = require('path'), fs = require('fs'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const { open } = require('../vmdriver');
const SPEC = require('./stufe4');
const args = process.argv.slice(2);
const argv = (k) => { const out = []; args.forEach((a, i) => { if (a === k && args[i + 1] !== undefined) out.push(args[i + 1]); }); return out; };
const has = (k) => args.indexOf(k) >= 0;
const VERBOSE = has('-v');

// ---------------------------------------------------------------- Hilfen im Spielkontext (einmal pro VM geladen)
function VMLIB() {
  const HP = {};
  const low = (s) => String(s == null ? '' : s).toLowerCase();
  // Muster kommen aus Node (anderer Realm): nicht instanceof. Zeichenketten passen am Wortanfang („Nada“ passt nicht auf „Senada“).
  const mt = (pat, s) => { if (pat && typeof pat.test === 'function') return new RegExp(pat.source, pat.flags.indexOf('i') >= 0 ? pat.flags : pat.flags + 'i').test(String(s || '')); const x = low(s), p = low(pat); let i = x.indexOf(p); while (i >= 0) { if (i === 0 || !/[a-zäöüßčćšžđ]/.test(x[i - 1])) return true; i = x.indexOf(p, i + 1); } return false; };
  HP.base = function (GS) { const b = M.freshGame(); Object.keys(b).forEach((k) => { if (GS[k] !== undefined) b[k] = GS[k]; }); const G = JSON.parse(JSON.stringify(b)); M.migrateAll(G); return G; };
  // Räume des Kapitels: von den Orten des Stadtplans über Ausgänge erreichbar, dazu wo die beiden gerade stehen
  HP.rooms = function (G) {
    const seen = {}, q = [];
    const add = (r) => { if (r && M.ROOMS[r] && !seen[r]) { seen[r] = 1; q.push(r); } };
    (M.mapLocs(G) || []).forEach((L) => add(L.to)); if (G.pos) { add(G.pos.marko && G.pos.marko.room); add(G.pos.mala && G.pos.mala.room); }
    Object.keys(G.rooms || {}).forEach((r) => { if (r !== 'limbo') add(r); });   // besuchte Räume (auch die, in die nur eine Szene führt)
    ((HP.chRooms || {})[M.chapterOf(G)] || []).forEach(add);   // Räume, die in den geprüften Folgen dieses Kapitels vorkommen
    while (q.length) { const R = M.ROOMS[q.shift()]; (R.hotspots || []).forEach((h) => { [h.exit, h.gexit].forEach((ex) => { if (!ex) return; let e = ex; if (typeof e === 'function') { try { e = e({}, G); } catch (er) { e = null; } } if (e && e.to) add(typeof e.to === 'function' ? null : e.to); }); }); }
    return Object.keys(seen);
  };
  HP.hsName = function (h, G) { let n = h.name; if (typeof n === 'function') { try { n = n({}, G); } catch (e) { n = ''; } } return n || ''; };
  HP.npcs = function (G, cur) {
    const out = [];
    HP.rooms(G).forEach((rid) => { const R = M.ROOMS[rid]; if (!R || !R.actors) return; let L = []; try { L = R.actors({}, G) || []; } catch (e) { return; }
      L.forEach((a) => { const hs = (R.hotspots || []).find((h) => h.npc === a.id) || (R.hotspots || []).find((h) => h.id === a.id); if (hs) out.push({ id: a.id, name: a.name || HP.hsName(hs, G), room: rid, hs: hs.id }); }); });
    out.sort((a, b) => (a.room === cur ? 0 : 1) - (b.room === cur ? 0 : 1)); return out;
  };
  HP.findNpc = function (G, pat, cur) { const L = HP.npcs(G, cur); return L.find((n) => n.id === pat) || L.find((n) => mt(pat, n.name)) || null; };
  HP.findHs = function (G, pat, cur) {
    const L = []; HP.rooms(G).forEach((rid) => { const R = M.ROOMS[rid]; (R.hotspots || []).forEach((h) => { if (h.npc) return; const n = HP.hsName(h, G); if (h.id === pat || (n && mt(pat, n))) {
      let vis = true; if (typeof h.vis === 'function') { try { vis = !!h.vis((G.rooms || {})[rid] || {}, G); } catch (e) { vis = true; } }
      L.push({ room: rid, id: h.id, name: n, vis }); } }); });
    L.sort((a, b) => ((a.room === cur ? 0 : 2) + (a.vis ? 0 : 1)) - ((b.room === cur ? 0 : 2) + (b.vis ? 0 : 1))); return L[0] || null;
  };
  // Figur über ihre Stelle im Raum finden, auch wenn sie erst beim Betreten erscheint
  HP.findNpcHs = function (G, pat) { let out = null; HP.rooms(G).forEach((rid) => { if (out) return; const R = M.ROOMS[rid]; (R.hotspots || []).forEach((h) => { if (out || !h.npc) return; const n = HP.hsName(h, G); if (h.npc === pat || h.id === pat || (n && mt(pat, n))) out = { room: rid, hs: h.id, id: h.npc }; }); }); return out; };
  // Rätselfelder wie in den Durchläufen lösen: Übersetzung (alle Fassungen durchprobieren), Ordnen (alle Reihenfolgen), Schrift (Lösung aus den Daten)
  HP.solve = function () {
    const ov = M.E.overlay; if (!ov) return 'kein Feld'; const d = ov.data || {};
    const ok = (v) => { try { const r = d.check ? d.check(v) : { ok: true }; return !!(r && r.ok); } catch (e) { return false; } };   // als Methode aufrufen: check() liest this.words
    if (ov.kind === 'puzzle') { const sz = d.slots.map((x) => x.length), sel = sz.map(() => 0);
      for (let t = 0; t < 300000; t++) { if (ok(sel.slice())) { M.TA.closeOverlay(sel.slice()); return 'Übersetzung gelöst'; } let i = 0; while (i < sz.length) { sel[i]++; if (sel[i] < sz[i]) break; sel[i] = 0; i++; } if (i >= sz.length) break; }
      M.TA.closeOverlay(null); return 'Übersetzung nicht lösbar'; }
    if (ov.kind === 'arrange') { const ids = d.items.map((it) => it.id); const n = ids.length, c = new Array(n).fill(0), a = ids.slice();
      if (ok(a.slice())) { M.E.closeOverlay(a.slice()); return 'geordnet'; }
      let i = 0; while (i < n) { if (c[i] < i) { const k = i % 2 ? c[i] : 0; const t = a[k]; a[k] = a[i]; a[i] = t; if (ok(a.slice())) { M.E.closeOverlay(a.slice()); return 'geordnet'; } c[i]++; i = 0; } else { c[i] = 0; i++; } }
      M.TA.closeOverlay(null); return 'Ordnen nicht lösbar'; }
    if (ov.kind === 'glyphs') { ov.rd = d.words.map((w) => w.map((ch) => ch.k ? ch.ok : -1)); if (ok(ov.rd)) { M.E.closeOverlay(ov.rd); return 'Schrift gelesen'; } M.TA.closeOverlay(null); return 'Schrift nicht lösbar'; }
    return null;
  };
  HP.findItem = function (G, pat) { return G.inv.find((i) => i === pat) || G.inv.find((i) => M.ITEMS[i] && mt(pat, M.ITEMS[i].name)) || null; };
  HP.findNote = function (G, pat) { return G.notes.find((n) => n === pat) || G.notes.find((n) => { const N = M.NOTES[n]; return N && (mt(pat, N.t) || mt(pat, N.s)); }) || null; };
  HP.findLoc = function (G, pat) { return (M.mapLocs(G) || []).find((L) => L.id === pat || mt(pat, L.name)) || null; };
  HP.topic = function (G, id) { return (M.hintTopics(G) || []).find((h) => h.id === id) || null; };
  // Was ein Thema abfragt: die Zeichenketten in open() und in den Stufenfunktionen (Notizen, Gegenstände, Räume, sonst Schalter)
  HP.rel = {};
  HP.relOf = function (T) { if (HP.rel[T.id]) return HP.rel[T.id]; const src = [T.open].concat(T.s || []).filter((f) => typeof f === 'function').map((f) => String(f)).join(' ');
    const L = []; src.replace(/'([^'\\]{2,80})'/g, (m, s) => { if (L.indexOf(s) < 0 && !/^k\d_[a-z0-9_]*$/.test(s) && !(M.PHASES && M.PHASES[s])) L.push(s); return m; }); return (HP.rel[T.id] = L); };
  HP.snap = function (G, id) {
    const T = HP.topic(G, id); if (!T) return { none: true, open: false, texts: [], keys: {}, phase: G.phase };
    let op = false; try { op = !!T.open(G); } catch (e) { op = false; }
    const texts = [0, 1, 2, 3].map((i) => { try { return M.hintText(T, i, G, 'marko'); } catch (e) { return '!' + e.message; } });
    const keys = {};
    HP.relOf(T).forEach((s) => { if (M.NOTES[s]) keys['Notiz ' + s] = G.notes.indexOf(s) >= 0; else if (M.ITEMS[s]) keys['Gegenstand ' + s] = G.inv.indexOf(s) >= 0;
      else if (M.ROOMS[s]) keys['Raum ' + s] = !!(G.rooms && G.rooms[s]); else keys['Schalter ' + s] = JSON.stringify(G.flags[s] === undefined ? null : G.flags[s]); });
    // Raumzustände, die ein Thema über G.rooms.<raum>.<schlüssel> abfragt
    const src = [T.open].concat(T.s || []).filter((f) => typeof f === 'function').map((f) => String(f)).join(' ');
    src.replace(/rooms\.([a-z0-9_]+)\.([a-zA-Z0-9_]+)/g, (m, r, k) => { keys['Raum ' + r + '.' + k] = JSON.stringify(((G.rooms || {})[r] || {})[k] === undefined ? null : G.rooms[r][k]); return m; });
    return { open: op, texts, keys, phase: G.phase, rooms: Object.keys(G.rooms || {}).filter((r) => r !== 'limbo') };
  };
  HP.diff = function (a, b, withRooms) {
    if (a.open !== b.open) return a.open ? 'Thema geschlossen' : 'Thema geöffnet';
    if (a.phase !== b.phase) return 'Abschnitt ' + a.phase + ' → ' + b.phase;
    for (let i = 0; i < 4; i++) if (a.texts[i] !== b.texts[i]) return 'Stufe ' + (i + 1) + ' geändert';
    for (const k in b.keys) if (a.keys[k] !== b.keys[k]) return k + ': ' + a.keys[k] + ' → ' + b.keys[k];
    if (withRooms) for (const r of (b.rooms || [])) if ((a.rooms || []).indexOf(r) < 0) return 'neuer Ort: ' + r;   // nur bei Geh-/Reiseschritten: „Geh nach X“ ist erfüllt, wenn X zum ersten Mal betreten ist
    return null;
  };
  // gültige Schlüsse im Notizbuch (beide Notizen sichtbar, Bedingung erfüllt, Ergebnis neu); Beinahe-Treffer zählen nicht
  HP.combos = function (G) { const vis = M.E.nbOpen ? M.E.nbOpen(false) : G.notes; const out = [];
    Object.keys(M.DEDUCE).forEach((k) => { const ab = k.split('+'); if (ab.length !== 2) return; const d = M.DEDUCE[k]; if (typeof d === 'function') return;
      if (vis.indexOf(ab[0]) < 0 || vis.indexOf(ab[1]) < 0) return; if (d.if) { try { if (!d.if(G)) return; } catch (e) { return; } } if (G.notes.indexOf(d.to) >= 0) return; out.push(ab); });
    return out; };
  HP.load = function (G) { localStorage.setItem('mala.qahp', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.__speechLog = []; return M.E.loadKey('mala.qahp'); };
  // Figur an einen Ort stellen (der andere kommt mit, wenn er dabei war und mitkommen soll)
  HP.place = function (G, who, room, both) {
    if (who) G.active = who;
    if (room && M.ROOMS[room]) { const R = M.ROOMS[room], st = R.start || [160, 120, 'R'], me = G.active, other = me === 'marko' ? 'mala' : 'marko';
      const was = G.pos[me] && G.pos[me].room; G.pos[me] = { room, x: st[0], y: st[1], f: st[2] || 'R' };
      if (both && G.pos[other] && (G.pos[other].room === was || both === 'always')) G.pos[other] = { room, x: st[0] - 14, y: st[1] - 2, f: st[2] || 'R' }; }
    return G;
  };
  globalThis.HP = HP;
}

// ---------------------------------------------------------------- Stände einlesen
function readSources() {
  const seqs = [];
  argv('--dumps').forEach((dir) => { const files = fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f)).sort();
    seqs.push({ src: path.basename(dir), states: files.map((f) => { const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); return { label: f + ' „' + (d.label || '') + '“', GS: d.GS }; }) }); });
  const files = []; argv('--states').forEach((f) => { if (fs.statSync(f).isDirectory()) fs.readdirSync(f).filter((x) => /\.jsonl$/.test(x)).sort().forEach((x) => files.push(path.join(f, x))); else files.push(f); });
  files.forEach((file) => { const by = {}; fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).forEach((line) => { let d; try { d = JSON.parse(line); } catch (e) { return; }
    const k = d.run || 'lauf'; (by[k] = by[k] || []).push({ label: (d.step != null ? '#' + d.step + ' ' : '') + (d.label || ''), GS: d.GS }); });
    Object.keys(by).forEach((k) => seqs.push({ src: path.basename(file) + ':' + k, states: by[k] })); });
  return seqs;
}

// ---------------------------------------------------------------- eine Probe ausführen
const wait = (D, ms) => D.page.waitForTimeout(ms);
async function settle(D, ms) { try { return await D.settle(ms || 60000); } catch (e) { return { err: e.message }; } }
const isTerminal = (s) => ['go', 'travel', 'room', 'mala', 'marko'].indexOf(s.k) < 0;
// gewünschte Auswahl in einer Handlung: RegExp = Gesprächsoption, {note} = Notiz im Notizbuch, {ask:true} = die Option „Nach etwas aus dem Notizbuch fragen“
const wantOf = (st) => (st.want || []).map((w) => (w && typeof w.test === 'function') ? { re: w } : w);

async function runProbe(D, GS, topicId, probe) {
  const H = D.ctx.HP, M = D.M;
  const live = () => M.GS;
  const log = [];
  // Startort: wo die erste Handlung spielt
  const who = probe.who || (probe.steps.some((s) => s.k === 'mala') ? null : 'marko');
  // erst laden (mit dem Aktiven, den die Probe verlangt), dann Ausgangslage merken
  await D.ev((a) => { const G = HP.base(a.GS); HP.place(G, a.who || G.active, null, false); return HP.load(G); }, { GS, who });
  await settle(D); await D.drain().catch(() => {});
  // Läuft nach dem Laden eine Szene (Auswahl offen oder gesperrt), führt sie selbst weiter; Hinweise gibt es währenddessen nicht
  if (M.E.dlg || M.E.busy || M.E.screen !== 'game') return { ok: true, skip: 'Szene läuft nach dem Laden' };
  const base = H.snap(live(), topicId);
  if (!base.open) return { ok: true, skip: 'nach dem Laden nicht offen' };
  const room0 = M.E.room && M.E.room.id;
  let roomsOk = false;   // ein neuer Ort zählt nur als Wirkung, wenn der Schritt selbst ein Gehen oder Reisen ist (nicht, weil die Probe zu einer Figur springt)
  const check = () => (M.E.screen !== 'game' ? 'Kapitelende (' + M.E.screen + ')' : null) || H.diff(base, H.snap(live(), topicId), roomsOk) || (M.E.room && M.E.room.id === 'limbo' && room0 !== 'limbo' ? 'Zwischenwelt betreten' : null);
  const moveTo = async (room, whoP) => {
    const ok = await D.ev((a) => { const G = JSON.parse(JSON.stringify(M.GS)); HP.place(G, a.who || G.active, a.room, true); return HP.load(G); }, { room, who: whoP || null });
    await settle(D); await D.drain().catch(() => {}); return ok;
  };
  const cur = () => (M.E.room && M.E.room.id);
  for (const st of probe.steps) {
    const G = live();
    let r = null;
    roomsOk = st.k === 'go' || st.k === 'travel' || st.k === 'walk' || (st.k === 'act' && (st.verb === 'walk' || st.verb === 'pass'));
    try {
      if (st.k === 'mala' || st.k === 'marko') {
        const okm = await D.ev((w) => { const G = JSON.parse(JSON.stringify(M.GS)); if (w === 'mala' && !G.malaOn) return false; const me = G.active, room = G.pos[me].room; G.active = w; HP.place(G, w, room, false); return HP.load(G); }, st.k);
        if (!okm) return { ok: false, why: 'Wechsel zu ' + st.k + ' nicht möglich', log };
        await settle(D); log.push('→ ' + st.k); continue;
      }
      if (st.k === 'room') { await D.ev((a) => { const G = JSON.parse(JSON.stringify(M.GS)); HP.place(G, G.active, a, 'always'); return HP.load(G); }, st.id); await settle(D); await D.drain().catch(() => {}); log.push('Raum ' + st.id); continue; }
      if (st.k === 'walk') { if (st.room && st.room !== cur()) await moveTo(st.room); await D.ev((a) => M.E.walkPlayerTo(a.x, a.y), st); await wait(D, 300); r = await exhaust(D, check, wantOf(st), log, false); log.push('gehe ' + st.x + ',' + st.y); }
      else
      if (st.k === 'travel') {   // echte Reise über den Stadtplan (Begleiter, Ankunftsszenen); vom aktuellen Raum muss der Plan erreichbar sein
        const L = H.findLoc(G, st.loc); if (!L) return { ok: false, why: 'Ort nicht auf dem Stadtplan: ' + st.loc, log };
        const from = cur(); await D.ev((id) => { M.TA.travel(id); return true; }, L.id); await wait(D, 400);
        r = await exhaust(D, check, wantOf(st), log, false); log.push('Reise ' + L.id + ' (' + from + ' → ' + cur() + ')');
        if (r && r.ok) return { ok: true, why: r.why, log }; if (cur() === from) return { ok: false, why: 'Reise nach ' + L.id + ' von ' + from + ' aus nicht möglich', log }; continue;
      }
      if (st.k === 'go') {
        const L = H.findLoc(G, st.loc); if (!L) return { ok: false, why: 'Ort nicht auf dem Stadtplan: ' + st.loc, log };
        const sts = await D.ev(() => M.mapStates()); const s = sts[L.id] || {};
        if (s.st !== 'open' && s.st !== 'here' && !(st.via && s.st)) return { ok: false, why: 'Ort „' + L.name + '“ ist ' + (s.st || 'unbekannt') + (s.why ? ' („' + s.why + '“)' : ''), log };
        if (s.st !== 'here') { await moveTo(L.to); await D.ev(() => { const R = M.E.room; if (R && R.enter) { M.E.busy = true; Promise.resolve(R.enter(M.API, 'map')).catch((e) => console.error(e)).then(() => { M.E.busy = false; }); } return true; }); }   // wie eine Ankunft über den Stadtplan
        log.push('Ort ' + L.id); r = await exhaust(D, check, wantOf(st), log, false); if (r && r.ok) return { ok: true, why: r.why, log }; continue;
      }
      if (st.k === 'talk' || st.k === 'ask' || st.k === 'give' || st.k === 'nact') {
        let n = st.npc === '_mala' || st.npc === '_marko' ? { id: st.npc, hs: st.npc, room: cur() } : H.findNpc(G, st.npc, cur());
        if (!n) {   // erscheint sie erst beim Betreten ihres Raums?
          const h = H.findNpcHs(G, st.npc);
          if (h) { await moveTo(h.room); await D.ev(() => { const R = M.E.room; if (R && R.enter) { M.E.busy = true; Promise.resolve(R.enter(M.API, 'map')).catch((e) => console.error(e)).then(() => { M.E.busy = false; }); } return true; }); const r0 = await exhaust(D, check, [], log, true); if (r0 && r0.ok) return { ok: true, why: r0.why, log }; n = H.findNpc(live(), st.npc, cur()); }
          if (!n) return { ok: false, why: 'Figur nicht anzutreffen: ' + st.npc, log };
        }
        let item = null; if (st.k === 'give') { item = H.findItem(G, st.item); if (!item) return { ok: false, why: 'Gegenstand nicht dabei: ' + st.item, log }; }
        if (n.room !== cur()) await moveTo(n.room);
        if (st.k === 'give') { await D.ev((a) => M.TA.act('use', a.hs, a.item), { hs: n.hs, item }); log.push('gib ' + item + ' an ' + n.id); r = await exhaust(D, check, wantOf(st), log, false); }
        else if (st.k === 'nact') { await D.ev((a) => M.TA.act(a.v, a.hs), { v: st.verb, hs: n.hs }); log.push(st.verb + ' ' + n.id); r = await exhaust(D, check, wantOf(st), log, false); }
        else { await D.ev((hs) => M.TA.act('talk', hs), n.hs); log.push('rede mit ' + n.id); r = await exhaust(D, check, st.k === 'ask' ? [{ ask: true }, { note: st.note }] : wantOf(st), log, false); }
      } else if (st.k === 'use' || st.k === 'act') {
        let item = null; if (st.k === 'use') { item = H.findItem(G, st.item); if (!item) return { ok: false, why: 'Gegenstand nicht dabei: ' + st.item, log }; }
        const h = H.findHs(G, st.hs, cur()); if (!h) return { ok: false, why: 'Stelle nicht gefunden: ' + st.hs, log };
        if (h.room !== cur()) await moveTo(h.room);
        const vis = await D.ev((id) => { const R = M.E.room, h = R.byId[id]; if (!h) return false; if (typeof h.vis !== 'function') return true; try { return !!h.vis(M.RS(R.id), M.GS); } catch (e) { return true; } }, h.id);
        if (!vis) return { ok: false, why: 'Stelle „' + (h.name || h.id) + '“ ist gerade nicht da', log };
        await D.ev((a) => M.TA.act(a.v, a.hs, a.item || undefined), { v: st.k === 'use' ? 'use' : st.verb, hs: h.id, item });
        log.push((st.k === 'use' ? 'benutze ' + item + ' mit ' : st.verb + ' ') + h.id); r = await exhaust(D, check, wantOf(st), log, false);
      } else if (st.k === 'item') {
        const a = H.findItem(G, st.item); if (!a) return { ok: false, why: 'Gegenstand nicht dabei: ' + st.item, log };
        const b = st.other ? H.findItem(G, st.other) : null; if (st.other && !b) return { ok: false, why: 'Gegenstand nicht dabei: ' + st.other, log };
        await D.ev((x) => M.TA.item(x.v, x.a, x.b || undefined), { v: st.verb, a, b }); log.push(st.verb + ' ' + a + (b ? ' mit ' + b : '')); r = await exhaust(D, check, wantOf(st), log, false);
      } else if (st.k === 'combine') {
        let pairs;
        if (st.a) { const a = H.findNote(G, st.a), b = H.findNote(G, st.b); if (!a || !b) return { ok: false, why: 'Notiz fehlt: ' + (!a ? st.a : st.b), log }; pairs = [[a, b]]; }
        else pairs = H.combos(G);
        if (!pairs.length) return { ok: false, why: 'kein gültiger Schluss im Notizbuch', log };
        const snapG = JSON.parse(JSON.stringify(G));
        for (const [a, b] of pairs) {
          await D.ev((g) => HP.load(g), snapG); await settle(D);
          const res = await D.combine(a, b); await settle(D); await D.drain().catch(() => {});
          log.push('verbinde ' + a + '+' + b + (res && res.ok ? ' → ' + res.to : ' ✗'));
          const d = check(); if (d) { r = { ok: true, why: d }; break; }
        }
        if (!r) r = { ok: false, why: 'kein Schluss bringt das Thema weiter' };
      } else if (st.k === 'wait') { await wait(D, st.ms || 4000); r = await exhaust(D, check, wantOf(st), log, false); log.push('gewartet ' + (st.ms || 4000) + ' ms'); }   // was danach kommt (Anruf, Szene), wird beantwortet
      else if (st.k !== 'walk') return { ok: false, why: 'unbekannter Schritt ' + st.k, log };
    } catch (e) { return { ok: false, why: 'Ausnahme: ' + String(e.message || e).split('\n')[0].slice(0, 200), log }; }
    if (r && r.ok) return { ok: true, why: r.why, log };
    if (r && r.fail) return { ok: false, why: r.fail, log };
    if (isTerminal(st) && st === probe.steps[probe.steps.length - 1]) return { ok: false, why: (r && r.why) || 'keine Wirkung', log };
  }
  const d = check(); return d ? { ok: true, why: d, log } : { ok: false, why: 'keine Wirkung', log };
}

// Ein Gespräch (oder was eine Handlung öffnet) erschöpfen: gewünschte Optionen zuerst, dann jede noch nicht gewählte, beim Fragen jede Notiz.
// only=true: keine weiteren Optionen ausprobieren (für Handlungen, die selbst schon die Probe sind).
async function exhaust(D, check, want, log, only) {
  const tried = new Set(), asked = new Set(); let askDone = false, solved = 0, quiet = false;
  want = want.slice();
  for (let n = 0; n < 160; n++) {
    if (D.M.E.screen !== 'game') { const d0 = check(); if (d0) return { ok: true, why: d0 }; }
    const s = await settle(D, 90000); if (s.err) { const d1 = check(); if (d1) return { ok: true, why: d1 }; return { fail: 'hängt: ' + s.err.slice(0, 160) }; }
    if (process.env.HP_DEBUG) console.log('  [exhaust]', n, JSON.stringify({ dlg: s.dlg, ov: s.overlay, busy: s.busy, trn: s.trn, room: s.room, want: want.length }));
    const d = check(); if (d) return { ok: true, why: d };
    if (s.dlg || s.overlay) quiet = false;
    if (s.dlg) {
      const opts = await D.ev(() => M.E.dlg ? M.E.dlg.opts.map((o) => ({ t: String(o.t), bye: !!o.bye, ask: !!o.ask })) : null); if (!opts) continue;
      const sig = opts.map((o) => o.t).join('|');
      let k = -1;
      if (want.length) {
        const w = want[0];
        if (w.ask) { k = opts.findIndex((o) => o.ask); if (k < 0) return { fail: 'keine Frage nach Notizen im Gespräch (zur Wahl: ' + opts.map((o) => o.t).join(' / ').slice(0, 300) + ')' }; want.shift(); }
        else if (w.re) { const re = new RegExp(w.re.source, 'i'); k = opts.findIndex((o) => re.test(o.t)); if (k < 0) return { fail: 'Option fehlt: ' + w.re + ' (zur Wahl: ' + opts.map((o) => o.t).join(' / ').slice(0, 300) + ')' }; want.shift(); }
        else if (w.note) { const nid = await D.ev((p) => HP.findNote(M.GS, p), w.note); k = nid ? opts.findIndex((o) => o.id === nid || o.t.indexOf(nid) >= 0) : -1; if (k >= 0) want.shift(); }
      }
      if (k < 0 && !only) k = opts.findIndex((o) => !o.bye && (o.ask ? !askDone : !tried.has(sig + '#' + o.t)));
      if (k < 0) { k = opts.findIndex((o) => o.bye); if (k < 0) k = opts.length - 1; log.push('· ' + opts[k].t); await D.ev((i) => M.E.chooseDone(i), k); await wait(D, 60); continue; }
      tried.add(sig + '#' + opts[k].t); log.push('· ' + opts[k].t); await D.ev((i) => M.E.chooseDone(i), k); await wait(D, 60); continue;
    }
    if (s.overlay === 'notebook') {
      const L = await D.ev(() => { const ov = M.E.overlay; return M.E.nbOpen(true, ov && ov.data && ov.data.also); });
      let nid = null;
      if (want.length && want[0].note) { const w = want.shift(); nid = await D.ev((p) => HP.findNote(M.GS, p), w.note); if (!nid || L.indexOf(nid) < 0) return { fail: 'Notiz steht im Notizbuch nicht zur Wahl: ' + w.note + ' (zur Wahl: ' + L.join(', ') + ')' }; }
      else if (!only) nid = L.find((id) => !asked.has(id));
      if (!nid) { askDone = true; await D.ev(() => M.TA.closeOverlay(null)); await wait(D, 60); continue; }
      asked.add(nid); log.push('? ' + nid); await D.ev((id) => M.TA.pickNote(id), nid); await wait(D, 60); continue;
    }
    if (s.trn && !s.overlay) { await wait(D, 200); continue; }   // Raumwechsel abwarten, aber ein offenes Dokument zuerst schließen (es hält den Wechsel an)
    if (s.overlay) {
      if (['puzzle', 'arrange', 'glyphs'].indexOf(s.overlay) >= 0 && solved < 3) { solved++; const r = await D.ev(() => HP.solve()); log.push('Rätselfeld: ' + r); await wait(D, 60); continue; }
      if (s.overlay === 'peil' && solved < 3) { solved++; await D.ev(() => { if (M.k3PeilTap) M.k3PeilTap('go'); }); await wait(D, 200); log.push('Karte bestätigt'); continue; }
      if (s.overlay === 'halves' && solved < 3) { solved++; for (const id of ['sw', 'p1', 'go']) await tapHit(D, id); await D.until((x) => x.overlay !== 'halves', 20000, 'Hälften').catch(() => {}); log.push('Hälften zusammengelegt'); continue; }
      await D.ev(() => M.TA.closeOverlay()); await wait(D, 60); continue;
    }
    // eine Szene kann zwischen zwei Teilen kurz ruhen (Erzähltext, Gehen): noch einmal nachsehen, ob etwas folgt
    if (!quiet) { quiet = true; await wait(D, 1500); continue; }
    break;
  }
  const d = check(); return d ? { ok: true, why: d } : { ok: false, why: 'keine Wirkung' };
}
// Feld eines Rätsels über seine Trefferfläche antippen (wie game/tools/walkthrough2.js)
async function tapHit(D, id) { await wait(D, 120); await D.ev((i) => { const h = ((M.E.overlay && M.E.overlay.lay && M.E.overlay.lay.hits) || []).find((x) => x.id === i); if (!h) return false; const x = h.r[0] + (h.r[2] >> 1), y = h.r[1] + (h.r[3] >> 1); M.pointerDown(x, y, true); M.pointerUp(x, y, true); return true; }, id); await wait(D, 80); }

// ---------------------------------------------------------------- Hauptprogramm
(async () => {
  const html = argv('--html')[0] || path.join(ROOT, 'web', 'index.html');
  const only = (argv('--only')[0] || '').split(',').filter(Boolean);
  const seqs = readSources();
  if (has('--varianten')) { const V = require('./varianten'); for (const v of await V.build(html)) seqs.push(v); }
  if (!seqs.length) { console.log('Keine Stände. Siehe Kopf der Datei.'); process.exit(2); }
  const D = await open({ seed: 7, html });
  vm.runInContext('(' + VMLIB.toString() + ')()', D.ctx);
  const H = D.ctx.HP;
  // Räume je Kapitel aus allen Ständen (auch Räume, in die nur eine Szene führt)
  const chRooms = {};
  for (const seq of seqs) for (const s of seq.states) { const r = await D.ev((gs) => { const G = HP.base(gs); return { ch: M.chapterOf(G), rooms: Object.keys(G.rooms || {}).concat([G.pos.marko && G.pos.marko.room, G.pos.mala && G.pos.mala.room]).filter((x) => x && x !== 'limbo') }; }, s.GS);
    const set = chRooms[r.ch] = chRooms[r.ch] || {}; r.rooms.forEach((x) => { set[x] = 1; }); }
  await D.ev((m) => { HP.chRooms = m; }, Object.fromEntries(Object.entries(chRooms).map(([k, v]) => [k, Object.keys(v)])));
  const fails = [], warns = [], cache = new Map(); let states = 0, probes = 0, skipped = 0, noSpec = new Set(), okCount = 0;
  const report = (kind, where, msg) => { const line = kind.padEnd(7) + where + ': ' + msg; (kind === 'PRÜFEN' ? warns : fails).push(line); console.log(line); };
  for (const seq of seqs) {
    const life = {};   // Themen-Lebenslauf in dieser Folge: id -> {opened, closed}
    const strandIdx = {};   // Strang -> Indizes offener Stände
    const isOpenAt = [];
    const pick = argv('--pick')[0] ? new RegExp(argv('--pick')[0]) : null;
    for (let i = 0; i < seq.states.length; i++) {
      const s = seq.states[i]; if (pick && !pick.test(s.label)) continue; states++;
      const where = seq.src + ' ' + s.label;
      const info = await D.ev((gs) => { const G = HP.base(gs); const ch = M.chapterOf(G); const L = M.hintsOpen(G);
        return { ch, phase: G.phase, ended: !!G.ended, G: { notes: G.notes, inv: G.inv, flags: G.flags, phase: G.phase, rooms: G.rooms, active: G.active, pos: G.pos }, open: L.map((h) => ({ id: h.id, t4: M.hintText(h, 3, G, 'marko'), t4g: M.hintText(h, 3, G, 'mala') })) }; }, s.GS);
      isOpenAt.push(info.open.map((o) => o.id));
      // B Abdeckung
      if (!info.open.length && !info.ended && !/ENDE|Abspann|epilog|credits/i.test(s.label)) report('FEHLER', where, 'kein offenes Hinweisthema (' + info.phase + ')');
      // C Wiederöffnung
      if (!argv('--pick')[0]) info.open.forEach((o) => { const L = life[o.id]; if (L && L.closed != null && !SPEC.REOPEN_OK[o.id]) { report('FEHLER', where, 'Thema ' + o.id + ' öffnet wieder (war offen bis ' + seq.states[L.closed - 1].label + ')'); L.closed = null; L.reported = true; }
        if (!L) life[o.id] = { opened: i, closed: null }; else if (L.closed != null) L.closed = null; });
      Object.keys(life).forEach((id) => { if (life[id].closed == null && info.open.every((o) => o.id !== id)) life[id].closed = i; });
      // D Strang-Lücke (Stände sammeln, am Ende auswerten)
      info.open.forEach((o) => { const sk = SPEC.STRAND_OF[o.id] || (o.id.match(/^[a-z]+\d+/) || [o.id])[0]; if (strandIdx[sk] && strandIdx[sk][strandIdx[sk].length - 1] === i) return; (strandIdx[sk] = strandIdx[sk] || []).push(i); });
      // A Stufe 4 ausführen (nicht im Abspann oder nach dem Kapitelende: dort gibt es keine Hinweise mehr)
      if (!info.ended && !/Abspann|ENDE/.test(s.label)) for (const o of info.open) {
        if (only.length && only.indexOf(o.id) < 0) continue;
        const sp = SPEC.SPECS[o.id];
        if (!sp) { noSpec.add(o.id); continue; }
        let probe; try { probe = SPEC.normalize(sp(o.t4, info.G, SPEC.P)); } catch (e) { report('FEHLER', where, o.id + ': Zuordnung wirft ' + e.message); continue; }
        if (probe.skip || SPEC.LATER.test(o.t4)) { skipped++; continue; }
        // Zuordnung und Satz: die genannten Namen müssen im Satz vorkommen
        const miss = SPEC.mentions(probe).filter((m) => !SPEC.inText(m, o.t4)); if (miss.length) report('PRÜFEN', where, o.id + ': Stufe 4 „' + o.t4 + '“ nennt nicht ' + miss.join(', '));
        const key = o.id + '|' + o.t4 + '|' + JSON.stringify(await D.ev((a) => { const G = HP.base(a.gs); return { n: G.notes.slice().sort(), i: G.inv.slice().sort(), f: Object.keys(G.flags).filter((k) => G.flags[k]).sort(), p: G.phase, r: Object.keys(G.rooms || {}).sort(), pos: [G.pos.marko && G.pos.marko.room, G.pos.mala && G.pos.mala.room, G.active] }; }, { gs: s.GS }));
        let res = cache.get(key);
        if (!res) { probes++; res = await runProbe(D, s.GS, o.id, probe); cache.set(key, res); }
        if (res.skip) { skipped++; continue; }
        if (res.ok) { okCount++; if (VERBOSE) console.log('ok     ' + where + ': ' + o.id + ' (' + res.why + ')'); }
        else report('FEHLER', where, o.id + ': Stufe 4 „' + o.t4 + '“ – ' + res.why + (VERBOSE && res.log ? ' [' + res.log.slice(-12).join(' | ') + ']' : ''));
      }
    }
    // D auswerten (nicht bei Auswahl einzelner Stände: dann ist es keine Folge)
    if (!argv('--pick')[0]) Object.keys(strandIdx).forEach((sk) => { if (!SPEC.STRANDS[sk]) return; const ix = strandIdx[sk]; for (let k = 1; k < ix.length; k++) if (ix[k] - ix[k - 1] > 1) {
      const of = (id) => (SPEC.STRAND_OF[id] || (id.match(/^[a-z]+\d+/) || [id])[0]) === sk;
      const a = ix[k - 1], b = ix[k], before = isOpenAt[a].filter(of), after = isOpenAt[b].filter(of);
      report('FEHLER', seq.src + ' ' + seq.states[a + 1].label, 'Strang ' + sk + ' setzt aus: nach ' + before.join(',') + ' kein Thema bis ' + seq.states[b].label + ' (' + after.join(',') + ')'); } });
  }
  console.log('\n' + states + ' Stände in ' + seqs.length + ' Folgen, ' + probes + ' Proben ausgeführt (' + okCount + ' Themen-Stände bestanden, ' + skipped + ' übersprungen).');
  if (noSpec.size) console.log('Ohne Zuordnung in qa/hints/stufe4.js (nicht geprüft): ' + Array.from(noSpec).sort().join(', '));
  if (argv('--json')[0]) fs.writeFileSync(argv('--json')[0], JSON.stringify({ states, probes, fails, warns, noSpec: Array.from(noSpec) }, null, 1));
  console.log(fails.length ? 'HINWEISPROBE: ' + fails.length + ' Fehler, ' + warns.length + ' zu prüfen' : 'HINWEISPROBE OK (' + warns.length + ' zu prüfen)');
  console.log(D.errors.length ? 'JS-FEHLER:\n' + D.errors.slice(0, 5).join('\n') : 'keine JS-Fehler');
  await D.close2(); process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(3); });
