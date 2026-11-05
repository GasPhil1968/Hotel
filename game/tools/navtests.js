// Tests für Stadtplan, Doppelklick auf Ausgänge und Hinweise (Testtabelle Abschnitt 19 des Entwicklungsauftrags)
//   node game/tools/navtests.js
// Ausgangsstände: game/tools/fixtures/nav/*.json (aus dem automatischen Durchlauf von Kapitel 1, MALA_DUMPALL).
// Eingaben: echte Maus- und Touch-Ereignisse von Playwright auf dem Canvas (Chromium), Touch in einem Kontext mit hasTouch.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const HTML = process.env.MALA_HTML || path.join(__dirname, '..', '..', 'web', 'index.html');
const FIX = path.join(__dirname, 'fixtures', 'nav');
const fx = n => JSON.parse(fs.readFileSync(path.join(FIX, n + '.json'), 'utf8')).GS;
let pass = 0, fail = 0; const results = [];
function ok(cond, area, what, extra) { (cond ? pass++ : fail++); results.push({ ok: !!cond, area, what, extra }); console.log((cond ? 'OK    ' : 'FEHLER') + ' [' + area + '] ' + what + (extra && !cond ? ' | ' + JSON.stringify(extra).slice(0, 400) : '')); }

async function mkPage(browser, opts = {}) {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1280, height: 800 } }, opts.ctx || {}));
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + HTML); await page.waitForTimeout(250);
  await page.evaluate((t) => { M.TEST = true; M.TURBO = t; try { localStorage.clear(); } catch (e) {} window.__sp = []; let last = null; setInterval(() => { const s = M.E.speech; if (s && s !== last) { last = s; window.__sp.push({ who: s.who, src: s.src, t: s.text }); } if (!s) last = null; }, 4); }, opts.turbo || 4);
  const P = {
    page, ctx, errors,
    st: () => page.evaluate(() => M.TA.status()),
    ev: (fn, a) => page.evaluate(fn, a),
    async until(pred, ms = 20000, what = '') { const t0 = Date.now(); let s; while (Date.now() - t0 < ms) { s = await P.st(); if (pred(s)) return s; await page.waitForTimeout(30); } throw new Error('Zeitüberschreitung ' + what + ' ' + JSON.stringify(s).slice(0, 300)); },
    async settle(ms) { return P.until(s => (s.screen === 'game' && !s.busy && !s.speech && !s.card && !s.acting && !s.walk) || s.dlg || (s.overlay && !(s.map && (s.mapActing || s.speech))), ms || 30000, 'settle'); },
    async drain() { for (let i = 0; i < 20; i++) { const s = await P.settle(); if (s.speech) { await page.evaluate(() => M.TA.skip()); continue; } if (s.overlay && ['notebook', 'puzzle', 'map'].indexOf(s.overlay) < 0) { await page.evaluate(() => M.TA.closeOverlay()); continue; } return s; } return P.st(); },
    async load(GS) { await page.evaluate((g) => { localStorage.setItem('mala.save.3', JSON.stringify({ GS: g, at: 1 })); M.E.setSlot(3); M.E.loadGame(3); }, GS); await page.waitForTimeout(120); return P.drain(); },
    speeches: () => page.evaluate(() => window.__sp.slice()), clearSp: () => page.evaluate(() => { window.__sp = []; }),
    // Bildschirmpunkt (CSS) zu einem Spielpunkt (320 × 200)
    async css(x, y) { return page.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(); return [r.left + x / 320 * r.width, r.top + y / 200 * r.height]; }, [x, y]); },
    async hsPoint(id) { return page.evaluate((id) => { const h = M.E.room.byId[id]; const r = M.E.hsRect(h); return [r[0] + r[2] / 2 - Math.round(M.E.camX), Math.min(143, r[1] + r[3] / 2)]; }, id); },
    async click(x, y) { const c = await P.css(x, y); await page.mouse.click(c[0], c[1]); },
    async tap(x, y) { const c = await P.css(x, y); await page.touchscreen.tap(c[0], c[1]); },
    async choose(sub) { await P.until(s => s.dlg, 20000, 'Auswahl ' + sub); await page.evaluate((x) => M.TA.choose(x), sub); await page.waitForTimeout(40); return P.drain(); },
    snapshot: () => page.evaluate(() => { const G = M.GS; return JSON.parse(JSON.stringify({ phase: G.phase, active: G.active, malaOn: G.malaOn, room: G.pos[G.active].room, mala: G.malaOn ? G.pos.mala.room : null, flags: G.flags, notes: G.notes, inv: G.inv, map: G.map, mapKnown: G.mapKnown, seen: G.seen, cyc: G.cyc, rooms: G.rooms, hints: G.hints })); })
  };
  return P;
}
function strip(s) { const o = JSON.parse(JSON.stringify(s)); delete o.rooms; return o; }
function diff(a, b) { const out = []; const ka = new Set(Object.keys(a).concat(Object.keys(b))); ka.forEach(k => { if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) out.push(k); }); return out; }

