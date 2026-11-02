/* ===== portraits/mladen.js — Mladen Šimić (63), Beamter im Hafenamt seit 1975 =====
   Halbglatze in Hautfarbe mit Glanzlicht, grauer Haarkranz mit Koteletten klar abgesetzt, dünne Metallbrille,
   grauer Schnurrbart, müde Lider; weißes Hemd mit Krawatte, dunkelblaue Weste.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = transparent) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), kühles Gegenlicht an der rechten Kante; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p0, "2":P.p1, "3":P.p2, "4":P.p3, "5":P.p4, "6":P.p5, "7":P.l0, a:P.m1, b:P.m2, c:P.m3, d:P.m4, G:P.m2, H:P.m3, N:P.l1, x:P.s4, i:P.c1, o:P.k0, L:P.l1, M:P.m3, Y:P.m4, O:P.s5, P:P.s6, Q:P.l1, U:P.n0, V:P.n1, W:P.n2, X:P.n3, q:P.r1, r:P.r2, s:P.r3, t:P.r1};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................655555..........................", // 5
 ".....................666655555554.......................", // 6
 "....................66666555555544......................", // 7
 "...................6667765555554443.....................", // 8
 "..................666677655555544433....................", // 9
 ".................66666665555555444333...................", // 10
 "................6666655555555544433333..................", // 11
 "................d6d6555555666555555444..................", // 12
 "...............d6d555555556644444445544.................", // 13
 "...............dddc5d554556666665555544.................", // 14
 "...............dddcdc5545554444444555444................", // 15
 "..............cddcddbcd55666665555554444b...............", // 16
 "..............cddcdcbcc55555544445555444cb..............", // 17
 "..............cdccdcccc4baaabb5545baab44ca..............", // 18
 "..............cccccccbc4a4444444544444a44b..............", // 19
 "..............cccbccbbc44dHHHHHG4GHHHHG44...............", // 20
 "..............ccc466HHH4HN43334GGGN334G44...............", // 21
 "..............cbc4535bc4GH21112G4G2112G44...............", // 22
 "..............bbc4525bb54HxLox4G5GxLo3G44...............", // 23
 "..............abc4535ab55H4ii44G5G4ii4G44...............", // 24
 "..............aab4544ab554HHHHH454HHHG444...............", // 25
 "..............aaab554aa665544455563445544...............", // 26
 "..............aaab454a5566555555556344544...............", // 27
 "..............aaaab54a5555555555456663444...............", // 28
 "...............aaab44a4555555555423443443...............", // 29
 "...............aaaabaa445555563bcccccb43................", // 30
 "................aaaaaa44555563bcddccccb3................", // 31
 ".................aaaaa34455553abccbbcba3................", // 32
 "....................3aa4455543a2222223a3................", // 33
 "....................33445555443455654443................", // 34
 "....................3334455544443334443.................", // 35
 "....................3334345554555665443.................", // 36
 "....................3333434455555655443.................", // 37
 ".....................33343334455555443..................", // 38
 ".....................3333433333444433...................", // 39
 ".....................3OPPO3333333333....................", // 40
 ".....................OPQQPO33333333PO...................", // 41
 ".....................YOPQQPPO33rst3QPO..................", // 42
 ".....................3YOPQQPPOYrsstQPO..................", // 43
 ".......................YOOPPQQPqrstPPOY.................", // 44
 "....................YYYYYYOOPPPOrsYOPOYMMMY.............", // 45
 "..............OOOOOVVVVVYYYYOOOYqrYMOYMMMUUUUOO.........", // 46
 "..........POOOOOOVVVVXWVVYYYYYYYqrsMMMMMUUUUUUMOO.......", // 47
 "......PPOOOOOOOOUVVVVVXWVVYYYYYYqrsMMMMMUUUUUUUMMMO.....", // 48
 ".....OOOOOOOOOOUWVVVVVVXWWVYYYYYqrsMMMMUUUUUUUUUMMMO....", // 49
 "...POOOOOOOOOOUWWVVVVVVVVXWVYYYYqrrsMMUUUUUUUUUUMMMMO...", // 50
 "..POOOOOOOOOOWUWWVVVVVVVVVXWVYYYqrrsMMUUUUUUUUUUMMMMY...", // 51
 ".OPOOMOOOOOOOUWWWVVVVVVVVVVXWYYMqrrsMUUUUUUUUUUUUMMMMY..", // 52
 ".POOOMOOOOOOWUWWWVVVVVVVVVVVXWMMqrrsMUUUUUUUUUUUUMMMMMY.", // 53
 "OPOOOMOOOOMOWUWWWVVVVVVVVVVVVXWMqqrsUUUUUUUUUUUUUMMMMMY.", // 54
 "OOOOOOMOOOMOUWWWWVVVVVVVVVVVVVXWMqrMUUUUUUUUUUUUUMMMMMMY", // 55
 "OOOOOOMOOOMYUWWWWVVVVVVVVVVVVVVXWMMUUUUUUUUUUUUUUMMMMMMY", // 56
 "OOOOOOMOOYYMUWWWVVVVVVVVVVVVVVVVXWUUUUUUUUUUUUUUUMMMMMMY", // 57
 "OOYOOOMOYYYMUWWWVVVVVVVVVVVVVVVVUUUUUUUUUUUUUUUUUMMMMMMY", // 58
 "OOOYOOMOYYYMUWWVVVVVVVVVVVVVVVVUUUXUUUUUUUUUUUUUUMMMMMMY", // 59
 "OOOYOYMOYYYMUWWVVVVVVVVVVVVVVVVUUUUUUUUUUUUUUUUUUMMMMMMY", // 60
 "OOOOYYMOYYYMYUVVVVVVVVVVVVVVVVUUUUUUUUUUUUUUUUUUMUMMMMMM", // 61
 "OOOYYYMOYYYMYUVVVVVVVVVVVVVVVUUUUUXUUUUUUUUUUUUUMUMMMMMM", // 62
 "OOYYYYMOYYYMYUVVVVVVVVVVVVVVVUUUUUUUUUUUUUUUUUUUMUMMMMMM", // 63
];
var PATCH={
  mouth:[[33,31,"211112"], [34,31,"31xx13"], [35,31,"455554"]],
  eyes:[[22,26,"44444"], [23,26,"22222"], [24,27,"44"], [22,34,"4444"], [23,34,"2222"], [24,35,"44"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('mladen',{ paint:paint });
})(M);
