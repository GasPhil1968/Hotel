/* ===== 14_k4_cast_b.js — Besetzung Kapitel 4 (München, Weihnachten bis Neujahr 2011), zweite Hälfte: das Haus am Bavariapark
   (Frau Ertl, Herr Kraus, Kevin, Alois Lechner, die Pflegerin, der Empfang) und die Geister Hansi, Sepp und Gerda =====
   Vorgaben: game/CAST4.md (IDs und Animationsnamen fest), KAPITEL4_KONZEPT.md 4.6, 5.4/5.5, 7.1/7.2. Format wie 14_k3_cast_b.js und
   14_k3_cast.js; Legende der Kopf-Stempel ebenda (k Umriss · H h j Haar · S s t Haut · e Auge · m Mund · b Bart · c C Mütze/Tuch ·
   g Brille · w Weiß · r Akzent), dazu je Figur eigene Zeichen.
   Dinge in der Hand über M.HELD mit dem Vorsatz k4a_: Gerdas Thermoskanne k4a_thermos, Sepps Pappkoffer k4a_case; alles Weitere trägt
   den Namen der Figur (k4a_krausKey …), damit nichts mit 14_k4_cast.js zusammenstößt. Was eine Figur sonst bei sich hat
   (Schlüsselbund, Wechselgeldtasche, Handtasche, Klemmbrett), zeichnet post() mit eigenen Posenfeldern.
   Sitzende sitzen in der allgemeinen Sitzhöhe (Hüfte 13 px über dem Boden), Tische und Theke bei etwa 20 px; Sitzmöbel, Theke und
   Bettgestell malt der Raum. Geister sind in natürlichen Farben gemalt, das Spiel färbt sie über M.ghostLut ein; die Ausnahmen
   (Kleidung bleibt erkennbar, Gerdas Kanne bleibt grün) stehen unten in M.GHOST_OVR.
   Sprechhaltungen: Jede Figur mit Requisit oder Sitz hat eine Animation 'talk', die sich nach der Ruhehaltung der Figur richtet (Kanne
   im Arm, im Bett, sitzend …). Räume setzen dafür beim Aktor talk:'talk' (sonst nimmt die Engine die stehende Gesprächshaltung). */
(function(M){
'use strict';
var P=M.P, T=M.T, S=M.poseS, F=M.poseF, H=M.HELD, A=M.ANIMS;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// Kopfvarianten wie M.headSet, dazu 'l'/'r' (Blick nach links/rechts: Augen einen Pixel versetzt)
function eyes(rows,d){ return rows.map(function(r){ var a=r.split(''), o=a.slice(); for (var i=0;i<a.length;i++){ if (a[i]!=='e') continue; var j=i+d; if (a[j] && 'Sst'.indexOf(a[j])>=0 && a[j-d*2]!=='e'){ o[i]=a[j]; o[j]='e'; } } return o.join(''); }); }
function HS(rows,skin){ var s=M.headSet(rows,skin); s.l=eyes(rows,-1); s.r=eyes(rows,1); return s; }
// Blick nach oben: das Auge rückt einen Pixel hoch, wo darüber Haut ist
function up(rows){ var o=rows.map(function(r){ return r.split(''); }); for (var y=1;y<rows.length;y++) for (var x=0;x<rows[y].length;x++){ if (rows[y][x]!=='e') continue; var a=rows[y-1][x]; if (a && 'Sst'.indexOf(a)>=0){ o[y-1][x]='e'; o[y][x]=a; } } return o.map(function(a){ return a.join(''); }); }
function rep(rows,a,b){ return rows.map(function(r){ return r.split(a).join(b); }); }
// Pose mit festen Grundwerten
function pose(base,v){ return function(o){ var p={}, k; for (k in base) p[k]=base[k]; if (o) for (k in o) p[k]=o[k]; return v==='S'||!v?S(p):F(p,v); }; }
// Sitzen: Hüfte immer auf Sitzhöhe der Räume (wie M.ANIMS.sit), unabhängig von der Beinlänge der Figur
function sitter(hipY,o0){ var y=-13+((hipY||23)-23), b={h:[0,y],nf:[9,0,'f'],ff:[7,0,'f'],sit:1}, k; if (o0) for (k in o0) b[k]=o0[k]; return pose(b,'S'); }
// Bildfolge aus [Pose, ms]-Paaren
function seq(){ return Array.prototype.slice.call(arguments); }
// eine Folge mit festen Zusatzwerten in jeder Pose (z. B. ein Requisit in allen Bildern)
function withAll(sq,o){ return sq.map(function(fr){ return [Object.assign({},fr[0],o),fr[1]]; }); }

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
// nahen bzw. fernen Arm (Seitenansicht) oder einen Arm (vorn/hinten: -1 links, 1 rechts im Bild) noch einmal zeichnen: liegt dann über dem, was darunter steckt
function armS(b,ch,p,OX,OY,hx,hy){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; };
  limb(b,o(g.shN),o(g.eN),ch.armR?ch.armR[0]:1.3,C.sleeve); limb(b,o(g.eN),o(g.nh),ch.armR?ch.armR[1]:1.0,C.arm||C.sleeve); hand(b,OX+g.nh[0]-0.5,OY+g.nh[1]-0.5,C.hand); }
function armSF(b,ch,p,OX,OY,hx,hy,foreOnly){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; };
  if (!foreOnly) limb(b,o(g.shF),o(g.eF),ch.armR?ch.armR[0]:1.3,C.sleeveF); limb(b,o(g.eF),o(g.fh),ch.armR?ch.armR[1]:1.0,C.armF||C.sleeveF); hand(b,OX+g.fh[0]-0.5,OY+g.fh[1]-0.5,C.handF); }
function armF(b,ch,p,OX,OY,hx,hy,side){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; }, s=side<0?g.sL:g.sR, e=side<0?g.eL:g.eR, h=side<0?g.lh:g.rh;
  limb(b,o(s),o(e),ch.armR?ch.armR[0]+0.1:1.4,C.sleeve); limb(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,C.arm||C.sleeve); hand(b,OX+h[0]-0.5,OY+h[1]-0.5,C.hand); }
// post() bekommt die Pose mit den Grundwerten des Rigs ergänzt (Hände, Füße), auch wenn ein Skript eine knappe Pose einfriert
function full(ch,p,hx,hy){ var q={}, k; for (k in p) q[k]=p[k];
  if (p.v==='S'){ if (!q.nh) q.nh=[hx,hy+2]; if (!q.fh) q.fh=[hx-2,hy+2]; if (!q.nf) q.nf=[0,0,'f']; if (!q.ff) q.ff=[0,0,'f']; }
  else { var sw=ch.shoulder; if (!q.lh) q.lh=[hx-sw-2,hy+2]; if (!q.rh) q.rh=[hx+sw+2,hy+2]; if (!q.lf) q.lf=[-3,0]; if (!q.rf) q.rf=[3,0]; } return q; }
// Beine wie im Rig: Hüfte, Knie, Knöchel (S: nah/fern; F/B: links/rechts im Bild)
function legS(ch,p,hx,hy,near){ var bn=ch.bones, f=(near?p.nf:p.ff)||[0,0,'f'], hip=near?[hx+1,hy-1]:[hx-1,hy-1], ank=[f[0],f[1]-2]; return {hip:hip,kn:ik(hip[0],hip[1],ank[0],ank[1],bn[0],bn[1],-1),ank:ank}; }
function legF(p,hx,hy,side){ var f=(side<0?p.lf:p.rf)||[side*3,0], hip=[hx+side*2,hy-1], ank=[f[0],f[1]-2], mid=[(hip[0]+ank[0])/2+side*0.4,(hip[1]+ank[1])/2]; if (p.sit) mid=[hip[0]+side*0.5,hy+1]; return {hip:hip,kn:mid,ank:ank}; }
// Pixel nur setzen, wo schon eine bestimmte Farbe liegt (Muster auf dem Stoff, Gürtel über dem Mantel)
function onCol(b,x,y,cols,c){ if (cols.indexOf(b.get(x,y))>=0) b.px(x,y,c); }
// Linie, die nur auf bestimmten Farben liegt
function lineOn(b,x0,y0,x1,y1,cols,c){ x0=Math.round(x0); y0=Math.round(y0); x1=Math.round(x1); y1=Math.round(y1); var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
  for (var i=0;i<=n;i++) onCol(b,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),cols,c); }
// nur dort zeichnen, wo noch nichts liegt: Dinge, die hinter dem Körper hängen
function behind(b,fn){ var t=new M.Buf(b.w,b.h,T); fn(t); for (var i=0;i<t.d.length;i++) if (t.d[i]!==T && b.d[i]===T) b.d[i]=t.d[i]; }
// ein Rumpfbild (ch.tF, ch.tB, ch.tS) einmalig nachbemalen: fn(x,y,c,w,h) gibt die neue Farbe zurück (oder nichts)
function paintTorso(buf,fn){ for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var c=buf.d[y*buf.w+x]; if (c===T) continue; var n=fn(x,y,c,buf.w,buf.h); if (n!==undefined) buf.d[y*buf.w+x]=n; } }
// eigene Schuhe: Stempel wie SHOES in 02_rig.js (f flach, h Ferse, t Zehen, F vorn, B hinten)
function shoes(ch,st,leg){ var d={}; Object.keys(st).forEach(function(k){ d[k]=M.stamp(st[k],leg); }); ch.shoes=d; }
// Lage der Hand als ganze Pixel (oben links), wie hand() im Rig
function hpx(X,Y,q){ return [Math.round(X+q[0]-0.5),Math.round(Y+q[1]-0.5)]; }
// ausgestreckter Zeigefinger vor der nahen Hand (Seitenansicht)
function finger(b,X,Y,q,c){ var h=hpx(X,Y,q); b.px(h[0]+2,h[1],c[0]); b.px(h[0]+3,h[1],c[0]); b.px(h[0]+2,h[1]+1,c[1]); }

// ================================================================ DINGE IN DER HAND (Seitenansicht). x,y = Hand (oben links), vorn ist +x
// Gerdas Thermoskanne, grünes Blech aus den Sechzigern: Becherdeckel mit heller Kante, ein Metallring, der Körper mit Lichtkante.
// thermos(b,x,y) zeichnet sie mit der Mitte des Körpers bei (x,y) (3 px breit, 9 px hoch); die Hand legt post() darüber.
function thermos(b,x,y){ var c=[P.g4,P.g3,P.g2];
  b.px(x,y-5,P.g5); b.px(x+1,y-5,P.g4); b.px(x+2,y-5,P.g3);                       // Becherrand
  for (var i=0;i<3;i++) b.px(x+i,y-4,c[i]);                                          // Becher
  b.px(x,y-3,P.m4); b.px(x+1,y-3,P.m3); b.px(x+2,y-3,P.m2);                         // Ring
  for (var yy=y-2;yy<=y+2;yy++) for (var j=0;j<3;j++) b.px(x+j,yy,c[j]);
  b.px(x,y-2,P.g5); b.px(x,y-1,P.g5);                                                // Glanz
  b.px(x,y+3,P.g2); b.px(x+1,y+3,P.g2); b.px(x+2,y+3,P.g1); }
// liegend (beim Hinreichen, quer in beiden Händen): Becher vorn
function thermosLying(b,x,y){ var r=[P.g4,P.g3,P.g2];
  for (var xx=x;xx<=x+5;xx++) for (var j=0;j<3;j++) b.px(xx,y+j,r[j]); b.px(x+1,y,P.g5); b.px(x+2,y,P.g5);
  b.px(x+6,y,P.m4); b.px(x+6,y+1,P.m3); b.px(x+6,y+2,P.m2); b.px(x+7,y,P.g5); b.px(x+7,y+1,P.g4); b.px(x+7,y+2,P.g3); b.px(x+8,y,P.g4); b.px(x+8,y+1,P.g4); b.px(x+8,y+2,P.g3);
  b.px(x-1,y,P.g2); b.px(x-1,y+1,P.g2); b.px(x-1,y+2,P.g1); }
// in der Hand (einhändig, am Körper der Kanne gegriffen): die Kanne steht vor der Hand
H.k4a_thermos=function(b,x,y){ thermos(b,x+2,y+1); };
// Sepps Pappkoffer mit Schnur: hängt am Griff in der Hand (breite Seite zum Betrachter), Ecken dunkler, die Schnur über Kreuz
function kase(b,x,y){ var x0=x-4, x1=x+5, y0=y+2, y1=y+8;
  b.px(x,y+1,P.w1); b.px(x+1,y+1,P.w1); b.px(x-1,y+2,P.w1); b.px(x+2,y+2,P.w1);                      // Griff
  for (var yy=y0;yy<=y1;yy++) for (var xx=x0;xx<=x1;xx++){ var c=P.w3; if (yy===y0) c=P.w4; else if (yy===y1) c=P.w2; else if (xx===x0) c=P.w4; else if (xx===x1) c=P.w2; b.px(xx,yy,c); }
  b.px(x0,y0,P.w2); b.px(x1,y0,P.w2); b.px(x0,y1,P.w1); b.px(x1,y1,P.w1);                              // Kappen an den Ecken
  b.px(x0+1,y0+1,P.w5); b.px(x0+2,y0+1,P.w4);
  for (var y2=y0;y2<=y1;y2++) b.px(x+2,y2,y2===y0?P.s6:P.s5);                                          // Schnur senkrecht
  for (var x2=x0;x2<=x1;x2++) b.px(x2,y0+3,x2===x0?P.s5:(x2===x1?P.s3:P.s4)); b.px(x+2,y0+3,P.s6); }  // und quer, mit Knoten
