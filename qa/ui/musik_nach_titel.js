// Musik nach dem Titelbild (Korrektur vom 11.11.2026, gefunden bei den Trailer-Aufnahmen): Wurde die Titelmusik ausgeblendet und
// innerhalb von 1,7 s ein anderes Stück gestartet, zog die noch laufende Ausblend-Rampe das neue Stück auf null – es blieb stumm bis zur
// nächsten Lautstärkeänderung. Der Test hört echt mit: Audioausgang der Engine (M.audioStream) → Analyser in einem zweiten AudioContext.
//   node qa/ui/musik_nach_titel.js [--html pfad/zu/index.html]
// Gegen eine Fassung vor der Korrektur schlägt Fall B fehl (Pegel nach dem schnellen Wechsel nahe null).
'use strict';
const path = require('path'); const { chromium } = require('playwright');
const a = process.argv.slice(2), i = a.indexOf('--html');
const HTML = i >= 0 ? path.resolve(a[i + 1]) : path.join(__dirname, '..', '..', 'web', 'index.html');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + HTML); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
  const build = await p.evaluate(() => M.BUILD || '');
  await p.evaluate(() => { M.audioInit(); M.audioResume(); M.setSound(false); M.setMusic(true); M.music('title');
    const ac = new AudioContext(), src = ac.createMediaStreamSource(M.audioStream()), an = ac.createAnalyser(); an.fftSize = 2048; src.connect(an);
    window.__rms = () => { const buf = new Float32Array(an.fftSize); an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; return Math.sqrt(s / buf.length); }; });
  const level = async (ms) => { const v = []; for (let t = 0; t < ms; t += 100) { v.push(await p.evaluate(() => __rms())); await p.waitForTimeout(100); } v.sort((x, y) => x - y); return v[Math.floor(v.length * 0.75)]; };
  const db = (x) => (20 * Math.log10(x + 1e-9)).toFixed(1) + ' dBFS';
  await p.waitForTimeout(1500); const title = await level(2500);
  // Fall A: üblicher Weg – aus dem Titel direkt ein neues Stück (Ausblendung läuft zu Ende, dann setzt das Stück ein)
  await p.evaluate(() => M.music('case1')); await p.waitForTimeout(2600); const caseA = await level(2500);
  // Fall B: Titel wieder an, dann „Musik aus“ (Ausblendung beginnt) und nach 0,4 s schon das nächste Stück
  await p.evaluate(() => M.music('title')); await p.waitForTimeout(2500);
  await p.evaluate(() => M.music(null)); await p.waitForTimeout(400); await p.evaluate(() => M.music('case1')); await p.waitForTimeout(2600);
  const caseB = await level(2500); const song = await p.evaluate(() => M.currentSong());
  const res = [
    [title > 1e-3, 'Titelmusik hörbar (' + db(title) + ')'],
    [caseA > 1e-3, 'A: Titel → Stück: hörbar (' + db(caseA) + ')'],
    [song === 'case1' && caseB > Math.max(1e-3, caseA * 0.25), 'B: Titel → aus → nach 0,4 s Stück: hörbar (' + db(caseB) + ', Stück ' + song + ')'],
    [!errs.length, 'keine JS-Fehler (' + errs.length + ')'],
  ];
  console.log('Fassung', path.relative(process.cwd(), HTML), build);
  res.forEach(([ok, m]) => console.log((ok ? 'OK     ' : 'FEHLER ') + m));
  const ok = res.every(r => r[0]); console.log(ok ? 'MUSIKTEST OK' : 'MUSIKTEST FEHLGESCHLAGEN'); await b.close(); process.exitCode = ok ? 0 : 1;
})().catch(e => { console.error(e); process.exit(1); });
