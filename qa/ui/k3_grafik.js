// Kapitel 3 (Mostar), elf Grafikpunkte (design/K3_GRAFIK.md): prüft im Browser, dass jeder Punkt wirkt, nur in Mostar wirkt und
// abschaltbar ist. Wo zwei Bilder verglichen werden, steht die Spielzeit still (E.gt fest), damit nur der geprüfte Punkt sich ändert.
//   node qa/ui/k3_grafik.js [--html pfad/zu/index.html]
'use strict';
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const a = process.argv.slice(2), hi = a.indexOf('--html');
const HTML = hi >= 0 ? path.resolve(a[hi + 1]) : path.join(__dirname, '..', '..', 'web', 'index.html');
const res = []; const ck = (ok, m) => { res.push([!!ok, m]); console.log((ok ? 'OK     ' : 'FEHLER ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  // Raum in einer Phase, Marko (und Mala) an festen Stellen, ohne Ereignisse
  const go = (room, ph, mk, ml, cam) => p.evaluate(async ({ room, ph, mk, ml, cam }) => { M.setPhase(ph); const G = M.GS; G.malaOn = !!ml; const R = M.ROOMS[room]; G.rooms[room] = Object.assign(R.state ? R.state(G) : {}, G.rooms[room] || {});
    G.pos.marko = { room, x: mk[0], y: mk[1], f: mk[2] }; if (ml) G.pos.mala = { room, x: ml[0], y: ml[1], f: ml[2] };
    await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, keepPos: true, x: mk[0], y: mk[1], f: mk[2] }); if (ml) { M.API.malaJoin({ fadeIn: false }); const m = M.E.ACT.mala; if (m) { m.x = ml[0]; m.y = ml[1]; m.f = ml[2]; } }
    M.E.screen = 'game'; M.E.busy = true; R.camLock = (cam === undefined || cam === null) ? undefined : cam; return true; }, { room, ph, mk, ml, cam });
  // Bild bei stehender Zeit, einmal mit, einmal ohne einen Punkt: Anzahl verschiedener Pixel (optional in einem Ausschnitt)
  const diffFx = (key, box) => p.evaluate(async ({ key, box }) => { const E = M.E, g0 = E.gt, T0 = g0(); E.gt = () => T0; const cv = document.getElementById('game'), g = cv.getContext('2d');
    const grab = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(g.getImageData(0, 0, 320, 144).data))));
    const A = await grab(); M.K3FX[key] = false; const B = await grab(); M.K3FX[key] = true; E.gt = g0;
    let n = 0; const bx = box || [0, 0, 320, 144]; for (let y = bx[1]; y < bx[1] + bx[3]; y++) for (let x = bx[0]; x < bx[0] + bx[2]; x++) { const i = (y * 320 + x) * 4; if (A[i] !== B[i] || A[i + 1] !== B[i + 1] || A[i + 2] !== B[i + 2]) n++; } return n; }, { key, box });
  const wait = ms => p.waitForTimeout(ms);
  try {
    // ---- 8 Palette
    await go('starimost', 'k3_d2', [200, 124, 'L'], [232, 120, 'L'], 120); await wait(500);
    const pal = await p.evaluate(() => { const fb = M.E.rebuildIfDirty().bg; const cv = document.getElementById('game'), g = cv.getContext('2d'), d = g.getImageData(0, 0, 320, 144).data, RGB = M.RGB, NB = M.NBASE;
      const idx = {}; RGB.forEach((q, i) => { idx[q.join(',')] = i; }); let nNew = 0; const seen = new Set(); for (let i = 0; i < d.length; i += 4) { const k = idx[d[i] + ',' + d[i + 1] + ',' + d[i + 2]]; if (k !== undefined) { seen.add(k); if (k >= NB) nNew++; } }
      const newIdx = [...seen].filter(k => k >= NB).length; return { ncol: M.NCOL, nbase: NB, newIdx, nNew, colors: seen.size, ramp: M.R('s1 s2 s3').length, ramp3: (M.PAL3 = true, M.R('s1 s2 s3').length) }; });
    await p.evaluate(() => { M.PAL3 = false; });
    ck(pal.ncol > pal.nbase + 60 && pal.ncol <= 255, 'Palette: ' + pal.nbase + ' alte + ' + (pal.ncol - pal.nbase) + ' neue Farben (farbverschobene Rampen mit Zwischenstufen)');
    ck(pal.newIdx >= 20 && pal.nNew > 15000, 'Mostar-Bild nutzt die neuen Rampen: ' + pal.newIdx + ' neue Farben, ' + pal.nNew + ' Pixel (' + pal.colors + ' Farben im Bild)');
    ck(pal.ramp === 3 && pal.ramp3 === 5, 'feinere Rampen beim Malen in Mostar (3 Stufen → ' + pal.ramp3 + ' mit Zwischenstufen)');
    const offK1 = await p.evaluate(async () => { const ph = Object.keys(M.PHASES).find(k => (M.PHASES[k].chapter || 1) === 1); M.setPhase(ph); const G = M.GS; const room = 'riva', R = M.ROOMS[room]; G.rooms[room] = Object.assign(R.state ? R.state(G) : {}, G.rooms[room] || {}); G.pos.marko = { room, x: 160, y: 120, f: 'R' };
      await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: 160, y: 120, f: 'R' }); M.E.screen = 'game'; await new Promise(r => setTimeout(r, 300));
      const d = document.getElementById('game').getContext('2d').getImageData(0, 0, 320, 144).data, idx = {}; M.RGB.forEach((q, i) => { idx[q.join(',')] = i; }); let nNew = 0; for (let i = 0; i < d.length; i += 4) { const k = idx[d[i] + ',' + d[i + 1] + ',' + d[i + 2]]; if (k >= M.NBASE) nNew++; }
      return { on: M.k3LookOn(M.E.room), nNew, para: !!M.E.k3para, lights: !!(M.E.k3lights && M.E.k3lights.length) }; });
    ck(!offK1.on && offK1.nNew === 0 && !offK1.para && !offK1.lights, 'andere Kapitel unberührt (Split: keine Mostar-Farben, keine Parallaxe, keine Lampen-Effekte)');
    // ---- 5 Parallaxe
    const para = await p.evaluate(async () => { const out = {}; for (const room of ['ostbus', 'herberge', 'kujundziluk', 'starimost', 'tepa', 'strassenbr', 'bulevar', 'partizan', 'westbus']) { const ph = room === 'herberge' ? 'k3_d2' : 'k3_d2'; M.setPhase(ph); const G = M.GS; const R = M.ROOMS[room]; G.rooms[room] = Object.assign(R.state ? R.state(G) : {}, G.rooms[room] || {}); G.pos.marko = { room, x: 160, y: 124, f: 'R' };
        await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: 160, y: 124, f: 'R' }); M.E.rebuildIfDirty(); out[room] = !!(M.E.k3para && M.E.k3para.rows > 10); } return out; });
    ck(Object.values(para).every(Boolean), 'Parallaxe: ferne Ebene in allen neun breiten Räumen (' + Object.keys(para).filter(k => para[k]).join(', ') + ')');
    await go('starimost', 'k3_d2', [60, 124, 'R'], null, 0); await wait(400);
    const pdiff = await diffFx('para', [0, 0, 320, 60]); await go('starimost', 'k3_d2', [280, 124, 'R'], null, 120); await wait(400); const pmid = await diffFx('para', [0, 0, 320, 60]);
    ck(pdiff > 800 && pmid === 0, 'Himmel und Velež laufen langsamer: am Rand ' + pdiff + ' Pixel versetzt, in der Mitte deckungsgleich (' + pmid + ')');
    // ---- 2 Lampenlicht, 3 Schatten
    await go('starimost', 'k3_pro_n', [132, 128, 'R'], [70, 124, 'R'], 0); await wait(500);
    const L = await p.evaluate(() => ({ n: (M.E.k3lights || []).length, at: (M.k3LightsAt(132, 128) || []).length }));
    const rim = await diffFx('light', [110, 70, 50, 70]); const sh = await diffFx('shadow', [126, 120, 80, 20]);
    ck(L.n >= 3 && L.at >= 1 && rim >= 12, 'Lampenlicht: ' + L.n + ' Lampen im Raum, Lichtkante auf Marko (' + rim + ' Pixel)');
    ck(sh >= 15, 'langer Schatten von der Lampe weg (' + sh + ' Pixel)');
    const ghostLit = await p.evaluate(() => { const fn = M.k3LightsAt; return !!fn; });
    // ---- 1 Spiegelungen
    await go('starimost', 'k3_pro', [150, 126, 'R'], [118, 122, 'R'], 0); await wait(500);
    const rf = await diffFx('reflect', [130, 126, 40, 18]), rfMala = await diffFx('reflect', [104, 122, 28, 22]);
    ck(rf >= 20, 'Spiegelbild auf nassem Pflaster unter Marko (' + rf + ' Pixel)'); ck(rfMala <= 2, 'Mala hat kein Spiegelbild (' + rfMala + ')');
    await go('ostbus', 'k3_d1', [180, 126, 'L'], null, 20); await wait(400); const rp = await diffFx('reflect', [150, 126, 60, 18]);
    ck(rp >= 6, 'Spiegelbild in der Pfütze am Busbahnhof (' + rp + ' Pixel)');
    // ---- 4 Atemwolken, 6 Folgebewegung
    await go('ostbus', 'k3_d1', [180, 126, 'L'], [214, 122, 'L'], 20); await wait(1700);
    const br = await p.evaluate(async () => { const n1 = M.__k3puffs.length; const fo = []; for (let i = 0; i < 8; i++) { await new Promise(r => setTimeout(r, 130)); const pz = M.E.actorPose(M.E.ACT.marko), pm = M.E.actorPose(M.E.ACT.mala); fo.push([pz.cl || 0, pz.hl || 0, pm.cl || 0]); } return { n1, fo }; });
    ck(br.n1 >= 1, 'Atemwolken bei Bura draußen (' + br.n1 + ' Wölkchen)');
    ck(br.fo.every(f => f[0] !== 0) && br.fo.every(f => f[2] === 0), 'Bura: Marko Mantelsaum weht (' + br.fo.map(f => f[0]).join('') + '), Mala nicht');
    await go('ostbus', 'k3_d2', [180, 126, 'L'], [214, 122, 'L'], 20); await wait(1500);
    const br2 = await p.evaluate(() => M.__k3puffs.length); ck(br2 === 0, 'kein Atem an einem milden Samstag (' + br2 + ')');
    const stop = await p.evaluate(async () => { const mk = M.API.npc('marko'); await mk.walk(120, 126); const seq = []; for (let i = 0; i < 6; i++) { seq.push(M.E.actorPose(M.E.ACT.marko).cl || 0); await new Promise(r => setTimeout(r, 90)); } return seq; });
    ck(stop.some(v => v > 0) && stop[stop.length - 1] <= stop[0], 'nach dem Anhalten schwingt der Saum vor und pendelt aus (' + stop.join(' ') + ')');
    // ---- 9 Gesichter
    const face = await p.evaluate(() => { const S = M.poseS, F = M.poseF, out = {}; for (const id of ['marko', 'mala', 'dino', 'vlado', 'lena']) { const v = []; for (const hd of ['sm', 'fr', 'br', 'ow']) { const a = M.poseBuf(S({ hd: hd === 'ow' ? 'ow' : hd }), id), n = M.poseBuf(S({ hd: hd === 'ow' ? 'o' : 'n' }), id); let d = 0; for (let i = 0; i < a.d.length; i++) if (a.d[i] !== n.d[i]) d++; const af = M.poseBuf(F({ hd }), id), nf = M.poseBuf(F({ hd: hd === 'ow' ? 'o' : 'n' }), id); let d2 = 0; for (let i = 0; i < af.d.length; i++) if (af.d[i] !== nf.d[i]) d2++; v.push(d + d2); } out[id] = v; }
      return { out, ex: [M.k3ExprFor('Danke. Wirklich.'), M.k3ExprFor('Nein! Nicht!'), M.k3ExprFor('Warum hier?'), M.k3ExprFor('Hör zu!'), M.k3ExprFor('…')] }; });
    ck(Object.values(face.out).every(v => v.filter(n => n > 0).length >= 3), 'Gesichter: Lächeln, Stirnrunzeln, Braue, weiter Mund für jede Figur (' + Object.keys(face.out).map(k => k + ' ' + face.out[k].join('/')).join(', ') + ')');
    ck(face.ex.join(',') === 'sm,fr,br,ow,', 'Ausdruck aus dem Satz: ' + face.ex.join(', '));
    const said = await p.evaluate(async () => { const a = M.E.ACT.marko; const pr = M.API.m('Danke. Das war gut.'); await new Promise(r => setTimeout(r, 300)); const hd = M.E.actorPose(a).hd; M.E.endSpeech && M.E.endSpeech(); await pr; return { x: a.k3sayExpr, hd }; });
    ck(said.x === 'sm' && /^(sm|so)$/.test(said.hd || ''), 'beim Sprechen trägt Marko den Ausdruck (' + said.x + ', Kopf ' + said.hd + ')');
    // ---- 10 Gangarten
    const gait = await p.evaluate(() => { const k = M.k3SpeedK; M.setPhase('k3_d2'); const day = { jela: k({ ch: 'jela' }), lena: k({ ch: 'lena' }), vlado: k({ ch: 'vlado' }), marko: k({ ch: 'marko' }) }; M.setPhase('k3_d2_n'); const night = k({ ch: 'marko' });
      const pj = M.k3Pose({ id: 'tj', ch: 'jela', mode: 'walk', fi: 2, f: 'R' }, M.ANIMS.walkS[2]); return { day, night, ln: pj.ln, bob: M.k3Pose({ id: 'tl', ch: 'lena', mode: 'walk', fi: 2, f: 'R' }, M.ANIMS.walkS[2]).h[1] }; });
    ck(gait.day.jela > 1.3 && gait.day.lena < 1 && gait.day.vlado > 1 && gait.day.marko === 1 && gait.night > 1.1, 'Gangarten: Jela ' + gait.day.jela + '×, Vlado ' + gait.day.vlado + '×, Lena ' + gait.day.lena + '×, Marko tags 1×, nachts ' + gait.night + '×');
    ck(gait.ln === 2 && gait.bob < -23, 'Haltung: Jela gebeugt (Vorbeugen ' + gait.ln + '), Lena federt (Hüfte ' + gait.bob + ')');
    // ---- 7 Leben im Hintergrund
    await go('skela_d', 'k3_d2', [260, 124, 'R'], null, 60); await wait(400); const lf1 = await diffFx('life');
    await go('kujundziluk', 'k3_d2', [200, 124, 'R'], null, 0); await wait(400); const lf2 = await diffFx('life', [0, 0, 320, 100]);
    await go('bulevar', 'k3_d2', [200, 128, 'R'], null, 0); await wait(400);
    const lifeRooms = await p.evaluate(() => Object.keys(M.K3_LIFE));
    ck(lf1 > 20 && lf2 > 8 && lifeRooms.length >= 8, 'Leben im Hintergrund: Skela (Hühner, Krähen) ' + lf1 + ' Pixel, Kujundžiluk (Katze, Tauben) ' + lf2 + ' Pixel; Räume: ' + lifeRooms.join(', '));
    // ---- 11 Nahaufnahmen
    const cl = await p.evaluate(async () => { const out = {}; for (const id of Object.keys(M.K3CLOSE)) { const b = M.k3ClosePic(id, 1.3); out[id] = new Set(b.d).size; } return out; });
    ck(Object.keys(cl).length === 5 && Object.values(cl).every(n => n >= 14), 'fünf Nahaufnahmen gemalt (' + Object.keys(cl).map(k => k + ' ' + cl[k] + ' Farben').join(', ') + ')');
    await go('skela_d', 'k3_fin_n', [160, 124, 'R'], [130, 120, 'R'], 0); await wait(300);
    const run = await p.evaluate(async () => { const seen = []; M.E.busy = true; await M.k3Close(M.API, 'glocke', async function () { await M.API.wait(300); seen.push(!!M.E.k3close); await M.API.narrate('Test.'); }); seen.push(!!M.E.k3close); M.E.busy = false; return seen; });
    ck(run[0] === true && run[1] === false, 'Nahaufnahme erscheint während der Sätze und verschwindet danach');
    const src = fs.readFileSync(HTML, 'utf8'); const uses = ['glocke', 'haende', 'laterne', 'quitte', 'scheitel'].filter(id => src.indexOf("M.k3Close(A,'" + id + "'") >= 0);
    ck(uses.length === 5, 'an den Schlüsselmomenten eingebaut: ' + uses.join(', '));
    // ---- Abschalten
    const off = await p.evaluate(async () => { M.K3LOOK_OFF = true; M.E.rebuildIfDirty(); const r = M.k3LookOn(M.E.room); M.K3LOOK_OFF = false; return r; });
    ck(off === false, 'alles abschaltbar (M.K3LOOK_OFF)');
  } catch (e) { ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ')); }
  ck(errs.length === 0, 'keine JS-Fehler' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close(); const nOk = res.filter(r => r[0]).length; console.log((nOk === res.length ? 'K3-GRAFIK OK' : 'K3-GRAFIK FEHLER') + ' · ' + nOk + '/' + res.length); process.exit(nOk === res.length ? 0 : 1);
})();
