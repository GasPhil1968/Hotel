/* ===== portraits/kontrolor.js — Fahrscheinkontrolleur in der Straßenbahn (Kapitel 2): aus Damirs Bild – ergrautes Haar, dunkelgraue Jacke, weißer Kragen, Ausweis am Band ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('kontrolor','damir',{ maps:[
  {r:[0,0,56,44], map:{h0:'m1', h1:'m2', h2:'m3', h3:'m4', s6:'p4', s5:'p4', y3:'p3', w4:'p3'}},
  {r:[0,44,56,20], map:{n0:'k2', n1:'s0', n2:'s1', n3:'s2', n4:'s3', b1:'s3', b2:'s4', b3:'s5', b4:'s6', b5:'s6', r3:'s1', m2:'s1', m3:'s1', m4:'s1'}}
], after:function(b,v){ b.line(22,46,27,58,P.k2); b.line(36,46,31,58,P.k2); b.rect(26,57,8,6,P.s6); b.rect(27,58,6,1,P.b3); b.rect(27,60,4,1,P.k2); b.rect(27,61,3,1,P.k2); } });
})(M);
