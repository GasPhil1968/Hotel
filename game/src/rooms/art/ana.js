/* ===== rooms/art/ana.js — Anas Wohnung in Giesing: Wohnküche einer Familie (480 px, scrollend) =====
   Links die Wohnungstür, daneben die Garderobe mit Mänteln (Jasnas dunkelblauer Wollmantel; S.coatGone: nur der leere Bügel),
   Kinderschneeanzüge und Stiefel. Die Fotowand mit vielen Rahmen, darunter ein Sideboard mit dem Schuhkarton. Die Balkontür mit
   Fenster: draußen das Balkongitter mit Schnee und die Dächer von Giesing mit Kaminen, bei Silvester Feuerwerk über den Dächern
   (M.k4Fireworks(GS) oder S.fireworks). Der Tannenbaum mit Lichterkette und Strohsternen (S.eve: Geschenke darunter), in der
   Ecke die Holzeisenbahn, der große Holztisch mit Stühlen (S.eve: gedeckt; S.silvester: Raclette und Luftschlangen), die
   Küchenzeile und der Kühlschrank mit Kinderzeichnungen. Keine Kerzen: die Lichterkette reicht.
   Geistersicht: in k4_fin_n an der Tür eine Spur von Zahlen in Geisterschrift, „1 2 3 …“ – Jasnas Zählen. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144;
var VP=[240,54], F=110, FY=100, XL=6, XR=474, CY=10;
var R3=M.room3(VP,F,FY);
var DOOR={x0:12,x1:40,y0:42};
var COAT={x0:46,x1:90,y0:32};
var PHOTOS={x0:96,x1:152,y0:24,y1:62}, SIDE={X0:98,X1:150,Y0:76,Z1:12};
var BDOOR={x0:158,x1:182,y0:30}, WIN={x0:188,x1:232,y0:28,y1:72};
var TREE={X:256,Z:14,h:66};
var TOYS={X0:282,X1:318,Z0:12,Z1:34};
var TBL={X0:322,X1:380,Y0:80,Z0:24,Z1:46};
var KIT={X0:398,X1:446,Y0:78,Z1:14}, FRIDGE={X0:448,X1:472,Y0:26,Z1:16};
var LAMP={X:351,Z:35,len:18};
// ---------------------------------------------------------------- kleine Helfer
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
// Dunst und Nebel: nur zu Landschaftsfarben mischen (keine Lavendel-, Geister- oder Hauttöne)
var HZN=null, HZL={};
function hazeLut(col,k){ var key=col+'_'+k; if (HZL[key]) return HZL[key]; if (!HZN) HZN=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); var q=M.RGB[col], f=k/8; return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZN); }
function haze(b,amt,opt){ opt=opt||{}; var col=opt.col, x0=opt.x||0, y0=opt.y||0, w=opt.w||b.w, h=opt.h||b.h, ox=b.ox||0, oy=b.oy||0;
  for (var y=Math.max(0,y0);y<Math.min(b.h,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(b.w,x0+w);x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*b.w+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x+ox,y+oy)<f-i) i++; if (i>0) b.d[k]=(i>=8)?col:hazeLut(col,i)[c]; } }
function fogFront(fb,t,opt){ var y0=opt.y0||0, y1=Math.min(opt.y1||144,144), amt=opt.amt, cam=opt.cam||0, sp=opt.speed||5, L=hazeLut(opt.col,opt.k||2);
  for (var y=y0;y<y1;y++){ var ry=(y-y0)/Math.max(1,y1-y0), band=Math.sin(ry*Math.PI)*amt; if (band<0.03) continue;
    for (var x=0;x<fb.w;x++){ var wx=x+cam, n=0.5+0.28*Math.sin(wx*0.031+t*sp*0.05+y*0.11)+0.22*Math.sin(wx*0.012-t*sp*0.03+y*0.047), d=band*(n*1.25-0.2); if (d>0.04 && bayer(x,y)<d){ var k=y*fb.w+x, c=fb.d[k]; if (c!==T && c<M.NCOL) fb.d[k]=L[c]; } } } }
function fwOn(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks && M.k4Fireworks(GS)); }
function hit(x,y){ var k, X, Y;
  if (x>=XL && x<=XR && y>=CY && y<=FY) return {s:'back',X:x,Y:y,Z:0};
  if (y>FY){ k=(y-VP[1])/(FY-VP[1]); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'floor',X:X,Y:FY,Z:(k-1)*F}; }
  if (y<CY){ k=(VP[1]-y)/(VP[1]-CY); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'ceil',X:X,Y:CY,Z:(k-1)*F}; }
  if (x<XL){ k=(x-VP[0])/(XL-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'left',X:XL,Y:Y,Z:(k-1)*F}; }
  if (x>XR){ k=(x-VP[0])/(XR-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'right',X:XR,Y:Y,Z:(k-1)*F}; }
  return null; }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.4+L*0.24+10, g*0.4+L*0.24+12, b*0.42+L*0.24+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2));
  return LV[tod]=a; }
var LP=null; function lampPos(){ if (LP) return LP; var top=R3.p(LAMP.X,CY,LAMP.Z); LP=[rd(top[0]),Math.max(0,rd(top[1])),Math.max(0,rd(top[1]))+LAMP.len]; return LP; }
var TRP=null; function treePos(){ if (TRP) return TRP; TRP=rp(R3.p(TREE.X,FY,TREE.Z)); return TRP; }
function lightAt(x,y){ var lp=lampPos(), dx=(x-lp[0])/170, dy=(y-lp[2]-34)/96, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,0.9)*0.95:0; var g=Math.hypot((x-lp[0])/24,(y-lp[2])/14); if (g<1) a=Math.max(a,1-g*0.35);
  var tp=treePos(), tx=(x-tp[0])/64, ty=(y-tp[1]+30)/56, td=tx*tx+ty*ty; if (td<1) a=Math.max(a,Math.pow(1-td,1.1)*0.6);
  var kx=(x-420)/50, ky=(y-80)/40, kd=kx*kx+ky*ky; if (kd<1) a=Math.max(a,(1-kd)*0.55);          // Licht unter den Hängeschränken
  var hx=(x-70)/90, hy=(y-64)/70, hd=hx*hx+hy*hy; if (hd<1) a=Math.max(a,(1-hd)*0.55);                  // Wandleuchte über der Fotowand
  return a>1?1:a; }
function shadeTOD(b,ox,oy,tod,mask){ var L=levels(tod), n=L.length; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var f=lightAt(X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Flächen: warmes Gelb, Küche mit Fliesen, Eichenparkett
function wallTex(u,v,x,y,sd){ if (v>FY-3) return (v>FY-1.5)?P.w0:P.w2; var c=ra(R('e3 e4 y4 s5'),0.5+(fbm(u*0.04,v*0.05,sd)-0.5)*0.3,x,y); if (v<CY+3) c=P.s5; return c; }
function surf(h,x,y){ if (h.s==='back') return wallTex(h.X,h.Y,x,y,0); if (h.s==='left') return M.DN[wallTex(h.Z*1.4,h.Y,x,y,7)]; if (h.s==='right') return M.DN[wallTex(h.Z*1.4+300,h.Y,x,y,11)];
  if (h.s==='floor') return M.tex.planks(h.X,y,VP[1],FY,R('w2 w3 w4 w4'),10); if (h.s==='ceil') return P.s5; return P.k0; }

// ---------------------------------------------------------------- Tür, Garderobe, Fotowand, Sideboard mit Schuhkarton
function hall(b,S){ var d=DOOR, w=d.x1-d.x0, x, y;
  M.prop.door(b,d.x0,d.y0,w,FY-d.y0,{ramp:R('s3 s4 s5 s6 l1'),frame:R('s3 s4 s5 s6'),knob:'R'}); b.px(d.x0+w/2,d.y0+14,P.k1);
  b.rect(d.x0+8,d.y0+20,12,9,P.y2); b.rect(d.x0+9,d.y0+21,10,7,P.s6); b.px(d.x0+11,d.y0+23,P.r3); b.px(d.x0+15,d.y0+24,P.b3); b.hl(d.x0+10,d.x0+17,d.y0+26,P.g3);   // Kinderbild an der Tür
  var m0=rp(R3.p(d.x0+2,FY,3)), m1=rp(R3.p(d.x1+4,FY,12)); for (y=m0[1];y<m1[1];y++) for (x=m0[0];x<m1[0];x++) b.px(x,y,((x+y)&1)?P.e1:P.e2);
  // Garderobe: Hakenleiste, Mäntel, Kinderanzüge, Mützen, Stiefel
  var c=COAT; b.rect(c.x0,c.y0,c.x1-c.x0,3,P.w2); b.hl(c.x0,c.x1-1,c.y0,P.w4); for (x=c.x0+3;x<c.x1;x+=7) b.px(x,c.y0+3,P.m3);
  b.rect(c.x0+2,c.y0+4,9,36,P.g2); b.vl(c.x0+2,c.y0+4,c.y0+39,P.g3); b.rect(c.x0+3,c.y0+4,7,4,P.g1);                                  // Anas grüner Parka
  if (!S.coatGone){ b.rect(c.x0+12,c.y0+4,9,42,P.c1); b.vl(c.x0+12,c.y0+4,c.y0+45,P.c2); b.vl(c.x0+20,c.y0+6,c.y0+45,P.c0); b.rect(c.x0+13,c.y0+4,7,3,P.c0); b.rect(c.x0+14,c.y0+8,5,3,P.m2); }   // Jasnas Mantel, grauer Schal
  else { b.line(c.x0+12,c.y0+8,c.x0+16,c.y0+5,P.w3); b.line(c.x0+16,c.y0+5,c.x0+20,c.y0+8,P.w3); b.hl(c.x0+12,c.x0+20,c.y0+8,P.w3); }   // nur der leere Bügel
  b.rect(c.x0+22,c.y0+4,8,30,P.c2); b.vl(c.x0+22,c.y0+4,c.y0+33,P.c3);                                                          // Tobias' Jacke
  b.rect(c.x0+31,c.y0+4,6,16,P.v2); b.rect(c.x0+31,c.y0+20,3,7,P.v2); b.rect(c.x0+35,c.y0+20,2,7,P.v1); b.ellipse(c.x0+34,c.y0+2,2.5,2,P.v3);   // Mias Schneeanzug, Bommelmütze
  b.rect(c.x0+38,c.y0+4,5,12,P.r2); b.rect(c.x0+38,c.y0+16,2,5,P.r2); b.rect(c.x0+41,c.y0+16,2,5,P.r1);                                // Nikos Schneeanzug
  var s0=rp(R3.p(c.x0,FY,4)); b.rect(s0[0]+2,s0[1]-6,4,6,P.k2); b.rect(s0[0]+7,s0[1]-6,4,6,P.w0); b.rect(s0[0]+14,s0[1]-4,3,4,P.v2); b.rect(s0[0]+18,s0[1]-4,3,4,P.r2); b.rect(s0[0]+24,s0[1]-5,5,5,P.g1); }
var SHOEBOX=[0,0,0,0];
function photos(b){ var p=PHOTOS, r=M.rng(5); var fr=[[0,0,14,11],[16,2,10,13],[28,0,16,11],[46,3,10,9],[2,14,10,12],[14,17,16,12],[32,13,12,14],[46,14,10,12],[6,28,14,10],[22,31,12,8],[38,29,16,10]];
  fr.forEach(function(f,i){ var x=p.x0+f[0], y=p.y0+f[1], w=f[2], h=f[3], fc=[P.w1,P.s6,P.k2,P.w3][i%4]; b.rect(x,y,w,h,fc); b.rect(x+1,y+1,w-2,h-2,P.s6); var ix=x+2, iy=y+2, iw=w-4, ih=h-4;
    for (var yy=iy;yy<iy+ih;yy++) for (var xx=ix;xx<ix+iw;xx++) b.px(xx,yy,(yy<iy+ih*0.45)?[P.b4,P.s4,P.a5,P.b3][i%4]:[P.g3,P.e3,P.s3,P.y3][i%4]);
    if (i%3===0){ b.rect(ix+1,iy+ih-5,2,4,P.r3); b.px(ix+1,iy+ih-6,P.p3); } if (i%3===1){ b.rect(ix+iw-4,iy+ih-6,2,5,P.c2); b.px(ix+iw-4,iy+ih-7,P.p3); b.rect(ix+iw-2,iy+ih-4,2,3,P.v3); } });
  // Sideboard mit Schuhkarton
  var s=SIDE; R3.box(b,s.X0,s.X1,s.Y0,FY,0,s.Z1,{front:P.w3,top:P.w4,left:P.w2,right:P.w2}); var f0=rp(R3.p(s.X0,s.Y0,s.Z1)), f1=rp(R3.p(s.X1,FY,s.Z1)); b.vl(rd((f0[0]+f1[0])/2),f0[1]+2,f1[1]-2,P.w1); b.px(rd((f0[0]+f1[0])/2)-3,f0[1]+8,P.y3); b.px(rd((f0[0]+f1[0])/2)+3,f0[1]+8,P.y3);
  var sb=rp(R3.p(s.X0+18,s.Y0,6)); SHOEBOX=[sb[0]-1,sb[1]-9,22,10]; b.rect(sb[0],sb[1]-7,20,7,P.e4); b.rect(sb[0]-1,sb[1]-9,22,3,P.s6); b.hl(sb[0]-1,sb[0]+20,sb[1]-9,P.l1); b.hl(sb[0],sb[0]+19,sb[1]-1,P.e3); b.rect(sb[0]+6,sb[1]-5,8,2,P.r3);
  var pl=rp(R3.p(s.X0+6,s.Y0,6)); M.prop.pot(b,pl[0],pl[1],{n:7,h:6,seed:3}); }

// ---------------------------------------------------------------- Balkontür und Fenster: Balkongitter, Dächer von Giesing
var GL=[], ROOFW=[];
function outside(b,tod,we){ var night=tod!=='day', x, y, x0=BDOOR.x0, x1=WIN.x1, y0=BDOOR.y0, y1=FY; ROOFW=[];
  var o=new M.Buf(W,H,P.k0);
  for (y=0;y<H;y++) for (x=x0;x<x1;x++){ var c; if (night) c=ra(R('k0 k1 k2 n0 n1'),0.1+y/90*0.8,x,y); else if (we==='fog') c=P.m4; else if (we==='thaw') c=ra(R('m2 m3 m4'),0.3+y/90,x,y); else if (we==='snow') c=ra(R('m3 m4 s4'),0.3+y/90,x,y); else c=ra(R('b2 b3 b4 b5'),0.2+y/80,x,y); o.px(x,y,c); }
  if (night) for (var i=0;i<26;i++) o.px(x0+Math.floor(hash(i,3)*(x1-x0)),y0+Math.floor(hash(i,4)*24),hash(i,5)<0.2?P.n5:P.n3);
  // Häuser von Giesing in der Ferne: Fassaden mit Fenstern, Satteldächer unter Schnee, Kamine
  var r=M.rng(77); x=x0-6; while (x<x1){ var w=12+Math.floor(r()*14), ft=62+Math.floor(r()*8), rh=4+Math.floor(r()*4), fc=[P.e3,P.s3,P.t4,P.e4][Math.floor(r()*4)];
    for (y=ft;y<y1;y++) for (var xx=x;xx<Math.min(x1,x+w);xx++){ var c2=night?((xx===x)?P.n1:P.k2):((xx===x)?M.UP[fc]:fc); o.px(xx,y,c2); }
    for (var k=0;k<rh;k++){ var ins=Math.round(k*w/(2*rh+2)); for (xx=x-1+ins;xx<Math.min(x1,x+w+1-ins);xx++) o.px(xx,ft-1-k,(k===rh-1)?(night?P.n4:P.l1):((xx===x-1+ins)?(night?P.n2:P.s4):(night?P.n3:P.s6))); }
    if (r()<0.7){ var cx=x+3+Math.floor(r()*(w-6)); o.rect(cx,ft-rh-3,2,4,night?P.k2:P.t2); o.hl(cx-1,cx+2,ft-rh-4,night?P.n4:P.s6); }
    for (var fy=ft+3;fy<y1-2;fy+=5) for (var fx=x+2;fx<x+w-2;fx+=4){ o.rect(fx,fy,2,2,night?P.k1:P.k2); ROOFW.push([fx,fy,r()]); }
    x+=w+(r()<0.3?2:0); }
  if (we==='fog') haze(o,function(xx,yy){ return 0.55; },{col:night?P.m1:P.m4,x:x0,y:0,w:x1-x0,h:H});
  // Balkongitter mit Schnee (vor den Dächern)
  for (x=x0;x<x1;x++){ for (y=80;y<FY;y++){ if (x%5===0) o.px(x,y,P.k1); } o.px(x,80,P.m2); o.px(x,81,P.k1); o.px(x,79,we==='thaw'?P.m3:P.s6); if (we!=='thaw' && hash(x,2)<0.5) o.px(x,78,P.s6); }
  for (x=x0;x<x1;x++) for (y=FY-4;y<FY;y++) o.px(x,y,we==='thaw'?P.m2:P.s5);
  if (night) ROOFW.forEach(function(q){ if (q[2]<0.5) o.rect(q[0],q[1],2,2,q[2]<0.22?P.y4:P.y3); });
  return o; }
function balcony(b,tod,we){ var o=outside(b,tod,we), d=BDOOR, x, y; GL=[];
  // Glastür
  b.rect(d.x0-3,d.y0-3,d.x1-d.x0+6,FY-d.y0+3,P.s5); b.rect(d.x0-1,d.y0-1,d.x1-d.x0+2,FY-d.y0+1,P.s6);
  for (y=d.y0+2;y<FY-12;y++) for (x=d.x0+2;x<d.x1-2;x++){ b.px(x,y,o.get(x,y)); GL.push([x,y]); }
  b.rect(d.x0+2,FY-12,d.x1-d.x0-4,10,P.s5); b.hl(d.x0+2,d.x1-3,FY-12,P.s6); b.rect(d.x1-5,d.y0+34,2,5,P.m3);
  // Fenster
  var w=WIN, mx=rd((w.x0+w.x1)/2); for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ b.px(x,y,o.get(x,y)); GL.push([x,y]); }
  b.rect(w.x0-3,w.y0-3,w.x1-w.x0+6,3,P.s6); b.rect(w.x0-3,w.y0-3,3,w.y1-w.y0+6,P.s5); b.rect(w.x1,w.y0-3,3,w.y1-w.y0+6,P.s4); b.rect(mx-1,w.y0,2,w.y1-w.y0,P.s5); b.hl(w.x0,w.x1-1,w.y0+15,P.s5);
  R3.box(b,w.x0-5,w.x1+5,w.y1,w.y1+3,0,5,{top:P.s6,front:P.s4});
  // Strohsterne im Fenster
  [[w.x0+8,w.y0+10],[w.x1-9,w.y0+22],[d.x0+10,d.y0+12]].forEach(function(q){ for (var a=0;a<8;a++){ var an=a/8*Math.PI*2; for (var rr=1;rr<=3;rr++) b.px(q[0]+rd(Math.cos(an)*rr),q[1]+rd(Math.sin(an)*rr),rr===3?P.e3:P.y4); } b.px(q[0],q[1],P.y5); b.vl(q[0],w.y0-1,q[1]-4,P.s4); });
  // Vorhang rechts
  for (y=w.y0-4;y<w.y1+6;y++) for (x=w.x1+3;x<w.x1+9;x++){ var f=(x-w.x1)%3; b.px(x,y,f===0?P.d3:(f===1?P.d4:P.d5)); } }

// ---------------------------------------------------------------- Tannenbaum mit Lichterkette und Strohsternen; Holzeisenbahn
var TLIGHTS=[];
function tree(b,S){ var p=treePos(), x, y, h=TREE.h, r=M.rng(12); TLIGHTS=[];
  b.rect(p[0]-5,p[1]-6,11,6,P.r2); b.hl(p[0]-6,p[0]+5,p[1]-6,P.r3); b.hl(p[0]-5,p[0]+5,p[1]-1,P.r1); b.rect(p[0]-1,p[1]-10,3,4,P.w1);
  for (y=0;y<h-8;y++){ var t=y/(h-8), hw=rd(t*17+(((y%9)>5)?1.5:0)), yy=p[1]-h+y;
    for (x=-hw;x<=hw;x++){ var e=Math.abs(x)/Math.max(1,hw), c=(e>0.85)?P.g2:((x<0)?((hash(x+30,y)<0.4)?P.g4:P.g3):((hash(x+30,y)<0.25)?P.g3:P.g2)); if ((y%9)===8 && e>0.3) c=P.g1; if (hash(x+50,y*3)<0.04) c=P.g5; b.px(p[0]+x,yy,c); } }
  b.px(p[0],p[1]-h-1,P.y4); b.px(p[0]-1,p[1]-h,P.y3); b.px(p[0]+1,p[1]-h,P.y3); b.px(p[0],p[1]-h-2,P.y3);   // Strohstern an der Spitze
  // Strohsterne
  for (var k=0;k<9;k++){ var ty=p[1]-h+10+Math.floor(r()*(h-22)), tw=((ty-(p[1]-h))/(h-8))*15, tx=p[0]+rd((r()-0.5)*2*tw*0.85); b.px(tx,ty,P.y4); b.px(tx-1,ty,P.e4); b.px(tx+1,ty,P.e4); b.px(tx,ty-1,P.e4); b.px(tx,ty+1,P.e4); b.px(tx-1,ty-1,P.e3); b.px(tx+1,ty+1,P.e3); }
  // Lichterkette in Bögen
  for (var g=0;g<6;g++){ var gy=p[1]-h+12+g*9, gw=((gy-(p[1]-h))/(h-8))*16; for (var s=0;s<7;s++){ var u=s/6, lx=p[0]+rd((u-0.5)*2*gw), ly=gy+rd(Math.sin(u*Math.PI)*3); b.px(lx,ly,P.k1); TLIGHTS.push([lx,ly-1,(g*7+s)%5]); } }
  if (S.eve){ [[p[0]-15,P.r3,P.y4,8,6],[p[0]+7,P.b2,P.s6,9,7],[p[0]-4,P.g3,P.r3,7,5],[p[0]+16,P.y3,P.r2,6,5]].forEach(function(q){ b.rect(q[0],p[1]-q[4],q[3],q[4],q[1]); b.vl(q[0]+(q[3]>>1),p[1]-q[4],p[1]-1,q[2]); b.hl(q[0],q[0]+q[3]-1,p[1]-q[4]+2,q[2]); b.px(q[0]+(q[3]>>1)-1,p[1]-q[4]-1,q[2]); b.px(q[0]+(q[3]>>1)+1,p[1]-q[4]-1,q[2]); }); } }   // Geschenke
function toys(b){ var t=TOYS, x;
  // Holzschienen als Acht, darauf eine kleine Lok mit Wagen, Bauklötze
  for (var a=0;a<160;a++){ var u=a/160*Math.PI*2, X=(t.X0+t.X1)/2+Math.sin(u)*14, Z=(t.Z0+t.Z1)/2+Math.sin(u*2)*7, q=rp(R3.p(X,FY,Z)); b.px(q[0],q[1],P.w4); b.px(q[0],q[1]+1,P.w2); }
  var l=rp(R3.p(t.X0+10,FY,t.Z0+14)); b.rect(l[0],l[1]-4,5,4,P.r3); b.rect(l[0]+3,l[1]-6,2,2,P.k1); b.px(l[0],l[1],P.k1); b.px(l[0]+4,l[1],P.k1); b.rect(l[0]-6,l[1]-3,5,3,P.b2); b.rect(l[0]-12,l[1]-3,5,3,P.y3);
  var k=rp(R3.p(t.X1-4,FY,t.Z1-4)); b.rect(k[0],k[1]-4,4,4,P.r3); b.rect(k[0]+4,k[1]-3,3,3,P.b3); b.rect(k[0]+1,k[1]-7,4,3,P.y4); b.rect(k[0]-6,k[1]-2,4,2,P.g3); }

// ---------------------------------------------------------------- Küche: Zeile, Herd, Spüle, Hängeschränke, Kühlschrank mit Zeichnungen
function kitchen(b){ var x, y, K=KIT;
  for (y=48;y<K.Y0;y++) for (x=K.X0;x<FRIDGE.X0;x++){ var c=((x-K.X0)%5===0||(y-48)%5===0)?P.a4:P.a5; b.px(x,y,c); }
  R3.box(b,K.X0,FRIDGE.X0-2,26,46,0,9,{front:P.s6,bottom:P.s4,left:P.s5}); var u0=rp(R3.p(K.X0,26,9)), u1=rp(R3.p(FRIDGE.X0-2,46,9)); for (x=u0[0];x<u1[0];x+=12) { b.vl(x,u0[1],u1[1]-1,P.s4); b.rect(x+5,u1[1]-4,1,3,P.m2); }
  R3.box(b,K.X0,K.X1,K.Y0+2,FY,0,K.Z1,{front:P.s6,left:P.s5}); R3.box(b,K.X0,K.X1+1,K.Y0,K.Y0+2,0,K.Z1+1,{top:P.w4,front:P.w2,left:P.w3});
  var f0=rp(R3.p(K.X0,K.Y0+2,K.Z1)), f1=rp(R3.p(K.X1,FY,K.Z1)); for (x=f0[0];x<f1[0];x+=12){ b.vl(x,f0[1]+1,f1[1]-2,P.s4); b.rect(x+5,f0[1]+3,3,1,P.m2); }
  var st=rp(R3.p(K.X0+30,K.Y0,4)); b.ellipse(st[0],st[1],3,1.1,P.k1); b.ellipse(st[0]+8,st[1],3,1.1,P.k1); b.rect(st[0]-3,st[1]-6,7,5,P.m3); b.hl(st[0]-3,st[0]+3,st[1]-6,P.m4);   // Topf auf dem Herd
  var sk=rp(R3.p(K.X0+8,K.Y0,4)); b.rect(sk[0],sk[1],12,2,P.m3); b.vl(sk[0]+6,sk[1]-6,sk[1]-1,P.m4); b.hl(sk[0]+6,sk[0]+9,sk[1]-6,P.m4);
  b.rect(f0[0]+2,f0[1]+3,8,1,P.m2);
  // Kühlschrank
  var Fr=FRIDGE; R3.box(b,Fr.X0,Fr.X1,Fr.Y0,FY,0,Fr.Z1,{front:P.s6,left:P.s5,top:P.s5}); var g0=rp(R3.p(Fr.X0,Fr.Y0,Fr.Z1)), g1=rp(R3.p(Fr.X1,FY,Fr.Z1)); FRR=[g0[0],g0[1],g1[0]-g0[0],g1[1]-g0[1]];
  b.hl(g0[0]+1,g1[0]-2,g0[1]+24,P.s4); b.vl(g0[0]+2,g0[1]+8,g0[1]+18,P.m3); b.vl(g0[0]+2,g0[1]+30,g0[1]+44,P.m3);
  // Kinderzeichnungen mit Magneten: Haus, Sonne, Schneemann, eine Straßenbahn
  var dr=[[g0[0]+5,g0[1]+4,P.s6,'house'],[g0[0]+14,g0[1]+10,P.y4,'sun'],[g0[0]+6,g0[1]+28,P.b5,'snow'],[g0[0]+15,g0[1]+33,P.s6,'tram']];
  dr.forEach(function(q){ var x0=q[0], y0=q[1]; b.rect(x0,y0,9,8,q[2]); b.px(x0+4,y0-1,P.r3);
    if (q[3]==='house'){ b.rect(x0+2,y0+4,5,3,P.r3); b.px(x0+3,y0+3,P.r3); b.px(x0+4,y0+2,P.r3); b.px(x0+5,y0+3,P.r3); b.px(x0+4,y0+5,P.b2); }
    if (q[3]==='sun'){ b.ellipse(x0+4.5,y0+4,2,2,P.t4); b.px(x0+1,y0+1,P.t4); b.px(x0+7,y0+1,P.t4); }
    if (q[3]==='snow'){ b.px(x0+4,y0+2,P.s6); b.rect(x0+3,y0+4,3,3,P.s6); b.px(x0+4,y0+5,P.k1); b.hl(x0+1,x0+7,y0+7,P.s6); }
    if (q[3]==='tram'){ b.rect(x0+1,y0+3,7,3,P.r3); b.hl(x0+1,x0+7,y0+4,P.y4); b.px(x0+2,y0+6,P.k1); b.px(x0+6,y0+6,P.k1); b.line(x0+4,y0+3,x0+5,y0,P.k1); } }); }
var FRR=[0,0,0,0];

// ---------------------------------------------------------------- Bild
var BASE=null, WE='snowlie', PH='';
function inGlass(x,y){ return (x>=WIN.x0&&x<WIN.x1&&y>=WIN.y0&&y<WIN.y1) || (x>=BDOOR.x0+2&&x<BDOOR.x1-2&&y>=BDOOR.y0+2&&y<FY-12); }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), we=weaOf(GS), dark=tod!=='day', x, y; WE=we; PH=GS.phase||'';
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=hit(x,y); if (h) b.px(x,y,surf(h,x,y)); }
  hall(b,S); photos(b); balcony(b,tod,we); kitchen(b); tree(b,S); toys(b);
  b.rect(122,16,8,4,P.e4); b.hl(121,130,20,P.e2); b.vl(126,13,15,P.m2);                                             // Wandleuchte
  // Teppich vor dem Baum
  b.poly([rp(R3.p(234,FY,18)),rp(R3.p(300,FY,18)),rp(R3.p(300,FY,46)),rp(R3.p(234,FY,46))],function(xx,yy){ var f=R3.floor(xx,yy); if (!f) return P.r2; var u=(f.X-234)/66, v=(f.Z-18)/28, e=Math.min(u,1-u,v,1-v); if (e<0.05) return P.y2; return ((Math.floor(f.X/4)+Math.floor(f.Z/3))%2)?P.r2:P.r1; });
  // Deckenlampe über dem Tisch
  var lp=lampPos(); b.vl(lp[0],lp[1],lp[2]-4,P.k1); b.ellipse(lp[0]+0.5,lp[2]-1,8,4,function(xx,yy){ return yy<lp[2]-1?P.w3:P.w2; }); b.hl(lp[0]-7,lp[0]+8,lp[2]+2,P.w1);
  if (S.silvester){ for (var i=0;i<4;i++){ var sx=lp[0]-6+i*4; for (var yy=lp[2]+2;yy<lp[2]+12+i*3;yy++) b.px(sx+rd(Math.sin(yy*0.8+i)*1.2),yy,[P.r3,P.y4,P.b3,P.g4][i]); } }   // Luftschlangen an der Lampe
  if (!dark){ var br=(we==='sun'||we==='snowlie'||we==='frost')?0.7:0.45; M.light(b,M.lf.sum(M.lf.pool(205,118,150,34,br),M.lf.pool(205,56,110,56,0.4),M.lf.vignette(W,H,1.6),M.lf.k(we==='thaw'||we==='fog'?-0.35:-0.1)),0,0,function(xx,yy){ return !inGlass(xx,yy); });
    BASE=b.clone(); return b; }
  M.light(b,M.lf.vignette(W,H,1.0),0,0,function(xx,yy){ return !inGlass(xx,yy); });
  BASE=b.clone(); shadeTOD(b,0,0,tod,function(xx,yy){ return !inGlass(xx,yy); });
  b.ellipse(lp[0]+0.5,lp[2]+1,6,1.6,P.y4); b.hl(lp[0]-4,lp[0]+5,lp[2]+2,P.l1);
  b.rect(122,16,8,4,P.y4); b.hl(121,130,20,P.y5);
  return b; }

// ---------------------------------------------------------------- Ebene: Tisch mit Stühlen und Gedeck
function tableLayer(S,GS,tod){ var r0=R3.rect(TBL.X0-14,TBL.X1+14,TBL.Y0-22,FY,TBL.Z0-10,TBL.Z1+10), L=M.layer(r0[0]-2,r0[1]-2,r0[2]+4,r0[3]+4,rd(R3.p(0,FY,TBL.Z1)[1])+1), wr=M.lw(L);
  function chair(X,Z,back){ var seatY=FY-12; R3.box(wr,X-5,X+5,seatY,seatY+2,Z-5,Z+5,{top:P.w4,front:P.w2,left:P.w3,right:P.w3});
    [[X-4,Z-4],[X+4,Z-4],[X-4,Z+4],[X+4,Z+4]].forEach(function(q){ var a=R3.p(q[0],seatY+2,q[1]), c=R3.p(q[0],FY,q[1]); wr.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),P.w2); });
    if (back==='B'){ R3.box(wr,X-5,X+5,seatY-15,seatY-11,Z-6,Z-4,{front:P.w3,top:P.w4}); [X-4,X+4].forEach(function(xx){ var a=R3.p(xx,seatY-11,Z-5), c=R3.p(xx,seatY,Z-5); wr.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),P.w3); }); }
    if (back==='L'||back==='R'){ var bx=back==='L'?X-5:X+5; R3.box(wr,bx-1,bx+1,seatY-15,seatY,Z-5,Z+5,{front:P.w3,top:P.w4,left:P.w2,right:P.w3}); } }
  chair(TBL.X0+12,TBL.Z0-6,'B'); chair(TBL.X1-12,TBL.Z0-6,'B');
  [[TBL.X0+2,TBL.Z0+2],[TBL.X1-2,TBL.Z0+2],[TBL.X0+2,TBL.Z1-2],[TBL.X1-2,TBL.Z1-2]].forEach(function(q){ var a=R3.p(q[0],TBL.Y0+3,q[1]), c=R3.p(q[0],FY,q[1]); wr.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),P.w2); wr.line(rd(a[0])+1,rd(a[1]),rd(c[0])+1,rd(c[1]),P.w1); });
  var cloth=!!S.eve;
  R3.box(wr,TBL.X0,TBL.X1,TBL.Y0,TBL.Y0+3,TBL.Z0,TBL.Z1,{top:cloth?function(xx,yy){ return ((xx+yy*3)%17===0)?P.s5:P.s6; }:function(xx,yy){ return tableWood(xx,yy); },front:cloth?P.s5:P.w3,left:cloth?P.s4:P.w2,right:cloth?P.s4:P.w2});
  var mid=rp(R3.p((TBL.X0+TBL.X1)/2,TBL.Y0,(TBL.Z0+TBL.Z1)/2));
  if (S.eve){ [[-20,-3],[-6,-4],[8,-4],[20,-3],[-18,3],[18,3]].forEach(function(q){ wr.ellipse(mid[0]+q[0],mid[1]+q[1],3.6,1.3,P.l1); wr.px(mid[0]+q[0]+3,mid[1]+q[1]-2,P.b5); wr.px(mid[0]+q[0]+3,mid[1]+q[1]-3,P.b5); });
    wr.ellipse(mid[0]-4,mid[1],5,2,P.y3); wr.hl(mid[0]-8,mid[0],mid[1]-1,P.y4); wr.ellipse(mid[0]+6,mid[1]+1,4,1.6,P.e4); for (var k=0;k<4;k++) wr.hl(mid[0]+3,mid[0]+9,mid[1]+k%2,P.t3);   // Kartoffelsalat, Würstel
    wr.rect(mid[0]+12,mid[1]-6,6,5,P.m2); wr.hl(mid[0]+12,mid[0]+17,mid[1]-6,P.m3); wr.ellipse(mid[0]-14,mid[1]+1,4,1.5,P.s5); for (var c2=0;c2<5;c2++) wr.px(mid[0]-16+c2*2,mid[1],[P.y3,P.w3,P.t4,P.y4,P.w4][c2]); }   // Sarma-Topf, Plätzchen
  else if (S.silvester){ wr.rect(mid[0]-10,mid[1]-4,20,4,P.k2); wr.hl(mid[0]-10,mid[0]+9,mid[1]-4,P.m2); wr.rect(mid[0]-8,mid[1]-6,16,2,P.m1); for (var q2=0;q2<4;q2++){ wr.rect(mid[0]-9+q2*5,mid[1]-1,4,1,P.k1); wr.px(mid[0]-8+q2*5,mid[1]-2,P.y4); }   // Raclette mit Pfännchen
    for (var s=0;s<5;s++){ var sx=mid[0]-22+s*10; for (var u=0;u<8;u++) wr.px(sx+u,mid[1]+rd(Math.sin(u*1.1+s)*1.6)+((s%2)?2:-2),[P.r3,P.y4,P.b3,P.g4,P.d4][s]); }   // Luftschlangen
    [[-18,-3],[16,-3],[-14,3],[14,3]].forEach(function(q){ wr.px(mid[0]+q[0],mid[1]+q[1]-2,P.y4); wr.px(mid[0]+q[0],mid[1]+q[1]-1,P.y3); wr.px(mid[0]+q[0],mid[1]+q[1],P.s5); }); }   // Sektgläser
  else { wr.ellipse(mid[0],mid[1],5,1.8,P.w1); wr.px(mid[0]-2,mid[1]-1,P.r3); wr.px(mid[0]+1,mid[1]-1,P.y4); wr.px(mid[0]+3,mid[1]-1,P.g4); wr.rect(mid[0]-18,mid[1]-1,8,3,P.s6); for (var cr=0;cr<4;cr++) wr.px(mid[0]-17+cr*2,mid[1],[P.r3,P.b3,P.g3,P.y3][cr]); wr.rect(mid[0]+10,mid[1]-3,3,3,P.s6); }   // Obst, Malblock, Tasse
  chair(TBL.X0-8,(TBL.Z0+TBL.Z1)/2,'L'); chair(TBL.X1+8,(TBL.Z0+TBL.Z1)/2,'R');
  if (tod!=='day') shadeTOD(L,L.ox,L.oy,tod); else M.light(L,M.lf.sum(M.lf.vignette(W,H,1.6),M.lf.k(-0.05)),L.ox,L.oy);
  return L; }
function tableWood(x,y){ return ((x+((y*7)>>1))%13<1)?P.w3:(((x>>2)+y)%5===0?P.w5:P.w4); }
function layers(S,GS,tod){ return [tableLayer(S,GS,tod)]; }

// ---------------------------------------------------------------- jedes Bild: Lichterkette blinkt sacht, Feuerwerk durchs Fenster
var FWC=[[P.l1,P.y5,P.y4,P.y2],[P.l1,P.r4,P.r3,P.r2],[P.l1,P.b5,P.b3,P.b1],[P.l0,P.d6,P.d5,P.d3],[P.l1,P.g5,P.g4,P.g3],[P.l1,P.a6,P.a5,P.a3]];
function fireworks(fb,t,cam,x0,y0,x1,y1,n,rad,mask){
  function pl(X,Y,c){ X=rd(X)-cam; Y=rd(Y); if (X<0||X>=fb.w||Y<0||Y>=144) return; if (mask && !mask(X+cam,Y)) return; fb.px(X,Y,c); }
  for (var i=0;i<n;i++){ var per=3.1+hash(i,71)*2.3, ph=t/per+hash(i,72)*5, cyc=Math.floor(ph), u=ph-cyc; if (hash(cyc,i+76)<0.3) continue;
    var bx=x0+hash(i*13+cyc,73)*(x1-x0), by=y0+hash(cyc,i*7+74)*(y1-y0)*0.6, col=FWC[Math.floor(hash(cyc,i+75)*FWC.length)], rise=0.16;
    if (u<rise){ var q=u/rise, ry=y1+(by-y1)*q; pl(bx+Math.sin(q*7)*0.6,ry,col[1]); if (q>0.2) pl(bx,ry+1,col[3]); continue; }
    var kk=(u-rise)/(1-rise); if (kk>0.62) continue; kk/=0.62;
    var r=rad*Math.sqrt(kk), parts=12+Math.floor(hash(cyc,i)*6), ci=Math.min(3,Math.floor(kk*4.2));
    for (var p=0;p<parts;p++){ var a=p/parts*Math.PI*2+hash(cyc,p+i)*0.4, rr=r*(0.7+hash(p,cyc+i)*0.4), px=bx+Math.cos(a)*rr, py=by+Math.sin(a)*rr*0.85+kk*kk*6; pl(px,py,col[ci]); if (kk<0.45) pl(px-Math.cos(a)*1.2,py-Math.sin(a),col[Math.min(3,ci+1)]); }
    if (kk<0.12) pl(bx,by,P.l1); } }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, tod=v.tod, we=WE;
  var LC=[P.y5,P.r4,P.b4,P.g5,P.d5];
  TLIGHTS.forEach(function(q,k){ var X=q[0]-cam; if (X<0||X>=320) return; var on=Math.sin(t*0.9+k*1.37)>-0.35; fb.px(X,q[1],on?LC[q[2]]:M.DN[LC[q[2]]]); if (on && tod!=='day' && hash(k,3)<0.4) fb.px(X,q[1]-1,P.y3); });
  if (we==='snow') M.snow(fb,t,{n:30,cam:cam,mask:function(X,Y){ return inGlass(X,Y); },col:P.s6,col2:P.s5,wind:5});
  if (fwOn(S,GS)){ fireworks(fb,t,cam,BDOOR.x0+2,WIN.y0+2,WIN.x1-2,62,3,8,function(X,Y){ return inGlass(X,Y) && Y<76; });
    // ein kurzer Widerschein auf dem Fensterbrett
    var ph=(t/3.7)%1; if (ph<0.06){ var cx=(WIN.x0+WIN.x1)/2-cam; for (var x=-16;x<16;x++) if (bayer(x&7,1)<0.5) fb.px(rd(cx+x),WIN.y1+1,P.y3); } } }
// Geistersicht: in der Silvesternacht an der Tür Jasnas Zählen, „1 2 3 …“
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam; if (PH!=='k4_fin_n' && !S.trail) return;
  var nums=['1','2','3','4','5','6','7'], d=DOOR;
  for (var i=0;i<nums.length;i++){ var ph=((t*0.18)+i/nums.length)%1, X=rd(lerp(d.x1+70,d.x0+10,ph)+Math.sin(t*0.7+i)*3)-cam, Y=rd(70-ph*14+Math.sin(t*0.9+i*2)*3), a=Math.sin(ph*Math.PI);
    if (X<0||X>=316) continue; M.microText({px:function(xx,yy,c){ if (xx<0||xx>=320||yy<0||yy>=144) return; if (bayer(xx,yy+Math.floor(t*3))>a*0.9) return; fb.px(xx,yy,c); }},nums[i],X,Y,(i%2)?P.x5:P.x4); }
  M.microText({px:function(xx,yy,c){ if (xx<0||xx>=320) return; if (bayer(xx,yy+Math.floor(t*2))>0.6) return; fb.px(xx,yy,c); }},'...',d.x0+8-cam,d.y0+40,P.x3); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>138||x<10||x>470) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<XL+3||f.X>XR-3) return false;
  if (f.X>TBL.X0-20 && f.X<TBL.X1+20 && f.Z<TBL.Z1+8) return false; if (f.X>TOYS.X0-2 && f.X<TOYS.X1+2 && f.Z<TOYS.Z1+2) return false; return true; }
var TR=R3.rect(TBL.X0-14,TBL.X1+14,TBL.Y0-20,FY,TBL.Z0-10,TBL.Z1+8), KR=R3.rect(KIT.X0,KIT.X1,26,FY,0,KIT.Z1), TYR=R3.rect(TOYS.X0,TOYS.X1,FY-8,FY,TOYS.Z0,TOYS.Z1);
var TRR=(function(){ var p=R3.p(TREE.X,FY,TREE.Z); return [rd(p[0])-18,rd(p[1])-TREE.h-3,37,TREE.h+3]; })();
M.defineArt('ana',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; var L=levels(tod); return L[Math.max(0,Math.min(L.length-1,Math.round(lightAt(a.x,a.y-22)*(L.length-1))))].a; },
  spots:{
    door:[DOOR.x0-3,DOOR.y0-3,DOOR.x1-DOOR.x0+6,FY-DOOR.y0+3],
    table:[TR[0],TR[1]+8,TR[2],TR[3]-8],
    tree:TRR,
    kitchen:[KR[0],KR[1],KR[2],KR[3]],
    fridge:[0,0,0,0],
    toys:[TYR[0]-2,TYR[1]-4,TYR[2]+4,TYR[3]+6],
    shoebox:[0,0,0,0],
    photos:[PHOTOS.x0-2,PHOTOS.y0-2,PHOTOS.x1-PHOTOS.x0+4,PHOTOS.y1-PHOTOS.y0+4],
    coats:[COAT.x0-2,COAT.y0-4,COAT.x1-COAT.x0+4,62],
    balcony:[BDOOR.x0-4,WIN.y0-5,WIN.x1-BDOOR.x0+8,FY-WIN.y0+5]
  },
  stands:{ door:[26,114,'B'], table:[352,128,'B'], tree:[262,117,'B'], kitchen:[420,116,'B'], fridge:[456,116,'B'], toys:[300,121,'B'], shoebox:[128,115,'B'], photos:[124,115,'B'], coats:[68,115,'B'], balcony:[200,115,'B'] },
  actorPos:{ ana:[0,0,'L'], tobias:[0,0,'R','tobias',false,'sit'], mia:[0,0,'R','mia',false,'play'], niko:[0,0,'L'], jasna_ana:[0,0,'L','jasna',false,'sit'], mala:[0,0,'L'] },
  start:[30,118,'R'], entries:{ map:[30,118,'R'] }
});
(function(){ var A=M.ART.ana, b=new M.Buf(W,H,P.k0); kitchen(b); photos(b); A.spots.fridge=[FRR[0]-1,FRR[1]-2,FRR[2]+2,FRR[3]+2]; A.spots.shoebox=SHOEBOX.slice();
  function st(X,Z,f){ return R3.st(X,Z,f); }
  var a=st(KIT.X0+18,18,'L'); A.actorPos.ana=[a[0],a[1],'L'];
  var tb=st(TBL.X0-8,(TBL.Z0+TBL.Z1)/2,'R'); A.actorPos.tobias=[tb[0],tb[1],'R','tobias',false,'sit'];
  var ja=st(TBL.X1+8,(TBL.Z0+TBL.Z1)/2,'L'); A.actorPos.jasna_ana=[ja[0],ja[1],'L','jasna',false,'sit'];
  var mi=st(TOYS.X0-4,TOYS.Z1-4,'R'); A.actorPos.mia=[mi[0],mi[1],'R','mia',false,'play'];
  var nk=st(TREE.X+24,12,'L'); A.actorPos.niko=[nk[0],nk[1],'L'];
  var ml=st(WIN.x1+4,9,'L'); A.actorPos.mala=[ml[0],ml[1],'L']; })();
})(M);
