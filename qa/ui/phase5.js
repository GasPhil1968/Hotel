// Browser-Test Touch-Umsetzung (design/TOUCH_KONZEPT.md, Schritte E1–E6, Abnahmekriterien K1–K14, soweit sie sich emulieren lassen).
// Bedienung über echte Touch-Ereignisse (Playwright, Chromium mit Touch-Emulation; iOS-Hinweise mit WebKit und iPhone-Kennung) und mit der Maus.
// EMULATION: keine Safe-Area-Ränder, keine Safari-Leisten, keine Bildschirmtastatur, kein Ton – das prüft design/touch/GERAETEPRUEFUNG.md.
//   node qa/ui/phase5.js [--shots <ordner>]        (Exitcode 1 bei Fehlern)
'use strict';
const path = require('path'), fs = require('fs');
const { pw, checker, open, settle, loadSlot, HS_POINT } = require('./lib');
const ENG = require('../browser/engines.js');
const a = process.argv.slice(2), SHOTS = a.indexOf('--shots') >= 0 ? path.resolve(a[a.indexOf('--shots') + 1]) : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const SE = { viewport: { width: 667, height: 375 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };
const I16 = { viewport: { width: 734, height: 343 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true };
const IPAD = { viewport: { width: 1080, height: 810 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };
const DESK = { viewport: { width: 1280, height: 800 } };
async function shot(p, n) { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, n + '.png') }); }
const sceneXY = (p, x, y) => p.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(), H = M.isWide() ? 144 : 200; return { x: r.left + (x + 0.5) / 320 * r.width, y: r.top + (y + 0.5) / H * r.height }; }, [x, y]);
const slotXY = (p, i) => p.evaluate((i) => { if (M.isWide()) { const L = M.wide(), I = L.inv, h = document.getElementById('hud').getBoundingClientRect(), k = h.width / M.wideGeo().Wh; return { x: h.left + (I.x + I.aw + i * I.sw + I.sw / 2) * k, y: h.top + (I.y + I.sh / 2) * k }; }
  const r = document.getElementById('game').getBoundingClientRect(), s = r.width / 320; return { x: r.left + (51 + i * 40 + 20) * s, y: r.top + (161 + 18) * s }; }, i);
const rect = (p, sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e || getComputedStyle(e).display === 'none') return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; }, sel);
async function tap(p, xy) { await p.touchscreen.tap(xy.x, xy.y); await p.waitForTimeout(150); }
const MULTI = () => { const E = M.E, R = E.room, cam = Math.round(E.camX); for (const h of R.hotspots) { if (h.npc || E.uiExit(h)) continue; if (h.take === undefined && h.open === undefined && h.use === undefined && h.read === undefined && h.push === undefined) continue; const r = E.hsRect(h); if (!r) continue;
  for (let y = Math.max(1, r[1]); y < Math.min(143, r[1] + r[3]); y += 2) for (let x = r[0]; x < r[0] + r[2]; x += 2) { if (x - cam < 4 || x - cam > 315) continue; if (E.hotspotAt(x, y) === h && !E.hotspotNear(x, y, 12).some(c => c.hs !== h && c.d === 0)) return { id: h.id, x: x - cam, y }; } } return null; };
const LIST = (n) => { window.__ch = undefined; M.E.busy = true; const labs = ['Erste Antwort', 'Zweite Antwort, etwas länger, damit sie umbricht', 'Dritte Antwort', 'Vierte Antwort', 'Fünfte Antwort', '(Gehen.)'].slice(-n);
  M.API.choose(labs.map((t, i) => ({ t, silent: true, bye: i === labs.length - 1 })), { conv: false }).then(id => { window.__ch = id; M.E.busy = false; }); };
