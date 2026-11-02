/* ===== rooms/art/oldtown.js — Altstadt: der Peristil des Diokletianpalastes an einem Bura-Tag.
   Links der Säulengang (weißer Kalkstein, rote Granitsäulen, Bögen), dahinter die Kathedrale und der hohe Glockenturm von Sv. Duje,
   die Sphinx, in der Mitte die Stufen zum Protiron und Vestibül, rechts ein Zeitungskiosk, eine Gasse mit Wäsche und Ninas Laden „Okvir“. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=480, GY=100;                                   // Breite, Fußlinie der Fassaden
var LIT=M.R('s3 s4 s5 s6'), SHD=M.R('m1 m2 m3 s3'), DEEP=M.R('k2 m0 m1 m2');
var COLS=[6,36,66,96,126,156], SPR=43, ARR=11;      // Säulengang: Säulenmitten, Kämpferlinie, Bogenradius
var TWR={x:186,w:22};                                // Glockenturm
var PRO={x0:214,x1:330,top:86,cols:[228,252,292,316],apex:10};   // Protiron mit Stufen
var KIO={x0:332,x1:358,base:106};                    // Zeitungskiosk
var ALY={x0:358,x1:400,vp:[379,56]};                // Gasse
var SHOP={x0:400,win:[408,66,30,34],door:[446,62,22,42],sign:[409,51,60,10]};
var SUN=[11,15];                                     // Lichtversatz: Sonne von links oben
function rnd(v){ return Math.round(v); }
function lime(x,y,sh,sw,hh){ return tex.ashlar(x,y,sh?SHD:LIT,sw||17,hh||8); }

// ---------------------------------------------------------------- Himmel (Bura: tiefblau, klar, ein paar Federwolken)
function sky(b,tod){ for (var y=0;y<GY;y++) for (var x=0;x<W;x++){ var v=0.08+y/120; b.px(x,y,M.rampAt(M.R('b0 b1 b2 b3 b4'),v,x,y)); }
  for (var i=0;i<5;i++){ var cx=40+i*97+hash(i,2)*30, cy=6+hash(i,3)*16, L=30+hash(i,4)*40; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+Math.sin(k*0.09+i)*2+k*0.05); if (bayer(xx,yy)<0.5-Math.abs(k/L-0.5)) b.px(xx,yy,P.b4); if (k%5===0) b.px(xx+1,yy-1,P.b3); } } }

// ---------------------------------------------------------------- Pflaster: polierter Kalkstein in Perspektive, glänzend
var HZ=40, VPX=240;
function paving(b,refl){ for (var y=GY;y<144;y++){ var d=y-HZ, row=Math.floor(1400/d), off=(row%2)*0.5+hash(row,7)*0.3;
    for (var x=0;x<W;x++){ var X=(x-VPX)*(60/d)/18+off, col=Math.floor(X), fx=X-col, fy=1400/d-row, lw=0.9*18/(18*d/60)/18*1.2;
      var t=hash(col,row), c=t<0.3?P.s4:(t<0.85?P.s5:P.s6);
      if (fy>0.86||fx<lw) c=P.s3; if (fy>0.94) c=P.s2;
      var g=hash(x,y); if (g<0.05) c=M.DN[c]; else if (g>0.97&&c!==P.s6) c=M.UP[c];
      // Glanz: schwache Spiegelung der Fassaden in den hinteren Reihen
      if (refl && y<GY+14){ var ry=2*GY-1-y, rc=refl.get(x,ry); if (rc!==T && bayer(x,y)<0.32-(y-GY)*0.02) c=M.DN[M.DN[rc]]===P.k0?P.s3:rc; }
      b.px(x,y,c); } } }

// ---------------------------------------------------------------- Säulengang
function inOpening(x,y,i){ var a=COLS[i], z=COLS[i+1], xl=a+4, xr=z-4, cx=(a+z)/2; if (x<=xl||x>=xr) return false; if (y>=SPR) return y<94; var dx=x-cx, dy=y-SPR; return dx*dx+dy*dy<ARR*ARR; }
function openingAt(x,y){ for (var i=0;i<COLS.length-1;i++) if (inOpening(x,y,i)) return i; return -1; }
function granite(x,y,cx,r){ var u=(x-cx)/r, v=0.62-u*0.5-(u>0.35?0.25:0); if (Math.abs(u+0.45)<0.12) v+=0.25;
  var c=M.rampAt(M.R('t1 t2 t3 t4'),v+(hash(x,y>>1)-0.5)*0.18,x,y); var h=hash(x*3+1,y*5+2); if (h<0.07) c=(u<0.2)?P.s3:P.t0; else if (h>0.95) c=P.t0; return c; }
function capital(b,cx,y0,shade){ // korinthisch, 9 px hoch, oben 13 px breit
  var L=shade?SHD:LIT; for (var j=0;j<9;j++){ var hw=4+Math.round(j*0.35)+(j<2?2:0); for (var x=cx-hw;x<=cx+hw-1;x++){ var u=(x-cx+hw)/(2*hw), c=u<0.35?L[3]:(u<0.7?L[2]:L[1]);
      if (j<2){ c=(j===0)?L[3]:L[1]; if (u>0.75) c=M.DN[c]; }                                  // Abakus
      else if (j<4){ if (x===cx-hw||x===cx+hw-1) c=L[0]; else if (x===cx-hw+1||x===cx+hw-2) c=L[3]; }   // Voluten
      else { var leaf=((x-cx+20)%3); c=leaf===0?L[1]:(leaf===1?L[3]:L[2]); if (j===4&&leaf!==1) c=L[0]; if (j>=7) c=(leaf===1)?L[2]:L[1]; if (u>0.72) c=M.DN[c]; }
      b.px(x,y0+8-j,c); } } }
function colBase(b,cx,y0){ // attische Basis auf Plinthe, y0 = Oberkante Plinthe
  b.rect(cx-6,y0,12,3,P.s5); b.hl(cx-6,cx+5,y0,P.s6); b.hl(cx-6,cx+5,y0+2,P.s3); b.vl(cx+5,y0,y0+2,P.s3);
  b.hl(cx-5,cx+4,y0-1,P.s5); b.px(cx+4,y0-1,P.s3); b.hl(cx-4,cx+3,y0-2,P.s2); b.hl(cx-5,cx+4,y0-3,P.s6); b.px(cx+4,y0-3,P.s4); }
function colonnade(b){ var x, y, i;
  // Fassade (Bogenzwickel) aus Quadern, Gesims oben
  for (y=18;y<94;y++) for (x=0;x<166;x++) b.px(x,y,lime(x,y,false,15,7));
  // Öffnungen: schattiges Inneres, Rückwand mit Lichtflecken (Sonne fällt schräg durch den Bogen)
  for (y=SPR-ARR;y<94;y++) for (x=0;x<166;x++){ var o=openingAt(x,y); if (o<0) continue;
    var lit=openingAt(x-SUN[0],y-SUN[1])===o && y>SPR+4, c;
    var back=tex.ashlar(x*1.1,y,lit?M.R('s2 s3 s4 s4'):DEEP,13,6);
    if (y>=86){ c=lit?(y===86?P.s3:P.s4):(y===86?P.k2:P.m1); }      // Boden im Gang
    else c=back;
    if (!lit && y<SPR+2) c=P.k2;
    b.px(x,y,c); }
  // Türen und Nischen hinten im Gang
  [[51,62,7,24],[111,60,8,26]].forEach(function(d){ b.rect(d[0],d[1],d[2],d[3],P.k1); b.ellipse(d[0]+d[2]/2,d[1],d[2]/2,3,P.k1); b.vl(d[0]-1,d[1],d[1]+d[3]-1,P.m2); });
  // Bogenringe (Keilsteine)
  for (i=0;i<COLS.length-1;i++){ var cx=(COLS[i]+COLS[i+1])/2;
    for (y=SPR-ARR-5;y<=SPR;y++) for (x=rnd(cx-ARR-5);x<=rnd(cx+ARR+5);x++){ var dx=x-cx, dy=y-SPR, rr=Math.sqrt(dx*dx+dy*dy); if (rr<ARR||rr>ARR+4.2||dy>0) continue;
      var ang=Math.atan2(-dy,dx), k=Math.floor(ang/(Math.PI/9)); var c2=(Math.abs(ang/(Math.PI/9)-Math.round(ang/(Math.PI/9)))<0.09)?P.s3:((k%2)?P.s5:P.s6); if (rr>ARR+3.4) c2=P.s4; if (rr<ARR+0.9) c2=(dx>0)?P.s4:P.s3; b.px(x,y,c2); } }
  // Säulen: Schaft (Granit), Kapitell, Basis
  COLS.forEach(function(cx){ for (y=52;y<91;y++) for (x=cx-4;x<cx+4;x++) b.px(x,y,granite(x,y,cx-0.5,4));
    b.hl(cx-4,cx+3,52,P.s5); b.hl(cx-4,cx+3,90,P.s4); capital(b,cx,SPR,false); colBase(b,cx,91); });
  // Gesims über den Bögen, Schatten darunter
  b.rect(0,18,166,5,P.s5); b.hl(0,165,18,P.s6); b.hl(0,165,19,P.s6); b.hl(0,165,21,P.s3); b.hl(0,165,22,P.s4); for (x=0;x<166;x+=3) b.px(x,21,P.s2);
  for (x=0;x<166;x++) for (y=23;y<26;y++) if (bayer(x,y)<(26-y)/3.5) b.px(x,y,M.DN[M.DN[b.get(x,y)]]);
  // Stylobat: zwei Stufen
  for (y=94;y<GY;y++) for (x=0;x<168;x++){ var st=y<97?0:1, c3=(y===94||y===97)?P.s6:(st?P.s4:P.s5); if (hash(x>>3,y)<0.1) c3=M.DN[c3]; if (((x+st*7)%23)===0) c3=P.s3; b.px(x,y,c3); }
  // Schlagschatten der Säulen auf dem Stylobat (nach rechts)
  COLS.forEach(function(cx){ for (y=94;y<GY;y++){ var sx=cx+4+(y-94)*0.8; for (x=rnd(sx);x<rnd(sx+5);x++) b.px(x,y,M.DN[M.DN[b.get(x,y)]]); } }); }

// ---------------------------------------------------------------- Kathedrale (Dach über dem Säulengang) und Glockenturm
function cathedral(b){ // achteckiger Tambour, gedecktes Zeltdach
  for (var y=6;y<18;y++) for (var x=28;x<150;x++){ var u=(x-28)/122, c=lime(x,y,u>0.62,11,5); if (u>0.62&&u<0.64) c=P.s2; b.px(x,y,c); }
  for (var y2=0;y2<7;y2++){ var x0=36+y2*3, x1=142-y2*3; for (var x2=x0;x2<x1;x2++){ var c2=((x2+y2)%4===0)?P.t1:((x2-x0)<(x1-x0)*0.6?P.t3:P.t2); if (y2===6) c2=P.t1; b.px(x2,y2,c2); } }
  b.hl(30,147,6,P.s6); b.hl(30,147,7,P.s3);
  for (var k=0;k<7;k++){ var px=38+k*16; b.rect(px,9,3,7,(k>4)?P.m1:P.s2); b.px(px,9,P.k2); }      // kleine Fenster im Tambour
  // Mauern der Kathedrale hinter dem Turm (im Schatten)
  for (var y3=40;y3<94;y3++) for (var x3=162;x3<214;x3++) b.px(x3,y3,lime(x3,y3,true,13,6));
  b.hl(162,213,40,P.s4); b.hl(162,213,41,P.m1); }
function bell(b,cx,y){ b.rect(cx-1,y,3,1,P.y1); b.rect(cx-2,y+1,5,2,P.y2); b.hl(cx-2,cx+2,y+3,P.y1); b.px(cx-1,y+1,P.y3); }
function tower(b){ var cx=TWR.x, x, y;
  var stories=[[66,96,22,'base'],[51,66,21,'bi'],[37,51,20,'bi2'],[25,37,18,'tri'],[14,25,14,'belfry']];
  stories.forEach(function(s,si){ var y0=s[0], y1=s[1], w=s[2], xl=cx-(w>>1), xr=xl+w-1;
    for (y=y0;y<y1;y++) for (x=xl;x<=xr;x++){ var u=(x-xl)/(w-1), c=tex.ashlar(x*1.3,y*1.1,u>0.82?SHD:LIT,9,5); if (u<0.08) c=P.s6; if (x===xr) c=P.m2; b.px(x,y,c); }
    // Gesims zwischen den Geschossen
    b.hl(xl-1,xr+1,y0,P.s6); b.hl(xl-1,xr+1,y0+1,P.s3); b.px(xr+1,y0,P.s3);
    // Öffnungen
    var ow=s[3]==='belfry'?3:(s[3]==='tri'?3:3), n=s[3]==='base'?0:(s[3]==='tri'?3:(s[3]==='belfry'?2:2)), oh=s[3]==='belfry'?8:(s[3]==='bi'?9:8);
    var gap=s[3]==='belfry'?3:2, tot=n*ow+(n-1)*gap, ox=cx-(tot>>1), oy=y0+3;
    if (s[3]==='bi'||s[3]==='bi2'){ // zwei Biforien nebeneinander
      [cx-6,cx+2].forEach(function(bx){ for (var k=0;k<2;k++){ var x0=bx+k*3; for (var yy=oy;yy<oy+oh;yy++) for (var xx=x0;xx<x0+2;xx++){ var cc=(yy<oy+1)?P.k2:((xx===x0&&yy<oy+4)?P.k1:P.n0); b.px(xx,yy,cc); } b.px(x0,oy-1,P.s3); } b.vl(bx+2,oy,oy+oh-1,P.s5); b.hl(bx-1,bx+5,oy+oh,P.s6); }); }
    else if (n){ for (var k2=0;k2<n;k2++){ var x1=ox+k2*(ow+gap); for (var yy2=oy;yy2<oy+oh;yy2++) for (var xx2=x1;xx2<x1+ow;xx2++){ var c4=(yy2===oy&&(xx2===x1||xx2===x1+ow-1))?b.get(xx2,yy2):P.k1; if (yy2>oy+1&&xx2===x1+ow-1) c4=P.n0; b.px(xx2,yy2,c4); }
        if (s[3]==='belfry') bell(b,x1+1,oy+3); if (k2<n-1) b.vl(x1+ow,oy+1,oy+oh-1,P.s5); } b.hl(ox-1,ox+tot,oy+oh,P.s6); } });
  // Portal unten
  b.rect(cx-4,80,9,16,P.k1); b.ellipse(cx+0.5,80,4.5,3.5,P.k1); b.vl(cx-5,78,95,P.s6); b.vl(cx+5,78,95,P.s2);
  // Spitze: Zeltdach aus Stein, Kreuz
  for (y=3;y<14;y++){ var hw=Math.max(1,Math.round((y-3)*0.68)); for (x=cx-hw;x<=cx+hw;x++){ var c5=(x<cx)?P.s5:P.s3; if (x===cx-hw) c5=P.s6; if ((y+x)%3===0&&x>cx) c5=P.m2; b.px(x,y,c5); } }
  b.vl(cx,0,3,P.k2); b.hl(cx-1,cx+1,1,P.k2);
  // vier kleine Eckpfeiler am Glockengeschoss
  [cx-8,cx+7].forEach(function(px){ b.vl(px,10,14,P.s5); b.px(px,9,P.s6); }); }

// ---------------------------------------------------------------- Sphinx aus schwarzem Granit auf einem Sockel
function sphinx(b,x,by){ // x = linke Kante des Sockels, by = Boden
  b.rect(x,by-12,22,12,P.s4); b.hl(x,x+21,by-12,P.s6); b.vl(x+21,by-12,by-1,P.s2); b.hl(x,x+21,by-1,P.s3); b.hl(x+1,x+20,by-10,P.s5);
  for (var k=0;k<20;k++) if (hash(k,3)<0.3) b.px(x+1+k,by-6,P.s3);
  var y0=by-12, G=M.R('k1 k2 m0 m1 m2 m3');
  // Körper (liegender Löwe), Pranken nach rechts
  b.rect(x+3,y0-5,12,5,G[2]); b.hl(x+3,x+14,y0-5,G[4]); b.hl(x+4,x+14,y0-6,G[3]); b.rect(x+14,y0-3,6,3,G[2]); b.hl(x+14,x+19,y0-3,G[4]); b.px(x+20,y0-1,G[1]);
  b.ellipse(x+5,y0-3,3,3,G[2]); b.px(x+3,y0-5,G[4]); b.hl(x+1,x+3,y0-1,G[1]);          // Hinterteil, Schwanz
  // Kopf mit Nemes-Tuch
  b.rect(x+14,y0-12,5,7,G[2]); b.px(x+14,y0-12,G[4]); b.hl(x+15,x+18,y0-13,G[3]); b.vl(x+13,y0-11,y0-6,G[1]); b.vl(x+19,y0-11,y0-7,G[1]);
  b.px(x+18,y0-10,G[5]); b.px(x+19,y0-9,G[3]); b.px(x+18,y0-8,G[1]); b.vl(x+15,y0-10,y0-6,G[3]);
  // Glanzlichter (polierter Granit, Sonne von links)
  b.px(x+6,y0-6,G[5]); b.px(x+15,y0-12,G[5]); }

// ---------------------------------------------------------------- Protiron und Stufen zum Vestibül
function protiron(b){ var x, y, i, x0=PRO.x0, x1=PRO.x1, cx=(x0+x1)/2;
  // Rückwand des Vestibüls (im Schatten), großes dunkles Tor mit Lichtschacht
  for (y=26;y<PRO.top;y++) for (x=x0+4;x<x1-4;x++) b.px(x,y,lime(x,y,true,14,7));
  for (y=46;y<PRO.top;y++) for (x=260;x<285;x++){ var c=P.k1; if (y<50 && (Math.abs(x-272.5)>Math.sqrt(Math.max(0,16-(y-50)*(y-50)))*3)) continue; if (y>70 && Math.abs(x-272)<(y-70)*0.5) c=P.k2; if (y>76 && Math.abs(x-272)<(y-76)*0.4) c=P.m0; b.px(x,y,c); }
  b.ellipse(272.5,47,12.5,5,function(xx,yy){ return yy<47?P.k1:T; });
  b.vl(259,44,85,P.m2); b.vl(285,44,85,P.m3);
  // Säulen auf Postamenten
  PRO.cols.forEach(function(c){ for (y=74;y<PRO.top;y++) for (x=c-6;x<c+6;x++){ var u=(x-c+6)/11, cc=lime(x,y,u>0.7,6,4); if (y===74) cc=P.s6; if (y===75) cc=P.s4; b.px(x,y,cc); }
    for (y=43;y<74;y++) for (x=c-4;x<c+4;x++) b.px(x,y,granite(x,y,c-0.5,4));
    b.hl(c-4,c+3,73,P.s4); capital(b,c,34,false); colBase(b,c,71); });
  // Gebälk, darüber der Bogen in der Mitte und der Giebel
  for (y=28;y<34;y++) for (x=x0+6;x<x1-6;x++){ var cc2=(y===28)?P.s6:((y===31)?P.s3:P.s5); if (x>x1-14) cc2=M.DN[cc2]; b.px(x,y,cc2); }
  for (y=14;y<36;y++) for (x=252;x<293;x++){ var dx=x-272.5, dy=y-36, r=Math.sqrt(dx*dx+dy*dy); if (r>=15.5&&r<20){ b.px(x,y,(r<16.5)?P.s3:((Math.round(Math.atan2(-dy,dx)*6)%2)?P.s5:P.s6)); } else if (r<15.5 && y<34) b.px(x,y,lime(x,y,true,8,4)); }
  // Giebel (Dreieck) mit Tympanon im Schatten
  for (y=PRO.apex;y<28;y++){ var t=(y-PRO.apex)/(28-PRO.apex), hw=t*56; for (x=rnd(cx-hw);x<=rnd(cx+hw);x++){ var dx2=Math.abs(x-cx), edge=hw-dx2; var c3;
      if (edge<2.2) c3=(x<cx)?P.s6:P.s4; else c3=lime(x,y,true,10,5);
      var dd=x-272.5, dy2=y-36; if (Math.sqrt(dd*dd+dy2*dy2)<20) continue; b.px(x,y,c3); } }
  b.hl(rnd(cx-56),rnd(cx+56),28,P.s6); b.hl(rnd(cx-56),rnd(cx+56),27,P.s3);
  // Stufen: fünf breite Stufen hinab aufs Pflaster
  for (i=0;i<5;i++){ var sy1=GY+6-i*4, sy0=sy1-4, sx0=x0+2+i, sx1=x1-2-i;
    for (y=sy0;y<sy1;y++) for (x=sx0;x<sx1;x++){ var c4=(y===sy0)?P.s6:(y===sy0+1?P.s5:P.s4); if (y===sy1-1) c4=P.s3; if (hash(x>>2,y)<0.08) c4=M.DN[c4]; b.px(x,y,c4); } }
  // Wangenmauern links und rechts der Treppe, die linke wirft Schatten über die Stufen
  [[x0,x0+7],[x1-7,x1]].forEach(function(s,k){ for (y=74;y<GY+6;y++) for (x=s[0];x<s[1];x++){ var cc5=lime(x,y,k===1&&x>s[1]-3,7,5); if (y===74) cc5=P.s6; b.px(x,y,cc5); } });
  for (y=PRO.top;y<GY+6;y++){ var sxe=x0+7+(y-PRO.top)*0.35+6; for (x=x0+7;x<sxe;x++){ b.px(x,y,M.DN[M.DN[b.get(x,y)]]); } }
  // Gesimsschatten unter dem Gebälk
  for (x=x0+6;x<x1-6;x++) for (y=34;y<37;y++) if (bayer(x,y)<(37-y)/3.4 && !(PRO.cols.some(function(c){ return Math.abs(x-c)<5; }))) b.px(x,y,M.DN[M.DN[b.get(x,y)]]); }

// ---------------------------------------------------------------- Zeitungskiosk
function kiosk(b){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, x, y;
  // Schatten auf dem Pflaster (nach rechts hinten)
  for (y=by-5;y<by;y++) for (x=x1;x<x1+7-(by-y);x++) b.px(x,y,M.DN[M.DN[b.get(x,y)]]);
  // Korpus: grün gestrichene Bleche
  for (y=by-30;y<by;y++) for (x=x0;x<x1;x++){ var u=(x-x0)/(x1-x0), c=u<0.15?P.g4:(u>0.85?P.g1:P.g3); if ((x-x0)%7===0) c=P.g1; if (y>=by-3) c=P.g1; b.px(x,y,c); }
  // Fenster mit Zeitschriften, Zeitungen an Klammern
  b.rect(x0+3,by-26,x1-x0-6,12,P.k2); var cols=[P.r3,P.y4,P.b2,P.s6,P.r2,P.a4,P.d4,P.s5,P.y3,P.b3];
  for (var i=0;i<6;i++){ var mx=x0+4+i*3+(i>2?1:0); b.rect(mx,by-25+(i%2),3,5,cols[i%cols.length]); b.px(mx+1,by-24+(i%2),P.k2); b.rect(mx,by-19,3,4,cols[(i+4)%cols.length]); }
  b.hl(x0+3,x1-4,by-14,P.g4);
  b.hl(x0+1,x1-2,by-12,P.m2); for (var n=0;n<4;n++){ var nx=x0+2+n*6; b.rect(nx,by-11,5,7,P.s5); b.hl(nx,nx+4,by-10,P.k2); b.hl(nx,nx+3,by-8,P.s3); b.hl(nx,nx+2,by-6,P.s3); b.px(nx+2,by-12,P.m3); }
  // Dach mit Überstand und Schild
  b.rect(x0-3,by-36,x1-x0+6,6,P.g2); b.hl(x0-3,x1+2,by-36,P.g4); b.hl(x0-3,x1+2,by-31,P.g1); b.rect(x0-1,by-35,x1-x0+2,4,P.s5); M.microText(b,'NOVINE',x0+1,by-35,P.r2);
  b.hl(x0-3,x1+2,by-30,P.k2); for (x=x0;x<x1;x++) if (bayer(x,by-29)<0.6) b.px(x,by-29,M.DN[b.get(x,by-29)]);
  // Postkartenständer daneben
  b.vl(x0-5,by-20,by-1,P.m1); b.hl(x0-8,x0-2,by-1,P.m1); for (var p=0;p<3;p++){ b.rect(x0-8,by-19+p*5,3,4,[P.b3,P.a5,P.t4][p]); b.rect(x0-4,by-19+p*5,3,4,[P.s5,P.y4,P.b2][p]); } }

// ---------------------------------------------------------------- Gasse: eng, im Schatten, Wäscheleinen, hinten eine sonnige Wand
function alley(b){ var x0=ALY.x0, x1=ALY.x1, bx0=372, bx1=386, by0=34, by1=78, x, y;
  for (y=0;y<GY;y++) for (x=x0;x<x1;x++){ var c;
    var tL=(x-x0)/(bx0-x0), tR=(x1-x)/(x1-bx1);
    var topL=4+tL*(by0-4), botL=GY+tL*(by1-GY), topR=2+tR*(by0-2), botR=GY+tR*(by1-GY);
    if (x<bx0 && y>=topL && y<botL){ c=tex.ashlar((x-x0)*3,y,DEEP,9,6); }                                   // linke Wand
    else if (x>=bx1 && y>=topR && y<botR){ var lit=y<topR+14+(x1-x)*0.6; c=tex.ashlar((x1-x)*3,y,lit?M.R('s2 s4 s5 s5'):SHD,9,6); } // rechte Wand
    else if (x>=bx0 && x<bx1 && y>=by0 && y<by1){ c=lime(x*1.3,y,false,7,4); if (y>by1-12 && x>bx0+4 && x<bx1-4) c=(y<by1-11)?P.s3:P.k2; } // sonnige Wand hinten mit Tor
    else if (y>=Math.max(botL,botR)-1 || (x>=bx0&&x<bx1&&y>=by1)){ var dpt=(y-by1)/(GY-by1), step=Math.floor(dpt*6); c=(Math.floor(dpt*6*3)%3===0)?P.m1:P.m2; if (step>=4) c=(Math.floor(dpt*18)%3===0)?P.s2:P.m3; } // Stufen
    else continue;   // Himmel bleibt
    b.px(x,y,c); }
  // Wäscheleinen quer über die Gasse
  [[x0+2,26,x1+6,22],[x0+6,44,x1+4,40]].forEach(function(l){ b.line(l[0],l[1],l[2],l[3],P.k2); }); }

// ---------------------------------------------------------------- Ninas Haus mit Laden „Okvir“
function shopHouse(b){ var x0=SHOP.x0, x, y;
  for (y=0;y<GY+4;y++) for (x=x0;x<W;x++){ var c=lime(x,y,false,15,7); if (x<x0+3) c=(x===x0)?P.m2:P.s3; b.px(x,y,c); }
  // Dachtraufe oben
  for (x=x0-2;x<W;x++){ b.px(x,0,(x%3)?P.t3:P.t1); b.px(x,1,(x%3===1)?P.t2:P.t4); b.px(x,2,P.t1); b.px(x,3,P.k2); b.px(x,4,M.DN[M.DN[b.get(x,4)]]); }
  // Obergeschoss: zwei Fenster mit grünen Läden (eines geschlossen, eines offen mit Geranien)
  M.prop.window(b,420,14,12,18,{shut:true,col:M.R('g1 g2 g3 g4')});
  M.prop.window(b,454,14,12,18,{open:true,fill:function(xx,yy){ return (yy<20)?P.k1:P.k2; },col:M.R('g1 g2 g3 g4')});
  b.rect(452,32,16,3,P.s4); b.hl(452,467,32,P.s6); for (var g=0;g<4;g++){ b.rect(453+g*4,29,3,3,P.t3); b.px(454+g*4,27,P.r3); b.px(453+g*4,28,P.g3); b.px(455+g*4,28,P.r4); }
  // Schatten der Gassenecke auf der Fassade (diagonal)
  for (y=6;y<GY+4;y++){ var se=x0+3+Math.max(0,(60-y))*0.18; for (x=x0+3;x<se;x++) b.px(x,y,M.DN[M.DN[b.get(x,y)]]); }
  // Ladenfront aus Holz (dunkelgrün gestrichen)
  for (y=48;y<GY+4;y++) for (x=x0+4;x<W-2;x++){ var c2=(y<50)?P.g4:P.g2; if (x===x0+4||x===W-3) c2=P.g1; b.px(x,y,c2); }
  // Schaufenster mit leeren Rahmen
  var sw=SHOP.win; b.rect(sw[0]-2,sw[1]-2,sw[2]+4,sw[3]+4,P.g1); b.rect(sw[0],sw[1],sw[2],sw[3],P.k2);
  for (var yy=sw[1];yy<sw[1]+sw[3];yy++) for (var xx=sw[0];xx<sw[0]+sw[2];xx++) if ((xx-yy+200)%17<2 && yy<sw[1]+20) b.px(xx,yy,P.m1);   // Spiegelung
  M.prop.frame(b,sw[0]+2,sw[1]+3,11,14,{frame:M.R('y1 y2 y4'),bg:P.k1});
  M.prop.frame(b,sw[0]+15,sw[1]+2,13,9,{frame:M.R('w1 w3 w4'),bg:P.k1});
  M.prop.frame(b,sw[0]+16,sw[1]+13,7,9,{frame:M.R('k1 k2 m2'),bg:P.k1});
  M.prop.frame(b,sw[0]+3,sw[1]+20,9,10,{frame:M.R('w0 w2 w3'),bg:P.k1});
  M.prop.frame(b,sw[0]+24,sw[1]+14,5,7,{frame:M.R('y1 y3 y4'),bg:P.k1});
  b.rect(sw[0]+13,sw[1]+24,14,6,P.w2); b.hl(sw[0]+13,sw[0]+26,sw[1]+24,P.w4);     // Rahmenleisten auf einem Bänkchen
  b.hl(sw[0],sw[0]+sw[2]-1,sw[1]+sw[3],P.s5); b.hl(sw[0]-2,sw[0]+sw[2]+1,sw[1]+sw[3]+1,P.g1);
  // Ladentür mit Glas
  var dr=SHOP.door; M.prop.door(b,dr[0],dr[1],dr[2],dr[3],{ramp:M.R('g0 g1 g2 g3 g4'),frame:M.R('g0 g1 g2 g3'),glass:true,glassCol:P.k2,knob:'L'});
  b.rect(dr[0]+3,dr[1]+3,dr[2]-6,16,P.k2); b.line(dr[0]+4,dr[1]+4,dr[0]+9,dr[1]+12,P.m1); b.rect(dr[0]+6,dr[1]+8,8,5,P.s5); M.microText(b,'OTV',dr[0]+7,dr[1]+8,P.r2);
  b.hl(dr[0]-2,dr[0]+dr[2]+1,dr[1]+dr[3],P.s3);
  // Holzschild „OKVIR“ mit gemalten Buchstaben
  var sg=SHOP.sign; b.rect(sg[0]-1,sg[1]-1,sg[2]+2,sg[3]+2,P.w0); b.fn(sg[0],sg[1],sg[2],sg[3],function(xx,yy){ return tex.boards(xx,yy-sg[1],M.R('w1 w2 w3 w4'),5); });
  b.hl(sg[0],sg[0]+sg[2]-1,sg[1],P.w4); M.text(b,'OKVIR',sg[0]+sg[2]/2-10+1,sg[1]+2,P.w0); M.text(b,'OKVIR',rnd(sg[0]+sg[2]/2-10),sg[1]+1,P.s5);
  b.vl(sg[0]+3,sg[1]-4,sg[1]-1,P.k2); b.vl(sg[0]+sg[2]-4,sg[1]-4,sg[1]-1,P.k2);
  // Wandlaterne
  b.line(470,40,474,36,P.k1); b.rect(472,30,4,6,P.k2); b.rect(473,31,2,4,P.s5); b.px(473,29,P.k1); }

// ---------------------------------------------------------------- Steinbank
function bench(b,x,by,w){ b.rect(x,by-6,w,3,P.s5); b.hl(x,x+w-1,by-6,P.s6); b.hl(x,x+w-1,by-4,P.s3); [x+3,x+w-9].forEach(function(lx){ b.rect(lx,by-3,6,3,P.s4); b.vl(lx+5,by-3,by-1,P.s2); });
  for (var xx=x+2;xx<x+w+3;xx++) for (var yy=by-3;yy<by;yy++) if (b.get(xx,yy)!==P.s4 && b.get(xx,yy)!==P.s2 && xx>x+w-3+((by-yy)>>1)) {} }

function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0);
  sky(b,tod);
  cathedral(b); tower(b); colonnade(b); sphinx(b,164,GY);
  protiron(b); kiosk(b); alley(b); shopHouse(b);
  // Pflaster mit Glanz (Spiegelung der Fassaden)
  var refl=b.clone(); paving(b,refl);
  // Schlagschatten: Säulengang und Stufen werfen kurze Schatten nach rechts hinten aufs Pflaster
  bench(b,48,GY+8,40);
  for (var x=PRO.x1-2;x<PRO.x1+6;x++) for (var y=GY;y<GY+6;y++) if (x<PRO.x1+6-(y-GY)) b.px(x,y,M.DN[M.DN[b.get(x,y)]]);
  // Tauben, die auf dem Gesims sitzen (statisch)
  [[22,17],[27,17],[90,17],[230,27],[300,27]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); });
  // Licht: leichte Vignette, Gasse dunkel
  M.light(b,M.lf.sum(M.lf.band(100,144,0,-0.5),M.lf.vignette(W,144,0.6)),0,0,function(x,y){ return y>=GY; });
  return M.finishTOD(b,tod,{sky:function(x,y){ return y<GY && b.get(x,y)>=P.b0 && b.get(x,y)<=P.b5; }}); }

// ---------------------------------------------------------------- bewegte Teile: Tauben, Wäsche im Wind
var PIG=[[226,122],[236,127],[247,120],[258,130],[268,124],[281,128],[214,131]];
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  function tp(x,y,c){ var sx=x-cam; if (sx<0||sx>=fb.w||y<0||y>=144) return; fb.px(sx,y,tint?M.tintPx(tint,c,sx,y):c); }
  // Tauben: picken, trippeln, ab und zu fliegt eine auf
  PIG.forEach(function(p,i){ var cyc=(t*0.35+hash(i,5)*7)%14, fly=cyc>12.5, x=p[0]+Math.round(Math.sin(t*0.4+i*1.7)*3), y=p[1], peck=Math.floor(t*3+i)%5===0, f=(i%2)?1:-1;
    if (fly){ var k=(cyc-12.5)/1.5, fx=x+f*k*30, fyy=y-k*40, wing=Math.floor(t*12)%2; tp(rnd(fx),rnd(fyy),P.m2); tp(rnd(fx)+1,rnd(fyy),P.m3); tp(rnd(fx)-1,rnd(fyy)-(wing?1:-1),P.m3); tp(rnd(fx)+2,rnd(fyy)-(wing?1:-1),P.m3); return; }
    tp(x-1,y,P.m1); tp(x,y-1,P.m3); tp(x+1,y-1,P.m3); tp(x+2,y-1,P.m2); tp(x,y,P.m2); tp(x+1,y,P.m2); tp(x-1,y-1,P.m2); tp(x+3*f>x?x+3:x-2,y,P.k2);
    var hx=f>0?x+2:x-1, hy=peck?y:y-2; tp(hx,hy,P.m3); tp(hx+(f>0?1:-1),hy,P.k2); tp(hx,hy-1,P.m4); tp(x+1,y-2,P.a4); });
  // Wäsche in der Bura: flattert nach rechts
  [[ALY.x0+2,26,ALY.x1+6,22,4],[ALY.x0+6,44,ALY.x1+4,40,3]].forEach(function(l,li){ var cols=[P.s6,P.r3,P.b3,P.y4,P.s5];
    for (var k=0;k<l[4];k++){ var u=0.15+k*0.22, lx=rnd(l[0]+(l[2]-l[0])*u), ly=rnd(l[1]+(l[3]-l[1])*u)+1, w=4+((k+li)%2)*2, h=5+((k*3+li)%3), c=cols[(k+li*2)%cols.length];
      for (var yy=0;yy<h;yy++){ var sw=Math.round(Math.sin(t*9+k*2+yy*0.8)*1.2+yy*0.9); for (var xx=0;xx<w;xx++) tp(lx+xx+sw,ly+yy,(xx===0||yy===h-1)?M.DN[c]:c); } } }); }
function front(fb,v,S,GS){ M.scn.buraDebris(fb,v.t,112,140,v.cam); }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ return y>=110 && y<=138 && x>=6 && x<=470; };

M.defineArt('oldtown',{
  width:W, paint:paint, walk:WALK, dynamic:dyn, front:front,
  spots:{
    exit:[0,96,12,44],
    columns:[0,18,166,82],
    belltower:[172,0,30,66],
    steps:[218,78,108,30],
    sphinx:[162,76,24,24],
    pigeons:[206,112,90,24],
    bench:[46,100,46,10],
    kiosk:[322,68,40,40],
    alley:[360,4,40,96],
    shop_window:[404,62,38,42],
    shop_door:[442,58,30,48],
    sign:[406,48,66,14]
  },
  stands:{
    exit:[8,124,'L'], columns:[80,116,'B'], belltower:[186,114,'B'], steps:[272,114,'B'], sphinx:[176,114,'B'], pigeons:[250,118,'R'],
    bench:[68,114,'B'], kiosk:[345,114,'B'], alley:[379,112,'B'], shop_window:[423,112,'B'], shop_door:[457,112,'B'], sign:[438,114,'B']
  },
  start:[30,124,'R'], entries:{ map:[16,124,'R'], shop:[457,116,'F'] }
});
})(M);
