/* ===== portraits/vlado.js — Vlado Rajić (64), Vulkaniseur am Westufer (Kapitel 3, Mostar)
   Groß, hager, leicht gebeugt: langes, ausgezehrtes Gesicht mit tiefen Falten (Stirn, Krähenfüße, Nasolabialfalten,
   eingefallene Wangen), kurz geschorenes graues Haar, graue Bartstoppeln, schwere graue Brauen über tief liegenden Augen,
   lange knochige Nase. Die Zigarette steckt im Mundwinkel (in allen Varianten, beim Sprechen hängt sie schiefer),
   ein dünner Rauchfaden steigt auf. Dunkelblauer Arbeitsoverall, oben offen, darunter ein kariertes Flanellhemd.
   Legende HEAD: Ziffern Haut (1–5 q0–q4, 6 p4, 7 p5) · a–f Haar (m0 m1 m2 m3 m4 s5) · g h j Stoppeln (m1 m2 m3) ·
   w W Augenweiß · i Iris · k Pupille · z Lidstrich.
   Kleidung, Zigarette und Rauch in Code; Kontur mit M.outline (der Rauch kommt danach, ohne Kontur).
   Varianten: MOUTH und EYES als Flicken. */
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
"......................cddeeeeeddcc......................", // 5
"....................cddeeeedeeeddccb....................", // 6
"...................cdddeeeeedeeedddccb..................", // 7
"..................bcddeeedeeeeeeddddccb.................", // 8
".................bcdddeeeedeeeedddddccb.................", // 9
"................bccdddedddeeddddddcccbb.................", // 10
"................bccdddeddeddddccbc6666554...............", // 11
"...............bbccdddddedddccc5666666554...............", // 12
"...............bbcddddeddddcc6655555544443..............", // 13
"...............bbcdddedddcc566667776665543..............", // 14
"...............bbccddddddcc565555566654443..............", // 15
"...............abccdddddcc5666677766655443..............", // 16
"...............abccdddddcc56666666466555443.............", // 17
"...............abccdddccdc54cddddc35cdddc43.............", // 18
"...............abccc454cdc4bbbbbbb34bbbbb43.............", // 19
"...............abcc45443dc4344444356444433..............", // 20
"...............abcc54232dc43zzzzz3564zzzz3..............", // 21
"...............abcc531425443Wwiki3563Wikz3..............", // 22
"...............abcc5314355444Wii445644ii43..............", // 23
"...............abcc532335554433334566433333.............", // 24
"................abc443234435666655556644433.............", // 25
"................abca543334555554445566555433............", // 26
".................aba454333444444544566655543............", // 27
".................abaa44323333334444544556543............", // 28
"..................aa33332233334444332233332.............", // 29
"...................33323322333444434443333..............", // 30
"....................3323433333444533443343..............", // 31
".....................323444444445543333343..............", // 32
"......................32444444445432222223..............", // 33
"......................3324444444544345543...............", // 34
"......................3332444444444433343...............", // 35
"......................333224444445555543................", // 36
"......................333322444445565543................", // 37
"......................333332244444555543................", // 38
"......................333333322344444433................", // 39
".......................333333222233332..................", // 40
"......................34333333322222223.................", // 41
"......................3443333332222334..................", // 42
"......................344333333222343...................", // 43
"......................334433333222233...................", // 44
"......................334433333322233...................", // 45
"......................3344333333222333.................."  // 46
];
var LEG={ '1':P.q0, '2':P.q1, '3':P.q2, '4':P.q3, '5':P.q4, '6':P.p4, '7':P.p5,
  a:P.m0, b:P.m1, c:P.m2, d:P.m3, e:P.m4, f:P.s5, g:P.m1, h:P.m2, j:P.m3,
  w:P.s4, W:P.s3, i:P.w1, k:P.h0, z:P.h1 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]||P[list[i][2]]); }
