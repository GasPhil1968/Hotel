// Trailer-Aufnahmen aus der laufenden Engine (web/index.html), Bild und Ton zusammen.
// Bild: das Spiel-Canvas #game (320 × 200, Szene 320 × 144 und Leiste 320 × 56) wird Bild für Bild ohne Glättung fünffach in ein
// zweites Canvas kopiert (1600 × 1000) und mit captureStream(30) aufgenommen; der Zeiger ist Teil des Spielbilds (das Spiel malt ihn
// selbst). Ton: die Ausgabe der Engine (M.audioStream). MediaRecorder VP9/Opus; weiter mit ffmpeg (render.py).
// Eingaben sind echte Maus- und Tastaturereignisse über Playwright (bewegter Zeiger, Klick, Taste), keine Abkürzungen über die API;
// nur das Laden eines Ausgangsstands (Spielstand aus den Musterlösungen) geschieht über das Spiel selbst (M.E.loadKey).
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const { chromium } = require('playwright');
const HTML = process.env.MALA_HTML || path.join(ROOT, 'web', 'index.html');
const SC = 4;   // Anzeige im Browser: 1280 × 800 (vierfach); aufgenommen wird fünffach (1600 × 1000)

async function launch() {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await p.goto('file://' + HTML); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
  await p.evaluate(() => { try { localStorage.setItem('mala.tspeed', '1'); localStorage.setItem('mala.tap', '0'); } catch (e) {} });
  return { b, ctx, p };
}
// Spielstand laden: GS aus einer Datei (Fixture oder Durchlauf-Dump) und ein Änderungsrumpf (Text, läuft mit G im Browser)
async function loadState(p, file, patch) {
  const d = JSON.parse(fs.readFileSync(path.isAbsolute(file) ? file : path.join(ROOT, file), 'utf8'));
  await p.evaluate(({ GS, patch }) => { const base = M.freshGame(); Object.keys(base).forEach(k => { if (GS[k] !== undefined) base[k] = GS[k]; });
    const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G); if (patch) (new Function('G', patch))(G);
    localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.TURBO = 20; M.E.loadKey('mala.qafx'); }, { GS: d.GS || d, patch: patch || '' });
  await settle(p); await p.waitForTimeout(300); await settle(p);
  await p.evaluate(() => { M.TURBO = 1; });
}
// warten, bis das Spiel Eingaben annimmt (Karten und laufende Sätze werden dabei NICHT übersprungen, wenn keep=true)
async function settle(p, ms) {
  await p.waitForFunction(() => { const E = M.E; if (E.screen === 'card' && E.card && !E.card.noSkip) { E.closeCard(); return false; } if (E.speech) E.endSpeech();
    return E.screen === 'game' && !E.busy && !E.speech && !E.dlg && !E.overlay && !E.menu && !E.transitioning; }, null, { timeout: ms || 60000, polling: 40 });
}
async function idle(p, ms) { await p.waitForFunction(() => { const E = M.E; return E.screen === 'game' && !E.busy && !E.speech && !E.dlg && !E.overlay && !E.transitioning && !(E.ACT[M.GS.active] && E.ACT[M.GS.active].mode === 'walk'); }, null, { timeout: ms || 60000, polling: 40 }); }
async function audioOn(p, song) {
  return p.evaluate((song) => { M.audioInit(); M.audioResume(); if (M.setMusic) M.setMusic(true); if (M.setSound) M.setSound(true); if (song !== undefined) M.music(song); return { run: M.audioRunning(), song: M.currentSong() }; }, song);
}
// Aufnahme: full = ganzes Canvas (Szene + Leiste)
async function startRec(p, opt) {
  opt = opt || {};
  await p.evaluate((o) => { const src = document.getElementById('game'), c = document.createElement('canvas'); c.width = 1600; c.height = 1000; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    (function loop() { g.drawImage(src, 0, 0, 320, 200, 0, 0, 1600, 1000); window.__recRaf = requestAnimationFrame(loop); })();
    const st = c.captureStream(30); if (!o.noAudio) { const as = M.audioStream(); if (as) as.getAudioTracks().forEach(t => st.addTrack(t)); }
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
    const r = new MediaRecorder(st, { mimeType: mt, videoBitsPerSecond: 24000000, audioBitsPerSecond: 192000 }); window.__chunks = []; window.__marks = [];
    r.ondataavailable = e => { if (e.data && e.data.size) window.__chunks.push(e.data); }; window.__rec = r; window.__t0 = performance.now(); r.start(500); }, opt);
  await p.waitForTimeout(300);
}
// eine Zeitmarke im Protokoll der Aufnahme (Sekunden seit Start), für den Schnittplan
async function mark(p, label) { return p.evaluate((l) => { if (!window.__marks) { window.__marks = []; window.__t0 = performance.now(); } const t = (performance.now() - window.__t0) / 1000; window.__marks.push([+t.toFixed(2), l]); return t; }, label); }
async function stopRec(p, out) {
  const size = await p.evaluate(() => new Promise(res => { const r = window.__rec; r.onstop = () => { cancelAnimationFrame(window.__recRaf); window.__blob = new Blob(window.__chunks, { type: 'video/webm' }); res(window.__blob.size); }; r.stop(); }));
  const parts = [], STEP = 4 * 1024 * 1024;
  for (let off = 0; off < size; off += STEP) {
    const b64 = await p.evaluate(({ off, STEP }) => new Promise(res => { const fr = new FileReader(); fr.onload = () => { const u = fr.result; res(u.slice(u.indexOf('base64,') + 7)); }; fr.readAsDataURL(window.__blob.slice(off, off + STEP)); }), { off, STEP });
    parts.push(Buffer.from(b64, 'base64'));
  }
  fs.writeFileSync(out, Buffer.concat(parts));
  const marks = await p.evaluate(() => window.__marks); fs.writeFileSync(out.replace(/\.webm$/, '.marks.json'), JSON.stringify(marks, null, 1));
  return { size, marks };
}
// ---------------------------------------------------------------- Zeiger und Klicks in Spielkoordinaten (320 × 200)
let MX = 160, MY = 100;
async function mouseTo(p, gx, gy, ms) { ms = ms || 450; const n = Math.max(6, Math.round(ms / 16)), x0 = MX, y0 = MY;
  for (let i = 1; i <= n; i++) { const u = i / n, e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; await p.mouse.move((x0 + (gx - x0) * e) * SC + 2, (y0 + (gy - y0) * e) * SC + 2); await p.waitForTimeout(ms / n); }
  MX = gx; MY = gy; }
