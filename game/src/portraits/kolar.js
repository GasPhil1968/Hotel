/* ===== portraits/kolar.js — Frau Kolar (um 50), Vermisstenstelle in Mostar (Kapitel 3)
   Aufrecht, schmales, wachsames Gesicht mit hohen Wangenknochen und feinen Fältchen, gerade dunkle Brauen, ruhiger, direkter
   Blick, gerade Nase, Lippen mit gedecktem Rosé; kurzes silbergraues Haar mit Seitenscheitel, über der Stirn zur fernen Seite
   gestrichen, hinter das Ohr gelegt, kleine Perlenstecker. Die Lesebrille hängt an einer feinen Kette vor der Brust;
   dunkelblauer Blazer mit Revers über heller Bluse, Kugelschreiber in der Brusttasche. Genau und menschlich.
   Legende HEAD: a–e Haar (m1 m2 m3 m4 s5) · Ziffern Haut (1 p1, 2 p2, 3 p3, 4 p4, 5 p5, 6 l0) · q kühler Schatten (q3) · x y Brauen (m1 m2) ·
   w W Augenweiß · i j Iris · I Wimpern und Pupille · u Oberlippe · m Mundspalt · l Unterlippe · o Perle.
   Blazer, Bluse, Brille mit Kette und Stift werden in Code gemalt; Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................................................", // 5
 "........................bcdddccb........................", // 6
 ".....................bccddeddccccbb.....................", // 7
 "...................bccddeedddcccccbbb...................", // 8
 "..................bccddeedddcdcccccbbba.................", // 9
 ".................bccdcddeddddcdcccccbbba................", // 10
 "................abccdcddedddcdddcccccbbba...............", // 11
 "...............abbccdcdedcdcddddcdcccccbba..............", // 12
 "...............abbccdcddcdcb556dddccccbbba..............", // 13
 "...............abbcccdcdccb455665ddcccbbba..............", // 14
 "...............abbcccdccdcb45565555dccbbba..............", // 15
 "...............abbcccdcdcb34555655554dcbba..............", // 16
 "...............abbccdcdccb3455555555544cba..............", // 17
 "...............abbcccdccb345yxxxx455xxxy443.............", // 18
 "...............abbccdcccb345443344554334443.............", // 19
 "...............abbccb4553344IIIII454III443..............", // 20
 "...............abbccb4323344WwiIW454wiI443..............", // 21
 "...............abbcbb43133454Wji45544j4443..............", // 22
 "...............abbcbb422334554445544544443..............", // 23
 "...............abbcbb4323345665544444544443.............", // 24
 "...............abbcbb45333455655444444554443............", // 25
 "................abcbb443334455544444444565q3............", // 26
 "................abcbb.433344455444444345433.............", // 27
 ".................abbbb4o.33444444444332333..............", // 28
 "..................abbb33334445444444433443..............", // 29
 "...................abb2333444444444uuuu443..............", // 30
 "....................ab223344444443mmmmm343..............", // 31
 "......................22233444444444lll4443.............", // 32
 "......................2233334444455544443...............", // 33
 "......................2233333444455544433...............", // 34
 "......................223333333444444332................", // 35
 "......................22333332233333322.................", // 36
 "......................3444443333332.....................", // 37
 "......................34444433333322....................", // 38
 "......................34444433333322....................", // 39
 "......................34444433333322....................", // 40
 "......................34444433333322....................", // 41
 "......................34444433333322....................", // 42
 "......................34444433333322....................", // 43
 "......................34444433333322....................", // 44
 "......................34444433333322....................", // 45
 "......................34444433333322....................", // 46
];
var LEG={ a:P.m1, b:P.m2, c:P.m3, d:P.m4, e:P.s5, '1':P.p1, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, '6':P.l0, q:P.q3, x:P.m1, y:P.m2,
  w:P.s6, W:P.s5, i:P.c3, j:P.c2, I:P.h1, u:P.d3, m:P.p1, l:P.d4, o:P.l1 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Haar: kurze Strähnen vom Scheitel über die Stirn zur fernen Seite und hinten nach unten (nur auf Haarpixeln)
var HR=[P.m1,P.m2,P.m3,P.m4,P.s5];
var STR=[[P.s5,[[27,7],[31,8],[36,10],[40,14]]],[P.m2,[[26,9],[31,10],[36,12],[39,16]]],[P.m4,[[28,9],[33,11],[37,13]]],[P.m2,[[24,9],[20,13],[18,20]]],[P.m4,[[23,10],[21,15],[20,22]]],
  [P.m1,[[21,9],[17,14],[16,22]]],[P.m2,[[33,8],[38,10],[40,12]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], pts=s[1]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return HR.indexOf(o)>=0?c:o; }); }); }
// Blazer (dunkelblau): gerade, aufrechte Schultern
function back(b){
  b.poly([[1,64],[1.5,56],[4,50.5],[9,47],[15,44.5],[21,43.5],[35,43.5],[42,44.5],[47.5,47],[51.5,51],[53.5,56],[54,64]],P.n1);
  b.poly([[1,60],[1.5,56],[4,50.5],[9,47],[15,44.5],[18,44.1],[12,47.5],[7,51.5],[4,57]],P.n2);
  b.line(4,50,8,47,P.n3); b.line(9,46,14,44,P.n3);
  b.poly([[42,45.5],[47.5,47.5],[51.5,51.5],[53.5,57],[54,64],[45,64],[44,54]],P.n0);
  b.line(10,54,11,63,P.n0); b.line(45,49,46,56,P.n2);
}
function front(b){
  // Bluse im Ausschnitt, Kragen über dem Revers
  b.poly([[21.5,42.5],[25,44],[30,44.5],[35,43],[37,44],[34,51],[31,58],[27.5,51]],P.s5);
  b.poly([[31,45.5],[37,44],[34,51],[31.5,56]],P.s4); b.px(30,50,P.s3);
  // Revers
  b.poly([[13,46.5],[19,44],[23,45],[27.5,51.5],[30.5,58.5],[30.5,64],[26,64],[22,56],[16.5,50]],P.n2);
  b.line(20,44,24,49,P.n3); b.line(25,50,29,57,P.n3); b.line(16,50,22,56,P.n1); b.px(16,49,P.n0); b.px(15,48,P.n0);
  b.poly([[35.5,44],[40,44],[42.5,47],[39,53],[34,59],[31.5,61],[31.5,57.5],[34.5,51]],P.n1);
  b.line(37,45,34.5,51,P.n2); b.line(41,48,38,53,P.n0);
  b.line(31,59,31,64,P.n0);
  // Blusenkragen
  b.poly([[20,42.4],[23.5,43.2],[27,46.8],[24.5,49.5],[22,47],[18.5,45.6]],P.s6); b.line(19,45,23,48,P.s4); b.line(21,43,23,43,P.l1);
  b.poly([[35,43.2],[38.2,42.8],[40.5,45.4],[37.6,48.6],[35.6,46.2]],P.s5); b.line(36,46,38,48,P.s4);
  // Brusttasche mit Kugelschreiber (nahe Seite)
  b.line(8,56,15,56,P.n0); b.line(8,57,15,57,P.n3);
  b.line(12,52,12,56,P.k2); b.px(12,51,P.m1); b.line(13,52,13,54,P.m4); b.px(13,52,P.s6);
}
// Lesebrille an der Kette: die Kette läuft vom Nacken beidseits herab zu den Bügelenden; die Brille hängt offen vor der Brust,
// die Bügel schräg nach oben, die Gläser unten nebeneinander
function glasses(b){
  var C1=P.m4, C2=P.m3;
  [[22,43],[22,45],[23,47],[23,49],[23,51]].forEach(function(q,i){ b.px(q[0],q[1],i&1?C2:C1); });
  [[36,44],[36,46],[36,48],[36,50],[36,52]].forEach(function(q,i){ b.px(q[0],q[1],i&1?C2:C1); });
  var F=P.k2, H=P.m2;
  b.line(23,52,25,55,F); b.line(36,53,34,56,F);
  b.line(25,56,28,56,H); b.line(25,59,28,59,F); b.line(24,57,24,58,F); b.line(29,57,29,58,F);
  b.line(31,57,34,57,H); b.line(31,60,34,60,F); b.line(30,58,30,59,F); b.line(35,58,35,59,F);
  b.px(29,57,F); b.px(30,57,F);
  b.poly([[25,57],[29,57],[29,59],[25,59]],P.b4); b.line(25,57,26,57,P.l1);
  b.poly([[31,58],[35,58],[35,60],[31,60]],P.b3); b.px(31,58,P.s6);
}
var MOUTH_O=[[34,31,'3'],[35,31,'m'],[36,31,'w'],[37,31,'w'],[38,31,'m'],[35,32,'m'],[36,32,'m'],[37,32,'2'],[35,33,'l'],[36,33,'l'],[37,33,'4']];
var EYES_B=[[28,20,'4'],[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[28,21,'I'],[29,21,'I'],[30,21,'I'],[31,21,'I'],[32,21,'3'],[29,22,'4'],[30,22,'4'],[31,22,'4'],
  [36,20,'4'],[37,20,'4'],[38,20,'4'],[36,21,'I'],[37,21,'I'],[38,21,'3'],[37,22,'4']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); streaks(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b); glasses(b);
  M.outline(b,P.k1);
}
M.definePortrait('kolar',{ paint:paint });
})(M);
