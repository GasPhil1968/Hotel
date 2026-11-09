/* ===== 14_k3_cast_b.js — Besetzung Kapitel 3 (Mostar, Ende November 2011), zweite Hälfte: Davor, Lena, Jela, Zdravko, Frau Kolar
   und die Geister Bato, Mate und der Springer =====
   Vorgaben: game/CAST3.md (IDs und Animationsnamen fest), KAPITEL3_KONZEPT.md 5.4/5.5. Format wie 14_k2_cast.js und 03_cast.js; Legende der
   Kopf-Stempel ebenda (k Umriss · H h j Haar · S s t Haut · e Auge · m Mund · b Bart · c C Mütze/Tuch · g Brille · w Weiß · r Akzent), dazu je Figur
   eigene Zeichen. Gegenstände in der nahen Hand über M.HELD (eigene Namen mit Kürzel der Figur), Dinge, die eine Figur immer bei sich hat
   (Thermoskanne, Geschirrtuch, Kopfhörer, Brille an der Kette), zeichnet post() mit eigenen Posenfeldern. Sitzende Figuren sitzen wie die
   allgemeine Haltung 'sit' (Hüfte 13 px über dem Boden). Geister sind in natürlichen Farben gemalt; das Spiel färbt sie über M.ghostLut ein,
   Ausnahmen unten in M.GHOST_OVR. */
(function(M){
'use strict';
var P=M.P, T=M.T, S=M.poseS, F=M.poseF, H=M.HELD;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// Kopfvarianten wie M.headSet, dazu 'l'/'r' (Blick nach links/rechts: Augen einen Pixel versetzt) – wie in 14_k2_cast.js
function eyes(rows,d){ return rows.map(function(r){ var a=r.split(''), o=a.slice(); for (var i=0;i<a.length;i++){ if (a[i]!=='e') continue; var j=i+d; if (a[j] && 'Sst'.indexOf(a[j])>=0 && a[j-d*2]!=='e'){ o[i]=a[j]; o[j]='e'; } } return o.join(''); }); }
function HS(rows,skin){ var s=M.headSet(rows,skin); s.l=eyes(rows,-1); s.r=eyes(rows,1); return s; }
// Pose mit festen Grundwerten
function pose(base,v){ return function(o){ var p={}, k; for (k in base) p[k]=base[k]; if (o) for (k in o) p[k]=o[k]; return v==='S'||!v?S(p):F(p,v); }; }
// Sitzen: Hüfte immer auf Sitzhöhe der Räume (wie M.ANIMS.sit), unabhängig von der Beinlänge der Figur
function sitter(hipY,o0){ var y=-13+((hipY||23)-23), b={h:[0,y],nf:[9,0,'f'],ff:[7,0,'f'],sit:1}, k; if (o0) for (k in o0) b[k]=o0[k]; return pose(b,'S'); }

// ---------------------------------------------------------------- Gelenke wie im Rig (02_rig.js), für Dinge unter und in den Händen
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
// post() bekommt die Pose mit den Grundwerten des Rigs ergänzt (Hände, Füße), auch wenn ein Skript eine knappe Pose einfriert
function full(ch,p,hx,hy){ var q={}, k; for (k in p) q[k]=p[k];
  if (p.v==='S'){ if (!q.nh) q.nh=[hx,hy+2]; if (!q.fh) q.fh=[hx-2,hy+2]; if (!q.nf) q.nf=[0,0,'f']; if (!q.ff) q.ff=[0,0,'f']; }
  else { var sw=ch.shoulder; if (!q.lh) q.lh=[hx-sw-2,hy+2]; if (!q.rh) q.rh=[hx+sw+2,hy+2]; if (!q.lf) q.lf=[-3,0]; if (!q.rf) q.rf=[3,0]; } return q; }
// Pixel nur setzen, wo schon eine bestimmte Farbe liegt (Muster auf dem Stoff, Gürtel über dem Mantel)
function onCol(b,x,y,cols,c){ if (cols.indexOf(b.get(x,y))>=0) b.px(x,y,c); }
// Farben in einem Rechteck umfärben (map: alter Index -> neuer)
function recolor(b,x0,y0,x1,y1,map){ for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var c=b.get(x,y); if (c!==T && map[c]!==undefined) b.px(x,y,map[c]); } }
// nur dort zeichnen, wo noch nichts liegt: Dinge, die hinter dem Körper hängen
function behind(b,fn){ var t=new M.Buf(b.w,b.h,T); fn(t); for (var i=0;i<t.d.length;i++) if (t.d[i]!==T && b.d[i]===T) b.d[i]=t.d[i]; }
// ein Rumpfbild (ch.tF, ch.tB, ch.tS) einmalig nachbemalen: fn(x,y,c,w,h) gibt die neue Farbe zurück (oder nichts)
function paintTorso(buf,fn){ for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var c=buf.d[y*buf.w+x]; if (c===T) continue; var n=fn(x,y,c,buf.w,buf.h); if (n!==undefined) buf.d[y*buf.w+x]=n; } }
function cmap(from,to){ var m={}; from.forEach(function(c,i){ m[c]=to[i]; }); return m; }

// ================================================================ LEBENDE

// ---------------------------------------------------------------- DAVOR ZELENIKA (52), lebt in München: graues kurzes Haar mit Geheimratsecken, gepflegter grauer Kinnbart,
// Brille, beiger Trenchcoat (Gürtel, Schulterklappen) über einem dunkelblauen Pullover, Bauchansatz; müde
var dvS=[
"............",
"....kkkkk...",
"...khjhhSkk.",
"..khhhhSSSSk",
".khhhhhSSSSk",
".khhhhSSSSSk",
".khhhtSggegk",
".khhtSSSSsSSk",
"..ktSSSSSSSk",
"..ktSSSbbbk.",
"...ktSbmbk..",
"....kbbbk...",
"....ktsk....",
"....ktsk...."];
var dvF=[
"...kkkkk...",
"..khhjhhk..",
".khSShSShk.",
"khhSSSSShhk",
"khSSSSSSShk",
"khSSSSSSShk",
"khgegSgeghk",
"ktSsSStsStk",
".kSSbbbSSk.",
".ktbbmbbtk.",
"..kbbbbbk..",
"...kbbbk...",
"...ktttk...",
"...kssk...."];
var dvB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kghhhhhhhgk",
"kshhhhhhhsk",
".khhhhhhhk.",
".kshhhhhsk.",
"..kbsssbk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
// Handy am Ohr (nahe Hand an der Wange)
H.dvPhone=function(b,x,y){ b.px(x,y-1,P.k2); b.px(x+1,y-1,P.m1); b.px(x+2,y+1,P.k2); b.px(x+2,y+2,P.k2); b.px(x+3,y+2,P.m1); };
var dvP=pose({},'S'), dvSit=sitter(23,{ln:2}), TRENCH=[P.e4,P.s4,P.e3];
M.defineChar('davor',{
  legend:L({H:P.m2,h:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.m4,g:P.m2}),
  heads:{S:HS(dvS),F:HS(dvF),B:{n:dvB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:13,len:13,col:[P.e4,P.s4,P.e3],vneck:P.n1,lapel:P.s4,buttons:P.w1,side:9,belly:1}, torsoS:{collar:[P.s4,P.e3]},
  coat:{c:[P.e4,P.s4,P.e3],hem:10,w:6},
  shoulder:6,
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.e4,P.s4,P.e3],sleeveF:[P.e3,P.e4,P.e2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  // Gürtel des Trenchcoats mit Schnalle (über dem Mantelschoß), Schulterklappen; danach die Arme wieder darüber
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.davor, g=geo(ch,p,hx,hy), by=Y+hy-2, x;
    if (p.v==='F'){ for (x=X+hx-7;x<=X+hx+7;x++) onCol(b,x,by,TRENCH,P.e3); b.px(X+hx-1,by,P.w3); b.px(X+hx,by,P.w2); b.px(X+hx-1,by+1,P.e3); b.px(X+hx-2,by+2,P.e3);
      b.hl(X+g.sL[0]-1,X+g.sL[0]+1,Y+g.top,P.e3); b.hl(X+g.sR[0]-1,X+g.sR[0]+1,Y+g.top,P.e3);
      armF(b,ch,p,X,Y,hx,hy,-1); armF(b,ch,p,X,Y,hx,hy,1); }
    else if (p.v==='S'){ for (x=X+hx-5;x<=X+hx+6;x++) onCol(b,x,by,TRENCH,P.e3); b.px(X+hx+4,by,P.w2); b.px(X+hx-1+g.shx,Y+g.top,P.e3); b.px(X+hx+g.shx,Y+g.top,P.e3);
      armS(b,ch,p,X,Y,hx,hy); if (p.it && H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); }
    else { for (x=X+hx-7;x<=X+hx+7;x++) onCol(b,x,by,TRENCH,P.e3); b.hl(X+hx-1,X+hx+1,by-1,P.e3); } },
  anims:{
    // telefoniert: das Handy am Ohr, die andere Hand in der Manteltasche; nickt müde, sagt wenig
    phone:[[dvP({}),80],[dvP({nh:[5,-31],fh:[-1,-21]}),130],[dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1]}),1300],[dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1],hd:'o'}),160],
      [dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1]}),260],[dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1],hd:'o'}),180],[dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1]}),1100],
      [dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,2],hd:'b'}),140],[dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,2],hd:'s'}),900],[dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1],hd:'o'}),160],
      [dvP({nh:[0,-40],fh:[-1,-21],it:'dvPhone',ho:[0,1]}),900]],
    // sitzt am Tisch, vorgebeugt, die Unterarme auf der Tischplatte (etwa 20 px hoch); reibt sich die Augen unter der Brille
    sit:[[dvSit({nh:[9,-19],fh:[8,-19],ho:[1,1]}),1800],[dvSit({nh:[9,-19],fh:[8,-19],ho:[1,1],hd:'b'}),110],[dvSit({nh:[9,-19],fh:[8,-19],ho:[1,1]}),1500],
      [dvSit({nh:[8,-25],fh:[8,-19],ho:[1,1]}),160],[dvSit({nh:[8,-30],fh:[8,-19],ho:[1,2],hd:'b'}),1100],[dvSit({nh:[8,-25],fh:[8,-19],ho:[1,1]}),160],
      [dvSit({nh:[9,-19],fh:[8,-19],ho:[1,2],hd:'s'}),1300],[dvSit({nh:[9,-19],fh:[8,-19],ho:[1,1]}),900]],
    sitTalk:[[dvSit({nh:[9,-19],fh:[8,-19],ho:[1,1],hd:'o'}),150],[dvSit({nh:[10,-23],fh:[8,-19],ho:[1,1]}),150],[dvSit({nh:[10,-23],fh:[8,-19],ho:[1,1],hd:'o'}),150],[dvSit({nh:[9,-19],fh:[8,-19],ho:[1,1]}),170]] }
});

