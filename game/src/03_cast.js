/* ===== 03_cast.js — die Besetzung: Köpfe (Seite/vorn/hinten), Kleidung, Farben, eigene Animationen =====
   Legende der Kopf-Stempel: k Umriss · H h j Haar dunkel/mittel/hell · S s t Haut hell/mittel/Schatten · e Auge · m Mund
   b Bart · c C Mütze/Tuch · g Brille · w Weiß · r Akzent */
(function(M){
'use strict';
var P=M.P, A=M.ANIMS, S=M.poseS, F=M.poseF;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
var HS=M.headSet;

// ---------------------------------------------------------------- MARKO VUKOVIĆ (33): kurzes dunkles Haar, Bartschatten, dunkler Wollmantel
var mkS=[
"....kkkk....",
"...kHHhHkk..",
"..kHHHHHHHk.",
"..kHHHhHHHHk",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..kbtSSSSmk.",
"..kbbtSSSk..",
"...kbbbbk...",
"....kttk....",
"....ktsk...."];
var mkF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".kbSSmSSbk.",
".kbbSSSbbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var mkB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kHHHHHHHk.",
"..kHHHHHk..",
"...kHHHk...",
"...ktttk...",
"...kssk...."];
M.defineChar('marko',{
  legend:L({H:P.h1,h:P.h2,j:P.h3,S:P.q3,s:P.q2,t:P.q1,m:P.q0,b:P.q1}),
  heads:{S:HS(mkS),F:HS(mkF),B:{n:mkB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.c1,P.c2,P.c0],collar:[P.m3,P.m2],buttons:P.c0,lapel:P.c2,side:8},
  coat:{c:[P.c1,P.c2,P.c0],hem:9,w:6},
  cols:{trou:[P.k2,P.c0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.c1,P.c2,P.c0],sleeveF:[P.c0,P.c1,P.k1],hand:[P.q3,P.q2],handF:[P.q2,P.q1],shoe:P.w1}
});

// ---------------------------------------------------------------- MALA: dunkler Zopf, Jeansjacke, grauer Schal, helle Turnschuhe
var maS=[
"....kkkk....",
"...kHHhHk...",
"..kHHHHHHk..",
"..kHHHhHHHk.",
".kHHHHHSSHk.",
".kHHHHSShSk.",
".kHHsSSSeSk.",
".kHHSSSSSSSk",
".kHHsSSSSSk.",
".kHHksSSmk..",
".kHk.ksSk...",
".kHk..kk....",
".kHk.kttk...",
".kHk.ktsk...",
".kjk........",
"..kk........"];
var maF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHSSSSSHHk",
"kHShSSShSHk",
"kHSeSSSeSHk",
"kHSSSSSSSHk",
"kHHSSSSSHHk",
"kHHsSmSsHHk",
"kHHHsSsHHHk",
".kHHkkkHHk.",
"..kktttkk..",
"...kssk...."];
var maB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHjHHHHk",
"kHHHHHHHHHk",
"kHHHHjHHHHk",
"kHHHHHHHHHk",
".kHHHhHHHk.",
"..kkHHHkk..",
"...kHHHk...",
"...ktHtk...",
"...kHjk....",
"....kHk....",
"....kjk....",
".....k....."];
M.defineChar('mala',{
  legend:L({H:P.h2,h:P.h3,j:P.w1,S:P.p4,s:P.p3,t:P.p2,m:P.q3,e:P.n1}),
  heads:{S:HS(maS),F:HS(maF),B:{n:maB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.c2,P.c3,P.c1],scarf:[P.m3,P.m4,P.m2],buttons:P.y2,side:7},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.c2,P.c3,P.c1],sleeveF:[P.c1,P.c2,P.c0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s5}
});

