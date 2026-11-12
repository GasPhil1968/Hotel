/* ===== rooms/art/k3_fahrt.js — unterwegs nach Skela (und zurück): das Taxi (alter weißer Mercedes) oder Dinos roter Roller auf der Straße
   nach Süden, die Neretva rechts unten. Die Landschaft zieht in Ebenen vorbei: Berge (langsam), Hügel mit Dörfern und Minaretten, Felder mit
   Pappeln und Masten, die Straße mit Mittelstreifen, die Leitplanke, die Böschung, der Fluss, vorn ab und zu eine Pappel (schnell).
   Tageszeit und Wetter wie in der Phase (klarer Samstag, Nacht, Frost, grauer Montag). Kein spielbarer Raum: Bühne für M.k3Drive
   (rooms/k3_fahrt.js). Raumzustand: kind 'taxi' | 'taxiBack' | 'dino', t0 (Abfahrt, ms), stop (Bremsbeginn, ms). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer;
var W=320, H=144, GY=108;                    // Unterkante der Räder
var VMAX=74, TA=1.3, TD=1.5;                 // Tempo (px/s auf Straßenhöhe), Anfahren und Bremsen (s)
function todOf(GS){ return (M.PHASES[GS.phase]||{}).tod||'day'; }
function wthOf(GS){ return M.scn&&M.scn.weather?M.scn.weather(GS):'calm'; }
function night(GS){ var t=todOf(GS); return t==='night'||t==='dusk'; }
// Fahrzeuge nachts wie die Figuren umfärben (Lichter selbst bleiben hell)
function lutOf(GS){ var t=todOf(GS); if (t==='day'||!M.TINT[t]) return null; var l=M.TINT[t].a; return M.detailLut?M.detailLut(l):l; }
// zurückgelegter Weg in px (Straßenebene) seit Abfahrt; mit Anfahren und Bremsen
function dist(S,gt){ if (!S.t0) return 0; var te=((S.stop?S.stop:gt)-S.t0)/1000, d=te<TA?0.5*VMAX*te*te/TA:0.5*VMAX*TA+VMAX*(te-TA);
  if (S.stop){ var ts=Math.min(TD,(gt-S.stop)/1000), v0=te<TA?VMAX*te/TA:VMAX; d+=v0*ts-0.5*(v0/TD)*ts*ts; } return d; }
M.k3RideDist=dist;
function dirOf(S){ return S.kind==='taxiBack'?-1:1; }
// Farben je Tageszeit
function pal(GS){ var t=todOf(GS), w=wthOf(GS), n=night(GS), g=w==='grey';
  return { mtn:M.R(n?'k1 n0 n1 c1':(g?'m2 m3 m4 s4':'n2 n3 c3 n4 c4')), snow:n?P.n2:(g?P.s5:P.n5),
    hill:M.R(n?'k1 k2 g0 g1':(g?'m1 g1 e1 m2 e2':'g1 g2 e2 g3 e3 g4')), wall:M.R(n?'k2 m0 m1':(g?'m3 s3 s4':'s3 s4 s5 s6')), roof:M.R(n?'k1 k2 m0':(g?'m1 m2 t1':'t1 t2 t3 m2')),
    field:M.R(n?'k1 k2 e0 g0':(g?'e1 m2 e2 g1':'e2 e3 w3 g2 e4')), poplar:M.R(n?'k1 w0 k2':(g?'w1 e1 w2 e2':'w2 y2 w3 y3 w4')), trunk:n?P.k1:P.w1,
    road:M.R(n?'k0 k1 k2':(g?'m0 m1 m2':'m0 m1 m2 m3')), line:n?P.m2:P.s5, rail:M.R(n?'k2 m1 m2':'m2 m3 m4 s5'), post:n?P.k2:P.m2,
    bank:M.R(n?'k0 k1 g0':(g?'k2 g1 e1 m1':'g1 g2 e2 w2 g3')), river:M.R(n?'k0 a0 a1 n1':(g?'a1 a2 m2 a3':'a1 a2 a3 a4 x3')), glint:n?P.n3:(g?P.m4:P.a6),
    lit:n, frost:w==='frost', grey:g }; }
// glatte Höhenlinie aus Sinus und Rauschen
function ridge(wx,a,s){ return Math.sin(wx*a[0]+s)*a[1]+Math.sin(wx*a[2]+s*2.1)*a[3]+Math.sin(wx*a[4]+s*0.7)*a[5]; }
function paint(S,GS){ var b=new M.Buf(W,H,P.k0), t=todOf(GS), w=wthOf(GS);
  M.scn.sky(b,0,0,W,78,t,w==='frost'?'calm':w,7);
  if (night(GS) && w!=='grey'){ M.moon(b,256,14,3); for (var i=0;i<46;i++){ var sx=Math.floor(hash(i,1)*W), sy=Math.floor(hash(i,2)*54); if (hash(i,3)<0.6) b.px(sx,sy,hash(i,4)<0.3?P.s6:P.n4); } }
  return b; }
// ---------------------------------------------------------------- Landschaft (jede Ebene mit eigener Geschwindigkeit)
function world(fb,S,GS,gt){ var d=dist(S,gt), dir=dirOf(S), C=pal(GS), x, y;
  var o=function(k){ return dir*d*k; };
  // Berge (Velež, Prenj): langsam, mit Schneerand auf den Gipfeln
  for (x=0;x<W;x++){ var wx=x+o(0.06), top=Math.round(50+ridge(wx,[0.012,7,0.031,4,0.083,1.6],1.3));
    for (y=top;y<80;y++){ var v=(y-top)/30; fb.px(x,y,M.rampAt(C.mtn,0.75-v*0.6,x,y)); } if (top<48 && !C.lit) fb.px(x,top,C.snow); if (top<44 && !C.lit) fb.px(x,top+1,C.snow); }
  // Hügel mit Dörfern: Häuser mit Steindach, Minarett, Zypressen
  var hillTop=function(wx){ return Math.round(70+ridge(wx,[0.021,5,0.055,3,0.13,1],4.2)); };
  for (x=0;x<W;x++){ var wx2=x+o(0.2), ht=hillTop(wx2); for (y=ht;y<96;y++) fb.px(x,y,M.rampAt(C.hill,0.85-(y-ht)/26*0.7+(hash(Math.floor(wx2/3),y)-0.5)*0.12,x,y)); }
  var off2=o(0.2), c0=Math.floor((0+off2)/34)-1, c1=Math.floor((W+off2)/34)+1;
  for (var c=c0;c<=c1;c++){ var r1=hash(c,11), r2=hash(c,12); if (r1<0.3) continue; var hx=Math.round(c*34+r2*20-off2), hbase=hillTop(c*34+r2*20)+3+Math.floor(hash(c,13)*5);
    if (r1>0.93){ var mh=24; for (y=hbase-mh;y<hbase;y++) fb.hl(hx,hx+1,y,y<hbase-mh+3?C.wall[2]:C.wall[1]); fb.px(hx,hbase-mh-1,C.wall[2]); fb.px(hx+1,hbase-mh-1,C.wall[2]); fb.px(hx,hbase-mh-2,C.roof[1]); fb.hl(hx-1,hx+2,hbase-mh+5,C.wall[2]); continue; }   // Minarett
    var hw=7+Math.floor(hash(c,14)*7), hh=5+Math.floor(hash(c,15)*4);
    for (y=hbase-hh;y<hbase;y++) for (x=hx;x<hx+hw;x++) fb.px(x,y,x===hx?C.wall[0]:(x===hx+hw-1?C.wall[0]:C.wall[1]));
    for (var k=0;k<3;k++) fb.hl(hx-1+k,hx+hw-k,hbase-hh-1-k,k===2?C.roof[2]:C.roof[1]);
    for (var wi=0;wi<2;wi++){ var wxx=hx+2+wi*Math.max(3,hw-5); if (wxx<hx+hw-1){ var lit=C.lit&&hash(c,20+wi)<0.55; fb.px(wxx,hbase-hh+2,lit?P.y4:P.k2); fb.px(wxx,hbase-hh+3,lit?P.y3:P.k2); } }
    if (hash(c,16)<0.5){ var zx=hx+hw+2; for (y=hbase-11;y<hbase;y++){ var zw=y<hbase-8?0:1; fb.hl(zx-zw,zx+zw,y,C.lit?P.k1:P.g1); } } }
  // Felder, Pappeln (November: gelb und braun), Telegrafenmasten mit Drähten
  for (x=0;x<W;x++){ var wx3=x+o(0.5); for (y=90;y<100;y++) fb.px(x,y,M.rampAt(C.field,0.5+Math.sin(wx3*0.07)*0.15+(y-90)*0.03+((Math.floor(wx3/26)%2)?0.12:0),x,y)); }
  var off3=o(0.5);
  for (var pc=Math.floor(off3/23)-1;pc<=Math.floor((W+off3)/23)+1;pc++){ if (hash(pc,31)<0.45) continue; var px=Math.round(pc*23+hash(pc,32)*12-off3), ph=22+Math.floor(hash(pc,33)*12), pb=97;
    for (y=pb-4;y<pb;y++) fb.px(px,y,C.trunk);
    for (y=pb-ph;y<pb-3;y++){ var t2=(y-(pb-ph))/ph, pw=Math.round(Math.sin(t2*Math.PI)*2.6+0.4); for (var xx=px-pw;xx<=px+pw;xx++) fb.px(xx,y,M.rampAt(C.poplar,0.35+((xx-px+pw)/(2*pw+1))*0.5+(hash(xx,y)-0.5)*0.25,xx,y)); } }
  var poleSp=92; for (var q=Math.floor(off3/poleSp)-1;q<=Math.floor((W+off3)/poleSp)+1;q++){ var qx=Math.round(q*poleSp-off3), qx2=Math.round((q+1)*poleSp-off3);
    for (y=72;y<99;y++) fb.px(qx,y,C.post); fb.hl(qx-3,qx+3,74,C.post);
    for (var wxp=qx;wxp<=qx2;wxp++){ var u=(wxp-qx)/poleSp, sag=Math.round(Math.sin(u*Math.PI)*5); fb.px(wxp,74+sag,C.lit?P.k2:P.m1); if (((wxp*7)>>2)%3===0) fb.px(wxp,77+sag,C.lit?P.k2:P.m1); } }
  // Straße mit Mittelstreifen (in Fahrtrichtung vorbei), Bankett
  for (x=0;x<W;x++){ var wx4=x+o(1); for (y=99;y<112;y++){ var c2=y===99?C.road[2]:(y>=110?C.road[0]:M.rampAt(C.road,0.45+(hash(Math.floor(wx4/2),y)-0.5)*0.25,x,y)); fb.px(x,y,c2); }
    if ((((wx4%34)+34)%34)<16){ fb.px(x,104,C.line); fb.px(x,105,C.line); } }
  // Leitplanke mit Pfosten
  for (x=0;x<W;x++){ var wx5=x+o(1.05); fb.px(x,111,C.rail[3]); fb.px(x,112,C.rail[2]); fb.px(x,113,C.rail[1]); if ((((wx5%28)+28)%28)<2) for (y=111;y<119;y++) fb.px(x,y,C.post); }
  // Böschung zum Fluss, Raureif bei Frost
  for (x=0;x<W;x++){ var wx6=x+o(1.12); for (y=114;y<126;y++){ var e=hash(Math.floor(wx6/2),y); fb.px(x,y,M.rampAt(C.bank,0.6-(y-114)/14+(e-0.5)*0.3,x,y)); if (C.frost && e>0.86) fb.px(x,y,P.n4); } }
  // die Neretva: fließt nach Süden, Spiegelungen und Glanzlichter
  for (x=0;x<W;x++){ var wx7=x+o(1.15)-gt*0.012; for (y=126;y<H;y++){ var v2=0.35+(y-126)/18*0.35+Math.sin(wx7*0.09+y*0.7)*0.1; var cc=M.rampAt(C.river,v2,x,y); if (Math.sin(wx7*0.21+y*1.9+gt*0.002)>0.94) cc=C.glint; fb.px(x,y,cc); } } }
// ---------------------------------------------------------------- Taxi: W123 in Creme, von der Seite, Schild „TAXI“ auf dem Dach
var TX={L:92,belt:25};
function taxiTop(u){ var p=[[0,19],[3,21],[19,22],[29,37],[33,39],[57,39],[62,36],[68,25],[72,24],[89,22],[92,18]];
  for (var i=0;i<p.length-1;i++){ var a=p[i], c=p[i+1]; if (u>=a[0]&&u<=c[0]) return a[1]+(c[1]-a[1])*(u-a[0])/Math.max(1,c[0]-a[0]); } return 18; }
function taxiWin(u,h){ if (h<TX.belt+1 || h>taxiTop(u)-2) return false; return (u>=31&&u<=45)||(u>=49&&u<=66); }
function bobOf(S,gt,kind){ if (!S.t0) return 0; var d=dist(S,gt), k=kind==='dino'?0.21:0.11; return (Math.sin(d*k)+Math.sin(d*k*2.3+1))>1.35?1:0; }
// Lage des Fahrzeugs (linke Kante) je nach Richtung
function vx(S){ return S.kind==='dino'?136:114; }
// Innenraum: dunkle Lehnen, durch die Scheiben die Landschaft gedämpft (vor den Figuren gezeichnet)
function taxiInside(fb,S,GS,gt){ var x0=vx(S), dir=dirOf(S), bob=bobOf(S,gt,'taxi'), lut=lutOf(GS);
  for (var u=0;u<=TX.L;u++){ var x=dir>0?x0+u:x0+TX.L-u; for (var h=TX.belt+1;h<=40;h++){ if (!taxiWin(u,h)) continue; var y=GY-h-bob, c=fb.d[y*W+x]; c=M.DN[M.DN[c]];
      if ((u>=33&&u<=43&&h<=33)||(u>=50&&u<=55&&h<=35)) c=(u===33||u===50)?P.k2:P.m0; if ((u>=51&&u<=54)&&h>=32&&h<=35) c=P.m1; if (lut && ((u>=33&&u<=43&&h<=33)||(u>=50&&u<=55&&h<=35))) c=lut[c]; fb.d[y*W+x]=c; } } }
function taxiBody(fb,S,GS,gt){ var x0=vx(S), dir=dirOf(S), bob=bobOf(S,gt,'taxi'), n=night(GS), d=dist(S,gt), lut=lutOf(GS), raw=fb, fbx={px:function(x,y,c){ raw.px(x,y,lut?lut[c]:c); },ellipse:function(a,b2,c,d2,e){ raw.ellipse(a,b2,c,d2,lut?lut[e]:e); }};
  var X=function(u){ return dir>0?x0+u:x0+TX.L-u; };
  var wheels=[18,73];
  for (var u=0;u<=TX.L;u++){ var top=Math.round(taxiTop(u)), x=X(u);
    for (var h=2;h<=top;h++){ var y=GY-h-bob; if (taxiWin(u,h)) continue; var arch=false; for (var k=0;k<2;k++){ var dx=u-wheels[k], dy=h-7; if (dx*dx+dy*dy<=8.6*8.6) arch=true; } if (arch) continue;
      var c=P.s5; if (h===top) c=P.s6; else if (h>top-2) c=P.s6; else if (h===13||h===14) c=h===14?P.s6:P.m4; else if (h<13) c=h<5?P.s2:P.s4; else if (h<=TX.belt) c=P.s5;
      if (h>TX.belt && !taxiWin(u,h)) c=(u===46||u===47||u===48)?P.m2:((u>=29&&u<31)?P.m2:(h>top-3?P.s6:P.m3));   // Säulen und Dachrahmen
      if (u===30||u===47||u===67) if (h<=TX.belt && h>4) c=P.s3;   // Türfugen
      if ((u===42||u===63) && h===21) c=P.m4; if ((u===43||u===64) && h===21) c=P.s6;   // Türgriffe
      var lamp=false; if (u<2 && h>=12 && h<=17){ c=n?P.r4:P.r3; lamp=n; } if (u>89 && h>=14 && h<=17){ c=n?P.y5:P.s6; lamp=n; }   // Rücklicht, Scheinwerfer
      if ((u<7||u>85) && h>=6 && h<=9 && !lamp) c=h===9?P.s6:P.m4;   // Stoßstangen
      if (lamp) raw.px(x,y,c); else fbx.px(x,y,c); } }
  // Schild „TAXI“
  for (var su=40;su<=52;su++) for (var sh=40;sh<=44;sh++){ var yy=GY-sh-bob; (n?raw:fbx).px(X(su),yy,sh===44?P.y4:(su===40||su===52?P.y2:P.y3)); }
  if (M.microText){ var tx=dir>0?X(41):X(51); M.microText(fb,'TAXI',tx,GY-44-bob,P.k1); }
  // Räder (mit Radkappe, dreht sich)
  wheels.forEach(function(wu){ var cx=X(wu), cy=GY-7; fbx.ellipse(cx+0.5,cy+0.5,7,7,P.k1); fbx.ellipse(cx+0.5,cy+0.5,6,6,P.k2); fbx.ellipse(cx+0.5,cy+0.5,3.4,3.4,P.m3);
    var a=-dir*d/7; for (var s=0;s<3;s++){ var aa=a+s*2.094; fbx.px(Math.round(cx+Math.cos(aa)*2),Math.round(cy+Math.sin(aa)*2),P.s5); } fbx.px(cx,cy,P.m1); });
  // Glanz auf den Scheiben (schräg, über den Köpfen)
  for (var gu=31;gu<=66;gu++) for (var gh=TX.belt+1;gh<=39;gh++){ if (!taxiWin(gu,gh)) continue; var s2=(gu+gh*0.9)%23; if (s2<0.8 && ((gu+gh)&1)) fb.px(X(gu),GY-gh-bob,n?P.n2:P.s4); }
  // Schatten unter dem Wagen
  for (var sx=X(4);dir>0?sx<=X(88):sx>=X(88);sx+=dir){ var cc=fb.d[(GY+1)*W+sx]; fb.px(sx,GY+1,M.DN[M.DN[cc]]); cc=fb.d[GY*W+sx]; if (fb.d[GY*W+sx]!==P.k1) fb.px(sx,GY,M.DN[cc]); }
  if (n){ for (var lx=1;lx<70;lx++) for (var ly=-6;ly<=4;ly++){ var w2=2+lx*0.12; if (Math.abs(ly)>w2) continue; var px=dir>0?X(92)+lx:X(92)-lx, py=GY-15+ly+Math.round(lx*0.18); if (px<0||px>=W||py<0||py>=H) continue; if (bayer(px,py)<0.55-lx/160) fb.px(px,py,M.UP[M.UP[fb.d[py*W+px]]]); } } }
// ---------------------------------------------------------------- Dinos Roller (rot, klein, Vespa-Form), zwei Helme
function scooter(fb0,S,GS,gt){ var x0=vx(S), bob=bobOf(S,gt,'dino'), n=night(GS), d=dist(S,gt), lut=lutOf(GS);
  var fb={px:function(x,y,c){ fb0.px(x,y,lut?lut[c]:c); },hl:function(a,b2,y,c){ fb0.hl(a,b2,y,lut?lut[c]:c); },ellipse:function(a,b2,c,d2,e){ fb0.ellipse(a,b2,c,d2,lut?lut[e]:e); },d:fb0.d};
  var X=function(u){ return x0+u; }, Y=function(h){ return GY-h-bob; }, R=M.R('r1 r2 r3 r4');
  // Heckhaube (bauchig) mit Sitzbank
  for (var u=0;u<=25;u++){ var top=Math.round(6+Math.sin(Math.min(1,u/25)*Math.PI*0.85)*12); for (var h=4;h<=top;h++){ var v=0.35+(h/top)*0.5-(u<3?0.2:0); fb.px(X(u),Y(h),M.rampAt(R,v,X(u),Y(h))); } }
  for (var su=5;su<=25;su++){ fb.px(X(su),Y(19),P.k2); fb.px(X(su),Y(20),su<8?P.k2:P.m0); fb.px(X(su),Y(18),P.k1); }
  // Trittbrett, Beinschild, Lenksäule, Lenker mit Scheinwerfer, Kotflügel vorn
  for (var fu=24;fu<=33;fu++){ fb.px(X(fu),Y(5),P.m2); fb.px(X(fu),Y(4),P.k2); }
  for (var lh=5;lh<=27;lh++){ var lu=Math.round(33+(lh-5)*0.18); fb.px(X(lu),Y(lh),R[1]); fb.px(X(lu+1),Y(lh),R[2]); fb.px(X(lu+2),Y(lh),lh>20?R[3]:R[2]); }
  for (var ch=27;ch<=31;ch++) fb.px(X(38),Y(ch),P.m3); fb.hl(X(34),X(41),Y(31),P.m4); fb.px(X(41),Y(30),P.k1);
  fb0.px(X(39),Y(29),n?P.y5:P.s6); fb0.px(X(40),Y(29),n?P.y5:P.s5); fb.px(X(39),Y(28),P.m3);
  for (var fu2=36;fu2<=45;fu2++){ var fh=Math.round(8+Math.sin((fu2-36)/9*Math.PI)*3); fb.px(X(fu2),Y(fh),R[2]); fb.px(X(fu2),Y(fh+1),R[3]); }
  // Räder
  [8,40].forEach(function(wu){ var cx=X(wu), cy=Y(5); fb.ellipse(cx+0.5,cy+0.5,5,5,P.k1); fb.ellipse(cx+0.5,cy+0.5,2.4,2.4,P.m3); var a=d/5; fb.px(Math.round(cx+Math.cos(a)*1.6),Math.round(cy+Math.sin(a)*1.6),P.s5); });
  // Auspuff und Wölkchen nach hinten
  fb.hl(X(-2),X(4),Y(5),P.m3); for (var k=0;k<5;k++){ var age=((gt/120)+k*1.7)%8, px=Math.round(X(-3)-age*3.2), py=Math.round(Y(5)-age*0.6); if (age<7 && bayer(px+k,py)<0.7-age*0.08) fb.px(px,py,age<3?P.m4:P.m3); }
  if (n){ for (var lx=1;lx<60;lx++) for (var ly=-4;ly<=3;ly++){ if (Math.abs(ly)>1+lx*0.09) continue; var px2=X(41)+lx, py2=Y(29)+ly+Math.round(lx*0.32); if (px2>=W||py2>=H) continue; if (bayer(px2,py2)<0.5-lx/140) fb0.px(px2,py2,M.UP[M.UP[fb0.d[py2*W+px2]]]); } }
  for (var sx=X(0);sx<=X(46);sx++){ var c=fb0.d[(GY+1)*W+sx]; fb0.px(sx,GY+1,M.DN[c]); } }
// Kopf einer Figur in der Pose (oben links, Breite, Höhe), für Helme
function headBox(id,pose,ax,ay){ var ch=M.CHARS[id]; if (!ch||!pose) return null; var set=ch.heads.S, rows=set.n, w=0; rows.forEach(function(r){ w=Math.max(w,r.length); });
  var L=ch.tLen, hy=pose.h[1]-(ch.hipY-23), ln=pose.ln||0, shx=Math.round(ln*(L-2)/(L-1)), nk=ch.neck.S, ho=pose.ho||[0,0];
  return {x:ax+pose.h[0]+shx-nk[0]+ho[0]+1, y:ay+hy-L-nk[1]+ho[1]+1, w:w, h:rows.length}; }
function helmet(fb,hb,cols,small,lut){ if (!hb) return; if (lut) cols=cols.map(function(c){ return lut[c]; }); var x0=hb.x+(small?2:1), x1=hb.x+hb.w-(small?3:1), y0=hb.y-(small?1:2), cx=(x0+x1)/2, rx=(x1-x0)/2+0.5, ry=small?3.5:5;
  for (var y=Math.floor(y0);y<=y0+ry;y++) for (var x=x0;x<=x1;x++){ var dx=(x+0.5-cx)/rx, dy=(y+0.5-(y0+ry))/ry; if (dx*dx+dy*dy>1||y>y0+ry) continue; var c=dx>0.35?cols[2]:(dx<-0.2&&dy<-0.3?cols[0]:cols[1]); fb.px(x,y,c); }
  for (var x2=x0-1;x2<=x1+1;x2++) fb.px(x2,Math.round(y0+ry),cols[3]); if (small){ fb.px(Math.round(cx),Math.round(y0+1),P.n4); fb.px(Math.round(cx)-2,Math.round(y0+2),P.y5); } }
// „Zwei Helme, einer davon für ein Kind. Ich nehme den anderen.“ – der gelbe Kinderhelm bleibt leer und hängt am Riemen hinten am Roller, unter Malas Platz
function kidHelmet(fb,S,GS,gt,lut){ var x0=vx(S), bob=bobOf(S,gt,'dino'), d=dist(S,gt), sw=Math.round(Math.sin(gt/260+d/40)*0.8);   // pendelt ein wenig
  var L=function(c){ return lut?lut[c]:c; }, cx=x0+4+sw, top=GY-15-bob;
  fb.px(x0+5,GY-18-bob,L(P.k2)); fb.px(x0+5+(sw>0?1:0),GY-17-bob,L(P.k2)); fb.px(cx,GY-16-bob,L(P.k2));   // Riemen vom Gepäckhaken
  var R=['.yyy.','yYyyd','yyydd','kkkkk'];
  R.forEach(function(r,j){ for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch==='.') continue; var c=ch==='Y'?P.y5:(ch==='y'?P.y4:(ch==='d'?P.y2:P.k1)); fb.px(cx-2+i,top+j,L(c)); } }); }
function dynamic(fb,view,S,GS){ var gt=view.gt; world(fb,S,GS,gt);
  if (S.kind==='dino') scooter(fb,S,GS,gt); else taxiInside(fb,S,GS,gt);
  // Figuren wippen mit dem Fahrzeug
  var bob=bobOf(S,gt,S.kind==='dino'?'dino':'taxi'), E=M.E; (S.riders||[]).forEach(function(r){ var a=E.ACT[r.id]; if (a) a.y=r.y-bob; }); }
function front(fb,view,S,GS){ var gt=view.gt, E=M.E;
  if (S.kind!=='dino') taxiBody(fb,S,GS,gt);
  else { var d=E.ACT.dino, m=E.ACT.marko; var hl=lutOf(GS); if (d) helmet(fb,headBox('dino',E.actorPose(d),Math.round(d.x),Math.round(d.y)),[P.r4,P.r2,P.r1,P.k1],false,hl);
    if (m && E.actorShown(m)) helmet(fb,headBox('marko',E.actorPose(m),Math.round(m.x),Math.round(m.y)),[P.m4,P.m3,P.m2,P.k1],false,hl);
    kidHelmet(fb,S,GS,gt,hl); }
  // vorn am Ufer: Schilf und Gebüsch, das schnell vorbeizieht (verdeckt die Fahrzeuge nicht)
  var d2=dist(S,gt), dir=dirOf(S), off=dir*d2*1.6, C=pal(GS);
  for (var c=Math.floor(off/46)-1;c<=Math.floor((W+off)/46)+1;c++){ if (hash(c,51)<0.4) continue; var px=Math.round(c*46+hash(c,52)*30-off), bh=7+Math.floor(hash(c,53)*9), bw=4+Math.floor(hash(c,54)*7);
    for (var y=H-bh-4;y<H;y++){ var t=(y-(H-bh-4))/bh, w=Math.round(bw*Math.min(1,0.4+t)); for (var x=px-w;x<=px+w;x++){ if (x<0||x>=W) continue; if (y<H-bh && ((x+c)%3)) continue; fb.px(x,y,M.rampAt(C.bank,0.25+((x-px+w)/(2*w+1))*0.45+(hash(x,y)-0.5)*0.25,x,y)); } }
    if (hash(c,55)<0.5) for (var k=0;k<4;k++){ var rx=px+k*3-4, rh=12+Math.floor(hash(c,56+k)*8); for (var y2=H-rh;y2<H-4;y2++) if (rx>=0&&rx<W) fb.px(rx+Math.round((H-y2)*0.05*(k-1.5)),y2,(y2<H-rh+3)?C.poplar[1]:C.bank[1]); } } }
M.ART.k3_fahrt={ width:W, paint:paint, dynamic:dynamic, front:front, start:[150,GY+1,'R'], walk:function(){ return false; } };
M.k3RideHeadBox=headBox;
})(M);
