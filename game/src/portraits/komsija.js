/* ===== portraits/komsija.js — Nachbar in Skela mit Hund (um 55) (Kapitel 3): aus Ilijas Bild – dunkle Mütze mit Stirnlampe, orangebraune Arbeitsjacke ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('komsija','ilija',{ maps:[
  {r:[0,44,56,20], map:{g0:'t0', g1:'t1', g2:'t2', g3:'t3', g4:'t4', y1:'t1', y2:'t2', y4:'t4'}}
], after:function(b,v){ b.rect(14,16,30,3,P.k2); b.hl(14,43,17,P.k1); b.rect(27,13,10,8,P.k1); b.rect(28,14,8,6,P.m3); b.rect(29,15,6,4,P.y4); b.px(30,16,P.l1); } });
})(M);
