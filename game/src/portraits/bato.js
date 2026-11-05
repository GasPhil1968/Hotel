/* ===== portraits/bato.js — Bato Brkić (Geist, † 2006, wirkt 71), Fährmann an der Neretva bei Skela (Kapitel 3)
   Groß und breit: großer Kopf unter einer alten dunklen Schiebermütze (Schirm wirft Schatten auf die Stirn), weißes Haar im Nacken,
   buschige weiße Brauen, tief liegende, zusammengekniffene Augen, breite, gerötete Nase, wettergegerbte Haut; voller, gestutzter
   weißer Bart mit Schnurrbart. Dicker blauer Strickpullover mit Rollkragen, darüber der Latz der olivgrünen Wathose mit
   Hosenträgern. Ernst, stur, wachsam.
   In natürlichen Farben gemalt; das Spiel färbt Geister ein (M.ghostLut mit M.GHOST_OVR.bato aus 14_k3_cast_b.js: Bart s5/s6
   bleibt weiß, Pullover c-Töne bleiben blau, Wathose g → dunkles Oliv, Träger w1 → m0). Deshalb trennen Helligkeitsstufen die Formen:
   Haut q1–q4, p4, p5 (eingefärbt sechs Stufen, kein l0), Bart und Brauen s3–s6 heller als jede Hautstufe, Mütze m0–m3 dunkel,
   Augen und Mund q1/h1 deutlich dunkler.
   Legende HEAD: a–d Mütze (m0 m1 m2 m3) · Ziffern Haut (1–4 q1–q4, 5 p4, 6 p5) · r Röte (p3) · e f g h Haar, Brauen, Bart
   (s3 s4 s5 s6) · W Augenweiß · i Iris · I Wimpern und Pupille. Pullover, Wathose und Träger in Code, Kontur mit M.outline.
   Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "......................bccdddccbb........................", // 4
 "..................bccddddddcccccbbba....................", // 5
 "................bccdddddddccccccbbbbba..................", // 6
 "..............abccddddddcdccccccbbbbbbaa................", // 7
 ".............abccdddddcdcdcccccccbbbbbbaa...............", // 8
 "............abbccddddcdcdccccccccbbbbbbbaa..............", // 9
 "............abbccdddcdcdcccccccccbbbbbbbbaa.............", // 10
 "...........abbcccddcdcccccccccccbbbbbbbbbaaa............", // 11
 "...........abbcccdcdcccccccccccbbbbbbbbbbaaaa...........", // 12
 "...........abbcccccccccccccccbbbbbbbbbbbbaaaaa..........", // 13
 "...........abbbccccccccccbbbbbbbccdddddddddcccba........", // 14
 "............abbbcccccccbbbbbbaaaaaaaaaaaaaaaaab.........", // 15
 "............aabbbbbbbbbbbaa22222222222222211............", // 16
 "............efffgfggfgfgffe2fggf333333fggff2............", // 17
 "............effgfgffefgffgf3efggfe343efgfe32............", // 18
 "............effgfgfe4553fgf32212223432122332............", // 19
 "............effgfgfe4323gfg33IIIII343IIII332............", // 20
 "............effgfgfe4313fgf233WiIW354WiI3343............", // 21
 "............effgfgfe4223gff23433344543334443............", // 22
 "............effgfgfe4323fgf365544445543444443...........", // 23
 ".............effgffe4533gfg45rr54444565434443...........", // 24
 ".............effgffe4433ggf45r5443444565434443..........", // 25
 "..............effgfe.433gggf454434444456r54443..........", // 26
 "..............effgfe.433ggfgf44334444345rr5443..........", // 27
 "...............effgfe433gghggfg33443323rr12332..........", // 28
 "................effgeefgghgggggfggggghhhgggfe...........", // 29
 ".................effeefggghgggfggffghhhhhgggf...........", // 30
 "....................eefgggggggfggeefgggggffee...........", // 31
 "....................eefgggggggfggfgf111112ffe...........", // 32
 "....................eefgggggggggfggff44fgffe............", // 33
 ".....................efgggghggggggfggggfggffe...........", // 34
 ".....................eefgggghgggggfgggfgffee............", // 35
 "......................eefggggggggfgggffgffee............", // 36
 ".......................eeffggggggfgggffgfee.............", // 37
 "........................eeffgggfggfggffffee.............", // 38
 ".........................eefffggfgffffeeee..............", // 39
 "...........................eeffffffffeeee...............", // 40
 ".............................eeeffffeee.................", // 41
 "...............................eeeeee...................", // 42
 "........................................................", // 43
 "........................................................", // 44
 "........................................................", // 45
 "........................................................", // 46
];
var LEG={ a:P.m0, b:P.m1, c:P.m2, d:P.m3, '1':P.q1, '2':P.q2, '3':P.q3, '4':P.q4, '5':P.p4, '6':P.p5, r:P.p3,
  e:P.s3, f:P.s4, g:P.s5, h:P.s6, W:P.s4, i:P.c3, I:P.h1 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Bartsträhnen und Mützennähte (nur auf den jeweiligen Pixeln)
var BEARD=[P.s3,P.s4,P.s5,P.s6], CAP=[P.m0,P.m1,P.m2,P.m3];
var STR=[[P.s4,BEARD,[[26,30],[27,36],[29,40]]],[P.s4,BEARD,[[30,31],[31,37],[32,41]]],[P.s4,BEARD,[[35,34],[35,39]]],[P.s3,BEARD,[[39,33],[38,38]]],[P.s6,BEARD,[[24,29],[24,33]]],
  [P.m1,CAP,[[20,7],[17,11],[15,15]]],[P.m1,CAP,[[29,5],[33,9],[36,13]]],[P.m3,CAP,[[24,5],[27,8]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], on=s[1], pts=s[2]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return on.indexOf(o)>=0?c:o; }); }); }
// dicker Strickpullover (blau, Zopfmuster): breite Schultern bis an den Rand
function knit(lo){ return function(x,y){ var v=lo, k=(x+(y>>1))%6; if (k===0) v--; else if (k===2) v++; if (x<10&&y<54) v++; if (x>45) v=Math.min(v,lo); return [P.c0,P.c1,P.c2,P.c3][Math.max(0,Math.min(3,v))]; }; }
function back(b){
  b.poly([[0,64],[0.5,55],[3,49.5],[8,45.5],[15,43],[22,42],[36,42],[43,43],[49,45.5],[53,49.5],[55,55],[55.5,64]],knit(2));
  b.poly([[43,44],[49,46.5],[53,50],[55,55],[55.5,64],[46,64],[45,55]],knit(1));
  // Rollkragen unter dem Bart
  b.poly([[17,45.5],[19.5,40.5],[25,38.5],[39,38.5],[44,40.5],[45,45],[39,46.5],[24,46.5]],function(x,y){ return (x&1)?P.c2:P.c3; });
  b.line(18,45,23,46,P.c1); b.line(40,46,44,45,P.c0);
}
function front(b){
  // Latz der Wathose mit Tasche und die Hosenträger über den Schultern
  b.poly([[15,64],[15.5,54.5],[17,53],[41,53],[42.5,54.5],[43,64]],function(x,y){ return x<20?P.g3:(x>38?P.g1:P.g2); });
  b.line(17,53,41,53,P.g3); b.line(16,54,16,63,P.g1); b.line(42,55,42,63,P.g0);
  b.poly([[24,56],[33,56],[33,61],[24,61]],P.g1); b.line(24,56,33,56,P.g3); b.line(25,57,32,57,P.g0);
  b.poly([[16.5,53.5],[11.5,44.5],[14,44],[19,53.5]],P.w1); b.line(12,45,17,53,P.w2);
  b.poly([[39.5,53.5],[43,45],[45.5,45.6],[42,53.5]],P.w0); b.line(43,46,40,53,P.w1);
  b.rect(17,52,2,2,P.m3); b.px(17,52,P.m4); b.rect(40,52,2,2,P.m2); b.px(40,52,P.m3);
}
var MOUTH_O=[[36,32,'1'],[37,32,'1'],[38,32,'W'],[39,32,'1'],[40,32,'1'],[41,32,'2'],[36,33,'1'],[37,33,'1'],[38,33,'1'],[39,33,'2'],[37,34,'4'],[38,34,'4']];
var EYES_B=[[30,21,'I'],[31,21,'I'],[32,21,'I'],[33,21,'3'],[29,20,'3'],[30,20,'3'],[31,20,'3'],[32,20,'3'],[33,20,'3'],[37,20,'3'],[38,20,'3'],[39,20,'3'],[40,20,'3'],[37,21,'I'],[38,21,'I'],[39,21,'3']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); streaks(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('bato',{ paint:paint });
// im Spiel ein Geist: Porträt in seiner Geisterfarbe (M.ghostLut)
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.bato=true;
})(M);
