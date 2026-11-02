const { open } = require('./driver');
const SP = process.argv[2] || '/tmp';
(async () => {
  const D = await open({ turbo: 12 });
  const log = (...a) => console.log(new Date().toISOString().slice(17, 23), ...a);
  const poll = async (n) => { for (let i = 0; i < n; i++) { const s = await Promise.race([D.st(), new Promise(r => setTimeout(() => r('HANG'), 2000))]); log(typeof s === 'string' ? s : JSON.stringify(s).slice(0, 160)); if (s === 'HANG') return false; await D.page.waitForTimeout(150); } return true; };
  try {
    await D.ev(() => { M.E.setSlot(1); M.E.newGame(); }); await D.drain(); log('start');
    await D.act('use', 'answer'); await D.drain(); log('answer');
    await D.act('take', 'dzezva'); await D.act('use', 'sink', 'dzezva'); await D.act('use', 'stove', 'dzezvaW'); log('coffee', await D.flag('pro.coffee')); await D.act('take', 'photo'); log('photo'); await Promise.race([D.shot(SP + '/p2.png'), new Promise(r => setTimeout(() => r('SHOTHANG'), 5000))]).then(v => log('shot', v || 'ok'));
    await D.drain(); log('drained');
    await D.ev(() => { M.E.openNotes(); }); log('notes opened'); if (!await poll(4)) throw new Error('hang in notes');
    await Promise.race([D.shot(SP + '/p3.png'), new Promise(r => setTimeout(() => r('SHOTHANG'), 5000))]).then(v => log('shot3', v || 'ok'));
    await D.ev(() => M.TA.closeOverlay(null)); log('closed'); if (!await poll(3)) throw new Error('hang after close');
    await D.ev(() => M.TA.exit('door')); log('exit sent'); if (!await poll(16)) throw new Error('hang in exit'); await Promise.race([D.shot(SP + '/p4.png'), new Promise(r => setTimeout(() => r('SHOTHANG'), 5000))]).then(v => log('shot4', v || 'ok'));
  } catch (e) { log('FEHLER', e.message); }
  log(D.errors.slice(0, 5).join('\n') || 'keine JS-Fehler');
  await D.close2();
})();