async function click(p, gx, gy, ms) { await mouseTo(p, gx, gy, ms); await p.waitForTimeout(120); await p.mouse.down(); await p.waitForTimeout(70); await p.mouse.up(); }
async function dblclick(p, gx, gy, ms) { await mouseTo(p, gx, gy, ms); await p.waitForTimeout(100); await p.mouse.click(gx * SC + 2, gy * SC + 2, { clickCount: 1 }); await p.waitForTimeout(90); await p.mouse.click(gx * SC + 2, gy * SC + 2, { clickCount: 2 }); }
// Punkt, an dem ein Hotspot tatsächlich getroffen wird (Mitte seiner Trefferfläche, im Bild)
async function hsPoint(p, id) { return p.evaluate((id) => { const E = M.E, R = E.room, h = R.byId[id]; if (!h) return null; const r = E.hsRect(h), cam = Math.round(E.camX); if (!r) return null;
  const cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2, pts = [[cx, cy]]; for (let dy = -r[3] / 2 + 2; dy < r[3] / 2; dy += 3) for (let dx = -r[2] / 2 + 2; dx < r[2] / 2; dx += 3) pts.push([cx + dx, cy + dy]);
  pts.sort((a, b) => Math.hypot(a[0] - cx, a[1] - cy) - Math.hypot(b[0] - cx, b[1] - cy));
  for (const q of pts) { const x = Math.round(q[0]), y = Math.round(q[1]); if (x - cam < 2 || x - cam > 317 || y < 1 || y > 143) continue; const hit = E.hotspotAt(x, y); if (hit && hit.id === id) return [x - cam, y]; }
  return null; }, id); }
