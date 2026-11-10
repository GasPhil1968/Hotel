/* ===== portraits/nikoC.js — Niko draußen (Kapitel 4): roter Schneeanzug, blaue Mütze mit Ohrenklappen über den Locken ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('nikoC','niko',{ maps:[
  {r:[0,44,56,20], map:{s5:'r3', s4:'r2', s6:'r4', b1:'r1', b2:'r2', b3:'r3'}},
  {r:[0,0,56,19], map:{y1:'n0', y2:'n1', y3:'n2', y4:'n3', y5:'n4', p5:'n3'}}
], after:function(b,v){ var T=M.T, L=[], R=[], top=64, y, x; for (y=0;y<b.h;y++){ var l=-1, r=-1; for (x=0;x<b.w;x++){ if (b.d[y*b.w+x]!==T){ if (l<0) l=x; r=x; } } L[y]=l; R[y]=r; if (l>=0 && y<top) top=y; } for (y=24;y<34;y++){ if (L[y]<0) continue; b.rect(L[y]-1,y,5,1,y<26?P.n2:P.n1); b.rect(R[y]-2,y,3,1,P.n1); } b.hl(L[33]-1,L[33]+3,34,P.s4); } });
})(M);
