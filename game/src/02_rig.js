/* ===== 02_rig.js — das Figuren-Rig: Kopf-Stempel + erzeugte Torsi + Glieder fester Länge (IK), Posen-Bibliothek =====
   Maße (Seitenansicht, px über dem Boden): Schuh 0–2, Knöchel 2, Knie 12, Hüfte 23, Schulter 35, Kinn 37, Scheitel ~50.
   Oberschenkel 11, Schienbein 10, Oberarm 9, Unterarm 8 (je Figur änderbar). */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf, bayer=M.bayer;
var SW=64, SHH=86, OX=32, OY=80;
M.SPR={W:SW,H:SHH,OX:OX,OY:OY};
var CH={}; M.CHARS=CH;
var DN=M.DN, UP=M.UP;

// ---------------------------------------------------------------- Posenpuffer mit Teilekarte
// Jeder Pixel merkt sich, zu welchem Körperteil er gehört (b.id). Damit setzt render() nach dem Zeichnen Schatten dort, wo Teile übereinander
// liegen (Arm vor dem Körper, Saum über der Hose, Kinn über dem Kragen), und ein Oberlicht auf Schultern und Ärmel. Nach dem Umriss wird die
// Karte verworfen; im Zwischenspeicher liegt ein gewöhnlicher Puffer.
var ID={HEAD:1,TORSO:2,COAT:3,SKIRT:4,ARMF:5,ARMN:6,HANDF:7,HANDN:8,LEGF:9,LEGN:10,SHOE:11,ITEM:12,POST:13,UMB:14};
M.RIG_ID=ID;
function SprBuf(){ Buf.call(this,SW,SHH,T); this.id=new Uint8Array(SW*SHH); this.cur=0; }
SprBuf.prototype=Object.create(Buf.prototype); SprBuf.prototype.constructor=SprBuf;
SprBuf.prototype.px=function(x,y,c){ x|=0; y|=0; if(x<0||y<0||x>=this.w||y>=this.h||c===undefined||c===T) return; var i=y*this.w+x; this.d[i]=c; if (this.id) this.id[i]=this.cur; };
SprBuf.prototype.rect=function(x,y,w,h,c){ for(var j=Math.max(0,y|0);j<Math.min(this.h,(y|0)+h);j++) for(var i=Math.max(0,x|0);i<Math.min(this.w,(x|0)+w);i++){ var k=j*this.w+i; this.d[k]=c; if (this.id) this.id[k]=this.cur; } };
SprBuf.prototype.blit=function(src,ox,oy,flip,lut){ ox|=0; oy|=0; for(var j=0;j<src.h;j++){ var y=oy+j; if (y<0||y>=this.h) continue; for(var i=0;i<src.w;i++){ var c=src.d[j*src.w+(flip?src.w-1-i:i)]; if(c===T) continue; var x=ox+i; if (x<0||x>=this.w) continue; var k=y*this.w+x; this.d[k]=lut?lut[c]:c; if (this.id) this.id[k]=this.cur; } } };
function isBase(c,C){ return c===C[0]||c===C[1]||c===C[2]; }
// eine Linie von Pixeln eine Stufe dunkler (nur auf den Grundfarben C des Stoffs)
function crease(b,x0,y0,x1,y1,C,dir){ var n=Math.max(1,Math.abs(x1-x0),Math.abs(y1-y0)); for (var i=0;i<=n;i++){ var x=Math.round(x0+(x1-x0)*i/n), y=Math.round(y0+(y1-y0)*i/n), c=b.get(x,y); if (c!==T && isBase(c,C)) b.px(x,y,dir>0?UP[c]:DN[c]); } }

// ---------------------------------------------------------------- Licht auf Stoffflächen
// Statt drei fester Streifen (hell, mittel, dunkel) bekommt jeder Pixel einer Fläche (Torso, Mantelschoß, Rock) eine Helligkeit aus einer
// gedachten Wölbung (Querschnitt als Halbellipse, oben zu den Schultern hin nach oben gekippt) und einem Licht von vorn oben (Seitenansicht)
// bzw. links oben (vorn/hinten). Fünf Stufen: tiefer Schatten, Schatten, Mitte, Licht, Glanz; die Übergänge gerastert wie in den Räumen.
var LSIDE=[0.55,-0.62,0.56], LFRONT=[-0.52,-0.62,0.58];
function lightAt(u,yv,side,top){ var nx=Math.max(-1,Math.min(1,u*2-1)), ny=0; if (top>0 && yv<top) ny=-(1-yv/top)*0.8; else if (yv>0.93) ny=0.25;
  var q=1-nx*nx-ny*ny, nz=Math.sqrt(q>0.05?q:0.05), L=side?LSIDE:LFRONT, d=nx*L[0]+ny*L[1]+nz*L[2]; return Math.max(0,Math.min(1,0.18+0.9*(d>0?d:0))); }
function level(v,x,y){ var q=v+(bayer(x,y)-0.5)*0.17; return q<0.27?-2:(q<0.47?-1:(q<0.75?0:(q<0.94?1:2))); }
function shadeCol(C,lv){ return lv===0?C[0]:(lv===1?C[1]:(lv===-1?C[2]:(lv>=2?(UP[C[1]]===C[1]?C[1]:UP[C[1]]):(DN[C[2]]===P.k0?C[2]:DN[C[2]])))); }
// Musterfarbe (Schürze, Streifen …) mit derselben Stufe abschatten
function shadeAny(c,lv){ return lv>0?(lv>1?UP[UP[c]]:UP[c]):(lv<0?(lv<-1?DN[DN[c]]:DN[c]):c); }

// ---------------------------------------------------------------- Torso-Generator
// spec: {w (Schulterbreite vorne, gerade Zahl), len (Zeilen), col:[mid,lit,shade], collar:[c1,c2]|null, vneck:skin, buttons:col,
//        scarf:[mid,lit,shade], apron:[mid,lit], lapel:col, belt:col, open:col (offene Jacke: Hemdfarbe), stripe:col, side:w (Seitenbreite)}
function torsoF(s,back){ var w=s.w||12, L=s.len||14, b=new Buf(w,L,T), C=s.col;
  for (var y=0;y<L;y++){ var inset=y<1?2:(y<2?1:(y>L-4?1:0)); if (s.taper && y>L*0.55) inset=Math.max(inset,1);
    for (var x=inset;x<w-inset;x++){ var u=(x+0.5)/w, lv=s.flat?(u<0.22?1:(u>0.78?-1:0)):level(lightAt(u,(y+0.5)/L,false,0.22),x,y), c=shadeCol(C,lv);
      if (!back){
        if (s.open && Math.abs(x-(w-1)/2)<1.6 && y>0) c=(Math.abs(x-(w-1)/2)<0.6)?M.DN[s.open]:s.open;
        if (s.stripe!==undefined && y%3===1 && y>0) c=s.stripe;
        if (s.apron && y>=Math.floor(L*0.3) && x>=2 && x<w-2) c=shadeAny(x<4?s.apron[1]:s.apron[0],lv<0?-1:0);
        if (s.buttons!==undefined && Math.abs(x-(w-1)/2)<0.6 && y>2 && y%3===0) c=s.buttons;
        if (s.lapel!==undefined && y<5 && (Math.abs(x-(w-1)/2)>=1 && Math.abs(x-(w-1)/2)<2.6-y*0.3)) c=s.lapel;
      } else if (s.stripe!==undefined && y%3===1 && y>0) c=s.stripe;
      if (s.belt!==undefined && y===L-3) c=s.belt;
      b.px(x,y,c); } }
  if (!back && s.collar){ var mx=(w-1)/2; b.px(Math.floor(mx),0,s.collar[0]); b.px(Math.ceil(mx),0,s.collar[0]); b.px(Math.floor(mx)-1,0,s.collar[1]); b.px(Math.ceil(mx)+1,0,s.collar[1]); }
  if (!back && s.vneck!==undefined){ var m2=(w-1)/2; for (var yy=0;yy<3;yy++){ for (var xx=Math.ceil(m2-1.5+yy*0.5);xx<=Math.floor(m2+1.5-yy*0.5);xx++) b.px(xx,yy,s.vneck); } }
  if (s.scarf){ var S=s.scarf; for (var x2=1;x2<w-1;x2++){ b.px(x2,0,S[x2<3?1:0]); b.px(x2,1,S[x2>w-4?2:0]); }
    if (!back){ for (var y2=2;y2<Math.min(L-2,9);y2++){ b.px(3,y2,S[1]); b.px(4,y2,S[0]); } } else { for (var y3=2;y3<5;y3++) b.px(w-4,y3,S[2]); } }
  // Falten: von den Achseln schräg zur Mitte, auf der Schattenseite etwas länger; darunter eine kurze Querfalte über dem Bund
  if (!s.noFolds && w>=8 && L>=9){ var fy0=Math.round(L*0.34), fy1=Math.round(L*0.56), fx=Math.max(2,Math.round(w*0.3));
    crease(b,2,fy0,fx,fy1-1,C,-1); crease(b,w-3,fy0,w-1-fx,fy1,C,-1);
    if (L>=12){ var wy=L-4; crease(b,Math.round(w*0.38),wy,Math.round(w*0.38)+1,wy,C,-1); } }
  return b; }
function torsoS(s){ var w=s.side||8, L=s.len||14, b=new Buf(w,L,T), C=s.col;
  for (var y=0;y<L;y++){ var x0=(y<1)?1:0, x1=w-(y<1?2:(y<2?1:0)); if (y>L-5 && !s.belly) x1=Math.max(x0+2,x1-1); if (s.belly && y>L*0.4 && y<L-2) x1=w;
    if (s.hunch && y<4) { x0=Math.max(0,x0-1); }
    for (var x=x0;x<x1;x++){ var u=(x-x0+0.5)/Math.max(1,(x1-x0)), lv=s.flat?(u>0.7?1:(u<0.25?-1:0)):level(lightAt(u,(y+0.5)/L,true,0.22),x,y), c=shadeCol(C,lv);
      if (s.apron && y>=Math.floor(L*0.3) && x>=x1-2) c=s.apron[0];
      if (s.buttons!==undefined && x===x1-1 && y>2 && y%3===0) c=s.buttons;
      if (s.belt!==undefined && y===L-3) c=s.belt;
      if (s.stripe!==undefined && y%3===1 && y>0) c=s.stripe;
      b.px(x,y,c); } }
  if (s.collar){ b.px(w-3,0,s.collar[0]); b.px(w-2,1,s.collar[1]); }
  if (s.vneck!==undefined){ b.px(w-2,0,s.vneck); b.px(w-3,0,s.vneck); b.px(w-2,1,s.vneck); }
  if (s.scarf){ var S=s.scarf; for (var x2=0;x2<w;x2++){ b.px(x2,0,S[0]); b.px(x2,1,S[x2>w-3?1:2]); } b.px(w-1,2,S[1]); b.px(w-1,3,S[0]); b.px(w-2,3,S[0]); b.px(w-1,4,S[2]); }
  if (s.hood){ b.px(0,0,s.hood); b.px(0,1,s.hood); b.px(1,0,s.hood); }
  // Falte am Rücken (hinter dem nahen Arm sichtbar), schräg nach hinten unten
  if (!s.noFolds && w>=7 && L>=10) crease(b,3,Math.round(L*0.4),2,Math.round(L*0.62),C,-1);
  return b; }
// Torso in Seitenansicht scheren (Vorbeugen +, Zurücklehnen -)
function shearS(src,lean){ if (!lean) return {b:src,pad:0}; var w=src.w+Math.abs(lean)+1, b=new Buf(w,src.h,T), pad=lean<0?Math.abs(lean):0;
  for (var y=0;y<src.h;y++){ var sh=Math.round(lean*(src.h-1-y)/(src.h-1)); for (var x=0;x<src.w;x++){ var c=src.d[y*src.w+x]; if (c!==T) b.px(x+sh+pad,y,c); } } return {b:b,pad:pad}; }

