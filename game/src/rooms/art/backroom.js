/* ===== rooms/art/backroom.js — Ninas Hinterzimmer (nur Mala): eine enge Kammer, Atelier und Lager zugleich.
   Überall lehnen Leinwände, fast alle mit demselben Motiv: der Hafen bei Nacht, die Fähre, Lichter, eine einzelne Gestalt am Kiosk.
   Staffelei mit einem unfertigen Bild, ein gerahmtes Fährticket (schimmert in der Geistersicht), eine Bleistiftskizze, Farben, Pinsel, ein hohes Fenster. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320;
var VP=[156,46], RECT=[96,12,214,88], F=80, FY=88;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WIN=[146,17,18,15];                       // kleines hohes Fenster
var TICKET=[106,40,13,10];                    // gerahmtes Fährticket (Rahmen)
var SKETCH=[122,36,12,16];                    // Bleistiftskizze
var EASEL={x:170,base:124,cv:[152,70,36,26]}; // Staffelei: Fußlinie, Leinwand (x,y,w,h)
var DOORU=[8,30,26,88];                       // Tür (Vorhang) in der linken Wand
function rnd(v){ return Math.round(v); }
function q(sd,u,v){ var p=M.wallPt(SPEC,sd,u,v); return [rnd(p[0]),rnd(p[1])]; }

// ---------------------------------------------------------------- das Motiv: Hafen bei Nacht, Fähre mit Lichtern, Kiosk, eine wartende Gestalt
function motif(w,h,o){ o=o||{}; var b=new M.Buf(w,h,P.k0), hz=Math.round(h*(o.hz||0.5)), r=M.rng(o.seed||3), x, y;
  for (y=0;y<h;y++) for (x=0;x<w;x++){ var c;
    if (y<hz) c=M.rampAt(M.R('k2 n0 n1 n2 n3'),0.2+y/hz*0.55+(hash(x>>1,y+(o.seed||0))-0.5)*0.22,x,y);
    else c=M.rampAt(M.R('k1 n0 n1 n2'),0.6-(y-hz)/(h-hz)*0.45+(hash(x>>1,y)-0.5)*0.3,x,y);
    b.px(x,y,c); }
  // Sterne, Mond, die Hügel von Brač
  for (var s=0;s<w*hz/40;s++) b.px(Math.floor(r()*w),Math.floor(r()*hz*0.7),r()<0.3?P.n5:P.n4);
  if (w>=14) b.ellipse(w*0.82,h*0.14,Math.max(1,w*0.04),Math.max(1,w*0.04),P.s5);
  for (x=0;x<w;x++){ var hh=Math.round((Math.sin(x/w*3.1+1)*0.5+0.5)*h*0.07); for (y=hz-hh;y<hz;y++) b.px(x,y,P.k2); }
  // Fähre: weißer Rumpf, gelbe Fenster, roter Schornstein
  var fw=Math.max(6,Math.round(w*(o.fw||0.42))), fx=Math.round(w*(o.fx||0.5)), fh=Math.max(2,Math.round(fw*0.2)), sup=Math.max(1,Math.round(fh*0.6));
  b.rect(fx,hz-fh,fw,fh,P.s5); b.hl(fx,fx+fw-1,hz-1,P.s3); b.rect(fx+Math.round(fw*0.18),hz-fh-sup,Math.round(fw*0.56),sup,P.s4);
  b.rect(fx+Math.round(fw*0.6),hz-fh-sup-Math.max(1,sup),Math.max(1,Math.round(fw*0.08)),Math.max(1,sup),P.r3);
  for (var i=fx+1;i<fx+fw-1;i+=2) b.px(i,hz-fh+Math.max(0,(fh>>1)-1),P.y4);
  if (fh>2) for (var i2=fx+Math.round(fw*0.22);i2<fx+Math.round(fw*0.7);i2+=2) b.px(i2,hz-fh-sup+Math.max(0,sup>>1),P.y3);
  // Spiegelung der Lichter im Wasser
  for (var gy=hz+1;gy<h-Math.round(h*0.22);gy+=2){ var gx=fx+Math.round(fw*0.5)+((gy*5)%3)-1; b.px(gx,gy,P.y3); if (w>16) b.px(gx-3+((gy*7)%5),gy,P.y2); }
  // Kai, Kiosk mit erleuchtetem Fenster, eine Laterne, die wartende Gestalt
  var qy=h-Math.max(2,Math.round(h*0.22)); for (y=qy;y<h;y++) for (x=0;x<w;x++) b.px(x,y,(y===qy)?P.n2:P.k2);
  var kw=Math.max(3,Math.round(w*0.17)), kh=Math.max(3,Math.round(h*0.24)), kx=Math.max(1,Math.round(w*(o.kx||0.1))), ky=qy-kh;
  b.rect(kx,ky,kw,kh,P.k2); b.rect(kx+1,ky+1,Math.max(1,kw-2),Math.max(1,kh-2),P.y3); b.hl(kx-1,kx+kw,ky-1,P.n2); if (kw>4) b.px(kx+1,ky+1,P.y5);
  for (var ly=qy-1;ly>=Math.max(0,qy-Math.round(h*0.12));ly--) for (var lx=kx-1;lx<kx+kw+3;lx++) if (bayer(lx,ly)<0.25) b.px(lx,ly,P.y1);
  var px=kx+kw+Math.max(1,Math.round(w*0.04)), ph=Math.max(3,Math.round(h*0.22)); b.vl(px,qy-ph,qy-1,P.k0); b.px(px,qy-ph-1,P.k0); if (ph>4){ b.vl(px+1,qy-ph+1,qy-2,P.k0); b.px(px-1,qy-ph+2,P.k1); }
  if (w>18){ var lp=Math.round(w*0.62); b.vl(lp,qy-Math.round(h*0.3),qy-1,P.k1); b.px(lp,qy-Math.round(h*0.3)-1,P.y5); }
  if (o.unfinished){ // rechte Hälfte und unten noch rohe Leinwand mit Bleistiftlinien
    for (y=0;y<h;y++) for (x=0;x<w;x++){ var raw=(x>w*0.58 && y>h*0.18) || (y>h*0.82 && x>w*0.3); if (!raw) continue; var c2=(hash(x,y)<0.08)?P.s4:P.s5; if (x>w*0.58 && x<w*0.62 && bayer(x,y)<0.5) c2=P.n1; b.px(x,y,c2); }
    b.line(Math.round(w*0.62),hz-2,w-3,hz-2,P.s2); b.line(Math.round(w*0.66),hz-5,Math.round(w*0.86),hz-5,P.s2); b.line(Math.round(w*0.66),hz-5,Math.round(w*0.64),hz-2,P.s2); b.px(Math.round(w*0.78),hz-7,P.s2);
    b.line(Math.round(w*0.35),h-3,w-4,h-3,P.s3); }
  return b; }
// Bild auf einer Wandfläche (senkrechte Kanten, schräge Ober-/Unterkante)
function onQuad(b,Q,src,shade){ var xl=Math.min(Q[0][0],Q[3][0]), xr=Math.max(Q[1][0],Q[2][0]);
  for (var x=Math.ceil(xl);x<=Math.floor(xr);x++){ var u=(x-Q[0][0])/(Q[1][0]-Q[0][0]); if (u<0||u>1) continue; var top=Q[0][1]+(Q[1][1]-Q[0][1])*u, bot=Q[3][1]+(Q[2][1]-Q[3][1])*u;
    for (var y=Math.ceil(top);y<=Math.floor(bot);y++){ var v=(y-top)/Math.max(1,bot-top), c=src.get(Math.min(src.w-1,Math.floor(u*src.w)),Math.min(src.h-1,Math.floor(v*src.h))); if (shade) c=M.step(c,shade); b.px(x,y,c); } } }
// Leinwand von hinten: rohes Tuch, Keilrahmen mit Kreuz
function canvasBack(b,x,y,w,h){ b.rect(x,y,w,h,P.e4); for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) if (hash(xx,yy)<0.1) b.px(xx,yy,P.e3);
  b.rect(x,y,w,2,P.w3); b.rect(x,y+h-2,w,2,P.w2); b.rect(x,y,2,h,P.w3); b.rect(x+w-2,y,2,h,P.w2); b.vl(x+(w>>1),y,y+h-1,P.w2); if (h>12) b.hl(x,x+w-1,y+(h>>1),P.w2); b.hl(x,x+w-1,y,P.w4); }
// Leinwand von vorn mit dem Motiv und schmalem Rand
function canvasFront(b,x,y,w,h,o){ var m=motif(w-2,h-2,o); b.rect(x,y,w,h,P.e3); b.blit(m,x+1,y+1); b.hl(x,x+w-1,y,P.e4); b.vl(x+w-1,y,y+h-1,P.e2); b.hl(x,x+w-1,y+h-1,P.e1); }

function wallBack(u,v,x,y){ var n=Math.sin(u*0.06+v*0.03)+Math.sin(u*0.17-v*0.05)*0.5+(hash(u>>3,v>>2)-0.5); var c=M.rampAt(M.R('s2 s3 s4'),0.55+n*0.12,x,y); if (v>=72) c=(v===72)?P.w2:P.w1; return c; }
function wallSide(u,v,x,y,sd){ var n=Math.sin(u*0.11+v*0.03+(sd==='L'?0:3))+(hash((u*2)>>2,v>>2)-0.5); var c=M.rampAt(M.R('s1 s2 s3'),0.55+n*0.13,x,y); if (v>=72) c=(v===72)?P.w2:P.w0; return sd==='L'?c:M.DN[c]; }
function floorTex(xb,d,x,y){ var c=tex.planks(xb,y,VP[1],FY,M.R('w0 w1 w2 w3'),8); var f=R3.floor(x,y); if (f && f.X>140 && f.X<200 && f.Z>20 && f.Z<56 && hash(Math.floor(f.X/2),Math.floor(f.Z/2))<0.035) c=[P.r2,P.n2,P.y2,P.s4][Math.floor(hash(f.Z,f.X)*4)]; return c; }   // ein paar Farbspritzer unter der Staffelei
function ceilTex(xb,d,x,y){ return ((Math.floor(xb)%20)<2)?P.k2:P.w0; }

function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), x, y, i;
  var FLOOR=new Uint8Array(W*144);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:function(xb,d,x,y){ FLOOR[y*W+x]=1; return floorTex(xb,d,x,y); },ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.k2);
  // ---- kleines hohes Fenster mit Gitter
  var wx=WIN[0], wy=WIN[1], ww=WIN[2], wh=WIN[3];
  b.rect(wx-2,wy-2,ww+4,wh+4,P.s1); b.hl(wx-2,wx+ww+1,wy+wh+1,P.s4);
  for (y=wy;y<wy+wh;y++) for (x=wx;x<wx+ww;x++){ var c=(y<wy+6)?P.b4:(y<wy+10?P.s5:P.s4); if (y>=wy+10 && ((x+y)%5===0)) c=P.s3; b.px(x,y,c); }
  [wx+5,wx+11].forEach(function(gx){ b.vl(gx,wy,wy+wh-1,P.k2); }); b.hl(wx,wx+ww-1,wy+7,P.k2);
  // ---- an der Rückwand: das gerahmte Ticket, die Skizze, ein Bild, Regal mit Farbgläsern
  var tk=TICKET; b.rect(tk[0]-1,tk[1]-1,tk[2]+2,tk[3]+2,P.e1); b.rect(tk[0],tk[1],tk[2],tk[3],P.k1); b.rect(tk[0]+1,tk[1]+1,tk[2]-2,tk[3]-2,P.k2); b.hl(tk[0],tk[0]+tk[2]-1,tk[1],P.m1);
  b.rect(tk[0]+2,tk[1]+2,tk[2]-4,tk[3]-4,P.s5); b.rect(tk[0]+2,tk[1]+2,tk[2]-4,2,P.b1); b.hl(tk[0]+3,tk[0]+tk[2]-5,tk[1]+5,P.s3); b.hl(tk[0]+3,tk[0]+6,tk[1]+6,P.s3); b.px(tk[0]+tk[2]-4,tk[1]+6,P.r3);
  b.px(tk[0]+(tk[2]>>1),tk[1]-3,P.k2); b.line(tk[0]+(tk[2]>>1),tk[1]-3,tk[0]+2,tk[1]-1,P.s1); b.line(tk[0]+(tk[2]>>1),tk[1]-3,tk[0]+tk[2]-3,tk[1]-1,P.s1);
  // Bleistiftskizze: junger Mann mit Gitarre, mit einer Nadel angepinnt, Ecke eingerollt
  var sk=SKETCH; b.rect(sk[0],sk[1],sk[2],sk[3],P.s5); b.hl(sk[0],sk[0]+sk[2]-1,sk[1]+sk[3]-1,P.s3); b.vl(sk[0]+sk[2]-1,sk[1],sk[1]+sk[3]-1,P.s4); b.px(sk[0]+sk[2]-1,sk[1],P.s3); b.px(sk[0]+sk[2]-2,sk[1],P.s3);
  b.px(sk[0]+(sk[2]>>1),sk[1]+1,P.r3);
  var hx=sk[0]+5, hy=sk[1]+3; b.ellipse(hx+0.5,hy+1.5,1.6,1.8,P.s2); b.px(hx-1,hy,P.s1); b.px(hx,hy,P.s1); b.px(hx+1,hy,P.s1);   // Kopf, Haar
  b.line(hx,hy+3,hx,hy+8,P.s2); b.line(hx,hy+4,hx-2,hy+7,P.s2); b.line(hx,hy+8,hx-1,hy+12,P.s2); b.line(hx,hy+8,hx+2,hy+12,P.s2);   // Körper, Beine
  b.ellipse(hx+2.5,hy+8.5,1.6,1.4,P.s1); b.line(hx+3,hy+7,hx+6,hy+3,P.s1); b.line(hx+1,hy+5,hx+3,hy+6,P.s2);                       // Gitarre
  b.hl(sk[0]+2,sk[0]+sk[2]-3,sk[1]+sk[3]-2,P.s3);
  canvasFront(b,140,40,26,18,{seed:4,fx:0.5});
  b.rect(172,46,34,2,P.w2); b.hl(172,205,46,P.w3); b.hl(173,204,48,P.k2);    // Regalbrett
  [[174,'r3'],[179,'b2'],[184,'y3'],[189,'s5'],[194,'g3'],[199,'t3']].forEach(function(t){ b.rect(t[0],41,4,5,P.a5); b.rect(t[0],43,4,3,P[t[1]]); b.hl(t[0],t[0]+3,40,P.m2); b.px(t[0],42,P.s6); });
  // Leinwände an der Rückwand (frontal), unten gestapelt
  canvasFront(b,98,58,22,16,{seed:8,fx:0.55}); canvasBack(b,104,62,18,26); canvasFront(b,186,54,26,20,{seed:12,fx:0.4,kx:0.15}); canvasFront(b,196,68,16,20,{seed:15,fx:0.45});
  // ---- linke Wand: Vorhang zum Laden (Tür), Leinwände schräg an der Wand
  var dq=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]); b.poly(M.wallQuad(SPEC,'L',DOORU[0]-1.5,DOORU[1]+1.5,DOORU[2]-2,DOORU[3]),P.w2);
  b.poly(dq,function(x,y){ var f=Math.sin(x*1.1+y*0.04); return f>0.4?P.r2:(f>-0.4?P.r1:P.r0); });
  var dl=q('L',DOORU[0]+7,DOORU[2]+4), dl2=q('L',DOORU[0]+7,DOORU[3]); b.line(dl[0],dl[1],dl2[0],dl2[1],P.k1); b.line(dl[0]+1,dl[1],dl2[0]+1,dl2[1],P.k2);
  // Leinwände, die vor der linken Wand auf dem Boden stehen (zum Raum gedreht), hinten kleiner, vorn größer
  [[12,0,'back'],[16,1,{seed:21,fx:0.45}],[26,2,{seed:23,fx:0.55}],[30,3,'back'],[40,4,{seed:27,fx:0.5,kx:0.12}]].forEach(function(cv){ var Z=cv[0], k=1+Z/F, fyy=rnd(VP[1]+(FY-VP[1])*k), x0=rnd(VP[0]+(78-VP[0])*k)-cv[1]*2, w=rnd(18*k*0.8), h=rnd(14*k*0.8);
    var top=fyy-h-1; for (var yy=top;yy<fyy;yy++) for (var xx=x0+w;xx<x0+w+3;xx++) b.px(xx,yy,M.DN[M.DN[b.get(xx,yy)]]);     // Schatten
    if (cv[2]==='back') canvasBack(b,x0,top,w,h); else canvasFront(b,x0,top,w,h,cv[2]); });
  // ---- rechte Wand: Leinwände in Reihen, ein großes Bild hängt
  [[6,30,26,58,{seed:31,fx:0.5}],[34,58,30,64,{seed:33,fx:0.42}]].forEach(function(cv){ var Q=M.wallQuad(SPEC,'R',cv[0],cv[1],cv[2],cv[3]); onQuad(b,Q,motif(26,18,cv[4]),0);
    b.line(rnd(Q[0][0]),rnd(Q[0][1]),rnd(Q[1][0]),rnd(Q[1][1]),P.y2); b.line(rnd(Q[3][0]),rnd(Q[3][1]),rnd(Q[2][0]),rnd(Q[2][1]),P.y1); b.line(rnd(Q[0][0]),rnd(Q[0][1]),rnd(Q[3][0]),rnd(Q[3][1]),P.y2); b.line(rnd(Q[1][0]),rnd(Q[1][1]),rnd(Q[2][0]),rnd(Q[2][1]),P.y0); });
  [[4,22,62,88,'back'],[18,40,58,88,{seed:41,fx:0.55}],[30,50,66,88,{seed:43}],[44,66,60,88,'back'],[58,78,64,88,{seed:47,fx:0.48}]].forEach(function(cv){ var Q=M.wallQuad(SPEC,'R',cv[0],cv[1],cv[2],cv[3]).map(function(p){ return [p[0]-2,p[1]]; });
    if (cv[4]==='back'){ b.poly(Q,P.e3); b.line(rnd(Q[0][0]),rnd(Q[0][1]),rnd(Q[1][0]),rnd(Q[1][1]),P.w3); b.line(rnd(Q[3][0]),rnd(Q[3][1]),rnd(Q[2][0]),rnd(Q[2][1]),P.w2); var mq=[(Q[0][0]+Q[1][0])/2,(Q[0][1]+Q[1][1])/2], mq2=[(Q[3][0]+Q[2][0])/2,(Q[3][1]+Q[2][1])/2]; b.line(rnd(mq[0]),rnd(mq[1]),rnd(mq2[0]),rnd(mq2[1]),P.w2); return; }
    onQuad(b,Q,motif(24,18,cv[4]),-1); b.line(rnd(Q[0][0]),rnd(Q[0][1]),rnd(Q[3][0]),rnd(Q[3][1]),P.e2); b.line(rnd(Q[1][0]),rnd(Q[1][1]),rnd(Q[2][0]),rnd(Q[2][1]),P.e4); });
  // ---- Tisch mit Farben: Gläser, Pinsel in Dosen, Palette, Lappen (vorne rechts)
  R3.box(b,196,212,74,FY,22,44,{top:function(x,y){ var c=(hash(x>>1,y)<0.3)?P.w2:P.w3; if (hash(x,y)<0.08) c=[P.r3,P.b3,P.y4,P.g4][Math.floor(hash(y,x)*4)]; return c; },left:function(x,y){ return ((y%5)===0)?P.w0:P.w1; }});
  var tp=function(X,Z){ var p=R3.p(X,74,Z); return [rnd(p[0]),rnd(p[1])]; };
  [[199,26,'r3'],[203,28,'b2'],[207,25,'y3'],[200,33,'s5']].forEach(function(t){ var p=tp(t[0],t[1]); b.rect(p[0],p[1]-6,4,6,P.a5); b.rect(p[0],p[1]-4,4,4,P[t[2]]); b.hl(p[0],p[0]+3,p[1]-7,P.m2); b.px(p[0],p[1]-5,P.s6); });
  [[205,34],[200,40]].forEach(function(t,i){ var p=tp(t[0],t[1]); b.rect(p[0],p[1]-6,5,6,P.m2); b.vl(p[0],p[1]-6,p[1]-1,P.m4); for (var k=0;k<4;k++){ b.line(p[0]+1+k,p[1]-6,p[0]-1+k*2,p[1]-14-(k%2)*2,[P.w4,P.w3,P.y2,P.w2][k]); b.px(p[0]-1+k*2,p[1]-14-(k%2)*2,[P.r3,P.b2,P.k2,P.y3][k]); } });
  var pl=tp(207,40); b.ellipse(pl[0]+3,pl[1]-1,5,1.8,P.w4); [P.r3,P.y4,P.b3,P.s6,P.g4].forEach(function(c,i){ b.px(pl[0]+i*2,pl[1]-1-(i%2),c); });
  var rg=tp(201,42); b.rect(rg[0]-4,rg[1]-2,6,3,P.s4); b.px(rg[0]-3,rg[1]-1,P.b3); b.px(rg[0],rg[1]-2,P.r2);
  // Farbdosen auf dem Boden, Terpentinflasche
  [[140,8,'m3'],[132,10,'t3'],[186,16,'m2']].forEach(function(t){ var p=R3.p(t[0],FY,t[1]); b.rect(rnd(p[0]),rnd(p[1])-5,5,5,P[t[2]]); b.hl(rnd(p[0]),rnd(p[0])+4,rnd(p[1])-5,M.UP[P[t[2]]]); b.px(rnd(p[0])+1,rnd(p[1])-6,P.y3); });
  // ---- Licht: ein Strahl aus dem hohen Fenster fällt schräg auf Staffelei und Boden, sonst Dämmer
  var beam=M.lf.beam(WIN[0]+WIN[2]/2,WIN[1]+WIN[3],EASEL.cv[0]+EASEL.cv[2]/2+8,128,7,26,1.9);
  M.light(b,M.lf.sum(beam,M.lf.pool(166,96,110,50,0.7),M.lf.vignette(W,144,1.5),M.lf.k(-0.55)),0,0,function(x,y){ return !(x>=WIN[0]&&x<WIN[0]+WIN[2]&&y>=WIN[1]&&y<WIN[1]+WIN[3]); });
  return M.finishTOD(b,tod,{sky:function(x,y){ return x>=WIN[0]&&x<WIN[0]+WIN[2]&&y>=WIN[1]&&y<WIN[1]+WIN[3]; }}); }

// ---------------------------------------------------------------- Vordergrund: Staffelei, ein Stapel Leinwände vorn links
function layers(S,GS,tod){ var L=[], cv=EASEL.cv;
  var lay=M.layer(144,52,60,76,EASEL.base), w=M.lw(lay);
  // Staffelei: zwei Vorderbeine, ein Hinterbein, Ablage, Kopfklemme
  var xl=cv[0]+4, xr=cv[0]+cv[2]-4, top=cv[1]-6, mx=cv[0]+(cv[2]>>1);
  w.line(mx,top,mx+3,EASEL.base-10,P.w2);                                                     // Hinterbein (hinten, dunkel)
  w.line(mx-1,top+2,xl-5,EASEL.base,P.w3); w.line(mx,top+2,xl-4,EASEL.base,P.w4);            // Vorderbeine
  w.line(mx+1,top+2,xr+4,EASEL.base,P.w3); w.line(mx+2,top+2,xr+5,EASEL.base,P.w2);
  w.rect(mx,top,2,cv[1]+cv[3]+6-top,P.w3); w.vl(mx,top,cv[1]+cv[3]+5,P.w4);                   // Mast
  w.hl(xl-3,xr+3,EASEL.base-14,P.w2); w.hl(xl-3,xr+3,EASEL.base-15,P.w3);                    // Querstrebe
  w.px(mx,top-1,P.w4); w.px(mx+1,top-1,P.w3);
  // die Leinwand: dasselbe Motiv, unfertig
  var m=motif(cv[2]-2,cv[3]-2,{seed:9,unfinished:true,fx:0.56,kx:0.08}); w.rect(cv[0],cv[1],cv[2],cv[3],P.e4); w.blit(m,cv[0]+1,cv[1]+1); w.hl(cv[0],cv[0]+cv[2]-1,cv[1],P.s5); w.vl(cv[0]+cv[2]-1,cv[1],cv[1]+cv[3]-1,P.e2);
  w.hl(mx-3,mx+4,cv[1]-2,P.w4); w.hl(mx-3,mx+4,cv[1]-1,P.w2);                         // Klemme
  w.rect(cv[0]-2,cv[1]+cv[3],cv[2]+4,2,P.w3); w.hl(cv[0]-2,cv[0]+cv[2]+1,cv[1]+cv[3],P.w4); w.hl(cv[0]-2,cv[0]+cv[2]+1,cv[1]+cv[3]+2,P.w1);   // Ablage
  w.line(cv[0]+cv[2]-8,cv[1]+cv[3]-1,cv[0]+cv[2]-1,cv[1]+cv[3]-3,P.w4); w.px(cv[0]+cv[2]-8,cv[1]+cv[3]-1,P.r3);                                  // Pinsel auf der Ablage
  M.light(lay,M.lf.sum(M.lf.beam(WIN[0]+WIN[2]/2,WIN[1]+WIN[3],cv[0]+cv[2]/2+8,128,6,22,1.2),M.lf.k(-0.15)),lay.ox,lay.oy);
  if (tod!=='day') M.tintApply(lay,M.TINT[tod]);
  L.push(lay);
  // Stapel Leinwände vorne links (Repoussoir)
  var st=M.layer(0,84,52,60,143), sw=M.lw(st);
  sw.poly([[0,96],[30,100],[34,143],[0,143]],P.e3); sw.line(0,96,30,100,P.e4); sw.line(30,100,34,143,P.w2);
  sw.poly([[6,104],[44,110],[46,143],[8,143]],function(x,y){ return P.w1; }); sw.line(6,104,44,110,P.w3);
  var mm=motif(36,30,{seed:51,fx:0.5}); for (var yy=0;yy<30;yy++) for (var xx=0;xx<36;xx++){ var X=8+xx+Math.round(yy*0.05), Y=108+Math.round(xx*0.16)+yy; if (Y<143) sw.px(X,Y,mm.get(xx,yy)); }
  sw.line(8,107,44,113,P.e4);
  M.light(st,M.lf.k(-1.4),st.ox,st.oy); if (tod!=='day') M.tintApply(st,M.TINT[tod]);
  L.push(st);
  return L; }

// ---------------------------------------------------------------- bewegte Teile: Staub im Lichtstrahl
function dyn(fb,v,S,GS){ var x0=WIN[0]+WIN[2]/2, y0=WIN[1]+WIN[3], x1=EASEL.cv[0]+EASEL.cv[2]/2+8, y1=128;
  for (var i=0;i<18;i++){ var t=(hash(i,3)+v.t*0.02*(0.5+hash(i,4)))%1, x=rnd(x0+(x1-x0)*t+(hash(i,5)-0.5)*14+Math.sin(v.t*0.6+i)*2), y=rnd(y0+(y1-y0)*t+Math.cos(v.t*0.4+i)*2);
    if (Math.sin(v.t*1.1+i*1.7)>0) fb.px(x,y,v.ghost?P.x5:P.s5); } }
// Geistersicht: das gerahmte Ticket schimmert
function ghost(fb,v,S,GS){ var tk=TICKET, cx=tk[0]+tk[2]/2, cy=tk[1]+tk[3]/2, pulse=0.55+Math.sin(v.t*2.2)*0.25;
  for (var y=tk[1]-6;y<tk[1]+tk[3]+6;y++) for (var x=tk[0]-7;x<tk[0]+tk[2]+7;x++){ var dx=(x-cx)/(tk[2]/2+6), dy=(y-cy)/(tk[3]/2+5), d=dx*dx+dy*dy; if (d>1) continue;
    var inside=(x>=tk[0]&&x<tk[0]+tk[2]&&y>=tk[1]&&y<tk[1]+tk[3]); if (inside) continue; if (bayer(x+Math.floor(v.t*4),y)<(1-d)*pulse*0.8) fb.px(x,y,d<0.45?P.x5:P.x3); }
  for (var yy=tk[1]+2;yy<tk[1]+tk[3]-2;yy++) for (var xx=tk[0]+2;xx<tk[0]+tk[2]-2;xx++) fb.px(xx,yy,(bayer(xx,yy+Math.floor(v.t*3))<pulse)?P.x6:P.x5);
  fb.hl(tk[0]+3,tk[0]+tk[2]-5,tk[1]+5,P.x3);
  for (var i=0;i<5;i++){ var a=v.t*0.7+i*1.26, r=8+Math.sin(v.t*1.3+i)*2; fb.px(rnd(cx+Math.cos(a)*r),rnd(cy+Math.sin(a)*r*0.6),P.x6); } }

// ---------------------------------------------------------------- Lauffläche (Mala)
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<8||Z>100||y>140) return false;
  if (X<70+Z*0.0 && Z<36) return false;                  // Leinwände links
  if (X>196 && Z<46) return false;                       // Farbtisch
  if (X>222) return false;                               // Leinwände rechts
  if (X>=150 && X<=190 && Z>=24 && Z<=42) return false;  // Staffelei
  if (x<40 && y>118) return false;                       // Stapel vorne links
  return x>4 && x<316; };

M.defineArt('backroom',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, ghost:ghost,
  spots:{
    door:[63,14,28,98],
    canvases:[218,14,82,120],
    easel:[146,58,48,68],
    ticket:[104,38,17,14],
    sketch:[121,35,14,18],
    paints:[190,60,40,34],
    window:[143,14,24,21]
  },
  stands:{ door:[86,118,'L'], canvases:[230,124,'R'], easel:[166,132,'B'], ticket:[112,104,'B'], sketch:[128,104,'B'], paints:[204,116,'R'], window:[150,104,'B'] },
  start:[88,120,'R'], entries:{ shop:[88,120,'R'] }
});
})(M);
