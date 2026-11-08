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
  if (key === 'up' || key === 'dn' || /^slot/.test(key)) { const I = L.inv, i = +String(key).slice(4) || 0; r = key === 'up' ? [I.x, I.y, 15, I.sh] : key === 'dn' ? [I.x + 15 + I.n * I.sw, I.y, 15, I.sh] : [I.x + 15 + i * I.sw, I.y, I.sw - 2, I.sh]; }
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
    T.ck(sizes.up[0] >= 24 && sizes.dn[0] >= 24 && sizes.up[1] >= 44, 'Pfeile ≥ 24 CSS-px breit');
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
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 4).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
