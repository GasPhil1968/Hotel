/* ===== portraits/ljerka.js — Ljerka Lalić (56), Besitzerin des Hotel Palma; ljerkaNight: dieselbe Frau nachts
   Tag: hellgrauer Haarknoten, Halbrandbrille, Perlenohrstecker, Bluse mit Kragen unter khakifarbener Strickjacke.
   Nacht: dasselbe Gesicht (gemeinsamer Gesichtsblock), Haar offen bis zur Schulter, dunkelroter Morgenmantel mit
   Schalkragen über dem Nachthemd. Stolz, müde, verschlossen: strenge Brauen, schwere Lider, fester Mund.
   Legende: Ziffern Haut (p-Rampe) · w/W Augenweiß · i Iris · I Wimpern · * Glanz · z Z Brauen · l m L n Lippen ·
   a–g Haar (grau) · F Brille · + Glasglanz · p Perle · A–E Strickjacke bzw. Morgenmantel · X Knopf · R S U V Bluse/Nachthemd.
   Varianten: *_EYES (Lid zu) und *_MOUTH (Lippen geöffnet, 1 Pixel Zähne) werden über das Grundbild gelegt. */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, "k":P.k1, "w":P.s5, "W":P.s4, "i":P.e2, "I":P.h1, "*":P.s5, "z":P.s2, "Z":P.s1, "l":P.r3, "m":P.p2, "L":P.d4, "n":P.p1, "a":P.s0, "b":P.s1, "c":P.s2, "d":P.s3, "e":P.s4, "f":P.s5, "F":P.m1, "+":P.s6, "B":P.e1, "C":P.e2, "D":P.e3, "E":P.e4, "R":P.s3, "S":P.s4, "U":P.s5, "V":P.s6, "X":P.w1, "p":P.l0};
