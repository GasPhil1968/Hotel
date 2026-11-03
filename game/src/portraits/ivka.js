/* ===== portraits/ivka.js — Ivka Perić (Geist, 85), wartet seit 1984 an der Mole =====
   Schwarzes Kopftuch unter dem Kinn geknotet (kühles Schwarz, Zugfalten zum Knoten), langer schwarzer Mantel
   (warmes Schwarz, eine Stufe dunkler als das Tuch), tiefe Falten, eingefallene Wangen, wache Augen.
   Natürliche Farben: das Spiel setzt Ivka als Geist selbst in ihre Geisterfarbe um (M.ghostLut); Augen, Brauen, Mund und
   Kontur sind über Helligkeit getrennt und bleiben auch eingefärbt lesbar.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = transparent) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), kühles Gegenlicht an der rechten Kante; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p0, "2":P.p1, "3":P.p2, "4":P.p3, "5":P.p4, "6":P.p5, a:P.k1, b:P.k2, c:P.m0, d:P.m1, e:P.m2, f:P.m3, A:P.k0, B:P.k1, C:P.k2, F:P.s0, g:P.s2, h:P.s3, j:P.s4, s:P.s1, x:P.s4, i:P.w1, o:P.k0, L:P.l1};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................eddddddd........................", // 5
 "......................eeeddddddddd......................", // 6
 "....................eeeeeddddddddddc....................", // 7
 "...................eeeeeeddddddddddcd...................", // 8
 "..................eeeeeeddddddddddcccd..................", // 9
 ".................eeeeeeeddddddddddccccd.................", // 10
 ".................eeeeeedddddeeeeeeeeddd.................", // 11
 "................eeeeeeedddeeeffffeeeddbd................", // 12
 "................eeeeeeddddee44455444dcbd................", // 13
 "...............deeeeddddddeh4556655544dcc...............", // 14
 "...............ddddddddddejh54444455544dd...............", // 15
 "...............dddddddddeh4566666555444ccd..............", // 16
 "...............ddddedddde455444455555444cd..............", // 17
 "...............ddddebdde4566665555555444cd..............", // 18
 "..............dddddebdde44gssg4555gssg44cd..............", // 19
 "..............dddddebdde4g444433543444g44d..............", // 20
 "..............ddddddbdde44311112541111344d..............", // 21
 "...............dddddebde441xLox354xLo1444d..............", // 22
 "...............dbdddebde5444ii44554ii3444d..............", // 23
 "..............cdbdddebde55543345564334544d..............", // 24
 "..............cdbdddebde55554455563445554d..............", // 25
 "..............ccbddddbce56666555556344554d..............", // 26
 "..............ccdbcccebe55665555456634443d..............", // 27
 ".............cccdbcccebe44555555455663443d..............", // 28
 ".............cccdbcccebd44445556542333443d..............", // 29
 ".............ccccbccccbde444456634333443bc..............", // 30
 ".............ccccdbbbbebe44455635543443bd...............", // 31
 ".............ccccdbaaaabde4555534444443bd...............", // 32
 "............cccccdbbaaaebe5555432222233bd...............", // 33
 "............dccccbbbbbaabde555434456443bd...............", // 34
 "............daccbbdbbbaaebe455444333443bd...............", // 35
 "...........bbabbbbbbbaaaa.de4555566543bd................", // 36
 "...........bbdabbbbbbaaaae.de445555443bd................", // 37
 "...........bbbabbbbbdbaaaab.de3444443bd.................", // 38
 "..........bbbbdabbbaabaaaaab..cd3333bd..................", // 39
 "..........bbbbbabbbaaabaaaaaabbcccbbbc..................", // 40
 "..........bbbbbbabaaaaabaaaa.bcddeddcb..................", // 41
 ".........bbbbbbbbaaaaaaabaaBBbcdeeddcBBBBBC.............", // 42
 "..........bbbbbbaaaaaaaaaaaBBabcddccbCCBBBBBBC..........", // 43
 "..........aaaaaaaaaaaaaaaaBBBabcdBdcABBCCBBBBBBC........", // 44
 "..........FddddcddddcddcCCBBabcdbBbdcABBBCBABBBBC.......", // 45
 "........FFCabbbbabbbbabCCCBAabcbBBbcbBABBCBABBBBBC......", // 46
 "......CFCCCCCCCCCCCCCCCCCFCBAbaBBBBbaABBCBABBBBABBC.....", // 47
 ".....FCCCCCCCCCCCCCCCCCCCCFCBABBBBBBBABBCBABBBBABBBC....", // 48
 "....FCCCCCCCCCCCCCCCCCCCCCBFCBABBBBBABBCBABBBBBABBBBC...", // 49
 "...FCCCCBCCCCCCCCCCCCCCCCCBBFCBABBBABBCBABBBBBBABBBBBC..", // 50
 "..FCCCCFBCCCCCCCCCCCCCCCCCBBBFCBABBABCBBABBBBBABBBBBBC..", // 51
 ".CFCCCCFCBCCCCCCCCBCCCCCCCBBBBFCBAABCBBABBBBBBABBBBBBBC.", // 52
 ".FCCCCCCFBCCCCCCCCBCCCCCCCBBBBBFCBBBBBABBBBBBBABBBBBBBC.", // 53
 ".FCCCCCCFBCCCCCCCCCBCCCCCCBBBBBBFBBBBABBBBBBBBABBBBBBBC.", // 54
 "CFCCCCCCFCBCCCCCCCCBCCCCCBBBBBBBFBBBABBBBBBBBBABBBBBBBBC", // 55
 "FCCCCCCCCFBCCCCCCCCBCCCCCBBBBBBBBABBBBBBBBBBBBABBBBBBBBC", // 56
 "FCCCCCCCCFBCCCCCCCCCBCCCBBBBBBBdeABBBBBBBBBBBBABBBBBBBBB", // 57
 "CCCCCCCCCFBCCCCCCCCCBCCBBBBBBBBcdABBBBBBBBBBBBABBBBBBBBB", // 58
 "CCCCCCCCCFBCCCCCCCCCBCCBBBBBBBBBBABBBBBBBBBBBBABBBBBBBBB", // 59
 "CCCCCCCCCCFBCCCCCCCCBCCBBBBBBBBBBABBBBBBBBBBBBABBBBBBBBB", // 60
 "CCCCCCCCCCFBCCCCCCCCCBBBBBBBBBBBBABBBBBBBBBBBBABBBBBBBBB", // 61
 "CCCCCCCCCCFBCCCCCCCCCBBBBBBBBBBdeABBBBBBBBBBBBABBBBBBBBB", // 62
 "CCCCCCCCCCFBCCCCCCCCBBBBBBBBBBBcdABBBBBBBBBBBBABBBBBBBBB", // 63
];
var PATCH={
  mouth:[[33,31,"3211123"], [34,31,"3321123"], [35,31,"4445544"]],
  eyes:[[21,26,"444443"], [22,26,"222233"], [23,26,"44444"], [21,34,"4444"], [22,34,"2222"], [23,34,"4443"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('ivka',{ paint:paint });
})(M);
