/* ===== 97_k5_c.js — Kapitel 5, Szenen III: Samstag „Zehn nach elf“ (Frühstück, siebter Stock, das Klopfen, Nadas Küche und die
   Zeichnung, die Drei, die Endstation, der Weg, Ružas Tor), das Mittagessen unter Ružas Dach, der Montag (das Wasser, Zorans
   Begräbnis, Ružas Küche, die letzte Zeichnung). Vorgaben: KAPITEL5_KONZEPT.md 7.3 (Stufen 3–6), 8, 9.3, 9.4, 11. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function ph(A){ return A.G.phase; }
function has(A,id){ return A.G.notes.indexOf(id)>=0; }
function inv(A,id){ return A.G.inv.indexOf(id)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function C(){ return M.k5Carry||{}; }
async function dayCheck(A){ if (M.k5DayCheck) await M.k5DayCheck(A); }
function drawStep(A){ return A.G.flags['k5.sat.draw']||0; }

// ================================================================ Samstag: Frühstück in der Pension
M.k5SatStart=async function(A){ var J=A.npc('jasna'), H=A.npc('hajra');
  await A.narrate('Samstag. Lanas sechsunddreißigster Geburtstag. Sonne, und überall läuft Schmelzwasser.');
  await A.narrate('Mala ist nicht da. Sie ist seit dem Morgengrauen bei Nada. Den Morgen ihres Geburtstags wollte sie bei ihrer Mutter sein.');
  await A.wait(400); await H.say('Iss, sine. Heute ist ein langer Tag. Lange Tage fängt man mit Burek an.');
  await J.say('Um elf sperrt Herr Šehić auf. Ich gehe hin. Ich will die Tür von innen sehen.'); await A.wait(300); await J.say('Kommst du nach?'); await A.m('Ich komme nach.');
  A.save(); };
M.k5SatPension=async function(A,from){ return; };
M.k5SatBreakfast=async function(A){ return A.m(F(A,'k5.sat.left')?'Mamas Tasse steht noch da, halb voll. Sie trinkt nie aus, wenn sie nervös ist.':'Burek, Kaffee, ein gekochtes Ei. Mama isst nichts. Sie sieht auf die Uhr.'); };
M.k5SatTinEarly=async function(A){ var J=A.npc('jasna');
  if (A.room.id==='stiege5') return M.k5GiveTin7(A);
  await A.narrate('Ich lege Mama die Dose hin. Sie macht sie auf, sieht hinein, macht sie wieder zu.'); await J.say('Was soll ich damit hier?'); await A.wait(400);
  await A.m('Nicht hier. An der Tür.'); await A.narrate('Ich stecke die Dose wieder ein.'); };
M.k5SatJasna=async function(A){ var J=A.npc('jasna'), r=A.room.id;
  if (r==='pansion5') return J.say(A.cycle('k5sjP',['Elf Uhr. Ich bin pünktlich. Ich war immer pünktlich. Die anderen waren zu spät.','Ich gehe gleich. Lass mich noch austrinken. Ich trinke nicht aus. Ich weiß.']));
  if (r==='stiege5') return A.menuLoop(function(){ return [
    {t:'Wie ist die Wohnung?',once:'k5sj1',go:async function(A){ await J.say('Leer. Frische Farbe. Die Küche ist woanders gestrichen, aber am Türrahmen sind noch die Striche. M und A.'); await J.say('Du warst immer kleiner, als du gedacht hast.'); }},
    {t:'Mama …',bye:true,go:async function(A){ await J.say('Gleich ist es zehn nach elf.'); }} ]; });
  if (r==='kuca5' && M.k5LunchJasna) return M.k5LunchJasna(A);
  return J.say('…'); };
M.k5SatHajra=async function(A){ var H=A.npc('hajra'); if (A.room.id==='carsija5') return H.say(A.cycle('k5shC',['Zwei Taschen. Leer. Jasna hat gesagt, das reicht.','Ruža hat hier gestanden. Jeden Samstag. Ich habe sie gesehen, von der Bank aus.']));
  return H.say(A.cycle('k5shP',['Geh, sine. Deine Mama ist schon weg. Sie hat das Ei nicht gegessen.','Heute Mittag bei Ruža. Ich bringe Pita. Ich habe schon den Herd angeheizt.'])); };
M.k5SatPensionExit=async function(A){ if (!F(A,'k5.sat.left')){ A.setFlag('k5.sat.left'); await A.narrate('Mama zieht die Handschuhe an. „Ich gehe zu Fuß bis zur Drei und sehe zu, wie sie fährt. Ohne einzusteigen.“ Sie geht vor. Ich folge ihr bald.'); A.despawn('jasna'); } return true; };
M.k5SatNeboder=async function(A,from){ if (A.isMala()) return; if (!F(A,'k5.sat.tickets') && A.first('k5sNb')) await A.m('Haus 7, kurz vor elf. Die Drei fährt gerade ab, ohne Mama. Sie steht schon oben.'); };
M.k5SatNeboderExit=async function(A){ if (F(A,'k5.sat.knock')){ await A.m('Nicht weg. Nada und Mama sind oben.'); return false; } return true; };
M.k5SatTramStop=async function(A){ return A.m('Die Drei. Nachher.'); };
M.k5SatHall=async function(A,from){ if (A.isMala()) return; if (A.first('k5sHt')) await A.narrate('Die Eingangshalle ist leer. Dragicas Stuhl steht da, mit dem Kissen. Dragica ist oben bei Nada, sagt der Zettel an ihrem Stuhl: „Kod Nade.“'); };
M.k5SatStairs=async function(A,from){ if (A.isMala()) return; if (!F(A,'k5.sat.tickets') && A.first('k5sSt')){ await A.narrate('Im siebten Stock steht unsere alte Tür offen. Herr Šehić mit dem Schlüsselbund. Mama an der Tür, die Hand am Rahmen.'); await A.npc('sehic').say('Elf Uhr. Pünktlich. Ich schreibe es auf.'); } };
M.k5SatSehic=async function(A){ return A.npc('sehic').say(A.cycle('k5ssS',['Ich warte hier. Ich bin Hausrat. Ich warte immer.','Die Wohnung ist frisch gestrichen. Nur den Türrahmen in der Küche nicht. Das habe ich verboten.'])); };
M.k5SatDoor7=async function(A){ if (F(A,'k5.sat.tickets')) return A.m('Die Wohnung ist leer. Herr Šehić schließt gleich wieder ab. Mama ist oben.');
  if (A.first('k5sD7')){ await A.narrate('Ich gehe hinein. Eine leere Wohnung, frisch gestrichen, Licht vom Balkon. Die dritte Loggia von links. Am Türrahmen zur Küche Bleistiftstriche: „M“, „A“, „M“, „A“, immer höher.'); await A.npc('jasna').say('Du warst immer kleiner, als du gedacht hast.'); return; }
  return A.m('Die Striche am Türrahmen. Meiner hört bei zwölf auf.'); };
M.k5SatDoor7Sense=async function(A){ return A.g('Hier habe ich geklopft.'); };
M.k5SatStairsUp=async function(A){ if (!F(A,'k5.sat.tickets')){ await A.m('Nicht ich. Das ist nicht mein Klopfen.'); return false; } return true; };
M.k5SatStairsDown=async function(A){ if (!F(A,'k5.sat.tickets')){ await A.m('Mama steht an der Tür. Jetzt gehe ich nicht.'); return false; } if (F(A,'k5.sat.knock') && !F(A,'k5.sat.drawn')){ await A.m('Oben sind sie. Ich gehe hinauf, nicht hinunter.'); return false; } return true; };
// ---------------------------------------------------------------- Die Fahrscheine an der Tür (Stufe 3)
M.k5GiveTin7=async function(A){ var J=A.npc('jasna'), S=A.npc('sehic');
  if (F(A,'k5.sat.tickets')) return;
  if (ph(A)!=='k5_sat') return A.m('Nicht jetzt.');
  await A.narrate('Ich gebe Mama die Dose. Sie macht sie auf. Zwei Fahrscheine der Linie 3, vergilbt, mit einem sternförmigen Loch.');
  await A.wait(600); await J.say('Alija.'); await A.wait(500); await A.narrate('Sie dreht einen um. Bleistift, eine Kinderschrift.'); await J.say('Lana.');
  await J.say('Za prvu trojku poslije rata.'); await A.m('„Für die erste Drei nach dem Krieg.“');
  await A.wait(500); await J.say('Woher hast du die?');
  var c=await A.choose([{t:'Von Lana.',id:'a'},{t:'Einen hat sie mir am Tor bei Baka gegeben. Den anderen hatte sie selbst.',id:'b'},{t:'(Nichts sagen.)',id:'c',silent:true}],{title:'Woher hast du die?'});
  A.setFlag('k5.sat.from',c); await A.wait(500);
  await A.narrate('Mama fragt nicht weiter.'); await J.say('Das Mädchen mit dem Schal. Niko redet seit Weihnachten von ihr.'); await A.wait(400);
  await A.narrate('Mama sieht auf die Uhr. Elf Uhr acht. Dann die Treppe hinauf.');
  var d=await A.choose([{t:'(Zurücktreten.)',id:'back',silent:true},{t:'Geh hinauf und klopf.',id:'tell'}],{title:'Elf Uhr acht'});
  A.setFlag('k5.sat.told',d==='tell');
  if (d==='tell'){ await J.say('Sag mir nicht, was ich tun soll. Das habe ich achtzehn Jahre selbst entschieden.'); await A.wait(900); await A.narrate('Eine Pause. Dann geht sie doch. Weil sie es wollte.'); }
  else await A.narrate('Ich trete zurück, an die Wand neben die große Sieben. Mama steht allein vor der Treppe. Dann geht sie hinauf.');
  A.take('dose_lana'); A.setFlag('k5.sat.tickets');
  try{ await J.walk(256,119); }catch(e){} A.despawn('jasna');
  await S.say('Ich warte hier.'); await A.wait(500);
  await knock(A); };
async function knock(A){ var G=A.G;
  // Zehn nach elf: Wechsel zu Mala in Nadas Flur
  await A.switchTo('mala'); await A.wait(500);
  A.sfx('knock'); await A.wait(260); A.sfx('knock'); await A.wait(520); A.sfx('knock');
  await A.narrate('Es klopft. Zweimal kurz, einmal lang.'); await A.wait(500);
  await A.g('Mama.'); await A.wait(400); await A.g('Das bin ich.');
  await A.narrate('Zum ersten Mal hört Lana ihr eigenes Klopfen von innen. Nada hört sie nicht. Sie dreht sich vom Herd um, zur Tür.');
  await A.choose([{t:'(Zur Tür gehen.)',id:'go',silent:true}],{title:'Zehn nach elf'});
  try{ await A.walkG(60,122); }catch(e){}
  var N=A.npc('nada'); try{ await N.walk(44,122); }catch(e){}
  A.sfx('door'); A.spawn({id:'jasna',ch:'jasnaC',x:30,y:124,f:'R',name:'Mama',speechY:46}); var J=A.npc('jasna'); await A.wait(400);
  await J.say('Nada. Jasna. Vukovićka, sa sedmog.'); await A.g('„Nada. Jasna. Die Vukovićka aus dem siebten.“');
  await A.narrate('Mama hält die Fahrscheine hoch.'); await J.say('Za prvu trojku poslije rata.'); await A.g('„Für die erste Drei nach dem Krieg.“ Meine Schrift.');
  await A.wait(800); await A.narrate('Nada liest die Bleistiftschrift ihrer Tochter. Sie sagt nichts. Lange.'); await A.wait(1200);
  await N.say('Uđi.'); await A.g('„Komm rein.“');
  A.setFlag('k5.sat.knock');
  try{ await J.walk(118,128); }catch(e){} try{ await N.walk(96,116); }catch(e){}
  await A.wait(300); await A.switchTo('marko');
  await A.goto('stan5',{x:44,y:122,f:'R',noEnter:true});
  await A.narrate('Ich komme nach. Nadas Tür steht offen. Mama sitzt am Tisch, im Mantel. Nada kocht Kaffee in ihrer Džezva, für zwei, dann für drei.');
  await A.narrate('Am Kühlschrank hängt Lanas Zeichnung von 1990. Die Balkontür neben der Küche ist klar. Nada steht am Herd, den Rücken zu uns.');
  if (G.malaOn) await A.g('Sie muss es selbst sehen. Nicht als Nachricht.');
  A.save(); }
M.k5SatTinStan=async function(A,id){ return A.m('Die Fahrscheine hat Mama.'); };
M.k5SatStanEnter=async function(A,from){ return; };
M.k5SatStanExit=async function(A){ if (F(A,'k5.sat.knock') && !F(A,'k5.sat.drawn')){ await A.m('Nicht jetzt. Hier ist es.'); return false; } return true; };
M.k5SatKitchen=async function(A){ return A.m('Nada kocht Kaffee. Sie hat mir den Rücken zugedreht. Sie lässt mich machen, was ich mache, ohne zu fragen, was.'); };
M.k5StanTalkSat=async function(A,id){ var P=A.npc(id);
  if (id==='nada') return P.say(F(A,'k5.sat.drawn')?'Gleich fahren wir. Ich ziehe meinen Mantel an.':A.cycle('k5snS',['Setz dich, Mali. Der Kaffee braucht noch.','Jasna trinkt ihn ohne Zucker. Das habe ich nicht gewusst. Achtzehn Jahre nicht gewusst.']));
  if (id==='jasna') return P.say(F(A,'k5.sat.drawn')?'Wir fahren. Ich setze mich ans Fenster.':'…');
  return P.say('…'); };
// ---------------------------------------------------------------- Nadas Küche: die Zeichnung (Stufe 4)
M.k5SatBalcony=async function(A){ var s=drawStep(A);
  if (!F(A,'k5.sat.knock')) return A.m('Die Balkontür. Klar.');
  if (F(A,'k5.sat.drawn')) return A.m('Die Scheibe ist wieder klar. Dahinter der Hof und die Gleise.');
  if (s>=4) return wheels(A);
  if (s%2===1) return A.m('Der Beschlag hält noch. Jetzt sie.');
  A.sfx('gust'); A.G.flags['k5.sat.draw']=s+1;
  await A.narrate(s===0?'Ich hauche die Balkontür an. Ein Beschlag, so groß wie mein Kopf, und er verblasst schon an den Rändern.':'Ich hauche noch einmal, neben die erste Stelle. Der Beschlag wird breiter.');
  if (gHere(A) && s===0) await A.g('Halt still.'); };
M.k5SatBalconyG=async function(A){ var s=drawStep(A);
  if (F(A,'k5.sat.drawn')) return A.g('Fertig.');
  if (s%2===0 || s>=4){ if (s>=4) return A.g('Die Räder sind deine.'); return A.g('Klar. Er muss erst hauchen.'); }
  A.G.flags['k5.sat.draw']=s+1;
  if (s===1){ await A.narrate('Mala zieht eine Linie durch den Beschlag. Die Oberleitung. Der lange Wagen. Vorn eine Drei.'); await A.g('So.'); }
  else { await A.narrate('Mala zeichnet die Fenster, eins nach dem anderen. In jedes ein Gesicht. Zwei sind lang, eines ist klein und hat eine Mütze.'); await A.g('Die Räder sind deine.'); } };
async function wheels(A){ var N=A.npc('nada'), J=A.npc('jasna'), G=A.G;
  A.G.flags['k5.sat.draw']=5;
  await A.narrate('Ich zeichne die Räder. Sie werden eiförmig.'); if (G.malaOn){ await A.g('Immer noch nicht.'); await A.narrate('Mala lacht. Ich höre es. Sonst keiner.'); }
  await A.wait(800); await A.narrate('Nada dreht sich vom Herd um.'); await A.wait(600);
  await A.narrate('Sie sieht die Straßenbahn auf ihrer Scheibe. Die Gesichter in den Fenstern. Und daneben, an der Linie entlang, nichts.'); await A.wait(900);
  await A.narrate('Sie sieht zum Kühlschrank. Zur Zeichnung von 1990. Dann auf den leeren Platz neben mir.'); await A.wait(1200);
  await N.say('Stigla si.'); await A.m('„Du bist angekommen.“');
  if (G.malaOn){ await A.wait(700); await A.g('Jesam, mama.'); await A.m('„Ja, Mama.“ Nur ich höre es.'); }
  var c=await A.choose([{t:'(Nichts sagen.)',id:'quiet',silent:true},{t:'Das ist …',id:'say'}],{title:'Nadas Küche'});
  A.setFlag('k5.sat.silent',c==='quiet');
  if (c==='say'){ await A.narrate('Nada legt mir die Hand auf den Arm.'); await N.say('Šuti, Mali.'); await A.m('„Sei still, Mali.“'); }
  else await A.wait(900);
  await A.narrate('Mama steht auf und nimmt Nadas Hand. Der Beschlag vergeht, die Zeichnung mit ihm. Erst die Räder. Dann die Gesichter. Zuletzt die Drei.');
  A.setFlag('k5.sat.drawn'); A.note('f5_stigla'); A.save();
  await A.wait(700); await M.k5SatTram(A); }
// ---------------------------------------------------------------- Die Drei (Stufe 5)
M.k5SatTram=async function(A){ var G=A.G;
  await A.narrate('Um halb zwölf steht Nada auf und zieht den Mantel an. Mama auch. Keine sagt, wohin. Beide wissen es.');
  await A.fade(8,900); await A.card({kicker:'',title:'Elf Uhr vierundvierzig',sub:'Die Drei, Haltestelle Alipašino Polje',ms:3200});
  await A.goto('tramvaj5',{x:252,y:126,f:'L',noEnter:true}); A.music('k2_otkrice');
  await M.k5SatRide(A); };
M.k5TramEnter=async function(A,from){ return; };
M.k5SatRide=async function(A){ var G=A.G, J=A.npc('jasna'), N=A.npc('nada'), An=A.npc('ana'), Mi=A.npc('mia'), K=A.npc('niko'), c=C();
  A.set('view','towers'); A.set('moving',true); A.rebuild();
  await A.narrate('An der Haltestelle haben Ana, Mia und Niko gewartet. Die Drei. Mama setzt sich ans Fenster. Nada setzt sich daneben. Ich stehe eine Reihe dahinter, wie im Bus aus Mostar.');
  if (G.malaOn){ var mp=[176,106]; A.placeG(mp[0],mp[1],'L'); }
  await A.wait(500); A.sfx('ticket'); await A.wait(400); A.sfx('ticket'); await A.narrate('Mama entwertet beide Fahrscheine. Klack. Klack.');
  if (F(A,'k5.p.ticket')){ A.sfx('ticket'); await A.narrate('Ich entwerte meinen, vom Busbahnhof. Klack.'); }
  else { if (G.malaOn) await A.g('Kauf dir einen. Du bist nicht mehr zwölf.'); await A.narrate('Ich kaufe einen beim Fahrer. Achtzig Pfennig. Klack.'); }
  if (F(A,'k5.d2.damir')){ await A.narrate('Vorn sitzt Damir. Er sieht im Spiegel die zwei Frauen am Fenster.'); await A.npc('damir').say('Lieber zu viele Fenster als zu wenige.'); }
  await A.wait(300); A.sfx('ticket'); await A.narrate('Mia entwertet ihren lauter als alle.');
  A.set('view','yellow'); A.rebuild(); await A.wait(900);
  if (G.malaOn){ await A.narrate('Mala steht neben dem Platz ihrer Mutter, die Hand an der Stange.'); await A.wait(700); A.shake(400); await A.narrate('Die Bahn bremst.'); await A.g('Drži se, mama.'); await A.m('„Halt dich fest, Mama.“');
    await A.narrate('Nada greift im selben Augenblick nach dem Griff. Ob sie es gehört hat, weiß keiner. Es ändert nichts.'); }
  A.set('view','museum'); A.rebuild(); await A.wait(800);
  if (G.malaOn){ await A.narrate('Niko winkt.'); await An.say('Niko, wem winkst du?'); await K.say('Dem Mädchen.'); await A.narrate('Mama sieht aus dem Fenster.'); }
  A.set('view','bascarsija'); A.rebuild(); await A.wait(900);
  A.sfx('tramBell'); await A.narrate('Endstation.');
  A.setFlag('k5.sat.rode'); await A.goto('carsija5',{x:120,y:124,f:'R',noEnter:true}); A.music('k2_mala');
  await M.k5SatEnd(A); };
M.k5Validate=async function(A){ return A.m('Klack. Ein Datum, eine Uhrzeit. Heute.'); };
M.k5TramTalk=async function(A,id){ var t={ jasna:'Am Fenster. Siehst du? Am Fenster.',nada:'Sie hat immer gesagt, die Drei schaukelt. Sie schaukelt.',ana:'Mama sitzt am Fenster. Ich habe sie nie am Fenster sitzen sehen. Immer am Gang.',mia:'Mein Fahrschein hat ein Datum. Den behalte ich.',niko:'Das Mädchen steht da!' }[id]; return A.npc(id).say(t||'…'); };
M.k5TramLook=async function(A,id){ var t={ jasna:'Mama am Fenster. Sie sieht hinaus. Die ganze Zeit.',nada:'Nada daneben. Ihre Hand am Griff.',ana:'Ana, an der Tür, mit beiden Kindern an den Händen.',mia:'Mia hält ihren Fahrschein wie eine Eintrittskarte.',niko:'Niko winkt.' }[id]; return A.m(t||'…'); };
// ---------------------------------------------------------------- Endstation (Stufe 6)
M.k5SatEnd=async function(A){ var H=A.npc('hajra'), R=A.npc('rade');
  await A.narrate('Endstation. Hajra steht da, mit zwei Taschen. Wie Ruža.'); await H.say('Evo me. Dvije torbe.'); await A.m('„Hier bin ich. Zwei Taschen.“');
  await A.wait(500); await A.narrate('Rade sieht mich an. Dann lange den leeren Platz neben mir. Er schreibt.'); await R.say('Dva.'); await A.m('Zwei?'); await R.say('Ich zähle, was ich sehe.');
  await A.wait(500); await A.narrate('Die Mütter gehen mit Hajra nach Kovači, Ana mit den Kindern hinterher. Nada dreht sich einmal um. Dann geht sie weiter.');
  if (A.G.malaOn) await A.g('Jetzt wir. Hinauf. Zu Baka.');
  A.save(); };
M.k5SatCarsija=async function(A,from){ return; };
M.k5SatCarsijaStop=async function(A){ return A.m('Die Drei fährt zurück. Ohne uns.'); };
M.k5SatRade=async function(A){ return A.npc('rade').say(A.cycle('k5srR',['Dva. Ich habe es aufgeschrieben.','Ich zähle, was ich sehe. Seit 1979.'])); };
M.k5WalkUp=async function(A){ var G=A.G;
  if (!(ph(A)==='k5_sat' && F(A,'k5.sat.rode') && !F(A,'k5.sat.gate'))) return A.m('Die Gasse hinauf nach Vratnik. Steil. Heute nicht.');
  A.setFlag('k5.sat.walk'); await A.fade(8,700);
  await A.narrate('Die Treppe hinauf.'); if (G.malaOn){ await A.g('Ruža hat immer gesagt: Polako.'); await A.m('„Langsam.“'); }
  await A.narrate('Die Biegung, an der sie immer vorausrannte. Sie rennt nicht. Sie geht neben mir.');
  if (G.malaOn) await A.g(F(A,'k5.sat.silent')?'Du hast nichts gesagt. In der Küche. Gut.':'Du hast etwas gesagt. Sie hat dich gehalten. Auch gut.');
  await A.narrate('Die Mauer. Unter uns die Stadt.'); if (G.malaOn) await A.g('Von hier sieht man den Weg der Drei. Fast ganz.');
  await A.goto('vratnik5',{x:220,y:120,f:'R',noEnter:true}); A.music('k2_mala');
  await M.k5Farewell(A); };
M.k5SatVratnik=async function(A,from){ return; };
M.k5SatGate=async function(A){ if (F(A,'k5.sat.walk') && !F(A,'k5.sat.gate')){ await M.k5Farewell(A); return false; } if (F(A,'k5.sat.gate')) return true; await A.m('Später. Erst die Drei.'); return false; };
// ---------------------------------------------------------------- Am Tor (Konzept 9.3)
M.k5Farewell=async function(A){ var G=A.G; if (F(A,'k5.sat.gate')) return;
  if (!G.malaOn){ G.malaOn=true; A.malaJoin({fadeIn:false}); }
  var gx=254, gy=115;
  await A.narrate('Ružas Tor. Der Weg hinter uns ist nass vom Schnee, der schmilzt. Die Haustür steht offen. Drinnen knackt der Herd, Hajra hat ihn am Morgen angeheizt.');
  await A.g('Hier.'); await A.m('Ich weiß.'); await A.g('Hier hast du „Ich komme“ gesagt.'); await A.m('Ich weiß.');
  try{ await A.walkG(gx-6,gy+2); }catch(e){}
  await A.crossOpen(gx,gy+2,{w:18,h:72}); await A.narrate('Sie geht zur Tür. In der Tür wird es hell. Nicht viel. Wie wenn drinnen einer das Licht anmacht.');
  var c=await A.choose([{t:'Was siehst du im Licht?',id:'ask'},{t:'(Warten.)',id:'wait',silent:true}],{title:'Am Tor',conv:false});
  if (c==='wait') await A.wait(1600);
  await A.g('Ružas Küche. Der Herd ist an. Auf dem Schrank liegen Quitten.'); await A.g('Und am Tisch sitzt einer und sagt, ich bin zu spät.');
  await A.m('Wer?'); await A.g('Tata. Er hat immer gesagt, die Kleine kommt, wenn sie fertig ist.');
  await A.wait(600); await A.narrate('Sie dreht sich um.'); await A.g('Kommst du?');
  var used={};
  for (var k=0;k<4;k++){ var o=[{t:'Nein.',id:'n1'},{t:'Nein. Ich bleibe hier.',id:'n2'},{t:'(Den Kopf schütteln.)',id:'n3',silent:true}]; if (!used.later) o.push({t:'Noch nicht.',id:'later'});
    var a=await A.choose(o,{title:'Kommst du?',conv:false}); if (a!=='later'){ A.setFlag('k5.sat.no',a); break; } used.later=true; await A.g('Ich weiß. Ich meine heute.'); }
  await A.g('Gut. Diesmal ist es wahr.'); await A.m('Den richtigen Satz.'); await A.g('Den richtigen.');
  await A.wait(500); await A.narrate('Sie hebt die Hände, als würde sie mir die Jacke zumachen. Bis oben. Ich mache sie selbst zu. Dann sieht sie auf meine Mütze.');
  var cap=await A.choose([{t:'(Die Mütze gerade rücken.)',id:'straight',silent:true},{t:'(Sie schief lassen.)',id:'crooked',silent:true}],{title:'Die Mütze',conv:false});
  A.setFlag('k5.sat.cap',cap); await A.g(cap==='straight'?'Wer bist du?':'Gut. Sonst erkenne ich dich nicht.');
  await A.wait(400); await A.g('Drži se, Mali.'); await A.m('„Halt dich fest, Mali.“');
  await A.g('Nimm meine Hand. Bis an den Rand.');
  await A.narrate('Ich nehme ihre Hand. Sie wiegt nichts. Wir gehen bis zur Schwelle. Weiter geht es für mich nicht.');
  try{ await A.walkM(gx-22,gy+4); }catch(e){}
  for (var j=0;j<6;j++){ var l=await A.choose([{t:'(Loslassen.)',id:'go',silent:true},{t:'(Noch nicht.)',id:'not',silent:true}],{title:'An der Schwelle',conv:false});
    if (l==='go') break; await A.g('Ich bin hier.'); await A.narrate('Eine Weile stehen wir.'); }
  await A.narrate('Ich lasse los.'); await A.wait(500);
  await A.g('Jetzt bin ich fertig.');
  await A.narrate('Sie geht hinein. Allein. Die Stufe nimmt sie mit einem Schritt, so wie früher die letzte Treppe vor Ružas Tür, immer zuerst oben.');
  try{ await A.walkG(gx+2,gy-2); }catch(e){} A.sfx('shimmer'); A.malaLeave(); await A.crossClose();
  A.setFlag('k5.sat.gate'); G.malaOn=false; A.music('silence');
  await A.wait(800); await A.narrate('Ich sehe hin, bis nichts mehr zu sehen ist.');
  await A.narrate('Das Licht geht aus, wie wenn drinnen einer es ausmacht. In der Küche knackt der Herd. Auf dem Schrank liegen Quitten. Am Tisch sitzt keiner.');
  await A.wait(900); await A.m('Mein Kopf ist still.');
  A.save(); await A.wait(1200); A.music('k2_sjecanje');
  await A.narrate('Ich setze mich in die Küche. Nach einer Weile kommen die Stimmen der anderen die Gasse herauf. Hajra, Mia, die Mütter.');
  await A.goto('kuca5',{x:156,y:128,f:'L',noEnter:true});
  await M.k5Lunch(A); };
// ---------------------------------------------------------------- Das Mittagessen unter Ružas Dach (Nachklang)
M.k5Lunch=async function(A){ if (F(A,'k5.sat.lunch')) return; var N=A.npc('nada'), J=A.npc('jasna');
  await A.narrate('Hajras Pita, Mamas Sarma, Brot von Dragica. Mia sucht unter dem Tisch nach Mačak, der in Kovači geblieben ist.');
  await A.wait(500); await A.narrate('Nada stellt Tassen hin. Sechs. Nicht sieben. Sie fragt nicht.');
  await A.wait(600); await A.narrate('Mama sieht hinauf, zur Decke, unter dem neuen Dach.'); await J.say('Drunter.'); await A.narrate('Mehr sagt sie nicht.');
  A.setFlag('k5.sat.lunch'); A.save(); };
M.k5LunchJasna=async function(A){ var J=A.npc('jasna');
  if (F(A,'k5.sat.done')) return J.say('Behalte ich.');
  await A.narrate('Mama legt zwei Fahrscheine auf den Tisch. Entwertet, mit dem Datum von heute, und mit dem Stern von Alija.'); await J.say('Behalte ich.'); await A.m('Ja.');
  A.setFlag('k5.sat.done'); A.save(); await dayCheck(A); };
M.k5SatLoad=async function(A){ var G=A.G, r=A.room&&A.room.id;
  if (F(A,'k5.sat.knock') && !F(A,'k5.sat.drawn') && r!=='stan5'){ await M.k5Bring(A,'stan5',{at:[44,122,'R']}); return; }
  if (F(A,'k5.sat.drawn') && !F(A,'k5.sat.rode')){ await M.k5SatTram(A); return; }
  if (F(A,'k5.sat.walk') && !F(A,'k5.sat.gate')){ await A.goto('vratnik5',{x:220,y:120,f:'R',noEnter:true}); await M.k5Farewell(A); } };

// ================================================================ Ružas Küche (alle Tage)
M.k5KucaEnter=async function(A,from){ var p=ph(A); if (A.isMala()) return;
  if (p==='k5_pro' && A.first('k5kuPro')){ await A.narrate('Ružas Küche. Der Herd ist warm. Weiße Tücher über den Möbeln. Auf dem Schrank Quitten, auf Zeitungen von 1994, gelb und runzlig. Sie riechen noch.'); return; }
  if (p==='k5_epi' && inv(A,'kanister_voll') && !F(A,'k5.e.water')) return deliverWater(A);
  if (p==='k5_epi' && !F(A,'k5.e.funeral') && A.first('k5kuEpi')){ await A.m('Ružas Küche am Montagmorgen. Hajra hat schon geheizt. Auf dem Herd steht Ružas Džezva und wartet auf Wasser.'); } };
M.k5KucaExit=async function(A){ var p=ph(A);
  if (p==='k5_sat' && F(A,'k5.sat.gate') && !F(A,'k5.sat.done')){ await A.m('Nicht jetzt. Mama hat noch etwas auf dem Herzen. Ich sehe es an ihren Händen.'); return false; }
  if (p==='k5_epi' && F(A,'k5.e.funeral')){ await A.m('Ich bleibe. Heute Abend gehe ich nirgendwohin.'); return false; }
  return true; };
M.k5KucaTable=async function(A){ var p=ph(A);
  if (p==='k5_sat' && F(A,'k5.sat.gate')) return A.m('Sechs Tassen. Ich zähle sie zweimal. Sechs.');
  if (p==='k5_epi' && F(A,'k5.e.funeral')) return A.m('Ružas Tassen, die mit Sprung. Kaffee aus dem Wasser von heute früh. Er schmeckt nach Stein und nach Malz.');
  return A.m(A.cycle('k5kuT',['Der Tisch. Wachstuch mit Kirschen. Darauf hat Papa seinen Namen geschrieben, mit roter Farbe, aus Versehen. Man sieht es noch.','Drei Stühle. Einer wackelt.'])); };
M.k5KucaWindow=async function(A){ var p=ph(A);
  if (p==='k5_epi' && F(A,'k5.e.final') && !F(A,'k5.e.done')) return lastDrawing(A);
  if (p==='k5_epi' && F(A,'k5.e.done')) return A.m('Das Fenster ist klar. Dahinter ist die Stadt.');
  return A.m(A.cycle('k5kuW',['Das Küchenfenster. Dahinter das Tal, die Stadt, die Hänge des Trebević.','Von hier hat Großmutter uns kommen sehen. Mich immer zuerst. Lana immer zuerst.'])); };
M.k5KucaTalk=async function(A,id){ var p=ph(A), P=A.npc(id);
  if (id==='jasna' && p==='k5_pro') return M.k5TalkJasna(A);
  if (p==='k5_sat'){ if (id==='jasna') return M.k5LunchJasna(A);
    var t={ nada:['Sechs Tassen. Ich habe richtig gezählt.','Sie hat immer gesagt, bei Ruža schmeckt der Kaffee besser. Ich habe es nie geglaubt. Er schmeckt besser.'],hajra:['Iss, sine. Pita kalt ist auch Pita.','Der Herd zieht gut. Ruža hat ihn geliebt. Ich auch.'],
      ana:['Mama hat in der Drei am Fenster gesessen. Ich glaube, sie hat gelächelt. Einmal.','Niko fragt die ganze Zeit nach dem Mädchen.'],mia:['Wo ist Mačak?','Hier riecht es nach Quitten.'],niko:['Das Mädchen ist weg.','Sie hat gewinkt. Dann ist sie gegangen. In das Haus.'] }[id];
    return P.say(t?A.cycle('k5lu'+id,t):'…'); }
  if (p==='k5_epi'){ if (id==='jasna' && M.k5EpiJasna) return M.k5EpiJasna(A);
    var e={ nada:['Ich habe im Januar keinen Brief geschrieben. Im nächsten Januar auch nicht.','Der Kaffee ist gut. Das Wasser ist gut. Du hast es getragen.'],hajra:['Der Eimer auf dem Dachboden ist trocken. Ich sehe trotzdem jeden Tag nach.','Morgen fährst du. Komm wieder. Mačak vermisst dich. Und das Burek.'],
      ana:['Papa hat ein Grab. Ich bin dreiundzwanzig Jahre ohne Grab ausgekommen. Es ist trotzdem besser so.','Mia will Bosnisch lernen. Sie sagt, damit sie versteht, was Nada über Plätzchen sagt.'],mia:['Onkel Marko, kommst du im Sommer?','Ich esse Nikos Kuchen. Er merkt es nicht.'],niko:['Das Mädchen ist weg.','Sie hat gewinkt.'] }[id];
    return P.say(e?A.cycle('k5ep'+id,e):'…'); }
  return P.say('…'); };
M.k5KucaLook=async function(A,id){ var p=ph(A); var t={ jasna:p==='k5_epi'?'Mama am Herd, die Džezva in der Hand. Sie gießt langsam, damit kein Tropfen danebengeht.':'Mama am Tisch, im Mantel, mit einer Tasse.',
  nada:p==='k5_epi'?'Nada am Fenster, die Hände um die Tasse. Sie sieht hinaus, nicht auf den leeren Platz.':'Nada, die Tassen zählend. Sechs.',hajra:'Hajra, die Hände an der Schürze, obwohl sie trocken sind.',ana:'Ana mit Niko auf dem Schoß.',mia:'Mia, unter dem Tisch, auf der Suche nach einem Kater, der nicht da ist.',niko:'Niko winkt dem Fenster.' }[id];
  return A.m(t||'…'); };

// ================================================================ Montag: das Wasser, Zorans Begräbnis, die letzte Zeichnung
M.k5EpiStart=async function(A){ var H=A.npc('hajra');
  await A.narrate('Montag. Mein Kopf ist still. Seit Samstag. Ich wache auf und warte auf das Pochen, und es kommt nicht.');
  await A.wait(400); await H.say('Heute Papa, sine. Um elf. Ich habe deinen Anzug gebügelt. Er war nicht zerknittert. Ich habe ihn trotzdem gebügelt.');
  await A.m('Heute Abend trinken wir Kaffee unter Ružas Dach. Mit Wasser von der Brauerei. Ich hole es selbst.');
  if (!inv(A,'kanister') && !inv(A,'kanister_voll')) A.give('kanister');
  A.save(); };
M.k5EpiPension=async function(A,from){ return; };
M.k5EpiHajra=async function(A){ return A.npc('hajra').say(A.cycle('k5ehH',['Hol das Wasser, sine. Und trag es selbst. Das macht man so.','Der Kanister steht da, wo du ihn hingestellt hast. Ich habe ihn ausgespült.'])); };
M.k5EpiJasna=async function(A){ var J=A.npc('jasna');
  if (F(A,'k5.e.final')) return J.say(A.cycle('k5ejK',['Es tropft nicht.','Achtzehn Jahre bezahlt. Natürlich tropft es nicht.']));
  return J.say('Bring das Wasser, Marko. Ich koche den Kaffee.'); };
M.k5EpiPivara=async function(A,from){ if (A.first('k5epPv')){ await A.narrate('Früh. Keiner steht an. Kein Klappern, keine Stimme. Mein Kopf ist still.'); await A.m('Der Hahn läuft. Und keiner wartet.'); } };
M.k5EpiPivaraExit=async function(A){ return true; };
M.k5EpiTap=async function(A){
  if (inv(A,'kanister_voll')) return A.m('Der Kanister ist voll. Zwanzig Liter. Er muss nach Vratnik.');
  if (!inv(A,'kanister')) return A.m('Ich habe nichts, worin ich das Wasser tragen kann.');
  A.setFlag('k5.e.flow'); A.set('flow',true); A.rebuild(); A.sfx('pour');
  await A.narrate('Ich halte den blauen Kanister unter den Hahn. Das Wasser läuft hinein, eiskalt, und es dauert. Zwanzig Liter dauern.'); await A.wait(900);
  A.take('kanister'); A.give('kanister_voll'); A.setFlag('k5.e.flow',false); A.set('flow',false); A.rebuild();
  await A.m('So schwer wie damals. Ich bin größer geworden, er nicht.'); await A.m('Jetzt hinauf. Nach Vratnik, in Ružas Küche.'); A.save(); };
M.k5EpiVratnik=async function(A,from){ if (inv(A,'kanister_voll') && A.first('k5epVr')){ await A.narrate('Hinauf nach Vratnik. Die Treppen, die Biegung, die Mauer. Ich setze den Kanister nicht ab. Nicht einmal.'); } };
async function deliverWater(A){ A.take('kanister_voll'); A.setFlag('k5.e.water');
  await A.narrate('Ich stelle den Kanister in Ružas Küche ab, neben den Herd. Hajra sieht hinein.'); await A.npc('hajra').say('Pun. Ni kap prosuo.'); await A.m('„Voll. Keinen Tropfen verschüttet.“');
  A.save(); await dayCheck(A); }
M.k5EpiBare=async function(A,from){ return; };
M.k5EpiGrave=async function(A){ return A.m('Lanas Pfosten. Der Ableger hat über Nacht ein Blatt mehr. Oder ich habe gestern nicht genau gezählt.'); };
M.k5EpiBareTalk=async function(A,id){ var t={ jasna:'Ružas Wort.',ana:'Papa.',nada:'Jetzt liegen sie nebeneinander. Nicht ganz. Zwei Reihen.',hajra:'Ich bringe Pita.',kolar:'Ich komme zu allen, die ich gefunden habe.',sehic:'Ich habe es aufgeschrieben.',mia:'Ich habe eine Blume für Opa.',niko:'Wo ist das Mädchen?' }[id]; return A.npc(id).say(t||'…'); };
M.k5Zoran=async function(A){ if (F(A,'k5.e.zoranDone')) return; var J=A.npc('jasna2'), c=C();
  await A.narrate('Bare, elf Uhr. Neben Lanas Pfosten, zwei Reihen weiter, ein frisches Doppelgrab.');
  await A.narrate('Mama, Ana und die Kinder. Nada, Hajra, Herr Šehić, Frau Kolar.');
  await A.wait(500); await A.narrate('Der Mann von der Friedhofsverwaltung fragt nach dem Text für die Tafel.');
  await A.npc('jasna2').say('Was wollte Ruža schreiben?'); await A.m('Poginuo.'); await A.wait(500); await A.npc('jasna2').say('Dann schreiben wir es.');
  await A.wait(500); await A.narrate('ZORAN VUKOVIĆ · 1951 – 1993 · poginuo 19. 4. 1993. Gefallen. Ružas Wort, neunzehn Jahre zu spät, und genau richtig.');
  await A.wait(600); await A.npc('jasna2').say('Ich bin ohne dich gefahren.'); await A.wait(600); await A.npc('jasna2').say('Zurück nicht.');
  await A.narrate(F(A,'k5.d2.damir')?'Ich trage den kleinen Sarg mit Herrn Šehić und Damir, der wieder Pause hat.':'Ich trage den kleinen Sarg mit Herrn Šehić und einem Mann von der Verwaltung, der nicht weiß, wen er trägt, und trotzdem vorsichtig ist.');
  await A.wait(500); await A.narrate('Mama hat neben Papa Platz gelassen.');
  A.setFlag('k5.e.zoranDone'); A.save(); };
M.k5Final=async function(A){ if (F(A,'k5.e.final')) return; var c=C(), J=A.npc('jasna'), N=A.npc('nada'), An=A.npc('ana'), H=A.npc('hajra'), K=A.npc('niko');
  await A.narrate('Mama hat die Džezva auf dem Herd. Ružas Džezva, die ich seit Split überall dabeihabe. Das Wasser ist das von heute früh, von der Brauerei.');
  await An.say('Es tropft nicht.'); await J.say('Achtzehn Jahre bezahlt. Natürlich tropft es nicht.'); await H.say('Ich habe trotzdem einen Eimer auf den Dachboden gestellt.');
  if (c.slippers && inv(A,'pantoffeln')){ await A.narrate('Ich trage Papas Pantoffeln aus München. Mama sieht auf meine Füße.'); await J.say('Seine Größe.'); }
  else { await A.narrate('Mama stellt ein Paar Pantoffeln an Ružas Tür. Dann nimmt sie sie wieder weg.'); await J.say('Er ist ja da.'); }
  await A.wait(400); await A.narrate('Nada sitzt am Fenster. Sie hat die Hände um die Tasse und sieht hinaus, nicht auf den leeren Platz. Mama und Nada reden über Plätzchen. Eine Viertelstunde lang.');
  await A.wait(600); await K.say('Das Mädchen ist weg.'); await An.say('Welches Mädchen?'); await K.say('Mit dem Schal. Sie hat gewinkt.');
  await A.wait(500); await A.narrate('Mama legt die Gabel hin. Ganz leise. Nada sieht Niko an und dann mich. Keiner sagt etwas. Mia isst Nikos Kuchen.');
  await A.wait(600); A.sfx('beep'); await A.narrate('Mein Telefon summt. Eine Nachricht von Frau Kolar.');
  await A.doc({style:'sms',title:'Kolar',lines:['Tri imena s vašeg spiska. Porodice su obaviještene. K.']}); await A.m('„Drei Namen von Ihrer Liste. Die Familien sind benachrichtigt.“');
  await A.m('Ich denke an den Hahn, der läuft. Und an keinen, der wartet.');
  A.sfx('beep'); await A.narrate('Dann Vesna.');
  await A.doc({style:'sms',title:'Vesna',lines:['Die Stillen, Teil drei: Lana Delić. Bekommen. Seite vierzehn. Diesmal kein Zeichen zu viel.']});
  await A.doc({style:'news',title:'Die Stillen (3): Lana Delić',lines:['Lana Delić wurde am 3. März 1976 in Sarajevo geboren.','Jeden Samstag fuhr sie mit der Linie 3 und holte einen Jungen aus dem siebten Stock.','Im Januar 1994 stieg sie in einen Bus nach Mostar und kam nicht zurück.','Achtzehn Jahre lag sie unter einem Quittenbaum in Skela, unter einem Brett mit dem Namen, den sie selbst gesagt hatte.','Am 2. März 2012 wurde sie auf Bare begraben, mit beiden Namen.','Sie ist am 3. März 2012 angekommen. Ihre Mutter hat es gesagt.']});
  await A.m('Den letzten Satz habe ich geschrieben, nachdem Nada ihn gesagt hat. Eine Abschrift. Kein Ersatz.');
  if (c.davor){ A.sfx('beep'); await A.narrate('Und Davor, mit einem Foto: ein Feigenzweig in einem Topf auf einem Fensterbrett in Split. Ein grünes Blatt.'); await A.doc({style:'sms',title:'Davor',lines:['Lenina grana. Pustila je list. – Lenas Zweig. Er treibt aus.']}); }
  var ans=A.flag('k5.n2.answer'); await A.wait(400);
  await A.m(ans==='a'?'Sechs Tassen. Ich wollte, dass sie bleibt. Ich habe es ihr gesagt. Das reicht.':(ans==='b'?'Ich schlafe wieder. Ohne mich zu schämen. Es ist in Ordnung.':'Ich halte niemanden fest. Nur eine Tasse. Sie ist warm.'));
  if (A.flag('k5.sat.cap')==='crooked') await A.narrate('Meine Mütze hängt am Haken neben der Tür. Schief. Ich lasse sie so.'); else await A.narrate('Meine Mütze hängt am Haken neben der Tür. Gerade. Fast.');
  await A.wait(600); await A.narrate('Das Fenster neben dem Tisch ist beschlagen, vom Kaffee und von uns allen.');
  A.setFlag('k5.e.final'); A.save(); };
M.k5FinalLoad=async function(A){ if (F(A,'k5.e.done')) return; if (!F(A,'k5.e.zoranDone')){ await M.k5Zoran(A); }
  if (!A.room || A.room.id!=='kuca5') await M.k5Bring(A,'kuca5',{at:[156,128,'L'],noMala:true});
  if (!F(A,'k5.e.final')) await M.k5Final(A); };
async function lastDrawing(A){ var An=A.npc('ana'), Mi=A.npc('mia');
  A.setFlag('k5.e.tram'); await A.narrate('Ich zeichne eine Straßenbahn. Die Oberleitung. Den langen Wagen. Vorn eine Drei. In jedes Fenster ein Gesicht, so gut ich kann.');
  await A.wait(900); await A.narrate('Dann die Räder.'); A.setFlag('k5.e.wheels'); await A.wait(1400); await A.narrate('Sie stimmen.');
  A.note('f5_rad'); await A.wait(500);
  await Mi.say('Onkel Marko kann malen!'); await An.say('Seit wann?');
  var c=await A.choose([{t:'Seit Samstag.',id:'a'},{t:'Schon immer. Nur die Räder nicht.',id:'b'},{t:'(Nichts sagen.)',id:'c',silent:true}],{title:'Seit wann?'});
  A.setFlag('k5.e.last',c); if (c==='c') await A.wait(900);
  await A.narrate('Draußen gehen in der Stadt die Lichter an, eins nach dem anderen, bis Ilidža. Der Beschlag wird dünner. Die Straßenbahn geht mit ihm, erst die Räder, dann die Gesichter, zuletzt die Drei.');
  A.G.flags['k5.e.wheels']=false; await A.wait(700); A.G.flags['k5.e.tram']=false; await A.wait(700); A.setFlag('k5.e.clear');
  await A.wait(800); await A.narrate('Dahinter ist die Stadt.');
  A.music('silence'); await A.wait(4000);
  A.setFlag('k5.e.done'); await dayCheck(A); }

// ================================================================ Sichtbare Zeichnungen auf beschlagenem Glas (Bildebene über den Bildern aus Kapitel 2)
function fogPatch(fb,x0,y0,w,h,cam,amt){ var P=M.P; for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var dx=(x-(x0+w/2))/(w/2), dy=(y-(y0+h/2))/(h/2), d=dx*dx+dy*dy; if (d>1) continue; if (M.bayer(x,y)<(1-d*0.7)*amt) fb.px(x-cam,y,(d<0.4&&M.bayer(x+3,y)<0.5)?P.s6:P.s5); } }
function pline(fb,pts,cam,c){ for (var i=0;i<pts.length-1;i++){ var a=pts[i], b=pts[i+1], n=Math.max(1,Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])); for (var k=0;k<=n;k++) fb.px(Math.round(a[0]+(b[0]-a[0])*k/n)-cam,Math.round(a[1]+(b[1]-a[1])*k/n),c); } }
// eine Straßenbahn im Beschlag: Fahrdraht, Stromabnehmer, langer Wagen, vorn eine Drei; Gesichter, Räder (eiförmig oder rund)
function tram(fb,x,y,cam,o){ var P=M.P, c=P.m2;
  pline(fb,[[x-2,y],[x+20,y]],cam,c); pline(fb,[[x+8,y+1],[x+10,y+5],[x+12,y+1]],cam,c);
  pline(fb,[[x,y+6],[x+18,y+6],[x+19,y+8],[x+19,y+14],[x,y+14],[x,y+6]],cam,c);
  if (o.three){ pline(fb,[[x+15,y+8],[x+17,y+8],[x+16,y+10],[x+17,y+12],[x+15,y+12]],cam,c); }
  for (var i=0;i<3;i++){ var wx=x+2+i*4; pline(fb,[[wx,y+8],[wx+2,y+8],[wx+2,y+11],[wx,y+11],[wx,y+8]],cam,c); if (o.faces) fb.px(wx+1-cam,y+9,P.k2); }
  if (o.wheels==='egg'){ pline(fb,[[x+3,y+15],[x+5,y+15],[x+6,y+17],[x+4,y+18],[x+2,y+17],[x+3,y+15]],cam,c); pline(fb,[[x+13,y+15],[x+15,y+16],[x+15,y+17],[x+13,y+18],[x+12,y+16],[x+13,y+15]],cam,c); }
  if (o.wheels==='round'){ [[x+4,y+16],[x+14,y+16]].forEach(function(q){ pline(fb,[[q[0]-1,q[1]-1],[q[0]+1,q[1]-1],[q[0]+2,q[1]],[q[0]+1,q[1]+1],[q[0]-1,q[1]+1],[q[0]-2,q[1]],[q[0]-1,q[1]-1]],cam,c); }); } }
(function(){ var P=M.P;
  // Nadas Balkontür am Samstag
  var R=M.ROOMS.stan5, d0=R&&R.dynamic;
  if (R) R.dynamic=function(fb,v,S,G){ if (d0) d0(fb,v,S,G);
    if (G.flags['k5.n1.eve'] && !G.flags['k5.s.mounted']){ var c=v.cam; for (var y=94;y<120;y++) for (var x=54;x<61;x++) fb.px(x-c,y,y>108?(M.bayer(x,y)<0.5?P.m2:P.m3):(x===54?P.w4:(x===60?P.w1:((y-94)%5===2&&x>55&&x<59?P.w0:P.w2)))); }
    if (G.phase==='k5_sat' && G.flags['k5.sat.knock'] && !G.flags['k5.sat.drawn']){ var s=G.flags['k5.sat.draw']||0; if (!s) return;
      fogPatch(fb,139,42,22,36,v.cam,s>=2?0.62:0.5); if (s>=2) tram(fb,140,48,v.cam,{three:true,faces:s>=4,wheels:s>=5?'egg':null}); } };
  // Ružas Küchenfenster am Montagabend
  var K=M.ROOMS.kuca5, k0=K&&K.dynamic;
  if (K) K.dynamic=function(fb,v,S,G){ if (k0) k0(fb,v,S,G);
    if (G.phase==='k5_epi' && G.flags['k5.e.final'] && !G.flags['k5.e.clear']){ var r=M.spot('kuca','window'); if (!r||!r[2]) return; fogPatch(fb,r[0]+3,r[1]+3,r[2]-6,r[3]-6,v.cam,0.6);
      if (G.flags['k5.e.tram']) tram(fb,Math.round(r[0]+r[2]/2-9),Math.round(r[1]+r[3]/2-9),v.cam,{three:true,faces:true,wheels:G.flags['k5.e.wheels']?'round':null}); } };
  // die Pension in der Nacht: der Atem am Fenster, eine Drei
  var Q=M.ROOMS.pansion5, q0=Q&&Q.dynamic;
  if (Q) Q.dynamic=function(fb,v,S,G){ if (q0) q0(fb,v,S,G); var t=G.flags['k5.n1.fog']; if (G.phase!=='k5_n1' || !t || v.gt-t>6000 || v.gt<t) return;
    var r=M.spot('pansion','window'); if (!r||!r[2]) return; var a=1-(v.gt-t)/6000, cx=Math.round(r[0]+r[2]/2-6), cy=Math.round(r[1]+r[3]/2-4); fogPatch(fb,cx-4,cy-4,22,18,v.cam,0.7*a);
    var th=G.flags['k5.n1.three']; if (th && v.gt>=th && v.gt-th<5000) pline(fb,[[cx+4,cy],[cx+8,cy],[cx+6,cy+4],[cx+8,cy+8],[cx+4,cy+8]],v.cam,P.m2); };
})();
})(M);
