/* ===== rooms/art/oldtown.js — Altstadt: der Peristil des Diokletianpalastes an einem Bura-Tag.
   Links der Säulengang (weißer Kalkstein, rote Granitsäulen, Bögen), dahinter die Kathedrale und der hohe Glockenturm von Sv. Duje,
   die schwarze Sphinx, in der Mitte die Stufen zum Protiron und Vestibül, rechts ein Zeitungskiosk, eine Gasse mit Wäsche und Ninas Laden „Okvir“.
   Harte Sonne von links oben, klare Schatten, tiefblauer Himmel. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=480, GY=100;                                     // Breite, Fußlinie der Fassaden
var LIT=M.R('s3 s4 s5 s6'), SHD=M.R('m2 m3 s2 s3'), OPEN=M.R('m1 m2 m2 s2'), DEEP=M.R('k2 m0 m1 m2');
var COLS=[6,36,66,96,126,156], SPR=50, ARR=11;        // Säulengang: Säulenmitten, Kämpferlinie, Bogenradius
var CORN=28;                                           // Oberkante Gesims des Säulengangs
var TWR={x:198,w:26};                                  // Glockenturm (Mitte, Breite unten)
var PRO={x0:224,x1:336,top:88,cols:[236,259,301,324],apex:16,arc:[280,44,14]};   // Protiron mit Stufen
var KIO={x0:342,x1:364,base:106};                      // Zeitungskiosk
var ALY={x0:366,x1:404};                               // Gasse
var SHOP={x0:404,win:[411,66,28,34],door:[448,62,22,42],sign:[411,49,60,13]};
var SUN=[11,15];                                       // Lichtversatz: Sonne von links oben
var LINES=[[368,24,410,20],[372,42,408,38]];           // Wäscheleinen über der Gasse
var CLINE=[[70,58,92,58],[100,58,122,58]];             // Wäscheleinen zwischen den Säulen
function rnd(v){ return Math.round(v); }
function lime(x,y,sh,sw,hh){ return tex.ashlar(x,y,sh===2?OPEN:(sh?SHD:LIT),sw||17,hh||8); }
function shadePx(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||2))); }

// ---------------------------------------------------------------- Himmel (Bura: tiefblau, klar, ein paar Federwolken)
function sky(b){ for (var y=0;y<GY;y++) for (var x=0;x<W;x++) b.px(x,y,M.rampAt(M.R('b0 b1 b2 b3 b4'),0.06+y/115,x,y));
  for (var i=0;i<6;i++){ var cx=20+i*83+hash(i,2)*30, cy=5+hash(i,3)*14, L=26+hash(i,4)*36; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+Math.sin(k*0.09+i)*1.5+k*0.04); var a=0.55-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) b.px(xx,yy,P.b3); if (bayer(xx,yy)<a-0.3) b.px(xx,yy,P.b4); } } }

// ---------------------------------------------------------------- Pflaster: polierter Kalkstein in Perspektive
var HZ=36, VPX=240;
function paving(b){ for (var y=GY;y<144;y++){ var d=y-HZ, rz=1500/d, row=Math.floor(rz), fy=rz-row, off=(row%2)*0.5+hash(row,7)*0.3;
    for (var x=0;x<W;x++){ var X=(x-VPX)/d*3.4+off, col=Math.floor(X), fx=X-col, jw=d/3.4/ (d)*0.9/ (d/64);
      var t=hash(col,row), c=t<0.25?P.s4:(t<0.8?P.s5:(t<0.93?P.s6:P.s4));
      var edge=(fx<0.9/(d/3.4*0.29)*0.08) || fx<0.035;   // Fuge senkrecht
      if (edge) c=P.s3; if (fy<0.06+12/(d*d)*8) c=P.s3; if (fy<0.04) c=P.s2;
      // Glanz: polierte Stellen, ausgetretene Mitte
      var g=hash(x>>1,y); if (g<0.05) c=M.DN[c]; else if (g>0.985) c=P.l0;
      if (c===P.s5 && Math.sin(x*0.05+y*0.4+t*6)>0.93) c=P.s6;
      b.px(x,y,c); } } }

// ---------------------------------------------------------------- Kathedrale hinter dem Säulengang: achteckiger Tambour, Zeltdach
function cathedral(b){ var x, y;
  for (y=17;y<CORN;y++) for (x=26;x<150;x++){ var u=(x-26)/124, c=lime(x,y,u>0.7?1:0,12,5); if (Math.abs(u-0.7)<0.009) c=P.s2; b.px(x,y,c); }
  for (var k=0;k<7;k++){ var ax=31+k*17; for (y=19;y<27;y++) for (x=ax;x<ax+7;x++){ var dx=x-ax-3, top=y<22?(dx*dx>(y-19)*3.5):false; if (top) continue; b.px(x,y,(x<ax+2||y<21)?P.s2:(ax>113?P.m2:P.s3)); } }   // Blendarkaden
  b.hl(24,151,17,P.s6); b.hl(24,151,18,P.s3);
  for (y=8;y<17;y++){ var x0=40+(16-y)*5.2-(16-y)*0.3, x1=138-(16-y)*5.2; for (x=rnd(x0);x<rnd(x1);x++){ var u2=(x-x0)/Math.max(1,x1-x0), c2=((x+y*2)%4===0)?P.t1:(u2<0.55?P.t4:(u2<0.8?P.t3:P.t2)); if ((y%3)===0) c2=M.DN[c2]; b.px(x,y,c2); } }
  // niedrige Mauern der Kathedrale hinter dem Turm (offener Schatten)
  for (y=62;y<94;y++) for (x=160;x<226;x++) b.px(x,y,lime(x,y,2,13,6));
  b.hl(160,225,62,P.s5); b.hl(160,225,63,P.s3); }

// ---------------------------------------------------------------- Säulengang
function inOpening(x,y,i){ var a=COLS[i], z=COLS[i+1], xl=a+4, xr=z-4, cx=(a+z)/2; if (x<xl||x>=xr) return false; if (y>=SPR) return y<94; var dx=x-cx+0.5, dy=y-SPR; return dx*dx+dy*dy<ARR*ARR; }
function openingAt(x,y){ for (var i=0;i<COLS.length-1;i++) if (inOpening(x,y,i)) return i; return -1; }
function granite(x,y,cx,r){ var u=(x-cx)/r, v=0.66-u*0.55-(u>0.4?0.28:0); if (Math.abs(u+0.45)<0.14) v+=0.3;
  var c=M.rampAt(M.R('t1 t2 t3 t4'),v+(hash(x,y>>1)-0.5)*0.16,x,y); var h=hash(x*3+1,y*5+2); if (h<0.07) c=(u<0.2)?P.s4:P.t0; else if (h>0.955) c=P.t0; return c; }
function capital(b,cx,y0,sh){ // korinthisch, 9 px hoch, oben 13 px breit; y0 = Oberkante
  var L=sh?SHD:LIT; for (var j=0;j<9;j++){ var hw=4+Math.round(j*0.35)+(j<2?2:0); for (var x=cx-hw;x<=cx+hw-1;x++){ var u=(x-cx+hw)/(2*hw), c=u<0.35?L[3]:(u<0.7?L[2]:L[1]);
      if (j<2){ c=(j===0)?L[3]:L[1]; if (u>0.75) c=M.DN[c]; }
      else if (j<4){ if (x===cx-hw||x===cx+hw-1) c=L[0]; else if (x===cx-hw+1||x===cx+hw-2) c=L[3]; }
      else { var leaf=((x-cx+20)%3); c=leaf===0?L[1]:(leaf===1?L[3]:L[2]); if (j===4&&leaf!==1) c=L[0]; if (j>=7) c=(leaf===1)?L[2]:L[1]; if (u>0.72) c=M.DN[c]; }
      b.px(x,y0+8-j,c); } } }
function colBase(b,cx,y0){ b.rect(cx-6,y0,12,3,P.s5); b.hl(cx-6,cx+5,y0,P.s6); b.hl(cx-6,cx+5,y0+2,P.s3); b.vl(cx+5,y0,y0+2,P.s3);
  b.hl(cx-5,cx+4,y0-1,P.s5); b.px(cx+4,y0-1,P.s3); b.hl(cx-4,cx+3,y0-2,P.s2); b.hl(cx-5,cx+4,y0-3,P.s6); b.px(cx+4,y0-3,P.s4); }
function colonnade(b){ var x, y, i;
  for (y=CORN;y<94;y++) for (x=0;x<166;x++) b.px(x,y,lime(x,y,0,15,7));
  // Öffnungen: Gang im Schatten, Sonnenflecken durch die Bögen auf Rückwand und Boden
  for (y=SPR-ARR;y<94;y++) for (x=0;x<166;x++){ var o=openingAt(x,y); if (o<0) continue;
    var lit=openingAt(x-SUN[0],y-SUN[1])===o, c;
    if (y>=87) c=lit?(y===87?P.s4:P.s5):(y===87?P.m1:P.m2);
    else c=tex.ashlar(x*1.15,y,lit?M.R('s2 s4 s4 s5'):OPEN,12,6);
    if (!lit && y<SPR-2) c=M.DN[c];
    b.px(x,y,c); }
  [[47,66,7,21],[107,64,8,23]].forEach(function(d){ b.rect(d[0],d[1],d[2],d[3],P.k1); b.ellipse(d[0]+d[2]/2,d[1],d[2]/2,3,P.k1); b.vl(d[0]+d[2],d[1],d[1]+d[3]-1,P.m3); });   // Türen hinten
  // Bogenringe aus Keilsteinen
  for (i=0;i<COLS.length-1;i++){ var cx=(COLS[i]+COLS[i+1])/2;
    for (y=SPR-ARR-5;y<=SPR;y++) for (x=rnd(cx-ARR-5);x<=rnd(cx+ARR+5);x++){ var dx=x-cx+0.5, dy=y-SPR, rr=Math.sqrt(dx*dx+dy*dy); if (rr<ARR||rr>ARR+4.4||dy>0) continue;
      var ang=Math.atan2(-dy,dx), q=ang/(Math.PI/9), c2=(Math.abs(q-Math.round(q))<0.1)?P.s3:((Math.floor(q)%2)?P.s5:P.s6); if (rr>ARR+3.5) c2=P.s4; if (rr<ARR+1) c2=(dx>0)?P.s4:P.s2; b.px(x,y,c2); } }
  // Säulen
  COLS.forEach(function(cx){ for (y=SPR+9;y<91;y++) for (x=cx-4;x<cx+4;x++) b.px(x,y,granite(x,y,cx-0.5,4));
    b.hl(cx-4,cx+3,SPR+9,P.s5); b.hl(cx-4,cx+3,90,P.s4); capital(b,cx,SPR,false); colBase(b,cx,91); });
  // Gesims mit Zahnschnitt, Schatten darunter
  b.rect(0,CORN,166,6,P.s5); b.hl(0,165,CORN,P.s6); b.hl(0,165,CORN+1,P.s6); b.hl(0,165,CORN+3,P.s3); for (x=0;x<166;x+=3){ b.px(x,CORN+4,P.s2); b.px(x+1,CORN+4,P.s5); } b.hl(0,165,CORN+5,P.s4);
  for (x=0;x<166;x++) for (y=CORN+6;y<CORN+9;y++) if (bayer(x,y)<(CORN+9-y)/3.4) shadePx(b,x,y,2);
  // Stylobat: zwei Stufen, Schlagschatten der Säulen nach rechts
  for (y=94;y<GY;y++) for (x=0;x<PRO.x0;x++){ var st=y<97?0:1, c3=(y===94||y===97)?P.s6:(st?P.s4:P.s5); if (hash(x>>3,y)<0.1) c3=M.DN[c3]; if (((x+st*7)%23)===0) c3=P.s3; b.px(x,y,c3); }
  COLS.forEach(function(cx){ for (y=94;y<GY;y++){ var sx=cx+4+(y-94)*0.7; for (x=rnd(sx);x<rnd(sx+6);x++) shadePx(b,x,y,2); } });
  CLINE.forEach(function(l){ for (x=l[0];x<=l[2];x++) b.px(x,l[1]+Math.round(Math.sin((x-l[0])/(l[2]-l[0])*Math.PI)*2),P.k2); }); }

// ---------------------------------------------------------------- Glockenturm von Sv. Duje: romanisch, nach oben immer offener
function bell(b,cx,y){ b.hl(cx-1,cx+1,y,P.y1); b.rect(cx-2,y+1,5,2,P.y2); b.hl(cx-3,cx+3,y+3,P.y1); b.px(cx-1,y+1,P.y4); b.px(cx,y+4,P.y0); }
function arched(b,x0,y0,w,h,inner){ // dunkle Bogenöffnung, Schatten oben links
  for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ if (y===y0 && (x===x0||x===x0+w-1) && w>2) continue; var c=(x===x0||y<y0+2)?P.k1:(inner||P.n0); b.px(x,y,c); } }
function tower(b){ var cx=TWR.x, x, y;
  // Schlagschatten des Turms auf die Mauer rechts
  for (y=62;y<94;y++) for (x=cx+13;x<cx+24-(y-62)*0.1;x++) shadePx(b,x,y,1);
  var st=[[68,96,26,0],[55,68,26,1],[43,55,24,2],[31,43,22,3],[19,31,20,4]];   // [oben, unten, Breite, Typ]
  st.forEach(function(s){ var y0=s[0], y1=s[1], w=s[2], xl=cx-(w>>1), xr=xl+w-1, side=Math.max(3,w>>2);
    for (y=y0;y<y1;y++) for (x=xl;x<=xr;x++){ var c=tex.ashlar((x-xl)*1.25+s[3]*7,y,x>xr-side?SHD:LIT,9,5); if (x===xl) c=P.s6; if (x===xr-side+1) c=P.s3; if (x===xr) c=P.m2; b.px(x,y,c); }
    b.hl(xl-1,xr+1,y0,P.s6); b.hl(xl-1,xr-side,y0+1,P.s4); b.hl(xr-side+1,xr+1,y0+1,P.m2); b.px(xr+1,y0,P.s3);
    for (x=xl;x<=xr;x++){ shadePx(b,x,y0+2,1); if (bayer(x,y0+3)<0.4) shadePx(b,x,y0+3,1); }
    var oy=y0+4, fx=xl+2, fw=w-side-4, mid=fx+(fw>>1);
    if (s[3]===0){ arched(b,mid-4,78,8,18,P.k2); b.vl(mid-5,77,95,P.s6); b.vl(mid+4,77,95,P.s3); b.hl(mid-5,mid+4,76,P.s6); arched(b,xl+3,72,2,5); arched(b,xr-side-3,72,2,5); }
    else if (s[3]===1||s[3]===2){ var oh=s[3]===1?8:9; [mid-8,mid+1].forEach(function(bx){ arched(b,bx,oy,3,oh); arched(b,bx+4,oy,3,oh); b.vl(bx+3,oy+1,oy+oh-1,P.s5); b.px(bx+3,oy,P.s6); b.hl(bx-1,bx+7,oy+oh,P.s6); }); }
    else if (s[3]===3){ for (var k=0;k<3;k++){ arched(b,mid-8+k*5,oy-1,3,9); if (k<2) b.vl(mid-5+k*5,oy,oy+7,P.s5); } b.hl(mid-9,mid+7,oy+8,P.s6); }
    else { for (var k2=0;k2<2;k2++){ var ox=mid-7+k2*7; arched(b,ox,oy-2,6,9,P.k2); bell(b,ox+3,oy); b.vl(ox+6,oy-1,oy+6,P.s5); } b.hl(mid-8,mid+6,oy+7,P.s6); } });
  // Eckfialen, steinerne Pyramide mit Kreuz
  [cx-10,cx+8].forEach(function(px){ b.rect(px,14,2,5,P.s5); b.px(px,13,P.s6); b.px(px+1,14,P.s3); });
  for (y=2;y<19;y++){ var hw=Math.max(1,Math.round((y-2)*0.56)); for (x=cx-hw;x<=cx+hw;x++){ var c5=(x<cx)?(x<=cx-hw?P.s6:P.s5):(x<cx+hw-1?P.s3:P.m2); if (((y*3+x)%6)===0) c5=M.DN[c5]; b.px(x,y,c5); } }
  b.hl(cx-10,cx+9,19,P.s6); b.vl(cx,0,2,P.k2); b.hl(cx-1,cx+1,0,P.k2); }

// ---------------------------------------------------------------- Sphinx aus schwarzem Granit auf einem Sockel (Blick nach rechts)
var SPH=[                     // ohne Kopf: nur der Halsstumpf mit Bruchkante und die Ansätze des Nemes-Tuchs
"............sHs.......",
"...........hmmmhd.....",
"...........lmmmmmd....",
"..........dlmmmmmd....",
"..hhhhhhhhhlmmmmmd....",
".hllllllllllmmmmmd....",
"hllmmmmmmmmmmmmmmdhhhh",
"lmmmmmmmmmmmmmmmmmmmmd",
"dmmmmmmmmmmmmmmmmmmmmd"];
function sphinx(b,x,by){ var xx, yy;
  for (yy=by-11;yy<by;yy++) for (xx=x+24;xx<x+31;xx++) if (xx<x+24+((by-yy)*0.6)) shadePx(b,xx,yy,2);   // Schlagschatten des Sockels
  for (yy=by-11;yy<by;yy++) for (xx=x;xx<x+24;xx++){ var c=(yy===by-11)?P.s6:((xx>x+20)?P.s3:P.s5); if (yy===by-10) c=P.s4; if (yy===by-8) c=P.s3; if (yy===by-1) c=P.s3; if (hash(xx>>2,yy)<0.08) c=M.DN[c]; b.px(xx,yy,c); }
  var st=M.outline(M.stamp(SPH,{h:P.m2,H:P.m3,l:P.m1,m:P.m0,d:P.k2,s:P.m1}),P.k1); b.blit(st,x+1,by-11-SPH.length);
  for (xx=x+2;xx<x+23;xx++) shadePx(b,xx,by-10,1); }

// ---------------------------------------------------------------- Protiron und Stufen zum Vestibül
function protiron(b){ var x, y, i, x0=PRO.x0, x1=PRO.x1, cx=PRO.arc[0], ar=PRO.arc;
  // Rückwand des Vestibüls im Schatten, großes Tor, drinnen ein Lichtschacht aus der Kuppel
  for (y=ar[1]-ar[2]-1;y<PRO.top;y++) for (x=x0+4;x<x1-4;x++){ if (y<36){ var qx=x-cx+0.5, qy=y-ar[1]; if (qx*qx+qy*qy>=ar[2]*ar[2]) continue; } b.px(x,y,lime(x,y,2,13,6)); }
  for (y=52;y<PRO.top;y++) for (x=cx-12;x<cx+13;x++){ if (y<60){ var dx=x-cx+0.5, dy=y-60; if (dx*dx+dy*dy>12.5*12.5) continue; } var c=P.k1; var sh=Math.abs(x-cx-2+(y-52)*0.25); if (sh<2.5+(y-52)*0.12) c=(sh<1.2)?P.m1:P.k2; if (y>=PRO.top-3 && Math.abs(x-cx)<6) c=P.m0; b.px(x,y,c); }
  b.vl(cx-13,50,PRO.top-1,P.m3); b.vl(cx+13,50,PRO.top-1,P.s3);
  // Säulen auf Postamenten
  PRO.cols.forEach(function(c){ for (y=76;y<PRO.top;y++) for (x=c-6;x<c+6;x++){ var u=(x-c+6)/11, cc=lime(x,y,u>0.72?1:0,6,4); if (y===76) cc=P.s6; if (y===77) cc=P.s4; b.px(x,y,cc); }
    for (y=51;y<76;y++) for (x=c-4;x<c+4;x++) b.px(x,y,granite(x,y,c-0.5,4));
    b.hl(c-4,c+3,75,P.s4); capital(b,c,42,false); colBase(b,c,73); });
  // Gebälk (Architrav, Fries, Gesims) über den äußeren Säulen
  for (y=36;y<42;y++) for (x=x0+4;x<x1-4;x++){ var cc2=(y===36)?P.s6:((y===39)?P.s3:P.s5); if (x>x1-12) cc2=M.DN[cc2]; var dax=x-cx+0.5, day=y-ar[1]; if (Math.sqrt(dax*dax+day*day)<ar[2]+4) continue; b.px(x,y,cc2); }
  for (x=x0+4;x<x1-4;x++) for (y=42;y<45;y++){ if (PRO.cols.some(function(c){ return Math.abs(x-c+0.5)<6; })) continue; var dd=x-cx+0.5; if (Math.abs(dd)<ar[2]) continue; if (bayer(x,y)<(45-y)/3.4) shadePx(b,x,y,2); }
  // Bogen in der Mitte (syrischer Giebel)
  for (y=ar[1]-ar[2]-5;y<=ar[1];y++) for (x=cx-ar[2]-5;x<=cx+ar[2]+5;x++){ var dx2=x-cx+0.5, dy2=y-ar[1], r=Math.sqrt(dx2*dx2+dy2*dy2); if (r<ar[2]||r>=ar[2]+4.5) continue;
    var q=Math.atan2(-dy2,dx2)/(Math.PI/10); b.px(x,y,(r<ar[2]+1)?(dx2>0?P.s4:P.s2):((Math.abs(q-Math.round(q))<0.1)?P.s3:((Math.floor(q)%2)?P.s5:P.s6))); }
  // Giebel: Gesims hell, Tympanon mit Schatten unter dem Schräggesims
  for (y=PRO.apex;y<37;y++){ var t=(y-PRO.apex)/(37-PRO.apex), hw=t*(x1-x0)/2; for (x=rnd(cx-hw);x<=rnd(cx+hw);x++){ var dxa=Math.abs(x-cx), edge=hw-dxa, c3;
      if (edge<2.4) c3=(x<cx)?P.s6:P.s4; else { c3=lime(x,y,0,10,5); if (edge<4.8) c3=M.DN[M.DN[c3]]; }
      var ddx=x-cx+0.5, ddy=y-ar[1]; if (Math.sqrt(ddx*ddx+ddy*ddy)<ar[2]+4.5) continue; b.px(x,y,c3); } }
  b.hl(x0+3,x1-4,37,P.s6); b.hl(x0+3,x1-4,38,P.s3);
  // Stufen hinab aufs Pflaster
  for (i=0;i<5;i++){ var sy1=GY+6-i*3.6, sy0=sy1-3.6, sx0=x0+8, sx1=x1-8;
    for (y=rnd(sy0);y<rnd(sy1);y++) for (x=sx0;x<sx1;x++){ var c4=(y===rnd(sy0))?P.s6:((y===rnd(sy0)+1)?P.s5:P.s4); if (y===rnd(sy1)-1) c4=P.s3; if (hash(x>>2,y)<0.07) c4=M.DN[c4]; b.px(x,y,c4); } }
  // Wangenmauern; die linke wirft einen Schatten schräg über die Stufen
  [[x0,x0+8],[x1-8,x1]].forEach(function(s,k){ for (y=76;y<GY+6;y++) for (x=s[0];x<s[1];x++){ var cc5=lime(x,y,(k===1&&x>s[1]-3)?1:0,8,5); if (y===76) cc5=P.s6; if (y===77) cc5=P.s4; b.px(x,y,cc5); } });
  for (y=PRO.top-2;y<GY+6;y++){ var se=x0+8+5+(y-PRO.top)*0.45; for (x=x0+8;x<se;x++) shadePx(b,x,y,2); }
  for (y=GY;y<GY+6;y++) for (x=x1;x<x1+8-(y-GY);x++) shadePx(b,x,y,2); }

// ---------------------------------------------------------------- Zeitungskiosk
function palaceWall(b){ var x, y, x0=PRO.x1-4, x1=ALY.x0;
  for (y=30;y<GY;y++) for (x=x0;x<x1;x++){ var c=lime(x,y,0,16,8); if (x>=x1-3) c=(x===x1-1)?P.m2:P.s3; b.px(x,y,c); }
  for (x=x0;x<x1;x++){ b.px(x,30,P.s6); b.px(x,31,P.s3); shadePx(b,x,32,1); }
  for (y=34;y<44;y++) for (x=347;x<352;x++) b.px(x,y,(x===347||y===34)?P.k1:P.k2);      // kleines vergittertes Fenster
  b.vl(349,34,43,P.m1); b.hl(346,352,44,P.s6);
  for (x=x0+1;x<x0+5;x++) for (y=30;y<GY;y++) shadePx(b,x,y,1); }
function kiosk(b){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, x, y;
  for (y=by-6;y<by;y++) for (x=x1;x<x1+9-(by-y);x++) shadePx(b,x,y,2);
  for (y=by-30;y<by;y++) for (x=x0;x<x1;x++){ var u=(x-x0)/(x1-x0), c=u<0.12?P.g4:(u>0.85?P.g1:P.g3); if ((x-x0)%6===0) c=M.DN[c]; if (y>=by-3) c=P.g1; b.px(x,y,c); }
  b.rect(x0+2,by-26,x1-x0-4,12,P.k2); var cols=[P.r3,P.y4,P.b2,P.s6,P.r2,P.a4,P.d4,P.s5,P.y3,P.b3];
  for (var i=0;i<6;i++){ var mx=x0+3+i*3+(i>2?1:0); b.rect(mx,by-25+(i%2),3,5,cols[i%cols.length]); b.px(mx+1,by-24+(i%2),P.k2); b.rect(mx,by-19,3,4,cols[(i+4)%cols.length]); b.px(mx,by-19,M.UP[cols[(i+4)%cols.length]]); }
  b.hl(x0+2,x1-3,by-14,P.g4);
  b.hl(x0+1,x1-2,by-12,P.m2); for (var n=0;n<4;n++){ var nx=x0+1+n*6; b.rect(nx,by-11,5,7,P.s5); b.hl(nx,nx+4,by-10,P.k2); b.hl(nx,nx+3,by-8,P.s3); b.hl(nx,nx+2,by-6,P.s3); b.px(nx+2,by-12,P.m3); }
  b.rect(x0-3,by-36,x1-x0+6,6,P.g2); b.hl(x0-3,x1+2,by-36,P.g4); b.hl(x0-3,x1+2,by-31,P.g1); b.rect(x0-1,by-35,x1-x0+2,4,P.s5); M.microText(b,'NOVINE',x0,by-35,P.r2);
  b.hl(x0-3,x1+2,by-30,P.k2); for (x=x0;x<x1;x++) if (bayer(x,by-29)<0.6) shadePx(b,x,by-29,1);
  b.vl(x0-5,by-20,by-1,P.m1); b.hl(x0-8,x0-2,by-1,P.m1); for (var p=0;p<3;p++){ b.rect(x0-8,by-19+p*5,3,4,[P.b3,P.a5,P.t4][p]); b.rect(x0-4,by-19+p*5,3,4,[P.s5,P.y4,P.b2][p]); } }

// ---------------------------------------------------------------- Gasse: eng, im Schatten, Wäscheleinen, hinten eine sonnige Wand
function alley(b){ var x0=ALY.x0, x1=ALY.x1, bx0=380, bx1=392, by0=38, by1=80, x, y;
  for (y=0;y<GY;y++) for (x=x0;x<x1;x++){ var c, tL=(x-x0)/(bx0-x0), tR=(x1-x)/(x1-bx1);
    var topL=31+tL*(by0-31), botL=GY+tL*(by1-GY), topR=0, botR=GY+tR*(by1-GY);
    if (x<bx0 && y>=topL && y<botL){ c=tex.ashlar((x-x0)*2.6,y,OPEN,9,6); if (y<topL+1) c=P.s4; }
    else if (x>=bx1 && y<botR){ var lit=y<(x1-x)*1.4+6; c=tex.ashlar((x1-x)*2.6,y,lit?LIT:SHD,9,6); }
    else if (x>=bx0 && x<bx1 && y>=by0 && y<by1){ c=lime(x*1.3,y,0,7,4); if (y>by1-13 && x>bx0+3 && x<bx1-3){ c=(y<by1-12)?P.s3:P.k2; } }
    else if (y>=by1){ var dpt=(y-by1)/(GY-by1), sr=dpt*7; c=((sr-Math.floor(sr))<0.25)?P.s4:((sr>4)?P.s2:P.m2); }
    else continue;
    b.px(x,y,c); }
  LINES.forEach(function(l){ var n=Math.abs(l[2]-l[0]); for (var i=0;i<=n;i++){ var t=i/n; b.px(rnd(l[0]+(l[2]-l[0])*t),rnd(l[1]+(l[3]-l[1])*t+Math.sin(Math.PI*t)*2),P.k2); } });
  b.rect(LINES[0][0]-1,22,2,3,P.m1); b.rect(LINES[0][2]-2,18,2,3,P.m1); }

// ---------------------------------------------------------------- Ninas Haus mit Laden „Okvir“
function shopHouse(b){ var x0=SHOP.x0, x, y;
  for (y=0;y<GY+4;y++) for (x=x0;x<W;x++){ var c=lime(x,y,0,15,7); if (x<x0+3) c=(x===x0)?P.s3:P.s6; b.px(x,y,c); }
  for (x=x0-3;x<W;x++){ b.px(x,0,(x%3)?P.t3:P.t1); b.px(x,1,(x%3===1)?P.t2:P.t4); b.px(x,2,P.t1); b.px(x,3,P.k2); shadePx(b,x,4,2); shadePx(b,x,5,1); }
  M.prop.window(b,422,14,12,18,{shut:true,col:M.R('g1 g2 g3 g4')});
  M.prop.window(b,456,14,12,18,{open:true,fill:function(xx,yy){ return (yy<20)?P.k1:P.k2; },col:M.R('g1 g2 g3 g4')});
  for (y=14;y<34;y++){ shadePx(b,435,y,1); shadePx(b,436,y,1); }
  b.rect(454,32,16,3,P.s4); b.hl(454,469,32,P.s6); for (var g=0;g<4;g++){ b.rect(455+g*4,29,3,3,P.t3); b.px(456+g*4,27,P.r3); b.px(455+g*4,28,P.g3); b.px(457+g*4,28,P.r4); }
  // Ladenfront aus Holz, dunkelgrün gestrichen
  for (y=48;y<GY+4;y++) for (x=x0+4;x<W-2;x++){ var c2=(y<50)?P.g4:P.g2; if (x===x0+4||x===W-3) c2=P.g1; if (y>=GY+1) c2=P.g1; b.px(x,y,c2); }
  for (x=x0+4;x<W-2;x++) shadePx(b,x,50,1);
  var sw=SHOP.win; b.rect(sw[0]-2,sw[1]-2,sw[2]+4,sw[3]+4,P.g1); b.rect(sw[0],sw[1],sw[2],sw[3],P.k2);
  for (var yy=sw[1];yy<sw[1]+sw[3];yy++) for (var xx=sw[0];xx<sw[0]+sw[2];xx++) if ((xx-yy+200)%17<2 && yy<sw[1]+20) b.px(xx,yy,P.m1);
  M.prop.frame(b,sw[0]+2,sw[1]+3,11,14,{frame:M.R('y1 y2 y4'),bg:P.k1});
  M.prop.frame(b,sw[0]+15,sw[1]+2,13,9,{frame:M.R('w1 w3 w4'),bg:P.k1});
  M.prop.frame(b,sw[0]+15,sw[1]+12,11,9,{frame:M.R('y1 y2 y3'),fill:function(xx,yy){ var yy0=sw[1]+14, hz=yy0+3; if (yy<hz) return (hash(xx,yy)<0.1)?P.n3:P.n0; if (xx===sw[0]+21&&yy===hz-1) return P.s5; if (yy===hz && xx>sw[0]+19 && xx<sw[0]+24) return P.s5; if (yy>hz && (xx===sw[0]+18) ) return P.y3; return P.n1; }});
  M.prop.frame(b,sw[0]+3,sw[1]+20,9,10,{frame:M.R('w0 w2 w3'),bg:P.k1});
  M.prop.frame(b,sw[0]+24,sw[1]+14,5,7,{frame:M.R('y1 y3 y4'),bg:P.k1});
  b.rect(sw[0]+13,sw[1]+24,14,6,P.w2); b.hl(sw[0]+13,sw[0]+26,sw[1]+24,P.w4);
  b.hl(sw[0],sw[0]+sw[2]-1,sw[1]+sw[3],P.s5); b.hl(sw[0]-2,sw[0]+sw[2]+1,sw[1]+sw[3]+1,P.g1);
  var dr=SHOP.door; M.prop.door(b,dr[0],dr[1],dr[2],dr[3],{ramp:M.R('g0 g1 g2 g3 g4'),frame:M.R('g0 g1 g2 g3'),glass:true,glassCol:P.k2,knob:'L'});
  b.rect(dr[0]+3,dr[1]+3,dr[2]-6,16,P.k2); b.line(dr[0]+4,dr[1]+4,dr[0]+9,dr[1]+12,P.m1); b.rect(dr[0]+7,dr[1]+9,7,4,P.s5); b.hl(dr[0]+8,dr[0]+12,dr[1]+10,P.r2); b.line(dr[0]+8,dr[1]+8,dr[0]+10,dr[1]+5,P.k1); b.line(dr[0]+12,dr[1]+8,dr[0]+10,dr[1]+5,P.k1);
  b.hl(dr[0]-2,dr[0]+dr[2]+1,dr[1]+dr[3],P.s3);
  b.line(dr[0]+dr[2]-3,dr[1]-4,dr[0]+dr[2]+1,dr[1]-1,P.k1); b.ellipse(dr[0]+dr[2]+1.5,dr[1]+1,1.8,2,P.y3); b.px(dr[0]+dr[2]+1,dr[1],P.y5);   // Türglocke
  // Holzschild „OKVIR“ mit gemalten Buchstaben
  var sg=SHOP.sign; b.rect(sg[0]-1,sg[1]-1,sg[2]+2,sg[3]+2,P.w0); b.fn(sg[0],sg[1],sg[2],sg[3],function(xx2,yy2){ return tex.boards(xx2,yy2-sg[1],M.R('w1 w2 w3 w4'),5); });
  b.hl(sg[0],sg[0]+sg[2]-1,sg[1],P.w4); M.text(b,'OKVIR',rnd(sg[0]+sg[2]/2-10)+1,sg[1]+2,P.w0); M.text(b,'OKVIR',rnd(sg[0]+sg[2]/2-10),sg[1]+1,P.s5);
  M.microText(b,'N. BARIĆ',rnd(sg[0]+sg[2]/2-15),sg[1]+8,P.e4);
  b.vl(sg[0]+3,sg[1]-4,sg[1]-1,P.k2); b.vl(sg[0]+sg[2]-4,sg[1]-4,sg[1]-1,P.k2);
  for (x=sg[0];x<sg[0]+sg[2]+3;x++) shadePx(b,x,sg[1]+sg[3]+1,1);
  b.line(470,40,474,36,P.k1); b.rect(472,30,4,6,P.k2); b.rect(473,31,2,4,P.s5); b.px(473,29,P.k1); }

// ---------------------------------------------------------------- Steinbank vor dem Säulengang
function bench(b,x,by,w){ var xx, yy;
  for (yy=by-9;yy<by;yy++) for (xx=x+4;xx<x+w+6;xx++) if (xx>x+w-2+(by-yy)*0.0 || yy<by-6) { if (xx-x-w<(by-yy)*0.7 && yy>=by-9) shadePx(b,xx,yy,2); }
  b.rect(x,by-8,w,2,P.s6); b.rect(x,by-6,w,2,P.s4); b.hl(x,x+w-1,by-4,P.s2); b.vl(x+w-1,by-8,by-5,P.s3);
  [x+3,x+w-9].forEach(function(lx){ b.rect(lx,by-4,6,4,P.s4); b.vl(lx+4,by-4,by-1,P.s3); b.vl(lx+5,by-4,by-1,P.s2); b.hl(lx,lx+5,by-4,P.s2); });
  for (xx=x+9;xx<x+w-9;xx++) for (yy=by-4;yy<by;yy++) shadePx(b,xx,yy,yy===by-4?2:1); }

function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0);
  sky(b); paving(b); cathedral(b); tower(b); colonnade(b); sphinx(b,164,GY);
  palaceWall(b); protiron(b); kiosk(b); alley(b); shopHouse(b);
  bench(b,48,GY+9,40);
  // Schatten des gegenüberliegenden Säulengangs (hinter dem Betrachter) fällt vorn aufs Pflaster: Pfeiler als Streifen, Bögen als Lichtzungen
  for (var fx=0;fx<W;fx++){ var ph=((fx+14)%40+40)%40, col=ph<6, u=col?0:(ph-6)/34, arc=Math.sqrt(Math.max(0,1-(2*u-1)*(2*u-1)));
    var edge=col?127:Math.round(131+arc*8); for (var fyy=edge;fyy<144;fyy++){ shadePx(b,fx,fyy,(fyy-edge<1)?1:2); } }
  // Kontaktschatten an der Fassadenkante
  for (var x=0;x<W;x++){ if (x>=PRO.x0&&x<PRO.x1) continue; shadePx(b,x,GY,1); }
  // Tauben auf den Gesimsen (statisch)
  [[22,CORN-1],[27,CORN-1],[90,CORN-1],[244,35],[314,35],[198,17],[300,94]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); });
  M.light(b,M.lf.sum(M.lf.band(112,144,0,-0.6),M.lf.vignette(W,144,0.5)),0,0,function(x,y){ return y>=GY; });
  return M.finishTOD(b,tod,{sky:function(x,y){ var c=b.get(x,y); return y<GY && c>=P.b0 && c<=P.b5; }}); }

// ---------------------------------------------------------------- bewegte Teile: Tauben, Wäsche im Wind
var PIG=[[226,122],[236,127],[247,120],[258,130],[268,124],[281,128],[214,131]];
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  function tp(x,y,c){ var sx=x-cam; if (sx<0||sx>=fb.w||y<0||y>=144) return; fb.px(sx,y,tint?M.tintPx(tint,c,sx,y):c); }
  PIG.forEach(function(p,i){ var cyc=(t*0.35+hash(i,5)*7)%14, fly=cyc>12.5, f=(i%2)?1:-1, x=p[0]+Math.round(Math.sin(t*0.4+i*1.7)*3), y=p[1], peck=Math.floor(t*3+i*0.7)%4===0;
    if (fly){ var k=(cyc-12.5)/1.5, fx=rnd(x+f*k*34), fyy=rnd(y-k*46), wing=Math.floor(t*12+i)%2; tp(fx,fyy,P.m2); tp(fx+1,fyy,P.m3); tp(fx-1,fyy-(wing?1:-1),P.m4); tp(fx+2,fyy-(wing?1:-1),P.m4); tp(fx-2,fyy-(wing?2:-1),P.m3); tp(fx+3,fyy-(wing?2:-1),P.m3); return; }
    tp(x,y,P.m2); tp(x+1,y,P.m2); tp(x-1,y-1,P.m2); tp(x,y-1,P.m3); tp(x+1,y-1,P.m3); tp(x+2,y-1,P.m2); tp(x,y-2,P.m4);
    tp(f>0?x-2:x+3,y-1,P.k2); tp(f>0?x-2:x+3,y,P.m1);
    var hx=f>0?x+2:x-1, hy=peck?y:y-2; tp(hx,hy,P.m3); tp(hx+f,hy,P.y3); tp(hx,hy-1,P.m4); tp(f>0?x+1:x,y-2,P.a4); tp(x,y+1,P.r3); tp(x+1,y+1,P.r3); });
  // Wäsche zwischen den Säulen
  CLINE.forEach(function(l,li){ var items=li?[['towel',0.15,P.s6],['sock',0.55,P.b3],['sock',0.7,P.b3]]:[['shirt',0.1,P.b4],['towel',0.55,P.r2]];
    items.forEach(function(it,k){ var u=it[1], lx=rnd(l[0]+(l[2]-l[0])*u), ly=l[1]+Math.round(Math.sin(u*Math.PI)*2)+1, c=it[2], m=CLOTH[it[0]];
      for (var yy=0;yy<m.length;yy++){ var sh=Math.round(yy*0.4+Math.sin(t*10+k*1.7+li*2+yy*0.9)*0.7); for (var xx=0;xx<m[yy].length;xx++){ if (m[yy][xx]==='.') continue; var cc=(m[yy][xx]==='d'||yy===m.length-1||xx===0)?M.DN[c]:c; tp(lx+xx+sh,ly+yy,cc); } } tp(lx,ly-1,P.k1); }); });
  // Wäsche in der Bura: Hemd, Hose, Handtuch, Socken wehen nach rechts
  LINES.forEach(function(l,li){ var items=li?[['towel',0.2,P.b3],['shirt',0.5,P.s6],['sock',0.78,P.r3]]:[['shirt',0.14,P.r3],['trous',0.38,P.c2],['towel',0.62,P.y4],['shirt',0.84,P.s5]];
    items.forEach(function(it,k){ var u=it[1], lx=rnd(l[0]+(l[2]-l[0])*u), ly=rnd(l[1]+(l[3]-l[1])*u+Math.sin(Math.PI*u)*2)+1, c=it[2], m=CLOTH[it[0]];
      for (var yy=0;yy<m.length;yy++){ var sh=Math.round(yy*0.45+Math.sin(t*10+k*2.1+li+yy*0.9)*0.7); for (var xx=0;xx<m[yy].length;xx++){ if (m[yy][xx]==='.') continue; var cc=(m[yy][xx]==='d')?M.DN[c]:c; if (yy===m.length-1||xx===0) cc=M.DN[c]; tp(lx+xx+sh,ly+yy,cc); } }
      tp(lx,ly-1,P.k1); tp(lx+m[0].length-1,ly-1,P.k1); }); }); }
var CLOTH={ shirt:['#######','#######','##.#.##','.#####.','.#####.','.##d##.'], trous:['######','######','##..##','##..##','##..##','##..##','dd..dd'], towel:['######','######','dddddd','######','######','######'], sock:['##','##','##','###'] };
function front(fb,v,S,GS){ M.scn.buraDebris(fb,v.t,112,140,v.cam); }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ return y>=110 && y<=138 && x>=6 && x<=470; };

M.defineArt('oldtown',{
  width:W, paint:paint, walk:WALK, dynamic:dyn, front:front,
  spots:{
    exit:[0,96,12,44],
    columns:[0,CORN,166,72],
    belltower:[184,0,28,96],
    steps:[230,82,100,26],
    sphinx:[164,72,30,28],
    pigeons:[206,112,90,24],
    bench:[46,100,46,10],
    kiosk:[334,66,34,42],
    alley:[368,14,36,86],
    shop_window:[407,62,36,42],
    shop_door:[445,58,28,48],
    sign:[408,47,66,15]
  },
  stands:{
    exit:[8,124,'L'], columns:[80,116,'B'], belltower:[198,114,'B'], steps:[280,114,'B'], sphinx:[176,114,'B'], pigeons:[250,118,'R'],
    bench:[68,114,'B'], kiosk:[353,114,'B'], alley:[385,112,'B'], shop_window:[425,112,'B'], shop_door:[459,112,'B'], sign:[441,114,'B']
  },
  start:[30,124,'R'], entries:{ map:[16,124,'R'], shop:[459,116,'F'] }
});
})(M);
