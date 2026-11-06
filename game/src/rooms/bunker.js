/* ===== rooms/bunker.js — Bunker unter Gleis 11, die alte Weiterleitungsstelle. Nur Mala kommt hierher (durch die Luke, gexit).
   Am Tisch der Nachhall von 1962: ein Beamter mit Stempel, ein junger Mann mit Pappkoffer, „Giuseppe? Das schreibt keiner. Josef.“
   (s4_bunker, Mala). In einer Ecke Theaterkram: Heute spielt man hier Stücke über die, die ankamen. ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
// der Nachhall am Tisch
async function desk(A){ var G=A.G;
  if (F(G,'k4.s.bunker')) return A.g(A.cycle('bkDesk',['Der Tisch. Der Stempel. „Ein G reicht.“ Ich höre es immer noch, wenn ich hinsehe.','Hier hat einer seinen Namen abgegeben wie einen Mantel an der Garderobe. Und nie wieder abgeholt.']));
  A.music('k4_duh'); await A.g('Hier.'); await A.wait(600);
  await A.memory({title:'Nachhall – Unter Gleis 11',tint:'ghost',draw:M.mem&&M.mem.k4_bunker,lines:[
    'Ein Gang unter der Erde, voll mit jungen Männern. Pappkoffer, Mäntel, die zu dünn sind für März. Es riecht nach Zug und nach Angst.',
    'Am Tisch ein Beamter mit Stempel. Vor ihm ein Junge mit Schnurrbart und einem Koffer, der mit Schnur zugebunden ist.',
    'Der Beamte: „Name?“ Der Junge sagt etwas. Es klingt wie Musik.',
    'Der Beamte: „Giuseppe? Das schreibt keiner. Josef.“',
    'Er schreibt. „Und Rugiero. Ein G reicht.“',
    'Der Junge nickt. „Sì, sì. Josef.“ Der Stempel fällt. „Der Nächste.“']});
  A.note('s4_bunker'); A.setFlag('k4.s.bunker');
  await A.wait(500); await A.g('Er hat ja gesagt. Zu einem Namen, der nicht seiner war.');
  await A.wait(400); await A.g('Den Namen, den er gesagt hat, habe ich nicht verstanden. Nur den, den sie ihm gegeben haben.');
  if (N(G,'s4_peppino')){ await A.wait(400); await A.g('Er hatte einen Schnurrbart. Und einen sehr geraden Rücken.'); }
  A.music('k4_bahnhof'); }
var HS=[
 {id:'up',name:'Nach oben',gexit:{to:'gleis11'},look:'Eine Treppe nach oben, zur Luke.',g:{look:'Oben ist der Bahnsteig. Oben ist Marko, oder auch nicht.'}},
 {id:'desk',name:'Tisch',look:'Ein alter Tisch mit einem Stuhl.',g:{look:function(A){ return A.flag('k4.s.bunker')?desk(A):A.g('Ein alter Tisch, ein Stuhl. Um den Tisch herum ist es laut, obwohl keiner redet.'); },sense:function(A){ return desk(A); },listen:function(A){ return A.flag('k4.s.bunker')?A.g('Nur noch der Stempel. Ganz leise.'):desk(A); }}},
 {id:'signs',name:'Schilder',look:'Verblasste Schilder.',g:{look:'„WEITERLEITUNGSSTELLE“. „WARTERAUM“. Pfeile, die in alle Richtungen zeigen, nur nicht nach Hause.',sense:'Die Pfeile hat einer gemalt, der nie selbst hier warten musste.'}},
 {id:'benches',name:'Holzbänke',look:'Holzbänke an der Wand.',g:{look:'Auf diesen Bänken haben sie gewartet. Die Bretter sind glatt gesessen, an manchen Stellen fast durch.',sense:'Viele, die gleichzeitig still sind. Und einer, der leise singt, bis ein anderer ihn anstößt.',listen:'Ein Akkordeon. Nein. Nur ein Lüftungsrohr, das so tut.'}},
 {id:'props',name:'Theaterkram',look:'Scheinwerfer, Stühle, eine Kiste.',g:{look:'Scheinwerfer, Stühle, eine Kiste mit der Aufschrift „GLEIS 11“. Jemand spielt hier Theater. Über die, die hier angekommen sind.',sense:'Junge Leute, die so tun, als hätten sie einen Pappkoffer. Sie spielen es gut. Sie wissen nicht, wie schwer er war. Er war leicht.'}},
 {id:'pipes',name:'Lüftungsrohre',look:'Alte Lüftungsrohre.',g:{look:'Rohre, aus denen kalte Luft kommt. Oder die Erinnerung an kalte Luft.',listen:'Oben fährt ein Zug ein. Hier unten klingt er wie ein Tier, das schläft.'}}
];
M.room('bunker',{ name:'Bunker unter Gleis 11', scape:'k4_bunker', music:'k4_bahnhof', noFollow:true,
  state:function(G){ return {}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  enter:async function(A,from){
    if (A.G.active!=='mala') return;
    if (A.first('bkFirst')){ await A.g('Kalt.'); await A.wait(400); await A.g('Und laut. Obwohl keiner redet.'); await A.wait(300); await A.g('Hierher kommt er nicht. Marko. Hierher komme nur ich.'); } }
});
})(M);
