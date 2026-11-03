/* ===== rooms/tramvaj.js — in der Straßenbahn: die Eins im Prolog, die letzte Drei im Finale ===== */
(function(M){
'use strict';
var P=M.P;
function night(G){ return G.phase==='k2_fin_n'; }
// ---------------------------------------------------------------- Prolog: Entwerten, die Fahrt in die Baščaršija
async function validate(A,item){ if (night(A.G)) return validateNight(A,item);
  if (item==='tramkarta_v') return A.m('Schon entwertet. Noch einmal und er ist ein Sieb.');
  await A.reach(); A.sfx('punch'); A.take('tramkarta'); A.give('tramkarta_v'); A.setFlag('k2.p1.validated');
  await A.m('Klack. Ein Muster aus Löchern und eine Uhrzeit: 16:52.'); if (A.first('valMem')){ await A.wait(500); await A.m('Das Geräusch kenne ich. Meine Hand kennt es. Ich wusste nicht, dass Hände sich erinnern.'); }
  await ride(A); }
async function ride(A){ if (A.flag('k2.p1.rode')) return; A.setFlag('k2.p1.rode'); var S=A.S;
  await A.wait(700); A.set('view','museum'); A.sfx('tramBell'); await A.narrate('Marijin Dvor. Ein großes gelbes Hotel, zwei gläserne Türme, ein Museum, vor dem eine riesige Konservendose aus Stein steht.');
  await A.m('Die Dose. Die stand damals nicht da. Damals standen wir Schlange für die echten.'); await A.wait(500);
  A.set('view','cathedral'); await A.narrate('Die Kathedrale. Die Glocken schlagen fünf. Ich zähle mit, ohne es zu wollen.'); A.sfx('bellsFar'); await A.wait(800);
  A.set('view','river'); await A.narrate('Die Miljacka. Eine Brücke, dann ein gestreiftes Haus unter einem Gerüst.'); await A.m('Die Vijećnica. Sie bauen sie immer noch wieder auf.'); await A.wait(600);
  A.set('view','bascarsija'); A.set('moving',false); A.sfx('tramBrake'); await A.wait(600); await A.voice('„Baščaršija. Zadnja stanica.“ Endstation.',P.s4); A.sfx('tramDoor');
  A.save(); }
async function inspector(A){ var K=A.npc('kontrolor'); if (!K.actor){ var dp=M.stand('tramvaj','door')||[270,124,'R']; K=A.spawn({id:'kontrolor',ch:'kontrolor',x:dp[0]-20,y:dp[1],f:'L',name:'Kontrolleur'}); }
  await K.say('Karta, molim.'); await A.m('Hier.'); await K.say('Nicht entwertet.'); await A.wait(400); await K.say('Erstes Mal in Sarajevo?');
  var c=await A.choose([{t:'Nein. Aber das erste Mal seit siebzehn Jahren.',id:'long'},{t:'Ja.',id:'yes'},{t:'Ich wollte gerade.',id:'about'}],{title:'Kontrolleur'});
  if (c==='long'){ await K.say('Siebzehn Jahre.'); await A.wait(600); await K.say('Dann entwerten Sie mal. Willkommen zu Hause.'); }
  else if (c==='yes'){ await K.say('Das sagen alle. Entwerten, bitte. Orange, da an der Stange.'); }
  else { await K.say('Das sagen auch alle. Entwerten.'); }
  A.setFlag('k2.p1.warned'); var vs=M.stand('tramvaj','validator'); if (vs) await A.walk(vs[0],vs[1]); await A.face(vs&&vs[2]||'B'); await validate(A,'tramkarta');
  if (K.actor){ K.actor.fadeOut=A.gt; await A.wait(400); A.despawn('kontrolor'); } }
async function door(A){ if (night(A.G)) return doorNight(A);
  if (!A.flag('k2.p1.validated')){ if (A.flag('k2.p1.warned')) return A.m('Erst entwerten.'); return inspector(A); }
  if (A.S.moving){ await A.m('Wir fahren noch.'); return; }
  A.sfx('tramDoor'); await A.goto('carsija',{noEnter:false}); }
// ---------------------------------------------------------------- Finale: die letzte Drei
async function validateNight(A,item){ var S=A.S;
  if (item==='ticket_m'){ if (S.markoV) return A.m('Schon entwertet. Achtzehn Jahre zu spät, genau richtig.'); await A.reach(); A.sfx('punch'); S.markoV=true; A.setFlag('k2.f2.vM');
    await A.m('Klack. Ein zweites Loch neben dem Stern von Alija. Der Entwerter druckt: 23.11.2011, 23:16.'); await A.wait(400); await A.m('Sechzehn nach elf. Natürlich.'); }
  else if (item==='ticket_l'){ if (S.malaV) return A.m('Ihrer ist entwertet.'); await A.reach(); A.sfx('punch'); S.malaV=true; A.setFlag('k2.f2.vL'); await A.m('Klack.'); await A.wait(700); if (A.G.malaOn) await A.g('…'); await A.g('Jetzt ist es eine Fahrt.'); }
  else if (item==='tramkarta_v'){ return A.m('Den von Samstag brauche ich nicht. Heute fahren wir mit den alten.'); }
  if (S.markoV && S.malaV && !A.flag('k2.f2.rideStart')) await rideNight(A); }
async function rideNight(A){ A.setFlag('k2.f2.rideStart'); A.G.flags['mala.lock']=true; var S=A.S;
  var st=M.stand('tramvaj','seat')||[150,124,'B']; await A.walk(st[0],st[1]); await A.face('R'); A.idleM('sit'); var mp=M.apos('tramvaj','mala',[st[0]-16,st[1]-2,'R']); A.placeG(mp[0],mp[1],'R'); A.idleG('sit');
  A.sfx('tramBell'); A.set('moving',true); A.set('view','towers'); A.music('k2_finale'); await A.voice('Damir, aus der Kabine: „Letzte Drei für heute. Ich fahre die ganze Strecke. Die alte.“',P.s4);
  await A.wait(900); await A.g('Samstags um 11:10. Du hast immer am Fenster gesessen. Ich daneben, damit du nicht herausfällst.'); await A.m('Ich bin nie herausgefallen.'); await A.g('Weil ich daneben saß.');
  A.set('view','unitic'); await A.wait(800); await A.narrate('Die zwei Glastürme. Damals waren sie schwarz und hatten keine Fenster mehr.');
  await A.g('Hier hast du jedes Mal gefragt, ob die Türme umfallen.'); await A.m('Und du hast gesagt …'); await A.g('„Nur wenn du nicht hinschaust.“'); await A.m('Ich habe immer hingeschaut.'); await A.wait(600);
  A.set('view','yellow'); await A.wait(600); await A.narrate('Das gelbe Hotel. Davor, im Schnee, die Haltestelle, an der wir nie ausgestiegen sind.');
  A.set('view','museum'); await A.wait(700); await A.g('Die Dose.'); await A.m('Das Denkmal. Für die Hilfslieferungen. Für die Dosen, die wir gegessen haben.'); await A.g('Meine ist kleiner.'); await A.m('…'); await A.wait(500); await A.m('Darin war Fleisch. In deiner ist ein Fahrschein.'); await A.g('Und ein halbes Foto.'); await A.m('Nicht mehr.'); await A.wait(700);
  A.set('view','cathedral'); A.sfx('bellsFar'); await A.wait(400); await A.g('…'); await A.m('Sie läuten nicht für uns.'); await A.g('Ich weiß. Ich habe es nur nie geglaubt.'); await A.wait(800);
  // Geständnis: keine falsche Antwort, nur andere Worte
  await A.m('Lana.'); await A.wait(800); await A.g('Ja?');
  var c=await A.choose([{t:'Ich bin nicht gekommen. In der Nacht des Busses.',id:'came'},{t:'Großmutter war krank. Ich habe mich nicht getraut, es dir zu sagen.',id:'ruza'},{t:'Ich habe dich vergessen. Ich wollte dich vergessen.',id:'forgot'}],{title:'Lana'});
  A.G.flags['k2.f2.confess']=c;
  if (c==='came'){ await A.g('Ich weiß. Ich habe bis zum Schluss gewartet. Der Fahrer hat zweimal gehupt.'); await A.m('Ich war oben in Vratnik. Ich habe es gehört. Zweimal.'); }
  else if (c==='ruza'){ await A.g('Ich hätte es verstanden.'); await A.m('Ich war fünfzehn. Ich dachte, wenn ich es nicht sage, ist es nicht wahr.'); await A.g('Das denkst du heute noch.'); }
  else { await A.g('Ich weiß. Darum war ich so leer.'); await A.m('Es tut mir leid.'); await A.g('Ich weiß. Jetzt.'); }
  await A.wait(900); await A.m('Ich bin gekommen. Ich habe dich in Split gesucht. Im Mai vierundneunzig. Alle Hotels.'); await A.g('Ich war schon nicht mehr dort.'); await A.m('Ich weiß das jetzt. Damals dachte ich, du hast mich vergessen.');
  await A.wait(700); await A.g('Du bist gekommen.'); await A.wait(500); await A.g('Nur später.');
  A.set('view','river'); await A.wait(900); await A.narrate('Die Miljacka, schwarz unter dem Schnee. Die Brücke, das Gerüst, ein Licht im Container der Nachtwache.');
  A.set('view','bascarsija'); A.set('moving',false); A.sfx('tramBrake'); await A.wait(600); await A.voice('„Baščaršija. Zadnja stanica.“',P.s4); A.sfx('tramDoor');
  A.idleM(null); A.idleG(null); A.G.flags['mala.lock']=false; A.setFlag('k2.f2.rideEnd'); A.save();
  await A.g('Komm. Ein Stück noch. Bis zur Bank.'); }
async function doorNight(A){ var S=A.S; if (!A.flag('k2.f2.rideStart')){ await A.g(A.cycle('dnN',['Nicht aussteigen. Wir sind noch nicht losgefahren.','Erst entwerten. Beide.'])); return; }
  if (S.moving) return A.m('Wir fahren noch.'); A.sfx('tramDoor'); await A.goto('carsija',{noEnter:false}); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:function(S,G){ return {to:'carsija'}; },canExit:async function(A){ await door(A); return false; },
   look:function(A){ return A.m(A.S.moving?'Die Falttür. Draußen zieht die Stadt vorbei.':'Die Tür ist offen. Kalte Luft, Tauben, die Endstation.'); }},
 {id:'validator',name:'Entwerter',look:function(A){ return A.m(night(A.G)?'Der orange Entwerter. Er hat in achtzehn Jahren eine neue Farbe bekommen und sonst nichts.':'Ein orangefarbener Kasten mit einem Schlitz. „Poništi kartu.“ Entwerte die Karte.'); },
   use:function(A){ return A.m(night(A.G)?'Ich brauche zwei Fahrscheine. Meinen alten. Und ihren.':'Ich brauche einen Fahrschein, den ich hineinstecken kann.'); },
   with:{ tramkarta:function(A){ return validate(A,'tramkarta'); }, tramkarta_v:function(A){ return validate(A,'tramkarta_v'); }, ticket_m:function(A){ return validate(A,'ticket_m'); }, ticket_l:function(A){ return validate(A,'ticket_l'); } },
   g:{look:function(A){ return A.g(night(A.G)?'Er macht dasselbe Geräusch wie damals. Ich habe es mir nicht eingebildet.':'Ich kann ihn nicht benutzen. Ich habe ihn immer für dich benutzt.'); }}},
 {id:'seat',name:'Sitzbank',look:function(A){ return A.m(night(A.G)?'Die Bank am Fenster. Hier haben wir gesessen. Ich am Fenster, sie daneben.':'Rotbraunes Kunstleder, an den Kanten aufgeplatzt. Jemand hat einen Fußballverein hineingeritzt.'); },
   use:async function(A){ if (night(A.G) && !A.flag('k2.f2.rideStart')) return A.m('Erst entwerten.'); return A.m('Ich bleibe stehen. Im Stehen sieht man mehr.'); },
   g:{look:'Am Fenster. Hier hat er immer gesessen. Ich daneben.',sense:async function(A){ if (night(A.G)) return A.g('Zwei Kinder. Samstag. Ich halte eine kleine Hand und tue so, als müsste ich mich festhalten.'); await A.g('Hier hat jemand gesessen, der Angst hatte, herauszufallen. Und jemand daneben.'); }}},
 {id:'window',name:'Fenster',look:async function(A){ var v=A.S.view||'city', T={city:'Fassaden, Laternen, nasse Autos. Eine Stadt, die ich kenne und nicht wiedererkenne.',towers:'Die Hochhäuser von Alipašino, im Schnee. In manchen Fenstern brennt noch Licht.',unitic:'Die zwei Glastürme, hell erleuchtet.',yellow:'Das gelbe Hotel, würfelförmig, wie ein Kind es zeichnen würde.',museum:'Das Museum und das Denkmal: eine Konservendose aus Stein, so groß wie ein Kiosk.',cathedral:'Die Kathedrale. Zwei Türme im Nebel.',river:'Die Miljacka. Eine Brücke, ein gestreiftes Haus unter einem Gerüst.',bascarsija:'Die Baščaršija. Tauben, Holzläden, die Kuppel des Sebilj.'};
     await A.m(T[v]||T.city); if (v==='museum' && A.first('winDose') && !night(A.G)) await A.m('Wir haben die Dosen „ICAR“ genannt, nach dem Aufdruck. Niemand wusste, was drin war. Niemand wollte es wissen.'); },
   g:{look:'Da draußen ist alles, was war. Und die Scheibe dazwischen.'}},
 {id:'route',name:'Linienplan',look:function(A){ return A.m(A.S.line==='3'?'„3 ILIDŽA – BAŠČARŠIJA“. Die ganze Stadt auf einem Streifen Plastik.':'„1 ŽELJEZNIČKA STANICA – BAŠČARŠIJA“. Die kürzeste Linie. Die Eins hatte es nie eilig.'); },read:function(A){ return A.m(A.S.line==='3'?'Ilidža, Stup, Alipašino Polje, Socijalno, Pofalići, Marijin Dvor, Skenderija, Baščaršija. Ich kann sie noch auswendig.':'Željeznička stanica, Marijin Dvor, Skenderija, Latinska ćuprija, Baščaršija.'); },
   g:{look:function(A){ return A.g(A.S.line==='3'?'Alipašino Polje. Da bin ich eingestiegen. Immer.':'Das ist nicht meine Linie.'); }}},
 {id:'cab',name:'Fahrerkabine',look:function(A){ return A.m(night(A.G)?'In der Kabine Damir, die Mütze im Nacken. Er sieht im Spiegel nach hinten, als wüsste er, dass wir zu zweit sind.':'Hinter Glas der Fahrer. Er fährt mit einer Hand und isst mit der anderen.'); },
   talk:async function(A){ if (night(A.G)){ await A.voice('„Keine Angst, Übersetzer. Ich fahre langsam. Heute fahre ich langsam.“',P.s4); return; } await A.voice('„Ne razgovarati s vozačem.“ Nicht mit dem Fahrer reden. Er zeigt auf das Schild.',P.s4); },
   g:{look:'Die Fahrer haben uns immer zugewinkt. Uns zwei.'}},
 {id:'joint',name:'Gelenk',look:'Das Gelenk zwischen den Wagen, ein Faltenbalg und ein Drehteller im Boden. Als Kind habe ich mich immer daraufgestellt, wenn es um die Kurve ging.',use:async function(A){ await A.m('Ich stelle mich darauf. Der Boden dreht sich unter mir weg. Das Gefühl ist dasselbe wie mit zehn.'); },
   g:{look:'Du hast dich immer da draufgestellt. Ich habe dich an der Jacke festgehalten.'}},
 {id:'ad',name:'Werbung',look:'Werbung für einen Handyvertrag und ein Plakat: „Ne zaboravi – Sjeti se.“ Vergiss nicht. Erinnere dich. Es geht um Blutspenden.',g:{look:'„Erinnere dich.“ Als wäre das so leicht.'}},
 {id:'lamp',name:'Neonlicht',look:'Neonröhren unter der Decke, eine flackert. Sie flackert schon seit dem Bahnhof.',g:{look:'Licht, das nicht warm macht.'}},
 {id:'babica',npc:'babica',name:'Alte Frau',hgt:34,vis:function(S,G){ return !night(G); },look:'Eine alte Frau mit Kopftuch und einer Stofftasche voller Lauch. Sie sitzt, als wäre die Bank ihr Wohnzimmer.',
   talk:async function(A){ var B=A.npc('babica'); if (A.first('babT')){ await B.say('Kalt heute, sine. Der Nebel kommt bis in die Knochen.'); await A.m('In Split regnet es.'); await B.say('Split.'); await A.wait(600); await B.say('Mein Sohn ist in Split. Seit vierundneunzig. Er ruft jeden Sonntag an.'); await A.m('Jeden Sonntag. Das ist gut.'); await B.say('Ja. Das ist gut.'); return; }
     await B.say(A.cycle('babC',['Steigen Sie in der Baščaršija aus? Alle steigen in der Baščaršija aus.','Lauch ist teuer geworden. Alles ist teuer geworden. Nur die Straßenbahn nicht.'])); },
   g:{look:'Sie hat einen Sohn, der anruft. Das sieht man.'}},
 {id:'student',npc:'student',name:'Student',hgt:46,vis:function(S,G){ return !night(G); },look:'Ein Student mit Kopfhörern, aus denen etwas sehr Lautes sehr leise kommt.',
   talk:async function(A){ var St=A.npc('student'); await St.say(A.cycle('stT',['Was? Sorry. Was?','Nein, die fährt bis zur Baščaršija. Endstation.','Splićanin? Hajduk? Hmm. Željo.'])); },
   g:{look:'Er hört Musik von damals. Er weiß es nicht.'}}
];
M.room('tramvaj',{ name:'Straßenbahn', scape:'k2_tram', noSave:false,
  music:function(G){ return night(G)?'k2_finale':'k2_sarajevo'; },
  state:function(G){ return {line:'1',moving:true,view:'city'}; },
  actors:function(S,G){ var L=[]; if (!night(G)){ var b=M.apos('tramvaj','babica',[90,120,'R']); L.push({id:'babica',ch:'babica',x:b[0],y:b[1],f:b[2]||'R',name:'Alte Frau',idle:'sit',speechY:38});
      var s=M.apos('tramvaj','student',[214,124,'F']); L.push({id:'student',ch:'student',x:s[0],y:s[1],f:s[2]||'F',name:'Student',idle:'hold',speechY:46}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var S=A.S;
    if (night(A.G)){ S.line='3'; if (!A.flag('k2.f2.rideStart')){ S.moving=false; S.view='towers'; A.rebuild(); if (A.first('k2trN')){ await A.m('Die Drei. Leer, warm, gelbes Licht. Draußen schneit es auf die Gleise.'); await A.g('Hast du deinen Fahrschein?'); await A.m('Meinen alten. Und du?'); await A.wait(700); await A.g('Meinen.');
        if (A.flag('k2.f2.alija')){ await A.wait(700); A.sfx('gate'); await A.narrate('Durch das hintere Fenster sehe ich Alija an der Haltestelle. Er zieht einen Rollladen herunter, den es nicht mehr gibt, und hebt die Hand. Dann ist die Haltestelle leer.'); } } }
      return; }
    if (A.first('k2trP')){ S.line='1'; S.moving=true; S.view='city'; A.rebuild(); A.sfx('tramBell'); await A.m('Die Eins ruckelt los. Sie quietscht in der ersten Kurve wie früher.'); await A.m('Niemand sieht auf, außer mir.'); } }
});
// Mala gibt ihren Fahrschein her (nur in der letzten Nacht)
M.defineItems({ ticket_l:{name:'Malas Fahrschein',icon:function(w){ w.rect(7,8,18,9,P.s4); w.hl(7,24,8,P.s5); w.rect(8,9,4,7,P.r2); M.microText(w.buf,'3',9,10,P.s6); w.hl(14,22,11,P.s2); w.hl(14,20,13,P.s2); w.px(22,14,P.k1); w.px(21,15,P.k1); w.px(23,15,P.k1); w.px(22,16,P.k1); },
  look:'Ihr Fahrschein. Er ist warm. Er ist echt, für einen Atemzug. Hinten in ihrer Schrift: „Za prvu trojku poslije rata.“',mala:'Halt ihn fest. Er ist leichter, als er aussieht.'} });
})(M);
