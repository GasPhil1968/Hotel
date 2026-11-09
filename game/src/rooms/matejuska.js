/* ===== rooms/matejuska.js + shed — Fischerhafen: Dinko, sein Schuppen mit Tonćis Seesack, der Bauzaun der Ledana ===== */
(function(M){
'use strict';
var P=M.P;
function dinkoHere(GS){ return ['c1','c1_night','c2'].indexOf(GS.phase)>=0; }
async function talkDinko(A){ var D=A.npc('dinko'), p=A.G.phase;
  if (p==='c2') return dinkoC2(A,D);
  if (A.flag('c1.dinkoTold')) return dinkoAfter(A,D);
  if (A.first('diHello')){ await D.say('Što hoćeš?'); await A.m('Marko Vuković. Ich schreibe über Ivka Perić.'); await D.say('Ivka ist tot. Lass sie in Ruhe.'); }
  else await D.say(A.cycle('diAg',['Du schon wieder.','Ich flicke. Siehst du doch.','Was noch?']));
  await A.menuLoop(function(){ return [
    {t:'Sie kannten ihren Sohn.',once:'di1',go:async function(A){ await D.say('Das ist lange her.'); await D.anim('mend'); }},
    {t:'Ich habe ein Foto von Ihnen und Tonći.',if:A.has('photo1')&&!A.hasNote('c1_brother'),go:function(A){ return showPhoto(A,D); }},
    {t:'Brauchen Sie Hilfe mit dem Netz?',once:'di3',go:async function(A){ await D.say('Kannst du flicken?'); await A.m('Nein.'); await D.say('Dann nicht.'); }},
    // Analyse K1-B08 (P19): Malas Nachhall am Seesack gibt die Worte; dass Dinko sie bis heute murmelt (Lauschen), gibt Marko den Mut, sie ihm zu sagen
    {t:'Ich weiß, was Tonći im Wasser gesagt hat.',if:A.hasNote('c1_words')&&A.hasNote('c1_drzi'),go:async function(A){ await confession(A,D); return 'bye'; }},
    A.askOpt({
      c1_rescued:async function(A){ await D.say('Du warst bei Šimić. Ja. Ich war auf der ANKICA. Das steht in eurem Buch. Was willst du noch?'); },
      c1_capsized:async function(A){ await D.say('Vor Sustipan. Der Motor. Mehr gibt es nicht zu sagen.'); },
      c1_ankica:async function(A){ await D.say('Das Boot meines Vaters. Sie liegt da drüben auf dem Grund, falls du sie suchst.'); },
      c1_never:async function(A){ await D.say('Wer sagt das? Zdenka.'); await A.wait(700); await D.say('Zdenka hat recht. Zdenka hat immer recht.'); },
      c1_bag:async function(A){ await D.say('Du warst in meinem Schuppen?'); await A.m('Nein.'); await D.say('Dann weißt du nichts.'); },
      c1_candle:async function(A){ await D.say('Woher …'); await D.anim('mend'); await D.say('Lass mich.'); },
      c1_waits:async function(A){ await D.say('Auf der Mole. Jeden Abend. Ich bin siebenundzwanzig Jahre lang einen Umweg gelaufen, um sie nicht zu sehen.'); },
      c1_words:async function(A){ if (!A.hasNote('c1_drzi')){ await D.say('Du warst nicht dabei. Keiner war dabei.'); return; } await confession(A,D); return 'bye'; },
      c1_brother:'Ich sage es nicht noch einmal.',
      c1_plaque:async function(A){ await D.say('…'); await D.say('Das geht dich nichts an.'); }
    },'Davon weiß ich nichts.'),
    {t:'Ich gehe.',bye:true,go:async function(A){ await D.say('Gut.'); }}
  ]; }); }
async function showPhoto(A,D){ await A.animM('give'); await A.wait(1400); await D.say('Sommer vierundachtzig.'); await D.say('An dem Tag hatten wir zwanzig Kilo Brancin. Er hat die Hälfte im Hafen verschenkt. An alte Frauen. Er sagte, sie erinnern ihn an seine Mutter.');
  await A.wait(800); await D.say('Er war wie ein Bruder.'); A.note('c1_brother'); await D.say('Mehr sage ich nicht. Bring es ihr zurück. Es gehört auf ihre Kredenz.'); }
async function confession(A,D){ A.music('ghost'); await A.m('„Halt die Tasche. Sie ist für Mama.“'); await D.anim('sit'); await A.wait(1400);
  await D.say('Woher …'); await D.say('Das hat niemand gehört. Niemand außer mir.');
  var c=await A.choose([{t:'Ich weiß es einfach.',id:0},{t:'Ivka wartet noch immer auf ihn.',id:1},{t:'Jemand hat es mir erzählt.',id:2}],{title:'Dinko'});
  if (c===0){ await D.say('Niemand weiß so etwas einfach.'); await A.wait(900); await D.say('…Aber du weißt es.'); }
  else if (c===1){ await D.say('Ivka ist tot.'); await A.m('Trotzdem.'); await A.wait(1500); }
  else { await D.say('Es gibt niemanden, der es erzählen könnte. Außer ihm.'); await A.wait(1200); }
  // Analyse K1-B06 (P20): Dinko erzählt seinen Teil. Warum Tonći nicht auf die Fähre gewartet hat, zieht Marko selbst (c1_came).
  await D.say('Warum wir bei dem Wetter draußen waren? Das war seine Sache. Ich erzähle dir meine.');
  await D.say('Die ANKICA war das Boot meines Vaters. Ich habe sie losgemacht. Um halb neun waren wir draußen. Vor Sustipan ist der Motor ausgegangen.');
  await D.say('Die Bura hat uns umgedreht wie eine Muschel. Wir hingen am Kiel. Er hat mir die Tasche in die Arme gedrückt. „Drži torbu! Za mamu je!“');
  await A.wait(700); await D.say('Dann kam eine Welle.'); await A.wait(1500);
  await D.say('Am Morgen hat mich die Hafenpolizei aus dem Wasser gezogen. Ihn nicht. Nie.');
  await D.say('Ich bin zweimal bis zu ihrer Tür gegangen. Beim zweiten Mal hat sie aufgemacht und gesagt: „Dinko! Tonći kommt mit dem Boot um sieben.“'); await D.say('Da bin ich gegangen. Und nie wiedergekommen.');
  A.note('c1_story');
  await D.say('Warte.'); var st=M.stand('matejuska','shed_door')||[200,122,'B']; var d0=[D.x,D.y]; D.idle(null); await D.walk(st[0],st[1]); A.sfx('lock'); await A.wait(500); A.sfx('door'); D.hide(); await A.wait(1600); D.show(); A.sfx('door'); await D.walk(d0[0]+6,d0[1]); await D.face(A.marko&&A.marko.x<D.x?'L':'R');
  await D.say('Bring es dorthin, wo sie wartet. Ich kann das nicht.'); await A.animM('give'); A.sfx('paper');
  A.give('letter_t'); A.give('gloves'); await A.m('Ein Seesack, steif vom Salz. Darin ein Brief, verwaschen, und ein Päckchen in Zeitungspapier vom Dezember vierundachtzig.');
  await A.m('Graue Wollhandschuhe. An einem Faden ein Zettel: „Za mamu.“'); A.note('c1_gift',true);
  await D.say('Wenn du was brauchst … ich bin hier.'); D.idle('mend'); A.setFlag('c1.dinkoTold');
  if (A.malaHere() && !A.flag('mk.accept')){ await A.wait(1100); await A.m('Das konnte ich nicht wissen.'); await A.wait(700); await A.g('Nein.'); await A.wait(600); await A.m('…'); } A.setFlag('mk.crack');
  await A.fade(6,900); A.phase('c1_night'); A.rebuild(); await A.fade(0,900); A.music('case1');
  await A.narrate('Es ist dunkel geworden. Die Bura kommt von den Bergen herunter.');
  A.save(); }
async function dinkoAfter(A,D){ await D.say(A.cycle('diAf',['Geh. Sie wartet.','Hast du es ihr gebracht?','…']));
  await A.menuLoop(function(){ return [
    {t:'Haben Sie Tonćis Namen auf die Tafel in Sustipan setzen lassen?',once:'diPl',if:A.hasNote('c1_plaque')||A.hasNote('c1_jakov'),go:async function(A){ await D.say('Zehn Jahre danach. Ich dachte, wenn sein Name irgendwo steht, muss sie nicht mehr suchen.'); await D.say('Sie ist nie hingegangen.'); }},
    {t:'Warum haben Sie den Sack nie weggeworfen?',once:'diSk',go:async function(A){ await D.say('Weil er nicht mir gehört.'); }},
    {t:'Gute Nacht, Dinko.',bye:true,go:async function(A){ await D.say('Laku noć.'); }}
  ]; }); }
async function dinkoC2(A,D){ if (A.first('diC2')){ await D.say('Du.'); await A.wait(600); await D.say('Ich war heute früh auf dem Friedhof. Bei ihr. Zum ersten Mal.'); await A.m('Das ist gut.'); await D.say('Ich weiß nicht, was gut ist.'); await D.anim('mend'); }
  await A.menuLoop(function(){ return [
    {t:'Können Sie mir ein Brecheisen leihen?',if:!A.has('crowbar')&&!A.flag('c2.coldOpen'),go:async function(A){ await D.say('Wofür?');
        var c=await A.choose([{t:'Für die alte Ledana.',id:'led'},{t:'Frag lieber nicht.',id:'no'}],{title:'Dinko'});
        if (c==='no') await D.say('Ich frage nicht. Ich frage nie.'); else await D.say('Die Eisfabrik. Da wollen sie am Montag ein Hotel draus machen.');
        await D.say('Hier.'); A.sfx('chain'); A.give('crowbar'); await D.say('Pass auf die Treppe auf. Die ist morsch. Da ist schon einer runtergefallen.'); A.note('c2_stairs'); }},
    {t:'Haben Sie Tonćis Namen auf die Tafel in Sustipan setzen lassen?',once:'diPl',if:A.hasNote('c1_plaque')||A.hasNote('c1_jakov'),go:async function(A){ await D.say('Zehn Jahre danach. Ich dachte, wenn sein Name irgendwo steht, muss sie nicht mehr suchen.'); await D.say('Sie ist nie hingegangen.'); }},
    {t:'Was wissen Sie über die Ledana?',once:'diL',if:A.hasNote('c2_demolish')||A.hasNote('c2_boy'),go:async function(A){ await D.say('Da haben wir als Kinder das Eis für die Boote geholt. Seit dem Krieg steht sie leer. Die Kinder kriechen durch den Zaun.');
        await D.say('Neunundneunzig haben wir da einen Jungen rausgetragen. Drei Tage hat ihn keiner gefunden. Die Treppe.'); A.note('c2_died'); }},
    A.askOpt({ c2_luka:async function(A){ await D.say('Luka hieß er? Kann sein. Der mit der Gitarre an der Riva. Er hat uns manchmal die Netze getragen, für ein paar Fische.'); },
      c2_gap:'Die Kinder. Seit zwanzig Jahren kriechen sie da durch. Gefunden hat sie nie einer, weil keiner sucht.',
      c2_stairs:'Ich sage es nur einmal. Die Treppe.',
      c2_died:'Ich habe seine Füße getragen. Die Schuhe waren neu. Daran erinnere ich mich.' },'Ich weiß nichts darüber.'),
    {t:'Danke, Dinko.',bye:true,go:async function(A){ await D.say('Hm.'); }}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Zurück in die Stadt.'},
 {id:'dinko',npc:'dinko',name:'Dinko Matić',hgt:38,vis:function(S,GS){ return dinkoHere(GS); },talk:talkDinko,
   look:function(A){ return A.m(A.flag('c1.dinkoTold')?'Dinko flickt weiter, als hätte er nichts gesagt. Seine Hände zittern ein bisschen.':'Ein Fischer um die fünfzig, mit Wollmütze und grauem Bart. Er flickt ein Netz, Masche für Masche, ohne aufzusehen.'); },
   g:{look:'Er trägt etwas mit sich herum, das schwerer ist als er selbst.',listen:async function(A){ if (A.flag('c1.dinkoTold')) return A.g('Er sagt nichts mehr. Er atmet nur. Leichter als vorhin.'); await A.g('Er murmelt beim Flicken: „…drži … drži …“ Halt fest.'); A.note('c1_drzi');
     if (A.hasNote('c1_words')) await A.g('Drži torbu. Das sagt er bis heute. Sag es ihm, Marko.'); }},
   give:{ photo1:function(A){ return A.hasNote('c1_brother')?A.npc('dinko').say('Ich habe es gesehen. Bring es ihr zurück.'):showPhoto(A,A.npc('dinko')); },
     postcard:async function(A){ await A.npc('dinko').say('„Dinko ide sa mnom.“ Dinko kommt mit.'); await A.wait(800); await A.npc('dinko').say('Ja. Ich bin mitgekommen.'); },
     gloves:'„Bring sie ihr. Nicht mir.“', letter_t:'„Ich habe ihn nie gelesen. Er war nicht für mich.“' }},
 {id:'boats',name:'Fischerboote',look:'Kleine Holzboote, weiß, blau und grün, mit Namen am Bug: MARIJA, SV. NIKOLA, DVA BRATA. Die Fischer geben ihren Booten die Namen der Menschen, die sie zurückhaben wollen.',g:{look:'Sie schaukeln, als würden sie schlafen.'}},
 {id:'nets',name:'Netze',look:'Netze, orange und grün, mit Korkschwimmern. Dinko flickt sie schneller, als ich sie ansehen kann.',take:'Ich würde mich darin verheddern und morgen in der Zeitung stehen.',g:{look:'In den Maschen hängt noch Salz. Und Schuppen wie kleine Münzen.'}},
 {id:'fishboxes',name:'Fischkisten',look:'Blaue Plastikkisten, nach Fisch riechend, bis in alle Ewigkeit.',g:{look:'Leer.'}},
 {id:'shed',name:'Dinkos Schuppen',look:'Ein kleiner Steinschuppen, eine Konoba. Netze, Werkzeug, vermutlich der halbe Hafen.',g:{look:'Drinnen ist etwas, das er nie hergibt.'}},
 {id:'shed_door',name:'Schuppentür',look:'Eine Holztür mit einem schweren Vorhängeschloss.',open:'Abgeschlossen. Und Dinko sitzt fünf Meter weiter.',gexit:{to:'shed'},g:{look:'Ein Schloss. Für mich ist das nur Metall.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne, die mehr Möwen als Menschen beleuchtet.',g:{look:'Licht auf nassem Stein.'}},
 {id:'marjan',name:'Marjan',look:'Der Marjan, der Hügel mit den Pinien. Im Sommer gehen die Leute dort hinauf, um es kühler zu haben. Im November geht niemand hinauf.',g:{look:'Oben ist es still.'}},
 {id:'sea',name:'Hafenbecken',look:'Das Becken der Fischer. Ölschlieren, Schuppen, ein toter Krebs. Und ein schöner Himmel darüber.',g:{look:'Draußen, vor Sustipan, ist es tief.'}},
 {id:'ledana',name:'Die alte Ledana',look:'Die alte Eisfabrik. Rote Ziegel, kaputte Fenster, ein Schriftzug, von dem nur noch LEDA übrig ist.',g:{look:'Da drin ist jemand. Ich höre ihn bis hierher.',sense:'Er wartet. Auf etwas, das gleich passieren soll. Seit Jahren.'}},
 {id:'fence',name:'Bauzaun',look:async function(A){ await A.m('Ein Bauzaun mit Kettentor. „ZABRANJEN PRISTUP – RUŠENJE 21.11.“ Betreten verboten, Abriss am Montag.'); if (A.G.phase==='c2') A.note('c2_demolish'); },
   use:'Zu hoch, und oben Stacheldraht. Ich bin dreiunddreißig, nicht dreizehn.', open:'Das Tor ist mit einer Kette verschlossen.',
   // Analyse K1-B09 (P24): das Brecheisen am Zaun bekam nur den Standardsatz
   with:{ crowbar:'Die Kette ist dicker als das Eisen. Und das Tor sieht die halbe Matejuška. Es muss einen anderen Weg geben.' },
   g:{look:'Ein Zaun. Für mich ist das nur Luft.',sense:'Viele kleine Hände haben hier gerüttelt. Kinder.'}},
 {id:'sign',name:'Schild',look:'„ZABRANJEN PRISTUP – RUŠENJE 21.11.“ Betreten verboten. Abriss am einundzwanzigsten.',read:'„Investor: Adriatic Pearl d.o.o. – Hotel mit 120 Zimmern.“ Eine Perle. Natürlich.'},
 {id:'crates',name:'Fischkisten am Zaun',vis:function(S){ return !S.cratesMoved; },look:'Ein Stapel alter Fischkisten am Zaun. Sie stehen ein bisschen zu ordentlich da.',
   // Analyse K1-B10 (P24): Die Kisten „stehen ein bisschen zu ordentlich da“; wer den Zaun kennt, darf sie auch ohne Malas Blick verschieben
   push:async function(A){ if (A.G.phase!=='c2'){ return A.m('Warum sollte ich nachts Fischkisten verschieben?'); } if (!A.hasNote('c2_gap') && !A.hasNote('c2_demolish')) return A.m('Fischkisten. Erst will ich wissen, was hinter diesem Zaun ist.');
     await A.anim('push'); A.sfx('stone'); A.set('cratesMoved',true); await A.m('Dahinter: ein Zaunfeld, nur mit Draht festgemacht. Unten ist der Boden blank getreten.'); },
   g:{look:async function(A){ if (A.G.phase!=='c2') return A.g('Alte Kisten.'); await A.g('Hinter den Kisten ist das Zaunfeld lose. Die Kinder kriechen da durch. Ich sehe ihre Spuren.'); A.note('c2_gap'); },
     sense:async function(A){ await A.g('Hinter den Kisten ist das Zaunfeld lose. Die Kinder kriechen da durch.'); A.note('c2_gap'); }}},
 {id:'gap',name:'Loch im Zaun',vis:function(S){ return !!S.cratesMoved; },exit:{to:'ledana',gok:true},look:'Ein Loch im Zaun, gerade groß genug für einen Mann, der nicht zu viel isst.',g:{look:'Er geht hinein, ich folge ihm.'}}
];
M.room('matejuska',{ name:'Matejuška', scape:'matejuska',
  music:function(GS){ return GS.phase==='c2'||GS.phase==='c2_night'?'case2':'case1'; },
  actors:function(S,GS){ if (!dinkoHere(GS)) return []; var p=M.apos('matejuska','dinko',[244,124,'L']); return [{id:'dinko',ch:'dinko',x:p[0],y:p[1],f:p[2]||'L',name:'Dinko',idle:'mend',speechY:40}]; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='c1' && A.first('matC1')){ await A.m('Die Matejuška. Der kleine Hafen der Fischer, gleich neben der Riva und doch eine andere Welt.'); }
    if (p==='c2' && A.first('matC2')){ await A.m('Bura. Die Boote zerren an den Leinen.'); if (A.malaHere()) await A.g('Er ist nicht weit. Ich höre ihn.'); }
    if (from==='shed' && A.isMala() && A.hasNote('c1_words') && A.first('!backFromShed')) await A.g('Ich weiß jetzt, was er nie gesagt hat.'); }
});
M.defineScape('matejuska',function(o){ var tod=o.tod, w=M.scn.weather(o.GS); return { beds:w==='bura'?['bura','sea','windHigh']:['sea','seaFar'], step:'stone',
  ev:[['rope',5,12,0.9,-0.9,0.4],['lap',4,9,1,-0.8,0.5],['gull',8,18,tod==='night'?0.2:0.8,-1,1],['boat',25,55,0.5,-1,0.2],['horn',35,70,0.5,0.2,0.8],['creak',15,35,0.5,0.4,1]] }; });

// ---------------------------------------------------------------- Dinkos Schuppen (nur Mala)
var SH=[
 {id:'door',name:'Tür',gexit:{to:'matejuska'},g:{look:'Draußen sitzt er und flickt.'}},
 {id:'seabag',name:'Seesack',g:{look:async function(A){ await A.g('Ein Seesack aus Segeltuch, in Plastik gewickelt, damit kein Salz mehr herankommt. Auf dem Stoff, verblichen: T.P.'); A.note('c1_bag'); },
   sense:async function(A){ A.note('c1_bag',true); if (A.hasNote('c1_words')) return A.g('Ich habe es schon gesehen. Einmal reicht.');
     await A.memory({title:'Nachhall – der Seesack',draw:M.mem&&M.mem.storm,tint:'ghost',lines:['Nacht. Schwarzes Wasser. Die Bura reißt die Kämme von den Wellen.','Zwei Jungen am umgedrehten Kiel. Einer drückt dem anderen eine Tasche in den Arm.','„Drži torbu! Za mamu je!“ Halt die Tasche! Sie ist für Mama!','Dann kommt eine Welle. Dann ist nur noch einer da.']});
     A.note('c1_words'); await A.g('Das hat er siebenundzwanzig Jahre lang allein gewusst.');
     await A.g(A.hasNote('c1_drzi')?'Drži. Das murmelt er bis heute.':'Er trägt es noch mit sich herum. Man hört es, wenn er flickt.'); }}},
 {id:'photo',name:'Foto an der Wand',g:{look:'Ein junger Mann, lachend, mit Steinstaub im Haar. Tonći. Dasselbe Lachen wie auf Ivkas Kredenz.',sense:'Jemand hat es so oft angesehen, dass die Ecken weich geworden sind.'}},
 {id:'candle',name:'Kerzenstummel',g:{look:'Ein Kerzenstummel auf einer Untertasse. Viel Wachs, wenig Kerze.',sense:async function(A){ await A.g('Eine Kerze, einmal im Jahr, am zweiundzwanzigsten Dezember. Er sitzt dann hier, bis sie aus ist.'); A.note('c1_candle'); }}},
 {id:'nets',name:'Netze',g:{look:'Netze, die von den Balken hängen wie Spinnweben eines sehr großen Tieres.'}},
 {id:'motor',name:'Außenbordmotor',g:{look:'Ein alter Außenbordmotor. Er ist nie wieder angesprungen. Oder Dinko hat es nie wieder versucht.'}},
 {id:'oars',name:'Ruder',g:{look:'Zwei Ruder, eines mit einem Riss, mit Draht geflickt.'}},
 {id:'window',name:'Fensterchen',g:{look:'Durch die Ritze sieht man das Licht der Laterne draußen.'}}
];
M.room('shed',{ name:'Dinkos Schuppen', scape:'shed', music:'ghost', hotspots:SH,
  enter:async function(A,from){ if (A.first('shedIn')) await A.g('Teer, Netze, Salz. Und etwas, das nicht hierher gehört.'); } });
M.defineScape('shed',{beds:['room','seaFar','ghost'],step:'none',ev:[['drip',5,12,0.7,-0.6,0.6],['rope',10,20,0.4,-0.8,0.8],['creak',15,35,0.4,-0.6,0.6]]});
})(M);
