/* ===== rooms/art/kula.js — Unter der Sahat-kula (320 px) =====
   Ein kleiner gepflasterter Platz westlich der Baščaršija. Links hinten der schlanke, quadratische Uhrturm aus hellem
   Kalkstein (oben angeschnitten): Bleidach, Glockenstube mit Bogenöffnung, darunter das Zifferblatt mit arabischen Ziffern
   (Mondzeit, alla turca), unten die kleine Holztür mit Eisenbändern und die Marmortafel. Davor die Steinbank.
   Hinten die Mauer des Moscheehofs mit Spitzbogentor und Portaldach, dahinter kahle Platanen, Kuppel und Minarett im Dunst.
   Links ein Laden der Čaršija mit hochgeklappten Kepenci, rechts die Kafana „Kula“: Holzobergeschoss, Ziegeldach,
   Terrasse unter einem Vordach mit zwei Tischen, Kupfertabletts im Fenster, eine eiserne Laterne.
   Die Zeiger stehen in dynamic (S.clock = [h,m], sonst nach Tageszeit). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144, GY=104, HZ=70;                       // Breite, Bildhöhe, Fußlinie hinten, Augenhöhe
var TW={x0:48,xf:69,x1:73};                            // Turm: Vorderseite x0..xf, Seite bis x1
var CLK={cx:58.5,cy:32,r:10};                        // Zifferblatt
var TDOOR={x0:60,x1:68,y0:84};                         // Turmtür
var PLQ={x0:48,x1:56,y0:82,y1:89};                     // Marmortafel
var BENCH={x0:38,x1:82,seat:100,base:112};             // Steinbank vor dem Turm
var WALL={x0:74,x1:212,top:70};                        // Hofmauer
var GATE={x0:124,x1:152,spring:84,apex:73};            // Spitzbogentor
var KAF={x0:212,win:[220,68,38,28],door:[270,64,20,40]};
var CAN={y0:44,fy:47,fb:56,uy:62,posts:[214,316],foot:122};   // Vordach: Ziegel, Blende, Untersicht, Pfosten
var DECK={x0:208,y0:104,y1:121};                       // Holzterrasse
var TABLES=[{x:233,top:104,base:115},{x:303,top:106,base:117}];
var LAMP={x:194,base:112,top:52};
var SHOP={x1:42};
var TREES=[[96,70,1.0,3],[184,70,0.9,9],[146,70,0.7,5]];
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }

// ---------------------------------------------------------------- Licht: weiche Stufen zwischen Tageszeit-Färbung und Lampenlicht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  fdusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.5+L*0.12+14, g*0.48+L*0.12+12, b*0.56+L*0.1+26]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  nfog:function(r,g,b){ var L=lum(r,g,b); return [r*0.16+L*0.15+9, g*0.18+L*0.15+10, b*0.24+L*0.17+15]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,wea){ if (tod==='day') return null; if (tod==='night') return (wea==='fog'||wea==='snow')?'nfog':'night'; if (tod==='dusk' && wea!=='calm') return 'fdusk'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod,wea){ if (tod==='day') return [];
  var fog=wea==='fog', L=[[LAMP.x,LAMP.top+8,fog?40:32,fog?40:34,0.95],[LAMP.x,LAMP.base+6,36,12,0.6],[KAF.win[0]+19,KAF.win[1]+14,30,26,tod==='night'?0.45:0.7],[KAF.win[0]+19,112,32,10,tod==='night'?0.3:0.5],[264,58,40,10,0.35]];
  if (tod!=='night') L.push([KAF.door[0]+10,KAF.door[1]+20,16,22,0.5]);
  L.push([281,70,18,20,0.55]);
  return L; }

// ---------------------------------------------------------------- Tiefe (für Nebel) und Schneeflächen
var DEP=new Uint8Array(W*H), SNOW=new Uint8Array(W*H);
function stage(b,d,fn){ var s=b.d.slice(); fn(); for (var k=0;k<W*H;k++) if (b.d[k]!==s[k]) DEP[k]=d; }
function snowRect(x0,y0,w,h){ for (var y=Math.max(0,y0);y<Math.min(H,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(W,x0+w);x++) SNOW[y*W+x]=1; }

// ---------------------------------------------------------------- Himmel
function paintSky(s,tod,wea){ var x, y;
  if (wea==='fog'||wea==='snow'||wea==='rain'){ M.scn.sky(s,0,0,W,H,tod,wea,41);
    if (tod==='night' && wea!=='rain') for (y=40;y<96;y++) for (x=0;x<W;x++){ var g=(y-40)/56; if (bayer(x,y)<g*0.5) s.px(x,y,g>0.6&&bayer(x+1,y)<0.3?P.d0:P.m1); }   // Stadtschein im Nebel
    return; }
  if (tod==='day'){ var D=R('b1 b2 b3 b4 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(D,0.18+Math.pow(y/96,1.3)*0.8,x,y));
    var r=M.rng(12); for (var i=0;i<5;i++){ var cx=r()*W, cy=6+r()*22, L=30+r()*50; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy+Math.sin(k*0.08+i)*1.4); var a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.28) s.px(xx,yy,P.b5); } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(N,0.06+Math.pow(y/100,1.4)*0.8+(vn(x*0.02,y*0.06,3)-0.5)*0.05,x,y));
    var r2=M.rng(77); for (var j=0;j<170;j++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.5)*70), q=r2(); s.px(sx,sy,q<0.08?P.n5:(q<0.4?P.n4:P.n3)); }
    [[251,9],[118,16],[302,30],[186,6]].forEach(function(p){ s.px(p[0],p[1],P.l1); s.px(p[0]-1,p[1],P.n3); s.px(p[0]+1,p[1],P.n3); s.px(p[0],p[1]-1,P.n3); s.px(p[0],p[1]+1,P.n3); });
    return; }
  M.sky(s,0,0,W,96,tod,17); }

// ---------------------------------------------------------------- Ferne: Kuppel und Minarett der Moschee, kahle Platanen
function paintFar(b){ var x, y;
  // große Bleikuppel hinter den Bäumen (nur der obere Teil schaut heraus)
  var dc=140, dy0=66, dr=24; for (y=dy0-dr;y<dy0;y++) for (x=dc-dr;x<=dc+dr;x++){ var dx=(x-dc)/dr, dy=(y-dy0)/dr; if (dx*dx+dy*dy>1) continue; var u=dx*0.5+0.5, c=u<0.3?P.m4:(u<0.65?P.m3:P.m2); if (((x-dc)*3+60)%9===0 && dy>-0.9) c=M.DN[c]; b.px(x,y,c); }
  b.vl(dc,dy0-dr-6,dy0-dr-1,P.y2); b.px(dc,dy0-dr-7,P.y3); b.px(dc-1,dy0-dr-4,P.y2); b.px(dc+1,dy0-dr-4,P.y2);
  b.rect(dc-dr-6,dy0-4,2*dr+12,6,P.s3); b.hl(dc-dr-6,dc+dr+6,dy0-4,P.s4);
  M.scn.minaret(b,198,72,70,{});
  b.rect(196,64,5,8,P.s3); }
function branch(b,x,y,ang,len,w,dep,r,cols){ var x2=x+Math.cos(ang)*len, y2=y-Math.sin(ang)*len, n=Math.max(1,Math.ceil(len));
  for (var i=0;i<=n;i++){ var t=i/n, px=x+(x2-x)*t, py=y+(y2-y)*t, ww=Math.max(1,w*(1-t*0.35)); for (var k=0;k<ww;k++){ var xx=rd(px-ww/2+k), yy=rd(py); b.px(xx,yy,k===0?cols[2]:(k>=ww-1?cols[0]:cols[1])); } }
  if (dep<=0){ if (r()<0.5) b.px(rd(x2),rd(y2)-1,cols[1]); return; }
  var spread=0.38+r()*0.3, nb=r()<0.3?3:2;
  for (var j=0;j<nb;j++){ var a=ang+(j===0?spread:(j===1?-spread:(r()-0.5)*0.3))+(r()-0.5)*0.2; branch(b,x2,y2,a,len*(0.66+r()*0.14),w*0.62,dep-1,r,cols); } }
function paintTrees(b){ TREES.forEach(function(t,i){ var r=M.rng(t[3]*31+7), cols=[P.e1,P.e2,P.e3], x=t[0], y=t[1];
    branch(b,x,y,Math.PI/2+(r()-0.5)*0.12,16*t[2],5*t[2],5,r,cols);
    // ein paar späte Blätter, gelbbraun
    for (var k=0;k<120*t[2];k++){ var a=r()*Math.PI*2, d=Math.pow(r(),0.6)*30*t[2], lx=rd(x+Math.cos(a)*d*1.3), ly=rd(y-26*t[2]-Math.sin(a)*d*0.8); if (ly>=y-2) continue; if (r()<0.55) b.px(lx,ly,r()<0.5?P.e3:(r()<0.5?P.y2:P.t3)); } }); }

// ---------------------------------------------------------------- Laden der Čaršija (links, angeschnitten)
function paintShop(b,tod){ var x, y, x1=SHOP.x1, night=tod==='night';
  for (y=56;y<GY;y++) for (x=0;x<x1;x++){ var c=tex.plaster(x,y,R('s3 s4 s5'),80); if (x>=x1-2) c=(x===x1-1)?P.s2:P.s3; b.px(x,y,c); }
  // tiefes Dach mit Holzsparren
  for (x=0;x<x1+6;x++){ var e=Math.min(6,x1+6-x); for (y=44;y<56;y++){ var r=y-44, c=(r%3===0)?P.t1:(((x+r)%4===0)?P.t2:P.t3); if (r>=10) c=P.w0; if (x>x1+6-e && y<44+(x-(x1+6-e))) continue; b.px(x,y,c); } }
  for (x=0;x<x1+4;x+=3){ b.vl(x,56,58,P.w1); b.px(x,59,P.w0); }
  for (x=0;x<x1+6;x++){ dk(b,x,56,2); dk(b,x,57,1); }
  // Ladenöffnung: oberer Kepenk hochgeklappt (Vordach), unterer heruntergeklappt (Ablage)
  var o0=4, o1=x1-6, oy0=66, oy1=92;
  for (y=oy0;y<oy1;y++) for (x=o0;x<o1;x++) b.px(x,y,(y<oy0+3)?P.k1:P.k2);
  if (!night){ // Kupfer und Stoffe drinnen
    for (var i=0;i<5;i++){ var cx=o0+4+i*6, cy=oy0+6+(i%2)*5; b.ellipse(cx,cy,2.4,2.4,P.t3); b.px(cx-1,cy-1,P.t5); b.px(cx+1,cy+1,P.t1); b.vl(cx,oy0,cy-3,P.k1); }
    for (x=o0+2;x<o1-2;x+=2){ b.rect(x,oy1-8,2,8,[P.r2,P.y2,P.c2,P.g2,P.r3][(x>>1)%5]); }
    b.rect(o0+1,oy0+12,4,6,P.y2); b.px(o0+2,oy0+12,P.y4); }
  else { for (y=oy0;y<oy1;y++) for (x=o0;x<o1;x++){ b.px(x,y,((y-oy0)%4===0)?P.w0:(((x+y)%9===0)?P.w1:P.w2)); } }
  for (x=o0-2;x<o1+3;x++){ b.px(x,oy0-1,P.w3); b.px(x,oy0-2,P.w2); b.px(x,oy0-3,P.w1); }
  for (x=o0-2;x<o1+2;x++){ b.px(x,oy1,P.w4); b.px(x,oy1+1,P.w2); b.px(x,oy1+2,P.w1); }
  b.vl(o0-2,oy0-3,GY-1,P.w1); b.vl(o1+1,oy0-3,GY-1,P.w0);
  for (y=oy1+3;y<GY;y++) for (x=o0;x<o1;x++) b.px(x,y,((x-o0)%5===0)?P.w0:P.w2);
  snowRect(0,44,x1+6,3); }

// ---------------------------------------------------------------- Hofmauer mit Spitzbogentor
function paintWall(b,tod){ var x, y, x0=WALL.x0, x1=WALL.x1, top=WALL.top, g=GATE;
  var ST=R('s2 s3 s4 s5'), STD=R('s1 s2 s3 s4');
  for (y=top;y<GY;y++) for (x=x0;x<x1;x++){ var c=tex.ashlar(x*1.1,y,(y>GY-8)?STD:ST,10,5); if (fbm(x*0.5,y*0.4,2)>0.68) c=M.UP[c]; if (y>GY-3) c=M.DN[c]; b.px(x,y,c); }
  // Abdeckung aus Steinplatten mit kleinem Ziegeldach
  for (x=x0-1;x<x1+1;x++){ b.px(x,top-3,(x%4===0)?P.t2:P.t3); b.px(x,top-2,(x%4===2)?P.t4:P.t3); b.px(x,top-1,P.s5); b.px(x,top,P.s4); dk(b,x,top+1,2); dk(b,x,top+2,1); }
  snowRect(x0-1,top-3,x1-x0+2,2);
  // Laufspuren und dunkle Kruste unter der Abdeckung
  for (x=x0;x<x1;x++){ var d=2+rd(fbm(x*0.7,3,4)*4); for (y=top+2;y<top+2+d;y++) if (bayer(x,y)<0.5*(1-(y-top-2)/d)) dk(b,x,y,1); if (fbm(x*1.9,7,5)>0.66){ var L=8+rd(fbm(x,11,6)*14); for (y=top+3;y<top+3+L;y++) if (bayer(x,y)<0.4*(1-(y-top-3)/L)) dk(b,x,y,1); } }
  // Portal: Rahmen, ragt über die Mauer, mit Dächlein und Inschrifttafel
  var px0=g.x0-5, px1=g.x1+5, ptop=60;
  for (y=ptop;y<GY;y++) for (x=px0;x<px1;x++){ var c2=tex.ashlar(x*1.3+5,y,ST,8,4); if (x===px0) c2=P.s5; if (x===px1-1) c2=P.s2; b.px(x,y,c2); }
  for (x=px0-2;x<px1+2;x++){ b.px(x,ptop-4,(x%3===0)?P.t1:P.t3); b.px(x,ptop-3,(x%3===1)?P.t4:P.t3); b.px(x,ptop-2,P.t2); b.px(x,ptop-1,P.s5); dk(b,x,ptop,2); }
  for (x=px0;x<px1;x++){ var ty=ptop-6+Math.round(Math.abs(x-(px0+px1)/2)*0.2); for (y=ty;y<ptop-4;y++) b.px(x,y,(y===ty)?P.t4:P.t2); }
  snowRect(px0-2,ptop-8,px1-px0+4,4);
  b.rect(g.x0+3,ptop+2,g.x1-g.x0-6,8,P.s5); b.hl(g.x0+3,g.x1-4,ptop+2,P.s6); b.hl(g.x0+3,g.x1-4,ptop+9,P.s2); b.vl(g.x1-4,ptop+2,ptop+9,P.s3);
  for (var q=0;q<3;q++) for (x=g.x0+5;x<g.x1-5;x++){ var yy=ptop+4+q*2; if (hash(x,yy)<0.55 && ((x+q)%5)) b.px(x,yy,(hash(x,q)<0.5)?P.k2:P.w0); }   // Kalligraphie
  // Spitzbogen: Keilsteine, dunkle Durchfahrt, hinten der helle Hof
  var cx=(g.x0+g.x1)/2, hw=(g.x1-g.x0)/2;
  function inArch(xx,yy,ext){ var dx=Math.abs(xx+0.5-cx); if (dx>hw+ext) return false; if (yy>=g.spring) return yy<GY; var R0=hw*1.6+ext, ccx=cx+(xx<cx?hw*0.6:-hw*0.6); var ddx=xx+0.5-ccx, ddy=yy-g.spring; return ddx*ddx+ddy*ddy<R0*R0 && yy>=g.apex-ext; }
  for (y=g.apex-3;y<GY;y++) for (x=g.x0-3;x<g.x1+3;x++){ if (!inArch(x,y,2.6) || inArch(x,y,0)) continue; var a=Math.atan2(g.spring-y,x-cx), q2=Math.round(a/(Math.PI/9)); var c3=((q2+40)%2)?P.s5:P.s4; if (Math.abs(a/(Math.PI/9)-q2)<0.12) c3=P.s2; if (x>cx+hw) c3=M.DN[c3]; b.px(x,y,c3); }
  for (y=g.apex;y<GY;y++) for (x=g.x0;x<g.x1;x++){ if (!inArch(x,y,0)) continue; var depth=(y-g.apex)/(GY-g.apex), c4=P.k1;
    if (y>GY-9){ c4=(y>GY-4)?P.s2:P.s3; if (x<g.x0+4||x>g.x1-5) c4=P.k2; }
    else if (y>g.spring+2 && x>g.x0+7 && x<g.x1-7){ c4=(y>GY-16)?P.m2:P.m1; if (x===rd(cx)+3 && y>GY-20) c4=P.e1; }   // Hof: Arkade im Schatten, ein Baumstamm
    else if (x<g.x0+5||x>g.x1-6) c4=((x+y)%3===0)?P.w0:P.w1;   // offene Torflügel
    if (y<g.spring && depth<0.18) c4=P.k0; b.px(x,y,c4); }
  for (var a2=0;a2<3;a2++){ b.px(g.x0+2,90+a2*4,P.k1); b.px(g.x1-3,90+a2*4,P.k1); }
  // Splitternarben, beiläufig
  [[92,90],[103,84],[171,93],[186,80],[198,95]].forEach(function(p,i){ b.px(p[0],p[1],P.s1); b.px(p[0]+1,p[1],P.s2); if (i%2) b.px(p[0],p[1]+1,P.s2); b.px(p[0]-1,p[1]-1,P.s5); });
  // Česma: Brunnen in der Mauer, weiße Steinplatte mit Spitzbogennische, Kupferrohr und Becken
  var fx0=168, fx1=182, fy0=77; for (y=fy0;y<GY-1;y++) for (x=fx0;x<fx1;x++){ var c5=(x===fx0)?P.s6:((x===fx1-1)?P.s3:P.s5); if (y===fy0) c5=P.s6; b.px(x,y,c5); }
  for (y=fy0+3;y<fy0+15;y++) for (x=fx0+3;x<fx1-3;x++){ var ndx=Math.abs(x+0.5-(fx0+fx1)/2); if (y<fy0+7 && ndx>(y-fy0-2)*0.9) continue; b.px(x,y,(x===fx0+3)?P.s2:P.s3); }
  b.hl(fx0+5,fx0+8,fy0+12,P.t3); b.px(fx0+8,fy0+12,P.t5); b.px(fx0+8,fy0+13,P.t2);
  for (x=fx0-2;x<fx1+2;x++){ b.px(x,GY-8,P.s6); b.px(x,GY-7,P.s4); for (y=GY-6;y<GY-1;y++) b.px(x,y,(x===fx0-2)?P.s4:((x>=fx1)?P.s2:P.s3)); }
  b.hl(fx0-1,fx1,GY-8,P.a3); b.px(fx0+2,GY-8,P.a5);
  CESMA=[fx0+8,fy0+13,GY-8];
  // zwei Tauben auf dem Portaldach (statisch)
  [[131,ptop-7],[147,ptop-6]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); b.px(p[0]+2,p[1]-1,P.m2); }); }

// ---------------------------------------------------------------- Sahat-kula
var DIG={ '1':['.#.','.#.','.#.'], '2':['#.#','##.','#..'], '3':['###','##.','#..'], '4':['.##','#..','.##'], '5':['.#.','#.#','.#.'], '6':['##.','..#','..#'],
  '7':['#.#','#.#','.#.'], '8':['.#.','#.#','#.#'], '9':['##.','##.','.#.'], '10':['#..','#.#','#..'], '11':['#.#','#.#','#.#'], '12':['#.#','###','#..'] };
function paintTower(b,tod){ var x0=TW.x0, xf=TW.xf, x1=TW.x1, x, y;
  var FR=R('s2 s3 s4 s5'), SD=R('m1 m2 s2 s3');
  // Schaft: Vorderseite im Licht, Seite im Schatten, Kalksteinquader in schmalen Lagen
  for (y=0;y<GY;y++) for (x=x0;x<=x1;x++){ var side=x>xf, c=tex.ashlar(side?(x-xf)*2.2:x-x0+7,y,side?SD:FR,side?5:7,4);
    if (x===x0) c=P.s5; else if (x===xf) c=P.s3; else if (x===xf+1) c=P.m2; else if (x===x1) c=P.m1;
    b.px(x,y,c); }
  // Bleidach (unten angeschnitten sichtbar) mit Traufe
  for (y=0;y<4;y++) for (x=x0-3+(3-y);x<=x1+3-(3-y)+1;x++){ var c2=(x<xf)?((y===3)?P.m3:P.m4):P.m2; if (((x-x0)%4)===0 && y<3) c2=M.DN[c2]; b.px(x,y,c2); }
  b.hl(x0-3,x1+3,4,P.m1); b.hl(x0-2,x1+2,5,P.k2);
  // Glockenstube: Bogenöffnung mit Glocke, Säulchen
  var ox0=x0+4, ox1=xf-3, oy0=7, oy1=18; for (y=oy0;y<oy1;y++) for (x=ox0;x<=ox1;x++){ var dx=x-(ox0+ox1)/2, r0=(ox1-ox0)/2; if (y<oy0+r0 && (y-(oy0+r0))*(y-(oy0+r0))+dx*dx>r0*r0+0.5) continue; b.px(x,y,(x===ox0||y<oy0+2)?P.k0:P.k1); }
  var bx=rd((ox0+ox1)/2); b.hl(bx-1,bx+1,10,P.y1); b.rect(bx-2,11,5,3,P.y2); b.hl(bx-3,bx+3,14,P.y1); b.px(bx-1,11,P.y3); b.px(bx,15,P.y0);
  for (y=oy0+1;y<oy1;y++){ b.px(xf+2,y,P.k1); b.px(xf+3,y,P.k2); }
  b.hl(x0-1,x1+1,19,P.s5); b.hl(x0-1,x1+1,20,P.s3); for (x=x0;x<=x1;x++){ dk(b,x,21,2); dk(b,x,22,1); }
  snowRect(x0-1,19,x1-x0+3,2); snowRect(x0-3,0,x1-x0+7,2);
  // Zifferblatt in einem Steinrahmen
  var cx=CLK.cx, cy=CLK.cy, r=CLK.r;
  for (y=21;y<46;y++){ b.px(x0+1,y,P.s5); b.px(xf-1,y,P.s2); } b.hl(x0+1,xf-1,21,P.s5); b.hl(x0+1,xf-1,45,P.s2);
  for (y=cy-r-2;y<=cy+r+2;y++) for (x=x0+1;x<xf;x++){ var d=Math.hypot(x+0.5-cx,y+0.5-cy); if (d<=r+1.6 && d>r+0.5) b.px(x,y,P.k2); else if (d<=r+0.5 && d>r-0.4) b.px(x,y,P.w1); else if (d<=r-0.4){ var lit2=(x-cx)*-0.6+(y-cy)*-0.6; b.px(x,y,lit2>3?P.s6:(lit2<-4?P.s4:P.s5)); } }
  for (var i=0;i<12;i++){ var a=(i/12)*Math.PI*2-Math.PI/2, mx=cx+Math.cos(a)*(r-1.6), my=cy+Math.sin(a)*(r-1.6); b.px(Math.floor(mx),Math.floor(my),P.k1); }
  // arabische Ziffern (winzig), Zwölf oben
  for (i=1;i<=12;i++){ var ang=(i/12)*Math.PI*2-Math.PI/2, gx=cx+Math.cos(ang)*(r-5.2), gy=cy+Math.sin(ang)*(r-5.2), g=DIG[String(i)], gw=g[0].length;
    for (var gy2=0;gy2<3;gy2++) for (var gx2=0;gx2<gw;gx2++) if (g[gy2][gx2]==='#') b.px(Math.floor(gx-gw/2+gx2+0.5),Math.floor(gy-1.5+gy2+0.5),P.k2); }
  b.hl(x0+1,xf-1,46,P.s5); b.hl(x0+1,xf-1,47,P.s3); for (x=x0;x<=x1;x++) dk(b,x,48,1);
  // Lanzettfenster, Splitternarben
  [[56,58],[56,72]].forEach(function(w){ for (y=w[1];y<w[1]+8;y++) for (x=w[0];x<w[0]+3;x++){ if (y===w[1] && x!==w[0]+1) continue; b.px(x,y,(x===w[0])?P.k0:P.k1); } b.hl(w[0]-1,w[0]+3,w[1]+8,P.s5); });
  [[50,64],[65,77],[52,93],[67,56]].forEach(function(p){ b.px(p[0],p[1],P.s1); b.px(p[0]+1,p[1]+1,P.s2); b.px(p[0]-1,p[1]-1,P.s5); });
  // Sockel
  for (y=97;y<GY;y++) for (x=x0-1;x<=x1+1;x++){ var c3=(y===97)?P.s5:((x>xf)?P.m2:P.s3); if (y===GY-1) c3=P.s2; if (hash(x>>1,y)<0.1) c3=M.DN[c3]; b.px(x,y,c3); }
  // Tür: Rundbogen, Bohlen, Eisenbänder, Ring
  var d0=TDOOR.x0, d1=TDOOR.x1, dy0=TDOOR.y0; for (y=dy0-2;y<GY;y++) for (x=d0-2;x<=d1+2;x++){ var ddx=x-(d0+d1)/2, inn=(y>=dy0+2||ddx*ddx+(y-dy0-2)*(y-dy0-2)*2.2<=((d1-d0)/2)*((d1-d0)/2)), out=(y>=dy0||ddx*ddx+(y-dy0)*(y-dy0)*1.8<=((d1-d0)/2+2)*((d1-d0)/2+2));
    if (!out) continue; if (!inn){ b.px(x,y,(x<(d0+d1)/2)?P.s5:P.s2); continue; } var c4=((x-d0)%3===0)?P.w0:(((x-d0)%3===1)?P.w2:P.w1); if (y===GY-1) c4=P.k1; b.px(x,y,c4); }
  [dy0+6,dy0+13].forEach(function(yy){ b.hl(d0,d1,yy,P.k1); b.px(d0+1,yy,P.m2); b.px(d1-1,yy,P.m2); });
  b.px(d0+2,dy0+10,P.m3); b.px(d0+1,dy0+10,P.k1); b.px(d0+2,dy0+11,P.k1);
  // Marmortafel mit Schrift
  var p=PLQ; b.rect(p.x0-1,p.y0-1,p.x1-p.x0+2,p.y1-p.y0+2,P.s2); b.rect(p.x0,p.y0,p.x1-p.x0,p.y1-p.y0,P.s6); b.hl(p.x0,p.x1-1,p.y1-1,P.s4); b.vl(p.x1-1,p.y0,p.y1-1,P.s4);
  for (var ln=0;ln<3;ln++) for (x=p.x0+1;x<p.x1-1;x++) if (hash(x,ln*7)<0.7) b.px(x,p.y0+1+ln*2,P.m1);
  // Regenschatten, Kruste
  for (x=x0;x<=x1;x++){ var L=4+rd(fbm(x*0.9,1,8)*10); for (y=48;y<48+L;y++) if (bayer(x,y)<0.35*(1-(y-48)/L)) dk(b,x,y,1); } }

// ---------------------------------------------------------------- Steinbank
function paintBench(b){ var x0=BENCH.x0, x1=BENCH.x1, s=BENCH.seat, by=BENCH.base, x, y;
  for (x=x0;x<x1;x++){ b.px(x,s,P.s6); b.px(x,s+1,P.s5); b.px(x,s+2,P.s4); b.px(x,s+3,P.s2); if (hash(x>>2,3)<0.2) b.px(x,s+1,P.s4); }
  [[x0+3,x0+11],[x1-11,x1-3]].forEach(function(l){ for (y=s+4;y<by;y++) for (x=l[0];x<l[1];x++){ var c=(x===l[0])?P.s4:((x>=l[1]-2)?P.s2:P.s3); if (y===by-1) c=P.s1; b.px(x,y,c); } });
  for (x=x0+11;x<x1-11;x++) for (y=s+4;y<by;y++) b.px(x,y,(y<s+6)?P.k2:P.m1);
  snowRect(x0,s,x1-x0,2); }

// ---------------------------------------------------------------- Kafana „Kula“
function paintKafana(b,tod){ var x0=KAF.x0, x, y;
  // Erdgeschoss: gekalkter Putz auf Steinsockel
  for (y=38;y<GY;y++) for (x=x0;x<W;x++){ var c=tex.plaster(x,y,R('s4 s5 s6'),84); if (y>=GY-6) c=tex.ashlar(x,y,R('s2 s3 s4 s4'),9,3); if (x<x0+2) c=P.s3; b.px(x,y,c); }
  // Walmdach aus Ziegeln, tief heruntergezogen, mit Sparrenköpfen und Kamin
  var EV=40, RG=22;
  for (y=RG;y<EV;y++){ var t=(y-RG)/(EV-RG), xl=rd(lerp(x0+12,x0-7,t)); for (x=xl;x<W;x++){ var rr=EV-1-y, c4=((x+rr*2)%5===0)?P.t1:((rr%3===0)?P.t2:P.t3); if (rr===0) c4=P.t1; else if (rr===1) c4=P.t4; if (x<xl+2) c4=(x===xl)?P.t1:P.t2; if (x<xl+10 && x>xl+1 && ((x-xl+rr)%4===0)) c4=P.t4; if (fbm(x*0.4,y*0.6,9)>0.7) c4=M.DN[c4]; b.px(x,y,c4); } }
  for (x=x0+12;x<W;x++){ b.px(x,RG-1,P.t1); b.px(x,RG-2,(x%2)?P.t3:P.t2); }
  for (x=x0-7;x<W;x++){ b.px(x,EV,P.w0); if ((x-x0)%5===0) b.px(x,EV+1,P.w1); dk(b,x,EV+1,2); dk(b,x,EV+2,1); }
  b.rect(296,8,7,13,P.s3); b.vl(302,8,20,P.s2); b.vl(296,8,20,P.s4); b.hl(295,303,8,P.s5); b.hl(295,303,7,P.s2); b.rect(297,7,5,1,P.k1);
  snowRect(x0-7,RG-2,W-x0+7,EV-RG+2); snowRect(295,6,9,2);
  // Fenster mit Kupfertabletts
  var wn=KAF.win, wx=wn[0], wy=wn[1], ww=wn[2], wh=wn[3];
  b.rect(wx-2,wy-2,ww+4,wh+4,P.w1); b.hl(wx-2,wx+ww+1,wy-2,P.w3); b.hl(wx-3,wx+ww+2,wy+wh+2,P.s5); b.hl(wx-3,wx+ww+2,wy+wh+3,P.s2);
  for (y=wy;y<wy+wh;y++) for (x=wx;x<wx+ww;x++){ var c5=(y<wy+3)?P.k1:P.k2; if (((x-wx)*0.6+(y-wy))%23<1.4) c5=P.m1; b.px(x,y,c5); }
  // Spitzengardine oben
  for (x=wx;x<wx+ww;x++) for (y=wy;y<wy+5;y++){ if (y-wy>2+((x>>1)&1)) continue; if (((x+y)&1)===0) b.px(x,y,P.s5); else b.px(x,y,P.s4); }
  [[wx+7,wy+15,6],[wx+19,wy+12,7],[wx+31,wy+16,5]].forEach(function(t){ b.ellipse(t[0],t[1],t[2],t[2],P.t2); b.ellipse(t[0],t[1],t[2]-1,t[2]-1,P.t3); b.ellipse(t[0],t[1],t[2]-2.5,t[2]-2.5,P.t2);
    for (var k=0;k<6;k++){ var a=k*1.05; b.px(rd(t[0]+Math.cos(a)*(t[2]-2)),rd(t[1]+Math.sin(a)*(t[2]-2)),P.t4); } b.px(t[0]-2,t[1]-3,P.t5); b.px(t[0]-1,t[1]-3,P.l0); });
  b.rect(wx+11,wy+wh-6,4,4,P.y2); b.px(wx+12,wy+wh-6,P.y4); b.line(wx+15,wy+wh-5,wx+18,wy+wh-7,P.w1); b.rect(wx+22,wy+wh-5,3,3,P.t3); b.px(wx+22,wy+wh-5,P.t5);
  b.vl(wx+(ww>>1),wy,wy+wh-1,P.w1); b.hl(wx,wx+ww-1,wy+wh-1,P.w0);
  // Tür (zweiflüglig, Glas oben)
  var dr=KAF.door; M.prop.door(b,dr[0],dr[1],dr[2],dr[3],{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),glass:true,glassCol:P.k1,knob:'L'});
  b.vl(dr[0]+(dr[2]>>1),dr[1],dr[1]+dr[3]-1,P.w0); b.rect(dr[0]+3,dr[1]+3,dr[2]-6,3,P.s4); for (x=dr[0]+3;x<dr[0]+dr[2]-3;x+=2) b.px(x,dr[1]+4,P.s2);
  b.hl(dr[0]-3,dr[0]+dr[2]+2,GY-1,P.s5);
  // Dachrinne und Fallrohr
  for (x=x0-7;x<W;x++){ b.px(x,41,P.m2); b.px(x,42,P.m1); }
  b.vl(x0-6,42,GY-1,P.m2); b.vl(x0-5,42,GY-1,P.m1); b.px(x0-6,GY-1,P.m3); }
// Vordach (Ebene): Ziegel, Blende mit Schild, Untersicht, Pfosten — Figuren auf der Terrasse gehen davor vorbei
function canopyBack(b){ var x, y, c=CAN;
  for (y=c.fb;y<c.uy;y++) for (x=KAF.x0-4;x<W;x++){ var cc=((x-KAF.x0)%6===0)?P.w0:(((y-c.fb)%2)?P.w1:P.w2); b.px(x,y,cc); }
  for (x=KAF.x0-4;x<W;x++) dk(b,x,c.uy,2); }
function paintDeck(b){ var x, y, d=DECK;
  for (y=d.y0;y<=d.y1;y++) for (x=d.x0;x<W;x++){ var row=Math.floor((y-d.y0)/4), fy=(y-d.y0)%4, c=(fy===0)?P.w1:(((x+row*7)%23===0)?P.w1:(hash(row,Math.floor((x+row*11)/23))<0.5?P.w3:P.w2)); if (y===d.y1) c=P.w4; b.px(x,y,c); }
  for (x=d.x0;x<W;x++){ b.px(x,d.y1+1,P.w1); b.px(x,d.y1+2,P.w0); }
  for (y=d.y0;y<d.y1+3;y++){ b.px(d.x0,y,P.w4); b.px(d.x0+1,y,P.w1); } }
function tableAt(w,t){ var x=t.x, top=t.top, by=t.base;
  // zwei Stühle dahinter
  [-8,8].forEach(function(o){ var sx=x+o; w.rect(sx-3,top-9,7,2,P.w2); w.hl(sx-3,sx+3,top-9,P.w4); w.vl(sx-3,top-7,top-1,P.w1); w.vl(sx+3,top-7,top-1,P.w1); w.hl(sx-3,sx+3,top-4,P.w1); });
  w.ellipse(x,top,10,2.6,P.w4); w.ellipse(x,top-0.5,9,1.8,P.w5); w.hl(x-9,x+9,top+2,P.w1); w.hl(x-8,x+8,top+3,P.w0);
  w.rect(x-1,top+3,3,by-top-4,P.w1); w.vl(x-1,top+3,by-2,P.w2); w.hl(x-5,x+5,by-1,P.w0); w.hl(x-4,x+4,by-2,P.w1);
  // ein Stuhl davor, zur Seite gerückt
  var cx=x+(t.x<260?11:-12); w.rect(cx-3,by-9,8,2,P.w3); w.hl(cx-3,cx+4,by-9,P.w5); w.vl(cx-3,by-7,by-1,P.w1); w.vl(cx+4,by-7,by-1,P.w1); w.rect(cx+(t.x<260?4:-4),by-21,2,12,P.w2); w.hl(cx-3,cx+4,by-21,P.w4); w.hl(cx-3,cx+4,by-17,P.w2); }
function paintLampHead(b,x,top){ b.hl(x-4,x+4,top+12,P.k1); b.hl(x-3,x+3,top+11,P.m1);
  for (var y=top+3;y<top+11;y++) for (var xx=x-3;xx<=x+3;xx++){ var c=(xx===x-3||xx===x+3||xx===x)?P.k1:((y<top+6)?P.m3:P.m2); b.px(xx,y,c); }
  b.hl(x-4,x+4,top+2,P.k1); b.hl(x-3,x+3,top+1,P.k2); b.hl(x-1,x+1,top,P.k1); b.px(x,top-1,P.k1); b.px(x,top-2,P.m2); }

// ---------------------------------------------------------------- Kleinigkeiten: Laub, Efeu, Moos, Tafel, Blumentöpfe, Wandlampe, Schild am Laden
function paintExtras(b,tod,wea){ var x, y, i, r=M.rng(61), snow=wea==='snow', wet=wea==='rain';
  // Efeu hängt über die Hofmauer, Moos am Turmfuß
  [[78,26],[196,14],[112,8]].forEach(function(e){ for (i=0;i<e[1]*5;i++){ var ex=e[0]+Math.floor(r()*e[1]), ey=WALL.top+Math.floor(Math.pow(r(),1.6)*(18+e[1]*0.6)); if (b.get(ex,ey)===T) continue; b.px(ex,ey,r()<0.4?P.g1:(r()<0.6?P.g2:P.g3)); if (r()<0.3) b.px(ex,ey+1,P.g1); } });
  for (x=TW.x0-1;x<=TW.x1+1;x++){ if (hash(x,5)<0.55) b.px(x,GY-1,P.g2); if (hash(x,6)<0.3) b.px(x,GY-2,P.g3); }
  // Schild über dem Laden links
  b.rect(6,60,24,6,P.w0); b.hl(6,29,60,P.w2); M.microText(b,'ZLATAR',7,61,P.y3); b.vl(10,57,59,P.k1); b.vl(25,57,59,P.k1);
  // Kreidetafel an der Kafana, Wandlampe über der Tür, Blumentöpfe auf dem Fenstersims
  var tx=293, ty=70; b.rect(tx-1,ty-1,19,20,P.w2); b.rect(tx,ty,17,18,P.k2); M.microText(b,'KAFA',tx+1,ty+1,P.s5); for (i=0;i<3;i++){ for (x=tx+1;x<tx+9;x++) if ((x+i)%3) b.px(x,ty+8+i*3,P.s4); b.px(tx+12,ty+8+i*3,P.s5); b.px(tx+14,ty+8+i*3,P.s5); }
  b.px(286,63,P.k1); b.line(286,63,282,63,P.k1); b.rect(279,63,5,5,P.k1); b.rect(280,64,3,3,P.m2); b.px(281,68,P.k1); KLAMP=[281,65];
  [[KAF.win[0]+3,P.t3],[KAF.win[0]+15,P.t2],[KAF.win[0]+28,P.t3]].forEach(function(f,k){ var px=f[0], py=KAF.win[1]+KAF.win[3]+2; b.rect(px,py-4,6,4,f[1]); b.hl(px-1,px+6,py-4,M.UP[f[1]]); for (var q=0;q<9;q++){ b.px(px+Math.floor(hash(q,k)*6),py-5-Math.floor(hash(q,k+3)*4),hash(q,k+5)<0.5?P.g2:P.g3); } });
  // Laub der Platanen auf dem Pflaster, dichter an der Mauer
  if (!snow) for (i=0;i<260;i++){ var lx=70+Math.floor(r()*150), ly=GY+Math.floor(Math.pow(r(),1.8)*30); if (lx>LAMP.x-3 && lx<LAMP.x+3) continue; var lc=r()<0.4?P.y2:(r()<0.5?P.t3:P.e3); if (wet) lc=M.DN[lc]; b.px(lx,ly,lc); if (r()<0.5) b.px(lx+1,ly,M.DN[lc]); }
  // ein paar Blätter auch auf der Bank, ein vergessenes Feuerzeug am Turm
  if (!snow){ b.px(BENCH.x0+8,BENCH.seat,P.y2); b.px(BENCH.x0+9,BENCH.seat,P.t3); b.px(BENCH.x1-12,BENCH.seat,P.e3); }
  // Tauben auf dem Sims der Glockenstube
  if (tod==='day') [[TW.x0+4,18],[TW.x0+15,18]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); b.px(p[0]+2,p[1]-1,P.m2); }); }
// ---------------------------------------------------------------- Pflaster: Kaldrma aus runden Flusssteinen, in Perspektive
var PAVE=new Uint8Array(W*H);
function kaldrma(x,y,wet){ var h0=2.4, kk=0.085, hy=h0+kk*(y-GY), v=Math.log(hy/h0)/kk, row=Math.floor(v), fv=v-row, sc=hy/h0, u=(x-160)/(3.3*sc)+hash(row,3)*0.9+(row&1)*0.5, col=Math.floor(u), fu=u-col;
  var jit=hash(col,row*7), dx=(fu-0.5)*2, dy=(fv-0.5)*2, d=dx*dx*(0.75+jit*0.2)+dy*dy*(0.9+jit*0.3);
  var tone=hash(col*3+1,row), base=tone<0.22?P.e2:(tone<0.5?P.s2:(tone<0.8?P.s3:(tone<0.92?P.e3:P.s4)));
  var c=base; if (d>0.84) c=(d>1.04)?P.e0:P.e1; else { if (dy<-0.42 && dx<0.35) c=M.UP[base]; else if (dy>0.52 || dx>0.7) c=M.DN[base]; }
  if (wet){ c=M.DN[c]; if (d<0.3 && dy<-0.1 && hash(col,row+5)<0.45) c=P.m3; }
  return c; }
function paintGround(b,wet,wea){ var x, y;
  for (y=GY;y<H;y++) for (x=0;x<W;x++){ b.px(x,y,kaldrma(x,y,wet)); PAVE[y*W+x]=1; }
  // eine Rinne aus Steinplatten quer über den Platz
  for (x=0;x<W;x++){ var yy=129+rd(Math.sin(x*0.01)*1); for (var j=0;j<4;j++){ var c=((x+j*3)%13===0)?P.s1:(j===0?P.s4:(j===3?P.s1:P.s3)); if (wet) c=M.DN[c]; b.px(x,yy+j,c); } }
  // Kontaktschatten an der Fußlinie
  for (x=0;x<W;x++){ dk(b,x,GY,2); if (bayer(x,GY+1)<0.6) dk(b,x,GY+1,1); }
  if (wea==='snow') for (y=GY;y<H;y++) for (x=0;x<W;x++){ var c2=b.get(x,y); if ((c2===P.k2||c2===P.s1) && hash(x,y)<0.75) b.px(x,y,hash(x+1,y)<0.5?P.s5:P.s4); else if (hash(x>>1,y>>1)<0.18) b.px(x,y,P.s5); } }
// nasses Pflaster: Fassaden spiegeln sich in den Pfützen
function wetReflect(b){ var src=b.clone();
  for (var y=GY+2;y<H;y++){ var d=y-GY, k=0.55-d/70, sy=GY-1-Math.floor(d*0.9); if (k<=0.04||sy<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (!PAVE[i]) continue; var pud=fbm(x*0.08,y*0.3,4); if (pud<0.52) continue; var sx=x+((y%3===1)?rd(Math.sin(y*1.3+x*0.07)):0); if (sx<0||sx>=W) continue; var sc=src.d[sy*W+sx];
      if (bayer(x,y)<k*(pud-0.45)*2.4) b.d[i]=M.DN[sc]; } } }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), BASE=null, CESMA=[176,90,96], KLAMP=[281,65];
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,T), x, y, wet=wea==='rain', night=tod==='night';
  DEP.fill(0); SNOW.fill(0); PAVE.fill(0);
  stage(b,1,function(){ paintFar(b); });
  stage(b,2,function(){ paintTrees(b); });
  stage(b,3,function(){ paintWall(b,tod); });
  stage(b,4,function(){ paintTower(b,tod); });
  stage(b,4,function(){ paintShop(b,tod); paintKafana(b,tod); canopyBack(b); });
  stage(b,5,function(){ paintGround(b,wet,wea); paintDeck(b); paintBench(b); paintExtras(b,tod,wea); });
  // Nebel: die Ferne verblasst, der Turm verliert sich nach oben
  var fog=wea==='fog', snow=wea==='snow';
  if (wea!=='calm' || tod!=='day'){ var fk=fog?1:(snow?0.75:(wet?0.55:0.35)), fcol=(night)?P.m1:(tod==='dusk'?P.m2:P.s4);
    M.fogBake(b,function(x,y){ var d=DEP[y*W+x]; if (d===1) return 0.74*fk; if (d===2) return 0.46*fk; if (d===3) return 0.2*fk; if (d===4) return (x<TW.x1+4 && x>TW.x0-4)?clamp((60-y)/60,0,1)*0.5*fk+0.08*fk:0.1*fk; return 0; },{col:fcol}); }
  if (snow) M.snowCap(b,0,0,W,H,function(x,y){ return SNOW[y*W+x]===1; });
  // Himmel dahinter legen
  var sk=new M.Buf(W,H,P.k0); paintSky(sk,tod,wea); SKYM.fill(0);
  for (var k=0;k<W*H;k++) if (b.d[k]===T){ b.d[k]=sk.d[k]; SKYM[k]=1; }
  if (wet) wetReflect(b);
  // Tageslicht: bedeckt, weich; Nebel und Regen dämpfen, Kontaktschatten unter Bank und Vordach
  M.light(b,M.lf.sum(M.lf.pool(60,113,26,3,-1.1),M.lf.pool(264,105,56,4,-0.9),M.lf.band(118,H,0,-0.5),M.lf.vignette(W,H,0.6)),0,0,function(x,y){ return !SKYM[y*W+x]; });
  BASE=b.clone();
  shade(b,0,0,todKey(tod,wea),lightsFor(tod,wea),function(x,y){ return SKYM[y*W+x]===1; });
  if (tod!=='day') afterLights(b,tod,wea);
  return b; }
function afterLights(b,tod,wea){ var x, y, night=tod==='night', wn=KAF.win;
  // Fenster der Kafana: warm (nachts nur das Licht über der Theke)
  for (y=wn[1];y<wn[1]+wn[3];y++) for (x=wn[0];x<wn[0]+wn[2];x++){ var c=BASE.get(x,y); if (c===P.k2||c===P.k1||c===P.m1){ var g=night?0.32+(1-Math.abs(x-wn[0]-24)/24)*0.4:0.75; b.px(x,y,bayer(x,y)<g*0.6?P.y3:(bayer(x,y)<g?P.y2:P.y1)); } }
  if (!night){ var dr=KAF.door; for (y=dr[1]+3;y<dr[1]+3+Math.floor(dr[3]*0.38);y++) for (x=dr[0]+3;x<dr[0]+dr[2]-3;x++) if (BASE.get(x,y)===P.k1) b.px(x,y,bayer(x,y)<0.5?P.y3:P.y2); }
  b.rect(KLAMP[0]-1,KLAMP[1]-1,3,3,P.y4); b.px(KLAMP[0],KLAMP[1],P.l1);
  // Laternenglas, im Nebel mit Hof
  var lx=LAMP.x, lt0=LAMP.top; for (y=lt0+3;y<lt0+11;y++) for (x=lx-2;x<=lx+2;x++) if (x!==lx) b.px(x,y,(y<lt0+6)?P.l0:P.y4); b.px(lx,lt0+5,P.l1);
  var hr=wea==='fog'?16:9; for (y=lt0+7-hr;y<lt0+7+hr;y++) for (x=lx-hr;x<=lx+hr;x++){ var d=Math.hypot(x-lx,(y-lt0-7)*1.1)/hr; if (d>=1||d<0.28) continue; if (x>=lx-3&&x<=lx+3&&y>=lt0&&y<=lt0+12) continue; if (bayer(x,y)<(1-d)*(wea==='fog'?0.42:0.25)) b.px(x,y,M.UP[b.get(x,y)]); }
  // nasses Pflaster: Lichtbahn unter der Laterne
  if (wea==='rain') for (var yy=GY+3;yy<H;yy++){ var a=0.5-(yy-GY)/80; if (a<0.05) break; for (x=lx-2;x<=lx+2;x++){ var wx=x+rd(Math.sin(yy*0.5)*0.8); if (PAVE[yy*W+wx] && bayer(wx,yy)<a*(x===lx?1:0.45)) b.px(wx,yy,yy<GY+14?P.y3:P.y2); } } }

// ---------------------------------------------------------------- Ebenen: Vordach mit Pfosten, Tische, Laterne
function finishL(L,tod,wea){ shade(L,L.ox,L.oy,todKey(tod,wea),lightsFor(tod,wea)); }
function canopyLayer(S,tod,wea){ var c=CAN, L=M.layer(KAF.x0-6,c.y0-2,W-KAF.x0+6,c.foot-c.y0+3,c.foot), w=M.lw(L), x, y;
  // Ziegel auf dem Vordach, Blende mit Schild
  for (x=KAF.x0-6;x<W;x++){ w.px(x,c.y0,(x%3===0)?P.t1:P.t3); w.px(x,c.y0+1,(x%3===1)?P.t4:P.t3); w.px(x,c.y0+2,P.t2); }
  for (y=c.fy;y<c.fb;y++) for (x=KAF.x0-6;x<W;x++){ var cc=(y===c.fy)?P.g3:((y===c.fb-1)?P.g0:P.g1); w.px(x,y,cc); }
  M.text(L,'KAFANA KULA',224-L.ox,c.fy+1-L.oy,P.s5); M.microText(L,'- OD 1958',279-L.ox,c.fy+2-L.oy,P.y3);
  c.posts.forEach(function(px){ for (y=c.fb;y<c.foot;y++){ w.px(px,y,P.w3); w.px(px+1,y,P.w1); } w.px(px-1,c.fb,P.w2); w.px(px+2,c.fb,P.w2); w.line(px,c.fb+6,px+(px<260?6:-6),c.fb,P.w2); });
  if (wea==='snow') for (x=KAF.x0-6;x<W;x++){ w.px(x,c.y0-1,P.s6); if (hash(x,1)<0.6) w.px(x,c.y0,P.s5); }
  finishL(L,tod,wea); if (tod!=='day'){ var lk=tod==='night'?P.y3:P.y4; M.text(L,'KAFANA KULA',224-L.ox,c.fy+1-L.oy,tod==='night'?P.s3:P.s5); }
  return L; }
function catOn(w,x,y){ // eine schlafende Katze, eingerollt
  [[1,0],[2,0],[3,0],[4,0],[5,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]].forEach(function(q){ w.px(x+q[0],y+q[1],(q[1]===0)?P.t4:((q[0]+q[1])%3===0?P.t2:P.t3)); });
  w.px(x+6,y,P.t3); w.px(x+7,y-1,P.t3); w.px(x+5,y-1,P.t3); w.px(x+6,y+1,P.k2); w.hl(x,x+3,y+3,P.t1); w.px(x+1,y+2,P.s5); }
function tableLayers(S,tod,wea){ return TABLES.map(function(t,i){ var L=M.layer(t.x-18,t.top-24,36,t.base-t.top+26,t.base), w=M.lw(L); tableAt(w,t);
    if (i===0){ w.ellipse(t.x+3,t.top-1,2,0.8,P.s4); w.px(t.x+3,t.top-2,P.s5); if (wea!=='rain' && wea!=='snow') catOn(w,t.x+7,t.base-13); }
    if (i===1){ w.rect(t.x-4,t.top-2,4,2,P.s5); w.px(t.x-1,t.top-3,P.s6); }
    finishL(L,tod,wea); return L; }); }
function lampLayer(S,tod,wea){ var x=LAMP.x, L=M.layer(x-6,LAMP.top-3,13,LAMP.base-LAMP.top+4,LAMP.base), w=M.lw(L);
  w.rect(x-1,LAMP.top+12,2,LAMP.base-LAMP.top-12,P.k1); w.vl(x-1,LAMP.top+13,LAMP.base-2,P.m1); w.rect(x-2,LAMP.base-4,4,4,P.k1); w.hl(x-3,x+2,LAMP.base-1,P.k2); w.px(x-2,LAMP.base-4,P.m1);
  w.hl(x-2,x+1,LAMP.top+22,P.m1); paintLampHead(w,x,LAMP.top);
  finishL(L,tod,wea);
  if (tod!=='day') for (var y=LAMP.top+3;y<LAMP.top+11;y++) for (var xx=x-2;xx<=x+2;xx++) if (xx!==x) w.px(xx,y,(y<LAMP.top+6)?P.l0:P.y4);
  return L; }
function layers(S,GS,tod){ var wea=M.scn.weather(GS), out=[canopyLayer(S,tod,wea),lampLayer(S,tod,wea)]; tableLayers(S,tod,wea).forEach(function(l){ out.push(l); }); return out; }

// ---------------------------------------------------------------- Bewegung: Zeiger, Laterne, Tauben, Tropfen, Wetter
function clockHM(S,tod){ if (S && S.clock && S.clock.length===2) return S.clock; return tod==='day'?[8,30]:(tod==='night'?[5,45]:(tod==='dawn'?[1,0]:[12,0])); }
function hand(fb,cx,cy,ang,len,c,c2){ for (var i=0;i<=len*2;i++){ var t=i/2, x=Math.floor(cx+Math.cos(ang)*t), y=Math.floor(cy+Math.sin(ang)*t); if (x>=0&&x<fb.w&&y>=0&&y<144) fb.px(x,y,i>len*2-2&&c2!==undefined?c2:c); } }
var PIG=[[118,122],[127,126],[140,119],[156,128],[104,131]];
function pigeon(fb,x,y,f,t,i,tint){ var peck=Math.sin(t*2.6+i*2.1)>0.45, step=(Math.floor(t*0.9+i*1.3)%5===0)?f:0;
  function px(dx,dy,c){ var X=x+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  px(-3,-3,P.m1); px(-2,-3,P.m3); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m2); px(0,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-2,P.m2); px(3,-1,P.m3); px(4,-1,P.t4); } else { px(2,-3,P.a3); px(2,-4,P.m3); px(3,-5,P.m3); px(2,-5,P.m2); px(4,-4,P.t4); } }
function dyn(fb,v,S,GS){ var tod=v.tod, t=v.t, wea=M.scn.weather(GS), hm=clockHM(S,tod), cx=CLK.cx-0.5, cy=CLK.cy-0.5;
  var ha=((hm[0]%12)+hm[1]/60)/12*Math.PI*2-Math.PI/2, ma=(hm[1]/60)*Math.PI*2-Math.PI/2, hc=tod==='day'?P.k0:P.k0;
  hand(fb,cx,cy,ma,CLK.r-2.6,hc); hand(fb,cx,cy,ha,CLK.r-5,hc); fb.px(Math.floor(cx),Math.floor(cy),P.y3);
  var cs=CESMA; for (var wy=cs[1]+1;wy<cs[2];wy++){ if (((wy+Math.floor(t*14))%3)!==0) fb.px(cs[0]+((wy-cs[1])>3?1:0),wy,tod==='day'?P.a5:P.n3); }
  if (tod==='day' && wea!=='rain') PIG.forEach(function(p,i){ var x=p[0]+rd(Math.sin(t*0.35+i*1.9)*4), f=(Math.sin(t*0.2+i)>0)?1:-1; pigeon(fb,x,p[1],f,t,i,null); });
  if (tod!=='day'){ var lx=LAMP.x, ly=LAMP.top; var fl=Math.sin(t*11.3)+Math.sin(t*4.7+1)>1.7; if (fl){ fb.px(lx-1,ly+4,P.y4); fb.px(lx+1,ly+7,P.y3); } M.glow(fb,lx,ly+7,wea==='fog'?13:8,t,wea==='fog'?0.3:0.22); }
  if (wea==='rain'){ var cyc=(t*0.8)%1, dx=CAN.posts[0]-3, y0=CAN.fy, y1=DECK.y1-1, yy=rd(y0+cyc*cyc*(y1-y0)*1.6); if (yy<y1){ fb.px(dx,yy,P.m4); fb.px(dx,yy-1,P.m3); } else { var k=(t*0.8*1.6)%1.6; if (k<1.6) { fb.px(dx-1,y1,P.m4); fb.px(dx+1,y1,P.m4); fb.px(dx,y1-1,P.s5); } }
    for (var i=0;i<6;i++){ var rx=20+Math.floor(hash(i,5)*280), ry=110+Math.floor(hash(i,6)*30), ph=(t*1.3+hash(i,7)*5)%1; if (ph<0.35){ var rr=Math.floor(ph*8); fb.px(rx-rr,ry,P.m3); fb.px(rx+rr,ry,P.m3); } } } }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS), night=v.tod==='night';
  if (wea==='fog') M.fogDrift(fb,v.t,{y0:34,y1:118,amt:0.34,k:2,col:night?P.m1:(v.tod==='dusk'?P.m2:P.s4),cam:v.cam});
  if (wea==='rain') M.rain(fb,v.t,{n:80,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3});
  if (wea==='snow') M.snow(fb,v.t,{n:70,cam:v.cam}); }
// Geistersicht: die Leine von der Bank zum Zifferblatt, und Emina 1972 auf der Bank
var ECHOLUT=null;
function echoLut(){ if (!ECHOLUT) ECHOLUT=M.tintIn(function(r,g,b){ var L=lum(r,g,b); return [L*0.55+70, L*0.8+92, L*0.85+100]; },['x3','x4','x5','x6']); return ECHOLUT; }
function ghost(fb,v,S,GS){ var t=v.t, F=GS.flags||{};
  if (!F['k2.s1.free']){ var x0=58, y0=BENCH.seat-2, x1=CLK.cx, y1=CLK.cy+CLK.r+1, n=90;
    for (var i=0;i<=n;i++){ var u=i/n, px=Math.round(lerp(x0,x1,u)+Math.sin(u*Math.PI)*-5+Math.sin(u*13+t*1.7)*0.6), py=Math.round(lerp(y0,y1,u)); if (px<0||px>=fb.w||py<0||py>=144) continue;
      if (bayer(px+Math.floor(t*7),py)>0.75) continue; fb.d[py*fb.w+px]=(Math.sin(u*34-t*4)>0.55)?P.x6:P.x4; }
    var pr=1.5+Math.sin(t*2.2)*0.8; for (var yy=Math.floor(CLK.cy-CLK.r-2);yy<=CLK.cy+CLK.r+2;yy++) for (var xx=Math.floor(CLK.cx-CLK.r-2);xx<=CLK.cx+CLK.r+2;xx++){ var d=Math.hypot(xx+0.5-CLK.cx,yy+0.5-CLK.cy); if (Math.abs(d-CLK.r-1)<pr*0.5 && bayer(xx,yy+Math.floor(t*4))<0.4) fb.px(xx,yy,P.x5); } }
  if (F['k2.s1.echoBench'] && M.ANIMS && M.ANIMS.sit && M.CHARS && M.CHARS.ljerka){ var a=0.42+Math.sin(t*0.8)*0.1;
    M.drawPose(fb,44,BENCH.base,M.ANIMS.sit[0][0],'R','ljerka',{lut:echoLut(),alpha:a,t:v.gt,wobble:1,h:144}); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<112||y>140||x<6||x>314) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.base+2) return false;
  if (Math.abs(x-LAMP.x)<4 && y<LAMP.base+2) return false;
  for (var i=0;i<TABLES.length;i++){ var t=TABLES[i]; if (Math.abs(x-t.x)<13 && y<t.base+2 && y>t.base-10) return false; }
  if ((Math.abs(x-CAN.posts[0])<3 || Math.abs(x-CAN.posts[1])<3) && y>CAN.foot-4 && y<CAN.foot+2) return false;
  return true; }
M.defineArt('kula',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,M.scn.weather(GS)); if (!k) return null; return levels(k)[1].a; },
  spots:{
    exit:[0,90,10,50],
    tower:[TW.x0-1,0,TW.x1-TW.x0+3,GY],
    clock:[rd(CLK.cx-CLK.r-1),rd(CLK.cy-CLK.r-1),23,23],
    tower_door:[TDOOR.x0-2,TDOOR.y0-3,TDOOR.x1-TDOOR.x0+5,GY-TDOOR.y0+3],
    plaque:[PLQ.x0-1,PLQ.y0-1,PLQ.x1-PLQ.x0+2,PLQ.y1-PLQ.y0+2],
    wall:[WALL.x0+2,56,WALL.x1-WALL.x0-4,GY-56],
    bench:[BENCH.x0,BENCH.seat-2,BENCH.x1-BENCH.x0,BENCH.base-BENCH.seat+2],
    terrace:[KAF.x0-4,CAN.y0,W-KAF.x0+4,DECK.y1-CAN.y0+3],
    table:[TABLES[0].x-12,TABLES[0].top-10,24,TABLES[0].base-TABLES[0].top+11],
    kafana_door:[KAF.door[0]-2,KAF.door[1]-1,KAF.door[2]+4,KAF.door[3]+1],
    lamp:[LAMP.x-6,LAMP.top-3,13,LAMP.base-LAMP.top+3]
  },
  stands:{
    exit:[8,126,'L'], tower:[64,118,'B'], clock:[58,118,'B'], tower_door:[66,116,'B'], plaque:[52,116,'B'], wall:[138,116,'B'], bench:[74,118,'B'],
    terrace:[262,126,'B'], table:[236,124,'B'], kafana_door:[280,113,'B'], lamp:[186,118,'B']
  },
  actorPos:{ tomaz:[57,121,'F'], emina:[300,131,'L'], lejla:[264,114,'L'] },
  start:[22,124,'R'], entries:{ carsija:[12,124,'R'], kafana:[280,114,'F'] }
});
})(M);
