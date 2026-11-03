/* ===== portraits/milka.js — Milka Đurić (85), Nachbarin an der Obala
   Zierlich und sehr alt: schmales Gesicht, eingefallene Wangen, tiefe Falten, schmale Lippen; schwarzes Kopftuch,
   im Nacken geknotet (Knoten und zwei Zipfel mit Fransen hinten), darunter vorn dünnes weißes Haar; dünne ovale
   Metallbrille, klare wache Augen; brauner Wollmantel mit breitem Kragen über dunklem Strick; erinnert sich genau.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 9 g Haut · K O a b Kopftuch · c d e f 6 weißes Haar, Brauen, Brille · 7 I 8 Augen ·
   A B C D E F i h Mantel und Knöpfe · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l1, "7":P.c3, "8":P.s4, "9":P.q3, "A":P.w0, "a":P.m1, "B":P.w1, "b":P.m2, "C":P.w2, "c":P.m3, "D":P.w3, "d":P.m4, "E":P.w4, "e":P.s5, "F":P.w5, "f":P.s6, "g":P.d5, "h":P.h3, "I":P.h1, "i":P.h2, "K":P.k2, "k":P.k1, "O":P.m0};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
".........................kkkkkkkkk......................",
"......................kkkaaaaaaaOOkkk...................",
"....................kkbbbbaabaaabOOaOk..................",
"..................kkbbbbbaKaaaaaaaaOKKkk................",
".................kbbbbbbaKbaaababOOKOKOKk...............",
"................kbbbbbbaKaaaaaabOKOOOKKKKk..............",
"...............kbbbbbbbKbaaabbbaOOOOaKKKOk..............",
"...............kbbbbbbaKaaaabaKKOOOOOOKKKKk.............",
"..............kbbbbbbaOaaabbakbaOOaOOOOKKKOk............",
".............kbbbbbbaKaaaabaKaaaaaOOOOOOOKKk............",
".............kbbbbabkaaabbaabaaOaOOOaKKKOKKk............",
".............kbbbabaKaaabaKabbbaaaaaaaaaaaKk............",
"............kabaaabKaabbabbbfeedeefeedeeddaak...........",
"............kaaaaabKaaaaadeedeedeedeededdckk............",
"............kababbaKbaab455555444444444333k.............",
"............kabKabKaaaab455443334433344333k.............",
"...........kaabKabOaaabb455554444444444433k.............",
"...........kaabKbaKaaaab4554cddddc444ddc33k.............",
"...........kbabKbKaabaab45443bbbbbb333bbbbk.............",
"...........kabaKbkaaaaabbbbbb2IIII2bbbIII2k.............",
"...........kabOabKbaaaba4543b3e6k73b4bek73k.............",
"...........kabKabKaaaaOa4543b487734b4b4733k.............",
"...........kabKabKaabOOa45543bbbbbb454bbbbk.............",
"...........kOaKaaaOOOOOa4555543334445544433k............",
"...........kObOOOaOOOOaa44555544444445555433k...........",
"...........kKakOOaKOOOO334444433444333445432k...........",
"...........kOOaOaaKOaOO23344333334432332123k............",
"...........kKKaKObKOOOOOa3343334432433333kk.............",
"...........kKKbKOOkOOOaO3a333344423444333k..............",
"...........kKKKkKOOaOOOKKa333444323999333k..............",
"...........kOKKakKKakKKKO3a33344323211233k..............",
"............kKKakKKKkKKKKKa333344334g4333k..............",
"............kKOKkKOKKkOKKKOa3333432332344k..............",
"............kKKKbkKKKKkKKKK4a444443445554k..............",
"............kKKKOkKKOKakOKKK4a44444445543k..............",
".............kKKKKkKKKKkKKKKKKa444444443k...............",
".............kOKKKOkKKOKkaOKKKOOO44433kk................",
".............kKKKKKKkKKKKkkaKKKKKOOkkkk.................",
"..............kkkkkkkkkkkkkkkkkkkkaabaak................",
"................kkkkkkkkkkkkkkkkkkabaaak................",
".................kkkkkkkkkkkkkkkkkbaaaak................",
"..................kkkkkkkkkkkkkkkkkOOKKKk...............",
"..............kkkkEkkkkkkkkkkkkkkkOaakKOKk..............",
"............kkEEDFFEEkkkkkkkkkkkkkOaODKOKkkk............",
"..........kkEEDDFEEEEEEEEEakkkkkaOaOOCKKOCCCkk..........",
"........kkEEDDDFEEEEEEEEEEaaaaaaaDaOOCCKOCCCDCk.........",
".......kDEDDDDDEEEEEEEEEEEEaaaaaDDaOCCCKOKCCCDBk........",
"......kDEDDDDDDEEEEEEEEECEEDDDDDDDDCCCCCACCCCCDDk.......",
".....kDEDDDDDDDEEEEEEEEEECEDDDBDDDDDCCCCACCCCCBBDk......",
"....kDEDDDDDDBDCEEEEEEEEECDDDDBDDDDDDCCACCCCCCBBBk......",
"....kDDDDDDDDBDDCEEEEEEEEECDDDBDDDDDDDCACCCCCCBBBBk.....",
"....kDDDDDDDDBDDDCCEEEEEEDCDDDBDDDDDDDACCCCCCCBBBBk.....",
"...kDDDDDDDDDBDDDDDCEEEEBBDDDDBhDDDDDDDCCCCACCBBBBBk....",
"...kDDDDDDDDDBDDDDDDCEBBDDDDDDBiDDDDDDDCCCCACCBBBBBk....",
"...kDDDDDDDDDBDDDDDDDBDDDDDDDDBDDDDDDDDCCCCCACBBBBBk....",
"...kDDDDCDDDDDBDDDDDDDDDDDDDDDBDDDDDDDDCCCCCACBBBBBk....",
"...kDDDDCDDDDDBDDDDDDDDDDDDDDDBDDDDDDDDCCCCCACBBBBBk....",
"...kDDDDCDDDDDBDDDDDDDDDDDDDDDBDDDDDDDDCCCCCACBBBBBBk...",
"...kDDDDDCDDDDBDDDDDDDDDDDDDDDBhDDDDDDDCCCCCCABBBBBBk...",
"...kDDDDDCDDDDBDDDDDDDDDDDDDDDBiDDDDDDDCCCCCCABBBBBBk...",
"...kDDDDDCDDDDBDDDDDDDDDDDDDDDBDDDDDDDDCCCCCCABBBBBBk..."];
var EYES={x:29,y:22,rows:[
"344443   443",
" IIII    II3",
" 44443    4"]};
var MOUTH={x:34,y:33,rows:[
"18  1",
"2111",
" 4g4"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('milka',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
