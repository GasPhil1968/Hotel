// Touch-Analyse MALA: Messungen und Bedienabläufe auf emulierten Apple-Geräten (Playwright WebKit) und Desktop (Chromium).
// Keine Spieländerung: das Skript liest den Spielzustand, bedient über echte Touch-/Maus-Ereignisse (99_main.js → 06_ui.js)
// und hält Ergebnisse, Zahlen und Bildschirmfotos fest. EMULATION, kein echtes iOS-Gerät (keine Safe-Area-Ränder,
// keine Safari-Leisten, keine Systemgesten, kein Ton).
//   node design/touch/devicetests.js [--only messung,F1,F2,…] [--dev iphone16,…]
'use strict';
const path = require('path'), fs = require('fs');
const { pw, open, settle, loadSlot } = require('../../qa/ui/lib.js');
const ENG = require('../../qa/browser/engines.js');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
// --out <ordner>: Ergebnis und Bilder dorthin (Standard: design/touch = Stand der Analyse; nach der Umsetzung: design/touch/nachher)
const BASE = path.resolve(arg('--out', __dirname)), OUT = path.join(BASE, 'evidence'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean), DEVS = (arg('--dev', '') || '').split(',').filter(Boolean);
const want = (k) => !ONLY.length || ONLY.indexOf(k) >= 0;
const DEV = {
  iphoneSE: { name: 'iPhone SE (3. Gen.) quer', d: 'iPhone SE (3rd gen) landscape', engine: 'webkit' },
  iphone16: { name: 'iPhone 16 quer', d: 'iPhone 16 landscape', engine: 'webkit' },
  iphone13: { name: 'iPhone 13 quer', d: 'iPhone 13 landscape', engine: 'webkit' },
  iphone17pm: { name: 'iPhone 17 Pro Max quer', d: 'iPhone 17 Pro Max landscape', engine: 'webkit' },
  ipad: { name: 'iPad (7. Gen.) quer', d: 'iPad (gen 7) landscape', engine: 'webkit' },
  ipadpro: { name: 'iPad Pro 11 quer', d: 'iPad Pro 11 landscape', engine: 'webkit' },
  desktop: { name: 'Desktop 1280 × 800, Maus', ctx: { viewport: { width: 1280, height: 800 } }, engine: 'chromium' },
};
const ctxOf = (k) => { const D = DEV[k]; if (D.ctx) return Object.assign({}, D.ctx); const o = Object.assign({}, pw.devices[D.d]); delete o.defaultBrowserType; return o; };
const R = { made: new Date().toISOString(), method: 'Playwright ' + require('playwright/package.json').version + ' – WebKit/Chromium-Emulation unter Linux, kein iOS', devices: {}, flows: [] };
const log = (...x) => console.log(...x);
const sleep = (p, ms) => p.waitForTimeout(ms);

// ---------------------------------------------------------------- Helfer im Spiel
const LAYOUT = () => { const r = (el) => { if (!el) return null; const q = el.getBoundingClientRect(); return { x: +q.left.toFixed(1), y: +q.top.toFixed(1), w: +q.width.toFixed(1), h: +q.height.toFixed(1) }; };
  const g = M.wideGeo && M.wideGeo(), wide = !!(M.isWide && M.isWide()); const game = r(document.getElementById('game')), hud = wide ? r(document.getElementById('hud')) : null;
  return { vw: innerWidth, vh: innerHeight, dpr: devicePixelRatio, wide, rot: !!(M.isRotated && M.isRotated()), game, hud, wg: g ? { n: g.n, m: g.m, Wh: g.Wh, Hh: g.Hh } : null,
    scenePx: wide ? game.w / 320 : (M.isRotated() ? game.h / 320 : game.w / 320), hudPx: wide ? hud.w / g.Wh : (M.isRotated() ? game.h / 320 : game.w / 320) }; };
// Spiel- bzw. Leistenkoordinate → Seitenkoordinate (gewohnt, Breitbild, gedreht); Leiste im Breitbild: y ≥ 1000
const PT = ([x, y]) => { const cv = document.getElementById('game'), r = cv.getBoundingClientRect();
  if (M.isWide()) { if (y < 1000) return [r.left + (x + 0.5) / 320 * r.width, r.top + (y + 0.5) / 144 * r.height]; const h = document.getElementById('hud').getBoundingClientRect(), g = M.wideGeo(); return [h.left + (x + 0.5) / g.Wh * h.width, h.top + (y - 1000 + 0.5) / g.Hh * h.height]; }
  if (M.isRotated()) return [r.right - (y + 0.5) / 200 * r.width, r.top + (x + 0.5) / 320 * r.height];
  return [r.left + (x + 0.5) / 320 * r.width, r.top + (y + 0.5) / 200 * r.height]; };
// Bedienelemente der Leiste (Umriss je Code aus M.uiHit), in Spiel-/Leistenpixeln
const HUDBOX = () => { const out = {}; const add = (c, x, y) => { if (!c) return; const b = out[c] || (out[c] = { x0: 1e9, y0: 1e9, x1: -1, y1: -1 }); if (x < b.x0) b.x0 = x; if (y < b.y0) b.y0 = y; if (x > b.x1) b.x1 = x; if (y > b.y1) b.y1 = y; };
  if (M.isWide()) { const g = M.wideGeo(); for (let y = 0; y < g.Hh; y++) for (let x = 0; x < g.Wh; x++) add(M.uiHit(x, 1000 + y), x, 1000 + y); }
  else for (let y = 144; y < 200; y++) for (let x = 0; x < 320; x++) add(M.uiHit(x, y), x, y);
  Object.values(out).forEach(b => { b.w = b.x1 - b.x0 + 1; b.h = b.y1 - b.y0 + 1; b.cx = b.x0 + b.w / 2; b.cy = b.y0 + b.h / 2; }); return out; };
// Gewinnerkarte der Hotspots im sichtbaren Bild (Bildschirmkoordinaten 0..319 × 0..143): je Hotspot größtes Quadrat und dessen Mitte
const HSQ = () => { const E = M.E, cam = Math.round(E.camX), win = new Int16Array(320 * 144).fill(-1), ids = [], idx = {};
  for (let y = 0; y < 144; y++) for (let x = 0; x < 320; x++) { const h = E.hotspotAt(x + cam, y); if (!h) continue; const id = h.id; let k = idx[id]; if (k === undefined) { k = idx[id] = ids.length; ids.push({ id, name: E.nameOf(h), npc: !!h.npc, exit: !!(h.exit || h.gexit), area: 0, sq: 0, c: null }); } win[y * 320 + x] = k; ids[k].area++; }
  const dp = new Int16Array(320 * 144); for (let y = 0; y < 144; y++) for (let x = 0; x < 320; x++) { const k = win[y * 320 + x]; if (k < 0) continue; let v = 1; if (x && y && win[y * 320 + x - 1] === k && win[(y - 1) * 320 + x] === k && win[(y - 1) * 320 + x - 1] === k) v = 1 + Math.min(dp[y * 320 + x - 1], dp[(y - 1) * 320 + x], dp[(y - 1) * 320 + x - 1]); dp[y * 320 + x] = v; if (v > ids[k].sq) { ids[k].sq = v; ids[k].c = [x - v / 2 + 0.5, y - v / 2 + 0.5]; } }
  const floor = []; for (let y = 120; y < 140 && floor.length < 40; y += 2) for (let x = 20; x < 300; x += 7) if (win[y * 320 + x] < 0 && !(E.hotspotNear && E.hotspotNear(x + cam, y, 12).length)) floor.push([x, y]);   // freier Boden: auch außerhalb des Fangradius (T01)
  return { cam, hs: ids, floor }; };
