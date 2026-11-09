// BUG-022 (Kann-Liste: Hinweisthemen, die in keinem Durchlauf offen waren; K1-B16):
// (1) K1 Fall 3: Wurde Ljerkas Anruf unterbrochen, klingelte es nie wieder, und die Wohnungstür blieb zu. Jetzt klingelt es beim Betreten,
//     und am Anrufbeantworter kann Marko abnehmen.
// (2) K3 Epilog: Wurde Nadas Ankunft unterbrochen, kam sie nie. Jetzt kommt ihr Bus, sobald Marko am Ostbusbahnhof ist.
// (3) K1 Prolog-Nacht: Die Nachholregel lief nie (ohne „when“). Ist die Nacht gespielt, beginnt nach dem Laden der erste Fall;
//     sonst führt das Bett wieder in die Nacht.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-022', title: 'Unterbrochene Szenen: Anruf in Fall 3, Nadas Ankunft, Prolog-Nacht', async run(html) {
  const D = await open({ seed: 22, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  const settleLong = async () => { for (let i = 0; i < 60; i++) { const s = await D.st(); if (!s.busy && !s.dlg && !s.trn && s.screen === 'game') return; if (s.dlg) await FX.closeMenu(D); await D.page.waitForTimeout(400); } };
  // (1a) unterwegs: nach Hause, dort klingelt es
  await FX.load(D, 'k1_53_fall3.json', { delFlags: ['c3.call'], pos: 'riva' }); await D.settle();
  await D.travel('flat'); await settleLong(); const c1 = await D.ev(() => ({ call: !!M.GS.flags['c3.call'], room: M.E.room.id }));
  // (1b) schon in der Wohnung: am Anrufbeantworter abnehmen
  await FX.load(D, 'k1_53_fall3.json', { delFlags: ['c3.call'] }); await D.settle(); await D.ev(() => { M.GS.flags['c3.call'] = false; }); await D.act('use', 'answer'); await settleLong();
  const c2 = await D.ev(() => !!M.GS.flags['c3.call']);
  check('K1 Fall 3: Anruf nach Unterbrechung', c1.call && c1.room === 'flat' && c2, JSON.stringify({ c1, c2 }));
  // (2) Epilogtag ohne Nada: zum Ostbusbahnhof
  await FX.load(D, 'k3_104_epilogtag.json', { delFlags: ['k3.e.nada'], pos: 'herberge' }); await D.settle();
  await D.travel('ostbus'); await settleLong(); const n = await D.ev(() => ({ nada: !!M.GS.flags['k3.e.nada'], room: M.E.room && M.E.room.id }));
  check('K3 Epilog: Nadas Ankunft nach Unterbrechung', n.nada, JSON.stringify(n));
  // (3a) Prolog-Nacht gespielt, Fall 1 nicht begonnen: nach dem Laden beginnt er
  await FX.load(D, 'k1_14_text.json', {}); await D.settle();
  await D.ev(() => { const G = JSON.parse(JSON.stringify(M.GS)); G.phase = 'pro_night'; G.flags['split.intro.night'] = true; localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); return M.E.loadKey('mala.qafx'); });
  await settleLong(); const p3 = await D.ev(() => M.GS.phase);
  // (3b) Nacht noch nicht gespielt: das Bett führt hinein
  await FX.load(D, 'k1_14_text.json', {}); await D.settle();
  await D.ev(() => { const G = JSON.parse(JSON.stringify(M.GS)); G.phase = 'pro_night'; delete G.flags['split.intro.night']; localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); return M.E.loadKey('mala.qafx'); });
  await settleLong(); const p3b0 = await D.ev(() => M.GS.phase); await D.act('use', 'bed'); await settleLong(); const p3b = await D.ev(() => ({ ph: M.GS.phase, night: !!M.GS.flags['split.intro.night'] }));
  check('K1 Prolog-Nacht nach dem Laden', p3 === 'c1' && p3b0 === 'pro_night' && p3b.night, JSON.stringify({ p3, p3b0, p3b }));
  return { ok: all, detail: out.join('; ') };
} };
