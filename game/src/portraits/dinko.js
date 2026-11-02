/* ===== portraits/dinko.js — Dinko Matić (46), Fischer an der Matejuška =====
   Rippenstrick-Mütze mit Krempe, schwere Brauen, tiefliegende, gesenkte Augen, wettergegerbte Haut,
   kurzer grauer Bart, dunkelgrüner Fischerpullover mit Rollkragen und Zopfmuster.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = transparent) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), kühles Gegenlicht an der rechten Kante; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.q0, "2":P.q1, "3":P.q2, "4":P.q3, "5":P.q4, "6":P.p4, a:P.m1, b:P.m2, c:P.m3, d:P.m4, r:P.p3, R:P.p2, x:P.s4, w:P.s5, i:P.w1, o:P.k0, A:P.n0, B:P.n1, C:P.n2, D:P.n3, I:P.g0, J:P.g1, K:P.g2, L:P.g3};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 ".....................CCCCCCCCCCBB.......................", // 5
 "...................DCCDDDCCCCCBBBBC.....................", // 6
 "..................DCDDCCCCCCCBCBBBBB....................", // 7
 ".................DCDCCDCCCCCBBCBBBAAB...................", // 8
 "................DCDCDCCCCCCCBCBBBABAAB..................", // 9
 "...............DCDCDCCCCCCBCBBBBBBAAAAB.................", // 10
 "..............DDCDCCCCCCAAAAAAAAAAAAAAAB................", // 11
 "..............DCDCAAAAAADDDDDDCCCCCCCCD.................", // 12
 "..............AAAADDDDDDCBCABABAAAAAAAB.................", // 13
 "...............DDDDCCBCBCABABAAAAAAAAAB.................", // 14
 "..............DCDCCBCBCABABAAAAAAAAAAAa.................", // 15
 "..............DCCBCBCABABAAAAAaaaaaaaaaa................", // 16
 "..............CBCBCABABA344555544444433a................", // 17
 "..............CBBABABAA45665554343455543................", // 18
 "..............BABABAAAA4bbaaaab353baaab3................", // 19
 ".............ABABAAAaaa4433333a353a333443...............", // 20
 ".............ABAAb55caa453111123531112343...............", // 21
 ".............AAaab543bcb51xwox3453xwo1443...............", // 22
 "..............aaab532cbc444ii444544ii3443...............", // 23
 "..............aaab543bcb45333345564334543...............", // 24
 "..............aabb554cbc56544455563445543...............", // 25
 "..............abbab54bcc665rr55555634r543...............", // 26
 "..............abbab54cbc565r5555456r34543...............", // 27
 "..............abcaa4bcb455555554r66rr3443...............", // 28
 "...............abaabaab44b4555543R2RR3433...............", // 29
 "................aaaaaabcbcb454bbccccbbb3................", // 30
 "...................aaacccccbcbbcdcccbbaa................", // 31
 "....................aaccccccbbabccbbbbaa................", // 32
 "....................2abcccccbba11111aaaa................", // 33
 "....................232bcccccbba2332abaa................", // 34
 "....................232bccccccbbaaabbaa.................", // 35
 "...................JLL22abccccccbbbbaaa.................", // 36
 "...................JKJLLLabbccccbbbaaa..................", // 37
 "...................JKJKJJLLabbbbbbaaa...................", // 38
 "...................JKJKJJJJLLLLbbaaa....................", // 39
 "...................JKJKJJJJIJIJLLLLLLL..................", // 40
 "...................JKJKJJJJIJIJIIIIIII..................", // 41
 "...................JKJKJJJJIJIJIIIIIII..................", // 42
 "...................JKJKJJJJIJIJIIIIIII..................", // 43
 "..................JJKJKJJJJIJIJIIIIIIIIIIIIKK...........", // 44
 ".............LKKKJJIIIIIIIIIIIIIIIIIIIIIIIIIIKKJ........", // 45
 ".........LLKKKKKKJJJJJJJJJJJJJJJJJIIIIIIIIIIIIIKKJ......", // 46
 "......LKKKKKKKKKKJJJJJJJJJJJJJJJJJIIIIIIIIIIIIIIIKJ.....", // 47
 "....LKKKKKKKKKKKKJJJJJJJJJJJKIJJJJIIIIIIJIIIIIIIIIKKJ...", // 48
 "...LKKKKKKKKKKKKKJJJKIJJJJJJKIJJJJIIIIIIJIIIIIIIIIIIKJ..", // 49
 "..LKKKKKKIKKKKKKKJJJKIJJJJJJIKJJJIIIIIIIIJIIIIIIIIIIIJ..", // 50
 ".LKKKKKKKIKKKKKKJJJJIKJJJJJIIKJJIIIIIIIIIJIIIIIIIIIIIIJ.", // 51
 ".LKKKKKKKKIKKKKJJJJIIKJJJJJJKIJIIIIIIIIIJIIIIIIIIIIIIIIJ", // 52
 "KLKKKKKKKKIKKKJJJJJJKIJJJJJJKIIIIIIIIIIIJIIIIIIIIIIIIIIJ", // 53
 "LKKKKKKKKKIKKJJJJJJJKIJJJJJJIKIIIIIIIIIIIJIIIIIIIIIIIIIJ", // 54
 "LKKKKKKKKKKIJJJJJJJJIKJJJJJIIKIIIIIIIIIIIJIIIIIIIIIIIIIJ", // 55
 "KKKKKKKKKKKIJJJJJJJIIKJJJJJJKIIIIIIIIIIIJIIIIIIIIIIIIIIJ", // 56
 "KKKKKKKKKKJIJJJJJJJJKIJJJJJIKIIIIIIIIIIIJIIIIIIIIIIIIIIJ", // 57
 "KKKKKKKKKJJIJJJJJJJJKIJJJJIIIKIIIIIIIIIIIJIIIIIIIIIIIIIJ", // 58
 "KKKKKKKKJJJIJJJJJJJJIKJJJIIIIKIIIIIIIIIIIJIIIIIIIIIIIIII", // 59
 "KKKKKKKJJJJJIJJJJJJIIKJJJIIIKIIIIIIIIIIIJIIIIIIIIIIIIIII", // 60
 "KKKKKKKJJJJJIJJJJJJJKIJIIIIIKIIIIIIIIIIIJIIIIIIIIIIIIIII", // 61
 "KKKKKKJJJJJJIJJJJJJJKIJIIIIIIKIIIIIIIIIIIJIIIIIIIIIIIIII", // 62
 "KKKKKJJJJJJJIJJJJJJJIKIIIIIIIKIIIIIIIIIIIJIIIIIIIIIIIIII", // 63
];
var PATCH={
  mouth:[[33,31,"21112"], [34,31,"a1112"], [35,32,"2332"]],
  eyes:[[21,25,"333333"], [22,25,"222223"], [23,27,"44"], [21,34,"3333"], [22,34,"2222"], [23,35,"44"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('dinko',{ paint:paint });
})(M);
