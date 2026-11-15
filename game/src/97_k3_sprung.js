/* ===== 97_k3_sprung.js — Kapitel 3: Dinos Sprung von der Alten Brücke als Nahaufnahme in doppelter Auflösung =====
   Wunsch des Autors (15.11.2026): „Die Animationen für den Sprung besser als die restliche Grafik im Spiel.“
   Gezeichnet wird in 640 × 288 (doppelte Auflösung der Szene, gleiche Palette). 99_main.js schaltet die Zeichenfläche dafür auf 640 Pixel
   Breite um, solange M.k3HdLayer() ein Bild liefert; ohne Bildschirm (Tests) und als Rückfall gibt es dieselbe Szene in 320 × 144
   (M.K3CLOSE.sprung, wie die übrigen Nahaufnahmen in 97_k3_nah.js).
   Ablauf (Sekunden ab Beginn der Nahaufnahme, M.K3SPRUNG): Dino steht in der roten Trainingsjacke auf der Brüstung, zieht sie über den Kopf
   und wirft sie weg, schüttelt die Arme aus, breitet sie aus, steht auf den Zehen, geht in die Knie und stößt sich ab. Die Kamera folgt ihm
   durch eine hohe Welt (Himmel, Velež, Westufer, Querschnitt der Brücke, Schlucht, Neretva): Schwalbe mit Flügelarmen, kurz vor dem Wasser
   Arme an den Körper, Füße voran, Zehen gestreckt. Gischtkrone aus einzelnen Tropfen, Wassersäule, Schaum, Ringe mit Licht und Schatten,
   Blasen unter Wasser. Dann taucht er flussab auf, schüttelt das Wasser aus dem Haar und winkt mit offener Hand. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash, NH=M.K3NAH; if (!NH) return;
var shape=NH.shape, R=NH.R, ra=NH.ra, fbm=NH.fbm, cl=NH.cl;
var SP={leave:4.75,entry:7.32,surf:8.8,end:12.2, x0:96, feet0:150, WY:420, WH:470, vx:26, vy:-38, g:111};
M.K3SPRUNG=SP;
var VW=320, VH=144;
function rd(v){ return Math.round(v); }
function sm(k){ k=cl(k,0,1); return k*k*(3-2*k); }

// ---------------------------------------------------------------- Welt (einmal je Maßstab)
var WORLD={};
function world(S){ if (WORLD[S]) return WORLD[S];
  var w=VW*S, h=SP.WH*S, b=new M.Buf(w,h,P.k0), x, y;
  var SKYR=R('b3 b4 b5 s6'), CLD=R('s4 s5 s6 l1'), ST=R('o1 o2 o3 o4 o5'), CLF=R('k2 m1 m2 c2 m3 c3 s4'), FAR=R('c2 c3 s4 s5'), HAZE=R('j1 j2 c2 c3 s4'), WAT=R('j1 j2 j3 j4 j5');
  for (y=0;y<h;y++){ var Y=y/S; for (x=0;x<w;x++){ var X=x/S, c=null;
    if (Y<160){   // Himmel mit Wolkenbänken
      c=ra(SKYR,cl(0.15+Y/160*0.8+(fbm(X*0.02,Y*0.06,31)-0.5)*0.1,0,1),x,y);
      var cn=fbm(X*0.011+3,Y*0.045,41)+(fbm(X*0.05,Y*0.12,43)-0.5)*0.25; if (cn>0.6 && Y<110){ var sh=fbm(X*0.011+3,(Y+3)*0.045,41); c=ra(CLD,cl(0.55+(cn-0.6)*2.2-(sh<cn?0:0.35),0,1),x,y); }
      // Velež: Kamm, Rinnen, Schatten nach rechts
      var top=84+Math.sin(X*0.017)*8+fbm(X*0.03,1,5)*14+(fbm(X*0.15,2,6)-0.5)*3;
      if (Y>=top){ var slope=(84+Math.sin((X+1)*0.017)*8+fbm((X+1)*0.03,1,5)*14)-top, gully=Math.abs(Math.sin(X*0.23+fbm(X*0.05,Y*0.02,8)*6)); c=ra(FAR,cl(0.62-(Y-top)/120+slope*0.06+(gully>0.985&&Y-top>6?-0.08:0)+(fbm(X*0.08,Y*0.08,7)-0.5)*0.2+(fbm(X*0.25,Y*0.1,9)-0.5)*0.08,0,1),x,y); } }
    if (Y>=140 && Y<SP.WY+4){   // die Schlucht
      var lw=54+Math.sin(Y*0.02)*12+fbm(2,Y*0.03,3)*18, rw=274-Math.sin(Y*0.025+1)*10-fbm(3,Y*0.03,4)*22, u=(Y-140)/(SP.WY-140);
      if ((X<lw || X>rw) && Y>146){ var rk=fbm(X*0.06,Y*0.05,9), strata=Math.sin(Y*0.35+fbm(X*0.03,Y*0.02,12)*5); var lit=(X<lw)?(lw-X<4?0.18:0):(X-rw<4?-0.2:0);
        c=ra(CLF,cl(0.88-u*0.5+rk*0.28-0.15+lit+(strata>0.85?-0.15:0),0,1),x,y);
        var veg=fbm(X*0.12+7,Y*0.12,21); if (veg>0.68 && u<0.75 && hash(x>>1,y>>1)<0.8){ c=(veg>0.73)?P.g2:(hash(x,y)<0.5?P.g1:P.g2); if (veg>0.76 && hash(x+1,y)<0.35) c=P.g3; } }   // Gebüsch, wintergrün
      else if (Y>=148){ var fr=fbm(X*0.05,Y*0.02,11); c=ra(HAZE,cl(0.8-u*0.62+(fr-0.5)*0.18,0,1),x,y); if (u>0.78 && fbm(X*0.08+3,Y*0.3,19)>0.66) c=P.j4; if (u>0.85 && hash(x,y)<0.01) c=P.s6; } }
    if (Y>=SP.WY){ var uu=(Y-SP.WY)/(SP.WH-SP.WY); c=ra(WAT,cl(0.62-uu*0.45+(fbm(X*0.04,Y*0.18,13)-0.5)*0.3,0,1),x,y); }
    if (c!==null) b.d[y*w+x]=c; } }
  // die Stadt am Westufer: Häuser mit Steinplattendach, Fenster, ein Minarett mit Umgang
  for (var i=0;i<24;i++){ var hx=(132+i*7+hash(i,4)*4)*S, hw=(5+hash(i,5)*3)*S, hy=(134+hash(i,6)*8+Math.max(0,i-12))*S, hh=9*S;
    for (var yy=rd(hy);yy<hy+hh;yy++) for (var xx=rd(hx);xx<hx+hw;xx++){ var rel=(yy-hy)/S, c2=rel<2.2?((xx+yy)%3===0?P.m1:P.m2):(hash(xx,yy)<0.06?P.s4:P.s5); if (rel<2.2 && xx>hx+hw-S) c2=P.m1; b.px(xx,yy,c2); }
    if (S>1) for (var wi=0;wi<2;wi++){ var wx=rd(hx+(1.2+wi*2.4)*S), wy=rd(hy+4.5*S); if (wx<hx+hw-S){ b.px(wx,wy,P.k2); b.px(wx,wy+1,P.k2); } } }
  for (var ym=112*S;ym<140*S;ym++){ for (var mx=0;mx<S;mx++){ b.px(214*S+mx,ym,P.s6); b.px(215*S+mx,ym,P.s5); } }
  for (var mx2=-S;mx2<3*S;mx2++) b.px(214*S+mx2,121*S,P.s4); for (var cy=0;cy<5*S;cy++){ var cw=Math.max(0,Math.round((5*S-cy)/5*1.5)); for (var cx=-cw;cx<=cw+S-1;cx++) b.px(214*S+cx,112*S-cy,P.m2); }
  // Querschnitt der Brücke links: Brüstung, Fahrbahn, der Bogenring fällt nach links unten weg (Kalkstein mit Fugen)
  for (y=SP.feet0*S;y<h;y++){ var Y2=y/S; for (x=0;x<132*S;x++){ var X2=x/S, edge=Y2<SP.feet0+34?118:118-Math.pow((Y2-SP.feet0-34)/22,1.6)*12; if (X2>edge) continue; if (Y2>SP.feet0+34 && X2<edge-34-(Y2-SP.feet0)*0.05) continue;
      var row=Math.floor(Y2/12), bl=Math.floor((X2+(row%2)*9)/18), c3=ra(ST,cl(0.72-(X2<edge-3?0:0.25)-(Y2-SP.feet0)/500+(fbm(bl*1.7+X2*0.04,Y2*0.07,3)-0.5)*0.3+(fbm(X2*0.4,Y2*0.4,5)-0.5)*0.12,0,1),x,y);
      var fy=(Y2%12), fx=((X2+(row%2)*9)%18); if (fy<1/S || fx<1/S) c3=P.o1; else if (fy<2/S) c3=M.UP[c3]||c3;
      if (Math.abs(Y2-SP.feet0)<1/S) c3=P.o5; if (X2>=edge-1/S) c3=P.o1; b.d[y*w+x]=c3; } }
  // Wasser: Rauschkarte für die Bewegung (einmal), Breite = Welt, Höhe = Wasserstreifen
  var wh=(SP.WH-SP.WY)*S, nz=new Float32Array(w*wh); for (y=0;y<wh;y++) for (x=0;x<w;x++) nz[y*w+x]=fbm(x/S*0.05,(y/S+SP.WY)*0.2,17);
  WORLD[S]={b:b,w:w,h:h,nz:nz,wh:wh}; return WORLD[S]; }

// ---------------------------------------------------------------- Posen
var KP=[
  [0.0, {bA:0, nk:0.25, a:[0.06,-0.04], e:[0.2,0.25], h:[0,0], k:[0,0], jacket:1, lift:0, toe:0, open:0.2}],
  [1.0, {bA:0.05, nk:0.3, a:[0.7,0.6], e:[1.7,1.6], h:[0,0], k:[0,0], jacket:1, lift:0, toe:0, open:0}],
  [1.6, {bA:-0.05, nk:0.1, a:[2.9,2.8], e:[0.35,0.3], h:[0,0], k:[0,0], jacket:1, lift:0, toe:0, open:0}],
  [1.65,{bA:-0.05, nk:0.1, a:[2.9,2.8], e:[0.35,0.3], h:[0,0], k:[0,0], jacket:0, lift:0, toe:0, open:0.3}],
  [2.3, {bA:0, nk:0.05, a:[0.25,-0.2], e:[0.4,0.4], h:[0,0], k:[0,0], jacket:0, lift:0, toe:0, open:0.4}],
  [3.1, {bA:0, nk:0, a:[0.25,-0.2], e:[0.4,0.4], h:[0,0], k:[0,0], jacket:0, lift:0, toe:0, open:0.4}],
  [3.7, {bA:-0.08, nk:-0.25, a:[-1.9,1.95], e:[0.1,0.1], h:[0,0], k:[0,0], jacket:0, lift:2, toe:0.6, open:1}],
  [4.2, {bA:-0.08, nk:-0.25, a:[-1.9,1.95], e:[0.1,0.1], h:[0,0], k:[0,0], jacket:0, lift:2, toe:0.6, open:1}],
  [4.55,{bA:0.4, nk:0.1, a:[-2.3,-2.1], e:[0.2,0.2], h:[1.0,0.95], k:[1.6,1.55], jacket:0, lift:-9, toe:0, open:0.6}],
  [4.85,{bA:0.35, nk:-0.2, a:[2.3,2.5], e:[0.1,0.1], h:[-0.15,-0.1], k:[0.05,0], jacket:0, lift:0, toe:1, open:1}],
  [5.6, {bA:1.05, nk:-0.55, a:[-1.65,-2.2], e:[0.1,0.1], h:[-0.1,-0.05], k:[0.1,0.05], jacket:0, lift:0, toe:1, open:1}],
  [6.6, {bA:1.25, nk:-0.6, a:[-1.7,-2.25], e:[0.1,0.1], h:[-0.15,-0.1], k:[0.15,0.1], jacket:0, lift:0, toe:1, open:1}],
  [7.1, {bA:0.12, nk:-0.1, a:[0.08,-0.08], e:[0,0], h:[0,0], k:[0,0], jacket:0, lift:0, toe:1, open:0}],
  [9.9, {bA:0.1, nk:-0.1, a:[0.08,-0.08], e:[0,0], h:[0,0], k:[0,0], jacket:0, lift:0, toe:1, open:0}]];
function mixP(a,b,k){ var o={}, kk=sm(k); for (var n in a){ if (Array.isArray(a[n])) o[n]=[a[n][0]+(b[n][0]-a[n][0])*kk,a[n][1]+(b[n][1]-a[n][1])*kk]; else o[n]=a[n]+((b[n]===undefined?a[n]:b[n])-a[n])*kk; } return o; }
function poseAt(t){ for (var i=0;i<KP.length-1;i++) if (t<KP[i+1][0]) return mixP(KP[i][1],KP[i+1][1],(t-KP[i][0])/(KP[i+1][0]-KP[i][0])); return KP[KP.length-1][1]; }
function hipAt(t,p){ var hy0=SP.feet0-28; if (t<SP.leave) return [SP.x0,hy0-(p.lift||0)]; var d=t-SP.leave; return [SP.x0+SP.vx*d, hy0+SP.vy*d+0.5*SP.g*d*d]; }

// ---------------------------------------------------------------- Körper-Renderer: weiche Formen aus Distanzfeldern
// Teile: {a,b,r0,r1} verjüngte Kapsel (Radius r0 bei a, r1 bei b). Vereinigung mit weichem Übergang (k), Licht aus der Neigung der Fläche
// (Normale aus dem Distanzfeld), Glanzlicht, Umriss in dunklem Hautton statt Schwarz (auf der Lichtseite eine Stufe heller).
var LX=-0.45, LY=-0.62, LZ=0.64; (function(){ var l=Math.sqrt(LX*LX+LY*LY+LZ*LZ); LX/=l; LY/=l; LZ/=l; })();
var FLX=0.78, FLY=0.1, FLZ=0.62, FILL=0;   // Fülllicht von der Gegenseite (Himmel), damit die abgewandte Seite nicht absäuft
function smin(a,b,k){ var h=Math.max(k-Math.abs(a-b),0)/k; return Math.min(a,b)-h*h*k*0.25; }
function sdCap(px,py,q){ var ax=q.a[0], ay=q.a[1], bx=q.b[0]-ax, by=q.b[1]-ay, L=bx*bx+by*by||1e-6, tt=((px-ax)*bx+(py-ay)*by)/L; tt=tt<0?0:(tt>1?1:tt); var dx=px-ax-bx*tt, dy=py-ay-by*tt; return Math.sqrt(dx*dx+dy*dy)-(q.r0+(q.r1-q.r0)*tt); }
function body(fb,parts,RM,o){ o=o||{}; var k=o.k||1, x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  parts.forEach(function(q){ var r=Math.max(q.r0,q.r1)+k; x0=Math.min(x0,q.a[0]-r,q.b[0]-r); y0=Math.min(y0,q.a[1]-r,q.b[1]-r); x1=Math.max(x1,q.a[0]+r,q.b[0]+r); y1=Math.max(y1,q.a[1]+r,q.b[1]+r); });
  x0=Math.max(-2,Math.floor(x0)-2); y0=Math.max(-2,Math.floor(y0)-2); x1=Math.min(fb.w+1,Math.ceil(x1)+2); y1=Math.min(fb.h+1,Math.ceil(y1)+2); var w=x1-x0+1, h=y1-y0+1; if (w<3||h<3) return;
  var D=new Float32Array(w*h);
  for (var y=0;y<h;y++) for (var x=0;x<w;x++){ var px=x0+x+0.5, py=y0+y+0.5, d=1e9; for (var i=0;i<parts.length;i++){ var s=sdCap(px,py,parts[i]); d=(d===1e9)?s:smin(d,s,k); } D[y*w+x]=d; }
  var dep=o.depth||3, amb=o.amb===undefined?0.18:o.amb, n=RM.length;
  for (var y2=1;y2<h-1;y2++) for (var x2=1;x2<w-1;x2++){ var kk=y2*w+x2, dv=D[kk], X=x0+x2, Y=y0+y2; if (X<0||Y<0||X>=fb.w||Y>=fb.h) continue;
    var gx=(D[kk+1]-D[kk-1])*0.5, gy=(D[kk+w]-D[kk-w])*0.5, gl=Math.sqrt(gx*gx+gy*gy)||1, nx=gx/gl, ny=gy/gl;
    if (dv<0){ var de=Math.min(1,-dv/dep), sx=nx*(1-de), sy=ny*(1-de), sz=0.25+de*0.95, nl=Math.sqrt(sx*sx+sy*sy+sz*sz); sx/=nl; sy/=nl; sz/=nl;
      var dif=Math.max(0,sx*LX+sy*LY+sz*LZ), v=amb+dif*(1-amb)*0.95, fl=(o.fill===undefined?FILL:o.fill); if (fl) v+=fl*Math.max(0,sx*FLX+sy*FLY+sz*FLZ-0.35); if (o.tex) v+=o.tex(X,Y,dv);
      var hz=sz+LZ, hl=Math.sqrt((sx*0+LX)*(LX)+(LY)*(LY)+hz*hz)||1, spec=Math.pow(Math.max(0,(sx*LX+sy*LY+sz*(LZ+1))/Math.sqrt(LX*LX+LY*LY+(LZ+1)*(LZ+1))),18);
      var c=ra(RM,cl(v,0,0.999),X,Y); if (spec>0.55 && o.spec!==false && bayer(X,Y)<spec) c=o.specC||RM[n-1]; if (o.alpha && dv>-1.2 && bayer(X,Y)<0.4) continue; fb.px(X,Y,c); }
    else if (dv<1.05 && o.line!==false){ var inner=D[kk-1]<0||D[kk+1]<0||D[kk-w]<0||D[kk+w]<0; if (!inner) continue; var lit=(nx*LX+ny*LY)>0.35; fb.px(X,Y,lit?(o.lineLit||RM[1]):(o.line||RM[0])); } }
  return {x0:x0,y0:y0,w:w,h:h,D:D}; }
function inside(sh,X,Y){ if (!sh) return false; var x=X-sh.x0, y=Y-sh.y0; return x>=0&&y>=0&&x<sh.w&&y<sh.h&&sh.D[y*sh.w+x]<-0.4; }

// ---------------------------------------------------------------- Dino: anatomische Figur
var SK=R('q0 q1 q2 q3 q4 p4'), SKD=R('q0 q0 q1 q2 q3'), TRR=R('k0 n0 n1 n2 n3'), JAC=R('r1 r2 r3 r4'), JACD=R('r0 r1 r2 r3'), HAIRR=R('k0 k1 h1 h2 h3');
function dir(th){ return [Math.sin(th), Math.cos(th)]; }
function add(p,d,l){ return [p[0]+d[0]*l, p[1]+d[1]*l]; }
function cap(a,b,r0,r1){ return {a:a,b:b,r0:r0,r1:(r1===undefined?r0:r1)}; }
// Glied aus zwei Segmenten (Oberarm/Unterarm oder Oberschenkel/Unterschenkel) mit Muskelwölbungen; perp: Seite „vorn“
function limbParts(J0,th1,l1,th2,l2,S,spec){ var d1=dir(th1), p1=[Math.cos(th1),-Math.sin(th1)], J1=add(J0,d1,l1*S), d2=dir(th2), p2=[Math.cos(th2),-Math.sin(th2)], J2=add(J1,d2,l2*S), P=[];
  function at(J,d,pp,u,v,l){ return [J[0]+d[0]*u*l*S+pp[0]*v*S, J[1]+d[1]*u*l*S+pp[1]*v*S]; }
  P.push(cap(J0,J1,spec.r0*S,spec.r1*S)); P.push(cap(J1,J2,spec.r2*S,spec.r3*S));
  (spec.b1||[]).forEach(function(m){ P.push(cap(at(J0,d1,p1,m[0],m[2],l1),at(J0,d1,p1,m[1],m[2],l1),m[3]*S,m[4]*S)); });
  (spec.b2||[]).forEach(function(m){ P.push(cap(at(J1,d2,p2,m[0],m[2],l2),at(J1,d2,p2,m[1],m[2],l2),m[3]*S,m[4]*S)); });
  return {P:P,J1:J1,J2:J2,d2:d2,p2:p2}; }
var ARM={r0:2.35,r1:1.7,r2:1.85,r3:1.15, b1:[[0.08,0.32,-0.2,2.75,2.2],[0.3,0.72,0.55,1.55,1.35],[0.25,0.7,-0.5,1.5,1.2]], b2:[[0.04,0.42,0.45,1.75,1.25]]};   // Schulter, Bizeps, Trizeps; Unterarmmuskel
var LEG={r0:3.7,r1:2.35,r2:2.2,r3:1.15, b1:[[0.12,0.78,0.8,2.8,1.95],[0.18,0.7,-0.75,2.55,1.8],[0.05,0.45,0.0,3.0,2.4]], b2:[[0.08,0.5,-1.05,2.45,1.4],[0.0,0.12,0.6,1.5,1.2],[0.55,0.95,0.15,1.35,1.05]]};   // Quadrizeps, Beinbeuger; Wade, Kniescheibe
function handParts(wr,th,open,S,mirror){ var d=dir(th), f=mirror?-1:1, side=dir(th+Math.PI/2*f), pa=add(wr,d,3*S), P=[cap(add(wr,d,0.2*S),pa,1.3*S,1.15*S)];
  for (var i=0;i<4;i++){ var sp=(i-1.5)*(0.1+open*0.24), len=(i===0||i===3?2.2:2.7)*S*(0.78+open*0.22), cur=(1-open)*0.85*f, b0=add(pa,side,(i-1.5)*0.6*S), e1=add(b0,dir(th+sp+cur*0.45),len*0.58), e2=add(e1,dir(th+sp+cur),len*0.46);
    P.push(cap(b0,e1,0.6*S,0.5*S)); P.push(cap(e1,e2,0.5*S,0.4*S)); }
  var tb=add(wr,d,1.1*S), tm=add(tb,dir(th+(0.95+open*0.45)*f),1.5*S), te=add(tm,dir(th+(0.55+open*0.4)*f),1.4*S); P.push(cap(add(tb,side,-0.6*S*f),tm,0.75*S,0.58*S)); P.push(cap(tm,te,0.58*S,0.45*S));
  return P; }
function diver(fb,hx,hy,p,S,O){ O=O||{}; FILL=0.32; var bA=p.bA||0, U=[Math.sin(bA),-Math.cos(bA)], F=[Math.cos(bA),Math.sin(bA)], H=[hx,hy];
  function L(u,v){ return [hx+(U[0]*u+F[0]*v)*S, hy+(U[1]*u+F[1]*v)*S]; }
  var td=-bA, jac=p.jacket>0.5, K1=0.9*S, dark0=P.k0;
  var Sh=L(16.6,-0.4), NB=L(18.4,0.5);
  function leg(i,dark){ var th=td+p.h[i], ts=th-p.k[i], lp=limbParts(H,th,14,ts,14,S,LEG), an=lp.J2, ft=dir(ts+(Math.PI/2)*(1-p.toe));
    var heel=add(an,lp.p2,-0.9*S), toe=add(an,ft,5.2*S), mid=add(an,ft,2.6*S);
    lp.P.push(cap(heel,add(an,lp.d2,-0.4*S),1.3*S,1.2*S)); lp.P.push(cap(an,mid,1.35*S,1.15*S)); lp.P.push(cap(mid,toe,1.1*S,0.75*S));
    body(fb,lp.P,dark?SKD:SK,{k:1.1*S,depth:2.6*S,line:dark?P.k0:P.q0,lineLit:dark?P.q0:P.q1,amb:dark?0.1:0.2}); }
  function arm(i,dark){ var ta=td+p.a[i], tf=ta+p.e[i], lp=limbParts(Sh,ta,10,tf,9,S,ARM), wr=add(lp.J2,lp.d2,0.2*S);
    if (jac){ var JP=[cap(Sh,lp.J1,2.9*S,2.4*S),cap(lp.J1,add(lp.J1,lp.d2,8*S),2.4*S,2.1*S)]; body(fb,JP,dark?JACD:JAC,{k:K1,depth:2.6*S,line:P.k0,lineLit:P.r1});
      body(fb,[cap(add(lp.J1,lp.d2,7.6*S),add(lp.J1,lp.d2,9*S),2.0*S,1.8*S)],R('s2 s3 s4 s5 s6'),{k:K1,line:P.k1,lineLit:P.s3}); }
    else body(fb,lp.P,dark?SKD:SK,{k:1.0*S,depth:2.4*S,line:dark?P.k0:P.q0,lineLit:dark?P.q0:P.q1,amb:dark?0.1:0.2});
    body(fb,handParts(wr,tf,p.open,S,dark),dark?SKD:SK,{k:0.55*S,depth:1.2*S,line:dark?P.k0:P.q0,lineLit:dark?P.q0:P.q1,amb:dark?0.12:0.25}); }
  arm(0,true); leg(0,true);
  // Rumpf: Becken, Gesäß, Taille, Brustkorb, Brust, Schultern, Nacken
  var TP=jac?[cap(L(-1,0),L(2.4,0.2),4.9*S,4.8*S),cap(L(2.4,0.2),L(8,0.4),4.7*S,5.0*S),cap(L(8,0.4),L(14,0.6),5.2*S,5.5*S),cap(L(13.8,-0.4),L(17,-0.2),5.0*S,4.0*S),cap(L(-0.6,-1.6),L(-0.6,-1.6),3.6*S)]
                :[cap(L(-1,0),L(2.2,0.2),4.4*S,4.2*S),cap(L(-0.6,-1.7),L(0.4,-1.7),3.2*S,3.0*S),cap(L(2.2,0.3),L(7.6,0.5),4.0*S,4.15*S),cap(L(7.6,0.5),L(13.4,0.9),4.4*S,4.9*S),
                  cap(L(11.6,2.3),L(13.6,2.5),2.6*S,2.7*S),cap(L(4.2,1.9),L(9.4,2.2),2.2*S,2.3*S),cap(L(13.8,-0.6),L(17.1,-0.3),4.5*S,3.5*S),cap(L(16.2,-1.2),L(18.3,0.1),2.3*S,1.9*S)];
  var tor=body(fb,TP,jac?JAC:SK,{k:1.4*S,depth:3.6*S,line:P.k0,lineLit:jac?P.r1:P.q1,amb:0.2});
  if (jac){ for (var q=0;q<=22;q++){ var z=L(0.6+q*0.75,4.6); fb.px(rd(z[0]),rd(z[1]),P.s6); var z2=L(0.6+q*0.75,4.0); if (S>1) fb.px(rd(z2[0]),rd(z2[1]),q%3?P.s5:P.s4); }
    var c0=L(16.4,2.6), c1=L(17.8,-1.6); body(fb,[cap(c0,c1,1.3*S,1.2*S)],JACD,{k:K1,line:P.k0}); }
  else if (S>1){ // Muskelzeichnung, nur auf der Haut: Brustunterkante, Mittellinie, Bauchfelder, Leistenlinie
    var mk=function(u,v,c){ var m=L(u,v), X=rd(m[0]), Y=rd(m[1]); if (inside(tor,X,Y)) fb.px(X,Y,c); };
    for (var a=0;a<9;a++){ var uu=11.2-Math.sin(a/8*Math.PI)*0.5, vv=1.2+a*0.5; mk(uu,vv,P.q1); mk(uu+0.45,vv,P.q2); }
    for (var a2=0;a2<10;a2++) mk(3.8+a2*0.75,3.55,a2%2?P.q2:P.q1);
    [9.6,8.0,6.4].forEach(function(u){ mk(u,2.6,P.q2); mk(u,3.0,P.q2); mk(u+0.4,2.8,P.q4); });
    for (var a3=0;a3<6;a3++) mk(2.8+a3*0.55,-2.4+a3*0.45,P.q1);
    mk(4.6,3.75,P.q0); }
  leg(1,false);
  // Badehose über dem Ansatz der Beine: Bund, Kordel, rote Naht
  var BP=[cap(L(-1.1,0.1),L(2.6,0.25),4.45*S,4.3*S),cap(L(-0.5,-1.6),L(0.5,-1.65),3.15*S,2.95*S)], th0=td+p.h[1], th1=td+p.h[0], HM=[];
  [[th0,4.6],[th1,4.1]].forEach(function(q){ var dd=dir(q[0]), pp=[Math.cos(q[0]),-Math.sin(q[0])], a0=add(add(H,dd,0.4*S),pp,0.15*S), a1=add(add(H,dd,q[1]*S),pp,0.15*S);
    BP.push(cap(a0,a1,3.75*S,3.55*S)); HM.push([a1,dd,pp]); });
  var tr=body(fb,BP,TRR,{k:0.5*S,depth:3.4*S,line:P.k0,lineLit:P.n1,amb:0.26,spec:false,tex:function(X,Y){ return (hash(X>>1,Y)-0.5)*0.06; }});
  if (S>1){ for (var bb=-9;bb<=9;bb++){ var wb=L(2.9,bb*0.5); if (inside(tr,rd(wb[0]),rd(wb[1])+1)||inside(tr,rd(wb[0]),rd(wb[1]))) fb.px(rd(wb[0]),rd(wb[1]),P.n3); }
    // Saum an den Beinöffnungen (nur die vordere zeigt sich ganz), Falten von der Leiste schräg nach außen
    HM.forEach(function(m,mi){ for (var hv=-3.4;hv<=3.4;hv+=0.4){ var hp2=add(add(m[0],m[2],hv*S),m[1],-0.5*S), Xh=rd(hp2[0]), Yh=rd(hp2[1]); if (inside(tr,Xh,Yh)) fb.px(Xh,Yh,mi?P.n1:P.k0); } });
    for (var fo=0;fo<6;fo++){ var f0=add(add(H,dir(th0),(1.0+fo*0.45)*S),[Math.cos(th0),-Math.sin(th0)],(1.6-fo*0.5)*S), Xf=rd(f0[0]), Yf=rd(f0[1]); if (inside(tr,Xf,Yf)) fb.px(Xf,Yf,P.n1); }
    var kc=L(2.3,4.2); fb.px(rd(kc[0]),rd(kc[1]),P.s5); fb.px(rd(kc[0]-U[0]*S),rd(kc[1]-U[1]*S),P.s5);
    for (var sn=0;sn<8;sn++){ var sm2=add(H,dir(th0),(0.4+sn*0.55)*S), sd=add(sm2,[Math.cos(th0),-Math.sin(th0)],3.4*S); if (inside(tr,rd(sd[0]),rd(sd[1]))) fb.px(rd(sd[0]),rd(sd[1]),P.r3); } }
  // Hals, Kopf im Profil, Haar
  var nk=p.nk||0, ha=bA+nk, HU=[Math.sin(ha),-Math.cos(ha)], HF=[Math.cos(ha),Math.sin(ha)], HC=add(NB,HU,6.5*S);
  function K(u,v){ return [HC[0]+(HU[0]*u+HF[0]*v)*S, HC[1]+(HU[1]*u+HF[1]*v)*S]; }
  body(fb,[cap(NB,K(-3.6,-0.4),2.3*S,2.05*S),cap(L(17.2,1.2),K(-3.2,1.3),1.0*S,0.9*S)],SK,{k:0.9*S,depth:2*S,line:P.q0,lineLit:P.q1});
  var HP=[cap(K(0.6,-0.4),K(0.6,-0.4),4.2*S),cap(K(1.2,-1.6),K(-1.0,-1.5),3.6*S,3.4*S),cap(K(-1.0,1.2),K(-3.7,2.5),2.9*S,1.8*S),cap(K(-4.45,3.2),K(-4.45,3.2),1.45*S),
    cap(K(2.0,3.3),K(1.7,4.1),1.05*S,0.85*S),cap(K(0.9,4.0),K(-1.1,5.5),0.95*S,0.55*S),cap(K(-1.9,4.3),K(-2.0,4.4),0.7*S,0.6*S),cap(K(-2.9,4.15),K(-3.0,4.15),0.6*S,0.55*S)];
  var hd=body(fb,HP,SK,{k:0.9*S,depth:3.0*S,line:P.q0,lineLit:P.q1,amb:0.3,fill:0.42,tex:function(X,Y,dv){ return 0; }});
  // Dreitagebart: Kiefer und Kinn, gerastert dunkler
  if (S>1) for (var bu=-5.2;bu<=-1.2;bu+=0.5) for (var bv=0.6;bv<=4.6;bv+=0.5){ var bp=K(bu,bv), X2=rd(bp[0]), Y2=rd(bp[1]); if (inside(hd,X2,Y2) && hash(X2,Y2)<0.2 && !(bu>-2.4 && bv>3.2)) fb.px(X2,Y2,P.q2); }
  // Haar: kurz rasiert, Schädelform plus etwas Volumen oben, Strähnen; nass glänzend
  var HRP=[cap(K(3.0,-2.0),K(3.35,2.0),1.65*S,1.15*S),cap(K(2.3,-3.2),K(-0.3,-3.75),1.55*S,1.2*S),cap(K(3.5,0.0),K(3.5,0.0),1.7*S)];
  body(fb,HRP,HAIRR,{k:1.2*S,depth:1.6*S,line:P.k0,lineLit:P.k1,amb:0.1,specC:O.wet?P.n3:P.h3,tex:function(X,Y){ return (hash(X,Y>>1)-0.5)*0.35; }});
  var ear=K(0.2,-0.9); body(fb,[cap(add(ear,HU,0.7*S),add(ear,HU,-0.7*S),0.85*S,0.7*S)],SK,{k:0.5*S,line:P.q0,lineLit:P.q1,amb:0.3,fill:0.3}); if (S>1){ var eh=add(ear,HF,0.1*S); fb.px(rd(eh[0]),rd(eh[1]),P.q1); }
  if (S>1) for (var so=0;so<5;so++){ var sk=K(1.0+(so%2)*0.5,1.7+so*0.35), Xs=rd(sk[0]), Ys=rd(sk[1]); if (inside(hd,Xs,Ys)) fb.px(Xs,Ys,P.q2); }   // Augenhöhle im Schatten
  if (S>1){ var ec=K(0.3,-0.7); fb.px(rd(ec[0]),rd(ec[1]),P.q0); }
  // Auge (Weiß, Iris, Lid), Braue, Nasenloch, Mund
  var e1=K(1.15,2.55), e2=K(1.15,2.05), lid=K(1.75,2.4); fb.px(rd(e1[0]),rd(e1[1]),P.k0); if (S>1){ fb.px(rd(e2[0]),rd(e2[1]),P.s5); fb.px(rd(lid[0]),rd(lid[1]),P.q0); }
  for (var bw=0;bw<4;bw++){ var br=K(2.5,1.3+bw*0.75); fb.px(rd(br[0]),rd(br[1]),P.h1); }
  var nl=K(-0.6,4.0), mo=K(-2.4,3.45), mo2=K(-2.35,4.0); fb.px(rd(nl[0]),rd(nl[1]),P.q1); fb.px(rd(mo[0]),rd(mo[1]),P.q0); if (S>1) fb.px(rd(mo2[0]),rd(mo2[1]),P.q1);
  arm(1,false); FILL=0;
  return {head:HC}; }

// ---------------------------------------------------------------- ein Bild
var TMP={};
function tmpBuf(S){ var w=VW*S, h=VH*S; if (!TMP[S]) TMP[S]=new M.Buf(w,h,T); return TMP[S]; }
function render(fb,t,S){ var Wd=world(S), p=poseAt(t), w=VW*S, h=VH*S;
  if (t>2.3 && t<3.1){ var sh=Math.sin((t-2.3)*30)*0.35*(1-(t-2.3)/0.8); p.a=[p.a[0]+sh,p.a[1]-sh]; p.e=[p.e[0]+sh*0.6,p.e[1]-sh*0.6]; }   // Arme ausschütteln
  if (t>3.7 && t<4.2) p.lift=2+Math.sin((t-3.7)*9)*0.6;   // atmen auf den Zehen
  var ent=SP.entry, ex=SP.x0+SP.vx*(ent-SP.leave), hp=hipAt(Math.min(t,ent+0.6),p); if (t>ent) hp=[ex, Math.min(SP.WY+28, hp[1])];
  var camY=cl(hp[1]-62,70,SP.WH-VH); if (t>ent) camY=SP.WH-VH; var cy=rd(camY*S);
  for (var y=0;y<h;y++){ var row=(y+cy)*w; for (var x=0;x<w;x++) fb.d[y*w+x]=Wd.b.d[row+x]; }
  var sY=(SP.WY-camY)*S;   // Wasserlinie im Bild
  // bewegtes Wasser: Rauschkarte, flussab verschoben; Lichtkanten und Schaumstreifen
  var wy0=Math.max(0,Math.ceil(sY)); for (var y2=wy0;y2<h;y2++){ var ny=y2+cy-SP.WY*S; if (ny<0||ny>=Wd.wh) continue; var sp=Math.round(t*(14+ny/S*0.6)*S);
    for (var x2=0;x2<w;x2++){ var v=Wd.nz[ny*w+((x2-sp)%w+w)%w]; if (v>0.68) fb.d[y2*w+x2]=P.j5; else if (v>0.64) fb.d[y2*w+x2]=P.j4; else if (v<0.3 && bayer(x2,y2)<0.4) fb.d[y2*w+x2]=P.j1; if (v>0.715 && hash(x2>>1,y2)<0.25) fb.d[y2*w+x2]=P.s6; } }
  // Touristen vorn: Hinterköpfe und Handys
  if (camY<150 && t<SP.leave+0.6){ var TK=R('k0 k1 k2'); for (var i=0;i<6;i++){ var tx=(10+i*27+hash(i,2)*8)*S, ty=(SP.feet0+68+hash(i,3)*6-camY)*S; if (ty>h+20*S) continue;
      shape(fb,[{ell:[tx,ty,6.5*S,7.5*S]},{cap:[tx-9*S,ty+13*S,tx+9*S,ty+13*S],r:8*S}],{ramp:TK,outline:false});
      if (i!==2 && i!==5){ var px0=rd(tx+(i%2?5:-4)*S), py0=rd(ty-(15+Math.sin(t*2+i))*S); fb.rect(px0,py0,4*S,6*S,P.k1); fb.rect(px0+S,py0+S,2*S,4*S,(t>SP.leave&&t<SP.leave+0.3&&i===1)?P.l1:P.n3); shape(fb,[{cap:[px0+2*S,py0+6*S,tx,ty+6*S],r:1.5*S}],{ramp:TK,outline:false}); } } }
  // die Jacke fliegt nach links weg (Falten, Ärmel flattern) und fällt hinter die Brüstung
  if (t>1.6 && t<3.4){ var dt=t-1.6, jx=SP.x0-6-34*dt, jy=SP.feet0-48-46*dt+0.5*160*dt*dt; if (!(jy>SP.feet0-2 && jx<120)){ var a0=dt*7, sx2=jx*S, sy2=(jy-camY)*S, c0=Math.cos(a0), s0=Math.sin(a0);
      function J(u,v){ return [sx2+(u*c0-v*s0)*S, sy2+(u*s0+v*c0)*S]; } var A1=J(-5,-2), A2=J(5,-1), A3=J(-3,3), A4=J(4,3), A5=J(-9,-2+Math.sin(dt*14)*2), A6=J(9,1+Math.cos(dt*12)*2);
      shape(fb,[{cap:[A1[0],A1[1],A2[0],A2[1]],r:3*S},{cap:[A3[0],A3[1],A4[0],A4[1]],r:2.6*S},{cap:[A1[0],A1[1],A5[0],A5[1]],r:1.5*S},{cap:[A2[0],A2[1],A6[0],A6[1]],r:1.5*S}],{ramp:JAC,outline:P.k0,light:[-0.5,-0.85]});
      var Z0=J(0,-2), Z1=J(0,3.5); for (var zq=0;zq<=8;zq++) fb.px(rd(Z0[0]+(Z1[0]-Z0[0])*zq/8),rd(Z0[1]+(Z1[1]-Z0[1])*zq/8),P.s6); } }
  // Dino (vor dem Eintauchen); im Wasser: unter der Linie grünlich durchscheinend
  if (t<ent+0.7){ var tb=tmpBuf(S); tb.d.fill(T); var hx=hp[0]*S, hy=(hp[1]-camY)*S;
    if (t>SP.leave+0.3 && t<ent){ // Fahrtwind: helle Striche über ihm
      for (var k=0;k<7;k++){ var lx=rd(hx+(hash(k,9)-0.5)*26*S), ly=rd(hy-(30+hash(k,10)*30)*S), ll=(6+hash(k,11)*10)*S; for (var q=0;q<ll;q++) if (bayer(lx,ly-q)<0.5-q/ll*0.4) tb.px(lx,ly-q,P.s5); } }
    diver(tb,hx,hy,p,S,{});
    for (var y3=0;y3<h;y3++) for (var x3=0;x3<w;x3++){ var c3=tb.d[y3*w+x3]; if (c3===T) continue; if (y3>=sY){ if (bayer(x3,y3)<0.55) fb.d[y3*w+x3]=(y3-sY<6*S)?P.j3:P.j2; } else fb.d[y3*w+x3]=c3; } }
  // Eintauchen
  if (t>=ent){ var ti=t-ent, eX=ex*S;
    // Gischtkrone: einzelne Tropfen mit Spur
    if (ti<1.25) for (var n=0;n<150;n++){ var an=(hash(n,1)-0.5)*2.8, spd=(30+hash(n,2)*75)*S, vx=Math.sin(an)*spd*0.7, vy=-Math.cos(an)*spd, gx=160*S, px=eX+vx*ti, py=sY+vy*ti+0.5*gx*ti*ti; if (py>sY+S) continue;
      var tx2=px-vx*0.02, ty2=py-(vy+gx*ti)*0.02; fb.px(rd(px),rd(py),n%5?P.s6:P.j6); if (S>1){ fb.px(rd((px+tx2)/2),rd((py+ty2)/2),P.s5); if (n%3===0) fb.px(rd(px)+1,rd(py),P.s6); } }
    // Wassersäule (nach dem Kollaps der Höhle)
    if (ti>0.12 && ti<0.95){ var kk=(ti-0.12)/0.83, hc=Math.sin(kk*Math.PI)*36*S; for (var yc=0;yc<hc;yc++){ var wdt=(1.8-yc/hc*1.2)*S; for (var xc=-wdt;xc<=wdt;xc++){ var X3=rd(eX+xc+Math.sin(yc*0.2)*0.6*S), Y3=rd(sY-yc); if (bayer(X3,Y3)<0.9-yc/hc*0.4) fb.px(X3,Y3,(xc<0)?P.s6:P.j6); } }
      if (kk>0.5) for (var d1=0;d1<10;d1++){ var dx=(hash(d1,5)-0.5)*14*S, dy=hc+(hash(d1,6))*10*S*(kk-0.5); fb.px(rd(eX+dx),rd(sY-dy),P.s6); } }
    // Schaumteppich und Ringe (oben Licht, unten Schatten)
    if (ti<3.2){ var fr=(3+Math.min(1,ti*1.6)*14)*S; for (var f=0;f<260;f++){ var fa=hash(f,7)*Math.PI*2, fd=Math.sqrt(hash(f,8))*fr, fx=eX+Math.cos(fa)*fd, fy=sY+1.5*S+Math.sin(fa)*fd*0.22; if (hash(f,9)<1-ti/3.2) fb.px(rd(fx),rd(fy),hash(f,10)<0.7?P.s6:P.s5); } }
    for (var rr=0;rr<4;rr++){ var tr=ti-rr*0.42; if (tr<0||tr>3.6) continue; var r0=(5+tr*24)*S, al=1-tr/3.6;
      for (var a3=0;a3<220;a3++){ var th=a3/220*Math.PI*2, rx=eX+Math.cos(th)*r0, ry=sY+2*S+Math.sin(th)*r0*0.2, X4=rd(rx), Y4=rd(ry); if (bayer(X4,Y4)>=al*0.95) continue; fb.px(X4,Y4,Math.sin(th)<0?P.s6:P.j1); if (S>1 && Math.sin(th)>0) fb.px(X4,Y4+1,P.j2); } }
    // Blasen unter Wasser
    if (ti>0.1 && ti<2.6) for (var bq=0;bq<18;bq++){ var by=sY+(44-((ti*28+bq*6.5)%44))*S, bx=eX+(Math.sin(ti*5+bq)*3+(hash(bq,4)-0.5)*10)*S, br=(0.6+hash(bq,12)*1.2)*S; if (by<=sY+2*S) continue;
      for (var ba=0;ba<10;ba++){ var bth=ba/10*Math.PI*2; fb.px(rd(bx+Math.cos(bth)*br),rd(by+Math.sin(bth)*br),P.j6); } fb.px(rd(bx-br*0.4),rd(by-br*0.4),P.s6); }
    // auftauchen, Wasser aus dem Haar schütteln, mit offener Hand winken
    if (t>SP.surf){ var ts=t-SP.surf, kx=(ex+18+ts*6)*S, rise=sm(ts/0.6), shk=(ts>0.3&&ts<1.0)?Math.sin(ts*38)*1.4:0, bob=Math.sin(ts*3.2)*0.7*S;
      var wav=ts>1.0?Math.sin((ts-1.0)*7)*0.45:0, raise=sm((ts-1.0)/0.45);
      var pp={bA:0.05+shk*0.04, nk:-0.05+shk*0.12, a:[0.6,(ts>1.0?Math.PI*0.92*raise+wav*raise:0.4)], e:[0.6,(ts>1.0?-0.25+wav*0.3:0.3)], h:[0.1,0.1], k:[0.3,0.3], jacket:0, lift:0, toe:1, open:1};
      var tb2=tmpBuf(S); tb2.d.fill(T); var hy2=sY+(26-rise*16)*S+bob; diver(tb2,kx,hy2,pp,S,{wet:true});
      var wl=sY+2*S; for (var y5=0;y5<h;y5++) for (var x5=0;x5<w;x5++){ var c5=tb2.d[y5*w+x5]; if (c5===T) continue; var wline=wl+Math.sin(x5*0.25+ts*5)*0.8*S; if (y5>wline){ if (bayer(x5,y5)<0.5 && y5<wline+10*S) fb.d[y5*w+x5]=P.j3; } else fb.d[y5*w+x5]=c5; }
      // Tropfen aus dem Haar und vom Arm, Kragen aus Schaum, kleine Ringe
      if (ts>0.3&&ts<1.25) for (var dd=0;dd<24;dd++){ var da=hash(dd,13)*Math.PI*2, life=((ts*3+hash(dd,14))%1), dr=(5+life*14)*S; fb.px(rd(kx+Math.cos(da)*dr),rd(hy2-30*S+Math.sin(da)*dr*0.6+life*life*20*S),P.s6); }
      if (ts>1.2) for (var df=0;df<6;df++){ var lf=((ts*1.5+df/6)%1); fb.px(rd(kx+(8+df%3)*S),rd(hy2-40*S+lf*36*S),P.j6); }
      for (var fc=0;fc<40;fc++){ var fa2=fc/40*Math.PI*2; if (Math.sin(fa2)<-0.1) continue; fb.px(rd(kx+Math.cos(fa2)*7*S),rd(wl+Math.sin(fa2)*1.6*S),hash(fc,15)<0.7?P.s6:P.s5); }
      for (var w2=0;w2<120;w2++){ var th2=w2/120*Math.PI*2, r2=(10+((ts*7)%12))*S; if (bayer(w2,5)<0.55) fb.px(rd(kx+Math.cos(th2)*r2),rd(wl+1*S+Math.sin(th2)*r2*0.2),Math.sin(th2)<0?P.s5:P.j1); } } } }

// ---------------------------------------------------------------- Einbindung: 320er Rückfall (97_k3_nah.js) und doppelte Auflösung (99_main.js)
if (M.K3CLOSE) M.K3CLOSE.sprung={paint:function(b){ world(1); },anim:function(fb,t){ render(fb,t,1); }};
var HD=null, HDT=-1;
function hdWanted(){ var v=true; try{ v=localStorage.getItem('mala.hd')!=='0'; }catch(e){} return v && M.HD_OFF!==true; }
M.k3HdLayer=function(){ var E=M.E, C=E&&E.k3close; if (!C || C.id!=='sprung' || E.menu || E.overlay || E.screen!=='game' || !hdWanted()) return null;
  var gt=E.gt(), t=(gt-C.t0)/1000, kIn=Math.min(1,t/0.7), kOut=C.out?Math.max(0,1-(gt-C.out)/450):1, k=Math.min(kIn,kOut);
  if (!HD) HD=new M.Buf(VW*2,VH*2,T); if (HDT!==gt){ HDT=gt; render(HD,t,2); if (k<1) for (var y=0;y<HD.h;y++) for (var x=0;x<HD.w;x++) if (bayer(x>>1,y>>1)>=k) HD.d[y*HD.w+x]=T; }
  return HD; };
M.k3SprungPic=function(t,S){ var b=new M.Buf(VW*(S||2),VH*(S||2),P.k0); render(b,t,S||2); return b; };   // Werkzeuge und Tests
})(M);