// ---------------------------------------------------------------- LENA ZELENIKA (14), Münchner Teenager: langes hellbraunes Haar mit Pony, weiße Kopfhörer um den Hals,
// pinker Anorak (Kapuze, Reißverschluss), Jeans, weiße Turnschuhe, Smartphone
var lnS=[
"............",
"....kkkkk...",
"...khhjhhk..",
"..khhhhhhhk.",
".khhhhhhhhhk",
".kHhhhhhhhhk",
".kHhhhhtSeSk",
".kHhhhtSSSSSk",
".kHhhhtSSSSk.",
".kHhhhktSmk..",
".kHhhhhktSk..",
".kHhhhhhkk...",
".kHhhhhktsk..",
".kHhjhhktsk..",
"..kHhhk......",
"...kkk......."];
var lnF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSSStSSHk",
"kHhSSSSShHk",
"kHhSSmSShHk",
"kHhtSSStHhk",
"kHhhkkkhhHk",
"kHhktttkhHk",
"kHk.kssk.Hk",
".k.......k."];
var lnB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhjhhk",
"kHhhhhhhhHk",
"kHhhhhhhhHk",
"kHhhhjhhhHk",
"kHhhhhhhhHk",
"kHhhhhhhhHk",
"kHHhhhhhHHk",
".kHHhhhHHk.",
"..kkkkkkk.."];
// Smartphone in rosa Hülle, der Bildschirm hell; B: der Daumen tippt
H.lnPhoneA=function(b,x,y){ b.rect(x+1,y-4,3,5,P.d4); b.rect(x+1,y-4,2,4,P.k2); b.px(x+1,y-4,P.b5); b.px(x+2,y-3,P.b4); b.px(x+1,y-2,P.b3); };
H.lnPhoneB=function(b,x,y){ b.rect(x+1,y-4,3,5,P.d4); b.rect(x+1,y-4,2,4,P.k2); b.px(x+1,y-4,P.b5); b.px(x+1,y-3,P.b4); b.px(x+2,y-2,P.p4); b.px(x+2,y-3,P.p4); };
var lnP=pose({},'S'), ANO=[P.d3,P.d4,P.d2];
M.defineChar('lena',{
  legend:L({H:P.w3,h:P.w4,j:P.w5,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(lnS),F:HS(lnF),B:{n:lnB}}, neck:{S:[8,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.d3,P.d4,P.d2],collar:[P.d4,P.d2],side:7}, torsoS:{hood:P.d2},
  coat:{c:[P.d3,P.d4,P.d2],hem:3,w:5},
  bones:[10,10,7,7], shoulder:4, hipY:22,
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.d3,P.d4,P.d2],sleeveF:[P.d2,P.d3,P.d1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s6},
  // Reißverschluss, Kopfhörer um den Hals, Kapuze auf dem Rücken; 'pa': die nahe Hand offen, Handfläche nach oben
  post:function(b,p,X,Y,hx,hy){ var g=geo(M.CHARS.lena,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ for (var y=t+2;y<=Y+hy+2;y++) onCol(b,X+hx,y,ANO,P.d2); b.px(X+hx,t+3,P.m4);
      b.rect(X+hx-4,t,2,2,P.s6); b.px(X+hx-4,t+1,P.m3); b.rect(X+hx+2,t,2,2,P.s6); b.px(X+hx+3,t+1,P.m3); }
    else if (p.v==='S'){ var nx=X+hx+g.shx+1; b.rect(nx-2,t,2,2,P.s6); b.px(nx-2,t+1,P.m3); b.px(nx-1,t-1,P.m4);
      if (p.pa){ var hx2=Math.round(X+p.nh[0]-0.5), hy2=Math.round(Y+p.nh[1]-0.5); b.rect(hx2-1,hy2,5,2,T); b.hl(hx2-1,hx2+2,hy2,P.p4); b.hl(hx2-1,hx2+2,hy2+1,P.p3); b.px(hx2+3,hy2,P.p3); b.px(hx2+3,hy2-1,P.p4); b.px(hx2,hy2-1,P.p3); } }
    else { var t2=Y+hy-11; b.hl(X+hx-3,X+hx+2,t2,P.d2); b.hl(X+hx-3,X+hx+2,t2+1,P.d3); b.hl(X+hx-2,X+hx+1,t2+2,P.d2); b.hl(X+hx-1,X+hx,t2+3,P.d1); b.px(X+hx-4,t,P.s6); b.px(X+hx+3,t,P.s6); } },
  anims:{
    // tippt auf dem Smartphone, den Kopf gesenkt
    phone:[[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA',ho:[1,1]}),900],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneB',ho:[1,1]}),150],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA',ho:[1,1]}),130],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneB',ho:[1,1]}),150],
      [lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA',ho:[1,1]}),1200],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA',ho:[1,1],hd:'b'}),110],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneB',ho:[1,1]}),150],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA',ho:[1,1]}),140],
      [lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneB',ho:[1,1]}),150],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA',ho:[1,1]}),700],[lnP({nh:[5,-26],fh:[4,-25],it:'lnPhoneA'}),600]],
    // hält die geöffnete Hand vor sich hin, Handfläche nach oben (der Schlüssel); still, ein Blinzeln, der Blick auf die Hand
    hand:[[lnP({}),80],[lnP({nh:[5,-23],fh:[-1,-20]}),140],[lnP({nh:[9,-24],fh:[-1,-20],pa:1}),1700],[lnP({nh:[9,-24],fh:[-1,-20],pa:1,hd:'b'}),110],
      [lnP({nh:[9,-24],fh:[-1,-20],pa:1,ho:[1,1]}),1500],[lnP({nh:[9,-24],fh:[-1,-20],pa:1,ho:[1,1],hd:'s'}),900],[lnP({nh:[9,-24],fh:[-1,-20],pa:1}),900]] }
});

