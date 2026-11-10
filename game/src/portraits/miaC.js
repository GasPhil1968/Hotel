/* ===== portraits/miaC.js — Mia draußen (Kapitel 4): lila Schneeanzug, lila Bommelmütze über den Zöpfen ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('miaC','mia',{ maps:[
  {r:[0,44,56,20], map:{r2:'d1', r3:'d2', r4:'d3', y3:'d3', y4:'d3', y5:'d4'}},
  {r:[0,0,56,16], map:{w0:'d1', w1:'d2', w2:'d3', w3:'d3', w4:'d4', p5:'d4'}}
], after:function(b,v){ var T=M.T, L=[], R=[], top=64, y, x; for (y=0;y<b.h;y++){ var l=-1, r=-1; for (x=0;x<b.w;x++){ if (b.d[y*b.w+x]!==T){ if (l<0) l=x; r=x; } } L[y]=l; R[y]=r; if (l>=0 && y<top) top=y; } var cx=Math.round((L[top]+R[top])/2); b.ellipse(cx,top-1,3.2,2.8,P.s6); b.px(cx-1,top-2,P.s5); b.px(cx+1,top,P.s4); for (x=L[top+8];x<=R[top+8];x++){ var c=b.get(x,top+8); if (c===P.d1||c===P.d2||c===P.d3||c===P.d4) b.px(x,top+8,P.s5); } } });
})(M);