H.k4a_case=function(b,x,y){ kase(b,x,y); };
// Koffer hochkant als Sitz (sitCase): breite Seite zum Betrachter, 10 × 12 px, unter der Hüfte
function kaseSeat(b,x,y){ var x0=x, x1=x+10, y0=y-12, y1=y-1;
  for (var yy=y0;yy<=y1;yy++) for (var xx=x0;xx<=x1;xx++){ var c=P.w3; if (yy===y0) c=P.w4; else if (yy===y1) c=P.w1; else if (xx===x0) c=P.w4; else if (xx===x1) c=P.w2; b.px(xx,yy,c); }
  b.px(x0,y0,P.w2); b.px(x1,y0,P.w2); b.px(x0,y1,P.w1); b.px(x1,y1,P.w1);
  for (var y2=y0;y2<=y1;y2++) b.px(x0+4,y2,P.s5); for (var x2=x0;x2<=x1;x2++) b.px(x2,y0+5,P.s4); b.px(x0+4,y0+5,P.s6); b.hl(x0+7,x0+8,y0+2,P.w1); }

// ================================================================ LEBENDE IM HEIM

// ---------------------------------------------------------------- FRAU ERTL (52), Pflegedienstleitung: groß, kurzes blondgraues Haar, randlose Brille, schmale Lippen;
// weißer Kasack, darüber eine offene dunkelrote Strickjacke, weiße Hose, weiße Schuhe, Klemmbrett. Bestimmt, müde, menschlich.
var erS=[
"............",
"....kkkkk...",
"...khjhjhk..",
"..khhjhhjhk.",
".khhhhhhhhhk",
".kHhhhhhhSSk",
".kHhhhtGSegk",
".kHhhtSSSSSSk",
"..kHtSSSSSSk",
"..kktSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var erF=[
"...kkkkk...",
"..khjhjhk..",
".khhjhhjhk.",
"khhhhhhhhhk",
"khhhSSSShhk",
"khSSSSSSShk",
"kHgeSSSegHk",
"khSSSStSShk",
"kkSSSSSSSkk",
".kktSmStkk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var erB=[
"...kkkkk...",
"..khjhjhk..",
".khhjhhjhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhjhhhhhk",
"kHhhhhhhhHk",
"kHHhhhhhHHk",
".kHHhhhHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
// Klemmbrett: braune Platte, weißes Blatt, Metallklammer; schräg vor der Brust gehalten (Seitenansicht), flach auf dem Tisch ('cbT')
function clipboard(b,x,y){ b.hl(x,x+5,y+1,P.w2); b.hl(x,x+5,y,P.s6); b.hl(x+1,x+4,y-1,P.s5); b.px(x+5,y-1,P.s6); b.px(x+1,y,P.s4); b.px(x+3,y,P.s4); b.px(x,y-1,P.m4); b.px(x,y-2,P.m3); b.px(x+6,y+1,P.w1); }
function clipboardFlat(b,x,y){ b.hl(x,x+6,y,P.s6); b.hl(x,x+6,y+1,P.w2); b.px(x+1,y,P.m4); b.px(x+3,y,P.s4); b.px(x+5,y,P.s4); }
H.k4a_ertlPen=function(b,x,y){ b.px(x+2,y-1,P.n2); b.px(x+3,y-2,P.n2); b.px(x+2,y,P.k1); };
var erP=pose({},'S'), erSit=sitter(24,{ln:1,nf:[11,0,'f'],ff:[9,0,'f']}), CARD=[P.r2,P.r3,P.r1];
var ertl=M.defineChar('ertl',{
  legend:L({H:P.e3,h:P.e4,j:P.s4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,g:P.b5,G:P.m4}),
  heads:{S:HS(erS),F:HS(erF),B:{n:erB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:14,col:CARD,open:P.s6,side:7}, torsoS:{vneck:P.s6},
  coat:{c:CARD,hem:4,w:5},
  bones:[12,11,9,8], hipY:24, shoulder:5, armR:[1.3,1.0],
  cols:{trou:[P.s5,P.s6,P.s4],trouF:[P.s4,P.s5,P.s3],sleeve:CARD,sleeveF:[P.r1,P.r2,P.r0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s5},
  // weißer Kasack in der offenen Strickjacke (seitlich ein Streifen vorn), Klemmbrett ('cb' vor der Brust in der fernen Hand, 'cbT' flach auf dem Tisch)
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.ertl, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='S'){ for (var y=t+1;y<Y+hy+(p.sit?0:3);y++){ var sx=Math.round(g.shx*(Y+hy-y)/(ch.tLen-1)); onCol(b,X+hx+ch.tS.w-ch.tHipS-1+sx,y,CARD,P.s6); onCol(b,X+hx+ch.tS.w-ch.tHipS-2+sx,y,CARD,P.s5); }
      if (p.cbT) clipboardFlat(b,X+hx+10,Y-21);
      if (p.cb){ var f=hpx(X,Y,p.fh); clipboard(b,f[0]-1,f[1]-1); armS(b,ch,p,X,Y,hx,hy); if (p.it&&H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); } }
    else if (p.v==='F' && p.cb){ b.rect(X+hx-3,Y+hy-10,7,8,P.w2); b.rect(X+hx-2,Y+hy-10,5,7,P.s6); b.hl(X+hx-1,X+hx+1,Y+hy-11,P.m4); b.hl(X+hx-1,X+hx+1,Y+hy-8,P.s4); b.hl(X+hx-1,X+hx+1,Y+hy-6,P.s4); } },
  anims:{
    // schreibt im Stehen auf dem Klemmbrett, den Kopf gesenkt; sieht zwischendurch auf, prüfend
    write:(function(){ var W=function(o){ return erP(Object.assign({ln:1,cb:1,fh:[5,-28],nh:[7,-29],it:'k4a_ertlPen',ho:[1,1]},o||{})); };
      return seq([erP({}),80],[W({nh:[6,-27],it:null,ho:[0,0]}),140],[W({}),320],[W({nh:[8,-29]}),260],[W({nh:[7,-30]}),240],[W({nh:[9,-29]}),300],[W({nh:[8,-30],hd:'b'}),130],
        [W({nh:[9,-29]}),280],[W({nh:[7,-29]}),260],[W({ho:[1,0]}),300],[W({ho:[0,0]}),1100],[W({ho:[0,0],hd:'b'}),110],[W({ho:[0,0]}),600],[W({}),260],[W({nh:[8,-29]}),260],[W({nh:[9,-30]}),300],[W({nh:[8,-29]}),400]); })(),
    // verschränkt die Arme (das Klemmbrett unter dem Arm), ein kleines Nicken, verlagert das Gewicht
    arms:(function(){ var R=function(o){ return erP(Object.assign({nh:[4,-29],fh:[4,-28]},o||{})); };
      return seq([erP({}),80],[erP({nh:[4,-26],fh:[3,-25]}),120],[R({}),1500],[R({hd:'b'}),110],[R({}),900],[R({ho:[0,1]}),260],[R({}),700],[R({h:[1,-23],nf:[2,0,'f']}),1300],[R({h:[1,-23],nf:[2,0,'f'],hd:'b'}),110],[R({h:[1,-23],nf:[2,0,'f'],ho:[1,0]}),900],[R({}),800]); })(),
    // sitzt am Tisch im Gemeinschaftsraum, die Unterarme auf der Platte, das Klemmbrett vor sich; tippt mit dem Stift, sieht auf
    sit:(function(){ var Q=function(o){ return erSit(Object.assign({cbT:1,nh:[10,-20],fh:[9,-20],ho:[1,1]},o||{})); };
      return seq([Q({}),1500],[Q({hd:'b'}),110],[Q({}),900],[Q({nh:[12,-21],it:'k4a_ertlPen'}),300],[Q({nh:[13,-21],it:'k4a_ertlPen'}),260],[Q({nh:[12,-21],it:'k4a_ertlPen'}),300],[Q({nh:[14,-21],it:'k4a_ertlPen'}),400],
        [Q({ho:[0,0],nh:[11,-21],it:'k4a_ertlPen'}),1300],[Q({ho:[0,0],nh:[11,-21],it:'k4a_ertlPen',hd:'b'}),110],[Q({ho:[0,0],nh:[11,-21],it:'k4a_ertlPen'}),700],[Q({}),900]); })(),
    sitTalk:seq([erSit({cbT:1,nh:[10,-20],fh:[9,-20],hd:'o'}),140],[erSit({cbT:1,nh:[12,-24],fh:[9,-20]}),140],[erSit({cbT:1,nh:[12,-24],fh:[9,-20],hd:'o'}),140],[erSit({cbT:1,nh:[10,-20],fh:[9,-20]}),170]),
    // spricht im Stehen, das Klemmbrett in der fernen Hand vor der Brust
    talk:seq([erP({cb:1,fh:[5,-27],hd:'o'}),140],[erP({cb:1,fh:[5,-27],nh:[6,-27]}),130],[erP({cb:1,fh:[5,-27],nh:[7,-28],hd:'o'}),140],[erP({cb:1,fh:[5,-27]}),170]) }
});

// ---------------------------------------------------------------- HERR KRAUS (61), Hausmeister: untersetzt, grauer Stoppelbart, die Brille auf der Stirn; graublauer
// Hausmeisterkittel, großer Schlüsselbund am Gürtel, Arbeitsschuhe. Brummig.
var krS=[
"............",
"....kkkkk...",
"...khjhhhk..",
"..khhhhhhhk.",
".khhhhggGgk.",
".khhhhhSSSSk",
".khhhtSSSeSk",
".khhtSSSSSSrk",
"..ktSbSSSSSk",
"..ktbSbbbmk.",
"...kbbbbbk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var krF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khgGgggGghk",
"khSSSSSSShk",
"khSSSSSSShk",
"khSeSSSeShk",
"ktSSSrSSStk",
"kbSbSSSbSbk",
".kbbbmbbbk.",
"..kbbbbbk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var krB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"kghhhhhhhgk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhjhhhhk",
"kthhhhhhhtk",
".khhhhhhhk.",
".ktttttttk.",
"..kbtttbk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
// Schlüsselbund: Ring und Schlüssel (am Gürtel oder in der Hand); kt: ein Schlüssel gedreht
function keyBunch(b,x,y,kt){ b.px(x,y,P.m4); b.px(x+1,y,P.m3); b.px(x-1,y+1,P.m3); b.px(x+2,y+1,P.m4); b.px(x,y+2,P.m3); b.px(x+1,y+2,P.m2);
  b.px(x-1,y+3,P.y3); b.px(x-1,y+4,P.y2); b.px(x+1,y+3,P.m4); b.px(x+1,y+4,P.m4); b.px(x+1,y+5,P.m3); b.px(x+2,y+3,P.y4); b.px(x+3,y+4,P.y3); b.px(x,y+3,P.m2); b.px(x,y+4,P.m3); }
// Schlüssel im Bedienfeld (die Hand liegt davor), der Bund hängt darunter; B: einmal gedreht
H.k4a_krausKey=function(b,x,y){ b.px(x+2,y,P.m4); b.px(x+3,y,P.m3); keyBunch(b,x+1,y+2); };
H.k4a_krausKeyB=function(b,x,y){ b.px(x+2,y-1,P.m4); b.px(x+2,y,P.m4); b.px(x+3,y,P.m3); keyBunch(b,x,y+2); };
// Schraubenzieher (gelber Griff, Stahlklinge nach vorn); B: der Griff halb gedreht
H.k4a_krausDriver=function(b,x,y){ b.px(x,y+2,P.y3); b.px(x+1,y+2,P.y2); b.hl(x+2,x+5,y+1,P.m4); b.px(x+6,y+1,P.m3); };
H.k4a_krausDriverB=function(b,x,y){ b.px(x,y+2,P.y2); b.px(x+1,y+2,P.y4); b.hl(x+2,x+5,y+1,P.m4); b.px(x+4,y+1,P.s6); b.px(x+6,y+1,P.m3); };
var krP=pose({},'S'), KIT=[P.c3,P.c4,P.c2];
var kraus=M.defineChar('kraus',{
  legend:L({H:P.m2,h:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.m3,g:P.k2,G:P.b4,r:P.d4}),
  heads:{S:HS(krS),F:HS(krF),B:{n:krB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:12,col:KIT,collar:[P.c2,P.c1],buttons:P.c1,side:12,belly:1}, torsoS:{collar:[P.c2,P.c1]}, tHipS:6,
  coat:{c:KIT,hem:9,w:7},
  bones:[10,10,8,7], hipY:21, shoulder:6, armR:[1.5,1.2], legR:[1.9,1.5],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:KIT,sleeveF:[P.c2,P.c3,P.c1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Brusttasche mit Bleistift, Schlüsselbund am Gürtel (nicht, solange er ihn in der Hand hat: 'kh')
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kraus, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='S'){ var px0=X+hx+3+g.shx; onCol(b,px0,t+4,KIT,P.c2); onCol(b,px0+1,t+4,KIT,P.c2); b.px(px0+1,t+3,P.y3); b.px(px0+1,t+2,P.k2);
      if (!p.kh) keyBunch(b,X+hx+2,Y+hy-2);
      if (p.it) armS(b,ch,p,X,Y,hx,hy); if (p.it&&H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); }
    else if (p.v==='F'){ onCol(b,X+hx+2,t+4,KIT,P.c2); onCol(b,X+hx+3,t+4,KIT,P.c2); onCol(b,X+hx+4,t+4,KIT,P.c2); b.px(X+hx+3,t+3,P.y3); if (!p.kh) keyBunch(b,X+hx+5,Y+hy-2); }
    else if (!p.kh) keyBunch(b,X+hx-6,Y+hy-2); },
  anims:{
    // dreht einen Schlüssel im Bedienfeld an der Wand (Augenhöhe, vor ihm): Bund vom Gürtel, Schlüssel hinein, drehen, warten, zurück
    key:seq([krP({}),80],[krP({nh:[3,-24],kh:1,it:'k4a_krausKey'}),160],[krP({nh:[7,-33],kh:1,it:'k4a_krausKey',ho:[0,-1]}),160],[krP({nh:[10,-38],kh:1,it:'k4a_krausKey',ln:1,ho:[1,0]}),500],
      [krP({nh:[10,-38],kh:1,it:'k4a_krausKeyB',ln:1,ho:[1,0]}),300],[krP({nh:[10,-38],kh:1,it:'k4a_krausKeyB',ln:1,ho:[1,0],hd:'b'}),110],[krP({nh:[10,-38],kh:1,it:'k4a_krausKeyB',ln:1,ho:[1,0]}),900],
      [krP({nh:[10,-38],kh:1,it:'k4a_krausKey',ln:1,ho:[1,0]}),300],[krP({nh:[7,-33],kh:1,it:'k4a_krausKey'}),160],[krP({nh:[3,-24],kh:1,it:'k4a_krausKey'}),160],[krP({}),300]),
    // schraubt mit dem Schraubenzieher (vor der Brust), die andere Hand hält fest; schnauft
    fix:(function(){ var X0=function(o){ return krP(Object.assign({ln:2,ho:[1,1],nh:[10,-27],fh:[12,-26],it:'k4a_krausDriver'},o||{})); };
      return seq([krP({}),80],[X0({nh:[7,-26]}),140],[X0({}),260],[X0({it:'k4a_krausDriverB',nh:[10,-28]}),240],[X0({}),240],[X0({it:'k4a_krausDriverB',nh:[10,-28]}),240],[X0({}),240],[X0({it:'k4a_krausDriverB',nh:[10,-28],hd:'b'}),240],
        [X0({}),400],[X0({ho:[1,0],hd:'o'}),220],[X0({}),300],[X0({it:'k4a_krausDriverB',nh:[10,-28]}),240],[X0({}),240],[X0({it:'k4a_krausDriverB',nh:[10,-28]}),240],[X0({}),600]); })(),
    // zuckt mit den Schultern: der Kopf zieht sich ein, die Hände öffnen sich nach außen
    shrug:seq([krP({}),80],[krP({nh:[5,-22],fh:[-2,-22],ho:[0,1]}),140],[krP({nh:[8,-25],fh:[-4,-25],ho:[0,2],hd:'b'}),220],[krP({nh:[8,-25],fh:[-4,-25],ho:[0,2]}),700],[krP({nh:[7,-24],fh:[-3,-24],ho:[0,1],hd:'o'}),200],[krP({nh:[5,-22],fh:[-2,-22],ho:[0,1]}),150],[krP({}),300]) }
});

// ---------------------------------------------------------------- KEVIN (26), Pfleger: groß, kräftig, kurzes dunkles Haar mit Gel, ein Ohrstecker; hellgrüner Kasack mit
// Namensschild, weiße Hose, weiße Turnschuhe. Freundlich, praktisch.
var kvS=[
"............",
"...k.k.k....",
"...kjkjkkk..",
"..kHjHjHhHk.",
"..kHHHHHHHHk",
".kHHHHHHHSSk",
".kHHHHtSSeSk",
".kHHHtSSSSSSk",
"..kHtrSSSSSk",
"..kktSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var kvF=[
"..k.k.k.k..",
"..kjkjkjk..",
".kHHjHjHHk.",
"kHHHHHHHHHk",
"kHSSSSSSSHk",
"kSSSSSSSSSk",
"kSSeSSSeSSk",
"ktSSStSSStk",
"rkSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var kvB=[
"..k.k.k.k..",
"..kjkjkjk..",
".kHHjHjHHk.",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHkr",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
// Brezel (braun, Salzkörner): ganz und angebissen
H.k4a_kevinBrezel=function(b,x,y){ b.px(x+1,y-2,P.w3); b.px(x+3,y-2,P.w3); b.px(x+2,y-1,P.w4); b.px(x+1,y-1,P.w2); b.px(x+3,y-1,P.w2); b.hl(x+1,x+3,y,P.w3); b.px(x+4,y-1,P.w3); b.px(x+2,y-2,P.s6); b.px(x+4,y-2,P.s5); };
H.k4a_kevinBrezelB=function(b,x,y){ b.px(x+1,y-2,P.w3); b.px(x+2,y-1,P.w4); b.px(x+1,y-1,P.w2); b.hl(x+1,x+2,y,P.w3); b.px(x+2,y-2,P.s6); };
// Wäschewagen (Metallrahmen, Wäschesack, Rollen); x0 = Griff (Hände), dx: der Wagen rollt ein wenig
function cart(b,X,Y,x0,dx){ var x=X+x0+dx, y=Y;
  b.vl(x,y-27,y-3,P.m3); b.hl(x-2,x,y-27,P.m4); b.px(x-2,y-26,P.m2);                         // Schiebebügel
  b.hl(x,x+13,y-24,P.m4); b.vl(x+13,y-24,y-3,P.m3); b.hl(x,x+13,y-4,P.m2);                       // Rahmen
  for (var yy=y-23;yy<=y-6;yy++) for (var xx=x+1;xx<=x+12;xx++){ var bul=(yy>y-12)?((xx===x+1||xx===x+12)?1:0):0; var c=(xx<x+4)?P.s6:(xx>x+9?P.s4:P.s5); if (bul) c=P.s4; if (yy===y-6) c=P.s3; b.px(xx,yy,c); }
  b.hl(x+1,x+12,y-23,P.b3); b.hl(x+2,x+11,y-22,P.b4); b.px(x+6,y-20,P.s4); b.px(x+7,y-19,P.s4); b.px(x+4,y-15,P.s4); b.px(x+9,y-13,P.s3);   // Sack mit blauem Saum und Falten
  [x+1,x+12].forEach(function(cx){ b.px(cx,y-2,P.k2); b.px(cx+1,y-2,P.m1); b.px(cx,y-1,P.m1); b.px(cx+1,y-1,P.k2); }); }
// nur der Griff (wenn der Raum den Wagen malt): Bügel und ein Stück Rahmen
function cartHandle(b,X,Y,x0){ var x=X+x0; b.vl(x,Y-27,Y-20,P.m3); b.hl(x-2,x,Y-27,P.m4); b.px(x-2,Y-26,P.m2); b.hl(x,x+3,Y-24,P.m4); }
var kvP=pose({},'S'), kvSit=sitter(24,{ln:1,nf:[11,0,'f'],ff:[9,0,'f']}), KAS=[P.a6,P.a6,P.a5];
var kevin=M.defineChar('kevin',{
  legend:L({H:P.h1,h:P.h2,j:P.h3,S:P.p4,s:P.p3,t:P.p2,m:P.p1,r:P.l1}),
  heads:{S:HS(kvS),F:HS(kvF),B:{n:kvB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:13,len:14,col:KAS,vneck:P.p3,side:9}, torsoS:{vneck:P.p3},
  bones:[12,11,9,8], hipY:24, shoulder:6, armR:[1.5,1.2], legR:[1.8,1.4],
  cols:{trou:[P.s5,P.s6,P.s4],trouF:[P.s4,P.s5,P.s3],sleeve:KAS,sleeveF:[P.a5,P.a6,P.a4],arm:[P.p4,P.p5,P.p3],armF:[P.p3,P.p4,P.p2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s5},
  // Namensschild, kurze Ärmel (Saum am Oberarm), Brusttasche; Wäschewagen ('ct': ganz, 'ch': nur der Griff), Zeigefinger ('fp')
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kevin, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.rect(X+hx+2,t+4,3,2,P.s6); b.px(X+hx+3,t+4,P.k2); onCol(b,X+hx-4,t+5,KAS,P.a5); onCol(b,X+hx-3,t+5,KAS,P.a5); }
    else if (p.v==='S'){ var nx=X+hx+3+g.shx; b.px(nx,t+4,P.s6); b.px(nx+1,t+4,P.s6); b.px(nx,t+5,P.k2);
      if (p.ct) cart(b,X,Y,Math.round(p.nh[0])+2,p.ct-1); if (p.ch) cartHandle(b,X,Y,Math.round(p.nh[0])+2);
      if (p.ct||p.ch) armS(b,ch,p,X,Y,hx,hy);
      if (p.fp) finger(b,X,Y,p.nh,[P.p4,P.p3]); } },
  anims:{
    // schiebt den Wäschewagen: lehnt sich hinein, der Wagen ruckt, ein Blick den Flur entlang
    push:(function(){ var C=function(o){ return kvP(Object.assign({ct:1,ln:2,nh:[10,-27],fh:[9,-27],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0]},o||{})); };
      return seq([C({}),500],[C({ct:2,ln:3,nh:[11,-27],fh:[10,-27],h:[1,-23]}),260],[C({ct:3,ln:3,nh:[12,-27],fh:[11,-27],h:[2,-23],nf:[4,0,'f']}),300],[C({ct:2,ln:2}),260],[C({}),800],[C({hd:'b'}),110],
        [C({ho:[2,0],hd:'r'}),900],[C({}),600]); })(),
    // nur der Griff, wenn der Raum den Wagen malt
    pushH:seq([kvP({ch:1,ln:2,nh:[10,-27],fh:[9,-27],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0]}),1400],[kvP({ch:1,ln:3,nh:[11,-27],fh:[10,-27],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0],h:[1,-23]}),400],[kvP({ch:1,ln:2,nh:[10,-27],fh:[9,-27],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0],hd:'b'}),110]),
    // sitzt an der Theke und isst eine Brezel (Silvesternacht): abbeißen, kauen, die Brezel ablegen, aufsehen
    eat:(function(){ var E=function(o){ return kvSit(Object.assign({fh:[10,-21],nh:[9,-21],it:'k4a_kevinBrezel'},o||{})); };
      return seq([E({}),1200],[E({nh:[8,-26]}),140],[E({nh:[7,-29],ho:[1,0]}),300],[E({nh:[7,-29],ho:[1,0],hd:'o'}),160],[E({nh:[8,-26],it:'k4a_kevinBrezelB'}),160],[E({nh:[9,-21],it:'k4a_kevinBrezelB',hd:'o'}),200],
        [E({it:'k4a_kevinBrezelB'}),200],[E({it:'k4a_kevinBrezelB',hd:'o'}),200],[E({it:'k4a_kevinBrezelB'}),200],[E({it:'k4a_kevinBrezelB',hd:'o'}),200],[E({it:'k4a_kevinBrezelB'}),1200],[E({it:'k4a_kevinBrezelB',hd:'b'}),110],
        [E({it:'k4a_kevinBrezelB',ho:[1,-1]}),1000],[E({it:'k4a_kevinBrezelB'}),600]); })(),
    // zeigt den Flur hinunter: der Arm gestreckt, der Kopf folgt, die andere Hand in die Seite
    point:seq([kvP({}),80],[kvP({nh:[8,-30],fh:[-3,-20]}),120],[kvP({nh:[14,-34],fh:[-3,-20],fp:1,ho:[1,0]}),300],[kvP({nh:[14,-34],fh:[-3,-20],fp:1,ho:[1,0],hd:'o'}),200],[kvP({nh:[14,-34],fh:[-3,-20],fp:1,ho:[1,0]}),900],
      [kvP({nh:[14,-34],fh:[-3,-20],fp:1,ho:[1,0],hd:'b'}),110],[kvP({nh:[14,-34],fh:[-3,-20],fp:1,ho:[1,0],hd:'o'}),200],[kvP({nh:[8,-30],fh:[-3,-20]}),140],[kvP({}),300]),
    sitTalk:seq([kvSit({fh:[10,-21],nh:[9,-21],it:'k4a_kevinBrezelB',hd:'o'}),140],[kvSit({fh:[10,-21],nh:[10,-24],it:'k4a_kevinBrezelB'}),140],[kvSit({fh:[10,-21],nh:[10,-24],it:'k4a_kevinBrezelB',hd:'o'}),140],[kvSit({fh:[10,-21],nh:[9,-21],it:'k4a_kevinBrezelB'}),170]) }
});
ctxAnim(kevin,'talk',function(){ var acts=M.ACT||{}, id=''; for (var k in acts){ if (acts[k] && acts[k].ch==='kevin'){ id=acts[k].idle||''; break; } } return /eat|sit/.test(id)?kevin.anims.sitTalk:A.talkS; });

