// Browser-Test Oberfläche, Phase 4 (UI-Konzept B3, optionale Erweiterungen): Untertitelschicht für Gespräche (B3-2), Sicherung als Datei (B3-3),
// „Zuletzt“-Karte (B3-4), Schnellvorlauf (B3-5), Namen für Lesezeichen und Abspann beendeter Kapitel (B3-6).
// Bedienung über echte Klicks, Tasten, Downloads und Dateiauswahl; der Spielzustand wird gelesen und für Szenen präpariert.
//   node qa/ui/phase4.js [--shots <ordner>]        (Exitcode 1 bei Fehlern)
'use strict';
const path = require('path'), fs = require('fs'), os = require('os');
const { pw, checker, open, settle, loadSlot, CAPTURE } = require('./lib');
const a = process.argv.slice(2), SHOTS = a.indexOf('--shots') >= 0 ? path.resolve(a[a.indexOf('--shots') + 1]) : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
async function click(p, text, opt) { const loc = p.locator('#shell').locator('button', { hasText: text }).first(); await loc.waitFor({ state: 'visible', timeout: (opt && opt.timeout) || 4000 }); await loc.click(); await p.waitForTimeout(80); }
async function shot(p, name) { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, name + '.png') }); }
const PHONE = { viewport: { width: 750, height: 342 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true };
const PHONE_HOCH = { viewport: { width: 342, height: 750 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true };
// synthetische Antwortliste wie in phase1.js (das Ergebnis landet in window.__ch)
const DLG = (labs) => { window.__ch = undefined; M.E.busy = true; M.API.choose(labs.map((t, i) => ({ t, silent: true, bye: i === labs.length - 1 })), { conv: false }).then(id => { window.__ch = (id === null || id === undefined) ? null : labs[id]; M.E.busy = false; }); };
const LABS = ['Erste Antwort', 'Zweite Antwort', 'Dritte Antwort', 'Vierte Antwort', 'Fünfte Antwort', 'Sechste Antwort', '(Gehen.)'];
const SUBS = () => { const r = document.getElementById('subs'), l = r && r.querySelector('.sb-line'), c = r && r.querySelector('.sb-cho');
  const box = (e) => { if (!e || getComputedStyle(e).display === 'none') return null; const q = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height, r: q.right, b: q.bottom }; };
  return { on: !!r && r.classList.contains('on'), cls: r ? r.className : '', line: l ? l.textContent : '', lineBox: box(l), lineFont: l ? getComputedStyle(l).fontFamily : '', lineSize: l ? parseFloat(getComputedStyle(l).fontSize) : 0,
    opts: c ? [...c.querySelectorAll('.sb-o')].map(b => ({ t: b.querySelector('.t').textContent, kf: b.classList.contains('kf'), h: b.getBoundingClientRect().height })) : [], choBox: box(c), tf: r ? getComputedStyle(r).transform : '' }; };
const capTexts = () => { const L = []; const t0 = M.text; M.text = function (b, s) { L.push(String(s)); return t0.apply(this, arguments); }; try { M.renderFrame(); } finally { M.text = t0; } return L.join(' | '); };
(async () => {
  const T = checker('Phase 4'); const b = await pw.chromium.launch(); const errs = []; const done = async (p) => { errs.push(...p.errs); await p.context().close(); };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mala-p4-'));
  try {
    // ---------------------------------------------------------------- B3-2 Untertitelschicht
    T.section('Untertitelschicht: aus bei Pixel/normal, an über die Einstellungen');
    let p = await open(b, 'k2_fikret'); await loadSlot(p);
    T.ck(await p.evaluate(() => M.subsOn() === false), 'Pixel + normal: Untertitelschicht aus');
    await p.evaluate(() => { M.E.busy = true; M.API.m('Der Satz steht im Canvas.'); });
    await p.waitForTimeout(150);
    T.ck(await p.evaluate(capTexts) .then(s => s.indexOf('Der Satz steht im Canvas.') >= 0), 'ohne Schicht zeichnet der Canvas den Satz wie bisher');
    T.ck(!(await p.evaluate(SUBS)).on, 'ohne Schicht ist #subs unsichtbar');
    await p.evaluate(() => { M.E.endSpeech(); M.E.busy = false; }); await settle(p);
    await p.keyboard.press('Escape'); await p.waitForFunction(() => M.shell.ctx === 'pause', null, { timeout: 3000 });
    await click(p, 'Einstellungen'); await p.locator('#shell .segp button', { hasText: 'Lesbar' }).click(); await p.waitForTimeout(80);
    T.ck(await p.evaluate(() => M.subsOn() === true && localStorage.getItem('mala.font') === 'read'), '„Schrift: Lesbar“ schaltet die Untertitelschicht ein (mala.font)');
    await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.waitForFunction(() => M.shell.ctx === null, null, { timeout: 3000 });

    T.section('Untertitelschicht: Sätze');
    await p.evaluate(() => { M.E.busy = true; window.__said = false; M.API.m('Das ist ein Satz in der Leseschrift, lang genug, um umzubrechen und die Leiste zu überdecken.').then(() => { window.__said = true; }); });
    await p.waitForTimeout(250); let s = await p.evaluate(SUBS);
    T.ck(s.on && /^Marko: Das ist ein Satz in der Leseschrift/.test(s.line), 'Satz mit Sprechername in der Schicht („' + s.line.slice(0, 40) + '…“)');
    T.ck(/Atkinson Hyperlegible Next/.test(s.lineFont), 'Satz in Atkinson Hyperlegible Next');
    T.ck(await p.evaluate(capTexts).then(t => t.indexOf('Das ist ein Satz') < 0), 'der Canvas zeichnet den Satz nicht mehr selbst');
    const pic = await p.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom }; });
    T.ck(s.lineBox && s.lineBox.b <= pic.b + 0.5 && s.lineBox.x >= pic.x - 0.5 && s.lineBox.r <= pic.r + 0.5, 'Satz liegt unten im Spielbild (deckungsgleich mit dem Canvas)');
    T.ck(await p.evaluate(() => getComputedStyle(document.querySelector('#subs .sb-line')).pointerEvents === 'none'), 'Satzkasten lässt Tipps zum Canvas durch');
    await shot(p, 'b32_satz_lesbar');
    await p.mouse.click(pic.x + 200, pic.y + 120); await p.waitForFunction(() => window.__said === true, null, { timeout: 3000 }).catch(() => {});
    T.ck(await p.evaluate(() => window.__said === true && !M.E.speech), 'Tipp ins Bild überspringt den Satz wie gewohnt');
    await p.evaluate(() => { M.E.busy = false; });

    T.section('Untertitelschicht: Antwortlisten (Klick, Ziffern, Pfeile)');
    await p.evaluate(DLG, LABS); await p.waitForTimeout(550);   // Liste nimmt 450 ms nach dem Erscheinen noch keinen Tipp an (Touch-Konzept T04)
    s = await p.evaluate(SUBS);
    T.ck(s.opts.length === 7 && s.opts[0].t === 'Erste Antwort' && s.opts[6].t === '(Gehen.)', 'alle sieben Antworten als Liste (' + s.opts.length + ')');
    T.ck(await p.evaluate(() => M.E.dlg.lay === null), 'keine Canvas-Trefferflächen hinter der Liste (dlg.lay leer)');
    T.ck(await p.evaluate(capTexts).then(t => t.indexOf('Erste Antwort') < 0), 'der Canvas zeichnet die Antwortzeilen nicht');
    T.ck(s.opts.every(o => o.h >= 44), 'jede Antwort ≥ 44 CSS-px hoch (' + Math.min(...s.opts.map(o => o.h)).toFixed(0) + ')');
    await shot(p, 'b32_liste_lesbar');
    await p.locator('#subs .sb-o', { hasText: 'Dritte Antwort' }).click(); await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 2000 });
    T.ck(await p.evaluate(() => window.__ch === 'Dritte Antwort'), 'Klick wählt „Dritte Antwort“');
    await p.evaluate(DLG, LABS); await p.waitForTimeout(100); await p.keyboard.press('5'); await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 2000 });
    T.ck(await p.evaluate(() => window.__ch === 'Fünfte Antwort'), 'Ziffer 5 wählt die fünfte Zeile');
    await p.evaluate(DLG, LABS); await p.waitForTimeout(100); await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(100);
    s = await p.evaluate(SUBS); T.ck(s.opts.findIndex(o => o.kf) === 1, '↓ ↓ hebt die zweite Zeile hervor');
    await p.keyboard.press('Enter'); await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 2000 });
    T.ck(await p.evaluate(() => window.__ch === 'Zweite Antwort'), 'Enter wählt die hervorgehobene Zeile');
    // Satz und Liste zugleich: der Tipp auf eine Antwort beendet erst den Satz (wie im Canvas)
    await p.evaluate(DLG, LABS); await p.evaluate(() => { M.API.m('Ein Satz über der Liste.'); }); await p.waitForTimeout(300);
    s = await p.evaluate(SUBS); T.ck(s.lineBox && s.choBox && s.lineBox.b <= s.choBox.y + 1, 'Satz steht über der offenen Liste');
    await p.locator('#subs .sb-o', { hasText: 'Erste Antwort' }).click(); await p.waitForTimeout(120);
    T.ck(await p.evaluate(() => !M.E.speech && window.__ch === undefined && !!M.E.dlg), 'Tipp während des Satzes beendet nur den Satz, die Auswahl bleibt offen');
    await p.evaluate(() => M.E.chooseDone(6)); await p.waitForTimeout(80);
    // Pause über laufendem Satz: Schicht weg; Overlay: Canvas zeichnet selbst
    await p.evaluate(() => { M.E.busy = true; M.API.m('Satz unter der Pause.'); }); await p.waitForTimeout(150); await p.evaluate(() => M.key('Escape')); await p.waitForTimeout(120);
    T.ck(!(await p.evaluate(SUBS)).on, 'bei offener Pause ist die Untertitelschicht ausgeblendet');
    await p.evaluate(() => M.key('Escape')); await p.waitForTimeout(80); await p.evaluate(() => { M.E.endSpeech(); M.E.busy = false; }); await settle(p);
    await done(p);

    T.section('Untertitelschicht: Übersetzung wie im Canvas (Bos./Hrv.)');
    p = await open(b, 'k2_fikret', null, { 'mala.lang': 'bhs' }); await loadSlot(p);
    await p.evaluate(DLG, ['(Gehen.)', 'Zweite Antwort', 'Schluss']); await p.waitForTimeout(100);
    const canvasOpt = await p.evaluate(() => { M.renderFrame(); const d = M.E.dlg; return d.opts[0].lines.join(' '); });
    await p.evaluate(() => M.shell.openPause()); await click(p, 'Postavke'); await p.evaluate(() => M.shell.pick('Schrift=read'));
    await p.evaluate(() => M.shell.close()); await p.waitForTimeout(150); s = await p.evaluate(SUBS);
    T.ck(canvasOpt === '(Otići.)' && s.opts[0] && s.opts[0].t === canvasOpt, 'Antwort in der Schicht = Canvas-Text („' + canvasOpt + '“ / „' + (s.opts[0] && s.opts[0].t) + '“)');
    await p.evaluate(() => M.E.chooseDone(2)); await done(p);

    T.section('Untertitelschicht: große Pixelschrift, Breitbild (iPhone quer) und gedrehtes Hochformat');
    p = await open(b, 'k2_fikret', PHONE, { 'mala.textsize': '1' }); await loadSlot(p); await p.waitForFunction(() => M.isWide(), null, { timeout: 3000 }).catch(() => {});
    T.ck(await p.evaluate(() => M.isWide()), 'iPhone quer: Breitbild aktiv');
    await p.evaluate(() => { M.E.busy = true; M.API.m('Großer Text auf dem Telefon, damit man ihn ohne Brille lesen kann.'); }); await p.waitForTimeout(250); s = await p.evaluate(SUBS);
    const vp = PHONE.viewport, wg = await p.evaluate(() => { const g = M.wideGeo(); return { x: g.x0, y: g.y0, r: g.x0 + g.cssW, b: g.y0 + g.cssH }; });
    T.ck(/sz1/.test(s.cls) && /MALA Pixel/.test(s.lineFont), 'große Schrift in MALA Pixel (' + s.lineSize + ' px)');
    T.ck(s.lineBox && s.lineBox.b <= wg.b + 0.5 && s.lineBox.x >= 0 && s.lineBox.r <= vp.width && s.lineBox.y >= 0, 'Satz innerhalb von Bild und Bildschirm');
    await shot(p, 'b32_breitbild_gross'); await p.evaluate(() => { M.E.endSpeech(); });
    await p.evaluate(DLG, LABS); await p.waitForTimeout(550);   // Liste nimmt 450 ms nach dem Erscheinen noch keinen Tipp an (Touch-Konzept T04)
    s = await p.evaluate(SUBS);
    T.ck(s.choBox && s.choBox.b <= wg.b + 0.5 && s.choBox.y >= 0 && s.choBox.r <= vp.width, 'Liste innerhalb von Bild und Bildschirm (scrollt bei Bedarf)');
    T.ck(s.opts.every(o => o.h >= 44), 'Antworten ≥ 44 CSS-px hoch');
    await shot(p, 'b32_breitbild_liste');
    await p.locator('#subs .sb-o', { hasText: 'Zweite Antwort' }).tap(); await p.waitForFunction(() => window.__ch !== undefined, null, { timeout: 2000 });
    T.ck(await p.evaluate(() => window.__ch === 'Zweite Antwort'), 'Tippen wählt eine Antwort');
    await done(p);
    p = await open(b, 'k2_fikret', PHONE_HOCH, { 'mala.textsize': '1' }); await loadSlot(p);
    const rb = p.locator('#rotnote button').first(); if (await rb.isVisible().catch(() => false)) await rb.tap(); await p.waitForTimeout(150);
    await p.evaluate(() => { M.E.busy = true; M.API.m('Gedrehter Satz.'); }); await p.waitForTimeout(250); s = await p.evaluate(SUBS);
    T.ck(await p.evaluate(() => M.isRotated()) && /^matrix\([^,]+, 1, -1, /.test(s.tf), 'gedrehtes Hochformat: Schicht dreht mit dem Bild (' + s.tf + ')');
    T.ck(s.lineBox && s.lineBox.x >= -0.5 && s.lineBox.r <= PHONE_HOCH.viewport.width + 0.5 && s.lineBox.y >= -0.5 && s.lineBox.b <= PHONE_HOCH.viewport.height + 0.5, 'Satz bleibt im Bildschirm');
    await shot(p, 'b32_gedreht'); await p.evaluate(() => { M.E.endSpeech(); M.E.busy = false; }); await done(p);

    // ---------------------------------------------------------------- D17 / Phase 3: Überblendung beim Wechsel
    T.section('Überblendung beim Wechsel Breitbild ↔ gewohntes Bild (150 ms)');
    p = await open(b, 'k2_fikret', PHONE); await loadSlot(p); await settle(p); await p.waitForFunction(() => M.isWide(), null, { timeout: 3000 }).catch(() => {});
    const FADE = () => { const c = document.getElementById('game'); return { wide: M.isWide(), ov: !!M.E.overlay, tr: c.style.transition, op: parseFloat(getComputedStyle(c).opacity) }; };
    await p.keyboard.press('n'); await p.waitForFunction(() => !M.isWide(), null, { timeout: 2000, polling: 'raf' }).catch(() => {}); let f = await p.evaluate(FADE);
    const f0 = f; await p.waitForTimeout(40); f = await p.evaluate(FADE);   // im Wechselbild steht die Deckkraft auf 0, ein Bild später läuft der Übergang
    T.ck(f.ov && !f.wide && f0.op < 1 && /opacity 150ms/.test(f.tr) && f.op < 1, 'Notizbuch öffnet im gewohnten Bild mit Überblendung (Deckkraft ' + f0.op.toFixed(2) + ' → ' + f.op.toFixed(2) + ')');
    await p.waitForTimeout(300); T.ck((await p.evaluate(FADE)).op === 1, 'nach 150 ms voll sichtbar');
    await p.keyboard.press('Escape'); await p.waitForFunction(() => M.isWide(), null, { timeout: 2000, polling: 'raf' }).catch(() => {}); f = await p.evaluate(FADE);
    T.ck(f.wide && f.op < 1, 'zurück ins Breitbild ebenfalls mit Überblendung (' + f.op.toFixed(2) + ')');
    await done(p);
    p = await open(b, 'k2_fikret', PHONE, { 'mala.motion': '1' }); await loadSlot(p); await settle(p); await p.waitForFunction(() => M.isWide(), null, { timeout: 3000 }).catch(() => {});
    await p.keyboard.press('n'); await p.waitForFunction(() => !M.isWide(), null, { timeout: 2000, polling: 'raf' }).catch(() => {}); f = await p.evaluate(FADE);
    T.ck(!f.wide && f.op === 1 && !/opacity/.test(f.tr), '„Bewegung reduzieren“: Wechsel ohne Überblendung');
    await done(p);

    // ---------------------------------------------------------------- B3-5 Schnellvorlauf (D2: Sätze enden sofort, Wartezeiten und Wege ×10)
    T.section('Schnellvorlauf: Esc gedrückt halten während einer Szene');
    p = await open(b, 'k2_fikret'); await loadSlot(p);
    const sceneWait = () => { window.__sw = 0; M.E.busy = true; (async () => { await M.API.wait(30000); window.__sw = 1; M.E.busy = false; })(); };
    const sceneLines = () => { window.__sc = 0; M.__speechLog = []; M.E.busy = true; (async () => { for (let i = 0; i < 8; i++) { await M.API.m('Szenensatz Nummer ' + i + ', ein wenig länger, damit er dauert.'); window.__sc++; } M.E.busy = false; })(); };
    const rate = async () => p.evaluate(async () => { const g0 = M.E.gt(), t0 = performance.now(), m0 = M.GS.playMs; await new Promise(r => setTimeout(r, 600)); return { k: (M.E.gt() - g0) / (performance.now() - t0), pm: (M.GS.playMs - m0) / (performance.now() - t0) }; });
    await p.evaluate(sceneWait); await p.waitForTimeout(200);
    const r1 = await rate();
    await p.keyboard.down('Escape'); await p.waitForTimeout(450);
    T.ck(await p.evaluate(() => M.ffActive() && M.shell.ctx === null && !M.E.menu), 'gehalten: Schnellvorlauf läuft, keine Pause');
    T.ck(await p.evaluate(capTexts).then(t => t.indexOf('▸▸') >= 0), 'Anzeige „▸▸“ im Bild');
    const r2 = await rate();
    T.ck(r2.k / r1.k > 7, 'Wartezeiten und Wege laufen schneller (Spielzeit ×' + (r2.k / r1.k).toFixed(1) + ')');
    T.ck(r2.pm < 1.3, 'Spielzeit im Spielstand zählt weiter als Echtzeit (' + r2.pm.toFixed(2) + ' ms je ms)');
    await shot(p, 'b35_schnellvorlauf');
    await p.keyboard.up('Escape'); await p.waitForTimeout(120);
    T.ck(await p.evaluate(() => !M.E.ff && !M.ffActive() && M.shell.ctx === null && !M.E.menu && M.E.busy && window.__sw === 0), 'loslassen: normal weiter, keine Pause, die Szene läuft weiter');
    await p.keyboard.down('Escape'); await p.waitForTimeout(60); await p.keyboard.up('Escape'); await p.waitForTimeout(120);
    T.ck(await p.evaluate(() => M.shell.ctx === 'pause'), 'kurz gedrückt während der Szene: Pause öffnet (beim Loslassen)');
    await p.keyboard.press('Escape'); await p.waitForTimeout(120);
    await p.keyboard.down('Escape'); await p.waitForFunction(() => window.__sw === 1, null, { timeout: 8000 }).catch(() => {});
    T.ck(await p.evaluate(() => window.__sw === 1 && !M.E.busy), 'bis zum Ende gehalten: die Szene endet regulär (Wartezeit abgelaufen)');
    await p.keyboard.up('Escape'); await p.waitForTimeout(80);
    T.ck(await p.evaluate(() => M.shell.ctx === null), 'nach dem Ende der Szene öffnet das Loslassen keine Pause');
    // Sätze: jeder wird gesagt und endet sofort – auch bei „Weiter erst nach Tippen“
    await p.evaluate(() => { window.__tap = M.E.tapText(); M.E.setText(M.E.textSpeed(), true); }); await p.evaluate(sceneLines); await p.waitForTimeout(150);
    const tL = Date.now(); await p.keyboard.down('Escape'); await p.waitForFunction(() => !M.E.busy, null, { timeout: 8000 }).catch(() => {}); const dtL = Date.now() - tL;
    const said = await p.evaluate(() => ({ n: window.__sc, log: (M.__speechLog || []).map(x => x[1]) }));
    T.ck(said.n === 8 && said.log.length === 8 && said.log.every((t, i) => t.indexOf('Szenensatz Nummer ' + i + ',') === 0), 'alle 8 Sätze wurden gesagt, in Reihenfolge – nichts übersprungen');
    T.ck(dtL < 2500, 'Sätze enden sofort, auch bei „Weiter erst nach Tippen“ (8 Sätze in ' + dtL + ' ms)');
    await p.keyboard.up('Escape'); await p.waitForTimeout(80); await p.evaluate(() => { M.E.setText(M.E.textSpeed(), window.__tap); M.__speechLog = null; });
    await settle(p); await p.keyboard.down('Escape'); await p.waitForTimeout(40);
    T.ck(await p.evaluate(() => M.shell.ctx === 'pause'), 'ohne Szene öffnet Esc die Pause sofort (beim Drücken)');
    await p.keyboard.up('Escape'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    // Auswahl während der Szene: Esc bleibt Esc (Pause), kein Vorlauf
    await p.evaluate(DLG, LABS); await p.waitForTimeout(80); await p.keyboard.down('Escape'); await p.waitForTimeout(40);
    T.ck(await p.evaluate(() => M.shell.ctx === 'pause' && !M.E.ff), 'bei offener Auswahl öffnet Esc die Pause, kein Vorlauf');
    await p.keyboard.up('Escape'); await p.keyboard.press('Escape'); await p.waitForTimeout(80); await p.evaluate(() => M.E.chooseDone(6));
    // Fenster verliert den Fokus: Vorlauf endet
    await settle(p); await p.evaluate(sceneWait); await p.waitForTimeout(100); await p.keyboard.down('Escape'); await p.waitForTimeout(450);
    await p.evaluate(() => window.dispatchEvent(new Event('blur'))); await p.waitForTimeout(60);
    T.ck(await p.evaluate(() => !M.E.ff), 'Fokusverlust beendet den Schnellvorlauf');
    await p.keyboard.up('Escape'); await p.waitForTimeout(80);
    T.ck(await p.evaluate(() => M.shell.ctx === null), '… und das spätere Loslassen öffnet keine Pause');
    await p.keyboard.down('Escape'); await p.waitForFunction(() => window.__sw === 1, null, { timeout: 8000 }).catch(() => {}); await p.keyboard.up('Escape'); await p.waitForTimeout(80);
    await settle(p); await p.evaluate(() => M.shell.openPause()); await click(p, 'Steuerung'); T.ck(await p.evaluate(() => document.querySelector('#shell').textContent.indexOf('Esc gedrückt halten, während eine Szene läuft') >= 0), '„Steuerung“ erklärt den Schnellvorlauf');
    await done(p);

    // ---------------------------------------------------------------- B3-6 Namen für Lesezeichen
    T.section('Namen für Lesezeichen');
    p = await open(b, 'k2_fikret'); await loadSlot(p); await settle(p);
    await p.evaluate(() => M.shell.openPause()); await p.waitForFunction(() => M.shell.ctx === 'pause', null, { timeout: 3000 }); await click(p, 'Speichern');
    await p.locator('#shell .card .cardmain', { hasText: 'Hier speichern' }).first().click(); await p.waitForTimeout(150);
    T.ck(await p.evaluate(() => M.shell.toastNow() && /Lesezeichen 1/.test(M.shell.toastNow().t)), 'Lesezeichen 1 gespeichert');
    const ren = p.locator('#shell button[data-ren]').first(); T.ck(await ren.isVisible(), '„Benennen …“ unter dem Lesezeichen');
    await ren.click(); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => document.activeElement && document.activeElement.id === 'shname'), 'Namensfeld hat den Fokus');
    await shot(p, 'b36_benennen');
    await p.keyboard.type('Vor dem Gespräch mit Fikret, sehr lang'); await p.keyboard.press('Enter'); await p.waitForTimeout(120);
    let card = await p.evaluate(() => { const c = document.querySelector('#shell .card b'); return c ? c.textContent : ''; });
    T.ck(M_SAFE(card) === 'Vor dem Gespräch mit Fik', 'Enter speichert den Namen, höchstens 24 Zeichen („' + card + '“)');
    T.ck(await p.evaluate(() => JSON.parse(localStorage.getItem('mala.mark.1.1')).name === 'Vor dem Gespräch mit Fik'), 'Name liegt im Lesezeichen (mala.mark.1.1)');
    T.ck(await p.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-ren')), 'Fokus zurück auf „Benennen …“ (F11)');
    await p.locator('#shell button[data-ren]').first().click(); await p.waitForTimeout(80); await p.keyboard.type('xyz'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => JSON.parse(localStorage.getItem('mala.mark.1.1')).name === 'Vor dem Gespräch mit Fik' && M.shell.current() === 'save'), 'Esc im Namensfeld bricht ab, Name bleibt');
    await p.locator('#shell button[data-ren]').first().click(); await p.waitForTimeout(80); await p.keyboard.type('abc'); await p.mouse.click(12, 12); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => JSON.parse(localStorage.getItem('mala.mark.1.1')).name === 'Vor dem Gespräch mit Fik' && M.shell.current() === 'save'), 'Tipp neben das Fenster bricht ab (D8), Name bleibt');
    await p.locator('#shell button[data-ren]').first().click(); await p.waitForTimeout(80); await p.fill('#shname', ''); await p.locator('#shell button[data-ok]').click(); await p.waitForTimeout(100);
    card = await p.evaluate(() => { const c = document.querySelector('#shell .card b'); return c ? c.textContent : ''; });
    T.ck(/^Kapitel 2 · /.test(card), 'leer gelassen: wieder der Ort („' + card + '“)');
    await p.locator('#shell button[data-ren]').first().click(); await p.waitForTimeout(80); await p.fill('#shname', 'Mein Punkt'); await p.locator('#shell button[data-ok]').click(); await p.waitForTimeout(100);
    await p.keyboard.press('Escape'); await p.waitForTimeout(80); await click(p, 'Laden'); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => document.querySelector('#shell').textContent.indexOf('Mein Punkt') >= 0), 'Name erscheint auch beim Laden');
    await p.keyboard.press('Escape'); await p.waitForTimeout(80); await click(p, 'Speichern');
    await p.locator('#shell .card .cardmain', { hasText: 'Mein Punkt' }).first().click(); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => M.shell.current() === 'confirm'), 'belegtes Lesezeichen: Rückfrage „überschreiben?“');
    await p.mouse.click(12, 12); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => M.shell.current() === 'save' && JSON.parse(localStorage.getItem('mala.mark.1.1')).name === 'Mein Punkt'), 'Tipp neben die Rückfrage bricht ab, nichts überschrieben (D8)');
    await p.locator('#shell .card .cardmain', { hasText: 'Mein Punkt' }).first().click(); await p.waitForTimeout(100); await click(p, 'Überschreiben'); await p.waitForTimeout(120);
    T.ck(await p.evaluate(() => !JSON.parse(localStorage.getItem('mala.mark.1.1')).name), 'Überschreiben setzt den Namen zurück (neuer Ort, neuer Stand)');
    await done(p);

    // ---------------------------------------------------------------- B3-4 „Zuletzt“-Karte
    T.section('„Zuletzt“-Karte beim Fortsetzen');
    p = await open(b, 'k2_fikret'); await click(p, 'Fortsetzen'); await p.waitForFunction(() => M.E.screen === 'game', null, { timeout: 5000 }); await p.waitForTimeout(150);
    const rc = await p.evaluate(() => { const el = document.querySelector('#shell .sh-recap'), r = el.getBoundingClientRect(), g = M.GS, m = M.E.metaOf(g);
      const exp = M.E.nbOpen(false).slice().sort((a, b) => g.notes.indexOf(b) - g.notes.indexOf(a)).slice(0, 3).map(id => { const n = M.NOTES[id]; return M.trUI(n.s || n.t); });
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { on: el.classList.contains('on'), txt: el.textContent, li: [...el.querySelectorAll('li')].map(x => x.textContent), exp, room: m.roomName, ch: m.chapter, hit: hit ? (hit.id || hit.className) : '', left: M.shell.recapNow().until - Date.now() }; });
    T.ck(rc.on && rc.txt.indexOf('Zuletzt') === 0, '„Zuletzt“-Karte erscheint nach „Fortsetzen“');
    T.ck(rc.txt.indexOf('Kapitel ' + rc.ch + ' · ' + rc.room) >= 0, 'zeigt Kapitel und Ort („Kapitel ' + rc.ch + ' · ' + rc.room + '“)');
    T.ck(rc.li.length === Math.min(3, rc.exp.length) && rc.li.every((t, i) => t === rc.exp[i]), 'die drei zuletzt notierten offenen Notizen im Wortlaut des Notizbuchs (' + rc.li.length + ')');
    T.ck(rc.hit === 'game', 'blockiert nichts: Tipp an ihrer Stelle trifft das Spielbild (' + rc.hit + ')');
    T.ck(rc.left > 7000 && rc.left <= 9000, 'verschwindet nach etwa 9 s von selbst (Rest ' + rc.left + ' ms)');
    await shot(p, 'b34_zuletzt');
    await p.keyboard.press('z'); await p.waitForTimeout(80);
    T.ck(await p.evaluate(() => !document.querySelector('#shell .sh-recap').classList.contains('on')), 'eine Taste schließt sie');
    await done(p);
    p = await open(b, 'k2_fikret'); await click(p, 'Fortsetzen'); await p.waitForFunction(() => M.E.screen === 'game', null, { timeout: 5000 }); await p.waitForTimeout(9400);
    T.ck(await p.evaluate(() => !document.querySelector('#shell .sh-recap').classList.contains('on')), 'nach 9 s von selbst weg');
    await settle(p); await p.evaluate(() => M.shell.openPause()); await p.waitForFunction(() => M.shell.ctx === 'pause', null, { timeout: 3000 }); await click(p, 'Laden');
    await p.locator('#shell .card .cardmain', { hasText: 'Kapitel' }).first().click(); await p.waitForTimeout(150);
    T.ck(await p.evaluate(() => !document.querySelector('#shell .sh-recap').classList.contains('on') && /Geladen/.test((M.shell.toastNow() || {}).t || '')), 'Laden im Spiel: keine Karte, stattdessen „Rückgängig“-Meldung');
    await done(p);
    p = await open(b, 'k2_fikret', { viewport: { width: 1280, height: 800 }, hasTouch: true }); await click(p, 'Fortsetzen'); await p.waitForFunction(() => M.E.screen === 'game', null, { timeout: 5000 }); await p.waitForTimeout(150);
    const gr = await p.evaluate(() => { const r = document.getElementById('game').getBoundingClientRect(); return [r.left + r.width / 2, r.top + 30]; });
    await p.touchscreen.tap(gr[0], gr[1]); await p.waitForTimeout(80);
    T.ck(await p.evaluate(() => !document.querySelector('#shell .sh-recap').classList.contains('on')), 'ein Tipp ins Bild schließt sie');
    await done(p);

    // ---------------------------------------------------------------- B3-3 Sicherung als Datei
    T.section('Sicherung als Datei: exportieren, prüfen, einspielen');
    p = await open(b, 'k2_fikret', { viewport: { width: 1280, height: 800 }, acceptDownloads: true }, { 'mala.c1end': '1', 'mala.font': 'read' });
    await click(p, 'Spiel laden'); const lab = await p.evaluate(() => M.shell.labels());
    T.ck(lab.indexOf('Sicherung exportieren …') >= 0 && lab.indexOf('Sicherung importieren …') >= 0, 'Titel → Spiel laden: exportieren und importieren');
    const before = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^mala\./.test(k) && k !== 'mala.undo') o[k] = localStorage.getItem(k); } return o; });
    const [dl] = await Promise.all([p.waitForEvent('download'), click(p, 'Sicherung exportieren')]);
    const file = path.join(tmp, dl.suggestedFilename()); await dl.saveAs(file); const bk = JSON.parse(fs.readFileSync(file, 'utf8'));
    T.ck(/^Die-Stillen-Sicherung-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename()), 'Datei „' + dl.suggestedFilename() + '“');
    T.ck(bk.app === 'MALA' && bk.format === 1 && /^[0-9a-f]{8}$/.test(bk.sum) && bk.count === Object.keys(before).length, 'Format 1, Prüfsumme, ' + bk.count + ' Einträge');
    T.ck(JSON.stringify(bk.data) === JSON.stringify(Object.fromEntries(Object.keys(before).sort().map(k => [k, before[k]]))), 'enthält alle MALA-Einträge (Stände, Kapitelmarken, Einstellungen) unverändert');
    // alles löschen, dann über die Dateiauswahl wieder einspielen
    await p.evaluate(() => { Object.keys(localStorage).filter(k => /^mala\./.test(k)).forEach(k => localStorage.removeItem(k)); localStorage.setItem('mala.fremd', 'x'); });
    const [fc] = await Promise.all([p.waitForEvent('filechooser'), click(p, 'Sicherung importieren')]); await fc.setFiles(file);
    await p.waitForFunction(() => M.shell.current() === 'confirm', null, { timeout: 3000 });
    T.ck(await p.evaluate(() => document.activeElement && /Abbrechen/.test(document.activeElement.textContent)), 'Rückfrage „Sicherung einspielen?“ mit Fokus auf „Abbrechen“');
    T.ck(await p.evaluate(() => /ersetzt: \d+ Einträge, gespeichert heute/.test(document.querySelector('#shell').textContent)), 'Rückfrage nennt Zahl der Einträge und Datum');
    await shot(p, 'b33_einspielen');
    await click(p, 'Einspielen'); await p.waitForTimeout(150);
    const after = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^mala\./.test(k) && k !== 'mala.undo') o[k] = localStorage.getItem(k); } return o; });
    T.ck(JSON.stringify(Object.keys(after).sort().map(k => [k, after[k]])) === JSON.stringify(Object.keys(before).sort().map(k => [k, before[k]])), 'eingespielt: genau der vorige Stand, Fremdeintrag ersetzt');
    T.ck(await p.evaluate(() => M.shell.current() === 'load' && /Platz 1/.test(document.querySelector('#shell').textContent)), 'zurück in „Spiel laden“, Stände wieder da');
    // beschädigt / fremd
    const broken = JSON.stringify(Object.assign({}, bk, { data: Object.assign({}, bk.data, { 'mala.c1end': '2' }) }));
    T.ck(await p.evaluate((t) => M.shell.importText(t) === false && /beschädigt/.test(M.shell.toastNow().t) && M.shell.current() === 'load', broken), 'veränderte Datei: „beschädigt (Prüfsumme)“, nichts eingespielt');
    T.ck(await p.evaluate(() => M.shell.importText('{"hallo":1}') === false && /keine Sicherung von „Die Stillen“/.test(M.shell.toastNow().t)), 'fremde Datei: „keine Sicherung von „Die Stillen““');
    T.ck(await p.evaluate(() => M.shell.importText('kein json') === false), 'kein JSON: abgelehnt');
    // Vorschaubild aus einer Datei: nur PNG-data-URIs werden übernommen
    T.ck(await p.evaluate(() => { const k = 'mala.save.1', d = JSON.parse(localStorage.getItem(k)); d.thumb = 'x) ; background:red'; localStorage.setItem(k, JSON.stringify(d)); return M.E.readEnv(k).thumb === null; }), 'fremdes „Vorschaubild“ wird verworfen (nur PNG-data-URI)');
    await done(p);
    p = await open(b, 'k2_fikret'); await loadSlot(p); await settle(p); await p.evaluate(() => M.shell.openPause()); await p.waitForFunction(() => M.shell.ctx === 'pause', null, { timeout: 3000 }); await click(p, 'Laden');
    const lab2 = await p.evaluate(() => M.shell.labels());
    T.ck(lab2.indexOf('Sicherung exportieren …') >= 0 && lab2.indexOf('Sicherung importieren …') < 0, 'im Spiel: nur exportieren (einspielen nur vom Titelbild)');
    await done(p);

    // ---------------------------------------------------------------- B3-6 Abspann beendeter Kapitel
    T.section('Abspann beendeter Kapitel unter „Über „Die Stillen““');
    p = await open(b, null); await click(p, 'Über „Die Stillen“');
    T.ck(await p.evaluate(() => M.shell.labels().every(l => !/^Abspann/.test(l))), 'ohne beendetes Kapitel kein Abspann-Eintrag');
    await done(p);
    p = await open(b, null, null, { 'mala.c1end': '1', 'mala.c2end': '1' }); await click(p, 'Über „Die Stillen“');
    T.ck(JSON.stringify(await p.evaluate(() => M.shell.labels().filter(l => /^Abspann/.test(l)))) === JSON.stringify(['Abspann Kapitel 1', 'Abspann Kapitel 2']), 'nach Kapitel 1 und 2: „Abspann Kapitel 1“ und „… 2“');
    await click(p, 'Abspann Kapitel 2'); await p.waitForTimeout(100);
    T.ck(await p.evaluate(() => M.E.screen === 'credits' && M.E.creditLines === M.CREDITS2), 'Abspann von Kapitel 2 läuft');
    await done(p);

    // ---------------------------------------------------------------- Bos./Hrv.
    T.section('Neue Texte auf Bosnisch/Kroatisch');
    p = await open(b, 'k2_fikret', null, { 'mala.lang': 'bhs' }); await click(p, 'Učitaj igru'); const lb = await p.evaluate(() => M.shell.labels());
    T.ck(lb.indexOf('Izvezi sigurnosnu kopiju …') >= 0 && lb.indexOf('Uvezi sigurnosnu kopiju …') >= 0, 'Sicherung: „Izvezi/Uvezi sigurnosnu kopiju …“');
    const trs = await p.evaluate(() => [M.trUI('Benennen …'), M.trUI('Zuletzt'), M.trUI('Lesezeichen benennen'), M.trUI('Sicherung als Datei gespeichert (21 Einträge).'), M.trUI('Sicherung als Datei gespeichert (1 Eintrag).'),
      M.trUI('Alle Spielstände und Einstellungen in diesem Browser werden durch die Sicherung ersetzt: 3 Einträge, gespeichert danas 10:00.'), M.trUI('Esc gedrückt halten, während eine Szene läuft: Sie läuft schneller ab.')]);
    T.ck(trs[0] === 'Imenuj …' && trs[1] === 'Prethodno' && trs[2] === 'Imenuj oznaku', 'Namen und Karte übersetzt (' + trs.slice(0, 3).join(' / ') + ')');
    T.ck(/\(21 unos\)/.test(trs[3]) && /\(1 unos\)/.test(trs[4]) && /3 unosa, spremljeno danas 10:00\.$/.test(trs[5]), 'Zahlen mit Form (21 unos, 1 unos, 3 unosa)');
    T.ck(trs[6] === 'Drži Esc dok traje scena: odvija se brže.', 'Steuerung: Schnellvorlauf übersetzt');
    await done(p);
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 4).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
function M_SAFE(s) { return String(s || ''); }
