/* ===== 91_case1.js — Fall 1 „Das Boot um sieben“: Brief lesen, Erinnerungsbilder, Ziele, gestufte Tipps ===== */
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
  if (A.malaHere() && A.first('!letterHint')) await A.g('Zeig ihn mir. Manchmal bleibt von einer Schrift mehr übrig als die Tinte.'); };
M.malaReadsLetter=async function(A){ if (A.hasNote('c1_letter')) return A.g('Ich habe ihn dir schon gelesen. Er hat ihn im Stehen geschrieben, an einem Kai, mit kalten Fingern.');
  await A.g('Halt ihn still.'); await A.animG('look'); A.sfx('shimmer');
  await A.memory({title:'Nachhall – Tonćis Brief',draw:M.mem.letter,tint:'ghost',lines:['Eine Hand schreibt, im Licht einer Kioskbirne in Supetar. Der Wind reißt am Papier.','„Ovo ti je zadnji put da me čekaš na hladnoći.“ – Das ist das letzte Mal, dass du in der Kälte auf mich wartest.','„Kupio sam ti rukavice … ali nemoj me više čekati na moli.“ – Ich habe dir Handschuhe gekauft … aber warte nicht mehr an der Mole auf mich.','„Čekaj me doma, na toplom. Ja ću doći.“ – Warte zu Hause, im Warmen. Ich komme.']});
  A.note('c1_letter'); await A.m('„…Warte zu Hause, im Warmen.“'); await A.wait(500); await A.g('Er hat beim Schreiben an sie gedacht. Darum ist es so deutlich.');
  await A.m('Und du? An wen denkst du?'); await A.wait(1200); await A.g('…'); };
