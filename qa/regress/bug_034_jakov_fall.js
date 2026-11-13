// BUG-034 (Zwischenfall „Der Totengräber“, game/src/92_jakov.js): Jakovs Fall in Kapitel 1 – Pflichtschritte, Beinahe-Treffer, falsche Antworten,
// Fortsetzen nach dem Laden. (1) Kreide und Grablicht greifen erst mit dem Wissen, das sie brauchen. (2) Ankas Stein erst nach Malas Spüren.
// (3) Stipe erzählt nur, wenn Mala ihm in die Karten gesehen hat und Marko richtig antwortet. (4) Schluss im Notizbuch, Beinahe-Treffer.
// (5) Im Finale führen falsche Antworten zurück, die richtige weiter; danach bleibt Jakov und Fall 3 beginnt. (6) Älterer Stand nach i2 führt in den Fall.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const opts = (D) => D.ev(() => (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || []);
module.exports = { id: 'BUG-034', title: 'K1: Zwischenfall Jakov – Reihenfolge, Kartenspiel, Schluss, Finale, Laden', async run(html) {
  const D = await open({ seed: 34, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  const has = (n) => D.ev((x) => M.GS.notes.indexOf(x) >= 0, n), fl = (k) => D.ev((x) => !!M.GS.flags[x], k);
  // (1)(2) Sustipan zu Beginn
  await FX.load(D, 'k1_53_jakov.json', { pos: 'sustipan', addInv: ['kreide', 'grablicht'] }); await D.settle();
  await D.act('use', 'pines', 'kreide'); await D.drain(); check('Kreide ohne Wissen: nichts geschrieben', !(await fl('cj.name')));
  await D.act('use', 'pines', 'grablicht'); await D.drain(); check('Grablicht ohne Namen: nicht angezündet', !(await fl('cj.candle')));
  const ivy0 = await D.ev(() => { const h = M.ROOMS.sustipan.byId.ivy; return !!(h && h.vis(null, M.GS)); });
  await D.act('talk', 'jakov'); await D.drain(); const o1 = await opts(D); check('Jakov: „Wer kommt morgen?“ im Gespräch', o1.some(t => /Wer kommt morgen/.test(t)), o1.join(' / '));
  await D.choose('Wer kommt morgen'); await D.drain(); await FX.closeMenu(D); await D.drain(); check('Notiz 1958', await has('cj_1958'));
  await D.switchTo('mala'); await D.act('sense', 'wall'); await D.drain(); await D.switchTo('marko');
  const ivy1 = await D.ev(() => M.ROOMS.sustipan.byId.ivy.vis(null, M.GS)); check('Efeu erst nach Malas Spüren', !ivy0 && ivy1);
  await D.act('look', 'ivy'); await D.drain(); check('Ankas Stein', await has('cj_stone'));
  await D.act('look', 'jakov'); await D.drain(); check('Jakovs Weg', await has('cj_path'));
  // (3) Bar: Kartenspiel
  await D.exit('exit'); await D.travel('bar'); await D.settle();
  await D.act('talk', 'stipe'); await D.drain(); await D.choose('Kannten Sie einen Jakov'); await D.drain();
  await D.choose('Ich sage Ihnen'); await D.drain(); const noPeek = !(await has('cj_stipe')) && !!(await D.ev(() => M.E.dlg)); await FX.closeMenu(D); await D.drain();
  check('ohne Malas Blick keine Antwort', noPeek && await fl('cj.bet'));
  await D.switchTo('mala'); await D.act('look', 'stipe'); await D.drain(); await D.switchTo('marko'); check('Mala sieht die Karten', await fl('cj.peek'));
  await D.act('talk', 'stipe'); await D.drain(); await D.choose('Ich sage Ihnen'); await D.drain(); await D.choose('Zwei Asse'); await D.drain();
  const wrong = !(await has('cj_stipe')); await FX.closeMenu(D); await D.drain();
  await D.act('talk', 'stipe'); await D.drain(); await D.choose('Ich sage Ihnen'); await D.drain(); await D.choose('Ass und Drei in Münzen'); await D.drain();
  check('falsche Hand: nichts; richtige: Stipe erzählt', wrong && await has('cj_stipe'));
  // (4) Notizbuch
  const near = await D.combine('cj_stone', 'cj_path'); const ok = await D.combine('cj_stipe', 'cj_path');
  check('Beinahe-Treffer, dann der Schluss', near && !near.ok && ok && ok.ok && await has('cj_where'), JSON.stringify([near, ok]));
  // (5) Finale
  await D.exit('door'); await D.travel('sustipan'); await D.settle();
  await D.act('use', 'pines', 'kreide'); await D.drain(); check('Name geschrieben', await fl('cj.name'));
  await D.act('use', 'pines', 'grablicht'); await D.drain();
  await D.choose('Es kommt niemand mehr'); await D.drain(); const back1 = (await opts(D)).some(t => /Lovrinac/.test(t));
  await D.choose('Sie liegt in Lovrinac'); await D.drain(); const back2 = (await opts(D)).some(t => /nicht gefunden/.test(t));
  await D.choose('Sie haben sie damals nicht gefunden'); await D.drain(); await D.choose('Stipe hat es erzählt'); await D.drain();
  check('falsche Antworten führen zurück', back1 && back2);
  const end = await D.ev(() => ({ ph: M.GS.phase, done: !!M.GS.flags['cj.done'], real: !!M.GS.flags['realized.jakov'], note: M.GS.notes.indexOf('cj_done') >= 0 }));
  check('Jakov begreift, bleibt; Fall 3 beginnt', end.done && end.real && end.note && end.ph === 'c3', JSON.stringify(end));
  // (6) Fortsetzen: Stand nach dem Zwischenspiel (i2.done) führt in Jakovs Fall
  await FX.load(D, 'k1_52_nach_i2.json', {}); await D.drain(); const r = await D.ev(() => ({ ph: M.GS.phase, st: !!M.GS.flags['cj.started'] }));
  check('nach dem Laden: Zwischenfall beginnt', r.ph === 'cj' && r.st, JSON.stringify(r));
  const errs = (D.errors || []).filter(e => !/^console\.error: .*Kunst fehlt/.test(e)); check('keine JS-Fehler', !errs.length, errs.slice(0, 3).join(' | '));
  if (D.close2) await D.close2(); return { ok: all, detail: out.join('; ') }; } };