async function tapAt(p, dev, xy) { const q = await p.evaluate(PT, xy); if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(q[0], q[1]); else await p.touchscreen.tap(q[0], q[1]); return q; }
async function tapEl(p, dev, sel, text) { const loc = text ? p.locator(sel, { hasText: text }).first() : p.locator(sel).first(); await loc.waitFor({ state: 'visible', timeout: 5000 }); const b = await loc.boundingBox();
  const x = b.x + b.width / 2, y = b.y + b.height / 2; if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(x, y); else await p.touchscreen.tap(x, y); await sleep(p, 120); return b; }
// direkt geladener Stand: Titelschicht schließt erst im nächsten Bild (M.shellSync); erst danach tippen
async function ready(p) { await settle(p); await p.waitForFunction(() => !M.shell.ctx && !document.getElementById('shell').classList.contains('on'), null, { timeout: 5000 }).catch(() => {}); await sleep(p, 120); }
// Verb-Menü bzw. Aktionsleiste (Touch-Konzept E4): bei Fingereingabe HTML-Knöpfe (#abar), mit der Maus das Menü im Canvas
const POPV = () => { const P = M.E.pop; if (!P) return null; return { html: !!P.html, title: P.title, item: P.item || null, opts: P.opts.map((o, i) => ({ t: o.t, v: o.v, pend: !!o.pend, xy: P.html ? null : [P.bx + P.bw / 2, P.by + 2 + (i + 1) * P.rh + P.rh / 2] })) }; };
async function tapPage(p, dev, x, y) { if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(x, y); else await p.touchscreen.tap(x, y); }
async function popTap(p, dev, k) { const v = await p.evaluate(POPV); if (!v || !v.opts[k]) return false;
  if (v.html) { const r = await p.evaluate((k) => { const b = document.querySelectorAll('#abar .ab-row button[data-a="pop"]')[k]; if (!b) return null; const q = b.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }, k); if (!r) return false; await tapPage(p, dev, r[0], r[1]); }
  else await tapAt(p, dev, v.opts[k].xy);
  await sleep(p, 120); return true; }
// Antwortzeilen in Seitenkoordinaten: Canvas-Liste (d.lay) oder HTML-Liste (#subs); h = Zeilenhöhe in CSS-Pixeln, sichtbar = ganz im Bildlaufbereich
const DLGROWS = () => { const D = M.E.dlg; if (!D) return null; M.renderFrame(); if (D.lay) { const cv = document.getElementById('game'), r = cv.getBoundingClientRect(), wide = M.isWide(), rot = M.isRotated(), Hh = wide ? 144 : 200;
    const P = ([x, y]) => rot ? [r.right - y / 200 * r.width, r.top + x / 320 * r.height] : [r.left + x / 320 * r.width, r.top + y / Hh * r.height], sc = rot ? r.height / 320 : r.width / 320;
    return { html: false, n: D.opts.length, more: !!D.lay.dn, close: D.lay.close ? [D.lay.close[2] * sc, D.lay.close[3] * sc] : null, rows: D.lay.rows.map(q => { const c = P([q.r[0] + q.r[2] / 2, q.r[1] + q.r[3] / 2]), b = P([q.r[0], q.r[1] + q.r[3]]); return { k: q.k, x: c[0], y: c[1], h: q.r[3] * sc, bottom: rot ? null : b[1] }; }) }; }
  const box = document.querySelector('#subs .sb-cho'); if (!box || getComputedStyle(box).display === 'none') return { html: true, n: D.opts.length, rows: [] }; const bb = box.getBoundingClientRect();
  const rows = [...box.querySelectorAll('.sb-o')].map(b => { const q = b.getBoundingClientRect(); return { k: +b.dataset.k, x: q.left + q.width / 2, y: q.top + q.height / 2, h: b.offsetHeight, bottom: q.bottom, vis: q.top >= bb.top - 0.5 && q.bottom <= bb.bottom + 0.5 }; });
  return { html: true, n: D.opts.length, more: box.scrollHeight > box.clientHeight + 1, close: null, rows: rows.filter(q => q.vis) }; };
// Gegenstand wählen: mit dem Finger ein Tipp (T07), mit der Maus Menü → „Benutze“
async function selectItem(p, dev, H) { await tapAt(p, dev, [H['i:0'].cx, H['i:0'].cy]); await sleep(p, 250);
  const one = await p.evaluate(() => M.E.pending ? { item: M.E.pending, opts: [...document.querySelectorAll('#abar .ab-item button')].map(b => b.textContent) } : null); if (one) return Object.assign(one, { taps: 1 });
  const v = await p.evaluate(POPV); if (!v) return null; const k = v.opts.findIndex(o => o.pend); if (k < 0) return null; await popTap(p, dev, k); return { item: v.item, opts: v.opts.map(o => o.t), taps: 2 }; }
async function shot(p, name) { const f = path.join(OUT, name + '.png'); await p.screenshot({ path: f }); return path.relative(path.join(__dirname, '..', '..'), f); }
async function browserFor(engine) { return ENG.launch(pw, engine); }
const flow = (id, dev, title) => { const F = { id, dev, device: DEV[dev].name, engine: DEV[dev].engine, title, steps: [], result: 'offen', evidence: [] }; R.flows.push(F);
  F.ok = (c, m) => { F.steps.push((c ? 'ok   ' : 'FEHL ') + m); log('  ' + (c ? 'ok   ' : 'FEHL ') + '[' + id + ' ' + dev + '] ' + m); return !!c; };
  F.note = (m) => { F.steps.push('info ' + m); log('  info [' + id + ' ' + dev + '] ' + m); }; return F; };
const finish = (F) => { F.result = F.steps.some(s => /^FEHL/.test(s)) ? 'Befund' : (F.steps.some(s => /^ok/.test(s)) ? 'bestanden' : 'offen'); };