// ---------------------------------------------------------------- JELA (78), Nachbarin der Zelenikas: gedrungen, sehr alt, weißes Haar unter einem braunen Kopftuch
// (unter dem Kinn gebunden), dunkle Strickweste über dunkler Bluse, schwarzer Rock, blaugraue Schürze mit kleinem Muster, braune Strümpfe, Hausschuhe
var jlS=[
"............",
"....kkkkk...",
"...kcCccck..",
"..kccccCcck.",
".kcCcccccCck",
".kccccwwwSSk",
".kcccctSSeSk",
".kccctSSSSSSk",
"..kcctSSSSSk.",
"..kccctSSmk..",
"...kcccSSk...",
"....kccCk....",
"....ktsk....",
"....ktsk...."];
var jlF=[
"...kkkkk...",
"..kcCccck..",
".kccccCcck.",
"kcCcccccCck",
"kcwwwwwwwck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kcSSSStSSck",
"kctSSSSStck",
".kctSmStck.",
"..kcSSSck..",
"...kcCck...",
"...ktttk...",
"...kssk...."];
var jlB=[
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
var jlP=pose({},'S');
M.defineChar('jela',{
  legend:L({c:P.w2,C:P.w3,w:P.s6,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(jlS),F:HS(jlF),B:{n:jlB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:11,col:[P.e1,P.e2,P.e0],open:P.m1,side:9,belly:1,hunch:1},
  skirt:{c:[P.k2,P.m0,P.k1],hem:14,flare:2},
  bones:[9,8,7,6], hipY:20, shoulder:5, armR:[1.4,1.1],
  cols:{trou:[P.w1,P.w2,P.w0],trouF:[P.w0,P.w1,P.k1],sleeve:[P.m1,P.m2,P.m0],sleeveF:[P.m0,P.m1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.r1},
  // Schürze (vorn über dem Rock, seitlich vor den Oberschenkeln, hinten die Schleife); Jute zwischen den Händen ('jw'), ausgestreckter Zeigefinger ('fp')
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.jela, pr=function(x,y,c){ return (((x+y*3)%5)===0 && ((y>>1)&1))?P.c1:c; };
    if (p.v==='F'){ var hm=p.sit?3:11; b.poly([[X+hx-5,Y+hy-2],[X+hx+5,Y+hy-2],[X+hx+6,Y+hy+hm],[X+hx-6,Y+hy+hm]],function(x,y){ return pr(x,y,x<X+hx-3?P.c4:(x>X+hx+3?P.c2:P.c3)); }); b.hl(X+hx-5,X+hx+5,Y+hy-2,P.c2);
      armF(b,ch,p,X,Y,hx,hy,-1); armF(b,ch,p,X,Y,hx,hy,1); }
    else if (p.v==='S' && !p.sit){ var bn=ch.bones, kn=ik(hx+1,hy-1,p.nf[0],p.nf[1]-2,bn[0],bn[1],-1), kf=ik(hx-1,hy-1,p.ff[0],p.ff[1]-2,bn[0],bn[1],-1), kx=Math.round(Math.max(kn[0],kf[0]));
      b.poly([[X+hx+1,Y+hy-3],[X+hx+5,Y+hy-3],[X+kx+3,Y+hy+11],[X+kx-1,Y+hy+11]],function(x,y){ return pr(x,y,x>=X+kx+1?P.c4:P.c3); }); b.hl(X+hx-3,X+hx+4,Y+hy-3,P.c2);
      armS(b,ch,p,X,Y,hx,hy); }
    else if (p.v==='B'){ b.hl(X+hx-5,X+hx+5,Y+hy-3,P.c2); b.px(X+hx-1,Y+hy-4,P.c3); b.px(X+hx+1,Y+hy-4,P.c3); b.px(X+hx-2,Y+hy-3,P.c4); b.px(X+hx+2,Y+hy-3,P.c4); b.vl(X+hx-1,Y+hy-2,Y+hy+1,P.c3); b.vl(X+hx+1,Y+hy-2,Y+hy+2,P.c3); }
    if (p.v==='S' && p.jw){ var a=[Math.round(X+p.fh[0]),Math.round(Y+p.fh[1])], c=[Math.round(X+p.nh[0]),Math.round(Y+p.nh[1])];
      b.line(a[0]+1,a[1],c[0]+1,c[1],P.e4); var lo=a[1]>c[1]?a:c; b.line(lo[0],lo[1]+2,lo[0]-1+(p.jw&1),lo[1]+6,P.e3); b.px(lo[0]+(p.jw&1),lo[1]+7,P.e4); armS(b,ch,p,X,Y,hx,hy); }
    if (p.v==='S' && p.fp){ var fx=Math.round(X+p.nh[0]-0.5), fy=Math.round(Y+p.nh[1]-0.5); b.px(fx+2,fy,P.p4); b.px(fx+3,fy,P.p4); b.px(fx+2,fy+1,P.p3); } },
  anims:{
    // wickelt Jute um einen Ast (die Hände vorn erhoben, kreisen), redet dabei vor sich hin
    wrap:[[jlP({nh:[10,-27],fh:[11,-30],jw:1,ln:1,ho:[1,0]}),260],[jlP({nh:[12,-29],fh:[10,-28],jw:2,ln:1,ho:[1,0]}),260],[jlP({nh:[11,-32],fh:[12,-29],jw:3,ln:1,ho:[1,-1]}),260],[jlP({nh:[9,-30],fh:[11,-32],jw:4,ln:1,ho:[1,-1]}),260],
      [jlP({nh:[10,-27],fh:[11,-30],jw:1,ln:1,ho:[1,0]}),260],[jlP({nh:[12,-29],fh:[10,-28],jw:2,ln:1,ho:[1,0],hd:'o'}),260],[jlP({nh:[11,-32],fh:[12,-29],jw:3,ln:1,ho:[1,-1]}),260],[jlP({nh:[9,-30],fh:[11,-32],jw:4,ln:1,ho:[1,-1],hd:'b'}),260],
      [jlP({nh:[10,-28],fh:[11,-29],jw:1,ln:1,ho:[1,0]}),700]],
    // zeigt mit dem Finger (vorwurfsvoll), die andere Hand in die Hüfte gestemmt
    point:[[jlP({}),80],[jlP({nh:[7,-25],fh:[-3,-17]}),120],[jlP({nh:[12,-29],fh:[-3,-17],fp:1,ln:1,hd:'o'}),240],[jlP({nh:[12,-31],fh:[-3,-17],fp:1,ln:1}),150],[jlP({nh:[12,-29],fh:[-3,-17],fp:1,ln:1,hd:'o'}),200],
      [jlP({nh:[12,-31],fh:[-3,-17],fp:1,ln:1}),150],[jlP({nh:[12,-29],fh:[-3,-17],fp:1,ln:1}),1000],[jlP({nh:[12,-29],fh:[-3,-17],fp:1,ln:1,hd:'b'}),110],[jlP({nh:[12,-29],fh:[-3,-17],fp:1,ln:1,hd:'o'}),220],
      [jlP({nh:[7,-25],fh:[-3,-17]}),160],[jlP({}),200]] }
});

// ---------------------------------------------------------------- ZDRAVKO (61), Wirt am Westbusbahnhof: rund, kahl, buschige schwarze Brauen, weißes Hemd mit
// hochgekrempelten Ärmeln, schwarze Weste, Geschirrtuch über der Schulter
var zvS=[
"............",
"....kkkkk...",
"...kSSSSSkk.",
"..kSSSSSSSSk",
".kSSSSSSSSSk",
".kSSSSSSBBBk",
".kjSSSSSSeSk",
".kjtSSSSSSSSk",
".kjtSSSSSSSk.",
"..ktSSSSSmSk.",
"..ktSSSSSSk..",
"...ktSSSSk...",
"....ktsk....",
"....ktsk...."];
var zvF=[
"...kkkkk...",
"..kSSSSSk..",
".kSSSSSSSk.",
"kSSSSSSSSSk",
"kSBBBSBBBSk",
"kSSeSSSeSSk",
"ksSSSStSSsk",
"kjSSSSSSSjk",
"ksSSSmSSSsk",
".ksSSSSSsk.",
"..ksssssk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var zvB=[
"...kkkkk...",
"..kSSSSSk..",
".kSSSSSSSk.",
"kSSSSSSSSSk",
"kSSSSSSSSSk",
"kSSSSSSSSSk",
"ksSSSSSSSsk",
"kjjjjjjjjjk",
".kjjjjjjjk.",
".ksssssssk.",
"..ksssssk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var zvP=pose({},'S');
// Geschirrtuch (weiß, zwei rote Streifen): über der Schulter oder in der Hand
function towel(b,x,y,w,h){ b.rect(x,y,w,h,P.s6); b.vl(x+w-1,y,y+h-1,P.s5); b.hl(x,x+w-1,y+2,P.r3); if (h>5) b.hl(x,x+w-1,y+h-2,P.r3); }
M.defineChar('zdravko',{
  legend:L({S:P.p4,s:P.p3,t:P.p2,m:P.p1,B:P.h0,j:P.m2}),
  heads:{S:HS(zvS),F:HS(zvF),B:{n:zvB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:16,len:13,col:[P.k2,P.m0,P.k1],collar:[P.s6,P.s5],buttons:P.m2,side:12,belly:1}, torsoS:{collar:[P.s6,P.s5]},
  bones:[10,10,8,7], hipY:22, shoulder:6, armR:[1.5,1.3], legR:[1.9,1.5],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],arm:[P.p4,P.p5,P.p3],armF:[P.p3,P.p4,P.p2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // aufgekrempelte Ärmel (Wulst am Ellbogen), Geschirrtuch über der Schulter; beim Polieren ('gl') Glas in der fernen, Tuch in der nahen Hand
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.zdravko, g=geo(ch,p,hx,hy), t=Y+g.top;
    var cuff=function(e){ var x=Math.round(X+e[0]-0.5), y=Math.round(Y+e[1]-0.5); b.px(x,y,P.s5); b.px(x+1,y,P.s6); b.px(x,y+1,P.s4); b.px(x+1,y+1,P.s5); };
    if (p.v==='S'){ cuff(g.eN); if (p.gl){ var gx=Math.round(X+p.fh[0]), gy=Math.round(Y+p.fh[1]); b.rect(gx-1,gy-4,3,5,P.b4); b.vl(gx-1,gy-4,gy,P.b5); b.px(gx+1,gy-3,P.b3); b.hl(gx-1,gx+1,gy+1,P.b3);
        armS(b,ch,p,X,Y,hx,hy); var nx=Math.round(X+p.nh[0]-0.5), ny=Math.round(Y+p.nh[1]-0.5); towel(b,nx-1,ny-1,3,4); b.px(nx,ny+3,P.s5); } }
    else { cuff(g.eL); cuff(g.eR); }
    if (!p.gl){ if (p.v==='F') towel(b,X+g.sR[0]-3,t-1,3,8);
      else if (p.v==='S'){ var sx=X+hx+g.shx; b.hl(sx-1,sx+2,t-1,P.s6); towel(b,sx+2,t,2,6); towel(b,sx-3,t,2,5); }
      else towel(b,X+g.sL[0]-1,t-1,3,9); } },
  anims:{
    // poliert ein Glas hinter der Theke, hält es zwischendurch gegen das Licht
    polish:[[zvP({nh:[7,-28],fh:[6,-27],gl:1}),300],[zvP({nh:[8,-29],fh:[6,-27],gl:1}),240],[zvP({nh:[7,-30],fh:[6,-27],gl:1}),240],[zvP({nh:[6,-29],fh:[6,-27],gl:1,hd:'b'}),240],
      [zvP({nh:[7,-28],fh:[6,-27],gl:1}),240],[zvP({nh:[8,-29],fh:[6,-27],gl:1}),240],[zvP({nh:[7,-30],fh:[6,-27],gl:1}),240],[zvP({nh:[6,-29],fh:[6,-27],gl:1}),240],
      [zvP({nh:[5,-26],fh:[8,-36],gl:1,ho:[0,-1]}),900],[zvP({nh:[5,-26],fh:[8,-36],gl:1,ho:[0,-1],hd:'b'}),110],[zvP({nh:[7,-28],fh:[6,-27],gl:1}),400]] }
});
// rund: vorn und hinten die Schultern schmaler als der Bauch, seitlich wölbt sich der Bauch nach vorn (die Rumpfbilder einmal zurechtschneiden)
(function(){ var ch=M.CHARS.zdravko;
  function cut(buf,fn){ for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++) if (fn(x,y,buf.w,buf.h)) buf.d[y*buf.w+x]=T; }
  [ch.tF,ch.tB].forEach(function(buf){ cut(buf,function(x,y,w,h){ var lim=y<1?5.5:(y<4?6.5:(y<5?7.5:(y<h-2?8:7))); return Math.abs(x-(w-1)/2)>=lim; }); });
  cut(ch.tS,function(x,y,w,h){ return (y<4 && x>w-2-(4-y)) || (y>=h-2 && x>w-3); }); })();

// ---------------------------------------------------------------- FRAU KOLAR (um 50), Vermisstenstelle: aufrecht, kurzes graues Haar, Lesebrille an einer Kette
// (beim Schreiben auf der Nase), dunkelblauer Blazer über heller Bluse, Kugelschreiber
var koS=[
"............",
"....kkkkk...",
"...khjjhhk..",
"..khhhhhjhk.",
".khhhhhhhhhk",
".kHhhhhhSShk",
".kHhhhtSSeSk",
".kHhtSSSSSSSk",
"..kHtSSSSSSk",
"..kktSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var koF=[
"...kkkkk...",
"..khjjhhk..",
".khhhhhjhk.",
"khhhhhhhhhk",
"khhhSSSShhk",
"khSSSSSSShk",
"khSeSSSeShk",
"khSSSStSShk",
"kkSSSSSSSkk",
".kktSmStkk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var koB=[
"...kkkkk...",
"..khjjhhk..",
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
// Varianten mit der Lesebrille auf der Nase: 'g', 'gb' (blinzelt), 'go' (spricht)
function withGlasses(rows,row,txt){ var r=rows.slice(); r[row]=txt; return r; }
var koSh=HS(koS), koSg=HS(withGlasses(koS,6,".kHhhhtSgegk")), koFh=HS(koF), koFg=HS(withGlasses(koF,6,"khgegSgeghk"));
koSh.g=koSg.n; koSh.gb=koSg.b; koSh.go=koSg.o; koFh.g=koFg.n; koFh.gb=koFg.b; koFh.go=koFg.o;
var koSit=sitter(23,{ln:1});
M.defineChar('kolar',{
  legend:L({H:P.m2,h:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.d3,g:P.m1}),
  heads:{S:koSh,F:koFh,B:{n:koB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:[P.n1,P.n2,P.n0],vneck:P.s6,lapel:P.n2,buttons:P.m4,side:8},
  coat:{c:[P.n1,P.n2,P.n0],hem:3,w:5},
  bones:[11,10,8,7], hipY:23, shoulder:5,
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.n1,P.n2,P.n0],sleeveF:[P.n0,P.n1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Brille an der Kette (hängt vor der Brust, solange sie sie nicht trägt), Kugelschreiber in der Brusttasche; beim Schreiben ('wr') Blatt und Stift
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kolar, g=geo(ch,p,hx,hy), t=Y+g.top, worn=!!(p.hd&&p.hd.charAt(0)==='g');
    if (p.v==='F'){ if (!worn){ b.px(X+hx-2,t+1,P.m4); b.px(X+hx-2,t+2,P.m3); b.px(X+hx-1,t+3,P.m3); b.px(X+hx+2,t+1,P.m4); b.px(X+hx+2,t+2,P.m3); b.px(X+hx+1,t+3,P.m3);
        b.px(X+hx-2,t+4,P.m1); b.px(X+hx-1,t+4,P.b4); b.px(X+hx,t+4,P.m1); b.px(X+hx+1,t+4,P.b4); b.px(X+hx+2,t+4,P.m1); b.px(X+hx-1,t+5,P.m1); b.px(X+hx+1,t+5,P.m1); }
      b.vl(X+hx+3,t+2,t+3,P.m4); }
    else if (p.v==='S'){ if (!worn){ b.px(X+hx+1+g.shx,t+1,P.m4); b.px(X+hx+2+g.shx,t+2,P.m3); b.px(X+hx+3+g.shx,t+3,P.m1); b.px(X+hx+3+g.shx,t+4,P.b4); b.px(X+hx+2+g.shx,t+4,P.m1); }
      if (p.wr){ var fx=Math.round(X+p.fh[0]), fy=Math.round(Y+p.fh[1]); b.hl(fx-3,fx+5,fy+1,P.s6); b.hl(fx-3,fx+5,fy+2,P.s4); b.px(fx+2,fy+1,P.s3); b.px(fx+4,fy+1,P.s3);
        armS(b,ch,p,X,Y,hx,hy); var nx=Math.round(X+p.nh[0]-0.5), ny=Math.round(Y+p.nh[1]-0.5); b.line(nx+2,ny+1,nx+3,ny-2,P.n3); b.px(nx+2,ny+1,P.k1); }
      else b.px(X+hx+2+g.shx,t+3,P.m4); } },
  anims:{
    // schreibt am Schreibtisch (Tischplatte etwa 20 px hoch), die Lesebrille auf der Nase; sieht zwischendurch kurz auf
    write:[[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'g',ho:[1,1]}),420],[koSit({nh:[10,-19],fh:[7,-19],wr:1,hd:'g',ho:[1,1]}),300],[koSit({nh:[9,-20],fh:[7,-19],wr:1,hd:'gb',ho:[1,1]}),200],[koSit({nh:[11,-19],fh:[7,-19],wr:1,hd:'g',ho:[1,1]}),460],
      [koSit({nh:[10,-19],fh:[7,-19],wr:1,hd:'g',ho:[1,1]}),340],[koSit({nh:[11,-20],fh:[7,-19],wr:1,hd:'g',ho:[1,1]}),300],[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'g'}),900],[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'gb'}),110]],
    sitTalk:[[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'go'}),150],[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'g'}),150],[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'go'}),150],[koSit({nh:[9,-19],fh:[7,-19],wr:1,hd:'g'}),200]] }
});

