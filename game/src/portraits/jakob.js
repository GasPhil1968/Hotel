/* ===== portraits/jakob.js — Jakob Kabiljo (71), Antiquar
   Schmal, Glatze mit weißem Haarkranz, gepflegter kurzer weißer Bart, dicke Brille mit schwerer dunkler Fassung,
   graue Strickjacke über weißem Hemd mit weinroter Fliege, Lupe an einer Schnur; ironisch (ferne Braue gehoben).
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 6 Haut · s q a b 7 c d e f h Haarkranz, Bart, Brauen, Hemd und Strickjacke (Grau/Weiß) ·
   g Iris · I x i 9 8 Brille und Pupille · y j l Lippen · p m n o Fliege · t u w v r Lupe und Schnur · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, "7":P.m4, "8":P.n5, "9":P.n4, "a":P.m2, "b":P.m3, "c":P.s3, "d":P.s4, "e":P.s5, "f":P.s6, "g":P.c2, "h":P.l1, "I":P.h1, "i":P.h3, "j":P.d4, "k":P.k1, "l":P.d5, "m":P.r1, "n":P.r2, "o":P.r3, "p":P.r0, "q":P.m1, "r":P.k2, "s":P.m0, "t":P.y1, "u":P.y3, "v":P.n3, "w":P.n2, "x":P.h2, "y":P.d3};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"........................kkkkkkkkkk......................",
"......................kk5554444433kk....................",
".....................k55555544444333kk..................",
"....................k56655554444433322k.................",
"...................k6666555544444433322k................",
"..................k666665555444444333222k...............",
".................k5666655554444443333222k...............",
".................k56665555544444433332222k..............",
"................k555555555444444433332222k..............",
"...............k77e55555544444443333322222k.............",
"...............k77ee4444444444443333222222k.............",
"...............k77eee443444333333333222222k.............",
"..............kbbee7fee344444433333322dee2k.............",
"..............kb777be777e444333333322de22dk.............",
"..............kb777be777eb444d3e33222c2222k.............",
"..............k77e77e777e444deeeeed2222222k.............",
"..............k7777ee7fe3432c222cdd2222222k.............",
"..............k7777e445e333IIIIIIIII2IIIIIk.............",
"..............kbb77455IIIIII83IIII2III9IIk..............",
"...............kb7745324e33I93fggI2I2IfgIk..............",
"...............kb7745214733I323gg32I2Igg22k.............",
"...............kb7745314733Ihf22222I2Ih222k.............",
"...............ka7745437e22IiiiiiiiI2Iiiii2k............",
"................k777443ee2222222244333222542k...........",
"................kbbb33eee2222244443333332223k...........",
".................kbb27eee223333443333222123k............",
".................kbbbeeeee33333343feee7e77k.............",
"..................kkk27777733333337bb7bb7bk.............",
"....................k277777433333b21111112k.............",
".....................k77777e43333322jlj322k.............",
".....................k27777ee7333e22222eek..............",
".....................k22b77ee7efeeeeffeeeek.............",
".....................k22b77fe7ef7eefffeeeek.............",
".....................k222bbee7beb77e7e7777k.............",
"....................k22222b777b777b777777k..............",
"....................k222222777777bb777bbk...............",
"....................k332222227b7e7bb7bbk................",
"....................k3333333333b7babakk.................",
"....................k333fd3233333kckk...................",
"....................k3ffffdd3333eeeck...................",
"..............kkkkkkb3ffffmnndnnmeeckkkk................",
"...........kkk77aaab7bbfffmonpnomeeaaaaakkk.............",
".......kkkk777bbaaab7bbfffmnnennmeeaaqaaaqqkkk..........",
".....kk7777bbbbbaaaab7bbeeemeeemdddraqaaaqqqqbkk........",
"...kk77bbbbbbbbbaaaab7bbeeeeeeddddaaraaaaqqqqqbbkk......",
"..k77bbbbbbabbbbaaqaab7bbeeeeeddddaaraaqaqqqqqsqbbk.....",
"..kbabbbbbbabbbbaaqaab7bbqeeeeddddaaqraqaqqqqqsqqqak....",
".kaaqaaaaaaqaaaaaaqaaab7bbeeeedddaaqaraqaqqqqqsqqqqak...",
"kaaaqaaaaaaqaaaaaaqaaaa7bbbeeedddaaqaarqaqqqqqsqqqqak...",
"kaaaqaaaaaaqaaaaaaqaaaab7bbaeedddaaqaartaqqqqqsqqqqqak..",
"kaaaqaaaaaaqaaaaaaqaaaaa7bbbeeddaaqaatuvttqqqqsqqqqqqk..",
"aaaaqaaaaaaqaaaaaaqaaaaab7bbaeddaaqaau8hvtqqqssqqqqqqk..",
"aaaaqaaaaaaqaaaaaaqaaaaaa7bbbeddaaaatv9vvvtqqssqqqqqqsk.",
"aaaaqqaaaaaqqaaaaaqaaaaaabbbbedaaaaaatvvvwqqqqsqqqqqqsk.",
"aaaaqqaaaaaqqaaaaaqaaaaaaqbbbaaaaaaaattvwtqqqqsqqqqqqsk.",
"aaaaqqaaaaaqqaaaaaqaaaaaaqbbbaaaaaaaaaataqqqqqsqqqqqqsk.",
"aaaaqaqaaaaqqaaaaaqaaaaaaqbbbaasaaaaaaaqaqqqqqsqqqqqqsqk",
"aaaaqaqaaaaqqaaaaaqaaaaaaqabbbaqaaaaaaaqaqqqqqssqqqqqsqk",
"aaaaqaqaaaaqqaaaaaqaaaaaaqabbbaaaaaaaaaqaqqqqqssqqqqqsqk",
"aaaaqaqaaaaqqaaaaaqaaaaaaqabbbaaaaaaaaaqaqqqqqssqqqqqsqk"];
var EYES={x:29,y:22,rows:[
" 34443    43",
"2III     2I",
" 4444    44"]};
var MOUTH={x:34,y:32,rows:[
"bxxedxx",
" mmmmm",
"  yyyd"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('jakob',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
