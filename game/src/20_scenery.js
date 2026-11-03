/* ===== 20_scenery.js — wiederkehrende Ansichten von Split: Hafenblick, Dächer, Glockenturm, Marjan, Wetter ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer;
var scn={}; M.scn=scn;
// Wetter je Phase: 'rain' (Jugo), 'clear' (Bura, klar), 'calm'
scn.weather=function(GS){ var ph=M.PHASES[GS.phase]||{}; return ph.weather||'calm'; };
// Himmel bei Regen: grau verhangen
scn.sky=function(b,x0,y0,w,h,tod,weather,seed){ if (weather==='rain'){ var ramp=M.R(tod==='day'?'m2 m3 s3 m3':(tod==='dusk'?'d0 m1 d1 m2':(tod==='dawn'?'m1 n1 m2 d2':'k0 k1 m0 k2')));
    for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var v=(y-y0)/h+Math.sin(x*0.05+y*0.2)*0.08+hash(Math.floor(x/9),Math.floor(y/4))*0.15; b.px(x,y,M.rampAt(ramp,v,x,y)); } return; }
  if (weather==='fog' || weather==='snow'){ var fr=weather==='fog'?(tod==='day'?'m3 m4 s4 s5 s4':(tod==='dusk'?'d1 m2 d2 m3 d3':(tod==='dawn'?'m2 v2 m3 s4':'k1 m0 k2 m1 m0'))):(tod==='day'?'m3 m4 s4 m4':(tod==='dusk'?'d0 m1 d1 m2':(tod==='dawn'?'m2 v2 m3 v3':'k1 n0 m0 n1')));
    var rmp=M.R(fr); for (var y2=y0;y2<y0+h;y2++) for (var x2=x0;x2<x0+w;x2++){ var v2=(y2-y0)/h*0.9+Math.sin(x2*0.031+y2*0.11)*0.05+(hash(Math.floor(x2/14),Math.floor(y2/5))-0.5)*0.08; b.px(x2,y2,M.rampAt(rmp,v2,x2,y2)); } return; }
  M.sky(b,x0,y0,w,h,tod,seed); };
// Glockenturm von Sveti Duje (Silhouette, schlank, mit Spitze)
scn.belltower=function(b,x,baseY,h,col,lit){ var w=Math.max(5,Math.round(h*0.16)); for (var y=baseY-h;y<baseY;y++){ var t=(baseY-y)/h, ww=t>0.82?Math.max(1,Math.round(w*(1-t)*4)):w-(t>0.6?1:0); b.hl(x-(ww>>1),x+(ww>>1),y,col); }
  for (var k=0;k<4;k++){ var yy=baseY-Math.round(h*(0.25+k*0.15)); b.px(x,yy,lit?P.y3:M.UP[col]); } };
// Dächer der Altstadt: Terrakotta, Kamine, kleine Fenster (nachts erleuchtet)
scn.roofs=function(b,x0,x1,baseY,tod,seed,opt){ opt=opt||{}; var r=M.rng(seed||21), x=x0, night=tod==='night'||tod==='dusk';
  var wall=opt.wall||M.R('s2 s3 s4'), roof=opt.roof||M.R('t1 t2 t3 t4');
  while (x<x1){ var w=10+Math.floor(r()*18), h=(opt.min||8)+Math.floor(r()*(opt.var||16)), top=baseY-h;
    for (var yy=top;yy<baseY;yy++) for (var xx=x;xx<Math.min(x1,x+w);xx++){ var c=wall[1]; if (xx===x) c=wall[2]; if (xx===x+w-1) c=wall[0]; b.px(xx,yy,c); }
    var rh=2+Math.floor(r()*3); for (var k=0;k<rh;k++){ var ins=k; for (var xx2=x-1+ins;xx2<Math.min(x1,x+w+1-ins);xx2++) b.px(xx2,top-1-k,(xx2+k)%3===0?roof[0]:(k===rh-1?roof[3]:roof[2])); }
    if (r()<0.4){ var cx=x+2+Math.floor(r()*(w-4)); b.rect(cx,top-rh-3,2,3,wall[0]); }
    for (var wi=0;wi<w*h/30;wi++){ var wx=x+1+Math.floor(r()*(w-3)), wy=top+2+Math.floor(r()*(h-4)); if (wx>=x1) continue; var lit=night && r()<(opt.lit||0.35); b.rect(wx,wy,2,2,lit?(r()<0.5?P.y4:P.y3):(opt.shut?P.g2:P.k2)); }
    x+=w+(r()<0.25?1:0); } };
// Marjan-Hügel (Pinien), weich
scn.marjan=function(b,x0,x1,baseY,top,tod){ var g=tod==='night'?M.R('k1 k2 g0'):(tod==='dusk'?M.R('d0 g1 d1'):(tod==='dawn'?M.R('n0 g1 n1'):M.R('g1 g2 g3')));
  for (var x=x0;x<x1;x++){ var t=(x-x0)/Math.max(1,(x1-x0)); var hh=Math.round((baseY-top)*Math.sin(Math.min(1,t*1.4)*Math.PI*0.5)*(0.85+Math.sin(x*0.2)*0.05+hash(x,1)*0.08)); for (var y=baseY-hh;y<baseY;y++) b.px(x,y,M.rampAt(g,0.3+((baseY-y)/(hh+1))*0.6+(hash(Math.floor(x/2),Math.floor(y/2))-0.5)*0.4,x,y)); } };
// Blick aus einem Fenster auf den Hafen
scn.harborView=function(b,x0,y0,w,h,tod,weather,opt){ opt=opt||{}; var hz=y0+Math.round(h*(opt.hz||0.5));
  scn.sky(b,x0,y0,w,hz-y0,tod,weather,opt.seed||3);
  if (tod==='night' && weather!=='rain') M.moon(b,x0+Math.round(w*0.78),y0+6,2);
  // Inseln am Horizont
  var save=b; M.islands(b,x0,x0+w,hz,tod,opt.seed||5,{amp:3});
  M.sea(b,x0,hz,w,y0+h-hz,tod,0,opt.camX||0);
  if (opt.ferry!==false){ M.prop.ferry(b,x0+Math.round(w*(opt.ferryX||0.35)),hz+3,Math.round(w*0.32),tod==='night'||tod==='dusk'); }
  // Kaimauer und Riva-Lichter
  var qy=y0+h-Math.max(3,Math.round(h*0.12)); for (var x=x0;x<x0+w;x++){ b.px(x,qy,P.s2); b.px(x,qy+1,P.s1); for (var y=qy+2;y<y0+h;y++) b.px(x,y,P.s1); }
  if (tod!=='day') for (var lx=x0+3;lx<x0+w;lx+=11){ b.px(lx,qy-2,P.y5); b.px(lx,qy-1,P.y3); }
  if (weather==='rain') for (var i=0;i<w*h/12;i++){ var rx=x0+Math.floor(hash(i,3)*w), ry=y0+Math.floor(hash(i,4)*h); b.px(rx,ry,tod==='night'?P.n2:P.m4); } };
// Regentropfen am Fenster (dynamisch)
scn.windowRain=function(fb,x0,y0,w,h,t,cam){ cam=cam||0; for (var i=0;i<18;i++){ var x=x0+Math.floor(hash(i,11)*w)-cam, sp=6+hash(i,12)*14, y=y0+Math.floor((t*sp+hash(i,13)*h)%h); if (x<0||x>=fb.w) continue; fb.px(x,y,P.m4); fb.px(x,y-1,P.m3); } };
// Möwen am Himmel (dynamisch)
scn.gulls=function(fb,t,x0,y0,w,h,n,cam){ cam=cam||0; for (var i=0;i<(n||3);i++){ var x=Math.floor(x0+((hash(i,21)*w+t*(8+hash(i,22)*10))%w))-cam, y=Math.floor(y0+hash(i,23)*h+Math.sin(t*1.3+i)*3), f=Math.floor(t*4+i)%2;
  if (x<1||x>=fb.w-1) continue; fb.px(x,y,P.s6); fb.px(x-1,y-(f?1:0),P.s5); fb.px(x+1,y-(f?1:0),P.s5); fb.px(x-2,y-(f?0:1),P.s4); fb.px(x+2,y-(f?0:1),P.s4); } };
// Bura: über den Boden wehende Blätter / Papierfetzen (dynamisch)
scn.buraDebris=function(fb,t,y0,y1,cam){ for (var i=0;i<6;i++){ var sp=60+hash(i,31)*60, x=Math.floor(((t*sp+hash(i,32)*400)%420)-50), y=Math.floor(y0+hash(i,33)*(y1-y0)+Math.sin(t*4+i)*3); if (x<0||x>=fb.w) continue; fb.px(x,y,i%2?P.e3:P.s4); fb.px(x+1,y+(Math.floor(t*6+i)%2),i%2?P.e2:P.s3); } };
// ================================================================ Sarajevo: Nebel, Schnee, Minarett, Straßenbahn (Kapitel 2)
// Nebel in der Ferne: Pixel zur Nebelfarbe hin mischen (vor M.finishTOD, in Tagesfarben). amt(x,y) -> 0..1
M.fogBake=function(b,amt,opt){ opt=opt||{}; var col=opt.col===undefined?P.s4:opt.col, x0=opt.x||0, y0=opt.y||0, w=opt.w||b.w, h=opt.h||b.h;
  for (var y=Math.max(0,y0);y<Math.min(b.h,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(b.w,x0+w);x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*b.w+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue;
    var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=M.mix(c,col,i); } };
// ziehende Nebelschwaden im Vordergrund (in front aufrufen). opt: y0,y1 (Band), amt (Dichte 0..1), k (Mischstufe 1..4), col, cam, speed
var FOGN=null, FOGL={};
function fogNoise(){ if (FOGN) return FOGN; FOGN=new Float32Array(1024); for (var i=0;i<1024;i++){ var a=i*Math.PI*2/1024; FOGN[i]=0.5+0.5*(Math.sin(a*5)*0.45+Math.sin(a*11+1.3)*0.3+Math.sin(a*23+2.1)*0.25); } return FOGN; }
M.fogDrift=function(fb,t,opt){ opt=opt||{}; var y0=opt.y0===undefined?30:opt.y0, y1=Math.min(opt.y1||144,144,fb.h), amt=opt.amt===undefined?0.4:opt.amt, cam=opt.cam||0, col=opt.col===undefined?P.s4:opt.col, kk=opt.k||2, sp=opt.speed||5, N=fogNoise();
  var key=col+'_'+kk, lut=FOGL[key]; if (!lut){ lut=FOGL[key]=new Uint8Array(256); for (var c=0;c<256;c++) lut[c]=(c===T||c>=M.NCOL)?c:M.mix(c,col,kk); }
  for (var y=y0;y<y1;y++){ var ry=(y-y0)/Math.max(1,y1-y0), band=Math.sin(ry*Math.PI)*amt, o1=Math.floor(t*sp+y*2.3)&1023, o2=Math.floor(400-t*sp*0.7+y*0.9)&1023;
    if (band<0.03) continue; for (var x=0;x<fb.w;x++){ var wx=x+cam, d=band*(N[(wx+o1)&1023]*0.65+N[((wx>>1)+o2)&1023]*0.55-0.2); if (d>0.04 && bayer(x,y)<d){ var k=y*fb.w+x; fb.d[k]=lut[fb.d[k]]; } } } };
// Schneefall (in front). opt: n, col, col2, h, mask, cam, wind
M.snow=function(fb,t,opt){ opt=opt||{}; var n=opt.n||70, H=Math.min(opt.h||144,fb.h), col=opt.col===undefined?P.s6:opt.col, col2=opt.col2===undefined?P.s4:opt.col2, wind=opt.wind||4, cam=opt.cam||0;
  for (var i=0;i<n;i++){ var sp=10+hash(i,41)*18, near=hash(i,44)<0.25, y=Math.floor(((t*sp*(near?1.6:1))+hash(i,42)*(H+10))%(H+10))-5, x=Math.floor((((hash(i,43)*420)+t*wind+Math.sin(t*(0.7+hash(i,45))+i)*6-cam*(near?1.2:0.6))%420+420)%420)-50;
    if (y<0||y>=H||x<0||x>=fb.w) continue; if (opt.mask && !opt.mask(x+cam,y)) continue; var k=y*fb.w+x; fb.d[k]=near?col:col2; if (near && x+1<fb.w) fb.d[k+1]=col2; } };
// Schnee auf Kanten: helle Pixel auf jede Oberkante, über der Luft ist (in paint, für Schneephasen). top(x,y)->bool: hier darf Schnee liegen
M.snowCap=function(b,x0,y0,w,h,top,opt){ opt=opt||{}; var c1=opt.col||P.s6, c2=opt.col2||P.s5;
  for (var x=x0;x<x0+w;x++) for (var y=y0+1;y<y0+h;y++){ var k=y*b.w+x; if (!top(x,y)) continue; var up=b.d[k-b.w];
    if (!top(x,y-1)){ b.d[k]=hash(x,y)<0.7?c1:c2; if (y+1<b.h && hash(x+3,y)<0.5) b.d[k+b.w]=c2; } } };
// Minarett (schlank, Bleispitze): x Mitte, baseY Fuß, h Höhe. opt: lit (Lichterkranz am Balkon), stone, cap
scn.minaret=function(b,x,baseY,h,opt){ opt=opt||{}; var st=opt.stone||M.R('s2 s3 s4 s5'), cap=opt.cap||M.R('m0 m1 m2 m3'), w=Math.max(2,Math.round(h*0.075)), y;
  var balc=baseY-Math.round(h*0.66), capB=baseY-Math.round(h*0.83), top=baseY-h;
  for (y=capB;y<baseY;y++){ var ww=(y>balc)?w:Math.max(1,w-1); for (var xx=x-ww;xx<=x+ww;xx++){ var c=xx<x?st[2]:(xx===x?st[2]:st[1]); if (xx===x-ww) c=st[3]; if (xx===x+ww) c=st[0]; b.px(xx,y,c); } }
  for (var xx2=x-w-1;xx2<=x+w+1;xx2++){ b.px(xx2,balc,st[3]); b.px(xx2,balc+1,st[0]); } b.px(x-w-1,balc-1,st[1]); b.px(x+w+1,balc-1,st[0]);
  for (y=top;y<capB;y++){ var f=(y-top)/Math.max(1,capB-top), cw=Math.round(f*(w)); for (var xx3=x-cw;xx3<=x+cw;xx3++) b.px(xx3,y,xx3<x?cap[2]:(xx3===x?cap[3]:cap[1])); }
  b.vl(x,top-3,top-1,P.y2); b.px(x,top-3,P.y4);
  if (opt.lit) for (var i=-w;i<=w;i+=2) b.px(x+i,balc-1,P.y4); };
// Straßenbahn Tatra K2 in Seitenansicht (rot mit cremefarbenem Fensterband, zwei Wagenteile mit Gelenk).
// x = linkes Ende, baseY = Schiene. opt: s (Maßstab, 1 = Figurengröße), line ('3'), dir ('R' = Fahrerkabine rechts), lit (Fenster erleuchtet), doors ('open'), len (sichtbare Länge in px, Rest abgeschnitten), litOnly (nur Lichter, für after)
scn.tram=function(b,x,baseY,opt){ opt=opt||{}; var s=opt.s||0.6, H=Math.round(80*s), L=Math.round(552*s), sec=Math.round(270*s), jw=Math.max(2,Math.round(12*s)), wheel=Math.max(2,Math.round(7*s));
  var bot=baseY-wheel, top=bot-H, winT=top+Math.round(H*0.18), winB=top+Math.round(H*0.52), red=M.R('r0 r1 r2 r3'), cr=M.R('s3 s4 s5 s6'), gl=opt.lit?M.R('y2 y3 y4'):M.R('k1 n0 n1 n2'), dir=opt.dir||'R', len=opt.len||L, xx, yy;
  function X(u){ return dir==='R'?x+u:x+L-1-u; }
  var nose=Math.round(26*s);
  for (var u=0;u<L;u++){ var px=X(u); if ((dir==='R'?u:L-1-u)>=len) continue; var inJoint=(u>=sec && u<sec+jw), uu=u<sec?u:(u-sec-jw), segL=u<sec?sec:(L-sec-jw), front=(u>=L-nose)?(u-(L-nose))/nose:0, rear=(u<nose)?(nose-u)/nose:0;
    var r0=Math.round(Math.max(front,rear)*Math.max(front,rear)*H*0.22), t0=top+r0;
    for (yy=t0;yy<bot;yy++){ if (opt.litOnly){ if (opt.lit && yy>winT && yy<winB && !inJoint){ var dx2=(uu%Math.round(34*s)); if (dx2>1 && dx2<Math.round(30*s)) b.px(px,yy,gl[(yy-winT)<2?2:1]); } continue; }
      var c;
      if (inJoint){ c=((yy>>1)&1)?P.k2:P.m1; if (yy<top+3) c=P.k1; b.px(px,yy,c); continue; }
      if (yy===t0) c=P.m4; else if (yy<winT-1) c=M.rampAt(M.R('m2 m3 m4'),1-(yy-t0)/Math.max(1,winT-t0),px,yy);
      else if (yy<winT+1) c=cr[2];
      else if (yy<winB){ var dx=(uu%Math.round(34*s)); c=(dx<=1||dx>=Math.round(30*s))?cr[2]:gl[(yy-winT)<2?0:(bayer(px,yy)<0.2?2:1)]; if (opt.lit && !(dx<=1||dx>=Math.round(30*s))) c=gl[(yy-winT)<2?2:1]; }
      else if (yy<winB+Math.max(2,Math.round(4*s))) c=cr[3];
      else c=red[(yy>bot-Math.max(2,Math.round(5*s)))?0:((u%Math.round(90*s)<2)?1:2)];
      b.px(px,yy,c); }
    // Türen (doppelflügelig), je Wagenteil eine, dazu eine am Gelenk
  }
  if (!opt.litOnly){ [Math.round(60*s),sec-Math.round(40*s),sec+jw+Math.round(70*s),L-Math.round(80*s)].forEach(function(du,i){ var dw=Math.round(26*s); for (var k=0;k<dw;k++){ var px=X(du+k); if ((dir==='R'?du+k:L-1-du-k)>=len) continue;
      for (yy=winT;yy<bot;yy++){ var mid=k===Math.floor(dw/2); var c=opt.doors==='open'?(yy<bot-1?P.k1:P.m1):(mid?P.k1:(yy<winB?gl[1]:red[1])); if (k===0||k===dw-1) c=P.k2; b.px(px,yy,c); } } });
    // Fahrgestell, Räder, Stromabnehmer, Liniennummer
    for (var w0=0;w0<4;w0++){ var cx=X([Math.round(40*s),sec-Math.round(40*s),sec+jw+Math.round(40*s),L-Math.round(40*s)][w0]); b.rect(cx-Math.round(14*s),bot,Math.round(28*s),wheel,P.k1); b.ellipse(cx-Math.round(7*s),bot+Math.round(wheel/2),Math.max(1,Math.round(wheel/2)),Math.max(1,Math.round(wheel/2)),P.k2); b.ellipse(cx+Math.round(7*s),bot+Math.round(wheel/2),Math.max(1,Math.round(wheel/2)),Math.max(1,Math.round(wheel/2)),P.k2); }
    var pc=X(Math.round(150*s)), ph=Math.round(18*s); b.line(pc-Math.round(10*s),top-1,pc,top-ph,P.k1); b.line(pc+Math.round(10*s),top-1,pc,top-ph,P.k1); b.hl(pc-Math.round(8*s),pc+Math.round(8*s),top-ph,P.k1);
    var nx=X(L-Math.round(18*s)); if ((dir==='R'?L-Math.round(18*s):Math.round(18*s))<len){ b.rect(nx-Math.round(5*s),winT-Math.round(9*s),Math.max(4,Math.round(10*s)),Math.max(5,Math.round(8*s)),P.k1); M.microText(b,opt.line||'3',nx-Math.round(5*s)+1,winT-Math.round(9*s)+1,P.y4); }
    var lx=X(L-2); b.px(lx,bot-Math.round(10*s),P.s6); }
  return {x0:x,x1:x+L,top:top,bot:baseY,winT:winT,winB:winB}; };
})(M);
