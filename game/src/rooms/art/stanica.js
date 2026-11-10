/* ===== rooms/art/stanica.js — Busbahnhof und Bahnhof (640 px, scrollend) =====
   Links der Busbahnhof: ein flaches Bahnsteigdach aus Beton auf schlanken, sich verjüngenden Stützen, darunter der Reisebus
   (mit der Nase zum Bahnsteig, Leuchtschrift „SPLIT – SARAJEVO“ läuft durch, S.busTo 'mostar' → „MOSTAR“), Bahnsteignummern,
   die Abfahrtstafel „POLASCI“. Am Rand der Kiosk (Senada; Oslobođenje, Dnevni avaz, „KARTE / TICKETS / GRAS“), dann der
   niedrige Bau des Busbahnhofs: Buregdžinica „SARAJ“ mit beschlagenem Fenster, die geschlossene Mjenjačnica, der Bankomat
   mit „VAN FUNKCIJE“ und der Paketschalter „PAKETI – GARDEROBA“ (Fadila im Fenster). In der Lücke dahinter eine Straße mit
   Hochhäusern im Dunst, davor das weiße Taxi (alter Mercedes). Rechts der Bahnhof der 50er Jahre: langes, dünnes Flachdach,
   hohe Glasfront mit Uhr, davor die Haltestelle der Linie 1 (Wartehäuschen, Gleis, Fahrdraht); S.tramIn: eine K2 steht dort,
   Türen offen. Tauben, eine Bank, Laternen. k2_pro: Dämmerung im Nebel; k2_fin: klar und kalt; k2_epi: Morgengrauen, Schnee. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=640, H=144, GY=100;
// ---------------------------------------------------------------- Geometrie
var CAN={x0:0,x1:150,y0:34,y1:42,cols:[6,56,104,148]};
var BUS={x0:44,x1:98,top:54,base:112,side:16};
var BOARD={x0:107,x1:145,y0:45,y1:81};
var KIO={x0:154,x1:194,top:50,win0:58,sill:86,base:108};
var RACK={x0:197,x1:221};
var ROW={x0:224,x1:392,top:46};
var BUR={x0:226,x1:278,win:[229,72,30,24],door:[263,66,13,34]};
var MJE={x0:280,x1:328};
var ATM={x0:331,x1:350};
var PAK={x0:353,x1:391,win:[359,61,24,20]};
var TAXI={x0:396,base:109};
var STA={x0:440,x1:640,hall0:474,hall1:604,roof:12,wing:30};
var CLK={cx:540,cy:34,r:8};
var SHEL={x0:446,x1:484,top:66,base:108};
var TRAM={x:488,rail:107,s:0.62};
var BENCH={x0:576,x1:612,seat:104,base:118};
var LAMPS=[{x:224,base:112,h:66},{x:438,base:112,h:66},{x:626,base:112,h:66}];
var PLAT=112;                               // Bahnsteigkante vor dem Bus
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function micro(b,s,x,y,c){ var parts=s.split('Đ'), cx=x; parts.forEach(function(p,i){ if (p.length){ M.microText(b,p,cx,y,c); cx+=M.microWidth(p)+1; } if (i<parts.length-1){ [[1,0],[2,0],[1,1],[3,1],[0,2],[1,2],[2,2],[3,2],[1,3],[3,3],[1,4],[2,4]].forEach(function(q){ b.px(cx+q[0],y+q[1],c); }); cx+=5; } }); }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  fdusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.5+L*0.12+14, g*0.48+L*0.12+12, b*0.56+L*0.1+26]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  nfog:function(r,g,b){ var L=lum(r,g,b); return [r*0.16+L*0.15+9, g*0.18+L*0.15+10, b*0.24+L*0.17+15]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.58+L*0.12+18, g*0.55+L*0.11+12, b*0.66+L*0.12+30]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,wea){ if (tod==='day') return null; if (tod==='night') return (wea==='fog'||wea==='snow')?'nfog':'night'; if (tod==='dusk' && wea!=='calm') return 'fdusk'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod,wea,S){ if (tod==='day') return []; var fog=wea==='fog', L=[];
  LAMPS.forEach(function(l){ L.push([l.x+7,l.base-l.h+4,fog?44:34,fog?40:30,0.9],[l.x+6,l.base+5,36,11,tod==='dawn'?0.4:0.55]); });
  // Röhren unter dem Bahnsteigdach, Kiosk, Bureg-Fenster, Paketschalter, Bahnhofshalle, Wartehäuschen
  [30,80,128].forEach(function(x){ L.push([x,48,26,14,0.5],[x,112,28,10,0.35]); });
  L.push([(KIO.x0+KIO.x1)/2,72,26,22,0.8],[(KIO.x0+KIO.x1)/2,112,26,8,0.4],[BUR.win[0]+15,BUR.win[1]+12,26,20,0.75],[BUR.win[0]+15,108,30,8,0.45],[PAK.win[0]+13,PAK.win[1]+12,20,18,0.6]);
  L.push([(STA.hall0+STA.hall1)/2,60,90,40,0.6],[(STA.hall0+STA.hall1)/2,104,90,10,0.45],[(SHEL.x0+SHEL.x1)/2,SHEL.top+6,26,14,0.45]);
  L.push([(BUS.x0+BUS.x1)/2,BUS.base+2,26,6,0.4]);
  if (S && S.tramIn) L.push([570,80,90,22,0.4],[570,110,90,7,0.3]);
  return L; }

// ---------------------------------------------------------------- Masken
var DEP=new Uint8Array(W*H), SNOW=new Uint8Array(W*H), PAVE=new Uint8Array(W*H), SKYM=new Uint8Array(W*H), TRAMM=new Uint8Array(W*H), WET=new Uint8Array(W*H);
function stage(b,d,fn){ var s=b.d.slice(); fn(); for (var k=0;k<W*H;k++) if (b.d[k]!==s[k]) DEP[k]=d; }
function snowRect(x0,y0,w,h){ for (var y=Math.max(0,y0);y<Math.min(H,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(W,x0+w);x++) SNOW[y*W+x]=1; }

// ---------------------------------------------------------------- Himmel
function paintSky(s,tod,wea){ var x, y;
  if (wea==='fog'||wea==='snow'||wea==='rain'){ M.scn.sky(s,0,0,W,H,tod,wea,63);
    if (tod!=='day') for (y=40;y<100;y++) for (x=0;x<W;x++){ var g=(y-40)/60; if (bayer(x,y)<g*0.45) s.px(x,y,tod==='dawn'?(bayer(x+1,y)<0.4?P.v2:P.m2):((g>0.55&&bayer(x+2,y)<0.35)?P.d1:P.m2)); }
    return; }
  if (tod==='day'){ var D=R('b1 b2 b3 b4 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(D,0.12+Math.pow(y/90,1.25)*0.86,x,y));
    var r=M.rng(43); for (var i=0;i<6;i++){ var cx=r()*W, cy=4+r()*18, L=50+r()*80; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy+Math.sin(k*0.06+i)*1.6+k*0.03); var a=0.45-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.3) s.px(xx,yy,P.b5); } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(N,0.05+Math.pow(y/96,1.4)*0.8,x,y)); var r2=M.rng(9); for (var j=0;j<260;j++) s.px(Math.floor(r2()*W),Math.floor(Math.pow(r2(),1.5)*60),r2()<0.1?P.n5:P.n3); return; }
  M.sky(s,0,0,W,96,tod,27); }

// ---------------------------------------------------------------- Ferne: Hügel (Hum, Žuč), Hochhäuser
function hillY(x){ return 40+Math.sin(x*0.007+1.4)*10+Math.sin(x*0.027)*3+(vn(x*0.04,3.3,1)-0.5)*5; }
function paintHills(b,tod,wea){ var G=R('e1 e2 e3 e4'), GC=R('g0 g1 g2 g3'), GR=R('t1 t2 e2 e3');
  for (var x=0;x<W;x++){ var top=rd(hillY(x)); for (var y=top;y<96;y++){ var d=(y-top)/40, f=fbm(x*0.07,y*0.2,6), v=0.5-d*0.2+(f-0.5)*0.6+(y===top?0.3:0), n2=fbm(x*0.12+3,y*0.3,8); b.px(x,y,(n2>0.6)?ra(GC,v,x,y):((n2<0.32)?ra(GR,v,x,y):ra(G,v,x,y))); }
    if (wea==='snow'||(tod==='day'&&wea==='calm')){ var sd=wea==='snow'?6:2; for (var yy=top;yy<top+sd;yy++) if (bayer(x,yy)<0.8-(yy-top)/sd*0.6) b.px(x,yy,P.s5); } }
  // ein Sendemast auf dem Hügel
  var mx=96, my=rd(hillY(96)); b.vl(mx,my-16,my,P.m2); b.line(mx-3,my,mx,my-16,P.m1); b.line(mx+3,my,mx,my-16,P.m1); b.px(mx,my-17,P.r3); }
var TOW=[[14,14,40,'s'],[44,11,46,'e'],[70,13,36,'s'],[160,15,30,'s'],[196,10,42,'e'],[232,14,34,'s'],[276,12,24,'s'],[306,14,38,'e'],[352,15,28,'s'],[404,12,40,'s'],[424,11,34,'e']];
function paintTowers(b,tod){ var night=tod==='night'||tod==='dusk'||tod==='dawn';
  TOW.forEach(function(q,i){ var x0=q[0], w=q[1], top=q[2], col=q[3]==='e'?R('e2 e3 e4'):R('s2 s3 s4'), y, x;
    for (y=top;y<96;y++) for (x=x0;x<x0+w;x++){ var u=x-x0, fl=(y-top)%4, c=col[1]; if (u===0) c=col[2]; if (u>=w-2) c=col[0];
      if (fl===0) c=(u>=w-2)?col[0]:col[2];                                           // Deckenstirnen
      else if (fl>=2 && (u%4===1||u%4===2) && u<w-2) c=(hash(x,y)<0.2)?P.s5:P.m1;       // Loggien, Fenster
      if (fl===1 && u%7===3 && hash(i,y)<0.5) c=P.s5;                                    // Wäsche, Satellitenschüssel
      b.px(x,y,c); }
    b.hl(x0,x0+w-1,top,col[2]); if (i%3===0){ b.rect(x0+3,top-3,5,3,col[0]); } if (i%4===1){ b.vl(x0+w-4,top-7,top-1,P.m2); b.hl(x0+w-6,x0+w-2,top-5,P.m2); }
    if (i%2===0){ b.ellipse(x0+w-3,top+9,1.5,1.5,P.s5); } }); }
function towerLights(b,tod){ TOW.forEach(function(q,i){ var x0=q[0], w=q[1], top=q[2]; for (var y=top+2;y<96;y+=4) for (var x=x0+1;x<x0+w-2;x+=4){ var h=hash(x*1.7+i,y*0.9); if (h<(tod==='night'?0.22:0.12) && SKYM[y*W+x]===0 && DEP[y*W+x]===2) b.px(x,y,h<0.06?P.y3:P.y2); } }); }

// ---------------------------------------------------------------- Bahnsteigdach, Bus, Abfahrtstafel
function paintCanopyBack(b){ var x, y;
  // Rückwand des Busbahnhofs unter dem Dach: Glas der Wartehalle, Türen, Bank
  for (y=CAN.y1;y<GY;y++) for (x=0;x<CAN.x1;x++){ var c=(y<52)?P.m2:((y<88)?(((x%18)<2)?P.m3:(((x*0.6+y)%23<1.6)?P.m3:P.c1)):P.m2); if (y===88) c=P.m3; b.px(x,y,c); }
  for (x=0;x<CAN.x1;x+=36){ b.rect(x+14,66,10,22,P.k2); b.vl(x+19,66,87,P.m1); }
  b.rect(118,80,22,3,P.w2); b.vl(120,83,88,P.m1); b.vl(137,83,88,P.m1); }
function paintCanopy(b){ var x, y;
  for (y=CAN.y0;y<CAN.y1;y++) for (x=CAN.x0;x<CAN.x1+4;x++){ var c=(y===CAN.y0)?P.s5:((y===CAN.y1-1)?P.m1:P.s3); if (y===CAN.y0+1) c=P.s4; b.px(x,y,c); }
  for (x=0;x<CAN.x1+4;x++){ b.px(x,CAN.y1,P.m0); dk(b,x,CAN.y1+1,1); }
  snowRect(0,CAN.y0-1,CAN.x1+4,2);
  // Bahnsteignummern auf der Stirn
  [[22,'1'],[78,'2'],[126,'3']].forEach(function(n){ b.rect(n[0]-4,CAN.y0+1,9,6,P.b1); b.hl(n[0]-4,n[0]+4,CAN.y0+1,P.b2); M.microText(b,n[1],n[0]-1,CAN.y0+2,P.s6); });
  M.microText(b,'PERONI',40,CAN.y0+2,P.m1);
  // Stützen: oben breit, unten schlank
  CAN.cols.forEach(function(cx){ for (y=CAN.y1;y<BUS.base;y++){ var t=(y-CAN.y1)/(BUS.base-CAN.y1), hw=rd(lerp(3,1,t)); for (x=cx-hw;x<=cx+hw;x++) b.px(x,y,(x===cx-hw)?P.s4:((x===cx+hw)?P.m1:P.s2)); } b.rect(cx-2,BUS.base-2,5,2,P.m1); });
  // Leuchtröhren
  [30,80,128].forEach(function(x){ b.hl(x-9,x+9,CAN.y1+2,P.s5); b.hl(x-9,x+9,CAN.y1+3,P.m2); b.vl(x-7,CAN.y1,CAN.y1+1,P.m1); b.vl(x+7,CAN.y1,CAN.y1+1,P.m1); }); }
function busSign(S){ return (S && S.busTo==='mostar')?'MOSTAR':((S && S.busTo==='muenchen')?'MUENCHEN - SARAJEVO':'SPLIT - SARAJEVO'); }   // Kapitel 5: der Bus aus München
function paintBus(b,tod,S){ var x0=BUS.x0, x1=BUS.x1, top=BUS.top, by=BUS.base, w=x1-x0, sd=BUS.side, x, y;
  // Seite, nach hinten rechts fliehend: Fenster, Gepäckklappen
  b.poly([[x1,top+2],[x1+sd,top-5],[x1+sd,by-12],[x1,by-2]],function(xx,yy){ var u=(xx-x1)/sd, yy0=top+2-u*7, d=yy-yy0, c=P.s4;
    if (d>3 && d<20) c=(((xx-x1)%5)<1)?P.s3:P.c1; if (d>=20 && d<23) c=P.b1; if (d>=23 && d<35 && u>0.1 && u<0.9) c=((xx-x1)%5===2)?P.s3:P.s4; if (d>=35) c=P.m2; return c; });
  for (x=x1+1;x<x1+sd;x++){ var ty=rd(top+2-(x-x1)*7/sd); b.px(x,ty,P.s6); }
  // Front
  b.rect(x0,top,w,by-top,P.s5); b.hl(x0+1,x1-2,top,P.s6); b.vl(x0,top+1,by-1,P.s4); b.vl(x1-1,top+1,by-1,P.s3);
  // Leuchtschrift (läuft in dynamic durch)
  b.rect(x0+3,top+2,w-6,8,P.k1); b.hl(x0+3,x1-4,top+2,P.k0); BUSLED=[x0+4,top+3,w-8,5];
  // Frontscheibe mit Spiegelung, Wischer, Sonnenblende
  var wy0=top+12, wy1=top+36; for (y=wy0;y<wy1;y++) for (x=x0+2;x<x1-2;x++){ var c=(y<wy0+3)?P.k2:P.c0; var rf=((x-x0)*0.7+y)%19; if (rf<2) c=P.c3; else if (rf<3 && bayer(x,y)<0.5) c=P.c2; if (y>wy1-7) c=P.k2; b.px(x,y,c); }
  b.vl(x0+(w>>1),wy0,wy1-1,P.k1); b.hl(x0+2,x1-3,wy0,P.k1);
  for (var sI=0;sI<4;sI++){ var sx=x0+5+sI*12; b.rect(sx,wy1-6,7,4,P.c1); b.hl(sx,sx+6,wy1-6,P.c2); }   // Kopfstützen
  b.line(x0+6,wy1-1,x0+18,wy1-7,P.k1); b.line(x0+w/2+3,wy1-1,x0+w/2+15,wy1-7,P.k1);
  // Spiegel („Hasenohren“)
  b.line(x0,top+7,x0-5,top+3,P.k1); b.rect(x0-8,top+3,4,9,P.k1); b.vl(x0-7,top+4,top+10,P.m2); b.line(x1-1,top+7,x1+4,top+3,P.k1); b.rect(x1+3,top+3,4,9,P.k1); b.vl(x1+4,top+4,top+10,P.m2);
  // Streifen, Grill, Scheinwerfer, Stoßstange, Kennzeichen, Räder
  b.rect(x0+1,wy1+1,w-2,3,P.b1); b.hl(x0+1,x1-2,wy1+1,P.b2); b.rect(x0+1,wy1+4,w-2,1,P.g3);
  b.rect(x0+13,wy1+7,w-26,6,P.m1); for (x=x0+14;x<x1-13;x+=2) b.vl(x,wy1+8,wy1+11,P.k2);
  [[x0+3,wy1+7],[x0+7,wy1+7],[x1-11,wy1+7],[x1-7,wy1+7]].forEach(function(q){ b.rect(q[0],q[1],4,3,P.s6); b.px(q[0],q[1],P.m3); });
  b.rect(x0,by-5,w,5,P.m2); b.hl(x0,x1-1,by-5,P.m4); b.rect(x0+(w>>1)-8,by-7,16,4,P.s6); b.hl(x0+(w>>1)-7,x0+(w>>1)+6,by-5,P.k2); b.px(x0+(w>>1)-7,by-6,P.b1);
  b.rect(x0+2,by,6,2,P.k1); b.rect(x1-8,by,6,2,P.k1);
  BUSLIGHTS=[[x0+3,wy1+7],[x0+7,wy1+7],[x1-11,wy1+7],[x1-7,wy1+7]];
  // Koffer neben dem Bus
  suitcase(b,x1+20,BUS.base,6,8,P.r2); suitcase(b,x1+27,BUS.base,8,6,P.c2); b.rect(x1+36,BUS.base-5,5,5,P.g2); b.hl(x1+36,x1+40,BUS.base-5,P.g3); }
function suitcase(b,x,by,w,h,col){ b.rect(x,by-h,w,h,col); b.vl(x,by-h,by-1,M.UP[col]); b.vl(x+w-1,by-h,by-1,M.DN[col]); b.hl(x,x+w-1,by-h,M.UP[col]); b.hl(x+1,x+w-2,by-h-1,P.k2); b.px(x+1,by-h-2,P.k2); b.px(x+w-2,by-h-2,P.k2); b.hl(x+1,x+w-2,by-h-3,P.k2); b.px(x+1,by,P.k1); b.px(x+w-2,by,P.k1); }
var DEPS=[['0730','MOSTAR'],['0900','SPLIT'],['1015','ZAGREB'],['1240','TUZLA'],['1405','BIHAĆ']];
// winzige Ziffern 2x3 für die Abfahrtszeiten
var TD={0:'##|##|##',1:'.#|.#|.#',2:'##|.#|#.',3:'##|.#|##',4:'#.|##|.#',5:'#.|##|.#',6:'#.|##|##',7:'##|.#|.#',8:'##|##|##',9:'##|##|.#'};
function tinyNum(b,s,x,y,c){ for (var i=0;i<s.length;i++){ var g=TD[s[i]].split('|'); for (var r=0;r<3;r++) for (var q=0;q<2;q++) if (g[r][q]==='#') b.px(x+i*3+(i>1?1:0)+q,y+r,c); } if (s.length>2) b.px(x+6,y+1,c); }
function paintBoard(b,lit){ var x0=BOARD.x0, x1=BOARD.x1, y0=BOARD.y0, y1=BOARD.y1;
  b.vl(x0+5,CAN.y1,y0,P.m1); b.vl(x1-6,CAN.y1,y0,P.m1);
  b.rect(x0,y0,x1-x0,y1-y0,P.k1); b.rect(x0+1,y0+1,x1-x0-2,y1-y0-2,P.k2); b.hl(x0,x1-1,y0,P.m2); b.hl(x0,x1-1,y1-1,P.k0);
  M.microText(b,'POLASCI',x0+6,y0+2,lit?P.s6:P.s4); b.hl(x0+2,x1-3,y0+8,P.m1);
  DEPS.forEach(function(r,i){ var yy=y0+10+i*6; if (yy+5>y1-1) return; tinyNum(b,r[0],x0+2,yy+1,lit?P.y4:P.y2); M.microText(b,r[1],x0+14,yy,lit?(i===1?P.l1:P.s5):(i===1?P.s5:P.s3)); }); }

// ---------------------------------------------------------------- Kiosk (Rückseite im Bild, Front als Ebene), Zeitungsständer
function paintKioskBack(b){ var x0=KIO.x0, x1=KIO.x1, x, y;
  for (y=KIO.win0;y<KIO.sill;y++) for (x=x0+3;x<x1-3;x++) b.px(x,y,P.w0);
  var cols=[P.r2,P.y3,P.b2,P.s5,P.g3,P.r3,P.c3,P.e3]; for (var s=0;s<3;s++){ var sy=KIO.win0+3+s*7; b.hl(x0+4,x1-5,sy+5,P.w2); for (x=x0+5;x<x1-5;x+=2) b.rect(x,sy,2,5,cols[(x*3+s*5)%cols.length]); }
  b.rect(x1-11,KIO.win0+3,6,7,P.s5); b.px(x1-9,KIO.win0+5,P.r2); b.rect(x0+5,KIO.win0+18,5,3,P.y2); }
function paintRack(b){ var x0=RACK.x0, x1=RACK.x1, x, y;
  b.vl(x0,62,KIO.base-1,P.m1); b.vl(x1-1,62,KIO.base-1,P.m1); b.hl(x0,x1-1,62,P.m2); b.rect(x0-1,KIO.base-2,x1-x0+2,2,P.m0);
  // „DNEVNI AVAZ“, Titelseite nach vorn
  b.rect(x0+1,64,x1-x0-2,28,P.s6); M.microText(b,'DNEVNI',x0+1,65,P.k1); M.microText(b,'AVAZ',x0+4,71,P.r2); b.hl(x0+1,x1-2,77,P.r2);
  for (y=79;y<90;y+=2) for (x=x0+2;x<x1-2;x++) if (x<x0+12 || y<83) { if ((x+y)%5) b.px(x,y,P.m2); } b.rect(x0+13,83,8,7,P.m1); b.px(x0+15,85,P.s4);
  for (var k=0;k<3;k++){ b.rect(x0+1,93+k*4,x1-x0-2,3,k===1?P.s4:P.s5); b.hl(x0+1,x1-2,93+k*4,P.k2); } }

// ---------------------------------------------------------------- Bau des Busbahnhofs: Buregdžinica, Mjenjačnica, Bankomat, Paketschalter
function paintRow(b,tod){ var x0=ROW.x0, x1=ROW.x1, top=ROW.top, x, y;
  for (y=top;y<GY;y++) for (x=x0;x<x1;x++){ var c=tex.plaster(x,y,R('s3 s4 s5'),82); if (y<top+9) c=(y===top)?P.s5:((y===top+8)?P.m1:P.s3); if (y>=GY-4) c=P.m2; b.px(x,y,c); }
  for (x=x0;x<x1;x++) dk(b,x,top+9,1);
  M.microText(b,'AUTOBUSNA STANICA',rd((BUR.x0+MJE.x1)/2-M.microWidth('AUTOBUSNA STANICA')/2),top+2,P.b0);
  snowRect(x0,top-1,x1-x0,2);
  // Buregdžinica
  var bw=BUR.win, d=BUR.door; b.rect(BUR.x0,56,BUR.x1-BUR.x0,15,P.w1); b.hl(BUR.x0,BUR.x1-1,56,P.w3); b.hl(BUR.x0,BUR.x1-1,70,P.w0);
  micro(b,'BUREGDŽINICA',BUR.x0+2,58,P.y4); M.microText(b,'SARAJ',BUR.x0+16,64,P.s6);
  b.rect(bw[0]-2,bw[1]-2,bw[2]+4,bw[3]+4,P.w1);
  for (y=bw[1];y<bw[1]+bw[3];y++) for (x=bw[0];x<bw[0]+bw[2];x++){ var fg=0.55+0.35*Math.sin((x-bw[0])*0.2)*Math.sin((y-bw[1])*0.25); b.px(x,y,bayer(x,y)<fg?P.s4:P.s3); }   // beschlagen
  for (var t=0;t<3;t++){ var tx=bw[0]+6+t*9, ty=bw[1]+bw[3]-6; b.ellipse(tx,ty,4.5,1.8,P.s5); b.ellipse(tx,ty-0.5,3.6,1.2,P.t5); b.px(tx-1,ty-1,P.y4); b.px(tx+1,ty,P.t4); }   // Bleche mit Burek, durch den Dunst
  b.rect(bw[0]+2,bw[1]+bw[3]-3,bw[2]-4,1,P.s5);
  for (var dr=0;dr<5;dr++){ var dx=bw[0]+3+dr*6, dl=4+rd(hash(dr,2)*8); for (y=bw[1]+2;y<bw[1]+2+dl;y++) b.px(dx,y,P.s2); }   // Tropfspuren
  b.hl(bw[0]-3,bw[0]+bw[2]+2,bw[1]+bw[3]+2,P.s5);
  M.prop.door(b,d[0],d[1],d[2],d[3],{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),glass:true,glassCol:P.s3,knob:'L'});
  b.rect(d[0]+3,d[1]+3,d[2]-6,12,P.s3); for (y=d[1]+4;y<d[1]+14;y+=3) b.hl(d[0]+4,d[0]+d[2]-5,y,P.s4);
  // Mjenjačnica: Rollladen unten, Zettel
  var m0=MJE.x0, m1=MJE.x1; b.rect(m0,56,m1-m0,9,P.b0); b.hl(m0,m1-1,56,P.b2); micro(b,'MJENJAČNICA',m0+1,58,P.s6);
  for (y=67;y<GY-1;y++) for (x=m0+2;x<m1-2;x++){ var cc=((y-67)%3===0)?P.m1:(((y-67)%3===1)?P.m3:P.m2); b.px(x,y,cc); }
  b.rect(m0+2,67,m1-m0-4,2,P.m1); b.rect(m0+21,GY-4,4,3,P.k1);
  b.rect(m0+8,75,30,13,P.s6); b.hl(m0+8,m0+37,75,P.s5); M.microText(b,'SUBOTOM',m0+10,76,P.k2); M.microText(b,'DO 14H',m0+12,82,P.r2); b.px(m0+8,75,P.m3); b.px(m0+37,75,P.m3);
  // Bankomat mit Zettel
  var a0=ATM.x0, a1=ATM.x1; b.rect(a0,62,a1-a0,32,P.m2); b.hl(a0,a1-1,62,P.m4); b.vl(a0,62,93,P.m3); b.vl(a1-1,62,93,P.m1);
  b.rect(a0+3,66,a1-a0-6,9,P.c0); b.rect(a0+5,78,a1-a0-10,6,P.m1); for (var k=0;k<3;k++) for (var j=0;j<2;j++) b.px(a0+6+k*3,79+j*2,P.m3); b.rect(a0+4,87,a1-a0-8,2,P.k1);
  b.rect(a0-7,64,34,13,P.s6); b.hl(a0-7,a0+26,64,P.s5); M.microText(b,'VAN',a0+4,65,P.k2); M.microText(b,'FUNKCIJE',a0-5,71,P.k2); b.px(a0-7,64,P.y3); b.px(a0+26,64,P.y3);
  // Paketschalter: Fenster mit Klappe (Fadila dahinter)
  var pw=PAK.win;
  b.rect(PAK.x0+1,ROW.top,PAK.x1-PAK.x0-2,12,P.g1); b.hl(PAK.x0+1,PAK.x1-2,ROW.top,P.g3); b.hl(PAK.x0+1,PAK.x1-2,ROW.top+11,P.g0); M.microText(b,'PAKETI -',PAK.x0+5,ROW.top+1,P.s6); M.microText(b,'GARDEROBA',PAK.x0+2,ROW.top+6,P.s6);
  b.rect(pw[0]-2,pw[1]-2,pw[2]+4,pw[3]+4,P.m1); for (y=pw[1];y<pw[1]+pw[3];y++) for (x=pw[0];x<pw[0]+pw[2];x++) b.px(x,y,(y<pw[1]+3)?P.k1:(((x-pw[0])%9===0)?P.w0:P.w1));
  for (y=pw[1]+2;y<pw[1]+pw[3]-6;y+=4) b.hl(pw[0]+1,pw[0]+pw[2]-2,y,P.w2);   // Regale mit Paketen
  [[pw[0]+2,pw[1]+4,6,3,P.e3],[pw[0]+17,pw[1]+8,7,3,P.e4],[pw[0]+3,pw[1]+12,5,3,P.e2]].forEach(function(q){ b.rect(q[0],q[1],q[2],q[3],q[4]); b.hl(q[0],q[0]+q[2]-1,q[1],M.UP[q[4]]); });
  for (x=pw[0]-3;x<pw[0]+pw[2]+3;x++){ b.px(x,pw[1]-3,P.m3); b.px(x,pw[1]-2,P.m2); }   // Klappe (hochgestellt)
  b.rect(pw[0]-1,pw[1]+pw[3],pw[2]+2,3,P.m3); b.hl(pw[0]-1,pw[0]+pw[2],pw[1]+pw[3],P.m4); b.hl(pw[0]-1,pw[0]+pw[2],pw[1]+pw[3]+2,P.m1);   // Ablage
  for (x=x0;x<x1;x++){ dk(b,x,GY-5,1); } }

// ---------------------------------------------------------------- Straße in die Tiefe, Taxi
function paintStreet(b){ var x, y, x0=ROW.x1, x1=STA.x0, vx=416, fl=88, ft=58, fx0=407, fx1=427;
  // ferne Querfassade, Seitenwände, die sich zum Fluchtpunkt verjüngen, Fahrbahn mit Mittellinie, Gehsteige
  for (y=ft;y<fl;y++) for (x=fx0;x<fx1;x++){ var c=tex.plaster(x,y,R('s2 s3 s4'),99); if ((y-ft)%6===3 && (x-fx0)%4===1) c=P.m1; b.px(x,y,c); }
  for (x=fx0;x<fx1;x++){ b.px(x,ft-1,P.s4); }
  for (y=ROW.top;y<GY;y++) for (x=x0;x<fx0;x++){ var t=(x-x0)/(fx0-x0), yt=lerp(ROW.top,ft,t), yb=lerp(GY,fl,t); if (y<yt||y>=yb) continue; var c2=tex.plaster((x-x0)*3,y,R('s2 s3 s3'),99); if (((x-x0)%6)===2 && y>yt+4 && y<yb-6 && ((y-rd(yt))%7)<4) c2=P.k2; b.px(x,y,c2); }
  for (y=STA.wing;y<GY;y++) for (x=fx1;x<x1;x++){ var t2=(x1-x)/(x1-fx1), yt2=lerp(STA.wing,ft-6,t2), yb2=lerp(GY,fl,t2); if (y<yt2||y>=yb2) continue; var c3=tex.plaster((x1-x)*3,y,R('m2 s2 s3'),99); if (((x1-x)%5)===1 && y>yt2+3 && y<yb2-5 && ((y-rd(yt2))%6)<3) c3=P.m1; b.px(x,y,c3); }
  for (y=fl;y<GY;y++){ var d=(y-fl)/(GY-fl), l=lerp(fx0,x0,d), r=lerp(fx1,x1,d); for (x=Math.floor(l);x<Math.ceil(r);x++){ var u=(x-l)/Math.max(1,r-l), c4=(u<0.12||u>0.88)?P.s2:P.m2; if (Math.abs(u-0.5)<0.025 && ((y>>1)&1)) c4=P.s4; if (hash(x,y)<0.06) c4=P.m1; b.px(x,y,c4); } }
  // Ampel, ein Auto in der Ferne, Laterne
  b.vl(fx1+3,70,fl,P.k1); b.rect(fx1+2,66,3,5,P.k1); b.px(fx1+3,67,P.r2); b.px(fx1+3,69,P.g2);
  b.rect(fx0+4,fl-4,7,3,P.r2); b.hl(fx0+5,fx0+9,fl-5,P.r1); b.px(fx0+4,fl-2,P.k1); b.px(fx0+10,fl-2,P.k1);
  b.vl(fx0-2,64,fl+1,P.m1); b.hl(fx0-2,fx0+1,64,P.m1); b.px(fx0+1,65,P.s5); STREETLAMP=[fx0+1,65]; }
function paintTaxi(b,tod,ox,oy,spr){ var x0=ox===undefined?TAXI.x0:ox, by=oy===undefined?TAXI.base:oy, L=46, x, y;   // spr: als Sprite in einen kleinen Puffer (ohne Schneemaske)
  // Karosserie (W123 von der Seite): lange Haube, Kabine, kurzes Heck; Chromleiste, Radläufe
  var prof=[[0,10],[3,11],[10,12],[13,12],[14,17],[17,21],[30,21],[34,16],[36,13],[44,12],[46,10]];
  function topAt(u){ for (var i=0;i<prof.length-1;i++){ var a=prof[i], c=prof[i+1]; if (u>=a[0] && u<=c[0]) return lerp(a[1],c[1],(u-a[0])/Math.max(1,c[0]-a[0])); } return 10; }
  for (x=x0;x<x0+L;x++){ var u=x-x0, ht=rd(topAt(u)); for (y=by-ht;y<by-2;y++){ var d=y-(by-ht), c=P.s5;
      if (u>=14 && u<=33 && y<by-12 && d>0){ c=(u===23||u===24)?P.s4:((d<2)?P.c2:P.c1); if (((u*0.7+y)%13)<1.3) c=P.c3; }
      else if (d===0) c=P.s6; else if (y===by-8) c=P.m4; else if (y>by-5) c=P.s3;
      if (u<1 || u>L-2) c=P.s3; b.px(x,y,c); } }
  [[x0+8,by-2],[x0+37,by-2]].forEach(function(wh){ b.ellipse(wh[0],wh[1],4,4,P.k1); b.ellipse(wh[0],wh[1],2,2,P.m3); b.px(wh[0],wh[1],P.m1); for (var xx=wh[0]-5;xx<=wh[0]+5;xx++){ var yy=wh[1]-5+((Math.abs(xx-wh[0])>3)?1:0); if (b.get(xx,yy)!==T) b.px(xx,yy,P.k2); } });
  b.rect(x0+L-2,by-9,2,2,P.y3); b.rect(x0,by-9,2,2,P.r3); b.hl(x0-1,x0+3,by-5,P.m4); b.hl(x0+L-3,x0+L,by-5,P.m4);
  b.px(x0+20,by-10,P.m2); b.px(x0+28,by-10,P.m2);
  // Dachschild TAXI
  b.rect(x0+19,by-25,11,4,P.y3); b.hl(x0+19,x0+29,by-25,P.y4); M.microText(b,'TAXI',x0+19,by-26+1,P.k1); b.hl(x0+21,x0+27,by-21,P.k2);
  for (x=x0+2;x<x0+L-2;x++) if (bayer(x,by)<0.8) dk(b,x,by,2);
  if (spr) return; TAXISIGN=[x0+19,by-25]; snowRect(x0+14,by-22,20,2); snowRect(x0,by-13,14,2); snowRect(x0+34,by-14,12,2); }
// Abfahrt (Kapitel 5): das Taxi fährt die Straße hinauf in die Tiefe – kleiner werdend auf den Fluchtpunkt zu (S.taxiGo: Spielzeit des Starts, S.taxiGone: nicht mehr im Hintergrund)
var TAXISPR={};
function taxiSprite(tod){ var k=tod||'day'; if (TAXISPR[k]) return TAXISPR[k]; var b=new M.Buf(50,32,T); paintTaxi(b,tod,2,30,true); TAXISPR[k]=b; return b; }
function drawTaxiGo(fb,v,S){ var dt=v.gt-S.taxiGo; if (dt<0) dt=0; var k=Math.min(1,dt/3600); if (k>=1) return; var e=k*k*(3-2*k);
  var x=TAXI.x0+(406-TAXI.x0)*e, y=TAXI.base+(91-TAXI.base)*e, sc=1-0.78*e, spr=taxiSprite(v.tod), w=Math.max(4,Math.round(spr.w*sc)), h=Math.max(3,Math.round(spr.h*sc));
  var ox=Math.round(x-v.cam), oy=Math.round(y-h+2); if (ox>=fb.w||ox+w<0) return;
  for (var yy=0;yy<h;yy++) for (var xx=0;xx<w;xx++){ var c=spr.d[Math.min(spr.h-1,Math.floor(yy/sc))*spr.w+Math.min(spr.w-1,Math.floor(xx/sc))]; if (c===T) continue; fb.px(ox+xx,oy+yy,c); }
  if (k<0.6){ for (var i=0;i<5;i++){ var ph=(v.t*0.5+i/5)%1, ex=Math.round(x-3-ph*8*sc)-v.cam, ey=Math.round(y-3-ph*9); if (bayer(ex,ey)<0.7-ph*0.6) fb.px(ex,ey,v.tod==='day'?P.s4:P.m2); } } }

// ---------------------------------------------------------------- Bahnhof: Flachdach, Glasfront, Uhr, Halle; Haltestelle der Linie 1
var GLASS=new Uint8Array(W*H);
function paintStation(b,tod){ var x0=STA.x0, x1=STA.x1, h0=STA.hall0, h1=STA.hall1, x, y;
  function roofTop(x){ return (x>=h0-6 && x<h1+6)?STA.roof:STA.wing; }
  function fasc(x){ return (x>=h0-6 && x<h1+6)?11:6; }
  for (x=x0;x<x1;x++){ var rt=roofTop(x), ft=rt+fasc(x);
    for (y=rt;y<ft;y++) b.px(x,y,(y===rt)?P.s6:((y===ft-1)?P.m1:P.s4));
    for (y=ft;y<GY;y++){ var c, m=((x-x0)%10), tr=(y-ft);
      if (y>=GY-6) c=(y===GY-6)?P.s3:P.m2;
      else if (m===0) c=P.m1; else if (tr===0||((y-ft)%22===0)) c=P.m1;
      else { GLASS[y*W+x]=1; var rf=((x*0.5+y)%31), hall=(x>=h0&&x<h1); c=(tod==='day')?((rf<2.2)?P.b4:(y<ft+20?P.b2:P.c2)):(y<ft+14?P.c1:P.c0); if (tod==='day' && rf>=2.2 && rf<3.4 && bayer(x,y)<0.5) c=P.b3; if (!hall && y>ft+18) c=P.c1; }
      b.px(x,y,c); } }
  for (x=x0;x<x1;x++){ dk(b,x,roofTop(x)+fasc(x),2); dk(b,x,roofTop(x)+fasc(x)+1,1); }
  for (x=h0-6;x<h1+6;x++){ b.px(x,STA.roof-1,P.s5); } snowRect(x0,STA.wing-1,x1-x0,2); snowRect(h0-6,STA.roof-1,h1-h0+12,2);
  b.vl(h0-6,STA.roof,STA.wing+6,P.s3); b.vl(h1+5,STA.roof,STA.wing+6,P.m1);
  var lw=M.textWidth('ŽELJEZNIČKA STANICA'); M.text(b,'ŽELJEZNIČKA STANICA',rd((h0+h1)/2-lw/2),STA.roof+3,P.b0); STALABEL=[rd((h0+h1)/2-lw/2),STA.roof+3];
  // Eingang mit Pendeltüren und Vordach
  var ex=(h0+h1)/2-14; b.rect(ex,72,28,GY-6-72,P.k2); for (y=73;y<GY-6;y++) for (x=ex+1;x<ex+27;x++){ GLASS[y*W+x]=2; b.px(x,y,((x-ex)%7===0)?P.m1:P.c0); } b.hl(ex-4,ex+31,70,P.s5); b.hl(ex-4,ex+31,71,P.m1);
  // Uhr an der Glasfront
  var cx=CLK.cx, cy=CLK.cy, r=CLK.r; b.ellipse(cx+0.5,cy+0.5,r+1.4,r+1.4,P.m0); b.ellipse(cx+0.5,cy+0.5,r,r,P.s6); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(rd(cx+Math.cos(a)*(r-1.5)),rd(cy+Math.sin(a)*(r-1.5)),P.k1); }
  for (y=cy-r-2;y<=cy+r+2;y++) for (x=cx-r-2;x<=cx+r+2;x++) GLASS[y*W+x]=0;
  b.vl(cx,cy+r+1,cy+r+4,P.m1); }
function paintShelter(b){ var x0=SHEL.x0, x1=SHEL.x1, top=SHEL.top, by=SHEL.base, x, y;
  for (y=top+6;y<by-3;y++) for (x=x0+2;x<x1-2;x++){ var c=b.get(x,y); if (c===T) c=P.m2; var r2=((x*0.7+y)%19); b.px(x,y,(r2<1.2)?P.s4:M.DN[c]); }
  [x0,x0+1,x1-2,x1-1].forEach(function(px,i){ for (y=top+4;y<by;y++) b.px(px,y,(i%2)?P.m1:P.m2); });
  for (x=x0-3;x<x1+3;x++){ b.px(x,top,P.m4); b.px(x,top+1,P.m3); for (y=top+2;y<top+8;y++) b.px(x,y,P.b1); b.px(x,top+8,P.k2); }
  micro(b,'ŽELJ. STANICA',rd((x0+x1)/2-M.microWidth('ZELJ. STANICA')/2),top+2,P.s6);
  snowRect(x0-3,top,x1-x0+6,2);
  b.rect(x0+4,top+12,7,7,P.s6); b.hl(x0+4,x0+10,top+12,P.r2); M.microText(b,'1',x0+6,top+13,P.k1);
  b.rect(x1-12,top+12,8,12,P.s5); for (y=top+14;y<top+23;y+=2) b.hl(x1-11,x1-6,y,P.m2);
  b.rect(x0+8,by-12,x1-x0-16,2,P.w2); b.vl(x0+10,by-10,by-1,P.m1); b.vl(x1-11,by-10,by-1,P.m1); }
function paintWire(b){ var x; for (x=STA.x0-2;x<W;x++){ b.px(x,42,P.k1); } [446,612].forEach(function(px){ b.vl(px,8,GY+2,P.m2); b.vl(px+1,8,GY+2,P.m1); b.hl(px-1,px+2,8,P.m3); b.line(px,22,px-14,24,P.m1); b.line(px-14,24,px-14,41,P.m0); b.line(px,30,px-14,24,P.m0); b.rect(px-1,GY,4,3,P.m1); }); for (x=STA.x0;x<W;x++){ var u=((x-446)%166+166)%166/166; b.px(x,16+rd(Math.sin(u*Math.PI)*3),P.k2); } }

// ---------------------------------------------------------------- Boden: Busbucht (Asphalt), Bahnsteig, Vorplatz aus Platten, Gleis
function slab(x,y,wet){ var row=Math.floor((y-GY)/5+((y-GY)>20?0.5:0)), off=(row&1)*9, sw=18+((y-GY)>20?6:0), col=Math.floor((x+off)/sw), fx=(x+off)-col*sw, fy=(y-GY)%5;
  if (fy===0 || fx<1) return wet?P.m1:P.s1; var t=hash(col,row), c=t<0.3?P.s2:(t<0.85?P.s3:P.s4); if (fy===1 && fx>2) c=M.UP[c]; if (hash(x>>1,y>>1)<0.03) c=M.DN[c]; if (wet) c=M.DN[c]; return c; }
function asphalt(x,y,wet){ var c=(hash(x>>1,y>>1)<0.5)?P.m1:P.m2; if (hash(x,y)<0.05) c=P.m3; if (fbm(x*0.05,y*0.3,3)>0.66) c=M.DN[c]; if (wet) c=M.DN[c]; return c; }
function paintGround(b,wea){ var x, y, wet=(wea==='rain'||wea==='snow');
  for (y=GY;y<H;y++) for (x=0;x<W;x++){ var c;
    if (x<CAN.x1+2 && y<PLAT){ c=asphalt(x,y,wet); WET[y*W+x]=1; }
    else if (x>=ROW.x1 && x<STA.x0 && y<TAXI.base+3){ c=asphalt(x,y,wet); WET[y*W+x]=1; }
    else if (x>=STA.x0 && y>=102 && y<=111){ c=asphalt(x,y,wet); WET[y*W+x]=1; }
    else c=slab(x,y,wet);
    b.px(x,y,c); PAVE[y*W+x]=1; }
  // Busbucht: Markierungen, Bordstein
  for (x=0;x<CAN.x1+2;x++){ b.px(x,PLAT,P.s5); b.px(x,PLAT+1,P.s3); b.px(x,PLAT+2,P.m1); if ((x>>2)%2===0) b.px(x,PLAT-2,P.y3); }
  [[30,1],[106,1]].forEach(function(q){ for (y=GY+1;y<PLAT-2;y++){ var xx=q[0]+rd((y-GY)*0.8); b.px(xx,y,P.s4); } });
  // Gleis vor dem Bahnhof
  for (x=STA.x0;x<W;x++){ b.px(x,103,P.m4); b.px(x,104,P.k1); b.px(x,107,P.m4); b.px(x,108,P.k1); if (x%9===0){ b.px(x,105,P.m1); b.px(x,106,P.m1); } }
  for (x=STA.x0;x<W;x++){ b.px(x,111,P.s4); b.px(x,112,P.s2); }
  for (x=0;x<W;x++){ dk(b,x,GY,2); if (bayer(x,GY+1)<0.6) dk(b,x,GY+1,1); }
  // Gully, Kaugummiflecken
  b.ellipse(300,128,4,1.4,P.k1); b.hl(297,303,128,P.m1); for (var i=0;i<30;i++){ var gx=Math.floor(hash(i,8)*W), gy=114+Math.floor(hash(i,9)*28); b.px(gx,gy,P.s1); }
  if (wea==='snow'){ for (y=GY;y<H;y++) for (x=0;x<W;x++){ var k=y*W+x; if (WET[k]) continue; var n=fbm(x*0.028,y*0.11,2)+fbm(x*0.1,y*0.4,5)*0.25, path=Math.exp(-Math.pow((y-124)/7,2))*0.32, v=n-path, c2=b.get(x,y);
      if (v>0.62){ var joint=(c2===P.s1||c2===P.m1); b.px(x,y,joint?P.s3:((v>0.72||bayer(x,y)<(v-0.62)*10)?P.s5:P.s4)); } else if (v>0.56 && bayer(x,y)<0.35) b.px(x,y,P.s4); } }
}
// nasser Asphalt und Platten: Spiegelungen
function wetReflect(b,amt){ var src=b.clone();
  for (var y=GY+2;y<H;y++){ var d=y-GY, k=amt-d/70, sy=GY-1-Math.floor(d*0.9); if (k<=0.04||sy<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (!PAVE[i]) continue; var pud=WET[i]?0.8:fbm(x*0.07,y*0.3,4); if (pud<0.55) continue; var sx=x+((y%3===1)?rd(Math.sin(y*1.3+x*0.07)):0); if (sx<0||sx>=W) continue; var sc=src.d[sy*W+sx];
      if (bayer(x,y)<k*(pud-0.45)*2.2) b.d[i]=M.DN[sc]; } } }

// ---------------------------------------------------------------- Laternen (hohe Peitschenmasten mit Natriumleuchte)
function lampPost(w,l){ var x=l.x, by=l.base, top=by-l.h; for (var y=top+4;y<by;y++){ w.px(x,y,P.m2); w.px(x+1,y,P.m1); } w.rect(x-1,by-5,4,5,P.m1); w.hl(x-1,x+2,by-5,P.m3);
  w.line(x+1,top+4,x+3,top+1,P.m1); w.hl(x+3,x+8,top,P.m1); w.hl(x+4,x+11,top+1,P.m2); w.hl(x+5,x+11,top+2,P.k1); w.hl(x+6,x+10,top+3,P.m3); }
function lampGlass(w,l){ var x=l.x, top=l.base-l.h; w.hl(x+6,x+10,top+3,P.y4); w.hl(x+7,x+9,top+3,P.l0); w.px(x+8,top+4,P.y3); }

// ---------------------------------------------------------------- Bild
var STALABEL=[490,15], STREETLAMP=[408,65], BASE=null, LASTB=null, BUSLED=[48,57,46,5], BUSLIGHTS=[], TAXISIGN=[415,84];
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,T), x, y, sunny=(tod==='day'&&wea==='calm');
  DEP.fill(0); SNOW.fill(0); PAVE.fill(0); TRAMM.fill(0); WET.fill(0); GLASS.fill(0);
  stage(b,1,function(){ paintHills(b,tod,wea); });
  stage(b,2,function(){ paintTowers(b,tod); });
  stage(b,3,function(){ paintStreet(b); });
  stage(b,4,function(){ paintCanopyBack(b); paintRow(b,tod); paintStation(b,tod); });
  stage(b,5,function(){ paintGround(b,wea); });
  if (S.tramIn){ var tb=new M.Buf(W,H,T); M.scn.tram(tb,TRAM.x,TRAM.rail,{s:TRAM.s,line:'1',dir:'L',doors:'open'}); for (var k=0;k<W*H;k++) if (tb.d[k]!==T){ b.d[k]=tb.d[k]; TRAMM[k]=1; DEP[k]=5; } }
  stage(b,5,function(){ paintShelter(b); paintWire(b); paintBus(b,tod,S); paintCanopy(b); paintBoard(b,tod!=='day'); paintKioskBack(b); paintRack(b); if (!S.taxiGone) paintTaxi(b,tod); });
  var fog=wea==='fog', snow=wea==='snow';
  if (!sunny){ var fk=fog?1:(snow?0.8:0.5), fcol=tod==='night'?P.m1:(tod==='dusk'?P.m2:(tod==='dawn'?P.m3:P.s4));
    M.fogBake(b,function(x,y){ var d=DEP[y*W+x]; if (d===1) return 0.88*fk; if (d===2) return 0.72*fk; if (d===3) return 0.42*fk; if (d===4) return 0.1*fk; return 0; },{col:fcol}); }
  else M.fogBake(b,function(x,y){ var d=DEP[y*W+x]; return d===1?0.42:(d===2?0.34:(d===3?0.12:0)); },{col:P.b4});
  if (snow) M.snowCap(b,0,0,W,H,function(x,y){ return SNOW[y*W+x]===1; });
  var sk=new M.Buf(W,H,P.k0); paintSky(sk,tod,wea); SKYM.fill(0);
  for (var q=0;q<W*H;q++) if (b.d[q]===T){ b.d[q]=sk.d[q]; SKYM[q]=1; }
  if (snow||wea==='rain') wetReflect(b,0.5);
  // Schatten: unter dem Dach dunkel, Kontaktschatten; bei klarer Kälte die tiefe Sonne von links
  M.light(b,M.lf.sum(M.lf.band(118,H,0,-0.4),M.lf.pool((BUS.x0+BUS.x1)/2,BUS.base+1,34,3,-1.1),M.lf.pool((KIO.x0+KIO.x1)/2,KIO.base+1,22,3,-0.9),S.taxiGone?M.lf.k(0):M.lf.pool(TAXI.x0+23,TAXI.base+1,26,3,-1)),0,0,function(x,y){ return !SKYM[y*W+x]; });   // ohne Taxi kein Schatten darunter
  M.light(b,M.lf.k(-0.6),0,0,function(x,y){ return x<CAN.x1+3 && y>CAN.y1 && y<PLAT+8 && !SKYM[y*W+x] && DEP[y*W+x]>=4; });
  if (sunny) castShadows(b,S);
  BASE=b.clone();
  shade(b,0,0,todKey(tod,wea),lightsFor(tod,wea,S),function(x,y){ return SKYM[y*W+x]===1; });
  if (tod!=='day') afterLights(b,tod,wea,S);
  LASTB=b; return b; }
function castShadows(b,S){ var objs=[[KIO.x0,KIO.x1,KIO.base,22],[SHEL.x0,SHEL.x1,SHEL.base,16]]; if (!(S&&S.taxiGone)) objs.push([TAXI.x0,TAXI.x0+44,TAXI.base,12]);
  LAMPS.forEach(function(l){ objs.push([l.x,l.x+1,l.base,30]); });
  objs.forEach(function(o){ var len=o[3]; for (var j=1;j<=len;j++){ var y=o[2]+Math.round(j*0.45), dx=Math.round(j*0.9); if (y>=H) break; for (var x=o[0]+dx;x<=o[1]+dx;x++){ if (x<0||x>=W) continue; var k=y*W+x; if (SKYM[k]||!PAVE[k]) continue; if (bayer(x,y)<0.9-j/len*0.45) b.px(x,y,M.DN[b.get(x,y)]); } } }); }
function afterLights(b,tod,wea,S){ var x, y, night=tod==='night', fog=wea==='fog';
  towerLights(b,tod);
  // Bahnhofshalle: warmes Licht hinter dem Glas. Oben die Lampenreihen, hinten die Galerie und die Schalter, unten Menschen
  // als kleine Schatten; in den Flügeln sind manche Scheiben dunkel.
  var hc=(STA.hall0+STA.hall1)/2, ft0=STA.roof+11;
  for (y=0;y<H;y++) for (x=STA.x0;x<W;x++){ var g=GLASS[y*W+x]; if (!g) continue; var k=y*W+x; if (TRAMM[k]) continue;
    var hall=(x>=STA.hall0&&x<STA.hall1), pxi=Math.floor((x-STA.x0)/10), pyi=Math.floor((y-ft0)/22);
    if (!hall && hash(pxi,pyi+7)<0.4) continue;
    var dy=(y-ft0)/(GY-6-ft0), lv=(hall?0.62:0.4)-dy*0.25-Math.abs(x-hc)/260; if (g===2) lv=0.7;
    var c=bayer(x,y)<lv?P.y3:(bayer(x,y)<lv+0.25?P.y2:P.y1);
    if (hall && y>ft0+38 && y<ft0+41) c=P.w1;                                   // Galerie
    if (hall && y>=ft0+41 && y<ft0+52 && ((x-STA.hall0)%26)>4 && ((x-STA.hall0)%26)<16) c=(y<ft0+43)?P.w2:P.y4;   // Schalter
    if (((y-ft0)%22===3 || (y-ft0)%22===4) && (x%10)===5) c=P.l0;               // Lampen
    b.px(x,y,c); }
  [[492,90],[503,91],[524,89],[566,90],[579,91],[590,90]].forEach(function(q){ if (TRAMM[q[1]*W+q[0]]) return; b.rect(q[0],q[1]-7,2,7,P.w1); b.px(q[0],q[1]-8,P.w1); b.px(q[0]+1,q[1]-8,P.w0); });
  // Kiosk, Bureg-Fenster (beschlagen und warm), Paketschalter, Wartehäuschen, Bus
  for (y=KIO.win0;y<KIO.sill;y++) for (x=KIO.x0+3;x<KIO.x1-3;x++){ var c=BASE.get(x,y); b.px(x,y,M.tintPx(levels('night')[4],c,x,y)); }
  var bw=BUR.win; for (y=bw[1];y<bw[1]+bw[3];y++) for (x=bw[0];x<bw[0]+bw[2];x++){ var c2=BASE.get(x,y); b.px(x,y,(c2===P.s4||c2===P.s3)?(bayer(x,y)<0.6?P.y4:P.y3):(c2===P.s5?P.l0:M.UP[b.get(x,y)])); }
  var pw=PAK.win; for (y=pw[1]+3;y<pw[1]+pw[3];y++) for (x=pw[0];x<pw[0]+pw[2];x++){ var c3=BASE.get(x,y); if (c3===P.w1||c3===P.w0) b.px(x,y,bayer(x,y)<0.4?P.y2:P.y1); }
  for (x=SHEL.x0-3;x<SHEL.x1+3;x++) for (y=SHEL.top+2;y<SHEL.top+8;y++){ var o=BASE.get(x,y); b.px(x,y,o===P.s6?P.l1:(bayer(x,y)<0.5?P.b2:P.b1)); }
  BUSLIGHTS.forEach(function(q){ b.rect(q[0],q[1],4,3,P.y5); b.px(q[0]+1,q[1]+1,P.l1); });
  [30,80,128].forEach(function(xx){ b.hl(xx-9,xx+9,CAN.y1+2,P.l1); b.hl(xx-8,xx+8,CAN.y1+3,P.n5); });
  paintBoard(b,true); if (!(S&&S.taxiGone)){ b.rect(TAXISIGN[0],TAXISIGN[1],11,4,P.y4); b.hl(TAXISIGN[0],TAXISIGN[0]+10,TAXISIGN[1],P.y5); M.microText(b,'TAXI',TAXISIGN[0],TAXISIGN[1],P.k1); }
  M.text(b,'ŽELJEZNIČKA STANICA',STALABEL[0],STALABEL[1],night?P.b3:P.b2);
  // Uhr beleuchtet
  b.ellipse(CLK.cx+0.5,CLK.cy+0.5,CLK.r,CLK.r,P.s6); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(rd(CLK.cx+Math.cos(a)*(CLK.r-1.5)),rd(CLK.cy+Math.sin(a)*(CLK.r-1.5)),P.k1); }
  // Straßenbahn erleuchtet
  if (S.tramIn){ var lb=new M.Buf(W,H,T); M.scn.tram(lb,TRAM.x,TRAM.rail,{s:TRAM.s,line:'1',dir:'L',lit:true,litOnly:true}); var tb=new M.Buf(W,H,T); M.scn.tram(tb,TRAM.x,TRAM.rail,{s:TRAM.s,line:'1',dir:'L',doors:'open'});
    for (var k=0;k<W*H;k++){ if (!TRAMM[k]) continue; var bc=BASE.d[k]; if (bc!==tb.d[k] && M.DN[tb.d[k]]!==bc) continue; if (lb.d[k]!==T) b.d[k]=lb.d[k]; else if (tb.d[k]===P.k1 && ((k/W)|0)>TRAM.rail-40) b.d[k]=bayer(k%W,(k/W)|0)<0.4?P.y2:P.y1; } }
  // Lichthöfe der Laternen, Lichtbahnen auf nassem Boden
  LAMPS.forEach(function(l,li){ var hx=l.x+8, hy=l.base-l.h+4, hr=fog?18:10; for (y=hy-hr;y<hy+hr;y++) for (x=hx-hr;x<=hx+hr;x++){ var d=Math.hypot(x-hx,(y-hy)*1.2)/hr; if (d>=1||d<0.25) continue; if (bayer(x,y)<(1-d)*(fog?0.45:0.28)) b.px(x,y,M.UP[b.get(x,y)]); }
    if (wea==='snow'||wea==='rain') for (var yy=l.base+2;yy<H;yy++){ var aa=0.5-(yy-l.base)/60; if (aa<0.05) break; for (x=hx-2;x<=hx+2;x++){ var wx=x+rd(Math.sin(yy*0.5+li)*0.8); if (wx>=0&&wx<W&&PAVE[yy*W+wx] && bayer(wx,yy)<aa*(x===hx?1:0.4)) b.px(wx,yy,yy<l.base+12?P.y3:P.y2); } } }); }

// ---------------------------------------------------------------- Ebenen: Kioskfront (verdeckt Senada), Wand unter dem Paketschalter (verdeckt Fadila), Bank, Laternen
function finishL(L,tod,wea,S){ shade(L,L.ox,L.oy,todKey(tod,wea),lightsFor(tod,wea,S)); }
var SENADA_Y=110, FADILA_Y=109;
function kioskLayer(S,tod,wea){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, L=M.layer(x0-3,KIO.top-3,x1-x0+6,SENADA_Y-KIO.top+5,SENADA_Y+1), w=M.lw(L), x, y;
  // Dach mit Zeitungsbanner, Seitenpfosten, Theke und Front mit Zeitschriften, Fahrkartenschild
  w.rect(x0-3,KIO.top,x1-x0+6,8,P.b0); w.hl(x0-3,x1+2,KIO.top,P.b2); w.hl(x0-3,x1+2,KIO.top+7,P.k2); w.hl(x0-2,x1+1,KIO.top-1,P.m3);
  micro(L,'OSLOBOĐENJE',rd((x0+x1)/2-23)-L.ox,KIO.top+2-L.oy,P.s6);
  if (wea==='snow') for (x=x0-3;x<x1+3;x++){ w.px(x,KIO.top-2,P.s6); if (hash(x,4)<0.6) w.px(x,KIO.top-1,P.s5); }
  w.rect(x0,KIO.top+8,3,by-KIO.top-8,P.g2); w.vl(x0,KIO.top+8,by-1,P.g3); w.rect(x1-3,KIO.top+8,3,by-KIO.top-8,P.g1); w.vl(x1-1,KIO.top+8,by-1,P.g0);
  w.rect(x0,KIO.sill,x1-x0,2,P.w3); w.hl(x0,x1-1,KIO.sill,P.w4);
  w.rect(x0+1,KIO.sill+2,x1-x0-2,SENADA_Y+2-KIO.sill-2,P.g2); w.hl(x0+1,x1-2,KIO.sill+2,P.g1);
  var sx=rd((x0+x1)/2)-15; w.rect(sx,KIO.sill+2,31,19,P.s6); w.hl(sx,sx+30,KIO.sill+2,P.r2); w.hl(sx,sx+30,KIO.sill+20,P.s3);
  M.microText(L,'KARTE',sx+6-L.ox,KIO.sill+3-L.oy,P.k1); M.microText(L,'TICKETS',sx+2-L.ox,KIO.sill+9-L.oy,P.k1); M.microText(L,'GRAS',sx+8-L.ox,KIO.sill+15-L.oy,P.b0);
  [[x0+1,P.r3],[x1-5,P.b2]].forEach(function(q){ w.rect(q[0],KIO.sill+3,4,17,q[1]); w.hl(q[0],q[0]+3,KIO.sill+5,P.s6); w.hl(q[0],q[0]+3,KIO.sill+11,P.s5); w.hl(q[0],q[0]+3,KIO.sill+14,P.s6); });
  finishL(L,tod,wea,S);
  if (LASTB) for (y=by;y<SENADA_Y+3;y++) for (x=x0-3;x<x1+3;x++) w.px(x,y,LASTB.get(x,y));
  if (tod!=='day') micro(L,'OSLOBOĐENJE',rd((x0+x1)/2-23)-L.ox,KIO.top+2-L.oy,P.l1);
  return L; }
function parcelLayer(S,tod,wea){ var pw=PAK.win, x0=pw[0]-6, x1=pw[0]+pw[2]+6, sill=pw[1]+pw[3]+1, L=M.layer(x0,sill,x1-x0,FADILA_Y-sill+4,FADILA_Y+1), w=M.lw(L), x, y;
  if (LASTB) for (y=sill;y<FADILA_Y+4;y++) for (x=x0;x<x1;x++) w.px(x,y,LASTB.get(x,y));
  return L; }
function benchLayer(S,tod,wea){ var bx0=BENCH.x0, bx1=BENCH.x1, s=BENCH.seat, by=BENCH.base, L=M.layer(bx0-2,s-14,bx1-bx0+4,by-s+16,by), w=M.lw(L), x;
  for (var k=0;k<2;k++){ var yy=s-11+k*4; w.rect(bx0,yy,bx1-bx0,3,P.w3); w.hl(bx0,bx1-1,yy,P.w4); w.hl(bx0,bx1-1,yy+2,P.w1); }
  w.rect(bx0-1,s,bx1-bx0+2,3,P.w3); w.hl(bx0-1,bx1,s,P.w5); w.hl(bx0-1,bx1,s+2,P.w1);
  [bx0+2,bx1-4].forEach(function(lx){ w.rect(lx,s-12,2,by-s+12,P.m1); w.vl(lx,s-12,by-1,P.m2); w.rect(lx-1,by-1,4,1,P.k2); });
  if (wea==='snow') for (x=bx0-1;x<=bx1;x++){ w.px(x,s-1,P.s6); if (hash(x,3)<0.6) w.px(x,s-12,P.s6); }
  finishL(L,tod,wea,S); return L; }
function lampLayers(S,tod,wea){ return LAMPS.map(function(l){ var L=M.layer(l.x-2,l.base-l.h-2,16,l.h+3,l.base), w=M.lw(L); lampPost(w,l); finishL(L,tod,wea,S); if (tod!=='day') lampGlass(w,l); return L; }); }
function layers(S,GS,tod){ var wea=M.scn.weather(GS), out=[kioskLayer(S,tod,wea),parcelLayer(S,tod,wea),benchLayer(S,tod,wea)]; lampLayers(S,tod,wea).forEach(function(l){ out.push(l); }); return out; }

// ---------------------------------------------------------------- Bewegung: Leuchtschrift am Bus, Abgas, Uhr, Tauben, Kioskflackern, Wetter
var PIG=[[164,118],[176,124],[190,116],[204,129],[232,121],[246,127],[262,117],[284,131],[300,120],[512,124],[530,130],[548,121]];
function pigeon(fb,x,y,f,t,i,tint){ var peck=Math.sin(t*2.6+i*2.1)>0.45, step=(Math.floor(t*0.9+i*1.3)%5===0)?f:0;
  function px(dx,dy,c){ var X=x+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  px(-3,-3,P.m1); px(-2,-3,P.m3); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m2); px(0,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-2,P.m2); px(3,-1,P.m3); px(4,-1,P.t4); } else { px(2,-3,P.a3); px(2,-4,P.m3); px(3,-5,P.m3); px(2,-5,P.m2); px(4,-4,P.t4); } }
function clockHM(tod,t){ var base=tod==='day'?[11,8]:(tod==='dusk'?[16,42]:(tod==='dawn'?[7,4]:[21,15])), m=base[1]+Math.floor(t/60); return [base[0]+Math.floor(m/60),m%60]; }
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, wea=M.scn.weather(GS), tint=tod!=='day'?(M.TINT[tod]||M.TINT.dawn):null, x, y;
  if (S.taxiGo) drawTaxiGo(fb,v,S);
  // Leuchtschrift am Bus: läuft durch (Mostar steht still)
  var led=BUSLED, txt=busSign(S), lx0=led[0]-cam, lit=tod==='day'?P.y3:P.y4, tw=M.microWidth(txt);
  if (lx0>-led[2] && lx0<fb.w){ var off=(tw<=led[2])?Math.floor((led[2]-tw)/2):(led[2]-Math.floor((t*14)%(tw+led[2]))); var tmp={px:function(px,py,c){ if (px<0||px>=led[2]) return; var X=lx0+px; if (X<0||X>=fb.w) return; fb.px(X,led[1]+py,c); }};
    M.microText(tmp,txt,off,0,lit); }
  // Abgaswolke hinten am Bus
  for (var i=0;i<9;i++){ var ph=(t*0.35+i/9)%1, ex=rd(BUS.x1+BUS.side+2+ph*14+Math.sin(t+i)*2)-cam, ey=rd(BUS.base-10-ph*18); if (ex<0||ex>=fb.w-1) continue; if (bayer(ex,ey)<0.7-ph*0.6){ fb.px(ex,ey,tod==='day'?P.s4:P.m2); if (bayer(ex+1,ey)<0.5-ph*0.4) fb.px(ex+1,ey,tod==='day'?P.s5:P.m3); } }
  // Bahnhofsuhr
  var hm=clockHM(tod,t), cx=CLK.cx-cam, cy=CLK.cy; if (cx>-12 && cx<fb.w+12){ var ha=((hm[0]%12)+hm[1]/60)/12*Math.PI*2-Math.PI/2, ma=hm[1]/60*Math.PI*2-Math.PI/2;
    for (var q=0;q<=12;q++){ var u=q/2; var mx=rd(cx+Math.cos(ma)*u), my=rd(cy+Math.sin(ma)*u); if (u<=CLK.r-2 && mx>=0&&mx<fb.w) fb.px(mx,my,P.k0); var hx=rd(cx+Math.cos(ha)*u), hy=rd(cy+Math.sin(ha)*u); if (u<=CLK.r-4 && hx>=0&&hx<fb.w) fb.px(hx,hy,P.k0); }
    var sa=(t%60)/60*Math.PI*2-Math.PI/2; for (var s2=0;s2<CLK.r-1;s2++){ var sx=rd(cx+Math.cos(sa)*s2), sy=rd(cy+Math.sin(sa)*s2); if (sx>=0&&sx<fb.w) fb.px(sx,sy,P.r3); } }
  // Tauben
  if (tod!=='night') PIG.forEach(function(p,i){ var px=p[0]+rd(Math.sin(t*0.33+i*1.7)*4)-cam; if (px<-6||px>fb.w+6) return; pigeon(fb,px,p[1],(Math.sin(t*0.21+i)>0)?1:-1,t,i,tint); });
  // Neonröhre im Kiosk flackert
  if (tod!=='day'){ var kx=KIO.x0+6-cam, fl=(Math.sin(t*17.3)+Math.sin(t*5.1+2))>1.6; if (kx>-40 && kx<fb.w){ for (x=kx;x<kx+28;x++) if (x>=0&&x<fb.w) fb.px(x,KIO.win0+1,fl?P.n4:P.l1); }
    LAMPS.forEach(function(l,li){ var lx=l.x+8-cam; if (lx<-10||lx>fb.w+10) return; M.glow(fb,lx,l.base-l.h+4,wea==='fog'?12:7,t+li,wea==='fog'?0.28:0.18); }); }
  else { var kx2=KIO.x0+6-cam; if (kx2>-40 && kx2<fb.w && Math.sin(t*9.1)+Math.sin(t*3.7)>1.75){ for (x=kx2;x<kx2+28;x++) if (x>=0&&x<fb.w) fb.px(x,KIO.win0+1,P.s6); } } }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS), tod=v.tod;
  if (wea==='fog') M.fogDrift(fb,v.t,{y0:24,y1:120,amt:0.38,k:2,col:tod==='night'?P.m1:(tod==='dusk'?P.m2:P.s4),cam:v.cam});
  if (wea==='snow') M.snow(fb,v.t,{n:60,cam:v.cam,mask:function(x,y){ return !(x<CAN.x1 && y>CAN.y1 && y<PLAT); }});
  if (wea==='rain') M.rain(fb,v.t,{n:80,col:tod==='day'?P.m3:P.n2,col2:tod==='day'?P.m4:P.n3}); }
// Geistersicht: wartende Gestalten mit Koffern, nur als Umrisse
var GH=null;
function ghostShapes(){ if (GH) return GH; GH=[]; var who=[['mladen','R',36,122],['ivka','R',132,118],['luka','L',318,124],['zdenka','L',598,121],['dinko','R',492,126]];
  who.forEach(function(g,i){ if (!M.CHARS || !M.CHARS[g[0]] || !M.ANIMS) return; var tb=new M.Buf(48,60,T); M.drawPose(tb,20,56,M.ANIMS.idleS[0][0],g[1],g[0],{});
    var sw=i%2?7:9, sh=i%2?9:6, sx=g[1]==='R'?27:5; for (var yy=56-sh;yy<56;yy++) for (var xx=sx;xx<sx+sw;xx++) tb.px(xx,yy,P.k1); for (var hx=sx+2;hx<sx+sw-2;hx++) tb.px(hx,56-sh-2,P.k1); tb.px(sx+2,56-sh-1,P.k1); tb.px(sx+sw-3,56-sh-1,P.k1);
    var pts=[]; for (var y=0;y<60;y++) for (var x=0;x<48;x++){ if (tb.get(x,y)!==T) continue; if (tb.get(x-1,y)!==T||tb.get(x+1,y)!==T||tb.get(x,y-1)!==T||tb.get(x,y+1)!==T) pts.push(x-20,y-56); }
    GH.push({x:g[2],y:g[3],pts:pts,ph:i*1.7}); });
  return GH; }
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam; ghostShapes().forEach(function(g){ var a=0.5+Math.sin(t*0.6+g.ph)*0.2, sx=g.x-cam; if (sx<-30||sx>fb.w+30) return;
    for (var i=0;i<g.pts.length;i+=2){ var X=sx+g.pts[i]+Math.round(Math.sin(t*1.3+g.pts[i+1]*0.3+g.ph)*0.4), Y=g.y+g.pts[i+1]; if (X<0||X>=fb.w||Y<0||Y>=144) continue; if (bayer(X+Math.floor(t*6),Y)>a) continue; fb.d[Y*fb.w+X]=(Y<g.y-40)?P.x6:P.x5; } }); }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<110||y>140||x<6||x>634) return false;
  if (x<CAN.x1+2 && y<PLAT+3) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.base+2) return false;
  if (x>=KIO.x0-2 && x<=KIO.x1+2 && y<SENADA_Y+3) return false;
  if (x>=PAK.win[0]-6 && x<=PAK.win[0]+PAK.win[2]+6 && y<FADILA_Y+3) return false;
  for (var i=0;i<LAMPS.length;i++){ var l=LAMPS[i]; if (Math.abs(x-l.x-0.5)<4 && y<l.base+2 && y>l.base-6) return false; }
  return true; }
M.defineArt('stanica',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,M.scn.weather(GS)); if (!k) return null; return levels(k)[1].a; },
  spots:{
    exit:[0,96,10,44],
    bus:[BUS.x0-8,BUS.top-6,BUS.x1-BUS.x0+BUS.side+10,BUS.base-BUS.top+8],
    timetable:[BOARD.x0,BOARD.y0,BOARD.x1-BOARD.x0,BOARD.y1-BOARD.y0],
    kiosk:[KIO.x0-3,KIO.top-1,KIO.x1-KIO.x0+6,KIO.base-KIO.top+2],
    newspapers:[RACK.x0-1,62,RACK.x1-RACK.x0+2,KIO.base-62],
    burek:[BUR.x0,56,BUR.x1-BUR.x0,GY-56],
    exchange:[MJE.x0,56,MJE.x1-MJE.x0,GY-56],
    atm:[ATM.x0-5,62,ATM.x1-ATM.x0+10,32],
    parcel:[PAK.x0,50,PAK.x1-PAK.x0,GY-50],
    taxi:[TAXI.x0-1,TAXI.base-27,48,29],
    station:[STA.x0,STA.roof-1,STA.x1-STA.x0,GY-STA.roof+1],
    clock:[CLK.cx-CLK.r-2,CLK.cy-CLK.r-2,CLK.r*2+5,CLK.r*2+5],
    tram_stop:[SHEL.x0-3,SHEL.top-1,SHEL.x1-SHEL.x0+6,SHEL.base-SHEL.top+1],
    tram:[TRAM.x,48,W-TRAM.x,60],
    bench:[BENCH.x0-1,BENCH.seat-12,BENCH.x1-BENCH.x0+2,BENCH.base-BENCH.seat+12],
    pigeons:[156,110,160,26]
  },
  stands:{
    exit:[8,124,'L'], bus:[86,120,'B'], timetable:[128,120,'B'], kiosk:[174,118,'B'], newspapers:[208,116,'B'], burek:[250,114,'B'], exchange:[304,114,'B'], atm:[340,114,'B'],
    parcel:[372,120,'B'], taxi:[418,116,'B'], station:[540,114,'B'], clock:[540,116,'B'], tram_stop:[466,114,'B'], tram:[500,114,'B'], bench:[594,124,'B'], pigeons:[236,126,'R']
  },
  actorPos:{ fikret:[269,113,'R'], senada:[174,SENADA_Y,'F'], fadila:[371,FADILA_Y,'F'] },
  start:[118,121,'R'], entries:{ map:[14,124,'R'], tramvaj:[500,116,'L'] }
});
})(M);
