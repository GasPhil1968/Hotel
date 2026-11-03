/* ===== rooms/art/skloniste.js — Der Schutzraum unter Haus 7: im Krieg die Kellerschule =====
   Ein niedriger Betonkeller. Links führt die Treppe an der Wand herunter, oben aus der Öffnung fällt (wenn die Stahltür
   offen steht) ein Rest Licht aus der Halle; am Fuß der Treppe Sandsäcke, unter der Treppe Decken und Wasserkanister.
   An der Rückwand die Tafel auf ihrem Gestell, davor das Lehrerpult mit Schublade und Handglocke, an der Wand die alte
   elektrische Klingel. In drei Reihen die alten Schulbänke (Pult und Bank in einem, die Kinder sahen nach links zur Tafel).
   An der Rückwand vergilbte Kinderzeichnungen mit Reißzwecken: Straßenbahnen mit der „3“, Sonnen, Häuser. Rechts der
   Blechschrank mit Vorhängeschloss (S.cabinetOpen), der Ofen aus einem Ölfass mit Rohr, Rohre unter der Decke,
   eine nackte Glühbirne (S.lit). Würdevoll und still: Staub, sonst nichts. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
var VP=[160,62], RECT=[56,30,264,98], F=80, FY=98;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};

function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function p3(X,Y,Z){ var q=R3.p(X,Y,Z); return [q[0],q[1]]; }
function q4(X0,X1,Y0,Y1,Z){ return [p3(X0,Y0,Z),p3(X1,Y0,Z),p3(X1,Y1,Z),p3(X0,Y1,Z)]; }
function wq(sd,u0,u1,v0,v1){ return M.wallQuad(SPEC,sd,u0,u1,v0,v1); }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
// Schilderschrift: Haken über ČŠŽ und Strich über Ć eine Zeile höher
function sign(b,s,x,y,c){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch){ var base={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'}[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') b.px(cx+1,y-1,c); else if (ch==='Ć') b.px(cx+2,y-1,c); else if (ch==='Đ') b.px(cx,y+2,c); cx+=w+1; }); return cx; }

// ---------------------------------------------------------------- Lage der Dinge
var ST={X0:56,X1:84,Z0:0,Z1:46,Y0:34,n:10};          // Treppe an der linken Wand (oben hinten -> unten vorn)
var BOARD={x0:72,x1:128,y0:36,y1:80,leg:104};        // Tafel auf dem Gestell (vor der Rückwand)
var DESK={X0:112,X1:140,Z0:26,Z1:36,Y0:84};          // Lehrerpult
var ROWS=[158,188,218];                              // Bankreihen (Raum-X)
var UNITS=[10,30,50];                                // Bänke je Reihe (Tiefe Z, die vorderste ist die erste)
var CAB={u0:4,u1:24,v0:40,v1:98};                    // Blechschrank (rechte Wand)
var STOVE={X:244,Z:34};
var BULB={x:176,y0:4,y1:38};
var BELL={x:140,y:40};
var CACHE={};

// ---------------------------------------------------------------- Texturen: Beton mit Schalungsabdrücken, Kalkanstrich, Feuchtigkeit
function concrete(u,v,x,y){ var f=fbm(u*0.04,v*0.05), c=f>0.58?P.s2:(f>0.36?P.s3:P.s4); if (((v+3)%16)<1) c=P.s2; if ((Math.floor(u)%37)===0 && v>4) c=P.s2;
  var damp=fbm(u*0.05+9,v*0.03)+(v-30)/120; if (damp>0.78 && bayer(x,y)<(damp-0.78)*4) c=M.DN[c];
  if (v>58 && bayer(x,y)<(v-58)/60) c=M.DN[c]; if (hash(Math.floor(u/2),Math.floor(v/2))<0.02) c=P.s1; return c; }
function floorCol(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, g=fbm(X*0.03,Z*0.05), c=g>0.6?P.s2:(g>0.35?P.s3:P.s2);
  if (((Z+2)%20)<0.5) c=P.s1; if (fbm(X*0.1+5,Z*0.1)>0.7 && bayer(x,y)<0.5) c=P.s1; if (hash(x,y)<0.03) c=P.s4; return c; }
function ceilCol(xb,d,x,y){ var t=(VP[1]-RECT[1])/(VP[1]-y), Z=(1/t-1)*F, f=fbm(xb*0.025,Z*0.05), c=(f>0.6 && bayer(x,y)<(f-0.6)*3)?P.s2:P.s3; if (((Z+6)%18)<0.7) c=P.s2; return c; }

// ---------------------------------------------------------------- Treppe herunter (links), Öffnung oben, Sandsäcke
function stepAt(i){ var dz=(ST.Z1-ST.Z0)/ST.n, dy=(FY-ST.Y0)/ST.n; return {z0:ST.Z0+i*dz, z1:ST.Z0+(i+1)*dz, y:ST.Y0+i*dy+dy, dy:dy}; }
function paintStairs(b,glow){ var i, s;
  // Öffnung in der Decke, durch die die Treppe nach oben führt; dahinter (offen) ein Rest Licht aus der Halle
  var hole=[p3(ST.X0,RECT[1],0),p3(ST.X1+6,RECT[1],0),p3(ST.X1+6,RECT[1],16),p3(ST.X0,RECT[1],16)];
  b.poly([[hole[0][0],0],[hole[1][0]+4,0],hole[1],hole[0]],glow?P.s4:P.k1); b.poly([[hole[0][0]-2,0],[hole[0][0]+8,0],[hole[0][0]+6,hole[0][1]],[hole[0][0]-2,hole[0][1]]],P.s1);
  if (glow){ for (var y=0;y<hole[0][1];y++) for (var x=rd(hole[0][0]);x<rd(hole[1][0])+4;x++){ if (bayer(x,y)<0.3+y/80) b.px(x,y,P.s5); } }
  CACHE.hole=[rd(hole[0][0]),0,rd(hole[1][0]-hole[0][0])+4,rd(hole[0][1])];
  // Seitenwange zur Raummitte hin (darunter der Platz für Decken und Kanister)
  var wange=[p3(ST.X1,ST.Y0,ST.Z0),p3(ST.X1,FY-(FY-ST.Y0)/ST.n,ST.Z1),p3(ST.X1,FY,ST.Z1),p3(ST.X1,FY,ST.Z0)];
  b.poly(wange,function(x,y){ var c=(fbm(x*0.1,y*0.1)>0.55)?P.s2:P.s3; if (bayer(x,y)<0.3) c=M.DN[c]; return c; });
  // Stufen: Setzstufe (vorn) und, unterhalb der Augenhöhe, Trittstufe
  for (i=0;i<ST.n;i++){ s=stepAt(i);
    var top=[p3(ST.X0,s.y-s.dy,s.z0),p3(ST.X1,s.y-s.dy,s.z0),p3(ST.X1,s.y-s.dy,s.z1),p3(ST.X0,s.y-s.dy,s.z1)];
    if (s.y-s.dy>VP[1]) b.poly(top,(i%2)?P.s3:P.s4);
    var rise=[p3(ST.X0,s.y-s.dy,s.z1),p3(ST.X1,s.y-s.dy,s.z1),p3(ST.X1,s.y,s.z1),p3(ST.X0,s.y,s.z1)];
    b.poly(rise,function(x,y){ return (hash(x,y)<0.2)?P.s1:P.s2; });
    var e0=p3(ST.X0,s.y-s.dy,s.z1), e1=p3(ST.X1,s.y-s.dy,s.z1); b.line(rd(e0[0]),rd(e0[1]),rd(e1[0]),rd(e1[1]),P.s5); }
  // Handlauf (Rohr) auf Pfosten an der offenen Seite
  var h0=p3(ST.X1,ST.Y0-12,ST.Z0+2), h1=p3(ST.X1,FY-18,ST.Z1); b.line(rd(h0[0]),rd(h0[1]),rd(h1[0]),rd(h1[1]),P.m3); b.line(rd(h0[0]),rd(h0[1])+1,rd(h1[0]),rd(h1[1])+1,P.m1);
  for (i=1;i<ST.n;i+=3){ s=stepAt(i); var a=p3(ST.X1,s.y-s.dy-12,s.z1), c=p3(ST.X1,s.y-s.dy,s.z1); b.vl(rd(a[0]),rd(a[1]),rd(c[1]),P.m2); }
  // unter der Treppe: gefaltete graue Decken, Wasserkanister
  var bx=p3(ST.X1,FY,ST.Z1-14); for (var k=0;k<4;k++){ var yy=rd(bx[1])-4-k*3; b.rect(rd(bx[0])-22,yy,18,3,[P.m2,P.c1,P.m1,P.e2][k]); b.hl(rd(bx[0])-22,rd(bx[0])-5,yy,[P.m3,P.c2,P.m2,P.e3][k]); }
  CACHE.stairFoot=p3(ST.X1,FY,ST.Z1); }
function sandbag(b,x,y,w,h,c){ b.ellipse(x+w/2,y+h/2,w/2,h/2,function(xx,yy){ var u=(yy-y)/h, v=(xx-x)/w; var cc=u<0.25?P.s4:(u<0.6?P.e4:(u<0.85?P.e3:P.e2)); if (((xx*3+yy)%5)===0) cc=M.DN[cc]; if (Math.abs(v-0.5)>0.42) cc=P.e2; return cc; }); b.hl(x+2,x+w-3,y+h-1,P.e1); b.px(x+2,y+1,P.e2); b.px(x+w-3,y+1,P.e2); }
function paintSandbags(b){ var f=CACHE.stairFoot, x0=rd(f[0])+2, by=rd(f[1])+2;
  // Wall aus Sandsäcken neben dem Treppenfuß, vier Lagen, versetzt, oben ein eingesunkener Sack
  for (var r=0;r<4;r++) for (var k=0;k<3-((r===3)?1:0);k++){ var w=14, h=7, x=x0+k*13+(r%2)*6-6, y=by-7-r*6; sandbag(b,x,y,w,h); }
  for (k=0;k<2;k++) sandbag(b,x0-22+k*10,by-6,12,6); CACHE.sand=[x0-24,by-31,52,33]; }

// ---------------------------------------------------------------- Tafel auf Gestell, Lehrerpult mit Glocke, elektrische Klingel
function paintBoard(b){ var x0=BOARD.x0, x1=BOARD.x1, y0=BOARD.y0, y1=BOARD.y1, x, y;
  // Gestell: zwei Holzbeine, Querstrebe, Kreideleiste
  [[x0+4,x0-2],[x1-5,x1+1]].forEach(function(l){ b.line(l[0],y0-6,l[1],BOARD.leg,P.w2); b.line(l[0]+1,y0-6,l[1]+1,BOARD.leg,P.w1); });
  b.line(x0+10,y0-6,x0+12,BOARD.leg-6,P.w0); b.hl(x0+2,x1-2,BOARD.leg-14,P.w1);
  b.rect(x0-2,y0-2,x1-x0+4,y1-y0+4,P.w2); b.hl(x0-2,x1+1,y0-2,P.w4); b.vl(x0-2,y0-2,y1+1,P.w3); b.vl(x1+1,y0-2,y1+1,P.w0); b.hl(x0-2,x1+1,y1+1,P.w1);
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var f=fbm(x*0.08,y*0.12), c=(f>0.6)?P.g1:P.g0; if (f>0.68 && bayer(x,y)<0.3) c=P.m1; if (hash(x,y)<0.02) c=P.k1; b.px(x,y,c); }
  // abgewischte Kreide: blasse Schlieren, nur ein Rest unten rechts lesbar: das Datum
  for (var i=0;i<5;i++){ var sy=y0+6+i*8; for (x=x0+4;x<x1-6;x++) if (Math.sin(x*0.2+i)>0.6 && bayer(x,sy)<0.35) b.px(x,sy+Math.round(Math.sin(x*0.07+i)),P.m1); }
  M.microText(b,'1993',x1-19,y1-7,P.m2);
  b.rect(x0+2,y1+2,x1-x0-4,2,P.w3); b.hl(x0+2,x1-3,y1+2,P.w4); b.rect(x0+10,y1+1,4,1,P.s6); b.rect(x0+30,y1+1,3,1,P.s5); b.rect(x0+44,y1+1,5,1,P.w1);
  CACHE.board=[x0,y0,x1,y1]; }
function paintDesk(b){ var D=DESK, p=R3.p;
  R3.box(b,D.X0,D.X1,D.Y0,FY,D.Z0,D.Z1,{
    top:function(x,y){ return ((x>>2)&1)?P.w3:P.w4; },
    right:function(x,y){ return (bayer(x,y)<0.4)?P.w1:P.w2; },
    front:function(x,y){ var q=R3.p(D.X0,D.Y0,D.Z1), z=R3.p(D.X1,FY,D.Z1), ly=(y-q[1])/(z[1]-q[1]), lx=(x-q[0])/(z[0]-q[0]); if (ly<0.06) return P.w4; if (ly<0.32 && lx>0.12 && lx<0.88){ if (ly<0.09||ly>0.29) return P.w1; return (Math.abs(lx-0.5)<0.05 && Math.abs(ly-0.2)<0.07)?P.y3:P.w3; }
      if (lx>0.3 && lx<0.7 && ly>0.38) return P.k1; return (((x+y)%7)===0)?P.w1:P.w2; } });
  // Handglocke, Klassenbuch, Kreideschachtel, Lineal
  var g=p(D.X0+8,D.Y0,D.Z0+5), gx=rd(g[0]), gy=rd(g[1]); b.poly([[gx-3,gy],[gx+3,gy],[gx+2,gy-4],[gx-2,gy-4]],P.y3); b.hl(gx-3,gx+3,gy,P.y2); b.px(gx-1,gy-3,P.y5); b.vl(gx,gy-8,gy-5,P.w2); b.px(gx,gy-9,P.w3); CACHE.handbell=[gx,gy];
  var bk=p(D.X0+16,D.Y0,D.Z0+3); b.poly([[bk[0],bk[1]],[bk[0]+9,bk[1]],[bk[0]+10,bk[1]+2],[bk[0]+1,bk[1]+2]],P.r1); b.hl(rd(bk[0])+1,rd(bk[0])+9,rd(bk[1]),P.r2); b.hl(rd(bk[0])+1,rd(bk[0])+9,rd(bk[1])+2,P.s5);
  var ch=p(D.X1-6,D.Y0,D.Z0+6); b.rect(rd(ch[0]),rd(ch[1])-2,4,2,P.s5); b.px(rd(ch[0])+1,rd(ch[1])-3,P.s6);
  var kn=p(D.X0,FY,D.Z1), kx=p(D.X1,D.Y0+4,D.Z1); CACHE.under=[rd(kn[0]+(kx[0]-kn[0])*0.32),rd(kx[1])+6,rd((kx[0]-kn[0])*0.36),rd(kn[1]-kx[1])-6];
  // unter dem Pult (hinten an der Rückseite festgeklemmt): ein flaches Blechkästchen
  var u=CACHE.under; b.rect(u[0]+2,u[1]+3,u[2]-4,3,P.m2); b.hl(u[0]+2,u[0]+u[2]-3,u[1]+3,P.m3); b.px(u[0]+u[2]-4,u[1]+4,P.r2); }
function paintBellbox(b){ var x=BELL.x, y=BELL.y; b.rect(x-4,y+5,9,5,P.m1); b.hl(x-4,x+4,y+5,P.m2); b.ellipse(x,y+1,5,4,function(xx,yy){ return yy<y?P.y3:P.y2; }); b.ellipse(x,y+1,5,4,undefined); b.hl(x-5,x+5,y+3,P.y1); b.px(x-2,y-1,P.y5);
  b.line(x+3,y+5,x+6,y+3,P.k1); b.px(x+6,y+2,P.m3); b.line(x,y+10,x,y+30,P.k2); b.line(x,y+30,x-30,y+30,P.k2); CACHE.bellbox=[x-6,y-4,13,15]; }

// ---------------------------------------------------------------- Kinderzeichnungen
function drawing(b,x,y,w,h,kind,seed){ var r=M.rng(seed), i;
  var paper=(hash(seed,1)<0.5)?P.e4:P.s4; b.rect(x,y,w,h,paper); b.hl(x,x+w-1,y,M.UP[paper]); b.vl(x+w-1,y,y+h-1,P.e3); if (hash(seed,2)<0.5) b.px(x+w-1,y+h-1,P.e2);
  for (i=0;i<w*h/9;i++){ var fx=x+Math.floor(r()*w), fy=y+Math.floor(r()*h); b.px(fx,fy,P.e3); }   // Vergilbung, Flecken
  if (kind==='tram'){ var ty=y+h-7; b.rect(x+2,ty-4,w-5,5,P.r3); b.hl(x+2,x+w-4,ty-4,P.r4); for (i=0;i<3;i++) b.rect(x+3+i*4,ty-3,2,2,P.b3); b.px(x+4,ty+1,P.k1); b.px(x+w-6,ty+1,P.k1); b.line(x+w/2,ty-5,x+w/2+2,y+2,P.k2); b.hl(x+1,x+w-2,y+2,P.k2); b.px(x+w-5,ty-3,P.y3); M.microText(b,'3',x+w-6,ty-9>y?ty-9:y+1,P.k1); b.hl(x+1,x+w-2,ty+2,P.m1); }
  else if (kind==='sun'){ var cx=x+w/2, cy=y+h/2-1; b.ellipse(cx,cy,3,3,P.y4); for (i=0;i<8;i++){ var a=i/8*Math.PI*2; b.px(rd(cx+Math.cos(a)*5),rd(cy+Math.sin(a)*5),P.y3); } b.hl(x+1,x+w-2,y+h-2,P.g4); }
  else if (kind==='house'){ var hx=x+3, hy=y+h-8; b.rect(hx,hy,w-7,6,P.s5); b.vl(hx,hy,hy+5,P.k2); b.vl(hx+w-8,hy,hy+5,P.k2); b.line(hx-1,hy,hx+(w-7)/2,hy-4,P.r3); b.line(hx+(w-7)/2,hy-4,hx+w-7,hy,P.r3); b.rect(hx+2,hy+2,2,2,P.b3); b.rect(hx+w-11,hy+3,2,3,P.w2); b.ellipse(x+w-3,y+3,1.5,1.5,P.y4); }
  else if (kind==='tower'){ b.rect(x+3,y+2,5,h-4,P.m3); for (i=0;i<4;i++){ b.px(x+4,y+4+i*3,P.y3); b.px(x+6,y+4+i*3,P.b3); } b.rect(x+w-6,y+5,3,h-7,P.m2); b.hl(x+1,x+w-2,y+h-2,P.g4); b.px(x+w-3,y+2,P.y4); }
  else if (kind==='family'){ for (i=0;i<3;i++){ var fx2=x+3+i*4, fh=i===2?4:6; b.px(fx2,y+h-fh-3,P.k2); b.vl(fx2,y+h-fh-2,y+h-3,(i===1)?P.r3:P.b2); b.px(fx2-1,y+h-2,P.k2); b.px(fx2+1,y+h-2,P.k2); } b.ellipse(x+w-3,y+3,1.5,1.5,P.y4); }
  b.px(x+(w>>1),y,P.r3); b.px(x+(w>>1),y-1,P.m3); }  // Reißzwecke
function paintDrawings(b){ var list=[[150,38,16,12,'tram',1],[170,42,13,11,'sun',2],[188,37,15,13,'house',3],[207,40,18,12,'tram',4],[154,54,12,12,'tower',5],[171,57,16,11,'family',6],[192,55,14,11,'sun',7],[211,57,15,12,'house',8],[229,44,12,11,'tram',9]];
  list.forEach(function(d){ drawing(b,d[0],d[1],d[2],d[3],d[4],d[5]*7); });
  CACHE.drawings=[146,34,98,36]; }

// ---------------------------------------------------------------- Schulbänke (Pult und Bank in einem, Blick nach links)
function benchDesk(b,L,W1){ var t0=L(-30,-28), t1=L(-8,-25); b.line(t0[0],t0[1],t1[0],t1[1],W1[4]); b.line(t0[0],t0[1]+1,t1[0],t1[1]+1,W1[2]); b.line(t0[0],t0[1]+2,t1[0],t1[1]+2,W1[1]);
  var sh=L(-29,-19), sh1=L(-9,-19); b.line(sh[0],sh[1],sh1[0],sh1[1],W1[1]); var fr=L(-30,-26), fr1=L(-30,-18); b.line(fr[0],fr[1],fr1[0],fr1[1],W1[1]); var fr2=L(-29,-26), fr3=L(-29,-18); b.line(fr2[0],fr2[1],fr3[0],fr3[1],W1[2]);
  var ink=L(-24,-29); b.px(ink[0],ink[1],P.k1); }
function benchUnit(b,X,Z,lit){ var p=R3.p, k=1+Z/F, s=k*0.62;
  // in Bildkoordinaten relativ zum Fußpunkt der Sitzfläche (Kind sitzt mit Hüfte bei sx, Füße bei sy)
  var q=p(X,FY,Z), sx=rd(q[0]), sy=rd(q[1]);
  function L(dx,dy){ return [rd(sx+dx*s),rd(sy+dy*s)]; }
  var W1=R('w0 w1 w2 w3 w4'), I=R('k1 m0 m1 m2');
  // Eisengestell (Seitenwange): Kufe am Boden, Stützen zu Pult und Bank
  var k0=L(-30,0), k1=L(10,0); b.line(k0[0],k0[1],k1[0],k1[1],I[1]);
  var a=L(-26,0), a2=L(-24,-26); b.line(a[0],a[1],a2[0],a2[1],I[1]); var c0=L(2,0), c2=L(0,-14); b.line(c0[0],c0[1],c2[0],c2[1],I[1]); var d0=L(-24,-10), d2=L(0,-10); b.line(d0[0],d0[1],d2[0],d2[1],I[0]);
  // Pult: schräge Platte (zum Kind hin abfallend), Ablage darunter, Tintenfassloch
  benchDesk(b,L,W1);
  // Bank: Sitz und Lehne
  var s0=L(-6,-15), s1=L(10,-15); b.line(s0[0],s0[1],s1[0],s1[1],W1[3]); b.line(s0[0],s0[1]+1,s1[0],s1[1]+1,W1[1]);
  var r0=L(9,-15), r1=L(12,-34); b.line(r0[0],r0[1],r1[0],r1[1],W1[2]); b.line(r0[0]+1,r0[1],r1[0]+1,r1[1],W1[1]); var rb=L(4,-30), rb1=L(13,-30); b.line(rb[0],rb[1],rb1[0],rb1[1],W1[3]); var rb2=L(5,-25), rb3=L(12,-25); b.line(rb2[0],rb2[1],rb3[0],rb3[1],W1[2]);
  return {sx:sx,sy:sy,s:s}; }
function paintBenches(b){ var seats=[];
  // von hinten nach vorn malen
  for (var ui=0;ui<UNITS.length;ui++) for (var ri=0;ri<ROWS.length;ri++){ var u=benchUnit(b,ROWS[ri],UNITS[ui]); if (ui===UNITS.length-1) seats.push([u.sx,u.sy]); else if (ui===1) seats.push([u.sx,u.sy]); }
  CACHE.seats=seats; }

// ---------------------------------------------------------------- Blechschrank, Ofen, Rohre, Kanister, Glühbirne
function paintCabinet(b,S){ var C=CAB, q=wq('R',C.u0,C.u1,C.v0,C.v1);
  b.poly(wq('R',C.u0-1,C.u1+1,C.v0-2,C.v1),P.m0);
  if (S.cabinetOpen){ b.poly(q,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.k1; var lv=(w.v-C.v0)/(C.v1-C.v0); if (Math.abs((lv*4)%1)<0.06) return P.m2; return (lv<0.25)?P.k2:P.k1; });
    // Fächer: alte Schulhefte, eine Schachtel Kreide, ein Globus, das Klassenbuch
    for (var sh=0;sh<4;sh++){ var v=C.v0+sh*14+12; for (var k=0;k<6;k++){ var u0=C.u0+2+k*3, top=M.wallPt(SPEC,'R',u0,v-6-(k%3)), bot=M.wallPt(SPEC,'R',u0,v); b.line(rd(top[0]),rd(top[1]),rd(bot[0]),rd(bot[1]),[P.b1,P.r2,P.e3,P.s5,P.g2,P.y2][(k+sh)%6]); } }
    var gl=M.wallPt(SPEC,'R',C.u0+10,C.v0+8); b.ellipse(gl[0],gl[1],3,3,function(x,y){ return (x+y)%3?P.b2:P.g3; });
    // offene Türflügel
    b.poly(wq('R',C.u0-8,C.u0-1,C.v0,C.v1),function(x,y){ return (x%3===0)?P.m2:P.m3; }); }
  else { b.poly(q,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.m2; var lu=(w.u-C.u0)/(C.u1-C.u0), lv=(w.v-C.v0)/(C.v1-C.v0), c=(fbm(x*0.2,y*0.1)>0.6)?P.g1:P.g2; if (Math.abs(lu-0.5)<0.04) c=P.k2; if (lu<0.05||lu>0.95||lv<0.03) c=P.g3; if (lv>0.3&&lv<0.36&&(Math.floor(w.u*2)%2)) c=P.g0; if (fbm(x*0.6,y*0.4)>0.72) c=P.t1; return c; });
    var hp=M.wallPt(SPEC,'R',(C.u0+C.u1)/2-1,C.v0+30); b.rect(rd(hp[0])-1,rd(hp[1]),3,4,P.y2); b.hl(rd(hp[0])-1,rd(hp[0])+1,rd(hp[1]),P.y4); b.px(rd(hp[0]),rd(hp[1])-2,P.m3); b.px(rd(hp[0])-1,rd(hp[1])-1,P.m3); b.px(rd(hp[0])+1,rd(hp[1])-1,P.m3); CACHE.lock=[rd(hp[0]),rd(hp[1])]; }
  var lb=M.wallPt(SPEC,'R',C.u0+3,C.v0+5); b.rect(rd(lb[0]),rd(lb[1]),8,4,P.s5); b.hl(rd(lb[0])+1,rd(lb[0])+6,rd(lb[1])+2,P.m1); }
function paintStove(b){ var p=R3.p, X=STOVE.X, Z=STOVE.Z, q=p(X,FY,Z), cx=rd(q[0]), by=rd(q[1]), k=1+Z/F, r=rd(9*k), h=rd(20*k), x, y;
  // Ölfass: liegend auf Ziegeln, Tür vorn, Rohr nach oben und durch die Wand
  b.rect(cx-r,by-4,4,4,P.t1); b.rect(cx+r-4,by-4,4,4,P.t1);
  for (y=by-4-h;y<by-4;y++) for (x=cx-r;x<=cx+r;x++){ var u=(x-(cx-r))/(2*r), c=u<0.2?P.m1:(u<0.55?P.m2:(u<0.85?P.m1:P.m0)); if (((y-(by-4-h))%7)===0) c=P.m0; if (fbm(x*0.4,y*0.3)>0.66) c=P.t1; b.px(x,y,c); }
  b.hl(cx-r,cx+r,by-4-h,P.m3); b.rect(cx-4,by-4-h+6,8,7,P.k1); b.hl(cx-4,cx+3,by-4-h+6,P.m2); b.px(cx+2,by-4-h+9,P.m3); CACHE.stoveDoor=[cx-4,by-4-h+6];
  b.rect(cx-2,4,4,by-4-h-4,P.m1); b.vl(cx-2,4,by-5-h,P.m2); b.vl(cx+1,4,by-5-h,P.k2); for (y=10;y<by-h;y+=12) b.hl(cx-3,cx+2,y,P.m0);
  b.line(cx+2,6,cx+26,0,P.m1); CACHE.stove=[cx-r-2,by-6-h,2*r+5,h+8]; CACHE.pipeTop=[cx,4]; }
function paintPipes(b){ // Rohre unter der Decke: zwei laufen von hinten nach vorn, eins längs der Rückwand
  [[96,RECT[1]+3],[238,RECT[1]+4]].forEach(function(pp,i){ var a=p3(pp[0],pp[1],0), c=p3(pp[0],pp[1],70); for (var w=0;w<3;w++) b.line(rd(a[0]),rd(a[1])+w,rd(c[0]),rd(c[1])+w*rd(1+70/F),w===0?P.m3:(w===1?P.m2:P.k2)); for (var z=8;z<70;z+=16){ var cl=p3(pp[0],pp[1]-2,z); b.rect(rd(cl[0])-1,rd(cl[1]),3,3,P.m1); } });
  for (var x=RECT[0];x<RECT[2];x++){ b.px(x,RECT[1]+4,P.m3); b.px(x,RECT[1]+5,P.m2); b.px(x,RECT[1]+6,P.k2); } for (x=RECT[0]+10;x<RECT[2];x+=40){ b.rect(x,RECT[1]+3,2,4,P.m1); }
  var vx=200; b.rect(vx,RECT[1]+2,6,6,P.t1); b.px(vx+2,RECT[1]+1,P.t2); CACHE.drip=[vx+3,RECT[1]+8]; }
function paintCanisters(b){ var base=p3(220,FY,4), x=rd(base[0]), y=rd(base[1]);
  [[x+6,y,P.s5,P.s6],[x+18,y+2,P.b1,P.b2],[x+30,y+1,P.r2,P.r3]].forEach(function(c,i){ var cx=c[0], cy=c[1]; b.rect(cx,cy-14,10,14,c[2]); b.hl(cx,cx+9,cy-14,c[3]); b.vl(cx,cy-14,cy-1,c[3]); b.rect(cx+6,cy-17,3,3,c[2]); b.rect(cx+1,cy-17,4,2,P.m1); b.hl(cx+1,cx+8,cy-8,M.DN[c[2]]); });
  CACHE.canister=[x+4,y-19,38,22]; }
function paintBulb(b,lit){ var x=BULB.x, y0=BULB.y0, y1=BULB.y1; b.vl(x,y0,y1-4,P.k2); b.rect(x-1,y1-5,3,2,P.m1); b.ellipse(x,y1-1,2.2,2.6,lit?P.y5:P.s4); if (lit) b.px(x,y1-2,P.l1); else { b.px(x-1,y1-2,P.s5); b.px(x+1,y1,P.s2); } }

// ---------------------------------------------------------------- Licht
var DARK=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.34+L*0.08, g*0.38+L*0.1+2, b*0.48+L*0.12+8]; });
var DIM=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.55+L*0.1+4, g*0.58+L*0.1+5, b*0.66+L*0.12+12]; });
var MIDS=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.68+L*0.13+9, g*0.62+L*0.11+6, b*0.58+L*0.09+6]; });
var WARM=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.82+L*0.16+14, g*0.7+L*0.12+6, b*0.5+L*0.06]; });
function doorOpen(GS){ var h=GS&&GS.rooms&&GS.rooms.haustor; return !!(h&&h.shelterOpen); }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), lit=!!S.lit, glow=doorOpen(GS), x, y;
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return concrete(u+RECT[0],v+RECT[1],x,y); },
    side:function(u,v,x,y,sd){ var c=concrete(u*1.5+(sd==='L'?0:300),v+RECT[1],x,y); return sd==='R'?M.DN[c]:c; },
    floor:floorCol, ceil:ceilCol });
  // alte Schulordnung und ein Stundenplan, an die Wand gemalt: blasses Rot
  paintPipes(b); paintDrawings(b); paintBellbox(b);
  M.microText(b,'RASPORED',236,38,P.r1); for (var i=0;i<5;i++){ b.hl(236,262,45+i*3,P.s2); b.px(236+i*6,44,P.s2); }
  // ein Stück Karton über der Tafel, mit Filzstift: ŠKOLA
  b.rect(84,26,26,9,P.e3); b.hl(84,109,26,P.e4); b.hl(84,109,34,P.e2); b.vl(109,26,34,P.e2); sign(b,'ŠKOLA',86,29,P.k2); b.px(85,27,P.m3); b.px(108,27,P.m3);
  paintBoard(b); paintStairs(b,glow); paintSandbags(b); paintDesk(b); paintBenches(b); paintCabinet(b,S); paintStove(b); paintCanisters(b); paintBulb(b,lit);
  // Licht: mit Birne warm von der Mitte aus, sonst nur ein schwacher kalter Rest
  if (lit){ M.light(b,M.lf.sum(M.lf.pool(BULB.x,BULB.y1+26,160,80,1.1),M.lf.pool(BULB.x,BULB.y1+4,40,26,0.6),M.lf.pool(BULB.x,114,100,22,0.5),M.lf.vignette(W,H,1.7),M.lf.k(-0.45)));
    // drei weiche Stufen: warm unter der Birne, dazwischen gemischt, am Rand kühl und dämmrig
    for (y=0;y<H;y++) for (x=0;x<W;x++){ var d=Math.hypot((x-BULB.x)/160,(y-BULB.y1-20)/95), k2=y*W+x, lv=Math.max(0,1.05-d)*2.4, li=Math.floor(lv)+(((lv%1)>bayer(x,y))?1:0); b.d[k2]=M.tintPx(li>=2?WARM:(li===1?MIDS:DIM),b.d[k2],x,y); } }
  else { M.light(b,M.lf.sum(M.lf.vignette(W,H,1.4),M.lf.k(-0.8),glow?M.lf.beam(70,0,40,118,10,34,1.6):M.lf.k(0)));
    for (var k=0;k<W*H;k++) b.d[k]=M.tintPx(DARK,b.d[k],k%W,(k/W)|0); }
  paintBulb(b,lit);
  var bg=[]; for (var yy=BULB.y1-6;yy<=BULB.y1+1;yy++) for (var xx=BULB.x-3;xx<=BULB.x+3;xx++){ var near=(Math.abs(xx-BULB.x)<=2); if (near) bg.push([xx,yy,b.get(xx,yy)]); }
  // was hinter der Birne läge: Nachbarspalten als Ersatz
  CACHE.bulbBg=bg.map(function(q){ var dx=q[0]<BULB.x?-3:3; return [q[0],q[1],b.get(q[0]+(q[0]===BULB.x?3:dx),q[1])]; });
  return b; }

// ---------------------------------------------------------------- Ebenen: vorderste Bank jeder Reihe (die Sitzenden sitzen davor/darauf), Sandsäcke vorn
function layers(S,GS,tod){ var out=[], lit=!!S.lit;
  ROWS.forEach(function(X,ri){ var q=R3.p(X,FY,UNITS[2]), L=M.layer(rd(q[0])-40,rd(q[1])-40,64,42,rd(q[1])+1), w=M.lw(L);
    // nur das Pult der vordersten Bank liegt vor den Knien der Sitzenden
    var k=1+UNITS[2]/F, s=k*0.62, sx=rd(q[0]), sy=rd(q[1]); function Lp(dx,dy){ return [rd(sx+dx*s),rd(sy+dy*s)]; }
    benchDesk(w,Lp,R('w0 w1 w2 w3 w4')); var a=Lp(-26,0), a2=Lp(-24,-26); w.line(a[0],a[1],a2[0],a2[1],P.m0);
    M.tintApply(L,lit?WARM:DARK); out.push(L); });
  return out; }

// ---------------------------------------------------------------- Bewegung: Birne pendelt, Wassertropfen
function dyn(fb,v,S,GS){ var t=v.t, lit=!!S.lit;
  // die Birne pendelt ein wenig am Kabel (nur das untere Stück bewegt sich)
  var sw=Math.round(Math.sin(t*0.9)*1.2); if (sw!==0){ var bx=BULB.x+sw, by=BULB.y1, bg=CACHE.bulbBg; if (bg) for (var i=0;i<bg.length;i++) fb.d[bg[i][1]*fb.w+bg[i][0]]=bg[i][2];
    fb.px(bx,by-6,P.k2); fb.px(bx,by-5,P.k2); fb.rect(bx-1,by-4,3,2,P.m1); fb.px(bx-1,by-2,lit?P.y4:P.s3); fb.px(bx,by-2,lit?P.y5:P.s4); fb.px(bx+1,by-2,lit?P.y4:P.s3); fb.px(bx-1,by-1,lit?P.y5:P.s4); fb.px(bx,by-1,lit?P.l1:P.s5); fb.px(bx+1,by-1,lit?P.y5:P.s3); fb.px(bx,by,lit?P.y4:P.s2); }
  // ein Tropfen fällt vom Ventil an der Decke in eine kleine Pfütze
  var d=CACHE.drip; if (d){ var ph=(t*0.55)%1, fy=rd(d[1]+ph*ph*78); if (ph<0.92) fb.px(d[0],fy,lit?P.s5:P.m2); else { fb.px(d[0]-1,d[1]+78,P.m3); fb.px(d[0]+1,d[1]+78,P.m3); } } }

// ---------------------------------------------------------------- Geistersicht: die Tafel voller Kreide, blasse Kinder auf den Bänken
function chalk(fb,s,x,y,c,wob){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch,i){ var base={'Č':'C','Ć':'C','Š':'S','Ž':'Z'}[ch]||ch, dy=wob?Math.round(Math.sin(i*1.7+x)*wob):0; M.microText(fb,base,cx,y+dy,c); if (ch!==base) fb.px(cx+(ch==='Ć'?2:1),y+dy-1,c); cx+=M.microWidth(base)+1; }); }
function ghost(fb,v,S,GS){ var t=v.t, B=CACHE.board; if (!B) return; var x0=B[0], y0=B[1], c=P.x5, c2=P.x4;
  // Rechnungen
  chalk(fb,'7+5=12',x0+3,y0+3,c2,0); chalk(fb,'3X4=12',x0+32,y0+3,c2,0); chalk(fb,'9-4=5',x0+3,y0+10,c2,0);
  // eine Straßenbahn mit der 3
  var tx=x0+31, ty=y0+13; for (var i=0;i<22;i++){ fb.px(tx+i,ty,c2); if (i%3) fb.px(tx+i,ty+6,c2); } fb.px(tx,ty+1,c2); for (var j=1;j<6;j++){ fb.px(tx-1,ty+j,c2); fb.px(tx+22,ty+j,c2); } for (i=0;i<4;i++){ fb.px(tx+2+i*4,ty+2,c2); fb.px(tx+3+i*4,ty+2,c2); fb.px(tx+2+i*4,ty+3,c2); fb.px(tx+3+i*4,ty+3,c2); }
  fb.px(tx+4,ty+7,c2); fb.px(tx+17,ty+7,c2); fb.px(tx+11,ty-1,c2); fb.px(tx+10,ty-2,c2); fb.px(tx+12,ty-2,c2); fb.px(tx+11,ty-3,c2); for (i=-2;i<25;i+=2) fb.px(tx+i,ty-4,P.x3); M.microText(fb,'3',tx+17,ty+1,P.x6);
  // ein Gedicht in zwei Zeilen
  chalk(fb,'TROJKA SPAVA,',x0+3,y0+21,c,0); chalk(fb,'MI ČEKAMO.',x0+3,y0+28,c,0);
  // darunter Namen in Kinderschrift
  chalk(fb,'LANA SELMA',x0+3,y0+36,c2,0.8); chalk(fb,'MIRZA DAMIR',x0+5,y0+42,c2,0.8);
  // blasse Kindergestalten auf den Bänken, solange sie nicht frei sind
  if (!(GS.flags||{})['k2.s3.free']){ var seats=CACHE.seats||[];
    seats.forEach(function(p,i){ var sx=p[0], sy=p[1], sc=(i<3)?0.85:1.05, br=0.5+Math.sin(t*0.7+i*1.3)*0.25, cc=(br>0.55)?P.x3:P.x2, hx=sx, hy=rd(sy-13*sc);
      // Umriss eines sitzenden Kindes, Blick nach links zur Tafel
      var pts=[[0,-10],[-2,-11],[-3,-13],[-2,-15],[0,-16],[2,-15],[2,-12],[1,-10],[3,-8],[3,-3],[2,0],[-5,0],[-7,1],[-8,4],[-9,7]];
      for (var k=0;k+1<pts.length;k++){ var a=pts[k], bb=pts[k+1]; var n=Math.max(Math.abs(bb[0]-a[0]),Math.abs(bb[1]-a[1])); for (var q=0;q<=n;q++){ var X=rd(hx+(a[0]+(bb[0]-a[0])*q/Math.max(1,n))*sc), Y=rd(hy+(a[1]+(bb[1]-a[1])*q/Math.max(1,n))*sc); if (bayer(X,Y+Math.floor(t*2))<0.85) fb.px(X,Y,cc); } }
      fb.px(rd(hx-2*sc),rd(hy-13*sc),cc); fb.px(rd(hx-6*sc),rd(hy-6*sc),cc); fb.px(rd(hx-8*sc),rd(hy-5*sc),cc); }); }
  M.dust(fb,t*0.3,40,40,240,90,12,P.x3); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; if (y<102||y>140) return false; var X=f.X, Z=f.Z;
  if (X<ST.X1+2) return Z>ST.Z1-6;                                         // unter/auf der Treppe nur am Fuß
  if (X>RECT[2]-8) return false;
  if (Z>DESK.Z0-3 && Z<DESK.Z1+3 && X>DESK.X0-4 && X<DESK.X1+4) return false;
  if (Z<UNITS[2]+4){ for (var i=0;i<ROWS.length;i++) if (X>ROWS[i]-16 && X<ROWS[i]+6) return false; }  // Bankreihen
  if (X>STOVE.X-10 && X<STOVE.X+12 && Z>STOVE.Z-8 && Z<STOVE.Z+8) return false;
  if (X>222 && X<258 && Z<10) return false;                               // Kanister
  if (x<BOARD.x1+4 && y<110) return false;                                  // Tafelgestell
  return true; }
function rr(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
var spots={
  exit:[0,0,96,72],
  blackboard:[BOARD.x0-3,BOARD.y0-3,BOARD.x1-BOARD.x0+6,BOARD.y1-BOARD.y0+8],
  drawings:[146,34,100,36],
  benches:[140,82,150,46],
  desk:R3.rect(DESK.X0,DESK.X1,DESK.Y0-6,FY,DESK.Z0,DESK.Z1),
  under_desk:null,
  cabinet:rr(wq('R',CAB.u0-1,CAB.u1+1,CAB.v0-2,CAB.v1)),
  bell:null,
  stove:null,
  pipes:[60,30,200,10],
  sandbags:null,
  canister:null,
  bulb:[BULB.x-5,BULB.y1-10,11,14],
  bellbox:[BELL.x-6,BELL.y-4,13,15]
};
var stands={
  exit:[46,126,'L'], blackboard:[96,118,'B'], drawings:[196,128,'B'], benches:[214,130,'B'], desk:[122,120,'B'], under_desk:[124,122,'B'], cabinet:[262,118,'R'],
  bell:[110,118,'B'], stove:[270,124,'R'], pipes:[180,124,'B'], sandbags:[56,128,'L'], canister:[244,128,'B'], bulb:[176,124,'B'], bellbox:[124,124,'B']
};
// Rechtecke, die erst nach dem Malen feststehen (aus der Geometrie berechnet)
(function(){ var D=DESK, kn=R3.p(D.X0,FY,D.Z1), kx=R3.p(D.X1,D.Y0+4,D.Z1); spots.under_desk=[rd(kn[0]+(kx[0]-kn[0])*0.3),rd(kx[1])+5,rd((kx[0]-kn[0])*0.4),rd(kn[1]-kx[1])-5];
  var g=R3.p(D.X0+8,D.Y0,D.Z0+5); spots.bell=[rd(g[0])-5,rd(g[1])-11,11,13];
  var q=R3.p(STOVE.X,FY,STOVE.Z), k=1+STOVE.Z/F, r=rd(9*k), h=rd(20*k); spots.stove=[rd(q[0])-r-2,8,2*r+5,rd(q[1])-8];
  var f=R3.p(ST.X1,FY,ST.Z1); spots.sandbags=[rd(f[0])-22,rd(f[1])-29,52,33];
  var c=R3.p(220,FY,4); spots.canister=[rd(c[0])+4,rd(c[1])-19,38,22]; })();
function actorLut(a,S,GS,tod){ if (a.ghost) return undefined; return (S&&S.lit)?WARM.a:DARK.a; }
// feste Lichtquelle: nur wenn oben die Stahltür offen steht, fällt etwas Licht die Treppe herunter
function darkLights(S,GS){ return doorOpen(GS)?[[60,40,46,0.8],[46,96,34,0.45]]:[]; }
M.defineArt('skloniste',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut, spots:spots, stands:stands, darkLights:darkLights,
  actorPos:{ zora:[BOARD.x1+6,116,'F'], mirza:[0,0,'L'], selma:[0,0,'L'], damir:[0,0,'L'] },
  start:[48,128,'R'], entries:{ haustor:[48,128,'R'] }
});
// Sitzplätze der drei Erwachsenen: auf der vordersten Bank jeder Reihe (Hüfte über der Sitzfläche)
(function(){ var A=M.ART.skloniste, names=['mirza','selma','damir']; ROWS.forEach(function(X,i){ var q=R3.p(X,FY,UNITS[2]); A.actorPos[names[i]]=[rd(q[0]),rd(q[1]),'L']; }); })();
})(M);
