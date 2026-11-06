/* ===== portraits/ertl.js — Frau Ertl (52), Pflegedienstleitung im Haus am Bavariapark (Kapitel 4, München)
   Groß und aufrecht: längliches Gesicht mit hohen Wangenknochen, feine Falten an Augen und Mundwinkeln, Schatten unter den Augen (müde),
   gerade aschblonde Brauen, ruhiger, prüfender Blick, schmale Lippen; kurzes blondgraues Haar, seitlich gescheitelt und über die Stirn
   zur fernen Seite gestrichen, über dem Ohr kurz; randlose Brille (nur die Glaskanten glänzen, ein feiner Bügel zum Ohr).
   Weißer Kasack mit V-Ausschnitt, darüber eine offene dunkelrote Strickjacke. Bestimmt, müde, menschlich.
   Legende HEAD: a–e Haar (e2 e3 e4 s4 s5) · Ziffern Haut (1 p1 … 5 p5, 6 l0) · q kühler Schatten (q3) · r Ohr (p3) · x y Brauen (e2 e3) ·
   w W Augenweiß · i j Iris · I Wimpern und Pupille · u Oberlippe · m Mundspalt · l Unterlippe.
   Brille, Kasack und Strickjacke in Code, Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
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
 "........................................................", // 5
 "........................bccddccb........................", // 6
 ".....................bbccddeddccbbb.....................", // 7
 "...................bbccddeeddcccccbba...................", // 8
 "..................bccddeeddcdcccccbbba..................", // 9
 ".................bccdcdeeddddcdccccbbba.................", // 10
 "................bccdcddeddddcddccccccbba................", // 11
 "...............abccdcddcddeddcdddcccccbba...............", // 12
 "...............abbcdcdcdcddcddd5556dcccbba..............", // 13
 "...............abbccdccdccdd4556665ddccbba..............", // 14
 "...............abbcccdcdcc34555665555ddcba..............", // 15
 "...............abbccdcdcc345555655555544ba..............", // 16
 "...............abbcccdcb34555555555555443a..............", // 17
 "...............abbccdccbb345yxxxx455xxxy443.............", // 18
 "...............abbcccbb33345443344554334443.............", // 19
 "...............abbccr3553344IIIII454III443..............", // 20
 "...............abbcrr4323344WwiIW454wiI443..............", // 21
 "...............abbcrrr3133454Wji45544j4443..............", // 22
 "...............abbrrrr223345qqq455445q4443..............", // 23
 "...............abbrrrr323345665544444544443.............", // 24
 "................abrrrr5333455655444444554443............", // 25
 "................abbrrr43334455544444444565q3............", // 26
 ".................abrr4433344455444444345433.............", // 27
 "..................abr444333444444444332333..............", // 28
 "...................ab333334445444444433443..............", // 29
 "....................b233334444444444uuu443..............", // 30
 ".....................22333444444433mmmm343..............", // 31
 "......................22233444444444ll44443.............", // 32
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
var LEG={ a:P.e2, b:P.e3, c:P.e4, d:P.s4, e:P.s5, '1':P.p1, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, '6':P.l0, q:P.q3, r:P.p3, x:P.e2, y:P.e3,
  w:P.s6, W:P.s5, i:P.c2, j:P.c3, I:P.h1, u:P.p2, m:P.p1, l:P.d4 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Haar: kurze Strähnen vom Scheitel über die Stirn zur fernen Seite, hinten kurz nach unten (nur auf Haarpixeln)
var HR=[P.e2,P.e3,P.e4,P.s4,P.s5];
var STR=[[P.s5,[[26,7],[31,8],[35,10],[38,13]]],[P.e3,[[25,9],[30,10],[35,12],[37,15]]],[P.s4,[[27,10],[32,11],[36,14]]],[P.e3,[[23,9],[19,13],[17,19]]],[P.s4,[[22,10],[19,15],[18,21]]],
  [P.e2,[[20,10],[17,15],[16,22]]],[P.s5,[[30,8],[34,9]]],[P.e2,[[21,18],[21,23]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], pts=s[1]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return HR.indexOf(o)>=0?c:o; }); }); }
// Ohr: Muschel mit innerem Schatten
function ear(b){ b.vl(18,23,26,P.p4); b.px(19,22,P.p4); b.px(20,21,P.p4); b.px(20,23,P.p2); b.px(20,24,P.p1); b.px(20,25,P.p2); b.px(21,24,P.p2); b.px(19,27,P.p4); b.px(20,27,P.p3); b.px(21,26,P.p2); }
// Strickjacke (dunkelrot) über weißem Kasack: gerade, aufrechte Schultern bis an den Rand
var KN=[P.r1,P.r2,P.r3,P.r4];
function knit(lo){ return function(x,y){ var v=lo+((x&1)?0:1); if (x<12 && y<54) v++; if (x>44) v=Math.min(v,lo); return KN[Math.max(0,Math.min(3,v))]; }; }
function back(b){
  b.poly([[1,64],[1.5,56],[4,50.5],[9,47],[15,44.5],[21,43.5],[35,43.5],[42,44.5],[47.5,47],[51.5,51],[53.5,56],[54,64]],knit(1));
  b.poly([[42,45.5],[47.5,47.5],[51.5,51.5],[53.5,57],[54,64],[45,64],[44,54]],knit(0));
  b.line(4,50,8,47,P.r4); b.line(9,46,14,44,P.r3); b.line(9,54,10,63,P.r1); b.line(46,50,47,63,P.r0);
}
function front(b){
  // Kasack: weiß, V-Ausschnitt mit Paspel, Falten
  b.poly([[20,43],[26,44],[30,44.6],[35,43.4],[39,44],[38,53],[36,64],[24,64],[22,53]],function(x,y){ return x>34?P.s4:(x<24?P.s5:P.s6); });
  b.poly([[26,43.5],[30,44.5],[34,43.5],[31.5,52],[30,54],[28.5,52]],P.p3); b.poly([[27.5,44],[30,44.8],[32.5,44],[30.6,50],[30,51],[29.4,50]],P.p4);
  b.line(26,44,30,54,P.s4); b.line(34,44,30,54,P.s3); b.px(30,55,P.s4); b.line(25,57,26,63,P.s4); b.line(34,58,33,63,P.s3);
  // offene Strickjacke: vordere Kanten mit Rippbündchen, nahe Seite im Licht
  b.poly([[9,48],[15,44.5],[20,43.2],[23,49],[24,57],[23.5,64],[17,64],[15,55]],knit(2));
  b.line(20,43,23,50,P.r4); b.line(23,51,24,63,P.r4); b.line(21,44,24,51,P.r1);
  b.poly([[38.5,43.6],[43,44.8],[47,47.5],[44,55],[40,64],[35.5,64],[37,54]],knit(0));
  b.line(38,44,37,54,P.r1); b.line(37,55,36,63,P.r0); b.line(39,44,38,54,P.r3);
  // Brusttasche des Kasacks mit Kugelschreiber
  b.line(36,55,38,55,P.s3); b.vl(37,52,55,P.n2); b.px(37,51,P.m4);
}
// randlose Brille: nur die Glaskanten glänzen (unten und außen), Steg und ein feiner Bügel zum Ohr
function glasses(b){
  var E=P.b4, H=P.l1, R=P.m3;
  b.line(27,23,32,23,E); b.px(26,22,E); b.px(26,21,E); b.px(33,22,E); b.px(32,20,H);
  b.line(36,23,40,23,E); b.px(35,22,E); b.px(41,22,E); b.px(40,20,H);
  b.px(34,21,R); b.px(33,21,R); b.px(35,21,R);
  b.line(22,21,25,21,R); b.px(21,21,P.m2);
  b.px(28,23,H); b.px(37,23,H);
}
var MOUTH_O=[[35,31,'m'],[36,31,'w'],[37,31,'w'],[38,31,'m'],[35,32,'m'],[36,32,'m'],[37,32,'m'],[38,32,'2'],[36,33,'l'],[37,33,'l']];
var EYES_B=[[28,20,'4'],[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[28,21,'I'],[29,21,'I'],[30,21,'I'],[31,21,'I'],[32,21,'3'],[29,22,'4'],[30,22,'4'],[31,22,'4'],
  [36,20,'4'],[37,20,'4'],[38,20,'4'],[36,21,'I'],[37,21,'I'],[38,21,'3'],[37,22,'4']];
// Alter und Müdigkeit: Falten an den Augenwinkeln, Nasolabialfalte, ein Strich unter dem Mundwinkel
function lines(b){ b.px(33,21,P.p3); b.px(33,22,P.p3); b.px(34,23,P.p3); b.px(41,22,P.p3);
  b.line(39,28,36,30,P.p3); b.px(35,30,P.p3); b.px(34,33,P.p3); b.px(26,30,P.p3); b.px(27,31,P.p3); }
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); streaks(b); ear(b); lines(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  glasses(b);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('ertl',{ paint:paint });
})(M);
