/* ===== rooms/art/palma.js — Hotel Palma, die Halle: ein verblasstes Grandhotel (1910er) bei Regen =====
   Fluchtpunkt-Halle: links die Portiersloge (Glaskasten mit Steckfeld, Schlüsselfächern 1–40, Schublade mit Telefonbuch),
   davor der dunkle Tresen, dahinter Ljerkas Tür PRIVAT und das Regal mit den Registerbüchern, in der Mitte die
   Garderobe 1–20 (Haken 13: Brunos grüner Mantel) und die Eingangstür, rechts die große Treppe mit rotem Läufer,
   auf dem Absatz die Kette „ZATVORENO“ und die Standuhr. Vorn ein Lesetisch mit Lampe, zwei Sessel, Topfpalmen.
   c3: Abend, alle Lampen an, Regen am Glas. c3_night: nur die Lesetischlampe und die Notbeleuchtung. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer;
var W=320, VX=166, VY=54, F=90, FY=96, RW=276;
var R3=M.room3([VX,VY],F,FY), SPEC={vp:[VX,VY],rect:[0,0,RW,FY]};
// ---- Lage der Dinge: X = Rückwand-x, Y = Höhe (0 oben, 96 Boden), Z = Tiefe zum Betrachter
var LODGE={X0:61,X1:100,Z1:27,Y0:48};
var DESK={X0:88,X1:150,Z0:36,Z1:44,Y0:75};
var KEYS={X0:65,Y0:50,cols:8,rows:5,cw:4,ch:7};
var PRIV={X0:103,X1:126,Y0:48};
var REG={X0:129,X1:146,Y0:44};
var COAT={X0:151,X1:202,Y0:37};
var ENT={X0:211,X1:239,Y0:32};
var ST={X0:243,X1:RW,Zb:36,Zt:10,Yt:58,n:8};
var CLK={X0:254,X1:266,Z:3,Y0:10};
var WIN={u0:7,u1:26,Y0:14,Y1:50};
var TAB={x0:147,x1:175,top:118,base:136};
var PEND=[[128,30,40],[198,30,40]];
var HK13=COAT.X0+3+2*5;
function K(Z){ return 1+Z/F; }
function SX(X,Z){ return VX+(X-VX)*K(Z); }
function SY(Y,Z){ return VY+(Y-VY)*K(Z); }
function Xat(x,Z){ return VX+(x-VX)/K(Z); }
function fl(x,y){ var k=(y-VY)/(FY-VY); if (k<=0) return null; return {X:VX+(x-VX)/k, Z:(k-1)*F, k:k}; }
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
var CACHE={}, LASTBG=null;

// ---------------------------------------------------------------- weiches Lampenlicht: Stufen zwischen Schatten- und Lampenfarbe
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.52+L*0.10+12, g*0.38+L*0.08+4, b*0.50+L*0.10+22]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.24+L*0.09, b*0.38+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; }
};
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=6, A=TF[tod], B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.15)); }
  return LV[tod]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.1); } return s>1?1:s; }
function shade(buf,ox,oy,tod,Ls,skip){ if (tod==='day'||!TF[tod]) return; var L=levels(tod), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function lightsFor(tod){
  if (tod==='night') return [[TAB.x0+14,TAB.top-6,70,44,1.0],[TAB.x0+14,TAB.top+6,34,22,0.4]];
  return [[SX(PEND[0][0],PEND[0][2]),60,92,82,0.62],[SX(PEND[1][0],PEND[1][2]),60,92,82,0.62],[TAB.x0+14,TAB.top-6,56,36,0.75],
    [133,80,40,26,0.55],[268,84,34,30,0.55],[62,66,36,28,0.7],[148,46,18,14,0.35],[241,46,18,14,0.35]]; }

// ---------------------------------------------------------------- Texturen
function damask(X,Y){ var tw=16, th=20, row=Math.floor(Y/th), ox=(row&1)*8, u=((X+ox)%tw+tw)%tw-8, v=((Y%th)+th)%th-10, au=Math.abs(u), av=Math.abs(v), c=P.e2;
  var d=au/5.2+av/8.4; if (d<1 && d>0.66) c=P.e3; else if (d<0.3) c=P.e3;
  if (au===0 && av>=8) c=P.e3; if (av===0 && (au===3)) c=P.e3;
  if (((X+Y)&1)===0 && d<0.66 && d>0.5) c=P.e3;
  if (hash(X*0.71,Y*1.37)<0.025) c=P.e1;
  return c; }
function wainscot(X,Y){ if (Y<66) return null; var c;
  if (Y<68) c=Y===66?P.w4:P.w3; else if (Y===68) c=P.w0; else if (Y>=92) c=Y===92?P.w2:P.w0;
  else { var pw=22, pu=((X-2)%pw+pw)%pw; c=P.w1;
    if (pu>=3 && pu<=pw-3 && Y>=71 && Y<=89){ c=P.w2; if (pu===3||Y===71) c=P.w3; if (pu===pw-3||Y===89) c=P.w0; if (c===P.w2 && ((X*3+Y*5)%19===0)) c=P.w1; } }
  return c; }
function backWall(X,Y){ var c;
  if (Y<2) c=P.w0; else if (Y<5) c=((X>>1)&1)?P.w2:P.w0; else if (Y<6) c=P.y1; else if (Y<7) c=P.w1; else if (Y<9) c=Y===7?P.y2:P.y1;
  else { var w=wainscot(X,Y); c=w===null?damask(X,Y):w; if (Y===9) c=P.e1; if (Y===64) c=P.e1; if (Y===65) c=P.w1; }
  return c; }
function rightWall(u,Y){ var ut=110*(1-1/(1+u/110)); return M.DN[backWall(Math.floor(ut*1.6)+402,Y)]; }
// Marmorboden: diagonal gelegt, creme und dunkelgrün, echte Verkürzung; roter Läufer vom Eingang
function floorCol(x,y){ var f=fl(x,y); if (!f) return P.k0; var X=f.X, k=f.k, D=60*(1-1/k);
  if (D<0.9) return P.k2;
  if (D<3.2){ var bu=Math.floor(X/6); return D<1.6?P.g0:(((bu&1)?P.g1:P.g2)); }
  if (D<3.7) return P.y1;
  if (X>=ENT.X0+1 && X<=ENT.X1-1){ var u=X-ENT.X0-1, w=ENT.X1-ENT.X0-2;
    if (u<1.3||u>w-1.3) return P.y2; if (u<2.4||u>w-2.4) return P.r1;
    var pz=(D*2.2)%4, pu=Math.abs(u-w/2), m=(pz<2?pz:4-pz)*2.4; if (Math.abs(pu-m)<0.8) return P.r3; if (pu<0.7&&pz<0.5) return P.y2;
    return P.r2; }
  var TU=11, TD=2.9, a=(X/TU)+(D/TD), b2=(X/TU)-(D/TD), ia=Math.floor(a), ib=Math.floor(b2), fa=a-ia, fb=b2-ib;
  var gx=1/(TU*k), gd=60/(42*k*k*TD), g=Math.max(gx,gd)*0.75;
  var dark=((ia+ib)&1)===1;
  if (fa<g||fb<g) return dark?P.g1:P.s2;
  var tv=hash(ia*3+ib*7,ia-ib), v=Math.sin(X*0.23+D*2.7+Math.sin(D*0.9+X*0.06)*2.0)+Math.sin(X*0.08-D*4.1)*0.5, c;
  if (dark){ c=P.g2; if (v>1.45) c=P.g3; else if (tv<0.25) c=P.g1; }
  else { c=P.s4; if (v>1.35) c=P.s3; else if (tv<0.3) c=P.s3; }
  return c; }

// ---------------------------------------------------------------- kleine Malhilfen
function plate(b,x,y,s){ var w=s.length>1?9:5, x0=x-(w>>1); b.rect(x0,y,w,7,P.s3); b.hl(x0,x0+w-1,y,P.s4); b.hl(x0,x0+w-1,y+6,P.s1); b.vl(x0+w-1,y+1,y+6,P.s1); b.px(x0,y,P.s5); M.microText(b,s,x0+1,y+1,P.k1); }
function hook(b,x,y){ b.px(x,y,P.y4); b.px(x,y+1,P.y3); b.px(x-1,y+2,P.y2); b.px(x+1,y+2,P.y3); b.px(x+1,y+1,P.y1); b.px(x,y-1,P.y1); }
function frameBox(b,x,y,w,h,fr){ fr=fr||M.R('y0 y1 y2 y3'); b.rect(x,y,w,h,fr[1]); b.hl(x,x+w-1,y,fr[3]); b.vl(x,y,y+h-1,fr[2]); b.hl(x,x+w-1,y+h-1,fr[0]); b.vl(x+w-1,y,y+h-1,fr[0]); }

// ---------------------------------------------------------------- Blick nach draußen: die Riva im Regen
function outside(tod,weather){ var o=new M.Buf(W,144,P.k0), wet=weather==='rain';
  M.scn.sky(o,180,0,140,58,tod,weather,23);
  var sea=tod==='night'?M.R('k1 a0 a1 n0'):(tod==='dawn'?M.R('n1 a2 n2'):(tod==='day'?M.R('a2 a3 a4'):M.R('d0 a1 d1 a2')));
  for (var y=50;y<62;y++) for (var x=180;x<320;x++) o.px(x,y,M.rampAt(sea,0.25+Math.sin(x*0.4+y*1.3)*0.12+(y-50)/24,x,y));
  if (tod!=='day') for (x=182;x<320;x+=6){ var xx=x+(hash(x,1)*4|0); o.px(xx,51,hash(x,2)<0.5?P.y4:P.y3); if (hash(x,3)<0.6) o.px(xx,53+(x%3),P.y2); }
  var pav=tod==='night'?M.R('k1 n0 n1 n2'):(tod==='day'?M.R('s1 s2 s3 s4'):M.R('d0 m1 d1 m2'));
  for (y=62;y<144;y++) for (x=180;x<320;x++){ var v=0.25+(y-62)/80+(hash(x>>1,y)*0.18)+(((y*7+x)%11===0)?0.2:0); o.px(x,y,M.rampAt(pav,v,x,y)); }
  var lit=tod!=='day', pc=tod==='night'?P.k0:(tod==='day'?P.g1:P.d0);
  for (y=30;y<62;y++) o.px(216+Math.round(Math.sin((62-y)*0.06)*2),y,pc);
  for (var f=0;f<7;f++){ var a=-Math.PI+f/6*Math.PI; for (var s=0;s<9;s++) o.px(Math.round(218+Math.cos(a)*s),Math.round(29+Math.sin(a)*s*0.5+s*s*0.06),pc); }
  o.rect(231,38,1,24,tod==='night'?P.k0:P.m0); o.rect(229,35,5,3,lit?P.y4:P.m1); o.px(231,34,P.m0);
  if (lit){ o.px(230,36,P.l1); o.px(231,36,P.y5); for (y=62;y<96;y++){ if (bayer(231,y)<0.8-(y-62)/42) o.px(231+((y>>2)&1),y,y<76?P.y4:P.y3); if (bayer(230,y)<0.4-(y-62)/80) o.px(230,y,P.y2); } }
  if (wet) for (var i=0;i<70;i++){ var rx=180+Math.floor(hash(i,31)*140), ry=Math.floor(hash(i,32)*96); o.px(rx,ry,tod==='night'?P.n2:P.m3); o.px(rx,ry+1,tod==='night'?P.n1:P.m2); }
  return o; }

// ---------------------------------------------------------------- Treppe mit Läufer, Messingstangen, Geländer und Bronzeleuchter
function stairStep(i){ var dz=(ST.Zb-ST.Zt)/ST.n, dy=(FY-ST.Yt)/ST.n; return {Zf:ST.Zb-i*dz, Zr:ST.Zb-(i+1)*dz, Y:FY-(i+1)*dy, dy:dy}; }
function onRunner(X){ return X>=ST.X0+7 && X<=ST.X1-6; }
function paintStair(b,S){ var p=R3.p, X0=ST.X0, X1=ST.X1, i;
  R3.box(b,X0,X1,ST.Yt,FY,0,ST.Zt,{top:function(x,y){ return onRunner(Xat(x,ST.Zt))?P.r2:P.w3; },front:P.w1,left:P.w1});
  for (i=ST.n-1;i>=0;i--){ (function(s,i){
    R3.box(b,X0,X1,s.Y,FY,s.Zr,s.Zf,{
      top:function(x,y){ var X=Xat(x,(s.Zr+s.Zf)/2); if (onRunner(X)) return P.r3; return P.w4; },
      front:function(x,y){ var X=Xat(x,s.Zf), yy=y-SY(s.Y,s.Zf), hh=s.dy*K(s.Zf), run=onRunner(X), e=X-ST.X0-7;
        if (yy<1) return run?P.r4:P.w4;
        if (yy>=hh-1.1) return run?P.y4:P.w0;
        if (yy>=hh-2.1) return run?P.r1:P.w1;
        if (run){ if (e<1||e>X1-6-ST.X0-7-1) return P.y1; return (yy<2.2)?P.r3:P.r2; }
        return (hash(Math.floor(X/3),i)<0.4)?P.w1:P.w2; },
      left:P.w1}); })(stairStep(i),i); }
  var top0=p(X0,FY,ST.Zb), top1=p(X0,ST.Yt,ST.Zt);
  b.poly([p(X0,FY-1,ST.Zb+0.6),p(X0,ST.Yt-1,ST.Zt-0.4),p(X0,ST.Yt,0),p(X0,FY,0),p(X0,FY,ST.Zb+0.6)],function(x,y){ var t=(x-top1[0])/(top0[0]-top1[0]), top=lerp(top1[1],top0[1],t)-1, d=y-top;
    if (d<1.2) return P.w4; if (d<2.4) return P.w2; if (d<3.4) return P.w0; var pu=((Math.floor(x)-201)%8+8)%8; if (pu===0) return P.w0; if (pu===1) return P.w3; return ((x+y)%7===0)?P.w2:P.w1; });
  for (i=0;i<=ST.n*2;i++){ var t=i/(ST.n*2), Zs=lerp(ST.Zb,ST.Zt,t), Ys=lerp(FY,ST.Yt,t)-1.5, a=p(X0,Ys,Zs), h=p(X0,Ys-18,Zs);
    b.vl(rd(a[0]),rd(h[1])+1,rd(a[1])-1,P.w1); b.px(rd(a[0]),rd(h[1])+3,P.w3); b.px(rd(a[0]),rd(a[1])-3,P.w3); }
  var hb=p(X0,FY-20,ST.Zb), ht=p(X0,ST.Yt-20,ST.Zt);
  b.line(rd(hb[0]),rd(hb[1])-1,rd(ht[0]),rd(ht[1])-1,P.w4); b.line(rd(hb[0]),rd(hb[1]),rd(ht[0]),rd(ht[1]),P.w3); b.line(rd(hb[0]),rd(hb[1])+1,rd(ht[0]),rd(ht[1])+1,P.w0);
  var q0=p(X0,ST.Yt,ST.Zt), q1=p(X0,ST.Yt-23,ST.Zt), qx=rd(q0[0]); b.rect(qx-1,rd(q1[1]),4,rd(q0[1]-q1[1]),P.w1); b.vl(qx-1,rd(q1[1]),rd(q0[1]),P.w3); b.vl(qx+2,rd(q1[1]),rd(q0[1]),P.w0);
  b.rect(qx-2,rd(q1[1])-2,6,2,P.w2); b.hl(qx-2,qx+3,rd(q1[1])-2,P.w4); b.ellipse(qx+0.5,rd(q1[1])-3.5,1.8,1.6,P.y2); b.px(qx,rd(q1[1])-4,P.y4);
  var n0=p(X0,FY,ST.Zb), n1=p(X0,FY-22,ST.Zb), nx=rd(n0[0]), ny0=rd(n0[1]), ny1=rd(n1[1]);
  b.rect(nx-3,ny1,7,ny0-ny1,P.w1); b.vl(nx-3,ny1,ny0-1,P.w3); b.vl(nx+3,ny1,ny0-1,P.w0); b.rect(nx-2,ny1+5,5,ny0-ny1-12,P.w2); b.hl(nx-2,nx+2,ny1+5,P.w0); b.vl(nx+2,ny1+6,ny0-8,P.w1);
  b.rect(nx-4,ny1-2,9,3,P.w2); b.hl(nx-4,nx+4,ny1-2,P.w4); b.rect(nx-4,ny0-4,9,4,P.w0); b.hl(nx-4,nx+4,ny0-4,P.w2);
  var fy=ny1-3;
  b.poly([[nx-1,fy],[nx+2,fy],[nx+1,fy-11],[nx,fy-11]],P.e1); b.ellipse(nx+0.5,fy-13,1.6,1.8,P.e1); b.vl(nx,fy-10,fy-1,P.e2); b.px(nx,fy-14,P.e3);
  b.line(nx+1,fy-10,nx+4,fy-16,P.e1); b.line(nx,fy-10,nx-3,fy-15,P.e1);
  b.ellipse(nx+4.5,fy-19,3,3,P.s5); b.ellipse(nx-2.5,fy-18,2.4,2.4,P.s5); b.px(nx+4,fy-20,P.s6); b.px(nx-3,fy-19,P.s6);
  CACHE.newel=[[nx+4,fy-19,3],[nx-3,fy-18,2.4]]; }

// ---------------------------------------------------------------- Portiersloge innen: Steckfeld, Schlüsselfächer, Stuhl, Schublade, Tasse
function paintLodgeInside(b){ var L=LODGE, p=R3.p, x, y;
  b.poly([p(L.X0,FY,0),p(L.X1,FY,0),p(L.X1,FY,L.Z1),p(L.X0,FY,L.Z1)],function(x,y){ return ((Math.floor(Xat(x,10)/5))&1)?P.w1:P.w0; });
  for (y=L.Y0;y<FY;y++) for (x=L.X0;x<L.X1;x++) b.px(x,y,M.DN[b.get(x,y)]);
  b.poly([p(L.X0,L.Y0,0),p(L.X0,L.Y0,L.Z1),p(L.X0,FY,L.Z1),p(L.X0,FY,0)],function(x,y){ var Z=(VX-L.X0)/(VX-x)*F-F, Y=VY+(y-VY)/K(Z); return M.DN[M.DN[backWall(400+Math.floor(Z*1.3),Math.floor(Y))]]; });
  b.poly([p(L.X0,53,3),p(L.X0,53,22),p(L.X0,FY,22),p(L.X0,FY,3)],function(x,y){ var Z=(VX-L.X0)/(VX-x)*F-F, Y=VY+(y-VY)/K(Z);
    if (Y<55) return P.w3; if (Y<56) return P.w0;
    if (Y<73){ var ry=(Y-57)%3.2, rz=(Z-4)%2.1; if (Z>4.5 && Z<21 && ry<1.1 && rz<1) return (hash(Math.floor(Y/3.2),Math.floor((Z-4)/2.1))<0.22)?P.s5:P.y3; return P.k1; }
    if (Y<75) return P.w4; if (Y<76) return P.w0; return ((Math.floor(Z/4))&1)?P.w2:P.w1; });
  for (var z=5;z<21;z+=2){ var q=p(L.X0,74.5,z); b.px(rd(q[0]),rd(q[1]),P.k1); b.px(rd(q[0]),rd(q[1])-1,(z%4)?P.r3:P.m3); }
  [[7,60,9],[11,66,14],[15,62,19],[9,70,5],[17,58,13]].forEach(function(c,i){ var a=p(L.X0,74,c[0]), e=p(L.X0,c[1],c[2]); b.line(rd(a[0]),rd(a[1])-1,rd(e[0]),rd(e[1]),i%2?P.r3:P.m1); });
  var hp=p(L.X0,57,24); b.ellipse(hp[0]+1,hp[1]+2,2.2,2.6,P.k1); b.ellipse(hp[0]+1,hp[1]+2,1.1,1.5,P.w0); b.rect(rd(hp[0]),rd(hp[1])+4,2,2,P.m2);
  var kx=KEYS.X0, ky=KEYS.Y0, kw=KEYS.cols*KEYS.cw+1, kh=KEYS.rows*KEYS.ch+1;
  b.rect(kx-2,ky-4,kw+4,kh+6,P.w1); b.hl(kx-2,kx+kw+1,ky-4,P.w4); b.hl(kx-2,kx+kw+1,ky-3,P.w2); b.vl(kx-2,ky-4,ky+kh+1,P.w2); b.vl(kx+kw+1,ky-4,ky+kh+1,P.w0); b.hl(kx-2,kx+kw+1,ky+kh+1,P.w0);
  for (var r=0;r<KEYS.rows;r++) for (var cI=0;cI<KEYS.cols;cI++){ var n=r*KEYS.cols+cI+1, cx=kx+cI*KEYS.cw, cy=ky+r*KEYS.ch;
    b.rect(cx,cy,KEYS.cw+1,KEYS.ch+1,P.w0); b.rect(cx+1,cy+1,KEYS.cw-1,KEYS.ch-1,P.k1); b.hl(cx,cx+KEYS.cw,cy+KEYS.ch,P.w2); b.px(cx+2,cy+KEYS.ch,P.y1);
    var hs=hash(n,7); if (hs<0.16 && n!==31) continue;
    if (hs>0.86){ b.rect(cx+1,cy+2,3,3,P.s5); b.px(cx+1,cy+2,P.s6); b.px(cx+3,cy+4,P.s3); continue; }
    b.px(cx+2,cy+1,P.m3); b.px(cx+2,cy+2,P.m3); b.px(cx+2,cy+3,P.y3); b.rect(cx+1,cy+4,3,2,P.y2); b.px(cx+1,cy+4,P.y4); b.px(cx+3,cy+5,P.y1); }
  var c0=p(76,80,12), c1=p(85,80,12), cm=(c0[0]+c1[0])/2; b.hl(rd(c0[0]),rd(c1[0]),rd(c0[1]),P.w3); b.hl(rd(c0[0]),rd(c1[0]),rd(c0[1])+1,P.w1);
  b.ellipse(cm,c0[1]-7,4.5,6,P.w2); b.ellipse(cm,c0[1]-7,3,4.5,P.k1); b.ellipse(cm,c0[1]-8,1.5,2.5,P.w1);
  b.vl(rd(c0[0]),rd(c0[1])+1,rd(c0[1])+12,P.w1); b.vl(rd(c1[0]),rd(c1[1])+1,rd(c1[1])+12,P.w1);
  R3.box(b,87,99,66,FY,18,25,{front:function(x,y){ var Y=VY+(y-VY)/K(25); if (Y<67) return P.w4; var fy=(Y-67)%7; if (fy<1) return P.w0; if (Math.abs(x-SX(93,25))<0.9 && fy>2.5&&fy<4.5) return P.y4; return fy<2?P.w3:P.w2; },top:P.w3,right:P.w1});
  var pb=p(88,66,22), pb2=p(97,66,22), pbx=rd(pb[0]), pby=rd(pb[1]), pbw=rd(pb2[0]-pb[0]);
  b.rect(pbx,pby-4,pbw,4,P.y3); b.hl(pbx,pbx+pbw-1,pby-4,P.y4); b.hl(pbx,pbx+pbw-1,pby-1,P.e2); b.vl(pbx,pby-4,pby-1,P.r2); b.vl(pbx+1,pby-4,pby-1,P.r1); b.hl(pbx+3,pbx+pbw-2,pby-3,P.e3);
  var tc=p(98,66,20); b.rect(rd(tc[0])-1,rd(tc[1])-3,3,3,P.s5); b.px(rd(tc[0])+2,rd(tc[1])-2,P.s4); b.hl(rd(tc[0])-2,rd(tc[0])+2,rd(tc[1]),P.s4);
  CACHE.phone=[pbx,pby-4,pbw];
  var lp=p(80,49,12); b.vl(rd(lp[0]),rd(lp[1])-4,rd(lp[1]),P.k1); b.poly([[lp[0]-3,lp[1]+3],[lp[0]+4,lp[1]+3],[lp[0]+1.5,lp[1]],[lp[0]-0.5,lp[1]]],P.g3); b.hl(rd(lp[0])-3,rd(lp[0])+3,rd(lp[1])+3,P.g4);
  CACHE.llamp=[lp[0],lp[1]+4]; }

// ---------------------------------------------------------------- Rückwand: PRIVAT, Register, Garderobe, Eingang, Fotos, Heizkörper
function paintWallThings(b,S,tod,out,sky){
  [[147,150],[203,209],[239,243]].forEach(function(pl){ for (var y=9;y<FY;y++) for (var x=pl[0];x<pl[1];x++){ var c=(x===pl[0])?P.w3:((x===pl[1]-1)?P.w0:P.w2); if (y<13) c=y===9?P.y2:(y<12?P.w3:P.w1); if (y>=88) c=(x===pl[0])?P.w2:P.w0; b.px(x,y,c); } });
  var px0=PRIV.X0, pw=PRIV.X1-PRIV.X0; M.prop.door(b,px0,PRIV.Y0,pw,FY-PRIV.Y0,{ramp:M.R('w0 w1 w2 w3 w4'),frame:M.R('w0 w1 w2 w3'),knob:'L'});
  var sw=M.microWidth('PRIVAT')+4, sx=px0+((pw-sw)>>1); b.rect(sx,PRIV.Y0-10,sw,7,P.s5); b.hl(sx,sx+sw-1,PRIV.Y0-10,P.s6); b.hl(sx,sx+sw-1,PRIV.Y0-4,P.s2); M.microText(b,'PRIVAT',sx+2,PRIV.Y0-9,P.r1);
  var rx=REG.X0, rw=REG.X1-REG.X0; b.rect(rx-1,REG.Y0-3,rw+2,FY-REG.Y0+3,P.w0); b.hl(rx-2,rx+rw+1,REG.Y0-3,P.w3); b.hl(rx-2,rx+rw+1,REG.Y0-2,P.w1);
  for (var s=0;s<4;s++){ var sy=REG.Y0+1+s*12, r=M.rng(40+s), xx=rx;
    while (xx<rx+rw-1){ var bw=2+Math.floor(r()*2), bh=8+Math.floor(r()*3), cc=[P.r1,P.w2,P.g1,P.e1,P.r2,P.c1,P.w1][Math.floor(r()*7)]; if (xx+bw>rx+rw) break;
      if (r()<0.14 && xx+6<rx+rw){ b.rect(xx,sy+8,6,2,P.e2); b.hl(xx,xx+5,sy+8,P.e3); b.rect(xx,sy+6,5,2,P.r1); b.hl(xx,xx+4,sy+6,P.r2); xx+=6; continue; }
      b.rect(xx,sy+10-bh,bw,bh,cc); b.vl(xx,sy+10-bh,sy+9,M.UP[cc]); b.px(xx+(bw>>1),sy+10-bh+2,P.y3); b.px(xx+(bw>>1),sy+10-bh+5,P.y1); xx+=bw; }
    b.hl(rx,rx+rw-1,sy+10,P.w3); b.hl(rx,rx+rw-1,sy+11,P.w0); }
  var gx=COAT.X0, gw=COAT.X1-COAT.X0, gy=COAT.Y0;
  b.rect(gx,gy,gw,40,P.w1); b.hl(gx,gx+gw-1,gy,P.w3); b.vl(gx,gy,gy+39,P.w2); b.vl(gx+gw-1,gy,gy+39,P.w0); b.hl(gx,gx+gw-1,gy+39,P.w0); b.hl(gx+1,gx+gw-2,gy+19,P.w0); b.hl(gx+1,gx+gw-2,gy+20,P.w2);
  b.rect(gx-2,gy-3,gw+4,3,P.w2); b.hl(gx-2,gx+gw+1,gy-3,P.w4); b.hl(gx-2,gx+gw+1,gy-1,P.w0);
  var gs=M.microWidth('GARDEROBA')+4, gsx=gx+((gw-gs)>>1); b.rect(gsx,gy-11,gs,7,P.w0); b.hl(gsx,gsx+gs-1,gy-11,P.y1); b.hl(gsx,gsx+gs-1,gy-5,P.k2); M.microText(b,'GARDEROBA',gsx+2,gy-10,P.y3);
  for (var n=1;n<=20;n++){ var row=n<=10?0:1, i=(n-1)%10, hx=gx+3+i*5, lev=(i&1), ty=gy+3+row*17+lev*7; plate(b,hx,ty,String(n)); hook(b,hx,gy+17+row*17); }
  paintCoat(b,'day');
  b.rect(195,84,7,12,P.y1); b.hl(195,201,84,P.y3); b.vl(195,85,95,P.y2); b.vl(201,85,95,P.y0); b.hl(195,201,90,P.y2);
  b.line(197,84,196,68,P.k2); b.px(196,67,P.m3); b.line(199,84,201,71,P.r1); b.line(200,84,202,72,P.r2); b.px(202,70,P.y2); b.line(198,74,198,84,P.k1); b.px(198,73,P.m2);
  var ex=ENT.X0, ew=ENT.X1-ENT.X0, ey=ENT.Y0, ecx=ex+ew/2, er=ew/2;
  b.rect(ex-3,ey-2,ew+6,FY-ey+2,P.w0); b.hl(ex-3,ex+ew+2,ey-2,P.w2); b.vl(ex-3,ey-2,FY-1,P.w2);
  for (var y3=ey;y3<ey+15;y3++) for (var x3=ex;x3<ex+ew;x3++){ var dx=x3+0.5-ecx, dy=y3+0.5-(ey+15), d=Math.hypot(dx,dy*er/15);
    if (d<=er-1){ var ang=Math.atan2(-dy,dx), sp=Math.abs(((ang/(Math.PI/5))%1+1)%1-0.5)<0.07*(er/(d+1))+0.02; if (sp||d<4) b.px(x3,y3,d<4?P.y2:P.w1); else { b.px(x3,y3,out.get(x3,y3)); sky[y3*W+x3]=1; } }
    else if (d<=er+0.7) b.px(x3,y3,d<=er?P.w3:P.w2); }
  b.hl(ex,ex+ew-1,ey+15,P.w3); b.hl(ex,ex+ew-1,ey+16,P.w0);
  for (var lf=0;lf<2;lf++){ var lx=ex+lf*(ew>>1), lw=(ew>>1);
    b.rect(lx,ey+17,lw,FY-ey-17,P.w1); b.vl(lx,ey+17,FY-1,P.w3); b.vl(lx+lw-1,ey+17,FY-1,P.w0);
    for (var y4=ey+20;y4<ey+54;y4++) for (var x4=lx+2;x4<lx+lw-2;x4++){ b.px(x4,y4,out.get(x4,y4)); sky[y4*W+x4]=1; }
    b.hl(lx+2,lx+lw-3,ey+19,P.w0); b.hl(lx+1,lx+lw-2,ey+54,P.w3); b.rect(lx+2,ey+56,lw-4,FY-ey-60,P.w2); b.hl(lx+2,lx+lw-3,ey+56,P.w0); b.vl(lx+lw-3,ey+57,FY-5,P.w3);
    b.rect(lx+1,FY-4,lw-2,3,P.y1); b.hl(lx+1,lx+lw-2,FY-4,P.y3);
    var hx2=lf?lx+1:lx+lw-2; b.vl(hx2,ey+35,ey+45,P.y3); b.px(hx2,ey+35,P.y4); b.px(hx2,ey+45,P.y1); }
  b.vl(ex+(ew>>1),ey+17,FY-1,P.k1);
  b.rect(ex+4,ey-10,ew-8,7,P.g2); b.hl(ex+4,ex+ew-5,ey-10,P.g4); b.hl(ex+4,ex+ew-5,ey-4,P.g1); M.microText(b,'IZLAZ',ex+((ew-19)>>1),ey-9,P.s4);
  var f1=[68,13,28,22]; b.line(f1[0]+14,7,f1[0]+2,f1[1]-2,P.y1); b.line(f1[0]+14,7,f1[0]+f1[2]-3,f1[1]-2,P.y1); frameBox(b,f1[0]-2,f1[1]-2,f1[2]+4,f1[3]+4); b.rect(f1[0],f1[1],f1[2],f1[3],P.e4); photoHotel(b,f1[0]+1,f1[1]+1,f1[2]-2,f1[3]-2);
  b.rect(f1[0]+5,f1[1]+f1[3]+3,19,7,P.w0); M.microText(b,'1936',f1[0]+7,f1[1]+f1[3]+4,P.y3);
  var f2=[159,10,36,15]; frameBox(b,f2[0]-2,f2[1]-2,f2[2]+4,f2[3]+4,M.R('w0 w1 w2 w3')); photoStaff(b,f2[0],f2[1],f2[2],f2[3]);
  var f3=[8,42,16,20];
  if (S.photoTaken){ for (var y5=f3[1]-2;y5<f3[1]+f3[3]+2;y5++) for (var x5=f3[0]-2;x5<f3[0]+f3[2]+2;x5++){ var c5=backWall(x5,y5); b.px(x5,y5,(x5===f3[0]-2||y5===f3[1]+f3[3]+1)?c5:M.UP[c5]); } b.px(f3[0]+8,f3[1]-4,P.m4); b.px(f3[0]+8,f3[1]-3,P.m1); }
  else { b.line(f3[0]+8,f3[1]-6,f3[0]+1,f3[1]-1,P.y1); b.line(f3[0]+8,f3[1]-6,f3[0]+f3[2]-2,f3[1]-1,P.y1); b.px(f3[0]+8,f3[1]-6,P.y3); frameBox(b,f3[0]-2,f3[1]-2,f3[2]+4,f3[3]+4,M.R('k1 k2 m1 m2')); b.rect(f3[0]-1,f3[1]-1,f3[2]+2,f3[3]+2,P.y1); photoDance(b,f3[0],f3[1],f3[2],f3[3]); }
  for (var hxr=5;hxr<27;hxr+=3){ b.rect(hxr,74,2,18,P.m1); b.vl(hxr,74,91,P.m2); b.px(hxr,73,P.m2); b.px(hxr+1,73,P.m1); } b.hl(4,27,92,P.m0); b.hl(4,27,76,P.m0); b.hl(4,27,89,P.m0);
  [148.5,241].forEach(function(cx){ var x=Math.round(cx); b.rect(x-1,47,3,5,P.y1); b.px(x,46,P.y3); b.line(x-1,49,x-4,45,P.y2); b.line(x+1,49,x+4,45,P.y2); b.poly([[x-6,40],[x-2,40],[x-3,45],[x-5,45]],P.s5); b.poly([[x+2,40],[x+6,40],[x+5,45],[x+3,45]],P.s5); b.hl(x-6,x-2,40,P.s6); b.hl(x+2,x+6,40,P.s6); });
}
// Brunos Portiersmantel an Haken 13 – nach dem Umfärben in eigenen Abendtönen gemalt, damit das Flaschengrün lesbar bleibt
function coatRamp(tod){ if (tod==='night') return {d:P.k1,s:P.g0,m:P.g1,l:P.g2,h:P.g3,b:P.e2,bl:P.e3,r:P.r0};
  if (tod==='dusk'||tod==='dawn') return {d:P.g0,s:P.g1,m:P.g2,l:P.g3,h:P.g4,b:P.y3,bl:P.y4,r:P.r2};
  return {d:P.g0,s:P.g1,m:P.g2,l:P.g3,h:P.g4,b:P.y3,bl:P.y5,r:P.r3}; }
function paintCoat(b,tod){ var x=HK13, y=COAT.Y0+35, C=coatRamp(tod);
  b.px(x,y,P.k1); b.px(x-1,y+1,P.k1); b.px(x+1,y+1,P.k1);
  b.poly([[x-5,y+2],[x+5,y+2],[x+7,y+5],[x+8,y+25],[x-8,y+25],[x-7,y+5]],function(xx,yy){ var u=xx-(x-8); var c=u<2?C.l:(u<5?C.m:(u<12?C.m:C.s)); if (u>=14) c=C.d;
    if ((xx===x-3||xx===x+4) && yy>y+9) c=C.s; if (xx===x-4 && yy>y+10 && yy<y+22) c=C.l; return c; });
  b.vl(x-7,y+5,y+21,C.h); b.vl(x-6,y+4,y+8,C.h); b.hl(x-4,x-1,y+2,C.h);
  b.poly([[x-4,y+2],[x+4,y+2],[x+1,y+10],[x-1,y+10]],C.s); b.vl(x,y+3,y+10,C.d); b.px(x-3,y+3,C.r); b.px(x+3,y+3,C.r); b.px(x-2,y+4,C.r);
  b.vl(x+7,y+6,y+21,C.d); b.hl(x-8,x-5,y+21,C.d); b.hl(x+5,x+8,y+21,C.d); b.px(x-7,y+20,C.b); b.px(x+7,y+20,C.b);
  for (var k=0;k<4;k++){ b.px(x-2,y+12+k*3,C.bl); b.px(x+2,y+12+k*3,C.b); }
  b.hl(x-6,x-3,y+17,C.d); b.px(x-6,y+16,C.h); b.hl(x-8,x+8,y+25,C.d); b.hl(x-7,x+7,y+24,C.s); }
function photoHotel(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return M.rampAt(M.R('e2 e3 e4 s4'),0.95-(yy-y)/h*0.6,xx,yy); });
  b.rect(x+5,y+6,w-10,h-8,P.e2); b.rect(x+6,y+7,w-12,h-10,P.e3); for (var r=0;r<4;r++) for (var c=0;c<5;c++) b.px(x+7+c*3,y+8+r*3,P.e1);
  b.rect(x+4,y+5,w-8,1,P.e1); b.rect(x+9,y+3,w-18,2,P.e1); b.rect(x+11,y+h-4,3,3,P.e0);
  for (var k=0;k<2;k++){ var px=k?x+w-3:x+2; b.vl(px,y+9,y+h-2,P.e0); b.line(px,y+9,px-2,y+7,P.e1); b.line(px,y+9,px+2,y+7,P.e1); b.px(px-1,y+8,P.e0); b.px(px+1,y+8,P.e0); }
  b.hl(x,x+w-1,y+h-2,P.e2); b.hl(x,x+w-1,y+h-1,P.e1); }
// Gruppenbild des Personals 1965: hinten stehend, vorn sitzend, in der Mitte der Portier in Grün
function photoStaff(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return M.rampAt(M.R('s2 s3 s4'),0.9-(yy-y)/h*0.7,xx,yy); }); b.rect(x,y+h-3,w,3,P.s2);
  for (var i=0;i<8;i++){ var cx=x+3+i*4; b.px(cx,y+3,P.k2); b.px(cx,y+4,P.s5); b.rect(cx-1,y+5,3,4,i===4?P.g1:P.k2); b.px(cx,y+5,P.s5); }
  for (i=0;i<7;i++){ var cx2=x+5+i*4; b.px(cx2,y+7,P.k2); b.px(cx2,y+8,P.s5); b.rect(cx2-1,y+9,3,3,i===3?P.g1:P.m1); b.px(cx2,y+9,P.s5); b.px(cx2-1,y+12,P.k2); b.px(cx2+1,y+12,P.k2); }
  b.px(x+18,y+9,P.y3); }
// Tanzfoto: Bruno und Danica im Salon, schwarz-weiß (er im dunklen Anzug, sie im hellen Kleid)
var COUPLE=M.stamp([
"..............",
"....kk...hh...",
"...kkpp.hhph..",
"...kkpp..pph..",
"....pp...pp...",
"...kkkk.ssss..",
"..kkkkkksssSs.",
"..kkkpkksssss.",
"..kkkk.kksSss.",
"...kkk..sssss.",
"...kkk..sssss.",
"...kkk.sssssS.",
"...kkk.ssssssS",
"...k.k.sssSsss",
"...k.k.sssssss",
"...k.k.ssssss.",
"..kk.kk.......",
".............."],{k:P.k1,h:P.k2,p:P.s4,s:P.s5,S:P.s6});
function photoDance(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ var d=Math.hypot(xx-x-w/2,(yy-y-3)*0.8)/w; return M.rampAt(M.R('m0 m1 m2 m3 m4'),0.75-d*0.9+(yy-y)/h*0.1,xx,yy); });
  b.px(x+(w>>1),y+1,P.s6); b.px(x+(w>>1)-1,y+2,P.s5); b.px(x+(w>>1)+1,y+2,P.s5); b.px(x+(w>>1),y+3,P.m4);
  b.blit(COUPLE,x+1,y+3); b.hl(x,x+w-1,y+h-1,P.m1); }

// ---------------------------------------------------------------- Fenster in der rechten Wand, Standuhr, Pendellampen, Kette
function paintWindowR(b,out,sky){ var q=M.wallQuad(SPEC,'R',WIN.u0,WIN.u1,WIN.Y0,WIN.Y1);
  var oq=M.wallQuad(SPEC,'R',WIN.u0-1.5,WIN.u1+1.5,WIN.Y0-2,WIN.Y1+2); b.poly(oq,P.w1);
  b.poly(q,function(x,y){ sky[y*W+x]=1; return out.get(clamp(x-56,180,319),clamp(y+2,0,143)); });
  var t0=M.wallPt(SPEC,'R',(WIN.u0+WIN.u1)/2,WIN.Y0), t1=M.wallPt(SPEC,'R',(WIN.u0+WIN.u1)/2,WIN.Y1); b.line(rd(t0[0]),rd(t0[1]),rd(t1[0]),rd(t1[1]),P.w0);
  var m0=M.wallPt(SPEC,'R',WIN.u0,30), m1=M.wallPt(SPEC,'R',WIN.u1,30); b.line(rd(m0[0]),rd(m0[1]),rd(m1[0]),rd(m1[1]),P.w0);
  var s0=M.wallPt(SPEC,'R',WIN.u0-2,WIN.Y1+2), s1=M.wallPt(SPEC,'R',WIN.u1+2,WIN.Y1+2); b.line(rd(s0[0]),rd(s0[1]),rd(s1[0]),rd(s1[1]),P.w4);
  var c0=M.wallQuad(SPEC,'R',WIN.u1+1.5,WIN.u1+6,WIN.Y0-5,WIN.Y1+12); b.poly(c0,function(x,y){ return ((x+((y>>2)&1))%3===0)?P.r1:P.r2; });
  var c1=M.wallQuad(SPEC,'R',WIN.u0-5,WIN.u0-1.5,WIN.Y0-5,WIN.Y1+10); b.poly(c1,function(x,y){ return ((x+((y>>2)&1))%3===0)?P.r0:P.r1; });
  var rod0=M.wallPt(SPEC,'R',WIN.u0-6,WIN.Y0-6), rod1=M.wallPt(SPEC,'R',WIN.u1+7,WIN.Y0-6); b.line(rd(rod0[0]),rd(rod0[1]),rd(rod1[0]),rd(rod1[1]),P.y2); }
function clockHands(tod){ return tod==='night'?[1,48]:(tod==='dusk'?[7,22]:(tod==='dawn'?[6,10]:[11,5])); }
function paintClock(b,tod){ var p=R3.p, a=p(CLK.X0,CLK.Y0,CLK.Z), c=p(CLK.X1,ST.Yt,CLK.Z), x0=rd(a[0]), x1=rd(c[0]), y0=rd(a[1]), y1=rd(c[1]), w=x1-x0;
  b.rect(x0+1,y0+4,w-2,y1-y0-4,P.w2); b.vl(x0+1,y0+4,y1-1,P.w4); b.vl(x1-2,y0+4,y1-1,P.w0);
  b.rect(x0,y0+2,w,14,P.w3); b.hl(x0,x1-1,y0+2,P.w5); b.vl(x0,y0+2,y0+15,P.w4); b.vl(x1-1,y0+2,y0+15,P.w1); b.poly([[x0-1,y0+2],[x0+w/2,y0-2],[x1+1,y0+2]],P.w3); b.px(x0+(w>>1),y0-3,P.y4); b.hl(x0-1,x1,y0+16,P.w1);
  var cx=x0+w/2, cy=y0+9; b.ellipse(cx,cy,4.8,4.8,P.y3); b.ellipse(cx,cy,3.7,3.7,P.s5); b.px(rd(cx)-2,rd(cy)-3,P.s6);
  for (var i=0;i<12;i++){ var an=i/12*Math.PI*2; b.px(rd(cx-0.5+Math.cos(an)*3.1),rd(cy-0.5+Math.sin(an)*3.1),P.s2); }
  var hm=clockHands(tod), ha=((hm[0]%12)+hm[1]/60)/12*Math.PI*2-Math.PI/2, ma=hm[1]/60*Math.PI*2-Math.PI/2;
  b.line(rd(cx-0.5),rd(cy-0.5),rd(cx-0.5+Math.cos(ma)*3),rd(cy-0.5+Math.sin(ma)*3),P.k1); b.line(rd(cx-0.5),rd(cy-0.5),rd(cx-0.5+Math.cos(ha)*2),rd(cy-0.5+Math.sin(ha)*2),P.k1);
  b.rect(x0+3,y0+19,w-6,y1-y0-29,P.k1); b.hl(x0+3,x1-4,y0+19,P.w0); b.vl(x0+3,y0+19,y1-11,P.w1);
  b.rect(x0,y1-8,w,8,P.w3); b.hl(x0,x1-1,y1-8,P.w4); b.rect(x0+2,y1-6,w-4,4,P.w2);
  CACHE.pend=[rd(cx-0.5),y0+20,y1-y0-32]; }
function paintPendants(b){ PEND.forEach(function(pp){ var x=rd(SX(pp[0],pp[2])), y=rd(SY(pp[1],pp[2])), r=4.6*K(pp[2])/1.4;
  for (var yy=0;yy<y-6;yy++) b.px(x,yy,(yy%3)?P.y1:P.y0); b.rect(x-2,y-7,5,3,P.y2); b.hl(x-2,x+2,y-7,P.y3);
  b.ellipse(x+0.5,y+0.5,r,r*0.95,P.s4); b.ellipse(x,y,r*0.7,r*0.65,P.s5); b.ellipse(x-1,y-1,r*0.3,r*0.3,P.s6); b.hl(x-2,x+2,rd(y+r),P.s2); b.px(x,rd(y+r)+1,P.y2); }); }
function paintChain(b,S){ var Yc=ST.Yt-14, a=R3.p(ST.X0+1,Yc,ST.Zt), e=R3.p(ST.X1,Yc,ST.Zt);
  if (S.chainOff){ for (var i=0;i<14;i++) b.px(rd(a[0])+1+(i&1),rd(a[1])+i,i%2?P.m2:P.m4); b.px(rd(a[0])+1,rd(a[1])+14,P.m3); return; }
  var n=Math.round(e[0]-a[0]); for (var j=0;j<=n;j++){ var t=j/n, x=rd(a[0]+j), y=rd(lerp(a[1],e[1],t)+Math.sin(Math.PI*t)*4); b.px(x,y,(j&1)?P.m2:P.m4); if (!(j&1)) b.px(x,y+1,P.m1); }
  var mx=rd((a[0]+e[0])/2), my=rd((a[1]+e[1])/2+4), sw=M.microWidth('ZATVORENO')+4, sx=mx-(sw>>1);
  b.line(mx-6,my,sx+3,my+2,P.m3); b.line(mx+6,my,sx+sw-4,my+2,P.m3);
  b.rect(sx,my+2,sw,7,P.s5); b.hl(sx,sx+sw-1,my+2,P.s6); b.hl(sx,sx+sw-1,my+8,P.s2); b.vl(sx,my+2,my+8,P.r2); b.vl(sx+sw-1,my+2,my+8,P.r2);
  M.microText(b,'ZATVORENO',sx+2,my+3,P.r1); }

// ---------------------------------------------------------------- Bild
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), weather=M.scn.weather(GS), sky=new Uint8Array(W*144), out=outside(tod,weather);
  M.box(b,{vp:SPEC.vp,rect:SPEC.rect, back:function(u,v,x,y){ return backWall(x,y); }, side:function(u,v,x,y){ return rightWall(u,v); }, floor:function(xb,d,x,y){ return floorCol(x,y); } });
  paintWallThings(b,S,tod,out,sky);
  paintLodgeInside(b);
  paintWindowR(b,out,sky);
  paintClock(b,tod);
  paintStair(b,S);
  paintChain(b,S);
  paintPendants(b);
  var notSky=function(x,y){ return !sky[y*W+x]; };
  var ctc=M.lf.sum(M.lf.pool(96,118,58,4,-1.2),M.lf.pool(50,110,26,3,-1),M.lf.pool(TAB.x0+14,TAB.base+1,40,4,-1.2),M.lf.pool(282,116,42,6,-0.8));
  if (tod==='night') M.light(b,M.lf.sum(ctc,M.lf.vignette(W,144,1.6),M.lf.pool(TAB.x0+14,112,48,30,0.8),M.lf.pool(TAB.x0+14,128,6,14,0.8),M.lf.pool(225,104,18,30,0.5),M.lf.k(-0.35)),0,0,notSky);
  else { var p0=SX(PEND[0][0],PEND[0][2]), p1=SX(PEND[1][0],PEND[1][2]);
    M.light(b,M.lf.sum(ctc,M.lf.vignette(W,144,1.5),M.lf.pool(p0,60,70,70,0.5),M.lf.pool(p1,60,70,70,0.5),M.lf.pool(p0,124,7,22,0.9),M.lf.pool(p1,124,7,22,0.9),M.lf.pool(TAB.x0+14,112,40,24,0.5),M.lf.pool(133,104,5,14,0.6),M.lf.pool(268,124,5,12,0.6),M.lf.k(-0.1)),0,0,notSky); }
  shade(b,0,0,tod,lightsFor(tod),function(x,y){ return !!sky[y*W+x]; });
  if (tod!=='day') afterLights(b,tod);
  LASTBG=b; return b; }
function afterLights(b,tod){ var ex=ENT.X0, ew=ENT.X1-ENT.X0, ey=ENT.Y0;
  paintCoat(b,tod);
  b.rect(ex+4,ey-10,ew-8,7,P.g4); b.hl(ex+4,ex+ew-5,ey-10,P.g5); b.hl(ex+4,ex+ew-5,ey-4,P.g3); M.microText(b,'IZLAZ',ex+((ew-19)>>1),ey-9,P.s6);
  for (var yy=ey-15;yy<ey+1;yy++) for (var xx=ex-1;xx<ex+ew+1;xx++){ var d=Math.hypot((xx-ex-ew/2)/15,(yy-ey+6.5)/7); if (d<1 && (yy<ey-10||yy>ey-4||xx<ex+4||xx>ex+ew-5) && bayer(xx,yy)<(1-d)*0.55) b.px(xx,yy,tod==='night'?P.g1:M.UP[b.get(xx,yy)]); }
  if (tod==='night') return;
  PEND.forEach(function(pp){ var x=rd(SX(pp[0],pp[2])), y=rd(SY(pp[1],pp[2])), r=4.6*K(pp[2])/1.4; b.ellipse(x+0.5,y+0.5,r,r*0.95,P.y4); b.ellipse(x,y,r*0.7,r*0.65,P.y5); b.ellipse(x-1,y-1,r*0.3,r*0.3,P.l1); b.hl(x-2,x+2,rd(y+r),P.y3); });
  [148.5,241].forEach(function(cx){ var x=Math.round(cx); b.poly([[x-6,40],[x-2,40],[x-3,45],[x-5,45]],P.y4); b.poly([[x+2,40],[x+6,40],[x+5,45],[x+3,45]],P.y4); b.hl(x-6,x-2,40,P.y5); b.hl(x+2,x+6,40,P.y5); b.px(x-4,44,P.l0); b.px(x+4,44,P.l0); });
  CACHE.newel.forEach(function(g){ b.ellipse(g[0]+0.5,g[1],g[2],g[2],P.y4); b.px(g[0],g[1]-1,P.l1); b.px(g[0]-1,g[1],P.y5); });
  var l=CACHE.llamp; b.poly([[l[0]-3,l[1]-1],[l[0]+4,l[1]-1],[l[0]+1.5,l[1]-4],[l[0]-0.5,l[1]-4]],P.g4); b.hl(rd(l[0])-2,rd(l[0])+2,rd(l[1]),P.y5); }

// ---------------------------------------------------------------- Ebenen: Loge (Glas, Brüstung), Tresen, Lesetisch, Sessel, Palmen
function finishLayer(L,tod,pre){ if (pre) M.light(L,pre,L.ox,L.oy); shade(L,L.ox,L.oy,tod,lightsFor(tod)); }
function lodgeLayer(S,tod){ var L=LODGE, p=R3.p, a=M.layer(28,44,76,68,rd(SY(FY,L.Z1))+1), w=M.lw(a);
  var fx0=SX(L.X0,L.Z1), fx1=SX(L.X1,L.Z1), fyT=SY(L.Y0,L.Z1), fyG=SY(52,L.Z1), fyP=SY(74,L.Z1), fyB=SY(FY,L.Z1);
  w.poly([p(L.X1,L.Y0,0),p(L.X1,L.Y0,L.Z1),p(L.X1,FY,L.Z1),p(L.X1,FY,0)],function(x,y){ var Z=(VX-L.X1)/(VX-x)*F-F, Y=VY+(y-VY)/K(Z);
    if (Y<52) return Y<49?P.w3:P.w1; if (Y>=74){ return Y<75?P.w4:(Y>93?P.w0:((Math.floor(Z/6)&1)?P.w1:P.w2)); }
    if (Z%9<1.2) return P.w1; if (Z>12 && Z<13.4) return P.y3; return (((x*3+y)%9)===0 && bayer(x,y)<0.3)?P.s4:T; });
  for (var y=Math.floor(fyT);y<Math.ceil(fyB);y++) for (var x=Math.floor(fx0);x<Math.ceil(fx1);x++){ var c=T, u=x-fx0;
    if (y<fyG){ c=(y<fyT+1)?P.w4:((y>fyG-1.2)?P.y2:P.w1); }
    else if (y<fyP){ var mu=u%12.6; if (mu<1.3||u>fx1-fx0-1.4) c=P.w1; else if (mu<1.9) c=P.y2;
      else { var rf=((x*0.6-y)%22+22)%22; if (rf<1.1 && y>fyG+3) c=P.s4; else if (rf>=1.1 && rf<2.4 && y>fyG+4 && bayer(x,y)<0.5) c=P.s3; else if (y<fyG+1.2) c=P.w0; } }
    else { if (y<fyP+1.2) c=P.w4; else if (y<fyP+2.2) c=P.w0; else if (y>fyB-3) c=P.w0; else { var pu=u%15.6, pv=y-fyP-2; c=P.w1; if (pu>2&&pu<13.6&&pv>2&&pv<fyB-fyP-6){ c=P.w2; if (pu<3||pv<3) c=P.w3; if (pu>12.6||pv>fyB-fyP-7) c=P.w0; } } }
    if (c!==T) a.px(x-a.ox,y-a.oy,c); }
  var sw=M.microWidth('PORTIR'); w.rect(rd((fx0+fx1)/2-sw/2)-2,rd(fyT)+1,sw+4,6,P.w0); w.micro('PORTIR',rd((fx0+fx1)/2-sw/2),rd(fyT)+1,P.y4);
  finishLayer(a,tod,tod==='night'?M.lf.k(-0.4):null); return a; }
function deskLayer(S,tod){ var D=DESK, p=R3.p, a=M.layer(48,64,104,56,rd(SY(FY,D.Z1))+1), w=M.lw(a), box={poly:function(pts,c){ w.poly(pts,c); }};
  R3.box(box,D.X0,D.X1,D.Y0,FY,D.Z0,D.Z1,{
    top:function(x,y){ var t=(y-SY(D.Y0,D.Z0))/(SY(D.Y0,D.Z1)-SY(D.Y0,D.Z0)+0.01); return t>0.65?P.w5:(((x>>2)&1)?P.w3:P.w4); },
    right:P.w0,
    front:function(x,y){ var Y=VY+(y-VY)/K(D.Z1), X=Xat(x,D.Z1), u=X-D.X0;
      if (Y<76.4) return P.w4; if (Y<77.6) return P.w2; if (Y<78.6) return P.w0;
      if (Y<82){ return ((Math.floor(X*1.5)%5)<2)?P.w0:P.w1; }
      if (Y<83) return P.w3; if (Y>=93) return Y<94?P.w2:P.w0;
      var pu=u%12.4, pv=Y-83;
      if (pu<1.3) return P.w0; if (pu<2.4) return P.w3;
      if (pu>3.5 && pu<11.4 && pv>1.5 && pv<8.6){ if (pu<4.6||pv<2.6) return P.w3; if (pu>10.4||pv>7.6) return P.w0; return ((Math.floor(X)*7+Math.floor(Y)*3)%11===0)?P.w1:P.w2; }
      return P.w1; } });
  var sw=M.microWidth('RECEPCIJA')+4, cx=rd(SX((D.X0+D.X1)/2,D.Z1)), sy=rd(SY(78.4,D.Z1)); w.rect(cx-(sw>>1),sy,sw,7,P.y3); w.hl(cx-(sw>>1),cx-(sw>>1)+sw-1,sy,P.y5); w.hl(cx-(sw>>1),cx-(sw>>1)+sw-1,sy+6,P.y1); w.micro('RECEPCIJA',cx-(sw>>1)+2,sy+1,P.w0);
  var bl=p(96,D.Y0,40), bx=rd(bl[0]), by=rd(bl[1]); w.hl(bx-3,bx+4,by+1,P.w1); w.ellipse(bx+0.5,by-1,3,2.6,P.y3); w.hl(bx-2,bx+3,by,P.y1); w.px(bx-1,by-2,P.y5); w.px(bx,by-3,P.y4); w.px(bx+1,by-4,P.y2); w.px(bx+2,by-1,P.y1);
  var gb=p(110,D.Y0,40), gb2=p(124,D.Y0,40); w.poly([[gb[0],gb[1]],[gb2[0],gb2[1]],[gb2[0]+1,gb2[1]+1.6],[gb[0]-1,gb[1]+1.6]],P.s5); w.vl(rd((gb[0]+gb2[0])/2),rd(gb[1]),rd(gb[1])+1,P.s2); w.hl(rd(gb[0])+2,rd(gb[0])+7,rd(gb[1])+1,P.s3); w.hl(rd(gb2[0])-7,rd(gb2[0])-2,rd(gb2[1])+1,P.s3);
  w.line(rd(gb2[0])+2,rd(gb2[1]),rd(gb2[0])+5,rd(gb2[1])-4,P.k1); w.px(rd(gb2[0])+5,rd(gb2[1])-4,P.y3);
  var lm=p(140,D.Y0,39), lx=rd(lm[0]), ly=rd(lm[1]); w.rect(lx-2,ly-1,5,2,P.y1); w.hl(lx-2,lx+2,ly-1,P.y3); w.vl(lx,ly-9,ly-2,P.y2); w.poly([[lx-6,ly-9],[lx+6,ly-9],[lx+5,ly-12],[lx-5,ly-12]],P.g2); w.hl(lx-5,lx+5,ly-12,P.g4); w.hl(lx-6,lx+6,ly-9,P.g1); w.px(lx-3,ly-11,P.g5);
  finishLayer(a,tod,tod==='night'?M.lf.sum(M.lf.k(-0.4),M.lf.pool(TAB.x0+14,110,60,30,0.5)):M.lf.pool(133,74,26,14,0.5));
  if (tod==='dusk'||tod==='dawn'){ w.hl(lx-5,lx+5,ly-8,P.y4); w.hl(lx-3,lx+3,ly-7,P.y5); w.hl(lx-5,lx+5,ly-12,P.g4); w.px(lx-3,ly-11,P.g5); w.px(lx-2,ly-10,P.g4); }
  return a; }
function readingLayers(S,tod){ var out=[], x0=TAB.x0, x1=TAB.x1, ty=TAB.top, by=TAB.base, xm=(x0+x1)>>1;
  var t=M.layer(144,96,36,44,by), w=M.lw(t);
  w.poly([[x0,ty],[x1,ty],[x1-3,ty-4],[x0+3,ty-4]],P.w3); w.hl(x0+3,x1-3,ty-4,P.w4); w.rect(x0,ty,x1-x0+1,3,P.w2); w.hl(x0,x1,ty,P.w4); w.hl(x0,x1,ty+3,P.w0);
  w.rect(x0+2,ty+3,2,by-ty-3,P.w1); w.rect(x1-3,ty+3,2,by-ty-3,P.w1); w.vl(x0+2,ty+3,by-1,P.w2); w.rect(x0+6,ty+2,2,by-ty-7,P.w0); w.rect(x1-7,ty+2,2,by-ty-7,P.w0); w.hl(x0+4,x1-4,by-6,P.w1);
  w.px(x0+2,by-1,P.y2); w.px(x1-3,by-1,P.y2);
  w.poly([[x0+4,ty-1],[x0+13,ty-1],[x0+12,ty-3],[x0+5,ty-3]],P.e3); w.hl(x0+5,x0+12,ty-3,P.e4); w.px(x0+8,ty-2,P.r2); w.px(x0+9,ty-2,P.r2);
  w.poly([[x1-12,ty-1],[x1-4,ty-1],[x1-5,ty-3],[x1-11,ty-3]],P.s5); w.hl(x1-10,x1-6,ty-2,P.s3);
  w.rect(xm-2,ty-6,5,2,P.y1); w.hl(xm-2,xm+2,ty-6,P.y3); w.vl(xm,ty-17,ty-6,P.y2); w.vl(xm+1,ty-16,ty-7,P.y1);
  w.poly([[xm-7,ty-17],[xm+8,ty-17],[xm+5,ty-25],[xm-4,ty-25]],P.r2); w.hl(xm-4,xm+5,ty-25,P.r3); w.hl(xm-7,xm+8,ty-17,P.r1);
  for (var fx=xm-7;fx<=xm+8;fx+=2) w.px(fx,ty-16,P.y2);
  finishLayer(t,tod,M.lf.pool(xm,ty,30,20,0.4));
  if (tod!=='day'){ w.poly([[xm-7,ty-17],[xm+8,ty-17],[xm+5,ty-25],[xm-4,ty-25]],function(x,y){ return (y>ty-19)?P.y5:(bayer(x,y)<0.5?P.y4:P.d5); }); w.hl(xm-4,xm+5,ty-25,P.y4); w.hl(xm-7,xm+8,ty-17,P.l0);
    for (var fx2=xm-7;fx2<=xm+8;fx2+=2) w.px(fx2,ty-16,P.y4); w.hl(xm-3,xm+4,ty-6,P.y4); w.hl(x0+4,x1-4,ty-4,P.y3); }
  CACHE.rlamp=[xm,ty-17]; out.push(t);
  [[118,1],[178,-1]].forEach(function(s){ var ax=s[0], dir=s[1], by=TAB.base+2, L=M.layer(ax-4,96,40,48,by), w2=M.lw(L), R=M.R('r0 r1 r2 r3 r4');
    function X(dx){ return dir>0?ax+dx:ax+26-dx; }
    function hl(a,z,y,c){ w2.hl(Math.min(X(a),X(z)),Math.max(X(a),X(z)),y,c); }
    function rc(a,y,wd,h,c){ var x0=Math.min(X(a),X(a+wd-1)); w2.rect(x0,y,wd,h,c); }
    // Rückenlehne (gerundet)
    rc(0,by-31,8,20,R[1]); w2.ellipse(X(4)+0.5,by-31,4,3,R[2]); w2.ellipse(X(4)+0.5,by-31.5,2.5,1.5,R[3]); w2.vl(X(0),by-30,by-12,R[0]); w2.vl(X(6),by-29,by-13,R[2]); w2.vl(X(7),by-28,by-14,R[0]);
    // Sitzkasten mit Messingnägeln
    rc(2,by-13,23,10,R[1]); hl(2,24,by-13,R[3]); hl(2,24,by-12,R[2]); hl(2,24,by-4,R[0]); for (var k=0;k<6;k++) w2.px(X(4+k*4),by-11,P.y3);
    // Armlehne (nah) mit gerollter Vorderkante
    rc(1,by-20,24,6,R[2]); hl(1,24,by-20,R[4]); hl(1,24,by-19,R[3]); hl(1,24,by-15,R[1]); hl(2,23,by-14,R[0]);
    w2.ellipse(X(24)+0.5,by-17,3,3.4,R[2]); w2.ellipse(X(24)+0.5,by-17,1.4,1.6,R[1]); w2.px(X(24),by-20,R[4]);
    // kurze Füße
    rc(3,by-3,2,3,P.w1); rc(21,by-3,2,3,P.w1); w2.px(X(3),by-1,P.y3); w2.px(X(21),by-1,P.y3);
    finishLayer(L,tod,tod==='night'?M.lf.sum(M.lf.k(-0.2),M.lf.pool(TAB.x0+14,TAB.top,40,24,0.6)):null); out.push(L); });
  return out; }
function palmLayer(tod,cx,by,seed,size){ var lx0=cx-32; lx0-=((lx0%4)+4)%4; var L=M.layer(lx0,by-96,64,98,by), w=M.lw(L), r=M.rng(seed);
  w.poly([[cx-12,by-12],[cx+12,by-12],[cx+9,by],[cx-9,by]],function(x,y){ var u=(x-cx+12)/24; return u<0.18?P.y1:(u<0.45?P.y3:(u<0.8?P.y2:P.y1)); });
  w.hl(cx-13,cx+13,by-13,P.y4); w.hl(cx-13,cx+13,by-12,P.y2); w.hl(cx-11,cx+11,by-6,P.y1); w.px(cx-6,by-9,P.y4); w.px(cx+5,by-9,P.y1);
  w.rect(cx-11,by-14,22,1,P.e1);
  for (var k=0;k<3;k++){ var lean=(k-1)*0.35; for (var y=by-14;y>by-14-size*0.55+k*3;y--){ var x=cx+(k-1)*2+Math.round((by-14-y)*lean*0.3); w.px(x,y,P.w1); w.px(x+1,y,(y%3)?P.w2:P.w1); } }
  var fan=16; for (var f=0;f<fan;f++){ var a=-Math.PI*0.94+f/(fan-1)*Math.PI*0.88+(r()-0.5)*0.22, Lf=size*(0.5+r()*0.45), ox=cx+(r()-0.5)*5, oy=by-14-size*0.5+(r()-0.5)*6;
    for (var s=0;s<Lf;s++){ var u=s/Lf, x2=ox+Math.cos(a)*s*1.05, y2=oy+Math.sin(a)*s*0.8+u*u*Lf*0.62, px=Math.round(x2), py=Math.round(y2), side=Math.cos(a)<0?-1:1;
      w.px(px,py,u<0.25?P.g3:P.g4);
      if (s>2 && (s&1)===0){ w.px(px+side,py+1,u<0.6?P.g3:P.g2); w.px(px,py+2,P.g2); w.px(px-side,py+1,(f%3===0&&u<0.5)?P.g5:P.g4); if (u>0.35) w.px(px,py+3,P.g1); if (u>0.55) w.px(px+side,py+4,P.g0); } } }
  finishLayer(L,tod,tod==='night'?M.lf.k(-0.6):null); return L; }
function layers(S,GS,tod){ var out=[lodgeLayer(S,tod),deskLayer(S,tod)]; readingLayers(S,tod).forEach(function(l){ out.push(l); });
  out.push(palmLayer(tod,22,143,91,52)); out.push(palmLayer(tod,306,143,57,44)); return out; }

// ---------------------------------------------------------------- Bewegung: Regen am Glas, Pendel, Lampen
function dyn(fb,v,S,GS){ var weather=M.scn.weather(GS), tod=v.tod;
  if (weather==='rain'){ var ex=ENT.X0, ew=ENT.X1-ENT.X0, ey=ENT.Y0; M.scn.windowRain(fb,ex+2,ey+20,(ew>>1)-4,34,v.t,v.cam); M.scn.windowRain(fb,ex+(ew>>1)+2,ey+20,(ew>>1)-4,34,v.t*1.1+3,v.cam);
    var q=M.wallQuad(SPEC,'R',WIN.u0,WIN.u1,WIN.Y0,WIN.Y1); M.scn.windowRain(fb,rd(q[0][0])+1,rd(q[0][1])+3,rd(q[1][0]-q[0][0])-2,rd(q[3][1]-q[0][1])-6,v.t*0.9+7,v.cam); }
  var pd=CACHE.pend; if (pd){ var ang=Math.sin(v.t*Math.PI)*0.3, x0=pd[0], y0=pd[1], L=pd[2], col=tod==='night'?P.n1:P.y3, rod=tod==='night'?P.k2:P.y1;
    for (var i=0;i<L-2;i++) fb.px(rd(x0+Math.sin(ang)*i),y0+i,rod); var bx=rd(x0+Math.sin(ang)*(L-2)), by=y0+L-2;
    fb.px(bx,by,col); fb.px(bx-1,by,col); fb.px(bx+1,by,col); fb.px(bx,by-1,col); fb.px(bx,by+1,col); fb.px(bx-1,by-1,tod==='night'?P.n2:P.y4); }
  if (tod!=='day'){ var rl=CACHE.rlamp; if (rl) M.glow(fb,rl[0],rl[1]+1,15,v.t,0.32); }
  if (tod==='night' && Math.sin(v.t*13.1)+Math.sin(v.t*7.7)>1.86){ var ex2=ENT.X0, ew2=ENT.X1-ENT.X0, ey2=ENT.Y0; for (var yy=ey2-10;yy<ey2-3;yy++) for (var xx=ex2+4;xx<ex2+ew2-4;xx++){ var sx=xx-v.cam; if (sx>=0&&sx<fb.w) fb.d[yy*fb.w+sx]=M.DN[fb.d[yy*fb.w+sx]]; } } }
function ghost(fb,v,S,GS){ var t=v.t, kx=KEYS.X0+6*KEYS.cw, ky=KEYS.Y0+3*KEYS.ch, a=0.35+Math.sin(t*1.3)*0.2;
  for (var y=ky-3;y<ky+KEYS.ch+4;y++) for (var x=kx-3;x<kx+KEYS.cw+4;x++){ var d=Math.hypot(x-kx-2,y-ky-3.5)/6; if (d<1 && bayer(x+(t*2|0),y)<(1-d)*a){ var k=y*fb.w+x; fb.d[k]=M.UP[fb.d[k]]; } }
  M.dust(fb,t*0.5,32,52,52,44,9,P.x3); }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<100||y>140||x<4||x>316) return false; var f=fl(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (X>RW-3) return false;
  if (X>ST.X0-3 && Z<ST.Zb+3) return false;
  if (Z<LODGE.Z1+1.5 && X<LODGE.X1+1.5) return false;
  if (Z>=DESK.Z0-1.5 && Z<=DESK.Z1+1.5 && X>DESK.X0-3 && X<DESK.X1+2) return false;
  if (y>=TAB.base-6 && x>=112 && x<=212) return false;
  if (y>=130 && (x<36||x>292)) return false;
  return true; }
M.defineArt('palma',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; return levels(tod)[tod==='night'?1:3].a; },
  spots:{
    door:[ENT.X0-3,ENT.Y0-2,ENT.X1-ENT.X0+6,FY-ENT.Y0+2],
    reception:[50,82,94,35],
    lodge:[29,44,72,40],
    bell:[60,77,10,9],
    switchboard:[36,54,18,26],
    pigeonholes:[KEYS.X0-2,KEYS.Y0-4,KEYS.cols*KEYS.cw+5,30],
    drawer:[77,69,13,13],
    phonebook:[78,63,12,6],
    stairs:[250,56,70,62],
    chain:[250,40,40,18],
    hooks:[COAT.X0,COAT.Y0-12,COAT.X1-COAT.X0,52],
    coat13:[HK13-8,COAT.Y0+34,17,27],
    photos:[64,6,38,40],
    photo_dance:[4,34,24,30],
    reading_table:[TAB.x0-2,TAB.top-26,TAB.x1-TAB.x0+5,TAB.base-TAB.top+26],
    armchairs:[114,100,92,40],
    palms:[0,86,48,58],
    register:[REG.X0-1,REG.Y0-3,REG.X1-REG.X0+2,40],
    private:[PRIV.X0-2,PRIV.Y0-11,PRIV.X1-PRIV.X0+4,38],
    window:[278,4,34,52],
    clock:[252,5,16,52]
  },
  stands:{
    door:[225,104,'B'], reception:[100,122,'B'], lodge:[42,116,'B'], bell:[64,122,'B'], switchboard:[42,116,'B'], pigeonholes:[80,122,'B'],
    drawer:[103,110,'L'], phonebook:[103,110,'L'], stairs:[258,120,'R'], chain:[262,120,'B'], hooks:[176,106,'B'], coat13:[HK13,106,'B'],
    photos:[84,122,'B'], photo_dance:[22,116,'B'], reading_table:[161,116,'F'], armchairs:[130,118,'F'], palms:[40,124,'L'],
    register:[138,111,'B'], private:[114,110,'B'], window:[262,122,'R'], clock:[258,120,'B']
  },
  actorPos:{ ljerka:[92,112,'F'], bruno:[54,106,'F','bruno',true,'porter'], ljerkaNight:[114,110,'F'] },
  start:[225,110,'F'], entries:{ map:[225,106,'F'], salon:[262,120,'L'] }
});
})(M);
