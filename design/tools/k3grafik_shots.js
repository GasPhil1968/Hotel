// Bilder aus Mostar (Kapitel 3) für Vorher/Nachher-Vergleiche der Grafikpunkte: ein Raum in einer Phase, Marko (und Mala) an festen
// Stellen, ohne Raumereignisse, nach einer festen Wartezeit; das Spielbild (320 × 144) wird direkt aus dem Canvas gelesen.
//   node design/tools/k3grafik_shots.js <build.html> <ausgabeordner> [szene,szene,…] [--scale 3] [--wait 2500]
// Szenen: siehe SCENES unten (id: Raum, Phase, Marko x/y/Blick, Mala, Kamera). Ergebnis: <id>.png (vergrößert ohne Glättung).
'use strict';
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const args = process.argv.slice(2); const HTML = path.resolve(args[0] || 'web/index.html'), OUT = args[1] || 'k3shots';
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SCALE = +opt('--scale', 3), WAIT = +opt('--wait', 2500);
const SCENES = {
  most_regen: { room: 'starimost', phase: 'k3_pro', mk: [150, 126, 'R'], ml: [118, 122, 'R'] },
  most_nacht: { room: 'starimost', phase: 'k3_pro_n', mk: [118, 128, 'R'], ml: [92, 124, 'R'] },
  most_tag: { room: 'starimost', phase: 'k3_d2', mk: [200, 124, 'L'], ml: [232, 120, 'L'], cam: 120 },
  kuj_tag: { room: 'kujundziluk', phase: 'k3_d2', mk: [190, 124, 'R'], ml: [160, 120, 'R'] },
  kuj_nacht: { room: 'kujundziluk', phase: 'k3_d1_n', mk: [250, 124, 'L'], ml: [282, 120, 'L'] },
  ostbus_bura: { room: 'ostbus', phase: 'k3_d1', mk: [180, 126, 'L'], ml: [214, 122, 'L'] },
  bulevar_nacht: { room: 'bulevar', phase: 'k3_d2_n', mk: [200, 128, 'R'], ml: [170, 124, 'R'] },
  skela_frost: { room: 'skela_d', phase: 'k3_fin_n', mk: [160, 124, 'R'], ml: [130, 120, 'R'] },
  podmost_tag: { room: 'podmost', phase: 'k3_d2', mk: [150, 120, 'R'], ml: [120, 116, 'R'] },
  tepa_tag: { room: 'tepa', phase: 'k3_d2', mk: [220, 126, 'R'], ml: [190, 122, 'R'] },
  koski_tag: { room: 'koski', phase: 'k3_d3', mk: [150, 124, 'R'], ml: [120, 120, 'R'] },
  herberge_regen: { room: 'herberge', phase: 'k3_pro', mk: [200, 124, 'R'], ml: [170, 120, 'R'] },
  kuj_lampe: { room: 'kujundziluk', phase: 'k3_d1_n', mk: [212, 126, 'R'], ml: [180, 122, 'R'] },
  most_lampe: { room: 'starimost', phase: 'k3_pro_n', mk: [132, 128, 'R'], ml: [70, 124, 'R'] }
};
const want = (args[2] && !args[2].startsWith('--')) ? args[2].split(',') : Object.keys(SCENES);
(async () => { fs.mkdirSync(OUT, { recursive: true }); const b = await chromium.launch(); const errs = [];
  for (const id of want) { const sc = SCENES[id]; if (!sc) { console.error('unbekannte Szene', id); continue; }
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); p.on('pageerror', e => errs.push(id + ': ' + e.message));
    await p.goto('file://' + HTML + '?intro=0'); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 });
    const ok = await p.evaluate(async (sc) => { M.setPhase(sc.phase); const G = M.GS; G.malaOn = !!sc.ml; G.flags['k3.rules'] = 2;
      const R = M.ROOMS[sc.room]; if (!R) return 'kein Raum ' + sc.room; G.rooms[sc.room] = Object.assign(R.state ? R.state(G) : {}, G.rooms[sc.room] || {});
      G.pos.marko = { room: sc.room, x: sc.mk[0], y: sc.mk[1], f: sc.mk[2] }; if (sc.ml) G.pos.mala = { room: sc.room, x: sc.ml[0], y: sc.ml[1], f: sc.ml[2] };
      await M.gotoRoom(sc.room, { fade: false, noEnter: true, noSave: true, keepPos: true, x: sc.mk[0], y: sc.mk[1], f: sc.mk[2] });
      if (sc.ml) { M.API.malaJoin({ fadeIn: false }); const ma = M.E.ACT.mala; if (ma) { ma.x = sc.ml[0]; ma.y = sc.ml[1]; ma.f = sc.ml[2]; } }
      M.E.screen = 'game'; M.E.busy = true; if (sc.cam !== undefined) { M.E.camLockShot = sc.cam; } return true; }, sc);
    if (ok !== true) { console.error(id, ok); await p.close(); continue; }
    if (sc.cam !== undefined) await p.evaluate((c) => { const r = M.E.room; r.camLock = c; }, sc.cam);
    await p.waitForTimeout(WAIT);
    const url = await p.evaluate(() => document.getElementById('game').toDataURL('image/png'));
    const raw = path.join(OUT, id + '_raw.png'); fs.writeFileSync(raw, Buffer.from(url.split(',')[1], 'base64'));
    await p.close(); }
  await b.close();
  // zuschneiden (Szene 320 × 144) und vergrößern
  const { execFileSync } = require('child_process');
  for (const id of want) { const raw = path.join(OUT, id + '_raw.png'); if (!fs.existsSync(raw)) continue;
    execFileSync('python3', ['-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB").crop((0,0,320,144))\nim=im.resize((320*int(sys.argv[3]),144*int(sys.argv[3])),Image.NEAREST)\nim.save(sys.argv[2])', raw, path.join(OUT, id + '.png'), String(SCALE)]);
    fs.unlinkSync(raw); }
  console.log(want.length + ' Szenen', errs.length ? 'JS-Fehler: ' + errs.join(' | ') : 'keine JS-Fehler'); })().catch(e => { console.error(e); process.exit(1); });
