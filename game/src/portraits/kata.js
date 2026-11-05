/* ===== portraits/kata.js — Kata Rajić (29), Vlados Tochter, macht die Notdienste der Werkstatt (Kapitel 3, Mostar)
   Schlank, schmales kantiges Gesicht mit hohen Wangenknochen: kurzes dunkelblondes Haar mit Undercut (Seiten und Nacken
   kurz geschoren, das Deckhaar länger und zur fernen Seite gelegt), zwei kleine Ohrstecker, graublaue Augen; die ferne Braue
   steht etwas höher, ein Mundwinkel zieht spöttisch nach oben. Schwarze Fleecejacke mit Stehkragen und dem gestickten
   Werkstattlogo „RAJIĆ“. Schnell, spöttisch, praktisch.
   Legende HEAD: Ziffern Haut (1–6 p0–p5) · t u geschorene Seiten (p3 mit e2) · a–f Deckhaar (e1 e2 e3 e4 s4 s5) ·
   S Ohrstecker (m4) · w Augenweiß · i Iris · k Pupille · z Wimpern · L l Lippen (d3 d4).
   Jacke und Logo in Code; Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
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
"........................................................", // 4
".......................bcddeeddc........................", // 5
"....................bcddeeefeeddccb.....................", // 6
"..................bccddeeffeeeddcccbb...................", // 7
".................bccdddeeeffeedddcccbb..................", // 8
"................bbcdddeeeeedddcccdccbbba................", // 9
"................abccddeeedddccddcccdccbba...............", // 10
"...............abbccdddeddcccdddccdddccbba..............", // 11
"...............ttabbccdddcccddccddddcccbba..............", // 12
"...............tttaabbbaaba4556665bccddcbba.............", // 13
"...............ttttttttttttu4566665bccdcbba.............", // 14
"...............tttttttttttt455666665bccdba..............", // 15
"...............tttttttttttt456666665bccbba..............", // 16
"...............ttttttttttt45566666664bcb43..............", // 17
"...............ttttttttttt45bbbbb5554bbbb3..............", // 18
"...............ttttttttttt4444444456444443..............", // 19
"...............ttttt45543t43zzzzz4564zzzz3..............", // 20
"...............ttttt54332443wwiki3563wik33..............", // 21
"...............ttttt5S14245445ii545645ii43..............", // 22
"...............ttttt53143555555555565555443.............", // 23
"...............ttttt53233556666555566555543.............", // 24
"................tttt44323556666555566555443.............", // 25
"................tttt3543345555554545665543..............", // 26
".................ttt44S4345555554434555433..............", // 27
"..................tt4443445555554443223443..............", // 28
"...................t4434455555554344444453..............", // 29
"....................4334455555555343444543..............", // 30
".....................334455555554443222233..............", // 31
"......................334455555555444ll443..............", // 32
".......................334455555554433343...............", // 33
"........................3344555555566543................", // 34
".........................33445555555543.................", // 35
"..........................334444555543..................", // 36
"..........................33333444443...................", // 37
"..........................3333322222....................", // 38
"..........................3343222222....................", // 39
".........................33433332222...................."  // 40
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, t:P.p3, u:P.e2,
  a:P.e1, b:P.e2, c:P.e3, d:P.w4, e:P.e4, f:P.s4, S:P.m4, w:P.s6, i:P.c3, k:P.c0, z:P.h1, L:P.d3, l:P.d4 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' '||ch==='_') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]||P[list[i][2]]); }
// schwarze Fleecejacke: weiche, matte Fläche (leichtes Raster), Stehkragen, Reißverschluss bis unters Kinn
function fleece(x,y,lo){ var h=M.hash(x*0.7,y*1.3); var v=lo+(h>0.94?1:0)-(h<0.05?1:0); return [P.k1,P.k2,P.m0,P.m1,P.m2][Math.max(0,Math.min(4,v))]; }
function jacket(b){
  b.poly([[3,64],[3.4,56],[5.6,51],[9.6,47.6],[16,45.4],[23,44.2],[37,44.2],[43,45.4],[48,47.8],[51,51.6],[52.6,57],[53,64]],function(x,y){ var lo=(x<16&&y<56)?3:((x>41)?1:2); return fleece(x,y,lo); });
  b.line(4,56,6,51,P.m2); b.line(7,50,11,47.4,P.m2); b.line(12,47,17,45.4,P.m1);
  b.line(10,53,11,63,P.k2); b.line(46,50,47,63,P.k1); b.line(19,54,21,63,P.k2);
  // Stehkragen um den Hals, vorn etwas offen
  b.poly([[22,45],[23,40.4],[27,41.4],[31,41.6],[31.6,46.4],[27,46.6]],function(x,y){ return fleece(x,y,(x<26)?3:2); });
  b.poly([[33,41.4],[37,40.4],[38.6,41.6],[38,45],[34,46.6],[32.6,46.4]],function(x,y){ return fleece(x,y,1); });
  b.line(23,41,27,42,P.m2); b.line(34,42,37,41,P.m1);
  // Reißverschluss: Zipper unter dem Kinn, Zähnchen nach unten
  b.poly([[31,42],[33,42],[32.6,46.6],[31.4,46.6]],P.m1); b.px(32,45,P.m4); b.px(32,46,P.m3);
  for (var y=47;y<64;y++) b.px(32,y,(y&1)?P.m2:P.m1);
  b.line(31,47,31,63,P.k1);
  // gesticktes Werkstattlogo auf der fernen Brustseite (angedeutete Buchstaben)
  b.rect(39,52,8,3,P.m0);
  [[40,53],[41,52],[41,54],[43,52],[43,53],[44,53],[45,52],[45,54],[46,53]].forEach(function(q){ b.px(q[0],q[1],P.s3); });
  b.px(40,52,P.s4); b.px(44,52,P.s4); b.hl(39,46,55,P.k1);
}
// geschorene Seiten: über die Hautpixel (t) streut sich unregelmäßig das kurze dunkelblonde Haar, zur Kante hin dichter
function shaved(b){
  for (var y=12;y<30;y++) for (var x=14;x<28;x++){ if (b.get(x,y)!==P.p3) continue; if (!SHV[y*56+x]) continue;
    var h=M.hash(x*1.7+3,y*2.9+1), dens=0.38+(y<16?0.22:0)-(x>24?0.12:0); if (h<dens) b.px(x,y,(M.hash(y*1.1,x*3.3)<0.6)?P.e2:P.e3); else if (h>0.9) b.px(x,y,P.p4); }
}
var SHV=null;
function markShaved(){ SHV={}; for (var y=0;y<HEAD.length;y++) for (var x=0;x<HEAD[y].length;x++) if (HEAD[y][x]==='t') SHV[y*56+x]=1; }
var MOUTH_O=[];
var EYES_B=[];
function paint(b,v){
  jacket(b);
  stamp(b,HEAD,LEG); if (!SHV) markShaved(); shaved(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  M.outline(b,P.k1);
}
M.definePortrait('kata',{ paint:paint });
})(M);