// ---------------------------------------------------------------- Glieder
function ik(ax,ay,tx,ty,l1,l2,bend){ var dx=tx-ax, dy=ty-ay, d=Math.sqrt(dx*dx+dy*dy), md=l1+l2-0.01; if (d>md){ dx*=md/d; dy*=md/d; d=md; } if (d<0.01) d=0.01;
  var a=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d)))), base=Math.atan2(dy,dx), ang=base+bend*a; return [ax+Math.cos(ang)*l1, ay+Math.sin(ang)*l1]; }
function limb(b,a,c,r,col){ var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx<0||(nx===0&&ny>0)){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=Math.max(0,Math.min(1,(px*vx+py*vy)/L2)), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=qx*nx+qy*ny; b.px(x,y, s>r*0.4?col[1]:(s<-r*0.4?col[2]:col[0])); } } }
// Hand: 2×2, dazu die Fingerspitzen als ein Pixel in Richtung des Unterarms (hängend unten, beim Zeigen vorn); (dx,dy) Unterarmrichtung
function hand(b,x,y,c,dx,dy){ var cx=x, cy=y; x=Math.round(x); y=Math.round(y); b.px(x,y,c[0]); b.px(x+1,y,c[0]); b.px(x,y+1,c[1]); b.px(x+1,y+1,c[1]);
  if (dx===undefined) return; var L=Math.sqrt(dx*dx+dy*dy); if (L<0.5) return; var fx=Math.floor(x+1+1.5*dx/L), fy=Math.floor(y+1+1.5*dy/L);
  if (fx>=x && fx<=x+1 && fy>=y && fy<=y+1) return; b.px(fx,fy,c[1]); }
// Bündchen am Ärmelende: ein schmaler Ring kurz vor der Hand, etwas weiter als der Unterarm (eigene Farbe cols.cuff, sonst eine Stufe dunkler)
function cuff(b,e,h,r,col){ var dx=h[0]-e[0], dy=h[1]-e[1], L=Math.sqrt(dx*dx+dy*dy); if (L<2.5) return; var ux=dx/L, uy=dy/L;
  limb(b,[h[0]-ux*1.7,h[1]-uy*1.7],[h[0]-ux*0.9,h[1]-uy*0.9],r+0.2,col); }
function cuffCols(C){ return [DN[C[0]],C[0],DN[C[2]]]; }
function outlinePass(b,col){ var add=[]; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ if (b.get(x,y)!==T) continue; var n=[b.get(x-1,y),b.get(x+1,y),b.get(x,y-1),b.get(x,y+1)];
  for (var i=0;i<4;i++) if (n[i]!==T && n[i]!==col){ add.push(x,y); break; } } for (var k=0;k<add.length;k+=2) b.px(add[k],add[k+1],col); }
// Schuhe: Oberleder in der Schuhfarbe mit Glanz an der Kappe (l), Ferse und Kante dunkler (d), schwarze Sohle
var SHOES={ f:['.ds..','dsssl','kkkkk'], h:['.ds.l','dssss','kkkk.'], t:['ds...','.dsl.','..dss','...kk'], F:['lssd','kkkk'], B:['dssd','kkkk'] };

// gehaltene Dinge (an der nahen Hand, Seitenansicht)
var HELD={
  cup:function(b,x,y){ b.rect(x+1,y-3,3,3,P.s5); b.px(x+4,y-2,P.s4); b.hl(x+1,x+3,y-3,P.w1); },
  cig:function(b,x,y,t){ b.hl(x+1,x+3,y,P.s6); b.px(x+4,y,(Math.floor((t||0)/300)%2)?P.y4:P.r4); },
  paper:function(b,x,y){ b.rect(x+1,y-5,4,6,P.s6); b.hl(x+2,x+3,y-3,P.s3); b.hl(x+2,x+3,y-1,P.s3); },
  key:function(b,x,y){ b.px(x+2,y,P.y3); b.px(x+3,y,P.y2); },
  broom:function(b,x,y){ b.line(x-6,y-8,x+7,y+20,P.w3); b.poly([[x+5,y+18],[x+11,y+18],[x+13,y+24],[x+3,y+24]],P.e3); },
  guitar:function(b,x,y){ b.ellipse(x+3,y+3,4.5,5.5,P.w3); b.ellipse(x+3,y+3,2.6,3.3,P.w4); b.ellipse(x+3,y+3,1,1.2,P.k1); b.line(x+5,y-1,x+15,y-11,P.w1); b.line(x+6,y-1,x+16,y-11,P.w0); b.rect(x+15,y-13,2,3,P.w1); },
  needle:function(b,x,y){ b.line(x,y,x+4,y-3,P.m4); },
  rag:function(b,x,y){ b.rect(x,y-1,4,3,P.s5); b.px(x+1,y+2,P.s4); },
  glass:function(b,x,y){ b.rect(x+1,y-4,3,4,P.b4); b.px(x+1,y-4,P.s6); },
  pencil:function(b,x,y){ b.line(x,y,x+4,y-4,P.y3); b.px(x+4,y-4,P.k1); },
  candle:function(b,x,y,t){ b.rect(x+1,y-4,2,5,P.s6); b.px(x+1,y-5,(Math.floor((t||0)/120)%2)?P.y5:P.y4); },
  phone:function(b,x,y){ b.rect(x+1,y-4,2,5,P.k2); b.px(x+1,y-4,P.n4); },
  frameS:function(b,x,y){ b.rect(x,y-6,6,7,P.y2); b.rect(x+1,y-5,4,5,P.s5); }
};
M.HELD=HELD;

// ---------------------------------------------------------------- Regenschirm (Kapitel 3, Ankunft im Regen; Posenfeld um, gesetzt in 05_engine.js)
// um: 2 zu, gehoben · 3 und 4 geht auf · 5 offen (Stufe 1, zu und weggesteckt, wird nicht gemalt: in der fernen Hand hinge er in der
// Seitenansicht ohnehin unsichtbar hinter Mantel und Beinen). Farben je Figur (def.umbrella: [Bahn, Licht, Schatten, Naht, Glanz]), sonst
// Weinrot. Acht Speichen: man sieht fünf Spitzen und vier Bahnen, abwechselnd hell und dunkel (Licht von links oben); zwischen den Spitzen
// biegt sich die Kante nach oben, an den Spitzen sitzen kleine Metallenden. Stock und Spitze in der Umrissfarbe, damit der Umrissdurchgang
// sie nicht verdickt. Nach dem Umriss (ohne schwarzen Rand): Tropfen an den Spitzen, Spritzer oben (umWater, Zeitraster 90 ms).
var UM_COL=[P.r2,P.r3,P.r1,P.r0,P.r4], UM_LEN=28, UM_SHAPE=[null,null,null,{R:6,H:8},{R:10,H:7},{R:13,H:6}];
var UM_TIPS=[-1,-0.7071,0,0.7071,1];   // cos der sichtbaren Speichen: 180°, 135°, 90°, 45°, 0°
function umCol(ch){ return ch.umbrella||UM_COL; }
function umHW(R,H,y){ var e=(H-y)/H; return Math.max(1,Math.round(R*Math.sqrt(Math.max(0,1-e*e)))); }
// offen oder gehoben: der Stock von der Hand zur Spitze, darunter der Griff als kleiner Haken
function umStick(b,x,y,ax,ay,dir){ x=Math.round(x); y=Math.round(y); b.line(x,y,Math.round(ax),Math.round(ay),P.k1);
  b.px(x,y+1,P.w2); b.px(x,y+2,P.w2); b.px(x+dir,y+3,P.w2); b.px(x+2*dir,y+2,P.w2); }
function umCanopy(b,ax,ay,k,ch){ var c=umCol(ch); ax=Math.round(ax); ay=Math.round(ay);
  if (k<=2){ for (var y0=1;y0<12;y0++){ var w=(y0<3||y0>9)?0:1; for (var x0=-w;x0<=w;x0++) b.px(ax+x0,ay+y0,x0<0?c[1]:(x0>0?c[2]:c[0])); } b.px(ax,ay,P.m3); return; }   // zusammengefaltet am oberen Ende
  var S=UM_SHAPE[k], R=S.R, H=S.H;
  for (var y=0;y<H;y++){ var hw=umHW(R,H,y);
    for (var x=-hw;x<=hw;x++){ var u=x/hw, col=u<-0.71?c[0]:(u<0?c[1]:(u<0.71?c[0]:c[2]));   // vier Bahnen
      if (y>0){ if (x===Math.round(UM_TIPS[1]*hw)) col=c[0]; else if (x===0) col=c[2]; else if (x===Math.round(UM_TIPS[3]*hw)) col=c[3]; }   // Nähte
      b.px(ax+x,ay+y,col); } }
  if (k===5){ b.px(ax-2,ay+1,c[4]); b.px(ax-3,ay+1,c[4]); b.px(ax-4,ay+2,c[4]); b.px(ax-5,ay+3,c[1]); }   // nasser Glanz auf der hellen Bahn
  for (var j=0;j<UM_TIPS.length;j++){ var tx=Math.round(UM_TIPS[j]*R), cc=j<2?c[0]:c[2];   // Zipfel unter jeder Speiche, dazwischen bleibt die Kante oben
    b.px(ax+tx,ay+H,cc); if (j>0 && j<4){ b.px(ax+tx-1,ay+H,cc); b.px(ax+tx+1,ay+H,cc); } b.px(ax+tx,ay+H+1,P.m2); }
  b.px(ax,ay-1,P.m3); b.px(ax,ay-2,P.m4); }
// Wasser am offenen Schirm: an vier Spitzen fällt ab und zu ein Tropfen, oben springen Spritzer auf (alle 24 Raster wiederholt sich das Bild)
function umWater(b,ax,ay,t){ var f=Math.floor((t||0)/90)%24, S=UM_SHAPE[5], R=S.R, H=S.H, hash=M.hash;
  [[-1,0],[-0.7071,5],[0.7071,2],[1,6]].forEach(function(q,j){ var ph=(f+q[1])%8, cyc=Math.floor((f+q[1])/8)%3; if (hash(j*7+cyc,13)<0.35) return;
    var x=ax+Math.round(q[0]*R), y0=ay+H+2, y=y0+ph*3; if (y>=b.h) return;
    if (b.get(x,y)===T) b.px(x,y,P.n4); if (ph>0 && b.get(x,y-1)===T) b.px(x,y-1,P.m3); });
  for (var i=0;i<3;i++){ if (hash(f,i+20)<0.45) continue; var sx=Math.round((hash(f,i+30)*2-1)*(R-2)), top=0; while (top<H && umHW(R,H,top)<Math.abs(sx)) top++;
    if (b.get(ax+sx,ay+top-1)===T) b.px(ax+sx,ay+top-1,P.s6); } }
// Lage des offenen Schirms relativ zu den Füßen (Blick nach rechts; nach links spiegeln): für den Regenschatten in 06_ui.js
M.umAnchor=function(p,chId){ var ch=CH[chId]; if (!ch||!p||!(p.um>=3)) return null; var hx=p.h[0], hy=p.h[1]-(ch.hipY-23), L=ch.tLen, S=UM_SHAPE[p.um], x;
  if (p.v==='S') x=hx+4+Math.round((p.ln||0)*(L-2)/(L-1))-3; else { var s=p.v==='F'?1:-1; x=hx+s*4; }
  return {x:x,y:hy-7-UM_LEN,R:S.R,H:S.H}; };

// ---------------------------------------------------------------- Figuren definieren
/* def: {legend:{zeichen:farbe}, heads:{S:{n,o,b},F:{n,o,b},B:{n}}, neck:{S:[x,y],F:[x,y],B:[x,y]}, torso:{...spec}, torsoS:{...}, torsoB:{...}
         cols:{trou:[m,l,s], trouF:[...], sleeve:[...], sleeveF:[...], hand:[c,c2], shoe:col, shoeTop:col}, skirt:{c:[m,l,s],hem,flare}, coat:{c:[m,l,s],hem},
         bones:[thigh,shin,upper,fore], hipY:23, shoulder:5, legR:[1.7,1.3], armR:[1.3,1.0], anims:{}, post(b,p) } */