// ---------------------------------------------------------------- ZDENKA BAŠIĆ (78): graues Haar im Knoten, ganz in Schwarz
var zdS=[
"............",
"....kkkk....",
"...kjjhjk...",
"..kjhhhhjk..",
"..khhhhSSk..",
".kjhhSSSSk..",
".khhtSSeSk..",
".khtSSSSSSk.",
"..ktSSSSSk..",
"..ktSSSmk...",
"...ktSSk....",
"....kkk.....",
"....ktsk....",
"....ktsk...."];
var zdF=[
"...........",
"....kkk....",
"...kjjjk...",
"..kjhhhjk..",
".khhSSShhk.",
"khSSSSSSShk",
"khSeSSSeShk",
"ktSSStSSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var zdB=[
"....kkk....",
"...kjhjk...",
"...kjjjk...",
"..kjhhhjk..",
".khhhhhhhk.",
"khhhjhhhhhk",
"khhhhhhhhhk",
"kthhhhhhhtk",
".khhhhhhhk.",
".khhhhhhhk.",
"..khhhhhk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
M.defineChar('zdenka',{
  legend:L({H:P.m3,h:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(zdS),F:HS(zdF),B:{n:zdB}},
  torso:{w:12,len:12,col:[P.k2,P.m0,P.k1],side:8,hunch:1},
  skirt:{c:[P.k2,P.m0,P.k1],hem:15,flare:2},
  bones:[10,9,7,6], hipY:22,
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.k2,P.m0,P.k1],sleeveF:[P.k1,P.k2,P.k0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  anims:{ sit:[[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[7,-15],fh:[5,-15],sit:1}),1500],[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[7,-15],fh:[5,-15],sit:1,hd:'b'}),110],[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-16],fh:[5,-15],sit:1}),1400]],
          sitTalk:[[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[7,-15],fh:[5,-15],sit:1,hd:'o'}),140],[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[9,-22],fh:[5,-15],sit:1}),140],[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[9,-21],fh:[5,-15],sit:1,hd:'o'}),140],[S({h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],nh:[7,-15],fh:[5,-15],sit:1}),150]] }
});

// ---------------------------------------------------------------- IVKA PERIĆ (Geist, 85): schwarzes Kopftuch, langer schwarzer Mantel, gebeugt
var ivS=[
"....kkkk....",
"...kccccck..",
"..kccCccccck",
"..kcccccSSk.",
".kcccccSSSk.",
".kccctSSSSk.",
".kcctSSSeSk.",
".kcctSSSSSSk",
"..kctSSSSSk.",
"..kcctSSmk..",
"...kcctSk...",
"....kcck....",
"....ktsk....",
"....ktsk...."];
var ivF=[
"...kkkkk...",
"..kcccccck.",
".kcccCccccck",
"kccSSSSScck",
"kcSSSSSSSck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kctSSStSStck",
".kctSSSStck",
".kcctSmStcck",
"..kcctttcck",
"...kcccck..",
"...ktttk...",
"...kssk...."];
var ivB=[
"...kkkkk...",
"..kcccccck.",
".kcccCcccck",
"kccccccccck",
"kccccccccck",
"kcccCcccccck",
"kccccccccck",
"kccccccccck",
".kcccccccck",
".kccccccccck",
"..kccccccck",
"...kcccck..",
"...ktttk...",
"...kssk...."];
M.defineChar('ivka',{
  legend:L({c:P.k2,C:P.m1,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(ivS),F:HS(ivF),B:{n:ivB}},
  torso:{w:12,len:12,col:[P.k2,P.m1,P.k1],buttons:P.m2,side:8,hunch:1},
  skirt:{c:[P.k2,P.m1,P.k1],hem:16,flare:3},
  bones:[10,9,7,6], hipY:21,
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.k2,P.m1,P.k1],sleeveF:[P.k1,P.k2,P.k0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  anims:{ waitF:[[F({lh:[-2,-18],rh:[2,-18],ho:[0,1]}),1600],[F({lh:[-2,-18],rh:[2,-18],ho:[0,1],hd:'b'}),110],[F({lh:[-2,-18],rh:[2,-18]}),1200]],
          gloveF:[[F({lh:[-2,-18],rh:[2,-18]}),400],[F({lh:[-1,-22],rh:[2,-20],hd:'b'}),700],[F({lh:[-2,-18],rh:[2,-18]}),700]] }
});

// ---------------------------------------------------------------- MLADEN ŠIMIĆ (63): Halbglatze, Schnurrbart, Brille, Weste
var mlS=[
"............",
"....kkkk....",
"...kSSSSkk..",
"..kjSSSSSSk.",
".kjjSSSSSSk.",
".kjSSSSSSSk.",
".kjtSSggggk.",
".kjtSSSSSSSk",
"..ktSSSSSSk.",
"..ktSbbbbk..",
"...ktSSmk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var mlF=[
"...........",
"...kkkkk...",
"..kSSSSSk..",
".kjSSSSSjk.",
"kjjSSSSSjjk",
"kjSSSSSSSjk",
"kjggggggSjk",
"ktSSStSSStk",
".kSSSSSSSk.",
".ktbbbbbtk.",
"..ktSmStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
M.defineChar('mladen',{
  legend:L({j:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.m3,g:P.m2}),
  heads:{S:HS(mlS,'t'),F:HS(mlF,'t'),B:{n:mlF}},
  torso:{w:12,len:13,col:[P.n1,P.n2,P.n0],vneck:P.s5,side:8,belly:1},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2}
});

// ---------------------------------------------------------------- DINKO MATIĆ (46): Wollmütze, grauer Bart, grüner Pullover, Ölzeughose
var diS=[
"....kkkk....",
"...kCcccck..",
"..kccccccck.",
"..kCCCCCCCk.",
".kHHHtSSSSk.",
".kHHtSSSSSk.",
".kHtSSSSeSk.",
".kHtSSSSSSSk",
"..kbSSSSSSk.",
"..kbbbSbbk..",
"..kbbbbbk...",
"...kbbbk....",
"....ktsk....",
"....ktsk...."];
var diF=[
"...kkkkk...",
"..kCccccCk.",
".kccccccccck",
"kCCCCCCCCCk",
"kHtSSSSStHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kbSSSSSbk.",
".kbbbmbbbk.",
".kbbbbbbbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var diB=[
"...kkkkk...",
"..kCccccCk.",
".kccccccccck",
"kCCCCCCCCCk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kbHHHHHbk.",
"..kbbbbbk..",
"...kbbbk...",
"...ktttk...",
"...kssk...."];
M.defineChar('dinko',{
  legend:L({c:P.n1,C:P.n2,H:P.m2,S:P.q3,s:P.q2,t:P.q1,m:P.q0,b:P.m3}),
  heads:{S:HS(diS),F:HS(diF),B:{n:diB}},
  torso:{w:13,len:13,col:[P.g1,P.g2,P.g0],stripe:P.g0,side:9},
  shoulder:6,
  cols:{trou:[P.y2,P.y3,P.y1],trouF:[P.y1,P.y2,P.y0],sleeve:[P.g1,P.g2,P.g0],sleeveF:[P.g0,P.g1,P.k1],hand:[P.q3,P.q2],handF:[P.q2,P.q1],shoe:P.k2},
  anims:{ mend:[[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[9,-17],fh:[7,-15],sit:1,ln:2,it:'needle'}),500],[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[11,-19],fh:[7,-15],sit:1,ln:2,it:'needle'}),400],[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[9,-16],fh:[7,-15],sit:1,ln:2,it:'needle',hd:'b'}),300],[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[10,-18],fh:[7,-16],sit:1,ln:2,it:'needle'}),600]],
          sitTalk:[[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-16],fh:[7,-15],sit:1,ln:1,hd:'o'}),150],[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-16],fh:[7,-15],sit:1,ln:1}),150]],
          sit:[[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-15],fh:[7,-14],sit:1,ln:2}),1600],[S({h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-15],fh:[7,-14],sit:1,ln:2,hd:'b'}),110]] }
});

