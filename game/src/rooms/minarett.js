/* ===== rooms/minarett.js — Oben auf dem Minarett: der enge Umgang, die Dächer, die Landmarken, die zweite Peilung ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
function railSpot(){ var r=M.stand('minarett','rail')||[176,126,'B']; return [r[0]+18,r[1]-2]; }
async function peil2(A){ var G=A.G;
  if (inP(G,['k3_epi','k3_epi_d'])) return A.m('Von hier habe ich die zweite Linie gezogen. Sie lag fast auf der ersten.');
  var st=M.stand('minarett','view')||[150,122,'B']; await A.walk(st[0],st[1]); await A.face('B');
  if (A.malaHere()){ var r=railSpot(); await A.walkG(r[0],r[1]); A.faceG('B'); }
  var was=!!G.flags['k3.peil.minaret'], ok=await M.k3Peil(A,'minaret');
  if (ok && !was && G.malaOn){ await A.wait(400); await A.g('Ist das schlecht?'); await A.m('Es ist ungenau. Zwei Linien von fast derselben Stelle.'); await A.g('Du bist nie ungenau.'); await A.m('Ich nicht. Die Linien.'); } }
var HS=[
 {id:'stairs',name:'Treppe',exit:{to:'koski'},look:'Die kleine Spitzbogentür zur Wendeltreppe. Unten ist es dunkel und riecht nach Stein und Tauben.',
   g:{look:'Da geht es hinunter. Für dich.'}},
 {id:'rail',name:'Brüstung',look:'Die Brüstung aus durchbrochenem Stein, gerade hoch genug, dass man sich an ihr festhält, und gerade niedrig genug, dass man es tut.',
   use:async function(A){ await A.m('Ich halte mich fest. Die Bura zieht an meiner Jacke, als wollte sie mich mitnehmen.'); if (A.G.malaOn && A.first('gRail')) await A.g('Mich nimmt sie nicht mit. Mich nimmt nichts mit. Das ist das Gute.'); },
   g:{look:'Ich lehne mich hinaus. Ich kann nicht fallen. Das ist das Einzige, was ich hier oben besser kann als du.'}},
 {id:'view',name:'Aussicht',look:function(A){ var G=A.G; if (G.phase==='k3_d1') return A.m('Die Stadt von oben, in einer Luft, die die Bura geputzt hat. Unten die grauen Steindächer, die Brücke wie ein Spielzeug, der Fluss nach Süden aus der Stadt hinaus. Drüben ein Glockenturm, zwei gelbe Kräne, links das Hochhaus, dahinter der kahle Velež.');
     return A.m('Die Stadt von oben: Dächer, die Brücke, der Fluss nach Süden. Drüben der Glockenturm und die Kräne. So weit man sieht, ist nirgends ein Ende.'); },
   use:peil2,
   g:{look:async function(A){ if (!A.flag('k3.peil.minaret') && inP(A.G,['k3_d1','k3_d2','k3_d3'])){ await A.g('Von hier oben sieht alles kleiner aus. Die Leine nicht.'); if (A.G.pos.marko.room==='minarett') await A.g('Zeichne. Ich sage dir, wo sie entlanggeht.'); return; } return A.g('So viele Dächer. Unter jedem hat jemand gewartet. Auf irgendwas.'); }}},
 {id:'tower_l',name:'Glockenturm',look:'Drüben am Westufer ein Glockenturm, schlank und hell, höher als alles um ihn herum. Eine gute Landmarke. Man verliert ihn nicht aus den Augen.',
   g:{look:'Glocken.',listen:async function(A){ await A.g('Er ist still. Noch.'); await A.wait(400); await A.g('Ich warte immer, dass er anfängt. Ich mag es nicht, wenn sie anfangen.'); }}},
 {id:'cranes',name:'Baukräne',look:'Zwei gelbe Baukräne am Westufer, einer in der Mitte, einer weiter rechts. Die Stadt baut. Die Kräne stehen still, wegen der Bura, und zeigen in zwei Richtungen.',
   g:{look:'Zwei Kräne. Wie zwei Leute, die sich nicht einigen können, wohin.'}}
];
M.room('minarett',{ name:'Minarett', scape:'k3_minarett',
  music:function(G){ return (G.phase==='k3_epi'||G.phase==='k3_epi_d')?'k3_epi':'k3_mostar'; },
  state:function(G){ return {}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G; if (A.isMala()){ if (A.first('gMinTop')){ await A.g('Oben. Ohne eine einzige Stufe.'); await A.wait(400); await A.g('Er braucht lange. Er zählt bestimmt.'); } return; }
    A.sfx('windGust');
    if (A.flag('k3.koski.malaUp')){ A.setFlag('k3.koski.malaUp',false); if (A.malaHere()){ var r=railSpot(); A.placeG(r[0],r[1],'L'); }
      if (A.first('mnClimb')){ await A.narrate('Die Wendeltreppe ist so eng, dass meine Schultern beide Wände berühren. Ich zähle. Bei neunundachtzig höre ich auf, weil oben Licht ist.'); }
      if (A.malaHere()){ await A.wait(300); await A.g(A.first('mnSlow')?'Du bist langsam.':'Da bist du ja.'); if (A.first('mnSlow2')){ await A.m('Neunundachtzig Stufen.'); await A.g('Ich habe keine gezählt.'); } } }
    else if (A.first('mnClimb')){ await A.narrate('Die Wendeltreppe ist so eng, dass meine Schultern beide Wände berühren. Ich zähle. Bei neunundachtzig höre ich auf, weil oben Licht ist.'); }
    if (G.phase==='k3_d1' && A.first('mnBura')){ await A.m('Oben pfeift die Bura um den Umgang. Man sieht bis zu den Bergen im Süden.'); } }
});
})(M);
