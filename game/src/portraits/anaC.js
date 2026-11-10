/* ===== portraits/anaC.js — Ana draußen (Kapitel 4): dunkelgrüner Parka, gestreifte Wollmütze über dem Pferdeschwanz ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('anaC','ana',{ maps:[
  {r:[0,44,56,20], map:{y0:'g0', y1:'g1', y2:'g2', y3:'g3', y4:'g4'}},
  {r:[0,0,56,20], map:{h0:'r1', h1:'r2', h2:'r3', h3:'r3', w2:'r3', p5:'r4'}}
], after:function(b,v){ for (var y=4;y<20;y+=4) for (var x=0;x<b.w;x++){ var c=b.get(x,y); if (c===P.r2||c===P.r3||c===P.r4) b.px(x,y,P.s5); if (c===P.r1) b.px(x,y,P.s4); } } });
})(M);
