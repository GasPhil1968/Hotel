/* ===== portraits/zora.js — Zora Marić (Geist, 57, gestorben 1994), Lehrerin (Kapitel 2, Sarajevo)
   Graues Haar straff zurückgekämmt (Kammlinien) zu einem Knoten am Hinterkopf, schmale ovale Brille, die goldene Brillenkette
   hängt hinter dem Ohr den Hals hinab; graue Strickjacke über dunkelblauem Kleid mit weißem Bubikragen, ein Stück Kreide in
   der Brusttasche. Streng und liebevoll: gerade, feste Brauen, ruhiger Blick, Mund geschlossen.
   Natürliche Farben: das Spiel färbt Geister selbst ein (M.ghostLut, ohne Raster). Haut deshalb auf der Rampe
   l0 p5 p4 p3 q2 q1 q0 (eingefärbt sieben getrennte Stufen); Augenweiß hell, Iris, Wimpern, Brauen, Brille und Mundspalt
   deutlich dunkler, damit Augen, Brauen, Mund und Kontur auch einfarbig über die Helligkeit lesbar bleiben.
   Legende: Ziffern Haut · w v Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern · x y Brauen · G Brille ·
   o Unterlippe · g h Kette · a–d Haar · A–E Strickjacke · N n O Kleid · W V Kragen und Kreide.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline.
   Für das Prüfblatt (portraitsheet.js) meldet sich Zora am Ende selbst als Geist an (M.PORTRAIT_GHOSTS.zora). */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"0":P.q0, "1":P.q1, "2":P.q2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, w:P.s6, v:P.s5, i:P.w2, k:P.h1, L:P.l1, z:P.h2, x:P.w1, y:P.s1, g:P.y3, h:P.y2, G:P.k2, o:P.d4, a:P.m1, b:P.m2, c:P.m3, d:P.m4, A:P.m0, B:P.m1, C:P.m3, D:P.m4, E:P.s5, W:P.s6, V:P.s5, N:P.n2, n:P.n1, O:P.n3};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................ccdddcccc.......................", // 5
 "....................ccccdddddddccccc....................", // 6
 ".................dcccccddcccccdccccccc..................", // 7
 "................dccccccccccdddcbbcccccb.................", // 8
 "...............ddccccccdcddcaaaddcbbccbb................", // 9
 "..............cdccccccbcbbacdddbbddbbcbb................", // 10
 "..............cdccccdcddccdbbbddc5ddbbbaa...............", // 11
 ".............cdcccdcbbbabb4444555554332.................", // 12
 ".............ccccdcbdccd444455555554332.................", // 13
 ".............ccccccdbbcc4455555555544332................", // 14
 ".............ccccdbaabb34555555555554433................", // 15
 ".............cccdcbbccc345555555555544332...............", // 16
 ".............cbcdbccccc355555555555444332...............", // 17
 "..........ccbcbcdbbbbb3355555555555443332...............", // 18
 ".........ccccbbaaabaaa345yxxxxy555yxxxy32...............", // 19
 "........cccccbbabbbbbb345555555y5y4333332...............", // 20
 "........cbcbcbbaa555433454GGGGG4544GGGG32...............", // 21
 "........bbccbbaaa5543GGG5G2zzz2GGGGzzz2G2...............", // 22
 ".........bbbbbaa554GG3345GzwLkwG55GwikvG2...............", // 23
 "..........bbaaaag54233345G4wii4G55G3ii3G2...............", // 24
 "................5543333454GGGGG4554GGGG32...............", // 25
 "................h542343455544555554333332...............", // 26
 "................44534334555555555553333h2...............", // 27
 "................g445433455555555555632332...............", // 28
 ".................445433455555455421222332...............", // 29
 ".................h444334555545555554333h................", // 30
 "..................4443335555455555543332................", // 31
 "..................g44433555554422222332.................", // 32
 "...................4443355555422111223h.................", // 33
 "...................h4443455554455o53332.................", // 34
 "....................4444445555542243322.................", // 35
 "....................g44444455555555332..................", // 36
 ".....................4445424455555432...................", // 37
 ".....................h44544422444421....................", // 38
 "......................4443333322233.....................", // 39
 "......................g443332223333.....................", // 40
 ".....................WV44333223333VW....................", // 41
 ".....................VWWVWWVVVVWVWWVAB..................", // 42
 "...................CCEVWhWVVNNNVWWgCABBBB...............", // 43
 ".................CCCCEDNVWVNNNNVVnnCABBBBBB.............", // 44
 "..............DCCCCCCEDNNNgNNNNnhnnCABBBBBBBB...........", // 45
 "...........DDDDDCCCCCNEDnNNNhNgNnnnnCABBBBBBBBB.........", // 46
 "........DDDDDDDCCCCCCCEDnNNNNNNNnnnnCABBBBBBBBBBB.......", // 47
 "......DDDDBDDDDCCCCCCCEDnNNNNNNNnnnnCABBBBBBBBBABB......", // 48
 ".....DDDECBCCCCCCCCCCCEDnNNNNNNNnnnnCABBBBBBBBBABBB.....", // 49
 "....DDEECCBCCCCCCCCCCCNEDNNONNNNnnnnCABBBBBBBBBABBBB....", // 50
 "...DEECCCCBCCCCWCCCCCCNEDNNONNNNnnnnBABBBBBBBBBABBBB....", // 51
 "..DECCCCCBCCCCCWVCCCCCCEDNNONNNNnnnnBABBBBBBBBBBABBBB...", // 52
 ".DDCCCCCCBCCCCCVECCCCCCEDNNONNNNnnnnBABBBBBBBBBBABBBBA..", // 53
 ".DCCCCCCCBCDDEDDDEDCCCCEDNNONNNNnnnnBABBBBBBBBBBABBBBA..", // 54
 ".CCCCCCCCBCBBBBBBBBCCCCEDnNONNNNnnnnBABBBBBBBBBBABBBBAA.", // 55
 "CCCCCCCCCBCBCCCCCCBCCCCEDnNONNNNnnnnBABBBBBBBBBBBAAAAAA.", // 56
 "CCCCCCCCCBCBCCCCCCBCCCCEDnNNONNNnnnnABBBBBBBBBBBBAAAAAA.", // 57
 "CCCCCCCCCBCBCCCCCCBCCCCCEDNNONNNnnnnABBBBBBBBBBBBAAAAAA.", // 58
 "CCCCCCCCCBCBBCCCCCBCCCCCEDNNONNNnnnnABBBBBBBBBBBBAAAAAA.", // 59
 "CCCCCCCCBCCBBBBBBBBCCCCCEDNNONNNnnnnABBBBBBBBBBBBBAAAAAA", // 60
 "CCCCCCCCBCCCCCCBCCCCCCCCEDNNONNNnnnnABBBBBBBBBBBBBAAAAAA", // 61
 "CCCCCCCCBCCCCCCCBCCCCCCCEDNNONNNnnnnABBBBBBBBBBBBBAAAAAA", // 62
 "CCCCCCCCBCCCCCCCCCCCCCCCEDNNONNNnnnBABBBBBBBBBBBBBAAAAAA", // 63
];
var PATCH={
  mouth:[[33,31,"10w01"], [34,31,"20002"], [35,31,"34o"]],
  eyes:[[22,26,"34443"], [22,35,"4443"], [23,26,"44444"], [23,35,"4444"], [24,26,"2zzz2"], [24,35,"zzz2"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('zora',{ paint:paint });
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.zora=true;
})(M);
