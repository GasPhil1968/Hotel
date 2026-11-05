/* ===== rooms/art/kafic.js — Café „Zdravko“ am Westbusbahnhof, innen: ein kleines Café der 1980er.
   Kiefernholz (Lamperija) an Decke und Wandsockel, darüber eine braun-orange Tapete mit Kreisen. Hinten rechts die Theke
   (Vordergrund-Ebene, Zdravko steht dahinter) mit Espressomaschine, Kasse und Gläsern, dahinter Wandborde mit Rakijaflaschen,
   die Preistafel und eine Wanduhr. Hinten links die alte gerahmte Straßenkarte von 1985 (vergilbt, gefaltet, Neretva, Straßen,
   Orte, im Süden eine Flussbiegung mit Brückenzeichen), daneben gerahmte Fotos (eines zeigt Mate mit Hut). Oben in der Ecke
   ein Röhrenfernseher auf einem Wandarm. Rechts in der Seitenwand das große Fenster zum Bussteig (Blechdach, Bank, Fahrplan,
   dahinter Wohnblocks und der Hum), davor der Fenstertisch mit Resopalplatte und Mates Stuhl; vorn rechts die Glastür.
   Bura: Wolkenfetzen und ein Plastiksack draußen, Regen: Tropfen am Glas. Geistersicht: eine dampfende Thermoskanne. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[140,54], RECT=[34,20,236,94], F=100, FY=94;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WINU=[6,46,32,78], DOORU=[54,80,26,94];             // Fenster und Glastür in der rechten Wand (Tiefe u0,u1, Höhe vOben,vUnten)
var MAP={x:44,y:30,w:74,h:46};                         // alte Landkarte (Rahmen außen)
var PH={x:122,y:28,w:26,h:48};                         // Fotowand
var CNT={X0:150,X1:214,Y0:72,Z0:7,Z1:18};              // Theke
var TB={X0:204,X1:232,Y0:78,Z0:26,Z1:42};              // Fenstertisch
var TL={X0:46,X1:78,Y0:76,Z0:20,Z1:36};                // zweiter Tisch links
var MATE=[226,108];                                    // Mate sitzt: Hüfte x, Füße y
var LMP=[[244,34]];                                    // Hängelampe über dem Fenstertisch (Schirmmitte)
var NEON={X0:112,X1:172,Z:44};                         // Leuchtstoffröhre an der Decke
var TV={x:16,y:24};                                    // Fernseher auf dem Wandarm (oben links in der Ecke)
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
function inWinUV(w,U){ return w && w.u>=U[0] && w.u<U[1] && w.v>=U[2] && w.v<U[3]; }
function inGlass(x,y){ if (x<RECT[2]) return false; var w=wallUV('R',x,y); return inWinUV(w,[WINU[0]+2,WINU[1]-2,WINU[2]+2,WINU[3]-2]) || inWinUV(w,[DOORU[0]+3,DOORU[1]-3,DOORU[2]+3,DOORU[3]-14]); }
// Schrift mit Haken (Mikroschrift kennt ČŠŽĆ)
function sign(b,s,x,y,c){ M.microText(b,s,x,y,c); return x+M.microWidth(s); }

// ---------------------------------------------------------------- Licht: Tageslicht vom Fenster rechts, zwei Hängelampen mit Glasschirm
var WARM=M.tintMake(function(r,g,b){ return [r*0.95+18, g*0.84+8, b*0.66]; });
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
// warmes Licht: die Hängelampe und die Theke
function lampAt(x,y){ var a=0; for (var i=0;i<LMP.length;i++){ var l=LMP[i], dx=(x-l[0])/56, dy=(y-l[1]-40)/40, d=dx*dx+dy*dy; if (d<1) a=Math.max(a,Math.pow(1-d,0.9)*0.95); var g=Math.hypot((x-l[0])/16,(y-l[1]-2)/9); if (g<1) a=Math.max(a,1-g*0.3); }
  var c=Math.hypot((x-190)/56,(y-62)/24); if (c<1) a=Math.max(a,(1-c)*0.6); return Math.min(1,a); }
// Leuchtstoffröhre: breites, kühles Licht im ganzen Raum
function neonAt(x,y){ var dx=(x-142)/170, dy=(y-86)/78, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,0.8):0; }
var WLF=1;
function winAt(x,y){ var dx=(x-292)/130, dy=(y-92)/62, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.3)*WLF:0; }
function vig(x,y){ var cx=(x-160)/190, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*2.2; }
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.7+neonAt(x,y)*0.55+lampAt(x,y)*0.55+winAt(x,y)*0.8+vig(x,y)*1.3; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue; var a=lampAt(X,Y); if (bayer(X,Y)<cl((a-0.62)*1.4,0,0.45)) b.d[k]=M.tintPx(WARM,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,Math.max(lampAt(X2,Y2),neonAt(X2,Y2)*0.75)+(tod==='night'?0:winAt(X2,Y2)*0.4))*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen
// Lamperija: senkrechte Kiefernbretter mit Nut, warm und glänzend
function pine(u,v,x,y,dim){ var bw=6, bi=Math.floor((u+600)/bw), fu=(u+600)-bi*bw, t=hash(bi,5), c=t<0.35?P.w3:(t<0.85?P.w4:P.w3);
  if (fu<1) c=P.w1; else if (fu<2) c=P.w2; else if (fu>=bw-1 && t>0.4) c=P.w5;
  var knot=hash(bi,Math.floor(v/13)); if (knot<0.07 && fu>2 && fu<5 && ((v%13)===6||(v%13)===7)) c=P.w1;
  var g=fbm(u*0.12+bi,v*0.05); if (g>0.62 && bayer(x,y)<(g-0.62)*3) c=M.DN[c];
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
// Tapete der Siebziger: Kreise in Braun und Orange auf Ocker
function paper(u,v,x,y,dim){ var cu=((u%12)+12)%12-6, row=Math.floor(v/12), cv=((v%12)+12)%12-6; if (row&1) cu=(((u+6)%12)+12)%12-6;
  var d=Math.hypot(cu,cv), c=P.e3; if (d<4.6 && d>=3.6) c=P.t2; else if (d<3.6 && d>=2.6) c=(bayer(x,y)<0.5)?P.e2:P.t2; else if (d<1.2) c=P.y2; else if (Math.abs(cu)>=5.5 && (v%3)===0) c=P.e2;
  var f=fbm(u*0.03,v*0.04); if (f>0.64 && bayer(x,y)<(f-0.64)*2.6) c=M.DN[c]; if (v<RECT[1]+4) c=M.DN[c];
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ var Y=v+RECT[1];
  if (Y>=91) return Y===91?P.w2:P.w0;                                    // Fußleiste
  if (Y>=68){ if (Y===68) return P.w5; if (Y===69) return P.w2; return pine(u,Y,x,y,0); }
  return paper(u,Y,x,y,0); }
function wallSide(u,v,x,y,sd){ var Y=v+RECT[1], c;
  if (Y>=91) c=Y===91?P.w2:P.w0; else if (Y>=68) c=(Y===68)?P.w5:((Y===69)?P.w2:pine(u*2.2+(sd==='L'?0:300),Y,x,y,0)); else c=paper(u*1.6+(sd==='L'?3:200),Y,x,y,0);
  return sd==='L'?M.DN[c]:c; }
// Terrazzoboden in großen Platten (braun mit hellen und dunklen Steinchen), ausgetreten vor der Theke und an der Tür
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, s=20, ix=Math.floor((X+700)/s), iz=Math.floor((Z+700)/s), fx=(X+700)-ix*s, fz=(Z+700)-iz*s;
  var h=hash(ix,iz), c=h<0.5?P.w2:P.t1; if (fx<0.7||fz<0.7) c=P.w0; else { var sp=hash(Math.floor(X*2.3),Math.floor(Z*1.9)); if (sp<0.08) c=P.w1; else if (sp>0.93) c=P.e3; else if (sp>0.88) c=P.t2; else if (sp<0.11) c=P.k2;
    var g=fbm(X*0.05,Z*0.08); if (g>0.6 && bayer(x,y)<(g-0.6)*2.4) c=M.UP[c]; }
  var wear=Math.exp(-Math.pow((Z-34)/16,2))*Math.exp(-Math.pow((X-188)/40,2))+Math.exp(-Math.pow((Z-60)/12,2))*Math.exp(-Math.pow((X-226)/24,2))*0.6; if (wear>0.3 && bayer(x,y)<(wear-0.3)*0.9 && c!==P.w1) c=M.UP[c];
  return c; }
// Decke: Kiefernbretter in die Tiefe
function ceilTex(xb,d,x,y){ var bi=Math.floor((xb+600)/7), fu=(xb+600)-bi*7, c=hash(bi,3)<0.4?P.w3:P.w4; if (fu<1) c=P.w1; if (fbm(xb*0.1,d*0.3)>0.62) c=M.DN[c]; return M.DN[c]; }

// ---------------------------------------------------------------- Blick durchs Fenster: der Bussteig des Westbusbahnhofs
function outsideAt(x,y,tod,weather){ var c=outsideDay(x,y,tod,weather); if (tod!=='day' && !OSKY && !OLIT) c=M.tintPx(M.TINT[tod]||M.TINT.night,c,x,y); return c; }
var OSKY=false, OLIT=false;
function outsideDay(x,y,tod,weather){ var night=tod==='night', dusk=tod==='dusk', dawn=tod==='dawn', c, v=(y-30)/40; OSKY=true; OLIT=false;
  // Himmel über dem Bussteig
  var SK=weather==='rain'?R('m2 m3 s3 m3'):(weather==='grey'?R('m3 m4 s4 s4'):(night?R('k0 k1 k2 n0 n1'):(dusk?R('d1 d2 d3 d4 d5'):(dawn?R('n1 n2 d2 d3 d4'):R('b1 b2 b3 b4 b5')))));
  c=ra(SK,0.15+v*0.9,x,y);
  if (weather==='bura' && !night){ var st=Math.sin(x*0.11-y*0.6)+Math.sin(x*0.037+y*0.21); if (st>1.4 && y<52) c=(bayer(x,y)<0.6)?P.s6:P.b5; }
  if (night && hash(x,y*3)<0.02 && y<50) c=P.n4;
  // der Hum (kahl, ohne Zeichen) und Wohnblocks am Westufer
  var hy=56+Math.sin(x*0.05)*3+Math.sin(x*0.13+1)*1.2; if (y>hy){ OSKY=false; c=(weather==='rain'||weather==='grey')?P.m3:(hash(x>>1,y)<0.5?P.e3:P.g4); if (y<hy+1) c=P.e4; }
  var bl=[[238,8,10],[247,12,16],[263,9,8],[276,13,18],[296,8,11],[305,13,15]];
  for (var i=0;i<bl.length;i++){ var b0=bl[i]; if (x>=b0[0] && x<b0[0]+b0[1] && y>=74-b0[2]){ OSKY=false; var wx=x-b0[0], wy=y-(74-b0[2]); c=(wx===0?P.s4:(wx===b0[1]-1?P.m3:P.s3)); if (wy===0) c=P.m4; if (wy%3===1 && wx%3===1){ c=P.m1; if ((night||dusk) && hash(x,y)<0.35){ c=P.y3; OLIT=true; } } if (weather==='grey'||weather==='rain') c=M.mix(c,P.m3,3); } }
  // Fahrbahn und gegenüberliegender Bordstein
  if (y>=74 && y<84){ OSKY=false; c=(y===74)?P.s4:(weather==='rain'?((hash(x,y)<0.25)?P.m3:P.m1):P.m2); if (y===79 && (x%14)<7) c=P.s5; }
  // Bussteig: Platten, Bordstein vorn, Bank, Haltestellenschild, Papierkorb
  if (y>=84){ OSKY=false; c=(y===84)?P.s5:((y===85)?P.s2:(((x+(y>>1))%9===0||(y%4)===0)?P.s2:P.s3)); if (weather==='rain' && hash(x,y)<0.2) c=P.m4; }
  if (y>=78 && y<89){ var bx=((x-246)%38+38)%38; if (bx<16){ if (y===78||y===81){ OSKY=false; c=P.w3; } else if (y>=84 && (bx===2||bx===13)){ OSKY=false; c=P.m1; } else if (y===82){ OSKY=false; c=P.w2; } } }
  if (x>=284 && x<286 && y>=52 && y<88){ OSKY=false; c=P.m2; } if (x>=281 && x<289 && y>=50 && y<58){ OSKY=false; var r=Math.hypot(x-284.5,y-53.5); if (r<4) c=r<2.6?P.y4:P.s6; }
  if (x>=262 && x<266 && y>=80 && y<88){ OSKY=false; c=(x===262)?P.g3:P.g2; if (y===80) c=P.m3; }
  // Blechdach: Unterseite in Wellen, Vorderkante, Stützen
  if (y<43){ OSKY=false; c=((y+(x>>2))%3===0)?P.m2:(((y+(x>>2))%3===1)?P.m3:P.m1); if (y<34) c=M.DN[c]; if ((night||dusk) && y>=39 && y<41 && (x%16)<3){ c=P.y4; OLIT=true; } }
  if (y>=43 && y<46){ OSKY=false; c=(y===43)?P.m4:((y===44)?P.m3:P.m1); }
  if (y>=46 && ((x+5)%30)<2){ OSKY=false; c=((x+5)%30===0)?P.m3:P.m1; }
  return c; }

// ---------------------------------------------------------------- die alte Straßenkarte (1985): vergilbt, gefaltet, unter Glas
function riverX(t){ return 0.47+Math.sin(t*5.2+0.6)*0.05+Math.sin(t*11)*0.015+(t>0.72?Math.sin((t-0.72)*12)*0.07:0); }   // t = 0 oben (Norden) .. 1 unten
function paintMap(b,x0,y0,w,h){ var x, y, i;
  // Rahmen: dunkles Holz mit Goldleiste
  b.rect(x0-1,y0-1,w+2,h+3,P.w0); b.rect(x0,y0,w,h,P.w1); b.hl(x0,x0+w-1,y0,P.w3); b.vl(x0,y0,y0+h-1,P.w2); b.hl(x0,x0+w-1,y0+h-1,P.k2); b.vl(x0+w-1,y0,y0+h-1,P.w0);
  b.rect(x0+2,y0+2,w-4,h-4,P.y1); b.hl(x0+2,x0+w-3,y0+2,P.y3);
  var ix=x0+3, iy=y0+3, iw=w-6, ih=h-6;
  b.fn(ix,iy,iw,ih,function(xx,yy){ var u=(xx-ix)/iw, v=(yy-iy)/ih, c;
    var e=Math.min(u,1-u,v,1-v), age=fbm(xx*0.18,yy*0.2), stain=fbm(xx*0.07+3,yy*0.09);
    c=ra(R('e3 e4 s4 s5'),0.72-age*0.35-(e<0.06?0.25:0),xx,yy);
    // Relief: grünes Tiefland, braune Berge (Schummerung)
    var hill=fbm(xx*0.05+11,yy*0.05+4)+Math.abs(u-0.46)*0.5; if (hill>0.72) c=(bayer(xx,yy)<(hill-0.72)*3)?P.e2:P.e3; else if (hill>0.6) c=(bayer(xx,yy)<(hill-0.6)*4)?P.e3:c; else if (hill<0.42) c=(bayer(xx,yy)<(0.42-hill)*3)?P.g5:c;
    if (stain>0.68 && bayer(xx,yy)<(stain-0.68)*4) c=P.e3;                   // Wasserflecken
    return c; });
  // Faltkanten (drei senkrecht, zwei waagrecht)
  for (i=1;i<4;i++){ var fx=ix+rnd(iw*i/4); for (y=iy;y<iy+ih;y++){ b.px(fx,y,M.DN[b.get(fx,y)]); if (bayer(fx+1,y)<0.5) b.px(fx+1,y,M.UP[b.get(fx+1,y)]); } }
  for (i=1;i<3;i++){ var fy=iy+rnd(ih*i/3); for (x=ix;x<ix+iw;x++){ b.px(x,fy,M.DN[b.get(x,fy)]); } }
  // Neretva von Norden nach Süden, mit Flussbiegung im Süden
  for (y=iy;y<iy+ih;y++){ var t=(y-iy)/ih, rx=ix+riverX(t)*iw, hw=0.6+t*0.5; for (x=Math.floor(rx-hw-1);x<=Math.ceil(rx+hw);x++){ if (Math.abs(x+0.5-rx)<=hw+0.2) b.px(x,y,Math.abs(x+0.5-rx)<hw*0.6?P.b2:P.c3); } }
  // Hauptstraße (rot, mit gelbem Saum) am Fluss entlang, Nebenstraßen gelb, kleine Wege grau
  function road(pts,c1,c2){ for (var k=0;k+1<pts.length;k++){ var a=pts[k], q=pts[k+1], n=Math.max(Math.abs(q[0]-a[0])*iw,Math.abs(q[1]-a[1])*ih)*1.5+1; for (var s=0;s<=n;s++){ var px=rnd(ix+lerp(a[0],q[0],s/n)*iw), py=rnd(iy+lerp(a[1],q[1],s/n)*ih); if (c2!==undefined){ b.px(px+1,py,c2); b.px(px,py+1,c2); } b.px(px,py,c1); } } }
  road([[0.40,0],[0.38,0.14],[0.42,0.3],[0.40,0.46],[0.44,0.6],[0.38,0.76],[0.40,0.9],[0.36,1]],P.r3,P.y3);
  road([[0.38,0.14],[0.2,0.2],[0.05,0.16],[0,0.18]],P.y3);
  road([[0.44,0.34],[0.62,0.3],[0.8,0.36],[1,0.32]],P.y3);
  road([[0.40,0.46],[0.22,0.58],[0.1,0.72],[0,0.78]],P.y3);
  road([[0.6,0.5],[0.7,0.64],[0.66,0.8],[0.58,0.9],[0.5,0.83]],P.s2);
  road([[0.52,0.38],[0.66,0.48],[0.84,0.52],[1,0.6]],P.s2);
  road([[0.2,0.2],[0.24,0.0]],P.s2);
  // Mostar: rote Stadtfläche am Fluss
  var mx=ix+rnd(iw*0.45), my=iy+rnd(ih*0.34); for (var by0=-3;by0<=3;by0++) for (var bx0=-3;bx0<=3;bx0++){ if (Math.abs(bx0)+Math.abs(by0)>4 || hash(bx0+9,by0+5)<0.25) continue; b.px(mx+bx0,my+by0,((bx0+by0)&1)?P.r3:P.r2); }
  sign(b,'MOSTAR',mx-26,my-2,P.k1);
  // kleine Orte: Ringe mit unleserlichen Namen
  [[0.24,0.04],[0.12,0.19],[0.78,0.35],[0.21,0.6],[0.62,0.7],[0.86,0.53],[0.4,0.94]].forEach(function(o,k){ var ox=ix+rnd(iw*o[0]), oy=iy+rnd(ih*o[1]); b.px(ox,oy,P.k2); b.px(ox+1,oy,P.r2); b.px(ox,oy+1,P.r2);
    for (var q=0;q<5+(k%3)*2;q++) if (hash(k,q)<0.8) b.px(ox+3+q,oy,P.e1); });
  // die Flussbiegung im Süden: Brückenzeichen und ein kleiner Name
  var by=iy+rnd(ih*0.8), bx=ix+rnd(riverX(0.8)*iw); b.px(bx-2,by-1,P.k1); b.px(bx+2,by-1,P.k1); b.px(bx-2,by+1,P.k1); b.px(bx+2,by+1,P.k1); b.px(bx-1,by,P.k1); b.px(bx+1,by,P.k1);
  for (var q2=0;q2<6;q2++) b.px(bx+5+q2,by+1,(q2%2)?P.e1:P.k2);
  // Kartusche mit Jahr, Legende, Maßstab
  b.rect(ix+iw-22,iy+2,20,9,P.s5); b.hl(ix+iw-22,ix+iw-3,iy+2,P.s6); b.hl(ix+iw-22,ix+iw-3,iy+10,P.e2); b.vl(ix+iw-22,iy+2,iy+10,P.e2); sign(b,'1985',ix+iw-19,iy+4,P.r2);
  b.rect(ix+2,iy+ih-10,16,8,P.s5); b.hl(ix+3,ix+8,iy+ih-8,P.r3); b.hl(ix+3,ix+8,iy+ih-6,P.y3); b.hl(ix+3,ix+8,iy+ih-4,P.s2); for (y=0;y<3;y++) b.hl(ix+10,ix+16,iy+ih-8+y*2,P.e1);
  for (x=0;x<12;x++) b.px(ix+iw-16+x,iy+ih-3,(x>>2)&1?P.k1:P.s6);
  // Glas: zwei schräge Glanzstreifen
  for (i=0;i<12;i++){ b.px(ix+8+i,iy+ih-6-i,P.s6); if (i%2) b.px(ix+10+i,iy+ih-6-i,P.s5); b.px(ix+iw-20+i*0.6|0,iy+14+i,P.s5); }
  b.px(x0+rnd(w/2),y0-3,P.m3); b.line(x0+rnd(w/2),y0-3,x0+6,y0,P.k2); b.line(x0+rnd(w/2),y0-3,x0+w-7,y0,P.k2); }

// ---------------------------------------------------------------- Fotos: Mate mit Hut am Fenstertisch, die Mannschaft, ein Bus, Zdravko jung
function photo(b,x,y,w,h,kind){ var bg=kind==='mate'?R('e1 e2 e3 e4'):R('m1 m2 m3 m4');
  b.rect(x-1,y-1,w+2,h+2,kind==='team'?P.w1:P.k2); b.rect(x,y,w,h,P.s5);
  b.fn(x+1,y+1,w-2,h-2,function(xx,yy){ return ra(bg,0.85-(yy-y)/h*0.55,xx,yy); });
  var cx=x+(w>>1);
  if (kind==='mate'){ b.rect(x+1,y+h-5,w-2,4,P.e1); b.hl(x+1,x+w-2,y+h-6,P.e4);                      // Tisch am Fenster
    b.hl(cx-3,cx+2,y+3,P.k1); b.rect(cx-2,y+1,4,2,P.k1); b.px(cx-1,y+4,P.e4); b.px(cx,y+4,P.e4); b.px(cx-1,y+5,P.e3); b.rect(cx-2,y+6,4,h-11,P.k2); b.px(cx,y+7,P.s5);   // Hut, Gesicht, Anzug
    b.rect(cx+3,y+h-9,2,4,P.s5); b.px(cx+3,y+h-10,P.k2); }                                                // Thermoskanne
  else if (kind==='team'){ for (var r=0;r<2;r++) for (var i=0;i<5;i++){ var px=x+2+i*3+(r?1:0), py=y+3+r*5; b.px(px,py,P.s5); b.rect(px,py+1,2,3,r?P.r3:P.s6); } b.rect(x+1,y+h-3,w-2,2,P.g3); }
  else if (kind==='bus'){ b.rect(x+1,y+h-4,w-2,3,P.m2); b.rect(x+2,y+3,w-5,h-8,P.s6); b.hl(x+2,x+w-4,y+5,P.k2); for (var j=x+3;j<x+w-4;j+=3) b.px(j,y+6,P.k2); b.px(x+4,y+h-4,P.k1); b.px(x+w-6,y+h-4,P.k1); b.hl(x+2,x+w-4,y+h-6,P.b1); }
  else { b.rect(x+1,y+h-5,w-2,4,P.w2); b.ellipse(cx,y+4,1.8,2,P.s5); b.rect(cx-2,y+6,4,h-11,P.s6); b.px(cx-1,y+4,P.k2); b.hl(cx-1,cx+1,y+2,P.k1); } }

// ---------------------------------------------------------------- kleine Malhilfen
function bottle(b,x,by,h,col,kind){ var lab=P.s6;   // Flaschen: Šljivovica (klar), Travarica (grün), Likör (gold), Pelinkovac (dunkel)
  b.rect(x,by-h+4,4,h-4,col); b.vl(x,by-h+4,by-1,M.UP[col]); b.vl(x+3,by-h+4,by-1,M.DN[col]); b.rect(x+1,by-h,2,4,col); b.px(x+1,by-h,P.k2); b.px(x+2,by-h,P.k2);
  if (kind!==2){ b.rect(x,by-h+6,4,3,lab); b.px(x+1,by-h+7,P.r3); } b.px(x+1,by-h+5,P.l0); }
// Bugholzstuhl im Profil (x = Sitzmitte, sy = Sitzhöhe, by = Boden, back = Seite der Lehne)
function chair(b,x,sy,by,back,C){ C=C||R('w0 w1 w2 w3'); var s=back==='L'?-1:1, bx=x+s*5;
  b.line(x-s*4,sy+1,x-s*5,by,C[1]); b.line(bx,sy+1,bx+s,by,C[1]); b.line(x+s,sy+2,x+s*2,by-1,C[0]); b.hl(x-4,x+4,sy+6,C[0]);
  b.hl(x-5,x+5,sy,C[3]); b.hl(x-5,x+5,sy+1,C[2]); b.hl(x-4,x+4,sy+2,C[0]);
  b.vl(bx,sy-13,sy,C[2]); b.px(bx+s,sy-14,C[3]); b.px(bx,sy-14,C[3]); b.line(bx,sy-12,bx-s*3,sy-9,C[1]); b.line(bx-s*3,sy-9,bx-s*3,sy-3,C[1]); b.line(bx-s*3,sy-3,bx,sy-1,C[1]); }
function lamp(b,x,y,top,lit){ b.vl(x,top,y-5,P.k2); b.rect(x-1,y-5,3,2,P.m1);   // Hängelampe mit orangem Glasschirm
  b.poly([[x-2,y-3],[x+3,y-3],[x+8,y+3],[x-7,y+3]],function(xx,yy){ var u=(xx-x+7)/15, c=u<0.3?P.t3:(u<0.65?P.t4:P.t2); if (yy===y-3) c=P.t5; if (lit && yy>=y+1) c=(u>0.2&&u<0.8)?P.y4:P.t4; return c; });
  b.hl(x-7,x+8,y+3,lit?P.y5:P.t1); if (lit){ b.px(x,y+4,P.l1); b.px(x+1,y+4,P.l0); } }

// ---------------------------------------------------------------- Malen
var REG=new Uint8Array(W*H);   // 1 = Glas (Blick nach draußen)
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), x, y, i, night=tod==='night';
  WLF=(weather==='rain'||weather==='grey')?0.6:(night?0:1);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.w1); b.hl(RECT[0],RECT[2]-1,RECT[1]+1,P.e2);
  // Deckenleiste über den Wänden
  [['L',0,80],['R',0,90]].forEach(function(s){ var p0=M.wallPt(SPEC,s[0],s[1],RECT[1]), p1=M.wallPt(SPEC,s[0],s[2],RECT[1]); b.line(rnd(p0[0]),rnd(p0[1]),rnd(p1[0]),rnd(p1[1]),P.w1); });
  REG.fill(0);
  // ---- rechte Wand: Fenster und Glastür (Aluminium), draußen der Bussteig
  for (y=0;y<H;y++) for (x=RECT[2];x<W;x++){ var w=wallUV('R',x,y); if (!w) continue;
    if (inWinUV(w,[WINU[0]-2,WINU[1]+2,WINU[2]-2,WINU[3]+3])){ var inner=inWinUV(w,[WINU[0]+1,WINU[1]-1,WINU[2]+1,WINU[3]]);
      if (inner){ var mid=Math.abs(w.u-(WINU[0]+WINU[1])/2)<1.1, rail=Math.abs(w.v-58)<0.9; if (mid||rail){ b.px(x,y,mid?P.m3:P.m2); continue; } b.px(x,y,outsideAt(x,y,tod,weather)); REG[y*W+x]=1; }
      else b.px(x,y,(w.v>=WINU[3])?((w.v<WINU[3]+1.5)?P.s5:P.m1):((w.u<WINU[0]+1||w.v<WINU[2]+1)?P.m4:P.m2)); continue; }
    if (inWinUV(w,[DOORU[0]-2,DOORU[1]+2,DOORU[2]-2,DOORU[3]])){ var g=inWinUV(w,[DOORU[0]+2,DOORU[1]-2,DOORU[2]+2,DOORU[3]-14]);
      if (g){ var bar=Math.abs(w.v-64)<1.2; if (bar){ b.px(x,y,P.m4); continue; } b.px(x,y,outsideAt(x,rnd(26+(y-14)*0.714),tod,weather)); REG[y*W+x]=1; }
      else { var cc=(w.u<DOORU[0]||w.u>=DOORU[1]||w.v<DOORU[2])?P.m1:((w.v>=DOORU[3]-14)?((w.v<DOORU[3]-13)?P.m4:P.m2):P.m3); b.px(x,y,cc); } } }
  // Spiegelschrift auf dem Fenster (von innen gelesen), Schild an der Tür
  var tmp=new M.Buf(40,7,T); M.microText(tmp,'ZDRAVKO',0,0,P.s6); var tw=M.microWidth('ZDRAVKO');
  for (y=0;y<5;y++) for (x=0;x<tw;x++){ if (tmp.get(x,y)===T) continue; var p=rp(M.wallPt(SPEC,'R',WINU[1]-4-x*0.92,WINU[2]+7+y*1.1)); b.px(p[0],p[1],P.s6); REG[p[1]*W+p[0]]=0; }
  var dp=rp(M.wallPt(SPEC,'R',DOORU[0]+6,DOORU[2]+30)), dw=M.microWidth('VUCI')+3; b.rect(dp[0]-1,dp[1]-1,dw,7,P.r3); b.hl(dp[0]-1,dp[0]+dw-2,dp[1]-1,P.r4); M.microText(b,'VUCI',dp[0]+1,dp[1],P.s6);
  for (y=dp[1]-1;y<dp[1]+6;y++) for (x=dp[0]-1;x<dp[0]+dw-1;x++) REG[y*W+x]=0;
  var hb=rp(M.wallPt(SPEC,'R',DOORU[0]+3,62)), hb2=rp(M.wallPt(SPEC,'R',DOORU[0]+3,70)); b.rect(hb[0],hb[1],2,hb2[1]-hb[1],P.m4); b.px(hb[0]+1,hb[1],P.s6);
  // Gardinenstange und kurzer Schal oben am Fenster
  var cr0=rp(M.wallPt(SPEC,'R',WINU[0]-3,WINU[2]-1)), cr1=rp(M.wallPt(SPEC,'R',WINU[1]+3,WINU[2]-1)); b.line(cr0[0],cr0[1],cr1[0],cr1[1],P.y2);
  for (var uu=WINU[0];uu<WINU[1];uu+=0.5){ var hh=4+Math.round(Math.abs(Math.sin(uu*0.7))*2); for (var vv=0;vv<hh;vv++){ var q=rp(M.wallPt(SPEC,'R',uu,WINU[2]+vv)); var fc=(Math.floor(uu*1.4)%3===0)?P.t2:P.t3; if (vv===hh-1) fc=P.t1; b.px(q[0],q[1],fc); REG[q[1]*W+q[0]]=0; } }
  // Heizkörper unter dem Fenster
  for (uu=WINU[0]+3;uu<WINU[0]+22;uu+=0.5){ for (vv=82;vv<90;vv++){ var q2=rp(M.wallPt(SPEC,'R',uu,vv)); b.px(q2[0],q2[1],(Math.floor(uu*2)%3===0)?P.m1:(vv===82?P.m4:P.m3)); } }
  // ---- Rückwand: alte Landkarte, Fotos
  paintMap(b,MAP.x,MAP.y,MAP.w,MAP.h);
  photo(b,PH.x+2,PH.y+2,10,13,'mate'); photo(b,PH.x+15,PH.y+1,11,9,'team'); photo(b,PH.x+14,PH.y+14,12,9,'bus'); photo(b,PH.x+1,PH.y+19,10,11,'zdravko');
  photo(b,PH.x+5,PH.y+34,15,10,'team');
  b.rect(PH.x+3,PH.y+46,20,2,P.w1); for (i=0;i<4;i++) b.px(PH.x+5+i*5,PH.y+45,P.s6);   // Wimpelbord mit Pokalchen
  b.rect(PH.x+8,PH.y+41,3,4,P.y3); b.px(PH.x+9,PH.y+40,P.y4); b.rect(PH.x+15,PH.y+42,2,3,P.y2);
  // ---- hinter der Theke: Borde mit Rakijaflaschen, Gläser, Preistafel, Uhr, Kalender
  var sx0=152, sx1=232;
  b.rect(sx0,34,sx1-sx0,36,P.w1); b.vl(sx0,34,69,P.w2); b.vl(sx1-1,34,69,P.w0);
  for (x=sx0+1;x<sx1-1;x++) for (y=35;y<69;y++){ var mir=(x>170&&x<214&&y>37&&y<50); b.px(x,y,mir?((fbm(x*0.2,y*0.3)>0.55)?P.s4:P.m3):((fbm(x*0.25,y*0.15)>0.6)?P.w0:P.w1)); }   // Spiegel hinter den Flaschen
  b.rect(170,37,44,1,P.y2); b.rect(170,50,44,1,P.y1);
  [[51,0],[62,1]].forEach(function(sh){ var yb=sh[0], r=M.rng(17+sh[1]*5); b.hl(sx0,sx1-1,yb,P.w4); b.hl(sx0,sx1-1,yb+1,P.w2); b.hl(sx0+1,sx1-2,yb+2,P.k2);
    var xx=sx0+3; while (xx<sx1-6){ var kind=Math.floor(r()*4), hgt=8+Math.floor(r()*4), col=[P.s5,P.g3,P.y3,P.r1][kind]; if (r()<0.22){ b.rect(xx,yb-4,3,4,P.a6); b.hl(xx,xx+2,yb-4,P.s6); xx+=5; continue; } bottle(b,xx,yb,hgt,col,kind===3?2:1); xx+=5+(r()<0.3?1:0); } });
  for (x=sx0+4;x<sx0+18;x+=4){ b.rect(x,44,3,6,P.a6); b.hl(x,x+2,44,P.s6); b.px(x+1,47,P.s5); }      // Biergläser oben auf dem Spiegelbord
  for (x=216;x<sx1-3;x+=5){ b.rect(x,45,3,5,P.s5); b.px(x+1,46,P.s6); }
  // Preistafel
  var pb={x:158,y:22,w:68,h:11}; b.rect(pb.x,pb.y,pb.w,pb.h,P.w3); b.rect(pb.x+1,pb.y+1,pb.w-2,pb.h-2,P.k2); b.hl(pb.x,pb.x+pb.w-1,pb.y,P.w4);
  sign(b,'KAFA',pb.x+5,pb.y+3,P.s5); b.px(pb.x+23,pb.y+5,P.y4); sign(b,'ČAJ',pb.x+27,pb.y+3,P.s4); b.px(pb.x+40,pb.y+5,P.y4); sign(b,'RAKIJA',pb.x+44,pb.y+3,P.s4);
  // Wanduhr und Kalender
  wallClock(b,286,15);
  // ---- Fernseher auf dem Wandarm oben links (Holzgehäuse, gewölbter Schirm)
  var tvx=TV.x, tvy=TV.y; b.line(tvx-4,tvy+16,tvx+6,tvy+16,P.m1); b.line(tvx-4,tvy+17,tvx+6,tvy+17,P.k2); b.line(tvx+6,tvy+16,tvx+9,tvy+14,P.m1);
  b.rect(tvx-4,tvy-2,24,17,P.w2); b.hl(tvx-4,tvx+19,tvy-2,P.w4); b.vl(tvx-4,tvy-2,tvy+14,P.w3); b.vl(tvx+19,tvy-2,tvy+14,P.w0); b.hl(tvx-4,tvx+19,tvy+14,P.w0);
  b.rect(tvx-2,tvy,16,12,P.k1); b.rect(tvx-1,tvy+1,14,10,P.m1); b.rect(tvx+15,tvy+1,3,11,P.m3); b.px(tvx+16,tvy+3,P.k2); b.px(tvx+16,tvy+6,P.k2); b.hl(tvx+15,tvx+17,tvy+9,P.k1);
  b.line(tvx+8,tvy-2,tvx+3,tvy-9,P.m3); b.line(tvx+10,tvy-2,tvx+16,tvy-8,P.m3);
  b.line(tvx+19,tvy+12,tvx+20,tvy+20,P.k2); b.line(tvx+20,tvy+20,tvx+19,tvy+66,P.k2);                       // Kabel in der Ecke
  // ---- linke Wand: Garderobe mit Jacke, Feuerlöscher
  var hk=rp(M.wallPt(SPEC,'L',10,44)); b.rect(hk[0]-6,hk[1],10,2,P.w1); b.px(hk[0]-5,hk[1]+2,P.m3); b.px(hk[0]+1,hk[1]+2,P.m3);
  b.poly([[hk[0]-7,hk[1]+3],[hk[0]-2,hk[1]+3],[hk[0],hk[1]+24],[hk[0]-9,hk[1]+26]],function(xx,yy){ return (xx<hk[0]-5)?P.c1:(((xx+yy)%5===0)?P.c1:P.c2); }); b.vl(hk[0]-4,hk[1]+5,hk[1]+24,P.c0);
  var fe=rp(M.wallPt(SPEC,'L',22,78)); b.rect(fe[0]-2,fe[1]-12,5,13,P.r2); b.vl(fe[0]-2,fe[1]-12,fe[1],P.r3); b.rect(fe[0]-1,fe[1]-15,3,3,P.k2); b.line(fe[0]+1,fe[1]-14,fe[0]+4,fe[1]-10,P.k2); b.rect(fe[0]-1,fe[1]-8,3,3,P.s5);
  var nh=rp(M.wallPt(SPEC,'L',24,46)); for (i=0;i<3;i++){ var nx=nh[0]+i*4, ny=nh[1]+i*2; b.vl(nx,ny-2,ny+22,P.w3); b.px(nx,ny-3,P.w4); b.poly([[nx+1,ny],[nx+4,ny+1],[nx+4,ny+20],[nx+1,ny+19]],function(xx,yy){ return ((yy-ny)%3===0)?P.s3:((i===1)?P.s4:P.s5); }); b.px(nx+2,ny+3,P.r3); }
  b.hl(nh[0]-2,nh[0]+12,nh[1]-1,P.w1);
  // ---- Tisch links mit zwei Stühlen (Resopal, Aluminiumkante), darauf Aschenbecher und Zuckerstreuer
  tableBox(b,TL); var tl0=rp(R3.p(TL.X0,TL.Y0,TL.Z1)), tl1=rp(R3.p(TL.X1,TL.Y0,TL.Z1));
  chair(b,tl0[0]-6,rnd(R3.p(0,82,TL.Z1-6)[1]),rnd(R3.p(0,FY,TL.Z1-6)[1]),'L'); chair(b,tl1[0]+5,rnd(R3.p(0,82,TL.Z1-6)[1]),rnd(R3.p(0,FY,TL.Z1-6)[1]),'R');
  b.ellipse(tl0[0]+10,tl0[1]-1,2.4,0.9,P.m2); b.px(tl0[0]+10,tl0[1]-2,P.s6); b.rect(tl0[0]+20,tl0[1]-5,3,4,P.s6); b.hl(tl0[0]+20,tl0[0]+22,tl0[1]-5,P.m4);
  // ---- zwei Barhocker vor der Theke (Chrom, rotes Kunstleder)
  [162,186].forEach(function(X){ var st=rp(R3.p(X,FY,27)), sy=st[1]-17; b.ellipse(st[0]+0.5,st[1]-0.5,4,1.2,P.m1); b.vl(st[0],sy+3,st[1]-1,P.m3); b.vl(st[0]+1,sy+3,st[1]-1,P.m1); b.hl(st[0]-3,st[0]+4,st[1]-6,P.m3);
    b.rect(st[0]-4,sy,9,3,P.r2); b.hl(st[0]-4,st[0]+4,sy,P.r4); b.hl(st[0]-3,st[0]+3,sy+3,P.m2); });
  // ---- Mates Stuhl am Fenstertisch (leer für die Lebenden)
  chair(b,MATE[0]-1,MATE[1]-13,MATE[1],'L');
  // ---- Hängelampen
  var ct=rnd(R3.p(0,RECT[1],34)[1]); lamp(b,LMP[0][0],LMP[0][1],ct,false); neon(b,false);
  // ---- Licht
  shade(b,0,0,tod,function(x,y){ return !REG[y*W+x]; });
  lamp(b,LMP[0][0],LMP[0][1],LMP[0][1]-5,true); neon(b,true);
  return b; }
function wallClock(b,cx,cy){ b.ellipse(cx+0.5,cy+0.5,3.6,5.4,P.w1); b.ellipse(cx+0.5,cy+0.5,2.7,4.4,P.s5); b.px(cx,cy-4,P.k2); b.px(cx+2,cy,P.k2); b.px(cx,cy+4,P.k2); b.px(cx-2,cy,P.k2);
  b.vl(cx,cy-3,cy,P.k1); b.px(cx+1,cy+1,P.k1); b.px(cx+1,cy+2,P.k1); b.px(cx-1,cy-2,P.s6); }
function neon(b,lit){ var a=R3.p(NEON.X0,RECT[1],NEON.Z), c=R3.p(NEON.X1,RECT[1],NEON.Z), y=rnd(a[1])+2, x0=rnd(a[0]), x1=rnd(c[0]);
  b.hl(x0,x1,y-1,P.m1); b.hl(x0-1,x1+1,y,P.m2); b.hl(x0,x1,y+1,lit?P.l1:P.s5); b.hl(x0+1,x1-1,y+2,lit?P.s6:P.s4); b.px(x0-1,y+1,P.m1); b.px(x1+1,y+1,P.m1); }
// Resopaltisch als Quader: helle Platte mit Muster, Aluminiumkante, ein Mittelfuß
function tableBox(w,t){ var top=function(x,y){ var c=P.e3; if (((x*2+y*7)%17)===0) c=P.e4; else if (((x+y*3)%23)===0) c=P.e2; return c; };
  R3.box(w,t.X0,t.X1,t.Y0,t.Y0+1.6,t.Z0,t.Z1,{top:top,front:P.m4,left:P.m3,right:P.m3});
  var c0=R3.p((t.X0+t.X1)/2,t.Y0+1.6,(t.Z0+t.Z1)/2), c1=R3.p((t.X0+t.X1)/2,FY,(t.Z0+t.Z1)/2); w.rect(rnd(c0[0])-1,rnd(c0[1]),3,rnd(c1[1]-c0[1]),P.m1); w.vl(rnd(c0[0])-1,rnd(c0[1]),rnd(c1[1])-1,P.m3);
  w.rect(rnd(c1[0])-6,rnd(c1[1])-1,13,2,P.m1); w.hl(rnd(c1[0])-6,rnd(c1[0])+6,rnd(c1[1])-1,P.m2); }

// ---------------------------------------------------------------- Ebenen: Theke (vor Zdravko), Fenstertisch (vor Mates Knien)
var BY=0, TT=null;
function layers(S,GS,tod){ var L=[];
  var cr=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1), lay=M.layer(cr[0]-2,cr[1]-24,cr[2]+6,cr[3]+26,cr[1]+cr[3]), w=M.lw(lay);
  var ft=R3.p(CNT.X0,CNT.Y0,CNT.Z1), fl=ft[0]; BY=rnd(ft[1]);
  R3.box(w,CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1,{
    top:function(x,y){ return (hash(x>>1,y)<0.2)?P.s4:P.s5; },
    front:function(x,y){ var yy=y-BY, p=((x-rnd(fl))%9+9)%9, c;
      if (yy<1) return P.m4; if (yy<3) return P.m3; if (yy>=23) return (yy>=25)?P.k2:P.w0;
      c=(p<1)?P.w1:((p===8)?P.w5:pine(x*1.3,y,x,y,0)); if (yy===3) c=P.w1; if (yy>=19 && yy<21) c=P.m2; return c; },
    left:P.w2 });
  var a=R3.p(CNT.X0,CNT.Y0,CNT.Z1), bb=R3.p(CNT.X1,CNT.Y0,CNT.Z1); w.hl(rnd(a[0]),rnd(bb[0]),BY,P.s6);
  // Espressomaschine (Chrom), Tassen obenauf, Siebträger
  var ex=158; w.rect(ex,BY-12,24,12,P.m3); w.hl(ex,ex+23,BY-12,P.m4); w.vl(ex,BY-12,BY-1,P.m4); w.vl(ex+23,BY-12,BY-1,P.m1); w.rect(ex+2,BY-10,20,3,P.r3); w.hl(ex+2,ex+21,BY-10,P.r4);
  w.rect(ex+5,BY-6,4,2,P.k2); w.rect(ex+14,BY-6,4,2,P.k2); w.hl(ex+3,ex+10,BY-5,P.m1); w.hl(ex+12,ex+19,BY-5,P.m1); w.px(ex+11,BY-8,P.y4);
  w.rect(ex+6,BY-3,3,2,P.s6); w.rect(ex+15,BY-3,3,2,P.s6); w.line(ex+23,BY-9,ex+27,BY-3,P.m4);
  for (var c=0;c<4;c++){ w.rect(ex+3+c*5,BY-15,3,3,P.s6); w.px(ex+5+c*5,BY-14,P.s4); }
  // Kasse (mechanisch), Serviettenhalter, Zuckerdose, Gläser
  var kx=196; w.rect(kx,BY-9,15,9,P.m2); w.poly([[kx+1,BY-9],[kx+14,BY-9],[kx+12,BY-13],[kx+3,BY-13]],P.m3); w.rect(kx+4,BY-16,7,3,P.k2); w.px(kx+6,BY-15,P.g5); w.px(kx+8,BY-15,P.g5);
  for (var ky=0;ky<2;ky++) for (var kk=0;kk<4;kk++) w.px(kx+3+kk*3,BY-11+ky,P.s5); w.rect(kx+2,BY-5,11,2,P.m1);
  w.rect(186,BY-5,4,5,P.s6); w.hl(186,189,BY-5,P.m4); w.rect(214,BY-6,3,6,P.a6); w.px(215,BY-4,P.s6); w.rect(219,BY-4,3,4,P.a6);
  w.ellipse(184,BY-1,2,0.8,P.m3);
  shade(lay,lay.ox,lay.oy,tod); L.push(lay);
  // Fenstertisch: Resopalplatte, Aschenbecher, Zuckerstreuer
  var tr=R3.rect(TB.X0,TB.X1,TB.Y0,FY,TB.Z0,TB.Z1), tl=M.layer(tr[0]-2,tr[1]-8,tr[2]+4,tr[3]+10,tr[1]+tr[3]), tw=M.lw(tl);
  tableBox(tw,TB); var t0=rp(R3.p(TB.X0,TB.Y0,TB.Z1)), t1=rp(R3.p(TB.X1,TB.Y0,TB.Z1)); TT=[t0[0],t0[1],t1[0]];
  tw.ellipse(t0[0]+24,t0[1]-1.5,2.4,0.9,P.m2); tw.px(t0[0]+24,t0[1]-2,P.s6); tw.px(t0[0]+25,t0[1]-2,P.k2);
  tw.rect(t0[0]+30,t0[1]-6,3,4,P.s6); tw.hl(t0[0]+30,t0[0]+32,t0[1]-6,P.m4); tw.rect(t0[0]+4,t0[1]-4,5,2,P.s6); tw.px(t0[0]+5,t0[1]-5,P.s6);
  shade(tl,tl.ox,tl.oy,tod); L.push(tl);
  // Gummibaum im Topf vorn links
  var fl2=M.layer(0,82,30,62,142), fw=M.lw(fl2); ficus(fw); if (tod==='day') M.light(fl2,function(x,y){ return -0.3+lampAt(x,y)*0.4; },fl2.ox,fl2.oy); else shade(fl2,fl2.ox,fl2.oy,tod); L.push(fl2);
  return L; }
function ficus(w){ var px=10, by=142, i;
  w.rect(px-8,by-12,17,12,P.t2); w.hl(px-9,px+9,by-13,P.t4); w.hl(px-9,px+9,by-12,P.t3); w.vl(px-8,by-11,by-1,P.t3); w.vl(px+8,by-11,by-1,P.t1); w.hl(px-8,px+8,by-1,P.t0); for (i=0;i<3;i++) w.hl(px-7,px+7,by-9+i*3,(i===1)?P.t1:P.t2);
  w.line(px,by-13,px-1,by-40,P.w1); w.line(px+1,by-13,px+3,by-34,P.w2); w.line(px,by-30,px-6,by-44,P.w1);
  var r=M.rng(57); for (i=0;i<22;i++){ var lx=px-9+Math.floor(r()*20), ly=by-58+Math.floor(r()*40), dir=r()<0.5?-1:1;
    for (var k=0;k<6;k++){ w.px(lx+k*dir,ly+Math.floor(k*0.5),k<2?P.g3:P.g4); w.px(lx+k*dir,ly+1+Math.floor(k*0.5),P.g2); } w.px(lx+dir*2,ly,P.g5); } }

// ---------------------------------------------------------------- jedes Bild: Fernsehbild, Dampf an der Maschine, Fenster (Regen, Bura)
function dyn(fb,v,S,GS){ var t=v.t, weather=M.scn.weather(GS), i;
  // Fernseher: Fußballspiel mit flackerndem Bild
  var sx=TV.x-1, sy=TV.y+1, scene=Math.floor(t/4)%3, fl=0.5+Math.sin(t*23)*0.25+Math.sin(t*7.1)*0.2;
  for (var yy=0;yy<10;yy++) for (var xx=0;xx<14;xx++){ var c;
    if (scene<2){ c=(yy<3)?P.m3:((((xx+Math.floor(t*3))>>2)&1)?P.g4:P.g3); if (yy===3) c=P.s5; if (Math.abs(xx-((t*5)%14))<1 && yy>5) c=P.s6; if ((xx===4||xx===9) && yy>4 && yy<8) c=(xx===4)?P.r3:P.b3; }
    else { c=(yy<6)?P.b1:P.m1; if (xx>4&&xx<9&&yy>1&&yy<8) c=(yy<4)?P.p3:P.k2; if (yy===8) c=P.s5; }
    if (bayer(xx,yy+Math.floor(t*30))<0.12*fl) c=M.UP[c]; if (yy%2 && bayer(xx+3,yy)<0.2) c=M.DN[c];
    fb.px(sx+xx,sy+yy,c); }
  M.glow(fb,TV.x+7,TV.y+6,12,t,0.18);
  // Dampf aus der Lanze der Espressomaschine
  var ph=(t*0.6)%3; if (ph<1.4) for (i=0;i<7;i++){ var q=((t*0.9+i*0.13)%1), px=rnd(185+Math.sin(t*2+i)*1.5+q*3), py=rnd(BY-4-q*14); if (bayer(px,py+Math.floor(t*4))<0.8-q*0.7) fb.px(px,py,q<0.4?P.s6:P.s5); }
  // Bura: ein Plastiksack wirbelt draußen über den Bussteig; Regen: Tropfen am Glas
  if (weather==='bura'){ var k=(t*0.35)%1, bx=rnd(244+k*44), by=rnd(76-Math.sin(k*9)*8-k*10), w=wallUV('R',bx,by); if (w && inWinUV(w,[WINU[0]+2,WINU[1]-2,WINU[2]+2,WINU[3]-2])){ fb.px(bx,by,P.s6); fb.px(bx+1,by,P.s5); fb.px(bx,by+1,P.s4); } }
  if (weather==='rain'){ for (i=0;i<16;i++){ var sp=6+hash(i,12)*12, uu=WINU[0]+2+hash(i,11)*(WINU[1]-WINU[0]-4), vv=WINU[2]+((t*sp+hash(i,13)*40)%(WINU[3]-WINU[2])); var p=M.wallPt(SPEC,'R',uu,vv), p2=M.wallPt(SPEC,'R',uu,vv-2); fb.px(rnd(p[0]),rnd(p[1]),P.m4); fb.px(rnd(p2[0]),rnd(p2[1]),P.m3); } }
  // Staub im Fensterlicht
  if (v.tod==='day' && weather!=='rain') M.dust(fb,t,206,40,60,60,10,P.s5); }

// ---------------------------------------------------------------- Geistersicht: Mates Thermoskanne dampft auf dem Fenstertisch
function ghost(fb,v,S,GS){ var t=v.t; if (!TT) return; var x=TT[0]+12, y=TT[1]-1, gl=0.4+Math.sin(t*1.3)*0.1;
  for (var yy=y-20;yy<y+4;yy++) for (var xx=x-8;xx<x+13;xx++){ var d=Math.hypot((xx-x-2)/10,(yy-y+7)/12); if (d<1 && bayer(xx,yy)<(1-d)*gl){ var k=yy*fb.w+xx; fb.d[k]=M.UP[fb.d[k]]; } }
  for (yy=y-12;yy<y;yy++) for (xx=x-1;xx<x+6;xx++){ var u=xx-x, c=(u<0||u>4)?P.x1:(u===0?P.x6:(u<3?P.x5:P.x4)); if (yy===y-12) c=(u>0&&u<4)?P.x1:T; if (yy===y-11) c=(u<1||u>3)?T:P.x6; if (yy===y-7 && u>=0 && u<=4) c=P.x3; if (c!==T) fb.px(xx,yy,c); }
  fb.rect(x+6,y-9,1,5,P.x4); fb.px(x+5,y-9,P.x4); fb.px(x+5,y-4,P.x4); fb.hl(x-1,x+5,y,P.x2);
  for (var i=0;i<16;i++){ var ph=(t*0.35+i/16)%1, sx=rnd(x+2+Math.sin(t*1.3+i*1.7)*2.5*ph+ph*2), sy=rnd(y-13-ph*22); if (bayer(sx,sy)<1-ph*0.8) fb.px(sx,sy,ph<0.45?P.x6:(ph<0.75?P.x5:P.x4)); }
  var g=0.5+Math.sin(t*1.1)*0.2; for (var a=0;a<14;a++){ var an=a/14*6.283; if (Math.sin(an*2+t*1.5)>-0.1) fb.px(rnd(x+2+Math.cos(an)*(9+g)),rnd(y-6+Math.sin(an)*(5+g*0.5)),P.x3); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>139||x<10||x>310) return false; if (x<24 && y>126) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-4) return false; return true; }
function actorLut(a,S,GS,tod){ if (tod==='day'){ return lampAt(a.x,a.y-24)>0.55?WARM.a:null; } var L=levels(tod), f=Math.min(1,lampAt(a.x,a.y-24))*(L.length-1); return L[Math.round(f)].a; }
var CR=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1), TR=R3.rect(TB.X0,TB.X1,TB.Y0,FY,TB.Z0,TB.Z1);
var DQ=qrect(M.wallQuad(SPEC,'R',DOORU[0]-2,DOORU[1]+2,DOORU[2]-2,DOORU[3]));
M.defineArt('kafic',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{
    door:[DQ[0],DQ[1]+6,Math.min(W-DQ[0],DQ[2]),DQ[3]-6],
    oldmap:[MAP.x-2,MAP.y-4,MAP.w+4,MAP.h+6],
    bar:[CR[0],CR[1]-14,Math.min(CR[2],214-CR[0]),CR[3]+14],
    window_table:[216,TR[1]-12,TR[0]+TR[2]+4-216,TR[3]+12],
    tv:[TV.x-5,TV.y-9,27,27],
    photos:[PH.x,PH.y,PH.w,PH.h+2]
  },
  stands:{ door:[290,124,'R'], oldmap:[82,116,'B'], bar:[184,116,'B'], window_table:[250,118,'R'], tv:[36,118,'L'], photos:[136,116,'B'] },
  actorPos:{ zdravko:[192,95,'L'], mate:[MATE[0],MATE[1],'R'] },
  start:[288,124,'L'], entries:{ westbus:[288,124,'L'] }
});
})(M);
