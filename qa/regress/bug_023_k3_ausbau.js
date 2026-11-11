// BUG-023 (design/K3_AUSBAU.md): die neuen Ketten des Kapitel-3-Ausbaus laufen über Spielerhandlungen durch:
// N2 das Lied (Liam, Strophen ordnen, Jela schickt zur Brücke, Dinos Regel, Lenas Strophe, Mate erkennt Davor darüber),
// N1 Vera (Katas Blatt, Vorstellung, das Bett, die Waage, Brief übersetzen, Vlado liest, Vera am Rolltor), N3 Mates Mappe (Schublade, Lena im Café, Davor verschiebt),
// N5 der Bleistift (Zlatas Entscheidung, Mala), N4 die Waage an Zlatas Tür. Stände: Abschnittsbeginne der Musterlösung (k3x_*.json).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-023', title: 'K3-Ausbau: Lied, Vera, Mappe, Waage, Bleistift über Spielerhandlungen', async run(html) {
  const D = await open({ seed: 23, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const flag = (k) => D.flag(k); const has = (id) => D.hasNote(id); const inv = async (id) => (await D.st()).inv.indexOf(id) >= 0;
  const load = async (name, spec) => { await FX.load(D, name, spec || {}); await D.page.waitForTimeout(300); return P.calm(); };
  // A Freitagnacht: Liam will den Text
  await load('k3x_freitag_nacht.json'); await P.talk('aussie3', 'What’s that song', 'Übersetzen'); await P.bye('Good night');
  await P.talk('aussie3', 'Do you want the words'); await P.arrange(); await P.bye('Good night'); ck(await flag('k3.s.words') && await has('s3_words'), 'Zettel');
  // B Samstag: Katas Blatt, Vera, Waage, Jela, Brücke
  await load('k3x_samstag.json', { setFlags: { 'k3.s.words': true } });
  await P.exit('door'); await P.travel('bulevar'); await P.exit('to_vulk'); await P.talk('kata', 'Haben Sie den Typenschein gefunden'); await P.bye('(Gehen.)'); ck(await has('v3_blatt'), 'v3_blatt');
  await P.exit('door'); await P.travel('herberge'); await P.talk('maja'); await P.bye('Danke', 'Bis später', '(Gehen.)', 'Gut'); await D.ev(() => { M.GS.map.tepa = true; });
  await P.travel('tepa'); await P.talk('susjeda', 'Sie sind Vera Rajić'); await P.bye('Danke'); ck(await flag('met.vera'), 'Vera');
  await P.talk('susjeda', 'Ihr Bruder. Im Januar'); await P.bye('Danke'); ck(await has('v3_bed'), 'v3_bed');
  await P.comb('l3_ljerka_pic', 'k3_c_name', 'l3_onetrail'); await P.talk('zlata', 'Kennen Sie Lana'); await P.bye('Doviđenja'); await P.talk('zlata', 'Kannten Sie eine Mala', 'Ein Freund'); await P.calm();
  await P.talk('susjeda', 'Wohin ist sie gegangen'); await P.bye('Danke'); ck(await inv('vaga'), 'Waage');
  await P.travel('bulevar'); await P.exit('to_vulk'); await P.ask('vlado', 'v3_bed'); await P.bye('(Gehen.)'); ck(await flag('k3.v.bedHeard'), 'Vlado hört vom Bett');
  await P.exit('door'); await P.travel('westbus'); await P.calm(); if (await D.ev(() => !!M.E.dlg)) await P.choose('Ich komme mit'); await P.calm();
  await P.travel('zelenika'); await P.calm(); if (await D.ev(() => !!M.E.dlg)) await P.choose('Jetzt kommt er'); await P.calm();
  // Regel 2 (Samstagsstände wechseln dorthin): Jela schickt die beiden mit dem Foto von 1965 selbst an die Brücke
  ck(await flag('k3.rules') === 2 && await flag('k3.s.trip') && await has('b3_photo65'), 'Jela schickt (mit dem Foto)');
  await P.travel('starimost'); await P.calm(); await P.talk('aussie3_b', 'Play it'); await P.bye('See you'); ck(!(await flag('k3.s.dinoOk')), 'ohne Dino kein Spiel');
  await P.talk('dino', 'Die Australier wollen am Brückenkopf spielen', 'NOTE:b3_mate'); await P.bye('Bis später'); ck(await flag('k3.s.dinoOk'), 'Dinos Geschichte');
  await P.talk('aussie3_b', 'Play it'); await P.bye('See you'); ck(await flag('k3.s.lenaVerse') && await has('b3_hum') && await has('s3_verse'), 'Lenas Strophe');
  // C Samstagnacht: richtig gesungen, die Waage an Zlatas Tür
  await load('k3x_samstag_nacht.json', { addInv: ['vaga'], setFlags: { 'k3.s.words': true } });
  await P.exit('door'); await P.travel('starimost'); await P.calm(); await P.exit('exit'); await P.travel('herberge'); await P.calm(); ck(/Schön richtig/.test(await FX.said(D)), 'Schön richtig');
  await P.travel('skela'); await P.mala(); await P.act('look', 'far_shed'); await P.marko(); await P.exit('to_bridge'); await P.exit('exit_l'); await P.talk('bato'); await P.bye('(Gehen.)'); await P.calm();
  ck(await flag('k3.z.vaga') && await flag('k3.z.tomorrow'), 'Waage übergeben, Sutra');
  // D Sonntag: Strophe, Tor, Café, Mappe, Brief, Bleistift
  await load('k3x_sonntag.json', { setFlags: { 'k3.s.lenaVerse': true, 'k3.s.trip': true, 'k3.s.words': true, 'met.vera': true, 'k3.x.vera': true }, addNotes: ['v3_blatt', 'v3_bed', 's3_verse', 'b3_hum'] });
  await P.exit('door'); await P.travel('zelenika'); await P.calm(); await P.exit('house_door'); await P.talk('davor', 'Darf ich die Briefe lesen'); await P.bye('(Gehen.)'); await P.act('use', 'stairs'); await P.calm(); await P.act('open', 'drawer'); await P.calm();
  await P.comb('b3_letters', 'b3_kidsroom', 'b3_invite'); await P.talk('davor', 'Kad ćete doći'); await P.calm(); ck(await flag('k3.b.invite'), 'Einladung');
  await P.talk('lena', 'Du wolltest deinem Großvater', '(Ihm die Zeile vom Fenster singen.)'); await P.calm(); ck(await flag('k3.b.son') && await flag('k3.s.byVerse'), 'Erkenntnis über die Strophe');
  await P.talk('lena', 'Stell dich ans Tor'); await P.calm(); ck(await flag('k3.b.dead'), 'nicht mehr da');
  await P.travel('westbus'); await P.exit('cafe_door'); await P.mala(); await P.act('look', 'bar_drawer'); await P.marko(); ck(await has('b3_folder'), 'b3_folder');
  await P.ask('zdravko', 'b3_folder'); await P.bye('Danke'); await P.exit('door'); await P.travel('zelenika'); await P.talk('lena', 'Zdravkos Café am Westbusbahnhof'); await P.calm(); ck(await flag('k3.s.lenaCafe'), 'Lena ins Café');
  await P.travel('westbus'); await P.exit('cafe_door'); await P.calm(); ck(await flag('k3.b.folder') && await inv('mapa_mate') && await has('b3_coming'), 'Mappe');
  await P.exit('door'); await P.travel('zelenika'); await P.act('give', 'davor', 'mapa_mate'); await P.calm(); ck(await flag('k3.b.noSale'), 'Verkauf verschoben');
  await D.ev(() => { M.API.note('v3_who', true); M.GS.flags['k3.v.part2'] = true; M.GS.flags['k3.v.yard'] = true; });
  await P.travel('tepa'); await P.talk('susjeda', 'Kata braucht das Werkspapier'); await P.bye('Danke'); await P.talk('susjeda', 'Dann schreiben Sie ihm'); await P.solve([1, 1, 1, 2]); await P.calm(); ck(await inv('pismo'), 'Brief');
  await P.travel('bulevar'); await P.exit('to_vulk'); await P.act('give', 'vlado', 'pismo'); await P.calm(); ck(await flag('k3.v.veraLetter'), 'Vlado liest');
  await P.exit('door'); await P.travel('skela'); await P.exit('to_bridge'); await P.exit('exit_l'); await P.calm();
  await P.talk('zlata', 'Gab es hier eine Mala'); await P.bye('Danke'); await P.talk('zlata', 'Und Ihr Mann'); await P.bye('Danke'); await P.talk('zlata', 'Was lag morgens an der Glocke'); await P.bye('Danke');
  await D.ev(() => { M.API.note('l3_twosearches', true); }); await P.talk('zlata', 'Der Bleistift. Darf ich', 'Ihre Mutter'); await P.calm(); await P.bye('Danke'); ck(await inv('olovka_mala'), 'Bleistift');
  await P.exit('to_bridge'); await P.exit('exit_d'); await P.act('give', '_mala', 'olovka_mala'); await P.calm(); ck(await has('a3_mypencil'), 'Malas Bleistift');
  // E Finale: Vera am Rolltor
  await load('k3x_finale.json', { setFlags: { 'k3.v.veraLetter': true } }); if (await P.dlgHas('Einsteigen')) await P.choose('(Einsteigen.)'); await P.calm(); ck(await flag('k3.fin.vera') && await flag('k3.fin.departed'), 'Vera am Tor, Abfahrt');
  const errs = await D.ev(() => M.__errors || []); ck(!errs.length, 'JS-Fehler: ' + errs.length);
  return { ok, detail: out.join('; ') };
} };
