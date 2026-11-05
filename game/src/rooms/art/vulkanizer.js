/* ===== rooms/art/vulkanizer.js — Vulkanizer Rajić: Werkstatt und Büro (400 px, scrollend).
   Eine Reifenwerkstatt aus Ziegel und Wellblech unter einem Dach mit Stahlbindern und Lichtbändern. Links in der Seitenwand die
   Straßentür mit Glas (draußen die Seitengasse; S.closed: der Rollladen ist halb heruntergelassen). Hinten Reifenstapel und ein
   Reifenregal, die Lochwand mit Werkzeug, eine handgemalte Preistafel, ein alter Kalender, der rote Kompressor auf Rädern; in der
   Mitte die Montiermaschine mit einem Rad darauf (dort arbeitet Vlado). Hinten das Rolltor zum Hof (S.yardOpen: hochgezogen, draußen
   Schotter, Zaun und die Plane über dem TAM). Rechts, abgetrennt durch eine Glaswand mit Aluminiumrahmen, das Büro: Ordner im Regal,
   ein Fenster mit Blick auf die Plane im Hof, der Schreibtisch mit drei abgeschlossenen Schubladen untereinander, Telefon,
   Aschenbecher, Bildschirm; Kata sitzt rechts daneben. S.drawerOpen: die unterste Schublade ist herausgezogen, auf dem Tisch
   liegen die Mappe „TAM 4500“ und ein gefaltetes Blatt. Geistersicht: durch das Holz der Schubladen sieht Mala die Papiere,
   unten schimmert ein Schlüssel mit Holzanhänger. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, VP=[196,56], RECT=[40,16,356,96], F=100, FY=96;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOORU=[6,30,30,96];                                // Straßentür in der linken Wand (Tiefe u0,u1, Höhe vOben,vUnten)
var YD={X0:180,X1:252,Y0:30};                          // Rolltor zum Hof in der Rückwand
var GX=272, GZ=42, GY=34;                              // Glaswand des Büros: X, vordere Tiefe, Oberkante
var OWIN={x0:292,x1:338,y0:30,y1:60};                  // Bürofenster zum Hof
var DESK={X0:288,X1:340,Y0:78,Z0:14,Z1:30};            // Schreibtisch; Schubladenblock links (X0..PED)
var PED=307;
var MACH={X0:110,X1:132,Z0:28,Z1:40};                  // Montiermaschine
var COMP={X0:150,X1:174,Z0:6,Z1:16};                   // Kompressor
var PEG={x0:60,x1:128,y0:36,y1:66};                    // Lochwand mit Werkzeug
var CAL={x0:136,y0:34,w:15,h:22};                      // alter Kalender
var KATA=[380,106];                                    // Kata sitzt: Hüfte x, Füße y
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
function closedOf(S){ return !!(S && S.closed); }
function tarpOffYard(GS){ var r=GS&&GS.rooms&&GS.rooms.vhof; return !!(r && r.tarpOff); }

// ---------------------------------------------------------------- Licht: Leuchtröhren unter den Bindern, Tageslicht von Tür, Tor und Bürofenster
var WARM=M.tintMake(function(r,g,b){ return [r*0.95+18, g*0.84+8, b*0.66]; });
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; },
  shut:function(r,g,b){ var L=lum(r,g,b); return [r*0.42+L*0.08, g*0.42+L*0.08, b*0.48+L*0.1+6]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
var NEONS=[[104,13],[226,13]], DLAMP=[0,0];
var ST={closed:false,yard:false,tod:'day'};
function tubeAt(x,y){ if (ST.closed) return 0; var a=0; for (var i=0;i<NEONS.length;i++){ var n=NEONS[i], dx=(x-n[0])/120, dy=(y-n[1]-62)/70, d=dx*dx+dy*dy; if (d<1) a=Math.max(a,Math.pow(1-d,0.85)); } return a; }
function lampAt(x,y){ var dx=(x-DLAMP[0])/30, dy=(y-DLAMP[1]-8)/20, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,0.9)*0.8:0; }
function dayAt(x,y){ var a=0, d;
  d=Math.hypot((x-24)/70,(y-104)/48); if (d<1) a=Math.max(a,(1-d)*(ST.closed?0.45:0.9));                       // Straßentür
  d=Math.hypot((x-314)/64,(y-66)/40); if (d<1) a=Math.max(a,(1-d)*0.8);                                        // Bürofenster
  if (ST.yard){ d=Math.hypot((x-216)/80,(y-106)/40); if (d<1) a=Math.max(a,(1-d)*0.9); }                        // offenes Tor
  return a; }
function vig(x,y){ var cx=(x-200)/240, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*2.0; }
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.55-(ST.closed?0.7:0)+tubeAt(x,y)*0.6+dayAt(x,y)*0.8+lampAt(x,y)*0.5+vig(x,y)*1.2; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue; var a=lampAt(X,Y); if (bayer(X,Y)<cl((a-0.5)*1.6,0,0.5)) b.d[k]=M.tintPx(WARM,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,Math.max(lampAt(X2,Y2),tubeAt(X2,Y2)*0.8)+(tod==='night'?0:dayAt(X2,Y2)*0.35))*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen
function brick(u,v,x,y){ var bw=11, bh=4, row=Math.floor(v/bh), off=(row&1)*5.5, col=Math.floor((u+off+900)/bw), fu=(u+off+900)-col*bw, fv=v-row*bh;
  if (fv<1||fu<1) return P.s2; var t=hash(col,row), c=t<0.3?P.t1:(t<0.8?P.t2:P.t3); if (fv<2 && fu>2 && t>0.5) c=M.UP[c]; var s=fbm(u*0.05,v*0.08); if (s>0.62 && bayer(x,y)<(s-0.62)*3) c=P.w1; return c; }
function corr(u,v,x,y){ var p=((u+900)%6), c=p<2?P.m2:(p<4?P.m3:(p<5?P.m1:P.m2)); var r=fbm(u*0.04+3,v*0.07)+(v-40)*0.004; if (r>0.7 && bayer(x,y)<(r-0.7)*2.2) c=(p<3)?P.e1:P.e2; if (Math.floor(v)%24===0) c=P.m1; return c; }
function wallBack(u,v,x,y){ var Y=v+RECT[1], X=u+RECT[0];
  if (Y>=93) return (Y===93)?P.m1:P.k2;
  if (X>=GX) return office(X,Y,x,y);
  if (Y>=60) return (Y===60)?P.s4:((Y===61)?P.s2:brick(X,Y,x,y));
  return corr(X,Y,x,y); }
function office(X,Y,x,y){ var f=fbm(X*0.04,Y*0.05), c=(f>0.64 && bayer(x,y)<(f-0.64)*3)?P.g4:P.g5; if (Y<30 && bayer(x,y)<(30-Y)/30) c=P.g4; if (Y>=74) c=(Y===74)?P.w4:((((X+900)%8)<1)?P.w1:P.w2); return c; }
function wallSide(u,v,x,y,sd){ var Y=v+RECT[1], c;
  if (Y>=93) c=(Y===93)?P.m1:P.k2; else if (sd==='R') c=office(u*1.6+400,Y,x,y); else c=(Y>=60)?((Y===60)?P.s4:brick(u*1.8,Y,x,y)):corr(u*1.8+40,Y,x,y);
  return sd==='L'?M.DN[c]:c; }
// Betonboden mit Ölflecken, Reifenspuren, Gully
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, c, n=fbm(X*0.06,Z*0.09);
  c=ra(R('m1 m2 m3 s3'),0.45+(n-0.5)*0.6,x,y); if (X>=GX && Z<GZ) c=((Math.floor((X+900)/9)+Math.floor(Z/9))&1)?P.s3:P.s2;            // Büro: Linoleum
  var oil=fbm(X*0.03+7,Z*0.05+2); if (oil>0.68 && !(X>=GX&&Z<GZ)) c=(oil>0.73)?P.m0:((bayer(x,y)<0.5)?P.m0:P.m1);
  var tr=Math.abs(((X-140)*0.9+Z*0.6)%38); if (tr<2 && Z>20 && X<GX && hash(Math.floor(X/2),Math.floor(Z/3))<0.6) c=M.DN[c];
  if (Math.abs(X-150)<10 && Math.abs(Z-62)<4){ c=((Math.floor(X)+Math.floor(Z*2))&1)?P.k1:P.m1; }
  if ((Math.floor(X+900)%40)<0.8 && X<GX) c=P.m1;                                                                                    // Fugen im Beton
  return c; }
// Decke: Wellblech mit Stahlbindern und einem Lichtband
function ceilTex(xb,d,x,y){ var p=((xb+900)%7), c=p<3?P.m1:(p<5?P.m2:P.m0); if (Math.abs(xb-150)<14) c=(p<3)?P.s3:P.s4; return M.DN[c]; }

// ---------------------------------------------------------------- draußen: der Hof mit dem TAM unter der Plane (durch Tor und Fenster)
function yardAt(x,y,tod,weather,tarpOff,base){ var c, gy=base;
  var SK=weather==='rain'?R('m2 m3 s3'):(weather==='grey'?R('m3 m4 s4'):(tod==='night'?R('k0 k1 n0'):R('b2 b3 b4 b5')));
  c=ra(SK,(y-10)/(gy-10),x,y);
  // Wohnblock hinter dem Zaun
  if (y>gy-34 && x%90<52){ c=((y%4===1)&&(x%5===2))?P.m2:P.s4; if (x%90<1) c=P.s5; }
  // grauer Bretterzaun wie im Hof
  if (y>gy-24){ var bi=Math.floor(x/6), fx=((x%6)+6)%6; c=fx===0?P.w0:(fx===5?P.s1:((hash(bi,2)<0.5)?P.s2:P.e2)); if (y===gy-24+((bi*7)%3)) c=P.s3; if (y===gy-16) c=P.w1; }
  // der TAM von der Seite: unter der Plane ein olivgrüner, durchhängender Buckel mit Seilen, sonst Holzbordwände
  var tx=x-120, top=gy-38+Math.round(Math.sin(tx*0.045)*2);
  if (x>110 && x<300 && y>top && y<gy-6){ var u=(y-top)/Math.max(1,gy-6-top);
    if (!tarpOff){ var d=Math.abs(((tx%30)+30)%30-15)/15, fold=Math.sin(tx*0.33+Math.sin(tx*0.07)*3+u)*(0.25+u*0.75), v=0.8-u*0.5+fold*0.2-(d>0.9?0.15:0);
      c=ra(R('g0 g1 g2 e2 g3 e3'),v,x,y); if (y===top+1) c=P.e3; if (((tx%30)+30)%30===0 && hash(x,y)<0.8) c=P.e3; }
    else { c=(((y-top)%8)===0)?P.w1:((hash(Math.floor(tx/36),Math.floor((y-top)/8))<0.5)?P.w3:P.w2); if (((tx%25)+25)%25<2) c=P.m2; } }
  if (x>110 && x<300 && y>=gy-6 && y<gy){ var wx=((x-120)%54+54)%54; c=(wx>8&&wx<24)?((Math.hypot(wx-16,y-gy+2)<2.5)?P.g2:P.k1):P.k2; }
  // Schotter
  if (y>=gy){ c=(hash(x,y)<0.3)?P.s2:((hash(x+1,y*2)<0.3)?P.s4:P.s3); if (weather==='rain' && hash(x*3,y)<0.1) c=P.m4; }
  return c; }
// Blick durch das offene Rolltor: der TAM von vorn (er steht mit der Front zur Werkstatt), die Plane auf dem Dach
function yardFront(x,y,tod,weather,tarpOff,x0,x1,y0,gy){ var c=yardAt(x+400,y,tod,weather,true,gy), cx=(x0+x1)/2, hw=19, u=x-cx;
  if (y>=gy) return c;
  // Pritsche hinter der Kabine (breiter als die Kabine), darüber die Plane
  if (Math.abs(u)<=hw+3 && y>=gy-46 && y<gy-26){ c=tarpOff?((((y-gy)%6)===0)?P.w1:P.w3):ra(R('g0 g1 g2 e2 g3'),0.75-(y-gy+46)/24*0.5+Math.sin(u*0.6)*0.1,x,y); }
  if (!tarpOff && Math.abs(u)<=hw+4 && y>=gy-54 && y<gy-46+Math.round(Math.abs(u)*0.06)){ c=ra(R('g1 g2 e2 g3 e3'),0.8-(y-gy+54)/10*0.4+Math.sin(u*0.5)*0.12,x,y); if (y===gy-54) c=P.e3; }
  // Kabine: Dach, zwei Scheiben, blaues Blech
  if (Math.abs(u)<=hw-3 && y>=gy-44 && y<gy-26){ var BL=R('c1 c2 c3 c4'); c=ra(BL,0.8-(y-gy+44)/18*0.4,x,y); if (y===gy-44) c=P.c4;
    if (y>=gy-42 && y<gy-33 && Math.abs(u)>1 && Math.abs(u)<hw-5) c=((u+y)%7===0)?P.n4:((y<gy-39)?P.n2:P.n1); }
  // Haube und Grill, Kotflügel mit den Rundscheinwerfern, Stoßstange, Räder
  if (Math.abs(u)<=9 && y>=gy-26 && y<gy-12){ c=(y===gy-26)?P.c4:(((x-cx+20)%2===0 && y>gy-24 && y<gy-14)?P.k1:P.m2); }
  if (Math.abs(u)>9 && Math.abs(u)<=hw && y>=gy-22 && y<gy-12){ c=(y===gy-22)?P.c4:P.c2; var hx=cx+(u<0?-14:14), hy=gy-18; var d2=Math.hypot(x+0.5-hx,y+0.5-hy); if (d2<3.4) c=(d2<2.4)?(d2<1.2?P.s6:P.m4):P.k1; }
  if (Math.abs(u)<=hw+1 && y>=gy-12 && y<gy-9) c=(y===gy-12)?P.m2:P.k1;
  if (Math.abs(u)>=hw-6 && Math.abs(u)<=hw && y>=gy-9) c=(y===gy-9)?P.k2:P.k1;
  if (Math.abs(u)<hw-6 && y>=gy-9 && y<gy-6) c=P.k2;
  return c; }

// ---------------------------------------------------------------- Requisiten
// liegender Reifen (Stapelteil), von vorn gesehen: x Mitte, y Oberkante, rw Halbbreite
function tireFlat(b,cx,y,rw,h){ for (var yy=y;yy<y+h;yy++) for (var xx=cx-rw;xx<=cx+rw;xx++){ var u=(xx-cx)/rw, e=Math.abs(u), c=P.k1; if (e>0.86) c=P.k0; else if (yy===y) c=P.m1; else if (u<-0.45) c=P.m0; else if ((xx+yy*2)%4===0 && yy>y && yy<y+h-1) c=P.k2;
    if (yy===y+h-1) c=P.k0; b.px(xx,yy,c); } }
// stehender Reifen (Seitenansicht): Ring mit Profil, Felge optional
function tireRing(b,cx,cy,r,rim){ b.ellipse(cx+0.5,cy+0.5,r,r,function(x,y){ var d=Math.hypot(x+0.5-cx-0.5,y+0.5-cy-0.5)/r, a=Math.atan2(y-cy,x-cx), c=P.k1;
    if (d>0.92) c=((Math.floor(a*r*1.3)&1)?P.k0:P.k2); else if (d<0.55){ if (rim) c=(d<0.18)?P.m1:((d<0.48)?((Math.floor(a*3)&1)?P.m3:P.m2):P.m4); else return; } else if (d<0.62) c=P.k0; else if (x<cx-r*0.3 && y<cy) c=P.m0;
    return c; }); }
function stackTires(b,cx,by,n,rw){ for (var i=0;i<n;i++) tireFlat(b,cx+((i*7)%3)-1,by-(i+1)*6,rw,6); }

// ---------------------------------------------------------------- Malen
var REG=new Uint8Array(W*H);   // 1 = draußen (Glas, Toröffnung)
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), x, y, i, closed=closedOf(S), yard=!!(S&&S.yardOpen), tOff=tarpOffYard(GS);
  ST.closed=closed; ST.yard=yard; ST.tod=tod;
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  REG.fill(0);
  // Dachbinder (Stahl) quer durch die Halle, mit Leuchtröhren
  [8,40,74].forEach(function(Z){ var a=rp(R3.p(RECT[0],RECT[1],Z)), q=rp(R3.p(RECT[2],RECT[1],Z)), d=rnd((1+Z/F)*4);
    b.rect(a[0],a[1]+2,q[0]-a[0],2,P.m1); b.hl(a[0],q[0],a[1]+2,P.m2); for (x=a[0];x<q[0];x+=d*2){ b.line(x,a[1]+4,x+d,a[1]+4+d,P.m0); b.line(x+d,a[1]+4+d,x+d*2,a[1]+4,P.m0); } b.hl(a[0],q[0],a[1]+4+d,P.m1); });
  NEONS.forEach(function(n){ b.hl(n[0]-16,n[0]+16,n[1]-1,P.m1); b.hl(n[0]-15,n[0]+15,n[1],closed?P.s4:P.l1); b.hl(n[0]-14,n[0]+14,n[1]+1,closed?P.s3:P.s6); b.vl(n[0]-12,n[1]-10,n[1]-2,P.k2); b.vl(n[0]+12,n[1]-10,n[1]-2,P.k2); });
  // ---- linke Wand: Straßentür (Stahlrahmen, Glas), draußen die Gasse; bei S.closed der halbe Rollladen
  for (y=0;y<H;y++) for (x=0;x<RECT[0];x++){ var w=wallUV('L',x,y); if (!inUV(w,[DOORU[0]-3,DOORU[1]+3,DOORU[2]-4,DOORU[3]])) continue;
    var inner=inUV(w,[DOORU[0]+2,DOORU[1]-2,DOORU[2]+2,DOORU[3]-16]);
    if (inner){ var gv=w.v; if (closed && gv<DOORU[2]+30){ b.px(x,y,((Math.floor(gv)%3)===0)?P.m1:P.m3); if (Math.floor(gv)===DOORU[2]+29) b.px(x,y,P.m4); continue; }
      var c=(gv<60)?((weather==='rain')?P.m3:(tod==='night'?P.n1:P.b4)):(gv<74?((w.u%9<5)?P.s4:P.s3):P.m2); if (gv>=58 && gv<60) c=P.t3; b.px(x,y,c); REG[y*W+x]=1; }
    else if (inUV(w,[DOORU[0],DOORU[1],DOORU[2],DOORU[3]])) b.px(x,y,(w.v>=DOORU[3]-16)?((w.v<DOORU[3]-15)?P.m4:P.m2):P.m3);
    else b.px(x,y,(w.u<DOORU[0]||w.v<DOORU[2])?P.m1:P.k2); }
  var kn=rp(M.wallPt(SPEC,'L',DOORU[1]-3,64)); b.rect(kn[0],kn[1],2,5,P.m4); b.px(kn[0],kn[1],P.s6);
  var sg=rp(M.wallPt(SPEC,'L',DOORU[0]+5,DOORU[2]+20)); if (!closed){ b.rect(sg[0]-9,sg[1],17,7,P.g2); b.hl(sg[0]-9,sg[0]+7,sg[1],P.g4); M.microText(b,'RADI',sg[0]-8,sg[1]+1,P.s6); }
  // ---- Rückwand Werkstatt: Lochwand mit Werkzeug, Preistafel, Kalender, Reifenregal
  var pg=PEG; b.rect(pg.x0-1,pg.y0-1,pg.x1-pg.x0+2,pg.y1-pg.y0+2,P.w0);
  for (y=pg.y0;y<pg.y1;y++) for (x=pg.x0;x<pg.x1;x++) b.px(x,y,((x%3===1)&&(y%3===1))?P.w1:((fbm(x*0.1,y*0.1)>0.6)?P.w3:P.w2));
  function tool(x0,y0,kind){ b.px(x0,y0-1,P.m3);
    if (kind===0){ b.vl(x0,y0,y0+13,P.m3); b.rect(x0-1,y0,3,3,P.m2); b.px(x0,y0+1,P.w2); b.rect(x0-1,y0+12,3,3,P.m3); }                        // Gabelschlüssel
    else if (kind===1){ b.vl(x0,y0+3,y0+14,P.w3); b.rect(x0-2,y0,5,3,P.m2); b.hl(x0-2,x0+2,y0,P.m3); }                                   // Hammer
    else if (kind===2){ b.line(x0,y0,x0+2,y0+16,P.m3); b.line(x0+1,y0,x0+3,y0+16,P.m1); }                                                 // Montiereisen
    else if (kind===3){ b.vl(x0,y0,y0+9,P.r3); b.vl(x0,y0+10,y0+14,P.m4); }                                                               // Schraubenzieher
    else { b.ellipse(x0+0.5,y0+4,3,3,P.k2); b.ellipse(x0+0.5,y0+4,1.6,1.6,P.w2); b.vl(x0,y0+7,y0+12,P.k2); } }                            // Zange, Kabelrolle
  [[64,40,0],[69,40,0],[74,40,3],[79,39,1],[86,40,2],[92,40,3],[97,39,4],[106,40,0],[111,40,1],[118,40,2],[123,39,3]].forEach(function(t){ tool(t[0],t[1],t[2]); });
  for (i=0;i<6;i++){ b.rect(63+i*10,58,6,6,[P.r2,P.y2,P.b1,P.g2,P.r3,P.m2][i]); b.hl(63+i*10,68+i*10,58,P.s5); b.rect(64+i*10,60,4,2,P.s5); }   // Dosen auf dem Bord
  b.hl(61,127,64,P.w4); b.hl(61,127,65,P.w1);
  // Preistafel (handgemalt)
  var pt={x:62,y:20,w:66,h:14}; b.rect(pt.x,pt.y,pt.w,pt.h,P.s5); b.hl(pt.x,pt.x+pt.w-1,pt.y,P.s6); b.hl(pt.x,pt.x+pt.w-1,pt.y+pt.h-1,P.s2); b.vl(pt.x+pt.w-1,pt.y,pt.y+pt.h-1,P.s3);
  M.microText(b,'MONTAŽA 10 KM',pt.x+3,pt.y+2,P.b0); M.microText(b,'VULKANIZ. 5 KM',pt.x+3,pt.y+8,P.r2);
  // alter Kalender: Bild mit einem Bergsee, Monatsblatt, vergilbt
  var cx=CAL.x0, cy=CAL.y0; b.px(cx+7,cy-2,P.m3); b.line(cx+7,cy-2,cx+2,cy,P.k2); b.line(cx+7,cy-2,cx+12,cy,P.k2);
  b.rect(cx,cy,CAL.w,CAL.h,P.e4); b.rect(cx+1,cy+1,CAL.w-2,9,P.b3); b.rect(cx+1,cy+6,CAL.w-2,4,P.a3); b.poly([[cx+1,cy+6],[cx+5,cy+2],[cx+8,cy+5],[cx+11,cy+1],[cx+13,cy+6]],P.m3); b.px(cx+11,cy+2,P.s6); b.px(cx+5,cy+3,P.s6);
  for (y=cy+12;y<cy+CAL.h-1;y+=2) for (x=cx+1;x<cx+CAL.w-1;x+=2) b.px(x,y,P.e2); b.px(cx+5,cy+14,P.r2); b.hl(cx,cx+CAL.w-1,cy+11,P.e2);
  for (y=cy;y<cy+CAL.h;y++) for (x=cx;x<cx+CAL.w;x++) if (bayer(x,y)<fbm(x*0.3,y*0.3)*0.4) b.px(x,y,M.DN[b.get(x,y)]);
  // Reifenregal an der Rückwand rechts neben dem Kalender
  b.rect(154,40,22,2,P.m1); b.rect(154,62,22,2,P.m1); b.vl(154,36,93,P.m1); b.vl(175,36,93,P.m1);
  for (i=0;i<3;i++) tireRing(b,159+i*7,52,6,false); for (i=0;i<3;i++) tireRing(b,159+i*7,74,6,false);
  // ---- Rolltor zum Hof
  var yd=YD, ty0=rnd(R3.p(0,yd.Y0,0)[1]);
  b.rect(yd.X0-3,ty0-6,yd.X1-yd.X0+6,6,P.m1); b.hl(yd.X0-3,yd.X1+2,ty0-6,P.m3); b.hl(yd.X0-3,yd.X1+2,ty0-1,P.k2);            // Wickelkasten
  b.vl(yd.X0-2,ty0,95,P.m1); b.vl(yd.X0-1,ty0,95,P.m3); b.vl(yd.X1,ty0,95,P.m3); b.vl(yd.X1+1,ty0,95,P.m1);                     // Führungsschienen
  if (yard){ for (y=ty0;y<96;y++) for (x=yd.X0;x<yd.X1;x++){ b.px(x,y,yardFront(x,y,tod,weather,tOff,yd.X0,yd.X1,ty0,92)); REG[y*W+x]=1; }
    for (x=yd.X0;x<yd.X1;x++){ b.px(x,ty0,P.m2); b.px(x,ty0+1,P.m1); } }
  else { for (y=ty0;y<96;y++) for (x=yd.X0;x<yd.X1;x++){ var sl=(y-ty0)%4, c2=sl===0?P.m1:(sl===1?P.m4:(sl===2?P.m3:P.m2)); var rs=fbm(x*0.07,y*0.05)+(y-60)*0.006; if (rs>0.72 && bayer(x,y)<(rs-0.72)*2) c2=(sl<2)?P.e2:P.e1; if (y>92) c2=P.m1; b.px(x,y,c2); }
    b.rect(rnd((yd.X0+yd.X1)/2)-4,90,8,2,P.k2); }
  // ---- Kompressor (rot, liegender Kessel auf Rädern, Motor obenauf)
  var cp=rp(R3.p(COMP.X0,FY,COMP.Z1)), cq=rp(R3.p(COMP.X1,FY,COMP.Z1)); COMPP=[cp[0],cp[1],cq[0]-cp[0]];
  // ---- Montiermaschine mit Rad (Vlado arbeitet rechts davon)
  machine(b);
  // ---- Reifenstapel hinten links und am Rolltor
  stackTires(b,52,95,7,7); stackTires(b,68,99,5,8); stackTires(b,262,97,6,8); stackTires(b,168,98,3,7);
  tireRing(b,84,92,8,true); tireRing(b,92,94,8,true);
  // ---- Büro: Glaswand mit Aluminiumrahmen, Regal mit Ordnern, Fenster zum Hof
  officeBack(b,tod,weather,tOff);
  glassWall(b);
  officeChair(b,KATA[0],KATA[1]);
  // ---- Licht
  DLAMP=rp(R3.p(DESK.X0+12,DESK.Y0-10,DESK.Z1));
  shade(b,0,0,tod,function(x,y){ return !REG[y*W+x]; });
  if (tod!=='day') for (y=0;y<H;y++) for (x=0;x<W;x++){ if (REG[y*W+x]) b.px(x,y,M.tintPx(M.TINT[tod]||M.TINT.night,b.get(x,y),x,y)); }
  NEONS.forEach(function(n){ if (!closed){ b.hl(n[0]-15,n[0]+15,n[1],P.l1); b.hl(n[0]-14,n[0]+14,n[1]+1,P.s6); } });
  return b; }
var COMPP=[0,0,0];

function machine(b){ var a=rp(R3.p(MACH.X0,FY,MACH.Z1)), q=rp(R3.p(MACH.X1,FY,MACH.Z1)), w=q[0]-a[0], top=a[1]-16, x, y;
  // Gehäuse (blau lackiert), Pedale, Säule mit Montierkopf
  for (y=top;y<a[1];y++) for (x=a[0];x<a[0]+w;x++){ var c=(x===a[0])?P.b2:((x>a[0]+w-3)?P.b0:P.b1); if (y===top) c=P.b3; if (y>a[1]-3) c=P.k2; b.px(x,y,c); }
  b.rect(a[0]+3,a[1]-6,5,2,P.m1); b.rect(a[0]+10,a[1]-6,5,2,P.m1); b.rect(a[0]+2,top+3,w-4,1,P.b0);
  b.rect(a[0]+w-5,top-26,4,26,P.b1); b.vl(a[0]+w-5,top-26,top,P.b2); b.rect(a[0]+w-16,top-27,15,3,P.b1); b.hl(a[0]+w-16,a[0]+w-2,top-27,P.b3); b.rect(a[0]+w-17,top-25,3,6,P.m3);
  // Drehteller mit Klauen und das Rad darauf (Reifen halb abgezogen)
  var cx=a[0]+rnd(w/2)-2, cy=top-2; b.ellipse(cx+0.5,cy,10,2.4,P.m2); b.hl(cx-9,cx+10,cy,P.m4);
  for (var k=0;k<4;k++) b.rect(cx-8+k*5,cy-1,2,2,P.m1);
  b.ellipse(cx+0.5,cy-5,11,3.4,P.k1); b.ellipse(cx+0.5,cy-5.5,7,2,P.m3); b.ellipse(cx+0.5,cy-5.5,3,1,P.m1); b.hl(cx-10,cx+11,cy-8,P.k2); b.hl(cx-8,cx+9,cy-9,P.m0);
  b.line(cx+6,cy-7,cx+14,top-24,P.m4);                                                                       // Montiereisen im Reifen
  b.line(a[0]+w-1,a[1]-8,a[0]+w+10,a[1]-2,P.k2); b.line(a[0]+w+10,a[1]-2,a[0]+w+18,a[1]-1,P.k2);                // Luftschlauch
  MACHR=[a[0]-12,top-28,w+30,a[1]-top+30]; }
var MACHR=[0,0,0,0];

function officeBack(b,tod,weather,tOff){ var x, y, o=OWIN;
  // Fenster zum Hof mit Gitter, draußen die Plane
  b.rect(o.x0-3,o.y0-3,o.x1-o.x0+6,o.y1-o.y0+6,P.s5); b.hl(o.x0-3,o.x1+2,o.y0-3,P.s6); b.hl(o.x0-4,o.x1+3,o.y1+3,P.s6); b.hl(o.x0-4,o.x1+3,o.y1+4,P.s2);
  for (y=o.y0;y<o.y1;y++) for (x=o.x0;x<o.x1;x++){ b.px(x,y,yardAt(x-170,y+24,tod,weather,tOff,o.y1+30)); REG[y*W+x]=1; }
  for (x=o.x0;x<o.x1;x+=7) for (y=o.y0;y<o.y1;y++){ b.px(x,y,P.m1); REG[y*W+x]=0; } for (y=o.y0;y<o.y1;y+=8) for (x=o.x0;x<o.x1;x++){ b.px(x,y,P.m1); REG[y*W+x]=0; }
  b.vl(rnd((o.x0+o.x1)/2),o.y0,o.y1-1,P.s5); for (y=o.y0;y<o.y1;y++) REG[y*W+rnd((o.x0+o.x1)/2)]=0;
  // Regal mit Ordnern an der Rückwand links vom Fenster
  b.rect(276,34,12,58,P.w1); for (var s=0;s<3;s++){ var yb=48+s*16; b.hl(276,287,yb,P.w3); for (x=277;x<287;x+=2){ var cc=[P.b1,P.r2,P.g2,P.y2,P.b2][((x>>1)+s)%5]; b.rect(x,yb-11,2,11,cc); b.px(x,yb-8,P.s6); } }
  // Wandtelefonliste und ein Wimpel ohne Zeichen
  b.rect(342,40,10,13,P.s6); for (y=42;y<52;y+=2) b.hl(343,350,y,P.m3);
  // Tischlampe-Kabel, Steckdose
  b.rect(340,82,4,3,P.s6); b.px(341,83,P.k2); b.px(342,83,P.k2); }

// Bürostuhl (Drehstuhl): Lehne auf Katas Rückenseite (rechts), Säule, Fußkreuz mit Rollen
function officeChair(b,x,fy){ var sy=fy-13, bx=x+6;
  b.rect(x-5,sy,11,3,P.k2); b.hl(x-5,x+5,sy,P.m1);
  b.rect(bx,sy-18,4,17,P.k2); b.vl(bx,sy-18,sy-2,P.m1); b.hl(bx,bx+3,sy-18,P.m2); b.rect(bx+1,sy-1,2,2,P.m1);
  b.vl(x,sy+3,fy-3,P.m2); b.vl(x+1,sy+3,fy-3,P.m0); b.line(x-6,fy-1,x+7,fy-1,P.k1); b.line(x-4,fy-2,x+5,fy-2,P.m1); b.px(x-6,fy,P.k1); b.px(x+7,fy,P.k1); b.px(x,fy,P.k1); }
function glassWall(b){ var y, x;
  // die Glaswand liegt bei X=GX und reicht von der Rückwand bis zur Tiefe GZ: Aluminiumrahmen, unten Blech, oben Glas
  var p0=R3.p(GX,FY,0), p1=R3.p(GX,FY,GZ), t0=R3.p(GX,GY,0), t1=R3.p(GX,GY,GZ);
  for (x=rnd(p0[0]);x<=rnd(p1[0]);x++){ var k=(x-VP[0])/(GX-VP[0]), z=(k-1)*F, yb=VP[1]+(FY-VP[1])*k, yt=VP[1]+(GY-VP[1])*k, ym=VP[1]+(76-VP[1])*k;
    for (y=rnd(yt);y<=rnd(yb);y++){ var c;
      if (y<ym){ var fr=(Math.abs(z-GZ*0.5)<0.9)||(z>GZ-1.2)||(y<yt+1.5); if (fr) c=P.m3; else { c=b.get(x,y); c=M.UP[c]; if (((x+y)%9)===0 || ((x*2+y)%13===0)) c=P.s5; } }
      else c=(y<ym+1.5)?P.m4:((z>GZ-1.2)?P.m3:(((y+x)%5)===0?P.m1:P.m2));
      b.px(x,y,c); } }
  var tp=rp(t1), bp=rp(p1); b.vl(tp[0],tp[1],bp[1],P.m4); b.vl(tp[0]+1,tp[1],bp[1],P.m1); b.line(rnd(t0[0]),rnd(t0[1]),tp[0],tp[1],P.m4); }

// ---------------------------------------------------------------- Ebenen: Schreibtisch (vor Kata), Reifenstapel vorn links
var DR=[[0,0,0,0],[0,0,0,0],[0,0,0,0]], DTOP=[0,0,0], ASH=[0,0], PHONE=[0,0], MON=[0,0];
function layers(S,GS,tod){ var L=[], open=!!(S&&S.drawerOpen); ST.closed=closedOf(S); ST.yard=!!(S&&S.yardOpen); ST.tod=tod;
  var dr=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), dl=M.layer(dr[0]-4,dr[1]-26,dr[2]+10,dr[3]+40,dr[1]+dr[3]), w=M.lw(dl);
  var fx0=R3.p(DESK.X0,DESK.Y0,DESK.Z1), fx1=R3.p(DESK.X1,DESK.Y0,DESK.Z1), fp=R3.p(PED,DESK.Y0,DESK.Z1), fb=R3.p(DESK.X0,FY,DESK.Z1);
  var x0=rnd(fx0[0]), x1=rnd(fx1[0]), xp=rnd(fp[0]), yt=rnd(fx0[1]), yb=rnd(fb[1]);
  // Platte (Holzdekor), Seitenwange links, Schubladenblock, Knieraum mit Blende
  R3.box(w,DESK.X0,DESK.X1,DESK.Y0,DESK.Y0+2,DESK.Z0,DESK.Z1,{top:function(x,y){ return (Math.sin(x*0.5+y*1.7)>0.7)?P.w3:P.w4; },front:P.w2,left:P.w2});
  R3.box(w,DESK.X0,PED,DESK.Y0+2,FY,DESK.Z0,DESK.Z1,{front:P.w3,left:P.w2});
  R3.box(w,PED,DESK.X1,DESK.Y0+2,DESK.Y0+12,DESK.Z0+4,DESK.Z1-1,{front:P.w2});
  R3.box(w,DESK.X1-3,DESK.X1,DESK.Y0+2,FY,DESK.Z0+2,DESK.Z1-1,{front:P.w2});
  w.hl(x0,x1,yt,P.w5); w.hl(x0,x1,yt+2,P.w1);
  // drei Schubladen untereinander, jede mit Griffleiste und Schloss
  var dh=(yb-yt-4)/3;
  for (var i=0;i<3;i++){ var ya=rnd(yt+3+i*dh), yb2=rnd(yt+3+(i+1)*dh)-1, xa=x0+1, xb=xp-1;
    if (i===2 && open){ // unterste Schublade herausgezogen: die Front kommt nach vorn (tiefer und breiter), darüber der offene Kasten mit Papieren
      var ox=-2, oy=4, fw2=xb-xa+3; w.rect(xa,ya,xb-xa+1,yb2-ya+1,P.k1);
      w.poly([[xa+1,ya+1],[xb-1,ya+1],[xb+1,ya+oy],[xa+ox,ya+oy]],P.w1); w.rect(xa+ox+1,ya+oy-2,fw2-3,2,P.k2); w.hl(xa+ox+2,xa+ox+fw2-5,ya+oy-2,P.s5); w.px(xa+ox+4,ya+oy-3,P.s6); w.px(xa+ox+7,ya+oy-3,P.s4);
      w.rect(xa+ox,ya+oy,fw2,yb2-ya+1,P.w3); w.hl(xa+ox,xa+ox+fw2-1,ya+oy,P.w4); w.hl(xa+ox,xa+ox+fw2-1,ya+oy+yb2-ya,P.w1); w.vl(xa+ox+fw2-1,ya+oy,ya+oy+yb2-ya,P.w2);
      w.hl(xa+ox+4,xa+ox+fw2-5,ya+oy+3,P.m3); w.hl(xa+ox+4,xa+ox+fw2-5,ya+oy+4,P.m1); var kx2=rnd(xa+ox+fw2/2); w.rect(kx2-1,ya+oy+6,3,2,P.y2); w.px(kx2,ya+oy+7,P.k1);
      DR[i]=[xa-3,ya-3,xb-xa+6,yb2-ya+10]; continue; }
    w.rect(xa,ya,xb-xa+1,yb2-ya+1,P.w3); w.hl(xa,xb,ya,P.w4); w.hl(xa,xb,yb2,P.w1); w.vl(xb,ya,yb2,P.w2);
    w.hl(xa+4,xb-4,ya+3,P.m3); w.hl(xa+4,xb-4,ya+4,P.m1);                                                     // Griffleiste
    var kx=rnd((xa+xb)/2), ky=ya+Math.max(6,rnd(dh*0.6)); w.rect(kx-1,ky-1,3,3,P.y2); w.px(kx,ky,P.k1); w.px(kx,ky+1,P.k1);   // Schloss
    DR[i]=[xa-1,ya-1,xb-xa+3,yb2-ya+3]; }
  // auf dem Tisch: Bildschirm (zu Kata gedreht), Tastatur, Telefon, Aschenbecher mit Zigarette, Ordner, Lampe
  var mx=KATA[0]-30, my=yt-1; w.poly([[mx,my-13],[mx+9,my-15],[mx+9,my-2],[mx,my-1]],P.m2); w.vl(mx,my-13,my-1,P.m3); w.rect(mx+9,my-16,4,15,P.s4); w.vl(mx+12,my-16,my-2,P.s2); w.hl(mx+9,mx+12,my-16,P.s5);
  w.rect(mx+10,my-14,2,10,P.n1); w.px(mx+10,my-13,P.b3); w.rect(mx+2,my-1,11,1,P.m1); MON=[mx+10,my-14];
  w.rect(mx+14,my-3,9,2,P.s5); w.hl(mx+14,mx+22,my-3,P.s6); for (var kk=0;kk<4;kk++) w.px(mx+15+kk*2,my-2,P.s3);
  var phx=xp+4; w.rect(phx,my-4,9,4,P.r2); w.hl(phx,phx+8,my-4,P.r3); w.rect(phx+1,my-6,7,2,P.r1); w.hl(phx,phx+8,my-7,P.r3); w.px(phx+4,my-2,P.s6); PHONE=[phx,my-7];
  w.line(phx+8,my-3,phx+12,my,P.k2);
  var ax=x0+10; w.ellipse(ax+0.5,my-0.5,3.2,1.2,P.m3); w.hl(ax-2,ax+3,my-1,P.m4); w.px(ax+3,my-2,P.s6); w.px(ax+4,my-2,P.r4); ASH=[ax+4,my-3];
  w.rect(x0+3,my-5,6,5,P.b1); w.vl(x0+3,my-5,my-1,P.b2); w.rect(x0+4,my-3,4,1,P.s6);                         // stehender Ordner
  var lx=x0+20; w.rect(lx-2,my-1,5,1,P.m1); w.line(lx,my-1,lx+2,my-9,P.m2); w.poly([[lx-1,my-11],[lx+6,my-12],[lx+5,my-8],[lx,my-8]],P.g2); w.hl(lx-1,lx+6,my-12,P.g4);
  DLAMP=[lx+3,my-8];
  if (open){ // die Mappe „TAM 4500“, das gefaltete Blatt (die Zeichnung) und der Schlüssel mit dem Holzanhänger auf dem Tisch
    var fpx=xp+16; w.poly([[fpx,my-1],[fpx+15,my-2],[fpx+16,my+1],[fpx+1,my+2]],P.e3); w.hl(fpx+1,fpx+14,my-1,P.e4); w.rect(fpx+4,my-1,7,2,P.s6); w.px(fpx+5,my,P.k2); w.px(fpx+7,my,P.k2); w.px(fpx+9,my,P.k2); w.hl(fpx+1,fpx+15,my+2,P.e1);
    w.poly([[fpx-10,my],[fpx-3,my-2],[fpx-1,my+1],[fpx-8,my+2]],P.s6); w.line(fpx-8,my+1,fpx-3,my-1,P.s4); w.px(fpx-6,my,P.m2); w.px(fpx-5,my,P.m2);
    var kx3=fpx+19; w.px(kx3,my,P.y4); w.px(kx3+1,my,P.y3); w.px(kx3+2,my,P.y3); w.px(kx3+3,my-1,P.y4); w.px(kx3+3,my+1,P.y2); w.px(kx3+4,my,P.y2); w.rect(kx3+5,my-1,4,3,P.w3); w.hl(kx3+5,kx3+8,my-1,P.w4); w.px(kx3+6,my,P.k2); w.px(kx3+7,my,P.k2); }
  DTOP=[x0,yt,x1];
  shade(dl,dl.ox,dl.oy,tod); L.push(dl);
  // Bürostuhl hinter Kata nicht nötig (sie sitzt darauf): Stuhl als Ebene hinter dem Tisch in paint wäre verdeckt, daher hier
  // Reifenstapel vorn links (vor allen, die dahinter vorbeigehen)
  var tl=M.layer(0,96,40,48,143), tw=M.lw(tl); stackTires(tw,14,144,8,12); tireRing(tw,34,136,8,true);
  shade(tl,tl.ox,tl.oy,tod); L.push(tl);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Kompressor zittert, Rauch über dem Aschenbecher, Tageslicht-Staub
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, i, closed=closedOf(S);
  // Kompressor: der Kessel zittert, wenn der Motor läuft (in Abständen)
  var run=!closed && ((t%14)<6), jx=run?((Math.floor(t*30)&1)?1:0):0, jy=run?((Math.floor(t*23)%3===0)?-1:0):0;
  var x0=COMPP[0]-cam+jx, y0=COMPP[1]+jy, w=COMPP[2];
  if (x0>-40 && x0<fb.w+10){ compressor(fb,x0,y0,w,run,t); }
  // Zigarettenrauch über dem Aschenbecher
  for (var n=0;n<9;n++){ var hy=rnd(ASH[1]-((t*5+n*3.2)%22)), hx=rnd(ASH[0]+Math.sin(t*1.1+n*0.8)*2+n*0.25)-cam; if (hy>20 && hx>=0 && hx<fb.w) fb.px(hx,hy,n%2?P.s4:P.s3); }
  // Staub im Licht der Straßentür
  if (v.tod==='day' && !closed) M.dust(fb,t,4-cam,60,50,50,12,P.s5); }
function compressor(fb,x0,by,w,run,t){ var x, y;
  // Räder, Kessel, Motor mit Riemenschutz, Manometer
  fb.rect(x0+2,by-4,4,4,P.k1); fb.rect(x0+w-6,by-4,4,4,P.k1);
  for (y=by-13;y<by-3;y++) for (x=x0;x<x0+w;x++){ var u=(y-(by-13))/10, c=u<0.2?P.r4:(u<0.55?P.r3:(u<0.85?P.r2:P.r1)); if (x===x0||x===x0+w-1) c=P.r1; fb.px(x,y,c); }
  fb.rect(x0+3,by-19,10,6,P.m2); fb.hl(x0+3,x0+12,by-19,P.m3); fb.rect(x0+14,by-21,7,8,P.m1); for (y=by-20;y<by-14;y+=2) fb.hl(x0+15,x0+19,y,P.m3);
  fb.ellipse(x0+w-4.5,by-16,2.2,2.2,P.s6); fb.px(x0+w-5,by-17,P.k1); fb.px(x0+w-4,by-16,P.r3); fb.vl(x0+w-5,by-14,by-13,P.m1);
  if (run){ fb.px(x0+16,by-22,P.s4); } }

// ---------------------------------------------------------------- Geistersicht: Mala sieht durch das Holz der Schubladen
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, open=!!(S&&S.drawerOpen), i;
  function px(x,y,c){ x=rnd(x)-cam; if (x<0||x>=fb.w||y<0||y>=144) return; fb.px(x,rnd(y),c); }
  var a=0.5+Math.sin(t*1.3)*0.2;
  // oben Rechnungen (Blätter mit Zeilen), Mitte Reifenkataloge (Hefte), unten die Mappe mit dem Schlüssel
  var d0=DR[0], d1=DR[1], d2=DR[2];
  for (i=0;i<3;i++) for (var k=0;k<d0[2]-8;k+=2) if (hash(i,k)<0.7) px(d0[0]+4+k,d0[1]+3+i*2,P.x3);
  for (i=0;i<3;i++){ var hx=d1[0]+4+i*5; for (var yy=d1[1]+2;yy<d1[1]+d1[3]-2;yy++) px(hx,yy,(i===1)?P.x4:P.x3); px(hx+1,d1[1]+2,P.x5); }
  if (!open){ var kx=d2[0]+d2[2]/2-2, ky=d2[1]+d2[3]/2;
    for (k=0;k<d2[2]-6;k+=2) px(d2[0]+3+k,ky+2,P.x2);
    // der Schlüssel: Bart, Schaft, Ring, daran ein Holzanhänger mit „31“
    var gl=Math.sin(t*2.1)>0; px(kx-4,ky,P.x6); px(kx-3,ky,P.x6); px(kx-2,ky,P.x5); px(kx-1,ky,P.x5); px(kx-4,ky+1,P.x5); px(kx-2,ky+1,P.x5); px(kx,ky-1,P.x6); px(kx+1,ky-1,P.x5); px(kx,ky+1,P.x5); px(kx+1,ky+1,P.x6); px(kx+2,ky,P.x5);
    px(kx+3,ky,P.x4); px(kx+4,ky,P.x4); for (var q=0;q<5;q++){ px(kx+5+q,ky-1,P.v4); px(kx+5+q,ky,gl?P.v5:P.v4); px(kx+5+q,ky+1,P.v3); }
    for (var gy=-5;gy<=5;gy++) for (var gx=-8;gx<=14;gx++){ var d=Math.hypot(gx/12,gy/5); if (d<1 && bayer(gx+Math.floor(t*3),gy)<(1-d)*a*0.6){ var X=rnd(kx+gx)-cam, Y=rnd(ky+gy); if (X>=0&&X<fb.w){ var kk=Y*fb.w+X; fb.d[kk]=M.UP[fb.d[kk]]; } } } } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S){ if (y<114||y>139||x<10||x>390) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false;
  if (x<42 && y>118) return false;                                                    // Reifenstapel vorn links
  return true; }
function actorLut(a,S,GS,tod){ var x=a.x, y=a.y-24;
  if (tod==='day'){ return lampAt(x,y)>0.55?WARM.a:null; } var L=levels(tod), f=Math.min(1,Math.max(lampAt(x,y),tubeAt(x,y)*0.8))*(L.length-1); return L[Math.round(f)].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOORU[0]-3,DOORU[1]+3,DOORU[2]-4,DOORU[3]));
// Schubladen-Rechtecke als Spots: aus derselben Geometrie wie in layers()
var DSP=(function(){ var fx0=R3.p(DESK.X0,DESK.Y0,DESK.Z1), fp=R3.p(PED,DESK.Y0,DESK.Z1), fb=R3.p(DESK.X0,FY,DESK.Z1), x0=rnd(fx0[0]), xp=rnd(fp[0]), yt=rnd(fx0[1]), yb=rnd(fb[1]), dh=(yb-yt-4)/3, out=[];
  for (var i=0;i<3;i++){ var ya=rnd(yt+3+i*dh), yb2=rnd(yt+3+(i+1)*dh)-1; out.push([x0,ya,xp-x0,yb2-ya+1]); } return out; })();
var DKR=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), YDR=[YD.X0-3,rnd(R3.p(0,YD.Y0,0)[1])-6,YD.X1-YD.X0+6,96-rnd(R3.p(0,YD.Y0,0)[1])+6];
var CPR=R3.rect(COMP.X0,COMP.X1,72,FY,COMP.Z0,COMP.Z1), MQ=(function(){ var a=R3.p(MACH.X0,FY,MACH.Z1), q=R3.p(MACH.X1,FY,MACH.Z1); return [rnd(a[0])-10,rnd(a[1])-46,rnd(q[0]-a[0])+26,46]; })();
var DTP=(function(){ var fx0=R3.p(DESK.X0,DESK.Y0,DESK.Z1); return [rnd(fx0[0])+6,rnd(fx0[1])-8]; })();
M.defineArt('vulkanizer',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{
    door:[DQ[0],DQ[1],DQ[2],DQ[3]],
    yard_door:YDR,
    desk:[DKR[0]+DSP[0][2]+2,DKR[1]-14,DKR[2]-DSP[0][2]-2,DSP[0][1]-DKR[1]+14],
    drawer1:DSP[0], drawer2:DSP[1], drawer3:DSP[2],
    tires:[44,58,30,42],
    machine:MQ,
    compressor:[CPR[0]-2,CPR[1]-4,CPR[2]+4,CPR[3]+4],
    calendar:[CAL.x0-2,CAL.y0-3,CAL.w+4,CAL.h+4],
    window:[OWIN.x0-3,OWIN.y0-3,OWIN.x1-OWIN.x0+6,OWIN.y1-OWIN.y0+6],
    ashtray:[DTP[0],DTP[1],11,8]
  },
  stands:{ door:[32,118,'L'], yard_door:[216,116,'B'], desk:[352,122,'B'], drawer1:[336,122,'B'], drawer2:[336,122,'B'], drawer3:[336,122,'B'],
    tires:[62,116,'B'], machine:[120,116,'B'], compressor:[164,116,'B'], calendar:[144,116,'B'], window:[316,118,'B'], ashtray:[344,122,'B'] },
  actorPos:{ vlado:[116,111,'L'], kata:[KATA[0],KATA[1],'L'] },
  start:[34,118,'R'], entries:{ bulevar:[34,118,'R'], vhof:[216,116,'L'] }
});
})(M);