M.defineChar=function(id,def){ var d=Object.assign({},def); d.id=id; d.legend=def.legend||{}; d.stamps={};
  d.neck=Object.assign({S:[6,12],F:[5,12],B:[5,12]},def.neck||{});
  d.cols=Object.assign({ trou:[P.c1,P.c2,P.c0], trouF:[P.c0,P.c1,P.k1], sleeve:[P.m2,P.m3,P.m1], sleeveF:[P.m1,P.m2,P.m0], hand:[P.q3,P.q2], handF:[P.q2,P.q1], shoe:P.w1, shoeTop:P.w2 },def.cols||{});
  d.bones=def.bones||[11,10,8,7]; d.hipY=def.hipY||23; d.shoulder=def.shoulder||5;
  var ts=Object.assign({w:12,len:13,col:[P.m2,P.m3,P.m1]},def.torso||{});
  d.tF=torsoF(ts,false); d.tB=torsoF(Object.assign({},ts,def.torsoB||{}),true); d.tS=torsoS(Object.assign({},ts,def.torsoS||{})); d.tLen=ts.len; d.tHipF=Math.floor(ts.w/2); d.tHipS=def.tHipS||4;
  var sc=d.cols.shoe, shoeLeg={k:P.k1,s:sc,l:UP[sc]===sc?sc:UP[sc],d:DN[sc]===P.k0&&sc!==P.k1?P.k1:DN[sc]}; d.shoes={}; Object.keys(SHOES).forEach(function(k){ d.shoes[k]=M.stamp(SHOES[k],shoeLeg); });
  d.anims=def.anims||{}; d.cache={}; d.shear={};
  CH[id]=d; return d; };
function headStamp(ch,v,k,hl){ var key=v+k+(hl?'~'+hl:''); if (!ch.stamps[key]){ var set=ch.heads[v]||ch.heads.S, vv=ch.heads[v]?v:'S', ex=EXPR[k], src=set[k]||(ex?(ex.open?(set.o||set.n):set.n):set.n), rows=headEnh(src,set.n,vv,ch);
    if (ex && !set[k] && vv!=='B') rows=exprRows(rows,ex,vv,ch.legend); if (hl && vv==='S') rows=hairShift(rows,hl); ch.stamps[key]=M.stamp(rows,ch.legend); } return ch.stamps[key]; }
// Kapitel 3, Punkt 9: Gesichtsausdrücke, für jede Figur aus ihrem Kopf abgeleitet (nach den automatischen Brauen von headEnh).
//  sm Lächeln (Mundwinkel hoch, Wange gehoben) · so lächelnd sprechen · fr Stirnrunzeln (Braue zur Nase hin tiefer, Mundwinkel runter)
//  fo stirnrunzelnd sprechen · br Braue hoch (fragend) · bo fragend sprechen · ow Mund weit offen (Ausruf)
var EXPR={ sm:{smile:1}, so:{smile:1,open:1}, fr:{frown:1}, fo:{frown:1,open:1}, br:{brow:1}, bo:{brow:1,open:1}, ow:{wide:1,open:1} };
M.HEAD_EXPR=EXPR;
function exprRows(rows,ex,v,lg){ var R=rows.map(function(r){ return r.split(''); }), h=R.length, g=function(y,x){ return (y<0||y>=h||x<0||x>=R[y].length)?'.':R[y][x]; };
  var hasL=function(c){ return !lg || lg[c]!==undefined; }, BRW=hasL('h')?'h':(hasL('H')?'H':'k'), SK=hasL('S')?'S':null, MO=hasL('m')?'m':'k';
  var skin=function(c){ return c==='S'||c==='s'||c==='t'; }, hairc=function(c){ return c==='H'||c==='h'||c==='j'; }, eyes=[], ey=-1, mouth=[], my=-1;
  for (var y=0;y<h;y++) for (var x=0;x<R[y].length;x++){ if (R[y][x]==='e' && g(y-1,x)!=='e'){ if (ey<0) ey=y; if (y===ey) eyes.push(x); } }
  for (var y2=Math.max(0,ey);y2<h;y2++){ var xs=[]; for (var x2=0;x2<R[y2].length;x2++) if (R[y2][x2]==='m'||(R[y2][x2]==='k'&&g(y2-1,x2)==='m')) xs.push(x2); if (R[y2].indexOf('m')>=0){ my=y2; mouth=xs; break; } }
  if (ey<0) return rows; var put=function(y,x,c,only){ if (c===null||y<0||y>=h||x<0||x>=R[y].length) return; if (only && !only(R[y][x])) return; R[y][x]=c; };
  var front=v==='S';   // Seite: Blick nach rechts (Gesicht vorn rechts)
  eyes.forEach(function(ex2,i){ var inner=front?1:(i===0?1:-1), by=ey-1, isBrow=hairc(g(by,ex2));
    if (ex.brow && (i===0||front)){ if (isBrow){ put(by-1,ex2,g(by,ex2),skin); put(by,ex2,SK); } else put(by-1,ex2,BRW,skin); }
    if (ex.frown){ if (isBrow) put(by,ex2+inner,g(by,ex2),skin); put(ey,ex2+inner,BRW,skin); if (!front && isBrow) put(by,ex2-inner,SK,hairc); } });
  if (my>=0 && mouth.length){ var mx0=Math.min.apply(null,mouth), mx1=Math.max.apply(null,mouth);
    if (ex.smile){ if (front){ put(my-1,mx0-1,MO,skin); put(ey+1,mx0-1,SK,function(c){ return c==='s'; }); } else { put(my-1,mx0-1,MO,skin); put(my-1,mx1+1,MO,skin); put(my,mx0-1,SK,function(c){ return c==='m'; }); } }
    if (ex.frown){ if (front){ put(my+1,mx0-1,MO,skin); } else { put(my+1,mx0-1,MO,skin); put(my+1,mx1+1,MO,skin); } }
    if (ex.wide){ for (var xx=mx0;xx<=mx1;xx++){ put(my,xx,'k'); put(my+1,xx,'k',skin); } } }
  return R.map(function(r){ return r.join(''); }); }
// Kapitel 3, Punkt 6 (Folgebewegung): langes Haar hinten am Kopf (Zopf, Pferdeschwanz) schwingt nach. Unter der Mundzeile wird das
// hinterste zusammenhängende Haarstück jeder Zeile versetzt, nach unten zunehmend (an der Spitze um hl Pixel); nach vorn verschwindet
// es hinter dem Hals, statt ihn zu übermalen.
function hairShift(rows,hl){ var mr=-1; for (var r=0;r<rows.length;r++) if (rows[r].indexOf('m')>=0){ mr=r; break; } if (mr<0) return rows; var n=rows.length, out=rows.slice();
  for (var y=mr+1;y<n;y++){ var row=rows[y], x0=0; while (x0<row.length && row[x0]==='.') x0++; var x1=x0; while (x1<row.length && 'kHhj'.indexOf(row[x1])>=0) x1++; if (x1-x0<2) continue;
    var seg=row.slice(x0,x1); if (!/[Hhj]/.test(seg)) continue; var sh=Math.round(hl*(y-mr)/(n-mr)); if (!sh) continue; var a=row.split(''); for (var i=x0;i<x1;i++) a[i]='.';
    for (var j=0;j<seg.length;j++){ var X=x0+sh+j; if (X<0||X>=a.length) continue; if (a[X]==='.') a[X]=seg[j]; } out[y]=a.join(''); }
  return out; }
// Köpfe: Feinheiten, die alle Figuren bekommen (je Figur abschaltbar: headAuto:false, oder einzeln {brow:false, nose:false, sheen:false, cheek:false}).
//  Augenbrauen: Haarfarbe über dem Auge, wo dort Haut ist (beim Lidschlag an derselben Stelle, erschrocken eine Zeile höher).
//  Nase (Seite): ein Schattenpixel unter der Nasenspitze. Haar: Glanz an der oberen Kante zur Lichtseite (Seite vorn, vorn/hinten links).
//  Wange (vorn): die letzte Hautspalte rechts zwischen Auge und Mund eine Stufe dunkler (Licht von links wie am Körper).
function headEnh(rows,base,v,ch){ var o=ch.headAuto; if (o===false || !rows || rows.length<6) return rows; o=o||{}; var lg=ch.legend, has=function(c){ return lg[c]!==undefined; };
  var R=rows.map(function(r){ return r.split(''); }), h=rows.length, all=rows.join('');
  var g=function(rs,y,x){ return (y<0||y>=rs.length||x<0||x>=rs[y].length)?'.':rs[y][x]; }, skin=function(c){ return c==='S'||c==='s'; };
  var hairC=all.indexOf('H')>=0&&has('H')?'H':(all.indexOf('h')>=0&&has('h')?'h':null);
  // Augenbrauen
  var brow=o.brow===false?null:(o.brow||(hairC==='H'&&has('h')&&all.indexOf('h')>=0?'h':hairC)), er=all.indexOf('e')>=0?rows:base, eyeY=-1;
  if (v!=='B') for (var y=1;y<er.length;y++) for (var x=0;x<er[y].length;x++){ if (er[y][x]!=='e' || g(er,y-1,x)==='e') continue; if (eyeY<0) eyeY=y;
    if (!brow) continue; var yb=y-1; if (er!==rows && g(rows,yb,x)!=='S' && g(rows,yb,x)!=='s') continue; if (skin(g(rows,yb,x))) R[yb][x]=brow; }
  // Nasenschatten (Seite)
  if (v==='S' && o.nose!==false && has('s')){ var xr=rows.map(function(r){ var m=-1; for (var i=0;i<r.length;i++) if ('Sst'.indexOf(r[i])>=0) m=i; return m; });
    for (var y2=Math.max(1,eyeY);y2<h-1 && eyeY>=0;y2++){ if (xr[y2]>=0 && xr[y2]>xr[y2-1] && xr[y2]>xr[y2+1]){ if (g(rows,y2+1,xr[y2]-1)==='S') R[y2+1][xr[y2]-1]='s'; break; } } }
  // Haarglanz an der oberen Kante
  if (o.sheen!==false && has('h') && hairC==='H'){ var x0=99, x1=-1; rows.forEach(function(r){ for (var i=0;i<r.length;i++) if (r[i]!=='.'&&r[i]!==' '){ x0=Math.min(x0,i); x1=Math.max(x1,i); } });
    var cx=(x0+x1)/2, ylim=eyeY>0?eyeY-1:Math.floor(h*0.4);
    for (var y3=0;y3<=ylim;y3++) for (var x3=0;x3<rows[y3].length;x3++){ if (rows[y3][x3]!=='H') continue; var up=g(rows,y3-1,x3); if ('Hhj'.indexOf(up)>=0) continue;
      if (v==='S' ? x3<cx-1 : x3>cx) continue; var nb=[g(rows,y3,x3-1),g(rows,y3,x3+1),g(rows,y3+1,x3)]; if (nb.indexOf('h')>=0||nb.indexOf('j')>=0) continue; R[y3][x3]='h'; } }
  // Wange auf der Schattenseite (vorn)
  if (v==='F' && o.cheek!==false && has('s') && eyeY>=0){ var mY=-1; for (var y4=eyeY;y4<h;y4++) if (rows[y4].indexOf('m')>=0){ mY=y4; break; }
    for (var y5=eyeY+1;y5<(mY>0?mY:eyeY+3);y5++){ var r5=rows[y5]; for (var x5=r5.length-1;x5>=0;x5--){ if ('Sst'.indexOf(r5[x5])>=0){ if (r5[x5]==='S' && 'kHhj.'.indexOf(g(rows,y5,x5+1))>=0) R[y5][x5]='s'; break; } } } }
  // Schatten unter dem Pony und am Kiefer (beide Ansichten), Schattenseite des Gesichts (vorn: rechts, Seite: hinten am Ohr)
  if (o.shade!==false && has('s') && v!=='B' && eyeY>=0){
    for (var y6=1;y6<h;y6++) for (var x6=0;x6<rows[y6].length;x6++){ if (rows[y6][x6]!=='S' || R[y6][x6]!=='S') continue; var a6=g(rows,y6-1,x6), b6=g(rows,y6+1,x6);
      if ('Hh'.indexOf(a6)>=0 && hairC && y6<=eyeY) R[y6][x6]='s';
      else if (b6==='k' && y6>eyeY+1 && (v==='F' ? x6>=rows[y6].length*0.5 : x6<rows[y6].length*0.55)) R[y6][x6]='s'; }
    if (v==='F') for (var y7=eyeY-1;y7<h;y7++){ var r7=rows[y7]; if (!r7) continue; for (var x7=r7.length-1;x7>=0;x7--){ if ('Sst'.indexOf(r7[x7])>=0){ if (R[y7][x7]==='S' && 'kHhj.'.indexOf(g(rows,y7,x7+1))>=0) R[y7][x7]='s'; break; } } } }
  return R.map(function(r){ return r.join(''); }); }