// kariertes Flanellhemd: rotbraun mit dunklen und hellen Linien
function check(x,y){ var h=(y%3===0), v=(x%3===1); if (h&&v) return P.r1; if (h) return P.r2; if (v) return P.t2; return P.r3; }
// Overall (dunkelblau), hagere hängende Schultern; vorn offen (Reißverschluss halb auf), darunter das karierte Hemd
function body(b){
  b.poly([[0,64],[0,57],[2,52.5],[6,49.5],[12,47.6],[18,46.2],[22,45.2],[37,45.2],[43,46.6],[48,48.8],[51.5,52],[54,57],[55.5,64]],P.n1);
  // Licht auf der nahen Schulter und Brust, Schulternaht
  b.poly([[0,59],[0,57],[2,52.5],[6,49.5],[12,47.6],[18,46.2],[21,46.6],[15,49.2],[9,51.6],[5,55],[2,60]],P.n2);
  b.poly([[4,64],[5,58],[8,54.5],[13,52.5],[19,52.6],[22,57],[20,64]],P.n2);
  b.line(2,53,6,50,P.n3); b.line(7,49,12,47.6,P.n3); b.line(13,47,17,46.4,P.n3);
  b.line(9,53,11,63,P.n0); b.line(5,57,6,63,P.n1); b.line(14,55,17,63,P.n1);
  // Schatten auf der fernen Seite
  b.poly([[43,47],[48,49],[51.5,52],[54,57],[55.5,64],[45,64],[44.5,56]],P.n0);
  b.line(46,51,47,58,P.n1);
  // Hemd im Ausschnitt (kariert), rechts im Schatten
  b.poly([[23,45],[28,46],[33,46],[37,45],[36,50],[31.5,58],[27.5,51]],function(x,y){ var c=check(x,y); return (x>32||y>53)?M.DN[c]:c; });
  // Hemdkragen: zwei Spitzen auf der Brust
  b.poly([[21.5,43.2],[25,44.4],[29,49.6],[27.2,51.2],[22.6,47.4]],function(x,y){ return check(x,y); });
  b.line(22,44,28,50,P.r4);
  b.poly([[37.8,43.2],[39,45.8],[35.6,50.6],[33.4,49.6],[35.4,45.4]],function(x,y){ return M.DN[check(x,y)]; });
  b.line(37,44,34,49,P.r1);
  // Overallkragen, flach auf den Schultern, und die offenen Vorderkanten
  b.poly([[16,46.6],[21,45],[24,46.4],[28.6,52.4],[25.6,53.4],[18.6,49.6]],P.n2);
  b.line(21,45,24,47,P.n3); b.line(24,47,28,52,P.n3); b.line(19,50,25,53,P.n0);
  b.line(28,53,31,58,P.n2); b.line(27,54,30,59,P.n0);
  b.poly([[38.4,45],[43,46.6],[41.4,50.6],[35.2,52.4],[36.6,48]],P.n1); b.line(39,46,37,50,P.n2); b.line(41,50,36,52,P.n0);
  b.line(35,53,32,58,P.n0);
  // Reißverschluss unten
  for (var y=58;y<64;y++){ b.px(31,y,(y&1)?P.m2:P.m3); b.px(32,y,P.n0); }
  // Brusttasche mit Klappe auf der fernen Seite
  b.line(37,56,43,55,P.n0); b.line(37,57,43,56,P.n2); b.line(43,56,43,62,P.n0); b.px(40,56,P.m3);
}
// Zigarette im fernen Mundwinkel: Filter, Papier, Glut; beim Sprechen hängt sie schiefer
var CIG_N=[[40,33,'y2'],[41,33,'y3'],[42,33,'s6'],[43,33,'s6'],[44,34,'s5'],[45,34,'s5'],[46,34,'m4'],[47,34,'t4']];
var CIG_O=[[40,34,'y2'],[41,34,'y3'],[42,35,'s6'],[43,35,'s6'],[44,36,'s5'],[45,36,'s5'],[46,37,'m4'],[47,37,'t4']];
// Rauchfaden: dünn, mit Lücken, steigt in einer Schlinge nach oben
var SMOKE=[[48,32,'m3'],[48,31,'m4'],[49,30,'m3'],[49,28,'m4'],[50,27,'m3'],[50,26,'m4'],[49,24,'m3'],[49,23,'m4'],[50,21,'m3'],[51,20,'m3'],[51,18,'m2'],[50,16,'m2']];
function cig(b,list){ list.forEach(function(q){ b.px(q[0],q[1],P[q[2]]); }); }
function smoke(b,dy){ SMOKE.forEach(function(q){ var x=q[0], y=q[1]+dy; if (b.get(x,y)===M.T) b.px(x,y,P[q[2]]); }); }
// graue Stoppeln: unregelmäßig gestreut über Kiefer, Kinn, Oberlippe und untere Wangen (nicht auf den Lippen);
// die Farbe richtet sich nach dem Hautton darunter (im Schatten dunkler, im Licht heller)
var BEARD=[[23.5,22],[25.5,24.5],[28,28.6],[31,30.4],[34.5,30.6],[37,30.2],[40,30.4],[42,31],[41.6,36],[40.2,39.4],[37,41.4],[33,41.6],[29,39.6],[25,35.6],[22.6,31]];
var STUB={}; STUB[P.q1]=[P.s0,P.s1]; STUB[P.q2]=[P.s1,P.s2]; STUB[P.q3]=[P.s2,P.s3]; STUB[P.q4]=[P.s3,P.s4]; STUB[P.p4]=[P.s3,P.s4];
function stubble(b,dens){
  b.poly(BEARD,function(x,y){ var c=b.get(x,y), s=STUB[c]; if (!s) return c; if (y>=33&&y<=34&&x>=35&&x<=40) return c;
    var h=M.hash(x*1.31+7,y*2.17+3); if (h>dens) return c; return s[M.hash(y*3.7,x*0.9)<0.55?0:1]; });
}
var MOUTH_O=[[35,33,'2'],[36,33,'1'],[37,33,'s3'],[38,33,'1'],[39,33,'1'],[40,33,'2'],[35,34,'3'],[36,34,'1'],[37,34,'1'],[38,34,'1'],[39,34,'2'],[36,35,'4'],[37,35,'5'],[38,35,'5'],[39,35,'4'],[36,36,'3'],[37,36,'3'],[38,36,'4']];
var EYES_B=[[28,21,'4'],[29,21,'4'],[30,21,'4'],[31,21,'4'],[32,21,'4'],[28,22,'3'],[29,22,'z'],[30,22,'z'],[31,22,'z'],[32,22,'z'],[28,23,'4'],[29,23,'4'],[30,23,'4'],[31,23,'4'],[32,23,'4'],
  [37,21,'4'],[38,21,'4'],[39,21,'4'],[40,21,'4'],[37,22,'z'],[38,22,'z'],[39,22,'z'],[40,22,'3'],[37,23,'4'],[38,23,'4'],[39,23,'4'],[40,23,'4']];
function paint(b,v){
  body(b);
  stamp(b,HEAD,LEG); stubble(b,0.42);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  cig(b,v.mouth?CIG_O:CIG_N);
  M.outline(b,P.k1);
  smoke(b,v.mouth?3:0);
}
M.definePortrait('vlado',{ paint:paint });
})(M);
