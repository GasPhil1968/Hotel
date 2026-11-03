/* ===== 97_k2_mem_b.js — Erinnerungsbilder Kapitel 2 (Sarajevo 1988–1994, und die Abfahrt 2011): 232 × 104 Pixel =====
   Gemalt in natürlichen Farben; das Spiel färbt sie danach geisterhaft (blau) oder als Erinnerung (sepia).
   Erwachsene und Lana mit siebzehn kommen aus dem Rig (M.drawPose). Kinder und Marko als Junge gibt es im Rig nicht:
   sie sind hier von Hand gebaut (Gelenke, Flächen, Kopf), mit demselben dunklen Umriss wie die Rig-Figuren. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
M.mem=M.mem||{};
function fill(b,x0,y0,w,h,fn){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c=fn(x,y); if (c!==undefined) b.px(x,y,c); } }
function fig(b,x,y,pose,face,id,opt){ try{ M.drawPose(b,x,y,pose,face,id,opt||{}); }catch(e){ console.error(e); } }
function edgeDark(b,amt){ M.light(b,M.lf.vignette(b.w,b.h,amt||2.4)); }
function cl(v,a,z){ return v<a?a:(v>z?z:v); }
var S=M.poseS;

// ---------------------------------------------------------------- handgemalte Figuren: ein kleiner Puffer, Füße bei (DOX,DOY), vorn = +x
var DW=48, DH=72, DOX=24, DOY=66;
function Doll(lx){ this.b=new M.Buf(DW,DH,T); this.lx=lx===undefined?1:lx; }
var D=Doll.prototype;
// Stoff: drei Töne [Schatten, Mitte, Licht], dazu wahlweise Streifen (st) alle sp Zeilen, sw Zeilen breit
function RR(c,st,sp,sw,so){ return {c:c,st:st||null,sp:sp||3,sw:sw||1,so:so||0}; }
function tn(Q,t,y){ if (Q.st){ var m=(((Math.round(y)+Q.so)%Q.sp)+Q.sp)%Q.sp; if (m<Q.sw) return Q.st[t]; } return Q.c[t]; }
D.px=function(x,y,c){ this.b.px(Math.round(x)+DOX,Math.round(y)+DOY,c); };
D.rect=function(x,y,w,h,c){ for (var j=0;j<h;j++) for (var i=0;i<w;i++) this.px(x+i,y+j,c); };
D.hl=function(x0,x1,y,c){ for (var x=Math.round(x0);x<=Math.round(x1);x++) this.px(x,y,c); };
D.vl=function(x,y0,y1,c){ for (var y=Math.round(y0);y<=Math.round(y1);y++) this.px(x,y,c); };
D.line=function(x0,y0,x1,y1,c){ this.b.line(Math.round(x0)+DOX,Math.round(y0)+DOY,Math.round(x1)+DOX,Math.round(y1)+DOY,c); };
// Glied als Kapsel, Licht von der Seite lx
D.seg=function(a,c,r,Q){ var b=this.b, lx=this.lx, ax=a[0]+DOX, ay=a[1]+DOY, cx=c[0]+DOX, cy=c[1]+DOY;
  var x0=Math.floor(Math.min(ax,cx)-r-1), x1=Math.ceil(Math.max(ax,cx)+r+1), y0=Math.floor(Math.min(ay,cy)-r-1), y1=Math.ceil(Math.max(ay,cy)+r+1);
  var vx=cx-ax, vy=cy-ay, L2=vx*vx+vy*vy, len=Math.sqrt(L2), nx=1, ny=0; if (len>1e-3){ nx=-vy/len; ny=vx/len; } else L2=1;
  if (nx*lx-ny*0.6<0){ nx=-nx; ny=-ny; }
  for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var px=x+0.5-ax, py=y+0.5-ay, t=cl((px*vx+py*vy)/L2,0,1), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=(qx*nx+qy*ny)/r; b.px(x,y,tn(Q,s>0.35?2:(s<-0.35?0:1),y-DOY)); } } };
// Fläche (Mantel, Rumpf), je Zeile quer beleuchtet
D.shape=function(pts,Q,lxo){ var b=this.b, lx=lxo||this.lx, m=new M.Buf(DW,DH,0); m.poly(pts.map(function(p){ return [p[0]+DOX,p[1]+DOY]; }),1);
  for (var y=0;y<DH;y++){ var a=-1,e=-1, x; for (x=0;x<DW;x++) if (m.d[y*DW+x]){ if (a<0) a=x; e=x; } if (a<0) continue;
    for (x=a;x<=e;x++){ if (!m.d[y*DW+x]) continue; var u=e>a?(x-a)/(e-a):0.5; if (lx<0) u=1-u; b.px(x,y,tn(Q,u>0.66?2:(u<0.3?0:1),y-DOY)); } } };
D.ell=function(cx,cy,rx,ry,c){ this.b.ellipse(cx+DOX,cy+DOY,rx,ry,typeof c==='function'?function(x,y){ return c(x-DOX,y-DOY); }:c); };
// Kopf: v 'S' (Profil, Gesicht nach +x), 'F' (von vorn), 'B' (von hinten).
// o: skin, hair (je [Schatten,Mitte,Licht]), st: 'short'|'braid'|'bun'|'long', cap/hood/scarf: Stoff [s,m,l], bob: Bommel, eye, tilt (Mütze schief)
D.head=function(cx,cy,v,o){ var s=this, rx=o.rx||4, ry=o.ry||4.5, K=o.skin, H=o.hair, lx=this.lx, cap=o.cap, hood=o.hood||o.scarf, eye=o.eye===undefined?P.k1:o.eye;
  var x0=Math.floor(cx-rx-1), x1=Math.ceil(cx+rx+1), y0=Math.floor(cy-ry-1), y1=Math.ceil(cy+ry+1), x, y;
  function tone3(Q,dx,dy){ var l=dx*lx*0.8-dy*0.5; return l>0.35?Q[2]:(l<-0.35?Q[0]:Q[1]); }
  for (y=y0;y<=y1;y++) for (x=x0;x<=x1;x++){ var dx=(x+0.5-cx)/rx, dy=(y+0.5-cy)/ry; if (dx*dx+dy*dy>1) continue; var c=tone3(K,dx,dy), hr=false;
    if (v==='S'){ var fx=dx*lx; hr=dy<-0.32 || (fx<-0.12 && dy<(o.st==='short'?0.55:1.1)); if (fx<-0.05 && fx>-0.45 && dy>0.0 && dy<0.42) hr=false; }
    else if (v==='F'){ hr=dy<-0.38 || (Math.abs(dx)>0.74 && dy<0.5); }
    else { hr=true; if (Math.abs(dx)>0.86 && Math.abs(dy)<0.28) hr=false; if (o.st==='short' && dy>0.72) hr=false; }
    if (hr) c=tone3(H,dx,dy);
    if (cap && dy<(o.capLo||-0.18)+(o.tilt?dx*o.tilt:0)) c=tone3(cap,dx,dy);
    if (hood){ var inF=v==='S'?(dx*lx>0.02 && dy>-0.5):(v==='F'?(Math.abs(dx)<0.62 && dy>-0.5):false); if (!inF) c=tone3(hood,dx,dy); }
    s.px(x,y,c); }
  if (cap && o.bob) s.ell(cx-(v==='S'?lx*rx*0.35:0),cy-ry-0.6,1.4,1.2,cap[2]);
  if (cap && o.rim!==false){ for (x=x0;x<=x1;x++){ var dx2=(x+0.5-cx)/rx, yy=cy+((o.capLo||-0.18)+(o.tilt?dx2*o.tilt:0))*ry; if (Math.abs(dx2)<=0.98) s.px(x,yy-0.5,cap[0]); } }
  if (hood) { if (v!=='F') s.ell(cx-(v==='S'?lx*rx*0.55:0),cy+ry*0.55,rx*0.75,ry*0.55,function(){ return hood[0]; }); }
  // Gesicht
  if (v==='S'){ s.px(cx+lx*rx*0.45,cy+ry*0.05,eye); s.px(cx+lx*(rx+0.4),cy+ry*0.18,K[2]); if (o.mouth) s.px(cx+lx*rx*0.62,cy+ry*0.58,K[0]); }
  if (v==='F'){ s.px(cx-rx*0.42,cy+ry*0.08,eye); s.px(cx+rx*0.42,cy+ry*0.08,eye); if (o.mouth!==false) s.px(cx,cy+ry*0.58,K[0]); }
  // Zopf
  if (o.st==='braid'){ var L=o.braid||8, bx, by, k;
    if (v==='S'){ bx=cx-lx*rx*0.7; by=cy+ry*0.55; for (k=0;k<L;k++){ var c2=(k&1)?H[1]:H[0]; s.px(bx-lx*(k>3?1:0),by+k,c2); s.px(bx-lx*(k>3?2:1),by+k,(k&1)?H[0]:H[1]); } s.px(bx-lx*2,by+L,o.tie||P.r3); s.px(bx-lx*2,by+L+1,H[1]); }
    else if (v==='B'){ bx=cx; by=cy+ry*0.8; for (k=0;k<L;k++){ s.px(bx,by+k,(k&1)?H[1]:H[2]); s.px(bx-1,by+k,(k&1)?H[0]:H[1]); } s.px(bx,by+L,o.tie||P.r3); s.px(bx-1,by+L,o.tie||P.r3); s.px(bx,by+L+1,H[1]); }
    else { bx=cx+rx*0.85; by=cy+ry*0.6; for (k=0;k<L;k++){ s.px(bx+(k>2?1:0),by+k,(k&1)?H[0]:H[1]); s.px(bx+(k>2?2:1),by+k,(k&1)?H[1]:H[2]); } s.px(bx+2,by+L,o.tie||P.r3); } }
  if (o.st==='bun'){ s.ell(cx-(v==='S'?lx*rx*0.75:0),cy-ry*(v==='S'?0.55:0.95),2,1.8,function(){ return H[1]; }); } };
D.done=function(){ M.outline(this.b,P.k1); return this; };
function put(b,d,x,y,face){ var fl=face==='L'; b.blit(d.b,Math.round(x)-(fl?DW-1-DOX:DOX),Math.round(y)-DOY,fl); }
function dnQ(Q){ return {c:Q.c.map(function(c){ return M.DN[c]; }),st:Q.st?Q.st.map(function(c){ return M.DN[c]; }):null,sp:Q.sp,sw:Q.sw,so:Q.so}; }
function Q3(names,st){ return RR(R(names),st?R(st):null); }

// Kind als Brustbild hinter einem Tisch oder einer Bank: v 'F' (von vorn) oder 'B' (von hinten). Ursprung = Tisch-/Bankkante, Mitte
function kidBust(o){ var s=o.s||1, v=o.v||'F', d=new Doll(o.lx||1), q=function(x,y){ return [x*s,y*s]; }, coat=o.coat, hy=-11*s, hw=o.wide?6.2:5.4;
  if (v==='F' && o.hand!=='up'){ d.seg(q(-4.4,-5.6),q(-5.3,-0.8),1.25*s,dnQ(coat)); d.seg(q(4.4,-5.6),q(5.3,-0.8),1.25*s,dnQ(coat)); }
  d.shape([q(-hw+0.8,-6.8),q(hw-0.8,-6.8),q(hw,-4.5),q(hw+0.4,3),q(-hw-0.4,3),q(-hw,-4.5)],coat);
  if (o.scarf) d.shape([q(-3.4,-7.4),q(3.4,-7.4),q(3.6,-5.2),q(-3.6,-5.2)],RR(o.scarf));
  if (v==='F') d.rect(Math.round(-1*s),Math.round(-7.6*s),Math.max(2,Math.round(2*s)),Math.max(1,Math.round(1.2*s)),o.skin[0]);
  d.head(0,hy,v,{rx:o.rx||4*s,ry:o.ry||4.4*s,skin:o.skin,hair:o.hair,st:o.st,cap:o.cap,hood:o.hood,bob:o.bob,braid:Math.round(6*s),tilt:o.tilt,mouth:s>0.8});
  if (v==='F'){ if (o.hand==='up'){ d.seg(q(4.4,-5.6),q(6,-12),1.2*s,coat); d.seg(q(6,-12),q(6.4,-18),1.0*s,coat); d.px(6.4*s,-18.8*s,o.skin[2]); d.seg(q(-4.4,-5.6),q(-5.3,-0.8),1.25*s,coat); d.seg(q(-5.3,-0.8),q(-2,-0.6),1.0*s,coat); d.px(-1.6*s,-0.6*s,o.skin[2]); }
    else { d.seg(q(-5.3,-0.8),q(-1.8,-0.6),1.05*s,coat); d.seg(q(5.3,-0.8),q(1.8,-0.6),1.05*s,coat); d.px(-1.2*s,-0.8*s,o.skin[2]); d.px(1.2*s,-0.8*s,o.skin[2]); } }
  else { d.seg(q(-4.6,-5.6),q(-5.6,0),1.25*s,coat); d.seg(q(4.6,-5.6),q(5.6,0),1.25*s,coat); }
  if (o.extra) o.extra(d,q);
  return d.done(); }
// Kinderzeichnung einer Straßenbahn auf einem Blatt (für Wände)
function kidTram(b,x,y,w,h,seed,opt){ opt=opt||{}; var r=M.rng(seed), paper=opt.paper||P.s5;
  b.rect(x,y,w,h,paper); b.hl(x,x+w-1,y,M.UP[paper]); b.vl(x+w-1,y+1,y+h-1,M.DN[paper]);
  var ty=y+Math.round(h*0.32), th=Math.max(2,Math.round(h*0.4)), tx=x+1+Math.floor(r()*2), tw=w-3-Math.floor(r()*2);
  b.rect(tx,ty,tw,th,opt.body||P.r3); b.hl(tx,tx+tw-1,ty+th-1,P.r2);
  for (var i=tx+1;i<tx+tw-1;i+=2) b.px(i,ty+1,opt.win||P.b3);
  b.px(tx+1,ty+th,P.k1); b.px(tx+tw-2,ty+th,P.k1); if (tw>6) b.px(tx+Math.floor(tw/2),ty+th,P.k1);
  b.line(tx+Math.floor(tw/2)-1,ty-1,tx+Math.floor(tw/2)+1,ty-2,P.k2);
  if (r()<0.6) b.px(x+w-2,y+1,P.y4); if (r()<0.5) b.hl(x+1,x+w-2,y+h-1,P.g3);
  b.px(x+Math.floor(w/2),y,opt.pin||P.r4); }
// Kerze: Stumpf mit Flamme; Rückgabe: Lichtpunkt
function candle(b,x,y,h){ h=h||3; b.rect(x,y-h,2,h,P.s6); b.vl(x+1,y-h,y-1,P.s4); b.px(x,y-h-1,P.y4); b.px(x+1,y-h-1,P.y5); b.px(x,y-h-2,P.l1); b.px(x,y-h-3,P.y4); return [x+1,y-h-2]; }

// ================================================================ 1. k2_school — Kellerschule, die Klingel: Zora unter dem Pult, Lana verteilt Hefte
M.mem.k2_school=function(b){ var w=b.w,h=b.h, r=M.rng(91), lights=[], VX=136, i, x, y;
  // Decke mit Rohren, Rückwand aus Betonsteinen, Boden
  fill(b,0,0,w,9,function(x,y){ return M.rampAt(R('k1 m0 m1'),y/9*0.9,x,y); });
  b.hl(0,w-1,3,P.m2); b.hl(0,w-1,4,P.m1); b.hl(0,w-1,6,P.m3); b.hl(0,w-1,7,P.m1); for (x=10;x<w;x+=46){ b.vl(x,0,7,P.k2); b.px(x,8,P.m2); }
  fill(b,0,9,w,38,function(x,y){ var c=M.tex.plaster(x,y,R('m1 m2 m3'),24), row=Math.floor((y-9)/9); if ((y-9)%9===0 || (x+(row%2)*16)%32===0) c=P.m1; return c; });
  b.hl(0,w-1,9,P.k2); b.hl(0,w-1,46,P.k2);
  fill(b,0,47,w,h-47,function(x,y){ var v=0.2+(y-47)/(h-47)*0.6+(hash(x>>3,y>>2)-0.5)*0.12; return M.rampAt(R('s0 s1 s2'),v,x,y); });
  // die Glühbirne, aus
  b.vl(VX,0,12,P.k2); b.rect(VX-1,12,3,2,P.m2); b.ellipse(VX+0.5,16,2,2.4,P.s3); b.px(VX,15,P.s4);
  // Blechschrank mit Vorhängeschloss (hinten links), Ofen aus einem Ölfass (hinten rechts)
  b.rect(56,19,17,28,P.m2); b.vl(56,19,46,P.m3); b.vl(72,19,46,P.m1); b.vl(64,20,45,P.m1); b.hl(56,72,19,P.m3); b.rect(65,30,3,3,P.y2); b.px(66,29,P.m4); b.px(66,31,P.k2);
  b.rect(200,31,13,16,P.k2); b.hl(200,212,31,P.m1); b.hl(200,212,36,P.m1); b.hl(200,212,42,P.m1); b.vl(212,31,46,P.k1); b.rect(203,38,6,3,P.t3); b.px(205,39,P.y4);
  b.rect(205,9,3,22,P.m0); b.vl(205,9,30,P.m1);
  // Kinderzeichnungen an der Wand
  [[84,13,11,8],[99,16,10,8],[113,12,12,9],[128,17,10,7],[143,13,11,8],[158,16,12,8],[174,12,10,8],[188,16,10,7],[30,14,11,8],[16,18,10,7]].forEach(function(d,k){ kidTram(b,d[0],d[1],d[2],d[3],40+k,{paper:k%3?P.s5:P.s4}); });
  b.rect(45,24,9,7,P.s5); b.ellipse(49,27,2,2,P.y4); b.px(46,30,P.g3); b.px(51,30,P.g3);   // eine Sonne
  // die Klasse: vier Reihen hinter schmalen Tischen, hinten klein, vorn groß
  var COATS=[Q3('n0 n1 n2'),Q3('w1 w2 w3'),Q3('g1 g2 g3'),Q3('r1 r2 r3'),Q3('m1 m2 m3'),Q3('e1 e2 e3'),Q3('c1 c2 c3'),Q3('v1 v2 v3'),Q3('t1 t2 t3'),Q3('m0 m1 m2')];
  var HAIR=[R('h0 h1 h2'),R('h1 h2 h3'),R('w1 w2 w3'),R('e2 e3 e4'),R('h0 h1 h2'),R('w0 w1 w2')], SKIN=[R('p2 p3 p4'),R('q1 q2 q3'),R('p2 p3 p4'),R('p3 p4 p5')];
  var CAPS=[R('r1 r2 r3'),R('b0 b1 b2'),R('g2 g3 g4'),R('m2 m3 m4'),R('y1 y2 y3'),R('v1 v2 v3'),R('s3 s4 s5')];
  var ROWS=[{y:48,s:0.62,sp:11,c:[2.5]},{y:60,s:0.75,sp:13,c:[-1.5]},{y:73,s:0.88,sp:15.5,c:[1.5]},{y:88,s:1,sp:18,c:[-0.5,2.55]}];
  ROWS.forEach(function(Rw,ri){ var s=Rw.s, x0=Math.round(VX-2.5*Rw.sp-5*s), x1=Math.round(VX+2.5*Rw.sp+5*s), dh=Math.round(13*s);
    // Tischbeine (hinten sichtbar zwischen den Reihen)
    b.vl(x0+1,Rw.y+2,Rw.y+dh,P.w1); b.vl(x1-2,Rw.y+2,Rw.y+dh,P.w1);
    for (var k=0;k<5;k++){ var kx=Math.round(VX+(k-2)*Rw.sp), q=Math.floor(r()*1000), girl=r()<0.45, hw=r();
      var o={s:s,v:'F',coat:COATS[(ri*5+k*3+q)%COATS.length],skin:SKIN[q%SKIN.length],hair:HAIR[(q>>2)%HAIR.length],st:girl?(r()<0.55?'braid':'long'):'short',wide:r()<0.4};
      if (hw<0.3){ o.cap=CAPS[(q>>4)%CAPS.length]; o.bob=r()<0.5; } else if (hw<0.45){ o.hood=COATS[(q+3)%COATS.length].c; }
      if (r()<0.35) o.scarf=CAPS[(q>>5)%CAPS.length];
      if (ri===1 && k===4){ o.hand='up'; o.coat=Q3('s2 s3 s4'); o.cap=null; o.hood=null; }   // eine meldet sich
      if (ri===0 && k===4){ o={s:0.72,v:'F',coat:RR(R('r1 r2 r3'),R('s4 s5 s6'),2,1),skin:R('p2 p3 p4'),hair:R('h0 h1 h2'),st:'short'}; kx+=1; }   // der in der letzten Reihe: gestreifter Pullover
      put(b,kidBust(o),kx,Rw.y,'R'); }
    // die Tischplatte vor der Reihe
    b.rect(x0,Rw.y,x1-x0,2,P.w3); b.hl(x0,x1-1,Rw.y,P.w4); b.rect(x0,Rw.y+2,x1-x0,Math.max(2,Math.round(3*s)),P.w1); b.hl(x0,x1-1,Rw.y+2+Math.max(2,Math.round(3*s)),P.w0);
    Rw.c.forEach(function(cx){ lights.push(candle(b,Math.round(VX+cx*Rw.sp),Rw.y+1,Math.max(2,Math.round(3*s)))); });
    if (ri===1){ b.rect(VX+16,Rw.y-2,5,2,P.s5); b.hl(VX+16,VX+20,Rw.y-2,P.s6); }  // ein offenes Heft
  });
  // das Pult vorn links, darauf die Handglocke und eine Kerze; unter der Platte der kleine Schlüssel
  var DX0=8, DX1=44, DY=71, FY=99;
  b.rect(DX0,DY,DX1-DX0,3,P.w3); b.hl(DX0,DX1-1,DY,P.w4); b.rect(DX0+1,DY+3,14,9,P.w2); b.hl(DX0+1,DX0+14,DY+3,P.w1); b.rect(DX0+6,DY+7,4,1,P.y3);
  b.rect(DX0+1,DY+3,2,FY-DY-3,P.w1); b.rect(DX1-3,DY+3,2,FY-DY-3,P.w1); b.hl(DX0,DX1,FY-1,P.k2);
  b.px(DX0+20,DY-1,P.y4); b.hl(DX0+19,DX0+21,DY-2,P.y3); b.px(DX0+20,DY-3,P.w3); b.px(DX0+20,DY-4,P.w3);   // Handglocke
  lights.push(candle(b,DX1-9,DY,5));
  b.rect(DX1-14,DY+3,4,2,P.s4); b.px(DX1-13,DY+5,P.y4); b.px(DX1-13,DY+6,P.y3);
  // Zora kniet und greift unter die Platte
  fig(b,50,99,S({h:[1,-10],ln:5,nf:[8,0,'f'],ff:[-5,0,'t'],nh:[13,-23],fh:[10,-19],ho:[2,3]}),'L','zora');
  // Lana, siebzehn, mit dem Stapel Hefte: sie legt dem vordersten Kind eins auf den Tisch
  var lx=194, ly=101;
  fig(b,lx,ly,S({nh:[3,-25],fh:[11,-17],ln:2,ho:[0,1]}),'L','mala');
  b.rect(lx-8,ly-31,7,7,P.b2); b.hl(lx-8,lx-2,ly-31,P.r3); b.hl(lx-8,lx-2,ly-29,P.s5); b.hl(lx-8,lx-2,ly-27,P.g3); b.hl(lx-8,lx-2,ly-25,P.s5); b.vl(lx-2,ly-31,ly-25,P.k2);   // Stapel Hefte
  b.rect(lx-14,ly-16,5,2,P.r3); b.hl(lx-14,lx-10,ly-16,P.r4);   // ein Heft in der Hand
  // Licht: Kerzen, sonst Dunkel
  var L=[M.lf.k(-1.3)]; lights.forEach(function(p){ L.push(M.lf.pool(p[0],p[1]+4,34,21,2.6,0.9)); });
  M.light(b,M.lf.sum.apply(null,L));
  lights.forEach(function(p){ b.px(p[0]-1,p[1],P.l1); b.px(p[0]-1,p[1]+1,P.y5); b.px(p[0],p[1]+1,P.y5); });
  edgeDark(b,2.2); };

// ================================================================ 2. k2_sehic — durch die angelehnte Tür: Šehić spricht mit Hankas Foto auf der Kommode
M.mem.k2_sehic=function(b){ var w=b.w,h=b.h, x, y;
  var FX0=78, FX1=154, FY0=5, FY1=95;           // Türrahmen (außen)
  var GX0=FX0+6, GX1=124;                         // der Spalt: von der Zarge bis zur Kante des Türblatts
  // Flur: Wand oben hell gestrichen, unten der grüne Ölsockel, Terrazzoboden
  fill(b,0,0,w,h,function(x,y){ if (y>=95) return M.tex.terrazzo(x,y,R('s1 s2 s3')); if (y>=58) return (y===58)?P.g1:M.rampAt(R('g2 g3 g4'),0.45+(hash(x>>3,y>>3)-0.5)*0.2,x,y); return M.rampAt(R('s2 s3 s4'),0.55-y/58*0.25+(hash(x>>2,y>>2)-0.5)*0.12,x,y); });
  b.hl(0,w-1,95,P.k2); b.hl(0,w-1,96,P.s1);
  // Lichtschalter mit dem orangen Lämpchen, Namensschild und Klingel neben der Tür
  b.rect(196,52,6,8,P.s4); b.rect(197,53,4,6,P.s5); b.px(199,55,P.t4); b.px(199,56,P.y4);
  b.rect(51,38,23,8,P.y2); b.hl(51,73,38,P.y3); b.rect(52,39,21,6,P.y3); M.microText(b,'ŠEHIĆ',53,40,P.y0);
  b.rect(60,49,4,4,P.s4); b.px(61,50,P.k2); b.px(62,50,P.m2);
  // das Zimmer hinter dem Spalt: Tapete, Boden, Kommode mit Lampe und Foto, darin Šehić
  fill(b,GX0,FY0+4,GX1-GX0,FY1-FY0-4,function(x,y){ if (y>=84) return M.rampAt(R('w1 w2 w3'),0.3+(((x+(y*3))>>3)&1)*0.25,x,y); return M.tex.wallpaper(x,y,R('t2 t3 t4')); });
  b.hl(GX0,GX1-1,84,P.w0); b.hl(GX0,GX1-1,83,P.t1);
  for (y=8;y<83;y+=19) b.hl(GX0,GX1-1,y,P.t2);
  // ein Bild an der Tapete (Landschaft), schief vom Spalt angeschnitten
  b.rect(GX0+3,20,11,9,P.w2); b.rect(GX0+4,21,9,7,P.g3); b.rect(GX0+4,21,9,3,P.b3); b.px(GX0+8,23,P.s6);
  // Kommode
  var KX=101, KY=63; b.rect(KX,KY,26,21,P.w2); b.hl(KX-1,KX+26,KY,P.w4); b.hl(KX-1,KX+26,KY+1,P.w3); b.hl(KX,KX+25,KY+8,P.w1); b.hl(KX,KX+25,KY+14,P.w1);
  b.rect(KX+11,KY+4,4,2,P.y3); b.rect(KX+11,KY+10,4,2,P.y3); b.rect(KX+11,KY+16,4,2,P.y3); b.vl(KX,KY+1,KY+20,P.w1); b.rect(KX+1,KY+21,2,2,P.w1); b.rect(KX+23,KY+21,2,2,P.w1);
  for (x=KX+1;x<KX+25;x++) if ((x&1)===0) b.px(x,KY-1,P.s6); b.hl(KX+2,KX+23,KY-1,P.s5);   // Spitzendeckchen
  // die Lampe auf der Kommode (Stoffschirm), rechts, halb hinter dem Türblatt
  b.rect(KX+19,KY-5,2,4,P.y2); b.poly([[KX+16,KY-6],[KX+24,KY-6],[KX+23,KY-12],[KX+17,KY-12]],P.y4); b.hl(KX+17,KX+23,KY-12,P.y3);
  // Hankas Foto: Rahmen, eine Frau mit dunklem Haar, ein Trauerband über der Ecke
  var PX=KX+5, PY=KY-15; b.rect(PX,PY,9,13,P.y2); b.hl(PX,PX+8,PY,P.y3); b.vl(PX,PY,PY+12,P.y3); b.rect(PX+1,PY+1,7,11,P.s4);
  b.rect(PX+2,PY+2,5,7,P.h2); b.ellipse(PX+4.5,PY+5.2,1.9,2.3,P.p4); b.px(PX+3,PY+5,P.k2); b.px(PX+5,PY+5,P.k2); b.px(PX+4,PY+7,P.p3);   // eine Frau, das Haar bis auf die Schultern
  b.rect(PX+1,PY+9,7,3,P.v2); b.hl(PX+3,PX+5,PY+9,P.s5); b.px(PX+2,PY+8,P.h2); b.px(PX+6,PY+8,P.h2);
  b.line(PX+5,PY,PX+8,PY+3,P.k1); b.line(PX+6,PY,PX+8,PY+2,P.k1);   // Trauerband über der Ecke
  b.px(PX+2,PY+13,P.w1); b.px(PX+7,PY+13,P.w1);   // Stütze
  // Šehić, die Hände auf dem Rücken, leicht vorgebeugt; er spricht
  fig(b,91,88,S({nh:[-4,-22],fh:[-3,-22],hd:'o',ho:[1,1],ln:1}),'R','sehic');
  b.px(95,53,P.s6); b.px(95,54,P.r1); b.vl(95,55,58,P.r2); b.px(95,59,P.r1);   // die Krawatte, im Profil
  // die Tür: Zarge, das nach innen offene Türblatt rechts (schräg), Schwelle
  var DOOR=R('w0 w1 w2 w3');
  b.rect(FX0,FY0,FX1-FX0,4,P.s4); b.hl(FX0,FX1-1,FY0,P.s5); b.rect(FX0,FY0,6,FY1-FY0,P.s4); b.vl(FX0,FY0,FY1-1,P.s5); b.vl(FX0+5,FY0+4,FY1-1,P.s2);
  b.rect(FX1-6,FY0,6,FY1-FY0,P.s3); b.vl(FX1-1,FY0,FY1-1,P.s2);
  b.poly([[GX1,FY0+9],[FX1-6,FY0+4],[FX1-6,FY1],[GX1,FY1-5]],function(x,y){ var u=(x-GX1)/(FX1-6-GX1); var c=M.rampAt(DOOR,0.25+u*0.5,x,y); var vv=(y-FY0)/(FY1-FY0); if ((vv>0.12&&vv<0.14)||(vv>0.5&&vv<0.52)||(vv>0.86&&vv<0.88)) c=P.w0; return c; });
  b.rect(GX1-2,FY0+9,3,FY1-FY0-14,P.w3); b.vl(GX1-2,FY0+9,FY1-6,P.w4);   // die Kante des Türblatts, vom Licht gestreift
  b.rect(GX1+3,52,2,2,P.y3); b.px(GX1+3,54,P.y2);   // Klinke
  b.rect(FX0,FY1-1,FX1-FX0,2,P.s2); b.hl(FX0+6,GX1-1,FY1-1,P.s4);
  // Fußabtreter vor der Tür
  fill(b,88,98,50,5,function(x,y){ return hash(x,y)<0.5?P.e2:P.e1; }); b.hl(88,137,98,P.e3);
  // ein Paar Schuhe neben dem Abtreter, wie man sie vor der Tür auszieht
  b.rect(144,99,5,2,P.k2); b.px(148,98,P.k2); b.hl(144,147,99,P.w1); b.rect(150,100,5,2,P.k2); b.px(154,99,P.k2); b.hl(150,153,100,P.w1);
  // Licht: die Lampe im Zimmer; durch den Spalt fällt ein Keil auf den Flurboden; sonst ist der Flur dunkel
  var lamp=[KX+20,KY-9];
  M.light(b,function(x,y){ var v=-2.2, inGap=(x>=GX0 && x<GX1 && y>=FY0+4 && y<FY1);
    if (inGap){ var dx=(x-lamp[0])/60, dy=(y-lamp[1])/50; v=0.6-Math.min(1.4,(dx*dx+dy*dy)*2.2); }
    else if (y>=FY1){ var t=(y-FY1)/(h-FY1), xl=GX0-8-t*30, xr=GX1+4+t*26; if (x>xl && x<xr) v=-0.6+(1-t)*0.6; }
    else if (x>=FX0-2 && x<=FX1+2 && y>=FY0) v=-1.6;
    return v; });
  b.poly([[KX+17,KY-11],[KX+23,KY-11],[KX+23,KY-7],[KX+17,KY-7]],function(x,y){ return x>=GX1-2?undefined:(bayer(x,y)<0.6?P.y5:P.y4); });   // der Schirm leuchtet
  edgeDark(b,2.0); };

// ================================================================ 3. k2_saturdays — Samstag 1988 in der Drei: Lana (12) und Mali (10) am Fenster, an der Endstation wartet die Großmutter
// kleine Erwachsene in der Ferne (von vorn, bei k=1 ca. 26 px): Kopftuch, Mantel, Rock, zwei Taschen
function farGran(k){ k=k||1; var d=new Doll(-1), coat=Q3('e1 e2 e3'), q=function(x,y){ return [x*k,y*k]; };
  d.seg(q(-1.5,-8),q(-1.6,-1.5),0.9*k,Q3('k2 w0 w1')); d.seg(q(1.5,-8),q(1.6,-1.5),0.9*k,Q3('k2 w0 w1'));
  d.shape([q(-3.4,-19),q(3.4,-19),q(4.6,-6.5),q(-4.6,-6.5)],coat); d.shape([q(-4.4,-8),q(4.4,-8),q(4.8,-5),q(-4.8,-5)],Q3('w0 w1 w2'));
  d.seg(q(-3.2,-18),q(-4.4,-11),1.0*k,coat); d.seg(q(3.2,-18),q(4.4,-11),1.0*k,coat);
  d.head(0,-21.6*k,'F',{rx:2.7*k,ry:3*k,skin:R('p2 p3 p4'),hair:R('s3 s4 s5'),scarf:R('n0 n1 n2'),mouth:false});
  var a=q(-7,-11), e=q(4,-11); d.rect(a[0],a[1],Math.round(4*k),Math.round(5*k),P.s4); d.hl(a[0],a[0]+3*k,a[1]+2,P.r3);   // Stofftasche
  d.rect(e[0],e[1],Math.round(4*k),Math.round(5*k),P.w2); d.hl(e[0],e[0]+3*k,e[1],P.w3);                                    // Einkaufstasche
  return d.done(); }
// Lana mit zwölf, sitzend, von vorn; die rechte Hand (im Bild) am Rücken des Jungen
function girl12(){ var d=new Doll(-1), coat=Q3('w2 w3 w4'), tr=Q3('n0 n1 n2'), sk=R('p2 p3 p4');
  d.seg([-2.2,-9.5],[-2.4,-7.6],1.7,tr); d.seg([2.2,-9.5],[2.4,-7.6],1.7,tr); d.seg([-2.4,-7.6],[-2.6,-1.6],1.2,tr); d.seg([2.4,-7.6],[2.6,-1.6],1.2,tr);
  d.rect(-4,-1.5,3,2,P.r2); d.rect(2,-1.5,3,2,P.r2); d.px(-4,-2,P.r3); d.px(4,-2,P.r3);
  d.shape([[-4.2,-19.4],[4.2,-19.4],[5.6,-14],[6,-8],[-6,-8],[-5.6,-14]],coat);
  d.shape([[-2.6,-20],[2.6,-20],[3,-17.6],[-3,-17.6]],RR(R('r1 r2 r3')));   // Schal
  d.seg([-4.4,-18.2],[-5.6,-13],1.25,dnQ(coat)); d.seg([-5.6,-13],[-2.4,-9.6],1.05,dnQ(coat)); d.px(-1.8,-9.6,sk[2]);
  d.head(0,-24.2,'F',{rx:4.1,ry:4.5,skin:sk,hair:R('h1 h2 h3'),st:'braid',braid:8,tie:P.r3});
  d.px(-1,-21,sk[0]); d.px(1,-21,sk[0]); d.px(0,-21,sk[1]);   // ein Lächeln
  d.seg([4.4,-18.2],[7.4,-15.4],1.25,coat); d.seg([7.4,-15.4],[10,-17],1.05,coat); d.px(10.6,-17,sk[2]); d.px(10.6,-16,sk[1]);
  return d.done(); }
// Mali mit zehn, kniend auf dem Sitz, von hinten: gestreifter Pullover, die Mütze schief, er winkt durch die Scheibe
function boy10(){ var d=new Doll(-1), sw=RR(R('r1 r2 r3'),R('s4 s5 s6'),3,1,1), tr=Q3('c0 c1 c2'), sk=R('p2 p3 p4');
  d.seg([-2.2,-17.5],[-2.2,-11.6],1.8,tr); d.seg([2.2,-17.5],[2.2,-11.6],1.8,tr);
  d.ell(-2.4,-10.6,1.8,1.2,P.k2); d.ell(2.4,-10.6,1.8,1.2,P.k2); d.px(-2.4,-10.8,P.m2); d.px(2.4,-10.8,P.m2);   // Schuhsohlen über der Sitzkante
  d.shape([[-4.4,-26],[4.4,-26],[5,-21],[4.6,-16.8],[-4.6,-16.8],[-5,-21]],sw);
  d.seg([4,-25],[6,-22.6],1.2,sw); d.seg([6,-22.6],[5,-26.4],1.0,sw);
  d.seg([-4,-25],[-7.2,-28.6],1.2,sw); d.seg([-7.2,-28.6],[-6.6,-34],1.0,sw); d.px(-6.6,-35,sk[2]); d.px(-7.6,-35,sk[1]); d.px(-6.6,-36,sk[2]);
  d.head(-0.2,-30.6,'B',{rx:4,ry:4.3,skin:sk,hair:R('h0 h1 h2'),st:'short',cap:R('b0 b1 b2'),tilt:0.3,capLo:-0.1});
  d.px(-4.1,-29.6,sk[1]); d.px(-4.1,-30.6,sk[2]);   // Wange: er sieht nach links hinaus
  return d.done(); }
M.mem.k2_saturdays=function(b){ var w=b.w,h=b.h, x, y, i;
  var FL=90, SEAT=78, SILL=66, WY0=43, WY1=SILL, TOPW=36, HZ=WY0+16, WIN=[[-20,62],[70,158],[166,254]];
  function inWin(x,y){ if (y<WY0||y>=WY1) return false; for (var k=0;k<WIN.length;k++){ var a=WIN[k][0], e=WIN[k][1]; if (x<a||x>=e) continue; var cx=Math.min(x-a,e-1-x), cy=Math.min(y-WY0,WY1-1-y); if (cx<3 && cy<3 && (3-cx)*(3-cx)+(3-cy)*(3-cy)>9) return false; return true; } return false; }
  // draußen: die Schleife an der Baščaršija, ein heller Samstag
  var out=new M.Buf(w,h,P.b4);
  M.vgrad(out,0,WY0,w,16,R('b3 b4 b5'));
  out.ellipse(40,WY0+4,18,1.5,P.b5); out.ellipse(150,WY0+3,22,1.5,P.b5);
  M.scn.roofs(out,0,w,HZ,'day',17,{min:4,var:6});
  M.scn.minaret(out,128,HZ,19,{});
  for (x=150;x<196;x++){ var th=HZ-Math.round(6+Math.sin(x*0.19)*2+hash(x>>2,3)*3); for (y=th;y<HZ;y++) out.px(x,y,M.rampAt(R('g2 g3 g4'),0.35+hash(x>>1,y>>1)*0.45,x,y)); }   // ein Baum
  fill(out,0,HZ,w,WY1-HZ+1,function(x,y){ return y===HZ?P.s5:M.rampAt(R('s3 s4 s5'),0.75-(y-HZ)/14,x,y); }); out.hl(0,w-1,HZ+3,P.m3);
  out.vl(46,WY0+6,WY1,P.m2); out.ellipse(46,WY0+5,2.6,2.6,P.s6); out.ellipse(46,WY0+5,1.6,1.6,P.r3); out.px(46,WY0+5,P.s6);   // Haltestellenschild
  put(out,farGran(0.72),34,WY1,'R');
  for (y=WY0;y<WY1;y++) for (x=0;x<w;x++){ if (!inWin(x,y)) continue; var c=out.get(x,y); if (((x+y*2)%29)<2 && (x+y)%2===0) c=M.UP[c]; b.px(x,y,c); }   // Scheibe, Spiegelung
  // drinnen: Decke (von unten), Wand mit Fenstern, Bank, Gang
  for (y=0;y<FL;y++) for (x=0;x<w;x++){ if (inWin(x,y)) continue; var c2;
    if (y<TOPW){ var z=y/TOPW; c2=M.rampAt(R('s2 s3 s4 s5'),0.25+z*0.55,x,y); }
    else if (y<WY0) c2=(y===TOPW)?P.s2:P.s4; else if (y<WY1) c2=P.s4; else if (y<SILL+2) c2=y===SILL?P.s6:P.s5; else if (y<SEAT) c2=M.rampAt(R('s3 s4'),0.7-(y-SILL)/24,x,y); else c2=P.k2;
    if (y>=WY0-1 && y<WY1+1 && !inWin(x,y) && (inWin(x-1,y)||inWin(x+1,y)||inWin(x,y-1)||inWin(x,y+1))) c2=P.k2; b.px(x,y,c2); }
  // Deckenlampen und Haltestangen; Schlaufen hängen von der nahen Stange
  b.rect(0,21,w,4,P.s6); b.hl(0,w-1,20,P.s3); b.hl(0,w-1,25,P.s2); for (x=40;x<w;x+=56) b.vl(x,21,24,P.s3);
  b.hl(0,w-1,32,P.m3); b.hl(0,w-1,33,P.m1);
  b.hl(0,w-1,5,P.m4); b.hl(0,w-1,6,P.m3); b.hl(0,w-1,7,P.m1);
  for (x=12;x<w;x+=38){ b.line(x,8,x+1,15,P.w1); b.line(x+1,8,x+2,15,P.w2); b.ellipse(x+2,18,2.4,2.6,P.w1); b.ellipse(x+2,18,1.2,1.4,P.s4); }
  b.rect(80,TOPW+1,70,4,P.s5); b.hl(84,146,TOPW+2,P.r3); for (x=86;x<146;x+=8) b.px(x,TOPW+2,P.k2); b.px(146,TOPW+2,P.r1); b.px(84,TOPW+2,P.r1);   // Linienplan der Drei
  b.rect(14,TOPW+1,30,5,P.y4); b.rect(15,TOPW+2,9,3,P.r3); b.hl(26,41,TOPW+3,P.k2); b.rect(176,TOPW+1,26,5,P.b3); b.hl(179,198,TOPW+3,P.s6); b.hl(179,190,TOPW+4,P.s5);   // Werbeschilder
  // Bank aus braunem Kunstleder, darunter das Heizungsgitter; Riffelboden im Gang
  b.rect(0,SEAT,w,3,P.w2); b.hl(0,w-1,SEAT,P.w4); b.hl(0,w-1,SEAT+1,P.w3); for (x=40;x<w;x+=50) b.vl(x,SEAT,SEAT+2,P.w1);
  fill(b,0,SEAT+3,w,FL-SEAT-3,function(x,y){ return (x%3===0)?P.m0:P.m1; }); b.hl(0,w-1,SEAT+3,P.k2);
  fill(b,0,FL,w,h-FL,function(x,y){ var d=(y-FL)/(h-FL), u=Math.floor((x-116)/(1+d*0.6)); return (((u%4)+4)%4===0)?P.m1:P.m2; }); b.hl(0,w-1,FL,P.k2);
  // die Kinder
  put(b,girl12(),104,FL,'R');
  put(b,boy10(),122,FL,'R');
  // senkrechte Haltestange, nah
  for (y=0;y<h;y++){ b.px(206,y,P.m2); b.px(207,y,P.m4); b.px(208,y,P.m3); b.px(209,y,P.m1); }
  // Licht: die Sonne durch die Fenster hinter uns, in schrägen Feldern auf Wand, Bank, Kinder und Gang
  M.light(b,function(x,y){ if (inWin(x,y)) return 0.2; var v=-0.4; var u=x-(y-50)*0.5+22, m=((u%88)+88)%88, lit=m>8 && m<66;
    if (y>=WY1-12 && y<FL && lit && !(y<WY1 && y>=WY0)) v+=(y<WY1?0.5:1.1);
    if (y>=FL){ var u2=x+(y-FL)*0.9+30, m2=((u2%88)+88)%88; v+=(m2>10 && m2<62)?0.9:-0.3; }
    if (y<TOPW) v+=(y-TOPW)/TOPW*1.6-0.3; return v; });
  edgeDark(b,1.8); };

// ================================================================ Marko mit 14/15 (von Hand, ca. 42 px): schlank, gestreifter Pullover rot-weiß, Jeans, Turnschuhe
// Profil, Gesicht nach +x. o: Gelenke (je [x,y], Füße bei 0): hip, sh (Schulter), hc (Kopfmitte), nf/ff (Füße), nk/fk (Knie), ne/fe (Ellbogen), nh/fh (Hände);
// v 'S' oder 'B' (Kopf von hinten), short (kurze Ärmel), lx (Licht), s (Maßstab), mouth
function teen(o){ o=o||{}; var k=o.s||1, d=new Doll(o.lx||1), q=function(p){ return [p[0]*k,p[1]*k]; };
  var SW=RR(R('r1 r2 r3'),R('s4 s5 s6'),3,1,o.so||0), JE=Q3('c1 c2 c3'), sk=R('p2 p3 p4'), HA=R('h0 h1 h2');
  var hip=o.hip||[0,-20], sh=o.sh||[0.5,-31], hc=o.hc||[1.6,-36.4], nf=o.nf||[2.5,0], ff=o.ff||[-2,0], nk=o.nk||[1.8,-10.4], fk=o.fk||[-0.8,-10.4];
  var ne=o.ne||[2,-24], fe=o.fe||[0,-24], nh=o.nh||[2.5,-17.5], fh=o.fh||[0.5,-17.5];
  // ferner Arm, ferne Bein
  d.seg(q([sh[0]-0.6,sh[1]+0.8]),q(fe),1.15*k,dnQ(SW)); d.seg(q(fe),q(fh),0.95*k,o.short?RR(R('p1 p2 p3')):dnQ(SW)); d.px(q(fh)[0]+0.4,q(fh)[1]+0.4,sk[1]);
  d.seg(q([hip[0]-0.6,hip[1]]),q(fk),1.6*k,dnQ(JE)); d.seg(q(fk),q([ff[0],ff[1]-1.6]),1.3*k,dnQ(JE)); d.rect(q(ff)[0]-2,q(ff)[1]-1.6,5,2,P.s4); d.hl(q(ff)[0]-2,q(ff)[0]+2,q(ff)[1],P.k2);
  d.seg(q([hip[0]+0.6,hip[1]]),q(nk),1.7*k,JE); d.seg(q(nk),q([nf[0],nf[1]-1.6]),1.35*k,JE); d.rect(q(nf)[0]-2,q(nf)[1]-1.6,5,2,P.s5); d.hl(q(nf)[0]-2,q(nf)[0]+2,q(nf)[1],P.k2); d.px(q(nf)[0]+2,q(nf)[1]-1.6,P.s6);
  // Rumpf
  d.shape([q([sh[0]-2.8,sh[1]-0.6]),q([sh[0]+2.9,sh[1]-0.6]),q([hip[0]+3.1,hip[1]+1.2]),q([hip[0]-3.0,hip[1]+1.2])],SW);
  d.seg(q([sh[0]+0.4,sh[1]-1.4]),q([hc[0]-0.2,hc[1]+4]),1.0*k,RR(sk));   // Hals
  d.head(hc[0]*k,hc[1]*k,o.v||'S',{rx:4.3*k,ry:4.8*k,skin:sk,hair:HA,st:'short',mouth:o.mouth});
  // naher Arm
  d.seg(q([sh[0]+0.4,sh[1]+0.8]),q(ne),1.2*k,SW); d.seg(q(ne),q(nh),1.0*k,o.short?RR(R('p2 p3 p4')):SW); d.px(q(nh)[0]+0.5,q(nh)[1]+0.3,sk[2]); d.px(q(nh)[0]+0.5,q(nh)[1]+1.2,sk[1]);
  if (o.extra) o.extra(d,q);
  return d.done(); }

// ================================================================ 4. k2_cellar — derselbe Keller aus der letzten Reihe: Mali an der Wand, Lana über seinem Blatt
// Zora, klein an der Tafel, von hinten, der Arm mit der Kreide oben
function farZora(k){ var d=new Doll(1), q=function(x,y){ return [x*k,y*k]; }, cg=Q3('m0 m1 m2'), dr=Q3('k2 n0 n1');
  d.seg(q(-1.4,-9),q(-1.5,-1),0.9*k,Q3('p1 p2 p3')); d.seg(q(1.4,-9),q(1.5,-1),0.9*k,Q3('p1 p2 p3'));
  d.shape([q(-4,-12),q(4,-12),q(5,-3),q(-5,-3)],dr); d.shape([q(-3.6,-21),q(3.6,-21),q(4,-11),q(-4,-11)],cg);
  d.seg(q(-3.2,-20),q(-4,-13),1.0*k,cg); d.seg(q(3.2,-20),q(5.6,-25),1.0*k,cg); d.seg(q(5.6,-25),q(6,-30),0.9*k,cg); d.px(6*k,-30.8*k,P.s6);
  d.head(0,-24*k,'B',{rx:3*k,ry:3.3*k,skin:R('p2 p3 p4'),hair:R('m2 m3 m4'),st:'bun'});
  return d.done(); }
M.mem.k2_cellar=function(b){ var w=b.w,h=b.h, r=M.rng(57), lights=[], x, y, i;
  var VP=[96,42], FW=[46,16,146,60];           // Rückwand vorn (mit der Tafel), Fluchtpunkt
  // Raum: Decke, Wände, Boden in Fluchtpunktperspektive
  M.box(b,{vp:VP,rect:FW,
    back:function(u,v,x,y){ var c=M.tex.plaster(x,y,R('m1 m2 m3'),30); if (v%9===0) c=P.m1; return c; },
    side:function(u,v,x,y,sd){ var c=M.rampAt(R('m0 m1 m2 m3'),0.55+(hash(Math.floor(u/6),Math.floor(v/5))-0.5)*0.25,x,y); if (v%9===0) c=P.m1; return c; },
    floor:function(xb,d,x,y){ return M.rampAt(R('s0 s1 s2'),0.3+d/60+(hash(Math.floor(xb/5),Math.floor(d/3))-0.5)*0.2,x,y); },
    ceil:function(xb,d,x,y){ var c=M.rampAt(R('k1 m0 m1'),0.6-d/40,x,y); var e=Math.abs(xb-76)<1.2||Math.abs(xb-82)<1.2||Math.abs(xb-120)<1.4; if (e) c=P.m2; return c; } });
  // die Kanten des Raums
  b.hl(FW[0],FW[2],FW[1],P.k2); b.hl(FW[0],FW[2],FW[3],P.k2); b.vl(FW[0],FW[1],FW[3],P.k2); b.vl(FW[2],FW[1],FW[3],P.k2);
  // die Tafel auf dem Gestell, Zora davor
  b.line(70,59,74,30,P.w1); b.line(116,59,112,30,P.w1);
  b.rect(66,26,52,24,P.w2); b.rect(67,27,50,22,P.g1); fill(b,68,28,48,20,function(x,y){ return hash(x>>1,y)<0.16?P.g2:undefined; });
  for (i=0;i<3;i++){ var ly=31+i*5; for (x=70;x<70+12+Math.floor(hash(i,7)*12);x++) if (hash(x,i+3)<0.7) b.px(x,ly,P.s4); }
  b.rect(96,31,14,6,P.g1); b.hl(96,109,31,P.s4); b.hl(96,109,36,P.s4); b.vl(96,31,36,P.s4); b.vl(109,31,36,P.s4); b.px(99,38,P.s4); b.px(106,38,P.s4); for (x=98;x<108;x+=3) b.px(x,33,P.s4); M.microText(b,'3',111,31,P.s5);
  b.hl(66,117,50,P.w3);
  put(b,farZora(0.92),90,60,'R');
  // die Glühbirne (aus)
  b.vl(100,3,12,P.k2); b.rect(99,12,3,2,P.m2); b.ellipse(100.5,15.5,1.8,2.2,P.s3);
  // Kinderzeichnungen an der rechten Wand (schräg, nah)
  function wallPic(u0,u1,v0,v1,seed){ var Q=M.wallQuad({vp:VP,rect:FW},'R',u0,u1,v0,v1); b.poly(Q,function(x,y){ return P.s5; });
    var a=Q[0], c=Q[2]; var cx=(Q[0][0]+Q[1][0]+Q[2][0]+Q[3][0])/4, cy=(Q[0][1]+Q[1][1]+Q[2][1]+Q[3][1])/4;
    b.poly([[cx-(c[0]-a[0])*0.32,cy-1],[cx+(c[0]-a[0])*0.32,cy-1-(c[0]-a[0])*0.1],[cx+(c[0]-a[0])*0.32,cy+2-(c[0]-a[0])*0.1],[cx-(c[0]-a[0])*0.32,cy+2]],P.r3);
    b.px(Math.round(cx-(c[0]-a[0])*0.22),Math.round(cy+3),P.k1); b.px(Math.round(cx+(c[0]-a[0])*0.2),Math.round(cy+3-(c[0]-a[0])*0.08),P.k1); b.px(Math.round((Q[0][0]+Q[1][0])/2),Math.round((Q[0][1]+Q[1][1])/2)+1,P.r4); }
  [[4,11,24,31],[15,22,19,26],[26,34,26,33],[38,46,18,25],[51,60,27,34],[64,74,20,27],[80,90,28,35],[95,106,19,27]].forEach(function(q,k){ wallPic(q[0],q[1],q[2],q[3],k); });
  // die Klasse von hinten: Reihen, nach vorn kleiner, Kerzen auf den Tischen zwischen den Köpfen
  var COATS=[Q3('n0 n1 n2'),Q3('w1 w2 w3'),Q3('g1 g2 g3'),Q3('r1 r2 r3'),Q3('m1 m2 m3'),Q3('e1 e2 e3'),Q3('c1 c2 c3'),Q3('v1 v2 v3'),Q3('t1 t2 t3')];
  var HAIR=[R('h0 h1 h2'),R('h1 h2 h3'),R('w1 w2 w3'),R('e2 e3 e4')], CAPS=[R('r1 r2 r3'),R('b0 b1 b2'),R('g2 g3 g4'),R('m2 m3 m4'),R('y1 y2 y3')];
  var ROWS=[{y:62,s:0.5,x0:62,x1:132,n:6,c:[3.5]},{y:67,s:0.6,x0:56,x1:138,n:6,c:[4.5]},{y:75,s:0.74,x0:44,x1:144,n:6,c:[1.5]},{y:88,s:0.94,x0:24,x1:150,n:6,c:[3.5]},{y:104,s:1.16,x0:2,x1:146,n:5,c:[]}];
  ROWS.forEach(function(Rw,ri){ var s=Rw.s, sp=(Rw.x1-Rw.x0)/(Rw.n-1);
    b.rect(Rw.x0-6,Rw.y-Math.round(9*s),Rw.x1-Rw.x0+12,2,P.w2); b.hl(Rw.x0-6,Rw.x1+5,Rw.y-Math.round(9*s),P.w3);   // Tischkante vor der Reihe
    Rw.c.forEach(function(cx){ lights.push(candle(b,Math.round(Rw.x0+cx*sp),Rw.y-Math.round(9*s),Math.max(2,Math.round(3*s)))); });
    for (var k=0;k<Rw.n;k++){ var kx=Math.round(Rw.x0+k*sp+(hash(ri,k)-0.5)*3), qn=Math.floor(r()*1000), hw=r();
      var o={s:s,v:'B',coat:COATS[(qn+ri*2)%COATS.length],skin:R('p2 p3 p4'),hair:HAIR[(qn>>3)%HAIR.length],st:r()<0.45?'braid':'short',wide:r()<0.4};
      if (hw<0.3) o.cap=CAPS[(qn>>2)%CAPS.length]; else if (hw<0.42) o.hood=COATS[(qn+5)%COATS.length].c;
      put(b,kidBust(o),kx,Rw.y,'R'); } });
  // ein Betonpfeiler rechts vorn, mit einer Zeichnung daran
  fill(b,213,0,19,h,function(x,y){ var u=x-213; return u<2?P.m3:(u>15?P.m0:M.rampAt(R('m1 m2 m3'),0.55-(u/19)*0.4+(hash(u>>2,y>>3)-0.5)*0.12,x,y)); });
  b.vl(212,0,h-1,P.k2); kidTram(b,216,30,11,8,21,{paper:P.s4});
  // eine Kerze auf einer umgedrehten Kiste neben Mali
  b.rect(146,90,13,11,P.w2); b.hl(146,158,90,P.w4); b.hl(146,158,95,P.w1); b.vl(146,90,100,P.w1);
  lights.push(candle(b,151,90,4));
  // Mali, an die Wand gelehnt, das Blatt in beiden Händen; Lana beugt sich darüber
  put(b,teen({hip:[-1.2,-20],sh:[-2.6,-31],hc:[-1,-36.2],nf:[3.5,0],ff:[1,0],nk:[1.6,-10.6],fk:[0,-10.4],ne:[1.4,-24.4],nh:[4.6,-24.6],fe:[-0.4,-24.4],fh:[3.4,-25.4],mouth:false}),208,100,'L');
  var SX=197, SY=72;   // das Blatt, ihr zugewandt: eine Straßenbahn mit eckigen Rädern
  b.poly([[SX-6,SY-4],[SX+5,SY-5],[SX+6,SY+3],[SX-5,SY+4]],P.s6); b.line(SX-6,SY-4,SX+5,SY-5,P.s5);
  b.rect(SX-4,SY-2,8,3,P.r3); b.px(SX-3,SY-1,P.s6); b.px(SX-1,SY-1,P.s6); b.px(SX+1,SY-2,P.s6); b.rect(SX-4,SY+1,2,2,P.k1); b.rect(SX+2,SY+1,2,2,P.k1); b.line(SX-1,SY-3,SX+1,SY-4,P.k2);
  fig(b,180,101,S({ln:4,h:[1,-22],nf:[3,0,'f'],ff:[-3,0,'f'],nh:[11,-29],fh:[6,-19],ho:[2,2]}),'R','mala');
  // Licht: Kerzen; die Reihen dazwischen dunkel
  var L=[M.lf.k(-1.5)]; lights.forEach(function(p,k){ var last=k===lights.length-1; L.push(M.lf.pool(p[0],p[1]+2,last?44:30,last?32:20,last?2.6:2.2,0.9)); }); L.push(M.lf.pool(196,72,22,24,0.8,0.9));
  M.light(b,M.lf.sum.apply(null,L));
  lights.forEach(function(p){ b.px(p[0]-1,p[1],P.l1); b.px(p[0]-1,p[1]+1,P.y5); b.px(p[0],p[1]+1,P.y5); });
  edgeDark(b,2.0); };

// ================================================================ 5. k2_snow2 — August 1992, Treppenhaus im siebten Stock: Lana, Asche im Haar, gibt Mali das verkohlte Blatt
M.mem.k2_snow2=function(b){ var w=b.w,h=b.h, r=M.rng(812), x, y, i;
  var LY=70, LX=150, ST=9, SH=5;               // Podest (Höhe, Kante), Stufen: Tiefe und Höhe
  function stairTop(x){ if (x>=LX) return LY; var k=Math.floor((LX-x)/ST)+1; return LY+k*SH; }
  // Wände: unten Ölfarbe (dunkel), oben gekalkt; die Grenze läuft mit der Treppe
  fill(b,0,0,w,h,function(x,y){ var line=x>=LX?LY-24:LY-24+(LX-x)*SH/ST; if (y>line) return M.rampAt(R('c1 c2 c3'),0.5+(hash(x>>3,y>>2)-0.5)*0.15,x,y); if (y>line-2) return P.c0; return M.rampAt(R('s3 s4 s5'),0.55+(hash(x>>2,y>>3)-0.5)*0.14,x,y); });
  // das Fenster am Podest: rauchiger Himmel, schwarze Flocken fallen
  var WX0=172, WX1=196, WY0=10, WY1=56;
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ var v=0.35+(y-WY0)/(WY1-WY0)*0.45+Math.sin(x*0.3+y*0.12)*0.08; return M.rampAt(R('s2 s3 s4 s5 s6'),v,x,y); });
  for (i=0;i<10;i++){ var cx=WX0+r()*(WX1-WX0), cy=WY0+r()*(WY1-WY0)*0.6; b.ellipse(cx,cy,5+r()*4,2+r()*2,function(x,y){ return (x>=WX0&&x<WX1&&y>=WY0&&y<WY1&&bayer(x,y)<0.5)?P.s2:undefined; }); }
  for (i=0;i<26;i++){ var fx=Math.floor(WX0+r()*(WX1-WX0)), fy=Math.floor(WY0+r()*(WY1-WY0)); b.px(fx,fy,P.k1); if (r()<0.5) b.px(fx+1,fy,P.k2); }
  b.rect(WX0-2,WY0-2,WX1-WX0+4,2,P.s5); b.rect(WX0-2,WY1,WX1-WX0+4,3,P.s6); b.hl(WX0-2,WX1+1,WY1+2,P.s3);
  b.vl(WX0-1,WY0,WY1-1,P.m2); b.vl(WX1,WY0,WY1-1,P.m2); b.vl(Math.round((WX0+WX1)/2),WY0,WY1-1,P.m1); b.hl(WX0,WX1-1,Math.round((WY0+WY1)/2),P.m1);
  // die Wohnungstür, offen, und die Sieben an der Wand
  b.rect(204,20,24,50,P.k1); b.rect(205,21,22,49,P.w0); b.rect(204,20,24,2,P.s3); b.vl(204,20,69,P.s3); b.vl(227,20,69,P.s2);
  b.poly([[205,21],[212,24],[212,68],[205,70]],P.w2); b.vl(212,24,68,P.w1); b.px(210,46,P.y3);
  M.big(b,'7',161,16,P.c2,2,false);
  // eine Wandlampe ohne Strom, der Kabelkanal, ein Lichtschalter
  b.hl(0,LX+20,14,P.s2); b.hl(0,LX+20,15,P.s3); b.ellipse(96,22,4,4,P.s2); b.ellipse(96,22,3,3,P.s5); b.px(95,21,P.s6); b.vl(96,15,18,P.s2);
  b.rect(60,40,4,5,P.s5); b.px(61,42,P.s2); b.vl(62,15,39,P.s3);
  // Podest und Stufen (Terrazzo-Kanten), darunter die Wange
  fill(b,LX,LY,w-LX,h-LY,function(x,y){ return y===LY?P.s5:(y<LY+3?M.tex.terrazzo(x,y,R('s2 s3 s4')):M.rampAt(R('s1 s2'),0.5,x,y)); });
  for (i=0;i<9;i++){ var x1=LX-i*ST, x0=x1-ST, ty=LY+(i+1)*SH; b.rect(x0,ty,ST,h-ty,P.s2); b.hl(x0,x1-1,ty,P.s5); b.hl(x0,x1-1,ty+1,P.s4); b.vl(x1-1,ty,ty+SH-1,P.s1); }
  // Geländer: Stäbe und Handlauf entlang der Treppe
  for (x=LX+40;x>=0;x-=7){ var t=stairTop(x); b.vl(x,t-17,t-1,P.m1); }
  b.line(0,stairTop(0)-18,LX,LY-18,P.w2); b.line(0,stairTop(0)-19,LX,LY-19,P.w3); b.hl(LX,LX+44,LY-18,P.w2); b.hl(LX,LX+44,LY-19,P.w3);
  // Mali (vierzehn), im T-Shirt, an der obersten Stufe; er greift nach dem Blatt
  put(b,teen({s:0.96,short:true,hip:[0.6,-20],sh:[2,-30.6],hc:[3.4,-35.8],nf:[2.5,0],ff:[-2.5,0],nk:[2.2,-10.4],fk:[-1.2,-10.4],ne:[6,-26.6],nh:[10.4,-27.6],fe:[1.6,-24],fh:[1.8,-17.4]}),160,LY,'L');
  // Lana (sechzehn), zwei Stufen tiefer, außer Atem; sie hält ihm das Blatt hin
  var gx=133, gy=stairTop(gx);
  fig(b,gx,gy,S({h:[2,-23],nf:[8,-5,'f'],ff:[-2,0,'t'],nh:[13,-30],fh:[1,-20],ln:2,hd:'o'}),'R','mala');
  for (i=0;i<60;i++){ var ax=gx-2+Math.floor(r()*12), ay=gy-47+Math.floor(r()*14); if ((b.get(ax,ay)===P.h2||b.get(ax,ay)===P.h3) && r()<0.35) b.px(ax,ay,r()<0.5?P.s5:P.s4); }   // Asche im Haar
  // das verkohlte Blatt zwischen den Händen
  var SX=146, SY=48; b.poly([[SX-4,SY-3],[SX+4,SY-4],[SX+5,SY+3],[SX-3,SY+4]],P.s5); b.hl(SX-2,SX+3,SY-2,P.s4); b.hl(SX-2,SX+2,SY,P.n2); b.hl(SX-2,SX+3,SY+1,P.n2);
  b.px(SX-4,SY-3,P.k1); b.px(SX-3,SY-3,P.k2); b.px(SX+4,SY-4,P.k1); b.px(SX+5,SY+2,P.k1); b.px(SX+5,SY+3,P.k2); b.px(SX-3,SY+4,P.k1); b.px(SX-4,SY+3,P.k2); b.px(SX+1,SY+4,P.k2); b.px(SX+4,SY+3,P.t3);
  // ein paar Flocken, die mit hereingeweht sind
  for (i=0;i<8;i++){ b.px(Math.floor(100+r()*90),Math.floor(20+r()*40),P.k2); }
  // Licht: dunstige Augustsonne durch das Fenster, schräg über die Treppe
  M.light(b,M.lf.sum(M.lf.k(-0.7),M.lf.xband(0,150,-1.8,0),M.lf.band(80,104,0,-0.8),M.lf.beam(184,30,118,96,10,30,1.8),M.lf.pool(184,34,34,32,0.9,0.8)));
  edgeDark(b,2.0); };

// ================================================================ 6. k2_tickets — November 1993 vor Großmutters Tor: das zerrissene Foto, ein Fahrschein
M.mem.k2_tickets=function(b){ var w=b.w,h=b.h, r=M.rng(1193), x, y, i;
  var GY=96, WT=46;                                // Boden, Mauerkrone
  // Himmel: grau verhangen, November
  fill(b,0,0,w,WT,function(x,y){ return M.rampAt(R('s2 s3 s4 s5'),0.55+y/WT*0.35+Math.sin(x*0.04+y*0.2)*0.05,x,y); });
  // ganz hinten: Hang mit Häusern, ein kleines Minarett
  for (x=0;x<w;x++){ var hy=30-Math.round(x*0.05+Math.sin(x*0.07)*2+hash(x>>3,1)*2); for (y=hy;y<WT;y++) b.px(x,y,M.rampAt(R('s1 s2 s3'),0.5+(hash(x>>2,y>>2)-0.5)*0.3,x,y)); }
  M.scn.roofs(b,0,90,34,'day',23,{min:4,var:5,wall:R('s2 s3 s4'),roof:R('t1 t2 t2 t3')});
  M.scn.minaret(b,30,30,20,{stone:R('w1 w2 w3 w4'),cap:R('m0 m1 m2 m3')});
  // Ružas Haus hinter der Mauer: weiße Wand, Ziegeldach, ein Kamin mit Rauch
  b.rect(146,28,86,20,P.s4); b.hl(146,231,28,P.s5); b.rect(170,33,9,8,P.w1); b.rect(171,34,7,6,P.k2); b.vl(174,34,39,P.w2); b.hl(171,177,37,P.w2);
  b.poly([[140,29],[232,29],[232,12],[160,12]],function(x,y){ return ((x+y)%4===0)?P.t1:(y%3===0?P.t3:P.t2); }); b.line(160,12,140,29,P.t1); b.hl(160,231,12,P.t4);
  b.rect(204,4,6,9,P.s3); b.hl(203,210,4,P.s4); for (i=0;i<6;i++) b.ellipse(207+i*3,1-i*0.5,2+i*0.6,1.6,function(x,y){ return bayer(x,y)<0.5-i*0.06?P.s5:undefined; });
  // der kahle Quittenbaum, über die Mauer
  function branch(x0,y0,a,L,wd,d){ var x1=x0+Math.cos(a)*L, y1=y0+Math.sin(a)*L; for (var t=0;t<=1;t+=1/L){ var px=x0+(x1-x0)*t, py=y0+(y1-y0)*t; b.px(Math.round(px),Math.round(py),P.w1); if (wd>1) b.px(Math.round(px)+1,Math.round(py),P.w0); }
    if (d>0){ branch(x1,y1,a-0.45-r()*0.3,L*0.7,wd-1,d-1); branch(x1,y1,a+0.35+r()*0.3,L*0.66,wd-1,d-1); } else if (r()<0.3) b.px(Math.round(x1),Math.round(y1),P.y3); }
  branch(62,WT,-1.75,14,3,4); branch(66,WT-8,-1.1,12,2,3); branch(58,WT-6,-2.3,11,2,3);
  // die Gartenmauer, gekalkt, mit Ziegelabdeckung
  fill(b,0,WT,w,GY-WT,function(x,y){ var c=M.rampAt(R('s3 s4 s5'),0.62+(hash(x>>3,y>>3)-0.5)*0.12-(y>GY-10?(y-GY+10)/30:0),x,y); if (hash(x,y)<0.03) c=P.s3; return c; });
  for (x=0;x<w;x++){ b.px(x,WT-1,(x%4===0)?P.t1:P.t3); b.px(x,WT,(x%4===0)?P.t1:P.t2); b.px(x,WT+1,P.s2); }
  // das Holztor mit Vordach
  var TX0=82, TX1=124, TY=36;
  b.poly([[TX0-8,TY],[TX1+8,TY],[TX1+3,TY-7],[TX0-3,TY-7]],function(x,y){ return ((x+y*3)%5===0)?P.t1:(y%2?P.t3:P.t2); }); b.hl(TX0-8,TX1+8,TY,P.t1); b.hl(TX0-3,TX1+3,TY-7,P.t4);
  b.rect(TX0-3,TY+1,3,GY-TY-1,P.w1); b.rect(TX1,TY+1,3,GY-TY-1,P.w1); b.hl(TX0-3,TX1+2,TY+1,P.w0);
  var MIDX=Math.round((TX0+TX1)/2);
  fill(b,TX0,TY+2,TX1-TX0,GY-TY-2,function(x,y){ var u=x-TX0, pl=Math.floor(u/7), c=M.rampAt(R('e2 e3 e4'),0.45+(hash(pl,y>>4)-0.5)*0.35+(u%7===1?0.3:0),x,y);
    if (u%7===0) c=P.e1; if (x===MIDX||x===MIDX-1) c=P.w1; if (hash(x,y>>1)<0.04) c=P.e1; return c; });
  [TY+9,GY-11].forEach(function(yy){ b.rect(TX0,yy,TX1-TX0,3,P.e2); b.hl(TX0,TX1-1,yy,P.e4); b.hl(TX0,TX1-1,yy+2,P.e1); });   // Querleisten
  b.line(TX0+2,GY-12,MIDX-3,TY+12,P.e1); b.line(TX0+3,GY-12,MIDX-2,TY+12,P.e4); b.line(TX1-3,GY-12,MIDX+2,TY+12,P.e1); b.line(TX1-4,GY-12,MIDX+1,TY+12,P.e4);   // Streben
  for (var nx=TX0+3;nx<TX1;nx+=7){ b.px(nx,TY+10,P.k2); b.px(nx,GY-10,P.k2); }   // Nägel
  b.ellipse((TX0+TX1)/2+4,62,2,2,P.k2); b.px((TX0+TX1)/2+4,62,P.e3); b.ellipse((TX0+TX1)/2-4,62,2,2,P.k2); b.px((TX0+TX1)/2-4,62,P.e3);   // Ringe
  // die Gasse: Kopfsteinpflaster
  fill(b,0,GY,w,h-GY,function(x,y){ return M.tex.cobble(x,y,R('s0 s1 s2 s3'),7); }); b.hl(0,w-1,GY,P.s1);
  // Lana zerreißt das Foto: eine Hälfte und der Fahrschein für Mali, die andere bleibt bei ihr
  fig(b,103,GY+2,S({nh:[11,-26],fh:[4,-28],ln:1,ho:[1,1]}),'R','mala');
  put(b,teen({hip:[0.4,-20],sh:[1.2,-31],hc:[2.4,-36.4],nf:[2.5,0],ff:[-2.4,0],ne:[4.4,-25.6],nh:[8.6,-26],fe:[0.2,-24],fh:[0.6,-17.4],mouth:false}),130,GY+2,'L');
  var H1=[114,67], H2=[107,66];
  b.poly([[H1[0],H1[1]-3],[H1[0]+5,H1[1]-3],[H1[0]+5,H1[1]+3],[H1[0]+1,H1[1]+3],[H1[0]+2,H1[1]+1],[H1[0],H1[1]]],P.s5); b.rect(H1[0]+2,H1[1]-2,3,2,P.b2); b.px(H1[0]+3,H1[1]+1,P.r3);   // ihre Hälfte für ihn
  b.rect(H1[0]+3,H1[1]+3,5,3,P.s6); b.hl(H1[0]+3,H1[0]+7,H1[1]+4,P.r3); b.px(H1[0]+7,H1[1]+3,P.s4);   // der Fahrschein
  b.poly([[H2[0]-4,H2[1]-3],[H2[0]+1,H2[1]-3],[H2[0],H2[1]-1],[H2[0]+1,H2[1]+3],[H2[0]-4,H2[1]+3]],P.s4); b.rect(H2[0]-3,H2[1]-2,2,3,P.h2);   // ihre Hälfte
  // Licht: weich, grau; die Hände und das Foto heller
  M.light(b,M.lf.sum(M.lf.k(-0.3),M.lf.band(60,104,0,-0.8),M.lf.pool(114,68,26,18,0.9,0.8)));
  edgeDark(b,2.0); };

// ================================================================ 7. k2_busnight — die Nacht darauf: Mali am Fenster, Großmutter krank im Bett, unten im Tal ein Bus im Nebel
// die alte Frau im Bett: Profil, liegend, der Kopf rechts auf dem Kissen, das Gesicht nach oben; x0,y0 = Mitte des Kopfes
function granBed(b,x0,y0){ var sk=R('p2 p3 p4');
  b.ellipse(x0+1,y0+4,9,3.8,P.s5); b.ellipse(x0+1,y0+3,8,2.6,P.s6); b.hl(x0-7,x0+8,y0+7,P.s3);   // Kissen
  b.ellipse(x0+1.5,y0-0.5,4.6,4.2,P.s3); b.ellipse(x0+1,y0+0.2,4,3.6,P.s4);                      // weißes Tuch um den Kopf
  b.ellipse(x0-0.5,y0-0.6,3,3.2,sk[1]); b.px(x0-1.5,y0-3.4,sk[2]); b.px(x0-2.5,y0-2.6,sk[2]); b.px(x0-3.4,y0-1.4,sk[1]);   // Gesicht nach oben, die Nase
  b.hl(x0-2,x0-1,y0-1.2,P.k2); b.px(x0-1,y0+1.2,sk[0]); b.px(x0+2,y0-3,P.s5); }
M.mem.k2_busnight=function(b){ var w=b.w,h=b.h, r=M.rng(1194), x, y, i;
  var FL=97, WX0=160, WX1=204, WY0=22, WY1=62;
  // Raum: Balkendecke, gekalkte Wände, Dielen
  fill(b,0,0,w,FL,function(x,y){ if (y<7) return (x%22<3)?P.w0:M.rampAt(R('w0 w1 w2'),0.4+y/14,x,y); if (y===7) return P.w0; return M.rampAt(R('s1 s2 s3'),0.62-y/FL*0.2,x,y); });
  fill(b,0,FL,w,h-FL,function(x,y){ var c=M.tex.boards(x,y,R('w0 w1 w2 w3'),3); return c; });
  b.hl(0,w-1,FL,P.w0);
  // das Fenster in der dicken Wand; draußen Nacht, unten im Tal Nebel, ein Bus mit Scheinwerfern
  b.rect(WX0-5,WY0-4,WX1-WX0+10,WY1-WY0+9,P.s2); b.rect(WX0-3,WY0-2,WX1-WX0+6,WY1-WY0+4,P.s1);
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ var v=(y-WY0)/(WY1-WY0); return M.rampAt(R('n0 n1 n1 n2'),0.2+v*0.6,x,y); });
  for (i=0;i<14;i++) b.px(WX0+Math.floor(r()*(WX1-WX0)),WY0+Math.floor(r()*12),r()<0.3?P.n4:P.n3);
  for (x=WX0;x<WX1;x++){ var hy=WY0+20+Math.round(Math.sin(x*0.09)*3+Math.sin(x*0.23+1)*1.5); for (y=hy;y<WY1;y++) b.px(x,y,y<hy+1?P.n2:P.n0); }   // der Hang gegenüber
  fill(b,WX0,WY0+27,WX1-WX0,16,function(x,y){ var d=1-Math.abs(y-(WY0+33))/8; return bayer(x,y)<d*0.75?(d>0.6?P.n4:P.n3):undefined; });   // Nebelband im Tal
  for (i=0;i<4;i++) b.px(WX0+4+Math.floor(r()*(WX1-WX0-8)),WY0+30+Math.floor(r()*8),P.y2);   // ein paar Lichter, kaum
  var BX=WX0+24, BY=WY0+33;   // der Bus: zwei Scheinwerfer, ihr Licht im Nebel
  for (i=0;i<20;i++) for (var j=-1-Math.floor(i/5);j<=1+Math.floor(i/5);j++) if (bayer(BX-i,BY+j)<0.75-i*0.034) b.px(BX-i,BY+j,i<6?P.s6:P.s4);
  b.px(BX,BY,P.l1); b.px(BX+2,BY,P.l1); b.px(BX+1,BY,P.y5); b.px(BX+5,BY-1,P.r3);
  b.vl(Math.round((WX0+WX1)/2),WY0,WY1-1,P.w1); b.hl(WX0,WX1-1,Math.round((WY0+WY1)/2),P.w1); b.rect(WX0-1,WY0-1,WX1-WX0+2,1,P.w2); b.rect(WX0-1,WY1,WX1-WX0+2,1,P.w2); b.vl(WX0-1,WY0,WY1,P.w2); b.vl(WX1,WY0,WY1,P.w2);
  b.rect(WX0-5,WY1+4,WX1-WX0+10,3,P.s4); b.hl(WX0-5,WX1+4,WY1+4,P.s5);   // breite Fensterbank
  // ein Vorhang, zur Seite geschoben
  for (y=WY0-3;y<WY1+4;y++) for (x=WX1+1;x<WX1+9-Math.round((y-WY0)*0.06);x++) b.px(x,y,((x+Math.floor(y/2))%3===0)?P.r1:P.r2);
  // die Wanduhr: Mitternacht
  M.prop.clock(b,132,24,5,0,0);
  // das Bett, das Kopfende rechts; die Lampe auf dem Nachttisch daneben
  b.rect(96,50,5,FL-50,P.w1); b.hl(96,100,50,P.w2); b.vl(96,51,FL-1,P.w2); b.rect(26,68,4,FL-68,P.w1); b.hl(26,29,68,P.w2);
  b.rect(29,76,67,7,P.w2); b.hl(29,95,76,P.w3); b.rect(31,83,3,FL-83,P.w1); b.rect(91,83,3,FL-83,P.w1);
  b.poly([[30,76],[33,69],[46,66],[64,66],[76,68],[80,71],[82,76],[82,82],[30,82]],function(x,y){ var c=((Math.floor(x/7)+Math.floor(y/5))%2)?P.r2:P.r1; if ((x+y)%7===0) c=P.y2; if (y<70 && x>40 && x<70) c=M.UP[c]; return c; });   // die Steppdecke
  b.line(33,69,46,66,P.r3); b.line(46,66,64,66,P.r3);
  granBed(b,88,69);
  b.ellipse(72,69,2.4,1.6,P.p3); b.px(73,68,P.p4);   // ihre Hand auf der Decke
  b.rect(103,80,15,3,P.w2); b.hl(103,117,80,P.w3); b.rect(103,83,15,FL-83,P.w1); b.hl(104,116,88,P.w0); b.rect(109,85,3,1,P.y2);   // Nachttisch
  b.rect(106,76,5,4,P.y2); b.hl(106,110,76,P.y3); b.rect(107,70,3,6,P.s5); b.px(108,72,P.y4); b.px(108,73,P.y5); b.px(108,71,P.l1);   // Petroleumlampe
  b.rect(113,77,3,3,P.b3); b.px(114,77,P.b4); b.line(113,79,117,78,P.m4);   // ein Glas Wasser, ein Löffel
  // Mali am Fenster, die Hand am Rahmen; er sieht hinunter
  put(b,teen({hip:[0.6,-20],sh:[1.6,-31],hc:[3,-36.2],nf:[2.5,0],ff:[-2.6,0],ne:[5.4,-27],nh:[9.6,-33.6],fe:[0.2,-24],fh:[0.4,-17.6],mouth:false}),152,FL+1,'R');
  // Licht: die Lampe warm und klein, das Fenster kalt; sonst Nacht
  M.light(b,function(x,y){ if (x>=WX0 && x<WX1 && y>=WY0 && y<WY1) return 0; var v=-2.5; var dx=(x-104)/58, dy=(y-74)/40, a=1-dx*dx-dy*dy; if (a>0) v+=3.0*Math.pow(a,1.4);
    var dx2=(x-170)/34, dy2=(y-58)/44, a2=1-dx2*dx2-dy2*dy2; if (a2>0) v+=2.0*Math.pow(a2,1.1); return v; });
  b.px(108,71,P.l1); b.px(108,72,P.y5); b.px(BX,BY,P.l1); b.px(BX+2,BY,P.l1);
  edgeDark(b,1.8); };

// ================================================================ 8. k2_ruza — Januar 1994, Ružas Küche: das Formular mit dem roten Kreuz, das Wärmefach steht offen
M.mem.k2_ruza=function(b){ var w=b.w,h=b.h, r=M.rng(194), x, y, i;
  var FL=97;
  // Wand gekalkt, Sockel, Dielen
  fill(b,0,0,w,FL,function(x,y){ if (y>FL-9) return M.rampAt(R('w1 w2'),0.5,x,y); return M.rampAt(R('s3 s4 s5'),0.62-y/FL*0.18+(hash(x>>3,y>>3)-0.5)*0.06,x,y); });
  b.hl(0,w-1,FL-9,P.w3); fill(b,0,FL,w,h-FL,function(x,y){ return M.tex.boards(x,y,R('w0 w1 w2 w3'),3); }); b.hl(0,w-1,FL,P.w0);
  // Fenster mit Spitzenvorhang: draußen Schnee
  var WX0=50, WX1=86, WY0=20, WY1=54;
  b.rect(WX0-3,WY0-3,WX1-WX0+6,WY1-WY0+6,P.w2); fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ return y>WY0+22?M.rampAt(R('s4 s5 s6'),0.6+(y-WY0-22)/20,x,y):M.rampAt(R('s3 s4'),0.5,x,y); });
  for (x=WX0;x<WX1;x++){ var hh=WY0+20+Math.round(Math.sin(x*0.3)*1.5); b.px(x,hh,P.s2); b.px(x,hh+1,P.s5); }
  for (i=0;i<16;i++) b.px(WX0+Math.floor(r()*(WX1-WX0)),WY0+Math.floor(r()*(WY1-WY0-12)),P.s6);
  b.vl(Math.round((WX0+WX1)/2),WY0,WY1-1,P.w2); b.hl(WX0,WX1-1,WY0+15,P.w2);
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ var u=x-WX0, v=y-WY0, m=((u+v)%5===0)||((u-v+50)%5===0); return (v<6||(u<7)||(u>WX1-WX0-8))&&m?P.s6:undefined; });   // Spitze
  b.rect(WX0-4,WY1+3,WX1-WX0+8,2,P.w3); b.hl(WX0-4,WX1+3,WY1+3,P.w4);
  // Wandkalender 1994, über dem Tisch
  b.rect(130,22,16,20,P.s6); b.rect(130,22,16,6,P.r2); M.microText(b,'1994',131,23,P.s6); for (y=30;y<40;y+=2) for (x=132;x<145;x+=3) b.px(x,y,P.s2); b.px(138,20,P.k2);
  // das Hochzeitsfoto
  b.rect(98,26,10,12,P.w1); b.rect(99,27,8,10,P.s4); b.ellipse(102,31,1.6,2,P.p3); b.rect(101,29,3,1,P.h1); b.rect(100,33,5,4,P.k2); b.rect(105,31,1,6,P.s6);
  // Kredenz links: Glastüren, Tassen
  b.rect(6,30,32,FL-30,P.w2); b.hl(6,37,30,P.w4); b.rect(8,34,13,22,P.k2); b.rect(23,34,13,22,P.k2); b.hl(8,35,45,P.w1);
  for (i=0;i<4;i++){ b.rect(9+i*7,41,3,3,P.s5); b.px(12+i*7,42,P.s4); b.rect(9+i*7,52,3,3,P.s5); } b.rect(6,60,32,3,P.w3); b.rect(8,64,28,FL-66,P.w1); b.vl(22,64,FL-3,P.w0); b.px(20,72,P.y3); b.px(24,72,P.y3);
  // der Kohleherd (Gusseisen, Nickelkanten): Platte, Feuertür mit Glut, Backrohr, Aschenlade; rechts oben das Wärmefach, offen
  var HX0=176, HX1=208, HY=70;
  b.rect(HX0,HY,HX1-HX0,FL-HY-3,P.k2); b.hl(HX0-1,HX1,HY,P.m4); b.hl(HX0-1,HX1,HY+1,P.m3); b.vl(HX0,HY+1,FL-4,P.m2); b.vl(HX1-1,HY+1,FL-4,P.m1);
  b.rect(HX0+1,FL-3,3,3,P.k2); b.rect(HX1-4,FL-3,3,3,P.k2);
  b.rect(HX0+3,HY+4,10,7,P.k1); b.rect(HX0+4,HY+5,8,5,P.t2); fill(b,HX0+5,HY+6,6,3,function(x,y){ return (x+y)%2?P.t4:P.y3; }); b.hl(HX0+3,HX0+12,HY+4,P.m3);   // Feuertür, einen Spalt offen
  b.rect(HX0+15,HY+4,14,13,P.k1); b.hl(HX0+15,HX0+28,HY+4,P.m3); b.rect(HX0+19,HY+8,6,2,P.m4);   // Backrohr
  b.rect(HX0+3,HY+14,10,4,P.k1); b.hl(HX0+3,HX0+12,HY+14,P.m2);   // Aschenlade
  b.rect(HX1-14,HY-12,14,12,P.k2); b.hl(HX1-15,HX1-1,HY-12,P.m3); b.vl(HX1-15,HY-12,HY-1,P.m2);
  b.rect(HX1-12,HY-10,10,8,P.k0); b.hl(HX1-12,HX1-3,HY-10,P.k1); b.hl(HX1-11,HX1-4,HY-3,P.t1); b.px(HX1-9,HY-4,P.t2);   // innen dunkel, ein Hauch Wärme
  b.poly([[HX1-2,HY-10],[HX1+6,HY-13],[HX1+6,HY-1],[HX1-2,HY-2]],function(x,y){ return x===HX1+6?P.m4:(y<HY-9-(x-HX1)*0.3?P.m3:P.m2); }); b.line(HX1-2,HY-10,HX1+6,HY-13,P.m4); b.px(HX1+4,HY-7,P.m4);   // die Klappe steht seitlich offen
  for (i=0;i<6;i++) b.px(HX1-14+Math.floor(r()*13),HY-12+Math.floor(r()*12),P.t1);   // Rost
  // Ofenrohr: hoch, dann in die Wand (Rosette)
  b.rect(HX0+4,32,4,HY-32,P.k2); b.vl(HX0+4,32,HY-1,P.m1); b.ellipse(HX0+6,31,4,4,P.m1); b.ellipse(HX0+6,31,3,3,P.k2); b.ellipse(HX0+6,31,1.6,1.6,P.k1);
  // ein Topf auf der Platte, der Kohleneimer
  b.rect(HX0+6,HY-6,9,6,P.m2); b.hl(HX0+5,HX0+15,HY-6,P.m4); b.hl(HX0+8,HX0+12,HY-8,P.m3);
  b.rect(160,87,11,10,P.m1); b.hl(160,170,87,P.m3); b.line(160,87,165,81,P.m2); b.line(170,87,165,81,P.m2); for (x=161;x<170;x++) b.px(x,88,(x%2)?P.k1:P.k2);
  // der Stuhl hinter ihr
  b.rect(104,84,10,2,P.w3); b.rect(104,62,2,22,P.w2); b.hl(104,105,62,P.w3); b.vl(105,86,FL-1,P.w1); b.vl(113,86,FL-1,P.w1);
  // Ruža am Tisch
  fig(b,112,FL,S({h:[0,-15],nf:[9,0,'f'],ff:[7,0,'f'],sit:1,nh:[11,-25],fh:[9,-24],ho:[1,1]}),'R','babica');
  // der Tisch mit der Häkeldecke, die über die Kante hängt
  var TX0=113, TX1=156, TY=77;
  b.rect(TX0+2,TY+2,3,FL-TY-2,P.w1); b.rect(TX1-5,TY+2,3,FL-TY-2,P.w1); b.rect(TX0,TY,TX1-TX0,2,P.w3);
  fill(b,TX0-1,TY-1,TX1-TX0+2,9,function(x,y){ var u=x-TX0, v=y-TY+1; if (v>=6 && ((u+40)%4)>1) return undefined; if (v===8 && ((u+40)%4)!==0) return undefined; return ((u*3+v*5)%7===0)?P.s4:(v===0?P.s6:P.s5); });
  b.rect(146,TY-4,4,4,P.s5); b.px(150,TY-3,P.s4); b.hl(146,149,TY-4,P.w1);   // eine Tasse
  b.poly([[130,TY-1],[140,TY-2],[141,TY],[131,TY+1]],P.s4); b.line(130,TY-1,135,TY+1,P.s3);   // der Umschlag
  // das Formular mit dem roten Kreuz, in beiden Händen
  var FX=119, FY=59; b.rect(FX,FY,11,13,P.s6); b.vl(FX+10,FY,FY+12,P.s4); b.rect(FX+4,FY+2,3,1,P.r3); b.rect(FX+5,FY+1,1,3,P.r3);
  for (y=FY+5;y<FY+11;y+=2) b.hl(FX+1,FX+8-((y>>1)%2),y,P.s2);
  b.rect(FX-1,FY+10,2,3,P.p4); b.px(FX+1,FY+11,P.p3); b.rect(FX+8,FY+9,2,3,P.p3); b.px(FX+10,FY+10,P.p2);   // ihre Hände an den unteren Ecken
  // Licht: kaltes Fensterlicht von links, die Glut warm von rechts unten
  M.light(b,M.lf.sum(M.lf.k(-0.9),M.lf.pool(68,40,76,62,1.3,0.9),M.lf.pool(HX0+8,HY+8,30,22,1.6,0.9),M.lf.pool(117,70,30,26,1.5,0.8)));
  edgeDark(b,2.0); };

// ================================================================ 9. k2_lanaroom — Lanas Zimmer, Nacht: unter der Schreibtischlampe zeichnet sie eine Straßenbahn auf einer Brücke
M.mem.k2_lanaroom=function(b){ var w=b.w,h=b.h, r=M.rng(1993), x, y, i;
  var DY0=79, DY1=89, DX0=72, DX1=166;            // Tischplatte: hintere und vordere Kante
  // Wand mit Tapete, Fußleiste; Boden
  fill(b,0,0,w,h,function(x,y){ if (y>=92) return M.rampAt(R('w1 w2'),0.5,x,y); var c=M.tex.wallpaper(x,y,R('b1 b2 b3')); return c; });
  b.hl(0,w-1,91,P.w2); b.hl(0,w-1,92,P.w0);
  // Fenster rechts, Klebeband in Kreuzen auf den Scheiben, draußen dunkel
  var WX0=180, WX1=216, WY0=14, WY1=58;
  b.rect(WX0-3,WY0-3,WX1-WX0+6,WY1-WY0+7,P.s4); fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ return M.rampAt(R('k0 k1 n0'),(y-WY0)/(WY1-WY0)*0.8,x,y); });
  for (i=0;i<8;i++) b.px(WX0+Math.floor(r()*(WX1-WX0)),WY0+Math.floor(r()*20),P.n3);
  var MX=Math.round((WX0+WX1)/2), MY=Math.round((WY0+WY1)/2);
  b.vl(MX,WY0,WY1-1,P.s3); b.hl(WX0,WX1-1,MY,P.s3);
  [[WX0,WY0,MX,MY],[MX+1,WY0,WX1,MY],[WX0,MY+1,MX,WY1],[MX+1,MY+1,WX1,WY1]].forEach(function(q){ b.line(q[0]+1,q[1]+1,q[2]-2,q[3]-2,P.e4); b.line(q[2]-2,q[1]+1,q[0]+1,q[3]-2,P.e4); });
  for (y=WY0-3;y<WY1+4;y++) for (x=WX0-10;x<WX0-3+Math.round((y-WY0)*0.04);x++) b.px(x,y,((x+Math.floor(y/2))%3===0)?P.v1:P.v2);   // Vorhang
  // das Konzertplakat (erfunden) und Zeichnungen an der Wand
  b.rect(18,10,30,42,P.k2); b.rect(19,11,28,40,P.d2); b.ellipse(33,26,9,9,P.d4); b.ellipse(33,26,5,5,P.d2); b.rect(31,16,4,20,P.k2); M.microText(b,'ROCK',23,40,P.y4); M.microText(b,'KSC 91',21,46,P.s5);
  b.rect(56,14,16,20,P.s5); b.ellipse(64,22,4,5,P.s3); b.px(62,21,P.k2); b.px(66,21,P.k2); b.hl(62,66,26,P.s2); b.rect(59,29,10,3,P.s3);   // ein Gesicht
  kidTram(b,154,12,16,11,7,{paper:P.s5}); kidTram(b,56,40,16,11,8,{paper:P.s5}); kidTram(b,154,42,14,10,9,{paper:P.s4});
  // das Schild über ihr
  b.rect(86,20,64,16,P.s6); b.hl(86,149,20,P.s5); b.vl(149,21,35,P.s4); b.px(88,21,P.r3); b.px(147,21,P.r3);
  M.microText(b,'PRVA TROJKA',96,23,P.r2); M.microText(b,'POSLIJE RATA',94,29,P.r2);
  // das Bett links (Ecke), Tagesdecke
  fill(b,0,72,54,32,function(x,y){ var top=72+(x>46?(x-46)*0.5:0); if (y<top) return undefined; if (y<top+3) return P.s5; return ((Math.floor(x/5)+Math.floor(y/4))%2)?P.r2:P.y2; }); b.ellipse(14,71,10,3.2,P.s6); b.hl(6,22,73,P.s4); b.vl(54,76,103,P.w1);
  // Lana am Schreibtisch, von vorn; der Tisch verdeckt sie von der Hüfte abwärts
  fig(b,118,96,M.poseF({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-6,-18],rh:[6,-19],sit:1,hd:'b',ho:[0,1]},'F'),'F','mala');
  b.px(125,76,P.y3); b.px(126,75,P.y3); b.px(127,74,P.k1);   // der Bleistift
  // Tischplatte in Aufsicht, die Vorderseite mit Schublade
  b.poly([[DX0+6,DY0],[DX1-6,DY0],[DX1,DY1],[DX0,DY1]],function(x,y){ return M.rampAt(R('w2 w3 w4'),0.45+(y-DY0)/(DY1-DY0)*0.3,x,y); });
  b.hl(DX0,DX1,DY1,P.w4); b.rect(DX0,DY1+1,DX1-DX0+1,h-DY1-1,P.w2); b.hl(DX0,DX1,DY1+1,P.w1); b.rect(DX0+30,DY1+6,34,8,P.w1); b.rect(DX0+44,DY1+9,6,2,P.y3);
  // das Blatt: eine Straßenbahn auf einer Bogenbrücke über dem Fluss
  var PX0=100, PX1=138; b.poly([[PX0+2,DY0+1],[PX1-2,DY0+1],[PX1,DY1-1],[PX0,DY1-1]],P.s6);
  var DK=DY0+3; b.hl(PX0+5,PX1-5,DK,P.k2);   // die Fahrbahn der Brücke
  for (x=PX0+7;x<=PX1-7;x++){ var u=(x-(PX0+PX1)/2)/((PX1-PX0)/2-7), ay=Math.round(DY1-2-(1-u*u)*4.6); b.px(x,ay,P.k2); if (x%3===0) b.vl(x,DK+1,ay-1,P.s3); }   // der Bogen
  b.rect(PX0+12,DY0+1,13,2,P.r3); b.px(PX0+14,DY0+1,P.s6); b.px(PX0+17,DY0+1,P.s6); b.px(PX0+20,DY0+1,P.s6); b.line(PX0+17,DY0,PX0+19,DY0-1,P.k2);   // die Bahn
  b.hl(PX0+3,PX1-3,DY1-2,P.b3); b.px(PX0+9,DY1-2,P.b4); b.px(PX1-11,DY1-2,P.b4);   // Wasser
  // Blechdose mit Stiften, ein Block
  b.rect(84,75,7,8,P.m3); b.vl(84,75,82,P.m4); b.hl(84,90,75,P.m4); b.line(86,75,85,69,P.y3); b.line(88,75,89,68,P.r3); b.line(89,75,91,70,P.b3);
  b.poly([[142,80],[156,80],[158,86],[143,86]],P.s5); b.hl(143,156,81,P.s3);
  // die Schreibtischlampe (Gelenkarm), rechts
  b.rect(150,83,9,3,P.k2); b.line(154,83,150,64,P.m2); b.line(155,83,151,64,P.m1); b.line(150,64,138,58,P.m2); b.line(150,65,138,59,P.m1);
  b.poly([[132,60],[141,54],[145,60],[138,65]],P.g2); b.line(132,60,141,54,P.g3); b.ellipse(137,63,3,1.4,P.y5);
  // Licht: nur die Lampe; der Kegel fällt auf Blatt und Gesicht
  M.light(b,function(x,y){ var v=-2.4; var dx=(x-122)/56, dy=(y-76)/36, a=1-dx*dx-dy*dy; if (a>0) v+=3.0*Math.pow(a,1.2); if (x>=WX0&&x<WX1&&y>=WY0&&y<WY1) v=Math.max(v,-0.5); return v; });
  b.ellipse(137,63,2.6,1.2,P.y5); b.px(137,63,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 10. k2_bridge — Nacht, Scheinwerfer auf der Bergstraße, unten der grüne, laute Fluss; eine Brücke ohne Mitte. Ganz ruhig.
M.mem.k2_bridge=function(b){ var w=b.w,h=b.h, r=M.rng(1312), x, y, i;
  var DK=46, AL0=70, AL1=96, AR0=146, AR1=172, RV=70;    // Fahrbahnhöhe, Brückenköpfe links/rechts, Fluss hinten
  // Himmel, Sterne, ferne Kämme
  M.vgrad(b,0,0,w,RV,R('k0 k1 k2 n0'));
  for (i=0;i<50;i++) b.px(Math.floor(r()*w),Math.floor(r()*34),r()<0.2?P.n4:(r()<0.5?P.n3:P.n2));
  for (x=0;x<w;x++){ var fy=34+Math.round(Math.sin(x*0.035+1)*5+Math.sin(x*0.11)*2); for (y=fy;y<RV;y++) b.px(x,y,y<fy+1?P.n2:P.n1); }
  for (x=0;x<w;x++){ var fy2=48+Math.round(Math.sin(x*0.05+3)*4); for (y=fy2;y<RV;y++) b.px(x,y,y<fy2+1?P.n1:P.n0); }
  // der Fluss: kommt von hinten aus der Schlucht und wird nach vorn breit; grün, weiße Gischt
  var LX=function(y){ return 100-(y-RV)*(100/(h-RV)); }, RX=function(y){ return 140+(y-RV)*(92/(h-RV)); };
  for (y=RV;y<h;y++) for (x=Math.max(0,Math.floor(LX(y)));x<Math.min(w,Math.ceil(RX(y)));x++){ var d=(y-RV)/(h-RV), f=Math.sin(x*0.11/(0.35+d)+y*1.3)*0.8+Math.sin(x*0.04-y*0.7+d*3)*0.5;
    var c=M.rampAt(R('a1 g2 a2 g3 a3 a4'),0.3+d*0.35+f*0.14,x,y); if (f>1.18 && (y&1)) c=P.s5; else if (f>1.0 && (x+y)%2) c=P.a5; b.px(x,y,c); }
  for (i=0;i<80;i++){ var fy3=RV+2+Math.floor(r()*(h-RV-2)), d2=(fy3-RV)/(h-RV), fx=Math.floor(LX(fy3)+r()*(RX(fy3)-LX(fy3))), L=2+Math.floor(r()*(3+d2*9));
    for (var k=0;k<L;k++) if (fx+k<RX(fy3) && bayer(fx+k,fy3)<0.9-k*0.06) b.px(fx+k,fy3,r()<0.5?P.s6:P.s5); }
  // die Felsen der Schlucht, links und rechts, bis ans Wasser
  function rock(x,y){ var st=Math.floor((y+x*0.35)/5); var c=M.rampAt(R('k0 k1 g0 k2 g1'),0.28+(hash(st,x>>4)-0.5)*0.4+(y<DK+8?0.12:0),x,y); return c; }
  b.poly([[0,12],[30,22],[AL0-4,DK-2],[AL1,DK+2],[AL1+2,DK+10],[100,RV],[0,h-2],[0,h]],rock);
  b.poly([[w,16],[206,26],[AR1+4,DK-2],[AR0,DK+2],[AR0-2,DK+10],[140,RV],[w,h-6],[w,h]],rock);
  b.line(AL1+2,DK+10,100,RV,P.g1); b.line(AR0-2,DK+10,140,RV,P.g1); b.line(100,RV,0,h-2,P.k2); b.line(140,RV,w,h-6,P.k2);
  for (y=RV;y<h;y++){ b.px(Math.round(LX(y)),y,P.s4); b.px(Math.round(RX(y))-1,y,P.s4); }   // das Wasser schäumt an den Ufern
  // die Straße: am linken Hang herunter bis zum Brückenkopf; drüben geht sie weiter
  for (x=0;x<AL0;x++){ var ry=Math.round(18+x*(DK-18)/AL0); for (y=ry;y<ry+3;y++) b.px(x,y,y===ry?P.m2:P.m1); b.px(x,ry-1,(x%6<3)?P.m3:P.k1); }
  for (x=AR1;x<w;x++){ var ry2=Math.round(DK-(x-AR1)*0.38); for (y=ry2;y<ry2+3;y++) b.px(x,y,y===ry2?P.m2:P.m1); b.px(x,ry2-1,(x%6<3)?P.m3:P.k1); }
  // die zwei Brückenköpfe aus Stein, mit dem Ansatz der Fahrbahn; dazwischen nichts
  function head(x0,x1,dir){ for (y=DK;y<DK+14;y++) for (x=x0;x<x1;x++){ var c=M.tex.ashlar(x,y,R('s0 s1 s2 s3'),7,4); if (y<DK+2) c=P.s3; b.px(x,y,c); }
    var e=dir>0?x1:x0-1; for (i=0;i<4;i++){ b.px(e+dir*i,DK+i%2,P.s2); b.px(e+dir*i,DK+1+i%2,P.s1); } b.px(e+dir*4,DK+2,P.s1); b.line(e+dir*2,DK+3,e+dir*5,DK+6,P.m1); }
  head(AL0,AL1,1); head(AR0,AR1,-1);
  b.hl(AL0,AL1+3,DK-1,P.m2); b.hl(AR0-4,AR1,DK-1,P.m2);
  // Dunst über dem Wasser
  M.fogBake(b,function(x,y){ var d=1-Math.abs(y-(RV+3))/11, e=1-Math.abs(x-120)/62; return (d>0&&e>0)?d*Math.min(1,e*1.6)*0.55:0; },{col:P.n2});
  // der Lastwagen: kaum zu sehen, nur seine Lichter oben auf der Straße; die Kegel zeigen zur Brücke
  var TX=26, TY=Math.round(18+TX*(DK-18)/AL0)-3;
  b.rect(TX-13,TY-6,13,8,P.k1); b.rect(TX-2,TY-4,4,6,P.k2);
  for (i=0;i<74;i++) for (var j=-Math.floor(i*0.2)-1;j<=Math.floor(i*0.2)+1;j++){ var bx=TX+2+i, by=Math.round(TY+1+i*0.4+j); if (bx>=w) continue; var a=0.66-i*0.0082-Math.abs(j)*0.03; if (bayer(bx,by)<a) b.px(bx,by,i<10?P.s6:(i<36?P.s5:P.s4)); }
  b.px(TX+2,TY+1,P.l1); b.px(TX+1,TY+2,P.l1); b.px(TX+2,TY+2,P.y5);
  edgeDark(b,2.0); };

// ================================================================ 11. k2_road — November 2011, früh, Schnee: der Bus nach Mostar fährt aus dem Tal nach Westen; am Fenster zwei Gestalten
M.mem.k2_road=function(b){ var w=b.w,h=b.h, r=M.rng(2411), x, y, i;
  var RY=64, BY=96;                                // Straßenrand hinten, Radaufstand des Busses
  // Himmel: verhangen, Morgen
  M.vgrad(b,0,0,w,RY,R('s3 s4 s4 s5'));
  // Hügel, verschneit, mit dunklen Waldflecken
  function hills(y0,amp,f,ph,col,snow){ for (var x=0;x<w;x++){ var t=Math.round(y0-amp*(0.6+0.4*Math.sin(x*f+ph))-Math.sin(x*f*2.7+ph*2)*amp*0.25); for (var y=t;y<RY;y++){ var c=snow, n=Math.sin(x*0.19+y*0.31+ph)+Math.sin(x*0.07-y*0.5+ph*3); if (n>0.9 && y>t+2) c=col; else if (n>0.6 && y>t+2 && bayer(x,y)<0.5) c=col; b.px(x,y,y===t?M.UP[snow]:c); } } }
  hills(36,8,0.021,0.6,P.s3,P.s5); hills(46,6,0.034,2.1,P.s2,P.s4);
  // die Hochhäuser der Stadt, hinten rechts, im Schneedunst; ein paar Fenster schon hell
  [[150,18,16],[170,12,14],[190,22,18],[212,16,15],[134,30,12]].forEach(function(t,k){ var x0=t[0], top=t[1], tw=t[2];
    for (var yy=top;yy<RY;yy++) for (var xx=x0;xx<x0+tw;xx++){ var c=(xx===x0)?P.s3:P.s2; if ((yy-top)%4===2 && (xx-x0)%3!==0) c=hash(xx,yy+k)<0.12?P.y4:P.s1; b.px(xx,yy,c); }
    b.hl(x0,x0+tw-1,top,P.s4); });
  M.fogBake(b,function(x,y){ return y<RY?0.45-(y/RY)*0.2:0; },{col:P.s4,h:RY});
  // die Ebene vor der Stadt, die Miljacka als dunkler Strich, Bäume
  fill(b,0,RY-6,w,6,function(x,y){ return M.rampAt(R('s4 s5'),0.5,x,y); }); b.hl(0,w-1,RY-3,P.s2); b.hl(0,w-1,RY-2,P.s3);
  for (i=0;i<9;i++){ var tx=Math.floor(r()*w), th=6+Math.floor(r()*6); b.vl(tx,RY-6-th,RY-6,P.s1); b.line(tx,RY-6-th+2,tx-2,RY-6-th+5,P.s1); b.line(tx,RY-6-th+3,tx+2,RY-6-th+6,P.s1); }
  // die Straße, verschneit, mit Spuren; die Leitplanke; ein Schild nach Mostar
  fill(b,0,RY,w,h-RY,function(x,y){ var c=M.rampAt(R('s4 s5 s6'),0.55+(y-RY)/80,x,y); if (y===BY+1||y===BY+5||y===BY-3) c=P.s3; return c; });
  b.hl(0,w-1,RY+1,P.m3); b.hl(0,w-1,RY+2,P.m2); for (x=4;x<w;x+=14) b.vl(x,RY+2,RY+6,P.m1);
  // der Reisebus: weiß, ein rotes Band, durchgehendes Fensterband; die Front links (Westen)
  var B0=36, B1=184, BT=44, BB=BY-5;
  b.poly([[B0+9,BT],[B1-2,BT],[B1,BT+2],[B1,BB],[B0+1,BB],[B0,BB-6],[B0,BT+16],[B0+3,BT+5]],function(x,y){ var v=(y-BT)/(BB-BT); return M.rampAt(R('s3 s4 s5 s6'),0.9-v*0.55,x,y); });
  b.hl(B0+9,B1-2,BT,P.s6); b.vl(B1,BT+2,BB,P.s2); b.hl(B0+1,B1,BB,P.s2);
  b.poly([[B0+4,BT+5],[B0+12,BT+2],[B0+12,BT+21],[B0+1,BT+21],[B0+1,BT+15]],P.k2); b.line(B0+4,BT+5,B0+1,BT+15,P.m3); b.line(B0+6,BT+5,B0+3,BT+14,P.m1);   // Frontscheibe
  b.rect(B0+15,BT+5,8,BB-BT-9,P.k2); b.vl(B0+19,BT+5,BB-5,P.m1); b.hl(B0+15,B0+22,BT+5,P.m2);   // Tür
  // Fensterband: drinnen warmes Licht, Sitzlehnen; nur in einem Fenster sitzen zwei
  var WT=BT+5, WB=BT+21, WX0=B0+26, WX1=B1-6;
  for (y=WT;y<WB;y++) for (x=WX0;x<WX1;x++) b.px(x,y,M.rampAt(R('w1 w2 w3 y2'),0.25+(y-WT)/(WB-WT)*0.45,x,y));
  for (x=WX0;x<WX1;x+=19){ b.rect(x,WT,2,WB-WT,P.k2); }
  for (x=WX0+4;x<WX1-4;x+=10){ if (x>WX0+50 && x<WX0+74) continue; b.ellipse(x+3,WB-2,3,1.8,P.w1); b.rect(x,WB-2,7,2,P.w1); }   // Sitzlehnen
  b.hl(WX0,WX1-1,WT,P.k2); b.hl(WX0,WX1-1,WB,P.k2); b.hl(WX0,WX1-1,WB+1,P.s3);
  b.rect(B0+1,BB-13,B1-B0,3,P.r2); b.hl(B0+1,B1,BB-13,P.r3); b.line(B1-40,BB-10,B1,BB-22,P.r2);   // das rote Band
  for (x=B0+48;x<B1-30;x+=34) b.vl(x,BB-9,BB-2,P.s3);   // Gepäckklappen
  // die zwei: Marko (kurzes Haar), daneben Mala am Fenster, schmaler, mit dem Zopf, ein wenig durchscheinend
  var SX=WX0+58, SY=WT+6;
  for (y=WT;y<WB;y++) for (x=SX-8;x<SX+18;x++){ var d=Math.abs(x-SX-5)/14; if (bayer(x,y)<0.55-d*0.5) b.px(x,y,M.UP[b.get(x,y)]); }   // ein Leselicht über den beiden
  b.ellipse(SX+10,SY,3.4,3.8,P.k1); b.rect(SX+5,SY+3,11,WB-SY-3,P.k1); b.rect(SX+6,SY+3,9,1,P.k1); b.px(SX+13,SY-3,P.k2); b.px(SX+7,SY+1,P.k2);   // Marko
  for (y=SY-4;y<WB;y++) for (x=SX-5;x<SX+5;x++){ var inH=Math.pow((x+0.5-SX)/2.9,2)+Math.pow((y+0.5-SY)/3.3,2)<=1, inB=(y>=SY+3 && Math.abs(x+0.5-SX)<4-(y<SY+5?1.2:0)); if (!(inH||inB)) continue; b.px(x,y,bayer(x,y)<0.8?P.k2:P.w1); }   // Mala
  for (i=0;i<6;i++){ b.px(SX+3,SY+1+i,(i%2)?P.k2:P.k1); } b.px(SX+3,SY+7,P.k1);   // ihr Zopf
  // Räder in den Radkästen, Schneegischt nach hinten
  [B0+30,B1-26].forEach(function(cx){ b.ellipse(cx,BB+1,9,6,P.k2); b.ellipse(cx,BB+2,6.5,6.5,P.k1); b.ellipse(cx,BB+2,3.2,3.2,P.m3); b.px(cx,BB+2,P.m1);
    for (var k=0;k<30;k++){ var sx=cx+6+Math.floor(r()*20), sy=BB-3+Math.floor(r()*9); if (bayer(sx,sy)<0.7) b.px(sx,sy,P.s6); } });
  // Scheinwerfer, ihr Licht im Schnee
  b.rect(B0,BB-7,3,2,P.y5); for (i=0;i<32;i++) for (var j=-Math.floor(i*0.25);j<=Math.floor(i*0.25);j++){ var bx=B0-1-i, by=BB-6+j+Math.floor(i*0.12); if (bx<0) continue; if (bayer(bx,by)<0.58-i*0.016) b.px(bx,by,P.s6); }
  // fallender Schnee
  for (i=0;i<170;i++){ var fx=Math.floor(r()*w), fy=Math.floor(r()*h), near=r()<0.2; b.px(fx,fy,near?P.s6:P.s5); if (near) b.px(fx+1,fy,P.s5); }
  M.light(b,M.lf.sum(M.lf.k(-0.2),M.lf.band(0,104,0.2,-0.5)));
  edgeDark(b,1.8); };

})(M);