// Kopfvarianten automatisch: 'b' (Lidschlag: e -> Haut), 'o' (Mund offen: m -> k, und ein Pixel tiefer)
M.headSet=function(rows,skin){ skin=skin||'t'; function rep(rs,from,to){ return rs.map(function(r){ return r.split(from).join(to); }); }
  var o=rows.map(function(r){ return r; }), idx=-1; for (var i=0;i<rows.length;i++) if (rows[i].indexOf('m')>=0){ idx=i; break; }
  if (idx>=0){ o=rows.slice(); o[idx]=o[idx].split('m').join('k'); if (idx+1<o.length){ var r=o[idx+1].split(''); var mi=rows[idx].indexOf('m'); if (r[mi] && r[mi]!=='.' && r[mi]!=='k') r[mi]='m'; o[idx+1]=r.join(''); } }
  // 'w' erschrocken: Augen doppelt so hoch, Mund offen; 's' traurig: schwere Lider (Schatten über den Augen)
  var wv=o.slice(), sv=rows.slice();
  for (var r=1;r<rows.length;r++){ for (var c=0;c<rows[r].length;c++){ if (rows[r][c]!=='e') continue;
    var u1=wv[r-1].split(''); if ('Sst'.indexOf(u1[c])>=0){ u1[c]='e'; wv[r-1]=u1.join(''); }
    var u2=sv[r-1].split(''); if ('Ss'.indexOf(u2[c])>=0){ u2[c]='t'; sv[r-1]=u2.join(''); } } }
  // 'l'/'r': Blick nach links/rechts (Augen einen Pixel versetzt, wo daneben Haut ist; für Blicke zu dem, der spricht oder vorbeigeht)
  function look(rs,d){ return rs.map(function(r){ var a=r.split(''), q=a.slice(); for (var i=0;i<a.length;i++){ if (a[i]!=='e') continue; var j=i+d; if (a[j] && 'Sst'.indexOf(a[j])>=0 && a[i-d]!=='e'){ q[i]=a[j]; q[j]='e'; } } return q.join(''); }); }
  return { n:rows, o:o, b:rep(rows,'e',skin), w:wv, s:sv, l:look(rows,-1), r:look(rows,1) }; };

// ---------------------------------------------------------------- Pose -> Puffer
// pose: {v:'S'|'F'|'B', h:[x,y] Hüfte, ln:Vorbeugen, hd:Kopfvariante, ho:[dx,dy], nf/ff:[x,y,schuh], nh/fh:[x,y], lf/rf, lh/rh, it:Ding, sit:bool}
function render(p,ch,t){
  var b=new SprBuf(), o=function(q){ return [OX+q[0],OY+q[1]]; }, C=ch.cols, bn=ch.bones, umA=null;
  var hx=p.h[0], hy=p.h[1]-(ch.hipY-23);
  var L=ch.tLen, cuN=C.cuff||null, cuF=C.cuffF||(C.cuff?cuffCols(C.cuff):null), bare=!!C.arm;
  if (!cuN && !bare){ cuN=cuffCols(C.sleeve); cuF=cuffCols(C.sleeveF); }
  if (p.v==='S'){
    var ln=p.ln||0, sh=shearS(ch.tS,ln), shx=Math.round(ln*(L-2)/(L-1));
    var shN=[hx+1+shx, hy-L+2], shF=[hx-1+shx, hy-L+2], hipN=[hx+1,hy-1], hipF=[hx-1,hy-1];
    // ferner Arm (mit dem Regenschirm: die ferne Hand hält ihn, die nahe bleibt frei für Gesten und Gegenstände)
    var um=p.um||0, fh=um>=2?[hx+4+shx,hy-7]:(p.fh||[hx-2,hy+2]), fe=ik(shF[0],shF[1],fh[0],fh[1],bn[2],bn[3],1);
    b.cur=ID.UMB; if (um>=2) umStick(b,OX+fh[0],OY+fh[1],OX+fh[0]-3,OY+fh[1]-UM_LEN,1);   // Stock hinter Körper und Kopf
    b.cur=ID.ARMF; limb(b,o(shF),o(fe),ch.armR?ch.armR[0]:1.3,C.sleeveF); limb(b,o(fe),o(fh),ch.armR?ch.armR[1]:1.0,ch.cols.armF||C.sleeveF);
    if (cuF && !bare && !p.pkF) cuff(b,o(fe),o(fh),ch.armR?ch.armR[1]:1.0,cuF);
    b.cur=ID.HANDF; if (!p.pkF) hand(b,OX+fh[0]-0.5,OY+fh[1]-0.5,C.handF,fh[0]-fe[0],fh[1]-fe[1]);
    // Beine (fern, nah)
    var knees=[];
    [['ff',hipF,C.trouF,ID.LEGF],['nf',hipN,C.trou,ID.LEGN]].forEach(function(Lg){ var f=p[Lg[0]]||[0,0,'f'], ank=[f[0],f[1]-2], kn=ik(Lg[1][0],Lg[1][1],ank[0],ank[1],bn[0],bn[1],-1); knees.push(kn);
      b.cur=Lg[3]; limb(b,o(Lg[1]),o(kn),ch.legR?ch.legR[0]:1.7,Lg[2]); limb(b,o(kn),o(ank),ch.legR?ch.legR[1]:1.3,Lg[2]);
      kneeFold(b,Lg[1],kn,ank,Lg[2],ch.legR?ch.legR[0]:1.7);
      if (!ch.noShoes){ b.cur=ID.SHOE; var s=ch.shoes[f[2]||'f']; b.blit(s,OX+f[0]-2,OY+f[1]-2-(f[2]==='t'?1:0)); } });
    b.cur=ID.SKIRT; skirt(b,ch,hx,hy,knees,p,'S');
    // Torso, dann Kopf
    b.cur=ID.TORSO; b.blit(sh.b,OX+hx-ch.tHipS-sh.pad,OY+hy-L+1);
    var hs=headStamp(ch,'S',p.hd||'n',p.hl||0), nk=ch.neck.S, ho=p.ho||[0,0];
    b.cur=ID.HEAD; if (p.hb) b.blit(hs,OX+hx+shx-(hs.w-1-nk[0])+ho[0],OY+hy-L-nk[1]+ho[1]+1,true); else b.blit(hs,OX+hx+shx-nk[0]+ho[0]+1,OY+hy-L-nk[1]+ho[1]+1);
    b.cur=ID.COAT; coatS(b,ch,hx,hy,knees,p);
    // naher Arm
    var nh=p.nh||[hx,hy+2], ne=ik(shN[0],shN[1],nh[0],nh[1],bn[2],bn[3],1);
    b.cur=ID.ARMN; limb(b,o(shN),o(ne),ch.armR?ch.armR[0]:1.3,C.sleeve); limb(b,o(ne),o(nh),ch.armR?ch.armR[1]:1.0,ch.cols.arm||C.sleeve);
    if (cuN && !bare && !p.pk) cuff(b,o(ne),o(nh),ch.armR?ch.armR[1]:1.0,cuN);
    elbowFold(b,o(shN),o(ne),o(nh),C.sleeve);
    b.cur=ID.HANDN; if (!p.pk) hand(b,OX+nh[0]-0.5,OY+nh[1]-0.5,C.hand,nh[0]-ne[0],nh[1]-ne[1]);
    else { var pkc=b.get(Math.round(OX+nh[0]),Math.round(OY+nh[1])+1); if (pkc!==T) b.px(Math.round(OX+nh[0]),Math.round(OY+nh[1])+1,DN[pkc]); }   // Hand in der Tasche: nur eine kleine Wölbung
    b.cur=ID.ITEM; if (p.it && HELD[p.it]) HELD[p.it](b,OX+nh[0],OY+nh[1],t);
    b.cur=ID.UMB; if (um>=2){ umA=[OX+fh[0]-3,OY+fh[1]-UM_LEN]; umCanopy(b,umA[0],umA[1],um,ch); }
  } else {
    var front=p.v==='F', tst=front?ch.tF:ch.tB, sw=ch.shoulder;
    var sL=[hx-sw,hy-L+2], sR=[hx+sw,hy-L+2];
    [['lf',[hx-2,hy-1],-1],['rf',[hx+2,hy-1],1]].forEach(function(Lg){ var f=p[Lg[0]]||[Lg[2]*3,0], ank=[f[0],f[1]-2], mid=[(Lg[1][0]+ank[0])/2+Lg[2]*0.4,(Lg[1][1]+ank[1])/2];
      if (p.sit) mid=[Lg[1][0]+Lg[2]*0.5, hy+1];
      b.cur=ID.LEGN; limb(b,o(Lg[1]),o(mid),ch.legR?ch.legR[0]+0.1:1.8,C.trou); limb(b,o(mid),o(ank),ch.legR?ch.legR[1]+0.1:1.5,C.trou);
      if (!ch.noShoes){ b.cur=ID.SHOE; b.blit(front?ch.shoes.F:ch.shoes.B,OX+f[0]-1,OY+f[1]-1); } });
    b.cur=ID.SKIRT; skirt(b,ch,hx,hy,null,p,p.v);
    b.cur=ID.TORSO; b.blit(tst,OX+hx-ch.tHipF,OY+hy-L+1);
    b.cur=ID.COAT; coatF(b,ch,hx,hy,p);
    var hsF=headStamp(ch,p.v,p.hd||'n'), nkF=ch.neck[p.v]||[5,12], ho2=p.ho||[0,0];
    // Regenschirm: von vorn in der rechten Bildhälfte, von hinten in der linken (dieselbe Hand); offen dicht an der Kopfseite, damit der Stock nicht übers Gesicht läuft
    var umF=p.um||0, umK=front?'rh':'lh', umS=front?1:-1, umH=umF>=2?[hx+umS*7,hy-7]:null, umAt=null;
    var drawArms=function(){ [['lh',sL,-1],['rh',sR,1]].forEach(function(A){ var h=(umH&&A[0]===umK)?umH:(p[A[0]]||[A[1][0]+A[2]*2,hy+2]), e=ik(A[1][0],A[1][1],h[0],h[1],bn[2],bn[3],A[2]*(front?1:-1)*0.35);
      if (umH && A[0]===umK) umAt=h;
      b.cur=ID.ARMN; limb(b,o(A[1]),o(e),ch.armR?ch.armR[0]+0.1:1.4,C.sleeve); limb(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,ch.cols.arm||C.sleeve);
      if (cuN && !bare && !p.pk) cuff(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,cuN);
      b.cur=ID.HANDN; if (!p.pk) hand(b,OX+h[0]-0.5,OY+h[1]-0.5,C.hand,h[0]-e[0],h[1]-e[1]); }); };
    if (!front){ b.cur=ID.HEAD; b.blit(hsF,OX+hx-nkF[0]+ho2[0],OY+hy-L-nkF[1]+ho2[1]+1); drawArms(); }
    else { drawArms(); b.cur=ID.HEAD; b.blit(hsF,OX+hx-nkF[0]+ho2[0],OY+hy-L-nkF[1]+ho2[1]+1); }
    b.cur=ID.ITEM;
    if (front && p.it==='paper'){ b.rect(OX+hx-4,OY+hy-10,9,6,P.s6); b.hl(OX+hx-3,OX+hx+3,OY+hy-9,P.s3); b.hl(OX+hx-3,OX+hx+2,OY+hy-7,P.s3); b.cur=ID.HANDN; hand(b,OX+hx-5,OY+hy-8,C.hand); hand(b,OX+hx+4,OY+hy-8,C.hand); }
    if (front && p.it==='tin'){ b.rect(OX+hx-2,OY+hy-9,5,5,P.m3); b.hl(OX+hx-2,OX+hx+2,OY+hy-9,P.m4); b.px(OX+hx+1,OY+hy-7,P.m1); b.cur=ID.HANDN; hand(b,OX+hx-4,OY+hy-7,C.hand); hand(b,OX+hx+3,OY+hy-7,C.hand); }
    b.cur=ID.UMB; if (umF>=2 && umAt){ umA=[OX+umAt[0]-umS*3,OY+umAt[1]-UM_LEN]; umStick(b,OX+umAt[0],OY+umAt[1],umA[0],umA[1],umS); b.cur=ID.HANDN; hand(b,OX+umAt[0]-0.5,OY+umAt[1]-0.5,C.hand); b.cur=ID.UMB; umCanopy(b,umA[0],umA[1],umF,ch); }   // Stock leicht zum Kopf geneigt
  }
  b.cur=ID.POST; if (ch.post) ch.post(b,p,OX,OY,hx,hy);
  if (ch.detail!==false) detailPass(b,p.v);
  outlinePass(b,P.k1);
  if (umA && p.um>=5) umWater(b,umA[0],umA[1],t);
  b.id=null;
  return b;
}
// Kniefalte (Seite): bei gebeugtem Knie ein dunkler Pixel in der Kniekehle und ein heller auf der Kniescheibe
function kneeFold(b,hip,kn,ank,col,r){ var mx=(hip[0]+ank[0])/2, my=(hip[1]+ank[1])/2, off=kn[0]-mx; if (Math.abs(off)<1.2) return;
  var x=Math.round(OX+kn[0]), y=Math.round(OY+kn[1]), s=off>0?1:-1, cb=b.get(x-s*Math.round(r),y), cf=b.get(x+s,y-1);
  if (cb!==T) b.px(x-s*Math.round(r),y,DN[col[2]]); if (cf!==T && cf!==col[2]) b.px(x+s,y-1,col[1]); }
