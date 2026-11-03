/* ===== portraits/dragica.js — Dragica Lukić (79), Nachbarin in Haus 7 (Kapitel 2, Sarajevo)
   Rundes Gesicht mit weichen Wangen und Doppelkinn, kurzes weißes Haar mit Dauerwelle (kleine Locken, Licht oben links),
   große runde Brille mit honigbraunem Rahmen, wache blaue Augen, die den Betrachter direkt ansehen, ein Hauch Lippenstift,
   Perlenohrring. Rosa gesteppter Morgenmantel mit hellem Schalkragen über moosgrüner Strickjacke und weißem Blusenkragen.
   Scharfer Witz, aber ruhig: kein Lachen, nur der wache Blick und ein leicht gehobener Mundwinkel.
   Legende: Ziffern Haut (p/q-Rampe) · r Wangenröte · w v Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern · x y Brauen ·
   F h Brillenrahmen · + Glasglanz · l n o Lippen · a–f Haar · A–E Morgenmantel · G H I Strickjacke · X Y Knöpfe · S U V Bluse.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.q4, "5":P.p4, "6":P.p5, "7":P.l0, r:P.d5, w:P.s6, v:P.s5, i:P.n3, k:P.n0, L:P.l1, z:P.h2, x:P.s2, y:P.s3, F:P.w3, h:P.w5, "+":P.l1, l:P.d4, n:P.d3, o:P.d5, a:P.s2, b:P.s3, c:P.s4, d:P.s5, e:P.s6, f:P.l1, A:P.d2, B:P.d3, C:P.d4, D:P.d5, E:P.p5, G:P.g2, H:P.g3, I:P.g4, X:P.y2, Y:P.y1, S:P.s4, U:P.s5, V:P.s6};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 ".........................cced...........................", // 4
 ".....................cfecfeceecee.......................", // 5
 "..................cedcedcedcedcedbed....................", // 6
 ".................cfccfddcddccccbcbecc...................", // 7
 "...............ecfecfedfedfedeedbedbddb.................", // 8
 "..............eecedcedceddedcedcbdcddcbd................", // 9
 "..............cccccfecccccecedbbbbbbbbdd................", // 10
 ".............eecfeceecedceddddbedcedcddcd...............", // 11
 "............eeccedcedcddcddcdcbdccdcbbcbac..............", // 12
 "............ecfeefecfeccedbebb66666554b3aa..............", // 13
 "............eceededdeddcdc55666666655433ad..............", // 14
 "............dfcccddcddc445566666666554322a..............", // 15
 "...........cfedfedcedc4445566666666554332ca.............", // 16
 "...........deddeddeddb4445yxxy56665yxxy33cb.............", // 17
 "............cccccfccbe444y5555y565y5554x3b..............", // 18
 "............ecedcedbed445hhFFF55655hFFF433..............", // 19
 "............dcddcdcbdc44F+5555F565F+554F33..............", // 20
 "............ceeced55444F5433345FFFF4333F33..............", // 21
 ".............eded564334F53zzzz3F55Fzzz2F33..............", // 22
 "..............cbd553234F5vLkiwvF56FikwwF33..............", // 23
 "..............edb542334F5viiiw4F56FiiwvF33..............", // 24
 "...............cb543334F5544445F56F4444F33..............", // 25
 ".................5423444F55545F556F5454F333.............", // 26
 ".................45343455FFFFF55565FFFF4333.............", // 27
 "..................4543456655555455676344433.............", // 28
 "..................4v444566r555444323334r433.............", // 29
 "...................444455555445455654444433.............", // 30
 "...................44444555444556565533433..............", // 31
 "...................44444555544lllll354333...............", // 32
 "...................44444455553nnnnn454333...............", // 33
 "...................44444445554lool454433................", // 34
 "....................44444455544434554332................", // 35
 "....................4444344545566555332.................", // 36
 ".....................44443345556454422..................", // 37
 "......................444334433544332...................", // 38
 "......................UV43333344332VU...................", // 39
 ".....................DUVV333333333VVU...................", // 40
 "....................DEDSUVVHHHHHGVVUSB..................", // 41
 "....................DEDDHSUUHIGUUUSBCBB.................", // 42
 "...................DDDEDHHHSUIUSGGGCBBBBBB..............", // 43
 ".................DDDDDEDDHHHHIGGGGGCBBBBBBBB............", // 44
 "..............CDDDDDDDDEDHHHHIGGGGCCBBBBBBBABB..........", // 45
 "...........DCCBCDDDDDDDEDHHHHIGGGGBCBBBBBBBBBBA.........", // 46
 "........DDCCCCCCDDDDDDDDEDHHHXYGGGCBBBBBBABBBBBAB.......", // 47
 "......DDBCCCCCCCBDDDDDDDEDHHHIGGGGCBBBBBABBBBBBBBB......", // 48
 ".....DDBCCCCCCCCCCDDDDDDEDHHHIGGGCCBBBBBBABBBBBABAB.....", // 49
 "....DCCCCCBCCCBCCCCDDDDDEDHHHIGGGCCBBBBBBBBBBBABBBAB....", // 50
 "...CCBCCCCCBCBCCCCCDDDDDDEDHHIGGGBCBBBBBBBBABBBBBBBBB...", // 51
 "..CCBCCCCCCCCCCCCCCCDDDDDEDHHXYGHCBBBBBBBBBBABBBBBBBA...", // 52
 ".CCCCBCCCCCBCBCCCCCCDDDDDDEHHIGGCCBBBBBBBBBABBBBAAAAAA..", // 53
 ".CBCCCCCCCBCCCBCCCCCCDDDDDEDHIGGCCBBBBABBBBBBBABAAAAAA..", // 54
 ".BCCCCCBCCCCCCCCCBCCCDDDDDEDHIHHBCBBBBBBBABBBBBAAAAAAAA.", // 55
 "CCCCCCCCBCCCCCCCBCCCCCDDDDDEHIHHCBBBBCBBABBBBBBBAAAAAAA.", // 56
 "CBCCCCCBCCCCCCCCCBCCCCDDDDDEHXYBCBBBBCBBBABBBBBAAAAAAAA.", // 57
 "CCBCCCCCCCBCCCBCCCCCCCCDDDDDDIHCCBBBCCABBBBBBBABAAAAAAA.", // 58
 "CCCCCBCCCCCBCBCCCCCBCCCDDDDDDIHCBBBBCBBBBBBABBBBAAAAAAAA", // 59
 "CCCCBCCCCCCCCCCCCCCCBCCCDDDDDCCBBBBCCCBBBBBBABBBAAAAAAAA", // 60
 "CCCCCBCCCCCBCBCCCCCBCCCCDDDDDBCBBBBBCBBBBBBABBBBAAAAAAAA", // 61
 "CCBCCCCCCCBCCCBCCCCCCCBCCDDDDCCBBBBCCCABBBBBBBABAAAAAAAA", // 62
 "CBCCCCCBCCCCCCCCCBCCCCCBCDDDDCCBBBCCCCBBBABBBBBAAAAAAAAA", // 63
];
var PATCH={
  mouth:[[33,31,"v"], [34,31,"111l"], [35,30,"lool4"]],
  eyes:[[22,25,"455554"], [22,35,"4554"], [23,25,"555554"], [23,35,"5554"], [24,25,"3zzzz3"], [24,35,"zzz3"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('dragica',{ paint:paint });
})(M);
