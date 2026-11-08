// Browser-Test Oberfläche, Phase 3 (UI-Konzept D17, F22–F25): Breitbild-Leiste auf breiten Telefonen.
// Bedienung über echte Tipps auf die Leiste (#hud) und die Szene (#game); der Spielzustand wird nur gelesen.
//   node qa/ui/phase3.js [--shots <ordner>]        (Exitcode 1 bei Fehlern)
'use strict';
const path = require('path'), fs = require('fs');
const { pw, checker, open, settle, loadSlot, HS_POINT } = require('./lib');
const a = process.argv.slice(2), SHOTS = a.indexOf('--shots') >= 0 ? path.resolve(a[a.indexOf('--shots') + 1]) : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const PHONE = { viewport: { width: 750, height: 342 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true };
async function shot(p, n) { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, n + '.png') }); }
// Seitenkoordinaten eines Leistenelements (Rechteck in Leistenpixeln) bzw. eines Szenenpunkts (Spielpixel)
const hudXY = (p, key) => p.evaluate((key) => { const L = M.wide(), h = document.getElementById('hud').getBoundingClientRect(), g = M.wideGeo(); let r = L[key];
  if (key === 'up' || key === 'dn' || /^slot/.test(key)) { const I = L.inv, A = I.aw || 15, i = +String(key).slice(4) || 0; r = key === 'up' ? [I.x, I.y, A, I.sh] : key === 'dn' ? [I.x + A + I.n * I.sw, I.y, A, I.sh] : [I.x + A + i * I.sw, I.y, I.sw - 2, I.sh]; }
  const k = h.width / g.Wh; return { x: h.left + (r[0] + r[2] / 2) * k, y: h.top + (r[1] + r[3] / 2) * k, w: r[2] * k, hgt: r[3] * k }; }, key);