// ---------------------------------------------------------------- Messung je Gerät: Maßstab, Fläche, Leiste, Verb-Menü, Antwortzeilen, Menüzeilen
async function measure(b, dev) {
  const p = await open(b, 'k2_limbo', ctxOf(dev)); await loadSlot(p); await ready(p); await sleep(p, 300);
  const L = await p.evaluate(LAYOUT), H = await p.evaluate(HUDBOX), px = L.hudPx;
  const box = (c) => H[c] ? { code: c, w: +(H[c].w * px).toFixed(1), h: +(H[c].h * px).toFixed(1) } : null;
  const hud = ['notes', 'map', 'reveal', 'menu', 'sw', 'up', 'dn', 'i:0'].map(box).filter(Boolean);
  const area = (L.wide ? L.game.w * L.game.h : L.game.w * L.game.h * 144 / 200) / (L.vw * L.vh);
  const M1 = { layout: L, sceneShare: +(area * 100).toFixed(1), hud, file: await shot(p, 'messung_' + dev + '_szene') };
  // Verb-Menü an einem Hotspot mit Auswahl (über echten Tipp)
  const q = await p.evaluate(HSQ); let pop = null;
  for (const h of q.hs.filter(h => !h.exit && h.sq >= 6)) { await tapAt(p, dev, h.c); await sleep(p, 250); pop = await p.evaluate(() => { const P = M.E.pop; if (!P) return null; if (P.html) { const bs = [...document.querySelectorAll('#abar .ab-row button')].map(b => b.getBoundingClientRect()); return { html: true, title: P.title, n: P.opts.length, hCss: Math.min(...bs.map(q => q.height)), wCss: Math.min(...bs.map(q => q.width)) }; } return { title: P.title, bx: P.bx, by: P.by, bw: P.bw, bh: P.bh, rh: P.rh, n: P.opts.length, x: P.x, y: P.y }; });
    if (pop) { pop.target = h.id; pop.tap = h.c; break; } await settle(p); }
  if (pop && pop.html) M1.pop = { target: pop.target, html: true, rowCss: +pop.hCss.toFixed(1), wCss: +pop.wCss.toFixed(1), rows: pop.n, where: 'Aktionsleiste unten (HTML)' };
  else if (pop) { const sc = L.scenePx; M1.pop = { target: pop.target, rowCss: +(pop.rh * sc).toFixed(1), wCss: +(pop.bw * sc).toFixed(1), rows: pop.n, gapToFingerCss: +(Math.max(0, pop.bx - pop.tap[0], pop.tap[0] - (pop.bx + pop.bw), pop.by - pop.tap[1], pop.tap[1] - (pop.by + pop.bh)) * sc).toFixed(1) }; }
  if (pop) {
    M1.popFile = await shot(p, 'messung_' + dev + '_verbmenue'); await p.evaluate(() => { M.E.pop = null; }); }
  // Antwortliste (Canvas, Pixelschrift): synthetische Liste mit sieben Zeilen wie qa/ui/phase1.js
  await settle(p); await p.evaluate(() => { window.__ch = undefined; M.E.busy = true; const labs = ['Erste Antwort', 'Zweite Antwort, etwas länger, damit sie umbricht und zwei Zeilen braucht', 'Dritte Antwort', 'Vierte Antwort', 'Fünfte Antwort', 'Sechste Antwort', '(Gehen.)'];
    M.API.choose(labs.map((t, i) => ({ t, silent: true, bye: i === 6 })), { conv: false }).then(id => { window.__ch = id; M.E.busy = false; }); }); await sleep(p, 250);
  await sleep(p, 300); const dl = await p.evaluate(DLGROWS), sc = L.scenePx;
  M1.dialog = { html: dl.html, visible: dl.rows.length, of: dl.n, rowHCss: dl.rows.map(r => +r.h.toFixed(1)), closeCss: dl.close ? dl.close.map(v => +v.toFixed(1)) : null,
    lowestRowBottomToScreenCss: dl.rows.length ? +(L.vh - dl.rows[dl.rows.length - 1].bottom).toFixed(1) : null };
  M1.dialogFile = await shot(p, 'messung_' + dev + '_antworten'); await p.evaluate(() => M.E.chooseDone(6)); await sleep(p, 100);
  // Pausenmenü (HTML-Schicht)
  await settle(p); await p.evaluate(() => M.shell.openPause()); await sleep(p, 200);
  M1.pause = await p.evaluate(() => [...document.querySelectorAll('#shell .mi')].map(b => +b.getBoundingClientRect().height.toFixed(1)));
  M1.pauseFile = await shot(p, 'messung_' + dev + '_pause');
  // Schriftgröße im Bild: Versalhöhe 7 Spielpixel
  M1.capHeightCss = +(7 * sc).toFixed(1);
  R.devices[dev] = Object.assign({ name: DEV[dev].name, engine: DEV[dev].engine }, M1);
  log(DEV[dev].name + ': ' + (L.wide ? 'Breitbild' : 'gewohnt') + ', Szene ' + sc.toFixed(2) + ' CSS-px/Spielpx, Leiste ' + px.toFixed(2) + ', Szenenanteil ' + M1.sceneShare + ' %, Leistenknöpfe ' + hud.map(h => h.code + ' ' + h.w + '×' + h.h).join(', ') + (M1.pop ? (M1.pop.html ? ', Aktionsleiste ' + M1.pop.wCss + '×' + M1.pop.rowCss : ', Verb-Zeile ' + M1.pop.rowCss) : '') + ', Antwortzeilen ' + (M1.dialog.html ? 'HTML ' : '') + M1.dialog.rowHCss.join('/') + ', Pause ' + Math.min(...M1.pause));
  await p.context().close(); }

// ---------------------------------------------------------------- Abläufe
// F1: Fortsetzen (Titel), Figur bewegen, Objekt untersuchen
async function F1(b, dev) { const F = flow('F1', dev, 'Fortsetzen, bewegen, untersuchen (k1_amt, Hafenamt)');
  const p = await open(b, 'k1_amt', ctxOf(dev)); await tapEl(p, dev, '#shell button', 'Fortsetzen');
  F.ok(await p.waitForFunction(() => M.E.screen === 'game', null, { timeout: 8000 }).then(() => true, () => false), '„Fortsetzen“ per Tipp lädt den Stand');
  await settle(p); const q = await p.evaluate(HSQ); const fl = q.floor[Math.floor(q.floor.length / 2)];
  const x0 = await p.evaluate(() => M.E.ACT.marko.x); await tapAt(p, dev, fl); await sleep(p, 900); const x1 = await p.evaluate(() => M.E.ACT.marko.x);
  F.ok(Math.abs(x1 - x0) > 3, 'Tipp auf freien Boden: Marko geht hin (x ' + Math.round(x0) + ' → ' + Math.round(x1) + ')'); await settle(p);
  const obj = q.hs.filter(h => !h.exit && !h.npc && h.sq >= 8).sort((m, n) => n.sq - m.sq)[0];
  await tapAt(p, dev, obj.c); await sleep(p, 300); let pop = await p.evaluate(POPV), taps = 1;
  if (pop) { F.note('Tipp auf „' + obj.name + '“ öffnet ' + (pop.html ? 'die Aktionsleiste' : 'das Verb-Menü') + ': ' + pop.opts.map(o => o.t).join(' · ')); const k = Math.max(0, pop.opts.findIndex(o => o.v === 'look')); await popTap(p, dev, k); taps = 2; }
  const said = await p.waitForFunction(() => !!M.E.speech, null, { timeout: 6000 }).then(() => true, () => false);
  F.ok(said, 'Untersuchen: Marko sagt etwas zu „' + obj.name + '“ nach ' + taps + ' Tipp' + (taps > 1 ? 's' : ''));
  F.evidence.push(await shot(p, 'F1_' + dev + '_untersuchen')); await settle(p); finish(F); await p.context().close(); }

