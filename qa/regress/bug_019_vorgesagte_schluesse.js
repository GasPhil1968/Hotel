// BUG-019 (ANALYSE_GILBERT.md Muster 8: K2-B08, K3-B02, K5-B09; Soll-Liste P17):
// Schlüsse, die eine Figur vorher ausspricht, sind entweder kein Schloss mehr oder die Figur sagt nur noch die Beobachtung.
// (1) K2: Mirza erzählt die Tat, nicht „Ihre Schuld? Sie hat mich gerettet.“; er kommt erst, wenn Marko „Keine Schuld“ selbst geschlossen hat.
// (2) K3: Liest Marko mit den drei Fächern die alte Karte, ist „Skela“ der Schluss (kein Notizbuch-Schloss mehr).
// (3) K5: Der Satz zu den gefüllten Kanistern geht an Hamdija erst mit dem eigenen Schluss „Wer mich festhielt“.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const opts = (D) => D.ev(() => (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || []);
const clear = (D) => D.ev(() => { M.__speechLog = []; });
module.exports = { id: 'BUG-019', title: 'Vorgesagte Schlüsse: Mirza, die alte Karte, Hamdija', async run(html) {
  const D = await open({ seed: 19, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  // (1) Mirza
  await FX.load(D, 'k2_50_klassenbuch.json', { pos: 'haustor' }); await D.settle(); await clear(D);
  await D.act('talk', 'mirza'); await D.choose('Nach etwas aus dem Notizbuch'); await D.pickNote('s3_guilt'); await D.drain();
  await D.choose('Kommen Sie heute Abend'); await D.drain(); await FX.closeMenu(D); await D.drain();
  const t1 = await FX.said(D), m1 = await D.ev(() => !!M.GS.flags['k2.s3.mirza']);
  const c1 = await D.ev(() => M.TA.combine('s3_guilt', 's3_rescued')); await D.drain();
  await D.act('talk', 'mirza'); await D.choose('Kommen Sie heute Abend'); await D.drain(); await FX.closeMenu(D); await D.drain();
  const m2 = await D.ev(() => !!M.GS.flags['k2.s3.mirza']);
  check('K2 Mirza', !/Sie hat mich gerettet/.test(t1) && /hineingetragen/.test(t1) && !m1 && c1 && c1.ok && m2, 'vorher=' + m1 + ', Schluss=' + JSON.stringify(c1) + ', nachher=' + m2);
  // (2) alte Karte mit den drei Fächern
  await FX.load(D, 'k3_031_kafic.json', { addNotes: ['l3_area'], delNotes: ['l3_skela', 'l3_oldmap'] }); await D.settle();
  await D.act('look', 'oldmap'); await D.until(s => s.overlay === 'peil', 20000, 'alte Karte'); await D.ev(() => M.k3PeilTap('go')); await D.drain();
  const sk = await D.ev(() => ({ skela: M.GS.notes.indexOf('l3_skela') >= 0, map: !!M.GS.map.skela }));
  check('K3 Skela beim Lesen der Karte', sk.skela && sk.map, JSON.stringify(sk));
  // (3) Hamdija
  await FX.load(D, 'k5_030_freitag.json', { pos: 'pivara', addNotes: ['b5_hand', 'b5_tag'], delNotes: ['b5_wer'] }); await D.settle();
  await D.act('talk', 'hamdija'); await D.drain(); const o3 = await opts(D); await FX.closeMenu(D); await D.drain();
  const c3 = await D.ev(() => M.TA.combine('b5_hand', 'b5_tag')); await D.drain();
  await D.act('talk', 'hamdija'); await D.drain(); const o4 = await opts(D); await FX.closeMenu(D); await D.drain();
  check('K5 Kanister-Satz erst mit „Wer mich festhielt“', !o3.some(t => /beide Kanister gefüllt/.test(t)) && c3 && c3.ok && o4.some(t => /beide Kanister gefüllt/.test(t)), o3.join(' / ') + ' || ' + o4.join(' / '));
  return { ok: all, detail: out.join('; ') };
} };
