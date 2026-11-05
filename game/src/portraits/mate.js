/* ===== portraits/mate.js — Mate Zelenika (Geist, † März 2010, wirkt 81), früher Gastarbeiter in München (Kapitel 3)
   Schmal und gebeugt, kleiner Kopf: grauer Filzhut mit dunklem Band und Mittelkniff, die Krempe vorn etwas gesenkt (Schatten auf
   der Stirn); schmales, tief gefurchtes Gesicht mit eingefallenen Wangen, großes Ohr, kurzes weißes Haar unter dem Hut, weiße
   Brauen, freundliche, müde Augen mit Tränensäcken, lange Nase, gepflegter weißer Schnurrbart; dünner Hals im zu weit gewordenen
   Hemdkragen, grauer Anzug aus den Siebzigern mit breitem Revers, breite dunkelrote Krawatte. Höflich und hartnäckig.
   In natürlichen Farben gemalt; das Spiel färbt Geister ein (M.ghostLut mit M.GHOST_OVR.mate aus 14_k3_cast_b.js: die Grautöne m0–m4
   von Hut und Anzug bleiben, Hemd und Schnurrbart s5/s6 bleiben hell, die Krawatte r → d). Deshalb trennen Helligkeitsstufen die
   Formen: Haut p1–p5 (eingefärbt fünf Stufen), Brauen, Haar und Schnurrbart s4–s6 heller als die Haut ringsum, Hutband und
   Krempenschatten m0/m1 dunkel, Augen und Mundspalt h1/q1.
   Legende HEAD: A–E Hut (m0 m1 m2 m3 m4) · Ziffern Haut (1 p1 … 5 p5) · q Q kühle Schatten (q3 q2) · h H j Haar, Brauen,
   Schnurrbart (s4 s5 s6) · W w Augenweiß · i Iris · I Wimpern und Pupille · m Mundspalt · l Unterlippe.
   Anzug, Hemd und Krawatte in Code, Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
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
 ".......................CDDDDC...........................", // 6
 ".....................CDEEEEDDDCCC.......................", // 7
 "....................CDEEEEEDDDDDDDCCC...................", // 8
 "....................CDEEEEEDDDDDDDDCCC..................", // 9
 "....................CDEEEEDDDDDDDDDDCCCC................", // 10
 "....................CDEEEDDDDDDDDDDDCCCC................", // 11
 ".............CDDEEDCBBBBBBBBBBBBBBBBBBBBA...............", // 12
 ".............BCDDDCCABBBBBBBBBBBBBBBBBBBA...............", // 13
 "..............ABBBBBCCDDDDDDDDDDDDDDDDDDDDDDDDDDDDC.....", // 14
 "................ABBBBBBBBBBBBBBBBBBBBBBBDDDDDDDDC.......", // 15
 ".......................................BCCCCCCCCB.......", // 16
 "................QHHjHHHHHjH.2222222222..AAAAAAAA........", // 17
 "................QHjHHjHHjjH2333333333333332.............", // 18
 "................QHHHjHHHH3343HjjH3443HjH3443............", // 19
 "................QHHhHh455333334333454333443.............", // 20
 "................QHhHhh43233334IIII354III33..............", // 21
 "................QhHhh34313333IWiIw354WiI33..............", // 22
 "................QhhQ33422334343i34454334433.............", // 23
 "................2Qh233432334453334454433443.............", // 24
 ".................2Q2234533345554344454444443............", // 25
 ".................222234433344544334445443443............", // 26
 "..................12224433344443234444554343............", // 27
 "..................11224433334432234444455433............", // 28
 "...................1122433334432234423321233............", // 29
 "....................1123333344323342HjjjjH..............", // 30
 ".....................122333344432332hHHHHh..............", // 31
 ".....................1122333444433323mmmm3..............", // 32
 "......................112233444444333lll3...............", // 33
 "......................1112233444445554433...............", // 34
 "......................1112223344445554432...............", // 35
 "......................1111122334444554432...............", // 36
 "......................111121223333444322................", // 37
 "......................111111222333221...................", // 38
 "......................1111223344322.....................", // 39
 "......................1111223344342.....................", // 40
 "......................1111223443332.....................", // 41
 "......................1111223443322.....................", // 42
 "......................1111223443322.....................", // 43
 "......................1111223443322.....................", // 44
 "......................1111223443322.....................", // 45
 "......................1111223443322.....................", // 46
 "......................1111223443322.....................", // 47
];
var LEG={ A:P.m0, B:P.m1, C:P.m2, D:P.m3, E:P.m4, '1':P.p1, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, q:P.q3, Q:P.q2,
  h:P.s4, H:P.s5, j:P.s6, W:P.s4, w:P.s5, i:P.c2, I:P.h1, m:P.q1, l:P.p3 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Hut: Mittelkniff oben (von vorn nach hinten) und die Delle vorn an der Krone
function hatDetail(b){
  b.line(23,8,36,9,P.m2); b.line(23,7,35,8,P.m4); b.px(22,7,P.s5); b.px(24,7,P.s5);
  b.line(35,10,36,11,P.m2); b.px(34,10,P.m4); b.line(21,12,27,12,P.m2);
}
// grauer Anzug der Siebziger (gebeugt: die nahe Schulter steht höher, der Rücken rund)
function back(b){
  b.poly([[3,64],[3,56.5],[5,51],[9,46.5],[14,43.4],[19.5,42],[24,42],[36,43.6],[42,45.6],[47,49],[50.5,53.5],[52,58],[52.5,64]],P.m2);
  b.poly([[3,60],[3,56.5],[5,51],[9,46.5],[14,43.4],[17.5,42.4],[12,46],[7.5,50.5],[5,56]],P.m3);
  b.poly([[41.5,47],[47,49.5],[50.5,54],[52,58],[52.5,64],[44,64],[43,55]],P.m1);
  b.line(10,53,11,63,P.m1); b.line(44,51,45,63,P.m0);
}
function front(b){
  // Hemd mit breitem, spitzem Kragen (Siebziger), etwas zu weit am dünnen Hals
  b.poly([[23,42],[27,43.6],[32,43.8],[35.5,43],[37,44.5],[34,52],[31,59],[27,52]],P.s5);
  b.poly([[31.5,45],[37,44.5],[34,52],[31.5,57]],P.s4);
  // breite Krawatte mit Muster
  b.poly([[28.5,43.8],[32.2,43.8],[31.8,46.4],[29,46.4]],P.r2); b.px(29,44,P.r3); b.px(30,44,P.r3);
  b.poly([[29,46.4],[31.8,46.4],[33.4,55],[31.2,59],[28.4,55]],function(x,y){ return ((x+y)%3===0)?P.r1:((x<30)?P.r3:P.r2); });
  // breites Revers
  b.poly([[11,48],[18,43.6],[23,43.4],[27.5,51],[30.5,58.5],[30.5,64],[25.5,64],[21,56],[15,50.5]],P.m3);
  b.line(19,44,23,44,P.m4); b.line(23,45,27,52,P.m4); b.line(27,53,30,59,P.m4); b.line(14,50,21,56,P.m2); b.poly([[13.5,48.4],[16.5,47],[17.5,49.6]],P.m1);
  b.poly([[36,44.2],[41.5,44.6],[45,48],[40.5,54.5],[34,61],[31.5,62.5],[31.5,58.5],[34.5,51]],P.m1);
  b.line(37,45,35,51,P.m2); b.line(44,49,40,54,P.m0); b.poly([[42,47.4],[44.4,47],[44,49.6]],P.m0);
  // Kragenspitzen
  b.poly([[22,41.6],[25,42.4],[29,46.5],[26.5,49],[23.5,46.5],[21,44.5]],P.s6); b.line(22,44,26,48,P.s4); b.line(23,42,25,43,P.l1);
  b.poly([[36.5,42.4],[37.6,44.6],[34.2,48.4],[32.4,46.2]],P.s5); b.line(36,45,34,47,P.s4);
  b.line(31,59,31,64,P.m0); b.px(30,61,P.m4);
}
var MOUTH_O=[[36,31,'1'],[37,31,'w'],[38,31,'w'],[39,31,'1'],[36,32,'1'],[37,32,'1'],[38,32,'2'],[36,33,'l'],[37,33,'l'],[38,33,'3']];
var EYES_B=[[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'3'],[28,21,'I'],[29,21,'I'],[30,21,'I'],[31,21,'I'],[32,21,'3'],[30,22,'3'],
  [36,20,'4'],[37,20,'4'],[38,20,'3'],[36,21,'I'],[37,21,'I'],[38,21,'3']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); hatDetail(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('mate',{ paint:paint });
// im Spiel ein Geist: Porträt in seiner Geisterfarbe (M.ghostLut)
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.mate=true;
})(M);