// Erinnerungsbilder: siehe 93_mem.js
// ---------------------------------------------------------------- Ziele (erste passende Zeile gilt)
function has(GS,id){ return GS.notes.indexOf(id)>=0; } function inv(GS,id){ return GS.inv.indexOf(id)>=0; }
M.defineGoals([
  {when:function(G){ return G.phase==='pro' && !G.flags['pro.msg']; },t:'Den Anrufbeantworter abhören.'},
  {when:function(G){ return G.phase==='pro' && !G.flags['pro.coffee']; },t:'Erst einen Kaffee kochen. Dann nach Veli Varoš, zu Ivka Perićs Wohnung.'},
  {when:function(G){ return G.phase==='pro'; },t:'In Ivka Perićs Wohnung in Veli Varoš genug für einen Text finden. Die Nachbarin Zdenka hat den Schlüssel.'},
  {when:function(G){ return G.phase==='pro_eve'; },t:'Den Text über Ivka Perić schreiben. Dann schlafen.'},
  {when:function(G){ return G.phase==='pro_night'; },t:'…'},
  {when:function(G){ return G.phase==='c1' && !G.flags['c1.met']; },t:'Raus an die Luft. Zur Riva, bis ans Ende der Mole.'},
  {when:function(G){ return (G.phase==='c1'||G.phase==='c1_night') && !G.flags['c1.logRead']; },t:'Herausfinden, was mit dem Boot aus Supetar am 22. Dezember 1984 geschah.'},
  {when:function(G){ return (G.phase==='c1'||G.phase==='c1_night') && !G.flags['c1.dinkoTold']; },t:'Dinko Matić an der Matejuška zum Reden bringen. Er war in jener Nacht dabei.'},
  {when:function(G){ return (G.phase==='c1'||G.phase==='c1_night') && !has(G,'c1_letter'); },t:'Tonćis verwaschenen Brief ganz lesen.'},
  {when:function(G){ return (G.phase==='c1'||G.phase==='c1_night') && !has(G,'c1_came'); },t:'Verstehen, warum Tonći nicht auf der Fähre war.'},
  {when:function(G){ return (G.phase==='c1'||G.phase==='c1_night'); },t:'Ivka auf der Mole sagen, was geschah. In der richtigen Reihenfolge.'},
  {when:function(G){ return G.phase==='i1'; },t:'Ausruhen. Reden.'}
]);
// ---------------------------------------------------------------- gestufte Tipps
M.defineHints([
  {id:'p_msg',phase:['pro'],done:function(G){ return !!G.flags['pro.msg']; },t:['Das rote Blinken in der Ecke ist eine Nachricht.','Der Anrufbeantworter auf dem Nachttisch neben dem Bett.','Den Anrufbeantworter benutzen.']},
  {id:'p_coffee',phase:['pro'],done:function(G){ return !!G.flags['pro.coffee']; },t:['Ohne Kaffee gehe ich nicht los. Die Džezva steht auf dem Regal über der Kochnische.','Džezva nehmen, an der Spüle Wasser einfüllen.','Die Džezva mit Wasser auf den Herd: Džezva aus der Leiste auf den Herd ziehen.']},
  {id:'p_key',phase:['pro'],done:function(G){ return inv(G,'key_ivka')||!!G.flags['pro.visited']; },t:['In Veli Varoš sitzt Zdenka vor ihrer Tür. Sie hat den Schlüssel.','Sie gibt den Schlüssel nur jemandem, dem es um Ivka geht und nicht um Zeilen.','Frag nach dem Schlüssel und antworte: „Ein paar Zeilen, damit jemand weiß, dass sie gelebt hat.“']},
  {id:'p_items',phase:['pro'],done:function(G){ return (inv(G,'postcard')&&inv(G,'photo1'))||!!G.flags['pro.visited']; },t:['Ein Text braucht etwas Persönliches. Briefe, Fotos.','Der Schuhkarton auf dem Tisch und die Fotos auf der Kredenz.','Den Schuhkarton öffnen (Postkarte) und das Foto mit dem Boot nehmen.']},
  {id:'p_write',phase:['pro_eve'],done:function(G){ return !!G.flags['pro.article']; },t:['Vesna wartet auf den Text.','Am Laptop schreiben.','Den Laptop benutzen und einen ersten Satz wählen. Danach ins Bett.']},
  {id:'p_sleep',phase:['pro_eve'],when:function(G){ return !!G.flags['pro.article']; },done:function(G){ return G.phase!=='pro_eve'; },t:['Es ist spät.','Das Bett.','Das Bett benutzen.']},
  {id:'c_met',phase:['c1'],done:function(G){ return !!G.flags['c1.met']; },t:['Vesna hat recht: raus an die Luft.','Auf der Karte die Riva wählen.','Auf der Riva bis ans Ende der Mole gehen (ganz nach rechts).']},
  {id:'c_ask',phase:['c1','c1_night'],when:function(G){ return !!G.flags['c1.met']; },done:function(G){ return has(G,'c1_askoffice')||!!G.flags['c1.searched']; },t:['Ivka wartet auf ein Boot. Frag sie danach.','Rede mit Ivka über das Boot und den Tag.','Sag ihr, dass das Boot spät ist. Sie schickt dich ins Hafenbüro.']},
  {id:'c_mladen',phase:['c1','c1_night'],when:function(G){ return !!G.flags['c1.met']; },done:function(G){ return !!G.flags['c1.searched']; },t:['Das Hafenbüro liegt an der Riva.','Mladen braucht einen guten Grund und ein genaues Datum.','Sag ihm, es geht um einen Text über Ivka, und nenne den 22. Dezember (von der Postkarte).']},
  {id:'c_1948',phase:['c1','c1_night'],when:function(G){ return !!G.flags['c1.searched']; },done:function(G){ return has(G,'c1_1948'); },t:['Mladen findet den Band nicht. Mala kommt durch die Archivtür.','Wechsle zu Mala (unten links) und geh durch die Tür „Arhiva“.','Mala soll sich im Archiv den Ordner im Fach „1948“ ansehen.']},
  {id:'c_log',phase:['c1','c1_night'],when:function(G){ return has(G,'c1_1948'); },done:function(G){ return !!G.flags['c1.logRead']; },t:['Mala weiß, wo der Band steht. Mladen kann ihn holen.','Zurück zu Marko und mit Mladen reden.','Sag Mladen: „Schauen Sie mal im Regal bei 1948.“']},
  {id:'c_deduce',phase:['c1','c1_night'],when:function(G){ return has(G,'c1_ferry')&&has(G,'c1_boat7'); },done:function(G){ return has(G,'c1_came'); },t:['Er wollte um sieben kommen. Aber an dem Abend fuhr keine Fähre.','Im Notizbuch zwei Notizen verbinden.','Verbinde „Tonći wollte mit dem Boot um sieben kommen“ mit „Die Fähre fiel wegen der Bura aus“.']},
  {id:'c_dinko1',phase:['c1','c1_night'],when:function(G){ return !!G.flags['c1.logRead']; },done:function(G){ return has(G,'c1_brother')||!!G.flags['c1.dinkoTold']; },t:['Dinko flickt an der Matejuška Netze.','Zeig ihm etwas aus Tonćis Leben.','Gib Dinko das Foto von der ANKICA.']},
  {id:'c_shed',phase:['c1','c1_night'],when:function(G){ return has(G,'c1_brother')||!!G.flags['c1.logRead']; },done:function(G){ return has(G,'c1_words'); },t:['Dinko schweigt über die Nacht. Vielleicht verrät sein Schuppen mehr.','Mala kann durch die verschlossene Schuppentür gehen.','Als Mala im Schuppen den Seesack spüren.']},
  {id:'c_confess',phase:['c1','c1_night'],when:function(G){ return has(G,'c1_words'); },done:function(G){ return !!G.flags['c1.dinkoTold']; },t:['Mala weiß jetzt, was nur Dinko wissen kann.','Sag es ihm. Als Marko, im Gespräch.','Rede mit Dinko: „Ich weiß, was Tonći im Wasser gesagt hat.“']},
  {id:'c_letter',phase:['c1','c1_night'],when:function(G){ return inv(G,'letter_t'); },done:function(G){ return has(G,'c1_letter'); },t:['Der Brief ist verwaschen. Marko kann ihn nicht ganz lesen.','Mala sieht, was die Hand geschrieben hat.','Den Brief aus der Leiste auf Mala ziehen.']},
  {id:'c_finale',phase:['c1','c1_night'],when:function(G){ return has(G,'c1_letter')&&inv(G,'gloves')&&has(G,'c1_came'); },done:function(G){ return !!G.flags['c1.done']; },t:['Du weißt jetzt alles, was Ivka wissen muss.','Geh zu Ivka ans Ende der Mole und sag ihr, dass du ihr etwas sagen musst.','Erst die Fähre, dann die ANKICA, dann die Handschuhe, dann der Brief.']}
]);
})(M);
