/* ===== portraits/bruno.js — Bruno Lalić (Geist, 66), Nachtportier im Hotel Palma
   Portiersmütze mit Messingband und Lackschild, grauer Schnurrbart, flaschengrüne Uniform mit Messingknöpfen,
   Schlüssel-Abzeichen am Revers; höflich, würdevoll, ein wenig verloren. Natürliche Farben, das Spiel färbt ein (spiritP).
   Hautrampe bewusst p5/q4/q3/q2/q1/l0: diese Töne bleiben unter spiritP fast rauschfrei (p4/p3 würden stark rastern).
   Legende: Ziffern Haut · w/W Augenweiß · i Iris · I Wimpern/Pupille · X Z z y Haar, Brauen, Schnurrbart (grau) ·
   c C d D Mütze · b B f F e Messingband und Abzeichen · u v V Schild · Q G H J M Uniform · S U T Hemd · q r Krawatte.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet, 1 Pixel Zähne) werden über das Grundbild gelegt. */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.q1, "2":P.q2, "3":P.q3, "4":P.q4, "5":P.p5, "6":P.l0, "k":P.k1, "w":P.s5, "W":P.s4, "i":P.c2, "I":P.h1, "X":P.m1, "Z":P.m2, "z":P.m3, "y":P.m4, "n":P.q1, "e":P.g0, "c":P.g1, "C":P.g2, "d":P.g3, "D":P.g4, "b":P.y2, "B":P.y3, "f":P.y4, "F":P.y5, "u":P.k0, "v":P.k1, "V":P.m2, "Q":P.g0, "G":P.g1, "H":P.g2, "J":P.g3, "M":P.g4, "S":P.s4, "U":P.s5, "T":P.s6, "q":P.r1, "r":P.r0};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"....................kkkkkkkkkkkkkkkkkkkkkk..............",
".................kkkDDDDDDDDDDDDDDDDDDddddk.............",
"...............kkDDDddddCCCCCCCCCCCCCCccccdk............",
"..............kDDdddddddCCCCCCCCCCCCCCccccck............",
"..............kdddddddddCCCCCCCCCCCCCCccccck............",
".............kDCCCCCCCCCCCCCCCCCCCCCCCccccck............",
"..............kcCCCCCCCCCCCCCCCCCCCCCCcccck.............",
"..............kBBBccccccccccccccccccccBBBk..............",
"..............kbbbBBBBBBBBBBBBBBBBBFfBBbbk..............",
"..............keeebbbbbbbbbbbbbbbbbfFbbeekkkk...........",
"..............kZZzzeeeeeeeeuuveeeeevvvvvvvvvvk..........",
"..............kZZzyzzy4555554uuVWWVvvvvvvVVvvuk.........",
"..............kZZyzzyy455555544uuuuuuuvvvuuuuk..........",
"..............kZZzzyzy4555555544443333uuukkkk...........",
"..............kZZzyzzy4555555555544433333k..............",
"..............kZZyzzyy4555555555yz55zy444k..............",
"..............kZZz344345555yyzzzZZ454ZzzZ4k.............",
"..............kZZz45434555zZZ44444454444Z4k.............",
"..............kZZy4434455555421III2543II2k..............",
"..............kZZz4334455554523WiI454WiI3k..............",
"..............kZZz4224455545554Wii4644ii4k..............",
"...............kZy421445545555544455644444k.............",
"...............kZz432445556655433455643444k.............",
"...............kZz433445566655544555564344k.............",
"................kZ443445556655555555556653k.............",
"................kZ34434555555555544555444k..............",
".................kX3434555555555455432334k..............",
"..................kX444555555544zyyyyzzZ4k..............",
"..................k44445555555zzZzzzZZZ3k...............",
"..................k44444555555Z43ZZZZ344k...............",
"..................k444445555555444544454k...............",
"..................k444444455555554444554k...............",
"..................k444443455555555566544k...............",
"..................k444444345555555565544k...............",
"..................k444444434555555555444k...............",
"..................k44444444334455555444k................",
"..................k4444444444344454443k.................",
"..................k44444444444334443kk..................",
"...............kkkJJJJTTTT444443333k....................",
"............kkkJJJJJMJJUUUTTTTUUUUSTk...................",
".........kkkJJJJJJHHMJJSSSUUUUTTTTTUTkk.................",
".......kkJJJJJJHHHHHMJJJUUSSSUUUSSSSSSSkkk..............",
"......kJJJJJHHHHHHHHHMJJJGUUUSSSUUqSSSSHHHkkkk..........",
".....kJJJHHHHHHHHHHHHMJJHHGbUUUUUUqrSSSHHGHHHHkk........",
"....kJJHHGHHHHHHHHHHHHMJJHfGBUUUUUqrSSHHHGGGGGHHkk......",
"...kJJJJHGHHHHHHHHHHHHHMJJHBUUUUUUqrSSHHHGGGGGGGHHk.....",
"..kGJJJJHGHHHHHHHHHHHHHHMJJHGUUUUUqrSSHHHGGGGGGQGGHk....",
"..kGJJJJHGHHHHHHHHHHHHHHHHMJHGUUUUqrSSHHHGGGGGGQGGQHk...",
"..kGJJJJHGHHHHHHHHHHHHHHHHHMJHGUUUqrSSHHHGGGGGQGGGQQHk..",
".kGGHHHHHGHHHHHHHHHHHHHHHHHHMJHGUUqrSHHHHGGGGGQGGGQQQk..",
".kGGHHHHHGHHHHHHHHHHHHHHHHHHHHMHGUqrSHHHHGGGGGQGGGQQQk..",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHMGHqrSHHHHGGGGGQGGGQQQHk.",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHHHGqrSHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHGrHHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHHHfHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHHbBHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHHfHHHHGGGGGQGGGQQQQk.",
".kGGHHHHHHHGHHHHHHHHHHHHHHHHHHHHHHHbBHHHHGGGGGQGGGQQQQk."];
var EYES={x:29,y:22,rows:[
"455554  4544",
"45554   4444",
" 32II3  3II3"]};
var MOUTH={x:32,y:34,rows:[
"3nwnn3",
"  5   ",
"  444 "]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('bruno',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