// Ellbogenfalte (naher Arm): ist der Arm angewinkelt, ein dunkler Pixel innen am Gelenk
function elbowFold(b,s,e,h,col){ var ax=s[0]-e[0], ay=s[1]-e[1], bx=h[0]-e[0], by=h[1]-e[1], la=Math.sqrt(ax*ax+ay*ay)||1, lb=Math.sqrt(bx*bx+by*by)||1, cs=(ax*bx+ay*by)/(la*lb);
  if (cs<-0.75) return; var ix=Math.round(e[0]+(ax/la+bx/lb)*0.9), iy=Math.round(e[1]+(ay/la+by/lb)*0.9); if (b.get(ix,iy)!==T) b.px(ix,iy,DN[col[2]]); }
// Schatten und Oberlicht aus der Teilekarte
var SHADE_ON={}; SHADE_ON[ID.TORSO]=1; SHADE_ON[ID.COAT]=1; SHADE_ON[ID.SKIRT]=1;
var RIM_ON={}; [ID.TORSO,ID.COAT,ID.SKIRT,ID.ARMN,ID.LEGN].forEach(function(k){ RIM_ON[k]=1; });
var RO={rim:1,back:1}; M.RIGOPT=RO;   // Lichtkante / Schattenkante (zum Vergleichen abschaltbar; danach M.rigClear())
M.rigClear=function(){ Object.keys(CH).forEach(function(id){ var c=CH[id]; c.cache={}; c.stamps={}; c.acache={}; }); };
function detailPass(b,v){ var W=b.w, H=b.h, d=b.d, id=b.id, n=W*H, mk=new Int8Array(n);
  var I=function(x,y){ return (x<0||y<0||x>=W||y>=H)?0:id[y*W+x]; }, Cg=function(x,y){ return (x<0||y<0||x>=W||y>=H)?T:d[y*W+x]; };
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var i=y*W+x, k=id[i]; if (!k || d[i]===T) continue; var up=I(x,y-1), rt=I(x+1,y), lf=I(x-1,y), cu=Cg(x,y-1);
    if (SHADE_ON[k]){
      // der nahe Arm wirft einen schmalen Schatten auf Körper und Mantel (Seite: dahinter und darunter; vorn/hinten: auf beiden Seiten)
      if (v==='S'){ if (rt===ID.ARMN||rt===ID.HANDN||up===ID.HANDN||(up===ID.ARMN&&lf!==ID.ARMN)) mk[i]=-1; }
      else if (rt===ID.ARMN||lf===ID.ARMN||up===ID.HANDN) mk[i]=-1;
      // unter dem Kinn
      if (up===ID.HEAD && cu!==P.k1 && cu!==T) mk[i]=-1;
      // Oberlicht auf den Schultern
      if (!mk[i] && cu===T && k===ID.TORSO) mk[i]=1;
    } else if (k===ID.LEGN||k===ID.LEGF){
      // Saum über der Hose, Bein hinter Bein
      if (SHADE_ON[up]) mk[i]=-1; else if (k===ID.LEGF && (rt===ID.LEGN||lf===ID.LEGN)) mk[i]=-1;
    } else if ((k===ID.ARMN||k===ID.ARMF) && cu===T) mk[i]=1;
    // Kante zur Lichtseite heller (Seite: vorn, vorn/hinten: links), Kante zur Schattenseite dunkler
    if (!mk[i] && RIM_ON[k]){ var cl=v==='S'?Cg(x+1,y):Cg(x-1,y), cb=v==='S'?Cg(x-1,y):Cg(x+1,y);
      if (RO.rim && cl===T && cb!==T) mk[i]=1; else if (RO.back && cb===T && cl!==T) mk[i]=-1; }
  }
  for (var j=0;j<n;j++){ if (mk[j]<0){ var c=d[j], c2=DN[c]; if (c2!==c && c!==P.k1 && c!==P.k0) d[j]=c2; } else if (mk[j]>0) d[j]=UP[d[j]]; } }
function skirt(b,ch,hx,hy,knees,p,v){ var sk=ch.skirt; if (!sk) return; var top=hy-2, hem=hy+(sk.hem||12), fl=sk.flare||2;
  if (v==='S'){ var xs=[hx-4,hx+4]; if (knees) knees.forEach(function(k){ xs.push(k[0]-2,k[0]+2); }); var lo=Math.min.apply(null,xs)-fl, hi=Math.max.apply(null,xs)+fl; if (p.sit){ lo=hx-4; hi=hx+11; hem=hy+3; } else if (p.cl){ lo+=p.cl; hi+=p.cl; }
    b.poly([[OX+hx-4,OY+top],[OX+hx+4,OY+top],[OX+hi,OY+hem],[OX+lo,OY+hem]],function(x,y){ var yy=(y-OY-top)/Math.max(1,hem-top), x0=(OX+hx-4)+(lo-(hx-4))*yy, x1=(OX+hx+4)+(hi-(hx+4))*yy, u=(x+0.5-x0)/Math.max(1,x1-x0+1);
      var lv=level(lightAt(u,0.5,true,0)-yy*0.12,x,y), c=shadeCol(sk.c,lv); if (y>=OY+hem-1) c=shadeCol(sk.c,Math.min(lv,0)-1); return c; }); }
  else { var hm=p.sit?hy+3:hem, cs=p.sit?0:(p.cl||0); b.poly([[OX+hx-5,OY+top],[OX+hx+5,OY+top],[OX+hx+6+fl+cs,OY+hm],[OX+hx-6-fl+cs,OY+hm]],function(x,y){ var yy=(y-OY-top)/Math.max(1,hm-top), u=(x+0.5-(OX+hx-5-(1+fl)*yy))/(10+2*(1+fl)*yy+1);
      var lv=level(lightAt(u,0.5,false,0)-yy*0.12,x,y), c=shadeCol(sk.c,lv); if ((x+40)%4===0 && y>OY+top+3) c=shadeCol(sk.c,Math.min(lv,0)-1); if (y>=OY+hm-1) c=shadeCol(sk.c,Math.min(lv,0)-1); return c; }); } }
// Mantelschöße über den Oberschenkeln: Saum unten dunkler, Gehschlitz hinten, Taschenklappe vorn, Zugfalte zum vorderen Knie
function coatS(b,ch,hx,hy,knees,p){ var co=ch.coat; if (!co) return; var top=hy-3, hem=hy+(p.sit?3:(co.hem||8)); var xs=[hx-4,hx+4]; knees.forEach(function(k){ xs.push(Math.round(hx+(k[0]-hx)*((co.hem||8)/11))-1, Math.round(hx+(k[0]-hx)*((co.hem||8)/11))+1); });
  var lo=Math.min.apply(null,xs)-1, hi=Math.max.apply(null,xs)+1; if (p.sit){ lo=hx-4; hi=hx+9; } else if (p.cl){ lo+=p.cl; hi+=p.cl; }   // Folgebewegung: Saum schwingt nach
  var C=co.c, D=DN[C[2]];
  b.poly([[OX+hx-4,OY+top],[OX+hx+4,OY+top],[OX+hi,OY+hem],[OX+lo,OY+hem]],function(x,y){ var yy=(y-OY-top)/Math.max(1,hem-top), x0=(OX+hx-4)+(lo-(hx-4))*yy, x1=(OX+hx+4)+(hi-(hx+4))*yy, u=(x+0.5-x0)/Math.max(1,x1-x0+1);
    var lv=level(lightAt(u,0.5,true,0)-yy*0.16,x,y), c=shadeCol(C,lv); if (y>=OY+hem-1 && u<0.85 && lv>-2) c=shadeCol(C,lv-1); return c; });
  if (co.plain) return;
  if (!p.sit){ var vx=OX+lo+2; for (var yy=OY+hem-4;yy<OY+hem-1;yy++) if (b.get(vx,yy)!==T) b.px(vx,yy,D);
    // Zugfalte vom Gesäß zum vorderen Knie
    var kf=knees[0][0]>knees[1][0]?knees[0]:knees[1]; if (kf[0]-hx>2.5) crease(b,OX+hx+1,OY+top+2,OX+Math.round(hx+(kf[0]-hx)*0.7),OY+hem-2,C,-1); }
  var px0=OX+hx+1, py=OY+top+2; for (var xx=px0;xx<px0+3;xx++){ if (b.get(xx,py)!==T) b.px(xx,py,D); if (b.get(xx,py-1)!==T) b.px(xx,py-1,C[1]); } }
function coatF(b,ch,hx,hy,p){ var co=ch.coat; if (!co) return; var top=hy-3, hem=hy+(p.sit?3:(co.hem||8)), w=co.w||6, C=co.c, D=DN[C[2]], cl=p.sit?0:(p.cl||0);
  b.poly([[OX+hx-w,OY+top],[OX+hx+w,OY+top],[OX+hx+w+1+cl,OY+hem],[OX+hx-w-1+cl,OY+hem]],function(x,y){ var yy=(y-OY-top)/Math.max(1,hem-top), u=(x+0.5-(OX+hx-w-yy))/(2*w+1+2*yy);
    var lv=level(lightAt(u,0.5,false,0)-yy*0.16,x,y), c=shadeCol(C,lv);
    var dx=x-OX-hx; if (p.v==='F'){ if (Math.abs(dx+0.5)<0.6) c=shadeCol(C,Math.min(lv,0)-1); else if (dx===1 && !co.plain) c=shadeCol(C,lv+1); } else if (!co.plain && dx===0 && y>OY+hem-5) c=D;
    if (y>=OY+hem-1 && lv>-2) c=shadeCol(C,lv-1); return c; });
  if (p.v==='F' && !p.sit && !co.plain){ var py=OY+top+2; [[OX+hx-w+1,OX+hx-w+3],[OX+hx+w-3,OX+hx+w-1]].forEach(function(q){ for (var x=q[0];x<=q[1];x++){ if (b.get(x,py)!==T) b.px(x,py,D); if (b.get(x,py-1)!==T) b.px(x,py-1,UP[b.get(x,py-1)]); } }); } }

