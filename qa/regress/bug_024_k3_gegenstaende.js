// BUG-024 (design/K3_AUSBAU.md, Gegenstandsrätsel): Handschuhfach und Fahrtenbuch (Schraubenzieher, Kassette, Vlado), Batos Blechkiste
// (Malas Blick, Zlatas Schlüssel, das Fährbuch als Beleg, Schluss a3_book+a3_slept), der Mehlsack, die Spendertafel, die Batterie vom Taxi (Finale).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-024', title: 'K3-Gegenstandsrätsel: Fahrtenbuch, Fährbuch, Mehlsack, Spendertafel, Batterie', async run(html) {
  const D = await open({ seed: 24, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const flag = (k) => D.flag(k); const has = (id) => D.hasNote(id); const inv = async (id) => (await D.st()).inv.indexOf(id) >= 0;
  const load = async (name, spec) => { await FX.load(D, name, spec || {}); await D.page.waitForTimeout(300); return P.calm(); };
  // A Sonntag im Hof: Mala sieht ins Handschuhfach, Schraubenzieher, Fahrtenbuch, Kassette, Vlado
  await load('k3x_sonntag.json', { setFlags: { 'k3.v.yard': true }, addNotes: ['v3_where'] });
  await P.exit('door'); await P.travel('bulevar'); await P.exit('to_vulk'); await P.act('take', 'machine'); await P.calm(); ck(await inv('odvijac'), 'Schraubenzieher');
  await P.exit('yard_door'); await P.at('vhof'); await P.mala(); await P.act('look', 'cab'); await P.marko(); ck(await has('v3_glove'), 'Mala: Handschuhfach');
  await P.act('open', 'cab'); await P.calm(); await P.act('use', 'glove', 'odvijac'); await P.calm(); ck(await inv('putni_nalog'), 'Fahrtenbuch');
  await D.ev(() => { M.ITEMS.putni_nalog.read(M.API); return 1; }); await P.calm(); ck(await has('v3_log'), 'v3_log');
  await P.act('use', 'radio', 'odvijac'); await P.calm(); ck(await inv('kaseta'), 'Kassette');
  await P.exit('door'); await P.ask('vlado', 'v3_log'); await P.bye('(Gehen.)', 'Bis elf'); ck(await flag('k3.v.logShown') && await has('v3_two'), 'Vlado: Mein Buch, zwei Uhr');
  // B Batterie: Kata, Taxi, Kassette im Taxi, Kata
  await D.ev(() => { M.GS.flags['k3.v.free'] = true; M.API.note('v3_tonight', true); });
  await P.talk('kata', 'Fährt er wirklich'); await P.bye('(Gehen.)'); ck(await has('v3_battery'), 'v3_battery');
  await P.exit('door'); await P.travel('ostbus'); await P.talk('taxist', 'Haben Sie eine Batterie'); await P.bye('Danke'); ck(await inv('akumulator'), 'Batterie vom Taxi');
  await P.act('use', 'taxi', 'kaseta'); await P.calm(); ck(await has('v3_tape'), 'Kassette im Taxi');
  await P.travel('bulevar'); await P.exit('to_vulk'); await P.act('give', 'kata', 'akumulator'); await P.calm(); ck(await flag('k3.v.battery'), 'Kata: zwei Batterien');
  // C Skela: Spendertafel, Mehlsack, Batos Kiste, Fährbuch, Bato, Schluss
  await P.exit('door'); await P.travel('skela'); await P.at('skela_d'); await P.act('take', 'hut'); await P.calm(); ck(await inv('vreca') && await has('v3_sack'), 'Mehlsack');
  await P.exit('to_bridge'); await P.act('read', 'plaque'); await P.calm(); ck(await has('a3_donor'), 'Spendertafel: V. Rajić');
  await P.exit('exit_d'); await P.mala(); await P.act('look', 'far_shed'); await P.marko(); ck(await has('a3_box'), 'Mala: Blechkiste drüben'); await P.exit('to_bridge'); await P.exit('exit_l'); await P.calm();
  await P.talk('zlata', 'Batos Kiste'); await P.bye('Danke'); ck(await inv('kljucic'), 'Schlüssel von Zlata');
  await P.act('use', 'shed', 'kljucic'); await P.calm(); ck(await inv('knjiga_skele'), 'Fährbuch');
  await D.ev(() => { M.ITEMS.knjiga_skele.read(M.API); return 1; }); await P.calm(); ck(await has('a3_book') && await has('a3_asked'), 'a3_book, a3_asked');
  await P.talk('zlata', 'Und Ihr Mann'); await P.bye('Danke'); await P.comb('a3_book', 'a3_slept', 'a3_awake');
  await P.ask('bato', 'a3_book'); await P.bye('(Gehen.)'); ck(await flag('k3.n3.bato.book') && await flag('k3.n3.bato.awake'), 'Bato: Mein Buch');
  // D Vlado: Mehlsack, Tafel
  await P.exit('to_bridge'); await P.exit('exit_d'); await P.travel('bulevar'); await P.exit('to_vulk'); await P.act('give', 'vlado', 'vreca'); await P.calm(); ck(await flag('k3.v.sack'), 'Vlado: Mein Mehl');
  await P.ask('vlado', 'a3_donor'); await P.bye('(Gehen.)', 'Bis elf'); ck(await flag('k3.v.donor'), 'Vlado: zweihundert Mark');
  // E Finale mit Batterie
  await load('k3x_finale.json', { setFlags: { 'k3.v.battery': true } }); if (await P.dlgHas('Einsteigen')) await P.choose('(Einsteigen.)'); await P.calm(); ck(await flag('k3.fin.batteryNod') && await flag('k3.fin.departed'), 'Finale: beim ersten Mal, genickt');
  const errs = await D.ev(() => M.__errors || []); ck(!errs.length, 'JS-Fehler: ' + errs.length);
  return { ok, detail: out.join('; ') };
} };