// ================================================================ GEISTER (natürliche Farben; das Spiel färbt sie über M.ghostLut ein, Ausnahmen unten in M.GHOST_OVR)

// ---------------------------------------------------------------- BATO BRKIĆ († 2006, wirkt 71), Fährmann: groß und breit, weißer Bart, wettergegerbtes Gesicht, alte
// Schiebermütze, dicker blauer Pullover, olivgrüne Wathose mit Hosenträgern, Gummistiefel; manchmal eine Sturmlaterne
var btS=[
".............",
"...kkkkkkk...",
"..kCccccCCkk.",
".kCCCCCCCCCCCk",
".kwwSSSSSSSk.",
".kwwSSSwwSSk.",
".kwtSSSSSeSk.",
".kwtSSSSSSSSk",
"..kwSSrSSSSk.",
"..kbbSSbbbbk.",
"..kbbbbbmbk..",
"..kbbbbbbbk..",
"...kbbbbbk...",
"....kbbbk....",
"....ktsk.....",
"....ktsk....."];
var btF=[
".............",
"...kkkkkkk...",
"..kCcccccCk..",
".kCCCCCCCCCk.",
"kCCCCCCCCCCCk",
"kwwSSSSSSSwwk",
"kwSeSSSSSeSwk",
"ktSSSStSSSStk",
"kbSrSSSSSrSbk",
"kbbbbSSSbbbbk",
"kbbbbbmbbbbbk",
".kbbbbbbbbbk.",
"..kbbbbbbbk..",
"...kbbbbbk...",
"....kttsk....",
"....kttsk...."];
var btB=[
".............",
"...kkkkkkk...",
"..kCcccccCk..",
".kCCCCCCCCCk.",
"kCCCCCCCCCCCk",
"kwwwwwwwwwwwk",
"kswwbwwwbwwsk",
"kswwwwbwwwwsk",
".kwbwwwwwbwk.",
".kbwwbwbwwbk.",
"..kbtttttbk..",
"...kbtttbk...",
"....ktttk....",
"....kttsk....",
"....kttsk...."];
// Sturmlaterne am Bügel: Dach, Glas mit Flamme (leuchtet), Fuß; 'btLampB': die Flamme flackert
function stormLamp(b,x,y,f){ b.px(x,y+2,P.m2); b.px(x+1,y+2,P.m2); b.line(x-1,y+3,x-2,y+5,P.m1); b.line(x+2,y+3,x+3,y+5,P.m1);
  b.hl(x-1,x+2,y+4,P.m2); b.hl(x-2,x+3,y+5,P.m1); b.vl(x-2,y+6,y+9,P.m1); b.vl(x+3,y+6,y+9,P.m1);
  b.rect(x-1,y+6,4,4,P.y3); b.hl(x-1,x+2,y+6,P.y4); b.px(x,y+7,f?P.y5:P.l0); b.px(x+1,y+7,P.y5); b.px(x,y+8,P.y5); b.px(x+1,y+8,f?P.l0:P.y5); b.px(x-1,y+9,P.y2); b.px(x+2,y+9,P.y2);
  b.hl(x-2,x+3,y+10,P.m2); b.hl(x-1,x+2,y+11,P.m1); }
