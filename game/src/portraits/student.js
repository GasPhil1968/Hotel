/* ===== portraits/student.js — Student in der Straßenbahn (Kapitel 2): aus Dinos Bild – dunkelrote Wollmütze, blaue Daunenjacke, Kopfhörer um den Hals ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('student','dino',{ maps:[
  {r:[0,0,56,24], map:{h0:'r0', h1:'r1', h2:'r2', h3:'r3'}},
  {r:[0,44,56,20], map:{r0:'b0', r1:'b1', r2:'b2', r3:'b3', r4:'b4', s5:'n1', s4:'n0', s3:'n0', m2:'b1', m3:'b2'}}
], after:function(b,v){ var pts=[[13,30],[14,20],[18,12],[26,7],[36,6],[44,9],[48,15]]; for (var i=1;i<pts.length;i++){ b.line(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],P.k1); b.line(pts[i-1][0],pts[i-1][1]+1,pts[i][0],pts[i][1]+1,P.m2); } b.rect(15,28,7,10,P.k1); b.rect(16,29,5,8,P.m2); b.rect(17,30,3,6,P.m1); } });
})(M);
