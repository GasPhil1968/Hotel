/* ===== portraits/zdenka.js — Zdenka Bašić (78), Nachbarin in Veli Varoš =====
   Graues Haar straff zum Knoten zurückgekämmt, scharfe Züge (hohe Wangenknochen, spitze Nase und Kinn,
   gebogene Brauen, schmale Lippen mit einem Hauch Spott), ganz in Schwarz: Strickjacke über Bluse, kleines Kreuz.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = transparent) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), kühles Gegenlicht an der rechten Kante; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p0, "2":P.p1, "3":P.p2, "4":P.p3, "5":P.p4, "6":P.p5, a:P.m1, b:P.m2, c:P.m3, d:P.m4, e:P.s5, A:P.k0, B:P.k1, C:P.k2, D:P.m0, E:P.m1, F:P.m2, S:P.m4, W:P.s6, g:P.m2, s:P.m1, x:P.s4, i:P.w1, o:P.k0, L:P.l1, y:P.y3};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "................cdd......dddd...........................", // 5
 "..............deeccdd.ddbbebdddd........................", // 6
 ".............ddccddbadddddddebbbdd......................", // 7
 ".............dccdbbdaadbbbdddcccbbd.....................", // 8
 "............ccccbbaadaadddbbbddcccbc....................", // 9
 "............cccbbaaaaaaddddddbbddccbc...................", // 10
 ".............abbaaabbaddddddcccbbdcbbc..................", // 11
 ".............baabbbaaaadddddc5665b54bb..................", // 12
 "..............aaaaaaaaddddd56665555544b.................", // 13
 "...............daaaaaddddd5665444555544.................", // 14
 "...............dcddbbdddd55666665555444.................", // 15
 "..............ddbccddbbdd455544555445444................", // 16
 "..............addbbcdddbb566655555555444................", // 17
 "..............addddbcccc45gss555455ssg44................", // 18
 "..............daddddbbc44g444ss545s444g44...............", // 19
 "..............cacaabbbb444444334543444444...............", // 20
 "..............ccaab5544433111124541111344...............", // 21
 "..............ccaa56445441xLox3454xLo1444...............", // 22
 "..............ccca543555344ii444554ii3444...............", // 23
 "..............ccca54255465433455564334544...............", // 24
 "..............baca54355664354455563445554...............", // 25
 "..............bbca55445566555555556344544...............", // 26
 "..............abcab5544555555555456634443...............", // 27
 "..............aaaab5544445555555455665343...............", // 28
 "...............aaca4544444555565542333343...............", // 29
 "...............aaaab4y444444566343333443................", // 30
 "................aaaab3344444563544444443................", // 31
 ".................aaaaaa34455553444444333................", // 32
 "....................34a34555543222222443................", // 33
 "....................34434555543345654443................", // 34
 "....................3344245553443334433.................", // 35
 "....................3344324545455665433.................", // 36
 "....................333443233445565543..................", // 37
 ".....................33333323334455443..................", // 38
 ".....................3334433223334433...................", // 39
 ".....................33343333322333.....................", // 40
 ".....................CDDC4433343223.....................", // 41
 "....................CDEEDC43333443CD....................", // 42
 "....................BCDEEDDC33333CDDC...................", // 43
 ".....................BCDDEEDDDCC3CDDCB..................", // 44
 "......................BCCDDDDDDCCB3BBBBBBC..............", // 45
 "...............CCCCCCCCCBBCFCCCCCCBBFBBBBADBBC..........", // 46
 "..........EECCCCCCCEDACCCCCCFBBBBBBFBBBBADBBBBBBC.......", // 47
 ".......CEECCCCCCCCCCEDACCCCCCFBBBBFBBBBBADBBBBBABC......", // 48
 ".....DEECCCCCCCCCCCCCEDAACCCBBFBBFBBBBBADBBBBBBABBC.....", // 49
 "....EECCCCCCCCCCCCCCCCCEDACCBBBFFBBBBBBADBBBBBBABBBC....", // 50
 "...EDDCCCCCCCCCCCCCCCCCCEDACBBBSBBBBBBADBBBBBBBABBBBC...", // 51
 "..EDDDCCDBCCCCCCCCCCCCCCCEDACBSWSBBBBBAEBBBBBBABBBBBBC..", // 52
 ".EDDDDCCDBCCCCCCCCCCCCCCCCEDABBSBBBBBADBBBBBBBABBBBBBBC.", // 53
 ".EDDDDCCCDBCCCCCCCCCCCCCCCCEDABSBBBBBADBBBBBBBABBBBBBBC.", // 54
 "DEDDDCCCCDBCCCCCCCCCCCCCCCCBEDASBBBBBADBBBBBBBABBBBBBBC.", // 55
 "EDDDDCCCCCDBCCCCCCCCCCCCCCCBBEDABBBBADBBBBBBBBABBBBBBBBC", // 56
 "EDDDCCCCCCDBCCCCCCCCCCCCCCBBBEDABBBBAEBBBBBBBBABBBBBBBBC", // 57
 "DDDCCCCCCCDBCCCCCCCCCCCCCBBBBBEDABBBADBBBBBBBBABBBBBBBBC", // 58
 "DDDCCCCCCCDBCCCCCCCCCCCCCBBBBBEDBABBADBBBBBBBBABBBBBBBBB", // 59
 "DDCCCCCCCCCDBCCCCCCCCCCCCBBBBBBEDABBADBBBBBBBBABBBBBBBBB", // 60
 "DDCCCCCCCCCDBCCCCCCCCCCCBBBBBBBEDBAADBBBBBBBBBABBBBBBBBB", // 61
 "DCCCCCCCCCCDBCCCCCCCCCCBBBBBBBBBEDAAEBBBBBBBBBABBBBBBBBB", // 62
 "CCCCCCCCCCCDBCCCCCCCCCBBBBBBBBBBEDBADBBBBBBBBBABBBBBBBBB", // 63
];
var PATCH={
  mouth:[[33,31,"21x112"], [34,31,"321124"], [35,32,"4554"]],
  eyes:[[21,25,"444444"], [22,25,"222223"], [23,26,"4444"], [21,34,"4444"], [22,34,"2222"], [23,34,"4443"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('zdenka',{ paint:paint });
})(M);