// ---------------------------------------------------------------- ALOIS LECHNER (89), Bewohner, früher Trambahnfahrer: groß, hager, gebeugt, große Ohren, große Hände; weißes Haar,
// nach hinten gekämmt, glatt rasiert, wässrige blaue Augen; beige Strickjacke über kariertem Hemd, Cordhose, braune Hausschuhe
var alS=[
"............",
"....kkkkk...",
"...khjjjhk..",
"..khjjjjhhk.",
"..khhhhhjjSk",
".khhhhhhSSSk",
".khhhhtSSSSk",
".khrrrtSSeSk",
".khrtrtSSSSSk",
".khrrrtSSSSk",
"..khrrtSSmk.",
"...ktSSSSSk.",
"....ktSSSSk.",
".....kkkkk..",
".....ktsk...",
".....ktsk..."];
var alF=[
"...kkkkk...",
"..khjjjhk..",
".khjjjjjhk.",
"khhhjjjhhhk",
"khSSSSSSShk",
"kSSSSSSSSSk",
"kSSeSSSeSSk",
"rSSSStSSSSr",
"rrtSSSSStrr",
"rkSSSmSSSkr",
".ktSSSSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var alB=[
"...kkkkk...",
"..khjjjhk..",
".khjjjjjhk.",
"khhjjjjjhhk",
"khhhjjjhhhk",
"khhhhjhhhhk",
"khhhhhhhhhk",
"rkhhhhhhhkr",
"rrhhhhhhhrr",
"rkhhhhhhhkr",
".khhhhhhhk.",
"..kthhhtk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var alHS=HS(alS,'t'); alHS.u=up(alS); alHS.uo=up(alHS.o);
var alHF=HS(alF,'t');
var aP=pose({ln:2,ho:[1,1]},'S'), aSit=sitter(24,{ln:2,ho:[1,1],nf:[12,0,'f'],ff:[10,0,'f']});
var CARDA=[P.s3,P.s4,P.s2], SHIRT=[P.b2,P.s5,P.b1];
var alois=M.defineChar('alois',{
  legend:L({h:P.s4,j:P.s5,H:P.s6,S:P.p4,s:P.p3,t:P.p2,m:P.p2,r:P.p3,e:P.n1}),
  heads:{S:alHS,F:alHF,B:{n:alB}}, neck:{S:[6,15],F:[5,14],B:[5,14]},
  torso:{w:11,len:13,col:CARDA,open:P.b2,side:7,hunch:1}, torsoS:{vneck:P.b2},
  coat:{c:CARDA,hem:3,w:5},
  bones:[12,11,9,8], hipY:24, shoulder:5, armR:[1.2,1.0], legR:[1.5,1.2],
  cols:{trou:[P.e2,P.e3,P.e1],trouF:[P.e1,P.e2,P.e0],sleeve:CARDA,sleeveF:[P.s2,P.s3,P.s1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w2},
  anims:{}
});
// Hausschuhe: flach, ohne Absatz, braun mit hellerem Rand
shoes(alois,{ f:['.kk..','kwwk.','kkkkk'], h:['.kk.k','kwwww','kkkk.'], t:['kk...','.kwk.','..kww','...kk'], F:['kwwk','kkkk'], B:['kwwk','kkkk'] },{k:P.k1,w:P.w2});
// Karohemd im Ausschnitt der Strickjacke (vorn), Knöpfe der Strickjacke, Ellbogen dünn
(function(){ var ch=alois;
  paintTorso(ch.tF,function(x,y,c,w){ var m=(w-1)/2, d=Math.abs(x-m); if (d<1.6 && y>0){ return ((x+y)%2)?P.s5:P.b2; } if (Math.abs(d-1.6)<0.6 && y>2 && y%3===0) return P.w3; });
  paintTorso(ch.tS,function(x,y,c,w){ if (x===w-1 && y<5) return (y%2)?P.s5:P.b2; if (x===w-2 && y>2 && y%3===0) return P.w3; }); })();

// ---- Alois im Pflegebett (Pose 'bed', Posenfeld bed:1): halb aufgerichtet, Rücken und Kopf im Kissen, die Beine unter der Decke.
// Fußpunkt (actorPos alois_bed) = die Füße unter der Decke am Fußende; die Matratze liegt in Sitzhöhe (13 px über dem Fußpunkt).
// Das Rig kann nicht liegen: bedFrame() leert das Bild und setzt die Figur neu zusammen (Kissen, ferner Arm, Rumpf schräg im
// Kissen, Kopf, Decke über den Beinen, die Hände auf der Decke oder um die Kanne). Das Bettgestell malt der Raum.
var BED={hx:-16,hy:-15,ln:-7,mat:-13};
function blitShear(b,src,x0,y0,lean){ for (var y=0;y<src.h;y++){ var sh=Math.round(lean*(src.h-1-y)/(src.h-1)); for (var x=0;x<src.w;x++){ var c=src.d[y*src.w+x]; if (c!==T) b.px(x0+x+sh,y0+y,c); } } }
function headBuf(ch,v,hd){ var key=v+(hd||'n'); if (!ch.stamps[key]){ var set=ch.heads[v]||ch.heads.S; ch.stamps[key]=M.stamp(set[hd||'n']||set.n,ch.legend); } return ch.stamps[key]; }
// zwei aufgeschüttelte Kissen: unten eines im Kreuz, darüber eines hinter Schultern und Kopf (gegen das Kopfteil, das der Raum malt)
function pillow(b,X,Y){
  var soft=function(x0,y0,x1,y1,lit){ b.poly([[x0+1,y0],[x1-1,y0],[x1,y0+1],[x1,y1-1],[x1-1,y1],[x0+1,y1],[x0,y1-1],[x0,y0+1]],function(x,y){ var u=(x-x0)/Math.max(1,x1-x0), v=(y-y0)/Math.max(1,y1-y0);
    var c=P.s5; if (u<0.4 && v<0.6) c=lit?P.s6:P.s5; if (u>0.8 || v>0.85) c=P.s4; return c; }); };
  soft(X-31,Y-22,X-21,Y-13,0); b.hl(X-30,X-23,Y-14,P.s4);
  soft(X-32,Y-42,X-23,Y-21,1); b.line(X-31,Y-40,X-28,Y-41,P.l1); b.vl(X-31,Y-38,Y-30,P.s6); b.line(X-30,Y-23,X-25,Y-22,P.s4); b.px(X-27,Y-31,P.s4); b.px(X-26,Y-30,P.s4); }
// Decke über den Beinen: liegt flach auf der Matratze, die Knie leicht angezogen, die Zehen heben sie am Fußende; hängt seitlich über die Matratze
function blanket(b,X,Y,kn){ var k=kn||0;
  var top=[[X-22,Y-19],[X-17,Y-19],[X-13,Y-20-k],[X-9,Y-21-k],[X-6,Y-19-k],[X-3,Y-18],[X-1,Y-19],[X+1,Y-18],[X+2,Y-16],[X+3,Y-13]];
  var pts=top.concat([[X+3,Y-10],[X-23,Y-10],[X-23,Y-18]]);
  b.poly(pts,function(x,y){ return y>=Y-13?(x>X+1?P.b2:P.b3):P.b4; });
  for (var i=0;i<top.length-1;i++) b.line(top[i][0],top[i][1],top[i+1][0],top[i+1][1],(i<4||i===6)?P.b5:P.b4);   // Lichtkante oben
  b.hl(X-22,X-17,Y-18,P.s6); b.hl(X-22,X-17,Y-17,P.s5); b.px(X-17,Y-17,P.s4);                                      // umgeschlagenes Laken an der Taille
  b.line(X-8,Y-19-k,X-5,Y-14,P.b3); b.line(X-14,Y-17,X-12,Y-14,P.b3); b.line(X-2,Y-16,X-1,Y-14,P.b3);              // Falten
  b.hl(X-22,X+2,Y-13,P.b3); b.line(X-20,Y-12,X-17,Y-11,P.b2); b.line(X-6,Y-12,X-3,Y-11,P.b2); b.hl(X-23,X+3,Y-10,P.b1); }
function bedFrame(b,p,X,Y){ var ch=M.CHARS.alois, C=ch.cols, bn=ch.bones, Ln=ch.tLen, hx=p.h[0], hy=p.h[1]-(ch.hipY-23), ln=p.ln||0, shx=Math.round(ln*(Ln-2)/(Ln-1));
  var o=function(q){ return [X+q[0],Y+q[1]]; }, shN=[hx+1+shx,hy-Ln+2], shF=[hx-1+shx,hy-Ln+2], nh=p.nh, fh=p.fh, rN=ch.armR[0], rF=ch.armR[1];
  b.d.fill(T);
  // Kissen hinter Rücken und Kopf; danach eine feine Schattenkante, wo der Körper davor liegt
  var pil=new M.Buf(b.w,b.h,T); pillow(pil,X,Y);
  // ferner Arm (hinter dem Rumpf), Rumpf schräg, Kopf
  var eF=ik(shF[0],shF[1],fh[0],fh[1],bn[2],bn[3],1), eN=ik(shN[0],shN[1],nh[0],nh[1],bn[2],bn[3],1);
  limb(b,o(shF),o(eF),rN,C.sleeveF); if (!p.fu){ limb(b,o(eF),o(fh),rF,C.sleeveF); hand(b,X+fh[0]-0.5,Y+fh[1]-0.5,C.handF); }
  blitShear(b,ch.tS,X+hx-ch.tHipS,Y+hy-Ln+1,ln);
  var hs=headBuf(ch,'S',p.hd), nk=ch.neck.S, ho=p.ho||[0,0]; b.blit(hs,X+hx+shx-nk[0]+ho[0]+1,Y+hy-Ln-nk[1]+ho[1]+1);
  // Hals zum Kopf, wenn der Kopf vorgeneigt ist
  if (ho[0]>0){ for (var i=0;i<ho[0];i++){ b.px(X+hx+shx+1+i,Y+hy-Ln+1,P.p2); b.px(X+hx+shx+i,Y+hy-Ln+2,P.p2); } }
  blanket(b,X,Y,p.kn);
  if (p.fu){ limb(b,o(eF),o(fh),rF,C.sleeveF); hand(b,X+fh[0]-0.5,Y+fh[1]-0.5,C.handF); }     // ferne Hand auf der Decke
  if (p.th){ var h=hpx(X,Y,nh); thermos(b,h[0]-1,h[1]+1); }
  limb(b,o(shN),o(eN),rN,C.sleeve); limb(b,o(eN),o(nh),rF,C.sleeve); hand(b,X+nh[0]-0.5,Y+nh[1]-0.5,C.hand); bigHand(b,X,Y,nh,C.hand);
  // Kissen zuletzt dahinter, mit Schattenkante zum Körper
  var fig=b.d.slice(), W=b.w, isF=function(x,y){ return x>=0&&y>=0&&x<W&&y<b.h&&fig[y*W+x]!==T; };
  for (var j=0;j<b.d.length;j++){ if (pil.d[j]===T || fig[j]!==T) continue; var x=j%W, y=(j/W)|0; b.d[j]=(isF(x-1,y)||isF(x+1,y)||isF(x,y-1)||isF(x,y+1))?P.s4:pil.d[j]; } }
// große Hände: ein Pixel mehr nach vorn (Daumen)
function bigHand(b,X,Y,q,c){ var h=hpx(X,Y,q); b.px(h[0]+2,h[1]+1,c[1]); }
function bedder(o0){ var b={v:'S',h:[BED.hx,BED.hy+(24-23)],ln:BED.ln,nf:[-1,-13,'f'],ff:[-2,-13,'f'],sit:1,bed:1,nh:[-9,-22],fh:[-11,-22],fu:1,ho:[1,0]}, k; if (o0) for (k in o0) b[k]=o0[k]; return S(b); }
alois.post=function(b,p,X,Y,hx,hy){ var ch=alois, g, t;
  if (p.bed){ bedFrame(b,p,X,Y); return; }
  g=geo(ch,p,hx,hy); t=Y+g.top;
  // Kanne mit beiden Armen an der Brust ('th')
  if (p.th && p.v==='S'){ var h=hpx(X,Y,p.nh); thermos(b,h[0]-1,h[1]+1); armS(b,ch,p,X,Y,hx,hy); }
  if (p.v==='S' && !p.th) bigHand(b,X,Y,p.nh,ch.cols.hand); };

// ---- Ortsabhängige Animationen: Alois sitzt (Bank, Sessel), steht (vor dem Aufzug) oder liegt (Zimmer 214, im Bett).
// 'hold', 'shiver', 'call', 'drive' und 'talk' fragen beim Abspielen, wo er gerade ist: im Bett, wenn er am Punkt alois_bed in heim214 liegt
// (oder der Raumzustand aloisBed gilt), stehend vor dem Aufzug (alois_lift) oder in einer stehenden Ruhehaltung ('wait'), sonst sitzend.
// Die festen Fassungen heißen zusätzlich holdSit/holdBed/holdStand, shiverSit/… usw.
function aloisActor(){ var acts=M.ACT||{}; for (var k in acts){ var a=acts[k]; if (a && a.ch==='alois' && a.visible!==false) return a; } return null; }
function aloisWhere(){ var a=aloisActor(); if (!a) return 'sit'; var R=M.E&&M.E.get?M.E.get().room:null, rid=R&&R.id, id=a.idle||'';
  var near=function(room,key){ var q=M.ART&&M.ART[room]&&M.ART[room].actorPos&&M.ART[room].actorPos[key]; return !!(q && rid===room && Math.abs(a.x-q[0])<=4 && Math.abs(a.y-q[1])<=4); };
  if (/^(bed|bedTalk|sleep|holdBed|shiverBed|callBed|driveBed)$/.test(id)) return 'bed';
  if (/^(wait|holdStand|shiverStand|callStand|driveStand)$/.test(id)) return 'stand';
  if (/^(sit|sitTalk|holdSit|shiverSit|callSit|driveSit)$/.test(id)) return 'sit';
  if (near('heim214','alois_bed')) return 'bed';
  if (near('heim_flur','alois_lift')) return 'stand';
  if (rid==='heim214' && !near('heim214','alois_chair')){ try{ if (M.ROOMS.heim214 && M.RS('heim214').aloisBed) return 'bed'; }catch(e){} }
  return 'sit'; }
function aloisHolds(){ var a=aloisActor(); return !!(a && a.idle && /^hold/.test(a.idle)); }
function ctxAnim(ch,name,pick){ Object.defineProperty(ch.anims,name,{get:pick,enumerable:true,configurable:true}); }
(function(){ var an=alois.anims, B=bedder;
  // geht gebeugt, kleine Schritte (die Geschwindigkeit setzt das Skript)
  an.walkS=A.walkS.map(function(p){ var q=Object.assign({},p,{ln:2,ho:[1,1]}); if (q.nf) q.nf=[Math.round(q.nf[0]*0.7),q.nf[1],q.nf[2]]; if (q.ff) q.ff=[Math.round(q.ff[0]*0.7),q.ff[1],q.ff[2]]; return q; });
  an.walkF=A.walkF.map(function(p){ return Object.assign({},p,{ho:[0,1]}); });
  an.walkB=A.walkB.map(function(p){ return Object.assign({},p,{ho:[0,1]}); });
  // sitzt auf der Bank oder im Sessel, die großen Hände auf den Knien; blinzelt, sieht auf, wartet
  an.sit=seq([aSit({nh:[12,-15],fh:[11,-15]}),1800],[aSit({nh:[12,-15],fh:[11,-15],hd:'b'}),130],[aSit({nh:[12,-15],fh:[11,-15]}),1400],[aSit({nh:[12,-15],fh:[11,-15],ho:[1,0],hd:'r'}),1500],
    [aSit({nh:[12,-15],fh:[11,-15],ho:[1,0],hd:'b'}),130],[aSit({nh:[12,-15],fh:[11,-15]}),1600],[aSit({nh:[12,-16],fh:[11,-15],ho:[1,1]}),300],[aSit({nh:[12,-15],fh:[11,-15]}),900]);
  an.sitTalk=seq([aSit({nh:[12,-15],fh:[11,-15],hd:'o',ho:[1,0]}),150],[aSit({nh:[12,-16],fh:[11,-15],ho:[1,0]}),150],[aSit({nh:[12,-16],fh:[11,-15],hd:'o',ho:[1,0]}),150],[aSit({nh:[12,-15],fh:[11,-15],ho:[1,0]}),180]);
  // steht vor der Aufzugtür, die Hände auf dem Rücken, und wippt leicht auf die Zehen
  var W=function(o){ return aP(Object.assign({nh:[-4,-21],fh:[-3,-21]},o||{})); };
  an.wait=seq([W({}),1400],[W({h:[0,-24],nf:[1,-1,'t'],ff:[-2,-1,'t'],ho:[1,0]}),500],[W({}),900],[W({hd:'b'}),130],[W({}),700],[W({h:[0,-24],nf:[1,-1,'t'],ff:[-2,-1,'t'],ho:[1,0]}),500],[W({}),1300],[W({hd:'r',ho:[2,1]}),1100]);
  an.standTalk=seq([W({hd:'o'}),150],[W({}),150],[W({hd:'o'}),150],[W({}),190]);
  // im Bett: halb aufgerichtet, die Hände auf der Decke; blinzelt, sieht zum Fenster, nickt ein wenig ein
  an.bed=seq([B({}),2000],[B({hd:'b'}),130],[B({}),1500],[B({hd:'r',ho:[2,0]}),1600],[B({}),1200],[B({hd:'b',ho:[1,1]}),900],[B({}),1000]);
  an.bedTalk=seq([B({hd:'o'}),150],[B({nh:[-8,-24]}),150],[B({hd:'o',nh:[-8,-24]}),150],[B({}),180]);
  an.sleep=seq([B({hd:'b',ho:[1,1]}),1800],[B({hd:'b',ho:[1,2]}),1600]);
  // hält die Kanne mit beiden Armen an der Brust (sitzend, stehend oder im Bett); schaut sie an, die Augen fallen ihm im Bett zu
  var TS=function(o){ return aSit(Object.assign({th:1,nh:[7,-22],fh:[6,-23],ln:2,ho:[1,1]},o||{})); }, TW=function(o){ return aP(Object.assign({th:1,nh:[6,-29],fh:[5,-30]},o||{})); },
    TB=function(o){ return B(Object.assign({th:1,nh:[-13,-30],fh:[-15,-30],fu:0,ho:[1,1]},o||{})); };
  an.holdSit=seq([TS({}),2000],[TS({hd:'b'}),130],[TS({ho:[1,2]}),1600],[TS({}),1400],[TS({hd:'b',ho:[1,2]}),1200],[TS({}),1500]);
  an.holdStand=seq([TW({}),2000],[TW({hd:'b'}),130],[TW({ho:[1,2]}),1600],[TW({}),1500]);
  an.holdBed=seq([TB({hd:'b'}),2400],[TB({hd:'b',ho:[1,2]}),1800],[TB({}),900],[TB({hd:'b'}),2200],[TB({hd:'b',ho:[1,2]}),1800]);
  an.holdSitTalk=seq([TS({hd:'o',ho:[1,0]}),150],[TS({ho:[1,0]}),150],[TS({hd:'o',ho:[1,0]}),150],[TS({ho:[1,0]}),180]);
  an.holdStandTalk=seq([TW({hd:'o'}),150],[TW({}),150],[TW({hd:'o'}),150],[TW({}),180]);
  an.holdBedTalk=seq([TB({hd:'o',ho:[1,0]}),150],[TB({ho:[1,0]}),150],[TB({hd:'o',ho:[1,0]}),150],[TB({ho:[1,0]}),180]);
  // schaudert: zieht die Schultern hoch (der Kopf sinkt ein), die Hände an die Oberarme, ein Zittern
  var shv=function(P0,base){ return seq([P0(base({})),80],[P0(base({ho:[1,2],nh:[6,-25],fh:[5,-26],ln:3})),120],[P0(base({ho:[2,2],nh:[6,-25],fh:[5,-26],ln:3,hd:'b'})),90],[P0(base({ho:[1,2],nh:[7,-25],fh:[6,-26],ln:3,hd:'b'})),90],
    [P0(base({ho:[2,2],nh:[6,-25],fh:[5,-26],ln:3})),90],[P0(base({ho:[1,2],nh:[7,-25],fh:[6,-26],ln:3})),90],[P0(base({ho:[1,2],nh:[6,-25],fh:[5,-26],ln:3,hd:'s'})),900],[P0(base({ho:[2,2],nh:[6,-25],fh:[5,-26],ln:3,hd:'s'})),90],
    [P0(base({ho:[1,2],nh:[7,-25],fh:[6,-26],ln:3,hd:'s'})),600],[P0(base({ho:[1,1]})),200]); };
  var id=function(o){ return o; };
  an.shiverSit=shv(function(o){ return aSit(Object.assign({nh:[12,-15],fh:[11,-15]},o,{nh:o.nh?[o.nh[0],o.nh[1]+6]:[12,-15],fh:o.fh?[o.fh[0],o.fh[1]+6]:[11,-15]})); },id);
  an.shiverStand=shv(function(o){ return aP(Object.assign({nh:[1,-21],fh:[-1,-21]},o)); },id);
  an.shiverBed=seq([B({}),80],[B({ho:[1,1],nh:[-12,-27],fh:[-14,-27],fu:0}),120],[B({ho:[2,1],nh:[-12,-27],fh:[-14,-27],fu:0,hd:'b'}),90],[B({ho:[1,1],nh:[-11,-27],fh:[-13,-27],fu:0,hd:'b'}),90],
    [B({ho:[2,1],nh:[-12,-27],fh:[-14,-27],fu:0}),90],[B({ho:[1,1],nh:[-12,-27],fh:[-14,-27],fu:0,hd:'s'}),900],[B({ho:[2,1],nh:[-11,-27],fh:[-13,-27],fu:0,hd:'s'}),600],[B({}),200]);
  // ruft „Die Gerda!“: der Kopf hoch, der Mund auf, die Hand hebt sich zum Aufzug
  an.callSit=seq([aSit({nh:[12,-15],fh:[11,-15]}),80],[aSit({nh:[13,-22],fh:[11,-15],ln:1,ho:[1,0],hd:'u'}),180],[aSit({nh:[14,-24],fh:[11,-15],ln:1,ho:[1,-1],hd:'uo'}),420],[aSit({nh:[14,-24],fh:[11,-15],ln:1,ho:[1,-1],hd:'u'}),300],
    [aSit({nh:[14,-24],fh:[11,-15],ln:1,ho:[1,-1],hd:'uo'}),420],[aSit({nh:[13,-22],fh:[11,-15],ln:1,ho:[1,0],hd:'u'}),900],[aSit({nh:[12,-16],fh:[11,-15],ho:[1,1],hd:'s'}),700]);
  an.callStand=seq([W({}),80],[aP({nh:[8,-30],fh:[-2,-21],ln:1,ho:[1,0],hd:'u'}),180],[aP({nh:[11,-34],fh:[-2,-21],ln:1,ho:[1,-1],hd:'uo'}),420],[aP({nh:[11,-34],fh:[-2,-21],ln:1,ho:[1,-1],hd:'u'}),300],
    [aP({nh:[11,-34],fh:[-2,-21],ln:1,ho:[1,-1],hd:'uo'}),420],[aP({nh:[8,-30],fh:[-2,-21],ln:1,ho:[1,0],hd:'u'}),900],[aP({nh:[1,-21],fh:[-2,-21],hd:'s'}),700]);
  an.callBed=seq([B({}),80],[B({nh:[-6,-28],ho:[2,-1],hd:'u'}),180],[B({nh:[-4,-31],ho:[2,-1],hd:'uo'}),420],[B({nh:[-4,-31],ho:[2,-1],hd:'u'}),300],[B({nh:[-4,-31],ho:[2,-1],hd:'uo'}),420],[B({nh:[-6,-28],ho:[2,0],hd:'u'}),900],[B({hd:'s'}),700]);
  // seine Hände führen eine unsichtbare Kurbel (Fahrschalter) und halten die Bremse: Trambahnfahrer; der Blick geht nach vorn auf die Strecke
  var drv=function(base,n,f){ var Q=function(o){ return base(Object.assign({hd:'r'},o)); }, fr=[]; var path=[[0,0],[1,-1],[2,0],[1,1]];
    for (var r=0;r<3;r++) path.forEach(function(d,i){ fr.push([Q({nh:[n[0]+d[0],n[1]+d[1]],fh:f,hd:(r===1&&i===2)?'b':'r'}),220]); });
    fr.push([Q({nh:n,fh:f}),900]); fr.push([Q({nh:n,fh:f,ho:[2,1]}),300]); return fr; };
  an.driveSit=drv(function(o){ return aSit(Object.assign({ln:1,ho:[1,0]},o)); },[9,-22],[8,-20]);
  an.driveStand=drv(function(o){ return aP(Object.assign({ln:1,ho:[1,0]},o)); },[9,-27],[8,-25]);
  an.driveBed=drv(function(o){ return B(Object.assign({fu:0,ho:[2,0]},o)); },[-6,-25],[-8,-23]);
  var pick=function(m){ return function(){ return m[aloisWhere()]||m.sit; }; };
  ctxAnim(alois,'hold',pick({sit:an.holdSit,stand:an.holdStand,bed:an.holdBed}));
  ctxAnim(alois,'shiver',pick({sit:an.shiverSit,stand:an.shiverStand,bed:an.shiverBed}));
  ctxAnim(alois,'call',pick({sit:an.callSit,stand:an.callStand,bed:an.callBed}));
  ctxAnim(alois,'drive',pick({sit:an.driveSit,stand:an.driveStand,bed:an.driveBed}));
  ctxAnim(alois,'talk',function(){ var w=aloisWhere(), h=aloisHolds(); if (w==='bed') return h?an.holdBedTalk:an.bedTalk; if (w==='stand') return h?an.holdStandTalk:an.standTalk; return h?an.holdSitTalk:an.sitTalk; });
})();

// ---------------------------------------------------------------- PFLEGERIN (um 40), ohne Porträt: dunkler Pferdeschwanz, hellblauer Kasack, weiße Hose, weiße Schuhe
var pfS=[
"............",
"....kkkkk...",
"...khhjhhk..",
"..khhhhhhhk.",
".khhhhhhhhSk",
"kkhhhhhhSSSk",
"kHkhhhtSSeSk",
"kHkhhtSSSSSSk",
"kHkktSSSSSk.",
".kk.ktSSSmk.",
".....ktSSk..",
"......kkk...",
"....ktsk....",
"....ktsk...."];
var pfF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khhSSSSShhk",
"khSSSSSSShk",
"khSeSSSeShk",
"kSSSStSSSSk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var pfB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhHhhhhk",
"kthhhHhhhtk",
".khhhHhhhk.",
".kttkHktttk",
"..k.kHk.k..",
"....kHk....",
"...ktttk...",
"...kssk...."];
// Kaffee-Isolierkanne (dunkel, Deckel mit Ausgießer); 'T': geneigt beim Eingießen, mit dem Kaffeestrahl
H.k4a_pflegePot=function(b,x,y){ b.rect(x+2,y-2,3,4,P.k2); b.vl(x+2,y-2,y+1,P.m1); b.hl(x+2,x+4,y-3,P.m3); b.px(x+3,y-4,P.m4); b.px(x+5,y-3,P.m4); b.vl(x+1,y-2,y,P.k2); };
H.k4a_pflegePotT=function(b,x,y){ [[2,-3],[3,-3],[2,-2],[3,-2],[4,-2],[3,-1],[4,-1],[5,-1],[4,0],[5,0]].forEach(function(q){ b.px(x+q[0],y+q[1],P.k2); }); b.px(x+2,y-3,P.m1); b.px(x+3,y-2,P.m1);
  b.px(x+6,y-1,P.m3); b.px(x+6,y,P.m3); b.px(x+5,y+1,P.m3); b.px(x+7,y+1,P.m4); b.vl(x+7,y+2,y+4,P.w1); b.px(x+7,y+5,P.w2); b.px(x+1,y-2,P.k2); };
var pfP=pose({},'S'), KASB=[P.b3,P.b4,P.b2];
var pflege1=M.defineChar('pflege1',{
  legend:L({H:P.h2,h:P.h1,j:P.h3,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(pfS),F:HS(pfF),B:{n:pfB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:KASB,vneck:P.p3,side:7}, torsoS:{vneck:P.p3},
  bones:[11,10,8,7], hipY:23, shoulder:5, armR:[1.3,1.0],
  cols:{trou:[P.s5,P.s6,P.s4],trouF:[P.s4,P.s5,P.s3],sleeve:KASB,sleeveF:[P.b2,P.b3,P.b1],arm:[P.p4,P.p5,P.p3],armF:[P.p3,P.p4,P.p2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s5},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.pflege1, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.rect(X+hx+2,t+4,3,2,P.s6); b.px(X+hx+3,t+4,P.k2); }
    else if (p.v==='S'){ var nx=X+hx+3+g.shx; b.px(nx,t+4,P.s6); b.px(nx,t+5,P.k2);
      if (p.ct) cart(b,X,Y,Math.round(p.nh[0])+2,p.ct-1); if (p.ch) cartHandle(b,X,Y,Math.round(p.nh[0])+2); if (p.ct||p.ch) armS(b,ch,p,X,Y,hx,hy); } },
  anims:{
    // schenkt Kaffee ein (Tisch etwa 20 px hoch): die Kanne heben, neigen, der Strahl, zurück
    pour:seq([pfP({nh:[6,-23],it:'k4a_pflegePot'}),600],[pfP({nh:[9,-26],it:'k4a_pflegePot',ln:1,ho:[1,1]}),200],[pfP({nh:[10,-28],it:'k4a_pflegePotT',ln:2,ho:[1,1]}),1200],[pfP({nh:[10,-28],it:'k4a_pflegePotT',ln:2,ho:[1,1],hd:'b'}),110],
      [pfP({nh:[10,-28],it:'k4a_pflegePotT',ln:2,ho:[1,1]}),500],[pfP({nh:[9,-26],it:'k4a_pflegePot',ln:1,ho:[1,1]}),200],[pfP({nh:[6,-23],it:'k4a_pflegePot'}),900]),
    // schiebt den Wäschewagen (pushH: nur der Griff, wenn der Raum den Wagen malt)
    push:seq([pfP({ct:1,ln:2,nh:[9,-26],fh:[8,-26],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0]}),700],[pfP({ct:2,ln:3,nh:[10,-26],fh:[9,-26],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0],h:[1,-23]}),300],
      [pfP({ct:3,ln:3,nh:[11,-26],fh:[10,-26],nf:[4,0,'f'],ff:[-6,0,'t'],ho:[1,0],h:[2,-23]}),300],[pfP({ct:2,ln:2,nh:[9,-26],fh:[8,-26],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0]}),300],[pfP({ct:1,ln:2,nh:[9,-26],fh:[8,-26],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0],hd:'b'}),110]),
    pushH:seq([pfP({ch:1,ln:2,nh:[9,-26],fh:[8,-26],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0]}),1400],[pfP({ch:1,ln:2,nh:[9,-26],fh:[8,-26],nf:[3,0,'f'],ff:[-6,0,'t'],ho:[1,0],hd:'b'}),110]) }
});

