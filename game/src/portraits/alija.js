/* ===== portraits/alija.js — Alija (Geist, um 60, gestorben 1995), Kioskbesitzer (Kapitel 2, Sarajevo)
   Graubraune Tweed-Schiebermütze mit Druckknopf am Schirm, darunter kurzes graues Haar; rundes, freundliches Gesicht mit
   großen Ohren und weichem Doppelkinn, Brauen innen hochgezogen (verwirrt), leises Lächeln; offenes helles Hemd, graue Weste,
   eine kleine Zange mit roten Griffen an einer Kordel um den Hals, ein Bündel Zeitungen unter dem nahen Arm.
   Natürliche Farben: das Spiel färbt Geister selbst ein (M.ghostLut, ohne Raster). Haut deshalb auf der Rampe
   l0 p5 p4 p3 q2 q1 q0 (eingefärbt sieben getrennte Stufen); Augenweiß hell, Iris, Wimpern, Brauen, Brille und Mundspalt
   deutlich dunkler, damit Augen, Brauen, Mund und Kontur auch einfarbig über die Helligkeit lesbar bleiben.
   Legende: Ziffern Haut · w v Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern · x y Brauen · a–d Haar · p–t n Mütze ·
   A–E Weste · U V W X Hemd · N O P Q Zeitungen · K J Kordel · M H R Y Zange.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline.
   Für das Prüfblatt (portraitsheet.js) meldet sich Alija am Ende selbst als Geist an (M.PORTRAIT_GHOSTS.alija). */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"0":P.q0, "1":P.q1, "2":P.q2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, w:P.s6, v:P.s5, i:P.w2, k:P.h1, L:P.l1, z:P.h2, x:P.s0, y:P.s1, a:P.m1, b:P.m2, c:P.m3, d:P.m4, p:P.s0, q:P.s1, r:P.s2, s:P.s3, t:P.s4, n:P.k2, A:P.m0, B:P.m1, C:P.m3, D:P.m4, E:P.s5, U:P.s4, V:P.s5, W:P.s3, X:P.m3, N:P.s5, O:P.s6, P:P.m3, Q:P.s3, K:P.w2, J:P.w3, M:P.m4, H:P.m3, R:P.r2, Y:P.r3};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "....................rsssrrrrrrrq........................", // 5
 ".................srsttssrrrrrsqrqqrp....................", // 6
 "...............rsstttsssrrrrrrsqqqrqpp..................", // 7
 "..............qrsstsrssrsrrsrrrsqrqrqpp.................", // 8
 ".............qrsssrssrrrrssrrrrrqrqqqrpp................", // 9
 "............rrssssrsrrssrrrrrrrrqqqrqqrqpp..............", // 10
 "............qrsrsrrsrrrrrsrrrsrrrqqqqqqqqqpp............", // 11
 "............qrsrrsrrrrrrrrrsrrrrrqXqrstttttsq...........", // 12
 "............pqsrrrrrrrrrrrqqqrqqpqrssssssrrqq...........", // 13
 "............pqqsrrrrrsssqqqqppnnnnnnnnnnnnnnnn..........", // 14
 ".............pqqrrrrqqqqpp244444444332221...............", // 15
 ".............ppqqqqppbc224445555554333322...............", // 16
 "..............pppcbbbcb244555555555443322...............", // 17
 "..............bccdcbbbb345555yxx55xxy4332...............", // 18
 "..............bcdcb5bbb3555yx55555544xy32...............", // 19
 "..............bccb5543335yx55555555444x32...............", // 20
 "..............bcb554333455544445554333432...............", // 21
 "..............bb45532334542zzz25552zzz232...............", // 22
 "..............bb4542333454vwLkv555wikv332...............", // 23
 "..............ab45433334554wii45554iiv332...............", // 24
 "..............ab4542343455544455555333432...............", // 25
 "...............a4453433355555555555444332...............", // 26
 ".................4534334555555555555434322..............", // 27
 ".................4543334555555545566534322..............", // 28
 "..................44333455555454245432332...............", // 29
 "..................4433345555455544433332................", // 30
 "..................4443335554555555544332................", // 31
 "..................444333554552444442432.................", // 32
 "..................444333554555211124332.................", // 33
 "...................44433455455555553332.................", // 34
 "...................44433455545544453322.................", // 35
 "...................4444344554555555332..................", // 36
 "....................44444245555555432...................", // 37
 "....................4444442445554422....................", // 38
 "...................UV44433312233221U....................", // 39
 "..................UVV44433322222VVKW....................", // 40
 "..................UVVU4K3332222UVVWUU...................", // 41
 "..................UUVVVUU4433UUVWJUUAUU.................", // 42
 "..................UCCUVJU43332WUUUUBABBBUU..............", // 43
 "..............UUCCCCCCEUUWUU3UUUKUUABBBBBBBU............", // 44
 "...........UUDDDCCCCCCEUKUUWUUUUUUBABBBBBBBBBU..........", // 45
 "........VVVDDDDDCCCCCCCEUUUUUUUJUUABBBBBBBBBBUWW........", // 46
 ".......VVUUDDDDDCCCCCCCECJUUUUUUUCABBBBBBBBBBUWWWW......", // 47
 ".....VVVUUUDDDDDCCCCCCCCEUUUUUKUUCABBBBBABBBBBWWWWW.....", // 48
 "....VVVUUUUDDDDDCCCCCCCCECKUUUUUUABBBBBBABBBBBWWWWWW....", // 49
 "...VVVUUUUUCCCBCCCCCCCCCCEUUUJUUCABBBBBBABBBBBWWWWWW....", // 50
 "..VVVUUUUUUCCCBCCCCCCCCCCCEKMHKUACBBBBBBABAAAAWWWWWWW...", // 51
 ".VVVUUUUUUUCCCBCCCCCCCCCCCEMHHMCACBBBBBBBAAAAAWWWWWWWW..", // 52
 ".VVUUUUUUUUCCCCBCCCCCCCCCCCRHHRCACBBAAAAAAAAAAAWWWWWWW..", // 53
 ".VUUUUUUUUUCCCCBCBBBBBBCCCRYUUYRCCBBBBBBBAAAAAAWWWWWWW..", // 54
 "VUUUUUUUUUUCCCOOOOOOOCCCCCYCEUCRCCBBBBBBBAAAAAAWWWXWWWW.", // 55
 "UUWUUUUUUUUOOOONNNNNNNQCCYRCECARCCBBBBBBBAAAAAAWWWXWWWW.", // 56
 "UUWNOOUWUUUNNNNNPNPPNNQCCCCCCABCCCBBBBBBBAAAAAAWWWXWWWW.", // 57
 "UUUQNNUWUUUPPPNPNNNNNNQCCCCCCABCCCBBBBBBBAAAAAAWWWXWWWW.", // 58
 "UUUQNNPWUUUNNNNNPPPNNNQCCCCCCAECCCBBBBBBBAAAAAAWWWWXWWWW", // 59
 "UUUQNNNWUUUPNPPPNNNNNNQCCCCCCABCCCBBBBBBBBAAAAAWWWWXWWWW", // 60
 "UUUNQNPUWUUUNNNNPNPPNNQCCCCCCABCCCBBBBBBBBAAAAAWWWWXWWWW", // 61
 "UUUUQNNUWUUUPPNPNNNNNNQCCCCCCAECCCBBBBBBBBAAAAAWWWWXWWWW", // 62
 "UUUUQNPUWUUUNNNNNNNNNNQCCCCCCABCCCBBBBBBBBAAAAAAWWWXWWWW", // 63
];
var PATCH={
  mouth:[[33,30,"10w01"], [34,30,"20002"], [35,30,"455"]],
  eyes:[[22,26,"34443"], [22,34,"34443"], [23,26,"45544"], [23,34,"4444"], [24,26,"2zzz2"], [24,34,"2zzz"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('alija',{ paint:paint });
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.alija=true;
})(M);
