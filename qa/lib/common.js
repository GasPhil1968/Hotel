// Gemeinsame Bausteine der MALA-Simulationen: Pfadmodule laden, Titelmenü über den echten Zeiger-Eingabeweg bedienen,
// spielrelevanten Zustand vergleichbar machen.
'use strict';
const Module = require('module'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const TOOLS = path.join(ROOT, 'game', 'tools');
const VMD = path.join(__dirname, '..', 'vmdriver.js');

// './driver' aus game/tools zeigt in der VM auf vmdriver (wird von den Pfadmodulen nicht benutzt, D wird übergeben)
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (req, parent, ...rest) { if (req === './driver' && parent && /game[\\/]tools/.test(parent.filename)) return VMD; return origResolve.call(this, req, parent, ...rest); };

const pathCache = {};
// Toleranzmodus (nur nach Störungen in B/C/E): drive() aus k3play/k4play wählt bei unbekannter Auswahl die erste Nicht-Hinweis-Zeile statt abzubrechen
['k3play', 'k4play'].forEach(n => { const f = path.join(TOOLS, n + '.js'); const mod = require(f); if (mod.__qa) return; const play0 = mod.play;
  mod.play = function (D, opts) { const P = play0(D, opts); const drive0 = P.drive; P.drive = (prefs, until, o = {}) => drive0(prefs, until, (D.session && D.session.tolerant) ? Object.assign({}, o, { strict: false }) : o); return P; }; mod.__qa = true; });
// Lädt qa/paths/<name>.js als Modul, das in game/tools "wohnt" (relative requires wie './k4play' funktionieren)
function loadPath(name) {
  if (pathCache[name]) return pathCache[name];
  const src = fs.readFileSync(path.join(__dirname, '..', 'paths', name + '.js'), 'utf8');
  const fn = path.join(TOOLS, name + '.qa.js');
  const m = new Module(fn, module); m.filename = fn; m.paths = Module._nodeModulePaths(TOOLS); m._compile(src, fn);
  pathCache[name] = m.exports; return m.exports;
}

// Führt ein Pfadmodul aus. Liefert {ok, lines, err}. Erfolg wird NICHT aus der Konsolenausgabe des Skripts abgeleitet,
// sondern vom Aufrufer am Spielzustand geprüft; die Ausgabe dient als Protokoll und Fehlermeldung.
async function runPath(name, D, env, onLine, hooks) {
  const lines = []; let exitCode = 0;
  const out = (...a) => { const t = a.map(x => (typeof x === 'string' ? x : (x && x.message) || JSON.stringify(x))).join(' '); lines.push(t); if (onLine) onLine(t); };
  const proc = { env: Object.assign({}, env || {}), argv: ['node', name], get exitCode() { return exitCode; }, set exitCode(v) { exitCode = v; }, exit: (c) => { exitCode = c; } };
  const fn = loadPath(name);
  let err = null;
  try { await fn(Object.assign({ D, proc, console: { log: out, error: out, warn: out }, done: () => true }, hooks || {})); } catch (e) { err = e; out('EXCEPTION ' + (e.stack || e)); }
  const abort = lines.find(l => /^(ABBRUCH|FEHLER bei Schritt|FEHLER:)/.test(l));
  return { ok: !err && !abort && !exitCode, lines, err: err ? String(err.message || err) : (abort || (exitCode ? 'exitCode ' + exitCode : null)) };
}

// Titelmenü: Zeile mit passender Beschriftung über pointerDown/pointerUp antippen (derselbe Weg wie Finger/Maus über 99_main.js)
async function tapTitle(D, label, timeoutMs = 20000) {
  const t0 = D.vtime();
  for (;;) {
    const hit = await D.ev((lab) => { if (M.E.screen !== 'title') return null; M.renderFrame(); const L = M.titleLabels(); const i = L.findIndex(t => t.indexOf(lab) >= 0); if (i < 0) return { miss: L };
      for (let y = 0; y < 200; y++) { if (M.uiHit(160, y) === 't:' + i) { M.pointerDown(160, y + 2, true); M.pointerUp(160, y + 2, true); return { y: y + 2, label: L[i] }; } } return { noRow: i, L }; }, label);
    if (hit && hit.label) { await D.page.waitForTimeout(120); return hit; }
    if (D.vtime() - t0 > timeoutMs) throw new Error('Titelmenü: „' + label + '“ nicht antippbar: ' + JSON.stringify(hit));
    await D.page.waitForTimeout(100);
  }
}
// wartet auf das Titelbild im Modus "next" (nach dem Abspann) – der Abspann wird nicht übersprungen
async function waitTitleNext(D, ms = 400000) { return D.until(s => s.screen === 'title', ms, 'Titelbild nach dem Abspann').then(() => D.ev(() => ({ mode: M.E.titleMode, next: M.E.nextCh, labels: M.titleLabels() }))); }

// spielrelevanter Zustand (für Save/Load-Vergleiche): flüchtige Werte (playMs, Positionen in Pixeln, Zeitstempel) bleiben draußen
const VOLATILE_ROOM_KEYS = ['ferryAt', 'ferryGo', 'radioT'];
function relevant(GS) {
  const rooms = {}; Object.keys(GS.rooms || {}).sort().forEach(r => { const o = {}; Object.keys(GS.rooms[r] || {}).sort().forEach(k => { if (VOLATILE_ROOM_KEYS.indexOf(k) < 0) o[k] = GS.rooms[r][k]; }); rooms[r] = o; });
  const sortObj = o => { const r = {}; Object.keys(o || {}).sort().forEach(k => { r[k] = o[k]; }); return r; };
  return { phase: GS.phase, tod: GS.tod, active: GS.active, malaOn: GS.malaOn, roomMarko: GS.pos && GS.pos.marko && GS.pos.marko.room, roomMala: GS.malaOn ? (GS.pos && GS.pos.mala && GS.pos.mala.room) : null,   // ohne Mala im Spiel ist ihr Platz bedeutungslos (validate() ergänzt ihn beim Laden)
    flags: sortObj(GS.flags), inv: (GS.inv || []).slice(), notes: (GS.notes || []).slice().sort(), seen: sortObj(GS.seen), map: sortObj(GS.map), mapKnown: sortObj(GS.mapKnown), rooms, ended: !!GS.ended };
}
function diffRelevant(a, b) {
  const out = [];
  /* GS.flags.*: false/undefined/null/0 sind gleichbedeutend (das Spiel prüft Flags auf Wahrheitswert; Ladehaken schreiben teils explizit false) */
  const cmp = (p, x, y) => { if (JSON.stringify(x) === JSON.stringify(y)) return; if (/^GS\.flags\.[^.]/.test(p) && !x && !y) return; if (x && y && typeof x === 'object' && typeof y === 'object' && !Array.isArray(x)) { new Set([...Object.keys(x), ...Object.keys(y)]).forEach(k => cmp(p + '.' + k, x[k], y[k])); return; } out.push(p + ': ' + JSON.stringify(x) + ' ≠ ' + JSON.stringify(y)); };
  cmp('GS', a, b); return out;
}
function chapterOfPhase(ph) { if (!ph) return 0; if (/^k4/.test(ph)) return 4; if (/^k3/.test(ph)) return 3; if (/^k2/.test(ph)) return 2; return 1; }

module.exports = { ROOT, TOOLS, loadPath, runPath, tapTitle, waitTitleNext, relevant, diffRelevant, chapterOfPhase };
