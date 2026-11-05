// Gemeinsame Helfer für automatische Durchläufe (Playwright)
const { chromium } = require('playwright');
const path = require('path');
async function open(opts = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message + '\n' + (e.stack || '')));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  await page.goto('file://' + (process.env.MALA_HTML || path.join(__dirname, '..', '..', 'web', 'index.html')));
  await page.waitForTimeout(200);
  await page.evaluate((t) => { M.TEST = true; M.TURBO = t; try { localStorage.clear(); } catch (e) {} }, opts.turbo || 10);
  const D = {
    page, browser, errors,
    // offener Stadtplan zählt für die Tests als „room: 'map'“ (der Raum darunter steht in realRoom)
    st: () => page.evaluate(() => { const s = M.TA.status(); s.realRoom = s.room; if (s.map) s.room = 'map'; return s; }),
    async until(pred, ms = 20000, what = '') { const t0 = Date.now(); let s; while (Date.now() - t0 < ms) { s = await D.st(); if (pred(s)) return s; await page.waitForTimeout(40); } throw new Error('Zeitüberschreitung: ' + what + ' | ' + JSON.stringify(s)); },
    // wartet, bis das Spiel wieder auf den Spieler wartet (oder eine Auswahl/ein Overlay offen ist)
    async settle(ms = 30000) { const s = await D.until(s => (s.screen === 'game' && !s.busy && !s.speech && !s.card && !s.acting && !s.walk) || s.dlg || (s.overlay && !(s.map && (s.mapActing || s.speech))), ms, 'settle'); if (process.env.MALA_HINTLOG) await D.hintNote(s); return s; },
    // MALA_HINTLOG=datei: nach jeder Aktion festhalten, welche Hinweisthemen offen sind (für hintcheck)
    hintLog: { seen: {}, gaps: [] },
    async hintNote(s) { if (s.screen !== 'game' || s.dlg || (s.overlay && !s.map) || s.busy && !s.map) return; const r = await page.evaluate(() => ({ ids: M.hintsOpen(M.GS).map(h => h.id), ph: M.GS.phase, room: M.TA.status().room, ended: !!M.GS.ended })); if (r.ended) return; r.ids.forEach(id => { D.hintLog.seen[id] = (D.hintLog.seen[id] || 0) + 1; }); if (!r.ids.length) D.hintLog.gaps.push(r.ph + '@' + r.room); },
    async idle(ms = 30000) { const s = await D.settle(ms); if (s.dlg || s.overlay) throw new Error('Unerwartet offen: ' + JSON.stringify(s)); return s; },
    async act(verb, id, item) { if (item) { const s0 = await D.st(); if (s0.inv.indexOf(item) < 0 && s0.active === 'marko') throw new Error('Gegenstand nicht im Inventar: ' + item); } await page.evaluate(([v, i, it]) => M.TA.act(v, i, it), [verb, id, item]); await page.waitForTimeout(60); return D.settle(); },
    async exit(id) { await page.evaluate((i) => M.TA.exit(i), id); await page.waitForTimeout(60); return D.settle(); },
    async item(verb, id, other) { const s0 = await D.st(); [id, other].forEach(x => { if (x && s0.inv.indexOf(x) < 0 && s0.active === 'marko') throw new Error('Gegenstand nicht im Inventar: ' + x); }); await page.evaluate(([v, i, o]) => M.TA.item(v, i, o), [verb, id, other]); await page.waitForTimeout(60); return D.settle(); },
    async choose(sub) { await D.until(s => s.dlg, 20000, 'Auswahl für ' + sub); await page.evaluate((x) => M.TA.choose(x), sub); await page.waitForTimeout(60); return D.settle(); },
    async pickNote(id) { await D.until(s => s.overlay === 'notebook' || s.dlg, 20000, 'Notizbuch'); await page.evaluate((x) => M.TA.pickNote(x), id); await page.waitForTimeout(60); return D.settle(); },
    async close(v) { await D.until(s => s.overlay, 20000, 'Overlay'); await page.evaluate((x) => M.TA.closeOverlay(x), v); await page.waitForTimeout(60); return D.settle(); },
    // schließt alle Dokumente/Erinnerungen, bis nichts mehr offen ist (Auswahl bleibt offen)
    async drain(max = 12) { for (let i = 0; i < max; i++) { const s = await D.settle(); if (s.overlay && ['notebook', 'puzzle', 'arrange', 'halves', 'glyphs', 'map', 'peil'].indexOf(s.overlay) < 0) { await page.evaluate(() => M.TA.closeOverlay()); await page.waitForTimeout(60); continue; } return s; } return D.st(); },
    async combine(a, b) { return page.evaluate(([x, y]) => M.TA.combine(x, y), [a, b]); },
    async travel(loc) { await page.evaluate((l) => M.TA.travel(l), loc); await page.waitForTimeout(60); return D.drain(); },
    async switchTo(w) { await page.evaluate((x) => M.TA.switchTo(x), w); await page.waitForTimeout(100); return D.settle(); },
    async shot(file) { await page.screenshot({ path: file }); },
    async ev(fn, arg) { return page.evaluate(fn, arg); },
    hasNote: (id) => page.evaluate((x) => M.GS.notes.indexOf(x) >= 0, id),
    flag: (k) => page.evaluate((x) => M.GS.flags[x], k),
    async close2() { if (process.env.MALA_HINTLOG) require('fs').writeFileSync(process.env.MALA_HINTLOG, JSON.stringify(D.hintLog)); await browser.close(); }
  };
  return D;
}
module.exports = { open };
