// Regressionstests für die Funde der blinden Spieltests (echte Bedienung: Mausklicks auf das Spielbild, keine Abkürzung über M.TA).
//   node game/tools/blindfix.js <dump-ordner K4 (MALA_DUMPALL=… walkthrough4.js)> [dump-ordner K2]
//   MALA_HTML=<build>/index.html   anderer Bau
// Jeder Fund hat eine Kennung aus dem Blindbericht (z. B. K4A-B1) und genau einen Test.
const { open } = require('./driver');
const fs = require('fs'), path = require('path');
const D4 = process.argv[2], D2 = process.argv[3];
let pass = 0, fails = 0;
function ok(c, what) { if (c) { pass++; console.log('  ok   ' + what); } else { fails++; console.log('  FEHL ' + what); } return !!c; }
const dumps = (dir) => dir ? fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f)).sort().map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) : [];
(async () => {
  if (!D4 || !fs.existsSync(D4)) { console.log('Aufruf: node game/tools/blindfix.js <dump-ordner K4> [dump-ordner K2]'); process.exit(2); }
  const K4 = dumps(D4), K2 = dumps(D2);
  const D = await open({ turbo: 25 }); const page = D.page;
  const find = (L, sub) => { const d = L.find(x => x.label.indexOf(sub) >= 0); if (!d) throw new Error('Stand fehlt: ' + sub); const g = JSON.parse(JSON.stringify(d.GS)); delete g.flags['mala.lock']; return g; };
  const load = async (g) => { await D.ev((x) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: x }; if (!M.E.loadPreset('__t', 3)) throw new Error('Laden fehlgeschlagen'); }, g); await page.waitForTimeout(300); return D.drain(); };
  // echter Klick: Spielkoordinaten (320×200) → Bildschirm über das Rechteck der Leinwand
  const box = async () => page.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const tap = async (x, y) => { const b = await box(); const sx = b.x + (x + 0.5) * b.w / 320, sy = b.y + (y + 0.5) * b.h / 200; await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(120); };
  const said = (sub) => D.ev((x) => (M.__speechLog || []).some(l => l[1].indexOf(x) >= 0), sub);
  const T = async (id, name, fn) => { console.log('\n' + id + ' ' + name); const e0 = D.errors.length; try { await fn(); } catch (e) { fails++; console.log('  FEHL Abbruch: ' + e.message.split('\n')[0]); }
    if (D.errors.length > e0) { fails++; console.log('  FEHL JS-Fehler: ' + D.errors[e0].split('\n')[0]); } };
  // Marko tippt auf eine Figur, auf der Mala steht: das Menü gehört der Figur
  await T('K4A-B1', 'Mala verdeckt Hansi nicht', async () => {
    await load(find(K4, 'Mala findet Hansi'));
    await D.switchTo('marko');
    await D.ev(() => { const h = M.ACT.hansi, k = M.ACT.marko; k.x = h.x + 40; k.y = h.y; }); await page.waitForTimeout(1500);   // Marko neben den Pfeiler, die Kamera folgt
    const p = await D.ev(() => { const h = M.ACT.hansi, m = M.ACT.mala; m.x = h.x + 2; m.y = h.y; return { x: Math.round(h.x - M.E.camX), y: Math.round(h.y) - 20 }; });
    const hs = await D.ev((q) => { const h = M.E.hotspotAt(q.x + Math.round(M.E.camX), q.y); return h && (h.id || h.npc); }, p);
    ok(hs === 'hansi', 'Trefferfläche an der Stelle: ' + hs);
    await tap(p.x, p.y); await page.waitForTimeout(300);
    const title = await D.ev(() => M.E.pop && M.E.pop.title);
    ok(title === 'Hansi', 'Menü beim Tipp auf Hansi: „' + title + '“');
  });
  // Couch vor 14 Uhr ohne Kaffee: der Satz nennt die Džezva
  await T('K4A-B8', 'Fingerzeig auf die Džezva', async () => {
    const g = find(K4, 'Mama kommt heim'); g.phase = 'k4_pro'; delete g.flags['k4.p.coffee']; delete g.flags['k4.p.jasnaHome'];
    const w = await D.ev((x) => M.k4Missing(x), g);
    ok(/Džezva/.test(w || ''), 'Hinweis: „' + w + '“');
  });
  // Fernseher: nach dem Satz wieder aus (auch die Grafik)
  await T('K4A-B7', 'Fernseher geht wieder aus', async () => {
    await load(find(K4, 'Mamas Wohnung: Pantoffeln'));
    await D.act('use', 'tv'); await D.drain();
    ok(await D.ev(() => !M.RS('jwohnung').tv), 'Zustand tv aus');
  });
  // Gespräch mit Jasna: Markos Zeile zu den Pantoffeln nur einmal
  await T('K4A-B5', 'Pantoffel-Zeile nicht doppelt', async () => {
    await load(find(K4, 'Mama kommt heim'));
    const o = await D.ev(() => { const r = M.ROOMS.jwohnung; return !!r; });
    ok(o, 'Raum geladen');
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'rooms', 'jwohnung.js'), 'utf8');
    ok(!/t:'Die Pantoffeln an der Tür …'[^\n]*A\.m\('Die Pantoffeln an der Tür …'\)/.test(src), 'Zeile wird nicht im Skript wiederholt');
  });
  // Tobias und Jasna greifen dem Essen nicht vor
  await T('K4A-B4', 'Kein Dank für den Wein vor dem Essen', async () => {
    await load(find(K4, 'Tobias lernt Bosnisch'));
    await D.act('talk', 'tobias'); const s = await D.settle();
    const has = (s.dlg || []).some(t => t.indexOf('Danke für den Wein') >= 0);
    ok(s.dlg && !has, 'Auswahl ohne „Danke für den Wein“');
    if (s.dlg) { const bye = s.dlg.find(t => /Später|Bis|Tschüss|\(|Danke\b/.test(t)) || s.dlg[s.dlg.length - 1]; await D.ev(() => { const D0 = M.E.dlg; if (D0) M.E.chooseDone(D0.opts.length - 1); }); await D.drain(); }
  });
  // Zeigen: zwei Namensschilder nah beieinander, beide sichtbar (Pfeiler und Hansi)
  await T('K4A-B2', 'Namen bei „Zeigen“ verdecken sich nicht', async () => {
    await load(find(K4, 'Mala findet Hansi')); await D.switchTo('marko');
    const n = await D.ev(() => { const L = []; const t0 = M.text; M.text = function (fb, t, x, y, c, bg) { L.push(t); return t0.apply(this, arguments); };
      M.key('z'); M.E.camX = 0; return new Promise(r => setTimeout(() => { M.text = t0; r(L); }, 400)); });
    ok(n.indexOf('Pfeiler') >= 0 && n.some(t => /Hansi|Leere Stelle|\?\?\?/.test(t)), 'Schilder: ' + [...new Set(n)].filter(t => /Pfeiler|Hansi|Leere|\?\?\?/.test(t)).join(', '));
  });
  console.log('\nblindfix: ' + pass + ' ok, ' + fails + ' Fehler'); await D.close2(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