// ---------------------------------------------------------------- EMPFANG (um 45), ohne Porträt: Mann mit grauem Pullover über Hemdkragen und Brille; sitzt hinter der Theke
var emS=[
"............",
"....kkkkk...",
"...khhjhhk..",
"..khhhhjhhk.",
".khhhhhhhhhk",
".khhhhhhSSSk",
".khhhtSgegGk",
".khhtSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var emF=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khSSSSSSShk",
"kSSSSSSSSSk",
"kgegGSgegGk",
"ktSSStSSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var emB=[
"...kkkkk...",
"..khhjhhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kghhhhhhhgk",
"kthhhhhhhtk",
".khhhhhhhk.",
".ktttttttk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var emSit=sitter(23,{ln:1});
M.defineChar('empfang',{
  legend:L({H:P.w2,h:P.w1,j:P.w3,S:P.p4,s:P.p3,t:P.p2,m:P.p1,g:P.k2,G:P.b4}),
  heads:{S:HS(emS),F:HS(emF),B:{n:emB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.m2,P.m3,P.m1],collar:[P.s5,P.s4],side:8}, torsoS:{collar:[P.s5,P.s4]},
  bones:[11,10,8,7], hipY:23, shoulder:5,
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  anims:{
    // sitzt hinter der Theke und tippt (Tastatur und Bildschirm malt der Raum, die Hände etwa 21 px hoch); sieht auf, wenn jemand kommt
    sit:(function(){ var K=function(o){ return emSit(Object.assign({nh:[10,-21],fh:[12,-21],ho:[1,1]},o||{})); };
      return seq([K({}),140],[K({nh:[10,-22]}),110],[K({fh:[12,-22]}),110],[K({nh:[9,-22]}),110],[K({fh:[13,-22]}),110],[K({}),600],[K({hd:'b'}),110],[K({nh:[11,-22]}),110],[K({fh:[12,-22]}),110],[K({}),400],
        [K({ho:[1,0]}),1500],[K({ho:[1,0],hd:'b'}),110],[K({ho:[1,0]}),700],[K({}),300]); })(),
    sitTalk:seq([emSit({nh:[10,-21],fh:[12,-21],ho:[1,0],hd:'o'}),140],[emSit({nh:[10,-23],fh:[12,-21],ho:[1,0]}),140],[emSit({nh:[10,-23],fh:[12,-21],ho:[1,0],hd:'o'}),140],[emSit({nh:[10,-21],fh:[12,-21],ho:[1,0]}),170]) }
});

// ================================================================ GEISTER (natürliche Farben; das Spiel färbt sie über M.ghostLut ein, Ausnahmen unten in M.GHOST_OVR)

// ---------------------------------------------------------------- HANSI, Johann Kirchmaier († 1998, wirkt 63), Fahrkartenverkäufer am alten Busabfahrtsplatz: mittelgroß, Bauch,
// schütteres graues Haar quer gekämmt, Bleistift hinter dem Ohr, Hornbrille; grauer Arbeitskittel, lederne Wechselgeldtasche am Gürtel,
// schwarze Ärmelschoner. Gemütlich, stur. Steht meist von vorn (actorPos 'F').
var hnS=[
".............",
"....kkkkk....",
"...kSjhjSk...",
"..khjjjjSSk..",
"..khhhhSSSSk.",
".kyhhhhSSSSk.",
".khyhtGGGGSk.",
".khhyStgegSk.",
"..khtSSSSSSSk",
"..ktSSSSSSSk.",
"..ktSSSSSmSk.",
"...ktSSSSSk..",
"....kkkkkk...",
"....ktsk.....",
"....ktsk....."];
var hnF=[
"...kkkkk...",
"..kSjhjSk..",
".khjjjjSSk.",
"khhhSSSSShk",
"yhSSSSSSShk",
"kyGGGSGGGSk",
"kSgegSgegSk",
"ktSSStSSStk",
"kSSSSSSSSSk",
".kSSSmSSSk.",
".ktSSSSStk.",
"..kkkkkkk..",
"...ktttk...",
"...kssk...."];
var hnB=[
"...kkkkk...",
"..kSjhjSk..",
".khjjjhjhk.",
"khhhhhhhhhk",
"khhhhhhhhhy",
"kGhhhhhhhGy",
"khhhhhhhhhk",
"kthhhhhhhtk",
".khhhhhhhk.",
".ktttttttk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var hnHF=HS(hnF), hnHS=HS(hnS);
var hnPF=pose({},'F'), hnPS=pose({},'S'), KITH=[P.m2,P.m3,P.m1];
// Wechselgeldtasche aus Leder am Gürtel (vorn rechts von ihm, also links im Bild; seitlich vorn an der Hüfte), mit Klappe und Druckknopf
function purse(b,x,y,open){ b.rect(x,y,4,4,P.w2); b.hl(x,x+3,y,P.w3); b.vl(x,y,y+3,P.w3); b.hl(x,x+3,y+3,P.w1); b.px(x+3,y+1,P.w1);
  if (!open){ b.hl(x,x+3,y+1,P.w4); b.px(x+2,y+2,P.y3); } else { b.hl(x,x+3,y-1,P.w3); b.px(x+1,y,P.k2); b.px(x+2,y,P.k2); } b.px(x+1,y-1,P.w1); b.px(x+1,y-2,P.w1); }
var hansi=M.defineChar('hansi',{
  legend:L({H:P.m2,h:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,g:P.w2,G:P.w1,y:P.y3}),
  heads:{S:hnHS,F:hnHF,B:{n:hnB}}, neck:{S:[6,14],F:[5,13],B:[5,13]},
  torso:{w:13,len:13,col:KITH,collar:[P.m3,P.m1],buttons:P.m1,side:9,belly:1}, torsoS:{collar:[P.m3,P.m1]},
  coat:{c:KITH,hem:8,w:6},
  bones:[11,10,8,7], hipY:22, shoulder:5, armR:[1.4,1.1], legR:[1.7,1.3],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:KITH,sleeveF:[P.m1,P.m2,P.m0],arm:[P.k2,P.m0,P.k1],armF:[P.k1,P.k2,P.k0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Wechselgeldtasche (am Gürtel; 'po' offen), Münzen in der hohlen Hand ('cn' 1–4), Armbanduhr ('wt'), Brusttasche mit Stiften
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.hansi, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ purse(b,X+hx-6,Y+hy-3,p.po); b.hl(X+hx+2,X+hx+4,t+4,P.m1); b.px(X+hx+3,t+3,P.r3); b.px(X+hx+4,t+3,P.n2);
      if (p.cn){ var c=hpx(X,Y,p.rh), cs=[P.y3,P.m4,P.y4,P.y2]; for (var i=0;i<p.cn;i++) b.px(c[0]+(i&1),c[1]-1-(i>>1),cs[i]); armF(b,ch,p,X,Y,hx,hy,-1); }
      if (p.wt){ armF(b,ch,p,X,Y,hx,hy,1); var w=hpx(X,Y,p.rh); b.px(w[0]+2,w[1]+1,P.m4); b.px(w[0]+2,w[1],P.y3); } }
    else if (p.v==='S'){ purse(b,X+hx+1,Y+hy-3,p.po); var px0=X+hx+3+g.shx; b.px(px0,t+3,P.r3); b.px(px0+1,t+3,P.n2); }
    else purse(b,X+hx+3,Y+hy-3,0); },
  anims:{
    // steht am Pfeiler, die Daumen in den Kitteltaschen, wippt auf den Absätzen, sieht sich um
    wait:(function(){ var Q=function(o){ return hnPF(Object.assign({lh:[-5,-20],rh:[5,-20]},o||{})); };
      return seq([Q({}),1600],[Q({hd:'b'}),110],[Q({}),900],[Q({hd:'l'}),900],[Q({ho:[0,-1]}),400],[Q({}),700],[Q({hd:'r'}),900],[Q({hd:'b'}),110],[Q({}),1300]); })(),
    // zählt Münzen aus der Tasche in die hohle Hand
    count:(function(){ var Q=function(o){ return hnPF(Object.assign({rh:[1,-23],lh:[-4,-21],ho:[0,1],po:1},o||{})); };
      return seq([hnPF({lh:[-5,-20],rh:[5,-20]}),80],[Q({po:0}),200],[Q({lh:[-4,-18]}),220],[Q({lh:[-1,-24],cn:1}),200],[Q({lh:[-4,-18],cn:1}),220],[Q({lh:[-1,-24],cn:2}),200],[Q({lh:[-4,-18],cn:2}),220],
        [Q({lh:[-1,-24],cn:3,hd:'b'}),200],[Q({lh:[-4,-18],cn:3}),220],[Q({lh:[-1,-24],cn:4}),300],[Q({lh:[-2,-25],cn:4}),400],[Q({lh:[-1,-24],cn:4,hd:'o'}),220],[Q({lh:[-2,-25],cn:4}),900],[Q({cn:4,ho:[0,0]}),700]); })(),
    // sieht auf die Armbanduhr: den linken Unterarm vor die Brust, der Kopf senkt sich; dann ein Nicken
    look:seq([hnPF({lh:[-5,-20],rh:[5,-20]}),80],[hnPF({lh:[-5,-20],rh:[3,-25]}),140],[hnPF({lh:[-5,-20],rh:[0,-29],wt:1,ho:[0,1]}),1000],[hnPF({lh:[-5,-20],rh:[0,-29],wt:1,ho:[0,1],hd:'b'}),110],
      [hnPF({lh:[-5,-20],rh:[0,-29],wt:1,ho:[0,1]}),500],[hnPF({lh:[-5,-20],rh:[3,-25],ho:[0,0]}),140],[hnPF({lh:[-5,-20],rh:[5,-20],ho:[0,1]}),220],[hnPF({lh:[-5,-20],rh:[5,-20]}),400]),
    // der Abschied: hebt die Hand, „Servus, Burschi“
    wave:seq([hnPF({lh:[-5,-20],rh:[5,-20]}),80],[hnPF({rh:[5,-20],lh:[-8,-30]}),130],[hnPF({rh:[5,-20],lh:[-9,-42],hd:'o'}),300],[hnPF({rh:[5,-20],lh:[-11,-41]}),220],[hnPF({rh:[5,-20],lh:[-8,-42],hd:'o'}),220],
      [hnPF({rh:[5,-20],lh:[-11,-41]}),220],[hnPF({rh:[5,-20],lh:[-9,-42]}),700],[hnPF({rh:[5,-20],lh:[-9,-42],hd:'b'}),110],[hnPF({rh:[5,-20],lh:[-9,-42]}),500],[hnPF({rh:[5,-20],lh:[-8,-30]}),140],[hnPF({lh:[-5,-20],rh:[5,-20]}),300]),
    talk:seq([hnPF({lh:[-5,-20],rh:[5,-20],hd:'o'}),140],[hnPF({lh:[-5,-20],rh:[7,-25]}),130],[hnPF({lh:[-5,-20],rh:[8,-27],hd:'o'}),140],[hnPF({lh:[-5,-20],rh:[5,-20]}),170])
  }
});
// geht: dreht sich um (von vorn über die Seite nach hinten) und geht ein paar Schritte in die Tiefe; das Auflösen macht die Engine.
// Das letzte Bild bleibt stehen (wie springer.jump in 14_k3_cast_b.js), damit er beim Ausblenden nicht an den Pfeiler zurückspringt.
(function(){ var Bw=[ {h:[0,-22],lf:[-3,1],rf:[3,-1],lh:[-7,-22],rh:[7,-20]},{h:[0,-23],lf:[-3,0],rf:[3,-3],lh:[-7,-21],rh:[7,-21]},{h:[0,-24],lf:[-3,-1],rf:[3,-3],lh:[-7,-21],rh:[7,-21]},{h:[0,-23],lf:[-3,-1],rf:[3,0],lh:[-7,-20],rh:[7,-22]},
    {h:[0,-22],lf:[-3,-1],rf:[3,1],lh:[-7,-20],rh:[7,-22]},{h:[0,-23],lf:[-3,-3],rf:[3,0],lh:[-7,-21],rh:[7,-21]},{h:[0,-24],lf:[-3,-3],rf:[3,-1],lh:[-7,-21],rh:[7,-21]},{h:[0,-23],lf:[-3,0],rf:[3,-1],lh:[-7,-22],rh:[7,-20]} ];
  var fr=[[hnPF({lh:[-5,-20],rh:[5,-20]}),200],[hnPF({lh:[-5,-20],rh:[5,-20],hd:'r'}),260],[hnPS({}),180],[F({lh:[-6,-21],rh:[6,-21]},'B'),220]];
  for (var i=0;i<10;i++){ var q=Bw[i%8], dy=-Math.round((i+1)*0.8), sh=function(a){ return [a[0],a[1]+dy]; };
    fr.push([F({h:sh(q.h),lf:sh(q.lf),rf:sh(q.rf),lh:sh(q.lh),rh:sh(q.rh)},'B'),150]); }
  fr.push([F({h:[0,-22-8],lf:[-3,-8],rf:[3,-8],lh:[-6,-21-8],rh:[6,-21-8]},'B'),1400]);
  hansi.anims.go=fr;
  fr.forEach(function(f){ var ms=f[1]; Object.defineProperty(f,1,{get:function(){ var A2=M.ACT; if (A2) for (var k in A2){ var a=A2[k]; if (a && a.ch==='hansi' && a.mode==='anim' && a.anim===fr) a.hold=true; } return ms; },enumerable:true,configurable:true}); }); })();

// ---------------------------------------------------------------- SEPP, Giuseppe „Peppino“ Ruggiero († Dezember 2011, wirkt 72), Gepäckträger Nr. 17: schlank, sehr gerader Rücken,
// schmales Gesicht, kurzes weißes Haar, dünner weißer Schnurrbart, dunkle Augen, buschige Brauen; Schirmmütze mit Messingschild „17“,
// dunkelblaue Uniformjacke mit Messingknöpfen (an Ellbogen und Saum blank gewetzt), dunkle Hose, schwarze, glänzend geputzte Schuhe
var spS=[
".............",
"....kkkkk....",
"...kCcccCk...",
"..kCCCCCyYk..",
"..kDDDDDDDDk.",
"..kwwSSSddddk",
"..kwtSWWSk...",
"..kwtSSSeSk..",
"..kwtSSSSSSk.",
"...ktSSSbbk..",
"...ktSSSmk...",
"....ktSSk....",
".....kkkk....",
".....ktsk....",
".....ktsk...."];
var spF=[
".............",
"....kkkkk....",
"...kCcccCk...",
"..kCCCyYCCk..",
"..kDDDDDDDk..",
".kdddddddddk.",
"..kwSSSSSwk..",
"..kSWWSWWSk..",
"..kSeSSSeSk..",
"..ktSStSStk..",
"..kSbbbbbSk..",
"...ktSmStk...",
"....ktttk....",
".....kkk.....",
"....ktttk....",
".....ksk....."];
var spB=[
".............",
"....kkkkk....",
"...kCcccCk...",
"..kCCCCCCCk..",
"..kDDDDDDDk..",
"..kwWwhwWwk..",
"..khwhwhwhk..",
"..kswhwhwsk..",
"..kstwhwtsk..",
"...ktttttk...",
"...ktttttk...",
"....ktttk....",
".....kkk.....",
"....ktttk....",
".....ksk....."];
var spP=pose({},'S'), spSit=sitter(24,{nf:[11,0,'f'],ff:[9,0,'f']}), UNI=[P.n1,P.n2,P.n0];
var sepp=M.defineChar('sepp',{
  legend:L({C:P.n1,c:P.n2,D:P.n0,d:P.k2,y:P.y3,Y:P.y4,w:P.s5,W:P.s6,h:P.s4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.s6}),
  heads:{S:HS(spS),F:HS(spF),B:{n:spB}}, neck:{S:[6,14],F:[6,15],B:[6,14]},
  torso:{w:11,len:14,col:UNI,collar:[P.n0,P.n0],buttons:P.y3,side:7,taper:1}, torsoS:{collar:[P.n0,P.n0],buttons:P.y3},
  coat:{c:UNI,hem:3,w:5},
  bones:[11,11,8,7], hipY:24, shoulder:5, armR:[1.2,1.0], legR:[1.5,1.2],
  cols:{trou:[P.m0,P.m1,P.k2],trouF:[P.k2,P.m0,P.k1],sleeve:UNI,sleeveF:[P.n0,P.n1,P.k2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // blank gewetzt: Ellbogen und Saum der Jacke heller; Koffer ('cs' in der nahen Hand, 'cq' als Sitz), Zeigefinger ('fp')
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.sepp, g=geo(ch,p,hx,hy), t=Y+g.top, U=[P.n1,P.n2,P.n0];
    var shine=function(e){ var ex=Math.round(X+e[0]-0.5), ey=Math.round(Y+e[1]-0.5); onCol(b,ex,ey,U,P.n3); onCol(b,ex+1,ey,U,P.n3); };
    if (p.v==='S'){ shine(g.eN); for (var x=X+hx-4;x<=X+hx+4;x++) onCol(b,x,Y+hy+2,U,((x+hy)&1)?P.n3:P.n2);
      if (p.cq) behind(b,function(tb){ kaseSeat(tb,X+hx-3,Y); });
      if (p.cs){ var h=hpx(X,Y,p.nh); kase(b,h[0],h[1]); hand(b,h[0],h[1],ch.cols.hand); }
      if (p.fp) finger(b,X,Y,p.nh,[P.p4,P.p3]); }
    else if (p.v==='F'){ shine(g.eL); shine(g.eR); for (var x2=X+hx-5;x2<=X+hx+5;x2++) onCol(b,x2,Y+hy+2,U,(x2&1)?P.n3:P.n2); } },
  anims:{
    // wartet am Prellbock: kerzengerade, die Hände auf dem Rücken; sieht die Gleise entlang, hebt sich einmal auf die Zehen
    wait:(function(){ var Q=function(o){ return spP(Object.assign({nh:[-4,-22],fh:[-3,-22]},o||{})); };
      return seq([Q({}),1800],[Q({hd:'b'}),110],[Q({}),1300],[Q({hd:'r',ho:[0,-1]}),1400],[Q({h:[0,-24],nf:[1,-1,'t'],ff:[-2,-1,'t'],hd:'r',ho:[0,-1]}),600],[Q({}),1500],[Q({hd:'b'}),110],[Q({}),800]); })(),
    // trägt den Pappkoffer am Griff (der Arm gestreckt), der andere Arm etwas ab für das Gleichgewicht
    carry:(function(){ var Q=function(o){ return spP(Object.assign({cs:1,nh:[3,-20],fh:[-4,-21]},o||{})); };
      return seq([Q({}),1600],[Q({hd:'b'}),110],[Q({ho:[0,-1]}),900],[Q({}),1200],[Q({nh:[3,-21],ho:[0,-1],hd:'r'}),800],[Q({}),900]); })(),
    // tippt an den Mützenschirm, ein kleines Nicken
    cap:seq([spP({}),80],[spP({nh:[5,-36]}),130],[spP({nh:[6,-45],ho:[0,0]}),160],[spP({nh:[7,-45],ho:[1,1]}),420],[spP({nh:[6,-45]}),200],[spP({nh:[5,-36]}),140],[spP({}),300]),
    // zeigt auf die Gleise, der Arm gestreckt nach vorn unten
    point:seq([spP({}),80],[spP({nh:[8,-28]}),120],[spP({nh:[13,-29],fp:1,ho:[1,0]}),300],[spP({nh:[13,-29],fp:1,ho:[1,1],hd:'o'}),220],[spP({nh:[13,-29],fp:1,ho:[1,1]}),900],[spP({nh:[13,-29],fp:1,ho:[1,1],hd:'b'}),110],[spP({nh:[8,-28]}),140],[spP({}),300]),
    // sitzt (auf einer Bank oder einem Koffer), die Hände auf den Knien, der Rücken gerade
    sit:seq([spSit({nh:[11,-15],fh:[10,-15]}),1800],[spSit({nh:[11,-15],fh:[10,-15],hd:'b'}),110],[spSit({nh:[11,-15],fh:[10,-15],hd:'r'}),1400],[spSit({nh:[11,-15],fh:[10,-15]}),1200]),
    sitTalk:seq([spSit({nh:[11,-15],fh:[10,-15],hd:'o'}),140],[spSit({nh:[12,-20],fh:[10,-15]}),140],[spSit({nh:[12,-20],fh:[10,-15],hd:'o'}),140],[spSit({nh:[11,-15],fh:[10,-15]}),170]),
    // sitzt auf seinem eigenen Pappkoffer (hochkant)
    sitCase:seq([spSit({cq:1,nh:[11,-15],fh:[10,-15]}),1800],[spSit({cq:1,nh:[11,-15],fh:[10,-15],hd:'b'}),110],[spSit({cq:1,nh:[11,-15],fh:[10,-15],hd:'r'}),1400],[spSit({cq:1,nh:[11,-15],fh:[10,-15]}),1200]),
    // wendet sich ab, die Schultern hoch (nach dem Namen gefragt); dreht sich nach einer Weile halb zurück, den Blick gesenkt
    turn:seq([spP({}),80],[spP({ho:[0,1],hd:'s'}),160],[F({lh:[-3,-24],rh:[3,-24],ho:[0,1]},'B'),220],[F({lh:[-3,-25],rh:[3,-25],ho:[0,2]},'B'),1600],[F({lh:[-3,-25],rh:[3,-25],ho:[1,2]},'B'),900],[spP({ho:[0,1],hd:'s'}),900])
  }
});
// Schuhe schwarz und blank geputzt (ein Glanzpunkt)
shoes(sepp,{ f:['.kk..','kssk.','kkkkk'], h:['.kk.k','kssgs','kkkk.'], t:['kk...','.ksk.','..ksg','...kk'], F:['ksgk','kkkk'], B:['kssk','kkkk'] },{k:P.k1,s:P.k2,g:P.m4});
(function(){ var an=sepp.anims;
  an.talkWait=seq([spP({nh:[-4,-22],fh:[-3,-22],hd:'o'}),150],[spP({nh:[-4,-22],fh:[-3,-22]}),140],[spP({nh:[-4,-22],fh:[-3,-22],hd:'o',ho:[0,1]}),150],[spP({nh:[-4,-22],fh:[-3,-22]}),180]);
  an.talkCarry=seq([spP({cs:1,nh:[3,-20],fh:[-4,-21],hd:'o'}),150],[spP({cs:1,nh:[3,-20],fh:[-4,-21]}),140],[spP({cs:1,nh:[3,-20],fh:[-4,-21],hd:'o'}),150],[spP({cs:1,nh:[3,-20],fh:[-4,-21]}),180]);
  ctxAnim(sepp,'talk',function(){ var acts=M.ACT||{}, id=''; for (var k in acts){ if (acts[k] && acts[k].ch==='sepp'){ id=acts[k].idle||''; break; } } if (/sit/.test(id)) return an.sitTalk; if (/carry/.test(id)) return an.talkCarry; return an.talkWait; }); })();

// ---------------------------------------------------------------- GERDA LECHNER († 3. September 2011, wirkt 84): klein, aufrecht, rundes freundliches Gesicht, weiße Löckchen unter einem
// blauen Seidenkopftuch mit weißen Tupfen (gegen den Wind, unter dem Kinn geknotet, wie in den Sechzigern); langer kamelfarbener Wintermantel,
// dunkle Handschuhe, Handtasche am Arm; die grüne Blech-Thermoskanne mit Becherdeckel
var gdS=[
"............",
"....kkkkk...",
"...kcdCcCk..",
"..kcCcCcdck.",
".kcdcccCcCk.",
".kcccccwWwSk",
".kcccdcwSeSk",
".kccctSSSSSSk",
"..kcctSrSSSk",
"..kcDtSSSmk.",
"...kcDSSSk..",
"....kDcck...",
"....ktsk....",
"....ktsk...."];
var gdF=[
"...kkkkk...",
"..kcCdCck..",
".kcdcCcdck.",
"kcCcdcCcdck",
"kcwWwWwWwck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kcrSStSSrck",
"kctSSSSStck",
".kcSSmSSck.",
"..kcSSSck..",
"...kcdck...",
"...ktttk...",
"...kssk...."];
var gdB=[
"...kkkkk...",
"..kcCdCck..",
".kcdcCcdck.",
"kcCcdcCcdck",
"kccdcccdcck",
"kcdcccdcCck",
"kccccdccDck",
"kcdccccdDck",
".kcccdcDck.",
"..kcccDck..",
"...kcDck...",
"....kck....",
"...ktttk...",
"...kssk...."];
// Beim Hochsteigen legt sich der lange Mantel über das gehobene Knie und fällt von dort gerade herab (das Rig spannt ihn sonst zum Knie hin auf);
// das Schienbein des gehobenen Beins wird danach wieder gezeichnet
function coatOverKnee(b,ch,p,X,Y,hx,hy){ var lg=legS(ch,p,hx,hy,true), K=lg.kn, Aq=lg.ank, CM=[P.w3,P.w4,P.w5];
  var edge=function(y){ var y0=hy-2, x0=hx+4; if (y<=K[1]) return x0+(K[0]+1-x0)*Math.max(0,Math.min(1,(y-y0)/Math.max(1,K[1]-y0))); return K[0]+1; };
  for (var y=Y+hy-3;y<=Y+hy+15;y++) for (var x=X+hx-8;x<=X+hx+18;x++){ if (CM.indexOf(b.get(x,y))<0) continue; if (x-X>edge(y-Y)+0.5 || (x-X>hx+3 && y-Y>K[1]+6)) b.px(x,y,T); }
  var bn=ch.bones, C=ch.cols; limb(b,[X+K[0],Y+K[1]+2],[X+Aq[0],Y+Aq[1]],ch.legR[1],C.trou); var f=p.nf||[0,0,'f']; b.blit(ch.shoes[f[2]||'f'],X+f[0]-2,Y+f[1]-2); }
// Handtasche (dunkles Leder, Messingverschluss) am Unterarm
function handbag(b,x,y){ b.px(x+1,y-2,P.h2); b.px(x+2,y-2,P.h2); b.px(x,y-1,P.h2); b.px(x+3,y-1,P.h2);
  b.rect(x,y,4,3,P.h1); b.hl(x,x+3,y,P.h2); b.px(x,y+1,P.h2); b.px(x+2,y,P.y3); b.hl(x,x+3,y+3,P.k2); }
var gdP=pose({},'S'), gdSit=sitter(20,{nf:[8,0,'f'],ff:[7,0,'f']}), CAMEL=[P.w4,P.w5,P.w3];
var gerda=M.defineChar('gerda',{
  legend:L({c:P.b1,C:P.b2,D:P.b0,d:P.s6,w:P.s5,W:P.s6,S:P.p4,s:P.p3,t:P.p2,m:P.p1,r:P.d4}),
  heads:{S:HS(gdS),F:HS(gdF),B:{n:gdB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:11,col:CAMEL,collar:[P.w3,P.w2],buttons:P.w2,side:7}, torsoS:{collar:[P.w3,P.w2],buttons:P.w2},
  skirt:{c:CAMEL,hem:13,flare:2},
  bones:[9,9,7,6], hipY:20, shoulder:4, armR:[1.3,1.0], legR:[1.4,1.2],
  cols:{trou:[P.w1,P.w2,P.w0],trouF:[P.w0,P.w1,P.k1],sleeve:CAMEL,sleeveF:[P.w3,P.w4,P.w2],hand:[P.m1,P.m0],handF:[P.m0,P.k2],shoe:P.k2},
  // die Kanne ('tk': mit beiden Händen vor dem Bauch; 'tl': auf dem Schoß; 'tg': nach vorn gereicht, liegend), die Handtasche am Unterarm
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.gerda, g=geo(ch,p,hx,hy);
    if (p.v==='S'){
      if (p.st) coatOverKnee(b,ch,p,X,Y,hx,hy);
      if (p.tl){ var f=hpx(X,Y,p.fh); thermos(b,f[0]+1,f[1]-2); hand(b,f[0],f[1],ch.cols.handF); armS(b,ch,p,X,Y,hx,hy); }
      if (p.tf){ var q=hpx(X,Y,p.fh); behind(b,function(tb){ thermos(tb,q[0],q[1]+1); }); }
      if (!p.nb){ var e=hpx(X,Y,g.eN); handbag(b,e[0]-2,e[1]+2); }
      if (p.tk){ var h=hpx(X,Y,p.nh); thermos(b,h[0]-1,h[1]); hand(b,h[0],h[1],ch.cols.hand); }
      if (p.tg){ var n=hpx(X,Y,p.nh); thermos(b,n[0],n[1]-1); hand(b,n[0],n[1],ch.cols.hand); } }
    else if (p.v==='F'){ if (p.tk){ thermos(b,X+hx-1,Y+hy+1); hand(b,X+hx-3,Y+hy,ch.cols.hand); hand(b,X+hx+2,Y+hy,ch.cols.hand); } handbag(b,X+hx+5,Y+hy-3); } },
  anims:{}
});
(function(){ var an=gerda.anims;
  // steht mit der Kanne in beiden Händen (am Depot, in der Zwischenwelt): ruhig, freundlich, sieht sich um
  var Wt=function(o){ return gdP(Object.assign({tk:1,nh:[4,-17],fh:[3,-17]},o||{})); };
  an.wait=seq([Wt({}),1800],[Wt({hd:'b'}),110],[Wt({}),1100],[Wt({hd:'r'}),1200],[Wt({ho:[0,-1]}),600],[Wt({}),1300],[Wt({hd:'b'}),110],[Wt({hd:'l'}),900],[Wt({}),900]);
  an.waitTalk=seq([Wt({hd:'o'}),150],[Wt({}),140],[Wt({hd:'o',ho:[0,-1]}),150],[Wt({}),180]);
  // ohne Kanne (nachdem sie sie hergegeben hat): die Hände vor dem Mantel gefaltet
  an.waitEmpty=seq([gdP({nh:[4,-17],fh:[3,-17]}),1800],[gdP({nh:[4,-17],fh:[3,-17],hd:'b'}),110],[gdP({nh:[4,-17],fh:[3,-17],hd:'r'}),1200],[gdP({nh:[4,-17],fh:[3,-17]}),900]);
  // sitzt auf der Bank oder dem Stuhl, die Kanne auf dem Schoß (die ferne Hand hält sie, die nahe liegt darauf)
  var St=function(o){ return gdSit(Object.assign({tl:1,nh:[7,-17],fh:[5,-16]},o||{})); };
  an.sit=seq([St({}),1800],[St({hd:'b'}),110],[St({}),1200],[St({hd:'r',ho:[1,0]}),1300],[St({}),1100],[St({hd:'b'}),110],[St({ho:[0,-1]}),900]);
  an.sitTalk=seq([St({hd:'o'}),150],[St({nh:[9,-20]}),140],[St({nh:[9,-20],hd:'o'}),150],[St({}),180]);
  // beugt sich vor und legt die Hand auf eine Hand neben sich (Alois' Hand auf seinem Knie)
  an.hand=seq([St({}),80],[St({ln:2,nh:[10,-17],ho:[1,1]}),200],[St({ln:3,nh:[13,-15],ho:[1,1]}),300],[St({ln:3,nh:[13,-15],ho:[1,1],hd:'b'}),110],[St({ln:3,nh:[13,-15],ho:[1,1]}),1800],
    [St({ln:3,nh:[13,-15],ho:[1,2],hd:'s'}),1400],[St({ln:3,nh:[13,-15],ho:[1,1]}),1200]);
  // steigt die hohe Stufe hinauf (Zwischenwelt; die Stufe 12 px hoch, 6 px vor ihr): Fuß hinauf, die nahe Hand greift nach vorn oben, hochdrücken, nachziehen.
  // Endet auf der Stufe (Füße 12 px höher, 6 px weiter vorn); das letzte Bild bleibt stehen.
  var Sp=function(o){ return gdP(Object.assign({tf:1},o||{})); };
  an.step=seq([gdP({nh:[4,-17],fh:[3,-17],tk:1}),200],[Sp({nh:[7,-26],fh:[1,-17],ho:[1,0]}),200],[Sp({st:1,nh:[9,-32],fh:[1,-17],nf:[6,-12,'f'],h:[1,-21],ln:1,ho:[1,0]}),360],
    [Sp({st:1,nh:[10,-34],fh:[2,-18],nf:[6,-12,'f'],ff:[-1,-1,'t'],h:[3,-25],ln:2,ho:[1,1],hd:'b'}),300],[Sp({st:1,nh:[10,-38],fh:[3,-22],nf:[6,-12,'f'],ff:[2,-8,'h'],h:[5,-29],ln:2,ho:[1,1]}),260],
    [Sp({nh:[9,-36],fh:[5,-28],nf:[7,-12,'f'],ff:[5,-12,'f'],h:[6,-32],ln:1,ho:[1,0]}),300],[gdP({nh:[10,-29],fh:[9,-29],tk:1,nf:[7,-12,'f'],ff:[4,-12,'f'],h:[6,-32]}),1200]);
  // reicht die Kanne mit beiden Händen nach vorn
  an.give=seq([Wt({}),120],[gdP({tk:1,nh:[6,-19],fh:[5,-19],ln:1}),200],[gdP({tg:1,nh:[10,-22],fh:[9,-22],ln:2,ho:[1,0]}),300],[gdP({tg:1,nh:[11,-22],fh:[10,-22],ln:2,ho:[1,1]}),1200],
    [gdP({tg:1,nh:[11,-22],fh:[10,-22],ln:2,ho:[1,1],hd:'b'}),110],[gdP({tg:1,nh:[11,-22],fh:[10,-22],ln:2,ho:[1,1]}),900]);
  an.emptyTalk=seq([gdP({nh:[4,-17],fh:[3,-17],hd:'o'}),150],[gdP({nh:[4,-17],fh:[3,-17]}),170]);
  ctxAnim(gerda,'talk',function(){ var acts=M.ACT||{}, id=''; for (var k in acts){ if (acts[k] && acts[k].ch==='gerda'){ id=acts[k].idle||''; break; } } if (/sit|hand/.test(id)) return an.sitTalk; if (/Empty/.test(id)) return an.emptyTalk; return an.waitTalk; });
  // Das letzte Bild von 'step' bleibt stehen (die Engine merkt es sich in a.hold, wie bei springer.jump)
  var st=an.step; st.forEach(function(f){ var ms=f[1]; Object.defineProperty(f,1,{get:function(){ var A2=M.ACT; if (A2) for (var k in A2){ var a=A2[k]; if (a && a.ch==='gerda' && a.mode==='anim' && a.anim===st) a.hold=true; } return ms; },enumerable:true,configurable:true}); }); })();

// alle post()-Haken mit vollständiger Pose aufrufen
['ertl','kraus','kevin','alois','pflege1','hansi','sepp','gerda'].forEach(function(id){
  var ch=M.CHARS[id], f=ch&&ch.post; if (!f) return; ch.post=function(b,p,X,Y,hx,hy){ f(b,full(ch,p,hx,hy),X,Y,hx,hy); }; });

// ---------------------------------------------------------------- Geisterfarben (wie 14_k3_cast_b.js): welche Kleidungsfarbe in welche Geisterfarbe geht, damit man sie erkennt.
// Augen dunkel (k0 -> k1), Haut über die vorhandene Hautrampe (p/q werden nicht überschrieben).
// Hansi: Kittel grau, Wechselgeldtasche braun, Hornbrille dunkel. Sepp: Jacke dunkelblau, Messing an Mütze und Knöpfen, Koffer braun.
// Gerda: Mantel kamelbraun, Tuch blau mit weißen Tupfen, die Kanne bleibt deutlich grün (eine Stufe heller, damit sie im Schein steht;
// sie wird später stofflich und muss wiedererkannt werden).
M.GHOST_OVR.hansi={ k0:'k1', k2:'k2', m0:'m0', m1:'m1', m2:'m2', m3:'m3', m4:'m4', w0:'k2', w1:'e0', w2:'e2', w3:'e3', w4:'e4', y2:'e3', y3:'e4', y4:'s5', r3:'d2', n2:'c2', s5:'s5', s6:'s6' };
M.GHOST_OVR.sepp={ k0:'k1', k2:'k2', n0:'c0', n1:'n1', n2:'n2', n3:'n3', m0:'m0', m1:'m1', m4:'m4', y2:'e3', y3:'e4', y4:'s5', w1:'e0', w2:'e1', w3:'e2', w4:'e3', w5:'e4', s3:'s3', s4:'s4', s5:'s5', s6:'s6' };
M.GHOST_OVR.gerda={ k0:'k1', k2:'k2', b0:'b0', b1:'b1', b2:'b2', b3:'b3', s5:'s5', s6:'s6', w0:'k2', w1:'e0', w2:'s1', w3:'s2', w4:'s3', w5:'s4', h1:'k2', h2:'m0', y3:'e4',
  m0:'m0', m1:'m1', m2:'m2', m3:'m3', m4:'m4', g1:'g2', g2:'g3', g3:'g4', g4:'g5', g5:'s5' };
if (M.PORTRAIT_GHOSTS){ M.PORTRAIT_GHOSTS.hansi=true; M.PORTRAIT_GHOSTS.sepp=true; M.PORTRAIT_GHOSTS.gerda=true; }

// ---------------------------------------------------------------- Kontaktbild der neuen Animationen (wann die Handlung „passiert“, für npc.anim(name,hook)); vorhandene bleiben
(function(){ var c={ write:3, key:4, fix:2, push:2, eat:3, pour:2, count:3, look:2, wave:2, go:3, cap:3, carry:1, turn:2, hand:2, step:5, give:2, hold:1, call:2, shiver:2, drive:2 };
  Object.keys(c).forEach(function(k){ if (M.CONTACT[k]===undefined) M.CONTACT[k]=c[k]; }); })();

// ---------------------------------------------------------------- Farben der gesprochenen Sätze (nur ergänzen)
(function(){ var c={ ertl:P.r5, kraus:P.c5, kevin:P.g6, alois:P.e5, pflege1:P.b4, empfang:P.m4, hansi:P.v4, sepp:P.v5, gerda:P.v4 };
  Object.keys(c).forEach(function(k){ if (M.CAST_COLORS[k]===undefined) M.CAST_COLORS[k]=c[k]; }); })();

})(M);