M.poseBuf=function(p,chId,t){ var ch=CH[chId]; if (!ch) throw new Error('keine Figur '+chId); var k=JSON.stringify(p)+(p.it==='cig'||p.it==='candle'?Math.floor((t||0)/300)%2:'')+(p.um>=5?'w'+Math.floor((t||0)/90)%24:''); return ch.cache[k]||(ch.cache[k]=render(p,ch,t)); };
// Lichttabellen der Räume färben die Figuren um (Nacht, Lampenlicht) und nehmen dabei je Farbe die nächste Palettenfarbe. Benachbarte Stufen
// einer Rampe (Licht, Mitte, Schatten, Glanzkante) fallen so oft auf dieselbe Farbe, und die Zeichnung der Figur verschwimmt. detailLut()
// macht aus der Raumtabelle eine für Figuren: Stufen, die heller sind als ihr dunkler Nachbar, bleiben auch nach dem Umfärben heller
// (eine Stufe der Zielrampe höher), dunkle bleiben dunkel. Einmal je Tabelle berechnet.
var DLUT=typeof WeakMap!=='undefined'?new WeakMap():null, LUM=M.lum, ORD=null, BRT={};
// dieselbe Farbe, eine Spur heller (nächste Palettenfarbe zu einer aufgehellten Fassung, damit der Farbton bleibt; zur Not die Rampe hinauf)
function brighter(c){ if (BRT[c]!==undefined) return BRT[c]; var q=M.RGB[c], out=c; if (q){ for (var f=1.18;f<1.9 && out===c;f+=0.12){ var n=M.nearest(Math.min(255,q[0]*f+5),Math.min(255,q[1]*f+5),Math.min(255,q[2]*f+5)); if (n!==c && LUM(n)>LUM(c)) out=n; } }
  if (out===c && UP[c]!==c && LUM(UP[c])>LUM(c)) out=UP[c]; return (BRT[c]=out); }
M.detailLut=function(lut){ if (!lut || !DLUT) return lut; var r=DLUT.get(lut); if (r) return r; r=new Uint8Array(256); r.set(lut);
  if (!ORD){ ORD=[]; for (var i=0;i<(M.NBASE||M.NCOL);i++) ORD.push(i); ORD.sort(function(a,b){ return LUM(a)-LUM(b); }); }
  for (var k=0;k<ORD.length;k++){ var c=ORD[k], d=DN[c]; if (d===c || d===T || LUM(d)>=LUM(c)) continue; var lo=r[d], hi=r[c];
    if (LUM(hi)<=LUM(lo)+2){ var u=brighter(lo); if (u!==lo) r[c]=u; } }
  DLUT.set(lut,r); return r; };
// zeichnen mit Füßen bei (x,y). opt: {lut, alpha 0..1 (gedithert), t (ms, für Schimmer), mask (Uint8Array, 320*144), mv (Maskenwert), scale, rawLut (Tabelle unverändert)}
M.drawPose=function(fb,x,y,pose,facing,chId,opt){ opt=opt||{}; var s=M.poseBuf(pose,chId,opt.t), fl=facing==='L', lut=opt.lut&&!opt.rawLut?M.detailLut(opt.lut):opt.lut, al=opt.alpha===undefined?1:opt.alpha, t=opt.t||0, sc=opt.scale||1;
  var W=fb.w, H=opt.h||fb.h, mask=opt.mask, mv=opt.mv||0;
  var shimmer=(al<1)? Math.floor(t/90) : 0;
  var W2=Math.round(s.w*sc), H2=Math.round(s.h*sc), bx=Math.round(x)-Math.round(OX*sc)+(fl?1:0), by=Math.round(y)-Math.round(OY*sc);
  for (var j=0;j<H2;j++){ var yy=by+j; if (yy<0||yy>=H) continue; var sy=sc===1?j:Math.min(s.h-1,Math.floor(j/sc));
    var wob=(al<1 && opt.wobble)? Math.round(Math.sin(t/260+j*0.35)*0.6) : 0;
    for (var i=0;i<W2;i++){ var sx=sc===1?i:Math.min(s.w-1,Math.floor(i/sc)); var c=s.d[sy*s.w+(fl?s.w-1-sx:sx)]; if (c===T) continue; var xx=bx+i+wob; if (xx<0||xx>=W) continue;
      if (al<1 && bayer(xx+shimmer,yy+(shimmer>>1))>=al) continue;
      fb.d[yy*W+xx]=lut?lut[c]:c; if (mask) mask[yy*W+xx]=mv; } }
  if (opt.rim && opt.rim.length && sc===1 && al>=1) rimPass(fb,s,bx,by,fl,opt.rim,H,mask,mv); };
// Kapitel 3, Punkt 2: Licht der Lampen auf der Figur. Jede Lampe (Bildschirmkoordinaten lx/ly, Stärke s, Farbe w/c) färbt die Kante,
// die ihr zugewandt ist (Nachbarpixel in Richtung Lampe ist leer), in Lampenfarbe – warm aus der Rampe f, kalt aus b; bei starkem Licht
// eine Stufe dunkler auch das Pixel dahinter. Schwaches Licht gerastert. Steht die Lampe fast genau über/hinter der Figur, bekommen
// auch die Seiten einen schwachen Saum (Gegenlicht).
var RIMW=null, RIMC=null;
function rimCol(c,col){ if (!RIMW){ RIMW=[P.f2,P.f3,P.f4,P.f5]; RIMC=[P.b1,P.b2,P.b4,P.b5]; } var L=M.lum(c), r=col==='c'?RIMC:RIMW; return r[L<55?0:(L<100?1:(L<160?2:3))]; }
function rimPass(fb,s,bx,by,fl,rims,H,mask,mv){ var W=fb.w, sw=s.w, sh=s.h, d=s.d;
  function occ(X,Y){ var i=X-bx, j=Y-by; if (i<0||j<0||i>=sw||j>=sh) return false; return d[j*sw+(fl?sw-1-i:i)]!==T; }
  for (var r=0;r<rims.length;r++){ var R=rims[r], st=R.s, back=Math.abs(R.lx-(bx+sw/2))<14 && R.ly<by+24;
    for (var j=0;j<sh;j++){ var Y=by+j; if (Y<0||Y>=H) continue; for (var i=0;i<sw;i++){ var X=bx+i; if (X<0||X>=W || !occ(X,Y)) continue;
      var dx=R.lx-X, dy=R.ly-Y, ax=Math.abs(dx), ay=Math.abs(dy), sx=ax>ay*0.5?(dx>0?1:-1):0, sy=ay>ax*0.5?(dy>0?1:-1):0;
      var edge=!occ(X+sx,Y+sy), side=false; if (!edge && back) side=(!occ(X-1,Y)||!occ(X+1,Y)) && j<sh*0.75;
      if (!edge && !side) continue; var k=Y*W+X, a=side?st*0.45:st; if (a<0.55 && bayer(X,Y)>=a/0.55) continue;
      var c=rimCol(fb.d[k],R.col); fb.d[k]=c; if (mask) mask[k]=mv;
      if (edge && st>0.7 && occ(X-sx,Y-sy) && bayer(X+1,Y)<st-0.45){ var k2=(Y-sy)*W+(X-sx); if (Y-sy>=0&&Y-sy<H&&X-sx>=0&&X-sx<W) fb.d[k2]=M.DN[c]; } } } } }

// ---------------------------------------------------------------- Posen-Bibliothek
function S(o){ var p={v:'S',h:[0,-23],nf:[1,0,'f'],ff:[-2,0,'f'],nh:[1,-21],fh:[-2,-21]}; for (var k in o) p[k]=o[k]; return p; }
function F(o,v){ var p={v:v||'F',h:[0,-23],lf:[-3,0],rf:[3,0],lh:[-7,-21],rh:[7,-21]}; for (var k in o) p[k]=o[k]; return p; }
M.poseS=S; M.poseF=F;
var A={};
// Stand: Gewicht auf dem hinteren Bein, der vordere Fuß etwas vor, Arme locker (Ellbogen leicht gebeugt, Hände etwas vor der Hüfte).
// Atmen alle drei Sekunden (Kopf und Hände einen Pixel höher), Lidschlag, später ein Wechsel des Standbeins.
var ST={nf:[2,0,'f'],ff:[-2,0,'f'],nh:[2,-22],fh:[-1,-22]};
function st(o){ var p={}, k; for (k in ST) p[k]=ST[k]; if (o) for (k in o) p[k]=o[k]; return S(p); }
M.poseStand=st;
var UPB={ho:[0,-1],nh:[2,-23],fh:[-1,-23]}, SHB={h:[-1,-23],nh:[1,-22],fh:[-2,-22],nf:[2,0,'f'],ff:[-3,0,'f']};
function mix(a,b){ var p={}, k; for (k in a) p[k]=a[k]; for (k in b) p[k]=b[k]; return p; }
A.idleS=[[st({}),1300],[st(UPB),900],[st({}),1200],[st({hd:'b'}),110],[st({}),1500],[st(UPB),900],[st({}),700],[st(SHB),1700],[st(mix(SHB,{hd:'b'})),110],[st(mix(SHB,{ho:[0,-1]})),900],[st(SHB),900]];
A.idleF=[[F({}),1200],[F({ho:[0,-1],lh:[-7,-22],rh:[7,-22]}),600],[F({}),900],[F({hd:'b'}),110],[F({}),900]];
A.idleB=[[F({},'B'),1400],[F({ho:[0,-1]},'B'),700]];
// Gehen: leicht vorgeneigt, die Arme schwingen gegen die Beine, der vordere Arm angewinkelt, der hintere fast gestreckt; Kopf wippt mit der Hüfte
A.walkS=[
 S({h:[0,-21],ln:1,nf:[7,0,'h'],ff:[-7,0,'t'],nh:[-5,-21],fh:[5,-23]}),
 S({h:[0,-22],ln:1,nf:[4,0,'f'],ff:[-4,-2,'f'],nh:[-3,-21],fh:[3,-22]}),
 S({h:[0,-23],ln:1,nf:[0,0,'f'],ff:[0,-3,'f'],nh:[0,-21],fh:[0,-21],ho:[0,-1]}),
 S({h:[0,-22],ln:1,nf:[-4,0,'f'],ff:[4,-2,'f'],nh:[3,-22],fh:[-3,-21]}),
 S({h:[0,-21],ln:1,nf:[-7,0,'t'],ff:[7,0,'h'],nh:[5,-23],fh:[-5,-21]}),
 S({h:[0,-22],ln:1,nf:[-4,-2,'f'],ff:[4,0,'f'],nh:[3,-22],fh:[-3,-21]}),
 S({h:[0,-23],ln:1,nf:[0,-3,'f'],ff:[0,0,'f'],nh:[0,-21],fh:[0,-21],ho:[0,-1]}),
 S({h:[0,-22],ln:1,nf:[4,-2,'f'],ff:[-4,0,'f'],nh:[-3,-21],fh:[3,-22]})];
