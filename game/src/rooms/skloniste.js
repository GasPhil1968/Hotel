/* ===== rooms/skloniste.js — der Schutzraum: Zoras Kellerschule, die Klingel, das Klassenbuch, der Stempel, die letzte Stunde ===== */
(function(M){
'use strict';
var P=M.P;
function night(G){ return G.phase==='k2_s3_n'; }
function zoraHere(G){ return (G.phase==='k2_s3'||G.phase==='k2_s3_n') && !G.flags['k2.s3.gone']; }
function pupilsHere(G){ return night(G) && !!G.flags['k2.s3.down'] && !G.flags['k2.s3.done']; }
// ---------------------------------------------------------------- Bereit für die letzte Stunde?
M.k2CheckS3Night=async function(A){ var f=function(k){ return A.flag(k); }; if (A.G.phase!=='k2_s3' || f('k2.s3.night')) return;
  if (!(f('k2.s3.mirza') && f('k2.s3.selma') && f('k2.s3.damir') && f('k2.s3.stamped') && A.has('dnevnik'))) return;
  await A.wait(600); if (A.G.malaOn) await A.g('Alle kommen. Heute Abend.'); await A.m('Um neun. Wenn Damir Schluss hat.'); await M.k2StartS3Night(A); };
// ---------------------------------------------------------------- Zora (mit Mala)
async function talkZora(A){ var Z=A.npc('zora'); A.found('zora'); if (!A.hasNote('s3_roll')) A.note('s3_roll');
  if (night(A.G)) return Z.say(A.flag('k2.s3.free')?'Ist es weit, Kind?':'Ruhe, bitte. Wir beginnen.');
  if (A.first('zrFirst')){ await Z.say('Hodžić Mirza?'); await A.wait(700); await Z.say('Karić Selma?'); await A.wait(700); await Z.say('Kovač Damir?'); await A.wait(900); await Z.say('Niemand. Heute ist wieder niemand gekommen.'); await A.wait(600); await Z.face('L'); await Z.say('Du. Du bist zu spät. Setz dich.'); await A.g('Ich bin nicht …'); await Z.say('Setz dich. Wir haben Rechnen.'); }
  await A.menuLoop(function(){ return [
    {t:'Wen rufen Sie auf?',once:'zr1',go:async function(A){ await Z.say('Meine Kinder. Zwanzig, manchmal dreißig. Aus Nummer 5, 7 und 9.'); await Z.say('Seit Januar kommen sie nicht mehr. Seit …'); Z.agitate(2000); await Z.say('Seit draußen wieder geschossen wird.'); }},
    {t:'Was wollen Sie ihnen geben?',once:'zr2',go:async function(A){ await Z.say('Die Zeugnisse. Ich habe sie geschrieben, jedes einzeln, bei Kerzenlicht. Noten, Unterschrift. Nur der Stempel fehlt. Die Schule ist zerstört, der Stempel ist weg.');
        await Z.say('Ich habe es ihnen versprochen: Ihr bekommt Zeugnisse mit Stempel. Damit es zählt. Damit nach dem Krieg einer sagen kann: Ich war in der Schule.'); await Z.say('Wenn alle da sind, verteile ich sie.'); A.note('s3_stamp'); }},
    {t:'Wo sind die Zeugnisse?',once:'zr3',if:A.hasNote('s3_stamp'),go:async function(A){ await Z.say('Im Schrank. Der Schrank ist abgeschlossen, damit die Kinder nicht an die Noten gehen.'); await Z.say('Den Schlüssel habe ich. Aber ich weiß nicht mehr, wo. Ich weiß es immer, wenn es klingelt.'); }},
    {t:'Kennen Sie mich?',once:'zr4',go:async function(A){ await Z.say('Natürlich kenne ich dich.'); await A.wait(800); await Z.say('Du bist die, die mit Kreide malt. Die Straßenbahnen.'); await A.wait(600); await Z.say('Wie heißt du noch, Kind? Ich bin müde, die Namen gehen mir durcheinander.'); await A.g('Ich weiß es nicht.'); await Z.say('Dann rufe ich dich auf, wenn ich es weiß.'); }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Das Klingeln, gehört von unten (Mala ist im Schutzraum, Marko drückt oben)
async function onSwitch(A,who){ var S=A.S; if (who!=='mala' || !S.rang || A.hasNote('s3_deskkey') || !zoraHere(A.G)) return; var Z=A.npc('zora'); A.found('zora');
  await A.wait(300); A.sfx('schoolBell'); await A.wait(900); await Z.say('Pause vorbei!'); await A.wait(500);
  await A.memory({title:'Nachhall – die Klingel',tint:'ghost',draw:M.mem&&M.mem.k2_school,lines:['Die Klingel schrillt. Kinder laufen die Treppe herunter, zwanzig, dreißig, in Mänteln.','Die Lehrerin bückt sich unter das Pult und löst einen kleinen Schlüssel, der dort mit Klebeband hängt.','Sie schließt den Schrank auf und holt die Kreide heraus. „Pause vorbei!“','Ein Mädchen mit Zopf verteilt die Hefte. Sie zwinkert einem Jungen in der letzten Reihe zu.']});
  A.note('s3_deskkey'); await A.g('Unter dem Pult. Mit Klebeband.'); await A.wait(500); await A.g('Und ich … ich habe die Hefte verteilt.'); }
// ---------------------------------------------------------------- Schlüssel, Schrank, Klassenbuch
async function underDesk(A){ if (A.has('deskkey')||A.flag('k2.s3.cabinet')) return A.m('Nur noch Klebeband und siebzehn Jahre Staub.'); if (!A.hasNote('s3_deskkey')){ await A.m('Unter dem Pult ist es dunkel. Ich taste. Holz, Staub, Kaugummi von 1993.'); return; }
  await A.animM('kneelF'); A.give('deskkey'); A.sfx('keys'); await A.m('Unter dem Pult, mit Klebeband: ein kleiner Messingschlüssel. Das Klebeband hält noch. Siebzehn Jahre.'); }
async function cabinet(A){ var S=A.S; if (S.cabinetOpen) return A.m('Der Schrank ist offen. Kreide, Hefte, ein Globus mit einer Delle bei Australien.');
  if (!A.has('deskkey')) return A.m('Ein Blechschrank mit Vorhängeschloss. Verschlossen.');
  A.sfx('lock'); A.take('deskkey'); A.set('cabinetOpen',true); A.setFlag('k2.s3.cabinet'); await A.wait(300); await A.m('Das Schloss springt auf. Kreideschachteln, Hefte, ein Globus. Ganz oben ein grünes Klassenbuch und ein Stapel Papiere, mit Schnur gebunden.');
  await A.reach(); A.give('dnevnik'); A.give('svjedocanstva'); A.sfx('paper'); await A.m('Das Klassenbuch. Und die Zeugnisse.'); A.save(); }
M.k2ReadDnevnik=async function(A){ await A.doc({style:'log',title:'DNEVNIK RADA · Školska godina 1993/94',lines:['Učiteljica: Zora Marić · Pomoćnica, crtanje: Lana Delić','','II r.: Karić Selma, Hodžić Mirza, Begić Amina …','III r.: Kovač Damir, Sulejmanović Edin …','VIII r.: Vuković Marko, Hadžić Ena …','','22.1.1994: Mirza H. – ranjen. Moja krivica.','22.1.1994: nastava prekinuta. Unterricht abgebrochen.']});
  var nn=['s3_register','s3_guilt','s3_helper','m2_pupil'], added=nn.filter(function(id){ return !A.hasNote(id); }); nn.forEach(function(id){ A.note(id,true); });
  if (added.length){ A.sfx('note'); await A.m('Die Namen. Selma Karić, Mirza Hodžić, Damir Kovač. Und in der achten Klasse: Vuković, Marko.'); await A.wait(600);
    // passt zu dem, was er schon erinnert: am Tisch mit dem M kam die Kellerschule zurück – sonst kommt sie hier, beim eigenen Namen
    if (A.flag('k2.mem.cellar')){ await A.m('Ich war hier unten. Das M im Tisch hinten, das Mädchen mit dem Zopf.'); await A.m('Jetzt haben die Bilder Namen.'); }
    else { await A.m('Ich war hier unten.'); await A.wait(500); await M.k2MemCellar(A,'register'); }
    await A.wait(500); await A.m('„Pomoćnica, crtanje: Lana Delić.“ Helferin, Zeichnen.'); await A.wait(700); await A.m('Und am 22. Januar 1994, in einer zitternden Schrift: „Mirza H. – verwundet. Meine Schuld.“'); if (A.G.malaOn){ await A.wait(700); await A.g('Lana Delić. Sie hat Zeichnen unterrichtet.'); await A.g('…'); } } };
M.k2Stamp=async function(A){ if (A.flag('k2.s3.stamped')) return A.m('Alle gestempelt. Alle zählen.'); await A.animM('reachM'); for (var i=0;i<4;i++){ A.sfx('stamp'); await A.wait(380); } A.setFlag('k2.s3.stamped'); A.take('pecat');
  await A.m('Ich stemple jedes Zeugnis. Dreiundzwanzig Stück. „Osnovna škola Alipašino Polje“, rund, blau, ein bisschen schief.'); await A.m('Siebzehn Jahre zu spät. Und genau richtig.'); await M.k2CheckS3Night(A); if (!A.flag('k2.s3.night')) A.save(); };
// ---------------------------------------------------------------- Die letzte Stunde
async function rollcall(A){ if (A.flag('k2.s3.free')) return; if (!night(A.G)) return A.m('Erst wenn alle da sind.'); var Z=A.npc('zora'); A.setFlag('k2.s3.rollStart'); A.G.flags['mala.lock']=true;
  var d=M.stand('skloniste','desk')||[150,124,'B']; await A.walk(d[0],d[1]); await A.face('L'); A.music('k2_duh');
  await A.narrate('Kerzen auf den Bänken. Drei Erwachsene auf Kinderbänken, die Knie fast am Kinn. Vorn die Lehrerin an der Tafel, blass wie Kreide.'); await A.wait(600);
  await A.m('Ich schlage das Klassenbuch auf. Ich lese vor, was sie geschrieben hat.'); await A.wait(500);
  var Se=A.npc('selma'), Dm=A.npc('damir'), Mz=A.npc('mirza');
  await A.m('Karić, Selma.'); await A.wait(700); await Se.say('Prisutna.'); await A.wait(500); await Z.say('Selma …'); await Z.say('Du bist groß geworden. Du hast so lange gebraucht für das R.'); await Se.say('Ich lese meinem Sohn jeden Abend vor, učiteljice. Mit R.'); await A.wait(600);
  await A.m('Kovač, Damir.'); await A.wait(600); await Dm.say('Prisutan.'); await Z.say('Damir. Hast du deine Straßenbahn fertig gemalt?'); await Dm.say('Ich fahre sie. Die Drei. Jeden Tag.'); await A.wait(400); await Z.say('Ah.'); await A.wait(800);
  await A.m('Hodžić, Mirza.'); await A.wait(1100); await Mz.anim('sit'); await A.narrate('Mirza steht auf. Er nimmt die Mütze ab.'); await Mz.say('Prisutan, učiteljice.'); await A.wait(1000);
  await Z.say('Mirza?'); Z.agitate(4200); await A.wait(800); await Z.say('Du bist … du lebst?'); await Mz.say('Sie haben mich hereingetragen. Ich habe nie danke gesagt.'); await Mz.say('Danke.');
  await A.wait(700); await Z.say('Du lebst.'); await A.wait(900);
  await A.realize('zora');
  await A.wait(500); await Z.say('Du lebst. Und ich nicht.'); await A.wait(1100); await Z.say('Achtundneunzig. Das Herz. Ich habe nie wieder unterrichtet. Ich habe gedacht, ich habe ein Kind nicht beschützt.'); await A.wait(800); await Z.say('Und das Kind hat zwei Finger weniger und eine Mütze und sagt danke.'); Z.mood('sad');
  await A.wait(1000); await A.m('Delić, Lana.'); await A.wait(2200); await A.narrate('Stille. Die Kerzen flackern. Selma sieht sich um, als hätte jemand die Tür aufgemacht.');
  await A.wait(900); await A.g('Prisutna.'); await A.wait(1000); await Z.face('R'); await Z.say('Lana.'); await A.wait(800); await Z.say('Lana, Kind. Du und der kleine Vuković, immer die Straßenbahnen. Er hat sie dir abgemalt, und du hast ihm die Räder beigebracht. Er hat sie nie gekonnt.'); A.note('m2_lana_teacher');
  if (!A.hasNote('m2_lana')){ await A.wait(700); await A.m('(Leise.) Lana. Lana Delić. Neunter Stock.'); A.note('m2_lana'); }   // Analyse K2-B02: kein Notizbuch-Schloss für das, was hier gesagt wird
  await A.wait(1000); await A.m('…Vuković, Marko.'); await A.wait(800); await A.m('Prisutan.'); await Z.say('Mali. Du hast dein Zeugnis nie abgeholt. Achte Klasse, alles Vierer, und eine Zwei im Zeichnen.'); await A.m('Ich weiß.'); await A.wait(500); await A.m('Jetzt weiß ich es.');
  await A.wait(900); await A.narrate('Ich verteile die Zeugnisse. Für die, die da sind, und für die, die nicht kommen konnten. Die anderen lege ich auf die Bänke. Mit Stempel.'); A.take('svjedocanstva');
  await A.wait(900); await Z.say('Lana. Komm her.'); if (A.malaHere()) await A.walkG(Math.round(Z.actor.x)-22,Math.round(Z.actor.y)+2);
  await Z.say('Du bist so leer, Kind. Weißt du, warum?'); await A.g('Nein.'); await Z.say('Wir Toten erinnern uns mit den Lebenden. Mit denen, an die wir gebunden sind. Wenn die vergessen, sind wir leer.'); await A.wait(700); await Z.say('Einer hat dich vergessen. Sehr gründlich.'); await A.wait(900); await Z.say('Er sitzt in der letzten Reihe.'); A.note('m2_lore');
  await A.wait(1200); await A.m('…'); await A.wait(600); A.setFlag('k2.s3.free'); A.sfx('shimmer'); await A.switchTo('mala'); A.G.flags['mala.lock']=false; await A.g('Učiteljice. Die Leine ist los.'); await Z.say('Ich weiß. Die Stunde ist fast aus.'); await A.g('Ich bringe Sie hinüber.'); await Z.say('Gleich. Lass sie noch kurz sitzen. Sie sehen so schön aus mit ihren Zeugnissen.'); A.save(); }
async function crossZora(A){ var Z=A.npc('zora'); A.G.flags['mala.lock']=true; var p=M.apos('skloniste','zora',[150,112,'F']); await A.g('Kommen Sie.'); await A.crossOpen(p[0]+24,p[1]+10,{w:18,h:74}); await A.g('Marko. Nimm meine Hand.');
  await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true}],{title:'',conv:false}); A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'zora'); }
M.afterLimbo_zora=async function(A){ A.G.flags['mala.lock']=false; A.setFlag('k2.s3.gone'); var d=M.stand('skloniste','desk')||[150,124,'B']; await A.goto('skloniste',{x:d[0],y:d[1],f:'L',fade:false,noEnter:true}); await A.fade(0,900);
  await A.wait(700); await A.narrate('Der Keller. Die Kerzen sind heruntergebrannt. Selma hält ihr Zeugnis gegen das Licht, Damir hat seins gefaltet und in die Uniformjacke gesteckt. Mirza sitzt einfach da.');
  await A.npc('mirza').say('Sie ist weg, oder?'); await A.m('Ja.'); await A.npc('mirza').say('Gut. Ich meine … gut.'); await A.npc('selma').say('Ich habe die Glocke gehört. Ganz am Schluss. Habt ihr sie gehört?'); await A.npc('damir').say('Ich habe nichts gehört.'); await A.wait(500); await A.npc('damir').say('Doch.');
  A.setFlag('k2.s3.done'); await A.wait(800); await A.m('Heute Nacht schlafe ich. Ich glaube, heute schlafe ich wirklich.'); if (A.G.malaOn){ await A.g('Marko?'); await A.m('Ja?'); await A.g('Ich war hier. Ich habe dich gekannt.'); await A.m('Ich weiß. Ich weiß es nur noch nicht.'); } A.save(); };
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Treppe',exit:{to:'haustor',gok:true},look:'Die Treppe hinauf, zur Stahltür.',canExit:async function(A){ if (night(A.G) && A.flag('k2.s3.rollStart') && !A.flag('k2.s3.done')){ await A.m('Nicht jetzt. Die Stunde ist noch nicht aus.'); return false; } return true; }},
 {id:'zora',npc:'zora',name:'Zora',gname:'Lehrerin',hgt:46,vis:function(S,G){ return zoraHere(G); },talk:function(A){ return A.isMala()?talkZora(A):(A.isFound('zora')?A.npc('zora').say(A.cycle('zrM',['Ruhe. Wir sind im Unterricht.','Setz dich, Vuković.'])):A.m('Vor der Tafel ist es kälter als im Rest des Raums.')); },
   look:function(A){ return A.m(A.isFound('zora')?'Eine Frau mit grauem Knoten und Brille an der Kette, an der Tafel, die Kreide in der Hand. Zora Marić. Sie ruft Namen auf.':'Vor der Tafel ist es kälter als im Rest des Raums.'); },
   give:{ svjedocanstva:'Zora: „Noch nicht. Erst, wenn alle da sind.“', pecat:'Zora: „Der Stempel! Gib ihn nicht mir. Stempel du. Ich kann nichts mehr halten.“', dnevnik:function(A){ return rollcall(A); } },
   g:{look:'Sie steht an der Tafel und ruft Namen auf. Sie ist an die Namen gebunden.',talk:function(A){ return talkZora(A); },
     cross:function(A){ return crossZora(A); },crossIf:function(S,G){ return !!G.flags['k2.s3.free'] && !G.flags['k2.s3.gone']; }}},
 {id:'mirza',npc:'mirza',name:'Mirza',hgt:34,vis:function(S,G){ return pupilsHere(G); },look:'Mirza, auf der ersten Bank, die Mütze in der Hand.',talk:async function(A){ await A.npc('mirza').say('Fangen Sie an. Bevor ich es mir anders überlege.'); }},
 {id:'selma',npc:'selma',name:'Selma',hgt:34,vis:function(S,G){ return pupilsHere(G); },look:'Selma, zweite Bank, geschminkt für einen Keller.',talk:async function(A){ await A.npc('selma').say('Ich habe Angst. Ist das normal?'); await A.m('Ich auch.'); }},
 {id:'damir',npc:'damir',name:'Damir',hgt:34,vis:function(S,G){ return pupilsHere(G); },look:'Damir, dritte Bank, die Uniformjacke offen, die Kerze im Marmeladenglas vor sich.',talk:async function(A){ await A.npc('damir').say('Hier unten habe ich Straßenbahnen gemalt. Jetzt fahre ich sie. Komisch, oder?'); }},
 {id:'blackboard',name:'Tafel',look:'Eine Tafel auf einem Holzgestell, verschmiert, fast leer. Nur in einer Ecke, mit Kreide, die nie ganz wegging: ein paar Rechnungen.',
   use:async function(A){ if (!night(A.G)) return A.m('Ich schreibe nichts an fremde Tafeln. Nicht mehr.'); return rollcall(A); },
   g:{look:async function(A){ await A.g('Die Tafel ist voll. Rechnungen, ein Gedicht von Šantić, Namen in Kinderschrift. Und in der Ecke eine Straßenbahn mit einer Drei. Mit zu vielen Fenstern.'); if (!A.hasNote('s3_board')) A.note('s3_board'); }}},
 {id:'drawings',name:'Kinderzeichnungen',look:'Kinderzeichnungen an der Wand, vergilbt, mit Reißzwecken: Sonnen, Häuser, ein Hund, viele Straßenbahnen. Auf allen steht eine Drei.',
   g:{look:'Die Straßenbahnen. Ich habe sie ihnen gezeigt. Die Räder sind immer schief.',sense:'Kinder, die an etwas denken, das fährt. Weg von hier.'}},
 {id:'benches',name:'Bänke',look:function(A){ return A.m(pupilsHere(A.G)?'Die Bänke, mit Kerzen. Drei Erwachsene darauf, die Knie am Kinn.':'Schmale Bänke und Tische in Reihen. In einen Tisch hinten ist ein M geritzt.'); },
   use:function(A){ if (pupilsHere(A.G)) return A.m('Die Bänke gehören heute Nacht anderen.'); return M.k2MemCellar(A); },
   g:{look:'In der letzten Reihe hat einer gesessen, der nie aufgepasst hat. Er hat aus dem Fenster gesehen. Es gab kein Fenster.',sense:'So viele Kinder. Sie sind alle groß geworden. Fast alle.'}},
 {id:'desk',name:'Pult',look:'Das Lehrerpult mit einer Schublade, die klemmt. Darauf eine Handglocke aus Messing.',use:function(A){ return night(A.G)?rollcall(A):A.m('Ein Pult. Für jemanden, der Namen aufruft.'); },
   with:{ dnevnik:function(A){ return night(A.G)?rollcall(A):M.k2ReadDnevnik(A); }, svjedocanstva:function(A){ return night(A.G)?rollcall(A):A.m('Erst, wenn alle da sind.'); }, pecat:function(A){ return A.has('svjedocanstva')?M.k2Stamp(A):A.m('Ohne Zeugnisse stemple ich nur das Pult.'); } },
   g:{look:'Unter dem Pult hängt etwas. Ich sehe es nicht. Ich sehe es, wenn es klingelt.'}},
 {id:'under_desk',name:'Unter dem Pult',look:'Unter dem Pult. Dunkel.',use:function(A){ return underDesk(A); },take:function(A){ return underDesk(A); },reach:'floor',g:{look:function(A){ return A.g(A.hasNote('s3_deskkey')?'Da. Mit Klebeband.':'Nichts. Oder ich sehe es nicht.'); }}},
 {id:'cabinet',name:'Schrank',look:function(A){ return A.m(A.S.cabinetOpen?'Der Blechschrank steht offen.':'Ein Blechschrank, grau, mit einem kleinen Vorhängeschloss.'); },open:function(A){ return cabinet(A); },use:function(A){ return cabinet(A); },with:{ deskkey:function(A){ return cabinet(A); } },
   g:{look:'Darin liegen Papiere, die auf jemanden warten. Dreiundzwanzig.'}},
 {id:'bell',name:'Handglocke',look:'Eine Messingglocke mit Holzgriff. Damit hat Zora die Pause beendet.',take:async function(A){ if (A.has('zvono')) return A.m('Ich habe sie.'); if (!A.flag('k2.s3.free')) return A.m('Die gehört Zora. Noch.'); await A.reach(); A.give('zvono'); await A.m('Ich nehme die Glocke. Sie ist schwerer, als sie aussieht.'); },
   use:'Ich läute nicht. Das ist nicht meine Pause.',g:{look:'Wenn sie läutete, sind alle gerannt. Nach unten.'}},
 {id:'stove',name:'Ofen',look:'Ein Ofen aus einem Ölfass, mit einem Rohr in den Lüftungsschacht. Daneben ein Eimer mit Holzresten, die siebzehn Jahre alt sind.',g:{look:'Wir haben Möbel darin verbrannt. Und Bücher. Die schlechten, hat sie gesagt. Es waren nicht nur die schlechten.'}},
 {id:'pipes',name:'Rohre',look:'Rohre unter der Decke, Wasser, Heizung, Strom. Ein Tropfen fällt in regelmäßigen Abständen in eine Blechdose.',g:{look:'Das Tropfen. Damit haben wir die Zeit gezählt.'}},
 {id:'sandbags',name:'Sandsäcke',look:'Sandsäcke am Eingang, verrottet, aus denen der Sand rieselt wie aus einer Sanduhr.',g:{look:'Davor haben wir uns versteckt. Hinter Sand.'}},
 {id:'canister',name:'Wasserkanister',look:'Ein gelber Wasserkanister, leer, mit dem Logo einer Hilfsorganisation, verblasst.',g:{look:'Den haben wir zu zweit getragen. Zwanzig Liter. Hundertvierundvierzig Stufen.'}},
 {id:'bulb',name:'Glühbirne',look:function(A){ return A.m(A.S.lit?'Die Glühbirne brennt.':'Eine nackte Glühbirne an einem Kabel. Kein Strom. Mirza hat den Keller vom Netz genommen.'); },use:'Kein Strom hier unten.',g:{look:'Wir hatten Kerzen. Und manchmal Strom für eine Stunde.'}},
 {id:'bellbox',name:'Klingel',look:'Eine alte elektrische Klingel an der Wand, eine Schale mit Klöppel. Ein Kabel führt nach oben.',g:{look:'Sie läutet, wenn oben jemand drückt.'}}
];
M.room('skloniste',{ name:'Schutzraum', scape:'k2_skloniste', music:function(G){ return night(G)?'k2_duh':''; },   // am Tag bewusst Stille im dunklen Keller
 
  state:function(G){ return {lit:false,cabinetOpen:false,rang:false,rollcall:false}; },
  dark:function(S,G){ return !S.lit; },
  darkLights:function(S,G){ var f=M.ART.skloniste&&M.ART.skloniste.darkLights; return typeof f==='function'?f(S,G):(f||[]); },
  onSwitch:function(A,who){ return onSwitch(A,who); },
  actors:function(S,G){ var L=[]; S.lit=night(G); S.rollcall=pupilsHere(G);
    if (zoraHere(G)){ var z=M.apos('skloniste','zora',[150,112,'F']); L.push({id:'zora',ch:'zora',x:z[0],y:z[1],f:z[2]||'F',name:'Zora',ghost:true,reveal:!night(G),idle:'teach',speechY:46}); }
    if (pupilsHere(G)){ ['mirza','selma','damir'].forEach(function(id){ var p=M.apos('skloniste',id,[100,126,'L']); L.push({id:id,ch:id,x:p[0],y:p[1],f:p[2]||'L',name:id==='mirza'?'Mirza':(id==='selma'?'Selma':'Damir'),idle:'sit',speechY:36}); }); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_s3' && A.isMala() && A.first('k2skG')){ await A.g('Dunkel. Kalt. Und eine Stimme, die Namen aufruft.'); }
    if (p==='k2_s3' && !A.isMala() && A.first('k2skM')){ await A.m('Stockdunkel. Es riecht nach nassem Beton und alter Kreide.'); if (A.malaHere()) await A.m('Nur wo Mala steht, sehe ich etwas.'); else await A.m('Ich sehe nichts. Ohne Mala sehe ich hier nichts.'); }
    if (p==='k2_s3_n' && A.first('k2skN')){ await A.narrate('Der Keller bei Kerzenlicht. Drei Kerzen in Marmeladengläsern auf drei Bänken. Und vorn an der Tafel, deutlicher als am Tag, Zora.'); await A.npc('zora').say('Ruhe, bitte. Wir beginnen.'); await A.m('Sie wartet. Auf mich. Auf das Klassenbuch.'); } }
});
})(M);
