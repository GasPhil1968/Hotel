/* ===== portraits/emina.js — Emina Kadić (58), Wirtin der Kafana „Kula“
   Schlank und aufrecht: schmales Gesicht mit hohen Wangenknochen, markante dunkle Brauen, dunkle Augen unter etwas gesenkten
   Lidern, fester Mund; dunkles, grau durchzogenes Haar straff zurück in einen strengen Knoten, kleine goldene Ohrringe,
   schwarze Bluse mit Kragen, dunkelrote Strickjacke. Stolz, scharf.
   Legende HEAD: a–e Haar (h0 h1 h2 h3 w2; graue Strähnen in Code) · Ziffern Haut (p-Rampe) · M N n Hals (q4 q3 q2) · B C Brauen ·
   w W Augenweiß · i Iris · I Wimpern/Pupille · L l Lippen · y Y z Goldohrring. Knoten und Kleidung in Code, Kontur mit M.outline.
   Varianten: MOUTH und EYES als Flicken. */
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
".....................cddeedeeddccb......................", // 6
"..................bccddeeedeedddccccb...................", // 7
"................bccdddeeeddddddcccccbbb.................", // 8
"...............bbccdddedddddddccccccbbba................", // 9
"...............bbcccdddcddddddcccccbbbbaa...............", // 10
"..............abbcccddccdddddccbb44555544...............", // 11
"..............abbccccddccdddcbb4455565544...............", // 12
"..............aabbccccdccddccb44556655443...............", // 13
"..............aabbbccccccddcb445555555443...............", // 14
"..............aabbbcccccdccb4455555555443...............", // 15
"..............aabbbbccccccb34455555554443...............", // 16
"..............aabbbbccccccb345CBBC5555CBC3..............", // 17
"..............aabbbbcccccb34CBBBBBC55CBBBC..............", // 18
"..............aabbbbbccccb3C44333445433443..............", // 19
"..............aabbbc343c45543IIIII354IIII3..............", // 20
"..............aabbb3543345543WwiIW353WiIW3..............", // 21
"..............aabbb45233455543Wii34543ii33..............", // 22
"..............aaabb45213456654333455543343..............", // 23
"..............aaabb443234565554444455543343.............", // 24
"...............aabb343244454444444445554333.............", // 25
"...............aabb3443444444444444444555433............", // 26
"................abbb344344444444444344555433............", // 27
"................abbbb33334334444444323444223............", // 28
".................abbbYy33333344444443443333.............", // 29
".................abbnyz3333344444434454433..............", // 30
"..................bbNNNN33334444434LLLLL33..............", // 31
"...................bNNNNN33344443421111123..............", // 32
"....................NNNNNN344444434llll433..............", // 33
"....................MMNNNNN344444443334433..............", // 34
"....................MMNNNNNNn3444444554433..............", // 35
".....................MMNNNNNNNn34445544433..............", // 36
".....................MMNNNNNNNNnn34444332...............", // 37
".....................MMNNNNNNNNNNnnnnnnn................", // 38
"......................MNNNNNNNNNNNNnn...................", // 39
".......................MNNNNNNNNNNnn....................", // 40
".......................MNNNNNNNNNnn.....................", // 41
".......................MNNNNNNNNNnn.....................", // 42
".......................MNNNNNNNNNnn.....................", // 43
".......................MNNNNNNNNNnn.....................", // 44
".......................MNNNNNNNNNnn.....................", // 45
".......................MNNNNNNNNNnn....................."  // 46
];
var LEG={ a:P.h0, b:P.h1, c:P.h2, d:P.h3, e:P.w2, '1':P.p1, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, '6':P.l0,
  M:P.q4, N:P.q3, n:P.q2, B:P.h1, C:P.h2, w:P.s5, W:P.s4, i:P.w1, I:P.h0, L:P.r3, l:P.d4, y:P.y3, Y:P.y5, z:P.y2 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// strenger Knoten am Hinterkopf: gewickelte Strähnen, Licht oben links, graue Fäden
var HR=[P.h0,P.h1,P.h2,P.h3,P.w2];
// graue Strähnen im straff zurückgekämmten Haar: von der Stirn zum Knoten (nur auf Haarpixeln)
var STR=[[P.m2,[[34,7],[30,7.5]]],[P.m3,[[27,8],[22,10],[19,12]]],[P.m2,[[31,11],[27,12]]],[P.m3,[[25,13],[21,15],[18,17]]],[P.h3,[[36,8],[31,9],[26,10]]],[P.h3,[[29,14],[24,16]]],[P.m1,[[23,17],[19,19]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], pts=s[1]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return HR.indexOf(o)>=0?c:o; }); }); }
function bun(b){
  b.ellipse(12.5,15.5,5,5.6,function(x,y){ var dx=(x+0.5-12.5)/5, dy=(y+0.5-15.5)/5.6, a=Math.atan2(dy,dx), r=Math.sqrt(dx*dx+dy*dy);
    var v=2.0-dx*1.2-dy*1.4, s=((a*1.6+r*4.2)%2+2)%2; if (s<0.5 && r>0.3) v-=0.9; if (r>0.86) v-=0.7;
    return HR[Math.max(0,Math.min(4,Math.round(v)))]; });
  b.line(10,12,12,11,P.m2); b.px(13,11,P.w2); b.px(14,12,P.h3); b.px(9,15,P.h3);
  b.line(15,20,17,21,P.h0);
}
// schwarze Bluse mit Kragen, dunkelrote Strickjacke (V-Ausschnitt, Knopfleiste, Rippen)
function back(b){
  b.poly([[2,64],[2.5,58],[4.5,53],[9,49],[15,46],[20,44.2],[35,44.6],[41,46],[47,48.5],[50.5,52.5],[52.5,58],[53,64]],P.r2);
  b.poly([[2,60],[2.5,58],[4.5,53],[9,49],[15,46],[19,44.6],[14,47.5],[9,51],[5.5,55],[3.5,60]],P.r3);
  b.line(5,53,9,49,P.r4); b.line(10,49,14,47,P.r4);
  b.poly([[42,47.5],[47,49],[50,53],[52,58],[52.5,64],[44,64],[43,55]],P.r1);
  b.line(10,55,11,63,P.r1); b.line(4,60,5,63,P.r1); b.line(46,51,47,63,P.r0);
}
function front(b){
  // Bluse im Ausschnitt
  b.poly([[21,44.5],[26,46],[31,46.5],[35,45],[37,46],[34,53],[31,59],[27,53]],P.k2);
  b.poly([[31,47],[36,46],[34,53],[31.5,57]],P.m0);
  b.line(28,48,30,53,P.m1); b.line(30,54,31,57,P.m0);
  // Blusenkragen
  b.poly([[19.5,43.6],[23,44.5],[27.5,49],[24.5,50.5],[21,47.5]],P.m1); b.line(20,44,23,45,P.m2); b.line(22,48,25,50,P.k2);
  b.poly([[33.5,45],[37,44.2],[37.5,47.5],[34,50],[32.5,48]],P.m0); b.line(34,45,36,45,P.m1);
  // Strickjacke: Kanten am Ausschnitt, Knopfleiste, Knöpfe
  b.poly([[14.5,48],[19,45],[22,46],[26.5,52],[30,59],[30,64],[27,64],[23,56],[18,51]],P.r3);
  b.line(22,47,29,58,P.r4); b.line(18,51,25,59,P.r2);
  b.poly([[36.5,46],[40,46.5],[41,48.5],[37,55],[33,61],[31,64],[31,60],[34.5,52]],P.r1);
  b.line(37,47,33,55,P.r2);
  [[29,61],[33,57]].forEach(function(q){ b.px(q[0],q[1],P.k2); b.px(q[0],q[1]-1,P.r4); });
  // Rippenstrick: feine senkrechte Rillen
  for (var x=3;x<52;x+=3) for (var y=51;y<64;y++){ var c=b.get(x,y); if (c===P.r2) b.px(x,y,P.r1); else if (c===P.r3 && x<20) b.px(x,y,P.r2); }
}
var MOUTH_O=[[34,32,'2'],[35,32,'1'],[36,32,'w'],[37,32,'w'],[38,32,'1'],[39,32,'1'],[40,32,'2'],[35,33,'1'],[36,33,'1'],[37,33,'1'],[38,33,'1'],[39,33,'2'],[35,34,'l'],[36,34,'l'],[37,34,'l'],[38,34,'l'],[39,34,'4']];
var EYES_B=[[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[33,20,'4'],[29,21,'I'],[30,21,'2'],[31,21,'1'],[32,21,'1'],[33,21,'2'],[30,22,'4'],[31,22,'4'],[32,22,'4'],
  [37,20,'4'],[38,20,'4'],[39,20,'4'],[40,20,'3'],[37,21,'2'],[38,21,'1'],[39,21,'1'],[40,21,'2'],[38,22,'4'],[39,22,'4']];
function paint(b,v){
  back(b); bun(b);
  stamp(b,HEAD,LEG); streaks(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('emina',{ paint:paint });
})(M);
