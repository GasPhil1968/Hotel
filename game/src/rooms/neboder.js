/* ===== rooms/neboder.js — der Hof von Haus 7 in Alipašino Polje: die ausgebrannte Uhr, Alija an der alten Kioskstelle, die Haltestelle der Drei ===== */
(function(M){
'use strict';
var P=M.P;
function ph(G){ return G.phase; }
function alijaHere(G){ return ['k2_s2','k2_s3','k2_s3_n','k2_fin'].indexOf(G.phase)>=0 || (G.phase==='k2_fin_n' && !G.flags['k2.f2.boarded'] && !G.flags['k2.f2.alija']); }
// ---------------------------------------------------------------- Alija, der Kiosk
async function talkAlija(A){ var Al=A.npc('alija'); A.found('alija');
  if (A.G.phase==='k2_fin_n') return alijaLast(A,Al);
  if (A.first('alFirst')){ await Al.say('Novine? Karte? Za trojku, za jedinicu?'); await A.g('Sie verkaufen noch Fahrscheine?'); await Al.say('Immer. Auch wenn keine Bahn fährt. Gerade dann.'); await A.wait(600); await Al.say('Dich kenne ich doch. Die Kleine vom Neunten. Mit dem Mali.'); await A.g('…Mit wem?'); await Al.say('Mit dem Mali vom Siebten. Ihr habt immer zwei gekauft, samstags.'); }
  await A.menuLoop(function(){ return [
    {t:'Was habe ich zuletzt bei Ihnen gekauft?',if:!A.hasNote('m2_alija'),go:async function(A){ await Al.say('Zuletzt …'); await A.wait(900); await Al.say('Zwei. Zwei Fahrscheine für die Drei, im November, als keine fuhr. Ich habe gesagt: Kind, es fährt keine. Du hast gesagt: Für später. Für die erste Drei nach dem Krieg.');
        await Al.say('Ich habe sie mit meiner Sternzange gelocht, damit sie gelten. Und du hast etwas hinten draufgeschrieben.'); A.note('m2_alija'); await A.wait(600); await A.g('Für später.'); }},
    {t:'Wer war der Mali?',once:'al1',go:async function(A){ await Al.say('Der Kleine vom Siebten. Vuković. Der hatte immer die Hände in den Taschen und die Mütze schief.'); await Al.say('Du hast ihm immer die Mütze geradegerückt. Er hat sie immer wieder schiefgezogen.'); }},
    {t:'Wie lange stehen Sie schon hier?',once:'al2',go:async function(A){ await Al.say('Seit dreiundsechzig. Ich habe den Kiosk selbst gebaut. Mit meinen Händen.'); await A.wait(600); await Al.say('Wo ist er eigentlich? Ich sehe ihn nicht mehr gut. Meine Augen …'); await A.g('Er ist da. Für mich ist er da.'); }},
    {t:'(Gehen.)',bye:true}
  ]; }); }
async function alijaLast(A,Al){ if (A.first('alLast')){ await Al.say('Ihr fahrt?'); await A.wait(700); await Al.say('Mit meinen Fahrscheinen? Die vom November?'); await A.g('Mit Ihren.'); await Al.say('Dann ist es die erste Drei nach dem Krieg.'); await A.wait(900); await Al.say('Gute Fahrt, Kinder.'); return; }
  await Al.say('Gute Fahrt.'); }
// ---------------------------------------------------------------- Die letzte Nacht: die Drei kommt
async function boardNight(A){ if (A.G.phase!=='k2_fin_n') return A.m(A.G.phase==='k2_epi'?'Heute fahre ich mit dem Bus. Von dort.':'Die Drei. Nicht jetzt.');
  if (!A.has('ticket_l')){ await A.g('Warte. Du brauchst meinen Fahrschein.'); return; }
  if (!A.S.tramIn){ A.set('tramIn',true); A.sfx('tramBell'); A.rebuild(); await A.wait(700); await A.narrate('Die Drei kommt durch den Schnee, gelbes Licht hinter beschlagenen Scheiben. Leer bis auf den Fahrer.'); await A.wait(400); }
  if (!A.flag('k2.f2.alija')) await alijaRealize(A);
  A.setFlag('k2.f2.boarded'); A.sfx('tramDoor'); await A.goto('tramvaj',{noEnter:false}); }
// Alija erkennt es, als die erste Drei mit seinen gelochten Fahrscheinen kommt
async function alijaRealize(A){ var Al=A.npc('alija'); if (!Al || !Al.actor) return; A.setFlag('k2.f2.alija'); A.found('alija');
  await A.wait(500); await Al.say('Meine Sterne.'); await A.wait(600); await A.g('Ihre Fahrscheine, Čika Alija. Die vom November.');
  await Al.say('Die habe ich gelocht. Für dich, Kleine. Für später.'); await A.g('Jetzt ist später.');
  await Al.say('Später …'); await A.wait(700); await Al.say('Welches Jahr haben wir denn?'); await A.m('Zweitausendelf.');
  Al.agitate(3600); await A.wait(900); await Al.say('Zweitausendelf. Und ich stehe hier und halte die Zeitung von gestern hin.');
  await A.realize('alija');
  await A.wait(600); await Al.say('Keiner hat mehr bei mir gekauft. Alle sind vorbeigegangen, als stünde hier nichts.'); await A.wait(700); await Al.say('Hier stand ja auch nichts.');
  await A.wait(800); await Al.say('Ich mache zu, wenn ihr weg seid. Erst fährt die Bahn, dann schließt der Kiosk. So war es immer.'); await Al.say('Gute Fahrt, Kinder.');
  await A.wait(500); await A.g('Er hat mir die Fahrscheine verkauft, kurz bevor ich wegmusste. Er hat „Gute Fahrt“ gesagt. Genau wie eben.'); A.save(); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Die Straße an den Hochhäusern entlang, Richtung Zentrum.',canExit:async function(A){ if (A.G.phase==='k2_fin_n'){ await A.g('Nicht weggehen. Die Drei kommt hierher.'); return false; } return true; }},
 {id:'alija',npc:'alija',name:'Alija',hgt:46,vis:function(S,G){ return alijaHere(G); },talk:function(A){ return A.isMala()?talkAlija(A):(A.isFound('alija')?A.m('Alija winkt mir mit einer Zeitung, die es nicht mehr gibt. Er redet mit ihr, nicht mit mir.'):A.m('Eine Betonplatte. Sonst nichts.')); },
   look:function(A){ return A.m(A.isFound('alija')?'Ein alter Mann mit Schiebermütze und Ärmelschonern an der Stelle, an der früher sein Kiosk stand. Er hält eine Zeitung hin.':'Eine Betonplatte mit vier abgesägten Stahlstümpfen.'); },
   g:{look:'Ein alter Mann mit Schiebermütze. Er verkauft Fahrscheine. Er steht in seinem Kiosk, und der Kiosk ist aus Licht.',talk:function(A){ return talkAlija(A); }}},
 {id:'kiosk_spot',name:'Alte Kioskstelle',look:'Eine Betonplatte neben der Haltestelle. Vier abgesägte Stahlstümpfe, ein verrostetes Blechschild „KIOSK“. Jemand hat eine Plastikblume in einen Stumpf gesteckt.',
   g:{look:'Hier stand ein Kiosk. Er steht noch. Für mich.',sense:async function(A){ await A.g('Fahrscheine. Kaugummi. Zeitungen, die nur einen Bogen hatten. Und ein Mann, der immer „Kind“ gesagt hat.'); }}},
 {id:'tram_stop',name:'Haltestelle',look:function(A){ return A.m(A.G.phase==='k2_fin_n'?'Die Haltestelle im Schnee. „ALIPAŠINO POLJE“. Die letzte Drei des Tages kommt bald.':'Die Haltestelle „ALIPAŠINO POLJE“. Ein Wartehäuschen aus Plexiglas, zerkratzt mit Namen und Herzen.'); },use:function(A){ return boardNight(A); },
   g:{look:'Die alte Haltestelle war da drüben. Dreihundert Meter weiter. Unter der Uhr.'}},
 {id:'tram',name:'Straßenbahn',vis:function(S){ return !!S.tramIn; },look:'Die Drei, Türen offen, gelbes Licht, Schnee auf dem Dach.',use:function(A){ return boardNight(A); },open:function(A){ return boardNight(A); },g:{look:'Die Drei. Unsere.'}},
 {id:'tower7',name:'Hochhaus Nr. 7',look:'Haus Nummer 7. Achtzehn Stockwerke Beton, Loggien, Wäsche, Satellitenschüsseln. Im siebten Stock, dritte Loggia von links: unser Fenster.',
   g:{look:'Der neunte Stock. Ich zähle die Fenster, ohne es zu wollen.',sense:'So viele Leben übereinander. Wie in einem Regal.'}},
 {id:'roofclock',name:'Dachuhr',look:'Ganz oben auf dem Dach eine große, rußschwarze Uhr ohne Zeiger. Zweiundneunzig ausgebrannt, sagt Rade. Seitdem zeigt sie keine Zeit, sondern nur, dass es eine gab.',
   g:{look:'Grüne Ziffern. Sie leuchtet. Für mich leuchtet sie noch. Zehn nach elf.'}},
 {id:'haustor_door',name:'Haustür',exit:{to:'haustor'},look:'Die Haustür von Nummer 7, Glas und Aluminium, das Glas mit Klebeband geflickt. Daneben ein Klingeltableau mit sechzig Knöpfen.',
   canExit:async function(A){ if (A.G.phase==='k2_s2'){ await A.m('Ich stehe vor der Tür. Ich drücke nicht. Noch nicht.'); if (A.G.malaOn) await A.g('Noch nicht.'); return false; } if (A.G.phase==='k2_fin_n'){ await A.g('Nicht heute Nacht.'); return false; } return true; },
   g:{look:'Ich bin hier tausendmal hineingegangen. Durch die Tür, nicht durch die Wand.'}},
 {id:'balconies',name:'Loggien',look:'Loggien mit Wäsche, Fahrrädern, Blumenkästen, einer Fahne von Željo. In einer sitzt ein alter Mann im Unterhemd und raucht, obwohl es kalt ist.',g:{look:'In einer Loggia hat eine Frau jeden Abend die Wäsche hereingeholt und dabei gesungen.'}},
 {id:'towers',name:'Hochhäuser',look:'Hochhäuser, eins neben dem anderen, wie Dominosteine, die nicht umgefallen sind. Manche frisch verputzt, manche noch mit Narben.',g:{look:'Dahinter war die Front. Ganz nah. Man hat es gehört, jede Nacht.'}},
 {id:'playground',name:'Spielplatz',look:'Ein Spielplatz mit einem Klettergerüst aus Rohren, eine Schaukel, eine Rutsche mit einem Riss. Zwei Kinder streiten sich um die Schaukel.',g:{look:'Hier durften wir nicht spielen. Damals. Wir haben es trotzdem getan, wenn es still war.'}},
 {id:'sandpit',name:'Sandkasten',look:'Ein Sandkasten mit Betonrand. In einer Ecke eine kleine eiserne Luke, halb unter Sand.',g:{look:'Unter dem Sand ist der Keller. Ich kann ihn spüren.'}},
 {id:'hatch',name:'Luke',look:'Eine eiserne Luke am Rand des Sandkastens, mit einem Vorhängeschloss. Ein Notausstieg des Schutzraums.',open:'Abgeschlossen und verrostet. Ohne Šehić und ohne Brecheisen geht hier nichts.',g:{look:'Durch diese Luke sind Kinder hinausgeklettert, wenn die Tür verschüttet war. Einmal.'}},
 {id:'bench',name:'Bank',look:'Eine Bank vor dem Haus. Hier sitzen im Sommer die Alten und wissen alles.',g:{look:'Auf dieser Bank hat jemand Fahrscheine gezählt. Zwei.'}},
 {id:'cars',name:'Autos',look:'Ein alter Golf, ein Yugo mit einem Aufkleber „Sarajevo 84“, ein Mercedes ohne Räder auf Ziegeln.',g:{look:'Der Yugo war schon damals da. Ich glaube, er ist nie wieder gefahren.'}},
 {id:'trees',name:'Pappeln',look:'Pappeln, kahl, mit Krähen. Nachgepflanzt. Die alten sind im Winter dreiundneunzig in den Öfen verschwunden.',g:{look:'Die alten Bäume haben uns gewärmt. Einen Winter lang.'}},
 {id:'lamp',name:'Laterne',look:'Eine Straßenlaterne, die flackert. Um sie herum Schnee, der nicht liegen bleibt. Noch nicht.',g:{look:'Unter dieser Laterne haben wir gewartet.'}}
];
M.room('neboder',{ name:'Alipašino Polje', scape:'k2_neboder', music:function(G){ return G.phase==='k2_fin_n'?'k2_finale':(G.phase==='k2_epi'?'k2_sjecanje':'k2_mala'); },
  state:function(G){ return {tramIn:false}; },
  actors:function(S,G){ var L=[]; S.tramIn=false; if (alijaHere(G)){ var a=M.apos('neboder','alija',[400,124,'R']); L.push({id:'alija',ch:'alija',x:a[0],y:a[1],f:a[2]||'R',name:'Alija',ghost:true,reveal:true,idle:'sell',speechY:46}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (A.first('k2nbF')){ await A.m('Alipašino Polje. Die Hochhäuser. Haus Nummer 7.'); await A.wait(800); await A.m('Ich habe hier gewohnt. Siebter Stock. Bis zweiundneunzig.'); A.note('m2_marko7');
      await A.wait(700); await A.m('Oben auf dem Dach die Uhr. Ausgebrannt. Ich habe sie nie anders gesehen. In meinem Kopf.'); if (A.G.malaOn){ await A.wait(900); await A.g('Ich habe sie anders gesehen.'); await A.g('Grün. Mit leuchtenden Ziffern.'); } }
    if (p==='k2_s3' && A.first('k2nbS3')){ A.setFlag('k2.s3.arrived'); await A.m('Nebel zwischen den Türmen. Ich gehe hinein. Diesmal gehe ich hinein.'); }
    if (p==='k2_fin_n' && A.first('k2nbFN')){ await A.narrate('Nacht. Der erste Schnee fällt auf Alipašino. Die Haltestelle ist leer, das Wartehäuschen leuchtet.'); await A.g('Hier sind wir eingestiegen. Samstags um zehn nach elf.'); await A.m('Heute ist Mittwoch.'); await A.g('Heute ist Samstag. Für uns.'); }
    if (p==='k2_epi' && A.first('k2nbEpi')){ await A.narrate('Morgen. Schnee auf den Loggien, auf den Autos, auf dem Sandkasten. Die Kinder bauen schon einen Schneemann, mit einer Mütze von Željo.'); } }
});
})(M);