// ---------------------------------------------------------------- SANJA LOZIĆ (32): kurzes schwarzes Haar, schwarzes Shirt, Schürze
var saS=[
"....kkkk....",
"...kHHHHkk..",
"..kHHHhHHHk.",
"..kHHHHHHHHk",
".kHHHHHSSHk.",
".kHHHSSSSSk.",
".kHHtSSSeSk.",
".kHtSSSSSSSk",
"..ktSSSSSSk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var saF=[
"...kkkkk...",
"..kHHHHHk..",
".kHHHhHHHHk",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHSSSSSSSk.",
"kHSeSSSeSk.",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var saB=mkB.map(function(r){ return r; });
M.defineChar('sanja',{
  legend:L({H:P.h0,h:P.h1,S:P.p4,s:P.p3,t:P.p2,m:P.r2}),
  heads:{S:HS(saS),F:HS(saF),B:{n:saB}}, legendB:true,
  torso:{w:10,len:12,col:[P.k2,P.m0,P.k1],apron:[P.r1,P.r2],side:7},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.c0,P.c1,P.k1],trouF:[P.k1,P.c0,P.k0],sleeve:[P.k2,P.m0,P.k1],sleeveF:[P.k1,P.k2,P.k0],arm:[P.p4,P.p5,P.p3],armF:[P.p3,P.p4,P.p2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  anims:{ polish:[[F({lh:[-2,-24],rh:[2,-24],it:null}),600],[F({lh:[-1,-25],rh:[3,-23]}),400],[F({lh:[-3,-23],rh:[1,-25],hd:'b'}),400],[F({lh:[-2,-24],rh:[2,-24]}),800]] }
});

// ---------------------------------------------------------------- STIPE & FRANE (Kartenspieler, 70+): Schiebermütze / Glatze mit weißem Kranz
var stS=[
"............",
"...kkkkk....",
"..kCCCCCkk..",
".kCCCCCCCCCk",
".kjjSSSSSSk.",
".kjSSSSSSSk.",
".kjtSSSSeSk.",
".kjtSSSSSSSk",
"..ktSSSSSSk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
M.defineChar('stipe',{
  legend:L({C:P.e2,j:P.m3,S:P.q4,s:P.q3,t:P.q2,m:P.q1}),
  heads:{S:HS(stS),F:HS(stS),B:{n:stS}},
  torso:{w:12,len:13,col:[P.w2,P.w3,P.w1],collar:[P.s5,P.s4],side:8},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.w2,P.w3,P.w1],sleeveF:[P.w1,P.w2,P.w0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  anims:{ cards:[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[6,-19],sit:1}),1400],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[12,-21],fh:[6,-19],sit:1}),220],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[6,-19],sit:1,hd:'b'}),1200]] }
});
var frS=[
"............",
"............",
"....kkkk....",
"...kSSSSkk..",
"..kSSSSSSSk.",
".kwwSSSSSSk.",
".kwtSSSSeSk.",
".kwtSSSSSSSk",
"..ktSSSSSSk.",
"..ktwwwwmk..",
"...ktwwwk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
M.defineChar('frane',{
  legend:L({S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(frS),F:HS(frS),B:{n:frS}},
  torso:{w:12,len:13,col:[P.m1,P.m2,P.m0],collar:[P.s5,P.s4],side:8,belly:1},
  cols:{trou:[P.e1,P.e2,P.e0],trouF:[P.e0,P.e1,P.k1],sleeve:[P.m1,P.m2,P.m0],sleeveF:[P.m0,P.m1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  anims:{ cards:[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[6,-19],sit:1}),900],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[6,-19],sit:1,hd:'b'}),110],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[11,-22],fh:[6,-19],sit:1}),260],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[6,-19],sit:1}),1600]] }
});

