/* ===== portraits/ljerka.js — Ljerka Lalić (56), Besitzerin des Hotel Palma; ljerkaNight: dieselbe Frau nachts */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"0":P.p0, "1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, "k":P.k1, "K":P.k0, "x":P.k2, "w":P.s5, "W":P.s4, "i":P.e2, "I":P.h1, "*":P.s5, "z":P.s2, "Z":P.s1, "l":P.d3, "L":P.p3, "n":P.p1, "a":P.m1, "b":P.m2, "c":P.e3, "d":P.s3, "e":P.s4, "f":P.s5, "g":P.s6, "F":P.m1, "G":P.m3, "+":P.l1, "A":P.e0, "B":P.e1, "C":P.e2, "D":P.e3, "E":P.e4, "R":P.s3, "S":P.s4, "U":P.s5, "V":P.s6, "X":P.w1, "p":P.l0, "q":P.s3};
var DAY=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"..........................kkkkkk........................",
".......................kkkggffedkkk.....................",
".....................kkgggggfeedddckk...................",
"...................kkfgggggffeedddddck..................",
"............kkk...kffgggggffeeeeeeeddck.................",
"..........kkfedkkkffgggggfeeeeeeeeeeddbk................",
".........kggggfdcffggggffeeeeffffeeedccbk...............",
"........kgggggfecbgggffffffffkkffeeddcbbbk..............",
"........kggfeeeecbgffffffffkk44554444bbbbk..............",
".......kffedddddbbbffggggk4455555444443bbk..............",
".......kcefedddcbbbgggggk445555554444443bk..............",
"........kdedcbbbbbbefffe44455554544444433k..............",
"........kbddbbbbbbffeee344445454444444433k..............",
".........kbbbbbbbbfgffe344444444444444433k..............",
"..........kbbbbbfeeeff3344444444444444433k..............",
"...........kkkedffedde3344445555444444443k..............",
".............keddfeddd344444zZZZZZz54ZZzz3k.............",
".............kedde344334444z44443zZ4zz3333k.............",
".............kedcd4543344444321III2432II1k..............",
"..............kdcc433434444442Ww*I343WiI2k..............",
"..............kdcb4224344444443Wii3533ii3k..............",
"..............kccb421434444444433344533333k.............",
"..............kbcb432434445554444444532333k.............",
"...............kbb443434455544333444453233k.............",
"...............kbb344334445544444444445542k.............",
"................kbb4433444444444444344333k..............",
"................kbb3433444444444443421223k..............",
".................kbbp33444444444434443433k..............",
"..................kb33344444444443lllll3k...............",
"..................kb33234444444442nnnn23k...............",
"...................k332234444444433LLL33k...............",
"...................k33322344444444433343k...............",
"...................k33332234444444455433k...............",
"...................k3333322344444445443k................",
"...................k3333332223444444433k................",
"...................k333333322233444333k.................",
"...................k3333333332223332kk..................",
"...................k3333333333222kkk....................",
".................kk3VVVEEEEEEEEEEEk.....................",
"..............kkkEEEVVVVEEEEEEEEEESkk...................",
"...........kkkEEEEEEUUUUUUUUUUDDDDSSSkk.................",
".........kkEEEEEEDDDUUUUUUUUUUUUUUSSSSSk................",
".......kkEEEEEDDDDDDDDUUUUUUUUUUUUUSSSSDkkk.............",
"......kEEEEDDDDDDDDDDDSSUUUUUUUUUUUSSSSEDDDkkk..........",
".....kEECDDDDDDDDDDDDDDESSSUUUUUUUUSSRRECCCDDDkk........",
"....kDDDCDDDDDDDDDDDDDDDECDSSSUUUUUSSSDRRCCCCCDDk.......",
"...kDDDDCDDDDDDDDDDDDDDDDECDDUSSUUUSSSEDCCCCCCCBDkk.....",
"...kDDDDCDDDDDDDDDDDDDDDDDECDUUUUUUSSSEDCCCCCCCBCDDk....",
"..kCDDDDDCDDDDDDDDDDDDDDDDDECDUUUUUSSSEDCCCCCCCBCCBk....",
"..kCDDDDDCDDDDDDDDDDDDDDDDDDECDUUUUSSDEDCCCCCCCBCCBDk...",
"..kCDDDDDCDDDDDDDDDDDDDDDDDDECDUUUUSSEDDCCCCCCCBCCBBDk..",
"..kCDDDDDCDDDDDDDDDDDDDDDDDDDECDUUUSSEDDCCCCCCCBCCBBBk..",
"..kCDDDDDCDDDDDDDDDDDDDDDDDDDDECDUUSSEDDCCCCCCBCCCBBBk..",
"..kCDDDDDCDDDDDDDDDDDDDDDDDDDDDECUUSSEDDCCCCCCBCCCBBBk..",
"..kCDDDDDDCDDDDDDDDDDDDDDDDDDDDDECUSDEDDCCCCCCBCCCBBBk..",
"..kCDDDDDDCDDDDDDDDDDDDDDDDDDDDDDECSEDDDCCCCCCBCCCBBBk..",
".kCCDDDDDDCDDDDDDDDDDDDDDDDDDDDDDECSEDDDCCCCCCBCCCBBBk..",
".kCCDDDDDDCDDDDDDDDDDDDDDDDDDDDDDDECEDDDCCCCCCBCCCBBBDk.",
".kCCDDDDDDCDDDDDDDDDDDDDDDDDDDDDDDDECDDDCCCCCCBCCCBBBBk.",
".kCCDDDDDDDCDDDDDDDDDDDDDDDDDDDDDDDDDDDDCCCCCCBCCCBBBBk."];
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('ljerka',{ paint:function(b,v){
  put(b,L,DAY,0,0);
} });
M.definePortrait('ljerkaNight',{ paint:function(b,v){
  put(b,L,DAY,0,0);
} });
})(M);
