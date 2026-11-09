// Szenenbilder für den Entwurf der Kapitelwahl (design/prototype/kapitelwahl): Titelbild und je Kapitel zwei Orte, nur die Szene (320×144),
// ohne Leisten und ohne die HTML-Schicht.   node design/tools/kapitelshots.js
'use strict';
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..', '..'), OUT = path.join(ROOT, 'design', 'prototype', 'kapitelwahl', 'img'); fs.mkdirSync(OUT, { recursive: true });
const SHOTS = [ ['k1_riva', 'riva', 'c1'], ['k1_varos', 'varos', 'pro'], ['k2_kula', 'kula', 'k2_s1'], ['k2_carsija', 'carsija', 'k2_pro'], ['k3_starimost', 'starimost', 'k3_d1'], ['k3_ostbus', 'ostbus', 'k3_pro'],
  ['k4_gleis11', 'gleis11', 'k4_d1'], ['k4_wiesn', 'wiesn', 'k4_d1'], ['k5_neboder', 'neboder5', 'k5_pro'], ['k5_bare', 'bare', 'k5_fun'] ];
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto('file://' + path.join(ROOT, 'web', 'index.html')); await page.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 20000 }); await page.waitForTimeout(1500);
  const canvasClip = async (sceneOnly) => { const r = await page.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { x: c.left, y: c.top, w: c.width, h: c.height }; });
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.w), height: Math.round(sceneOnly ? r.h * 144 / 200 : r.h) }; };
  await page.addStyleTag({ content: '#shell,.sh-toast,#bar,#subs,.mala-bar{display:none !important}' });
  await page.screenshot({ path: path.join(OUT, 'title.png'), clip: await canvasClip(false) }); console.log('title.png');
  for (const [name, room, phase] of SHOTS) {
    try {
      await page.evaluate(async ({ room, phase }) => { M.TEST = true; M.setPhase(phase); M.GS.malaOn = false; const R = M.ROOMS[room]; const st = R.start || [160, 120, 'R'];
        M.GS.rooms[room] = Object.assign(R.state ? R.state(M.GS) : {}, M.GS.rooms[room] || {}); M.GS.pos.marko = { room, x: st[0], y: st[1], f: st[2] || 'R' };
        M.E.screen = 'game'; await M.gotoRoom(room, { fade: false, noEnter: true, noSave: true, x: st[0], y: st[1], f: st[2] }); }, { room, phase });
      await page.waitForTimeout(1200); await page.screenshot({ path: path.join(OUT, name + '.png'), clip: await canvasClip(true) }); console.log(name + '.png');
    } catch (e) { console.log('FEHLER ' + name + ': ' + e.message.slice(0, 200)); }
  }
  console.log(errs.length ? errs.join('\n') : 'keine JS-Fehler'); await browser.close();
})();
