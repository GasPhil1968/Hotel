// Erreichbarkeit über die Oberfläche: Bei jeder Hotspot-/Ausgangsaktion der Lösungspfade (M.TA.act/exit) wird geprüft, ob ein Spieler
// diese Stelle in diesem Moment überhaupt antippen könnte: E.hotspotAt(x,y) muss den Hotspot an mindestens einem Punkt liefern
// (Figur sichtbar, dunkle Stelle beleuchtet, nicht vollständig überdeckt). Die Test-API selbst prüft das nicht.
//   node qa/uireach.js [--html …] [--out qa/results/uireach.json]
'use strict';
const path = require('path'), fs = require('fs');
const { open } = require('./vmdriver'); const C = require('./lib/common');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const OUT = arg('--out', path.join(__dirname, 'results', 'uireach.json'));
const INSTALL = function () {
  const R = window.__reach = [];
  const check = (kind, id) => { try { const E = M.E, room = E.room; if (!room) return; const h = id === '_mala' ? E.MALA_HS : (id === '_marko' ? E.MARKO_HS : room.byId[id]); if (!h) { R.push({ kind, id, room: room.id, phase: M.GS.phase, active: M.GS.active, why: 'kein Hotspot' }); return; }
      if (id === '_mala' || id === '_marko' || /^loc/.test(id)) return;
      let why = null; const r = E.hsRect(h);
      if (!r) why = h.npc ? 'Figur nicht sichtbar/nicht da' : 'kein Rechteck (unsichtbar)';
      else { let hit = false; for (let y = Math.max(0, r[1]); y < Math.min(144, r[1] + r[3]) && !hit; y++) for (let x = r[0]; x < r[0] + r[2] && !hit; x++) if (E.hotspotAt(x, y) === h) hit = true;
        if (!hit) why = (h.dark && E.hsLit && !E.hsLit(h, r)) ? 'dunkel (nicht in Malas Schein)' : 'überall überdeckt / nicht trefferfähig'; }
      if (why) R.push({ kind, id, room: room.id, phase: M.GS.phase, active: M.GS.active, why, dark: !!h.dark, npc: h.npc || null });
    } catch (e) { R.push({ kind, id, why: 'Fehler ' + e.message }); } };
  const act = M.TA.act; M.TA.act = function (v, id, it) { if (!(M.E.overlay && M.E.overlay.kind === 'map')) check('act:' + v + (it ? '+' + it : ''), id); return act.apply(this, arguments); };
  const cb = M.TA.combine; M.TA.combine = function (x, y) { try { const L = M.E.nbOpen(false); const miss = [x, y].filter(i => L.indexOf(i) < 0); if (miss.length) R.push({ kind: 'combine', id: x + '+' + y, room: M.E.room && M.E.room.id, phase: M.GS.phase, active: M.GS.active, why: 'Notiz nicht im Notizbuch sichtbar: ' + miss.join(', ') }); } catch (e) {} return cb.apply(this, arguments); };
  const ex = M.TA.exit; M.TA.exit = function (id) { check('exit', id); return ex.apply(this, arguments); };
};
const VARIANTS = [
  { name: 'Standard', env: {} },
  { name: 'K2 andere Reihenfolge, Notizbuch Nachdenken, Zustimmung c, keine Probe', env: { 1: { MALA_NB: 'think' }, 2: { MALA_ORDER: 'alt', MALA_NB: 'think' }, 3: { QA_CONSENT: 'c', QA_SAMPLE: 'no' }, 4: { QA_KONSULAT_EARLY: '1' } } },
  { name: 'Zustimmung a', env: { 3: { QA_CONSENT: 'a' } } }
];
(async () => {
  const out = { html: null, variants: [] };
  for (const V of VARIANTS) {
    const D = await open({ seed: 21, html: arg('--html') }); out.html = D.sha12; await D.ev(INSTALL); await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; });
    await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1'); const chs = [];
    for (let ch = 1; ch <= 4; ch++) { const r = await C.runPath({ 1: 'walkthrough', 2: 'walkthrough2', 3: 'walkthrough3', 4: 'walkthrough4' }[ch], D, (V.env[ch] || {})); chs.push({ ch, ok: r.ok, err: r.err }); if (!r.ok) break; await C.waitTitleNext(D); if (ch < 4) await C.tapTitle(D, 'Weiter mit Kapitel ' + (ch + 1)); }
    const reach = await D.ev(() => window.__reach); const acts = await D.ev(() => (M.__qaTrace || []).length);
    out.variants.push({ name: V.name, chapters: chs, problems: reach });
    console.log(V.name + ': ' + chs.map(c => 'K' + c.ch + (c.ok ? '✓' : '✗')).join(' ') + ' – nicht antippbar: ' + reach.length); reach.forEach(p => console.log('   ' + p.phase + ' ' + p.room + ' ' + p.kind + ' ' + p.id + ' [' + p.active + ']: ' + p.why));
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
