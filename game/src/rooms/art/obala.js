/* ===== rooms/art/obala.js — Ufer der Miljacka (640 px, scrollend).
   Vorn die Uferstraße mit den Gleisen der Straßenbahn, Oberleitung, kahle Platanen und Laternen. Links hinter der Brüstung liegt
   tief unten die Miljacka: flach, steinig, grünbraun, zwischen hohen Ufermauern; über sie führt die osmanische Lateinerbrücke
   in die Tiefe (Buckel, drei Bögen, die runden „Augen“ über den Pfeilern); ihr Brückenkopf ist begehbar. Drüben das Südufer,
   ein Minarett im Regen, dahinter der Trebević. In der Mitte das Haus Obala 14 mit den schmiedeeisernen Balkonen (der im
   zweiten Stock gehörte dem Professor), davor Milkas Bank. Rechts die Vijećnica: ocker-rote Streifen, Spitzbögen, Zinnen,
   fast ganz hinter Gerüst und grüner Plane, davor der Bauzaun mit Schild und Tor (S.gateOpen) und der Container der Nachtwache.
   Malas Sicht: über dem Fluss fällt schwarzer Schnee (verbrannte Seiten); ein Faden aus Licht vom Balkon zur Vijećnica. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=640, H=144, GY=104, PY=106;                        // Fußlinie der Häuser, Hinterkante der Straße an der Brüstung
var RX1=246;                                            // bis hier reicht der Blick auf den Fluss (dann Haus 14)
// ---------------------------------------------------------------- Blick auf den Fluss: eine kleine Perspektive (Kamera erhöht)
var VPX=320, HZ=24, FF=102.5, HC=8, HW=3.4, ZP=10, ZF=23.6; // Fluchtpunkt, Brennweite, Augenhöhe, Wasser unter der Straße, nahe/ferne Ufermauer
var BXL=-26.6, BXR=-21.8, HUMP=3.2;                     // Lateinerbrücke: linke/rechte Kante (Meter), Buckel
var ARCH=[[10.6,13.8,0.95],[14.6,18.7,1.05],[19.5,23.0,0.95]]; // Bögen: von, bis (Tiefe), Stich
var OCUL=[14.2,19.1];                                   // runde Öffnungen über den Pfeilern
function sx(X,Z){ return VPX+FF*X/Z; }
function sy(Y,Z){ return HZ+FF*(HC-Y)/Z; }
function hump(Z){ var t=(Z-ZP)/(ZF-ZP); return t<=0||t>=1?0:HUMP*Math.pow(Math.sin(Math.PI*t),0.8); }
// ---------------------------------------------------------------- Haus 14, Bank, Vijećnica, Zaun, Container
var H14={x0:248,x1:420,top:16};
var BALC=[{x:262,y:69,w:30},{x:318,y:52,w:36,hi:true},{x:374,y:69,w:30},{x:374,y:35,w:30}];   // Balkone; hi = der des Professors (2. Stock)
var DOOR14=[322,76,20,28];
var BENCH={x0:286,x1:318,by:110};
var VIJ={x0:428,x1:640,top:10};
var FENCE={x0:430,x1:640,top:80,by:110};
var GATE={x0:516,x1:552};
var SIGNB={x0:446,y0:84,w:62,h:19};
var CONT={x0:580,x1:634,top:84,by:110};
var LAMPS=[110,232,410];                                // Laternen (Mast); Fuß y=106
var TREES=[{x:14,h:98,s:3},{x:274,h:100,s:7},{x:437,h:96,s:11}];
var RAILS=[121,125,131,136];
var WET=false, FOG=false, NIGHT=false, TOD='day', WEA='rain';
// CODE: 0 vorn, 1 Himmel, 2 Hügel/Ferne, 3 Wasser, 4 Fassaden, 5 Straße
var CODE=new Uint8Array(W*H), GLW=new Uint16Array(W*H), WINS=[];
function track(b){ b.code=0; b.gw=0;
  b.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; this.d[k]=c; CODE[k]=this.code; GLW[k]=this.gw; };
  b.rect=function(x,y,w,h,c){ for (var j=Math.max(0,y|0);j<Math.min(H,(y|0)+h);j++) for (var i=Math.max(0,x|0);i<Math.min(W,(x|0)+w);i++){ var k=j*W+i; this.d[k]=c; CODE[k]=this.code; GLW[k]=this.gw; } };
  return b; }
function glass(b,x,y,w,h,kind,fn,lit){ WINS.push({x:x,y:y,w:w,h:h,k:kind,lit:lit}); b.gw=WINS.length; for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=fn(xx,yy); if (c!==undefined) b.px(xx,yy,c); } b.gw=0; }
function rnd(v){ return Math.round(v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function shade(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lift(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'};
function signText(b,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž'){ b.px(cx,y-2,c); b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); }
    else if (ch==='Ć'){ b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); }
    else if (ch==='Đ'){ b.px(cx-1,y+2,c); b.px(cx+1,y+2,c); }
    cx+=w+1; }); return cx; }
function signWidth(s){ var w=0; s.toUpperCase().split('').forEach(function(ch){ w+=M.microWidth(DIA[ch]||ch)+1; }); return Math.max(0,w-1); }
function soot(b,x0,x1,y0,depth,amt,sd){ for (var x=x0;x<x1;x++){ var d=depth*(0.3+0.9*fbm(x*1.3,y0,6,sd)); for (var y=y0;y<y0+d;y++) if (bayer(x,y)<amt*(1-(y-y0)/d)) shade(b,x,y,1); } }
function streaks(b,x0,x1,y0,y1,sd,amt){ for (var x=x0;x<x1;x++){ var s=fbm(x*2.1,sd,5,sd); if (s<0.58) continue; var L=(s-0.58)*(y1-y0)*2.4; for (var y=y0;y<Math.min(y1,y0+L);y++) if (bayer(x,y)<amt*(1-(y-y0)/L)) shade(b,x,y,1); } }
function scars(b,cx,cy,rx,ry,n,sd){ var r=M.rng(sd); for (var i=0;i<n;i++){ var a=r()*6.283, d=Math.pow(r(),0.7), x=rnd(cx+Math.cos(a)*rx*d), y=rnd(cy+Math.sin(a)*ry*d);
    shade(b,x,y,2); if (r()<0.5) shade(b,x+1,y,1); lift(b,x,y-1,1); } }

// ---------------------------------------------------------------- Himmel und Trebević
function sky(b,tod,wea){ b.code=1; if (wea==='calm'||wea==='bura') M.sky(b,0,0,W,70,tod,31); else M.scn.sky(b,0,0,W,70,tod,wea,31); b.code=0; }
function hills(b){ b.code=2; var x, y, rp=R('k2 m0 n0 m1 n1 m2');
  for (x=0;x<W;x++){ var t=x/W, ridge=26-Math.sin(t*Math.PI*0.9+0.25)*14+Math.sin(x*0.031)*2.2+Math.sin(x*0.09+1)*0.9;   // der lange Rücken des Trebević
    for (y=Math.round(ridge);y<60;y++){ var v=0.55-(y-ridge)/60+(fbm(x*0.3,y*0.5,6,3)-0.5)*0.35; if (y===Math.round(ridge)) v+=0.2; b.px(x,y,ra(rp,v,x,y)); } }
  // Waldkante und Lichtungen am Hang
  for (x=0;x<W;x+=2){ var r2=hash(x,3); if (r2<0.5) continue; var yy=Math.round(30-Math.sin(x/W*Math.PI*0.9+0.25)*14+8+hash(x,4)*16); b.px(x,yy,P.k2); b.px(x+1,yy-1,P.k2); }
  b.code=0; }
// Südufer: Häuser, Bäume, ein Minarett (alles klein, im Regen verwaschen)
function farBank(b){ b.code=2; var r=M.rng(77), x=0, y;
  while (x<RX1){ var w=10+Math.floor(r()*16), hgt=14+Math.floor(r()*20), top=50-hgt, col=[R('s2 s3 s4'),R('e2 e3 s3'),R('t2 t3 s3'),R('m2 m3 s4')][Math.floor(r()*4)];
    for (y=top;y<51;y++) for (var xx=x;xx<Math.min(RX1,x+w);xx++){ var c=(xx===x)?col[2]:((xx===x+w-1)?col[0]:col[1]); b.px(xx,y,c); }
    for (var k=0;k<3;k++){ var ry=top-1-k; for (var xx2=x-1+k;xx2<Math.min(RX1,x+w+1-k);xx2++) b.px(xx2,ry,k===2?P.t3:((xx2+k)%3?P.t2:P.t1)); }
    for (var wy=top+3;wy<48;wy+=5) for (var wx=x+2;wx<x+w-2;wx+=4){ glass(b,wx,wy,2,3,'far',function(){ return P.k2; },false); }
    x+=w+(r()<0.3?2:0); }
  M.scn.minaret(b,92,48,58,{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')});
  // kleine Kuppel der Moschee daneben
  b.ellipse(104,44,7,5,function(xx,yy){ return yy<41?P.m3:P.m2; }); b.rect(97,44,15,6,P.s3);
  // kahle Bäume am Südkai
  for (var i=0;i<9;i++){ var tx=8+i*27+Math.floor(hash(i,8)*10), th=12+Math.floor(hash(i,9)*6); b.vl(tx,54-th,54,P.m1); for (var j=0;j<6;j++){ var a=-Math.PI/2+(hash(i,j)-0.5)*1.6, L=4+hash(j,i)*6, bx=tx, by=54-th*0.55-j*1.5; b.line(bx,rnd(by),rnd(bx+Math.cos(a)*L),rnd(by+Math.sin(a)*L),P.m1); } }
  b.code=0; }

// ---------------------------------------------------------------- Fluss: Südkai, Ufermauer, Wasser mit Steinen
var WRAMP=null;
// Wasser: flach und schnell, grünbraun; waagerechte Strömungsstreifen, Himmelsglanz, Steine mit weißen Kräuseln
// Was sich nicht bewegt (Lage auf der Wasserfläche, Grundton, Steine, Schotter), wird beim Malen je Pixel vorberechnet; dynamic rechnet nur noch zwei Wellen.
var WXA=new Float32Array(W*H), WZA=new Float32Array(W*H), WBA=new Float32Array(W*H), WSA=new Uint8Array(W*H);
function wprep(x,y){ var Z=FF*(HC+HW)/(y-HZ), X=(x-VPX)*Z/FF, d=(Z-ZP)/(ZF-ZP), k=y*W+x; WXA[k]=X; WZA[k]=Z;
  WBA[k]=0.42+(fbm(X*0.32+40,Z*7.5,3,5)-0.5)*0.5+d*0.14-(WET?0.04:0);                      // lange waagerechte Schlieren
  var st=fbm(X*2.2,Z*4.4,2,11), s=0; if (st>0.74) s=(st>0.86)?3:((st>0.8)?2:1); else if (st>0.69) s=(st>0.715)?5:4;   // Steine, die herausschauen; Kräusel davor
  if (d>0.9 && fbm(X*0.6,Z*8,3,21)>0.5) s=(hash(x,y)<0.6)?6:7;                             // Schotterbank am Fuß der Mauer
  WSA[k]=s; }
function wcol(x,y,t){ var k=y*W+x, X=WXA[k], Z=WZA[k], s=WSA[k];
  if (s===1||s===6) return P.e2; if (s===2) return P.s3; if (s===3) return P.s4; if (s===7) return P.e1;
  var fl=Math.sin((X-t*1.7)*0.55+Z*7.3)*0.5+Math.sin((X-t*2.2)*1.6+Z*13.1)*0.35;         // Strömung nach rechts (flussabwärts)
  var c=ra(WRAMP,WBA[k]+fl*0.17,x,y);
  if (fl>0.64 && ((x+y)&1)) c=WET?P.m3:P.a4;                                                // Glanz des Himmels auf den Wellen
  if ((s===4||s===5) && Math.sin((X-t*2.5)*5+Z*9)>-0.2) c=(s===5)?P.s5:P.s4;              // weiße Kräusel um die Steine
  return c; }
function river(b,tod){ var x, y, Zw;
  WRAMP=WET?R('k2 m0 a1 g1 e1 a2 m2 e2'):R('k2 a1 g1 a2 e1 g2 a3 e2');
  // Südkai: Gehweg und Geländer
  var yq=Math.round(sy(0,ZF)); b.code=2;
  for (y=Math.round(sy(0,ZF+5));y<yq;y++) for (x=0;x<RX1;x++) b.px(x,y,ra(R('s1 s2 s3'),0.5+(hash(x>>2,y)-0.5)*0.4,x,y));
  for (x=0;x<RX1;x++){ b.px(x,yq-3,P.m1); if (x%3===0){ b.px(x,yq-2,P.m1); b.px(x,yq-1,P.m1); } }
  // Ufermauer (Südseite): hohe Kalksteinquader, Abflussöffnungen, Moos, Rostspuren
  var yf=Math.round(sy(-HW,ZF)); b.code=3;
  for (y=yq;y<yf;y++) for (x=0;x<RX1;x++){ var Y=HC-(y-HZ)*ZF/FF, X=(x-VPX)*ZF/FF, c=tex.ashlar(X*2.2+80,(-Y)*4.4,R('s2 s3 s4 s5'),7,3);
    if (y===yq) c=P.s4; if (y===yq+1) c=P.s2; if (Y<-HW+0.8) c=M.DN[c]; if (fbm(X*1.2,Y*2,2,9)>0.66) c=(hash(x,y)<0.5)?P.g1:P.g2; b.px(x,y,c); }
  [[24,0],[118,1],[196,2]].forEach(function(d){ var dx=d[0], dy=yq+4; b.rect(dx,dy,3,3,P.k1); b.px(dx+1,dy+1,P.k0); for (var q=dy+3;q<yf;q++) if (bayer(dx+1,q)<0.6) shade(b,dx+1,q,1); });
  // Wasser
  for (y=yf;y<H;y++) for (x=0;x<RX1;x++){ Zw=FF*(HC+HW)/(y-HZ); if (Zw<ZP) continue; wprep(x,y); b.px(x,y,wcol(x,y,0)); }
  b.code=0; }

// ---------------------------------------------------------------- Lateinerbrücke (perspektivisch, von der Straße in die Tiefe)
function inArch(Z,Y){ for (var i=0;i<ARCH.length;i++){ var a=ARCH[i], z0=a[0], z1=a[1]; if (Z<z0||Z>z1) continue; var hw=(z1-z0)/2, zc=z0+hw, u=(Z-zc)/hw, spring=-HW+0.6, rise=hw*1.12*a[2];
    var top=spring+rise*Math.sqrt(Math.max(0,1-u*u)); if (Math.abs(u)<0.25) top+=hw*0.08*(1-Math.abs(u)/0.25);   // leicht spitz
    if (Y<top) return {i:i,u:u,top:top,edge:top-Y}; } return null; }
function bridgeFace(b,Z,x){ var yTop=sy(hump(Z)+0.95,Z), yDeck=sy(hump(Z),Z), yW=sy(-HW,Z), y;
  for (y=Math.floor(yTop);y<=Math.ceil(yW);y++){ if (y<0||y>=H) continue; var Y=HC-(y-HZ)*Z/FF, c;
    if (Y>hump(Z)+0.95) continue;
    var a=inArch(Z,Y), oc=null, ocz=0; OCUL.forEach(function(oz){ var dz=(Z-oz)/0.72, dy=(Y-(hump(oz)*0.38-0.95))/0.72; if (dz*dz+dy*dy<1){ oc=dz*dz+dy*dy; ocz=dz; } });
    if (a){ // Bogenöffnung: Keilsteine, Schatten der Laibung, darunter das Wasser hinter der Brücke
      if (a.edge<0.28) c=(a.u<0)?P.s5:P.s4; else if (a.top-Y<0.75) c=(a.top-Y<0.4)?P.k1:P.m0; else if (y>=Math.round(sy(-HW,ZF))) c=M.DN[wcol(x,y,0)]; else c=P.m0; }
    else if (oc!==null){ c=(oc>0.58)?(ocz>0?P.s5:P.s3):(oc>0.3?P.k2:((hash(x,y)<0.5)?P.m1:P.s1)); }
    else { var v=0.55+(fbm(Z*6,Y*5,3,4)-0.5)*0.45; c=tex.ashlar(Z*9,(hump(Z)-Y)*7.5+40,R('s1 s2 s3 s4 s5'),6,3);
      if (Math.abs(Y-hump(Z))<0.09) c=P.s5;                          // Gesims unter der Brüstung
      if (Y>hump(Z)) c=(Y>hump(Z)+0.8)?((Math.floor(Z*3.3)%2)?P.s6:P.s5):tex.ashlar(Z*9,(hump(Z)+1-Y)*7.5,R('s2 s3 s4 s5'),5,3);
      if (Y<-HW+0.9) c=M.DN[c];                                       // nasser Fuß
      ARCH.forEach(function(ar){ if (Z>ar[1] && Z<ar[1]+0.45 && Y<-HW+1.6){ c=(Y<-HW+1.2)?P.s4:P.s3; } });   // Pfeilerköpfe (Wellenbrecher)
      if (fbm(Z*3,Y*2,2,17)>0.7 && Y<0) c=M.DN[c]; }
    b.px(x,y,c); } }
function bridge(b){ var Z, x, y; b.code=0;
  // von hinten nach vorn: Fahrbahn, linke Brüstung (Innenseite), rechte Außenwand mit Bögen
  for (Z=ZF;Z>=ZP-0.01;Z-=0.012){ var h=hump(Z), yd=sy(h,Z), xl=sx(BXL,Z), xr=sx(BXR,Z), yi=Math.round(yd);
    var row=Math.floor(Z*3.2), cob=(row%2)*0.5;
    // Fahrbahn: altes Kopfsteinpflaster, in der Mitte ausgetreten, zu den Brüstungen hin im Schatten
    for (x=Math.round(xl)+1;x<Math.round(xr);x++){ var X=(x-VPX)*Z/FF, u=(X-BXL)/(BXR-BXL), cc=((Math.floor(u*7+cob))%2)?P.s2:P.m2; if (Math.abs(Z*3.2-row-0.5)>0.4) cc=P.s1; if (hash(Math.floor(u*7),row)<0.2) cc=P.s3; if (u<0.15||u>0.88) cc=M.DN[cc]; if (WET) cc=M.DN[cc]; b.px(x,yi,cc); }
    // linke Brüstung: Innenseite (vom Licht getroffen) und Abdeckplatte
    var yt=Math.round(sy(h+0.95,Z)), xli=Math.round(xl), cop=(Math.floor(Z*3.3)%2)?P.s6:P.s4; for (y=yt;y<yi;y++) b.px(xli,y,(y===yt)?cop:tex.ashlar(Z*9,y-yt,R('s1 s2 s3 s4'),5,3)); b.px(xli+1,yt,P.s5); b.px(xli-1,yt,P.s3);
    bridgeFace(b,Z,Math.round(xr)); }
  // Brückenkopf: die Brüstungen enden in kräftigen Pfosten an der Straße
  [[sx(BXL,ZP)-3,0],[sx(BXR,ZP)-1,1]].forEach(function(p){ var px=rnd(p[0]); b.rect(px,PY-14,5,14,P.s3); b.vl(px,PY-14,PY-1,P.s5); b.vl(px+4,PY-14,PY-1,P.s1); b.hl(px-1,px+5,PY-15,P.s6); b.hl(px-1,px+5,PY-14,P.s4); }); }

// ---------------------------------------------------------------- Uferstraße: Brüstung, Gehweg, Bordstein, Asphalt mit Gleisen
function parapet(b){ var x, y, g0=rnd(sx(BXL,ZP))-3, g1=rnd(sx(BXR,ZP))+4;
  for (x=0;x<RX1+2;x++){ if (x>=g0 && x<g1) continue;
    for (y=PY-9;y<PY;y++){ var c=tex.ashlar(x,y,R('s2 s3 s4 s5'),11,4); if (y===PY-9) c=P.s6; else if (y===PY-8) c=P.s4; else if (y===PY-7) c=P.s2; if (WET && y>PY-8) c=M.DN[c]; b.px(x,y,c); } }
  // Eisengeländer auf der Brüstung, alle paar Meter ein Pfosten
  for (x=0;x<RX1+2;x++){ if (x>=g0-2 && x<g1+2) continue; b.px(x,PY-14,P.k1); if (x%3===0) b.vl(x,PY-13,PY-10,P.k2); if (x%24===0){ b.vl(x,PY-15,PY-10,P.k1); b.px(x,PY-16,P.m2); } } }
var JNT=new Uint8Array(W*H);
function street(b){ var x, y; JNT.fill(0); b.code=5;
  // Gehweg (Steinplatten) hinten, Bordstein, Fahrbahn
  for (y=PY;y<H;y++) for (x=0;x<W;x++){ var c;
    if (y<114){ var row=Math.floor((y-PY)/3.2), off=(row%2)*7, col=Math.floor((x+off)/14), fx=(x+off)%14; c=(fx===0||(y-PY)%3.2<1)?P.s2:((hash(col,row)<0.3)?P.s3:P.s4); if (fx===0||(y-PY)%3.2<1) JNT[y*W+x]=1; }
    else if (y<116){ c=(y===114)?P.s5:P.s2; if (x%19===0) c=P.s2; }
    else { var v=0.42+(fbm(x*0.4,y*1.3,8,5)-0.5)*0.3+(y-116)/120; c=ra(R('m0 m1 m2 m3'),v,x,y); if (hash(x,y)<0.03) c=P.m3; }
    if (WET && y>=116) c=M.DN[c];
    b.px(x,y,c); }
  // Gleise: Rillenschienen, glänzend
  RAILS.forEach(function(ry,ri){ for (x=0;x<W;x++){ b.px(x,ry,P.k1); var hi=(hash(x>>2,ry)<0.55); if (hi) b.px(x,ry-1,WET?P.m3:P.m2); if (hash(x>>3,ry)<0.08) b.px(x,ry-1,WET?P.m4:P.m3); JNT[ry*W+x]=1; } });
  // Kanaldeckel, Gully
  [[96,128],[388,133]].forEach(function(g){ b.ellipse(g[0],g[1],5,1.6,P.m0); b.ellipse(g[0],g[1],3.5,1,P.m1); for (var k=-3;k<=3;k+=2) b.px(g[0]+k,g[1],P.m0); });
  b.rect(205,115,8,2,P.k1); for (var k2=0;k2<8;k2+=2) b.px(205+k2,115,P.m1);
  b.code=0; }

// ---------------------------------------------------------------- Platanen: kahl, gefleckte Rinde, weit ausladend
function plane(b,x,by,h,sd){ var r=M.rng(sd), BK=[P.s4,P.e3,P.g4,P.s3,P.e4,P.s5];
  function bark(xx,yy,u){ var q=fbm(xx*0.9,yy*0.45,3,sd), c=BK[Math.floor(q*BK.length*0.999)]; if (u>0.7) c=M.DN[c]; if (u<0.2) c=M.UP[c]; return c; }
  var tw=3.2, th=Math.round(h*0.38), tx=x;
  for (var y=by;y>by-th;y--){ var w=tw+(by-y<4?(4-(by-y))*0.5:0); for (var xx=Math.floor(tx-w);xx<=Math.ceil(tx+w);xx++){ var u=(xx-(tx-w))/(2*w); b.px(xx,y,bark(xx,y,u)); } }
  b.ellipse(x+0.5,by,6,1.4,P.s1);
  function limb(x0,y0,a,L,w,dep){ var px=x0, py=y0; for (var i=0;i<L;i++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.16; var ww=w*(1-i/L*0.6);
      for (var o=-ww;o<=ww;o+=0.6) b.px(rnd(px+o*0.8),rnd(py),dep<2?bark(px,py,(o+ww)/(2*ww+0.01)):(dep<3?P.m2:P.m1));
      if (dep<4 && i>L*0.35 && r()<0.09+dep*0.04) limb(px,py,a+(r()<0.5?-1:1)*(0.4+r()*0.6),L*(0.45+r()*0.25),Math.max(0.3,ww*0.6),dep+1); }
    if (dep<4) for (var k=0;k<3;k++) limb(px,py,a+(r()-0.5)*1.4,L*0.35,0.3,dep+1); }
  var y0=by-th;
  limb(tx,y0,-Math.PI/2-0.55,h*0.34,2.2,1); limb(tx,y0,-Math.PI/2+0.5,h*0.36,2.1,1); limb(tx,y0-3,-Math.PI/2-0.05,h*0.4,1.8,1); limb(tx,y0+4,-Math.PI/2-1.1,h*0.26,1.4,2); limb(tx,y0+2,-Math.PI/2+1.05,h*0.24,1.3,2);
  // Fruchtkugeln, die im Winter hängen bleiben
  for (var k=0;k<7;k++){ var fx=rnd(x+(r()-0.5)*h*0.7), fy=rnd(by-h*0.55-r()*h*0.35); b.px(fx,fy,P.e2); b.px(fx,fy-1,P.m1); } }

// ---------------------------------------------------------------- Laternen, Oberleitung
function lamp(b,x){ var by=106, I=R('k1 g0 g1 g2'), h=46;
  b.rect(x-2,by-6,5,6,I[1]); b.vl(x-2,by-6,by-1,I[2]); b.hl(x-3,x+3,by-1,I[1]); b.hl(x-2,x+2,by-7,I[3]);
  b.rect(x-1,by-h,2,h-6,I[1]); b.vl(x-1,by-h,by-7,I[2]); for (var yy=by-h+8;yy<by-8;yy+=10) b.hl(x-2,x+1,yy,I[2]);
  // Bischofsstab-Arm mit hängender Laterne
  b.line(x,by-h,x+3,by-h-4,I[1]); b.line(x+3,by-h-4,x+8,by-h-4,I[1]); b.px(x+9,by-h-3,I[1]); b.vl(x+9,by-h-2,by-h,I[1]);
  var lx=x+9, ly=by-h+1; b.hl(lx-3,lx+3,ly,I[1]); b.poly([[lx-3,ly+1],[lx+3,ly+1],[lx+2,ly+7],[lx-2,ly+7]],P.m2); b.vl(lx,ly+1,ly+7,I[0]); b.hl(lx-2,lx+2,ly+8,I[1]); b.px(lx,ly+9,I[1]); b.px(lx-2,ly+3,P.m3); }
function lampGlass(b,x){ var lx=x+9, ly=106-46+1; for (var yy=ly+1;yy<=ly+7;yy++) for (var xx=lx-3;xx<=lx+3;xx++){ var w=3-Math.floor((yy-ly-1)/6); if (Math.abs(xx-lx)>w||xx===lx) continue; b.px(xx,yy,yy<ly+4?P.y5:P.y4); } b.px(lx-1,ly+2,P.l1); b.px(lx+1,ly+5,P.l0); }
function wires(b){ var x; b.code=0;
  [[33,0.9],[37,1.1]].forEach(function(wr,i){ for (x=0;x<W;x++){ var seg=((x+10)%90)/90, sag=Math.sin(seg*Math.PI)*wr[1]*2; if (i===1 && (x&1)) continue; b.px(x,rnd(wr[0]+sag),P.k2); } });
  for (x=80;x<W;x+=90){ b.vl(x,31,36,P.k2); }
  // Querdrähte zu Rosetten an den Häusern
  b.line(262,24,300,33,P.k2); b.line(380,24,350,33,P.k2); b.px(262,24,P.m3); b.px(380,24,P.m3); b.line(434,20,470,33,P.k2); b.px(434,20,P.m3); }

// ---------------------------------------------------------------- Haus Obala 14 (österreichisch-ungarisch, vier Geschosse)
function window14(b,x,y,w,h,st,rp,shut,lit){ b.rect(x-1,y-1,w+2,h+2,rp[4]); b.vl(x+w,y-1,y+h,rp[2]);
  glass(b,x,y,w,h,'win',function(xx,yy){ var c=(yy<y+2)?P.k1:P.k2; if (xx===x+(w>>1)) c=P.s4; if (yy===y+Math.round(h*0.3)) c=P.s4; if (c===P.k2 && (xx+yy*2)%9===0) c=P.n0; return c; },lit);
  if (shut>0){ var sh=Math.max(1,Math.round(h*shut)); for (var yy=y;yy<y+sh;yy++) b.hl(x,x+w-1,yy,(yy-y)%2?P.s4:P.s5); b.hl(x,x+w-1,y+sh,P.s2); }
  b.hl(x-2,x+w+1,y+h+1,rp[4]); b.hl(x-2,x+w+1,y+h+2,rp[0]);
  if (st==='ped'){ for (var i=0;i<3;i++) b.hl(x-1+i,x+w-i,y-3-i,rp[4]); b.hl(x-2,x+w+1,y-2,rp[4]); b.hl(x-2,x+w+1,y-1,rp[1]); }
  else if (st==='seg'){ for (var j=-2;j<=w+1;j++){ var u=(j-(w-1)/2)/((w+3)/2), yy2=y-2-Math.round((1-u*u)*2.2); b.px(x+j,yy2,rp[4]); b.px(x+j,yy2+1,rp[1]); } }
  else { b.hl(x-2,x+w+1,y-3,rp[4]); b.hl(x-2,x+w+1,y-2,rp[2]); b.hl(x-1,x+w,y-1,rp[0]); } }
function balcony(b,bl,rp){ var x0=bl.x, y=bl.y, w=bl.w, x;
  b.rect(x0,y,w,2,rp[3]); b.hl(x0,x0+w-1,y,rp[4]); b.hl(x0+1,x0+w-2,y+2,rp[0]); [x0+2,x0+w-3].forEach(function(cx){ b.px(cx,y+3,rp[2]); b.px(cx,y+4,rp[1]); b.px(cx,y+5,rp[0]); });
  // Schmiedeeisen: oberer Handlauf, Stäbe, ein Band mit Ranken
  b.hl(x0,x0+w-1,y-8,P.k1); b.hl(x0,x0+w-1,y-1,P.k1); b.vl(x0,y-8,y-1,P.k1); b.vl(x0+w-1,y-8,y-1,P.k1);
  for (x=x0+2;x<x0+w-1;x+=2) b.vl(x,y-7,y-2,P.k2);
  for (x=x0+3;x<x0+w-2;x+=6){ b.px(x,y-5,P.k1); b.px(x+1,y-6,P.k1); b.px(x+2,y-5,P.k1); b.px(x+1,y-4,P.k1); }
  if (bl.hi){ // der Balkon des Professors: Blumenkästen mit verwelkten Geranien, ein alter Stuhl
    b.rect(x0+3,y-11,10,3,P.t1); b.hl(x0+3,x0+12,y-11,P.t2); for (var k=0;k<5;k++){ b.px(x0+4+k*2,y-12,P.e2); b.px(x0+4+k*2,y-13,(k%2)?P.r1:P.e1); }
    b.rect(x0+w-13,y-11,10,3,P.t1); b.hl(x0+w-13,x0+w-4,y-11,P.t2); b.px(x0+w-10,y-12,P.e2); b.px(x0+w-7,y-12,P.e1);
    b.vl(x0+18,y-14,y-2,P.w1); b.vl(x0+22,y-11,y-2,P.w1); b.hl(x0+18,x0+22,y-8,P.w2); } }
function house14(b){ var x0=H14.x0, x1=H14.x1, top=H14.top, rp=R('s2 s3 e4 s4 s5'), x, y; b.code=4;
  for (y=0;y<GY;y++) for (x=x0;x<x1;x++){ if (y<top-9) continue; var v=0.58+(fbm(x*0.6,y*0.8,9,14)-0.5)*0.32; if (y>=70) v-=0.08; b.px(x,y,ra(rp,v,x,y)); }
  // Dach: Ziegel, zwei Gauben, Schornsteine
  for (y=top-9;y<top;y++){ var ins=Math.floor((top-y)*0.6); for (x=x0+ins;x<x1-ins;x++) b.px(x,y,((x+y*2)%4===0)?P.t1:(y<top-6?P.t3:P.t2)); }
  [[x0+30,top-14],[x1-40,top-13]].forEach(function(c){ b.rect(c[0],c[1],5,6,P.s3); b.hl(c[0]-1,c[0]+5,c[1],P.s4); b.vl(c[0]+4,c[1],c[1]+5,P.s2); });
  [[x0+58],[x0+108]].forEach(function(g){ var gx=g[0]; b.rect(gx,top-8,8,7,P.s4); b.rect(gx+2,top-6,4,5,P.k2); b.poly([[gx-1,top-8],[gx+4,top-12],[gx+9,top-8]],P.t2); });
  // Hauptgesims mit Konsolen
  b.hl(x0-1,x1,top,P.s5); b.hl(x0-1,x1,top+1,P.s4); b.hl(x0,x1-1,top+2,P.s1); for (x=x0+1;x<x1;x+=4){ b.px(x,top+3,P.s4); b.px(x,top+4,P.s1); }
  // Ecklisenen
  [x0,x1-5].forEach(function(lx){ for (y=top+2;y<70;y++) for (x=lx;x<lx+5;x++){ var c=((y-top)%4===0)?rp[1]:(x===lx?rp[4]:rp[3]); b.px(x,y,c); } });
  // drei Obergeschosse, Fenster mit Verdachung; im 1. und 2. Stock Balkontüren
  var WX=[262,282,306,326,346,374,394], FLR=[[55,'ped',11],[39,'seg',10],[24,'hood',9]];
  FLR.forEach(function(f,fi){ var fy=f[0];
    WX.forEach(function(wx,i){ var sd=hash(wx,fi*5+3), shut=sd<0.3?0.5:(sd<0.45?0.25:(sd>0.92?1:0));
      var onB=BALC.some(function(bl){ return bl.y>fy && bl.y<fy+f[2]+8 && wx>=bl.x && wx<bl.x+bl.w; });
      window14(b,wx,fy,7,onB?f[2]+3:f[2],f[1],rp,onB?0:shut,false); });
    b.hl(x0+5,x1-6,fy+f[2]+5,rp[4]); b.hl(x0+5,x1-6,fy+f[2]+6,rp[1]); });
  BALC.forEach(function(bl){ balcony(b,bl,rp); });
  // Erdgeschoss: Rustika, Haustür mit Oberlicht, zwei Fenster mit Gittern, ein kleiner Laden (Uhrmacher, geschlossen)
  for (y=71;y<GY;y++) for (x=x0;x<x1;x++){ if ((y-71)%4===0) b.px(x,y,rp[1]); else if ((y-71)%4===1) lift(b,x,y,1); }
  b.hl(x0,x1-1,70,rp[4]); b.hl(x0,x1-1,71,rp[0]);
  var d=DOOR14; b.rect(d[0]-4,d[1]-8,d[2]+8,d[3]+8,P.s4); b.hl(d[0]-4,d[0]+d[2]+3,d[1]-8,P.s5); b.vl(d[0]+d[2]+3,d[1]-8,d[1]+d[3]-1,P.s2);
  glass(b,d[0],d[1]-6,d[2],5,'fan',function(xx,yy){ return ((xx-d[0])%4===1||yy===d[1]-6)?P.w1:P.k2; },false);
  for (y=d[1];y<d[1]+d[3];y++) for (x=d[0];x<d[0]+d[2];x++){ var c2=((x-d[0])%5===0)?P.w0:P.w1; if (x===d[0]+(d[2]>>1)) c2=P.w0; if ((y-d[1])===10||(y-d[1])===18) c2=P.w2; b.px(x,y,c2); }
  b.px(d[0]+8,d[1]+14,P.y3); b.px(d[0]+11,d[1]+14,P.y3);
  b.rect(d[0]+d[2]+6,d[1]+3,9,6,P.b1); b.hl(d[0]+d[2]+6,d[0]+d[2]+14,d[1]+3,P.b2); signText(b,'14',d[0]+d[2]+7,d[1]+4,P.s6);
  b.rect(d[0]-26,72,23,7,P.b0); b.hl(d[0]-26,d[0]-4,72,P.b2); b.hl(d[0]-26,d[0]-4,78,P.k2); signText(b,'OBALA',d[0]-24,73,P.s6);
  [[x0+50,80],[x0+122,80]].forEach(function(p){ b.rect(p[0]-2,p[1]-2,16,18,P.s4); glass(b,p[0],p[1],12,14,'gf',function(xx,yy){ if ((xx-p[0])%4===1||(yy-p[1])%5===2) return P.m1; return (yy===p[1])?P.k1:P.k2; },false); b.hl(p[0]-3,p[0]+13,p[1]+15,P.s5); });
  b.rect(x0+140,76,26,28,P.m1); for (y=78;y<GY;y+=2) b.hl(x0+141,x0+164,y,P.m2); b.rect(x0+140,72,26,4,P.k2); signText(b,'SATOVI',x0+142,73,P.s5);
  // Alter: Ruß unter dem Gesims, Regenspuren, Splitternarben (leise)
  soot(b,x0,x1,top+5,5,0.5,4); streaks(b,x0,x1,top+6,70,8,0.45); scars(b,300,46,12,7,16,301); scars(b,396,62,6,5,7,77); scars(b,270,86,7,5,8,93);
  // Fallrohr
  for (y=top+2;y<GY;y++){ b.px(x1-3,y,P.m2); b.px(x1-2,y,P.m1); }
  b.code=0; }

// ---------------------------------------------------------------- Vijećnica (1896, pseudomaurisch), 2011 eingerüstet
var VR={och:null,red:null};
function vstripe(x,y){ var band=((y+2)%7)<2; var c=band?ra(VR.red,0.55+(fbm(x*0.7,y,4,8)-0.5)*0.4,x,y):ra(VR.och,0.58+(fbm(x*0.5,y*0.7,5,9)-0.5)*0.4,x,y); if (!band && ((x+Math.floor((y+2)/7)*9)%17)===0) c=M.DN[c]; if (hash(x>>2,y)<0.04) c=M.DN[c]; return c; }
// Hufeisen-Spitzbogen mit gestreiften Keilsteinen (rot/ocker), innen dunkel oder rußig
function moorWin(b,wx,wy,w,h,burnt){ var cx=wx+(w-1)/2, R0=w/2+2.2, x, y;
  for (y=wy-3;y<wy+h;y++) for (x=wx-3;x<wx+w+3;x++){ var k=y-wy, dx=x-cx, ar=(k<w*0.55);
    var outer=ar?Math.hypot(dx*0.92,(k-w*0.55)*1.15)<R0:Math.abs(dx)<R0-0.4, inner=ar?Math.hypot(dx*0.92,(k-w*0.55)*1.15)<w/2-0.3:Math.abs(dx)<w/2-0.3;
    if (!outer) continue;
    if (!inner){ var ang=Math.atan2(k-w*0.55,dx), seg=Math.floor((ang+3.1416)/0.42); b.px(x,y,ar?((seg%2)?P.t2:P.e4):((k%4<2)?P.t2:P.e4)); continue; }
    var c=(k<3)?P.k1:(((x+y)%5===0)?P.n0:P.k2); if (burnt && hash(x,y*2)<0.25) c=P.k0; b.px(x,y,c); }
  b.hl(wx-3,wx+w+2,wy+h,P.s5); b.hl(wx-3,wx+w+2,wy+h+1,P.t0); b.vl(Math.round(cx),wy+w*0.55,wy+h-1,P.e3); }
function vijecnica(b){ var x0=VIJ.x0, x1=VIJ.x1, top=VIJ.top, x, y; VR.och=R('e3 e4 t5 s4 s5'); VR.red=R('t1 t2 t3'); b.code=4;
  // Mauer in ocker-roten Streifen
  for (y=top;y<GY;y++) for (x=x0;x<x1;x++) b.px(x,y,vstripe(x,y));
  // Zinnen (gestuft, maurisch) und Hauptgesims mit Zickzackfries
  for (x=x0;x<x1;x++){ var ph=(x-x0)%8; for (y=top-7;y<top;y++){ var hgt=(ph<2||ph>5)?2:((ph===2||ph===5)?5:7); if (y<top-hgt) continue; b.px(x,y,(y===top-hgt)?P.s5:vstripe(x,y)); } }
  for (x=x0;x<x1;x++){ b.px(x,top,P.s5); b.px(x,top+1,P.t1); b.px(x,top+3,((x>>1)%2)?P.t2:P.e4); b.px(x,top+2+((x>>1)%2),P.s5); b.px(x,top+5,P.t0); }
  // Lisenen mit Türmchen an den Ecken
  [x0,x1-10].forEach(function(lx){ for (y=top-12;y<GY;y++) for (x=lx;x<lx+10;x++){ if (y<top-7 && (x-lx<2||x-lx>7)) continue; var c=vstripe(x,y); if (x===lx) c=M.UP[c]; if (x===lx+9) c=M.DN[c]; b.px(x,y,c); } b.ellipse(lx+5,top-13,4,3,function(xx,yy){ return yy<top-14?P.m3:P.m2; }); b.px(lx+5,top-17,P.y2); });
  // zwei Fensterreihen: oben schlank in Paaren, unten groß; das Portal in der Mitte (hinter dem Tor)
  for (var wx=x0+16;wx<x1-14;wx+=24){ moorWin(b,wx,22,7,22,hash(wx,1)<0.5); moorWin(b,wx+11,22,7,22,hash(wx,2)<0.5); }
  b.hl(x0,x1-1,50,P.s5); b.hl(x0,x1-1,51,P.t1); for (x=x0;x<x1;x+=4){ b.px(x,52,P.e4); b.px(x+1,53,P.e4); b.px(x+2,52,P.e4); }
  for (var wx2=x0+18;wx2<x1-14;wx2+=24){ if (wx2>GATE.x0-14 && wx2<GATE.x1) continue; moorWin(b,wx2,58,14,30,hash(wx2,3)<0.6); }
  moorWin(b,GATE.x0+3,56,GATE.x1-GATE.x0-6,48,true);
  soot(b,x0,x1,top+6,5,0.5,6); streaks(b,x0,x1,top+8,GY,21,0.5);
  // Brandspuren: über manchen Fenstern schwarze Zungen (1992), noch nicht gereinigt
  [[x0+30,22],[x0+78,22],[x0+150,58],[x0+102,58]].forEach(function(f,i){ for (var q=0;q<120;q++){ var px=f[0]+Math.round((hash(q,i)-0.5)*16), py=f[1]-Math.round(hash(i,q)*12); if (bayer(px,py)<0.6) shade(b,px,py,2); } });
  // Gerüst: Ständer, Riegel, Diagonalen, Bohlen, Leitern
  var std=[], lv=[18,36,54,72,90];
  for (x=x0+6;x<x1;x+=21) std.push(x);
  // große Planen und Netze, nicht in jedem Feld: unten durchhängend, an manchen Stellen eingerissen
  var TARP=[[x0+6,18,x0+90,54,0],[x0+111,36,x0+174,90,0],[x0+174,18,x0+212,72,1],[x0+27,54,x0+69,90,1],[x0+69,72,x0+111,90,0]];
  TARP.forEach(function(tp,ti){ var tx0=tp[0], ty0=tp[1], tx1=tp[2], ty1=tp[3], net=tp[4];
    for (x=tx0+1;x<tx1;x++){ var bot=ty1-1-Math.round(Math.sin((x-tx0)/(tx1-tx0)*Math.PI*((tx1-tx0)/21|0))*1.5)-((hash(x>>2,ti)<0.15)?Math.floor(hash(x,ti)*8):0);
      for (y=ty0+1;y<bot;y++){ if (net){ if ((x+y)&1) continue; b.px(x,y,ra(R('g1 g2 g3'),0.45+(y-ty0)/80,x,y)); continue; }
        var fold=Math.sin((x-tx0)*0.42+ti*2)*0.14+((x-tx0)%11===0?-0.22:0), v=0.52+fold-(y-ty0)/(ty1-ty0)*0.2+(fbm(x*0.4,y*0.3,6,ti)-0.5)*0.2; b.px(x,y,ra(R('g0 g1 g2 g3 g4'),v,x,y)); } } });
  std.forEach(function(sx0){ for (y=4;y<GY;y++){ b.px(sx0,y,P.m3); b.px(sx0+1,y,P.m1); } b.px(sx0,3,P.m4); for (y=12;y<GY;y+=18){ b.px(sx0-1,y,P.m2); b.px(sx0+2,y,P.m2); } });
  lv.forEach(function(ly){ for (x=x0;x<x1;x++){ b.px(x,ly,P.m2); b.px(x,ly+1,P.w3); b.px(x,ly+2,P.w1); } for (x=x0+3;x<x1;x+=7) b.px(x,ly+1,P.w2); });
  for (var s2=0;s2<std.length-1;s2+=2){ var bx0=std[s2], bx1=std[s2+1]; for (var l2=0;l2<lv.length-1;l2++) b.line(bx0,lv[l2+1],bx1,lv[l2],P.m2); }
  [[x0+48,36,54],[x0+132,54,72],[x0+90,72,90],[x0+160,18,36]].forEach(function(ld){ var lx=ld[0]; for (y=ld[1];y<=ld[2];y++){ b.px(lx,y,P.w2); b.px(lx+4,y,P.w2); if ((y-ld[1])%3===0) b.hl(lx,lx+4,y,P.w3); } });
  // Werkzeug und Eimer auf den Bohlen, ein Bauaufzug mit Seil
  b.rect(x0+60,lv[2]-4,4,4,P.m1); b.rect(x0+140,lv[1]-3,6,3,P.r1); b.vl(x0+200,4,lv[3],P.k1); b.rect(x0+197,lv[3]-6,6,5,P.m2);
  // Banner mit dem Namen des Hauses
  b.rect(x0+92,8,72,9,P.s6); b.hl(x0+92,x0+163,8,P.s5); b.hl(x0+92,x0+163,16,P.s3); signText(b,'GRADSKA VIJEĆNICA',x0+93,11,P.b0);
  b.code=0; }
// Bauzaun mit Schild und Tor, Container der Nachtwache
function fence(b,open){ var x, y, f=FENCE;
  function panel(px0,px1,mesh){ for (y=f.top;y<f.by-2;y++) for (x=px0;x<px1;x++){ var edge=(x===px0||x===px1-1||y===f.top||y===f.by-3); if (edge){ b.px(x,y,P.m3); continue; }
      if (mesh && ((x+y)%3===0 || (x-y+300)%3===0)) b.px(x,y,P.m2); }
    // Betonfüße
    [px0,px1-3].forEach(function(fx){ b.rect(fx-2,f.by-3,6,3,P.s2); b.hl(fx-2,fx+3,f.by-3,P.s4); }); }
  var x0=f.x0;
  while (x0<f.x1){ var x1=Math.min(f.x1,x0+34); if (x0>=GATE.x0-1 && x0<GATE.x1){ x0=GATE.x1; continue; } if (x1>GATE.x0 && x0<GATE.x0) x1=GATE.x0;
    panel(x0,x1,true); x0=x1; }
  // grüne Sichtschutzplane auf dem unteren Teil, mit Falten
  for (x=f.x0;x<f.x1;x++){ if (x>=GATE.x0&&x<GATE.x1) continue; for (y=f.top+12;y<f.by-4;y++){ var v=0.5+Math.sin(x*0.6)*0.1-((x%11)===0?0.25:0); if ((x%34)<1) continue; b.px(x,y,ra(R('g0 g1 g2 g3'),v,x,y)); } }
  // Tor: zwei Flügel; offen = nach innen geschwenkt, dahinter die Baustelle
  if (open){ for (y=f.top+2;y<f.by;y++) for (x=GATE.x0;x<GATE.x1;x++){ var c=(y<f.by-8)?vstripe(x,y):((hash(x>>1,y)<0.5)?P.e2:P.e1); if (y>=f.by-8 && y<f.by-6) c=P.s2; b.px(x,y,c); }
      for (y=86;y<f.by-6;y++) for (x=GATE.x0+8;x<GATE.x1-8;x++){ var k=y-86, cx=(GATE.x0+GATE.x1-1)/2, half=(k<6)?9*Math.sqrt(1-Math.pow((6-k)/6,2)):9; if (Math.abs(x-cx)<half) b.px(x,y,(k<3)?P.k0:P.k1); }
      [[GATE.x0,GATE.x0+7],[GATE.x1-7,GATE.x1]].forEach(function(p){ for (y=f.top+2;y<f.by-2;y++) for (x=p[0];x<p[1];x++){ var e=(x===p[0]||x===p[1]-1||y===f.top+2||y===f.by-3); b.px(x,y,e?P.m3:(((x+y)%3===0)?P.m2:P.m0)); } }); }
  else { // zu: zwei Flügel aus Rohrrahmen mit Maschendraht, Kette und Vorhängeschloss, Schild „ZABRANJEN ULAZ“
    for (y=f.top+1;y<f.by-2;y++) for (x=GATE.x0;x<GATE.x1;x++){ var mid=GATE.x0+((GATE.x1-GATE.x0)>>1), e=(x===GATE.x0||x===GATE.x1-1||x===mid||x===mid-1||y===f.top+1||y===f.by-3||y===f.top+14);
      if (e){ b.px(x,y,(x===mid-1)?P.m1:P.m3); continue; } if ((x+y)%3===0 || (x-y+300)%3===0) b.px(x,y,P.m2); }
    var gm=GATE.x0+((GATE.x1-GATE.x0)>>1); b.line(gm-4,93,gm+3,95,P.m4); b.line(gm-4,94,gm+3,96,P.m1); b.rect(gm-2,95,4,4,P.y1); b.hl(gm-2,gm+1,95,P.y3); b.px(gm-1,94,P.m3); b.px(gm,94,P.m3);
    b.rect(gm-20,f.top+3,40,15,P.s6); b.hl(gm-20,gm+19,f.top+3,P.r3); b.hl(gm-20,gm+19,f.top+17,P.r3); b.vl(gm+19,f.top+3,f.top+17,P.s3);
    signText(b,'ZABRANJEN',gm-19,f.top+6,P.r2); signText(b,'ULAZ',gm-8,f.top+12,P.k2); }
  b.rect(GATE.x0-2,f.top-6,2,f.by-f.top+6,P.m2); b.vl(GATE.x0-2,f.top-6,f.by-1,P.m3); b.rect(GATE.x1,f.top-6,2,f.by-f.top+6,P.m2); b.vl(GATE.x1+1,f.top-6,f.by-1,P.m1);
  b.hl(GATE.x0-3,GATE.x0,f.top-7,P.m4); b.hl(GATE.x1-1,GATE.x1+2,f.top-7,P.m4);
  // Schild „OBNOVA GRADSKE VIJEĆNICE“
  var s=SIGNB; b.rect(s.x0,s.y0,s.w,s.h,P.s6); b.hl(s.x0,s.x0+s.w-1,s.y0,P.s5); b.hl(s.x0,s.x0+s.w-1,s.y0+s.h-1,P.s3); b.vl(s.x0+s.w-1,s.y0,s.y0+s.h-1,P.s3);
  b.rect(s.x0+2,s.y0+2,s.w-4,3,P.b0); signText(b,'OBNOVA GRADSKE',s.x0+3,s.y0+7,P.k2); signText(b,'VIJEĆNICE',s.x0+3,s.y0+13,P.r2);
  for (x=s.x0+40;x<s.x0+s.w-3;x+=2) b.px(x,s.y0+14,P.m2); b.px(s.x0+s.w-6,s.y0+3,P.y4); }
function container(b){ var c=CONT, x, y;
  for (y=c.top;y<c.by;y++) for (x=c.x0;x<c.x1;x++){ var col=((x-c.x0)%3===0)?P.s3:P.s4; if (x===c.x0) col=P.s5; if (x===c.x1-1) col=P.s2; if (y===c.top||y===c.top+1) col=P.s5; if (y>=c.by-3) col=P.m1; b.px(x,y,col); }
  b.hl(c.x0-1,c.x1,c.top-1,P.s2); for (x=c.x0;x<c.x1;x+=9) b.px(x,c.by-2,P.k1);
  glass(b,c.x0+6,c.top+6,16,10,'cont',function(xx,yy){ return ((xx-c.x0-6)===8||yy===c.top+6)?P.s3:P.k2; },true);
  b.rect(c.x0+5,c.top+16,18,1,P.s5);
  b.rect(c.x0+30,c.top+5,10,21,P.m2); b.vl(c.x0+30,c.top+5,c.top+25,P.m3); b.px(c.x0+38,c.top+15,P.k1); b.rect(c.x0+29,c.by-1,12,1,P.m1);
  b.rect(c.x0+33,c.top+1,4,2,P.s2); glass(b,c.x0+34,c.top+3,2,1,'bulb',function(){ return P.s4; },true);
  b.rect(c.x0+44,c.top+8,6,8,P.y3); signText(b,'!',c.x0+46,c.top+9,P.k1);
  // Stromkabel zum Gerüst, ein Stuhl und eine Thermoskanne neben der Tür
  for (x=c.x0-12;x<c.x0;x++) b.px(x,c.by-1-Math.round(Math.sin((x-c.x0)*0.4)),P.k1);
  b.rect(c.x0-9,c.by-9,6,1,P.w2); b.vl(c.x0-9,c.by-8,c.by-1,P.w1); b.vl(c.x0-4,c.by-8,c.by-1,P.w1); b.vl(c.x0-9,c.by-16,c.by-9,P.w2); }
function bench(b){ var x0=BENCH.x0, x1=BENCH.x1, by=BENCH.by, x;
  for (x=x0+1;x<x1;x++) b.px(x,by,P.s1);
  for (var k=0;k<2;k++){ var yy=by-24+k*5; b.hl(x0+2,x1-2,yy,P.w4); b.hl(x0+2,x1-2,yy+1,P.w3); b.hl(x0+2,x1-2,yy+2,P.w1); }
  b.hl(x0+1,x1-1,by-14,P.w2); b.hl(x0+1,x1-1,by-13,P.w4); b.hl(x0,x1,by-12,P.w4); b.hl(x0,x1,by-11,P.w1); b.hl(x0+1,x1-1,by-10,P.w0);
  [[x0+1,1],[x1-1,-1]].forEach(function(e){ var lx=e[0], s=e[1]; b.line(lx+s,by-25,lx,by-19,P.k1); b.line(lx,by-19,lx,by-12,P.k1); b.line(lx,by-17,lx+s*3,by-17,P.m1); b.line(lx,by-10,lx-s,by-1,P.k1); b.line(lx+s,by-9,lx+s*3,by-1,P.k1); });
  // Brotkrumen am Boden
  for (var i=0;i<10;i++) b.px(x1+2+Math.floor(hash(i,3)*22),by+1+Math.floor(hash(i,4)*6),P.s5); }

// ---------------------------------------------------------------- nasse Straße: Spiegelungen
function wetReflect(b){ var src=b.clone();
  for (var y=PY+1;y<H;y++){ var d=y-PY, k=0.7-d/52, sy0=PY-1-Math.floor(d*0.95); if (k<=0.04||sy0<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (CODE[i]!==5||JNT[i]) continue; var sxx=x+((y%3===1)?rnd(Math.sin(y*1.3+x*0.07)*1.2):0); if (sxx<0||sxx>=W) continue; var sc=src.d[sy0*W+sxx], cur=b.d[i];
      if (M.lum(sc)>M.lum(cur)+10 && bayer(x,y)<k*(0.5+0.5*hash(x>>2,y))) b.d[i]=(d<10)?sc:M.DN[sc]; } } }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H);
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=track(new M.Buf(W,H,P.k0)), x, y;
  CODE.fill(0); GLW.fill(0); WINS.length=0; FARL.length=0; TOD=tod; WEA=wea; WET=(wea==='rain'); FOG=(wea==='fog'); NIGHT=(tod==='night');
  sky(b,tod,wea); hills(b); farBank(b); river(b,tod); bridge(b);
  house14(b); vijecnica(b);
  // Brandmauer von Haus 14 zum Fluss hin
  b.code=4; for (y=H14.top-6;y<GY;y++){ b.px(H14.x0-1,y,P.s1); b.px(H14.x0-2,y,P.s0); } b.code=0;
  parapet(b); street(b);
  fence(b,!!S.gateOpen); container(b); bench(b);
  wires(b);
  TREES.forEach(function(t){ plane(b,t.x,106,t.h,t.s); });
  LAMPS.forEach(function(lx){ lamp(b,lx); });
  // Tauben auf Gesimsen
  [[300,19],[304,19],[352,69],[470,57],[474,57]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); });
  // Licht: Regen macht alles dunkler und nass; die Ferne verschwimmt
  if (WET) M.light(b,function(x,y){ return -0.4+(fbm(x*1.4,y*0.25,6,5)-0.5)*0.4; },0,0,function(x,y){ var c=CODE[y*W+x]; return c===4||(c===0&&y<GY); });
  M.light(b,M.lf.sum(M.lf.band(114,H,0,-0.45),M.lf.vignette(W,H,0.35)),0,0,function(x,y){ return CODE[y*W+x]===5; });
  var fc=NIGHT?P.m1:P.s4, f0=FOG?1:(WET?0.75:0.45);
  M.fogBake(b,function(x,y){ var c=CODE[y*W+x]; if (c===1) return 0; if (c===2) return Math.min(0.85,(0.55+Math.max(0,(56-y)/56)*0.25)*f0); if (c===3) return 0.22*f0; if (c===4) return (y>=70)?0:Math.pow(Math.max(0,(72-y)/72),1.2)*0.42*f0; if (c===0&&y<PY-16) return Math.max(0,(90-y)/90)*0.3*f0; return 0; },{col:fc});
  if (WET) wetReflect(b);
  SKYM.fill(0); for (var k=0;k<W*H;k++) if (CODE[k]===1) SKYM[k]=1;
  var base=b.clone(), lights=[];
  if (tod!=='day'){ LAMPS.forEach(function(lx){ lights.push([lx+9,106-38,20,0.9,18]); lights.push([lx+9,116,26,0.6,9]); }); lights.push([CONT.x0+14,CONT.top+12,20,0.7,14]); lights.push([DOOR14[0]+10,DOOR14[1]+6,14,0.5,12]); }
  var out=M.finishTOD(b,tod,{ sky:function(x,y){ return SKYM[y*W+x]===1; }, lights:lights, after:function(o,tod){ if (tod!=='day') nightLights(o,base,tod); } });

  return out; }

var FARL=[];
function nightLights(o,base,tod){ var n=tod==='night';
  WINS.forEach(function(w,id){ var on=w.lit; if (w.k==='win') on=hash(w.x,w.y)<(n?0.3:0.45); if (w.k==='far') on=hash(w.x,w.y*3)<0.35; if (w.k==='gf'||w.k==='fan') on=w.k==='fan'; if (!on) return;
    if (w.k==='far' && FARL.length<9 && (FARL.length===0 || Math.abs(FARL[FARL.length-1]-w.x)>16)) FARL.push(w.x+1);
    for (var yy=w.y;yy<w.y+w.h;yy++) for (var xx=w.x;xx<w.x+w.w;xx++){ var k=yy*W+xx; if (GLW[k]!==id+1) continue; var c0=base.d[k], dark=(c0===P.k2||c0===P.k1||c0===P.n0||c0===P.k0), c;
      if (w.k==='far') c=(bayer(xx,yy)<0.5)?P.y3:P.y2;
      else if (w.k==='bulb') c=P.l0;
      else if (w.k==='cont') c=dark?((yy-w.y<3)?P.y4:P.y3):P.s5;
      else c=dark?((yy-w.y<2)?P.y2:(bayer(xx,yy)<0.4?P.y4:P.y3)):M.tintPx(M.TINT.lamp,c0,xx,yy);
      o.d[k]=c; } });
  LAMPS.forEach(function(lx){ lampGlass(o,lx); });
  // Spiegelungen auf der nassen Straße
  if (WET){ var refl=function(cx,y0,y1,wd,cA,cB){ for (var yy=y0;yy<y1;yy++){ var fade=(yy-y0)/(y1-y0); for (var xx=Math.round(cx-wd);xx<=Math.round(cx+wd);xx++){ if (xx<0||xx>=W) continue; var k=yy*W+xx; if (CODE[k]!==5||JNT[k]) continue; var e=Math.abs(xx-cx)/wd; if (hash(xx*3,yy)<fade*0.7+e*0.5) continue; if ((yy+Math.floor(hash(yy,xx>>2)*3))%3===0) continue; o.d[k]=e<0.4?cA:cB; } } };
    LAMPS.forEach(function(lx){ refl(lx+9.5,PY+2,H,2.5,P.y4,P.y2); }); refl(CONT.x0+14,CONT.by+1,128,7,P.y3,P.y1); refl(DOOR14[0]+10,PY+1,118,4,P.y2,P.y1); } }

// ---------------------------------------------------------------- Vordergrund: der Pfosten am Brückenkopf
function layers(S,GS,tod){ var L=[];
  // Pfosten am Brückenkopf: Figuren auf der Brücke gehen dahinter
  var l=M.layer(rnd(sx(BXR,ZP))-2,PY-16,8,17,PY), w=M.lw(l), px=rnd(sx(BXR,ZP))-1; w.rect(px,PY-14,5,14,P.s3); w.vl(px,PY-14,PY-1,P.s5); w.vl(px+4,PY-14,PY-1,P.s1); w.hl(px-1,px+5,PY-15,P.s6); w.hl(px-1,px+5,PY-14,P.s4);
  if (WET) M.light(l,M.lf.k(-0.5),l.ox,l.oy); if (tod!=='day') M.tintApply(l,M.TINT[tod]); L.push(l);
  return L; }

// ---------------------------------------------------------------- jedes Bild: der Fluss strömt, Regenringe, Tauben bei Milka, Laternen

function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, x, y, tod=v.tod;
  if (cam<RX1){ var tint=(tod!=='day')?M.TINT[tod]:null, yf=Math.round(sy(-HW,ZF));
    for (y=yf;y<PY-9;y++){ var row=y*320; for (var s=0;s<320;s++){ x=s+cam; if (x>=RX1) break; var k=y*W+x; if (CODE[k]!==3) continue; var Zw=FF*(HC+HW)/(y-HZ); if (Zw<ZP) continue;
        var c=wcol(x,y,t); if (tint) c=M.tintPx(tint,c,x,y); if (FOG) c=M.mix(c,tod==='night'?P.m1:P.s4,2); else if (WET) c=M.mix(c,tod==='night'?P.m1:P.s4,1); fb.d[row+s]=c; } }
    // Regenringe auf dem Wasser
    if (WET) for (var i=0;i<26;i++){ var n2=Math.floor(t*3+hash(i,9)), rx=Math.floor(hash(i,n2)*RX1), ry=yf+2+Math.floor(hash(n2,i)*(PY-12-yf)), ph=(t*3+hash(i,9))%1, rr=1+ph*2.5, sx0=rx-cam;
      if (sx0<2||sx0>317) continue; if (CODE[ry*W+rx]!==3) continue; [[-rr,0],[rr,0],[0,-rr*0.35],[0,rr*0.35]].forEach(function(o2){ var xx=Math.round(sx0+o2[0]), yy=Math.round(ry+o2[1]); if (xx<0||xx>=320||yy<0||yy>=H) return; if (CODE[yy*W+xx+cam]!==3) return; var kk=yy*320+xx; fb.d[kk]=M.UP[fb.d[kk]]; }); }
    // nachts spiegeln sich die Fenster des Südufers zitternd im Fluss
    if (tod==='night') FARL.forEach(function(fx,i){ var s3=fx-cam; if (s3<0||s3>=320) return; for (var yy=yf+3;yy<PY-10;yy+=1){ var wob=Math.round(Math.sin(yy*0.9+t*2.2+i)*1.2), xx=s3+wob; if (xx<0||xx>=320||CODE[yy*W+xx+cam]!==3) continue; if (Math.sin(yy*1.7+t*3.1+i*2)>0.15) fb.d[yy*320+xx]=(yy<yf+8)?P.y3:P.y1; } });
  }
  // Tauben um Milka
  if (tod==='day'){ var PG=[[322,113],[330,116],[338,112],[346,117],[327,120],[354,114]];
    PG.forEach(function(p,i){ var sx1=p[0]-cam+Math.round(Math.sin(t*0.5+i*1.7)*3), yy=p[1], peck=Math.floor(t*2.5+i*0.9)%4===0, f=(i%2)?1:-1; if (sx1<-4||sx1>324) return; if (WET && i>3) return;
      fb.px(sx1,yy,P.m2); fb.px(sx1+1,yy,P.m2); fb.px(sx1-1,yy-1,P.m2); fb.px(sx1,yy-1,P.m3); fb.px(sx1+1,yy-1,P.m3); fb.px(sx1+2,yy-1,P.m2); fb.px(sx1,yy-2,P.m4);
      var hx=f>0?sx1+2:sx1-1, hy=peck?yy:yy-2; fb.px(hx,hy,P.m3); fb.px(hx,hy-1,P.m4); fb.px(f>0?sx1-2:sx1+3,yy-1,P.m1); fb.px(sx1,yy+1,P.t2); }); }
  if (tod!=='day') LAMPS.forEach(function(lx){ var s2=lx+9-cam; if (s2>-12&&s2<332) M.glow(fb,s2,106-41,9,t,0.45); });
  // rotes Warnlicht oben am Gerüst, blinkt langsam
  var wl=VIJ.x1-8-cam; if (wl>=0 && wl<319 && (Math.floor(t*1.2)%2===0)){ fb.px(wl,3,tod==='day'?P.r3:P.r4); fb.px(wl+1,3,P.r2); if (tod!=='day'){ fb.px(wl,2,P.r2); fb.px(wl-1,3,P.r1); } } }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS);
  if (wea==='rain') M.rain(fb,v.t,{n:95,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:260,slant:0.22});
  if (wea==='fog') M.fogDrift(fb,v.t,{y0:30,y1:110,amt:0.38,k:2,col:v.tod==='night'?P.m1:P.s4,cam:v.cam});
  if (wea==='snow') M.snow(fb,v.t,{n:70,cam:v.cam}); }
// ---------------------------------------------------------------- Malas Sicht: schwarzer Schnee über dem Fluss, der Faden vom Balkon
function ghost(fb,v,S,GS){ var cam=v.cam, t=v.t;
  // verbrannte Seiten: kleine dunkle Flocken mit glimmendem Rand; sie fallen langsam, taumeln und drehen sich, bis das Wasser sie nimmt
  var SH=[[[0,0],[1,0],[2,0],[0,1],[1,1]],[[0,0],[1,0],[1,1],[2,1]],[[1,0],[0,1],[1,1],[2,1],[1,2]],[[0,0],[1,0],[0,1]],[[0,0],[1,1],[2,1],[1,0]],[[0,0],[0,1],[1,1]]];
  for (var i=0;i<58;i++){ var sp=3.2+hash(i,1)*4.5, fall=150, wx=hash(i,2)*(RX1+30)-10+Math.sin(t*0.3+i*1.3)*10+Math.sin(t*0.83+i)*3, wy=((t*sp+hash(i,3)*fall)%fall)-10, end=70+hash(i,6)*28;
    if (wy>end) continue; var sxx=Math.round(wx-cam), syy=Math.round(wy); if (sxx<1||sxx>316||syy<0) continue;
    var shp=SH[(Math.floor(t*(0.9+hash(i,7)*0.8)+i*3))%SH.length], dark=(hash(i,5)<0.6)?P.k0:P.k1, big=hash(i,4)<0.3;
    shp.forEach(function(p){ var xx=sxx+p[0], yy=syy+p[1]; if (xx>=0&&xx<320&&yy>=0&&yy<H) fb.d[yy*320+xx]=dark; if (big){ xx++; if (xx<320&&yy<H) fb.d[yy*320+xx]=dark; } });
    var glow=(Math.sin(t*(1.1+hash(i,8))+i*2.3)+1)/2, last=shp[shp.length-1], first=shp[0];
    if (glow>0.25){ var gx=sxx+last[0]+(big?2:1), gy=syy+last[1]; if (gx<320&&gy<H) fb.d[gy*320+gx]=glow>0.8?P.x6:(glow>0.5?P.x5:P.x3); }
    if (glow>0.6){ var hx=sxx+first[0]-1, hy=syy+first[1]; if (hx>=0) fb.d[hy*320+hx]=P.x3; } }
  // ein Faden aus Licht vom Balkon im zweiten Stock hinüber zur Vijećnica
  var bl=BALC[1], ax=bl.x+bl.w/2, ay=bl.y-6, bx=VIJ.x0+70, by=46;
  for (var s=0;s<=150;s++){ var u=s/150, xx=ax+(bx-ax)*u, yy=ay+(by-ay)*u-Math.sin(u*Math.PI)*16+Math.sin(t*1.1+u*6)*0.8, sx2=Math.round(xx-cam), sy2=Math.round(yy); if (sx2<0||sx2>=320) continue;
    var pulse=(Math.sin(t*1.6-u*11)+1)/2; if (pulse<0.2 && (s%2)) continue; fb.px(sx2,sy2,pulse>0.82?P.x6:(pulse>0.45?P.x5:P.x3)); }
  var gx0=Math.round(ax-cam); if (gx0>-6&&gx0<326){ fb.px(gx0,ay,P.x6); fb.px(gx0-1,ay,P.x4); fb.px(gx0+1,ay,P.x4); } }

// ---------------------------------------------------------------- Lauffläche: Straße und der Brückenkopf
var BH=null;
function bridgeHead(){ if (BH) return BH; var Z1=10.9; BH=[[sx(BXL,ZP)+1,PY+6],[sx(BXR,ZP)-1,PY+6],[sx(BXR,Z1)-2,sy(hump(Z1),Z1)+1],[sx(BXL,Z1)+3,sy(hump(Z1),Z1)+1]]; return BH; }
function walk(x,y,S,GS){ if (y>=112 && y<=140 && x>=6 && x<=634) return true; if (y>=PY-8 && y<112 && M.inPoly(x,y,bridgeHead())) return true; return false; }
var BHR=(function(){ var p=bridgeHead(); var xs=p.map(function(q){ return q[0]; }), ys=p.map(function(q){ return q[1]; }); return [Math.floor(Math.min.apply(null,xs)),Math.floor(Math.min.apply(null,ys)),Math.ceil(Math.max.apply(null,xs)-Math.min.apply(null,xs)),Math.ceil(Math.max.apply(null,ys)-Math.min.apply(null,ys))]; })();
M.defineArt('obala',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{ exit:[0,96,12,48], river:[0,64,96,34], bridge:[40,50,200,48], bridge_mid:[rnd(sx(BXL,14))-6,rnd(sy(hump(18),18))-6,rnd(sx(BXR,19)-sx(BXL,14))+10,30], house14:[H14.x0,0,H14.x1-H14.x0,GY],
    balcony:[BALC[1].x-2,BALC[1].y-15,BALC[1].w+4,22], bench:[BENCH.x0-2,BENCH.by-26,BENCH.x1-BENCH.x0+5,27], trees:[TREES[1].x-24,4,48,90], lamp:[LAMPS[1]-4,52,20,56], tracks:[150,118,80,20],
    vijecnica:[VIJ.x0,0,VIJ.x1-VIJ.x0,FENCE.top], scaffold:[VIJ.x0+90,22,80,54], fence:[FENCE.x0,FENCE.top,GATE.x0-FENCE.x0,FENCE.by-FENCE.top], sign:[SIGNB.x0-1,SIGNB.y0-1,SIGNB.w+2,SIGNB.h+2],
    gate:[GATE.x0-1,FENCE.top-6,GATE.x1-GATE.x0+2,FENCE.by-FENCE.top+6], container:[CONT.x0-2,CONT.top-2,CONT.x1-CONT.x0+4,CONT.by-CONT.top+2], hills:[250,0,170,18] },
  stands:{ exit:[10,124,'L'], river:[60,113,'B'], bridge:[118,114,'B'], bridge_mid:[rnd((sx(BXL,ZP)+sx(BXR,ZP))/2)+2,PY-2,'B'], house14:[332,114,'B'], balcony:[336,116,'B'], bench:[300,118,'B'],
    trees:[274,114,'B'], lamp:[LAMPS[1]+9,114,'B'], tracks:[200,124,'F'], vijecnica:[500,114,'B'], scaffold:[560,114,'B'], fence:[486,114,'B'], sign:[477,114,'B'], gate:[530,113,'B'], container:[606,116,'B'], hills:[330,124,'B'] },
  actorPos:{ milka:[300,111,'R'], amra:[552,115,'L'], ilija:[594,117,'L'] },
  start:[30,124,'R'], entries:{ map:[16,124,'R'], vijecnica:[532,114,'L'] }
});
})(M);
