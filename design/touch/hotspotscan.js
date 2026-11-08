// Touch-Analyse: Trefferflächen aller Hotspots, wie sie beim Spielen tatsächlich vorkommen.
// Spielt Kapitel 1–4 mit den Musterlösungen der QA (qa/paths/walkthrough*.js) in der Node-VM durch (Produktionsdatei web/index.html)
// und vermisst in jedem neuen Zustand eines Raums die Gewinnerkarte von E.hotspotAt (dieselbe Funktion wie beim Antippen):
// welche Stelle trifft welchen Hotspot. Je Hotspot: Fläche, größtes Quadrat, in dem jeder Punkt ihn trifft, Nachbarn.
//   node design/touch/hotspotscan.js [--out design/touch/hotspots.json] [--ch 1,2,3,4]
'use strict';
const path = require('path'), fs = require('fs');
const C = require('../../qa/lib/common.js'), VMD = require('../../qa/vmdriver.js');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const OUT = path.resolve(arg('--out', path.join(__dirname, 'hotspots.json')));
const CHS = arg('--ch', '1,2,3,4').split(',').map(Number);
const CH_PATH = { 1: 'walkthrough', 2: 'walkthrough2', 3: 'walkthrough3', 4: 'walkthrough4' };
const CH_TITLE = { 1: 'Kapitel 1: Split', 2: 'Kapitel 2: Sarajevo', 3: 'Kapitel 3: Mostar', 4: 'Kapitel 4: München' };

// im Spiel: Abtaster, der bei jedem neuen Hotspot-Bild eines Raums die Gewinnerkarte berechnet
const INSTALL = () => {
  const E = M.E; window.__scan = { maps: {}, n: 0 };
  const typeOf = (h) => h.npc ? 'person' : ((h.exit || h.gexit) ? 'exit' : 'object');
  function sample() {
    if (E.screen !== 'game' || !E.room || E.overlay || E.transitioning) return;
    const R = E.room, W = Math.max(320, R.width || 320), act = M.GS.active;
    const vis = R.hotspots.map(h => { const r = E.hsRect(h); return r ? h.id + ':' + r.map(v => Math.round(v / 4)).join(',') : null; }).filter(Boolean);
    const sig = R.id + '|' + act + '|' + vis.join(';'); if (window.__scan.maps[sig]) return;
    const win = new Int16Array(W * 144).fill(-1), ids = [], idx = {};
    for (let y = 0; y < 144; y++) for (let x = 0; x < W; x++) { const h = E.hotspotAt(x, y); if (!h) continue; const id = h.id || h.name; let k = idx[id]; if (k === undefined) { k = idx[id] = ids.length; ids.push({ id, type: typeOf(h), name: (() => { try { return E.nameOf(h); } catch (e) { return id; } })() }); } win[y * W + x] = k; }
    // je Hotspot: Fläche, Umriss, größtes Quadrat (Dynamik über die Gewinnerkarte)
    const st = ids.map(() => ({ area: 0, x0: 1e9, y0: 1e9, x1: -1, y1: -1, sq: 0, sqAt: null }));
    const dp = new Int16Array(W * 144);
    for (let y = 0; y < 144; y++) for (let x = 0; x < W; x++) { const k = win[y * W + x]; if (k < 0) continue; const s = st[k]; s.area++; if (x < s.x0) s.x0 = x; if (y < s.y0) s.y0 = y; if (x > s.x1) s.x1 = x; if (y > s.y1) s.y1 = y;
      let v = 1; if (x > 0 && y > 0 && win[y * W + x - 1] === k && win[(y - 1) * W + x] === k && win[(y - 1) * W + x - 1] === k) v = 1 + Math.min(dp[y * W + x - 1], dp[(y - 1) * W + x], dp[(y - 1) * W + x - 1]);
      dp[y * W + x] = v; if (v > s.sq) { s.sq = v; s.sqAt = [x - v + 1, y - v + 1]; } }
    // Nachbarn: andere Hotspots, deren Fläche näher als 6 Spielpixel am größten Quadrat liegt (gleichzeitig unter einer Fingerkuppe)
    const near = ids.map(() => new Set());
    st.forEach((s, k) => { if (!s.sqAt) return; const cx = s.sqAt[0] + s.sq / 2, cy = s.sqAt[1] + s.sq / 2, rr = s.sq / 2 + 6;
      for (let y = Math.max(0, Math.floor(cy - rr)); y < Math.min(144, Math.ceil(cy + rr)); y++) for (let x = Math.max(0, Math.floor(cx - rr)); x < Math.min(W, Math.ceil(cx + rr)); x++) { const o = win[y * W + x]; if (o >= 0 && o !== k) near[k].add(ids[o].id); } });
    window.__scan.maps[sig] = { room: R.id, active: act, phase: M.GS.phase, cam: Math.round(E.camX), W, hs: ids.map((h, k) => Object.assign({}, h, { area: st[k].area, box: [st[k].x0, st[k].y0, st[k].x1 - st[k].x0 + 1, st[k].y1 - st[k].y0 + 1], sq: st[k].sq, sqAt: st[k].sqAt, near: [...near[k]] })) };
    window.__scan.n++;
  }
  const u0 = M.update; let k = 0; M.update = function (dt) { u0(dt); if ((k++ % 6) === 0) try { sample(); } catch (e) { (window.__scanErr = window.__scanErr || []).push(String(e)); } };
};

(async () => {
  const all = {}; const log = [];
  for (const ch of CHS) {
    const D = await VMD.open({ seed: 1 });
    await C.tapTitle(D, CH_TITLE[ch]); await C.tapTitle(D, 'Platz 1');
    await D.ev(INSTALL);
    const r = await C.runPath(CH_PATH[ch], D, {}, null, {});
    const res = await D.ev(() => ({ maps: window.__scan.maps, n: window.__scan.n, err: window.__scanErr || [], ended: !!M.GS.ended }));
    Object.assign(all, res.maps);
    log.push({ ch, ok: r.ok, ended: res.ended, samples: res.n, err: r.err, scanErr: res.err.slice(0, 3) });
    console.log('Kapitel ' + ch + ': ' + (r.ok ? 'durchgespielt' : 'ABBRUCH ' + r.err) + ', ' + res.n + ' Raumzustände vermessen');
  }
  // Auswertung je Hotspot (Raum + id): schlechtester Fall über alle Zustände
  const per = {};
  for (const m of Object.values(all)) for (const h of m.hs) { const key = m.room + '/' + h.id + (m.active === 'mala' ? ' (Mala)' : '');
    const p = per[key] || (per[key] = { room: m.room, id: h.id, name: h.name, type: h.type, active: m.active, sqMin: 1e9, sqMax: 0, areaMin: 1e9, near: new Set(), states: 0, ex: null });
    p.states++; if (h.sq < p.sqMin) { p.sqMin = h.sq; p.ex = { phase: m.phase, box: h.box, sqAt: h.sqAt, cam: m.cam }; } p.sqMax = Math.max(p.sqMax, h.sq); p.areaMin = Math.min(p.areaMin, h.area); h.near.forEach(n => p.near.add(n)); }
  const list = Object.values(per).map(p => Object.assign(p, { near: [...p.near] })).sort((x, y) => x.sqMin - y.sqMin);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ build: VMD.loadScript().sha12, made: new Date().toISOString(), chapters: log, hotspots: list, states: Object.keys(all).length }, null, 1));
  console.log(list.length + ' Hotspots in ' + Object.keys(all).length + ' Raumzuständen → ' + OUT);
})().catch(e => { console.error(e); process.exit(1); });
