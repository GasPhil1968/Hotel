/* ===== rooms/art/terminal.js — Fährhafen und Busbahnhof (480 px, scrollend) =====
   Links das Fährterminal (Betonbau der 70er, „TRAJEKTNA LUKA“); über seinem Dach steht vor dem Marjan der Glockenturm von Sveti Duje.
   Am Kai die große weiße Autofähre, Bug links mit hochgeklapptem Visier: im offenen Autodeck ein Lastwagen und Autos, die Rampe liegt auf dem Kai.
   In der Mitte der Kiosk (Mira), eine Palme, der Mast mit Laterne und Lautsprechern. Rechts die Bussteige unter einem Betondach:
   Abfahrtstafel, die Bank (Epilog: Mala), der Reisebus mit „SARAJEVO“ hinter der Frontscheibe und die Blagajna.
   Dahinter die Hochhäuser der Stadt und der lange Kalksteinrücken des Mosor. Vorn Wasser.
   c2: Tag, Bura, klar und kalt, Wolkenkappe auf dem Mosor. c2_night: kurz vor neun, die Nachtfähre ist hell erleuchtet, der Kiosk zu.
   epi: Morgengrauen, kühles Rosa und Blau, die Laternen gehen gerade aus. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, HZ=84;                   // Horizont (Wasserlinie in der Ferne)
var QB=106, QF=138;                 // hintere Kaikante (Hafenbecken) und vordere Kaikante (Wasser vorn, rechts)
var TERM={x0:0,x1:118,top:42};
var FER={x0:126,x1:284,wl:104};
var KIO={x0:218,x1:254,base:112};
var PALM={x:268,base:112};
var POLE={x:291,base:114};
var CAN={x0:300,x1:480,y0:46,y1:54};
var BOARD={x0:306,x1:372,y0:58,y1:91};
var BENCH={x0:334,x1:366,base:124};
var BUS={x0:372,x1:422,top:70,base:113};
var TICK={x0:446,x1:478,top:64,base:112};
var LAMPS=[[66,112,30],[196,113,30]]; var TUBES=[[322,57],[430,57]];
var TWR=24;                         // Glockenturm von Sv. Duje (Mitte), über dem Terminaldach
var MOON=[446,15];
var PIGEONS=[[182,116,1],[206,118,-1],[294,126,1]];
function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
var CACHE={};
// beleuchtete Fenster: Nachtfarbe je Pixel und wem er gehört (1 Terminal, 2 Fähre) — wird nach dem Umfärben aufgetragen
var LITC=new Uint8Array(W*144), OWN=new Uint8Array(W*144);
var REFX=new Uint8Array(W);         // nachts: Lichtsäulen der Stadt im Hafenwasser (Farbe je Spalte)
// ---------------------------------------------------------------- Licht: weich zwischen Tageszeit-Färbung und warmem Lampenlicht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.60+L*0.12+16, g*0.56+L*0.10+10, b*0.68+L*0.12+28]; },
  dusk:function(r,g,b){ return [r*0.80+18, g*0.58+4, b*0.66+22]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.22+L*0.08, g*0.28+L*0.10, b*0.42+L*0.18+16]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(t){ if (LV[t]) return LV[t]; var a=[], n=5, A=TF[t], B=TF.lamp; for (var i=0;i<n;i++){ (function(k){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],k),lerp(p[1],q[1],k),lerp(p[2],q[2],k)]; })); })(i/(n-1)); } return LV[t]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,tod,Ls,skip){ if (tod==='day'||!TF[tod]) return; var L=levels(tod), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod){ return tod==='day'?'day':(TF[tod]?tod:'dawn'); }
function lightsFor(tod){ if (tod==='day') return [];
  // Laternen, Leuchtröhren, Autodeck, Bus und Schalter; Morgengrauen: der Kiosk hat Licht, die mittlere Laterne ist schon aus (flackert dynamisch)
  var L=[[LAMPS[0][0],LAMPS[0][1]-LAMPS[0][2]+4,26,30,0.5],[TUBES[0][0],72,30,26,0.35],[TUBES[1][0],72,30,26,0.35],[FER.x0+10,FER.wl-16,22,14,0.6],
    [397,104,38,14,0.55],[397,92,22,18,0.35],[462,84,16,16,0.45],[FER.x0+70,70,90,30,0.18],
    [LAMPS[0][0]+4,118,26,9,0.55],[392,124,30,12,0.6],[402,134,22,8,0.45],[TUBES[0][0],114,24,8,0.35],[TUBES[1][0],114,22,7,0.3],[462,116,14,5,0.35]];
  if (tod==='night') L.push([LAMPS[1][0]+5,LAMPS[1][1]-LAMPS[1][2]-2,12,10,0.5],[LAMPS[1][0]+4,118,26,9,0.55],[POLE.x+9,POLE.base-62,16,12,0.5],[POLE.x+14,121,28,9,0.45],
    [56,90,64,18,0.34],[58,112,58,7,0.32],[FER.x0+66,FER.wl-14,84,14,0.2],[FER.x0+2,QB+4,30,6,0.45]);
  else L.push([236,74,24,22,0.6],[236,118,24,7,0.4]);
  return L; }

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod){ var x, y, i, r;
  if (tod==='dawn'){ var Rd=R('n0 n1 n2 b0 v2 v3 d3 d4 d5 d6');
    for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var v=y/HZ, east=x/W; var g=Math.pow(v,1.05)*(0.78+east*0.32)+Math.max(0,east-0.55)*0.12; g+=Math.sin(x*0.013+y*0.05)*0.02; b.px(x,y,ra(Rd,g,x,y)); }
    // rosa beleuchtete Wolkenstreifen
    r=M.rng(5); for (i=0;i<11;i++){ var cx=r()*W, cy=12+r()*44, rx=20+r()*60, ry=1+r()*1.6; for (y=Math.floor(cy-ry);y<=cy+ry;y++) for (x=Math.floor(cx-rx);x<=cx+rx;x++){ var dx=(x-cx)/rx, dy=(y-cy)/ry; if (dx*dx+dy*dy>1||bayer(x,y)<dx*dx) continue; b.px(x,y,dy<0?(cy<30?P.v3:P.d4):(cy<30?P.v2:P.d3)); } }
    for (i=0;i<26;i++){ var sx=Math.floor(hash(i,61)*W*0.6), sy=Math.floor(hash(i,62)*24); b.px(sx,sy,i%3?P.n3:P.n4); }
    return; }
  if (tod==='night'){ var Rn=R('k0 k1 k2 n0 n1 n2');
    for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var vv=0.05+Math.pow(y/HZ,1.45)*0.86+(vn(x*0.018,y*0.07)-0.5)*0.06; b.px(x,y,ra(Rn,vv,x,y)); }
    // dünne Wolkenfetzen, vom Mond von unten angeleuchtet
    r=M.rng(23); for (i=0;i<5;i++){ var cx3=r()*W, cy3=10+r()*36, len=40+r()*70; for (x=Math.floor(cx3-len/2);x<cx3+len/2;x++){ var a=1-Math.abs(x-cx3)/(len/2), yy=Math.round(cy3+Math.sin(x*0.05+i)*1.2); if (bayer(x,yy)<a*0.7) b.px(x,yy,P.n1); if (bayer(x,yy+1)<a*0.35) b.px(x,yy+1,P.n2); } }
    // Sterne (Bura: klare Luft)
    r=M.rng(17); for (i=0;i<300;i++){ var sx2=Math.floor(r()*W), sy2=Math.floor(Math.pow(r(),1.6)*(HZ-20)), q=r(); b.px(sx2,sy2,q<0.1?P.n5:(q<0.42?P.n4:P.n3)); }
    [[118,9],[338,22],[214,4]].forEach(function(s){ b.px(s[0],s[1],P.l1); b.px(s[0]-1,s[1],P.n3); b.px(s[0]+1,s[1],P.n3); b.px(s[0],s[1]-1,P.n3); b.px(s[0],s[1]+1,P.n3); });
    for (y=MOON[1]-13;y<MOON[1]+13;y++) for (x=MOON[0]-15;x<MOON[0]+15;x++){ var dm=Math.hypot(x-MOON[0],y-MOON[1]); if (dm>5 && dm<14 && bayer(x,y)<(14-dm)/26) b.px(x,y,M.UP[b.get(x,y)]); }
    M.moon(b,MOON[0],MOON[1],4); return; }
  var D=R('b0 b1 b2 b3 b4');
  for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var v2=Math.pow(y/HZ,1.2); b.px(x,y,ra(D,0.08+v2*0.92,x,y)); }
  var r2=M.rng(8); for (var j=0;j<6;j++){ var cx2=r2()*W, cy2=8+r2()*30, rx2=30+r2()*70; for (x=Math.floor(cx2-rx2);x<cx2+rx2;x++){ var yy2=Math.round(cy2+Math.sin(x*0.05)*1.2); if (bayer(x,yy2)<0.6-Math.abs(x-cx2)/rx2*0.6) b.px(x,yy2,P.b4); if (bayer(x,yy2+1)<0.3-Math.abs(x-cx2)/rx2*0.3) b.px(x,yy2+1,P.b5); } } }

// ---------------------------------------------------------------- Ferne: Mosor, Hochhäuser, Marjan, Altstadt mit Glockenturm, die Ledana gegenüber
function hazeT(a){ return M.tintMake(function(r,g,b){ return [r*(1-a)+168*a, g*(1-a)+196*a, b*(1-a)+226*a]; }); }
var HAZE1=hazeT(0.3), HAZE2=hazeT(0.22);
// Flutlicht (nachts) und Morgendämmerung für den Turm
var FLOOD=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [L*0.86+30, L*0.66+16, L*0.34+4]; });
function rampLUT(names,lo,hi){ var ramp=R(names), a=new Uint8Array(256); for (var c=0;c<256;c++){ if (c>=M.NCOL){ a[c]=c; continue; } var v=lo+(hi-lo)*M.lum(c)/255; a[c]=ramp[clamp(Math.round(v*(ramp.length-1)),0,ramp.length-1)]; } return a; }
var DAWNTW=rampLUT('n1 v1 v2 v3 v4',0,1);
// Mosor im Osten: langer Kalksteinrücken, rechts am höchsten
function mosY(x){ var t=clamp((x-110)/330,0,1), s=t*t*(3-2*t); return 69-s*38+Math.sin(x*0.041+1.1)*2.2+Math.sin(x*0.13+0.4)*0.9+(vn(x*0.06,2.3)-0.5)*5; }
function paintMosor(b,tod){ var x, y, Rm=tod==='night'?R('k1 k2 n0 n1'):(tod==='dawn'?R('n0 n1 v1 v2 v3'):R('c1 c2 c3 c4 m4'));
  for (x=110;x<W;x++){ var top=mosY(x), ty=Math.round(top), sl=(mosY(x-3)-mosY(x+3))/6;
    for (y=ty;y<HZ;y++){ var d=(y-top)/Math.max(1,HZ-top), g=fbm(x*0.085+d*2.4,y*0.19), gl=vn(x*0.23+y*0.08,y*0.06), v;
      if (tod==='day'){ v=0.56+sl*1.6-d*0.16+(g-0.5)*0.55; if (gl>0.7 && d<0.6) v+=0.22; v+=Math.max(0,d-0.5)*0.6; if (y===ty) v+=0.3; }
      else if (tod==='night'){ v=0.32+sl*1.0-d*0.24+(g-0.5)*0.22; if (y===ty) v=0.9; }
      else { v=0.36+sl*1.0+(g-0.5)*0.3+d*0.14; if (y===ty) v=0.96; }
      var c=ra(Rm,v,x,y); if (tod==='dawn' && y===ty && x>280 && bayer(x,y)<(x-280)/190) c=P.d4; b.px(x,y,c); } }
  // Bura: weiße Wolkenkappe, die über den Kamm quillt und auf der Leeseite zerfasert
  if (tod==='day'){ for (x=296;x<W;x++){ var t2=mosY(x), k=clamp((x-296)/64,0,1), th=k*(2+vn(x*0.09,4.4)*3.5), dr=k*(1+vn(x*0.13,9.1)*4.5+Math.max(0,Math.sin(x*0.23))*2.5);
      if (th+dr<1.2) continue; var ya=Math.round(t2-th), yb=Math.round(t2+dr);
      for (y=ya;y<=yb;y++){ var u=(y-ya)/Math.max(1,yb-ya), e=bayer(x,y), cc=u<0.3?P.s6:(u<0.72?P.b5:P.b4); if (u>0.62 && e<(u-0.62)*2.4) continue; if (y===ya && e<0.4) continue; b.px(x,y,cc); } } }
  // ein paar Lichter der Dörfer am Hang
  if (tod==='night') for (var i=0;i<16;i++){ var lx=330+Math.floor(hash(i,41)*150), ly=Math.round(mosY(lx)+8+hash(i,42)*18); if (ly<HZ-2) b.px(lx,ly,hash(i,43)<0.4?P.y3:P.y2); } }
// Hochhäuser der Stadt hinter den Bussteigen (x, Breite, Oberkante)
var BT=[P.s4,P.e4,P.s5,P.m4,P.s4,P.e3,P.s5,P.m3,P.e4,P.s4,P.s5,P.m4];
var BLK=[[308,13,52],[323,11,42],[336,15,49],[353,10,38],[365,14,47],[381,12,56],[395,15,40],[412,11,51],[425,14,44],[441,12,36],[455,15,50],[471,12,45]];
function paintBlocks(b,tod){ var night=tod==='night', dawn=tod==='dawn', base=HZ+7, x, y;
  // niedrige Häuser am Ufer zwischen den Blöcken
  for (x=300;x<W;x++){ var hh=4+Math.floor(vn(x*0.17,3.3)*7); for (y=HZ-hh;y<base;y++){ var cl=(x%9===0)?P.s3:P.s4, c0=night?P.k2:(dawn?P.v1:M.tintPx(HAZE2,cl,x,y)); if (y===HZ-hh) c0=night?P.k1:(dawn?P.v0:M.tintPx(HAZE2,P.t3,x,y)); else if (night && (y-HZ+hh)%3===2 && hash(x,y)<0.22) c0=P.y3; b.px(x,y,c0); } }
  BLK.forEach(function(q,i){ var bx=q[0], bw=q[1], top=q[2];
    for (y=top;y<base;y++) for (x=bx;x<bx+bw;x++){ var u=x-bx, fl=(y-top-2)%3, win=y>top+2 && fl===1 && u>0 && u<bw-2 && (u%2)===1, c;
      if (night){ c=u===0?P.n0:(u>=bw-2?P.k1:P.k2); if (win){ var h=hash(x*1.7+i,y*0.9); c=h<0.3?(h<0.09?P.y4:P.y3):(h<0.36?P.y2:P.k1); if (h<0.12 && hash(x,3)<0.5) REFX[x]=h<0.05?P.y2:P.y1; } }
      else if (dawn){ c=u===0?P.v2:(u>=bw-2?P.v0:P.v1); if (win){ var h2=hash(x*1.7+i,y*0.9); c=h2<0.1?P.y3:(h2<0.16?P.y2:P.v0); } }
      else { var F=BT[i%BT.length]; c=u===0?M.UP[F]:(u>=bw-2?M.DN[F]:F); if (y>top+2){ if (fl===0) c=u>=bw-2?F:M.UP[F]; else if (win) c=(hash(x,y)<0.15)?P.s3:P.m2; } c=M.tintPx(HAZE2,c,x,y); }
      if (y===top) c=night?P.n0:(dawn?P.v2:P.s5);
      b.px(x,y,c); }
    // Dachaufbauten und Antennen
    if (i%3===0){ b.rect(bx+2,top-2,4,2,night?P.k2:(dawn?P.v1:P.s3)); }
    if (i%4===1){ b.vl(bx+bw-4,top-6,top-1,night?P.k2:(dawn?P.v1:P.m3)); if (night) b.px(bx+bw-4,top-7,P.r3); } });
  // Uferstraße und Kaimauer drüben
  for (x=300;x<W;x++){ b.px(x,base,night?P.n0:(dawn?P.v1:P.s4)); b.px(x,base+1,night?P.k1:(dawn?P.n1:P.s2)); if (night && (x%9)===0) b.px(x,base-1,P.y4); } }
// Marjan (links, hinter der Altstadt) mit dem Fahnenmast auf dem Telegrin
function mjT(x){ return 27+(x<22?(22-x)*0.14:Math.pow((x-22)/100,1.5)*16)+Math.sin(x*0.23)*0.7+(vn(x*0.13,5.5)-0.5)*2.2; }
function paintWest(b,tod){ var x, y, night=tod==='night', dawn=tod==='dawn', G=R('g1 g2 g3 g4');
  for (x=0;x<160;x++){ var top=Math.round(mjT(x)); for (y=top;y<HZ;y++){ var d=(y-top)/20, f=fbm(x*0.25,y*0.4), c;
      if (night) c=ra(R('k1 k2 n0'),0.5-d*0.3+(f-0.5)*0.4+(y===top?0.4:0),x,y);
      else if (dawn) c=ra(R('n0 n1 v1 v2'),0.42-d*0.2+(f-0.5)*0.4+(y===top?0.4:0),x,y);
      else { c=ra(G,0.62-d*0.3+(f-0.5)*0.7+(y===top?0.2:0),x,y); c=M.tintPx(HAZE1,c,x,y); }
      b.px(x,y,c); }
    // Pinien am Kamm
    if (hash(x,7)<0.3){ var py=top-1; b.px(x,py,night?P.k1:(dawn?P.n1:M.tintPx(HAZE1,P.g2,x,py))); } }
  var fx=9, fy=Math.round(mjT(9)); b.vl(fx,fy-7,fy-1,night?P.k2:(dawn?P.n1:P.m3));
  if (!night){ b.px(fx+1,fy-7,P.r3); b.px(fx+2,fy-7,P.r3); b.px(fx+1,fy-6,P.s6); b.px(fx+2,fy-6,P.s6); b.px(fx+1,fy-5,P.b1); b.px(fx+2,fy-5,P.b1); }
  // Dächer der Altstadt und der Riva über dem Terminaldach
  var r=M.rng(91), WT=[P.s4,P.e4,P.s5,P.s3,P.e3,P.s4]; x=0; while (x<124){ var w=5+Math.floor(r()*8), h=3+Math.floor(r()*6), tp=41-h, rf=1+Math.floor(r()*2), wc=WT[Math.floor(r()*WT.length)], yy, xx;
    for (yy=tp;yy<50;yy++) for (xx=x;xx<Math.min(124,x+w);xx++){ var c2=xx===x?M.UP[wc]:(xx===x+w-1?M.DN[wc]:wc); if ((yy-tp)%3===1 && (xx-x)%3===1 && xx<x+w-1) c2=P.m1; if (night) c2=xx===x?P.n0:P.k2; else if (dawn) c2=xx===x?P.v2:P.v1; else c2=M.tintPx(HAZE2,c2,xx,yy); b.px(xx,yy,c2); }
    for (var k=0;k<rf;k++) for (xx=x-1+k;xx<=Math.min(123,x+w-k);xx++){ var c3=k===rf-1?P.t4:P.t3; if (night) c3=P.k1; else if (dawn) c3=P.v0; else c3=M.tintPx(HAZE2,c3,xx,tp-1-k); b.px(xx,tp-1-k,c3); }
    if (night||dawn){ for (var wi=0;wi<2;wi++){ var wx=x+1+Math.floor(r()*(w-2)), wy=tp+1+Math.floor(r()*3); if (r()<(night?0.6:0.3)) b.px(wx,wy,r()<0.5?P.y3:P.y4); } }
    x+=w; }
  paintTower(b,tod); }
// Glockenturm von Sveti Duje: schlank, nach oben offener, Pyramidenhelm
function paintTower(b,tod){ var cx=TWR, x, y, night=tod==='night', dawn=tod==='dawn';
  function put(xx,yy,c){ if (night){ c=M.tintPx(FLOOD,c,xx,yy); if (yy<14 && bayer(xx,yy)<(14-yy)/16) c=M.DN[c]; } else if (dawn){ c=DAWNTW[c]; if (c!==P.n1 && c!==P.k2){ if (xx>=cx+3) c=P.d3; else if (xx===cx+2 && bayer(xx,yy)<0.35) c=P.d3; } } else c=M.tintPx(HAZE2,c,xx,yy); b.px(xx,yy,c); }
  put(cx,1,P.m2); put(cx-1,2,P.m2); put(cx,2,P.m2); put(cx+1,2,P.m2); put(cx,3,P.m2);
  for (y=4;y<16;y++){ var hw=Math.round((y-3)*0.3); for (x=cx-hw;x<=cx+hw;x++) put(x,y,x<cx?P.s5:(x===cx?P.s4:P.s3)); if (hw>0) put(cx-hw,y,P.s6); }
  [[16,23,3,1,3],[23,30,4,2,2],[30,37,4,2,2],[37,44,5,3,1],[44,60,5,1,1]].forEach(function(L){ var y0=L[0], y1=L[1], hw=L[2], n=L[3], ow=L[4], i;
    for (y=y0;y<y1;y++) for (x=cx-hw;x<=cx+hw;x++){ var u=(x-(cx-hw))/(2*hw), c=u<0.35?P.s5:(u<0.75?P.s4:P.s3); if (x===cx-hw) c=P.s6; if (x===cx+hw) c=P.s2; put(x,y,c); }
    for (x=cx-hw-1;x<=cx+hw+1;x++) put(x,y0,x===cx+hw+1?P.s3:P.s6); for (x=cx-hw;x<=cx+hw;x++) put(x,y0+1,P.s2);
    var span=2*hw-1, gap=Math.max(1,Math.floor((span-n*ow)/(n+1)));
    for (i=0;i<n;i++){ var ox=cx-hw+1+gap+i*(ow+gap); for (y=y0+3;y<y1-1;y++) for (x=ox;x<ox+ow;x++) put(x,y,(y===y0+3&&ow>1&&x===ox+ow-1)?P.s2:P.k2); } }); }
// gegenüber, klein und kaum zu erkennen: die alte Ledana mit Sägezahndach und Rampe
function paintLedanaFar(b,tod){ var dawn=tod==='dawn', night=tod==='night', x, y, lx0=284, lw=22;
  function col(d,n,w){ return night?n:(dawn?w:d); }
  for (y=HZ-7;y<HZ;y++) for (x=lx0;x<lx0+lw;x++){ var c2=col(P.s2,P.k2,P.v1); if (y<HZ-5 && ((x-lx0)%5)<((HZ-5-y)+2)) c2=col(P.s1,P.k1,P.v0); if (y>=HZ-4 && y<HZ-2 && ((x-lx0)%4)===1) c2=col(P.m0,P.k1,P.k2); b.px(x,y,c2); }
  b.vl(lx0+18,HZ-12,HZ-7,col(P.s2,P.k2,P.v1)); b.line(lx0+lw,HZ-1,lx0+lw+5,HZ+2,col(P.s2,P.k2,P.v1)); }
function paintFar(b,tod){ REFX.fill(0); paintMosor(b,tod); paintBlocks(b,tod); paintLedanaFar(b,tod); paintWest(b,tod); }
// Hafenwasser
function seaCol(tod,x,y,t){ var key=tod==='dawn'?'dawn':(tod==='night'?'night':'day'), ramp=M.seaRamp(key), d=(y-HZ)/40, s=Math.sin(x*0.11+y*0.9+t*1.4)+Math.sin(x*0.037-t*0.7+y*0.33);
  var v=(key==='night'?0.5:0.62)-d*0.35+s*0.11; var c=M.rampAt(ramp,v,x,y);
  if (key==='night' && REFX[x] && y<QB && (y&1) && Math.sin(y*1.3+t*2.1+x*0.7)>0.35) c=REFX[x];
  if (s>1.55 && (y&1)) c=key==='dawn'?P.d5:(key==='night'?P.n2:P.s6); return c; }
function paintHarbor(b,tod){ for (var y=HZ;y<QB;y++) for (var x=0;x<W;x++){ if (x>=300 && y<HZ+9) continue; b.px(x,y,seaCol(tod,x,y,0)); } }

// ---------------------------------------------------------------- Fährterminal (Betonbau, Glasfront, Beton-Lamellen)
function lit(b,x,y,c,nc,own){ b.px(x,y,c); if (nc===undefined||x<0||x>=W||y<0||y>=144) return; var k=y*W+x; LITC[k]=nc; OWN[k]=own; }
function paintTerminal(b,tod){ var x0=TERM.x0, x1=TERM.x1, top=TERM.top, x, y;
  // Dachplatte mit Rippenblende
  b.rect(x0,top,x1-x0+6,7,P.m3); b.hl(x0,x1+5,top,P.s5); b.hl(x0,x1+5,top+1,P.s4); b.hl(x0,x1+5,top+5,P.m2); b.hl(x0,x1+5,top+6,P.m1);
  for (x=x0+1;x<x1+5;x+=4){ b.vl(x,top+2,top+4,P.s4); b.vl(x+2,top+2,top+4,P.m2); }
  b.hl(x0,x1+5,top+7,P.k2);
  // Schriftzug auf Stelzen
  var label='TRAJEKTNA LUKA', lw=M.textWidth(label), lx=rd((x0+x1)/2-lw/2)+2;
  for (x=lx;x<lx+lw;x+=6) b.vl(x,top-2,top-1,P.m1);
  M.text(b,label,lx,top-10,P.s6,P.m0); M.text(b,label,lx,top-10,P.s6); CACHE.label=[lx,top-10];
  // Fahnenmast
  b.vl(x1-6,top-26,top-1,P.m2); b.px(x1-6,top-27,P.y3);
  // Glasfront: oben die Halle, ein Betonband, unten Eingang und Wartebereich; drinnen Deckenleuchten, Abfahrtstafel, Schalter
  var band=top+29;
  for (y=top+8;y<QB-6;y++) for (x=x0;x<x1;x++){ var fin=((x-x0)%13), c, nc;
    if (fin<3){ c=fin===0?P.s4:(fin===1?P.s3:P.m2); if (y>QB-12) c=P.m1; b.px(x,y,c); continue; }
    if (y===band||y===band+1){ b.px(x,y,y===band?P.s4:P.m2); continue; }
    var up=y<band, refl=((x*0.5+y)%26);
    if (up){ c=(y<top+12)?P.c2:P.c1; if (refl<2.2) c=P.c3; else if (refl<3.4 && bayer(x,y)<0.5) c=P.c3;
      var ly=(y-top-4)%9, lg=ly===0?1:(ly===1?0.65:(ly===2?0.35:(ly===8?0.3:0.1))), lx2=Math.abs(((x+4)%6)-3)/3;
      nc=(y<top+10)?P.k2:(ly===0 && (x%6)===2?P.y5:(bayer(x,y)<lg*(1.1-lx2*0.6)?(lg>0.6?P.y3:P.y2):(bayer(x+1,y)<0.5?P.y1:P.w1))); }
    else { c=P.c0; if (refl<1.6) c=P.c2; nc=bayer(x,y)<0.3?P.y1:P.w1; if (y<band+5) nc=bayer(x,y)<0.55?P.y2:P.y1; if (y>QB-15) nc=(hash(x>>2,9)<0.55)?P.h2:P.w1; else if (y>QB-18) nc=P.w2; }
    lit(b,x,y,c,nc,1); }
  // Spiegelung von Himmel und Fähre in den oberen Scheiben
  for (y=top+8;y<band;y++) for (x=x0;x<x1;x++){ if ((x-x0)%13<3) continue; if (bayer(x,y)<0.25+(band-y)/60) b.px(x,y,tod==='dawn'?P.v2:(tod==='night'?P.c1:P.b2)); }
  // Abfahrtstafel drinnen (über der Glasfront zu sehen)
  var tx=56, ty=top+12; for (y=ty;y<ty+11;y++) for (x=tx;x<tx+28;x++){ if ((x-x0)%13<3) continue; var cb=(y===ty||y===ty+10)?P.m1:P.k1, nb=cb; if (y>ty && y<ty+10 && (y-ty)%3===1 && (x-tx)%4<3 && x>tx+1 && x<tx+26){ cb=(x<tx+8)?P.y2:P.m3; nb=(x<tx+8)?P.y4:P.s5; } lit(b,x,y,cb,nb,1); }
  // Schalter mit Schildern (unten links)
  for (var s=0;s<2;s++){ var sx=8+s*16; for (x=sx;x<sx+10;x++){ if ((x-x0)%13<3) continue; for (y=band+4;y<band+7;y++) lit(b,x,y,P.b1,P.b3,1); } }
  // Eingang mit Vordach, Uhr, Plakat
  b.rect(46,top+34,30,QB-top-34,P.k2);
  for (y=top+35;y<QB-1;y++) for (x=47;x<75;x++){ if (x===61) continue; lit(b,x,y,(x===47||x===74)?P.m1:P.c0,(x===47||x===74)?P.w1:(bayer(x,y)<0.4?P.y3:P.y2),1); }
  b.vl(61,top+35,QB-1,P.m3); b.hl(46,75,top+34,P.m3);
  b.px(58,top+50,P.m4); b.px(64,top+50,P.m4); b.rect(40,top+31,42,3,P.s4); b.hl(40,81,top+31,P.s5); b.hl(40,81,top+33,P.m1);
  b.ellipse(96,top+17,5,5,P.s4); b.ellipse(96,top+17,4,4,P.s6); b.line(96,top+17,96,top+14,P.k1); b.line(96,top+17,98,top+18,P.k1); b.rect(95,top+22,3,3,P.m1);
  b.rect(10,top+36,18,24,P.s5); b.rect(11,top+37,16,12,P.b2); M.prop.ferry(b,12,top+47,14,false,{}); b.rect(11,top+50,16,9,P.s5); M.microText(b,'ANCONA',11,top+51,P.r2); b.hl(10,27,top+36,P.s6);
  // Sockel, Pflanzkübel
  b.rect(x0,QB-6,x1-x0,6,P.m2); b.hl(x0,x1-1,QB-6,P.m3); for (var pk=0;pk<2;pk++){ var px=86+pk*16; b.rect(px,QB-12,10,8,P.m3); b.hl(px,px+9,QB-12,P.s4); M.prop.pot(b,px+5,QB-12,{n:7,h:6,pot:P.m3}); } }

// ---------------------------------------------------------------- die große weiße Autofähre, Bugvisier offen, Rampe auf dem Kai
function rope(b,xa,ya,xb,yb,sag,c,c2){ var n=Math.max(2,Math.abs(xb-xa)); for (var i=0;i<=n;i++){ var t=i/n, x=rd(xa+(xb-xa)*t), y=rd(ya+(yb-ya)*t+Math.sin(Math.PI*t)*sag); b.px(x,y,c); if (c2!==undefined && i%3===1) b.px(x,y+1,c2); } }
function paintFerry(b,tod){ var x0=FER.x0, x1=FER.x1, wl=FER.wl, x, y, i;
  var deck=wl-28, A0=deck-11, B0=A0-10, C0=B0-9;          // Rumpfoberkante 76, Decks A 65, B 55, Brücke 46
  function L(xx,yy,c,nc){ lit(b,xx,yy,c,nc,2); }
  // ---- Rumpf: weiß, blaues Band über der Wasserlinie, ein Streifen rot
  for (x=x0+2;x<=x1;x++){ var t=(x-x0)/(x1-x0), top=deck-(t<0.2?rd(Math.pow((0.2-t)/0.2,1.7)*3):0); if (x>x1-6) top+=rd(Math.pow((x-(x1-6))/6,2)*3);
    for (y=top;y<=wl;y++){ var dy=y-top, c;
      if (dy===0) c=P.s6; else if (dy===1) c=P.s5; else if (dy===2) c=P.s4;
      else if (y>=wl) c=P.r1; else if (y===wl-1) c=P.r2; else if (y>=wl-5) c=(y===wl-5)?P.b2:(y===wl-4?P.b1:P.b0);
      else { var v=(y-top)/(wl-top); c=bayer(x,y)<v*0.8-0.15?P.s4:P.s5; if ((x-x0)%17===0 && bayer(x,y)<0.6) c=P.s4; }
      if (x>=x1-1) c=M.DN[c];
      b.px(x,y,c); } }
  // Bullaugen, Klüsen, Name, Anker
  for (x=x0+24;x<x1-10;x+=5){ if (x>x0+60 && x<x0+70) continue; L(x,deck+5,P.n1,hash(x,5)<0.7?P.y4:P.n1); L(x+1,deck+5,P.c1,hash(x,5)<0.7?P.y3:P.n1); }
  [x0+32,x0+92,x1-16].forEach(function(fx){ b.rect(fx,deck+2,3,2,P.m1); b.px(fx,deck+2,P.k2); });
  M.text(b,'LASTAVICA',x0+28,deck+10,P.b0);
  b.rect(x0+17,deck+3,2,4,P.m1); b.hl(x0+16,x0+19,deck+7,P.m1); b.px(x0+16,deck+6,P.m1); b.px(x0+19,deck+6,P.m1);
  // ---- Bugpforte offen: das Autodeck mit Lastwagen und Auto (Fluchtpunkt hinten in der Mitte)
  var ox0=x0+2, ox1=x0+15, oy0=deck+2, oy1=wl-7, bx0=x0+6, bx1=x0+11, by0=deck+8, by1=deck+15;
  for (y=oy0;y<=oy1;y++) for (x=ox0;x<=ox1;x++){ var c4=P.k1, n4=P.m0;
    if (y>by1){ var fl=(y-by1)/(oy1-by1), xl=lerp(bx0,ox0,fl), xr=lerp(bx1,ox1,fl); if (x>=xl && x<=xr){ c4=P.m0; n4=P.m2; if (Math.abs(x-(lerp(bx0+2,ox0+4,fl)))<0.6 || Math.abs(x-(lerp(bx1-2,ox1-4,fl)))<0.6){ c4=P.y1; n4=P.y3; } } }
    else if (y<by0){ var cl=(by0-y)/(by0-oy0), xl2=lerp(bx0,ox0,cl), xr2=lerp(bx1,ox1,cl); if (x>=xl2 && x<=xr2){ c4=P.k2; n4=P.m1; if ((y-oy0)%3===1 && (x===rd(lerp(bx0+1,ox0+3,cl))||x===rd(lerp(bx1-1,ox1-3,cl)))){ c4=P.m3; n4=P.l1; } } }
    else if (x>=bx0 && x<=bx1){ c4=P.k0; n4=P.m0; }
    L(x,y,c4,n4); }
  // Lastwagen (Heck) und ein Auto davor
  for (y=deck+7;y<deck+16;y++) for (x=x0+8;x<x0+14;x++){ var ct=(y===deck+7)?P.s6:(x===x0+10?P.s3:P.s5); if (y===deck+15) ct=P.k2; L(x,y,ct,M.UP[ct]); }
  L(x0+8,deck+14,P.r2,P.r4); L(x0+13,deck+14,P.r2,P.r4); b.hl(x0+8,x0+13,deck+16,P.k1);
  for (y=deck+16;y<deck+21;y++) for (x=x0+3;x<x0+9;x++){ var ca=(y<deck+18)?(x>x0+3&&x<x0+8?P.k2:P.b1):P.b2; if (y===deck+16) ca=(x>x0+3&&x<x0+8)?P.b1:T; if (ca===T) continue; L(x,y,ca,ca===P.k2?P.m1:M.UP[ca]); }
  L(x0+3,deck+19,P.r3,P.r4); L(x0+8,deck+19,P.r3,P.r4); b.hl(x0+4,x0+7,deck+21,P.k1);
  b.vl(x0+1,oy0,oy1,P.s3); b.hl(x0+1,x0+16,oy0-1,P.s5); b.hl(x0+1,x0+16,oy0-2,P.s6); b.vl(x0+16,oy0,oy1,P.s4);
  CACHE.cardeck=[ox0,oy0,ox1-ox0+1,oy1-oy0+1];
  // Vorschiff mit Poller und Mast, darüber das hochgeklappte Bugvisier an seinem Scharnier
  for (x=x0;x<x0+18;x++){ b.px(x,deck-3,P.s6); b.px(x,deck-2,P.s5); b.px(x,deck-1,P.s4); }
  for (x=x0;x<x0+22;x+=3){ b.vl(x,deck-6,deck-4,P.m3); } b.hl(x0,x0+21,deck-6,P.s4);
  b.vl(x0+22,deck-16,deck-4,P.m2); b.px(x0+22,deck-17,P.m3); CACHE.foreMast=[x0+22,deck-17];
  var hx=x0+15, hy=deck-3;
  var VP=[[hx+1,hy],[hx+4,deck-21],[x0-6,deck-19],[x0-9,deck-8]];
  b.line(x0+20,deck-3,x0+6,deck-13,P.m1); b.line(x0+19,deck-3,x0+5,deck-13,P.k2);
  b.poly(VP,function(xx,yy){ var u=(yy-(deck-21))/18; return u<0.12?P.s6:(bayer(xx,yy)<u*0.6-0.05?P.s4:P.s5); });
  b.line(x0-9,deck-8,hx+1,hy,P.m1); b.line(x0-8,deck-7,hx,hy+1,P.k2); b.line(x0-9,deck-8,x0-6,deck-19,P.m2); b.line(x0-6,deck-19,hx+4,deck-21,P.s6);
  b.line(hx+4,deck-20,hx+1,hy-1,P.s4); for (i=0;i<4;i++) b.px(x0-3+i*5,deck-18-Math.round(i*0.4),P.s4);
  b.rect(hx,hy-1,4,3,P.m1); b.px(hx+1,hy,P.m3);
  // Rampe auf den Kai, Ketten
  b.poly([[x0+2,wl-6],[x0+16,wl-6],[x0-1,QB+1],[x0-18,QB+1]],function(xx,yy){ var u=(yy-(wl-6))/(QB+1-(wl-6)); if (((xx*2+yy*5)%6)===0) return P.m1; return u<0.2?P.m3:(bayer(xx,yy)<0.3?P.m1:P.m2); });
  b.line(x0-18,QB+1,x0+2,wl-6,P.m3); b.line(x0-1,QB+1,x0+16,wl-6,P.k2); b.hl(x0-18,x0-1,QB+2,P.k2); b.hl(x0-17,x0-2,QB+1,P.m3);
  b.hl(x0+2,x0+16,wl-6,P.m4); b.hl(x0+2,x0+16,wl-5,P.k2);
  for (i=0;i<14;i++){ var tq=i/14; if (i%2) continue; b.px(rd(lerp(x0+1,x0-15,tq)),rd(lerp(deck+2,QB-1,tq)),P.m1); b.px(rd(lerp(x0+16,x0-1,tq)),rd(lerp(deck+2,QB-1,tq)),P.m1); }
  // ein weißer Lieferwagen rollt von der Rampe (von vorn)
  var vx=x0-10, vy=QB;
  for (y=vy-9;y<vy;y++) for (x=vx-5;x<=vx+5;x++){ var dyv=y-(vy-9), cv;
    if (dyv===0){ if (Math.abs(x-vx)>3) continue; cv=P.s6; } else if (dyv<4){ cv=(Math.abs(x-vx)>4)?P.s4:(dyv===1?P.c2:P.c1); if (dyv<4 && Math.abs(x-vx)<=4 && (x-vx)===dyv-2) cv=P.b3; if (Math.abs(x-vx)===5) cv=P.s4; }
    else if (dyv<8){ cv=x<vx-3?P.s6:(x>vx+3?P.s4:P.s5); if (dyv===5 && Math.abs(x-vx)<=2) cv=P.m1; if (dyv===6 && (x===vx-4||x===vx+4)) cv=P.y3; } else cv=P.m2;
    L(x,y,cv,(dyv===6 && (x===vx-4||x===vx+4))?P.l1:undefined); }
  L(vx-4,vy-3,P.s6,P.l1); L(vx+4,vy-3,P.s6,P.l1); b.rect(vx-5,vy,2,1,P.k1); b.rect(vx+4,vy,2,1,P.k1); b.hl(vx-3,vx+3,vy,P.k2);
  // ---- Aufbauten: drei Decks mit Fensterbändern, Rettungsboote, Brücke, Mast, Schornstein
  function block(xa,xb,ya,yb,rake,wy,wh,kind){ var xx, yy;
    for (yy=ya;yy<=yb;yy++){ var xl=xa+rd((yb-yy)*rake); for (xx=xl;xx<=xb;xx++){ var c=P.s5; if (yy===ya) c=P.s6; else if (yy===yb) c=P.s3; else if (xx<=xl+1) c=P.s6; else if (xx>=xb-1) c=P.s4; b.px(xx,yy,c); } }
    for (yy=wy;yy<wy+wh;yy++){ var xl2=xa+rd((yb-yy)*rake)+3; for (xx=xl2;xx<=xb-3;xx++){ var cell=Math.floor((xx-xl2)/5), mull=((xx-xl2)%5)===4, c2, n2;
        if (mull){ b.px(xx,yy,P.s4); continue; }
        c2=(yy===wy)?P.c2:P.n1; if (kind!=='C' && yy===wy && ((xx+yy)%9)<2) c2=P.b3; if (kind==='C') c2=(yy===wy)?P.c1:P.k2;
        var on=hash(cell*3+wh,yy*0+kind.charCodeAt(0))<(kind==='C'?0.4:0.82); n2=on?((yy===wy)?P.y5:(hash(xx,yy)<0.5?P.y4:P.y3)):(kind==='C'?P.k2:P.n1);
        L(xx,yy,c2,n2); } } }
  block(x0+22,x1-8,A0,deck-1,0.35,A0+3,3,'A');
  block(x0+32,x1-24,B0,A0-1,0.45,B0+3,3,'B');
  block(x0+38,x0+76,C0,B0-1,0.7,C0+2,3,'C');
  b.hl(x0+34,x0+80,C0,P.s6); b.hl(x0+34,x0+80,C0+1,P.s4); b.px(x0+34,C0+2,P.s4); b.px(x0+80,C0+2,P.s3);   // Brückennocken
  // Reling
  function rail(xa,xb,yy){ for (var xx=xa;xx<=xb;xx++){ b.px(xx,yy,P.s4); if ((xx-xa)%3===0){ b.px(xx,yy+1,P.m3); b.px(xx,yy+2,P.m3); } } }
  rail(x0+22,x0+35,A0-3); rail(x1-22,x1-8,A0-3); rail(x0+33,x0+40,B0-3); rail(x0+16,x0+22,deck-6);
  // Rettungsboote in den Davits
  [x0+42,x0+62,x0+86,x0+108].forEach(function(lx){ b.rect(lx,A0-5,13,3,P.t4); b.hl(lx+1,lx+11,A0-6,P.s6); b.hl(lx,lx+12,A0-5,P.y4); b.hl(lx+1,lx+11,A0-3,P.t2); b.px(lx,A0-3,T); b.px(lx+12,A0-3,P.t1);
    b.vl(lx-1,A0-9,A0-4,P.m2); b.vl(lx+13,A0-9,A0-4,P.m2); b.px(lx,A0-9,P.m2); b.px(lx+12,A0-9,P.m2); });
  // Schornstein, leicht nach hinten geneigt, mit Farbband
  var fx0=226, ft=27; for (y=ft;y<B0;y++){ var off=rd((B0-y)*0.14), xl3=fx0+off, xr3=xl3+12; for (x=xl3;x<=xr3;x++){ var cf=x<xl3+2?P.s6:(x>xr3-2?P.s3:P.s5); if (y<ft+2) cf=y===ft?P.m1:P.k2; else if (y>=ft+4 && y<ft+8) cf=(y===ft+4)?P.a5:(x>xr3-2?P.a2:P.a3); b.px(x,y,cf); } }
  // Mast mit Radar
  var mx=x0+60; b.vl(mx,C0-17,C0-1,P.m2); b.vl(mx+1,C0-12,C0-1,P.m1); b.hl(mx-3,mx+3,C0-13,P.m2); b.rect(mx-5,C0-8,11,1,P.m3); b.rect(mx-1,C0-7,3,2,P.m1);
  b.line(mx,C0-16,x0+22,deck-16,P.m2); b.line(mx,C0-15,fx0+2,ft+2,P.m1);
  CACHE.mast=[mx,C0-18];
  // Heck: Flaggenmast
  b.vl(x1-4,A0-12,A0-1,P.m2); b.rect(x1-3,A0-12,5,1,P.r3); b.rect(x1-3,A0-11,5,1,P.s6); b.rect(x1-3,A0-10,5,1,P.b1);
  // Lichter für die Nacht: Decksleuchten, Topplicht, Seitenlicht
  for (x=x0+24;x<x1-10;x+=7) L(x,A0-1,P.s5,P.y5); for (x=x0+34;x<x1-26;x+=7) L(x,B0-1,P.s5,P.y5);
  L(mx,C0-18,P.m3,P.l1); L(x0+34,C0+2,P.s4,P.r4); L(x0+22,deck-17,P.m3,P.l1); L(x1-4,A0-13,P.m2,P.l0);
  // Festmacher zu den Pollern
  rope(b,x0+33,deck+3,154,QB-5,3,P.e3,P.e1); rope(b,x0+93,deck+3,214,QB-5,2,P.e3,P.e1); rope(b,x1-15,deck+3,266,QB-5,2,P.e3,P.e1); }

// ---------------------------------------------------------------- Kai, Pflaster, Poller, Wasser vorn
function slab(x,y){ var row=Math.floor((y-QB)/9+((y-QB)>18?0.5:0)), off=(row&1)*11, sw=22+((y-QB)>16?6:0), col=Math.floor((x+off)/sw), fx=(x+off)-col*sw, fy=(y-QB)%9;
  if (fy===0 || fx<1) return P.m2; var t=hash(col,row), c=t<0.3?P.s2:(t<0.85?P.s3:P.s4); if (fy===1 && fx>2) c=M.UP[c]; if (hash(x>>1,y>>1)<0.03) c=M.DN[c]; return c; }
function asphalt(x,y){ var c=(hash(x>>1,y>>1)<0.5)?P.m2:P.m1; if (hash(x,y)<0.04) c=P.m3; return c; }
function suitcase(b,x,by,w,h,col){ b.rect(x,by-h,w,h,col); b.vl(x,by-h,by-1,M.UP[col]); b.vl(x+w-1,by-h,by-1,M.DN[col]); b.hl(x,x+w-1,by-h,M.UP[col]); b.hl(x+1,x+w-2,by-h-1,P.k2); b.px(x+1,by-h-2,P.k2); b.px(x+w-2,by-h-2,P.k2); b.hl(x+1,x+w-2,by-h-3,P.k2); b.px(x+1,by,P.k1); b.px(x+w-2,by,P.k1); }
function paintQuay(b,tod){ var x, y;
  for (y=QB;y<144;y++) for (x=0;x<W;x++){ if (x>=276 && y>QF) continue; var c=(x<CAN.x0-4)?slab(x,y):asphalt(x,y); if (y===QB) c=P.s4; else if (y===QB+1) c=P.m1; else if (y===QB+2 && x<CAN.x0) c=P.y3; b.px(x,y,c); }
  // Spuren zur Rampe: aufgemalte Linien und Pfeile (flach, damit die Lauffläche ruhig bleibt)
  for (x=112;x<206;x++){ if ((x>>2)%3===2) continue; if (bayer(x,115)<0.7) b.px(x,115,M.UP[b.get(x,115)]); if (bayer(x,124)<0.7) b.px(x,124,M.UP[b.get(x,124)]); }
  [[150,119],[186,119]].forEach(function(a){ var ax=a[0], ay=a[1]; for (var k=0;k<7;k++){ b.px(ax+k,ay,M.UP[b.get(ax+k,ay)]); } b.px(ax+1,ay-1,M.UP[b.get(ax+1,ay-1)]); b.px(ax+1,ay+1,M.UP[b.get(ax+1,ay+1)]); b.px(ax+2,ay-2,M.UP[b.get(ax+2,ay-2)]); b.px(ax+2,ay+2,M.UP[b.get(ax+2,ay+2)]); });
  // Busbuchten: weiße Markierungen auf dem Asphalt, Bordstein vor den Steigen
  for (x=CAN.x0;x<W;x++){ b.px(x,QB+10,P.s4); b.px(x,QB+11,P.m3); }
  [[368,1],[440,1]].forEach(function(q){ for (y=QB+12;y<QF;y++){ var xx=q[0]+Math.round((y-QB-12)*0.35); b.px(xx,y,P.s4); b.px(xx+1,y,P.s3); } });
  for (x=CAN.x0;x<W;x+=7) b.hl(x,x+3,QB+24,P.y3);
  M.microText(b,'1',318,QB+3,P.s4); M.microText(b,'2',346,QB+3,P.s4); M.microText(b,'3',392,QB+3,P.s5);
  // Kaikante vorn (rechts) und Wasser
  for (x=276;x<W;x++){ b.px(x,QF,P.s4); b.px(x,QF-1,P.y3); b.px(x,QF+1,P.m1); for (y=QF+2;y<144;y++) b.px(x,y,seaCol(tod,x,y,0)); }
  b.vl(276,QF-1,143,P.m1); b.vl(277,QF-1,143,P.m2);
  [154,214,266].forEach(function(px){ M.prop.bollard(b,px,QB+5); });
  // Taubündel am Poller
  for (var a=0;a<18;a++){ var ang=a/18*Math.PI*2; b.px(rd(160+Math.cos(ang)*4),rd(QB+5+Math.sin(ang)*1.2),a%3?P.e3:P.e2); }
  [[100,128],[250,132]].forEach(function(q){ b.ellipse(q[0],q[1],5,1.6,P.m1); b.ellipse(q[0],q[1],3.6,1,P.m2); b.hl(q[0]-2,q[0]+2,q[1],P.m1); });
  // Gepäck vor dem Eingang
  suitcase(b,32,QB+1,6,8,P.r2); suitcase(b,39,QB+1,7,5,P.c2); b.rect(26,QB-4,5,5,P.g2); b.hl(26,30,QB-4,P.g3); b.px(28,QB-5,P.k2);
  // Abfalleimer neben der Bank, Gepäckwagen am Terminal
  b.rect(BENCH.x1+5,BENCH.base-12,6,12,P.g2); b.hl(BENCH.x1+5,BENCH.x1+10,BENCH.base-12,P.g4); b.rect(BENCH.x1+4,BENCH.base-13,8,2,P.m3);
  var gx=84, gy=116; b.rect(gx,gy-14,2,14,P.m3); b.hl(gx,gx+16,gy-1,P.m3); b.rect(gx+2,gy-9,13,8,P.r2); b.hl(gx+2,gx+14,gy-9,P.r3); b.rect(gx+4,gy-14,9,5,P.b1); b.hl(gx+4,gx+12,gy-14,P.b2); b.ellipse(gx+4,gy+1,1.6,1.6,P.k1); b.ellipse(gx+14,gy+1,1.6,1.6,P.k1);
  // Schatten unter dem Betondach
  for (y=QB;y<QF;y++) for (x=CAN.x0;x<W;x++){ if (bayer(x,y)<0.55-(y-QB)/70) b.px(x,y,M.DN[b.get(x,y)]); } }

// ---------------------------------------------------------------- Kiosk (Rückwand im Bild, Front als Ebene), Palme, Mast
function paintKioskBack(b){ var x0=KIO.x0, x1=KIO.x1; b.rect(x0+2,58,x1-x0-4,KIO.base-58,P.w0);
  var cols=[P.r2,P.y3,P.b2,P.s5,P.g3,P.r3,P.c3,P.e3]; for (var s=0;s<3;s++){ var sy=62+s*6; b.hl(x0+3,x1-4,sy+4,P.w2); for (var x=x0+4;x<x1-4;x+=2) b.rect(x,sy,2,4,cols[(x*3+s*5)%cols.length]); }
  b.rect(x1-11,62,6,7,P.s5); b.px(x1-9,64,P.r2); }
function paintPalm(b){ var x=PALM.x, by=PALM.base, h=58, r=M.rng(77);
  b.ellipse(x,by,6,1.6,P.m1); for (var i=0;i<h;i++){ var t=i/h, cx=x+Math.round(Math.sin(t*1.3)*3), y=by-i, w=t<0.08?4:3; for (var k=-w;k<w;k++) b.px(cx+k,y,k<-1?P.w3:((i+k*2)%4===0?P.w1:P.w2)); if (i%4===0) b.hl(cx-w,cx+w-1,y,P.w1); }
  var tx=x+Math.round(Math.sin(1.3)*3), ty=by-h;
  for (var f=0;f<14;f++){ var a=-Math.PI*0.98+f/13*Math.PI*0.96+(r()-0.5)*0.2, L=16+r()*12;
    for (var s=0;s<L;s++){ var u=s/L, px=tx+Math.cos(a)*s*1.1, py=ty+Math.sin(a)*s*0.6+u*u*L*0.5; b.px(rd(px),rd(py),u<0.3?P.g2:P.g3); if (s>2 && s%2===0){ b.px(rd(px),rd(py)+1,P.g2); b.px(rd(px)+(Math.cos(a)<0?-1:1),rd(py)+2,u<0.7?P.g4:P.g2); b.px(rd(px),rd(py)+3,P.g1); } } }
  b.ellipse(tx,ty+2,4,3,P.w1); b.px(tx-1,ty+1,P.w3); }
function paintPole(b,tod){ var x=POLE.x, by=POLE.base, top=by-62;
  b.rect(x-1,top,3,by-top,P.m1); b.vl(x-1,top,by-1,P.m2); b.rect(x-3,by-4,7,4,P.m1); b.hl(x-3,x+3,by-4,P.m3);
  b.line(x,top+2,x+9,top-1,P.m1); b.poly([[x+5,top-3],[x+13,top-3],[x+12,top+1],[x+6,top+1]],P.m2); b.hl(x+6,x+12,top+1,P.s5);
  // zwei Druckkammer-Lautsprecher (Trichter nach links und rechts) an einer Schelle
  var sy=top+12; b.rect(x-2,sy-1,5,4,P.m1); b.hl(x-2,x+2,sy-1,P.m3);
  b.poly([[x-2,sy],[x-11,sy-4],[x-11,sy+6],[x-2,sy+2]],function(xx,yy){ return yy<sy?P.m2:(yy>sy+2?P.k2:P.m1); }); b.vl(x-11,sy-4,sy+6,P.m3); b.vl(x-12,sy-3,sy+5,P.k1);
  b.poly([[x+3,sy],[x+12,sy-4],[x+12,sy+6],[x+3,sy+2]],function(xx,yy){ return yy<sy?P.m1:(yy>sy+2?P.k1:P.m0); }); b.vl(x+12,sy-4,sy+6,P.m2); b.vl(x+13,sy-3,sy+5,P.k1);
  b.line(x-1,sy+3,x-1,sy+9,P.k2); b.line(x-1,sy+9,x+1,sy+12,P.k2);
  CACHE.pole=[x+9,top-1]; }
function paintLamp(b,L){ var x=L[0], by=L[1], h=L[2]; b.rect(x-1,by-h,2,h,P.m1); b.vl(x-1,by-h,by-1,P.m2); b.rect(x-2,by-3,5,3,P.m0); b.line(x,by-h,x+5,by-h-3,P.m1); b.poly([[x+2,by-h-5],[x+9,by-h-5],[x+8,by-h-2],[x+3,by-h-2]],P.m2); b.hl(x+3,x+8,by-h-2,P.s4); }

// ---------------------------------------------------------------- Bussteige: Betondach, Abfahrtstafel, Bank, Bus, Blagajna
function paintCanopy(b){ var x, y;
  for (y=CAN.y0;y<CAN.y1;y++) for (x=CAN.x0;x<CAN.x1;x++){ var c=y===CAN.y0?P.s4:(y===CAN.y1-1?P.m1:P.m3); if (((x-CAN.x0)%24)===0 && y>CAN.y0) c=P.m2; b.px(x,y,c); }
  for (x=CAN.x0;x<CAN.x1;x++) b.px(x,CAN.y1,P.k2);
  [304,368,440,476].forEach(function(cx){ b.rect(cx-2,CAN.y1,5,QB+6-CAN.y1,P.m3); b.vl(cx-2,CAN.y1,QB+5,P.s4); b.vl(cx+2,CAN.y1,QB+5,P.m1); b.rect(cx-3,QB+4,7,3,P.m2); });
  M.microText(b,'AUTOBUSNI KOLODVOR',CAN.x0+50,CAN.y0+2,P.k2);
  var pw=M.microWidth('PERON 3')+4, px=rd((BUS.x0+BUS.x1)/2-pw/2); b.vl(px+3,CAN.y1,CAN.y1+3,P.m1); b.vl(px+pw-4,CAN.y1,CAN.y1+3,P.m1); b.rect(px,CAN.y1+3,pw,7,P.b0); b.hl(px,px+pw-1,CAN.y1+3,P.b2); M.microText(b,'PERON 3',px+2,CAN.y1+4,P.s6);
  TUBES.forEach(function(q){ b.vl(q[0]-5,CAN.y1,q[1],P.m1); b.vl(q[0]+5,CAN.y1,q[1],P.m1); b.hl(q[0]-7,q[0]+7,q[1],P.s4); b.hl(q[0]-7,q[0]+7,q[1]+1,P.m2); }); }
function paintBoard(b){ var x0=BOARD.x0, x1=BOARD.x1, y0=BOARD.y0, y1=BOARD.y1;
  b.vl(x0+6,CAN.y1,y0,P.m1); b.vl(x1-6,CAN.y1,y0,P.m1);
  b.rect(x0,y0,x1-x0,y1-y0,P.k1); b.rect(x0+1,y0+1,x1-x0-2,y1-y0-2,P.k2); b.hl(x0,x1-1,y0,P.m2); b.hl(x0,x1-1,y1-1,P.k0);
  M.microText(b,'POLASCI',x0+3,y0+2,P.s5); b.hl(x0+2,x1-3,y0+8,P.m1);
  var rows=[['07:00','SARAJEVO'],['08:15','ZAGREB'],['09:30','DUBROVNIK'],['10:00','MOSTAR']];
  rows.forEach(function(r,i){ var yy=y0+10+i*6; M.microText(b,r[0],x0+3,yy,P.y4); M.microText(b,r[1],x0+24,yy,i===0?P.s6:P.s4); }); }
function paintBench(b){ var x0=BENCH.x0, x1=BENCH.x1, by=BENCH.base;
  for (var s=0;s<3;s++){ var y=by-26+s*4; b.rect(x0,y,x1-x0,3,P.w3); b.hl(x0,x1-1,y,P.w4); b.hl(x0,x1-1,y+2,P.w1); }
  b.rect(x0-1,by-14,x1-x0+2,3,P.w3); b.hl(x0-1,x1,by-14,P.w5); b.hl(x0-1,x1,by-12,P.w1);
  [x0+2,x1-4].forEach(function(lx){ b.rect(lx,by-27,2,27,P.m1); b.vl(lx,by-27,by-1,P.m2); b.rect(lx-1,by-1,4,1,P.m0); });
  b.hl(x0+2,x1-3,by-6,P.m1); }
function paintBus(b,tod){ var x0=BUS.x0, x1=BUS.x1, top=BUS.top, by=BUS.base, dawn=tod==='dawn', x, y, w=x1-x0;
  // Seite (schräg nach hinten), Gepäckraum offen
  b.poly([[x1,top+3],[x1+18,top-4],[x1+18,by-10],[x1,by-2]],function(x,y){ var u=(x-x1)/18, yy=y-(top+3-u*7); var c=P.s4; if (yy>4 && yy<16) c=(((x-x1)%6)<1)?P.s3:(dawn?(hash(x,y>>2)<0.5?P.y3:P.c1):P.c1); if (yy>18 && yy<21) c=P.a3;
    if (yy>=22 && yy<=29 && u>0.12 && u<0.9){ c=P.k1; var cell=Math.floor(u*5); if (yy>25) c=[P.r2,P.b1,P.e3,P.g2,P.c2][cell]; if (yy===26) c=M.UP[c]; }
    if (yy>30) c=P.m2; return c; });
  for (x=x1+2;x<x1+17;x++){ var ty=Math.round(top+3+19-(x-x1)*7/18); b.px(x,ty,P.s6); b.px(x,ty+1,P.s5); }
  // Front
  b.rect(x0,top,w,by-top,P.s5); b.hl(x0+1,x1-2,top,P.s6); b.vl(x0,top+1,by-1,P.s4); b.vl(x1-1,top+1,by-1,P.s3);
  b.rect(x0+4,top+2,w-8,7,P.k1); M.microText(b,'SARAJEVO',x0+((w-31)>>1),top+3,dawn?P.y4:P.y3);
  var wy0=top+10, wy1=top+30; b.rect(x0+2,wy0,w-4,wy1-wy0,P.c0);
  for (y=wy0;y<wy1;y++) for (x=x0+2;x<x1-2;x++){ var c=P.c0; if (y>wy1-8) c=P.k2; if (((x-x0)*0.7+y)%17<2) c=dawn?P.v2:P.b3; else if (((x-x0)*0.7+y)%17<3 && bayer(x,y)<0.5) c=dawn?P.v1:P.b2; if (dawn && y<wy0+5 && bayer(x,y)<0.35) c=P.y2; b.px(x,y,c); }
  b.vl(x0+(w>>1),wy0,wy1-1,P.k1); b.hl(x0+2,x1-3,wy0,P.k1);
  for (var sI=0;sI<4;sI++){ var sx=x0+6+sI*11; b.rect(sx,wy1-7,6,4,dawn?P.r1:P.c1); b.hl(sx,sx+5,wy1-7,dawn?P.r2:P.c2); }
  // Schild SARAJEVO hinter der Frontscheibe
  var cw=M.microWidth('SARAJEVO')+4, cx=x1-4-cw, cy=wy1-13; b.rect(cx,cy,cw,12,P.e4); b.hl(cx,cx+cw-1,cy,P.s4); b.hl(cx,cx+cw-1,cy+11,P.e2); b.vl(cx+cw-1,cy,cy+11,P.e2); M.microText(b,'MOSTAR',cx+6,cy+1,P.k2); M.microText(b,'SARAJEVO',cx+2,cy+6,P.k1); CACHE.busSign=[cx,cy,cw,12];
  b.line(x0+6,wy1-1,x0+16,wy1-6,P.k1); b.line(x0+w/2+3,wy1-1,x0+w/2+13,wy1-6,P.k1);
  // Spiegel („Hasenohren“)
  b.line(x0,top+6,x0-5,top+2,P.k1); b.rect(x0-8,top+2,4,8,P.k1); b.vl(x0-7,top+3,top+8,P.m2); b.line(x1-1,top+6,x1+4,top+2,P.k1); b.rect(x1+3,top+2,4,8,P.k1); b.vl(x1+4,top+3,top+8,P.m2);
  // untere Front: Streifen, Kühlergrill, Scheinwerfer, Stoßstange, Kennzeichen
  b.rect(x0+1,wy1+1,w-2,3,P.a3); b.hl(x0+1,x1-2,wy1+1,P.a4);
  b.rect(x0+12,wy1+6,w-24,6,P.m1); for (x=x0+13;x<x1-12;x+=2) b.vl(x,wy1+7,wy1+10,P.k2);
  [[x0+3,wy1+6],[x0+7,wy1+6],[x1-11,wy1+6],[x1-7,wy1+6]].forEach(function(q){ b.rect(q[0],q[1],4,3,dawn?P.y5:P.s6); b.px(q[0],q[1],P.m3); });
  b.rect(x0,by-4,w,4,P.m2); b.hl(x0,x1-1,by-4,P.m4); b.rect(x0+(w>>1)-7,by-6,14,4,P.s6); b.hl(x0+(w>>1)-6,x0+(w>>1)+5,by-4,P.k2);
  b.rect(x0+2,by,6,2,P.k1); b.rect(x1-8,by,6,2,P.k1);
  CACHE.busLights=dawn?[[x0+3,wy1+6],[x0+7,wy1+6],[x1-11,wy1+6],[x1-7,wy1+6]]:[]; }
// Gepäck neben dem Bus (vor dem offenen Gepäckraum, außerhalb der Lauffläche)
function paintLuggage(b){ suitcase(b,424,BUS.base+1,5,7,P.b1); suitcase(b,430,BUS.base+1,7,5,P.r3); b.rect(431,BUS.base-8,5,3,P.e2); b.hl(431,435,BUS.base-8,P.e3); b.px(433,BUS.base-9,P.k2); }
function paintTicket(b,tod){ var x0=TICK.x0, x1=TICK.x1, top=TICK.top, by=TICK.base, w=x1-x0, glow=tod!=='day';
  b.rect(x0,top,w,by-top,P.s3); b.vl(x0,top,by-1,P.s4); b.vl(x1-1,top,by-1,P.m2); b.rect(x0-1,top-3,w+2,3,P.m2); b.hl(x0-1,x1,top-3,P.s4);
  var sw=M.microWidth('BLAGAJNA')+4, sx=x0+((w-sw)>>1); b.rect(sx,top+2,sw,7,P.b1); b.hl(sx,sx+sw-1,top+2,P.b3); M.microText(b,'BLAGAJNA',sx+2,top+3,P.s6);
  b.rect(x0+5,top+12,w-10,16,glow?P.y2:P.c1); for (var y=top+12;y<top+28;y++) for (var x=x0+5;x<x1-5;x++){ if (((x+y)%4)===0) b.px(x,y,P.m1); }
  b.rect(x0+11,top+18,8,8,glow?P.y3:P.c2); b.ellipse(x0+15,top+24,3,1,P.m2); b.rect(x0+3,top+28,w-6,3,P.m3); b.hl(x0+3,x1-4,top+28,P.s5);
  b.rect(x0+5,top+33,w-10,8,P.s4); M.microText(b,'0-24',x0+((w-15)>>1),top+34,P.k2); }

// ---------------------------------------------------------------- Bild
var SKY=null;
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), sky=new Uint8Array(W*144), i;
  LITC.fill(0); OWN.fill(0);
  paintSky(b,tod); paintFar(b,tod); paintHarbor(b,tod);
  var ref=b.clone();                           // alles bis hier ist Himmel/Ferne/Wasser (schon in Tageszeitfarben)
  paintTerminal(b,tod); var TB=b.clone();
  paintFerry(b,tod); var FB=b.clone();
  paintQuay(b,tod);
  paintKioskBack(b); paintPalm(b); paintPole(b,tod); LAMPS.forEach(function(L){ paintLamp(b,L); });
  paintCanopy(b); paintBoard(b); paintBus(b,tod); paintLuggage(b); paintTicket(b,tod); paintBench(b);
  for (var x=276;x<W;x++) for (var y=QF+2;y<144;y++) ref.d[y*W+x]=b.d[y*W+x];   // Wasser vorn ebenfalls nicht umfärben
  for (i=0;i<W*144;i++) sky[i]=(b.d[i]===ref.d[i] && OWN[i]===0)?1:0;
  SKY=sky;
  // harte Schatten bei Bura-Sonne (von links oben), weiche Kontaktschatten
  if (tod==='day'){ castShadows(b,sky); }
  gullsSit(b,tod);
  var PRE=b.clone();
  if (tod==='day'){ M.light(b,M.lf.sum(M.lf.pool(KIO.x1+6,KIO.base+1,14,3,-1.2),M.lf.pool(BUS.x0+26,BUS.base+2,30,3,-1.3),M.lf.pool(BENCH.x0+16,BENCH.base+1,18,2,-1),M.lf.pool(PALM.x+6,PALM.base+1,10,2,-1),M.lf.band(QB,QB+6,-0.6,0)),0,0,function(x,y){ return !sky[y*W+x]; }); }
  else { M.light(b,M.lf.sum(M.lf.pool(KIO.x1+4,KIO.base+1,14,3,-1),M.lf.pool(BUS.x0+26,BUS.base+2,30,3,-1.2),M.lf.pool(BENCH.x0+16,BENCH.base+1,18,2,-0.8),M.lf.k(-0.15)),0,0,function(x,y){ return !sky[y*W+x]; }); }
  shade(b,0,0,todKey(tod),lightsFor(tod),function(x,y){ return !!sky[y*W+x]; });
  if (tod!=='day') afterLights(b,tod,PRE,TB,FB);
  return b; }
// tiefe Novembersonne von links: Schatten fallen nach rechts unten
function castShadows(b,sky){ var objs=[[KIO.x0+2,KIO.x1-2,KIO.base,26],[PALM.x-3,PALM.x+3,PALM.base,30],[POLE.x-1,POLE.x+1,POLE.base,24],[LAMPS[0][0]-1,LAMPS[0][0]+1,LAMPS[0][1],18],[LAMPS[1][0]-1,LAMPS[1][0]+1,LAMPS[1][1],18],[BENCH.x0,BENCH.x1,BENCH.base,10],[TICK.x0,TICK.x1,TICK.base,12],[154-3,154+3,QB+5,6],[214-3,214+3,QB+5,6],[266-3,266+3,QB+5,6]];
  objs.forEach(function(o){ var len=o[3]; for (var j=1;j<=len;j++){ var y=o[2]+Math.round(j*0.55), dx=Math.round(j*0.75); if (y>=QF) break; for (var x=o[0]+dx;x<=o[1]+dx;x++){ if (x<0||x>=W) continue; var k=y*W+x; if (sky[k]) continue; var fade=j/len; if (bayer(x,y)<0.92-fade*0.45) b.px(x,y,M.DN[b.get(x,y)]); } } }); }
function gullsSit(b,tod){ [[154,QB-2],[266,QB-2],[236,45],[358,45]].forEach(function(g,i){ var x=g[0], y=g[1]; b.px(x,y,P.s6); b.px(x+1,y,P.s6); b.px(x+2,y-1,P.s5); b.px(x-1,y,P.m2); b.px(x,y+1,P.s4); b.px(x+1,y+1,P.s4); b.px(x+3,y-1,P.y3); b.px(x,y+2,P.y3); }); }
function afterLights(b,tod,PRE,TB,FB){ var night=tod==='night', k, x, y;
  // beleuchtete Fenster (Terminal, Fähre): nur wo nichts davor steht; im Morgengrauen ist schon ein Teil dunkel
  for (k=0;k<W*144;k++){ var o=OWN[k]; if (!o) continue; if (PRE.d[k]!==(o===1?TB:FB).d[k]) continue; x=k%W; y=(k/W)|0;
    if (!night && o===2 && hash(x>>2,(y>>1)+5)<0.42) continue; b.d[k]=LITC[k]; }
  // Leuchtröhren, Laternen (Morgengrauen: die mittlere ist aus und flackert dynamisch)
  TUBES.forEach(function(q){ b.hl(q[0]-7,q[0]+7,q[1],P.s6); b.hl(q[0]-6,q[0]+6,q[1]+1,P.n5); });
  (night?LAMPS:[LAMPS[0]]).forEach(function(L){ var x=L[0], top=L[1]-L[2]; b.poly([[x+2,top-5],[x+9,top-5],[x+8,top-2],[x+3,top-2]],P.y3); b.hl(x+3,x+8,top-2,P.y5); b.px(x+5,top-3,P.l1); });
  if (night){ var p=CACHE.pole; b.poly([[p[0]-3,p[1]-2],[p[0]+5,p[1]-2],[p[0]+4,p[1]+2],[p[0]-2,p[1]+2]],P.y3); b.hl(p[0]-3,p[0]+3,p[1]+2,P.y5); b.px(p[0],p[1]+1,P.l1);
    var lb=CACHE.label; if (lb){ M.text(b,'TRAJEKTNA LUKA',lb[0],lb[1],P.y4); } }
  (CACHE.busLights||[]).forEach(function(q){ b.rect(q[0],q[1],4,3,P.y5); b.px(q[0]+1,q[1]+1,P.l1); });
  var s=CACHE.busSign; if (s){ b.rect(s[0],s[1],s[2],s[3],P.e3); b.hl(s[0],s[0]+s[2]-1,s[1],P.e4); M.microText(b,'MOSTAR',s[0]+6,s[1]+1,P.k1); M.microText(b,'SARAJEVO',s[0]+2,s[1]+6,P.k0); }
  M.microText(b,'SARAJEVO',BUS.x0+((BUS.x1-BUS.x0-31)>>1),BUS.top+3,P.y4);
  if (night){ var x0=BOARD.x0, y0=BOARD.y0; M.microText(b,'POLASCI',x0+3,y0+2,P.s6); [['07:00','SARAJEVO'],['08:15','ZAGREB'],['09:30','DUBROVNIK'],['10:00','MOSTAR']].forEach(function(r,i){ var yy=y0+10+i*6; M.microText(b,r[0],x0+3,yy,P.y5); M.microText(b,r[1],x0+24,yy,i===0?P.l1:P.s5); }); } }

// ---------------------------------------------------------------- Ebene: Kioskfassade (verdeckt Mira bis zur Brust); nachts ist der Rollladen unten
function kioskLayer(S,tod){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, L=M.layer(x0-4,44,x1-x0+8,by-44+1,by), w=M.lw(L), x, y;
  // Dach mit Schild
  w.rect(x0-3,50,x1-x0+6,4,P.g2); w.hl(x0-3,x1+2,50,P.g4); w.hl(x0-3,x1+2,53,P.g1); w.rect(x0-1,46,x1-x0+2,4,P.s5); w.hl(x0-1,x1,46,P.s6); M.microText(L,'NOVINE',x0+((x1-x0-23)>>1)-L.ox,47-L.oy,P.r2);
  // Markise
  for (x=x0-3;x<x1+3;x++){ var st=((x-x0+40)>>1)&1; w.px(x,54,st?P.r3:P.s5); w.px(x,55,st?P.r2:P.s4); if ((x&1)===0) w.px(x,56,st?P.r2:P.s4); }
  // Fensterrahmen (Öffnung bleibt frei: dort steht Mira)
  w.rect(x0,56,3,by-56,P.g2); w.vl(x0,56,by-1,P.g3); w.rect(x1-3,56,3,by-56,P.g1); w.vl(x1-1,56,by-1,P.g0);
  if (tod==='night'){ for (y=57;y<82;y++) for (x=x0+3;x<x1-3;x++){ var cs=((y-57)%3===0)?P.m1:(((y-57)%3===1)?P.m3:P.m2); if (x===x0+3) cs=P.m1; w.px(x,y,cs); }
    w.hl(x0+3,x1-4,81,P.k2); w.rect(x0+15,74,5,4,P.m1); w.px(x0+17,76,P.y2); w.rect(x0+24,63,7,5,P.s5); w.hl(x0+25,x0+29,65,P.k2); }
  // Theke und Front mit Zeitschriften
  w.rect(x0,82,x1-x0,2,P.w3); w.hl(x0,x1-1,82,P.w4); w.rect(x0+1,84,x1-x0-2,by-84,P.g2); w.hl(x0+1,x1-2,84,P.g1);
  var covers=[[P.r3,P.s6],[P.b2,P.y4],[P.s5,P.r2],[P.y3,P.k1],[P.c3,P.s6],[P.d4,P.s5],[P.g4,P.s6],[P.s4,P.b1]];
  for (var r=0;r<3;r++) for (var c=0;c<4;c++){ var cx=x0+3+c*8, cy=86+r*8, col=covers[(r*4+c*3)%covers.length]; w.rect(cx,cy,7,7,col[0]); w.hl(cx+1,cx+5,cy+1,col[1]); w.hl(cx+1,cx+3,cy+3,col[1]); w.px(cx+5,cy+5,col[1]); w.hl(cx,cx+6,cy+6,M.DN[col[0]]); }
  w.rect(x0,by-3,x1-x0,3,P.g1);
  // Ständer mit Zeitungen an der Seite
  w.rect(x1+1,92,3,by-92,P.m1); for (var k=0;k<3;k++){ w.rect(x1+1,93+k*6,4,5,k===1?P.s4:P.s5); w.hl(x1+1,x1+4,94+k*6,P.k2); }
  var pre=tod==='day'?M.lf.xband(x0,x1,0.2,-0.6):null; if (pre) M.light(L,pre,L.ox,L.oy);
  shade(L,L.ox,L.oy,todKey(tod),lightsFor(tod));
  return L; }
function layers(S,GS,tod){ return [kioskLayer(S,tod)]; }

// ---------------------------------------------------------------- Bewegung: Wasser, Möwen, Tauben, flackernde Laterne, Fahne
function pigeon(fb,x,y,f,t,i,cam,tod){ var sx=x-cam; if (sx<5||sx>=fb.w-6) return; var peck=Math.sin(t*2.7+i*2.1)>0.4, step=Math.floor(t*0.8+i*1.7)%6===0?f:0;
  function px(dx,dy,c){ var X=sx+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tod==='day'?c:M.tintPx(M.TINT[tod]||M.TINT.dawn,c,X,Y)); }
  px(-4,-3,P.m1); px(-3,-3,P.m2); px(-2,-3,P.m4); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3);
  px(-3,-2,P.m1); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m3); px(2,-2,P.m2);
  px(-1,-1,P.m2); px(0,-1,P.m2); px(1,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-3,P.v3); px(3,-2,P.m2); px(4,-1,P.m2); px(4,0,P.t4); }
  else { px(2,-3,P.v3); px(2,-4,P.g4); px(2,-5,P.m2); px(3,-5,P.m2); px(3,-4,P.m2); px(4,-4,P.t4); px(3,-6,P.m3); } }
function dyn(fb,v,S,GS){ var cam=v.cam, tod=v.tod, x, y;
  for (y=QF+2;y<144;y++) for (x=276;x<W;x++){ var sx=x-cam; if (sx<0||sx>=fb.w) continue; fb.d[y*fb.w+sx]=seaCol(tod,x,y,v.t); }
  for (y=HZ+8;y<QB;y+=1) for (x=Math.max(0,cam);x<Math.min(W,cam+fb.w);x++){ var k=y*fb.w+(x-cam); if (!SKY||!SKY[y*W+x]) continue; if (((x+y*3)&7)!==0) continue; fb.d[k]=seaCol(tod,x,y,v.t); }
  if (tod==='day'){ M.scn.gulls(fb,v.t,0,8,W,40,5,cam); }
  else if (tod==='dawn') M.scn.gulls(fb,v.t*0.7,200,20,W-200,30,2,cam);
  if (tod!=='night') PIGEONS.forEach(function(p,i){ pigeon(fb,p[0],p[1],p[2],v.t,i,cam,tod); });
  // Morgengrauen: die mittlere Laterne flackert und geht aus
  if (tod==='dawn'){ var L=LAMPS[1], lx=L[0]-cam, top=L[1]-L[2]; var on=Math.sin(v.t*9.3)+Math.sin(v.t*3.1)>1.2; if (on && lx>-10 && lx<fb.w+10){ fb.px(lx+4,top-4,P.y4); fb.px(lx+5,top-4,P.y3); fb.px(lx+6,top-4,P.y4); fb.px(lx+5,top-3,P.y5); } }
  // nachts: Topplicht der Fähre und Flugwarnlicht auf dem Hochhaus blinken
  if (tod==='night'){ var m=CACHE.mast; if (m && Math.floor(v.t*1.2)%2===0){ var mx=m[0]-cam; if (mx>=0&&mx<fb.w){ fb.px(mx,m[1],P.r4); } } }
  // Fahne auf dem Terminal (Bura: kräftig, Morgengrauen: schlaff)
  var fx=TERM.x1-6-cam, fy=TERM.top-26, wind=tod==='dawn'?0.25:1; for (var i=0;i<10*wind+2;i++) for (var j=0;j<6;j++){ var wave=Math.round(Math.sin(v.t*8+i*0.8)*wind*1.2+(1-wind)*i*0.5); var c=j<2?P.r3:(j<4?P.s6:P.b1); var px=fx+1+i, py=fy+j+wave; if (px>=0&&px<fb.w&&py>=0) fb.px(px,py,tod==='day'?c:M.tintPx(M.TINT[tod]||M.TINT.dawn,c,px,py)); } }
function front(fb,v,S,GS){ if (M.scn.weather(GS)==='bura') M.scn.buraDebris(fb,v.t,118,138,v.cam); }
// Geistersicht: an der Bank ein kalter Schimmer (hier hat jemand im Winter auf den Bus gewartet)
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, a=0.3+Math.sin(t*0.9)*0.15;
  for (var y=BENCH.base-30;y<BENCH.base+2;y++) for (var x=BENCH.x0-6;x<BENCH.x1+6;x++){ var sx=x-cam; if (sx<0||sx>=fb.w) continue; var d=Math.hypot((x-(BENCH.x0+BENCH.x1)/2)/22,(y-BENCH.base+14)/16); if (d<1 && bayer(x+(t*3|0),y)<(1-d)*a){ var k=y*fb.w+sx; fb.d[k]=M.UP[fb.d[k]]; } }
  M.dust(fb,t*0.3,BENCH.x0-cam,BENCH.base-34,BENCH.x1-BENCH.x0,30,6,P.x4); }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<110||y>138||x<6||x>470) return false;
  if (x>=KIO.x0-2 && x<=KIO.x1+6 && y<KIO.base+3) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y>=BENCH.base-5 && y<=BENCH.base+2) return false;
  if (x>=BUS.x0-9 && x<=BUS.x1+19 && y<BUS.base+3) return false;
  if (x>=TICK.x0-2 && y<TICK.base+3) return false;
  if (Math.abs(x-PALM.x)<7 && y<PALM.base+3) return false;
  if (Math.abs(x-POLE.x)<4 && y<POLE.base+2) return false;
  if (x>=82 && x<=102 && y<118) return false;
  return true; }
M.defineArt('terminal',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  spots:{
    exit:[0,96,10,48],
    ferry:[FER.x0-16,30,FER.x1-FER.x0+16,FER.wl-30+2],
    terminal_bldg:[0,24,TERM.x1+6,QB-24],
    kiosk:[KIO.x0-3,46,KIO.x1-KIO.x0+10,KIO.base-46],
    bench:[BENCH.x0-1,BENCH.base-27,BENCH.x1-BENCH.x0+2,28],
    palm:[PALM.x-16,PALM.base-70,32,70],
    bus:[BUS.x0-8,BUS.top-6,BUS.x1-BUS.x0+28,BUS.base-BUS.top+8],
    bus_sign:[BUS.x1-4-36,BUS.top+16,38,14],
    ticket_counter:[TICK.x0-1,TICK.top-3,TICK.x1-TICK.x0+2,TICK.base-TICK.top+3],
    timetable:[BOARD.x0,BOARD.y0,BOARD.x1-BOARD.x0,BOARD.y1-BOARD.y0],
    speaker:[POLE.x-14,POLE.base-56,29,22],
    sea:[278,136,202,8]
  },
  stands:{
    exit:[10,124,'L'], ferry:[200,114,'B'], terminal_bldg:[60,114,'B'], kiosk:[236,118,'B'], bench:[326,126,'R'], palm:[272,120,'R'],
    bus:[398,120,'B'], bus_sign:[404,118,'B'], ticket_counter:[460,118,'B'], timetable:[338,116,'B'], speaker:[306,118,'B'], sea:[380,134,'F']
  },
  actorPos:{ mira:[236,108,'F'], mala:[350,124,'L'] },
  start:[40,124,'R'], entries:{ map:[16,124,'R'] }
});
})(M);
