// BUG-026 (Prüfbericht K3-02): Alte Tagesabschlüsse schnitten neue Handlungen ab. Jetzt endet ein Tag bewusst.
// (1) Samstag, Regel 1, Pflichtschritte erledigt, Brücke zugesagt: kein automatischer Wechsel; Marko sagt es einmal; in der Herberge
//     nennt er die offene Zusage; „Noch nicht“ lässt den Tag offen; beim nächsten Betreten erneut; „Beenden“ merkt die Zusage als
//     bewusst zurückgestellt (k3.left.bridge) und beginnt die Nacht. (2) Sonntag, Regel 2: ohne Mates Batterie ist der Tag nicht reif;
//     mit Batterie fragt die Werkstatt; ein offener Brief steht in der Liste; danach fragt Vlado auf Wunsch noch einmal. (3) Das Bett bietet
//     den Abschluss ebenfalls an.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-026', title: 'K3: bewusster Tagesabschluss mit Liste offener Zusagen', async run(html) {
  const D = await open({ seed: 26, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const st = () => D.st(); const said = () => FX.said(D);
  // (1)
  await FX.load(D, 'k3x_samstag.json', { setFlags: { 'k3.rules': 1, 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.x.vaga': true }, pos: 'tepa' });
  await D.page.waitForTimeout(300); await P.calm(); await D.page.waitForTimeout(1500); await P.calm();
  let s = await st(); ck(s.phase === 'k3_d2' && await D.flag('k3.ready.k3_d2'), 'Samstag reif, aber kein Wechsel (' + s.phase + ')');
  ck(/Wenn ich zurück in die Herberge gehe/.test(await said()), 'einmaliger Hinweis');
  await P.travel('herberge'); s = await st(); ck(!!s.dlg && s.dlg.some(t => /Den Tag beenden/.test(t)), 'Herberge fragt');
  ck(/Davor und Lena sind an der Brücke/.test(await said()), 'offene Zusage genannt');
  await P.choose('Noch nicht'); s = await st(); ck(s.phase === 'k3_d2' && !s.dlg, '„Noch nicht“: Tag bleibt offen');
  await D.page.waitForTimeout(1200); s = await st(); ck(!s.dlg && !s.busy, 'keine Dauerabfrage, keine Sperre');
  await P.exit('door'); await P.travel('tepa'); await P.travel('herberge'); s = await st(); ck(!!s.dlg && s.dlg.some(t => /Den Tag beenden/.test(t)), 'beim nächsten Betreten erneut gefragt');
  await D.choose('Den Tag beenden'); for (let i = 0; i < 60; i++) { const x = await st(); if (x.dlg && x.dlg.some(t => /Mala fragen|Spur/.test(t))) break; await D.page.waitForTimeout(250); }
  ck(await D.flag('k3.left.bridge') === true, 'Zusage als bewusst zurückgestellt gemerkt');
  ck(await D.flag('k3.d2n.started') === true, 'die Nacht beginnt');
  // (2) Sonntag, Regel 2
  const sun = { 'k3.rules': 2, 'k3.bato.uneasy': true, 'k3.v.free': true, 'k3.b.done': true, 'k3.x.veraAsked': true, 'met.vera': true };
  await FX.load(D, 'k3x_sonntag.json', { setFlags: sun, addNotes: ['l3_survived', 'a3_awake', 'a3_girl', 'v3_who'], pos: 'bulevar' }); await D.page.waitForTimeout(300); await P.calm();
  ck(!(await D.ev(() => M.k3DayReady(M.GS))), 'Regel 2: ohne Batterie nicht reif');
  ck(/Batterie|TAM/.test(await D.ev(() => M.k3D3Missing(M.GS) || '')), 'Was fehlt: die Batterie (' + (await D.ev(() => M.k3D3Missing(M.GS))) + ')');
  await FX.load(D, 'k3x_sonntag.json', { setFlags: Object.assign({ 'k3.v.battery': true }, sun), addNotes: ['l3_survived', 'a3_awake', 'a3_girl', 'v3_who'], pos: 'bulevar' }); await D.page.waitForTimeout(300); await P.calm();
  ck(await D.ev(() => M.k3DayReady(M.GS)), 'mit Batterie reif');
  await P.exit('to_vulk'); s = await st(); ck(!!s.dlg && s.dlg.some(t => /Es ist Zeit/.test(t)), 'Werkstatt fragt: „Es ist Zeit“');
  ck(/Vera wartet|Veras Brief/.test(await said()), 'offener Brief genannt');
  await P.choose('Noch nicht'); s = await st(); ck(s.phase === 'k3_d3', 'Sonntag bleibt offen');
  // (2b) wer an der Tür abgelehnt hat, fragt Vlado noch einmal (Hinweis x3so, Stufe 4)
  await P.talk('vlado', 'Fahren wir'); s = await st(); ck(!!s.dlg && s.dlg.some(t => /Es ist Zeit/.test(t)), 'Vlado: „Fahren wir?“ bietet den Abschluss erneut an');
  await P.choose('Noch nicht'); if ((await st()).dlg) await P.bye('Bis elf'); s = await st(); ck(s.phase === 'k3_d3' && !s.dlg, 'wieder „Noch nicht“: Sonntag bleibt offen');
  // (3) Bett
  await P.exit('door'); await P.travel('herberge'); await P.exit('stairs'); await D.act('use', 'bed'); await D.page.waitForTimeout(400); s = await st();
  ck(!!s.dlg && s.dlg.some(t => /Es ist Zeit/.test(t)), 'Bett bietet den Abschluss an');
  await P.choose('Es ist Zeit'); for (let i = 0; i < 80; i++) { if ((await st()).phase === 'k3_fin_n') break; await D.page.waitForTimeout(250); }
  ck((await st()).phase === 'k3_fin_n' && await D.flag('k3.left.vera') === true, 'Finale beginnt, Brief als zurückgestellt gemerkt');
  return { ok, detail: out.join('; ') };
} };
