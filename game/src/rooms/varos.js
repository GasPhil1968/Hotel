/* ===== rooms/varos.js — Veli Varoš: Zdenka, Ivkas Tür, die Todesanzeige, Sv. Nikola ===== */
(function(M){
'use strict';
var P=M.P;
function ph(GS){ return GS.phase; }
function zdenkaHere(GS){ return ['pro','c1','c2'].indexOf(GS.phase)>=0; }
// ---------------------------------------------------------------- Zdenka
async function talkZdenka(A){ var Z=A.npc('zdenka'), p=A.G.phase;
  if (p==='pro') return zdenkaPro(A,Z);
  if (p==='c1') return zdenkaC1(A,Z);
  if (p==='c2') return zdenkaC2(A,Z);
  return Z.say('Gute Nacht, junger Mann.'); }
async function zdenkaPro(A,Z){
  if (A.first('zdHello')){ await Z.say('Sie sind der von der Zeitung.'); await A.m('Marko Vuković. Vesna Kralj hat mich geschickt. Wegen Gospođa Perić.');
    await Z.say('Siebenundzwanzig Jahre hat niemand nach ihr gefragt. Und jetzt kommt die Zeitung.'); }
  if (A.flag('pro.visited')){ await Z.say('Haben Sie, was Sie brauchen?'); return; }
  await A.menuLoop(function(){ return [
    {t:'Wie war sie?',once:'zd1',go:async function(A){ await Z.say('Stur. Zu Kindern freundlich, zum Wetter nicht. Sie hat für die halbe Gasse gestrickt, Socken, Mützen, alles. Nur für sich nie.'); }},
    {t:'Hatte sie wirklich niemanden mehr?',once:'zd2',go:async function(A){ await Z.say('Einen Sohn. Tonći.'); await A.wait(500); await Z.say('Vierundachtzig. Die Bura. Er kam nicht nach Hause.'); A.note('pro_sohn'); await A.m('Das tut mir leid.'); await Z.say('Ihr hat es leid getan. Siebenundzwanzig Jahre lang.'); }},
    {t:'Was hat sie den Tag über gemacht?',once:'zd3',go:async function(A){ await Z.say('Morgens die Messe bei Sveti Nikola. Mittags der Markt. Und abends die Riva.'); await Z.say('Jeden Abend um sieben. Bei Regen mit Schirm, bei Bura ohne. Seit vierundachtzig.'); A.note('pro_riva'); }},
    {t:'Warum um sieben?',once:'zd4',if:A.hasNote('pro_riva'),go:async function(A){ await Z.say('Um sieben kam früher das Boot aus Supetar. Irgendwann haben wir aufgehört zu fragen, worauf sie wartet.'); await Z.say('Man fragt ja auch nicht das Meer, warum es da ist.'); }},
    {t:'Kann ich mir die Wohnung ansehen? Sie haben den Schlüssel.',if:!A.has('key_ivka'),go:async function(A){ if (A.flag('pro.keyRefused') && !A.flag('pro.keyAsk2')){ A.setFlag('pro.keyAsk2'); }
        await Z.say('Erst will ich wissen, was Sie über sie schreiben.');
        var c=await A.choose([{t:'Ein paar Zeilen, damit jemand weiß, dass sie gelebt hat.',id:'good'},{t:'Zweitausend Zeichen. Mehr ist es nicht.',id:'cold'},{t:'Das weiß ich erst, wenn ich die Wohnung gesehen habe.',id:'honest'}]);
        if (c==='cold'){ A.setFlag('pro.keyRefused'); await Z.say('Zweitausend Zeichen. Für fünfundachtzig Jahre.'); await Z.say('Dann schreiben Sie die mal ohne Schlüssel.'); await A.m('Das war das Falsche.'); return; }
        if (c==='honest') await Z.say('Wenigstens lügen Sie nicht.'); else await Z.say('…Gut.');
        await Z.anim('sitTalk'); A.give('key_ivka'); await Z.say('Fassen Sie nichts an, was Sie nicht brauchen. Und bringen Sie ihn mir wieder.'); A.note('pro_zdenka',true); }},
    A.askOpt({ pro_auftrag:'Die Stillen. So heißt das in Ihrer Zeitung? Hier hieß sie einfach Ivka.', pro_sohn:'Fragen Sie mich nicht nach Tonći. Fragen Sie ihre Wohnung.', pro_riva:'Jeden Abend. Ich habe es irgendwann nicht mehr gesehen. So sieht man den Glockenturm auch nicht mehr.' },'Dazu weiß ich nichts, junger Mann.'),
    {t:'Danke, Gospođa Zdenka.',bye:true,go:async function(A){ await Z.say('Hm.'); }}
  ]; }); }
async function zdenkaC1(A,Z){
  if (A.first('zdC1')){ await Z.say('Der von der Zeitung. Steht es morgen drin?'); await A.m('Morgen, ja.'); await Z.say('Dann kaufe ich mir zwei. Eine für mich, eine für sie.'); }
  await A.menuLoop(function(){ return [
    {t:'Kennen Sie Dinko Matić?',once:'zdD',if:A.hasNote('c1_dinko')||A.hasNote('c1_rescued')||A.hasNote('c1_matejuska')||A.hasNote('c1_ankica'),go:async function(A){ await Z.say('Den Jungen vom alten Matić? Natürlich. Er flickt unten an der Matejuška Netze, seit er laufen kann.');
        await Z.say('Er war nie bei ihr. Nicht ein einziges Mal in siebenundzwanzig Jahren. Und er war Tonćis bester Freund.'); await Z.say('Am Sonntag auf dem Friedhof stand er hinten an der Mauer. Als der Pfarrer fertig war, war er weg.'); A.note('c1_never'); }},
    {t:'Wie war Tonći?',once:'zdT',if:A.hasNote('pro_sohn')||A.hasNote('c1_boat7'),go:async function(A){ await Z.say('Ein lieber Junge. Steinmetz auf Brač, in Pučišća. Immer zu spät und immer am Lachen.'); await Z.say('Er hat ihr jeden Freitag geschrieben. Jeden. Sie hat mir die Briefe vorgelesen, bis ich sie auswendig konnte.'); }},
    {t:'Wie hat sie auf der Riva gewartet?',once:'zdW',if:A.hasNote('pro_riva')||A.hasNote('c1_waits'),go:async function(A){ await Z.say('Am Ende der Mole, beim letzten Poller. Mantel zu, Hände in den Taschen. Nie Handschuhe.'); await Z.say('Ich habe ihr drei Paar gestrickt. Sie hat gesagt: „Mit Handschuhen spüre ich nicht, wann die Bura kommt.“'); A.note('c1_noglove'); }},
    {t:'Haben Sie jemals mit ihr über Tonći gesprochen?',once:'zdS',if:!!A.G.seen['dlg:zdT'],go:async function(A){ await Z.say('Einmal. Neunundachtzig. Ich habe gesagt: Ivka, er kommt nicht. Sie hat mich angesehen, als hätte ich vom Wetter geredet.'); await Z.say('Danach haben wir über das Wetter geredet. Zweiundzwanzig Jahre lang.'); }},
    A.askOpt({ c1_ankica:'Die ANKICA? Das Boot vom alten Matić. Hieß nach seiner Frau.', c1_ferry:'An die Bura im Dezember vierundachtzig erinnert sich hier jeder. Drei Tage kein Schiff. Die Fenster haben gesungen.',
      c1_waits:async function(A){ await Z.say('Auf der Mole? Junger Mann, Ivka ist am Donnerstag gestorben.'); await A.m('…Ich meinte, früher.'); await Z.say('Früher, ja. Da hat sie dort gestanden.'); },
      c1_letter:'Er hat ihr immer geschrieben, sie soll nicht in der Kälte warten. Sie hat es immer vorgelesen und dann trotzdem ihren Mantel angezogen.',
      c1_never:'Er konnte ihr nicht in die Augen sehen. Das versteht man. Und man versteht es nicht.',
      c1_words:'Das klingt nach Tonći. Er hat immer an sie gedacht, bevor er an sich gedacht hat.', c1_noglove:'Drei Paar. Sie liegen noch in ihrer Kommode.' },'Ich bin eine alte Frau. Fragen Sie mich nach dem Wetter.'),
    {t:'Gute Nacht.',bye:true,go:async function(A){ await Z.say('Gehen Sie nicht zu spät nach Hause. Die Bura kommt.'); }}
  ]; }); }
async function zdenkaC2(A,Z){
  if (A.first('zdC2')){ await Z.say('Da ist ja der Herr Journalist. Der Wind hat Sie den Hügel hinaufgeweht.'); }
  await A.menuLoop(function(){ return [
    {t:'Ich habe Ihnen die Zeitung mitgebracht.',if:A.has('newspaper')&&!A.flag('c2.radioGiven'),go:function(A){ return giveNewspaper(A,Z); }},
    {t:'Wie geht es Ihnen?',once:'zdH',go:async function(A){ await Z.say('Gestern habe ich um sieben aus dem Fenster gesehen. Aus Gewohnheit. Da war niemand.'); await A.m('Ich glaube, sie ist jetzt zu Hause.'); await Z.say('Wo sonst.'); }},
    {t:'Wissen Sie etwas über die alte Ledana?',once:'zdL',if:A.hasNote('c2_demolish'),go:async function(A){ await Z.say('Die Eisfabrik? Da haben die Fischer früher ihr Eis geholt. Seit dem Krieg verrottet sie. Jetzt wollen sie ein Hotel bauen.'); await Z.say('Da ist ein Junge gestorben, vor Jahren. Die Treppe. Seine Mutter wohnte unten bei der Pjaca. Sie ist nach Zagreb gezogen.'); }},
    A.askOpt({ c2_luka:'Luka? Der mit der Gitarre an der Riva? Ich habe ihm im Sommer immer zehn Kuna in den Hut gelegt. Für die Lieder von früher.', c2_died:'Ein Sturz. Drei Tage hat ihn niemand gefunden. Seine Mutter hat nie wieder gesungen, sagt man.' },'Fragen Sie mich lieber nach Ivka. Da weiß ich Bescheid.'),
    {t:'Bis bald.',bye:true,go:async function(A){ await Z.say('Ziehen Sie sich was an, bei der Bura.'); }}
  ]; }); }
async function giveNewspaper(A,Z){ A.take('newspaper'); A.setFlag('c2.radioGiven');
  var lead=['„Ivka Perić hat siebenundzwanzig Jahre lang auf ein Schiff gewartet.“','„Jeden Abend um sieben ging Ivka Perić zur Riva.“','„Ivka Perić hinterlässt zwei Tassen und einen Stuhl am Fenster.“'][A.G.flags.lead||0];
  await Z.say('Zeigen Sie.'); await A.wait(800); await Z.say(lead); await A.wait(700); await Z.say('…Das hat sie verdient.');
  await Z.say('Warten Sie.'); await A.fade(6,400); A.sfx('door'); await A.wait(700); await A.fade(0,400);
  await Z.say('Nehmen Sie das Radio. Freitag kommt sowieso alles weg. Sie hat damit jeden Abend den Seewetterbericht gehört.'); A.give('radio');
  await A.m('Danke. Ich passe darauf auf.'); await Z.say('Batterien hat es keine. Die hat sie immer rausgenommen, damit sie nicht auslaufen. So war sie.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Die Gasse hinunter, zur Stadt.',noReveal:false},
 {id:'zdenka',npc:'zdenka',name:'Zdenka',hgt:36,vis:function(S,GS){ return zdenkaHere(GS); },talk:talkZdenka,
   look:function(A){ return A.m(A.G.phase==='pro'?'Eine alte Frau ganz in Schwarz, auf einem Schemel vor ihrer Tür. Sie schaut mich an, als hätte sie mich schon vor Jahren erwartet und sei enttäuscht.':'Gospođa Zdenka, auf ihrem Posten. In der Gasse passiert nichts, was sie nicht sieht.'); },
   g:{look:'Sie trägt Schwarz seit ihrem Mann. Sie wird es tragen, bis jemand für sie Schwarz trägt.',listen:async function(A){ await A.g('Sie redet mit der Katze. „Jetzt sind wir nur noch zwei, Mrki.“'); }},
   give:{ newspaper:function(A){ return giveNewspaper(A,A.npc('zdenka')); }, key_ivka:async function(A){ await A.npc('zdenka').say('Sind Sie fertig?'); await A.m('Noch nicht ganz.'); },
     photo1:async function(A){ var Z=A.npc('zdenka'); await Z.say('Tonći und der kleine Matić. Auf der ANKICA. Sie waren unzertrennlich.'); A.note('c1_ankica',true); },
     postcard:'„Napravi fritule.“ Das hat er jedes Jahr geschrieben. Und sie hat jedes Jahr Fritule gemacht. Auch danach.', gloves:async function(A){ await A.npc('zdenka').say('Graue Handschuhe … Woher haben Sie die?'); await A.m('Von jemandem, der sie siebenundzwanzig Jahre aufbewahrt hat.'); await A.npc('zdenka').say('…'); } }},
 {id:'zdenka_door',name:'Zdenkas Tür',look:'Zdenkas Tür, mit einem Fliegenvorhang aus Plastikstreifen. Im November hängt er immer noch.',open:'Das ist nicht meine Tür. Und Zdenka sitzt davor.',g:{look:'Drinnen läuft der Fernseher. Sie hört nicht hin. Sie lässt ihn nur laufen, damit jemand redet.'}},
 {id:'stool',name:'Schemel',look:function(A){ return A.m(zdenkaHere(A.G)?'Ein Holzschemel. Belegt.':'Ein leerer Holzschemel. Ohne Zdenka sieht die Gasse falsch aus.'); },g:{look:'Sie sitzt hier, seit ihr Mann tot ist. Er hat ihn gebaut.'}},
 {id:'plants',name:'Pflanzen',look:'Basilikum und Geranien in alten Olivenöldosen. Hier wirft niemand eine Dose weg.',take:'Das Basilikum gehört der Gasse.',g:{look:'Sie gießt jeden Morgen auch Ivkas Pflanzen. Ich glaube, sie wird nicht damit aufhören.'}},
 {id:'ivka_door',name:'Ivkas Tür',look:function(A){ return A.m(A.G.phase==='pro'?'Grün, abgeblättert, Nummer 14. Unter der Klinke ist die Farbe ganz weg, von siebenundzwanzig Jahren Hinausgehen.':'Ivkas Tür. Zu.'); },
   open:async function(A){ if (A.G.phase!=='pro') return A.m('Abgeschlossen. Und Zdenka hat den Schlüssel wieder.'); if (!A.has('key_ivka')) return A.m('Abgeschlossen. Zdenka hat den Schlüssel.'); return enterIvka(A); },
   with:{ key_ivka:function(A){ return enterIvka(A); } },
   g:{look:'Dahinter ist es still. Nicht leer. Still.',sense:async function(A){ await A.g('Jemand ist jeden Abend um Viertel vor sieben hier hinausgegangen. So oft, dass die Tür es sich gemerkt hat.'); }}},
 {id:'ivka_window',name:'Fensterläden',look:'Die Läden sind geschlossen. Seit Donnerstag.',open:'Ich mache nicht die Fenster einer Toten auf. Nicht von außen.',g:{look:'Hinter den Läden sitzt niemand mehr am Fenster.'}},
 {id:'mailbox',name:'Briefkasten',look:'„PERIĆ“, mit einem Stück Klebeband. Drin steckt ein Prospekt für Waschmittel. Die Welt hat nicht mitbekommen, dass hier niemand mehr wäscht.',take:'Ich nehme einer Toten nicht die Post weg.',g:{look:'Jahrelang kamen hier Briefe von Brač an. Und dann keine mehr.'}},
 {id:'notice',name:'Todesanzeige',look:function(A){ return readNotice(A); },read:function(A){ return readNotice(A); },g:{look:'Sie haben ihr Bild nicht dazugetan. Es gab keines, auf dem sie allein war.'}},
 {id:'church',name:'Sveti Nikola',look:'Sveti Nikola. Der Heilige der Seeleute. Die Kirche ist kleiner als meine Wohnung und älter als fast alles, was ich kenne.',open:'Zu. Der Pfarrer kommt nur morgens.',g:{look:'Hier haben sie für die gebetet, die draußen waren. Manchmal haben die draußen es gehört. Glaube ich.'}},
 {id:'bell',name:'Glocke',look:'Eine einzige Glocke im Giebel. Sie schlägt die Messe und die Toten.',use:'Ich läute keine Kirchenglocken.',g:{look:'…',sense:'Nein.'}},
 {id:'steps',name:'Stufen',look:'Die Stufen hinauf zum Marjan. Oben nur Pinien, Wind und die Stadt unter einem.',use:'Heute nicht. Meine Knie sind älter als ich.',g:{look:'Oben auf dem Hügel ist es nachts sehr hell. Man sieht alle Lichter auf einmal.'}},
 {id:'laundry',name:'Wäscheleine',look:function(A){ return A.m(A.G.tod==='night'?'Wäsche in der Nacht. Hier hängt man sie auf, wenn der Wind gut ist, egal wie spät.':'Wäsche quer über der Gasse. Hier wissen alle alles voneinander. Fast alles.'); },take:'Das sind Zdenkas Laken. Ich hänge an meinem Leben.',g:{look:'Ein Kinderhemd. Hier wohnt also doch noch jemand Junges.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne an einem Eisenarm. Sie geht an, wenn sie will.',g:{look:'Licht. Ich mag es nicht mehr so wie früher.'}},
 {id:'cat',name:'Katze',look:'Eine schwarze Katze auf einer Stufe. Mrki. Er gehört Zdenka oder niemandem, was hier dasselbe ist.',talk:'„Mic, mic.“ Mrki sieht mich an und dann an mir vorbei. Genau an die Stelle, wo Mala steht.',take:'Er würde mich zerkratzen. Mit Recht.',g:{look:'Er sieht mich. Katzen sehen mich immer.',talk:async function(A){ await A.g('…'); await A.g('Er blinzelt langsam. Das heißt, er hat keine Angst.'); }}}
];
async function readNotice(A){ await A.doc({style:'letter',title:'✝  OSMRTNICA',lines:['Nach kurzer Krankheit verstarb im Alter von 85 Jahren','IVKA PERIĆ','geb. 1926.','','Die Beerdigung fand am Sonntag, 13.11.2011,','auf dem Friedhof Lovrinac statt.','','Es trauern die Nachbarn aus Veli Varoš.']});
  if (A.first('noticeSaid')) await A.m('„Es trauern die Nachbarn.“ Sonst niemand. Sonst war niemand mehr da.'); }
async function enterIvka(A){ A.sfx('lock'); await A.wait(200); A.sfx('door'); await A.goto('ivka'); }
M.room('varos',{ name:'Veli Varoš', scape:'varos',
  music:function(GS){ return GS.phase==='pro'?'flat':(GS.phase==='c2'?'case2':'case1'); },
  actors:function(S,GS){ var L=[]; if (zdenkaHere(GS)){ var p=M.apos('varos','zdenka',[86,122,'R']); L.push({id:'zdenka',ch:'zdenka',x:p[0],y:p[1],f:p[2]||'R',name:'Zdenka',idle:'sit',speechY:40}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='pro' && from==='ivka' && !A.flag('pro.visited')){ A.setFlag('pro.visited'); var Z=A.npc('zdenka'); await A.walk(M.apos('varos','zdenka')[0]+30,M.apos('varos','zdenka')[1]+2); await A.face('L');
      await Z.say('Haben Sie, was Sie brauchen?'); await A.m('Mehr, als in zweitausend Zeichen passt.'); A.take('key_ivka'); A.sfx('click'); await Z.say('Das ist immer so.'); await A.m('Danke, Gospođa Zdenka.');
      await A.wait(300); return M.endProVisit(A); }
    if (p==='pro' && from!=='ivka' && A.first('varosFirst')){ await A.m('Veli Varoš. Hier sind die Gassen so eng, dass sich die Nachbarn über die Straße das Salz reichen.'); }
    if (p==='c2' && A.has('newspaper') && A.first('c2zdHint')){ await A.m('Zdenka sitzt wieder auf ihrem Posten. Ich habe die Zeitung dabei.'); } }
});
M.defineScape('varos',function(o){ var tod=o.tod, w=M.scn.weather(o.GS); return { beds:w==='rain'?['rain','city']:(w==='bura'?['bura','city']:['city','seaFar']), step:'stone',
  ev:tod==='night'?[['tv',8,20,0.6,-0.8,-0.4],['cat',30,70,0.5,0.2,0.6],['bellFar',60,120,0.3,0.4,0.8],['shutter',20,45,0.6,-1,1]]:[['tv',10,25,0.5,-0.8,-0.4],['scooter',15,40,0.4,-1,-0.4],['cat',25,60,0.4,0.2,0.6],['dog',30,70,0.3,0.6,1],['gull',15,35,0.3,-1,1],['bellSmall',70,140,0.4,0.6,0.9]] }; });
})(M);
