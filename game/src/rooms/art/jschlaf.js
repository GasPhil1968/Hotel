/* ===== rooms/art/jschlaf.js — Jasnas Schlafzimmer (320 px, Innenraum) =====
   Ein schmales Zimmer: links in der Seitenwand die Tür zur Wohnküche, an der Rückwand der Kleiderschrank mit zwei Türen und
   Kranzleiste (oben im Schrank steht die Holzkiste mit Schloss: für Mala sichtbar), daneben ein Stuhl mit dem hellblauen
   Pflegekittel über der Lehne, das Fenster mit Vorhang (draußen Schnee auf Gesimsen gegenüber), der Nachttisch mit Lampe und einem
   kleinen Hochzeitsfoto, rechts das Bett mit gehäkelter Decke aus bunten Quadraten. Ein Läufer auf den Dielen.
   Nachts (k4_d1_n) ist es dunkel, nur das Licht der Straßenlaterne fällt durch den Vorhang; im Bett schläft Jasna (S.sleeper
   === false: das Bett ist leer). Geistersicht: durch die Schranktür die Kiste mit Nachhall (blasse Schrift, Stempelformen),
   lesbar für Mala; am Bett ein ruhiger Abdruck. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
var VP=[160,54], F=100, FY=98, XL=60, XR=262, CY=12;
var R3=M.room3(VP,F,FY);
var WARD={X0:68,X1:124,Y0:20,Z1:14};                     // Kleiderschrank
var BOX={X0:80,X1:110,Y0:27,Y1:37,Z:7};                   // Kiste oben im Schrank
var CHAIR={X:134,Z:12};
var WIN={x0:146,x1:182,y0:28,y1:68};
var NIGHT={X0:188,X1:204,Y0:80,Z1:12};
var BED={X0:206,X1:258,Y0:82,Z1:52};
var DOORU=[16,40,34,98];                                  // Tür in der linken Wand: Tiefe u0..u1, Höhe
// ---------------------------------------------------------------- kleine Helfer
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
// Dunst und Nebel: nur zu kühlen Grau- und Blautönen mischen (Nebel entsättigt; keine Lavendel-, Geister- oder Hauttöne)
var HZN=null, HZW=null, HZL={}, HZWIDE=false;                 // bei klarem Wetter behält der Dunst die Farbtöne
function hazeLut(col,k){ var key=col+'_'+k+(HZWIDE?'w':''); if (HZL[key]) return HZL[key]; if (!HZN){ HZN=M.PNAME.filter(function(n){ return /^[kmnbc]/.test(n) || n==='s5' || n==='s6'; }); HZW=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); } var q=M.RGB[col], f=k/8; return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZWIDE?HZW:HZN); }
function haze(b,amt,opt){ opt=opt||{}; var col=opt.col, x0=opt.x||0, y0=opt.y||0, w=opt.w||b.w, h=opt.h||b.h, ox=b.ox||0, oy=b.oy||0;
  for (var y=Math.max(0,y0);y<Math.min(b.h,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(b.w,x0+w);x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*b.w+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x+ox,y+oy)<f-i) i++; if (i>0) b.d[k]=(i>=8)?col:hazeLut(col,i)[c]; } }
var SINT=null; function sinT(){ if (SINT) return SINT; SINT=new Float32Array(1024); for (var i=0;i<1024;i++) SINT[i]=Math.sin(i*Math.PI*2/1024); return SINT; }
function fogFront(fb,t,opt){ var y0=opt.y0||0, y1=Math.min(opt.y1||144,144), amt=opt.amt, cam=opt.cam||0, sp=opt.speed||5, L=hazeLut(opt.col,opt.k||2), S=sinT(), K=1024/(Math.PI*2);
  for (var y=y0;y<y1;y++){ var ry=(y-y0)/Math.max(1,y1-y0), band=Math.sin(ry*Math.PI)*amt; if (band<0.03) continue; var o1=(t*sp*0.05+y*0.11)*K, o2=(-t*sp*0.03+y*0.047)*K;
    for (var x=0;x<fb.w;x++){ var wx=x+cam, n=0.5+0.28*S[((wx*0.031*K+o1)|0)&1023]+0.22*S[((wx*0.012*K+o2)|0)&1023], d=band*(n*1.25-0.2); if (d>0.04 && bayer(x,y)<d){ var k=y*fb.w+x, c=fb.d[k]; if (c!==T && c<M.NCOL) fb.d[k]=L[c]; } } } }
function fwOn(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks && M.k4Fireworks(GS)); }
function hit(x,y){ var k, X, Y;
  if (x>=XL && x<=XR && y>=CY && y<=FY) return {s:'back',X:x,Y:y,Z:0};
  if (y>FY){ k=(y-VP[1])/(FY-VP[1]); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'floor',X:X,Y:FY,Z:(k-1)*F}; }
  if (y<CY){ k=(VP[1]-y)/(VP[1]-CY); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'ceil',X:X,Y:CY,Z:(k-1)*F}; }
  if (x<XL){ k=(x-VP[0])/(XL-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'left',X:XL,Y:Y,Z:(k-1)*F}; }
  if (x>XR){ k=(x-VP[0])/(XR-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'right',X:XR,Y:Y,Z:(k-1)*F}; }
  return null; }
function wallPt(sd,u,Y){ var ex=sd==='L'?XL:XR, k=1+u/F; return [VP[0]+(ex-VP[0])*k, VP[1]+(Y-VP[1])*k]; }

// ---------------------------------------------------------------- Licht: Tag durchs Fenster, nachts die Straßenlaterne durch den Vorhang
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.15+L*0.06, g*0.19+L*0.08, b*0.33+L*0.15+13]; },
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.4+L*0.24+10, g*0.4+L*0.24+12, b*0.42+L*0.24+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.36+20, g*0.5+L*0.3+10, b*0.34+L*0.14+4]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=6, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.3));
  return LV[tod]=a; }
var LAMPON=false;
function lightAt(x,y){ var cx=(WIN.x0+WIN.x1)/2, dx=(x-cx-(y-WIN.y1)*0.35)/70, dy=(y-WIN.y1-26)/60, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,1.1)*0.5:0;   // Laternenschein schräg aufs Bett und den Boden
  var wx=(x-cx)/30, wy=(y-(WIN.y0+WIN.y1)/2)/30, wd=wx*wx+wy*wy; if (wd<1) a=Math.max(a,(1-wd)*0.42);
  if (LAMPON){ var lx=(x-NLP[0])/60, ly=(y-NLP[1]-10)/50, ld=lx*lx+ly*ly; if (ld<1) a=Math.max(a,Math.pow(1-ld,0.9)*0.9); }
  return a>1?1:a; }
function shadeTOD(b,ox,oy,tod,mask){ var L=levels(tod), n=L.length; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var f=lightAt(X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Flächen: Tapete mit kleinem Blumenmuster, Dielen
function wallTex(u,v,x,y,sd){ if (v>FY-3) return (v>FY-1.5)?P.w0:P.w2; var c=ra(R('v3 v4 s5'),0.55+(fbm(u*0.05,v*0.05,sd)-0.5)*0.25,x,y);
  var mu=((u%12)+12)%12, mv=((v+((Math.floor(u/12)%2)*6))%12+12)%12; if (Math.abs(mu-6)+Math.abs(mv-6)<1.5) c=P.s6; else if (Math.abs(mu-6)+Math.abs(mv-6)<2.5 && bayer(x,y)<0.5) c=P.v3; if (v<CY+3) c=P.s5; return c; }
function sideTex(u,v,x,y,sd){ if (v>FY-3) return (v>FY-1.5)?P.w0:P.w1; var c=ra(R('v2 v3 v4'),0.55+(fbm(u*0.05,v*0.05,sd)-0.5)*0.25,x,y); var mu=((u%12)+12)%12, mv=((v+((Math.floor(u/12)%2)*6))%12+12)%12; if (Math.abs(mu-6)+Math.abs(mv-6)<1.2 && bayer(x,y)<0.6) c=P.v4; if (v<CY+3) c=P.s4; return c; }
function surf(h,x,y){ if (h.s==='back') return wallTex(h.X,h.Y,x,y,0); if (h.s==='left') return sideTex(h.Z*1.5,h.Y,x,y,7); if (h.s==='right') return sideTex(h.Z*1.5+300,h.Y,x,y,11);
  if (h.s==='floor') return M.tex.planks(h.X,y,VP[1],FY,R('w1 w2 w3 w3'),11); if (h.s==='ceil') return P.s5; return P.k0; }

// ---------------------------------------------------------------- Dinge
function wardrobe(b){ var w=WARD, x, y;
  R3.box(b,w.X0,w.X1,w.Y0,FY,0,w.Z1,{front:P.w3,left:P.w2,top:P.w4});
  var f0=rp(R3.p(w.X0,w.Y0,w.Z1)), f1=rp(R3.p(w.X1,FY,w.Z1)), mx=rd((f0[0]+f1[0])/2);
  WFR=[f0[0],f0[1],f1[0]-f0[0],f1[1]-f0[1]];
  // Kranzleiste, Sockel, zwei Türen mit Kassetten, Schlüssel
  b.rect(f0[0]-2,f0[1]-3,f1[0]-f0[0]+4,4,P.w4); b.hl(f0[0]-2,f1[0]+1,f0[1]-3,P.w5); b.hl(f0[0]-2,f1[0]+1,f0[1],P.w1);
  b.rect(f0[0],f1[1]-6,f1[0]-f0[0],6,P.w1); b.hl(f0[0],f1[0]-1,f1[1]-6,P.w2);
  b.vl(mx,f0[1]+1,f1[1]-7,P.w0); b.vl(mx+1,f0[1]+1,f1[1]-7,P.w4);
  [[f0[0]+4,mx-4],[mx+5,f1[0]-4]].forEach(function(q){ b.rect(q[0],f0[1]+6,q[1]-q[0],22,P.w2); b.hl(q[0],q[1]-1,f0[1]+6,P.w1); b.vl(q[1]-1,f0[1]+6,f0[1]+27,P.w4); b.rect(q[0],f0[1]+34,q[1]-q[0],f1[1]-f0[1]-46,P.w2); b.hl(q[0],q[1]-1,f0[1]+34,P.w1); b.vl(q[1]-1,f0[1]+34,f1[1]-13,P.w4); });
  b.rect(mx-3,f0[1]+40,2,4,P.y3); b.px(mx-3,f0[1]+40,P.y5); b.rect(mx+3,f0[1]+40,2,4,P.y3);
  // auf dem Schrank: ein Koffer
  var s0=rp(R3.p(w.X0+8,w.Y0,3)), s1=rp(R3.p(w.X0+38,w.Y0,11)); b.rect(s0[0],s0[1]-8,s1[0]-s0[0],8,P.c1); b.hl(s0[0],s1[0]-1,s0[1]-8,P.c2); b.rect(s0[0]+10,s0[1]-10,8,2,P.k2); }
var WFR=[0,0,0,0];
function chair(b,S){ var c=rp(R3.p(CHAIR.X,FY,CHAIR.Z)), x=c[0], y=c[1];
  b.rect(x-7,y-14,15,3,P.w3); b.hl(x-7,x+7,y-14,P.w4); b.vl(x-6,y-11,y-1,P.w1); b.vl(x+6,y-11,y-1,P.w1); b.vl(x-4,y-12,y-3,P.w0); b.vl(x+4,y-12,y-3,P.w0);
  b.rect(x-7,y-34,2,21,P.w2); b.rect(x+6,y-34,2,21,P.w2); b.hl(x-7,x+7,y-34,P.w3); b.hl(x-7,x+7,y-28,P.w2);
  // hellblauer Pflegekittel über der Lehne, mit Namensschild
  b.poly([[x-9,y-34],[x+9,y-34],[x+10,y-18],[x+6,y-12],[x-6,y-12],[x-10,y-18]],function(xx,yy){ return (xx<x-4)?P.b4:((xx>x+5)?P.b2:P.b3); }); b.hl(x-9,x+9,y-34,P.b5);
  b.rect(x-4,y-30,5,2,P.s6); b.vl(x,y-34,y-14,P.b2); b.rect(x+2,y-24,4,4,P.b2); CHR=[x-11,y-36,23,37]; }
var CHR=[0,0,0,0];
function view(b,tod,we){ var w=WIN, x, y, night=tod!=='day';
  var sky=night?P.n0:(we==='fog'?P.m4:(we==='thaw'?P.m3:(we==='snow'?P.s4:P.b4)));
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var c;
    if (y<w.y0+8) c=sky; else if (y<w.y0+10) c=night?P.n2:P.s6;
    else { var fy=(y-w.y0-10)%17, fx=(x-w.x0+5)%13; c=ra(R('t3 t4 e4 s4'),0.5+(fbm(x*0.2,y*0.2,6)-0.5)*0.3,x,y); if (fy===0) c=night?P.n2:P.s5; if (fy===1) c=P.t2;
      if (fy>=4 && fy<14 && fx>=3 && fx<10){ c=(fy===4)?P.k2:P.n0; WL.push([x,y,Math.floor((y-w.y0-10)/17)*5+Math.floor((x-w.x0+5)/13)]); } if (fy===14 && fx>=2 && fx<11) c=night?P.n2:P.s6; }
    b.px(x,y,c); }
  if (we==='fog') haze(b,function(){ return night?0.3:0.45; },{col:night?P.m1:P.m4,x:w.x0,y:w.y0,w:w.x1-w.x0,h:w.y1-w.y0}); }
var WL=[];
function windowFrame(b){ var w=WIN, x, y, mx=rd((w.x0+w.x1)/2);
  b.rect(w.x0-1,w.y0-1,w.x1-w.x0+2,2,P.s5); b.rect(w.x0-1,w.y1-1,w.x1-w.x0+2,2,P.s4); b.rect(w.x0-1,w.y0,2,w.y1-w.y0,P.s5); b.rect(w.x1-1,w.y0,2,w.y1-w.y0,P.s4); b.rect(mx-1,w.y0,2,w.y1-w.y0,P.s5); b.hl(w.x0,w.x1-1,w.y0+15,P.s5);
  // Vorhang: Stange, zwei Bahnen mit Falten, Gardine
  b.hl(w.x0-12,w.x1+11,w.y0-6,P.w1); b.px(w.x0-13,w.y0-6,P.w3); b.px(w.x1+12,w.y0-6,P.w3);
  for (y=w.y0-5;y<w.y1+10;y++){ var sw=Math.sin(y*0.12)*1.2; for (x=w.x0-12;x<w.x0+3+rd(sw);x++){ var f=(x-(w.x0-12))%4; b.px(x,y,f===0?P.r1:(f===3?P.r3:P.r2)); } for (x=w.x1-3+rd(sw);x<w.x1+12;x++){ var f2=(x-(w.x1-3))%4; b.px(x,y,f2===0?P.r1:(f2===3?P.r3:P.r2)); } }
  for (y=w.y0;y<w.y0+30;y++) for (x=w.x0+2;x<w.x1-2;x++) if (bayer(x,y)<0.2 && (x+y)%3===0) b.px(x,y,P.s6);
  R3.box(b,w.x0-6,w.x1+6,w.y1+1,w.y1+3,0,5,{top:P.s6,front:P.s4}); }
var NLP=[0,0];
function nightstand(b){ var n=NIGHT; R3.box(b,n.X0,n.X1,n.Y0,FY,0,n.Z1,{front:P.w2,top:P.w3,left:P.w1});
  var f0=rp(R3.p(n.X0,n.Y0,n.Z1)), f1=rp(R3.p(n.X1,FY,n.Z1)); b.hl(f0[0]+1,f1[0]-2,f0[1]+6,P.w1); b.px(rd((f0[0]+f1[0])/2),f0[1]+3,P.y3);
  var t=rp(R3.p(n.X0+5,n.Y0,6)); b.rect(t[0]-1,t[1]-8,3,8,P.e3); b.rect(t[0]-2,t[1]-1,5,1,P.e2); b.poly([[t[0]-5,t[1]-8],[t[0]+5,t[1]-8],[t[0]+3,t[1]-15],[t[0]-3,t[1]-15]],P.e4); b.hl(t[0]-5,t[0]+5,t[1]-8,P.e2); NLP=[t[0],t[1]-11];
  var p=rp(R3.p(n.X1-5,n.Y0,5)); b.rect(p[0]-3,p[1]-6,6,6,P.y2); b.rect(p[0]-2,p[1]-5,4,4,P.s4); b.px(p[0]-1,p[1]-4,P.k2); b.px(p[0]+1,p[1]-4,P.s6); b.px(p[0]-1,p[1]-3,P.k2); b.px(p[0]+1,p[1]-3,P.s6); M.tintApply(b,M.TINT.memory,p[0]-2,p[1]-5,4,4); }
function granny(X,Z){ var s=6, i=Math.floor(X/s), j=Math.floor(Z/s), u=X-i*s, v=Z-j*s, e=Math.min(u,v,s-u,s-v); var cols=[P.r3,P.y4,P.g3,P.b3,P.d4,P.a4,P.t4];
  if (e<0.7) return P.w0; if (e<1.6) return P.s5; var cc=cols[Math.floor(hash(i,j)*cols.length)]; return (e<2.4)?M.DN[cc]:cc; }
function bed(b,S,tod){ var B=BED, x, y, sleeper=(tod==='night' && S.sleeper!==false);
  // Kopfteil an der Wand
  R3.box(b,B.X0-1,B.X1+1,B.Y0-16,FY,0,2,{front:P.w2,top:P.w3,left:P.w1}); var hb=rp(R3.p(B.X0+4,B.Y0-13,2)), hb2=rp(R3.p(B.X1-4,B.Y0-13,2)); b.hl(hb[0],hb2[0],hb[1]+3,P.w1); b.hl(hb[0],hb2[0],hb[1]+4,P.w3);
  // Bettgestell, darauf Matratze mit der gehäkelten Decke (oben, vorn und seitlich hängt sie herab)
  R3.box(b,B.X0,B.X1,B.Y0+8,FY,0,B.Z1,{left:P.w1,front:P.w2});
  R3.box(b,B.X0-1,B.X1+1,B.Y0,B.Y0+8,2,B.Z1+1,{top:function(xx,yy){ var k=(yy-VP[1])/(B.Y0-VP[1]); if (k<=0) return P.s5; var X=VP[0]+(xx-VP[0])/k, Z=(k-1)*F; return granny(X-B.X0,Z); },
    left:function(xx,yy){ return granny(yy*1.3,xx*0.8+40); },front:function(xx,yy){ return granny(xx*0.66,yy*1.2+90); }});
  var fe=rp(R3.p(B.X0-1,B.Y0+8,B.Z1+1)), fe2=rp(R3.p(B.X1+1,B.Y0+8,B.Z1+1)); for (x=fe[0];x<=fe2[0];x++) if ((x>>1)&1) b.px(x,fe[1],P.s5);   // Fransen
  var pl=rp(R3.p((B.X0+B.X1)/2,B.Y0,7)); b.ellipse(pl[0],pl[1]-1,15,3.2,P.s6); b.hl(pl[0]-13,pl[0]+13,pl[1]+2,P.s4);
  if (sleeper){ var hd=rp(R3.p((B.X0+B.X1)/2-4,B.Y0-2,8)); b.ellipse(hd[0],hd[1]-1,4,2.6,P.h2); b.px(hd[0]-2,hd[1]-2,P.h3); b.px(hd[0]+3,hd[1],P.p2);   // Jasnas Haar auf dem Kissen
    for (var X=B.X0+8;X<B.X1-8;X+=0.5) for (var Z=14;Z<46;Z+=0.6){ var hump=Math.sin((X-B.X0-8)/(B.X1-B.X0-16)*Math.PI)*Math.sin((Z-14)/32*Math.PI); if (hump<0.25) continue; var q=R3.p(X,B.Y0-hump*4,Z); b.px(rd(q[0]),rd(q[1]),hump>0.85?M.UP[granny(X-B.X0,Z+2)]:granny(X-B.X0,Z+2)); } }
  BR=R3.rect(B.X0-1,B.X1+1,B.Y0-16,FY,0,B.Z1+1); }
var BR=[0,0,0,0];
function door(b){ var u0=DOORU[0], u1=DOORU[1], yT=DOORU[2], yB=FY;
  var q=[wallPt('L',u0,yT),wallPt('L',u1,yT),wallPt('L',u1,yB),wallPt('L',u0,yB)].map(rp);
  b.poly([rp(wallPt('L',u0-2,yT-3)),rp(wallPt('L',u1+2,yT-3)),rp(wallPt('L',u1+2,yB)),rp(wallPt('L',u0-2,yB))],P.s4);
  b.poly(q,function(xx,yy){ var k=(xx-VP[0])/(XL-VP[0]), Y=VP[1]+(yy-VP[1])/k, u=(k-1)*F, fu=(u-u0)/(u1-u0), fv=(Y-yT)/(yB-yT); if ((fu>0.15&&fu<0.85)&&((fv>0.1&&fv<0.42)||(fv>0.52&&fv<0.9))) return P.s4; return P.s5; });
  var kn=rp(wallPt('L',u1-4,yT+30)); b.rect(kn[0],kn[1],2,2,P.y3); DOORQ=q; }
var DOORQ=[];

// ---------------------------------------------------------------- Bild
var BASE=null, WE='snowlie';
function inWin(x,y){ return x>=WIN.x0&&x<WIN.x1&&y>=WIN.y0&&y<WIN.y1; }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), we=weaOf(GS), dark=tod!=='day', x, y; WE=we; HZWIDE=(we==='snowlie'||we==='sun'||we==='frost'); WL=[]; LAMPON=!!S.lamp;
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=hit(x,y); if (h) b.px(x,y,surf(h,x,y)); }
  b.line(XL,CY,XL,FY,P.v2); b.line(XR,CY,XR,FY,P.v2);
  door(b); wardrobe(b); view(b,tod,we); windowFrame(b); nightstand(b); chair(b,S);
  // Läufer vor dem Bett
  b.poly([rp(R3.p(150,FY,30)),rp(R3.p(200,FY,30)),rp(R3.p(200,FY,58)),rp(R3.p(150,FY,58))],function(xx,yy){ var f=R3.floor(xx,yy); if (!f) return P.e3; var u=(f.X-150)/50, v=(f.Z-30)/28, e=Math.min(u,1-u,v,1-v); if (e<0.06) return P.e1; return ((Math.floor(f.Z/3))%2)?P.e3:P.e4; });
  bed(b,S,tod);
  // Bild über dem Bett: Landschaft
  var p0=rp(R3.p(214,40,0)); b.rect(p0[0],p0[1],30,16,P.w2); b.rect(p0[0]+2,p0[1]+2,26,12,P.b4); b.rect(p0[0]+2,p0[1]+9,26,5,P.g3); b.poly([[p0[0]+4,p0[1]+10],[p0[0]+12,p0[1]+4],[p0[0]+20,p0[1]+10]],P.m3); b.px(p0[0]+12,p0[1]+4,P.s6);
  var notWin=function(xx,yy){ return !inWin(xx,yy); };
  if (!dark){ var br=(we==='sun'||we==='snowlie'||we==='frost')?0.7:0.45; M.light(b,M.lf.sum(M.lf.pool((WIN.x0+WIN.x1)/2,112,120,34,br),M.lf.pool((WIN.x0+WIN.x1)/2,52,80,50,0.35),M.lf.vignette(W,H,2.0),M.lf.k(we==='thaw'||we==='fog'?-0.4:-0.15)),0,0,notWin);
    BASE=b.clone(); return b; }
  M.light(b,M.lf.vignette(W,H,1.4),0,0,notWin);
  BASE=b.clone(); shadeTOD(b,0,0,tod,notWin);
  WL.forEach(function(q){ if (hash(q[2],7)<0.35) b.px(q[0],q[1],(q[1]%2)?P.y3:P.y2); });
  if (LAMPON){ b.poly([[NLP[0]-5,NLP[1]+3],[NLP[0]+5,NLP[1]+3],[NLP[0]+3,NLP[1]-4],[NLP[0]-3,NLP[1]-4]],P.y4); }
  return b; }

// ---------------------------------------------------------------- jedes Bild: Schnee vor dem Fenster, Feuerwerk färbt den Himmel
function dyn(fb,v,S,GS){ var t=v.t, we=WE;
  if (we==='snow') M.snow(fb,t,{n:24,mask:function(x,y){ return inWin(x,y); },col:P.s6,col2:P.s5,wind:5});
  if (fwOn(S,GS)){ var ph=t%3.1, k=Math.floor(t/3.1); if (ph<0.3){ var cols=[P.y4,P.r3,P.b3,P.g4], fc=cols[Math.floor(hash(k,3)*cols.length)]; for (var y=WIN.y0;y<WIN.y0+8;y++) for (var x=WIN.x0;x<WIN.x1;x++) if (bayer(x,y)<0.5-ph) fb.px(x,y,fc); } } }
// Geistersicht: die Kiste durch die Schranktür, umgeben von Nachhall; am Bett ein ruhiger Abdruck
function ghost(fb,v,S,GS){ var t=v.t, x, y, B=BOX;
  function gp(X,Y,c,a){ if (X<0||X>=320||Y<0||Y>=144) return; if (a!==undefined && bayer(X,Y+Math.floor(t*2))>a) return; fb.d[Y*320+X]=c; }
  var a0=rp(R3.p(B.X0,B.Y0,B.Z)), a1=rp(R3.p(B.X1,B.Y1,B.Z)), al=0.85+0.1*Math.sin(t*0.8);
  // Kiste: Deckel, Front, Beschlag, Schloss
  for (x=a0[0];x<=a1[0];x++){ gp(x,a0[1],P.x5,al); gp(x,a0[1]+3,P.x4,al); gp(x,a1[1],P.x4,al); }
  for (y=a0[1];y<=a1[1];y++){ gp(a0[0],y,P.x5,al); gp(a1[0],y,P.x4,al); for (x=a0[0]+1;x<a1[0];x++) if (bayer(x,y)<0.22) gp(x,y,P.x2); }
  for (y=a0[1]+1;y<a1[1];y++){ gp(a0[0]+4,y,P.x3,al); gp(a1[0]-4,y,P.x3,al); }
  var lx=rd((a0[0]+a1[0])/2); gp(lx,a0[1]+4,P.x6); gp(lx-1,a0[1]+5,P.x5); gp(lx+1,a0[1]+5,P.x5); gp(lx,a0[1]+6,P.x6); gp(lx,a0[1]+7,P.x5);
  // Nachhall: blasse Schriftzeilen und Stempelformen, die um die Kiste treiben
  for (var i=0;i<9;i++){ var ph=(t*0.12+i/9)%1, ox=a0[0]-14+Math.floor(hash(i,5)*(a1[0]-a0[0]+28)), oy=a0[1]-10+Math.floor(hash(i,6)*26)-rd(ph*6), fa=Math.sin(ph*Math.PI)*0.7;
    if (i%3===2){ var r=3+Math.floor(hash(i,7)*2); for (var q=0;q<14;q++){ var an=q/14*Math.PI*2; gp(ox+rd(Math.cos(an)*r),oy+rd(Math.sin(an)*r*0.8),P.v4,fa); } gp(ox,oy,P.v3,fa); }   // runder Stempel
    else if (i%3===1){ for (var qx=0;qx<8;qx++){ gp(ox+qx,oy,P.v3,fa); gp(ox+qx,oy+4,P.v3,fa); } gp(ox,oy+1,P.v3,fa); gp(ox,oy+2,P.v3,fa); gp(ox,oy+3,P.v3,fa); gp(ox+7,oy+1,P.v3,fa); gp(ox+7,oy+2,P.v3,fa); gp(ox+7,oy+3,P.v3,fa); }   // eckiger Stempel
    else { var L=6+Math.floor(hash(i,8)*8); for (var qq=0;qq<L;qq++) if (hash(qq,i)<0.75) gp(ox+qq,oy+(qq%3===0?1:0),P.x4,fa); } }                    // Schriftzeile
  // ruhiger Abdruck am Bett (Kissen, eine Schulter)
  var pl=rp(R3.p((BED.X0+BED.X1)/2-4,BED.Y0,10)); for (y=pl[1]-3;y<pl[1]+6;y++) for (x=pl[0]-10;x<pl[0]+12;x++){ var d=Math.pow((x-pl[0])/11,2)+Math.pow((y-pl[1]-1)/4.5,2); if (d<1 && d>0.55 && bayer(x,y+Math.floor(t))<0.55) gp(x,y,P.x3); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>138||x<20||x>300) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<XL+3||f.X>XR-3) return false; if (f.X>BED.X0-5 && f.Z<BED.Z1+6) return false; return true; }
var NR=R3.rect(NIGHT.X0,NIGHT.X1,NIGHT.Y0-16,FY,0,NIGHT.Z1);
var DR=(function(){ var q=[wallPt('L',DOORU[0]-2,DOORU[2]-3),wallPt('L',DOORU[1]+2,FY)]; var x0=Math.floor(Math.min(q[0][0],q[1][0])), y0=Math.floor(q[0][1]); return [Math.max(0,x0),y0,Math.ceil(Math.max(q[0][0],q[1][0]))-Math.max(0,x0),Math.ceil(q[1][1])-y0]; })();
var WR3=R3.rect(WARD.X0,WARD.X1,WARD.Y0-4,FY,0,WARD.Z1);
var BX=(function(){ var a=R3.p(BOX.X0-2,BOX.Y0-3,WARD.Z1), c=R3.p(BOX.X1+2,BOX.Y1+3,WARD.Z1); return [rd(a[0]),rd(a[1]),rd(c[0])-rd(a[0]),rd(c[1])-rd(a[1])]; })();
M.defineArt('jschlaf',{
  width:W, paint:paint, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; var L=levels(tod); return L[Math.max(0,Math.min(L.length-1,Math.round(lightAt(a.x,a.y-22)*(L.length-1))))].a; },
  spots:{
    door:DR,
    wardrobe:[WR3[0],WR3[1],WR3[2],WR3[3]],
    box:BX,
    bed:(function(){ var r=R3.rect(BED.X0-1,BED.X1+1,BED.Y0-14,FY,0,BED.Z1+2); return [r[0],r[1],Math.min(r[2],W-r[0]),r[3]]; })(),
    nightstand:[NR[0]-2,NR[1],NR[2]+4,NR[3]],
    smock:(function(){ var c=R3.p(CHAIR.X,FY,CHAIR.Z); return [rd(c[0])-11,rd(c[1])-36,23,26]; })(),
    window:[WIN.x0-12,WIN.y0-6,WIN.x1-WIN.x0+24,WIN.y1-WIN.y0+10]
  },
  stands:{ door:[36,118,'L'], wardrobe:[96,116,'B'], box:[96,116,'B'], bed:[196,124,'R'], nightstand:[190,116,'B'], smock:[138,116,'B'], window:[164,115,'B'] },
  actorPos:{ mala:[0,0,'L'] },
  start:[44,118,'R'], entries:{ jwohnung:[44,118,'R'] }
});
(function(){ var A=M.ART.jschlaf, m=R3.st(WARD.X1+8,34,'L'); A.actorPos.mala=[m[0],m[1],'L']; })();
})(M);
