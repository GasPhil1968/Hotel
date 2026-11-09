// BUG-014 (ANALYSE_GILBERT.md K2-B04, K2-B03, K2-B02):
// (1) Emina ging nur, wenn Mala ein zweites Mal lauschte (unsichtbarer Auslöser). Jetzt geht sie beim nächsten Betreten sichtbar.
// (2) „Lana Delić?“: Register + Helferin gilt; der neunte Stock aus Malas Blick auf den Aufzug zählt.
// (3) Ältere Stände: Fall 3 ohne den Schluss beendet → der Karton öffnet sich trotzdem.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-014', title: 'K2: Emina geht sichtbar; „Lana Delić?“ auf mehreren Wegen; Karton ohne Notizbuch-Schloss', async run(html) {
  const D = await open({ seed: 14, html }); const out = [];
  // (1) Brief korrigiert, Halid-Versteck bekannt, Emina noch da: von der Kula in die Kafana
  await FX.load(D, 'k2_22_kafana.json', { delNotes: ['s1_away'], delFlags: ['k2.s1.eminaAway'], pos: 'kula' }); await D.settle();
  await D.exit('kafana_door'); await D.drain();
  const s1 = await D.ev(() => ({ away: !!M.GS.flags['k2.s1.eminaAway'], room: M.API.room.id })); const t1 = await FX.said(D);
  const ok1 = s1.room === 'kafana' && s1.away && /Tante Sabira/.test(t1); out.push('Emina geht beim Betreten=' + ok1);
  // (2) Wege zu „Lana Delić?“
  await FX.load(D, 'k2_53_fall3.json', { addNotes: ['m2_split_register', 's3_helper', 'm2_housebook'], delNotes: ['m2_lana', 'm2_f_ninth', 's3_nada'] }); await D.settle();
  const a = await D.ev(() => M.TA.combine('m2_split_register', 's3_helper'));
  await FX.load(D, 'k2_53_fall3.json', { addNotes: ['m2_split_register', 'm2_housebook'], delNotes: ['m2_lana', 'm2_f_ninth', 's3_nada'], setFlags: { 'k2.lift.ninth': true } }); await D.settle();
  const b = await D.ev(() => M.TA.combine('m2_split_register', 'm2_housebook'));
  const ok2 = a && a.ok && a.to === 'm2_lana' && b && b.ok && b.to === 'm2_lana'; out.push('Register+Helferin=' + !!(a && a.ok) + ', Register+Hausbuch mit Aufzug=' + !!(b && b.ok));
  // (3) Finale, älterer Stand ohne „Lana Delić?“: Karton öffnen
  await FX.load(D, 'k2_58_finale.json', { addInv: ['karton'], delNotes: ['m2_lana'], delFlags: ['k2.f2.opened'] }); await D.settle();
  await D.item('open', 'karton'); await D.drain();
  const s3 = await D.ev(() => ({ lana: M.GS.notes.indexOf('m2_lana') >= 0, opened: !!M.GS.flags['k2.f2.opened'] }));
  const ok3 = s3.lana && s3.opened; out.push('Karton ohne Notizbuch-Schloss=' + ok3);
  return { ok: ok1 && ok2 && ok3, detail: out.join('; ') };
} };
