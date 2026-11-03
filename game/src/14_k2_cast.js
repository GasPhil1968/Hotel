/* ===== 14_k2_cast.js — Besetzung Kapitel 2 (Sarajevo, November 2011): Köpfe, Kleidung, Dinge in der Hand, eigene Animationen =====
   Vorgaben: game/CAST2.md (IDs und Animationsnamen fest). Format wie 03_cast.js; Legende der Kopf-Stempel ebenda
   (k Umriss · H h j Haar · S s t Haut · e Auge · m Mund · b Bart · c C Mütze/Tuch · g Brille · w Weiß · r Akzent), dazu je Figur eigene Zeichen.
   Gegenstände: in der Seitenansicht über M.HELD (an der nahen Hand), in Vorder-/Rückansicht und für Dinge, die eine Figur immer bei sich trägt
   (Stock, Mappe unter dem Arm, Tüte auf dem Schoß …), über post() mit eigenen Posenfeldern: fi (Ding vorn in beiden Händen), nb (ohne Buch/Mappe
   unter dem Arm), cr (Krümel), gl (Funke), wt (Armbanduhr). Sitzende Figuren sitzen wie die allgemeine Haltung 'sit' (Hüfte 13 px über dem Boden),
   auch wenn ihre Beine kürzer oder länger sind. */
(function(M){
'use strict';
var P=M.P, T=M.T, S=M.poseS, F=M.poseF, H=M.HELD;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// Kopfvarianten wie M.headSet, dazu 'l'/'r' (Blick nach links/rechts: Augen einen Pixel versetzt)
function eyes(rows,d){ return rows.map(function(r){ var a=r.split(''), o=a.slice(); for (var i=0;i<a.length;i++){ if (a[i]!=='e') continue; var j=i+d; if (a[j] && 'Sst'.indexOf(a[j])>=0 && a[j-d*2]!=='e'){ o[i]=a[j]; o[j]='e'; } } return o.join(''); }); }
function HS(rows,skin){ var s=M.headSet(rows,skin); s.l=eyes(rows,-1); s.r=eyes(rows,1); return s; }
// Pose mit festen Grundwerten
function pose(base,v){ return function(o){ var p={}, k; for (k in base) p[k]=base[k]; if (o) for (k in o) p[k]=o[k]; return v==='S'||!v?S(p):F(p,v); }; }
// Sitzen: Hüfte immer auf Sitzhöhe der Räume (wie M.ANIMS.sit), unabhängig von der Beinlänge der Figur
function sitter(hipY,o0){ var y=-13+((hipY||23)-23), b={h:[0,y],nf:[9,0,'f'],ff:[7,0,'f'],sit:1}, k; if (o0) for (k in o0) b[k]=o0[k]; return pose(b,'S'); }

// ---------------------------------------------------------------- Gelenke wie im Rig (02_rig.js), für Dinge unter dem Arm und Hände über Dingen
function ik(ax,ay,tx,ty,l1,l2,bend){ var dx=tx-ax, dy=ty-ay, d=Math.sqrt(dx*dx+dy*dy), md=l1+l2-0.01; if (d>md){ dx*=md/d; dy*=md/d; d=md; } if (d<0.01) d=0.01;
  var a=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d)))), base=Math.atan2(dy,dx), ang=base+bend*a; return [ax+Math.cos(ang)*l1, ay+Math.sin(ang)*l1]; }
function limb(b,a,c,r,col){ var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx<0||(nx===0&&ny>0)){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=Math.max(0,Math.min(1,(px*vx+py*vy)/L2)), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=qx*nx+qy*ny; b.px(x,y, s>r*0.4?col[1]:(s<-r*0.4?col[2]:col[0])); } } }
function hand(b,x,y,c){ x=Math.round(x); y=Math.round(y); b.px(x,y,c[0]); b.px(x+1,y,c[0]); b.px(x,y+1,c[1]); b.px(x+1,y+1,c[1]); }
// Gelenke einer Pose (relativ zu den Füßen); S: shN/shF Schultern, eN/eF Ellbogen, nh/fh Hände; F/B: sL/sR, eL/eR, lh/rh
function geo(ch,p,hx,hy){ var L=ch.tLen, bn=ch.bones, g={top:hy-L+1};
  if (p.v==='S'){ var ln=p.ln||0, shx=Math.round(ln*(L-2)/(L-1)); g.shx=shx; g.shN=[hx+1+shx,hy-L+2]; g.shF=[hx-1+shx,hy-L+2]; g.nh=p.nh||[hx,hy+2]; g.fh=p.fh||[hx-2,hy+2];
    g.eN=ik(g.shN[0],g.shN[1],g.nh[0],g.nh[1],bn[2],bn[3],1); g.eF=ik(g.shF[0],g.shF[1],g.fh[0],g.fh[1],bn[2],bn[3],1); return g; }
  var sw=ch.shoulder, fr=p.v==='F'?1:-1; g.sL=[hx-sw,hy-L+2]; g.sR=[hx+sw,hy-L+2]; g.lh=p.lh||[g.sL[0]-2,hy+2]; g.rh=p.rh||[g.sR[0]+2,hy+2];
  g.eL=ik(g.sL[0],g.sL[1],g.lh[0],g.lh[1],bn[2],bn[3],-fr*0.35); g.eR=ik(g.sR[0],g.sR[1],g.rh[0],g.rh[1],bn[2],bn[3],fr*0.35); return g; }
// nahen Arm (Seitenansicht) bzw. einen Arm (vorn/hinten: -1 links, 1 rechts im Bild) noch einmal zeichnen: liegt dann über dem, was darunter steckt
function armS(b,ch,p,OX,OY,hx,hy){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; };
  limb(b,o(g.shN),o(g.eN),ch.armR?ch.armR[0]:1.3,C.sleeve); limb(b,o(g.eN),o(g.nh),ch.armR?ch.armR[1]:1.0,C.arm||C.sleeve); hand(b,OX+g.nh[0]-0.5,OY+g.nh[1]-0.5,C.hand); }
function armF(b,ch,p,OX,OY,hx,hy,side){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; }, s=side<0?g.sL:g.sR, e=side<0?g.eL:g.eR, h=side<0?g.lh:g.rh;
  limb(b,o(s),o(e),ch.armR?ch.armR[0]+0.1:1.4,C.sleeve); limb(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,C.arm||C.sleeve); hand(b,OX+h[0]-0.5,OY+h[1]-0.5,C.hand); }
function handsF(b,ch,p,OX,OY){ if (p.lh) hand(b,OX+p.lh[0]-0.5,OY+p.lh[1]-0.5,ch.cols.hand); if (p.rh) hand(b,OX+p.rh[0]-0.5,OY+p.rh[1]-0.5,ch.cols.hand); }
// post() bekommt die Pose mit den Grundwerten des Rigs ergänzt (Hände, Füße), auch wenn ein Skript eine knappe Pose einfriert
function full(ch,p,hx,hy){ var q={}, k; for (k in p) q[k]=p[k];
  if (p.v==='S'){ if (!q.nh) q.nh=[hx,hy+2]; if (!q.fh) q.fh=[hx-2,hy+2]; if (!q.nf) q.nf=[0,0,'f']; if (!q.ff) q.ff=[0,0,'f']; }
  else { var sw=ch.shoulder; if (!q.lh) q.lh=[hx-sw-2,hy+2]; if (!q.rh) q.rh=[hx+sw+2,hy+2]; } return q; }
// Pixel nur setzen, wo schon eine bestimmte Farbe liegt (Flecken auf der Schürze, Muster auf dem Stoff)
function onCol(b,x,y,cols,c){ if (cols.indexOf(b.get(x,y))>=0) b.px(x,y,c); }

// ---------------------------------------------------------------- Dinge in der nahen Hand (Seitenansicht). x,y = Hand; vorn ist +x, der Boden liegt bei M.SPR.OY
// Džezva: Kupferkännchen am langen Stiel
H.dzezva=function(b,x,y){ b.hl(x+2,x+4,y,P.w1); b.hl(x+5,x+6,y-2,P.y3); b.px(x+7,y-2,P.t4); b.px(x+5,y-1,P.t4); b.hl(x+6,x+7,y-1,P.t3); b.hl(x+5,x+7,y,P.t3); b.px(x+8,y,P.t2); b.hl(x+5,x+7,y+1,P.t2); };
// Džezva beim Eingießen: gekippt, ein dünner Strahl, unten das Fildžan
H.dzezvaPour=function(b,x,y){ b.line(x+2,y,x+4,y-1,P.w1); b.px(x+5,y-2,P.t4); b.px(x+6,y-2,P.y3); b.hl(x+5,x+7,y-1,P.t3); b.px(x+6,y,P.t3); b.px(x+7,y,P.t4); b.px(x+8,y,P.y3); b.px(x+6,y+1,P.t2);
  b.vl(x+9,y+1,y+5,P.w1); b.hl(x+8,x+10,y+6,P.s6); b.hl(x+8,x+10,y+7,P.s5); };
// Tablett mit Džezva und zwei Fildžani (beidhändig vor dem Bauch)
H.tray=function(b,x,y){ b.hl(x+3,x+4,y-4,P.y3); b.px(x+3,y-3,P.t4); b.px(x+4,y-3,P.t3); b.hl(x,x+2,y-4,P.w1); b.px(x+3,y-2,P.t3); b.px(x+4,y-2,P.t2);
  b.px(x-1,y-2,P.s6); b.px(x,y-2,P.s5); b.px(x+6,y-2,P.s6); b.px(x+7,y-2,P.s5); b.hl(x-2,x+8,y-1,P.m4); b.hl(x-1,x+7,y,P.m2); };
// Thermosbecher / Deckel der Thermoskanne (Metall), ein Hauch Dampf
H.tcup=function(b,x,y){ b.hl(x+1,x+3,y-3,P.m4); b.px(x+2,y-3,P.w1); b.hl(x+1,x+3,y-2,P.m3); b.hl(x+1,x+3,y-1,P.m2); b.px(x+2,y-5,P.s4); };
// Thermoskanne aufrecht in der Hand
H.thermos=function(b,x,y){ b.hl(x+2,x+3,y-6,P.k2); b.rect(x+2,y-5,2,8,P.m3); b.vl(x+2,y-5,y+2,P.m4); b.hl(x+2,x+3,y-1,P.m2); };
// Eingießen: die ferne Hand hält die Kanne schräg über den Becher in der nahen Hand
H.thermosPour=function(b,x,y){ b.line(x+3,y-6,x+7,y-10,P.m3); b.line(x+4,y-6,x+8,y-10,P.m2); b.line(x+3,y-7,x+7,y-11,P.m4); b.px(x+8,y-11,P.k2); b.px(x+3,y-5,P.m4); b.px(x+2,y-4,P.w2); H.tcup(b,x,y); };
// Heft mit Bleistift (schreiben)
H.heft=function(b,x,y){ b.hl(x-1,x+5,y+2,P.s6); b.hl(x-1,x+5,y+3,P.n2); b.px(x+2,y+1,P.k1); b.line(x+3,y,x+4,y-2,P.y3); };
// kleiner Treibhammer: beim Schlag (Kopf unten am Werkstück) und ausgeholt (Kopf oben)
H.hammer=function(b,x,y){ b.hl(x+2,x+3,y,P.w3); b.rect(x+4,y-1,2,3,P.m2); b.px(x+4,y-1,P.m4); b.px(x+5,y+1,P.m1); };
H.hammerUp=function(b,x,y){ b.px(x+2,y,P.w3); b.px(x+3,y-1,P.w3); b.rect(x+4,y-3,2,3,P.m2); b.px(x+4,y-3,P.m4); b.px(x+5,y-1,P.m1); };
// Stichel über einer Kupferplatte
H.graver=function(b,x,y){ b.line(x+1,y,x+3,y+1,P.m4); b.hl(x,x+5,y+2,P.t4); b.hl(x+1,x+4,y+3,P.t2); b.px(x+2,y+2,P.y4); };
// Dominostein
H.domino=function(b,x,y){ b.rect(x+1,y-3,2,3,P.s6); b.px(x+2,y-2,P.k1); b.hl(x+1,x+2,y-1,P.s4); };
// Handy (Bildschirm hell), B: der Daumen tippt
H.phoneA=function(b,x,y){ b.rect(x+1,y-4,2,4,P.k2); b.px(x+1,y-4,P.b4); b.px(x+2,y-3,P.b3); };
H.phoneB=function(b,x,y){ b.rect(x+1,y-4,2,4,P.k2); b.px(x+1,y-4,P.b5); b.px(x+1,y-3,P.b4); b.px(x+2,y-2,P.p4); };
// Schlüsselbund am Ring, zwei Lagen (klimpern)
H.keysA=function(b,x,y){ b.px(x+2,y-2,P.m4); b.px(x+1,y-1,P.m4); b.px(x+3,y-1,P.m4); b.vl(x+2,y,y+2,P.y3); b.vl(x+4,y,y+1,P.m4); b.px(x+1,y+1,P.m3); };
H.keysB=function(b,x,y){ b.px(x+2,y-2,P.m4); b.px(x+1,y-1,P.m4); b.px(x+3,y-1,P.m4); b.line(x+3,y,x+4,y+2,P.y3); b.px(x+1,y+1,P.m4); b.px(x+5,y,P.m3); };
// Reisigbesen: der Stiel geht durch die Hand, das Bündel steht auf dem Boden
H.besen=function(b,x,y){ var G=M.SPR.OY, k=0.42, by=G-5, bx=Math.round(x+(by-y)*k); b.line(Math.round(x-7*k),y-7,bx,by,P.w3);
  b.poly([[bx-1,by],[bx+2,by],[bx+5,G+1],[bx-3,G+1]],P.y2); b.line(bx,by+1,bx-2,G,P.y1); b.line(bx+1,by+1,bx+3,G,P.y1); b.hl(bx-1,bx+2,by,P.e1); };
// Häkelnadel mit dem Stück, an dem gerade gehäkelt wird
H.crochet=function(b,x,y){ b.line(x+1,y-1,x+3,y-3,P.m4); b.hl(x-1,x+2,y+2,P.y3); b.px(x,y+2,P.r3); b.px(x+2,y+2,P.b3); b.hl(x,x+1,y+3,P.g4); };
// gefaltete Zeitung zum Hinhalten
H.newsFold=function(b,x,y){ b.rect(x+1,y-4,5,5,P.s5); b.hl(x+2,x+4,y-3,P.k2); b.hl(x+2,x+5,y-1,P.s3); b.px(x+5,y-3,P.s3); b.vl(x+1,y-4,y,P.s4); };
// offenes Buch, in beiden Händen auf dem Schoß (im Sitzen)
H.bookS=function(b,x,y){ b.hl(x+2,x+5,y-2,P.s6); b.hl(x+1,x+6,y-1,P.s5); b.px(x+3,y-1,P.s3); b.hl(x+1,x+6,y,P.n1); };
// dieselben Dinge, die sonst vorn in beiden Händen liegen, für Seitenansichten: Kästchen, Handglocke, Stempel, Lupe, Mappe, Buch (zu)
H.box=function(b,x,y){ b.rect(x+1,y-3,3,3,P.r2); b.hl(x+1,x+3,y-3,P.r3); b.px(x+2,y-2,P.y3); };
H.bell=function(b,x,y){ b.vl(x+1,y-2,y-1,P.w2); b.hl(x,x+1,y+2,P.y3); b.hl(x-1,x+2,y+3,P.y3); b.px(x-1,y+3,P.y4); b.hl(x-1,x+2,y+4,P.y2); b.px(x+1,y+5,P.y1); };
H.stamp=function(b,x,y){ b.hl(x,x+1,y-1,P.w3); b.px(x,y-2,P.w4); b.hl(x-1,x+2,y+2,P.k2); };
H.loupe=function(b,x,y){ b.hl(x+2,x+3,y,P.k2); b.hl(x+4,x+5,y-3,P.m4); b.vl(x+3,y-2,y-1,P.m4); b.vl(x+6,y-2,y-1,P.m4); b.hl(x+4,x+5,y,P.m3); b.px(x+4,y-2,P.b5); b.px(x+5,y-2,P.b4); b.hl(x+4,x+5,y-1,P.b4); };
H.folder=function(b,x,y){ b.rect(x+1,y-6,5,7,P.m2); b.hl(x+1,x+5,y-6,P.s5); b.vl(x+5,y-5,y,P.m1); };
H.book=function(b,x,y){ b.rect(x+1,y-4,4,5,P.n1); b.vl(x+4,y-4,y,P.s5); b.px(x+2,y-2,P.n2); };

