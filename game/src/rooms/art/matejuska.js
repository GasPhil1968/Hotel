/* ===== rooms/art/matejuska.js — Matejuška: der kleine Fischerhafen unter Varoš (640 breit, scrollend).
   Vorn die Mole (Lauffläche), dahinter das Becken mit bunten Holzbooten, drüben die Kaimauer, Varoš am Hang und der Marjan.
   Drüben an der Kaimauer eine Reihe Konobe mit bunten Holztüren (abends steht eine offen), über Varoš in der Ferne der Glockenturm
   von Sv. Duje (abends angestrahlt); am Marjan Schirmpinien auf dem Kamm, die Kapelle Sv. Nikola und die Treppe im Zickzack mit Laternen.
   In der Mitte Dinkos Schuppen (konoba) mit Vorhängeschloss, davor seine umgedrehte Kiste. Rechts die alte Ledana
   hinter dem Bauzaun, vor dem losen Zaunfeld ein Stapel Fischkisten (S.cratesMoved: beiseitegeschoben, Loch sichtbar). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=640, H=144;
var QY=108;              // Hinterkante der Mole; dahinter liegt das Becken
var FQ=78;               // Wasserlinie an der Kaimauer drüben (Landseite)
var BX1=398;             // rechtes Ende des Beckens
var LX0=416;             // Ledana: linke Fassadenkante
var SHED={x0:164,x1:228,top:50,base:110};      // Schuppen (Vorderwand)
var SDOOR=[185,60,22,50];                     // Schuppentür
var SWIN=[213,64,9,8];                        // Schuppenfenster
var LAMP={x:272,base:110,h:46};               // Kai-Laterne
var FENCE={x0:424,x1:640,top:62,base:110};    // Bauzaun
var GAP=[556,84,22,26];                       // Loch im Zaun (hinter den Kisten)
var DINKO=[244,124];
var FARLAMPS=[34,122,246,350];
var MOON=[330,13];

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
var R=M.R;
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
// Luftperspektive: Farben Richtung Himmelsblau aufhellen
function hazeT(a){ return M.tintMake(function(r,g,b){ return [r*(1-a)+168*a, g*(1-a)+196*a, b*(1-a)+226*a]; }); }
var HZ=[hazeT(0.24),hazeT(0.15),hazeT(0.08),hazeT(0.3)], HZT=hazeT(0.22);
// Helligkeit -> Rampe (ohne Dither): ferner Hintergrund in Dämmerung und Nacht als ruhige Silhouette
function rampLUT(names,lo,hi,gam){ var ramp=R(names), a=new Uint8Array(256); for (var c=0;c<256;c++){ if (c>=M.NCOL){ a[c]=c; continue; } var L=Math.pow(M.lum(c)/255,gam||1), v=lo+(hi-lo)*L; a[c]=ramp[cl(Math.round(v*(ramp.length-1)),0,ramp.length-1)]; } return {a:a}; }
var BGL={ dusk:[rampLUT('k2 d0 d1 d2',0,0.85,1.1),rampLUT('k2 d0 d1 d2 d3 d4',0.05,1,1),rampLUT('k1 d0 d1 d2 d3 d4 d5',0,1,0.95)],
          night:[rampLUT('k1 k2 n0 n1',0,0.9,1.1),rampLUT('k0 k1 k2 n0 n1 n2',0,0.95,1),rampLUT('k0 k1 k2 n0 n1 n2 n3',0,0.95,0.95)],
          dawn:[rampLUT('n0 n1 n2 d2',0.1,0.95,1),rampLUT('k2 n0 n1 n2 d2 d3',0,1,1),rampLUT('k1 n0 n1 n2 d2 d3 d4',0,1,1)] };
// wie M.finishTOD, aber mit sanfterem Dither (Texturen bleiben ruhig)
var DUSKCOOL=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.62+L*0.08+14, g*0.5+L*0.06+8, b*0.7+L*0.1+30]; });
function finish(b,tod,opt){ if (tod==='day'||!M.TINT[tod]){ if (opt.after) opt.after(b,tod); return b; }
  var t0=M.TINT[tod], L=opt.lights||[], LT=M.TINT.lamp, d=b.d, w=b.w;
  for (var y=0;y<b.h;y++) for (var x=0;x<w;x++){ var k=y*w+x, c=d[k]; if (c===T) continue; if (opt.sky && opt.sky(x,y)) continue;
    var lit=0; for (var i=0;i<L.length;i++){ var l=L[i], dx=(x-l[0])/l[2], dy=(y-l[1])/(l[4]||l[2]), q=dx*dx+dy*dy; if (q<1){ var v=(1-q)*l[3]; if (v>lit) lit=v; } }
    if (tod==='dusk') lit*=0.6; var t=(tod==='dusk' && y>=QY)?DUSKCOOL:t0, bb=bayer(x,y), tt=(lit>0.05 && bb<lit)?LT:t, r=tt.r[c];
    d[k]=(r>0.18 && bb<(r-0.18)*1.5)?tt.b[c]:tt.a[c]; if (tt===LT && lit>0.75) d[k]=M.UP[d[k]]; }
  if (opt.after) opt.after(b,tod); return b; }

// ---------------------------------------------------------------- Texturen
// Bruchsteinmauer (Voronoi-Steine mit Mörtelfugen, Licht von oben links)
function stones(u,v,ramp,sw,sh,mort){ mort=mort||0.13; var cx=Math.floor(u/sw), cy=Math.floor(v/sh), d1=9, d2=9, bx=0, by=0, bi=0, bj=0;
  for (var j=cy-1;j<=cy+1;j++) for (var i=cx-1;i<=cx+1;i++){ var px=(i+0.15+hash(i,j)*0.7)*sw, py=(j+0.15+hash(i+31,j+17)*0.7)*sh, dx=(u-px)/sw, dy=(v-py)/sh, d=dx*dx+dy*dy;
    if (d<d1){ d2=d1; d1=d; bx=px; by=py; bi=i; bj=j; } else if (d<d2) d2=d; }
  var e=Math.sqrt(d2)-Math.sqrt(d1); if (e<mort) return ramp[0];
  var t=hash(bi*3+1,bj*5+2), k=t<0.3?1:(t<0.8?2:3); k=Math.min(k,ramp.length-1);
  var ly=(v-by)/sh, lx=(u-bx)/sw, l=-(lx*0.5+ly*1.1); if (l>0.32) k++; else if (l<-0.36) k--; if (e<mort+0.07 && ly>0.05) k--;
  if (hash(u*1.7,v*2.3)<0.05) k--; return ramp[cl(k,0,ramp.length-1)]; }
// Mönch-Nonne-Ziegel (kupa kanalica) von vorn: senkrechte Rinnen, Lagen
function rooftile(u,v,ramp){ var col=Math.floor(u/3), fu=u-col*3, row=Math.floor(v/3), c=ramp[2]; if (fu===0) c=ramp[1]; if (fu===2) c=ramp[3];
  if (v-row*3===2) c=ramp[0]; var h=hash(col,row); if (h<0.12) c=M.DN[c]; else if (h>0.93) c=ramp[Math.min(ramp.length-1,3)]; return c; }
// Netz (Rautenmaschen)
function netTex(x,y,ramp,m){ m=m||4; var a=((x+y)%m+m)%m, b2=((x-y)%m+m)%m, c=ramp[1]; if (a===0||b2===0) c=ramp[2]; if (a===0&&b2===0) c=ramp[3]; if (hash(x,y)<0.08) c=ramp[0]; return c; }

// ---------------------------------------------------------------- Himmel (eigene Fassung: Bura klar, Dämmerung mit Glut hinter dem Marjan)
function skyPaint(b,tod,weather){ var x, y, i, k;
  if (tod==='day'){ var Rk=R('b0 b1 b2 b3 b4 b5'); for (y=0;y<FQ;y++){ var v=0.12+Math.pow(y/FQ,1.25)*0.86; for (x=0;x<W;x++) b.px(x,y,ra(Rk,v+(vn(x*0.01,y*0.05)-0.5)*0.06,x,y)); }
    var r=M.rng(5); for (i=0;i<7;i++){ var cx=r()*W, cy=6+r()*26, len=50+r()*90, sl=(r()-0.5)*0.06; for (k=0;k<len;k++){ var xx=Math.round(cx+k), yy=Math.round(cy+Math.sin(k*0.06+i)*1.6+k*sl), a=1-Math.abs(k/len-0.5)*2, th=a>0.55?2:(a>0.2?1:0);
        if (th===0){ if ((xx&1)===0) b.px(xx,yy,P.b4); continue; } b.px(xx,yy,a>0.7?P.b5:P.b4); if (th>1) b.px(xx,yy+1,P.b4); if (a>0.8 && (k%9)<5) b.px(xx,yy-1,P.b4); } } }
  else if (tod==='dusk'){ var Rd=R('d0 d1 d2 d3 d4 d5 d6'); for (y=0;y<FQ;y++) for (x=0;x<W;x++){ var g=Math.exp(-Math.pow((x-40)/260,2)-Math.pow((y-72)/40,2))*0.32, v2=Math.pow(y/FQ,1.15)*0.82+g; b.px(x,y,ra(Rd,v2,x,y)); }
    var r2=M.rng(9); for (i=0;i<9;i++){ var cx2=r2()*W, cy2=12+r2()*40, len2=30+r2()*70; for (k=0;k<len2;k++){ var x2=Math.round(cx2+k), y2=Math.round(cy2+Math.sin(k*0.09+i)*1.2), a2=1-Math.abs(k/len2-0.5)*2; if (bayer(x2,y2)<a2*0.6) b.px(x2,y2,y2>45?P.d3:P.d2); if (bayer(x2,y2+1)<a2*0.5) b.px(x2,y2+1,y2>40?P.d6:P.d5); } }
    for (x=0;x<W;x++) if (bayer(x,FQ-1)<0.5) b.px(x,FQ-1,P.d6); }
  else M.scn.sky(b,0,0,W,FQ,tod,weather,23);
  if (tod==='night') M.moon(b,MOON[0],MOON[1],4); }

// ---------------------------------------------------------------- Hintergrund: Marjan mit Pinien, Varoš am Hang
function mjY(x){ var base=x<66?21-x*0.11:13.7+Math.pow((x-66)/300,1.2)*47; return base+Math.sin(x*0.09)*1.1+(vn(x*0.15,3)-0.5)*3; }
function paintMarjan(b){ var G=R('g0 g1 g2 g3 g4');
  for (var x=0;x<BX1+20;x++){ var top=Math.round(mjY(x)); for (var y=top;y<FQ;y++){ var d=(y-top)/40, f=fbm(x*0.22,y*0.35);
      var v=0.62-d*0.35+(f-0.5)*0.7; var c=ra(G,v,x,y); if (f>0.72 && d<0.8) c=P.s3; if (f>0.79 && d<0.8) c=P.s4; b.px(x,y,c); } }
  var r=M.rng(41);
  for (var px=2;px<BX1;px+=6+Math.floor(r()*5)){ var ty=mjY(px), rx=4+r()*4, ry=2.4+r()*1.8, cy=ty-ry*0.6;
    b.ellipse(px,cy,rx,ry,function(x,y){ var u=(y-(cy-ry))/(2*ry), f=hash(Math.floor(x/2),Math.floor(y/2)); var v=0.8-u*0.7+(f-0.5)*0.5; return ra(G,v,x,y); });
    if (r()<0.35){ b.vl(px,Math.round(cy+ry),Math.round(cy+ry+2),P.w1); } }
  for (var k=0;k<7;k++){ var zx=84+k*43+Math.floor(r()*14), zy=Math.round(mjY(zx))+6+Math.floor(r()*8), zh=9+Math.floor(r()*6);
    for (var yy=0;yy<zh;yy++){ var ww=Math.max(0.6,Math.sin((yy/zh)*Math.PI*0.9+0.25)*2.0); for (var xx=-Math.ceil(ww);xx<=Math.ceil(ww);xx++){ if (Math.abs(xx)>ww) continue; b.px(zx+xx,zy-yy,xx<0?P.g2:P.g1); } } }
  // Schirmpinien auf dem Kamm: Stamm und flache Krone gegen den Himmel
  PINES.forEach(function(p){ var px2=p[0], ty=Math.round(mjY(px2)), lean=p[1], th=p[2], rx=p[3], cy=ty-th-1.5;
    for (var j=0;j<=th;j++) b.px(px2+Math.round(lean*j/th),ty-j,j>th-2?P.w2:P.w1);
    b.ellipse(px2+lean,cy,rx,1.9,function(x,y){ var u=(y-(cy-1.9))/3.8, l=(x-(px2+lean))/rx; var v=0.75-u*0.6-l*0.18+(hash(x,y)-0.5)*0.3; return ra(G,v,x,y); });
    b.hl(Math.round(px2+lean-rx*0.6),Math.round(px2+lean+rx*0.3),Math.round(cy-1.6),P.g3); });
  // Marjanske skale: die Treppe im Zickzack von Varoš hinauf zur Vidilica, mit Laternen (abends an)
  STLAMPS.length=0; STPATH.length=0;
  for (var si=0;si+1<STAIR.length;si++){ var A=STAIR[si], B=STAIR[si+1], n=Math.abs(B[0]-A[0]), dir=B[0]>A[0]?1:-1;
    for (var q=0;q<=n;q++){ var sx=A[0]+q*dir, sy=Math.round(A[1]+(B[1]-A[1])*q/Math.max(1,n)), tc=((sx+si)%2)?P.s5:P.s4;
      b.px(sx,sy,tc); STPATH.push(sx,sy,tc); b.px(sx,sy+1,P.s3); b.px(sx,sy+2,P.s1); if (hash(sx,si)<0.5) b.px(sx,sy-1,P.g2);
      if (q>1 && q<n-1 && (q%7)===3){ b.vl(sx,sy-3,sy-1,P.m1); b.px(sx,sy-4,P.m2); STLAMPS.push([sx,sy-4]); } } }
  var top=STAIR[STAIR.length-1]; b.rect(top[0]-8,top[1]-1,10,2,P.s4); b.hl(top[0]-8,top[0]+1,top[1]-1,P.s5); b.hl(top[0]-8,top[0]+1,top[1]+1,P.s1);   // Aussichtsterrasse
  // Kapelle Sv. Nikola am Kamm: weiße Steinkirche mit Glockengiebel, daneben Zypressen
  var cx=CHAP[0], cb=Math.round(mjY(cx+5))+2; CHAP[1]=cb;
  [[cx-3,9],[cx+14,11]].forEach(function(z){ for (var yy2=0;yy2<z[1];yy2++){ var w2=Math.max(0.5,Math.sin((yy2/z[1])*Math.PI*0.85+0.3)*1.4); for (var xx2=-1;xx2<=1;xx2++){ if (Math.abs(xx2)>w2) continue; b.px(z[0]+xx2,cb-1-yy2,xx2<0?P.g2:P.g1); } } });
  for (var y2=cb-6;y2<cb;y2++) for (var x2=cx;x2<cx+11;x2++) b.px(x2,y2,x2<cx+2?P.s6:(x2>cx+8?P.s3:(hash(x2,y2)<0.1?P.s4:P.s5)));
  b.hl(cx-1,cx+11,cb-7,P.t2); b.hl(cx,cx+10,cb-8,P.t3); b.hl(cx+1,cx+9,cb-8,P.t4);
  b.rect(cx,cb-12,4,5,P.s5); b.vl(cx,cb-12,cb-8,P.s6); b.px(cx+1,cb-11,P.k2); b.px(cx+2,cb-11,P.k2); b.px(cx+1,cb-10,P.y2); b.hl(cx-1,cx+4,cb-13,P.s4); b.px(cx+1,cb-14,P.s3); b.px(cx+2,cb-14,P.s3);
  b.rect(cx+5,cb-3,2,3,P.w1); b.px(cx+8,cb-5,P.k2); b.hl(cx-1,cx+11,cb,P.s2);
  b.vl(64,3,13,P.m2); }
var PINES=[[12,1,6,5],[30,-1,5,4.5],[46,1,7,5.6],[80,0,6,4.8],[127,-1,5,5],[148,1,6,5.4],[171,0,5,4.4]];
var CHAP=[96];
var STAIR=[[134,33],[112,30],[128,26],[106,23],[116,20]], STLAMPS=[], STPATH=[];
// Häuserreihe am Hang. wins sammelt Fenster für die Nacht.
function houses(b,wins,x0,x1,baseFn,hMin,hVar,seed,sc){ var r=M.rng(seed), x=x0;
  var walls=[R('s2 s3 s4 s5'),R('e2 e3 e4 s5'),R('s2 s3 s4 s5'),R('t3 t4 t5 s5'),R('s1 s2 s3 s4'),R('e3 e4 s4 s5'),R('s3 s4 s5 s6')], roofs=[R('t1 t2 t3 t4'),R('t0 t1 t2 t3'),R('t2 t3 t4 t5')];
  while (x<x1){ var w=Math.round((10+r()*14)*sc), h=Math.round((hMin+r()*hVar)*sc), base=Math.round(baseFn(x+w/2)), top=base-h, WR=walls[Math.floor(r()*walls.length)], RR=roofs[Math.floor(r()*roofs.length)];
    var stone=r()<0.45, shadeR=r()<0.5;
    for (var y=top;y<base;y++) for (var xx=x;xx<Math.min(x1,x+w);xx++){ var c=stone?stones(xx,y,WR,4,3,0.18):tex.plaster(xx,y,WR.slice(1),0); if (shadeR && xx>=x+w-2) c=M.DN[c]; if (y===top) c=M.DN[c]; b.px(xx,y,c); }
    var rh=Math.max(2,Math.round((2+r()*2)*sc)), k; if (r()<0.45){ for (k=0;k<rh+2;k++){ var ins=Math.round(k*w/(2*(rh+2))); for (xx=x+ins-1;xx<=x+w-ins;xx++) b.px(xx,top-1-k,rooftile(xx,k,RR)); } }
    else { for (k=0;k<rh;k++) for (xx=x-1;xx<=x+w;xx++) b.px(xx,top-1-k,rooftile(xx,k,RR)); b.hl(x-1,x+w,top-1,RR[0]); }
    for (xx=x;xx<x+w;xx++) if (bayer(xx,top)<0.6) b.px(xx,top,M.DN[M.DN[b.get(xx,top)]]);
    if (r()<0.35){ var chx=x+2+Math.floor(r()*(w-4)); b.rect(chx,top-rh-3,2,3,WR[1]); b.px(chx,top-rh-4,P.s1); }
    if (r()<0.3){ var ax=x+1+Math.floor(r()*(w-2)); b.vl(ax,top-rh-6,top-rh-1,P.m1); b.hl(ax-2,ax+2,top-rh-5,P.m1); }
    var fw=Math.max(2,Math.round(2*sc)), fh=Math.max(2,Math.round(3*sc)), gap=Math.max(4,Math.round(6*sc));
    for (var wy=top+2;wy+fh<base-1;wy+=fh+Math.max(2,Math.round(3*sc))) for (var wx=x+2;wx+fw<x+w-1;wx+=gap){ if (r()<0.2) continue; var st=r();
      if (st<0.4){ b.rect(wx,wy,fw,fh,P.g2); b.hl(wx,wx+fw-1,wy,P.g3); if (fh>2) b.hl(wx,wx+fw-1,wy+2,P.g1); wins.push([wx,wy,fw,fh,0.06]); }
      else { b.rect(wx,wy,fw,fh,P.k2); b.px(wx,wy,P.n1); if (sc>0.85){ b.vl(wx-1,wy,wy+fh-1,P.g2); b.vl(wx+fw,wy,wy+fh-1,P.g3); } wins.push([wx,wy,fw,fh,0.34]); } }
    x+=w+(r()<0.3?1:0); } }
function church(b,x,base){ // kleines Kirchlein mit Glockengiebel (preslica)
  b.rect(x,base-15,15,15,P.s4); b.vl(x+14,base-15,base-1,P.s3); for (var y=base-15;y<base;y++) for (var xx=x;xx<x+14;xx++) if (hash(xx,y)<0.12) b.px(xx,y,P.s3);
  b.poly([[x-1,base-15],[x+7.5,base-20],[x+16,base-15]],P.t2); b.hl(x-1,x+15,base-15,P.t1);
  b.rect(x+5,base-26,5,7,P.s5); b.rect(x+6,base-24,3,4,P.k2); b.px(x+7,base-22,P.y2); b.px(x+7,base-21,P.y3); b.hl(x+5,x+9,base-27,P.s4); b.px(x+7,base-28,P.s3);
  b.rect(x+5,base-8,4,8,P.w1); b.ellipse(x+7,base-12,1.5,1.5,P.k2); }
function haze(b,x0,x1,y0,y1,lut,mask){ for (var y=y0;y<y1;y++) for (var x=x0;x<x1;x++){ if (mask && !mask(x,y)) continue; var L=typeof lut==='function'?lut(x,y):lut; if (!L) continue; var k=y*b.w+x; if (b.d[k]===T) continue; b.d[k]=L.a[b.d[k]]; } }
// Glockenturm von Sveti Duje in der Ferne, über den Dächern von Varoš: schlank, nach oben offener, Pyramidenhelm
var TWX=371, TWPIX=[];
var FLOOD=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.86+34, L*0.66+18, L*0.34+6]; });
function farTower(b){ var cx=TWX, x, y; TWPIX.length=0;
  function put(xx,yy,c){ b.px(xx,yy,c); TWPIX.push(xx,yy,c); }
  put(cx,5,P.m2); put(cx-1,6,P.m2); put(cx,6,P.m2); put(cx+1,6,P.m2); put(cx,7,P.m2);
  for (y=8;y<21;y++){ var hw=Math.round((y-7)*0.27); for (x=cx-hw;x<=cx+hw;x++) put(x,y,x<cx?P.s5:(x===cx?P.s4:P.s3)); if (hw>0) put(cx-hw,y,P.s6); }
  [[21,28,3,1,3],[28,35,4,2,2],[35,42,4,2,2],[42,49,5,3,1],[49,62,5,2,1]].forEach(function(L){ var y0=L[0], y1=L[1], hw=L[2], n=L[3], ow=L[4], i;
    for (y=y0;y<y1;y++) for (x=cx-hw;x<=cx+hw;x++){ var u=(x-(cx-hw))/(2*hw), c=u<0.35?P.s5:(u<0.75?P.s4:P.s3); if (x===cx-hw) c=P.s6; if (x===cx+hw) c=P.s2; put(x,y,c); }
    for (x=cx-hw-1;x<=cx+hw+1;x++) put(x,y0,x===cx+hw+1?P.s3:P.s6); for (x=cx-hw;x<=cx+hw;x++) put(x,y0+1,P.s2);
    var span=2*hw-1, gap=Math.max(1,Math.floor((span-n*ow)/(n+1)));
    for (i=0;i<n;i++){ var ox=cx-hw+1+gap+i*(ow+gap); for (y=y0+3;y<y1-1;y++) for (x=ox;x<ox+ow;x++) put(x,y,(y===y0+3&&ow>1&&x===ox+ow-1)?P.s2:P.k2); } }); }
// nur die Turmpixel behalten, die nach den vorderen Häusern noch zu sehen sind
function stillThere(b,a){ var out=[]; for (var i=0;i<a.length;i+=3){ if (b.get(a[i],a[i+1])===a[i+2]) out.push(a[i],a[i+1],a[i+2]); } return out; }
function towerVisible(b){ TWPIX=stillThere(b,TWPIX); STPATH=stillThere(b,STPATH); }
// Konobe: kleine steinerne Fischerschuppen mit Holztüren an der Kaimauer drüben (eine steht abends offen, drinnen Licht)
var KONOBE=[[36,17,'g'],[55,15,'b'],[72,19,'w'],[93,16,'r'],[111,20,'g'],[133,13,'b']], KOPEN=[];
function konobe(b){ var DR={g:R('g1 g2 g3 g4'),b:R('b0 b1 b2 b3'),w:R('w1 w2 w3 w4'),r:R('r1 r2 r3 r4')}, Rr=R('t1 t2 t3 t4'), Rs=R('s1 s2 s3 s4'); KOPEN.length=0;
  KONOBE.forEach(function(k,i){ var x0=k[0], w=k[1], base=72, h=8+(i%2), top=base-h, x, y, D=DR[k[2]];
    for (y=top;y<base;y++) for (x=x0;x<x0+w;x++){ var c=stones(x*1.3,y*1.2,Rs,4,3,0.17); if (x===x0) c=M.UP[c]; if (x>=x0+w-1) c=M.DN[c]; b.px(x,y,c); }
    for (x=x0-1;x<=x0+w;x++){ b.px(x,top-2,rooftile(x,0,Rr)); b.px(x,top-1,rooftile(x,2,Rr)); } b.hl(x0-1,x0+w,top-3,Rr[3]); b.hl(x0,x0+w-1,top,P.s1);
    var dw=6, dx=x0+Math.floor((w-dw)/2)-(i%2), dh=7, open=(i===3);
    for (y=base-dh;y<base;y++) for (x=dx;x<dx+dw;x++){ var ax=Math.abs(x+0.5-(dx+dw/2))/(dw/2); if (y===base-dh && ax>0.55) continue;
      var c2=open?P.k1:((x===dx)?D[3]:((x-dx)%2===0?D[1]:D[2])); if (!open && y===base-1) c2=D[0]; b.px(x,y,c2); }
    for (x=dx-1;x<=dx+dw;x++){ var ax2=Math.abs(x+0.5-(dx+dw/2))/(dw/2+1); b.px(x,ax2>0.6?base-dh:base-dh-1,P.s4); }
    if (open){ b.rect(dx+dw,base-dh,2,dh,D[2]); b.vl(dx+dw+1,base-dh,base-1,D[1]); KOPEN.push([dx,base-dh,dw,dh]); }
    if (i%2===0){ var nx=x0+w-4; for (y=base-7;y<base-2;y++) for (x=nx;x<nx+3;x++) b.px(x,y,netTex(x,y,R('t1 t2 t3 t4'),3)); b.px(nx+1,base-8,P.e1); }
    if (i===1||i===4){ b.ellipse(x0+2.5,base-5,1.5,1.5,P.t3); b.px(x0+2,base-6,P.t5); }
    if (i===2){ b.rect(x0+w-5,top+2,3,2,P.k2); b.vl(x0+w-4,top+2,top+3,P.m1); } }); }
// Varoš: Stiegengassen zwischen den Häusern, Bäume in den Höfen, Wäsche, Bougainvillea
function skala(b,x,y0,y1){ for (var y=y0;y<y1;y++){ var tr=((y1-y)%2)===0; b.px(x,y,P.s1); b.px(x+1,y,tr?P.s5:P.s3); b.px(x+2,y,tr?P.s4:P.s2); b.px(x+3,y,P.s1); } }
function cypress(b,x,base,h){ for (var yy=0;yy<h;yy++){ var w=Math.max(0.5,Math.sin((yy/h)*Math.PI*0.85+0.3)*1.6); for (var xx=-2;xx<=2;xx++){ if (Math.abs(xx)>w) continue; b.px(x+xx,base-1-yy,xx<0?P.g2:(hash(x+xx,yy)<0.3?P.g2:P.g1)); } } }
function palmS(b,x,base,h){ for (var i=0;i<h;i++) b.px(x+(i>h*0.6?1:0),base-1-i,i%3===0?P.w1:P.w2); var tx=x+1, ty=base-h;
  [[-5,1],[-3,-1],[0,-2],[3,-1],[5,1],[-4,2],[4,2]].forEach(function(f,j){ b.line(tx,ty,tx+f[0],ty+f[1],j%2?P.g2:P.g3); b.px(tx+f[0],ty+f[1]+1,P.g1); }); }
function figTree(b,cx,cy,rx,ry){ b.ellipse(cx,cy,rx,ry,function(x,y){ var u=(y-(cy-ry))/(2*ry), l=(x-cx)/rx, v=0.7-u*0.5-l*0.2+(hash(x>>1,y)-0.5)*0.5; return ra(R('g1 g2 g3 g4'),v,x,y); }); }
function varosExtras(b){
  skala(b,141,58,72); skala(b,233,57,72); skala(b,316,60,72); skala(b,186,46,58);
  cypress(b,88,57,12); cypress(b,302,62,11); cypress(b,214,47,9);
  palmS(b,176,61,9); palmS(b,262,62,10);
  figTree(b,226,66,5,3); figTree(b,124,67,4,2.5);
  // Bougainvillea über Mauern und Türen
  [[104,66,5],[196,65,4],[282,67,5],[350,68,4]].forEach(function(q){ for (var k=0;k<q[2]*4;k++){ var x=q[0]+Math.floor(hash(k,q[0])*q[2]*2)-q[2], y=q[1]+Math.floor(hash(q[0],k)*4)-2; b.px(x,y,hash(k,7)<0.5?P.d3:(hash(k,8)<0.5?P.d4:P.r3)); } b.px(q[0],q[1]-2,P.g2); });
  // Wäsche zwischen den Fenstern
  [[150,61,164],[246,60,258],[330,62,342]].forEach(function(q,j){ var x0=q[0], y0=q[1], x1=q[2]; for (var x=x0;x<=x1;x++) b.px(x,y0+Math.round(Math.sin(Math.PI*(x-x0)/(x1-x0))*1),P.s1);
    var cols=[P.s6,P.b3,P.r3,P.y4,P.s5,P.g4]; for (var k=0;k<4;k++){ var px=x0+2+k*3, c=cols[(j*2+k)%cols.length]; b.rect(px,y0+1+Math.round(Math.sin(Math.PI*(px-x0)/(x1-x0))),2,2+(k%2),c); } }); }

// ---------------------------------------------------------------- Boote
// o: x, wl (Wasserlinie), len, h (Freibord), dir (1 = Bug rechts), hull/trim (Rampen), band, name, cabin:[t0,t1,h], mast:[t,h], yard, motor, tyres:[t..], cargo, transom
function boat(w,o){ var L=o.len, h=o.h, wl=o.wl, dir=o.dir||1, sb=o.sb===undefined?6:o.sb, ss=o.ss===undefined?(o.transom?1:4):o.ss, Hr=o.hull, Tr=o.trim, band=o.band===undefined?P.r2:o.band;
  var t0=o.transom?0:0.07, t1=0.85, info={top:[],X:[]};
  function X(t){ return dir>0?o.x+Math.round(t*(L-1)):o.x+L-1-Math.round(t*(L-1)); }
  for (var i=0;i<L;i++){ var t=i/(L-1), xx=dir>0?o.x+i:o.x+L-1-i;
    var rise=sb*Math.pow(Math.max(0,(t-0.42)/0.58),2.1)+ss*Math.pow(Math.max(0,(0.4-t)/0.4),2.2), top=Math.round(wl-h-rise), bot=wl;
    if (t>t1){ var k=(t-t1)/(1-t1); bot=Math.round(wl-Math.pow(k,1.45)*(wl-top-1)); }
    if (t<t0){ var k2=(t0-t)/t0; bot=Math.round(wl-Math.pow(k2,1.3)*(wl-top)*0.75); }
    info.top[i]=top; info.X[i]=xx;
    // man sieht leicht von oben hinein: Innenbord und gegenüberliegende Bordwand
    var inn=Math.round(Math.sin(Math.PI*cl((t-0.05)/0.88,0,1))*(o.deep||2.6));
    if (inn>0 && !o.decked){ for (var q=1;q<=inn;q++) w.px(xx,top-q,q===inn?Tr[1]:(q===inn-1?(o.inner2||P.w2):(o.inner||P.w1))); }
    for (var y=top;y<=bot;y++){ var dy=y-top, c;
      if (dy===0) c=Tr[Tr.length-1]; else if (dy===1) c=Tr[2]; else if (dy===2 && h>5) c=Tr[1]; else if ((dy===3&&h>5)||(dy===2&&h<=5)) c=Tr[0];
      else { var v=(y-top)/Math.max(1,wl-top), hv=0.98-v*0.7; if (t<0.1||t>0.9) hv-=0.22; if (dy%3===0 && h>7 && hash(xx>>2,y)<0.6) hv-=0.08; c=ra(Hr,hv,xx,y); }
      if (y>=wl-1 && bot===wl && band!==null) c=(y===wl)?M.DN[band]:band;
      if (y===bot && bot<wl) c=Hr[0];
      if (i===0 && o.transom) c=M.DN[c];
      w.px(xx,y,c); } }
  // Vorsteven ragt über das Schanzkleid
  if (!o.noStem){ var sx=X(1), sy=info.top[L-1]; w.px(sx,sy-1,P.w1); w.px(sx,sy-2,P.w1); w.px(sx-dir,sy-1,P.w2); }
  (o.cargo||[]).forEach(function(cg){ var a=Math.round(cg[0]*(L-1)), b2=Math.round(cg[1]*(L-1)), col=cg[2], hh=cg[3]||2;
    for (var i2=Math.min(a,b2);i2<=Math.max(a,b2);i2++){ var tt=info.top[i2], xx2=info.X[i2], hgt=Math.round(hh*Math.sin(Math.PI*(i2-a)/Math.max(1,b2-a)))+1; for (var y2=tt-1-hgt;y2<tt;y2++) w.px(xx2,y2,(hash(xx2,y2)<0.3)?M.DN[col]:(y2===tt-1-hgt?M.UP[col]:col)); } });
  // Ruder: im Boot liegend (oars) und in der Dolle, ins Wasser gestreckt (oarsOut)
  (o.oars||[]).forEach(function(oa){ var a=Math.round(oa[0]*(L-1)), b2=Math.round(oa[1]*(L-1)), lift=oa[2]||0; for (var i2=a;i2<=b2;i2++){ var xx2=info.X[i2], tt=info.top[i2]-1-Math.round(lift*(i2-a)/Math.max(1,b2-a)); w.px(xx2,tt,P.w4); w.px(xx2,tt+1,P.w2); }
    var bxo=info.X[b2], byo=info.top[b2]-1-lift; w.rect(bxo-1,byo-1,3,2,P.w3); w.px(bxo-1,byo-1,P.w5); });
  if (o.oarsOut){ var oi=Math.round(o.oarsOut*(L-1)), oxo=info.X[oi], oyo=info.top[oi]; w.px(oxo,oyo-1,P.m1); w.px(oxo,oyo-2,P.m2); w.line(oxo,oyo-1,oxo+dir*8,wl+1,P.w4); w.line(oxo+1,oyo,oxo+dir*8+1,wl+1,P.w2); w.rect(oxo+dir*8-1,wl,4,2,P.w3); w.hl(oxo+dir*8-1,oxo+dir*8+2,wl,P.w4);
    w.line(oxo-dir*3,oyo-6,oxo,oyo-1,P.w3); w.px(oxo-dir*3,oyo-7,P.w4); }
  if (o.cabin){ var ca=X(o.cabin[0]), cb=X(o.cabin[1]), cx0=Math.min(ca,cb), cx1=Math.max(ca,cb), ty=info.top[Math.round(o.cabin[0]*(L-1))]-1, ch=o.cabin[2], Cr=o.cabinCol||R('s3 s4 s5 s6');
    for (var yy=ty-ch;yy<ty;yy++) for (var xx3=cx0;xx3<=cx1;xx3++){ var c3=Cr[2]; if (xx3===cx0) c3=Cr[3]; if (xx3>=cx1-1) c3=Cr[1]; if (yy===ty-1) c3=Cr[0]; w.px(xx3,yy,c3); }
    for (var wx=cx0+2;wx+2<cx1-1;wx+=4){ w.rect(wx,ty-ch+3,3,3,P.n1); w.px(wx,ty-ch+3,P.b4); w.px(wx+1,ty-ch+3,P.b3); }
    w.hl(cx0-1,cx1+1,ty-ch-1,Tr[2]); w.hl(cx0-1,cx1+1,ty-ch,Tr[0]); w.vl(Math.round((cx0+cx1)/2),ty-ch-5,ty-ch-2,P.m1); w.px(Math.round((cx0+cx1)/2),ty-ch-6,P.m3); }
  if (o.mast){ var mx=X(o.mast[0]), mt=info.top[Math.round(o.mast[0]*(L-1))], mh=o.mast[1];
    w.vl(mx,mt-mh,mt-1,P.w2); for (var yy2=mt-mh;yy2<mt;yy2+=4) w.px(mx,yy2,P.w3); w.px(mx,mt-mh+4,P.k2);
    if (o.yard){ var ya=[mx-dir*Math.round(L*0.36),mt-6], yb=[mx+dir*Math.round(L*0.3),mt-mh+2]; w.line(ya[0],ya[1],yb[0],yb[1],P.w1);
      var n=Math.max(Math.abs(yb[0]-ya[0]),1); for (var s=0;s<=n;s++){ var tx=ya[0]+(yb[0]-ya[0])*s/n, ty2=ya[1]+(yb[1]-ya[1])*s/n, fat=(s>n*0.06&&s<n*0.94)?(s>n*0.3&&s<n*0.75?3:2):1; for (var f=1;f<=fat;f++){ var sc0=o.sail||P.s5; w.px(Math.round(tx),Math.round(ty2)+f,f===1?M.UP[sc0]:(f===fat?M.DN[sc0]:sc0)); } if (s%7===3) w.px(Math.round(tx),Math.round(ty2)+fat,M.DN[M.DN[o.sail||P.s5]]); }
      w.line(mx,mt-mh+1,ya[0]+dir*2,ya[1]+1,P.s1); }
    if (o.stay!==false){ w.line(mx,mt-mh+1,X(0.99),info.top[L-1]-1,P.s1); }
    info.mt=[mx,mt-mh-1]; o._mt=info.mt; }
  if (o.motor){ var mx2=X(0)-dir*2, my=info.top[0]; w.rect(mx2-1,my-3,4,6,P.s5); w.hl(mx2-1,mx2+2,my-3,P.s6); w.vl(mx2+2,my-3,my+2,P.s3); w.px(mx2,my-1,P.b1); w.vl(mx2,my+3,wl,P.m1); w.px(mx2+dir,my+3,P.m2); }
  if (o.name){ var nt=o.nameAt||0.84, ny=info.top[Math.round(Math.min(nt,0.8)*(L-1))]+(h>8?4:3), nx=dir>0?X(nt)-M.microWidth(o.name):X(nt); if (h>6) w.micro(o.name,nx,ny,o.nameCol||P.k2); }
  if (o.reg && h>8){ var rx=dir>0?X(0.1):X(0.1)-M.microWidth(o.reg), ry=info.top[Math.round(0.12*(L-1))]+4; w.micro(o.reg,rx,ry,o.nameCol||P.k2); }
  (o.tyres||[]).forEach(function(tt){ var tx=X(tt), tyy=info.top[Math.round(tt*(L-1))]+2; w.vl(tx,tyy-2,tyy,P.e2); w.ellipse(tx+0.5,tyy+3,3.1,2.4,P.k1); w.hl(tx-1,tx+1,tyy+3,P.k0); w.px(tx-2,tyy+2,P.m1); w.px(tx-1,tyy+1,P.m1); });
  return info; }
var BOATS=[
  // fern (an der Kaimauer drüben)
  {x:12,wl:81,len:30,h:4,dir:1,hull:R('r1 r2 r3 r4'),trim:R('s3 s4 s5 s6'),band:null,deep:1,sb:2,noStem:true,far:1},
  {x:52,wl:81,len:26,h:4,dir:-1,hull:R('s3 s4 s5 s6'),trim:R('g1 g2 g3 g4'),band:null,deep:1,sb:2,noStem:true,far:1},
  {x:84,wl:81,len:22,h:3,dir:1,hull:R('b1 b2 b3 b4'),trim:R('s3 s4 s5 s6'),band:null,deep:1,sb:2,noStem:true,far:1},
  {x:262,wl:81,len:30,h:4,dir:1,hull:R('b0 b1 b2 b3'),trim:R('s3 s4 s5 s6'),band:null,deep:1,sb:2,cabin:[0.35,0.55,4],noStem:true,far:1},
  {x:300,wl:81,len:24,h:3,dir:-1,hull:R('y2 y3 y4 y5'),trim:R('w1 w2 w3 w4'),band:null,deep:1,sb:2,noStem:true,far:1},
  {x:338,wl:81,len:36,h:4,dir:-1,hull:R('s3 s4 s5 s6'),trim:R('b0 b1 b2 b3'),band:null,deep:1,sb:2,mast:[0.6,15],noStem:true,far:1},
  // Mitte (an Bojen)
  {x:110,wl:94,len:62,h:7,dir:1,hull:R('g1 g2 g3 g4 g5'),trim:R('y1 y2 y3 y4'),band:P.r1,name:'GALEB',nameCol:P.s6,transom:true,motor:true,cargo:[[0.3,0.55,P.t3,2]],oars:[[0.58,0.84,1]]},
  {x:318,wl:94,len:68,h:7,dir:-1,hull:R('s3 s4 s5 s6'),trim:R('r1 r2 r3 r4'),band:P.r2,name:'SV. NIKOLA',nameCol:P.r1,mast:[0.58,32],yard:true,sail:P.s4,cargo:[[0.2,0.4,P.b2,2]]},
  // nah (längsseits an der Mole)
  {x:22,wl:106,len:108,h:12,dir:1,hull:R('s2 s3 s4 s5 s6'),trim:R('b0 b1 b2 b3'),band:P.r2,name:'MARIJA',nameCol:P.b0,reg:'ST 2061',mast:[0.6,60],yard:true,sail:P.s5,tyres:[0.3,0.52,0.72],cargo:[[0.16,0.38,P.t3,3],[0.64,0.78,P.b2,2]],oars:[[0.4,0.58,2]],deep:3},
  // kleine Pasara mit Rudern, rechts im Becken
  {x:352,wl:104,len:40,h:7,dir:1,hull:R('s3 s4 s5 s6'),trim:R('g1 g2 g3 g4'),band:P.g1,name:'SRIĆA',nameCol:P.g1,nameAt:0.86,oarsOut:0.46,oars:[[0.16,0.36,1]],deep:2,sb:5,ss:3},
  {x:238,wl:106,len:100,h:12,dir:-1,hull:R('b0 b1 b2 b3 b4'),trim:R('s3 s4 s5 s6'),band:P.k2,name:'DVA BRATA',nameCol:P.s6,nameAt:0.62,cabin:[0.28,0.48,13],mast:[0.6,30],tyres:[0.24,0.7],transom:true,cargo:[[0.62,0.8,P.g3,2]],deep:3}
];

// ---------------------------------------------------------------- Wasser des Beckens
var WATER={day:R('a1 a2 a3 a4 a5 a6'),dusk:R('k1 d0 d1 d2 d3 d4 d5'),night:R('k0 a0 a1 n0 n1 n2'),dawn:R('n1 n2 d2 d3 a4')};
function wcol(x,y,t,tod,calm){ var ramp=WATER[tod]||WATER.day, d=(y-FQ)/(QY-FQ);
  var s=Math.sin(x*0.09+y*1.15+t*1.3)+Math.sin(x*0.031-t*0.55+y*0.41)*0.8+(calm?0:Math.sin(x*0.27+y*2.3-t*2.9)*0.55);
  var v=0.6-d*0.34+s*(calm?0.055:0.09)+(tod==='dusk'?0.08:0); var c=ra(ramp,v,x,y); if (!calm && s>1.95 && ((x+y)&1)) c=ramp[ramp.length-1]; if (calm && s>1.8 && (y&1) && (x%3===0)) c=ramp[ramp.length-2]; return c; }
function isWater(x,y){ return x>=0 && x<BX1 && y>=FQ && y<QY; }

// ---------------------------------------------------------------- Mole (Lauffläche): große, blankgetretene Kalksteinplatten
var ROWS=[110,114,119,125,132,140,149];
var RM=R('s1 s2 s3 s4 s5');
function moleTex(x,y){ var ri=0; while (ri<ROWS.length-2 && y>=ROWS[ri+1]) ri++; var y0=ROWS[ri], hgt=ROWS[ri+1]-y0, fy=y-y0, sw=hgt*5.2+14, off=hash(ri,4)*sw, col=Math.floor((x+off)/sw), fx=(x+off)-col*sw;
  if (fy===0) return bayer(x,y)<0.7?RM[1]:RM[2]; if (fx<1) return RM[1]; if (fx<2 && hash(col,ri)<0.5) return RM[2];
  var t=hash(col,ri*7+1), base=t<0.25?1.55:(t<0.8?2.1:2.45); var f=fbm(x*0.09+col,y*0.35), v=base+(f-0.5)*0.9; if (fy===1) v+=0.35; if (fx>sw-2) v-=0.4;
  var g=fbm(x*0.5,y*1.3); if (g>0.74) v+=0.45; var c=RM[cl(Math.floor(v+(bayer(x,y)-0.5)*0.22),0,4)]; if (hash(x*3,y*5)<0.025) c=RM[1]; return c; }

// ---------------------------------------------------------------- Requisiten am Kai
function bollard(w,cx,by){ var I=R('k1 m0 m1 m2 m3'); w.rect(cx-3,by-7,7,7,I[1]); w.vl(cx-3,by-7,by-1,I[2]); w.vl(cx-2,by-7,by-1,I[3]); w.vl(cx+3,by-7,by-1,I[0]); w.rect(cx-4,by-9,9,2,I[1]); w.hl(cx-4,cx+4,by-9,I[3]); w.hl(cx-4,cx+4,by-8,I[2]); w.rect(cx-2,by-11,5,2,I[2]); w.hl(cx-2,cx+2,by-11,I[4]);
  w.px(cx+1,by-4,P.t2); w.px(cx-1,by-2,P.t1); w.px(cx+2,by-6,P.t2); w.hl(cx-4,cx+4,by,P.s1); }
function rope(w,x0,y0,x1,y1,sag,col){ var n=Math.max(2,Math.abs(x1-x0)); for (var i=0;i<=n;i++){ var t=i/n, x=Math.round(x0+(x1-x0)*t), y=Math.round(y0+(y1-y0)*t+Math.sin(Math.PI*t)*sag); w.px(x,y,col||P.e3); if (i%3===0) w.px(x,y+1,P.e1); } }
function fishbox(w,x,y,bw,bh,Rb){ Rb=Rb||R('b0 b1 b2 b3'); w.rect(x,y,bw,bh,Rb[2]); w.hl(x,x+bw-1,y,Rb[3]); w.hl(x,x+bw-1,y+1,Rb[1]); w.vl(x,y,y+bh-1,Rb[3]); w.vl(x+bw-1,y,y+bh-1,Rb[0]); w.hl(x,x+bw-1,y+bh-1,Rb[0]);
  for (var xx=x+3;xx<x+bw-2;xx+=3) w.vl(xx,y+3,y+bh-2,Rb[1]); w.rect(x+2,y+2,3,1,Rb[0]); w.rect(x+bw-5,y+2,3,1,Rb[0]); }
// Netzhaufen: mehrere Wülste mit Maschen, Korkschwimmern und Bleileine
function netHeap(w,cx,by,rx,ry,Rn,seed){ var r=M.rng(seed||5), lobes=[], i, k, s;
  for (i=0;i<5;i++){ lobes.push([cx+(r()-0.5)*rx*1.2,by-ry*(0.45+r()*0.5),rx*(0.45+r()*0.35),ry*(0.5+r()*0.4)]); }
  lobes.sort(function(a,b){ return a[1]-b[1]; });
  lobes.forEach(function(l){ w.ellipse(l[0],l[1],l[2],l[3],function(x,y){ var u=(y-(l[1]-l[3]))/(2*l[3]), c=netTex(x,y,Rn,3); if (u>0.72) c=M.DN[c]; if (u>0.9) c=Rn[0]; if (u<0.28 && hash(x,y)<0.55) c=M.UP[c]; return c; }); });
  for (k=0;k<3;k++){ var a0=r()*Math.PI, ln=rx*1.2, y0=by-ry*(0.6+r()*0.6); for (s=0;s<ln;s+=2.6){ var fx=Math.round(cx-rx*0.6+s+(r()-0.5)), fy=Math.round(y0+Math.sin(s*0.25+a0)*ry*0.35); if (Math.abs(fx-cx)>rx*0.95) continue; w.px(fx,fy,k===2?P.s6:P.y4); w.px(fx+1,fy,k===2?P.s5:P.y3); } }
  for (s=0;s<rx*1.6;s+=2){ var gx=Math.round(cx-rx*0.8+s), gy=Math.round(by-1-Math.abs(Math.sin(s*0.2))*1.5); w.px(gx,gy,P.m0); } }
function crateSeat(w,x,y,cw,ch){ var Rw=R('w0 w1 w2 w3 w4'); w.rect(x,y,cw,ch,Rw[2]); for (var yy=y+1;yy<y+ch;yy+=3){ w.hl(x,x+cw-1,yy,Rw[1]); } w.hl(x,x+cw-1,y,Rw[4]); w.hl(x,x+cw-1,y+1,Rw[3]); w.vl(x,y,y+ch-1,Rw[3]); w.vl(x+cw-1,y,y+ch-1,Rw[0]); w.vl(x+Math.floor(cw/2),y+2,y+ch-1,Rw[1]); w.hl(x,x+cw-1,y+ch-1,Rw[0]); for (var k=0;k<6;k++) w.px(x+1+Math.floor(hash(k,x)*(cw-2)),y+2+Math.floor(hash(x,k)*(ch-3)),Rw[1]); w.micro('ST',x+2,y+5,Rw[0]); }
function lamp(w){ var x=LAMP.x, by=LAMP.base, h=LAMP.h, I=R('k1 m0 m1 m2');
  w.rect(x-3,by-4,7,4,I[1]); w.hl(x-3,x+3,by-4,I[3]); w.rect(x-2,by-8,5,4,I[1]); w.rect(x-1,by-h,3,h-8,I[1]); w.vl(x-1,by-h,by-9,I[2]); w.vl(x+1,by-h,by-9,I[0]);
  for (var yy=by-h+6;yy<by-10;yy+=9) w.hl(x-2,x+2,yy,I[2]);
  var hy=by-h; w.rect(x-3,hy-7,7,7,P.m2); w.rect(x-2,hy-6,5,5,P.s3); w.vl(x,hy-6,hy-2,P.m1); w.hl(x-4,x+4,hy-8,I[1]); w.poly([[x-4,hy-8],[x,hy-11],[x+4,hy-8]],I[1]); w.px(x,hy-12,I[2]); w.hl(x-3,x+3,hy,I[1]); w.hl(x-2,x+2,hy+1,I[1]); }
// Ruder, an die Schuppenwand gelehnt
function shedOars(b){ [[151,110,158,60],[154,110,161,63]].forEach(function(o,i){ b.line(o[0],o[1],o[2],o[3],i?P.w3:P.w4); b.line(o[0]+1,o[1],o[2]+1,o[3],P.w1); var bx=o[2], by=o[3]; b.rect(bx-1,by,3,8,i?P.w3:P.w4); b.vl(bx-1,by,by+7,i?P.w4:P.w5); b.vl(bx+1,by,by+7,P.w2); b.px(bx,by+8,P.w2); }); }
// Vrša: glockenförmige Fischreuse aus Draht
function vrsa(w,cx,by){ for (var y=by-10;y<by;y++){ var t=(y-(by-10))/10, hw=Math.round(1.5+Math.sin(t*Math.PI*0.6)*4.5); for (var x=cx-hw;x<=cx+hw;x++){ var edge=(x===cx-hw||x===cx+hw), on=edge||((x+y)&1)===0||y===by-1||((y-by)%4===0); if (!on) continue; w.px(x,y,edge?(x<cx?P.m3:P.m1):(x<cx?P.m2:P.m1)); } }
  w.hl(cx-1,cx+1,by-11,P.m3); w.px(cx,by-12,P.e3); for (var x2=cx-5;x2<=cx+5;x2++) w.px(x2,by,P.k2); w.px(cx-2,by-5,P.t3); }
// sitzende Möwe (f: Blick nach rechts 1, links -1)
function gullSit(b,x,y,f){ function p(dx,dy,c){ b.px(x+dx*f,y+dy,c); } p(0,0,P.s6); p(1,0,P.s6); p(2,-1,P.s6); p(2,-2,P.s5); p(3,-1,P.y3); p(-1,0,P.m2); p(-2,-1,P.m1); p(0,1,P.s4); p(1,1,P.s4); p(-1,1,P.m3); p(0,2,P.y2); }
// rostiger Drehkran an der Beckenecke (früher für das Eis)
function crane(b,x,by){ var y, k; b.rect(x-2,by-34,4,34,P.t1); b.vl(x-2,by-34,by-1,P.t2); b.vl(x+1,by-34,by-1,P.t0); for (y=by-32;y<by;y+=5){ b.px(x-1,y,P.m1); }
  b.rect(x-4,by-3,8,3,P.m0); b.hl(x-4,x+3,by-3,P.m2);
  b.line(x,by-34,x-30,by-40,P.t1); b.line(x,by-33,x-30,by-39,P.t2); b.line(x,by-26,x-24,by-39,P.t0); for (k=0;k<6;k++){ var t=k/6; b.line(Math.round(x-t*24),Math.round(by-26-t*13),Math.round(x-t*24-4),Math.round(by-34-t*5),P.t0); }
  b.vl(x-30,by-39,by-22,P.k2); b.rect(x-31,by-22,3,2,P.m1); b.px(x-30,by-20,P.m1); b.px(x-31,by-19,P.m1);
  b.rect(x+1,by-30,5,6,P.m1); b.hl(x+1,x+5,by-30,P.m2); }

// ---------------------------------------------------------------- Malen
var SKYB=null, DYN=null;
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), calm=weather!=='bura', dusk=tod==='dusk';
  var wins=[], x, y, k;
  SKYB=new M.Buf(W,H,P.k0); skyPaint(SKYB,tod,weather); b.copyFrom(SKYB);
  paintMarjan(b);
  // Varoš: drei Häuserreihen den Hang hinab
  houses(b,wins,92,330,function(x){ return 41+(x-100)*0.055; },11,7,51,0.8);
  church(b,214,Math.round(41+(221-100)*0.055)+1);
  farTower(b);
  houses(b,wins,60,392,function(x){ return 57+(x-80)*0.03; },13,8,61,0.9);
  houses(b,wins,30,BX1+4,function(){ return 72; },15,9,71,1.0);
  varosExtras(b); towerVisible(b);
  // Luftperspektive (vor allem der Marjan und die oberen Häuser)
  haze(b,0,W,0,FQ,function(x,y){ return y<38?HZ[0]:(y<54?HZ[1]:(y<64?HZ[2]:null)); },function(x,y){ return b.d[y*W+x]!==SKYB.d[y*W+x]; });
  for (k=0;k<TWPIX.length;k+=3){ var to=TWPIX[k+1]*W+TWPIX[k]; b.d[to]=HZT.a[b.d[to]]; }      // der Turm ist weiter weg als Varoš
  // Gasse rechts hinauf nach Varoš (zwischen Becken und Ledana)
  for (y=40;y<QY;y++) for (x=BX1;x<LX0;x++){ var c=stones(x,y,R('s0 s1 s2 s3'),6,4); if (x<BX1+3||x>LX0-4) c=M.DN[c]; b.px(x,y,c); }
  for (var st=0;st<12;st++){ var sy=QY-3-Math.round(st*3.6-st*st*0.06); if (sy<44) break; b.hl(BX1+3,LX0-5,sy,st<6?P.s4:P.s3); b.hl(BX1+3,LX0-5,sy+1,P.s1); }
  b.rect(BX1+5,40,8,4,P.s3); b.px(BX1+8,38,P.m1); b.vl(BX1+8,32,38,P.m1); b.px(BX1+7,31,P.m2); b.px(BX1+9,31,P.m2);
  // Kaistraße und Kaimauer drüben, Laternen, geparkte Autos
  for (x=0;x<BX1;x++){ for (y=72;y<FQ;y++){ var cq=y<75?(y===72?P.s5:P.s4):stones(x,y,R('s1 s2 s3 s4'),7,3); if (y>=FQ-1) cq=(hash(x,1)<0.5)?P.g1:P.e1; b.px(x,y,cq); } }
  konobe(b);
  FARLAMPS.forEach(function(lx){ b.vl(lx,62,72,P.m1); b.px(lx,61,P.m2); b.px(lx-1,61,P.m1); b.px(lx+1,61,P.m1); });
  for (x=8;x<BX1;x+=23) b.rect(x,71,2,2,P.m1);
  [[150,P.r3],[196,P.s5],[286,P.b2]].forEach(function(cr){ var cx=cr[0]; b.rect(cx,68,12,4,cr[1]); b.rect(cx+2,65,7,3,cr[1]); b.rect(cx+3,66,5,2,P.n1); b.hl(cx,cx+11,68,M.UP[cr[1]]); b.px(cx+2,72,P.k1); b.px(cx+9,72,P.k1); });
  // ferner Hintergrund: je Tageszeit fertig gefärbt (nicht nachträglich umgefärbt)
  if (BGL[tod]){ var BL=BGL[tod]; for (y=0;y<FQ;y++) for (x=0;x<LX0;x++){ var o=y*W+x; if (b.d[o]===SKYB.d[o]) continue; b.d[o]=BL[y<38?0:(y<60?1:2)].a[b.d[o]]; } }
  var S0=b.clone();
  // Becken (Tönung je Tageszeit, wird nicht umgefärbt)
  for (y=FQ;y<QY;y++) for (x=0;x<BX1;x++) b.px(x,y,wcol(x,y,0,tod,calm));
  var S1=b.clone();
  // Boote (jedes in eigenem Puffer, für das Schaukeln)
  var boatBufs=[];
  BOATS.forEach(function(o){ var bb=M.layer(o.x-40,o.wl-74,o.len+80,80,o.wl), ww=M.lw(bb); boat(ww,o); if (o.far) haze(bb,0,bb.w,0,bb.h,HZ[2]); boatBufs.push(bb); b.blit(bb,bb.ox,bb.oy); });
  var S2=b.clone();
  // ---- Mole: Kante zum Becken, Platten
  for (x=0;x<W;x++){ var ci=Math.floor((x+7)/26), cfx=(x+7)-ci*26; for (y=QY;y<H;y++){ var cm;
      if (y<110){ cm=(y===QY)?(cfx===0?P.s3:P.s5):(cfx===0?P.s2:P.s4); if (y===QY && hash(ci,3)<0.3) cm=P.s4; }
      else cm=moleTex(x,y);
      b.px(x,y,cm); } }
  for (x=0;x<W;x++){ if (bayer(x,110)<0.8) b.px(x,110,P.s1); if (bayer(x,111)<0.3) b.px(x,111,M.DN[b.get(x,111)]); }
  for (k=0;k<22;k++){ var fx=Math.floor(hash(k,77)*W), fy=113+Math.floor(hash(k,78)*24); b.ellipse(fx,fy,3+hash(k,79)*6,1+hash(k,80)*1.2,function(xx,yy){ var c0=b.get(xx,yy); return (c0===RM[0]||c0===RM[1])?c0:M.DN[c0]; }); }
  // eiserne Festmacherringe an der Kante
  [70,150,336,388].forEach(function(rx){ b.rect(rx-1,110,3,1,P.s1); for (var a=0;a<14;a++){ var an=a/14*Math.PI*2, ex=rnd(rx+Math.cos(an)*2.6), ey=rnd(112+Math.sin(an)*1.3); b.px(ex,ey,an>Math.PI*0.9&&an<Math.PI*1.6?P.m3:(an<Math.PI?P.k2:P.m1)); } b.px(rx+2,113,P.t2); b.px(rx-2,111,P.t1); });
  for (k=0;k<60;k++){ var sx=Math.floor(hash(k,91)*390), sy2=112+Math.floor(hash(k,92)*26); b.px(sx,sy2,hash(k,93)<0.5?P.s5:P.a5); }
  // ---- Ledana, Kran, Schuppen
  paintLedana(b,tod);
  crane(b,404,QY);
  paintShed(b); shedOars(b);
  // ---- Poller, Taue, Netze, Kisten
  var bw={px:function(x,y,c){ b.px(x,y,c); },rect:function(x,y,w,h,c){ b.rect(x,y,w,h,c); },hl:function(a,z,y,c){ b.hl(a,z,y,c); },vl:function(x,a,z,c){ b.vl(x,a,z,c); },line:function(a,c2,d,e,f){ b.line(a,c2,d,e,f); },ellipse:function(a,c2,d,e,f){ b.ellipse(a,c2,d,e,f); },poly:function(p,c){ b.poly(p,c); },micro:function(s,x,y,c){ M.microText(b,s,x,y,c); }};
  [[24,111],[136,111],[154,111],[262,111],[348,111]].forEach(function(p){ bollard(bw,p[0],p[1]); });
  rope(bw,388,111,389,97,0.4,P.e3); vrsa(bw,110,116);
  rope(bw,24,102,28,96,0.6,P.e3); rope(bw,136,102,124,93,1.4,P.e3); rope(bw,262,102,250,96,1.2,P.e3); rope(bw,348,102,334,95,1.6,P.e4); rope(bw,154,102,172,93,1,P.e2);
  // Netze: orange und grün, auf der Mole aufgeschossen
  netHeap(bw,120,126,17,7,R('t1 t2 t3 t4 t5'),7); netHeap(bw,92,119,12,5,R('g1 g2 g3 g4 g5'),8); netHeap(bw,146,121,9,4,R('t2 t3 t4 y3 y4'),9);
  // Dinkos Netz: vom Schoß über die Kiste auf den Boden gezogen
  for (y=116;y<133;y++) for (x=194;x<240;x++){ var dxn=(x-216)/23, dyn=(y-126)/6.5, edge=1+Math.sin(x*0.6)*0.12+Math.sin(y*1.3)*0.08; if (dxn*dxn+dyn*dyn>edge) continue; var cn=netTex(x,y,R('t1 t2 t3 t4'),4); if (bayer(x,y)<0.3 && cn!==P.t4) continue; if (Math.sin(x*0.35+y*0.2)>0.7) cn=M.UP[cn]; b.px(x,y,cn); }
  for (x=230;x<241;x++){ var yy0=Math.round(116+(x-230)*0.2); b.px(x,yy0,P.t2); if (x%2) b.px(x,yy0+1,P.t3); }
  for (x=198;x<236;x+=4) b.px(x,Math.round(120.5+Math.sin(x*0.3)*1.2),P.y4);
  for (x=200;x<234;x+=5) b.px(x,Math.round(131+Math.sin(x*0.4)),P.m0);
  // Eimer, Kanister, Transistorradio bei Dinko
  b.rect(257,117,7,7,P.s5); b.hl(257,263,117,P.s6); b.vl(263,117,123,P.s3); b.hl(257,263,119,P.b2); b.line(256,115,264,115,P.m2); b.px(256,116,P.m2); b.px(264,116,P.m2);
  b.rect(280,112,8,11,P.r3); b.hl(280,287,112,P.r4); b.vl(287,112,122,P.r1); b.rect(282,110,3,2,P.k2); b.hl(280,287,117,P.r2);
  b.rect(226,121,7,4,P.k2); b.hl(226,232,121,P.m1); b.px(231,122,P.s4); b.vl(232,117,120,P.m3);
  // Fischkisten am Kai (links, am Ausgang)
  [[38,114,3],[54,113,2],[68,116,4]].forEach(function(s,si){ for (var j=0;j<s[2];j++){ var Rb=(si===1&&j===1)?R('r0 r1 r2 r3'):((si===2&&j===3)?R('s2 s3 s4 s5'):R('b0 b1 b2 b3')); fishbox(bw,s[0]+(j%2),s[1]-j*6,15,6,Rb); } });
  M.microText(b,'ST',72,104,P.b0);
  lamp(bw);
  [[22,98,1],[346,98,-1],[199,33,1]].forEach(function(g){ gullSit(b,g[0],g[1],g[2]); });
  paintFence(b,bw,S);
  // ---- Licht und Schatten (vor dem Umfärben)
  var LF=M.lf.sum(M.lf.band(112,144,0.15,-0.75),
    function(x,y){ var s=0; // Schlagschatten (Sonne von rechts vorn): nach links hinten
      if (y>=110&&y<117&&x>SHED.x0-14&&x<SHED.x1-6) s-=0.9*(1-(y-110)/7); if (y>=110&&y<114&&x>=LX0-6) s-=0.6;
      if (y>=113&&y<125&&x>=222&&x<240) s-=0.7*(1-Math.abs(y-121)/6); if (y>=110&&y<118&&x>=30&&x<70) s-=0.6; if (y>=118&&y<128&&x>=100&&x<120) s-=0.5;
      if (y>=109&&y<112&&x>=LAMP.x-30&&x<LAMP.x) s-=0.5; return s; },
    function(x,y){ if (!dusk) return 0; if (y<QY && x<LX0) return -0.6*(1-x/LX0)-0.2; return 0; },
    function(x,y){ if (x<LX0-8 || y>=QY+2) return 0; return tod==='day'?0.15:(dusk?-0.55:0); });
  function maskOf(buf){ var m=new Uint8Array(W*H); for (var yy=0;yy<QY;yy++) for (var xx=0;xx<W;xx++){ var o=yy*W+xx; if (yy<FQ){ if (buf.d[o]===S0.d[o] && (xx<LX0 || buf.d[o]===SKYB.d[o])) m[o]=1; } else if (xx<BX1 && buf.d[o]===S1.d[o]) m[o]=1; } return m; }
  var mB=maskOf(b), m1=maskOf(S1), m2=maskOf(S2);
  var lights=[];
  if (tod!=='day'){ lights.push([LAMP.x-10,LAMP.base+13,50,0.85,17],[LAMP.x-8,LAMP.base+8,30,0.95,10],[LAMP.x,LAMP.base-LAMP.h-2,13,0.9,13]); }
  function fin(buf,m){ M.light(buf,LF,0,0,function(x,y){ return !m[y*W+x]; }); return finish(buf,tod,{sky:function(x,y){ return m[y*W+x]===1; },lights:lights,after:function(bb,td){ afterLights(bb,td,wins); }}); }
  var out=fin(b,mB), S1T=fin(S1,m1), S2T=fin(S2,m2);
  buildDyn(out,S1T,S2T,boatBufs,tod);
  return out; }

function afterLights(b,tod,wins){ if (tod==='day') return;
  wins.forEach(function(w,i){ var p=w[4]*(tod==='night'?1:0.6); if (hash(w[0]*1.3,w[1]*0.7)<p){ if (w[4]<0.1){ for (var yy=w[1];yy<w[1]+w[3];yy+=2) b.hl(w[0],w[0]+w[2]-1,yy,P.y2); } else { b.rect(w[0],w[1],w[2],w[3],hash(i,3)<0.5?P.y3:P.y4); if (w[2]>1) b.px(w[0],w[1],P.y5); } } });
  FARLAMPS.forEach(function(lx){ b.px(lx,61,P.y5); b.px(lx-1,61,P.y4); b.px(lx+1,61,P.y4); b.px(lx,62,P.y3); });
  var hx=LAMP.x, hy=LAMP.base-LAMP.h; b.rect(hx-2,hy-6,5,5,P.y4); b.rect(hx-1,hy-5,3,3,P.y5); b.px(hx,hy-4,P.l1); b.vl(hx,hy-6,hy-2,P.y2);
  b.hl(SDOOR[0]+2,SDOOR[0]+SDOOR[2]-3,SDOOR[1]+SDOOR[3]-1,P.k0);
  // Laternen an der Marjan-Treppe, der angestrahlte Glockenturm, eine offene Konoba
  for (var j=0;j<STPATH.length;j+=3){ var sx=STPATH[j], sy=STPATH[j+1], dm=9; for (var l=0;l<STLAMPS.length;l++){ var dd=Math.abs(STLAMPS[l][0]-sx)+Math.abs(STLAMPS[l][1]+4-sy)*0.7; if (dd<dm) dm=dd; }
    if (dm<5 && bayer(sx,sy)<(5-dm)/5+0.2) b.px(sx,sy,dm<2?P.y3:P.y2); else if (bayer(sx,sy)<0.4) b.px(sx,sy,P.y1); }
  STLAMPS.forEach(function(p){ b.px(p[0],p[1],P.y5); b.px(p[0],p[1]+1,P.y2); if (tod==='night'){ b.px(p[0]-1,p[1],P.y2); b.px(p[0]+1,p[1],P.y2); } });
  if (CHAP[1]){ var chx=CHAP[0], chb=CHAP[1]; b.px(chx+5,chb-5,P.y4); b.px(chx+6,chb-5,P.y3); b.px(chx+5,chb-4,P.y2); b.px(chx+6,chb-3,P.y1); b.px(chx+1,chb-10,P.y3); }
  for (var i=0;i<TWPIX.length;i+=3){ var tx=TWPIX[i], ty=TWPIX[i+1], c=M.tintPx(FLOOD,TWPIX[i+2],tx,ty), dn=M.qd((34-ty)/36*(tod==='night'?1.3:0.9),tx,ty); if (tod!=='night' && c!==P.k2) c=M.DN[c]; while (dn>0){ c=M.DN[c]; dn--; } b.px(tx,ty,c); }
  KOPEN.forEach(function(d){ for (var y=d[1];y<d[1]+d[3];y++) for (var x=d[0];x<d[0]+d[2];x++){ var ax=Math.abs(x+0.5-(d[0]+d[2]/2))/(d[2]/2); if (y===d[1] && ax>0.55) continue; b.px(x,y,y>d[1]+d[3]-3?(bayer(x,y)<0.5?P.y4:P.y3):(bayer(x,y)<0.4?P.y3:P.y2)); } b.px(d[0]+1,d[1]+3,P.k2); b.px(d[0]+1,d[1]+4,P.w0); b.px(d[0]+2,d[1]+4,P.w0); b.vl(d[0]+2,d[1]+2,d[1]+6,P.w0); }); }

// ---------------------------------------------------------------- Dinkos Schuppen
function paintShed(b){ var x0=SHED.x0, x1=SHED.x1, top=SHED.top, base=SHED.base, Rs=R('s0 s1 s2 s3 s4 s5'), x, y;
  // linke Seitenwand (im Schatten) und Dachfläche
  for (y=top-4;y<base;y++) for (x=x0-7;x<x0;x++){ var k=(x-(x0-7))/7, yt=top+3-Math.round(k*3); if (y<yt) continue; b.px(x,y,M.DN[M.DN[stones(x*1.4,y,Rs,7,5)]]); }
  for (y=top;y<base;y++) for (x=x0;x<x1;x++){ var c=stones(x,y,Rs.slice(1),8,5); if (x>=x1-2) c=M.DN[c]; b.px(x,y,c); }
  var mid=(x0+x1)/2, ridge=top-15;
  b.poly([[x0-2,top],[mid,ridge+2],[x1+2,top]],function(x,y){ return stones(x,y,Rs.slice(1),8,5); });
  b.poly([[x0-10,top+2],[x0-2,top],[mid,ridge+1],[mid-8,ridge-1]],function(x,y){ return rooftile(x+y*2,y,R('t0 t1 t2 t3')); });
  for (var s=-1;s<=1;s+=2){ for (var i=0;i<=44;i++){ var t=i/44, ex=mid+s*(t*(x1-x0)/2+4*t), ey=ridge+t*(top-ridge)+1; for (var q=0;q<3;q++){ b.px(Math.round(ex),Math.round(ey)-q,q===0?P.t1:(q===2?P.t4:P.t3)); } b.px(Math.round(ex),Math.round(ey)+1,P.s1); } }
  b.px(Math.round(mid),ridge-1,P.t4); b.px(Math.round(mid),ridge-2,P.t3);
  var dx=SDOOR[0], dy=SDOOR[1], dw=SDOOR[2], dh=SDOOR[3];
  b.rect(dx-3,dy-4,dw+6,4,P.s4); b.hl(dx-3,dx+dw+2,dy-4,P.s5); b.hl(dx-3,dx+dw+2,dy-1,P.s2);
  b.rect(dx-2,dy,2,dh,P.s3); b.rect(dx+dw,dy,2,dh,P.s2);
  for (y=dy;y<dy+dh;y++) for (x=dx;x<dx+dw;x++){ var bi=Math.floor((x-dx)/4), c2=hash(bi,9)<0.5?P.w2:P.w3; if ((x-dx)%4===0) c2=P.w0; var g=fbm(x*0.4,y*0.12); if (g>0.66) c2=P.g2; else if (g>0.6) c2=P.g1; if (hash(x,y*3)<0.06) c2=P.w1; if (y>dy+dh-3 && hash(x,y)<0.4) c2=P.w1; if (x===dx+dw-1) c2=P.w0; b.px(x,y,c2); }
  [dy+6,dy+dh-9].forEach(function(hy){ b.hl(dx,dx+dw-6,hy,P.m1); b.hl(dx,dx+dw-7,hy+1,P.k2); b.px(dx+1,hy,P.m2); b.px(dx+dw-6,hy,P.m2); });
  b.rect(dx+dw-5,dy+24,4,6,P.m1); b.px(dx+dw-5,dy+24,P.m3); b.rect(dx+dw-3,dy+28,4,5,P.y2); b.hl(dx+dw-3,dx+dw,dy+28,P.y4); b.px(dx+dw-1,dy+30,P.k1); b.vl(dx+dw-3,dy+26,dy+28,P.m3); b.vl(dx+dw,dy+26,dy+28,P.m3);
  b.hl(dx+1,dx+dw-2,dy+dh-1,P.k0);
  var wx=SWIN[0], wy=SWIN[1], ww=SWIN[2], wh=SWIN[3]; b.rect(wx-1,wy-1,ww+2,wh+2,P.s4); b.rect(wx,wy,ww,wh,P.k1); b.px(wx+1,wy+1,P.n1); b.px(wx+2,wy+1,P.a1);
  for (x=wx+2;x<wx+ww;x+=3) b.vl(x,wy,wy+wh-1,P.m1); b.rect(wx+ww+1,wy-1,4,wh+2,P.g2); b.vl(wx+ww+1,wy-1,wy+wh,P.g3); for (y=wy;y<wy+wh;y+=2) b.hl(wx+ww+2,wx+ww+4,y,P.g1); b.hl(wx-2,wx+ww+1,wy+wh+1,P.s5);
  // Bojen an Nägeln, Rettungsring, Tauwerk
  b.ellipse(173,72,3,3.5,P.t3); b.px(172,70,P.t5); b.px(173,71,P.t4); b.vl(173,66,68,P.e1); b.hl(170,176,72,P.t2); b.ellipse(177.5,77,2.5,3,P.s5); b.px(177,75,P.s6); b.vl(177,68,74,P.e1);
  b.ellipse(219.5,90,5,5,P.r3); b.ellipse(219.5,90,2.6,2.6,function(x,y){ return stones(x,y,Rs.slice(1),8,5); }); [[219,85],[224,90],[219,95],[214,90]].forEach(function(p){ b.rect(p[0]-1,p[1]-1,2,2,P.s6); }); b.px(217,87,P.r4);
  for (var a=0;a<16;a++){ var ang=a/16*Math.PI*2; b.px(rnd(171+Math.cos(ang)*3.4),rnd(93+Math.sin(ang)*2.6),a%2?P.e3:P.e4); } b.px(171,93,P.e1); b.vl(171,88,90,P.e2);
  b.rect(210,96,9,2,P.s5); b.rect(211,86,7,10,P.s5); b.hl(211,217,86,P.s6); b.vl(210,98,109,P.s4); b.vl(218,98,109,P.s3); b.vl(212,98,108,P.s4); b.vl(217,98,108,P.s3); b.vl(217,86,95,P.s4);
  [[168,109],[174,109]].forEach(function(p,i){ b.rect(p[0]-2,p[1]-4,5,4,i?P.m3:P.r3); b.hl(p[0]-2,p[0]+2,p[1]-4,P.m4); for (var k=0;k<7;k++) b.px(p[0]-2+Math.floor(hash(k,i)*5),p[1]-5-Math.floor(hash(i,k)*4),k%2?P.g4:P.g3); }); }

// ---------------------------------------------------------------- die Ledana
function paintLedana(b,tod){ var x0=LX0, top=18, base=QY+2, x, y;
  var Rp=R('e1 e2 e3 e4 s4'), Rb=R('t0 t1 t2 t3'), PIL=[[LX0,8],[460,6],[548,6],[592,6],[634,6]];
  // Dach mit kaputten Oberlichtern hinter der Attika, Schornstein
  for (y=6;y<top-3;y++) for (x=x0+4;x<W;x++){ var k=(y-6)/(top-9), c=ra(R('m0 m1 m2'),0.25+k*0.6,x,y); if ((x-x0)%26<3 && y<top-5) c=P.k1; b.px(x,y,c); }
  for (var sk=0;sk<8;sk++){ var sx=x0+12+sk*27; b.poly([[sx,top-4],[sx+8,7],[sx+16,top-4]],function(x,y){ return (hash(x>>1,y)<0.4)?P.k0:(((x+y)%4===0)?P.m2:P.k1); }); b.line(sx,top-4,sx+8,7,P.m2); b.line(sx+8,7,sx+16,top-4,P.m1); }
  for (y=0;y<top+2;y++) for (x=604;x<618;x++){ var cb=tex.bricks(x,y,R('t0 t1 t2 t3'),6,3); if (x===604) cb=P.t3; if (x>=616) cb=P.t0; b.px(x,y,cb); }
  b.rect(603,0,16,2,P.s1); b.hl(603,618,2,P.k2);
  // linke Seitenwand im Schatten
  for (y=top-2;y<base;y++) for (x=x0-8;x<x0;x++){ var kk=(x-(x0-8))/8, yt=top+4-Math.round(kk*4); if (y<yt) continue; b.px(x,y,M.DN[M.DN[tex.plaster(x,y,Rp.slice(1,4),0)]]); }
  // Fassade: verwaschener Ockerputz, große Stellen bis auf das Ziegelwerk abgeplatzt
  for (y=top;y<base;y++) for (x=x0;x<W;x++){ var f=fbm(x*0.05,y*0.07), c2;
      if (f<0.4){ c2=tex.bricks(x,y,Rb,7,3); if (f>0.385 && fbm(x*0.05,(y-1)*0.07)>=0.4) c2=P.t0; } else { c2=tex.plaster(x,y,Rp.slice(2,5),0); if (f<0.412) c2=(fbm(x*0.05,(y+1)*0.07)<0.4||fbm((x+1)*0.05,y*0.07)<0.4)?P.s5:Rp[3]; else if (f<0.43) c2=Rp[2]; }
      var stn=fbm(x*0.35,y*0.012); if (stn>0.64) c2=M.DN[c2];
      if (y>base-22 && bayer(x,y)<(y-(base-22))/30) c2=M.DN[c2];
      b.px(x,y,c2); }
  // Pilaster
  PIL.forEach(function(p){ for (y=top;y<base;y++) for (x=p[0];x<p[0]+p[1];x++){ var c=tex.plaster(x,y,R('s3 s4 s5'),0); if (x===p[0]+p[1]-1) c=P.e2; if (x===p[0]) c=P.s5; if (fbm(x*0.2,y*0.05)<0.3) c=M.DN[c]; b.px(x,y,c); } });
  // Attika, Gesimse
  b.rect(x0-2,top-4,W-x0+2,4,P.s3); b.hl(x0-2,W-1,top-4,P.s5); b.hl(x0-2,W-1,top-3,P.s4); b.hl(x0-2,W-1,top-1,P.s1);
  for (x=x0;x<W;x++) if (bayer(x,top)<0.7) b.px(x,top,M.DN[b.get(x,top)]);
  b.rect(x0,35,W-x0,3,P.s4); b.hl(x0,W-1,35,P.s5); b.hl(x0,W-1,37,P.s2); for (x=x0;x<W;x++) if (bayer(x,38)<0.6) b.px(x,38,M.DN[b.get(x,38)]);
  b.rect(x0,74,W-x0,2,P.s4); b.hl(x0,W-1,75,P.s2);
  // Feige aus dem Gesims, Gras auf der Attika
  b.ellipse(x0+10,top-6,6,3.5,function(x,y){ return tex.foliage(x,y,R('g1 g2 g3 g4')); }); b.line(x0+10,top-3,x0+11,top,P.w1);
  for (x=x0+30;x<W;x+=7){ if (hash(x,2)<0.5) b.px(x,top-5,P.g3); }
  // Schriftzug LEDANA (aufgemalt, verblasst) und Baujahr
  var tmp=new M.Buf(80,20,T); M.big(tmp,'LEDANA',40,3,P.r2,2,false); var lx=506-40;
  // Schilderfläche (hellerer Putz), darauf LEDA; vom NA sind nur hellere Abdrücke und Dübellöcher geblieben
  for (y=18;y<34;y++) for (x=lx-4;x<lx+84;x++){ var cc0=tex.plaster(x,y,R('e3 e4 s4'),0); if (y===18||y===33) cc0=P.e2; b.px(x,y,cc0); }
  for (y=0;y<tmp.h;y++) for (x=0;x<tmp.w;x++){ if (tmp.get(x,y)===T) continue; var X=lx+x, Y=19+y; if (x>=52){ b.px(X,Y,(hash(X,Y)<0.6)?P.s5:P.e4); if (hash(X,Y*2)<0.05) b.px(X,Y,P.k2); continue; } var ff=fbm(X*0.25,Y*0.3); if (ff<0.2) continue; b.px(X,Y,ff<0.32?P.t3:(ff>0.66?P.r1:P.r2)); }
  M.microText(b,'1928',600,27,P.r1);
  // Hohe Rundbogenfenster mit Stahlsprossen
  [[468,40],[504,40],[556,40],[600,40]].forEach(function(wd,i){ archWin(b,wd[0],wd[1],30,32,i,tod); });
  archWin(b,426,40,30,32,9,tod);
  // Erdgeschoss: Rolltor hinter dem Kettentor, Fenster, vernagelte Tür hinter dem Zaunloch
  var rx=484, ry=80, rw=44; b.rect(rx-3,ry-4,rw+6,4,P.s2); b.hl(rx-3,rx+rw+2,ry-4,P.s4);
  for (y=ry;y<base;y++) for (x=rx;x<rx+rw;x++){ var cr=tex.rust(x,y*2.2,R('t0 t1 t2 m1 m2')); if ((y-ry)%3===0) cr=P.k2; else if ((y-ry)%3===1) cr=M.UP[cr]; b.px(x,y,cr); }
  b.vl(rx-1,ry,base-1,P.k2); b.vl(rx+rw,ry,base-1,P.s2);
  graffiti(b,426,82);
  [[602,82,24,16]].forEach(function(wd){ b.rect(wd[0]-1,wd[1]-1,wd[2]+2,wd[3]+2,P.s1); b.rect(wd[0],wd[1],wd[2],wd[3],P.k1); for (var xx=wd[0]+2;xx<wd[0]+wd[2];xx+=4) b.vl(xx,wd[1],wd[1]+wd[3]-1,P.m1); b.hl(wd[0],wd[0]+wd[2]-1,wd[1]+Math.floor(wd[3]/2),P.m1); b.hl(wd[0]-1,wd[0]+wd[2],wd[1]+wd[3]+1,P.s4); });
  var gx=554, gy=80; b.rect(gx-3,gy-3,28,base-gy+3,P.s2); b.hl(gx-3,gx+24,gy-3,P.s4); b.rect(gx,gy,22,base-gy,P.k0);
  for (var bi=0;bi<5;bi++){ if (bi===3||bi===4) continue; var by0=gy+2+bi*6; for (y=by0;y<by0+4;y++) for (x=gx-2;x<gx+24;x++){ var yy2=y+Math.round((x-gx)*0.05*(bi%2?1:-1)); b.px(x,yy2,y===by0?P.w4:(y===by0+3?P.w1:P.w2)); } b.px(gx,by0+1,P.m3); b.px(gx+21,by0+2,P.m3); }
  b.line(gx+2,gy+22,gx+9,gy+29,P.w2); b.line(gx+3,gy+22,gx+10,gy+29,P.w1);
  for (y=gy+20;y<base;y++) for (x=gx;x<gx+22;x++) if (hash(x,y)<0.08) b.px(x,y,P.k2); }
function archWin(b,x,y,w,h,i,tod){ b.rect(x-2,y-2,w+4,h+4,P.s2); b.hl(x-3,x+w+2,y+h+1,P.s5); b.hl(x-3,x+w+2,y+h+2,P.s2);
  var cx=x+w/2-0.5, rad=w/2, xx, yy;
  for (yy=y-2;yy<y+h;yy++) for (xx=x-2;xx<x+w+2;xx++){ var inArch=yy>=y+rad || Math.hypot(xx-cx,(y+rad)-yy)<=rad; var inFr=yy>=y+rad-2 || Math.hypot(xx-cx,(y+rad)-yy)<=rad+2;
    if (!inFr){ continue; } if (!inArch || xx<x || xx>=x+w){ b.px(xx,yy,P.s2); continue; }
    var pc=Math.floor((xx-x)/5), pr=Math.floor((yy-y)/6), fu=(xx-x)%5, fv=(yy-y)%6, c, hb=hash(pc+i*7,pr*3+1), broken=hb<0.5;
    if (fu===0||fv===0) c=(fu===0&&fv===0)?P.m2:P.m0;
    else if (broken){ c=P.k0; if (hb<0.12 && fv===1) c=P.a2; if (hb>0.38 && fu===1 && fv<3) c=P.a1; }
    else { c=pr<2?P.a2:P.a1; if (tod==='day' && (fu+fv)<3) c=P.b3; if (fv===1&&fu>1) c=M.UP[c]; if (hash(xx,yy)<0.12) c=P.m1; }
    b.px(xx,yy,c); }
  b.px(Math.round(cx),y-3,P.s4); b.px(Math.round(cx)-1,y-2,P.s4); b.px(Math.round(cx)+1,y-2,P.s4);
  for (yy=y+h+3;yy<y+h+20;yy++) for (xx=x+1;xx<x+w-1;xx++){ if (hash(xx,3)<0.22 && bayer(xx,yy)<0.7-(yy-y-h)/24) b.px(xx,yy,P.t1); } }
function graffiti(b,x,y){ // TORCIDA in Weiß mit rotem Rand, darunter Tags
  var tmp=new M.Buf(60,12,T); M.text(tmp,'TORCIDA',1,1,P.s6); M.outline(tmp,P.r2);
  for (var yy=0;yy<tmp.h;yy++) for (var xx=0;xx<tmp.w;xx++){ var c=tmp.get(xx,yy); if (c===T) continue; var X=x+xx, Y=y+yy+Math.round(Math.sin(xx*0.15)*1.2); b.px(X,Y,c); if (c===P.s6 && hash(X,Y)<0.15 && Y+1<y+14) b.px(X,Y+1,P.s5); }
  M.microText(b,'HNK',x+2,y+14,P.b2); b.line(x+18,y+16,x+28,y+13,P.g4); b.line(x+28,y+13,x+32,y+17,P.g4); M.microText(b,'2003',x+34,y+14,P.y3); b.line(x+2,y+22,x+12,y+20,P.v3); }

// ---------------------------------------------------------------- Bauzaun mit Kettentor, Schild, Kistenstapel
function paintFence(b,bw,S){ var top=FENCE.top, base=FENCE.base, x, y, k, j;
  var panels=[[424,476],[476,506],[506,536],[536,588],[588,640]];
  // grünes Netzbanner, zerrissen, am letzten Feld
  for (y=top+4;y<base-6;y++) for (x=590;x<640;x++){ var tear=fbm(x*0.15,y*0.2); if (tear<0.3||(y>base-18&&tear<0.48)||(x>628&&tear<0.55)) continue; var c=((x+y)%3===0)?P.g1:P.g2; if (bayer(x,y)<0.2) c=P.g3; b.px(x,y,c); }
  M.microText(b,'SPLIT-GRADNJA',592,78,P.s4);
  panels.forEach(function(p,pi){ var px0=p[0], px1=p[1];
    for (y=top+2;y<base-4;y++) for (x=px0+2;x<px1-1;x++){ var onV=(x-px0)%5===0, onH=(y-top)%7===0; if (!(onV||onH)) continue;
      if (pi===3 && S.cratesMoved && x>GAP[0]&&x<GAP[0]+GAP[2]&&y>GAP[1]) continue;
      var c=(onV&&onH)?P.m4:(bayer(x,y)<0.6?P.m3:T); if (c!==T) b.px(x,y,c); }
    b.rect(px0,top,2,base-top-4,P.m3); b.vl(px0,top,base-5,P.m4); b.rect(px1-2,top,2,base-top-4,P.m2); b.hl(px0,px1-1,top,P.m4); b.hl(px0,px1-1,top+1,P.m2); b.hl(px0,px1-1,base-5,P.m3);
    b.rect(px0-5,base-5,11,5,P.s3); b.hl(px0-5,px0+5,base-5,P.s4); b.vl(px0+5,base-5,base-1,P.s1); b.rect(px0-2,base-7,4,2,P.m2); b.px(px0-1,base-7,P.m3); });
  b.rect(634,base-5,6,5,P.s3);
  if (S.cratesMoved){ for (k=0;k<12;k++){ var ex=GAP[0]+1+Math.floor(hash(k,5)*(GAP[2]-2)), ey=GAP[1]+Math.floor(hash(k,6)*3); b.line(ex,ey,ex+((k%2)?2:-2),ey-2,P.m3); }
    for (k=0;k<6;k++){ var sx=GAP[0]+(k%2?GAP[2]:0), sy=GAP[1]+5+Math.floor(k/2)*7; b.line(sx,sy,sx+(k%2?3:-3),sy-1,P.m3); } }
  // Kette und Schloss am Tor
  for (var i=0;i<9;i++){ b.px(505+(i%2),94+i,P.m4); b.px(506-(i%2),94+i,P.m2); } b.rect(504,103,5,5,P.y2); b.hl(504,508,103,P.y4); b.px(506,105,P.k1); b.vl(505,101,102,P.m3); b.vl(507,101,102,P.m3);
  // Schild ZABRANJEN PRISTUP – RUŠENJE 21.11.
  var sx0=478, sy0=70; b.rect(sx0,sy0,57,23,P.s6); b.hl(sx0,sx0+56,sy0,P.r3); b.hl(sx0,sx0+56,sy0+22,P.r3); b.vl(sx0,sy0,sy0+22,P.r3); b.vl(sx0+56,sy0,sy0+22,P.r3); b.hl(sx0+1,sx0+57,sy0+23,P.k2); b.vl(sx0+57,sy0+1,sy0+23,P.k2);
  M.microText(b,'ZABRANJEN',sx0+11,sy0+3,P.r2); M.microText(b,'PRISTUP',sx0+15,sy0+9,P.r2); b.hl(sx0+4,sx0+52,sy0+15,P.s4); M.microText(b,'RUŠENJE 21.11.',sx0+1,sy0+16,P.k2);
  b.px(sx0+2,sy0+2,P.m2); b.px(sx0+54,sy0+2,P.m2); for (x=sx0+3;x<sx0+54;x++) if (hash(x,7)<0.06) b.px(x,sy0+21,P.t2);
  // Baustellenleuchte oben am Tor
  b.rect(503,top-5,5,5,P.y1); b.hl(503,507,top-5,P.y2); b.rect(504,top-1,3,2,P.k1);
  // Kistenstapel vor dem losen Feld
  if (!S.cratesMoved){ for (j=0;j<5;j++){ fishbox(bw,550+(j%2),base-6-j*6,16,6,j===3?R('r0 r1 r2 r3'):R('b0 b1 b2 b3')); fishbox(bw,567-(j%2),base-6-j*6,15,6,j===1?R('s2 s3 s4 s5'):R('b0 b1 b2 b3')); } fishbox(bw,558,base-36,15,6); }
  else { for (j=0;j<2;j++){ fishbox(bw,514+(j%2),base-6-j*6,16,6,j===1?R('r0 r1 r2 r3'):R('b0 b1 b2 b3')); fishbox(bw,531,base-6-j*6,15,6,j===0?R('s2 s3 s4 s5'):R('b0 b1 b2 b3')); }
    var Rq=R('b0 b1 b2 b3'); b.rect(547,base-13,6,13,Rq[2]); b.vl(547,base-13,base-1,Rq[3]); b.vl(552,base-13,base-1,Rq[0]); b.hl(547,552,base-13,Rq[3]); for (y=base-11;y<base-1;y+=3) b.hl(548,551,y,Rq[1]);
    for (x=528;x<562;x++) if (bayer(x,113)<0.5) b.px(x,113,M.DN[b.get(x,113)]); }
  // Fahrrad am Zaun
  var fx=448; b.ellipse(fx,103,5,5,function(x,y){ var d=Math.hypot(x+0.5-fx,y+0.5-103); return d>3.6?P.k1:T; }); b.ellipse(fx+15,103,5,5,function(x,y){ var d=Math.hypot(x+0.5-fx-15,y+0.5-103); return d>3.6?P.k1:T; });
  b.line(fx,103,fx+6,96,P.r2); b.line(fx+6,96,fx+13,96,P.r2); b.line(fx+13,96,fx+15,103,P.r2); b.line(fx+6,96,fx+8,103,P.r2); b.line(fx+8,103,fx,103,P.r2); b.hl(fx+4,fx+7,94,P.k2); b.line(fx+13,96,fx+12,92,P.m2); b.hl(fx+10,fx+13,92,P.k2);
  // Bauschuttcontainer, Paletten, Dose, Reifen
  var kx=604, ky=110; for (y=ky-16;y<ky;y++) for (x=kx;x<kx+34;x++){ var ins=Math.round((ky-y)*0.25), c3; if (x<kx+ins||x>kx+34-1-ins) continue; c3=((x-kx)%6===0)?P.g1:P.g2; if (y===ky-16) c3=P.g4; if (y===ky-15) c3=P.g3; if (hash(x>>1,y>>1)<0.12) c3=P.t1; if (y>ky-3) c3=P.g1; b.px(x,y,c3); }
  for (x=kx+3;x<kx+31;x++){ var hh=Math.round(2+Math.sin(x*0.7)*1.5+hash(x,1)*2); for (y=ky-16-hh;y<ky-16;y++) b.px(x,y,hash(x,y)<0.5?P.s2:(hash(x,y)<0.7?P.t2:P.w2)); }
  b.line(kx+8,ky-22,kx+14,ky-17,P.w3); b.line(kx+20,ky-21,kx+18,ky-16,P.m2); M.microText(b,'ČISTOĆA',kx+4,ky-11,P.s4);
  for (k=0;k<3;k++){ var px1=440+k*2, py1=110-k*3; b.rect(px1,py1-2,22,2,P.w3); b.hl(px1,px1+21,py1-2,P.w4); for (x=px1+2;x<px1+22;x+=7) b.rect(x,py1,3,2,P.w1); }
  b.ellipse(530,111,3,1.2,P.k1); b.px(529,110,P.m2); b.rect(470,112,3,2,P.r3); b.px(471,111,P.m4);
  // Unkraut am Zaunfuß
  for (x=424;x<640;x+=3){ if (hash(x,4)<0.45){ var hgt=2+Math.floor(hash(x,5)*4); b.vl(x,base-hgt,base-1,hash(x,6)<0.5?P.g3:P.g2); if (hgt>3) b.px(x+1,base-hgt+1,P.g4); } } }

// ---------------------------------------------------------------- dynamisch: Wasser, schaukelnde Boote, Spiegelungen
function buildDyn(out,S1T,S2T,boatBufs,tod){ var y0=34, y1=QY;
  var fg=new Uint8Array(W*H), owner=new Int8Array(W*H).fill(-1);
  boatBufs.forEach(function(bb,i){ for (var j=0;j<bb.h;j++) for (var k=0;k<bb.w;k++){ if (bb.d[j*bb.w+k]===T) continue; var X=bb.ox+k, Y=bb.oy+j; if (X<0||X>=W||Y<0||Y>=H) continue; owner[Y*W+X]=i; } });
  var spr=boatBufs.map(function(bb){ var s=new M.Buf(bb.w,bb.h,T); s.ox=bb.ox; s.oy=bb.oy; return s; });
  for (var Y=y0;Y<y1;Y++) for (var X=0;X<BX1;X++){ var o=Y*W+X; if (out.d[o]!==S2T.d[o]) fg[o]=1; var ow=owner[o]; if (ow>=0){ var s=spr[ow]; s.d[(Y-s.oy)*s.w+(X-s.ox)]=S2T.d[o]; } }
  DYN={fg:fg,spr:spr,bg:S1T,tod:tod,y0:y0,y1:y1,boats:BOATS}; }
function dyn(fb,v,S,GS){ if (!DYN) return; var cam=v.cam, t=v.t, tod=v.tod, calm=M.scn.weather(GS)!=='bura', D=DYN, n=D.spr.length;
  var xa=Math.max(0,cam), xb=Math.min(BX1,cam+320);
  if (xb>xa){
    var bob=[], i, k; for (i=0;i<n;i++){ var o=D.boats[i], amp=o.wl>100?(calm?0.6:1.15):(o.wl>90?(calm?0.55:0.9):0.45); bob[i]=Math.round(Math.sin(t*(calm?0.9:1.7)+i*1.7)*amp); }
    var rlen=calm?24:9, GL=[];
    if (tod!=='day'){ FARLAMPS.forEach(function(lx){ GL.push([lx,FQ+1,QY-3,4,P.y3,lx]); GL.push([lx,FQ+1,FQ+7,1,P.y5,lx*2]); }); if (tod==='night') GL.push([MOON[0],FQ+1,QY-1,7,P.n4,0]); else GL.push([60,FQ+1,QY-1,16,P.d6,0]); }
    else GL.push([200,FQ+3,QY-3,30,P.a6,0]);
    for (var Y=D.y0;Y<D.y1;Y++) for (var X=xa;X<xb;X++){ var o2=Y*W+X; if (D.fg[o2]) continue; var c=-1;
      for (k=n-1;k>=0;k--){ var s=D.spr[k], sx=X-s.ox, sy=Y-bob[k]-s.oy; if (sx<0||sy<0||sx>=s.w||sy>=s.h) continue; var cc=s.d[sy*s.w+sx]; if (cc!==T){ c=cc; break; } }
      if (c<0){ if (isWater(X,Y)){ c=wcol(X,Y,t,tod,calm); var refl=false;
          for (k=n-1;k>=0;k--){ var s2=D.spr[k], bo=D.boats[k], dd=Y-bo.wl; if (dd<1||dd>(bo.wl>100?9:(bo.wl>90?6:3))) continue; var wob=Math.round(Math.sin(Y*0.9+t*2.2+k)*(calm?0.7:1.4)), sx2=X+wob-s2.ox, sy2=bo.wl-dd-bob[k]-s2.oy; if (sx2<0||sy2<0||sx2>=s2.w||sy2>=s2.h) continue; var rc=s2.d[sy2*s2.w+sx2];
            if (rc!==T && bayer(X,Y)<0.82-dd*0.08){ c=M.DN[rc]; refl=true; break; } }
          if (!refl && tod==='day'){ var oi=Math.floor(X/92), oxx=X-oi*92-30, oyy=Y-(84+(oi%3)*7)-Math.round(Math.sin(X*0.25+t*0.4+oi)*1.2); if (oxx>=0&&oxx<26&&oyy===0&&((oxx+oi)%5)<2){ c=(oxx%7<3)?P.v3:P.a5; refl=true; } }
          if (!refl) for (var gi=0;gi<GL.length;gi++){ var g=GL[gi]; if (Y<g[1]||Y>=g[2]) continue; var half=2+g[3]*(Y-g[1])/(g[2]-g[1]+1); if (Math.abs(X-g[0])>half) continue; if (Math.sin(X*0.7+Y*1.9+t*3+g[5])+Math.sin(X*0.23-t*2+Y+g[5])>1.25){ c=g[4]; refl=true; break; } }
          var dq=Y-FQ; if (!refl && dq<rlen && bayer(X,Y+1)<(calm?0.6:0.5)-dq*(calm?0.022:0.06)){ var wob2=Math.round(Math.sin(Y*1.3+t*1.7+X*0.05)*(calm?1:2.2)), sy3=FQ-1-dq; if (sy3>=0){ var mc=D.bg.d[sy3*W+cl(X+wob2,0,W-1)]; c=M.DN[mc]; } } }
        else c=D.bg.d[o2]; }
      fb.d[Y*fb.w+(X-cam)]=c; }
    D.boats.forEach(function(o,i){ if (!o._mt) return; var fx=o._mt[0]-cam, fy=o._mt[1]+bob[i]; if (fx<0||fx>=316) return; var ph=Math.floor(t*(calm?2:10)+i*3)%3, col=tod==='day'?P.r3:M.tintPx(M.TINT[tod]||M.TINT.night,P.r3,fx,fy);
      fb.px(fx,fy,col); fb.px(fx+1,fy+(calm?1:(ph===1?1:0)),col); if (!calm) fb.px(fx+2,fy+(ph===2?1:(ph===0?-1:0)),M.DN[col]); else fb.px(fx,fy+1,col); });
  }
  if (tod==='day'){ M.scn.gulls(fb,t,0,6,W,30,4,cam);
    var gx=LAMP.x-cam, gy=LAMP.base-LAMP.h-12; if (gx>3&&gx<316){ var hb=Math.sin(t*0.9)>0.6?1:0; fb.px(gx-2,gy,P.s6); fb.px(gx-1,gy,P.s6); fb.px(gx,gy,P.s5); fb.px(gx+1,gy,P.m3); fb.px(gx-1,gy-1,P.s6); fb.px(gx-3+hb,gy-2,P.s6); fb.px(gx-4+hb,gy-2,P.y3); fb.px(gx,gy+1,P.y3); fb.px(gx-1,gy+1,P.y3); } }
  else if (tod==='dusk') gullsCol(fb,t,120,10,W-120,22,3,cam,P.d5,P.d4);
  var on=Math.floor(v.gt/650)%2===0; if (on && tod!=='day'){ var lx2=505-cam; if (lx2>2&&lx2<316){ fb.px(lx2,FENCE.top-4,P.y5); fb.px(lx2+1,FENCE.top-4,P.y4); fb.px(lx2,FENCE.top-3,P.y4); fb.px(lx2+1,FENCE.top-3,P.y3); fb.px(lx2-1,FENCE.top-3,P.y2); fb.px(lx2+2,FENCE.top-4,P.y2); fb.px(lx2,FENCE.top-5,P.y3); } }
  var fl=64-cam; if (fl>=0&&fl<312){ var FC=[P.r3,P.s6,P.b1]; for (var fy2=0;fy2<3;fy2++) for (var fx2=1;fx2<7;fx2++){ var wv=Math.round(Math.sin(fx2*0.9-t*(calm?2:8))*(fx2/6)*(calm?0.4:1)), cc2=FC[fy2]; fb.px(fl+fx2,3+fy2+wv,tod==='day'?cc2:M.tintPx(M.TINT[tod]||M.TINT.night,cc2,fl+fx2,3+fy2)); } } }
// Möwen im letzten Abendlicht (rosa angeleuchtet) vor dem dunklen Himmel
function gullsCol(fb,t,x0,y0,w,h,n,cam,c1,c2){ for (var i=0;i<n;i++){ var x=Math.floor(x0+((hash(i,21)*w+t*(6+hash(i,22)*8))%w))-cam, y=Math.floor(y0+hash(i,23)*h+Math.sin(t*1.1+i)*3), f=Math.floor(t*3+i)%2;
  if (x<2||x>=fb.w-2) continue; fb.px(x,y,c1); fb.px(x-1,y-(f?1:0),c1); fb.px(x+1,y-(f?1:0),c1); fb.px(x-2,y-(f?0:1),c2); fb.px(x+2,y-(f?0:1),c2); } }
function front(fb,v,S,GS){ if (M.scn.weather(GS)==='bura') M.scn.buraDebris(fb,v.t,112,140,v.cam); }
function ghost(fb,v,S,GS){ // aus den Ritzen der Schuppentür sickert ein kalter Schimmer
  var t=v.t, cam=v.cam; for (var y=SDOOR[1]+2;y<SDOOR[1]+SDOOR[3];y++){ var x=SDOOR[0]+SDOOR[2]-1-cam; if (x<0||x>=320) continue; if (Math.sin(y*0.4+t*2)>0.1) fb.px(x,y,P.x4); }
  for (var x2=SDOOR[0]+1;x2<SDOOR[0]+SDOOR[2]-1;x2++){ var sx=x2-cam; if (sx<0||sx>=320) continue; if (Math.sin(x2*0.7-t*1.6)>-0.3) fb.px(sx,SDOOR[1]+SDOOR[3]-1,P.x5); } }

// ---------------------------------------------------------------- Ebenen: Dinkos Kiste, Vordergrund-Poller
function layers(S,GS,tod){ var L=[];
  var c=M.layer(236,110,22,16,124), w=M.lw(c); crateSeat(w,238,112,16,12); w.hl(238,253,123,P.w0);
  if (tod!=='day') M.tintApply(c,M.TINT[tod]); L.push(c);
  var f=M.layer(80,128,30,16,143), fw=M.lw(f); bollard(fw,92,142); for (var a=0;a<22;a++){ var ang=a/22*Math.PI*2; fw.px(rnd(92+Math.cos(ang)*7),rnd(141+Math.sin(ang)*1.6),a%3?P.e3:P.e2); } fw.line(92,132,104,141,P.e3); fw.line(93,132,105,141,P.e2);
  if (tod!=='day') M.tintApply(f,M.TINT[tod]); L.push(f);
  return L; }

// ---------------------------------------------------------------- Laufflächen
function walk(x,y,S,GS){ if (y<110||y>=139||x<6||x>=600) return false;
  if (x>=234&&x<258&&y<126) return false;                 // Dinkos Kiste
  if (x>=104&&x<138&&y<128) return false;                 // Netzhaufen
  if (x>=84&&x<100&&y>=132) return false;                 // Poller vorn
  if (x>=36&&x<84&&y<117) return false;                   // Fischkisten
  return true; }

var spots={
  exit:[0,92,12,48], boats:[20,40,140,68], nets:[78,108,80,20], fishboxes:[36,90,48,27], shed:[156,34,74,60], shed_door:[SDOOR[0]-2,SDOOR[1]-2,SDOOR[2]+4,SDOOR[3]+2],
  lamp:[LAMP.x-5,LAMP.base-LAMP.h-12,11,LAMP.h+12], marjan:[0,2,200,40], sea:[0,78,398,30], ledana:[LX0-8,0,224,74], fence:[424,62,216,48],
  sign:[478,70,58,24], crates:function(S){ return (S&&S.cratesMoved)?[512,96,42,14]:[548,74,36,36]; }, gap:[GAP[0],GAP[1],GAP[2],GAP[3]]
};
var stands={
  exit:[10,124,'L'], boats:[90,114,'B'], nets:[100,132,'B'], fishboxes:[60,120,'B'], shed:[196,118,'B'], shed_door:[196,113,'B'], lamp:[LAMP.x+10,118,'B'],
  marjan:[60,120,'B'], sea:[170,114,'B'], ledana:[520,118,'B'], fence:[456,116,'B'], sign:[506,116,'B'], crates:function(S){ return (S&&S.cratesMoved)?[532,116,'B']:[566,116,'B']; }, gap:[567,113,'B']
};
// Figuren im Laternenlicht warm färben (Dämmerung, Nacht)
var LAMPN=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.5+L*0.32+16, g*0.4+L*0.24+6, b*0.22+L*0.1+4]; });
function actorLut(a,S,GS,tod){ if (tod==='day'||!M.TINT[tod]) return undefined; var dx=(a.x-(LAMP.x-10))/46, dy=(a.y-(LAMP.base+13))/16; return (dx*dx+dy*dy<1)?LAMPN.a:M.TINT[tod].a; }
M.defineArt('matejuska',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost, spots:spots, stands:stands, actorLut:actorLut,
  actorPos:{ dinko:[DINKO[0],DINKO[1],'L','dinko',0,'mend'] },
  start:[40,124,'R'], entries:{ map:[14,124,'R'], shed:[196,114,'F'], ledana:[567,114,'F'] }
});
})(M);
