/* ===== rooms/art/riva.js — Die Riva und die Mole (640 px, scrollend) =====
   Links die Promenade mit poliertem Kalksteinpflaster vor der Südfront des Diokletianpalastes (Galerie mit Halbsäulen,
   Loggia, Bronzenes Tor, Läden), darüber der Glockenturm von Sveti Duje, davor Palmen, Bänke, Laternen, Kiosk und ein
   Café im Winterschlaf; bei x≈248–336 das Hafenbüro (Lučka kapetanija). Rechts die Mole ins Hafenbecken mit Pollern,
   Bank und Laterne am Ende, dahinter das Becken mit Jacht und Fischerboot, Fähren am Terminal und Brač.
   Wasser, Spiegelungen, Möwen, Flagge, Gischt und die einlaufende Fähre (S.ferryAt) laufen in dynamic. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=640, H=144;
// ---------------------------------------------------------------- Geometrie
var HZ=76;                 // Horizont (rechts, offenes Meer)
var PAL1=246;              // Palastfront x 0..246
var OF0=248, OF1=336;      // Hafenbüro
var PB=100;                // hintere Pflasterkante an den Gebäuden
var QY=136;                // vordere Kaikante (Oberkante)
var FW=140;                // Wasser vorn ab y
var MX0=402, MX1=634;      // Mole
var MB=104, MF=126, MW=132;// Mole: hintere Kante, vordere Kante, Wasserlinie der Stirnseite
var TWX=157;               // Glockenturm (Mitte)
var PALMS=[{x:30,h:62,s:3},{x:106,h:66,s:11},{x:208,h:61,s:5},{x:372,h:64,s:17}];
var LAMPS=[68,132,238,322,397];
var LH=44, LB=105;         // Laternenhöhe, Fußpunkt
var BENCH=[146,174];       // die Bank für das Nachtgespräch (x0,x1)
var BENCH2=[218,242];
var MBENCH=[498,528];      // Bank auf der Mole
var MLAMP=628, MLB=116, MLH=50;   // Laterne am Molenende
var IBOL=610;              // Ivkas Poller (hintere Kante)
var FERRY_END=482;         // dort kommt die einlaufende Fähre zum Stehen (Bug); hinter Ivka liegt dann nur das flache Heck
var MOONX=593;             // Mond über Ivkas Platz: ihr Umriss steht im Mondpfad
var FLAG=[350,26];         // Fahnenspitze am Hafenbüro
var PUD=[[88,127,9,2],[176,131,13,2.5],[268,121,8,1.8],[352,129,11,2],[448,118,9,2],[541,121,11,2],[586,111,6,1.5]];   // Pfützen bei Regen
var RING=476;              // Rettungsring an der Mole
// ---------------------------------------------------------------- Masken (vom letzten paint)
// FAR: 0 = Vordergrund (wird umgefärbt), 1 = Himmel, 2 = Berge/Inseln, 3 = Becken, 4 = Wasser vorn
var FAR=new Uint8Array(W*H), WM=new Uint16Array(W*H), OBJ=new Uint8Array(W*H), WIN=[], FWIN=[], LIT={tod:'day',wea:'calm'};
function track(b){ b.code=0; b.wcode=0; b.ocode=0;
  b.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; this.d[k]=c; FAR[k]=this.code; WM[k]=this.wcode; OBJ[k]=this.ocode; };
  b.rect=function(x,y,w,h,c){ for (var j=Math.max(0,y|0);j<Math.min(H,(y|0)+h);j++) for (var i=Math.max(0,x|0);i<Math.min(W,(x|0)+w);i++){ var k=j*W+i; this.d[k]=c; FAR[k]=this.code; WM[k]=this.wcode; OBJ[k]=this.ocode; } };
  return b; }
function glass(b,x,y,w,h,kind,s,fn){ WIN.push({x:x,y:y,w:w,h:h,k:kind,s:s}); b.wcode=WIN.length; for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,fn(xx,yy)); b.wcode=0; }
// ---------------------------------------------------------------- kleine Helfer
function R(s){ return M.R(s); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57;
  var a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03,y*2.03,s+3)*0.3+vn(x*4.1,y*4.1,s+7)*0.15; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

// ---------------------------------------------------------------- Himmel
function glowX(x){ return Math.exp(-Math.pow((x-560)/150,2)); }   // hellster Teil des Abendhimmels über dem Meer
function paintSky(b,tod,wea){ var rain=wea==='rain', r, x, y, v;
  if (rain && tod!=='night'){ r=R(tod==='day'?'m2 m3 s3 m4 s4':'k2 d0 m0 d1 m1 m2 d2 d3');
    for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var n=fbm(x/52,y/8,4), n2=fbm(x/19,y/4.5,9); v=0.12+Math.pow(y/HZ,1.2)*0.62+(n-0.5)*0.5+(n2-0.5)*0.16+glowX(x)*0.08*(y/HZ); b.px(x,y,ra(r,v,x,y)); }
    return; }
  if (tod==='dusk'){ r=R('d0 d1 d2 d3 d4 d5 d6');
    for (y=0;y<HZ;y++){ var t=y/(HZ-1); for (x=0;x<W;x++){ v=Math.pow(t,1.25)*0.86+glowX(x)*0.16*t*t+(1-glowX(x))*-0.04*t; b.px(x,y,ra(r,v,x,y)); } }
    // Wolkenbänke: dunkle Körper, von unten angeleuchtet
    var C=R('d1 d2 d3 d4 d5 d6');
    for (y=6;y<HZ-6;y++) for (x=0;x<W;x++){ var cy=fbm(x/90,y/5.5,2), m=cy-0.58+Math.sin(x*0.004+y*0.3)*0.02; if (m<=0) continue; var below=fbm(x/90,(y+2)/5.5,2)-0.58;
      var lv=0.08+y/HZ*0.5+glowX(x)*0.1; if (below<=0) lv+=0.38+glowX(x)*0.15; else if (fbm(x/90,(y-2)/5.5,2)-0.58<=0) lv+=0.12;
      b.px(x,y,ra(C,lv,x,y)); }
    return; }
  var G={ day:'b1 b2 b3 b4 b5', night:'k1 k2 n0 n1 n2', dawn:'n1 n2 d2 d3 d4 d5' }[tod]||'b1 b2 b3 b4 b5';
  r=R(rain?'k1 k2 m0 n0 m1':G);
  for (y=0;y<HZ;y++){ var t2=y/(HZ-1); v=tod==='day'?0.06+t2*0.94:Math.pow(t2,1.8); for (x=0;x<W;x++) b.px(x,y,ra(r,v,x,y)); }
  if (tod==='day'){ var D=R('b3 b4 b5 s6');   // Bura: klar, ein paar Fetzen über den Bergen
    for (y=4;y<44;y++) for (x=0;x<W;x++){ var q=fbm(x/34,y/5,6)-0.66-(x>360?0.1:0); if (q<=0) continue; if (q<0.03&&bayer(x,y)>q/0.03) continue; b.px(x,y,ra(D,0.35+q*5,x,y)); } }
  if (tod==='night'||tod==='dawn'){ var rr=M.rng(91);
    for (var i=0;i<380;i++){ var sx=Math.floor(rr()*W), sy=Math.floor(Math.pow(rr(),1.4)*(HZ-10)), q2=rr(); if (q2<0.06) b.px(sx,sy,P.n5); else if (q2<0.35) b.px(sx,sy,P.n4); else b.px(sx,sy,P.n3); if (q2<0.015){ b.px(sx-1,sy,P.n3); b.px(sx+1,sy,P.n3); b.px(sx,sy-1,P.n3); b.px(sx,sy+1,P.n3); } }
    if (tod==='night' && !rain){ var mx=MOONX, my=19;
      b.ellipse(mx+0.5,my+0.5,9,9,function(x,y){ return bayer(x,y)<0.3?P.n2:undefined; });
      b.ellipse(mx+0.5,my+0.5,5.2,5.2,function(x,y){ var dx=x+0.5-mx, dy=y+0.5-my; if (dx*0.7+dy*0.7>2.2) return P.n4; return (dx*dx+dy*dy<6&&dx<1)?P.l1:P.n5; });
      b.px(mx-2,my+1,P.n4); b.px(mx+1,my-2,P.n4); b.px(mx,my+2,P.n4); } } }

// ---------------------------------------------------------------- Ferne: Berge hinter der Stadt, Inseln
function farCols(tod,wea,near){ var rain=wea==='rain';
  if (rain) return tod==='night'?R('k1 k2 m0'):R(near?'d0 d1 m1':'d1 m1 d2');
  if (near) return { day:R('b1 b2 b3'), dusk:R('d0 d1 d2'), night:R('k1 k2 n0'), dawn:R('n0 n1 n2') }[tod]||R('b1 b2 b3');
  return { day:R('b2 b3 b4'), dusk:R('d1 d2 d3'), night:R('k2 n0 n1'), dawn:R('n1 n2 d2') }[tod]||R('b2 b3 b4'); }
function paintMountains(b,tod,wea){ var c=farCols(tod,wea,false);
  for (var x=0;x<398;x++){ var hi=37+Math.sin(x*0.011+1.3)*5+Math.sin(x*0.034+0.4)*2.6+Math.sin(x*0.093)*1.1, lo=67+Math.sin(x*0.07)*1.5+Math.sin(x*0.19)*0.8+(x>380?(x-380)*0.5:0), m=clamp((x-300)/40,0,1), ridge=hi+(lo-hi)*m*m*(3-2*m);
    for (var y=Math.round(ridge);y<HZ;y++){ var v=0.7-(y-ridge)/22+(fbm(x/9,y/5,12)-0.5)*0.3; if (y===Math.round(ridge)) v=0.95; b.px(x,y,ra(c,v,x,y)); } } }
function brac(x){ if (x<392||x>606) return 0; var t=(x-392)/214; return Math.max(0,Math.round(Math.sin(Math.min(1,t*4)*Math.PI*0.5)*6.5+Math.sin(x*0.045+1)*1.4+Math.sin(x*0.15)*0.5+Math.max(0,1.6-Math.abs(x-470)/14)*1.4-(t>0.86?(t-0.86)*44:0))); }
function solta(x){ if (x<614) return 0; return Math.max(0,Math.round(Math.sin(Math.min(1,(x-614)/20)*Math.PI*0.5)*3.6+Math.sin(x*0.2)*0.4)); }
function paintIslands(b,tod,wea){ var c=farCols(tod,wea,true);
  for (var x=386;x<W;x++){ var h=Math.max(brac(x),solta(x)); for (var y=HZ-h;y<HZ;y++){ var v=0.5-(y-(HZ-h))*0.07; if (y===HZ-h) v=0.95; b.px(x,y,ra(c,v,x,y)); } } }

// ---------------------------------------------------------------- Wasser (gleiche Formel für paint und dynamic)
var WR={ day:'a1 b0 a2 a3 a4 a5 a6', dusk:'k2 d0 d1 d2 d3 d4 d5 d6', night:'k0 k1 a0 n0 a1 n1 n2 n3', dawn:'n0 n1 a2 n2 d3 a4 d4', rain:'k2 d0 m0 d1 m1 m2 d2 m3', rainD:'k2 m0 a1 m1 a2 m2 a3 m3', rainN:'k0 k1 m0 n0 m1 n1' };
var WRC={}; function wramp(tod,wea){ var k=wea==='rain'?(tod==='night'?'rainN':(tod==='day'?'rainD':'rain')):tod; return WRC[k]||(WRC[k]=R(WR[k]||WR.day)); }
function wdepth(kind,y){ return kind===3?clamp((y-HZ)/(MB-HZ),0,1):1; }
function wbase(kind,y,tod,wea,x){ var d=wdepth(kind,y), n=0;
  if (kind===4){ var e=(y-MW)/(H-MW); if (tod==='dusk') return 0.3-e*0.12; if (tod==='night') return 0.32-e*0.12; return 0.4-e*0.12; }
  if (tod==='dusk') n=0.92-Math.pow(d,0.7)*0.58+glowX(x)*0.06*(1-d);
  else if (tod==='night') n=0.62-d*0.34;
  else if (wea==='rain') n=0.78-d*0.4;
  else n=0.8-Math.pow(d,0.8)*0.5;
  if (y<HZ+4 && (brac(x)||solta(x))) n-=0.09*(HZ+4-y)/4;   // Spiegelung der Inseln
  return n; }
var WS2=0;
function wsig(wx,y,t,kind,bura){ var d=wdepth(kind,y), per=5+d*24+(kind===4?14:0), dir=(hash(y,kind*3)<0.5)?1:-1, spd=(bura?10:4)*(0.35+d)*dir, ph=hash(y,kind+7)*40;
  WS2=Math.sin((wx-t*spd*0.5+ph*3)/(per*2.7)*6.2832); return Math.sin((wx+t*spd+ph)/per*6.2832); }
function wcol(wx,y,t,kind,tod,wea,rmp){ var bura=wea==='bura', ph=hash(y,kind+7)*40;
  var s=wsig(wx,y,t,kind,bura), s2=WS2;
  var n=rmp.length-1, v=wbase(kind,y,tod,wea,wx)*n, i=Math.floor(v), f=v-i;
  if (f>bayer(Math.floor((wx+ph*7)/3),y)) i++;
  if (s>0.68-s2*0.22) i+=1; else if (s<-0.74+s2*0.12) i-=1;
  var c=rmp[i<0?0:(i>n?n:i)];
  if (bura && s>0.93 && s2>0.35 && (y&1)===0) c=(tod==='night'?P.n4:(tod==='dusk'?P.d6:P.s6));
  return c; }
function paintWater(b,tod,wea){ var rmp=wramp(tod,wea), x, y;
  b.code=3; for (y=HZ;y<=MB;y++) for (x=338;x<W;x++) b.px(x,y,wcol(x,y,0,3,tod,wea,rmp));
  for (y=MB+1;y<H;y++) for (x=MX1;x<W;x++) b.px(x,y,wcol(x,y,0,3,tod,wea,rmp));
  b.code=4; for (y=MW;y<H;y++) for (x=MX0;x<MX1;x++) b.px(x,y,wcol(x,y,0,4,tod,wea,rmp));
  for (y=FW;y<H;y++) for (x=0;x<MX0;x++) b.px(x,y,wcol(x,y,0,4,tod,wea,rmp));
  b.code=0; }

// ---------------------------------------------------------------- Rundbögen (Turm, Galerie, Läden, Tor)
// Einzug einer Rundbogenöffnung der Breite w in Zeile k unter dem Scheitel; archTop = erste Zeile einer Spalte mit Randabstand e
function archIn(w,k){ var r=w/2; if (w<3) return 0; if (w===3) return k===0?1:0; if (k>=Math.floor(r)) return 0; return Math.max(0,Math.round(r-Math.sqrt(Math.max(0,r*r-(r-k-0.5)*(r-k-0.5))))); }
function archTop(w,e){ if (e<0) return archTop(w,0)+1; var k=0; while (k<w && archIn(w,k)>e) k++; return k; }
// Öffnung ox..ox+w-1 vom Scheitel y0 bis y1. fill(x,y,k): k = Zeilen unter dem Bogen. ring(x,y,links): Bogensteine um die Öffnung
function arch(b,ox,y0,w,y1,fill,ring){ var xx, yy;
  for (xx=ox;xx<ox+w;xx++){ var e=Math.min(xx-ox,ox+w-1-xx), top=y0+archTop(w,e); for (yy=top;yy<=y1;yy++){ var c=fill(xx,yy,yy-top); if (c!==undefined) b.px(xx,yy,c); } }
  if (!ring) return;
  for (xx=ox-1;xx<=ox+w;xx++){ var e2=Math.min(xx-ox,ox+w-1-xx), r0=y0+archTop(w,e2)-1, r1=Math.max(r0,y0+archTop(w,e2-1)-2); for (yy=r0;yy<=r1;yy++){ var c2=ring(xx,yy,xx+0.5<ox+w/2); if (c2!==undefined) b.px(xx,yy,c2); } } }
var VOUS=function(x,y,l){ return l?P.s6:P.s4; };
function inArch(ox,y0,w,x,y){ return x>=ox && x<ox+w && y>=y0+archTop(w,Math.min(x-ox,ox+w-1-x)); }
function hole(rx,lx){ return function(x,y,k){ if (k===0) return P.k1; if (x===rx) return P.s1; if (x===lx) return P.k1; return P.k2; }; }

// ---------------------------------------------------------------- Glockenturm von Sveti Duje
// romanisch, von Geschoss zu Geschoss schmaler und offener: unten Einzelfenster, dann Bifora, Trifora mit den Glocken,
// obenauf das Achteck mit Rundbögen und die steinerne Pyramide mit Kugel und Kreuz. Licht von links oben.
function tower(b,tod){ var cx=TWX, S6=R('s1 s2 s3 s4 s5 s6'), x, y;
  function wallc(x,y,x0,x1){ var u=(x+0.5-x0)/(x1-x0+1), v=0.9-u*0.5+(hash(Math.floor(x/3)+Math.floor(y/3)*7,3)-0.5)*0.1; if (y%3===0 && hash(Math.floor((x+y*2)/4),y)<0.5) v-=0.12; return ra(S6,v,x,y); }
  function storey(y0,y1,hw){ var x0=cx-hw, x1=cx+hw, yy, xx; for (yy=y0;yy<=y1;yy++){ for (xx=x0;xx<=x1;xx++) b.px(xx,yy,wallc(xx,yy,x0,x1)); b.px(x0,yy,P.s6); b.px(x1,yy,P.s1); b.px(x1-1,yy,P.s2); } }
  // Gesims mit kleinem Bogenfries (Zahnreihe aus Schatten)
  function band(y,hw){ b.hl(cx-hw,cx+hw,y,P.s6); b.hl(cx-hw,cx+hw,y+1,P.s3); for (var xx=cx-hw+1;xx<cx+hw;xx+=2) b.px(xx,y+1,P.s1); b.px(cx+hw,y,P.s3); b.px(cx+hw,y+1,P.s1); }
  // Kreuz und Kugel
  b.vl(cx,0,3,P.m1); b.hl(cx-1,cx+1,1,P.m1); b.px(cx,4,P.y2);
  // Pyramide über dem Achteck: drei Flächen sichtbar, die linke im Licht
  for (y=5;y<=14;y++){ var hw=Math.round((y-5)*0.56); for (x=cx-hw;x<=cx+hw;x++){ var u=(x-cx)/(hw+0.5), c;
      if (u<-0.34) c=(x===cx-hw)?P.s6:(bayer(x,y)<0.3?P.s4:P.s5); else if (u<=0.34) c=bayer(x,y)<0.55?P.s3:P.s4; else c=bayer(x,y)<0.45?P.s1:P.s2;
      b.px(x,y,c); } }
  b.hl(cx-6,cx+6,15,P.s6); b.px(cx+6,15,P.s3); b.px(cx+5,15,P.s4);
  // Achteck: drei Seiten, jede mit Rundbogen
  for (y=16;y<=21;y++) for (x=cx-5;x<=cx+5;x++){ var d=x-cx, c2=d<-2?P.s5:(d<=2?P.s4:P.s2); if (d===-3) c2=P.s6; if (d===3) c2=P.s3; if (y===16) c2=(d<3)?P.s2:P.s1; b.px(x,y,c2); }
  arch(b,cx-1,17,3,21,hole(cx+1,-1),null); b.vl(cx-4,18,21,P.k2); b.vl(cx+4,18,21,P.k1); b.px(cx-4,17,P.s6);
  // Terrasse über der Glockenstube mit Eckaufsätzen
  b.hl(cx-8,cx+8,22,P.s6); b.hl(cx-8,cx+8,23,P.s3); b.px(cx+8,22,P.s4); b.px(cx+8,23,P.s1);
  b.vl(cx-8,19,21,P.s5); b.px(cx-8,18,P.s6); b.vl(cx+8,19,21,P.s2); b.px(cx+8,18,P.s3); b.vl(cx-6,20,21,P.s4); b.vl(cx+6,20,21,P.s2);
  // Glockenstube: Trifora, hinter jeder Öffnung eine Glocke
  storey(24,32,7);
  [cx-5,cx-1,cx+3].forEach(function(ox){ arch(b,ox,25,3,32,hole(ox+2,-1),VOUS); });
  b.vl(cx-2,26,32,P.s5); b.vl(cx+2,26,32,P.s4); b.px(cx-2,25,P.s6); b.px(cx+2,25,P.s5);
  function bell(bx,by,big){ b.px(bx,by,P.w1); if (big){ b.hl(bx-1,bx+1,by+1,P.w2); b.px(bx-1,by+1,P.w3); b.hl(bx-1,bx+1,by+2,P.w2); b.px(bx-1,by+2,P.y2); b.hl(bx-1,bx+1,by+3,P.w1); b.px(bx-1,by+3,P.w3); }
    else { b.px(bx,by+1,P.w2); b.px(bx,by+2,P.w3); } }
  bell(cx,27,true); bell(cx-4,28,false); bell(cx+4,28,false);
  band(33,9);
  // drittes Geschoss: Bifora mit Mittelsäulchen
  storey(35,43,8);
  arch(b,cx-4,37,4,43,hole(cx-1,cx-4),VOUS); arch(b,cx+1,37,4,43,hole(cx+4,cx+1),VOUS); b.vl(cx,38,43,P.s5); b.px(cx,37,P.s6);
  band(44,10);
  // zweites Geschoss: nur noch die Oberkante über den Dächern
  storey(46,60,9); arch(b,cx-1,49,3,58,hole(cx+1,-1),VOUS); }

// ---------------------------------------------------------------- Palastfront: die Südfassade des Diokletianpalastes
// Unten das Substruktionsgeschoss mit Läden und dem schlichten Bronzenen Tor in der Mitte. Darüber die Galerie (Kryptoportikus):
// Rundbögen zwischen Halbsäulen, die meisten zugemauert oder zu Fenstern der eingebauten Häuser geworden, über dem Tor die offene Loggia.
// Darauf das antike Hauptgesims und die Häuser, die man über siebzehn Jahrhunderte auf die Mauer gesetzt hat.
var GC=119, GATE=[112,126];                 // Achse: Bronzenes Tor und Loggia
var CY=49, GY0=53, GY1=72, SY=73, FY=77;    // Hauptgesims, Galerie, Gurtgesims, Erdgeschoss
var COLS=(function(){ var a=[], c; for (c=GC-13;c>=0;c-=13) a.unshift(c); for (c=GC+13;c<=PAL1-8;c+=13) a.push(c); return a; })();
var BAYK='rwowrbwg'+'wrowgrbw';             // je Bogen: o offen, r zugemauert, w Fenster, b Balkon, g verglast
var NOCOL={41:1,197:1};                     // Säulenschaft verloren, nur Kapitell und Basis
// Häuser auf der Mauer: x0, Breite, Traufhöhe, Putz (−1 = nur ein flaches Dach, 6 = Bruchstein), 'alt' = Dachterrasse
var HOUSES=[[0,17,40,0],[17,21,36,1],[38,14,43,2],[52,19,38,3],[71,17,43,4,'alt'],[88,23,37,0],[111,19,42,2],[130,12,42,6],[142,30,49,-1],[172,17,41,1],[189,21,36,3],[210,17,43,4],[227,19,38,0,'alt']];
function houses(b){ var PL=[R('s3 s4 s5'),R('e3 e4 s5'),R('t4 t5 s5'),R('s2 s3 s4'),R('e2 e3 e4'),R('s4 s5 s6'),R('s2 s3 s4 s5')];
  HOUSES.forEach(function(k,i){ var x0=k[0], w=k[1], top=k[2], pl=PL[k[3]]||PL[0], x1=Math.min(PAL1,x0+w), xx, yy;
    if (k[3]>=0) for (yy=top;yy<CY;yy++) for (xx=x0;xx<x1;xx++){ var c=(k[3]===6)?tex.ashlar(xx,yy,pl,7,4):tex.plaster(xx,yy,pl,0); if (xx===x0) c=M.UP[c]; if (xx===x1-1) c=M.DN[c]; b.px(xx,yy,c); }
    if (k[4]==='alt'){ altana(b,x0,x1,top); return; }
    // Dach: Traufe, Ziegelreihen, First
    var rh=k[3]<0?2:3; for (var q=0;q<rh;q++) for (xx=x0-1+q;xx<x1+1-q;xx++) b.px(xx,top-1-q,q===rh-1?P.t4:(((xx+q*2)%3===0)?P.t2:P.t3));
    if (k[3]<0) return;
    b.hl(x0,x1-1,top,P.t0); b.hl(x0,x1-1,top+1,M.DN[tex.plaster(x0,top+1,pl,0)]);
    if (hash(i,5)<0.55){ var cxh=x0+3+Math.floor(hash(i,6)*(w-7)); b.rect(cxh,top-7,3,4,P.s3); b.vl(cxh+2,top-7,top-4,P.s2); b.hl(cxh-1,cxh+3,top-8,P.s2); b.hl(cxh-1,cxh+3,top-7,P.s4); }
    if (i===1||i===10){ var ax=x0+w-5; b.vl(ax,top-11,top-4,P.m1); b.hl(ax-3,ax+2,top-10,P.m1); b.hl(ax-2,ax+1,top-8,P.m1); }
    for (var wx=x0+3;wx<x1-5;wx+=9){ var wy=top+3; if (wy+5>CY-1) continue; var st=hash(wx,top); win(b,wx,wy,3,5,st<0.4?'shut':(st<0.72?'half':'open'),st); } });
  // Wäsche zwischen zwei Häusern
  M.prop.laundry(b,192,41,205,41,7,[P.s6,P.b3,P.s5,P.r3,P.s6]); }
// Dachterrasse (altana): Brüstung, Pergola, Topfpflanzen, ein Wäscheständer
function altana(b,x0,x1,top){ var xx;
  b.hl(x0,x1-1,top,P.s5); b.hl(x0,x1-1,top+1,P.s2);
  for (xx=x0;xx<x1;xx+=3) b.vl(xx,top-4,top-1,P.m1); b.hl(x0,x1-1,top-4,P.m1);
  b.vl(x0+2,top-9,top-5,P.w2); b.vl(x1-3,top-9,top-5,P.w2); b.hl(x0+1,x1-2,top-9,P.w3); for (xx=x0+3;xx<x1-3;xx+=2) b.px(xx,top-8,P.w2);
  b.px(x0+4,top-5,P.g3); b.px(x0+5,top-6,P.g4); b.px(x0+4,top-6,P.g2); b.px(x0+6,top-5,P.t3); b.px(x1-6,top-5,P.g3); b.px(x1-6,top-6,P.g4); b.px(x1-5,top-5,P.t3);
  b.hl(x0+7,x1-8,top-7,P.s1); b.px(x0+8,top-6,P.s6); b.px(x0+8,top-5,P.s6); b.px(x0+10,top-6,P.b3); b.px(x0+10,top-5,P.b2); }
// kleines Fenster mit grünen Läden (škure)
function win(b,x,y,w,h,mode,seed){ b.rect(x-1,y-1,w+2,h+2,P.s4); b.hl(x-1,x+w,y+h,P.s5); b.hl(x-1,x+w,y-1,P.s3);
  if (mode==='shut'){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,((yy-y)%2===0)?P.g2:P.g3); b.vl(x+(w>>1),y,y+h-1,P.g1); return; }
  glass(b,x,y,w,h,'house',seed,function(xx,yy){ return (xx===x+(w>>1))?P.s2:((yy===y)?P.k1:P.k2); });
  if (mode==='half'){ for (var y2=y;y2<y+h;y2++){ b.px(x,y2,(y2%2)?P.g2:P.g3); b.px(x+w-1,y2,(y2%2)?P.g1:P.g2); } }
  else { for (var y3=y;y3<y+h;y3++){ b.px(x-2,y3,(y3%2)?P.g2:P.g3); b.px(x+w+1,y3,(y3%2)?P.g1:P.g2); } } }
// Halbsäule mit Kapitell und Basis; miss = nur noch Kapitell und Basis, dazwischen die Narbe im Stein
function column(b,c,miss){ var y;
  for (y=GY0+3;y<=GY1-2;y++){ if (miss){ if (bayer(c,y)<0.5) b.px(c,y,M.UP[b.get(c,y)]); continue; }
    b.px(c-1,y,P.s6); b.px(c,y,(y%5===0)?P.s4:P.s5); b.px(c+1,y,P.s3); b.px(c+2,y,M.DN[b.get(c+2,y)]); }
  b.hl(c-2,c+2,GY0,P.s6); b.hl(c-2,c+2,GY0+1,P.s4); b.px(c+2,GY0+1,P.s2); b.hl(c-1,c+1,GY0+2,P.s3); b.px(c-1,GY0+2,P.s5); b.px(c+3,GY0+1,M.DN[b.get(c+3,GY0+1)]); b.px(c+3,GY0+2,M.DN[b.get(c+3,GY0+2)]);
  b.hl(c-2,c+2,GY1-1,P.s5); b.px(c+2,GY1-1,P.s3); b.hl(c-2,c+2,GY1,P.s2); }
// ein Bogen der Galerie (8 px breit)
function bay(b,ox,k,i){ var w=8, y0=GY0+4, y1=GY1-1, xx, yy;
  if (k==='o'){   // offen: dunkler Gang, Geländer, Hängelampe
    arch(b,ox,y0,w,y1,function(x,y,kk){ if (kk<2) return P.k1; if (x===ox+w-1) return P.s0; return (y>y1-4)?P.k1:P.k2; },VOUS);
    b.hl(ox,ox+w-1,y1-4,P.m1); for (xx=ox+1;xx<ox+w;xx+=2) b.vl(xx,y1-3,y1,P.m1);
    hangLamp(b,ox+4,y0+1,i); return; }
  var rec=function(x,y,kk,c){ if (kk===0||x===ox) c=M.DN[c]; if (kk===1 && bayer(x,y)<0.5) c=M.DN[c]; return c; };
  if (k==='r'){   // mit Bruchstein zugemauert, leicht zurückgesetzt
    arch(b,ox,y0,w,y1,function(x,y,kk){ return rec(x,y,kk,tex.ashlar(x+i*3,y+i,R('s1 s2 s3 s3'),5,3)); },VOUS); return; }
  var pl=[R('e3 e4 s4'),R('s3 s4 s5'),R('s3 s4 s5'),R('e3 s3 s4')][i%4];
  arch(b,ox,y0,w,y1,function(x,y,kk){ return rec(x,y,kk,tex.plaster(x,y,pl,y0+4)); },VOUS);
  if (k==='w'){ var st=hash(i,23); win(b,ox+3,y0+5,3,6,st<0.4?'shut':(st<0.7?'half':'open'),st); }
  else if (k==='g'){ glass(b,ox+2,y0+3,4,9,'house',i+50,function(x,y){ return (x===ox+2||y===y0+3)?P.w1:((y===y0+7)?P.w1:((x+y)%6===0?P.n0:P.k2)); }); b.hl(ox+1,ox+6,y0+12,P.s5); }
  else if (k==='b'){ glass(b,ox+2,y0+3,4,10,'house',i+70,function(x,y){ return (y===y0+3)?P.k1:((x===ox+3)?P.w1:P.k2); });
    b.hl(ox+1,ox+6,y0+13,P.s5); b.hl(ox,ox+7,y0+14,P.s2); b.hl(ox,ox+7,y0+10,P.m1); for (xx=ox;xx<=ox+7;xx+=2) b.vl(xx,y0+11,y0+13,P.m1);
    b.px(ox+1,y0+9,P.g3); b.px(ox+2,y0+9,P.r3); b.px(ox+6,y0+9,P.g4); b.px(ox+5,y0+8,P.g3); b.px(ox+6,y0+8,P.g2); } }
// Laterne an einer Kette unter dem Bogen
function hangLamp(b,x,y,i){ b.vl(x,y,y+2,P.m0); b.hl(x-1,x+1,y+3,P.m1); glass(b,x-1,y+4,3,2,'hang',i,function(){ return P.m2; }); b.hl(x-1,x+1,y+6,P.m0); b.px(x,y+7,P.m0); }
// die große Loggia über dem Tor
function loggia(b,ox,w){ var y0=GY0+2, y1=GY1-1, xx;
  arch(b,ox,y0,w,y1,function(x,y,k){ if (k<2) return P.k1; if (x>=ox+w-2) return P.s0; if (x===ox) return P.k1; if (y>y0+8 && y<y1-5 && ((x-ox)===5||(x-ox)===15)) return P.s0; return P.k2; },VOUS);   // hinten zwei Türen
  // zweite Bogenreihe (Archivolte) und Schlussstein
  arch(b,ox-1,y0-1,w+2,y0-1,function(){ return undefined; },function(x,y,l){ return l?P.s5:P.s3; });
  b.rect(ox+(w>>1)-1,y0-2,3,2,P.s5); b.px(ox+(w>>1)+1,y0-1,P.s3);
  // steinerne Balustrade
  b.hl(ox,ox+w-1,y1-5,P.s6); b.hl(ox,ox+w-1,y1-4,P.s3); for (xx=ox+1;xx<ox+w-1;xx+=2){ b.vl(xx,y1-3,y1-1,P.s4); b.px(xx,y1-2,P.s5); } b.hl(ox,ox+w-1,y1,P.s3);
  hangLamp(b,ox+(w>>1),y0+1,9); }

function palace(b,tod){ var x, y;
  houses(b);
  // Mauerwerk aus großen Kalksteinquadern, unten gröber
  var UA=R('s2 s3 s4 s5'), LA=R('s2 s3 s4 s5');
  for (y=GY0;y<=GY1;y++) for (x=0;x<PAL1;x++) b.px(x,y,tex.ashlar(x+7,y-GY0+1,UA,15,5));
  for (y=FY;y<PB;y++) for (x=0;x<PAL1;x++) b.px(x,y,tex.ashlar(x+3,y-FY+3,LA,19,6));
  // Patina: weiche Flecken, unten Salz und Feuchte
  M.light(b,function(x,y){ return (fbm(x/28,y/10,31)-0.5)*1.3-(y>=FY?0.35+(y>90?(y-90)/9*0.6:0):0); },0,0,function(x,y){ return x<PAL1 && ((y>=GY0 && y<=GY1)||(y>=FY && y<PB)); });
  // Hauptgesims mit Zahnschnitt, Gurtgesims
  for (x=0;x<PAL1;x++){ b.px(x,CY,P.s5); b.px(x,CY+1,P.s6); b.px(x,CY+2,(x%3===2)?P.s1:P.s4); b.px(x,CY+3,P.s2); if (bayer(x,GY0)<0.5) b.px(x,GY0,M.DN[b.get(x,GY0)]); }
  for (x=0;x<PAL1;x++){ b.px(x,SY,P.s5); b.px(x,SY+1,P.s6); b.px(x,SY+2,P.s3); b.px(x,SY+3,P.s1); }
  // Galerie: Bögen, dann die Halbsäulen davor
  var bi=0;
  for (var ci=0;ci<COLS.length-1;ci++){ var a=COLS[ci], z=COLS[ci+1]; if (a===GC-13){ loggia(b,a+3,z-a-5); continue; } bay(b,a+3,BAYK[bi],bi); bi++; }
  COLS.forEach(function(c){ column(b,c,!!NOCOL[c]); });
  // Schmutzfahnen unter den Gesimsen
  for (x=0;x<PAL1;x++){ var st3=Math.sin(x*0.37)+Math.sin(x*0.11+2)+hash(x,77); if (st3>1.45){ var L=4+Math.floor(hash(x,78)*9);
      [GY0+1,FY].forEach(function(y0){ for (var yy=y0;yy<y0+L;yy++){ if (bayer(x,yy)>=0.45*(1-(yy-y0)/L)) continue; var k=yy*W+x, c3=b.d[k]; if (WM[k] || c3===P.k1 || c3===P.k2 || c3===P.k0) continue; b.px(x,yy,M.DN[c3]); } }); } }
  // Erdgeschoss: Läden und das Bronzene Tor
  SHOPS.forEach(function(s,i){ shop(b,s,i); });
  gate(b);
  b.hl(0,PAL1-1,PB-1,P.s1); b.hl(0,PAL1-1,PB-2,P.s2);
  // Plakate an der Mauer neben dem Tor
  poster(b,101,86,5,7,P.r3,P.s6); poster(b,128,88,4,6,P.y4,P.k2); poster(b,190,88,5,7,P.b2,P.s6);
  // Tauben auf den Gesimsen
  [[63,CY-1],[66,CY-1],[178,CY-1],[146,SY-1],[149,SY-1],[236,SY-1],[22,SY-1]].forEach(function(p,i){ pigeon(b,p[0],p[1],(i%2)?1:-1); }); }
function poster(b,x,y,w,h,c,c2){ b.rect(x,y,w,h,c); b.hl(x,x+w-1,y,M.UP[c]); for (var yy=y+2;yy<y+h-1;yy+=2) b.hl(x+1,x+w-2,yy,c2); b.vl(x+w,y+1,y+h,M.DN[b.get(x+w,y+1)]); }
function pigeon(b,x,y,f){ b.px(x,y,P.m2); b.px(x+f,y,P.m3); b.px(x-f,y,P.m1); b.px(x+f,y-1,P.m3); b.px(x+2*f,y-1,P.e2); }

// Laden im Erdgeschoss: Öffnung im Mauerwerk mit Sturz oder Bogen, Schaufenster, eingerollte Markise, Schild
var SHOPS=[[8,28,'shop','',6],[38,62,'cafe','KAVA'],[72,96,'shop','',98],[134,152,'bar','BAR'],[162,186,'shut',''],[196,218,'cafe',''],[226,244,'shop','+']];   // x0, x1, Art, Schild, Hängeschild bei x
function shopLit(i,night){ if (SHOPS[i][2]==='shut') return false; return night?(i%3===0):true; }
function shopFill(x0,x1,y0,i){ var dx=x0+Math.floor((x1-x0)*0.62), ty=y0+4;
  return function(x,y){ var gx=x-x0, gy=y-y0;
    if (y===ty || x===dx || x===dx+5) return P.w1;                         // Kämpfer, Türrahmen
    if (x>dx && x<dx+5){ return (y===y0+9)?P.y2:P.k2; }                     // Ladentür
    if (y===y0+9 || y===y0+13) return P.w1;                                // Regalböden
    if (y>PB-5) return (gx%3===0)?P.w0:P.w1;                               // Theke
    var g=hash(Math.floor(x/2)+i*13,Math.floor((y-y0)/4)); if (y>ty && g<0.38) return [P.r2,P.g2,P.c2,P.y1,P.t2,P.s2][Math.floor(g*16)%6];
    return ((gx+gy*2)%11<2 && y<ty)?P.n0:P.k2; }; }
function shop(b,s,i){ var x0=s[0], x1=s[1], w=x1-x0, kind=s[2], sg=s[3], oy=85, xx, yy;
  var AW=[R('g1 g2 g3'),R('r1 r2 r3'),R('c1 c2 c3'),R('w1 w2 w3')][i%4];
  if (kind==='cafe'){   // zwei Bogenfenster in der alten Mauer
    var hw=(w-3)>>1;
    [x0,x1-hw].forEach(function(ox,j){ arch(b,ox,oy-2,hw,PB-3,function(){ return P.w0; },VOUS);
      glass(b,ox+1,oy-1,hw-2,PB-3-oy,'shop',i,function(x,y){ if (!inArch(ox,oy-2,hw,x,y)) return undefined; if (y===oy+3) return P.w1; if (y>PB-6) return (x%3===0)?P.w0:P.w1; if (x===ox+(hw>>1)) return P.w1; var t=hash(Math.floor(x/3)+j*7,Math.floor(y/3)+i); return (y>oy+5 && t<0.25)?P.w1:((x+y*2)%13<2?P.n0:P.k2); }); });
    b.rect(x0+hw,oy,x1-x0-2*hw,PB-2-oy,P.s3); b.vl(x0+hw,oy,PB-3,P.s5); }
  else if (kind==='bar'){   // eine Bogenöffnung mit Glastür
    arch(b,x0,oy-3,w,PB-3,function(){ return P.w0; },VOUS);
    glass(b,x0+1,oy,w-2,PB-3-oy,'shop',i,function(x,y){ if (!inArch(x0,oy-3,w,x,y)) return undefined; if (x===x0+(w>>1)||y===oy+4) return P.w1; if (y===oy+9 && x>x0+(w>>1)) return P.y2; var t=hash(Math.floor(x/2),Math.floor(y/3)+i*5); return (y>oy+6 && x<x0+(w>>1) && t<0.3)?[P.g2,P.y1,P.r2][Math.floor(t*10)%3]:((x+y*2)%11<2?P.n0:P.k2); }); }
  else if (kind==='shut'){   // im November geschlossen: Rollladen mit Schloss und Plakat
    b.rect(x0-2,oy-3,w+4,3,P.s4); b.hl(x0-2,x1+1,oy-3,P.s6); b.hl(x0-2,x1+1,oy-1,P.s2);
    for (yy=oy;yy<PB-2;yy++) for (xx=x0;xx<x1;xx++) b.px(xx,yy,(yy-oy)%2===0?P.m3:P.m2);
    b.hl(x0,x1-1,oy,P.m1); b.hl(x0,x1-1,PB-3,P.m1); b.px(x0+(w>>1),PB-4,P.y3); b.px(x0+(w>>1),PB-5,P.m1);
    b.vl(x0,oy,PB-3,P.m1); b.vl(x1-1,oy,PB-3,P.m1);
    poster(b,x0+3,oy+3,6,8,P.s5,P.r3); poster(b,x0+12,oy+4,5,7,P.y3,P.k2); }
  else {   // Laden mit steinernem Sturz
    b.rect(x0-2,oy-3,w+4,3,P.s4); b.hl(x0-2,x1+1,oy-3,P.s6); b.hl(x0-2,x1+1,oy-1,P.s2); b.vl(x0-2,oy-3,oy-1,P.s3); b.vl(x1+1,oy-3,oy-1,P.s2);
    b.rect(x0,oy,w,PB-2-oy,P.w0); b.vl(x0,oy,PB-3,P.s1); b.vl(x1-1,oy,PB-3,P.s3);
    glass(b,x0+1,oy+1,w-3,PB-4-oy,'shop',i,shopFill(x0+1,x1-2,oy+1,i));
    // eingerollte Markise
    if (i!==6){ for (xx=x0-1;xx<x1+1;xx++){ b.px(xx,oy-1,(((xx-x0)>>1)%2)?AW[2]:AW[1]); b.px(xx,oy,AW[0]); } b.px(x0-1,oy+1,P.m1); b.px(x1,oy+1,P.m1); } }
  // Schild über der Öffnung
  if (sg==='+'){ var cxp=x0+(w>>1)-4; b.rect(cxp,76,8,8,P.s6); b.vl(cxp+7,76,83,P.s3); b.hl(cxp,cxp+7,83,P.s3); b.rect(cxp+3,77,2,6,P.g4); b.rect(cxp+1,79,6,2,P.g4); b.px(cxp+3,77,P.g5); b.px(cxp+1,79,P.g5); }
  else if (sg){ var sw=M.microWidth(sg)+4, sx=x0+Math.floor((w-sw)/2); b.rect(sx,76,sw,7,P.w0); b.hl(sx,sx+sw-1,76,P.w2); b.hl(sx,sx+sw-1,82,P.k2); M.microText(b,sg,sx+2,77,P.s4); }
  else if (s[4]){   // Hängeschild an einem Eisenarm
    var hx=s[4]; b.hl(hx-2,hx+2,78,P.m1); b.vl(hx-2,78,79,P.m1); b.vl(hx+2,78,79,P.m1); b.rect(hx-2,80,5,4,P.w1); b.hl(hx-2,hx+2,80,P.w3); b.px(hx,81,[P.r3,P.y3,P.g4,P.s5][i%4]); b.px(hx,82,[P.r2,P.y2,P.g3,P.s4][i%4]); } }
// das Bronzene Tor: ein schlichter Rundbogen, dahinter der Gang in die Substruktionen
function gate(b){ var g0=GATE[0], g1=GATE[1], w=g1-g0, y0=79, yy, xx;
  // Gewände
  b.rect(g0-3,y0+5,3,PB-y0-5,P.s4); b.vl(g0-3,y0+5,PB-1,P.s6); b.vl(g0-1,y0+5,PB-1,P.s3);
  b.rect(g1,y0+5,3,PB-y0-5,P.s3); b.vl(g1+2,y0+5,PB-1,P.s2); b.vl(g1,y0+5,PB-1,P.s4);
  // Gang: oben dunkel, der Boden wird zum Licht hin heller
  arch(b,g0,y0,w,PB-1,function(x,y,k){ if (k<2) return P.k1; if (y>=PB-4) return (y===PB-1)?P.s1:P.s0; if (x===g1-1) return P.s0; return P.k2; },function(x,y,l){ return (Math.floor(x/3)%2)?(l?P.s5:P.s4):(l?P.s6:P.s3); });
  arch(b,g0-2,y0-2,w+4,y0-2,function(){ return undefined; },function(x,y,l){ return l?P.s4:P.s2; });
  // hinten das Licht der Kellerhallen
  glass(b,g0+4,y0+8,w-8,PB-y0-12,'gate',0,function(x,y){ return (y<y0+10)?P.k1:((y>PB-7)?P.s1:P.s0); });
  hangLamp(b,g0+(w>>1),y0+1,30); }

// ---------------------------------------------------------------- Hafenbüro (Lučka kapetanija), 19. Jh.
var ODOOR=[280,58,24,42];   // Türflügel x,y,w,h (darüber Oberlicht)
function office(b,tod){ var x0=OF0, x1=OF1, x, y, PL=R('t3 t4 t5 d6');
  // Walmdach mit Kaminen
  for (y=6;y<15;y++) for (x=x0+(15-y)+1;x<x1-(15-y)-1;x++) b.px(x,y,((x+y*2)%4===0)?P.t2:(y<8?P.t4:(y>12?P.t2:P.t3)));
  b.rect(x0+18,1,4,7,P.s3); b.vl(x0+18,1,7,P.s4); b.hl(x0+17,x0+22,1,P.s5); b.rect(x1-24,2,4,6,P.s3); b.vl(x1-24,2,7,P.s4); b.hl(x1-25,x1-20,2,P.s5);
  // Traufgesims mit Zahnschnitt
  b.hl(x0-2,x1+1,15,P.s6); b.hl(x0-2,x1+1,16,P.s4); b.hl(x0-1,x1,17,P.s2); for (x=x0;x<x1;x+=3){ b.px(x,18,P.s4); b.px(x+1,18,P.s2); b.px(x+2,18,P.s1); }
  // Fries mit Inschrift
  for (y=19;y<26;y++) for (x=x0;x<x1;x++) b.px(x,y,(y===19)?P.s4:(y===25?P.s3:P.s5));
  M.microText(b,'LUČKA KAPETANIJA',x0+Math.floor((x1-x0-63)/2),20,P.n0);
  b.hl(x0,x1-1,26,P.s6); b.hl(x0,x1-1,27,P.s2);
  // Obergeschoss: Putz, Ecklisenen
  for (y=28;y<49;y++) for (x=x0;x<x1;x++) b.px(x,y,tex.plaster(x,y,PL,40));
  for (y=28;y<49;y++){ var q=Math.floor((y-28)/5)%2; for (x=x0;x<x0+5+(q?2:0);x++) b.px(x,y,(y%5===3)?P.s2:(x===x0?P.s6:P.s4)); for (x=x1-5-(q?2:0);x<x1;x++) b.px(x,y,(y%5===3)?P.s2:(x===x1-1?P.s2:P.s4)); }
  [258,285,312].forEach(function(wx,i){ var wy=31, ww=13, wh=15;
    b.rect(wx-2,wy-2,ww+4,wh+3,P.s4); b.hl(wx-2,wx+ww+1,wy-2,P.s5); b.vl(wx+ww+1,wy-2,wy+wh,P.s2); b.vl(wx-2,wy-2,wy+wh,P.s5);
    b.rect(wx-3,wy+wh,ww+6,2,P.s5); b.hl(wx-3,wx+ww+2,wy+wh+1,P.s2);
    if (i===1){ b.poly([[wx-4,wy-3],[wx+ww/2,wy-7],[wx+ww+3,wy-3]],P.s4); b.line(wx-4,wy-3,Math.round(wx+ww/2),wy-7,P.s6); b.hl(wx-4,wx+ww+3,wy-3,P.s2); }
    else { b.rect(wx-3,wy-5,ww+6,2,P.s5); b.hl(wx-3,wx+ww+2,wy-5,P.s6); b.hl(wx-3,wx+ww+2,wy-3,P.s2); }
    glass(b,wx,wy,ww,wh,'office',i,function(xx,yy){ if ((xx-wx)===6||(yy-wy)===7) return P.s4; return (yy===wy||xx===wx)?P.k1:((xx+yy)%7===0?P.n1:P.k2); });
    for (var yy=wy;yy<wy+wh;yy++){ for (var k=0;k<3;k++){ b.px(wx-5+k,yy,((yy-wy)%2)?P.g2:P.g3); b.px(wx+ww+2+k,yy,((yy-wy)%2)?P.g2:P.g3); } b.px(wx-5,yy,P.g1); b.px(wx+ww+4,yy,P.g1); } });
  // Balkon mit Geländer über der Tür
  b.rect(278,46,28,3,P.s5); b.hl(278,305,46,P.s6); b.hl(278,305,48,P.s2); b.hl(279,304,49,P.s1);
  for (x=279;x<305;x+=2) b.vl(x,41,45,P.m0); b.hl(278,305,41,P.m1); b.hl(279,304,43,P.m0);
  // Gurtgesims, Erdgeschoss mit Rustika
  b.hl(x0-1,x1,49,P.s6); b.hl(x0-1,x1,50,P.s3); b.hl(x0-1,x1,51,P.s1);
  for (y=52;y<PB;y++) for (x=x0;x<x1;x++){ var c2=((y-52)%6===0)?P.s2:(((y-52)%6===1)?P.s5:P.s4); if (((x+((Math.floor((y-52)/6)%2)*10))%20)===0) c2=P.s2; if (hash(x>>1,y)<0.05) c2=M.DN[c2]; b.px(x,y,c2); }
  // Fenster im Erdgeschoss mit Gittern
  [[254,62],[316,62]].forEach(function(p,i){ var wx=p[0], wy=p[1], ww=15, wh=24; b.rect(wx-2,wy-3,ww+4,wh+5,P.s3); b.hl(wx-2,wx+ww+1,wy-3,P.s5); b.vl(wx-2,wy-3,wy+wh+1,P.s5); b.rect(wx-3,wy+wh,ww+6,2,P.s5); b.hl(wx-3,wx+ww+2,wy+wh+1,P.s2);
    glass(b,wx,wy,ww,wh,'office',5+i,function(xx,yy){ if ((xx-wx)%5===2||(yy-wy)%8===4) return P.m1; return (yy===wy)?P.k1:((xx+yy)%9===0?P.n1:P.k2); }); });
  // Portal: Steinrahmen, Oberlicht, zweiflügelige Tür
  var dx=ODOOR[0], dy=ODOOR[1], dw=ODOOR[2], dh=ODOOR[3];
  b.rect(dx-4,dy-8,dw+8,dh+8,P.s3); b.vl(dx-4,dy-8,PB-1,P.s6); b.vl(dx-3,dy-8,PB-1,P.s4); b.vl(dx+dw+3,dy-8,PB-1,P.s1); b.vl(dx+dw+2,dy-8,PB-1,P.s2); b.hl(dx-4,dx+dw+3,dy-8,P.s5);
  b.rect(dx+dw/2-3,dy-9,6,3,P.s5); b.hl(dx+dw/2-3,dx+dw/2+2,dy-9,P.s6);   // Schlussstein
  glass(b,dx,dy-6,dw,5,'fan',0,function(xx,yy){ return ((xx-dx)%4===2||yy===dy-6)?P.w1:P.k2; });
  b.hl(dx,dx+dw-1,dy-1,P.w1);
  M.prop.door(b,dx,dy,dw,dh,{ramp:R('w0 w1 w2 w3 w4'),frame:R('s1 s2 s3 s4'),glass:true,glassCol:P.k2,knob:'R'});
  b.vl(dx+(dw>>1),dy,dy+dh-1,P.w0); b.vl(dx+(dw>>1)+1,dy,dy+dh-1,P.w3);
  glass(b,dx+3,dy+3,(dw>>1)-4,Math.floor(dh*0.38),'door',0,function(xx,yy){ return (yy===dy+3)?P.k1:P.k2; });
  glass(b,dx+(dw>>1)+2,dy+3,(dw>>1)-5,Math.floor(dh*0.38),'door',1,function(xx,yy){ return (yy===dy+3)?P.k1:P.k2; });
  b.rect(dx-5,PB-2,dw+10,2,P.s4); b.hl(dx-5,dx+dw+4,PB-2,P.s6);
  // Wappen, Messingschild, Wandlaterne
  var wx2=dx+(dw>>1)-3; b.rect(wx2,36,7,7,P.s6); for (var yy2=0;yy2<4;yy2++) for (var xx2=0;xx2<5;xx2++) if ((xx2+yy2)%2===0) b.px(wx2+1+xx2,37+yy2,P.r3); b.hl(wx2+1,wx2+5,41,P.s6); b.px(wx2+3,42,P.r3); b.hl(wx2,wx2+6,35,P.y3);
  b.rect(dx-11,dy+14,5,4,P.y2); b.hl(dx-11,dx-7,dy+14,P.y4); b.px(dx-9,dy+16,P.y1);
  b.hl(dx-14,dx-8,dy-2,P.m0); b.vl(dx-14,dy-6,dy-1,P.m0); b.rect(dx-16,dy-5,5,6,P.m1); b.rect(dx-15,dy-4,3,4,P.m3); b.hl(dx-17,dx-11,dy-6,P.m0);
  // Fahnenstange
  b.line(x1-2,40,FLAG[0],FLAG[1],P.m2); b.px(FLAG[0],FLAG[1]-1,P.y3);
  b.hl(x0,x1-1,PB-1,P.s1); }

// ---------------------------------------------------------------- Brüstung rechts vom Hafenbüro
function parapet(b){ for (var x=OF1;x<MX0;x++){ for (var y=92;y<=PB;y++){ var c=(y===92)?P.s6:((y===93)?P.s4:((y===94)?P.s2:((x%11===0)?P.s2:(y<97?P.s4:P.s3)))); b.px(x,y,c); } }
  for (var px=OF1+6;px<MX0-4;px+=22){ b.rect(px,89,5,4,P.s4); b.hl(px,px+4,89,P.s6); b.vl(px+4,89,92,P.s2); } }

// ---------------------------------------------------------------- Pflaster (poliert, mit Perspektive)
function paveAt(x,y,yb,yf,ramp,seed){ var a=3, bb=3.2/(yf-yb), v=Math.log((a+bb*(y-yb))/a)/bb, row=Math.floor(v/2.2), fy=v/2.2-row;
  var yr=yb+(Math.exp(row*2.2*bb)-1)*a/bb, d=clamp((yr-yb)/(yf-yb),0,1), s=11+d*13, off=(row%2)*0.5+hash(row,seed)*0.37, u=x/s+off+0.24*Math.sin(x/s*2.1+row*1.7+seed), col=Math.floor(u), fx=u-col, rh=(a+bb*(y-yb))*2.2;
  if (fy*rh<1 || fx*s<1) return ramp[0];
  var t=hash(col*7.13+row*3.71,row*1.93+seed), c=t<0.3?ramp[1]:(t<0.86?ramp[2]:ramp[3]);
  if (fy*rh<2 && fx*s>2) c=M.UP[c];
  return c; }
function pavement(b,tod,wea){ var rp=R('s2 s3 s4 s5'), x, y;
  for (y=PB;y<QY;y++) for (x=0;x<MX0;x++){ if (x>=OF1 && y<=PB) continue; b.px(x,y,paveAt(x,y,PB,QY,rp,3)); }
  // Glanz: der polierte Stein spiegelt den hellen Himmel (nach hinten heller)
  M.light(b,function(x,y){ var d=(y-PB)/(QY-PB); return 0.5-d*0.75; },0,0,function(x,y){ return y>=PB&&y<QY&&x<MX0&&FAR[y*W+x]===0; });
  // Kaikante vorn
  for (x=0;x<MX0;x++){ b.px(x,QY,P.s6); b.px(x,QY+1,(x%17===0)?P.s2:P.s4); b.px(x,QY+2,(x%17===0)?P.s1:P.s3); b.px(x,QY+3,(x%17===0)?P.s0:P.s1); }
  for (x=20;x<MX0;x+=46){ b.px(x,QY+2,P.m2); b.px(x+1,QY+2,P.m1); b.px(x,QY+3,P.m1); }   // Ringe
  [[60,122],[190,118],[300,128]].forEach(function(g){ b.rect(g[0],g[1],8,2,P.m0); for (var k=0;k<8;k+=2) b.px(g[0]+k,g[1],P.m2); }); }

// ---------------------------------------------------------------- Mole
function mole(b,tod,wea){ var x, y, rp=R('s1 s2 s3 s4');
  for (y=MB;y<MF;y++) for (x=MX0;x<MX1;x++) b.px(x,y,paveAt(x+300,y,MB,MF,rp,9));
  M.light(b,function(x,y){ return 0.3-(y-MB)/(MF-MB)*0.5; },0,0,function(x,y){ return x>=MX0&&x<MX1&&y>=MB&&y<MF; });
  for (x=MX0;x<MX1;x++){ b.px(x,MB,P.s5); b.px(x,MB+1,P.s2); }
  for (x=MX0;x<MX1;x++){ b.px(x,MF,P.s6); b.px(x,MF+1,P.s4); for (y=MF+2;y<MW;y++){ var c2=tex.ashlar(x,y-MF-2,R('s1 s2 s3 s3'),15,3); if (y===MW-1) c2=(hash(x,5)<0.6)?P.g1:P.a1; b.px(x,y,c2); } }
  for (y=MB;y<MW;y++){ b.px(MX1-1,y,P.s1); b.px(MX1-2,y,M.DN[b.get(MX1-2,y)]); }
  for (y=MF+1;y<MW+2;y++){ b.px(470,y,P.m1); b.px(474,y,P.m1); } for (y=MF+2;y<MW+2;y+=2) b.hl(470,474,y,P.m2);
  [440,520,580].forEach(function(rx){ b.px(rx,MF+3,P.m2); b.px(rx+1,MF+3,P.m1); b.px(rx,MF+4,P.m1); });
  for (y=MB;y<=QY+3;y++) b.px(MX0,y,y<MF?P.s4:P.s1); }

// ---------------------------------------------------------------- Requisiten
function palm(b,x,by,h,o){ o=o||{}; var r=M.rng(o.seed||7), lean=o.lean||0, wind=o.wind||0, TR=R('w0 w1 w2 w3 w4 e3'), LF=R('g0 g1 g2 g3 g4 g5');
  b.ellipse(x+0.5,by+0.5,7,2.2,P.m0); b.ellipse(x+0.5,by,5,1.3,P.e1);
  var tx=x, ty=by-h;
  for (var i=0;i<=h;i++){ var t=i/h, cx=x+lean*Math.sin(t*Math.PI*0.5), y=by-i, hw=3.3-t*1.1; if (i<4) hw+=(4-i)*0.35;
    for (var k=Math.floor(cx-hw);k<=Math.ceil(cx+hw);k++){ var u=(k+0.5-(cx-hw))/(2*hw); if (u<0||u>1) continue;
      var ring=(i%3===0), scar=(i%3===1)&&(((k+Math.floor(i/3))%3)===0);
      b.px(k,y,ra(TR,0.86-u*0.75+(ring?-0.2:0)+(scar?-0.14:0),k,y)); }
    if (i===h) tx=Math.round(cx); }
  // Knolle aus Blattansätzen
  for (var yy=ty-2;yy<=ty+3;yy++) for (var xx=tx-4;xx<=tx+4;xx++){ var dd=Math.pow((xx-tx)/4.5,2)+Math.pow((yy-ty-0.5)/3,2); if (dd>1) continue; b.px(xx,yy,((xx+yy*2)%3===0)?P.w1:(xx<tx?P.e3:P.e2)); }
  // tote, hängende Wedel
  for (var dw=0;dw<5;dw++){ var a0=Math.PI*(0.3+dw*0.1), px=tx+(dw-2)*1.5, py=ty+2; for (var s=0;s<9;s++){ px+=Math.cos(a0)*0.55+(dw-2)*0.12; py+=0.95; b.px(Math.round(px),Math.round(py),s<5?P.e2:P.e1); if (s>2&&s%2) b.px(Math.round(px)+1,Math.round(py),P.e1); } }
  // grüne Wedel: hintere zuerst, die oberen hell
  var N=o.n||12, fr=[];
  for (var f=0;f<N;f++){ var a=-Math.PI*0.5+(f/(N-1)-0.5)*Math.PI*1.7+(r()-0.5)*0.18; fr.push([a,15+r()*8,r()]); }
  fr.sort(function(p,q){ return Math.abs(Math.sin(q[0]))-Math.abs(Math.sin(p[0])); });
  fr.forEach(function(F){ var a=F[0], L=F[1], dx=Math.cos(a), dy=Math.sin(a), px=tx, py=ty, up=-dy;
    var pts=[]; for (var s=0;s<L;s++){ dy+=0.06+s*0.006; dx+=wind*0.055*(dx<0?1.6:1); var n=Math.hypot(dx,dy); dx/=n; dy/=n; px+=dx; py+=dy*0.92; pts.push([px,py,dx,dy]); }
    var base=0.5+up*0.32;
    // Fiedern unten (lang, hängend), dann Mittelrippe und obere Fiedern
    pts.forEach(function(p,s){ if (s<2) return; var ll=Math.min(5,1+s*0.42)*(1-Math.pow(s/L,2)*0.75); var nx=-p[3], ny=p[2]; if (ny<0){ nx=-nx; ny=-ny; }
      for (var q=1;q<=ll;q++){ var qx=p[0]+nx*q*0.55+wind*q*0.35-p[2]*q*0.2, qy=p[1]+ny*q*0.45+q*0.62; b.px(Math.round(qx),Math.round(qy),ra(LF,base-0.22-q*0.04,qx,qy)); } });
    pts.forEach(function(p,s){ var ll=s<2?0:Math.min(3,0.6+s*0.25)*(1-Math.pow(s/L,2)*0.8); var nx=p[3], ny=-p[2]; if (ny>0){ nx=-nx; ny=-ny; }
      b.px(Math.round(p[0]),Math.round(p[1]),ra(LF,base+0.1,p[0],p[1]));
      for (var q=1;q<=ll;q++){ var qx=p[0]+nx*q*0.6-p[2]*q*0.35+wind*q*0.3, qy=p[1]+ny*q*0.35+q*0.3; b.px(Math.round(qx),Math.round(qy),ra(LF,base+0.18-q*0.03,qx,qy)); } }); }); }
function lamp(b,x,by,h){ var I=R('k1 m0 m1 m2 m3');
  b.rect(x-3,by-4,7,4,I[1]); b.hl(x-3,x+3,by-4,I[3]); b.hl(x-4,x+4,by-1,I[1]); b.vl(x-3,by-4,by-1,I[2]);
  b.rect(x-2,by-9,5,5,I[1]); b.vl(x-2,by-9,by-5,I[2]); b.hl(x-2,x+2,by-9,I[3]);
  b.rect(x-1,by-h,3,h-9,I[1]); b.vl(x-1,by-h,by-10,I[3]); b.vl(x+1,by-h,by-10,I[0]);
  b.hl(x-2,x+2,by-h,I[2]); b.hl(x-3,x+3,by-h-1,I[1]); b.hl(x-3,x+3,by-h-2,I[2]);
  var hy=by-h-3; b.poly([[x-4,hy],[x+5,hy],[x+4,hy-8],[x-3,hy-8]],P.m3); b.vl(x,hy-8,hy,I[1]); b.hl(x-3,x+4,hy-4,I[1]); b.px(x-3,hy-6,P.m4); b.px(x+3,hy-6,P.m2);
  b.poly([[x-5,hy-8],[x+6,hy-8],[x+3,hy-11],[x-2,hy-11]],I[1]); b.hl(x-5,x+5,hy-8,I[3]); b.px(x,hy-12,I[1]); b.px(x,hy-13,I[2]); }
function lampGlass(b,x,by,h,c1,c2){ var hy=by-h-3; for (var yy=hy-7;yy<hy;yy++) for (var xx=x-3;xx<=x+4;xx++){ if (xx===x||yy===hy-4) continue; var e=(xx===x-3||xx===x+4)&&(yy===hy-7||yy===hy-1); if (e) continue; b.px(xx,yy,(yy<hy-4)?c2:c1); } b.px(x-1,hy-6,P.l1); b.px(x+1,hy-6,P.l1); b.px(x-1,hy-2,P.l0); }
// Bank zum Meer hin: Lehne (2 Latten), Sitzfläche (von oben sichtbar), geschwungene Gusseisenwangen mit Armlehne
function bench(b,x0,x1,by){ var Wd=R('w1 w2 w3 w4 w5'), I=R('k1 m0 m1 m2 m3'), x;
  // Schatten auf dem Boden
  for (x=x0+1;x<x1;x++){ b.px(x,by,P.s1); if (x>x0+2&&x<x1-2) b.px(x,by-1,P.s2); }
  // Lehne
  for (var k=0;k<2;k++){ var yy=by-24+k*5; b.hl(x0+2,x1-2,yy,Wd[4]); b.hl(x0+2,x1-2,yy+1,Wd[3]); b.hl(x0+2,x1-2,yy+2,Wd[1]); }
  b.vl(x0+((x1-x0)>>1),by-22,by-15,I[1]);
  // Sitzfläche (drei Latten von oben) und Vorderkante
  b.hl(x0+1,x1-1,by-14,Wd[2]); b.hl(x0+1,x1-1,by-13,Wd[4]); b.hl(x0+1,x1-1,by-12,Wd[3]); b.hl(x0,x1,by-11,Wd[4]); b.hl(x0,x1,by-10,Wd[1]); b.hl(x0+1,x1-1,by-9,Wd[0]);
  // Wangen
  [[x0+1,1],[x1-1,-1]].forEach(function(e){ var lx=e[0], s=e[1];
    b.line(lx+s,by-25,lx,by-19,I[1]); b.line(lx,by-19,lx,by-12,I[1]); b.px(lx+s,by-26,I[3]);
    b.line(lx,by-17,lx+s*3,by-17,I[2]); b.px(lx+s*3,by-16,I[1]);                     // Armlehne
    b.line(lx,by-10,lx-s,by-1,I[1]); b.line(lx+s,by-9,lx+s*3,by-1,I[1]); b.px(lx-s,by,I[0]); b.px(lx+s*3,by,I[0]);
    b.px(lx,by-12,I[3]); b.px(lx,by-15,I[3]); }); }
function bollard(b,cx,by,big){ var I=R('k1 m0 m1 m2 m3'), w=big?4:3, h=big?9:7;
  b.rect(cx-w,by-h,w*2+1,h,I[1]); b.vl(cx-w,by-h,by-1,I[3]); b.vl(cx-w+1,by-h,by-1,I[2]); b.vl(cx+w,by-h,by-1,I[0]);
  b.rect(cx-w-1,by-h-2,w*2+3,2,I[1]); b.hl(cx-w-1,cx+w+1,by-h-2,I[4]); b.hl(cx-w,cx,by-h-1,I[2]); b.rect(cx-w+1,by-h-4,w*2-1,2,I[1]); b.hl(cx-w+1,cx+w-1,by-h-4,I[3]);
  b.hl(cx-w,cx+w,by,P.s1); }
function bin(b,x,by){ b.rect(x,by-9,6,9,P.g2); b.vl(x,by-9,by-1,P.g4); b.vl(x+1,by-9,by-1,P.g3); b.vl(x+5,by-9,by-1,P.g1); b.hl(x-1,x+6,by-10,P.g1); b.hl(x,x+5,by-11,P.g3); b.hl(x,x+5,by,P.s1); }
// Café im November: Stühle hochgestellt oder gestapelt und angekettet, die Schirme zugebunden
function chairStack(b,x,by,n){ var k, top=by-8-n*2;
  for (k=0;k<n;k++){ var y=by-8-k*2; b.hl(x,x+6,y,k===n-1?P.w4:P.w3); b.hl(x,x+6,y+1,P.m0); }
  b.vl(x,by-7,by,P.m1); b.vl(x+6,by-7,by,P.m1); b.vl(x+1,by-6,by-1,P.m0); b.vl(x+5,by-6,by-1,P.m0); b.px(x-1,by,P.m1); b.px(x+7,by,P.m1);
  for (k=0;k<n;k++){ var ty=top-8+k*2; b.vl(x,ty,ty+2,P.m1); b.vl(x+6,ty,ty+2,P.m1); b.hl(x,x+6,ty,k===0?P.m2:P.m1); }
  b.vl(x,top-8,top,P.m1); b.vl(x+6,top-8,top,P.m1);
  for (var xx=x;xx<=x+6;xx+=2) b.px(xx,by-4,P.m3); b.px(x+3,by-3,P.y2); }
function parasol(b,ux,by,cover){ var C=cover?[P.m4,P.m3,P.m2]:[P.s6,P.s5,P.s3];
  b.vl(ux,by-33,by-1,P.m2); b.px(ux,by-34,P.m1);
  var prof=[1,2,3,3,4,4,4,4,3,3,3,3,2,2,2,2,1,1];
  prof.forEach(function(w,i){ var y=by-31+i; for (var k=0;k<w;k++){ var xx=ux-(w>>1)+k, c=(k===0)?C[0]:(k===w-1&&w>1?C[2]:C[1]); b.px(xx,y,c); } });
  b.hl(ux-1,ux+1,by-23,cover?P.m1:P.r2); b.rect(ux-3,by-2,7,2,P.m1); b.hl(ux-3,ux+3,by-2,P.m2); }
function cafe(b,x,by){
  // Tische mit hochgestellten Stühlen (Beine nach oben)
  [[x-5,by],[x+7,by+1]].forEach(function(p,j){ var tx=p[0], ty=p[1];
    b.hl(tx-4,tx+4,ty-9,P.s6); b.hl(tx-4,tx+4,ty-8,P.s3); b.vl(tx,ty-7,ty-1,P.m1); b.hl(tx-2,tx+2,ty,P.m1);
    b.hl(tx-3,tx+3,ty-10,P.w3); b.hl(tx-3,tx+3,ty-11,P.w4); b.vl(tx-3,ty-17,ty-12,P.m1); b.vl(tx+3,ty-17,ty-12,P.m1); b.vl(tx-1,ty-16,ty-12,P.m0); b.vl(tx+1,ty-16,ty-12,P.m0); });
  parasol(b,x+16,by+1,false); }
// Zeitungskiosk: grün lackiertes Blech, Zeitschriften im Fenster, Plakate an der Seite
function kiosk(b,x,by){ var w=18, x1=x+w-1, top=by-23, xx, yy;
  for (xx=x-1;xx<=x1+2;xx++) b.px(xx,by,P.s1);
  for (yy=top+5;yy<by;yy++) for (xx=x;xx<=x1;xx++){ var c=(xx===x)?P.g3:((xx>=x1-1)?P.g1:P.g2); if (yy>=by-3) c=M.DN[c]; if (yy===by-4) c=P.g3; b.px(xx,yy,c); }
  // Dach mit Überstand und Schild
  b.rect(x-2,top+1,w+4,4,P.g2); b.hl(x-2,x1+2,top+1,P.g3); b.hl(x-2,x1+2,top+4,P.g1); b.hl(x-1,x1+1,top+5,P.g0);
  b.rect(x+1,top+2,w-2,2,P.g1); b.hl(x+2,x1-2,top+2,P.y3); for (xx=x+3;xx<x1-2;xx+=3) b.px(xx,top+3,P.y4);
  b.hl(x+3,x1-3,top,P.m1); b.px(x+(w>>1),top-1,P.m2);
  // Fenster mit Zeitschriften und Zeitungen
  glass(b,x+2,top+7,w-5,8,'kiosk',0,function(xx,yy){ var gx=xx-x-2, gy=yy-top-7; if (gy===0) return P.k1; if (gy===4) return P.g1;
    var cell=Math.floor(gx/3)+(gy>4?7:0), t=hash(cell,13); if (gx%3===2) return P.k2; return [P.r2,P.s5,P.b1,P.y2,P.s4,P.t2,P.c2,P.s3][Math.floor(t*8)]; });
  b.hl(x+1,x1-2,top+15,P.s5); b.hl(x+1,x1-2,top+16,P.g1);
  // Plakate an der Seite
  b.rect(x1-1,top+7,2,10,P.g2); poster(b,x+2,top+17,4,3,P.s5,P.r3); poster(b,x+9,top+17,5,3,P.y4,P.k2); }

// ---------------------------------------------------------------- Fähre (seitlich, Bug links); put(x,y,c,licht)
function ferryShape(put,x,wy,L,lit,onlyLights){ var s=L/120, x1=x+L, hh=Math.max(3,Math.round(12*s)), d1=Math.max(2,Math.round(7*s)), d2=Math.max(2,Math.round(6*s)), ix, iy;
  function P2(xx,yy,c,raw){ if (onlyLights && !raw) return; put(xx,yy,c,raw); }
  for (iy=0;iy<hh;iy++){ var yy=wy-iy, xs=x+Math.round((hh-iy)*1.0*s+1), xe=x1-Math.round(iy<3?(3-iy)*s:0);
    for (ix=xs;ix<=xe;ix++){ var c=P.s5; if (iy<2) c=P.n1; else if (iy===2) c=P.r2; else if (iy===hh-1) c=P.s6; else if (iy===Math.round(hh*0.6)) c=P.b0; else if (ix>xe-2) c=P.s3; if (ix===xs&&iy>2) c=P.s6; P2(ix,yy,c); } }
  var top=wy-hh;
  if (L>60){ for (ix=x+Math.round(10*s);ix<x1-4;ix+=Math.round(6*s)){ P2(ix,wy-Math.round(hh*0.6)+2,lit?P.y3:P.s3,lit); } }
  var a0=x+Math.round(14*s), a1=x1-Math.round(5*s), per=Math.max(2,Math.round(4*s));
  for (iy=0;iy<d1;iy++) for (ix=a0;ix<=a1;ix++){ var w1=(iy===Math.floor(d1/2)||(d1>4&&iy===Math.floor(d1/2)-1))&&((ix-a0)%per<per-1); if (iy===d1-1) P2(ix,top-1-iy,P.s6); else if (w1) P2(ix,top-1-iy,lit?(hash(ix,iy)<0.75?P.y4:P.y3):P.n1,lit); else P2(ix,top-1-iy,(ix===a0)?P.s6:P.s5); }
  var b0=x+Math.round(24*s), b1=x1-Math.round(22*s), t2=top-d1;
  for (iy=0;iy<d2;iy++) for (ix=b0;ix<=b1;ix++){ var w2=(iy===Math.floor(d2/2))&&((ix-b0)%per<per-1); if (iy===d2-1) P2(ix,t2-1-iy,P.s6); else if (w2) P2(ix,t2-1-iy,lit?(hash(ix,iy+5)<0.6?P.y4:P.y2):P.n1,lit); else P2(ix,t2-1-iy,(ix===b0)?P.s6:P.s5); }
  var t3=t2-d2, br0=x+Math.round(24*s), br1=x+Math.round(48*s), bh=Math.max(2,Math.round(5*s));
  for (iy=0;iy<bh;iy++) for (ix=br0;ix<=br1;ix++){ var wb=(iy===bh-2)&&(ix%2===0); P2(ix,t3-1-iy,wb?(lit?P.y3:P.k2):(iy===bh-1?P.s6:P.s5),wb&&lit); }
  var f0=x+Math.round(72*s), f1=x+Math.round(82*s), fh=Math.max(3,Math.round(12*s));
  for (iy=0;iy<fh;iy++) for (ix=f0+Math.round(iy*0.3);ix<=f1+Math.round(iy*0.3);ix++){ var c4=(ix>f1+Math.round(iy*0.3)-2)?P.s3:P.s5; if (iy>fh-3) c4=P.k2; else if (iy>fh-6&&iy<fh-3) c4=P.b0; P2(ix,t3-iy,c4); }
  var mx=x+Math.round(40*s), mh=Math.round(10*s); for (iy=0;iy<mh;iy++) P2(mx,t3-bh-iy,P.m2);
  if (lit){ P2(mx,t3-bh-mh,P.l1,true); P2(x+Math.round(5*s)+1,wy-hh+1,P.g5,true); P2(x1-1,wy-hh-1,P.r4,true); }
  return {top:t3-fh, x0:x, x1:x1}; }

// Schiffe am Fährterminal und im Becken (Bug links). Weiße Rümpfe, keine Schrift, keine Reedereifarben. Fensterpunkte für die Nacht in FWIN.
function carFerry(b,x,wy,L){ var x1=x+L-1, i, j, r;
  // Rumpf: schräger Steven, senkrechtes Heck mit hochgeklappter Rampe
  for (r=0;r<6;r++){ var y=wy-r, xs=x+Math.max(0,5-r)+(r===0?1:0); for (i=xs;i<=x1;i++){ var c=(r===0)?P.n0:(r===1?P.b0:(r===2?P.c2:(r===5?P.s6:P.s5))); if (i===x1&&r>1) c=P.s3; if (i===xs&&r>2) c=P.s6; b.px(i,y,c); } }
  for (i=x+10;i<x1-3;i+=4) b.px(i,wy-4,P.s3);
  b.vl(x1+1,wy-10,wy-3,P.m2); b.px(x1+1,wy-11,P.m1);
  // Deck 1 und 2 mit Fensterreihen, Rettungsboote
  for (j=6;j<=9;j++) for (i=x+7+(j===9?1:0);i<=x1-3;i++) b.px(i,wy-j,(j===9)?P.s6:(i>=x1-4?P.s4:P.s5));
  for (i=x+9;i<x1-5;i+=2){ b.px(i,wy-8,P.n1); FWIN.push([i,wy-8]); }
  for (i=x+10;i<x1-6;i+=3){ b.px(i,wy-6,P.s3); FWIN.push([i,wy-6]); }
  b.hl(x+13,x+16,wy-10,P.t4); b.hl(x1-19,x1-16,wy-10,P.t4); b.px(x+16,wy-10,P.t3); b.px(x1-16,wy-10,P.t3);
  for (j=10;j<=12;j++) for (i=x+19;i<=x1-11;i++) b.px(i,wy-j,(j===12)?P.s6:(i>=x1-12?P.s4:P.s5));
  for (i=x+21;i<x1-12;i+=2){ b.px(i,wy-11,P.n1); FWIN.push([i,wy-11]); }
  // Brücke weit vorn, Mast, Schornstein
  for (i=x+8;i<=x+19;i++){ b.px(i,wy-10,P.s5); b.px(i,wy-11,P.s5); b.px(i,wy-12,P.s6); } b.hl(x+7,x+20,wy-12,P.s6);
  for (i=x+9;i<=x+18;i+=2){ b.px(i,wy-11,P.k2); FWIN.push([i,wy-11]); }
  b.vl(x+14,wy-17,wy-13,P.m2); b.hl(x+13,x+15,wy-16,P.m2);
  var f0=x1-16; b.rect(f0,wy-16,4,4,P.s5); b.vl(f0+3,wy-16,wy-13,P.s3); b.hl(f0,f0+3,wy-16,P.k2); b.hl(f0,f0+3,wy-14,P.c2);
  FWIN.push([x+14,wy-18,P.l1],[x+6,wy-4,P.g5],[x1,wy-6,P.r4]); }
function catamaran(b,x,wy,L){ var x1=x+L-1, i, j;
  for (i=x+1;i<=x1;i++){ b.px(i,wy,P.n0); b.px(i,wy-1,P.c2); b.px(i,wy-2,P.s5); b.px(i,wy-3,P.s6); } b.px(x,wy-3,P.s6);
  for (j=4;j<=8;j++) for (i=x+2+(j-4);i<=x1-(j>6?2:1);i++){ var c=(j===8)?P.s6:P.s5; if (j===5||j===6) c=((i-x)%4===0)?P.s4:P.k2; b.px(i,wy-j,c); }
  for (i=x+7;i<x1-2;i+=2) FWIN.push([i,wy-6]);
  for (i=x+7;i<=x+15;i++){ b.px(i,wy-9,P.s5); b.px(i,wy-10,P.s6); } for (i=x+8;i<=x+14;i+=2){ b.px(i,wy-9,P.k2); FWIN.push([i,wy-9]); }
  b.vl(x+13,wy-13,wy-11,P.m2); FWIN.push([x+13,wy-14,P.l1],[x1,wy-4,P.r4]); }
// Segeljacht im Winterlager: Segel aufgetucht unter der Persenning
function yacht(b,x,wy){ var i;
  for (i=x+2;i<x+14;i++) b.px(i,wy,P.n1); for (i=x+1;i<=x+14;i++) b.px(i,wy-1,P.s4); for (i=x;i<=x+14;i++) b.px(i,wy-2,P.s6); b.px(x+14,wy-1,P.s3);
  b.hl(x+5,x+10,wy-3,P.s5); b.px(x+6,wy-3,P.n1); b.px(x+8,wy-3,P.n1); b.hl(x+6,x+9,wy-4,P.s6);
  b.vl(x+6,wy-17,wy-4,P.m3); b.hl(x+6,x+12,wy-6,P.m2); b.hl(x+7,x+12,wy-7,P.c3); b.hl(x+7,x+11,wy-8,P.c2);
  for (i=0;i<=15;i+=2){ b.px(Math.round(x+6-i*6/15),wy-17+i,P.m3); } FWIN.push([x+6,wy-18,P.l1]); }
// kleines Fischerboot (pasara) mit Persenning über dem Bug und Außenborder
function pasara(b,x,wy,L,col){ var i, x1=x+L-1;
  for (i=x+1;i<x1;i++) b.px(i,wy,P.n1); for (i=x+1;i<=x1;i++) b.px(i,wy-1,P.s4); for (i=x;i<=x1;i++){ b.px(i,wy-2,P.s5); b.px(i,wy-3,col); } b.px(x,wy-4,col); b.px(x+1,wy-4,col);
  b.hl(x+2,x+6,wy-4,P.s3); b.hl(x+3,x+5,wy-5,P.s4); b.px(x+6,wy-4,P.s2);
  b.vl(x1+1,wy-3,wy-1,P.m1); b.px(x1+1,wy-4,P.m2); b.vl(x1-4,wy-8,wy-4,P.w2); FWIN.push([x1-4,wy-9,P.y4]); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=track(new M.Buf(W,H,P.k0)), wea=M.scn.weather(GS), night=tod==='night', dusk=tod==='dusk', x, y;
  FAR.fill(0); WM.fill(0); OBJ.fill(0); WIN.length=0; FWIN.length=0; LIT.tod=tod; LIT.wea=wea;
  b.code=1; paintSky(b,tod,wea);
  b.code=2; paintMountains(b,tod,wea); paintIslands(b,tod,wea);
  paintWater(b,tod,wea);
  b.code=0;
  // Ferne: Wellenbrecher mit Leuchtfeuer, Fähren am Terminal
  b.ocode=2;
  for (x=444;x<566;x++){ b.px(x,85,P.s4); b.px(x,86,P.s2); } b.rect(561,78,3,7,P.s5); b.vl(561,78,84,P.s6); b.px(562,77,P.g4); b.px(562,76,P.m1);
  catamaran(b,508,87,32); carFerry(b,449,91,56);
  // im Becken: Jacht im Winterlager, ein Fischerboot
  yacht(b,414,94); pasara(b,433,99,15,P.b1);
  b.ocode=0;
  b.ocode=1; tower(b,tod); b.ocode=0;
  palace(b,tod);
  for (y=40;y<PB;y++){ b.px(PAL1,y,y<50?P.s2:P.s1); b.px(PAL1+1,y,y<50?P.s1:P.s0); }
  office(b,tod);
  parapet(b);
  pavement(b,tod,wea);
  mole(b,tod,wea);
  cafe(b,46,104); chairStack(b,11,104,3); parasol(b,21,104,true); kiosk(b,180,106); bin(b,138,107); bin(b,250,107); bin(b,486,110);
  var wind=wea==='bura'?1:0;
  PALMS.forEach(function(p){ palm(b,p.x,104,p.h,{seed:p.s,wind:wind,lean:p.x>300?-2:2}); });
  LAMPS.forEach(function(lx){ lamp(b,lx,LB,LH); });
  bench(b,BENCH[0],BENCH[1],108); bench(b,BENCH2[0],BENCH2[1],108); bench(b,MBENCH[0],MBENCH[1],108);
  bollard(b,456,107,false); bollard(b,IBOL,108,true);
  // Tau vom Poller ins Wasser
  b.line(IBOL+4,101,IBOL+12,104,P.e2); b.px(IBOL+3,101,P.e3);
  // Rettungsring am Pfosten
  b.rect(RING-1,95,3,13,P.w2); b.vl(RING-1,95,107,P.w3); b.hl(RING-1,RING+1,94,P.w3);
  b.ellipse(RING+0.5,100.5,4.2,4.2,function(x,y){ var dx=x+0.5-RING-0.5, dy=y+0.5-100.5, d=Math.hypot(dx,dy); if (d<2.1) return undefined; var a=Math.atan2(dy,dx), band=(Math.floor((a+3.1416)/0.785)%2)===0; return band?(dy<0?P.s6:P.s4):(dy<0?P.r4:P.r2); });
  if (wea==='rain') PUD.forEach(function(q){ b.ellipse(q[0],q[1],q[2],q[3],function(x,y){ var e=(y<q[1]-q[3]*0.4)?P.s4:(bayer(x,y)<0.3?P.s1:P.s2); return e; }); });
  lamp(b,MLAMP,MLB,MLH);
  b.rect(MX1-5,MF-6,3,6,P.s5); b.vl(MX1-5,MF-6,MF-1,P.s6); b.px(MX1-4,MF-7,P.g3); b.px(MX1-4,MF-8,P.m1);
  // Flagge (statischer Stand; bewegt sich in dynamic)
  if (wea!=='bura') flag(b,FLAG[0],FLAG[1],0,wea);
  // ---- Licht (Tag): Schatten der Palmen auf Fassade und Pflaster
  if (tod==='day') dayShadows(b);
  var pre=b.clone(), out;
  if (wea==='rain' && tod==='dusk'){ out=M.finishTOD(b,tod,{ sky:function(){ return true; } }); for (var k0=0;k0<W*H;k0++){ if (FAR[k0]===0) out.d[k0]=M.tintPx(RAINDUSK,out.d[k0],k0%W,(k0/W)|0); } }
  else out=M.finishTOD(b,tod,{ sky:function(x,y){ return FAR[y*W+x]>0; } });
  if (tod==='dusk' && wea!=='rain'){ var NT=M.TINT.night; for (var k=0;k<W*H;k++){ if (OBJ[k]===2) out.d[k]=M.UP[M.tintPx(NT,pre.d[k],k%W,(k/W)|0)]; } }
  if (tod!=='day') nightLights(out,pre,tod,wea);
  return out; }
function dayShadows(b){ var m=new Uint8Array(W*H), tmp={px:function(x,y){ x|=0; y|=0; if (x>=0&&y>=0&&x<W&&y<H) m[y*W+x]=1; },rect:function(){},hl:function(){},vl:function(){},line:function(){},ellipse:function(){},poly:function(){}};
  PALMS.forEach(function(p){ palm(tmp,p.x,104,p.h,{seed:p.s,wind:1,lean:p.x>300?-2:2}); });
  var DX=13, DY=10; LAMPS.forEach(function(lx){ for (var yy=LB-LH-14;yy<LB-LH;yy++) for (var xx=lx-4;xx<=lx+5;xx++) m[yy*W+xx]=1; });
  PALMS.forEach(function(p){ for (var yy=104-p.h+5;yy<=104;yy++) for (var xx=p.x-6;xx<=p.x+6;xx++) m[yy*W+xx]=0; });
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ if (!m[y*W+x]) continue; var sx=x+DX, sy=y+DY; if (sx>=W||sy>=PB) continue; var k=sy*W+sx; if (FAR[k]!==0 || m[k]) continue; if (WM[k]) continue; b.d[k]=M.DN[M.DN[b.d[k]]]; }
  // Laternen und Stämme werfen kurze Schatten aufs Pflaster
  PALMS.concat(LAMPS.map(function(l){ return {x:l}; })).forEach(function(p){ for (var k=0;k<12;k++){ var sx=p.x+1+Math.round(k*0.9), sy=103-Math.round(k*0.25); for (var w=0;w<2;w++){ var kk=sy*W+sx+w; if (FAR[kk]===0 && !m[kk]) b.d[kk]=M.DN[b.d[kk]]; } } }); }
// Flagge: x,y = Spitze der Stange; ph = Wehen
function flag(b,x,y,ph,wea){ var bura=wea==='bura', calm=wea==='calm';
  for (var i=0;i<11;i++) for (var j=0;j<7;j++){ var w=bura?Math.round(Math.sin(i*0.9-ph*9)*1.2):0, droop=calm?Math.round(i*0.55):(wea==='rain'?Math.round(i*0.8):0);
    var xx=x+1+(calm?Math.round(i*0.5):i), yy=y+j+w+droop; var c=j<2?P.r3:(j<5?P.s6:P.b1); if (calm && i>3) xx=x+1+Math.round(i*0.4); if (j>=2&&j<5&&i>=3&&i<=5&&j<4) c=((i+j)%2)?P.r3:P.s6; b.px(xx,yy,c); } }

// ---------------------------------------------------------------- Lichter bei Dämmerung und Nacht
var LAMPT=M.TINT.lamp;
var RAINDUSK=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.5+L*0.2+14, g*0.46+L*0.22+10, b*0.58+L*0.22+26]; });
// angestrahlter Stein: warm, aber mit voller Helligkeitsstaffel (Bögen bleiben dunkel)
var FLOOD=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*1.06+14, L*0.84+2, L*0.42-6]; });
// warme Lichtinsel: Kern hell, Körper warm, schmaler geditherter Rand
function pool(out,pre,cx,cy,rx,ry,amt,mask){ var y0=Math.max(0,Math.floor(cy-ry)), y1=Math.min(H-1,Math.ceil(cy+ry)), x0=Math.max(0,Math.floor(cx-rx)), x1=Math.min(W-1,Math.ceil(cx+rx));
  for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var k=y*W+x; if (FAR[k]!==0 || WM[k]) continue; if (mask && !mask(x,y)) continue; var dx=(x-cx)/rx, dy=(y-cy)/ry, q=1-dx*dx-dy*dy; if (q<=0) continue;
    var L=clamp(q/0.22,0,1); if (L<1 && bayer(x,y)>=L) continue;
    var c=M.tintPx(LAMPT,pre.d[k],x,y), dn=M.qd((0.55-q)*2.2*amt,x,y), up=M.qd((q-0.78)*4*amt,x,y);
    while (dn>0){ c=M.DN[c]; dn--; } while (up>0){ c=M.UP[c]; up--; } out.d[k]=c; } }
// Lichthof: hellt die vorhandenen (schon umgefärbten) Farben auf, ohne Farbton zu wechseln
function halo(out,cx,cy,rx,ry,amt,mask){ for (var y=Math.max(0,Math.floor(cy-ry));y<=Math.min(H-1,cy+ry);y++) for (var x=Math.max(0,Math.floor(cx-rx));x<=Math.min(W-1,cx+rx);x++){ var k=y*W+x; if (FAR[k]!==0||WM[k]) continue; if (mask && !mask(x,y)) continue;
    var dx=(x-cx)/rx, dy=(y-cy)/ry, q=1-dx*dx-dy*dy; if (q<=0) continue; var up=M.qd(q*amt,x,y), c=out.d[k]; while (up>0){ c=M.UP[c]; up--; } out.d[k]=c; } }
function nightLights(b,pre,tod,wea){ var n=tod==='night', rain=wea==='rain', x, y;
  // Lichtinseln der Laternen auf dem Pflaster, Lichthöfe an der Wand dahinter
  var wallM=function(x,y){ return y<PB; };
  LAMPS.forEach(function(lx){ pool(b,pre,lx,LB+5,25,9,1); halo(b,lx,LB-LH-8,18,26,n?1.6:1.0,wallM); pool(b,pre,lx,LB-LH-7,7,9,1,wallM); });
  pool(b,pre,MLAMP,MLB+3,24,8,1); halo(b,MLAMP,MLB-MLH-8,14,20,1.4);
  halo(b,ODOOR[0]-14,ODOOR[1]-2,14,18,1.4,wallM); pool(b,pre,ODOOR[0]-14,ODOOR[1]-3,6,7,1,wallM);
  // Läden werfen warmes Licht aufs Pflaster (abends offen)
  SHOPS.forEach(function(s,i){ if (!shopLit(i,n)) return; pool(b,pre,(s[0]+s[1])/2,102,(s[1]-s[0])*0.55,5,0.7); });
  // Fenster
  WIN.forEach(function(w,id){ var on, cold=(w.k==='office'||w.k==='door'||w.k==='fan');
    if (w.k==='shop') on=shopLit(w.s,n); else if (w.k==='kiosk') on=!n; else if (cold||w.k==='gate'||w.k==='hang') on=true; else on=hash(w.x,w.y)<(n?0.32:0.5);
    if (!on) return;
    for (var yy=w.y;yy<w.y+w.h;yy++) for (var xx=w.x;xx<w.x+w.w;xx++){ var k=yy*W+xx; if (WM[k]!==id+1) continue; var c0=pre.d[k], c;
      var dark=(c0===P.k2||c0===P.k1||c0===P.n1||c0===P.n0||c0===P.s0||c0===P.s1);
      if (cold){ c=dark?((yy-w.y)<w.h*0.45?(bayer(xx,yy)<0.4?P.s6:P.a6):(bayer(xx,yy)<0.5?P.a6:P.a5)):(c0===P.s4?P.a4:P.n1); }
      else if (w.k==='shop'){ var gy=(yy-w.y)/w.h; c=dark?ra(R('y2 y3 y4 y5'),0.95-gy*0.8,xx,yy):M.DN[M.tintPx(LAMPT,c0,xx,yy)]; if (c0===P.w1||c0===P.w0) c=P.w1; }
      else if (w.k==='gate') c=dark?ra(R('y1 y2 y3'),0.8-(yy-w.y)/w.h*0.5,xx,yy):c0;
      else if (w.k==='hang') c=(yy===w.y)?P.y5:P.y4;
      else if (w.k==='kiosk') c=dark?P.y2:M.UP[M.tintPx(LAMPT,c0,xx,yy)];
      else c=dark?((yy===w.y)?P.y3:(bayer(xx,yy)<0.3?P.y5:P.y4)):M.tintPx(LAMPT,c0,xx,yy);
      b.d[k]=c; } });
  // Glockenturm: angestrahlt (nachts), Abendlicht (Dämmerung)
  if (n){ for (y=0;y<60;y++) for (x=TWX-16;x<=TWX+16;x++){ var k=y*W+x; if (FAR[k]!==0||OBJ[k]!==1) continue; var c0=pre.d[k]; var c=M.tintPx(FLOOD,c0,x,y), dn=M.qd((50-y)/50*1.3,x,y); while (dn>0){ c=M.DN[c]; dn--; } b.d[k]=c; } }
  // Palastfront: schwache Bodenstrahler am Gurtgesims hellen die Galerie auf (nur nachts, ohne den Farbton zu ändern)
  if (n) COLS.forEach(function(c,ci){ if (ci%2===0) halo(b,c+0.5,SY,7,19,1.3,function(x,y){ return x<PAL1 && y>=GY0 && y<SY; }); });
  // Laternenglas
  LAMPS.forEach(function(lx){ lampGlass(b,lx,LB,LH,P.y4,P.y5); }); lampGlass(b,MLAMP,MLB,MLH,P.y4,P.y5);
  // Fähren in der Ferne: Fensterlichter
  FWIN.forEach(function(p,i){ if (p[2]!==undefined) b.px(p[0],p[1],p[2]); else if (hash(p[0],p[1])<0.78) b.px(p[0],p[1],(i%4)?P.y4:P.y3); });
  // Supetar auf Brač, Leuchtfeuer
  for (var k2=0;k2<11;k2++){ var sx=512+k2*3+(k2%3), sy=HZ-1-(k2%2); if (FAR[sy*W+sx]===2) b.px(sx,sy,k2%3?P.y3:P.y4); }
  b.px(MX1-4,MF-7,P.g5); b.px(562,77,P.g5);
  // nasses Pflaster: Spiegelungen der Laternen und Läden
  var refl=function(cx,y0,y1,wd,cA,cB){ for (var yy=y0;yy<y1;yy++){ var fade=(yy-y0)/(y1-y0); for (var xx=Math.round(cx-wd);xx<=Math.round(cx+wd);xx++){ var k=yy*W+xx; if (FAR[k]!==0||WM[k]) continue; var e=Math.abs(xx-cx)/wd; if (hash(xx*3,yy)<fade*0.7+e*0.5) continue; if ((yy+Math.floor(hash(yy,xx>>2)*3))%3===0) continue; b.d[k]=e<0.4?cA:cB; } } };
  if (rain){ LAMPS.forEach(function(lx){ refl(lx+0.5,108,134,2.5,P.y4,P.y2); }); refl(MLAMP+0.5,112,125,2.5,P.y4,P.y2);
    SHOPS.forEach(function(s,i){ if (!shopLit(i,n)) return; refl((s[0]+s[1])/2,101,116,(s[1]-s[0])*0.35,P.y3,P.y1); });
    refl(GC+0.5,101,113,2.5,P.y3,P.y1); if (!n) refl(189,107,117,3.5,P.y3,P.y1); }
  else if (!n){ LAMPS.forEach(function(lx){ refl(lx+0.5,108,122,1.5,P.y3,P.t3); }); } }

// ---------------------------------------------------------------- Vordergrund-Ebenen
function layers(S,GS,tod){ var L=[];
  function pol(x,by,big){ var l=M.layer(x-6,by-14,13,16,by), w=M.lw(l); bollard(w,x,by,big); if (tod!=='day') M.tintApply(l,M.TINT[tod]); L.push(l); }
  [104,232,360].forEach(function(x){ pol(x,QY+1,true); });
  [432,490,548].forEach(function(x){ pol(x,MF+1,false); });
  return L; }

// ---------------------------------------------------------------- jedes Bild: Wasser, Spiegelungen, Fähre, Möwen, Flagge
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=LIT.tod, wea=LIT.wea, rmp=wramp(tod,wea), x, y, sx;
  for (y=HZ;y<H;y++){ var row=y*W; for (sx=0;sx<320;sx++){ x=sx+cam; if (x<0||x>=W) continue; var k=FAR[row+x]; if (k<3) continue; fb.d[y*320+sx]=wcol(x,y,t,k,tod,wea,rmp); } }
  if (tod!=='day'){
    LAMPS.forEach(function(lx){ gl(fb,lx+0.5,FW,H,3,t,P.y4,P.y2,cam,0.2); }); gl(fb,MLAMP+0.5,MW,H,6,t,P.y4,P.y2,cam,0.15);
    if (tod==='night' && wea!=='rain'){ gl(fb,MOONX+0.5,HZ+1,MB+1,17,t,P.n5,P.n4,cam,0.0); gl(fb,MOONX+0.5,HZ+1,MB+1,7,t,P.l1,P.n5,cam,0.1); gl(fb,MOONX+0.5,MW,H,20,t,P.n5,P.n3,cam,0.15); }
    gl(fb,526,HZ,HZ+10,2,t,P.y4,P.y2,cam,0.4);
  } else if (wea!=='rain'){ gl(fb,560,HZ+1,MB+1,7,t,P.s6,P.a6,cam,0.45); }
  if (tod==='dusk' && wea!=='rain') gl(fb,562,HZ+1,MB+1,9,t,P.d6,P.d5,cam,0.3);
  if (tod==='day') M.scn.gulls(fb,t,300,10,340,30,4,cam);
  if (tod==='day' && wea!=='rain') pigeons(fb,t,cam);
  if (wea==='rain') rainRings(fb,t,cam);
  if (S && S.ferryAt && v.gt>=S.ferryAt) ferry(fb,v,S);
  // Flagge
  var fx=FLAG[0]-cam; if (fx>-14 && fx<330) flagFb(fb,v,cam);
  // Gischt an der Molenspitze bei Bura
  if (wea==='bura'){ var ph=(t*0.55)%1; if (ph<0.35){ var a=ph/0.35; for (var i=0;i<14;i++){ var sx2=Math.round(MX1-8+hash(i,1)*12-cam), sy2=Math.round(MW-2-a*14*hash(i,2)-Math.sin(a*3.14)*6); if (sx2>=0&&sx2<320&&sy2>=0&&sy2<H && hash(i,3)>a*0.8) fb.d[sy2*320+sx2]=(tod==='night'?P.n4:P.s6); } } }
  if (tod!=='day'){ LAMPS.forEach(function(lx){ M.glow(fb,lx-cam+0.5,LB-LH-7,9,t,0.45); }); M.glow(fb,MLAMP-cam+0.5,MLB-MLH-7,11,t,0.5); }
}
// Tauben auf dem Pflaster (nur am Tag), picken
var PIG=[[182,121],[189,123],[262,126],[270,124],[121,129]];
function pigeons(fb,t,cam){ PIG.forEach(function(p,i){ var sx=p[0]-cam, y=p[1]; if (sx<2||sx>316) return; var peck=Math.sin(t*2.3+i*1.7)>0.55, f=(i%2)?1:-1, hop=Math.floor((t*0.15+hash(i,4))%1*6)===0?1:0; sx+=hop*f;
  fb.px(sx,y,P.m2); fb.px(sx+f,y,P.m2); fb.px(sx-f,y,P.m3); fb.px(sx,y-1,P.m3); fb.px(sx-f,y-1,P.m4); fb.px(sx-2*f,y,P.m1);
  if (peck){ fb.px(sx+2*f,y,P.m1); fb.px(sx+2*f,y+1,P.e2); } else { fb.px(sx+f,y-1,P.g3); fb.px(sx+2*f,y-2,P.m1); fb.px(sx+3*f,y-2,P.e2); }
  fb.px(sx,y+1,P.t3); }); }
// Regen: Ringe in Pfützen und Tropfen auf dem Wasser
function rainRings(fb,t,cam){ PUD.forEach(function(q,i){ for (var j=0;j<2;j++){ var ph=(t*0.9+hash(i,j*5+1))%1, n=Math.floor(t*0.9+hash(i,j*5+1)), rx=q[0]+(hash(i*7+n,j)-0.5)*q[2]*1.2, ry=q[1]+(hash(i+n,j*3)-0.5)*q[3]; var r=1+ph*3, sx=Math.round(rx-cam);
    [[-r,0],[r,0],[-r*0.6,-0.6],[r*0.6,-0.6],[-r*0.6,0.6],[r*0.6,0.6]].forEach(function(o){ var xx=Math.round(sx+o[0]), yy=Math.round(ry+o[1]); if (xx<0||xx>=320||yy<0||yy>=H) return; var k=yy*320+xx; fb.d[k]=M.UP[fb.d[k]]; }); } });
  for (var i2=0;i2<36;i2++){ var n2=Math.floor(t*6+hash(i2,9)), x=Math.floor(hash(i2,n2)*320), y=HZ+Math.floor(hash(n2,i2)*(H-HZ)); if (FAR[y*W+x+cam]<3) continue; var k2=y*320+x; fb.d[k2]=M.UP[M.UP[fb.d[k2]]]; if (x+1<320) fb.d[k2+1]=M.UP[fb.d[k2+1]]; } }
// Lichtpfad auf dem Wasser: dieselben Wellenkämme, innerhalb eines nach vorn breiter werdenden Bandes
function gl(fb,cx,y0,y1,spread,t,c1,c2,cam,thr){ var bura=LIT.wea==='bura'; thr=thr===undefined?0.35:thr;
  for (var y=y0;y<y1;y++){ var k=(y-y0)/(y1-y0+1), half=1+spread*k; for (var x=Math.floor(cx-half);x<=cx+half;x++){ var sx=x-cam; if (sx<0||sx>=320||x<0||x>=W) continue; var kind=FAR[y*W+x]; if (kind<3) continue;
    var e=Math.abs(x-cx)/half, cr=wsig(x,y,t,kind,bura)+0.3*WS2; if (cr>thr+e*0.75) fb.d[y*320+sx]=(e<0.4 && cr>thr+0.35)?c1:c2; } } }
function flagFb(fb,v,cam){ var tod=LIT.tod, tint=M.TINT[tod]; var tmp={px:function(x,y,c){ var sx=x-cam; if (sx<0||sx>=320||y<0||y>=H) return; fb.d[y*320+sx]=(tod==='day'||!tint)?c:M.tintPx(tint,c,x,y); }};
  // nur bei Wind: die Flagge wird jedes Bild neu gezeichnet (im Hintergrundbild fehlt sie dann)
  if (LIT.wea==='bura') flag(tmp,FLAG[0],FLAG[1],v.t,LIT.wea); }
function ferry(fb,v,S){ var ft=(v.gt-S.ferryAt)/1000, T0=24, e=clamp(ft/T0,0,1), p=1-Math.pow(1-e,3), x=Math.round(700+(FERRY_END-700)*p), cam=v.cam, tod=LIT.tod, lit=tod!=='day', tint=M.TINT[tod];
  if (tod==='dusk' && LIT.wea!=='rain') tint=M.TINT.night;
  function put(wx,wy,c,raw){ var sx=wx-cam; if (sx<0||sx>=320||wy<0||wy>=H||wx<0||wx>=W) return; var kk=wy*W+wx, f=FAR[kk]; if (f===4 || (f===0 && OBJ[kk]!==2)) return; var cc=(raw||tod==='day'||!tint)?c:M.tintPx(tint,c,wx,wy); if (!raw && tod==='dusk') cc=M.UP[cc]; fb.d[wy*320+sx]=cc; }
  var sh=ferryShape(put,x,MB-2,124,lit);
  for (var yy=MB-1;yy<=MB;yy++) for (var xx=sh.x0+4;xx<sh.x1;xx++){ var sxx=xx-cam; if (sxx<0||sxx>=320) continue; if (FAR[yy*W+xx]!==3) continue; if (((xx+yy)&1)===0) fb.d[yy*320+sxx]=lit?(hash(xx,1)<0.35?P.y3:P.n0):P.a2; }
  if (e<1){ var foam=(1-e); for (var q=0;q<Math.round(16*foam)+3;q++){ var wx2=sh.x0+1-q, wy2=MB-1-((q+Math.floor(v.t*9))%2); put(wx2,wy2,lit?P.n4:P.s6,true); } } }

// ---------------------------------------------------------------- nur in Malas Sicht: die Spur, die Ivka 27 Jahre lang gegangen ist
function ghost(fb,v,S,GS){ var cam=v.cam, t=v.t;
  for (var i=0;i<38;i++){ var wx=338+i*6.6, side=(i%2)?1:-1, wy=Math.round((wx<MX0?119-(wx-338)*0.07:114.5)+side*1.2), sx=Math.round(wx-cam); if (sx<0||sx>=318) continue;
    var wave=(Math.sin(i*0.33-t*1.8)+1)/2, c=wave>0.82?P.x6:(wave>0.5?P.x5:P.x4); if (wave<0.25 && (i%3)) continue;
    fb.px(sx,wy,c); fb.px(sx+1,wy,wave>0.6?P.x5:P.x3); }
  var bx=IBOL-cam; if (bx>-14 && bx<334){ var a=0.55+Math.sin(t*1.2)*0.25;
    for (var y=92;y<112;y++) for (var x=bx-5;x<=bx+9;x++){ if (x<0||x>=320) continue; var d=Math.hypot((x-bx)/9,(y-102)/9); if (d<1 && bayer(x,y)<(1-d)*a){ var k=y*320+x; fb.d[k]=M.UP[M.UP[fb.d[k]]]; } }
    for (var j=0;j<7;j++){ var ph=(t*0.35+hash(j,3))%1, px=Math.round(bx+(hash(j,5)-0.5)*12+Math.sin(t*1.5+j)*1.5), py=Math.round(106-ph*26); if (px<0||px>=320) continue; fb.px(px,py,ph<0.6?P.x6:P.x4); } } }

// ---------------------------------------------------------------- über allem: Regen, Bura
function front(fb,v,S,GS){ var wea=LIT.wea;
  if (wea==='rain') M.rain(fb,v.t,{n:90,col:P.m3,col2:P.m4,speed:260,slant:0.25});
  if (wea==='bura') M.scn.buraDebris(fb,v.t,108,138,v.cam); }

// ---------------------------------------------------------------- Laufflächen, Hotspots
function walk(x,y){ if (x>6 && x<MX0 && y>=108 && y<=134) return true; if (x>=MX0 && x<620 && y>=108 && y<=124) return true; return false; }
M.defineArt('riva',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{ exit:[0,96,9,44], palace:[0,36,246,64], belltower:[TWX-14,0,29,50], palms:[84,36,44,70], bench:[BENCH[0]-2,80,BENCH[1]-BENCH[0]+5,30],
    lamp:[LAMPS[1]-6,44,13,62], office:[OF0,0,OF1-OF0,100], office_door:[ODOOR[0]-4,ODOOR[1]-8,ODOOR[2]+8,ODOOR[3]+8],
    sea:[338,76,302,68], ferries:[448,72,92,20], mole:[MX0,MB-2,MX1-MX0,MW-MB+2], bollard:[IBOL-7,94,15,15],
    mole_lamp:[MLAMP-6,MLB-MLH-17,13,MLH+17], mole_bench:[MBENCH[0]-2,80,MBENCH[1]-MBENCH[0]+5,30], islands:[386,62,254,14] },
  stands:{ exit:[10,120,'L'], palace:[100,112,'B'], belltower:[TWX,112,'B'], palms:[106,112,'B'], bench:[160,112,'B'], lamp:[136,112,'B'],
    office:[292,114,'B'], office_door:[292,110,'B'], sea:[300,132,'F'], ferries:[480,112,'B'], mole:[440,116,'R'], bollard:[598,112,'R'],
    mole_lamp:[612,118,'R'], mole_bench:[513,112,'B'], islands:[560,112,'B'] },
  actorPos:{ ivka:[596,114,'R'], mala:[560,116,'R'] },
  start:[60,122,'R'], entries:{ map:[12,122,'R'], office:[292,112,'F'] }
});
})(M);
