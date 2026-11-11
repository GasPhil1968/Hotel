// BUG-030 (zweiter Prüfbericht K3, Restbefunde K3-R2-01 und K3-R2-02).
// (1) K3-R2-01, Epilog am Ostbusbahnhof: Im neuen Weg (Batterie aus Mates Garage) erwähnt der Taxifahrer weder „Vom Taxi“ noch eine Rückgabe;
//     im alten Weg mit geliehener Taxibatterie bleibt beides. Beide Fassungen werden vorher über den echten Spielstand gespeichert und geladen.
// (2) K3-R2-02, Samstagsende: Pflichtfoto fertig, Aufführung vorbereitet (Text und Dinos Erlaubnis), aber nicht gespielt → eigener Warntext
//     beim Abschluss; „Noch nicht“ lässt die Aufführung spielbar, danach ist die Warnung weg. Aufführung ohne Ende, Wiederholung mit Ende offen,
//     nur der Text → je eigener Text; nichts angefangen → keine Warnung. Bewusstes
//     Beenden trotz offener Aufführung bleibt möglich und wird getrennt vermerkt (k3.left.music).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-030', title: 'K3: Batterieherkunft im Epilog (neu/alt) und vorbereitete Aufführung in der Warnliste zum Samstagende', async run(html) {
  const D = await open({ seed: 30, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const settle = async () => { await D.page.waitForTimeout(300); await P.calm(); };
  const saveLoad = async () => { const r = await D.ev(() => { const a = M.API.save(); const key = 'mala.save.' + M.E.slot(); M.__speechLog = []; return a && M.E.loadKey(key); }); await settle(); return r; };
  const taxiTalk = async () => { await D.ev(() => { M.__speechLog = []; }); await P.act('talk', 'taxi'); await P.calm(); return FX.said(D); };
  // (1) neuer Weg: Mates Batterie
  await FX.load(D, 'k3_104_epilogtag.json', { setFlags: { 'k3.rules': 2, 'k3.v.battery': true, 'k3.b.batFrom': 'mate', 'k3.fin.batteryNod': true }, pos: 'ostbus' }); await settle();
  ck(await saveLoad(), 'neuer Weg: gespeichert und geladen');
  ck(await D.flag('k3.b.batFrom') === 'mate' && await D.flag('k3.fin.batteryNod') === true, 'Herkunft und Nicken überstehen das Laden');
  let t = await taxiTalk();
  ck(/Mate Zelenikas Mercedes/.test(t) && !/Vom Taxi/.test(t) && !/Die Batterie bringt Kata/.test(t), 'neuer Weg: keine Taxibatterie, keine Rückgabe (' + t.slice(0, 160) + ')');
  t = await taxiTalk(); ck(!/Vom Taxi|bringt Kata/.test(t), 'auch beim zweiten Ansprechen nicht');
  // (1) alter Weg: geliehene Taxibatterie
  await FX.load(D, 'k3_104_epilogtag.json', { setFlags: { 'k3.rules': 1, 'k3.v.battery': true, 'k3.x.batteryGiven': true, 'k3.fin.batteryNod': true }, pos: 'ostbus' }); await settle();
  ck(await saveLoad(), 'alter Weg: gespeichert und geladen');
  t = await taxiTalk();
  ck(/Vom Taxi/.test(t) && /Die Batterie bringt Kata/.test(t) && !/Mate Zelenikas Mercedes/.test(t), 'alter Weg: „Vom Taxi“ und Rückgabe bleiben');
  // (1) alter Weg ohne Ersatz (schwache Batterie): weder Taxi- noch Mate-Szene
  await FX.load(D, 'k3_104_epilogtag.json', { setFlags: { 'k3.rules': 1 }, pos: 'ostbus' }); await settle();
  t = await taxiTalk(); ck(!/Vom Taxi|bringt Kata|Mate Zelenikas/.test(t), 'ohne Ersatzbatterie: normales Epiloggespräch');
  // (2) Samstag, Regel 2, Pflichtteile fertig, Aufführung vorbereitet
  const sat = { 'k3.rules': 2, 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.s.photoTrip': true, 'k3.s.spot': true, 'k3.s.initials': true, 'k3.s.photo': true, 'k3.x.vaga': true };
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.words': true, 'k3.s.dinoOk': true }, sat), addNotes: ['b3_photo65', 'b3_initials', 'b3_lenaphoto', 's3_words'], pos: 'tepa' }); await settle(); await D.page.waitForTimeout(1200); await P.calm();
  ck(await D.ev(() => M.k3DayReady(M.GS)), 'Samstag reif (Pflichtfoto fertig)');
  let th = await D.ev(() => M.k3OpenThreads(M.GS));
  ck(th.length === 1 && th[0].k === 'music' && /warten an der Brücke/.test(th[0].t), 'offene Liste: die vorbereitete Aufführung ' + JSON.stringify(th));
  await D.ev(() => { M.__speechLog = []; }); await P.travel('herberge'); let s = await D.st();
  ck(!!s.dlg && s.dlg.some(x => /Den Tag beenden/.test(x)) && s.dlg.some(x => /Noch nicht\. Erst das/.test(x)), 'Herberge fragt, mit „Noch nicht. Erst das.“');
  ck(/Die Australier warten an der Brücke/.test(await FX.said(D)), 'Marko nennt die Aufführung vor dem Abschluss');
  await P.choose('Noch nicht'); s = await D.st(); ck(s.phase === 'k3_d2', '„Noch nicht“: Samstag bleibt offen');
  await P.exit('door'); await P.travel('starimost'); await P.act('talk', 'aussie3_b'); await P.choose('Play it'); await P.calm(); if ((await D.st()).dlg) await P.bye('See you');
  ck(await D.flag('k3.s.lenaVerse') && await D.hasNote('s3_verse'), 'die Aufführung findet danach noch statt (Lenas Strophe)');
  th = await D.ev(() => M.k3OpenThreads(M.GS)); ck(th.length === 0, 'danach keine offene Aufführung mehr');
  // (2) Aufführung ohne Ende (Text fehlte): eigener Warntext
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.dinoOk': true, 'k3.s.perf': true }, sat), addNotes: ['b3_photo65', 'b3_initials', 'b3_lenaphoto', 'b3_hum'], pos: 'tepa' }); await settle();
  th = await D.ev(() => M.k3OpenThreads(M.GS)); ck(th.some(x => x.k === 'music' && /beim Fenster stecken geblieben/.test(x.t)), 'Aufführung ohne Ende: „Liam ist … stecken geblieben“');
  // (2) erste Aufführung ohne Ende gehört, danach den Text aufgeschrieben (perf wieder zurückgesetzt): Wiederholung offen
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.dinoOk': true, 'k3.s.words': true }, sat), addNotes: ['b3_photo65', 'b3_initials', 'b3_lenaphoto', 'b3_hum', 's3_words'], pos: 'tepa' }); await settle();
  th = await D.ev(() => M.k3OpenThreads(M.GS)); ck(th.some(x => x.k === 'music' && /noch einmal spielen/.test(x.t)), 'Text nach der ersten Aufführung: „noch einmal spielen. Diesmal mit dem Ende.“');
  // (2) nur der Text, ohne Dinos Erlaubnis
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.words': true }, sat), addNotes: ['b3_photo65', 'b3_initials', 'b3_lenaphoto', 's3_words'], pos: 'tepa' }); await settle();
  th = await D.ev(() => M.k3OpenThreads(M.GS)); ck(th.some(x => x.k === 'music' && /wenn Dino seine Geschichte hat/.test(x.t)), 'nur der Text: Dinos Erlaubnis fehlt noch');
  // (2) nichts angefangen: keine Warnung (die Aufführung bleibt freiwillig)
  await FX.load(D, 'k3x_samstag.json', { setFlags: sat, addNotes: ['b3_photo65', 'b3_initials', 'b3_lenaphoto'], pos: 'tepa' }); await settle();
  th = await D.ev(() => M.k3OpenThreads(M.GS)); ck(th.length === 0, 'nichts angefangen: keine Warnung');
  // (2) bewusst beenden trotz vorbereiteter Aufführung
  await FX.load(D, 'k3x_samstag.json', { setFlags: Object.assign({ 'k3.s.words': true, 'k3.s.dinoOk': true }, sat), addNotes: ['b3_photo65', 'b3_initials', 'b3_lenaphoto', 's3_words'], pos: 'tepa' }); await settle(); await D.page.waitForTimeout(1200); await P.calm();
  await P.travel('herberge'); await D.choose('Den Tag beenden'); for (let i = 0; i < 60; i++) { const x = await D.st(); if (x.phase === 'k3_d2_n' || (x.dlg && x.dlg.some(y => /Mala fragen|Spur/.test(y)))) break; await D.page.waitForTimeout(250); }
  ck(await D.flag('k3.left.music') === true && await D.flag('k3.d2n.started') === true, 'bewusst beendet: Aufführung als zurückgestellt vermerkt (k3.left.music), die Nacht beginnt');
  return { ok, detail: out.join('; ') };
} };