const sceneXY = (p, x, y) => p.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left + (x + 0.5) / 320 * r.width, y: r.top + (y + 0.5) / 144 * r.height }; }, [x, y]);
async function tap(p, xy) { await p.touchscreen.tap(xy.x, xy.y); await p.waitForTimeout(120); }
const REL = () => { const g = JSON.parse(JSON.stringify(M.GS)); delete g.playMs; return JSON.stringify({ phase: g.phase, active: g.active, inv: g.inv, notes: g.notes, flags: g.flags, pos: g.pos[g.active].room }); };
(async () => {
  const T = checker('Phase 3'); const b = await pw.chromium.launch(); const errs = []; const done = async (p) => { errs.push(...p.errs); await p.context().close(); };
  try {
    T.section('Auswahl der Leiste (F22)');
    let p = await open(b, 'k2_limbo', PHONE); await loadSlot(p); await p.waitForTimeout(200);
    const g = await p.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { wide: M.isWide(), w: Math.round(c.width), h: Math.round(c.height) }; });
    T.ck(g.wide && g.w === 640 && g.h === 288, 'iPhone 13 quer: Breitbild, Szene ' + g.w + ' × ' + g.h + ' CSS-px');
    await shot(p, 'f22_breitbild');
    for (const [name, dev] of [['iPad quer', { viewport: { width: 1080, height: 810 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }], ['Desktop 1280 × 800', { viewport: { width: 1280, height: 800 } }]]) {
      const q = await open(b, 'k2_limbo', dev); await loadSlot(q); await q.waitForTimeout(150); T.ck(await q.evaluate(() => !M.isWide() && document.getElementById('game').height === 200), name + ': gewohnte Leiste'); await done(q); }

    T.section('Bedienung der Breitbild-Leiste (F23)');
    const sizes = {}; for (const k of ['sw', 'notes', 'menu', 'map', 'reveal', 'up', 'dn', 'slot0']) { const r = await hudXY(p, k); sizes[k] = [Math.round(r.w), Math.round(r.hgt)]; }
    T.ck(['sw', 'notes', 'menu', 'map', 'reveal', 'slot0'].every(k => sizes[k][0] >= 44 && sizes[k][1] >= 44), 'Knöpfe und Felder ≥ 44 CSS-px (' + JSON.stringify(sizes) + ')');
    T.ck(sizes.up[0] >= 44 && sizes.dn[0] >= 44 && sizes.up[1] >= 44, 'Pfeile ≥ 44 CSS-px (Touch-Konzept K5)');
    // Figur wechseln (hin und zurück)
    const act0 = await p.evaluate(() => M.GS.active); await tap(p, await hudXY(p, 'sw')); await p.waitForFunction((a0) => M.GS.active !== a0, act0, { timeout: 5000 }).catch(() => {});
    T.ck(await p.evaluate((a0) => M.GS.active !== a0, act0), 'Figurenknopf wechselt die Figur'); await settle(p); await shot(p, 'f23_mala');
    await tap(p, await hudXY(p, 'sw')); await p.waitForFunction((a0) => M.GS.active === a0, act0, { timeout: 5000 }).catch(() => {}); await settle(p);
    // Zeigen
    await tap(p, await hudXY(p, 'reveal')); T.ck(await p.evaluate(() => M.revealOn()), '„Zeigen“ markiert die Szene');
    // Inventar blättern und Gegenstand wählen
    const pages = await p.evaluate(() => Math.ceil(M.GS.inv.length / 6)); if (pages > 1) { await tap(p, await hudXY(p, 'dn')); T.ck(await p.evaluate(() => M.E.invTop === 1), 'Pfeil rechts blättert das Inventar'); await tap(p, await hudXY(p, 'up')); T.ck(await p.evaluate(() => M.E.invTop === 0), 'Pfeil links blättert zurück'); }
    await tap(p, await hudXY(p, 'slot0')); const pop = await p.evaluate(() => M.E.pop && { item: M.E.pop.item, by: M.E.pop.by, bh: M.E.pop.bh, opts: M.E.pop.opts.map(o => o.t) });
    T.ck(pop && pop.item && pop.by + pop.bh <= 144, 'Gegenstand antippen: Verb-Menü über dem unteren Szenenrand (' + (pop && pop.opts.join(', ')) + ')');
    // Benutze … mit: „Benutze“ wählen, dann einen Hotspot antippen
    if (pop) { const ui = await p.evaluate(() => { const p0 = M.E.pop; const i = p0.opts.findIndex(o => o.pend); for (let y = p0.by; y < p0.by + p0.bh; y++) for (let x = p0.bx; x < p0.bx + p0.bw; x++) if (M.uiHit(x, y) === 'p:' + i) return { x, y }; return null; });
      if (ui) { await tap(p, await sceneXY(p, ui.x, ui.y)); const pend = await p.evaluate(() => M.E.pending); T.ck(!!pend, '„Benutze“ wählt den Gegenstand (Satz „Benutze … mit …“)');
        const hs = (await p.evaluate(HS_POINT)).find(q => !q.exit && !q.npc); if (hs) { await tap(p, await sceneXY(p, hs.x, hs.y)); await p.waitForFunction(() => M.E.busy || M.E.speech || !M.E.pending, null, { timeout: 4000 }).catch(() => {}); T.ck(await p.evaluate(() => !M.E.pending), '„Benutze … mit“ auf einen Hotspot ausgeführt'); await settle(p); } } }
    // Notizen (Overlay → gewohntes Bild), danach wieder Breitbild (F24)
    const rel0 = await p.evaluate(REL);
    await tap(p, await hudXY(p, 'notes')); await p.waitForTimeout(150); T.ck(await p.evaluate(() => (M.E.overlay && !M.isWide()) || M.E.dlg), 'Notizen: Notizbuch im gewohnten 320 × 200-Bild');
    await shot(p, 'f24_notizbuch'); await p.keyboard.press('Escape'); await p.waitForTimeout(150); T.ck(await p.evaluate(() => !M.E.overlay && M.isWide()), 'nach dem Schließen wieder Breitbild');
    // Menü (HTML-Pause) und zurück
    await tap(p, await hudXY(p, 'menu')); await p.waitForTimeout(120); T.ck(await p.evaluate(() => M.shell.ctx === 'pause'), 'Menü öffnet die Pause'); await shot(p, 'f23_pause');
    await p.locator('#shell button', { hasText: 'Weiterspielen' }).tap(); await p.waitForTimeout(150); T.ck(await p.evaluate(() => !M.E.menu && M.isWide()), 'Weiterspielen: zurück ins Breitbild');
    // Karte (Stadtplan) – sofern hier erlaubt
    const mapOk = await p.evaluate(() => !(M.mapBlocked && M.mapBlocked())); await tap(p, await hudXY(p, 'map')); await p.waitForTimeout(250);
    if (mapOk) { T.ck(await p.evaluate(() => M.E.overlay && M.E.overlay.kind === 'map' && !M.isWide()), 'Karte öffnet den Stadtplan im gewohnten Bild'); await p.keyboard.press('Escape'); await p.waitForTimeout(200); T.ck(await p.evaluate(() => M.isWide()), 'Stadtplan geschlossen: wieder Breitbild'); }
    else T.ck(await p.evaluate(() => !M.E.overlay), 'Karte gesperrt: Grund statt Stadtplan');
    await settle(p); T.ck((await p.evaluate(REL)) === rel0, 'Spielstand nach den Wechseln unverändert (F24)');

    T.section('Gespräch im Breitbild');
    await p.evaluate(() => { M.E.busy = true; M.API.choose(['Was ist das für ein Brief?', 'Wo kann ich hier Geld wechseln?', 'Wie komme ich in die Baščaršija?', 'Sind Sie für Željo oder für Sarajevo?', '(Gehen.)'].map((t, i) => ({ t, silent: true, bye: i === 4 })), { conv: false }).then(() => { M.E.busy = false; }); M.renderFrame(); });
    const dl = await p.evaluate(() => { const L = M.E.dlg.lay, r = document.getElementById('game').getBoundingClientRect(), k = r.width / 320; return { rows: L.rows.map(x => x.r), k, ymin: Math.min(...L.rows.map(x => x.r[1])) }; });
    T.ck(dl.rows.length === 3 && dl.rows.every(r => r[3] * dl.k >= 24) && dl.ymin >= 90, 'drei Antwortzeilen à ≥ 24 CSS-px über dem unteren Szenendrittel (' + dl.rows.map(r => Math.round(r[3] * dl.k)).join(', ') + ' CSS-px)');
    T.ck(await p.evaluate(() => { const r = M.wide().menu; return M.uiHit(r[0] + 5, 1000 + r[1] + 5) === null; }), 'Leiste nimmt während des Gesprächs keine Eingaben an');
    await shot(p, 'd17_gespraech');
    // F25: Größe ändern mitten im Gespräch → gewohnte Leiste, Gespräch bleibt; zurück → Breitbild
    await p.setViewportSize({ width: 600, height: 342 }); await p.waitForTimeout(250);
    T.ck(await p.evaluate(() => !M.isWide() && !!M.E.dlg), 'schmaleres Fenster mitten im Gespräch: gewohnte Leiste, Gespräch bleibt (F25)');
    await p.setViewportSize({ width: 750, height: 342 }); await p.waitForTimeout(250);
    T.ck(await p.evaluate(() => M.isWide() && !!M.E.dlg), 'wieder breit: Breitbild, Gespräch bleibt');
    await p.evaluate(() => M.E.chooseDone(4)); await settle(p);
    // F25: gewählter Gegenstand übersteht die Umschaltung
    const it0 = await p.evaluate(() => M.GS.inv[0]); await p.evaluate((id) => { M.E.pending = id; }, it0);
    await p.setViewportSize({ width: 600, height: 342 }); await p.waitForTimeout(200); await p.setViewportSize({ width: 750, height: 342 }); await p.waitForTimeout(200);
    T.ck(await p.evaluate((id) => M.E.pending === id && M.isWide(), it0), 'gewählter Gegenstand bleibt über die Umschaltung erhalten');
    await p.evaluate(() => { M.E.pending = null; });
    // Safe-Area-Ränder: Leiste liegt vollständig im Fenster
    T.ck(await p.evaluate(() => { const h = document.getElementById('hud').getBoundingClientRect(); return h.left >= 0 && h.top >= 0 && h.right <= innerWidth + 0.5 && h.bottom <= innerHeight + 0.5; }), 'Leiste vollständig im Fenster (Safe-Area echter Geräte nur auf dem Gerät prüfbar)');
    await done(p);

    T.section('Telefon-Layout (Touch-Konzept E3, D1): Maßstab, Aufteilung, Knopfgrößen');
    const KEYS = ['sw', 'notes', 'menu', 'map', 'reveal', 'up', 'dn', 'slot0'];
    const DEVS = [['iPhone SE quer', { width: 667, height: 375 }, 2, 'bottom', 2.0], ['iPhone 16 quer', { width: 734, height: 343 }, 3, 'rails', 2.0], ['iPhone 13 quer', { width: 750, height: 342 }, 3, 'rails', 2.0], ['iPhone 17 Pro Max quer', { width: 838, height: 390 }, 3, 'rails', 2.33]];
    for (const [name, vp, dpr, mode, minS] of DEVS) {
      const q = await open(b, 'k2_limbo', { viewport: vp, deviceScaleFactor: dpr, hasTouch: true, isMobile: true }); await loadSlot(q); await q.waitForTimeout(200);
      const gi = await q.evaluate(() => { const g = M.wideGeo(), c = document.getElementById('game').getBoundingClientRect(), h = document.getElementById('hud').getBoundingClientRect(); return { wide: M.isWide(), mode: g && g.mode, s: c.width / 320, game: [c.left, c.top, c.width, c.height], hud: [h.left, h.top, h.right, h.bottom] }; });
      T.ck(gi.wide && gi.mode === mode && gi.s >= minS - 0.005, name + ': ' + (mode === 'rails' ? 'Seitenknöpfe' : 'alle Knöpfe unten') + ', Szene ' + gi.s.toFixed(2) + ' CSS-px je Spielpixel (≥ ' + minS + ')');
      const R = {}; for (const k of KEYS) { const r = await hudXY(q, k); R[k] = [r.x - r.w / 2, r.y - r.hgt / 2, r.w, r.hgt]; }
      T.ck(KEYS.every(k => R[k][2] >= 44 && R[k][3] >= 44), name + ': Knöpfe, Felder und Pfeile ≥ 44 × 44 CSS-px (' + KEYS.map(k => k + ' ' + Math.round(R[k][2]) + '×' + Math.round(R[k][3])).join(', ') + ')');
      const ov = (a, c) => a[0] < c[0] + c[2] - 0.5 && c[0] < a[0] + a[2] - 0.5 && a[1] < c[1] + c[3] - 0.5 && c[1] < a[1] + a[3] - 0.5;
      const clash = []; KEYS.forEach((k, i) => { if (ov(R[k], gi.game)) clash.push(k + '/Szene'); KEYS.slice(i + 1).forEach(k2 => { if (ov(R[k], R[k2])) clash.push(k + '/' + k2); }); });
      T.ck(!clash.length, name + ': keine Überdeckung zwischen Knöpfen und Szene' + (clash.length ? ' (' + clash.join(', ') + ')' : ''));
      T.ck(gi.hud[0] >= 0 && gi.hud[1] >= 0 && gi.hud[2] <= vp.width + 0.5 && gi.hud[3] <= vp.height + 0.5, name + ': Leiste vollständig im Fenster');
      if (mode === 'bottom') {   // Bedienung der unteren Leiste mit echten Tipps
        await tap(q, await hudXY(q, 'notes')); await q.waitForTimeout(150); T.ck(await q.evaluate(() => !!M.E.overlay || !!M.E.dlg), name + ': „Notizen“ öffnet das Notizbuch'); await q.keyboard.press('Escape'); await q.waitForTimeout(200);
        await tap(q, await hudXY(q, 'reveal')); T.ck(await q.evaluate(() => M.revealOn()), name + ': „Zeigen“ markiert die Szene'); await tap(q, await hudXY(q, 'reveal')); await q.waitForTimeout(150);
        await tap(q, await hudXY(q, 'menu')); await q.waitForTimeout(120); T.ck(await q.evaluate(() => M.shell.ctx === 'pause'), name + ': „Menü“ öffnet die Pause');
        await q.locator('#shell button', { hasText: 'Weiterspielen' }).tap(); await q.waitForTimeout(200);
        await tap(q, await hudXY(q, 'slot0')); await q.waitForTimeout(150); const pop = await q.evaluate(() => M.E.pop && { item: M.E.pop.item, by: M.E.pop.by, bh: M.E.pop.bh });
        T.ck(!!(pop && pop.item && pop.by + pop.bh <= 144), name + ': Gegenstand antippen öffnet seine Handlungen über dem unteren Szenenrand'); await q.keyboard.press('Escape'); await q.waitForTimeout(120);
        await shot(q, 'e3_se_unten'); }
      if (name === 'iPhone 16 quer') {
        await shot(q, 'e3_iphone16');
        // Hysterese (T17): kleine Änderungen schalten nicht hin und her; eine bisherige Aufteilung bleibt, solange sie passt
        const G = () => q.evaluate(() => { const g = M.wideGeo(); return M.isWide() && g ? g.mode + ' m' + g.m : 'gewohnt'; });
        await q.setViewportSize({ width: 738, height: 343 }); await q.waitForTimeout(250); const h1 = await G();
        await q.setViewportSize({ width: 729, height: 343 }); await q.waitForTimeout(250); const h2 = await G();
        await q.setViewportSize({ width: 734, height: 343 }); await q.waitForTimeout(250); const h3 = await G();
        await q.setViewportSize({ width: 745, height: 343 }); await q.waitForTimeout(250); const h4 = await G();
        T.ck(h1 === 'rails m6' && h2 === 'gewohnt' && h3 === 'gewohnt' && h4 === 'rails m6', 'Hysterese: 734 → 738 bleibt, 729 passt nicht mehr → gewohnt, zurück auf 734 bleibt gewohnt, 745 → wieder Telefon-Layout (' + [h1, h2, h3, h4].join(' / ') + ')');
        // kein Layoutwechsel, solange ein gezogener Gegenstand unterwegs ist (T17): Finger halten, Fenster ändern, loslassen
        const s0 = await hudXY(q, 'slot0'), cdp = await q.context().newCDPSession(q);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: s0.x, y: s0.y }] });
        for (let i = 1; i <= 6; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: s0.x - i * 8, y: s0.y - i * 12 }] }); await q.waitForTimeout(30); }
        await q.setViewportSize({ width: 600, height: 343 }); await q.waitForTimeout(400); const d1 = await q.evaluate(() => M.isWide());
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await q.waitForTimeout(400); const d2 = await q.evaluate(() => M.isWide());
        T.ck(d1 === true && d2 === false, 'Größenwechsel während des Ziehens: Layout bleibt bis zum Loslassen, danach gewohnte Leiste (' + d1 + ' / ' + d2 + ')');
        await q.evaluate(() => { M.E.pending = null; M.E.pop = null; });
        // Drehen ins Hochformat und zurück
        await q.setViewportSize({ width: 343, height: 734 }); await q.waitForTimeout(300); const r1 = await q.evaluate(() => M.isRotated() && !M.isWide());
        await q.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /gedreht weiterspielen/i.test(x.textContent || '')); if (b) b.click(); });
        await q.setViewportSize({ width: 734, height: 343 }); await q.waitForTimeout(300); const r2 = await q.evaluate(() => !M.isRotated() && M.isWide() && M.wideGeo().mode === 'rails');
        T.ck(r1 && r2, 'Hochformat: gedrehtes gewohntes Bild; zurück quer: Telefon-Layout');
        const pts = await q.evaluate(() => { const L = M.wide(), r = L.notes; return M.uiHit(r[0] + 3, 1000 + r[1] + 3); }); T.ck(pts === 'notes', 'nach dem Drehen stimmen die Trefferflächen der Leiste'); }
      await done(q); }
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 4).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