function walkFB(v){ return [
 F({h:[0,-22],lf:[-3,1],rf:[3,-1],lh:[-7,-22],rh:[7,-20]},v), F({h:[0,-23],lf:[-3,0],rf:[3,-3],lh:[-7,-21],rh:[7,-21]},v),
 F({h:[0,-24],lf:[-3,-1],rf:[3,-3],lh:[-7,-21],rh:[7,-21]},v), F({h:[0,-23],lf:[-3,-1],rf:[3,0],lh:[-7,-20],rh:[7,-22]},v),
 F({h:[0,-22],lf:[-3,-1],rf:[3,1],lh:[-7,-20],rh:[7,-22]},v), F({h:[0,-23],lf:[-3,-3],rf:[3,0],lh:[-7,-21],rh:[7,-21]},v),
 F({h:[0,-24],lf:[-3,-3],rf:[3,-1],lh:[-7,-21],rh:[7,-21]},v), F({h:[0,-23],lf:[-3,0],rf:[3,-1],lh:[-7,-22],rh:[7,-20]},v)]; }
A.walkF=walkFB('F'); A.walkB=walkFB('B');
// Geister schweben: kein Schritt, nur ein Atmen
A.floatS=[[S({nf:[1,-1,'f'],ff:[-2,-1,'f']}),700],[S({h:[0,-24],nf:[1,-2,'f'],ff:[-2,-2,'f'],ho:[0,-1]}),700]];
A.floatF=[[F({lf:[-3,-1],rf:[3,-1]}),700],[F({h:[0,-24],lf:[-3,-2],rf:[3,-2],ho:[0,-1]}),700]];
function reach(y,x){ var up=y<-36; return [[S({}),80],[S({nh:[4,-27]}),90],[S({nh:[x-2,y+2],ln:1,nf:up?[2,0,'t']:[1,0,'f']}),90],[S({nh:[x,y],ln:1,h:[1,-23],nf:up?[2,0,'t']:[2,0,'f'],hd:up?'u':'n'}),280],[S({nh:[x-2,y+2],ln:1}),90],[S({nh:[4,-27]}),80],[S({}),60]]; }
A.reachM=reach(-30,11); A.reachL=reach(-18,11); A.reachH=reach(-44,8);
A.kneelF=[[F({}),70],[F({h:[0,-18],lf:[-4,0],rf:[4,0],lh:[-6,-12],rh:[6,-12]}),110],[F({h:[0,-14],lf:[-5,0],rf:[5,0],lh:[-3,-4],rh:[3,-3],hd:'b'}),260],[F({h:[0,-14],lf:[-5,0],rf:[5,0],lh:[-2,-3],rh:[2,-2]}),200],[F({h:[0,-18],lf:[-4,0],rf:[4,0]}),110],[F({}),60]];
A.pickup=[[S({}),70],[S({h:[1,-21],ln:2,nf:[3,0,'f'],nh:[6,-17],fh:[1,-19]}),90],[S({h:[2,-17],ln:4,nf:[6,0,'f'],ff:[-4,0,'t'],nh:[12,-4],fh:[6,-10]}),110],[S({h:[2,-17],ln:4,nf:[6,0,'f'],ff:[-4,0,'t'],nh:[11,-3],fh:[6,-10],hd:'b'}),220],[S({h:[1,-21],ln:2,nf:[3,0,'f'],nh:[7,-18],fh:[1,-19]}),100],[S({nh:[3,-25]}),110],[S({}),60]];
A.reachB=[[F({},'B'),70],[F({rh:[5,-29]},'B'),100],[F({rh:[4,-33]},'B'),100],[F({rh:[4,-34],h:[0,-23]},'B'),280],[F({rh:[5,-29]},'B'),100],[F({},'B'),60]];
A.reachBH=[[F({},'B'),70],[F({lh:[-6,-31],rh:[6,-31]},'B'),100],[F({lh:[-5,-41],rh:[5,-41],h:[0,-24]},'B'),300],[F({lh:[-5,-41],rh:[5,-41],h:[0,-24]},'B'),200],[F({lh:[-6,-31],rh:[6,-31]},'B'),100],[F({},'B'),60]];
A.knock=[[F({},'B'),60],[F({rh:[4,-31]},'B'),90],[F({rh:[4,-33]},'B'),80],[F({rh:[4,-31]},'B'),80],[F({rh:[4,-33]},'B'),80],[F({rh:[4,-31]},'B'),80],[F({rh:[4,-33]},'B'),80],[F({},'B'),60]];
A.push=[[S({}),70],[S({ff:[-7,0,'t'],h:[0,-22],ln:2,nh:[8,-29],fh:[7,-28]}),100],[S({ff:[-9,0,'t'],h:[2,-22],ln:4,nh:[12,-29],fh:[11,-28],hd:'b'}),320],[S({ff:[-7,0,'t'],h:[0,-22],ln:2,nh:[8,-29],fh:[7,-28]}),100],[S({}),60]];
A.pull=[[S({}),70],[S({nh:[10,-28],fh:[9,-27],ln:1}),100],[S({h:[-3,-22],ln:-3,nf:[5,0,'h'],ff:[-5,0,'f'],nh:[7,-28],fh:[6,-27],hd:'b'}),320],[S({nh:[5,-26],fh:[4,-25]}),90],[S({}),60]];
A.think=[[S({}),80],[S({nh:[3,-30]}),100],[S({nh:[4,-37],fh:[2,-28]}),520],[S({nh:[4,-38],fh:[2,-28],hd:'b'}),120],[S({nh:[4,-37],fh:[2,-28]}),520],[S({nh:[3,-30]}),90],[S({}),60]];
A.look=[[S({}),60],[S({ln:1,h:[1,-23],ho:[1,0]}),140],[S({ln:1,h:[1,-23],ho:[1,0]}),700],[S({ln:1,h:[1,-23],ho:[1,0],hd:'b'}),100],[S({}),80]];
A.read=[[F({}),60],[F({lh:[-5,-27],rh:[4,-27]}),120],[F({it:'paper',lh:[-5,-28],rh:[4,-28],ho:[0,1]}),1400],[F({}),60]];
A.shrug=[[F({}),60],[F({lh:[-9,-25],rh:[9,-25],ho:[0,1]}),160],[F({lh:[-10,-27],rh:[10,-27],ho:[0,1],hd:'b'}),420],[F({}),80]];
A.talkS=[[S({hd:'o'}),130],[S({}),110],[S({hd:'o',nh:[5,-27]}),130],[S({nh:[6,-28]}),120],[S({hd:'o',nh:[6,-28]}),120],[S({nh:[5,-27]}),110],[S({hd:'o'}),120],[S({}),150]];
A.talkF=[[F({hd:'o'}),130],[F({}),110],[F({hd:'o',rh:[7,-26]}),130],[F({rh:[8,-27]}),120],[F({hd:'o'}),120],[F({}),150]];
A.talkB=[[F({},'B'),400]];
// weitere Sprechgesten (05_engine.js wählt je Satz eine): mit beiden Händen erklären, ruhig mit Nicken, mit offener Hand
A.talkS2=[[st({hd:'o',nh:[5,-26],fh:[3,-26]}),140],[st({nh:[6,-27],fh:[4,-27]}),120],[st({hd:'o',nh:[6,-25],fh:[4,-25]}),130],[st({nh:[5,-26],fh:[3,-26]}),110],[st({hd:'o',nh:[4,-24],fh:[2,-24]}),130],[st({}),160]];
A.talkS3=[[st({hd:'o'}),150],[st({ho:[0,1]}),130],[st({hd:'o'}),140],[st({}),150],[st({hd:'o',ho:[0,1]}),130],[st({}),170]];
A.talkS4=[[st({hd:'o',nh:[4,-24]}),140],[st({nh:[7,-26]}),130],[st({hd:'o',nh:[7,-26]}),130],[st({nh:[6,-25],ho:[1,0]}),120],[st({hd:'o',nh:[5,-24]}),130],[st({}),150]];
A.talkF2=[[F({hd:'o',lh:[-6,-25],rh:[6,-25]}),140],[F({lh:[-7,-26],rh:[7,-26]}),120],[F({hd:'o',lh:[-6,-24],rh:[6,-24]}),130],[F({}),150]];
A.talkF3=[[F({hd:'o'}),150],[F({ho:[0,1]}),130],[F({hd:'o'}),140],[F({}),160]];
// ---------------------------------------------------------------- Gesten im Leerlauf (05_engine.js spielt sie zwischendurch, siehe fidgetTick)
// pk/pkF: Hand in der Tasche (wird nicht gemalt), hb: Kopf über die Schulter nach hinten gedreht
var PK=mix(ST,{nh:[2,-22],pk:1,fh:[-1,-22],pkF:1});
A.fgPockets=[[st({}),90],[st({nh:[3,-23]}),110],[S(PK),2600],[S(mix(PK,{ho:[0,-1]})),800],[S(mix(PK,{hd:'b'})),110],[S(PK),2200],[S(mix(PK,{h:[-1,-23],nf:[2,0,'f'],ff:[-3,0,'f']})),1800],[st({nh:[3,-23]}),110],[st({}),90]];
A.fgLookBack=[[st({}),80],[st({ho:[-1,0]}),90],[st({hb:1,ho:[-1,0]}),1500],[st({hb:1,ho:[-1,0],hd:'b'}),110],[st({hb:1,ho:[-1,0]}),800],[st({ho:[-1,0]}),90],[st({}),80]];
A.fgWatch=[[st({}),80],[st({nh:[4,-26],fh:[2,-25]}),120],[st({nh:[5,-28],fh:[3,-27],ho:[1,1]}),900],[st({nh:[5,-28],fh:[3,-27],ho:[1,1],hd:'b'}),110],[st({nh:[5,-28],fh:[3,-27],ho:[1,1]}),500],[st({nh:[4,-25]}),110],[st({}),80]];
A.fgChin=[[st({}),80],[st({nh:[4,-30]}),110],[st({nh:[6,-37]}),420],[st({nh:[6,-36],hd:'b'}),200],[st({nh:[6,-37]}),260],[st({nh:[6,-36]}),260],[st({nh:[6,-37],ho:[1,0]}),700],[st({nh:[4,-30]}),110],[st({}),80]];
A.fgSigh=[[st({}),80],[st({ho:[0,-1],nh:[2,-24],fh:[-1,-24]}),600],[st({ho:[0,-1],nh:[2,-24],fh:[-1,-24],hd:'b'}),300],[st({ho:[0,1],h:[0,-22],nh:[2,-21],fh:[-1,-21]}),900],[st({}),200]];
A.fgCollar=[[st({}),80],[st({nh:[4,-29],fh:[3,-29]}),120],[st({nh:[4,-33],fh:[3,-33],hd:'b'}),260],[st({nh:[5,-33],fh:[3,-34]}),200],[st({nh:[4,-33],fh:[3,-33]}),200],[st({nh:[4,-28],fh:[3,-28]}),110],[st({}),80]];
A.fgArms=[[st({}),80],[st({nh:[4,-25],fh:[3,-25]}),120],[st({nh:[4,-27],fh:[4,-28]}),3000],[st({nh:[4,-27],fh:[4,-28],hd:'b'}),110],[st({nh:[4,-27],fh:[4,-28],ho:[0,-1]}),900],[st({nh:[4,-27],fh:[4,-28]}),1800],[st({nh:[4,-25],fh:[3,-25]}),110],[st({}),80]];
A.fgBehind=[[st({}),80],[st({nh:[-1,-22],fh:[-3,-22]}),120],[st({nh:[-3,-24],fh:[-4,-24]}),2800],[st({nh:[-3,-24],fh:[-4,-24],hd:'b'}),110],[st({nh:[-3,-24],fh:[-4,-24],ho:[0,-1]}),900],[st({nh:[-3,-24],fh:[-4,-24]}),1600],[st({nh:[-1,-22],fh:[-3,-22]}),110],[st({}),80]];
A.fgYawn=[[st({}),80],[st({nh:[4,-30]}),120],[st({nh:[5,-35],hd:'o',ho:[0,-1]}),700],[st({nh:[5,-35],hd:'o',ho:[0,-1]}),300],[st({nh:[4,-30],hd:'b'}),160],[st({}),100]];
A.fgShift=[[st(SHB),1800],[st(mix(SHB,{hd:'b'})),110],[st(mix(SHB,{ho:[0,-1]})),900],[st(SHB),700]];
A.fgLookF=[[F({hd:'l'}),1100],[F({hd:'l'}),300],[F({}),400],[F({hd:'r'}),1000],[F({hd:'b'}),110],[F({}),300]];
A.fgArmsF=[[F({}),80],[F({lh:[1,-26],rh:[-1,-26]}),120],[F({lh:[3,-28],rh:[-3,-28]}),3200],[F({lh:[3,-28],rh:[-3,-28],hd:'b'}),110],[F({lh:[3,-28],rh:[-3,-28],ho:[0,-1]}),1200],[F({lh:[1,-26],rh:[-1,-26]}),110],[F({}),80]];
A.fgPocketsF=[[F({}),80],[F({lh:[-5,-22],rh:[5,-22]}),110],[F({lh:[-4,-21],rh:[4,-21],pk:1}),3000],[F({lh:[-4,-21],rh:[4,-21],pk:1,hd:'b'}),110],[F({lh:[-4,-21],rh:[4,-21],pk:1,hd:'l'}),1200],[F({lh:[-4,-21],rh:[4,-21],pk:1}),900],[F({lh:[-5,-22],rh:[5,-22]}),110],[F({}),80]];
A.fgShiftF=[[F({h:[-1,-23],lf:[-3,0],rf:[3,0]}),1900],[F({h:[-1,-23],lf:[-3,0],rf:[3,0],hd:'b'}),110],[F({h:[-1,-23],lf:[-3,0],rf:[3,0],ho:[0,-1]}),900],[F({}),300]];
A.fgScratchF=[[F({}),80],[F({rh:[5,-33]}),110],[F({rh:[3,-41],ho:[0,1]}),200],[F({rh:[4,-42],ho:[0,1]}),180],[F({rh:[3,-41],ho:[0,1],hd:'b'}),180],[F({rh:[4,-42],ho:[0,1]}),180],[F({rh:[5,-33]}),110],[F({}),80]];
A.fgShiftB=[[F({h:[1,-23]},'B'),1900],[F({h:[1,-23],ho:[0,-1]},'B'),900],[F({},'B'),400]];
A.fgLookB=[[F({ho:[-1,0]},'B'),1300],[F({},'B'),400],[F({ho:[1,0]},'B'),1100],[F({},'B'),300]];
// Mala (schwebend, die Füße ein, zwei Pixel über dem Boden): über die Schulter sehen, sich selbst umarmen, nach vorn spähen
function fl(o,up){ var p={h:[0,up?-24:-23],nf:[1,up?-2:-1,'f'],ff:[-2,up?-2:-1,'f']}, k; if (up) p.ho=[0,-1]; if (o) for (k in o) p[k]=o[k]; return S(p); }
A.malaLookBack=[[fl({}),90],[fl({hb:1,ho:[-1,0]}),900],[fl({hb:1,ho:[-1,-1]},1),900],[fl({hb:1,ho:[-1,0],hd:'b'}),110],[fl({hb:1,ho:[-1,0]}),600],[fl({},1),300]];
A.malaHug=[[fl({}),90],[fl({nh:[3,-25],fh:[2,-25]}),130],[fl({nh:[4,-27],fh:[3,-28]}),900],[fl({nh:[4,-27],fh:[3,-28]},1),900],[fl({nh:[4,-27],fh:[3,-28],hd:'b'},1),110],[fl({nh:[4,-27],fh:[3,-28]}),900],[fl({nh:[4,-27],fh:[3,-28]},1),900],[fl({nh:[3,-25],fh:[2,-25]}),130],[fl({}),90]];
A.malaPeer=[[fl({}),90],[fl({ln:1,ho:[1,0]}),900],[fl({ln:1,ho:[1,-1]},1),900],[fl({ln:1,ho:[1,0],hd:'b'}),110],[fl({ln:1,ho:[1,0]}),700],[fl({},1),200]];
A.malaLookF=[[F({lf:[-3,-1],rf:[3,-1],hd:'l'}),1000],[F({h:[0,-24],lf:[-3,-2],rf:[3,-2],ho:[0,-1],hd:'l'}),700],[F({lf:[-3,-1],rf:[3,-1]}),400],[F({h:[0,-24],lf:[-3,-2],rf:[3,-2],ho:[0,-1],hd:'r'}),900],[F({lf:[-3,-1],rf:[3,-1],hd:'b'}),110]];
A.sit=[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1}),1300],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1,hd:'b'}),110],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1,ho:[0,-1]}),900]];
A.sitTalk=[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1,hd:'o'}),130],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[4,-14],sit:1}),130],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-21],fh:[4,-14],sit:1,hd:'o'}),130],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1}),150]];
A.sitF=[[F({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-6,-12],rh:[6,-12],sit:1}),1300],[F({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-6,-12],rh:[6,-12],sit:1,hd:'b'}),110]];
A.smoke=[[S({}),80],[S({nh:[4,-27],it:'cig'}),140],[S({nh:[4,-36],it:'cig',hd:'b'}),700],[S({nh:[5,-30],it:'cig',ho:[0,-1]}),600],[S({nh:[3,-24],it:'cig'}),900],[S({nh:[4,-36],it:'cig',hd:'b'}),600],[S({nh:[3,-24],it:'cig'}),500],[S({}),80]];
// Telefonieren (Marko, alle Kapitel): dial – das Handy aus der Manteltasche nehmen, mit gesenktem Blick wählen (vier Tipps), ans Ohr; answer – nur herausnehmen und ans Ohr;
// phoneHold/phoneTalk – am Ohr halten bzw. dabei sprechen (als idle/talk, solange das Gespräch läuft; 05_engine.js phoneIntro/phoneEnd)
A.dial=[[S({}),80],[S({nh:[3,-18],hd:'b'}),160],[S({nh:[4,-17],it:'phone'}),140],[S({nh:[7,-26],it:'phone',ho:[1,1]}),240],[S({nh:[7,-27],it:'phone',ho:[1,1],fh:[0,-25]}),130],[S({nh:[7,-26],it:'phone',ho:[1,1],fh:[0,-26]}),130],
  [S({nh:[7,-27],it:'phone',ho:[1,1],fh:[0,-25]}),130],[S({nh:[7,-26],it:'phone',ho:[1,1],fh:[0,-26]}),130],[S({nh:[7,-27],it:'phone',ho:[1,1],fh:[0,-25]}),200],[S({nh:[5,-32],it:'phone'}),110],[S({nh:[2,-37],it:'phone'}),140]];