// ---------------------------------------------------------------- NINA BARIĆ (31): kastanienbraunes Haar, rotes Tuch, Senfpullover, Jeansschürze
var niS=[
"....kkkk....",
"...krrrrkk..",
"..krrrrrrrk.",
"..kHHHHHHHHk",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHHSSSSSSSk",
".kHHtSSSSSk.",
".kHHktSSmk..",
".kHHk.tSk...",
"..kk..kk....",
"....ktsk....",
"....ktsk...."];
var niF=[
"...kkkkk...",
"..krrrrrk..",
".krrrrrrrrk",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSSStSSHk",
"kHkSSSSSkHk",
"kHktSmStkHk",
".kk.tSt.kk.",
"....kkk....",
"...ktttk...",
"...kssk...."];
var niB=[
"...kkkkk...",
"..krrrrrk..",
".krrrrrrrrk",
"kHHHHHHHHHk",
"kHHHHhHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHhHk",
".kHHHHHHHk.",
"..kkkkkkk..",
"...ktttk...",
"...ktttk...",
"...kssk...."];
M.defineChar('nina',{
  legend:L({H:P.t1,h:P.t2,r:P.r3,S:P.p4,s:P.p3,t:P.p2,m:P.r2}),
  heads:{S:HS(niS),F:HS(niF),B:{n:niB}},
  torso:{w:10,len:12,col:[P.y2,P.y3,P.y1],apron:[P.c2,P.c3],side:7},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.y2,P.y3,P.y1],sleeveF:[P.y1,P.y2,P.y0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  anims:{ work:[[F({lh:[-3,-22],rh:[3,-23]},'B'),700],[F({lh:[-2,-23],rh:[4,-22]},'B'),500],[F({lh:[-3,-22],rh:[3,-23]},'B'),900]] }
});

