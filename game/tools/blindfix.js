// Regressionstests für die Funde der blinden Spieltests (echte Bedienung: Mausklicks auf das Spielbild, keine Abkürzung über M.TA).
//   node game/tools/blindfix.js <dump-ordner K4 (MALA_DUMPALL=… walkthrough4.js)> [dump-ordner K2]
//   MALA_HTML=<build>/index.html   anderer Bau
// Jeder Fund hat eine Kennung aus dem Blindbericht (z. B. K4A-B1) und genau einen Test.
const { open } = require('./driver');
const fs = require('fs'), path = require('path');
const D4 = process.argv[2], D2 = process.argv[3];
let pass = 0, fails = 0;
function ok(c, what) { if (c) { pass++; console.log('  ok   ' + what); } else { fails++; console.log('  FEHL ' + what); } return !!c; }
const dumps = (dir) => dir ? fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f)).sort().map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) : [];
(async () => {
  if (!D4 || !fs.existsSync(D4)) { console.log('Aufruf: node game/tools/blindfix.js <dump-ordner K4> [dump-ordner K2]'); process.exit(2); }
  const K4 = dumps(D4), K2 = dumps(D2);
  const D = await open({ turbo: 25 }); const page = D.page;
  const find = (L, sub) => { const d = L.find(x => x.label.indexOf(sub) >= 0); if (!d) throw new Error('Stand fehlt: ' + sub); const g = JSON.parse(JSON.stringify(d.GS)); delete g.flags['mala.lock']; return g; };
  const load = async (g) => { await D.ev((x) => { M.__speechLog = []; M.PRESETS = M.PRESETS || {}; M.PRESETS.__t = { GS: x }; if (!M.E.loadPreset('__t', 3)) throw new Error('Laden fehlgeschlagen'); }, g); await page.waitForTimeout(300); return D.drain(); };
  // echter Klick: Spielkoordinaten (320×200) → Bildschirm über das Rechteck der Leinwand
  const box = async () => page.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const tap = async (x, y) => { const b = await box(); const sx = b.x + (x + 0.5) * b.w / 320, sy = b.y + (y + 0.5) * b.h / 200; await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(120); };
  const said = (sub) => D.ev((x) => (M.__speechLog || []).some(l => l[1].indexOf(x) >= 0), sub);
  const T = async (id, name, fn) => { console.log('\n' + id + ' ' + name); const e0 = D.errors.length; try { await fn(); } catch (e) { fails++; console.log('  FEHL Abbruch: ' + e.message.split('\n')[0]); }
    if (D.errors.length > e0) { fails++; console.log('  FEHL JS-Fehler: ' + D.errors[e0].split('\n')[0]); } };
  // Marko tippt auf eine Figur, auf der Mala steht: das Menü gehört der Figur
  await T('K4A-B1', 'Mala verdeckt Hansi nicht', async () => {
    await load(find(K4, 'Mala findet Hansi'));
    await D.switchTo('marko');
    await D.ev(() => { const h = M.ACT.hansi, k = M.ACT.marko; k.x = h.x + 40; k.y = h.y; }); await page.waitForTimeout(1500);   // Marko neben den Pfeiler, die Kamera folgt
    const p = await D.ev(() => { const h = M.ACT.hansi, m = M.ACT.mala; m.x = h.x + 2; m.y = h.y; return { x: Math.round(h.x - M.E.camX), y: Math.round(h.y) - 20 }; });
    const hs = await D.ev((q) => { const h = M.E.hotspotAt(q.x + Math.round(M.E.camX), q.y); return h && (h.id || h.npc); }, p);
    ok(hs === 'hansi', 'Trefferfläche an der Stelle: ' + hs);
    await tap(p.x, p.y); await page.waitForTimeout(300);
    const title = await D.ev(() => M.E.pop && M.E.pop.title);
    ok(title === 'Hansi', 'Menü beim Tipp auf Hansi: „' + title + '“');
  });
  // Couch vor 14 Uhr ohne Kaffee: der Satz nennt die Džezva
  await T('K4A-B8', 'Fingerzeig auf die Džezva', async () => {
    const g = find(K4, 'Mama kommt heim'); g.phase = 'k4_pro'; delete g.flags['k4.p.coffee']; delete g.flags['k4.p.jasnaHome'];
    const w = await D.ev((x) => M.k4Missing(x), g);
    ok(/Džezva/.test(w || ''), 'Hinweis: „' + w + '“');
  });
  // Fernseher: nach dem Satz wieder aus (auch die Grafik)
  await T('K4A-B7', 'Fernseher geht wieder aus', async () => {
    await load(find(K4, 'Mamas Wohnung: Pantoffeln'));
    await D.act('use', 'tv'); await D.drain();
    ok(await D.ev(() => !M.RS('jwohnung').tv), 'Zustand tv aus');
  });
  // Gespräch mit Jasna: Markos Zeile zu den Pantoffeln nur einmal
  await T('K4A-B5', 'Pantoffel-Zeile nicht doppelt', async () => {
    await load(find(K4, 'Mama kommt heim'));
    const o = await D.ev(() => { const r = M.ROOMS.jwohnung; return !!r; });
    ok(o, 'Raum geladen');
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'rooms', 'jwohnung.js'), 'utf8');
    ok(!/t:'Die Pantoffeln an der Tür …'[^\n]*A\.m\('Die Pantoffeln an der Tür …'\)/.test(src), 'Zeile wird nicht im Skript wiederholt');
  });
  // Tobias und Jasna greifen dem Essen nicht vor
  await T('K4A-B4', 'Kein Dank für den Wein vor dem Essen', async () => {
    await load(find(K4, 'Tobias lernt Bosnisch'));
    await D.act('talk', 'tobias'); const s = await D.settle();
    const has = (s.dlg || []).some(t => t.indexOf('Danke für den Wein') >= 0);
    ok(s.dlg && !has, 'Auswahl ohne „Danke für den Wein“');
    if (s.dlg) { const bye = s.dlg.find(t => /Später|Bis|Tschüss|\(|Danke\b/.test(t)) || s.dlg[s.dlg.length - 1]; await D.ev(() => { const D0 = M.E.dlg; if (D0) M.E.chooseDone(D0.opts.length - 1); }); await D.drain(); }
  });
  // Zeigen: zwei Namensschilder nah beieinander, beide sichtbar (Pfeiler und Hansi)
  await T('K4A-B2', 'Namen bei „Zeigen“ verdecken sich nicht', async () => {
    await load(find(K4, 'Mala findet Hansi')); await D.switchTo('marko');
    const n = await D.ev(() => { const L = []; const t0 = M.text; M.text = function (fb, t, x, y, c, bg) { L.push(t); return t0.apply(this, arguments); };
      M.key('z'); M.E.camX = 0; return new Promise(r => setTimeout(() => { M.text = t0; r(L); }, 400)); });
    ok(n.indexOf('Pfeiler') >= 0 && n.some(t => /Hansi|Leere Stelle|\?\?\?/.test(t)), 'Schilder: ' + [...new Set(n)].filter(t => /Pfeiler|Hansi|Leere|\?\?\?/.test(t)).join(', '));
  });
  // ---------------------------------------------------------------- Kapitel 4, Mittwoch/Donnerstag
  const closeDlg = async () => { await D.ev(() => { const D0 = M.E.dlg; if (D0) M.E.chooseDone(D0.opts.length - 1); }); await D.drain(); };
  await T('K4C-2', 'Kraus lehnt den Geist ab: Marko nennt den richtigen Grund', async () => {
    const g = find(K4, 'Herr Kraus stellt den Gong'); delete g.flags['k4.g.chimeOff']; g.active = 'marko'; await load(g);
    await D.act('talk', 'kraus'); await D.choose('Können Sie den Gong abstellen'); await D.choose('Wegen eines Geistes'); await D.drain();
    ok(await said('Falscher Grund'), 'Fingerzeig nach der Absage'); await closeDlg();
  });
  await T('K4C-1', 'Gerda „woanders warten“: Fingerzeig auf die Fotos in 214', async () => {
    const g = find(K4, 'Herr Kraus stellt den Gong'); g.active = 'mala'; await load(g);   // mit Gerda redet Mala
    await D.act('talk', 'gerda'); const s0 = await D.settle();
    if (!(s0.dlg || []).some(t => t.indexOf('woanders warten') >= 0)) { ok(false, 'Option fehlt: ' + JSON.stringify(s0.dlg)); return; }
    await D.choose('woanders warten'); await D.drain();
    ok(await said('Fotos'), 'Fotos in seinem Zimmer werden genannt'); await closeDlg();
  });
  await T('K4C-3', 'Stadtplan: die Beschriftung eines Ortes trifft den Ort', async () => {
    await load(find(K4, 'Herr Obermaier sagt die Bestattung'));
    await D.ev(() => M.toggleMap()); await page.waitForTimeout(400);
    const r = await D.ev(() => { const ov = M.E.overlay, d = ov.data; const bad = []; let n = 0;
      Object.keys(d.lay || {}).forEach(id => { const L = d.lay[id], w = M.textWidth(L.nm); n++; const got = ov.lay.at(L.x + (w >> 1), L.y + 3); if (got !== id) bad.push(L.nm + '→' + got); }); return { n, bad }; });
    ok(r.n > 3 && !r.bad.length, r.n + ' Beschriftungen, daneben: ' + r.bad.join(', '));
    await D.ev(() => { if (M.E.overlay && M.E.overlay.kind === 'map') M.closeMap(); }); await D.drain();
  });
  await T('K4C-5', 'Gleis 11: die AUSGANG-Tür ist der Ausgang', async () => {
    const g = find(K4, 'zurück an Gleis 11'); g.active = 'marko'; await load(g);
    await D.ev(() => { M.ACT.marko.x = 60; }); await page.waitForTimeout(1500);
    const id = await D.ev(() => { const h = M.E.hotspotAt(30, 72); return h && h.id; });
    ok(id === 'exit', 'Treffer mitten auf der Tür: ' + id);
  });
  // ---------------------------------------------------------------- Kapitel 2
  // Gegenstand aus der Leiste ins Bild ziehen, wie mit dem Finger (schräg, mehr waagrecht als senkrecht)
  const dragItem = async (item, tx, ty) => {
    for (let k = 0; k < 6; k++) { const at = await D.ev((it) => { const i = M.GS.inv.indexOf(it); for (let y = 150; y < 200; y++) for (let x = 0; x < 320; x++) if (M.uiHit(x, y) === 'i:' + i) return [x + 4, y + 4]; return null; }, item);
      if (at) { const b = await box(); const S = (x, y) => [b.x + (x + 0.5) * b.w / 320, b.y + (y + 0.5) * b.h / 200]; const [a1, a2] = S(at[0], at[1]), [c1, c2] = S(tx, ty);
        await page.mouse.move(a1, a2); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(a1 + (c1 - a1) * i / 12, a2 + (c2 - a2) * i / 12); await page.waitForTimeout(25); } await page.mouse.up(); await page.waitForTimeout(200); return D.drain(); }
      const dn = await D.ev(() => { for (let y = 150; y < 200; y++) for (let x = 0; x < 320; x++) if (M.uiHit(x, y) === 'dn') return [x + 1, y + 1]; return null; }); if (!dn) break; await tap(dn[0], dn[1]); }
    throw new Error('Gegenstand nicht in der Leiste: ' + item); };
  const spot = (id) => D.ev((i) => { const h = M.E.room.hotspots.find(x => x.id === i), r = M.E.hsRect(h); return [Math.round(r[0] + r[2] / 2 - M.E.camX), Math.round(r[1] + r[3] / 2)]; }, id);
  if (K2.length) {
    const kuca = () => { const g = find(K2, 'Lanas Zimmer, die Postkarte'); g.inv.push('key_kuca'); g.flags['k2.f2.kuca'] = true; g.notes = g.notes.filter(n => n !== 'f2_oven');
      g.pos.marko = { room: 'kuca', x: 150, y: 150, f: 'R' }; g.pos.mala = { room: 'kuca', x: 110, y: 150, f: 'R' }; g.active = 'marko'; return g; };
    await T('K2D-1', 'Wärmefach ohne Malas Nachhall: Fingerzeig statt Sackgasse (schräges Ziehen benutzt)', async () => {
      await load(kuca()); const [x, y] = await spot('compartment'); await dragItem('chisel', x, y);
      ok(await said('Sie soll den Herd spüren'), 'Marko nennt den nächsten Schritt');
      const h = await D.ev(() => { const t = M.hintsOpen(M.GS).find(h => h.id === 'f4'); return t ? M.hintText(t, 3, M.GS, 'marko') : ''; });
      ok(/spüren/.test(h), 'Hinweis Stufe 4: „' + h + '“');
    });
    await T('K2D-2', 'Mala spürt am Wärmefach, dann öffnet das Stemmeisen am Herd', async () => {
      await load(kuca()); await D.switchTo('mala'); await D.act('sense', 'compartment'); await D.drain();
      ok(await D.hasNote('f2_oven'), 'Notiz „Am Ofen“');
      await D.switchTo('marko'); const [x, y] = await spot('stove'); await dragItem('chisel', x, y);
      ok((await D.st()).inv.indexOf('rcm') >= 0, 'Rotkreuz-Nachricht im Inventar');
    });
  }
  if (K2.length) {
    // Auswahlen eines Gesprächs der Reihe nach mit der ersten Zeile beantworten, bis keine mehr offen ist
    const runThrough = async () => { for (let i = 0; i < 20; i++) { const s0 = await D.drain(); if (!s0.dlg) return; await D.ev(() => M.E.chooseDone(0)); await page.waitForTimeout(80); } };
    await T('K2C-1', 'Nach Sanjas Anruf: Fingerzeig auf Haus sieben', async () => {
      await load(find(K2, 'Dritter Fall')); await D.act('use', 'phone'); await D.choose('Sanja'); await runThrough();
      ok(await said('Haus sieben'), 'Alipašino Polje, Haus sieben wird genannt');
    });
    await T('K2C-2', 'Šehić verweigert den Schlüssel: Mala schlägt Lauschen vor', async () => {
      const g = find(K2, 'Zora im Dunkeln'); g.notes = g.notes.filter(n => n !== 's3_hanka' && n !== 's3_locked'); g.pos.mala = { room: 'haustor', x: g.pos.marko.x + 30, y: g.pos.marko.y, f: 'L' }; g.active = 'marko';
      await load(g); await D.act('talk', 'sehic'); await D.choose('Ich brauche den Schlüssel'); 
      ok(await said('an seiner Tür lauschen'), 'Mala nennt das Lauschen');
      await D.ev(() => { const D0 = M.E.dlg; if (D0) M.E.chooseDone(D0.opts.length - 1); }); await D.drain();
    });
    await T('K2C-5', 'Doppeltipp auf die offene Stahltür führt hinunter', async () => {
      const g = find(K2, 'Šehićs Schlüssel'); g.active = 'marko'; await load(g);
      await D.ev(() => { M.RS('haustor').shelterOpen = true; M.E.rebuild && M.E.rebuild(); });
      await D.ev(() => { const h = M.E.room.hotspots.find(x => x.id === 'shelter_door'), r = M.E.hsRect(h); M.ACT.marko.x = r[0] + r[2] / 2 - 40; }); await page.waitForTimeout(1500);
      const [x, y] = await spot('shelter_door'); await D.ev(() => { M.TURBO = 1; });   // Doppeltipp-Fenster läuft in Spielzeit: in Echtzeit tippen
      const b = await box(); const sx = b.x + (x + 0.5) * b.w / 320, sy = b.y + (y + 0.5) * b.h / 200;
      await page.mouse.click(sx, sy); await page.waitForTimeout(90); await page.mouse.click(sx, sy); await D.ev(() => { M.TURBO = 25; });
      await D.until(s => s.room === 'skloniste' || s.dlg, 20000, 'Schutzraum').catch(() => null); await D.drain();
      ok((await D.st()).room === 'skloniste', 'im Schutzraum (ist ' + (await D.st()).room + ')');
    });
    await T('K2C-4', 'Gegenstand in der Leiste auf einen anderen ziehen', async () => {
      const g = find(K2, 'Selmas Kinderwagen'); const keep = ['pecat', 'svjedocanstva']; g.inv = keep.concat(g.inv.filter(i => keep.indexOf(i) < 0)); g.active = 'marko'; await load(g); await D.ev(() => { M.E.invTop = 0; });
      const slot = (it) => D.ev((t) => { const i = M.GS.inv.indexOf(t); for (let y = 150; y < 200; y++) for (let x = 0; x < 320; x++) if (M.uiHit(x, y) === 'i:' + i) return [x + 8, y + 12]; return null; }, it);
      const a = await slot('pecat'), c = await slot('svjedocanstva'); const bx = await box(); const S = (x, y) => [bx.x + (x + 0.5) * bx.w / 320, bx.y + (y + 0.5) * bx.h / 200];
      const [a1, a2] = S(a[0], a[1]), [c1, c2] = S(c[0], c[1]); await page.mouse.move(a1, a2); await page.mouse.down();
      for (let i = 1; i <= 4; i++) { await page.mouse.move(a1, a2 - i * 8); await page.waitForTimeout(25); }
      for (let i = 1; i <= 10; i++) { await page.mouse.move(a1 + (c1 - a1) * i / 10, a2 - 32 + (c2 - a2 + 32) * i / 10); await page.waitForTimeout(25); }
      await page.mouse.up(); await page.waitForTimeout(300); await D.drain();
      ok(await D.ev(() => (M.__speechLog || []).length > 0), 'eine Reaktion auf Stempel + Zeugnisse');
    });
  }
  if (K2.length) {
    await T('K2B-1', 'Jakob antwortet auf sein Ankaufbuch mit einem Fingerzeig', async () => {
      const g = find(K2, 'Leser 2204'); g.notes = g.notes.filter(n => n !== 's2_provenance'); g.active = 'marko'; await load(g);
      await D.act('talk', 'jakob'); await D.choose('Nach etwas aus dem Notizbuch'); await D.pickNote('s2_ledger'); await D.drain();
      ok(await said('Dann hat er es geliehen'), 'Jakob verknüpft Nachlass und Stempel');
      await D.ev(() => { const D0 = M.E.dlg; if (D0) M.E.chooseDone(D0.opts.length - 1); }); await D.drain();
    });
    await T('K2B-8', 'Petar: beide Fragen erreichbar', async () => {
      const g = find(K2, 'Leser 2204'); g.active = 'marko'; g.pos.marko = { room: 'pansion', x: 200, y: 122, f: 'L' }; g.pos.mala = { room: 'pansion', x: 160, y: 122, f: 'R' }; await load(g);
      await D.act('use', 'phone'); await D.choose('Petar'); await D.until(s => s.dlg, 30000, 'Petar');
      await D.choose('Er war nicht alt'); const s1 = await D.settle();
      ok(s1.dlg && s1.dlg.some(t => t.indexOf('zwischen den Seiten') >= 0), 'zweite Frage noch da');
      await D.choose('zwischen den Seiten'); await D.choose('Danke'); await D.drain();
      ok(await said('Asche. Er nannte es'), 'Antwort auf die zweite Frage');
    });
  }
  console.log('\nblindfix: ' + pass + ' ok, ' + fails + ' Fehler'); await D.close2(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
