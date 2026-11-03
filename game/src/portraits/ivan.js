/* ===== portraits/ivan.js — Prof. Ivan Barać (Geist, 71, 1992), Übersetzer
   Groß und leicht gebeugt (Kopf etwas vor), weißes längeres Haar nach hinten gestrichen bis zum Kragen, hohe Stirn mit
   Falten, runde Brille mit dunkler Fassung, freundlich gehobene Brauen, abwesender Blick; Tweedmantel braun-grün mit
   Revers, dunkler Wollschal. Natürliche Farben, das Spiel färbt ein (M.ghostLut): Haut q1 q2 q3 q4 p5 l0 (sechs Stufen),
   Haar s5/s6 heller als die Haut, Brauen m2/m3, Brille h2, Iris c2, Mundlinie q1 dunkler als die Haut.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 6 9 Haut · a b c d e f Haar und Brauen · 8 7 I Augen · F Brille · A B C D E g Tweedmantel ·
   Q R S Schal · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.q1, "2":P.q2, "3":P.q3, "4":P.q4, "5":P.p5, "6":P.l0, "7":P.c2, "8":P.s4, "9":P.d5, "A":P.e0, "a":P.m2, "B":P.e1, "b":P.m3, "C":P.e2, "c":P.m4, "D":P.e3, "d":P.s5, "E":P.e4, "e":P.s6, "F":P.h2, "f":P.l1, "g":P.g2, "I":P.h1, "k":P.k1, "Q":P.r1, "R":P.r2, "S":P.r3};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"..........................kkkkkkkk......................",
"......................kkkkfeeedccckkk...................",
"....................kkddeeeeeecdddccckk.................",
"...................keeeefeedddecceddccckk...............",
"..................kdddeeeffeeeedcccbbccbbk..............",
".................kedeeeeeeeeddcdddddbbbbbk..............",
"................keeeeeeffeddd55554444444b3k.............",
"...............kdddeeeeeefe545545555544333k.............",
"...............kdedeeeeed444566555555444433k............",
"..............kededeeeedd355555555544444433k............",
"..............kededeeeed3455533333444333433k............",
".............kdeeedeefe53455555555544444433k............",
".............keeedeefed53455544333334443333k............",
".............keeeddeddc5345555555bb44bb4433k............",
"............keeefedeedc53455baaab444444ba33k............",
"............keeeeedeedd53455433334444433333k............",
"............kdeeeeecddd5445544FFFF44444FF33k............",
"............kcdddedce55544544F3333F444F33Fk.............",
"............kcddedcccFFFFFFFF3IIII3FFFIII3Fk............",
"............kcdeeddcd5554443F3dd7I3F5Fd7I3Fk............",
"............kcdecddcd5554453F448774F5F4774Fk............",
"............kccdcdddd43544554Ff333F454Ff44F3k...........",
"............kccdbcddd442445554FFFF44544FFF33k...........",
"...........kccccbddcc435444555444444455554433k..........",
"............kccbbdccbb354444444334443344556543k.........",
"............kbbbbbccbc55343444333344323332123k..........",
"............kbbbbabbcb553334443344432344333kk...........",
"............kbbbbabbca443333344344432444433k............",
"............kbabaabbaaa4233333444443324423k.............",
"...........kbabaabbbbaa3223333444443211112k.............",
"............kabaabbbbaa3222333344444349433k.............",
"............kbbabbbbbaa212223333444443334k..............",
"............kbbabbabbaa241223334444445554k..............",
".............kbabbabba3223123334444445543k..............",
".............kbbbbabaa322221233444444443k...............",
"..............kbbbbbRSS222221123344433kk................",
".............kbbbbbRRRRSS22222112332RRk.................",
"..............kkkakRRRRRRSS22222SSSRRRQk................",
".................kkRRRRRRRRSSSSSRRRRQRRk................",
".........kkkkkkkkkkRRRRRRRRRRRRRRRRRRRRk................",
".......kkEEDDDCCCCCRRRRRRRRRRRRRRRRRRQRkk...............",
".....kkEEDDDDDCCCCDEQQQQQQQQQQQQQQQQQQCBCkkk............",
"....kEEDDDDDDDCCCDEDDDQQQQQQQQQQQQQQBBBCCCCDkk..........",
"...kEDDDDDDDDDCCDEDDDDDDDCQSRRRQQQCBBBBBBCCCDDkk........",
"..kEDDDDDDDDDDCCEDCDDDDDDDCSRRRQCCCBBBBBBACCCCDDk.......",
".kEDDDDDDDDDDDCCCBDDDDDDDDCSRRRQCCCBBBBBACCCCCCBk.......",
"kDDDDDDDDDDBDDCCCDDDDDDDDDSSRRRQCCCBBBBBACCCCCCBBk......",
"kDDDDDDDDDDBDDCCCCBDDDDDDDSSRRRQCCBBBBBACCCCCCCBBBk.....",
"DDDDDDDDDDDBDDCCCCCBDDDDDDSSRRRQCCBBBBBACCCCCCCBBBBk....",
"DDDDDDDDDDDBDDCCCCCCBDDDDDSSRRRQCCBBBBACCCCCCCCBBBBk....",
"DDDDDDDDDDDDBDCCCCCCCBDDDDSSRRRQCCBBBBACCCCCACCBBBBBk...",
"DDDDDDDDDDDDBDCCCCCCCBDDDDSSRRRQCBBBBACCCCCCACCBBBBBk...",
"DDDDDDDDDDDDBDCCCCCCCCBDDDSSRRRQCBBBBCCggCCCACCBBBBBBk..",
"CCCCCCCCCCCCBCCCCCCCCCCBDDDSRRRCCBBBCggCCCCCCACBBBBBBk..",
"CCCCCCCCCCCCBCCCCCCCCCCCBDDSRRRCCBBBgCCCCCCCCACBBBBBBk..",
"CCCCCCCCCCCCBCggCCCCCCCCBDDSRRRCCBBBCCCCCCCCCACBBBBBBk..",
"CCCCCCCCCCCCgBCCCCCCCCCCCBDSRRRCBBBCCCCCCCCCCACBBBBBBBk.",
"CCCCCCCCCCCCCBCCCCCCCCCCCBDSRRRCBBBCCCCCCCCCCCABBBBBBBk.",
"CCCCCCCCCCCCCBCCCCCCCCCCCCBSRRRCBBBCCCCCCCCCCCABBBBBBBk.",
"CCCCCCCCCCCCCBCCCCCCCCCCCCBSRRRCBBCCCCCCCCCCCCABBBBBBBk."];
var EYES={x:30,y:22,rows:[
"4444    443",
"III     II",
" 444     44"]};
var MOUTH={x:37,y:33,rows:[
" d",
"1111",
"494"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('ivan',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.ivan=true;   // Geist: Porträt in der Geisterfarbe (M.ghostLut)
})(M);
