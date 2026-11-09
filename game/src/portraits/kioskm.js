/* ===== portraits/kioskm.js — Kioskfrau (um 50) am Ostbusbahnhof in Mostar
   Rotblondes, toupiertes Haar (hoch gekämmt, helle Bögen mit dunklem Kern), braune Brille, türkise Strickjacke mit V-Ausschnitt über cremefarbenem Top;
   neugierig gehobene Brauen, gutmütiger Blick, etwas Rouge. Aufgebaut auf dem Bild von Mira (gleiche Haltung, eigene Frisur, Brille und Farben).
   Legende: Ziffern Haut (p-Rampe) · d Rouge · q r s t u v Haar · w Augenweiß · i Iris · I Wimpern · * Glanz · z Z Brauen ·
   l L n Lippen · F G Brille · + Glasglanz · A B C D E Strickjacke · S U Top.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet) werden über das Grundbild gelegt. */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "k":P.k1, "d":P.d5, "q":P.t1, "r":P.t2, "s":P.t3, "t":P.t4, "u":P.t5, "v":P.d6, "w":P.s5, "i":P.g4, "I":P.h1, "*":P.l1, "z":P.t2, "Z":P.t1, "l":P.r3, "L":P.r4, "n":P.r2, "F":P.w1, "G":P.w2, "+":P.l1, "A":P.a1, "B":P.a2, "C":P.a3, "D":P.a4, "E":P.a5, "S":P.s4, "U":P.s5};
var BASE=[
"........................................................",
".........................kkkkkkk........................",
"......................kkktuvutskkk......................",
"....................kktuvuttuvuttskk....................",
"...................ktsttuvuttsttttsk....................",
"..................kusttttttusttttssk....................",
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
".............krrsqr3r334444444443444434323k.............",
"..............krrqr33334444444442lllll223k..............",
"...............krrr33333444444444nnnnn423k..............",
"................kkk333334444444443LLL3423k..............",
"..................k333333444444444333423k...............",
"..................k333332344444444455423k...............",
"..................k33333323444444455433k................",
"..................k3333333234444444323k.................",
"..................k333333332234444323k..................",
"..................k33333333332334433k...................",
"..................k333333333332222kk....................",
"................kkk3333333333332222k....................",
".............kkkDDDDD33333333332222k....................",
"..........kkkDDDDDDDDEB443443333222kk...................",
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
M.definePortrait('kioskm',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
