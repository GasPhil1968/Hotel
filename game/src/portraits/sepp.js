/* ===== portraits/sepp.js — Giuseppe „Peppino“ Ruggiero, genannt Sepp (Geist, † Dezember 2011, wirkt 72), Gepäckträger Nr. 17 (Kapitel 4, München)
   Schlank und sehr aufrecht: schmales Gesicht, kurzes weißes Haar unter der Mütze, buschige weiße Brauen, dunkle Augen, ein dünner,
   gepflegter weißer Schnurrbart; die Schirmmütze dunkelblau mit Lackschirm und einem Messingschild vorn, darauf die „17“ (lesbar);
   dunkelblaue Uniformjacke mit Messingknöpfen, an Schulter und Kanten blank gewetzt, weißes Hemd, dunkle Krawatte. Würdevoll, verschlossen.
   Aufbau nach portraits/bruno.js (Portiersmütze, Uniform), der Kopf zwei Pixel schmaler, Schnurrbart dünn, alle Farben neu.
   In natürlichen Farben gemalt; das Spiel färbt Geister ein (M.ghostLut mit M.GHOST_OVR.sepp aus 14_k4_cast_b.js: das Dunkelblau von
   Mütze und Jacke bleibt, Messing y → e/s bleibt hell, Haar und Schnurrbart s5/s6 bleiben weiß). Formen trennen sich über die Helligkeit.
   Legende wie bruno.js; Varianten EYES (Lid zu) und MOUTH (Lippen geöffnet, 1 Pixel Zähne) als Flicken. Kontur zusätzlich mit M.outline. */
(function(M){
'use strict';
var P=M.P;
var L={"1":P.q1, "2":P.q2, "3":P.q3, "4":P.q4, "5":P.p5, "6":P.l0, "k":P.k1, "w":P.s5, "W":P.s4, "i":P.h2, "I":P.h1, "X":P.m3, "Z":P.s3, "z":P.s5, "y":P.s6, "n":P.q1,
  "e":P.n0, "c":P.n0, "C":P.n1, "d":P.n2, "D":P.n3, "o":P.n0, "O":P.n1, "b":P.y2, "B":P.y3, "f":P.y4, "F":P.y5, "u":P.k0, "v":P.k1, "V":P.m2,
  "Q":P.k2, "G":P.n0, "H":P.n1, "J":P.n2, "M":P.n3, "S":P.s4, "U":P.s5, "T":P.s6, "q":P.m1, "r":P.m0};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"....................kkkkkkkkkkkkkkkkkkkkkk..............",
"..................kkDDDDDDDDDDDDDDDDDDddddk.............",
".................kDDddddCCCCCCCCCCCCCCccccdk............",
"................kDddddddCCCCCCCCCCCCCCccccck............",
"................kdddddddCCCCCCCCCCCCCCccccck............",
"...............kDCCCCCCCCCCCCCCCCCCCCCccccck............",
"................kcCCCCCCCCCCCCCCCCCCCCcccck.............",
"................kOccccccccccccccccccccOOOk..............",
"................koOOOOOOOOOOOOOOOOOFfOOook..............",
"................keooooooooooooooooofFooeekkkk...........",
"................kZzeeeeeeeeuuveeeeevvvvvvvvvvk..........",
"................kZyzzy4555554uuVWWVvvvvvvVVvvuk.........",
"................kZzzyy455555544uuuuuuuvvvuuuuk..........",
"................kZzyzy4555555544443333uuukkkk...........",
"................kZyzzy4555555555544433333k..............",
"................kZzzyy4555555555yz55zy444k..............",
"................kZ344345555yyzzzZZ454ZzzZ4k.............",
"................kZ45434555zZZ44444454444Z4k.............",
"................kZ4434455555421III2543II2k..............",
"................kZ4334455554523WiI454WiI3k..............",
"................kZ4224455545554Wii4644ii4k..............",
".................k421445545555544455644444k.............",
".................k432445556655433455643444k.............",
".................k433445566655544555564344k.............",
"..................443445556655555555556653k.............",
"..................34433555555555544555444k..............",
"..................X3434355555555455432334k..............",
"..................kX4443555555444zyyyyzZ34..............",
"..................k444455555554455Z4444Z34..............",
"..................k4444455555544443333344...............",
"..................k4444455555544444nnnnn4...............",
"..................k444444455554444455554k...............",
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
var MOUTH={x:34,y:34,rows:[
"nwwnn",
"nnnn ",
" 55  "]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
// Messingschild vorn an der Mütze mit der „17“ (dunkle Ziffern, ein Pixel stark)
function badge(b){ b.rect(31,10,8,5,P.y3); b.hl(31,38,10,P.y4); b.vl(31,10,14,P.y4); b.hl(31,38,14,P.y2); b.vl(38,10,14,P.y2);
  b.px(33,11,P.k1); b.px(32,12,P.k1); b.px(33,12,P.k1); b.px(33,13,P.k1);           // 1
  b.hl(35,37,11,P.k1); b.px(37,12,P.k1); b.px(36,13,P.k1); }                         // 7
// blank gewetzt: Schulterkante und Revers glänzen
function worn(b){ b.line(2,47,10,44,P.n3); b.line(11,44,15,43,P.n2); b.px(4,46,P.n4); b.px(7,45,P.n4); b.line(36,47,40,46,P.n2); }
M.definePortrait('sepp',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth) put(b,L,MOUTH.rows,MOUTH.x,MOUTH.y);
  if (v.eyes) put(b,L,EYES.rows,EYES.x,EYES.y);
  badge(b); worn(b);
  M.outline(b,P.k1);
} });
// im Spiel ein Geist: Porträt in seiner Geisterfarbe (M.ghostLut)
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.sepp=true;
})(M);