// F2: Wechsel Marko ↔ Mala, Fähigkeit, Wechsel gesperrt, Wechsel mit gewähltem Gegenstand
async function F2(b, dev) { const F = flow('F2', dev, 'Figurenwechsel, Fähigkeit, Sperre, gewählter Gegenstand (k1_amt)');
  const p = await open(b, 'k1_amt', ctxOf(dev)); await loadSlot(p); await ready(p);
  const H = await p.evaluate(HUDBOX); F.ok(!!H.sw, 'Figurenknopf vorhanden (' + (H.sw ? H.sw.w + '×' + H.sw.h + ' Leistenpx' : 'fehlt') + ')');
  await tapAt(p, dev, [H.sw.cx, H.sw.cy]); await p.waitForFunction(() => M.GS.active === 'mala', null, { timeout: 4000 }).catch(() => {});
  F.ok(await p.evaluate(() => M.GS.active === 'mala'), 'Tipp auf den Figurenknopf: Mala ist aktiv'); F.evidence.push(await shot(p, 'F2_' + dev + '_mala')); await settle(p);
  const q = await p.evaluate(HSQ); let verbs = null, used = null;
  for (const h of q.hs.filter(h => !h.exit && h.sq >= 6)) { await tapAt(p, dev, h.c); await sleep(p, 250); verbs = await p.evaluate(() => M.E.pop ? M.E.pop.opts.map(o => ({ t: o.t, v: o.v })) : null); if (verbs) { used = h; break; } await settle(p); }
  if (verbs) { F.note('Mala an „' + used.name + '“: ' + verbs.map(v => v.t).join(' · ')); const k = Math.max(0, verbs.findIndex(v => v.v !== 'look'));
    await popTap(p, dev, k); F.ok(await p.waitForFunction(() => !!M.E.speech || M.E.busy, null, { timeout: 5000 }).then(() => true, () => false), 'Fähigkeit „' + verbs[k].t + '“ ausgeführt'); await settle(p); }
  else F.note('kein Hotspot mit Verb-Menü für Mala gefunden');
  // gesperrt: während einer Szene
  await p.evaluate(() => { M.E.busy = true; window.__msg0 = M.E.msg; }); await tapAt(p, dev, [H.sw.cx, H.sw.cy]); await sleep(p, 300);
  const blocked = await p.evaluate(() => ({ active: M.GS.active, msg: M.E.msg && M.E.msg !== window.__msg0 ? M.E.msg.t : null }));
  F.ok(blocked.active === 'mala', 'während einer Szene: Wechsel gesperrt');
  F.ok(!!blocked.msg, 'gesperrter Wechsel meldet einen Grund' + (blocked.msg ? ' („' + blocked.msg + '“)' : ' – keine Rückmeldung'));
  await p.evaluate(() => { M.E.busy = false; }); await tapAt(p, dev, [H.sw.cx, H.sw.cy]); await p.waitForFunction(() => M.GS.active === 'marko', null, { timeout: 4000 }).catch(() => {}); await settle(p);
  // gewählter Gegenstand und Wechsel
  const H2 = await p.evaluate(HUDBOX); if (H2['i:0']) { const r = await selectItem(p, dev, H2);
    if (r) { const pend0 = await p.evaluate(() => M.E.pending); await tapAt(p, dev, [H2.sw.cx, H2.sw.cy]); await sleep(p, 500);
      const after = await p.evaluate(() => ({ active: M.GS.active, pending: M.E.pending }));
      F.ok(!!pend0, 'Gegenstand „Benutze“ gewählt (' + pend0 + ')'); F.ok(after.active === 'mala' && !after.pending, 'Wechsel zu Mala hebt die Gegenstandswahl auf' + (after.pending ? ' – Wahl bleibt bestehen (' + after.pending + ')' : '')); } }
  finish(F); await p.context().close(); }

// F3: Gegenstand wählen, anwenden, Wahl aufheben (k2_limbo)
async function F3(b, dev) { const F = flow('F3', dev, 'Gegenstand wählen, benutzen, abbrechen (k2_limbo, Vratnik)');
  const p = await open(b, 'k2_limbo', ctxOf(dev)); await loadSlot(p); await ready(p); const H = await p.evaluate(HUDBOX);
  const selItem = () => selectItem(p, dev, H);
  const s1 = await selItem(); F.ok(s1 && await p.evaluate(() => !!M.E.pending), s1 && s1.taps === 1 ? 'Tipp auf Gegenstand: gewählt, Aktionsleiste ' + s1.opts.join(' · ') + ' (2 Tipps bis zum Ziel)' : 'Tipp auf Gegenstand → Menü (' + (s1 ? s1.opts.join(' · ') : '–') + ') → „Benutze“: Gegenstand gewählt (3 Tipps bis zum Ziel)');
  const sent = await p.evaluate(() => { const L = []; const t0 = M.text; M.text = function (b, s) { L.push(String(s)); return t0.apply(this, arguments); }; M.renderFrame(); if (M.isWide() && M.renderHud) M.renderHud(); M.text = t0; return L.find(s => /^Benutze /.test(s)) || ''; });   // Breitbild: Satz steht in der Leiste (renderHud)
  F.ok(/^Benutze .+ mit/.test(sent), 'Leiste zeigt den Satz „' + sent + '“');
  await tapAt(p, dev, [H['i:0'].cx, H['i:0'].cy]); await sleep(p, 150); F.ok(await p.evaluate(() => !M.E.pending), 'erneuter Tipp auf den Gegenstand hebt die Wahl auf');
  await selItem(); const q = await p.evaluate(HSQ); await tapAt(p, dev, q.floor[0]); await sleep(p, 300);
  const fl = await p.evaluate(() => ({ pending: M.E.pending, walk: M.E.ACT.marko.mode })); F.ok(!fl.pending && fl.walk !== 'walk', 'Tipp auf freien Boden hebt die Wahl auf, ohne loszugehen');
  await selItem(); const tgt = q.hs.filter(h => !h.exit && h.sq >= 6).sort((m, n) => n.sq - m.sq)[0]; await tapAt(p, dev, tgt.c);
  F.ok(await p.waitForFunction(() => !!M.E.speech || M.E.busy, null, { timeout: 6000 }).then(() => true, () => false) && await p.evaluate(() => !M.E.pending), 'Gegenstand auf „' + tgt.name + '“ angewendet (Antwort des Spiels)');
  F.evidence.push(await shot(p, 'F3_' + dev + '_benutzen')); await settle(p); finish(F); await p.context().close(); }

// F3b (nur Chromium, CDP-Touch): Ziehen aus dem Inventar, Wischen im Inventar, abgebrochene Berührung beim Ziehen
async function F3b(b, dev) { const F = flow('F3b', dev, 'Ziehen, Wischen, abgebrochene Berührung (k2_limbo, Chromium-Touch über CDP)');
  const p = await open(b, 'k2_limbo', ctxOf(dev)); await loadSlot(p); await ready(p); const cdp = await p.context().newCDPSession(p);
  const touch = async (type, xy) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: xy ? [{ x: xy[0], y: xy[1], id: 1 }] : [] });
  const H = await p.evaluate(HUDBOX), q = await p.evaluate(HSQ); const it = await p.evaluate(PT, [H['i:0'].cx, H['i:0'].cy]), tgt = q.hs.filter(h => !h.exit && h.sq >= 8).sort((m, n) => n.sq - m.sq)[0], tg = await p.evaluate(PT, tgt.c);
  const LBL = () => { const L = []; const t0 = M.text; M.text = function (b, s) { L.push(String(s)); return t0.apply(this, arguments); }; M.renderFrame(); if (M.isWide() && M.renderHud) M.renderHud(); M.text = t0; return L.join(' | '); };
  await touch('touchStart', it); for (let i = 1; i <= 12; i++) { await touch('touchMove', [it[0] + (tg[0] - it[0]) * i / 12, it[1] + (tg[1] - it[1]) * i / 12]); await sleep(p, 16); }
  const during = await p.evaluate(LBL); F.ok(/Benutze .+ mit/.test(during), 'Ziehen ins Bild: Satz „Benutze … mit …“ über dem Finger');
  await touch('touchEnd'); F.ok(await p.waitForFunction(() => !!M.E.speech || M.E.busy, null, { timeout: 6000 }).then(() => true, () => false), 'Loslassen auf „' + tgt.name + '“ benutzt den Gegenstand'); await settle(p);
  // Wischen im Inventar (mehr als eine Seite?)
  const pages = await p.evaluate(() => Math.ceil(M.GS.inv.length / 6)); if (pages > 1) { const top0 = await p.evaluate(() => M.E.invTop);
    await touch('touchStart', it); for (let i = 1; i <= 8; i++) { await touch('touchMove', [it[0] - i * 10, it[1]]); await sleep(p, 16); } await touch('touchEnd'); await sleep(p, 200);
    const s = await p.evaluate(() => ({ top: M.E.invTop, pop: !!M.E.pop, busy: M.E.busy, pend: M.E.pending })); F.ok(s.top !== top0 && !s.pop && !s.busy && !s.pend, 'Wischen im Inventar blättert, ohne etwas zu benutzen'); await p.evaluate(() => { M.E.invTop = 0; }); }
  else F.note('Inventar hat nur eine Seite – Wischen nicht geprüft');
  // abgebrochene Berührung (Systemgeste): touchCancel mitten im Ziehen
  await settle(p); await touch('touchStart', it); for (let i = 1; i <= 8; i++) { await touch('touchMove', [it[0] + (tg[0] - it[0]) * i / 8, it[1] + (tg[1] - it[1]) * i / 8]); await sleep(p, 16); }
  await touch('touchCancel'); await sleep(p, 200); const stuck = await p.evaluate(LBL);
  F.ok(!/Benutze .+ mit/.test(stuck), 'nach abgebrochener Berührung hängt kein gezogener Gegenstand' + (/Benutze .+ mit/.test(stuck) ? ' – Gegenstand bleibt am letzten Fingerpunkt stehen' : ''));
  F.evidence.push(await shot(p, 'F3b_' + dev + '_abgebrochen')); finish(F); await p.context().close(); }

