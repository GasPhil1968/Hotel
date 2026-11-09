/* ===== 12_k5_items.js — Kapitel 5: Gegenstände (Icons max. 32×24). Aus Kapitel 4 kommen dzezva, mobitel, photo_full, pantoffeln, dose_voll. ===== */
(function(M){
'use strict';
var P=M.P;
function paper(w,x,y,ww,hh,c,lines){ w.rect(x,y,ww,hh,c||P.s5); w.hl(x,x+ww-1,y,P.s6); w.vl(x+ww-1,y,y+hh-1,P.s3); for (var i=0;i<(lines||0);i++) w.hl(x+2,x+ww-4-((i*3)%5),y+3+i*2,P.s2); }
function canister(w,full){ w.rect(8,6,16,15,P.b2); w.rect(8,6,16,3,P.b3); w.vl(8,6,20,P.b3); w.vl(23,6,20,P.b0); w.hl(8,23,20,P.b0); w.rect(18,3,4,3,P.b1); w.hl(18,21,3,P.b3);
  w.rect(10,3,6,2,P.b1); w.hl(10,15,3,P.b2); w.hl(10,22,12,P.r3); w.hl(11,21,13,P.r2); w.px(9,12,P.r3);
  if (full){ w.hl(9,22,15,P.b4); w.px(12,16,P.b5); w.px(17,17,P.b5); } }
M.defineItems({
  kanister:{name:'Blauer Kanister',icon:function(w){ canister(w,false); },
    look:'Ein blauer Plastikkanister, zwanzig Liter. Mit roter Farbe, schief: VUKOVIĆ. Papa hat das draufgeschrieben, damit ihn keiner mitnimmt. Als ob einer einen Kanister mitnimmt, auf dem ein Name steht.',
    mala:'Er riecht noch nach Keller. Und ganz innen nach Wasser.'},
  kanister_voll:{name:'Kanister mit Wasser',icon:function(w){ canister(w,true); },
    look:'Der blaue Kanister, voll mit Wasser vom Hahn an der Brauerei. Zwanzig Liter. So schwer wie damals. Ich bin größer geworden, er nicht.',
    mala:'…'},
  liste:{name:'Hamdijas Liste',icon:function(w){ paper(w,6,3,20,19,P.s4,6); w.hl(8,22,5,P.b1); w.px(22,18,P.r2); w.vl(6,3,21,P.s2); },
    look:'Ein Blatt aus einem Lieferbuch der Brauerei, oben gedruckt „OTPREMNICA“. Darunter in Bleistift sieben Zeilen, je ein Mensch und ein Ding in der Tasche. Es war neunzehn Jahre in einem Einmachglas.',
    read:function(A){ return A.doc(M.K5_DOCS.liste); }, mala:'Er hat gezählt, statt zu weinen. Er schämt sich dafür. Er muss nicht.'},
  dose_lana:{name:'Malas Dose',icon:function(w){ w.rect(7,9,18,11,P.m3); w.hl(7,24,9,P.m4); w.rect(6,7,20,3,P.m4); w.hl(6,25,7,P.s6); w.hl(8,23,19,P.m1); w.px(20,8,P.m2); w.rect(11,12,9,4,P.y3); w.hl(12,18,13,P.y4); w.px(17,14,P.k1); },
    look:'Malas Blechdose, mit einer Delle im Deckel. Sie ist leicht. Darin zwei vergilbte Fahrscheine der Linie 3, mit einem sternförmigen Loch. Auf einem steht mit Bleistift: „Za prvu trojku poslije rata. 12.11.93“. Für die erste Drei nach dem Krieg.',
    mala:'Sie war nie schwer. Nur festgehalten.'}
});
M.K5_DOCS=M.K5_DOCS||{};
M.K5_DOCS.liste={style:'faded',title:'OTPREMNICA · Pivara · 19./20. 4. 1993',lines:['Ukopani uz zid, ispod lipe. – Begraben an der Mauer, unter der Linde.','1. Žena, oko 60, crveni šal. Ključ na koncu. – Frau, etwa 60, roter Schal. Schlüssel an einer Schnur.',
  '2. Muškarac, oko 30, plava kapa. Sat bez stakla. – Mann, etwa 30, blaue Mütze. Uhr ohne Glas.','3. Muškarac, oko 40, plava jakna. Šiber „Z. V.“ u džepu. Sin (~13) nosio vodu kući.','   – Mann, etwa 40, blaue Jacke. Rechenschieber „Z. V.“ in der Tasche. Der Sohn hat das Wasser nach Hause getragen.',
  '4. Djevojka, oko 17, zelena vesta. Češalj. – Mädchen, etwa 17, grüne Weste. Ein Kamm.','5. Starac, štap. Lula u džepu. – Alter Mann, Stock. Eine Pfeife in der Tasche.','6. Žena, oko 35, kecelja. Ključevi. – Frau, etwa 35, Schürze. Schlüssel.',
  '7. Muškarac, oko 50, sivi kaput. Naočale u futroli. – Mann, etwa 50, grauer Mantel. Eine Brille im Etui.','Popisao: H. S., punionica. – Aufgeschrieben: H. S., Abfüllung.']};
})(M);
