/* ===== rooms/art/vermisst.js — Vermisstenstelle: ein nüchternes Büro in einem Verwaltungsbau.
   Unten ölgrün gestrichene Wände, oben weiß, ein grauer Linoleumboden, Leuchtstoffröhren unter der Decke. Links in der Seitenwand
   die Tür zum Flur. Hinten links die Wand mit den Fotos der Vermissten: viele kleine Rechtecke in Reihen, nur angedeutet (keine
   Gesichter), darunter Kärtchen mit Zeilen. Daneben das Plakat mit einem roten Tropfen: „KRVNI UZORAK“. Rechts das Fenster mit
   Lamellen (graues Licht, Streifen auf Wand und Boden), davor ein Gummibaum, in der Ecke der graue Aktenschrank mit Etiketten,
   obenauf der Wasserkocher mit Tassen. In der Mitte der Schreibtisch: Röhrenmonitor, Tastatur, Formularstapel, Stempel und
   Stempelkissen, Telefon, Ablagekorb; Frau Kolar sitzt rechts daran auf dem Bürostuhl, links davor zwei Besucherstühle aus
   Stahlrohr (auf dem einen sitzt Nada). Eine Wanduhr, ein Kleiderständer. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[160,54], RECT=[36,18,284,96], F=100, FY=96;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOORU=[6,30,30,96];                                // Tür in der linken Wand
var PW={x0:46,x1:136,y0:28,y1:76};                     // Wand mit den Fotos
var PST={x0:144,y0:30,w:26,h:34};                      // Plakat „Krvni uzorak“
var WIN={x0:190,x1:248,y0:26,y1:68};                   // Fenster mit Lamellen
var CAB={X0:256,X1:282,Y0:46,Z0:2,Z1:16};              // Aktenschrank
var DESK={X0:126,X1:202,Y0:81,Z0:28,Z1:44};            // Schreibtisch
var KOLAR=[220,110], NADA=[108,111];                   // Sitzende: Hüfte x, Füße y
var CH2=[86,111];                                      // zweiter Besucherstuhl (leer)
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

// ---------------------------------------------------------------- Licht: Leuchtstoffröhren (kühl), graues Fensterlicht durch die Lamellen
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var COOL=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.9+L*0.06, g*0.94+L*0.06+2, b*0.98+L*0.08+8]; });
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.7+L*0.3+14, g*0.7+L*0.3+16, b*0.62+L*0.3+18]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
function tubeAt(x,y){ var dx=(x-160)/180, dy=(y-80)/84, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,0.8):0; }
function winAt(x,y){ var dx=(x-220)/110, dy=(y-84)/66, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.2):0; }
// Streifen der Lamellen: schräg nach links unten auf Boden und Rückwand projiziert
function slatAt(x,y){ if (y<WIN.y0) return 0; var t=(y-WIN.y0), sx=x+t*0.55; if (sx<WIN.x0-6||sx>WIN.x1+28) return 0; var ph=((t*0.42+sx*0.06)%3.2+3.2)%3.2; return (ph<1.3?1:0)*Math.max(0,1-t/120)*Math.min(1,(WIN.x1+28-sx)/20); }
function vig(x,y){ var cx=(x-160)/190, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*2.0; }
var SLAT=0.6;
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.6+tubeAt(x,y)*0.55+winAt(x,y)*0.5+slatAt(x,y)*SLAT+vig(x,y)*1.3; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue; if (bayer(X,Y)<tubeAt(X,Y)*0.3) b.d[k]=M.tintPx(COOL,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,tubeAt(X2,Y2)*0.9+(tod==='night'?0:winAt(X2,Y2)*0.3))*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen: Wände unten ölgrün, oben weiß; grauer Linoleumboden; Rasterdecke
function wall(u,v,x,y,dim){ var c;
  if (v>=93) c=(v===93)?P.m1:P.k2;
  else if (v>=64){ c=(v===64)?P.g2:((v===65)?P.g4:P.g3); var f=fbm(u*0.05,v*0.08); if (f>0.62 && bayer(x,y)<(f-0.62)*3) c=P.g2; if (v>88 && hash(u>>1,v)<0.15) c=P.g2; }
  else { var f2=fbm(u*0.03,v*0.04); c=(f2>0.62 && bayer(x,y)<(f2-0.62)*3)?P.s4:P.s5; if (v<RECT[1]+3) c=P.s4; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ return wall(u*1.5+(sd==='L'?0:500),v+RECT[1],x,y,sd==='L'?1:0); }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, s=16, ix=Math.floor((X+700)/s), iz=Math.floor((Z+700)/s), fx=(X+700)-ix*s, fz=(Z+700)-iz*s;
  var c=(hash(ix,iz)<0.5)?P.m2:P.m3; if (fx<0.6||fz<0.6) c=P.m1; var g=fbm(X*0.05,Z*0.07); if (g>0.6 && bayer(x,y)<(g-0.6)*2) c=M.UP[c]; if (hash(Math.floor(X*1.9),Math.floor(Z*1.7))<0.03) c=P.m1;
  var wear=Math.exp(-Math.pow((Z-56)/12,2))*Math.exp(-Math.pow((X-150)/50,2)); if (wear>0.3 && bayer(x,y)<(wear-0.3)) c=P.m4; return c; }
function ceilTex(xb,d,x,y){ var c=P.s4; if ((Math.floor(xb+600)%24)<1) c=P.s2; if ((d%7)===0) c=P.s2; return c; }

// ---------------------------------------------------------------- die Wand mit den Fotos: viele kleine Rechtecke, nur angedeutet
function photoWall(b){ var p=PW, x, y, r=M.rng(91);
  b.rect(p.x0-2,p.y0-2,p.x1-p.x0+4,p.y1-p.y0+4,P.w2); b.rect(p.x0,p.y0,p.x1-p.x0,p.y1-p.y0,P.e3);                                   // Korkwand im Holzrahmen
  for (y=p.y0;y<p.y1;y++) for (x=p.x0;x<p.x1;x++) if (hash(x,y)<0.25) b.px(x,y,(hash(x+1,y)<0.5)?P.e2:P.e4);
  b.hl(p.x0-2,p.x1+1,p.y0-2,P.w3); b.hl(p.x0-2,p.x1+1,p.y1+1,P.w1);
  var cols=12, rows=4, cw=(p.x1-p.x0-4)/cols, rh=(p.y1-p.y0-2)/rows;
  for (var j=0;j<rows;j++) for (var i=0;i<cols;i++){ if (r()<0.08) continue; var px=rnd(p.x0+3+i*cw+(r()-0.5)*1.5), py=rnd(p.y0+2+j*rh+(r()-0.5)*1.5), pw=5, ph=6;
    var tone=r(), bg=tone<0.5?P.m3:(tone<0.8?P.s3:P.e4);                                                                     // Schwarzweiß und vergilbt
    b.rect(px,py,pw,ph,P.s6); b.rect(px+1,py+1,pw-2,ph-3,bg);
    var hd=tone<0.5?P.m1:P.e1; b.px(px+2,py+2,hd); b.px(px+2,py+3,hd); b.hl(px+1,px+3,py+4,M.DN[hd]);                               // nur ein Umriss, kein Gesicht
    b.px(px+2,py-1,[P.r3,P.b2,P.y3,P.g3][Math.floor(r()*4)]);                                                                 // Pinnnadel
    b.hl(px,px+pw-1,py+ph+1,P.s5); if (r()<0.6) b.hl(px,px+pw-2,py+ph+2,P.s4); }                                             // Kärtchen mit Namen (unleserlich)
  // ein paar Zettel zwischen den Fotos
  [[p.x0+40,p.y1-8],[p.x0+74,p.y0+16]].forEach(function(q){ b.rect(q[0],q[1],7,6,P.y4); b.hl(q[0]+1,q[0]+5,q[1]+2,P.e2); b.hl(q[0]+1,q[0]+4,q[1]+4,P.e2); }); }

// ---------------------------------------------------------------- Plakat: Blutprobe – Krvni uzorak (roter Tropfen)
function poster(b){ var p=PST, x, y; b.rect(p.x0,p.y0,p.w,p.h,P.s6); b.hl(p.x0,p.x0+p.w-1,p.y0+p.h-1,P.s3); b.vl(p.x0+p.w-1,p.y0,p.y0+p.h-1,P.s3);
  var cx=p.x0+p.w/2, cy=p.y0+14; for (y=p.y0+4;y<p.y0+20;y++) for (x=p.x0+3;x<p.x0+p.w-3;x++){ var dy=y-cy, dx=x+0.5-cx, rr=(dy<0)?(5.6+dy*0.62):5.6; if (dy<-8) continue; if (Math.abs(dx)<=Math.max(0,rr)*(dy<0?1:Math.sqrt(Math.max(0,1-Math.pow(dy/6.2,2))))) b.px(x,y,(dx<-1.5&&dy<1)?P.r4:((dx>2)?P.r2:P.r3)); }
  b.px(rnd(cx)-2,cy-1,P.s6); b.px(rnd(cx)-2,cy,P.r4);
  M.microText(b,'KRVNI',p.x0+3,p.y0+22,P.k1); M.microText(b,'UZORAK',p.x0+1,p.y0+28,P.k1);
  b.px(p.x0+1,p.y0+1,P.m3); b.px(p.x0+p.w-2,p.y0+1,P.m3); }

// ---------------------------------------------------------------- Fenster mit Lamellen
var REG=new Uint8Array(W*H);
function windowBlinds(b,tod,weather){ var w=WIN, x, y;
  b.rect(w.x0-3,w.y0-3,w.x1-w.x0+6,w.y1-w.y0+6,P.s5); b.hl(w.x0-3,w.x1+2,w.y0-3,P.s6); b.hl(w.x0-5,w.x1+4,w.y1+3,P.s6); b.hl(w.x0-5,w.x1+4,w.y1+4,P.s3); b.hl(w.x0-5,w.x1+4,w.y1+5,P.s2);
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var sl=(y-w.y0)%4, out=(tod==='night')?P.n0:((weather==='grey'||weather==='rain')?((y<w.y0+24)?P.s4:P.m3):P.b4);
    if (y>w.y0+26 && x%11<7 && tod!=='night') out=((y+x)%3)?P.m3:P.s3;                                                         // gegenüber ein Verwaltungsbau
    var c=(sl===0)?P.s3:((sl===1)?P.s5:((sl===2)?P.s4:out)); if (sl===3){ REG[y*W+x]=1; } b.px(x,y,c); }
  b.vl(w.x0+4,w.y0,w.y1+6,P.s2); b.vl(w.x1-5,w.y0,w.y1+8,P.s2); b.rect(w.x1-6,w.y1+8,2,3,P.m3); b.rect(w.x0-1,w.y0-2,w.x1-w.x0+2,2,P.m3); }

// ---------------------------------------------------------------- Aktenschrank, Wasserkocher, Gummibaum, Uhr, Kleiderständer
function cabinet(b){ var C=CAB, x;
  R3.box(b,C.X0,C.X1,C.Y0,FY,C.Z0,C.Z1,{top:P.m3,front:P.m2,left:P.m1});
  var f0=rp(R3.p(C.X0,C.Y0,C.Z1)), f1=rp(R3.p(C.X1,FY,C.Z1)), hgt=f1[1]-f0[1];
  for (var i=0;i<4;i++){ var y0=f0[1]+2+rnd(i*hgt/4), y1=f0[1]+rnd((i+1)*hgt/4)-1; b.rect(f0[0]+2,y0,f1[0]-f0[0]-4,y1-y0,P.m3); b.hl(f0[0]+2,f1[0]-3,y0,P.m4); b.hl(f0[0]+2,f1[0]-3,y1-1,P.m1);
    var cx=rnd((f0[0]+f1[0])/2); b.rect(cx-4,y0+2,8,3,P.s6); b.hl(cx-3,cx+2,y0+3,P.m2); b.rect(cx-2,y0+6,4,2,P.m1); }
  // Wasserkocher und zwei Tassen obenauf
  var t=rp(R3.p(C.X0+8,C.Y0,C.Z0+8)); b.rect(t[0]-3,t[1]-9,7,9,P.s6); b.vl(t[0]-3,t[1]-9,t[1]-1,P.s5); b.hl(t[0]-3,t[0]+3,t[1]-9,P.s5); b.rect(t[0]+4,t[1]-7,2,5,P.s5); b.px(t[0]-4,t[1]-8,P.s5); b.rect(t[0]-3,t[1]-1,7,1,P.m1); b.px(t[0],t[1]-5,P.b2);
  b.rect(t[0]+8,t[1]-4,3,4,P.r3); b.rect(t[0]+12,t[1]-4,3,4,P.s6); b.px(t[0]+15,t[1]-3,P.s5); KET=[t[0],t[1]-10]; }
var KET=[0,0];

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), x, y, i;
  SLAT=(tod!=='day')?0.3:((weather==='grey'||weather==='rain')?0.75:1.1);
  REG.fill(0);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  // Leuchtstoffröhren in Rasterleuchten
  [[110,40],[210,40]].forEach(function(n){ var a=R3.p(n[0]-16,RECT[1],n[1]), c=R3.p(n[0]+16,RECT[1],n[1]), y0=rnd(a[1])+1; b.rect(rnd(a[0]),y0,rnd(c[0]-a[0]),3,P.s3); b.hl(rnd(a[0])+1,rnd(c[0])-2,y0+1,P.l1); b.hl(rnd(a[0]),rnd(c[0]),y0+3,P.m3); });
  // ---- linke Wand: Tür (Holzfurnier, Glasstreifen), Lichtschalter, Kleiderständer
  var dq=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]), dq2=M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3]);
  b.poly(dq2,P.m3); b.poly(dq,function(xx,yy){ var w=wallUV('L',xx,yy); if (!w) return P.w3; var lu=(w.u-DOORU[0])/(DOORU[1]-DOORU[0]), lv=(w.v-DOORU[2])/(DOORU[3]-DOORU[2]); if (lu>0.62 && lu<0.82 && lv>0.1 && lv<0.55) return (yy%3)?P.s4:P.s5; return ((xx+(yy>>3))%7===0)?P.w2:P.w3; });
  var kn=rp(M.wallPt(SPEC,'L',DOORU[1]-3,64)); b.rect(kn[0]-1,kn[1],3,1,P.m4); b.px(kn[0],kn[1]+1,P.m3);
  var sw=rp(M.wallPt(SPEC,'L',DOORU[1]+5,60)); b.rect(sw[0],sw[1],3,4,P.s6); b.px(sw[0]+1,sw[1]+1,P.m3);
  var cr=rp(M.wallPt(SPEC,'L',DOORU[1]+14,FY)); b.vl(cr[0],cr[1]-50,cr[1]-1,P.m1); b.vl(cr[0]+1,cr[1]-50,cr[1]-1,P.m3); b.hl(cr[0]-5,cr[0]+6,cr[1]-1,P.m1); b.line(cr[0]-4,cr[1]-50,cr[0]+5,cr[1]-50,P.m2);
  b.poly([[cr[0]-1,cr[1]-48],[cr[0]+5,cr[1]-48],[cr[0]+7,cr[1]-22],[cr[0]-3,cr[1]-21]],function(xx,yy){ return (xx<cr[0]+1)?P.c1:(((xx+yy)%5===0)?P.c1:P.c2); });             // Mantel am Ständer
  b.ellipse(cr[0]+2,cr[1]-50,3,1.4,P.r1);                                                                                                                          // Mütze obenauf
  // ---- Rückwand: Fotowand, Plakat, Fenster, Uhr, ein Verzeichnis-Aushang
  photoWall(b); poster(b); windowBlinds(b,tod,weather);
  M.prop.clock(b,182,22,0,0,0); b.ellipse(181.5,22.5,4.6,4.6,P.m1); b.ellipse(181.5,22.5,3.6,3.6,P.s6); b.line(181,22,181,19,P.k1); b.line(181,22,183,24,P.k1);
  b.rect(176,48,10,14,P.s6); for (y=50;y<61;y+=2) b.hl(177,184,y,P.m3); b.px(181,47,P.m3);
  // Heizkörper unter dem Fenster
  for (y=WIN.y1+10;y<WIN.y1+22;y++) for (x=WIN.x0+4;x<WIN.x1-4;x++){ var fu=(x-WIN.x0)%3; b.px(x,y,fu===0?P.s3:(fu===1?P.s6:P.s5)); } b.hl(WIN.x0+4,WIN.x1-5,WIN.y1+10,P.s6);
  cabinet(b);
  var fs=rp(R3.p(CAB.X0+18,CAB.Y0,CAB.Z0+6)); for (i=0;i<4;i++){ b.rect(fs[0]-4,fs[1]-2-i*2,9,2,[P.b1,P.e3,P.r2,P.e4][i]); b.hl(fs[0]-4,fs[0]+4,fs[1]-2-i*2,P.s5); }
  var wb=rp(R3.p(212,FY,44)); b.rect(wb[0]-4,wb[1]-9,9,9,P.m2); b.hl(wb[0]-5,wb[0]+5,wb[1]-10,P.m3); for (x=wb[0]-3;x<wb[0]+4;x+=2) b.vl(x,wb[1]-8,wb[1]-2,P.m1); b.px(wb[0]-1,wb[1]-11,P.s6); b.px(wb[0]+1,wb[1]-11,P.s5);
  // Gummibaum im Topf vor dem Fenster (rechts)
  var gp=rp(R3.p(240,FY,22)); b.rect(gp[0]-5,gp[1]-9,11,9,P.s5); b.hl(gp[0]-6,gp[0]+6,gp[1]-10,P.s6); b.vl(gp[0]+5,gp[1]-9,gp[1]-1,P.s3);
  b.line(gp[0],gp[1]-10,gp[0]-1,gp[1]-30,P.w1); var rr=M.rng(13); for (i=0;i<14;i++){ var lx=gp[0]-7+Math.floor(rr()*14), ly=gp[1]-40+Math.floor(rr()*28), dir=rr()<0.5?-1:1; for (var k=0;k<5;k++){ b.px(lx+k*dir,ly+Math.floor(k*0.4),k<2?P.g2:P.g3); b.px(lx+k*dir,ly+1+Math.floor(k*0.4),P.g1); } }
  // zweiter Besucherstuhl und Nadas Stuhl (Stahlrohr, grauer Stoff): Lehne links, Blick nach rechts
  visitorChair(b,CH2[0],CH2[1]); visitorChair(b,NADA[0],NADA[1]);
  // Frau Kolars Bürostuhl (Lehne rechts)
  officeChair(b,KOLAR[0],KOLAR[1]);
  // ---- Licht
  shade(b,0,0,tod,function(x,y){ return !REG[y*W+x]; });
  if (tod!=='day') M.tintApply(b,M.TINT[tod]||M.TINT.night,WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0,function(x,y){ return REG[y*W+x]===1; });
  return b; }
function visitorChair(b,x,fy){ var sy=fy-13, C=R('m1 m2 m3 m4');
  b.line(x-4,sy+2,x-5,fy,C[1]); b.line(x+4,sy+2,x+5,fy,C[1]); b.hl(x-6,x+6,fy,C[0]); b.rect(x-5,sy,11,3,P.c2); b.hl(x-5,x+5,sy,P.c3); b.vl(x-6,sy-13,sy+2,C[2]); b.rect(x-7,sy-12,2,9,P.c2); b.px(x-6,sy-14,C[3]); }
function officeChair(b,x,fy){ var sy=fy-13, bx=x+6;
  b.rect(x-5,sy,11,3,P.k2); b.hl(x-5,x+5,sy,P.m1); b.rect(bx,sy-18,4,17,P.k2); b.vl(bx,sy-18,sy-2,P.m1); b.hl(bx,bx+3,sy-18,P.m2);
  b.vl(x,sy+3,fy-3,P.m2); b.vl(x+1,sy+3,fy-3,P.m0); b.line(x-6,fy-1,x+7,fy-1,P.k1); b.line(x-4,fy-2,x+5,fy-2,P.m1); b.px(x-6,fy,P.k1); b.px(x+7,fy,P.k1); }

// ---------------------------------------------------------------- Ebenen: Schreibtisch (vor den Beinen der Sitzenden)
var MON=[0,0], FORM=[0,0,0,0];
function layers(S,GS,tod){ var L=[];
  var dr=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), l=M.layer(dr[0]-4,dr[1]-28,dr[2]+8,dr[3]+30,dr[1]+dr[3]), w=M.lw(l);
  // Platte (hellgraues Resopal mit Holzkante), Seitenwangen aus Stahl, Blende vorn, Schubladenblock rechts
  R3.box(w,DESK.X0,DESK.X1,DESK.Y0,DESK.Y0+1.5,DESK.Z0,DESK.Z1,{top:function(x,y){ return ((x*3+y*7)%19===0)?P.s3:P.s4; },front:P.w3,left:P.w2});
  R3.box(w,DESK.X0+1,DESK.X0+3,DESK.Y0+1.5,FY,DESK.Z0+1,DESK.Z1-1,{front:P.m2,left:P.m1});
  R3.box(w,DESK.X0+3,DESK.X1-24,DESK.Y0+1.5,DESK.Y0+9,DESK.Z1-3,DESK.Z1-2,{front:P.m3});
  R3.box(w,DESK.X1-24,DESK.X1-2,DESK.Y0+1.5,FY,DESK.Z0+2,DESK.Z1-1,{front:P.m3,left:P.m2});
  var f0=rp(R3.p(DESK.X0,DESK.Y0,DESK.Z1)), f1=rp(R3.p(DESK.X1,DESK.Y0,DESK.Z1)), pd=rp(R3.p(DESK.X1-24,DESK.Y0+1.5,DESK.Z1-1)), fb=rp(R3.p(DESK.X1-2,FY,DESK.Z1-1));
  for (var i=0;i<3;i++){ var y0=pd[1]+2+rnd(i*(fb[1]-pd[1]-2)/3), y1=pd[1]+rnd((i+1)*(fb[1]-pd[1]-2)/3); w.hl(pd[0]+1,fb[0]-2,y0,P.m4); w.hl(pd[0]+1,fb[0]-2,y1,P.m1); w.rect(rnd((pd[0]+fb[0])/2)-2,y0+2,4,1,P.m1); }
  w.hl(f0[0],f1[0],f0[1],P.w4);
  var my=f0[1]-1;
  // Röhrenmonitor (beige) zu Frau Kolar gedreht, Tastatur, Telefon
  var mx=KOLAR[0]-28; w.rect(mx,my-15,14,14,P.s4); w.hl(mx,mx+13,my-15,P.s5); w.vl(mx,my-15,my-2,P.s5); w.vl(mx+13,my-15,my-2,P.s2); w.rect(mx+2,my-13,10,9,P.k2); w.rect(mx+3,my-12,8,7,P.n1); w.rect(mx+4,my-2,6,2,P.s3); MON=[mx+3,my-12];
  w.rect(mx+12,my-3,10,2,P.s5); w.hl(mx+12,mx+21,my-3,P.s6); for (var k=0;k<4;k++) w.px(mx+13+k*2,my-2,P.s3);
  var phx=f0[0]+40; w.rect(phx,my-4,9,4,P.m1); w.hl(phx,phx+8,my-4,P.m2); w.rect(phx+1,my-6,7,2,P.m0); w.hl(phx,phx+8,my-7,P.m2); w.line(phx+8,my-3,phx+12,my,P.k2);
  // Formularstapel, ein Formular obenauf (für Marko), Stempel und Stempelkissen, Ablagekorb mit Akten, Kugelschreiber
  var sx=f0[0]+4; for (k=0;k<5;k++) w.hl(sx,sx+12,my-k,(k%2)?P.s5:P.s6); w.hl(sx+1,sx+12,my-5,P.s6); w.px(sx+3,my-4,P.b1); w.hl(sx+5,sx+10,my-4,P.m3);
  var fx=f0[0]+18; w.poly([[fx,my],[fx+11,my-1],[fx+12,my+1],[fx+1,my+2]],P.s6); for (k=0;k<3;k++) w.hl(fx+2,fx+9,my-0+k*0,P.m3); w.px(fx+3,my+1,P.b1); w.line(fx+13,my,fx+17,my-1,P.b1); FORM=[fx-1,my-3,18,7];
  var stx=f0[0]+31; w.rect(stx,my-2,6,2,P.k2); w.hl(stx,stx+5,my-2,P.r1); w.rect(stx+7,my-5,3,4,P.w2); w.rect(stx+6,my-1,5,1,P.k1); w.px(stx+8,my-6,P.w3);
  var tray=f0[0]+52; w.rect(tray,my-5,12,5,P.m2); w.hl(tray,tray+11,my-5,P.m3); for (k=0;k<3;k++) w.hl(tray+1,tray+10,my-6-k,(k%2)?P.e4:P.y3);
  shade(l,l.ox,l.oy,tod); L.push(l);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Monitor flimmert, Lichtstreifen der Lamellen wandern kaum merklich, Dampf am Kocher
function dyn(fb,v,S,GS){ var t=v.t, i;
  var x0=MON[0], y0=MON[1]; for (var yy=0;yy<7;yy++) for (var xx=0;xx<8;xx++){ var c=(yy===1||yy===3)?((xx<6)?P.b2:P.n1):P.n1; if (yy===5 && xx<((Math.floor(t*2)%8))) c=P.b3; if (((yy+Math.floor(t*24))%5)===0) c=M.UP[c]; fb.px(x0+xx,y0+yy,c); }
  if (Math.floor(t*1.5)%2) fb.px(x0+6,y0+5,P.s6);
  // Lichtstreifen: sachtes Atmen (Wolken ziehen vor der Sonne)
  var a=(Math.sin(t*0.3)+1)*0.5; if (v.tod==='day') for (i=0;i<40;i++){ var px=rnd(150+hash(i,3)*120), py=rnd(100+hash(i,4)*40); if (slatAt(px,py)>0 && bayer(px,py+Math.floor(t))<0.06*a){ var k=py*fb.w+px; fb.d[k]=M.UP[fb.d[k]]; } }
  // Wasserkocher dampft ab und zu
  var ph=(t%16); if (ph<5) for (i=0;i<6;i++){ var q=((t*0.8+i*0.17)%1), sx=rnd(KET[0]-4+Math.sin(t*2+i)*1.5-q*3), sy=rnd(KET[1]-q*14); if (bayer(sx,sy)<0.8-q*0.7) fb.px(sx,sy,q<0.4?P.s6:P.s5); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<116||y>139||x<10||x>310) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false; return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var L=levels(tod), f=Math.min(1,tubeAt(a.x,a.y-24)*0.9)*(L.length-1); return L[Math.round(f)].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3]));
var DKR=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), CBR=R3.rect(CAB.X0,CAB.X1,CAB.Y0,FY,CAB.Z0,CAB.Z1);
var FRM=(function(){ var f0=rp(R3.p(DESK.X0,DESK.Y0,DESK.Z1)); return [f0[0]+17,f0[1]-4,18,7]; })();
M.defineArt('vermisst',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, actorLut:actorLut,
  spots:{
    door:DQ,
    desk:[DKR[0],DKR[1]-16,DKR[2],DKR[3]+16],
    form:FRM,
    wall:[PW.x0-2,PW.y0-2,PW.x1-PW.x0+4,PW.y1-PW.y0+4],
    poster:[PST.x0-1,PST.y0-1,PST.w+2,PST.h+2],
    cabinet:[CBR[0],CBR[1]-12,CBR[2],CBR[3]+12],
    chairs:[CH2[0]-9,CH2[1]-28,NADA[0]-CH2[0]+16,30],
    window:[WIN.x0-3,WIN.y0-3,WIN.x1-WIN.x0+6,WIN.y1-WIN.y0+6]
  },
  stands:{ door:[26,120,'L'], desk:[168,118,'B'], form:[150,118,'B'], wall:[92,116,'B'], poster:[158,116,'B'], cabinet:[262,120,'B'], chairs:[96,118,'B'], window:[222,117,'B'] },
  actorPos:{ kolar:[KOLAR[0],KOLAR[1],'L'], nada:[NADA[0],NADA[1],'R'] },
  start:[28,120,'R'], entries:{ map:[28,120,'R'] }
});
})(M);
