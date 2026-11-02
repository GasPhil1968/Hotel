/* ===== 91_case1.js — Fall 1 „Das Boot um sieben“: Brief lesen ===== */
(function(M){
'use strict';
var P=M.P, hash=M.hash, bayer=M.bayer;
// ---------------------------------------------------------------- Tonćis Brief
M.readToncisLetter=async function(A){
  if (A.hasNote('c1_letter')){ await A.doc({style:'letter',title:'Supetar, 21.12.1984',lines:['Draga mama,','ovo ti je zadnji put da me čekaš na hladnoći.','Kupio sam ti rukavice za hladne večeri na Rivi.','Ali nemoj me više čekati na moli.','Čekaj me doma, na toplom. Ja ću doći.','Tvoj Tonći']});
    return A.m('„Liebe Mama, das ist das letzte Mal, dass du in der Kälte auf mich wartest. Ich habe dir Handschuhe gekauft. Aber warte nicht mehr an der Mole. Warte zu Hause, im Warmen. Ich komme.“'); }
  await A.doc({style:'faded',title:'Supetar, 21.12.1984',lines:['Draga mama,','ovo … zadnji put … na hladnoći.','… rukavice … hladne večeri na Rivi.','… nemoj … više … na moli.','… doma, … toplom. …','Tvoj Tonći'],faded:[1,2,3,4]});
  await A.m('„Liebe Mama … das letzte Mal … in der Kälte … Handschuhe … kalte Abende auf der Riva … nicht mehr … an der Mole … zu Hause … warm …“');
  await A.m('Das Salz hat die Hälfte der Wörter gefressen. Die Hälfte, auf die es ankommt.');
  };
M.malaReadsLetter=async function(A){ if (A.hasNote('c1_letter')) return A.g('Ich habe ihn dir schon gelesen. Er hat ihn im Stehen geschrieben, an einem Kai, mit kalten Fingern.');
  await A.g('Halt ihn still.'); await A.animG('look'); A.sfx('shimmer');
  await A.memory({title:'Nachhall – Tonćis Brief',draw:M.mem.letter,tint:'ghost',lines:['Eine Hand schreibt, im Licht einer Kioskbirne in Supetar. Der Wind reißt am Papier.','„Ovo ti je zadnji put da me čekaš na hladnoći.“ – Das ist das letzte Mal, dass du in der Kälte auf mich wartest.','„Kupio sam ti rukavice … ali nemoj me više čekati na moli.“ – Ich habe dir Handschuhe gekauft … aber warte nicht mehr an der Mole auf mich.','„Čekaj me doma, na toplom. Ja ću doći.“ – Warte zu Hause, im Warmen. Ich komme.']});
  A.note('c1_letter'); await A.m('„…Warte zu Hause, im Warmen.“'); await A.wait(500); await A.g('Er hat beim Schreiben an sie gedacht. Darum ist es so deutlich.');
  await A.m('Und du? An wen denkst du?'); await A.wait(1200); await A.g('…'); };
// Erinnerungsbilder: siehe 93_mem.js
})(M);
