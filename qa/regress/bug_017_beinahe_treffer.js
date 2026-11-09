// BUG-017 (ANALYSE_GILBERT.md K1-B01 bis K1-B04, K3-B05, K3-B06, K4-B03, K5-B03, K5-B05, K5-B06; Soll-Liste P15, P16):
// Naheliegende Ideen bekommen eine Antwort, die auf die richtige Spur zeigt, oder sie gelten als Weg.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const opts = (D) => D.ev(() => (M.E.dlg && M.E.dlg.opts.map(o => o.t)) || []);
const comb = (D, a, b) => D.ev((x) => M.TA.combine(x[0], x[1]), [a, b]);
const clear = (D) => D.ev(() => { M.__speechLog = []; });
module.exports = { id: 'BUG-017', title: 'Beinahe-Treffer und weitere Wege in Kapitel 1, 3, 4 und 5', async run(html) {
  const D = await open({ seed: 17, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  // K1-B01: Kassette, aber noch keine Zeitung – Zdenka kennt das Radio
  await FX.load(D, 'k1_43_nina.json', { pos: 'varos', delInv: ['newspaper'] }); await D.settle(); await clear(D);
  await D.act('talk', 'zdenka'); await D.drain(); const o1 = await opts(D);
  if (o1.some(t => /Kassettenfach/.test(t))) { await D.choose('Kassettenfach'); await D.drain(); }
  await FX.closeMenu(D); await D.drain(); const t1 = await FX.said(D);
  check('K1-B01 Zdenka und das Radio', o1.some(t => /Kassettenfach/.test(t)) && /bringen Sie mir die Zeitung/.test(t1), o1.join(' / '));
  // K1-B02: mit dem Radio weiß Marko, wo es Batterien gibt; das Fährterminal ist offen
  await FX.load(D, 'k1_43_nina.json', { pos: 'varos' }); await D.settle(); await D.ev(() => { M.GS.map.terminal = false; }); await clear(D);
  await D.act('give', 'zdenka', 'newspaper'); await D.drain(); const t2 = await FX.said(D); const term = await D.ev(() => !!M.GS.map.terminal);
  check('K1-B02 Batterien am Fährterminal', term && /Mono-Batterien/.test(t2));
  // K1-B03: Ivkas Tür nennt das fehlende Stück
  await FX.load(D, 'k1_09_ivka.json', { addInv: ['postcard'], addNotes: ['pro_list'] }); await D.settle(); await clear(D);
  await D.exit('door'); await D.drain(); const t3a = await FX.said(D);
  await FX.load(D, 'k1_09_ivka.json', { addInv: ['photo1'], addNotes: ['pro_list'] }); await D.settle(); await clear(D);
  await D.exit('door'); await D.drain(); const t3b = await FX.said(D);
  check('K1-B03 Ivkas Tür', /kein Bild von ihm/.test(t3a) && /was er ihr geschrieben hat/.test(t3b), t3a + ' | ' + t3b);
  // K1-B04: Schlüsselring an der Treppe
  await FX.load(D, 'k1_55_bruno.json', {}); await D.settle(); await D.act('use', 'stairs', 'keyring'); await D.drain();
  const r4 = await D.ev(() => M.API.room.id); check('K1-B04 Schlüsselring an der Treppe', r4 === 'salon', r4);
  // K3-B05: Ljerkas Vlado und Malas Fahrer; zwei Peilungen ohne die erste
  await FX.load(D, 'k3_021_ljerka.json', { addNotes: ['v3_ljerka', 'k3_c_bridge'] }); await D.settle();
  const c5a = await comb(D, 'v3_ljerka', 'k3_c_bridge');
  await FX.load(D, 'k3_029_peilung3.json', { addNotes: ['l3_m2', 'l3_m3'], delNotes: ['l3_flat', 'l3_area'] }); await D.settle();
  const c5b = await comb(D, 'l3_m2', 'l3_m3');
  check('K3-B05 Beinahe-Treffer', c5a && !c5a.ok && /Erst muss ich ihn finden/.test(c5a.t || '') && c5b && !c5b.ok && /alle drei auf einem Blatt/.test(c5b.t || ''), JSON.stringify([c5a, c5b]));
  // K3-B06: Davor auf „Dragi dida“
  await FX.load(D, 'k3_084_zelenika_in.json', { addNotes: ['b3_pencil'] }); await D.settle(); await clear(D);
  await D.act('talk', 'davor'); await D.choose('Nach etwas aus dem Notizbuch fragen'); await D.pickNote('b3_pencil'); await D.drain(); await FX.closeMenu(D); await D.drain();
  check('K3-B06 Davor auf die Notiz', /So hat ihn nur einer genannt/.test(await FX.said(D)));
  // K4-B03: Ausweis und Briefe als weiterer Weg zum Namen; Peppino und Briefe als Beinahe-Treffer
  await FX.load(D, 'k4_035_ausweis.json', { addNotes: ['s4_umschlag'] }); await D.settle();
  const c4b = await comb(D, 's4_peppino', 's4_umschlag'); const c4a = await comb(D, 's4_ausweis', 's4_umschlag');
  check('K4-B03 Ausweis und Briefe', c4a && c4a.ok && c4a.to === 's4_name' && c4b && !c4b.ok && /Wie wird aus dem einen der andere/.test(c4b.t || ''), JSON.stringify([c4a, c4b]));
  // K5-B03: „Damit man sie findet“ und Nadas Tafel ergeben die zwei Hälften
  await FX.load(D, 'k5_022_beide.json', {}); await D.settle(); const c5 = await comb(D, 's5_beide', 's5_tafel');
  check('K5-B03 Tafel als zweiter Weg', c5 && c5.ok && c5.to === 's5_teile', JSON.stringify(c5));
  // K5-B05: Marko hebt eine Ecke der Plane
  await FX.load(D, 'k5_005_vratnik.json', {}); await D.settle(); await clear(D); await D.act('use', 'garden'); await D.drain();
  check('K5-B05 Plane anheben', /Ich hebe eine Ecke der Plane/.test(await FX.said(D)));
  // K5-B06: nachts mit dem Kanister am Brückenkopf anstellen
  await FX.load(D, 'k5_026_nacht.json', { pos: 'pivara' }); await D.settle(); await D.act('use', 'bridge', 'kanister'); await D.drain();
  check('K5-B06 Kanister am Brückenkopf', await D.ev(() => !!M.GS.flags['k5.b.met']));
  return { ok: all, detail: out.join('; ') };
} };