// Kamera ruhig? (der Raum scrollt der Figur hinterher; vorher berechnete Bildpunkte würden sonst danebenliegen)
async function camSettle(p) { let last = null, same = 0; for (let i = 0; i < 80 && same < 3; i++) { const c = await p.evaluate(() => Math.round(M.E.camX * 10)); if (c === last) same++; else same = 0; last = c; await p.waitForTimeout(60); } }
async function clickHs(p, id, ms) { await p.waitForFunction(() => !M.E.busy && !M.E.speech && !M.E.transitioning, null, { timeout: 60000, polling: 40 }); await camSettle(p); let q = await hsPoint(p, id); if (!q) throw new Error('Hotspot nicht im Bild: ' + id); await mouseTo(p, q[0], q[1], ms); await camSettle(p);
  q = await hsPoint(p, id) || q; await click(p, q[0], q[1], 80); return q; }
// Eintrag im Handlungsmenü am Zeiger (E.pop) anklicken
async function clickPop(p, re, ms) { await p.waitForFunction(() => !!M.E.pop && !M.E.pop.html, null, { timeout: 8000 });
  const q = await p.evaluate((src) => { const pp = M.E.pop, rh = pp.rh || 11, re = new RegExp(src); const i = pp.opts.findIndex(o => re.test(o.t)); if (i < 0) return { miss: pp.opts.map(o => o.t) }; return [pp.bx + pp.bw / 2, pp.by + 2 + (i + 1) * rh + rh / 2]; }, re.source || re);
  if (q.miss) throw new Error('Menüeintrag fehlt: ' + re + ' in ' + q.miss.join(' | ')); await click(p, q[0], q[1], ms); }
// Antwort in der Auswahlliste anklicken (blättert bei Bedarf mit dem Mausrad)
async function clickOpt(p, re, ms) {
  await p.waitForFunction(() => !!M.E.dlg && !!M.E.dlg.lay && !M.E.speech, null, { timeout: 60000 }); await p.waitForTimeout(260);
  for (let tries = 0; tries < 12; tries++) {
    const q = await p.evaluate((src) => { const d = M.E.dlg, re = new RegExp(src); const k = d.opts.findIndex(o => re.test(o.t)); if (k < 0) return { miss: d.opts.map(o => o.t) }; const row = (d.lay.rows || []).find(r => r.k === k); if (!row) return { scroll: k > (d.vis[d.vis.length - 1] || 0) ? 1 : -1 }; const r = row.r; return [r[0] + Math.min(60, r[2] / 2), r[1] + r[3] / 2]; }, re.source || re);
    if (q.miss) throw new Error('Antwort fehlt: ' + re + ' in ' + q.miss.join(' | '));
    if (q.scroll) { await mouseTo(p, 150, 172, 200); await p.mouse.wheel(0, q.scroll * 60); await p.waitForTimeout(250); continue; }
    await click(p, q[0], q[1], ms); return; }
  throw new Error('Antwort nicht erreichbar: ' + re);
}
async function waitSpeech(p, re, ms) { await p.waitForFunction((src) => !!M.E.speech && new RegExp(src).test(M.E.speech.src || M.E.speech.text), re.source || re, { timeout: ms || 60000, polling: 30 }); }
async function waitNoSpeech(p, ms) { await p.waitForFunction(() => !M.E.speech, null, { timeout: ms || 60000, polling: 30 }); }
async function waitDlg(p, ms) { await p.waitForFunction(() => !!M.E.dlg && !M.E.speech, null, { timeout: ms || 60000, polling: 30 }); }
async function key(p, k) { await p.keyboard.press(k); }
// Figurenwechsel über den Knopf unten links (Porträt)
async function clickSwitch(p, ms) { await click(p, 20, 178, ms); await p.waitForTimeout(500); }
module.exports = { launch, loadState, settle, idle, audioOn, startRec, stopRec, mark, mouseTo, click, dblclick, hsPoint, clickHs, camSettle, clickPop, clickOpt, waitSpeech, waitNoSpeech, waitDlg, key, clickSwitch, ROOT, SC };
