// Screenshot eines Raums (Entwicklungswerkzeug)
// node game/tools/roomshot.js --room <id> --phase <phase> --out <datei.png> [--rooms id1,id2 (isolierter Build)] [--who marko|mala|both] [--cam <x>] [--debug] [--wait <ms>]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; }, has = k => argv.indexOf(k) >= 0;
(async () => {
  const roomId = arg('--room'), phase = arg('--phase', 'c1'), out = arg('--out', 'shot.png'), who = arg('--who', 'marko'), cam = arg('--cam'), rooms = arg('--rooms');
  let html = path.join(__dirname, '..', '..', 'web', 'index.html');
  if (rooms) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mala-')); cp.execFileSync('node', [path.join(__dirname, '..', 'build.js'), '--out', dir, '--rooms', rooms], { stdio: 'inherit' }); html = path.join(dir, 'index.html'); }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto('file://' + html);
  await page.waitForTimeout(300);
  try {
    await page.evaluate(async ({ roomId, phase, who, cam, dbg }) => {
      M.TEST = true; M.DEBUG_SPOTS = dbg; M.setPhase(phase); M.GS.malaOn = (who === 'mala' || who === 'both');
      var R = M.ROOMS[roomId]; if (!R) throw new Error('Raum fehlt: ' + roomId + ' (vorhanden: ' + Object.keys(M.ROOMS).join(',') + ')');
      var st = R.start || [160, 120, 'R'];
      M.GS.pos.marko = { room: roomId, x: st[0], y: st[1], f: st[2] || 'R' };
      await M.gotoRoom(roomId, { fade: false, noEnter: true, noSave: true, x: st[0], y: st[1], f: st[2] });
      if (M.GS.malaOn) { M.API.malaJoin({ fadeIn: false }); }
      if (who === 'mala') await M.E.switchTo('mala', true);
      if (cam !== undefined && cam !== null) { R.camLock = +cam; }
    }, { roomId, phase, who, cam, dbg: has('--debug') });
  } catch (e) { errs.push('SETUP ' + e.message); }
  await page.waitForTimeout(+arg('--wait', 900));
  await page.screenshot({ path: out });
  console.log(errs.length ? errs.join('\n') : 'ok ' + out);
  await browser.close();
})();
