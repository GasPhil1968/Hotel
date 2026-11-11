// Browser-Test der K3-Revision mit echter Eingabe (Prüfbericht K3-01 und Abnahmekriterium „mit echter Maus-/Touch-Eingabe erreichbar“).
// Maus (Desktop 1280 × 800): Gegenstand aus dem Inventar auf das Ziel ziehen; Klick aufs Ziel öffnet das Verb-Menü am Zeiger, ein Klick
// auf die Zeile führt es aus; Overlays werden an ihren gezeichneten Feldern angeklickt. Finger (iPad quer, Chromium mit Touch-Emulation):
// Gegenstand antippen, dann das Ziel antippen; Tipp aufs Ziel öffnet die Aktionsleiste, Tipp auf den Knopf führt aus.
// Geprüft: Handschuhfach und Radio im offenen Führerhaus, Zdravkos Schublade (Mala), der Fotovergleich unter der Brücke und Malas Blick
// durch den Quader, der Kartenvergleich 1985/2011, die Garagentore (Mala sieht, Marko schließt auf), Haube und Batterie.
// Nur das Umschalten zwischen Marko und Mala geht über M.TA.switchTo (das Porträt ist nicht Gegenstand dieses Tests).
//   node qa/ui/k3_revision.js [--shots <ordner>]        (Exitcode 1 bei Fehlern)
'use strict';
const path = require('path'), fs = require('fs');
const { pw, checker, settle } = require('./lib');
const HTML = process.env.MALA_HTML || path.join(__dirname, '..', '..', 'web', 'index.html');
const FXDIR = path.join(__dirname, '..', 'regress', 'fixtures');
const a = process.argv.slice(2), SHOTS = a.indexOf('--shots') >= 0 ? path.resolve(a[a.indexOf('--shots') + 1]) : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const DESK = { viewport: { width: 1280, height: 800 } };
const IPAD = { viewport: { width: 1080, height: 810 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };
async function shot(p, n) { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, n + '.png') }); }
// Spielstand aus einer Regressions-Vorlage, gezielt verändert, über den echten Ladeweg (M.E.loadKey)
async function openWith(b, dev, fx, s) {
  const ctx = await b.newContext(dev); const p = await ctx.newPage(); p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p.errs.push('console: ' + m.text()); });
  await p.goto('file://' + HTML); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 });
  const d = JSON.parse(fs.readFileSync(path.join(FXDIR, fx), 'utf8'));
  await p.evaluate(({ GS, s }) => { const base = M.freshGame(); Object.keys(base).forEach(k => { if (GS[k] !== undefined) base[k] = GS[k]; }); const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
    Object.assign(G.flags, s.flags || {}); (s.notes || []).forEach(n => { if (G.notes.indexOf(n) < 0) G.notes.push(n); }); if (s.inv) G.inv = s.inv.slice();
    const st = M.ROOMS[s.pos].start || [160, 120, 'R']; G.pos.marko = { room: s.pos, x: st[0], y: st[1], f: st[2] || 'R' }; G.pos.mala = { room: s.pos, x: st[0] + 30, y: st[1] - 2, f: st[2] || 'R' }; G.active = 'marko'; G.malaOn = true;
    Object.keys(s.rooms || {}).forEach(r => { G.rooms[r] = Object.assign(G.rooms[r] || {}, s.rooms[r]); });
    localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.TURBO = 20; M.E.loadKey('mala.qafx'); }, { GS: d.GS, s });
  await settle(p); await p.evaluate(() => { M.TURBO = 6; }); return p; }
const wait = (p, ms) => p.waitForTimeout(ms);
// ruhig: keine laufende Handlung, die Figur geht nicht mehr (settle allein endet schon, während Marko noch zum Ziel läuft)
const calm = async (p) => { await wait(p, 150); for (let i = 0; i < 3; i++) { await p.waitForFunction(() => { const E = M.E, a = E.ACT && E.ACT[M.GS.active]; if (E.speech) E.endSpeech(); return !(E.acting > 0) && !(a && a.mode === 'walk') && !E.busy; }, null, { timeout: 90000, polling: 40 }); await settle(p, 90000); await wait(p, 120); } };
// Spielkoordinaten → Seite. Szene: Weltkoordinaten minus Kamera; Overlay und Leiste: Bildschirmkoordinaten (320 × 200)
const scenePage = (p, x, y) => p.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(), cam = Math.round(M.E.camX || 0); return { x: r.left + (x - cam + 0.5) / 320 * r.width, y: r.top + (y + 0.5) / 200 * r.height }; }, [x, y]);
const screenPage = (p, x, y) => p.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left + (x + 0.5) / 320 * r.width, y: r.top + (y + 0.5) / 200 * r.height }; }, [x, y]);
// ein Punkt, an dem die echte Treffererkennung genau diese Stelle liefert (von der Mitte nach außen gesucht)
const hsPoint = (p, id) => p.evaluate((id) => { const E = M.E, h = E.room.byId[id]; if (!h) return null; const r = E.hsRect(h); if (!r) return null; const cx = r[0] + (r[2] >> 1), cy = r[1] + (r[3] >> 1);
  for (let d = 0; d < 40; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue; const x = cx + dx, y = cy + dy; if (y < 1 || y > 142) continue; if (E.hotspotAt(x, y) === h) return [x, y]; } return null; }, id);
