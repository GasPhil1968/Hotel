/* ===== portraits/hamdija.js — Hamdija Selimović (um die 50, 1993), Abfüller der Brauerei, Geist (Kapitel 5, Sarajevo)
   Kopfform und Pixelkarte wie Šehić (Kapitel 2), eigene Farben: dunkles, an den Schläfen grau meliertes Haar, dunkle Brauen,
   dichter dunkler Schnurrbart, keine Brille; blaues Arbeitshemd, darunter ein helles Unterhemd, braunes Halsband der Gummischürze.
   Das Spiel färbt das Bild beim Zwischenspeichern in seine Geisterfarbe um (M.PORTRAIT_GHOSTS, 14_k5_cast.js). */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.q4, "5":P.p4, "6":P.p5, "7":P.l0, q:P.q3, w:P.s5, v:P.s4, i:P.w2, k:P.h1, L:P.l1, z:P.h2, x:P.k1, y:P.m1, G:P.p2, H:P.p4, g:P.p4, M:P.k1, N:P.m1, O:P.k0, a:P.k1, b:P.m0, c:P.m1, d:P.m2, e:P.m3, A:P.n0, B:P.n1, C:P.n2, D:P.n3, E:P.n4, X:P.s4, Y:P.s3, S:P.s4, T:P.s3, U:P.s5, n:P.e1, j:P.e0, o:P.e2, J:P.e0};
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
M.definePortrait('hamdija',{ paint:paint });
})(M);
