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
})(M);
