/* ===== portraits/babica.js — alte Frau in der Straßenbahn (Kapitel 2): aus Zlatas Bild – braunes Kopftuch, dunkelgrüner Mantel ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('babica','zlata',{ maps:[
  {r:[0,0,56,44], map:{n0:'w0', n1:'w1', n2:'w2', n3:'w3', n4:'w4'}},
  {r:[0,44,56,20], map:{s0:'g0', s1:'g1', s2:'g2', s3:'g3', w3:'g1', w2:'g0', n1:'w1', n2:'w2', n3:'w3', n0:'w0'}}
] });
})(M);
