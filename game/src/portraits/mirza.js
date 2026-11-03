/* ===== portraits/mirza.js — Mirza Hodžić (26), Hausmeister (Kapitel 2, Sarajevo)
   Schmales, kantiges junges Gesicht mit Dreitagebart (Haut eine Stufe dunkler, Rand im Schachbrett), kurze dunkle Haare an
   Schläfe und Nacken, graue Strickmütze mit geripptem Umschlag tief über der Stirn; blaue Arbeitsjacke mit dunkelbraunem
   Cordkragen, Reißverschluss und Brusttasche mit Stift, darunter ein dunkler Pullover. Wortkarg: tiefe, gerade Brauen,
   ruhiger Blick, fest geschlossener Mund.
   Legende: Ziffern Haut (q/p-Rampe) · w v Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern · x y Brauen · g h Haar ·
   a–e Mütze · A–E Jacke · K P J Q Cordkragen · M N Pullover · Z Reißverschluss · X Y Stift.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.q0, "2":P.q1, "3":P.q2, "4":P.q3, "5":P.p3, "6":P.p4, "7":P.p5, g:P.h1, h:P.h2, w:P.s5, v:P.s4, i:P.w2, k:P.h1, L:P.l1, z:P.h1, x:P.h1, y:P.h2, a:P.m0, b:P.m1, c:P.m2, d:P.m3, e:P.m4, A:P.n1, B:P.b0, C:P.b1, D:P.b2, E:P.b3, K:P.w2, P:P.w3, J:P.w1, Q:P.w1, M:P.m0, N:P.k2, Y:P.y3, X:P.m3, Z:P.m3};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................cdddcccb........................", // 5
 ".....................cdeeddddccccbb.....................", // 6
 "...................ccedeccdccbbcbcbbb...................", // 7
 "..................cceddcdcdccbcbcbcbbb..................", // 8
 ".................cdcecdcdccbcbcbcbcbbbb.................", // 9
 "................cdcdcdcccbcbcbccbcbcbbbb................", // 10
 "...............cdcddccbccbcbcbccbcbcbbbba...............", // 11
 "...............ccddcccbcbccbccbcbbbbbbbbba..............", // 12
 "..............bccddbcbccbccbcbbbbddddccccb..............", // 13
 "..............bbddbccbccbcbbbddddccbcbcbcbb.............", // 14
 "..............bbdcbccbbbbdddcbcbbababababaa.............", // 15
 "..............bbccbcbbbddcbcbbaba66554433...............", // 16
 "..............bbccbbbdddcbcbab66665554443...............", // 17
 "..............bbbddcbcbaba555566655554443...............", // 18
 "..............cdcbcbbabg4yxxxxy565yxxxy443..............", // 19
 "..............bcbaba54hg444yyxxy5yxy444443..............", // 20
 "..............abag5643hg444334435434434443..............", // 21
 "..............ghgg553234443zzzz354zzz3443...............", // 22
 "..............ghgg54233345vwLkv454wikv443...............", // 23
 "..............ghgh543334454wii44544ii4443...............", // 24
 "..............ghgg542344455444455544445443..............", // 25
 "..............ghgg453434466554556654455443..............", // 26
 "..............ghgg445434466555455665345443..............", // 27
 "..............gggh44543445554455556743443...............", // 28
 "................g...433345544445432333443...............", // 29
 "....................442235544455556544443...............", // 30
 "....................443234434444555453332...............", // 31
 "....................44323333343434243432................", // 32
 "....................44323333333432223432................", // 33
 "....................4432233333345554332.................", // 34
 "....................4433233333333223322.................", // 35
 ".....................43332233334443322..................", // 36
 ".....................4333222233343321...................", // 37
 ".....................43332221112221.....................", // 38
 "....................J4333222111222Q.....................", // 39
 "....................JP4443332233MQQKQ...................", // 40
 "...................JKPKKMMMMMMMMMMQKQQ..................", // 41
 "...................JKKPKMMMMMMMMMMKQQQQ.................", // 42
 ".................KKJKKPKKMMMMMMMMMKQQQBBBB..............", // 43
 "...............KKKKKKKPKKNMMMMMMMQKQQBBBBBBB............", // 44
 "............DDDDCQQKKKKPKKNNNMMMCQQQBBBBBBBBBB..........", // 45
 ".........DDDDDDCCCCQQKKPKKKMMNNMQQQBBBBBBBBBBBBB........", // 46
 ".......DDDBDDDDCCCCCCQQKKKKKCCZBBBBBBBBBBBBBBBABB.......", // 47
 ".....DDDECBCCCCCCCCCCCCQQCCCCCZBBBBBBBBBBBBBBBABBB......", // 48
 "....DDEECCBCCCCCCCCCCCCCCCCCCCZBBBBBBBBBBBBBBBABBBB.....", // 49
 "...DEECCCCBCCCCCCXCCCCCCCCCCCCZBBBBBBBBBBBBBBBABBBBB....", // 50
 "..DECCCCCBCCCCCCCYCCCCCCCCCCCCZBBBBBAAAAAAABBBBABBBBB...", // 51
 ".DDCCCCCCBCCCBBBBBBBBBBCCCCCCCZBBBBBCCCCCCCBBBBABBBBB...", // 52
 ".DCCCCCCCBCCCDDDDYDDDDBCCCCCCCZBBBBBBBBBBBBBBBBABBBBBA..", // 53
 ".CCCCCCCCBCCCCCCCXCCCCBCCCCCCCZBBBBBBBBBBBBBBBBABBBBBA..", // 54
 "CCCCCCCCCBCCCCCCCCCCCCBCCCCCCCCZBBBBBBBBBBBBBBBBAAAAAAA.", // 55
 "CCCCCCCCCBCCCCCCCCCCCCBCCCCCCCCZBBBBBBBBBBBBABBBAAAAAAA.", // 56
 "CCCCCCCCCBCBCCCCCCCCCCBCCCCCCCCZBBBBBBBBBBBBABBBAAAAAAA.", // 57
 "CCCCCCCCCBCCBBBBBBBBBBBCCCCCCCCZBBBBBBBBBBBABBBBAAAAAAA.", // 58
 "CCCCCCCCCBCCCBCCCCCCCCCCCCCCCCCZBBBBBBBBBBBABBBBBAAAAAAA", // 59
 "CCCCCCCCBCCCCCBCCCCCCCCCCCCCCCBZBBBBBBBBBBABBBBBBAAAAAAA", // 60
 "CCCCCCCCBCCCCCCBCCCCCCCCCCCCCCBZBBBBBBBBBBABBBBBBAAAAAAA", // 61
 "CCCCCCCCBCCCCCCCCCCCCCCCCCCCCCBZBBBBBBBBBABBBBBBBAAAAAAA", // 62
 "CCCCCCCCBCCCCCCCCCCCCCCCCCCCCCBZBBBBBBBBBABBBBBBBAAAAAAA", // 63
];
var PATCH={
  mouth:[[33,32,"21v12"], [34,32,"2111"], [35,32,"454"]],
  eyes:[[22,26,"444444__4444"], [23,26,"45554"], [23,34,"5544"], [24,26,"3zzzz"], [24,34,"zzz3"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('mirza',{ paint:paint });
})(M);
