/* ===== 91_case1.js — Fall 1 „Das Boot um sieben“: Brief lesen ===== */
(function(M){
'use strict';
var P=M.P, hash=M.hash, bayer=M.bayer;
// ---------------------------------------------------------------- Tonćis Brief
M.readToncisLetter=async function(A){
  if (!A.flag('c1.letterOpen')){ A.note('c1_stuck'); return A.m(A.cycle('stuck',['Die Seiten kleben zusammen. Das Salz hat sie verbacken. Wenn ich ziehe, reißt er.','Trocken bekomme ich ihn nicht auf. Nicht, ohne ihn zu zerreißen.'])); }
  if (A.hasNote('c1_letter')){ await A.doc({style:'letter',title:'Supetar, 21.12.1984',lines:['Draga mama,','ovo ti je zadnji put da me čekaš na hladnoći.','Kupio sam ti rukavice za hladne večeri na Rivi.','Ali nemoj me više čekati na moli.','Čekaj me doma, na toplom. Ja ću doći.','Tvoj Tonći']});
    return A.m('„Liebe Mama, das ist das letzte Mal, dass du in der Kälte auf mich wartest. Ich habe dir Handschuhe gekauft. Aber warte nicht mehr an der Mole. Warte zu Hause, im Warmen. Ich komme.“'); }
  await A.doc({style:'faded',title:'Supetar, 21.12.1984',lines:['Draga mama,','ovo … zadnji put … na hladnoći.','… rukavice … hladne večeri na Rivi.','… nemoj … više … na moli.','… doma, … toplom. …','Tvoj Tonći'],faded:[1,2,3,4]});
  await A.m('„Liebe Mama … das letzte Mal … in der Kälte … Handschuhe … kalte Abende auf der Riva … nicht mehr … an der Mole … zu Hause … warm …“');
  await A.m('Das Salz hat die Hälfte der Wörter gefressen. Die Hälfte, auf die es ankommt.');
  };
// den verbackenen Brief über Dampf öffnen (zu Hause mit der Džezva oder an Sanjas Espressomaschine)
M.steamLetter=async function(A,how){ A.setFlag('c1.letterOpen'); A.sfx('paper');
  if (how==='bar'){ var Sa=A.npc('sanja'); await Sa.say('Gib her.'); A.sfx('espresso'); await A.wait(1400); await Sa.say('Salz. Das kenne ich von den Fischern. Die bringen mir ihre Papiere auch, wenn sie baden gegangen sind.'); A.sfx('paper'); await Sa.say('Da. Ganz. Fast.'); }
  else await A.m('Ich halte den Brief in den Dampf. Langsam. Das Salz wird weich, die Seiten lassen voneinander los.');
  await A.m('Er geht auf, ohne zu reißen.'); return M.readToncisLetter(A); };
M.malaReadsLetter=async function(A){ if (!A.flag('c1.letterOpen')) return A.g('Er ist zu. Ich muss die Schrift sehen. Auch die, die nicht mehr da ist.');
  if (A.hasNote('c1_letter')) return A.g('Ich habe ihn dir schon gelesen. Er hat ihn im Stehen geschrieben, an einem Kai, mit kalten Fingern.');
  await A.g('Halt ihn still.'); await A.animG('look'); A.sfx('shimmer');
  await A.memory({title:'Nachhall – Tonćis Brief',draw:M.mem.letter,tint:'ghost',lines:['Eine Hand schreibt, im Licht einer Kioskbirne in Supetar. Der Wind reißt am Papier.','„Ovo ti je zadnji put da me čekaš na hladnoći.“ – Das ist das letzte Mal, dass du in der Kälte auf mich wartest.','„Kupio sam ti rukavice … ali nemoj me više čekati na moli.“ – Ich habe dir Handschuhe gekauft … aber warte nicht mehr an der Mole auf mich.','„Čekaj me doma, na toplom. Ja ću doći.“ – Warte zu Hause, im Warmen. Ich komme.']});
  A.note('c1_letter'); await A.m('„…Warte zu Hause, im Warmen.“'); await A.wait(500); await A.g('Er hat beim Schreiben an sie gedacht. Darum ist es so deutlich.');
  await A.m('Und du? An wen denkst du?'); await A.wait(1200); await A.g('…'); };
// Erinnerungsbilder: siehe 93_mem.js
})(M);
