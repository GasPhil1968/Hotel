/* ===== rooms/art/peilung.js — Kartenansicht der Peilung (Kapitel 3) =====
   Eine größere Karte als der Stadtplan, 280 × 150: oben Mostar (die Neretva von Nord nach Süd, Ostufer rechts, Westufer links,
   die Altstadt an der Alten Brücke), darunter das breite Tal bis etwa zwölf Kilometer südlich, wo der Fluss sich in Biegungen
   durch Felder legt. Westlich der Hum, östlich der Velež. Keine Ortsnamen, nur Landmarken (Glockenturm, zwei Kräne, Hochhaus,
   Hum, Velež, Flussbiegung, Mühle). Die Geometrie trägt das Rätsel: Brückenkopf und Minarett liegen nah beieinander, ihre
   Fächer zeigen beide nach Süden und schneiden sich sehr flach (ein langer Streifen bis hinter den Rand); der Fächer vom
   Westhang kommt aus deutlich anderer Richtung und schneidet den Streifen an der Biegung zu einem kurzen Stück Fluss: Skela.
   Mit st.old dieselbe Gegend als vergilbte Straßenkarte von 1985 (Zdravkos Karte): Dörfer, Brücken und Fähren; mit st.skela
   steht an der Biegung ein Brückensymbol.
   Exporte: M.PEIL, M.paintPeilung(b,st), M.peilFan(b,from,p1,p2,col), M.peilArea(b,poly,col). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=280, H=150;

// ---------------------------------------------------------------- Geometrie (Koordinaten im 280×150-Bild)
var RIV=[[153,-2],[150,18],[147,36],[146,52],[147,64],[146,76],[142,89],[134,101],[127,110],[123,118],[117,127],[124,135],[136,140],[148,145],[156,152]];
M.PEIL={ w:W, h:H,
  stations:{ bridgehead:[150,52], minaret:[158,58], partizan:[96,40] },
  landmarks:{ L_church:[142,67], L_crane1:[133,94], L_crane2:[141,79], L_tower:[152,70], L_hum:[112,72], L_velez:[238,44], L_bend:[117,127], L_mill:[139,139] },
  // je Standort die zwei Landmarken, die die Richtung zur Biegung einrahmen
  answer:{ bridgehead:['L_church','L_crane2'], minaret:['L_tower','L_crane1'], partizan:['L_mill','L_bend'] },
  skela:[123,118], river:RIV };

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function riverX(y){ for (var i=0;i<RIV.length-1;i++){ var a=RIV[i], b=RIV[i+1]; if (y>=a[1]&&y<=b[1]) return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]); } return null; }
// Abstand eines Punktes zur Flusslinie
function riverD(x,y){ var best=1e9; for (var i=0;i<RIV.length-1;i++){ var a=RIV[i], b=RIV[i+1], vx=b[0]-a[0], vy=b[1]-a[1], t=cl(((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy),0,1), dx=x-a[0]-vx*t, dy=y-a[1]-vy*t, d=dx*dx+dy*dy; if (d<best) best=d; } return Math.sqrt(best); }
// Gelände: Höhe 0 im Talboden, Hänge als glatte Buckel (für Höhenlinien und Schummerung)
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function westEdge(y){ return 106+Math.sin(y*0.09)*3+(y>60?(y-60)*0.05:0)-(y<30?(30-y)*0.3:0); }
function bump(x,y,cx,cy,rx,ry,hgt){ var d=((x-cx)*(x-cx))/(rx*rx)+((y-cy)*(y-cy))/(ry*ry); return d<1?hgt*Math.pow(1-d,1.4):0; }
var HF=null;
function height(x,y){ var h=0, n=(fbm(x,y,16,3)-0.5)*0.16;
  var dw=westEdge(y)-x; h=Math.max(h,(dw>0?1.25*(1-Math.exp(-dw/26)):0)+n*sm(dw/10));                                  // Westhang (Partisanenfriedhof), steigt nach Westen weiter an
  h=Math.max(h,bump(x,y,112,73,18,15,0.95)+n*0.5);                                                       // Hum
  var ee=190+Math.sin(y*0.07+1)*5-(y>92?(y-92)*0.55:0); h=Math.max(h,sm((x-ee)/40)*1.25+bump(x,y,238,44,40,44,0.9)+n*2);   // Velež
  if (y>110) h=Math.max(h,sm((x-(180+(150-y)*0.7))/30)*0.9+n);                                         // Hügel im Südosten
  if (y>94){ var ds=(100+(y-94)*0.28)-x; h=Math.max(h,(ds>0?1.0*(1-Math.exp(-ds/22)):0)+n); }                                       // Hügel im Südwesten
  return Math.max(0,h); }
function heights(){ if (HF) return HF; HF=new Float32Array(W*H); for (var y=0;y<H;y++) for (var x=0;x<W;x++) HF[y*W+x]=height(x,y); return HF; }
function hAt(x,y){ x=cl(x,0,W-1); y=cl(y,0,H-1); return heights()[y*W+x]; }
// Stadtfläche: 0..1
function town(x,y){ if (y>96) return 0; var rx=riverX(y); if (rx===null) return 0; var h=hAt(x,y); if (h>0.36) return 0; var s=y>74?1-(y-74)/22:1; return cl(s*(1.25-h*2.6),0,1); }

// ---------------------------------------------------------------- Papier, Gelände, Stadt
var PAPER={ now:{pal:[P.s4,P.s5,P.s5,P.s6], line:P.e3, line2:P.e2, shade:P.e4, town:P.s4, block:P.e4, edge:P.e3, river:[P.a2,P.a3,P.a4], field:P.g5, road:P.e2},
            old:{pal:[P.e4,P.s4,P.s4,P.s5], line:P.e3, line2:P.e2, shade:P.e3, town:P.e4, block:P.e3, edge:P.e2, river:[P.c2,P.c3,P.c4], field:P.e3, road:P.r2} };
function paper(b,k){ var C=PAPER[k], hf=heights(), x, y;
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=hash(Math.floor(x/3),Math.floor(y/2)), h2=hash(x,y), i=h<0.25?0:(h<0.9?1:2); if (h2>0.96) i=Math.min(3,i+1);
    var c=C.pal[i]; if (k==='old'){ var st=fbm(x,y,22,5); if (st>0.64 && bayer(x,y)<(st-0.64)*2.6) c=P.e3; var rr=Math.hypot(x-232,y-122); if (rr<15 && rr>12.8 && hash(x,y)<0.6) c=P.e3; }   // Flecken, ein Kaffeering
    // Schummerung: Licht von Nordwesten, abgewandte Hänge dunkler
    var g=(hf[y*W+Math.min(W-1,x+1)]-hf[y*W+Math.max(0,x-1)])+(hf[Math.min(H-1,y+1)*W+x]-hf[Math.max(0,y-1)*W+x]);
    if (g>0.03 && bayer(x,y)<Math.min(0.55,g*5)) c=C.shade;
    if (x===93||x===187||y===75) c=M.DN[c];                                                     // Faltlinien
    b.px(x,y,c); }
  // Höhenlinien, jede vierte kräftiger
  for (y=1;y<H-1;y++) for (x=1;x<W-1;x++){ var l0=Math.floor(hf[y*W+x]*9), l1=Math.floor(hf[y*W+x+1]*9), l2=Math.floor(hf[(y+1)*W+x]*9); if (l0<1) continue;
    if (l0!==l1||l0!==l2){ var lv=Math.max(l0,l1,l2); if (lv%4===0) b.px(x,y,C.line2); else if (hash(x,y)<0.85) b.px(x,y,C.line); } }
  // Felder im Tal: Streifenparzellen in verschiedenen Richtungen
  for (y=97;y<H-1;y++) for (x=104;x<192;x++){ if (hf[y*W+x]>0.05) continue; if (riverD(x,y)<3.2) continue; var px=Math.floor((x+y*0.3)/10), py=Math.floor(y/8), dir=hash(px,py)<0.5;
    var line=dir?((x+Math.floor(hash(px,py+3)*5))%5===0):((y+Math.floor(hash(px+5,py)*4))%4===0); if (line && hash(x>>1,y)<0.6) b.px(x,y,C.field); } }
// Häuserblöcke: unregelmäßiges Raster, in der Altstadt klein und dicht, im Westen größere Blöcke
var GX=null, GY=null;
function grid(){ if (GX) return; GX=new Int16Array(W); GY=new Int16Array(H); var x=0, i=0, r=M.rng(77);
  while (x<W){ var old=x>136&&x<164, w=old?3+Math.floor(r()*2):5+Math.floor(r()*4); for (var k=0;k<w&&x<W;k++,x++) GX[x]=(k===0?-1:1)*(i+1); i++; }
  var y=0; i=0; while (y<H){ var oldy=y>42&&y<66, h=oldy?3:4+Math.floor(r()*3); for (var k2=0;k2<h&&y<H;k2++,y++) GY[y]=(k2===0?-1:1)*(i+1); i++; } }
function city(b,k){ var C=PAPER[k], x, y; grid();
  for (y=1;y<98;y++) for (x=88;x<206;x++){ var tw=town(x,y); if (tw<0.06) continue; var rd=riverD(x,y); if (rd<2.8) continue;
    var cx=Math.abs(GX[x]), cy=Math.abs(GY[y]), street=GX[x]<0||GY[y]<0, old=Math.hypot(x-151,(y-55)*1.2)<11, c=b.get(x,y);
    if (street){ if (tw>0.3 && bayer(x,y)<0.8) c=k==='old'?P.s4:P.s6; b.px(x,y,c); continue; }
    if (hash(cx*1.7,cy*2.3)<tw*1.1 && rd>3.3){ var top=GY[y-1]<0, left=GX[x-1]<0;
      c=old?((top||left)?P.e2:P.e3):((top||left)?C.edge:C.block);
      if (!old && hash(cx*3.1,cy)<0.05) c=(top||left)?P.g4:P.g5; }                                   // ein Park
    else if (bayer(x,y)<0.3) c=C.town;
    b.px(x,y,c); } }
// Weiler im Tal (ohne Namen)
function hamlets(b,k){ [[160,101,3],[106,117,7],[127,114,5],[130,117,4],[163,128,6],[131,147,4],[176,138,5],[112,140,5]].forEach(function(v,i){ for (var j=0;j<v[2];j++){ var px=v[0]+rnd((hash(i,j)-0.5)*7), py=v[1]+rnd((hash(j,i+3)-0.5)*5); b.px(px,py,k==='old'?P.k2:P.e1); b.px(px+1,py,k==='old'?P.k2:P.e2); } }); }
// Straßen, Bahn, Flugplatz
function roads(b,k){ var C=PAPER[k], i, t;
  function path(pts,col,dash,w2){ var n=0; for (i=0;i<pts.length-1;i++){ var a=pts[i], c=pts[i+1], L=Math.max(1,Math.round(Math.hypot(c[0]-a[0],c[1]-a[1]))); for (var s=0;s<L;s++){ t=s/L; var x=rnd(a[0]+(c[0]-a[0])*t), y=rnd(a[1]+(c[1]-a[1])*t); n++; if (dash && (n%5)>2) continue; b.px(x,y,col); if (w2) b.px(x+1,y,w2); } } }
  var main=[[178,0],[174,30],[171,60],[171,90],[168,110],[160,128],[158,150]];                                   // Hauptstraße nach Süden (Ostufer)
  var west=[[128,0],[129,30],[130,60],[130,80],[122,96],[110,112],[104,150]];                                    // Bulevar und die Straße am Westufer
  var rail=[[186,0],[183,40],[179,80],[176,104],[172,124],[168,150]];                                            // Eisenbahn
  if (k==='old'){ path(main,P.r2,false,P.y3); path(west,P.r2,false,P.y3); path([[124,117],[134,121],[150,121],[164,118],[168,110]],P.y2,false); path([[118,123],[108,126],[100,128]],P.y2,false); }
  else { path(main,C.road,false,P.s6); path(west,C.road,false,P.s6); path([[125,117],[136,121],[150,121],[164,118],[168,110]],C.road,true); path([[117,123],[106,127]],C.road,true); path([[96,40],[110,46],[128,48]],C.road,true); }
  for (i=0;i<rail.length-1;i++){ var a=rail[i], c=rail[i+1], L=Math.round(Math.hypot(c[0]-a[0],c[1]-a[1])); for (var s=0;s<L;s++){ t=s/L; var x=rnd(a[0]+(c[0]-a[0])*t), y=rnd(a[1]+(c[1]-a[1])*t); b.px(x,y,P.k2); if (s%3===0){ b.px(x-1,y,P.k2); b.px(x+1,y,P.k2); } } }
  if (k!=='old'){ for (t=0;t<26;t++){ var px=rnd(181-t*0.3), py=rnd(98+t); b.px(px,py,P.s6); b.px(px+1,py,P.s6); b.px(px+2,py,P.m3); b.px(px-1,py,P.m3); if (t%4===0) b.px(px+1,py,P.m4); } } }
// Fluss: Band mit hellem Glanz; Brücken der Stadt; die Alte Brücke als kleiner Bogen
function river(b,k){ var C=PAPER[k], x, y;
  for (y=0;y<H;y++) for (x=90;x<204;x++){ var d=riverD(x,y), w=y<60?1.5:(y<100?1.8:2.1); if (d>w+0.7) continue; var c=d<w*0.45?C.river[1]:(d<w?C.river[0]:(bayer(x,y)<0.5?C.river[0]:T)); if (c===T) continue; if (d<0.6 && hash(x,y)<0.3) c=C.river[2]; b.px(x,y,c); }
  [18,30,40,62,86].forEach(function(ry){ var rx=riverX(ry); b.hl(rnd(rx)-3,rnd(rx)+3,ry,P.k2); b.hl(rnd(rx)-3,rnd(rx)+3,ry+1,P.s6); });
  var bx=rnd(riverX(52)); b.px(bx-3,53,P.k1); b.px(bx-2,52,P.k1); b.hl(bx-1,bx+1,51,P.k1); b.px(bx+2,52,P.k1); b.px(bx+3,53,P.k1); b.px(bx-1,52,P.s6); b.px(bx+1,52,P.s6);
  if (k==='old') M.microText(b,'NERETVA',156,104,P.c2); else M.microText(b,'NERETVA',150,104,P.a2); }

// ---------------------------------------------------------------- Landmarken: kleine Zeichen mit hellem Rand, gut unterscheidbar
var ICO={
  L_church:['..k..','..k..','.kkk.','.ksk.','.kkk.','.ksk.','.kkk.','.kkk.','kkkkk'],
  L_crane1:['.k.......','kkkkkkkk.','kk.k...m.','...k...m.','...k...k.','...k.....','...k.....','...k.....','..kkk....'],
  L_crane2:['.......k.','.kkkkkkkk','.m...k.kk','.m...k...','.k...k...','.....k...','.....k...','.....k...','....kkk..'],
  L_tower:['kkkkk','kmkmk','kkkkk','kmkmk','kkkkk','kmkmk','kkkkk','kmkmk','kkkkk','kkkkk'],
  L_hum:['....k....','...kmk...','..km.mk..','.km...mk.','km.....mk'],
  L_velez:['.....k.....','....kmk....','...km.mk...','..km...mk..','.km..k..mk.','km..kmk..mk'],
  L_bend:['...kkk','..kss.','.kss..','kss...','.kss..','..kss.','...kkk'],
  L_mill:['..k...kkk.','.kkk.kmkmk','kkkkkkmkmk','kssk.kkkkk','kkkk.kmkmk','kkkk..kkk.']
};
function icon(b,id){ var p=M.PEIL.landmarks[id], rows=ICO[id], h=rows.length, w=rows[0].length, t=new M.Buf(w+2,h+2,T), x, y;
  for (y=0;y<h;y++) for (x=0;x<w;x++){ var ch=rows[y][x]; if (ch==='.') continue; t.px(x+1,y+1,ch==='k'?P.k1:(ch==='m'?P.m2:P.s4)); }
  M.outline(t,P.s6); var ox=Math.round(p[0])-((w+2)>>1), oy=Math.round(p[1])-((h+2)>>1); b.blit(t,ox,oy);
  if (id==='L_hum') M.microText(b,'HUM',p[0]-5,p[1]+4,P.e1);
  if (id==='L_velez') M.microText(b,'VELEŽ',p[0]-8,p[1]+5,P.e1); }
function landmarks(b){ Object.keys(M.PEIL.landmarks).forEach(function(id){ icon(b,id); }); }

// ---------------------------------------------------------------- alte Karte: Dörfer mit unleserlichen Namen, Brücken und Fähren
function scrib(b,x,y,n,c){ for (var i=0;i<n;i++){ var h=hash(x+i,y); b.px(x+i,y+(h<0.3?0:1),c); if (h>0.6) b.px(x+i,y+2,c); if (h>0.85) b.px(x+i,y,c); } }
function village(b,x,y,sd){ for (var i=0;i<5;i++){ var px=x+rnd((hash(sd,i)-0.5)*6), py=y+rnd((hash(i,sd)-0.5)*4); b.px(px,py,P.k2); b.px(px+1,py,P.k2); } }
function oldDetails(b,st){ [[112,104,3],[160,100,4],[106,120,7],[166,126,8],[146,128,9],[184,140,11],[132,146,12],[100,138,13]].forEach(function(v){ village(b,v[0],v[1],v[2]); scrib(b,v[0]+4,v[1]-4,7+(v[2]%4),P.e1); });
  // Fähre nördlich (gestrichelte Linie über den Fluss mit einem Kahn) und eine Brücke im Süden, beide außerhalb der Biegung
  var fy=101, fx=rnd(riverX(fy)); for (var i=-5;i<=5;i++) if (i%2===0) b.px(fx+i,fy,P.k1); b.rect(fx-1,fy-1,3,2,P.w2);
  var by2=146, bx2=rnd(riverX(by2)); b.hl(bx2-4,bx2+4,by2-1,P.k1); b.hl(bx2-4,bx2+4,by2+1,P.k1); b.hl(bx2-3,bx2+3,by2,P.y3);
  if (st.skela){ var s=M.PEIL.skela, sx=rnd(riverX(s[1])), sy=s[1]; b.hl(sx-5,sx+5,sy-1,P.k1); b.hl(sx-5,sx+5,sy+1,P.k1); b.hl(sx-4,sx+4,sy,P.y3); b.px(sx-6,sy-2,P.k1); b.px(sx+6,sy-2,P.k1); b.px(sx-6,sy+2,P.k1); b.px(sx+6,sy+2,P.k1);
    village(b,sx+7,sy-3,21); }
  // Rand der Karte: Titelfeld, Maßstabsleiste
  b.rect(8,124,52,20,P.s4); b.hl(8,59,124,P.e1); b.hl(8,59,143,P.e1); b.vl(8,124,143,P.e1); b.vl(59,124,143,P.e1); M.microText(b,'AUTOKARTA',11,127,P.e0); M.microText(b,'1985',24,135,P.r2);
  }

// ---------------------------------------------------------------- Karte malen
M.paintPeilung=function(b,st){ st=st||{}; b=b||new M.Buf(W,H,P.s5); var k=st.old?'old':'now';
  paper(b,k); city(b,k); hamlets(b,k); roads(b,k); river(b,k);
  if (k==='old') oldDetails(b,st);
  else { landmarks(b);
    // Kompass
    var cx=262, cy=16; b.line(cx,cy-8,cx,cy+8,P.e1); b.line(cx-6,cy,cx+6,cy,P.e1); b.poly([[cx,cy-9],[cx+2,cy],[cx,cy+9],[cx-2,cy]],P.r2); b.poly([[cx,cy],[cx+2,cy],[cx,cy+9],[cx-2,cy]],P.e1); M.microText(b,'N',cx-1,cy-15,P.e0); }
  // Rand: feine Linie
  for (var x=0;x<W;x++){ b.px(x,0,P.e2); b.px(x,H-1,P.e2); } for (var y=0;y<H;y++){ b.px(0,y,P.e2); b.px(W-1,y,P.e2); }
  // Fächer und Bereich, falls mitgegeben (das Spiel zeichnet sie sonst selbst darüber)
  (st.fans||[]).forEach(function(f,i){ var a0=f.a0, a1=f.a1; if (Math.abs(a0)>7||Math.abs(a1)>7){ a0*=Math.PI/180; a1*=Math.PI/180; } fanA(b,f.from,a0,a1,f.col!==undefined?f.col:[P.r3,P.y4,P.x4][i%3]); });
  if (st.area) M.peilArea(b,st.area,P.r2);
  if (st.skela && k!=='old'){ var s=M.PEIL.skela; b.ellipse(s[0]+0.5,s[1]+0.5,3,3,function(xx,yy){ var d=Math.hypot(xx+0.5-s[0]-0.5,yy+0.5-s[1]-0.5); return d>2.1?P.k1:P.r3; }); }
  return b; };

// ---------------------------------------------------------------- Fächer und Bereich: halbtransparent über Bayer-Dither
function norm(a){ while (a>Math.PI) a-=Math.PI*2; while (a<=-Math.PI) a+=Math.PI*2; return a; }
function fanA(b,from,a0,a1,col){ var d=norm(a1-a0), lo=d>=0?a0:a1, span=Math.abs(d), ink=M.DN[col]===col?col:M.DN[col], fx=from[0], fy=from[1], x, y;
  if (ink===P.k0) ink=col;
  for (y=0;y<b.h;y++) for (x=0;x<b.w;x++){ var dx=x+0.5-fx, dy=y+0.5-fy; if (dx*dx+dy*dy<4) continue; var e=norm(Math.atan2(dy,dx)-lo); if (e<0||e>span) continue;
    if (bayer(x,y)<0.34) b.px(x,y,col); }
  // Ränder: zwei feine Strahlen bis zum Rand
  [lo,lo+span].forEach(function(a){ var c=Math.cos(a), s=Math.sin(a); for (var t=2;t<520;t+=0.5){ var px=Math.floor(fx+c*t), py=Math.floor(fy+s*t); if (px<0||py<0||px>=b.w||py>=b.h) break; b.px(px,py,ink); } });
  b.rect(Math.round(fx)-1,Math.round(fy)-1,3,3,ink); b.px(Math.round(fx),Math.round(fy),P.s6); }
M.peilFan=function(b,from,p1,p2,col){ col=col===undefined?P.r3:col; fanA(b,from,Math.atan2(p1[1]-from[1],p1[0]-from[0]),Math.atan2(p2[1]-from[1],p2[0]-from[0]),col); };
M.peilArea=function(b,poly,col){ if (!poly||poly.length<3) return; col=col===undefined?P.r2:col; var ys=poly.map(function(p){ return p[1]; }), y0=Math.max(0,Math.floor(Math.min.apply(null,ys))), y1=Math.min(b.h-1,Math.ceil(Math.max.apply(null,ys))), x, y;
  for (y=y0;y<=y1;y++){ var yc=y+0.5, xs=[]; for (var i=0,j=poly.length-1;i<poly.length;j=i++){ var a=poly[i], c=poly[j]; if ((a[1]>yc)!==(c[1]>yc)) xs.push(a[0]+(yc-a[1])*(c[0]-a[0])/(c[1]-a[1])); } xs.sort(function(p,q){ return p-q; });
    for (var k=0;k+1<xs.length;k+=2) for (x=Math.max(0,Math.ceil(xs[k]-0.5));x<=Math.min(b.w-1,Math.floor(xs[k+1]-0.5));x++) if (bayer(x,y)<0.6) b.px(x,y,col); }
  // Umriss
  for (var q=0;q<poly.length;q++){ var p0=poly[q], p1=poly[(q+1)%poly.length]; b.line(rnd(p0[0]),rnd(p0[1]),rnd(p1[0]),rnd(p1[1]),M.DN[col]); } };
})(M);
