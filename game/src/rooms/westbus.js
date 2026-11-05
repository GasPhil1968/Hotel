/* ===== rooms/westbus.js — Westbusbahnhof: Bussteig, Fahrplan, Café „Zdravko“. Am Samstag kommt beim ersten Besuch der Bus aus München:
   Davor und Lena steigen aus, Mate sieht an ihnen vorbei („Er kommt mit dem nächsten. Mein Sohn ist jung.“). ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function sat(G){ return G.phase==='k3_d2'; }
function zelHere(G){ return sat(G) && F(G,'k3.b.arrived') && !F(G,'k3.b.westLeft'); }
// ---------------------------------------------------------------- Der Bus aus München (Samstag, erster Besuch)
async function busArrives(A){ var G=A.G; if (F(G,'k3.b.arrived')) return; A.music('k3_mate');
  A.set('munich',true); A.rebuild(); A.sfx('busBrake'); var bn=M.stand('westbus','bench')||[205,124,'B']; await A.walk(bn[0]-16,bn[1]+1); await A.face('R'); await A.wait(500);
  await A.narrate('Samstag. In die Busbucht rollt ein Reisebus, weiß und blau, mit einem Münchner Kennzeichen: „MÜNCHEN – MOSTAR“. Die Bremsen zischen. Die Gepäckklappe geht auf.');
  var Z=A.npc('zdravko'); await A.wait(500); await A.narrate('Zdravko steht in der Tür seines Cafés, das Geschirrtuch über der Schulter.'); await Z.say('Er hatte Verspätung. Er hat immer Verspätung.');
  // Mate kommt aus dem Café auf den Bussteig
  if (!A.isFound('mate')) A.found('mate');
  var dp=M.stand('westbus','cafe_door')||[115,117,'B'], bs=M.apos('westbus','davor',[266,121,'L']);
  var Mt=A.spawn({id:'mate',ch:'mate',x:dp[0],y:dp[1]+1,f:'R',name:'Mate',ghost:true,reveal:true,speechY:46,routine:false});
  await A.wait(600); if (G.malaOn && A.malaHere()) await A.g('Marko. Er ist herausgekommen.');
  await Mt.walk(bs[0]-70,bs[1]+2); await Mt.face('R'); Mt.idle('wait');
  await A.narrate('Mate steht auf dem Bussteig, die Thermoskanne unter dem Arm, die Hände auf dem Rücken. Er sieht jedem ins Gesicht, der aussteigt.');
  await A.narrate('Leute steigen aus, verschlafen, mit Taschen, mit Tüten von einer Tankstelle. Zuletzt ein grauer Mann im beigen Mantel und ein Mädchen in einem pinken Anorak, Kopfhörer um den Hals.');
  var Dv=A.npc('davor'), Ln=A.npc('lena'); Dv.show(); Ln.show(); if (Dv.actor) Dv.actor.fadeIn=A.gt; if (Ln.actor) Ln.actor.fadeIn=A.gt; await A.wait(1200);
  await A.narrate('Mate sieht sie an. Den grauen Mann, das Mädchen. Dann sieht er an ihnen vorbei, zur Bustür, ob noch einer kommt.');
  await A.wait(900); await Mt.say('Er kommt mit dem nächsten.'); await A.wait(700); await Mt.say('Mein Sohn ist jung.'); A.note('b3_notson');
  if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Er hat ihn angesehen. Und nicht erkannt.'); await A.m('Der Graue. Das ist Davor, oder?'); await A.g('Ich glaube, ja.'); if (A.flag('k3.b.promise')){ await A.wait(500); await A.g('Du hast versprochen nachzusehen, ob er kommt. Er ist gekommen.'); await A.m('Und sein Vater sieht ihn nicht.'); } }
  await A.wait(500); await Mt.say('Ich warte drinnen. Es zieht.'); Mt.idle(null); await Mt.walk(dp[0],dp[1]-1); if (Mt.actor) Mt.actor.fadeOut=A.gt; await A.wait(950); A.despawn('mate');
  A.setFlag('k3.b.arrived');
  // Davor und Lena
  await A.wait(600); await Ln.say('Papa. Wo ist jetzt dieses Taxi?'); await Dv.anim('phone'); await Dv.say('Gleich. Sie ruft zurück. Jela ruft zurück.');
  await A.wait(800); await Dv.say('Oprostite … gdje je ovdje taksi?'); await A.m('Gleich da vorn, an der Straße. Oder Sie warten, bis einer kommt.');
  await Ln.say('Sie können Deutsch? Voll gut.'); await A.m('Ich bin Übersetzer. Marko.'); G.flags['met.lena']=true;
  await Dv.say('Davor Zelenika. Das ist Lena.'); G.flags['met.davor']=true; await Ln.say('Hi.');
  await A.wait(500); await Dv.say('Wir sind wegen des Hauses meines Vaters hier. Er ist letztes Jahr gestorben. Ich war nicht beim Begräbnis. Der Bus war zu spät.'); await A.wait(700);
  await Dv.say('Die Nachbarin hat den Schlüssel. Jela. Sie spricht so, wie mein Vater gesprochen hat. Schnell, und nur Dialekt. Ich verstehe die Hälfte, und die Hälfte, die ich verstehe, ist ein Vorwurf.');
  await Ln.say('Papa versteht sie nicht. Und ich verstehe gar nichts. Voll komisch hier. Aber schön komisch.');
  await Dv.say('Herr … Marko. Hätten Sie eine Stunde? Ich bezahle Sie. Als Übersetzer.');
  var c=await A.choose([{t:'Ich komme mit.',id:'yes'},{t:'Heute habe ich zu tun.',id:'no'}],{title:'Davor'});
  if (c==='yes'){ await Dv.say('Danke.'); await Ln.say('Cool.'); await Dv.say('Haus Zelenika, am Südrand. Fragen Sie nach den Feigen, das kennt jeder. Wir fahren voraus.'); A.setFlag('k3.b.helper'); }
  else { await Ln.say('Bitte. Sie ist so … laut.'); await A.wait(500); await Dv.say('Falls Sie es sich überlegen: Haus Zelenika, am Südrand. Bei den Feigen. Jeder kennt es.'); }
  A.unlock('zelenika');
  await A.narrate('Ein Taxi hält. Davor wuchtet einen Koffer hinein, Lena steigt hinten ein und sieht durch das Fenster zum Café hinüber, zum Fenstertisch. Dann fahren sie.');
  Dv.hide(); Ln.hide(); A.setFlag('k3.b.westLeft');
  if (G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Sie hat zu ihm hingesehen. Zum Fenster.'); await A.m('Sie sieht ihn nicht.'); await A.g('Nein. Aber sie hat hingesehen.'); }
  A.music('k3_istraga'); await M.k3DayCheck(A); }
// ---------------------------------------------------------------- Davor und Lena am Bus (nur während der Ankunft)
async function talkDavor(A){ await A.npc('davor').say('Haus Zelenika, am Südrand. Bei den Feigen.'); }
async function talkLena(A){ await A.npc('lena').say(A.cycle('lnW',['Papa sagt, hier riecht alles nach früher. Ich weiß gar nicht, wie früher riecht.','Ist das da drin ein Café? Mit Fernseher? Voll retro.'])); }
async function timetable(A){ await A.doc({style:'register',title:'POLASCI · DOLASCI',lines:['Split ············ 7:00 · 11:30 · 16:00','Zagreb ··········· 8:15','Dubrovnik ········ 9:30','Sarajevo ········· 13:45','','München (subota) · dolazak 6:00','   (darunter mit Kugelschreiber: „kasni“)']});
  if (A.first('wbTime')) await A.m('Ankunft aus München, samstags um sechs. Darunter hat jemand mit Kugelschreiber geschrieben: „kasni“. Verspätet.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},look:'Die Straße hinaus, Richtung Bulevar.',g:{look:'Hier fahren Busse in alle Richtungen. Nur nicht dahin, wo ich hinwill.'}},
 {id:'cafe_door',name:'Café „Zdravko“',exit:{to:'kafic'},look:'Die Glastür des Cafés, ein Schild darüber: „ZDRAVKO“. Drinnen Licht und ein Fernseher.',
   g:{look:function(A){ var G=A.G; if (A.isFound('mate') && (G.phase==='k3_d1'||G.phase==='k3_d2')) return A.g('Drinnen sitzt Mate. Er sieht hinaus.'); if (G.phase==='k3_d1'||G.phase==='k3_d2') return A.g('Da drin sitzt einer am Fenster, der nicht dahin gehört. Nicht mehr.'); return A.g('Drinnen ist es warm.'); }}},
 {id:'cafe_window',name:'Caféfenster',look:function(A){ var G=A.G; if (A.isFound('mate') && (G.phase==='k3_d1'||G.phase==='k3_d2')) return A.m('Durch das große Fenster sehe ich Mate am Fenstertisch sitzen, den Hut auf, die Thermoskanne vor sich. Er sieht zu den Bussen. Er sieht durch mich hindurch.');
     return A.m('Das große Fenster von Zdravkos Café. Dahinter Resopaltische, eine Theke, ein Fernseher. Am Fenstertisch eine umgedrehte Tasse.'); },
   g:{look:function(A){ return A.g((A.G.phase==='k3_d1'||A.G.phase==='k3_d2')?'Er sieht durch dich durch, zu den Bussen. Er sieht durch alle durch.':'Der Fensterplatz ist leer.'); }}},
 {id:'bus',name:'Bus aus München',vis:function(S){ return !!S.munich; },look:'Ein Reisebus, weiß und blau, mit Münchner Kennzeichen. „MÜNCHEN – MOSTAR“. Die Gepäckklappe steht offen wie ein Maul. Der Fahrer raucht neben dem Hinterrad.',
   use:'Ich fahre nicht nach München. Noch nicht.',
   g:{look:'Er ist die ganze Nacht gefahren. Busse sind müde, wenn sie ankommen. Das sieht man an den Scheiben.'}},
 {id:'davor',npc:'davor',name:'Davor',hgt:46,vis:function(S,G){ return zelHere(G); },talk:talkDavor,look:'Ein Mann um die fünfzig im beigen Trenchcoat, grauer Kinnbart, Brille. Er sieht aus, als wäre er die ganze Nacht wach gewesen. Er war die ganze Nacht wach.',
   g:{look:'Er ist müde. Und er verteidigt sich schon, bevor jemand etwas sagt.'}},
 {id:'lena',npc:'lena',name:'Lena',hgt:44,vis:function(S,G){ return zelHere(G); },talk:talkLena,look:'Ein Mädchen von vierzehn, pinker Anorak, Kopfhörer um den Hals, das Handy in der Hand. Sie sieht sich um, als wäre das alles ein Film, den keiner erklärt.',
   g:{look:'Sie ist neugierig. Sie tut so, als wäre sie es nicht.'}},
 {id:'platform',name:'Bussteig',look:'Bussteig drei. Ein Ölfleck in Form einer Landkarte, ein Kaugummiautomat, der seit Jahren leer ist.',
   g:{look:'Hier hat einer jeden Samstag gestanden. Die Platte ist ganz glatt, da, wo er stand.',sense:'Warten. Jahre aus Warten. Und jeden Samstag dieselbe Uhrzeit: sechs.'}},
 {id:'bench',name:'Bank',look:'Eine Bank unter dem Blechdach. Jemand hat einen Namen eingeritzt und wieder durchgestrichen.',use:'Ich setze mich kurz. Ein Bus nach Split fährt ab, ohne dass einer winkt.',
   g:{look:'Auf Bänken an Busbahnhöfen wartet man. Das kann ich.'}},
 {id:'timetable',name:'Fahrplan',look:'Ein Fahrplan im Glaskasten: „POLASCI · DOLASCI“, Abfahrten und Ankünfte.',read:function(A){ return timetable(A); },use:function(A){ return timetable(A); },
   g:{look:'Zahlen. Er liest sie dir vor. Er liest sowieso alles vor.'}}
];
M.room('westbus',{ name:'Westbusbahnhof', scape:'k3_westbus',
  entries:{ map:[34,126,'R'] },   // ein Stück vom linken Bildrand weg (dort hat die Kunst zwei leere Spalten, auf denen Malas Rand das Zeichnen stört)
  music:function(G){ return (sat(G)&&!F(G,'k3.b.westLeft'))?'k3_mate':'k3_istraga'; },
  state:function(G){ return {munich:false}; },
  actors:function(S,G){ var L=[]; S.munich=sat(G) && !F(G,'k3.b.busLeft');
    if (sat(G) && !F(G,'k3.b.westLeft')){ var d=M.apos('westbus','davor',[266,121,'L']), l=M.apos('westbus','lena',[288,123,'L']), hid=!F(G,'k3.b.arrived');
      L.push({id:'davor',ch:'davor',x:d[0],y:d[1],f:d[2]||'L',name:'Davor',speechY:46,visible:!hid});
      L.push({id:'lena',ch:'lena',x:l[0],y:l[1],f:l[2]||'L',name:'Lena',idle:'phone',speechY:44,visible:!hid}); }
    return L; },
  hotspots:HS,
  leave:async function(A,to){ if (A.G.phase==='k3_d2' && A.flag('k3.b.arrived') && to!=='kafic') A.setFlag('k3.b.busLeft'); },
  enter:async function(A,from){ var G=A.G;
    if (sat(G) && !F(G,'k3.b.arrived')){ await busArrives(A); return; }
    if (from==='kafic') return;
    if (G.phase==='k3_d1' && A.first('wbD1')){ await A.narrate('Der Westbusbahnhof. Ein Blechdach auf Stahlstützen, drei Bussteige, eine Anzeige, die halb funktioniert. Links ein Café mit großem Fenster: „ZDRAVKO“.');
      if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Im Café am Fenster sitzt einer, der nicht dahin gehört. Nicht mehr.'); } return; }
    if (G.phase==='k3_d3' && A.first('wbD3')){ await A.m('Sonntag. Kein Bus aus München. Nur einer nach Split, der gleich fährt.'); } }
});
})(M);