// ---------------------------------------------------------------- MIRA (61, Kiosk): weinrote Locken, Brille, lila Strickjacke
var miF=[
"..kkkkkkk..",
".krrRrrRrrk",
"krRrrrrrRrk",
"krrrRrrrrrk",
"krrSSSSSrrk",
"krSSSSSSSrk",
"krggSSSggrk",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var miS=[
"...kkkkkk...",
"..krrRrrrkk.",
".krRrrrrRrrk",
".krrrrrrSSrk",
"krRrrrSSSSSk",
"krrrrSSSSSSk",
"krrrtSggggSk",
"krrtSSSSSSSSk",
".krtSSSSSSk.",
".krktSSSmk..",
"..kk.ktSk...",
".....kkk....",
"....ktsk....",
"....ktsk...."];
M.defineChar('mira',{
  legend:L({r:P.r2,R:P.r3,S:P.p4,s:P.p3,t:P.p2,m:P.p1,g:P.m3}),
  heads:{S:HS(miS),F:HS(miF),B:{n:miF}},
  torso:{w:12,len:12,col:[P.v2,P.v3,P.v1],vneck:P.p3,side:8},
  cols:{sleeve:[P.v2,P.v3,P.v1],sleeveF:[P.v1,P.v2,P.v0],hand:[P.p4,P.p3],handF:[P.p3,P.p2]}
});

// ---------------------------------------------------------------- LJERKA LALIĆ (56): hellgrauer Knoten, Brille, Strickjacke
var ljS=[
"....kkkk....",
"...kjjjjk...",
"..kjhjjjjk..",
"..kjjjjjSSk.",
".kjjjjSSSSk.",
".kjjjSSSSSk.",
".kjjtSgggSk.",
".kjtSSSSSSSk",
"..ktSSSSSSk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var ljF=[
"....kkk....",
"...kjjjk...",
"..kjjhjjk..",
".kjjjjjjjk.",
"kjjSSSSSjjk",
"kjSSSSSSSjk",
"kjgggSgggjk",
"ktSSStSSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ljB=zdB;
M.defineChar('ljerka',{
  legend:L({j:P.e4,h:P.s4,H:P.e3,S:P.p4,s:P.p3,t:P.p2,m:P.r2,g:P.m2}),
  heads:{S:HS(ljS),F:HS(ljF),B:{n:ljB}},
  torso:{w:12,len:12,col:[P.e3,P.e4,P.e2],vneck:P.s6,buttons:P.e1,side:8},
  skirt:{c:[P.c0,P.c1,P.k1],hem:13,flare:1},
  bones:[10,10,7,7], hipY:22,
  cols:{trou:[P.p3,P.p4,P.p2],trouF:[P.p2,P.p3,P.p1],sleeve:[P.e3,P.e4,P.e2],sleeveF:[P.e2,P.e3,P.e1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2}
});
// Ljerka im Morgenmantel (Nacht)
M.defineChar('ljerkaNight',{
  legend:L({j:P.e4,h:P.s4,H:P.e3,S:P.p4,s:P.p3,t:P.p2,m:P.r2,g:P.m2}),
  heads:{S:HS(ljS),F:HS(ljF),B:{n:ljB}},
  torso:{w:12,len:12,col:[P.r1,P.r2,P.r0],side:8,belt:P.r3},
  skirt:{c:[P.r1,P.r2,P.r0],hem:18,flare:2},
  bones:[10,10,7,7], hipY:22,
  cols:{trou:[P.p3,P.p4,P.p2],trouF:[P.p2,P.p3,P.p1],sleeve:[P.r1,P.r2,P.r0],sleeveF:[P.r0,P.r1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s4}
});

// ---------------------------------------------------------------- LUKA RADIĆ (Geist, 20): strubbeliges Haar, offenes Flanellhemd, weißes T-Shirt
var luS=[
"...k.kkk....",
"..kHkHHHkk..",
"..kHHHhHHHk.",
".kHHHHHHHHHk",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var luF=[
"..kk.kkkk..",
".kHHkHHHHk.",
"kHHHHhHHHHk",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var luB=[
"..kk.kkkk..",
".kHHkHHHHk.",
"kHHHHhHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kHHHHHHHk.",
"..kHHHHHk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
M.defineChar('luka',{
  legend:L({H:P.h2,h:P.h3,S:P.q3,s:P.q2,t:P.q1,m:P.q0}),
  heads:{S:HS(luS),F:HS(luF),B:{n:luB}},
  torso:{w:12,len:13,col:[P.r2,P.r3,P.r1],open:P.s5,side:8},
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.r2,P.r3,P.r1],sleeveF:[P.r1,P.r2,P.r0],hand:[P.q3,P.q2],handF:[P.q2,P.q1],shoe:P.s4},
  anims:{ guitarSit:[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-17],fh:[10,-20],sit:1,it:'guitar'}),700],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-18],fh:[10,-20],sit:1,it:'guitar'}),500],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-17],fh:[11,-21],sit:1,it:'guitar',hd:'b'}),300],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-18],fh:[10,-20],sit:1,it:'guitar'}),900]],
          guitarTalk:[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-17],fh:[10,-20],sit:1,it:'guitar',hd:'o'}),140],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-17],fh:[10,-20],sit:1,it:'guitar'}),140]] }
});