const slotPage = (p, item) => p.evaluate((item) => { const i = M.GS.inv.indexOf(item); const r = document.getElementById('game').getBoundingClientRect(), s = r.width / 320; return i < 0 ? null : { x: r.left + (51 + i * 40 + 20) * s, y: r.top + (161 + 18) * s }; }, item);
const ovHit = async (p, id) => { await p.waitForFunction((id) => { const L = M.E.overlay && M.E.overlay.lay && M.E.overlay.lay.hits; return !!(L && L.some(q => q.id === id)); }, id, { timeout: 20000, polling: 40 }).catch(() => {});   // Felder entstehen beim ersten Zeichnen
  const h = await p.evaluate((id) => { const L = M.E.overlay && M.E.overlay.lay && M.E.overlay.lay.hits; const x = (L || []).find(q => q.id === id); return x ? [x.r[0] + (x.r[2] >> 1), x.r[1] + (x.r[3] >> 1)] : null; }, id); return h ? screenPage(p, h[0], h[1]) : null; };
// Maus
async function mouseDrag(p, item, hs) { const s = await slotPage(p, item), t0 = await hsPoint(p, hs); if (!s || !t0) return false; const t = await scenePage(p, t0[0], t0[1]);
  await p.mouse.move(s.x, s.y); await p.mouse.down(); await wait(p, 60); await p.mouse.move(s.x + 10, s.y - 10, { steps: 3 }); await p.mouse.move(t.x, t.y, { steps: 10 }); await wait(p, 80); await p.mouse.up(); await wait(p, 150); return true; }
async function mouseVerb(p, hs, verb) { const t0 = await hsPoint(p, hs); if (!t0) return false; const t = await scenePage(p, t0[0], t0[1]); await p.mouse.click(t.x, t.y); await wait(p, 180);
  const row = await p.evaluate((v) => { const P = M.E.pop; if (!P || P.html) return null; const i = P.opts.findIndex(o => o.v === v); if (i < 0) return null; const rh = P.rh || 13; return [P.bx + (P.bw >> 1), P.by + 2 + (i + 1) * rh + (rh >> 1)]; }, verb);
  if (!row) return false; const r = await screenPage(p, row[0], row[1]); await p.mouse.click(r.x, r.y); await wait(p, 150); return true; }
async function mouseOv(p, id) { const q = await ovHit(p, id); if (!q) return false; await p.mouse.click(q.x, q.y); await wait(p, 150); return true; }
// Finger
async function touchUse(p, item, hs) { const s = await slotPage(p, item), t0 = await hsPoint(p, hs); if (!s || !t0) return false; await p.touchscreen.tap(s.x, s.y); await wait(p, 650);
  const pend = await p.evaluate(() => M.E.pending); const t = await scenePage(p, t0[0], t0[1]); await p.touchscreen.tap(t.x, t.y); await wait(p, 200); return pend === item; }
// Tipp aufs Ziel: (a) „Welches?“, wenn ein viel kleineres Ding im Fangradius liegt – dann das Ziel wählen; (b) die Aktionsleiste – dann das Verb;
// (c) gibt es nur eine Handlung (etwa Mala: Schau an), führt der Tipp sie sofort aus. Rückgabe: 'leiste', 'sofort' oder false.
async function touchVerb(p, hs, verb) { const t0 = await hsPoint(p, hs); if (!t0) return false; const t = await scenePage(p, t0[0], t0[1]); await p.touchscreen.tap(t.x, t.y); await wait(p, 300);
  const pick = await p.evaluate((id) => M.E.pop && M.E.pop.pickFrom ? M.E.pop.opts.findIndex(o => o.pick && o.pick.id === id) : -2, hs);
  if (pick >= 0) { await p.locator('#abar .ab-row button[data-a="pop"]').nth(pick).tap(); await wait(p, 300); } else if (pick === -1) return false;
  const st = await p.evaluate((v) => ({ i: M.E.pop && M.E.pop.html ? M.E.pop.opts.findIndex(o => o.v === v) : -1, run: !!(M.E.acting > 0 || M.E.busy || M.E.speech) }), verb);
  if (st.i < 0) return st.run ? 'sofort' : false; await p.locator('#abar .ab-row button[data-a="pop"]').nth(st.i).tap(); await wait(p, 150); return 'leiste'; }
