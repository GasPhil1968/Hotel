// Figuren und Eigenleben (11.11.2026): prüft im Browser
//  1 Zeichnen: alle Figuren × alle Kopfvarianten (n o b w s l r) × alle Animationen ohne Fehler; neue Feinheiten vorhanden
//    (Marko: Bündchen am Ärmel, Schatten hinter dem Arm, Lichtkante), Detailtabelle hält Stufen unter Nachtlicht auseinander
//  2 Marko steht: nach ein paar Sekunden eine Geste (Leerlauf bleibt 'idle'), keine Geste während einer Szene (E.busy), beim Gehen keine
//  3 Nebenfigur ohne Tätigkeit dreht sich um, wenn Marko hinter ihr stehen bleibt, und nach einer Weile wieder zurück (a.f unverändert)
//  4 Nebenfigur mit Tätigkeit (sitzend) sieht über die Schulter, die Tätigkeit läuft weiter
//  5 Figur von vorn (Mladen) folgt Marko mit den Augen (Kopfvariante l/r), wer spricht, wird angesehen
//  6 Sprechen: je Satz eine von mehreren Gesten; Pausen bei Tätigkeiten; Drehbild beim Umdrehen
//   node qa/ui/figuren_leben.js [--html pfad/zu/index.html]
'use strict';
const path = require('path'); const { chromium } = require('playwright');
const a = process.argv.slice(2), hi = a.indexOf('--html');
const HTML = hi >= 0 ? path.resolve(a[hi + 1]) : path.join(__dirname, '..', '..', 'web', 'index.html');
const res = []; const ck = (ok, m) => { res.push([!!ok, m]); console.log((ok ? 'OK     ' : 'FEHLER ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  // 1
  const r1 = await p.evaluate(() => { const A = M.ANIMS, S = M.poseS, F = M.poseF, bad = []; let n = 0; const fb = new M.Buf(320, 144, 0);
    for (const id of Object.keys(M.CHARS)) { const ch = M.CHARS[id], anims = Object.assign({}, A, ch.anims || {});
      for (const v of ['S', 'F', 'B']) for (const hd of ['n', 'o', 'b', 'w', 's', 'l', 'r']) { try { M.drawPose(fb, 160, 120, v === 'S' ? S({ hd }) : F({ hd }, v), v === 'S' ? 'R' : v, id, {}); n++; } catch (e) { bad.push(id + ' ' + v + hd + ': ' + e.message); } }
      for (const k of Object.keys(anims)) { const an = anims[k]; if (!Array.isArray(an)) continue; for (const f of an) { const q = Array.isArray(f) ? f[0] : f; if (!q || !q.v) continue; try { M.drawPose(fb, 160, 120, q, q.v === 'S' ? 'R' : q.v, id, { t: 1000 }); n++; } catch (e) { bad.push(id + ' ' + k + ': ' + e.message); break; } } } }
    const P = M.P, mk = M.poseBuf(S({}), 'marko'), cols = new Set(mk.d); const C = M.CHARS.marko.cols;
    const cuff = C.cuff.some(c => cols.has(c)), rim = cols.has(M.UP[C.sleeve[1]]) || cols.has(M.UP[M.CHARS.marko.coat.c[1]]);
    const night = M.TINT.night.a, dl = M.detailLut(night), cnt = (lut) => new Set(Array.from(mk.d).filter(c => c !== M.T).map(c => lut[c])).size;
    return { n, bad: bad.slice(0, 5), nbad: bad.length, cuff, rim, colors: cols.size, nightRaw: cnt(night), nightDetail: cnt(dl) }; });
  ck(r1.nbad === 0 && r1.n > 40000, 'alle Figuren, Kopfvarianten und Animationen zeichnen ohne Fehler (' + r1.n + (r1.nbad ? ', Fehler: ' + r1.bad.join(' / ') : '') + ')');
  ck(r1.cuff && r1.rim && r1.colors >= 22, 'Marko: Bündchen, Lichtkante, ' + r1.colors + ' Farben im Stand');
  ck(r1.nightDetail > r1.nightRaw, 'Detailtabelle unter Nachtlicht: ' + r1.nightDetail + ' statt ' + r1.nightRaw + ' Farben');
  const go = (room, ph) => p.evaluate(async ({ room, ph }) => { M.setPhase(ph); M.GS.malaOn = true; const R = M.ROOMS[room]; const st = R.start || [160, 120, 'R'];
    M.GS.rooms[room] = Object.assign(R.state ? R.state(M.GS) : {}, M.GS.rooms[room] || {}); M.GS.pos.marko = { room, x: st[0], y: st[1], f: st[2] || 'R' };
    await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: st[0], y: st[1], f: st[2] }); M.API.malaJoin({ fadeIn: false }); M.E.screen = 'game'; }, { room, ph });
  const fidName = (id) => p.evaluate((id) => { const a = M.ACT[id]; if (!a || !a.fid) return ''; return Object.keys(M.ANIMS).find(n => M.ANIMS[n] === a.fid) || 'eigen'; }, id);
  // 2
  await go('riva', 'c1'); let seen = '', modeOk = true;
  for (let i = 0; i < 40 && !seen; i++) { await p.waitForTimeout(500); seen = await fidName('marko'); if (seen) modeOk = await p.evaluate(() => M.ACT.marko.mode === 'idle'); }
  ck(seen && modeOk, 'Marko steht: Geste im Leerlauf (' + (seen || 'keine') + '), Modus bleibt idle');
  await p.evaluate(() => { M.ACT.marko.fid = null; M.ACT.marko.fidAt = M.E.gt() + 200; M.ACT.marko.idleT = 99999; M.E.busy = true; });
  await p.waitForTimeout(3000); const busyFid = await fidName('marko'); await p.evaluate(() => { M.E.busy = false; });
  ck(!busyFid, 'während einer Szene (E.busy) keine Geste');
  await p.evaluate(() => { const m = M.ACT.marko; m.fid = null; m.fidAt = M.E.gt() + 100; m.idleT = 99999; M.API.walk(m.x + 60, m.y); });
  let walkFid = false; for (let i = 0; i < 6; i++) { await p.waitForTimeout(150); const s = await p.evaluate(() => ({ mode: M.ACT.marko.mode, fid: !!M.ACT.marko.fid })); if (s.mode === 'walk' && s.fid) walkFid = true; }
  ck(!walkFid, 'beim Gehen keine Geste');
  // 3
  await go('heim_flur', 'k4_d1');
  const k0 = await p.evaluate(() => { const a = M.ACT.kraus; return { x: a.x, y: a.y, f: a.f }; });
  await p.evaluate(({ x, y }) => M.API.walk(x, y), { x: k0.x + (k0.f === 'R' ? -24 : 24), y: k0.y + 1 });
  let turned = false; for (let i = 0; i < 12 && !turned; i++) { await p.waitForTimeout(300); turned = await p.evaluate(() => !!M.ACT.kraus.lookF); }
  const fSame = await p.evaluate((f) => M.ACT.kraus.f === f, k0.f);
  let back = false; for (let i = 0; i < 40 && turned && !back; i++) { await p.waitForTimeout(300); back = await p.evaluate(() => !M.ACT.kraus.lookF); }
  ck(turned && fSame, 'Kraus dreht sich um, wenn Marko hinter ihm steht (Blickrichtung nur gezeichnet, a.f bleibt ' + k0.f + ')');
  ck(back, '… und nach einer Weile wieder zurück');
  // 4
  await go('matejuska', 'c1');
  const d0 = await p.evaluate(() => { const a = M.ACT.dinko; return { x: a.x, y: a.y, f: a.f, idle: a.idle }; });
  await p.evaluate(({ x, y }) => M.API.walk(x, y), { x: d0.x + (d0.f === 'R' ? -24 : 24), y: d0.y + 1 });
  let hb = false; for (let i = 0; i < 12 && !hb; i++) { await p.waitForTimeout(300); hb = await p.evaluate(() => !!M.ACT.dinko.headBack && M.E.actorPose(M.ACT.dinko).hb === 1); }
  const still = await p.evaluate((idle) => M.ACT.dinko.idle === idle, d0.idle);
  ck(hb && still, 'Dinko sieht beim Flicken über die Schulter, die Tätigkeit (' + d0.idle + ') läuft weiter');
  // 5
  await go('office', 'c1');
  const m0 = await p.evaluate(() => { const a = M.ACT.mladen; return { x: a.x, y: a.y }; });
  await p.evaluate(({ x, y }) => M.API.walk(x, y), { x: m0.x - 30, y: m0.y + 6 });
  let eye = null; for (let i = 0; i < 30 && !eye; i++) { await p.waitForTimeout(300); eye = await p.evaluate(() => { const a = M.ACT.mladen, q = M.E.actorPose(a); return (q.v === 'F' && (q.hd === 'l' || q.hd === 'r')) ? q.hd : null; }); }
  ck(eye === 'l', 'Mladen (von vorn) sieht zu Marko hinüber (Blick ' + eye + ')');
  // 6
  const tv = await p.evaluate(async () => { const seen = new Set(); for (let i = 0; i < 12; i++) { const pr = M.API.m('Satz ' + i + '.'); await new Promise(r => setTimeout(r, 120)); const a = M.ACT.marko; seen.add(a.anim && Object.keys(M.ANIMS).find(n => M.ANIMS[n] === a.anim)); if (M.E.speech) M.E.speech.until = 0; try { M.skipSpeech && M.skipSpeech(); } catch (e) { } await Promise.race([pr, new Promise(r => setTimeout(r, 1500))]); } return [...seen].filter(Boolean); });
  ck(tv.length >= 2, 'Sprechgesten wechseln von Satz zu Satz (' + tv.join(', ') + ')');
  const pz = await p.evaluate(() => { const o = { id: 'emina', ch: 'emina', idle: 'pour', x: 10, y: 10, f: 'F' }; const st = M.autoRoutine && M.autoRoutine(o, { idle: 'pour' }); return st ? JSON.stringify(st()) : null; });
  ck(pz && /pause/.test(pz), 'Tätigkeiten im Stehen bekommen Pausen (Emina: ' + (pz ? pz.slice(0, 80) : 'keine') + ')');
  const turn = await p.evaluate(async () => { const m = M.ACT.marko; m.f = 'R'; await new Promise(r => setTimeout(r, 120)); m.f = 'L'; await new Promise(r => setTimeout(r, 30)); const q = M.E.actorPose(m); return q.v; });
  ck(turn === 'F', 'beim Umdrehen ein kurzes Bild von vorn (' + turn + ')');
  ck(!errs.length, 'keine JS-Fehler (' + errs.length + (errs.length ? ': ' + errs[0] : '') + ')');
  await b.close(); const ok = res.every(r => r[0]); console.log(ok ? 'FIGUREN/LEBEN OK' : 'FIGUREN/LEBEN FEHLGESCHLAGEN'); process.exitCode = ok ? 0 : 1;
})().catch(e => { console.error(e); process.exit(1); });
