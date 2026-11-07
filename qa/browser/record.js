// Nimmt einen regulären verketteten Durchlauf K1→K4 (VM, Produktionsskript) als Folge von Spielerhandlungen auf.
// Die Folge wird von qa/browser/uirun.js im echten Browser NUR über sichtbare Bedienelemente wiederholt.
//   node qa/browser/record.js [out.json] [--seed n] [--nb list|think]
'use strict';
const path = require('path'), fs = require('fs');
const { open } = require('../vmdriver'); const C = require('../lib/common');
const a = process.argv.slice(2); const out = a[0] && !a[0].startsWith('--') ? a[0] : path.join(__dirname, '..', 'results', 'browser', 'recording.json');
const seed = +(a[a.indexOf('--seed') + 1] || 1) || 1;

const INSTALL = function () {
  const R = window.__rec = []; const room = () => (M.E.room ? M.E.room.id : null);
  const ctx = () => ({ room: room(), active: M.GS.active, phase: M.GS.phase, scr: M.E.screen });
  const W = (obj, name, kind, fmt) => { const f = obj[name]; obj[name] = function () { try { R.push(Object.assign({ k: kind, a: fmt ? fmt.apply(null, arguments) : [].slice.call(arguments) }, ctx())); } catch (e) {} return f.apply(this, arguments); }; };
  W(M.TA, 'act', 'act', (v, id, it) => [v, id, it || null]);
  W(M.TA, 'exit', 'exit');
  W(M.TA, 'item', 'item', (v, x, y) => [v, x, y || null]);
  W(M.TA, 'switchTo', 'switch');
  W(M.TA, 'travel', 'travel');
  W(M.TA, 'pickNote', 'note');
  W(M.TA, 'skip', 'skip');
  W(M.TA, 'closeOverlay', 'close', (v) => [M.E.overlay ? M.E.overlay.kind : null, v === undefined ? null : v]);
  W(M.TA, 'combine', 'combine');
  W(M.TA, 'choose', 'chooseSub');
  const cd = M.E.chooseDone; M.E.chooseDone = function (i) { try { const o = M.E.dlg && M.E.dlg.opts[i]; R.push(Object.assign({ k: 'choose', a: [o ? o.t : null, o ? (o.id === undefined ? null : o.id) : null] }, ctx())); } catch (e) {} return cd.apply(this, arguments); };
  // TA.choose ruft chooseDone selbst; der Eintrag 'chooseSub' wird bei der Wiedergabe übersprungen
  W(M.E, 'walkPlayerTo', 'walkTo');
  W(M.E, 'openNotes', 'openNotes', () => []);
  W(M.E, 'switchChar', 'switchChar', () => []);
  W(M.E, 'setNbStyle', 'nbStyle');
  if (M.k3PeilTap) W(M, 'k3PeilTap', 'peil');
  const pu = M.pointerUp; M.pointerUp = function (x, y, t) { R.push(Object.assign({ k: 'tap', a: [x, y], ov: M.E.overlay ? M.E.overlay.kind : null, hit: M.uiHit ? M.uiHit(x, y) : null }, ctx())); return pu.apply(this, arguments); };
  // Rätsel, deren Lösung die Testskripte direkt in den Overlay-Zustand schreiben: Ziel festhalten, damit die Wiedergabe es antippen kann
  const so = M.E.closeOverlay; void so;
};

(async () => {
  const D = await open({ seed });
  await D.ev(INSTALL); await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; });
  // Rätselziele: vor jedem Überschreiben von ov.sel/ov.ord/ov.rd (nur Testskripte tun das) das Ziel protokollieren
  const snapOv = async () => D.ev(() => { const ov = M.E.overlay; if (!ov) return; if (ov.kind === 'arrange' || ov.kind === 'glyphs' || ov.kind === 'puzzle') window.__rec.push({ k: 'ovgoal', kind: ov.kind, ord: ov.ord ? ov.ord.slice() : null, rd: ov.rd ? JSON.parse(JSON.stringify(ov.rd)) : null, sel: ov.sel ? ov.sel.slice() : null, room: M.E.room && M.E.room.id }); });
  // D.ev abfangen: nach jedem Aufruf, der ein Overlay-Ziel setzt, den Zustand festhalten
  const ev0 = D.ev; D.ev = async (fn, arg) => { const src = fn.toString(); const r = await ev0(fn, arg); if (/ov\.(ord|rd|sel)\s*=/.test(src)) await snapOv(); return r; };
  const t0 = Date.now(); const names = { 1: 'walkthrough', 2: 'walkthrough2', 3: 'walkthrough3', 4: 'walkthrough4' };
  const chapters = [];
  await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
  for (let ch = 1; ch <= 4; ch++) {
    await D.ev((c) => window.__rec.push({ k: 'chapter', a: [c] }), ch);
    const r = await C.runPath(names[ch], D, {}); chapters.push({ ch, ok: r.ok, err: r.err });
    if (!r.ok) { console.error('Aufnahme abgebrochen in K' + ch + ': ' + r.err); process.exit(1); }
    const tn = await C.waitTitleNext(D); await D.ev((c) => window.__rec.push({ k: 'chapterEnd', a: [c] }), ch);
    if (ch < 4) await C.tapTitle(D, 'Weiter mit Kapitel ' + (ch + 1)); else chapters[3].title = tn;
  }
  const rec = await D.ev(() => window.__rec);
  const phases = await D.ev(() => M.GS.phase);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ seed, sha: D.sha, created: new Date().toISOString(), chapters, final: phases, actions: rec }, null, 0));
  const kinds = {}; rec.forEach(x => { kinds[x.k] = (kinds[x.k] || 0) + 1; });
  console.log('Aufnahme', out, rec.length, 'Einträge', JSON.stringify(kinds), ((Date.now() - t0) / 1000).toFixed(1) + 's', 'Fehler', D.errors.length);
})().catch(e => { console.error(e); process.exit(1); });
