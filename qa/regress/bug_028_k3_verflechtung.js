// BUG-028 (Prüfbericht K3, Abschnitt 6 und 7: Fallverflechtung A–B–A und die geteilte Stadt als Lösungsweg), Regel 2, Sonntag.
// A → B: Batos Plane gibt es erst, wenn Bato die Wahrheit gehört hat; ohne Plane wird die große Feige nicht eingepackt.
// B → A: Mates Schlüsselring trägt den Garagenschlüssel; der alte Straßenname führt nur über den Kartenvergleich zur Garage (falsche Straßen
// mit Begründung); an fremden Toren schließt Marko nicht ohne Malas Blick; Mates Batterie macht den TAM fahrbereit, ohne sie ist der
// Sonntag nicht reif. Das Taxi bietet in Regel 2 keine Batterie an. K3-05: Kata nennt die Batterie in Regel 2 „tot“.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-028', title: 'K3 Regel 2: Plane → Feigen → Garage → Batterie → TAM (A–B–A), Straßenname', async run(html) {
  const D = await open({ seed: 28, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const inv = async (i) => (await D.st()).inv.includes(i);
  const base = { 'k3.rules': 2, 'k3.n3.bato.awake': true, 'k3.n3.bato.girl': true, 'k3.b.invite': true, 'k3.b.son': true, 'k3.b.dead': true, 'k3.s.photo': true, 'k3.b.doubt': true, 'k3.v.free': true };
  const notes = ['a3_awake', 'a3_girl', 'b3_tarp', 'b3_invite', 'b3_dida'];
  // A → B: vor der Konfrontation keine Plane
  await FX.load(D, 'k3x_sonntag.json', { setFlags: base, addNotes: notes }); await D.page.waitForTimeout(300); await P.calm();
  await P.exit('door'); await P.travel('skela'); await P.exit('to_bridge'); await P.exit('exit_l');
  await P.act('take', 'ponton'); ck(!(await inv('cerada')) && await D.hasNote('a3_tarp'), 'Bato bewacht die Plane (vor der Konfrontation)');
  await P.talk('bato', 'Die Plane auf dem Ponton'); await P.bye('(Gehen.)'); ck(!(await D.flag('k3.a.tarpOk')), 'Bato gibt sie vor der Konfrontation nicht her');
  await D.ev(() => { M.GS.flags['k3.bato.uneasy'] = true; });
  await P.talk('bato', 'Die Plane auf dem Ponton'); await P.bye('(Gehen.)'); ck(await D.flag('k3.a.tarpOk'), 'nach der Konfrontation: „Nimm sie.“');
  await P.act('take', 'ponton'); ck(await inv('cerada') && await D.flag('k3.a.tarp'), 'Plane genommen');
  // ohne Plane keine Feigen (zweiter Stand), mit Plane schon
  await FX.load(D, 'k3x_sonntag.json', { setFlags: base, addNotes: notes, pos: 'zelenika' }); await D.page.waitForTimeout(300); await P.calm();
  await P.talk('jela', 'Zeigen Sie ihm, wie man die Feigen'); await P.calm(); ck(!(await D.flag('k3.b.figs')), 'ohne Plane: Jela sagt, wofür sie fehlt'); if ((await D.st()).dlg) await P.bye('(Gehen.)', 'Doviđenja', 'Hvala');
  await FX.load(D, 'k3x_sonntag.json', { setFlags: Object.assign({ 'k3.a.tarp': true }, base), addNotes: notes, addInv: ['cerada'], pos: 'zelenika' }); await D.page.waitForTimeout(300); await P.calm();
  await P.talk('jela', 'Zeigen Sie ihm, wie man die Feigen', 'Von unten nach oben'); await P.calm(); if ((await D.st()).dlg) await P.bye('(Gehen.)', 'Doviđenja', 'Hvala');
  ck(await D.flag('k3.b.figs') && await D.flag('k3.b.tarpOn') && !(await inv('cerada')) && await D.flag('k3.b.keyFree'), 'mit Plane: Feigen eingepackt, Mate legt den Schlüssel ab');
  // B → A: Garagenschlüssel, Straßenname, Garage, Batterie
  await P.act('take', 'fork'); await D.act('use', 'lena', 'kljuc_mate'); await P.calm(); if ((await D.st()).dlg) await P.bye('(Gehen.)', 'Wenn er will', 'Bis an den Rand');
  if ((await D.st()).active === 'mala') await P.marko();
  ck(await inv('kljuc_garaza') && await D.hasNote('b3_garage'), 'kleiner Schlüssel: Mates Garage „u Bratstva i jedinstva“');
  ck(!(await D.ev(() => !!M.GS.map.garaze)), 'die Garage steht noch auf keinem Plan');
  await P.exit('exit'); await P.travel('westbus'); await P.exit('cafe_door'); await D.act('use', 'oldmap', 'plan'); await D.until(s => s.overlay === 'karte85', 30000, 'Kartenvergleich');
  const tap = async (id) => { await P.tapHit(id); return D.ev(() => M.E.overlay ? M.E.overlay.data : null); };
  const rb = await tap('st_b'), rc = await tap('st_c'), rd = await tap('st_d');
  ck(rb && rb.bad && /Postblock/.test(rb.msg) && rc && rc.bad && /gleich/.test(rc.msg) && rd && rd.bad && /quer/.test(rd.msg), 'drei falsche Straßen mit geometrischer Begründung');
  const ra = await tap('st_a'); ck(ra && ra.done, 'die Lipova'); await P.tapHit('go'); await P.calm();
  ck(await D.hasNote('b3_street') && await D.ev(() => !!M.GS.map.garaze), 'Notiz „Ein alter Name“, Garagen auf dem Plan');
  await P.exit('door'); await P.travel('garaze'); ck((await D.st()).room === 'garaze', 'in der Lipova');
  await P.act('use', 'g4', 'kljuc_garaza'); ck(!(await D.flag('k3.b.garageOpen')), 'an fremden Toren nicht ohne Wissen');
  await P.mala(); await P.act('look', 'g3'); ck(!(await D.flag('k3.b.g7')), 'Mala: das dritte ist es nicht'); await P.act('look', 'g4'); ck(await D.flag('k3.b.g7'), 'Mala: hinter dem vierten der Mercedes'); await P.marko();
  await P.act('use', 'g4', 'kljuc_garaza'); ck(await D.flag('k3.b.garageOpen'), 'Garage sieben offen');
  await P.act('take', 'battery'); ck(!(await inv('akumulator')), 'ohne offene Haube keine Batterie (Stelle unsichtbar oder Hinweis)');
  await P.act('open', 'hood'); await P.act('take', 'battery'); ck(await inv('akumulator') && await D.flag('k3.b.batFrom') === 'mate', 'Mates Batterie');
  await P.exit('exit'); await P.travel('ostbus'); const taxiOpt = await D.ev(() => { const r = M.E.room.byId.taxi || M.E.room.byId.taxifahrer; return !!r; });
  await P.act('talk', (await D.ev(() => (M.E.room.byId.taxi ? 'taxi' : (M.E.room.byId.taxifahrer ? 'taxifahrer' : 'driver'))))).catch(() => {}); const opts = (await D.st()).dlg || []; if ((await D.st()).dlg) await FX.closeMenu(D); await P.calm();
  ck(!opts.some(t => /Batterie/.test(t)), 'Taxi bietet in Regel 2 keine Batterie an' + (taxiOpt ? '' : ' (keine Taxi-Stelle gefunden)'));
  await P.travel('bulevar'); await P.exit('to_vulk'); await D.act('use', 'kata', 'akumulator'); await P.calm(); if ((await D.st()).dlg && (await D.st()).dlg.some(t => /Es ist Zeit/.test(t))) { /* Abschluss erscheint erst, wenn alles erledigt ist */ }
  ck(await D.flag('k3.v.battery'), 'Kata baut Mates Batterie ein');
  ck(/Zelenika/.test(await FX.said(D)), 'Kata nennt die Herkunft');
  // K3-05: Katas Satz zur Batterie je Regel
  await FX.load(D, 'k3x_sonntag.json', { setFlags: { 'k3.rules': 2, 'k3.v.free': true }, pos: 'bulevar' }); await D.page.waitForTimeout(300); await P.calm(); await P.exit('to_vulk');
  await P.talk('kata', 'Fährt er wirklich'); await P.bye('(Gehen.)'); ck(/tot wie ein Stein/.test(await FX.said(D)) && /Ohne Ersatz/.test(await D.ev(() => M.NOTES.v3_battery.t)), 'Regel 2: tot, Notiz passt');
  await FX.load(D, 'k3x_sonntag.json', { setFlags: { 'k3.rules': 1, 'k3.v.free': true }, pos: 'bulevar' }); await D.page.waitForTimeout(300); await P.calm(); await P.exit('to_vulk');
  await P.talk('kata', 'Fährt er wirklich'); await P.bye('(Gehen.)'); ck(/schwach/.test(await FX.said(D)) && /schwach/.test(await D.ev(() => M.NOTES.v3_battery.t)), 'Regel 1: schwach, Notiz passt');
  return { ok, detail: out.join('; ') };
} };
