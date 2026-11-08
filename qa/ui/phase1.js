// Browser-Test Oberfläche, Phase 1 (UI-Konzept E): Esc-Stapel, Rechtsklick, Antwortlisten per Tastatur/Mausrad, Touch-Zeilen, Figurenknopf,
// „Zeigen“ beschriftet nur Ausgänge und Personen, Karten per Taste überspringen, Hochformat-Hinweis, Spielzeit im Overlay, Unterzeile im Titel,
// Fließtext ohne Waisen, Meldung im Menü, Inventarpfeile.      node qa/ui/phase1.js      (Exitcode 1 bei Fehlern)
'use strict';
const { pw, checker, open, settle, loadSlot, CAPTURE, toPage, HS_POINT } = require('./lib');
(async () => {
  const T = checker('Phase 1'); const b = await pw.chromium.launch(); const errs = [];
  try {
    // ---------------------------------------------------------------- Esc-Stapel, Rechtsklick, Inventarpfeile (Kapitel 1, Wohnung)
    T.section('Esc-Stapel und Rechtsklick (k1_start)');
    let p = await open(b, 'k1_start'); await loadSlot(p);
    const pts = await p.evaluate(HS_POINT);
    const withPop = await p.evaluate((pts) => { for (const q of pts) { M.pointerDown(q.x, q.y, false); M.pointerUp(q.x, q.y, false); if (M.E.pop) return q; M.E.pop = null; } return null; }, pts.filter(q => !q.exit));
    if (T.ck(!!withPop, 'ein Hotspot mit Verb-Menü gefunden')) {
      await p.evaluate(() => M.key('Escape')); let s = await p.evaluate(() => ({ pop: !!M.E.pop, menu: !!M.E.menu }));
      T.ck(!s.pop && !s.menu, 'Esc bei offenem Verb-Menü schließt nur das Menü (keine Pause)'); }
    await settle(p);
    const inv0 = await p.evaluate(() => M.GS.inv.slice());
    if (inv0.length) { await p.evaluate((id) => { M.E.pending = id; }, inv0[0]); await p.evaluate(() => M.key('Escape'));
      const s = await p.evaluate(() => ({ pend: M.E.pending, menu: !!M.E.menu })); T.ck(!s.pend && !s.menu, 'Esc bei gewähltem Gegenstand hebt nur die Wahl auf'); }
    await p.evaluate(() => M.key('Escape')); T.ck(await p.evaluate(() => !!M.E.menu), 'Esc ohne offene Ebene öffnet die Pause');
    if (await p.evaluate(() => !!M.shell)) T.ck(await p.evaluate(() => M.shell.ctx === 'pause' && !M.E.msg), 'Pause liegt in der HTML-Schicht (Meldungen als eigene Marke, nie über Menüzeilen)');
    else { await p.evaluate(() => { M.flash('Gespeichert.'); });
      const capM = await p.evaluate(CAPTURE); const msg = capM.find(e => e.s === 'Gespeichert.');
      T.ck(msg && msg.y < 40, 'Meldung im offenen Menü steht in der Kopfzeile (y=' + (msg && msg.y) + '), nicht über einer Menüzeile'); }
    await p.evaluate(() => M.key('Escape')); T.ck(await p.evaluate(() => !M.E.menu), 'Esc schließt die Pause wieder');
    // Rechtsklick über echte Maus: „Schau an“
    const look = pts.find(q => !q.exit) || pts[0];
    const xy = await toPage(p, look.x, look.y); await p.mouse.click(xy[0], xy[1], { button: 'right' });
    const r1 = await p.waitForFunction(() => M.E.busy || M.E.speech, null, { timeout: 4000 }).then(() => true).catch(() => false);
    T.ck(r1, 'Rechtsklick auf „' + look.id + '“ schaut ihn an (Satz/Szene startet)');
    T.ck(await p.evaluate(() => !M.E.pop), 'Rechtsklick öffnet kein Verb-Menü');
    await settle(p);
    T.ck(await p.evaluate(() => M.uiHit(54, 175) === 'up' && M.uiHit(289, 175) === 'dn' && M.uiHit(45, 175) === 'up'), 'Inventarpfeile 16 Spielpixel breit (x 40–55 und 287–302)');
    // Figurenknopf ohne Mala: Markos Porträt mit „Marko“, ohne Pfeil
    const capS = await p.evaluate(CAPTURE); const swLab = capS.filter(e => e.y > 180 && e.x < 42).map(e => e.s);
    T.ck(swLab.indexOf('Marko') >= 0 && !swLab.some(t => t.indexOf('↔') >= 0), 'ohne Mala zeigt der Knopf „Marko“ ohne Pfeil (' + swLab.join(', ') + ')');
    // Zeigen: Namen nur für Ausgänge und Personen
    await p.evaluate(() => M.key('z')); await p.waitForTimeout(300);
    const rev = await p.evaluate(() => { const E = M.E, ok = new Set(); E.room.hotspots.forEach(h => { if (E.uiExit(h) || h.npc) ok.add(E.nameOf(h)); });
      const L = [], msg = E.msg ? E.msg.t : null; const t0 = M.text; M.text = function (b, s, x, y) { if (y < 144 && String(s) !== msg) L.push(String(s)); return t0.apply(this, arguments); }; M.renderFrame(); M.text = t0; return { labels: L, ok: [...ok] }; });
    const strays = rev.labels.filter(t => rev.ok.indexOf(t) < 0);
    T.ck(strays.length === 0, '„Zeigen“ beschriftet nur Ausgänge und Personen (' + rev.labels.length + ' Namen' + (strays.length ? '; andere: ' + strays.join(', ') : '') + ')');
    // Spielzeit steht im Notizbuch
    await settle(p); await p.evaluate(() => { M.E.openNotes(); }); await p.waitForTimeout(100);
    const t0 = await p.evaluate(() => M.GS.playMs); await p.waitForTimeout(1000); const t1 = await p.evaluate(() => M.GS.playMs);
    T.ck(t1 - t0 < 50, 'Spielzeit läuft im Notizbuch nicht weiter (+' + Math.round(t1 - t0) + ' ms in 1 s)');
    await p.evaluate(() => M.key('Escape')); T.ck(await p.evaluate(() => !M.E.overlay && !M.E.menu), 'Esc schließt das Notizbuch, ohne die Pause zu öffnen');
    // Karte per Enter überspringen
    await p.evaluate(() => { M.E.toTitle(); M.E.newGame(1); }); await p.waitForFunction(() => M.E.screen === 'card', null, { timeout: 5000 });
    await p.keyboard.press('Enter'); const skip = await p.waitForFunction(() => M.E.screen !== 'card', null, { timeout: 1500 }).then(() => true).catch(() => false);
    T.ck(skip, 'Kapitelkarte mit Enter übersprungen');
    T.ck(await p.evaluate(() => M.journeyLine() === 'Split'), 'Unterzeile im Titel ohne abgeschlossenes Kapitel: „Split“');
    errs.push(...p.errs); await p.context().close();

    // ---------------------------------------------------------------- Antwortlisten (synthetisch, Kapitel 2)
    T.section('Antwortlisten: Ziffern, Pfeile, Mausrad, Touch-Zeilen (k2_fikret)');
    p = await open(b, 'k2_fikret'); await loadSlot(p);
    T.ck(await p.evaluate(() => M.journeyLine() === 'Split  ·  Sarajevo'), 'Unterzeile nach Kapitel 1: „Split · Sarajevo“');
    const dlg = async (fn) => { await p.evaluate(() => { window.__ch = undefined; M.E.busy = true; const labs = ['Erste Antwort', 'Zweite Antwort', 'Dritte Antwort', 'Vierte Antwort', 'Fünfte Antwort', 'Sechste Antwort', '(Gehen.)']; M.API.choose(labs.map((t, i) => ({ t, silent: true, bye: i === 6 })), { conv: false }).then(id => { window.__ch = (id === null || id === undefined) ? null : labs[id]; M.E.busy = false; }); M.renderFrame(); }); await fn(); };
    await dlg(async () => { await p.evaluate(() => M.touchUI(true)); const L = await p.evaluate(() => { const cap = []; const t0 = M.text; M.text = function (b, s, x, y) { cap.push(String(s)); return t0.apply(this, arguments); }; M.renderFrame(); M.text = t0; return { rows: M.E.dlg.lay.rows.map(r => r.r[3]), more: cap.filter(s => /^\+\d+$/.test(s)) }; });
      T.ck(L.rows.length === 3 && L.rows.every(h => h >= 15), 'Touch: drei Zeilen à ≥ 15 Spielpixel (' + L.rows.join(', ') + ')');
      T.ck(L.more[0] === '+4', 'Touch: Anzahl weiterer Antworten sichtbar (' + (L.more[0] || 'fehlt') + ')');
      const css = await p.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return r.width / 320; });
      T.ck(Math.min(...L.rows) * css >= 24, 'Touch: Zeilen ≥ 24 CSS-px bei diesem Maßstab (' + (Math.min(...L.rows) * css).toFixed(1) + ')');
      await p.evaluate(() => M.wheel(100)); T.ck(await p.evaluate(() => M.E.dlg.top === 1), 'Mausrad blättert die Liste um eine Zeile');
      await p.evaluate(() => M.key('2')); await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 2000 });
      T.ck(await p.evaluate(() => window.__ch === 'Dritte Antwort'), 'Ziffer 2 wählt die zweite sichtbare Zeile („Dritte Antwort“ nach dem Blättern)'); });
    await dlg(async () => { await p.evaluate(() => M.touchUI(false)); await p.evaluate(() => { M.key('ArrowDown'); M.key('ArrowDown'); M.key('Enter'); });
      await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 2000 }); T.ck(await p.evaluate(() => window.__ch === 'Zweite Antwort'), '↓ ↓ Enter wählt die zweite Antwort'); });
    await dlg(async () => { await p.evaluate(() => M.touchUI(false)); const rows = await p.evaluate(() => { M.renderFrame(); return M.E.dlg.lay.rows.length; });
      T.ck(rows === 4, 'Maus: vier Zeilen sichtbar (' + rows + ')'); const cx = await p.evaluate(() => M.E.dlg.lay.close); T.ck(cx && cx[3] >= 16, 'Schließen-Fläche ≥ 16 Spielpixel hoch');
      await p.evaluate(() => M.E.chooseDone(6)); });
    // Verb-Menü bei Touch
    await settle(p); await p.evaluate(() => M.touchUI(true)); const pts2 = await p.evaluate(HS_POINT);
    const rh = await p.evaluate((pts) => { for (const q of pts) { M.pointerDown(q.x, q.y, true); M.pointerUp(q.x, q.y, true); if (M.E.pop) { const o = { rh: M.E.pop.rh, dx: Math.min(Math.abs(M.E.pop.bx - q.x), Math.abs(M.E.pop.bx + M.E.pop.bw - q.x)) }; M.E.pop = null; return o; } } return null; }, pts2.filter(q => !q.exit));
    if (rh) { T.ck(rh.rh === 15, 'Verb-Menü bei Touch: Zeilen 15 Spielpixel'); T.ck(rh.dx >= 12, 'Verb-Menü ≥ 12 Spielpixel neben dem Tippunkt (' + rh.dx + ')'); }
    else T.ck(false, 'kein Hotspot mit Verb-Menü gefunden');
    errs.push(...p.errs); await p.context().close();

    // ---------------------------------------------------------------- Figurenknopf mit Mala (Kapitel 2, Vratnik)
    T.section('Figurenknopf mit Mala (k2_limbo)');
    p = await open(b, 'k2_limbo'); await loadSlot(p);
    const sw = await p.evaluate(() => { const L = []; const t0 = M.text; M.text = function (b, s, x, y) { if (y > 180 && x < 42) L.push(String(s)); return t0.apply(this, arguments); }; M.renderFrame(); M.text = t0; return { L, active: M.GS.active, can: M.E.canSwitch() }; });
    T.ck(sw.L.some(t => /^↔ ?Mala$/.test(t)) || sw.active !== 'marko', 'Knopf nennt das Ziel mit Pfeil (' + sw.L.join(', ') + ')');
    errs.push(...p.errs); await p.context().close();

    // ---------------------------------------------------------------- Fließtext ohne Waisen (Einheit)
    T.section('Fließtext ohne Waisen');
    p = await open(b, null);
    const flow = await p.evaluate(() => { const lines = ['Ich warte jeden Abend an der Riva auf das Boot aus Ancona, das nicht kommt, und auf einen', 'Mann, der nicht mehr da ist, seit vielen Jahren schon.', '', 'Deine Ivka'];
      const out = M.docFlow({ lines }, 140, 'letter'), keep = M.docFlow({ lines, faded: [1] }, 140, 'letter'); return { out, keep }; });
    const orphan = flow.out.filter((l, i) => l && flow.out[i + 1] && M_ORPHAN(l));
    function M_ORPHAN(l) { return l.split(' ').length === 1 && !/[.!?:…]$/.test(l); }
    T.ck(orphan.length === 0, 'kein einzelnes Wort mitten im Satz auf eigener Zeile (' + flow.out.join(' | ') + ')');
    T.ck(flow.out[flow.out.length - 1] === 'Deine Ivka', 'Gruß bleibt eigene Zeile');
    errs.push(...p.errs); await p.context().close();

    // ---------------------------------------------------------------- Hochformat-Hinweis (iPhone 13 hochkant, Touch)
    T.section('Hochformat-Hinweis (iPhone 13 hochkant)');
    const dev = pw.devices['iPhone 13']; p = await open(b, null, { viewport: dev.viewport, deviceScaleFactor: dev.deviceScaleFactor, isMobile: true, hasTouch: true, userAgent: dev.userAgent });
    T.ck(await p.evaluate(() => document.getElementById('rotnote').classList.contains('on')), 'Hinweis „MALA wird quer gespielt“ erscheint');
    const btn = await p.$('#rotnote button'); const bb = btn && await btn.boundingBox(); T.ck(bb && bb.height >= 44, 'Knopf „Gedreht weiterspielen“ ≥ 44 CSS-px hoch (' + (bb && bb.height) + ')');
    if (btn) await btn.tap(); T.ck(await p.evaluate(() => !document.getElementById('rotnote').classList.contains('on') && localStorage.getItem('mala.rotOk') === '1'), 'nach dem Tipp verborgen und gemerkt');
    // Chromium schreibt localStorage in einem frischen Kontext verzögert weg: ein Neuladen wenige ms nach dem Schreiben kann den Eintrag verlieren (Testumgebung, nicht das Spiel)
    await p.waitForTimeout(800); await p.reload(); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title' && document.getElementById('rotnote'), null, { timeout: 20000 }); await p.waitForTimeout(300);
    const rl = await p.evaluate(() => ({ on: document.getElementById('rotnote').classList.contains('on'), ok: localStorage.getItem('mala.rotOk'), keys: Object.keys(localStorage).join(','), ss: sessionStorage.getItem('__i') }));
    T.ck(!rl.on && rl.ok === '1', 'nach dem Neuladen nicht erneut' + (rl.on || rl.ok !== '1' ? ' – ' + JSON.stringify(rl) : ''));
    errs.push(...p.errs); await p.context().close();
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
