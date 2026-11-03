/* ===== portraits/selma.js — Selma Karić (27), junge Mutter (Kapitel 2, Sarajevo)
   Weiches junges Gesicht mit kalten Wangen, schulterlanges braunes Haar mit seitlichem Pony und leichter Welle,
   petrolfarbene Strickmütze mit Rippenumschlag, hinten etwas lockerer; dicker grauer Steppparka mit hohem Kragen und
   Reißverschluss, die Kapuze mit hellem Fellrand liegt im Nacken. Offen und müde: weiche Brauen, leichte Schatten unter den Augen.
   Legende: Ziffern Haut (p-Rampe) · t Schatten · K Wangen · w Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern · x y Brauen ·
   l m n o Lippen · a–e Haar · F–J Mütze · A–D Parka · Z Reißverschluss · P Q S T Fellrand.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"2":P.p1, "3":P.p2, "4":P.p3, "5":P.p4, "6":P.p5, "7":P.l0, t:P.q4, K:P.d5, w:P.s5, i:P.w2, k:P.h1, L:P.l1, z:P.h2, x:P.w1, y:P.w2, l:P.d4, m:P.d3, n:P.p1, o:P.d5, a:P.w0, b:P.w1, c:P.w2, d:P.w3, e:P.w4, F:P.a1, G:P.a2, H:P.a3, I:P.a4, J:P.a5, A:P.m0, B:P.m1, C:P.m2, D:P.m3, Z:P.m4, P:P.s1, Q:P.s2, S:P.s3, T:P.s4};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 ".........................HIIIHHG........................", // 4
 ".....................HIJJIIIHHHHGGG.....................", // 5
 "..................HIJJIIIIHHHHHHGGGGF...................", // 6
 "................HIJIIIIIHHHHHHHHGGGGGFF.................", // 7
 "..............GHIIIIIHHHHHHHHHHGGGGGGGFF................", // 8
 ".............GHIIIIHHHHHHHHHHHHGGGGGGGGFF...............", // 9
 "............GHHIIHHHHHHHHHHHHHHGGGGGGGGGFF..............", // 10
 "............GHHHHHHHHHHHHHHHGGGGGGGIIIIHHG..............", // 11
 "............GHHHHHHHHHHHHHGGGGIIIIHHGHGHGG..............", // 12
 "............GHHHHHHHHHHGGGIIIHHGHGHGFGFGFFcb............", // 13
 "............GHHHHHHGGGIIIHHGHGGFGFGddcbbbccb............", // 14
 "............GHHHGGIIIHHGHGFGFGcddddcbb33bccb............", // 15
 "............GHGIIHHGHGGFGFbccdddcb655433bccbc...........", // 16
 "............HIHGHGFGFGbccbccdb6666655433bccbc...........", // 17
 "............GHGFGFccdcbccbb5556666555333bccbc...........", // 18
 "............FGFdcbccdcbccb5yxx55665xx433bccbc...........", // 19
 "............cccdecbccdcbcby555y565y55y33bccbc...........", // 20
 "............cccedcbccdcbcb54455456445333bccbc...........", // 21
 "............cccddcbccdcbcb3zzzz356zzz233bccbc...........", // 22
 "............cccddcbccdcbcbzwLkiw56ikwz33bccbc...........", // 23
 "............cccddcbccecbcb4wiiiw56iiw333bccbc...........", // 24
 "............cccddcbccdcbcb54555456455333bccbc...........", // 25
 "............cccddcbccdcbcb65tt55566t5333bccbc...........", // 26
 "............cccddcbccdcbcb66555566654333bccbc...........", // 27
 "............ccddcbccdcbccb6K6555567633K3bccbc...........", // 28
 "...........cccddcbccdcbccb66555543343333bccbc...........", // 29
 "...........cccdecbccdcbccb56555556543333bccbc...........", // 30
 "...........cccedcbccdcbccb55555llmll3333bccbc...........", // 31
 "...........cccddcbccdcbccb55554nnnnn3333bccbc...........", // 32
 "...........ccddcbccdcbccbb555554lol33333bccbc...........", // 33
 "...........ccddcbccdcbccbb55555544443333abba............", // 34
 "...........ccddcbccecbccbbb455566654333aabba............", // 35
 "...........ccddcbccdcbccbbb445566553333aabba............", // 36
 "...........ccddcbccdcbccbbb4444555432PQQabba............", // 37
 "...........ccddcbccdcbccbbb44333443QQSPQabbb............", // 38
 "...........ccddcbccdcbccbbb443322BBBQQQPabbQQ...........", // 39
 "...........bbccbabbcbabbaaa3333BBBBBBQQQPQQSQ...........", // 40
 "...........SbccbabbcbabbaaaDDDZABBBBBQQSQPQQQQ..........", // 41
 "...........SabccbabbcbabaaCCCCZABBBBBBBQQQQQQQQ.........", // 42
 "..........TSabccbabbcbabaCCCCCZABBBBBBBBBQQPQSB.........", // 43
 "........DQQSSbccbabacaaaCCCCCCZABBBBBBBBBBBBBBBB........", // 44
 ".......DDDQSSbbcaCaabaCaCCCCCCZABBBBBBBBBBBBBBBBBB......", // 45
 ".....DDDQDBDDDaCbCaCaCCDCCCCCCZABBBBBBBBBBBBBBABBBB.....", // 46
 "....DDDDDCBCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBABBBBB....", // 47
 "...DDDDDCCBCCCCCCCCCCCCCCCCCCCZACBBBBBBBBBBBBBABBBBBB...", // 48
 "..DDDDCCCCBCCCCCCCCCCCCCCCCCCCZACBBBBBBBBBBBBBABBBBBB...", // 49
 ".DDDDCCCCCBCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBABBBBBBA..", // 50
 ".DDDCCCCCCBCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBABBBBBA..", // 51
 ".DCCCCCCCCBCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBABBBBBAA.", // 52
 "CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBZAAAAAAAAAAAAAAAAAAAAAAAA.", // 53
 "CCCCCCCCCCBCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBAAAAAAAA.", // 54
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBAAAAAAAA.", // 55
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBABAAAAAAA", // 56
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBABAAAAAAA", // 57
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBABAAAAAAA", // 58
 "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBZAAAAAAAAAAAAAAAAAAAAAAAAA", // 59
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBBAAAAAAAA", // 60
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBBAAAAAAAA", // 61
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBBAAAAAAAA", // 62
 "CCCCCCCCCBCCCCCCCCCCCCCCCCCCCCZABBBBBBBBBBBBBBBBAAAAAAAA", // 63
];
var PATCH={
  mouth:[[32,31,"m_w_m"], [33,32,"nnn4"], [34,32,"lol5"]],
  eyes:[[22,26,"555554__5554"], [23,26,"455554__5544"], [24,26,"3zzzz3__zzz"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('selma',{ paint:paint });
})(M);
