/* ===== portraits/mira.js — Mira (61), Kiosk am Fährterminal
   Weinrote Dauerwelle (Locken als helle Bögen mit dunklem Kern), Silberbrille an goldener Kette, Ohrstecker,
   lila Strickjacke mit V-Ausschnitt über cremefarbenem Top; neugierig gehobene Brauen, gutmütiges Lächeln, etwas Rouge.
   Legende: Ziffern Haut (p-Rampe) · d Rouge · q r s t u v Locken · w Augenweiß · i Iris · I Wimpern · * Glanz · z Z Brauen ·
   l L n Lippen · F G Brille · + Glasglanz · y Y Kette/Ohrring · A B C D E Strickjacke · S U Top.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet, 1 Pixel Zähne) werden über das Grundbild gelegt. */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "k":P.k1, "d":P.d5, "q":P.r0, "r":P.r1, "s":P.r2, "t":P.r3, "u":P.r4, "v":P.d5, "w":P.s5, "i":P.w3, "I":P.h1, "*":P.l1, "z":P.w2, "Z":P.w1, "l":P.r3, "L":P.r4, "n":P.r2, "F":P.m2, "G":P.m3, "+":P.l1, "y":P.y2, "Y":P.y4, "A":P.v0, "B":P.v1, "C":P.v2, "D":P.v3, "E":P.v4, "S":P.s4, "U":P.s5};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"...........................kkkk.........................",
"......................kkkkkuvuskk.......................",
"..................kkkktttttustttskk.....................",
".................kssttttttttstttssskk...................",
"................kuvuttuvuttttuvusssssk..................",
"................kustttustuvutusttttsssk.................",
"...............kttsttttstustttsttrssssrkk...............",
"..............ktttttuvutttsttttssrtttsrrrk..............",
"..............ktuvutustuvutttttttttrsssssrk.............",
".............kttustttstustuuttuttsttsrssrrk.............",
".............ktttsttttttstuttstssstssstssrk.............",
"............ktuvuuvutuvut4tss5rsq4srrrsrrrk.............",
"............ktustusttust44555555444443rrqrk.............",
"............kttsttsttts344555554444443333rk.............",
"............ksttttttttt344455544444443333rk.............",
"............ksstrssstr3344444444444443333rk.............",
"............ksssrssssr3444444zZZz44544zZ3rk.............",
"............ktttstttss34444zZ4444Zz44z44Z3k.............",
"............ktrsstrsss3FFFFFGGGFFFFFGGFFFFk.............",
"............krrsssrsss34444F421III2F32II1Fk.............",
".............krrssssss34444F42ww*I343wiI2Fk.............",
"..............krssssqr34444F443wii3533ii3Fk.............",
".............krrsq454334444F+443334453+33Fk.............",
"............krrrrs4334344444FFFFFFF5FFFFF3k.............",
"............krssss42243445dd54444444453223k.............",
"............krsqrr4324344ddd44444444445542k.............",
"............krrqrr344334444444444443444323k.............",
".............krrsss43r34444444444344212223k.............",
".............krrsqryr334444444443444434323k.............",
"..............krrqr33Y34444444442lllll223k..............",
"...............krrr33333444444444nnnnn423k..............",
"................kkk33y334444444443LLL3423k..............",
"..................k333333444444444333423k...............",
"..................k333Y32344444444455423k...............",
"..................k33333323444444455433k................",
"..................k333y333234444444323k.................",
"..................k333333332234444323k..................",
"..................k3333Y333332334433k...................",
"..................k333333333332222kk....................",
"................kkk33333y3333332222k....................",
".............kkkDDDDD33333333332222k....................",
"..........kkkDDDDDDDDEB44Y443333222kk...................",
"........kkDDDDDDCCCCCCEB5555533332222kkk................",
".......kDDDDDCCCCCCCCCCEB334333332222CBCkkk.............",
"......kDDDCCCCCCCCCCCCCEB443333332222CBCCCCkkk..........",
".....kDDBCCCCCCCCCCCCCCCEB44333332222CBCBBBCCCkk........",
"....kDDDBCCCCCCCCCCCCCCCCEB4333332222CBCBBBBBBCCk.......",
"...kDDDDCBCCCCCCCCCCCCCCCCEB333332222BCBBBBBBBBACkk.....",
"...kDDDDCBCCCCCCCCCCCCCCCCEUBUUUUU2UUBCBBBBBBBABBCCk....",
"..kBDDDDCBCCCCCCCCCCCCCCCCCECBUUUUUSSBCBBBBBBBABBBBk....",
"..kBCCCCCBCCCCCCCCCCCCCCCCCCEBCUUUUSSBCBBBBBBBABBBBAk...",
"..kBCCCCCBCCCCCCCCCCCCCCCCCCCEBUUUUSSBCBBBBBBBABBBBAAk..",
"..kBCCCCCBCCCCCCCCCCCCCCCCCCCECBUUUSCBCBBBBBBBABBBBAAk..",
"..kBCCCCCBCCCCCCCCCCCCCCCCCCCCECBUUSCBCBBBBBBBABBBBAAk..",
"..kBCCCCCCBCCCCCCCCCCCCCCCCCCCCECBUSCBCBBBBBBBABBBBAAk..",
"..kBCCCCCCBCCCCCCCCCCCCCCCCCCCCCEBUSBCCBBBBBBBABBBBAAk..",
"..kBCCCCCCBCCCCCCCCCCCCCCCCCCCCCECBSBCCBBBBBBBABBBBAAk..",
".kBBCCCCCCBCCCCCCCCCCCCCCCCCCCCCCECBBCCBBBBBBBABBBBAAk..",
".kBBCCCCCCBCCCCCCCCCCCCCCCCCCCCCCCECBCCBBBBBBBABBBBAAAk.",
".kBBCCCCCCBCCCCCCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBABBBBAAAk.",
".kBBCCCCCCBCCCCCCCCCCCCCCCCCCCCCCCCCCCCBBBBBBABBBBBAAAk."];
var EYES={x:29,y:22,rows:[
"344443  3443",
"34444   3443",
" 21112  2112"]};
var MOUTH={x:34,y:33,rows:[
" w ",
"nnn",
"LLL",
"333"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('mira',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
