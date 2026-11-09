/* ===== rooms/terminal.js — Fährhafen & Busbahnhof: Mira am Kiosk (Fall 2), der Bus nach Sarajevo (Epilog) ===== */
(function(M){
'use strict';
var P=M.P;
function miraHere(GS){ return GS.phase==='c2'||GS.phase==='epi'; }
async function talkMira(A){ var Mi=A.npc('mira');
  if (A.G.phase==='epi') return miraEpi(A,Mi);
  if (A.first('miHello')){ await Mi.say('Zeitung? Zigaretten? Ein Feuerzeug gegen die Bura?'); }
  await A.menuLoop(function(){ return [
    {t:'Haben Sie Batterien? Mono, für ein altes Radio.',if:!A.has('batteries')&&!A.has('radioB')&&!A.has('radioT'),go:async function(A){ await Mi.say('Mono. Die verlangt keiner mehr. Warten Sie.'); await A.wait(900); A.sfx('coin'); A.give('batteries'); await Mi.say('Vier Stück, die letzten. Ich wickle sie Ihnen ein. Sonst laufen sie aus.'); }},
    {t:'Sie arbeiten schon lange hier?',once:'mi1',go:async function(A){ await Mi.say('Seit neunzig. Ich habe drei Fährgesellschaften überlebt, zwei Kriege im Fernsehen und einen Mann.'); await Mi.say('Den Mann habe ich nicht überlebt. Er mich.'); }},
    {t:'Erinnern Sie sich an den August neunundneunzig? An ein Mädchen, das hier gewartet hat?',once:'mi2',if:A.hasNote('c2_meet')||A.hasNote('c2_waited')||A.hasNote('c2_stayed')||A.hasNote('c2_echo'),go:async function(A){ await Mi.say('Neunundneunzig …'); await A.wait(900);
        await Mi.say('Ein Mädchen, ja. Rotes Kleid, eine große Tasche. Sie stand da, bis die Fähre nach Ancona weg war. Dann saß sie auf der Bank, bis die Zeitungen kamen.'); await Mi.say('Ich habe ihr einen Kaffee gegeben. Sie hat kein Wort gesagt. Nicht ein Wort.'); A.note('c2_mira1');
        await Mi.say('Den Jungen hatte ich am Vormittag gesehen. Er hat drüben am Schalter zwei Tickets gekauft und gestrahlt, als hätte er im Lotto gewonnen.'); A.note('c2_mira2');
        await Mi.say('Drei Tage später kam die Polizei und hat mir ein Foto von ihm gezeigt. Da wusste ich es.'); }},
    A.askOpt({ c2_luka:'Luka hieß er? Er hat hier manchmal Zigaretten gekauft. Einzeln. Ich habe ihm immer eine geschenkt.', c2_ferry:'Die nach Ancona fährt immer noch um neun. Dienstags, donnerstags, samstags. Heute auch.',
      c2_case:'Die zwei Tickets? Er hat sie so vorsichtig eingesteckt, als wären sie aus Glas.', c2_stayed:'Sie ist geblieben? Gut. Hier braucht man Leute, die bleiben.' },'Weiß ich nicht, Schatz. Ich verkaufe Zeitungen, ich lese sie nicht.'),
    {t:'Danke, Gospođa Mira.',bye:true,go:async function(A){ await Mi.say('Mira reicht. Gospođa war meine Mutter.'); }}
  ]; }); }
async function miraEpi(A,Mi){ if (A.first('miEpi')){ await Mi.say('So früh? Sie sehen aus, als hätten Sie gar nicht geschlafen.'); await A.m('Hab ich auch nicht.'); await Mi.say('Kaffee?'); await A.m('Gern.'); A.sfx('cup');
    await Mi.say('Die Frau aus dem Rahmenladen war gestern Nacht hier. Hat sich auf die Bank gesetzt. Hat gelächelt. Ich habe ihr einen Kaffee gegeben.'); await Mi.say('Diesmal hat sie danke gesagt.'); return; }
  await Mi.say(A.cycle('miE',['Der Bus nach Sarajevo fährt um sieben. Wenn Sie den meinen.','Schalter ist da drüben. Die Frau dort ist netter, als sie aussieht.','Gute Reise.'])); }
// ---------------------------------------------------------------- Epilog
async function buyTicket(A){ if (A.has('busticket')) return A.m('Ich habe sie. Nur hin.'); if (!A.has('fee')) return A.m('Ich habe kein Geld dabei. Ljerkas Umschlag …');
  var tc=M.stand('terminal','ticket_counter'); if (tc) await A.walk(tc[0],tc[1]); await A.face('B'); await A.voice('„Kamo?“ Wohin?',P.s5); await A.m('Sarajevo.'); await A.voice('„Povratna?“ Hin und zurück?',P.s5);
  var c=await A.choose([{t:'Nur hin.',id:'one'},{t:'Hin und zurück.',id:'both'}],{title:'Schalter'});
  if (c==='both'){ await A.m('…'); await A.wait(800); await A.m('Nein. Nur hin. Die Rückfahrt kaufe ich, wenn ich weiß, ob ich zurückwill.'); } else await A.m('Nur hin.');
  A.sfx('ticket'); A.take('fee'); A.give('busticket'); await A.voice('„Sedam sati. Peron tri.“ Sieben Uhr. Bahnsteig drei.',P.s5);
  await A.wait(900); var b=M.apos('terminal','mala',[350,124,'L']); A.malaJoin({x:b[0],y:b[1],f:b[2]||'L'}); A.idleG('sit'); A.sfx('shimmer'); A.G.flags['mala.lock']=true;
  await A.wait(1200); await A.m('…'); await A.g('Du fährst also.'); await A.m('Du warst weg.'); await A.g('Ich war hier.'); A.setFlag('epi.mala'); }
async function talkMalaEnd(A){
  await A.menuLoop(function(){ return [
    {t:'Warst du im Hotel Palma? Im Winter dreiundneunzig?',once:'e1',go:async function(A){ await A.wait(900); await A.g('Ich war schon einmal hier. Im Winter. Ich habe auf einen Bus gewartet.'); await A.m('Auf welchen?'); await A.g('Auf einen, der nach Hause fährt.'); await A.wait(1300);
        await A.g('Er kam nicht. Oder ich war nicht da, als er kam. Ich weiß es nicht mehr.'); }},
    {t:'Wie heißt du wirklich?',once:'e2',go:async function(A){ await A.g('Mala reicht.'); await A.m('Im Register stand ein L.'); await A.g('Im Register stehen viele Buchstaben.'); }},
    {t:'Was ist in der Dose?',once:'e3',go:async function(A){ await A.animG('tinF'); await A.g('Irgendwann.'); A.idleG('sit'); }},
    {t:'Kommst du mit?',once:'e4',go:async function(A){ await A.g('Ich bin an dich gebunden. Weißt du noch?'); await A.m('Das hast du nie gesagt.'); await A.g('Nein. Das hast du gemerkt.'); }},
    {t:'Es ist Zeit.',bye:true}
  ]; });
  await A.g('Du fährst also.'); await A.m('Ich weiß nicht, ob ich fahre. Ich weiß nur, dass ich nicht mehr warten will.'); await A.wait(800);
  A.sfx('pa'); await A.voice('„Autobus za Mostar i Sarajevo, peron tri.“',P.s4); A.sfx('bus');
  if (A.mala) await A.animG('look'); A.sfx('horn'); await A.wait(900); await A.g('…'); await A.m('Die Fähre.'); await A.g('Ich weiß.'); await A.wait(600); await A.g('Diesmal bleibe ich.');
  await A.fade(8,1600); A.music('end'); M.E.fade=0;
  await A.memory({title:'Im Bus',tint:'memory',draw:M.mem.bus,lines:['Der Bus fährt am Hafen entlang nach Osten. Hinter den Bergen wird es hell.','Marko sieht aus dem Fenster. Neben ihm sitzt niemand. Für alle anderen.','Als er hinaussieht, öffnet Mala ihre Dose.','Darin liegen ein Straßenbahnticket aus Sarajevo und ein halbes Foto. Ein gestreifter Ärmel. Ein Stück Straßenbahn.','Sie macht die Dose wieder zu.']});
  await A.card({kicker:'',title:'Ende des ersten Kapitels',sub:'Fortsetzung: Sarajevo',ms:5200});
  await A.endChapter(); }
M.talkMalaEnd=talkMalaEnd;
// Erinnerungsbild „Im Bus“: siehe 93_mem.js
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Zurück in die Stadt.',canExit:async function(A){ if (A.G.phase==='epi'){ if (A.has('busticket')){ await A.m('Ich habe eine Fahrkarte. Ich gehe nicht mehr zurück in die Stadt. Nicht heute.'); return false; } await A.m('Nein. Ich bin aus einem Grund hier.'); return false; } return true; }},
 {id:'mira',npc:'mira',name:'Mira',hgt:30,vis:function(S,GS){ return miraHere(GS); },talk:talkMira,r:function(S,GS,a){ return [Math.round(a.x)-10,Math.round(a.y)-50,20,30]; },
   look:'Mira im Kiosk: weinrote Locken, eine Brille an einer Kette, eine Strickjacke in Lila. Sie sieht alles, auch was hinter ihr passiert.',
   g:{look:'Sie hat hier jeden gesehen, der wegging. Und fast jeden, der zurückkam.',listen:'Sie redet mit dem Radio. Sie gibt ihm recht.'}},
 {id:'ferry',name:'Fähre',look:function(A){ return A.m(A.G.phase==='epi'?'Die Fähre nach Supetar, die erste des Tages. Ein paar Lieferwagen, ein Mann mit einem Hund.':'Die Fähre nach Ancona. Weiß, hoch wie ein Haus, mit offener Bugklappe. Heute Abend um neun legt sie ab.'); },g:{look:'…',listen:'Wenn sie tutet, will ich weg. Ich weiß nicht, wohin.'}},
 {id:'terminal_bldg',name:'Fährterminal',look:'Das Fährterminal, ein Betonbau aus den Siebzigern, der aussieht, als würde er selbst gern wegfahren.',g:{look:'Drinnen schlafen manchmal Leute auf den Bänken.'}},
 {id:'kiosk',name:'Kiosk',look:'Ein Kiosk mit Zeitungen, Zigaretten, Feuerzeugen und Ansichtskarten von einem Sommer, der längst vorbei ist.',g:{look:'Hier hat sie gestanden. Das Mädchen in Rot.'}},
 {id:'bench',name:'Bank',look:'Eine Bank aus Beton. Bis zum Morgen sitzt man darauf nicht gern.',use:'Später.',g:{look:'Hier hat sie die ganze Nacht gesessen.',sense:'Das Holz hat es vergessen. Der Beton nicht.'}},
 {id:'palm',name:'Palme',look:'Eine einsame Palme zwischen Bussen und Fähren. Sie hat sich mit allem abgefunden.'},
 {id:'bus',name:'Bus',look:function(A){ return A.m(A.G.phase==='epi'?'Der Bus nach Sarajevo. Der Motor läuft schon. Der Fahrer trinkt einen Kaffee und raucht dazu.':'Ein Reisebus. Auf der Scheibe: SARAJEVO.'); },
   use:async function(A){ if (A.G.phase!=='epi') return A.m('Nicht heute.'); if (!A.has('busticket')) return A.m('Ohne Fahrkarte nimmt er mich nicht mit.'); if (!A.flag('epi.mala')) return A.m('Noch nicht.'); return talkMalaEnd(A); },
   g:{look:'SARAJEVO.',sense:'…'}},
 {id:'bus_sign',name:'Schild „SARAJEVO“',look:'„SPLIT – MOSTAR – SARAJEVO“. Auf Pappe, mit Filzstift, hinter der Windschutzscheibe.',g:{look:'Ich kenne die Strecke. Ich weiß nicht, woher.'}},
 {id:'ticket_counter',name:'Fahrkartenschalter',look:'Ein Schalter mit einem Schild: BLAGAJNA. Dahinter eine Frau mit einem sehr großen Stempel.',use:function(A){ if (A.G.phase!=='epi') return A.m('Ich will nirgendwohin. Noch nicht.'); return buyTicket(A); },
   with:{ fee:function(A){ return buyTicket(A); } },g:{look:'Hier kaufen sie Fahrkarten. Ich brauche keine.'}},
 {id:'timetable',name:'Abfahrtstafel',look:'Sarajevo 07:00. Zagreb 08:15. Dubrovnik 09:30. Mostar über Sarajevo. Lauter Orte, an denen jemand wartet.',read:'„SARAJEVO 07:00 – PERON 3“.',g:{look:'Mostar. Sarajevo. Dubrovnik.',sense:'…'}},
 {id:'speaker',name:'Lautsprecher',look:'Ein Lautsprecher an einem Mast. Er sagt Orte an, an die man fahren kann.',g:{look:'Seine Stimme klingt wie damals. Wie überall.'}},
 {id:'sea',name:'Hafen',look:function(A){ return A.m(A.G.phase==='epi'?'Das Wasser ist im Morgengrauen rosa. Die Ledana gegenüber liegt im Schatten. Am Montag wird sie abgerissen.':'Der Hafen. Gegenüber, kaum zu erkennen, die alte Ledana.'); },g:{look:'Von hier sieht man die Rampe. Ganz klein.'}}
];
M.room('terminal',{ name:'Fährhafen & Busbahnhof', scape:'terminal', music:function(GS){ return GS.phase==='epi'?'end':'case2'; },
  actors:function(S,GS){ if (!miraHere(GS)) return []; var p=M.apos('terminal','mira',[236,108,'F']); return [{id:'mira',ch:'mira',x:p[0],y:p[1],f:p[2]||'F',name:'Mira'}]; },
  hotspots:HS,
  enter:async function(A,from){ if (A.G.phase==='c2' && A.first('termIn')) await A.m('Der Fährhafen. Busse, Fähren, Möwen, Abgase. Hier kommt man an oder geht weg. Dazwischen gibt es nur den Kiosk.');
    if (A.G.phase==='epi' && A.first('termEpi')){ await A.narrate('Samstag. Das erste Licht kommt über die Berge.'); await A.m('Mala ist nicht da. Seit dem Hotel nicht.'); } }
});
M.defineScape('terminal',function(o){ var e=o.tod==='dawn'; return { beds:['sea','engine','city'], step:'stone', ev:[['gull',5,12,1,-1,1],['bus',16,35,0.8,0.2,1],['pa',25,55,0.6,0.2,0.8],['horn',30,60,0.6,-1,-0.3],['steps',10,22,0.5,-1,1],['bellFar',e?40:90,e?60:150,0.5,-0.4,0]] }; });
})(M);
