/* ===== portraits/fikret.js — Fikret Hadžić (54), Buregdžinica am Busbahnhof
   Kräftig, runder Kopf mit kurzem grauem Bürstenschnitt, dichter grauer Schnauzbart, rote Wangen, schwerer Hals;
   weiße Bäckerjacke mit offenem Stehkragen über blauem Pullover, Halsträger der weißen Schürze, Mehlstaub. Laut, herzlich.
   Legende: Ziffern Haut (p-Rampe, 0 = p0, 6 = l0) · r R T Wangenröte (d4 d5 t5) · M N n Hals (q4 q3 q2) ·
   a–f Haar, Brauen und Schnauzbart (m2 m3 m4 s5 s6 l1) · w W Augenweiß · i Iris · I Wimpern/Pupille.
   Kleidung wird darunter/darüber gemalt (back, front), Kontur mit M.outline.
   Varianten: MOUTH (Lippen geöffnet, 1 Pixel Zähne) und EYES (Lid zu) als Flicken. */
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
"....................cdeedeedefdeeddc....................", // 6
".................bcdddefdefdefdeededdcb.................", // 7
"................bccdcdeedeedeedeededdccb................", // 8
"...............abcbcdcddcdeddeddedddcdccb...............", // 9
"..............abbcbccdccdcddcddcddcddcdcb...............", // 10
"..............aabbcbccbcccdccdcddcdcdccccb..............", // 11
".............aabbbcbcccbccccdccdccdcccbcbb..............", // 12
".............aabbbbcbccbcccbccbcbccbcbcbbb..............", // 13
".............aabbbbcbccbcccbc4555555554443..............", // 14
".............aaabbbcbccbccbc45566555555443..............", // 15
".............aaabbbbbcbccbcc45554454455443..............", // 16
".............aaaabbbbcbcbcc445565555554443..............", // 17
".............aaaabbbbbcbccc345555444544433..............", // 18
".............aaaabbbbbbcbc344cdddcc54cdcc43.............", // 19
".............aaabbb343bcc34bcccbbb454bbbbb3.............", // 20
".............aabbb34543cb45b32IIII353III2b..............", // 21
".............aabbb452333b45443wiIW453WiI33..............", // 22
".............aaabb4521343453443ii34543i333..............", // 23
".............aaabb4432344554354334555433433.............", // 24
"..............aaab34324455TTRT5554456433T33.............", // 25
"..............aaab3443445TRRRRT444445654rT33............", // 26
"...............aabb34433TRRRRrT4444434565T43............", // 27
"...............aabbb3333TrRrrT44443432344223............", // 28
"................bbMNN3444TrT44444343cdddccb.............", // 29
"................MMNNN444444444433cddeedddccb............", // 30
".................MNNN44444444443cdddddccccbb............", // 31
".................MNNN3444444444bcccccbcbbba.............", // 32
".................MNNn3344444444ab211112333..............", // 33
".................MNNNn3344444444b33rrr3433..............", // 34
".................MNNNNn3344444444443334443..............", // 35
".................MMNNNNn334444444445544433..............", // 36
".................MMNNNNNnn334444444454433...............", // 37
".................MMNNNNNNNnnn334444444333...............", // 38
".................MMNNNNNNNNNNnnn33344332................", // 39
".................MMNNNNNNNNNNNNnnnnnnnn.................", // 40
".................MMNNNNNNNNNNNNNNNNNnn..................", // 41
".................MMNNNNNNNNNNNNNNNNNn...................", // 42
"..................MNNNNNNNNNNNNNNNNn....................", // 43
"..................MNNNNNNNNNNNNNNNNn....................", // 44
"..................MNNNNNNNNNNNNNNNNn...................."  // 45
];
var LEG={ '0':P.p0,'1':P.p1,'2':P.p2,'3':P.p3,'4':P.p4,'5':P.p5,'6':P.l0, r:P.d4, R:P.d5, T:P.t5, M:P.q4, N:P.q3, n:P.q2,
  a:P.m2, b:P.m3, c:P.m4, d:P.s5, e:P.s6, f:P.l1, w:P.s5, W:P.s4, i:P.w2, I:P.h1, k:P.k1 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Bäckerjacke (weiß, Licht von links oben), Stehkragen hinter dem Hals
function back(b){
  b.poly([[0,64],[0,54],[2,50.5],[6,47],[11,44.5],[16,43],[20,42.5],[34,43],[40,44],[46,45.5],[51,48.5],[54,52],[55.5,57],[56,64]],P.s5);
  b.poly([[0,57],[0,54],[2,50.5],[6,47],[11,44.5],[16,43],[17.5,43.5],[12,46.5],[7,49.5],[3,53]],P.s6);
  b.line(8,52,9,57,P.s4); b.line(9,58,10,63,P.s4); b.line(3,57,4,63,P.s4); b.line(13,49,15,52,P.s4);
  b.poly([[43,47],[50,49.5],[53.5,53],[55.5,58],[56,64],[45,64],[44,55]],P.s4);
  b.poly([[51,50.5],[54,54],[56,60],[56,64],[53.5,64],[52.5,57]],P.s3);
  b.line(46,50,47,58,P.s3); b.line(47,59,47,63,P.s3); b.line(44,46,49,48,P.s5);
  b.poly([[14.5,45.5],[15,40.5],[17,38.8],[19.5,39.5],[20,45]],P.s5); b.line(15,41,16,39,P.s6); b.line(19,40,19,44,P.s4); b.line(15,44,19,45,P.s4);
  b.poly([[33.5,42.5],[37,41.5],[39.5,43],[40.5,46.5],[35.5,47]],P.s4); b.line(35,42,37,41,P.s5); b.line(39,44,40,46,P.s3);
}
// offene Jacke: blauer Pullover mit Rippenbund im Ausschnitt, Kanten, zweireihige Knöpfe, Latzschürze mit Halsträgern und Mehlflecken
function front(b){
  b.poly([[19,43.5],[24,45],[30,45.5],[35,44.5],[37.5,45.5],[34.5,49.5],[30,53.5],[26,50.5],[21,47]],P.b1);
  b.line(19,44,23,45,P.b2); b.line(24,46,30,46,P.b2); b.line(31,46,35,45,P.b2); b.line(36,45,37,45,P.b2);
  b.line(20,45,23,46,P.b3); b.line(24,47,28,47,P.b3);
  b.line(30,48,30,51,P.b0); b.line(31,48,34,46,P.b0);
  // nahe Vorderkante mit Kragenende
  b.poly([[15,47],[16,44.5],[19,44],[22,46],[26,50],[29.5,53.5],[29.5,57],[23,53],[17,49.5]],P.s6);
  b.line(19,45,22,47,P.s5); b.line(23,48,28,53,P.s4); b.line(16,47,21,50,P.s5);
  // ferne Vorderkante
  b.poly([[35.5,45.5],[39,45],[40.5,47],[37,50.5],[33,54],[30,57],[30,53.5],[34.5,49.5]],P.s4);
  b.line(38,46,39,47,P.s5); b.line(36,50,32,54,P.s3);
  b.line(30,57,31,64,P.s3); b.line(29,58,30,64,P.s6);
  [[24,55],[36,55]].forEach(function(q){ b.px(q[0],q[1],P.s3); b.px(q[0]+1,q[1],P.s4); b.px(q[0],q[1]-1,P.l1); });
  // Latzschürze: die Halsträger laufen vom Nacken zum Latz, der Latz beginnt unter dem Bildrand; Mehlstaub auf Jacke und Trägern
  b.poly([[17.5,47],[19.5,46.5],[22,64],[19.5,64]],P.s4); b.line(18,48,20,64,P.s3); b.line(20,47,22,63,P.s5);
  b.poly([[39.5,46.5],[41.5,47],[44,64],[41.5,64]],P.s3); b.line(41,47,43,63,P.s4);
  [[20,55],[21,58],[8,55],[9,56],[12,59],[13,60],[26,59],[27,61],[25,62],[34,58],[35,60],[37,62],[48,56],[49,57]].forEach(function(q){ b.px(q[0],q[1],P.l1); });
  [[26,60],[36,61],[49,58],[21,59]].forEach(function(q){ b.px(q[0],q[1],P.s6); });
}
var MOUTH_O=[[33,33,'1'],[34,33,'1'],[35,33,'w'],[36,33,'w'],[37,33,'1'],[38,33,'2'],[34,34,'2'],[35,34,'1'],[36,34,'1'],[37,34,'1'],[38,34,'3'],
  [35,35,'r'],[36,35,'r'],[37,35,'r'],[38,35,'3'],[35,36,'3'],[36,36,'3'],[37,36,'4']];
var EYES_B=[[29,21,'3'],[30,21,'4'],[31,21,'4'],[32,21,'4'],[33,21,'4'],[29,22,'2'],[30,22,'1'],[31,22,'1'],[32,22,'1'],[33,22,'2'],[31,23,'4'],[32,23,'4'],
  [37,21,'4'],[38,21,'4'],[39,21,'3'],[37,22,'1'],[38,22,'1'],[39,22,'2'],[38,23,'4']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('fikret',{ paint:paint });
})(M);
