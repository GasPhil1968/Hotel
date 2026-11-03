/* ===== portraits/tomaz.js — Tomaž Zupan (Geist, wirkt 21, 14.11.1972), Wehrpflichtiger aus Ljubljana
   Junges schmales Gesicht, Mittelscheitel, schulterlanges braunes Haar über den Ohren, lange Koteletten, schmaler Schnurrbart,
   große offene Augen, die Brauen innen leicht angehoben (nervös, hoffnungsvoll); hellbraune Cordjacke mit breitem Revers,
   darüber der breite Kragen des hellen Hemds.
   In natürlichen Farben gemalt; das Spiel färbt Geister ein (M.ghostLut). Deshalb trennen Helligkeitsstufen die Formen:
   Haut l0 p5 q4 q3 q2 q1 (sechs Stufen auch eingefärbt), Haar h0 h2 h3 w2 w3 w4 (dunkel), Jacke w3–w5 (mittel bis hell),
   Hemd s4–s6 (hell), Augenweiß s6, Iris w1, Pupille k0, Brauen und Wimpern h0–h3.
   Legende HEAD: a–f Haar · Ziffern Haut (1 q1 … 4 q4, 5 p5, 6 l0) · w W Augenweiß · i Iris · I Pupille · J Wimpern · l Unterlippe.
   Jacke, Kragen und Haarsträhnen in Code, Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
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
"......................bcddeeddcaccb.....................", // 6
"...................bcddeefeeddcacddccb..................", // 7
".................bccddeeededdcbabcdddccb................", // 8
"...............abccdddeddeddccbbccddddccb...............", // 9
"..............abccdddddedddccbccbccddddccb..............", // 10
".............abbccddddddeddccbbccbccddcccbb.............", // 11
".............abbcccdddddeddccb3455543bcdccb.............", // 12
".............abbcccdddddeddcb345565543bcdcb.............", // 13
".............abbbcccdddddedcb3455555443cdcb.............", // 14
".............abbbcccddddedcb34555555443bdcb.............", // 15
".............abbbbcccddddedc44555555443bdcb.............", // 16
".............abbbbccccdddedc345cbbb55bc4dcb.............", // 17
".............abbbbcccddddec3cbbbc4454cbbdcb.............", // 18
".............abbbbccccdddec3443444454344dcb.............", // 19
".............abbbbcccddddeb43JJJJJ354JJJ3dc.............", // 20
".............abbbbcccddddeb43WwiIw353WiI3dc.............", // 21
".............abbbbcccddddeb443WiiW4543ii33c.............", // 22
".............abbbbcccddddeb454333455543343c.............", // 23
".............abbbbcccddddeb4565444555433443.............", // 24
".............abbbbccccdddeb5544444455543333.............", // 25
".............abbbbccccdddbb4443444444555433.............", // 26
".............abbbbccccdddbb4433444434456543.............", // 27
".............abbbbccccdddbb4334444433234223.............", // 28
".............abbbbccccdddbbb3344443bccccb43.............", // 29
".............abbbbccccdddbbb344444b33333343.............", // 30
".............abbbbccccdddbbb34444432111233..............", // 31
".............abbbbccccdddbbb34444443lll343..............", // 32
".............abbbbccccddddc334444444334443..............", // 33
".............abbbbccccdddd2334444445554433..............", // 34
".............abbbbccccdddd2233444445444433..............", // 35
".............abbbbccccdddd222334444444332...............", // 36
".............abbbbcccccddd32222334443321................", // 37
".............abbbbcccccddd33222222222bccdc..............", // 38
".............abbbbbccccddd4333322221bccddc..............", // 39
".............abbbbbcccccdd4333342221bcdddc..............", // 40
".............abbbbbcccccd44333342221bcddcb..............", // 41
".............aabbbbbccccd4433333221abcddcb..............", // 42
"............aabbbbbbccccd4433333221abccdcb..............", // 43
"............aabbbbbbcccd44333333221abccdcb..............", // 44
"............abbbbbbcccd443333333221abccdb...............", // 45
".............abbbbbccd4433333333221abcccb..............."  // 46
];
var LEG={ a:P.h0, b:P.h2, c:P.h3, d:P.w2, e:P.w3, f:P.w4, '1':P.q1, '2':P.q2, '3':P.q3, '4':P.q4, '5':P.p5, '6':P.l0,
  w:P.s6, W:P.s4, i:P.w1, I:P.k0, J:P.h0, l:P.d4 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Haarsträhnen: vom Scheitel über die Seite nach unten, Glanz oben links, dunkle Fugen dazwischen (nur auf Haarpixeln)
var HR=[P.h0,P.h2,P.h3,P.w2,P.w3,P.w4];
var STR=[[P.w4,[[29,7],[25,8],[21,10],[18,14]]],[P.w3,[[27,9],[22,11],[19,16],[17,22]]],[P.h2,[[30,9],[26,11],[23,15],[21,22],[20,30]]],
  [P.w3,[[24,13],[22,19],[21,26],[21,34]]],[P.h2,[[17,18],[16,26],[16,36],[15,43]]],[P.w2,[[19,24],[18,32],[18,40]]],[P.h2,[[23,31],[22,38],[21,44]]],
  [P.w3,[[34,9],[37,11],[39,15]]],[P.h2,[[36,12],[39,16],[40,20]]],[P.w3,[[15,20],[14,28],[14,36]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], pts=s[1]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return HR.indexOf(o)>=0?c:o; }); }); }
// Cordjacke: hellbraun mit senkrechten Rippen, breites Revers; Hemd mit breitem, spitzem Kragen über dem Revers
function cord(lit){ return function(x,y){ var t=lit+((x&1)?0:-1); return [P.w2,P.w3,P.w4,P.w5][Math.max(0,Math.min(3,t))]; }; }
function back(b){
  b.poly([[1,64],[1.5,57],[4,52],[9,48],[15,45.8],[21,45],[34,45.5],[42,46.5],[48,49],[52,53],[54,58],[54.5,64]],cord(2));
  b.poly([[1,60],[1.5,57],[4,52],[9,48],[14,46.2],[10,49.5],[6,53],[3,58]],cord(3));
  b.poly([[43,48],[48,49.5],[52,53],[54,58],[54.5,64],[46,64],[45,56]],cord(1));
  b.line(10,54,11,63,P.w2); b.line(46,51,47,63,P.w2);
}
function front(b){
  // Hemd im Ausschnitt
  b.poly([[22,45.5],[26,46.5],[31,47],[35,46],[36.5,47],[33,54],[30.5,60],[27.5,54]],P.s5);
  b.poly([[31,47.5],[36.5,47],[33,54],[31,58]],P.s4); b.px(30,52,P.s3); b.px(31,57,P.s3);
  // Revers (breit, 70er Jahre)
  b.poly([[13,49],[19,46.5],[23,47.5],[27.5,54],[30,60],[30,64],[26,64],[22,57],[16,52]],cord(3)); b.line(23,48,29,59,P.w5); b.line(16,52,23,58,P.w2);
  b.poly([[36.5,47],[41,47.5],[43,50.5],[38.5,56],[33.5,62],[31,64],[31,60],[34,54]],cord(1)); b.line(37,48,34,54,P.w4); b.line(42,51,38,56,P.w2);
  // breiter Hemdkragen über dem Revers
  b.poly([[19,45],[23,45.6],[26,48],[24,53.5],[22.5,55],[20,50],[17,48.5]],P.s6); b.line(18,48,22,54,P.s4); b.line(20,46,23,46,P.l1);
  b.poly([[34.5,46],[37.5,45.6],[40.5,48],[38,52.5],[36,49.5]],P.s5); b.line(36,50,39,52,P.s4); b.line(35,46,37,46,P.s6);
  b.line(30,60,30,64,P.w2); b.px(31,62,P.w1);
}
var MOUTH_O=[[35,31,'2'],[36,31,'1'],[37,31,'w'],[38,31,'1'],[39,31,'2'],[35,32,'3'],[36,32,'1'],[37,32,'1'],[38,32,'2'],[36,33,'l'],[37,33,'l'],[38,33,'3']];
var EYES_B=[[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[33,20,'4'],[29,21,'I'],[30,21,'2'],[31,21,'1'],[32,21,'1'],[33,21,'2'],[30,22,'4'],[31,22,'4'],[32,22,'4'],[33,22,'4'],
  [37,20,'4'],[38,20,'4'],[39,20,'4'],[37,21,'2'],[38,21,'1'],[39,21,'1'],[38,22,'4'],[39,22,'4']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); streaks(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('tomaz',{ paint:paint });
// im Spiel ein Geist: Porträt in seiner Geisterfarbe (M.ghostLut)
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.tomaz=true;
})(M);
