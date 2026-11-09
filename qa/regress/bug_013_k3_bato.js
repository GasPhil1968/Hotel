// BUG-013 (ANALYSE_GILBERT.md K3-B01, K3-B04; Prüfbericht K3 E-02):
// (1) „Bato war wach“ hing am Ordnen der Nacht, dessen einziger Anstoß im Normalablauf wegfiel; Dachfenster und Lichtfolge wurden abgewiesen.
// (2) Allein ein Beleg: Bato fragt zurück, statt auszuweichen.
// (3) Die Lichtprobe ging vor dem Glocken-Nachhall; danach fehlte der Ruf (a3_voice).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
async function askBato(D, note) { await D.act('talk', 'bato'); await D.choose('Nach etwas aus dem Notizbuch fragen'); await D.pickNote(note); await D.drain(); await FX.closeMenu(D); await D.drain(); }
module.exports = { id: 'BUG-013', title: 'K3-Sonntag: „Bato war wach“ ohne Ordnen; Rückfrage bei einem Beleg; Lichtprobe erst nach der Glocke', async run(html) {
  const D = await open({ seed: 13, html }); const out = [];
  // (1) Dachfenster und Lichtfolge, ohne geordnete Nacht (das Dachfenster geht in der Lichtfolge auf, das Notizbuch bietet nur noch sie an)
  await FX.load(D, 'k3_069_lichtfolge.json', {}); await D.settle();
  await askBato(D, 'a3_lightseq');
  const c = await D.ev(() => M.TA.combine('a3_thrice', 'a3_slept'));
  const s1 = await D.ev(() => ({ thrice: M.GS.notes.indexOf('a3_thrice') >= 0, awake: M.GS.notes.indexOf('a3_awake') >= 0, room: M.GS.notes.indexOf('a3_lightroom') >= 0 }));
  const ok1 = s1.thrice && s1.awake && !s1.room && c && c.ok; out.push('ohne Ordnen: Dreimal=' + s1.thrice + ', Bato war wach=' + s1.awake);
  // (2) nur das Dachfenster: Rückfrage, kein „Dreimal“
  await FX.load(D, 'k3_068_dachfenster.json', { active: 'marko' }); await D.settle();
  await askBato(D, 'a3_roof'); const t2 = await FX.said(D); const th2 = await D.ev(() => M.GS.notes.indexOf('a3_thrice') >= 0);
  const ok2 = /Wann soll da Licht gewesen sein/.test(t2) && !th2; out.push('ein Beleg: Rückfrage=' + ok2);
  // (3) Lichtprobe ohne Glocken-Nachhall wird begründet abgelehnt
  await FX.load(D, 'k3_065_vor_lichtprobe.json', { delNotes: ['a3_bell3', 'a3_voice'], delFlags: ['k3.n2.bell'] }); await D.settle();
  await D.act('use', 'house', 'mobitel'); await D.drain(); const t3 = await FX.said(D); const lit = await D.ev(() => M.GS.flags['k3.lit'] || null);
  const ok3 = /Erst muss Mala an der Glocke hören/.test(t3) && !lit; out.push('Lichtprobe vor der Glocke abgelehnt=' + ok3);
  return { ok: ok1 && ok2 && ok3, detail: out.join('; ') };
} };
