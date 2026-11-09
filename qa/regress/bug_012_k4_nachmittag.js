// BUG-012 (ANALYSE_GILBERT.md K4-B01, K4-B05):
// (1) Nach einem verbrauchten Nachmittag begann kein neuer, wenn Mala noch in Zimmer 214 stand; der Text sagte „Für heute ist es vorbei“.
// (2) Die Wanduhr bietet jetzt ausdrücklich „(Später wiederkommen.)“.
// (3) Die Entscheidung an der Kurve wurde als Notiz exportiert (praktisch immer wahr) statt als Wahl.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-012', title: 'K4: neuer Nachmittag auch mit Mala in 214; „Später wiederkommen“ an der Uhr; Kurve als Wahl an Kapitel 5', async run(html) {
  const D = await open({ seed: 12, html }); const out = [];
  // (1) Stand nach Versuch 1, Mala bleibt an den Fotos in Zimmer 214: Marko geht zu Ana nach Giesing und kommt zurück
  await FX.load(D, 'k4_060_nach_versuch1.json', { malaPos: 'heim214' }); await D.settle();
  const before = await D.ev(() => ({ used: !!M.GS.flags['k4.g.pmUsed'], mala: M.GS.pos.mala && M.GS.pos.mala.room }));
  await D.exit('elevator'); await D.drain(); await D.exit('door'); await D.drain(); await D.travel('giesing'); await D.drain();
  const away = await D.ev(() => ({ room: M.API.room.id, mala: M.GS.pos.mala.room }));
  await D.ev(() => { M.__speechLog = []; }); await D.travel('heim'); await D.drain();
  const after = await D.ev(() => ({ used: !!M.GS.flags['k4.g.pmUsed'], room: M.API.room.id }));
  const t1 = await FX.said(D);
  const ok1 = before.used && before.mala === 'heim214' && away.room === 'ana' && away.mala === 'heim214' && after.room === 'heim' && !after.used && /Ein anderer Nachmittag/.test(t1) && !/Für heute ist es vorbei/.test(t1);
  out.push('neuer Nachmittag, während Mala in 214 blieb=' + ok1 + (ok1 ? '' : ' ' + JSON.stringify({ before, away, after, t1 })));
  // (2) Uhr: „(Später wiederkommen.)“
  await FX.load(D, 'k4_060_nach_versuch1.json', {}); await D.settle();
  await D.act('use', 'clock'); await D.choose('(Später wiederkommen.)'); await D.drain();
  const s2 = await D.ev(() => ({ used: !!M.GS.flags['k4.g.pmUsed'] })); const t2 = await FX.said(D);
  const ok2 = !s2.used && !/Für heute ist es vorbei/.test(t2); out.push('Uhr: Später wiederkommen=' + ok2);
  // (3) Export der Kurve: Wahl „Ihr musstet fahren“ (k4.fin.kurve=false), obwohl Mala die Notiz vorher gab
  await FX.load(D, 'k4_060_nach_versuch1.json', { addNotes: ['z4_kurve'], setFlags: { 'k4.fin.kurve': false } }); await D.settle();
  const kurve = await D.ev(() => { try { localStorage.removeItem('mala.c4end'); } catch (e) {} M.GS.ended = false; M.endChapter4(M.API); const r = JSON.parse(localStorage.getItem('mala.c4end') || 'null'); return r ? r.kurve : 'fehlt'; });
  const ok3 = kurve === false; out.push('Export kurve bei „Ihr musstet fahren“=' + kurve);
  return { ok: ok1 && ok2 && ok3, detail: out.join('; ') };
} };
