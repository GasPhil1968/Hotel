/* ===== rooms/office.js + archive — Hafenbüro: Mladen, das Fahrtenbuch von 1984; Archiv (nur Mala): der Zahlendreher ===== */
(function(M){
'use strict';
var P=M.P;
async function talkMladen(A){ var Ml=A.npc('mladen');
  if (A.first('mlHello')){ await A.m('Dobra večer.'); await Ml.say('Die letzte Fähre nach Supetar geht um halb zehn. Die nach Šolta ist weg. Und nein, ich weiß nicht, warum der Automat keine Münzen nimmt.'); }
  await A.menuLoop(function(){ return [
    {t:'Ich habe eine Frage zu einer Fähre. Von 1984.',if:!A.flag('c1.mlOk'),go:async function(A){ await Ml.say('Neunzehnhundertvierundachtzig. Junger Mann, ich weiß nicht einmal, wo meine Brille ist.'); await Ml.say('Wozu brauchen Sie das?');
        var c=await A.choose([{t:'Für einen Text über eine Frau, die letzte Woche gestorben ist.',id:'ok'},{t:'Das ist privat.',id:'priv'},{t:'Für die Zeitung. Glas Rive.',id:'paper'}]);
        if (c==='priv'){ await Ml.say('Dann bleibt das Archiv auch privat.'); return; }
        if (c==='paper') await Ml.say('Die Zeitung. Die schreiben über alles, nur nicht über die Fahrpläne.'); else await Ml.say('…Wer?');
        await A.m('Ivka Perić. Aus Veli Varoš.'); await Ml.say('Die Perić. Die jeden Abend auf der Mole stand.'); await Ml.say('Gut. Welcher Tag?'); A.setFlag('c1.mlOk'); return askDay(A,Ml); }},
    {t:'Der Tag: der 22. Dezember 1984.',if:A.flag('c1.mlOk')&&!A.flag('c1.searched'),go:function(A){ return askDay(A,Ml); }},
    {t:'Schauen Sie mal im Regal bei „1948“.',if:A.flag('c1.searched')&&A.hasNote('c1_1948')&&!A.flag('c1.logRead'),go:function(A){ return fetchBook(A,Ml); }},
    {t:'Können Sie mir den Eintrag noch einmal vorlesen?',if:A.flag('c1.logRead'),go:function(A){ return readLog(A); }},
    {t:'Wie lange arbeiten Sie schon hier?',once:'ml2',go:async function(A){ await Ml.say('Seit fünfundsiebzig. Drei Staaten, vier Uniformen. Die Fähre nach Supetar fährt immer noch um dieselbe Zeit.'); }},
    {t:'Kannten Sie Gospođa Perić?',once:'ml3',go:async function(A){ await Ml.say('Jeder hier kannte sie. Jeden Abend, die Mole, der letzte Poller.'); await Ml.say('Das Boot aus Supetar legt seit zwanzig Jahren drüben am Fährhafen an, nicht mehr an der Mole. Ich habe es ihr einmal gesagt.');
        await Ml.say('Sie hat gesagt: „Dann weiß er ja, wo ich bin.“'); }},
    A.askOpt({
      c1_waits:'Die alte Perić? Ja. Jeden Abend. Man gewöhnt sich an so etwas, wie an die Glocken.',
      c1_boat7:async function(A){ if (!A.flag('c1.mlOk')) return Ml.say('Das Siebenuhrboot aus Supetar. Gibt es seit 1962. Was ist damit?'); return askDay(A,Ml); },
      c1_date:async function(A){ if (!A.flag('c1.mlOk')) return Ml.say('Der zweiundzwanzigste Dezember? Was soll an dem Tag gewesen sein?'); return askDay(A,Ml); },
      c1_askoffice:'Warum das Boot spät ist? Weil es Abend ist, junger Mann, und das Meer nicht auf Fahrpläne hört.',
      c1_1948:async function(A){ if (!A.flag('c1.searched')) return Ml.say('Neunzehnhundertachtundvierzig? Da war ich noch nicht geboren.'); return fetchBook(A,Ml); },
      c1_ankica:'Die ANKICA. Ein Fischerboot. Fischerboote stehen nicht in meinem Buch, außer wenn etwas passiert.',
      c1_rescued:'Ich habe ihn gesehen, damals. Sie haben ihn mit einer Decke um die Schultern hier hereingebracht. Neunzehn Jahre alt. Er hat nicht geredet.',
      c1_radio:'Das Seewetter? Läuft immer noch jeden Abend. Neunzehn Uhr zwanzig. Hat sich nie jemand beschwert.'
    },'Dazu steht nichts in meinem Buch.'),
    {t:'Danke. Laku noć.',bye:true,go:async function(A){ await Ml.say('Laku noć. Machen Sie die Tür zu, es zieht.'); }}
  ]; }); }
async function askDay(A,Ml){ if (A.flag('c1.searched')) return Ml.say('Der Band ist nicht da. Ich habe es Ihnen gesagt.');
  if (!(A.hasNote('c1_boat7')||A.hasNote('c1_date'))){ await A.m('Ich weiß den Tag nicht genau. Im Dezember.'); await Ml.say('Im Dezember. Kommen Sie wieder, wenn Sie es wissen.'); return; }
  await A.m('Der zweiundzwanzigste Dezember. Das Boot um sieben aus Supetar.'); await Ml.say('Der zweiundzwanzigste … Die Weihnachtsbura. Drei Tage kein Schiff. Die Fenster haben gesungen.'); await Ml.say('Warten Sie.');
  var m=A.npc('mladen'); A.sfx('door'); m.hide(); await A.wait(2200); A.sfx('door'); m.show(); A.setFlag('c1.searched');
  await Ml.say('Der Band 1984 ist nicht da. Irgendwer hat das Regal durcheinandergebracht. Ich suche doch nicht fünfzig Jahre durch.'); A.note('c1_nobook');
  await Ml.say('Da drin ist es immer kalt. Ich gehe nicht gern hinein.');
  if (A.malaHere()) await A.g('Da drin ist es nicht kalt. Da drin ist es still.'); }
async function fetchBook(A,Ml){ await A.m('Schauen Sie mal bei achtundvierzig.'); await Ml.say('Bei achtundvierzig? Warum sollte …'); await Ml.say('Na gut. Weil Sie es sind.');
  var m=A.npc('mladen'); A.sfx('door'); m.hide(); await A.wait(2000); A.sfx('door'); m.show(); A.sfx('paper');
  await Ml.say('Tatsächlich. Irgendein Praktikant mit einem Zahlendreher. Neunzehnvierundachtzig bei achtundvierzig.'); await Ml.say('Hier. Zweiundzwanzigster Dezember.'); A.setFlag('c1.logRead');
  await readLog(A);
  await Ml.say('Matić … Dinko Matić. Der flickt heute noch seine Netze an der Matejuška. Fragen Sie ihn, wenn Sie den Mut haben.'); A.note('c1_matejuska'); A.unlock('matejuska'); A.unlock('sustipan');
  await A.m('Danke, Gospodine Šimić.'); await Ml.say('Bedanken Sie sich nicht. Das ist kein schöner Eintrag.'); }
async function readLog(A){ await A.doc({style:'log',title:'Lučka kapetanija Split · Brodski dnevnik 1984',w:252,lines:['22.12.1984','Bura, 9–10 Bf. Linija Supetar–Split:','polazak 17:00 otkazan.  Sljedeći: 23.12., 06:00.','','21:40  Ribarska brodica ANKICA (vl. M. Matić)','prevrnuta pred Sustipanom.','Spašen: Dinko Matić (19).  Nestao: Antonio Perić (22).','Potraga obustavljena 27.12.']});
  await A.m('Am zweiundzwanzigsten Dezember: Bura, Stärke neun bis zehn. Die Fähre aus Supetar um fünf fiel aus.'); await A.m('Um 21:40 kenterte das Fischerboot ANKICA vor Sustipan. Gerettet: Dinko Matić, neunzehn. Vermisst: Antonio Perić, zweiundzwanzig.');
  A.note('c1_ferry'); A.note('c1_capsized',true); A.note('c1_rescued',true);
  if (A.first('!logReadMala') && A.malaHere()) await A.g('Antonio. Tonći. Sie hat ihn nie anders genannt.'); }
var HS=[
 {id:'door',name:'Tür zur Riva',exit:{to:'riva'},look:'Die Tür zur Riva.'},
 {id:'mladen',npc:'mladen',name:'Mladen Šimić',hgt:30,talk:talkMladen,r:function(S,GS,a){ return [Math.round(a.x)-9,Math.round(a.y)-50,18,34]; },
   look:'Ein Beamter mit Halbglatze, Schnurrbart und Brille auf der Stirn. Er löst ein Kreuzworträtsel, als hinge der Hafen davon ab.',
   g:{look:'Er ist müde. Er ist seit sechsunddreißig Jahren müde.',listen:async function(A){ if (!A.flag('c1.searched')) return A.g('Er murmelt Wörter mit sieben Buchstaben. „Leuchtturm“ hat zehn.'); await A.g('Er murmelt: „Vierundachtzig … der kleine Matić … mit einer Decke um die Schultern …“'); }},
   give:{ postcard:async function(A){ var Ml=A.npc('mladen'); await Ml.say('Supetar, achtzehnter Dezember vierundachtzig. Das Boot um sieben. Ich verstehe.'); if (A.flag('c1.mlOk')) return askDay(A,Ml); }, photo1:'„Die ANKICA. Das Boot vom alten Matić.“' }},
 {id:'counter',name:'Tresen',look:'Ein Holztresen mit Glasaufsatz und einer Durchreiche, durch die seit Jahrzehnten Fahrkarten und Beschwerden wandern.',g:{look:'Holz, das Tausende Hände gehalten hat. Alle hatten es eilig.'}},
 {id:'timetable',name:'Fahrpläne',look:'Fahrpläne. Supetar, Stari Grad, Rogač, Ancona. Die Winterzeiten, mit Kugelschreiber korrigiert.',read:'Supetar: 6:00, 7:30, 9:30, … 19:00, 21:30. Das Boot um sieben gibt es immer noch.',g:{look:'Lauter Zeiten, zu denen jemand irgendwo ankommt.'}},
 {id:'photos',name:'Schiffsfotos',look:'Alte Fotos von Fähren, mit Datum: 1958, 1967, 1979. Auf einem winken Menschen von Deck. Niemand winkt mehr von Fähren.',g:{look:'Auf einem steht ein Mädchen an der Reling. Es ist nicht wichtig. Ich sehe es trotzdem an.'}},
 {id:'radio',name:'Funkgerät',look:'Ein Seefunkgerät. Es knistert und sagt dann wieder nichts.',use:'Ich funke nicht im Hafenamt herum.',g:{listen:'Kanal 16. Ein Fischer fragt nach dem Wetter. Niemand antwortet.',look:'Es rauscht wie das Radio in Ivkas Wohnung.'}},
 {id:'clock',name:'Wanduhr',look:'Eine Amtsuhr. Sie geht drei Minuten vor. Wahrscheinlich absichtlich.',g:{look:'…'}},
 {id:'bench',name:'Wartebank',look:'Eine Wartebank aus Kunststoff, orange. Wer hier sitzt, hat eine Fähre verpasst.',use:'Ich warte lieber im Stehen.',g:{look:'Hier sitzt nachts manchmal jemand, der nirgends hin kann.'}},
 {id:'plant',name:'Gummibaum',look:'Ein Gummibaum, der seit Jahrzehnten so tut, als wäre er glücklich.',g:{look:'Er lebt. Das ist hier drin schon viel.'}},
 {id:'archive_door',name:'Tür „Arhiva“',look:'„ARHIVA – SAMO OSOBLJE.“ Archiv, nur Personal. Abgeschlossen. Natürlich.',open:'Abgeschlossen. Und Mladen sieht mich an.',
   gexit:{to:'archive'},g:{look:'Dahinter ist es kalt. Mich stört das nicht.'}}
];
M.room('office',{ name:'Hafenbüro', scape:'office', music:'case1',
  actors:function(S,GS){ var p=M.apos('office','mladen',[150,104,'F']); return [{id:'mladen',ch:'mladen',x:p[0],y:p[1],f:p[2]||'F',name:'Mladen',speechY:52}]; },
  hotspots:HS,
  enter:async function(A,from){ if (from==='riva' && A.first('offIn')) await A.m('Neonlicht und Kaffeegeruch. Ein Amt, das nie ganz schließt, weil das Meer nie ganz schließt.');
    if (from==='archive' && A.isMala() && A.hasNote('c1_1948') && A.first('!backFromArchive')) await A.g('Ich habe ihn gefunden. Ich kann ihn nur nicht herausholen.'); }
});
M.defineScape('office',{beds:['room','neon','seaFar'],step:'tile',ev:[['radio',8,18,0.8,0.3,0.7],['horn',40,80,0.4,-0.6,-0.2],['steps',30,60,0.3,-1,-0.6]],fixed:[['tick',1,0.5,-0.3]]});

// ---------------------------------------------------------------- Archiv (nur Mala)
var AH=[
 {id:'door',name:'Tür',gexit:{to:'office'},look:'Die Tür.',g:{look:'Zurück zu ihm.'}},
 {id:'shelf_40s',name:'Regal: 1946–1959',g:{look:'Neunzehnhundertsechsundvierzig, siebenundvierzig, achtundvierzig … Die Jahre nach dem Krieg sind dünn. Es fuhr nicht viel.',sense:'Hier sind die Ordner kalt wie Stein. Niemand hat sie je wieder angefasst.'}},
 {id:'binder_1948',name:'Ordner bei „1948“',g:{look:async function(A){ await A.g('Ein Ordner im Fach „1948“. Auf dem Rücken steht 1984. Jemand hat die Ziffern vertauscht.'); A.setFlag('c1.found1984'); A.note('c1_1948'); await A.g('Ich kann ihn nicht herausziehen.'); },
   sense:async function(A){ await A.g('Darin ist eine Seite, die jemand mit zitternder Hand geschrieben hat. Nachts. Mit einer Decke um jemanden, der nicht redet.'); if (!A.hasNote('c1_1948')){ A.setFlag('c1.found1984'); A.note('c1_1948'); } }}},
 {id:'shelf_80s',name:'Regal: 1980–1989',g:{look:'Die Achtziger. Dicke Ordner. Damals fuhren viele.'}},
 {id:'gap_1984',name:'Lücke',g:{look:'Zwischen 1983 und 1985 ist eine Lücke. So breit wie ein Jahr.'}},
 {id:'desk',name:'Schreibtisch',g:{look:'Eine Schreibmaschine unter einer Haube aus Staub.',sense:'Hier hat jemand jahrelang Tee getrunken und Abfahrtszeiten abgeschrieben. Mladen. Er war einmal jung.'}},
 {id:'window',name:'Fensterchen',g:{look:'Ein kleines Fenster hoch oben. Draußen geht der Mond über die Mole.'}},
 {id:'boxes',name:'Kartons',g:{look:'Kartons mit Fundsachen: Schirme, ein Kinderschuh, eine Brille. Alles, was die Fähren nicht wieder mitgenommen haben.',sense:'Der Kinderschuh. Jemand hat sehr lange nach ihm gesucht.'}}
];
M.room('archive',{ name:'Archiv', scape:'archive', music:'ghost', noSwitch:false,
  hotspots:AH,
  enter:async function(A,from){ if (A.first('archIn')) await A.g('Hier drin ist es kalt. Mladen hat recht. Für Lebende.'); }
});
M.defineScape('archive',{beds:['room','ghost'],step:'none',ev:[['drip',6,14,0.6,-0.6,0.6],['creak',20,40,0.4,-0.8,0.8]]});
})(M);
