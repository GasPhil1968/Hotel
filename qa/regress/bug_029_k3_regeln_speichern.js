// BUG-029 (Prüfbericht K3: Spielstände, Migration, Speicherung an Zwischenständen):
// (1) Migration: Stände bis Samstag laufen nach Regel 2, ab Samstagnacht nach Regel 1; neue Spiele beginnen mit Regel 2.
// (2) Regel 1 bleibt spielbar: Feigen mit Jute ohne Plane, Mates Erkenntnis ohne Fotos, Taxi bietet die Batterie an.
// (3) Speichern/Laden über den echten Spielstand (M.API.save → mala.save.<platz> → M.E.loadKey) mitten in den neuen Ketten:
//     unter der Brücke nach dem Standort (Mala sieht danach die Buchstaben), in der Garage mit offenem Tor und offener Haube.
// (4) Veras Menü (K3-03): Nach „Sie sind Vera Rajić?“ stehen die neuen Fragen im selben Gespräch.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-029', title: 'K3: Regelversion/Migration, Regel 1 spielbar, Speichern mitten in den neuen Ketten, Veras Menü', async run(html) {
  const D = await open({ seed: 29, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const settle = async () => { await D.page.waitForTimeout(300); await P.calm(); };
  const saveLoad = async () => { const r = await D.ev(() => { const ok1 = M.API.save(); const key = 'mala.save.' + M.E.slot(); return { ok1, ok2: M.E.loadKey(key) }; }); await settle(); return r; };
  // (1)
  for (const [fx, want] of [['k3x_freitag_nacht.json', 2], ['k3x_samstag.json', 2], ['k3x_samstag_nacht.json', 1], ['k3x_sonntag.json', 1]]) { await FX.load(D, fx, {}); await settle(); ck(await D.flag('k3.rules') === want, fx + ' → Regel ' + want + ' (ist ' + (await D.flag('k3.rules')) + ')'); }
  const fresh = await D.ev(() => { const G = M.freshGame(); G.phase = 'k3_pro'; M.migrateAll(G); return G.flags['k3.rules']; }); ck(fresh === 2, 'frischer Stand im Prolog → Regel 2');
  // (2) Regel 1
  await FX.load(D, 'k3x_sonntag.json', { setFlags: { 'k3.b.invite': true, 'k3.b.son': true, 'k3.b.dead': true }, addNotes: ['b3_invite', 'b3_dida'], pos: 'zelenika' }); await settle();
  await P.talk('jela', 'Zeigen Sie ihm, wie man die Feigen', 'Von unten nach oben'); await P.calm(); if ((await D.st()).dlg) await P.bye('(Gehen.)', 'Doviđenja', 'Hvala');
  ck(await D.flag('k3.b.figs') && !(await D.flag('k3.b.tarpOn')), 'Regel 1: Feigen mit Jute, ohne Plane');
  await FX.load(D, 'k3x_sonntag.json', { setFlags: { 'k3.b.invite': true }, addNotes: ['b3_invite', 'b3_dida'], pos: 'zelenika' }); await settle(); await D.ev(() => { M.GS.flags['found.mate'] = true; });
  await P.talk('lena', 'Du wolltest deinem Großvater', 'Došli smo, dida'); await P.calm(); ck(await D.flag('k3.b.son'), 'Regel 1: Erkenntnis ohne Fotos'); if ((await D.st()).dlg) await P.bye('(Gehen.)');
  await FX.load(D, 'k3x_sonntag.json', { addNotes: ['v3_battery'], pos: 'ostbus' }); await settle();
  const hasTaxi = await D.ev(() => !!M.E.room.byId.taxi); if (hasTaxi) { await P.act('talk', 'taxi'); const o = (await D.st()).dlg || []; ck(o.some(t => /Batterie/.test(t)), 'Regel 1: Taxi bietet die Batterie an'); if ((await D.st()).dlg) await FX.closeMenu(D); await P.calm(); } else ck(false, 'Taxi-Stelle am Ostbusbahnhof gefunden');
  // (3a) unter der Brücke: Standort gefunden, speichern, laden, Mala sieht die Buchstaben
  await FX.load(D, 'k3x_samstag.json', { setFlags: { 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.s.photoTrip': true, 'k3.s.down': true, 'k3.s.spot': true }, addInv: ['foto_1965'], addNotes: ['b3_photo65'], pos: 'podmost' }); await settle();
  let sl = await saveLoad(); ck(sl.ok1 && sl.ok2, 'unter der Brücke gespeichert und geladen');
  ck((await D.st()).room === 'podmost' && await D.flag('k3.s.spot') && (await D.st()).inv.includes('foto_1965'), 'Raum, Standort und Foto erhalten');
  await P.mala(); await P.act('look', 'block'); ck(await D.flag('k3.s.initials'), 'nach dem Laden: Mala sieht „M · D · 1965“'); await P.marko();
  await P.act('talk', 'davor_p'); await P.calm(); ck(await D.flag('k3.s.photo'), 'nach dem Laden: Lenas Foto');
  // (3b) Garage: Tor und Haube offen, speichern, laden, Batterie nehmen
  await FX.load(D, 'k3x_sonntag.json', { setFlags: { 'k3.rules': 2, 'k3.b.garageOpen': true, 'k3.b.g7': true }, addNotes: ['b3_street', 'b3_garage'], rooms: { garaze: { g7open: true, hood: true } }, pos: 'garaze' }); await settle();
  sl = await saveLoad(); ck(sl.ok1 && sl.ok2, 'in der Garage gespeichert und geladen');
  const gs = await D.ev(() => Object.assign({}, M.GS.rooms.garaze)); ck(gs.g7open && gs.hood && !gs.batTaken, 'Tor und Haube bleiben offen ' + JSON.stringify(gs));
  await P.act('take', 'battery'); ck((await D.st()).inv.includes('akumulator'), 'nach dem Laden: Batterie genommen');
  sl = await saveLoad(); ck((await D.st()).inv.includes('akumulator') && await D.ev(() => !!M.GS.rooms.garaze.batTaken) && await D.flag('k3.b.batFrom') === 'mate', 'Batterie und Herkunft überstehen Speichern/Laden');
  // (4) Veras Menü
  await FX.load(D, 'k3x_samstag.json', { addNotes: ['v3_blatt', 'v3_who'], setFlags: { 'k3.z.mala': true }, pos: 'tepa' }); await settle();
  await P.act('talk', 'susjeda'); await P.choose('Sie sind Vera Rajić'); const o4 = (await D.st()).dlg || [];
  ck(o4.some(t => /Ihr Bruder\. Im Januar/.test(t)) && o4.some(t => /Werkspapier/.test(t)) && !o4.some(t => /Sie sind Vera Rajić/.test(t)), 'Vera: neue Fragen im selben Gespräch ' + JSON.stringify(o4));
  if (o4.length) await P.choose('Kata braucht das Werkspapier'); const o5 = (await D.st()).dlg || [];
  ck(o5.some(t => /Dann schreiben Sie ihm/.test(t)), 'Vera: Briefangebot im selben Gespräch ' + JSON.stringify(o5));
  if ((await D.st()).dlg) await P.bye('Danke');
  return { ok, detail: out.join('; ') };
} };
