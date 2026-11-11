// BUG-025 (Prüfbericht K3-01): Hotspots ohne Trefferfläche. Geprüft wird die echte Treffererkennung (M.E.hotspotAt an der Mitte der Fläche),
// nicht der direkte Aufruf über M.TA: (1) kein „Spot fehlt“ beim Laden; (2) im offenen Führerhaus treffen Radio und Handschuhfach,
// in Zdravkos Café die Schublade; (3) in den neuen Räumen der Revision (unter der Brücke, Garagen) und am Ponton in Skela trifft jede
// sichtbare Stelle sich selbst; (4) in allen Räumen hat jede sichtbare Stelle ohne Figur eine positive Fläche.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-025', title: 'K3: Trefferflächen (Führerhaus, Schublade, neue Räume) über echte Treffererkennung', async run(html) {
  const D = await open({ seed: 25, html, turbo: 25 }); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const warn = D.events.filter(e => e[0] === 'warn' && /Spot fehlt/.test(e[1])).map(e => e[1]); ck(warn.length === 0, 'kein „Spot fehlt“' + (warn.length ? ' (' + warn.join(', ') + ')' : ''));
  // Mitte jeder sichtbaren Stelle → hotspotAt muss diese Stelle liefern (oder eine kleinere, die darin liegt und als eigene Stelle gilt)
  const hitAll = (ids) => D.ev((ids) => { const out = {}; ids.forEach((id) => { const h = M.E.room.byId[id]; if (!h) { out[id] = 'fehlt'; return; } if (h.vis && !h.vis(M.E.S || M.GS.rooms[M.E.room.id], M.GS)) { out[id] = 'unsichtbar'; return; }
      const r = M.E.hsRect(h); if (!r || r[2] * r[3] <= 0) { out[id] = 'keine Fläche'; return; } const x = r[0] + (r[2] >> 1), y = r[1] + (r[3] >> 1), cam = (M.E.cam || 0); const t = M.E.hotspotAt(x, y); out[id] = t ? t.id : 'nichts'; }); return out; }, ids);
  const goRoom = async (fx, spec, room) => { await FX.load(D, fx, Object.assign({ pos: room }, spec)); await D.page.waitForTimeout(300); for (let i = 0; i < 40; i++) { const s = await D.st(); if (!s.busy && !s.dlg && !s.trn) break; if (s.dlg) await FX.closeMenu(D); await D.page.waitForTimeout(200); } };
  // (2) Führerhaus offen
  await goRoom('k3x_sonntag.json', { rooms: { vhof: { cabIn: true } } }, 'vhof');
  let h = await hitAll(['radio', 'glove', 'cab']); ck(h.radio === 'radio' && h.glove === 'glove', 'Führerhaus: Radio und Handschuhfach treffen sich selbst ' + JSON.stringify(h));
  await goRoom('k3x_sonntag.json', { rooms: { vhof: { cabIn: true, gloveOpen: true } } }, 'vhof'); h = await hitAll(['glove']); ck(h.glove === 'glove', 'Handschuhfach offen trifft ' + JSON.stringify(h));
  await goRoom('k3x_sonntag.json', {}, 'kafic'); h = await hitAll(['bar_drawer', 'bar']); ck(h.bar_drawer === 'bar_drawer', 'Café: Schublade trifft sich selbst ' + JSON.stringify(h));
  // (3) neue Räume
  await goRoom('k3x_samstag.json', { setFlags: { 'k3.rules': 2, 'k3.s.trip': true, 'k3.s.down': true } }, 'podmost');
  h = await hitAll(['steps', 'r1', 'r2', 'r3', 'block', 'r4', 'tara', 'arch']); ck(['r1', 'r2', 'r3', 'block', 'r4', 'steps'].every(k => h[k] === k), 'unter der Brücke: Felsen, Quader, Stufen ' + JSON.stringify(h));
  await goRoom('k3x_sonntag.json', { setFlags: { 'k3.rules': 2 }, addNotes: ['b3_street'] }, 'garaze');
  h = await hitAll(['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'sign', 'exit']); ck(['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'sign'].every(k => h[k] === k), 'Garagen: sechs Tore, Schild ' + JSON.stringify(h));
  await goRoom('k3x_sonntag.json', { setFlags: { 'k3.rules': 2 }, rooms: { garaze: { g7open: true, hood: true } } }, 'garaze');
  h = await hitAll(['car', 'hood', 'battery', 'thermos', 'calendar']); ck(['battery', 'thermos', 'calendar'].every(k => h[k] === k) && (h.hood === 'hood' || h.hood === 'battery'), 'Garage offen: Haube, Batterie, Thermoskanne, Kalender ' + JSON.stringify(h));
  await goRoom('k3x_sonntag.json', { setFlags: { 'k3.rules': 2 } }, 'skela_l'); await D.ev(() => { M.ROOMS.skela_l.camLock = 120; }); await D.page.waitForTimeout(300);
  h = await hitAll(['ponton']); ck(h.ponton === 'ponton', 'Skela: Ponton trifft sich selbst ' + JSON.stringify(h)); await D.ev(() => { delete M.ROOMS.skela_l.camLock; });
  // (4) alle Räume: sichtbare Stellen ohne Figur haben eine Fläche (Zustand beim Betreten, Phase je Kapitel)
  const zero = await D.ev(() => { const bad = []; Object.keys(M.ROOMS).forEach((id) => { const R = M.ROOMS[id]; const S = R.state ? R.state(M.GS) : {}; (R.hotspots || []).forEach((hh) => { if (hh.npc || hh.noReveal) return; let vis = true; try { vis = !hh.vis || hh.vis(S, M.GS); } catch (e) { vis = false; } if (!vis) return; let r = hh.r; try { r = typeof r === 'function' ? r(S, M.GS) : r; } catch (e) { r = null; } if (r && r[2] * r[3] <= 0) bad.push(id + '.' + hh.id); }); }); return bad; });
  ck(zero.length === 0, 'keine sichtbare Stelle mit Fläche 0' + (zero.length ? ': ' + zero.join(', ') : ''));
  return { ok, detail: out.join('; ') };
} };