// ---------------------------------------------------------------- Dinge vorn in beiden Händen (Vorderansicht), gezeichnet in post(): FH[p.fi](b,p,OX,OY,hx,hy,ch)
var FH={
  // Zeitung, aufgeschlagen vor der Brust
  news:function(b,p,X,Y){ var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-5, y0=Y+Math.min(p.lh[1],p.rh[1])-3; b.rect(x0,y0,11,7,P.s5); b.hl(x0+1,x0+4,y0+1,P.k2); b.rect(x0+6,y0+1,3,2,P.m2);
    for (var i=0;i<3;i++){ b.hl(x0+1,x0+4,y0+3+i,i%2?P.s4:P.s3); b.hl(x0+6,x0+9,y0+4+i*0.5|0,P.s3); } b.vl(x0+5,y0,y0+6,P.s4); },
  newsTurn:function(b,p,X,Y){ FH.news(b,p,X,Y); var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-5, y0=Y+Math.min(p.lh[1],p.rh[1])-3; b.rect(x0+6,y0-2,4,6,P.s6); b.vl(x0+6,y0-2,y0+3,P.s4); },
  rag:function(b,p,X,Y){ var x=X+p.rh[0], y=Y+p.rh[1]; b.rect(x-1,y+1,4,2,P.s5); b.px(x+2,y+2,P.s4); },
  // Blatt in der linken Bildhand, Lupe in der rechten
  loupe:function(b,p,X,Y){ var sx=X+p.lh[0], sy=Y+p.lh[1]; b.rect(sx-1,sy-6,6,7,P.s6); b.hl(sx,sx+3,sy-4,P.s3); b.hl(sx,sx+4,sy-2,P.s3); b.hl(sx,sx+2,sy,P.s3);
    var lx=X+p.rh[0], ly=Y+p.rh[1]; b.vl(lx,ly-2,ly,P.k2); b.hl(lx-1,lx+1,ly-6,P.m4); b.vl(lx-2,ly-5,ly-4,P.m4); b.vl(lx+2,ly-5,ly-4,P.m4); b.hl(lx-1,lx+1,ly-3,P.m3); b.hl(lx-1,lx+1,ly-5,P.b5); b.hl(lx-1,lx+1,ly-4,P.b4); },
  // aufgeklappte Mappe; folderTurn: ein Blatt wird umgeschlagen
  folder:function(b,p,X,Y){ var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-5, y0=Y+Math.min(p.lh[1],p.rh[1])-4; b.rect(x0,y0,11,7,P.m2); b.rect(x0+1,y0,4,6,P.s6); b.rect(x0+6,y0,4,6,P.s5); b.vl(x0+5,y0,y0+6,P.m1);
    b.px(x0+2,y0+2,P.s4); b.px(x0+3,y0+2,P.s4); b.px(x0+2,y0+4,P.s4); b.px(x0+7,y0+3,P.e3); b.px(x0+8,y0+2,P.e3); },
  folderTurn:function(b,p,X,Y){ FH.folder(b,p,X,Y); var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-5, y0=Y+Math.min(p.lh[1],p.rh[1])-4; b.rect(x0+5,y0-2,3,6,P.s6); b.vl(x0+7,y0-2,y0+3,P.s4); },
  // offenes Buch (stehend lesen)
  book:function(b,p,X,Y){ var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-4, y0=Y+Math.min(p.lh[1],p.rh[1])-3; b.rect(x0,y0+1,9,5,P.n1); b.rect(x0,y0,4,5,P.s6); b.rect(x0+5,y0,4,5,P.s5); b.vl(x0+4,y0,y0+4,P.s3);
    b.hl(x0+1,x0+2,y0+1,P.s3); b.hl(x0+1,x0+3,y0+3,P.s3); b.hl(x0+6,x0+7,y0+2,P.s3); },
  bookTurn:function(b,p,X,Y){ FH.book(b,p,X,Y); var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-4, y0=Y+Math.min(p.lh[1],p.rh[1])-3; b.rect(x0+4,y0-2,3,5,P.s6); b.vl(x0+6,y0-2,y0+2,P.s4); },
  // Schmuckkästchen (Samt, Messingrand)
  box:function(b,p,X,Y){ var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-2, y0=Y+Math.min(p.lh[1],p.rh[1])-3; b.rect(x0,y0,5,4,P.r2); b.hl(x0,x0+4,y0,P.r3); b.hl(x0,x0+4,y0+1,P.y3); b.px(x0+2,y0+1,P.y5); },
  // Stempel in der rechten Bildhand: Griff oben, Gummi unten
  stamp:function(b,p,X,Y){ var x=X+p.rh[0], y=Y+p.rh[1]; b.hl(x,x+1,y-2,P.w3); b.px(x,y-3,P.w4); b.hl(x-1,x+2,y+2,P.k2); },
  // Handglocke (Messing) in der rechten Bildhand
  bell:function(b,p,X,Y){ var x=X+p.rh[0], y=Y+p.rh[1]; b.vl(x,y-2,y-1,P.w2); b.hl(x,x+1,y+2,P.y3); b.hl(x-1,x+2,y+3,P.y3); b.px(x-1,y+3,P.y4); b.hl(x-1,x+2,y+4,P.y2); b.px(x+1,y+5,P.y1); },
  bellT:function(b,p,X,Y){ var x=X+p.rh[0], y=Y+p.rh[1]; b.vl(x+1,y-2,y-1,P.w2); b.hl(x+1,x+2,y+2,P.y3); b.hl(x+1,x+3,y+3,P.y3); b.px(x+1,y+3,P.y4); b.hl(x+2,x+4,y+4,P.y2); b.px(x+4,y+5,P.y1); }
};

// ================================================================ LEBENDE

