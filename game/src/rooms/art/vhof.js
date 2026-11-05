/* ===== rooms/art/vhof.js — Hof des Vulkanizers mit dem TAM 4500.
   Ein Schotterhof hinter der Werkstatt: links die Rückwand der Werkstatt (Ziegel unten, Wellblech oben) mit dem Rolltor, eine
   Lampe mit Gitterkorb darüber. Hinten ein grauer Bretterzaun mit einem Tor zur Gasse, dahinter ein Nachbarhaus, Wohnblocks und
   der kahle Hum. In der Mitte der TAM 4500 im Profil, Front nach links: Rundscheinwerfer, Haube mit Lüftungsschlitzen, eine
   kantige Kabine in verblichenem Blau mit gut erkennbarer Fahrertür (Griff, Trittstufe, Spiegel), dahinter die Holzpritsche mit
   Stahlrungen. Ohne S.tarpOff liegt eine olivgrüne Plane mit Seilen über Pritsche und Kabinendach; mit S.tarpOff ist sie
   abgenommen und liegt zusammengelegt am Zaun. Rechts Ölfässer, Altreifen, Unkraut. Bura: die Plane flattert an einer Ecke.
   Finalnacht (k3_fin_n): sehr dunkel, Neumond, Raureif auf Zaun, Fässern und Schotter; mit S.lights brennen die Scheinwerfer
   (Lichtkegel nach links über den Schotter). Geistersicht: ein blasses Leuchten am Armaturenbrett. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, GY=111;                              // GY: Boden unter den Rädern des TAM
var FY0=104;                                           // Fuß des Zauns
var TK={x:58};                                         // Lastwagen: linke Kante (Stoßstange)
var DOOR={x0:12,x1:44};                                // Rolltor in der Werkstatt-Rückwand (Bildschirm-x)
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function tarpOn(S){ return !(S && S.tarpOff); }
function lightsOn(S){ return !!(S && S.lights); }
function yardOpen(GS){ var r=GS&&GS.rooms&&GS.rooms.vulkanizer; return !!(r && r.yardOpen); }
// Rückwand der Werkstatt: eine Wandfläche in Fluchtpunktperspektive von x=0 (vorn) bis x=58 (hinten am Zaun)
var WL={x0:0,x1:58,t0:-6,t1:34,b0:138,b1:FY0+2};
function wallY(x,top){ var t=(x-WL.x0)/(WL.x1-WL.x0); return top?lerp(WL.t0,WL.t1,t):lerp(WL.b0,WL.b1,t); }
function wallV(x,y){ var t0=wallY(x,true), t1=wallY(x,false); return (y-t0)/(t1-t0); }   // 0 oben .. 1 unten

// ---------------------------------------------------------------- Regionen (für Licht, Himmel und Raureif)
var REG=new Uint8Array(W*H), RG={sky:1,far:2,fence:3,ground:4,wall:5,truck:6,tarp:7,metal:8,glass:9,plant:10,lamp:11};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Himmel und Ferne
function sky(b,tod,weather){ var w=RW(b,RG.sky), x, y;
  if (tod==='night'){ var NR=weather==='frost'?R('k0 k0 k1 k2 n0'):R('k0 k1 k2 n0 n1'); for (y=0;y<70;y++) for (x=0;x<W;x++) w.px(x,y,ra(NR,0.1+y/80+(fbm(x*0.05,y*0.1)-0.5)*0.08,x,y));
    var r=M.rng(23); for (var s=0;s<(weather==='frost'?260:160);s++){ var sx=Math.floor(r()*W), sy=Math.floor(Math.pow(r(),1.4)*58), q=r(); w.px(sx,sy,q<0.08?P.n5:(q<0.35?P.n4:P.n3)); } return; }
  M.scn.sky(w,0,0,W,70,tod,weather==='bura'?'calm':weather,41);
  if (weather==='bura' && tod==='day'){ for (var i=0;i<14;i++){ var cx=hash(i,3)*W, cy=6+hash(i,4)*30, L=30+hash(i,5)*60; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.12+Math.sin(k*0.2)*1); if (bayer(xx,yy)<0.6*(1-Math.abs(k/L-0.5)*2)) w.px(xx,yy,yy<20?P.b4:P.s6); } } } }
function far(b,tod,weather){ var w=RW(b,RG.far), x, y, grey=weather==='grey'||weather==='rain';
  // der Hum (kahl, ohne Zeichen)
  for (x=0;x<W;x++){ var hy=rnd(44+Math.sin(x*0.012+1)*6+Math.sin(x*0.05)*2-(x>200?(x-200)*0.05:0)); for (y=hy;y<74;y++) w.px(x,y,grey?ra(R('m2 m3 m4'),0.5+(hash(x>>1,y)-0.5)*0.3,x,y):ra(R('e2 e3 g4 e4'),0.35+(y-hy)*0.01+(fbm(x*0.1,y*0.2)-0.5)*0.5,x,y)); }
  // Wohnblocks am Westufer
  [[70,26,30],[100,18,22],[196,30,36],[232,22,26],[262,34,30],[296,24,40]].forEach(function(bl,i){ var x0=bl[0], bw=bl[1], bh=bl[2], top=74-bh;
    for (y=top;y<74;y++) for (x=x0;x<x0+bw;x++){ var c=(x===x0)?P.s5:((x===x0+bw-1)?P.s2:P.s4); if (y===top) c=P.m3; if ((y-top)%4===2 && (x-x0)%4>=1 && (x-x0)%4<=2) c=(tod==='night'&&hash(x,y)<0.3)?P.y3:P.m1; if ((y-top)%4===3 && (x-x0)%8<3) c=P.s3; if (grey) c=M.mix(c,P.m3,3); w.px(x,y,c); } });
  // Nachbarhaus hinter dem Zaun (verputzt, Ziegeldach, ein Fenster)
  for (y=50;y<FY0;y++) for (x=232;x<300;x++){ w.px(x,y,(fbm(x*0.08,y*0.1)>0.62)?P.s3:P.s4); }
  for (x=228;x<304;x++) for (y=44;y<51;y++){ var ins=(y-44); if (x<228+ins*0||x>303) continue; w.px(x,y,((x+y)%3===0)?P.t1:(y===44?P.t4:P.t2)); }
  w.rect(258,58,14,12,P.s5); w.rect(260,60,10,9,tod==='night'?P.k1:P.n1); w.vl(265,60,68,P.s5); w.hl(260,269,64,P.s5); w.hl(256,273,70,P.s6); }

// ---------------------------------------------------------------- Bretterzaun mit Tor zur Gasse
function fence(b,tod){ var w=RW(b,RG.fence), x, y;
  for (x=56;x<W;x++){ var bi=Math.floor((x-56)/6), fx=(x-56)%6, top=62+((bi*7)%3)-((bi%5===0)?1:0), lean=(hash(bi,9)-0.5);
    for (y=top;y<FY0;y++){ var c=fx===0?P.w0:(fx===5?P.s1:((hash(bi,2)<0.5)?P.s2:P.e2)); var g=fbm(x*0.3,y*0.08+bi); if (g>0.6 && fx>0) c=M.DN[c]; if (fx===1 && hash(bi,y>>2)<0.3) c=P.s3;
      if (y===top) c=P.s3; if (y===70||y===94) c=(fx===0)?P.w0:P.w1; if ((y===71||y===95) && fx>0) c=P.k2; w.px(x,y,c); } }
  // Tor zur Gasse (zwei Flügel mit Querriegel), ein Riegel, ein Blechschild
  var g0=GATE[0], g1=GATE[1], gm=(g0+g1)>>1;
  for (y=58;y<FY0;y++) for (x=g0;x<g1;x++){ var bx=(x-g0)%5, c2=(bx===0)?P.w0:((hash((x-g0)>>2,7)<0.5)?P.w2:P.w3); if (y===58) c2=P.w4; if (x===gm) c2=P.k2; var gg=fbm(x*0.3,y*0.1); if (gg>0.62 && bx) c2=M.DN[c2]; w.px(x,y,c2); }
  for (x=g0;x<g1;x++){ w.px(x,66,P.w1); w.px(x,96,P.w1); } b.line(g0+1,96,gm-1,67,P.w1); b.line(gm+1,67,g1-1,96,P.w1);
  w.vl(g0-1,56,FY0-1,P.w0); w.vl(g1,56,FY0-1,P.w0); w.rect(gm-3,80,7,2,P.m2); w.px(gm+3,79,P.m3);
  w.rect(gm-11,70,23,8,P.s5); w.hl(gm-11,gm+11,70,P.s6); w.hl(gm-11,gm+11,77,P.s2); M.microText(b,'RAJIĆ',gm-9,72,P.r2); }
var GATE=[252,294];

// ---------------------------------------------------------------- Werkstatt-Rückwand mit Rolltor und Gitterlampe
function workshop(b,tod,GS,S){ var w=RW(b,RG.wall), x, y, open=yardOpen(GS);
  for (x=WL.x0;x<=WL.x1;x++){ var t0=rnd(wallY(x,true)), t1=rnd(wallY(x,false));
    for (y=Math.max(0,t0);y<t1;y++){ var v=wallV(x,y), c;
      if (v>0.58){ var bv=v*60, row=Math.floor(bv/2.2), off=(row&1)*3, bx=Math.floor((x+off)/6); c=((bv%2.2)<0.6||((x+off)%6)<1)?P.s2:((hash(bx,row)<0.5)?P.t2:P.t1); if (v<0.6) c=P.s4; }
      else { c=((x%4)<2)?P.m2:P.m3; if ((x%4)===3) c=P.m1; var rs=fbm(x*0.2,v*20); if (rs>0.66 && bayer(x,y)<(rs-0.66)*2) c=P.e2; }
      w.px(x,y,M.DN[c]); } }
  // Dachkante
  for (x=0;x<=WL.x1+2;x++){ var ty=rnd(wallY(Math.min(x,WL.x1),true)); w.px(x,ty,P.m4); w.px(x,ty+1,P.m1); }
  // Rolltor (offen, wenn es in der Werkstatt hochgezogen ist)
  for (x=DOOR.x0;x<DOOR.x1;x++){ var tt=wallY(x,true), tb=wallY(x,false), dt=rnd(lerp(tt,tb,0.22)), db=rnd(tb);
    for (y=dt;y<db;y++){ var vv=(y-dt)/(db-dt), c2;
      if (open){ c2=(vv<0.06)?P.m1:((x<DOOR.x0+3)?P.k1:P.k0); if (vv>0.7 && hash(x,y)<0.2) c2=P.m0; }
      else { var sl=Math.floor(vv*40)%2; c2=sl?P.m3:P.m2; if (Math.floor(vv*40)%8===0) c2=P.m1; }
      if (x===DOOR.x0||x===DOOR.x1-1) c2=P.m1; w.px(x,y,c2); }
    w.px(x,dt-1,P.m4); w.px(x,dt-2,P.m1); w.px(x,dt-3,P.m2); }
  if (open){ for (var i=0;i<6;i++) w.px(DOOR.x0+6+i*4,rnd(lerp(wallY(DOOR.x0+6+i*4,true),wallY(DOOR.x0+6+i*4,false),0.55)),P.k2); }
  // Gitterlampe über dem Tor
  var lx=30, ly=rnd(lerp(wallY(30,true),wallY(30,false),0.12)); RW(b,RG.lamp).rect(lx-2,ly,5,5,P.s4); b.rect(lx-2,ly,5,1,P.m1); b.vl(lx,ly,ly+4,P.m1); b.hl(lx-2,lx+2,ly+2,P.m1); b.px(lx,ly-1,P.k2); LAMP=[lx,ly+2]; }
var LAMP=[30,40];

// ---------------------------------------------------------------- Boden: Schotter mit Reifenspuren, Pfütze, Unkraut am Zaun
function ground(b,tod,weather){ var w=RW(b,RG.ground), x, y;
  for (y=FY0;y<H;y++) for (x=0;x<W;x++){ if (x<WL.x1 && y<wallY(x,false)) continue; var d=(y-FY0)/(H-FY0), s=1+d*2.5;
    var f=fbm(x*0.06,y*0.12), g=hash(Math.floor(x/s),Math.floor(y/(s*0.6))), c=ra(R('s1 s2 e2 s3 e3 s4'),0.45+(f-0.5)*0.8+(g-0.5)*0.35,x,y); if (hash(x,y)<0.03) c=P.s1; if (hash(x*1.3,y*0.7)>0.985) c=P.s5;
    var tr=Math.abs(y-(122+((x-160)*0.04)))<2.2 || Math.abs(y-(132+((x-160)*0.05)))<2.6; if (tr && hash(x>>1,y)<0.7) c=M.DN[c];
    var pud=Math.hypot((x-226)/26,(y-128)/4); if (pud<1 && weather!=='frost') c=(weather==='rain')?((y%2)?P.m3:P.b2):(pud<0.7?P.m2:P.s1); if (pud<1 && weather==='frost') c=(hash(x,y)<0.5)?P.s5:P.n4;
    w.px(x,y,c); }
  // Unkraut am Fuß des Zauns
  var r=M.rng(77); for (var i=0;i<60;i++){ var gx=60+Math.floor(r()*258), gy=FY0+Math.floor(r()*3), h=2+Math.floor(r()*5); RW(b,RG.plant).line(gx,gy,gx+Math.round((r()-0.5)*3),gy-h,r()<0.5?P.e2:P.g3); } }

// ---------------------------------------------------------------- der TAM 4500 (Profil, Front nach links)
// x0 = Stoßstange links, gy = Boden; tarp: Plane drauf; lit: Scheinwerfer an
var CAB=null, DASH=null, HL=null, TARPR=null;
function wheel(w,cx,cy,r){ w.ellipse(cx+0.5,cy+0.5,r,r,function(x,y){ var d=Math.hypot(x+0.5-cx-0.5,y+0.5-cy-0.5)/r, a=Math.atan2(y-cy,x-cx), c=P.k1;
    if (d>0.88) c=((Math.floor(a*r*1.6)&1)?P.k0:P.k2); else if (d<0.6){ c=(d<0.18)?P.m1:((d<0.5)?P.g2:P.g1); if (d<0.5 && d>0.3 && (Math.floor(a*4/Math.PI)&1)) c=P.g3; if (x<cx && y<cy && d<0.45) c=M.UP[c]; } else if (d<0.66) c=P.k0;
    return c; }); }
function truck(b,x0,gy,tarp,lit){ var w=RW(b,RG.truck), m=RW(b,RG.metal), g=RW(b,RG.glass), x, y, k;
  var BL=R('c1 c2 c3 c4'), fw=x0+30, rw=x0+150;                                   // Radmitten
  // Fahrgestell: Längsträger, Tank, Batteriekasten
  m.rect(x0+10,gy-18,186,4,P.k1); m.hl(x0+10,x0+195,gy-18,P.m1);
  m.rect(x0+90,gy-17,22,9,P.m1); m.hl(x0+90,x0+111,gy-17,P.m3); m.vl(x0+90,gy-17,gy-9,P.m3); m.rect(x0+94,gy-13,14,1,P.k2); m.px(x0+92,gy-15,P.m4);
  m.rect(x0+116,gy-16,10,7,P.k2); m.hl(x0+116,x0+125,gy-16,P.m2);
  // Räder: vorn einfach, hinten doppelt
  wheel(m,fw,gy-9,9); wheel(m,rw-2,gy-9,9); wheel(m,rw+2,gy-9,9);
  // Stoßstange und Stirnseite (leicht von vorn: Grill und zwei Rundscheinwerfer)
  m.rect(x0,gy-23,14,5,P.k1); m.hl(x0,x0+13,gy-23,P.m2); m.px(x0+2,gy-21,P.m3); m.px(x0+10,gy-21,P.m3); m.rect(x0+3,gy-18,3,3,P.k1);
  for (y=gy-46;y<gy-23;y++) for (x=x0+1;x<x0+12;x++){ var c=(x<x0+3)?BL[1]:BL[2]; if (y>gy-43 && y<gy-26 && x>x0+3 && x<x0+11) c=((x-x0)%2===0)?P.k1:P.m3; w.px(x,y,c); }
  w.hl(x0+1,x0+11,gy-46,BL[3]); w.hl(x0+3,x0+11,gy-43,P.m4); w.hl(x0+3,x0+11,gy-26,P.m2);
  HL=[[x0+3,gy-33,3.6],[x0+10,gy-33,2.6]];
  HL.forEach(function(h,i){ m.ellipse(h[0]+0.5,h[1]+0.5,h[2]+1,h[2]+1,P.k1); m.ellipse(h[0]+0.5,h[1]+0.5,h[2],h[2],lit?P.y5:(i?P.m3:P.m4)); if (!lit){ m.px(h[0]-1,h[1]-1,P.s6); m.px(h[0]+1,h[1]+1,P.m2); } });
  // Haube (Seite): leicht ansteigend zur Kabine, vorn gerundet, mit Lüftungsschlitzen
  for (x=x0+11;x<x0+46;x++){ var ht=rnd(gy-47-(x-x0-11)*0.06); for (y=ht;y<gy-23;y++){ var u=(y-ht)/24, c2=ra(BL,0.9-u*0.6,x,y); if (y===ht) c2=BL[3]; if (x<x0+14 && y<ht+2) continue; w.px(x,y,c2); } }
  for (k=0;k<5;k++){ m.vl(x0+22+k*4,gy-41,gy-33,P.c0); m.vl(x0+23+k*4,gy-41,gy-33,BL[3]); }
  w.hl(x0+12,x0+45,gy-30,BL[0]);
  // Kotflügel vorn: flach, über dem Rad gewölbt
  for (x=x0+14;x<x0+48;x++){ var dx=(x-fw)/14, ay=gy-9-Math.sqrt(Math.max(0,1-dx*dx))*13; for (y=gy-25;y<Math.min(gy-15,rnd(ay));y++) w.px(x,y,y<gy-23?BL[3]:BL[1]); w.px(x,rnd(ay)-1,P.c0); }
  w.hl(x0+12,x0+48,gy-25,BL[3]); m.rect(x0+40,gy-27,5,2,P.y3);
  // Kabine: kantig, mit Dachkante, Fahrertür mit Fenster, Griff, Spiegel und Trittstufe
  var cx0=x0+46, cx1=x0+84, ct=gy-68;
  for (y=ct;y<gy-17;y++) for (x=cx0;x<cx1;x++){ var c3=ra(BL,0.82-(y-ct)/60*0.55+(x<cx0+3?0.12:0),x,y); if (y===ct) c3=BL[3]; if (x===cx1-1) c3=BL[0]; var rs=fbm(x*0.4,y*0.3); if (rs>0.68 && y>gy-34) c3=P.e1; w.px(x,y,c3); }
  for (x=cx0-1;x<cx1+1;x++){ w.px(x,ct-1,BL[2]); w.px(x,ct-2,BL[3]); }
  for (y=ct+2;y<ct+24;y++){ var xl=cx0+Math.floor((y-ct-2)*0.12); g.px(xl,y,P.n1); g.px(xl+1,y,P.n2); }        // Kante der Windschutzscheibe
  var dx0=cx0+4, dx1=cx1-4, dy0=ct+3, dy1=gy-18; CAB=[cx0-8,ct-6,cx1-cx0+14,gy-ct-12];
  for (y=dy0+2;y<dy0+19;y++) for (x=dx0+2;x<dx1-2;x++){ var gl=(x-dx0)+(y-dy0)*0.7, c5=(y<dy0+5)?P.n2:P.n1; if (gl%15<1.2) c5=P.n4; if (y>dy0+14) c5=P.k2; g.px(x,y,c5); }
  w.vl(dx0+9,dy0+2,dy0+18,BL[0]); g.poly([[dx0+2,dy0+2],[dx0+8,dy0+2],[dx0+2,dy0+8]],P.n2); g.line(dx0+2,dy0+8,dx0+8,dy0+2,BL[3]);   // Ausstellfenster
  DASH=[dx0+3,dy0+13,dx1-dx0-6,4];
  w.hl(dx0,dx1,dy0,P.c0); w.vl(dx0,dy0,dy1,P.c0); w.vl(dx1,dy0,dy1,P.c0); w.hl(dx0+1,dx1-1,dy0+20,P.c0); w.hl(dx0+1,dx1-1,dy0+21,BL[3]);
  m.rect(dx1-8,dy0+24,6,2,P.m4); m.px(dx1-8,dy0+25,P.m1); m.px(dx1-3,dy0+25,P.k1);                               // Türgriff
  m.rect(dx0+2,gy-16,dx1-dx0-3,2,P.m2); m.hl(dx0+2,dx1-2,gy-16,P.m4); m.vl(dx0+4,gy-17,gy-14,P.m1);             // Trittstufe
  m.line(cx0-1,ct+7,cx0-6,ct+5,P.k2); m.rect(cx0-9,ct+1,4,10,P.k1); m.vl(cx0-8,ct+2,ct+9,P.m3);                 // Spiegel
  for (k=0;k<3;k++) m.px(dx0+3+k*9,dy0+31,P.c0);                                                                 // Nieten
  // Rückwand der Kabine, Auspuff hinter der Kabine
  w.rect(cx1,ct+3,3,gy-ct-21,BL[0]); m.vl(cx1+3,ct-8,gy-24,P.k2); m.vl(cx1+4,ct-8,gy-24,P.m2); m.rect(cx1+2,ct-10,4,2,P.k1);
  // Pritsche: Holzbordwände mit Stahlrungen, Boden, Rücklicht
  var px0=cx1+7, px1=x0+192, pt=gy-47, pb=gy-23;
  for (y=pt;y<pb;y++) for (x=px0;x<px1;x++){ var bv2=(y-pt)%8, c4=(bv2===0)?P.w1:((hash(Math.floor((x-px0)/36),Math.floor((y-pt)/8))<0.5)?P.w3:P.w2); if (bv2===7) c4=P.w1; var gr=fbm(x*0.2,y*0.5); if (gr>0.62 && c4!==P.w1) c4=M.DN[c4]; w.px(x,y,c4); }
  for (var s2=0;s2<5;s2++){ var sx=px0+Math.round(s2*(px1-px0-3)/4); m.rect(sx,pt-1,3,pb-pt+1,P.m2); m.vl(sx,pt-1,pb,P.m3); m.px(sx+1,pt+3,P.k2); m.px(sx+1,pb-4,P.k2); }
  m.rect(px0,pb,px1-px0,4,P.k2); m.hl(px0,px1-1,pb,P.m1); m.rect(px1-4,pb-4,4,3,P.r3); m.px(px1-3,pb-4,P.r4);
  for (x=rw-15;x<rw+16;x++){ var dx2=(x-rw)/15, ay2=gy-9-Math.sqrt(Math.max(0,1-dx2*dx2))*12; m.px(x,rnd(ay2)-1,P.k1); m.px(x,rnd(ay2)-2,P.m1); }
  m.rect(px1-2,gy-20,4,8,P.k1);                                                                                   // Schmutzfänger
  TRUCKR=[x0-2,ct-12,px1-x0+6,gy-ct+12];
  if (tarp) tarpOver(b,cx0,cx1,px0,px1,ct,pt,pb,gy); }
var TRUCKR=[0,0,0,0];
// Plane: olivgrüne Zeltbahn über Pritsche und Kabinendach, zwischen den Seilen durchhängend, mit senkrechten Falten
function tarpOver(b,cx0,cx1,px0,px1,ct,pt,pb,gy){ var w=RW(b,RG.tarp), x, y, TR=R('g0 g1 g2 e2 g3 e3');
  var ropes=[]; for (var s=0;s<6;s++) ropes.push(px0+4+Math.round(s*(px1-px0-8)/5));
  function top(x){ if (x<cx1+3) return ct-5; if (x<px0+2) return lerp(ct-5,pt-9,(x-cx1-3)/(px0-cx1-1)); return pt-9+Math.round(Math.sin((x-px0)*0.045)*2); }
  function hem(x){ if (x<cx1+2) return ct+4+((x>>1)&1); var d=1e9, i; for (i=0;i<ropes.length;i++) d=Math.min(d,Math.abs(x-ropes[i])); return pb-2-Math.round(Math.min(d,9)*0.35)+((x%7)===0?1:0); }
  for (x=cx0+8;x<px1+3;x++){ var t=rnd(top(x)), hb=hem(x), d2=1e9; for (var j=0;j<ropes.length;j++) d2=Math.min(d2,Math.abs(x-ropes[j]));
    for (y=t;y<=hb;y++){ var u=(y-t)/Math.max(1,hb-t), fold=Math.sin(x*0.33+Math.sin(x*0.071)*3+u*1.2)*(0.25+u*0.75), sag=Math.min(d2,9)/9, v=0.82-u*0.5+fold*0.2-(d2<2?0.18:0)+sag*0.08*(1-u);
      if (x<cx1+3) v=0.72-(y-t)*0.05+fold*0.08;
      var c=ra(TR,v,x,y); if (y===t) c=(x%9<5)?TR[5]:TR[4]; if (y===hb) c=TR[0]; if (hash(x>>1,y>>1)<0.03) c=P.e1; w.px(x,y,c); } }
  // Seile: von den Haken unten an der Pritsche über die Plane, ein Knoten
  ropes.forEach(function(rx,i){ var hb=hem(rx), tt=rnd(top(rx)); for (var yy=tt+1;yy<hb;yy++){ var xx=rx+Math.round((yy-hb)*0.12*(i%2?1:-1)); b.px(xx,yy,P.e3); REG[yy*W+xx]=RG.tarp; } b.px(rx,hb+1,P.m3); b.px(rx,hb,P.e4); });
  b.line(cx0+10,ct+4,cx0+13,ct-4,P.e3);
  TARPR=[cx0+6,ct-8,px1-cx0-2,pb-ct+8]; }
// abgenommene Plane, zusammengelegt am Zaun
function tarpFolded(b){ var w=RW(b,RG.tarp), x, y, x0=252, y0=100;
  for (y=y0;y<y0+12;y++) for (x=x0;x<x0+34;x++){ var u=(y-y0)/12, c=((y-y0)%4===0)?P.g1:((u<0.3)?P.g4:P.g2); if (x===x0||x===x0+33) c=P.g1; if (x<x0+2 && y<y0+2) continue; w.px(x,y,c); }
  b.line(x0+3,y0+5,x0+30,y0+5,P.e3); b.line(x0+30,y0+5,x0+34,y0+11,P.e3); TARPR=[x0-2,y0-2,38,16]; }

// ---------------------------------------------------------------- Ölfässer, Altreifen
function barrel(b,cx,by,r,h,col,lean){ var w=RW(b,RG.metal), y, x; for (y=by-h;y<by;y++){ var rr=r*(1+0.06*Math.sin(Math.PI*(y-by+h)/h)); for (x=Math.floor(cx-rr);x<=cx+rr;x++){ var u=(x-(cx-rr))/(2*rr), c=u<0.18?col[0]:(u<0.5?col[2]:(u<0.8?col[1]:col[0])); if (((y-(by-h))%Math.round(h/3))===0) c=col[0]; var rs=fbm(x*0.3,y*0.2); if (rs>0.62) c=(rs>0.7)?P.t1:P.t2; w.px(x,y,c); } }
  w.ellipse(cx+0.5,by-h,r,1.4,col[3]); w.ellipse(cx+0.5,by-h,r-1.5,0.8,col[1]); w.px(cx+2,by-h,P.k1); }
function tire(b,cx,cy,r,lean){ var w=RW(b,RG.metal); w.ellipse(cx+0.5,cy+0.5,r*lean,r,function(x,y){ var d=Math.hypot((x+0.5-cx-0.5)/(r*lean),(y+0.5-cy-0.5)/r); if (d<0.5) return; return d>0.9?P.k0:((x<cx)?P.k2:P.k1); }); }

// ---------------------------------------------------------------- Raureif (Frost) auf Oberkanten und Holz
function frost(b,night){ var E1=night?P.n3:P.s6, E2=night?P.n2:P.s5, G1=night?P.n2:P.s5, G2=night?P.n3:P.s6;
  for (var y=1;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, g=REG[k]; if (g===RG.sky||g===RG.far||g===0) continue; var up=REG[k-W];
    if ((g===RG.fence||g===RG.metal||g===RG.tarp||g===RG.truck||g===RG.wall||g===RG.plant) && up!==g && hash(x,y)<0.75) b.d[k]=hash(x+3,y)<0.4?E1:E2;
    else if (g===RG.ground){ var h=hash(x*1.7,y*2.3); if (h<0.035) b.d[k]=h<0.008?G2:G1; }
    else if (g===RG.fence && hash(x,y*1.9)<0.03) b.d[k]=E2; } }
// Scheinwerferkegel nach links: Dunst in der Luft, heller Fleck auf Schotter und Werkstattwand
function beams(b){ if (!HL) return; var L=M.TINT.lamp;
  for (var y=40;y<H;y++) for (var x=0;x<HL[0][0];x++){ var k=y*W+x, g=REG[k]; if (g===RG.sky) continue; var a=0;
    for (var i=0;i<HL.length;i++){ var h=HL[i], dx=h[0]-x, dy=y-h[1]; if (dx<=2) continue; var an=Math.atan2(dy,dx)-0.09, sp=0.17+dx*0.0008, e=Math.abs(an)/sp; if (e>=1) continue;
      var aa=(1-e*e)*Math.max(0,1-dx/150)*(i?0.7:1); a=Math.max(a,aa); }
    if (a<=0.02) continue; var onS=(g===RG.ground||g===RG.wall||g===RG.plant), lev=onS?a*1.3:a*0.38;
    if (bayer(x,y)<lev){ var c=M.tintPx(L,b.d[k],x,y); if (onS && a>0.55) c=M.UP[c]; b.d[k]=c; } } }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), x, y, tarp=tarpOn(S), lit=lightsOn(S), fin=(GS&&GS.phase==='k3_fin_n');
  REG.fill(0);
  sky(b,tod,weather); far(b,tod,weather); fence(b,tod); ground(b,tod,weather); workshop(b,tod,GS,S);
  // Altreifen am Zaun, ein schiefer Stapel, Ölfässer rechts
  tire(b,236,96,8,0.45); tire(b,244,97,8,0.45);
  barrel(b,302,112,7,18,R('b0 b1 b2 b3')); barrel(b,316,113,7,18,R('r1 r2 r3 r4')); barrel(b,308,121,7,17,R('m1 m2 m3 m4'));
  // Felge am Zaun, Kanister und Besen bei den Fässern, Fallrohr an der Werkstatt
  var mw=RW(b,RG.metal); mw.ellipse(214.5,94.5,6,6,P.m2); mw.ellipse(214.5,94.5,4,4,P.m1); mw.ellipse(214.5,94.5,1.5,1.5,P.m3); mw.px(212,91,P.m4);
  mw.rect(290,108,8,10,P.r2); mw.hl(290,297,108,P.r3); mw.rect(292,106,4,2,P.k1); mw.vl(290,108,117,P.r3);
  RW(b,RG.plant).line(246,104,242,80,P.w3); RW(b,RG.plant).line(247,104,243,80,P.w1); for (var bb=0;bb<5;bb++) RW(b,RG.plant).line(244+bb,104,246+bb*2,108,P.e3);
  for (y=rnd(wallY(54,true));y<rnd(wallY(54,false));y++){ mw.px(54,y,P.m3); mw.px(55,y,P.m1); }
  if (!tarp) tarpFolded(b);
  truck(b,TK.x,GY,tarp,lit);
  // Licht und Tageszeit
  var night=tod!=='day';
  if (tod==='day'){ M.light(b,function(x,y){ var g=REG[y*W+x]; if (g===RG.sky||g===RG.far) return 0; var s=0; if (y>GY-2 && x>TK.x+10 && x<TK.x+214 && y<GY+5) s-=1.2; if (g===RG.wall) s-=0.3;
      return s+(weather==='grey'?-0.3:0)+(fbm(x*0.02,y*0.03)-0.5)*0.4-Math.max(0,(y-120)/40)*0.4; }); }
  else { var lights=[[LAMP[0],LAMP[1]+20,fin?34:56,fin?0.5:0.85,30]]; if (lit) lights.push([TK.x-40,GY+4,90,1.1,24],[TK.x-10,GY-30,30,0.9,18]);
    M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; }, lights:lights }); if (fin) M.darken(b,0,0,W,H,1); }
  if (weather==='frost') frost(b,night);
  if (lit) beams(b);
  if (night){ b.rect(LAMP[0]-1,LAMP[1]-1,3,3,fin?P.y3:P.y4); b.px(LAMP[0],LAMP[1],P.l1); }
  if (lit && HL) HL.forEach(function(h){ b.ellipse(h[0]+0.5,h[1]+0.5,h[2],h[2],P.y5); b.ellipse(h[0]+0.5,h[1]+0.5,h[2]*0.55,h[2]*0.55,P.l1); });
  return b; }

// ---------------------------------------------------------------- Ebenen: Altreifenstapel und Unkraut vorn rechts
function layers(S,GS,tod){ var L=[], fin=(GS&&GS.phase==='k3_fin_n'), weather=M.scn.weather(GS);
  var l=M.layer(262,118,58,26,143), w=M.lw(l), y, x;
  for (var i=0;i<2;i++) for (y=0;y<6;y++) for (x=-13;x<=13;x++){ var e=Math.abs(x)/13, c=(y===0)?P.m1:(e>0.8?P.k0:P.k1); if (y===0 && e<0.55) c=P.k0; if (y===2 && e<0.8 && (x&1)) c=P.k2; w.px(300+x+i*2,143-i*6-y,c); }
  for (i=0;i<18;i++){ var gx=266+((i*7)%52), h=3+(i%5)*2; w.line(gx,143,gx+((i%3)-1)*2,143-h,(i%2)?P.e2:P.g3); }
  if (tod!=='day'){ M.tintApply(l,M.TINT[tod]||M.TINT.night); if (fin) M.darken(l,0,0,l.w,l.h,1); }
  if (weather==='frost') for (y=1;y<l.h;y++) for (x=0;x<l.w;x++){ if (l.d[y*l.w+x]!==T && l.d[(y-1)*l.w+x]===T && hash(x,y)<0.6) l.d[y*l.w+x]=(tod==='day')?P.s5:P.n2; }
  L.push(l); return L; }

// ---------------------------------------------------------------- jedes Bild: flatternde Planenecke (Bura), Scheinwerferkegel, Atemhauch der Kälte
function dyn(fb,v,S,GS){ var t=v.t, weather=M.scn.weather(GS), i, lit=lightsOn(S);
  if (weather==='bura' && tarpOn(S) && TARPR){ // die hintere Ecke der Plane schlägt im Wind
    var ex=TARPR[0]+TARPR[2]-1, ey0=TARPR[1]+14, ey1=TARPR[1]+TARPR[3]-4, f=Math.sin(t*7.5)+Math.sin(t*13.1)*0.45, g=Math.sin(t*5.3+1);
    var tip=[ex+7+Math.round(f*2.5), ey1-3-Math.round(f*5+g*2)], mid=[ex+3+Math.round(f), rnd((ey0+ey1)/2)+Math.round(g)];
    var pts=[[ex,ey0],[mid[0],mid[1]],[tip[0],tip[1]],[ex,ey1]]; var cam=v.cam;
    fb.poly(pts.map(function(q){ return [q[0]-cam,q[1]]; }),function(x,y){ var u=(x+cam-ex)/9; return (y>tip[1]-1)?P.g1:((u>0.5)?(f>0?P.g3:P.g2):P.g2); });
    fb.line(ex-cam,ey1,tip[0]-cam,tip[1],P.g0); fb.line(mid[0]-cam,mid[1],tip[0]-cam,tip[1],P.e2); fb.px(tip[0]-cam,tip[1],P.e3); }
  if (lit && HL){ // Lichtkegel: Staub und Reifkristalle tanzen im Strahl
    for (i=0;i<26;i++){ var ph=(hash(i,3)+t*0.05*(0.5+hash(i,4)))%1, x2=rnd(TK.x-4-ph*96), y2=rnd(GY-31+(hash(i,5)-0.5)*(6+ph*34)+Math.sin(t*1.3+i)*1.5); if (x2>=0 && Math.sin(t*2+i*1.7)>0.1) fb.px(x2,y2,ph<0.5?P.y5:P.y4); } } }
function front(fb,v,S,GS){ if (M.scn.weather(GS)==='bura') M.scn.buraDebris(fb,v.t,112,140,v.cam); }

// ---------------------------------------------------------------- Geistersicht: am Armaturenbrett ein blasses Leuchten
function ghost(fb,v,S,GS){ var t=v.t; if (!DASH) return; var x0=DASH[0], y0=DASH[1], w=DASH[2], a=0.55+Math.sin(t*1.4)*0.2;
  for (var y=y0-10;y<y0+6;y++) for (var x=x0-4;x<x0+w+4;x++){ var d=Math.hypot((x-x0-w*0.5)/(w*0.7),(y-y0-1)/8); if (d<1 && bayer(x,y+Math.floor(t*2))<(1-d)*a){ var k=y*fb.w+x; fb.d[k]=M.UP[M.UP[fb.d[k]]]; } }
  for (var i=0;i<5;i++){ var px=x0+2+i*Math.floor(w/5), on=Math.sin(t*2+i)>-0.3; fb.px(px,y0+1,on?P.x6:P.x4); fb.px(px+1,y0+1,P.x4); }
  fb.hl(x0,x0+w-1,y0+3,P.x3); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<116||y>139||x<10||x>310) return false; if (x>284 && y>128) return false; if (x>294 && y<126) return false; if (x<WL.x1 && y<wallY(x,false)+3) return false; return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var fin=(GS&&GS.phase==='k3_fin_n');
  if (lightsOn(S) && a.x<TK.x+6 && a.x>TK.x-110 && Math.abs(a.y-GY-6)<16) return M.TINT.lamp.a;
  if (Math.hypot(a.x-LAMP[0],a.y-LAMP[1]-60)<50 && !fin) return M.TINT.lamp.a; return (M.TINT[tod]||M.TINT.night).a; }
// Rechteck, das je nach Zustand nachgelesen wird (bleibt für die Logik ein gewöhnliches Array)
function live(n,fn){ var a=[]; for (var i=0;i<n;i++) (function(i){ Object.defineProperty(a,i,{get:function(){ return fn()[i]; },enumerable:true}); })(i); return a; }
// Rechtecke aus der Zeichengeometrie (ohne Malen vorausberechnet)
var CABR=[TK.x+38,GY-74,52,56], TAMR=[TK.x-2,GY-80,200,80];
M.defineArt('vhof',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost, actorLut:actorLut,
  spots:{
    door:[DOOR.x0-2,24,DOOR.x1-DOOR.x0+4,98],
    tam:TAMR,
    cab:CABR,
    tarp:live(4,function(){ return TARPR||[TK.x+60,GY-70,166,48]; }),
    fence:[GATE[0]-4,56,GATE[1]-GATE[0]+8,48],
    barrels:[294,90,26,34]
  },
  stands:{ door:[40,122,'L'], tam:[190,120,'B'], cab:[124,118,'B'], tarp:[200,120,'B'], fence:[272,118,'B'], barrels:[286,122,'R'] },
  actorPos:{ mala:[100,118,'L'], vlado:[124,117,'L'], kata:[56,119,'R'] },
  start:[38,122,'R'], entries:{ vulkanizer:[38,122,'R'] }
});
})(M);
