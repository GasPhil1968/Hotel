/* ===== portraits/kata.js — Kata Rajić (29), Vlados Tochter, macht die Notdienste der Werkstatt (Kapitel 3, Mostar)
   Schlank, schmales kantiges Gesicht mit hohen Wangenknochen: kurzes dunkelblondes Haar mit Undercut (Seiten und Nacken
   kurz geschoren, das Deckhaar länger und zur fernen Seite gelegt), zwei kleine Ohrstecker, graublaue Augen; die ferne Braue
   steht etwas höher, ein Mundwinkel zieht spöttisch nach oben. Schwarze Fleecejacke mit Stehkragen und dem gestickten
   Werkstattlogo „RAJIĆ“. Schnell, spöttisch, praktisch.
   Legende HEAD: Ziffern Haut (1–6 p0–p5) · t u geschorene Seiten (q3 q2, Körnung in Code) · a–f Deckhaar (e1 e2 e3 e4 s4 s5) ·
   S Ohrstecker (m4) · w W Augenweiß · i Iris · k Pupille · G Glanz · z Wimpern · L l m Lippen (p2 d4 d5).
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
".......................bcddeedcb........................", // 5
"....................bccdeeffeedcb.......................", // 6
"..................bccddeeffeeddccbb.....................", // 7
".................bccddeeeeeedddcccbb....................", // 8
"................bccddddeeeddcccdccbbba..................", // 9
"................abccdddddcccbcddcccdcba.................", // 10
"...............abbccddddccbbccdddccdddcba...............", // 11
"...............uuabbcccdcbbbccdddccdddcbba..............", // 12
"...............uuuaabbbbaaba456665bccddcbba.............", // 13
"...............uuuuuuuuuuuuu4566665bccdcbba.............", // 14
"...............tttttttuuuuu455666665bccdba..............", // 15
"...............tttttttttttu456666665bccbba..............", // 16
"...............ttttttttttt45566666655aaab3..............", // 17
"...............ttttttttttt45baaaab555b5543..............", // 18
"...............ttttttttttt4444444456444443..............", // 19
"...............ttttt45543t4zzzzzz4564zzzz3..............", // 20
"...............ttttu54332443WwiGi3563wiG33..............", // 21
"...............tttuu5S14245454iki45645ik43..............", // 22
"...............ttuuu53143555555555565555443.............", // 23
"...............tuuuu53233556666555566555543.............", // 24
"................uuuu44323556666555556665443.............", // 25
"................uuuu3543345555554545566543..............", // 26
".................uuu44S4345555554434323443..............", // 27
"..................uu4443445555554444333443..............", // 28
"...................u4434455555554324444443..............", // 29
"....................4334455555555442LLL243..............", // 30
".....................33445555555444lmll443..............", // 31
"......................33445555555544334443..............", // 32
".......................334455555555666543...............", // 33
"........................334455555555543.................", // 34
".........................334444555543...................", // 35
"..........................33333444443...................", // 36
"..........................3333322222....................", // 37
"..........................3343222222....................", // 38
"..........................3343322222....................", // 39
".........................3343333222....................."  // 40
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, t:P.q3, u:P.q2,
  a:P.e1, b:P.e2, c:P.e3, d:P.e4, e:P.s4, f:P.s5, S:P.m4, w:P.s6, W:P.s5, i:P.c3, k:P.c0, z:P.h0, L:P.p2, l:P.d4, m:P.d5, G:P.s6 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' '||ch==='_') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]||P[list[i][2]]); }
// schwarze Fleecejacke: weiche, matte Flächen in wenigen Stufen, Stehkragen, Reißverschluss bis unters Kinn
var FL=[P.k1,P.k2,P.m0,P.m1,P.m2];
function fleece(x,y,lo){ return FL[Math.max(0,Math.min(4,lo))]; }
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
// geschorene Seiten: Haut mit kurzem Flaum (t hell, u im Schatten), dazu eine sparsame Körnung;
// zur Gesichtshaut hin läuft der Flaum im Schachbrett aus
var SHV=null;
function shaved(b){
  if (!SHV){ SHV=[]; for (var y=0;y<HEAD.length;y++) for (var x=0;x<HEAD[y].length;x++){ var ch=HEAD[y][x]; if (ch==='t'||ch==='u') SHV.push([x,y,ch]); } }
  SHV.forEach(function(q){ var x=q[0], y=q[1], h=M.hash(x*1.7+3,y*2.9+1);
    if (h<0.1) b.px(x,y,q[2]==='t'?P.e2:P.e1); else if (h>0.93 && q[2]==='t') b.px(x,y,P.q4);
    // Übergang zur Haut vor dem Ohr und an der Schläfe
    var right=HEAD[y][x+1]; if ((right>='3'&&right<='6') && ((x+y)&1)) b.px(x,y,P.p3); });
}
var MOUTH_O=[[35,31,'2'],[36,31,'1'],[37,31,'W'],[38,31,'1'],[39,31,'2'],[35,32,'l'],[36,32,'m'],[37,32,'l'],[38,32,'l'],[35,33,'4'],[36,33,'3'],[37,33,'3'],[38,33,'4']];
var EYES_B=[[27,20,'4'],[28,20,'4'],[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[27,21,'z'],[28,21,'z'],[29,21,'z'],[30,21,'z'],[31,21,'z'],[32,21,'4'],[28,22,'5'],[29,22,'5'],[30,22,'5'],[31,22,'5'],[32,22,'5'],[37,20,'4'],[38,20,'4'],[39,20,'4'],[40,20,'4'],[37,21,'z'],[38,21,'z'],[39,21,'z'],[40,21,'3'],[37,22,'5'],[38,22,'5'],[39,22,'5'],[40,22,'4']];
function paint(b,v){
  jacket(b);
  stamp(b,HEAD,LEG); shaved(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  M.outline(b,P.k1);
}
M.definePortrait('kata',{ paint:paint });
})(M);
