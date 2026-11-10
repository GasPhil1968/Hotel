/* ===== portraits/beamtin.js — Schalterbeamtin im Konsulat (um 40) (Kapitel 4): aus Eminas Bild – dunkles Haar im Knoten, dunkelblauer Blazer, weiße Bluse, ohne Ohrringe ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('beamtin','emina',{ maps:[
  {r:[0,0,56,24], map:{m3:'h2', m2:'h1', m1:'h0'}},
  {r:[0,22,56,22], map:{y2:'p2', y3:'p3', y5:'p5', m3:'h2', m2:'h1'}},
  {r:[0,44,56,20], map:{r0:'n0', r1:'n0', r2:'n1', r3:'n2', r4:'n3', m0:'s5', m1:'s6', m2:'s6'}}
] });
})(M);