// F4: benachbarte kleine Hotspots (k1_bruno, Hotel Palma): Mitte und versetzte Tipps (±5 Spielpixel) über die echte Eingabekette
async function F4(b, dev) { const F = flow('F4', dev, 'Benachbarte kleine Hotspots (k1_bruno, Rezeption Hotel Palma)');
  const p = await open(b, 'k1_bruno', ctxOf(dev)); await loadSlot(p); await ready(p);
  await p.evaluate(() => { window.__hit = []; const E = M.E; E.doVerb = async function (v, hs) { window.__hit.push({ v, id: hs && hs.id }); }; E.walkPlayerTo = function () { window.__hit.push({ v: 'walk' }); }; });
  const q = await p.evaluate(HSQ); const L = await p.evaluate(LAYOUT); const small = q.hs.filter(h => h.sq < 15 && !h.npc).slice(0, 8); const rows = [];
  for (const h of small) { const res = [];
    for (const [dx, dy] of [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5]]) { await p.evaluate(() => { window.__hit = []; M.E.pop = null; }); await tapAt(p, dev, [h.c[0] + dx, h.c[1] + dy]); await sleep(p, 380);
      const r = await p.evaluate(() => { const P = M.E.pop; const h0 = window.__hit[0]; const id = P && P.pickFrom ? 'Auswahl:' + P.opts.map(o => o.pick.id).join('/') : (P && P.hs ? P.hs.id : (h0 ? (h0.v === 'walk' ? '(Boden)' : h0.id) : '(nichts)')); M.E.pop = null; return id; }); res.push(r); }
    rows.push({ id: h.id, name: h.name, sqGame: h.sq, sqCss: +(h.sq * L.scenePx).toFixed(1), center: res[0], offsets: res.slice(1) });
    F.note('„' + h.name + '“ (' + h.sq + ' Spielpx ≈ ' + (h.sq * L.scenePx).toFixed(0) + ' CSS-px): Mitte → ' + res[0] + '; ±5 px → ' + res.slice(1).join(', ')); }
  const hitOrAsk = (o, id) => o === id || (/^Auswahl:/.test(o) && o.slice(8).split('/').indexOf(id) >= 0);   // getroffen oder in der Nachfrage angeboten (T01)
  const centerOk = rows.filter(r => hitOrAsk(r.center, r.id)).length, offOk = rows.reduce((s, r) => s + r.offsets.filter(o => hitOrAsk(o, r.id)).length, 0), offN = rows.length * 4;
  F.ok(centerOk === rows.length, 'Tipp genau in die Mitte trifft ' + centerOk + '/' + rows.length + ' kleine Hotspots');
  const offMsg = 'Tipp 5 Spielpixel daneben (≈ ' + (5 * L.scenePx).toFixed(0) + ' CSS-px) trifft das Ding oder bietet es an: ' + offOk + '/' + offN;
  if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) F.note(offMsg + ' (Maus: Fangradius und Nachfrage gelten nur für den Finger)'); else F.ok(offOk / offN >= 0.95, offMsg);
  F.data = rows; F.evidence.push(await shot(p, 'F4_' + dev + '_palma')); finish(F); await p.context().close(); }

// F5: langer Dialog, Antwort nahe am unteren Rand (echtes Gespräch)
async function F5(b, dev) { const F = flow('F5', dev, 'Gespräch mit vielen Antworten, unterste Zeile wählen (k1_bruno)');
  const p = await open(b, 'k1_bruno', ctxOf(dev)); await loadSlot(p); await ready(p);
  const npc = await p.evaluate(() => { const q = M.E.room.hotspots.filter(h => h.npc && M.E.hsRect(h)); return q.map(h => h.id); }); F.note('Figuren im Raum: ' + npc.join(', '));
  let got = false; for (const id of npc) { await p.evaluate((id) => M.TA.act('talk', id), id); const ok = await p.waitForFunction(() => { const E = M.E; if (E.speech && E.gt() - E.speech.at > 250) E.endSpeech(); return !!E.dlg; }, null, { timeout: 15000, polling: 60 }).then(() => true, () => false); if (ok) { got = id; break; } await settle(p); }
  if (!got) { F.note('kein Gespräch mit Auswahl erreicht'); finish(F); await p.context().close(); return; }
  await sleep(p, 550);   // die Liste nimmt 450 ms nach dem Erscheinen keinen Tipp an (T04)
  const L = await p.evaluate(LAYOUT); const d = await p.evaluate(DLGROWS);
  const last = d.rows[d.rows.length - 1], pt = [last.x, last.y];
  F.note('Gespräch mit „' + got + '“: ' + d.n + ' Antworten' + (d.html ? ' (HTML-Liste)' : '') + ', sichtbar ' + d.rows.length + (d.more ? ', weitere ' + (d.html ? 'durch Wischen' : 'über ▼') : '') + '; unterste Zeile ' + (L.vh - last.bottom).toFixed(0) + ' CSS-px über dem unteren Bildschirmrand, Zeilenhöhe ' + last.h.toFixed(0) + ' CSS-px');
  F.evidence.push(await shot(p, 'F5_' + dev + '_gespraech'));
  await p.evaluate(() => { window.__said = []; const s0 = M.API; const say0 = M.E.endSpeech; window.__sp = null; window.__spN = 0; window.__spT = setInterval(() => { if (M.E.speech && M.E.speech !== window.__sp) { window.__sp = M.E.speech; window.__spN++; } }, 5); });
  if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(pt[0], pt[1]); else await p.touchscreen.tap(pt[0], pt[1]); await sleep(p, 400);
  F.ok(await p.evaluate(() => window.__spN > 0 || !M.E.dlg), 'Tipp auf die unterste sichtbare Antwort wählt sie (Antwort läuft)');
  // fünf schnelle Tipps (alle 70 ms) mitten ins Bild, während die Antwort läuft: wie viele Sätze springen weiter?
  const n0 = await p.evaluate(() => window.__spN); const mid = await p.evaluate(PT, [160, 70]);
  for (let i = 0; i < 5; i++) { if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(mid[0], mid[1]); else await p.touchscreen.tap(mid[0], mid[1]); await sleep(p, 70); }
  await sleep(p, 150); const n1 = await p.evaluate(() => { clearInterval(window.__spT); return { n: window.__spN, dlg: !!M.E.dlg }; });
  F.note('5 schnelle Tipps während der Antwort: ' + (n1.n - n0) + ' Satzwechsel' + (n1.dlg ? ', danach wieder eine Auswahl offen' : ''));
  F.ok(n1.n - n0 <= 3, 'schnelle Mehrfachtipps überspringen nicht jeden Satz (Doppeltipp-Sperre 350 ms)');
  finish(F); await p.context().close(); }

