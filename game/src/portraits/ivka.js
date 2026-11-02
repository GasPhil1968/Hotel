/* ===== portraits/ivka.js — Ivka Perić (Geist, 85): schwarzes Kopftuch, langer schwarzer Mantel ===== */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"0":P.k0, "1":P.p0, "2":P.p1, "3":P.p2, "4":P.p3, "5":P.p4, "6":P.p5, "7":P.q2, "8":P.q1, "9":P.q3, K:P.k1, a:P.k1, b:P.k2, c:P.m0, d:P.m1, e:P.m2, f:P.m3, A:P.k0, B:P.k1, C:P.k2, D:P.h2, E:P.h3, F:P.s0, H:P.s1, g:P.s2, h:P.s3, j:P.s4, s:P.s1, w:P.s5, x:P.s4, i:P.w1, o:P.k0, L:P.l1};
//        1111111111222222222233333333334444444444555555
//1234567890123456789012345678901234567890123456789012345
var MAP=[
"........................................................", // 0
"........................................................", // 1
"........................................................", // 2
"........................................................", // 3
"........................................................", // 4
"........................dddccccc........................", // 5
"......................dddddccccccb......................", // 6
"....................ddddddccccccbbba....................", // 7
"...................dddddddccccccbbaaa...................", // 8
"..................dddddddcccccccbbaaaa..................", // 9
".................ddddddddccccccbbbaaaaa.................", // 10
".................dddddddccddeeeeeeeedda.................", // 11
"................dddddddccdeeeffffeeeddaa................", // 12
"................dddddddcccee44444444dcaa................", // 13
"...............dddddddcccde45666555544dca...............", // 14
"...............ddebddcccde4554444455544dc...............", // 15
"...............ddebdcccce45666655555544ccb..............", // 16
"...............ddebccccce555544444555444cb..............", // 17
"...............ddebcccce4566655555555444cb..............", // 18
"..............ddebccccce4gssssg555gssg44cb..............", // 19
"..............dcebccccce44433334543334g44b..............", // 20
"..............ccebccccce44311112541111344b..............", // 21
"..............ccebccccce441xLox354xLo1444b..............", // 22
"..............ccebccccce5444ii44544ii3444b..............", // 23
"..............ccebccccbe55443345564334454b..............", // 24
"..............ccebcccbbe56544445565444554b..............", // 25
".............ccccebbbbbe56665555556444554b..............", // 26
".............cbccebbbbbe45555555556543444b..............", // 27
".............cbcbebbbbae44544555545665433b..............", // 28
".............bbbbebbaaae44444555434233433b..............", // 29
".............bbbbebaaaade444455643443443ba..............", // 30
".............bbbaaebaaade45445643555443bb...............", // 31
".............baaaaebaaaade5545534444443bb...............", // 32
"............abaaaaaebaaade5545432222233bb...............", // 33
"............abaaaaaebaaaade545434554443bb...............", // 34
"............abaaaaaaebaaade554434334433bb...............", // 35
"...........aabaaaaaaebaaaade5445566543bb................", // 36
"...........abaadbaaaaaaaaaade445555443bb................", // 37
"...........abaaadbaaaaaaaaa.de3444443bb.................", // 38
"..........aabaaadbaaaaaaaaaa..cd3333bb..................", // 39
"..........aabaaaadbaaaaaaaaaabbcccbbba..................", // 40
"..........aaaaaaadbaaaaaaaa..bcddeddcCDDC...............", // 41
".........aaaaaaaaadbaaaaaaaCCbcdeeddBCDEDCB.............", // 42
"..........aaaaaaaaaddbaaaaCCCabcddccBCDDEDCBBB..........", // 43
"..........aaaaaaaaaaadbaaaCCCabcdBdcbACDDDCCBBBB........", // 44
"...........aaaaaaaaaaaaCCCCCabcdbBbdcbACCDCCBBBBB.......", // 45
"........DDDDDDDDDCCCCCCCCCCCabcbBBbcbBAACCBBBBBBBB......", // 46
"......DDDDDDDDDDDCCCCCCCCCCCabaBBBBbaBBBBBBBBBBABBB.....", // 47
".....EEDDDDDDDDDDCCCCCCCCCCCCBBBDABBBBBBBBBBBBBABBBB....", // 48
"....DDDEBCCCCCCCCCCCCCCCCCCCCCBBDABBBBBBBBBBBBBABBBBB...", // 49
"...DDDDEBCCCCCCCCCCCCCCCCCCCCBBBDABBBBBBBBBBBBBABBBBBB..", // 50
"..DDDDCCEBCCCCCCCCCCCCCCCCCCBBBBDABBBBBBBBBBBBABBBBBBB..", // 51
".DDDDCCCEBCCCCCCCCCCCCCCCCCBBBBBDABBBBBBBBBBBBABBBBBBBB.", // 52
".DDDCCCCEBCCCCCCCCCCCCCCCCBBBBBBDAdeBBBBBBBBBBABBBBBBBB.", // 53
".DDCCCCCCEBCCCCCCCCCCCCCCBBBBBBBDAcdBBBBBBBBBBABBBBBBBB.", // 54
"DDCCCCCCCEBCCCCCCCCCCCCCBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 55
"DCCCCCCCCEBCCCCCCCCCCCCBBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 56
"CCCCCCCCCEBCCCCCCCCCCCBBBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 57
"CCCCCCCCCEBCCCCCCCCCCBBBBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 58
"CCCCCCCCCCEBCCCCCCCCCBBBBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 59
"CCCCCCCCCCEBCCCCCCCCCBBBBBBBBBBBDAdeBBBBBBBBBBABBBBBBBBB", // 60
"CCCCCCCCCCEBCCCCCCCBBBBBBBBBBBBBDAcdBBBBBBBBBBABBBBBBBBB", // 61
"CCCCCCCCCCEBCCCCCCCBBBBBBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 62
"CCCCCCCCCCEBCCCCCBBBBBBBBBBBBBBBDABBBBBBBBBBBBABBBBBBBBB", // 63
];
var PATCH={"mouth":[],"eyes":[]};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue; if (ch==='.') { if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth||[]);
  if (v.eyes) put(b,PATCH.eyes||[]);
  M.outline(b,P.k1);
}
M.definePortrait('ivka',{ paint:paint });
})(M);
