/* ===== 14_k5_cast.js — Besetzung Kapitel 5: Hamdija Selimović, Abfüller der Brauerei, 1993 der Mann am Hahn (Geist).
   Kopfform und Proportionen eines Mannes um die fünfzig aus Kapitel 2 (Šehić), eigene Farben: dunkles, grau meliertes Haar,
   dunkler Schnurrbart, blaues Arbeitshemd mit nassen, dunkleren Ärmeln, braune Gummischürze, Gummistiefel.
   Geister sind in natürlichen Farben gemalt; das Spiel färbt sie über M.ghostLut ein. Alle anderen Figuren kommen aus Kapitel 2 bis 4. ===== */
(function(M){
'use strict';
var P=M.P;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
var base=M.CHARS && M.CHARS.sehic;
M.defineChar('hamdija',{
  legend:L({h:P.s1,H:P.s0,j:P.s2,g:P.s0,b:P.s0,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:base?base.heads:{}, neck:base?base.neck:undefined,
  torso:{w:12,len:13,col:[P.n2,P.n3,P.n1],buttons:P.n1,side:8},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.n1,P.n2,P.n0],sleeveF:[P.n0,P.n1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k1},
  // die Gummischürze bis über die Knie, mit Halsband; in der Seitenansicht ein Streifen vor dem Bauch
  post:function(b,p,X,Y,hx,hy){ var t=Y+hy-12, x;
    if (p.v==='F'){ for (var y=t;y<=Y+hy+7;y++) for (x=X+hx-4;x<=X+hx+4;x++) b.px(x,y,(x===X+hx-4)?P.e2:((y-t)%5===4?P.e0:P.e1)); b.px(X+hx-3,t-2,P.e1); b.px(X+hx+3,t-2,P.e1); b.px(X+hx-2,t-3,P.e1); b.px(X+hx+2,t-3,P.e1); }
    else if (p.v==='S'){ for (var y2=t+1;y2<=Y+hy+7;y2++){ b.px(X+hx+3,y2,P.e1); b.px(X+hx+4,y2,P.e2); } b.px(X+hx+2,t,P.e1); }
    else if (p.v==='B'){ b.hl(X+hx-4,X+hx+4,Y+hy-6,P.e0); } }
});
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.hamdija=true;
if (M.CAST_COLORS.hamdija===undefined) M.CAST_COLORS.hamdija=P.v4;
// Fra Ivo, Franziskaner von Sveti Ante (Bistrik), hält Zorans Begräbnis am Montag: braune Kutte bis zum Boden, darüber das weiße
// Chorhemd bis über die Hüfte, eine violette Stola. Kopf wie Šehić, kurzes dunkelgraues Haar.
M.defineChar('fra',{
  legend:L({h:P.m2,H:P.m1,j:P.m3,g:P.m1,b:P.m2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:base?base.heads:{}, neck:base?base.neck:undefined,
  torso:{w:12,len:13,col:[P.s5,P.s6,P.s4],buttons:P.s4,side:8},
  cols:{trou:[P.e1,P.e2,P.e0],trouF:[P.e0,P.e1,P.k1],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k1},
  // unten die braune Kutte bis knapp über die Füße (über den Beinen, nach unten weiter), darüber die violette Stola
  post:function(b,p,X,Y,hx,hy){ var t=Y+hy-12, y, x, y0=Y+hy+1, y1=Y-2, n=Math.max(1,y1-y0);
    if (p.v==='F'||p.v==='B'){ for (y=y0;y<=y1;y++){ var hw=4+Math.round((y-y0)/n*2); for (x=X+hx-hw;x<=X+hx+hw;x++) b.px(x,y,(x===X+hx-hw)?P.e2:((x===X+hx+hw)?P.e0:((x+y)%5===0?P.e0:P.e1))); }
      if (p.v==='F'){ for (y=t;y<=Y+hy+8;y++){ b.px(X+hx-2,y,P.v2); b.px(X+hx+2,y,P.v2); } b.px(X+hx-2,Y+hy+9,P.v3); b.px(X+hx+2,Y+hy+9,P.v3); }
      else b.hl(X+hx-3,X+hx+3,t,P.v2); }
    else if (p.v==='S'){ for (y=y0;y<=y1;y++){ var sw=3+Math.round((y-y0)/n); for (x=X+hx-sw;x<=X+hx+sw;x++) b.px(x,y,(x===X+hx+sw)?P.e0:P.e1); }
      for (y=t+1;y<=Y+hy+8;y++) b.px(X+hx+3,y,P.v2); } }
});
if (M.CAST_COLORS.fra===undefined) M.CAST_COLORS.fra=P.e5;
})(M);
