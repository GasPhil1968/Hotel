/* ===== rooms/art/garaze.js — Garagenreihe in der Lipova, früher Bratstva i jedinstva (Revision K3, Regel 2).
   Sonntagvormittag. Hinten Wohnblöcke und der Bahndamm mit Zaun; davor sechs Garagen unter einer Betonplatte, Kipptore in verschiedenen
   Farben, Nummern 4 bis 9 über den Toren (über dem dritten und vierten abgeblättert). Links am Pfosten ein neues blaues Straßenschild
   „LIPOVA“, darunter halb überstrichen das alte Emailschild „BRATSTVA I JEDINSTVA“. In einem Fenster gegenüber eine Frau, die herschaut.
   S.g7open: das vierte Tor (Mates Sieben) ist hochgekippt, drinnen der helle Mercedes mit der Thermoskanne, an der Wand ein Kalender;
   S.hood: die Motorhaube offen; S.batTaken: die Batterie ist heraus. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, GY=112;
var G0=40, GW=44, GT=66, DT=72;                          // erste Garage, Breite, Dachunterkante, Torobergrenze
var COLS=[[P.c2,P.c3],[P.t2,P.t3],[P.m2,P.m3],[P.c1,P.c2],[P.g2,P.g3],[P.s3,P.s4]];
var NUMS=['4','5','','','8','9'];
function rd(v){ return Math.round(v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function gx(i){ return G0+i*GW; }
function back(b,tod){ var x, y;
  M.scn.sky(b,0,0,W,60,tod,'calm',61);
  // Wohnblöcke mit Fensterreihen, einer mit Balkonen; im zweiten Block die Frau am Fenster
  [[0,40,26],[52,70,34],[136,54,22],[196,80,38],[284,36,28]].forEach(function(bl,k){ var x0=bl[0], bw=bl[1], top=bl[2];
    for (y=top;y<62;y++) for (x=x0;x<x0+bw;x++){ var c=(x===x0)?P.s5:((x===x0+bw-1)?P.s2:P.s4); if (y===top) c=P.m3; if ((y-top)%6===3 && (x-x0)%6>=1 && (x-x0)%6<=3) c=(hash(x,y)<0.15)?P.y3:P.n2; if (k===3 && (y-top)%6===5) c=P.s3; b.px(x,y,c); } });
  WIN=[52+20,34+9]; b.rect(WIN[0],WIN[1],3,3,P.p3); b.px(WIN[0]+1,WIN[1]-1,P.k1); b.px(WIN[0],WIN[1]+3,P.r3); b.px(WIN[0]+2,WIN[1]+3,P.r3);
  // Bahndamm mit Gras, Gleis obenauf, Zaun
  for (x=0;x<W;x++){ var top2=rd(56+Math.sin(x*0.03)*1.5); for (y=top2;y<GT+2;y++) b.px(x,y,ra(R('g1 g2 g3 e3'),0.5-(y-top2)*0.03+(fbm(x*0.2,y*0.3)-0.5)*0.5,x,y));
    b.px(x,top2-1,P.m2); b.px(x,top2-2,(x%5===0)?P.w1:P.m3); if (x%9===0) b.vl(x,top2-7,top2-2,P.m1); if (x%3===0) b.px(x,top2-5,P.m1); } }
var WIN=[72,43];
function garages(b,S){ var x, y, i;
  // Dachplatte und Rückwand
  for (x=G0-4;x<gx(6)+4;x++){ for (y=GT-6;y<GT;y++) b.px(x,y,(y===GT-6)?P.s4:((y===GT-1)?P.s1:P.s3)); }
  for (i=0;i<6;i++){ var x0=gx(i), c=COLS[i], open=(i===3 && S && S.g7open);
    // Pfeiler
    for (y=GT;y<GY;y++){ b.px(x0,y,P.s4); b.px(x0+1,y,P.s3); b.px(x0+2,y,P.s2); }
    // Nummer über dem Tor (3 und 4 abgeblättert: nur Farbreste)
    b.rect(x0+18,GT+1,9,6,P.s5); if (NUMS[i]) M.microText(b,NUMS[i],x0+20,GT+2,P.k1); else { b.px(x0+20,GT+3,P.s2); b.px(x0+22,GT+4,P.s3); b.px(x0+23,GT+2,P.k2); }
    if (!open){ for (y=DT;y<GY;y++) for (x=x0+3;x<x0+GW;x++){ var rib=((y-DT)%5===0), cc=rib?c[0]:c[1]; if (fbm(x*0.3,y*0.2+i)>0.66) cc=P.t2; if (x===x0+3) cc=P.k2; b.px(x,y,cc); }
      b.rect(x0+20,DT+20,6,3,P.m4); b.px(x0+22,DT+23,P.k1); }                                   // Griff, Schloss
    else interior(b,x0,S); }
  // Endpfeiler
  for (y=GT;y<GY;y++){ b.px(gx(6),y,P.s4); b.px(gx(6)+1,y,P.s3); } }
// Garage sieben offen: Kipptor oben, drinnen der Mercedes (Front), Thermoskanne, Kalender
var CAR=null;
function interior(b,x0,S){ var x, y, hood=!!(S&&S.hood), bat=!(S&&S.batTaken);
  for (y=DT;y<GY;y++) for (x=x0+3;x<x0+GW;x++) b.px(x,y,(y<DT+4)?P.m1:(x<x0+6?P.k1:P.k0));
  for (x=x0+3;x<x0+GW;x++){ b.px(x,DT,P.c3); b.px(x,DT+1,P.c2); }                               // das hochgekippte Tor
  // Kalender an der Seitenwand
  b.rect(x0+34,DT+6,6,8,P.s6); b.hl(x0+34,x0+39,DT+6,P.r3); b.px(x0+36,DT+10,P.k1); b.px(x0+38,DT+11,P.r3);
  // der Mercedes von vorn: Dach, Windschutzscheibe mit Thermoskanne, Haube, Grill, Scheinwerfer, Stoßstange
  var cx0=x0+8, cx1=x0+38, top=DT+8;
  for (y=top;y<top+6;y++) for (x=cx0+4;x<cx1-4;x++) b.px(x,y,(y===top)?P.s5:P.n2);                // Scheibe
  b.rect(cx0+15,top+2,2,4,P.r3); b.px(cx0+15,top+1,P.k1);                                         // Thermoskanne auf dem Armaturenbrett
  if (!hood){ for (y=top+6;y<top+12;y++) for (x=cx0+1;x<cx1-1;x++) b.px(x,y,(y===top+6)?P.s6:P.s5); }
  else { for (y=top-3;y<top+1;y++) for (x=cx0+2;x<cx1-2;x++) b.px(x,y,(y===top-3)?P.s6:P.s4);       // Haube hochgestellt
    for (y=top+6;y<top+12;y++) for (x=cx0+1;x<cx1-1;x++) b.px(x,y,P.k1);
    b.rect(cx0+5,top+7,8,3,P.m2); b.rect(cx0+18,top+7,9,4,P.m1);
    if (bat){ b.rect(cx0+6,top+7,7,4,P.k2); b.px(cx0+7,top+7,P.r3); b.px(cx0+11,top+7,P.m4); b.px(cx0+9,top+8,P.g4); } }
  for (y=top+12;y<top+20;y++) for (x=cx0;x<cx1;x++) b.px(x,y,P.s4);
  for (x=cx0+10;x<cx1-10;x++) for (y=top+13;y<top+18;y++) b.px(x,y,((x+y)%2)?P.m3:P.m1);           // Grill
  [[cx0+4,top+15],[cx1-5,top+15]].forEach(function(h){ b.rect(h[0]-2,h[1]-2,5,4,P.m4); b.rect(h[0]-1,h[1]-1,3,2,P.s6); });
  b.rect(cx0-1,top+20,cx1-cx0+2,3,P.m4); b.hl(cx0-1,cx1,top+22,P.m2); b.rect(cx0+11,top+20,8,3,P.y4); M.microText(b,'M',cx0+13,top+20,P.k1);
  b.rect(cx0+1,top+23,4,6,P.k1); b.rect(cx1-5,top+23,4,6,P.k1);
  CAR=[cx0,top,cx1-cx0,top+29-top]; }
function sign(b){ var x0=6, w1=M.microWidth('LIPOVA')+5, w2=Math.max(w1+4,M.microWidth('BRATSTVA')+6);
  b.vl(x0+10,36,GY-1,P.m2); b.vl(x0+11,36,GY-1,P.m1);
  b.rect(x0,38,w1,8,P.b1); b.hl(x0,x0+w1-1,38,P.b3); M.microText(b,'LIPOVA',x0+3,40,P.s6);
  b.rect(x0-1,48,w2,8,P.s6); b.hl(x0-1,x0+w2-2,48,P.k1); b.hl(x0-1,x0+w2-2,55,P.k1); b.vl(x0-1,48,55,P.k1); b.vl(x0+w2-2,48,55,P.k1);
  M.microText(b,'BRATSTVA',x0+2,50,P.k1); for (var y=49;y<55;y++) for (var x=x0+14;x<x0+w2-2;x++) if (bayer(x,y)<0.8) b.px(x,y,(hash(x,y)<0.5)?P.m3:P.m4);   // halb überstrichen
}
function ground(b){ var x, y; for (y=GY;y<H;y++) for (x=0;x<W;x++){ var c=ra(R('m0 m1 m2 m3'),0.45+(fbm(x*0.05,y*0.2)-0.5)*0.6,x,y); if (hash(x,y)<0.02) c=P.m3; if (Math.abs(y-126-Math.sin(x*0.07)*2)<0.6 && hash(x>>2,1)<0.6) c=P.k1; b.px(x,y,c); }
  for (x=G0;x<gx(6);x++) b.px(x,GY,P.s2); }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0); back(b,tod); garages(b,S||{}); sign(b); ground(b);
  if (tod==='day') M.light(b,function(x,y){ var s=0; if (y>GT && y<GY && x>G0 && x<gx(6)) s-=0.2; return s+(fbm(x*0.02,y*0.03)-0.5)*0.3; }); else M.tintApply(b,M.TINT[tod]||M.TINT.night);
  return b; }
function walk(x,y){ return y>=118 && y<=140 && x>=8 && x<=310; }
var spots={ exit:[0,96,6,48], sign:[4,36,36,22], woman:[WIN[0]-3,WIN[1]-3,9,9] };
for (var i=0;i<6;i++) spots['g'+(i+1)]=[gx(i)+3,DT-6,GW-3,GY-DT+6];
var X4=gx(3), TOPC=DT+8;
spots.car=[X4+8,TOPC-3,30,32]; spots.hood=[X4+9,TOPC+5,28,8]; spots.battery=[X4+12,TOPC+6,10,6]; spots.calendar=[X4+33,DT+5,8,10]; spots.thermos=[X4+21,TOPC,8,7];
var stands={ exit:[10,126,'L'], sign:[30,124,'L'], woman:[80,124,'B'] };
for (i=0;i<6;i++) stands['g'+(i+1)]=[gx(i)+24,124,'B'];
stands.car=stands.g4; stands.hood=stands.g4; stands.battery=stands.g4; stands.calendar=stands.g4; stands.thermos=stands.g4;
M.defineArt('garaze',{ width:W, paint:paint, walk:walk, spots:spots, stands:stands, actorPos:{ mala:[70,124,'R'] }, start:[30,126,'R'], entries:{} });
})(M);
