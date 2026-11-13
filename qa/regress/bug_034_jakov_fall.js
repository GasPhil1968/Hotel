// BUG-034 (Zwischenfall „Der Totengräber“, game/src/92_jakov.js): Jakovs Fall in Kapitel 1 – Pflichtschritte, Beinahe-Treffer, falsche Antworten,
// Fortsetzen nach dem Laden. (1) Kreide und Grablicht greifen erst mit dem Wissen, das sie brauchen. (2) Ankas Stein erst nach Malas Spüren, lesbar
// erst mit Zeitung und Kreide (Durchreibung). (3) Briškula: Stipe erzählt nur, wenn Mala ihm in die Karten gesehen hat und Marko die richtige Hand
// nennt. (4) Zdenka; Mala spielt Anka – erst mit Zdenkas Wissen, falsche Antwort beendet. (5) Schluss im Notizbuch, Beinahe-Treffer.
// (6) Wind: an den Pinien geht das Streichholz aus, an der Mauer brennt es. Finale: falsche Antworten führen zurück; Jakov bleibt, Fall 3 beginnt.
// (7) Älterer Stand nach i2 führt in den Fall.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const opts = (D) => D.ev(() => (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || []);
module.exports = { id: 'BUG-034', title: 'K1: Zwischenfall Jakov – Durchreibung, Kartenrätsel, Anka, Schluss, Wind, Finale, Laden', async run(html) {
  const D = await open({ seed: 34, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  const has = (n) => D.ev((x) => M.GS.notes.indexOf(x) >= 0, n), fl = (k) => D.ev((x) => !!M.GS.flags[x], k), inv = (i) => D.ev((x) => M.GS.inv.indexOf(x) >= 0, i);
  const talk = async (id, ...ch) => { await D.act('talk', id); await D.drain(); for (const c of ch) { await D.choose(c); await D.drain(); } await FX.closeMenu(D); await D.drain(); };
  // (1) Sustipan zu Beginn
  await FX.load(D, 'k1_53_jakov.json', { pos: 'sustipan', addInv: ['kreide', 'grablicht', 'zeitung'] }); await D.settle();
  await D.act('use', 'pines', 'kreide'); await D.drain(); check('Kreide ohne Wissen: nichts geschrieben', !(await fl('cj.name')));
  await D.act('use', 'pines', 'grablicht'); await D.drain(); check('Grablicht ohne Namen: nicht angezündet', !(await fl('cj.candle')) && !(await fl('cj.wind')));
  const ivy0 = await D.ev(() => { const h = M.ROOMS.sustipan.byId.ivy; return !!(h && h.vis(null, M.GS)); });
  await D.act('talk', 'jakov'); await D.drain(); const o1 = await opts(D); check('Jakov: „Wer kommt morgen?“ im Gespräch', o1.some(t => /Wer kommt morgen/.test(t)), o1.join(' / '));
  await D.choose('Wer kommt morgen'); await D.drain(); await FX.closeMenu(D); await D.drain(); check('Notiz 1958', await has('cj_1958'));
  // (2) Stein, Durchreibung
  await D.switchTo('mala'); await D.act('sense', 'wall'); await D.drain(); await D.switchTo('marko');
  const ivy1 = await D.ev(() => M.ROOMS.sustipan.byId.ivy.vis(null, M.GS)); check('Efeu erst nach Malas Spüren', !ivy0 && ivy1);
  await D.act('look', 'ivy'); await D.drain(); check('Stein verwittert: nur „Naša mala“, noch keine Daten', (await has('cj_moss')) && !(await has('cj_stone')));
  await D.act('use', 'ivy', 'kreide'); await D.drain(); const r1 = !(await has('cj_stone'));
  await D.ev(() => { M.GS.inv = M.GS.inv.filter(i => i !== 'kreide'); }); await D.act('use', 'ivy', 'zeitung'); await D.drain(); const r2 = !(await has('cj_stone')) && await inv('zeitung');
  await D.ev(() => { M.GS.inv.push('kreide'); }); await D.act('use', 'ivy', 'zeitung'); await D.drain();
  check('Kreide allein, Zeitung allein: nichts; beides: Durchreibung', r1 && r2 && (await has('cj_stone')) && !(await inv('zeitung')));
  await D.act('look', 'jakov'); await D.drain(); check('Jakovs Weg', await has('cj_path'));
  // (3) Bar: Briškula
  await D.exit('exit'); await D.travel('bar'); await D.settle();
  await D.act('talk', 'stipe'); await D.drain(); await D.choose('Kannten Sie einen Jakov'); await D.drain();
  await D.choose('Ich sage Ihnen'); await D.drain(); const noPeek = !(await has('cj_stipe')) && !!(await D.ev(() => M.E.dlg)); await FX.closeMenu(D); await D.drain();
  check('ohne Malas Blick keine Antwort', noPeek && await fl('cj.bet'));
  await D.switchTo('mala'); await D.act('look', 'stipe'); await D.drain(); await D.act('look', 'frane'); await D.drain(); await D.switchTo('marko');
  check('Mala sieht Karten und Stapel', (await fl('cj.peek')) && await fl('cj.pile'));
  await talk('stipe', 'Ich sage Ihnen', 'und den König in Münzen'); const wrong1 = !(await has('cj_stipe'));
  await talk('stipe', 'Ich sage Ihnen', 'dazu Bube und Drei in Kelchen'); const wrong2 = !(await has('cj_stipe'));
  await talk('stipe', 'Ich sage Ihnen', 'Ass und Drei in Münzen');
  check('falsche Hände: nichts; richtige: Stipe erzählt', wrong1 && wrong2 && await has('cj_stipe'));
  // (4) Anka spielen: erst mit Zdenka
  await D.exit('door'); await D.travel('sustipan'); await D.settle(); await D.switchTo('mala');
  await talk('jakov', 'als wäre ich Anka'); const noZd = !(await has('cj_tree')); await D.switchTo('marko');
  await D.exit('exit'); await D.travel('varos'); await D.settle(); await talk('zdenka', 'Kannten Sie Anka'); check('Zdenka erinnert sich', noZd && await has('cj_zdenka'));
  await D.exit('exit'); await D.travel('sustipan'); await D.settle(); await D.switchTo('mala');
  await talk('jakov', 'als wäre ich Anka', 'Drei.'); const w3 = !(await has('cj_tree'));
  await talk('jakov', 'als wäre ich Anka', 'Sieben.', 'In Lovrinac'); const wL = !(await has('cj_tree'));
  await talk('jakov', 'als wäre ich Anka', 'Sieben.', 'Unter unserem Baum'); await D.switchTo('marko');
  check('Anka: ohne Zdenka nichts, falsche Antworten beenden, richtige verraten ihn', w3 && wL && await has('cj_tree'));
  // (5) Notizbuch
  const near1 = await D.combine('cj_stipe', 'cj_path'), near2 = await D.combine('cj_zdenka', 'cj_path'); const ok = await D.combine('cj_stipe', 'cj_tree');
  check('Beinahe-Treffer, dann der Schluss', near1 && !near1.ok && near2 && !near2.ok && ok && ok.ok && await has('cj_where'), JSON.stringify([near1, near2, ok]));
  // (6) Name, Wind, Finale
  await D.act('use', 'pines', 'kreide'); await D.drain(); check('Name geschrieben', await fl('cj.name'));
  await D.act('use', 'pines', 'grablicht'); await D.drain(); const wind = (await fl('cj.wind')) && !(await fl('cj.candle')) && await inv('grablicht');
  await D.act('use', 'wall', 'grablicht'); await D.drain(); check('Wind an den Pinien, Windschatten an der Mauer', wind && await inv('grablicht_an'));
  await D.act('use', 'pines', 'grablicht_an'); await D.drain();
  await D.choose('Es kommt niemand mehr'); await D.drain(); const back1 = (await opts(D)).some(t => /Lovrinac/.test(t));
  await D.choose('Sie liegt in Lovrinac'); await D.drain(); const back2 = (await opts(D)).some(t => /nicht gefunden/.test(t));
  await D.choose('Sie haben sie damals nicht gefunden'); await D.drain(); await D.choose('Sie sind tot'); await D.drain(); const back3 = (await opts(D)).some(t => /Lesen Sie/.test(t));
  await D.choose('Lesen Sie, was da steht'); await D.drain();
  check('falsche Antworten führen zurück', back1 && back2 && back3);
  const end = await D.ev(() => ({ ph: M.GS.phase, done: !!M.GS.flags['cj.done'], real: !!M.GS.flags['realized.jakov'], note: M.GS.notes.indexOf('cj_done') >= 0, inv: M.GS.inv.filter(i => /kreide|grablicht|zeitung/.test(i)) }));
  check('Jakov begreift, bleibt; Fall 3 beginnt; Hilfsmittel weg', end.done && end.real && end.note && end.ph === 'c3' && !end.inv.length, JSON.stringify(end));
  // (7) Fortsetzen: Stand nach dem Zwischenspiel (i2.done) führt in Jakovs Fall
  await FX.load(D, 'k1_52_nach_i2.json', {}); await D.drain(); const r = await D.ev(() => ({ ph: M.GS.phase, st: !!M.GS.flags['cj.started'] }));
  check('nach dem Laden: Zwischenfall beginnt', r.ph === 'cj' && r.st, JSON.stringify(r));
  const errs = (D.errors || []).filter(e => !/^console\.error: .*Kunst fehlt/.test(e)); check('keine JS-Fehler', !errs.length, errs.slice(0, 3).join(' | '));
  if (D.close2) await D.close2(); return { ok: all, detail: out.join('; ') }; } };
