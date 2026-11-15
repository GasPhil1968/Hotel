// BUG-037 (design/K4_RAETSEL.md): Kapitel 4 bestand fast nur aus Gesprächen. Vier Ketten mit Gegenständen und Zusammenspiel von Marko und Mala.
// (1) Mucki liegt quer auf der Treppe: Marko kommt nicht vorbei (auch nicht mit Gewalt); als Mala mit ihr reden, sie folgt, die Treppe ist frei.
// (2) Der nasse Brief: Obermaier gibt das Kuvert erst mit Name und Schwester; Dampf am Teekessel (und am Herd) öffnet es; ohne Rosas Nummer
//     kein Anruf; Mala hört im Nachhall die Ziffern; Dezemberbrief + Ziffern = Rosas Nummer.
// (3) Die Lampe am Tor: Gerda will am Fenster nicht im Finstern warten; der Papierstern aus dem Gemeinschaftsraum ans Fenster; dann wartet sie dort.
// (4) Winterschlaf: Davors Angebot erst, wenn der Zweig eingewickelt ist; Kaffeesack (Enzo) + Schnur (Kiosk) = Wintermantel.
// (5) Hinweisthemen vorhanden, (6) keine JS-Fehler.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
module.exports = { id: 'BUG-037', title: 'K4: Rätselketten mit Gegenständen und Marko/Mala (Mucki, nasser Brief, Lampe am Tor, Winterschlaf)', async run(html) {
  const D = await open({ seed: 37, html }); const out = []; let all = true;
  const check = (name, ok, extra) => { out.push(name + '=' + ok + (ok || !extra ? '' : ' (' + extra + ')')); if (!ok) all = false; };
  const flag = (k) => D.ev((x) => M.GS.flags[x], k);
  const has = (n) => D.ev((x) => M.GS.notes.indexOf(x) >= 0, n);
  const inv = (i) => D.ev((x) => M.GS.inv.indexOf(x) >= 0, i);
  const room = () => D.ev(() => M.API.room.id);
  const leave = async () => { for (let i = 0; i < 5; i++) { const s = await D.settle(); if (!s.dlg) return; await FX.closeMenu(D); await D.drain(); } };
  // (1) Mucki
  await FX.load(D, 'k4_012_kaffee.json', { pos: 'jhaus', delFlags: ['k4.p.catMoved', 'k4.p.catBlock'] }); await D.settle();
  await D.exit('up'); await D.drain(); check('Mucki blockiert die Treppe', (await room()) === 'jhaus' && !!(await flag('k4.p.catBlock')));
  await D.act('take', 'cat'); await D.drain(); await D.exit('up'); await D.drain(); check('mit Gewalt nicht', (await room()) === 'jhaus');
  await D.switchTo('mala'); await D.act('talk', 'cat'); await D.drain(); await D.switchTo('marko');
  check('Mala führt Mucki weg', !!(await flag('k4.p.catMoved')));
  await D.exit('up'); await D.drain(); check('Treppe frei', (await room()) === 'jwohnung', await room());
  // (2) Der nasse Brief
  await FX.load(D, 'k4_035_ausweis.json', { pos: 'friedamt', delNotes: ['s4_name', 's4_umschlag'] }); await D.settle();
  await D.act('talk', 'obermaier'); await D.choose('Das Kuvert aus seiner Manteltasche'); await D.drain(); await leave();
  check('ohne Name und Schwester kein Kuvert', !(await inv('kuvert')));
  await FX.load(D, 'k4_035_ausweis.json', { pos: 'friedamt', addNotes: ['s4_name', 's4_umschlag'] }); await D.settle();
  await D.act('talk', 'obermaier'); await D.choose('Das Kuvert aus seiner Manteltasche'); await D.drain(); await leave();
  check('Obermaier gibt das Kuvert', await inv('kuvert'));
  const cmb = await D.ev(() => { M.__speechLog = []; return true; }); await D.item('use', 'kuvert', 'olovka'); await D.drain(); check('Kuvert + Kuli: kein Brief', await inv('kuvert'));
  await FX.load(D, 'k4_035_ausweis.json', { pos: 'bmission', addNotes: ['s4_name', 's4_umschlag', 's4_wusste', 's4_bitte'], addInv: ['kuvert'], setFlags: { 'k4.s.kuvert': true, 'k4.s.letters': true } }); await D.settle();
  await D.ev(() => { M.__speechLog = []; M.K4PHONE.carmela(M.API); }); await D.drain();
  const noNum = await FX.said(D); check('ohne Nummer kein Anruf', !(await flag('k4.s.call')) && /Nummer steht auf keinem/.test(noNum), noNum.slice(0, 120));
  await D.act('use', 'counter', 'kuvert'); await D.drain();
  check('Teekessel: Dezemberbrief', (await inv('brief_dez')) && !(await inv('kuvert')) && (await has('s4_dezember')));
  await D.act('give', '_mala', 'brief_dez'); await D.drain(); check('Mala hört die Ziffern', await has('s4_ziffern'));
  const cr = await D.combine('s4_dezember', 's4_ziffern'); check('Dezemberbrief + Ziffern = Rosas Nummer', !!(cr && cr.ok) && (await has('s4_nummer')), JSON.stringify(cr));
  await FX.load(D, 'k4_035_ausweis.json', { pos: 'jwohnung', addNotes: ['s4_name', 's4_umschlag'], addInv: ['kuvert'], setFlags: { 'k4.s.kuvert': true } }); await D.settle();
  await D.act('use', 'stove', 'kuvert'); await D.drain(); check('auch am Herd', await inv('brief_dez'));
  // (3) Die Lampe am Tor
  await FX.load(D, 'k4_060_nach_versuch1.json', { pos: 'heim_flur', addNotes: ['g4_depot'], setFlags: { 'k4.g.pmPhase': 'x' }, delFlags: ['k4.g.lamp', 'k4.g.lampAsk', 'k4.g.starTaken'] }); await D.settle();
  await D.switchTo('mala'); await D.act('talk', 'gerda'); await D.choose('Sie haben immer draußen gewartet'); await D.drain(); await leave(); await D.switchTo('marko');
  check('Gerda: im Finstern nicht', !!(await flag('k4.g.lampAsk')) && !(await flag('k4.g.hall')));
  await D.exit('door_raum'); await D.drain(); await D.act('take', 'window'); await D.drain(); check('Stern genommen', await inv('stern'));
  await D.exit('door'); await D.drain(); await D.act('use', 'window', 'stern'); await D.drain(); check('Stern am Fenster', !!(await flag('k4.g.lamp')) && !(await inv('stern')));
  await D.switchTo('mala'); await D.act('talk', 'gerda'); await D.choose('Am Fenster brennt jetzt ein Licht'); await D.drain(); await leave(); await D.switchTo('marko');
  check('Gerda wartet am Fenster', !!(await flag('k4.g.hall')));
  // (4) Winterschlaf
  await FX.load(D, 'k4_060_nach_versuch1.json', { pos: 'barsport', setFlags: { 'k4.v.called': true, 'k4.v.visit': true, 'k4.v.jela': true, 'k4.v.jute': true }, delFlags: ['k4.v.car', 'k4.v.wrapped'] }); await D.settle();
  await D.act('talk', 'enzo'); await D.choose('Haben Sie einen leeren Kaffeesack'); await D.drain(); await leave(); check('Enzos Kaffeesack', await inv('jute'));
  await D.travel('hbf'); await D.act('talk', 'kioskg'); await D.choose('Die Schnur von den Zeitungsbündeln'); await D.drain(); await leave(); check('Schnur vom Kiosk', await inv('schnur'));
  await D.item('use', 'jute', 'schnur'); await D.drain(); check('Wintermantel', (await inv('wintermantel')) && !(await inv('jute')));
  await D.travel('moosach'); await D.drain(); check('ohne Mantel kein Angebot', !(await flag('k4.v.car')));
  await D.act('use', 'pot', 'wintermantel'); for (let i = 0; i < 4; i++) { const s = await D.settle(); if (!s.dlg) break; if (s.dlg.some(t => /Silvester/.test(t))) await D.choose('Vielleicht an Silvester'); else await FX.closeMenu(D); }
  await D.drain(); check('eingewickelt, dann Davors Angebot', !!(await flag('k4.v.wrapped')) && !!(await flag('k4.v.car')));
  // (5) Hinweise
  const hs = await D.ev(() => ['h4m', 's4n', 'g4l', 'v4w'].filter(id => !M.HINTS_K4.find(h => h.id === id)));
  check('Hinweisthemen', !hs.length, hs.join(','));
  const errs = (D.errors || []).filter(e => !/^console\.error: .*Kunst fehlt/.test(e)); check('keine JS-Fehler', !errs.length, errs.slice(0, 3).join(' | '));
  if (D.close2) await D.close2(); return { ok: all, detail: out.join('; ') }; } };
