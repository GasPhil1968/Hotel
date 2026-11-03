/* ===== rooms/ostava.js — die Kammer hinter der Kafana: der Spiegel, Halids Versteck ===== */
(function(M){
'use strict';
var P=M.P;
async function pry(A){ var S=A.S; if (S.tinTaken) return A.m('Der Hohlraum ist leer. Neununddreißig Jahre Staub und ein Mäusenest.');
  if (!S.lit){ await A.m('Im Dunkeln stochere ich nicht in fremden Spiegeln herum.'); return; }
  if (!A.has('chisel')){ await A.m('Die untere Leiste sitzt locker. Mit den Fingern bekomme ich sie nicht ab. Ich bräuchte etwas Schmales, Festes.'); A.setFlag('k2.s1.needChisel'); return; }
  if (!S.frameOff){ await A.animM('kneelF'); A.sfx('creak'); A.set('frameOff',true); await A.m('Das Stemmeisen in die Fuge. Ein Knacken, dann gibt die Leiste nach. Dahinter ein Hohlraum.'); await A.wait(400); }
  await A.reach(); A.set('tinTaken',true); A.setFlag('k2.s1.tin'); A.give('letters_tz'); A.give('bracelet'); A.sfx('tin');
  await A.m('Eine verbeulte Blechkasse. Darin sechs Briefe mit slowenischen Marken und ein kleines Kästchen.'); await A.wait(500); await A.m('Im Kästchen ein Kupferarmband. „E. · 14. XI. 1972“.');
  if (A.G.malaOn){ await A.wait(600); await A.g('Er hat sie nie weggeworfen. Er hat sie nur versteckt.'); await A.m('Halid.'); await A.g('Vielleicht konnte er sie nicht wegwerfen. Das ist auch etwas.'); } A.save(); }
var HS=[
 {id:'door',name:'Tür',exit:{to:'kafana',gok:true},look:'Die Tür zurück in die Kafana. Durch den Vorhang fällt ein Streifen warmes Licht.'},
 {id:'mirror',name:'Spiegel',look:function(A){ return A.m(A.S.lit?'Ein großer, alter Spiegel in vergoldetem Rahmen, halb mit einem Tuch verhängt. Das Glas ist blind geworden. Ich sehe mich darin wie durch Nebel.':'Im Dunkeln ein großer Rahmen an der Wand. Ein Spiegel, der nichts mehr spiegelt.'); },
   take:'Er ist größer als ich und älter als die Kafana.',use:function(A){ return pry(A); },with:{ chisel:function(A){ return pry(A); } },
   g:{look:'Ich bin nicht darin. Aber dahinter ist etwas.'}},
 {id:'frame',name:'Rahmenleiste',look:function(A){ return A.m(A.S.frameOff?(A.S.tinTaken?'Die abgehebelte Leiste. Dahinter ein leerer Hohlraum.':'Dahinter ein Hohlraum mit einer Blechkasse.'):'Die untere Leiste des Rahmens sitzt locker. Jemand hat sie oft abgenommen und wieder angesetzt.'); },
   use:function(A){ return pry(A); },open:function(A){ return pry(A); },with:{ chisel:function(A){ return pry(A); } },reach:'floor',
   g:{look:function(A){ return A.g(A.S.tinTaken?'Leer.':'Da. Dahinter leuchtet es. Papier und Kupfer.'); },
     sense:async function(A){ if (A.S.tinTaken) return A.g('Jetzt ist da nur noch Staub.'); if (!A.hasNote('s1_gave')){ await A.g('Hinter dem Spiegel ist etwas. Es fühlt sich an wie ein Geheimnis, das jemand nicht mehr tragen wollte. Ich weiß nicht, was es ist.'); return; }
       await A.memory({title:'Nachhall – hinter dem Spiegel',tint:'ghost',draw:M.mem&&M.mem.k2_halid,lines:['Ein Winterabend, 1973. Ein Mann mit Schnurrbart und Weste kniet vor dem Spiegel.','Er hebt die Leiste ab und schiebt eine Blechkasse in den Hohlraum. Darin ein Kästchen und Briefe, ein ganzer Stapel.','Er bleibt lange so knien. Dann setzt er die Leiste wieder ein.']}); A.note('s1_hidden'); }}},
 {id:'shelves',name:'Regale',look:'Regale mit Kaffeesäcken, Gläsern voller Zucker und Lokum, Kisten mit Servietten. Alles beschriftet, in Eminas strenger Schrift.',g:{look:'Sie hat alles beschriftet. Nur das hinter dem Spiegel nicht.'}},
 {id:'sacks',name:'Kaffeesäcke',look:'Jutesäcke mit grünen Bohnen aus Brasilien. „Für Halid, 1985“ steht noch mit Kreide auf einem Balken darüber.',g:{look:'Kaffee riecht nach Zuhause. Für alle hier.'}},
 {id:'crates',name:'Kisten',look:'Kisten mit leeren Bierflaschen, „Sarajevsko“, die Etiketten feucht und schief.',g:{look:'Pfand. Im Krieg war Pfand mehr wert als Geld.'}},
 {id:'furniture',name:'Möbel',look:'Alte Stühle unter Tüchern, ein Tisch mit drei Beinen, ein Grammofon ohne Trichter.',g:{look:'Hier hat Halid getanzt. Mit seiner Frau. Lange vor allem.'}},
 {id:'window',name:'Fensterchen',look:'Ein Fensterchen hoch oben, so groß wie ein Buch. Graues Licht und das Gurren einer Taube.',g:{look:'Draußen die Kula. Man sieht hier nur ihren Schatten.'}},
 {id:'bulb',name:'Glühbirne',look:function(A){ return A.m(A.S.lit?'Eine nackte Glühbirne. Sie brennt gelb und ein bisschen unruhig.':'Eine Glühbirne am Kabel. Aus.'); },
   use:async function(A){ A.set('lit',!A.S.lit); A.sfx('click'); await A.m(A.S.lit?'Licht. Staub tanzt darin.':'Dunkel.'); },push:async function(A){ A.set('lit',!A.S.lit); A.sfx('click'); },
   g:{look:'Ich brauche kein Licht. Er schon.'}}
];
M.room('ostava',{ name:'Kammer', scape:'k2_ostava', music:'k2_istraga',
  state:function(G){ return {lit:false,frameOff:false,tinTaken:false}; },
  dark:function(S,G){ return !S.lit; }, darkLights:function(S){ var sp=M.spot('ostava','window'); return sp[2]?[[sp[0]+(sp[2]>>1),sp[1]+sp[3],40,0.7]]:[]; },
  hotspots:HS,
  enter:async function(A,from){ if (A.isMala() && A.first('k2osG')){ await A.g('Dunkel. Staub. Und da hinten, hinter dem Spiegel, ein Licht, das kein Licht ist.'); }
    if (!A.isMala() && A.first('k2osM')){ if (!A.S.lit){ A.set('lit',true); A.sfx('click'); } await A.m('Die Kammer. Lejla hat das Licht angemacht. Säcke, Kisten, Möbel unter Tüchern. Und ein Spiegel, so groß wie eine Tür.'); } }
});
})(M);