async function touchOv(p, id) { const q = await ovHit(p, id); if (!q) return false; await p.touchscreen.tap(q.x, q.y); await wait(p, 200); return true; }
const flag = (p, k) => p.evaluate((k) => M.GS.flags[k], k); const has = (p, i) => p.evaluate((i) => M.GS.inv.indexOf(i) >= 0, i); const note = (p, n) => p.evaluate((n) => M.GS.notes.indexOf(n) >= 0, n);
const sw = async (p, w) => { await p.evaluate((w) => M.TA.switchTo(w), w); await calm(p); };

(async () => {
  const T = checker('K3-Revision, echte Eingabe'); const b = await pw.chromium.launch(); const errs = [];
  const done = async (p) => { errs.push(...p.errs); await p.context().close(); };
  try {
    T.section('Maus: Führerhaus (Handschuhfach, Radio), Schublade, Fotovergleich, Kartenvergleich');
    let p = await openWith(b, DESK, 'k3x_sonntag.json', { pos: 'vhof', inv: ['odvijac'], rooms: { vhof: { cabIn: true } } }); await shot(p, 'm_fuehrerhaus');
    T.ck(await mouseDrag(p, 'odvijac', 'glove'), 'Schraubenzieher auf das Handschuhfach gezogen'); await calm(p);
    T.ck(await has(p, 'putni_nalog') && await p.evaluate(() => !!M.GS.rooms.vhof.gloveOpen), 'Handschuhfach offen, Fahrtenbuch genommen');
    T.ck(await mouseDrag(p, 'odvijac', 'radio'), 'Schraubenzieher auf das Radio gezogen'); await calm(p); T.ck(await has(p, 'kaseta'), 'Kassette herausgeholt'); await done(p);
    p = await openWith(b, DESK, 'k3x_sonntag.json', { pos: 'kafic', inv: ['plan'] }); await sw(p, 'mala');
    T.ck(await mouseVerb(p, 'bar_drawer', 'look'), 'Mala: Klick auf die Schublade, „Schau an“ im Menü'); await calm(p); T.ck(await note(p, 'b3_folder'), 'Mala sieht die Mappe in der Schublade'); await done(p);
    p = await openWith(b, DESK, 'k3x_samstag.json', { pos: 'podmost', inv: ['foto_1965'], flags: { 'k3.rules': 2, 'k3.z.mala': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.s.photoTrip': true, 'k3.s.down': true }, notes: ['b3_photo65'] });
    T.ck(await mouseDrag(p, 'foto_1965', 'r2'), 'Foto auf den Felsen mit Riss gezogen'); await wait(p, 600); await p.waitForFunction(() => M.E.overlay && M.E.overlay.kind === 'foto65', null, { timeout: 20000 }).catch(() => {});
    T.ck(await p.evaluate(() => !!(M.E.overlay && M.E.overlay.kind === 'foto65' && M.E.overlay.data.at === 'r2')), 'Vergleichsbild offen'); await shot(p, 'm_vergleich_r2');
    T.ck(await mouseOv(p, 'go'), '„Weiter“ angeklickt'); await calm(p); T.ck(!(await flag(p, 'k3.s.spot')), 'r2 ist nicht der Standort');
    await mouseDrag(p, 'foto_1965', 'r3'); await p.waitForFunction(() => M.E.overlay && M.E.overlay.kind === 'foto65', null, { timeout: 20000 }).catch(() => {}); await mouseOv(p, 'go'); await calm(p);
    T.ck(await flag(p, 'k3.s.spot'), 'an der flachen Platte: Standort gefunden'); await sw(p, 'mala');
    T.ck(await mouseVerb(p, 'block', 'look'), 'Mala: Klick auf den Quader, „Schau an“'); await calm(p); T.ck(await flag(p, 'k3.s.initials'), 'Mala sieht „M · D · 1965“'); await done(p);
    p = await openWith(b, DESK, 'k3x_sonntag.json', { pos: 'kafic', inv: ['plan'], flags: { 'k3.rules': 2 }, notes: ['b3_garage'] });
    T.ck(await mouseDrag(p, 'plan', 'oldmap'), 'Stadtplan auf die alte Karte gezogen'); await p.waitForFunction(() => M.E.overlay && M.E.overlay.kind === 'karte85', null, { timeout: 30000 }).catch(() => {});
    T.ck(await p.evaluate(() => !!(M.E.overlay && M.E.overlay.kind === 'karte85')), 'Kartenvergleich offen'); await shot(p, 'm_karte85');
    await mouseOv(p, 'st_d'); T.ck(await p.evaluate(() => !!(M.E.overlay && M.E.overlay.data.bad && /quer/.test(M.E.overlay.data.msg))), 'Klick auf die Jasenova: falsch, mit Begründung');
    await mouseOv(p, 'st_a'); T.ck(await p.evaluate(() => !!(M.E.overlay && M.E.overlay.data.done)), 'Klick auf die Lipova: richtig'); await mouseOv(p, 'go'); await calm(p);
    T.ck(await note(p, 'b3_street') && await p.evaluate(() => !!M.GS.map.garaze), 'Notiz und Garagen auf dem Plan'); await done(p);

    T.section('Finger (iPad quer): Garage, Haube, Batterie; Fotovergleich; Radio');
    p = await openWith(b, IPAD, 'k3x_sonntag.json', { pos: 'garaze', inv: ['kljuc_garaza'], flags: { 'k3.rules': 2 }, notes: ['b3_street', 'b3_garage'] }); await shot(p, 't_garagen');
    T.ck(await touchUse(p, 'kljuc_garaza', 'g4'), 'Schlüssel angetippt, dann das vierte Tor'); await calm(p); T.ck(!(await flag(p, 'k3.b.garageOpen')), 'ohne Malas Blick schließt Marko nicht auf');
    await sw(p, 'mala'); const tv = await touchVerb(p, 'g4', 'look'); T.ck(!!tv, 'Mala: Tor antippen (' + tv + ': nur eine Handlung, der Tipp führt sie aus)'); await calm(p); T.ck(await flag(p, 'k3.b.g7'), 'Mala sieht den Mercedes'); await sw(p, 'marko');
    await touchUse(p, 'kljuc_garaza', 'g4'); await calm(p); T.ck(await flag(p, 'k3.b.garageOpen'), 'Tor sieben geöffnet');
    T.ck(await touchVerb(p, 'hood', 'open'), 'Haube antippen, „Öffne“'); await calm(p); T.ck(await p.evaluate(() => !!M.GS.rooms.garaze.hood), 'Haube offen'); await shot(p, 't_garage_offen');
    T.ck(await touchVerb(p, 'battery', 'take'), 'Batterie antippen, „Nimm“'); await calm(p); T.ck(await has(p, 'akumulator'), 'Mates Batterie im Inventar'); await done(p);
    p = await openWith(b, IPAD, 'k3x_samstag.json', { pos: 'podmost', inv: ['foto_1965'], flags: { 'k3.rules': 2, 'k3.s.trip': true, 'k3.s.photoTrip': true, 'k3.s.down': true } });
    T.ck(await touchUse(p, 'foto_1965', 'r1'), 'Foto antippen, dann den runden Block'); await p.waitForFunction(() => M.E.overlay && M.E.overlay.kind === 'foto65', null, { timeout: 20000 }).catch(() => {});
    T.ck(await touchOv(p, 'go'), '„Weiter“ angetippt'); await calm(p); T.ck(await p.evaluate(() => !M.E.overlay), 'Vergleich geschlossen'); await done(p);
    p = await openWith(b, IPAD, 'k3x_sonntag.json', { pos: 'vhof', inv: ['odvijac'], rooms: { vhof: { cabIn: true } } });
    T.ck(await touchUse(p, 'odvijac', 'radio'), 'Schraubenzieher antippen, dann das Radio'); await calm(p); T.ck(await has(p, 'kaseta'), 'Kassette (Finger)'); await done(p);
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ')); }
  T.ck(errs.length === 0, 'keine Fehler in der Seite' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.fails ? 'FEHL' : 'OK') + ' · ' + (T.n - T.fails) + '/' + T.n + ' Prüfpunkte'); process.exitCode = T.fails ? 1 : 0;
})();
