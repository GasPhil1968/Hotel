/* ===== rooms/bar.js — Bar „Bura“: Sanja, Stipe & Frane, Markos Ecktisch, die Zeitung ===== */
(function(M){
'use strict';
var P=M.P;
function open(GS){ return ['c1','c1_night','c2','c3'].indexOf(GS.phase)>=0; }
function regulars(GS){ return GS.phase==='c2'||GS.phase==='c1'; }
async function talkSanja(A){ var S=A.npc('sanja'), p=A.G.phase;
  if (p==='c2' && A.first('saC2')){ await S.say('Wie immer?'); await A.m('Wie immer.'); A.sfx('espresso'); await A.wait(900); A.sfx('cup'); await S.say('Du warst in der Zeitung. „Die Stillen“. Hab’s gelesen.'); await S.say('Hast du gut gemacht. Sie hätte sich gefreut. Glaube ich.'); }
  else if (A.first('saHello')) await S.say('Marko. Wie immer?');
  if (A.S.angry){ await S.say('Trink deinen Kaffee, Marko.'); return; }
  await A.menuLoop(function(){ return [
    {t:'Was ist mit der alten Ledana?',once:'sa1',if:p==='c2',go:async function(A){ await S.say('Abriss am Montag. Ein Hotel. Hundertzwanzig Zimmer.'); await S.say('Gut so.'); A.note('c2_demolish'); if (A.hasNote('c2_boy')) await A.m('Sie hat „gut so“ gesagt wie jemand, der etwas wegsperrt.'); }},
    {t:'Kanntest du den Jungen, der dort gestorben ist?',once:'sa2',if:p==='c2'&&A.hasNote('c2_boy')&&!lukaKnown(A),go:async function(A){ await S.say('Warum willst du das wissen?');
        var c=await A.choose([{t:'Ich schreibe vielleicht über den Abriss.',id:'job'},{t:'Ich frage nur.',id:'just'}],{title:'Sanja'});
        if (c==='job') await S.say('Dann schreib über Beton, Marko.'); else await S.say('Dann frag nicht.'); }},
    {t:'Luka. Luka und Nina. Erzähl mir von ihnen.',if:p==='c2'&&lukaKnown(A)&&!A.hasNote('c2_shop'),go:function(A){ return sanjaStory(A,S); }},
    {t:'Ich glaube, Luka wartet immer noch auf sie.',once:'saWrong',if:p==='c2'&&lukaKnown(A),go:async function(A){ await S.say('…'); await S.say('So redet man nicht über Tote. Nicht in meiner Bar.'); A.S.angry=true; A.G.seen['dlg:saWrong']=0; return 'bye'; }},
    {t:'Wo finde ich Nina?',if:p==='c2'&&A.hasNote('c2_shop'),once:'sa4',go:async function(A){ await S.say('In der Altstadt, hinter dem Peristil. „Okvir“. Sie rahmt Bilder. Andere Leute ihre Erinnerungen.'); await S.say('Lass sie in Ruhe, Marko. Sie hat zwölf Jahre gebraucht, um wieder an der Riva vorbeigehen zu können.'); }},
    {t:'Wer war damals noch am Hafen?',once:'sa5',if:p==='c2'&&A.hasNote('c2_shop'),go:async function(A){ await S.say('Mira am Kiosk beim Fährterminal. Die war damals schon da. Die sieht immer alles. Sie hat damals mit der Polizei geredet.'); A.unlock('terminal'); }},
    {t:'Wie geht’s dir, Sanja?',once:'sa6',go:async function(A){ await S.say('Die Bura treibt mir die Gäste weg und den Staub herein. Wie immer.'); await S.say('Und dir? Du siehst aus, als hättest du nicht geschlafen.'); await A.m('Wie immer.'); }},
    A.askOpt({ c2_demolish:'Montag. Da kommen die Bagger.', c2_meet:async function(A){ await S.say('Der Kiosk am Fährterminal.'); await A.wait(800); await S.say('Woher weißt du das?'); await A.m('Ich weiß es einfach.'); await S.say('Du machst mir Angst, Marko.'); },
      c2_luka:async function(A){ return sanjaStory(A,S); }, c2_ferry:async function(A){ return sanjaStory(A,S); },
      c2_died:'Drei Tage. Drei Tage haben wir ihn gesucht, und er lag da die ganze Zeit.', c2_stayed:'Sie ist geblieben. Ich weiß nicht, ob aus Trotz oder aus Treue.',
      c2_tape:'Eine Kassette? Er hat immer Kassetten aufgenommen. Mit einem Rekorder vom Flohmarkt, der alles schneller abspielte.' },'Weiß ich nicht, Marko.'),
    {t:'Danke für den Kaffee.',bye:true,go:async function(A){ await S.say('Du hast nicht bezahlt.'); await A.m('Ich bezahle morgen.'); await S.say('Wie immer.'); }}
  ]; }); }
function lukaKnown(A){ return A.hasNote('c2_luka')||A.hasNote('c2_meet')||A.has('tickets'); }
async function sanjaStory(A,S){ if (A.hasNote('c2_shop')) return S.say('Ich habe dir alles gesagt.');
  await S.say('Woher kennst du die Namen?'); await A.m('Aus der Ledana.'); await S.say('…');
  await S.say('Luka hat im Sommer an der Riva Gitarre gespielt, für die Touristen. Nina hat immer zugehört, da drüben auf der Bank. Ich habe hier gekellnert. Achtzehn war ich.'); A.note('c2_riva');
  await S.say('Sie wollten weg. Nach Italien, auf die Kunstschule in Venedig. Ninas Vater war … dagegen. Gegen alles.');
  await S.say('An dem Abend, an dem sie fahren wollten, kam Luka nicht. Drei Tage später haben sie ihn in der Ledana gefunden. Unten an der Treppe.'); A.note('c2_died');
  await S.say('Nina ist nie weggegangen. Nicht nach Venedig, nicht nach Zagreb. Sie hat einen kleinen Laden in der Altstadt. „Okvir“. Bilderrahmen.'); A.note('c2_stayed',true); A.note('c2_shop'); A.unlock('oldtown');
  await S.say('Sie redet nicht über damals. Mit niemandem. Mit mir auch nicht.'); }
async function talkRegulars(A){ var St=A.npc('stipe'), Fr=A.npc('frane');
  if (A.G.phase!=='c2'){ await St.say('Briškula. Wir reden nicht beim Spielen.'); return; }
  if (A.first('regC2')){ await St.say('Montag reißen sie die Ledana ab.'); await Fr.say('Gut. Da ist sowieso nur Unglück drin.'); await St.say('Neunundneunzig, der Junge.'); await Fr.say('Spiel, Stipe.'); A.note('c2_demolish'); A.note('c2_boy'); return; }
  await A.menuLoop(function(){ return [
    {t:'Was für ein Junge war das, neunundneunzig?',once:'rg1',go:async function(A){ await St.say('Einer mit Gitarre. Hat an der Riva gespielt, „Moja mala nima mana“ und so, für die Deutschen.'); await Fr.say('Für die Italiener.'); await St.say('Für alle. Dann ist er in der Ledana die Treppe runtergefallen. Die Treppe war damals schon morsch.'); A.note('c2_boy',true); }},
    {t:'Wer gewinnt?',once:'rg2',go:async function(A){ await Fr.say('Ich.'); await St.say('Seit vierzig Jahren sagt er das.'); await Fr.say('Seit vierzig Jahren stimmt es.'); }},
    {t:'Wie geht’s Hajduk?',once:'rg3',go:async function(A){ await St.say('Frag nicht.'); await Fr.say('Frag wirklich nicht.'); }},
    {t:'Ich lasse euch spielen.',bye:true}
  ]; }); }
var HS=[
 {id:'door',name:'Tür',exit:{to:'map'},look:'Die Tür zur Gasse. Ein Glöckchen bimmelt, wenn jemand kommt, und schweigt, wenn jemand geht.'},
 {id:'sanja',npc:'sanja',name:'Sanja',hgt:40,vis:function(S,GS){ return open(GS); },talk:talkSanja,r:function(S,GS,a){ return [Math.round(a.x)-9,Math.round(a.y)-50,18,30]; },
   look:'Sanja. Kurze schwarze Haare, eine Schürze, ein Blick, der seit fünfzehn Jahren Gäste sortiert.',
   g:{look:'Sie mag ihn. Sie würde es nie sagen.',listen:async function(A){ if (!A.hasNote('c2_shop')) return A.g('Sie summt beim Spülen. Ein Lied von der Riva. Dann hört sie plötzlich auf.'); await A.g('Sie redet leise mit sich selbst: „Zwölf Jahre. Und jetzt kommt er mit den Namen.“'); }},
   give:{ letter_t:async function(A){ if (A.flag('c1.letterOpen')) return A.npc('sanja').say('Der ist doch offen. Lies ihn.'); return M.steamLetter(A,'bar'); },
     newspaper:'„Behalt sie. Ich habe zwei.“', tickets:async function(A){ var S=A.npc('sanja'); await S.say('Zwei Tickets nach Ancona …'); await A.wait(900); await S.say('Woher hast du die?'); await A.m('Aus der Ledana.'); return sanjaStory(A,S); } }},
 {id:'stipe',npc:'stipe',name:'Stipe',hgt:36,vis:function(S,GS){ return regulars(GS); },talk:talkRegulars,look:'Stipe, Schiebermütze, braunes Sakko, siebzig Jahre Briškula in den Fingern.',g:{look:'Er schummelt. Nur ein bisschen. Seit vierzig Jahren.',listen:'Er zählt die Punkte laut und falsch.'}},
 {id:'frane',npc:'frane',name:'Frane',hgt:36,vis:function(S,GS){ return regulars(GS); },talk:talkRegulars,look:'Frane, Glatze mit weißem Kranz, die Karten fächerförmig vor der Nase.',g:{look:'Er lässt Stipe gewinnen, wenn Stipe traurig ist. Stipe merkt es nicht.',listen:'„Meine Frau hat immer gesagt, ich spiele schlecht.“ Er lächelt dabei.'}},
 {id:'counter',name:'Tresen',look:'Ein Tresen aus Zink und Holz, mit Ringen von zehntausend Tassen.',g:{look:'Hier lehnen sie alle, wenn sie nicht nach Hause wollen.'}},
 {id:'espresso',name:'Espressomaschine',look:'Eine verchromte Espressomaschine, älter als Sanja. Sie faucht wie ein Drache, der Kaffee macht. Aus dem Dampfrohr zischt es.',use:'Niemand außer Sanja fasst diese Maschine an. Niemand.',
   with:{ letter_t:async function(A){ if (A.flag('c1.letterOpen')) return A.m('Er ist schon offen.'); if (!A.npc('sanja').actor) return A.m('Ohne Sanja fasse ich diese Maschine nicht an.'); await A.m('Darf ich?'); await A.npc('sanja').say('Finger weg von meiner Maschine, Marko.'); return M.steamLetter(A,'bar'); } },
   g:{look:'Sie zischt. Ich mag das Geräusch.'}},
 {id:'bottles',name:'Flaschen',look:'Travarica, Pelinkovac, Maraschino, ein Whisky, den nie jemand bestellt.',g:{look:'Sie stehen da wie Zuschauer.'}},
 {id:'radio',name:'Radio',look:'Ein Radio, auf Sport gestellt. Hajduk verliert wahrscheinlich gerade. Auch wenn sie nicht spielen.',use:'Ich lasse es laufen. Das Radio gehört zur Bar wie die Bura.',g:{listen:'Fußball. Ein Mann schreit, weil ein anderer Mann gegen einen Ball getreten hat.',look:'Es redet für alle, die schweigen.'}},
 {id:'photos',name:'Mannschaftsfotos',look:'Hajduk, 1971, 1979, 1994. Männer mit Schnurrbärten und Hoffnung.',g:{look:'Alle lächeln. Fotos von damals lächeln immer.'}},
 {id:'window',name:'Fenster',look:'Durchs Fenster: die Gasse, ein Stück Riva, die Bura, die Plastikstühle über das Pflaster jagt.',g:{look:'Draußen geht das Leben vorbei. Es grüßt nicht.'}},
 {id:'marko_table',name:'Markos Tisch',look:'Mein Tisch, am Fenster. Hier habe ich mehr Seiten übersetzt als zu Hause.',use:'Ich setze mich kurz. Der Stuhl kennt mich.',g:{look:'Hier sitzt er jeden Morgen. Ich setze mich ihm gegenüber. Niemand setzt sich je auf meinen Stuhl.'}},
 {id:'cards_table',name:'Kartentisch',look:'Ein Tisch, an dem seit Jahrzehnten Briškula gespielt wird. Die Karten sind so alt wie die Spieler.',g:{look:'Die Karten sind weich wie Stoff.'}},
 {id:'newspaper',name:'Zeitung',vis:function(S,GS){ return !S.paperTaken && GS.phase==='c2'; },look:'Glas Rive von heute. Seite 14: „Die Stillen“.',
   take:async function(A){ await A.reach(function(){ A.set('paperTaken',true); A.give('newspaper'); }); await A.npc('sanja').say('Nimm sie mit. Ich habe zwei.'); await A.m('Zdenka wollte sie sehen.'); },
   read:function(A){ return M.readNewspaper(A); }, g:{look:'Sein Text. Ganz unten auf der Seite, wo man ihn fast übersieht.'}}
];
M.room('bar',{ name:'Bar „Bura“', scape:'bar',
  music:function(GS){ return GS.phase==='c2'?'case2':'flat'; },
  actors:function(S,GS){ var L=[]; if (open(GS)){ var p=M.apos('bar','sanja',[120,106,'F']); L.push({id:'sanja',ch:'sanja',x:p[0],y:p[1],f:p[2]||'F',name:'Sanja',idle:'polish'}); }
    if (regulars(GS)){ var s=M.apos('bar','stipe',[214,124,'R']), f=M.apos('bar','frane',[252,124,'L']); L.push({id:'stipe',ch:'stipe',x:s[0],y:s[1],f:s[2]||'R',name:'Stipe',idle:'cards',speechY:40}); L.push({id:'frane',ch:'frane',x:f[0],y:f[1],f:f[2]||'L',name:'Frane',idle:'cards',speechY:40}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ A.S.angry=false;
    if ((A.G.phase==='c1'||A.G.phase==='c1_night') && A.first('barC1')){ await A.m('Die Bar „Bura“. Mein Ecktisch, mein Kaffee. Sanja sieht mich an, als wüsste sie, dass ich nicht geschlafen habe.'); if (A.flag('mala.voice')) await A.g('Hier riecht es nach dir.'); }
    if (A.G.phase==='c2' && A.first('barC2')){ await A.m('Die Bar „Bura“. Bei Bura ist sie immer voll. Heute sind es zwei alte Männer und ich.'); } }
});
M.defineScape('bar',function(o){ return { beds:['crowdFar','room'], step:'tile', ev:[['cups',3,8,0.8,-0.6,0.2],['cards',4,9,0.9,0.4,0.7],['espresso',20,45,0.7,-0.6,-0.3],['radio',8,16,0.6,-0.8,-0.5],['door',40,90,0.4,-1,-0.8]] }; });
M.readNewspaper=async function(A){ var lead=['Ivka Perić hat siebenundzwanzig Jahre lang auf ein Schiff gewartet.','Jeden Abend um sieben ging Ivka Perić zur Riva.','Ivka Perić hinterlässt zwei Tassen und einen Stuhl am Fenster.'][A.G.flags.lead||0];
  await A.doc({style:'news',title:'GLAS RIVE · Die Stillen',w:244,lines:[lead,'','In der Wohnung in Veli Varoš stehen zwei Tassen auf dem Tisch, eine davon nie benutzt. Am Fenster ein Stuhl, zur Mole gedreht. 1984 kam ihr Sohn Tonći in der Weihnachtsbura nicht nach Hause. Sie hat nie aufgehört, das Boot um sieben abzuholen.','','Ivka Perić starb am 10. November. Sie wurde 85 Jahre alt.','— M. V.']}); };
})(M);
