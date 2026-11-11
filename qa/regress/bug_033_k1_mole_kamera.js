// BUG-033 (gefunden bei den Trailer-Aufnahmen): Kapitel 1, Riva am Mittwochabend. Die erste Begegnung beginnt, sobald Marko die Mole
//     betritt (x > 430). Ivka steht am Molenende (x ≈ 596) – die Kamera folgte Marko, Ivka war rechts außerhalb des Bildes, während Marko
//     sie beschreibt und man über sie entscheiden soll. Jetzt schwenkt das Bild vorher ans Molenende (Ivka im Bild, Marko auch) und ist
//     nach der Begegnung wieder frei. Geprüft im heutigen Ablauf (Mala sichtbar) und im alten Ablauf alter Spielstände (Mala als Stimme).
//     Die zweite Korrektur desselben Tages (Musik nach dem Titelbild) braucht echten Ton und wird mit qa/ui/musik_nach_titel.js geprüft.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-033', title: 'K1: Ivka bei der ersten Begegnung im Bild (Kamera ans Molenende)', async run(html) {
  const out = []; let ok = true; const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  for (const voice of [false, true]) {
    const D = await open({ seed: 33, html, turbo: 20 }); const tag = voice ? 'Stimme' : 'heute';
    try {
      await FX.load(D, 'k1_19_riva.json', { delFlags: ['c1.met', 'found.ivka', 'mala.voice'], setFlags: voice ? { 'mala.voice': true } : {}, pos: 'riva' });
      await D.settle();
      const before = await D.ev(() => ({ met: !!M.GS.flags['c1.met'], cam: Math.round(M.E.camX), lock: M.E.room.camLock }));
      ck(!before.met && before.lock === undefined, tag + ': vorher keine Begegnung, Kamera frei ' + JSON.stringify(before));
      await D.ev(() => M.E.walkPlayerTo(560, 116));
      let seen = null;   // der Moment, in dem Ivka erscheint (found.ivka): wo stehen sie im Bild?
      for (let i = 0; i < 600 && !seen; i++) { await D.page.waitForTimeout(40);
        seen = await D.ev(() => M.GS.flags['found.ivka'] ? { cam: Math.round(M.E.camX), ivka: Math.round(M.E.ACT.ivka.x - M.E.camX), marko: Math.round(M.E.ACT.marko.x - M.E.camX), lock: M.E.room.camLock } : null); }
      ck(!!seen, tag + ': Ivka erscheint');
      if (seen) {
        ck(seen.ivka >= 8 && seen.ivka <= 312, tag + ': Ivka im Bild (Bildschirm-x ' + seen.ivka + ', Kamera ' + seen.cam + ')');
        ck(seen.marko >= 8 && seen.marko <= 312, tag + ': Marko im Bild (Bildschirm-x ' + seen.marko + ')');
        ck(seen.lock !== undefined, tag + ': Kamera während der Begegnung festgehalten (' + seen.lock + ')');
      }
      await D.choose('Nicht'); await D.drain();
      const after = await D.ev(() => ({ met: !!M.GS.flags['c1.met'], lock: M.E.room.camLock, gap: Math.round(M.E.ACT.ivka.x - M.E.ACT.marko.x), busy: !!M.E.busy }));
      ck(after.met && !after.busy, tag + ': Begegnung abgeschlossen');
      ck(after.lock === undefined, tag + ': danach Kamera wieder frei');
      ck(after.gap > 0 && after.gap < 40, tag + ': Marko steht bei ihr (Abstand ' + after.gap + ')');
      const errs = D.errors || []; ck(!errs.length, tag + ': keine JS-Fehler (' + errs.length + (errs.length ? ': ' + String(errs[0]).slice(0, 120) : '') + ')');
    } finally { if (D.close2) await D.close2(); }
  }
  return { ok, detail: out.join('; ') };
} };
