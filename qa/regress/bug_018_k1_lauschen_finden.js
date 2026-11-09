// BUG-018 (ANALYSE_GILBERT.md K1-B08, K1-B06; Soll-Liste P19, P20):
// (1) Lauschen als Pflichtschritt: Dinkos „drži …“ beim Lauschen wird zur Notiz; erst mit ihr und Malas Nachhall spricht Marko ihn an.
// (2) Finden als Pflichtschritt: Bruno zeigt sich Marko erst, wenn er gefunden ist (Mala spürt die Loge oder Marko läutet).
// (3) Dinko erzählt nur seinen Teil; Ivkas zweite Runde verlangt den eigenen Schluss „Tonći kam mit der ANKICA“.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const opts = (D) => D.ev(() => (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || []);
const clear = (D) => D.ev(() => { M.__speechLog = []; });
module.exports = { id: 'BUG-018', title: 'K1: Lauschen bei Dinko und Bruno finden als Pflichtschritte; Ivkas zweite Runde verlangt den Schluss', async run(html) {
  const D = await open({ seed: 18, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  // (1) Seesack gespürt, noch nicht gelauscht
  await FX.load(D, 'k1_24_seesack.json', { pos: 'matejuska', delNotes: ['c1_drzi'] }); await D.settle();
  await D.act('talk', 'dinko'); await D.drain(); const o1 = await opts(D); await FX.closeMenu(D); await D.drain();
  await D.switchTo('mala'); await D.act('listen', 'dinko'); await D.drain(); const drzi = await D.ev(() => M.GS.notes.indexOf('c1_drzi') >= 0); await D.switchTo('marko');
  await clear(D); await D.act('talk', 'dinko'); await D.drain(); const o2 = await opts(D);
  check('ohne Lauschen keine Konfrontation', !o1.some(t => /Tonći im Wasser/.test(t)), o1.join(' / '));
  check('Lauschen gibt die Notiz und öffnet das Gespräch', drzi && o2.some(t => /Tonći im Wasser/.test(t)), o2.join(' / '));
  // (3a) das Geständnis nennt das „Warum“ nicht mehr
  await D.choose('Tonći im Wasser'); await D.drain(); for (let i = 0; i < 6; i++) { const s = await D.st(); if (!s.dlg) break; await D.choose(s.dlg[0]); await D.drain(); }
  const t3 = await FX.said(D), story = await D.ev(() => M.NOTES.c1_story.t);
  check('Dinko erzählt seinen Teil', !/Mama wartet um sieben an der Mole/.test(t3) && /Das war seine Sache/.test(t3) && /sagt er nicht/.test(story), story);
  // (3b) Ivkas zweite Runde: Dinkos Teil allein reicht nicht, der Schluss schon
  await FX.load(D, 'k1_29_mole.json', {}); await D.settle(); await clear(D);
  await D.act('use', 'ivka', 'letter_t'); await D.drain(); await D.pickNote('c1_ferry'); await D.drain(); await clear(D);
  await D.pickNote('c1_story'); await D.drain(); const t4 = await FX.said(D); const still = await D.ev(() => !!(M.E.overlay && M.E.overlay.kind === 'notebook') || !!M.E.nbPick);
  await D.pickNote('c1_came'); await D.drain(); const t5 = await FX.said(D);
  check('Runde 2 verlangt den Schluss', /Warum sollte er\? Er kommt mit der Fähre/.test(t4) && /Und Dinko\?/.test(t5), t4.slice(-160) + ' || ' + t5.slice(-120));
  // (2) Bruno vor dem Finden
  await FX.load(D, 'k1_53_nacht.json', { delFlags: ['found.bruno'] }); await D.settle();
  const vis0 = await D.ev(() => { const a = M.E.ACT.bruno; return !!(a && M.E.ghostVisible(a)); }); await clear(D);
  await D.act('talk', 'bruno'); await D.drain(); const t6 = await FX.said(D);
  await D.switchTo('mala'); await D.act('sense', 'lodge'); await D.drain(); await D.switchTo('marko');
  const vis1 = await D.ev(() => { const a = M.E.ACT.bruno; return !!(a && M.E.ghostVisible(a)); });
  check('Bruno erst nach dem Finden', !vis0 && /Der Stuhl in der Loge ist leer/.test(t6) && vis1, 'vorher sichtbar=' + vis0 + ', nachher=' + vis1 + ', „' + t6 + '“');
  return { ok: all, detail: out.join('; ') };
} };
