/* ===== rooms/art/map4.js — Stadtplan von München (Kapitel 4) =====
   Eine gezeichnete Karte auf Papier, auf ein Holzbrett geheftet wie die Pläne von Split, Sarajevo und Mostar. Rechts im Osten
   fließt die Isar als blaues Band von Süd nach Nord (mit der Museumsinsel und den Brücken), westlich davon die Altstadt im Ring
   (kleine, dichte Häuser), nördlich daran der Hofgarten und am Fluss der Englische Garten. In der Mitte links das große Gleisfeld
   des Hauptbahnhofs (Kopfbahnhof: die Gleise enden an der Halle), nach Westen die Gleise mit der Hackerbrücke und dem langen
   Dach des Busbahnhofs daneben, nach Nordwesten die Bahn nach Moosach. Südwestlich die Theresienwiese als ovale Fläche, an ihrem
   Westrand der Bavariapark, westlich davon das Westend; südlich des Bahnhofs das Bahnhofsviertel; östlich der Isar Giesing; im
   Norden der Olympiapark mit dem See, im Nordwesten Moosach (lockere, größere Blöcke).
   Keine Ortsnamen auf dem Plan außer „MÜNCHEN“ (Kartusche unten) und dem Fluss „ISAR“; Marken und Namen setzt das Gerüst.
   Exporte: M.paintMap4(S,GS) -> M.Buf(320,144); M.MAP4_POS = { ortId:[x,y] } (Mittelpunkt der Marke). Kein M.defineArt. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var X0=8, Y0=6, X1=312;

M.MAP4_POS={ moosach:[40,24], zob:[98,40], hbf:[150,52], westend:[44,78], heim:[64,110], wiesn:[110,97], bhfviertel:[160,85],
  friedhof:[206,90], konsulat:[208,38], giesing:[276,110] };

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
// Papier unten leicht ausgefranst
function edgeY(x){ return 135+Math.sin(x*0.19)*1.2+Math.sin(x*0.61+2)*0.8+(hash(x,9)<0.2?-1-Math.floor(hash(x,10)*2):0); }
function paperC(x,y){ var h=hash(Math.floor(x/3),Math.floor(y/2)), h2=hash(x,y), i=h<0.3?0:(h<0.85?1:2); if (h2>0.93) i=Math.min(3,i+1); if (h2<0.05) i=Math.max(0,i-1); return [P.s4,P.s5,P.s5,P.s6][i]; }
// Isar: Mitte je Zeile (von Süd nach Nord leicht nach Osten), Breite
var RIV=[[226,146],[229,130],[234,114],[240,100],[245,88],[249,76],[255,62],[261,46],[267,30],[271,16],[274,0]];
function riverX(y){ for (var i=0;i<RIV.length-1;i++){ var a=RIV[i], b=RIV[i+1]; if (y<=a[1]&&y>=b[1]) return a[0]+(b[0]-a[0])*(a[1]-y)/(a[1]-b[1]); } return 274; }
function riverW(y){ return 2.6+(y>82&&y<96?1.6:0); }
// Flächen: Wasser, Parks, Gleise, Wiesn, Altstadt
var ALT={cx:206,cy:80,rx:24,ry:18};
function inOval(x,y,cx,cy,rx,ry){ var dx=(x-cx)/rx, dy=(y-cy)/ry; return dx*dx+dy*dy; }
function trackY(x){ return 52+(x<150?(150-x)*0.02:0); }                    // Mitte des Gleisfelds
function trackHW(x){ return x>144?0:(x>120?7:(x>70?5.5:4.5)); }            // halbe Breite (Kopfbahnhof: endet an der Halle)
function moosachLine(x){ return 46-(70-x)*0.62; }                         // Bahn nach Nordwesten (y je x, für x<70)
function park(x,y){
  if (x>236 && x<riverX(y)-3 && y<44 && y>Y0) return true;                 // Englischer Garten
  if (inOval(x,y,80,103,6,7)<1) return true;                               // Bavariapark
  if (inOval(x,y,163,45,6,4)<1) return true;                               // Alter Botanischer Garten
  if (inOval(x,y,214,58,6,3.4)<1) return true;                             // Hofgarten
  if (inOval(x,y,132,15,20,8)<1) return true;                              // Olympiapark
  if (inOval(x,y,18,44,10,8)<1) return true;                               // Schlosspark (Westen)
  var rx=riverX(y), d=Math.abs(x-rx); if (d>riverW(y)+0.5 && d<riverW(y)+3.2 && y>40) return true;   // Isarauen
  return false; }
function wiesn(x,y){ return inOval(x,y,110,99,17,11)<1 && !(y<92 && x<98); }
function water(x,y){ var rx=riverX(y); if (Math.abs(x+0.5-rx)<riverW(y)) return !(y>84 && y<94 && Math.abs(x+0.5-rx)<1.2); return inOval(x,y,126,17,6,2.6)<1; }
function onTracks(x,y){ if (x<X0||x>146) return false; var hw=trackHW(x); if (hw && Math.abs(y-trackY(x))<=hw) return true; if (x<70 && x>12 && Math.abs(y-moosachLine(x))<1.2) return true; return false; }
// Bebauung: 0 = frei, sonst Dichte (Altstadt dicht, Moosach locker)
function town(x,y){ if (water(x,y)||park(x,y)||wiesn(x,y)||onTracks(x,y)) return 0; var rx=riverX(y); if (Math.abs(x-rx)<riverW(y)+3.5) return 0;
  var dc=Math.hypot((x-190)/150,(y-74)/80), d=cl(1.05-dc*0.55,0.42,1)*(0.85+fbmL(x,y)*0.3); if (y<34 && x<90) d=0.42; if (inOval(x,y,ALT.cx,ALT.cy,ALT.rx,ALT.ry)<1) d=1.25; if (x>rx) d*=0.9; if (x<X0+3||x>X1-3) d=0; return d; }
function fbmL(x,y){ var gx=Math.floor(x/23), gy=Math.floor(y/17), fx=x/23-gx, fy=y/17-gy, a=hash(gx,gy+50), b=hash(gx+1,gy+50), c=hash(gx,gy+51), e=hash(gx+1,gy+51); fx=fx*fx*(3-2*fx); fy=fy*fy*(3-2*fy); return a+(b-a)*fx+(c-a)*fy+(a-b-c+e)*fx*fy; }

M.paintMap4=function(S,GS){ var b=new M.Buf(320,144,P.k0), x, y, i;
  for (y=0;y<144;y++) for (x=0;x<320;x++) b.px(x,y,M.tex.boards(x,y,R('w0 w1 w2 w3'),7));
  // Papier mit Faltlinien und Rissrand
  for (x=X0;x<X1;x++){ var ey=edgeY(x); for (y=Y0;y<ey;y++){ var c=paperC(x,y), tw=town(x,y); if (tw>0.1 && bayer(x,y)<tw*0.12) c=P.e4;
      var u=x-X0, v=y-Y0; if (u===101||u===202||v===64) c=M.DN[c]; if (y>ey-2.2) c=(hash(x,y)<0.5)?P.s3:P.e4; b.px(x,y,c); }
    if (hash(x,3)<0.3) b.px(x,Math.floor(ey),P.s3); }
  // Parks: grün mit Baumtupfen; der See im Olympiapark
  for (y=Y0;y<136;y++) for (x=X0;x<X1;x++){ if (!park(x,y) || y>edgeY(x)-2) continue; var c2=hash(x,y)<0.5?P.g4:P.g5; if (hash(x*1.7,y*2.3)<0.08) c2=P.g3; b.px(x,y,c2); }
  // Häuserblöcke: Raster je Gegend, in der Altstadt klein und dicht, in Moosach groß und locker, östlich der Isar etwas schräg
  for (y=Y0+2;y<133;y++) for (x=X0+2;x<X1-2;x++){ var tw2=town(x,y); if (tw2<0.2) continue; var old=inOval(x,y,ALT.cx,ALT.cy,ALT.rx,ALT.ry)<1, east=x>riverX(y), far=(y<34&&x<90);
    var xx=east?x+Math.floor(y*0.35):x, gx=old?3:(far?9:(east?7:6)), gy=old?3:(far?6:5), cx2=Math.floor(xx/gx), oy=Math.floor(hash(cx2,3)*gy), cy2=Math.floor((y+oy)/gy), bx=xx-cx2*gx, by=(y+oy)-cy2*gy;
    if (bx===0||by===0) continue; if (hash(cx2*1.7,cy2*2.3)>tw2*0.78) continue; if (far && (bx>5||by>3)) continue; if (!old && hash(cx2*3.1,cy2*1.3)<0.12 && (bx>3||by>2)) continue;
    b.px(x,y,old?((bx===1||by===1)?P.e1:P.e3):((bx===1||by===1)?P.e3:P.e4)); }
  // Theresienwiese: leere, helle Fläche mit gestricheltem Rand; am Westrand die Ruhmeshalle (kleines U)
  for (y=86;y<112;y++) for (x=90;x<130;x++){ if (!wiesn(x,y)) continue; var e=inOval(x,y,110,99,17,11); b.px(x,y,e>0.82?((x+y)%3?P.e3:P.s5):(hash(x,y)<0.08?P.s4:P.s6)); }
  b.hl(93,99,90,P.e1); b.vl(93,90,93,P.e1); b.vl(99,90,93,P.e1); b.px(96,92,P.e2);
  // Straßen: Altstadtring, Ausfallstraßen (hell, doppelt gesäumt)
  function road(pts,w){ for (var k=0;k<pts.length-1;k++){ var a=pts[k], c=pts[k+1], L=Math.max(1,Math.round(Math.hypot(c[0]-a[0],c[1]-a[1])));
      for (var s=0;s<=L;s++){ var px=lerp(a[0],c[0],s/L), py=lerp(a[1],c[1],s/L), nx=-(c[1]-a[1])/L, ny=(c[0]-a[0])/L;
        for (var q=-w-1;q<=w+1;q++){ var X=rnd(px+nx*q), Y=rnd(py+ny*q); if (X<X0||X>=X1||Y<Y0||Y>=edgeY(X)-1) continue; if (water(X,Y)) continue; b.px(X,Y,Math.abs(q)>w?P.e2:P.s6); } } } }
  var ring=[]; for (i=0;i<=40;i++){ var a2=i/40*Math.PI*2; ring.push([ALT.cx+Math.cos(a2)*ALT.rx,ALT.cy+Math.sin(a2)*ALT.ry]); } road(ring,0.6);
  road([[183,90],[160,108],[134,124],[118,138]],0.6);                      // nach Südwesten (Lindwurmstraße)
  road([[146,62],[100,66],[60,70],[X0,74]],0.6);                           // nach Westen, südlich der Gleise
  road([[146,42],[110,32],[80,20],[60,8]],0.6);                            // nach Nordwesten
  road([[208,62],[210,36],[212,Y0]],0.6);                                  // nach Norden
  road([[228,86],[260,96],[290,108],[X1,116]],0.6);                        // nach Südosten, über die Isar
  road([[182,72],[158,62]],0.5); road([[226,72],[252,64]],0.5); road([[214,98],[236,108],[270,124]],0.5);
  // Gleisfeld des Hauptbahnhofs und die Bahn nach Moosach
  for (x=X0;x<=146;x++){ var ty=trackY(x), hw=trackHW(x); if (!hw) continue; for (y=Math.floor(ty-hw);y<=Math.ceil(ty+hw);y++){ var off=y-ty, c3=(Math.abs(off)>hw-0.6)?P.e2:(((Math.floor(off+20))%2)?P.m3:P.s3); if (hash(x,y)<0.05) c3=P.m2; b.px(x,y,c3); } }
  for (x=X0+4;x<=146;x+=5){ var ty2=trackY(x), hw2=trackHW(x); if (hw2) for (y=Math.floor(ty2-hw2+1);y<=Math.ceil(ty2+hw2-1);y+=2) b.px(x,y,P.m1); }   // Schwellen
  b.rect(144,43,12,19,P.m1); b.rect(145,44,10,17,P.m2); for (y=45;y<60;y+=2) b.hl(145,154,y,P.m3); b.vl(144,43,61,P.k2); b.hl(144,155,43,P.m3);   // die Halle des Kopfbahnhofs
  for (x=13;x<72;x++){ var my=rnd(moosachLine(x)); if (my<Y0+1) continue; b.px(x,my-1,P.k2); b.px(x,my+1,P.k2); b.px(x,my,((x>>2)%2)?P.s6:P.k2); }
  // Hackerbrücke (heller Steg über die Gleise mit Bogen) und das lange Dach des Busbahnhofs nördlich daneben
  for (y=44;y<=60;y++){ b.px(97,y,P.s6); b.px(98,y,P.s6); b.px(96,y,P.e2); b.px(99,y,P.e2); } for (i=0;i<4;i++){ b.px(95,46+i*4,P.e1); b.px(100,46+i*4,P.e1); }
  b.rect(86,38,22,4,P.s6); b.hl(86,107,38,P.e1); b.hl(86,107,41,P.e2); b.vl(86,38,41,P.e1); b.vl(107,38,41,P.e1);
  // Isar: blaues Band mit hellem Rand, Strömungsstrichen und der Museumsinsel; Brücken
  for (y=Y0;y<146;y++){ var ey2=edgeY(rnd(riverX(y))); if (y>ey2) break; var rc=riverX(y), w=riverW(y);
    for (x=Math.floor(rc-w-1);x<=Math.ceil(rc+w+1);x++){ var d=Math.abs(x+0.5-rc); if (d>w+0.9) continue; var c4=d>w?P.s6:(d>w-0.9?P.a3:(hash(x,y)<0.15?P.a5:P.a4));
      if (d<=w-0.9 && (y+Math.floor(x*0.5))%7===0) c4=P.a5; if (y>84 && y<94 && d<1.2) c4=(y===85||y===93)?P.e2:P.g4; b.px(x,y,c4); } }
  [64,90,106,122].forEach(function(by){ var bx=rnd(riverX(by)); b.hl(bx-5,bx+5,by,P.s6); b.hl(bx-5,bx+5,by-1,P.e2); b.hl(bx-5,bx+5,by+1,P.e2); });
  for (x=121;x<132;x++) for (y=15;y<20;y++) if (water(x,y)){ var c5=hash(x,y)<0.2?P.a5:P.a4; b.px(x,y,c5); }
  M.microText(b,'ISAR',rnd(riverX(70))+7,68,P.a2);
  // Kartusche „MÜNCHEN“ (unten Mitte) und Kompass (oben rechts)
  var kx=130, ky=114, kw=56, kh=18; b.rect(kx,ky,kw,kh,P.s5); b.hl(kx,kx+kw-1,ky,P.e1); b.hl(kx,kx+kw-1,ky+kh-1,P.e1); b.vl(kx,ky,ky+kh-1,P.e1); b.vl(kx+kw-1,ky,ky+kh-1,P.e1); b.hl(kx+2,kx+kw-3,ky+2,P.e3); b.hl(kx+2,kx+kw-3,ky+kh-3,P.e3);
  var tw=M.textWidth('MÜNCHEN'); M.text(b,'MÜNCHEN',kx+rnd((kw-tw)/2),ky+3,P.e0); M.microText(b,'2011',kx+rnd(kw/2)-7,ky+11,P.r2);
  var ccx=294, ccy=24; b.line(ccx,ccy-9,ccx,ccy+9,P.e1); b.line(ccx-9,ccy,ccx+9,ccy,P.e1); b.poly([[ccx,ccy-10],[ccx+2,ccy],[ccx,ccy+10],[ccx-2,ccy]],P.r2); b.poly([[ccx,ccy],[ccx+2,ccy],[ccx,ccy+10],[ccx-2,ccy]],P.e1); M.text(b,'N',ccx-2,ccy-19,P.e1);
  // Reißzwecken
  [[11,9],[309,9],[11,130],[309,130]].forEach(function(p){ b.ellipse(p[0]+0.5,p[1]+0.5,2,2,P.r2); b.px(p[0],p[1],P.r4); });
  M.light(b,M.lf.sum(M.lf.pool(160,70,220,110,1.1),M.lf.vignette(320,144,2.2),M.lf.k(-0.3)));
  return b; };
})(M);
