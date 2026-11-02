/* ===== rooms/art/archive.js — Archiv des Hafenbüros (nur Mala): hohe Metallregale voller Aktenordner =====
   Ein schmaler, staubiger Raum. Ordnerrücken mit Jahreszahlen 1946 … 1999 (gestapelte Mikroziffern), in Gruppen;
   im Regal der 40er steht der blaue Ordner „1984“ (Zahlendreher), bei den 80ern klafft die Lücke.
   Ein kleines hohes Fenster wirft einen Mondstrahl auf den Schreibtisch mit der abgedeckten Schreibmaschine.
   Wird fast immer in Malas Geistersicht gesehen: kräftige Hell-Dunkel-Kontraste, helle Etiketten. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var VP=[160,58], RECT=[24,2,296,104], SPEC={vp:VP,rect:RECT}, R3=M.room3(VP,136,104);
var LV=[2,36,70];                 // Oberkante jeder Regalreihe (Schild 6 px, Ordner 26 px, Brett 2 px)
var UNITS=[[60,140],[200,280]];   // Regaleinheiten (x0,x1)
var WINR=[152,10,24,16];          // kleines hohes Fenster
var DOOR=[27,50,27,54];           // Tür zurück ins Büro
var DESK=[144,196,80];            // Schreibtisch x0,x1,Platte
var BOXR=[278,58,19,46];          // Kartonstapel rechts
var BX=0, BY=0;                   // Position des falschen Ordners (aus paint)
var GAPX=0, GAPY=0;               // Position der Lücke
// Ordnerfarben je Jahrzehnt (dunkel, mittel, hell)
var DEC={ 40:['w0','w1','w2'], 50:['g0','g1','g2'], 60:['r0','r1','r2'], 70:['e0','e1','e2'], 80:['c0','c1','c2'], 90:['k1','m0','m1'] };
function R(s){ return M.R(s); }
function rc(a){ return a.map(function(n){ return P[n]; }); }
// ---------------------------------------------------------------- Ordner mit gestapelten Ziffern
var PAPER={40:['t5','d6'],50:['s4','d6'],60:['s4','s5'],70:['s4','s5'],80:['s5','s6'],90:['s5','s6']};
var LBM=new Uint8Array(320*144);   // Etikettenpixel (werden weniger abgedunkelt)
function binder(b,x,y,col,year,lean,paper){ var h=26, i, c=rc(col), pp=rc(paper||['s4','s5']);
  for (var yy=0;yy<h;yy++){ var dx=lean?Math.round(lean*(1-yy/h)):0;
    for (var xx=0;xx<7;xx++){ var cc=c[1]; if (xx===0) cc=c[2]; if (xx===6) cc=c[0]; if (yy===0) cc=c[2]; b.px(x+xx+dx,y+yy,cc); } }
  if (lean) return;
  b.rect(x+1,y+1,5,23,pp[1]); b.vl(x+5,y+1,y+23,pp[0]); b.hl(x+1,x+5,y+23,pp[0]); b.px(x+1,y+1,pp[0]);
  for (var ly=y+1;ly<=y+23;ly++) for (var lx=x+1;lx<=x+5;lx++) LBM[ly*320+lx]=1;
  var s=String(year); for (i=0;i<4;i++) M.microText(b,s[i],x+2,y+1+i*6-0,P.k1);
  b.px(x+3,y+25,P.k0); b.px(x+3,y+24,c[0]); }
// Regaleinheit aus Stahl: Pfosten mit Lochung, Bretter, dunkle Rückwand
function unit(b,x0,x1){ var y, x;
  for (y=RECT[1];y<RECT[3];y++) for (x=x0;x<x1;x++) b.px(x,y,(bayer(x,y)<0.3)?P.k2:P.k1);
  [x0,x1-3].forEach(function(px){ for (var yy=RECT[1];yy<RECT[3];yy++){ b.px(px,yy,P.m3); b.px(px+1,yy,P.m2); b.px(px+2,yy,P.m1); if (yy%4===1) b.px(px+1,yy,P.k1); } });
  LV.forEach(function(ly){ var by=ly+32; b.hl(x0,x1-1,by,P.m3); b.hl(x0,x1-1,by+1,P.m1); b.hl(x0+3,x1-4,by+2,P.k0); }); }
function plate(b,x,y,txt){ var w=M.microWidth(txt)+4; for (var ly=y;ly<y+7;ly++) for (var lx=x;lx<x+w;lx++) LBM[ly*320+lx]=1; b.rect(x,y,w,7,P.s5); b.hl(x,x+w-1,y,P.s6); b.hl(x,x+w-1,y+6,P.s3); b.vl(x+w-1,y,y+6,P.s3); M.microText(b,txt,x+2,y+1,P.k1); b.px(x+1,y-1,P.m2); b.px(x+w-2,y-1,P.m2); }
function row(b,x0,ly,dec,years,opt){ opt=opt||{}; var x=x0+4, y=ly+6;
  plate(b,x0+4,ly,String(1900+dec)+'-'+String(dec+9));
  years.forEach(function(yv){ if (yv==='gap'){ GAPX=x; GAPY=y; for (var yy=y;yy<y+26;yy++) for (var xx=x;xx<x+7;xx++) b.px(xx,yy,(bayer(xx,yy)<0.2)?P.k1:P.k0); x+=7; return; }
    if (yv==='lean'){ binder(b,x,y,DEC[dec],0,-3); x+=7; return; }
    var col=DEC[dec], pap=PAPER[dec]; if (yv===1984 && dec===40){ col=['c1','c2','c3']; pap=['s5','s6']; BX=x; BY=y; }
    binder(b,x,y,col,yv,0,pap); x+=7; });
  return x; }
// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(320,144,P.k0), night=tod==='night', x, y; LBM.fill(0);
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ var c=(hash(Math.floor(x/3),Math.floor(y/2))<0.1)?P.m1:P.m2; if (bayer(x,y)<0.18) c=P.m3; if (y>94) c=(y>101)?P.k2:P.m1; return c; },
    side:function(u,v,x,y,sd){ var c=(bayer(x,y)<0.4)?P.m1:P.m0; return c; },
    floor:function(xb,d,x,y){ var c=tex.planks(xb,y,VP[1],RECT[3],R('w0 w1 w2 w3'),13); if (hash(Math.floor(xb/3),y>>1)<0.05) c=P.s1; return c; },
    ceil:function(xb,d,x,y){ return P.k2; } });
  // ---- Regale: links 40er/50er/60er, rechts 70er/80er/90er
  var U0=UNITS[0], U1=UNITS[1];
  unit(b,U0[0],U0[1]); unit(b,U1[0],U1[1]);
  var ex=row(b,U0[0],LV[0],40,[1946,1947,1948,1984,1949]);
  // Rest der 40er-Reihe: liegende Ordner, ein Stoß Papier
  b.rect(ex+2,LV[0]+27,22,5,P.w1); b.hl(ex+2,ex+23,LV[0]+27,P.w2); b.rect(ex+3,LV[0]+22,20,5,P.e1); b.hl(ex+3,ex+22,LV[0]+22,P.e2); for (x=ex+3;x<ex+23;x+=2) b.px(x,LV[0]+24,P.s4);
  b.rect(ex+5,LV[0]+16,14,6,P.s4); b.hl(ex+5,ex+18,LV[0]+16,P.s5); b.hl(ex+6,ex+17,LV[0]+19,P.s3);
  row(b,U0[0],LV[1],50,[1950,1951,1952,1953,1954,1955,1956,1957,1958,1959]);
  row(b,U0[0],LV[2],60,[1960,1961,1962,1963,1964,1965,1966,1967,1968,1969]);
  row(b,U1[0],LV[0],70,[1970,1971,1972,1973,1974,1975,1976,1977,1978,1979]);
  row(b,U1[0],LV[1],80,[1980,1981,1982,1983,'gap','lean',1986,1987,1988,1989]);
  row(b,U1[0],LV[2],90,[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999]);
  // der schräg in die Lücke gekippte Ordner zeigt 1985 nur halb: Etikett auf der Kante
  b.rect(GAPX+8,GAPY+2,3,20,P.s4);
  // ---- Mitte: hohes Fenster mit Gitter, Schreibtisch mit abgedeckter Schreibmaschine
  windowPaint(b,tod);
  desk(b);
  // ---- Kartons rechts (2000er), Tür links
  boxes(b);
  door(b);
  // ---- Spinnweben in den Ecken und zwischen den Regalen
  web(b,24,2,1,1); web(b,295,2,-1,1); web(b,U0[1]-1,LV[1]+6,1,1,8); web(b,U1[0]+2,LV[0]+7,1,1,7); web(b,141,3,1,1,9);
  // ---- Licht: alles dunkel, ein Mondstrahl vom Fenster auf Tisch und Boden
  var wx=WINR[0]+WINR[2]/2, wy=WINR[1]+WINR[3];
  var beam=M.lf.beam(wx-4,wy-4,wx+44,128,9,30,night?3.2:2.2);
  M.light(b,M.lf.sum(M.lf.k(-1.75),beam,M.lf.pool(wx,wy-6,26,22,0.8),M.lf.vignette(320,144,1.4),M.lf.pool(DOOR[0]+13,RECT[3]+2,24,6,0.9)),0,0,function(x,y){ return !inWin(x,y) && !LBM[y*320+x]; });
  M.light(b,M.lf.sum(M.lf.k(-0.8),M.lf.vignette(320,144,0.8)),0,0,function(x,y){ return LBM[y*320+x]===1; });
  // Abbild des Fensters auf dem Boden: verzerrtes Viereck mit den Schatten der Gitterstäbe
  var FP=[[176,112],[214,112],[236,134],[190,134]];
  b.poly(FP,function(x,y){ var t=(y-112)/22, xl=176+t*14, xr=214+t*22, u=(x-xl)/(xr-xl); var bar=(Math.abs(((u*WINR[2]-3)%5+5)%5)<0.9); var mid=Math.abs(t-0.5)<0.05;
    var c=b.get(x,y), up=(bar||mid)?0:(night?3:2); if (u<0.06||u>0.94||t<0.05||t>0.95) up=Math.max(0,up-1); while (up>0){ c=M.UP[c]; up--; } return c; });
  // Staub in der Luft des Strahls: einzelne helle Punkte
  for (var i=0;i<70;i++){ var t=hash(i,3), px=Math.round(wx-2+t*46+(hash(i,4)-0.5)*14*t), py=Math.round(wy+t*104); if (px<0||px>=320||py>=140) continue; if (hash(i,5)<0.5) b.px(px,py,M.UP[M.UP[b.get(px,py)]]); }
  return M.finishTOD(b,tod,{ sky:function(){ return true; }, after:function(b,tod){
    // Lichtspalt unter der Tür (Neon aus dem Büro), Schlüsselloch
    b.hl(DOOR[0]+1,DOOR[0]+DOOR[2]-2,DOOR[1]+DOOR[3]-1,P.a6); b.hl(DOOR[0]+3,DOOR[0]+DOOR[2]-4,DOOR[1]+DOOR[3]-1,P.s6); b.px(DOOR[0]+DOOR[2]-5,DOOR[1]+31,P.a5);
    for (var xx=DOOR[0];xx<DOOR[0]+DOOR[2];xx++){ if (bayer(xx,DOOR[1]+DOOR[3])<0.5) b.px(xx,DOOR[1]+DOOR[3],P.m2); } } }); }
var WM=new Uint8Array(320*144);
function inWin(x,y){ return WM[y*320+x]===1; }
function windowPaint(b,tod){ var x0=WINR[0], y0=WINR[1], w=WINR[2], h=WINR[3], x, y, night=tod==='night';
  WM.fill(0);
  b.rect(x0-3,y0-3,w+6,h+6,P.m1); b.hl(x0-3,x0+w+2,y0-3,P.m2); b.hl(x0-4,x0+w+3,y0+h+2,P.m3); b.hl(x0-4,x0+w+3,y0+h+3,P.m1);
  var sky=night?R('n0 n1 n2 n3'):(tod==='day'?R('b2 b3 b4'):R('d1 d2 d3 d4'));
  for (y=y0;y<y0+h;y++) for (x=x0;x<x0+w;x++){ var c=M.rampAt(sky,0.3+(y-y0)/h*0.6,x,y); if (hash(x>>1,y>>1)<0.12) c=M.DN[c]; b.px(x,y,c); WM[y*320+x]=1; }
  if (night){ b.ellipse(x0+w-7,y0+6,4.5,4.5,function(x,y){ return ((x-(x0+w-7))*0.6+(y-(y0+6))*0.6>1)?P.n5:P.l1; }); }
  else { for (x=x0;x<x0+w;x++) if (bayer(x,y0+h-2)<0.6) b.px(x,y0+h-2,P.d5); }
  // Gitterstäbe und Sprosse
  for (x=x0+3;x<x0+w;x+=5) b.vl(x,y0,y0+h-1,P.k1); b.hl(x0,x0+w-1,y0+(h>>1),P.m1);
  for (x=x0+3;x<x0+w;x+=5) WM[(y0+(h>>1))*320+x]=1; }
function desk(b){ var x0=DESK[0], x1=DESK[1], ty=DESK[2], x, y;
  // Platte, Schublade, Beine
  b.rect(x0,ty,x1-x0,3,P.w3); b.hl(x0,x1-1,ty,P.w4); b.hl(x0,x1-1,ty+3,P.w0);
  b.rect(x0+2,ty+4,x1-x0-4,6,P.w2); b.hl(x0+2,x1-3,ty+9,P.w1); b.rect(x0+(x1-x0)/2-3,ty+6,6,1,P.w4);
  [x0+2,x1-5].forEach(function(lx){ b.rect(lx,ty+10,3,RECT[3]-ty-10,P.w1); b.vl(lx,ty+10,RECT[3]-1,P.w2); });
  // Stuhl, untergeschoben
  b.rect(166,ty-6,14,2,P.w2); b.vl(166,ty-6,RECT[3]-1,P.w1); b.vl(179,ty-6,RECT[3]-1,P.w1); b.rect(167,ty+12,12,2,P.w2);
  // abgedeckte Schreibmaschine: Stoffhaube mit Falten
  for (y=ty-13;y<ty;y++){ var t=(y-(ty-13))/13, hw=Math.round(9+t*5+Math.sin(t*3)*0.5); for (x=170-hw;x<=170+hw;x++){ var u=(x-(170-hw))/(2*hw); var c=(u<0.3)?P.m3:(u<0.75?P.m2:P.m1); if (Math.sin(x*0.9+y*0.15)>0.75) c=M.DN[c]; if (y===ty-13) c=P.m3; b.px(x,y,c); } }
  b.hl(156,184,ty-1,P.m1); b.px(164,ty-6,P.m4); b.px(165,ty-7,P.m4);
  // Papiere, Stempelkissen, Tintenfass
  b.rect(148,ty-2,9,2,P.s5); b.hl(149,156,ty-3,P.s4); b.rect(186,ty-2,6,2,P.k2); b.hl(186,191,ty-3,P.r1); b.rect(190,ty-5,3,3,P.k1); b.px(191,ty-6,P.m2); }
function boxes(b){ var x0=BOXR[0], w=BOXR[2];
  [[x0,80,w,24,'2000'],[x0+1,62,w-2,18,'2005'],[x0-1,48,w-1,14,'']].forEach(function(k,i){ var x=k[0], y=k[1], ww=k[2], hh=k[3];
    for (var yy=y;yy<y+hh;yy++) for (var xx=x;xx<x+ww;xx++){ var c=(xx===x)?P.e3:((xx===x+ww-1)?P.e1:P.e2); if (yy===y) c=P.e4; if (yy===y+3 && xx>x+2 && xx<x+ww-3) c=P.e1; if (hash(xx,yy>>1)<0.06) c=P.e1; b.px(xx,yy,c); }
    b.vl(x+Math.floor(ww/2),y,y+3,P.e4);
    if (k[4]){ var pw=17, px0=x+Math.floor((ww-pw)/2); b.rect(px0,y+6,pw,7,P.s5); b.hl(px0,px0+pw-1,y+12,P.s3); M.microText(b,k[4],px0+1,y+7,P.k1); } });
  // Karton vor dem rechten Regal, offen, mit Papieren
  b.rect(204,94,22,10,P.e2); b.hl(204,225,94,P.e4); b.vl(204,94,103,P.e3); b.line(204,94,200,89,P.e3); b.line(225,94,229,90,P.e1); b.rect(207,92,15,2,P.s4); b.hl(208,220,91,P.s5); }
function door(b){ var x=DOOR[0], y=DOOR[1], w=DOOR[2], h=DOOR[3];
  b.rect(x-2,y-2,w+4,h+2,P.m1); b.hl(x-2,x+w+1,y-2,P.m2); b.vl(x+w+1,y-2,y+h-1,P.k2);
  for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=P.m2; if (xx===x) c=P.m3; if (xx===x+w-1) c=P.m1; if ((yy-y===10||yy-y===40)&&xx>x+2&&xx<x+w-3) c=P.m1; if (hash(xx>>1,yy>>2)<0.06) c=P.m1; b.px(xx,yy,c); }
  b.rect(x+w-6,y+30,4,1,P.m4); b.rect(x+w-5,y+31,2,2,P.k1);
  // Zettel an der Tür (Rückseite des Schildes): Prüfvermerk
  b.rect(x+6,y+14,10,12,P.s4); b.hl(x+7,x+14,y+17,P.s2); b.hl(x+7,x+13,y+19,P.s2); b.hl(x+7,x+14,y+21,P.s2); b.px(x+11,y+14,P.m3); }
// Spinnennetz: Ecke (x,y), Richtung sx,sy, Größe
function web(b,x,y,sx,sy,n){ n=n||12; for (var k=0;k<5;k++){ var a=k/4*Math.PI/2; b.line(x,y,Math.round(x+Math.cos(a)*n*sx),Math.round(y+Math.sin(a)*n*sy),P.s3); }
  for (var r=3;r<=n;r+=3){ var prev=null; for (var k2=0;k2<5;k2++){ var a2=k2/4*Math.PI/2, rr=r*(k2%2?0.92:1), p=[Math.round(x+Math.cos(a2)*rr*sx),Math.round(y+Math.sin(a2)*rr*sy+1)]; if (prev) b.line(prev[0],prev[1],p[0],p[1],(r>n-3)?P.s2:P.s3); prev=p; } } }

// ---------------------------------------------------------------- Vordergrund: Kartonstapel rechts vorn
function layers(S,GS,tod){ var L=[], l=M.layer(286,104,34,40,141), w=M.lw(l);
  [[288,120,30,21],[291,106,24,15]].forEach(function(k){ var x=k[0], y=k[1], ww=k[2], hh=k[3]; for (var yy=y;yy<y+hh;yy++) for (var xx=x;xx<Math.min(320,x+ww);xx++){ var c=(xx===x)?P.e3:P.e2; if (yy===y) c=P.e4; if (yy===y+4&&xx>x+2) c=P.e1; w.px(xx,yy,c); } w.vl(x+Math.floor(ww/2),y,y+4,P.e4); });
  w.rect(295,126,17,7,P.s5); w.hl(295,311,132,P.s3); w.micro('1946',296,127,P.k1);
  M.light(l,M.lf.k(-2.4),l.ox,l.oy); L.push(l); return L; }

// ---------------------------------------------------------------- jedes Bild: Staub im Mondstrahl
function dyn(fb,v,S,GS){ var wx=WINR[0]+WINR[2]/2, wy=WINR[1]+WINR[3], t=v.t;
  for (var i=0;i<16;i++){ var ph=(hash(i,11)+t*(0.02+hash(i,12)*0.03))%1, px=Math.round(wx-2+ph*44+Math.sin(t*0.6+i)*3), py=Math.round(wy+ph*100+Math.sin(t*0.4+i*2)*2); if (px<0||px>=320||py<0||py>=140) continue; if (Math.sin(t*1.3+i*1.7)>0.1){ var k=py*320+px; fb.d[k]=M.UP[M.UP[fb.d[k]]]; } } }
// ---------------------------------------------------------------- nur Malas Sicht: Staubfäden im Mondlicht, der falsche Ordner schimmert
function ghost(fb,v,S,GS){ var t=v.t, wx=WINR[0]+WINR[2]/2, wy=WINR[1]+WINR[3];
  for (var i=0;i<7;i++){ var x0=wx-4+i*7+Math.sin(t*0.3+i)*3, len=26+hash(i,2)*40, y0=wy+4+hash(i,3)*30;
    for (var s=0;s<len;s++){ var yy=Math.round(y0+s), xx=Math.round(x0+s*0.4+Math.sin(t*0.9+s*0.12+i)*1.5); if (xx<0||xx>=320||yy<0||yy>=140) continue; var on=((s+Math.floor(t*6+i*5))%9)<5; if (on) fb.d[yy*320+xx]=(s%4===0)?P.x5:P.x3; } }
  for (var j=0;j<20;j++){ var ph=(hash(j,21)+t*(0.03+hash(j,22)*0.03))%1, px=Math.round(wx-6+ph*48+Math.sin(t*0.7+j)*4), py=Math.round(wy+ph*104); if (px>=0&&px<320&&py>=0&&py<140&&Math.sin(t*2+j)>-0.2) fb.d[py*320+px]=(j%3)?P.x4:P.x6; }
  if (!(GS.flags||{})['c1.found1984']){ var a=(Math.sin(t*2.1)+1)/2;
    // Glanz um den Ordner (geditherter Lichthof), Etikett hell, kleine aufsteigende Funken
    for (var yy=BY-4;yy<=BY+29;yy++) for (var xx=BX-4;xx<=BX+10;xx++){ if (xx<0||xx>=320) continue; var dx=Math.max(0,Math.max(BX-xx,xx-(BX+6))), dy=Math.max(0,Math.max(BY-yy,yy-(BY+25))), d=Math.hypot(dx,dy)/4.5; if (d>=1) continue;
      var inside=(dx===0&&dy===0), k=yy*320+xx; if (inside){ if (xx>BX&&xx<BX+6&&yy>BY&&yy<BY+24){ var c0=fb.d[k]; fb.d[k]=(c0===P.x0||c0===P.a0||c0===P.k0||c0===P.k1||c0===P.a1)?c0:(a>0.5?P.x6:P.x5); } }
      else if (bayer(xx,yy)<(1-d)*(0.35+a*0.4)) fb.d[k]=M.UP[M.UP[fb.d[k]]]; }
    for (var q=0;q<5;q++){ var ph2=(t*0.45+q*0.2)%1, sx=Math.round(BX+3+Math.sin(t*1.7+q*2)*4), sy=Math.round(BY+20-ph2*30); if (sy>=0) fb.px(sx,sy,ph2<0.55?P.x6:P.x4); } } }

// ---------------------------------------------------------------- Laufflächen (nur Mala)
function walk(x,y){ return y>=108 && y<=138 && x>8 && x<312 && !(x>284 && y<142 && y>116); }
M.defineArt('archive',{
  width:320, paint:paint, layers:layers, walk:function(){ return false; }, walkG:walk, dynamic:dyn, ghost:ghost,
  spots:{ door:[DOOR[0]-2,DOOR[1]-2,DOOR[2]+4,DOOR[3]+2], shelf_40s:[UNITS[0][0],LV[0],UNITS[0][1]-UNITS[0][0],34], binder_1948:[0,0,0,0], shelf_80s:[UNITS[1][0],LV[1],UNITS[1][1]-UNITS[1][0],34],
    gap_1984:[0,0,0,0], desk:[DESK[0],DESK[2]-14,DESK[1]-DESK[0],RECT[3]-DESK[2]+14], window:[WINR[0]-4,WINR[1]-4,WINR[2]+8,WINR[3]+8], boxes:[BOXR[0]-2,BOXR[1]-12,BOXR[2]+6,BOXR[3]+12] },
  stands:{ door:[42,112,'B'], shelf_40s:[100,112,'B'], binder_1948:[86,111,'B'], shelf_80s:[240,112,'B'], gap_1984:[230,111,'B'], desk:[170,112,'B'], window:[164,114,'B'], boxes:[278,112,'R'] },
  start:[44,116,'R'], entries:{ office:[44,114,'R'] }
});
// Spots der beiden kleinen Ziele aus der Regalgeometrie (feste Werte, unabhängig von paint)
(function(){ var A=M.ART.archive, x=UNITS[0][0]+4+3*7, y=LV[0]+6; A.spots.binder_1948=[x-1,y-1,9,28]; var gx=UNITS[1][0]+4+4*7, gy=LV[1]+6; A.spots.gap_1984=[gx-1,gy-1,9,28]; })();
})(M);
