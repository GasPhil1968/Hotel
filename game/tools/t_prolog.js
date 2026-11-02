const { open } = require('./driver');
const SP = process.argv[2] || '/tmp';
(async () => {
  const D = await open({ turbo: 12 });
  try {
    await D.ev(() => { M.E.setSlot(1); M.E.newGame(); });
    await D.drain();
    let s = await D.st(); console.log('nach Start', s.room, s.phase);
    await D.shot(SP + '/p1.png');
    await D.act('use', 'answer'); await D.drain();
    console.log('Notizen', (await D.st()).notes);
    await D.act('take', 'dzezva'); await D.act('use', 'sink', 'dzezva'); await D.act('use', 'stove', 'dzezvaW');
    console.log('Kaffee', await D.flag('pro.coffee'));
    await D.act('take', 'photo'); await D.shot(SP + '/p2.png'); await D.drain();
    await D.ev(() => M.E.openNotes()); await D.page.waitForTimeout(300); await D.shot(SP + '/p3.png'); await D.close(null);
    await D.exit('door'); await D.drain();
    s = await D.st(); console.log('nach Tür', s.room);
    await D.shot(SP + '/p4.png');
  } catch (e) { console.log('FEHLER', e.message); await D.shot(SP + '/err.png'); }
  console.log(D.errors.slice(0, 5).join('\n') || 'keine JS-Fehler');
  await D.close2();
})();
