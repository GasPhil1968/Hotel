/* ===== 97_k5_a.js — Kapitel 5, Szenen I: Ankunft (Busbahnhof, Taxi, Hajra), Vratnik (Tor, Garten, Kanister), Haus 7 (Hof, Halle,
   siebter Stock, Nada), der Donnerstag bei Nada, der Abend mit Zlata und Vlado, die Nacht in der Pension („Acht Wochen“).
   Wechselnde Gespräche (Mama, Hajra, Nadas Wohnung) verteilen sich nach Tagen auf 97_k5_b.js und 97_k5_c.js. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function ph(A){ return A.G.phase; }
function has(A,id){ return A.G.notes.indexOf(id)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function gIn(A){ return A.G.malaOn && A.malaHere(); }
function C(){ return M.k5Carry||{}; }
async function dayCheck(A){ if (M.k5DayCheck) await M.k5DayCheck(A); }

// ================================================================ Busbahnhof
M.k5Arrive=async function(A){ var J=A.npc('jasna');
  A.placeM(100,122,'R'); await A.wait(400);
  await A.m('Sarajevo. Sechs Uhr vierzig. Tauwetter. Am Rand der Bahnsteige liegt der Februar in grauen Haufen.');
  A.malaJoin({x:138,y:119,f:'L'}); await A.wait(900);
  await A.m('Unter der Anzeigetafel steht Mala, den grauen Schal um den Hals. Als hätte sie die ganzen acht Wochen dort gestanden.');
  await A.g('Du siehst ausgeschlafen aus.');
  await A.m('Acht …'); await J.say('Was?'); await A.wait(300); await A.m('Acht Grad.');
  await A.wait(400); await A.g('Acht Grad. Sehr gut.');
  await A.wait(300); await J.say('Kälter, als ich dachte. Und kleiner.');
  await A.wait(300); await J.say('Der Bahnhof war früher woanders. Oder ich war woanders.');
  A.setFlag('k5.p.platform'); };
M.k5Kiosk=async function(A){ var K=A.npc('kioskm');
  if (F(A,'k5.p.ticket')) return A.m(A.cycle('k5kiosk2',['Ich habe schon einen Fahrschein. Für die Drei. Er steckt in meiner Jacke.','Ein Fahrschein reicht. Ich fahre ja nur einmal.']));
  await A.m('Einen Fahrschein für die Straßenbahn, bitte.'); await K.say('Jedna karta. Osamdeset feninga.'); await A.m('„Eine Fahrkarte. Achtzig Pfennig.“ Sie sagen hier immer noch Pfennig. Feninga.');
  A.sfx('coin'); A.setFlag('k5.p.ticket'); await A.m('Für die Drei. Wann ich ihn brauche, weiß ich nicht.');
  if (gHere(A)){ await A.wait(300); await A.g('Ich weiß es.'); await A.m('…'); await A.g('Später.'); } };
M.k5Taxi=async function(A){ var G=A.G;
  if (G.phase!=='k5_pro') return A.m(A.cycle('k5taxiL',['Ich habe den Stadtplan. Und zwei Füße.','Kein Taxi. Die Stadt ist kleiner, als ich sie in Erinnerung habe.']));
  if (F(A,'k5.p.taxi')) return A.m('Das Taxi ist weg.');
  var T=A.npc('taxist'), J=A.npc('jasna');
  await A.narrate('Ein weißes Taxi mit gelbem Schild. Der Fahrer tritt die Zigarette aus und lädt die Koffer ein, ohne zu fragen.');
  await T.say('Gdje ćemo?'); await A.m('„Wohin?“');
  await A.narrate('Mama öffnet den Mund. Sie schließt ihn wieder. Sie sieht auf ihre Handschuhe.');
  var c=await A.choose([{t:'Kovači.',id:'k'},{t:'Vratnik.',id:'v'}],{title:'Wohin?'});
  A.setFlag('k5.p.taxi',c);
  await T.say(c==='k'?'Kovači. Može.':'Vratnik? Gore? Može.'); await A.m(c==='k'?'„Kovači. Geht.“':'„Vratnik? Da hinauf? Geht.“');
  if (c==='v'){ await A.m('Ich rufe Hajra an. Sie hat den Schlüssel.'); await A.phoneVoice('Vratnik? Odmah. Ne diraj ništa!','hajra'); await A.m('„Sofort. Fass nichts an!“'); }
  await A.narrate(c==='k'?'Das Taxi fährt am Fluss entlang. Mama sieht hinaus. Vor der Vijećnica macht sie die Augen zu und erst an der Baščaršija wieder auf.'
    :'Das Taxi quält sich die Gassen hinauf, durch Schmelzwasser. Mama hält sich am Griff über der Tür fest, die ganze Zeit.');
  if (gHere(A) || A.G.malaOn) await A.g(c==='k'?'Ich sitze zwischen euch. Keiner merkt es. Wie früher in der Drei.':'Hinauf. Ich kenne jede Kurve.');
  if (c==='k'){ await A.goto('pansion5',{x:160,y:112,f:'R',noEnter:true}); await M.k5HajraGreet(A,'pansion'); }
  else { await A.goto('vratnik5',{x:206,y:118,f:'R',noEnter:true}); await M.k5HajraGreet(A,'vratnik'); }
  A.save(); };

// ================================================================ Hajra
M.k5HajraGreet=async function(A,where){ var H=A.npc('hajra'), J=A.npc('jasna');
  if (F(A,'k5.p.hajra')) return;
  if (where==='vratnik'){ await A.narrate('Hajra kommt die Gasse herauf, außer Atem, in Hausschuhen, einen Schlüssel in der Faust.'); }
  await H.say('Marko! Sine!'); await A.wait(300);
  await A.narrate('Hajra geht an mir vorbei und umarmt Mama. Sie fragt nicht, wer sie ist.');
  await H.say('Ružina snaha.'); await A.m('„Ružas Schwiegertochter.“');
  await J.say('Jasna.'); await H.say('Znam. Ruža je pričala. Sve.'); await A.m('„Ich weiß. Ruža hat erzählt. Alles.“');
  if (where==='pansion'){
    await A.narrate('Burek auf dem Tisch, in Papier, noch warm. Mačak, der Kater, setzt sich vor den leeren Stuhl neben mir und starrt.');
    await H.say('Mačak gleda nekoga.'); await A.m('„Der Kater sieht jemanden an.“');
    if (A.G.malaOn){ await A.g('Er hat mich vermisst.'); await A.m('Er hat das Burek vermisst.'); }
    A.setFlag('k5.p.cat'); }
  await A.wait(300);
  await H.say('Ključ od Ružine kuće. Jučer sam naložila vatru.'); await A.m('„Der Schlüssel zu Ružas Haus. Ich habe gestern Feuer gemacht.“');
  await H.say('Za nikoga je gotovo.'); await A.m('„Für niemanden ist vorbei.“');
  await A.wait(400); await H.say('Bis zweitausenddrei hat eine Familie aus Foča drin gewohnt. Ružas Sachen haben sie auf den Dachboden getan. Angefasst haben sie nichts.');
  await H.say('Nur Zorans Kanister. Die stehen im Garten, unter der Plane, beim Holz. Mit denen haben sie Wasser geholt. Was sonst.');
  await A.wait(300); await J.say('Kanister.'); await A.wait(500);
  if (where==='pansion'){ await J.say('Ich will das Dach sehen. Jetzt. Bevor ich mich hinsetze und nicht mehr aufstehe.'); }
  else { await J.say('Achtzehn Jahre. Und das Tor ist grün.'); }
  A.setFlag('k5.p.hajra'); A.unlock('pansion'); A.unlock('vratnik');
  if (where==='pansion'){ var jj=A.npc('jasna'); try{ await jj.walk(84,106); }catch(e){} A.despawn('jasna'); }
  else await M.k5GateScene(A);
  A.save(); };
M.k5PensionEnter=async function(A,from){ var p=ph(A), H=A.npc('hajra');
  if (A.isMala()) return;
  if (p==='k5_pro' && F(A,'k5.p.hajra') && !F(A,'k5.p.cat')){ A.setFlag('k5.p.cat'); await A.narrate('Mačak sitzt vor dem leeren Stuhl am Tisch und starrt.'); await H.say('Mačak gleda nekoga.'); await A.m('„Der Kater sieht jemanden an.“'); if (A.G.malaOn){ await A.g('Er hat mich vermisst.'); await A.m('Er hat das Burek vermisst.'); } return; }
  if (p==='k5_d1' && A.first('k5paD1')){ await H.say('Wasser holst du an der Pivara, sine. Das beste der Stadt. Nicht aus dem Hahn hier, der schmeckt nach Rohr.'); return; }
  if (p==='k5_n1' && A.first('k5paN1')){ await A.m('Die Pension, nachts. Unten schnarcht Hajra, so laut, dass der Kater auf meinem Bett liegt statt bei ihr.'); return; }
  if (p==='k5_sat' && M.k5SatPension) return M.k5SatPension(A,from);
  if (p==='k5_epi' && M.k5EpiPension) return M.k5EpiPension(A,from); };
M.k5PensionExit=async function(A){ var p=ph(A);
  if (p==='k5_pro' && !F(A,'k5.p.hajra')){ await A.m('Erst Hajra.'); return false; }
  if (p==='k5_n1' && !F(A,'k5.n1.atem') && A.first('k5paNx')){ await A.m('Es ist spät. Das Fenster ist kalt. Ich wollte noch hinaussehen.'); }
  if (p==='k5_sat' && M.k5SatPensionExit) return await M.k5SatPensionExit(A);
  return true; };
M.k5PensionTable=async function(A){ var p=ph(A);
  if (p==='k5_sat' && M.k5SatBreakfast) return M.k5SatBreakfast(A);
  if (p==='k5_n1') return A.m('Auf dem Tisch steht ein Teller mit Burek unter einem Tuch. Hajra denkt, ich esse nachts. Sie hat recht.');
  return A.m(A.cycle('k5paT',['Burek, Kaffee, ein Glas Wasser. Hajra stellt immer ein Glas Wasser dazu. „Zum Verdünnen.“','Ich esse ein Stück Burek. Mačak sieht mich an, als hätte ich ihn bestohlen.'])); };
M.k5TalkHajra=async function(A){ var H=A.npc('hajra'), p=ph(A);
  if (p==='k5_sat' && M.k5SatHajra) return M.k5SatHajra(A);
  if (p==='k5_epi' && M.k5EpiHajra) return M.k5EpiHajra(A);
  await A.menuLoop(function(){ return [
    {t:'Die Kleine von damals …',once:'k5ha1',if:p==='k5_pro'||p==='k5_d1',go:async function(A){ await H.say('Die mit dem Mali? Die du gesucht hast? Hast du sie gefunden?'); await A.m('Ja. Morgen ist ihr Begräbnis.'); await A.wait(400); await H.say('…'); await H.say('Dann bringe ich Pita. Zum Totenmahl bringt man Pita.'); if (gHere(A)){ await A.wait(300); await A.g('Mit Spinat. Sag es ihr.'); await A.m('Mit Spinat, Hajra.'); await H.say('Woher weißt du …? Ach. Ružas Enkel.'); } }},
    {t:'Wo holt man hier Wasser?',once:'k5ha2',if:p==='k5_d1'||p==='k5_n1',go:async function(A){ await H.say('An der Pivara. Bistrik, an der Mauer, der Hahn. Im Krieg hat die halbe Stadt da angestanden. Mit Kanistern.'); await H.say('Heute stehen die Touristen da. Mit Flaschen. Und fotografieren das Wasser.'); }},
    {t:'Wie geht es Mama?',once:'k5ha3',if:p!=='k5_pro',go:async function(A){ await H.say('Sie sitzt in ihrem Zimmer im Mantel. Ich habe ihr Tee gebracht. Sie hat Danke gesagt, auf Bosnisch, und dann hat sie geweint, auf Deutsch.'); }},
    {t:'Das Holz im Garten …',once:'k5ha4',go:async function(A){ await H.say('Zwanzig Jahre staple ich Holz für Ružas Haus. Für niemanden.'); await H.say('Diese Woche brennt es. Endlich weiß das Holz, wofür.'); }},
    {t:'Danke, Hajra.',bye:true,go:async function(A){ await H.say(A.cycle('k5haB',['Ništa, sine. Iss.','Geh. Und zieh eine Mütze auf.'])); }}
  ]; }); };

// ================================================================ Mama (Gespräch je nach Tag)
M.k5TalkJasna=async function(A){ var J=A.npc('jasna'), p=ph(A), r=A.room.id;
  if (p==='k5_d2' && M.k5JasnaInst) return M.k5JasnaInst(A);
  if (p==='k5_d2_n' && M.k5JasnaMeal) return M.k5JasnaMeal(A);
  if (p==='k5_sat' && M.k5SatJasna) return M.k5SatJasna(A);
  if (p==='k5_epi' && M.k5EpiJasna) return M.k5EpiJasna(A);
  if (r==='stanica5'){ return A.menuLoop(function(){ return [
    {t:'Wie war die Fahrt?',once:'k5ja1',go:async function(A){ await J.say('Lang. Ich habe nicht geschlafen. Ich habe hinausgesehen.'); await J.say(C().kurve?'Bis zur Kurve habe ich damals zurückgesehen. Jetzt habe ich von der anderen Seite hingesehen. Es ist dieselbe Kurve.':'Zweiundneunzig habe ich bis zu einer Kurve zurückgesehen. Dann nicht mehr. Heute habe ich die Kurve gesucht. Es gibt sie noch.'); }},
    {t:'Soll ich ein Taxi holen?',once:'k5ja2',go:async function(A){ await J.say('Ja. Und du sagst, wohin. Ich kann das heute nicht. Ich kann heute die Namen nicht sagen.'); }},
    {t:'Gleich.',bye:true,go:async function(A){ await J.say('Gleich. Hier ist alles gleich. Und nichts.'); }} ]; }); }
  if (r==='kuca5'){ return A.menuLoop(function(){ return [
    {t:'Mama?',once:'k5ja3',go:async function(A){ await J.say('Achtzehn Jahre.'); await A.wait(400); await J.say('Jeden Monat. Das Dach. Ich habe nie gefragt, ob es dicht ist. Ich wollte nur, dass es dicht ist.'); }},
    {t:'Zorans Kanister stehen im Garten.',once:'k5ja4',if:!has(A,'b5_hand'),go:async function(A){ await J.say('Ich weiß. Hajra hat es gesagt. Ich gehe nicht hin. Noch nicht. Geh du.'); }},
    {t:'Ich bin draußen.',bye:true,go:async function(A){ await J.say('Ja.'); }} ]; }); }
  if (r==='neboder5'||r==='haustor5'){ return A.menuLoop(function(){ return [
    {t:'Willst du hinauf?',once:'k5ja5',go:async function(A){ await J.say('Bis in den siebten. Weiter nicht.'); }},
    {t:'Komm.',bye:true,go:async function(A){ await J.say('Ja.'); }} ]; }); }
  if (r==='stiege5') return J.say('Geh hinauf. Sie wartet.');
  return J.say(A.cycle('k5jaX',['Später, Marko.','Ich bin hier.'])); };
M.k5GiveTinEarly=async function(A){ var J=A.npc('jasna');
  if (ph(A)==='k5_sat' && M.k5SatTinEarly) return M.k5SatTinEarly(A);
  await A.m('Nein. Nicht hier.'); };

// ================================================================ Vratnik: Tor, Garten
M.k5GateScene=async function(A){ var J=A.npc('jasna');
  if (F(A,'k5.p.gate')) return; A.setFlag('k5.p.gate');
  if (A.G.malaOn){ await A.wait(400); await A.g('Hier.'); await A.m('Was ist hier?'); await A.wait(500); await A.g('Später.'); }
  await A.wait(300); await A.narrate('Mama sieht hinauf zum neuen Dach. Dann geht sie durch das grüne Tor ins Haus. Sie fasst die Klinke an, als wäre sie heiß.');
  try{ await J.walk(254,112); }catch(e){} A.despawn('jasna'); A.despawn('hajra'); A.setFlag('k5.p.inside'); A.rebuild(); };
M.k5VratnikEnter=async function(A,from){ var p=ph(A);
  if (p==='k5_pro' && F(A,'k5.p.hajra') && !F(A,'k5.p.gate')) return M.k5GateScene(A);
  if (p==='k5_pro' && F(A,'k5.p.gate') && !has(A,'b5_hand') && from!=='kuca5' && A.first('k5vrGarden')){ await A.m('Der Garten. Die Plane, unter der Hajras Holz liegt. Und Papas Kanister.'); return; }
  if (p==='k5_d1' && A.first('k5vrD1')){ await A.m('Vratnik am Tag. Kinder mit Schulranzen, ein Mann, der Schnee von gestern in den Rinnstein schaufelt.'); return; }
  if (p==='k5_d2_n' && M.k5TabijaArrive) return M.k5TabijaArrive(A,from);
  if (p==='k5_sat' && M.k5SatVratnik) return M.k5SatVratnik(A,from);
  if (p==='k5_epi' && M.k5EpiVratnik) return M.k5EpiVratnik(A,from); };
M.k5VratnikExit=async function(A){ var p=ph(A);
  if (p==='k5_d2_n'){ await A.m('Nicht jetzt. Heute Nacht bleiben wir hier oben.'); return false; }
  if (p==='k5_sat' && F(A,'k5.sat.walk') && !F(A,'k5.sat.gate')){ await A.m('Nein. Erst das Tor.'); return false; }
  if (p==='k5_epi' && A.G.inv.indexOf('kanister_voll')>=0){ await A.m('Das Wasser kommt in Ružas Küche. Nicht zurück in die Stadt.'); return false; }
  return true; };
M.k5GateExit=async function(A){ var p=ph(A);
  if (p==='k5_pro' && !F(A,'k5.p.hajra')){ await A.m('Ohne Schlüssel? Hajra hat ihn.'); return false; }
  if (p==='k5_d2_n'){ await A.m('Drinnen schläft keiner. Heute bleiben wir draußen.'); return false; }
  if (p==='k5_sat' && M.k5SatGate) return await M.k5SatGate(A);
  return true; };
M.k5GardenSense=async function(A){
  if (F(A,'k5.p.tarp')) return A.g(A.cycle('k5gs2',['Der zweite Kanister. Den hat keiner mehr getragen.','Holz und ein Kanister. Beide warten.']));
  if (ph(A)!=='k5_pro' && has(A,'b5_hand')) return A.g('Blau. Und Holz.');
  if (!F(A,'k5.p.sensed')){ A.setFlag('k5.p.sensed'); await A.g('Unter der Plane ist etwas Blaues. Und Rot darauf. Buchstaben.'); await A.wait(300); await A.g('Er hat sie geschrieben. Am Küchentisch. Er hat gepfiffen.'); return; }
  return A.g('Blau. Rote Buchstaben. Heb die Plane. Ich kann es nicht.'); };
M.k5Garden=async function(A){ var p=ph(A), G=A.G;
  if (F(A,'k5.p.tarp')){ if (G.inv.indexOf('kanister')<0 && G.inv.indexOf('kanister_voll')<0 && p!=='k5_pro'){ A.give('kanister'); return A.m('Ich nehme den zweiten Kanister. Auch auf dem steht VUKOVIĆ.'); }
    return A.m('Unter der Plane: Hajras Holz und der zweite Kanister. Einer reicht. Einer hat immer gereicht.'); }
  if (p==='k5_pro' && !F(A,'k5.p.hajra')) return A.m('Ich stehe in einem fremden Garten. Erst der Schlüssel.');
  if (!F(A,'k5.p.sensed')){ await A.m('Eine grüne Plane, mit Ziegeln beschwert. Darunter Hajras Holz, nehme ich an.'); if (gHere(A)){ await A.wait(300); await A.g('Nicht nur Holz.'); } return; }
  // die Plane heben: zwei blaue Kanister; Malas Nachhall (Konzept 6.2, Szene 4)
  A.setFlag('k5.p.tarp'); A.sfx('paper');
  await A.narrate('Ich lege die Ziegel ins Gras und schlage die Plane zurück. Holz, ordentlich gestapelt. Und davor zwei blaue Kanister, zwanzig Liter, mit roter Farbe: VUKOVIĆ.');
  await A.wait(500); await A.m('Papas Schrift. Schief. Er hat nie gerade geschrieben, nur gerechnet.');
  await A.memory({title:'Erinnerung – die Schlange',tint:'memory',draw:M.mem&&M.mem.k4_april,lines:['Eine Schlange bis über die Brücke. Ich halte zwei Kanister, einer ist schon zu schwer, wenn er leer ist.','Das Rot. VUKOVIĆ. Damit ihn keiner mitnimmt.']});
  A.give('kanister');
  if (gIn(A)){
    await A.g('Lass mich.'); await A.wait(400);
    await A.memory({title:'Nachhall – Papas Kanister',tint:'ghost',draw:M.mem&&M.mem.k4_april,lines:[
      'Er malt die Buchstaben am Küchentisch. Er pfeift. Ruža schimpft wegen der Farbe auf dem Wachstuch.',
      'Später. Eine Schlange am Wasser. Es ist laut, dann ist es nicht mehr laut.',
      'Eine Hand auf deinen Augen. Der Ärmel ist nass. Er riecht nach Malz.',
      '„Nemoj gledati, mali.“']});
    await A.m('„Schau nicht hin, Kleiner.“'); await A.wait(300); await A.m('Wer?');
    await A.g('Ich weiß es nicht. Er riecht nach Malz. Und er hat dich festgehalten, bis es vorbei war.');
    A.note('b5_hand'); }
  else { await A.m('Und noch etwas. Eine Hand auf meinen Augen, ein nasser Ärmel. Ich weiß nicht, woher.'); A.note('b5_hand'); }
  // Mama kommt aus dem Haus
  if (p==='k5_pro'){ A.spawn({id:'jasna',ch:'jasnaC',x:254,y:114,f:'L',name:'Mama',speechY:46}); var J=A.npc('jasna'); try{ await J.walk(240,118); }catch(e){}
    await J.say('Marko?'); await A.wait(400); await A.narrate('Mama sieht die Kanister. Die roten Buchstaben. Sie geht nicht näher.');
    await J.say('Er hat auf alles seinen Namen geschrieben.'); await A.wait(600); await J.say('Auf alles. Nur nicht auf sich.');
    await A.wait(400); await J.say('Ich will sehen, wo es war.');
    A.note('j5_wo'); await A.wait(300); await J.say('Aber zuerst Haus sieben. Ich will das Haus sehen. Und Nada wartet auf dich.');
    A.despawn('jasna'); A.unlock('neboder'); A.rebuild(); }
  A.save(); };

// ================================================================ Haus 7 im Prolog
M.k5NeboderEnter=async function(A,from){ var p=ph(A), J=A.npc('jasna');
  if (p==='k5_pro' && has(A,'b5_hand') && !has(A,'j5_nichtdrei')){
    await A.narrate('Mit dem Taxi, quer durch die Stadt. An der Haltestelle der Drei fährt gerade eine an.');
    await A.m('Wir könnten auch die Drei …'); await J.say('Nicht die Drei. Noch nicht.'); A.note('j5_nichtdrei');
    await A.wait(400); await A.narrate('Mama legt den Kopf in den Nacken und zählt die Loggien.'); await J.say('Dritte von links.'); await A.wait(300); await J.say('Da hing unsere Wäsche. Die von Ana war immer rosa. Deine nie.'); return; }
  if (p==='k5_sat' && M.k5SatNeboder) return M.k5SatNeboder(A,from); };
M.k5NeboderExit=async function(A){ var p=ph(A);
  if (p==='k5_pro' && has(A,'b5_hand') && !F(A,'k5.p.nada')){ await A.m('Mama steht vor dem Haus. Ich lasse sie hier nicht stehen.'); return false; }
  if (p==='k5_sat' && M.k5SatNeboderExit) return await M.k5SatNeboderExit(A);
  return true; };
M.k5TramStop=async function(A){ if (ph(A)==='k5_sat' && M.k5SatTramStop) return M.k5SatTramStop(A); return A.m(A.cycle('k5ts',['Die Drei kommt in elf Minuten. Ich fahre nicht. Noch nicht.','Heute nicht. Die Drei hebe ich mir auf.'])); };
M.k5HallEnter=async function(A,from){ var p=ph(A), D=A.npc('dragica'), S=A.npc('sehic'), J=A.npc('jasna');
  if (p==='k5_pro' && has(A,'b5_hand') && A.first('k5haPro')){
    await D.say('Jasna! Vukovićka!'); await A.wait(300); await A.narrate('Dragica steht auf, das Kreuzworträtsel rutscht ihr vom Schoß. Sie hält Mama an beiden Armen und sieht sie an wie ein Foto, das man lange gesucht hat.');
    await D.say('Zwanzig Jahre! Du bist dünn geworden. Und der da, das ist der Mali? Der mit dem Ball an meinem Fenster?'); await A.m('Der mit dem Ball.');
    await A.wait(300); await S.say('Gospođo Vuković.'); await A.narrate('Herr Šehić verbeugt sich. Er tritt an das Hausbuch hinter Glas und zeigt mit dem Kugelschreiber auf eine Zeile.');
    await S.say('Neunzehnhunderteinundneunzig. Siebter Stock, links. Ich habe Sie nie ausgetragen.'); await A.m('„Vuković (Zoran, Jasna, Marko, Ana)“. In seiner Schrift.');
    await A.wait(400); await J.say('Meinen Namen in fremder Schrift. Das ist das Erste hier, was mich nicht vergessen hat.');
    await A.wait(300); await D.say('Der Aufzug geht nicht. Fünfundzwanzig Jahre Aufzug, und er ging vielleicht zwei.'); return; }
  if (p==='k5_sat' && M.k5SatHall) return M.k5SatHall(A,from); };
M.k5Housebook=async function(A){ await A.doc({style:'log',title:'Kućna knjiga · Ulaz 7 · 1991',lines:['Sprat 7, lijevo: VUKOVIĆ (Zoran, Jasna, Marko, Ana)','Sprat 7, desno: HODŽIĆ (Mirsad, Fatima)','Sprat 9, lijevo: DELIĆ (Esad, Nada, Lana)','Sprat 9, desno: KOVAČ (Dragica, Mirko †1995)','Vodio: S. Šehić, kućni savjet']});
  if (A.first('k5hb')) await A.m('Siebter Stock links, wir. Neunter Stock links, Delić. Esad, Nada, Lana. Esad ist neunundneunzig gestorben. Nada hat das Kreuz nicht machen lassen.'); };
M.k5TalkDragica=async function(A){ var D=A.npc('dragica'), p=ph(A);
  await A.menuLoop(function(){ return [
    {t:'Wie geht es Ihnen, Dragica?',once:'k5dr1',go:async function(A){ await D.say('Wie soll es gehen. Das Knie, die Treppe, der Aufzug. Und Nada im neunten, die mir jeden Tag Brot mitbringt, weil ich nicht hinunterkomme.'); await D.say('Seit Januar bringt sie zwei Brote. Für wen das zweite ist, weiß ich nicht. Ich frage nicht.'); if (gHere(A)){ await A.wait(300); await A.g('Für mich. Sie isst es abends. Für mich.'); } }},
    {t:'Kommen Sie am Freitag?',once:'k5dr2',if:p==='k5_d1'||p==='k5_pro',go:async function(A){ await D.say('Zum Begräbnis? Natürlich. Šehić fährt mich. Er fährt wie ein Hausrat. Langsam und mit Protokoll.'); }},
    {t:'Kannten Sie Lana gut?',once:'k5dr3',go:async function(A){ await D.say('Jeden Samstag ist sie die Treppe hinuntergerannt. Ich habe gerufen: Lana, langsam! Sie hat gerufen: Keine Zeit, Teta Dragica! Die Drei!'); await A.wait(300); await D.say('Einmal hat sie Zeit gehabt. Einmal hätte sie keine haben sollen.'); }},
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await D.say('Geh, geh. Und grüß Nada. Sie hört es sowieso nicht, wenn ich grüße.'); }}
  ]; }); };
M.k5TalkSehic=async function(A){ var S=A.npc('sehic'), p=ph(A);
  if (p==='k5_sat' && M.k5SatSehic) return M.k5SatSehic(A);
  await A.menuLoop(function(){ return [
    {t:'Die Wohnung im siebten Stock …',if:has(A,'j5_samstag'),once:'k5se1',go:async function(A){ await S.say('Samstag um elf. Ich bin pünktlich. Ich bin seit 1979 pünktlich, das hat mir keiner gedankt.'); }},
    {t:'Wie lange sind Sie schon Hausrat?',once:'k5se2',go:async function(A){ await S.say('Seit 1979. Durch drei Staaten, einen Krieg und vier Hausmeister. Das Hausbuch hat alles überstanden. Das Haus fast.'); }},
    {t:'Danke, Herr Šehić.',bye:true,go:async function(A){ await S.say('Molim. Ich schreibe es auf.'); }}
  ]; }); };
M.k5StairsEnter=async function(A,from){ var p=ph(A), J=A.npc('jasna'), S=A.npc('sehic');
  if (p==='k5_pro' && has(A,'b5_hand') && !F(A,'k5.p.seventh')){
    await A.narrate('Sieben Stockwerke. Mama bleibt auf jedem Absatz stehen. Nicht wegen des Atems.'); await A.wait(400);
    await A.narrate('Im siebten Stock legt sie die flache Hand an die alte Tür, an das braune Kunstleder mit den Ziernägeln.');
    await J.say('Zweimal kurz, einmal lang. Jeden Samstag.'); A.note('f5_tuer'); await A.wait(500);
    await J.say('Um zehn nach elf. Ich habe ihr aufgemacht, und du bist an mir vorbei, die Schuhe noch offen.'); await A.wait(600);
    await A.narrate('Mama sieht die Treppe hinauf. Zum achten. Zum neunten.'); await A.wait(500);
    await J.say('Ich kann da nicht hinauf.'); await A.wait(400); await J.say('Ihre Tochter ist losgefahren, um meinen Sohn zu holen. Und ich bin ohne ihn gefahren.');
    A.note('j5_treppe');
    if (A.G.malaOn){ await A.wait(600); await A.narrate('Mala steht an der Wand neben der großen Sieben. Sie sagt nichts.'); }
    await A.wait(400); await A.narrate('Unten keucht einer die Treppe herauf. Herr Šehić, mit einem Schlüsselbund, an dem jeder Schlüssel ein Schildchen hat.');
    A.setFlag('k5.p.sehicUp'); A.spawn({id:'sehic',ch:'sehic',x:250,y:121,f:'L',name:'Herr Šehić',speechY:46}); try{ await A.npc('sehic').walk(192,121); }catch(e){}
    await S.say('Die Wohnung steht leer, gospođo. Die Hodžićs sind nach nebenan, wegen der Zwillinge. Samstag um elf bin ich da, dann sperre ich auf. Wenn Sie wollen.');
    A.note('j5_samstag'); await J.say('Samstag.'); await A.wait(300); await J.say('Ja. Samstag.');
    await A.wait(300); await J.say('Ich trinke bei Herrn Šehić einen Kaffee. Geh du hinauf, Marko. Sie wartet.');
    A.setFlag('k5.p.seventh'); A.despawn('jasna'); A.despawn('sehic'); A.rebuild(); A.save(); return; }
  if (p==='k5_sat' && M.k5SatStairs) return M.k5SatStairs(A,from); };
M.k5StairsUp=async function(A){ var p=ph(A);
  if (p==='k5_pro' && !F(A,'k5.p.seventh') && has(A,'b5_hand')){ await A.m('Mama steht hier. Erst sie.'); return false; }
  if (p==='k5_sat' && M.k5SatStairsUp) return await M.k5SatStairsUp(A);
  return true; };
M.k5StairsDown=async function(A){ if (ph(A)==='k5_sat' && M.k5SatStairsDown) return await M.k5SatStairsDown(A); return true; };
M.k5Door7=async function(A){ if (ph(A)==='k5_sat' && M.k5SatDoor7) return M.k5SatDoor7(A); return A.m(A.cycle('k5d7',['Ich klopfe nicht. Da wohnt keiner, der uns kennt.','Zu. Das Schild ist ab. Zwei Löcher.'])); };
M.k5Door7Sense=async function(A){ if (ph(A)==='k5_sat' && M.k5SatDoor7Sense) return M.k5SatDoor7Sense(A);
  await A.g('Hier habe ich geklopft. Zweimal kurz, einmal lang. Und dann ging die Tür auf, und es roch nach Kaffee und nach ihm, wenn er verschlafen hatte.'); };

// ================================================================ Nadas Wohnung (Prolog, Donnerstag, Abend)
M.k5StanEnter=async function(A,from){ var p=ph(A), N=A.npc('nada');
  if (A.isMala()) return;
  if (p==='k5_pro' && !F(A,'k5.p.nada') && F(A,'k5.p.seventh')){
    await A.narrate('Nada macht auf, bevor ich klopfe. Sie hat mich auf der Treppe gehört. Oder sie stand die ganze Zeit hinter der Tür.');
    await N.say('Mali.'); await A.wait(400); await N.say('Komm rein. Zieh die Schuhe aus. Nein, lass sie an. Ich weiß nicht mehr, was man macht.');
    await A.wait(300); await A.narrate('Auf dem Tisch eine Liste in ihrer Handschrift: Blumen, Brot, Halva, Kaffee. Daneben ein Zettel von Nedžad.');
    await N.say('Bei Nedžad habe ich eine Tafel bestellt. Messing. Für den Pfosten.'); await N.say('Den Text habe ich offengelassen. Bis Freitag.');
    await A.wait(400); await N.say('Es kommt noch jemand.'); A.note('s5_tafel');
    if (A.G.malaOn){ await A.wait(500); await A.narrate('Mala geht an Nada vorbei ans Fenster und setzt sich auf das Fensterbrett, als wäre sie nie weg gewesen. Sie war ja nie weg.'); }
    A.setFlag('k5.p.nada'); A.save(); await dayCheck(A); return; }
  if (p==='k5_d1' && A.first('k5snD1')){ await N.say('Setz dich. Kaffee? Ich habe immer Kaffee.'); return; }
  if (p==='k5_d2' && M.k5StanD2Enter) return M.k5StanD2Enter(A,from);
  if (p==='k5_sat' && M.k5SatStanEnter) return M.k5SatStanEnter(A,from); };
M.k5StanExit=async function(A){ var p=ph(A);
  if (p==='k5_n1'){ if (!F(A,'k5.n1.eve')) return true;
    var c=await A.choose([{t:'(Gute Nacht sagen und in die Pension gehen.)',id:'go',silent:true},{t:'(Noch bleiben.)',id:'stay',silent:true}],{title:'Es ist spät'});
    if (c!=='go') return false; await M.k5NightHome(A); return false; }
  if (p==='k5_d2_n'){ await A.m('Heute Abend bleibe ich, bis alle gehen.'); return false; }
  if (p==='k5_sat' && M.k5SatStanExit) return await M.k5SatStanExit(A);
  return true; };
M.k5NightHome=async function(A){ var N=A.npc('nada');
  await N.say('Laku noć, Mali.'); await A.m('„Gute Nacht, Kleiner.“ Seit achtzehn Jahren hat mich keiner so genannt, außer ihr.'); if (A.G.malaOn){ await A.wait(300); await A.g('Ich komme mit. Heute schlafe ich bei Mačak.'); }
  await A.fade(8,700); await A.card({kicker:'',title:'Donnerstag · Nacht',sub:'Pension Hajra, Kovači',ms:3000});
  A.setFlag('k5.n1.home'); await M.k5Bring(A,'pansion5',{at:M.k5StandOf('pansion5','door')}); A.music('k2_noc'); A.save();
  await A.m('Mein Zimmer unter dem Dach. Mačak liegt quer auf dem Bett, als hätte er es gemietet.'); if (A.G.malaOn){ await A.g('Er hat mich vermisst.'); await A.m('Er vermisst jeden, der ihm Burek gibt.'); } };
M.k5LanaDoor=async function(A){ if (A.S.lanaOpen) return A.m('Die Tür steht offen. Nada lüftet jeden Tag.');
  if (ph(A)==='k5_d1' && !has(A,'f5_eursamstag')) return A.m('Ich frage Nada erst. Es ist ihr Zimmer. Es ist Lanas Zimmer.');
  return A.m('Zu.'); };
M.k5ReadMappe=async function(A){ if (!A.S.lanaOpen) return A.m('Die Tür zu Lanas Zimmer ist zu.');
  await A.doc({style:'faded',title:'Durchschläge · Služba traženja · 1995–2011',lines:['Tražim svoju kćer Lanu Delić, rođenu 3. 3. 1976. u Sarajevu …','– Ich suche meine Tochter Lana Delić, geboren am 3. 3. 1976 in Sarajevo …','Zadnji put viđena 15. 1. 1994., autobus za Mostar. – Zuletzt gesehen am 15. 1. 1994, Bus nach Mostar.','Molim vas … – Ich bitte Sie …','(siebzehn Durchschläge, einer für jeden Januar; der letzte von 2011)']});
  if (!has(A,'s5_mappe')){ A.note('s5_mappe'); await A.m('Siebzehn Durchschläge. Jeder fängt gleich an. Mit ihrem Namen und ihrem Geburtstag.'); await A.wait(300);
    var N=A.npc('nada'); if (N.actor){ await N.say('Im Januar habe ich zum ersten Mal keinen geschrieben.'); } } };
M.k5SenseMappe=async function(A){ if (has(A,'s5_nh_mappe')) return A.g('Mamas Januare. Siebzehn.');
  await A.memory({title:'Nachhall – Nadas Mappe',tint:'ghost',draw:M.mem&&M.mem.k2_desk,lines:['Januar. Mama sitzt am Küchentisch, die Mappe neben sich, ein neues Blatt, Durchschlagpapier.','Bevor sie schreibt, sagt sie den Namen laut. Jedes Jahr.','„Lana Delić. Da je nađu.“']});
  A.note('s5_nh_mappe'); await A.g('„Damit man sie findet.“ Sie hat meinen Namen laut gesagt, damit er nicht verloren geht. Jedes Jahr. Ich habe daneben gesessen.'); };
M.k5SenseBoard=async function(A){ if (has(A,'s5_nh_brett')) return A.g('Zlatas Lampe. Batos Messer. Mein Name.');
  await A.memory({title:'Nachhall – das Brett',tint:'ghost',draw:M.mem&&M.mem.k3_hut,lines:['Januar 1994, Skela, Nacht. Im Schuppen. Bato schneidet mit dem Taschenmesser, Zlata hält die Lampe.','„Kako je rekla?“ – „Wie hat sie gesagt?“','„Mala. Piši kako je rekla. Mala. Da je nađu.“']});
  A.note('s5_nh_brett'); await A.g('„Schreib, wie sie gesagt hat. Damit man sie findet.“ Sie wusste nicht, wer ich bin. Sie wusste nur, wie ich gefunden werden wollte.'); };
M.k5Sill=async function(A){ if (A.first('k5sill')){ await A.g('Hier habe ich gesessen. Acht Wochen. Jeden Abend hat Mama gebügelt und mir erzählt, was die Kolar gesagt hat und was der Bäcker.'); if (A.G.malaOn) await A.g('Ich habe geantwortet. Keine hat die andere gehört. Es war trotzdem schön.'); return; } return A.g('Mein Platz.'); };
M.k5StanKitchen=async function(A){ var p=ph(A); if (p==='k5_sat' && M.k5SatKitchen) return M.k5SatKitchen(A); return A.m(A.cycle('k5kit',['Nadas Džezva. Kleiner als meine. Älter.','Kaffee, Zucker, ein Glas mit Rahat Lokum, das keiner anrührt.'])); };
M.k5Balcony=async function(A){ if (ph(A)==='k5_sat' && M.k5SatBalcony) return M.k5SatBalcony(A); return A.m('Draußen ist es kalt. Die Scheibe ist klar. Nada heizt, als wollte sie den Winter beleidigen.'); };
M.k5BalconyG=async function(A){ if (ph(A)==='k5_sat' && M.k5SatBalconyG) return M.k5SatBalconyG(A); return A.g('Die Scheibe ist klar. Auf klarem Glas geht nichts.'); };
// ---------------------------------------------------------------- Gespräche in Nadas Wohnung (je nach Tag)
M.k5StanTalk=async function(A,id){ var p=ph(A);
  if (p==='k5_d2' && M.k5StanTalkD2) return M.k5StanTalkD2(A,id);
  if (p==='k5_d2_n' && M.k5StanTalkMeal) return M.k5StanTalkMeal(A,id);
  if (p==='k5_sat' && M.k5StanTalkSat) return M.k5StanTalkSat(A,id);
  if (id==='nada') return talkNadaD1(A);
  if (id==='zlata') return talkZlataEve(A);
  var P=A.npc(id);
  if (id==='vlado') return P.say(A.cycle('k5vl',['Brett trägt man nicht. Brett trägt man wie Kind. Mit beiden Händen.','Morgen ich mache Pfosten. Eiche. Hält länger als wir.']));
  if (id==='ana') return P.say(A.cycle('k5an',['Der Flug hatte drei Stunden Verspätung. Niko hat die ganze Zeit von einem Mädchen geredet, das er gleich sieht. Ich weiß nicht, welches.','Mama ist bei Hajra? Gut. Gut, dass sie nicht hier ist. Heute noch nicht.']));
  if (id==='mia') return P.say(A.cycle('k5mi',['Onkel Marko, warum gibt es hier keine Zimmer mit Fernseher?','Nada hat gesagt, ich darf morgen den Kuchen anschneiden.']));
  if (id==='niko') return P.say(A.cycle('k5ni',['Das Mädchen ist da!','Sie hat mir gewinkt. Du siehst sie auch, oder?']));
  return P.say('…'); };
M.k5StanLook=async function(A,id){ var t={ nada:'Nada, in einer dunklen Strickjacke, die Brille an einer Kette. Sie bewegt sich in ihrer Wohnung, als müsste sie für zwei gehen.',
  zlata:'Zlata, im guten schwarzen Mantel aus Skela, die Hände im Schoß. Neben ihr, an der Wand, das Brett in der Wolldecke.',vlado:'Vlado, im Anzug, der ihm zu eng ist. Er sitzt auf der Stuhlkante, wie auf einem Traktor.',
  jasna:'Mama, nah an der Tür, den Mantel über der Stuhllehne. Sie hält eine Tasse, aus der sie nicht trinkt.',ana:'Ana, meine Schwester, die Haare zusammengebunden, der Blick überall gleichzeitig, wie bei allen Müttern.',
  mia:'Mia, zehn, mit einem Buch, das sie nicht liest, weil hier alles spannender ist.',niko:'Niko, vier, auf dem Teppich. Er winkt dem Fensterbrett.',hajra:'Hajra, mit einem Blech Pita, das sie nicht abstellt, weil sie keinem den Platz wegnehmen will.' }[id];
  return A.m(t||'…'); };
M.k5StanLookG=async function(A,id){ var t={ nada:'Mama. Sie ist kleiner geworden. Oder ich größer. Nein. Ich nicht.',zlata:'Zlata. Sie hat mich achtzehn Jahre gegossen, wie den Quittenbaum.',vlado:'Vlado. Er sagt wenig. Er macht viel.',
  jasna:'Seine Mama. Sie hat mir jeden Samstag aufgemacht.',ana:'Ana. Sie war fünf, als ich sie zuletzt gesehen habe. Sie hat sich nicht verändert. Sie ist nur größer.',mia:'Sie sieht mich nicht. Sie ist zu alt.',niko:'Niko sieht mich. Er winkt. Ich winke.',hajra:'Hajra. Sie riecht nach Pita.' }[id];
  return A.g(t||'…'); };
M.k5StanSenseG=async function(A,id){ if (ph(A)==='k5_d2_n' && M.k5MealSense) return M.k5MealSense(A,id);
  var t={ nada:'Sie wartet. Immer noch. Auf mich.',zlata:'Sie hat Angst, dass man ihr das Brett wegnimmt. Wie man ihr mich weggenommen hat.',jasna:'Sie hat Angst. Vor einer Treppe.' }[id];
  return A.g(t||'Da ist nichts, das sich an mich erinnert.'); };
M.k5GiveTinStan=async function(A,id){ if (ph(A)==='k5_sat' && M.k5SatTinStan) return M.k5SatTinStan(A,id); return A.m('Nicht hier. Nicht jetzt.'); };
M.k5GiveCookies=async function(A,id){ if (ph(A)==='k5_d2_n' && M.k5MealCookies) return M.k5MealCookies(A,id); return A.m('Mamas Plätzchen. Die gibt sie selbst ab.'); };
async function talkNadaD1(A){ var N=A.npc('nada'), p=ph(A);
  await A.menuLoop(function(){ return [
    {t:'Die Tafel bei Nedžad …',if:!has(A,'s5_frist'),once:'k5na1',go:async function(A){ await N.say('Messing. Zweiunddreißig mal zwölf. Nedžad graviert, was man ihm sagt. Ich habe ihm noch nichts gesagt.'); await N.say('Bis Freitag, zwölf Uhr, will er den Text. Er hat es zweimal gesagt.'); if (!has(A,'s5_tafel')) A.note('s5_tafel'); }},
    {t:'Die Fahrscheine. Die Samstage …',once:'k5na2',go:async function(A){ await N.say('Fahrscheine? Die hat sie bei Alija gekauft. Mit dem Stern.'); await N.say('Samstags war sie bei euch. Ich war nie dabei. Das war euer Samstag.');
      A.note('f5_eursamstag'); await A.wait(500); await N.say('Keiner von euch hat je geschrieben. Achtzehn Jahre.'); await A.wait(400); await N.say('Sie ist losgefahren, um dich zu holen. Natürlich.');
      await A.wait(500); await N.say('Geh in ihr Zimmer, wenn du willst. Ich lüfte jeden Tag.'); A.setFlag('k5.d1.lana'); A.set('lanaOpen',true); A.rebuild();
      if (gHere(A)){ await A.wait(300); await A.g('Euer Samstag. Sie hat recht. Sie war nie dabei.'); } }},
    {t:'Wie geht es dir, Nada?',once:'k5na3',go:async function(A){ await N.say('Ich bügle. Seit Januar bügle ich jeden Abend. Hemden, die keiner trägt. Ich rede dabei.'); await N.say('Mit wem, frag nicht. Mit der Wäsche.'); if (gHere(A)){ await A.wait(300); await A.g('Mit mir.'); } }},
    {t:'Kommt Zlata?',once:'k5na4',go:async function(A){ await N.say('Heute Abend. Mit Vlado. Sie bringt etwas mit. Ein Brett, hat sie am Telefon gesagt.'); await N.say('Ich weiß, was auf dem Brett steht.'); }},
    {t:'Bis später, Nada.',bye:true,go:async function(A){ await N.say(A.cycle('k5naB',['Geh. Komm wieder.','Ja. Später.'])); }}
  ]; }); }
async function talkZlataEve(A){ var Z=A.npc('zlata');
  await A.menuLoop(function(){ return [
    {t:'Das Brett …',once:'k5zl1',go:async function(A){ await Z.say('Bato hat es geschnitten. Mit dem Messer, das er immer hatte. In der Nacht, bevor wir sie unter den Baum gelegt haben.'); await Z.say('Kod mene se zvala Mala. Tako je htjela.'); await A.m('„Bei mir hieß sie Mala. So wollte sie es.“'); }},
    {t:'Wie war die Fahrt?',once:'k5zl2',go:async function(A){ await Z.say('Vlado fährt wie ein Traktor. Drei Stunden für hundertdreißig Kilometer. Das Brett lag auf meinen Knien.'); }},
    {t:'Später, Zlata.',bye:true,go:async function(A){ await Z.say('Polako, sine.'); }}
  ]; }); }

// ---------------------------------------------------------------- Donnerstagabend: Zlata, Vlado, das Brett; Ana und die Kinder
M.k5Evening=async function(A){ var N=A.npc('nada');
  if (F(A,'k5.n1.eve')) return;
  await A.narrate('Abends klingelt es. Nada wischt sich die Hände an der Schürze ab, zweimal, und macht auf.');
  A.spawn({id:'zlata',ch:'zlata',x:40,y:122,f:'R',name:'Zlata',speechY:46}); A.spawn({id:'vlado',ch:'vlado',x:30,y:124,f:'R',name:'Vlado',speechY:46});
  var Z=A.npc('zlata'), V=A.npc('vlado'); try{ await Z.walk(120,126); }catch(e){}
  await Z.say('Dobra večer, gospođo Delić.'); await N.say('Dobra večer.'); await A.m('„Guten Abend.“ Zweimal. Wie zwei Grenzposten.');
  await A.wait(300); await A.narrate('Vlado trägt etwas Langes in einer Wolldecke. Er lehnt es an die Wand neben der Tür, vorsichtig, wie man ein schlafendes Kind ablegt.');
  try{ await V.walk(206,124); }catch(e){}
  await Z.say('Das Brett. Aus Skela. Ich will, dass es bei ihr ist.'); await A.wait(300);
  await N.say('Na grobu moje kćerke piše kako se zove.'); await A.m('„Auf dem Grab meiner Tochter steht, wie sie heißt.“');
  await A.wait(300); await Z.say('Kod mene se zvala Mala. Tako je htjela.'); await A.m('„Bei mir hieß sie Mala. So wollte sie es.“');
  await A.wait(500); await A.narrate('Keine sagt mehr etwas. Nada schenkt Kaffee ein. Zlata bedankt sich. Beide sind sehr höflich, und keine geht einen Schritt.');
  A.setFlag('k5.n1.eve'); A.note('s5_brett'); A.rebuild();
  if (A.G.malaOn){ await A.wait(400); await A.g('Ich sage nichts.'); await A.g('Ich habe gesagt: zusammen.'); }
  await A.wait(600); await A.narrate('Spät klingelt es noch einmal. Ana, mit zwei Kindern und einem Koffer, vom Flughafen, drei Stunden Verspätung.');
  A.setFlag('k5.n1.kids'); A.spawn({id:'ana',ch:'ana',x:40,y:122,f:'R',name:'Ana',speechY:46}); A.spawn({id:'niko',ch:'niko',x:52,y:126,f:'R',name:'Niko',speechY:30}); A.spawn({id:'mia',ch:'mia',x:30,y:126,f:'R',name:'Mia',speechY:30});
  var K=A.npc('niko'), An=A.npc('ana'); await A.wait(300);
  if (A.G.malaOn){ await K.say('Das Mädchen!'); await A.narrate('Niko winkt zum Fenster. Mala winkt zurück.'); await An.say('Niko. Das ist Onkel Marko. Sag hallo.'); await K.say('Hallo, Onkel Marko. Hallo, Mädchen.'); }
  else { await An.say('Niko, sag hallo zu Onkel Marko.'); await K.say('Hallo.'); }
  await A.wait(300); await An.say('Mama ist bei Hajra? Hajra hat uns das Zimmer neben ihr gegeben. Niko schläft sowieso nicht.'); A.rebuild(); A.save();
  await A.m('Das Brett lehnt an der Wand. Nadas Tafel liegt bei Nedžad, leer. Zwei Namen für eine. Ich entscheide das nicht.'); };
M.k5EveLoad=async function(A){ if (!F(A,'k5.n1.eve') && A.room && A.room.id==='stan5') await M.k5Evening(A); };

// ================================================================ Tagesanfänge
M.k5D1Start=async function(A){ var N=A.npc('nada');
  A.sfx('phone'); await A.narrate('Mein Telefon klingelt. Frau Kolar, von der Gerichtsmedizin.');
  await A.phoneVoice('Herr Vuković. Morgen um neun können wir die Identifizierung abschließen. Bringen Sie Ihre Mutter mit, wenn sie will. Sie muss nicht.','kolar');
  await A.m('Morgen um neun. Ich sage es ihr.'); await A.phoneVoice('Und Herr Vuković: Kommen Sie pünktlich. Das sind hier wenige.','kolar');
  if (N.actor){ await A.wait(300); await N.say('Die Kolar? Die ruft immer an, wenn man gerade Kaffee eingeschenkt hat.'); }
  await A.m('Donnerstag. Nadas Tafel ist noch leer. Und die Hand auf meinen Augen hat nach Malz gerochen.'); A.save(); };
M.k5D2Start=async function(A){ var G=A.G;
  await A.narrate('Freitag. Es klopft. Zweimal, ungeduldig. Mama, schon im Mantel, vor meiner Tür.');
  await A.npc('jasna').say('Um neun bei Frau Kolar. Ich komme mit. Ich will ihn sehen.'); await A.m('Ich weiß.');
  if (G.malaOn){ await A.wait(300); await A.g('Heute Mittag ist mein Begräbnis. Und vorher noch so viel.'); }
  A.save(); };

// ================================================================ Nacht in der Pension: „Acht Wochen“ (Konzept 9.1)
M.k5PensionWindow=async function(A){ var p=ph(A);
  if (p!=='k5_n1') return A.m(A.cycle('k5pw',['Draußen die Dächer von Kovači, Minarette, weiter oben die weißen Steine.','Ich sehe hinaus. Die Stadt sieht nicht zurück.']));
  if (!F(A,'k5.n1.home')) return A.m('Kalt.');
  if (F(A,'k5.n1.atem')){ A.G.flags['k5.n1.fog']=A.gt; A.G.flags['k5.n1.three']=0; A.sfx('gust'); await A.m('Ich hauche die Scheibe an. Der Beschlag hält ein paar Sekunden.'); if (gHere(A)){ await A.g('Ich ziehe eine Linie. Siehst du? Drei Sekunden. Vier.'); } return; }
  return atem(A); };
M.k5PensionWindowG=async function(A){ if (ph(A)!=='k5_n1') return A.g('Die Scheibe ist klar.');
  var t=A.flag('k5.n1.fog'); if (F(A,'k5.n1.atem') && t && A.gt-t<6000){ A.G.flags['k5.n1.three']=A.gt; await A.g('Ich ziehe eine Drei. Sie hält. Dann geht sie mit dem Beschlag.'); return; }
  return A.g('Die Scheibe ist klar. Er muss erst hauchen. Nur bei ihm geht es.'); };
async function atem(A){ var G=A.G;
  A.sfx('gust'); A.G.flags['k5.n1.fog']=A.gt; await A.narrate('Die Scheibe ist kalt. Ich hauche sie an, damit ich hinaussehe.');
  await A.wait(700); A.G.flags['k5.n1.three']=A.gt; await A.narrate('Im Beschlag erscheint eine Linie. Dann eine zweite. Eine Drei.');
  await A.wait(900); await A.m('…'); await A.g('…'); await A.wait(500);
  await A.g('Das war ich.');
  await A.m('In Split. Auf meinem Fenster. Ich habe sie weggewischt.');
  await A.g('Ich dachte, das war nur einmal. Damals, als ich noch nicht wusste, wer ich bin.');
  await A.m('Hast du es wieder versucht?'); await A.g('Bei Mama. Acht Wochen lang.');
  var tried={};
  for (var k=0;k<3;k++){ var opts=[]; if (!tried.mirror) opts.push({t:'Versuch es auf dem Spiegel.',id:'mirror'}); if (!tried.again) opts.push({t:'Noch einmal.',id:'again'}); if (!opts.length) break;
    var c=await A.choose(opts,{title:'Die Scheibe'}); tried[c]=true;
    if (c==='mirror'){ await A.narrate('Ich drehe im Bad das heiße Wasser auf. Der Spiegel beschlägt. Mala hebt die Hand. Nichts.'); await A.g('Wie bei Mama. Jeden Abend, wenn sie geduscht hatte.'); }
    else { A.sfx('gust'); A.G.flags['k5.n1.fog']=A.gt; A.G.flags['k5.n1.three']=A.gt+600; await A.narrate('Ich hauche, sie zieht einen Strich. Er hält, bis der Beschlag geht. Drei Sekunden, vielleicht vier.'); } }
  await A.narrate('Im Flur steht Mia im Schlafanzug am Fenster und haucht eine Sonne. Sie schläft nebenan, mit Ana und Niko. Mala zeichnet daneben. Nichts.');
  await A.npc('mia').say('Onkel Marko, mit wem redest du?'); await A.m('Mit dem Kater.'); await A.npc('mia').say('Der Kater heißt Mačak. Das heißt Kater.'); await A.narrate('Sie geht.');
  await A.m('Nur bei mir.'); await A.g('Nur in deinem Atem. Das ist kein Kompliment. Du hattest Zwiebeln.');
  await A.m('Du könntest ihr etwas schreiben. Auf meine Scheibe, wenn ich bei ihr bin.'); await A.g('Nein.'); await A.m('Warum nicht?'); await A.g('Buchstaben sind eine Nachricht.');
  await A.g('Und vor dem Begräbnis wäre alles ein Gespenst. Sie würde warten, dass es wiederkommt. Wie Alois auf Gerda.'); await A.m('Und danach?'); await A.g('Danach sehen wir.');
  A.note('a5_atem');
  await A.narrate('Sie setzt sich auf die Fensterbank. Mačak sieht sie an. Ich auch.');
  await A.g('Du siehst ausgeschlafen aus.'); await A.m('Das hast du am Bahnhof schon gesagt.'); await A.g('Am Bahnhof war es höflich. Jetzt ist es eine Frage.');
  var c2=await A.choose([{t:'Acht Wochen kein Kopfweh.',id:'a'},{t:'Ich habe viel gearbeitet.',id:'b'},{t:'(Nichts sagen.)',id:'c',silent:true}],{title:'Du siehst ausgeschlafen aus'});
  if (c2==='b'){ await A.g('Nur müde?'); await A.m('…'); await A.m('Nein. Acht Wochen kein Kopfweh.'); }
  else if (c2==='c'){ await A.wait(900); await A.g('Ich warte. Darin bin ich gut.'); await A.m('Acht Wochen kein Kopfweh.'); }
  A.setFlag('k5.n1.honest',c2);
  await A.m('Ich habe geschlafen wie ein Stein. Und jeden Morgen habe ich mich dafür geschämt.'); await A.g('Geschämt.'); await A.m('Weil es mir ohne dich gut ging.');
  await A.wait(700); await A.g('…'); await A.g('Mama redet jeden Abend mit mir. Beim Bügeln. Was die Kolar gesagt hat. Was der Bäcker gesagt hat. Ich antworte.');
  await A.m('Und?'); await A.g('Keine hört die andere. Acht Wochen lang. Es war trotzdem schön.');
  await A.m('Frag mich jetzt.'); await A.g('Nein. Nach dem Begräbnis. Das war abgemacht.'); await A.m('Und wenn ich dann das Falsche sage?'); await A.g('Es gibt kein Falsches. Es gibt nur „nur müde“.');
  await A.narrate('Sie hält die Dose auf dem Schoß, wie immer, eine Hand darauf.');
  await A.m('Und die Dose?'); await A.g('Für Mama. Wer sonst?'); A.note('f5_dose');
  await A.m('Nada war nie samstags dabei.'); await A.g('Sie ist meine Mutter.'); await A.m('Das ist kein Samstag.'); await A.g('Du bist heute sehr genau.'); await A.m('Ich bin Übersetzer.');
  await A.wait(600); await A.g('Weißt du, was ich will? Nicht Mama. Nicht Zlata. Ich.'); await A.m('Was?');
  await A.g('Noch einmal Samstag. Zehn nach elf. Und diesmal bist du fertig.'); await A.m('Ich war nie fertig.'); await A.g('Eben.');
  await A.narrate('Mačak dreht sich auf den Rücken. Der Beschlag ist weg, die Drei auch.');
  A.setFlag('k5.n1.atem'); A.save();
  if (!has(A,'b5_hamdija')){ await A.wait(400); await A.g('Und an der Brauerei wartet einer. Nachts war die Schlange. Er will Kanister.'); } }
})(M);
