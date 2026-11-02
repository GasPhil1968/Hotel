// Screenshots der Oberfläche: Titel, Notizbuch, Tipp, Nachhall, Rätsel, Gespräch
const { open } = require('./driver');
const OUT = process.argv[2] || '/tmp';
(async () => {
  const D = await open({ turbo: 1 });
  await D.page.waitForTimeout(800); await D.ev(() => { M.TEST = false; }); await D.page.waitForTimeout(600); await D.shot(OUT + '/ui_title.png');
  await D.ev(async () => { M.TEST = true; M.setPhase('c1_night'); M.GS.malaOn = true; M.GS.pos.marko = { room: 'riva', x: 540, y: 116, f: 'R' };
    await M.gotoRoom('riva', { fade: false, noEnter: true, noSave: true }); M.API.malaJoin({ fadeIn: false });
    ['pro_auftrag', 'c1_boat7', 'c1_ferry', 'c1_ankica', 'c1_capsized', 'c1_rescued', 'c1_words', 'c1_letter', 'm_tin'].forEach(function (n) { M.GS.notes.push(n); });
    M.GS.inv = ['postcard', 'photo1', 'gloves', 'letter_t', 'crowbar']; M.E.openNotes(); });
  await D.page.waitForTimeout(500); await D.shot(OUT + '/ui_notes.png');
  await D.ev(() => { M.E.closeOverlay(null); M.API.memory({ title: 'Nachhall – der Seesack', draw: M.mem.storm, tint: 'ghost', lines: ['Nacht. Schwarzes Wasser. Die Bura reißt die Kämme von den Wellen.', 'Zwei Jungen am umgedrehten Kiel.'] }); });
  await D.page.waitForTimeout(1500); await D.ev(() => { M.E.overlay.step = 1; }); await D.page.waitForTimeout(200); await D.shot(OUT + '/ui_memory.png');
  await D.ev(() => { M.E.closeOverlay(null); M.API.puzzle({ title: 'Brunos Satz übersetzen', hint: 'Bruno: „Ljerka … perdonami … ich habe … tvoje pismo … versteckt …“', slots: [['Ljerka,', 'Danica,'], ['verzeih mir.', 'vergiss mich.'], ['Ich habe deinen Brief aus Zagreb versteckt,', 'x'], ['weil ich Angst hatte, allein zu sein.', 'y'], ['Spiel wieder.', 'z']] }); });
  await D.page.waitForTimeout(400); await D.shot(OUT + '/ui_puzzle.png');
  await D.ev(() => { M.E.closeOverlay(null); M.API.doc({ style: 'postcard', title: 'Supetar, 18.12.1984', w: 240, lines: ['Draga mama,', 'dolazim 22. s brodom u sedam.', 'Dinko ide sa mnom.', 'Napravi fritule. Donosim ti nešto.', 'Tvoj Tonći'] }); });
  await D.page.waitForTimeout(400); await D.shot(OUT + '/ui_postcard.png');
  await D.ev(() => { M.E.closeOverlay(null); M.E.switchTo('mala', true); }); await D.page.waitForTimeout(800); await D.shot(OUT + '/ui_ghost.png');
  console.log(D.errors.join('\n') || 'ok'); await D.close2();
})();