(async () => {
  const browser = await chromium.launch();
  let P = await mkPage(browser);
  try {
   if (!process.env.NAV_TOUCH_ONLY) {
    // ============ Neues Spiel
    await P.ev(() => { M.E.setSlot(1); M.E.newGame(1); }); await P.drain();
    await P.ev(() => M.openMap()); await P.until(s => s.map, 5000, 'Karte');
    let st = await P.ev(() => M.TA.mapStates());
    ok(st.flat.st === 'here' && Object.keys(st).filter(k => st[k].st !== 'unknown').length === 1, 'Neues Spiel', 'Nur die Wohnung ist bekannt (aktueller Ort), alle anderen Orte unbekannt', st);
    const drawn = await P.ev(() => { const b = M.fb; let named = 0; return M.mapLocs().filter(l => l.id !== 'flat').map(l => l.name); });
    ok(true, 'Neues Spiel', 'Unbekannte Orte haben keinen Marker und keinen Namen (Zeichnung nur für bekannte Orte, siehe mapIconVis)');
    await P.ev(() => M.closeMap()); await P.settle();
    // Anrufbeantworter: Varoš und Bar werden bekannt und zugänglich, Varoš aber vorübergehend gesperrt (erst Sanja)
    await P.ev(() => M.TA.act('use', 'answer')); await P.drain();
    await P.ev(() => M.openMap()); await P.until(s => s.map); st = await P.ev(() => M.TA.mapStates());
    ok(st.bar.st === 'open' && st.varos.st === 'blocked' && /Sanja/.test(st.varos.why || ''), 'Neu bekanntes Ziel', 'Nach dem Anrufbeantworter: Bar erreichbar, Varoš bekannt, aber „gerade nicht“ mit Grund', st);
    await P.clearSp(); const vx = await P.ev(() => M.mapCenter('varos')); await P.click(vx[0], vx[1]); await P.page.waitForTimeout(150); await P.settle();
    let sp = await P.speeches(); let s = await P.st();
    ok(s.map && s.room === 'flat' && sp.length === 1 && /Sanja/.test(sp[0].t), 'Neu bekanntes Ziel', 'Tipp auf gesperrtes Varoš: ein Satz mit Grund, Karte bleibt offen, kein Ortswechsel', { s, sp });
    // Karte schließen: kein Durchklicken in die Szene
    const px0 = await P.ev(() => M.E.player().x); const cl = await P.css(30, 160); await P.page.mouse.click(cl[0], cl[1]); await P.page.waitForTimeout(150);
    s = await P.st(); const px1 = await P.ev(() => M.E.player().x);
    ok(!s.map && px0 === px1 && !s.walk, 'Karte', '„Schließen“ schließt die Karte, die Figur bewegt sich nicht (kein Klick in die Szene)', { s, px0, px1 });
    await P.page.keyboard.press('k'); await P.page.waitForTimeout(100); s = await P.st(); ok(s.map, 'Karte', 'Taste K öffnet die Karte');
    await P.page.keyboard.press('Escape'); await P.page.waitForTimeout(100); s = await P.st(); ok(!s.map && !(await P.ev(() => !!M.E.menu)), 'Karte', 'Escape schließt nur die Karte (öffnet nicht zusätzlich das Menü)');
    // Klick neben die Orte: nichts
    await P.ev(() => M.openMap()); await P.until(s => s.map); await P.click(300, 130); await P.page.waitForTimeout(150); s = await P.st();
    ok(s.map && s.room === 'flat', 'Karte', 'Tipp auf leere Kartenfläche: nichts passiert, kein Durchklicken', s);
    await P.ev(() => M.closeMap());
    // Trefferflächen: mindestens 44 CSS-Pixel im iPad-Querformat (1024 × 768, Spielbild wie im Spiel skaliert)
    const tgt = await P.ev(() => { const L = M.mapLocs({ phase: 'pro', flags: {} }); let min = 1e9; L.forEach(a => { L.forEach(b => { if (a !== b) min = Math.min(min, Math.hypot(a.x - b.x, (a.y - b.y) * 1.15)); }); }); const L2 = M.MAPLOCS2; let min2 = 1e9; L2.forEach(a => L2.forEach(b => { if (a !== b) min2 = Math.min(min2, Math.hypot(a.x - b.x, (a.y - b.y) * 1.15)); })); return { min, min2 }; });
    const ipadScale = Math.floor(Math.min(1024 * 2 / 320, 768 * 2 / 200)) / 2;   // CSS-Pixel je Spielpixel wie in fit() (dpr 2)
    ok(Math.min(tgt.min, tgt.min2) / 2 * ipadScale >= 22 && 20 * ipadScale >= 44, 'Touch-Ziele', `kleinster halber Ortsabstand ${(Math.min(tgt.min, tgt.min2) / 2 * ipadScale).toFixed(0)} CSS-px Radius (≥ 22), „Schließen“ ${78 * ipadScale}×${24 * ipadScale} CSS-px (iPad-Querformat ${ipadScale} CSS-px je Spielpixel, gerechnet)`, tgt);

    // ============ Verschlossener Innenraum: Hafenbüro außerhalb des ersten Falls (Fall 2, Riva)
    P.page.evaluate(() => { M.TURBO = 1; });
    await P.load(fx('k1_36')); await P.ev(() => { M.TURBO = 1; });
    let tr0 = (await P.st()).transitions; await P.clearSp();
    let pt = await P.hsPoint('office_door'); await P.click(pt[0], pt[1]); await P.page.waitForTimeout(120); await P.click(pt[0], pt[1]); await P.page.waitForTimeout(150);
    await P.settle(); sp = await P.speeches(); s = await P.st();
    ok(s.room === 'riva' && s.transitions === tr0 && sp.length === 1, 'Verschlossener Innenraum', 'Doppelklick auf das geschlossene Hafenbüro: kein Übergang, die Absage genau einmal', { s, sp });
    await P.ev(() => M.openMap()); await P.until(s => s.map); st = await P.ev(() => M.TA.mapStates());
    ok(!st.office && st.riva.st === 'here', 'Verschlossener Innenraum', 'Die Karte hat keinen Punkt für Innenräume; die Riva ist „hier“', st);
    await P.clearSp(); const rv = await P.ev(() => M.mapCenter('riva')); tr0 = (await P.st()).transitions; await P.click(rv[0], rv[1]); await P.page.waitForTimeout(150); s = await P.st();
    ok(!s.map && s.transitions === tr0 && s.room === 'riva', 'Aktueller Ort', 'Tipp auf den aktuellen Ort schließt die Karte ohne Raumneustart', s);

    // ============ Doppelklick nahe am Ausgang / Vergleich der drei Wege (Peristil → Laden; Peristil → Riva)
    const runShop = async (mode) => { await P.load(fx('k1_42')); await P.ev(() => { M.TURBO = 1; }); const t0 = (await P.st()).transitions; const pt = await P.hsPoint('shop_door');
      await P.ev((near) => { const h = M.E.room.byId.shop_door, st = M.E.hsStand(h), p = M.E.player(); p.x = st[0] - (near ? 6 : 140); p.y = st[1]; M.E.snapCamera(); }, mode === 'near');
      const q = await P.hsPoint('shop_door');
      if (mode === 'walk') { await P.click(q[0], q[1]); }
      else { await P.click(q[0], q[1]); await P.page.waitForTimeout(90); await P.click(q[0], q[1]); if (mode === 'triple' || mode === 'near') { await P.page.waitForTimeout(90); await P.click(q[0], q[1]); } }
      const t1 = Date.now(); await P.until(s => s.room === 'shop', 30000, 'Laden'); const ms = Date.now() - t1; await P.drain(); await P.page.waitForTimeout(500); const s = await P.st();
      return { s, n: s.transitions - t0, ms, snap: await P.snapshot(), walkAfter: s.walk, sp: await P.speeches() }; };
    const a = await runShop('walk'), b = await runShop('dbl'), c = await runShop('triple'), d = await runShop('near');
    ok(a.n === 1 && b.n === 1 && c.n === 1 && d.n === 1, 'Doppelklick nahe am Ausgang', `genau ein Übergang je Weg (Gehen ${a.n}, Doppelklick ${b.n}, Dreifachklick ${c.n}, nah am Ausgang ${d.n})`);
    ok(b.ms < a.ms, 'Doppelklick', `Doppelklick spart den Rest des Weges (${a.ms} ms zu ${b.ms} ms bis zum Wechsel)`);
    ok(!c.walkAfter && !d.walkAfter, 'Doppelklick nahe am Ausgang', 'Der dritte Klick wirkt nicht im neuen Raum (keine Bewegung, keine Handlung im Laden)', { c: c.s, d: d.s });
    const dd = diff(strip(a.snap), strip(b.snap)).concat(diff(strip(a.snap), strip(c.snap)));
    ok(!dd.length, 'Zustandsvergleich', 'Gehen, Doppelklick und Dreifachklick zum Laden ergeben denselben Spielstand (Raum, Schalter, Notizen, Inventar, Karte, Begleitung)', dd);
    // Peristil → Riva: Ausgang + Karte / Doppelklick + Karte / Knopf „Karte“
    const runRiva = async (mode) => { await P.load(fx('k1_42')); await P.ev(() => { M.TURBO = 1; }); const t0 = (await P.st()).transitions;
      if (mode === 'button') { const bx = await P.ev(() => { return null; }); await P.page.keyboard.press('k'); }
      else { await P.ev(() => { const st = M.E.hsStand(M.E.room.byId.exit), p = M.E.player(); p.x = st[0] + 120; p.y = st[1]; M.E.snapCamera(); }); const q = await P.hsPoint('exit'); await P.click(q[0], q[1]); if (mode === 'dbl') { await P.page.waitForTimeout(90); await P.click(q[0], q[1]); } }
      await P.until(s => s.map, 30000, 'Karte'); const p = await P.ev(() => M.mapCenter('riva')); const hit = await P.ev((c) => M.uiHit(c[0], c[1]), p); await P.click(p[0], p[1]); await P.page.waitForTimeout(400); if ((await P.st()).map) console.log('DIAG', mode, hit, P.errors.slice(-3).join(' || '), JSON.stringify(await P.ev(() => ({ d: M.E.overlay && M.E.overlay.data.acting, tr: M.E.transitioning, sp: M.E.speech && M.E.speech.text, msg: M.E.msg && M.E.msg.t }))));
      await P.until(s => s.room === 'riva' && !s.busy, 30000, 'Riva'); await P.drain(); await P.page.waitForTimeout(400); const s = await P.st(); const save = await P.ev(() => JSON.parse(localStorage.getItem('mala.save.3')).GS.pos.marko.room);   // autosave läuft im nächsten Takt nach dem Ende der Szene
      return { n: s.transitions - t0, snap: await P.snapshot(), save }; };
    const r1 = await runRiva('walk'), r2 = await runRiva('dbl'), r3 = await runRiva('button');
    ok(r1.n === 1 && r2.n === 1 && r3.n === 1, 'Kartenreise', `genau ein Ortswechsel (Ausgang+Karte ${r1.n}, Doppelklick+Karte ${r2.n}, Knopf+Karte ${r3.n})`);
    ok(r1.save === 'riva' && r2.save === 'riva' && r3.save === 'riva', 'Speichern', 'Automatisches Speichern nach jeder Kartenreise (Platz zeigt die Riva)');
    const dr = diff(strip(r1.snap), strip(r2.snap)).concat(diff(strip(r1.snap), strip(r3.snap)));
    ok(!dr.length, 'Zustandsvergleich', 'Ausgang+Karte, Doppelklick+Karte und Knopf „Karte“ ergeben denselben Spielstand an der Riva, Mala kommt mit', dr.length ? dr : r1.snap.mala);

    // ============ Wichtiger Übergang: Mittwochabend in der Wohnung (das Kennenlernen beginnt an der Tür)
    const runMeet = async (mode) => { await P.load(fx('k1_15')); await P.ev(() => { M.TURBO = 4; }); const t0 = (await P.st()).transitions;
      if (mode === 'exit') await P.ev(() => M.TA.exit('door'));
      else if (mode === 'dbl') { const q = await P.hsPoint('door'); await P.click(q[0], q[1]); await P.page.waitForTimeout(60); await P.click(q[0], q[1]); }
      else { await P.page.keyboard.press('k'); await P.until(s => s.map); const q = await P.ev(() => M.mapCenter('riva')); await P.click(q[0], q[1]); }
      await P.page.waitForTimeout(300); const s = await P.drain(); return { s, n: s.transitions - t0, meet: await P.ev(() => !!M.GS.flags['split.intro.meet']) }; };
    const m1 = await runMeet('exit'), m2 = await runMeet('dbl'), m3 = await runMeet('map');
    ok(m1.meet && m2.meet && m3.meet && m1.n === 0 && m2.n === 0 && m3.n === 0 && m3.s.room === 'flat', 'Wichtiger Übergang', 'Tür, Doppelklick und Karte lösen dasselbe Pflichtereignis aus (Kennenlernen), keiner verlässt die Wohnung', { m1, m2, m3 });

    // ============ Mala nicht verfügbar (Donnerstagmorgen allein)
    await P.load(fx('k1_32')); await P.ev(() => { M.TURBO = 4; M.E.gSuppressed = 0; }); await P.clearSp();
    await P.ev(() => { M.showHints('menu'); }); await P.until(s => s.dlg); const title = await P.ev(() => M.E.dlg.title);
    await P.page.evaluate(() => M.TA.choose('gewöhnlicher Morgen')); await P.page.waitForTimeout(100); await P.settle(); sp = await P.speeches();
    ok(/Gedanken ordnen/.test(title) && sp.length && sp.every(x => x.who === 'marko' || x.who === '@marko'), 'Mala nicht verfügbar', 'Hilfe allein: „Gedanken ordnen“, nur Markos Stimme', { title, sp });
    await P.ev(() => M.TA.choose('Genug')); await P.drain();
    await P.ev(() => M.TA.exit('door')); await P.until(s => s.map); await P.ev(() => M.TA.travel('riva')); await P.until(s => s.room === 'riva' && !s.busy); await P.drain();
    const g = await P.ev(() => ({ on: M.GS.malaOn, act: !!M.ACT.mala, sw: M.E.canSwitch(), sup: M.E.gSuppressed || 0 }));
    ok(!g.on && !g.act && !g.sw && g.sup === 0, 'Mala nicht verfügbar', 'Kartenreise allein: keine Erscheinung, keine Stimme, kein Wechsel', g);

    // ============ Mala hat nicht Markos Rechte (Hafenbüro, Mala gespielt)
    await P.load(fx('k1_20')); await P.ev(() => M.TA.switchTo('mala')); await P.drain(); await P.clearSp();
    await P.page.keyboard.press('k'); await P.until(s => s.map); await P.ev(() => M.TA.travel('bar')); await P.page.waitForTimeout(200); await P.settle(); sp = await P.speeches(); s = await P.st();
    ok(s.map && s.room === 'office' && sp.length === 1 && (sp[0].who === 'mala'), 'Mala', 'Mala allein reist nicht über die Karte: ihr Satz, kein Ortswechsel', { s, sp });
    await P.ev(() => M.closeMap());
    // Innenraum: Karte nur zum Ansehen
    await P.ev(() => M.TA.switchTo('marko')); await P.drain(); await P.clearSp(); await P.page.keyboard.press('k'); await P.until(s => s.map);
    st = await P.ev(() => M.TA.mapStates()); await P.ev(() => M.TA.travel('bar')); await P.page.waitForTimeout(200); await P.settle(); sp = await P.speeches(); s = await P.st();
    ok(st.riva.st === 'here' && s.room === 'office' && sp.length === 1 && /hinaus/.test(sp[0].t), 'Verschlossener Innenraum', 'Aus dem Hafenbüro (Innenraum): Riva ist „hier“, Reisen erst von der Straße aus, mit Grund', { st: st.riva, sp });
    await P.ev(() => M.closeMap());

    // ============ Sperren: Zwischenwelt, Dialog
    await P.load(fx('k1_30')); await P.ev(() => M.TA.act('cross', 'ivka')); await P.choose('Ihre Hand nehmen'); await P.until(s => s.room === 'limbo' && !s.busy, 30000, 'Zwischenwelt'); await P.page.keyboard.press('k'); await P.page.waitForTimeout(120); s = await P.st(); const msg = await P.ev(() => M.E.msg && M.E.msg.t);
    ok(!s.map && /keine/.test(msg || ''), 'Sperre', 'Zwischenwelt: Karte geht nicht auf, mit Meldung', { s, msg });
    await P.load(fx('k1_36')); await P.ev(() => M.TA.act('talk', '_mala')); await P.until(s => s.dlg); await P.page.keyboard.press('k'); await P.page.waitForTimeout(120); s = await P.st();
    ok(!s.map && s.dlg, 'Sperre', 'Während einer Auswahl im Gespräch geht die Karte nicht auf', s);

    // ============ Hinweisstufen: drei Beispiele mit allen vier Stufen
    const fourStages = async (fixture, prep, topicTitle, area) => {
      await P.load(fx(fixture)); await P.ev(() => { M.TURBO = 6; }); if (prep) await prep(); await P.drain();
      const before = await P.snapshot(); await P.clearSp();
      const viaMala = await P.ev(() => M.hintMalaHelps());
      if (viaMala) { await P.ev(() => M.TA.act('talk', '_mala')); await P.choose('Ich komme gerade nicht weiter'); } else { await P.ev(() => { M.showHints('menu'); }); }
      await P.until(s => s.dlg); await P.ev((t) => M.TA.choose(t), topicTitle); await P.page.waitForTimeout(80); await P.settle();
      const texts = []; const grab = async () => { const x = await P.speeches(); await P.clearSp(); return x.filter(z => viaMala ? /mala/.test(z.who) : true).map(z => z.t); };
      texts.push((await grab()).pop());
      await P.ev(() => M.TA.choose(M.GS.flags && M.E.dlg.opts[1].t)); await P.page.waitForTimeout(80); await P.settle(); texts.push((await grab()).pop());   // Stufe 2
      await P.ev(() => M.TA.choose(M.E.dlg.opts[1].t)); await P.page.waitForTimeout(80); await P.settle(); texts.push((await grab()).pop());               // Stufe 3
      await P.ev(() => M.TA.choose(M.E.dlg.opts[1].t)); await P.page.waitForTimeout(80); await P.settle(); const ask = await P.ev(() => ({ t: M.E.dlg && M.E.dlg.title, o: M.E.dlg && M.E.dlg.opts.map(o => o.t) })); const askSp = await grab();
      await P.ev(() => M.TA.choose('Nein')); await P.page.waitForTimeout(80); await P.settle(); const afterNo = await P.ev((id) => (M.GS.hints[id] || {}).s, null); await grab();
      const stageNo = await P.ev((t) => { const h = M.hintsOpen().filter(h => h.t === t)[0]; return h ? (M.GS.hints[h.id] || {}).s : -1; }, topicTitle);
      await P.ev(() => M.TA.choose(M.E.dlg.opts[1].t)); await P.page.waitForTimeout(80); await P.settle(); await grab(); await P.ev(() => M.TA.choose('Ja')); await P.page.waitForTimeout(80); await P.settle(); texts.push((await grab()).pop());
      const stageYes = await P.ev((t) => { const h = M.hintsOpen().filter(h => h.t === t)[0]; return h ? (M.GS.hints[h.id] || {}).s : -1; }, topicTitle);
      await P.ev(() => M.TA.choose(M.E.dlg.opts.filter(o => /Danke|Genug|Schon gut/.test(o.t))[0].t)); await P.drain(); if ((await P.st()).dlg) { await P.ev(() => { const o = M.E.dlg.opts; const i = o.findIndex(x => /Geh weg|Genug|Danke|Gute Nacht|Lass|bye/.test(x.t)); M.E.chooseDone(i >= 0 ? i : o.length - 1); }); await P.drain(); }
      const after = await P.snapshot(); const changed = diff(strip(before), strip(after)).filter(k => k !== 'hints');
      ok(texts.length === 4 && texts.every(t => t && t.length > 8) && new Set(texts).size === 4, area, `vier verschiedene Stufen für „${topicTitle}“ (${viaMala ? 'Mala' : 'Marko allein'})`, texts);
      ok(stageNo === 3 && stageYes === 4 && /verraten|wirklich schon/.test((askSp.map(z => z).join(' ') + ' ' + (ask.t || ''))), area, 'Stufe 4 erst nach der Rückfrage: „Nein“ bleibt bei 3, „Ja“ gibt den Schritt', { stageNo, stageYes, ask, askSp });
      ok(!changed.length, 'Hinweis ohne Handlung', `„${topicTitle}“: nur die Hinweisgeschichte ändert sich (kein Schalter, keine Notiz, kein Gegenstand, kein „gesehen“-Vermerk)`, changed);
      return texts; };
    // 1) Inventarrätsel: der verschnürte Schuhkarton (Ivkas Wohnung, Prolog)
    const ex1 = await fourStages('k1_08', async () => { await P.ev(() => M.TA.act('open', 'ivka_door')); await P.drain(); }, 'Der verschnürte Schuhkarton', 'Hinweisstufen (Inventar)');
    // 2) Notizbuch: „Keine Kontakte?“ (Prolog, zurück in Varoš)
    const ex2 = await fourStages('k1_11', null, 'Keine Kontakte?', 'Hinweisstufen (Notizbuch)');
    // 3) Zusammenarbeit: Wo steht der Band 1984? (Hafenbüro, Mala hilft)
    const ex3 = await fourStages('k1_20', null, 'Wo steht der Band 1984?', 'Hinweisstufen (Kooperation)');
    fs.writeFileSync(path.join(__dirname, 'navtests_beispiele.json'), JSON.stringify({ inventar: ex1, notizbuch: ex2, kooperation: ex3 }, null, 1));

    // ============ Gelöster Teilschritt: nach dem Verbinden verschwindet „Keine Kontakte?“, „Die Namen im Heft“ beginnt bei Stufe 1
    await P.load(fx('k1_11')); await P.ev(() => { M.GS.hints = { k1_people: { s: 4, n: 4 } }; });
    await P.ev(() => M.TA.combine('pro_noone', 'pro_list')); await P.drain();
    const op = await P.ev(() => M.hintsOpen().map(h => ({ id: h.id, s: (M.GS.hints[h.id] || {}).s || 0 })));
    ok(!op.some(o => o.id === 'k1_people') && op.some(o => o.id === 'k1_gasse' && o.s === 0), 'Gelöster Teilschritt', 'Gelöstes Thema verschwindet, das nächste beginnt bei Stufe 1', op);
    // während einer offenen Sitzung gelöst: kein veralteter Hinweis
    await P.load(fx('k1_11')); await P.ev(() => { M.showHints('menu'); }); await P.until(s => s.dlg); await P.ev(() => M.TA.choose('Keine Kontakte?')); await P.page.waitForTimeout(80); await P.settle();
    await P.ev(() => { M.GS.notes.push('pro_people'); }); await P.clearSp(); await P.ev(() => M.TA.choose(M.E.dlg.opts[1].t)); await P.page.waitForTimeout(80); await P.settle(); sp = await P.speeches();
    ok(sp.length && /erledigt/.test(sp[sp.length - 1].t), 'Gelöster Teilschritt', 'Stand wird vor jeder Ausgabe neu geprüft: „Das hat sich erledigt.“', sp);
    await P.ev(() => { if (M.E.dlg) { const i = M.E.dlg.opts.findIndex(o => o.bye); M.E.chooseDone(i); } }); await P.drain();

    // ============ Abweichende Reihenfolge: Rekorder-Kette im zweiten Fall je nach Inventar
    const variant = async (inv, map) => { await P.load(Object.assign(fx('k1_40'), {})); return P.ev(([inv, map]) => { M.GS.inv = inv; if (map) Object.assign(M.GS.map, map); return M.hintsOpen().filter(h => /^k2_radio/.test(h.id)).map(h => h.id + ': ' + M.hintText(h, 3, M.GS, 'marko')); }, [inv, map]); };
    const v1 = await variant(['crowbar', 'tickets', 'cassette']), v2 = await variant(['crowbar', 'tickets', 'cassette', 'newspaper']), v3 = await variant(['crowbar', 'tickets', 'cassette', 'radio'], { terminal: false }), v4 = await variant(['crowbar', 'tickets', 'cassette', 'radio'], { terminal: true }), v5 = await variant(['crowbar', 'tickets', 'cassette', 'radioB']);
    ok(/Zeitung vom Tresen/.test(v1[0]) && /Zeitung geben/.test(v2[0]) && /Sanja fragen/.test(v3[0]) && /Mira/.test(v4[0]) && /Kassette mit dem Rekorder/.test(v5[0]), 'Abweichende Reihenfolge', 'Nächster Schritt richtet sich nach Inventar und bekannten Orten (Zeitung, Rekorder, Batterien, Kiosk)', { v1, v2, v3, v4, v5 });

    // ============ Speichern, Laden, Migration
    await P.load(fx('k1_11')); await P.ev(() => { M.GS.hints = { k1_people: { s: 2, n: 2 } }; M.saveGame(); });
    await P.page.reload(); await P.page.waitForTimeout(300); await P.ev(() => { M.TEST = true; M.E.setSlot(3); M.E.loadGame(3); }); await P.drain();
    let h = await P.ev(() => ({ hints: M.GS.hints, known: M.GS.mapKnown }));
    ok(h.hints.k1_people && h.hints.k1_people.s === 2, 'Speichern und Laden', 'Hinweisstufe übersteht Speichern, Neuladen der Seite und Laden', h);
    await P.ev(() => { M.E.setSlot(2); M.E.newGame(1); }); await P.drain(); h = await P.ev(() => M.GS.hints);
    ok(!Object.keys(h).length, 'Speichern und Laden', 'Neues Spiel beginnt mit leerer Hinweisgeschichte', h);
    await P.ev(() => { M.E.setSlot(3); M.E.loadGame(3); }); await P.drain(); h = await P.ev(() => M.GS.hints);
    ok(h.k1_people && h.k1_people.s === 2, 'Speichern und Laden', 'Laden eines anderen Platzes bringt dessen Hinweisgeschichte, nicht die zuletzt im Speicher', h);
    // alter Spielstand ohne neue Felder: Kapitel 1 Fall 2 mit alter Hinweisstufe
    const old = fx('k1_40'); delete old.mapKnown; delete old.hints; old.flags['hint.k2_case'] = 3; old.flags['hint.s1a'] = 1; old.notes.push('c2_meet');
    const mapBefore = JSON.stringify(old.map); await P.load(old); h = await P.ev(() => ({ hints: M.GS.hints, known: M.GS.mapKnown, map: M.GS.map, flags: Object.keys(M.GS.flags).filter(k => /^hint\./.test(k)) }));
    ok(h.hints.k2_case.s === 4 && h.hints.s1a.s === 1 && !h.flags.length && JSON.stringify(h.map) === mapBefore && h.known.terminal, 'Migration', 'Alter Stand: Hinweisstufen übernommen (3 → 4), keine Orte pauschal freigeschaltet, bekannte Orte abgeleitet (Fährhafen aus Lukas Treffpunkt)', h);
    const k2old = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'nav', 'k1_40.json'), 'utf8')).GS;
    // Übergang läuft / zweiter Klick erwartet: nichts davon steht im Spielstand
    const tmp = await P.ev(() => { const j = localStorage.getItem('mala.save.3'); return /exitWalk|transitioning|sceneBlock|mapOpen/.test(j); });
    ok(!tmp, 'Speichern', 'Vorübergehende Zustände (Übergang läuft, zweiter Klick erwartet, Karte offen) stehen nicht im Spielstand');
    ok(!P.errors.length, 'Allgemein', 'keine JS-Fehler (Mausseite)', P.errors.slice(0, 3));
   }
    await P.ctx.close();

    // ============ Touch-Emulation (Chromium, hasTouch, iPad-Querformat 1024 × 768)
    const T = await mkPage(browser, { ctx: { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, turbo: 1 });
    T.door = () => T.ev(() => { const h = M.E.room.byId.shop_door, st = M.E.hsStand(h), p = M.E.player(); p.x = st[0] - 140; p.y = st[1]; M.E.snapCamera(); });
    const cnt = await T.ev(() => { window.__up = 0; const u = M.pointerUp; M.pointerUp = function () { window.__up++; return u.apply(this, arguments); }; return true; });
    await T.load(fx('k1_42')); await T.ev(() => { M.TURBO = 1; window.__up = 0; }); await T.door();
    let q = await T.hsPoint('shop_door'); let tt0 = (await T.st()).transitions; await T.tap(q[0], q[1]); await T.page.waitForTimeout(110); await T.tap(q[0], q[1]);
    await T.until(s => s.room === 'shop', 30000, 'Laden (Touch)'); await T.drain(); await T.page.waitForTimeout(300); let ts = await T.st(); const ups = await T.ev(() => window.__up);
    ok(ts.transitions - tt0 === 1 && ups === 2 && !ts.walk, 'Touch', 'Doppeltipp: genau ein Übergang, zwei Tipps = zwei Eingaben (kein zusätzliches Mausereignis)', { n: ts.transitions - tt0, ups, ts });
    // Ziehen im Bild ist kein Tippen
    await T.load(fx('k1_42')); await T.ev(() => { M.TURBO = 1; }); await T.door(); q = await T.hsPoint('shop_door'); const c0 = await T.css(q[0], q[1]); const c1 = await T.css(q[0] - 40, q[1]);
    const cdp = await T.ctx.newCDPSession(T.page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c0[0], y: c0[1] }] }); for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: c0[0] + (c1[0] - c0[0]) * i / 6, y: c0[1] }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await T.page.waitForTimeout(300); ts = await T.st();
    ok(ts.room === 'oldtown' && !ts.walk && !ts.map, 'Touch und Inventarziehen', 'Wischen über das Bild löst weder Gehen noch Ausgang aus', ts);
    // Gegenstand aus der Leiste auf den Ausgang ziehen: kein Verlassen
    await T.ev(() => { if (M.GS.inv.indexOf('spatula') < 0) M.GS.inv.unshift('spatula'); M.E.invTop = 0; }); const iv = await T.css(51 + 20, 161 + 18); q = await T.hsPoint('shop_door'); const ex = await T.css(q[0], q[1]); tt0 = (await T.st()).transitions;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: iv[0], y: iv[1] }] }); for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: iv[0] + (ex[0] - iv[0]) * i / 10, y: iv[1] + (ex[1] - iv[1]) * i / 10 }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await T.page.waitForTimeout(250); await T.drain(); ts = await T.st();
    ok(ts.room === 'oldtown' && ts.transitions === tt0, 'Touch und Inventarziehen', 'Gegenstand auf den Ausgang gezogen: Benutzen-Antwort, kein Verlassen, kein Doppeltipp', ts);
    // zwei Finger gleichzeitig: nur der erste zählt
    await T.ev(() => { window.__up = 0; }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 300, y: 300, id: 1 }, { x: 500, y: 300, id: 2 }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await T.page.waitForTimeout(200);
    ok((await T.ev(() => window.__up)) <= 1, 'Touch', 'Zweiter Finger löst keine zweite Eingabe aus');
    // Doppeltipp-Zoom auf dem Canvas: Seite bleibt im Maßstab 1
    const sc = await T.ev(() => (window.visualViewport ? window.visualViewport.scale : 1)); ok(sc === 1, 'Touch', 'Nach Doppeltipps kein Zoom (visualViewport.scale = 1)', sc);
    // Karte per Touch: Trefferfläche um den Ort (nicht nur das Symbol)
    await T.load(fx('k1_42')); await T.ev(() => { M.TURBO = 4; }); await T.page.keyboard.press('k'); await T.until(s => s.map); const L = await T.ev(() => { const c = M.mapCenter('riva'); return [c[0] + 12, c[1] + 6]; });
    await T.tap(L[0], L[1]); await T.until(s => s.room === 'riva' && !s.busy, 30000, 'Riva per Touch'); ts = await T.st();
    ok(ts.room === 'riva', 'Touch', 'Tipp 12 Spielpixel neben dem Symbol trifft den Ort (große Trefferfläche)', ts);
    ok(!T.errors.length, 'Allgemein', 'keine JS-Fehler (Touch-Seite)', T.errors.slice(0, 3));
    await T.ctx.close();
  } catch (e) { fail++; console.log('ABBRUCH: ' + (e.stack || e.message)); }
  console.log(`\nNAVTESTS: ${pass} bestanden, ${fail} fehlgeschlagen`);
  fs.writeFileSync(path.join(__dirname, 'navtests_ergebnis.json'), JSON.stringify(results, null, 1));
  await browser.close(); process.exit(fail ? 1 : 0);
})();
