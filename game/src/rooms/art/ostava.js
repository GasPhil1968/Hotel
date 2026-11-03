/* ===== rooms/art/ostava.js — Die Kammer hinter der Kafana: schmal, staubig, vollgestellt.
   Links die Tür zurück in die Kafana (an ihrem Spalt ein warmer Lichtstreifen), vorn links ein Wandregal mit Gläsern,
   Dosen und Kaffeepäckchen, davor Jutesäcke mit Kaffee. Hinten hoch oben das Fensterchen mit Gitter, durch das ein grauer
   Lichtkeil schräg durch den Raum fällt, darunter alte Möbel unter Tüchern und ein eingerollter Teppich. Rechts lehnt der
   große alte Spiegel im schweren, vergoldeten Rahmen an der Wand, halb mit einem Tuch verhängt, das Glas blind; unten am
   Rahmen links eine lose Leiste (S.frameOff: abgehebelt, dahinter ein Hohlraum mit einer verbeulten Blechkasse;
   S.tinTaken: leer). Vorn rechts Kisten mit leeren Flaschen „Sarajevsko“. In der Mitte die nackte Glühbirne am Kabel
   (S.lit: warmer Lichtkegel). Ohne S.lit ist es fast dunkel: nur das Fensterchen. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, VP=[160,50], RECT=[96,12,226,96], F=60, FY=96;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var MIR={x:176,y:26,w:42,h:70,fw:6};                   // Spiegel (Außenmaß), lehnt an der Rückwand
var BULB=[152,38];                                     // Glühbirne
var WIN={x:103,y:15,w:17,h:11};                        // Fensterchen hoch in der Rückwand
var DOORU=[4,26,44,96];                                // Tür zur Kafana in der linken Wand (u0,u1,vOben,vUnten)
var CRATE={x0:244,base:139};                           // Flaschenkisten vorn rechts
var SACK={x0:24,base:139};                             // Jutesäcke vorn links
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
var DQ=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]);
var WC=[WIN.x+WIN.w/2,WIN.y+WIN.h/2];
function inWin(x,y){ return x>=WIN.x&&x<WIN.x+WIN.w&&y>=WIN.y&&y<WIN.y+WIN.h; }

// ---------------------------------------------------------------- Licht: weiche Stufen zwischen Dunkel und Glühbirne (bzw. grauem Tageslicht)
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dark:function(r,g,b){ var L=lum(r,g,b); return [r*0.24+L*0.05+2, g*0.27+L*0.07+3, b*0.36+L*0.12+9]; },
  bulb:function(r,g,b){ var L=lum(r,g,b); return [r*0.78+L*0.32+24, g*0.62+L*0.24+10, b*0.38+L*0.08]; },
  grey:function(r,g,b){ var L=lum(r,g,b); return [r*0.52+L*0.30+6, g*0.55+L*0.31+8, b*0.6+L*0.33+14]; } };
var LV={};
function levels(kind){ if (LV[kind]) return LV[kind]; var a=[], n=6, A=TF.dark, B=TF[kind];
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.1)); }
  return LV[kind]=a; }
// grauer Lichtkeil vom Fensterchen schräg durch den Raum, bis vor den Spiegel
function beam(x,y){ var ax=WC[0], ay=WC[1], bx=204, by=114, vx=bx-ax, vy=by-ay, L2=vx*vx+vy*vy, t=((x-ax)*vx+(y-ay)*vy)/L2; if (t<0||t>1.12) return 0;
  var qx=ax+vx*t, qy=ay+vy*t, d=Math.hypot(x-qx,y-qy), w=4+t*19; if (d>w) return 0; return Math.min(1,(1-d/w)*1.6)*(0.9-t*0.3); }
function floorSpot(x,y){ var dx=(x-206)/36, dy=(y-112)/9, q=dx*dx+dy*dy; return q<1?(1-q)*0.75:0; }
function bulbAmt(x,y){ var dx=(x-BULB[0])/150, dy=(y-BULB[1]-30)/84, q=dx*dx+dy*dy, a=q<1?(1-q)*0.95:0; var fx=(x-BULB[0])/92, fy=(y-118)/22, f=fx*fx+fy*fy; if (f<1) a=Math.max(a,(1-f)*1.05); var g=Math.hypot(x-BULB[0],(y-BULB[1])*1.2); if (g<26) a=Math.max(a,1-g/34); return Math.min(1,a); }
function doorGlow(x,y){ var e=DQ[1], f=DQ[2], vx=f[0]-e[0], vy=f[1]-e[1], L2=vx*vx+vy*vy, t=((x-e[0])*vx+(y-e[1])*vy)/L2; if (t<0||t>1) return 0; var d=Math.hypot(x-(e[0]+vx*t),y-(e[1]+vy*t)); return d<5?(1-d/5)*0.8:0; }
function lightOf(S){ return S.lit ? function(x,y){ return bulbAmt(x,y); } : function(x,y){ return Math.max(beam(x,y),floorSpot(x,y)); }; }
function shade(b,ox,oy,S,mask){ var lit=!!S.lit, L=lightOf(S), Lv=levels(lit?'bulb':'grey'), n=Lv.length, WL=levels('bulb');
  M.light(b,function(x,y){ var a=L(x,y); return lit?(-0.9+a*1.2):(-2.5+a*2.4+doorGlow(x,y)*1.6); },ox,oy,mask);
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var a=L(X,Y), dg=lit?0:doorGlow(X,Y), f=a*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1;
    if (dg>0.05 && dg>a){ var j=Math.min(n-1,Math.round(dg*(n-1)+bayer(X,Y)-0.5)); b.d[k]=M.tintPx(WL[Math.max(0,j)],c,X,Y); continue; }
    b.d[k]=M.tintPx(Lv[i],c,X,Y); } }

// ---------------------------------------------------------------- Texturen
function plaster(u,v,x,y,seed){ var n=fbm(u*0.07+seed,v*0.06), c=M.rampAt(R('e2 e3 s3 s4'),0.52+(n-0.5)*0.8+(hash(u>>2,v>>1)-0.5)*0.1,x,y);
  var bare=fbm(u*0.045+seed*3,v*0.05+4); if (bare>0.7){ c=tex.bricks(u,v,R('t1 t2 t2 t3'),9,4); if (bare<0.72) c=P.s2; }
  if (v>56 && fbm(u*0.1,v*0.03+seed)>0.5 && bayer(x,y)<(v-56)/50) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return plaster(u+RECT[0],v,x,y,0); }
function wallSide(u,v,x,y,sd){ var c=plaster(u*1.6+(sd==='L'?0:500),v,x,y,sd==='L'?7:13); return sd==='L'?c:M.DN[c]; }
function floorTex(xb,d,x,y){ var c=tex.planks(xb,y,VP[1],FY,R('w0 w1 w2 w2'),12), f=R3.floor(x,y); if (!f) return c;
  var dust=fbm(f.X*0.05,f.Z*0.1); if (dust>0.56 && bayer(x,y)<(dust-0.56)*3) c=(hash(x,y)<0.5)?P.e2:P.e1; if (hash(Math.floor(f.X/2),Math.floor(f.Z))<0.01) c=P.k2; return c; }
function ceilTex(xb,d,x,y){ var c=tex.boards(xb,d*3,R('w0 w0 w1 w1'),8); if ((Math.floor(xb)%17)===0) c=P.k2; return c; }

// ---------------------------------------------------------------- kleine Malhilfen
function cloth(b,pts,seed,base){ var r0=base||R('s2 s3 s4 s5'), xs=pts.map(function(p){ return p[0]; }), x0=Math.min.apply(null,xs), ys=pts.map(function(p){ return p[1]; }), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);   // Tuch mit Falten
  b.poly(pts,function(x,y){ var f=Math.sin((x-x0)*0.5+Math.sin(y*0.08+seed)*1.8+seed)+Math.sin((x-x0)*0.19+seed*2)*0.6, v=(y-y0)/Math.max(1,y1-y0), c=M.rampAt(r0,0.6+f*0.24-v*0.18,x,y); if (hash(x>>1,y>>2)<0.04) c=M.DN[c]; return c; }); }
function jar(b,x,by,col,h,wd){ h=h||7; wd=wd||5; b.rect(x,by-h,wd,h,P.a6); b.rect(x+1,by-h+2,wd-2,h-2,col); b.vl(x,by-h,by-1,P.s6); b.hl(x,x+wd-1,by-h-1,P.m3); b.hl(x,x+wd-1,by-h,P.m2); b.px(x+wd-2,by-h+2,M.UP[col]); b.hl(x+1,x+wd-2,by-h+3,P.s5); }
function sack(b,cx,by,w,h,seed,label){   // Jutesack mit Kaffee, oben zusammengebunden
  b.poly([[cx-w/2,by],[cx+w/2,by],[cx+w/2-1,by-h*0.72],[cx+w/4,by-h],[cx-w/4,by-h],[cx-w/2+1,by-h*0.72]],function(x,y){ var u=(x-cx)/w, c=M.rampAt(R('e1 e2 e3 e4'),0.62-u*0.6-(y-(by-h))/h*0.12,x,y); if (((x+y*2)%3)===0) c=M.DN[c]; return c; });
  b.hl(rnd(cx-w/4),rnd(cx+w/4),rnd(by-h),P.e4); b.rect(rnd(cx)-1,rnd(by-h)-3,3,3,P.e3); b.px(rnd(cx),rnd(by-h)-4,P.e2); b.hl(rnd(cx)-2,rnd(cx)+2,rnd(by-h)+1,P.e1);
  if (label){ var lw=M.microWidth(label); M.microText(b.buf||b,label,rnd(cx-lw/2)-(b.buf?b.buf.ox:0),rnd(by-h*0.52)-(b.buf?b.buf.oy:0),P.w1); }
  b.hl(rnd(cx-w/2),rnd(cx+w/2),by,P.k2); }
function bottle(b,x,by,dark){ b.rect(x,by-6,2,6,dark?P.w0:P.w1); b.vl(x,by-6,by-1,dark?P.w1:P.w3); b.px(x,by-8,P.w1); b.px(x,by-7,P.w1); b.px(x,by-9,P.y2); }
// Spiegelrahmen: schweres, vergoldetes Profil
function frameCol(dx,dy,w,h,fw){ var d=Math.min(dx,dy,w-1-dx,h-1-dy), top=(dy<fw && dx>=dy && w-1-dx>=dy)||(dx<fw && dx<=dy && dx<=h-1-dy);
  var G=R('y0 y1 y2 y3 y4 y5'), c=G[top?3:2]; if (d===0) c=G[top?2:0]; else if (d===1) c=G[top?4:1]; else if (d===fw-1) c=G[top?2:1]; else if (d===fw-2) c=G[top?5:3];
  if (d>=2 && d<=fw-2 && ((dx+dy)%4===0)) c=G[1]; return c; }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), x, y, i, night=tod==='night';
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.k2); b.hl(RECT[0],RECT[2]-1,RECT[3]-1,P.w0);
  R3.box(b,RECT[0]-2,RECT[2]+2,RECT[1],RECT[1]+5,8,13,{bottom:P.w1,front:P.w0});                                   // Deckenbalken
  for (i=0;i<10;i++){ b.line(RECT[0],RECT[1]+i*1.4|0,RECT[0]+(10-i)*1.4|0,RECT[1],i%3?P.s3:P.s4); b.line(RECT[2]-1,RECT[1]+i|0,RECT[2]-1-(9-i)|0,RECT[1],i%2?P.s3:P.s2); }   // Spinnweben
  // ---- Fensterchen hoch in der Rückwand: tiefe Laibung, Gitterstäbe, blindes Glas
  b.rect(WIN.x-3,WIN.y-3,WIN.w+6,WIN.h+6,P.s2); b.hl(WIN.x-3,WIN.x+WIN.w+2,WIN.y+WIN.h+2,P.s4); b.rect(WIN.x-1,WIN.y-1,WIN.w+2,WIN.h+2,P.s1);
  b.fn(WIN.x,WIN.y,WIN.w,WIN.h,function(x,y){ var c=night?P.n1:(fbm(x*0.4,y*0.4)>0.55?P.s5:P.s4); if (hash(x,y)<0.15) c=M.DN[c]; return c; });
  // ---- Tür zur Kafana (links): Bretter, Riegel; offen, wenn die Kammertür in der Kafana offen ist
  var ko=GS.rooms&&GS.rooms.kafana&&GS.rooms.kafana.ostavaOpen;
  b.poly(M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3]),P.w0);
  b.poly(DQ,function(x,y){ var c=tex.boards(x*0.9,y*0.2,R('w0 w1 w2 w3'),6); if ((x%5)===0) c=P.w0; return c; });
  if (ko){ b.poly(M.wallQuad(SPEC,'L',DOORU[0]+8,DOORU[1],DOORU[2],DOORU[3]),function(x,y){ return M.rampAt(R('w3 w4 y3 y4'),0.3+(y-40)/90,x,y); }); var e0=rp(M.wallPt(SPEC,'L',DOORU[0]+8,DOORU[2])), e1=rp(M.wallPt(SPEC,'L',DOORU[0]+8,DOORU[3])); b.line(e0[0],e0[1],e1[0],e1[1],P.w0); }
  var rg=rp(M.wallPt(SPEC,'L',DOORU[1]-3,70)); b.rect(rg[0]-2,rg[1],5,2,P.m2); b.px(rg[0]-2,rg[1],P.m4); b.rect(rg[0]+2,rg[1]-1,2,4,P.m1);
  var bh=[rp(M.wallPt(SPEC,'L',DOORU[0]+2,56)),rp(M.wallPt(SPEC,'L',DOORU[0]+2,84))]; bh.forEach(function(p){ b.rect(p[0]-1,p[1],6,2,P.k2); b.px(p[0],p[1],P.m2); });   // Bänder
  // ---- Wandregal vorn links (groß, nah): Gläser, Dosen, Kaffeepäckchen
  [38,54,70].forEach(function(v,si){ var r=M.rng(51+si*5), u=32;
    while (u<62){ var p=rp(M.wallPt(SPEC,'L',u,v)), k=1+u/64, kind=Math.floor(r()*4), h, wd;
      if (kind===0){ h=rnd(6*k); wd=rnd(3.6*k); jar(b,p[0]-wd,p[1],[P.r2,P.g3,P.y3,P.t3][Math.floor(r()*4)],h,wd); }
      else if (kind===1){ h=rnd(7*k); wd=rnd(3.4*k); b.rect(p[0]-wd,p[1]-h,wd,h,P.r2); b.hl(p[0]-wd,p[0]-1,p[1]-h,P.m3); b.rect(p[0]-wd+1,p[1]-h+2,wd-2,2,P.y3); b.vl(p[0]-wd,p[1]-h,p[1]-1,P.r3); }
      else if (kind===2){ h=rnd(5*k); wd=rnd(4.4*k); b.rect(p[0]-wd,p[1]-h,wd,h,P.e4); b.hl(p[0]-wd,p[0]-1,p[1]-h,P.s5); M.microText(b,'K',p[0]-wd+1,p[1]-h+1,P.w1); }
      else { h=rnd(8*k); wd=rnd(2.2*k); b.rect(p[0]-wd,p[1]-h,wd,h,P.m2); b.vl(p[0]-wd,p[1]-h,p[1]-1,P.m4); }
      u+=(wd/k)+1.2+r()*1.5; }
    var a=rp(M.wallPt(SPEC,'L',30,v)), z=rp(M.wallPt(SPEC,'L',64,v)); b.line(a[0],a[1],z[0],z[1],P.w3); b.line(a[0],a[1]+1,z[0],z[1]+1,P.w2); b.line(a[0],a[1]+2,z[0],z[1]+2,P.w0); });
  [30,63].forEach(function(u){ var a=rp(M.wallPt(SPEC,'L',u,30)), z=rp(M.wallPt(SPEC,'L',u,96)); b.line(a[0],a[1],z[0],z[1],P.w1); b.line(a[0]-1,a[1],z[0]-1,z[1],P.w0); });
  // ---- Möbel unter Tüchern, Stuhl obenauf, eingerollter Teppich (hinten)
  cloth(b,[[123,96],[124,52],[126,44],[151,42],[154,47],[155,96]],1.3,R('m1 m2 s2 s3 s4'));                                    // Schrank
  for (y=46;y<96;y++){ b.px(154,y,P.m0); b.px(153,y,P.m1); b.px(124,y,P.s4); } b.hl(126,151,96,P.k1);
  cloth(b,[[146,96],[148,75],[151,66],[163,64],[168,70],[169,77],[175,79],[176,96]],2.7,R('m1 s1 s2 s3'));                   // Sessel
  b.line(127,44,151,42,P.s5); b.line(151,66,163,64,P.s4); b.line(169,77,175,79,P.s3); for (y=80;y<96;y++) b.px(175,y,P.m0);
  for (x=126;x<152;x++) if (bayer(x,93)<0.6) b.px(x,94,P.s2); for (x=148;x<176;x++) if (bayer(x,93)<0.6) b.px(x,94,P.s1);                           // Saum am Boden
  b.vl(130,30,42,P.w1); b.vl(146,30,41,P.w1); b.hl(130,146,30,P.w2); b.hl(130,146,34,P.w1); b.line(130,42,128,48,P.w1); b.line(146,41,148,47,P.w1);   // Stuhl kopfüber auf dem Schrank
  for (y=58;y<96;y++){ b.px(120+Math.round((y-58)*0.05),y,(y%4)?P.r1:P.r2); b.px(121+Math.round((y-58)*0.05),y,(y%3)?P.r2:P.y1); b.px(122+Math.round((y-58)*0.05),y,P.r0); }   // Teppichrolle
  b.ellipse(121,58,1.8,1.2,P.r3); b.px(121,58,P.y2);
  b.rect(100,74,18,22,P.w1); b.hl(100,117,74,P.w3); b.hl(100,117,84,P.w0); b.rect(102,77,14,5,P.w2); b.rect(102,87,14,7,P.w2); b.px(108,79,P.y2); b.px(108,90,P.y2);   // Kommode
  b.rect(103,66,6,8,P.t2); b.hl(103,108,66,P.t4); b.rect(110,69,6,5,P.m2); b.hl(110,115,69,P.m3);   // Krug, Kasten
  // ---- rechte Wand: Wandbord mit altem Kupfer, Haken mit Schürzen, Besen
  var rb0=rp(M.wallPt(SPEC,'R',2,52)), rb1=rp(M.wallPt(SPEC,'R',40,52)); b.line(rb0[0],rb0[1],rb1[0],rb1[1],P.w3); b.line(rb0[0],rb0[1]+1,rb1[0],rb1[1]+1,P.w0);
  [[6,4],[16,6],[27,3],[35,5]].forEach(function(p0){ var p=rp(M.wallPt(SPEC,'R',p0[0],52)), s=p0[1], k=1+p0[0]/66;
    b.ellipse(p[0],p[1]-s*k*0.6,s*k*0.7,s*k*0.6,function(xx,yy){ return (xx<p[0])?P.t4:((xx<p[0]+2)?P.t3:P.t2); }); b.hl(p[0]-rnd(s*k*0.7),p[0]+rnd(s*k*0.7),p[1]-rnd(s*k*1.1),P.t5); b.px(p[0]+rnd(s*k*0.3),p[1]-rnd(s*k*0.5),P.t1); });
  [[10,62],[20,63]].forEach(function(h,i){ var p=rp(M.wallPt(SPEC,'R',h[0],h[1])), k=1+h[0]/66; b.px(p[0],p[1],P.m3); b.poly([[p[0]-2,p[1]+1],[p[0]+2,p[1]+1],[p[0]+3*k,p[1]+16*k],[p[0]-3*k,p[1]+16*k]],function(xx,yy){ return (xx+yy)%4===0?(i?P.e2:P.r1):(i?P.e3:P.r2); }); });
  var bm0=rp(M.wallPt(SPEC,'R',30,40)), bm1=rp(M.wallPt(SPEC,'R',36,96)); b.line(bm0[0],bm0[1],bm1[0],bm1[1],P.w3); b.line(bm0[0]+1,bm0[1],bm1[0]+1,bm1[1],P.w1);
  for (i=-4;i<=4;i++) b.line(bm1[0],bm1[1],bm1[0]+i,bm1[1]-12+Math.abs(i),P.e3);                                                                  // Besen
  // ---- mehr Kram: Stapel alter Stühle, Kaffeeröster, Kanister, eine Kiste mit Džezve, ein altes Blechschild, Kaffeebohnen am Boden
  for (i=0;i<3;i++){ var cy0=70+i*7, cx0=224+i*2; b.hl(cx0,cx0+14,cy0,P.w3); b.hl(cx0,cx0+14,cy0+1,P.w1); b.vl(cx0+1,cy0+1,cy0+6,P.w2); b.vl(cx0+13,cy0+1,cy0+6,P.w1); b.vl(cx0+13,cy0-8,cy0,P.w2); b.hl(cx0+10,cx0+13,cy0-8,P.w3); }   // gestapelte Stühle
  b.vl(225,91,96,P.w1); b.vl(238,91,96,P.w1);
  var ro=[252,86]; b.ellipse(ro[0],ro[1],6,4,function(xx,yy){ return (yy<ro[1]-1)?P.m2:P.m1; }); b.hl(ro[0]-6,ro[0]+6,ro[1]-2,P.m3); b.rect(ro[0]+6,ro[1]-1,4,2,P.w1); b.line(ro[0]-3,ro[1]+3,ro[0]-5,96,P.k2); b.line(ro[0]+3,ro[1]+3,ro[0]+5,96,P.k2); b.px(ro[0]-2,ro[1]-3,P.m4);   // Kaffeeröster (Trommel)
  b.rect(118,89,7,8,P.r2); b.hl(118,124,89,P.r3); b.rect(120,87,3,2,P.k2); b.vl(124,90,96,P.r1);                                                    // Kanister
  var dk=[156,90]; b.rect(dk[0],dk[1],16,6,P.w2); b.hl(dk[0],dk[0]+15,dk[1],P.w4); for (i=0;i<5;i++){ var dzx=dk[0]+2+i*3; b.rect(dzx,dk[1]-3,2,3,(i%2)?P.t3:P.y2); b.px(dzx,dk[1]-3,(i%2)?P.t5:P.y4); b.px(dzx+2,dk[1]-3,P.w1); }   // Kiste mit alten Džezve
  var sq=M.wallQuad(SPEC,'R',44,60,70,86); b.poly(sq,P.b0); b.poly(M.wallQuad(SPEC,'R',45,59,72,84),P.s3); var sp0=rp(M.wallPt(SPEC,'R',46,76)); M.microText(b,'KAFA',sp0[0]+1,sp0[1],P.r1);   // altes Emailschild
  for (i=0;i<18;i++){ var bx2=150+Math.floor(hash(i,21)*40), by2=99+Math.floor(hash(i,22)*6); b.px(bx2,by2,(i%3)?P.w0:P.w1); }                       // verschüttete Kaffeebohnen
  b.rect(180,97,9,2,P.m1); b.hl(180,188,97,P.m3); b.px(182,96,P.m2);                                                                               // Mausefalle
  // ---- der Spiegel
  var mx=MIR.x, my=MIR.y, mw=MIR.w, mh=MIR.h, fw=MIR.fw, gx0=mx+fw, gy0=my+fw, gw=mw-2*fw, gh=mh-2*fw-3;
  for (y=my+3;y<my+mh+1;y++) for (x=mx+mw;x<mx+mw+3;x++) if (bayer(x,y)<0.7) b.px(x,y,M.DN[M.DN[b.get(x,y)]]);               // Schatten an der Wand
  for (y=gy0;y<gy0+gh;y++) for (x=gx0;x<gx0+gw;x++){ var u=(x-gx0)/gw, v=(y-gy0)/gh, n=fbm(x*0.08+3,y*0.06), c=M.rampAt(R('m1 m2 m3 m4 s4'),0.48+(n-0.5)*1.1+(u-v)*0.25,x,y);
      var e=Math.min(u,1-u,v,1-v), ox2=fbm(x*0.3+7,y*0.25); if (e<0.14 && ox2>0.48) c=(ox2>0.6)?P.k2:P.m1;                          // die Versilberung blüht vom Rand her aus
      var sp=fbm(x*0.45+9,y*0.45); if (sp>0.73) c=P.m1; if (Math.abs((u*1.7+v)-1.1)<0.03) c=P.s5; if (Math.abs((u*1.7+v)-1.22)<0.02) c=P.s4; if (v>0.84 && bayer(x,y)<(v-0.84)*4) c=P.m1; b.px(x,y,c); }
  b.rect(gx0+gw-14,gy0+30,7,24,P.m1); b.vl(gx0+gw-14,gy0+30,gy0+53,P.m2); b.hl(gx0+gw-14,gx0+gw-8,gy0+30,P.m2);                           // Spiegelbild: die Tür
  b.ellipse(gx0+gw-9,gy0+11,2,2.4,S.lit?P.y4:P.m2); if (S.lit) b.px(gx0+gw-9,gy0+11,P.l1); b.vl(gx0+gw-9,gy0,gy0+8,P.m1);                      // die Birne
  for (y=my;y<my+mh;y++) for (x=mx;x<mx+mw;x++){ var dx=x-mx, dy=y-my; if (dx>=fw && dx<mw-fw && dy>=fw && dy<mh-fw-3) continue; if (dy>=mh-fw-3) continue; b.px(x,y,frameCol(dx,dy,mw,mh-3,fw)); }
  [[mx,my],[mx+mw-7,my],[mx,my+mh-14],[mx+mw-7,my+mh-14]].forEach(function(o){ b.rect(o[0]+1,o[1]+1,5,5,P.y2); b.px(o[0]+3,o[1]+3,P.y5); b.px(o[0]+2,o[1]+2,P.y4); b.px(o[0]+4,o[1]+4,P.y1); });   // Eckrosetten
  b.ellipse(mx+mw/2,my+1.5,7,3.2,function(xx,yy){ return yy<my+1?P.y4:P.y2; }); b.px(rnd(mx+mw/2),my-2,P.y4); b.px(rnd(mx+mw/2),my-1,P.y3);       // Bekrönung
  // unterer Rahmensockel mit Leiste (links lose)
  var sy=my+mh-3-fw, sh=fw+3; b.rect(mx-1,sy,mw+2,sh,P.y1); b.hl(mx-1,mx+mw,sy,P.y3); b.hl(mx-1,mx+mw,sy+sh-1,P.y0); for (x=mx+2;x<mx+mw-2;x+=3) b.px(x,sy+2,P.y3);
  if (!S.frameOff){ b.rect(mx+1,sy+3,mw-2,3,P.y2); b.hl(mx+1,mx+mw-2,sy+3,P.y4); b.hl(mx+1,mx+mw-2,sy+5,P.y0);
    b.line(mx+1,sy+3,mx+15,sy+4,P.y5); b.px(mx+16,sy+4,P.k1); b.hl(mx+2,mx+14,sy+6,P.k1); b.px(mx+1,sy+7,P.k2); b.px(mx+3,sy+2,P.m4); }           // die lose Leiste: steht vorn ab, ein Nagel
  else { b.rect(mx+2,sy+2,mw-6,5,P.k0); b.hl(mx+2,mx+mw-5,sy+2,P.k1); b.vl(mx+2,sy+2,sy+6,P.y0);
    if (!S.tinTaken){ b.rect(mx+8,sy+3,15,4,P.m2); b.hl(mx+8,mx+22,sy+3,P.m4); b.px(mx+12,sy+4,P.m1); b.px(mx+13,sy+4,P.m1); b.px(mx+14,sy+5,P.m3); b.rect(mx+18,sy+4,3,2,P.r1); b.px(mx+19,sy+4,P.y2); b.vl(mx+22,sy+3,sy+6,P.m1); }
    else { for (x=mx+4;x<mx+mw-6;x++) if (hash(x,5)<0.3) b.px(x,sy+6,P.e1); }
    b.line(mx-8,sy+sh+5,mx+18,sy+sh+8,P.y3); b.line(mx-8,sy+sh+6,mx+18,sy+sh+9,P.y1); b.px(mx+18,sy+sh+8,P.k1); b.px(mx-6,sy+sh+4,P.m4); }      // die abgehebelte Leiste liegt am Boden
  // das Tuch: über die linke obere Ecke, halb über das Glas, unten zusammengeschoppt
  cloth(b,[[mx-3,my-3],[mx+mw*0.56,my-4],[mx+mw*0.5,my+8],[mx+mw*0.36,my+30],[mx+mw*0.26,my+48],[mx+mw*0.16,my+60],[mx+3,my+63],[mx-4,my+56],[mx-3,my+20]],4.1,R('s2 s3 s4 s5'));
  b.line(rnd(mx+mw*0.56),my-4,rnd(mx+mw*0.36),my+30,P.s2); b.line(rnd(mx+mw*0.36),my+30,rnd(mx+mw*0.16),my+60,P.s1); b.line(mx-3,my-3,rnd(mx+mw*0.56),my-4,P.s5);
  // ---- Glühbirne am Kabel
  b.vl(BULB[0],0,BULB[1]-4,P.k1); b.rect(BULB[0]-1,BULB[1]-4,3,2,P.m2); b.ellipse(BULB[0]+0.5,BULB[1]+0.5,2.2,2.8,S.lit?P.s6:P.m3); b.px(BULB[0]-1,BULB[1]-1,P.s6);
  b.line(BULB[0]+1,3,BULB[0]+18,3,P.k1); b.line(BULB[0]+18,3,BULB[0]+22,6,P.k1);
  // ---- Licht
  shade(b,0,0,S,function(x,y){ return !inWin(x,y); });
  if (!S.lit){ b.fn(WIN.x,WIN.y,WIN.w,WIN.h,function(x,y){ var c=night?P.n2:(fbm(x*0.4,y*0.4)>0.55?P.s6:P.s5); if (hash(x,y)<0.12) c=P.s4; return c; }); }
  else { b.ellipse(BULB[0]+0.5,BULB[1]+0.5,2.2,2.8,P.l0); b.px(BULB[0],BULB[1],P.l1); b.px(BULB[0]-1,BULB[1]-1,P.l1); }
  for (i=1;i<3;i++) b.vl(WIN.x+rnd(WIN.w*i/3),WIN.y,WIN.y+WIN.h-1,P.k1); b.hl(WIN.x,WIN.x+WIN.w-1,WIN.y+(WIN.h>>1),P.k1);                       // Gitter
  if (!S.lit){ b.px(mx+mw-7,sy+1,P.y4); b.px(mx+mw-4,sy-10,P.y3); b.px(mx+mw-3,sy-24,P.y2); }   // Glanz am Rahmen, wo der Keil auftrifft
  return b; }

// ---------------------------------------------------------------- Ebenen: Flaschenkisten vorn rechts, Kaffeesäcke vorn links
function layers(S,GS,tod){ var L=[], lay=M.layer(232,70,88,74,CRATE.base), w=M.lw(lay), x0=CRATE.x0, by=CRATE.base;
  function crate(x,yb,cw,ch,lbl,top){ w.rect(x,yb-ch,cw,ch,P.w2); w.hl(x,x+cw-1,yb-ch,P.w4); w.hl(x,x+cw-1,yb-1,P.w0); w.vl(x,yb-ch,yb-1,P.w3); w.vl(x+cw-1,yb-ch,yb-1,P.w0);
    w.hl(x+1,x+cw-2,yb-ch+3,P.w1); for (var gx=x+4;gx<x+cw-4;gx+=9) w.rect(gx,yb-ch+2,5,2,P.k1);   // Grifflöcher
    if (lbl){ var lw=M.microWidth(lbl); M.microText(w.buf,lbl,x+((cw-lw)>>1)-lay.ox,yb-ch+8-lay.oy,P.w0); M.microText(w.buf,lbl,x+((cw-lw)>>1)-lay.ox,yb-ch+7-lay.oy,P.e3); }
    if (top) for (var bx=x+2;bx<x+cw-2;bx+=3) bottle(w,bx,yb-ch,(bx%2)===0); }
  crate(x0+4,by,48,17,'SARAJEVSKO',false); crate(x0+2,by-17,46,16,'SARAJEVSKO',true); crate(x0+54,by+1,30,15,null,true);
  w.hl(x0,x0+86,by,P.k1);
  shade(lay,lay.ox,lay.oy,S); L.push(lay);
  var sl=M.layer(0,100,96,44,SACK.base), sw=M.lw(sl);
  sack(sw,40,SACK.base,26,26,3,'KAFA'); sack(sw,64,SACK.base-2,22,20,5); sack(sw,18,SACK.base+1,24,22,7); sack(sw,30,SACK.base-24,18,12,9);
  shade(sl,sl.ox,sl.oy,S); L.push(sl);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Staub im Licht
function dyn(fb,v,S,GS){ var t=v.t, L=lightOf(S);
  for (var i=0;i<24;i++){ var u=(hash(i,1)+t*0.012*(0.4+hash(i,2)))%1, x, y;
    if (!S.lit){ x=rnd(WC[0]+(204-WC[0])*u+(hash(i,3)-0.5)*16+Math.sin(t*0.6+i)*2); y=rnd(WC[1]+(114-WC[1])*u+(hash(i,4)-0.5)*10+Math.cos(t*0.5+i)*2); if (beam(x,y)<0.3) continue; }
    else { x=rnd(BULB[0]+(hash(i,3)-0.5)*110+Math.sin(t*0.4+i)*3); y=rnd(46+u*70); if (L(x,y)<0.5) continue; }
    if (Math.sin(t*1.4+i*1.9)>0.15) fb.px(x,y,S.lit?P.y4:P.s5); } }

// ---------------------------------------------------------------- Geistersicht: hinter dem Spiegel unten ein warmes Pulsieren
function ghost(fb,v,S,GS){ if (S.tinTaken) return; var t=v.t, cx=MIR.x+16, cy=MIR.y+MIR.h-6, pu=0.5+0.5*Math.sin(t*2.1), a=0.35+pu*0.45;
  for (var y=cy-14;y<cy+9;y++) for (var x=cx-26;x<cx+26;x++){ var d=Math.hypot((x-cx)/24,(y-cy)/9); if (d>1) continue; if (bayer(x+(t*2|0),y)<(1-d)*a) fb.px(x,y,d<0.35?P.x6:(d<0.7?P.x5:P.x4)); }
  for (var i=0;i<8;i++){ var ph=(t*0.3+hash(i,4))%1, gx=rnd(cx-16+hash(i,5)*32), gy=rnd(cy-2-ph*26); fb.px(gx,gy,ph<0.4?P.x6:P.x4); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<103||y>140||x<4||x>316) return false; var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (X<RECT[0]+5||X>RECT[2]-5) return false;
  if (x<90 && y>115) return false;                                  // Kaffeesäcke vorn links
  if (x>CRATE.x0 && y>124) return false;                            // Flaschenkisten
  return true; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
var DOORST=R3.st(104,18,'L');
M.defineArt('ostava',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (a.ghost) return undefined; var L=S.lit?bulbAmt(a.x,a.y-24):Math.max(beam(a.x,a.y-20),floorSpot(a.x,a.y)), Lv=levels(S.lit?'bulb':'grey'); return Lv[Math.max(0,Math.min(Lv.length-1,Math.round(L*(Lv.length-1))))].a; },
  spots:{
    door:qrect(M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3])),
    mirror:[MIR.x-4,MIR.y-5,MIR.w+8,MIR.h-6],
    frame:[MIR.x-2,MIR.y+MIR.h-MIR.fw-4,20,10],
    shelves:qrect(M.wallQuad(SPEC,'L',30,64,26,72)),
    sacks:[4,108,84,32],
    crates:[CRATE.x0,88,W-CRATE.x0,52],
    furniture:[99,30,77,66],
    window:[WIN.x-4,WIN.y-4,WIN.w+8,WIN.h+8],
    bulb:[BULB[0]-5,BULB[1]-10,11,16]
  },
  stands:{ door:[DOORST[0],DOORST[1]+2,'L'], mirror:[200,108,'B'], frame:[188,107,'B'], shelves:[92,128,'L'], sacks:[96,126,'L'], crates:[230,124,'R'], furniture:[140,106,'B'], window:[118,108,'B'], bulb:[152,116,'B'] },
  start:[DOORST[0]+2,DOORST[1]+3,'R'], entries:{ kafana:[DOORST[0]+2,DOORST[1]+3,'R'] }
});
})(M);