// ---------------------------------------------------------------- FIKRET HADŽIĆ (54), Buregdžinica: Bürstenschnitt grau, dichter Schnauzbart, rote Wangen, Bäckerjacke, Schürze mit Mehl
var fiS=[
"............",
"...kkkkkk...",
"..kjhjjhjk..",
".kjhhhhhhjk.",
".khhhhhhSSSk",
".khhhhSSSSSk",
".khhtSSSSeSk",
".khtSSSSSSSSk",
".ktSSrrSSbbk.",
".ktSSSSSbbbk.",
"..ktSSSSSmk..",
"...ktSSSSk...",
"....kttk....",
"....ktsk...."];
var fiF=[
"..kkkkkkk..",
".kjhjjhjjk.",
"kjhhhhhhhjk",
"khhSSSSShhk",
"khSSSSSSShk",
"kSSSSSSSSSk",
"kSSeSSSeSSk",
"kSrSSStSrSk",
"ktSbbbbbStk",
"kttSSmSSttk",
".ktSSSSStk.",
"..ktttttk..",
"...ktttk...",
"...kssk...."];
var fiB=[
"..kkkkkkk..",
".kjhjjhjjk.",
"kjhhhhhhhjk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kShhhhhhhSk",
"kshhhhhhhsk",
"kshhhhhhhsk",
"kssHhhhHssk",
".ksssssssk.",
"..ksssssk..",
"...ktttk...",
"...kssk...."];
var fiP=pose({},'S');
M.defineChar('fikret',{
  legend:L({j:P.m4,h:P.m3,H:P.m2,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.m3,r:P.d4}),
  heads:{S:HS(fiS),F:HS(fiF),B:{n:fiB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:13,col:[P.s5,P.s6,P.s4],open:P.b1,side:9,belly:1}, torsoS:{collar:[P.b1,P.b1]},
  coat:{c:[P.s4,P.s5,P.s3],hem:9,w:6},
  shoulder:6,
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Mehl auf der Schürze
  post:function(b,p,X,Y,hx,hy){ var A=[P.s4,P.s5,P.s3];
    if (p.v==='F'){ onCol(b,X+hx-3,Y+hy+1,A,P.l1); onCol(b,X+hx+2,Y+hy+3,A,P.s6); onCol(b,X+hx-1,Y+hy+5,A,P.s6); onCol(b,X+hx+4,Y+hy+6,A,P.l1); onCol(b,X+hx-4,Y+hy+7,A,P.s6); }
    else if (p.v==='S' && !p.sit){ onCol(b,X+hx+2,Y+hy+1,A,P.l1); onCol(b,X+hx+4,Y+hy+4,A,P.s6); onCol(b,X+hx,Y+hy+6,A,P.s6); } },
  anims:{
    // schimpft mit dem erhobenen Brief
    gesture:[[fiP({nh:[6,-31],fh:[2,-24],it:'paper'}),120],[fiP({nh:[9,-42],fh:[4,-27],it:'paper',hd:'o',ln:-1}),200],[fiP({nh:[10,-40],fh:[4,-26],it:'paper',ln:-1}),130],
      [fiP({nh:[9,-43],fh:[6,-28],it:'paper',hd:'o',ln:-1}),190],[fiP({nh:[10,-40],fh:[4,-26],it:'paper',ln:-1}),130],[fiP({nh:[9,-42],fh:[7,-29],it:'paper',hd:'o',ln:-1}),220],
      [fiP({nh:[8,-34],fh:[3,-25],it:'paper'}),520],[fiP({nh:[8,-34],fh:[3,-25],it:'paper',hd:'b'}),110],[fiP({nh:[8,-35],fh:[3,-25],it:'paper',hd:'o'}),160],[fiP({nh:[8,-34],fh:[3,-25],it:'paper'}),380]],
    // wischt die Hände an der Schürze ab
    wipe:[[fiP({nh:[5,-25],fh:[4,-17],ho:[1,1]}),170],[fiP({nh:[6,-16],fh:[4,-24],ho:[1,1]}),190],[fiP({nh:[5,-25],fh:[4,-17],ho:[1,1]}),170],[fiP({nh:[6,-16],fh:[4,-24],ho:[1,1],hd:'b'}),190],
      [fiP({nh:[5,-25],fh:[4,-17],ho:[1,1]}),170],[fiP({nh:[6,-16],fh:[4,-24],ho:[1,1]}),190],[fiP({nh:[3,-21],fh:[0,-21]}),700],[fiP({nh:[3,-21],fh:[0,-21],hd:'b'}),110],[fiP({nh:[3,-21],fh:[0,-21]}),500]] }
});

// ---------------------------------------------------------------- SENADA (61), Kiosk: dunkelrot gefärbtes kurzes Haar, Brille, dicke graue Strickjacke, Schal
var seS=[
"............",
"....kkkkk...",
"...khhjhhkk.",
"..khhhhhhhhk",
".kHhhhhhhhSk",
".kHHhhhSSSSk",
".kHHhtSggegk",
".kHHtSSSSSSSk",
"..kHtSSSSSSk",
"..kktSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var seF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khhSSSShhhk",
"khSSSSSSShk",
"kHgegSgegHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var seB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kHhhhhhhhHk",
"kHHhhhhhHHk",
".kHHhhhHHk.",
".kHHHHHHHk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var seP=pose({},'F');
M.defineChar('senada',{
  legend:L({H:P.r1,h:P.r2,j:P.r3,S:P.p4,s:P.p3,t:P.p2,m:P.r2,g:P.m1}),
  heads:{S:HS(seS),F:HS(seF),B:{n:seB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.m2,P.m3,P.m1],buttons:P.m4,scarf:[P.a3,P.a4,P.a2],side:8},
  bones:[10,10,7,7], hipY:22,
  cols:{trou:[P.c0,P.c1,P.k1],trouF:[P.k1,P.c0,P.k0],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  armR:[1.4,1.1],
  post:function(b,p,X,Y,hx,hy){ if (p.v==='F' && p.fi && FH[p.fi]){ FH[p.fi](b,p,X,Y,hx,hy); handsF(b,M.CHARS.senada,p,X,Y); } },
  anims:{
    // liest Zeitung im Kiosk (vorn, Zeitung vor der Brust), blättert, sieht kurz darüber hinweg
    read:[[seP({fi:'news',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),2000],[seP({fi:'news',lh:[-5,-27],rh:[5,-27],ho:[0,1],hd:'b'}),110],[seP({fi:'news',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),1500],
      [seP({fi:'newsTurn',lh:[-5,-27],rh:[4,-28],ho:[0,1]}),260],[seP({fi:'news',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),1700],[seP({fi:'news',lh:[-5,-26],rh:[5,-26]}),900],[seP({fi:'news',lh:[-5,-26],rh:[5,-26],hd:'b'}),110],[seP({fi:'news',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),1200]] }
});

// ---------------------------------------------------------------- HAJRA MEŠIĆ (72), Pension: hellblaues Kopftuch (hinten geknotet), weißes Haar, grüne Strickweste, geblümte Bluse
var hjS=[
"............",
"....kkkkk...",
"...kcCccck..",
"..kcCcccccck",
".kccccccwwwk",
".kcccccwSSSk",
".kcccctSteSk",
".kccctSSSSSSk",
"kcccctSSStSk.",
"kCcCctSSSmk..",
".kkcctSSSk...",
"...kkttkk....",
"....ktsk....",
"....ktsk...."];
var hjF=[
"...kkkkk...",
"..kcCccck..",
".kccCcccck.",
"kccccccccck",
"kcwwwwwwwck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kctSSStSStk",
"kcSSSSSSSck",
".ktStmtStk.",
".kcSSSSSck.",
"..kktttkk..",
"...ktttk...",
"...kssk...."];
var hjB=[
"...kkkkk...",
"..kcCccck..",
".kccCccccck",
"kccccccccck",
"kccccCcccck",
"kccccccccck",
"kccccccccck",
"kccccccccck",
".kccccccck.",
".kcckCkcck.",
"..kCcCcCk..",
"...kCkCk...",
"...ktttk...",
"...kssk...."];
var hjP=pose({},'S');
M.defineChar('hajra',{
  legend:L({c:P.b3,C:P.b4,w:P.s6,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(hjS),F:HS(hjF),B:{n:hjB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:11,col:[P.g2,P.g3,P.g1],open:P.v4,side:8,belly:1},
  skirt:{c:[P.c0,P.c1,P.k1],hem:13,flare:2},
  bones:[9,9,7,6], hipY:21, shoulder:5,
  cols:{trou:[P.p3,P.p4,P.p2],trouF:[P.p2,P.p3,P.p1],sleeve:[P.v4,P.v5,P.v3],sleeveF:[P.v3,P.v4,P.v2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.r2},
  // Blümchen auf der Bluse
  post:function(b,p,X,Y,hx,hy){ var B=[P.v4,P.v5,P.v3,P.v2], top=Y+hy-10;
    if (p.v==='F'){ onCol(b,X+hx-1,top+1,B,P.d4); onCol(b,X+hx,top+4,B,P.y4); onCol(b,X+hx-1,top+7,B,P.d4); var g=geo(M.CHARS.hajra,p,hx,hy); onCol(b,X+Math.round(g.eL[0]),Y+Math.round(g.eL[1]),B,P.d4); onCol(b,X+Math.round(g.eR[0]),Y+Math.round(g.eR[1])-1,B,P.y4); }
    else if (p.v==='S'){ var g2=geo(M.CHARS.hajra,p,hx,hy); onCol(b,X+Math.round((g2.shN[0]+g2.eN[0])/2),Y+Math.round((g2.shN[1]+g2.eN[1])/2),B,P.d4); onCol(b,X+Math.round(g2.eN[0]),Y+Math.round(g2.eN[1])+1,B,P.y4); } },
  anims:{
    // trägt das Tablett mit Džezva und Fildžani beidhändig vor sich
    tray:[[hjP({nh:[7,-25],fh:[6,-25],it:'tray'}),1400],[hjP({nh:[7,-25],fh:[6,-25],it:'tray',hd:'b'}),110],[hjP({nh:[7,-26],fh:[6,-26],it:'tray',ho:[0,-1]}),900],[hjP({nh:[7,-25],fh:[6,-25],it:'tray',hd:'o'}),160],[hjP({nh:[7,-25],fh:[6,-25],it:'tray'}),900]],
    // winkt herein
    wave:[[hjP({}),80],[hjP({nh:[7,-28],fh:[-1,-21]}),120],[hjP({nh:[10,-34],fh:[-1,-21],hd:'o'}),180],[hjP({nh:[8,-31],fh:[-1,-21]}),160],[hjP({nh:[10,-34],fh:[-1,-21],hd:'o'}),180],[hjP({nh:[8,-31],fh:[-1,-21]}),160],
      [hjP({nh:[10,-34],fh:[-1,-21]}),220],[hjP({nh:[8,-29],fh:[-1,-21],hd:'b'}),140],[hjP({}),300]] }
});

// ---------------------------------------------------------------- RADE SIMIĆ (63), Fahrdienstleiter: groß, hager, Dienstmütze der GRAS, graues Haar, Brille auf der Nasenspitze
var raS=[
"............",
"..kkkkkkkk..",
".kCCCCCCCCk.",
".kCCCCCCCCyk",
".kccccccccvvk",
".kjjjSSSSSSk",
".kjjtSSSSeSk",
".kjtSSSSSggSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....ktSSk...",
"....kttk....",
"....ktsk...."];
var raF=[
"..kkkkkkk..",
".kCCCCCCCk.",
".kCCCyCCCk.",
".kccccccck.",
"kvvvvvvvvvk",
"kjSSSSSSSjk",
"kjSeSSSeSjk",
"ktgwgtgwgtk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...ktttk...",
"...ktttk...",
"...kssk...."];
var raB=[
"..kkkkkkk..",
".kCCCCCCCk.",
".kCCCCCCCk.",
".kccccccck.",
"kCCCCCCCCCk",
"kjjjjjjjjjk",
"kjjjhjjjjjk",
"ktjjjjjjjtk",
".kjjjjjjjk.",
".ktjjjjjtk.",
"..ktttttk..",
"...ktttk...",
"...ktttk...",
"...kssk...."];
var raP=pose({},'S');
M.defineChar('rade',{
  legend:L({C:P.n1,c:P.n0,y:P.y3,v:P.k2,j:P.m4,h:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1,g:P.m2,w:P.s6}),
  heads:{S:HS(raS),F:HS(raF),B:{n:raB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:14,col:[P.n1,P.n2,P.n0],buttons:P.m4,collar:[P.b4,P.b3],side:7},
  bones:[12,11,9,8], hipY:25, shoulder:5,
  cols:{trou:[P.n1,P.n2,P.n0],trouF:[P.n0,P.n1,P.k1],sleeve:[P.n1,P.n2,P.n0],sleeveF:[P.n0,P.n1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Abzeichen (Brust vorn, Ärmel seitlich); beim Schreiben liegt das Heft in der fernen Hand, der Stift in der nahen
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.rade, g=geo(ch,p,hx,hy);
    if (p.v==='F'){ b.px(X+hx+2,Y+g.top+3,P.y3); b.px(X+hx+3,Y+g.top+3,P.r3); }
    else if (p.v==='S'){ var ax=Math.round((g.shN[0]*2+g.eN[0])/3), ay=Math.round((g.shN[1]*2+g.eN[1])/3)+1; if (!p.wr) b.px(X+ax,Y+ay,P.y3);
      if (p.wr){ var fx=X+g.fh[0], fy=Y+g.fh[1]; b.hl(fx-2,fx+4,fy-1,P.s6); b.hl(fx-2,fx+4,fy,P.n2); b.px(fx+1,fy-1,P.s4); armS(b,ch,p,X,Y,hx,hy); var nx=X+g.nh[0], ny=Y+g.nh[1]; b.line(nx+2,ny+1,nx+4,ny-2,P.y3); b.px(nx+2,ny+1,P.k1); } } },
  anims:{
    // trinkt aus dem Deckel der Thermoskanne (wie drink), hält ihn sonst vor der Brust
    cup:[[raP({nh:[5,-29],fh:[1,-24],it:'tcup'}),1100],[raP({nh:[5,-29],fh:[1,-24],it:'tcup',hd:'b'}),110],[raP({nh:[6,-35],fh:[1,-24],it:'tcup'}),150],[raP({nh:[4,-41],fh:[1,-24],it:'tcup',ln:-1,hd:'b'}),800],
      [raP({nh:[6,-35],fh:[1,-24],it:'tcup'}),160],[raP({nh:[5,-29],fh:[1,-24],it:'tcup'}),900],[raP({nh:[5,-29],fh:[1,-24],it:'tcup',ho:[1,0]}),700]],
    // schreibt gebeugt ins Heft
    write:[[raP({ln:3,nh:[9,-29],fh:[8,-27],ho:[1,1],wr:1}),420],[raP({ln:3,nh:[10,-29],fh:[8,-27],ho:[1,1],wr:1}),300],[raP({ln:3,nh:[9,-30],fh:[8,-27],ho:[1,1],wr:1,hd:'b'}),200],[raP({ln:3,nh:[11,-29],fh:[8,-27],ho:[1,1],wr:1}),460],
      [raP({ln:3,nh:[10,-29],fh:[8,-27],ho:[1,1],wr:1}),340],[raP({ln:2,nh:[9,-29],fh:[8,-27],ho:[1,0],wr:1}),800]] }
});

// ---------------------------------------------------------------- EMINA KADIĆ (58), Kafana „Kula“: strenger Knoten, grau durchzogen, markante Brauen, Goldohrringe, schwarze Bluse, dunkelrote Strickjacke, Schürze
var emS=[
"............",
"....kkkkk...",
".kkkHjHHHk..",
"kHhHkHHHHHk.",
"kHHHkHHHHSSk",
"kjHHkHHSBBSk",
".kkkHHtSSeSk",
"...kHtSSSSSSk",
"...kytSSSSSk.",
"...ktSSSSmk..",
"....ktSSSk...",
".....kkkk....",
"....ktsk....",
"....ktsk...."];
var emF=[
"....kkk....",
"..kkHjHkk..",
".kHHHHHHHk.",
"kHHHjHHHHHk",
"kHHSSSSSHHk",
"kHBBSSSBBHk",
"kHSeSSSeSHk",
"kySSSStSSyk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var emB=[
"...kkkkk...",
"..kHHjHHk..",
".kHHkkkHHk.",
"kHHkHjHkHHk",
"kHHkjHHkHHk",
"kHHHkkkHHHk",
"kHHHHHHHHHk",
"kHHHHjHHHHk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var emP=pose({},'S'), emPF=pose({},'F');
M.defineChar('emina',{
  legend:L({H:P.h1,h:P.h2,j:P.m3,B:P.h0,y:P.y3,S:P.p4,s:P.p3,t:P.p2,m:P.r2}),
  heads:{S:HS(emS),F:HS(emF),B:{n:emB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:13,col:[P.r1,P.r2,P.r0],open:P.k2,side:7},
  skirt:{c:[P.k2,P.m0,P.k1],hem:14,flare:1},
  bones:[11,10,8,7], shoulder:4,
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.r1,P.r2,P.r0],sleeveF:[P.r0,P.r1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Schürze: vorn über dem Rock, seitlich nur vor den Oberschenkeln, hinten die Schleife
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.emina;
    if (p.v==='F'){ var hm=p.sit?3:9; b.poly([[X+hx-4,Y+hy-2],[X+hx+4,Y+hy-2],[X+hx+5,Y+hy+hm],[X+hx-5,Y+hy+hm]],function(x){ return x<X+hx-2?P.s5:(x>X+hx+2?P.s3:P.s4); }); b.hl(X+hx-5,X+hx+4,Y+hy-3,P.s5);
      if (p.fi && FH[p.fi]) FH[p.fi](b,p,X,Y,hx,hy); }
    else if (p.v==='S' && !p.sit){ var bn=ch.bones, kn=ik(hx+1,hy-1,p.nf[0],p.nf[1]-2,bn[0],bn[1],-1), kf=ik(hx-1,hy-1,p.ff[0],p.ff[1]-2,bn[0],bn[1],-1), kx=Math.round(Math.max(kn[0],kf[0]));
      b.poly([[X+hx+1,Y+hy-3],[X+hx+4,Y+hy-3],[X+kx+3,Y+hy+8],[X+kx-1,Y+hy+8]],function(x){ return x>=X+kx+1?P.s5:P.s4; }); b.hl(X+hx-3,X+hx+3,Y+hy-3,P.s5); armS(b,ch,p,X,Y,hx,hy); if (p.it && H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); }
    else if (p.v==='B'){ b.hl(X+hx-1,X+hx,Y+hy-3,P.s5); b.px(X+hx-2,Y+hy-4,P.s5); b.px(X+hx+1,Y+hy-4,P.s5); b.px(X+hx-1,Y+hy-2,P.s4); b.px(X+hx,Y+hy-1,P.s4); } },
  anims:{
    // gießt Kaffee aus der Džezva ins Fildžan auf der Theke
    pour:[[emP({nh:[6,-30],fh:[3,-27],it:'dzezva'}),400],[emP({nh:[8,-35],fh:[4,-29],it:'dzezva'}),200],[emP({nh:[8,-36],fh:[5,-30],it:'dzezvaPour',ln:1,ho:[1,1]}),1300],[emP({nh:[8,-36],fh:[5,-30],it:'dzezvaPour',ln:1,ho:[1,1],hd:'b'}),110],
      [emP({nh:[8,-36],fh:[5,-30],it:'dzezvaPour',ln:1,ho:[1,1]}),700],[emP({nh:[8,-35],fh:[4,-29],it:'dzezva'}),260],[emP({nh:[6,-30],fh:[3,-27],it:'dzezva'}),600]],
    // wischt die Theke (vorn, die rechte Bildhand mit dem Tuch)
    wipe:[[emPF({lh:[-5,-29],rh:[3,-29],fi:'rag',ho:[0,1]}),260],[emPF({lh:[-5,-29],rh:[7,-29],fi:'rag',ho:[0,1]}),260],[emPF({lh:[-5,-29],rh:[4,-29],fi:'rag',ho:[0,1]}),260],[emPF({lh:[-5,-29],rh:[0,-29],fi:'rag',ho:[0,1],hd:'b'}),260],
      [emPF({lh:[-5,-29],rh:[4,-29],fi:'rag',ho:[0,1]}),260],[emPF({lh:[-5,-29],rh:[7,-29],fi:'rag',ho:[0,1]}),260],[emPF({lh:[-5,-29],rh:[5,-29],fi:'rag'}),700]] }
});

// ---------------------------------------------------------------- LEJLA KADIĆ (16): langer dunkler Pferdeschwanz, Pony, große Creolen, weiße Kapuzenjacke, schwarzes Shirt, Jeans, Turnschuhe
var leS=[
"............",
"....kkkkk...",
"...kHHhHHk..",
"kkkHHHHHHHk.",
"kHhkHHHHHHHk",
"kHHkHHHhhhHk",
".kHkHHtSSeSk",
".kHkHtSSSSSSk",
".kHkytSSSSSk.",
".kHkyktSSmk..",
".kHk.kttSk...",
".kHk..kkk....",
".kHk.ktsk....",
".kjk.ktsk....",
"..kk........"];
var leF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHhhhhhHHk",
"kHhhhhhhhHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSSStSSHk",
"kySSSSSSSyk",
".ytSSmSSty.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var leB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHrHHHHk",
"kHHHHHHHHHk",
"kHHHHhHHHHk",
"kyHHHHHHHyk",
"kHHHHhHHHHk",
".kHHHHHHHk.",
"..kkHHHkk..",
"...kHhHk...",
"...kHHHk...",
"...kHjHk...",
"....kHk....",
"....kjk....",
".....k....."];
var leP=pose({},'S');
M.defineChar('lejla',{
  legend:L({H:P.h1,h:P.h2,j:P.h3,r:P.r3,y:P.y4,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(leS),F:HS(leF),B:{n:leB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.s5,P.s6,P.s4],open:P.k2,side:7}, torsoS:{hood:P.s4},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s6},
  // Kapuze auf dem Rücken
  post:function(b,p,X,Y,hx,hy){ if (p.v!=='B') return; var t=Y+hy-11; b.hl(X+hx-3,X+hx+2,t,P.s4); b.hl(X+hx-3,X+hx+2,t+1,P.s5); b.hl(X+hx-2,X+hx+1,t+2,P.s4); b.hl(X+hx-1,X+hx,t+3,P.s3); },
  anims:{
    // schaut aufs Handy, der Daumen tippt
    phone:[[leP({nh:[5,-27],fh:[4,-26],it:'phoneA',ho:[1,1]}),900],[leP({nh:[5,-27],fh:[4,-26],it:'phoneB',ho:[1,1]}),160],[leP({nh:[5,-27],fh:[4,-26],it:'phoneA',ho:[1,1]}),140],[leP({nh:[5,-27],fh:[4,-26],it:'phoneB',ho:[1,1]}),160],
      [leP({nh:[5,-27],fh:[4,-26],it:'phoneA',ho:[1,1]}),1300],[leP({nh:[5,-27],fh:[4,-26],it:'phoneA',ho:[1,1],hd:'b'}),110],[leP({nh:[5,-27],fh:[4,-26],it:'phoneB',ho:[1,1]}),160],[leP({nh:[5,-27],fh:[4,-26],it:'phoneA',ho:[1,1]}),160],
      [leP({nh:[5,-27],fh:[4,-26],it:'phoneB',ho:[1,1]}),160],[leP({nh:[5,-27],fh:[4,-26],it:'phoneA',ho:[1,1]}),800]],
    // wischt einen Tisch
    wipe:[[leP({ln:2,nh:[8,-21],fh:[7,-21],it:'rag',ho:[1,1]}),240],[leP({ln:2,nh:[11,-21],fh:[7,-21],it:'rag',ho:[1,1]}),240],[leP({ln:2,nh:[9,-20],fh:[7,-21],it:'rag',ho:[1,1]}),240],[leP({ln:2,nh:[6,-21],fh:[7,-21],it:'rag',ho:[1,1],hd:'b'}),240],
      [leP({ln:2,nh:[9,-21],fh:[7,-21],it:'rag',ho:[1,1]}),240],[leP({ln:2,nh:[11,-20],fh:[7,-21],it:'rag',ho:[1,1]}),240],[leP({ln:1,nh:[7,-21],fh:[6,-21],it:'rag'}),600]] }
});

// ---------------------------------------------------------------- ŠAĆIR MEHMEDOVIĆ (81), ehemaliger Kellner: klein, gebeugt, Glatze mit weißem Kranz, weißer Schnurrbart, große Ohren, braunes Sakko, Weste, Stock
var saS2=[
"............",
"............",
"....kkkkk...",
"...kSSSSSkk.",
"..kSSSSSSSSk",
".kwwSSSSSSSk",
".kwwttSSSeSk",
".kwtssSSSSSSk",
"..kwttSSSSSk.",
"..ktSSSwwwwk.",
"...ktSSSmk...",
"....kkkkk....",
"....ktsk....",
"....ktsk...."];
var saF2=[
"...........",
"...........",
"...kkkkk...",
"..kSSSSSk..",
".kSSSSSSSk.",
".kwSSSSSwk.",
"ksweSSSewsk",
"kswSSStSwsk",
".kwSSSSSwk.",
".ktwwwwwtk.",
"..ktmmStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var saB2=[
"...........",
"...........",
"...kkkkk...",
"..kSSSSSk..",
".kSSSSSSSk.",
".kwwwwwwwk.",
"kswwwwwwwsk",
"kswwwwwwwsk",
".kwwwwwwwk.",
".kswwwwwsk.",
"..ksssssk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var saP2=sitter(21,{ln:1});
M.defineChar('sacir',{
  legend:L({w:P.s6,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(saS2),F:HS(saF2),B:{n:saB2}}, neck:{S:[5,11],F:[5,12],B:[5,12]},
  torso:{w:11,len:12,col:[P.w2,P.w3,P.w1],open:P.m2,vneck:P.s5,side:8,hunch:1},
  bones:[10,9,7,6], hipY:21, shoulder:5,
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.w2,P.w3,P.w1],sleeveF:[P.w1,P.w2,P.w0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Gehstock in der rechten Hand (seitlich die nahe Hand), nicht im Sitzen
  post:function(b,p,X,Y,hx,hy){ if (p.sit) return; var h=p.v==='S'?p.nh:(p.v==='F'?p.lh:p.rh); if (!h) return; var x=X+h[0]+(p.v==='S'?1:0), y=Y+h[1]+1, gx=x+(p.v==='S'?1:0);
    b.line(x,y,gx,Y,P.w1); b.px(x,y-1,P.w2); if (p.v==='S') b.px(x+1,y-1,P.w2); },
  anims:{
    sit:[[saP2({nh:[8,-17],fh:[6,-17]}),1600],[saP2({nh:[8,-17],fh:[6,-17],hd:'b'}),110],[saP2({nh:[8,-17],fh:[6,-17],ho:[1,0]}),1400],[saP2({nh:[8,-17],fh:[6,-17]}),900]],
    sitTalk:[[saP2({nh:[8,-17],fh:[6,-17],hd:'o'}),150],[saP2({nh:[10,-22],fh:[6,-17]}),140],[saP2({nh:[10,-22],fh:[6,-17],hd:'o'}),150],[saP2({nh:[8,-17],fh:[6,-17]}),160]],
    // legt einen Dominostein an (Tisch etwa 21 px über dem Boden)
    domino:[[saP2({nh:[9,-20],fh:[7,-20]}),900],[saP2({nh:[8,-22],fh:[7,-20],it:'domino'}),260],[saP2({nh:[11,-22],fh:[7,-20],it:'domino',ln:2}),220],[saP2({nh:[12,-20],fh:[7,-20],it:'domino',ln:2}),160],
      [saP2({nh:[12,-20],fh:[7,-20],ln:2}),300],[saP2({nh:[9,-20],fh:[7,-20]}),700],[saP2({nh:[9,-20],fh:[7,-20],hd:'b'}),110],[saP2({nh:[9,-20],fh:[7,-20],ho:[1,0]}),1300]] }
});

// ---------------------------------------------------------------- NEDŽAD KAZANDŽIĆ (41), Kupferschmied: breite Schultern, kurzer dunkler Bart, Lederschürze, kariertes Hemd, Ärmel hochgekrempelt
var neS=[
"............",
"....kkkkk...",
"...kHHhHHkk.",
"..kHHHHHHHHk",
".kHHHHHHHSSk",
".kHHHHHSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..kbSSSSSSSk",
"..kbbbSSbmk.",
"..kbbbbbbbk.",
"...kbbbbbk..",
"....kttk....",
"....ktsk...."];
var neF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHHhHHHHk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kbSSSStSSbk",
"kbbSbbbSbbk",
".kbbbmbbbk.",
".kbbbbbbbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var neB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ksHHHHHHHsk",
".kHHHHHHHk.",
".kbHHHHHbk.",
"..kbsssbk..",
"...kbbbk...",
"...ktttk...",
"...kssk...."];
var neP=sitter(23,{ln:1});
M.defineChar('nedzad',{
  legend:L({H:P.h1,h:P.h2,b:P.h2,S:P.q4,s:P.q3,t:P.q2,m:P.q1}),
  heads:{S:HS(neS),F:HS(neF),B:{n:neB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:13,col:[P.r2,P.r3,P.r1],stripe:P.r0,apron:[P.w2,P.w3],side:9},
  coat:{c:[P.w2,P.w3,P.w1],hem:10,w:6},
  shoulder:6, armR:[1.4,1.3],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.r2,P.r3,P.r1],sleeveF:[P.r1,P.r2,P.r0],arm:[P.q4,P.p4,P.q3],armF:[P.q3,P.q4,P.q2],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.w1},
  // ein Funke Kupfer beim Schlag
  // Werkstück (Kupferschale auf dem Amboss) beim Hämmern, ein Funke beim Schlag
  post:function(b,p,X,Y){ if (p.it==='hammer'||p.it==='hammerUp'){ b.hl(X+14,X+18,Y-18,P.t4); b.hl(X+15,X+17,Y-17,P.t2); b.px(X+15,Y-18,P.y4); }
    if (p.gl && p.nh){ b.px(X+p.nh[0]+6,Y+p.nh[1]+1,P.y5); b.px(X+p.nh[0]+7,Y+p.nh[1],P.y4); b.px(X+p.nh[0]+3,Y+p.nh[1]+1,P.y4); } },
  anims:{
    sit:[[neP({nh:[8,-16],fh:[6,-16]}),1600],[neP({nh:[8,-16],fh:[6,-16],hd:'b'}),110],[neP({nh:[8,-16],fh:[6,-16],ho:[1,0]}),1100]],
    sitTalk:[[neP({nh:[8,-16],fh:[6,-16],hd:'o'}),150],[neP({nh:[9,-19],fh:[6,-16]}),150],[neP({nh:[9,-19],fh:[6,-16],hd:'o'}),150],[neP({nh:[8,-16],fh:[6,-16]}),160]],
    // hämmert im Sitzen mit dem kleinen Hammer
    hammer:[[neP({ln:1,nh:[11,-24],fh:[13,-18],ho:[1,1],it:'hammerUp'}),200],[neP({ln:1,nh:[11,-20],fh:[13,-18],ho:[1,1],it:'hammer',gl:1}),80],[neP({ln:1,nh:[11,-21],fh:[13,-18],ho:[1,1],it:'hammer'}),90],
      [neP({ln:1,nh:[11,-24],fh:[13,-18],ho:[1,1],it:'hammerUp'}),200],[neP({ln:1,nh:[11,-20],fh:[13,-18],ho:[1,1],it:'hammer',gl:1}),80],[neP({ln:1,nh:[11,-21],fh:[13,-18],ho:[1,1],it:'hammer'}),90],
      [neP({ln:1,nh:[11,-24],fh:[13,-18],ho:[1,1],it:'hammerUp'}),200],[neP({ln:1,nh:[11,-20],fh:[13,-18],ho:[1,1],it:'hammer',gl:1}),80],[neP({ln:1,nh:[11,-21],fh:[13,-18],ho:[1,1],it:'hammer',hd:'b'}),500],[neP({ln:1,nh:[10,-20],fh:[13,-18],it:'hammer'}),700]],
    // graviert, tief über das Werkstück gebeugt
    engrave:[[neP({ln:3,nh:[10,-19],fh:[9,-18],ho:[1,1],it:'graver'}),400],[neP({ln:3,nh:[11,-19],fh:[9,-18],ho:[1,1],it:'graver'}),300],[neP({ln:3,nh:[10,-20],fh:[9,-18],ho:[1,1],it:'graver',hd:'b'}),200],
      [neP({ln:3,nh:[11,-19],fh:[9,-18],ho:[1,1],it:'graver'}),500],[neP({ln:3,nh:[10,-19],fh:[9,-18],ho:[1,1],it:'graver'}),600]] }
});

// ---------------------------------------------------------------- JAKOB KABILJO (71), Antiquar: weißer Haarkranz, kurzer weißer Bart, dicke Brille, graue Strickjacke mit Ellbogenflicken, Fliege, Lupe an der Schnur
var jaS=[
"............",
"............",
"....kkkk....",
"...kSSSSkk..",
"..kSSSSSSSk.",
".kwwSSSSSSk.",
".kwtSgggegk.",
".kwtSSSSSgSk",
"..kwSSSSSSk.",
"..kwwSwwmk..",
"...kwwwwk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var jaF=[
"...........",
"...........",
"...kkkkk...",
"..kSSSSSk..",
".kSSSSSSSk.",
"kwSSSSSSSwk",
"kwgegSgegwk",
"kwgGgtgGgwk",
".kwSSSSSwk.",
".kwwwmwwwk.",
"..kwwwwwk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var jaB=[
"...........",
"...........",
"...kkkkk...",
"..kSSSSSk..",
".kSSSSSSSk.",
"kwwSSSSSwwk",
"kwwwwwwwwwk",
"kgwwwwwwwgk",
".kwwwwwwwk.",
".kwwwwwwwk.",
"..kwwwwwk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var jaP=pose({},'F');
M.defineChar('jakob',{
  legend:L({w:P.s6,g:P.k2,G:P.b4,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(jaS),F:HS(jaF),B:{n:jaB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:[P.m3,P.m4,P.m2],buttons:P.m1,vneck:P.s6,side:7},
  cols:{trou:[P.w1,P.w2,P.w0],trouF:[P.w0,P.w1,P.k1],sleeve:[P.m3,P.m4,P.m2],sleeveF:[P.m2,P.m3,P.m1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  // Fliege, Ellbogenflicken, Lupe an der Schnur vor der Brust
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.jakob, g=geo(ch,p,hx,hy), top=Y+g.top;
    if (p.v==='F'){ b.px(X+hx-2,top+1,P.r2); b.px(X+hx-1,top+1,P.r1); b.px(X+hx,top+1,P.r2);
      if (p.fi && FH[p.fi]) FH[p.fi](b,p,X,Y,hx,hy); else { b.px(X+hx+1,top+5,P.m4); b.px(X+hx+2,top+6,P.m4); b.px(X+hx+1,top+6,P.b5); b.px(X+hx,top+4,P.k2); } }
    else if (p.v==='S'){ b.px(X+Math.round(g.eN[0]),Y+Math.round(g.eN[1]),P.w2); b.px(X+Math.round(g.eN[0])-1,Y+Math.round(g.eN[1]),P.w2); }
    else { b.px(X+Math.round(g.eL[0]),Y+Math.round(g.eL[1]),P.w2); b.px(X+Math.round(g.eR[0]),Y+Math.round(g.eR[1]),P.w2); } },
  anims:{
    // liest mit der Lupe, das Blatt in der anderen Hand
    read:[[jaP({fi:'loupe',lh:[-4,-27],rh:[-1,-26],ho:[0,1]}),1600],[jaP({fi:'loupe',lh:[-4,-27],rh:[0,-26],ho:[0,1]}),900],[jaP({fi:'loupe',lh:[-4,-27],rh:[0,-26],ho:[0,1],hd:'b'}),110],
      [jaP({fi:'loupe',lh:[-4,-27],rh:[-1,-27],ho:[0,1]}),1300],[jaP({fi:'loupe',lh:[-4,-27],rh:[1,-26],ho:[1,1]}),800],[jaP({fi:'loupe',lh:[-4,-27],rh:[1,-26]}),700]] }
});

// ---------------------------------------------------------------- AMRA BEGOVIĆ (31), Restauratorin: weißer Bauhelm über dunklen Locken, Brille, rote Funktionsjacke, Jeans, Arbeitsschuhe, Mappe
var amS=[
"............",
"....kkkkk...",
"...kccCCCk..",
"..kccccccCk.",
".kdddddddddk",
"kHhHHHSSSSk.",
"khHhHsSgegk.",
"kHhHHSSSSSSk",
"khHhHsSSSSk.",
"kHhHksSSmk..",
"khHhk.ksSk..",
".kHk..kkk...",
".kHk.kttk...",
"..kk.ktsk..."];
var amF=[
"...kkkkk...",
"..kcCCCck..",
".kcccCCcck.",
"kdddddddddk",
"kHhSSSSShHk",
"kHSSSSSSSHk",
"kHgegSgegHk",
"khSSSStSShk",
"kHhSSSSShHk",
"kHtSSmSStHk",
"kHhtSSStHhk",
".kHkkkkkHk.",
"...ktttk...",
"...kssk...."];
var amB=[
"...kkkkk...",
"..kcCCCck..",
".kcccCCcck.",
"kdddddddddk",
"kHhHhHhHhHk",
"khHhHhHhHhk",
"kHhHhHhHhHk",
"khHhHhHhHhk",
"kHhHhHhHhHk",
".kHhHhHhHk.",
".khHhHhHhk.",
"..kHhHhHk..",
"...kHhHk...",
"...kssk...."];
var amP=pose({},'F');
// Mappe unter dem Arm (Seite: unter dem nahen Arm; vorn: unter dem rechten Bildarm; hinten: unter dem linken)
function folderUnder(b,ch,p,X,Y,hx,hy){ var g=geo(ch,p,hx,hy), t=Y+g.top;
  if (p.v==='S'){ var x0=X+hx-3+g.shx; b.rect(x0,t+4,6,5,P.m2); b.hl(x0,x0+5,t+4,P.s5); b.hl(x0,x0+5,t+8,P.m1); b.vl(x0+5,t+5,t+8,P.m1); armS(b,ch,p,X,Y,hx,hy); }
  else if (p.v==='F'){ var x1=X+g.sR[0]; b.rect(x1,t+4,2,6,P.m2); b.vl(x1,t+4,t+9,P.s5); armF(b,ch,p,X,Y,hx,hy,1); }
  else { var x2=X+g.sL[0]-1; b.rect(x2,t+4,2,6,P.m1); armF(b,ch,p,X,Y,hx,hy,-1); } }
M.defineChar('amra',{
  legend:L({c:P.s5,C:P.l1,d:P.s4,H:P.h2,h:P.w2,g:P.m2,S:P.p4,s:P.p3,t:P.p2,m:P.r3}),
  heads:{S:HS(amS),F:HS(amF),B:{n:amB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.r3,P.r4,P.r2],open:P.r3,collar:[P.r2,P.r2],side:7},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.r3,P.r4,P.r2],sleeveF:[P.r2,P.r3,P.r1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w2},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.amra; if (p.v==='F' && p.fi && FH[p.fi]){ FH[p.fi](b,p,X,Y,hx,hy); handsF(b,ch,p,X,Y); return; } if (!p.nb && !p.it && !p.sit) folderUnder(b,ch,p,X,Y,hx,hy); },
  anims:{
    // blättert begeistert in ihrer Mappe
    folder:[[amP({fi:'folder',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),1200],[amP({fi:'folderTurn',lh:[-5,-27],rh:[3,-29],ho:[0,1]}),200],[amP({fi:'folder',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),900],[amP({fi:'folder',lh:[-5,-27],rh:[5,-27],ho:[0,1],hd:'b'}),110],
      [amP({fi:'folder',lh:[-5,-27],rh:[5,-27],hd:'o'}),200],[amP({fi:'folder',lh:[-5,-27],rh:[5,-27]}),160],[amP({fi:'folder',lh:[-5,-27],rh:[5,-27],hd:'o'}),200],[amP({fi:'folder',lh:[-5,-27],rh:[5,-27],ho:[0,1]}),1000]] }
});

// ---------------------------------------------------------------- ILIJA PERIŠIĆ (62), Nachtwächter: massig, Schirmmütze, buschige Brauen, Stoppeln, dunkelgrüne Wachjacke „ZAŠTITA“, Thermoskanne
var ilS=[
"............",
"...kkkkkk...",
"..kCCcCCCk..",
".kCCCCCCCCk.",
".kCCCCCCCCvvk",
".kjjtSSBBBSk",
".kjjtSSSSeSk",
".kjtSSSSSSSSk",
".ktbSSSSSSSk.",
".kbbbSSSSmSk.",
"..kbbbSSSSk..",
"...kbbbbbk...",
"....kttk....",
"....ktsk...."];
var ilF=[
"...........",
"..kkkkkkk..",
".kCCCcCCCk.",
"kCCCCCCCCCk",
"kvvvvvvvvvk",
"kjBBSSSBBjk",
"kjSeSSSeSjk",
"ktSSSStSStk",
"kbSSSSSSSbk",
"kbbSSmSSbbk",
".kbbbbbbbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var ilB=[
"...........",
"..kkkkkkk..",
".kCCCcCCCk.",
"kCCCCCCCCCk",
"kCCCCCCCCCk",
"kjjjjjjjjjk",
"kjjjjjjjjjk",
"ktjjjjjjjtk",
"kbjjjjjjjbk",
".kbjjjjjbk.",
"..ksssssk..",
"...ktttk...",
"...ktttk...",
"...kssk...."];
var ilP=pose({},'S');
M.defineChar('ilija',{
  legend:L({C:P.m0,c:P.m1,v:P.k2,j:P.m3,B:P.m4,b:P.s2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(ilS),F:HS(ilF),B:{n:ilB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:14,col:[P.g2,P.g3,P.g1],open:P.g2,collar:[P.g1,P.g1],side:9,belly:1},
  coat:{c:[P.g2,P.g3,P.g1],hem:5,w:7},
  shoulder:6, armR:[1.5,1.2],
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.g2,P.g3,P.g1],sleeveF:[P.g1,P.g2,P.g0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Aufnäher „ZAŠTITA“: vorn auf der Brust, seitlich am Oberarm
  post:function(b,p,X,Y,hx,hy){ var g=geo(M.CHARS.ilija,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.hl(X+hx+2,X+hx+4,t+3,P.y3); b.hl(X+hx+2,X+hx+4,t+4,P.k2); }
    else if (p.v==='S'){ var ax=X+Math.round((g.shN[0]*2+g.eN[0])/3), ay=Y+Math.round((g.shN[1]*2+g.eN[1])/3)+1; b.px(ax,ay,P.y3); b.px(ax,ay+1,P.y3); } },
  anims:{
    // schenkt sich aus der Thermoskanne ein und trinkt
    thermos:[[ilP({nh:[5,-26],fh:[1,-23],it:'thermos'}),600],[ilP({nh:[5,-26],fh:[11,-35],it:'thermosPour',ho:[1,1]}),1100],[ilP({nh:[5,-26],fh:[11,-35],it:'thermosPour',ho:[1,1],hd:'b'}),110],
      [ilP({nh:[5,-27],fh:[1,-23],it:'tcup'}),400],[ilP({nh:[4,-39],fh:[1,-23],it:'tcup',ln:-1,hd:'b'}),900],[ilP({nh:[5,-29],fh:[1,-23],it:'tcup'}),1200],[ilP({nh:[5,-29],fh:[1,-23],it:'tcup',hd:'b'}),110],
      [ilP({nh:[4,-39],fh:[1,-23],it:'tcup',ln:-1,hd:'b'}),700],[ilP({nh:[5,-29],fh:[1,-23],it:'tcup'}),900]] }
});

// ---------------------------------------------------------------- MILKA ĐURIĆ (85), Nachbarin an der Obala: zierlich, schwarzes Tuch, dünnes weißes Haar, Brille, langer brauner Mantel, Tüte mit Brot
var mkS2=[
"............",
"............",
"....kkkk....",
"...kcCcck...",
"..kccccccck.",
".kcccccwwSk.",
".kccctSgegk.",
".kcctSSSSSSk",
"kccctSSSSSk.",
"kCcCktSSmk..",
".kk.ktSSk...",
".....kkk....",
"....ktsk....",
"....ktsk...."];
var mkF2=[
"...........",
"...........",
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kccwwwwwcck",
"kcgegSgegck",
"kctSSStSSck",
".kcSSSSSck.",
".kctSmStck.",
"..kcSSSck..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var mkB2=[
"...........",
"...........",
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kccccCcccck",
"kccccccccck",
"kccccccccck",
".kccccccck.",
".kcckCkcck.",
"..kCcCcCk..",
"...kCkCk...",
"...ktttk...",
"...kssk...."];
var miP=sitter(20,{ln:1});
// Plastiktüte mit Brot auf dem Schoß (im Sitzen); die Hände liegen darauf
function breadBag(b,ch,p,X,Y,hx,hy){ if (p.v==='S'){ var x0=X+hx+2, y0=Y+hy-5; b.rect(x0,y0+1,6,4,P.s5); b.hl(x0+1,x0+4,y0,P.s5); b.px(x0+2,y0+2,P.s4); b.px(x0+4,y0+3,P.s4); b.hl(x0,x0+5,y0+4,P.s4); b.px(x0+2,y0-1,P.w4); b.px(x0+3,y0-1,P.y3); b.px(x0+3,y0,P.w4);
    if (!p.it && !p.cr) armS(b,ch,p,X,Y,hx,hy); }
  else if (p.v==='F'){ var x1=X+hx-3, y1=Y+hy-4; b.rect(x1,y1,7,4,P.s5); b.hl(x1,x1+6,y1+3,P.s4); b.px(x1+2,y1-1,P.w4); b.px(x1+3,y1-1,P.y3); handsF(b,ch,p,X,Y); } }
M.defineChar('milka',{
  legend:L({c:P.k2,C:P.m1,w:P.s6,g:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(mkS2),F:HS(mkF2),B:{n:mkB2}}, neck:{S:[6,12],F:[5,12],B:[5,12]},
  torso:{w:11,len:11,col:[P.w2,P.w3,P.w1],buttons:P.w0,side:7,hunch:1},
  skirt:{c:[P.w2,P.w3,P.w1],hem:15,flare:2},
  bones:[9,8,6,6], hipY:20, shoulder:4,
  cols:{trou:[P.m0,P.m1,P.k1],trouF:[P.k1,P.m0,P.k0],sleeve:[P.w2,P.w3,P.w1],sleeveF:[P.w1,P.w2,P.w0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.milka; if (p.sit) breadBag(b,ch,p,X,Y,hx,hy);
    // Krümel fliegen vor ihr zu Boden (zu den Tauben)
    if (p.cr===1){ b.px(X+p.nh[0]+3,Y+p.nh[1],P.s5); b.px(X+p.nh[0]+4,Y+p.nh[1]+2,P.w4); b.px(X+p.nh[0]+2,Y+p.nh[1]+2,P.s5); }
    if (p.cr===2){ b.px(X+14,Y-13,P.s5); b.px(X+16,Y-10,P.w4); b.px(X+13,Y-10,P.s5); b.px(X+17,Y-14,P.s4); }
    if (p.cr===3){ b.px(X+15,Y-5,P.s5); b.px(X+18,Y-2,P.w4); b.px(X+14,Y-2,P.s5); b.px(X+17,Y-6,P.s4); } },
  anims:{
    sit:[[miP({nh:[5,-15],fh:[4,-15]}),1700],[miP({nh:[5,-15],fh:[4,-15],hd:'b'}),110],[miP({nh:[5,-15],fh:[4,-15],ho:[1,0]}),1300],[miP({nh:[5,-15],fh:[4,-15]}),900]],
    sitTalk:[[miP({nh:[5,-15],fh:[4,-15],hd:'o'}),150],[miP({nh:[5,-15],fh:[4,-15]}),150],[miP({nh:[7,-19],fh:[4,-15],hd:'o'}),150],[miP({nh:[7,-19],fh:[4,-15]}),160]],
    // greift in die Tüte und wirft den Tauben Krümel hin
    feed:[[miP({nh:[5,-15],fh:[4,-15]}),700],[miP({nh:[5,-16],fh:[4,-15],cr:0}),300],[miP({nh:[8,-19],fh:[4,-15]}),200],[miP({nh:[11,-18],fh:[4,-15],cr:1}),160],[miP({nh:[10,-17],fh:[4,-15],cr:2}),260],
      [miP({nh:[7,-16],fh:[4,-15],cr:3}),500],[miP({nh:[5,-15],fh:[4,-15],hd:'b'}),110],[miP({nh:[5,-15],fh:[4,-15],ho:[1,1]}),1300]] }
});

// ---------------------------------------------------------------- DRAGICA LUKIĆ (79), Haus 7: rundes Gesicht, weiße Dauerwelle, große Brille, rosa Morgenmantel über Strickjacke, Häkeldecke
var drS=[
"............",
"...kkkkkk...",
"..kwjwjwjk..",
".kjwjwjwjwk.",
".kwjwjwjwSSk",
".kjwjwjSSSSk",
".kwjwtSggegk",
".kjwtSSSSSgSk",
"..kwtSSSSSSk.",
"..ktSSSSSmk..",
"...ktSSSSk...",
"....kkkkk....",
"....ktsk....",
"....ktsk...."];
var drF=[
"..kkkkkkk..",
".kwjwjwjwk.",
"kjwjwjwjwjk",
"kwjwjwjwjwk",
"kjwSSSSSwjk",
"kwSSSSSSSwk",
"kwgegSgegwk",
"kSgSgtgSgSk",
"kSSSSSSSSSk",
".kSSSmSSSk.",
".ktSSSSStk.",
"..ktttttk..",
"...ktttk...",
"...kssk...."];
var drB=[
"..kkkkkkk..",
".kwjwjwjwk.",
"kjwjwjwjwjk",
"kwjwjwjwjwk",
"kjwjwjwjwjk",
"kwjwjwjwjwk",
"kjwjwjwjwjk",
"kgwjwjwjwgk",
".kwjwjwjwk.",
".ktttttttk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var drP=sitter(21,{ln:1});
// Häkeldecke über den Knien (bunte Quadrate)
function blanket(b,p,X,Y,hx,hy){ var Q=[P.r3,P.y3,P.g4,P.b3,P.d4,P.s5];
  var fill=function(x,y){ var q=((x>>1)+(y>>1)*3)&3, c=Q[(((x>>1)*5+(y>>1)*3)>>0)%6]; return ((x+y)&1)&&q===0?P.s6:c; };
  if (p.v==='S') b.poly([[X+hx-1,Y+hy-2],[X+hx+9,Y+hy-2],[X+hx+11,Y+hy+6],[X+hx+2,Y+hy+4]],fill);
  else if (p.v==='F') b.poly([[X+hx-6,Y+hy-2],[X+hx+6,Y+hy-2],[X+hx+7,Y+hy+6],[X+hx-7,Y+hy+6]],fill); }
M.defineChar('dragica',{
  legend:L({w:P.s6,j:P.s4,g:P.t2,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(drS),F:HS(drF),B:{n:drB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.d4,P.d5,P.d3],vneck:P.s4,belt:P.d3,side:8,belly:1},
  skirt:{c:[P.d4,P.d5,P.d3],hem:16,flare:2},
  bones:[10,9,7,6], hipY:21, shoulder:5,
  cols:{trou:[P.p3,P.p4,P.p2],trouF:[P.p2,P.p3,P.p1],sleeve:[P.d4,P.d5,P.d3],sleeveF:[P.d3,P.d4,P.d2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.d2},
  post:function(b,p,X,Y,hx,hy){ if (!p.sit) return; blanket(b,p,X,Y,hx,hy); if (p.v==='S'){ if (p.it && H[p.it]){ armS(b,M.CHARS.dragica,p,X,Y,hx,hy); H[p.it](b,X+p.nh[0],Y+p.nh[1]); } else armS(b,M.CHARS.dragica,p,X,Y,hx,hy); } },
  anims:{
    sit:[[drP({nh:[7,-17],fh:[5,-17]}),1600],[drP({nh:[7,-17],fh:[5,-17],hd:'b'}),110],[drP({nh:[7,-17],fh:[5,-17],ho:[1,0]}),1400]],
    sitTalk:[[drP({nh:[7,-17],fh:[5,-17],hd:'o'}),150],[drP({nh:[9,-22],fh:[5,-17]}),150],[drP({nh:[9,-22],fh:[5,-17],hd:'o'}),150],[drP({nh:[7,-17],fh:[5,-17]}),160]],
    // häkelt im Sessel
    knit:[[drP({nh:[8,-19],fh:[6,-18],it:'crochet'}),300],[drP({nh:[9,-20],fh:[6,-18],it:'crochet'}),260],[drP({nh:[8,-19],fh:[6,-19],it:'crochet'}),300],[drP({nh:[9,-19],fh:[6,-18],it:'crochet',hd:'b'}),220],
      [drP({nh:[8,-20],fh:[6,-18],it:'crochet'}),300],[drP({nh:[8,-19],fh:[6,-18],it:'crochet',ho:[1,0]}),900]] }
});

// ---------------------------------------------------------------- NADA DELIĆ (61), Lanas Mutter: schmal, müde, graues kinnlanges Haar, Schatten unter den Augen, dunkelgrauer Pullover, Arme verschränkt
var naS=[
"............",
"....kkkkk...",
"...khhjhhk..",
"..khhhhhhhhk",
".khHhhhhhhhk",
".khHhhhhSSSk",
".khHhhtSSeSk",
".khHhhSSSuSSk",
".khHhhtSSSSk.",
".khHhktSSmk..",
"..kkk.ktSk...",
"......kk.....",
".....ktsk....",
".....ktsk...."];
var naF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhhhjhhk",
"khhSSSSShhk",
"khSSSSSSShk",
"khSeSSSeShk",
"khSuSSSuShk",
"khSSSStSShk",
"khkSmmSSkhk",
"khktSSStkhk",
".kk.kkk.kk.",
"...ktttk...",
"...kssk...."];
var naB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kHHHHHHHHHk",
".kkktttkkk.",
"...ktttk...",
"...kssk...."];
var naP=sitter(22,{ln:1}), naPs=pose({},'S');
M.defineChar('nada',{
  legend:L({h:P.m3,H:P.m2,j:P.m4,u:P.p1,S:P.p4,s:P.p3,t:P.p2,m:P.p2}),
  heads:{S:HS(naS),F:HS(naF),B:{n:naB}}, neck:{S:[7,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.m1,P.m2,P.m0],side:7},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.m1,P.m2,P.m0],sleeveF:[P.m0,P.m1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  anims:{
    // sitzt am Tisch, die Arme verschränkt
    sit:[[naP({nh:[4,-19],fh:[4,-18]}),1800],[naP({nh:[4,-19],fh:[4,-18],hd:'b'}),110],[naP({nh:[4,-19],fh:[4,-18],ho:[1,0]}),1500],[naP({nh:[4,-19],fh:[4,-18],hd:'s'}),900]],
    sitTalk:[[naP({nh:[4,-19],fh:[4,-18],hd:'o'}),150],[naP({nh:[4,-19],fh:[4,-18]}),150],[naP({nh:[4,-19],fh:[4,-18],hd:'o'}),150],[naP({nh:[4,-19],fh:[4,-18]}),300]],
    // raucht im Sitzen, der andere Arm stützt den Ellbogen
    smoke:[[naP({nh:[5,-20],fh:[4,-18],it:'cig'}),1000],[naP({nh:[5,-24],fh:[4,-18],it:'cig'}),140],[naP({nh:[4,-27],fh:[4,-18],it:'cig',hd:'b'}),700],[naP({nh:[5,-24],fh:[4,-18],it:'cig',ho:[0,-1]}),600],
      [naP({nh:[6,-20],fh:[4,-18],it:'cig'}),1400],[naP({nh:[6,-20],fh:[4,-18],it:'cig',hd:'s'}),700]],
    // steht mit verschränkten Armen (Epilog)
    cross:[[naPs({nh:[4,-27],fh:[4,-26]}),1800],[naPs({nh:[4,-27],fh:[4,-26],hd:'b'}),110],[naPs({nh:[4,-27],fh:[4,-26],ho:[1,0]}),1400]] }
});

// ---------------------------------------------------------------- MIRZA HODŽIĆ (26), Hausmeister: graue Mütze, Dreitagebart, blaue Arbeitsjacke, linker Handschuh (zwei Finger eingeschlagen), Besen
var mzS=[
"............",
"....kkkkk...",
"...kccCcck..",
"..kcccccccck",
"..kCCCCCCCCk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..kbtSSSSmk.",
"..kbbtSSSk..",
"...kbbbbk...",
"....kttk....",
"....ktsk...."];
var mzF=[
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kCCCCCCCCCk",
"kHSSSSSSSHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kbSSSSSbk.",
".kbbSmSbbk.",
"..kbbbbbk..",
"...kbbbk...",
"...ktttk...",
"...kssk...."];
var mzB=[
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kCCCCCCCCCk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ksHHHHHHHsk",
".kHHHHHHHk.",
".kHHHHHHHk.",
"..kHHHHHk..",
"...kHHHk...",
"...ktttk...",
"...kssk...."];
var mzP=pose({},'S'), mzSit=sitter(23,{ln:2});
// Handschuh links: seitlich die nahe Hand, vorn die rechte Bildhand, hinten die linke; ein Pixel dunkler (die eingeschlagenen Finger)
function glove(b,p,X,Y){ var h=p.v==='S'?p.nh:(p.v==='F'?p.rh:p.lh); if (!h) return; var x=Math.round(X+h[0]-0.5), y=Math.round(Y+h[1]-0.5); b.px(x,y,P.m2); b.px(x+1,y,P.m1); b.px(x,y+1,P.m1); b.px(x+1,y+1,P.m0); }
M.defineChar('mirza',{
  legend:L({c:P.m2,C:P.m3,H:P.h1,b:P.p2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(mzS),F:HS(mzF),B:{n:mzB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:[P.b1,P.b2,P.b0],buttons:P.n2,collar:[P.b0,P.b0],side:8},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.b1,P.b2,P.b0],sleeveF:[P.b0,P.b1,P.n1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y){ glove(b,p,X,Y); },
  anims:{
    // fegt mit dem Reisigbesen
    sweep:[[mzP({ln:1,nh:[6,-21],fh:[3,-28],it:'besen',ho:[1,1]}),360],[mzP({ln:1,nh:[9,-20],fh:[6,-27],it:'besen',ho:[1,1]}),300],[mzP({ln:1,nh:[6,-21],fh:[3,-28],it:'besen',ho:[1,1],hd:'b'}),300],[mzP({ln:1,nh:[3,-22],fh:[0,-29],it:'besen',ho:[1,1]}),360],
      [mzP({ln:1,nh:[6,-21],fh:[3,-28],it:'besen',ho:[1,1]}),300],[mzP({ln:1,nh:[9,-20],fh:[6,-27],it:'besen',ho:[1,1]}),300],[mzP({ln:1,nh:[6,-21],fh:[3,-28],it:'besen',ho:[1,1]}),300],[mzP({ln:1,nh:[3,-22],fh:[0,-29],it:'besen',ho:[1,1]}),360]],
    // sitzt vorgebeugt, die Unterarme auf den Knien
    sit:[[mzSit({nh:[8,-15],fh:[7,-15]}),1800],[mzSit({nh:[8,-15],fh:[7,-15],hd:'b'}),110],[mzSit({nh:[8,-15],fh:[7,-15],ho:[0,1]}),1400]],
    sitTalk:[[mzSit({nh:[8,-15],fh:[7,-15],hd:'o'}),150],[mzSit({nh:[8,-15],fh:[7,-15]}),150]] }
});

// ---------------------------------------------------------------- SULEJMAN ŠEHIĆ (66), Hausrat: graues Haar mit Seitenscheitel, Brille, Schnurrbart, beige Strickjacke, Hemd und Krawatte, Schlüsselbund am Gürtel
var shS=[
"............",
"....kkkkk...",
"...khjhhhkk.",
"..khhhhhhhhk",
".khhhhhhhSSk",
".khhhhSSSSSk",
".khhtSgggegk",
".khtSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSbbbk.",
"...ktSSSmk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var shF=[
"...kkkkk...",
"..khjhhhk..",
".khjhhhhhk.",
"khhjhhhhhhk",
"khSSSSSShhk",
"khSSSSSSShk",
"khgegSgeghk",
"ktSSSStSStk",
".kSbbbbbSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var shB=[
"...kkkkk...",
"..khjhhhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kghhhhhhhgk",
"kshhhhhhhsk",
".khhhhhhhk.",
".kshhhhhsk.",
"..ksssssk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var shP=pose({},'S');
M.defineChar('sehic',{
  legend:L({h:P.m3,H:P.m2,j:P.m4,g:P.m1,b:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(shS),F:HS(shF),B:{n:shB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.s3,P.s4,P.s2],buttons:P.s1,vneck:P.b4,side:8},
  cols:{trou:[P.m2,P.m3,P.m1],trouF:[P.m1,P.m2,P.m0],sleeve:[P.s3,P.s4,P.s2],sleeveF:[P.s2,P.s3,P.s1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Krawatte; Schlüsselbund am Gürtel (wenn er ihn nicht in der Hand hat)
  post:function(b,p,X,Y,hx,hy){ var t=Y+hy-12;
    if (p.v==='F'){ b.px(X+hx-1,t,P.r1); b.vl(X+hx-1,t+1,t+3,P.r2); b.px(X+hx-1,t+4,P.r1); if (!p.it){ b.px(X+hx+5,Y+hy-1,P.m4); b.px(X+hx+5,Y+hy,P.y3); b.px(X+hx+4,Y+hy+1,P.m4); } }
    else if (p.v==='S' && !p.it){ b.px(X+hx+1,Y+hy-1,P.m4); b.px(X+hx+1,Y+hy,P.y3); b.px(X+hx+2,Y+hy+1,P.m4); }
    else if (p.v==='B'){ b.px(X+hx-5,Y+hy-1,P.m4); b.px(X+hx-5,Y+hy,P.y3); } },
  anims:{
    // klimpert mit dem Schlüsselbund, dann wieder die Hände auf dem Rücken
    keys:[[shP({nh:[4,-26],fh:[2,-24],it:'keysA'}),200],[shP({nh:[5,-27],fh:[2,-24],it:'keysB'}),120],[shP({nh:[4,-26],fh:[2,-24],it:'keysA'}),120],[shP({nh:[5,-27],fh:[2,-24],it:'keysB'}),120],
      [shP({nh:[4,-26],fh:[2,-24],it:'keysA'}),420],[shP({nh:[4,-26],fh:[2,-24],it:'keysA',hd:'b'}),110],[shP({nh:[5,-27],fh:[2,-24],it:'keysB'}),120],[shP({nh:[4,-26],fh:[2,-24],it:'keysA'}),140],
      [shP({nh:[-4,-22],fh:[-3,-22]}),1600],[shP({nh:[-4,-22],fh:[-3,-22],hd:'b'}),110],[shP({nh:[-4,-22],fh:[-3,-22],ho:[1,0]}),1200]],
    // steht da, die Hände auf dem Rücken
    handsBack:[[shP({nh:[-4,-22],fh:[-3,-22]}),1800],[shP({nh:[-4,-22],fh:[-3,-22],hd:'b'}),110],[shP({nh:[-4,-22],fh:[-3,-22],ho:[1,0]}),1400]] }
});

// ---------------------------------------------------------------- SELMA KARIĆ (27), junge Mutter: Mütze, schulterlanges braunes Haar, dicker grauer Parka, Jeans, Stiefel
var slS=[
"............",
"....kkkkk...",
"...kccCcck..",
"..kcccccccck",
"..kCCCCCCCCk",
".kHHHHhSSSSk",
".kHHHhSSSeSk",
".kHHHtSSSSSSk",
".kHHHtSSSSSk.",
".kHHHktSSmk..",
".kHHhkkSSk...",
"..kHHkkkk....",
"...kkktsk....",
"....ktsk...."];
var slF=[
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kCCCCCCCCCk",
"kHhSSSSShHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSSStSSHk",
"kHHSSSSSHHk",
"kHtSSmSStHk",
"kHHtSSStHHk",
".kHkkkkkHk.",
".kHktttkHk.",
"...kssk...."];
var slB=[
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kCCCCCCCCCk",
"kHHHHHHHHHk",
"kHHHHhHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHhHHHHk",
".kHHHHHHHk.",
"..kkkkkkk..",
"...kssk...."];
var slP=pose({},'S');
M.defineChar('selma',{
  legend:L({c:P.r2,C:P.r3,H:P.w1,h:P.w2,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(slS),F:HS(slF),B:{n:slB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.m2,P.m3,P.m1],open:P.m2,collar:[P.s4,P.s5],side:8}, torsoS:{hood:P.m1},
  coat:{c:[P.m2,P.m3,P.m1],hem:7,w:6},
  bones:[10,10,7,7], hipY:22, shoulder:5, armR:[1.5,1.2],
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  anims:{
    // schaukelt den Kinderwagen, beide Hände vorn am Griff
    rock:[[slP({nh:[9,-27],fh:[8,-27]}),650],[slP({nh:[11,-27],fh:[10,-27],ln:1,h:[1,-23]}),650],[slP({nh:[9,-27],fh:[8,-27]}),650],[slP({nh:[11,-27],fh:[10,-27],ln:1,h:[1,-23],hd:'b'}),650],
      [slP({nh:[9,-27],fh:[8,-27],hd:'s'}),650],[slP({nh:[11,-27],fh:[10,-27],ln:1,h:[1,-23]}),650]] }
});

// ---------------------------------------------------------------- DAMIR KOVAČ (34), Straßenbahnfahrer: kurz geschoren, Stoppelbart, kantiges Gesicht, dunkelblaue Fahrerjacke mit GRAS-Abzeichen, Zigarette
var dmS=[
"............",
"....kkkkk...",
"...kHhHhHk..",
"..kHHHHHHHk.",
".kHHHHHHHSSk",
".kHHHHHSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..kbtSSSSmk.",
"..kbbbSSSSk.",
"..kkkkkkkk..",
"....kttk....",
"....ktsk...."];
var dmF=[
"...kkkkk...",
"..kHhHhHk..",
".kHHHHHHHk.",
"kHHHHhHHHHk",
"kSHSSSSSHSk",
"kSSSSSSSSSk",
"kSSeSSSeSSk",
"ktSSSStSStk",
"kSSSSSSSSSk",
"ksbSSmSSbsk",
"ksbbSSSbbsk",
".kkkkkkkkk.",
"...ktttk...",
"...kssk...."];
var dmB=[
"...kkkkk...",
"..kHhHhHk..",
".kHHHHHHHk.",
"kHHHHHHHHHk",
"kHHhHHHHHHk",
"kHHHHHHhHHk",
"kSHHHHHHHSk",
"ksHHHHHHHsk",
"ksHHhHHHHsk",
"kssHHHHHssk",
"ksssssssssk",
".kkkkkkkkk.",
"...ktttk...",
"...kssk...."];
var dmP=pose({},'S');
M.defineChar('damir',{
  legend:L({H:P.h3,h:P.q1,b:P.q2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(dmS),F:HS(dmF),B:{n:dmB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.n1,P.n2,P.n0],open:P.n2,collar:[P.n0,P.n0],side:8},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.n1,P.n2,P.n0],sleeveF:[P.n0,P.n1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // GRAS-Abzeichen auf der Brust
  post:function(b,p,X,Y,hx,hy){ var g=geo(M.CHARS.damir,p,hx,hy); if (p.v==='F'){ b.px(X+hx+3,Y+g.top+3,P.y3); b.px(X+hx+4,Y+g.top+3,P.r3); }
    else if (p.v==='S'){ var ax=X+Math.round((g.shN[0]*2+g.eN[0])/3), ay=Y+Math.round((g.shN[1]*2+g.eN[1])/3)+1; b.px(ax,ay,P.y3); } },
  anims:{
    // raucht in der Pause: Zigarette meist unten in der Hand, ab und zu ein Zug
    smoke:[[dmP({nh:[3,-22],fh:[-1,-21],it:'cig'}),1400],[dmP({nh:[4,-30],fh:[-1,-21],it:'cig'}),140],[dmP({nh:[4,-36],fh:[-1,-21],it:'cig',hd:'b'}),700],[dmP({nh:[5,-31],fh:[-1,-21],it:'cig',ho:[0,-1]}),500],
      [dmP({nh:[3,-22],fh:[-1,-21],it:'cig'}),1600],[dmP({nh:[3,-22],fh:[-1,-21],it:'cig',hd:'b'}),110],[dmP({nh:[3,-22],fh:[-1,-21],it:'cig',ho:[1,0]}),900]] }
});

// ---------------------------------------------------------------- FADILA (50), Paketschalter: kurzes braunes Haar, Lesebrille an der Kette, blaue Dienstbluse, Strickweste
var faS=[
"............",
"....kkkkk...",
"...khhjhhk..",
"..khhhhhhhhk",
".kHhhhhhhSSk",
".kHHhhhSSSSk",
".kHHhtSSSeSk",
".kHHtSSSSSSSk",
"..kHtSSSSSSk",
"..kktSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var faF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhjhhhhhhk",
"khhhSSSSShk",
"khSSSSSSShk",
"khSeSSSeShk",
"khSSSStSShk",
"khkSSSSSkhk",
".kktSmStkk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var faB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kHhhhhhhhHk",
"kHHhhhhhHHk",
".kHHhhhHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var faP=pose({},'F');
M.defineChar('fadila',{
  legend:L({H:P.w1,h:P.w2,j:P.w3,S:P.p4,s:P.p3,t:P.p2,m:P.r2}),
  heads:{S:HS(faS),F:HS(faF),B:{n:faB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.c1,P.c2,P.c0],vneck:P.b4,buttons:P.c3,side:8},
  bones:[10,10,7,7], hipY:22, shoulder:5,
  cols:{trou:[P.c0,P.c1,P.k1],trouF:[P.k1,P.c0,P.k0],sleeve:[P.b2,P.b3,P.b1],sleeveF:[P.b1,P.b2,P.b0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Lesebrille an der Kette auf der Brust; Stempel in der Hand
  post:function(b,p,X,Y,hx,hy){ var t=Y+hy-11;
    if (p.v==='F'){ b.px(X+hx-3,t,P.y3); b.px(X+hx-3,t+1,P.y3); b.px(X+hx+2,t,P.y3); b.px(X+hx+2,t+1,P.y3); b.hl(X+hx-3,X+hx-2,t+2,P.m1); b.hl(X+hx+1,X+hx+2,t+2,P.m1); b.hl(X+hx-1,X+hx,t+2,P.y3);
      if (p.fi && FH[p.fi]) FH[p.fi](b,p,X,Y,hx,hy); }
    else if (p.v==='S'){ b.px(X+hx+2,t+2,P.y3); b.px(X+hx+3,t+3,P.m1); } },
  anims:{
    // stempelt: die Hand hebt sich und saust nieder
    stamp:[[faP({lh:[-3,-28],rh:[6,-28],fi:'stamp',ho:[0,1]}),300],[faP({lh:[-3,-28],rh:[7,-33],fi:'stamp',ho:[0,1]}),160],[faP({lh:[-3,-28],rh:[6,-28],fi:'stamp',ho:[0,1]}),90],[faP({lh:[-3,-28],rh:[7,-32],fi:'stamp',ho:[0,1]}),150],
      [faP({lh:[-3,-28],rh:[6,-28],fi:'stamp',ho:[0,1]}),90],[faP({lh:[-3,-28],rh:[6,-28],fi:'stamp',hd:'b'}),500],[faP({lh:[-3,-28],rh:[6,-28],fi:'stamp'}),900]] }
});

// ---------------------------------------------------------------- KONTROLLEUR (mittleres Alter): dunkle Jacke, Ausweis um den Hals, kleine Lochzange in der Hand
var koS=[
"............",
"....kkkkk...",
"...kHHHHHk..",
"..kHHhHHHHk.",
".kHHHHHHHSSk",
".kHHHHHSSSSk",
".kHjtSSSSeSk",
".kHjSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var koF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHHhHHHHk",
"kjHSSSSSHjk",
"kjSSSSSSSjk",
"kSSeSSSeSSk",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var koB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kjHHHHHHHjk",
"ksHHHHHHHsk",
".kHHHHHHHk.",
".kHHHHHHHk.",
"..ksssssk..",
"...ktttk...",
"...ktttk...",
"...kssk...."];
M.defineChar('kontrolor',{
  legend:L({H:P.h1,h:P.h2,j:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(koS),F:HS(koF),B:{n:koB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.m1,P.m2,P.m0],open:P.m1,collar:[P.m0,P.m0],side:8,belly:1},
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.m1,P.m2,P.m0],sleeveF:[P.m0,P.m1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Ausweis am Band; Lochzange in der Hand
  post:function(b,p,X,Y,hx,hy){ var g=geo(M.CHARS.kontrolor,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.px(X+hx-2,t+1,P.r3); b.px(X+hx-1,t+2,P.r3); b.px(X+hx+1,t+1,P.r3); b.px(X+hx,t+2,P.r3); b.rect(X+hx-1,t+3,3,3,P.s6); b.hl(X+hx-1,X+hx+1,t+3,P.b2); b.px(X+hx,t+5,P.s4);
      var x=X+p.rh[0], y=Y+p.rh[1]; b.px(x+1,y+2,P.m3); b.px(x,y+2,P.m4); b.px(x+1,y+3,P.m2); }
    else if (p.v==='S'){ b.px(X+hx+2+g.shx,t+1,P.r3); b.vl(X+hx+3+g.shx,t+3,t+5,P.s6); b.px(X+hx+3+g.shx,t+3,P.b2);
      var nx=X+p.nh[0], ny=Y+p.nh[1]; if (!p.it){ b.hl(nx+2,nx+3,ny+1,P.m3); b.px(nx+4,ny,P.m4); b.px(nx+4,ny+2,P.m2); } } } });

// ---------------------------------------------------------------- BABICA: alte Frau in der Straßenbahn, Kopftuch (unter dem Kinn gebunden), Mantel, Einkaufstasche aus Stoff
var bbS=[
"............",
"....kkkkk...",
"...kcCccck..",
"..kccccCcck.",
".kcCccccccck",
".kcccccSSSSk",
".kcccctSSeSk",
".kccctSSSSSSk",
"..kcctSSSSSk.",
"..kccctSSmk..",
"...kcccSSk...",
"....kccCk....",
"....ktsk....",
"....ktsk...."];
var bbF=[
"...kkkkk...",
"..kcCccck..",
".kccccCcck.",
"kcCcccccCck",
"kccSSSSSSck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kctSSStSStk",
"kccSSSSSSck",
".kccSmSScck",
"..kcctccck.",
"...kcCck...",
"...ktttk...",
"...kssk...."];
var bbB=[
"...kkkkk...",
"..kcCccck..",
".kccccCcck.",
"kcCcccccCck",
"kccccCcccck",
"kcCcccccCck",
"kccccCcccck",
"kcCcccccCck",
".kccccCcck.",
".kcCcccCck.",
"..kccCcck..",
"...kcCck...",
"...ktttk...",
"...kssk...."];
var bbP=sitter(21,{});
// Stofftasche: im Sitzen auf dem Schoß, im Stehen in der nahen bzw. linken Bildhand
function clothBag(b,ch,p,X,Y,hx,hy){ var x, y;
  if (p.sit){ if (p.v==='S'){ x=X+hx+2; y=Y+hy-6; b.rect(x,y+1,6,5,P.s4); b.hl(x,x+5,y+3,P.r3); b.px(x+1,y,P.w2); b.px(x+4,y,P.w2); b.hl(x,x+5,y+5,P.s3); armS(b,ch,p,X,Y,hx,hy); }
    else if (p.v==='F'){ x=X+hx-3; y=Y+hy-5; b.rect(x,y+1,7,5,P.s4); b.hl(x,x+6,y+3,P.r3); b.px(x+1,y,P.w2); b.px(x+5,y,P.w2); handsF(b,ch,p,X,Y); } return; }
  var h=p.v==='S'?p.nh:(p.v==='F'?p.lh:p.rh); if (!h) return; x=X+h[0]-2; y=Y+h[1]+2; b.vl(x+1,y-1,y,P.w2); b.vl(x+4,y-1,y,P.w2); b.rect(x,y+1,6,6,P.s4); b.hl(x,x+5,y+3,P.r3); b.hl(x,x+5,y+6,P.s3); hand(b,X+h[0]-0.5,Y+h[1]-0.5,ch.cols.hand); }
M.defineChar('babica',{
  legend:L({c:P.n1,C:P.s4,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(bbS),F:HS(bbF),B:{n:bbB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.e1,P.e2,P.e0],buttons:P.k2,side:8,belly:1},
  skirt:{c:[P.e1,P.e2,P.e0],hem:14,flare:2},
  bones:[9,9,7,6], hipY:21, shoulder:5,
  cols:{trou:[P.w1,P.w2,P.w0],trouF:[P.w0,P.w1,P.k1],sleeve:[P.e1,P.e2,P.e0],sleeveF:[P.e0,P.e1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ clothBag(b,M.CHARS.babica,p,X,Y,hx,hy); },
  anims:{
    sit:[[bbP({nh:[6,-16],fh:[5,-16]}),1700],[bbP({nh:[6,-16],fh:[5,-16],hd:'b'}),110],[bbP({nh:[6,-16],fh:[5,-16],ho:[0,1]}),1300],[bbP({nh:[6,-16],fh:[5,-16]}),900]],
    sitTalk:[[bbP({nh:[6,-16],fh:[5,-16],hd:'o'}),150],[bbP({nh:[6,-16],fh:[5,-16]}),150]] }
});

// ---------------------------------------------------------------- STUDENT: Wollmütze, Kopfhörer, Rucksack, Daunenjacke
var stS2=[
"............",
"....kkkkk...",
"...kcPccck..",
"..kccPcccck.",
"..kCCPCCCCk.",
".kHHPPPSSSSk",
".kHPPPPSSeSk",
".kHPPPPSSSSSk",
"..ktPPSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var stF2=[
"...kkkkk...",
"..kcCccck..",
".kPcccccPk.",
"kPCCCCCCCPk",
"PPHSSSSSHPP",
"PPSSSSSSSPP",
"PPSeSSSeSPP",
"kPSSSStSSPk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var stB2=[
"...kkkkk...",
"..kcCccck..",
".kPcccccPk.",
"kPCCCCCCCPk",
"PPHHHHHHHPP",
"PPHHHHHHHPP",
"PPHHHHHHHPP",
"kPHHHHHHHPk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var stP=pose({},'F');
// Rucksack: seitlich hinten am Rücken, vorn die Gurte, hinten ganz
function backpack(b,ch,p,X,Y,hx,hy){ var g=geo(ch,p,hx,hy), t=Y+g.top;
  if (p.v==='S'){ var x0=X+hx-ch.tHipS+g.shx-3; b.rect(x0,t+2,3,9,P.m1); b.vl(x0,t+3,t+9,P.m2); b.hl(x0,x0+2,t+2,P.m2); b.px(X+hx+g.shx,t+2,P.k2); }
  else if (p.v==='F'){ b.vl(X+hx-3,t+1,t+6,P.m0); b.vl(X+hx+2,t+1,t+6,P.m0); }
  else { var x1=X+hx-4; b.rect(x1,t+2,8,10,P.m1); b.hl(x1,x1+7,t+2,P.m2); b.rect(x1+2,t+7,4,4,P.m2); b.hl(x1+2,x1+5,t+7,P.m3); } }
M.defineChar('student',{
  legend:L({c:P.a2,C:P.a3,P:P.k2,H:P.h2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(stS2),F:HS(stF2),B:{n:stB2}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.t2,P.t3,P.t1],stripe:P.t1,collar:[P.t1,P.t1],side:8},
  armR:[1.6,1.3],
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.t2,P.t3,P.t1],sleeveF:[P.t1,P.t2,P.t0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s4},
  post:function(b,p,X,Y,hx,hy){ backpack(b,M.CHARS.student,p,X,Y,hx,hy); },
  anims:{
    // hält sich an der Stange fest; der Wagen schwankt, der Kopf nickt zur Musik
    hold:[[stP({rh:[6,-42],lh:[-6,-22]}),900],[stP({rh:[6,-42],lh:[-6,-22],ho:[0,1]}),480],[stP({rh:[6,-42],lh:[-6,-22]}),480],[stP({rh:[6,-42],lh:[-6,-22],ho:[0,1]}),480],[stP({rh:[6,-42],lh:[-6,-22],hd:'b'}),110],
      [stP({rh:[6,-42],lh:[-6,-22],h:[1,-23]}),900],[stP({rh:[6,-42],lh:[-6,-22],h:[1,-23],ho:[0,1]}),480],[stP({rh:[6,-42],lh:[-6,-22],h:[1,-23]}),480]] }
});

// ================================================================ GEISTER (natürliche Farben; das Spiel färbt sie über M.ghostLut ein, Ausnahmen unten in M.GHOST_OVR)

// ---------------------------------------------------------------- TOMAŽ ZUPAN (wirkt 21, 1972), Wehrpflichtiger aus Ljubljana: schulterlanges braunes Haar, Koteletten, schmaler Schnurrbart,
// braune Cordjacke, Hemd mit breitem Kragen, Schlaghose; manchmal ein Schmuckkästchen
var toS=[
"............",
"....kkkkk...",
"...kHHhHHk..",
"..kHHHHHHHHk",
".kHHHHHHhhHk",
".kHHHHHhSSSk",
".kHHHHtSSeSk",
".kHHHHSSSSSSk",
".kHHHhSSSbbk.",
".kHHHkhSSmk..",
".kHHk.kSSk...",
"..kk...kk....",
"....ktsk....",
"....ktsk...."];
var toF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhhHHHHk",
"kHHSSSShHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHhSSStShHk",
"kHhSbbbShHk",
"kHktSmStkHk",
"kHkktttkkHk",
"kHk.kkk.kHk",
"kkkktttkkkk",
"...kssk...."];
var toB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHhHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
".kkHHHHHkk.",
"...kssk...."];
var toP=pose({},'F');
M.defineChar('tomaz',{
  legend:L({H:P.h3,h:P.t1,b:P.h2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(toS),F:HS(toF),B:{n:toB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:[P.w3,P.w4,P.w2],open:P.s5,lapel:P.w2,side:8},
  legR:[1.5,1.9],
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.w3,P.w4,P.w2],sleeveF:[P.w2,P.w3,P.w1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  // breiter Hemdkragen über dem Revers; Armbanduhr; Kästchen
  post:function(b,p,X,Y,hx,hy){ var g=geo(M.CHARS.tomaz,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.px(X+hx-3,t,P.s5); b.px(X+hx-3,t+1,P.s5); b.px(X+hx-2,t+1,P.s4); b.px(X+hx+3,t,P.s5); b.px(X+hx+3,t+1,P.s5); b.px(X+hx+2,t+1,P.s4); b.px(X+hx-2,t+2,P.s5); b.px(X+hx+2,t+2,P.s5);
      if (p.wt){ b.px(X+p.rh[0]-1,Y+p.rh[1],P.m4); b.px(X+p.rh[0]-1,Y+p.rh[1]+1,P.k2); }
      if (p.fi && FH[p.fi]){ FH[p.fi](b,p,X,Y,hx,hy); handsF(b,M.CHARS.tomaz,p,X,Y); } }
    else if (p.v==='S'){ b.px(X+hx+2+g.shx,t,P.s5); b.px(X+hx+3+g.shx,t+1,P.s5); } },
  anims:{
    // sieht auf die Armbanduhr, dann umher (nervös), tritt von einem Fuß auf den anderen
    wait:[[toP({rh:[1,-27],lh:[-6,-21],ho:[0,1],wt:1}),1000],[toP({rh:[1,-27],lh:[-6,-21],ho:[0,1],wt:1,hd:'b'}),110],[toP({rh:[1,-27],lh:[-6,-21],ho:[0,1],wt:1}),500],[toP({}),300],
      [toP({ho:[-1,0],hd:'l'}),800],[toP({ho:[1,0],hd:'r'}),900],[toP({h:[1,-23]}),500],[toP({h:[1,-23],hd:'b'}),110],[toP({}),700]],
    // hält das Kästchen mit beiden Händen vor der Brust
    box:[[toP({fi:'box',lh:[-2,-28],rh:[2,-28]}),1400],[toP({fi:'box',lh:[-2,-28],rh:[2,-28],hd:'b'}),110],[toP({fi:'box',lh:[-2,-28],rh:[2,-28],ho:[0,1]}),1100],[toP({fi:'box',lh:[-2,-28],rh:[2,-28]}),900],
      [toP({fi:'box',lh:[-2,-27],rh:[2,-27],ho:[0,-1]}),700]] }
});

// ---------------------------------------------------------------- PROF. IVAN BARAĆ (71, 1992), Übersetzer: groß, leicht gebeugt, weißes längeres Haar, runde Brille, Tweedmantel, Schal, Buch unter dem Arm
var ivS2=[
"............",
"....kkkkk...",
"...kwwjwwk..",
"..kwwwwwwwk.",
".kwwwwwwwSSk",
".kwwwwwSSSSk",
".kwwwtgggegk",
".kwwwtSSSSSSk",
".kwwwtSSSSSk.",
".kwwwktSSmk..",
"..kwwkktSk...",
"...kk..kk....",
"....ktsk....",
"....ktsk...."];
var ivF2=[
"...kkkkk...",
"..kwwjwwk..",
".kwwwwwwwk.",
"kwwwwjwwwwk",
"kwwSSSSSwwk",
"kwSSSSSSSwk",
"kwgegSgegwk",
"kwSSSStSSwk",
"kwkSSSSSkwk",
".kktSmStkk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ivB2=[
"...kkkkk...",
"..kwwjwwk..",
".kwwwwwwwk.",
"kwwwwjwwwwk",
"kwwwwwwwwwk",
"kwwwwwwwwwk",
"kgwwwwwwwgk",
"kwwwwjwwwwk",
"kwwwwwwwwwk",
".kwwwwwwwk.",
".kwwwwwwwk.",
"..kkkkkkk..",
"...ktttk...",
"...kssk...."];
var ivP=pose({},'F'), ivSit=sitter(25,{ln:1,nf:[11,0,'f'],ff:[9,0,'f']});
// Buch unter dem Arm
function bookUnder(b,ch,p,X,Y,hx,hy){ var g=geo(ch,p,hx,hy), t=Y+g.top;
  if (p.v==='S'){ var x0=X+hx-3+g.shx; b.rect(x0,t+4,6,5,P.n1); b.hl(x0,x0+5,t+4,P.s5); b.vl(x0+5,t+4,t+8,P.s4); b.px(x0+1,t+6,P.n2); armS(b,ch,p,X,Y,hx,hy); }
  else if (p.v==='F'){ var x1=X+g.sR[0]; b.rect(x1,t+4,2,6,P.n1); b.vl(x1+1,t+4,t+9,P.s5); armF(b,ch,p,X,Y,hx,hy,1); }
  else { var x2=X+g.sL[0]-1; b.rect(x2,t+4,2,6,P.n1); armF(b,ch,p,X,Y,hx,hy,-1); } }
M.defineChar('ivan',{
  legend:L({w:P.s6,j:P.s4,g:P.w1,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(ivS2),F:HS(ivF2),B:{n:ivB2}}, neck:{S:[5,12],F:[5,13],B:[5,13]},
  torso:{w:12,len:14,col:[P.e2,P.e3,P.e1],scarf:[P.r1,P.r2,P.r0],side:8,hunch:1},
  coat:{c:[P.e2,P.e3,P.e1],hem:12,w:6},
  bones:[12,11,9,8], hipY:25, shoulder:5,
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.e2,P.e3,P.e1],sleeveF:[P.e1,P.e2,P.e0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  // Tweed: ein paar hellere und grünliche Fäden
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.ivan, A=[P.e2,P.e3,P.e1], t=Y+hy-13;
    if (p.v==='F'){ onCol(b,X+hx-3,t+4,A,P.e4); onCol(b,X+hx+2,t+7,A,P.g3); onCol(b,X+hx-1,t+10,A,P.e4); onCol(b,X+hx+3,Y+hy+3,A,P.g3); onCol(b,X+hx-4,Y+hy+6,A,P.e4); }
    else if (p.v==='S'){ onCol(b,X+hx+1,t+5,A,P.e4); onCol(b,X+hx-2,t+9,A,P.g3); onCol(b,X+hx+2,Y+hy+4,A,P.e4); }
    if (p.v==='F' && p.fi && FH[p.fi]){ FH[p.fi](b,p,X,Y,hx,hy); handsF(b,ch,p,X,Y); return; }
    if (!p.nb && !p.it && !p.sit) bookUnder(b,ch,p,X,Y,hx,hy); },
  anims:{
    // liest im Stehen im Buch
    read:[[ivP({fi:'book',nb:1,lh:[-4,-29],rh:[4,-29],ho:[0,1]}),1800],[ivP({fi:'book',nb:1,lh:[-4,-29],rh:[4,-29],ho:[0,1],hd:'b'}),110],[ivP({fi:'book',nb:1,lh:[-4,-29],rh:[4,-29],ho:[0,1]}),1400],
      [ivP({fi:'bookTurn',nb:1,lh:[-4,-29],rh:[2,-31],ho:[0,1]}),240],[ivP({fi:'book',nb:1,lh:[-4,-29],rh:[4,-29],ho:[0,1]}),1600],[ivP({fi:'book',nb:1,lh:[-4,-29],rh:[4,-29]}),900]],
    // liest im Sessel
    sitRead:[[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS',ho:[1,1]}),1800],[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS',ho:[1,1],hd:'b'}),110],[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS',ho:[1,1]}),1500],
      [ivSit({nh:[8,-21],fh:[7,-20],it:'bookS',ho:[1,1]}),300],[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS'}),900]],
    sit:[[ivSit({nh:[8,-17],fh:[6,-17]}),1700],[ivSit({nh:[8,-17],fh:[6,-17],hd:'b'}),110],[ivSit({nh:[8,-17],fh:[6,-17],ho:[1,0]}),1300]],
    sitTalk:[[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS',hd:'o'}),150],[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS'}),150],[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS',hd:'o'}),150],[ivSit({nh:[8,-20],fh:[7,-20],it:'bookS'}),200]],
    // wartet am Tresen, die Hände flach auf der Theke
    wait:[[ivP({nb:1,lh:[-5,-28],rh:[5,-28],ho:[0,1]}),1600],[ivP({nb:1,lh:[-5,-28],rh:[5,-28],ho:[0,1],hd:'b'}),110],[ivP({nb:1,lh:[-5,-28],rh:[5,-28]}),1200],[ivP({nb:1,lh:[-5,-28],rh:[5,-28],ho:[0,1]}),900]] }
});

// ---------------------------------------------------------------- ZORA MARIĆ (57, 1994), Lehrerin: grauer Knoten, Brille an der Kette, graue Strickjacke über dunkelblauem Kleid, Kreide an den Fingern
var zoS=[
"............",
"....kkkkk...",
".kkkhjhhhk..",
"khjhkhhhhhk.",
"khhhkhhhhSSk",
"kjhhkhhSSSSk",
".kkkhtSggegk",
"...khtSSSSSSk",
"...kytSSSSSk.",
"...kytSSSmk..",
"....kySSSk...",
".....kkkk....",
"....ktsk....",
"....ktsk...."];
var zoF=[
"....kkk....",
"..kkhjhkk..",
".khhhhhhhk.",
"khhhjhhhhhk",
"khhSSSSShhk",
"khSSSSSSShk",
"khgegSgeghk",
"kySSSStSSyk",
".kySSSSSyk.",
".ktySmSytk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var zoB=[
"...kkkkk...",
"..khhjhhk..",
".khhkkkhhk.",
"khhkhjhkhhk",
"khhkjhhkhhk",
"khhhkkkhhhk",
"khhhhhhhhhk",
"kyhhhjhhhyk",
".khhhhhhhk.",
".kthhhhhtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var zoB2=pose({},'B'), zoF2=pose({},'F');
M.defineChar('zora',{
  legend:L({h:P.m3,H:P.m2,j:P.m4,g:P.m1,y:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(zoS),F:HS(zoF),B:{n:zoB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:12,col:[P.m2,P.m3,P.m1],open:P.n1,side:8},
  skirt:{c:[P.n1,P.n2,P.n0],hem:15,flare:1},
  bones:[10,10,7,7], hipY:22, shoulder:5,
  cols:{trou:[P.p3,P.p4,P.p2],trouF:[P.p2,P.p3,P.p1],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Kreide an den Fingern der rechten Hand; Handglocke; erhobener Zeigefinger
  post:function(b,p,X,Y){ var h=p.v==='S'?p.nh:p.rh; if (h) b.px(X+h[0]+1,Y+h[1]+1,P.s6);
    if (p.fi==='finger'){ b.px(X+p.rh[0],Y+p.rh[1]-1,P.p4); b.px(X+p.rh[0],Y+p.rh[1]-2,P.p4); } else if (p.v!=='S' && p.fi && FH[p.fi]) FH[p.fi](b,p,X,Y); },
  anims:{
    // schreibt an die Tafel (von hinten), der Arm oben
    teach:[[zoB2({rh:[7,-40],lh:[-5,-24]}),300],[zoB2({rh:[8,-41],lh:[-5,-24]}),220],[zoB2({rh:[7,-39],lh:[-5,-24]}),220],[zoB2({rh:[9,-40],lh:[-5,-24]}),220],[zoB2({rh:[8,-39],lh:[-5,-24],hd:'b'}),300],
      [zoB2({rh:[10,-41],lh:[-5,-24]}),220],[zoB2({rh:[9,-39],lh:[-5,-24]}),260],[zoB2({rh:[7,-32],lh:[-5,-24],ho:[1,0]}),700]],
    // läutet die Handglocke
    bell:[[zoF2({rh:[6,-30],fi:'bell'}),200],[zoF2({rh:[6,-34],fi:'bell'}),140],[zoF2({rh:[5,-34],fi:'bellT',hd:'o'}),90],[zoF2({rh:[7,-34],fi:'bell'}),90],[zoF2({rh:[5,-34],fi:'bellT',hd:'o'}),90],[zoF2({rh:[7,-34],fi:'bell'}),90],
      [zoF2({rh:[5,-34],fi:'bellT',hd:'o'}),90],[zoF2({rh:[6,-34],fi:'bell'}),300],[zoF2({rh:[6,-30],fi:'bell',hd:'b'}),400]],
    // zählt mit erhobenem Zeigefinger
    count:[[zoF2({rh:[6,-31],fi:'finger'}),400],[zoF2({rh:[6,-32],fi:'finger',hd:'o'}),300],[zoF2({rh:[6,-31],fi:'finger',ho:[0,1]}),300],[zoF2({rh:[6,-32],fi:'finger',hd:'o'}),300],[zoF2({rh:[6,-31],fi:'finger',ho:[0,1]}),300],
      [zoF2({rh:[6,-32],fi:'finger',hd:'o'}),300],[zoF2({rh:[6,-31],fi:'finger',hd:'b'}),110],[zoF2({rh:[6,-31],fi:'finger'}),700]] }
});

// ---------------------------------------------------------------- ALIJA (gest. 1995, um die 60), Kioskbesitzer: Schiebermütze, graue Weste, Hemd mit Ärmelschonern, Zeitungen unter dem Arm, Zange an der Kordel
var alS=[
"............",
"...kkkkk....",
"..kCcCCCkk..",
".kCCCCCCCCCk",
".kjjSSSSSSSk",
".kjSSSSSSSSk",
".kjtSSSSSeSk",
".kjtSSSSSSSSk",
"..ktSStSSSSk.",
"..ktSSSSSmk..",
"...ktSSSSk...",
"....kkkkk....",
"....ktsk....",
"....ktsk...."];
var alF=[
"...........",
"...kkkkk...",
"..kCcCCCk..",
".kCCCCCCCk.",
"kCCCCCCCCCk",
"kjSSSSSSSjk",
"kjSeSSSeSjk",
"ktSSSStSStk",
"kSSSSSSSSSk",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var alB=[
"...........",
"...kkkkk...",
"..kCcCCCk..",
".kCCCCCCCk.",
"kCCCCCCCCCk",
"kjjjjjjjjjk",
"kjjjjjjjjjk",
"ktjjjjjjjtk",
".kjjjjjjjk.",
".ktjjjjjtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var alP=pose({},'S');
// Zeitungsbündel (verschnürt) unter dem Arm
function newsBundle(b,ch,p,X,Y,hx,hy){ var g=geo(ch,p,hx,hy), t=Y+g.top;
  if (p.v==='S'){ var x0=X+hx-3+g.shx; b.rect(x0,t+4,7,5,P.s4); b.hl(x0,x0+6,t+5,P.s2); b.hl(x0,x0+6,t+7,P.s3); b.vl(x0+3,t+4,t+8,P.w3); armS(b,ch,p,X,Y,hx,hy); }
  else if (p.v==='F'){ var x1=X+g.sR[0]; b.rect(x1,t+4,3,6,P.s4); b.vl(x1+2,t+4,t+9,P.s2); armF(b,ch,p,X,Y,hx,hy,1); }
  else { var x2=X+g.sL[0]-2; b.rect(x2,t+4,3,6,P.s4); armF(b,ch,p,X,Y,hx,hy,-1); } }
M.defineChar('alija',{
  legend:L({C:P.m2,c:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(alS),F:HS(alF),B:{n:alB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.m1,P.m2,P.m0],buttons:P.m3,vneck:P.s5,collar:[P.s6,P.s5],side:8,belly:1},
  cols:{trou:[P.e1,P.e2,P.e0],trouF:[P.e0,P.e1,P.k1],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],arm:[P.k2,P.m0,P.k1],armF:[P.k1,P.k2,P.k0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Zange an der Kordel vor dem Bauch; Zeitungen unter dem Arm (beim Verkaufen eine in der Hand)
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.alija, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.px(X+hx-2,t+2,P.w3); b.px(X+hx-2,t+3,P.w3); b.px(X+hx-2,t+4,P.w3); b.px(X+hx-2,t+5,P.m4); b.px(X+hx-3,t+6,P.m3); b.px(X+hx-1,t+6,P.m3); }
    else if (p.v==='S'){ b.px(X+hx+3+g.shx,t+5,P.m4); b.px(X+hx+3+g.shx,t+6,P.m3); }
    if (!p.nb && !p.sit) newsBundle(b,ch,p,X,Y,hx,hy); },
  anims:{
    // hält eine Zeitung hin
    sell:[[alP({nh:[5,-26],fh:[2,-26],it:'newsFold',nb:1}),300],[alP({nh:[9,-29],fh:[3,-27],it:'newsFold',nb:1,ln:1}),200],[alP({nh:[11,-29],fh:[3,-27],it:'newsFold',nb:1,ln:1,hd:'o'}),300],
      [alP({nh:[11,-29],fh:[3,-27],it:'newsFold',nb:1,ln:1}),900],[alP({nh:[11,-29],fh:[3,-27],it:'newsFold',nb:1,ln:1,hd:'b'}),110],[alP({nh:[11,-30],fh:[3,-27],it:'newsFold',nb:1,ln:1,hd:'o'}),200],
      [alP({nh:[11,-29],fh:[3,-27],it:'newsFold',nb:1,ln:1}),1100]] }
});

// alle post()-Haken mit vollständiger Pose aufrufen
['fikret','senada','hajra','rade','emina','lejla','sacir','nedzad','jakob','amra','ilija','milka','dragica','nada','mirza','sehic','selma','damir','fadila','kontrolor','babica','student','tomaz','ivan','zora','alija'].forEach(function(id){
  var ch=M.CHARS[id], f=ch&&ch.post; if (!f) return; ch.post=function(b,p,X,Y,hx,hy){ f(b,full(ch,p,hx,hy),X,Y,hx,hy); }; });

// ---------------------------------------------------------------- Geisterfarben (wie 03_cast.js): welche Kleidungsfarbe in welche Geisterfarbe geht, damit man sie erkennt.
// Augen dunkel (k0 -> k1), Haut über die vorhandene Hautrampe (p/q werden nicht überschrieben).
M.GHOST_OVR.tomaz={ k0:'k1', h2:'m1', h3:'s1', t1:'s2', w1:'k2', w2:'s2', w3:'s3', w4:'s4', s4:'s4', s5:'s5', c1:'b0', c2:'b1', c3:'b2', r2:'d1', r3:'d2', y3:'e4', y5:'s6' };
M.GHOST_OVR.ivan={ k0:'k1', s4:'s4', s6:'s6', w1:'m1', e1:'s1', e2:'s2', e3:'e4', e4:'s4', g3:'m3', r0:'k2', r1:'d1', r2:'d2', s5:'s5', s3:'s3', m1:'m1', m2:'m2', n1:'c1', n2:'c2' };
M.GHOST_OVR.zora={ k0:'k1', m1:'m1', m2:'m2', m3:'m3', m4:'m4', n0:'k2', n1:'b0', n2:'b1', y1:'e1', y2:'e1', y3:'e4', y4:'e4', w2:'s1', s6:'s6' };
M.GHOST_OVR.alija={ k0:'k1', m0:'m0', m1:'m1', m2:'m2', m3:'m3', m4:'m4', s3:'s3', s4:'s4', s5:'s5', s6:'s6', e0:'k2', e1:'m0', e2:'m1', w3:'s2' };
M.PORTRAIT_GHOSTS.tomaz=true; M.PORTRAIT_GHOSTS.ivan=true; M.PORTRAIT_GHOSTS.zora=true; M.PORTRAIT_GHOSTS.alija=true;

// ---------------------------------------------------------------- Kontaktbild der neuen Animationen (wann die Handlung „passiert“, für npc.anim(name,hook)); vorhandene bleiben
(function(){ var c={ gesture:1, pour:2, stamp:2, bell:2, sell:2, feed:3, thermos:1, cup:3, wave:2, keys:1, hammer:1, box:0, folder:1, domino:3, teach:1, count:1 };
  Object.keys(c).forEach(function(k){ if (M.CONTACT[k]===undefined) M.CONTACT[k]=c[k]; }); })();

// ---------------------------------------------------------------- Farben der gesprochenen Sätze
(function(){ var c={ fikret:P.y4, senada:P.t5, hajra:P.p4, rade:P.n5, emina:P.r4, lejla:P.a5, sacir:P.w5, nedzad:P.t4, jakob:P.s5, amra:P.d6, ilija:P.g5, milka:P.s4,
  dragica:P.d5, nada:P.m4, mirza:P.b3, sehic:P.e4, selma:P.a6, damir:P.c4, fadila:P.b4, kontrolor:P.m4, babica:P.p5, student:P.y5, tomaz:P.v4, ivan:P.v5, zora:P.v5, alija:P.v4 };
  Object.keys(c).forEach(function(k){ if (M.CAST_COLORS[k]===undefined) M.CAST_COLORS[k]=c[k]; }); })();

})(M);
