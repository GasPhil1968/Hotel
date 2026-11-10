/* ===== portraits/student.js — Student in der Straßenbahn (Kapitel 2): aus Dinos Bild – dunkelrote Wollmütze, blaue Daunenjacke, Kopfhörer um den Hals ===== */
(function(M){
'use strict';
var P=M.P;
M.derivePortrait('student','dino',{ maps:[
  {r:[0,0,56,24], map:{h0:'r0', h1:'r1', h2:'r2', h3:'r3'}},
  {r:[0,44,56,20], map:{r0:'b0', r1:'b1', r2:'b2', r3:'b3', r4:'b4', s5:'n1', s4:'n0', s3:'n0', m2:'b1', m3:'b2'}}
], after:function(b,v){ // Kopfhörer: der Bügel liegt als schmaler Reif außen auf der Mütze (folgt der Silhouette vom Ohr über den Scheitel bis zur Schläfe), die Muschel sitzt auf dem Ohr
    var T=M.T, L=[], R=[], top=64, y, x; for (y=0;y<b.h;y++){ var l=-1, r=-1; for (x=0;x<b.w;x++){ if (b.d[y*b.w+x]!==T){ if (l<0) l=x; r=x; } } L[y]=l; R[y]=r; if (l>=0 && y<top) top=y; }
    var cupY=27, ex=L[cupY]+1;
    for (y=cupY-2;y>top;y--){ if (L[y]<0) continue; b.px(L[y]-1,y,P.m2); b.px(L[y]-2,y,P.k1); }
    for (x=L[top]-1;x<=R[top]+1;x++){ b.px(x,top-1,P.m2); b.px(x,top-2,P.k1); }
    for (y=top;y<=26;y++){ if (R[y]<0) continue; b.px(R[y]+1,y,P.m2); b.px(R[y]+2,y,P.k1); }
    b.rect(ex-1,cupY-5,8,11,P.k1); b.rect(ex,cupY-4,6,9,P.m3); b.rect(ex+1,cupY-3,4,7,P.m1); b.px(ex+1,cupY-3,P.m4); [[ex-1,cupY-5],[ex+6,cupY-5],[ex-1,cupY+5],[ex+6,cupY+5]].forEach(function(q){ b.px(q[0],q[1],b.get(q[0]+(q[0]<ex?1:-1),q[1])); }); } });
})(M);
