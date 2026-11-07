// Gemeinsame Helfer für die Browser-Tests der Oberfläche (qa/ui/*.js): Seite mit Spielstand öffnen, ruhig warten, gezeichnete Texte abgreifen.
'use strict';
const pw = require('playwright'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const HTML = process.env.MALA_HTML || path.join(ROOT, 'web', 'index.html');
const STATES = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa', 'results', 'browser', 'states.json'), 'utf8')).states;
function checker(tag) { const r = { n: 0, fails: 0, lines: [] };
  r.ck = (c, m) => { r.n++; const line = (c ? '  ok   ' : '  FEHL ') + m; if (!c) r.fails++; r.lines.push(line); console.log(line); return !!c; };
  r.section = (t) => console.log('\n' + tag + ' · ' + t); return r; }
// Spielstand aus qa/results/browser/states.json (regulär erspielte Stände) vor dem ersten Laden in den localStorage legen
async function open(browser, state, ctxOpt, extra) {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1280, height: 800 } }, ctxOpt || {}));
  const S = Object.assign({}, state ? STATES.find(s => s.name === state).storage : {}, extra || {});
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__i')) { sessionStorage.setItem('__i', '1'); localStorage.clear(); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } }, S);
  const p = await ctx.newPage(); p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p.errs.push('console: ' + m.text()); });
  const q = (process.env.MALA_QUERY || ''); await p.goto('file://' + HTML + q);
  await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 }); return p; }
// laufende Szenen, Karten und Sätze abwarten, bis das Spiel Eingaben annimmt
async function settle(p, ms) { await p.waitForFunction(() => { const E = M.E; if (E.screen === 'card' && E.card && !E.card.noSkip) { E.closeCard(); return false; } if (E.speech) E.endSpeech();
  return E.screen === 'game' && !E.busy && !E.speech && !E.dlg && !E.overlay && !E.menu && !E.transitioning; }, null, { timeout: ms || 60000, polling: 40 }); }
async function loadSlot(p, n) { await p.evaluate((n) => { M.TURBO = 20; M.E.loadGame(n || 1); }, n); await settle(p); await p.evaluate(() => { M.TURBO = 1; }); }
// alle Texte, die beim nächsten Bild gezeichnet werden (über M.text, also nach der Übersetzung gefragt)
const CAPTURE = () => { const L = []; const t0 = M.text; M.text = function (b, s, x, y, c) { L.push({ s: String(s), x: x, y: y, c: c }); return t0.apply(this, arguments); }; try { M.renderFrame(); } finally { M.text = t0; } return L; };
// logische Spielkoordinaten (320×200) → Seitenkoordinaten des Canvas
async function toPage(p, x, y) { return p.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(); return [r.left + (x + 0.5) / 320 * r.width, r.top + (y + 0.5) / 200 * r.height]; }, [x, y]); }
// Bildschirmmitte eines Hotspots, an der er auch getroffen wird (Spielkoordinaten im Bild)
const HS_POINT = (filter) => { const E = M.E, R = E.room, cam = Math.round(E.camX), out = [];
  R.hotspots.forEach(h => { const r = E.hsRect(h); if (!r) return; for (let y = Math.max(1, r[1]); y < Math.min(143, r[1] + r[3]); y += 2) for (let x = r[0]; x < r[0] + r[2]; x += 2) { if (x - cam < 2 || x - cam > 317) continue; if (E.hotspotAt(x, y) === h) { out.push({ id: h.id, x: x - cam, y, npc: h.npc || null, exit: !!E.uiExit(h) }); return; } } });
  return out; };
module.exports = { pw, ROOT, HTML, STATES, checker, open, settle, loadSlot, CAPTURE, toPage, HS_POINT };
