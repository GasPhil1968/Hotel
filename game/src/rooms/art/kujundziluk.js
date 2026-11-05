/* ===== rooms/art/kujundziluk.js — Kujundžiluk, die Gasse der Kupferschmiede (480 px, scrollend) =====
   Eine enge Altstadtgasse: vorn die Kaldrma aus runden Flusssteinen mit querliegenden Reihen größerer Steine, oben ragen
   die Traufen der Häuser auf der Gegenseite ins Bild. Hinten eine Reihe niedriger Steinhäuser mit grauen Steinplattendächern
   und hölzernen Obergeschossen; unten die Läden mit Holzläden (der obere Laden als Vordach hochgeklappt, der untere als
   Auslage): Kupferteller und Džezve, Teppiche und Kelims, der Laden mit alten Postkarten (Drehständer, Kisten; der Händler
   sitzt auf einem Hocker im Eingang), Tücher, die im Wind wehen, eine kleine Galerie mit Bildern der Brücke. Zwei Touristen
   (gemalt, bei Regen in Ponchos). Rechts öffnet sich die Gasse zur Brücke: der Turm Tara angeschnitten, Licht, die Brüstung.
   Morgengrauen: die meisten Läden sind noch zu. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=480, H=144, GY=106;
// ---------------------------------------------------------------- Geometrie
var SH=[ {x0:18,x1:92,kind:'copper'},{x0:96,x1:168,kind:'carpet'},{x0:174,x1:254,kind:'cards'},{x0:260,x1:326,kind:'cloth'},{x0:332,x1:404,kind:'gallery'} ];   // Läden
var OPEN={x0:408};                                       // hier öffnet sich die Gasse zur Brücke
var TARA={x0:446,x1:480,top:20};                         // Turm, angeschnitten
var STOOL=[226,116];                                     // Hocker des Händlers (Fuß)
var BOX={x0:184,x1:206,top:100,base:114};                // Kiste mit alten Postkarten (vor dem Laden)
var RACK={x0:238,x1:252,top:66,base:112};                // Drehständer mit Postkarten
var TOUR=[[418,101,0],[429,100,1]];                      // Touristen (gemalt, hinten an der Öffnung zur Brücke)
var LAMPS=[{x:94,y:44},{x:258,y:42},{x:406,y:46}];        // Wandlaternen
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
function closedAt(tod,i){ return tod==='dawn' && (i===0||i===3||i===4); }   // im Morgengrauen haben noch nicht alle offen

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  gdawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.44+10, g*0.2+L*0.44+15, b*0.2+L*0.44+27]; },
  grey:function(r,g,b){ var L=lum(r,g,b); return [r*0.58+L*0.32+4, g*0.58+L*0.32+6, b*0.58+L*0.32+12]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,w){ if (tod==='day') return w==='grey'?'grey':null; if (tod==='night') return 'night'; if (tod==='dawn') return w==='grey'?'gdawn':'dawn'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod){ if (tod==='day') return []; var L=[]; LAMPS.forEach(function(l){ L.push([l.x+2,l.y+6,30,26,0.9],[l.x+2,120,34,12,0.45]); }); L.push([(SH[2].x0+SH[2].x1)/2,84,34,24,0.6],[(SH[1].x0+SH[1].x1)/2,86,30,20,0.35]); return L; }

// ---------------------------------------------------------------- Masken
var SKYM=new Uint8Array(W*H), PAVE=new Uint8Array(W*H), WINS=[], CLOTH=[];

// ---------------------------------------------------------------- Himmel (nur ein Streifen über den Dächern) und der Blick zur Brücke
function paintSky(s,tod,w){ var x, y, r=M.rng(3);
  if (w==='grey' && tod==='dawn'){ for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(R('k2 m0 m1 m2 m3'),0.3+Math.pow(y/90,1.2)*0.6+(fbm(x*0.02,y*0.08,3)-0.5)*0.16,x,y)); return; }
  if (w==='rain'||w==='grey'){ M.scn.sky(s,0,0,W,H,tod,w,8); return; }
  if (tod==='day'){ for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(R('b0 b1 b2 b3 b4 b5'),(w==='bura'?0.08:0.18)+Math.pow(y/70,1.1)*0.8,x,y)); if (w==='bura') for (var i=0;i<6;i++){ var cx=r()*W, cy=4+r()*14, L=30+r()*60; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy-k*0.15), a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); } } return; }
  if (tod==='night'){ for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(R('k0 k1 k2 n0 n1'),0.05+y/120,x,y)); for (var j=0;j<90;j++) s.px(Math.floor(r()*W),Math.floor(r()*30),r()<0.2?P.n5:P.n3); return; }
  M.sky(s,0,0,W,90,tod,2); }
// am Ende der Gasse: Lichtöffnung zur Brücke, Brüstung und Rampe, die Schlucht im Dunst, gegenüber das Westufer
function bridgeOpening(b,tod,w){ var x, y, x0=OPEN.x0;
  for (x=x0;x<TARA.x0;x++){ var t=(x-x0)/(TARA.x0-x0);
    // Westufer drüben (fern), Hum
    var hy=rd(46+Math.sin(x*0.1)*2); for (y=hy;y<74;y++) b.px(x,y,ra(R('g0 e1 g1 e2'),0.5+(fbm(x*0.3,y*0.3,4)-0.5)*0.5,x,y));
    for (y=62;y<80;y++){ var hx=(x*7)%13; b.px(x,y,(hx<1)?P.s3:((y%5===0)?P.m2:(hash(x>>2,y>>2)<0.3?P.t3:P.s5))); }
    // Brüstung der Brücke, die nach rechts ansteigt; davor die Rampe aus Kaldrma
    var py=rd(88-t*12); for (y=py;y<py+7;y++) b.px(x,y,(y===py)?P.s6:((y===py+1)?P.s4:(((x+(y>>2)*3)%9===0)?P.s3:P.s5)));
    for (y=py+7;y<GY+2;y++) b.px(x,y,(hash(x>>1,y>>1)<0.4)?P.s3:P.s4); }
  // Licht vom Fluss her (heller Dunst in der Öffnung)
  M.fogBake(b,function(xx,yy){ return (xx>=x0 && xx<TARA.x0 && yy<GY)?0.25+(xx-x0)/(TARA.x0-x0)*0.2:0; },{col:tod==='day'?(w==='rain'?P.s3:P.s5):P.m2}); }
function taraTower(b){ var x0=TARA.x0, x1=TARA.x1, cx=x1+4, rr=x1+4-x0, x, y;
  for (x=x0;x<x1;x++){ var u=(x+0.5-cx)/rr, n=Math.sqrt(Math.max(0,1-u*u)), lit=0.6-u*0.3+n*0.1;
    for (y=TARA.top;y<GY+2;y++){ var row=Math.floor((y-TARA.top)/4), fy=(y-TARA.top)%4, col=Math.floor((Math.asin(clamp(u,-1,1))*rr*1.1+row*5.3)/7), c=ra(R('s1 s2 s3 s4 s5'),lit+(hash(col,row)-0.5)*0.3,x,y); if (fy===0) c=M.DN[c]; if (u<-0.94) c=M.DN[c]; b.px(x,y,c); } }
  for (x=x0-1;x<x1;x++){ b.px(x,TARA.top,P.s5); b.px(x,TARA.top+1,P.s2); }
  for (y=TARA.top-8;y<TARA.top;y++){ var ins=rd((TARA.top-y)*0.9); for (x=x0-1+ins;x<x1;x++) b.px(x,y,((x+y)%3===0)?P.m1:(y<TARA.top-5?P.s2:P.s3)); }
  b.rect(x0+10,TARA.top+14,2,5,P.k1); b.rect(x0+20,TARA.top+34,2,5,P.k1); b.rect(x0+8,TARA.top+52,2,5,P.k1); }

// ---------------------------------------------------------------- Häuser der Gasse: Steinwand, Holzobergeschoss, Plattendach mit breiter Traufe
function slabPx(x,y,eave,sd){ var row=Math.floor((eave-y)/3), fy=(eave-y)-row*3, off=hash(row,sd)*9, pw=4+Math.floor(hash(row+3,sd)*3), col=Math.floor((x+off)/pw), fx=(x+off)-col*pw, t=hash(col+sd*3,row);
  var c=t<0.14?P.m2:(t<0.5?P.s2:(t<0.82?P.s3:(t<0.92?P.m3:P.s1))); if (fy===0) c=(t<0.4)?P.m1:P.s1; else if (fy===2 && fx>0) c=M.UP[c]; if (fx===0 && fy>0) c=M.DN[c]; return c; }
function houses(b,tod){ var r=M.rng(11), x, y;
  var HS=[[0,60,30,'w'],[60,64,26,'s'],[124,60,32,'w'],[184,76,22,'w'],[260,56,30,'s'],[316,60,26,'w'],[376,32,34,'s']];   // [x, Breite, Oberkante, Obergeschoss: w=Holz, s=Stein]
  HS.forEach(function(h,hi){ var x0=h[0], x1=Math.min(OPEN.x0,h[0]+h[1]), top=h[2], sd=hi*13+5;
    // Obergeschoss
    for (y=top;y<64;y++) for (x=x0;x<x1;x++){ var c;
      if (h[3]==='w'){ c=((x-x0)%5===0)?P.w1:(hash(x,y>>2)<0.12?P.w3:P.w2); if (y===63) c=P.w0; if (((y-top)%9)===0) c=P.w1; }
      else { c=tex.ashlar(x+sd,y,R('s2 s3 s4 s5'),7,3); if (fbm(x*0.2,y*0.2,sd)>0.66) c=ra(R('s4 s5 s6'),0.6,x,y); }
      b.px(x,y,c); }
    for (var wi=x0+6;wi<x1-8;wi+=16){ var wy=top+6; if (wy+9>62) continue; b.rect(wi-1,wy-1,8,11,P.w0); b.rect(wi,wy,6,9,P.k2); b.vl(wi+3,wy,wy+8,P.w1); b.hl(wi,wi+5,wy+4,P.w1); b.rect(wi-3,wy-1,2,11,P.w2); b.rect(wi+7,wy-1,2,11,P.w2); b.hl(wi-1,wi+6,wy+10,P.s5); WINS.push([wi,wy,6,9,hash(wi,hi)]);
      for (var gx=wi;gx<wi+6;gx+=2) b.vl(gx,wy+5,wy+8,P.k1); }
    // breite Traufe mit Sparrenköpfen, darüber das Plattendach
    var eave=top-1, ridge=top-1-rd((x1-x0)*0.28);
    for (y=ridge;y<=eave;y++){ var tt=(y-ridge)/Math.max(1,eave-ridge), ins=rd((1-tt)*(x1-x0)*0.32); for (x=x0-3+ins;x<x1+3-ins;x++){ var c2=slabPx(x,y,eave,sd); if (y===ridge) c2=P.m1; b.px(x,y,c2); } }
    for (x=x0-3;x<x1+3;x++){ b.px(x,eave+1,P.w0); if ((x-x0)%4===0) b.px(x,eave+2,P.w1); dk(b,x,eave+3,2); }
    if (hash(hi,7)<0.7){ var cx=x0+rd((x1-x0)*(0.3+hash(hi,9)*0.4)); b.rect(cx,ridge-3,3,5,P.s3); b.hl(cx-1,cx+3,ridge-4,P.m1); CHIM.push([cx+1,ridge-5]); }
  });
  // Erdgeschoss: Steinmauer durchgehend bis zur Öffnung
  for (y=64;y<GY;y++) for (x=0;x<OPEN.x0;x++){ var c3=tex.ashlar(x,y,R('s1 s2 s3 s4'),8,4); if (y===64) c3=P.s5; if (y===65) c3=P.s2; b.px(x,y,c3); }
  for (x=0;x<OPEN.x0;x++) for (var k=0;k<6;k++) if (hash(x,k+20)<0.3-k*0.04) dk(b,x,GY-1-k,1); }
var CHIM=[];

// ---------------------------------------------------------------- Läden: Öffnung, Holzläden (oben Vordach, unten Auslage), Waren
function shopFront(b,s,i,tod,w){ var x0=s.x0, x1=s.x1, top=68, x, y, closed=closedAt(tod,i);
  b.rect(x0,top,x1-x0,GY-top,P.k1); for (y=top+1;y<GY;y++) for (x=x0+1;x<x1-1;x++) b.px(x,y,(y<top+10)?P.k2:(hash(x>>2,y>>2)<0.3?P.w0:P.k2));   // dunkles Inneres
  if (closed){ for (y=top;y<GY;y++) for (x=x0;x<x1;x++){ var c=((x-x0)%6===0)?P.w0:(((y-top)%10===0)?P.w1:P.w2); if (hash(x>>1,y>>3)<0.1) c=P.w3; b.px(x,y,c); } b.rect(rd((x0+x1)/2)-2,GY-16,4,3,P.m2); return; }
  // Vordach: hochgeklappter oberer Laden (schräg), Streben
  for (y=top-6;y<top;y++){ var o=top-y; for (x=x0-o;x<x1+o;x++) b.px(x,y,(y===top-6)?P.w4:(((x-x0)%7===0)?P.w1:P.w3)); }
  for (x=x0-6;x<x1+6;x++) dk(b,x,top,2); b.line(x0+2,top,x0-4,top-5,P.w1); b.line(x1-3,top,x1+3,top-5,P.w1);
  // Auslage: heruntergeklappter unterer Laden auf Böcken
  b.rect(x0-2,94,x1-x0+4,3,P.w4); b.hl(x0-2,x1+1,94,P.w5); b.rect(x0-1,97,x1-x0+2,9,P.w1); for (x=x0;x<x1;x+=8) b.vl(x,97,GY-1,P.w0);
  if (s.kind==='copper') copperGoods(b,s); else if (s.kind==='carpet') carpetGoods(b,s); else if (s.kind==='cards') cardsGoods(b,s); else if (s.kind==='cloth') clothGoods(b,s); else galleryGoods(b,s); }
function plate(b,cx,cy,r,lit){ b.ellipse(cx+0.5,cy+0.5,r,r,function(xx,yy){ var d=Math.hypot(xx-cx,yy-cy)/r, a=Math.atan2(yy-cy,xx-cx); if (d>0.84) return P.t1; if (d>0.7) return P.t4; var c=(xx-cx<-(yy-cy)*0.4)?P.t4:P.t3; if (Math.sin(a*6+d*9)>0.6 && d<0.6) c=P.t2; if (d<0.15) c=P.t5; return c; }); b.px(cx-rd(r*0.4),cy-rd(r*0.4),P.l0); }
function copperGoods(b,s){ var x0=s.x0, x1=s.x1;
  plate(b,x0+10,78,6); plate(b,x0+25,76,7); plate(b,x0+41,79,5); plate(b,x0+55,77,6); plate(b,x0+17,88,4); plate(b,x0+48,89,4);   // Kupferteller an der Rückwand
  plate(b,x0-6,82,5); plate(b,x1+4,84,4);                                                                                    // an den Pfosten
  for (var k=0;k<5;k++){ var dx=x0+6+k*13, by=94; dz(b,dx,by,k); }                                                          // Džezve und Kannen auf der Auslage
  b.rect(x0+50,90,10,4,P.t2); b.hl(x0+50,x0+59,90,P.t4); }
function dz(b,cx,by,k){ var col=R('t0 t1 t2 t3 t4 t5'), rows=k%2?[4,3,4,5,5]:[3,3,4,4,5,5], h=rows.length, top=by-h; for (var j=0;j<h;j++){ var wj=rows[j], x0=cx-(wj>>1); for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=col[4]; b.px(x0+i,top+j,c); } } for (var q=0;q<4;q++) b.px(cx+2+q,top+1-(q>>1),q>2?P.k2:P.w1); }
function carpetGoods(b,s){ var x0=s.x0, x1=s.x1, x, y, cols=[[P.r2,P.r1,P.y2,P.b0],[P.b0,P.c1,P.r2,P.s5],[P.r1,P.t2,P.y3,P.g2],[P.g2,P.g1,P.r2,P.y2]];
  b.hl(x0-4,x1+3,70,P.k1);                                                                                                  // Stange
  [[x0+2,16],[x0+19,16],[x0+36,15],[x0+52,16]].forEach(function(q,qi){ var cs=cols[qi%cols.length], kx=q[0], kw=q[1];
    for (y=71;y<92+(qi%2)*4;y++) for (x=kx;x<kx+kw;x++){ var u=x-kx, v=y-71, e=Math.min(u,kw-1-u,v), d=Math.abs(u-kw/2+0.5)+Math.abs((v%12)-6), c=cs[0]; if (e<1) c=cs[1]; else if (e<2) c=cs[2]; else if (d<3) c=cs[3]; else if (d<4) c=cs[2]; b.px(x,y,c); }
    for (x=kx;x<kx+kw;x+=2) b.px(x,92+(qi%2)*4,P.s4); });
  for (var k=0;k<4;k++){ var ry=94-4; b.ellipse(x0+8+k*16,ry,6,3,function(xx,yy){ return ((xx+yy)%3===0)?cols[k][1]:cols[k][0]; }); b.ellipse(x0+2+k*16,ry,2,3,cols[k][2]); }   // Rollen
  for (x=x0-8;x<x0-1;x++) for (y=76;y<106;y++){ var c2=((y>>2)&1)?P.r2:P.y2; if (x===x0-8||x===x0-2) c2=P.r1; b.px(x,y,c2); } }   // Kelim am Pfosten
function cardsGoods(b,s){ var x0=s.x0, x1=s.x1, x, y;
  b.rect(x0+4,70,x1-x0-8,8,P.w2); b.hl(x0+4,x1-5,70,P.w4); var sg='RAZGLEDNICE', sw=M.microWidth(sg); M.microText(b,sg,rd((x0+x1)/2-sw/2),71,P.s6);   // Schild
  // Wand voller Postkarten (vergilbt, kleine Brückenbilder), drinnen Regale mit Kisten
  for (var r=0;r<3;r++) for (var c=0;c<6;c++){ var px=x0+6+c*11, py=80+r*7; if (px+9>x1-4) continue; b.rect(px,py,9,6,(r+c)%3?P.s5:P.e4); b.rect(px+1,py+1,7,3,(r*3+c)%4?P.b3:P.e3); b.hl(px+1,px+7,py+4,P.a4); b.px(px+3,py+2,P.s5); b.px(px+4,py+1,P.s5); b.px(px+5,py+2,P.s5); }
  // Kiste mit alten Postkarten auf der Auslage (vor dem Laden)
  var bx=BOX; for (y=bx.top;y<bx.base;y++) for (x=bx.x0;x<bx.x1;x++){ var cc=((x-bx.x0)%7===0)?P.w0:(y===bx.top?P.w4:P.w2); b.px(x,y,cc); }
  for (x=bx.x0+1;x<bx.x1-1;x+=2){ var h=2+rd(hash(x,3)*3); b.rect(x,bx.top-h,2,h,hash(x,5)<0.5?P.e4:P.s5); b.px(x,bx.top-h,P.s6); }
  b.rect(bx.x0+2,bx.top+3,bx.x1-bx.x0-4,4,P.s5); M.microText(b,'1 KM',bx.x0+4,bx.top+3,P.k1);
  // Drehständer
  var rk=RACK, cx=rd((rk.x0+rk.x1)/2); b.vl(cx,rk.top-4,rk.base-1,P.m2); b.rect(cx-4,rk.base-2,9,2,P.m1);
  for (var rr=0;rr<4;rr++) for (var i=0;i<3;i++){ var qx=rk.x0+i*5, qy=rk.top+rr*10, qc=[P.s5,P.e4,P.s6,P.b4][(rr+i)%4]; b.rect(qx,qy,4,7,qc); b.rect(qx,qy+1,4,3,[P.b3,P.a4,P.g4,P.e3][(rr*3+i)%4]); b.px(qx+3,qy+6,P.k2); }
  // Hocker des Händlers mit Kaffeetässchen daneben
  var st=STOOL; b.rect(st[0]-5,st[1]-14,11,2,P.w3); b.hl(st[0]-5,st[0]+5,st[1]-14,P.w4); b.vl(st[0]-4,st[1]-12,st[1]-1,P.w1); b.vl(st[0]+4,st[1]-12,st[1]-1,P.w1); b.hl(st[0]-3,st[0]+3,st[1]-6,P.w1);
  b.rect(st[0]+9,st[1]-6,4,6,P.w2); b.hl(st[0]+9,st[0]+12,st[1]-6,P.w4); b.rect(st[0]+10,st[1]-9,2,2,P.s6); b.px(st[0]+12,st[1]-8,P.s5); }
function clothGoods(b,s){ var x0=s.x0, x1=s.x1, cols=[P.r3,P.y3,P.b2,P.g3,P.v3,P.r4,P.a4,P.t4]; CLOTH=[];
  b.hl(x0-4,x1+3,69,P.k1);
  for (var k=0;k<8;k++){ var cx=x0+3+k*8, len=16+rd(hash(k,2)*8); CLOTH.push([cx,70,6,len,cols[k%cols.length]]); for (var y=70;y<70+len;y++) for (var x=cx;x<cx+6;x++){ var c=cols[k%cols.length]; if ((y-70)%5===2) c=M.UP[c]; if (x===cx) c=M.DN[c]; if (y>66+len && (x+y)%2) c=P.s5; b.px(x,y,c); } }
  for (var j=0;j<6;j++){ var mx=x0+4+j*10; b.rect(mx,90,7,4,[P.s5,P.y2,P.r2,P.c3][j%4]); b.hl(mx,mx+6,90,P.s6); } }
function galleryGoods(b,s){ var x0=s.x0, x1=s.x1;
  [[x0+4,72,20,15],[x0+28,74,16,12],[x0+48,71,20,16]].forEach(function(q,qi){ M.prop.frame(b,q[0],q[1],q[2],q[3],{frame:R('w1 w2 w3'),fill:function(xx,yy){ var u=(xx-q[0])/q[2], v=(yy-q[1])/q[3], ar=Math.abs(u-0.5)*2; if (v>0.8) return qi===1?P.a3:P.a4; if (v>0.42+ar*ar*0.38 && ar<0.85) return (v>0.7?P.a3:P.b4); if (v>0.36+ar*ar*0.38 && ar<0.9) return P.s5; return qi===1?P.d4:P.b3; }}); });   // Bilder der Brücke
  b.rect(x0+10,90,52,4,P.s5); b.hl(x0+10,x0+61,90,P.s6); M.microText(b,'GALERIJA',x0+20,99,P.s5); }

// ---------------------------------------------------------------- Kaldrma der Gasse
function kaldrma(x,y,wet){ var k=lerp(0.6,1.2,(y-GY)/38), X=(x-160)/k, Z=(y-GY)/((k+0.6)/2), cs=5.4, gx=Math.floor(X/cs), gz=Math.floor(Z/(cs*0.8)), best=9, bt=0, bdx=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.5+(hash(gx+i,gz+j)-0.5)*0.55)*cs, cz=(gz+j+0.5+(hash(gz+j+7,gx+i)-0.5)*0.5)*cs*0.8, dx=(X-cx)/(cs*0.56), dz=(Z-cz)/(cs*0.42), d=dx*dx+dz*dz; if (d<best){ best=d; bt=hash(gx+i+31,gz+j); bdx=dx; bdy=dz; } }
  var ridge=((gz%8)+8)%8===3;
  if (best>(ridge?0.95:0.78)) return wet?P.m0:(hash(x,y)<0.5?P.s1:P.e1);
  var c=ridge?(bt<0.5?P.s4:P.s5):(bt<0.22?P.s2:(bt<0.62?P.s3:(bt<0.9?P.s4:P.e3)));
  if (bdy<-0.3 && bdx<0.35) c=M.UP[c]; else if (bdy>0.4 || bdx>0.6) c=M.DN[c];
  if (wet){ c=M.DN[c]; if (bdy<-0.35 && bdx>-0.5 && bdx<0.15) c=(bt<0.5)?P.s5:P.s4; } return c; }
function street(b,wet){ for (var y=GY;y<H;y++) for (var x=0;x<W;x++){ b.px(x,y,kaldrma(x,y,wet)); PAVE[y*W+x]=1; }
  for (var x2=0;x2<OPEN.x0;x2++){ dk(b,x2,GY,2); if (bayer(x2,GY+1)<0.6) dk(b,x2,GY+1,1); }
  // Rinne in der Mitte der Gasse
  for (x2=0;x2<W;x2++){ var ry=rd(126+Math.sin(x2*0.02)*1.5); dk(b,x2,ry,1); if (hash(x2,4)<0.4) dk(b,x2,ry+1,1); } }
// Traufen der Häuser auf der Gegenseite (vorn oben): dunkle Untersicht, Sparrenköpfe, Plattenkante; eine kahle Weinranke
function nearEaves(b){ var x, y; for (x=0;x<W;x++){ var e=rd(9+Math.sin(x*0.013)*2+(x>OPEN.x0?-14:0)); if (e<=0) continue;
    for (y=0;y<e;y++){ var c=(y<2)?((x+y)%5===0?P.s1:P.s2):(((x%7)<2)?P.w2:((y%3===0)?P.w0:P.k2)); b.px(x,y,c); }
    b.px(x,e,P.k1); if ((x%7)<2) b.px(x,e+1,P.w1); dk(b,x,e+1,1); dk(b,x,e+2,1); }
  var r=M.rng(4), vx=70, vy=10; for (var k=0;k<90;k++){ vx+=1; vy=10+Math.sin(k*0.2)*2+(k>60?(k-60)*0.2:0); b.px(rd(vx),rd(vy),k%6===0?P.e2:P.w1); if (r()<0.1){ for (var q=1;q<4+r()*4;q++) b.px(rd(vx+q*0.3),rd(vy+q),P.w1); } } }
// ---------------------------------------------------------------- Touristen (gemalt) und Laternen
function tourist(b,x,by,k,w){ var poncho=w==='rain', body=poncho?(k?P.y3:P.b2):(k?P.r2:P.c2), leg=k?P.c1:P.e1;   // klein, in der Ferne (~22 px)
  b.rect(x,by-7,1,7,leg); b.rect(x+2,by-7,1,7,M.DN[leg]);
  if (poncho) b.poly([[x-3,by-6],[x+5,by-6],[x+3,by-17],[x-1,by-17]],function(xx,yy){ return xx<x+1?M.UP[body]:body; }); else { b.rect(x-1,by-16,5,9,body); b.vl(x-1,by-16,by-8,M.UP[body]); }
  b.rect(x,by-20,3,3,P.p3); b.hl(x,x+2,by-21,poncho?M.DN[body]:(k?P.y2:P.h1));
  if (!poncho && k===0){ b.rect(x+3,by-14,2,2,P.k1); }                                                                  // Kamera
  if (k===1) b.rect(x-3,by-15,2,5,P.e2); }                                                                            // Rucksack
function lantern(b,l,lit){ var x=l.x, y=l.y; b.line(x-4,y-2,x,y-2,P.k1); b.vl(x,y-2,y,P.k1); b.poly([[x-2,y+1],[x+3,y+1],[x+2,y+7],[x-1,y+7]],lit?P.y4:P.m2); b.hl(x-2,x+3,y,P.k1); b.hl(x-1,x+2,y+8,P.k1); b.vl(x,y+1,y+7,P.k1); if (lit){ b.px(x+1,y+3,P.l1); } }

// ---------------------------------------------------------------- Bild
var BASE=null, LASTB=null, LIT=[];
function paint(S,GS,tod){ var w=weaOf(GS), wet=w==='rain', b=new M.Buf(W,H,T), x, y; SKYM.fill(0); PAVE.fill(0); WINS=[]; CHIM=[]; CLOTH=[];
  bridgeOpening(b,tod,w); houses(b,tod); taraTower(b);
  SH.forEach(function(s,i){ shopFront(b,s,i,tod,w); });
  street(b,wet);
  if (tod!=='dawn' && tod!=='night') TOUR.forEach(function(t){ tourist(b,t[0],t[1],t[2],w); });
  LAMPS.forEach(function(l){ lantern(b,l,false); });
  nearEaves(b);
  var sky=new M.Buf(W,H,P.k0); paintSky(sky,tod,w); for (var q=0;q<W*H;q++) if (b.d[q]===T){ b.d[q]=sky.d[q]; SKYM[q]=1; }
  // Licht: die Gasse liegt im Schatten der Traufen, Licht fällt schräg auf die Pflastermitte; nasse Steine glänzen
  var sunny=tod==='day'&&(w==='bura'||w==='calm'||w==='frost');
  M.light(b,M.lf.sum(M.lf.band(0,30,-0.2,0),M.lf.band(GY,GY+10,-0.5,0),sunny?M.lf.band(118,144,0,0.25):M.lf.k(0)),0,0,function(xx,yy){ return !SKYM[yy*W+xx] && xx<OPEN.x0; });
  if (wet) for (y=GY+2;y<H;y++) for (x=0;x<W;x++){ if (fbm(x*0.06,y*0.3,4)>0.64 && bayer(x,y)<0.3){ var sy=GY-(y-GY)*1.2; var sc=b.get(x,rd(sy)); if (sc!==T) b.px(x,y,M.DN[sc]); } }
  BASE=b.clone(); LIT=lightsFor(tod);
  shade(b,0,0,todKey(tod,w),LIT,function(xx,yy){ return SKYM[yy*W+xx]===1; });
  if (tod!=='day'){ LAMPS.forEach(function(l){ lantern(b,l,true); }); WINS.forEach(function(wn){ if (wn[4]<0.6) return; for (var yy=wn[1];yy<wn[1]+wn[3];yy++) for (var xx=wn[0];xx<wn[0]+wn[2];xx++){ var c=BASE.get(xx,yy); if (c===P.k2) b.px(xx,yy,bayer(xx,yy)<0.5?P.y4:P.y3); } }); }
  LASTB=b; return b; }

// ---------------------------------------------------------------- Ebenen: die Kiste mit Postkarten (Figuren gehen davor vorbei)
function layers(S,GS,tod){ var w=weaOf(GS), bx=BOX, L=M.layer(bx.x0-1,bx.top-6,bx.x1-bx.x0+2,bx.base-bx.top+8,bx.base+1), wr=M.lw(L);
  for (var y=bx.top-6;y<bx.base+1;y++) for (var x=bx.x0-1;x<bx.x1+1;x++){ var c=LASTB?LASTB.get(x,y):T; if (c!==T && y>=bx.top-5) wr.px(x,y,c); }
  return [L]; }

// ---------------------------------------------------------------- Bewegung: Tücher wehen (Bura), Rauch, Laternen, Regen
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, w=weaOf(GS), k=todKey(tod,w), tint=k?levels(k)[0]:null;
  if (!closedAt(tod,3)) CLOTH.forEach(function(c,i){ var amp=(w==='bura')?3:0.6; for (var y=c[1];y<c[1]+c[3];y++){ var u=(y-c[1])/c[3], off=rd(Math.sin(t*(w==='bura'?7:2)+i+u*3)*amp*u); for (var x=c[0];x<c[0]+c[2];x++){ var X=x+off-cam; if (X<0||X>=320) continue; var col=c[4]; if ((y-c[1])%5===2) col=M.UP[col]; if (x===c[0]) col=M.DN[col]; fb.px(X,y,tint?M.tintPx(tint,col,X,y):col); } } });
  CHIM.forEach(function(ch,i){ for (var q=0;q<5;q++){ var ph=((t*0.25+q*0.2+i*0.3)%1), sx=rd(ch[0]+ph*(w==='bura'?10:2)+Math.sin(t+q)*1)-cam, sy=rd(ch[1]-ph*10); if (sx<0||sx>=320||sy<0) continue; if (bayer(sx,sy)<0.6-ph*0.5) fb.px(sx,sy,tod==='day'?P.s5:P.m2); } });
  if (tod!=='day') LAMPS.forEach(function(l,li){ var lx=l.x+1-cam; if (lx<-10||lx>330) return; M.glow(fb,lx,l.y+4,7,t+li,0.22); });
  if (w==='bura') M.scn.buraDebris(fb,t,110,140,cam); }
function front(fb,v,S,GS){ var w=weaOf(GS), tod=v.tod; if (w==='rain') M.rain(fb,v.t,{n:80,col:tod==='day'?P.m3:P.n2,col2:tod==='day'?P.m4:P.n3}); }
// Geistersicht: auf den Pflastersteinen ein Strom von Schritten (blasse Fußabdrücke), zur Brücke hin
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  for (var i=0;i<70;i++){ var lane=hash(i,1), x=Math.floor(((hash(i,2)*520+t*(6+lane*5))%520))-20, y=rd(114+lane*22+Math.sin(x*0.05+i)*2), X=x-cam, step=(Math.floor((x+i*3)/7)&1);
    if (X<1||X>317||y<108||y>141) continue; var a=0.35+0.3*Math.sin(t*0.9+i); if (bayer(X,y)>a) continue;
    var yy=y+(step?2:0); fb.px(X,yy,P.x4); fb.px(X+1,yy,P.x3); fb.px(X,yy+1,P.x3); fb.px(X+2,yy,P.x2); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<112||y>138||x<6||x>474) return false;
  if (x>=BOX.x0-2 && x<=BOX.x1+2 && y<BOX.base+3) return false;
  if (Math.abs(x-STOOL[0])<8 && y<STOOL[1]+3) return false;
  return true; }
M.defineArt('kujundziluk',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,weaOf(GS)); if (!k) return null; return levels(k)[tod==='day'?0:1].a; },
  spots:{
    exit:[0,80,10,64],
    to_bridge:[W-14,60,14,84],
    shop:[SH[2].x0,62,SH[2].x1-SH[2].x0,GY-62],
    postcards:[BOX.x0-2,BOX.top-6,BOX.x1-BOX.x0+4,BOX.base-BOX.top+6],
    copper:[SH[0].x0-10,68,SH[0].x1-SH[0].x0+20,28],
    carpets:[SH[1].x0-9,68,SH[1].x1-SH[1].x0+12,38],
    cobbles:[60,128,300,16],
    tourists:[TOUR[0][0]-6,TOUR[0][1]-24,TOUR[1][0]-TOUR[0][0]+14,26]
  },
  stands:{ exit:[8,124,'L'], to_bridge:[470,124,'R'], shop:[236,118,'B'], postcards:[196,118,'B'], copper:[56,116,'B'], carpets:[132,116,'B'], cobbles:[200,130,'B'], tourists:[424,114,'B'] },
  actorPos:{ haendler:[STOOL[0],STOOL[1],'L','haendler',false,'sit'] },
  start:[22,122,'R'], entries:{ map:[14,122,'R'], starimost:[466,122,'L'] }
});
})(M);