var LN={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, "k":P.k1, "w":P.s5, "W":P.s4, "i":P.e2, "I":P.h1, "*":P.s5, "z":P.s2, "Z":P.s1, "l":P.r3, "m":P.p2, "L":P.d4, "n":P.p1, "b":P.s1, "c":P.s2, "d":P.s3, "e":P.s4, "f":P.s5, "g":P.s6, "F":P.m1, "+":P.s6, "A":P.r0, "B":P.r1, "C":P.r2, "D":P.r3, "E":P.r4, "S":P.s4, "U":P.s5, "V":P.s6};
var DAY=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"..........................kkkkkk........................",
".......................kkkfffeddkkk.....................",
".....................kkfffffeedddcckk...................",
"...................kkefffffeedddddddck..................",
"............kkkk..keefffffeeeddddddddck.................",
"..........kkdeedkkeefffffeeeddeeeeedddck................",
".........kdefeddcceffffeeeeeeeeeeeeddccbk...............",
"........kdefedcccddffeeeeeeeeeeeeedddccbbk..............",
"........kefedccdeeceeeeeeeffe44554443cbbbk..............",
"........keedcdeedddcefffff4455555444433bbk..............",
"........kdedeeddccbcfffff445555554444333bk..............",
"........kddcdddddbbceeee44455554544443333k..............",
"........kcdcccccbbbbedd344445454444443333k..............",
"........kccdccbbbabfeee344444444444443333k..............",
".........kbccbbaaadeee3344444555544443333k..............",
"..........kkbbaaeedddd334444zzZZZZz54ZZz3k..............",
"............kkeddeeddd34444zz4443zZ4zz333k..............",
".............kedcd34433222FFFFFFFFFFFFFFFk..............",
".............kddcc454334444F321III2432II1k..............",
"..............kdcc433434444442Ww*I343WiI2k..............",
"..............kdcc4224344444463Wii3533ii3k..............",
"..............kccc4214344444+443334453W33k..............",
"..............kccc432434445554444444532233k.............",
"...............kcb443434455544333444453223k.............",
"...............kcb344334445544444444445542k.............",
"................kcb4433444444444444344432k..............",
"................kcb3433444444444443421222k..............",
".................kcbp33444444444434443432k..............",
"..................kc33344444444443mmlmm2k...............",
"..................kc3333444444442nnnnn23k...............",
"...................k33333444444443LLL423k...............",
"...................k33423344444444333423k...............",
"...................k33342234444444455423k...............",
"...................k3334232344444445433k................",
"...................k3333423223444444323k................",
"...................k333342333233444323k.................",
"...................k3333342333223332kk..................",
"...................k3333342333332kkk....................",
".................kk33VVVVV33333333kk....................",
"..............kkkEEEEUUUUUVV33333UUUk...................",
"...........kkkEEEEEEEUUUUUUUV3333SSSkk..................",
".........kkEEEEEEDDDDUUUUUUUUV33USSSSBkk................",
".......kkEEEEEDDDDDDDSUUUUUUUUV2SSSSUBCDkkk.............",
"......kEEEEDDDDDDDDDDDSUUUUUUSS2RRSSSBDCDDDkkk..........",
".....kEECDDDDDDDDDDDDDDSSUUUSSSSSSRRSBCCCCCDDDkk........",
"....kEEECDDDDDDDDDDDDDDDCSUSSSSUSSSSRUDCCCCCCCDDk.......",
"...kEEEECDDDDDDDDDDDDDDDDDSSSSUUSSSSSBCCCCCCCCCBDkk.....",
"...kEEEECDDDDDDCDDDDDDDDDDECBUUUSSSSSBDCCCCCCCBCCDDk....",
"..kCEEEEDCDDDDDCDDDDDDDDDDDDDCUUURSSSBCCCCBCCCBCCCCk....",
"..kCDDDDDCDDDDDCDDDDDDDDDDDDECDUUSSSBDDCCCBCCCBCCCCBk...",
"..kCDDDDDCDDDDDDCDDDDDDDDDDDDDCUUSSSBCDCCCBCCCBCCCCBBk..",
"..kCDDDDDCDDDDDDCDDDDDDDDDDDDEDCUSSSBDDCCBCCCCBCCCCBBk..",
"..kCDDDDDCDDDDDDCDDDDDDDDDDDDDDDCSSSBCDCCBCCCCBCCCCBBk..",
"..kCDDDDDCDDDDDDCDDDDDDDDDDDDDDEDCRSBDDCCBCCCCBCCCCBBk..",
"..kCDDDDDDCDDDDDDDDDDDDDDDDDDDDDDCSSBCDCCBCCCCBCCCCBBk..",
"..kCDDDDDDCDDDDDCDDDDDDDDDDCDDDDEDCSBDDCCCCCCCBCCCCBBk..",
".kCCDDDDDDCDDDDDCDDDDDDDDDDCDDDDDDSCBCDCCCCCCCBCCCCBBk..",
".kCCDDDDDDCDDDDDDCDDDDDDDDDDCDDDDDESBDDCCCCCCCBCCCCBBBk.",
".kCCDDDDDDCDDDDDDCDDDDDDDDDDCDDDDDDDDDDCCCCCCCBCCCCBBBk.",
".kCCDDDDDDCDDDDDDCDDDDDDDDDDCDDDDDDXBDDCCCCCCBCCCCCBBBk."];
var NIGHT=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"..........................kkkkkkk.......................",
"......................kkkkfffeeeekkkk...................",
"....................kkffffgggeeeeeeddkk.................",
"...................kfffgggfccceeeeeddddk................",
"..................kfffgbccceeeeeeeeddddck...............",
".................kffggcffffeeccceedddddcck..............",
"................kffgcfffffbcceeeeedddddccck.............",
"...............kfffbfffffceeeeeeeedddddccck.............",
"...............kffcffffcceeeefffffdddddccck.............",
"..............kfffcfffbeeeeffee5eefffddcccek............",
"..............kffcfffeceeee55555544443fcccek............",
".............keffbffeceeee45555454444333fcek............",
".............kefecfeece3e4445454444443333cek............",
".............kefecfecee344444444444443333cek............",
".............kefcefebe3344444555544443333cck............",
".............kefcefece334444zzZZZZz54ZZz3cck............",
".............kefbfeece34444zz4443zZ4zz333kk.............",
".............kefcfecee3222FFFFFFFFFFFFFFFk..............",
".............kefcfecee34444F321III2432II1k..............",
".............kefcfecee34444442Ww*I343WiI2k..............",
".............kefcfebdb344444463Wii3533ii3k..............",
".............kdfcfecdb344444+443334453W33k..............",
"............kddfbfdcdb34445554444444532233k.............",
"............kdfdcfcddb34455544333444453223k.............",
"............kdfdcdcddb34445544444444445542k.............",
"............kdfcddcddb3444444444444344432cck............",
"............kcccddbdcb3444444444443421222cck............",
"............kccbedcccb3444444444434443432cck............",
"............kccbeccccb344444444443mmlmm2bcck............",
"............kccbecbccbc3444444442nnnnn23cbcck...........",
"............kccbecbccbc33444444443LLL423cbcck...........",
"............kccbecbccbc33344444444333423cbcck...........",
"...........kcccbecbccbc33234444444455423cbcck...........",
"...........kcccbecbccbc3332344444445433ccbck............",
"...........kcccbecbccbc3333223444444323ccbck............",
"...........kcccbebcccbcc33333233444323ccbcck............",
"..........kccccbebcccbcc333333223332ccccbcck............",
"..........kcccbccbcccbc3333333332cccccccbcck............",
"..........kcccbccbcccbc33333333322ccccccbck.............",
"..........kcccbccbcccbAD3333333333cccccccck.............",
".........kcccccccbcccCCED333333333ccccccck..............",
".........kcccccccbEDCCCCDAVS22222SVSCBckk...............",
".......kkCCCcccBBBBEDCCCCDAVU2222VUVVCBCkkk.............",
"......kCCCCBCBBBBBBBEDCCCCDBUUUUUUUSUSCBBCCkkk..........",
".....kCCCCBBBBBBBBBBBEDCCCDABUUUUUUSSVCBBAACCCkk........",
"....kDCDCBBBBBBBBBBBBBEDCCCDABUUUUUSSSCBBAAAAACCk.......",
"...kDCDCBBBBBBBBBBBBBBBEDCCCDABUUUUSSSCBBAAAAAAACkk.....",
"...kCDCDBBBBBBBABBBBBBBEDCCCDABBUUUSSBCBBAAAAAAAACCk....",
"..kCDCDCBBBBBBBABBBBBBBBEDCCCDABUUUSSBCBBAAAAAAAAAAk....",
"..kDCDCDBBBBBBBABBBBBBBBBEDCCCDABUUSSBCBBAAAAAAAAAACk...",
"..kCCCBBBBBBBBBBBBBBBBBBBBEDCCCDBBUSSCBBBAAAAAAAAAAACk..",
"..kCCCBBBBBBBBBBABBBBBBBBBEDCCCDABUSSCBBBAAAAAAAAAAAAk..",
"..kCCCBBBBBBBBBBABBBBBBBBBBEDCCCDABBBCBBBAAAAAAAAAAAAk..",
"..kCCCBBBBBBBBBBABBBBBBBBBBBEDCCCDBBBCBBBAAAAAAAAAAAAk..",
"..kBBBBBBBBBBBBBBBBBBBBBBBBBEDCCCDABBCBBBAAAAAAAAAAAAk..",
"..kBBBBBBBBBBBBBBABBBBBBBBBBBEDCCCDBBCBBBAAAAAAAAAAAAk..",
".kCBBBBBBBBBBBBBBABBBBBBBBBBBBEDCCCDCBBBBAAAAAAAAAAAAk..",
".kCBBBBBBBBBBBBBBABBBBBBBBBBBBEDCCCDBCBBBAAAAAAAAAAAACk.",
".kBBBBBBBBBBBBBBBBBBBBBBBBBBBBBEDCCCDCBBBAAAAAAAAAAAAAk.",
".kBBBBBBBBBBBBBBBBABBBBBBBBBBBBEDCCCACBBBAAAAAAAAAAAAAk."];
var DAY_EYES={x:29,y:22,rows:[
"344443  3443",
"34444   3333",
" 21112  2112"]};
var DAY_MOUTH={x:33,y:33,rows:[
"  w   ",
" 2nn23",
"3LLL 3",
" 333 3",
"   54 "]};
var NIGHT_EYES={x:29,y:22,rows:[
"344443  3443",
"34444   3333",
" 21112  2112"]};
var NIGHT_MOUTH={x:33,y:33,rows:[
"  w   ",
" 2nn23",
"3LLL 3",
" 333 3",
"   54 "]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('ljerka',{ paint:function(b,v){
  put(b,L,DAY,0,0);
  if (v.mouth){ patch(b,L,DAY_MOUTH); }
  if (v.eyes){ patch(b,L,DAY_EYES); }
} });
M.definePortrait('ljerkaNight',{ paint:function(b,v){
  put(b,LN,NIGHT,0,0);
  if (v.mouth){ patch(b,LN,NIGHT_MOUTH); }
  if (v.eyes){ patch(b,LN,NIGHT_EYES); }
} });
})(M);
