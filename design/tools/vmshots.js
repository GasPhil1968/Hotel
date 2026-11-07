// Kapitelübergänge (Abspann, Titel danach, Kapitelkarten) aus dem verketteten Durchlauf K1→K4: Produktionsskript in der Node-VM,
// Bilder mit der Zeichenroutine des Spiels (320×200, unskaliert). Kein Browser – nur für Zustände, die im Browser aufwendig zu erreichen sind.
//   node design/tools/vmshots.js
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..'); const OUT = path.join(ROOT, 'design', 'evidence', 'vm'); fs.mkdirSync(OUT, { recursive: true });
const { open } = require(path.join(ROOT, 'qa', 'vmdriver')); const C = require(path.join(ROOT, 'qa', 'lib', 'common'));
(async () => {
  const D = await open({ seed: 1, render: 'full' }); const log = [];
  await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; });
  const snap = async (name) => { const f = name + '.png'; await D.shot(path.join(OUT, f)); const s = await D.ev(() => ({ scr: M.E.screen, phase: M.GS && M.GS.phase, title: M.E.screen === 'title' ? M.titleLabels() : null, ov: M.E.overlay && M.E.overlay.kind })); log.push(Object.assign({ file: f }, s)); };
  await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
  for (let ch = 1; ch <= 4; ch++) {
    // Kapitelanfang: Karte(n) und erste Sekunden
    for (let k = 0; k < 6; k++) { await snap('k' + ch + '_start_' + k); await D.page.waitForTimeout(1200); }
    const r = await C.runPath({ 1: 'walkthrough', 2: 'walkthrough2', 3: 'walkthrough3', 4: 'walkthrough4' }[ch], D, {});
    if (!r.ok) { console.log('K' + ch + ' nicht beendet: ' + r.err); break; }
    // Abspann bis Titelbild
    for (let k = 0; k < 90; k++) { const s = await D.ev(() => M.E.screen); if (k % 3 === 0 || s === 'title') await snap('k' + ch + '_ende_' + String(k).padStart(2, '0') + '_' + s); if (s === 'title') break; await D.page.waitForTimeout(2000); }
    if (ch < 4) { await C.waitTitleNext(D); await C.tapTitle(D, 'Weiter mit Kapitel ' + (ch + 1)); }
  }
  fs.writeFileSync(path.join(OUT, 'vmshots.json'), JSON.stringify(log, null, 1)); console.log('Bilder: ' + log.length);
})().catch(e => { console.error(e); process.exit(1); });