// F5b: Doppeltipp am Satzende: Der erste Tipp beendet den letzten Satz, die Auswahl erscheint – trifft der zweite Tipp schon eine Antwort?
async function F5b(b, dev) { const F = flow('F5b', dev, 'Doppeltipp beim Übergang Satz → Antwortliste (k1_bruno)');
  const p = await open(b, 'k1_bruno', ctxOf(dev)); await loadSlot(p); await ready(p);
  const LABS = ['Erste Antwort', 'Zweite Antwort', 'Dritte Antwort', '(Gehen.)'];
  await p.evaluate((L) => { window.__ch = undefined; M.E.busy = true; M.API.choose(L.map((t, i) => ({ t, silent: true, bye: i === 3 })), { conv: false }).then(id => { window.__ch = id; M.E.busy = false; }); }, LABS); await sleep(p, 200);
  await sleep(p, 250); const row0 = (await p.evaluate(DLGROWS)).rows[0], row = [row0.x, row0.y]; await p.evaluate(() => M.E.chooseDone(3)); await sleep(p, 150); await settle(p);
  for (const gap of [120, 250, 420]) {
    await p.evaluate((L) => { window.__ch = undefined; M.E.busy = true; (async () => { await M.API.m('Das ist der letzte Satz vor der Auswahl.'); const id = await M.API.choose(L.map((t, i) => ({ t, silent: true, bye: i === 3 })), { conv: false }); window.__ch = id; M.E.busy = false; })(); }, LABS);
    await sleep(p, 600); const xy = row;
    const tap = async () => { if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(xy[0], xy[1]); else await p.touchscreen.tap(xy[0], xy[1]); };
    await tap(); await sleep(p, gap); await tap(); await sleep(p, 250);
    const r = await p.evaluate(() => ({ ch: window.__ch, dlg: !!M.E.dlg })); F.ok(r.ch === undefined, 'zweiter Tipp ' + gap + ' ms nach dem ersten: ' + (r.ch === undefined ? 'keine Antwort gewählt, Liste offen' : 'Antwort „' + ['Erste Antwort', 'Zweite Antwort', 'Dritte Antwort', '(Gehen.)'][r.ch] + '“ ungelesen gewählt'));
    await p.evaluate(() => { if (M.E.dlg) M.E.chooseDone(3); }); await sleep(p, 150); await settle(p); }
  finish(F); await p.context().close(); }

// F6: Karte, Ortswechsel, Doppeltipp auf einen Ort, Rückkehr in die Szene
async function F6(b, dev) { const F = flow('F6', dev, 'Karte, Ortswechsel, Doppeltipp auf den Ort (k1_brief)');
  const p = await open(b, 'k1_brief', ctxOf(dev)); await loadSlot(p); await ready(p); const H = await p.evaluate(HUDBOX);
  if (!H.map) { F.note('kein Kartenknopf'); finish(F); await p.context().close(); return; }
  await tapAt(p, dev, [H.map.cx, H.map.cy]); await sleep(p, 400); const open1 = await p.evaluate(() => M.E.overlay && M.E.overlay.kind === 'map');
  F.ok(open1, 'Tipp auf „Karte“ öffnet den Stadtplan'); if (!open1) { finish(F); await p.context().close(); return; }
  F.evidence.push(await shot(p, 'F6_' + dev + '_karte'));
  const locs = await p.evaluate(() => { const out = {}; for (let y = 0; y < 200; y++) for (let x = 0; x < 320; x++) { const c = M.uiHit(x, y); if (c && c.slice(0, 2) === 'o:') { const b = out[c] || (out[c] = { x0: 1e9, y0: 1e9, x1: -1, y1: -1 }); b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x); b.y1 = Math.max(b.y1, y); } }
    const st = M.E.overlay.data.st; return Object.entries(out).map(([c, b]) => ({ id: c.slice(2), st: st[c.slice(2)] && st[c.slice(2)].st, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, w: b.x1 - b.x0 + 1, h: b.y1 - b.y0 + 1 })); });
  const L = await p.evaluate(LAYOUT); F.note('Orte auf dem Plan: ' + locs.map(l => l.id + '(' + (l.st || '?') + ', ' + (l.w * L.scenePx).toFixed(0) + '×' + (l.h * L.scenePx).toFixed(0) + ' CSS-px)').join(', '));
  const go = locs.find(l => l.st && l.st !== 'here' && l.st !== 'unknown' && l.st !== 'lock' && l.st !== 'dim' && l.id !== 'x');
  if (!go) { F.note('kein erreichbarer Ort außer dem jetzigen'); finish(F); await p.context().close(); return; }
  const t0 = await p.evaluate(() => M.E.transitions || 0), q = await p.evaluate(PT, [go.cx, go.cy]);
  for (let i = 0; i < 2; i++) { if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(q[0], q[1]); else await p.touchscreen.tap(q[0], q[1]); await sleep(p, 90); }
  await p.waitForFunction(() => !M.E.overlay && !M.E.transitioning && !M.E.busy, null, { timeout: 20000 }).catch(() => {}); await settle(p);
  const t1 = await p.evaluate(() => ({ tr: M.E.transitions || 0, room: M.E.room.id }));
  F.ok(t1.tr - t0 === 1, 'Doppeltipp auf „' + go.id + '“: genau ein Ortswechsel (' + (t1.tr - t0) + '), jetzt in „' + t1.room + '“');
  await sleep(p, 450);   // 350 ms nach einem Ortswechsel nimmt das Spiel absichtlich keinen Tipp an (E.sceneBlockUntil)
  const qq = await p.evaluate(HSQ), xa = await p.evaluate(() => M.E.ACT[M.GS.active].x), far = qq.floor.slice().sort((m, n) => Math.abs(n[0] - xa) - Math.abs(m[0] - xa))[0]; await tapAt(p, dev, far); await sleep(p, 900);
  F.ok(await p.evaluate((xa) => Math.abs(M.E.ACT[M.GS.active].x - xa) > 2, xa), 'Szene nach dem Ortswechsel wieder bedienbar (Tipp auf den Boden: Figur geht)');
  finish(F); await p.context().close(); }

// F7: speichern (Lesezeichen), weiterspielen, laden
async function F7(b, dev) { const F = flow('F7', dev, 'Speichern, laden, weiterspielen (k2_limbo)');
  const p = await open(b, 'k2_limbo', ctxOf(dev)); await loadSlot(p); await ready(p); const H = await p.evaluate(HUDBOX);
  await tapAt(p, dev, [H.menu.cx, H.menu.cy]); await sleep(p, 300); F.ok(await p.evaluate(() => M.shell.ctx === 'pause'), 'Tipp auf „Menü“ öffnet die Pause');
  await tapEl(p, dev, '#shell button', 'Speichern'); await tapEl(p, dev, '#shell .cardmain', 'Hier speichern'); await sleep(p, 200);
  F.ok(await p.evaluate(() => /Lesezeichen 1/.test((M.shell.toastNow() || {}).t || '')), 'Lesezeichen 1 gespeichert (Bestätigung erst nach dem Schreiben)');
  const ref = await p.evaluate(() => ({ room: M.E.room.id, x: Math.round(M.E.ACT.marko.x), inv: M.GS.inv.length, notes: M.GS.notes.length }));
  await tapEl(p, dev, '#shell button', 'Zurück'); await tapEl(p, dev, '#shell button', 'Weiterspielen'); await settle(p);
  const q = await p.evaluate(HSQ); await tapAt(p, dev, q.floor[q.floor.length - 1]); await sleep(p, 1200); await settle(p);
  await tapAt(p, dev, [H.menu.cx, H.menu.cy]); await sleep(p, 300); await tapEl(p, dev, '#shell button', 'Laden'); await tapEl(p, dev, '#shell .cardmain', 'Kapitel'); await sleep(p, 600);
  const now = await p.evaluate(() => ({ room: M.E.room.id, x: Math.round(M.E.ACT.marko.x), inv: M.GS.inv.length, notes: M.GS.notes.length, toast: (M.shell.toastNow() || {}).t || '' }));
  F.ok(now.room === ref.room && Math.abs(now.x - ref.x) <= 2 && now.inv === ref.inv && now.notes === ref.notes, 'Laden stellt Ort, Position, Inventar und Notizen her (' + JSON.stringify(now).slice(0, 80) + ')');
  F.ok(/Rückgängig|Geladen/.test(now.toast), '„Rückgängig“ angeboten'); finish(F); await p.context().close(); }

