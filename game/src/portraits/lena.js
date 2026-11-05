/* ===== portraits/lena.js — Lena Zelenika (14), Davors Tochter, Münchner Schülerin (Kapitel 3, Mostar)
   Junges, weiches Gesicht mit runden Wangen und etwas Röte, große helle Augen, kleine Nase; langes, glattes hellbraunes
   Haar mit geradem Pony bis knapp über die Brauen, Glanz oben auf dem Kopf, eine Strähne fällt vorn über die Schulter.
   Große Kopfhörer liegen um den Hals; pinker Anorak mit Stehkragen und Reißverschluss. Ruhig, neugierig, ein wenig skeptisch.
   Legende HEAD: a–e Haar und Brauen (w2 w3 w4 w5 d6) · Ziffern Haut (2 p2, 3 p3, 4 p4, 5 p5, 6 l0) · t Wangenröte (d5) ·
   w W Augenweiß · L Glanz · i j Iris · I Wimpern und Pupille · u Oberlippe · m Mundspalt · l Unterlippe.
   Anorak, Kopfhörer und Haarsträhnen in Code, Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 ".......................bccdddccb........................", // 5
 "....................bccddddddcccccb.....................", // 6
 "..................bccdeeeeddddcccccb....................", // 7
 ".................bccdeeeeedddddcccccb...................", // 8
 "................bccddeeedddddddccccbb...................", // 9
 "...............abccdddddddddcddcccccbbb.................", // 10
 "...............abccddcddddddcdcdccccccbbb...............", // 11
 "..............abccdcddcdddddddcdccccccbbb...............", // 12
 "..............abccdcddcdcdddddcdcccccccbbb..............", // 13
 "..............abccdcddcdcdddddcdccccccbbbb..............", // 14
 "..............abccdcddcdcddddcdcccccccbbbb..............", // 15
 "..............abccdcddcdcdddcdcdcccccbbbbb..............", // 16
 "..............abccdcddcdcbbcbcbbcbbbcbbbbaa.............", // 17
 "..............abcdddedcdcb3444444444444333ba............", // 18
 "..............abccdcddcdca34bbba454abb4333ba............", // 19
 "..............abccdcddcdca34IIIII45IIII333ba............", // 20
 "..............abccdcddcdca34WwLIj45wiI3433ba............", // 21
 "..............abccdcddcdca344Wjii454ii4433ba............", // 22
 "..............abccdcddcdca3554445554444433ba............", // 23
 "..............abccdcddcdca4566555545543443ba............", // 24
 "..............abccdcddcdca4556555444553343ba............", // 25
 "..............abccdcddcdca455tt54444456343ba............", // 26
 "..............abccdcddcdca3455544444355343ba............", // 27
 "..............abccdcddcdca3444444443323343ba............", // 28
 "..............abccdcddcdca344444444uuuu333ba............", // 29
 "..............abccdcddcdca344444443mmmm333ba............", // 30
 "..............abcbcccdcbca334444444lll4333ba............", // 31
 "..............abcbcccdcbca334444454334433bba............", // 32
 "..............abcbcccdcbca23344454444433abba............", // 33
 "..............abcbcccdcbcaa233444444332aabba............", // 34
 "..............abcbcccdcbcaa33322333322abbba.............", // 35
 "..............abcbcccdcbcaa3344433332aabbba.............", // 36
 "..............abcbcccdcbcaa334443332aabbba..............", // 37
 "..............abcbcccdcbcaa334443322aabbba..............", // 38
 "..............abcbcccdcbcaa334443322aabba...............", // 39
 "..............abcbcccdcbcaa334443322aabba...............", // 40
 "..............abcbcccdcbcaa334443322aaba................", // 41
 "..............abcbcccdcbcaa334443322aab.................", // 42
 "..............abcbcccdcbcaa3344433......................", // 43
 "..............abcbcccdcbcaa3344433......................", // 44
 "...............bccdcddcdcb..............................", // 45
 "...............bccdcddcdcb..............................", // 46
 "...............abcdcddcdcb..............................", // 47
 "................bcdcddcdb...............................", // 48
 "................bcdcdcdcb...............................", // 49
 "................abdcdcdb................................", // 50
 ".................abcdcb.................................", // 51
 ".................abcdb..................................", // 52
 "..................abb...................................", // 53
 "........................................................", // 54
 "........................................................", // 55
];
var LEG={ a:P.w2, b:P.w3, c:P.w4, d:P.w5, e:P.d6, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, '6':P.l0, t:P.d5,
  w:P.s6, W:P.s5, L:P.l1, i:P.c3, j:P.c2, I:P.h1, u:P.d4, m:P.d3, l:P.d5 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Haarsträhnen: vom Scheitel nach unten, Glanz oben links, dunkle Fugen (nur auf Haarpixeln)
var HR=[P.w2,P.w3,P.w4,P.w5,P.d6];
var STR=[
  // Seitenvorhang: lange senkrechte Strähnen
  [P.w3,[[23,9],[19,14],[17,26],[17,44]]],[P.w3,[[26,9],[22,15],[21,30],[21,50]]],[P.w5,[[21,12],[19,22],[19,40]]],[P.w3,[[15,16],[15,30],[16,44]]],
  [P.w5,[[24,12],[23,22],[23,36],[22,46]]],
  // Pony: vom Wirbel fächerförmig nach vorn bis zur Kante
  [P.w3,[[25,7],[28,11],[29,16]]],[P.w5,[[26,7],[30,11],[31,16]]],[P.w3,[[27,7],[33,11],[34,16]]],[P.w3,[[28,7],[36,11],[38,16]]],[P.w5,[[29,7],[35,10],[36,16]]],
  [P.w3,[[30,7],[39,12],[41,16]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], pts=s[1]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return HR.indexOf(o)>=0?c:o; }); }); }
// Anorak (pink): schmale Schultern, Licht von links oben
function back(b){
  b.poly([[2,64],[3,57],[6,52],[11,48.5],[18,46.5],[25,45.5],[36,45.5],[42,46.5],[47,49],[50.5,53],[52.5,58],[53,64]],P.d3);
  b.poly([[2,62],[3,57],[6,52],[11,48.5],[16,47],[10,51.5],[6,55.5],[4,60]],P.d4);
  b.poly([[41,48],[47,50],[50.5,53.5],[52.5,58],[53,64],[44,64],[43,56]],P.d2);
  b.line(9,56,10,63,P.d2); b.line(44,52,45,63,P.d1); b.line(5,58,6,63,P.d2);
}
function front(b){
  // Stehkragen, oben ein Stück geöffnet (helles Shirt darunter), Reißverschluss mit Zipper
  b.poly([[29.5,44.2],[34,44.2],[32.4,48.6],[31.2,48.6]],P.s5); b.px(32,45,P.s4);
  b.poly([[24.5,42],[30,44],[31,48.8],[25.5,46.8]],P.d4); b.line(25,42,29,44,P.d5); b.line(26,47,30,48,P.d2);
  b.poly([[33.5,44],[38.5,41.6],[39,45.6],[32.8,48.8]],P.d2); b.line(34,44,38,42,P.d3);
  b.line(31,49,31,63,P.d1); b.line(32,49,32,63,P.m2); b.px(32,50,P.s6); b.px(32,51,P.m4); b.px(32,52,P.m3);
  // Kopfhörer um den Hals: die Muscheln liegen vorn auf den Schultern (Polster zum Hals hin), der Bügel läuft hinten herum
  stampAt(b,CUP_N,16,42); stampAt(b,CUP_F,38,41);
  b.line(38,40,37,38,P.m1);
}
// Kopfhörermuscheln: B Schale, C Schale im Licht, D heller Rand, K Polster (zum Hals hin), L Logo
var CUP_LEG={ B:P.m1, C:P.m2, D:P.m3, K:P.k2, L:P.s6 };
var CUP_N=["..BBBBB..",".BDDCCBB.","BDCCCCBKB","BDCLCCBKB","BCCCCBKKB",".BCCBKKB.","..BBBBB.."];
var CUP_F=[".BBB.","BDCBB","BCLBK","BCCBK","BBBKB",".BBB."];
function stampAt(b,rows,x0,y0){ for (var y=0;y<rows.length;y++) for (var x=0;x<rows[y].length;x++){ var ch=rows[y][x]; if (ch!=='.') b.px(x0+x,y0+y,CUP_LEG[ch]); } }
var MOUTH_O=[[35,30,'3'],[36,30,'2'],[37,30,'w'],[38,30,'2'],[39,30,'m'],[36,31,'m'],[37,31,'2'],[38,31,'m'],[36,32,'l'],[37,32,'l'],[38,32,'4']];
var EYES_B=[[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[33,20,'4'],[29,21,'I'],[30,21,'I'],[31,21,'I'],[32,21,'I'],[33,21,'3'],[29,22,'5'],[30,22,'4'],[31,22,'4'],[32,22,'4'],[33,22,'4'],
  [37,20,'4'],[38,20,'4'],[39,20,'4'],[37,21,'I'],[38,21,'I'],[39,21,'3'],[38,22,'4'],[39,22,'4']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); streaks(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('lena',{ paint:paint });
})(M);
