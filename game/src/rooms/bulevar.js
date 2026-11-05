/* ===== rooms/bulevar.js — Der Bulevar: die frühere Frontlinie. Ein stiller Ort; Mala wird still, nichts wird erklärt, keine Seiten.
   Von hier biegt die Seitengasse zum Vulkanizer ab. ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function bura(G){ return G.phase==='k3_d1'; }
var HS=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},look:'Die Straße zurück, zur Brücke und zum Plan.',g:{look:'Zurück. Ja.'}},
 {id:'to_vulk',name:'Seitengasse',exit:{to:'vulkanizer'},
   look:function(A){ return A.m(M.k3KnowsVlado&&M.k3KnowsVlado(A.G)?'Die Seitengasse rechts, mit dem Schild „VULKANIZER RAJIĆ →“. Davor ein Stapel Altreifen. Da hinten ist Vlado.':'Eine Seitengasse rechts, mit einem Schild: „VULKANIZER RAJIĆ →“. Davor ein Stapel Altreifen.'); },
   canExit:async function(A){ if (M.k3KnowsVlado && !M.k3KnowsVlado(A.G)){ await A.m(A.hasNote('v3_ljerka')?'Ein Reifendienst. Ljerka hat einen Vlado genannt, einen Raucher. Aber hier steht Rajić, und ich weiß nicht, ob das derselbe ist.':'Ein Reifendienst. Ich brauche keine Reifen. Und ich kenne da niemanden.'); return false; } return true; },
   g:{look:function(A){ return A.g(A.flag('k3.v.cab')?'Da hinten steht unser Lastwagen. Ich weiß es, ohne hinzusehen.':'Da hinten riecht es nach Gummi. Und nach Diesel.'); }}},
 {id:'gymnasium',name:'Gymnasium',look:'Das alte Gymnasium. Ocker und Gelb in Streifen, Bögen wie aus einem Bilderbuch. Sie haben es wieder aufgebaut, Stein für Stein, und es sieht aus, als wäre nie etwas gewesen. Fast.',
   use:'Sonntags ist es zu. Und an den anderen Tagen bin ich zu alt dafür.',
   g:{look:'Drinnen sind Kinder. Ich höre sie, wenn ich will. Ich will nicht.',listen:'Eine Lehrerin diktiert. In der letzten Reihe lacht einer. Wie überall.'}},
 {id:'bank_ruin',name:'Hochhaus',look:'Ein Hochhaus aus Beton und Glas, oder das, was davon übrig ist: das Gerippe. Das Glas ist fort. Der Wind geht durch die Stockwerke, und im fünften wächst ein Bäumchen.',
   use:'Unten ist ein Bauzaun aus Blech. Ich gehe nicht hinein.',
   g:{look:async function(A){ await A.g('…'); await A.wait(1200); await A.narrate('Mala sieht hinauf und sagt nichts.'); },sense:'Nein. Hier nicht.'}},
 {id:'bench',name:'Bank',look:'Eine Bank am Gehweg, frisch gestrichen. Niemand sitzt darauf.',
   use:async function(A){ if (A.first('buBench')){ await A.m('Ich setze mich. Autos fahren vorbei, zwei Spuren hin, zwei zurück. Eine Frau mit Einkaufstüten, ein Hund, ein Bus.'); await A.wait(900); await A.m('Ganz gewöhnlich. Ich weiß nicht, warum mir das schwerfällt.'); if (A.G.malaOn && A.malaHere()){ await A.wait(700); await A.g('…'); } return; } await A.m('Ich bleibe nicht sitzen. Hier sitzt man nicht lange.'); },
   g:{look:'Ich setze mich neben dich. Du merkst es nicht. Doch, du merkst es.'}},
 {id:'holes',name:'Hauswand',look:'Ein altes Haus mit Löchern in der Wand, in Reihen, wie Stiche. Jemand hat ein paar mit Mörtel gefüllt. Die anderen nicht.',
   use:'Ich lege die Hand nicht in die Löcher. Das haben andere getan.',take:'Da ist nichts zu nehmen.',
   g:{look:async function(A){ await A.g('…'); },sense:'Nein.'}},
 {id:'sign',name:'Schild',look:'„VULKANIZER RAJIĆ →“, Blech, mit der Hand gemalt. Darunter eine Telefonnummer, so alt, dass sie nur sechs Ziffern hat.',
   read:'„VULKANIZER RAJIĆ →“. Und kleiner: „0–24h“. Rund um die Uhr. Das hat jemand später durchgestrichen und „7–19“ darübergeschrieben.',
   g:{look:'Rajić.'}}
];
M.room('bulevar',{ name:'Bulevar', scape:'k3_bulevar', music:'',
  state:function(G){ return {}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (from==='vulkanizer') return;
    if (A.first('buFirst')){ await A.narrate(bura(G)?'Der Bulevar. Breit, mit Platanen und einem Mittelstreifen. Die Bura treibt das Laub über alle vier Spuren.':'Der Bulevar. Breit, mit Platanen und einem Mittelstreifen. Autos, eine Frau mit Einkaufstüten, ein Hund an der Leine.');
      if (G.malaOn && A.malaHere()){ await A.wait(700); await A.m('Mala?'); await A.wait(900); await A.g('…'); await A.wait(800); await A.narrate('Sie geht langsamer als sonst. Sie sieht auf den Asphalt, mitten auf die Straße, und sagt nichts.'); }
      if (M.k3KnowsVlado && M.k3KnowsVlado(G)){ await A.wait(500); await A.m('Vulkanizer Rajić, hinter dem Bulevar. Rechts geht eine Gasse ab, mit einem Schild.'); }
      return; }
    if (M.k3KnowsVlado && M.k3KnowsVlado(G) && A.first('buVlado')){ await A.m('Rechts die Seitengasse. Der Vulkanizer.'); return; }
    if (G.malaOn && A.malaHere() && A.first('buAgain')){ await A.wait(400); await A.narrate('Mala geht wieder langsamer. Ich warte, bis sie neben mir ist.'); } }
});
})(M);
