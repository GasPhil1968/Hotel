/* ===== rooms/art/konsulat.js — Generalkonsulat, Wartezimmer (nur Fassung „Probe nein“): nüchtern, hell, ohne Zeichen.
   Rasterdecke mit Leuchtstoffpaneelen, hellgraue Wände mit Stoßleiste, grauer Steinzeugboden. Links in der Seitenwand die
   Tür, daneben der Nummernautomat („BITTE NUMMER ZIEHEN“). Hinten links ein Fenster mit senkrechten Lamellen (Straße im
   Schnee; Wetter), daneben Textplakate zu Pass und Antrag (zweisprachig, nur Schrift, keine Fahnen, keine Wappen) und eine
   Topfpflanze. Davor eine Reihe verbundener Wartestühle. Rechts die Schalterwand aus hellem Holz mit zwei Glasfenstern
   (Schalter 1 offen, Schalter 2 mit heruntergelassenem Rollo), Durchreiche und Sprechgitter; darüber die rote Nummern-
   anzeige „NR. 47“. Hinter dem Glas das Büro: Schreibtisch, Bildschirm, Ordnerregal; die Beamtin sitzt am Schalter 1. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[164,54], RECT=[42,18,272,96], F=100, FY=96;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOOR=[8,36,28,96];                                   // Tür in der linken Wand
var WIN={x0:48,x1:80,y0:28,y1:66};                       // Fenster mit Lamellen
var POS=[{x:98,y:30,w:28,h:36,t:'PASS',s:'PASOŠ'},{x:130,y:32,w:28,h:32,t:'ANTRAG',s:'ZAHTJEV'}];
var PART={X0:168,X1:272,Z:12};                           // Schalterwand (Vorderseite bei Z)
var G1={X0:176,X1:218}, G2={X0:226,X1:266};              // Schalterfenster (in Rückwand-X)
var GLY0=40, GLY1=74;                                    // Glas oben/unten (Höhe Y)
var DISP={x0:180,x1:214,y0:21,y1:33};                    // Nummernanzeige
var ROW={X0:56,X1:150,Z:30};                             // Stuhlreihe
var BEAMTIN=[198,99];
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
function inUV(w,U){ return w && w.u>=U[0] && w.u<U[1] && w.v>=U[2] && w.v<U[3]; }
function wea(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun')?w:'snowlie'; }
function mt(b,s,x,y,c){ var cx=x; for (var i=0;i<s.length;i++){ var ch=s[i], base={'Ä':'A','Ö':'O','Ü':'U'}[ch]||ch; M.microText(b,base,cx,y,c); if (base!==ch){ b.px(cx,y-2,c); b.px(cx+2,y-2,c); } cx+=M.microWidth(base)+1; } }
function mw(s){ return M.microWidth(s.replace(/Ä/g,'A').replace(/Ö/g,'O').replace(/Ü/g,'U')); }
// Siebensegment-Ziffern (5×9) für die Nummernanzeige
var SEG={'0':'abcdef','1':'bc','2':'abged','3':'abgcd','4':'fgbc','5':'afgcd','6':'afgedc','7':'abc','8':'abcdefg','9':'abcdfg'};
function seg(b,d,x,y,on,off){ var s=SEG[d]||''; function S(k,x0,y0,x1,y1){ var c=s.indexOf(k)>=0?on:off; if (c===undefined) return; for (var yy=y0;yy<=y1;yy++) for (var xx=x0;xx<=x1;xx++) b.px(xx,yy,c); }
  S('a',x+1,y,x+3,y); S('b',x+4,y+1,x+4,y+3); S('c',x+4,y+5,x+4,y+7); S('d',x+1,y+8,x+3,y+8); S('e',x,y+5,x,y+7); S('f',x,y+1,x,y+3); S('g',x+1,y+4,x+3,y+4); }

// ---------------------------------------------------------------- Licht: Leuchtstoffpaneele (kühl), Fenster
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var COOL=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.9+L*0.05, g*0.94+L*0.06+2, b*0.98+L*0.08+9]; });
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.74+L*0.3+14, g*0.74+L*0.3+16, b*0.66+L*0.3+18]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
function tubeAt(x,y){ var dx=(x-164)/190, dy=(y-80)/90, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,0.8):0; }
var WLF=1;
function winAt(x,y){ var dx=(x-70)/100, dy=(y-86)/62, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.4)*WLF:0; }
function vig(x,y){ var cx=(x-164)/195, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*1.9; }
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.45+tubeAt(x,y)*0.5+winAt(x,y)*0.35+vig(x,y)*1.15; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue; if (bayer(X,Y)<tubeAt(X,Y)*0.12) b.d[k]=M.tintPx(COOL,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,tubeAt(X2,Y2)*0.95)*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen
function wall(u,v,x,y,dim){ var c;
  if (v>=93) c=(v===93)?P.m2:P.m1;
  else if (v>=74 && v<77) c=(v===74)?P.s6:((v===75)?P.s3:P.s4);                                                  // Stoßleiste
  else { var f=fbm(u*0.03,v*0.05); c=(f>0.62 && bayer(x,y)<(f-0.62)*3)?P.s4:P.s5; if (v<RECT[1]+3) c=P.s4; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ return wall(u*1.5+(sd==='L'?0:500),v+RECT[1],x,y,sd==='L'?1:0); }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, s=20, ix=Math.floor((X+700)/s), iz=Math.floor((Z+700)/s), fx=(X+700)-ix*s, fz=(Z+700)-iz*s;
  var c=(hash(ix,iz)<0.5)?P.m3:P.s3; if (fx<0.6||fz<0.6) c=P.m2; var sp=hash(Math.floor(X*1.9),Math.floor(Z*1.7)); if (sp<0.05) c=M.DN[c];
  var g=fbm(X*0.05,Z*0.07); if (g>0.64 && bayer(x,y)<(g-0.64)*2) c=M.UP[c];
  var wear=Math.exp(-Math.pow((Z-60)/14,2))*Math.exp(-Math.pow((X-190)/50,2)); if (wear>0.35 && bayer(x,y)<(wear-0.35)*0.6) c=P.s4; return c; }
function ceilTex(xb,d,x,y){ var c=P.s5, cx=((Math.floor(xb+600))%26), cd=d%10; if (cx<1||cd===0) c=P.s3; return c; }

// ---------------------------------------------------------------- Straße draußen (Fenster mit Lamellen)
var WM=new Uint8Array(W*H);
function street(x,y,w,tod){ var lx=x-WIN.x0, ly=y-WIN.y0, night=tod==='night', c;
  var SK={snowlie:'b2 b3 b4',sun:'b3 b4 b5',thaw:'m3 m4 m4',snow:'m4 s4 s5',fog:'s4 s5 s5'}[w]; if (night) SK='k1 n0 n1';
  c=ra(R(SK),0.2+ly/16,x,y);
  if (ly>=10){ var fac=R('s3 s4 s5'); c=ra(fac,0.6+(fbm(lx*0.2,ly*0.2)-0.5)*0.3,x,y); var wx=(lx+1)%9, wy=(ly-10)%10; if (wy===0) c=(w==='thaw')?P.s3:P.s6; else if (wx>=2&&wx<7&&wy>=3&&wy<9) c=night?(hash(Math.floor(lx/9),Math.floor(ly/10))<0.4?P.y3:P.n1):P.m1; }
  if (ly>=32){ c=(w==='thaw')?P.m2:((ly===32)?P.s6:P.s5); }
  return c; }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), w=wea(GS), x, y, i;
  WLF=(tod==='night')?0:({snowlie:1,sun:1.1,thaw:0.6,snow:0.8,fog:0.65}[w]);
  WM.fill(0);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  // Leuchtstoffpaneele in der Rasterdecke
  [[100,30],[220,30],[160,56]].forEach(function(n){ var a=R3.p(n[0]-12,RECT[1],n[1]), c=R3.p(n[0]+12,RECT[1],n[1]+8), y0=rnd(a[1]); b.rect(rnd(a[0]),y0,rnd(c[0]-a[0]),Math.max(2,rnd(c[1]-a[1])),P.s6); b.hl(rnd(a[0]),rnd(c[0])-1,y0,P.l1); });
  // ---- linke Wand: Tür (grau, Metallzarge), Nummernautomat mit Schild
  var dq=M.wallQuad(SPEC,'L',DOOR[0],DOOR[1],DOOR[2],DOOR[3]), dq2=M.wallQuad(SPEC,'L',DOOR[0]-2,DOOR[1]+2,DOOR[2]-3,DOOR[3]);
  b.poly(dq2,P.m2); b.poly(dq,function(xx,yy){ var wv=wallUV('L',xx,yy); if (!wv) return P.s4; var lu=(wv.u-DOOR[0])/(DOOR[1]-DOOR[0]); return (lu>0.88)?P.s3:(((xx+yy)%11===0)?P.s3:P.s4); });
  var kn=rp(M.wallPt(SPEC,'L',DOOR[1]-4,64)); b.rect(kn[0]-2,kn[1],4,1,P.m4); b.px(kn[0],kn[1]+1,P.m3);
  // Nummernautomat auf einer Säule vor der Rückwand, Schild darüber
  var na=rp(R3.p(89,FY,6)); b.rect(na[0]-1,na[1]-24,3,24,P.m2); b.vl(na[0]-1,na[1]-24,na[1]-1,P.m3); b.rect(na[0]-4,na[1]-1,9,1,P.k2);
  b.rect(na[0]-4,na[1]-36,9,13,P.m3); b.vl(na[0]-4,na[1]-36,na[1]-24,P.m4); b.vl(na[0]+4,na[1]-36,na[1]-24,P.m1); b.rect(na[0]-3,na[1]-34,7,4,P.k2); b.px(na[0]-1,na[1]-33,P.y4); b.px(na[0],na[1]-28,P.r3); b.px(na[0]+1,na[1]-28,P.r4); b.rect(na[0]-2,na[1]-26,5,1,P.k1); b.px(na[0],na[1]-25,P.s6);
  var nw=M.microWidth('NR'); b.rect(na[0]-5,na[1]-46,11,8,P.b0); M.microText(b,'NR',na[0]-nw/2|0,na[1]-45,P.s6); b.vl(na[0],na[1]-38,na[1]-37,P.m1);
  // ---- Rückwand: Fenster mit Lamellen, Plakate, Topfpflanze
  for (y=WIN.y0;y<WIN.y1;y++) for (x=WIN.x0;x<WIN.x1;x++){ var lam=((x-WIN.x0)%6), c; if (lam<3){ c=(lam===0)?P.s3:((lam===1)?P.s5:P.s4); if (y>WIN.y1-8 && lam===2) c=P.s3; } else { c=street(x,y,w,tod); WM[y*W+x]=1; } b.px(x,y,c); }
  var fa={fog:0.75,snow:0.3,thaw:0.12}[w]||0; if (fa && tod==='day') M.fogBake(b,function(xx,yy){ return WM[yy*W+xx]?fa:0; },{col:w==='fog'?P.s4:P.s5,x:WIN.x0,y:WIN.y0,w:WIN.x1-WIN.x0,h:WIN.y1-WIN.y0});
  b.rect(WIN.x0-2,WIN.y0-4,WIN.x1-WIN.x0+4,3,P.m3); b.hl(WIN.x0-2,WIN.x1+1,WIN.y0-4,P.m4); b.rect(WIN.x0-3,WIN.y1,WIN.x1-WIN.x0+6,3,P.s6); b.hl(WIN.x0-3,WIN.x1+2,WIN.y1+2,P.s3);
  for (x=WIN.x0;x<WIN.x1;x+=6) b.px(x+1,WIN.y1-1,P.m2);
  POS.forEach(function(p,j){ b.rect(p.x+1,p.y+1,p.w,p.h,P.s3); b.rect(p.x,p.y,p.w,p.h,P.s6); b.rect(p.x,p.y,p.w,7,j?P.c1:P.b0);
    mt(b,p.t,p.x+rnd((p.w-mw(p.t))/2),p.y+1,P.s6); var sw=M.microWidth(p.s); M.microText(b,p.s,p.x+rnd((p.w-sw)/2),p.y+9,j?P.c1:P.b0);
    for (y=p.y+16;y<p.y+p.h-3;y+=2) b.hl(p.x+3,p.x+p.w-4-((y*7+j*3)%6),y,P.m3);
    if (!j){ b.rect(p.x+p.w-11,p.y+17,8,10,P.s4); b.rect(p.x+p.w-10,p.y+18,6,8,P.s5); b.ellipse(p.x+p.w-7,p.y+21,1.5,1.8,P.m3); b.rect(p.x+p.w-9,p.y+23,4,3,P.m3); }   // Passbild-Muster (ohne Gesicht)
    b.px(p.x+1,p.y+1,P.m2); b.px(p.x+p.w-2,p.y+1,P.m2); });
  var pp=rp(R3.p(160,FY,6)); b.rect(pp[0]-5,pp[1]-10,11,10,P.s5); b.hl(pp[0]-6,pp[0]+6,pp[1]-11,P.s6); b.vl(pp[0]+5,pp[1]-10,pp[1]-1,P.s3);
  b.line(pp[0],pp[1]-11,pp[0]-1,pp[1]-30,P.w1); var rr=M.rng(5); for (i=0;i<18;i++){ var lx=pp[0]-8+Math.floor(rr()*16), ly=pp[1]-48+Math.floor(rr()*36), dir=rr()<0.5?-1:1; for (var k=0;k<6;k++){ b.px(lx+k*dir,ly+Math.floor(k*0.5),k<2?P.g2:P.g3); b.px(lx+k*dir,ly+1+Math.floor(k*0.5),P.g1); } }
  // ---- rechte Wand: Uhr
  var ck=rp(M.wallPt(SPEC,'R',24,32)); b.ellipse(ck[0]+0.5,ck[1]+0.5,4.6,5.6,P.m1); b.ellipse(ck[0]+0.5,ck[1]+0.5,3.6,4.6,P.s6); b.vl(ck[0],ck[1]-3,ck[1],P.k1); b.line(ck[0],ck[1],ck[0]+2,ck[1]+1,P.k1);
  // ---- Büro hinter dem Glas (auf der Rückwand, wird durch die Glasebene gesehen): Regal, Schreibtisch, Bildschirm
  var bx0=rnd(R3.p(PART.X0,0,0)[0]), bx1=RECT[2];
  for (y=GLY0-6;y<FY;y++) for (x=bx0;x<bx1;x++){ var c2=(y<74)?P.s4:P.s3; if (y>=FY-2) c2=P.m2; b.px(x,y,c2); }
  for (var sh=0;sh<3;sh++){ var sy=44+sh*10; b.hl(bx0+30,bx1-6,sy,P.w2); for (x=bx0+31;x<bx1-7;x+=3){ var col=[P.b1,P.r2,P.m2,P.e3,P.g3][Math.floor(hash(x,sh)*5)]; if (hash(x+3,sh)<0.15) continue; b.rect(x,sy-8,2,8,col); b.px(x,sy-5,P.s6); } }
  b.rect(bx0+4,78,bx1-bx0-8,3,P.w3); b.hl(bx0+4,bx1-5,78,P.w4); b.rect(bx0+18,68,12,9,P.k2); b.rect(bx0+19,69,10,7,P.n2); b.rect(bx0+23,77,3,1,P.m1);
  return finishPaint(b,S,GS,tod,w); }
function finishPaint(b,S,GS,tod,w){
  // Nummernanzeige über dem Schalter: rote Leuchtziffern „47“, davor „NR.“
  var d=DISP, x, y; b.rect(d.x0-1,d.y0-1,d.x1-d.x0+2,d.y1-d.y0+2,P.m1); b.rect(d.x0,d.y0,d.x1-d.x0,d.y1-d.y0,P.k1); b.hl(d.x0,d.x1-1,d.y0,P.k2);
  M.microText(b,'NR.',d.x0+2,d.y0+4,P.r2); seg(b,'4',d.x0+16,d.y0+2,P.r3,P.r0); seg(b,'7',d.x0+23,d.y0+2,P.r3,P.r0); b.vl(rnd((d.x0+d.x1)/2),d.y0-5,d.y0-2,P.m1);
  DIG=[d.x0+16,d.y0+2];
  shade(b,0,0,tod,function(xx,yy){ return !WM[yy*W+xx]; });
  if (tod!=='day') M.tintApply(b,M.TINT[tod]||M.TINT.night,WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0,function(xx,yy){ return WM[yy*W+xx]===1; });
  return b; }
var DIG=[0,0];

// ---------------------------------------------------------------- Ebenen: Schalterwand mit Glas (vor der Beamtin), Stuhlreihe
var SLOT=[0,0];
function layers(S,GS,tod){ var L=[];
  function fin(l){ shade(l,l.ox,l.oy,tod); L.push(l); }
  // Schalterwand: Holzfront unten, Ablage, zwei Glasfenster mit Rahmen, oben Blende; nur Rahmen, Ablage und Spiegelungen sind deckend
  var a=R3.p(PART.X0,RECT[1],PART.Z), z=R3.p(PART.X1,FY,PART.Z), x0=rnd(a[0]), x1=Math.min(W,rnd(z[0])), y0=rnd(R3.p(0,GLY0-8,PART.Z)[1]), yb=rnd(z[1]);
  var gl0=rnd(R3.p(0,GLY0,PART.Z)[1]), gl1=rnd(R3.p(0,GLY1,PART.Z)[1]), l=M.layer(x0-2,y0-2,x1-x0+4,yb-y0+4,yb), lw=M.lw(l), x, y;
  var g1a=rnd(R3.p(G1.X0,0,PART.Z)[0]), g1b=rnd(R3.p(G1.X1,0,PART.Z)[0]), g2a=rnd(R3.p(G2.X0,0,PART.Z)[0]), g2b=rnd(R3.p(G2.X1,0,PART.Z)[0]);
  for (y=y0;y<yb;y++) for (x=x0;x<x1;x++){ var inG1=(x>=g1a&&x<g1b), inG2=(x>=g2a&&x<g2b), c;
    if (y<gl0){ c=(y===y0)?P.w4:((y<y0+2)?P.w3:P.w2); if (y===gl0-1) c=P.w1; }
    else if (y<gl1){ if (inG1||inG2){ var ref=((x-y*0.8)%23+23)%23; if (inG2){ c=((y-gl0)%3===0)?P.s3:P.s4; if (y>gl0+18) c=(ref<2)?P.s5:-1; } else c=(ref<1.5)?P.s6:((ref<2.5)?P.s5:-1); if (x===g1a||x===g1b-1||x===g2a||x===g2b-1) c=P.m3; }
      else c=((x%9)===0)?P.w1:P.w3; }
    else if (y<gl1+3){ c=(y===gl1)?P.s6:((y===gl1+1)?P.s4:P.w1); }                                                                            // Ablage
    else { var p=((x-x0)%14); c=(p<1)?P.w1:((y>yb-3)?P.m1:P.w3); if (y===gl1+3) c=P.k2; }
    if (c!==-1) lw.px(x,y,c); }
  // Rollo am Schalter 2 mit Schild, Sprechgitter und Durchreiche am Schalter 1, Schalternummern
  var mid1=rnd((g1a+g1b)/2), mid2=rnd((g2a+g2b)/2);
  lw.rect(mid2-9,gl0+22,19,7,P.s6); mt({px:function(X,Y,c){ lw.px(X,Y,c); }},'ZU',mid2-3,gl0+23,P.r2);
  for (y=gl0+8;y<gl0+14;y++) for (x=mid1-4;x<=mid1+4;x++) if ((x+y)%2===0) lw.px(x,y,P.m2); lw.hl(mid1-5,mid1+5,gl0+7,P.m3); lw.hl(mid1-5,mid1+5,gl0+14,P.m3);
  lw.rect(mid1-8,gl1-3,17,3,P.m1); lw.hl(mid1-8,mid1+8,gl1-3,P.m3); lw.rect(mid1-7,gl1-2,15,2,P.k2); SLOT=[mid1,gl1];
  lw.rect(mid1-4,y0,9,7,P.b0); mt({px:function(X,Y,c){ lw.px(X,Y,c); }},'1',mid1-1,y0+1,P.s6); lw.rect(mid2-4,y0,9,7,P.m2); mt({px:function(X,Y,c){ lw.px(X,Y,c); }},'2',mid2-1,y0+1,P.s5);
  fin(l);
  // Reihe verbundener Wartestühle (Stahlrohr, graublaue Sitzschalen)
  var ra0=rp(R3.p(ROW.X0,FY,ROW.Z)), ra1=rp(R3.p(ROW.X1,FY,ROW.Z)), rl=M.layer(ra0[0]-3,ra0[1]-30,ra1[0]-ra0[0]+6,32,ra0[1]), rw=M.lw(rl), n=6, sw=(ra1[0]-ra0[0])/n;
  rw.hl(ra0[0],ra1[0],ra0[1]-11,P.m1); rw.hl(ra0[0],ra1[0],ra0[1]-10,P.k2);
  for (var i=0;i<n;i++){ var sx=rnd(ra0[0]+i*sw)+1, ww=rnd(sw)-2; rw.rect(sx,ra0[1]-14,ww,3,P.c2); rw.hl(sx,sx+ww-1,ra0[1]-14,P.c3); rw.rect(sx+1,ra0[1]-26,ww-2,11,P.c2); rw.hl(sx+1,sx+ww-2,ra0[1]-26,P.c3); rw.vl(sx+ww-2,ra0[1]-25,ra0[1]-15,P.c1); }
  [ra0[0]+3,rnd((ra0[0]+ra1[0])/2),ra1[0]-4].forEach(function(lx){ rw.vl(lx,ra0[1]-10,ra0[1]-1,P.m2); rw.hl(lx-3,lx+3,ra0[1]-1,P.k2); });
  rw.rect(rnd(ra0[0]+sw*2)+4,ra0[1]-17,8,3,P.s5); rw.hl(rnd(ra0[0]+sw*2)+5,rnd(ra0[0]+sw*2)+10,ra0[1]-16,P.m3);                                   // liegengelassene Zeitung
  fin(rl);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Anzeige springt ab und zu, Schnee vor dem Fenster
function dyn(fb,v,S,GS){ var t=v.t, w=wea(GS), i, ph=t%20;
  if (ph<1.2 && Math.floor(t*4)%2){ fb.rect(DISP.x0+1,DISP.y0+1,DISP.x1-DISP.x0-2,DISP.y1-DISP.y0-2,P.k1); }
  if (w==='snow'){ for (i=0;i<16;i++){ var X=rnd(WIN.x0+((hash(i,43)*40+t*3+Math.sin(t+i)*2)%40+40)%40), Y=rnd(WIN.y0+((t*(6+hash(i,41)*6)+hash(i,42)*38)%38)); if (X>=0&&X<W&&Y>=0&&Y<H&&WM[Y*W+X]) fb.px(X,Y,(i%3)?P.s5:P.s6); } } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<116||y>138||x<20||x>300) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false; return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var L=levels(tod), f=Math.min(1,tubeAt(a.x,a.y-24)*0.95)*(L.length-1); return L[Math.round(f)].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOOR[0]-2,DOOR[1]+2,DOOR[2]-3,DOOR[3]));
var SP=(function(){ var a=R3.p(PART.X0,GLY0-8,PART.Z), z=R3.p(PART.X1,FY,PART.Z), ra0=rp(R3.p(ROW.X0,FY,ROW.Z)), ra1=rp(R3.p(ROW.X1,FY,ROW.Z)), g1a=rnd(R3.p(G1.X0,0,PART.Z)[0]), g1b=rnd(R3.p(G1.X1,0,PART.Z)[0]);
  return { door:DQ, counter:[g1a-2,rnd(a[1]),g1b-g1a+4,rnd(z[1])-rnd(a[1])], number:[DISP.x0-2,DISP.y0-6,DISP.x1-DISP.x0+4,DISP.y1-DISP.y0+8], chairs:[ra0[0]-3,ra0[1]-28,ra1[0]-ra0[0]+6,30],
    posters:[POS[0].x-2,POS[0].y-2,POS[1].x+POS[1].w-POS[0].x+4,POS[0].h+4] }; })();
M.defineArt('konsulat',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, actorLut:actorLut,
  spots:SP,
  stands:{ door:[30,122,'L'], counter:[200,118,'B'], number:[196,120,'B'], chairs:[104,120,'B'], posters:[124,118,'B'] },
  actorPos:{ beamtin:[BEAMTIN[0],BEAMTIN[1],'L'] },
  start:[32,124,'R'], entries:{ map:[32,124,'R'] }
});
})(M);
