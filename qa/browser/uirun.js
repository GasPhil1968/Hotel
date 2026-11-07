// Vollständiger UI-Durchlauf im echten Browser: spielt eine Aufnahme (record.js) NUR über sichtbare Bedienelemente nach.
// Eingaben: page.mouse (Desktop) bzw. page.touchscreen.tap (Touch-Geräte) auf Canvas-Koordinaten. Der Spielzustand wird nur gelesen,
// um zu wissen, WO zu tippen ist (Hotspot-Rechteck, Popup-Zeile, Dialogzeile, Notizbuchzeile, Kartenort, Inventarfeld).
//   node qa/browser/uirun.js --engine chromium|firefox|webkit --device desktop|phone|tablet --out <dir> [--rec recording.json] [--url http://…] [--limit n]
'use strict';
const path = require('path'), fs = require('fs');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const ENGINE = arg('--engine', 'chromium'), DEVICE = arg('--device', 'desktop');
const OUT = path.resolve(arg('--out', path.join(__dirname, '..', 'results', 'browser', 'ui_' + ENGINE + '_' + DEVICE)));
const REC = JSON.parse(fs.readFileSync(arg('--rec', path.join(__dirname, '..', 'results', 'browser', 'recording.json')), 'utf8'));
const URL = arg('--url', 'file://' + path.join(__dirname, '..', '..', 'web', 'index.html'));
const LIMIT = +arg('--limit', 1e9), TURBO = +arg('--turbo', 50);
const pw = require('playwright');
const { launch, contextOpts } = require('./engines');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const t0 = Date.now(); const log = []; const shots = [];
  const L = (...x) => { const s = `[${((Date.now() - t0) / 1000).toFixed(1)}s] ` + x.join(' '); log.push(s); if (process.env.UIRUN_VERBOSE) console.log(s); };
  const browser = await launch(pw, ENGINE);
  const context = await browser.newContext(contextOpts(pw, ENGINE, DEVICE));
  if (process.env.UIRUN_TRACE) await context.tracing.start({ screenshots: true, snapshots: false });
  const page = await context.newPage();
  const errors = [], failedReq = [], consoleErr = [];
  page.on('pageerror', e => errors.push(String(e.message || e)));
  page.on('console', m => { if (m.type() === 'error') consoleErr.push(m.text()); });
  page.on('requestfailed', r => failedReq.push(r.url() + ' ' + (r.failure() && r.failure().errorText)));
  await page.goto(URL); await page.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  await page.evaluate((t) => { M.TURBO = t; try { localStorage.clear(); } catch (e) {} }, TURBO);
  const touch = DEVICE !== 'desktop';
  const vp = page.viewportSize();
  L('Gerät', DEVICE, ENGINE, JSON.stringify(vp), 'touch=' + touch, 'TURBO', TURBO);

  // ---------------------------------------------------------------- Seitenhelfer (nur lesend)
  await page.addScriptTag({ content: `window.__qa = {
    toClient: function(x,y){ var cv=document.getElementById('game'), r=cv.getBoundingClientRect(); if (M.isRotated && M.isRotated()) return [r.right - (y+0.5)/200*r.width, r.top + (x+0.5)/320*r.height]; return [r.left+(x+0.5)/320*r.width, r.top+(y+0.5)/200*r.height]; },
    scan: function(code, step){ step=step||2; M.renderFrame(); for (var y=1;y<200;y+=step) for (var x=1;x<320;x+=step){ if (M.uiHit(x,y)===code) return [x,y]; } return null; },
    scanAll: function(prefix){ M.renderFrame(); var s={}; for (var y=1;y<200;y+=2) for (var x=1;x<320;x+=2){ var h=M.uiHit(x,y); if (h && h.indexOf(prefix)===0 && !s[h]) s[h]=[x,y]; } return s; },
    hsPoint: function(id){ var E=M.E, R=E.room; if (!R) return {err:'kein Raum'}; var h = id==='_mala'?E.MALA_HS:(id==='_marko'?E.MARKO_HS:R.byId[id]); if (!h) return {err:'kein Hotspot '+id};
      var cam=Math.round(E.camX), r=null;
      if (id==='_mala'||id==='_marko'){ var a=M.ACT[id.slice(1)]; if (!a) return {err:'Figur fehlt'}; r=[Math.round(a.x)-8,Math.round(a.y)-48,16,48]; } else r=E.hsRect(h);
      if (!r) return {err:'kein Rechteck (unsichtbar)'};
      var best=null, n=0; for (var yy=r[1]+1; yy<r[1]+r[3]; yy+=2) for (var xx=r[0]+1; xx<r[0]+r[2]; xx+=2){ if (yy<0||yy>=144) continue; var sx=xx-cam; if (sx<0||sx>=320) continue; n++; if (E.hotspotAt(xx,yy)===h){ var cx=r[0]+r[2]/2, cy=r[1]+r[3]/2, d=Math.abs(xx-cx)+Math.abs(yy-cy); if (!best||d<best.d) best={x:sx,y:yy,d:d}; } }
      if (best) return {x:best.x,y:best.y};
      var mid=r[0]+r[2]/2-cam; return {off: mid<0?'L':(mid>=320?'R':'covered'), onscreenPts:n, rect:r, cam:cam}; },
    floorPoint: function(dir){ var E=M.E, p=E.player(); if (!p) return null; var cam=Math.round(E.camX); var tx= dir==='L'?6:313; for (var dx=0; dx<200; dx+=4){ var sx = dir==='L'? tx+dx : tx-dx; for (var y=140; y>60; y-=3){ var wx=sx+cam; if (E.hotspotAt(wx,y)) continue; var np=M.nearestPoint(M.GS.active,wx,y); if (Math.abs(np[0]-wx)<=2 && Math.abs(np[1]-y)<=2) return [sx,y]; } } return null; },
    freePointNear: function(wx,wy){ var E=M.E, cam=Math.round(E.camX); for (var r=0;r<30;r+=2) for (var dy=-r;dy<=r;dy+=2) for (var dx=-r;dx<=r;dx+=2){ var x=wx+dx, y=wy+dy, sx=x-cam; if (sx<0||sx>=320||y<0||y>=144) continue; if (!E.hotspotAt(x,y)) return [sx,y]; } return null; },
    dbg: function(){ return {cam:M.E.camX, w:M.E.room&&M.E.room.width, p:M.E.player()&&[M.E.player().x,M.E.player().y]}; },
    st: function(){ var E=M.E, p=E.player&&E.player(); return { scr:E.screen, room:E.room&&E.room.id, busy:!!E.busy, dlg:E.dlg?E.dlg.opts.map(function(o){return o.t;}):null, ov:E.overlay?E.overlay.kind:null, speech:!!E.speech, card:!!E.card, acting:E.acting||0, walk:!!(p&&p.mode==='walk'), active:M.GS.active, phase:M.GS.phase, pop:E.pop?E.pop.opts.map(function(o){return o.t;}):null, menu:!!E.menu, trn:!!E.transitioning, title:E.screen==='title'?M.titleLabels():null }; }
  };` });
  const st = () => page.evaluate(() => window.__qa.st());
  const sleep = (ms) => page.waitForTimeout(ms);
  async function tapL(x, y) { const c = await page.evaluate(([x, y]) => window.__qa.toClient(x, y), [x, y]); if (touch) await page.touchscreen.tap(c[0], c[1]); else { await page.mouse.move(c[0], c[1]); await page.mouse.down(); await page.mouse.up(); } await sleep(40); }
  async function until(pred, ms, what) { const t = Date.now(); let s; while (Date.now() - t < ms) { s = await st(); if (pred(s)) return s; await sleep(30); } const e = new Error('Zeitüberschreitung: ' + what + ' | ' + JSON.stringify(s)); throw e; }
  const idle = (s) => s.scr === 'game' && !s.busy && !s.speech && !s.dlg && !s.ov && !s.card && !s.acting && !s.walk && !s.trn && !s.menu;
  async function tapCode(code, what) { const p = await page.evaluate((c) => window.__qa.scan(c), code); if (!p) throw new Error('Bedienelement nicht sichtbar: ' + code + ' (' + (what || '') + ')'); await tapL(p[0], p[1]); return p; }
  const hsIssues = [], uiNotes = [];
  // Hotspot antippen (mit Gehen, falls er außerhalb des Bildausschnitts liegt)
  async function tapHotspot(id, prepareOnly) {
    let litTried = false;
    for (let k = 0; k < 14; k++) {
      const p = await page.evaluate((i) => window.__qa.hsPoint(i), id);
      if (p.x !== undefined) { if (!prepareOnly) await tapL(p.x, p.y); return p; }
      if (p.err) throw new Error('Hotspot ' + id + ': ' + p.err);
      if (p.off === 'covered' && !litTried) { const dk = await page.evaluate((i) => { const E = M.E, h = E.room.byId[i]; const r = h && E.hsRect(h); return h && h.dark && r ? { lit: E.hsLit(h, r), rect: r } : null; }, id);
        if (dk && !dk.lit) { litTried = true; await lightWithMala(id, dk.rect); continue; } }
      if (p.off === 'covered') { hsIssues.push({ id, room: (await st()).room, rect: p.rect, cam: p.cam }); throw new Error('Hotspot ' + id + ' im Bild, aber an keiner Stelle antippbar (verdeckt)'); }
      await scrollToward(p.off);
    }
    throw new Error('Hotspot ' + id + ' nicht erreichbar');
  }
  // Kamera in eine Richtung bewegen wie ein Spieler: freien Boden am Rand antippen; ist dort keiner (Hotspots überdecken den Weg),
  // einen reinen Blickfang antippen, dessen Standpunkt weiter in dieser Richtung liegt (die Figur geht hin)
  async function scrollToward(dir) {
    const x0 = await page.evaluate(() => M.E.player().x);
    const f = await page.evaluate((d) => window.__qa.floorPoint(d), dir);
    if (f) { await tapL(f[0], f[1]); await until(s => !s.walk, 30000, 'Gehen'); await sleep(60); if (Math.abs((await page.evaluate(() => M.E.player().x)) - x0) > 8) return; }
    const h = await page.evaluate(([d, x0]) => { const E = M.E, R = E.room, S = M.RS(R.id), cam = Math.round(E.camX); let best = null;
      R.hotspots.forEach(h => { if (h.exit || h.npc) return; try { if (h.vis && !h.vis(S, M.GS)) return; } catch (e) { return; } if (['talk','take','open','use','push','read'].some(v => h[v] !== undefined)) return; const st = E.hsStand(h); if (!st) return; const gain = d === 'R' ? st[0] - x0 : x0 - st[0]; if (gain < 20) return;
        const p = window.__qa.hsPoint(h.id); if (p.x === undefined) return; if (!best || gain > best.gain) best = { id: h.id, gain }; }); return best; }, [dir, x0]);
    if (!h) throw new Error('kein Weg Richtung ' + dir + ' (weder freier Boden noch Blickfang)');
    uiNotes.push({ kind: 'Boden verdeckt (Scrollen)', room: (await st()).room, dir, via: h.id });
    const p = await page.evaluate((i) => window.__qa.hsPoint(i), h.id); await tapL(p.x, p.y);
    await until(s => !s.walk && !s.busy && !s.speech && !s.acting, 60000, 'Blickfang ' + h.id); await sleep(60); }
  // Dunkler Hotspot: wie ein Spieler Mala danebenstellen (zu ihr wechseln, Boden neben dem Hotspot antippen, zurückwechseln)
  async function lightWithMala(id, rect) {
    // Spielerweg: Marko geht im Dunkeln selbst zum Hotspot, Mala folgt ihm (05_engine: „Mala folgt Marko, wenn sie nicht gespielt wird“)
    if ((await st()).active === 'marko') {
      const tgtM = await page.evaluate((r) => { const E = M.E, cam = Math.round(E.camX), cx = r[0] + r[2] / 2, cy = Math.min(140, r[1] + r[3] + 6); let best = null;
        for (let dy = -6; dy <= 30; dy += 3) for (let dx = -50; dx <= 50; dx += 4) { const x = Math.round(cx + dx), y = Math.round(cy + dy), sx = x - cam; if (sx < 2 || sx > 317 || y < 60 || y > 143) continue; if (E.hotspotAt(x, y)) continue; const np = M.nearestPoint('marko', x, y); if (Math.abs(np[0] - x) > 3 || Math.abs(np[1] - y) > 3) continue; const d = Math.abs(dx) + Math.abs(dy); if (!best || d < best.d) best = { sx, y, d }; } return best; }, rect);
      if (tgtM) { for (let g = 0; g < 4; g++) { await until(idle, 60000, 'ruhig vor Gehen'); const x0 = await page.evaluate(() => M.ACT.marko.x); await tapL(tgtM.sx, tgtM.y); await sleep(250); await until(s => !s.walk, 30000, 'Marko geht');
          const d = await page.evaluate(() => ({ mk: [Math.round(M.ACT.marko.x), Math.round(M.ACT.marko.y)], ma: M.ACT.mala && [Math.round(M.ACT.mala.x), Math.round(M.ACT.mala.y)], gt: M.E.gt(), block: M.E.sceneBlockUntil, pop: !!M.E.pop }));
          L('Marko-Tipp', g, JSON.stringify(tgtM), JSON.stringify(d)); if (Math.abs(d.mk[0] - x0) > 6) break; }
        await sleep(1500); await until(idle, 30000, 'Mala folgt');
        const lit0 = await page.evaluate(([i, r]) => M.E.hsLit(M.E.room.byId[i], r), [id, rect]); uiNotes.push({ kind: 'Dunkler Hotspot: Marko geht hin, Mala folgt', id, lit: lit0 }); L('Marko geht zu dunklem', id, 'lit=' + lit0); if (lit0) return; } }
    const can = await page.evaluate(() => M.GS.malaOn && M.E.canSwitch()); if (!can) throw new Error('dunkler Hotspot ' + id + ', Mala kann nicht leuchten (nicht da/kein Wechsel)');
    const back = (await st()).active; if (back !== 'mala') { await tapCode('sw', 'zu Mala'); await until(s => s.active === 'mala' && !s.trn, 8000, 'Mala'); await sleep(100); }
    const tgt = await page.evaluate((r) => { const E = M.E, cam = Math.round(E.camX), cx = r[0] + r[2] / 2, cy = Math.min(140, r[1] + r[3] + 4);
      let best = null; for (let dy = -10; dy <= 30; dy += 3) for (let dx = -40; dx <= 40; dx += 4) { const x = Math.round(cx + dx), y = Math.round(cy + dy), sx = x - cam; if (sx < 2 || sx > 317 || y < 60 || y > 143) continue; if (E.hotspotAt(x, y)) continue; const np = M.nearestPoint('mala', x, y); if (Math.abs(np[0] - x) > 3 || Math.abs(np[1] - y) > 3) continue; const d = Math.abs(dx) + Math.abs(dy); if (!best || d < best.d) best = { sx, y, d }; } return best; }, rect);
    if (!tgt) throw new Error('kein Boden für Mala neben ' + id);
    for (let g = 0; g < 4; g++) { await until(idle, 60000, 'ruhig als Mala'); const x0 = await page.evaluate(() => M.ACT.mala.x); await tapL(tgt.sx, tgt.y); await sleep(200); if (process.env.UIRUN_DBG_LIGHT) { await shot('licht_' + g); L('nach Mala-Tipp', JSON.stringify(await st()), JSON.stringify(await page.evaluate(([x, y]) => ({ c: window.__qa.toClient(x, y), hit: M.uiHit(x, y), hs: M.E.hotspotAt(x + Math.round(M.E.camX), y) && M.E.hotspotAt(x + Math.round(M.E.camX), y).id, ma: [M.ACT.mala.x, M.ACT.mala.mode], said: (M.__speechLog || []).slice(-1), pop: M.E.pop && M.E.pop.opts.map(o => o.t), menu: M.E.menu, msg: M.E.msg && M.E.msg.t }), [tgt.sx, tgt.y]))); } await until(s => !s.walk, 30000, 'Mala geht'); if (Math.abs((await page.evaluate(() => M.ACT.mala.x)) - x0) > 6) break; }
    await until(idle, 60000, 'ruhig nach Gehen'); await sleep(100);
    if (back !== 'mala') { await until(idle, 60000, 'ruhig vor Rückwechsel'); await tapCode('sw', 'zurück zu ' + back); await until(s => s.active === back && !s.trn, 8000, 'zurück'); await sleep(150); }
    const lit = await page.evaluate(([i, r]) => M.E.hsLit(M.E.room.byId[i], r), [id, rect]); const dbgL = await page.evaluate(([r, t]) => ({ mala: M.ACT.mala && [Math.round(M.ACT.mala.x), Math.round(M.ACT.mala.y), M.ACT.mala.visible], pos: M.GS.pos.mala, tgt: t, cam: M.E.camX, lit: M.E.litAt(r[0] + r[2] / 2, r[1] + r[3] / 2), glow: M.E.room.glowR, active: M.GS.active, dark: M.E.darkOn() }), [rect, tgt]); L('Licht-Diagnose', JSON.stringify(dbgL)); uiNotes.push({ kind: 'Dunkler Hotspot: Mala danebengestellt', id, lit }); L('Mala leuchtet für', id, 'lit=' + lit); }
  async function popPick(label) { const s = await until(s => s.pop || s.busy || s.speech || s.dlg || s.ov, 4000, 'Popup').catch(() => null); if (!s || !s.pop) return false; const i = s.pop.findIndex(t => t === label); if (i < 0) throw new Error('Popup ohne „' + label + '“: ' + JSON.stringify(s.pop)); await tapCode('p:' + i, 'Popup ' + label); return true; }
  const VLAB = { talk: ['Rede mit', 'Sprich mit'], take: ['Nimm'], open: ['Öffne'], use: ['Benutze'], push: ['Drücke', 'Schiebe'], read: ['Lies'], look: ['Schau an'], sense: ['Spüre'], listen: ['Lausche'], cross: ['Hinüberbringen'], walk: ['Hingehen'], pass: ['Hindurchgehen'] };
  async function verbLabels() { return page.evaluate(() => M.E.VLABEL); }
  let VL = null;
  async function doAct(v, id, item) {
    for (let tries = 0; tries < 3; tries++) { const before = await page.evaluate(() => ({ t: (M.__qaTapN = (M.__qaTapN || 0)), gt: M.E.gt() }));
      await doAct0(v, id, item);
      const r = await until(s => s.busy || s.speech || s.dlg || s.ov || s.walk || s.acting || s.trn || s.scr !== 'game', 4000, 'Reaktion').then(() => true).catch(() => false);
      if (r || item || /^loc2?_/.test(id)) return; const s0 = await st(); if (s0.pop) { await tapL(160, 60); await sleep(100); }
      uiNotes.push({ kind: 'Aktion ohne Reaktion, erneut angetippt', v, id, room: s0.room }); L('Aktion ohne Reaktion, erneut', v, id); }
    throw new Error('Aktion ' + v + ' ' + id + ' bewirkt über die Oberfläche nichts'); }
  async function waitStill(id) { const actor = id === '_mala' ? 'mala' : id === '_marko' ? 'marko' : await page.evaluate((i) => { const h = M.E.room.byId[i]; return h && h.npc ? h.npc : null; }, id); if (!actor) return;
    const t = Date.now(); while (Date.now() - t < 8000) { const m = await page.evaluate((a) => M.ACT[a] ? M.ACT[a].mode : null, actor); if (m !== 'walk') return; await sleep(60); } }
  async function doAct0(v, id, item) {
    VL = VL || await verbLabels();
    if (/^loc2?_/.test(id)) { await travel(id.replace(/^loc2?_/, '')); return; }
    if (item) { await waitStill(id); await useItemOn(item, id); return; }
    let s = null;
    for (let k = 0; k < 3; k++) { await waitStill(id); await tapHotspot(id);
      s = await until(s => s.pop || s.busy || s.speech || s.dlg || s.ov || s.walk || s.acting, 3000, 'Reaktion auf Tipp').catch(() => null);
      const popHs = s && s.pop ? await page.evaluate(() => { const p = M.E.pop; if (!p || !p.hs) return null; return p.hs === M.E.MALA_HS ? '_mala' : p.hs === M.E.MARKO_HS ? '_marko' : p.hs.id; }) : null;
      if (!s || !s.pop || popHs === id) break;
      uiNotes.push({ kind: 'Tipp traf anderen Hotspot (Figur bewegte sich)', want: id, got: popHs }); L('Tipp traf', popHs, 'statt', id); await tapL(160, 60); await sleep(150); await until(idle, 30000, 'ruhig'); }
    if (s && s.pop) { const lab = [VL[v], VL['g' + v], ...(VLAB[v] || [])].filter(Boolean); const i = s.pop.findIndex(t => lab.indexOf(t) >= 0); if (i < 0) throw new Error('Verb ' + v + ' nicht im Popup ' + JSON.stringify(s.pop)); await tapCode('p:' + i, 'Verb ' + v); }
  }
  async function doExit(id) { await tapHotspot(id); const s = await until(s => s.pop || s.busy || s.walk || s.trn || s.speech || s.ov, 3000, 'Ausgang').catch(() => null); if (s && s.pop) { const i = s.pop.findIndex(t => t === 'Hingehen' || t === 'Hindurchgehen'); if (i >= 0) await tapCode('p:' + i, 'Hingehen'); } }
  async function invTap(id) { for (let k = 0; k < 8; k++) { const info = await page.evaluate((x) => { const inv = M.GS.inv, i = inv.indexOf(x); return { i, top: M.E.invTop, pages: Math.ceil(inv.length / 6) }; }, id); if (info.i < 0) throw new Error('nicht im Inventar: ' + id); const pg = Math.floor(info.i / 6); if (pg === info.top) { await tapCode('i:' + info.i, 'Inventar ' + id); return; } await tapCode(pg < info.top ? 'up' : 'dn', 'Inventar blättern'); await sleep(40); } throw new Error('Inventar nicht erreichbar: ' + id); }
  async function useItemOn(item, target) { await until(idle, 60000, 'ruhig vor Gegenstand'); await tapHotspot(target, true); await until(idle, 60000, 'ruhig nach Vorbereitung'); await invTap(item); await popPick('Benutze'); if (target === '_mala' || target === '_marko') await tapHotspot(target); else await tapHotspot(target); }
  async function doItem(v, x, y) { await until(idle, 60000, 'ruhig vor Gegenstand'); await invTap(x); const s = await until(s => s.pop, 3000, 'Gegenstands-Popup'); const it = await page.evaluate((i) => { const t = M.ITEMS[i]; return { read: t.read !== undefined, open: t.open !== undefined, use2: t.use2 !== undefined, l: t.use2Label || 'Benutze' }; }, x);
    const rows = ['Benutze*']; if (it.read) rows.push('read'); if (it.open) rows.push('open'); if (it.use2) rows.push('use2'); rows.push('look');
    const idx = v === 'use' ? 0 : rows.indexOf(v); if (idx < 0) throw new Error('Gegenstandsverb ' + v + ' fehlt bei ' + x + ' ' + JSON.stringify(s.pop)); await tapCode('p:' + idx, 'Gegenstand ' + v); if (v === 'use' && y) await invTap(y); }
  async function travel(loc) { let s = await st(); if (s.ov !== 'map') { await until(idle, 60000, 'ruhig vor Karte'); await tapCode('map', 'Karte'); s = await until(s => s.ov === 'map' || s.speech || s.busy, 5000, 'Karte offen'); } await until(s => s.ov === 'map' && !s.speech, 20000, 'Karte bereit'); await tapCode('o:' + loc, 'Kartenort ' + loc); }
  async function chooseText(t) {
    for (let k = 0; k < 30; k++) { const r = await page.evaluate((txt) => { const d = M.E.dlg; if (!d) return { none: 1 }; const i = d.opts.findIndex(o => o.t === txt); if (i < 0) return { miss: d.opts.map(o => o.t) }; M.renderFrame(); for (let y = 1; y < 200; y += 2) for (let x = 1; x < 320; x += 3) if (M.uiHit(x, y) === 'c:' + i) return { x, y }; return { scroll: i < (d.top || 0) ? 'cu' : 'cd' }; }, t);
      if (r.x !== undefined) { await tapL(r.x, r.y); return; } if (r.miss) throw new Error('Dialogzeile fehlt: „' + t + '“ in ' + JSON.stringify(r.miss)); if (r.none) { await sleep(40); continue; } await tapCode(r.scroll, 'Dialog blättern'); }
    throw new Error('Dialogzeile nicht antippbar: ' + t);
  }
  async function pickNoteUI(id) { const s = await until(s => s.ov === 'notebook' || s.dlg, 30000, 'Notizbuch/Auswahl'); if (s.dlg) { const t = await page.evaluate((i) => { const o = M.E.dlg.opts.find(o => o.id === i); return o && o.t; }, id); return chooseText(t); }
    for (let k = 0; k < 6; k++) { const p = await page.evaluate((i) => window.__qa.scan('n:' + i), id); if (p) { await tapL(p[0], p[1]); await sleep(60); const s2 = await st(); if (s2.ov === 'notebook') { const b = await page.evaluate(() => window.__qa.scan('nb')); if (b) await tapL(b[0], b[1]); else await tapL(p[0], p[1]); } return; }
      const nx = await page.evaluate(() => window.__qa.scan('nnext')); if (!nx) break; await tapL(nx[0], nx[1]); }
    throw new Error('Notiz nicht im Notizbuch: ' + id); }
  async function combineUI(x, y) {
    const want = await page.evaluate(([a, b]) => { const d = M.DEDUCE[a + '+' + b] || M.DEDUCE[b + '+' + a]; if (!d || typeof d !== 'object' || !d.to) return null; if (M.GS.notes.indexOf(d.to) >= 0) return null; if (d.if && !d.if(M.GS)) return null; return d.to; }, [x, y]);
    await combineUI0(x, y);
    if (want && !(await page.evaluate((t) => M.GS.notes.indexOf(t) >= 0, want))) { uiNotes.push({ kind: 'Verbinden wiederholt', a: x, b: y }); L('Verbinden wiederholt', x, y); await sleep(300); await combineUI0(x, y);
      if (!(await page.evaluate((t) => M.GS.notes.indexOf(t) >= 0, want))) throw new Error('Schluss ' + x + '+' + y + ' kam über die Oberfläche nicht zustande'); } }
  async function combineUI0(x, y) { await until(idle, 60000, 'ruhig vor Notizbuch'); await tapCode('notes', 'Notizen'); await until(s => s.ov === 'notebook', 5000, 'Notizbuch');
    for (const id of [x, y]) { let p = null; for (let k = 0; k < 6 && !p; k++) { p = await page.evaluate((i) => window.__qa.scan('n:' + i), id); if (!p) { const nx = await page.evaluate(() => window.__qa.scan('nnext')); if (!nx) break; await tapL(nx[0], nx[1]); } } if (!p) throw new Error('Notiz zum Verbinden nicht sichtbar: ' + id); await tapL(p[0], p[1]); await sleep(80); }
    await sleep(200); const s = await st(); if (s.ov === 'notebook') await tapCode('nx', 'Notizbuch schließen'); }
  async function closeOv(kind, v) {
    let s; try { s = await until(s => s.ov === kind || (kind === null && s.ov), 30000, 'Overlay ' + kind); }
    catch (err) { const s0 = await st(); if (!lastAct || !idle(s0)) throw err; uiNotes.push({ kind: 'Overlay blieb aus, Aktion neu angetippt', act: lastAct.a, room: s0.room }); L('Overlay blieb aus, erneut', JSON.stringify(lastAct.a)); await doAct(lastAct.a[0], lastAct.a[1], lastAct.a[2]); s = await until(s => s.ov === kind || (kind === null && s.ov), 30000, 'Overlay (2. Versuch) ' + kind); }
    if (kind === 'puzzle' && Array.isArray(v)) { for (let i = 0; i < v.length; i++) { for (let k = 0; k < 12; k++) { const cur = await page.evaluate((j) => { if (!M.E.overlay.sel) M.renderFrame(); return M.E.overlay.sel[j]; }, i); if (cur === v[i]) break; await tapCode('z:' + i, 'Rätselzeile ' + i); } } await tapCode('zgo', 'Rätsel prüfen'); return; }
    if (kind === 'puzzle') { await tapCode('zx', 'Rätsel schließen'); return; }
    if (kind === 'map') { await tapCode('o:x', 'Karte schließen'); return; }
    if (kind === 'notebook') { await tapCode('nx', 'Notizbuch schließen'); return; }
    for (let k = 0; k < 20; k++) { const s2 = await st(); if (s2.ov !== s.ov) return; const xh = await page.evaluate(() => window.__qa.scan('o:x')); if (xh && kind !== 'memory' && kind !== 'doc') await tapL(xh[0], xh[1]); else await tapL(160, 60); await sleep(80); }
    throw new Error('Overlay lässt sich nicht schließen: ' + kind);
  }
  async function arrangeGoal(goal) { for (let g = 0; g < 14; g++) { const ord = await page.evaluate(() => { if (!M.E.overlay.ord) M.renderFrame(); return M.E.overlay.ord.slice(); }); const i = ord.findIndex((k, j) => k !== goal[j]); if (i < 0) return; await tapCode('o:r' + i, 'Karte ' + i); await tapCode('o:r' + ord.indexOf(goal[i]), 'tauschen'); } }
  async function glyphGoal(goal) { for (let w = 0; w < goal.length; w++) for (let c = 0; c < goal[w].length; c++) { if (goal[w][c] < 0) continue; for (let k = 0; k < 30; k++) { const cur = await page.evaluate(([w, c]) => { if (!M.E.overlay.rd) M.renderFrame(); return M.E.overlay.rd[w][c]; }, [w, c]); if (cur === goal[w][c]) break; await tapCode('o:g' + w + '_' + c, 'Zeichen'); } } }

  // ---------------------------------------------------------------- Wiedergabe
  const acts = REC.actions; let i = 0, done = 0; const per = { ok: 0 }; let pendingGoal = null; let curCh = 0; const chEnds = [];
  const shot = async (name) => { const f = path.join(OUT, String(shots.length).padStart(3, '0') + '_' + name + '.png'); await page.screenshot({ path: f }); shots.push(f); };
  const shotAt = new Set(['chapter']);
  let failure = null; let lastAct = null;
  try {
    for (i = 0; i < acts.length && done < LIMIT; i++) {
      const e = acts[i]; const k = e.k;
      if (k === 'chooseSub') continue;
      if (k === 'chapter') { curCh = e.a[0]; L('Kapitel', curCh); continue; }
      if (k === 'chapterEnd') { await until(s => s.scr === 'title', 600000, 'Titelbild nach Abspann K' + e.a[0]); chEnds.push({ ch: e.a[0], at: (Date.now() - t0) / 1000, title: (await st()).title }); await shot('K' + e.a[0] + '_ende_titel'); continue; }
      if (k === 'ovgoal') { pendingGoal = e; continue; }
      if (k === 'tap') {
        if (e.scr === 'title') { await until(s => s.scr === 'title' && s.title && s.title.length, 600000, 'Titelbild'); const lab = await page.evaluate((h) => { const i2 = +String(h || '').slice(2); return M.titleLabels()[i2]; }, e.hit); await tapL(e.a[0], e.a[1]); L('Titel', lab); await sleep(200); if (/Platz|Weiter mit/.test(lab || '')) { await until(s => s.scr !== 'title', 20000, 'Spielstart'); await sleep(300); await shot('start_' + (lab || '').replace(/\W+/g, '_').slice(0, 30)); } done++; continue; }
        if (e.ov) { await until(s => s.ov === e.ov, 30000, 'Overlay ' + e.ov + ' für Tipp');
          if (pendingGoal && /o:go$/.test(e.hit || '')) { if (pendingGoal.kind === 'arrange') await arrangeGoal(pendingGoal.ord); if (pendingGoal.kind === 'glyphs') await glyphGoal(pendingGoal.rd); pendingGoal = null; }
          if (e.hit) await tapCode(e.hit, 'Overlay-Tipp ' + e.hit); else await tapL(e.a[0], e.a[1]); done++; continue; }
        await tapL(e.a[0], e.a[1]); done++; continue; }
      if (k === 'choose') { try { await until(s => s.dlg && s.dlg.indexOf(e.a[0]) >= 0, 120000, 'Dialogzeile „' + e.a[0] + '“'); }
          catch (err) { const s0 = await st(); if (s0.dlg || !lastAct || !idle(s0)) throw err; uiNotes.push({ kind: 'Gespräch neu angetippt', act: lastAct.a, room: s0.room }); L('Gespräch neu angetippt', JSON.stringify(lastAct.a)); await doAct(lastAct.a[0], lastAct.a[1], lastAct.a[2]); await until(s => s.dlg && s.dlg.indexOf(e.a[0]) >= 0, 120000, 'Dialogzeile (2. Versuch) „' + e.a[0] + '“'); }
        await chooseText(e.a[0]); done++; continue; }
      if (k === 'note') { await pickNoteUI(e.a[0]); done++; continue; }
      if (k === 'close') { await closeOv(e.a[0], e.a[1]); done++; continue; }
      if (k === 'peil') { await until(s => s.ov === 'peil', 30000, 'Peilung'); await tapCode('o:' + e.a[0], 'Peilung ' + e.a[0]); done++; continue; }
      if (k === 'openNotes') { const s0 = await until(s => idle(s) || s.ov === 'notebook' || (s.dlg && !s.speech), 120000, 'Notizbuch-Knopf'); if (s0.ov === 'notebook' || s0.dlg) { continue; } }
      if (k === 'skip') { const s = await st(); if (s.speech) await tapL(160, 60); continue; }
      // Handlungen in der Spielwelt: warten, bis das Spiel ruhig ist und Raum/Figur stimmen
      const mapAct = k === 'travel' || (k === 'act' && /^loc2?_/.test(e.a[1] || ''));
      const ready = (s) => (mapAct && s.ov === 'map' && !s.speech) || (idle(s) && (!e.room || s.room === e.room));
      let s = await until(s => ready(s) || (idle(s) && s.room !== e.room), 300000, 'bereit für ' + k + ' ' + JSON.stringify(e.a) + ' in ' + e.room);
      if (!ready(s)) { s = await until(ready, 60000, 'Raum ' + e.room + ' für ' + k + ' ' + JSON.stringify(e.a)); }
      if (e.active && s.active !== e.active && k !== 'switch' && k !== 'switchChar') throw new Error('falsche Figur: ' + s.active + ' statt ' + e.active + ' vor ' + k);
      if (k === 'act') { await doAct(e.a[0], e.a[1], e.a[2]); lastAct = e; }
      else if (k === 'exit') await doExit(e.a[0]);
      else if (k === 'item') await doItem(e.a[0], e.a[1], e.a[2]);
      else if (k === 'switchChar') { const can = await page.evaluate(() => M.E.canSwitch()); if (can) await tapCode('sw', 'Figurenwechsel'); else { uiNotes.push({ kind: 'Wechsel nicht angeboten (Skript prüft Sperre)', room: s.room, phase: s.phase }); L('Figurenwechsel gesperrt, Knopf nicht da – wie vorgesehen'); } }
      else if (k === 'switch') { if (s.active !== e.a[0]) { await until(s2 => idle(s2), 60000, 'ruhig vor Wechsel'); const can = await page.evaluate(() => M.E.canSwitch()); if (!can) throw new Error('Figurenwechsel zu ' + e.a[0] + ' nicht möglich (Knopf fehlt)'); await tapCode('sw', 'Figurenwechsel'); await until(s2 => s2.active === e.a[0], 10000, 'Wechsel zu ' + e.a[0]); } }
      else if (k === 'travel') await travel(e.a[0]);
      else if (k === 'combine') await combineUI(e.a[0], e.a[1]);
      else if (k === 'openNotes') await tapCode('notes', 'Notizen');
      else if (k === 'walkTo') { let p = null; for (let g = 0; g < 12 && !p; g++) { p = await page.evaluate(([x, y]) => window.__qa.freePointNear(x, y), e.a); if (p) break;
          const dir = await page.evaluate((x) => (x > Math.round(M.E.camX) + 160 ? 'R' : 'L'), e.a[0]); const f = await page.evaluate((d) => window.__qa.floorPoint(d), dir); if (!f) break; await tapL(f[0], f[1]); await until(s => !s.walk, 30000, 'Gehen'); await sleep(60); }
        if (!p) { // kein freier Boden (Hotspots überdecken den Weg): wie ein Spieler einen Blickfang nahe dem Ziel antippen – die Figur geht zu dessen Standpunkt
          const h = await page.evaluate(([x, y]) => { const E = M.E, R = E.room, S = M.RS(R.id); let best = null; R.hotspots.forEach(h => { if (h.exit || h.npc) return; try { if (h.vis && !h.vis(S, M.GS)) return; } catch (e) { return; } if (['talk','take','open','use','push','read'].some(v => h[v] !== undefined)) return; const st = E.hsStand(h); if (!st) return; const d = Math.abs(st[0] - x) + Math.abs(st[1] - y); if (!best || d < best.d) best = { id: h.id, d, st }; }); return best; }, e.a);
          if (h && h.d < 80) { L('Gehen über Blickfang', h.id, JSON.stringify(h.st), 'statt freiem Boden bei', JSON.stringify(e.a)); uiNotes.push({ kind: 'Boden verdeckt', room: (await st()).room, target: e.a, via: h.id }); await tapHotspot(h.id); done++; continue; } }
        if (!p) throw new Error('kein freier Punkt für Gehen zu ' + e.a + ' ' + JSON.stringify(await page.evaluate(() => [window.__qa.dbg(), window.__qa.floorPoint('R'), window.__qa.floorPoint('L')]))); await tapL(p[0], p[1]); }
      else if (k === 'nbStyle') { L('Notizbuchstil (übersprungen, Aufnahme im Listenmodus):', e.a[0]); }
      else throw new Error('unbekannter Eintrag ' + k);
      done++;
      if (process.env.UIRUN_SHOTS_FROM && i >= +process.env.UIRUN_SHOTS_FROM) { await sleep(400); await shot('dbg_' + i + '_' + k); L('nach', i, k, JSON.stringify(e.a), JSON.stringify(await st()), JSON.stringify(await page.evaluate(() => ({ notes: M.GS.notes.slice(-4), said: (M.__speechLog || []).slice(-2) })))); }
      if (done % 100 === 0) L('Fortschritt', done, 'Aktionen; Kapitel', curCh, (await st()).phase);
      if (done % 150 === 0) await shot('K' + curCh + '_a' + done);
    }
  } catch (err) { failure = { at: i, entry: acts[i], msg: String(err.message || err), state: await st().catch(() => null) }; L('ABBRUCH bei Eintrag', i, err.message); await shot('abbruch').catch(() => {}); }
  const end = await page.evaluate(() => ({ c4: !!localStorage.getItem('mala.c4end'), c1: !!localStorage.getItem('mala.c1end'), c2: !!localStorage.getItem('mala.c2end'), c3: !!localStorage.getItem('mala.c3end'), scr: M.E.screen, title: M.E.screen === 'title' ? M.titleLabels() : null })).catch(() => null);
  if (process.env.UIRUN_TRACE || failure) { try { await context.tracing.stop({ path: path.join(OUT, 'trace.zip') }); } catch (e) {} }
  const ok = !failure && end && end.c1 && end.c2 && end.c3 && end.c4 && end.scr === 'title' && !(end.title || []).some(t => /Weiter mit Kapitel 5/.test(t));
  const res = { engine: ENGINE, browserVersion: browser.version(), device: DEVICE, viewport: vp, touch, url: URL, recording: { seed: REC.seed, sha: REC.sha, entries: acts.length }, ok, actionsDone: done, chapterEnds: chEnds, end, failure, errors, consoleErr, failedReq, hotspotIssues: hsIssues, uiNotes, wallS: (Date.now() - t0) / 1000, shots: shots.map(f => path.basename(f)), log };
  fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(res, null, 1));
  console.log((ok ? 'UI-DURCHLAUF OK ' : 'UI-DURCHLAUF FEHLGESCHLAGEN ') + ENGINE + '/' + DEVICE + ' ' + done + ' Aktionen, ' + res.wallS.toFixed(0) + ' s, Fehler ' + errors.length + (failure ? ' | ' + failure.msg : ''));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
