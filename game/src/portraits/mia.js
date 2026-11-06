/* ===== portraits/mia.js — Mia Brandl (7), Anas Tochter (Kapitel 4, München)
   Ein Kindergesicht: der Kopf groß im Bild, die Stirn hoch, das Gesicht tief im Kopf, runde rosige Wangen, große braune Augen, kleine Nase,
   kleiner Mund; spricht sie, sieht man die Zahnlücke. Braunes Haar mit Mittelscheitel, zwei Zöpfe mit roten Haargummis (der nahe hinter der
   Schulter, der ferne hinter dem Hals). Roter Pullover mit aufgenähtem gelbem Stoffstern.
   Aufbau: Kopf, Gesicht und Haar als Pixelkarte HEAD (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG,
   Kleidung und Zubehör in Code; Varianten als Flicken [y, x, zeichen] ('_' = Pixel bleibt): MOUTH_O (spricht), EYES_B (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline.
   Legende HEAD: Ziffern Haut (p-Rampe) · t kühler Rand · W Augenweiß · i j Iris · k Pupille · I Lid · L Glanz · x y Brauen · u m l Mund · r Wangen · a–e Haar (braun) · R r Haargummi */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={'1':P.p1,'2':P.p2,'3':P.p3,'4':P.p4,'5':P.p5,'6':P.l0,t:P.p3,W:P.s5,w:P.s6,i:P.w2,j:P.w1,k:P.k0,I:P.h1,L:P.s6,x:P.w2,y:P.w3,u:P.d4,m:P.d2,l:P.d5,r:P.d5,a:P.w0,b:P.w1,c:P.w2,d:P.w3,e:P.w4,R:P.r3};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var HEAD=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "...............................c........................", // 3
 "...........................eddd5cbccb...................", // 4
 "........................eeeeedd4dcbdbb..................", // 5
 ".......................eeeeeddadcccbdba.................", // 6
 "......................eeeeededaddcccbdda................", // 7
 ".....................eeeeedbdaddccccbbada...............", // 8
 "....................eeeeeebddadccccbbbbada..............", // 9
 "...................eeeeedbddadccccbbbbbada..............", // 10
 "...................eeeeedbddaddccccbbbbbad..............", // 11
 "..................dededdbddaccccccbbbbaabda.............", // 12
 "..................ededdbddaddcc55454baaaaba.............", // 13
 "..................dddddbddac55555544444aaba.............", // 14
 ".................dddddbddac555555554444taab.............", // 15
 ".................dddddbdac55555555554444taa.............", // 16
 ".................cdcdbccac55555555555444t...............", // 17
 "................cccdcccacc55555555554444t...............", // 18
 "................cccdcccac555555555555444t...............", // 19
 "................bbbcbbabb555555555554444t...............", // 20
 "................bbbbbbabb555555555555444t...............", // 21
 "................abbbbbabb5yxxx555555xy44t...............", // 22
 "................aabababab555555555555444t...............", // 23
 "................aaaaaaaaa55555555555444t................", // 24
 ".................aaaaaaa555IIII5555III4t................", // 25
 ".................aaaaaa555IWLkiW554LkiWt................", // 26
 ".................aaaaaa555Wjiiij555jii44t...............", // 27
 "................cbbaa555555Wjjj5554jj445t...............", // 28
 "................cbbaa4555555555554544445t...............", // 29
 "................ccbaa445555rrr5544444433t...............", // 30
 "................ccbaa.5455rrrr5454444r32t...............", // 31
 "................ccbba.444445r5444444443t................", // 32
 "...............cccbaa.4444445454444uuu33t...............", // 33
 "...............dRRRRR..43444444444mmmm3t................", // 34
 "...............RRRRRR...33444444444ll33tb...............", // 35
 "...............dccbba...333444444443333tb...............", // 36
 "...............cabbaa.....444444444333tRRR..............", // 37
 "...............ccaadd.....343433333333bbbb..............", // 38
 "...............ccddaa.....333233333...bbbb..............", // 39
 "...............cdbbaa.....333222222...abbb..............", // 40
 "...............ccbbaa.....333222222...baaa..............", // 41
 "...............acbaaa.....444333333...bbbaa.............", // 42
 "...............caadd......444333333...bbba..............", // 43
 "...............cddaa......444333333....baa..............", // 44
 "...............dbbba......444333333....aba..............", // 45
 "...............bbbaa......4443333333...aaa..............", // 46
 "...............babaa...................aaa..............", // 47
 "...............bbaad...................aaa..............", // 48
 "...............bbdda....................aa..............", // 49
 "...............bdaaa....................a...............", // 50
 "...............abaa.....................................", // 51
 "................aa......................................", // 52
 ".................a......................................", // 53
 "........................................................", // 54
 "........................................................", // 55
 "........................................................", // 56
 "........................................................", // 57
 "........................................................", // 58
 "........................................................", // 59
 "........................................................", // 60
 "........................................................", // 61
 "........................................................", // 62
 "........................................................"  // 63
];
var MOUTH_O=[[34,34,"mwmwm"], [35,35,"mmm"], [36,35,"ll"]];
var EYES_B=[[25,26,"44444"], [26,26,"444444"], [27,26,"IIIIII"], [28,27,"4444"], [25,35,"444"], [26,35,"4444"], [27,35,"III"], [28,35,"44"]];
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else { var c=LEG[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x0+i,y,c); } } }); }
function stamp(b,rows){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.') continue; var c=LEG[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
// roter Pullover mit aufgenähtem gelbem Stoffstern (fünf Zacken), Rundkragen; schmale Kinderschultern
function star(b,x,y){ ['...#...','..###..','#######','.#####.','..###..','.##.##.','.#...#.'].forEach(function(r,j){ for (var i=0;i<r.length;i++) if (r[i]==='#') b.px(x+i,y+j,(j<2||i<3)?P.y4:P.y3); }); b.px(x+3,y+3,P.y5); }
function back(b){
  b.poly([[5,64],[5.6,57.4],[8.4,52.4],[12.6,48.8],[18,46.6],[23,45.6],[36,45.6],[41,46.6],[45.6,49],[49.4,52.6],[51.4,57.6],[52,64]],P.r3);
  b.poly([[5,61],[5.6,57.4],[8.4,52.4],[12.6,48.8],[18,46.6],[20.4,46.2],[15,49.6],[10.6,53.4],[7.6,58.6]],P.r4);
  b.poly([[42,47.6],[45.6,49.6],[49.4,53.4],[51.4,58.6],[52,64],[44,64],[43.4,56]],P.r2);
  b.line(13,56,14,63,P.r2);
  for (var y=50;y<64;y+=3) for (var x=8;x<50;x+=4){ var c=b.get(x+((y>>1)&1),y); if (c===P.r3) b.px(x+((y>>1)&1),y,P.r2); }
  star(b,16,53);
}
function front(b){
  b.poly([[24.4,45],[28,47.2],[32,47.6],[35.6,46.2],[37.4,45.2],[38.6,46.6],[36,48.8],[31.6,49.6],[27,49],[23.6,46.8]],P.r2);
  b.line(25,46,29,48,P.r4);
}
function paint(b,v){
  back(b);
  stamp(b,HEAD);
  if (v.mouth) put(b,MOUTH_O);
  if (v.eyes) put(b,EYES_B);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('mia',{ paint:paint });
})(M);
