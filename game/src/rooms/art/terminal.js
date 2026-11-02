/* ===== rooms/art/terminal.js — Fährhafen und Busbahnhof (480 px, scrollend) =====
   Links das Fährterminal (Betonbau der 70er, „TRAJEKTNA LUKA“), dahinter ragt der Glockenturm von Sveti Duje auf.
   Am Kai die große weiße Fähre nach Ancona mit hochgeklapptem Bugvisier und Rampe. In der Mitte der Kiosk (Mira),
   eine Palme, der Mast mit Laterne und Lautsprecher. Rechts die Bussteige unter einem Betondach: Abfahrtstafel,
   die Bank (Epilog: Mala), der Reisebus mit „SARAJEVO“ hinter der Frontscheibe und die Blagajna. Vorn Wasser.
   c2: Tag, Bura, klar und kalt. epi: Morgengrauen, kühles Rosa und Blau, die Laternen gehen gerade aus. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer;
var W=480, HZ=84;                   // Horizont (Wasserlinie in der Ferne)
var QB=106, QF=138;                 // hintere Kaikante (Hafenbecken) und vordere Kaikante (Wasser vorn, rechts)
var TERM={x0:0,x1:118,top:42};
var FER={x0:126,x1:304,wl:104};
var KIO={x0:218,x1:254,base:112};
var PALM={x:268,base:112};
var POLE={x:291,base:114};
var CAN={x0:300,x1:480,y0:46,y1:54};
var BOARD={x0:308,x1:368,y0:58,y1:91};
var BENCH={x0:334,x1:366,base:124};
var BUS={x0:372,x1:422,top:70,base:113};
var TICK={x0:446,x1:478,top:64,base:112};
var LAMPS=[[66,112,30],[196,113,30]]; var TUBES=[[322,57],[406,57]];
function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
var CACHE={};
// ---------------------------------------------------------------- Licht (Morgengrauen): weich zwischen Dämmerblau und warmem Lampenlicht
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
function lightsFor(tod){ if (tod==='day') return [];
  // Laternen: links noch an (schwach), Mitte flackert (dynamisch), rechts noch an; Kiosk und Bus haben Licht
  return [[LAMPS[0][0],LAMPS[0][1]-LAMPS[0][2]+4,26,30,0.5],[TUBES[0][0],72,30,26,0.35],[TUBES[1][0],72,30,26,0.35],[FER.x0+10,FER.wl-16,22,14,0.6],
    [236,74,24,22,0.6],[397,104,38,14,0.55],[397,92,22,18,0.35],[462,84,16,16,0.45],[FER.x0+70,70,90,30,0.18],
    [LAMPS[0][0]+4,118,26,9,0.55],[236,118,24,7,0.4],[392,124,30,12,0.6],[402,134,22,8,0.45],[TUBES[0][0],114,24,8,0.35],[TUBES[1][0],114,22,7,0.3],[462,116,14,5,0.35]]; }

// ---------------------------------------------------------------- Himmel, Ferne, Wasser
function paintSky(b,tod){ var x, y;
  if (tod==='dawn'){ var R=M.R('n0 n1 n2 b0 v2 v3 d3 d4 d5 d6');
    for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var v=y/HZ, east=x/W; var g=Math.pow(v,1.05)*(0.78+east*0.32)+Math.max(0,east-0.55)*0.12; g+=Math.sin(x*0.013+y*0.05)*0.02; b.px(x,y,M.rampAt(R,g,x,y)); }
    // rosa beleuchtete Wolkenstreifen
    var r=M.rng(5); for (var i=0;i<11;i++){ var cx=r()*W, cy=12+r()*44, rx=20+r()*60, ry=1+r()*1.6; for (y=Math.floor(cy-ry);y<=cy+ry;y++) for (x=Math.floor(cx-rx);x<=cx+rx;x++){ var dx=(x-cx)/rx, dy=(y-cy)/ry; if (dx*dx+dy*dy>1||bayer(x,y)<dx*dx) continue; b.px(x,y,dy<0?(cy<30?P.v3:P.d4):(cy<30?P.v2:P.d3)); } }
    for (i=0;i<26;i++){ var sx=Math.floor(hash(i,61)*W*0.6), sy=Math.floor(hash(i,62)*24); b.px(sx,sy,i%3?P.n3:P.n4); }
  } else { var D=M.R('b0 b1 b2 b3 b4');
    for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var v=Math.pow(y/HZ,1.2); b.px(x,y,M.rampAt(D,0.08+v*0.92,x,y)); }
    var r2=M.rng(8); for (var j=0;j<6;j++){ var cx2=r2()*W, cy2=8+r2()*30, rx2=30+r2()*70; for (x=Math.floor(cx2-rx2);x<cx2+rx2;x++){ var yy=Math.round(cy2+Math.sin(x*0.05)*1.2); if (bayer(x,yy)<0.6-Math.abs(x-cx2)/rx2*0.6) b.px(x,yy,P.b4); if (bayer(x,yy+1)<0.3-Math.abs(x-cx2)/rx2*0.3) b.px(x,yy+1,P.b5); } } } }
function paintFar(b,tod){ var dawn=tod==='dawn', x, y;
  // Mosor im Osten (rechts), lange Kette
  for (x=200;x<W;x++){ var h=Math.round(18+Math.sin(x*0.018)*7+Math.sin(x*0.061+1)*3+Math.max(0,(x-300)*0.04)); for (y=HZ-h;y<HZ;y++){ var t=(y-(HZ-h))/h; b.px(x,y,dawn?(t<0.15?P.v3:(bayer(x,y)<0.4?P.v2:P.v1)):(t<0.12?P.b4:(bayer(x,y)<0.45?P.b3:P.b2))); } }
  // Wohnblöcke der Stadt (70er) hinter den Bussteigen
  var r=M.rng(31); for (var i=0;i<9;i++){ var bx=300+i*20+Math.floor(r()*8), bw=10+Math.floor(r()*8), bh=18+Math.floor(r()*20); for (y=HZ+8-bh;y<HZ+8;y++) for (x=bx;x<bx+bw;x++){ var c=dawn?P.v2:P.s3; if (x===bx) c=dawn?P.v3:P.s4; if (x===bx+bw-1) c=dawn?P.v1:P.s2; if (((y-(HZ+8-bh))%4)===2 && ((x-bx)%3)!==0) c=dawn?(hash(x,y)<0.2?P.y3:P.v1):P.m2; b.px(x,y,c); } }
  // Altstadt mit dem Glockenturm (links, über dem Terminaldach)
  for (x=0;x<140;x++){ var hh=Math.round(10+Math.sin(x*0.2)*2+hash(x>>3,2)*5); for (y=HZ-hh;y<HZ;y++) b.px(x,y,dawn?P.v1:((y===HZ-hh)?P.t3:P.s3)); }
  var tx=26; for (y=14;y<HZ;y++){ var w2=y<22?Math.max(1,Math.round((y-14)/2)):(y<30?4:5); b.hl(tx-w2,tx+w2,y,dawn?P.v2:(y<22?P.s3:P.s4)); if (!dawn) b.px(tx+w2,y,P.s2); }
  for (var k=0;k<4;k++){ var wy=34+k*11; b.rect(tx-1,wy,3,4,dawn?P.v0:P.s1); } b.px(tx,12,dawn?P.v3:P.s2); b.px(tx,13,dawn?P.v3:P.s2); }
function seaCol(tod,x,y,t){ var ramp=M.seaRamp(tod==='dawn'?'dawn':'day'), d=(y-HZ)/40, s=Math.sin(x*0.11+y*0.9+t*1.4)+Math.sin(x*0.037-t*0.7+y*0.33);
  var v=0.62-d*0.35+s*0.11; var c=M.rampAt(ramp,v,x,y); if (s>1.55 && (y&1)) c=tod==='dawn'?P.d5:P.s6; return c; }
function paintHarbor(b,tod){ for (var y=HZ;y<QB;y++) for (var x=0;x<W;x++) b.px(x,y,seaCol(tod,x,y,0)); }

// ---------------------------------------------------------------- Fährterminal (Betonbau, Glasfront, Beton-Lamellen)
function paintTerminal(b,tod){ var x0=TERM.x0, x1=TERM.x1, top=TERM.top, x, y;
  // Dachplatte und Schrift
  b.rect(x0,top,x1-x0+6,6,P.m3); b.hl(x0,x1+5,top,P.s4); b.hl(x0,x1+5,top+5,P.m1); b.rect(x0,top+6,x1-x0+6,1,P.m0);
  for (x=x0;x<x1+6;x+=6) b.vl(x,top+1,top+4,P.m2);
  var label='TRAJEKTNA LUKA', lw=M.textWidth(label), lx=Math.round((x0+x1)/2-lw/2)+2;
  for (x=lx;x<lx+lw;x+=6) b.vl(x,top-2,top-1,P.m1);
  M.text(b,label,lx,top-10,P.s6,P.m0); M.text(b,label,lx,top-10,P.s6);
  // Fahnenmast
  b.vl(x1-6,top-26,top-1,P.m2); b.px(x1-6,top-27,P.y3);
  // Glasfront mit Lamellen
  for (y=top+7;y<QB;y++) for (x=x0;x<x1;x++){ var fin=((x-x0)%13), c;
    if (fin<3){ c=fin===0?P.s4:(fin===1?P.s3:P.m2); if (y>QB-6) c=P.m1; }
    else { var refl=((x*0.5+y)%26); c=(y<top+28)?P.c2:P.c1; if (refl<2.2) c=P.c3; else if (refl<3.4 && bayer(x,y)<0.5) c=P.c3; if (y>QB-6) c=P.m1; if (y===top+29||y===top+30) c=P.m2; }
    b.px(x,y,c); }
  // Spiegelung von Himmel und Fähre in den oberen Scheiben
  for (y=top+8;y<top+28;y++) for (x=x0;x<x1;x++){ if ((x-x0)%13<3) continue; if (bayer(x,y)<0.25+(top+28-y)/60) b.px(x,y,tod==='dawn'?P.v2:P.b2); }
  // Eingang mit Vordach, Uhr, Plakat
  b.rect(46,top+34,30,QB-top-34,P.k2); b.rect(47,top+35,13,QB-top-36,P.c0); b.rect(62,top+35,13,QB-top-36,P.c0); b.vl(61,top+35,QB-1,P.m3); b.hl(46,75,top+34,P.m3);
  b.px(58,top+50,P.m4); b.px(64,top+50,P.m4); b.rect(40,top+31,42,3,P.s4); b.hl(40,81,top+31,P.s5); b.hl(40,81,top+33,P.m1);
  b.ellipse(96,top+17,5,5,P.s4); b.ellipse(96,top+17,4,4,P.s6); b.line(96,top+17,96,top+14,P.k1); b.line(96,top+17,98,top+18,P.k1); b.rect(95,top+22,3,3,P.m1);
  b.rect(10,top+36,18,24,P.s5); b.rect(11,top+37,16,12,P.b2); M.prop.ferry(b,12,top+47,14,false,{}); b.rect(11,top+50,16,9,P.s5); M.microText(b,'ANCONA',11,top+51,P.r2); b.hl(10,27,top+36,P.s6);
  // Sockel, Pflanzkübel
  b.rect(x0,QB-6,x1-x0,6,P.m2); b.hl(x0,x1-1,QB-6,P.m3); for (var pk=0;pk<2;pk++){ var px=86+pk*16; b.rect(px,QB-12,10,8,P.m3); b.hl(px,px+9,QB-12,P.s4); M.prop.pot(b,px+5,QB-12,{n:7,h:6,pot:P.m3}); } }

// ---------------------------------------------------------------- die große weiße Fähre nach Ancona, Bugvisier offen
function paintFerry(b,tod){ var x0=FER.x0, x1=FER.x1, wl=FER.wl, dawn=tod==='dawn', x, y;
  var deck=wl-28, sup0=deck-12, sup1=sup0-11, bridge=sup1-9;
  // Rumpf (Bug links mit geöffnetem Visier, Heck rechts)
  for (x=x0;x<x1;x++){ var t=(x-x0)/(x1-x0), yt=deck+(t<0.08?Math.round((0.08-t)*60):0), yb=wl;
    for (y=yt;y<yb;y++){ var c=P.s5; if (y>wl-5) c=P.c1; if (y>wl-2) c=P.r2; if (y===wl-5) c=P.b1; if (y<yt+2) c=P.s6; if (t>0.97) c=P.s4; if (y>yt+8 && y<yt+12 && (x%5)===0 && t>0.12) c=P.k2; if (y===yt+3) c=P.s3; b.px(x,y,c); } }
  // Bugvisier hochgeklappt, dahinter das dunkle Autodeck, Rampe zum Kai
  b.poly([[x0-6,deck-18],[x0+18,deck-16],[x0+20,deck-6],[x0-2,deck-6]],function(x,y){ return y<deck-15?P.s6:(x<x0+2?P.s4:P.s5); }); b.line(x0-6,deck-18,x0+18,deck-16,P.s6); b.line(x0-2,deck-6,x0+20,deck-6,P.m2);
  b.vl(x0+4,deck-6,deck+2,P.m1); b.vl(x0+14,deck-6,deck+2,P.m1);
  b.rect(x0+1,deck,18,wl-deck-6,P.k1); b.rect(x0+3,deck+3,14,wl-deck-10,dawn?P.y1:P.k2); b.hl(x0+3,x0+16,deck+8,dawn?P.y2:P.m0); b.rect(x0+6,deck+5,7,5,dawn?P.y2:P.k0); b.hl(x0+3,x0+16,deck+3,dawn?P.y3:P.m0); CACHE.cardeck=[x0+3,deck+3,14,wl-deck-10];
  b.poly([[x0+1,wl-6],[x0+19,wl-6],[x0+4,QB+1],[x0-16,QB+1]],function(x,y){ return ((x+y)%3===0)?P.m1:P.m2; }); b.line(x0-16,QB+1,x0+1,wl-6,P.m3); b.line(x0+4,QB+1,x0+19,wl-6,P.m1);
  // Name am Bug
  M.microText(b,'LASTAVICA',x0+24,deck+4,P.b0);
  // Aufbauten: Decks mit Fensterbändern, Rettungsboote, Brücke, Schornstein
  var xs=x0+26, xe=x1-14;
  b.rect(xs,sup0,xe-xs,12,P.s5); b.hl(xs,xe-1,sup0,P.s6); b.hl(xs,xe-1,sup0+11,P.s3); for (x=xs+2;x<xe-2;x+=3) b.rect(x,sup0+3,2,3,dawn?(hash(x,1)<0.65?P.y4:P.b0):P.b0);
  b.rect(xs+8,sup1,xe-xs-30,10,P.s5); b.hl(xs+8,xe-23,sup1,P.s6); for (x=xs+10;x<xe-24;x+=3) b.rect(x,sup1+3,2,3,dawn?(hash(x,2)<0.5?P.y3:P.b0):P.b0);
  b.rect(xs+10,bridge,34,8,P.s6); b.hl(xs+8,xs+46,bridge,P.s5); b.rect(xs+12,bridge+2,30,3,P.k2); for (x=xs+13;x<xs+42;x+=3) b.px(x,bridge+3,dawn?P.y4:P.b2);
  b.hl(xs+4,xe,sup0-1,P.m3); b.hl(xs+4,xe,deck-1,P.m3); for (x=xs+4;x<xe;x+=4){ b.px(x,sup0-2,P.m3); b.px(x,deck-2,P.m3); }
  for (var lb=0;lb<4;lb++){ var lx=xs+40+lb*22; b.rect(lx,sup0-5,14,4,P.t4); b.hl(lx,lx+13,sup0-5,P.y4); b.hl(lx,lx+13,sup0-2,P.t2); b.px(lx+2,sup0-6,P.m2); b.px(lx+11,sup0-6,P.m2); }
  var fx=xe-30; b.rect(fx,bridge-14,12,22,P.s6); b.rect(fx,bridge-10,12,4,P.b1); b.hl(fx,fx+11,bridge-14,P.k2); b.rect(fx+1,bridge-15,10,1,P.k1); b.vl(fx+11,bridge-13,bridge+7,P.s4);
  b.vl(xs+28,bridge-18,bridge,P.m2); b.line(xs+28,bridge-18,xs+6,sup0,P.m2); b.line(xs+28,bridge-18,fx,bridge-14,P.m1); b.px(xs+28,bridge-19,dawn?P.r4:P.m3);
  CACHE.ferryLights=dawn?[[xs+28,bridge-19,P.r4],[x1-2,deck+1,P.g5],[x0+10,deck-17,P.l1]]:[];
  // Taue zum Kai
  [[x0+40,QB-1],[x1-20,QB-1]].forEach(function(q){ b.line(q[0],deck+6,q[0]-10,q[1]-1,P.e2); }); }

// ---------------------------------------------------------------- Kai, Pflaster, Poller, Wasser vorn
function slab(x,y){ var row=Math.floor((y-QB)/9+((y-QB)>18?0.5:0)), off=(row&1)*11, sw=22+((y-QB)>16?6:0), col=Math.floor((x+off)/sw), fx=(x+off)-col*sw, fy=(y-QB)%9;
  if (fy===0 || fx<1) return P.m2; var t=hash(col,row), c=t<0.3?P.s2:(t<0.85?P.s3:P.s4); if (fy===1 && fx>2) c=M.UP[c]; if (hash(x>>1,y>>1)<0.03) c=M.DN[c]; return c; }
function asphalt(x,y){ var c=(hash(x>>1,y>>1)<0.5)?P.m2:P.m1; if (hash(x,y)<0.04) c=P.m3; return c; }
function paintQuay(b,tod){ var x, y;
  for (y=QB;y<144;y++) for (x=0;x<W;x++){ if (x>=276 && y>QF) continue; var c=(x<CAN.x0-4)?slab(x,y):asphalt(x,y); if (y===QB) c=P.s4; else if (y===QB+1) c=P.m1; else if (y===QB+2 && x<CAN.x0) c=P.y3; b.px(x,y,c); }
  // Busbuchten: weiße Markierungen auf dem Asphalt, Bordstein vor den Steigen
  for (x=CAN.x0;x<W;x++){ b.px(x,QB+10,P.s4); b.px(x,QB+11,P.m3); }
  [[368,1],[440,1]].forEach(function(q){ for (y=QB+12;y<QF;y++){ var xx=q[0]+Math.round((y-QB-12)*0.35); b.px(xx,y,P.s4); b.px(xx+1,y,P.s3); } });
  for (x=CAN.x0;x<W;x+=7) b.hl(x,x+3,QB+24,P.y3);
  // Kaikante vorn (rechts) und Wasser
  for (x=276;x<W;x++){ b.px(x,QF,P.s4); b.px(x,QF-1,P.y3); b.px(x,QF+1,P.m1); for (y=QF+2;y<144;y++) b.px(x,y,seaCol(tod,x,y,0)); }
  b.vl(276,QF-1,143,P.m1); b.vl(277,QF-1,143,P.m2);
  [154,214,266].forEach(function(px){ M.prop.bollard(b,px,QB+5); });
  [[100,128],[250,132]].forEach(function(q){ b.ellipse(q[0],q[1],5,1.6,P.m1); b.ellipse(q[0],q[1],3.6,1,P.m2); b.hl(q[0]-2,q[0]+2,q[1],P.m1); });
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
  TUBES.forEach(function(q){ b.vl(q[0]-5,CAN.y1,q[1],P.m1); b.vl(q[0]+5,CAN.y1,q[1],P.m1); b.hl(q[0]-7,q[0]+7,q[1],P.s4); b.hl(q[0]-7,q[0]+7,q[1]+1,P.m2); }); }
function paintBoard(b){ var x0=BOARD.x0, x1=BOARD.x1, y0=BOARD.y0, y1=BOARD.y1;
  b.vl(x0+6,CAN.y1,y0,P.m1); b.vl(x1-6,CAN.y1,y0,P.m1);
  b.rect(x0,y0,x1-x0,y1-y0,P.k1); b.rect(x0+1,y0+1,x1-x0-2,y1-y0-2,P.k2); b.hl(x0,x1-1,y0,P.m2); b.hl(x0,x1-1,y1-1,P.k0);
  M.microText(b,'POLASCI',x0+3,y0+2,P.s5); b.hl(x0+2,x1-3,y0+8,P.m1);
  var rows=[['07:00','SARAJEVO'],['07:30','ZAGREB'],['08:15','MAKARSKA'],['09:00','RIJEKA']];
  rows.forEach(function(r,i){ var yy=y0+10+i*6; M.microText(b,r[0],x0+3,yy,P.y4); M.microText(b,r[1],x0+24,yy,i===0?P.s6:P.s4); }); }
function paintBench(b){ var x0=BENCH.x0, x1=BENCH.x1, by=BENCH.base;
  for (var s=0;s<3;s++){ var y=by-26+s*4; b.rect(x0,y,x1-x0,3,P.w3); b.hl(x0,x1-1,y,P.w4); b.hl(x0,x1-1,y+2,P.w1); }
  b.rect(x0-1,by-14,x1-x0+2,3,P.w3); b.hl(x0-1,x1,by-14,P.w5); b.hl(x0-1,x1,by-12,P.w1);
  [x0+2,x1-4].forEach(function(lx){ b.rect(lx,by-27,2,27,P.m1); b.vl(lx,by-27,by-1,P.m2); b.rect(lx-1,by-1,4,1,P.m0); });
  b.hl(x0+2,x1-3,by-6,P.m1); }
function paintBus(b,tod){ var x0=BUS.x0, x1=BUS.x1, top=BUS.top, by=BUS.base, dawn=tod==='dawn', x, y, w=x1-x0;
  // Seite (schräg nach hinten)
  b.poly([[x1,top+3],[x1+18,top-4],[x1+18,by-10],[x1,by-2]],function(x,y){ var u=(x-x1)/18, yy=y-(top+3-u*7); var c=P.s4; if (yy>4 && yy<16) c=(((x-x1)%6)<1)?P.s3:(dawn?(hash(x,y>>2)<0.5?P.y3:P.c1):P.c1); if (yy>18 && yy<21) c=P.a3; if (yy>30) c=P.m2; return c; });
  // Front
  b.rect(x0,top,w,by-top,P.s5); b.hl(x0+1,x1-2,top,P.s6); b.vl(x0,top+1,by-1,P.s4); b.vl(x1-1,top+1,by-1,P.s3);
  b.rect(x0+4,top+2,w-8,7,P.k1); M.microText(b,'SARAJEVO',x0+((w-31)>>1),top+3,dawn?P.y4:P.y3);
  var wy0=top+10, wy1=top+30; b.rect(x0+2,wy0,w-4,wy1-wy0,P.c0);
  for (y=wy0;y<wy1;y++) for (x=x0+2;x<x1-2;x++){ var c=P.c0; if (y>wy1-8) c=P.k2; if (((x-x0)*0.7+y)%17<2) c=dawn?P.v2:P.b3; else if (((x-x0)*0.7+y)%17<3 && bayer(x,y)<0.5) c=dawn?P.v1:P.b2; if (dawn && y<wy0+5 && bayer(x,y)<0.35) c=P.y2; b.px(x,y,c); }
  b.vl(x0+(w>>1),wy0,wy1-1,P.k1); b.hl(x0+2,x1-3,wy0,P.k1);
  for (var sI=0;sI<4;sI++){ var sx=x0+6+sI*11; b.rect(sx,wy1-7,6,4,dawn?P.r1:P.c1); b.hl(sx,sx+5,wy1-7,dawn?P.r2:P.c2); }
  // Schild SARAJEVO hinter der Frontscheibe
  var cw=M.microWidth('SARAJEVO')+4, cx=x1-4-cw, cy=wy1-8; b.rect(cx,cy,cw,7,P.s6); b.hl(cx,cx+cw-1,cy+6,P.s3); M.microText(b,'SARAJEVO',cx+2,cy+1,P.k1); CACHE.busSign=[cx,cy,cw,7];
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
function paintTicket(b,tod){ var x0=TICK.x0, x1=TICK.x1, top=TICK.top, by=TICK.base, w=x1-x0, dawn=tod==='dawn';
  b.rect(x0,top,w,by-top,P.s3); b.vl(x0,top,by-1,P.s4); b.vl(x1-1,top,by-1,P.m2); b.rect(x0-1,top-3,w+2,3,P.m2); b.hl(x0-1,x1,top-3,P.s4);
  var sw=M.microWidth('BLAGAJNA')+4, sx=x0+((w-sw)>>1); b.rect(sx,top+2,sw,7,P.b1); b.hl(sx,sx+sw-1,top+2,P.b3); M.microText(b,'BLAGAJNA',sx+2,top+3,P.s6);
  b.rect(x0+5,top+12,w-10,16,dawn?P.y2:P.c1); for (var y=top+12;y<top+28;y++) for (var x=x0+5;x<x1-5;x++){ if (((x+y)%4)===0) b.px(x,y,P.m1); }
  b.rect(x0+11,top+18,8,8,dawn?P.y3:P.c2); b.ellipse(x0+15,top+24,3,1,P.m2); b.rect(x0+3,top+28,w-6,3,P.m3); b.hl(x0+3,x1-4,top+28,P.s5);
  b.rect(x0+5,top+33,w-10,8,P.s4); M.microText(b,'0-24',x0+((w-15)>>1),top+34,P.k2); }

// ---------------------------------------------------------------- Bild
var SKY=null;
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), sky=new Uint8Array(W*144);
  paintSky(b,tod); paintFar(b,tod); paintHarbor(b,tod);
  for (var i=0;i<W*144;i++) sky[i]=1;      // alles bis hier ist Himmel/Ferne/Wasser
  paintTerminal(b,tod); paintFerry(b,tod); paintQuay(b,tod);
  paintKioskBack(b); paintPalm(b); paintPole(b,tod); LAMPS.forEach(function(L){ paintLamp(b,L); });
  paintCanopy(b); paintBoard(b); paintBus(b,tod); paintTicket(b,tod); paintBench(b);
  // Himmel nur, wo nichts davor gemalt wurde (Wasser vorn wird mit umgefärbt? nein: es ist schon in Morgenfarben)
  var ref=new M.Buf(W,144,P.k0); paintSky(ref,tod); paintFar(ref,tod); paintHarbor(ref,tod); paintQuayWater(ref,tod);
  for (i=0;i<W*144;i++) if (b.d[i]!==ref.d[i]) sky[i]=0;
  SKY=sky;
  // harte Schatten bei Bura-Sonne (von links oben), weiche Kontaktschatten
  if (tod==='day'){ castShadows(b,sky); }
  gullsSit(b,tod);
  if (tod==='day'){ M.light(b,M.lf.sum(M.lf.pool(KIO.x1+6,KIO.base+1,14,3,-1.2),M.lf.pool(BUS.x0+26,BUS.base+2,30,3,-1.3),M.lf.pool(BENCH.x0+16,BENCH.base+1,18,2,-1),M.lf.pool(PALM.x+6,PALM.base+1,10,2,-1),M.lf.band(QB,QB+6,-0.6,0)),0,0,function(x,y){ return !sky[y*W+x]; }); }
  else { M.light(b,M.lf.sum(M.lf.pool(KIO.x1+4,KIO.base+1,14,3,-1),M.lf.pool(BUS.x0+26,BUS.base+2,30,3,-1.2),M.lf.pool(BENCH.x0+16,BENCH.base+1,18,2,-0.8),M.lf.k(-0.15)),0,0,function(x,y){ return !sky[y*W+x]; }); }
  shade(b,0,0,tod==='day'?'day':(TF[tod]?tod:'dawn'),lightsFor(tod),function(x,y){ return !!sky[y*W+x]; });
  if (tod!=='day') afterLights(b,tod);
  return b; }
// tiefe Novembersonne im Süden: Schatten fallen zum Betrachter hin nach links unten
function castShadows(b,sky){ var objs=[[KIO.x0+2,KIO.x1-2,KIO.base,26],[PALM.x-3,PALM.x+3,PALM.base,30],[POLE.x-1,POLE.x+1,POLE.base,24],[LAMPS[0][0]-1,LAMPS[0][0]+1,LAMPS[0][1],18],[LAMPS[1][0]-1,LAMPS[1][0]+1,LAMPS[1][1],18],[BENCH.x0,BENCH.x1,BENCH.base,10],[TICK.x0,TICK.x1,TICK.base,12]];
  objs.forEach(function(o){ var len=o[3]; for (var j=1;j<=len;j++){ var y=o[2]+Math.round(j*0.55), dx=-Math.round(j*0.75); if (y>=QF) break; for (var x=o[0]+dx;x<=o[1]+dx;x++){ if (x<0||x>=W) continue; var k=y*W+x; if (sky[k]) continue; var fade=j/len; if (bayer(x,y)<0.92-fade*0.45) b.px(x,y,M.DN[b.get(x,y)]); } } }); }
function gullsSit(b,tod){ [[154,QB-2],[266,QB-2],[236,45]].forEach(function(g,i){ var x=g[0], y=g[1]; b.px(x,y,P.s6); b.px(x+1,y,P.s6); b.px(x+2,y-1,P.s5); b.px(x-1,y,P.m2); b.px(x,y+1,P.s4); b.px(x+1,y+1,P.s4); b.px(x+3,y-1,P.y3); b.px(x,y+2,P.y3); }); }
function paintQuayWater(b,tod){ for (var x=276;x<W;x++) for (var y=QF+2;y<144;y++) b.px(x,y,seaCol(tod,x,y,0)); }
function afterLights(b,tod){
  // Laternen: links und rechts noch an, die mittlere ist schon aus (flackert dynamisch)
  TUBES.forEach(function(q){ b.hl(q[0]-7,q[0]+7,q[1],P.s6); b.hl(q[0]-6,q[0]+6,q[1]+1,P.n5); });
  [LAMPS[0]].forEach(function(L){ var x=L[0], top=L[1]-L[2]; b.poly([[x+2,top-5],[x+9,top-5],[x+8,top-2],[x+3,top-2]],P.y3); b.hl(x+3,x+8,top-2,P.y5); b.px(x+5,top-3,P.l1); });
  (CACHE.ferryLights||[]).forEach(function(l){ b.px(l[0],l[1],l[2]); });
  (CACHE.busLights||[]).forEach(function(q){ b.rect(q[0],q[1],4,3,P.y5); b.px(q[0]+1,q[1]+1,P.l1); });
  var s=CACHE.busSign; if (s){ b.rect(s[0],s[1],s[2],s[3],P.s5); b.hl(s[0],s[0]+s[2]-1,s[1]+6,P.s3); M.microText(b,'SARAJEVO',s[0]+2,s[1]+1,P.k1); }
  M.microText(b,'SARAJEVO',BUS.x0+((BUS.x1-BUS.x0-31)>>1),BUS.top+3,P.y4); }

// ---------------------------------------------------------------- Ebene: Kioskfassade (verdeckt Mira bis zur Brust)
function kioskLayer(S,tod){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, L=M.layer(x0-4,44,x1-x0+8,by-44+1,by), w=M.lw(L), dawn=tod==='dawn';
  // Dach mit Schild
  w.rect(x0-3,50,x1-x0+6,4,P.g2); w.hl(x0-3,x1+2,50,P.g4); w.hl(x0-3,x1+2,53,P.g1); w.rect(x0-1,46,x1-x0+2,4,P.s5); w.hl(x0-1,x1,46,P.s6); M.microText(L,'NOVINE',x0+((x1-x0-23)>>1)-L.ox,47-L.oy,P.r2);
  // Markise
  for (var x=x0-3;x<x1+3;x++){ var st=((x-x0+40)>>1)&1; w.px(x,54,st?P.r3:P.s5); w.px(x,55,st?P.r2:P.s4); if ((x&1)===0) w.px(x,56,st?P.r2:P.s4); }
  // Fensterrahmen (Öffnung bleibt frei: dort steht Mira)
  w.rect(x0,56,3,by-56,P.g2); w.vl(x0,56,by-1,P.g3); w.rect(x1-3,56,3,by-56,P.g1); w.vl(x1-1,56,by-1,P.g0);
  // Theke und Front mit Zeitschriften
  w.rect(x0,82,x1-x0,2,P.w3); w.hl(x0,x1-1,82,P.w4); w.rect(x0+1,84,x1-x0-2,by-84,P.g2); w.hl(x0+1,x1-2,84,P.g1);
  var covers=[[P.r3,P.s6],[P.b2,P.y4],[P.s5,P.r2],[P.y3,P.k1],[P.c3,P.s6],[P.d4,P.s5],[P.g4,P.s6],[P.s4,P.b1]];
  for (var r=0;r<3;r++) for (var c=0;c<4;c++){ var cx=x0+3+c*8, cy=86+r*8, col=covers[(r*4+c*3)%covers.length]; w.rect(cx,cy,7,7,col[0]); w.hl(cx+1,cx+5,cy+1,col[1]); w.hl(cx+1,cx+3,cy+3,col[1]); w.px(cx+5,cy+5,col[1]); w.hl(cx,cx+6,cy+6,M.DN[col[0]]); }
  w.rect(x0,by-3,x1-x0,3,P.g1);
  // Ständer mit Zeitungen an der Seite
  w.rect(x1+1,92,3,by-92,P.m1); for (var k=0;k<3;k++){ w.rect(x1+1,93+k*6,4,5,k===1?P.s4:P.s5); w.hl(x1+1,x1+4,94+k*6,P.k2); }
  var pre=tod==='day'?M.lf.xband(x0,x1,0.2,-0.6):null; if (pre) M.light(L,pre,L.ox,L.oy);
  shade(L,L.ox,L.oy,tod==='day'?'day':'dawn',lightsFor(tod));
  return L; }
function layers(S,GS,tod){ return [kioskLayer(S,tod)]; }

// ---------------------------------------------------------------- Bewegung: Wasser, Möwen, flackernde Laterne, Fahne
function dyn(fb,v,S,GS){ var cam=v.cam, tod=v.tod, x, y;
  for (y=QF+2;y<144;y++) for (x=276;x<W;x++){ var sx=x-cam; if (sx<0||sx>=fb.w) continue; fb.d[y*fb.w+sx]=seaCol(tod,x,y,v.t); }
  for (y=HZ+8;y<QB;y+=1) for (x=Math.max(0,cam);x<Math.min(W,cam+fb.w);x++){ var k=y*fb.w+(x-cam); if (!SKY||!SKY[y*W+x]) continue; if (((x+y*3)&7)!==0) continue; fb.d[k]=seaCol(tod,x,y,v.t); }
  if (tod==='day'){ M.scn.gulls(fb,v.t,0,8,W,40,5,cam); }
  else M.scn.gulls(fb,v.t*0.7,200,20,W-200,30,2,cam);
  // die mittlere Laterne flackert und geht aus
  if (tod!=='day'){ var L=LAMPS[1], lx=L[0]-cam, top=L[1]-L[2]; var on=Math.sin(v.t*9.3)+Math.sin(v.t*3.1)>1.2; if (on && lx>-10 && lx<fb.w+10){ fb.px(lx+4,top-4,P.y4); fb.px(lx+5,top-4,P.y3); fb.px(lx+6,top-4,P.y4); fb.px(lx+5,top-3,P.y5); } }
  // Fahne auf dem Terminal (Bura: kräftig, Morgengrauen: schlaff)
  var fx=TERM.x1-6-cam, fy=TERM.top-26, wind=tod==='day'?1:0.25; for (var i=0;i<10*wind+2;i++) for (var j=0;j<6;j++){ var wave=Math.round(Math.sin(v.t*8+i*0.8)*wind*1.2+(1-wind)*i*0.5); var c=j<2?P.r3:(j<4?P.s6:P.b1); var px=fx+1+i, py=fy+j+wave; if (px>=0&&px<fb.w&&py>=0) fb.px(px,py,tod==='day'?c:M.tintPx(M.TINT.dawn,c,px,py)); } }
function front(fb,v,S,GS){ if (v.tod==='day' && M.scn.weather(GS)==='bura') M.scn.buraDebris(fb,v.t,118,138,v.cam); }
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
    bus_sign:[BUS.x1-4-35,BUS.top+22,36,9],
    ticket_counter:[TICK.x0-1,TICK.top-3,TICK.x1-TICK.x0+2,TICK.base-TICK.top+3],
    timetable:[BOARD.x0,BOARD.y0,BOARD.x1-BOARD.x0,BOARD.y1-BOARD.y0],
    speaker:[POLE.x-14,POLE.base-56,29,22],
    sea:[278,139,202,5]
  },
  stands:{
    exit:[10,124,'L'], ferry:[200,114,'B'], terminal_bldg:[60,114,'B'], kiosk:[236,118,'B'], bench:[326,126,'R'], palm:[272,120,'R'],
    bus:[398,120,'B'], bus_sign:[404,118,'B'], ticket_counter:[460,118,'B'], timetable:[338,116,'B'], speaker:[306,118,'B'], sea:[380,134,'F']
  },
  actorPos:{ mira:[236,108,'F'], mala:[350,124,'F'] },
  start:[40,124,'R'], entries:{ map:[16,124,'R'] }
});
})(M);
