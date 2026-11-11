// BUG-027 (Prüfbericht K3, Abschnitt 6: räumliche Brückenkonstruktion mit beiden Figuren): Regel 2, Samstag.
// Davor gibt das Foto an der Brücke; unter der Brücke vergleicht Marko das Foto an den Felsen (jede falsche Wahl mit eigener Begründung);
// Mala sieht unter dem Quader erst etwas, wenn der Standort gefunden ist; Davor setzt sich erst, wenn er die Buchstaben kennt; Lenas Foto
// macht den Samstag reif. Sonntag: Mate erkennt seinen Sohn erst mit den Fotos (dida allein reicht in Regel 2 nicht).
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-027', title: 'K3 Regel 2: Fotostandort unter der Brücke (Marko vergleicht, Mala sieht durch den Quader)', async run(html) {
  const D = await open({ seed: 27, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const compare = async (rk) => { await D.act('use', rk, 'foto_1965'); await D.until(s => s.overlay === 'foto65', 20000, 'Vergleich ' + rk); const msg = await D.ev(() => M.E.overlay.data.msg); await D.ev(() => M.E.closeOverlay(true)); await P.calm(); return msg; };
  await FX.load(D, 'k3x_samstag.json', { setFlags: { 'k3.z.mala': true, 'k3.v.part1': true, 'k3.b.arrived': true, 'k3.b.jela': true, 'k3.s.trip': true, 'k3.s.photoTrip': true }, addNotes: ['b3_photo65'], pos: 'starimost' });
  await D.page.waitForTimeout(300); await P.calm();
  ck(await D.flag('k3.rules') === 2, 'Samstagsstand läuft nach Regel 2');
  ck(!(await D.ev(() => M.k3DayReady(M.GS))), 'ohne Lenas Foto ist der Samstag nicht reif');
  await P.talk('davor_b', 'Zeigen Sie mir das Foto'); await P.calm(); ck((await D.st()).inv.includes('foto_1965') && await D.flag('k3.s.down'), 'Foto bekommen, die beiden gehen hinunter');
  await P.exit('down'); ck((await D.st()).room === 'podmost', 'unter der Brücke');
  await P.mala(); await P.act('look', 'block'); ck(!(await D.flag('k3.s.initials')), 'Mala vor dem Standort: keine Buchstaben'); await P.marko();
  await P.talk('davor_p', 'Welcher Stein'); await P.bye('(Gehen.)'); ck(!(await D.flag('k3.s.photo')), 'Davor setzt sich nicht ohne Beleg');
  const m1 = await compare('r1'), m2 = await compare('r2'), m4 = await compare('r4');
  ck(/zu nah am Turm/.test(m1) && /weiter vom Turm weg/.test(m2) && /Zu weit weg/.test(m4) && !(await D.flag('k3.s.spot')), 'drei falsche Standorte, je eigene Begründung');
  const m3 = await compare('r3'); ck(/Genau hier hat Mate gestanden/.test(m3) && await D.flag('k3.s.spot'), 'Standort an der flachen Platte');
  await P.mala(); await P.act('look', 'block'); ck(await D.flag('k3.s.initials') && await D.hasNote('b3_initials'), 'Mala sieht „M · D · 1965“'); await P.marko();
  await P.act('talk', 'davor_p'); await P.calm(); ck(await D.flag('k3.s.photo') && await D.hasNote('b3_lenaphoto') && !(await D.st()).inv.includes('foto_1965'), 'Davor sitzt, Lena fotografiert, Lena hat beide Fotos');
  ck(await D.ev(() => M.k3DayReady(M.GS)), 'jetzt ist der Samstag reif');
  ck(!(await D.flag('k3.s.down')), 'die beiden sind wieder oben');
  // Sonntag: Mate und die Fotos
  const base = { 'k3.rules': 2, 'k3.s.photo': true, 'k3.b.invite': true }; const notes = ['b3_invite', 'b3_dida', 'b3_letters', 'b3_kidsroom'];
  await FX.load(D, 'k3x_sonntag.json', { setFlags: base, addNotes: notes, pos: 'zelenika' }); await D.page.waitForTimeout(300); await P.calm(); await D.ev(() => { M.GS.flags['found.mate'] = true; });
  await P.talk('lena', 'Du wolltest deinem Großvater', 'Došli smo, dida'); await P.calm(); ck(!(await D.flag('k3.b.son')), 'Regel 2: „dida“ ohne Fotos erkennt ihn nicht');
  if ((await D.st()).dlg) await P.bye('(Gehen.)');
  await P.talk('lena', 'Zeig ihm die beiden Fotos'); await P.calm(); ck(await D.flag('k3.b.doubt') && await D.hasNote('b3_doubt'), 'Fotos: „Wer setzt sich auf unseren Stein?“');
  if ((await D.st()).dlg) await P.bye('(Gehen.)');
  await P.talk('lena', 'Du wolltest deinem Großvater', 'Došli smo, dida'); await P.calm(); ck(await D.flag('k3.b.son'), 'mit Fotos und „dida“: „Das ist Davor.“');
  return { ok, detail: out.join('; ') };
} };
