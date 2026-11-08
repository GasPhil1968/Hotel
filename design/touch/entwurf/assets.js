// Bilder und Texte aus dem Spiel für den Layoutentwurf (keine Spieländerung). Aufruf: node design/touch/entwurf/assets.js
const fs = require('fs'), path = require('path');
const { pw, open, settle, loadSlot } = require('../../../qa/ui/lib.js');
const OUT = path.join(__dirname, 'assets'); fs.mkdirSync(OUT, { recursive: true });
const save = (name, dataUrl) => fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
const ready = async (p) => { await settle(p); await p.waitForFunction(() => !M.shell.ctx, null, { timeout: 5000 }).catch(() => {}); await p.waitForTimeout(300); };
// Ausschnitt aus dem aktuellen 320×200-Bild (ohne Mauszeiger)
const CROP = ([x, y, w, h]) => { M.pointerMove(-80, -80); const fb = M.renderFrame(); const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), im = g.createImageData(w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const q = M.RGB[fb.d[(y + j) * 320 + x + i]] || [0, 0, 0], o = (j * w + i) * 4; im.data[o] = q[0]; im.data[o + 1] = q[1]; im.data[o + 2] = q[2]; im.data[o + 3] = 255; } g.putImageData(im, 0, 0); return c.toDataURL('image/png'); };
const BOX = (codes) => { const out = {}; for (let y = 144; y < 200; y++) for (let x = 0; x < 320; x++) { const c = M.uiHit(x, y); if (codes.indexOf(c) < 0) continue; const b = out[c] || (out[c] = { x0: 1e9, y0: 1e9, x1: -1, y1: -1 }); b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x); b.y1 = Math.max(b.y1, y); } return out; };
(async () => { const b = await pw.chromium.launch(); const info = {};
  // Vratnik (K2): Szene, Inventar, Porträt
  let p = await open(b, 'k2_limbo'); await loadSlot(p); await ready(p);
  save('vratnik_szene.png', await p.evaluate(CROP, [0, 0, 320, 144]));
  const bx = await p.evaluate(BOX, ['i:0', 'i:1', 'i:2', 'i:3', 'i:4', 'i:5', 'sw']); info.vratnikHud = bx;
  for (let i = 0; i < 6; i++) { const r = bx['i:' + i]; if (r) save('vratnik_item' + i + '.png', await p.evaluate(CROP, [r.x0 + 3, r.y0 + 3, r.x1 - r.x0 - 5, r.y1 - r.y0 - 5])); }
  if (bx.sw) save('vratnik_portrait.png', await p.evaluate(CROP, [bx.sw.x0, bx.sw.y0, bx.sw.x1 - bx.sw.x0 + 1, bx.sw.y1 - bx.sw.y0 + 1]));
  info.vratnikItems = await p.evaluate(() => M.GS.inv.slice(0, 6).map(id => M.ITEMS[id].name));
  info.vratnikHs = await p.evaluate(() => { const E = M.E, cam = Math.round(E.camX); return E.room.hotspots.map(h => { const r = E.hsRect(h); return r ? { id: h.id, name: E.nameOf(h), r: [r[0] - cam, r[1], r[2], r[3]], npc: !!h.npc, exit: !!(h.exit || h.gexit) } : null; }).filter(Boolean); });
  // Verben eines Hotspots mit Auswahl (für die Aktionsleiste)
  info.vratnikVerbs = await p.evaluate(() => { const E = M.E, out = []; for (const h of E.room.hotspots) { const r = E.hsRect(h); if (!r || h.exit) continue; const cam = Math.round(E.camX); M.pointerDown(r[0] - cam + r[2] / 2, r[1] + r[3] / 2, true); M.pointerUp(r[0] - cam + r[2] / 2, r[1] + r[3] / 2, true); if (E.pop) { out.push({ id: h.id, name: E.pop.title, verbs: E.pop.opts.map(o => o.t) }); E.pop = null; } if (out.length >= 4) break; } E.actionTok(); return out; });
  await p.context().close();
  // Hotel Palma (K1): Szene, Rezeption, Gespräch mit Bruno
  p = await open(b, 'k1_bruno'); await loadSlot(p); await ready(p);
  save('palma_szene.png', await p.evaluate(CROP, [0, 0, 320, 144]));
  save('palma_bild.png', await p.evaluate(CROP, [0, 0, 320, 200]));
  info.palmaHs = await p.evaluate(() => { const E = M.E, cam = Math.round(E.camX); return E.room.hotspots.map(h => { const r = E.hsRect(h); return r ? { id: h.id, name: E.nameOf(h), r: [r[0] - cam, r[1], r[2], r[3]] } : null; }).filter(Boolean); });
  await p.evaluate(() => { M.__speechLog = []; M.TA.act('talk', 'bruno'); });
  await p.waitForFunction(() => { const E = M.E; if (E.speech && E.gt() - E.speech.at > 250) E.endSpeech(); return !!E.dlg; }, null, { timeout: 20000, polling: 60 });
  info.bruno = await p.evaluate(() => ({ opts: M.E.dlg.opts.map(o => o.t), said: (M.__speechLog || []).slice(-3) }));
  // Szene mit Brustbild ohne Sprechblase: Untertitelschicht an (Lesbar), dann zeichnet der Canvas nur das Bild
  await p.evaluate(() => { M.E.chooseDone(M.E.dlg.opts.length - 1); }); await p.waitForTimeout(200);
  await p.context().close();
  p = await open(b, 'k1_bruno', null, { 'mala.font': 'read' }); await loadSlot(p); await ready(p);
  await p.evaluate(() => { M.E.busy = true; M.API.say('…', 'bruno'); }); await p.waitForTimeout(400);
  save('palma_bruno.png', await p.evaluate(CROP, [0, 0, 320, 144]));
  await p.evaluate(() => { M.E.endSpeech(); M.E.busy = false; }); await p.context().close();
  fs.writeFileSync(path.join(OUT, '..', 'info.json'), JSON.stringify(info, null, 1));
  // dazu für die Zeichenfläche: game/fonts/MALAPixel.otf und design/touch/evidence/messung_iphone16_szene.png
  console.log(JSON.stringify({ items: info.vratnikItems, verbs: info.vratnikVerbs, bruno: info.bruno }, null, 1));
  await b.close(); })().catch(e => { console.error(e); process.exit(1); });
