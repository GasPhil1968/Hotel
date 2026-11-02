/* ===== rooms/art/salon.js — Der Salon im ersten Stock des Hotel Palma, verschlossen seit 1993 =====
   Ein Ballsaal bei Nacht und Regen: drei hohe Bogenfenster, Fischgrätparkett, ein verstaubter Kronleuchter,
   Möbel unter weißen Tüchern. In der Mitte der Flügel unter einem Tuch (S.sheetOff: schwarzer Flügel, Tuch am Boden)
   mit Klavierbank, links das Grammofon mit Trichter auf dem Plattenschrank (S.crank: Kurbel steckt),
   rechts gestapelte Eisenbetten und gerollte Matratzen aus der Flüchtlingszeit. Hinten links die offene Tür zur Treppe.
   S.dawn: das erste Morgenlicht färbt die Fenster rosa.
   Geistersicht: unter der Farbe die Kreidebilder der Kinder (Straßenbahn Nr. 3, Häuser, Sonne, Mädchen mit Zopf,
   „KUĆA“, Größenstriche am Türrahmen) und auf dem Parkett ein Himmel-und-Hölle-Spiel. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer;
var W=320, VX=160, VY=58, F=90, FY=100, BX0=30, BX1=290, BY0=14;
var R3=M.room3([VX,VY],F,FY), SPEC={vp:[VX,VY],rect:[BX0,BY0,BX1,FY]};
var WINS=[[64,92],[146,174],[228,256]], WY0=24, WY1=82;
var DOOR={X0:34,X1:54,Y0:46};
var CAB={X0:60,X1:92,Z0:2,Z1:12,Y0:80};
var PIA={X0:167,X1:209,Z0:29,Z1:57,Y0:81,Yb:87};
var BEN={X0:152,X1:165,Z0:38,Z1:47,Y0:90};
var CH={X:160,Z:30,Y0:18,Y1:44};
function K(Z){ return 1+Z/F; }
function SX(X,Z){ return VX+(X-VX)*K(Z); }
function SY(Y,Z){ return VY+(Y-VY)*K(Z); }
function Xat(x,Z){ return VX+(x-VX)/K(Z); }
function fl(x,y){ var k=(y-VY)/(FY-VY); if (k<=0) return null; return {X:VX+(x-VX)/k, Z:(k-1)*F, k:k}; }
function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
var CACHE={}, BG=null, CHALKOK=null;

// ---------------------------------------------------------------- Licht: Stufen zwischen Nacht (oder Morgengrauen) und warmem Türlicht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.21+L*0.10, g*0.26+L*0.12, b*0.40+L*0.22+16]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.42+L*0.22+18, g*0.30+L*0.16+8, b*0.44+L*0.20+28]; },
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.52+L*0.10+12, g*0.38+L*0.08+4, b*0.50+L*0.10+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; }
};
var LV={};
function levels(base){ if (LV[base]) return LV[base]; var a=[], n=6, A=TF[base], B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[base]=a; }
function baseOf(S,tod){ if (tod==='day') return null; if (S.dawn) return 'dawn'; return TF[tod]?tod:'night'; }
function doorLight(x,y){ var f=fl(x,y), s=0, dx=(x-46)/18, dy=(y-74)/32; if (dx*dx+dy*dy<1) s=0.7*(1-dx*dx-dy*dy);
  if (f && y>=FY){ var t=f.Z/74; if (t<1){ var c=lerp(44,70,t), hw=lerp(9,28,t), d=Math.abs(f.X-c)/hw; if (d<1) s=Math.max(s,(1-d*d)*(1-t)*0.95); } } return s>1?1:s; }
function shade(buf,ox,oy,base,fn,skip){ if (!base) return; var L=levels(base), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=fn(X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
// kaltes Fensterlicht (in Tagesfarben, vor dem Umfärben)
function windowLight(x,y){ var s=0, f=fl(x,y);
  for (var i=0;i<WINS.length;i++){ var w=WINS[i], cx=(w[0]+w[1])/2, hw=(w[1]-w[0])/2;
    if (f && y>=FY){ var t=f.Z/90; if (t<1){ var c=cx-24*t, hh=hw+3*t, d=Math.abs(f.X-c)/hh;
        if (d<1){ var e=(1-Math.pow(d,6))*(1-t*0.75); var mu=Math.abs(f.X-c), tr=Math.abs(t-0.42); if (mu<0.9+t*0.6 || tr<0.025) e*=0.25; s=Math.max(s,e*3.0); } } }
    var dx=(x-cx)/(hw+12), dy=(y-(WY0+WY1)/2)/((WY1-WY0)/2+12), d2=dx*dx+dy*dy; if (d2<1) s=Math.max(s,(1-d2)*1.0);
    var bx=(x-cx)/(hw+4), by=(y-(FY+10))/14, b2=bx*bx+by*by; if (b2<1 && y<FY) s=Math.max(s,(1-b2)*0.6); }
  return s; }

// ---------------------------------------------------------------- Texturen
function wallCol(X,Y){
  if (Y<BY0+3) return Y<BY0+1?P.s2:P.y1;
  if (Y<BY0+6) return ((X>>1)&1)?P.s3:P.s2;
  if (Y>=FY-3) return Y===FY-3?P.s4:P.s2;
  if (Y>=86 && Y<88) return Y===86?P.s5:P.s3;
  var c=P.s4; if (hash(Math.floor(X/2),Math.floor(Y/3))<0.05) c=P.s3;
  var st=Math.sin(X*0.05)+Math.sin(X*0.17+1)*0.5; if (Y<44 && st>1.0 && bayer(X,Y)<0.45-(Y-BY0)/60) c=P.s3;
  return c; }
function panelFrame(b,x0,y0,x1,y1){ b.hl(x0,x1,y0,P.y2); b.vl(x0,y0,y1,P.y2); b.hl(x0,x1,y1,P.y1); b.vl(x1,y0,y1,P.y1); b.hl(x0+1,x1-1,y0+1,P.s5); b.vl(x0+1,y0+1,y1-1,P.s5); }
// Fischgrätparkett (Blöcke 2:1, diagonal verzahnt), echte Verkürzung, staubig
function parquet(x,y){ var f=fl(x,y); if (!f) return P.k0; var X=f.X, D=64*(1-1/f.k);
  if (D<0.8) return P.w0;
  if (D<2.2) return (Math.floor(X/4)&1)?P.w1:P.w2;                 // Fries an der Wand
  var u=X/3.2, v=(D-2.2)/1.05, i=Math.floor(u), j=Math.floor(v), fx=u-i, fy=v-j, m=(((i+j)%4)+4)%4, e=0.16, edge=false, bi, bj;
  if (m<2){ bi=m===0?i:i-1; bj=j; if (fy<e*1.6||fy>1-e*0.6) edge=true; if (m===0&&fx<e) edge=true; if (m===1&&fx>1-e) edge=true; }
  else { bi=i; bj=m===2?j:j-1; if (fx<e||fx>1-e) edge=true; if (m===2&&fy<e*1.6) edge=true; if (m===3&&fy>1-e*0.6) edge=true; }
  if (edge) return P.w1;
  var id=hash(bi*7+bj*3,bj-bi), c=id<0.28?P.w2:(id<0.86?P.w3:P.w4); if (m>=2 && id>0.5) c=M.DN[c]===P.w1?c:c;
  if (hash(Math.floor(X*1.5),Math.floor(D*8))<0.03) c=P.w4;
  return c; }
function ceilCol(xc,d){ var c=P.s2; if (d<2) c=P.y1; else if (d<4) c=P.s3; if (((Math.floor(xc/24))&1) && d>5) c=P.s1; if (hash(Math.floor(xc/3),d)<0.04) c=P.s1; return c; }

// ---------------------------------------------------------------- Blick aus den Fenstern
function outside(S){ var o=new M.Buf(W,144,P.k0), dawn=!!S.dawn, y, x;
  var sky=dawn?M.R('n1 v2 d2 d3 d4 d5 d6'):M.R('k1 k2 n0 n1');
  for (y=0;y<90;y++) for (x=0;x<W;x++){ var v=clamp((y-WY0)/(WY1-WY0),0,1), n=Math.sin(x*0.07+y*0.3)*0.05+hash(x>>3,y>>2)*0.07; o.px(x,y,M.rampAt(sky,dawn?0.15+v*0.78+n:0.12+v*0.5+n,x,y)); }
  for (x=0;x<W;x++){ var hz=62, ih=Math.round(3+Math.sin(x*0.03)*2+Math.sin(x*0.11)); for (y=hz-ih;y<hz;y++) o.px(x,y,dawn?P.v1:P.k1);
    for (y=hz;y<WY1+2;y++) o.px(x,y,M.rampAt(dawn?M.R('v1 d2 v2 d3'):M.R('k0 k1 a0 n0'),0.2+(y-hz)/30+Math.sin(x*0.3+y*1.7)*0.08,x,y)); }
  for (x=2;x<W;x+=5){ var lx=x+(hash(x,4)*3|0); if (hash(x,5)<0.7){ o.px(lx,71,dawn?P.d4:P.y4); o.px(lx,73+(x%3),dawn?P.d3:P.y2); } }
  if (!dawn) for (var i=0;i<90;i++){ var rx=Math.floor(hash(i,41)*W), ry=WY0+Math.floor(hash(i,42)*(WY1-WY0)); o.px(rx,ry,P.n2); o.px(rx,ry+1,P.n1); }
  return o; }

// ---------------------------------------------------------------- Kronleuchter (verstaubt, aus)
function paintChandelier(b){ var x=rd(SX(CH.X,CH.Z)), y0=rd(SY(CH.Y0,CH.Z)), y1=rd(SY(CH.Y1,CH.Z)), cy=y1-6;
  b.ellipse(x+0.5,4,9,2.2,P.s3); b.ellipse(x+0.5,4,5,1.3,P.s4); for (var yy=5;yy<y0+4;yy++) b.px(x,yy,(yy%3===0)?P.y1:P.y0);
  b.ellipse(x+0.5,cy,14,3.4,P.y0); b.ellipse(x+0.5,cy-0.5,12,2.4,P.k2); b.rect(x-1,y0+2,3,cy-y0,P.y0); b.px(x,y0+3,P.y2);
  b.ellipse(x+0.5,y0+6,5,2.5,P.y0); b.ellipse(x+0.5,y0+6,3.5,1.6,P.y1);
  for (var a=0;a<8;a++){ var an=a/8*Math.PI*2, ax=x+Math.cos(an)*13, ay=cy+Math.sin(an)*3; b.line(x,cy,rd(ax),rd(ay),P.y1); b.vl(rd(ax),rd(ay)-4,rd(ay)-1,P.s3); b.px(rd(ax),rd(ay)-5,P.s4);
    for (var d=1;d<6;d++){ var px=rd(ax+(x-ax)*d/6), py=rd(ay+(cy-ay)*d/6)+2+((d*7+a)%3); b.px(px,py,(d+a)%3?P.s3:P.s5); } }
  for (var k=0;k<14;k++){ var t=k/13, px2=rd(x-11+t*22), py2=cy+3+rd(Math.sin(t*Math.PI)*5); b.vl(px2,cy+1,py2,P.s2); b.px(px2,py2,(k%3)?P.s4:P.s6); }
  b.vl(x,cy,cy+10,P.s3); b.ellipse(x+0.5,cy+11,1.6,2,P.s4); b.px(x,cy+12,P.s6);
  b.line(x-14,cy-1,x-21,cy-13,P.s3); b.line(x-18,cy-7,x-12,cy-10,P.s3); b.line(x+14,cy,x+20,cy-11,P.s3); b.line(x+17,cy-5,x+13,cy-8,P.s3);
  CACHE.chand=[x,cy]; }

// ---------------------------------------------------------------- Fenster mit Samtvorhängen
function paintWindows(b,out,sky){ WINS.forEach(function(w){ var x0=w[0], x1=w[1], cx=(x0+x1)/2, r=(x1-x0)/2, top=WY0+r, x, y;
  for (y=WY0-3;y<WY1+3;y++) for (x=x0-3;x<x1+3;x++){ if (y>=top || Math.hypot(x+0.5-cx,(y+0.5-top))<=r+3) b.px(x,y,(x<x0||x>=x1)?P.s3:P.s2); }
  for (y=WY0;y<WY1;y++) for (x=x0;x<x1;x++){ var dd=Math.hypot(x+0.5-cx,y+0.5-top); if (y<top && dd>r) continue;
    var mull=(Math.abs(x+0.5-cx)<0.8)||(y===Math.round((top+WY1)/2))||(y===top)||(y<top && Math.abs(Math.atan2(y+0.5-top,x+0.5-cx)+Math.PI/2)<0.07);
    if (y<top && dd>r-1.2) b.px(x,y,P.s2); else if (mull) b.px(x,y,P.w1); else { b.px(x,y,out.get(x,y)); sky[y*W+x]=1; } }
  b.hl(x0-4,x1+3,WY1+2,P.s5); b.hl(x0-4,x1+3,WY1+3,P.s2);
  var cw=5; for (var s2=0;s2<2;s2++){ var cxs=s2?x1:x0-cw; for (var yc=WY0-6;yc<70;yc++){ var tie=yc>54?Math.min(2,(yc-54)/4):0, ww=cw-Math.round(tie), x00=s2?cxs:cxs+cw-ww; if (yc>58) ww=Math.max(2,cw-2-Math.round((yc-58)/5));
      for (var xc=x00;xc<x00+ww;xc++){ var u=(xc-x00)/ww, fold=Math.sin(u*Math.PI*2.5+(s2?1:0)), c=fold>0.3?P.v3:(fold<-0.4?P.v1:P.v2); if (hash(xc,yc>>1)<0.04) c=P.v1; b.px(xc,yc,c); } }
    var tx=s2?cxs+1:cxs+cw-3; b.px(tx,55,P.y3); b.px(tx+1,55,P.y2); b.px(tx,56,P.y2); b.vl(tx+(s2?0:1),57,60,P.y1); }
  b.hl(x0-cw-2,x1+cw+1,WY0-7,P.y2); b.px(x0-cw-2,WY0-7,P.y4); b.px(x1+cw+1,WY0-7,P.y4); }); }

// ---------------------------------------------------------------- Tür zur Treppe (offen, warmes Licht vom Treppenhaus)
function paintDoor(b){ var x0=DOOR.X0, x1=DOOR.X1, y0=DOOR.Y0;
  b.rect(x0-3,y0-4,x1-x0+6,FY-y0+4,P.s3); b.vl(x1+1,y0-3,FY-1,P.s4); b.vl(x1+2,y0-3,FY-1,P.s2); b.hl(x0-3,x1+2,y0-4,P.s5); b.rect(x0-2,y0-7,x1-x0+4,3,P.s4); b.hl(x0-2,x1+1,y0-7,P.y2);
  for (var y=y0;y<FY;y++) for (var x=x0;x<x1;x++){ var u=(x-x0)/(x1-x0), c=u<0.35?P.y2:(u<0.8?P.y3:P.y2); if (y>FY-14){ c=(u>0.2&&u<0.9)?P.w3:P.w2; if (((x+y)&1)&&u<0.5) c=P.w2; } else if (u>0.75 && y<y0+30) c=P.y4;
    if (x<x0+4 && y>y0+10) c=P.w1; if (y>FY-14 && y<FY-11 && u>0.3) c=P.w4; b.px(x,y,c); }
  for (var bx=x0+6;bx<x1;bx+=3) b.vl(bx,FY-28,FY-15,P.w1); b.hl(x0+4,x1-1,FY-29,P.w2);
  b.poly([[x1+3,y0],[x1+11,y0+5],[x1+11,FY+5],[x1+3,FY]],function(x,y){ var u=(x-x1-3)/8, c=u<0.3?P.w3:P.w2; if (((y-y0)%18)<1) c=P.w1; if (u>0.85) c=P.w1; return c; });
  b.px(x1+8,y0+30,P.y3); b.px(x1+8,y0+31,P.y2); }

// ---------------------------------------------------------------- Plattenschrank mit Grammofon (Blütentrichter vor dem ersten Fenster)
function paintCabinet(b,S){ var p=R3.p, C=CAB;
  R3.box(b,C.X0,C.X1,C.Y0,FY,C.Z0,C.Z1,{top:function(x,y){ return (y&1)?P.w3:P.w4; },right:P.w1,
    front:function(x,y){ var Y=VY+(y-VY)/K(C.Z1), X=Xat(x,C.Z1), u=X-C.X0, mid=(C.X1-C.X0)/2; if (Y<81.5) return P.w4; if (Y>=FY-2) return P.w0; if (u<1.2||u>C.X1-C.X0-1.2) return P.w1;
      if (Math.abs(u-mid)<0.8) return P.w0; if (Y<83||Y>FY-5) return P.w1;
      if (Math.abs(u-mid+3)<0.9 && Math.abs(Y-90)<1.5) return P.y3; if (Math.abs(u-mid-3)<0.9 && Math.abs(Y-90)<1.5) return P.y3;
      var lu=u<mid?u:u-mid; if (lu<2.2||lu>mid-2.2||Y<85||Y>FY-7) return P.w2; return ((Math.floor(lu*1.4)%3)===0)?P.w2:P.w3; }});
  var g0=p(66,C.Y0,6), g1=p(84,C.Y0,6), gx=rd(g0[0]), gy=rd(g0[1]), gw=rd(g1[0]-g0[0]);
  b.rect(gx,gy-7,gw,7,P.w2); b.hl(gx,gx+gw-1,gy-7,P.w4); b.hl(gx,gx+gw-1,gy-1,P.w0); b.vl(gx,gy-7,gy-1,P.w3); b.vl(gx+gw-1,gy-7,gy-1,P.w1);
  b.rect(gx+3,gy-5,gw-6,3,P.w1); b.hl(gx+3,gx+gw-4,gy-5,P.w3); b.px(gx+(gw>>1),gy-4,P.y3);
  b.ellipse(gx+gw/2,gy-8,gw/2-2,1.4,P.k2); b.hl(rd(gx+3),rd(gx+gw-4),gy-8,P.k1); b.px(rd(gx+gw/2),gy-9,P.y3);
  // Tonarm
  var hx=gx+gw-4, hy=gy-8; b.line(hx,hy,hx+1,hy-4,P.y2); b.px(hx+1,hy-5,P.y3);
  // Trichter: Querschnitte von klein (am Tonarm) bis zur großen Blüte, Segmente wie Blütenblätter
  var N=40, EX=gx+5, EY=hy-33; for (var i=0;i<N;i++){ var t=i/(N-1), cxh=lerp(hx+1,EX,t)-Math.sin(t*Math.PI)*4, cyh=lerp(hy-5,EY,t)-Math.sin(t*Math.PI)*2, r=0.9+Math.pow(t,2.6)*10;
    for (var a=0;a<Math.PI*2;a+=0.12){ var px=cxh+Math.cos(a)*r, py=cyh+Math.sin(a)*r*0.78, seg=Math.floor((a+0.2)/(Math.PI/4))%2, c=seg?P.y2:P.y3; if (Math.sin(a)>0.6) c=P.y1; if (Math.cos(a)<-0.7) c=P.y4; b.px(rd(px),rd(py),c); } }
  var ex=EX, ey=EY, R=9; b.ellipse(ex,ey,R,R*0.74,function(x,y){ var d=Math.hypot((x+0.5-ex)/R,(y+0.5-ey)/(R*0.74)); return d>0.82?P.y2:(d>0.6?P.r2:(d>0.32?P.r1:P.k1)); });
  for (var a2=0;a2<Math.PI*2;a2+=0.04){ var rx=ex+Math.cos(a2)*(R+0.6), ry=ey+Math.sin(a2)*(R+0.6)*0.74, wav=(Math.floor((a2+0.2)/(Math.PI/4))%2); b.px(rd(rx),rd(ry),Math.cos(a2)<-0.2?P.y4:(wav?P.y3:P.y2)); }
  for (var sI=0;sI<8;sI++){ var sa=sI/8*Math.PI*2+0.2; b.line(rd(ex+Math.cos(sa)*R*0.35),rd(ey+Math.sin(sa)*R*0.26),rd(ex+Math.cos(sa)*R*0.95),rd(ey+Math.sin(sa)*R*0.7),P.y0); }
  b.px(rd(ex-R*0.7),rd(ey-R*0.4),P.y5);
  CACHE.horn=[ex,ey];
  if (S.crank){ var kx=gx+gw-1, ky=gy-4; b.hl(kx,kx+4,ky,P.m3); b.vl(kx+4,ky,ky+4,P.m3); b.hl(kx+4,kx+6,ky+4,P.w1); b.px(kx+6,ky+4,P.w3); b.px(kx+1,ky-1,P.m4); }
  else { b.px(gx+gw-1,gy-4,P.k1); b.px(gx+gw,gy-4,P.w0); }
  b.rect(gx+gw+2,gy-3,6,3,P.r1); b.hl(gx+gw+2,gx+gw+7,gy-3,P.r2); b.rect(gx+gw+3,gy-4,5,1,P.e3); }

// ---------------------------------------------------------------- Flügel (unter dem Tuch oder frei)
function paintPiano(b,S){ var p=R3.p, Pp=PIA;
  if (!S.sheetOff){ paintSheetOver(b); return; }
  [[Pp.X0+3,Pp.Z1-3],[Pp.X1-6,Pp.Z1-4],[Pp.X1-10,Pp.Z0+5]].forEach(function(l){ var a=p(l[0],Pp.Yb,l[1]), e=p(l[0],FY,l[1]); b.rect(rd(a[0])-1,rd(a[1]),3,rd(e[1]-a[1]),P.k1); b.vl(rd(a[0])-1,rd(a[1]),rd(e[1]),P.m1); b.px(rd(a[0]),rd(e[1]),P.y3); b.px(rd(a[0]),rd(a[1])+2,P.m2); b.hl(rd(a[0])-2,rd(a[0])+2,rd(a[1])+1,P.k2); });
  var ly=p(Pp.X0+14,Pp.Yb,Pp.Z1-12), le=p(Pp.X0+14,FY-3,Pp.Z1-12); b.vl(rd(ly[0]),rd(ly[1]),rd(le[1]),P.k1); b.vl(rd(ly[0])+1,rd(ly[1]),rd(le[1]),P.m0); b.hl(rd(le[0])-2,rd(le[0])+3,rd(le[1]),P.y3); b.px(rd(le[0])-2,rd(le[1])-1,P.y4);
  var lid=[p(Pp.X0,Pp.Y0,Pp.Z1),p(Pp.X1,Pp.Y0,Pp.Z1-2),p(Pp.X1+3,Pp.Y0,Pp.Z1-10),p(Pp.X1-2,Pp.Y0,Pp.Z0+6),p(Pp.X0+22,Pp.Y0,Pp.Z0),p(Pp.X0,Pp.Y0,Pp.Z0)];
  b.poly(lid,function(x,y){ var c=P.k2; if (((x*2+y*5)%13)===0) c=P.m0; if (((x-y*3)%29+29)%29<2) c=P.m1; return c; });
  var fz=[p(Pp.X0,Pp.Y0,Pp.Z1),p(Pp.X1,Pp.Y0,Pp.Z1-2),p(Pp.X1,Pp.Yb,Pp.Z1-2),p(Pp.X0,Pp.Yb,Pp.Z1)]; b.poly(fz,function(x,y){ var t=(y-fz[0][1])/(fz[3][1]-fz[0][1]); return t<0.2?P.m1:(t>0.8?P.k0:P.k1); });
  b.line(rd(fz[0][0]),rd(fz[0][1]),rd(fz[1][0]),rd(fz[1][1]),P.m3); b.line(rd(fz[0][0])+8,rd(fz[0][1])+1,rd(fz[0][0])+30,rd(fz[0][1])+1,P.l0);
  b.poly([p(Pp.X1,Pp.Y0,Pp.Z1-2),p(Pp.X1+3,Pp.Y0,Pp.Z1-10),p(Pp.X1+3,Pp.Yb,Pp.Z1-10),p(Pp.X1,Pp.Yb,Pp.Z1-2)],P.k1);
  var k0=p(Pp.X0-4,Pp.Y0+1,Pp.Z1-2), k1=p(Pp.X0,Pp.Y0+1,Pp.Z1-2), k2=p(Pp.X0,Pp.Y0+1,Pp.Z0+3), k3=p(Pp.X0-4,Pp.Y0+1,Pp.Z0+3);
  b.poly([k0,k1,k2,k3],function(x,y){ return ((x+y)%3===0)?P.k1:P.s5; }); b.line(rd(k0[0]),rd(k0[1]),rd(k3[0]),rd(k3[1]),P.s6);
  b.rect(rd(k0[0])-1,rd(k0[1])+1,rd(k1[0]-k0[0])+2,3,P.k1);
  var md=p(Pp.X0+3,Pp.Y0-8,Pp.Z1-9), md2=p(Pp.X0+3,Pp.Y0,Pp.Z1-9); b.rect(rd(md[0])-1,rd(md[1]),3,rd(md2[1]-md[1]),P.k2); b.vl(rd(md[0])-1,rd(md[1]),rd(md2[1]),P.m1);
  b.rect(rd(md[0])+1,rd(md[1])+1,3,6,P.s5); b.px(rd(md[0])+2,rd(md[1])+2,P.r2); b.px(rd(md[0])+3,rd(md[1])+4,P.s3); }
// das Tuch über dem Flügel: Deckelfläche, Buckel über Pult und Tastatur, schwere Falten, darunter Beine
function paintSheetOver(b){ var p=R3.p, Pp=PIA;
  var fL=p(Pp.X0-5,Pp.Y0-1,Pp.Z1+1), fR=p(Pp.X1+1,Pp.Y0-1,Pp.Z1-1), tR=p(Pp.X1+5,Pp.Y0-1,Pp.Z1-11), bR=p(Pp.X1-4,Pp.Y0-1,Pp.Z0+4), bM=p(Pp.X0+22,Pp.Y0-1,Pp.Z0-1), bL=p(Pp.X0-5,Pp.Y0-1,Pp.Z0+2);
  // Beine unter dem Saum
  [[Pp.X0+3,Pp.Z1-3],[Pp.X1-6,Pp.Z1-4]].forEach(function(l){ var e=p(l[0],FY,l[1]); b.rect(rd(e[0])-1,rd(e[1])-7,3,7,P.k1); b.px(rd(e[0]),rd(e[1]),P.y2); b.vl(rd(e[0])-1,rd(e[1])-7,rd(e[1])-1,P.m0); });
  var ly=p(Pp.X0+14,FY,Pp.Z1-12); b.vl(rd(ly[0]),rd(ly[1])-6,rd(ly[1])-3,P.k1); b.hl(rd(ly[0])-2,rd(ly[0])+3,rd(ly[1])-3,P.y2);
  // Deckelfläche (oben, vom Fensterlicht gestreift)
  b.poly([fL,fR,tR,bR,bM,bL],function(x,y){ var f=Math.sin(x*0.35+y*0.9); return f>0.75?P.s6:(f<-0.8?P.s4:P.s5); });
  // Buckel über dem Notenpult und der Tastatur
  var mx=SX(Pp.X0+3,Pp.Z1-9); b.poly([[mx-4,fL[1]+1],[mx-2,fL[1]-8],[mx+3,fL[1]-10],[mx+8,fL[1]-6],[mx+12,fL[1]]],function(x,y){ return x<mx+1?P.s6:(x<mx+6?P.s5:P.s4); });
  b.line(rd(mx-2),rd(fL[1])-8,rd(mx+3),rd(fL[1])-10,P.s6);
  // herabhängende Vorderseite mit Falten aus den Ecken
  var top=fL[1], x0=fL[0]-1, x1=tR[0]+1, hem=function(x){ var u=(x-x0)/(x1-x0); return lerp(SY(FY-6,Pp.Z1+2),SY(FY-7,Pp.Z1-8),u)+Math.sin(u*Math.PI*5)*1.6+Math.sin(u*31)*0.7; };
  for (var x=Math.floor(x0);x<=Math.ceil(x1);x++){ var u=(x-x0)/(x1-x0), yt=lerp(top,tR[1],Math.max(0,(u-0.8)/0.2)), yb=hem(x);
    for (var y=Math.floor(yt);y<yb;y++){ var t=(y-yt)/(yb-yt), fold=Math.sin(u*34+t*3*Math.sin(u*7))+Math.sin(u*9-t*2)*0.6;
      var diagL=Math.abs((x-x0)-t*18)<1.2 && t<0.8, diagR=Math.abs((x1-x)-t*14)<1.2 && t<0.8;
      var c=P.s5; if (fold>0.85) c=P.s6; else if (fold<-0.9) c=P.s3; else if (fold<-0.3) c=P.s4; if (diagL||diagR) c=P.s3; if (t<0.1) c=P.s6; if (yb-y<1.5) c=P.s3; if (u<0.04||u>0.97) c=P.s3;
      b.px(x,y,c); } }
  b.line(rd(fL[0]),rd(fL[1]),rd(fR[0]),rd(fR[1]),P.s6); }
function paintSheetHeap(b){ var cx=258, cy=128; b.ellipse(cx,cy,15,5,P.s4); b.ellipse(cx-3,cy-3,9,4,P.s5); b.ellipse(cx+5,cy-2,7,3.4,P.s5); b.ellipse(cx-5,cy-5,4,2.4,P.s6); b.line(cx-14,cy+2,cx+12,cy+3,P.s3); b.line(cx-2,cy-2,cx+6,cy+3,P.s3); b.line(cx-8,cy-1,cx-4,cy+4,P.s3); }
function paintBench(b){ var B=BEN, p=R3.p; R3.box(b,B.X0,B.X1,B.Y0,FY,B.Z0,B.Z1,{top:function(x,y){ var t=(y-SY(B.Y0,B.Z0))/(SY(B.Y0,B.Z1)-SY(B.Y0,B.Z0)+0.01); return t>0.6?P.w4:(((x+y)&1)?P.w2:P.w3); },left:P.w0,right:P.w0,
    front:function(x,y){ var Y=VY+(y-VY)/K(B.Z1), X=Xat(x,B.Z1); if (Y<91) return P.w3; if (Y<95){ if (Math.abs(X-(B.X0+B.X1)/2)<0.9 && Y>92) return P.y4; return P.w2; } if (Y<96) return P.w1; var lx=X-B.X0; if (lx<1.5||lx>B.X1-B.X0-1.5) return P.w1; return T; }});
  var bl=p(B.X0+1,FY,B.Z1), br=p(B.X1-1,FY,B.Z1); b.vl(rd(bl[0]),rd(SY(96,B.Z1)),rd(bl[1]),P.w1); b.vl(rd(br[0]),rd(SY(96,B.Z1)),rd(br[1]),P.w1);
  var bk=p(B.X0+1,FY,B.Z0+1), bk2=p(B.X1-1,FY,B.Z0+1); b.vl(rd(bk[0]),rd(SY(96,B.Z0+1)),rd(bk[1]),P.w0); b.vl(rd(bk2[0]),rd(SY(96,B.Z0+1)),rd(bk2[1]),P.w0); }

// ---------------------------------------------------------------- Eisenbetten, Matratzen, Möbel unter Tüchern
function paintBeds(b){ var r=M.rng(17);
  for (var m=0;m<3;m++){ var mx=262+m*8, my=97, mw=7, mh=24-m*3; for (var y=my-mh;y<my;y++) for (var x=mx;x<mx+mw;x++){ var u=(x-mx)/mw, c=((x+m)%3===0)?P.c2:P.s4; if (u<0.2||u>0.85) c=M.DN[c]; if (((y-my+mh)%9)===4) c=P.e1; b.px(x,y,c); }
    b.ellipse(mx+mw/2,my-mh,mw/2,1.6,P.s3); b.ellipse(mx+mw/2,my-mh,mw/2-1.6,0.8,P.s2); }
  for (var k=0;k<5;k++){ var uo=4+k*2.6, yo=k*2;
    var A=M.wallPt(SPEC,'R',uo,58+yo), B=M.wallPt(SPEC,'R',uo+20,58+yo), Cc=M.wallPt(SPEC,'R',uo+20,FY-2), D=M.wallPt(SPEC,'R',uo,FY-2);
    var col=k%2?P.m3:P.s3, dk=k%2?P.m1:P.s1;
    b.line(rd(A[0])-k*2,rd(A[1]),rd(D[0])-k*2,rd(D[1]),col); b.line(rd(A[0])-k*2+1,rd(A[1]),rd(D[0])-k*2+1,rd(D[1]),dk);
    b.line(rd(B[0])-k*2,rd(B[1]),rd(Cc[0])-k*2,rd(Cc[1]),col);
    b.line(rd(A[0])-k*2,rd(A[1]),rd(B[0])-k*2,rd(B[1]),col); b.line(rd(A[0])-k*2,rd(A[1])+6,rd(B[0])-k*2,rd(B[1])+6,dk);
    for (var s=1;s<7;s++){ var t=s/7, ax=lerp(A[0],B[0],t)-k*2, ay=lerp(A[1],B[1],t), dy=lerp(A[1],B[1],t)+14+((s*7+k)%3); b.line(rd(ax),rd(ay),rd(ax),rd(dy),s%2?col:dk); }
    b.px(rd(A[0])-k*2,rd(A[1])-1,P.y2); b.px(rd(B[0])-k*2,rd(B[1])-1,P.y2);
    if (r()<0.6){ var rs=lerp(A[0],B[0],0.4)-k*2; b.px(rd(rs),rd(lerp(A[1],B[1],0.4))+3,P.t2); } }
  b.poly([[268,112],[312,108],[318,118],[272,124]],function(x,y){ return ((x+y*2)%5===0)?P.c2:P.s4; }); b.line(268,112,312,108,P.s5); b.line(272,124,318,118,P.s2);
  b.poly([[282,110],[300,108],[304,116],[286,119]],function(x,y){ return ((x>>1)+(y>>1))%2?P.e1:P.e2; });
  b.rect(296,96,14,10,P.e3); b.hl(296,309,96,P.e4); b.vl(309,96,105,P.e1); M.microText(b,'DEKE',297,99,P.e0); }
function paintDraped(b){ // ein Stapel Stühle unter einem Tuch, unter dem dritten Fenster
  var Z=8, x0=rd(SX(229,Z)), x1=rd(SX(257,Z)), yb=rd(SY(FY,Z))+1;
  var top=function(x){ var u=(x-x0)/(x1-x0); return rd(SY(64,Z)+Math.abs(Math.sin(u*Math.PI*2.2))*-3+Math.sin(u*Math.PI)*-4+u*6); };
  for (var x=x0;x<=x1;x++){ var yt=top(x); for (var y=yt;y<yb;y++){ var u=(x-x0)/(x1-x0), t=(y-yt)/(yb-yt), f=Math.sin(u*22+t*2.5), c=f>0.5?P.s5:(f<-0.5?P.s3:P.s4);
      if (y===yt) c=P.s5; if (yb-y<2) c=P.s3; if (t>0.55 && Math.abs(Math.sin(u*Math.PI*3))<0.12) c=P.s2; b.px(x,y,c); } }
  // Stuhlbeine schauen unten heraus
  [[0.12],[0.4],[0.66],[0.9]].forEach(function(q){ var lx=rd(lerp(x0,x1,q[0])); b.vl(lx,yb-1,yb+1,P.w1); }); }
function paintSofa(b){ var pts=[[0,104],[16,98],[30,102],[34,118],[30,128],[0,134]];
  b.poly(pts,function(x,y){ var f=Math.sin(x*0.55+y*0.12), c=f>0.5?P.s5:(f<-0.45?P.s3:P.s4); if (y>126) c=P.s3; return c; }); b.line(0,104,16,98,P.s5); b.line(16,98,30,102,P.s5); }

// ---------------------------------------------------------------- Wandschmuck: Seestück, blinder Spiegel, erloschene Leuchter, Spinnweben, Kinderschuh
function paintWallDecor(b){ var x, y;
  // Seestück im Goldrahmen (oberhalb der Kreidebilder)
  var px=104, py=33, pw=32, ph=18; b.rect(px-2,py-2,pw+4,ph+4,P.y1); b.hl(px-2,px+pw+1,py-2,P.y3); b.vl(px-2,py-2,py+ph+1,P.y2); b.hl(px-2,px+pw+1,py+ph+1,P.y0);
  for (y=py;y<py+ph;y++) for (x=px;x<px+pw;x++){ var t=(y-py)/ph, c=t<0.45?M.rampAt(M.R('e2 e3 e4 s4'),0.9-t*1.4,x,y):M.rampAt(M.R('a1 a2 a3 e2'),0.3+(t-0.45)*0.8+Math.sin(x*0.6+y)*0.06,x,y); b.px(x,y,c); }
  b.poly([[px+18,py+9],[px+22,py+9],[px+21,py+11],[px+18,py+11]],P.w1); b.vl(px+20,py+2,py+9,P.w0); b.poly([[px+20,py+3],[px+25,py+8],[px+20,py+8]],P.s4); b.hl(px+2,px+12,py+8,P.e1); b.px(px+6,py+3,P.s5);
  b.vl(px+pw/2,py-6,py-3,P.y1); b.px(px+pw/2,py-7,P.y2);
  // ovaler Spiegel mit blinden Stellen
  var mx=201, my=42, rx=13, ry=9; b.ellipse(mx,my,rx+2,ry+2,P.y2); b.ellipse(mx,my,rx+1,ry+1,P.y1);
  b.ellipse(mx,my,rx,ry,function(x,y){ var d=((x-mx)*0.6-(y-my)); var c=M.rampAt(M.R('m0 m1 m2 m3'),0.3+(y-my)/ry*-0.2+(Math.abs(d)<2?0.4:0),x,y); if (hash(x>>1,y>>1)<0.12) c=P.e1; if (hash(x,y)<0.05) c=P.s3; return c; });
  b.px(mx-6,my-4,P.s5); b.px(mx-5,my-5,P.s4); b.px(mx,my-ry-2,P.y4);
  // erloschene Wandleuchter mit Kristallbehang zwischen den Fenstern
  [96,232].forEach(function(cx){ var yy=50; b.rect(cx-1,yy-3,3,4,P.y1); b.line(cx,yy,cx-4,yy-3,P.y1); b.line(cx,yy,cx+4,yy-3,P.y1); b.vl(cx-4,yy-6,yy-3,P.s4); b.vl(cx+4,yy-6,yy-3,P.s4); b.px(cx-4,yy-7,P.s5); b.px(cx+4,yy-7,P.s5); b.px(cx-2,yy+2,P.s5); b.px(cx+2,yy+2,P.s5); b.px(cx,yy+3,P.s6); });
  // Spinnweben in den oberen Fensterecken
  WINS.forEach(function(w){ var x0=w[0]-6, y0=WY0-6; b.line(x0,y0,x0+7,y0+7,P.s3); b.line(x0,y0+4,x0+4,y0,P.s3); b.line(x0+1,y0+7,x0+7,y0+1,P.s2); });
  // ein vergessener roter Kinderschuh bei den Betten
  var sx=252, sy=128; b.rect(sx,sy-2,5,2,P.r3); b.px(sx+4,sy-3,P.r3); b.hl(sx,sx+5,sy,P.r1); b.px(sx+1,sy-3,P.r4); b.px(sx+2,sy-2,P.s5); }

// ---------------------------------------------------------------- Bild
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), sky=new Uint8Array(W*144), out=outside(S), base=baseOf(S,tod);
  M.box(b,{vp:SPEC.vp,rect:SPEC.rect,
    back:function(u,v,x,y){ return wallCol(x,y); },
    side:function(u,v,x,y,sd){ var D=(sd==='L'?(VX-BX0):(BX1-VX)), ut=D*(1-1/(1+u/D)); return M.DN[wallCol(sd==='L'?ut*1.7:400+ut*1.7,Math.floor(v+BY0))]; },
    floor:function(xb,d,x,y){ return parquet(x,y); },
    ceil:function(xc,d,x,y){ return ceilCol(xc,d); } });
  [[98,140],[180,222],[262,286]].forEach(function(q){ panelFrame(b,q[0],28,q[1],80); panelFrame(b,q[0]+3,31,q[1]-3,77); });
  [[98,140],[180,222]].forEach(function(q){ panelFrame(b,q[0],89,q[1],96); });
  var wallOnly=b.clone();
  paintWallDecor(b);
  paintWindows(b,out,sky);
  paintDoor(b);
  paintDraped(b);
  paintBeds(b);
  paintCabinet(b,S);
  paintPiano(b,S); if (S.sheetOff) paintSheetHeap(b); paintBench(b);
  paintSofa(b);
  for (var q=0;q<W*144;q++) if (sky[q] && b.d[q]!==out.d[q]) sky[q]=0;
  // wo Wand oder Boden frei sichtbar sind, dürfen Kreidebilder erscheinen (Türrahmen ausdrücklich auch)
  CHALKOK=new Uint8Array(W*144); for (var i=0;i<W*144;i++){ var x=i%W, y=(i/W)|0; CHALKOK[i]=(b.d[i]===wallOnly.d[i])||(x>=DOOR.X1+1&&x<=DOOR.X1+2&&y>=DOOR.Y0&&y<FY)?1:0; }
  var notSky=function(x,y){ return !sky[y*W+x]; };
  var p0=R3.p(PIA.X0,FY,PIA.Z1), p1=R3.p(PIA.X1,FY,PIA.Z0);
  M.light(b,M.lf.sum(windowLight,M.lf.vignette(W,144,1.2),M.lf.band(0,16,-1.2,0),M.lf.pool((p0[0]+p1[0])/2,(p0[1]+p1[1])/2+3,42,7,-1.4),M.lf.pool(70,113,24,4,-1),M.lf.pool(158,121,10,3,-1),M.lf.k(-0.45)),0,0,notSky);
  paintChandelier(b);
  for (var q2=0;q2<W*144;q2++) if (sky[q2] && b.d[q2]!==out.d[q2]) sky[q2]=0;
  shade(b,0,0,base,doorLight,function(x,y){ return !!sky[y*W+x]; });
  if (base){ // kühle Glanzlichter vom Fenster: Trichterrand, Bettknäufe, Kronleuchter
    var gl=S.dawn?P.d4:P.n4, h=CACHE.horn; if (h){ for (var a=2.3;a<4.0;a+=0.12) b.px(rd(h[0]+Math.cos(a)*9.6),rd(h[1]+Math.sin(a)*7.1),gl); }
    for (var k=0;k<5;k++){ var A=M.wallPt(SPEC,'R',4+k*2.6,58+k*2); b.px(rd(A[0])-k*2,rd(A[1])-1,gl); }
    var ch=CACHE.chand; if (ch){ [[-8,4],[-3,6],[4,5],[9,3],[0,12]].forEach(function(q){ b.px(ch[0]+q[0],ch[1]+q[1],S.dawn?P.d5:P.n5); }); }
    for (var yy=DOOR.Y0;yy<FY-14;yy++) for (var xx=DOOR.X0+4;xx<DOOR.X1;xx++){ var u=(xx-DOOR.X0)/(DOOR.X1-DOOR.X0); if (bayer(xx,yy)<0.6) b.px(xx,yy,u>0.7?P.y4:P.y3); } b.vl(DOOR.X1-2,DOOR.Y0+2,DOOR.Y0+26,P.y5); }
  BG=b; return b; }

// ---------------------------------------------------------------- Ebenen: Flügel, Klavierbank, Tuch am Boden, Sofa
function copyInto(L,src){ for (var y=0;y<L.h;y++) for (var x=0;x<L.w;x++){ var c=src.get(x+L.ox,y+L.oy); if (c!==T) L.d[y*L.w+x]=c; } }
function finishL(L,base,pre){ M.light(L,M.lf.sum(windowLight,M.lf.vignette(W,144,1.4),M.lf.k(-0.35),pre||M.lf.k(0)),L.ox,L.oy); shade(L,L.ox,L.oy,base,doorLight); return L; }
function layers(S,GS,tod){ var base=baseOf(S,tod), out=[], t;
  var L=M.layer(160,72,104,64,rd(SY(FY,PIA.Z1))+1); t=new M.Buf(W,144,T); paintPiano(t,S); copyInto(L,t); out.push(finishL(L,base));
  var Bl=M.layer(148,96,24,32,118);   // Basis vor Ljerkas Füßen (120): sie sitzt auf der Bank, nicht dahinter t=new M.Buf(W,144,T); paintBench(t); copyInto(Bl,t); out.push(finishL(Bl,base));
  if (S.sheetOff){ var H=M.layer(240,116,36,20,134); t=new M.Buf(W,144,T); paintSheetHeap(t); copyInto(H,t); out.push(finishL(H,base)); }
  var So=M.layer(0,96,36,40,135); t=new M.Buf(W,144,T); paintSofa(t); copyInto(So,t); out.push(finishL(So,base,M.lf.k(-0.2)));
  return out; }

// ---------------------------------------------------------------- Bewegung: Regen an den Fenstern, Staub im Licht, Türlicht
function dyn(fb,v,S,GS){ WINS.forEach(function(w,i){ M.scn.windowRain(fb,w[0]+1,WY0+6,w[1]-w[0]-2,WY1-WY0-7,v.t*(0.9+i*0.1)+i*3,v.cam); });
  var col=S.dawn?P.d4:P.n3; WINS.forEach(function(w,i){ M.dust(fb,v.t*0.6+i*7,w[0]-4,WY1,w[1]-w[0]+12,30,6,col); });
  if (Math.sin(v.t*2.3)+Math.sin(v.t*5.1)>1.7){ for (var y=DOOR.Y0+2;y<FY-16;y+=2) fb.px(DOOR.X1-3,y,P.y4); } }

// ---------------------------------------------------------------- Geistersicht: die Kreidebilder der Kinder
var CHALK=null;
function chalkLines(){ if (CHALK) return CHALK; var pts={}, flo={}, glow={};
  function dot(x,y,v,f){ x=rd(x); y=rd(y); if (x<0||y<0||x>=W||y>=144) return; var k=y*W+x; pts[k]=Math.max(pts[k]||0,v||1); if (f) flo[k]=1; }
  function ln(x0,y0,x1,y1,v,wob,f){ var n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0))); for (var i=0;i<=n;i++){ var t=i/n, j=wob?Math.sin(t*9+x0)*0.35:0; dot(lerp(x0,x1,t)+j,lerp(y0,y1,t)-j,v,f); } }
  function circ(cx,cy,rx,ry,v){ var n=Math.ceil((rx+ry)*3); for (var i=0;i<n;i++){ var a=i/n*Math.PI*2; dot(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,v); } }
  function poly(a,v){ for (var i=0;i<a.length-1;i++) ln(a[i][0],a[i][1],a[i+1][0],a[i+1][1],v,true); }
  function txt(s,x,y,v){ var cx=x; for (var i=0;i<s.length;i++){ var g=M.FONT[s[i]]; if (!g){ cx+=3; continue; } var jy=(i%2)?1:0; for (var k=0;k<g.px.length;k+=2) dot(cx+g.px[k],y+g.px[k+1]+jy,v); cx+=g.w+2; } }
  function micro(s,x,y,v){ M.microText({px:function(xx,yy){ dot(xx,yy,v,1); }},s,rd(x),rd(y),0); }
  // --- das Mädchen mit Zopf wartet an der Haltestelle (links) und winkt der Straßenbahn Nr. 3
  var gx=103, gy=69; circ(gx,gy,3,3.2,1); dot(gx-1,gy-0.5,0.8); dot(gx+1.4,gy-0.5,0.8); ln(gx-1,gy+1.4,gx+1.4,gy+1.4,0.7);
  poly([[gx-1,gy+3.4],[gx-5.5,gy+15],[gx+5.5,gy+15],[gx+1,gy+3.4]],1); ln(gx-4.5,gy+13,gx+4.5,gy+13,0.6);
  ln(gx-2,gy+15,gx-2.5,gy+21,1); ln(gx+2,gy+15,gx+2.5,gy+21,1); ln(gx-4,gy+21,gx-2,gy+21,0.8); ln(gx+2,gy+21,gx+4,gy+21,0.8);
  ln(gx+1.5,gy+5,gx+6,gy+2,0.9); ln(gx+6,gy+2,gx+7,gy-1,0.9); ln(gx-1.5,gy+5,gx-5,gy+10,0.9);
  poly([[gx-2.6,gy-1.6],[gx-4.4,gy+0.6],[gx-3.4,gy+2.6],[gx-5,gy+4.6],[gx-4,gy+6.6],[gx-5.6,gy+8.6]],1); dot(gx-6.6,gy+9,1); dot(gx-5.6,gy+10,1); dot(gx-4.6,gy+9.4,1); dot(gx-6.4,gy+10.6,0.8);
  for (var hI=-2;hI<=2;hI++) dot(gx+hI,gy-3.2,0.8);
  var tx=114, ty=70;
  poly([[tx,ty+14],[tx,ty+3],[tx+2,ty],[tx+22,ty],[tx+25,ty+3],[tx+25,ty+14],[tx,ty+14]],1);
  for (var wI=0;wI<3;wI++) poly([[tx+2+wI*5,ty+3],[tx+5+wI*5,ty+3],[tx+5+wI*5,ty+7],[tx+2+wI*5,ty+7],[tx+2+wI*5,ty+3]],0.8);
  ln(tx+1,ty+9,tx+16,ty+9,0.6,true);
  poly([[tx+18,ty+2],[tx+24,ty+2],[tx+24,ty+11],[tx+18,ty+11],[tx+18,ty+2]],0.9);
  var g3=M.FONT['3']; for (var k3=0;k3<g3.px.length;k3+=2) dot(tx+19+g3.px[k3],ty+3+g3.px[k3+1],1.3);
  circ(tx+5,ty+15,2,2,1); circ(tx+20,ty+15,2,2,1); ln(tx-3,ty+18,tx+28,ty+18,0.7,true); for (var s=0;s<6;s++) ln(tx-1+s*6,ty+18,tx-2+s*6,ty+20,0.5);
  poly([[tx+10,ty],[tx+14,ty-4],[tx+9,ty-7],[tx+15,ty-10]],0.9); ln(tx-4,ty-10,tx+28,ty-11,0.7,true);
  // gezählte Tage unter der Bahn
  for (var tI=0;tI<13;tI++){ var tx2=114+(tI%5)*2+Math.floor(tI/5)*12, ty2=93; if (tI%5===4) ln(tx2-8,ty2+2,tx2+1,ty2-2,0.7); else ln(tx2,ty2-2,tx2,ty2+2,0.7); }
  var hzx=100, hzy=94; poly([[hzx,hzy+3],[hzx-3,hzy],[hzx-3,hzy-1],[hzx-2,hzy-2],[hzx,hzy-1],[hzx+2,hzy-2],[hzx+3,hzy-1],[hzx+3,hzy],[hzx,hzy+3]],0.9);
  // --- Häuser, Sonne, KUĆA (zwischen dem zweiten und dritten Fenster)
  var hx=183, hy=76;
  poly([[hx,hy+12],[hx,hy+3],[hx+6,hy-3],[hx+12,hy+3],[hx+12,hy+12],[hx,hy+12]],1); poly([[hx+4,hy+12],[hx+4,hy+7],[hx+7,hy+7],[hx+7,hy+12]],0.8); poly([[hx+8,hy+4],[hx+10,hy+4],[hx+10,hy+6],[hx+8,hy+6],[hx+8,hy+4]],0.7);
  poly([[hx+16,hy+12],[hx+16,hy],[hx+23,hy-6],[hx+30,hy],[hx+30,hy+12],[hx+16,hy+12]],1); poly([[hx+21,hy+12],[hx+21,hy+6],[hx+25,hy+6],[hx+25,hy+12]],0.8);
  poly([[hx+18,hy+2],[hx+20,hy+2],[hx+20,hy+4],[hx+18,hy+4],[hx+18,hy+2]],0.7); poly([[hx+26,hy+2],[hx+28,hy+2],[hx+28,hy+4],[hx+26,hy+4],[hx+26,hy+2]],0.7);
  poly([[hx+26,hy-3],[hx+26,hy-7],[hx+28,hy-7],[hx+28,hy-2]],0.8); circ(hx+28,hy-10,1.4,1,0.6); circ(hx+30,hy-13,1.8,1.2,0.5);
  ln(hx-2,hy+13,hx+34,hy+13,0.8,true); for (var gI=0;gI<9;gI++) ln(hx-1+gI*4,hy+13,hx+gI*4,hy+11,0.6);
  var sx=hx+33, sy=hy-17; circ(sx,sy,3,3,1); for (var rI=0;rI<10;rI++){ var a=rI/10*Math.PI*2; ln(sx+Math.cos(a)*4.4,sy+Math.sin(a)*4.4,sx+Math.cos(a)*6.4,sy+Math.sin(a)*6.4,0.8); }
  dot(sx-1,sy-1,0.8); dot(sx+1,sy-1,0.8); ln(sx-1,sy+1.4,sx+1,sy+1.4,0.7);
  txt('KUĆA',hx+1,hy-22,1);
  var fx=219, fy=88; circ(fx,fy,1.2,1.2,0.9); for (var pI=0;pI<5;pI++){ var pa=pI/5*Math.PI*2; circ(fx+Math.cos(pa)*2.4,fy+Math.sin(pa)*2.4,0.9,0.9,0.7); } ln(fx,fy+2,fx,fy+7,0.8);
  // --- Größenstriche der Kinder am Türrahmen
  [66,70,73,77,80].forEach(function(m){ ln(DOOR.X1+1,m,DOOR.X1+2,m,0.9); });
  // --- Himmel und Hölle auf dem Parkett: Feld 1 vorn, NEBO hinten
  var HX=130, hw=6.5, dd=2.6, rows=[[31.2,1,'1'],[28.6,1,'2'],[26.0,1,'3'],[23.4,2,'45'],[20.8,1,'6'],[18.2,2,'78']];
  function fp(X,D){ var k=1/(1-D/64), Z=(k-1)*F; return R3.p(X,FY,Z); }
  for (var rI2=0;rI2<rows.length;rI2++){ var r=rows[rI2], dN=r[0], dF=r[0]-dd, w2=r[1]===2?hw*2:hw;
    var a0=fp(HX-w2,dN), a1=fp(HX+w2,dN), b0=fp(HX-w2,dF), b1=fp(HX+w2,dF);
    ln(a0[0],a0[1],a1[0],a1[1],0.85,true,1); ln(b0[0],b0[1],b1[0],b1[1],0.85,true,1); ln(a0[0],a0[1],b0[0],b0[1],0.85,false,1); ln(a1[0],a1[1],b1[0],b1[1],0.85,false,1);
    if (r[1]===2){ var m0=fp(HX,dN), m1=fp(HX,dF); ln(m0[0],m0[1],m1[0],m1[1],0.85,false,1); }
    var dm=(dN+dF)/2; if (r[1]===1){ var c=fp(HX,dm); if (rI2<3||rI2===4) micro(r[2],c[0]-1,c[1]-2,0.7); } else if (rI2<4){ var cl=fp(HX-hw,dm), cr=fp(HX+hw,dm); micro(r[2][0],cl[0]-1,cl[1]-2,0.7); micro(r[2][1],cr[0]-1,cr[1]-2,0.7); } }
  var dTop=rows[rows.length-1][0]-dd; for (var i2=0;i2<=32;i2++){ var a2=Math.PI*i2/32, q=fp(HX-Math.cos(a2)*hw*2,dTop-Math.sin(a2)*3.4); dot(q[0],q[1],0.85,1); }
  var nb=fp(HX,dTop-1.6); micro('NEBO',nb[0]-7,nb[1]-2,0.65);
  var st=fp(HX+2.5,26.0-1.3); dot(st[0],st[1],1,1); dot(st[0]+1,st[1],1,1); dot(st[0],st[1]+1,0.8,1);
  Object.keys(pts).forEach(function(k){ k=+k; var x=k%W, y=(k/W)|0, R=flo[k]?1:2; for (var dy=-R;dy<=R;dy++) for (var dx=-R;dx<=R;dx++){ var d=Math.abs(dx)+Math.abs(dy); if (!d||d>R+1) continue; var kk=(y+dy)*W+(x+dx); if (!pts[kk]) glow[kk]=Math.max(glow[kk]||0,(R+2-d)/(R+1)*pts[k]*(flo[k]?0.7:1)); } });
  var pk=Object.keys(pts).map(Number), gk=Object.keys(glow).map(Number);
  CHALK={pk:Int32Array.from(pk), pv:Float32Array.from(pk.map(function(k){ return pts[k]; })), gk:Int32Array.from(gk), gv:Float32Array.from(gk.map(function(k){ return glow[k]; }))}; return CHALK; }
function ghost(fb,v,S,GS){ var C=chalkLines(), t=v.t, cam=v.cam, bg=BG, tg=M.TINT.ghost; if (!bg||!CHALKOK) return;
  var breath=0.84+Math.sin(t*0.9)*0.12;
  function visible(x,y){ var sx=x-cam, k=y*W+x; if (sx<0||sx>=fb.w||!CHALKOK[k]) return false; return fb.d[y*fb.w+sx]===M.tintPx(tg,bg.d[k],sx,y); }
  var i, k;
  for (i=0;i<C.gk.length;i++){ k=C.gk[i]; var x=k%W, y=(k/W)|0; if (!visible(x,y)) continue; var g=C.gv[i]*breath; if (bayer(x,y)<g*0.55) fb.d[y*fb.w+x-cam]=g>0.8?P.x3:P.x2; }
  for (i=0;i<C.pk.length;i++){ k=C.pk[i]; var x2=k%W, y2=(k/W)|0; if (!visible(x2,y2)) continue; var vv=C.pv[i], wave=Math.sin(t*1.7-x2*0.08-y2*0.05)*0.5+0.5, lev=vv*breath+wave*0.18;
    var c=lev>0.95?P.x6:(lev>0.72?P.x5:(lev>0.5?P.x4:P.x3)); if (hash(x2,y2)<0.1) c=M.DN[c]; fb.d[y2*fb.w+x2-cam]=c; }
  M.dust(fb,t*0.4,60,60,200,60,10,P.x4); }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<106||y>140||x<6||x>304) return false; var f=fl(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (X<BX0+4||X>BX1-30) return false;
  if (Z<CAB.Z1+4 && X<CAB.X1+3) return false;
  if (X>PIA.X0-6 && X<PIA.X1+6 && Z>PIA.Z0-3 && Z<PIA.Z1+3) return false;
  if (X>BEN.X0-2 && X<BEN.X1+2 && Z>BEN.Z0-2 && Z<BEN.Z1+2) return false;
  if (x>=262) return false;
  if (x<36 && y<134) return false;
  if (Z<12 && X>220) return false;
  return true; }
M.defineArt('salon',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var base=baseOf(S,tod); if (!base) return null; return levels(base)[1].a; },
  spots:{
    door:[DOOR.X0-3,DOOR.Y0-8,DOOR.X1-DOOR.X0+6,FY-DOOR.Y0+10],
    piano:[164,78,88,50],
    sheet:[164,78,88,40],
    bench:[150,100,20,24],
    gramophone:[54,30,32,54],
    cabinet:[46,82,40,32],
    beds:[256,58,64,70],
    windows:[56,14,206,72],
    chandelier:[140,0,40,52],
    chalk:[92,50,140,50],
    hopscotch:[94,108,76,34]
  },
  stands:{
    door:[64,116,'L'], piano:[178,134,'B'], sheet:[200,134,'B'], bench:[148,128,'R'], gramophone:[74,118,'B'], cabinet:[70,118,'B'],
    beds:[248,124,'R'], windows:[160,112,'B'], chandelier:[150,128,'B'], chalk:[124,112,'B'], hopscotch:[96,130,'B']
  },
  actorPos:{ bruno:[60,118,'F','bruno',true,'porter'], ljerkaNight:[160,120,'R','ljerkaNight',false,'sit'] },
  start:[66,124,'R'], entries:{ palma:[62,120,'R'] }
});
})(M);
