/* ===== portraits/sehic.js — Sulejman Šehić (66), Vorsitzender des Hausrats (Kapitel 2, Sarajevo)
   Kurzes graues Haar mit akkuratem Seitenscheitel links, langes Gesicht mit zwei Stirnfalten, Brille mit dunklem Oberrand
   (Browline) und feinem Metallrand unten, gepflegter grauer Schnurrbart; beige Strickjacke, zugeknöpft, im V-Ausschnitt
   hellblaues Hemd und marineblaue Krawatte. Pedantisch und einsam: Brauen innen leicht gehoben, Mund fest geschlossen.
   Legende: Ziffern Haut (p/q-Rampe) · q Tränensäcke · w v Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern · x y Brauen ·
   G H g Brille · M N O Schnurrbart · a–e Haar · A–E Strickjacke · X Y Knöpfe · S T U Hemd · n j o J Krawatte.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.q4, "5":P.p4, "6":P.p5, "7":P.l0, q:P.q3, w:P.s5, v:P.s4, i:P.w2, k:P.h1, L:P.l1, z:P.h2, x:P.m2, y:P.m3, G:P.h2, H:P.w3, g:P.m4, M:P.m2, N:P.m3, O:P.m1, a:P.m1, b:P.m2, c:P.m3, d:P.m4, e:P.s5, A:P.s1, B:P.s2, C:P.s3, D:P.s4, E:P.s5, X:P.w2, Y:P.w1, S:P.b3, T:P.b2, U:P.b4, n:P.n2, j:P.n1, o:P.n3, J:P.n0};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................................................", // 5
 "........................cddeedccb.......................", // 6
 ".....................cddeedcddcccbbb....................", // 7
 "...................cdeedcdeddcddcccbbb..................", // 8
 "..................cdeddcdeedcdddccccbbb.................", // 9
 ".................cddcdddeddcdddcdcccbbba................", // 10
 "................bcdcbcdddcdcdddcdccccbbba...............", // 11
 "................bcddcdcdcdcc44556665544ba...............", // 12
 "................bcddcdcdcc44556666655533a...............", // 13
 "...............bccdcdcdcc4455444544455332...............", // 14
 "...............bccdcdcccb4456666666555332...............", // 15
 "...............bcccdcccb44455544445445332...............", // 16
 "...............bccdccccb44556655665555332...............", // 17
 "...............bccccbcbb445yxxxy65yxxy3332..............", // 18
 "...............bcccbbcbb4yx45555645554xy32..............", // 19
 "...............bccb55GbGGGHGGGGGgGGHGGGG32..............", // 20
 "...............bcb564334GG55445g5g5445GG32..............", // 21
 "...............bcb553234443zzz34543zz33332..............", // 22
 "...............bcb54233454vwLkv454wikv3332..............", // 23
 "...............bcb543334554wii44544ii44332..............", // 24
 "...............bcb542344gg4qq4gg5g4q4ggg33..............", // 25
 "...............abb4534344554q5555654453332..............", // 26
 "...............abb445434566555555665433432..............", // 27
 "................aa44544455655554556672233...............", // 28
 "....................433445555543442332332...............", // 29
 "....................443445545535OMMNMO332...............", // 30
 "....................4444454443OMNMNMNMO32...............", // 31
 "....................44344454434O2112O2332...............", // 32
 "....................44334455434456544232................", // 33
 "....................44434455443443343322................", // 34
 "....................4443344554456655322.................", // 35
 "....................444433345445655422..................", // 36
 "....................44444333444555432...................", // 37
 "....................4444433323344432....................", // 38
 "...................SU444333432233UUS....................", // 39
 "...................SUU4334334344UUUS....................", // 40
 "...................SUUU3343noj3TUUSU....................", // 41
 "...................SSUUUUUUnnojUUSTUBB..................", // 42
 "...................CCESUUUTjnnjUSTUBBABB................", // 43
 "..................CCCCEDSUTjjjTSTTUBBABBBB..............", // 44
 ".............DDCCCCCCCEDUSTjjjJTTTUBABBBBBBBB...........", // 45
 "...........DDDDCCCCCCCCEDUUjooJTTTBBABBBBBBBBB..........", // 46
 ".........DDDDDDCCCCCCCCEDUUojjJTTTBABBBBBBBBBBBB........", // 47
 ".......DDBDDDDDCCCCCCCCCEDUjjjJTTUBABBBBBBBBBBBAB.......", // 48
 "......DDEBCCCCCCCCCCCCCCEDUjoojTTBBABBBBBBBBBBBABB......", // 49
 "....DDEECBCCCCCCCCCCCCCCCEDojjjTTBABBBBBBBBBBBBABBB.....", // 50
 "...DEECCCBCCCCCCCCCCCCCCCEDjjjoTUBABBBBBBBBBBBBABBBB....", // 51
 "..DECCCCBCCCCCCCCCCCCCCCCCEDoojTBABBBBBBBBBBBABBABBBB...", // 52
 ".DDCCCCCBCCCCCCCCCCCCCCCCCEDjjjUBABBBBBBBBBBABBBABBBB...", // 53
 ".CCCCCCCBCCCCCCCCCCCCCCCCCCEDjoBBABBBBBBBBBABBBBABBBBA..", // 54
 ".CCCCCCCBCCCCCCCCCCCCCCCCCCEDojBABBBBBBBBBBABBBBABBBBA..", // 55
 "CCCCCCCCBCCCCCCCCCCCCCCCCCCCEDjBABBBBBBBBBABBBBBBAAAAA..", // 56
 "CCCCCCCCBCBCCCCCCCCCCCCCCCCCEDBABBBBBBBBBBBBABBBBAAAAAA.", // 57
 "CCCCCCCCBCCBCCCCCCCCCCCCCCCCCDBABBBBBBBBBBBABBBBBAAAAAA.", // 58
 "CCCCCCCCBCCCBBCCCCCCCCCCCCCCCDBBBBBBBBBBBBBABBBBBAAAAAA.", // 59
 "CCCCCCCBCCCCCCBCCCCCCCCCCCCCCXYBBBBBBBBBBBABBBBBBBAAAAA.", // 60
 "CCCCCCCBCCCCCCCBCCCCCCCCCCCCCDBBBBBBBBBBBBABBBBBBBAAAAAA", // 61
 "CCCCCCCBCCCCCCCCCCCCCCCCCCCCCDBBBBBBBBBBBABBBBBBBBAAAAAA", // 62
 "CCCCCCCBCCCCCCCCCCCCCCCCCCCCCXYBBBBBBBBBBABBBBBBBBAAAAAA", // 63
];
var PATCH={
  mouth:[[32,32,"1v_1"], [33,31,"311123"], [34,32,"565"]],
  eyes:[[22,26,"44444"], [22,34,"4444"], [23,26,"45554"], [23,34,"5544"], [24,26,"3zzz3"], [24,34,"3zz3"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('sehic',{ paint:paint });
})(M);
