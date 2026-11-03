/* ===== rooms/sustipan.js — Sustipan: Park auf dem alten Friedhof. Die Tafel für die, die das Meer behielt. Jakov. Zwischenspiel 2 ===== */
(function(M){
'use strict';
var P=M.P;
function jakovHere(GS){ return GS.phase!=='epi'; }
async function readPlaque(A){ await A.doc({style:'log',title:'ONIMA KOJE JE MORE ZADRŽALO',w:236,lines:['Denen, die das Meer behielt','','Ante Bilić · 1948–1971','Jure Tomić · 1950–1979','Antonio Perić · 1962–1984','Marin Kovač · 1955–1991','Ivo Grgić · 1971–2003','…']});
  if (!A.hasNote('c1_plaque')){ A.note('c1_plaque'); await A.m('Antonio Perić, 1962 bis 1984. Ivka hat ihn nie für tot erklären lassen. Jemand anders hat seinen Namen hierhergebracht.'); } }
async function talkJakov(A){ var J=A.npc('jakov');
  if (A.isMala()){
    if (A.first('jkMala')){ await J.say('Ti opet, mala?'); await A.g('Du verwechselst mich.'); await J.say('Ich verwechsle keine Gesichter. Nur Jahre.'); A.note('m_jakov'); }
    return A.menuLoop(function(){ return [
      {t:'Was fegst du hier?',once:'jk1',go:async function(A){ await J.say('Die Wege. Sie haben die Gräber achtundfünfzig weggeräumt. Die Knochen nach Lovrinac, die Steine in die Ufermauer.'); await J.say('Die Namen sind geblieben. Ich fege die Wege für die Namen.'); }},
      {t:'Kommt jemand an die Tafel?',once:'jk2',if:A.hasNote('c1_plaque')||A.G.phase==='c1'||A.G.phase==='c1_night',go:async function(A){ await J.say('Jedes Jahr am zweiundzwanzigsten Dezember kommt ein Mann und steht vor der Tafel. Er sagt nichts. Er bleibt, bis es hell wird.'); A.note('c1_jakov'); }},
      {t:'Warum bist du noch hier?',once:'jk3',go:async function(A){ await J.say('Wo soll ich denn hin? Die Wege fegen sich nicht von allein.'); await J.say('Und du, mala? Wo sollst du hin?'); await A.wait(900); await A.g('…'); }},
      {t:'Lass gut sein, Jakov.',bye:true,go:async function(A){ await J.say('Ist gut. Ich fege weiter.'); }}
    ]; }); }
  if (A.first('jkMarko')){ await J.say('Dobra večer. Spät für einen Spaziergang. Pass auf, wo du hintrittst.'); await A.m('Hier ist doch nur Kies.'); await J.say('Kies und Namen. Ich halte die Wege sauber. Die Stadt tut es ja nicht.'); }
  await A.menuLoop(function(){ return [
    {t:'Wer liegt hier begraben?',once:'jm1',go:async function(A){ await J.say('Niemand mehr. Und alle. Fischer, Kapitäne, Kinder, die das Fieber geholt hat. Ein Bischof. Ein Dieb. Die lagen alle nebeneinander. Da war nie Streit.'); }},
    {t:'Kommt jemand an diese Tafel?',once:'jm4',if:A.hasNote('c1_plaque')&&!A.hasNote('c1_jakov'),go:async function(A){ await J.say('Einmal im Jahr. Am zweiundzwanzigsten Dezember kommt ein Mann und steht davor. Er sagt nichts. Er bleibt, bis es hell wird.'); A.note('c1_jakov'); }},
    {t:'Kommen die Ertrunkenen auch hierher?',once:'jm2',go:async function(A){ await J.say('Die das Meer behält, kommen nicht her. Die bleiben draußen.'); await J.say('Oder sie kommen nach Hause, wenn einer sie ruft. Nicht hierher. Nach Hause.'); }},
    {t:'Kennen Sie Mala?',once:'jm3',if:A.malaHere(),go:async function(A){ await J.say('Die Kleine? Die war schon einmal hier. Im Winter. Sie hat auf der Bank gesessen und auf die Fähren geschaut.'); if (A.malaHere()){ await A.g('Jakov.'); await J.say('Ich sage ja nichts.'); } }},
    A.askOpt({ c1_plaque:async function(A){ await J.say('Die Tafel ist neu. Achtzig, neunzig. Neu für mich.'); await J.say('Einmal im Jahr kommt einer und steht davor. Am zweiundzwanzigsten Dezember. Bis es hell wird.'); A.note('c1_jakov'); },
      c1_capsized:'Vor Sustipan, ja. Da unten ist eine Strömung, die kennen nur die Alten. Die Bura drückt dich hinaus, die Strömung zieht dich hinunter.',
      c1_words:'Wer so etwas zuletzt sagt, der ist nicht verloren. Der ist nur woanders.' },'Ich bin nur ein alter Mann mit einem Besen.'),
    {t:'Gute Nacht.',bye:true,go:async function(A){ await J.say('Laku noć. Pass auf, wo du hintrittst. Hier liegen Namen.'); }}
  ]; }); }
// ---------------------------------------------------------------- Zwischenspiel 2
M.interlude2=async function(A){ M.E.busy=true;
  try{ A.phase('i2'); await A.goto('sustipan',{noEnter:true}); A.G.flags['mala.lock']=true; var b=M.stand('sustipan','bench')||[200,124,'B']; A.placeM(b[0],b[1],'R'); A.idleM('sit'); A.placeG(b[0]+16,b[1],'L'); A.idleG('sit'); A.rebuild();
    await A.narrate('Später. Der Wind hat sich gelegt. Über Sustipan stehen die Sterne, und unten atmet das Meer.');
    await A.g('Du hast heute etwas Gutes getan.'); await A.m('Ich habe eine Kassette abgespielt.'); await A.g('Manchmal ist das dasselbe.');
    await A.menuLoop(function(){ return [
      {t:'Meine Großmutter hat an der Linie 3 gewohnt.',once:'s1',go:async function(A){ await A.m('In Sarajevo. In der Altstadt. Im Winter bin ich mit der Straßenbahn zu ihr gefahren, Linie 3, bis ganz nach hinten.');
          await A.m('Sie hat Kaffee in der Džezva gekocht, die jetzt bei mir auf dem Regal steht. „Kaffee kocht man nicht, man wartet auf ihn.“');
          await A.g('Und im Winter haben die Kohleöfen geraucht, dass man den Himmel nicht gesehen hat.'); await A.wait(900);
          await A.m('Woher weißt du das?'); await A.g('Das weiß jeder. Aus dem Fernsehen.'); await A.m('Aus dem Fernsehen weiß man nicht, wie es riecht.'); await A.wait(1400); A.note('m_sarajevo'); }},
      {t:'Hast du jemanden, der auf dich wartet?',once:'s2',go:async function(A){ await A.wait(900); await A.g('Ich glaube, ich habe auf jemanden gewartet.'); await A.g('Ich weiß nicht mehr, ob er gekommen ist.'); A.note('m_waited');
          await A.m('Soll ich es herausfinden?'); await A.g('Nein.'); await A.wait(1200); await A.g('Noch nicht.'); }},
      {t:'Jakov kennt dich.',once:'s3',if:A.hasNote('m_jakov'),go:async function(A){ await A.g('Jakov kennt alle. Er fegt hier seit fünfzig Jahren.'); await A.m('Er sagt, du warst schon einmal hier. Im Winter.'); await A.g('Jakov sagt viel, wenn die Nacht lang ist.'); }},
      {t:'(Den Sternen zusehen.)',once:'s4',go:async function(A){ await A.wait(2200); A.sfx('horn'); await A.wait(1400); await A.g('Die Fähre nach Ancona. Sie fährt jetzt ohne die beiden.'); await A.m('Sie fahren trotzdem. Irgendwie.'); }},
      {t:'Gehen wir nach Hause.',bye:true}
    ]; });
    await A.g('Da ist noch einer. Einer, der nicht schläft.'); await A.m('Wer?'); await A.g('Einer, der immer Dienst hat. Er sucht ein Wort. Seit Jahren.');
    await A.m('Morgen.'); await A.g('Morgen.'); A.G.flags['mala.lock']=false; A.idleM(null); A.idleG(null); A.setFlag('i2.done');
  } finally { M.E.busy=false; }
  await M.startCase3(A); };
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Der Weg zurück in die Stadt.'},
 {id:'jakov',npc:'jakov',name:'Jakov',hgt:46,vis:function(S,GS){ return jakovHere(GS); },talk:talkJakov,
   look:'Ein alter Mann mit Schiebermütze und Weste, der einen Weg fegt, der sauber ist. Er ist durchscheinend wie Nebel über dem Wasser.',
   g:{look:'Jakov. Er war Totengräber hier, bevor es keine Toten mehr gab.',talk:talkJakov}},
 {id:'pines',name:'Pinien',look:'Hohe Pinien, vom Wind schief gekämmt. Sie riechen nach Harz und Salz.',g:{look:'Ihre Wurzeln wissen, was hier war.'}},
 {id:'pavilion',name:'Pavillon',look:'Ein kleiner runder Pavillon mit Säulen, ganz vorn an der Spitze. Im Sommer küssen sich hier Leute. Im November steht er nur da.',use:'Ich stelle mich hinein. Der Wind kommt von allen Seiten gleichzeitig.',g:{look:'Früher stand hier eine Kapelle. Kleiner. Mit einer Glocke, die man bei Begräbnissen läutete.'}},
 {id:'plaque',name:'Gedenktafel',look:function(A){ return readPlaque(A); },read:function(A){ return readPlaque(A); },g:{look:'Namen, die das Meer behalten hat. Die Steine darunter sind älter als die Namen.',sense:'Hier steht jedes Jahr ein Mann. Er weint nicht. Er steht nur.'}},
 {id:'bench',name:'Bank',look:'Eine Bank mit Blick aufs offene Meer. Dahinter ist bis Italien nichts.',use:'Gleich.',g:{look:'Ich habe hier einmal gesessen. Glaube ich.'}},
 {id:'sea',name:'Meer',look:'Das offene Meer. Hier, vor Sustipan, ist die ANKICA gekentert.',g:{look:'Tief. Kalt. Ruhig.',sense:'Da unten ist niemand mehr. Er ist nach Hause gegangen.'}},
 {id:'lighthouse',name:'Leuchtfeuer',look:'Das grüne Leuchtfeuer auf dem Wellenbrecher. Es blinkt in einem Rhythmus, den alle Seeleute hier im Schlaf kennen.',g:{look:'Grün. Es heißt: Hier geht es hinein.'}},
 {id:'city',name:'Die Stadt',look:'Über die Bucht die Lichter von Split. Der Glockenturm, die Riva, die Fähren. Von hier aus sieht alles ruhig aus.',g:{look:'Von hier aus sieht man, wie klein alles ist.'}},
 {id:'wall',name:'Steinmauer',look:'Eine niedrige Mauer aus altem Stein. Manche Steine haben eingemeißelte Buchstaben, verkehrt herum. Alte Grabsteine, verbaut.',g:{look:'Die Mauer ist aus ihren Grabsteinen gemacht. Sie stehen Kopf.'}},
 {id:'graves',name:'Die alten Gräber',who:'g',noReveal:true,g:{look:'Hier lagen sie. Hunderte. Unter den Pinien, unter dem Weg, unter der Bank.',sense:async function(A){ await A.g('Ein Begräbnis im Regen, irgendwann vor dem Krieg. Kleine Leute mit großen Schirmen. Ein Kind, das nicht weint, weil es nicht versteht.'); }}}
];
M.room('sustipan',{ name:'Sustipan', scape:'sustipan', music:function(GS){ return GS.phase==='i2'?'title':'ghost'; },
  actors:function(S,GS){ if (!jakovHere(GS)) return []; var p=M.apos('sustipan','jakov',[150,120,'L']); return [{id:'jakov',ch:'jakov',x:p[0],y:p[1],f:p[2]||'L',name:'Jakov',ghost:true,idle:'sweep'}]; },
  hotspots:HS,
  enter:async function(A,from){ if (A.G.phase==='i2') return; if (A.first('susIn')){ await A.m('Sustipan. Ein Park mit Pinien und einem Pavillon. Früher war hier der Friedhof der Stadt.'); if (A.malaHere()) await A.g('Für mich ist er das immer noch.'); } }
});
M.defineScape('sustipan',function(o){ return { beds:['seaFar','pines'], step:'gravel', ev:[['wave',6,14,0.8,-0.6,0.8],['gust',14,30,0.4,-1,1],['bellFar',80,160,0.4,0.6,1],['horn',40,80,0.4,0.6,1],['chimeWind',30,60,0.6,-0.4,0.4]] }; });
})(M);