// F8: Ausrichtung ändern während Gespräch und Pause
async function F8(b, dev) { const F = flow('F8', dev, 'Drehen während Gespräch und Pause (k1_bruno)'); if (dev === 'desktop') { F.note('Desktop dreht das Bild absichtlich nicht (nur Geräte mit Touch, 99_main.js touchDev)'); finish(F); return; }
  const ctx = ctxOf(dev); const p = await open(b, 'k1_bruno', ctx); await loadSlot(p); await ready(p);
  await p.evaluate(() => { window.__ch = undefined; M.E.busy = true; const labs = ['Erste Antwort', 'Zweite Antwort', 'Dritte Antwort', '(Gehen.)']; M.API.choose(labs.map((t, i) => ({ t, silent: true, bye: i === 3 })), { conv: false }).then(id => { window.__ch = labs[id]; M.E.busy = false; }); }); await sleep(p, 200);
  const vp = ctx.viewport; await p.setViewportSize({ width: vp.height, height: vp.width }); await sleep(p, 500);
  const s1 = await p.evaluate(() => ({ rot: M.isRotated(), note: document.getElementById('rotnote').classList.contains('on'), dlg: !!M.E.dlg, gt: M.E.gt(), paused: M.E.paused() }));
  F.ok(s1.rot && s1.dlg, 'Hochformat: Bild gedreht, Gespräch bleibt offen'); F.note('Drehhinweis sichtbar: ' + s1.note + ', Spiel angehalten: ' + s1.paused);
  await sleep(p, 600); const gt2 = await p.evaluate(() => M.E.gt()); F.ok(!s1.note || gt2 - s1.gt < 50, 'während der Drehhinweis die Fläche verdeckt, läuft die Spielzeit nicht weiter' + (s1.note ? ' (Δ ' + Math.round(gt2 - s1.gt) + ' ms Spielzeit in 600 ms)' : ''));
  F.evidence.push(await shot(p, 'F8_' + dev + '_hoch_hinweis'));
  if (s1.note) await tapEl(p, dev, '#rotnote button'); await sleep(p, 200);
  await sleep(p, 300); const rows = (await p.evaluate(DLGROWS)).rows;
  await tapPage(p, dev, rows[1].x, rows[1].y); await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 3000 }).catch(() => {});
  F.ok(await p.evaluate(() => window.__ch === 'Zweite Antwort'), 'im gedrehten Bild trifft der Tipp die richtige Antwort'); F.evidence.push(await shot(p, 'F8_' + dev + '_hoch_gedreht'));
  await settle(p); await p.evaluate(() => M.shell.openPause()); await sleep(p, 200); await p.setViewportSize({ width: vp.width, height: vp.height }); await sleep(p, 500);
  const s2 = await p.evaluate(() => ({ rot: M.isRotated(), ctx: M.shell.ctx, btn: [...document.querySelectorAll('#shell .mi')].every(b => { const r = b.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }) }));
  F.ok(!s2.rot && s2.ctx === 'pause' && s2.btn, 'zurück ins Querformat mit offener Pause: Pause bleibt, alle Einträge im Bild');
  await tapEl(p, dev, '#shell button', 'Weiterspielen'); await settle(p); const q = await p.evaluate(HSQ); const h = q.hs.filter(x => x.sq >= 10)[0];
  await p.evaluate(() => { window.__hit = []; const d0 = M.E.doVerb; M.E.doVerb = async function (v, hs) { window.__hit.push(hs && hs.id); }; });
  await tapAt(p, dev, h.c); await sleep(p, 350); const hit = await p.evaluate(() => (M.E.pop && M.E.pop.hs && M.E.pop.hs.id) || window.__hit[0]);
  F.ok(hit === h.id, 'nach dem Zurückdrehen stimmen Bild und Trefferfläche überein („' + h.name + '“)'); finish(F); await p.context().close(); }

// F9: App verlassen (visibilitychange/pagehide), zurückkehren, neu laden
async function F9(b, dev) { const F = flow('F9', dev, 'App verlassen, zurückkehren, neu laden (k2_limbo)');
  const p = await open(b, 'k2_limbo', ctxOf(dev)); await loadSlot(p); await ready(p);
  const q = await p.evaluate(HSQ); await tapAt(p, dev, q.floor[q.floor.length - 1]); await sleep(p, 1500); await settle(p);
  const before = await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('mala.save.1')); return { at: d.at, x: Math.round(M.E.ACT.marko.x), room: M.E.room.id }; });
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('pagehide')); });
  const saved = await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('mala.save.1')); return { at: d.at, x: Math.round(d.GS.pos.marko.x), room: d.GS.pos.marko.room }; });
  F.ok(saved.at > before.at && saved.room === before.room && Math.abs(saved.x - before.x) <= 3, 'beim Verlassen (visibilitychange/pagehide) wird gespeichert, mit aktueller Position');
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
  const back = await p.evaluate(() => ({ screen: M.E.screen, ctx: M.shell.ctx, audio: M.audioRunning() }));
  F.note('Rückkehr: Bildschirm „' + back.screen + '“, Pause offen: ' + (back.ctx === 'pause') + ' (Ton im Test nicht prüfbar)');
  // mitten in einer Szene verlassen: gespeichert wird der Stand vom Szenenbeginn (safeGS)
  await p.evaluate(() => { M.E.busy = true; M.API.m('Ein Satz mitten in einer Szene.'); }); await sleep(p, 200);
  const at0 = await p.evaluate(() => JSON.parse(localStorage.getItem('mala.save.1')).at);
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('pagehide')); Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); });
  F.ok(await p.evaluate((at0) => JSON.parse(localStorage.getItem('mala.save.1')).at >= at0, at0), 'Verlassen mitten in einer Szene speichert ebenfalls (Stand vom Szenenbeginn, safeGS)');
  await p.evaluate(() => { M.E.endSpeech(); M.E.busy = false; });
  await p.reload(); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 }); await tapEl(p, dev, '#shell button', 'Fortsetzen');
  F.ok(await p.waitForFunction(() => M.E.screen === 'game', null, { timeout: 8000 }).then(() => true, () => false) && await p.evaluate(() => M.E.room.id) === before.room, 'nach dem Neuladen: „Fortsetzen“ führt in denselben Raum');
  F.note('fehlende Pagehide-/Visibility-Abdeckung echter iOS-Wechsel: nur synthetische Ereignisse geprüft'); finish(F); await p.context().close(); }

