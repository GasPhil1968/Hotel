/* ===== portraits/jasnaW.js — Jasna bei der Arbeit im Heim (Kapitel 4): hellblauer Kasack mit Namensschild statt der roten Strickjacke ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('jasnaW','jasna',{ maps:[
  {r:[0,44,56,20], map:{r1:'b2', r2:'b3', r3:'b4', r4:'b5'}}
], after:function(b,v){ b.rect(38,54,8,4,P.s6); b.hl(39,45,55,P.b1); b.hl(39,43,56,P.b2); } });
})(M);