H.btLamp=function(b,x,y){ stormLamp(b,x,y,0); };
H.btLampB=function(b,x,y){ stormLamp(b,x,y,1); };
var btP=pose({},'S'), btPF=pose({},'F');
M.defineChar('bato',{
  legend:L({C:P.m1,c:P.m2,w:P.s6,b:P.s5,S:P.q4,s:P.q3,t:P.q2,m:P.q1,r:P.d4}),
  heads:{S:HS(btS),F:HS(btF),B:{n:btB}}, neck:{S:[5,15],F:[6,15],B:[6,14]},
  torso:{w:15,len:15,col:[P.c2,P.c3,P.c1],side:10,belly:1},
  bones:[12,11,9,8], hipY:25, shoulder:7, armR:[1.7,1.4], legR:[2.0,1.8],
  cols:{trou:[P.g2,P.g3,P.g1],trouF:[P.g1,P.g2,P.g0],sleeve:[P.c2,P.c3,P.c1],sleeveF:[P.c1,P.c2,P.c0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  // Gummistiefel (unten an der Wathose), die Stange ('pl': beide Hände daran), die hohle Hand hinter dem Ohr ('cu', von vorn)
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.bato, BOOT=cmap([P.g0,P.g1,P.g2,P.g3],[P.k1,P.k2,P.m0,P.m1]);
    var feet=p.v==='S'?[p.nf,p.ff]:[p.lf,p.rf]; feet.forEach(function(f){ if (!f) return; recolor(b,X+f[0]-3,Y+f[1]-7,X+f[0]+3,Y+f[1]-1,BOOT); });
    if (p.v==='S' && p.pl){ var a=p.fh, c=p.nh, dx=c[0]-a[0], dy=c[1]-a[1]; if (Math.abs(dy)<0.5) dy=0.5; var k1=(6-a[1])/dy, k2=(-64-a[1])/dy;
      var x0=X+a[0]+dx*k1, x1=X+a[0]+dx*k2; b.line(Math.round(x0),Y+6,Math.round(x1),Y-64,P.w3); b.line(Math.round(x0)+1,Y+6,Math.round(x1)+1,Y-64,P.w2);
      armS(b,ch,p,X,Y,hx,hy); }
    if (p.v==='F' && p.cu){ var ux=Math.round(X+p.rh[0]-0.5), uy=Math.round(Y+p.rh[1]-0.5); b.px(ux,uy-1,P.q4); b.px(ux+1,uy-1,P.q4); b.px(ux+2,uy,P.q3); b.px(ux+2,uy+1,P.q3); b.px(ux+1,uy+2,P.q2); b.px(ux,uy+2,P.q3); } },
  anims:{
    // hält die Sturmlaterne hoch und späht über den Fluss; die Laterne schwingt ein wenig, die Flamme flackert
    lamp:[[btP({}),80],[btP({nh:[6,-34],fh:[-1,-23]}),150],[btP({nh:[12,-50],fh:[-1,-23],it:'btLamp',ho:[1,0]}),700],[btP({nh:[12,-50],fh:[-1,-23],it:'btLampB',ho:[1,0]}),160],
      [btP({nh:[13,-50],fh:[-1,-23],it:'btLamp',ho:[1,0],ln:1}),600],[btP({nh:[13,-50],fh:[-1,-23],it:'btLampB',ho:[1,0],ln:1,hd:'b'}),120],[btP({nh:[12,-50],fh:[-1,-23],it:'btLamp',ho:[1,0],ln:1}),500],
      [btP({nh:[12,-49],fh:[-1,-23],it:'btLampB',ho:[1,0]}),160],[btP({nh:[12,-50],fh:[-1,-23],it:'btLamp',ho:[1,0]}),900],[btP({nh:[12,-50],fh:[-1,-23],it:'btLampB',ho:[1,1],hd:'s'}),400]],
    // stößt die Fähre mit der langen Stange ab: hoch greifen, sich hineinlehnen, nachdrücken, die Stange wieder vorsetzen
    pole:[[btP({nh:[4,-36],fh:[5,-46],pl:1}),320],[btP({nh:[5,-32],fh:[7,-41],pl:1,ln:2,ff:[-4,0,'t']}),300],[btP({nh:[6,-28],fh:[8,-36],pl:1,ln:3,ff:[-7,0,'t'],nf:[3,0,'f'],hd:'b'}),340],
      [btP({nh:[6,-27],fh:[8,-35],pl:1,ln:3,ff:[-7,0,'t'],nf:[3,0,'f']}),260],[btP({nh:[5,-34],fh:[7,-43],pl:1,ln:1,ff:[-3,0,'f']}),260],[btP({nh:[4,-36],fh:[5,-46],pl:1}),400]],
    // lauscht (von vorn): die hohle Hand hinter dem Ohr, der Ellbogen seitlich hoch, der Kopf zur Hand geneigt, der Blick zur Seite
    listen:[[btPF({}),80],[btPF({rh:[11,-36]}),140],[btPF({rh:[8,-47],cu:1,ho:[1,0],hd:'r'}),1500],[btPF({rh:[8,-47],cu:1,ho:[1,0],hd:'b'}),110],
      [btPF({rh:[8,-47],cu:1,ho:[1,1],hd:'r'}),1400],[btPF({rh:[8,-47],cu:1,ho:[1,1],hd:'s'}),700],[btPF({rh:[11,-36]}),140],[btPF({}),200]] }
});
// Wathose mit Latz und Trägern über dem Pullover, Strickmuster: einmal in die Rumpfbilder gemalt
(function(){ var ch=M.CHARS.bato, W=cmap([P.c0,P.c1,P.c2,P.c3],[P.g0,P.g1,P.g2,P.g3]);
  paintTorso(ch.tF,function(x,y,c,w){ var m=(w-1)/2; if (y>=8) return W[c]; if (y>=5 && Math.abs(x-m)<=4.5) return y===5?P.g1:W[c];
    if ((x===3||x===w-4) && y<5) return P.w1; if (y===5 && (x===3||x===w-4)) return P.m3; if (c===P.c2 && (x%3===1) && (y&1)) return P.c1; });
  paintTorso(ch.tB,function(x,y,c,w){ var m=(w-1)/2; if (y>=9) return W[c]; var sx=Math.round(3+(m-3)*y/9), sx2=Math.round(w-4-(w-4-m)*y/9); if (x===sx||x===sx2) return P.w1; if (c===P.c2 && (x%3===1) && (y&1)) return P.c1; });
  paintTorso(ch.tS,function(x,y,c,w){ if (y>=8) return W[c]; if (y>=5 && x>=w-4) return y===5?P.g1:W[c]; if (x===4 && y<8) return P.w1; if (c===P.c2 && (x%3===1) && (y&1)) return P.c1; }); })();

// ---------------------------------------------------------------- MATE ZELENIKA († März 2010, wirkt 81), früher Gastarbeiter in München: schmal, gebeugt, kleiner Kopf,
// weißer Schnurrbart, grauer Filzhut, grauer Anzug aus den 1970ern mit breitem Revers, breite Krawatte, Thermoskanne in der Hand
var mtS=[
".............",
".....kkkk....",
"....kDCCCk...",
"....kCCCCCk..",
"....kcccccck.",
"..kkCCCCCCCCk",
"....kwSSSSSk.",
"....kwtSSeSk.",
"....kwtSSSSSk",
".....ktSSSSk.",
".....ktwwwwk.",
"......ktSmk..",
".......kkk...",
"......ktsk...",
"......ktsk..."];
var mtF=[
".............",
".....kkk.....",
"....kDCCk....",
"...kCCCCCk...",
"...kccccck...",
".kCCCCCCCCCk.",
"..kwSSSSSwk..",
"..kSeSSSeSk..",
"..ktSStSStk..",
"..kSwwwwwSk..",
"...ktSmStk...",
"....ktttk....",
".....kkk.....",
"....ktttk....",
".....ksk....."];
var mtB=[
".............",
".....kkk.....",
"....kDCCk....",
"...kCCCCCk...",
"...kccccck...",
".kCCCCCCCCCk.",
"..kwwwwwwwk..",
"..kswDwDwsk..",
"..kswwDwwsk..",
"...kwDwDwk...",
"...ktttttk...",
"....ktttk....",
".....kkk.....",
"....ktttk....",
".....ksk....."];
// Thermoskanne der 70er: rot, Becherdeckel aus Metall; (x,y) = Hand, die sie in der Mitte hält bzw. (stehend) der Fuß
function thermos(b,x,y){ b.rect(x,y-3,2,6,P.r2); b.vl(x,y-3,y+2,P.r3); b.px(x+1,y+2,P.r1); b.hl(x,x+1,y-5,P.m4); b.px(x,y-4,P.m3); b.px(x+1,y-4,P.m2); b.px(x+1,y-1,P.y3); }
// alter Hausschlüssel (Messing), mit dem Bart nach vorn
H.mtKey=function(b,x,y){ b.px(x+2,y,P.y3); b.px(x+2,y-1,P.y2); b.px(x+3,y-1,P.y3); b.hl(x+3,x+6,y,P.y3); b.px(x+5,y+1,P.y2); b.px(x+6,y+1,P.y3); b.px(x+4,y,P.y4); };
var mtP=pose({},'S'), mtSit=sitter(21,{ln:1});
M.defineChar('mate',{
  legend:L({C:P.m3,c:P.m1,D:P.m4,w:P.s6,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(mtS),F:HS(mtF),B:{n:mtB}}, neck:{S:[4,13],F:[6,12],B:[6,12]},
  torso:{w:10,len:12,col:[P.m2,P.m3,P.m1],vneck:P.s5,lapel:P.m3,buttons:P.m1,side:7,hunch:1},
  coat:{c:[P.m2,P.m3,P.m1],hem:4,w:5},
  bones:[10,9,7,6], hipY:21, shoulder:4, armR:[1.2,1.0], legR:[1.5,1.3],
  cols:{trou:[P.m2,P.m3,P.m1],trouF:[P.m1,P.m2,P.m0],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  // breite Krawatte; die Thermoskanne: in der nahen Hand, beim Hinhalten des Schlüssels in der fernen ('tf'), hinter dem Rücken ('bk'), im Sitzen auf dem Tisch ('tt')
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.mate, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.px(X+hx-1,t,P.r1); b.px(X+hx,t,P.r1); b.vl(X+hx-1,t+1,t+5,P.r2); b.vl(X+hx,t+1,t+5,P.r3); b.px(X+hx-1,t+6,P.r1); }
    else if (p.v==='S'){ b.vl(X+hx+3+g.shx,t+1,t+4,P.r2); }
    if (p.sit){ if (p.tt && p.v==='S') thermos(b,X+hx+12,Y-22); return; }
    if (p.v==='S'){ if (p.bk){ behind(b,function(tb){ thermos(tb,Math.round(X+p.fh[0])-3,Math.round(Y+p.fh[1])+3); }); }
      else if (p.it||p.tf){ var fx=Math.round(X+p.fh[0]-0.5), fy=Math.round(Y+p.fh[1]-0.5); behind(b,function(tb){ thermos(tb,fx-1,fy+1); }); }
      else { var nx=Math.round(X+p.nh[0]-0.5), ny=Math.round(Y+p.nh[1]-0.5); thermos(b,nx,ny+1); hand(b,nx,ny,ch.cols.hand); } }
    else if (p.v==='F'){ var lx=Math.round(X+p.lh[0]-0.5), ly=Math.round(Y+p.lh[1]-0.5); thermos(b,lx-1,ly+1); hand(b,lx,ly,ch.cols.hand); }
    else { var rx=Math.round(X+p.rh[0]-0.5), ry=Math.round(Y+p.rh[1]-0.5); thermos(b,rx,ry+1); hand(b,rx,ry,ch.cols.hand); } },
  anims:{
    // sitzt am Fenstertisch (Tischplatte etwa 20 px hoch), die Hände auf dem Tisch, die Thermoskanne vor sich; sieht hinaus
    sit:[[mtSit({nh:[8,-19],fh:[7,-19],tt:1}),1800],[mtSit({nh:[8,-19],fh:[7,-19],tt:1,hd:'b'}),110],[mtSit({nh:[8,-19],fh:[7,-19],tt:1,ho:[1,0],hd:'r'}),1600],
      [mtSit({nh:[8,-19],fh:[7,-19],tt:1}),1300],[mtSit({nh:[8,-19],fh:[7,-19],tt:1,hd:'b'}),110],[mtSit({nh:[8,-19],fh:[7,-19],tt:1,ho:[0,-1]}),1200]],
    sitTalk:[[mtSit({nh:[8,-19],fh:[7,-19],tt:1,hd:'o'}),150],[mtSit({nh:[9,-22],fh:[7,-19],tt:1}),150],[mtSit({nh:[9,-22],fh:[7,-19],tt:1,hd:'o'}),150],[mtSit({nh:[8,-19],fh:[7,-19],tt:1}),180]],
    // wartet am Pfosten, die Hände (mit der Kanne) auf dem Rücken, hebt sich ab und zu auf die Zehen und sieht die Straße hinunter
    wait:[[mtP({nh:[-4,-20],fh:[-3,-20],ln:1,bk:1}),1800],[mtP({nh:[-4,-20],fh:[-3,-20],ln:1,bk:1,hd:'b'}),110],[mtP({nh:[-4,-20],fh:[-3,-20],ln:1,bk:1,ho:[1,0],hd:'r'}),1400],
      [mtP({nh:[-4,-21],fh:[-3,-21],ln:1,bk:1,h:[0,-24],nf:[1,-1,'t'],ff:[-2,-1,'t'],ho:[1,0],hd:'r'}),700],[mtP({nh:[-4,-20],fh:[-3,-20],ln:1,bk:1}),1500],[mtP({nh:[-4,-20],fh:[-3,-20],ln:1,bk:1,hd:'s'}),900]],
    // hält einen Schlüssel hin, der Arm ausgestreckt, ein kleines Nicken
    key:[[mtP({fh:[-3,-19],tf:1}),80],[mtP({nh:[6,-24],fh:[-3,-19],tf:1}),150],[mtP({nh:[10,-27],fh:[-3,-19],it:'mtKey',ln:1}),180],[mtP({nh:[11,-28],fh:[-3,-19],it:'mtKey',ln:1}),1600],
      [mtP({nh:[11,-28],fh:[-3,-19],it:'mtKey',ln:1,hd:'b'}),110],[mtP({nh:[11,-28],fh:[-3,-19],it:'mtKey',ln:2,ho:[1,1]}),500],[mtP({nh:[11,-28],fh:[-3,-19],it:'mtKey',ln:1}),1400]] }
});

// ---------------------------------------------------------------- DER SPRINGER (Geist, ein Brückenspringer der 1960er, wirkt 25): athletisch, Seitenscheitel mit Pomade,
// dunkle Badehose der 60er, barfuß, sonst nichts. Er sagt nie etwas.
var spS=[
"............",
"....kkkkk...",
"...kHjjHHk..",
"..kHHHHjjHk.",
".kHHHHHHHHHk",
".kHHHHHHSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSSk.",
"....kkkkkk..",
"....ktsk....",
"....ktsk...."];
var spF=[
"...kkkkk...",
"..kHjjHHk..",
".kHjHHHkHk.",
"kHHHHHHkHHk",
"kHSSSSSSSHk",
"kHSSSSSSSHk",
"kSSeSSSeSSk",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
// gesenkter Kopf (kippt vornüber): mehr Haar, das Gesicht verkürzt
var spFd=[
"...........",
"...kkkkk...",
"..kHjjHHk..",
".kHjjHHkHk.",
"kHHjHHHkHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHSSSSSSSHk",
"kSSeSSSeSSk",
".ktSStSStk.",
"..kkkkkkk..",
"...ktttk...",
"...kssk...."];
var spB=[
"...kkkkk...",
"..kHjjHHk..",
".kHHHHjHHk.",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kSHHHHHHHSk",
"ksHHHHHHHsk",
".kHHHHHHHk.",
".ktSSSSStk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var spFh=HS(spF); spFh.d=spFd;
var spP=pose({},'F');
M.defineChar('springer',{
  legend:L({H:P.h1,h:P.h2,j:P.m2,S:P.q4,s:P.q3,t:P.q2,m:P.q1}),
  heads:{S:HS(spS),F:spFh,B:{n:spB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.q3,P.q4,P.q2],side:8,taper:1},
  coat:{c:[P.n1,P.n2,P.n0],hem:3,w:5},
  bones:[11,11,8,7], hipY:24, shoulder:6, armR:[1.3,1.0], legR:[1.6,1.3],
  cols:{trou:[P.q3,P.q4,P.q2],trouF:[P.q2,P.q3,P.q1],sleeve:[P.q3,P.q4,P.q2],sleeveF:[P.q2,P.q3,P.q1],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.q2},
  // Sprung ('jp'): 3 kippt vornüber (verkürzt, sinkt), 4 fällt (flach, tiefer), 5 nur noch ein Rest am unteren Rand, 6 fort (leer)
  post:function(b,p,X,Y,hx,hy){ if (p.jp) jumpFrame(b,p.jp,X,Y,hy); }
});
// barfuß: Füße aus Haut statt Schuhen
(function(){ var ch=M.CHARS.springer, leg={s:P.q3,t:P.q4,u:P.q2}, FEET={ f:['.ss..','.sst.','.uuuu'], h:['.ss.t','.sstt','uuu..'], t:['.ss..','.sst.','..sst','...uu'], F:['.st.','ssst'], B:['.ss.','uuuu'] };
  Object.keys(FEET).forEach(function(k){ ch.shoes[k]=M.stamp(FEET[k],leg); });
  // Brust und Rücken: Schlüsselbeine, Brustmuskeln, Bauchnabel, Wirbelsäule
  paintTorso(ch.tF,function(x,y,c,w){ var m=(w-1)/2, d=Math.abs(x-m); if (y===1 && d>1.5 && d<4.5) return P.q4; if (y===5 && d>1 && d<3.6) return P.q2; if (y===10 && d<0.6) return P.q1; });
  paintTorso(ch.tB,function(x,y,c,w){ var m=(w-1)/2, d=Math.abs(x-m); if (d<0.6 && y>=5 && y<=10) return P.q2; if (y===3 && d>2 && d<3.6) return P.q2; });
  paintTorso(ch.tS,function(x,y,c,w){ if (y===5 && x>=w-4 && x<w-1) return P.q2; }); })();
// Bilder des Sprungs, die das Rig so nicht kann. 3: der Körper verkürzt sich zum Betrachter hin (gestaucht zu den Füßen), der Kopf bleibt heil
// und sinkt mit; 4: flach im Fall, Arme weit; 5: nur noch der Rest am unteren Rand; 6: fort
function tipRows(b,top,foot,k){ var c=b.d.slice(), w=b.w, h=b.h, dy=Math.round((foot-top)*(1-k)); b.d.fill(T);
  for (var y=top+dy;y<=foot && y<h;y++){ var s0=foot-(foot-y+0.5)/k, s1=foot-(foot-y-0.5)/k, a=Math.max(top,Math.round(s0)), z=Math.min(foot,Math.round(s1)), mid=Math.round((s0+s1)/2);
    for (var x=0;x<w;x++){ for (var q=0;q<=Math.max(0,z-a)+1;q++){ var sy=mid+((q&1)?-((q+1)>>1):(q>>1)); if (sy<a||sy>z) continue; var v=c[sy*w+x]; if (v!==T){ b.d[y*w+x]=v; break; } } } }
  for (var y2=0;y2<top;y2++){ var ty=y2+dy; if (ty<0||ty>=h) continue; for (var x2=0;x2<w;x2++){ var v2=c[y2*w+x2]; if (v2!==T) b.d[ty*w+x2]=v2; } } }
function jumpFrame(b,jp,X,Y,hy){
  if (jp===3){ tipRows(b,Y+hy-12,Y,0.66); return; }
  b.d.fill(T); if (jp>=6) return;
  var SK=[P.q3,P.q4,P.q2], HD=[P.q4,P.q3], cy=jp===4?Y-13:Y+2;
  // hinten (oben): Rücken und Badehose, verkürzt
  b.ellipse(X,cy-2.5,4.5,2,function(x,y){ return y<cy-3?P.q3:P.q2; }); b.rect(X-2,cy-5,4,2,P.n1); b.px(X-2,cy-5,P.n2);
  // die Arme weit ausgebreitet, die Hände leicht nach oben (Schwalbe)
  limb(b,[X-4,cy],[X-17,cy-3],1.3,SK); limb(b,[X+4,cy],[X+17,cy-3],1.3,SK); hand(b,X-18,cy-4,HD); hand(b,X+17,cy-4,HD);
  b.ellipse(X,cy+0.5,6,2.2,function(x,y){ return y<cy?P.q4:P.q3; });
  // vorn: der Kopf, von oben gesehen (Scheitel, Pomadenglanz), unten ein Streifen Stirn
  b.ellipse(X,cy+2.5,3.8,3.6,function(x,y){ return y>=cy+5?P.q3:((x===X+1&&y<cy+3)?P.m2:(x===X-1?P.h2:P.h1)); }); }
M.CHARS.springer.anims={
  // steht auf der Brüstung, die Arme ausgebreitet (leicht erhoben, die Brust heraus), atmet, wartet auf die Laternen
  stand:[[spP({lh:[-17,-40],rh:[17,-40]}),1500],[spP({lh:[-17,-41],rh:[17,-41],ho:[0,-1]}),900],[spP({lh:[-17,-40],rh:[17,-40],hd:'b'}),110],[spP({lh:[-17,-40],rh:[17,-40]}),1300],[spP({lh:[-17,-39],rh:[17,-39],ho:[0,1]}),700]],
  // springt: in die Knie, Absprung, kippt vornüber, fällt und ist fort
  jump:[[spP({lh:[-17,-40],rh:[17,-40]}),160],[spP({h:[0,-21],lh:[-15,-31],rh:[15,-31],ho:[0,1]}),200],[spP({h:[0,-26],lf:[-2,-2],rf:[2,-2],lh:[-17,-45],rh:[17,-45],ho:[0,-1]}),140],
    [spP({h:[0,-25],lf:[-2,-1],rf:[2,-1],lh:[-18,-36],rh:[18,-36],hd:'d',jp:3}),110],[spP({jp:4}),100],[spP({jp:5}),90],[spP({jp:6}),400]]
};
// Der Sprung endet im leeren Bild und bleibt dort stehen (wie anim('jump',hook,true)), bis die nächste Animation beginnt: Die Engine liest die
// Dauer des laufenden Bildes in jeder Runde; dabei merkt sich die Figur (a.hold), im letzten Bild stehen zu bleiben.
(function(){ var J=M.CHARS.springer.anims.jump;
  function hold(){ var A=M.ACT; if (!A) return; for (var k in A){ var a=A[k]; if (a && a.ch==='springer' && a.mode==='anim' && a.anim===J) a.hold=true; } }
  J.forEach(function(fr){ var ms=fr[1]; Object.defineProperty(fr,1,{get:function(){ hold(); return ms; },enumerable:true,configurable:true}); }); })();

// alle post()-Haken mit vollständiger Pose aufrufen
['davor','lena','jela','zdravko','kolar','bato','mate','springer'].forEach(function(id){
  var ch=M.CHARS[id], f=ch&&ch.post; if (!f) return; ch.post=function(b,p,X,Y,hx,hy){ f(b,full(ch,p,hx,hy),X,Y,hx,hy); }; });

// ---------------------------------------------------------------- Geisterfarben (wie 03_cast.js): welche Kleidungsfarbe in welche Geisterfarbe geht, damit man sie erkennt.
// Augen dunkel (k0 -> k1), Haut über die vorhandene Hautrampe (p/q werden nicht überschrieben).
M.GHOST_OVR.bato={ k0:'k1', g0:'k2', g1:'e0', g2:'e1', g3:'e2', c0:'c0', c1:'c1', c2:'c2', c3:'c3', m1:'m1', m2:'m2', s5:'s5', s6:'s6', w1:'m0', y2:'y3', y3:'y4', y4:'y5', y5:'l0', l0:'l1' };
M.GHOST_OVR.mate={ k0:'k1', m0:'m0', m1:'m1', m2:'m2', m3:'m3', m4:'m4', s5:'s5', s6:'s6', w1:'m0', r1:'d1', r2:'d2', r3:'d3', y2:'e1', y3:'e4', y4:'s5' };
M.GHOST_OVR.springer={ k0:'k1', n0:'k2', n1:'c0', n2:'c1', h1:'m0', h2:'m1', m2:'m3' };
if (M.PORTRAIT_GHOSTS){ M.PORTRAIT_GHOSTS.bato=true; M.PORTRAIT_GHOSTS.mate=true; }

// ---------------------------------------------------------------- Kontaktbild der neuen Animationen (wann die Handlung „passiert“, für npc.anim(name,hook)); vorhandene bleiben
(function(){ var c={ key:3, hand:2, pole:2, listen:2, wrap:1, point:2, jump:2 };
  Object.keys(c).forEach(function(k){ if (M.CONTACT[k]===undefined) M.CONTACT[k]=c[k]; }); })();

// ---------------------------------------------------------------- Farben der gesprochenen Sätze
(function(){ var c={ davor:P.s4, lena:P.d5, jela:P.m4, zdravko:P.a6, kolar:P.a6, bato:P.v4, mate:P.v5, springer:P.v4 };
  Object.keys(c).forEach(function(k){ if (M.CAST_COLORS[k]===undefined) M.CAST_COLORS[k]=c[k]; }); })();

})(M);
