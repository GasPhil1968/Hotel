/* ===== rooms/art/map2.js — Stadtplan von Sarajevo (Kapitel 2) =====
   Eine gezeichnete Karte auf Papier, auf ein Holzbrett geheftet wie der Plan von Split: das Tal von West (links) nach Ost
   (rechts), weit im Westen, eng im Osten bei der Altstadt. Die Miljacka als blaue Linie durch das Tal, die Linie 3 als
   gestrichelte rote Linie von Westen bis zur Schleife in der Baščaršija. Hügel als Schraffur im Norden und Süden (Žuč, Hum,
   Igman, Trebević), Häuserblöcke im Talboden, Kartusche „SARAJEVO 2011“, Kompass. Je Ort ein kleines Symbol, kräftig mit
   Namen, wenn der Ort bekannt ist (GS.map[id]), sonst blass und ohne Namen.
   Exporte: M.paintMap2(S,GS) -> M.Buf(320,144); M.MAP2_POS = { id:[x,y] } (Mittelpunkt des Symbols). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var X0=8, Y0=6, X1=312, Y1=138;

M.MAP2_POS={ neboder:[52,84], stanica:[116,63], ferhadija:[205,70], obala:[284,99], carsija:[248,82], pansion:[268,50], vratnik:[293,28] };
var NAMES={ neboder:'Alipašino Polje', stanica:'Busbahnhof', ferhadija:'Ferhadija', obala:'Miljacka', carsija:'Baščaršija', pansion:'Kovači – Pension', vratnik:'Vratnik' };
var ORDER=['neboder','stanica','ferhadija','obala','carsija','pansion','vratnik'];

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
// Talränder: Norden (oben) und Süden (unten); zwischen ihnen liegt der Talboden
function northY(x){ var t=(x-X0)/(X1-X0); return 44+t*22+Math.sin(x*0.045)*3+Math.sin(x*0.13+1)*1.2; }
function southY(x){ var t=(x-X0)/(X1-X0); return 128-t*30+Math.sin(x*0.05+2)*3+Math.sin(x*0.17)*1.2-(x>196&&x<262?Math.sin((x-196)/66*Math.PI)*6:0); }
function riverY(x){ return 116-(x-X0)*0.07+Math.sin(x*0.06)*2.2-(x>150&&x<240?Math.sin((x-150)/90*Math.PI)*7:0)+(x>262?(x-262)*0.06:0); }
// Linie 3: Punkte von Westen nach Osten, am Ende die Schleife um die Baščaršija
var TRAM=[[X0+1,103],[30,99],[52,93],[84,88],[116,83],[150,80],[180,79],[206,80],[226,82],[238,86],[246,90],[257,90],[262,85],[258,79],[248,77],[238,80],[236,84],[238,86]];
function hill(x,y){ return y<northY(x)?1:(y>southY(x)?2:0); }
function paperC(x,y){ var h=hash(Math.floor(x/3),Math.floor(y/2)), h2=hash(x,y), i=h<0.3?0:(h<0.85?1:2); if (h2>0.93) i=Math.min(3,i+1); if (h2<0.05) i=Math.max(0,i-1); return [P.s4,P.s5,P.s5,P.s6][i]; }
function town(x,y){ // bebaute Fläche: dicht in der Mitte und im Osten, im Westen die Hochhausblöcke
  if (hill(x,y)) return 0; var n=northY(x), s=southY(x), mid=(n+s)/2, w=(s-n)/2, d=Math.abs(y-mid)/w; return x<26?0:cl(1.15-d*(x<140?1.1:0.7),0,1); }

M.paintMap2=function(S,GS){ var b=new M.Buf(320,144,P.k0), x, y, i;
  GS=GS||M.GS; var known=function(id){ return !!(GS&&GS.map&&GS.map[id]); };
  for (y=0;y<144;y++) for (x=0;x<320;x++) b.px(x,y,M.tex.boards(x,y,R('w0 w1 w2 w3'),7));
  // Papier: Talboden hell, Hänge leicht grünlich-braun getönt
  for (y=Y0;y<Y1;y++) for (x=X0;x<X1;x++){ var c=paperC(x,y), hl=hill(x,y);
    if (hl){ var e=hl===1?(northY(x)-y):(y-southY(x)); c=(hash(x>>1,y>>1)<0.5)?P.e4:(e>10&&hash(x,y)<0.4?P.g5:P.s4); }
    else { var tw=town(x,y); if (tw>0.1 && bayer(x,y)<tw*0.35) c=P.e4; }
    var u=x-X0, v=y-Y0; if (u===Math.floor((X1-X0)/3)||u===Math.floor((X1-X0)*2/3)||v===Math.floor((Y1-Y0)/2)) c=M.DN[c];   // Faltlinien
    b.px(x,y,c); }
  // Schraffur der Hänge: kurze Striche in Fallrichtung, versetzt, zu den Gipfeln hin dichter und dunkler
  function peak(x,h){ var P1=h===1?[[62,1],[200,1.15],[296,0.8]]:[[40,0.9],[232,1.3]], v=0.35; for (var q=0;q<P1.length;q++){ var d=(x-P1[q][0])/46; v=Math.max(v,P1[q][1]*Math.exp(-d*d)); } return v; }
  for (y=Y0+1;y<Y1-1;y+=2) for (x=X0+1+((y>>1)%2);x<X1-1;x+=3){ var h=hill(x,y); if (!h) continue; var e2=h===1?(northY(x)-y):(y-southY(x)); if (e2<1.5) continue;
    var pk=peak(x,h), dens=cl(0.12+pk*0.5*cl(e2/18,0,1.2),0,0.9); if (hash(x*1.3,y*0.7)>dens) continue; var dir=h===1?-1:1, col=(pk*e2>14)?P.e1:(pk*e2>7?P.e2:P.e3);
    b.px(x,y,col); if (pk*e2>5) b.px(x,y+dir,col); }
  // Kammlinien (punktiert) und der Fuß der Hänge
  for (x=X0+1;x<X1-1;x++){ var ny=rnd(northY(x)), sy=rnd(southY(x)); if (x%3) { b.px(x,ny,P.e3); b.px(x,sy,P.e3); } }
  // Häuserblöcke im Talboden: unregelmäßig, im Westen große Hochhausblöcke, in der Altstadt kleine
  for (y=Y0+2;y<Y1-2;y++) for (x=X0+2;x<X1-2;x++){ var tw2=town(x,y); if (tw2<0.2) continue; var old=x>222, gx=x<140?8:(old?4:5), gy=x<140?6:(old?3:4), cx2=Math.floor(x/gx), cy2=Math.floor((y+(cx2%2))/gy), bx=x-cx2*gx, by=(y+(cx2%2))-cy2*gy;
    if (bx===0||by===0) continue; if (hash(cx2*1.7,cy2*2.3)>tw2*0.95) continue; if (x<140 && (bx>4||by>2)) continue; b.px(x,y,(bx===1||by===1)?P.e3:P.e4); }
  // Parks: Veliki park und Grbavica
  [[188,88,7,3],[150,94,6,3],[100,78,6,3]].forEach(function(p){ for (y=p[1]-p[3];y<=p[1]+p[3];y++) for (x=p[0]-p[2];x<=p[0]+p[2];x++){ var dx=(x-p[0])/p[2], dy=(y-p[1])/p[3]; if (dx*dx+dy*dy>1) continue; b.px(x,y,hash(x,y)<0.5?P.g4:P.g5); } });
  // Hauptstraßen
  for (x=X0+2;x<X1-6;x++){ var my=rnd(lerp(98,79,(x-X0)/240)+(x>220?(x-220)*0.15:0)); if (x<250 && (x%3)) b.px(x,my+2,P.e3); }
  // Miljacka: doppelte blaue Linie, Brücken
  for (x=X0+1;x<X1-1;x++){ var ry=riverY(x), ry0=rnd(ry); b.px(x,ry0,P.a3); b.px(x,ry0+1,P.a2); if (hash(x,3)<0.4) b.px(x,ry0-1,P.a4); }
  [[283,0],[262,0],[236,0],[206,0],[176,0],[128,0],[78,0]].forEach(function(br){ var ry2=rnd(riverY(br[0])); b.vl(br[0],ry2-2,ry2+2,P.k2); b.vl(br[0]+1,ry2-2,ry2+2,P.s5); });
  M.microText(b,'MILJACKA',112,rnd(riverY(124))+3,P.a2);
  // Linie 3: rot gestrichelt, Haltestellen als kleine Punkte
  var dash=0; for (i=0;i<TRAM.length-1;i++){ var a=TRAM[i], c2=TRAM[i+1], L=Math.max(1,Math.round(Math.hypot(c2[0]-a[0],c2[1]-a[1]))); for (var s=0;s<L;s++){ var t=s/L, px=rnd(lerp(a[0],c2[0],t)), py=rnd(lerp(a[1],c2[1],t)); dash++; if ((dash%6)<4){ b.px(px,py,P.r2); b.px(px,py+1,P.r1); } } }
  [[30,99],[84,88],[150,80],[206,80],[246,90]].forEach(function(st){ b.rect(st[0]-1,st[1]-1,3,3,P.r3); b.px(st[0],st[1],P.s6); });
  b.rect(10,96,9,5,P.r2); M.microText(b,'3',13,96,P.s6);                                           // Liniennummer am Rand
  // Namen der Berge
  [['ŽUČ',62,22,P.g2],['HUM',196,30,P.g2],['IGMAN',76,127,P.g2],['TREBEVIĆ',222,124,P.g2]].forEach(function(m){ M.microText(b,m[0],m[1]+1,m[2]+1,P.s5); M.microText(b,m[0],m[1],m[2],m[3]); });
  // Kartusche und Kompass
  b.rect(14,110,46,22,P.s5); b.hl(14,59,110,P.e1); b.hl(14,59,131,P.e1); b.vl(14,110,131,P.e1); b.vl(59,110,131,P.e1); b.hl(16,57,112,P.e3); b.hl(16,57,129,P.e3);
  M.microText(b,'SARAJEVO',22,115,P.e0); M.microText(b,'2011',30,122,P.r2);
  var cx=30, cy=28; b.line(cx,cy-9,cx,cy+9,P.e1); b.line(cx-9,cy,cx+9,cy,P.e1); b.poly([[cx,cy-10],[cx+2,cy],[cx,cy+10],[cx-2,cy]],P.r2); b.poly([[cx,cy],[cx+2,cy],[cx,cy+10],[cx-2,cy]],P.e1); M.text(b,'N',cx-2,cy-19,P.e1);
  // Symbole und Namen
  ORDER.forEach(function(id){ var v=M.mapIconVis?M.mapIconVis(id,GS):known(id); if (v!==null) drawIcon2(b,id,v); });   // unbekannte Orte erscheinen nicht
  M.light(b,M.lf.sum(M.lf.pool(176,72,210,110,1.1),M.lf.vignette(320,144,2.2),M.lf.k(-0.3)));
  return b; };

// Symbole (Mittelpunkt x,y): Hochhaus, Bus, Kathedrale, Brücke, Sebilj, Haus, Bastei
function drawIcon2(b,id,on){ var p=M.MAP2_POS[id], x=p[0], y=p[1], c=on?P.k1:P.e3, f=on?P.r2:P.e4, lt=on?P.y4:c, i;
  switch(id){
    case 'neboder': b.rect(x-3,y-6,7,12,on?P.m3:f); b.vl(x-3,y-6,y+5,c); b.vl(x+3,y-6,y+5,c); b.hl(x-3,x+3,y-6,c); b.hl(x-4,x+4,y+5,c);
      for (i=0;i<4;i++){ b.px(x-1,y-4+i*2,on?(i%2?P.y4:P.k2):c); b.px(x+1,y-4+i*2,on?(i%2?P.k2:P.y4):c); } b.rect(x+5,y-2,4,7,on?P.m2:f); b.vl(x+8,y-2,y+5,c); b.hl(x+5,x+8,y-2,c); break;
    case 'stanica': b.rect(x-7,y-3,14,6,on?P.b2:f); b.hl(x-7,x+6,y-3,c); b.vl(x-7,y-3,y+2,c); b.vl(x+6,y-3,y+2,c); b.hl(x-7,x+6,y+2,c);
      for (i=0;i<4;i++) b.rect(x-5+i*3,y-2,2,2,on?P.s6:c); b.rect(x-5,y+2,2,2,c); b.rect(x+3,y+2,2,2,c); b.rect(x-9,y+4,18,1,on?P.e2:c); break;
    case 'ferhadija': b.rect(x-3,y-2,7,7,f); b.hl(x-3,x+3,y-2,c); b.poly([[x-3,y-2],[x,y-5],[x+3,y-2]],c); b.hl(x-6,x+6,y+5,c);
      [x-6,x+4].forEach(function(tx){ b.rect(tx,y-4,3,9,on?P.s5:f); b.vl(tx,y-4,y+4,c); b.vl(tx+2,y-4,y+4,c); b.poly([[tx-0.5,y-4],[tx+1.5,y-10],[tx+3.5,y-4]],c); b.px(tx+1,y-1,lt); });
      b.ellipse(x+0.5,y+0.5,1.6,1.6,on?P.y3:c); b.rect(x-1,y+3,3,2,c); break;
    case 'obala': for (i=-8;i<=8;i++){ var top=y-3, ar=Math.abs(((i+8)%6)-3); b.px(x+i,top,c); b.px(x+i,top+1,on?P.s5:f); if (ar>0) for (var q=top+2;q<=y+1-(ar===3?2:(ar===2?1:0));q++) b.px(x+i,q,on?P.s4:f); }
      for (i=-8;i<=8;i+=6) b.vl(x+i,y-3,y+2,c); b.hl(x-9,x+9,y-4,c); b.px(x-1,y-6,c); b.vl(x,y-7,y-4,c); b.px(x+1,y-6,c); break;
    case 'carsija': b.rect(x-4,y-1,9,6,on?P.w3:f); for (i=-4;i<=4;i+=2) b.vl(x+i,y-1,y+4,c); b.hl(x-5,x+5,y-2,c); b.hl(x-5,x+5,y+5,c);
      b.ellipse(x+0.5,y-3,4,3,on?P.g3:f); b.hl(x-4,x+4,y-2,c); b.vl(x,y-8,y-6,c); b.px(x,y-9,on?P.y3:c); break;
    case 'pansion': b.rect(x-4,y-2,9,7,f); b.poly([[x-5,y-2],[x,y-7],[x+5,y-2]],c); b.px(x,y+1,lt); b.hl(x-5,x+5,y+5,c); b.vl(x+3,y-7,y-4,c); break;
    case 'vratnik': for (var yy=y-3;yy<=y+5;yy++) for (var xx=x-7;xx<=x+7;xx++){ var dx=(xx+0.5-x)/7.5; if (yy>y+5-Math.sqrt(Math.max(0,1-dx*dx))*3) continue; b.px(xx,yy,(xx===x-7||xx===x+7||yy===y-3)?c:(on?(((xx+yy)%4===0)?P.e3:P.y2):f)); }
      for (i=-7;i<=6;i+=3) b.rect(x+i,y-5,2,2,c); b.hl(x-7,x+7,y-3,c); for (var q2=-6;q2<=6;q2++) b.px(x+q2,rnd(y+5-Math.sqrt(Math.max(0,1-q2*q2/56))*3)+1,c); b.vl(x+3,y-10,y-6,c); b.rect(x+4,y-10,3,2,on?P.r3:c); break; }
  if (on && !M.mapNoNames){ var nm=NAMES[id], w=M.textWidth(nm); M.text(b,nm,Math.max(10,Math.min(306-w,x-(w>>1))),y+8,P.k1,P.s5); } }
})(M);
