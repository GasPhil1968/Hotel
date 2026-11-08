// Browser-Test Oberfläche, Phase 2 (UI-Konzept E/F): HTML-Schicht für Titel, Kapitelwahl, Laden, Speichern (Lesezeichen), Einstellungen,
// Über MALA, Steuerung, Pause, Bestätigungen und Kapitelende; Spielstand-Modell; Kapitelsperre; Leseschrift.
// Bedienung über echte Klicks/Tasten auf die HTML-Schicht; der Spielzustand wird nur gelesen (und für Fehlerfälle präpariert).
//   node qa/ui/phase2.js [--shots <ordner>]        (Exitcode 1 bei Fehlern)
'use strict';
const path = require('path'), fs = require('fs');
const { pw, STATES, checker, open, settle, loadSlot } = require('./lib');
const a = process.argv.slice(2), SHOTS = a.indexOf('--shots') >= 0 ? path.resolve(a[a.indexOf('--shots') + 1]) : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const ST = (n) => STATES.find(s => s.name === n).storage;
const sh = (p) => p.evaluate(() => ({ ctx: M.shell.ctx, cur: M.shell.current(), labels: M.shell.labels(), scr: M.E.screen }));
async function click(p, text, opt) { const loc = p.locator('#shell').locator('button', { hasText: text }).first(); await loc.waitFor({ state: 'visible', timeout: (opt && opt.timeout) || 4000 }); await loc.click(); await p.waitForTimeout(80); }
async function shot(p, name) { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, name + '.png') }); }
const DEV = { desktop: { viewport: { width: 1280, height: 800 } }, tablet: { viewport: { width: 1080, height: 810 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, phone: { viewport: { width: 750, height: 342 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } };
(async () => {
  const T = checker('Phase 2'); const b = await pw.chromium.launch(); const errs = []; const done = async (p) => { errs.push(...p.errs); await p.context().close(); };
  try {
    // ---------------------------------------------------------------- F1, F20: Erststart, Kapitelsperre, Schriften
    T.section('Erststart, Kapitelsperre (leer)');
    let p = await open(b, null); let s = await sh(p);
    T.ck(s.ctx === 'title' && s.cur === 'main', 'Titel liegt in der HTML-Schicht');
    T.ck(s.labels.indexOf('Fortsetzen') < 0 && s.labels[0] === 'Neues Spiel', 'ohne Spielstand kein „Fortsetzen“, „Neues Spiel“ zuerst (' + s.labels.join(', ') + ')');
    T.ck(await p.evaluate(() => document.activeElement && /Neues Spiel/.test(document.activeElement.textContent)), 'Fokus liegt auf „Neues Spiel“');
    T.ck(await p.evaluate(() => M.journeyLine() === 'Split'), 'Unterzeile „Split“');
    T.ck(await p.evaluate(async () => { const a = await document.fonts.load('20px "MALA Pixel"', 'MALA'), b = await document.fonts.load('20px "Atkinson Hyperlegible Next"', 'đĐ'); return a.length > 0 && b.length > 0; }), 'beide Schriften eingebettet und ladbar ohne Netz (data-URI)');
    T.ck(await p.evaluate(() => getComputedStyle(document.querySelector('#shell .mi')).fontFamily.indexOf('MALA Pixel') >= 0), 'Menüs in MALA Pixel');
    T.ck(await p.evaluate(() => !!document.querySelector('#shell .chip') || M.audioRunning()), 'Ton-Marke im Titel, solange der Ton noch nicht freigegeben ist (D1)');
    await shot(p, 'f1_titel_leer');
    await click(p, 'Neues Spiel'); await p.waitForFunction(() => M.E.screen !== 'title', null, { timeout: 5000 });
    T.ck(await p.evaluate(() => M.E.slot() === 1 && M.shell.ctx === null), 'nur Kapitel 1 erreicht: „Neues Spiel“ startet sofort auf Platz 1');
    await done(p);

    T.section('Kapitelsperre nach Kapitel 1 (k2_start: c1end gesetzt)');
    p = await open(b, 'k2_start'); await click(p, 'Neues Spiel'); s = await sh(p);
    T.ck(s.cur === 'chapters', 'Kapitelwahl erscheint, sobald zwei Kapitel erreicht sind');
    const ch = await p.evaluate(() => [...document.querySelectorAll('#shell .mi')].map(e => ({ t: e.textContent.trim(), dis: e.getAttribute('aria-disabled') === 'true' })));
    T.ck(ch.some(c => /^Kapitel 1 · Split/.test(c.t) && !c.dis) && ch.some(c => /^Kapitel 2 · Sarajevo/.test(c.t) && !c.dis), 'Kapitel 1 und 2 mit Ort startbar');
    T.ck(ch.some(c => /^Kapitel 3nach Kapitel 2$/.test(c.t.replace(/\s+/g, ' ').replace(' nach', 'nach')) && c.dis) || ch.some(c => /^Kapitel 3/.test(c.t) && c.dis && !/Mostar/.test(c.t)), 'Kapitel 3 gesperrt, ohne Ortsnamen, mit Grund');
    T.ck(ch.some(c => /^Kapitel 5/.test(c.t) && c.dis && /noch nicht erschienen/.test(c.t) && !/Sarajevo/.test(c.t)), 'Kapitel 5 „noch nicht erschienen“, ohne Ort');
    await shot(p, 'f20_kapitelwahl');
    await p.keyboard.press('Escape'); s = await sh(p); T.ck(s.cur === 'main', 'Esc führt aus der Kapitelwahl zurück');
    T.ck(await p.evaluate(() => /Neues Spiel/.test(document.activeElement.textContent)), 'Fokus danach auf dem auslösenden Eintrag (F11)');
    await click(p, 'Spiel laden'); const pr = await p.evaluate(() => [...document.querySelectorAll('#shell .card b')].map(e => e.textContent));
    T.ck(pr.some(t => /Sarajevo: vor dem Ankaufbuch/.test(t)) && pr.some(t => /Ivkas Wahrheit/.test(t)), 'Beispielstände: Kapitel-2-Stand nach c1end sichtbar');
    await shot(p, 'f7_laden_titel');
    await done(p);

    T.section('Sperre ohne Marken; ?kapitel=alle; Kapitel 5 nach c4end');
    p = await open(b, null, {}, { 'mala.save.1': ST('k3_start')['mala.save.1'] });
    s = await sh(p); T.ck(s.labels[0] === 'Fortsetzen', 'Stand aus Kapitel 3 ohne Marken: „Fortsetzen“ angeboten');
    await click(p, 'Spiel laden'); const pr2 = await p.evaluate(() => [...document.querySelectorAll('#shell .card b')].map(e => e.textContent));
    T.ck(!pr2.some(t => /Ankaufbuch/.test(t)), 'Kapitel-2-Beispielstand ohne c1end verborgen');
    await click(p, 'Kapitel 3'); await p.waitForFunction(() => M.E.screen === 'game', null, { timeout: 8000 }).catch(() => {});
    T.ck(await p.evaluate(() => M.E.screen === 'game' && /^k3/.test(M.GS.phase)), 'Laden ist nie gesperrt: Stand aus Kapitel 3 geladen');
    await done(p);
    process.env.MALA_QUERY = '?kapitel=alle'; p = await open(b, null); delete process.env.MALA_QUERY;
    await click(p, 'Neues Spiel'); const all = await p.evaluate(() => [...document.querySelectorAll('#shell .mi')].map(e => ({ t: e.textContent.trim(), dis: e.getAttribute('aria-disabled') === 'true' })));
    T.ck(all.filter(c => /^Kapitel [1-4] ·/.test(c.t) && !c.dis).length === 4, '?kapitel=alle: Kapitel 1–4 startbar');
    T.ck(await p.evaluate(() => !localStorage.getItem('mala.c1end') && !localStorage.getItem('mala.c3end')), '… ohne Marken zu schreiben');
    await done(p);
    p = await open(b, 'k4_heim', {}, { 'mala.c4end': '{"at":1}' }); await click(p, 'Neues Spiel');
    T.ck((await p.evaluate(() => [...document.querySelectorAll('#shell .mi')].map(e => e.textContent))).some(t => /Kapitel 5 · Sarajevo/.test(t) && /noch nicht erschienen/.test(t)), 'nach c4end: „Kapitel 5 · Sarajevo – noch nicht erschienen“');
    await done(p);

    // ---------------------------------------------------------------- F2, F3: neues Spiel mit belegten Plätzen
    T.section('Neues Spiel mit belegten Plätzen');
    const sv = ST('k2_limbo')['mala.save.1'];
    p = await open(b, 'k2_limbo'); await click(p, 'Neues Spiel'); await click(p, 'Kapitel 1 · Split'); await p.waitForFunction(() => M.E.screen !== 'title', null, { timeout: 5000 });
    T.ck(await p.evaluate((sv) => M.E.slot() === 2 && localStorage.getItem('mala.save.1') === sv, sv), 'ein Platz belegt: startet auf Platz 2 ohne Rückfrage, Platz 1 unverändert');
    await done(p);
    p = await open(b, 'k2_limbo', {}, { 'mala.save.2': sv, 'mala.save.3': sv }); await click(p, 'Neues Spiel'); await click(p, 'Kapitel 1 · Split'); s = await sh(p);
    T.ck(s.cur === 'slots', 'alle drei belegt: Platzwahl');
    await click(p, 'Platz 2'); s = await sh(p); T.ck(s.cur === 'confirm', 'belegter Platz: Bestätigung');
    T.ck(await p.evaluate(() => document.activeElement && document.activeElement.textContent === 'Abbrechen'), 'Fokus auf „Abbrechen“');
    await shot(p, 'f3_bestaetigung');
    await p.keyboard.press('Escape'); s = await sh(p); T.ck(s.cur === 'slots' && await p.evaluate((sv) => localStorage.getItem('mala.save.2') === sv, sv), 'Esc bricht ab, Platz 2 unverändert');
    await click(p, 'Platz 2'); await click(p, 'Überschreiben'); await p.waitForFunction(() => M.E.screen !== 'title', null, { timeout: 5000 });
    T.ck(await p.evaluate(() => M.E.slot() === 2), 'nach „Überschreiben“ startet Kapitel 1 auf Platz 2');
    await done(p);

    // ---------------------------------------------------------------- F4–F9: Fortsetzen, Lesezeichen, Fehlerfälle, Rückgängig
    T.section('Fortsetzen, Lesezeichen, Fehlerfälle');
    p = await open(b, 'k2_limbo'); await click(p, 'Fortsetzen'); await settle(p);
    T.ck(await p.evaluate(() => M.E.screen === 'game' && M.E.room.id === 'vratnik'), 'Fortsetzen lädt mit einem Tipp (Vratnik)');
    await p.keyboard.press('Escape'); s = await sh(p); T.ck(s.ctx === 'pause' && s.labels.join('|') === 'Weiterspielen|Speichern|Laden|Einstellungen|Hinweise …|Steuerung|Zum Titelbild', 'Pause mit sieben Einträgen (' + s.labels.join(', ') + ')');
    await click(p, 'Einstellungen'); await p.evaluate(() => history.back()); await p.waitForTimeout(250); s = await sh(p); T.ck(s.ctx === 'pause' && s.cur === 'pause', 'Zurück-Taste des Geräts: eine Ebene zurück (Einstellungen → Pause)');
    await p.evaluate(() => history.back()); await p.waitForTimeout(250); s = await sh(p); T.ck(s.ctx === null && await p.evaluate(() => !M.E.menu), 'Zurück-Taste schließt die Pause');
    await p.keyboard.press('Escape'); s = await sh(p);
    T.ck(await p.evaluate(() => M.E.paused()), 'Spielzeit und Abläufe stehen in der Pause');
    await shot(p, 'd4_pause');
    await click(p, 'Speichern'); s = await sh(p); T.ck(s.cur === 'save', 'Speichern-Seite');
    await shot(p, 'd6_speichern');
    await click(p, 'Hier speichern'); const m1 = await p.evaluate(() => localStorage.getItem('mala.mark.1.1'));
    const tst = await p.evaluate(() => { const t = M.shell.toastNow(); return t ? t.t : null; });
    T.ck(!!m1 && /Gespeichert ✓ Lesezeichen 1/.test(tst || ''), 'Lesezeichen 1 gespeichert, Rückmeldung nach dem Schreiben (' + tst + ')');
    const thumbOk = await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('mala.mark.1.1')); return !!(d.thumb && /^data:image\/png/.test(d.thumb) && d.meta && d.meta.roomName && d.sv === 2); });
    T.ck(thumbOk, 'Lesezeichen mit Vorschaubild, Ort und Version');
    await p.evaluate(() => { for (let i = 0; i < 10; i++) M.E.saveGame(); });
    T.ck(await p.evaluate((m) => localStorage.getItem('mala.mark.1.1') === m, m1), 'zehn automatische Speicherungen danach: Lesezeichen unverändert (F6)');
    await click(p, 'Kapitel 2'); s = await sh(p); T.ck(s.cur === 'confirm', 'belegtes Lesezeichen: Bestätigung mit Bisher/Neu');
    await p.keyboard.press('Escape');
    // F7: Speicherfehler
    await p.evaluate(() => { const o = Storage.prototype.setItem; window.__setItem = o; Storage.prototype.setItem = function (k, v) { if (/^mala\.mark\./.test(k)) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; } return o.call(this, k, v); }; });
    await click(p, 'Hier speichern'); const qt = await p.evaluate(() => { const t = M.shell.toastNow(); return t ? t.t : ''; });
    T.ck(/Browser-Speicher ist voll/.test(qt) && await p.evaluate(() => !localStorage.getItem('mala.mark.1.2')), 'Speicher voll: eigene Meldung, nichts geschrieben (F7)');
    await p.evaluate(() => { Storage.prototype.setItem = window.__setItem; });
    await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); s = await sh(p); T.ck(s.ctx === null && await p.evaluate(() => !M.E.menu && !M.E.paused()), 'Esc, Esc: zurück ins Spiel');
    // F9: Laden mit Rückgängig
    await p.evaluate(() => { M.TA.exit ? 0 : 0; }); const room0 = await p.evaluate(() => M.E.room.id);
    await p.keyboard.press('Escape'); await click(p, 'Laden'); await click(p, 'Lesezeichen 1');
    await settle(p); const ut = await p.evaluate(() => { const t = M.shell.toastNow(); return t ? { t: t.t, act: !!t.act } : null; });
    T.ck(ut && ut.act && /Geladen/.test(ut.t), '„Rückgängig“ nach dem Laden angeboten (F9)');
    await p.locator('#shell .sh-toast button').click(); await settle(p);
    T.ck(await p.evaluate((r) => M.E.room.id === r, room0), 'Rückgängig stellt den Stand vor dem Laden wieder her');
    // F8: beschädigt / inkompatibel
    await p.evaluate(() => { localStorage.setItem('mala.mark.1.2', '{kaputt'); localStorage.setItem('mala.mark.1.3', JSON.stringify({ sv: 99, GS: {}, at: Date.now() })); });
    await p.keyboard.press('Escape'); await click(p, 'Laden');
    const cards = await p.evaluate(() => [...document.querySelectorAll('#shell .card')].map(c => ({ t: c.textContent, btn: !!c.querySelector('button.cardmain') })));
    T.ck(cards.some(c => /Beschädigt/.test(c.t) && !c.btn) && cards.some(c => /Inkompatibel/.test(c.t) && !c.btn), 'beschädigt und inkompatibel beschriftet, nicht ladbar (F8)');
    await shot(p, 'd7_laden_pause');
    await p.keyboard.press('Escape'); await click(p, 'Zum Titelbild'); s = await sh(p);
    T.ck(s.ctx === 'title' && /Gespeichert – Platz 1/.test(await p.evaluate(() => (M.shell.toastNow() || {}).t || '')), '„Zum Titelbild“: Meldung „Gespeichert – Platz 1“');
    await click(p, 'Spiel laden'); const del = await p.locator('#shell [data-del]').count(); T.ck(del >= 3, 'im Titel: „Löschen …“ an jedem Stand');
    const nb = await p.evaluate(() => localStorage.getItem('mala.mark.1.2') !== null);
    await p.locator('#shell .card', { hasText: 'Beschädigt' }).locator('[data-del]').click(); await click(p, 'Löschen');
    T.ck(nb && await p.evaluate(() => localStorage.getItem('mala.mark.1.2') === null), 'beschädigter Stand nach Bestätigung gelöscht');
    await done(p);

    T.section('Kapitelende-Stand (F5)');
    p = await open(b, null, {}, { 'mala.c1end': '{"at":1,"playMs":13200000}', 'mala.save.1': JSON.stringify({ sv: 2, kind: 'chapterEnd', chapter: 1, next: 2, at: Date.now(), playMs: 13200000 }) });
    s = await sh(p); T.ck(s.labels[0] === 'Fortsetzen', 'Kapitelende-Stand: „Fortsetzen“');
    await click(p, 'Fortsetzen'); s = await sh(p); T.ck(s.cur === 'next' && s.labels.some(l => /Weiter mit Kapitel 2/.test(l)), 'Fortsetzen → Weiter-Karte „Weiter mit Kapitel 2“');
    T.ck(await p.evaluate(() => /Ende des ersten Kapitels/.test(document.querySelector('#shell').textContent) && /3 Std\. 40 Min\./.test(document.querySelector('#shell').textContent)), 'Karte nennt Kapitel und Spielzeit');
    await shot(p, 'd3_kapitelende');
    await click(p, 'Weiter mit Kapitel 2'); await p.waitForFunction(() => M.E.screen !== 'title', null, { timeout: 5000 });
    T.ck(await p.evaluate(() => M.E.slot() === 1), 'Kapitel 2 startet auf demselben Platz');
    await done(p);

    // ---------------------------------------------------------------- Einstellungen, Über MALA, Steuerung, F12, F21
    T.section('Einstellungen, Über, Steuerung');
    p = await open(b, 'k4_heim'); await click(p, 'Einstellungen'); await shot(p, 'd5_einstellungen');
    await click(p, 'Lesbar'); T.ck(await p.evaluate(() => localStorage.getItem('mala.font') === 'read' && getComputedStyle(document.querySelector('#shell .lbl')).fontFamily.indexOf('Atkinson') >= 0 && getComputedStyle(document.querySelector('#shell h3')).fontFamily.indexOf('MALA Pixel') >= 0), '„Schrift: Lesbar“: Menütexte in Atkinson Hyperlegible Next, Überschrift bleibt MALA Pixel (F21)');
    await click(p, 'groß'); T.ck(await p.evaluate(() => localStorage.getItem('mala.textsize') === '1' && document.getElementById('shell').classList.contains('sz1')), 'Textgröße „groß“ gespeichert und angewandt');
    await shot(p, 'd5_einstellungen_lesbar_gross');
    await click(p, 'Nachdenken'); T.ck(await p.evaluate(() => M.E.nbStyle() === 'think'), 'Notizbuch-Ansicht umgestellt');
    await click(p, 'schnell'); T.ck(await p.evaluate(() => M.E.textSpeed() === 2), 'Tempo „schnell“');
    await p.locator('#shell input[type=range]').first().fill('40'); T.ck(await p.evaluate(() => Math.abs(M.volume('mus') - 0.4) < 0.01 && localStorage.getItem('mala.vol.mus') === '0.4'), 'Musik-Regler 40 % gespeichert');
    const ov = await p.evaluate(() => [...document.querySelectorAll('#shell .mi,#shell .lbl,#shell .segp button')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim().slice(0, 30)));
    T.ck(ov.length === 0, 'große Schrift: nichts abgeschnitten' + (ov.length ? ' – zu breit: ' + ov.join(' | ') : ''));
    await click(p, 'Pixel'); await click(p, 'normal'); await p.keyboard.press('Escape');
    await click(p, 'Über MALA'); const ab = await p.evaluate(() => document.querySelector('#shell').textContent);
    T.ck(/Abspann Kapitel 3/.test(ab) && !/Mitwirkende/.test(ab), 'Über MALA: Abspann beendeter Kapitel, kein Eintrag „Mitwirkende“');
    await shot(p, 'd16_ueber');
    await p.keyboard.press('Escape');
    const n0 = await p.evaluate(() => document.querySelectorAll('#shell, #shell *').length);
    for (let i = 0; i < 25; i++) { await click(p, 'Einstellungen'); await p.keyboard.press('Escape'); }
    const n1 = await p.evaluate(() => document.querySelectorAll('#shell, #shell *').length);
    T.ck(n1 === n0 && await p.evaluate(() => document.querySelectorAll('#shell').length === 1), 'Menüs 25× geöffnet/geschlossen: keine wachsenden Knoten (F12)');
    await done(p);

    // ---------------------------------------------------------------- F15: Tippflächen ≥ 44 CSS-px auf drei Geräten
    T.section('Tippflächen der HTML-Schicht');
    for (const dev of ['phone', 'tablet', 'desktop']) {
      p = await open(b, 'k2_limbo', DEV[dev]); await loadSlot(p); await p.evaluate(() => M.key('Escape')); await p.waitForTimeout(120);
      const sizes = []; for (const scr of [null, 'Einstellungen', 'Laden']) { if (scr) { await click(p, scr); } sizes.push(...await p.evaluate(() => [...document.querySelectorAll('#shell .mi:not([aria-disabled="true"]), #shell .btn, #shell .segp button, #shell .cardmain, #shell input[type=range]')].filter(e => e.offsetParent).map(e => Math.round(e.getBoundingClientRect().height)))); if (scr) await p.keyboard.press('Escape'); }
      const min = Math.min(...sizes); T.ck(min >= 44, dev + ': kleinste Tippfläche ' + min + ' CSS-px (' + sizes.length + ' Elemente)');
      if (dev === 'phone') { const fits = await p.evaluate(() => { const r = document.querySelector('#shell .panel').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }); T.ck(fits, 'Telefon: Pause zweispaltig ohne Scrollen im Bild'); await shot(p, 'phone_pause'); }
      await done(p); }

    // ---------------------------------------------------------------- Pause während einer Szene
    T.section('Pause während einer Szene');
    p = await open(b, 'k2_limbo'); await loadSlot(p); await p.evaluate(() => { M.E.busy = true; M.key('Escape'); }); await p.waitForTimeout(120);
    const it = await p.evaluate(() => M.shell.items()); const sp = it.find(x => x.label === 'Speichern'), hi = it.find(x => x.label === 'Hinweise …');
    T.ck(sp && sp.dis && hi && hi.dis, '„Speichern“ und „Hinweise“ gesperrt …');
    T.ck(await p.evaluate(() => /nach der Szene/.test(document.querySelector('#shell').textContent)), '… mit Grund „nach der Szene“');
    await p.evaluate(() => { M.E.busy = false; }); await done(p);
  } catch (e) { T.ck(false, 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 4).join(' | ')); }
  T.ck(errs.length === 0, 'keine Skriptfehler in der Seite' + (errs.length ? ': ' + [...new Set(errs)].slice(0, 3).join(' | ') : ''));
  await b.close(); console.log('\n' + (T.n - T.fails) + '/' + T.n + ' bestanden'); process.exitCode = T.fails ? 1 : 0;
})();