(async () => {
  const T = checker('Phase 5'); const cr = await pw.chromium.launch(); const wk = await ENG.launch(pw, 'webkit'); const errs = [];
  // WebKit über file://: Manifest und Symbole lassen sich ohne Server nicht laden (Origin null) – kein Spielfehler
  const real = (m) => !/Access-Control-Allow-Origin|Failed to load resource/.test(m); const done = async (p) => { errs.push(...p.errs.filter(real)); await p.context().close(); };
  try {
    T.section('Aktionsleiste und Verb-Menü (E4, T06, K5, K14)');
    let p = await open(cr, 'k1_bruno', SE); await loadSlot(p); await p.waitForTimeout(200);
    const obj = await p.evaluate(MULTI); T.ck(!!obj, 'Testobjekt mit mehreren Handlungen gefunden (' + (obj && obj.id) + ')');
    await tap(p, await sceneXY(p, obj.x, obj.y)); const bar = await p.evaluate(() => ({ pop: !!M.E.pop, html: !!(M.E.pop && M.E.pop.html), btn: [...document.querySelectorAll('#abar .ab-row button')].map(b => { const r = b.getBoundingClientRect(); return [b.textContent, Math.round(r.width), Math.round(r.height)]; }) }));
    T.ck(bar.html && bar.btn.length >= 2 && bar.btn.every(b => b[1] >= 44 && b[2] >= 44), 'iPhone SE, Finger: Handlungen als Knöpfe in der Leiste, alle ≥ 44 × 44 CSS-px (' + bar.btn.map(b => b[0] + ' ' + b[1] + '×' + b[2]).join(', ') + ')');
    const br = await rect(p, '#abar .ab-row'), gm = await rect(p, '#game'); T.ck(!!br && br[1] >= gm[1] + gm[3] - 1, 'Aktionsleiste liegt unter der Szene (verdeckt das Ding nicht)');
    await shot(p, 'e4_aktionsleiste_se');
    await tap(p, await sceneXY(p, 160, 20)); T.ck(await p.evaluate(() => !M.E.pop && !M.E.busy && M.E.ACT[M.GS.active].mode !== 'walk'), 'Tipp ins Bild schließt die Leiste, ohne dass die Figur losgeht');
    await tap(p, await sceneXY(p, obj.x, obj.y)); await p.locator('#abar .ab-row .ab-c').tap(); await p.waitForTimeout(120); T.ck(await p.evaluate(() => !M.E.pop), '„✕“ schließt die Leiste');
    await tap(p, await sceneXY(p, obj.x, obj.y)); const look = await p.evaluate(() => M.E.pop.opts.findIndex(o => o.v === 'look')); await p.locator('#abar .ab-row button[data-a="pop"]').nth(look).tap();
    T.ck(await p.waitForFunction(() => !!M.E.speech, null, { timeout: 8000 }).then(() => true, () => false), '„Schau an“ in der Leiste führt die Handlung aus'); await settle(p);
    // K13: Gegenstand gewählt → kein Ziel im Bild hervorgehoben (Szene pixelgleich mit und ohne Wahl)
    // im selben Bild (gleiche Spielzeit, die Szene ist animiert): mit und ohne gewählten Gegenstand zeichnen und vergleichen
    await tap(p, await slotXY(p, 0)); await p.waitForTimeout(650); const sel = await p.evaluate(() => { const id = M.E.pending, a = Array.from(M.renderFrame().d.slice(0, 320 * 144)).join(','); M.E.pending = null; const b = Array.from(M.renderFrame().d.slice(0, 320 * 144)).join(','); M.E.pending = id; return { pend: id, same: a === b }; });
    T.ck(!!sel.pend && sel.same, 'Gegenstand mit einem Tipp gewählt; die Szene bleibt pixelgleich – keine Hervorhebung möglicher Ziele (K13)');
    const ib = await rect(p, '#abar .ab-item'); const hud = await rect(p, '#hud'); const L = await p.evaluate(() => M.wide()), k = hud[2] / L.W;
    T.ck(!!ib && ib[1] + ib[3] <= hud[1] + L.inv.y * k + 0.5, 'Leiste des Gegenstands über dem Inventar (Inventar bleibt frei für „Benutze … mit“ anderem Gegenstand)');
    await p.keyboard.press('Escape'); await p.waitForTimeout(100); T.ck(await p.evaluate(() => !M.E.pending), 'Esc hebt die Gegenstandswahl auf'); await done(p);
    // Maus: unverändert das Menü am Zeiger
    p = await open(cr, 'k1_bruno', DESK); await loadSlot(p); await p.waitForTimeout(200); const o2 = await p.evaluate(MULTI); const c2 = await sceneXY(p, o2.x, o2.y);
    await p.mouse.click(c2.x, c2.y); await p.waitForTimeout(150); T.ck(await p.evaluate(() => !!M.E.pop && !M.E.pop.html && !document.querySelector('#abar.on')), 'Maus: Menü am Zeiger im Canvas, keine HTML-Leiste (K14)');
    await p.keyboard.press('Escape'); const s2 = await p.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(), s = r.width / 320; return { x: r.left + 71 * s, y: r.top + 179 * s }; }); await p.mouse.click(s2.x, s2.y); await p.waitForTimeout(150);
    T.ck(await p.evaluate(() => !!(M.E.pop && M.E.pop.item && M.E.pop.opts.some(o => o.pend)) && !M.E.pending), 'Maus: Gegenstand anklicken öffnet das Menü mit „Benutze“ (wie bisher)'); await p.keyboard.press('Escape');
    await p.evaluate(LIST, 4); await p.waitForTimeout(300); T.ck(await p.evaluate(() => !!M.E.dlg && !!M.E.dlg.lay && !document.querySelector('#subs.on')), 'Maus: Antwortliste im Canvas (wie bisher)'); await p.evaluate(() => M.E.chooseDone(3)); await done(p);

    T.section('Antwortliste bei Fingereingabe (E4, T04, T05, K3, K5)');
    p = await open(cr, 'k1_bruno', SE); await loadSlot(p); await tap(p, await sceneXY(p, 160, 130)); await settle(p);
    await p.evaluate(LIST, 6); await p.waitForTimeout(120); const rows = await p.evaluate(() => [...document.querySelectorAll('#subs .sb-o')].map(b => { const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.height]; }));
    T.ck(rows.length === 6 && rows.every(r => r[2] >= 44), 'HTML-Liste, Zeilen ≥ 44 CSS-px (' + rows.map(r => Math.round(r[2])).join(', ') + ')');
    await p.touchscreen.tap(rows[0][0], rows[0][1]); await p.waitForTimeout(80); T.ck(await p.evaluate(() => window.__ch === undefined && !!M.E.dlg), 'Tipp ~200 ms nach dem Erscheinen: keine Antwort gewählt (K3)');
    await p.waitForTimeout(400); await p.touchscreen.tap(rows[1][0], rows[1][1]); await p.waitForTimeout(150); T.ck(await p.evaluate(() => window.__ch === 1), 'nach 450 ms wählt der Tipp die Antwort');
    await settle(p); await p.evaluate(LIST, 4); await p.waitForTimeout(30); await p.keyboard.press('2'); await p.waitForTimeout(100); T.ck(await p.evaluate(() => window.__ch === 1), 'Ziffern wählen sofort, ohne Sperre (K3)');
    await shot(p, 'e4_antworten_se'); await settle(p);
    // Overlay-✕ (K5)
    await p.keyboard.press('n'); await p.waitForTimeout(250); const x = await rect(p, '#abar.ov .ab-x'); T.ck(!!x && Math.round(x[2]) >= 44 && Math.round(x[3]) >= 44, '„✕“ des Notizbuchs als HTML-Knopf ' + (x ? Math.round(x[2]) + '×' + Math.round(x[3]) : '–') + ' CSS-px');
    await p.locator('#abar .ab-x').tap(); await p.waitForTimeout(200); T.ck(await p.evaluate(() => !M.E.overlay), '„✕“ schließt das Notizbuch wie Esc'); await done(p);

    T.section('iPad: Bild oben, Antworten darunter (E6, T22)');
    p = await open(cr, 'k1_bruno', IPAD); await loadSlot(p); await tap(p, await sceneXY(p, 160, 130)); await settle(p);
    const g = await rect(p, '#game'); T.ck(g && Math.round(g[1]) <= 8 && Math.round(810 - g[1] - g[3]) >= 132, 'iPad quer: Bild steht oben (' + Math.round(g[1]) + ' px), darunter ' + Math.round(810 - g[1] - g[3]) + ' px frei');
    await p.evaluate(LIST, 6); await p.waitForTimeout(600); const il = await p.evaluate(() => { const c = document.querySelector('#subs .sb-cho').getBoundingClientRect(), gr = document.getElementById('game').getBoundingClientRect(); return { top: c.top, bottom: c.bottom, pic: gr.bottom, vis: [...document.querySelectorAll('#subs .sb-o')].filter(b => b.getBoundingClientRect().bottom <= c.bottom + 0.5).length }; });
    T.ck(il.top >= il.pic && il.vis >= 4, 'Antwortliste unter dem Bild, ' + il.vis + ' Zeilen ganz sichtbar; Szene und Leiste frei'); await shot(p, 'e6_ipad_antworten'); await p.evaluate(() => M.E.chooseDone(5)); await done(p);
    p = await open(cr, 'k1_bruno', DESK); await loadSlot(p); const gd = await rect(p, '#game'); T.ck(Math.round(gd[1]) === 0 || Math.abs((800 - gd[3]) / 2 - gd[1]) < 1.5, 'Desktop: Bild bleibt mittig (keine Änderung)'); await done(p);

    T.section('Gesten (E6, T16)');
    p = await open(cr, null, I16); const ges = await p.evaluate(() => ({ meta: document.querySelector('meta[name=viewport]').content, body: getComputedStyle(document.body).touchAction, game: getComputedStyle(document.getElementById('game')).touchAction }));
    T.ck(!/user-scalable\s*=\s*no/.test(ges.meta) && ges.body === 'manipulation' && ges.game === 'none', 'keine globale Sperre: Seite manipulation (Zoom in Menüs), Spielfläche none (' + ges.body + ' / ' + ges.game + ')'); await done(p);

    T.section('Feinwahl (E6, T21)');
    p = await open(cr, 'k1_bruno', I16); await loadSlot(p);
    const tgt = await p.evaluate(() => { const h = M.E.room.hotspots.find(x => x.id === 'bell'), r = h && M.E.hsRect(h), cam = Math.round(M.E.camX); return r ? [r[0] - cam + r[2] / 2, r[1] + r[3] / 2] : null; });
    const cdp = await p.context().newCDPSession(p), below = await p.evaluate(([x, y]) => { const c = document.getElementById('game').getBoundingClientRect(); return [c.left + (x + 0.5) / 320 * c.width, c.top + (y + 0.5) / 144 * c.height + 40]; }, tgt);
    const hold = async (ms) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: below[0], y: below[1] }] }); await p.waitForTimeout(ms); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(350); };
    await p.evaluate(() => { window.__hit = []; M.E.doVerb = async function (v, hs) { window.__hit.push(hs ? hs.id : v); }; M.E.walkPlayerTo = function () { window.__hit.push('walk'); }; });
    await hold(600); const off = await p.evaluate(() => ({ hit: window.__hit.slice(), pop: M.E.pop && M.E.pop.hs && M.E.pop.hs.id })); await p.evaluate(() => { M.E.pop = null; window.__hit = []; });
    T.ck(!M_isBell(off), 'aus (Standard): langer Druck wirkt wie ein Tipp an der Fingerstelle (' + JSON.stringify(off) + ')');
    await p.evaluate(() => M.fineOn(true)); await hold(600); const on = await p.evaluate(() => ({ hit: window.__hit.slice(), pop: M.E.pop && M.E.pop.hs && M.E.pop.hs.id }));
    T.ck(M_isBell(on), 'an: 0,6 s halten wählt das Ding 40 CSS-px über dem Finger (' + JSON.stringify(on) + ')'); await p.evaluate(() => M.fineOn(false)); await done(p);

    T.section('Hinweise für iPhone und iPad (E5, T12, T14)');
    const iph = Object.assign({}, pw.devices['iPhone 15 landscape'] || pw.devices['iPhone 13 landscape']); delete iph.defaultBrowserType;
    p = await open(wk, null, iph); await p.waitForTimeout(400); const pn = await p.evaluate(() => { const n = document.querySelector('#shell .pnote'); if (!n) return null; const r = n.getBoundingClientRect(), m = document.querySelector('#shell .tmenu').getBoundingClientRect(); return { t: n.textContent, over: !(r.left >= m.right || r.right <= m.left || r.top >= m.bottom || r.bottom <= m.top) }; });
    T.ck(!!pn && /Home-Bildschirm/.test(pn.t) && !pn.over, 'Safari (iPhone): einmaliger Hinweis „Zum Home-Bildschirm“, ohne das Titelmenü zu verdecken'); await shot(p, 'e5_hinweis_iphone');
    if (pn) { await p.locator('#shell .pnote .btn').tap(); await p.waitForTimeout(200); }
    await p.reload(); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); await p.waitForTimeout(300); T.ck(await p.evaluate(() => !document.querySelector('#shell .pnote')), '„Verstanden“: Hinweis kommt nicht wieder');
    await p.locator('#shell button', { hasText: 'Einstellungen' }).tap(); await p.waitForTimeout(250); const st = await p.evaluate(() => [...document.querySelectorAll('#shell .set .lbl')].map(e => e.textContent).join(' | '));
    T.ck(/iPhone und iPad/.test(await p.evaluate(() => document.querySelector('#shell .set').textContent)) && /stumm/.test(st) && /sieben Tage/.test(st), 'Einstellungen: Abschnitt „iPhone und iPad“ mit Stummschalter und Speicherhinweis'); await done(p);
    const ctxA = await wk.newContext(iph); await ctxA.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); }); const pa = await ctxA.newPage(); pa.errs = []; pa.on('pageerror', e => pa.errs.push(e.message));
    await pa.goto('file://' + path.join(__dirname, '..', '..', 'web', 'index.html')); await pa.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); await pa.waitForTimeout(300);
    T.ck(/eigenen Speicher/.test(await pa.evaluate(() => (document.querySelector('#shell .pnote') || {}).textContent || '')), 'Home-Bildschirm-App (navigator.standalone): Hinweis auf den getrennten Speicher und die Sicherung'); errs.push(...pa.errs.filter(real)); await ctxA.close();
    p = await open(cr, null, DESK); await p.waitForTimeout(300); T.ck(await p.evaluate(() => !document.querySelector('#shell .pnote')), 'Desktop: kein iOS-Hinweis'); await done(p);

    T.section('Namensfeld über der Bildschirmtastatur (E6, T18, nachgestellt)');
    const ctxK = await cr.newContext(I16); await ctxK.addInitScript(() => { const vv = new EventTarget(); vv.scale = 1; vv.offsetTop = 0; vv.offsetLeft = 0; Object.defineProperty(vv, 'width', { get: () => innerWidth }); let h = null; Object.defineProperty(vv, 'height', { get: () => h == null ? innerHeight : h }); vv.__set = (v) => { h = v; vv.dispatchEvent(new Event('resize')); }; Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true }); });
    const S = require('./lib').STATES.find(s => s.name === 'k2_limbo').storage; await ctxK.addInitScript((s) => { if (!sessionStorage.getItem('__i')) { sessionStorage.setItem('__i', '1'); localStorage.clear(); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } }, S);
    const pk = await ctxK.newPage(); pk.errs = []; pk.on('pageerror', e => pk.errs.push(e.message)); await pk.goto('file://' + path.join(__dirname, '..', '..', 'web', 'index.html')); await pk.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
    await loadSlot(pk); await pk.evaluate(() => { M.E.saveMark(1); M.shell.openPause(); }); await pk.waitForTimeout(150); await pk.locator('#shell button', { hasText: 'Speichern' }).tap(); await pk.waitForTimeout(200);
    const ren = pk.locator('#shell button', { hasText: 'Benennen' }).first(); if (await ren.count()) { await ren.tap(); await pk.waitForTimeout(200); await pk.focus('#shname'); await pk.evaluate(() => window.visualViewport.__set(150)); await pk.waitForTimeout(250);
      const rb = await pk.evaluate(() => { const r = document.querySelector('#shell .paper.confirm').getBoundingClientRect(), i = document.getElementById('shname').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, inp: i.bottom }; });
      T.ck(rb.inp <= 150 && rb.top >= 0, 'sichtbare Fläche 150 px hoch (Tastatur offen): Namensfeld bleibt sichtbar (Unterkante ' + Math.round(rb.inp) + ' px)'); }
    else T.ck(false, 'Lesezeichen mit „Benennen …“ nicht gefunden');
    errs.push(...pk.errs); await ctxK.close();
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 4).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await cr.close(); await wk.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
function M_isBell(r) { return (r.pop === 'bell') || (r.hit || []).indexOf('bell') >= 0; }
