/* ===== portraits/nedzad.js — Nedžad Kazandžić (41), Kupferschmied in Kazandžiluk
   Breite Schultern, kräftiger Hals, kurzes dunkles Haar, kurzer dichter dunkler Bart, gerade dichte Brauen, ruhiger Blick;
   kariertes Flanellhemd (blaugrau, offener Kragen) unter einer abgewetzten Lederschürze mit Nackenriemen. Ruhig.
   Legende HEAD: a–e Haar und Bart (h0 h1 h2 h3 w2) · Ziffern Haut (1–4 q1–q4, 5 p4, 6 p5) · B C Brauen · w W Augenweiß ·
   i Iris · I Wimpern/Pupille · l Unterlippe. Hemd (Karo) und Schürze in Code, Kontur mit M.outline. Varianten als Flicken. */
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
".....................cddeedeedddcb......................", // 6
"..................bccddeedeedddddcccb...................", // 7
"................bbcdddeddeddddddddccbbb.................", // 8
"...............abbccddddddddedddddcccbbb................", // 9
"..............abbcccdcddddddddcdddcccbbba...............", // 10
"..............abbbcccccdcddddcddccccbbbba...............", // 11
".............aabbbcccccccccdcccccccccbbbba..............", // 12
".............aabbbccccccccccccccccbcbbbbba..............", // 13
".............aabbbbccccccccbb4555555554443..............", // 14
".............aabbbbcccccccbb45555555555443..............", // 15
".............aaabbbbcccccccb45555555555443..............", // 16
".............aaabbbbbcccccb445555555554443..............", // 17
".............aaabbbbbbccccb4CCBBBBC54CBBBC..............", // 18
".............aaaabbbbbbccb34BBBBBBB44BBBBC3.............", // 19
".............aaabbb343bcc344333333454333343.............", // 20
".............aabbb34543cb45432IIII253III23..............", // 21
".............aabbb45233bc45543wiIW354WiI33..............", // 22
".............aaabb45213cc455543ii34543i333..............", // 23
".............aaabb44323cc456554444556433433.............", // 24
"..............aaab34324cdd45555444455643333.............", // 25
"..............aaab34434cdcd45544444455654333............", // 26
"...............aabb3443ccdcd4444444345565433............", // 27
"...............aabbb333bccdcdd44443432344223............", // 28
"................ab3322bbcccdcddd43cddeddccb.............", // 29
"................43332bbcccccdcdddccddddccbb.............", // 30
".................4332bcccccccccdcbbccccbbba.............", // 31
".................4332abcccccccccba12ll2abb..............", // 32
".................43332abbccccccccbbcdcbbba..............", // 33
"..................4332abbcccccccccccddcbba..............", // 34
"..................43332abbccccccccdddccbba..............", // 35
"..................43332aabbcccccccccccbba...............", // 36
"..................433332aabbbcccccccbbbba...............", // 37
"..................433332aaabbbbbbbbbbaaa................", // 38
"..................4333332aaaaaaaaaaaaa..................", // 39
"..................4333333222222222221...................", // 40
"..................4333333332222222221...................", // 41
"..................4333333333222222221...................", // 42
"..................4333333333322222221...................", // 43
"..................4333333333322222221...................", // 44
"..................4333333333322222221...................", // 45
"..................4333333333322222221..................."  // 46
];
var LEG={ a:P.h0, b:P.h1, c:P.h2, d:P.h3, e:P.w2, '1':P.q1, '2':P.q2, '3':P.q3, '4':P.q4, '5':P.p4, '6':P.p5,
  B:P.h1, C:P.h2, w:P.s5, W:P.s4, i:P.w1, I:P.h0, l:P.p3 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Bartstruktur: kurze Strähnen, oben links etwas Glanz, unten rechts tiefer (nur auf Bartpixeln unterhalb der Ohrläppchen)
var BH=[P.h0,P.h1,P.h2,P.h3,P.w2];
function beard(b){ for (var y=25;y<40;y++) for (var x=17;x<44;x++){ var c=b.get(x,y), k=BH.indexOf(c); if (k<0) continue;
  var hsh=((x*7+y*11)%5+5)%5; if (hsh===0 && k<4 && x+y<62) b.px(x,y,BH[k+1]); else if (hsh===3 && k>0 && (x+y>60 || y>35)) b.px(x,y,BH[k-1]); } }
// Flanellhemd: Karo aus breiten dunklen und feinen hellen Streifen, Licht auf der nahen Schulter
var CK=[P.c0,P.c1,P.c2,P.c3,P.c4];
function plaid(lit){ return function(x,y){ var u=((x-2)%7+7)%7, v=((y-1)%7+7)%7, t=lit;
  if (u<2) t--; if (v<2) t--; if (u===4 || v===4) t++; return CK[Math.max(0,Math.min(4,t))]; }; }
function back(b){
  b.poly([[0,64],[0,52],[2,48.5],[6,46],[12,44],[18,43],[34,43.5],[42,44.5],[48,46.5],[52,49.5],[54.5,54],[56,60],[56,64]],plaid(2));
  b.poly([[0,57],[0,52],[2,48.5],[6,46],[12,44],[17,43.2],[12,46],[7,49],[3,53]],plaid(3));
  b.poly([[44,46],[49,48],[52.5,51],[55,56],[56,64],[47,64],[45.5,55]],plaid(1));
  b.line(9,51,10,63,P.c0); b.line(47,50,48,63,P.c0);
}
// offener Hemdkragen, Lederschürze (Latz mit Ziernaht, Nackenriemen), Brustansatz im Ausschnitt
function front(b){
  b.poly([[21,43.5],[25,45],[30,46],[34,44.5],[36,45.5],[33,51],[30,55],[27,51]],P.q3);
  b.poly([[30,46],[34,44.5],[36,45.5],[33,51],[30.5,54]],P.q2); b.line(25,46,28,47,P.q4);
  b.poly([[18.5,42.8],[22.5,44],[27,48.5],[24,50],[20,47]],plaid(3)); b.line(19,43,22,44,P.c4); b.line(21,48,24,50,P.c0);
  b.poly([[33.5,44.5],[37,43.8],[38,47],[34.5,50],[32.5,47.5]],plaid(1)); b.line(34,45,36,44,P.c3);
  // Nackenriemen
  b.poly([[18,46],[20.5,45.5],[23,53],[20.5,53]],P.w2); b.line(18,47,20,53,P.w3); b.line(21,46,23,52,P.w1);
  b.poly([[38.5,45.5],[41,46],[42,53],[39.5,53]],P.w1); b.line(39,46,40,52,P.w2);
  // Latz
  b.poly([[18.5,53],[43,52.5],[43.5,64],[18,64]],P.w2);
  b.poly([[18.5,53],[27,52.8],[25,64],[18,64]],P.w3);
  b.line(19,53,42,52,P.w4); b.line(19,54,42,53,P.w1);
  b.line(20,56,41,55,P.w1); b.line(20,55,41,54,P.w3);
  b.line(40,56,41,63,P.w1); b.line(42,54,43,63,P.w0);
  [[23,58,P.t3],[24,59,P.w4],[30,60,P.w3],[35,58,P.w3],[36,62,P.w1],[21,61,P.w4]].forEach(function(q){ b.px(q[0],q[1],q[2]); });
  // Nieten an den Ecken
  b.px(20,54,P.y3); b.px(41,53,P.y2);
}
var MOUTH_O=[[34,32,'a'],[35,32,'1'],[36,32,'w'],[37,32,'w'],[38,32,'1'],[39,32,'a'],[35,33,'2'],[36,33,'l'],[37,33,'l'],[38,33,'2']];
var EYES_B=[[30,21,'4'],[31,21,'4'],[32,21,'4'],[33,21,'4'],[29,21,'3'],[30,22,'2'],[31,22,'1'],[32,22,'1'],[33,22,'2'],[31,23,'4'],[32,23,'4'],
  [37,21,'4'],[38,21,'4'],[39,21,'4'],[37,22,'1'],[38,22,'1'],[39,22,'2'],[38,23,'4']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); beard(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('nedzad',{ paint:paint });
})(M);