// F10: schnelle Mehrfachtipps, Overlays schnell öffnen/schließen, Menü scrollen
async function F10(b, dev) { const F = flow('F10', dev, 'Mehrfachtipps, Overlays, Scrollen im Menü (k1_amt)');
  const p = await open(b, 'k1_amt', ctxOf(dev)); await loadSlot(p); await ready(p); const q = await p.evaluate(HSQ);
  const ex = q.hs.find(h => h.exit && h.sq >= 6); if (ex) { const t0 = await p.evaluate(() => M.E.transitions || 0), xy = await p.evaluate(PT, ex.c);
    for (let i = 0; i < 5; i++) { if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(xy[0], xy[1]); else await p.touchscreen.tap(xy[0], xy[1]); await sleep(p, 45); }
    await p.waitForFunction(() => !M.E.transitioning && !M.E.busy && !M.E.ACT.marko.res, null, { timeout: 15000 }).catch(() => {}); await sleep(p, 600);
    const t1 = await p.evaluate(() => M.E.transitions || 0); F.ok(t1 - t0 <= 1, '5 schnelle Tipps auf den Ausgang „' + ex.name + '“: ' + (t1 - t0) + ' Ortswechsel');
    const back = await p.evaluate(() => ({ room: M.E.room.id })); F.note('jetzt in „' + back.room + '“'); }
  await settle(p); const q2 = await p.evaluate(HSQ); const o = q2.hs.filter(h => !h.exit && h.sq >= 8)[0];
  if (o) { await p.evaluate(() => { window.__v = []; M.__speechLog = []; const d0 = M.E.doVerb; M.E.doVerb = async function (v, hs, it) { window.__v.push(v + ':' + (hs && hs.id)); return d0.apply(this, arguments); }; });
    const xy = await p.evaluate(PT, o.c); for (let i = 0; i < 2; i++) { if (DEV[dev].engine === 'chromium' && !ctxOf(dev).hasTouch) await p.mouse.click(xy[0], xy[1]); else await p.touchscreen.tap(xy[0], xy[1]); await sleep(p, 120); }
    await p.waitForFunction(() => { const E = M.E; if (E.speech && E.gt() - E.speech.at > 300) E.endSpeech(); return !E.busy && !E.speech && !(E.ACT.marko && E.ACT.marko.mode === 'walk'); }, null, { timeout: 15000, polling: 50 }).catch(() => {}); await sleep(p, 300);
    const s = await p.evaluate(() => ({ v: window.__v.slice(), pop: !!M.E.pop, said: (M.__speechLog || []).map(x => x[1]) })); await p.evaluate(() => { M.__speechLog = null; });
    F.note('Doppeltipp auf „' + o.name + '“: Aufrufe ' + (s.v.join(', ') || (s.pop ? 'Verb-Menü offen' : 'keine')) + '; gesagte Sätze: ' + s.said.length);
    F.ok(s.said.length <= 1 || (s.said.length === 2 && s.said[0] !== s.said[1]), 'Doppeltipp auf „' + o.name + '“ führt die Handlung höchstens einmal aus (' + s.said.length + ' Antwortsatz/-sätze)'); await p.evaluate(() => { M.E.pop = null; }); await settle(p); }
  // Notizbuch schnell öffnen und schließen
  const H = await p.evaluate(HUDBOX); for (let i = 0; i < 4; i++) { await tapAt(p, dev, [H.notes.cx, H.notes.cy]); await sleep(p, 60); }
  await sleep(p, 400); const nb = await p.evaluate(() => ({ ov: M.E.overlay && M.E.overlay.kind, busy: M.E.busy })); F.note('4 schnelle Tipps auf „Notizen“: Overlay ' + (nb.ov || 'zu'));
  if (nb.ov === 'notebook') { await p.keyboard.press('Escape').catch(() => {}); await sleep(p, 200); }
  await p.evaluate(() => { if (M.E.overlay) M.E.closeOverlay(null); }); await settle(p);
  // Scrollen im Menü „Laden“ reicht nichts an die Szene weiter
  await p.evaluate(() => M.shell.openPause()); await sleep(p, 150); await tapEl(p, dev, '#shell button', 'Laden'); await tapEl(p, dev, '#shell button', 'Andere Plätze'); await sleep(p, 200);
  const st0 = await p.evaluate(() => ({ x: M.E.ACT.marko.x, tr: M.E.transitions || 0, pop: !!M.E.pop }));
  const sc = await p.evaluate(() => { const s = document.querySelector('#shell .scroll'); if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.7, h: s.scrollHeight - s.clientHeight }; });
  if (sc && DEV[dev].engine === 'chromium') { const cdp = await p.context().newCDPSession(p); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sc.x, y: sc.y, id: 2 }] });
    for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: sc.x, y: sc.y - i * 12, id: 2 }] }); await sleep(p, 16); } await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(p, 300); }
  const st1 = await p.evaluate(() => ({ x: M.E.ACT.marko.x, tr: M.E.transitions || 0, pop: !!M.E.pop, top: (document.querySelector('#shell .scroll') || {}).scrollTop || 0, ctx: M.shell.ctx }));
  F.ok(st1.x === st0.x && st1.tr === st0.tr && !st1.pop && st1.ctx === 'pause', 'Wischen im Menü „Laden“ wirkt nicht auf die Szene' + (sc ? ' (gescrollt ' + st1.top + ' px von ' + sc.h + ')' : ''));
  finish(F); await p.context().close(); }

// ---------------------------------------------------------------- Ablauf
(async () => {
  const pick = (list) => DEVS.length ? list.filter(d => DEVS.indexOf(d) >= 0) : list;
  const wk = await browserFor('webkit'), cr = await browserFor('chromium');
  const B = (dev) => DEV[dev].engine === 'webkit' ? wk : cr;
  const run = async (name, fn, dev) => { try { await fn(B(dev), dev); } catch (e) { const F = flow(name, dev, 'Ausnahme'); F.ok(false, 'Ausnahme: ' + String(e && e.message || e).split('\n')[0]); finish(F); } };
  if (want('messung')) for (const d of pick(['iphoneSE', 'iphone16', 'iphone13', 'iphone17pm', 'ipad', 'ipadpro', 'desktop'])) await run('messung', measure, d);
  const FL = { F1, F2, F3, F4, F5, F5b, F6, F7, F8, F9, F10 };
  for (const [k, fn] of Object.entries(FL)) if (want(k)) for (const d of pick(['iphone16', 'iphone13', 'ipad', 'desktop'])) await run(k, fn, d);
  if (want('F3b')) { DEV.iphone16cr = { name: 'iPhone 16 quer (Chromium-Emulation, CDP-Touch)', d: 'iPhone 16 landscape', engine: 'chromium' }; await run('F3b', F3b, 'iphone16cr'); }
  if (want('F10cr')) { DEV.iphone16cr = DEV.iphone16cr || { name: 'iPhone 16 quer (Chromium-Emulation, CDP-Touch)', d: 'iPhone 16 landscape', engine: 'chromium' }; await run('F10', F10, 'iphone16cr'); }
  await wk.close(); await cr.close();
  const file = path.join(BASE, 'devicetests.json'); let prev = {}; try { prev = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) {}
  const merged = { made: R.made, method: R.method, devices: Object.assign({}, prev.devices || {}, R.devices), flows: (prev.flows || []).filter(f => !R.flows.some(g => g.id === f.id && g.dev === f.dev)).concat(R.flows.map(f => { const o = Object.assign({}, f); delete o.ok; delete o.note; return o; })) };
  fs.writeFileSync(file, JSON.stringify(merged, null, 1)); log('\n' + R.flows.length + ' Abläufe → ' + path.relative(process.cwd(), file));
})().catch(e => { console.error(e); process.exit(1); });
