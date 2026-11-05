/* ===== portraits/maja.js — Maja (28), führt die Herberge „Neretva“ (Kapitel 3, Mostar)
   Schlank: schmales, junges Gesicht, dunkelbraunes Haar straff zurück in einem lockeren Knoten hoch am Hinterkopf,
   ein gelber Bleistift steckt quer darin, einzelne lose Strähnen an Schläfe und Nacken; Brille mit dickem schwarzem Rand.
   Grüner Strickpullover mit Rippenkragen. Freundlich, knapp, immer beschäftigt.
   Legende HEAD: Ziffern Haut (2–6 p1–p5, 7 l0) · r Wangenröte (t5) · a–f Haar (h1 h2 h3 w2 w3 w4) ·
   w Augenweiß · i Iris · k Pupille · z Wimpern und Brauen (h1) · L l Lippen (d3 d4).
   Bleistift, Brille und Pullover in Code; Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
"........................................................", // 0
"........................................................", // 1
"........................................................", // 2
"........................................................", // 3
"...............cddc.....................................", // 4
"..............cdeedcb...................................", // 5
".............cdeffedcbbbbccddccb........................", // 6
"............bcdeeeddcbbbbccddeeddcb.....................", // 7
"............bcdeedddcbbbccdddeeeddccb...................", // 8
"............abcddcccbbbcccdddeeedddccb..................", // 9
"............abccdcbbabbccccdddeeddddccb.................", // 10
".............abcbbaabbcccccdddddddccccb.................", // 11
"..............aabbaabbcccbcccdd45666654cb...............", // 12
"...............aaabbbbcccbbcc4566666654cb...............", // 13
".................abbbbccbbccc45666666554cb..............", // 14
".................abbbcbbbccb456666666554cb..............", // 15
".................abbbbbbcbcb4566666665543b..............", // 16
".................abbbbbbcbcb4bzzzb555bzzb3..............", // 17
".................abbbbbbcbbc45555555555543..............", // 18
".................abbbbbbbbcb45555555555543..............", // 19
".................abbbbbbbb4455555555555543..............", // 20
".................abbbbbbab44zzzzz4565zzzz3..............", // 21
".................abbb4553b45wwiki4565wik33..............", // 22
"..................abb4523b5554ii455655ii43..............", // 23
"..................abb4513b55555555566555443.............", // 24
"...................ab4523b55r66555566555443.............", // 25
"...................ab.443b55rr555545665543..............", // 26
"....................b.444b5555555445566543..............", // 27
"....................b344555555555434555433..............", // 28
"....................b344555555555443223443..............", // 29
"....................b334555555555454444453..............", // 30
".....................33445555555554LLLLL43..............", // 31
"......................3344555555554lmll443..............", // 32
".......................334455555554433453...............", // 33
"........................3344555555556653................", // 34
".........................33445555555543.................", // 35
"..........................334445555543..................", // 36
"..........................33333444443...................", // 37
"..........................33332222222...................", // 38
"..........................3343322222....................", // 39
".........................33433332222....................", // 40
".........................3343333322223..................", // 41
".........................33433333322223.................", // 42
".........................334433333322233................", // 43
".........................3344333333222333...............", // 44
"........................................................"  // 45
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, '7':P.l0, r:P.t5,
  a:P.h1, b:P.h2, c:P.h3, d:P.w2, e:P.w3, f:P.w4, w:P.s6, i:P.w2, k:P.h0, z:P.h1, L:P.d3, l:P.d4, m:P.d5 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' '||ch==='_') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]||P[list[i][2]]); }
// grüner Strickpullover: schmale Schultern, Rippenkragen, Strickrippen
var KN=[P.g1,P.g2,P.g3,P.g4,P.g5];
function sweater(b){
  var knit=function(x,y){ var v=2+((x&1)?0:1); if (x<14&&y<54) v++; if (x>40) v--; if (y>58&&x>30) v--; return KN[Math.max(0,Math.min(4,v))]; };
  b.poly([[2,64],[2.6,56],[5,51],[9,47.6],[15,45.4],[22,44],[36,44],[42,45.2],[47,47.6],[50.6,51.6],[52.6,57],[53,64]],knit);
  b.line(9,50,8,63,P.g1); b.line(46,50,47,63,P.g1); b.line(20,52,21,63,P.g2);
  // Rippenkragen um den Hals
  b.poly([[22,44.2],[25,42.6],[30,43.2],[35,42.6],[38,43.6],[37,46.4],[30,47.2],[23.6,46.4]],function(x,y){ return (x&1)?P.g3:P.g4; });
  b.line(24,46,30,47,P.g2); b.line(31,47,37,46,P.g1); b.line(25,43,29,43,P.g5);
}
// Bleistift quer durch den Knoten: Radiergummi und Zwinge unten links, angespitzt oben rechts
function pencil(b){
  b.line(9,12,21,3,function(x,y){ var c=b.get(x,y); return P.y3; });
  b.line(10,12,21,4,P.y2);
  b.px(9,12,P.d4); b.px(8,13,P.d4); b.px(10,11,P.m4); b.px(9,13,P.d3);
  b.px(21,3,P.w4); b.px(22,2,P.h1); b.px(21,4,P.w3);
}
// Brille: dicker schwarzer Rand (oben kräftiger), Bügel zum Ohr, je ein Glanz auf dem Glas
function glasses(b){
  var F=P.k2, H=P.m2;
  b.line(26,19,33,19,F); b.line(26,25,33,25,F); b.line(26,20,26,24,F); b.line(33,20,33,24,F); b.px(27,20,F); b.px(32,20,F);
  b.line(36,19,41,19,F); b.line(36,25,41,25,F); b.line(36,20,36,24,F); b.line(41,20,41,24,F); b.px(40,20,F);
  b.line(34,21,35,21,F); b.px(34,20,F); b.line(25,20,23,21,F);
  b.line(28,19,31,19,H); b.px(38,19,H);
  b.px(28,20,P.n5); b.px(37,20,P.n4);
}
var MOUTH_O=[];
var EYES_B=[];
function paint(b,v){
  sweater(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  glasses(b); pencil(b);
  M.outline(b,P.k1);
}
M.definePortrait('maja',{ paint:paint });
})(M);
