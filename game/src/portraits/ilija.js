/* ===== portraits/ilija.js — Ilija Perišić (62), Nachtwächter
   Massiger Kopf, schwarze Strickmütze mit Umschlag, kurzes graues Haar an Schläfe und Nacken, graue Stoppeln,
   dicke zusammengezogene Brauen, kleine tiefe Augen, breite Nase, Mundwinkel nach unten; dunkelgrüne wattierte
   Wachjacke mit umgeschlagenem Kragen und Aufnäher „ZAŠTITA“, dunkler Pullover am Hals; brummig.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 6 f Haut · K O a b c h i g 9 l Mütze, Haar, Brauen, Stoppeln · d e I Augen ·
   A B C D E Wachjacke · j 7 8 Aufnäher und Abzeichen · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, "7":P.y2, "8":P.y4, "9":P.s4, "A":P.g0, "a":P.m1, "B":P.g1, "b":P.m2, "C":P.g2, "c":P.m3, "D":P.g3, "d":P.e1, "E":P.g4, "e":P.h0, "f":P.d5, "g":P.s3, "h":P.s1, "I":P.h1, "i":P.s2, "j":P.y1, "K":P.k2, "k":P.k1, "l":P.s5, "O":P.m0};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................kkkkkkkkkkk.....................",
".....................kkkbbbaaaccaaakk...................",
"....................kbbbabbaaaaaaOaOOk..................",
"..................kkbbbabbaaaaaaaOaOOOkk................",
".................kbbbbbabbaaaaaaaOaOOOKKk...............",
".................kbbbbabbaaaaaaaaaOOOOKKk...............",
"................kbbbbbaaaaaaaaaaOaOOO78KKk..............",
"................kbbbbaaaaaaaaaaaOOOOO87KKk..............",
"...............kaaaaaaaaaaaaaaaOKOOOO77KKk..............",
"...............kaaaaaaaaaaaaaaOOOOOOOKKKkk..............",
"...............kaaaaaaaaaaaaOOOKOOOOKKKkkkkkkkkk........",
"...............kaaaaaaaaaaOOOOOOOOOKKKOObbbbbbbbk.......",
"...............kcKKKKKKKKKKOOKKKKKKKKkOOOOOOOOOaOk......",
"...............kccccccbc444KKKKKKKKKKKKKKKKKKOOOaak.....",
"...............kcccccccc44555544443222222kkkkkkkkk......",
"...............kccbccccb4455544444222222222k............",
"...............kbbbbbcbc445abaa444323333baak............",
"...............kbacc344c444Oaaaaab323aaOaa33k...........",
"...............kbbc455434443333aOOa3aO322223k...........",
"...............kbbb45324444322IIII2332III23k............",
"...............kbbb452144543239de234439de23k............",
"...............kbab4521445543322223454322233k...........",
"...............kabc45314455544333344554334433k..........",
"...............kaab45434455fff4444444555544433k.........",
"................kacb44343455544444444455655433k.........",
"................kbbb33g4334444444444332345f543k.........",
"................kbcb4444333444444444322333212k..........",
".................kccg4g4h33344444443h3i44333k...........",
".................kcb344g2233444444323g4g4i3k............",
"..................k4g3g3h2i3i4g4g4i2i4g4g33k............",
"..................k2332i2h3i3444443h322223k.............",
".................k22h3h3h2h3i4g4g4g3211111k.............",
".................k2223312h2i3i4g4g4g234432k.............",
".................k2222i312h2i3i4g4g4i2i3i44k............",
".................k333223212h2i3g4g4g4i4g594k............",
"................k3333222h1h2h3i4g4g4g4g5943k............",
"................k33332222h1h2i3g4g4g4g4g43k.............",
"................k333322222h112i3g4g4g4g33k..............",
"................k33332222222211h3i3i3i2kk...............",
"................k3D33222222222h21112hkk.................",
"...........kkkkkkEEDDD22222222222aaCDDkkkkkk............",
"........kkkEEDDEEDDDDDCbbbbbbbbbbbbCCCDDCCCCkkk.........",
".....kkkEEEDEDEDDDDDDDDCCaaaaaaaaaaCCCCCCCCCCDCkk.......",
"...kkEEEDEEEDDDDDDDDDDDDDCCaaaaaaaaCCCCCCCaCCCDDBk......",
"..kEEDEEEEEEDDDDDDDDDDDDDDDCaaaaaaaCCCCCCAACCCCCDDk.....",
".kEEEEEEEEEBBDDDDDDDDDDDDDCCCCaaaaCCCCCAACCAAACCBBBk....",
"kDDDEEEEBBBDDDDDDDDDDDDDDCCCCCCACCCCCCACCCCCCCAABBBBk...",
"kDDDEDBBDDDDDDBCDDDDDBBBBCCCCCCACCCCCCCCCCCCCCCCBBBBBk..",
"DDDDBBDDDDDDDDBCCBBBBCCCCCCCCCCACCCCCCCCCCCCCCCCBBBBBBk.",
"DDDDDDDDDDDDCCBCCCCCCCCCCCCCCCCACCCCCCCCCBBBBACCBBBBBBk.",
"DDDDDDC777777777777jDDDDDDDDDDDACDDDDDDDDCCCBABBAAABBBBk",
"DCCCCCC7A99A9A9A9AAjCCCCCCCCCCCACCCCCCCCCCCCCACCCCAAAAAk",
"CCDDDDD7A9A99A9A9AljCCCCCCCCCCCACCCCCCCCCCCCCCACBBCCCCCk",
"DDDDDDD7A99A9A99AAAjCCCCCCCCCCACCCCCCCCCCCCCCCACBBBBBBBk",
"DDDDDDD7jjjjjjjjjjjjCCCCCCCCCCACCCCCCCCCCBBBBCACBBBBBBBk",
"DDDDDDCCCCCCCDDBDDDDDDDDDDDDDDACDDDDDDDDDCCCBBABAAABBBBB",
"DCCCCCCDDDDDDDDBCCCCCCCCCCCCCCACCCCCCCCCCCCCCCACCCAAAAAA",
"CCDDDDDDDDDDDDDCBCCCCCCCCCCCCCACCCCCCCCCCCCCCCACBBCCCCCA",
"DDDDDDDDDDDDDDDCBCCCCCCCCCCCCCACCCCCCCCCCCCCCCCABBBBBBBC",
"DDDDDDDDDDDDCCCCBCCCCCCCCCCCCCACCCCCCCCCCBBBBCCABBBBBBBB",
"DDDDDDCCCCCCCDDDBDDDDDDDDDDDDDACDDDDDDDDDCCCBBBAAAABBBBB"];
var EYES={x:29,y:22,rows:[
" 3333    333",
"2IIII    III"]};
var MOUTH={x:37,y:34,rows:[
" 99",
"11111",
"3g4"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('ilija',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
