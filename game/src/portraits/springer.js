/* ===== portraits/springer.js — der Springer (Geist, wirkt 25, 1960er) (Kapitel 3): aus Kevins Bild – pomadisiertes dunkles Haar, nackte Schultern ===== */
(function(M){
'use strict';
var P=M.P;
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.springer=true;
M.derivePortrait('springer','kevin',{ maps:[
  {r:[0,44,56,20], map:{a6:'p4', a5:'p3', a4:'p2', s6:'p4', s3:'p2', k2:'p2', n2:'p3'}},
  {r:[0,0,56,24], map:{h3:'h1', w3:'h2', w2:'h1', l1:'h3'}}
] });
})(M);
