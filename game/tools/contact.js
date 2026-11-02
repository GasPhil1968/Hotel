// Kontaktblatt: alle Räume in ihren Phasen auf einem Bild (Entwicklungswerkzeug)
// node game/tools/contact.js out.png [raum:phase[:mala] ...]
const { chromium } = require('playwright');
const path = require('path');
const DEFAULT = ['flat:pro', 'flat:pro_night', 'varos:pro', 'ivka:pro', 'riva:c1', 'riva:c1_night:mala', 'office:c1', 'archive:c1:mala',
  'matejuska:c1', 'shed:c1', 'sustipan:i2', 'bar:c2', 'ledana:c2', 'ledana:c2_night', 'coldroom:c2:mala', 'oldtown:c2', 'shop:c2', 'backroom:c2',
  'terminal:c2', 'riva:c3', 'palma:c3', 'palma:c3_night:mala', 'salon:c3_night', 'terminal:epi', 'map:c2'];
(async () => {
  const out = process.argv[2] || 'contact.png';
  const list = process.argv.length > 3 ? process.argv.slice(3) : DEFAULT;
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, '..', '..', 'web', 'index.html')); await page.waitForTimeout(300);
  const shots = [];
  for (const spec of list) {
    const [roomId, phase, who] = spec.split(':');
    try {
      await page.evaluate(async ({ roomId, phase, who }) => {
        M.TEST = true; M.DEBUG_SPOTS = false; M.setPhase(phase); M.GS.malaOn = !!who || /night|eve/.test(phase);
        if (M.E.switchTo && M.GS.active === 'mala') await M.E.switchTo('marko', true);
        const R = M.ROOMS[roomId]; if (!R) throw new Error('Raum fehlt ' + roomId);
        const st = R.start || [160, 120, 'R']; M.GS.pos.marko = { room: roomId, x: st[0], y: st[1], f: st[2] || 'R' };
        await M.gotoRoom(roomId, { fade: false, noEnter: true, noSave: true, x: st[0], y: st[1], f: st[2] });
        if (M.GS.malaOn && M.API.malaJoin) M.API.malaJoin({ fadeIn: false });
        if (who === 'mala') await M.E.switchTo('mala', true);
      }, { roomId, phase, who });
      await page.waitForTimeout(700);
      const b64 = await page.evaluate(() => document.getElementById('game').toDataURL('image/png').split(',')[1]);
      shots.push({ spec, b64 });
    } catch (e) { errs.push(spec + ': ' + e.message); }
  }
  // zusammensetzen im Browser
  const cols = 4, w = 320, h = 200, lab = 12;
  const W = cols * w, H = Math.ceil(shots.length / cols) * (h + lab);
  await page.setViewportSize({ width: Math.min(W, 1600), height: 400 });
  const data = await page.evaluate(async ({ shots, cols, w, h, lab, W, H }) => {
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d'); x.fillStyle = '#222'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < shots.length; i++) { const im = new Image(); im.src = 'data:image/png;base64,' + shots[i].b64; await im.decode();
      const ox = (i % cols) * w, oy = Math.floor(i / cols) * (h + lab); x.drawImage(im, 0, 0, im.width, im.height, ox, oy + lab, w, h);
      x.fillStyle = '#fff'; x.font = '10px monospace'; x.fillText(shots[i].spec, ox + 3, oy + 9); }
    return cv.toDataURL('image/png').split(',')[1];
  }, { shots, cols, w, h, lab, W, H });
  require('fs').writeFileSync(out, Buffer.from(data, 'base64'));
  await browser.close(); console.log('ok', out, shots.length, 'Bilder', errs.length ? '\nFEHLER: ' + errs.join('\n') : '');
})();