// ---------------------------------------------------------------- BRUNO LALIĆ (Geist, 66): Portiersmütze, Schnurrbart, flaschengrüne Uniform mit Messingknöpfen
var brS=[
"............",
"...kkkkkk...",
"..kCCCCCCk..",
"..kyyyyyyk..",
".kCCCCCCCCCk",
".kjjSSSSSSk.",
".kjtSSSSeSk.",
".kjtSSSSSSSk",
"..ktSSSSSSk.",
"..ktSbbbbk..",
"...ktSSmk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var brF=[
"...........",
"..kkkkkkk..",
".kCCCCCCCk.",
".kyyyyyyyk.",
"kCCCCCCCCCk",
"kjSSSSSSSjk",
"kjSeSSSeSjk",
"ktSSStSSStk",
".kSSSSSSSk.",
".ktbbbbbtk.",
"..ktSmStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
M.defineChar('bruno',{
  legend:L({C:P.g2,y:P.y3,j:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.m4}),
  heads:{S:HS(brS),F:HS(brF),B:{n:brF}},
  torso:{w:12,len:13,col:[P.g2,P.g3,P.g1],buttons:P.y3,collar:[P.s5,P.s4],side:8},
  coat:{c:[P.g2,P.g3,P.g1],hem:6,w:6},
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.g2,P.g3,P.g1],sleeveF:[P.g1,P.g2,P.g0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  anims:{ porter:[[F({lh:[-6,-25],rh:[6,-25]}),1500],[F({lh:[-6,-25],rh:[6,-25],hd:'b'}),110],[F({lh:[-6,-25],rh:[6,-25],ho:[1,0]}),1300]],
          porterTalk:[[F({lh:[-6,-25],rh:[6,-25],hd:'o'}),140],[F({lh:[-6,-25],rh:[8,-28]}),140],[F({lh:[-6,-25],rh:[8,-28],hd:'o'}),140],[F({lh:[-6,-25],rh:[6,-25]}),160]] }
});

// ---------------------------------------------------------------- JAKOV (Geist, Totengräber von Sustipan): Schiebermütze, Weste, Besen
M.defineChar('jakov',{
  legend:L({C:P.e1,j:P.m4,S:P.q4,s:P.q3,t:P.q2,m:P.q1}),
  heads:{S:HS(stS),F:HS(stS),B:{n:stS}},
  torso:{w:12,len:12,col:[P.w1,P.w2,P.w0],collar:[P.m3,P.m2],buttons:P.y1,side:8,hunch:1},
  bones:[10,10,7,7], hipY:22,
  cols:{trou:[P.e1,P.e2,P.e0],trouF:[P.e0,P.e1,P.k1],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  anims:{ sweep:[[S({ln:2,nh:[6,-18],fh:[2,-24],it:'broom'}),500],[S({ln:2,nh:[9,-17],fh:[4,-23],it:'broom'}),500],[S({ln:2,nh:[6,-18],fh:[2,-24],it:'broom',hd:'b'}),300],[S({ln:2,nh:[3,-19],fh:[0,-24],it:'broom'}),500]],
          talkS:[[S({ln:1,nh:[3,-20],fh:[0,-24],it:'broom',hd:'o'}),140],[S({ln:1,nh:[3,-20],fh:[0,-24],it:'broom'}),140]] }
});

// Marko-Porträts brauchen nichts Eigenes; Porträts werden aus der Frontansicht geschnitten.
M.CAST_COLORS={ marko:P.s6, mala:P.x5, zdenka:P.t5, ivka:P.v5, mladen:P.b4, dinko:P.a6, sanja:P.d5, stipe:P.y4, frane:P.w5, nina:P.d6, mira:P.y4, ljerka:P.p5, ljerkaNight:P.p5, luka:P.v4, bruno:P.v5, jakov:P.v4, vesna:P.y5 };
})(M);