A.answer=[[S({}),80],[S({nh:[3,-18],hd:'b'}),140],[S({nh:[4,-17],it:'phone'}),120],[S({nh:[5,-30],it:'phone'}),110],[S({nh:[2,-37],it:'phone'}),120]];
A.phoneHold=[[S({nh:[2,-37],it:'phone'}),1400],[S({nh:[2,-37],it:'phone',hd:'b'}),110],[S({nh:[2,-37],it:'phone',ho:[0,-1]}),900],[S({nh:[2,-36],it:'phone',ho:[1,0]}),1100]];
A.phoneTalk=[[S({nh:[2,-37],it:'phone',hd:'o'}),130],[S({nh:[2,-37],it:'phone'}),110],[S({nh:[2,-37],it:'phone',hd:'o',ho:[1,0]}),130],[S({nh:[2,-37],it:'phone',ho:[1,0]}),120],[S({nh:[2,-37],it:'phone',hd:'o'}),120],[S({nh:[2,-37],it:'phone'}),150]];
A.drink=[[S({}),60],[S({nh:[6,-28],it:'cup'}),160],[S({nh:[4,-36],it:'cup',ln:-1,hd:'b'}),700],[S({nh:[6,-28],it:'cup'}),300],[S({}),80]];
A.surprise=[[S({}),60],[S({h:[0,-21],hd:'b',nh:[1,-20],fh:[-1,-20]}),90],[S({h:[-1,-24],ln:-2,nh:[5,-33],fh:[-3,-31]}),220],[S({h:[-1,-23],ln:-1,nh:[3,-27],fh:[-2,-26]}),500],[S({}),80]];
A.headache=[[F({}),60],[F({lh:[-4,-36],rh:[5,-30],hd:'b',ho:[0,1]}),260],[F({lh:[-4,-37],rh:[5,-30],hd:'b',ho:[0,1]}),900],[F({lh:[-4,-36],rh:[5,-30]}),300],[F({}),80]];
A.crouchS=[[S({h:[2,-14],ln:3,nf:[8,0,'f'],ff:[-3,0,'t'],nh:[9,-8],fh:[5,-10]}),999999]];
A.give=[[S({}),60],[S({nh:[8,-27]}),120],[S({nh:[12,-28],ln:1}),420],[S({nh:[8,-27]}),100],[S({}),60]];
A.waitF=[[F({lh:[-2,-19],rh:[2,-19]}),1400],[F({lh:[-2,-19],rh:[2,-19],hd:'b'}),110],[F({lh:[-2,-19],rh:[2,-19],ho:[0,-1]}),900]];
A.waitS=[[S({nh:[3,-19],fh:[2,-19],ln:1}),1400],[S({nh:[3,-19],fh:[2,-19],ln:1,hd:'b'}),110],[S({nh:[3,-19],fh:[2,-19],ln:1,ho:[1,0]}),1200]];
A.hugSelf=[[F({lh:[3,-28],rh:[-3,-28]}),1500],[F({lh:[3,-28],rh:[-3,-28],hd:'b'}),110]];
A.tinF=[[F({it:'tin'}),1600],[F({it:'tin',hd:'b'}),110]];
A.bow=[[S({}),80],[S({ln:3,h:[1,-23],nh:[2,-22],fh:[-1,-22],ho:[1,1]}),300],[S({ln:5,h:[1,-22],nh:[3,-21],fh:[0,-21],ho:[2,2],hd:'b'}),800],[S({ln:3,h:[1,-23]}),200],[S({}),100]];
// Schwindel und Übelkeit (Marko, Kapitel 1): abstützen, die Hand an die Stirn, die Hand vor den Mund; im Sitzen eigene Fassungen
A.steady=[[S({}),80],[S({ln:2,nh:[10,-19],fh:[8,-20]}),240],[S({ln:3,nh:[11,-17],fh:[9,-18],hd:'b',ho:[1,1]}),1500],[S({ln:2,nh:[10,-19],fh:[8,-20],ho:[0,1]}),500],[S({}),120]];
A.dizzy=[[F({}),80],[F({h:[-1,0],rh:[4,-35],hd:'b'}),380],[F({h:[1,0],rh:[4,-35],hd:'b'}),380],[F({rh:[4,-34],ho:[0,1]}),700],[F({}),100]];
A.nausea=[[S({}),80],[S({ln:1,nh:[5,-22],hd:'b'}),500],[S({ln:2,nh:[4,-31],hd:'b',ho:[1,1]}),1000],[S({ln:1,nh:[5,-22]}),400],[S({}),100]];
var SIT={h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],fh:[4,-14],sit:1};
function sitP(o){ var r={}; Object.keys(SIT).forEach(function(k){ r[k]=SIT[k]; }); Object.keys(o||{}).forEach(function(k){ r[k]=o[k]; }); if (!r.nh) r.nh=[6,-14]; return S(r); }
A.sitSick=[[sitP({}),200],[sitP({nh:[5,-24],hd:'b',ho:[1,1]}),1400],[sitP({ho:[0,1]}),700]];
A.sitDrink=[[sitP({}),120],[sitP({nh:[5,-24],it:'cup',hd:'b'}),900],[sitP({nh:[7,-16],it:'cup'}),500],[sitP({}),120]];
A.sitWrite=[[sitP({nh:[9,-15]}),300],[sitP({nh:[10,-15],hd:'b'}),300],[sitP({nh:[9,-16]}),300],[sitP({nh:[10,-15]}),300]];
M.ANIMS=A;
// Kontaktbild: bei welchem Bild die Aktion "passiert"
M.CONTACT={reachM:3,reachL:3,reachH:3,kneelF:2,pickup:3,reachB:3,reachBH:3,knock:2,push:2,pull:2,read:2,give:2,drink:2,smoke:2};
})(M);
