/* ===== rooms/art/carsija.js — Baščaršija (640 px, scrollend) =====
   Links die Endhaltestelle: das Gleis läuft hinten herein, wendet in einer Schleife und läuft vorn wieder hinaus; auf der
   Insel dazwischen das Wartehäuschen „BAŠČARŠIJA“ mit der Bank davor und das Blechhäuschen des Fahrdienstleiters
   (Fenster mit Vorhang, Telefon, „VOZNI RED“, Thermoskanne auf dem Sims, ein Ofenrohr). Masten und Fahrdraht darüber.
   S.tramIn: eine Tatra K2 der Linie 3 steht hinten in der Schleife, die Türen offen.
   Mitte: der Platz mit dem Sebilj (hölzerner Brunnenkiosk, grüne Kuppel), Tauben, dahinter niedrige Holzläden mit
   Kepenci unter Ziegel- und Bleidächern, die Baščaršija-Moschee mit Bleikuppel, Vorhalle und Minarett.
   Rechts die Ćevabdžinica (Rauch aus dem Kamin), hinten die Gasse zur Sahat-kula, deren Turm über die Dächer schaut,
   und am rechten Rand der Eingang nach Kazandžiluk mit hängenden Kupfertellern. Kaldrma, Laternen, Hügel im Dunst. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=640, H=144, GY=100, HZ=70;
// ---------------------------------------------------------------- Geometrie
var BT={far:101,near:105};                 // hinteres Gleis (Schienen)
var FT={far:122,near:127};                 // vorderes Gleis
var LOOP={cx:214,cy:113.5,ro:[27,12.5],ri:[23,8.5]};
var ISL={y0:107,y1:120};                   // Insel zwischen den Gleisen
var TRAM={x:-100,rail:105,s:0.62};
var SHEL={x0:58,x1:112,top:64,base:108};   // Wartehäuschen
var BENCH={x0:64,x1:104,seat:104,base:118};
var BOOTH={x0:144,x1:186,top:64,base:108,win:[147,76,16,13]};
var POLES=[18,128,238];
var WIRE={back:38,front:28};
var LAMPS=[{x:252,base:110,h:50},{x:476,base:106,h:44},{x:602,base:110,h:46}];
var SEB={cx:368,base:108};
var SHOPS=[[244,272,'copper'],[272,300,'rugs'],[300,330,'shut'],[330,362,'souvenir'],[362,394,'copper2']];
var MOSQ={x0:396,x1:468,mx:470};
var CEV={x0:482,x1:542};
var LANE={x0:542,x1:578,far0:553,far1:567,fy:84};
var KAZ={x0:612};
var KULA={x:560};
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
// Mikroschrift mit Đ (M.microText kennt es nicht)
function micro(b,s,x,y,c){ var parts=s.split('Đ'), cx=x; parts.forEach(function(p,i){ if (p.length){ M.microText(b,p,cx,y,c); cx+=M.microWidth(p)+1; } if (i<parts.length-1){ [[1,0],[2,0],[1,1],[3,1],[0,2],[1,2],[2,2],[3,2],[1,3],[3,3],[1,4],[2,4]].forEach(function(q){ b.px(cx+q[0],y+q[1],c); }); cx+=5; } }); }

// ---------------------------------------------------------------- Licht
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
function lightsFor(tod,wea,S){ if (tod==='day') return []; var fog=wea==='fog', night=tod==='night', L=[];
  LAMPS.forEach(function(l){ L.push([l.x+1,l.base-l.h+6,fog?40:30,fog?40:30,0.95],[l.x+1,l.base+6,32,10,tod==='dusk'?0.4:0.55]); });
  L.push([BOOTH.win[0]+8,BOOTH.win[1]+6,22,18,0.7],[BOOTH.x0+18,BOOTH.base+5,26,8,0.4]);              // Häuschen
  L.push([(SHEL.x0+SHEL.x1)/2,SHEL.top+4,34,14,0.45],[(SHEL.x0+SHEL.x1)/2,SHEL.base+4,34,9,0.35]);    // Wartehäuschen
  L.push([505,82,32,24,0.8],[505,108,38,10,0.55],[531,82,12,22,0.5]);                                  // Ćevabdžinica
  L.push([560,92,16,20,0.4],[625,70,20,30,0.45]);                                                      // Gassen
  if (!night) L.push([258,80,18,18,0.45],[346,80,18,18,0.45],[378,82,16,16,0.45],[594,82,16,16,0.5]);   // Läden noch offen
  if (S && S.tramIn) L.push([60,78,120,24,0.4],[130,108,110,8,0.3]);
  return L; }

// ---------------------------------------------------------------- Masken: Tiefe (Nebel), Schneeflächen, Pflaster, Himmel
var DEP=new Uint8Array(W*H), SNOW=new Uint8Array(W*H), PAVE=new Uint8Array(W*H), SKYM=new Uint8Array(W*H), TRAMM=new Uint8Array(W*H);
function stage(b,d,fn){ var s=b.d.slice(); fn(); for (var k=0;k<W*H;k++) if (b.d[k]!==s[k]) DEP[k]=d; }
function snowRect(x0,y0,w,h){ for (var y=Math.max(0,y0);y<Math.min(H,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(W,x0+w);x++) SNOW[y*W+x]=1; }

// ---------------------------------------------------------------- Himmel
function paintSky(s,tod,wea){ var x, y;
  if (wea==='fog'||wea==='snow'||wea==='rain'){ M.scn.sky(s,0,0,W,H,tod,wea,57);
    if (tod==='night' && wea!=='rain') for (y=30;y<96;y++) for (x=0;x<W;x++){ var g=(y-30)/66; if (bayer(x,y)<g*0.55) s.px(x,y,(g>0.55&&bayer(x+2,y)<0.35)?P.d0:P.m1); }
    return; }
  if (tod==='day'){ var D=R('b1 b2 b3 b4 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(D,0.16+Math.pow(y/90,1.3)*0.82,x,y));
    var r=M.rng(31); for (var i=0;i<8;i++){ var cx=r()*W, cy=5+r()*24, L=40+r()*70; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy+Math.sin(k*0.07+i)*1.6); var a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.3) s.px(xx,yy,P.b5); } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(N,0.05+Math.pow(y/96,1.4)*0.8+(vn(x*0.02,y*0.06,3)-0.5)*0.05,x,y));
    var r2=M.rng(91); for (var j=0;j<320;j++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.5)*64), q=r2(); s.px(sx,sy,q<0.08?P.n5:(q<0.4?P.n4:P.n3)); }
    [[88,8],[301,14],[455,6],[590,20],[201,26]].forEach(function(p){ s.px(p[0],p[1],P.l1); s.px(p[0]-1,p[1],P.n3); s.px(p[0]+1,p[1],P.n3); s.px(p[0],p[1]-1,P.n3); s.px(p[0],p[1]+1,P.n3); });
    return; }
  M.sky(s,0,0,W,96,tod,19); }

// ---------------------------------------------------------------- Ferne: Hügel mit Häusern (Vratnik, Kovači)
function hillY(x){ return 46+Math.sin(x*0.009+0.6)*9+Math.sin(x*0.031+2)*3+(vn(x*0.05,1.7,2)-0.5)*5-Math.max(0,1-Math.abs(x-470)/150)*10; }
function paintHills(b,tod,wea){ var x, y, G=R('e1 e2 e3 e4'), GC=R('g0 g1 g2 g3'), GR=R('t1 t2 e2 e3');
  for (x=0;x<W;x++){ var top=rd(hillY(x)); for (y=top;y<92;y++){ var d=(y-top)/40, f=fbm(x*0.08,y*0.2,4), v=0.55-d*0.25+(f-0.5)*0.6+(y===top?0.25:0), n2=fbm(x*0.12+7,y*0.3,6), c=(n2>0.6)?ra(GC,v,x,y):((n2<0.32)?ra(GR,v,x,y):ra(G,v,x,y)); b.px(x,y,c); }
    if (tod==='day' && wea==='calm' && top<52 && bayer(x,top)<0.7) b.px(x,top,P.s5); }
  // Häuser am Hang: weiße Würfel mit roten Dächern, nachts einzelne Lichter
  var r=M.rng(5); for (var i=0;i<90;i++){ var hx=Math.floor(r()*W), ht=hillY(hx), hy=rd(ht+4+r()*30); if (hy>88) continue; var w=3+Math.floor(r()*3);
    b.rect(hx,hy,w,3,P.s4); b.hl(hx,hx+w-1,hy-1,P.t3); b.px(hx,hy,P.s5); if (r()<0.5) b.px(hx+1,hy+1,P.k2); } }
function hillLights(b){ var r=M.rng(5); for (var i=0;i<90;i++){ var hx=Math.floor(r()*W), ht=hillY(hx), hy=rd(ht+4+r()*30); if (hy>88){ continue; } var w=3+Math.floor(r()*3); r(); if (hash(i,3)<0.45) b.px(hx+1,hy+1,hash(i,4)<0.5?P.y3:P.y2); } }

// ---------------------------------------------------------------- Sahat-kula über den Dächern am Ende der Gasse
function paintFarTower(b){ var x=KULA.x, x0=x-6, x1=x+6, y;
  for (y=12;y<72;y++) for (var xx=x0;xx<=x1;xx++){ var c=(xx===x0)?P.s5:((xx>=x1-1)?P.s2:((((y>>2)+(xx>>2))&1)?P.s3:P.s4)); if ((y&3)===0) c=P.s2; b.px(xx,y,c); }
  for (y=3;y<11;y++){ var hw=Math.round((y-1)*0.9); b.hl(x-hw,x+hw,y,(y<5)?P.m3:P.m2); } b.vl(x,0,2,P.y2); b.hl(x0-1,x1+1,11,P.m1);
  b.rect(x-3,13,7,6,P.k1); b.px(x,15,P.y2); b.hl(x0,x1,19,P.s5);
  b.ellipse(x+0.5,25.5,4.6,4.6,P.k2); b.ellipse(x+0.5,25.5,3.6,3.6,P.s5); b.px(x,23,P.k1); b.px(x,24,P.k1); b.px(x+1,25,P.k1); b.px(x+2,26,P.k1); }

// ---------------------------------------------------------------- Holzläden der Čaršija
function roofTiles(b,x0,x1,y0,y1,lead){ for (var y=y0;y<y1;y++){ var t=(y-y0)/(y1-y0); for (var x=x0;x<x1;x++){ var c;
      if (lead){ c=((x-x0)%6===0)?P.m2:(t<0.3?P.m4:P.m3); if (y===y1-1) c=P.m1; }
      else { var rr=y1-1-y; c=((x+rr*2)%5===0)?P.t1:((rr%3===0)?P.t2:P.t3); if (rr===0) c=P.t1; else if (rr===1) c=P.t4; if (fbm(x*0.4,y*0.6,9)>0.7) c=M.DN[c]; }
      b.px(x,y,c); } }
  snowRect(x0,y0,x1-x0,y1-y0); }
function shopFront(b,x0,x1,kind,night){ var x, y, top=70, oy0=74, oy1=94;
  for (y=top;y<GY;y++) for (x=x0;x<x1;x++){ var c=((x-x0)%7===0)?P.w1:P.w2; if (x===x0||x===x1-1) c=P.w0; if (y===top) c=P.w3; b.px(x,y,c); }
  var shut=night||kind==='shut';
  if (shut){ for (y=oy0-2;y<oy1+2;y++) for (x=x0+2;x<x1-2;x++){ var c2=((y-oy0)%4===0)?P.w0:(((x+((y>>2)&1)*3)%11===0)?P.w1:P.w2); b.px(x,y,c2); } b.hl(x0+2,x1-3,rd((oy0+oy1)/2),P.w0); b.px(x0+4,rd((oy0+oy1)/2)+2,P.m3); return; }
  for (y=oy0;y<oy1;y++) for (x=x0+2;x<x1-2;x++) b.px(x,y,(y<oy0+3)?P.k1:P.k2);
  // oberer Kepenk als Vordach hochgeklappt, unterer als Auslage
  for (x=x0;x<x1;x++){ b.px(x,oy0-3,P.w3); b.px(x,oy0-2,P.w2); b.px(x,oy0-1,P.w0); }
  for (x=x0+1;x<x1-1;x++){ b.px(x,oy1,P.w4); b.px(x,oy1+1,P.w3); b.px(x,oy1+2,P.w1); }
  var r=M.rng(x0*7+3), cw=x1-x0-4;
  if (kind==='copper'||kind==='copper2'){ for (var i=0;i<5;i++){ var cx=x0+4+Math.floor(r()*(cw-4)), cy=oy0+4+Math.floor(r()*8), rr=1.6+r()*1.6; b.vl(cx,oy0,cy-rd(rr),P.k1); b.ellipse(cx,cy,rr,rr,P.t3); b.px(cx-1,cy-1,P.t5); b.px(cx,cy+1,P.t1); }
    for (i=0;i<4;i++){ var dx=x0+3+i*Math.floor(cw/4); b.rect(dx,oy1-4,3,4,P.y2); b.px(dx,oy1-4,P.y4); b.px(dx+3,oy1-3,P.w1); } }
  else if (kind==='rugs'){ for (x=x0+3;x<x1-3;x++) for (y=oy0+2;y<oy1;y++){ var u=(x-x0-3)%9, pat=((u+y)%4===0)?P.y2:(((u-y+40)%4===0)?P.c2:P.r2); if (u===0) pat=P.r1; b.px(x,y,pat); } }
  else { for (i=0;i<6;i++){ var sx=x0+3+Math.floor(r()*(cw-3)), sy=oy0+3+Math.floor(r()*(oy1-oy0-6)); b.rect(sx,sy,2,3,[P.s5,P.b3,P.y3,P.r3,P.g4][i%5]); } }
  for (x=x0+2;x<x1-2;x+=3){ b.px(x,oy1-1,[P.t3,P.y3,P.s5,P.r3][(x>>1)%4]); } }
function paintShops(b,tod){ var night=tod==='night';
  SHOPS.forEach(function(s,i){ var x0=s[0], x1=s[1], lead=i===2, y0=54+(i%2)*3;
    roofTiles(b,x0-3,x1+3,y0,70,lead); for (var x=x0-3;x<x1+3;x++){ b.px(x,70,P.w0); dk(b,x,71,2); dk(b,x,72,1); } for (x=x0-1;x<x1+2;x+=4){ b.px(x,71,P.w1); }
    shopFront(b,x0,x1,s[2],night);
    if (i===1||i===3){ M.prop.window(b,x0+8,y0-10,6,7,{shut:true,col:R('w0 w1 w2 w3'),frame:R('s3 s4 s5 s6')}); for (var y=y0-13;y<y0;y++) for (x=x0+4;x<x1-4;x++) if (b.get(x,y)===T) b.px(x,y,tex.plaster(x,y,R('s4 s5 s5'),99)); M.prop.window(b,x0+8,y0-10,6,7,{shut:true,col:R('w0 w1 w2 w3'),frame:R('s3 s4 s5 s6')}); roofTiles(b,x0+2,x1-2,y0-18,y0-12,false); } });
  // ein Kamin
  b.rect(286,44,4,12,P.s3); b.vl(289,44,55,P.s2); b.hl(285,290,44,P.s4); }

// ---------------------------------------------------------------- Häuser hinter den Läden (Obergeschosse aus Holz, Erker), im Dunst
function paintBackHouses(b,tod){ var r=M.rng(23), x=236;
  while (x<400){ var w=18+Math.floor(r()*16), top=30+Math.floor(r()*14), c0=r()<0.5?R('s3 s4 s5'):R('e3 e4 s5'), y, xx;
    for (y=top;y<62;y++) for (xx=x;xx<Math.min(400,x+w);xx++){ var c=tex.plaster(xx,y,c0,99); if (xx===x) c=c0[2]; if (xx===x+w-1) c=c0[0]; if (y>top+9 && ((xx-x)%9===0)) c=P.w1; b.px(xx,y,c); }
    if (r()<0.6){ var ex=x+3+Math.floor(r()*(w-12)); for (y=top+8;y<top+17;y++) for (xx=ex;xx<ex+9;xx++) b.px(xx,y,(y===top+16)?P.w0:(((xx-ex)%3===0)?P.w1:P.w2)); b.rect(ex+2,top+10,5,4,P.k2); b.vl(ex+4,top+10,top+13,P.w1); }
    for (var k=0;k<2;k++){ var wx=x+2+Math.floor(r()*(w-6)), wy=top+3+Math.floor(r()*5); b.rect(wx,wy,3,4,P.k2); b.hl(wx-1,wx+3,wy+4,P.s5); }
    for (y=top-5;y<top;y++){ var ins=(top-y); for (xx=x-2+ins;xx<Math.min(400,x+w+2-ins);xx++) b.px(xx,y,((xx+y)%4===0)?P.t1:(y===top-1?P.t2:P.t3)); }
    snowRect(x-2,top-5,w+4,5);
    if (r()<0.4){ var cx=x+3+Math.floor(r()*(w-6)); b.rect(cx,top-9,2,5,P.s3); }
    x+=w+Math.floor(r()*3); } }
// ---------------------------------------------------------------- Baščaršija-Moschee: Hof, Vorhalle mit drei Kuppeln, Bleikuppel, Minarett
function paintMosque(b,tod){ var x0=MOSQ.x0, x1=MOSQ.x1, x, y, cx=(x0+x1)/2;
  // Gebetsraum (Würfel), Tambour, Bleikuppel
  for (y=40;y<GY;y++) for (x=x0+6;x<x1-6;x++){ var c=tex.ashlar(x,y,R('s2 s3 s4 s5'),9,4); if (x>x1-14) c=M.DN[c]; b.px(x,y,c); }
  for (y=36;y<41;y++) for (x=x0+10;x<x1-10;x++) b.px(x,y,(y===36)?P.s5:P.s3);
  var dr=22, dyb=37; for (y=dyb-dr;y<dyb;y++) for (x=rd(cx-dr);x<=rd(cx+dr);x++){ var dx=(x+0.5-cx)/dr, dy=(y+0.5-dyb)/dr; if (dx*dx+dy*dy>1) continue; var u=dx*0.55-dy*0.2, c2=u<-0.35?P.m4:(u<0.15?P.m3:(u<0.55?P.m2:P.m1)); if ((rd(x-cx)+60)%8===0 && dy>-0.85) c2=M.DN[c2]; b.px(x,y,c2); SNOW[y*W+x]=1; }
  b.vl(rd(cx),dyb-dr-7,dyb-dr-1,P.y2); b.px(rd(cx),dyb-dr-8,P.y3); b.px(rd(cx)-1,dyb-dr-6,P.y2); b.px(rd(cx)+1,dyb-dr-5,P.y2);
  // Fenster im Tambour
  for (var i=0;i<5;i++){ var wx=x0+14+i*9; b.rect(wx,44,3,6,P.k1); b.px(wx+1,43,P.k1); }
  // Vorhalle (son cemaat): drei Spitzbögen, drei kleine Bleikuppeln
  var py0=66; for (y=py0;y<GY;y++) for (x=x0;x<x1;x++){ var c3=tex.ashlar(x,y,R('s3 s4 s5 s5'),7,4); b.px(x,y,c3); }
  for (var k=0;k<3;k++){ var ax0=x0+5+k*22, ax1=ax0+18, acx=(ax0+ax1)/2; for (y=py0+6;y<GY;y++) for (x=ax0;x<ax1;x++){ var adx=Math.abs(x+0.5-acx), ins=y>=py0+14 || adx<(y-py0-6)*1.15; if (!ins) continue; b.px(x,y,(y>GY-6)?P.s2:((x<ax0+2)?P.k1:P.k2)); }
    for (x=ax0;x<ax1;x++){ var adx2=Math.abs(x+0.5-acx), yy=rd(py0+6+adx2/1.15)-1; if (yy<py0+14) b.px(x,yy,P.s6); }
    var dcx=ax0+9; for (y=py0-6;y<py0;y++) for (x=dcx-8;x<=dcx+8;x++){ var ddx=(x-dcx)/8, ddy=(y-py0)/6; if (ddx*ddx+ddy*ddy>1) continue; b.px(x,y,ddx<-0.2?P.m4:(ddx<0.4?P.m3:P.m2)); SNOW[y*W+x]=1; }
    b.px(dcx,py0-7,P.y2); }
  for (x=x0;x<x1;x++){ b.px(x,py0,P.s6); b.px(x,py0+1,P.s4); dk(b,x,py0+2,1); }
  // Hofmauer davor mit Tor
  for (y=86;y<GY;y++) for (x=x0-4;x<x1+4;x++){ if (x>rd(cx)-7 && x<rd(cx)+7 && y>88) continue; var c4=tex.ashlar(x*1.2,y,R('s2 s3 s4 s4'),8,4); if (y===86) c4=P.s5; b.px(x,y,c4); }
  snowRect(x0-4,86,x1-x0+8,1);
  // Minarett
  minaret(b,MOSQ.mx,GY,104); }
// schlankes osmanisches Minarett: quadratischer Sockel, vieleckiger Schaft, Šerefe mit Stalaktiten, Bleihelm mit Alem
function minaret(b,x,by,h){ var y, xx, top=by-h, capB=top+16, upB=top+25, balT=upB, balB=upB+4, baseT=by-14;
  for (y=baseT;y<by;y++) for (xx=x-6;xx<=x+6;xx++){ var c=tex.ashlar(xx*1.5,y,R('s2 s3 s4 s5'),6,4); if (xx===x-6) c=P.s5; if (xx>=x+5) c=P.s2; b.px(xx,y,c); }
  for (y=baseT-4;y<baseT;y++){ var hw=3+Math.round((y-(baseT-4))*0.75); for (xx=x-hw;xx<=x+hw;xx++) b.px(xx,y,xx<x-1?P.s5:(xx>x+1?P.s2:P.s4)); }
  for (y=balB;y<baseT-4;y++) for (xx=x-3;xx<=x+3;xx++){ var u=xx-x, c2=u<=-3?P.s5:(u<=-1?P.s4:(u<=1?P.s4:(u<3?P.s3:P.s2))); if (u===-1||u===1) c2=M.DN[c2]; if ((y-balB)%22===0) c2=P.s5; b.px(xx,y,c2); }
  for (y=balB;y<balB+4;y++) for (xx=x-5;xx<=x+5;xx++){ var d=Math.abs(xx-x); if (d>5-(y-balB)) continue; b.px(xx,y,((xx+y)&1)?P.s2:P.s3); }
  for (xx=x-6;xx<=x+6;xx++){ b.px(xx,balT,P.s6); b.px(xx,balT+1,P.s4); b.px(xx,balT-1,(xx%2)?P.s5:P.s3); b.px(xx,balT-2,P.s4); }
  snowRect(x-6,balT-2,13,1);
  for (y=capB;y<upB-2;y++) for (xx=x-2;xx<=x+2;xx++) b.px(xx,y,xx<x?P.s5:(xx===x?P.s4:P.s2));
  for (y=Math.max(0,top);y<capB;y++){ var f=(y-top)/(capB-top), hw2=f*3.2; for (xx=Math.round(x-hw2);xx<=Math.round(x+hw2);xx++) b.px(xx,y,xx<x?P.m4:(xx===x?P.m3:P.m2)); }
  for (xx=x-3;xx<=x+3;xx++) b.px(xx,capB,P.m1);
  if (top-1>=0){ b.vl(x,Math.max(0,top-5),top-1,P.y2); } MINTOP=top; }

// ---------------------------------------------------------------- Ćevabdžinica, Gasse zur Kula, Laden, Kazandžiluk
function paintCevab(b,tod){ var x0=CEV.x0, x1=CEV.x1, x, y, night=tod==='night';
  for (y=56;y<GY;y++) for (x=x0;x<x1;x++){ var c=tex.plaster(x,y,R('s4 s5 s6'),80); if (y>=GY-5) c=tex.ashlar(x,y,R('s2 s3 s4 s4'),8,3); if (x>=x1-2) c=P.s3; b.px(x,y,c); }
  roofTiles(b,x0-5,x1+4,36,56,false); for (x=x0-5;x<x1+4;x++){ b.px(x,56,P.w0); dk(b,x,57,2); dk(b,x,58,1); }
  b.rect(528,24,7,13,P.s3); b.vl(534,24,36,P.s2); b.vl(528,24,36,P.s4); b.hl(527,535,24,P.s5); b.rect(529,23,5,1,P.k1); snowRect(527,22,9,2);
  // Schild
  var sw=M.microWidth('ĆEVABDŽINICA')+6, sx=rd((x0+x1)/2-sw/2); b.rect(sx,59,sw,9,P.r1); b.hl(sx,sx+sw-1,59,P.r3); b.hl(sx,sx+sw-1,67,P.r0); b.vl(sx+sw-1,59,67,P.r0); M.microText(b,'ĆEVABDŽINICA',sx+3,61,P.s6); CEVSIGN=[sx,59,sw,9];
  // großes Fenster mit Grill und Tischen, Tür
  var wx=x0+4, wy=72, ww=32, wh=22; b.rect(wx-2,wy-2,ww+4,wh+4,P.w1); for (y=wy;y<wy+wh;y++) for (x=wx;x<wx+ww;x++){ var c2=(y<wy+3)?P.k1:P.k2; if (((x-wx)+(y-wy)*0.5)%17<1.3) c2=P.m1; b.px(x,y,c2); }
  b.rect(wx+2,wy+11,14,3,P.m1); b.hl(wx+2,wx+15,wy+11,P.m3); for (x=wx+3;x<wx+15;x+=2) b.px(x,wy+10,P.t2);   // Grill
  b.rect(wx+20,wy+13,9,2,P.w3); b.vl(wx+21,wy+15,wy+wh-1,P.w1); b.vl(wx+27,wy+15,wy+wh-1,P.w1);
  for (x=wx;x<wx+ww;x++) for (y=wy;y<wy+5;y++){ if (y-wy>2+((x>>1)&1)) continue; b.px(x,y,((x+y)&1)?P.s4:P.s5); }
  b.vl(wx+16,wy,wy+wh-1,P.w1); b.hl(wx-3,wx+ww+2,wy+wh+2,P.s5);
  M.prop.door(b,x1-16,71,12,GY-71,{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),glass:true,glassCol:P.k1,knob:'L'});
  CEVSM=[531,22]; }
function paintLane(b,tod){ var x0=LANE.x0, x1=LANE.x1, f0=LANE.far0, f1=LANE.far1, fy=LANE.fy, x, y;
  // Rückwand am Ende der Gasse, Seitenwände, Boden
  for (y=34;y<GY;y++) for (x=x0;x<x1;x++){ var tl=(x-x0)/(f0-x0), tr=(x1-x)/(x1-f1), c;
    if (x<f0 && y>=lerp(56,40,tl) && y<lerp(GY,fy,tl)){ c=tex.plaster((x-x0)*3,y,R('s2 s3 s4'),99); if (((x-x0)*3)%14<2) c=P.w1; }
    else if (x>=f1 && y>=lerp(56,40,tr) && y<lerp(GY,fy,tr)){ c=tex.plaster((x1-x)*3,y,R('m2 s2 s3'),99); }
    else if (x>=f0 && x<f1 && y>=46 && y<fy){ c=tex.plaster(x,y,R('s3 s4 s5'),99); if (y>fy-12 && x>f0+3 && x<f1-3) c=(y<fy-10)?P.w0:P.w1; }
    else if (y>=fy){ var dd=(y-fy)/(GY-fy), rw=lerp(f1-f0,x1-x0,dd), lx=lerp(f0,x0,dd), u=(x-lx)/rw; if (u<0||u>1) continue; var row=Math.floor(Math.pow(dd,0.7)*9), cc=hash(Math.floor(u*(4+row)),row)<0.5?P.s2:P.s3; if (((u*(4+row))%1)<0.12) cc=P.s1; c=cc; PAVE[y*W+x]=1; }
    else continue;
    b.px(x,y,c); }
  roofTiles(b,f0-2,f1+2,38,46,false);
  // Laternchen hinten, Wäscheleine
  b.px(f0+2,60,P.k1); b.rect(f0+1,61,3,4,P.m2); b.px(f0+2,62,P.m3);
  for (x=x0+4;x<x1-4;x++){ var yy=50+rd(Math.sin((x-x0-4)/(x1-x0-8)*Math.PI)*3); b.px(x,yy,P.k2); }
  b.rect(552,52,3,4,P.r3); b.rect(561,53,4,3,P.s5); b.rect(568,52,2,5,P.b2); }
function paintShop2(b,tod){ var x0=578, x1=612, x, y, night=tod==='night';
  for (y=48;y<GY;y++) for (x=x0;x<x1;x++){ var c=tex.plaster(x,y,R('s3 s4 s5'),80); if (x===x0) c=P.s5; b.px(x,y,c); }
  roofTiles(b,x0-3,x1+3,40,50,true); for (x=x0-3;x<x1+3;x++){ b.px(x,50,P.w0); dk(b,x,51,2); }
  shopFront(b,x0+1,x1-1,'copper2',night);
  for (y=56;y<66;y++) for (x=x0+4;x<x1-4;x++){ if ((x-x0)%8<5) b.px(x,y,((y-56)%3===0)?P.w0:P.w2); } }
function paintKazan(b,tod){ var x0=KAZ.x0, x, y;
  // Gasse nach rechts hinten: Wand links (hell), Ladenfronten rechts mit Kupfer
  for (y=40;y<GY;y++) for (x=x0;x<W;x++){ var c=tex.plaster(x*1.5,y,R('s1 s2 s3'),99); if (y>78) c=((x+y)%5===0)?P.w0:P.w1; b.px(x,y,c); }
  for (y=GY-14;y<GY;y++) for (x=x0+4;x<W;x++) b.px(x,y,(y>GY-3)?P.s2:P.s3);
  roofTiles(b,x0-2,W,34,42,false);
  // Balken mit hängenden Kupfertellern und Kannen
  for (x=x0-2;x<W;x++){ b.px(x,54,P.w3); b.px(x,55,P.w1); }
  b.rect(x0-2,54,3,GY-54,P.w2); b.vl(x0-2,54,GY-1,P.w3); b.vl(x0,54,GY-1,P.w0);
  [[x0+6,62,3.5],[x0+14,64,4.5],[x0+23,61,3],[x0+11,74,2.5],[x0+20,73,3.5]].forEach(function(p,i){ b.vl(p[0],56,rd(p[1]-p[2]),P.k1); b.ellipse(p[0],p[1],p[2],p[2],P.t3); b.ellipse(p[0],p[1],p[2]-1,p[2]-1,P.t2); b.px(rd(p[0]-p[2]*0.5),rd(p[1]-p[2]*0.5),P.t5); b.px(rd(p[0]-p[2]*0.5)+1,rd(p[1]-p[2]*0.5),P.l0); if (i===1) b.px(p[0]+1,p[1]+1,P.t4); });
  for (var k=0;k<3;k++){ var dx=x0+5+k*8; b.rect(dx,84,4,5,P.y2); b.px(dx,84,P.y4); b.line(dx+4,85,dx+6,83,P.y1); b.vl(dx+1,80,83,P.k1); } }

// ---------------------------------------------------------------- Endhaltestelle: Masten, Fahrdraht, Wartehäuschen, Fahrdienstleiter
function paintPoles(b){ POLES.forEach(function(x){ var top=14; for (var y=top;y<GY+4;y++){ b.px(x,y,P.m2); b.px(x+1,y,P.m1); if ((y-top)%9===0) b.px(x,y,P.m3); } b.rect(x-1,GY,4,4,P.m1); b.hl(x-1,x+2,top,P.m3); b.px(x,top-1,P.m2);
    b.line(x+1,top+8,x+18,top+10,P.m1); }); }
function paintWires(b){ var x;
  // Fahrdraht über dem hinteren und dem vorderen Gleis, die Wendeschleife dazwischen, oben das Tragseil
  for (x=0;x<LOOP.cx;x++){ b.px(x,WIRE.back,P.k1); b.px(x,WIRE.front,P.k1); }
  for (var a=-Math.PI/2;a<=Math.PI/2;a+=0.02){ b.px(rd(LOOP.cx+Math.cos(a)*24),rd((WIRE.back+WIRE.front)/2-Math.sin(a)*5),P.k1); }
  POLES.forEach(function(px){ var dir=px>200?-1:1;
    // Ausleger mit Strebe, Isolatoren, Hänger zu beiden Fahrdrähten
    b.line(px+1,20,px+1+dir*16,22,P.m1); b.line(px+1,26,px+1+dir*16,22,P.m0); b.line(px+1+dir*16,22,px+1+dir*16,WIRE.front-1,P.m0); b.px(px+1+dir*16,WIRE.front-1,P.s4);
    b.line(px+1,32,px+1+dir*12,32,P.m1); b.line(px+1+dir*12,32,px+1+dir*12,WIRE.back-1,P.m0); b.px(px+1+dir*12,WIRE.back-1,P.s4); b.px(px+1+dir*8,32,P.s4); b.px(px+1+dir*8,22,P.s4); });
  for (x=0;x<260;x++){ var u=((x-18)%110+110)%110/110, yy=15+rd(Math.sin(u*Math.PI)*4); b.px(x,yy,P.k2); }
  for (x=0;x<LOOP.cx;x+=22){ b.vl(x+9,17,WIRE.front-1,P.m0); } }
function paintShelter(b,tod){ var x0=SHEL.x0, x1=SHEL.x1, top=SHEL.top, by=SHEL.base, x, y;
  // Rückwand aus Glas (das Gleis dahinter schimmert durch), Seitenscheiben, Pfosten
  for (y=top+6;y<by-3;y++) for (x=x0+2;x<x1-2;x++){ var c=b.get(x,y); if (c===T) c=P.m2; var r2=((x*0.7+y)%19); b.px(x,y,(r2<1.2)?P.s4:M.DN[c]); }
  [x0,x0+1,x1-2,x1-1,rd((x0+x1)/2)].forEach(function(px,i){ for (y=top+4;y<by;y++) b.px(px,y,(i%2)?P.m1:P.m2); });
  // Dach mit Blende und Schild
  for (x=x0-3;x<x1+3;x++){ b.px(x,top,P.m4); b.px(x,top+1,P.m3); for (y=top+2;y<top+8;y++) b.px(x,y,P.b1); b.px(x,top+8,P.k2); }
  micro(b,'BAŠČARŠIJA',rd((x0+x1)/2-M.microWidth('BASCARSIJA')/2),top+2,P.s6);
  snowRect(x0-3,top,x1-x0+6,2);
  // Fahrplanvitrine und Linienschilder
  b.rect(x0+4,top+14,9,12,P.s5); b.rect(x0+5,top+15,7,10,P.s6); for (y=top+16;y<top+24;y+=2) b.hl(x0+6,x0+10,y,P.m2);
  [['1',x1-16],['3',x1-9]].forEach(function(l){ b.rect(l[1],top+11,6,7,P.s6); b.hl(l[1],l[1]+5,top+11,P.r2); M.microText(b,l[0],l[1]+2,top+12,P.k1); });
  // Mülleimer
  b.rect(x1+2,by-10,5,10,P.g2); b.vl(x1+2,by-10,by-1,P.g3); b.hl(x1+1,x1+7,by-11,P.g1); }
function paintBooth(b,tod){ var x0=BOOTH.x0, x1=BOOTH.x1, top=BOOTH.top, by=BOOTH.base, x, y, BL=R('a1 a2 a3 a4');
  // Blechkasten, blassgrün gestrichen, Seitenwand im Schatten, Sockel
  for (y=top;y<by;y++) for (x=x0;x<x1+5;x++){ var side=x>=x1, c=side?P.a1:(((x-x0)%6===0)?P.a2:P.a3); if (x===x0) c=P.a4; if (side && ((y-top)%6===0)) c=P.a0; if (y>by-4) c=P.m1; if (side && x===x1+4) c=P.k2; b.px(x,y,c); }
  for (y=top+10;y<by-6;y++){ b.px(x1+1,y,P.a0); b.px(x1+3,y,P.a0); } b.px(x1+2,top+24,P.y2);   // Tür an der Seite
  for (x=x0-2;x<x1+7;x++){ b.px(x,top-2,P.m3); b.px(x,top-1,P.m2); b.px(x,top,P.k2); } snowRect(x0-2,top-2,x1-x0+9,2);
  // Ofenrohr
  b.rect(x1-6,top-14,2,12,P.m1); b.vl(x1-6,top-14,top-3,P.m2); b.hl(x1-7,x1-4,top-15,P.k2); BOOTHSM=[x1-5,top-16];
  // Fenster mit halb zugezogenem Vorhang, drinnen Telefon und Lampe
  var w=BOOTH.win, wx=w[0], wy=w[1], ww=w[2], wh=w[3]; b.rect(wx-1,wy-1,ww+2,wh+2,P.m1);
  for (y=wy;y<wy+wh;y++) for (x=wx;x<wx+ww;x++) b.px(x,y,(y<wy+2)?P.k1:P.k2);
  for (y=wy;y<wy+wh;y++) for (x=wx;x<wx+6;x++) b.px(x,y,((x+y)%3===0)?P.r1:P.r2);      // Vorhang
  b.hl(wx,wx+ww-1,wy,P.m2);
  b.rect(wx+10,wy+5,4,3,P.k1); b.px(wx+10,wy+5,P.m2); b.px(wx+13,wy+5,P.m2); b.vl(wx+12,wy+8,wy+10,P.k1);   // Telefon an der Wand
  b.px(wx+8,wy+2,P.y2); b.px(wx+8,wy+3,P.y3);                                                          // Lampe
  b.hl(wx-2,wx+ww+1,wy+wh+1,P.m3); b.hl(wx-2,wx+ww+1,wy+wh+2,P.m1);
  // Thermoskanne auf dem Sims
  b.rect(wx+ww-5,wy+wh-6,3,6,P.r2); b.vl(wx+ww-5,wy+wh-6,wy+wh,P.r3); b.hl(wx+ww-5,wx+ww-3,wy+wh-7,P.m3); b.px(wx+ww-2,wy+wh-4,P.r1);
  // VOZNI RED an der Wand: ein Blatt hinter Plexiglas
  var tx=x0+21, ty=top+12; b.rect(tx-1,ty-1,22,20,P.m1); b.rect(tx,ty,20,18,P.s6); b.hl(tx,tx+19,ty,P.s5);
  M.microText(b,'VOZNI',tx+1,ty+1,P.k1); M.microText(b,'RED',tx+5,ty+7,P.r2);
  for (y=ty+13;y<ty+17;y+=2) for (x=tx+1;x<tx+19;x++) if ((x+y)%4) b.px(x,y,P.m2);
  b.px(tx-1,ty-1,P.s4); b.px(tx+20,ty-1,P.s4);
  // Nummer, Lüftungsgitter
  for (x=x0+3;x<x0+12;x+=2) b.vl(x,by-10,by-6,P.a1); }

// ---------------------------------------------------------------- Boden: Asphalt mit Insel und Gleisen links, Kaldrma rechts
function kaldrma(x,y,wet){ var h0=2.4, kk=0.085, hy=h0+kk*(y-GY), v=Math.log(hy/h0)/kk, row=Math.floor(v), fv=v-row, sc=hy/h0, u=(x-400)/(3.3*sc)+hash(row,3)*0.9+(row&1)*0.5, col=Math.floor(u), fu=u-col;
  var jit=hash(col,row*7), dx=(fu-0.5)*2, dy=(fv-0.5)*2, d=dx*dx*(0.75+jit*0.2)+dy*dy*(0.9+jit*0.3);
  var tone=hash(col*3+1,row), base=tone<0.22?P.e2:(tone<0.5?P.s2:(tone<0.8?P.s3:(tone<0.92?P.e3:P.s4)));
  var c=base; if (d>0.84) c=(d>1.04)?P.e0:P.e1; else { if (dy<-0.42 && dx<0.35) c=M.UP[base]; else if (dy>0.52 || dx>0.7) c=M.DN[base]; }
  if (wet){ c=M.DN[c]; if (d<0.3 && dy<-0.1 && hash(col,row+5)<0.45) c=P.m3; }
  return c; }
function asphalt(x,y,wet){ var c=(hash(x>>1,y>>1)<0.5)?P.m1:P.m2; if (hash(x,y)<0.05) c=P.m3; if (fbm(x*0.05,y*0.3,3)>0.66) c=M.DN[c]; if (wet) c=M.DN[c]; return c; }
function onLoopRail(x,y){ // Schienen: hinten, vorne, Schleife
  if (x<LOOP.cx){ return y===BT.far||y===BT.near||y===FT.far||y===FT.near; }
  for (var k=0;k<2;k++){ var e=k?LOOP.ri:LOOP.ro, dx=(x-LOOP.cx)/e[0], dy=(y-LOOP.cy)/e[1], d=dx*dx+dy*dy; if (Math.abs(d-1)<(k?0.11:0.075)) return true; } return false; }
function inIsland(x,y){ if (y<ISL.y0||y>ISL.y1) return false; if (x<LOOP.cx) return true; var dx=(x-LOOP.cx)/(LOOP.ri[0]-2), dy=(y-LOOP.cy)/(LOOP.ri[1]-2); return dx*dx+dy*dy<1; }
function paintGround(b,wet,wea){ var x, y;
  for (y=GY;y<H;y++) for (x=0;x<W;x++){ var c, tramZone=x<246+((y-GY)*0.15);
    if (tramZone){ c=asphalt(x,y,wet);
      if (inIsland(x,y)){ var sl=((x>>3)+((y-ISL.y0)>>2))&1; c=(sl?P.s2:P.s3); if (((x%8)===0)||((y-ISL.y0)%5===0)) c=P.s1; if (y===ISL.y1) c=P.s4; if (y===ISL.y1+1||y===ISL.y1+2) c=P.s1; if (y===ISL.y0) c=P.s4; if (wet) c=M.DN[c]; } }
    else { c=kaldrma(x,y,wet); if (Math.abs(x-246-(y-GY)*0.15)<1.2) c=P.s4; }
    b.px(x,y,c); PAVE[y*W+x]=1; }
  // Schienen mit Rille
  for (y=GY;y<H;y++) for (x=0;x<260;x++){ if (!onLoopRail(x,y)) continue; b.px(x,y,P.m4); if (y+1<H && !onLoopRail(x,y+1)) b.px(x,y+1,P.k1); }
  // um den Sebilj ein Ring aus hellen Steinplatten
  for (y=GY+2;y<GY+22;y++) for (x=SEB.cx-70;x<=SEB.cx+70;x++){ var ex=(x-SEB.cx)/70, ey=(y-(SEB.base+1))/12; if (ex*ex+ey*ey>1 || y<SEB.base-2) continue; var pr=Math.floor((y-GY)/3.2), pc=Math.floor((x-SEB.cx+200+pr*5)/(9+pr*0.8)), fy2=(y-GY)%3.2, c3=hash(pc,pr)<0.5?P.s3:P.s4; if (fy2<1) c3=P.s2; else if (((x-SEB.cx+200+pr*5)%(9+pr*0.8))<1) c3=P.s2; if (ex*ex+ey*ey>0.86) c3=P.s2; if (wet) c3=M.DN[c3]; b.px(x,y,c3); }
  // ein Gully
  b.ellipse(300,132,4,1.4,P.k1); b.hl(297,303,132,P.m1);
  for (x=0;x<W;x++){ dk(b,x,GY,2); if (bayer(x,GY+1)<0.6) dk(b,x,GY+1,1); }
  if (wea==='snow'){ for (y=GY;y<H;y++) for (x=0;x<W;x++){ var c2=b.get(x,y); if (onLoopRail(x,y)||onLoopRail(x,y-1)) continue; var n=fbm(x*0.06,y*0.25,8), tz=x<246; var cov=tz?(inIsland(x,y)?0.75:0.45):0.62; if (n<cov || hash(x,y)<0.06) b.px(x,y,(n<cov-0.22)?P.s6:((hash(x+1,y)<0.7)?P.s5:P.s4)); }
    // Fahrspuren im Schnee auf dem Asphalt
    for (y=GY;y<H;y++) for (x=0;x<246;x++){ if (onLoopRail(x,y) && hash(x,y)<0.6){ b.px(x,y,P.m3); } } } }
// nasses Pflaster: Spiegelungen in Pfützen
function wetReflect(b){ var src=b.clone();
  for (var y=GY+2;y<H;y++){ var d=y-GY, k=0.55-d/70, sy=GY-1-Math.floor(d*0.9); if (k<=0.04||sy<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (!PAVE[i]) continue; var pud=fbm(x*0.07,y*0.3,4); if (pud<0.5) continue; var sx=x+((y%3===1)?rd(Math.sin(y*1.3+x*0.07)):0); if (sx<0||sx>=W) continue; var sc=src.d[sy*W+sx];
      if (bayer(x,y)<k*(pud-0.45)*2.4) b.d[i]=M.DN[sc]; } } }

// ---------------------------------------------------------------- Sebilj: Steinsockel, achteckiger Holzkiosk mit Gitterwerk, Messinghähne, grüne Kuppel
function paintSebilj(b,tod){ var cx=SEB.cx, by=SEB.base, x, y;
  // Stufen
  for (var s=0;s<3;s++){ var hw=26-s*3, y0=by-3-s*3; for (y=y0;y<y0+3;y++) for (x=cx-hw;x<=cx+hw;x++){ var c=(y===y0)?P.s5:((y===y0+1)?P.s4:P.s2); if (x>cx+hw-3) c=M.DN[c]; b.px(x,y,c); } snowRect(cx-hw,y0,hw*2+1,1); }
  var b0=by-12, b1=by-46, hw2=17;
  // Achteckiger Körper: drei sichtbare Seiten (links im Licht, Mitte, rechts im Schatten)
  for (y=b1;y<b0;y++) for (x=cx-hw2;x<=cx+hw2;x++){ var u=(x-cx)/hw2, face=u<-0.42?0:(u>0.42?2:1), fu=face===1?(u+0.42)/0.84:(face===0?(u+1)/0.58:(u-0.42)/0.58);
    var c2=face===0?P.w3:(face===1?P.w2:P.w1);
    var pan=((y-b1)%34), inPanel=fu>0.18&&fu<0.82&&pan>3&&pan<26;
    if (inPanel){ var py=y-b1-3, lat=((x+py)%4===0)||((x-py+400)%4===0); c2=lat?(face===0?P.w4:(face===1?P.w3:P.w2)):(face===0?P.w1:(face===1?P.w0:P.k2)); if (py<4){ var ax=Math.abs(fu-0.5)*2; if (py<4*(ax*ax)) c2=face===0?P.w3:(face===1?P.w2:P.w1); } }
    if (Math.abs(fu-0.0)<0.06||Math.abs(fu-1)<0.06) c2=face===2?P.w0:P.w4;
    if (y>b0-8) c2=(y===b0-8)?P.w4:(face===0?P.s4:(face===1?P.s3:P.s2));
    b.px(x,y,c2); }
  // Messinghähne und Becken unten
  [-11,-3,5,12].forEach(function(o,i){ var tx=cx+o; b.px(tx,b0-5,P.y3); b.px(tx+1,b0-5,P.y2); b.px(tx+1,b0-4,P.y2); });
  for (x=cx-hw2-1;x<=cx+hw2+1;x++){ b.px(x,b0,P.s5); b.px(x,b0+1,P.s3); }
  // Traufe: weit ausladend, dunkle Untersicht, Holzkonsolen
  var ey=b1-6; for (y=ey;y<b1;y++) for (x=cx-hw2-6;x<=cx+hw2+6;x++){ var c3=(y<ey+2)?P.g3:((y<ey+3)?P.g1:P.w0); if (y>=ey+3 && ((x-cx+40)%5===0)) c3=P.w2; b.px(x,y,c3); }
  for (x=cx-hw2-6;x<=cx+hw2+6;x++) b.px(x,ey,P.g4);
  // grüne Kuppel mit Rippen und Spitze (Alem)
  var dr=15, dyb=ey; for (y=dyb-dr-2;y<dyb;y++) for (x=cx-dr;x<=cx+dr;x++){ var dx=(x+0.5-cx)/dr, dy=(y+0.5-dyb)/(dr+2); if (dx*dx+dy*dy>1) continue; var u2=dx*0.6-dy*0.25, c4=u2<-0.35?P.g5:(u2<0.1?P.g4:(u2<0.5?P.g3:P.g2)); if (Math.abs(((x-cx)/(dr*Math.sqrt(Math.max(0.01,1-dy*dy))))*4-Math.round(((x-cx)/(dr*Math.sqrt(Math.max(0.01,1-dy*dy))))*4))<0.12 && dy>-0.8) c4=M.DN[c4]; b.px(x,y,c4); SNOW[y*W+x]=1; }
  b.hl(cx-2,cx+2,dyb-dr-2,P.g2); b.vl(cx,dyb-dr-10,dyb-dr-3,P.y2); b.px(cx,dyb-dr-11,P.y4); b.ellipse(cx+0.5,dyb-dr-6,1.6,1.6,P.y3); b.px(cx-1,dyb-dr-13,P.y3); b.px(cx,dyb-dr-14,P.y3); b.px(cx+1,dyb-dr-13,P.y3);
  SEBTOP=dyb-dr-14; }

// ---------------------------------------------------------------- Laternen (Mast + Kopf); Bank als Ebene
function lampPost(w,l){ var x=l.x, by=l.base, top=by-l.h; w.rect(x,top+12,2,l.h-12,P.k1); w.vl(x,top+12,by-1,P.m1); w.rect(x-1,by-4,4,4,P.k1); w.hl(x-2,x+3,by-1,P.k2); w.px(x-1,by-4,P.m1);
  w.hl(x-1,x+2,top+20,P.m1); w.hl(x-1,x+2,top+12,P.m0);
  w.hl(x-3,x+4,top+11,P.k1); for (var y=top+3;y<top+11;y++) for (var xx=x-2;xx<=x+3;xx++) w.px(xx,y,(xx===x-2||xx===x+3)?P.k1:((y<top+6)?P.m3:P.m2)); w.vl(x,top+3,top+10,P.k1);
  w.hl(x-3,x+4,top+2,P.k1); w.hl(x-2,x+3,top+1,P.k2); w.hl(x-1,x+2,top,P.k1); w.px(x,top-1,P.k1); w.px(x+1,top-1,P.k1); w.px(x,top-2,P.m2); }
function lampGlass(w,l){ var x=l.x, top=l.base-l.h; for (var y=top+3;y<top+11;y++) for (var xx=x-1;xx<=x+2;xx++) if (xx!==x) w.px(xx,y,(y<top+6)?P.l0:P.y4); w.px(x+1,top+5,P.l1); }

// ---------------------------------------------------------------- Bild
var CEVSIGN=[484,59,56,9], BASE=null, CEVSM=[531,22], BOOTHSM=[175,48], SEBTOP=30, MINTOP=-4;
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,T), x, y, wet=wea==='rain', night=tod==='night';
  DEP.fill(0); SNOW.fill(0); PAVE.fill(0); TRAMM.fill(0);
  stage(b,1,function(){ paintHills(b,tod,wea); });
  stage(b,2,function(){ paintFarTower(b); });
  stage(b,3,function(){ paintBackHouses(b,tod); paintMosque(b,tod); });
  stage(b,4,function(){ paintShops(b,tod); paintCevab(b,tod); paintLane(b,tod); paintShop2(b,tod); paintKazan(b,tod); });
  stage(b,4,function(){ paintPoles(b); });
  stage(b,5,function(){ paintGround(b,wet,wea); });
  if (S.tramIn){ var tb=new M.Buf(W,H,T); M.scn.tram(tb,TRAM.x,TRAM.rail,{s:TRAM.s,line:'3',dir:'R',doors:'open'}); for (var k=0;k<W*H;k++) if (tb.d[k]!==T){ b.d[k]=tb.d[k]; TRAMM[k]=1; DEP[k]=5; } }
  stage(b,5,function(){ paintShelter(b,tod); paintBooth(b,tod); paintWires(b); paintSebilj(b,tod); });
  var fog=wea==='fog', snow=wea==='snow';
  if (wea!=='calm' || tod!=='day'){ var fk=fog?1:(snow?0.8:(wet?0.75:0.35)), fcol=night?P.m1:(tod==='dusk'?P.m2:P.s4);
    M.fogBake(b,function(x,y){ var d=DEP[y*W+x]; if (d===1) return 0.82*fk; if (d===2) return 0.6*fk; if (d===3) return (y<60?0.4:0.26)*fk; if (d===4) return 0.14*fk; return 0; },{col:fcol}); }
  if (snow) M.snowCap(b,0,0,W,H,function(x,y){ return SNOW[y*W+x]===1; });
  var sk=new M.Buf(W,H,P.k0); paintSky(sk,tod,wea); SKYM.fill(0);
  for (var q=0;q<W*H;q++) if (b.d[q]===T){ b.d[q]=sk.d[q]; SKYM[q]=1; }
  if (wet) wetReflect(b);
  // Kontaktschatten, Unterseite der Dächer, Boden zur Kamera hin dunkler
  M.light(b,M.lf.sum(M.lf.pool(SEB.cx,SEB.base+1,30,3,-1),M.lf.pool((SHEL.x0+SHEL.x1)/2,SHEL.base+1,30,3,-0.9),M.lf.pool(163,BOOTH.base+1,22,3,-0.9),M.lf.band(118,H,0,-0.45)),0,0,function(x,y){ return !SKYM[y*W+x]; });
  if (tod==='day' && wea==='calm') castShadows(b);
  BASE=b.clone();
  shade(b,0,0,todKey(tod,wea),lightsFor(tod,wea,S),function(x,y){ return SKYM[y*W+x]===1; });
  if (tod!=='day') afterLights(b,tod,wea,S);
  return b; }
// tiefe Novembersonne von links: lange, weiche Schatten nach rechts unten
function castShadows(b){ var objs=[[SEB.cx-24,SEB.cx+24,SEB.base,26],[SHEL.x0,SHEL.x1,SHEL.base,18],[BOOTH.x0,BOOTH.x1+4,BOOTH.base,20],[BENCH.x0,BENCH.x1,BENCH.base,8]];
  LAMPS.forEach(function(l){ objs.push([l.x,l.x+1,l.base,26]); }); POLES.forEach(function(px){ objs.push([px,px+1,GY+4,30]); });
  objs.forEach(function(o){ var len=o[3]; for (var j=1;j<=len;j++){ var y=o[2]+Math.round(j*0.4), dx=Math.round(j*0.95); if (y>=H) break; for (var x=o[0]+dx;x<=o[1]+dx;x++){ if (x<0||x>=W) continue; var k=y*W+x; if (SKYM[k]||!PAVE[k]) continue; if (bayer(x,y)<0.9-j/len*0.5) b.px(x,y,M.DN[b.get(x,y)]); } } }); }
function afterLights(b,tod,wea,S){ var x, y, night=tod==='night', fog=wea==='fog';
  if (night && wea==='calm') hillLights(b);
  function glow(x0,y0,w,h,cs,c1,c2,lv){ for (var yy=y0;yy<y0+h;yy++) for (var xx=x0;xx<x0+w;xx++){ var c=BASE.get(xx,yy); if (cs.indexOf(c)>=0) b.px(xx,yy,bayer(xx,yy)<lv?c1:c2); } }
  glow(BOOTH.win[0]+6,BOOTH.win[1]+1,BOOTH.win[2]-6,BOOTH.win[3]-1,[P.k1,P.k2],P.y3,P.y2,0.45);
  glow(BOOTH.win[0],BOOTH.win[1],6,BOOTH.win[3],[P.r1,P.r2],P.d4,P.d3,0.5);
  glow(CEV.x0+4,72,32,22,[P.k1,P.k2,P.m1],P.y3,P.y2,0.5);
  glow(CEV.x1-13,74,6,14,[P.k1],P.y3,P.y2,0.5);
  glow(LANE.far0+1,61,3,4,[P.m2,P.m3],P.y4,P.y3,0.6);
  if (!night){ SHOPS.forEach(function(s){ if (s[2]!=='shut') glow(s[0]+2,74,s[1]-s[0]-4,20,[P.k1,P.k2],P.y2,P.y1,0.4); }); glow(579,74,32,20,[P.k1,P.k2],P.y2,P.y1,0.4); }
  // Schild des Wartehäuschens leuchtet
  for (x=SHEL.x0-3;x<SHEL.x1+3;x++) for (y=SHEL.top+2;y<SHEL.top+8;y++){ var c=b.get(x,y), o=BASE.get(x,y); b.px(x,y,o===P.s6?P.l1:(bayer(x,y)<0.5?P.b2:P.b1)); }
  // Straßenbahn: Fenster und offene Türen erleuchtet
  if (S.tramIn){ var lb=new M.Buf(W,H,T); M.scn.tram(lb,TRAM.x,TRAM.rail,{s:TRAM.s,line:'3',dir:'R',lit:true,litOnly:true});
    var tb=new M.Buf(W,H,T); M.scn.tram(tb,TRAM.x,TRAM.rail,{s:TRAM.s,line:'3',dir:'R',doors:'open'});
    for (var k=0;k<W*H;k++){ if (!TRAMM[k]) continue; var bc=BASE.d[k]; if (bc!==tb.d[k] && !(DEP[k]===5 && M.DN[tb.d[k]]===bc)) continue; if (lb.d[k]!==T) b.d[k]=lb.d[k]; else if (tb.d[k]===P.k1 && ((k/W)|0)>TRAM.rail-40) b.d[k]=bayer(k%W,(k/W)|0)<0.4?P.y2:P.y1; } }
  LAMPS.forEach(function(l){ var hx=l.x, ht=l.base-l.h, hr=fog?16:9; for (y=ht+7-hr;y<ht+7+hr;y++) for (x=hx-hr;x<=hx+hr+1;x++){ var d=Math.hypot(x-hx-0.5,(y-ht-7)*1.1)/hr; if (d>=1||d<0.3) continue; if (bayer(x,y)<(1-d)*(fog?0.42:0.25)) b.px(x,y,M.UP[b.get(x,y)]); } });
  if (wea==='rain') LAMPS.forEach(function(l,i){ for (var yy=l.base+2;yy<H;yy++){ var a=0.5-(yy-l.base)/70; if (a<0.05) break; for (x=l.x-2;x<=l.x+3;x++){ var wx=x+rd(Math.sin(yy*0.5+i)*0.8); if (wx>=0&&wx<W&&PAVE[yy*W+wx] && bayer(wx,yy)<a*(Math.abs(x-l.x-0.5)<1?1:0.4)) b.px(wx,yy,yy<l.base+14?P.y3:P.y2); } } }); }

// ---------------------------------------------------------------- Ebenen: Bank, Laternen
function finishL(L,tod,wea,S){ shade(L,L.ox,L.oy,todKey(tod,wea),lightsFor(tod,wea,S)); }
function benchLayer(S,tod,wea){ var bx0=BENCH.x0, bx1=BENCH.x1, s=BENCH.seat, by=BENCH.base, L=M.layer(bx0-2,s-14,bx1-bx0+4,by-s+16,by), w=M.lw(L), x;
  // Rückenlehne aus Holzlatten, Sitz, gusseiserne Füße
  for (var k=0;k<2;k++){ var yy=s-11+k*4; w.rect(bx0,yy,bx1-bx0,3,P.w3); w.hl(bx0,bx1-1,yy,P.w4); w.hl(bx0,bx1-1,yy+2,P.w1); }
  w.rect(bx0-1,s,bx1-bx0+2,3,P.w3); w.hl(bx0-1,bx1,s,P.w5); w.hl(bx0-1,bx1,s+2,P.w1);
  [bx0+2,bx1-4].forEach(function(lx){ w.rect(lx,s-12,2,by-s+12,P.k1); w.vl(lx,s-12,by-1,P.m1); w.rect(lx-1,by-1,4,1,P.k2); w.line(lx+1,s+3,lx+(lx<bx0+10?4:-3),by-1,P.k1); });
  if (wea==='snow'){ for (x=bx0-1;x<=bx1;x++){ w.px(x,s-1,P.s6); if (hash(x,2)<0.6) w.px(x,s-12,P.s6); } }
  finishL(L,tod,wea,S); return L; }
function lampLayers(S,tod,wea){ return LAMPS.map(function(l){ var L=M.layer(l.x-4,l.base-l.h-3,10,l.h+4,l.base), w=M.lw(L); lampPost(w,l); finishL(L,tod,wea,S); if (tod!=='day') lampGlass(w,l); return L; }); }
function layers(S,GS,tod){ var wea=M.scn.weather(GS), out=[benchLayer(S,tod,wea)]; lampLayers(S,tod,wea).forEach(function(l){ out.push(l); }); return out; }

// ---------------------------------------------------------------- Bewegung: Tauben (fliegen auf, wenn jemand vorbeigeht), Rauch, Licht, Wetter
var PIG=[[300,118],[312,124],[326,115],[334,129],[348,121],[392,117],[404,126],[418,119],[431,131],[286,130],[372,134],[446,123],[358,113],[322,136]];
var FLY=[];
function pigeon(fb,x,y,f,t,i,tint){ var peck=Math.sin(t*2.6+i*2.1)>0.45, step=(Math.floor(t*0.9+i*1.3)%5===0)?f:0;
  function px(dx,dy,c){ var X=x+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  px(-3,-3,P.m1); px(-2,-3,P.m3); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m2); px(0,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-2,P.m2); px(3,-1,P.m3); px(4,-1,P.t4); } else { px(2,-3,P.a3); px(2,-4,P.m3); px(3,-5,P.m3); px(2,-5,P.m2); px(4,-4,P.t4); } }
function flyer(fb,x,y,t,i,tint){ var wing=Math.floor(t*12+i)%2; function px(X,Y,c){ if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  px(x,y,P.m2); px(x+1,y,P.m3); px(x-1,y-(wing?1:-1),P.m4); px(x+2,y-(wing?1:-1),P.m4); px(x-2,y-(wing?2:-1),P.m3); px(x+3,y-(wing?2:-1),P.m3); }
function walkersNear(x,y){ var A=M.ACT||(M.E&&M.E.ACT)||{}; for (var k in A){ var a=A[k]; if (!a || a.ghost || a.visible===false) continue; if (Math.abs(a.x-x)<22 && Math.abs(a.y-y)<9 && a.mode==='walk') return a; } return null; }
function smoke(fb,cam,x0,y0,t,n,col){ for (var i=0;i<n;i++){ var ph=(t*0.18+i/n)%1, x=rd(x0+Math.sin(t*0.5+i*1.7)*2+ph*ph*18), y=rd(y0-ph*30), sx=x-cam; if (sx<0||sx>=fb.w-1||y<0) continue; if (bayer(sx,y)<0.75-ph*0.6){ fb.px(sx,y,col); if (ph>0.3 && bayer(sx+1,y)<0.5-ph*0.4) fb.px(sx+1,y,col); } } }
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, wea=M.scn.weather(GS), tint=tod!=='day'?(M.TINT[tod]||M.TINT.dawn):null;
  var scol=tod==='day'?P.s5:(tod==='night'?P.m1:P.m2);
  smoke(fb,cam,CEVSM[0],CEVSM[1],t,12,scol); smoke(fb,cam,BOOTHSM[0],BOOTHSM[1],t*0.8+3,7,scol);
  if (tod!=='night'){ var n=(wea==='rain'||wea==='snow')?6:PIG.length;
    for (var i=0;i<n;i++){ var p=PIG[i], st=FLY[i]||(FLY[i]={until:-1,dir:1});
      var x=p[0]+rd(Math.sin(t*0.35+i*1.9)*4), y=p[1];
      if (st.until<t){ var a=walkersNear(x,y); if (a){ st.until=t+2.4+hash(i,3); st.t0=t; st.dir=(a.x<x)?1:-1; } }
      if (st.until>t){ var k=(t-st.t0)/2.4; if (k<1){ var fx=rd(x+st.dir*k*40), fy=rd(y-Math.sin(k*Math.PI)*36-k*10); flyer(fb,fx-cam,fy,t,i,tint); continue; } }
      if (x-cam<-6||x-cam>fb.w+6) continue; pigeon(fb,x-cam,y,(Math.sin(t*0.2+i)>0)?1:-1,t,i,tint); } }
  // Tauben auf dem Sebilj
  if (tod==='day'){ [[SEB.cx-12,SEBTOP+30],[SEB.cx+9,SEBTOP+30]].forEach(function(q,i){ var sx=q[0]-cam; if (sx<1||sx>=fb.w-2) return; fb.px(sx,q[1],P.m3); fb.px(sx+1,q[1],P.m2); fb.px(sx+(Math.sin(t+i)>0?-1:2),q[1]-1,P.m4); }); }
  if (tod!=='day'){ LAMPS.forEach(function(l,i){ var lx=l.x-cam; if (lx<-12||lx>fb.w+12) return; M.glow(fb,lx+0.5,l.base-l.h+7,wea==='fog'?13:8,t+i,wea==='fog'?0.28:0.2); }); } }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS), night=v.tod==='night';
  if (wea==='fog') M.fogDrift(fb,v.t,{y0:30,y1:118,amt:0.36,k:2,col:night?P.m1:(v.tod==='dusk'?P.m2:P.s4),cam:v.cam});
  if (wea==='rain') M.rain(fb,v.t,{n:90,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3});
  if (wea==='snow') M.snow(fb,v.t,{n:80,cam:v.cam}); }
// Geistersicht: das alte Haltestellenschild mit der großen 3, eingeritzt „L + M“ in der Bank
var SIGN3=M.stamp([
"..xxxxxxxxx..",
".xXXXXXXXXXx.",
"xXX.......XXx",
"xX..XXXXX..Xx",
"xX......XX.Xx",
"xX......XX.Xx",
"xX...XXXX..Xx",
"xX......XX.Xx",
"xX......XX.Xx",
"xX..XXXXX..Xx",
"xXX.......XXx",
".xXXXXXXXXXx.",
"..xxxxxxxxx.."],{x:P.x3,X:P.x5});
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, a=0.55+Math.sin(t*0.9)*0.15, gx=SHEL.x0-16-cam, gy=SHEL.top-6;
  if (gx>-20 && gx<fb.w+4){ for (var y=gy+13;y<SHEL.base;y++){ if (bayer(gx+6,y+Math.floor(t*3))<a) fb.px(gx+6,y,P.x4); if (bayer(gx+7,y)<a*0.6) fb.px(gx+7,y,P.x3); }
    for (var j=0;j<SIGN3.h;j++) for (var i=0;i<SIGN3.w;i++){ var c=SIGN3.d[j*SIGN3.w+i]; if (c===T) continue; var X=gx+i, Y=gy+j; if (X<0||X>=fb.w) continue; if (bayer(X+Math.floor(t*4),Y)>a+0.2) continue; fb.px(X,Y,c); }
    for (var k=0;k<5;k++){ var X2=gx+2+k*2; if (X2>=0&&X2<fb.w) fb.px(X2,gy+15,P.x4); } }
  // L + M, winzig, in der Rückenlehne der Bank
  var lx=BENCH.x0+22-cam, ly=BENCH.seat-10; if (lx>0 && lx<fb.w-14){ var g=[[0,0],[0,1],[0,2],[1,2],[4,1],[3,1],[5,1],[4,0],[4,2],[7,0],[7,1],[7,2],[8,1],[9,0],[9,1],[9,2]]; g.forEach(function(q){ if (bayer(lx+q[0],ly+q[1]+Math.floor(t*2))<0.8) fb.px(lx+q[0],ly+q[1],P.x6); }); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (x<6||x>634||y>140) return false;
  if (y<110){ return y>=104 && x>=LANE.x0+7 && x<=LANE.x1-7 && y>=lerp(104,110,0); }
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.base+2) return false;
  for (var i=0;i<LAMPS.length;i++){ var l=LAMPS[i]; if (Math.abs(x-l.x-0.5)<4 && y<l.base+2 && y>l.base-6) return false; }
  return true; }
M.defineArt('carsija',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,M.scn.weather(GS)); if (!k) return null; return levels(k)[1].a; },
  spots:{
    exit:[0,90,10,50],
    tram_stop:[SHEL.x0-3,SHEL.top-1,SHEL.x1-SHEL.x0+6,SHEL.base-SHEL.top+1],
    bench:[BENCH.x0-1,BENCH.seat-12,BENCH.x1-BENCH.x0+2,BENCH.base-BENCH.seat+12],
    tracks:[0,119,244,10],
    booth:[BOOTH.x0-2,BOOTH.top-15,BOOTH.x1-BOOTH.x0+9,BOOTH.base-BOOTH.top+15],
    booth_window:[BOOTH.win[0]-1,BOOTH.win[1]-1,BOOTH.win[2]+2,BOOTH.win[3]+3],
    timetable:[BOOTH.x0+19,BOOTH.top+10,24,22],
    wires:[0,8,250,32],
    tram:[0,38,244,68],
    sebilj:[SEB.cx-26,SEBTOP-1,53,SEB.base-SEBTOP+1],
    pigeons:[280,108,180,30],
    mosque:[MOSQ.x0-4,0,MOSQ.mx-MOSQ.x0+12,GY],
    shops:[SHOPS[0][0]-3,40,SHOPS[4][1]-SHOPS[0][0]+6,GY-40],
    cevabdzinica:[CEV.x0-5,22,CEV.x1-CEV.x0+9,GY-22],
    lane_kula:[LANE.x0+2,40,LANE.x1-LANE.x0-4,70],
    lane_kazan:[KAZ.x0,34,W-KAZ.x0,106],
    lamp:[LAMPS[0].x-4,LAMPS[0].base-LAMPS[0].h-3,10,LAMPS[0].h+3]
  },
  stands:{
    exit:[8,126,'L'], tram_stop:[86,124,'B'], bench:[98,124,'B'], tracks:[120,130,'B'], booth:[170,118,'B'], booth_window:[156,114,'B'], timetable:[176,114,'B'],
    wires:[130,126,'B'], tram:[120,114,'B'], sebilj:[368,114,'B'], pigeons:[340,124,'R'], mosque:[430,114,'B'], shops:[318,114,'B'], cevabdzinica:[512,114,'B'],
    lane_kula:[560,108,'B'], lane_kazan:[628,124,'R'], lamp:[262,118,'B']
  },
  actorPos:{ rade:[198,116,'R'], mala:[80,118,'R'], damir:[136,113,'L'] },
  start:[14,126,'R'], entries:{ map:[14,126,'R'], tramvaj:[120,124,'R'], kula:[560,108,'F'], kazandziluk:[626,124,'L'] }
});
})(M);
