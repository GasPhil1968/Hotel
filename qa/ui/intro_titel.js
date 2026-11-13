// Intro und Titelbilder (11.11.2026): prüft im Browser mit echter Eingabe
//  1 Automatisierung: ohne ?intro startet das Spiel direkt im Titel (navigator.webdriver), mit ?intro=1 läuft das Intro
//  2 Überspringen: ein Klick beendet das Intro sofort, der Klick löst im Titelmenü nichts aus, das Menü erscheint
//  3 durchlaufen lassen: nach etwa 29 s steht der Titel, der Hintergrund blendet auf, keine Fehler
//  4 Taste: Leertaste überspringt ebenso
//  5 Einstellungen: „Intro beim Start“ schaltet und merkt es sich (mala.intro); „Intro ansehen“ spielt es vom Titel aus
//  6 Titelbilder: bei jedem Start ein anderes – vier Starts nacheinander zeigen Split, Sarajevo, Mostar, München, dann wieder Split;
//    ?titel=mostar wählt fest; jedes Bild zeichnet sich ohne Fehler und bewegt sich (zwei Zeitpunkte unterscheiden sich)
//   node qa/ui/intro_titel.js [--html pfad/zu/index.html] [--kurz]   (--kurz: ohne den 40-s-Durchlauf)
'use strict';
const path = require('path'); const { chromium } = require('playwright');
const a = process.argv.slice(2), hi = a.indexOf('--html'), KURZ = a.includes('--kurz');
const HTML = hi >= 0 ? path.resolve(a[hi + 1]) : path.join(__dirname, '..', '..', 'web', 'index.html');
const res = []; const ck = (ok, m) => { res.push([!!ok, m]); console.log((ok ? 'OK     ' : 'FEHLER ') + m); };
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const errs = [];
  const open = async (q) => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + HTML + (q || '')); await p.waitForFunction(() => window.M && M.E && (M.E.screen === 'title' || M.E.screen === 'intro'), null, { timeout: 30000 }); return p; };
  const scr = (p) => p.evaluate(() => M.E.screen);
  const center = async (p) => { const r = await p.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return [c.left + c.width / 2, c.top + c.height * 0.35]; }); return r; };
  // 1
  let p = await open(''); ck(await scr(p) === 'title', 'ohne ?intro (Testautomatisierung): direkt der Titel'); await p.close();
  p = await open('?intro=1'); ck(await scr(p) === 'intro', 'mit ?intro=1: das Intro läuft');
  // 2
  await p.waitForTimeout(2500); const c = await center(p); await p.mouse.click(c[0], c[1]); await p.waitForTimeout(250);
  const after = await p.evaluate(() => ({ s: M.E.screen, ctx: M.shell && M.shell.ctx, cur: M.shell && M.shell.current && M.shell.current(), song: M.currentSong(), dlg: !!M.E.dlg, fade: !!M.E.titleInAt }));
  ck(after.s === 'title' && after.ctx === 'title' && after.cur === 'main', 'Klick überspringt: Titel mit Hauptmenü ' + JSON.stringify(after));
  ck(after.song === 'title', 'Musik: das Titelstück');
  await p.waitForTimeout(1800); const shown = await p.evaluate(() => { const m = document.querySelector('#shell .tmenu'); if (!m) return null; const st = getComputedStyle(m); return { op: +st.opacity, n: m.querySelectorAll('button').length }; });
  ck(shown && shown.op > 0.95 && shown.n >= 4, 'Menü nach dem Aufblenden sichtbar ' + JSON.stringify(shown)); await p.close();
  // 3
  if (!KURZ) { p = await open('?intro=1'); const t0 = Date.now(); await p.waitForFunction(() => M.E.screen === 'title', null, { timeout: 60000 }); const dur = (Date.now() - t0) / 1000;
    ck(dur > 37 && dur < 46, 'ohne Eingabe: nach ' + dur.toFixed(1) + ' s der Titel'); await p.waitForTimeout(1600);
    ck(await p.evaluate(() => !M.E.titleInAt && M.shell.ctx === 'title'), 'Hintergrund aufgeblendet, Menü offen'); await p.close(); }
  // 4
  p = await open('?intro=1'); await p.waitForTimeout(1200); await p.keyboard.press(' '); await p.waitForTimeout(200); ck(await scr(p) === 'title', 'Leertaste überspringt'); await p.close();
  // 5
  p = await open(''); await p.click('text=Einstellungen'); await p.waitForTimeout(300);
  const has = await p.evaluate(() => { const t = document.querySelector('#shell').innerText; return { start: /Intro beim Start/.test(t), see: /ansehen/.test(t) }; });
  ck(has.start && has.see, 'Einstellungen: „Intro beim Start“ und „Intro ansehen“ ' + JSON.stringify(has));
  let toggled = false; try { await p.locator('#shell [role=group][aria-label="Intro beim Start"] button[data-v="0"]').click({ timeout: 3000 }); toggled = true; } catch (e) { }
  await p.waitForTimeout(200); const v = await p.evaluate(() => localStorage.getItem('mala.intro'));
  ck(toggled && v === '0', '„Intro beim Start: aus“ gespeichert (mala.intro=' + v + ')');
  await p.evaluate(() => localStorage.setItem('mala.intro', '1'));
  await p.locator('#shell [role=group][aria-label="Intro"] button').first().click(); await p.waitForTimeout(300); ck(await scr(p) === 'intro', '„Intro ansehen“ startet das Intro');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); ck(await scr(p) === 'title', 'Esc beendet es wieder'); await p.close();
  // 6
  await ctx.clearCookies(); const seq = [];
  for (let i = 0; i < 5; i++) { const q = await open(i === 0 ? '?reset' : ''); if (i === 0) { await q.evaluate(() => localStorage.removeItem('mala.titel')); await q.reload(); await q.waitForFunction(() => window.M && M.E && M.E.screen === 'title'); }
    seq.push(await q.evaluate(() => M.titleDef().id)); await q.close(); }
  ck(seq.join(',') === 'split,sarajevo,mostar,muenchen,split', 'fünf Starts nacheinander: ' + seq.join(' → '));
  p = await open('?titel=mostar'); ck(await p.evaluate(() => M.titleDef().id) === 'mostar', '?titel=mostar wählt fest');
  const moves = await p.evaluate(() => (M.TITLES || []).map(def => { M.titleIndex = M.TITLES.indexOf(def); M.__titleT = 1; const a = M.renderFrame().d.slice(); M.__titleT = 4.5; const bb = M.renderFrame().d; M.__titleT = null; let n = 0; for (let i = 0; i < a.length; i++) if (a[i] !== bb[i]) n++; return def.id + ':' + n; }));
  ck(moves.every(m => +m.split(':')[1] > 300), 'alle vier bewegen sich (geänderte Pixel zwischen 1 s und 4,5 s): ' + moves.join(', ')); await p.close();
  ck(!errs.length, 'keine JS-Fehler (' + errs.length + (errs.length ? ': ' + errs[0] : '') + ')');
  await b.close(); const ok = res.every(r => r[0]); console.log(ok ? 'INTRO/TITEL OK' : 'INTRO/TITEL FEHLGESCHLAGEN'); process.exitCode = ok ? 0 : 1;
})().catch(e => { console.error(e); process.exit(1); });
