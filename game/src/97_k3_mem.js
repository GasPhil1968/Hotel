/* ===== 97_k3_mem.js — Kapitel 3 (Mostar 2011, Skela im Januar 1994): Erinnerungsbilder, je 232 × 104 Pixel =====
   Wie 93_mem.js und 97_k2_mem_a/b.js: in natürlichen Farben gemalt, mit kräftigen Helligkeitsstufen; das Spiel färbt
   die Bilder danach selbst (A.memory({tint:'ghost'}) kalt-blau, {tint:'memory'} sepia). Der Rand (10 px) wird beim
   Einblenden ausgedithert, deshalb liegt nichts Wichtiges dort.
   Lana mit siebzehn und Nada kommen aus dem Rig (M.drawPose, 'mala', 'nada'). Die Menschen von 1994 und aus den
   Neunzigern (Vlado mit 47, Zlata mit 57, Mate am Tor, der Fährmann Bato) haben hier eigene kleine Figuren im
   Rig-Format ('k3m_…'), die nur in diesen Bildern vorkommen. Nahaufnahmen (Führerhaus, Hände) sind von Hand gebaut.
   Feinfühlig: kein Körper im Wasser, keine Gewalt; das Seil zeigen nur zwei Hände über schwarzem Wasser. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R, S=M.poseS, F=M.poseF;
M.mem=M.mem||{};
// Empfohlene Färbung je Bild (die Skripte geben sie beim Aufruf selbst an; das hier dient Werkzeugen und als Hinweis)
M.K3_MEM_TINT=M.K3_MEM_TINT||{ k3_bus:'memory', k3_mybridge:'ghost', k3_cab:'ghost', k3_hut:'ghost', k3_bell:'ghost', k3_rope:'ghost', k3_blanket:'ghost',
  k3_oven:'memory', k3_lightorder:'ghost', k3_mate:'ghost', k3_ferry:'ghost', k3_vratnik:'memory', k3_home:'memory', k3_sketch1:'memory', k3_sketch2:'memory', k3_springer:'ghost' };

// ---------------------------------------------------------------- kleine Helfer
function fill(b,x0,y0,w,h,fn){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c=fn(x,y); if (c!==undefined) b.px(x,y,c); } }
function fig(b,x,y,pose,face,id,opt){ try{ M.drawPose(b,x,y,pose,face,id,opt||{}); }catch(e){ console.error(e); } }
function edgeDark(b,amt){ M.light(b,M.lf.vignette(b.w,b.h,amt||2.4)); }
function cl(v,a,z){ return v<a?a:(v>z?z:v); }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
// Wertrauschen (weich) für Fels, Nebel, Wolken
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), c=hash(gx+1+o,gy), d=hash(gx+o,gy+1), e=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(c-a)*ux+(d-a)*uy+(a-c-d+e)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
// Pixel zu einer Farbe hin mischen (k von 0 bis 8), für Durchscheinendes: Spiegelung, Dunst, Rauch
function mixPx(b,x,y,col,k){ var c=b.get(x,y); if (c===T||k<=0) return; b.px(x,y,M.mix(c,col,Math.min(8,k))); }
// Puffer aufkopieren (gespiegelt, gedithert durchscheinend)
function blitA(dst,src,ox,oy,flip,al){ al=al===undefined?1:al;
  for (var j=0;j<src.h;j++){ var y=oy+j; if (y<0||y>=dst.h) continue; for (var i=0;i<src.w;i++){ var c=src.d[j*src.w+(flip?src.w-1-i:i)]; if (c===T) continue; var x=ox+i; if (x<0||x>=dst.w) continue;
    if (al<1 && bayer(x,y)>=al) continue; dst.d[y*dst.w+x]=c; } } }
// Glied als Kapsel mit drei Tönen [mitte, licht, schatten]; Licht kommt von der Seite (lx,ly)
function limb(b,a,c,r,col,lx,ly){ lx=lx===undefined?-1:lx; ly=ly===undefined?0:ly;
  var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx*lx+ny*ly<0){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=cl((px*vx+py*vy)/L2,0,1), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=(qx*nx+qy*ny)/r, k=s>0.4?1:(s<-0.4?2:0); b.px(x,y,typeof col==='function'?col(x,y,k):col[k]); } } }
// Fläche, je Zeile quer schattiert: Q = [schatten, mitte, licht]; lit: Seite des Lichts (-1 links, 1 rechts)
function shade(b,pts,Q,lit,fn){ var m=new M.Buf(b.w,b.h,0); m.poly(pts,1);
  for (var y=0;y<b.h;y++){ var a=-1,e=-1,x; for (x=0;x<b.w;x++) if (m.d[y*b.w+x]){ if (a<0) a=x; e=x; } if (a<0) continue;
    for (x=a;x<=e;x++){ if (!m.d[y*b.w+x]) continue; var u=e>a?(x-a)/(e-a):0.5; if (lit<0) u=1-u; var c=Q[u>0.7?2:(u<0.28?0:1)]; if (fn) c=fn(x,y,c,u); b.px(x,y,c); } } }
// gedrehte Ellipse als Ring (Lenkrad, Glockenrand): Mitte, Halbachsen, Winkel, Stärke
function ringE(b,cx,cy,rx,ry,ang,th,col){ var ca=Math.cos(ang), sa=Math.sin(ang), R0=Math.max(rx,ry)+th+1;
  for (var y=Math.floor(cy-R0);y<=cy+R0;y++) for (var x=Math.floor(cx-R0);x<=cx+R0;x++){ var dx=x+0.5-cx, dy=y+0.5-cy, u=dx*ca+dy*sa, v=-dx*sa+dy*ca;
    var d=Math.sqrt(u*u/(rx*rx)+v*v/(ry*ry)), e=(d-1)*Math.min(rx,ry); if (Math.abs(e)<=th/2) b.px(x,y,typeof col==='function'?col(x,y,u,v):col); } }
// Regenstriche (schräg); colf(x,y) -> Farbe oder undefined
function rain(b,rg,n,x0,y0,w,h,len,sl,colf){ for (var i=0;i<n;i++){ var sx=x0+rg()*w, sy=y0+rg()*h, L=len*(0.6+rg()*0.8);
  for (var k=0;k<L;k++){ var x=Math.round(sx+k*sl), y=Math.round(sy+k); var c=colf(x,y,k/L); if (c!==undefined) b.px(x,y,c); } } }
// Kerzenflamme (nach dem Licht zeichnen)
function flame(b,x,y){ b.px(x,y,P.y4); b.px(x,y-1,P.l1); b.px(x,y-2,P.y5); b.px(x,y-3,P.y4); b.px(x-1,y-1,P.y3); b.px(x+1,y-1,P.y3); }

// ---------------------------------------------------------------- Köpfe von Hand (Nahaufnahmen): Profil und verlorenes Profil
// Profil nach links (dir -1) oder rechts (1). o: skin [dunkel … hell, 5 Töne], hair [4 Töne], grey (Schläfen), stub (Bartschatten), lx/ly (Licht von)
var PROF=[[-4.6,-6.4],[-5.7,-3.6],[-6.1,-1.7],[-5.5,-0.5],[-6.6,1.3],[-7.6,2.7],[-6.2,3.5],[-6.4,4.4],[-5.7,5.2],[-6.1,6.0],[-5.5,7.2],[-4.3,8.3],[-1.6,8.4],[1.8,6.6],[3.2,3.0],[3.6,-1.0]];
function inPoly(px,py,pts){ var c=false; for (var i=0,j=pts.length-1;i<pts.length;j=i++){ var a=pts[i], d=pts[j]; if ((a[1]>py)!==(d[1]>py) && px<(d[0]-a[0])*(py-a[1])/(d[1]-a[1])+a[0]) c=!c; } return c; }
function headP(b,cx,cy,s,dir,o){ var K=o.skin, H=o.hair, x0=Math.floor(cx-9*s), x1=Math.ceil(cx+9*s), y0=Math.floor(cy-10*s), y1=Math.ceil(cy+13*s), x, y, lx=o.lx===undefined?-0.8:o.lx, ly=o.ly===undefined?0.5:o.ly;
  function loc(x,y){ return [(x+0.5-cx)/s*(dir<0?1:-1),(y+0.5-cy)/s]; }
  function inside(u,v){ var sk=Math.pow((u-1.2)/6.6,2)+Math.pow((v+1)/7.6,2)<=1; if (sk) return 1; if (inPoly(u,v,PROF)) return 2; if (v>5 && v<13 && u>-3.4+(v-5)*0.05 && u<2.8-(v-8)*0.1) return 3; return 0; }
  var m=new M.Buf(x1-x0+1,y1-y0+1,0);
  for (y=y0;y<=y1;y++) for (x=x0;x<=x1;x++){ var q=loc(x,y); m.d[(y-y0)*m.w+(x-x0)]=inside(q[0],q[1]); }
  function IN(x,y){ if (x<x0||x>x1||y<y0||y>y1) return 0; return m.d[(y-y0)*m.w+(x-x0)]; }
  for (y=y0;y<=y1;y++) for (x=x0;x<=x1;x++){ var reg=IN(x,y); if (!reg) continue; var q2=loc(x,y), u=q2[0], v=q2[1];
    // Licht: Abstand zur Vorderkante (zum Licht hin) und Höhe
    var fr=0; for (var k=1;k<=6;k++){ if (!IN(x+(dir<0?-k:k)*(lx<0?1:-1),y)) break; fr++; } var lit=cl(1-fr/6,0,1)*0.75+cl(v*ly/9+0.3,0,1)*0.35;
    var hairR=(reg===1 && (v<-4.2+u*0.12 || (u>-0.6+Math.max(0,v)*0.05 && v<5.4 && !(u<2.2 && v>-2.6 && v<3.2 && u>-1.8)) || (u>1.5 && v<6))), c;
    if (reg===3) hairR=(u>1.4 && v<8.6);
    if (o.hairFn) hairR=o.hairFn(u,v,reg,hairR);
    if (hairR){ c=H[cl(Math.floor(lit*H.length*0.9),0,H.length-1)]; if (o.grey && u>-1.2 && u<1.6 && v>-3 && v<2.8 && hash(x,y*1.7)<0.6) c=o.grey; }
    else { c=K[cl(Math.floor(lit*K.length*0.95),0,K.length-1)]; if (o.stub && v>3.6 && u<1.8 && u>-5.6 && hash(x*3.1,y*1.3)<0.45) c=M.DN[c]; }
    b.px(x,y,c); }
  function at(u,v,c){ var X=cx+(dir<0?u:-u)*s, Y=cy+v*s; b.px(Math.floor(X),Math.floor(Y),c); }
  at(-3.7,-0.4,o.eye||P.k0); at(-4.6,-1.8,H[0]); at(-3.6,-1.9,H[0]); at(-2.8,-1.6,H[1]);   // Auge, Braue
  at(-5.9,3.1,K[0]); at(-5.3,5.1,K[0]); at(-4.8,5.2,K[1]);                                // Nasenloch, Mund
  at(1.5,0.6,K[1]); at(1.9,1.6,K[0]); at(1.4,2.4,K[1]); at(2.3,0.9,K[0]);                 // Ohr
  return { mouth:[cx+(dir<0?-6:6)*s, cy+5.2*s], eye:[cx+(dir<0?-3.7:3.7)*s, cy-0.4*s] }; }
// Hinterkopf, leicht zur Seite (verlorenes Profil): Wange und Ohr auf der Seite dir; Zopf nach unten
function headB(b,cx,cy,rx,ry,dir,o){ var K=o.skin, H=o.hair, x, y;
  for (y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++) for (x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++){ var u=(x+0.5-cx)/rx*dir, v=(y+0.5-cy)/ry; if (u*u+v*v>1) continue;
    var cheek=(u>0.62 && v>-0.15 && v<0.78 && u*u+v*v>0.5), c, lit=cl((u+1)/2*0.8+(v+1)/2*0.3+(o.lift||0),0,1);
    if (cheek) c=K[cl(Math.floor(lit*K.length),0,K.length-1)];
    else { c=H[cl(Math.floor(lit*H.length*0.85),0,H.length-1)]; var sw=Math.sin((u*3.1+v*1.6)*3.2); if (sw>0.82 && v<0.4) c=M.UP[c]; if (Math.abs(u+0.12-v*0.1)<0.06 && v<-0.2) c=H[0]; } // Strähnen, Scheitel
    b.px(x,y,c); }
  var ex=Math.round(cx+dir*rx*0.62), ey=Math.round(cy+ry*0.12); b.px(ex,ey,K[1]); b.px(ex,ey+1,K[0]); b.px(ex+dir,ey,K[2]);   // Ohr
  if (o.braid){ var bx=cx-dir*rx*0.1, by=cy+ry*0.82, L=o.braid, sx=o.bsw||0;
    for (var i=0;i<L;i++){ var t=i/L, px=Math.round(bx+sx*t*t), py=Math.round(by+i); var c2=(i%3===2)?H[0]:H[1]; if (t>0.86 && t<0.95) c2=o.tie||P.r3; b.px(px,py,c2); b.px(px+1,py,(i%3===1)?H[0]:H[2]); if (i<L*0.6) b.px(px-1,py,H[0]); } } }

// ---------------------------------------------------------------- Figuren von damals im Rig-Format (nur für diese Bilder)
function LG(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// VLADO RAJIĆ mit 47 (1994): dunkles kurzes Haar, graue Schläfen, Bartstoppeln, Zigarette; dunkelblaue Arbeitsjacke über kariertem Hemd
var vlS=[
"............",
"...kkkkkk...",
"..kHHHHhHk..",
".kHHHHHHHHk.",
".kHHHHHHSSk.",
".kgHHHSSSSSk",
".kgHtSSSSeSk",
".kgtSSSSSSSSk",
".ktSSSSSSbbk.",
"..ktSSSbbbwwr",
"..ktbSSSbmk..",
"...ktbbbbk...",
"....kttk....",
"....ktsk...."];
var vlF=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHHHHHHHk",
"kgSSSSSSSgk",
"kgSSSSSSSgk",
"kSSeSSSeSSk",
"ktSSSStSStk",
".kbSSSSSbk.",
".kbbSmwwrk.",
"..kbbbbbk..",
"...kbbbk...",
"...ktttk...",
"...kssk...."];
var vlB=[
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHHHHHHHk",
"kgHHHHHHHgk",
"kgHHHHHHHgk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
if (!M.CHARS.k3m_vlado) M.defineChar('k3m_vlado',{ legend:LG({H:P.h1,h:P.h3,g:P.m3,S:P.p4,s:P.p3,t:P.p2,b:P.p2,m:P.p1,r:P.y4}), heads:{S:M.headSet(vlS),F:M.headSet(vlF),B:{n:vlB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:14,col:[P.n1,P.n2,P.n0],collar:[P.r2,P.r3],side:8}, bones:[11,11,9,8],
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.n1,P.n2,P.n0],sleeveF:[P.n0,P.n1,P.k1],hand:[P.p3,P.p2],handF:[P.p2,P.p1],shoe:P.k2} });
// ZLATA BRKIĆ mit 57 (1994): dunkelblaues Kopftuch nach hinten gebunden, graue Strickjacke, kariertes Kleid, Gummistiefel
var zlS=[
"............",
"...kkkkkk...",
"..kcCcccCk..",
".kcccccccck.",
".kcccccSSSk.",
"kcccccSSSSk.",
"kccctSSSeSk.",
"kcctSSSSSSSk",
".kctSSSSSSk.",
".kcktSSSSmk.",
"..kkktSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var zlF=[
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kccccccccck",
"kccSSSSSSck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kctSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var zlB=[
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kcccCcccccc",
"kccccccccck",
"kcccccccCck",
"kccccccccck",
"kccccCccck.",
".kccCcck...",
"..kcCck....",
"...kkk.....",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
if (!M.CHARS.k3m_zlata) M.defineChar('k3m_zlata',{ legend:LG({c:P.n1,C:P.n2,S:P.q4,s:P.q3,t:P.q2,m:P.q1}), heads:{S:M.headSet(zlS),F:M.headSet(zlF),B:{n:zlB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.m2,P.m3,P.m1],buttons:P.s5,side:8,belly:1}, skirt:{c:[P.r0,P.r1,P.k2],hem:13,flare:2}, bones:[9,9,7,7], hipY:21, shoulder:5,
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2} });
// MATE ZELENIKA in den Neunzigern (um 65): grauer Filzhut, weißer Schnurrbart, grauer Anzug der Siebziger, Krawatte
var mtS=[
"............",
"...kkkkkk...",
"..kfffFffk..",
".kkkkkkkkkkk",
"..kjjjSSSSk.",
".kjjjSSSSSk.",
".kjjtSSSeSk.",
".kjtSSSSSSSk",
"..ktSSSSwwk.",
"..ktSSSwwk..",
"...ktSSSk...",
"....kkkk....",
"....kttk....",
"....ktsk...."];
var mtF=[
"...kkkkk...",
"..kfffFfk..",
".kfffffffk.",
"kkkkkkkkkkk",
".kjSSSSSjk.",
".kSSSSSSSk.",
".kSeSSSeSk.",
".ktSStSStk.",
".kSwwwwwSk.",
"..kSSSSSk..",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var mtB=[
"...kkkkk...",
"..kfffFfk..",
".kfffffffk.",
"kkkkkkkkkkk",
".kjjjjjjjk.",
".kjjjjjjjk.",
".kjjjjjjjk.",
".ktjjjjjtk.",
"..ktttttk..",
"..kkkkkkk..",
"...kkkkk...",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
if (!M.CHARS.k3m_mate) M.defineChar('k3m_mate',{ legend:LG({f:P.m2,F:P.m3,j:P.s5,S:P.p4,s:P.p3,t:P.p2,m:P.p1}), heads:{S:M.headSet(mtS),F:M.headSet(mtF),B:{n:mtB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:[P.m2,P.m3,P.m1],lapel:P.s5,vneck:P.r2,side:7}, bones:[10,10,8,7], shoulder:4,
  cols:{trou:[P.m2,P.m3,P.m1],trouF:[P.m1,P.m2,P.m0],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2} });
// BATO BRKIĆ, der Fährmann (wirkt 71): Schiebermütze, weißer Bart, dicker Pullover, Wathose mit Hosenträgern, Gummistiefel
var btS=[
"............",
"...kkkkkkk..",
"..kcccCccck.",
".kkkkkkkkkkk",
".kjjjjSSSSk.",
".kjjjSSSSSk.",
".kjjtSSSeSk.",
".kjtSSSSSSSk",
".kjtwwwSwwk.",
"..kwwwwwwwk.",
"..kwwwwwwk..",
"...kwwwwk...",
"....kwwk....",
"....ktsk...."];
var btF=[
"...kkkkk...",
"..kcccCck..",
".kcccccccck",
"kkkkkkkkkkk",
"kjjSSSSSjjk",
"kjSSSSSSSjk",
"kjSeSSSeSjk",
"kjSSStSSSjk",
"kwwwSSSwwwk",
".kwwwwwwwk.",
"..kwwwwwk..",
"...kwwwk...",
"...ktttk...",
"...kssk...."];
var btB=[
"...kkkkk...",
"..kcccCck..",
".kcccccccck",
"kkkkkkkkkkk",
"kjjjjjjjjjk",
"kjjjjjjjjjk",
"kjjjjjjjjjk",
"ktjjjjjjjtk",
".kjjjjjjjk.",
".ktjjjjjtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
if (!M.CHARS.k3m_bato) M.defineChar('k3m_bato',{ legend:LG({c:P.e1,C:P.e2,j:P.s5,w:P.s5,S:P.q4,s:P.q3,t:P.q2,m:P.q1}), heads:{S:M.headSet(btS),F:M.headSet(btF),B:{n:btB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:14,col:[P.e2,P.e3,P.e1],apron:[P.g1,P.g2],belt:P.k2,side:9,belly:1}, bones:[11,11,9,8], shoulder:6,
  cols:{trou:[P.g1,P.g2,P.g0],trouF:[P.g0,P.g1,P.k1],sleeve:[P.e2,P.e3,P.e1],sleeveF:[P.e1,P.e2,P.e0],hand:[P.q3,P.q2],handF:[P.q2,P.q1],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ if (p.v!=='S') return; var t=Y+hy-13; b.vl(X+hx+1,t,t+6,P.k2); b.vl(X+hx-2,t,t+6,P.g0); } });


// MARKO als Junge im Winter 1994 (15): rote Wollmütze mit hellem Rand, große Ohren, gestreifter Pullover, Cordhose
var mlS=[
"............",
"...kkkkkk...",
"..krrRrrrk..",
".krrrrrrrrk.",
".kwwwwwwwwk.",
".kHHHHSSSSk.",
"kSkHtSSSeSk.",
"kSktSSSSSSSk",
".kktSSSSSSk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....kttk....",
"....ktsk...."];
var mlF=[
"...kkkkk...",
"..krrRrrk..",
".krrrrrrrk.",
".kwwwwwwwk.",
"kSHSSSSSHSk",
"kSkSSSSSkSk",
".kSeSSSeSk.",
".ktSStSStk.",
"..kSSSSSk..",
"..ktSmStk..",
"...ktttk...",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var mlB=[
"...kkkkk...",
"..krrRrrk..",
".krrrrrrrk.",
".kwwwwwwwk.",
"kSHHHHHHHSk",
"kSkHHHHHkSk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...kkkkk...",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
if (!M.CHARS.k3m_mali) M.defineChar('k3m_mali',{ legend:LG({r:P.r3,R:P.r4,w:P.s5,H:P.h2,S:P.p4,s:P.p3,t:P.p2,m:P.p2}), heads:{S:M.headSet(mlS),F:M.headSet(mlF),B:{n:mlB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.r2,P.r3,P.r1],stripe:P.s5,side:8}, bones:[10,10,8,7], shoulder:5, hipY:22,
  cols:{trou:[P.w2,P.w3,P.w1],trouF:[P.w1,P.w2,P.w0],sleeve:[P.r2,P.r3,P.r1],sleeveF:[P.r1,P.r2,P.r0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2} });

// ---------------------------------------------------------------- weitere Helfer
// Bruchstein: unregelmäßige Steine (Zellen um verschobene Gitterpunkte); liefert [Zellnummer, Abstand zur Fuge]
function rubble(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), best=1e9, sec=1e9, id=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=gx+i, cy=gy+j, px=(cx+0.15+hash(cx+sd,cy)*0.7)*sx, py=(cy+0.15+hash(cx,cy+sd*3)*0.7)*sy, d=Math.hypot((x-px)/sx,(y-py)/sy);
    if (d<best){ sec=best; best=d; id=cx*131+cy; } else if (d<sec) sec=d; }
  return [id, sec-best]; }
// Maske einer Rig-Figur (für Schattenwurf): Puffer in Bildgröße, nicht T, wo die Figur ist
function figMask(w,h,x,y,pose,face,id){ var m=new M.Buf(w,h,T); fig(m,x,y,pose,face,id); return m; }
// erste Fundstelle einer Farbe in einem Rechteck (z. B. die Glut einer Zigarette im Kopf-Stempel)
function findCol(b,x0,y0,x1,y1,c){ for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++) if (b.get(x,y)===c) return [x,y]; return null; }

// ================================================================ 1. Im Bus nach Mostar (memory): die grüne Neretva im Regen, auf dem Sitz eine halbe Pita, Mala nur im Fensterspiegel
M.mem.k3_bus=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2411), WX0=12, WX1=170, WY0=5, WY1=57, RC=6;
  b.rect(0,0,w,h,P.k1);
  function inPane(x,y){ if (x<WX0||x>WX1||y<WY0||y>WY1) return false; var cx=cl(x,WX0+RC,WX1-RC), cy=cl(y,WY0+RC,WY1-RC); return (x-cx)*(x-cx)+(y-cy)*(y-cy)<=RC*RC+1; }
  function inPane2(x,y){ return x>=182 && x<=232 && y>=WY0+1 && y<=WY1 && !(x<188 && y<WY0+6 && Math.hypot(x-188,y-WY0-6)>6); }
  function inG(x,y){ return inPane(x,y)||inPane2(x,y); }
  // draußen: tief verhangen; links öffnet sich das Tal im Dunst, rechts steht die Felswand drüben bis über den Fensterrand
  var o=new M.Buf(w,h,P.s4);
  fill(o,0,0,w,60,function(x,y){ return ra(R('s2 s3 s3 s4 s5'),0.35+y/60+(fbm(x*0.6,y*1.8,18,3)-0.5)*0.4,x,y); });
  var ft2=function(x){ return Math.round(20+7*Math.sin(x*0.03+0.6)+(fbm(x,5,12,8)-0.5)*7); };
  for (x=0;x<w;x++) for (y=ft2(x);y<47;y++) o.px(x,y,ra(R('s2 s2 s3 s3 s4'),0.45+(y-ft2(x))/60+(fbm(x,y,7,6)-0.5)*0.3,x,y));
  var ft=function(x){ return Math.round(38-46*sm((x-34)/118)+(fbm(x,0,7,4)-0.5)*8+Math.sin(x*0.19)*1.5); };
  for (x=0;x<w;x++){ var t0=ft(x); for (y=Math.max(0,t0);y<46;y++){ var d=(y-t0)/Math.max(8,46-t0), bands=Math.sin((y+fbm(x,y,14,2)*8)*0.75), v=0.5-d*0.28+bands*0.12+(fbm(x*1.5,y,5,9)-0.5)*0.32+(y-t0<2?0.25:0);
      if (fbm(x*2.2,y*0.25,6,13)>0.62) v-=0.2;                                                    // dunkle Rinnen, wo das Wasser herabläuft
      var c=ra(R('k2 s0 s1 s1 s2 s3'),v,x,y);
      if (bands>0.5 && fbm(x*1.2,y*1.4,5,11)>0.52) c=ra(R('g0 g1 g1 g2 g3'),0.3+(fbm(x,y,3,5)-0.5)*0.9+(bands-0.5),x,y);   // Buschwerk auf den Bänken
      o.px(x,y,c); } }
  for (y=ft(141)+2;y<45;y++){ var wx=141+Math.round(Math.sin(y*0.3)*0.7+(y-ft(141))*0.05); o.px(wx,y,(y%3)?P.s5:P.s4); if (hash(wx,y)<0.5) o.px(wx+1,y,P.s3); }   // ein Rinnsal stürzt herab
  // der Fluss: grün und schnell, weiße Schwellen
  for (y=44;y<52;y++) for (x=0;x<w;x++){ var f=Math.sin(x*0.23+y*1.7)+Math.sin(x*0.07-y*0.9+2), c2=ra(R('a2 g3 a3 a4 a5'),0.25+(y-44)/9*0.45+f*0.12,x,y); if (f>1.45) c2=P.s5; else if (f>1.2 && (x+y)%2) c2=P.a6; if (y===44) c2=(x%5<3)?P.s2:P.a2; o.px(x,y,c2); }
  // diesseits: Böschung und Leitplanke, vom Fahren verwischt
  for (y=52;y<60;y++) for (x=0;x<w;x++) o.px(x,y,ra(R('k2 g0 g1 g1'),0.3+(fbm(x*0.2,y*3,6,4)-0.5)*0.6,x,y));
  for (x=0;x<w;x++){ o.px(x,53,P.m3); o.px(x,54,P.m2); o.px(x,55,P.m1); if ((x+7)%31<3){ for (y=52;y<=57;y++) o.px(x,y,P.k2); } }
  M.fogBake(o,function(x,y){ var a=sm((84-x)/84)*0.75*sm((y-6)/30)+Math.max(0,1-Math.abs(y-(ft2(x)+3))/6)*0.3+Math.max(0,1-Math.abs(y-43)/3)*0.45; return Math.min(0.92,a*(0.7+fbm(x,y,12,7)*0.6)); },{col:P.s4});
  rain(o,rg,140,0,0,w,56,5,-0.4,function(x,y){ var c=o.get(x,y); return (c!==T && bayer(x,y)<0.55)?M.UP[c]:undefined; });   // feiner Regen
  for (y=0;y<h;y++) for (x=0;x<w;x++) if (inG(x,y)) b.px(x,y,o.get(x,y));
  // Mala im Fensterspiegel: ein Mädchen mit angezogenen Knien, die Arme um die Beine, den Kopf auf den Knien; nur ein heller Umriss
  var RF=new M.Buf(w,h,0);
  RF.ellipse(108,25,4.6,5,1);                                                         // Kopf, auf den Knien, zum Fenster gewandt
  RF.poly([[112,28],[118,29],[123,41],[124,56],[110,56],[107,47],[106,37]],1);       // Rücken und Hüfte
  RF.poly([[99,32],[106,29],[110,34],[108,47],[103,56],[95,56],[97,45]],1);          // Knie und Schienbeine
  RF.poly([[100,39],[114,34],[116,38],[103,44]],1);                                   // die Arme um die Knie
  for (i=0;i<11;i++){ RF.px(113+Math.round(i*0.3),26+i,1); RF.px(114+Math.round(i*0.3),26+i,1); }   // Zopf
  for (y=WY0;y<=WY1;y++) for (x=WX0;x<=WX1;x++){ if (!inPane(x,y) || !RF.get(x,y)) continue; var edge=!RF.get(x-1,y)||!RF.get(x+1,y)||!RF.get(x,y-1)||!RF.get(x,y+1); mixPx(b,x,y,edge?P.s6:P.s5,edge?5:(bayer(x,y)<0.5?2:1)); }
  // Tropfen und Rinnsale auf der Scheibe (der Fahrtwind treibt sie schräg nach hinten)
  for (i=0;i<46;i++){ var dx=WX0+rg()*(w-WX0), dy=WY0+rg()*(WY1-WY0), len=rg()<0.35?4+rg()*12:0;
    for (var k=0;k<=len;k++){ var px=Math.round(dx+k*0.9), py=Math.round(dy+k*0.35+Math.sin(k*0.7+i)*0.4); if (inG(px,py)) b.px(px,py,M.UP[b.get(px,py)]); }
    var qx=Math.round(dx+len*0.9), qy=Math.round(dy+len*0.35); if (inG(qx,qy)){ b.px(qx,qy,P.s6); if (inG(qx,qy+1)) b.px(qx,qy+1,P.s1); } }
  // Rahmen: Gummi, Blech, Verkleidung; ein Pfosten mit geraffter Gardine
  for (y=0;y<70;y++) for (x=0;x<w;x++){ if (inG(x,y)) continue; var e=Math.max(WX0-x,x-WX1,WY0-y,y-WY1), near=(x>=WX0-3&&x<=WX1+3&&y>=WY0-3&&y<=WY1+3);
    b.px(x,y,near&&e<=1?P.k2:(near&&e<=3?(y<WY0?P.m1:P.m2):ra(R('k1 k2 m0 m1'),0.4+(fbm(x,y,20,5)-0.5)*0.4,x,y))); }
  for (y=WY0;y<=WY1;y++){ b.px(181,y,P.k2); b.px(182,y,P.m1); }
  for (y=0;y<66;y++){ var cw=9+Math.round(Math.sin(y*0.09)*1.2)+(y>30&&y<37?-3:0); for (x=0;x<cw;x++){ var fx=172+x-Math.round(cw/2)+4, fold=Math.sin((x+y*0.1)*1.3), cc=fold>0.5?P.e3:(fold<-0.4?P.e1:P.e2); if (x===0||x===cw-1) cc=P.e1; b.px(fx,y,cc); } }
  b.rect(171,31,12,4,P.e1); b.hl(171,182,31,P.e3); b.hl(171,182,34,P.k2);
  // Wand unter dem Fenster mit Sims und Aschenbecherklappe
  b.rect(0,60,w,9,P.m1); b.hl(0,w-1,60,P.m3); b.hl(0,w-1,61,P.m2); b.hl(0,w-1,68,P.k1); b.rect(70,63,16,3,P.m2); b.hl(70,85,63,P.m3);
  // Malas Sitz in leichter Aufsicht: dunkelblauer Stoff mit feinem Rautenmuster
  var SEAT=function(x,y){ var u=(x-30)/150, v=(y-70)/34, c=ra(R('k2 n0 n1 c1 c2'),0.66-v*0.45-Math.abs(u-0.45)*0.22+(hash(x>>1,y>>1)-0.5)*0.06,x,y), d1=((x+y*2)%10+10)%10, d2=((x-y*2)%10+10)%10;
    if (d1===0||d2===0) c=M.UP[c]; if (d1===0&&d2===0) c=P.r2; return c; };
  b.poly([[22,70],[202,70],[214,104],[8,104]],SEAT); b.hl(22,201,70,P.c3); b.hl(23,200,71,P.c2);
  for (y=79;y<104;y+=12) b.line(Math.round(22-(y-70)*0.42),y,Math.round(202+(y-70)*0.35),y,P.k2);   // Nähte
  // die Lehne davor (links) und Malas Lehne (rechts) mit dem weißen Kopftuch
  b.poly([[0,36],[18,38],[24,104],[0,104]],function(x,y){ return ra(R('k2 n0 n1 c1'),0.62-(x/24)*0.3-(y-36)/140,x,y); }); b.line(18,38,24,104,P.c2); b.rect(2,34,14,3,P.m3); b.hl(2,15,34,P.m4);
  b.poly([[202,24],[214,19],[226,18],[232,19],[232,104],[212,104],[205,62]],function(x,y){ var c=ra(R('k2 n0 n1 c1 c2'),0.25+(x-200)/50+(hash(x>>2,y>>2)-0.5)*0.08-(y-20)/200,x,y), d1=((x+y*2)%10+10)%10; if (d1===0) c=M.UP[c]; return c; });
  b.poly([[204,25],[214,21],[228,20],[230,33],[220,35],[206,36]],function(x,y){ var f=Math.sin(x*0.8+y*0.3); return ra(R('s2 s3 s4 s5'),0.75-(x-204)/40-(y-20)/40+(f>0.7?-0.2:0),x,y); }); b.line(206,36,220,35,P.s1); b.line(220,35,230,33,P.s1);   // weißes Kopftuch über der Lehne
  // die halbe Pita auf einem Stück Papier: Schnecke aus Teig, die Schnittfläche zeigt Blätter und Füllung
  b.poly([[92,84],[134,79],[140,93],[96,98]],P.s5); b.line(92,84,134,79,P.s6); b.line(96,98,140,93,P.s3); [[104,90],[121,86],[130,91]].forEach(function(p){ b.px(p[0],p[1],P.s4); b.px(p[0]+1,p[1],P.s4); });
  var PX=116, PY=89; for (y=PY-8;y<=PY+1;y++) for (x=PX-15;x<=PX+15;x++){ var dx2=(x+0.5-PX)/15, dy2=(y+0.5-PY)/8.5; if (dx2*dx2+dy2*dy2>1 || y>PY+1) continue;
    var rr=Math.sqrt(dx2*dx2+dy2*dy2*1.15), ring=Math.sin(rr*16.5+Math.atan2(dy2,dx2)*0.5), c3=ring>0.55?P.w4:(ring<-0.5?P.w3:P.y3); if (rr>0.9) c3=P.w2; if (dy2<-0.75) c3=P.w5; if (hash(x,y)<0.06) c3=P.y4; b.px(x,y,c3); }
  for (x=PX-15;x<=PX+15;x++){ var t3=Math.abs(x-PX)/15; b.px(x,PY+1,t3<0.92?(hash(x,3)<0.5?P.s5:P.y4):P.w2); b.px(x,PY+2,P.w1); }
  M.light(b,M.lf.sum(M.lf.band(0,104,0.35,-0.8),M.lf.pool(92,30,120,40,0.6,1),M.lf.pool(110,84,80,22,0.9,1)));
  edgeDark(b,1.8); };


// ================================================================ 2. Malas Brücke (ghost): drei Steinstümpfe im schwarzen Wasser, im Licht zweier Lastwagenscheinwerfer, Regen – „wie abgebrochene Zähne“
M.mem.k3_mybridge=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1994), WL=41;
  // die beiden Scheinwerfer stehen knapp außerhalb links unten; ihre Kegel zielen über das Wasser auf die Stümpfe
  function mk(ox,oy,tx,ty,spr){ var vx=tx-ox, vy=ty-oy, L=Math.hypot(vx,vy); return {o:[ox,oy],d:[vx/L,vy/L],s:spr}; }
  var L1=mk(-30,84,160,50,0.13), L2=mk(-22,100,160,62,0.14);
  function cone(L,x,y){ var vx=x-L.o[0], vy=y-L.o[1], t=vx*L.d[0]+vy*L.d[1], s=Math.abs(-vx*L.d[1]+vy*L.d[0]); if (t<=0) return 0; var wd=2+t*L.s; return sm(1-s/wd)*Math.max(0,1-t/330); }
  function beam(x,y){ return Math.min(1,cone(L1,x,y)+cone(L2,x,y)); }
  // Himmel, das andere Ufer: eine Hügellinie, nasse Weiden, der alte Brückenkopf drüben
  fill(b,0,0,w,WL,function(x,y){ return ra(R('k0 k1 k1 k2'),0.25+y/70+(fbm(x,y*2,22,5)-0.5)*0.3,x,y); });
  for (x=0;x<w;x++){ var hy=16+Math.round(fbm(x,2,40,6)*9+Math.sin(x*0.02)*3); for (y=hy;y<WL;y++) b.px(x,y,ra(R('k0 k1 k2'),0.45+(fbm(x,y,6,3)-0.5)*0.5,x,y)); }
  for (i=0;i<12;i++){ var tx=8+Math.floor(rg()*216), th=4+Math.floor(rg()*6); b.ellipse(tx,WL-th*0.55,3+rg()*4,th*0.6,function(x,y){ return bayer(x,y)<0.6?P.k1:P.k0; }); }
  b.rect(194,34,18,8,P.k1); b.hl(194,211,34,P.k2); for (x=194;x<212;x+=5) b.vl(x,35,41,P.k0);
  // der Fluss: schwarz und schnell, die Strömung in langen Zügen
  fill(b,0,WL,w,h-WL,function(x,y){ var d=(y-WL)/(h-WL), f=fbm(x*0.25/(0.35+d),y*1.6,6,3)-0.5; return ra(R('k0 k0 k1 a0 a1'),0.25+d*0.18+f*0.35,x,y); });
  b.hl(0,w-1,WL,P.k0);
  // die Luft in den Kegeln: Dunst und Regen hellen sie auf
  for (y=0;y<h;y++) for (x=0;x<w;x++){ var lt0=beam(x,y); if (lt0<0.05) continue; var k0=Math.floor(lt0*3.2+bayer(x,y)); if (k0>0) mixPx(b,x,y,P.s2,Math.min(3,k0)); }
  // drei Stümpfe: Stirnseite zum Licht, Flanke nach drüben; oben ausgebrochene Blöcke
  var ST=[{x:46,fw:22,sw:9,b:96,t:54},{x:113,fw:13,sw:5,b:67,t:45},{x:157,fw:8,sw:3,b:54,t:42}];
  ST.forEach(function(st,k){ var x0=st.x, x1=st.x+st.fw, H=st.b-st.t, cr=Math.max(3,Math.round(H/6)), bw=Math.max(2,Math.round(st.fw/4));
    function topY(x){ var bi=Math.floor((x-x0)/bw), u=(x-x0)/(st.fw+st.sw), j=hash(bi,k*7+3); var t=st.t+Math.round(j*H*0.3+(bi===0||u>0.86?H*0.12:0)); if (hash(x,k+11)<0.15) t+=1; return t; }
    for (x=x0;x<x1+st.sw;x++){ var side=x>=x1, ty=topY(x)+(side?Math.round((x-x1)*0.3):0), by=st.b-(side?Math.round((x-x1)*0.45):0);
      for (y=ty;y<=by;y++){ var lt=beam(x,y), row=Math.floor((y-st.t)/cr), off=(row%2)*0.5, col=Math.floor((x-x0)/(st.fw/2.6)+off), fv=(y-st.t)%cr;
        var v=side?0.12+lt*0.2:0.24+lt*0.62; if (fv===0) v-=0.14; if (!side && (((x-x0)/(st.fw/2.6)+off)%1)<0.12) v-=0.1; if (y<=ty+1) v+=0.18; if (x===x0 && !side) v-=0.08; v+=(hash(col,row+k*9)-0.5)*0.12+(hash(x,y)-0.5)*0.06;
        b.px(x,y,ra(R('k1 s0 s1 s2 s3 s4 s5 s6'),v,x,y)); } }
    // Schatten im Wasser, Schaum an der Stirn, heller Schwall flussab
    for (y=st.b+1;y<Math.min(h,st.b+H*0.5);y++) for (x=x0;x<x1+st.sw;x++){ if (bayer(x,y)<0.6-(y-st.b)/(H*0.5)*0.6) b.px(x,y,P.k0); }
    for (i=0;i<Math.round(st.fw*4);i++){ var fx=x0-3+rg()*(st.fw+st.sw+5), fy=st.b-1+rg()*Math.max(2,H*0.1), L=1+Math.floor(rg()*Math.max(2,st.fw*0.3)); for (var j=0;j<L;j++){ var px=Math.round(fx+j), py=Math.round(fy+j*0.1), lt2=beam(px,py); if (bayer(px,py)<0.85-j*0.06) b.px(px,py,lt2>0.35?(rg()<0.5?P.s6:P.s5):(lt2>0.12?P.s3:P.a1)); } }
    for (i=0;i<Math.round(st.fw*2.4);i++){ var wx=x1+st.sw+rg()*st.fw*1.6, wy=st.b-2+rg()*Math.max(3,H*0.25), L2=2+Math.floor(rg()*st.fw*0.4); for (var j2=0;j2<L2;j2++){ var qx=Math.round(wx+j2), qy=Math.round(wy+j2*0.08); if (beam(qx,qy)>0.15 && bayer(qx,qy)<0.65) b.px(qx,qy,P.s4); else if (bayer(qx,qy)<0.25) b.px(qx,qy,P.a2); } } });
  // Glanz auf dem Wasser: nur ein paar Züge im hellsten Licht
  for (y=WL+3;y<h;y+=3) for (x=0;x<w;x++){ var lt3=beam(x,y); if (lt3<0.4) continue; var c=b.get(x,y); if (M.lum(c)>60) continue; if (fbm(x*0.3,y*2.2,5,17)>0.8-lt3*0.12) b.px(x,y,lt3>0.7?P.s3:P.a2); }
  // Regen: lange, dünne Striche, hell nur in den Kegeln
  rain(b,rg,300,-30,-16,w+40,h+16,14,-0.16,function(x,y,t){ var lt=beam(x,y); if (lt<0.12 || bayer(x,y)>0.3+lt*0.55) return undefined; return lt>0.65?P.s4:(lt>0.4?P.s3:P.s2); });
  // Schein der Scheinwerfer am linken Rand, das diesseitige Ufer als dunkle Kante
  b.poly([[0,94],[24,99],[42,104],[0,104]],function(x,y){ return bayer(x,y)<0.5?P.k0:P.k1; });
  M.light(b,M.lf.sum(M.lf.k(-0.15),M.lf.pool(4,82,30,14,2.2,1.4),M.lf.pool(8,98,26,12,2.2,1.4)));
  [[9,82,2.2],[13,97,2.6]].forEach(function(q){ b.ellipse(q[0],q[1],q[2]+1.5,q[2]+1,P.s5); b.ellipse(q[0],q[1],q[2],q[2]*0.8,P.l1); });   // die zwei Scheinwerfer, von der Seite
  edgeDark(b,1.6); };


// ================================================================ 3. Im Führerhaus (ghost): Nacht, nur die Instrumente leuchten. Vom Armaturenbrett aus gesehen: Vlado mit 47 am Steuer,
//    die Zigarette im Mund; neben ihm Lana mit siebzehn, das Skizzenbuch auf den Knien, sie zeichnet ihn. „Halt still.“ – „Ich fahre.“
M.mem.k3_cab=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1401), DY=84;
  // Rückwand der Kabine (Kunstleder), Dachhimmel; hinten ein kleines Fenster zur Ladefläche
  fill(b,0,0,w,DY,function(x,y){ var c=ra(R('k1 k2 m0 m1'),0.42+(fbm(x,y,12,3)-0.5)*0.25-y/300,x,y); if ((x%23)===0 && y>12) c=M.DN[c]; return c; });
  fill(b,0,0,w,11,function(x,y){ return ra(R('k0 k1 k2'),0.4+y/22+(hash(x>>2,y)-0.5)*0.1,x,y); }); b.hl(0,w-1,11,P.m0);
  var RX0=90, RX1=142, RY0=20, RY1=42;
  b.rect(RX0-3,RY0-3,RX1-RX0+6,RY1-RY0+6,P.k2); b.hl(RX0-3,RX1+2,RY0-3,P.m1); b.hl(RX0-3,RX1+2,RY1+2,P.m1);
  fill(b,RX0,RY0,RX1-RX0,RY1-RY0,function(x,y){ var c=ra(R('k0 k1 k1 n0'),0.2+(y-RY0)/60+(fbm(x,y,8,4)-0.5)*0.3,x,y);
    var ld=RY0+9+Math.round(Math.sin(x*0.21)*2+Math.sin(x*0.07+1)*1.5); if (y>ld) c=ra(R('k1 k2 e0 e1 e2'),0.4+(fbm(x*1.4,y*2,5,9)-0.5)*0.6-(y-ld)/30,x,y);   // die Plane über der Ladung
    if (y===ld+1 && x%9<5) c=P.e2; return c; });
  for (i=0;i<12;i++) b.px(RX0+Math.floor(rg()*(RX1-RX0)),RY0+Math.floor(rg()*8),P.n2);
  // Sonnenblenden von hinten; an seiner klemmt ein Foto (ein Mädchen, zwölf)
  b.poly([[14,10],[96,10],[94,22],[16,24]],function(x,y){ return ra(R('k1 k2 m0'),0.55-(y-10)/30,x,y); }); b.line(16,24,94,22,P.k0);
  b.poly([[136,10],[218,10],[216,24],[138,22]],function(x,y){ return ra(R('k1 k2 m0'),0.55-(y-10)/30,x,y); }); b.line(138,22,216,24,P.k0);
  b.rect(184,13,9,10,P.s4); b.rect(185,14,7,8,P.b1); b.rect(185,19,7,3,P.r2); b.ellipse(188.5,17,1.8,2.1,P.p3); b.px(187,15,P.h1); b.px(188,15,P.h1); b.px(189,15,P.h1); b.px(190,16,P.h1);
  // Seitenfenster links (Beifahrertür) und rechts (Fahrertür): Nacht, Regen
  [[2,38,24,64],[194,230,24,64]].forEach(function(q,k){ fill(b,q[0],q[2],q[1]-q[0],q[3]-q[2],function(x,y){ var c=ra(R('k0 k1 n0 n1'),0.18+(fbm(x,y,9,6+k)-0.5)*0.4+(y-q[2])/140,x,y); if (fbm(x*2,y,4,3+k)>0.64) c=P.k1; return c; });
    for (i=0;i<16;i++){ var qx=q[0]+Math.floor(rg()*(q[1]-q[0])), qy=q[2]+Math.floor(rg()*(q[3]-q[2])); b.px(qx,qy,P.n3); b.px(qx,qy+1,P.k0); }
    b.rect(k?q[0]-3:q[1],q[2]-2,3,q[3]-q[2]+4,P.k2); b.hl(q[0],q[1],q[3],P.m1); b.hl(q[0],q[1],q[2]-1,P.k2); });
  // Sitzbank: Lehne und Polster aus grauem Kunstleder
  b.poly([[40,48],[192,48],[196,78],[36,78]],function(x,y){ var c=ra(R('k2 m0 m1 m2'),0.5-(y-48)/70+(hash(x>>3,y>>3)-0.5)*0.08,x,y); if (((x-40)%19)===0) c=P.k2; return c; }); b.hl(40,192,48,P.m2);
  // Lana, siebzehn: sitzt zu ihm gedreht, das Skizzenbuch auf den Knien, der Bleistift in der Hand
  var LP=S({h:[0,-13],nf:[9,-1,'f'],ff:[7,-1,'f'],nh:[11,-21],fh:[9,-17],ln:2,sit:1,ho:[1,0]}), VP2=F({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-8,-21],rh:[8,-21],sit:1});
  var FG=figMask(w,h,70,93,LP,'R','mala'), FG2=figMask(w,h,154,93,VP2,'F','k3m_vlado');
  fig(b,70,93,LP,'R','mala');
  b.poly([[73,70],[88,65],[90,72],[75,77]],P.w1); b.poly([[74,70],[87,65.5],[88.5,71],[75.5,76]],function(x,y){ return (y<68)?P.s6:P.s5; });   // Skizzenbuch, zum Licht geneigt
  b.line(77,71,83,69,P.m2); b.line(77,73,82,71,P.m2); b.line(79,74,84,72,P.m3); b.px(85,69,P.m1);
  b.line(81,68,84,64,P.y3); b.px(84,64,P.k1);                                                                         // Bleistift
  // Schalthebel zwischen ihnen
  limb(b,[116,DY],[113,66],1.4,[P.m1,P.m2,P.k2]); b.ellipse(113,65,2.8,2.4,P.k2); b.px(112,64,P.m2);
  // Vlado, 47: von vorn, beide Hände oben am Lenkrad, die Zigarette im Mundwinkel
  fig(b,154,93,VP2,'F','k3m_vlado');
  var ember=findCol(b,144,50,168,68,P.y4);
  // Lenkrad zwischen ihm und uns: großer dünner Kranz, von hinten, mit drei Speichen
  ringE(b,154,83,30,10,0,2.2,function(x,y,u,v){ return (v<-3)?P.m0:((u<-12)?P.k2:P.k1); });
  b.line(154,83,154,93,P.k1); b.line(154,83,128,86,P.k1); b.line(154,83,180,86,P.k1); b.ellipse(154,83,3.4,2.4,P.k1);
  b.px(146,72,P.p2); b.px(147,72,P.p3); b.px(162,72,P.p3); b.px(161,72,P.p2);                                       // die Finger über dem Kranz
  // Armaturenbrett vorn: dunkle Kante, darauf eine Zigarettenschachtel und eine gefaltete Karte
  fill(b,0,DY,w,h-DY,function(x,y){ return ra(R('k0 k1 k2 m0'),0.5-(y-DY)/40+(hash(x>>3,y>>2)-0.5)*0.1,x,y); });
  b.hl(0,w-1,DY,P.m1); b.hl(0,w-1,DY+1,P.k2);
  b.rect(40,DY-5,9,5,P.s5); b.rect(40,DY-5,9,2,P.r3); b.vl(48,DY-5,DY-1,P.s3); b.px(41,DY-3,P.r2);
  b.poly([[92,DY],[114,DY-3],[120,DY],[96,DY+1]],P.s4); b.line(98,DY-1,112,DY-2,P.b2); b.line(104,DY,107,DY-2,P.r3);
  ringE(b,154,83,30,10,0,2.2,function(x,y,u,v){ return (v>3 && y>=DY)?P.k1:undefined; });
  // Licht: nur die Instrumente vor ihm; ein Widerschein auf ihr und dem Blatt
  // Licht: die Instrumente vor ihm treffen vor allem die beiden und das Blatt; auf der Rückwand nur ein schwacher Widerschein
  function onFG(x,y){ return FG.get(x,y)!==T || FG2.get(x,y)!==T || (x>=72&&x<=90&&y>=64&&y<=77); }
  var GL=M.lf.sum(M.lf.pool(154,74,44,34,2.6,1.6),M.lf.pool(80,72,30,24,1.9,1.4));
  M.light(b,M.lf.sum(M.lf.k(-1.0),M.lf.band(40,104,-0.3,0.5)));
  M.light(b,GL,0,0,onFG); M.light(b,function(x,y){ return GL(x,y)*0.3; },0,0,function(x,y){ return !onFG(x,y); });
  if (ember){ b.px(ember[0],ember[1],P.l0); b.px(ember[0]+1,ember[1],P.y5);
    for (i=0;i<34;i++){ var t3=i/34, sx=ember[0]+1+Math.sin(t3*6)*2.2+t3*6, sy=ember[1]-1-i*1.0; if (bayer(Math.round(sx),Math.round(sy))<0.75-t3*0.5) mixPx(b,Math.round(sx),Math.round(sy),P.s4,5); } }
  for (x=136;x<=172;x++) if (bayer(x,DY)<0.5) b.px(x,DY,P.y3);                                                        // der Lichtsaum der Instrumente an der Kante
  edgeDark(b,1.9); };


// ================================================================ 4. Die Hütte (ghost): ein Mädchen auf einem Mehlsack, eine Kerze, Mehlsäcke und Deckenballen, ein Bleistift
M.mem.k3_hut=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1415), G=90, LX=80, LY=70;
  // Bruchsteinwand, Dach aus Brettern und Sparren, gestampfter Boden
  fill(b,0,0,w,G,function(x,y){ var r=rubble(x,y,12,8,3), c=ra(R('k2 s0 s1 s1 s2'),0.42+(hash(r[0],1)-0.5)*0.4+Math.min(0.15,r[1]*0.5),x,y); if (r[1]<0.07) c=(r[1]<0.035)?P.k1:P.k2; if (hash(x*1.3,y*2.1)<0.04) c=M.DN[c]; return c; });
  fill(b,0,0,w,10,function(x,y){ var c=ra(R('k0 k1 w0 w1'),0.5-y/24+(hash(x>>3,y)-0.5)*0.2,x,y); if (x%9===0) c=P.k0; return c; });
  b.rect(0,9,w,4,P.w1); b.hl(0,w-1,9,P.w2); b.hl(0,w-1,12,P.k1); for (x=14;x<w;x+=48){ b.rect(x,0,5,9,P.w0); b.vl(x,0,8,P.w1); }
  fill(b,0,G,w,h-G,function(x,y){ var c=ra(R('k1 e0 e1 e2'),0.36+(y-G)/34+(hash(x>>1,y)-0.5)*0.2,x,y); if (hash(x*0.7,y*3.3)<0.025) c=P.e3; return c; }); b.hl(0,w-1,G,P.k1);
  // ein Fensterloch, draußen Nacht und Regen
  b.rect(56,18,16,13,P.k2); fill(b,58,20,12,9,function(x,y){ return ra(R('k0 n0 n1'),(y-20)/14+hash(x,y)*0.2,x,y); }); b.hl(56,71,30,P.s2); b.hl(55,72,31,P.s1); for (i=0;i<5;i++) b.px(59+Math.floor(rg()*10),21+Math.floor(rg()*7),P.n3);
  // ihr Schatten an der Wand: von der Kerze aus vergrößert (Projektion der Figur)
  var LANA=S({h:[3,-14],nf:[9,0,'f'],ff:[7,0,'f'],nh:[4,-31],fh:[8,-19],ln:2,sit:1,ho:[1,1]}), FX=126, FY=90;
  var FM=figMask(w,h,FX,FY,LANA,'L','mala');
  for (y=0;y<G;y++) for (x=0;x<w;x++){ var fx=Math.round(LX+(x-LX)*0.6), fy=Math.round(LY+(y-LY)*0.6); if (FM.get(fx,fy)!==T){ var edge=(FM.get(fx-1,fy)===T||FM.get(fx+1,fy)===T||FM.get(fx,fy-1)===T); if (!edge||bayer(x,y)<0.5) b.px(x,y,M.DN[b.get(x,y)]); } }
  // Deckenballen links: graue Armeedecken, in Lagen gefaltet und verschnürt, mit schwarzem Streifen
  [[12,77,42,13],[16,64,38,13],[10,51,42,13],[18,39,30,12]].forEach(function(d,k){ var x0=d[0], y0=d[1], dw=d[2], dh=d[3];
    for (y=y0;y<y0+dh;y++) for (x=x0;x<x0+dw;x++){ var u=(x-x0)/dw, v=(y-y0)/dh, bul=Math.sin(u*Math.PI)*1.2, ex=Math.min(x-x0,x0+dw-1-x), ey=Math.min(y-y0,y0+dh-1-y); if ((ex===0&&ey<2)||(ex<2&&ey===0)) continue;
      var lay=Math.floor((y-y0+bul)/2.2), c=ra(R('m0 m1 m2 m3'),0.5-v*0.22+u*0.16+(lay%2?0.08:-0.06)+(hash(lay,x>>3)-0.5)*0.08,x,y); if (Math.abs(v-0.55)<0.07) c=(lay%2)?P.k2:P.k1; if (ey===0 && y===y0) c=P.m3; if (ex===0) c=M.DN[c]; b.px(x,y,c); }
    [0.26,0.74].forEach(function(f){ var sx=x0+Math.round(dw*f); for (var yy=y0;yy<y0+dh;yy++) b.px(sx+((yy-y0)%3===0?1:0),yy,P.e3); b.px(sx,y0,P.e4); b.px(sx+1,y0-1,P.e2); }); b.hl(x0+1,x0+dw-2,y0+dh-1,P.k1); });
  // Mehlsäcke rechts, prall und gestapelt; auf dem vordersten der Aufdruck
  function sack(cx,cy,sw,sh,lab){ b.ellipse(cx,cy,sw,sh,function(x,y){ var u=(x+0.5-cx)/sw, v=(y+0.5-cy)/sh; return ra(R('e1 e2 e3 e4 s4 s5'),0.66-u*0.3-v*0.22+(hash(x,y>>1)-0.5)*0.08,x,y); });
    b.px(Math.round(cx-sw)+1,Math.round(cy)-2,P.e4); b.px(Math.round(cx-sw),Math.round(cy)-1,P.e3); b.px(Math.round(cx+sw)-1,Math.round(cy)+1,P.e1);
    if (lab){ b.hl(Math.round(cx-sw*0.45),Math.round(cx+sw*0.35),Math.round(cy-1),P.n1); b.hl(Math.round(cx-sw*0.35),Math.round(cx+sw*0.2),Math.round(cy+1),P.n1); } }
  [[176,82,15,8,1],[206,82,15,8,1],[191,71,15,7,1],[220,70,11,7,0],[184,59,14,7,1],[210,59,13,7,1],[197,48,13,6,0]].forEach(function(s){ sack(s[0],s[1],s[2],s[3],s[4]); });
  b.ellipse(156,88,18,4.5,function(x,y){ var v=(y-84)/9; return ra(R('e1 e2 e3 e4 s4'),0.7-v*0.4-(x-140)/90+(hash(x,y)-0.5)*0.06,x,y); });   // ein liegender Sack vorn
  M.microText(b,'BRAŠNO',143,85,P.n1);
  // die Kerze auf einer umgedrehten Kiste
  b.rect(71,79,20,12,P.w1); b.hl(71,90,79,P.w3); b.hl(71,90,80,P.w2); b.hl(71,90,85,P.w0); b.vl(71,79,90,P.w2); b.vl(90,80,90,P.k1);
  b.rect(79,72,3,7,P.s6); b.vl(81,72,78,P.s4); b.rect(78,78,5,1,P.s5); b.px(78,77,P.s5);
  // Lana auf dem Mehlsack, das Skizzenbuch auf den Knien, den Bleistift am Mund
  sack(127,83,11,6,0);
  fig(b,FX,FY,LANA,'L','mala');
  b.poly([[103,66],[116,63],[118,71],[105,74]],P.w1); b.poly([[104,66],[115,63.5],[117,70],[106,73]],P.s5); b.line(106,67,112,66,P.m2); b.line(106,69,111,68,P.m3); b.line(107,71,110,70,P.m3); b.px(113,67,P.m2);   // Skizzenbuch
  b.line(116,57,120,60,P.y3); b.px(115,56,P.k1); b.px(120,60,P.y2);                                                     // der Bleistift, angekaut
  b.line(97,96,102,95,P.y3); b.px(103,95,P.k2); b.rect(139,96,4,2,P.s4); b.px(141,95,P.s5);                             // ein Stummel, ein Papierschnipsel
  M.light(b,M.lf.sum(M.lf.k(-1.6),M.lf.pool(LX+2,LY+4,96,52,3.2,0.85),M.lf.pool(110,66,26,18,0.6,1)));
  flame(b,80,71);
  edgeDark(b,1.9); };


// ================================================================ 5. Die Glocke bei Nacht (ghost): eine junge Frau am Pfosten zieht am Glockenseil; drüben ein kleines Licht in einem Dachfenster
// gemeinsame Teile für die Glocke (auch in k3_lightorder): das Haus drüben mit den drei Fenstern, Pfosten mit Schiffsglocke
function farHouse(b,x0,y0,s,lit){ var i, W=Math.round(30*s), Hh=Math.round(17*s), RH=Math.round(9*s), x, y;
  for (y=y0;y<y0+Hh;y++) for (x=x0;x<x0+W;x++){ var c=ra(R('k1 k2 m0 m1'),0.55+(hash(x>>1,y>>1)-0.5)*0.2-(x-x0)/W*0.2,x,y); b.px(x,y,c); }   // weiß verputzt, bei Nacht grau
  for (y=0;y<RH;y++){ var hw=Math.round(W/2+2*s-y*(W/2+2*s)/RH); for (x=-hw;x<=hw;x++) b.px(x0+Math.round(W/2)+x,y0-1-y,(y===0)?P.k2:(hash(x,y)<0.3?P.k1:P.k2)); }   // Steinplattendach
  b.rect(x0+Math.round(3*s),y0+Math.round(9*s),Math.round(9*s),Math.round(4*s),P.k0);                       // breites Küchenfenster
  b.rect(x0+Math.round(16*s),y0+Math.round(7*s),Math.round(3*s),Math.round(7*s),P.k0);                      // tiefes, schmales Stubenfenster
  var dx=x0+Math.round(W/2)-Math.round(2*s), dy=y0-Math.round(5*s), dw=Math.max(2,Math.round(4*s)), dh=Math.max(2,Math.round(3*s));
  b.rect(dx-1,dy-1,dw+2,dh+1,P.k1); b.hl(dx-2,dx+dw+1,dy-2,P.k2);                                            // Gaube
  b.rect(dx,dy,dw,dh,lit?P.y4:P.k0); if (lit){ b.hl(dx,dx+dw-1,dy,P.y5); b.px(dx+1,dy+1,P.l0); }
  b.rect(x0+W-Math.round(6*s),y0+Math.round(8*s),Math.round(4*s),Hh-Math.round(8*s),P.k0);                   // Haustür
  return [dx+dw/2,dy+dh/2]; }
function bellPost(b,x,by,top,swing){ var i, y;
  for (y=top;y<=by;y++){ b.px(x,y,P.w2); b.px(x+1,y,P.w1); b.px(x+2,y,P.w1); b.px(x+3,y,P.w0); if (hash(x,y)<0.15) b.px(x+1,y,P.w2); }
  b.rect(x-1,top,24,3,P.w1); b.hl(x-1,x+22,top,P.w2); b.hl(x-1,x+22,top+2,P.w0); b.line(x+4,top+3,x+9,top+8,P.w1); b.line(x+5,top+3,x+10,top+8,P.w0);   // Galgen mit Strebe
  var bx=x+17+(swing||0), bt=top+3; b.vl(x+17,top+3,top+4,P.k2);
  for (i=0;i<9;i++){ var hw=Math.round(1.6+i*0.42+(i>6?0.8:0)); for (var k=-hw;k<=hw;k++){ var u=(k+hw)/(2*hw+0.01), c=u<0.25?P.y3:(u<0.55?P.y2:(u<0.85?P.y1:P.y0)); if (i===8) c=P.y1; b.px(bx+k+Math.round((swing||0)*i/9),bt+2+i,c); } }   // Schiffsglocke aus Messing, grün angelaufen
  b.px(bx-2,bt+5,P.g4); b.px(bx+1,bt+7,P.g3); b.px(bx-1,bt+4,P.y4);
  var rx=bx+Math.round(swing||0); b.vl(rx,bt+11,bt+13,P.k2);                                                  // Klöppel
  return [rx,bt+13]; }
M.mem.k3_bell=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1501), WL=52, BK=84;
  // Himmel: niedrige Wolken, im Norden ein Schimmer der Stadt
  fill(b,0,0,w,WL,function(x,y){ return ra(R('k0 k1 k2 n0 n1'),0.18+y/90+(fbm(x,y*2.4,24,7)-0.5)*0.3+sm((x-120)/110)*0.18*sm((y-10)/40),x,y); });
  // drüben: Hügel, Weiden, der Quittenbaum, Zlatas Haus, Batos Schuppen, der Anleger mit dem Ponton
  for (x=0;x<w;x++){ var hy=27+Math.round(fbm(x,4,46,3)*11+Math.sin(x*0.018+1)*3); for (y=hy;y<WL;y++) b.px(x,y,ra(R('k0 k1 k1 k2'),0.4+(fbm(x,y,5,8)-0.5)*0.5,x,y)); }
  for (i=0;i<10;i++){ var tx=Math.floor(rg()*w), th=5+Math.floor(rg()*7); if (tx>134&&tx<210) continue; b.ellipse(tx,WL-2-th*0.5,3+rg()*4,th*0.55,function(x,y){ return bayer(x,y)<0.55?P.k1:P.k0; }); }
  var win=farHouse(b,158,35,1,true);
  b.rect(192,41,14,11,P.k1); b.hl(191,206,40,P.k2); b.vl(192,41,51,P.k0); b.rect(195,45,4,6,P.k0);                    // Schuppen
  for (i=0;i<4;i++) b.line(146,50,146+[-6,-3,3,6][i],[40,37,38,41][i],P.k1); b.vl(146,42,51,P.k1);                     // Quittenbaum, kahl
  b.rect(118,WL-2,22,3,P.k1); b.hl(118,139,WL-2,P.k2); b.vl(138,WL-8,WL-2,P.k2);                                       // Ponton am anderen Ufer
  // der Fluss: breit und schwarz; das Licht drüben spiegelt sich als zitternder Streifen
  fill(b,0,WL,w,BK-WL,function(x,y){ var d=(y-WL)/(BK-WL), f=fbm(x*0.3/(0.3+d),y*1.7,6,5)-0.5; return ra(R('k0 k0 k1 n0 n1'),0.32+f*0.4+(1-d)*0.08,x,y); });
  for (y=WL+1;y<BK-2;y++){ var sp=1+(y-WL)*0.09, jx=Math.round(win[0]+Math.sin(y*1.9)*sp*0.8); if (hash(jx,y)<0.75-(y-WL)/(BK-WL)*0.5) b.hl(jx-Math.floor(sp/2),jx+Math.floor(sp/2),y,(y<WL+8)?P.y3:P.y2); }
  // das Fährseil quer über den Fluss, vom Anker diesseits zum Ponton drüben
  for (i=0;i<=120;i++){ var t=i/120, sx=Math.round(40+(136-40)*t), sy=Math.round(88+(WL-8-88)*t+Math.sin(t*Math.PI)*5); b.px(sx,sy,t<0.5?P.m1:P.m0); }
  // diesseits: das Hochufer, Gras und Kies; die Hütte am linken Rand; der Anker
  fill(b,0,BK,w,h-BK,function(x,y){ var c=ra(R('k0 k1 k2 g0'),0.35+(y-BK)/40+(fbm(x,y,5,3)-0.5)*0.5,x,y); if (y===BK) c=P.k2; return c; });
  for (x=0;x<w;x+=2) if (hash(x,9)<0.6) b.vl(x,BK-1-Math.floor(hash(x,4)*3),BK,P.k1);
  b.poly([[4,58],[22,52],[42,58],[42,BK+4],[4,BK+4]],function(x,y){ return ra(R('k0 k1 k2'),0.4+(hash(x>>2,y>>2)-0.5)*0.5,x,y); }); b.rect(26,70,8,15,P.k0);
  b.rect(36,86,10,6,P.m0); b.hl(36,45,86,P.m1); b.ellipse(41,88,1.6,1.6,P.k1);                                       // Seilanker
  // Pfosten mit Glocke, Seil, und Lana, die zieht
  var cl0=bellPost(b,58,96,26,1);
  fig(b,90,97,S({nh:[6,-40],fh:[4,-31],ln:-1,h:[0,-23],nf:[3,0,'f'],ff:[-4,0,'t']}),'L','mala');
  for (y=cl0[1];y<=57;y++) b.px(cl0[0]+Math.round((y-cl0[1])*0.25),y,P.e2);                                          // das Glockenseil bis in ihre Hand
  // Nieselregen, kaum zu sehen
  rain(b,rg,120,0,0,w,h,4,-0.2,function(x,y){ return bayer(x,y)<0.3?M.UP[b.get(x,y)]:undefined; });
  // Licht: der schwache Himmel, sonst Nacht; das Fenster drüben leuchtet
  M.light(b,M.lf.sum(M.lf.k(-0.3),M.lf.pool(win[0],win[1],18,12,1.0,1),M.lf.pool(76,44,40,40,0.4,1)));
  b.rect(Math.round(win[0])-2,Math.round(win[1])-1,4,3,P.y4); b.hl(Math.round(win[0])-2,Math.round(win[0])+1,Math.round(win[1])-1,P.y5); b.px(Math.round(win[0])-1,Math.round(win[1]),P.l0);
  // der Klang: drei feine Bögen neben der Glocke
  [7,11,15].forEach(function(r,k){ for (var a=-0.9;a<=0.9;a+=0.08){ var px=Math.round(cl0[0]+Math.cos(a)*r), py=Math.round(cl0[1]-7+Math.sin(a)*r); if (bayer(px,py)<0.7-k*0.18) b.px(px,py,P.s4); } });
  edgeDark(b,2.0); };


// ================================================================ 6. Das Seil (ghost): zwei Hände an einem Stahlseil über schwarzem Wasser, Gischt. Aus ihren Augen gesehen:
//    das Seil läuft vor ihr hinüber ins Dunkle, drüben ist kein Licht mehr. Keine Gesichter, kein Körper im Wasser.
// Hand am Seil, von unten gesehen (sie hängt darunter): Handfläche unter dem Seil, die Finger quer darüber und dahinter, der Daumen darunter.
// H Griffstelle auf dem Seil, d Richtung des Seils, f Richtung des Unterarms (zu uns), r Seilradius, s Größe
function gripHand(b,H,d,f,r,s,SK,SL,armLen){ var nx=-d[1], ny=d[0]; if (nx*f[0]+ny*f[1]>0){ nx=-nx; ny=-ny; }
  function at(a,c){ return [H[0]+d[0]*a+nx*c, H[1]+d[1]*a+ny*c]; }
  var P0=at(0.4*s,-(r+3.2*s)), wr=[P0[0]+f[0]*3.4*s,P0[1]+f[1]*3.4*s], el=[P0[0]+f[0]*(3.4+armLen)*s,P0[1]+f[1]*(3.4+armLen)*s], mid=[wr[0]+(el[0]-wr[0])*0.36,wr[1]+(el[1]-wr[1])*0.36];
  limb(b,mid,el,3.4*s,[SL[1],SL[2],SL[0]],-1,-1); limb(b,wr,mid,2.6*s,[SK[2],SK[3],SK[1]],-1,-1);                                  // Unterarm, Ärmel
  b.ellipse(P0[0],P0[1],4.3*s,3.6*s,function(x,y){ var u=(x+0.5-P0[0])*nx+(y+0.5-P0[1])*ny; return u>1.4*s?SK[4]:(u<-1.6*s?SK[1]:SK[3]); });   // Handfläche
  for (var k=-1.5;k<=1.5;k+=1){ var a0=at(k*2.15*s+0.4*s,-(r+0.6*s)), a1=at(k*2.15*s+0.2*s,r+0.2*s); limb(b,a0,a1,1.05*s,[SK[3],SK[4],SK[2]],-1,-1); }   // vier Finger quer über das Seil
  for (var j=-3.6;j<=4.4;j+=0.5){ var q=at(j*s,r+0.9*s); b.px(Math.round(q[0]),Math.round(q[1]),P.k1); }                          // dahinter verschwinden sie
  var t0=at(-3.2*s,-(r+1.4*s)), t1=at(-6.8*s,-(r+0.2*s)); limb(b,t0,t1,1.15*s,[SK[2],SK[3],SK[1]],-1,-1);                        // Daumen unter dem Seil
  var cr=at(0.3*s,-0.2*s); b.px(Math.round(cr[0]),Math.round(cr[1]),SK[1]); }
M.mem.k3_rope=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1502), HZ=26;
  // drüben: nur eine dunkle Uferlinie, kein Licht
  fill(b,0,0,w,HZ,function(x,y){ return ra(R('k0 k1 k1 k2'),0.18+y/80+(fbm(x,y*2,26,4)-0.5)*0.25,x,y); });
  for (x=0;x<w;x++){ var hy=HZ-4-Math.round(fbm(x,1,30,2)*7); for (y=hy;y<HZ+2;y++) b.px(x,y,bayer(x,y)<0.5?P.k0:P.k1); }
  // das Wasser: schwarz, schnell, in langen Zügen; nach vorn grober; weiße Kämme
  fill(b,0,HZ+2,w,h-HZ-2,function(x,y){ var d=(y-HZ)/(h-HZ), f=fbm((x+y*0.8)*0.22/(0.25+d),y*1.2/(0.4+d),5,9)-0.5; var c=ra(R('k0 k0 k1 a0 a1'),0.3+f*0.5+d*0.1,x,y);
    if (f>0.34-d*0.05 && (y&1) && bayer(x,y)<0.5) c=d>0.5?P.s2:P.a1; return c; });
  for (i=0;i<54;i++){ var fx=rg()*w, fy=HZ+4+Math.pow(rg(),0.7)*(h-HZ-4), d2=(fy-HZ)/(h-HZ), L=4+Math.floor(rg()*(4+d2*20)); for (var j=0;j<L;j++){ var px=Math.round(fx+j), py=Math.round(fy+j*0.3+Math.sin(j*0.4)*0.6); if (bayer(px,py)<0.85-j/L*0.6) b.px(px,py,d2>0.45?(j<L*0.6?P.s4:P.s3):P.a2); } }
  // das Stahlseil: vorn dick, nach drüben dünn, leicht durchhängend
  var C0=[-6,74], C1=[226,25];
  function cab(t){ return [C0[0]+(C1[0]-C0[0])*t, C0[1]+(C1[1]-C0[1])*t+Math.sin(t*Math.PI)*7]; }
  for (i=0;i<=600;i++){ var t=i/600, p=cab(t), r=Math.max(0.5,3.2*(1-t)+0.4); for (var yy=-Math.ceil(r);yy<=Math.ceil(r);yy++){ var px2=Math.round(p[0]), py2=Math.round(p[1]+yy); if (Math.abs(yy)>r) continue;
      var u=yy/r, c=u<-0.4?P.m3:(u<0.2?P.m2:(u<0.6?P.m1:P.k2)); if (u<-0.4 && ((px2+Math.round(t*40))%4===0)) c=P.m4; b.px(px2,py2,c); } }   // verdrillt, Glanz oben
  // Gischt, die am Seil hochspritzt
  for (i=0;i<120;i++){ var t2=Math.pow(rg(),1.4)*0.75, p2=cab(t2), sx=p2[0]+(rg()-0.5)*30*(1-t2), sy=p2[1]+4+rg()*24*(1-t2); b.px(Math.round(sx),Math.round(sy),rg()<0.6?P.s4:P.s5); if (rg()<0.3) b.px(Math.round(sx)+1,Math.round(sy),P.s3); }
  // die Hände: die vordere weiter rechts am Seil, die hintere näher; die Ärmel der Jeansjacke kommen von unten
  var SK=[P.p1,P.p2,P.p3,P.p4,P.p5], SL=[P.c0,P.c1,P.c2], d=[C1[0]-C0[0],C1[1]-C0[1]], dl=Math.hypot(d[0],d[1]); d=[d[0]/dl,d[1]/dl];
  var hA=cab(0.36), hB=cab(0.2);
  gripHand(b,[hA[0],hA[1]],d,[-0.45,0.89],2.0,1.25,SK,SL,26);
  gripHand(b,[hB[0],hB[1]],d,[-0.3,0.95],2.5,1.5,SK,SL,30);
  // Tropfen auf den Händen, Regen
  for (i=0;i<10;i++){ var hp=i<5?hA:hB; b.px(Math.round(hp[0]+(rg()-0.5)*10),Math.round(hp[1]+(rg()-0.5)*6),P.s6); }
  rain(b,rg,160,0,0,w,h,5,-0.2,function(x,y){ return bayer(x,y)<0.35?M.UP[b.get(x,y)]:undefined; });
  M.light(b,M.lf.sum(M.lf.k(-0.2),M.lf.pool(90,62,80,40,0.8,1),M.lf.band(0,30,-0.4,0)));
  edgeDark(b,2.2); };


// ================================================================ 7. Die Decke (ghost): ein Mädchen in einer grauen Decke am Herd, sie zittert; eine alte Frau reibt ihr die Hände
// gemauerter Holzherd (Šporet): weißes Email, schwarze Herdplatte, Messingstange; fire = Glut hinter der Ofentür (0..1)
function sporet(b,x0,y0,sw,sh,fire){ var x, y;
  for (y=y0;y<y0+sh;y++) for (x=x0;x<x0+sw;x++){ var u=(x-x0)/sw, c=ra(R('s2 s3 s4 s5'),0.75-u*0.35-(y-y0)/sh*0.25+(hash(x>>2,y>>2)-0.5)*0.06,x,y); if (x===x0) c=P.s5; if (x===x0+sw-1) c=P.s1; b.px(x,y,c); }
  b.rect(x0-2,y0-3,sw+4,3,P.k2); b.hl(x0-2,x0+sw+1,y0-3,P.m1); b.hl(x0-2,x0+sw+1,y0-1,P.k1);                                  // Herdplatte
  b.ellipse(x0+sw*0.3,y0-3,4,0.9,P.m1); b.ellipse(x0+sw*0.72,y0-3,4,0.9,P.m1);
  for (x=x0-1;x<=x0+sw;x++){ b.px(x,y0+2,(x%5===0)?P.y4:P.y3); } b.px(x0-1,y0+1,P.y1); b.px(x0+sw,y0+1,P.y1);                 // Messingstange
  var fx=x0+Math.round(sw*0.08), fw=Math.round(sw*0.34), fy=y0+Math.round(sh*0.22), fh=Math.round(sh*0.3);
  b.rect(fx,fy,fw,fh,P.k2); b.rect(fx+1,fy+1,fw-2,fh-2,P.m0); b.hl(fx+2,fx+fw-3,fy+Math.round(fh*0.45),fire>0.3?P.y4:P.t2); b.hl(fx+2,fx+fw-3,fy+Math.round(fh*0.45)+1,fire>0.3?P.t4:P.t1); b.px(fx+fw-2,fy+2,P.y2);   // Feuertür mit Glutspalt
  var ox=x0+Math.round(sw*0.5), ow=Math.round(sw*0.42); b.rect(ox,fy,ow,Math.round(sh*0.42),P.s3); b.hl(ox,ox+ow-1,fy,P.s5); b.rect(ox+2,fy+3,ow-4,2,P.m2); b.px(ox+ow-3,fy+4,P.y3);   // Backrohr
  b.rect(x0+2,y0+sh-Math.round(sh*0.2),sw-4,Math.round(sh*0.14),P.s2); b.hl(x0+2,x0+sw-3,y0+sh-Math.round(sh*0.2),P.s4);         // Holzlade
  return [fx+fw/2,fy+fh*0.5]; }
M.mem.k3_blanket=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1503), G=80;
  // gekalkte Wand, verrußt über dem Herd; Deckenbalken; Dielen
  fill(b,0,0,w,G,function(x,y){ var c=M.tex.plaster(x,y,R('s2 s3 s4'),40); var so=sm((70-Math.abs(x-40))/60)*sm((50-y)/50)*0.8; if (bayer(x,y)<so) c=M.DN[c]; return c; });
  b.rect(0,0,w,6,P.w1); b.hl(0,w-1,0,P.w0); b.hl(0,w-1,5,P.k2); for (x=0;x<w;x+=5) if (hash(x,2)<0.4) b.px(x,3,P.w2);
  fill(b,0,G,w,h-G,function(x,y){ return M.tex.boards(x,y-G,R('w0 w1 w2 w3'),5); }); b.hl(0,w-1,G,P.k1);
  // Fenster rechts: Morgen, grau; davor ein Topf mit Geranie; Zwiebelzöpfe, ein Kalender
  var WX=166, WY=14; b.rect(WX-3,WY-3,38,32,P.w2); fill(b,WX,WY,32,26,function(x,y){ return ra(R('s3 s4 s5 s6'),0.4+(y-WY)/40+(fbm(x,y,8,2)-0.5)*0.2,x,y); });
  for (x=WX;x<WX+32;x++){ var ry=WY+19+Math.round(Math.sin(x*0.2)*1.5); for (y=ry;y<WY+26;y++) b.px(x,y,ra(R('s1 s2 s3'),0.5+(y-ry)/14,x,y)); }   // drüben das Ufer im Dunst
  b.vl(WX+16,WY,WY+25,P.w1); b.hl(WX,WX+31,WY+12,P.w1); b.hl(WX-4,WX+35,WY+27,P.w3); b.hl(WX-4,WX+35,WY+28,P.w1);
  b.rect(WX+22,WY+20,6,5,P.t3); b.hl(WX+21,WX+28,WY+20,P.t4); for (i=0;i<6;i++) b.px(WX+21+Math.floor(rg()*8),WY+16+Math.floor(rg()*4),i%3?P.g2:P.r3);
  for (i=0;i<2;i++){ var ox=146+i*8; b.vl(ox,6,9,P.e2); for (y=10;y<30;y+=3){ b.ellipse(ox+(y%2),y+1,1.8,1.6,P.t3); b.px(ox,y,P.t4); } }
  b.rect(208,30,14,18,P.s5); b.rect(208,30,14,4,P.r2); M.microText(b,'1994',209,35,P.k2); for (y=41;y<47;y+=2) b.hl(210,219,y,P.s3);
  // Regal mit dem Radio (aus)
  b.rect(110,28,32,2,P.w3); b.hl(110,141,28,P.w4); b.rect(114,18,20,10,P.w2); b.hl(114,133,18,P.w3); b.rect(116,20,8,6,P.e2); for (y=21;y<26;y+=2) b.hl(116,123,y,P.e1); b.rect(126,21,6,3,P.s4); b.px(129,25,P.k2);
  // der Herd mit Rohr und Kessel
  var fire=sporet(b,16,50,56,30,1);
  b.rect(24,10,5,40,P.k2); b.vl(24,10,49,P.m1); b.rect(22,8,9,4,P.k2);
  b.ellipse(56,44,6,4,function(x,y){ return y<44?P.m3:P.m2; }); b.rect(51,44,11,3,P.m2); b.line(60,42,64,39,P.m1); b.line(53,40,57,38,P.k2);   // Kessel
  for (i=0;i<22;i++){ var t=i/22, sx=64+Math.sin(t*5)*2+t*6, sy=38-i*1.2; if (bayer(Math.round(sx),Math.round(sy))<0.7-t*0.5) mixPx(b,Math.round(sx),Math.round(sy),P.s6,4); }   // Dampf
  // ein Schemel, darauf das Mädchen, in die graue Decke gewickelt; Zlata kniet vor ihr und reibt ihr die Hände
  b.rect(88,80,20,3,P.w3); b.hl(88,107,80,P.w4); b.vl(90,83,88,P.w1); b.vl(105,83,88,P.w1);
  fig(b,96,88,F({h:[0,-14],lf:[-3,0],rf:[3,0],lh:[2,-17],rh:[5,-17],sit:1,hd:'b'}),'F','mala');
  var BL=[[89,61],[103,61],[107,66],[110,76],[111,88],[81,88],[82,76],[85,66]];
  b.poly(BL,function(x,y){ var u=(x-81)/30, v=(y-61)/27, fold=Math.sin(x*0.6+y*0.1+Math.sin(y*0.22)*2), c=ra(R('m0 m1 m2 m3'),0.5+(u-0.35)*0.3-v*0.12+(fold>0.6?0.14:(fold<-0.6?-0.12:0)),x,y);
    var st=(y-61)-Math.abs(x-96)*0.25; if (st>15 && st<18) c=(fold>0)?P.k2:P.k1; if (Math.abs(x-97-(y-61)*0.08)<0.6 && y>66) c=P.m0; return c; });
  b.line(89,61,85,66,P.m3); b.line(103,61,107,66,P.m3); b.hl(90,102,61,P.m3);
  b.ellipse(100,71,2.6,1.8,P.p4); b.px(99,70,P.p5); b.px(101,72,P.p3);                                                         // ihre Hände, aus der Decke heraus
  var bm=new M.Buf(w,h,0); bm.poly(BL,1); for (y=58;y<88;y++) for (x=78;x<114;x++){ if (bm.get(x,y)) continue; var nb=bm.get(x+1,y)||bm.get(x-1,y); if (nb && ((x+y)&1) && bayer(x,y)<0.7) mixPx(b,x,y,P.s5,3); }   // der Umriss zittert
  fig(b,124,89,S({h:[2,-15],ln:5,nf:[8,0,'f'],ff:[-5,0,'t'],nh:[19,-19],fh:[18,-17],ho:[1,1]}),'L','k3m_zlata');
  b.ellipse(103,70.5,2.4,2,P.q3); b.px(102,69,P.q4); b.ellipse(105,72,2.2,1.7,P.q2);                                          // Zlatas Hände um ihre
  // Licht: Glut aus dem Herd von links, graues Morgenlicht vom Fenster
  M.light(b,M.lf.sum(M.lf.k(-0.9),M.lf.pool(fire[0]+30,fire[1],70,40,1.5,1.2),M.lf.pool(WX+16,WY+12,40,24,1.2,1),M.lf.beam(WX+8,WY+26,104,88,8,26,1.3)));
  b.hl(18,32,fire[1],P.y4); b.hl(19,31,fire[1]+1,P.t4); b.px(24,fire[1],P.y5);
  edgeDark(b,2.0); };


// ================================================================ 8. Der Ofen (memory): die letzte Erinnerung. Herd, Decken, ein Radio mit Lämpchen, Licht von einem Fenster, eine Hand in einer anderen Hand
M.mem.k3_oven=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1504);
  // die Wand, still; oben das Fenster, aus dem das Mittagslicht fällt
  fill(b,0,0,w,62,function(x,y){ return M.tex.plaster(x,y,R('s1 s2 s3'),30); });
  var WX0=96, WX1=142, WY1=30;
  b.rect(WX0-3,0,WX1-WX0+6,WY1+3,P.w2); fill(b,WX0,0,WX1-WX0,WY1,function(x,y){ return ra(R('s4 s5 s6 l1'),0.45+(1-y/WY1)*0.35+(fbm(x,y,9,3)-0.5)*0.15,x,y); });
  b.vl(Math.round((WX0+WX1)/2),0,WY1-1,P.w1); b.hl(WX0,WX1-1,14,P.w1); b.hl(WX0-4,WX1+3,WY1+1,P.w3); b.hl(WX0-4,WX1+3,WY1+2,P.w1);
  for (y=0;y<WY1;y++){ var vw=6+Math.round(Math.sin(y*0.15)*1.2); for (x=WX0;x<WX0+vw;x++) b.px(x,y,((x+y)%3===0)?P.s4:P.s5); }   // halb zugezogener Vorhang
  // das Radio auf dem Bord: Holzgehäuse, Stoffbespannung, Skala mit dem Lämpchen
  var RX=158, RY=16; b.rect(150,RY+22,52,3,P.w3); b.hl(150,201,RY+22,P.w4); b.hl(150,201,RY+24,P.w0);
  b.rect(RX,RY,38,22,P.w2); b.hl(RX+2,RX+35,RY,P.w4); b.px(RX+1,RY+1,P.w3); b.px(RX+36,RY+1,P.w3); b.vl(RX,RY+2,RY+21,P.w3); b.vl(RX+37,RY+1,RY+21,P.w0);
  fill(b,RX+3,RY+4,15,15,function(x,y){ return ((x+y)%2===0)?P.e2:P.e3; }); b.rect(RX+21,RY+4,14,6,P.s4); for (x=RX+22;x<RX+35;x+=2) b.px(x,RY+5,P.k2); b.vl(RX+27,RY+4,RY+9,P.r2);
  b.ellipse(RX+24,RY+15,2.2,2.2,P.w1); b.ellipse(RX+32,RY+15,2.2,2.2,P.w1); b.px(RX+23,RY+14,P.w4); b.px(RX+31,RY+14,P.w4);
  var LAMP=[RX+31,RY+7];
  // der Herd links: Feuertür mit Glut, Messingstange
  for (y=20;y<h;y++) for (x=0;x<60;x++){ var u=x/60, c=ra(R('s1 s2 s3 s4'),0.7-u*0.45+(hash(x>>2,y>>2)-0.5)*0.06,x,y); if (x===59) c=P.s0; b.px(x,y,c); }
  b.rect(0,16,62,4,P.k2); b.hl(0,61,16,P.m1); for (x=0;x<62;x++) b.px(x,23,(x%5===0)?P.y4:P.y3);
  b.rect(12,34,30,20,P.k2); b.rect(13,35,28,18,P.m0); b.hl(15,38,43,P.y4); b.hl(15,38,44,P.t4); b.hl(16,37,45,P.t3); b.px(39,37,P.y2);
  // die Decken: grau, mit schwarzem Streifen, in Falten über der Bank
  fill(b,0,58,w,h-58,function(x,y){ var top=62+Math.round(Math.sin(x*0.045+1)*4+Math.sin(x*0.13)*1.5); if (y<top || x<56) return undefined;
    var fold=Math.sin(x*0.16+Math.sin(y*0.09)*2.4+y*0.05), v=0.5+fold*0.16-(y-top)/120+(hash(x>>1,y>>1)-0.5)*0.06, c=ra(R('m0 m1 m2 m3'),v,x,y);
    var st=y-top-12-Math.sin(x*0.05)*3; if (st>0 && st<4) c=fold>0.2?P.k2:P.k1; if (y===top) c=P.m3; return c; });
  // die Hände: die junge kommt unter der Decke hervor und liegt in der alten; der alte Daumen auf ihrem Handrücken
  var HB=new M.Buf(w,h,T);
  var SKY=[P.p2,P.p3,P.p4,P.p5], SKO=[P.q1,P.q2,P.q3,P.q4];
  limb(HB,[234,84],[160,77],7,[P.m2,P.m3,P.m1],-1,-1); for (i=0;i<6;i++) HB.line(170+i*11,71,172+i*11,84,P.m1);                     // Strickärmel
  HB.poly([[160,70],[164,82],[158,84],[154,72]],P.m3);
  HB.ellipse(148,77,10,5.2,function(x,y){ var v=(y+0.5-77)/5.2; return v<-0.3?SKO[3]:(v<0.4?SKO[2]:SKO[1]); });                     // die alte Handfläche, darunter
  for (i=0;i<4;i++){ var fx=134+i*2.2, fy=79.5-i*0.4; limb(HB,[fx+6,fy],[fx,fy-1.2],1.6,[SKO[2],SKO[3],SKO[1]],-1,-1); HB.px(Math.round(fx),Math.round(fy-2),SKO[3]); }   // ihre Finger, von unten um die kleine Hand
  HB.poly([[96,66],[110,70],[114,79],[100,82],[92,74]],function(x,y){ return ra(R('m1 m2 m3'),0.5+(hash(x,y)-0.5)*0.2,x,y); });   // Deckenrand über dem Handgelenk
  limb(HB,[108,75],[118,73],3.0,[SKY[1],SKY[2],SKY[0]],-1,-1);                                                                      // ihr Handgelenk
  HB.ellipse(124,72.5,7.5,4.3,function(x,y){ var v=(y+0.5-72.5)/4.3; return v<-0.45?SKY[3]:(v<0.35?SKY[2]:SKY[1]); });            // Handrücken
  for (i=0;i<4;i++){ var y0=70.2+i*1.7; limb(HB,[130,y0],[141-i*0.8,y0+1+i*0.4],1.05,[SKY[2],SKY[3],SKY[1]],-1,-1); }             // ihre Finger, ruhig in der alten Hand
  HB.px(129,70,SKY[3]); HB.px(131,71,SKY[3]); HB.px(132,73,SKY[3]);
  limb(HB,[156,72],[146,67],2.0,[SKO[2],SKO[3],SKO[1]],-1,-1); limb(HB,[146,67],[133,69],1.7,[SKO[2],SKO[3],SKO[1]],-1,-1); HB.px(134,68,P.s5); HB.px(135,68,SKO[3]);   // der alte Daumen
  [[150,75],[152,78],[144,76],[141,79]].forEach(function(p){ HB.px(p[0],p[1],SKO[0]); HB.px(p[0]+1,p[1],SKO[1]); });                 // Falten der alten Hand
  M.outline(HB,P.k1); blitA(b,HB,0,0,false,1);
  // Licht: der Strahl vom Fenster auf die Hände, die Glut von links, das Lämpchen im Radio
  M.light(b,M.lf.sum(M.lf.k(-1.0),M.lf.beam(116,6,134,76,10,26,1.5),M.lf.pool(132,74,44,18,0.8,1.2),M.lf.pool(28,46,46,40,1.4,1.2),M.lf.pool(WX0+22,12,36,20,0.8,1)));
  b.hl(15,38,43,P.y4); b.hl(16,37,44,P.y5); b.px(26,43,P.l0);
  b.px(LAMP[0],LAMP[1],P.y5); b.px(LAMP[0]+1,LAMP[1],P.y4); b.px(LAMP[0],LAMP[1]+1,P.y4); b.px(LAMP[0]-1,LAMP[1],P.y3);
  for (i=0;i<26;i++){ var t=rg(), px=Math.round(116+(134-116)*t+(rg()-0.5)*16*t), py=Math.round(6+(76-6)*t); if (bayer(px,py)<0.4) b.px(px,py,P.s6); }   // Staub im Licht
  edgeDark(b,2.0); };


// ================================================================ 9. Die Reihenfolge (ghost): drei kleine Bilder nebeneinander – Glocke und Fenster dunkel, Glocke und Fenster hell, Glocke und Fenster dunkel
M.mem.k3_lightorder=function(b){ var w=b.w,h=b.h, x, y, i, k;
  b.rect(0,0,w,h,P.k0);
  var PW=62, PH=72, PY=11, PX=[15,85,155];
  PX.forEach(function(px,k){ var lit=(k===1), WL=PY+32, BK=PY+56, rg=M.rng(1600+k);
    // Rahmen wie ein Abzug
    b.rect(px-2,PY-2,PW+4,PH+4,P.s2); b.hl(px-2,px+PW+1,PY-2,P.s3); b.rect(px,PY,PW,PH,P.k0);
    function inP(x,y){ return x>=px && x<px+PW && y>=PY && y<PY+PH; }
    for (y=PY;y<PY+PH;y++) for (x=px;x<px+PW;x++){ var c;
      if (y<WL) c=ra(R('k0 k1 k2 n0'),0.2+(y-PY)/60+(fbm(x,y*2,16,7)-0.5)*0.3,x,y);
      else if (y<BK) c=ra(R('k0 k0 k1 n0'),0.3+(fbm(x*0.3,y*1.7,6,5)-0.5)*0.5,x,y);
      else c=ra(R('k0 k1 k2'),0.35+(y-BK)/30+(fbm(x,y,5,3)-0.5)*0.4,x,y);
      b.px(x,y,c); }
    for (x=px;x<px+PW;x++){ var hy=PY+20+Math.round(fbm(x,4,30,3)*7); for (y=hy;y<WL;y++) b.px(x,y,ra(R('k0 k1 k1'),0.45+(fbm(x,y,5,8)-0.5)*0.4,x,y)); }
    var win=farHouse(b,px+30,PY+17,0.9,lit); M.light(b,M.lf.pool(px+44,PY+20,18,10,0.9,1),0,0,inP);
    if (lit){ for (y=WL+1;y<BK-2;y++){ var sp=1+(y-WL)*0.12, jx=Math.round(win[0]+Math.sin(y*1.9)*sp*0.8); if (hash(jx,y)<0.75-(y-WL)/(BK-WL)*0.5) b.hl(jx-Math.floor(sp/2),jx+Math.floor(sp/2),y,(y<WL+6)?P.y3:P.y2); }
      for (y=win[1]-6;y<=win[1]+6;y++) for (x=win[0]-8;x<=win[0]+8;x++){ var d=Math.hypot(x-win[0],(y-win[1])*1.3)/8; if (d<1 && inP(x,y) && bayer(x,y)<(1-d)*0.5) b.px(x,y,M.UP[b.get(x,y)]); }
      b.rect(Math.round(win[0])-2,Math.round(win[1])-1,3,2,P.y4); b.px(Math.round(win[0])-1,Math.round(win[1])-1,P.y5); }
    // Pfosten mit der Glocke, sie schwingt; daneben die Bögen des Klangs
    var cl0=bellPost(b,px+6,PY+PH-6,PY+14,k===1?-1:1);
    for (var r=5;r<=11;r+=3) for (var a=-0.8;a<=0.8;a+=0.1){ var qx=Math.round(cl0[0]+Math.cos(a)*r), qy=Math.round(cl0[1]-7+Math.sin(a)*r); if (inP(qx,qy) && bayer(qx,qy)<0.75-(r-5)*0.08) b.px(qx,qy,P.s4); }
    for (y=cl0[1];y<PY+PH-16;y++) b.px(cl0[0],y,P.e2);
    // darunter: erstes, zweites, drittes Läuten
    for (i=0;i<=k;i++){ var dx=px+PW/2-(k*5)/2+i*5; b.rect(Math.round(dx)-1,PY+PH+6,3,3,P.s4); b.px(Math.round(dx),PY+PH+6,P.s5); }
    // im Bild leicht abgedunkelte Ränder
    M.light(b,function(x,y){ if (!inP(x,y)) return 0; var ex=Math.min(x-px,px+PW-1-x,y-PY,PY+PH-1-y); return ex<6?-(6-ex)*0.18:0; }); });
  edgeDark(b,1.2); };


// ================================================================ 10. Mate am Tor (ghost): in den Neunzigern, Abendsonne. Ein Mann mit Hut und Thermoskanne am Pfosten, den Schlüssel in der Hand;
//     ein Reisebus fährt vorbei und hält nicht. Hinter dem Zaun ein junger Feigenbaum.
M.mem.k3_mate=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1997), G=88;
  // Himmel am Abend, ein paar Streifenwolken; dahinter die Hügel
  fill(b,0,0,w,60,function(x,y){ return ra(R('b3 b4 d5 d6 d6'),0.15+y/62+(fbm(x,y*3,30,2)-0.5)*0.15,x,y); });
  for (i=0;i<5;i++){ var cx=rg()*w, cy=8+rg()*24; b.ellipse(cx,cy,18+rg()*24,1.4,function(x,y){ return bayer(x,y)<0.6?P.d5:P.d4; }); }
  for (x=0;x<w;x++){ var hy=40+Math.round(fbm(x,2,50,4)*10); for (y=hy;y<64;y++) b.px(x,y,ra(R('d2 d3 e2 e3'),0.45+(y-hy)/40+(fbm(x,y,6,5)-0.5)*0.3,x,y)); }
  // das Haus: unten verputzt, oben roher Ziegel, Balkon mit Eisengeländer, Rollläden
  var HX0=118, HX1=220, HT=14, HB=G-4;
  for (y=HT;y<HB;y++) for (x=HX0;x<HX1;x++){ var c, up=y<HT+34; if (up) c=M.tex.bricks(x,y,R('t1 t2 t3 t4'),8,4); else c=M.tex.plaster(x,y,R('s3 s4 s5'),70); if (x===HX0) c=M.UP[c]; if (x>HX1-3) c=M.DN[c]; b.px(x,y,c); }
  for (y=HT-8;y<HT;y++){ var ov=Math.round((y-(HT-8))*0.6); for (x=HX0-4-ov;x<HX1+4+ov;x++) b.px(x,y,(y===HT-1)?P.t1:ra(R('t1 t2 t3'),0.5+(hash(x>>2,y)-0.5)*0.4,x,y)); }
  for (x=HX0-10;x<HX1+10;x++){ b.px(x,HT-1,P.t1); } b.hl(HX0-9,HX1+9,HT,P.k2);
  [[132,22],[170,22],[198,22]].forEach(function(p){ b.rect(p[0],p[1],14,14,P.s2); b.rect(p[0]+1,p[1]+1,12,12,P.k2); for (y=p[1]+1;y<p[1]+8;y+=2) b.hl(p[0]+1,p[0]+12,y,P.s3); });   // Fenster mit halb gezogenen Rollläden
  b.rect(HX0+2,HT+34,HX1-HX0-4,3,P.s3); b.hl(HX0+2,HX1-3,HT+34,P.s5); for (x=HX0+4;x<HX1-4;x+=4) b.vl(x,HT+26,HT+33,P.k2); b.hl(HX0+2,HX1-3,HT+26,P.k2);   // Balkon
  b.rect(186,HT+42,14,HB-HT-42,P.w1); b.rect(188,HT+44,10,HB-HT-46,P.w2); b.px(196,HT+56,P.y3);                                   // Haustür
  b.rect(140,HT+46,16,12,P.s2); b.rect(141,HT+47,14,10,P.n1); b.vl(148,HT+47,HT+56,P.s3);
  // Zaun mit Tor; der gemauerte Pfosten, an dem er immer stand; dahinter der junge Feigenbaum
  var PXP=76; b.rect(PXP-1,52,9,G-52,P.s3); b.vl(PXP-1,52,G-1,P.s5); b.vl(PXP+7,52,G-1,P.s1); b.rect(PXP-2,50,11,3,P.s4); b.hl(PXP-2,PXP+8,50,P.s5);
  for (x=PXP+8;x<HX1;x+=5){ b.vl(x,64,G-1,P.k2); b.px(x,63,P.m2); } b.hl(PXP+8,HX1,66,P.k2); b.hl(PXP+8,HX1,80,P.k2);              // Eisenzaun
  b.rect(PXP+9,62,26,26,P.k2); fill(b,PXP+10,63,24,24,function(x,y){ var g=((x-PXP)%4===0)||((y-63)%12===0)||(Math.abs((x-PXP-22)-(y-75))<1); return g?P.k2:undefined; });   // Tor
  var FX=104, FY=G-2; b.line(FX,FY,FX-1,FY-14,P.w2); b.line(FX-1,FY-10,FX-6,FY-17,P.w2); b.line(FX,FY-12,FX+5,FY-19,P.w2);
  [[-7,-19],[-3,-22],[2,-21],[6,-20],[-5,-14],[4,-15],[0,-17]].forEach(function(o){ b.ellipse(FX+o[0],FY+o[1],2.6,2,function(x,y){ return (x+y)%3?P.g3:P.g4; }); b.px(FX+o[0],FY+o[1]+1,P.g2); });   // große Blätter
  // die Straße, Staub; der Bus fährt nach links aus dem Bild
  fill(b,0,G,w,h-G,function(x,y){ var c=ra(R('m1 m2 m3'),0.5+(y-G)/30+(hash(x>>2,y)-0.5)*0.15,x,y); if (y===G) c=P.s2; if (y===G+9 && x%14<8) c=P.s4; return c; });
  var BX1=62, BT=38, BB=G+4;
  b.poly([[-10,BT],[BX1-4,BT],[BX1,BT+4],[BX1,BB],[-10,BB]],function(x,y){ var v=(y-BT)/(BB-BT); return ra(R('s3 s4 s5 s6'),0.92-v*0.5,x,y); });
  b.rect(-10,BT+6,BX1-2,14,P.k2); for (x=0;x<BX1-4;x+=12) b.vl(x,BT+6,BT+19,P.m0); b.rect(-10,BT+24,BX1,3,P.b1); b.hl(-10,BX1-1,BT+24,P.b2); b.rect(BX1-5,BT+8,4,10,P.r3);   // Fenster, blaues Band, Rücklicht
  b.ellipse(26,BB,7,5.5,P.k1); b.ellipse(26,BB,3.4,3.4,P.m2); b.hl(-10,BX1,BB-6,P.m1);
  for (i=0;i<60;i++){ var sx=Math.floor(rg()*BX1), sy=BT+Math.floor(rg()*(BB-BT)), L=3+Math.floor(rg()*8); b.hl(sx,sx+L,sy,M.UP[b.get(sx,sy)]); }   // Fahrtstreifen
  for (i=0;i<70;i++){ var dx=BX1+rg()*30, dy=BB-8+rg()*10; if (bayer(Math.round(dx),Math.round(dy))<0.55-(dx-BX1)/60) mixPx(b,Math.round(dx),Math.round(dy),P.e4,4); }   // Staub hinter dem Bus
  // Mate am Pfosten: Hut, grauer Anzug, die Thermoskanne in der einen Hand, den Schlüssel in der anderen
  fig(b,92,G+1,S({nh:[8,-22],fh:[-1,-16],ho:[0,0]}),'L','k3m_mate');
  b.rect(91,G-17,4,9,P.r2); b.vl(91,G-17,G-9,P.r3); b.rect(91,G-18,4,2,P.m3); b.hl(91,94,G-13,P.s5);                           // Thermoskanne
  b.px(82,G-22,P.y4); b.px(81,G-22,P.y3); b.px(80,G-21,P.y3); b.px(81,G-21,P.y2);                                               // der Schlüssel
  // lange Schatten nach rechts
  for (y=G+1;y<G+7;y++) for (x=92;x<150;x++){ if (Math.abs((y-G)-(x-92)*0.1)<1.6 && bayer(x,y)<0.7) b.px(x,y,M.DN[b.get(x,y)]); }
  M.light(b,M.lf.sum(M.lf.xband(0,w,0.4,-0.6),M.lf.band(60,104,0,-0.4),M.lf.pool(88,64,40,34,0.5,1)));
  edgeDark(b,1.8); };


// ================================================================ 11. Die Geisterfähre (ghost): sehr dunkle Frostnacht. Ein Ponton an einem Seil aus Licht über dem Fluss,
//     hinten der alte Fährmann mit der Stange, vorn die junge Frau mit ihrer Dose; drüben eine Lampe am Ufer.
M.mem.k3_ferry=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2711), WL=44;
  // Himmel: klar, Neumond, Sterne
  fill(b,0,0,w,WL,function(x,y){ return ra(R('k0 k0 k1 k2'),0.12+y/60,x,y); });
  for (i=0;i<70;i++){ var sx=Math.floor(rg()*w), sy=Math.floor(rg()*30); b.px(sx,sy,rg()<0.15?P.n5:(rg()<0.5?P.n3:P.n2)); }
  // drüben: das linke Ufer mit Haus, Schuppen, Quittenbaum; Zlata mit der Lampe am Anleger; flussauf die neue Brücke mit einer Laterne
  for (x=0;x<w;x++){ var hy=26+Math.round(fbm(x,3,44,5)*9); for (y=hy;y<WL;y++) b.px(x,y,ra(R('k0 k1 k1'),0.4+(fbm(x,y,5,2)-0.5)*0.4,x,y)); }
  b.rect(168,30,22,13,P.k1); for (y=0;y<7;y++) b.hl(167+y,190-y,29-y,P.k2); b.rect(172,36,6,3,P.k0); b.rect(192,34,10,9,P.k1);
  for (i=0;i<4;i++) b.line(160,42,160+[-5,-2,2,5][i],[34,32,32,35][i],P.k2);
  var ZL=[184,41]; b.vl(ZL[0],ZL[1]-3,ZL[1]+1,P.k2);
  b.hl(4,64,33,P.k2); b.hl(4,64,34,P.k1); for (x=8;x<64;x+=14) b.vl(x,34,43,P.k1); b.vl(40,27,33,P.k2); var BL=[40,26];   // die neue Brücke, weit flussauf
  // der Fluss: schwarz, still und schnell
  fill(b,0,WL,w,h-WL,function(x,y){ var d=(y-WL)/(h-WL), f=fbm(x*0.25/(0.3+d),y*1.6,6,8)-0.5; return ra(R('k0 k0 k1 n0 a0'),0.25+f*0.4+d*0.12,x,y); });
  b.hl(0,w-1,WL,P.k0);
  // das Seil aus Licht: vom Anker vorn links hinüber zum Anleger drüben, mit einem weichen Schein
  var C0=[-4,88], C1=[188,43];
  function cab(t){ return [C0[0]+(C1[0]-C0[0])*t, C0[1]+(C1[1]-C0[1])*t+Math.sin(t*Math.PI)*-3]; }
  for (i=0;i<=500;i++){ var t=i/500, p=cab(t); for (var yy=-4;yy<=4;yy++){ var px=Math.round(p[0]), py=Math.round(p[1]+yy), d2=Math.abs(yy); if (d2===0) b.px(px,py,t<0.8?P.l0:P.y5); else if (bayer(px,py)<0.5-d2*0.11) b.px(px,py,d2<2?P.y4:P.y2); } }
  for (i=0;i<=120;i++){ var t2=i/120, p2=cab(t2), ry=Math.round(p2[1]+(h-p2[1])*0.55+Math.sin(i*1.7)*1.5); if (ry<h && ry>WL && hash(i,3)<0.55) b.px(Math.round(p2[0]),ry,P.y2); }   // sein Spiegel im Wasser
  // der Ponton: Holzdeck auf dunklen Schwimmern, ein Geländer; am Seil mit einer Rolle
  var DX0=70, DX1=176, DY=86;
  for (y=DY;y<DY+8;y++) for (x=DX0-Math.round((y-DY)*0.3);x<DX1+Math.round((y-DY)*0.3);x++){ var c=(y<DY+3)?ra(R('w1 w2 w3'),0.55+(((x>>3)&1)?0.12:0)-(y-DY)*0.1,x,y):ra(R('k1 k2 m0'),0.5-(y-DY-3)*0.08,x,y); if (y===DY) c=P.w4; b.px(x,y,c); }
  for (x=DX0;x<DX1;x+=12) b.vl(x,DY-12,DY-1,P.w2); b.hl(DX0,DX1-1,DY-12,P.w3); b.hl(DX0,DX1-1,DY-11,P.w1);                     // Geländer
  var PU=cab(0.62); b.line(Math.round(PU[0]),Math.round(PU[1])+1,128,DY-12,P.m2); b.ellipse(PU[0],PU[1]+1,1.6,1.6,P.m3);          // Rolle und Leine zum Seil
  for (i=0;i<40;i++){ var wx=DX0-6+rg()*(DX1-DX0+12), wy=DY+8+rg()*5; b.hl(Math.round(wx),Math.round(wx)+1+Math.floor(rg()*3),Math.round(wy),rg()<0.5?P.n1:P.a1); }   // Kräuseln an den Schwimmern
  // die Sturmlaterne am Pfosten
  var LN=[118,DY-17]; b.vl(LN[0],LN[1]-3,LN[1],P.k2); b.rect(LN[0]-2,LN[1],5,6,P.k2); b.rect(LN[0]-1,LN[1]+1,3,4,P.y4); b.hl(LN[0]-2,LN[0]+2,LN[1]+6,P.m1);
  // Bato hinten mit der Stange, Mala vorn mit der Dose
  fig(b,92,DY+1,S({nh:[7,-27],fh:[9,-33],ln:2,nf:[3,0,'f'],ff:[-5,0,'t']}),'R','k3m_bato');
  b.line(84,DY+16,106,DY-44,P.w2); b.line(85,DY+16,107,DY-44,P.w1);                                                             // die Stange, ins Wasser
  fig(b,146,DY+1,F({it:'tin'}),'F','mala');
  // Licht: die Laterne, das Seil; sonst Dunkel
  M.light(b,M.lf.sum(M.lf.k(-0.5),M.lf.pool(LN[0],LN[1]+3,44,28,2.2,1.1),M.lf.pool(ZL[0],ZL[1],10,6,1.0,1)));
  b.rect(LN[0]-1,LN[1]+1,3,4,P.y5); b.px(LN[0],LN[1]+2,P.l1);
  b.px(ZL[0],ZL[1]-4,P.y4); b.px(ZL[0],ZL[1]-5,P.y5); b.px(BL[0],BL[1],P.y4);
  for (y=DY+8;y<h;y++){ var jx=LN[0]+Math.round(Math.sin(y*1.6)*1.5); if (hash(jx,y)<0.6-(y-DY)/40) b.px(jx,y,P.y3); }          // Spiegel der Laterne
  edgeDark(b,2.0); };


// ================================================================ 12. Vratnik im Winter 1994 (memory): ein Junge hackt Holz vor einem kleinen Haus; im Fenster ein heller Fleck
M.mem.k3_vratnik=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1994), G=84;
  // grauer Winterhimmel, der Hang von Vratnik mit Häusern, verschneiten Dächern, Rauch, kahlen Bäumen; oben die alte Stadtmauer
  fill(b,0,0,w,G,function(x,y){ return ra(R('s3 s4 s4 s5'),0.3+y/120+(fbm(x,y*2,26,3)-0.5)*0.25,x,y); });
  for (x=0;x<w;x++){ var hy=30+Math.round(fbm(x,1,60,2)*14-x*0.04); for (y=hy;y<G;y++) b.px(x,y,ra(R('s3 s4 s5'),0.55+(fbm(x,y,6,4)-0.5)*0.3,x,y)); }
  for (x=150;x<232;x++){ var wy=26+Math.round((x-150)*-0.08); b.px(x,wy,P.s2); b.px(x,wy+1,P.s3); if (x%6<3) b.px(x,wy-1,P.s2); } b.rect(196,14,12,14,P.s2); b.hl(195,208,14,P.s5); b.rect(200,20,4,7,P.s1);   // Mauer und Torturm
  var r=M.rng(77);
  for (i=0;i<16;i++){ var hx=Math.floor(r()*232), hyy=34+Math.floor(r()*26)+Math.round(hx*-0.02), hw=12+Math.floor(r()*12), hh=8+Math.floor(r()*6);
    if (hx>70&&hx<180&&hyy>48) continue;
    for (y=hyy;y<hyy+hh;y++) for (x=hx;x<hx+hw;x++) b.px(x,y,(x===hx)?P.s3:((y-hyy)%5===3&&(x-hx)%4===1?P.s1:P.s4));
    for (y=0;y<5;y++) b.hl(hx-1+y,hx+hw-y,hyy-1-y,y<2?P.s6:P.s5); b.hl(hx-1,hx+hw,hyy-1,P.s2);
    if (r()<0.5){ var cx=hx+3+Math.floor(r()*(hw-6)); b.rect(cx,hyy-8,2,4,P.s2); for (var k=0;k<14;k++) if (bayer(cx,hyy-10-k)<0.5-k*0.03) mixPx(b,cx+Math.round(Math.sin(k*0.5)*2+k*0.3),hyy-10-k,P.s2,3); } }
  for (i=0;i<9;i++){ var tx=Math.floor(r()*232), ty=40+Math.floor(r()*20); b.vl(tx,ty-8,ty,P.s1); b.line(tx,ty-5,tx-3,ty-9,P.s1); b.line(tx,ty-6,tx+3,ty-10,P.s1); }
  M.fogBake(b,function(x,y){ return y<G?0.35-y/G*0.25:0; },{col:P.s5});
  // das kleine Haus: weiße Wand, dunkle Holzbalken, steiles Dach unter Schnee, Fenster mit dem hellen Fleck, eine Tür
  var HX0=96, HX1=176, HT=42;
  for (y=HT;y<G;y++) for (x=HX0;x<HX1;x++){ var c=M.tex.plaster(x,y,R('s3 s4 s5'),60); if (x===HX0||x===HX1-1||(x-HX0)%26===0) c=P.w1; if (y===HT||y===HT+20) c=P.w1; b.px(x,y,c); }
  for (y=0;y<16;y++){ for (x=HX0-6+y;x<HX1+6-y;x++){ var sn=fbm(x*0.6,y*1.4,5,21), cc=ra(R('s4 s5 s6'),0.55+sn*0.4-(y<3?0.15:0),x,HT-1-y); if (sn<0.3 && y>4 && bayer(x,y)<0.5) cc=P.s3; b.px(x,HT-1-y,cc); } }   // Dach unter dickem Schnee, nur hier und da die Ziegel
  b.hl(HX0-7,HX1+6,HT-1,P.s6); b.hl(HX0-7,HX1+6,HT,P.s3);
  b.rect(158,HT-26,4,9,P.s2); b.hl(157,162,HT-27,P.s6);
  var WX=110, WY=52; b.rect(WX-2,WY-2,22,18,P.w1); b.rect(WX,WY,18,14,P.k2); b.vl(WX+9,WY,WY+13,P.w1); b.hl(WX,WX+17,WY+6,P.w1); b.hl(WX-3,WX+20,WY+15,P.s6);   // Fenster
  for (y=WY;y<WY+14;y++) for (x=WX;x<WX+18;x++){ var d=Math.hypot((x-WX-6)/5,(y-WY-7)/5.5); if (d<1 && x!==WX+9 && y!==WY+6){ var cs=d<0.45?P.l1:(d<0.75?P.s6:P.s4); if (bayer(x,y)<1.1-d) b.px(x,y,cs); } }   // der helle Fleck
  b.rect(146,58,14,G-58,P.w1); b.rect(148,60,10,G-60,P.w2); b.px(156,71,P.y2); b.hl(145,160,57,P.s6);
  // der Hof: Schnee, ein Hackklotz, gespaltene Scheite, ein Stapel an der Wand
  fill(b,0,G,w,h-G,function(x,y){ var c=ra(R('s4 s5 s6'),0.6+(y-G)/40+(fbm(x,y,6,3)-0.5)*0.3,x,y); if (hash(x>>1,y)<0.03) c=P.s3; return c; }); b.hl(0,w-1,G,P.s3);
  for (i=0;i<6;i++){ var lx=164+i*6, ly=G-4-(i%2)*4; b.ellipse(lx,ly,3,2.4,P.w2); b.ellipse(lx,ly,1.6,1.4,P.w4); b.px(lx,ly,P.w3); }
  for (i=0;i<5;i++){ var lx2=172+i*6, ly2=G-12; b.ellipse(lx2,ly2,3,2.4,P.w2); b.ellipse(lx2,ly2,1.6,1.4,P.w4); } b.hl(162,200,G-15,P.s6);
  b.rect(66,G-6,14,8,P.w2); b.ellipse(73,G-6,7,2,P.w4); b.ellipse(73,G-6,4,1.2,P.w3); b.vl(66,G-6,G+1,P.w1);                          // Hackklotz
  [[84,G+5,0.3],[90,G+8,-0.4],[58,G+7,0.6]].forEach(function(s){ b.line(s[0]-4,s[1],s[0]+4,s[1]+Math.round(s[2]*4),P.w3); b.line(s[0]-4,s[1]+1,s[0]+4,s[1]+1+Math.round(s[2]*4),P.w1); b.px(s[0]-4,s[1],P.w4); });   // Scheite im Schnee
  // der Junge: rote Mütze, gestreifter Pullover; die Axt über dem Kopf
  fig(b,52,G+3,S({nh:[3,-44],fh:[1,-43],ln:-2,h:[0,-23],nf:[5,0,'f'],ff:[-5,0,'f'],ho:[-1,0]}),'R','k3m_mali');
  b.line(55,G-41,70,G-50,P.w3); b.line(55,G-40,70,G-49,P.w1); b.poly([[68,G-54],[74,G-52],[73,G-47],[69,G-48]],P.m2); b.line(68,G-54,74,G-52,P.m4);   // die Axt
  for (i=0;i<10;i++){ if (bayer(62+i,G-36-Math.round(i*0.4))<0.6-i*0.05) mixPx(b,62+i,G-36-Math.round(i*0.4),P.s6,4); }                                  // sein Atem
  // Schnee fällt
  for (i=0;i<150;i++){ var fx=Math.floor(rg()*w), fy=Math.floor(rg()*h); b.px(fx,fy,rg()<0.3?P.s6:P.s5); }
  M.light(b,M.lf.sum(M.lf.k(-0.1),M.lf.band(0,104,0.15,-0.45),M.lf.pool(WX+8,WY+7,24,16,0.8,1)));
  for (y=WY;y<WY+14;y++) for (x=WX;x<WX+18;x++){ var d2=Math.hypot((x-WX-6)/4,(y-WY-7)/4.5); if (d2<0.5 && x!==WX+9 && y!==WY+6) b.px(x,y,P.l1); }
  edgeDark(b,1.8); };


// ================================================================ 13. Im Bus nach Sarajevo (memory): eine Reihe dahinter gesehen. Nada am Fenster, daneben auf dem Sitz ein heller Fleck (Mala);
//     weiter vorn zwei Hinterköpfe. Grauer, milder Morgen über der Neretva.
M.mem.k3_home=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2811);
  b.rect(0,0,w,h,P.k2);
  // das große Fenster links, schräg nach vorn: draußen grauer Morgen, der Fluss, die Hänge
  var WP=[[6,8],[150,22],[150,50],[6,62]], wm=new M.Buf(w,h,0); wm.poly(WP,1);
  var o=new M.Buf(w,h,P.s4);
  fill(o,0,0,w,70,function(x,y){ return ra(R('s3 s4 s4 s5'),0.4+y/90+(fbm(x*0.6,y*2,20,4)-0.5)*0.3,x,y); });
  var hl=function(x){ return Math.round(30+Math.sin(x*0.03+0.5)*5+(fbm(x,1,14,5)-0.5)*8); };
  for (x=0;x<w;x++){ for (y=hl(x);y<52;y++) o.px(x,y,ra(R('s1 s2 g1 g2 s2'),0.45+(fbm(x,y,5,6)-0.5)*0.6-(y-hl(x))/60,x,y)); }
  for (y=50;y<70;y++) for (x=0;x<w;x++) o.px(x,y,ra(R('a2 a3 s3 a4'),0.45+Math.sin(x*0.25+y*1.3)*0.12+(y-50)/60,x,y));
  M.fogBake(o,function(x,y){ return Math.max(0,0.55-Math.abs(y-34)/30)*(0.7+fbm(x,y,12,3)*0.6); },{col:P.s4});
  for (y=0;y<h;y++) for (x=0;x<w;x++) if (wm.get(x,y)) b.px(x,y,o.get(x,y));
  [[44,13],[96,17],[132,21]].forEach(function(p,k){ var pw=6-k*2; for (x=p[0];x<p[0]+pw;x++){ var t=(x-6)/144, yt=Math.round(8+14*t), yb=Math.round(62-12*t); for (y=yt-1;y<=yb;y++) b.px(x,y,k?P.k2:P.k1); } });   // Fensterpfosten
  for (x=6;x<150;x++){ var t2=(x-6)/144; b.px(x,Math.round(62-12*t2),P.m3); b.px(x,Math.round(62-12*t2)+1,P.m1); b.px(x,Math.round(8+14*t2)-1,P.k1); }
  // Decke mit Gepäckablage, rechts die Gangseite
  fill(b,0,0,w,24,function(x,y){ var t=(x-6)/144, yt=8+14*t; if (y>=yt-1 && x<150) return undefined; return ra(R('k2 m0 m1 m2'),0.5-y/50+(hash(x>>3,y)-0.5)*0.06,x,y); });
  for (x=0;x<180;x++){ var ry=Math.round(6+12*(x/180)); b.px(x,ry,P.m3); b.px(x,ry+1,P.k1); }
  // weiter vorn: Sitzreihen, kleiner; zwei Hinterköpfe; ganz vorn hell die Frontscheibe
  fill(b,156,22,30,16,function(x,y){ return ra(R('s4 s5 s6'),0.55+(fbm(x,y,6,4)-0.5)*0.3,x,y); }); b.rect(150,22,6,30,P.k2);
  function seatBack(cx,top,sw,sh,cv){ var r=Math.max(1,Math.round(sw*0.22)), x0=cx-sw/2, x1=cx+sw/2;
    for (y=top;y<top+sh;y++) for (x=Math.round(x0);x<=Math.round(x1);x++){ var ex=Math.min(x-x0,x1-x), ey=y-top; if (ex<r && ey<r && Math.hypot(r-ex,r-ey)>r) continue;
      var u=(x-x0)/sw, c=ra(R('k2 n0 n1 c1 c2 c3'),0.62-Math.abs(u-0.36)*0.55-(y-top)/(sh*2.2)+(ey<2?0.18:0),x,y); if ((((x+y*2)%8)===0||((x-y*2)%8+8)%8===0) && ey>2) c=M.UP[c];
      if (cv && ey>=2 && ey<sh*0.34 && Math.abs(u-0.5)<0.24){ var f=Math.sin(x*0.9); c=ra(R('s2 s3 s4 s5'),0.8-Math.abs(u-0.42)*1.4-ey/(sh*0.7)+(f>0.7?-0.18:0),x,y); }
      b.px(x,y,c); }
    if (sw>40){ for (x=Math.round(x0+r);x<=Math.round(x1-r);x++){ b.px(x,top-2,P.m3); b.px(x,top-1,P.m1); } b.px(Math.round(x0+r),top-1,P.k2); b.px(Math.round(x1-r),top-1,P.k2); b.hl(Math.round(cx-sw*0.2),Math.round(cx-sw*0.1),top-2,P.m4); } }   // Haltegriff
  [[148,40,10,9],[136,42,13,11],[122,44,17,13],[106,47,22,15]].forEach(function(s,k){ seatBack(s[0],s[1],s[2],s[3],true); seatBack(s[0]+s[2]+2,s[1],s[2],s[3],true); });
  b.ellipse(124,40,3.6,4,P.h1); b.ellipse(123.5,39.5,2.6,2.8,P.h2); b.px(123,41,P.p2);                                           // ein Hinterkopf, dunkles Haar
  b.ellipse(144,36,2.8,3.2,P.m3); b.ellipse(143.6,35.6,2,2.2,P.m4);                                                               // der zweite, grau
  b.ellipse(170,31,2.4,2.8,P.k1); b.rect(167,33,7,5,P.k1);                                                                        // vorn der Fahrer
  fill(b,180,24,52,80,function(x,y){ return ra(R('k1 k2 m0'),0.4+(x-180)/200+(hash(x>>3,y>>3)-0.5)*0.06,x,y); });                  // Gangseite, Sitze rechts im Dunkeln
  seatBack(214,52,40,52,true);
  // die Reihe direkt vor uns: Nada am Fenster, daneben der Sitz, auf dem nur ein heller Fleck ist
  seatBack(66,60,76,46,true); seatBack(148,60,74,46,true);
  // Nada: Schultern im dunklen Mantel, graues Haar, zum Fenster geneigt; im Glas ein blasser Widerschein ihres Gesichts
  var NB=new M.Buf(w,h,T);
  NB.poly([[44,62],[50,52],[64,48],[78,50],[88,57],[90,62]],function(x,y){ return ra(R('k0 k1 k2'),0.4+(x-44)/90,x,y); }); NB.poly([[57,50],[71,49],[72,53],[56,54]],P.m1);   // Schultern, Kragen
  headB(NB,64,38,8.5,9.5,-1,{skin:[P.p0,P.p1,P.p1,P.p2],hair:[P.k2,P.m0,P.m1,P.m2],lift:0});
  NB.ellipse(70,30,3.4,2.8,function(x,y){ return (x+y)%2?P.m1:P.m0; });                                                               // Haarknoten
  for (y=0;y<h;y++) for (x=1;x<w;x++){ var c=NB.get(x,y); if (c===T) continue; if (NB.get(x-1,y)===T || (NB.get(x,y-1)===T && x<64)) NB.px(x,y,(y<46)?P.s4:P.s3); }   // Gegenlicht: heller Saum zum Fenster
  blitA(b,NB,0,0,false,1);
  for (y=30;y<48;y++) for (x=24;x<38;x++){ var d=Math.hypot((x-31)/5,(y-39)/7); if (d<1 && wm.get(x,y) && bayer(x,y)<0.3*(1-d)+0.12) mixPx(b,x,y,P.p3,2); }
  // Mala: nur ein heller Fleck über dem Sitz
  for (y=20;y<76;y++) for (x=122;x<174;x++){ var d2=Math.hypot((x-148)/20,(y-48)/(y<48?20:25)); if (d2>1) continue; var k2=Math.round(Math.pow(1-d2,1.1)*7.5+bayer(x,y)*0.9-0.3); if (k2>0) mixPx(b,x,y,P.l1,Math.min(7,k2)); }
  M.light(b,M.lf.sum(M.lf.xband(0,232,0.25,-0.55),M.lf.pool(50,34,70,40,0.5,1)));
  edgeDark(b,1.8); };


// ================================================================ 14./15. Skizzenbuch (memory): zwei aufgeschlagene Doppelseiten in Bleistift. Das Papier ist gewellt und hat Wasserränder:
//     Zlata hat das Buch nach dem Fluss auf dem Herd getrocknet.
var GR=[P.s3,P.s2,P.s1,P.m0];                                     // Graphit: zart, mittel, kräftig, ganz dunkel
function pl(b,x0,y0,x1,y1,pr){ pr=pr===undefined?2:pr; var n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)));
  for (var i=0;i<=n;i++){ var t=i/n, x=Math.round(x0+(x1-x0)*t), y=Math.round(y0+(y1-y0)*t), c=GR[pr]; if (hash(x*1.7,y*2.3)<0.14) c=GR[Math.max(0,pr-1)]; b.px(x,y,c); } }
function pp(b,pts,pr){ for (var i=0;i<pts.length-1;i++) pl(b,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],pr); }
function hatch(b,pts,sp,ang,pr){ var m=new M.Buf(b.w,b.h,0); m.poly(pts,1); var ca=Math.cos(ang), sa=Math.sin(ang);
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ if (!m.get(x,y)) continue; var u=Math.round(x*ca+y*sa); if (((u%sp)+sp)%sp===0 && hash(x,y*3)>0.08) b.px(x,y,GR[pr===undefined?0:pr]); } }
function scrawl(b,s,x,y,c){ var cx=x; for (var i=0;i<s.length;i++){ var ch=s[i]; M.text(b,ch,cx,y+((i%3===1)?1:0),c); cx+=M.textWidth(ch)+(ch===' '?2:1); } return cx; }
function ringPts(cx,cy,rx,ry,n,j,sd){ var pts=[]; for (var i=0;i<=n;i++){ var a=i/n*Math.PI*2, r=1+(hash(i%n,sd)-0.5)*j; pts.push([cx+Math.cos(a)*rx*r, cy+Math.sin(a)*ry*r]); } return pts; }
// das offene Buch auf Zlatas Tisch (Wachstuch), mit Bundsteg, Seitenkanten und Wasserrändern
function sketchbook(b,sd){ var w=b.w,h=b.h, x, y;
  fill(b,0,0,w,h,function(x,y){ var c=ra(R('k1 w0 w1'),0.45+(fbm(x,y,10,sd)-0.5)*0.3,x,y); if (((x>>3)+(y>>3))%2===0 && bayer(x,y)<0.2) c=M.UP[c]; return c; });
  function pageV(x,y){ var g=Math.abs(x-116)/102, cur=Math.pow(1-Math.min(1,g*1.6),3)*0.4; return 0.78-cur+(fbm(x,y,7,sd+4)-0.5)*0.08+Math.sin(y*0.35+x*0.02)*0.015; }
  b.poly([[13,9],[115,7],[117,8],[219,7],[220,98],[118,100],[116,101],[12,99]],P.s1);            // Seitenkanten darunter
  for (y=6;y<98;y++) for (x=14;x<219;x++){ var top=7+Math.round(Math.abs(x-116)*-0.012+(x<116?0:0)), bot=96-Math.round(Math.abs(x-116)*0.012); if (y<top||y>bot) continue; if (x===115||x===116) { b.px(x,y,P.s2); continue; }
    b.px(x,y,ra(R('s3 s4 s5 s6'),pageV(x,y),x,y)); }
  for (x=14;x<219;x++){ if (x===115||x===116) continue; b.px(x,97-Math.round(Math.abs(x-116)*0.012),P.s3); b.px(x,98-Math.round(Math.abs(x-116)*0.012),P.s2); }
  // Wasserränder: ein Fleck aus dem Fluss, getrocknet
  [[200,20,22,14,1],[30,90,26,12,2],[150,92,18,8,3]].forEach(function(s){ var pts=ringPts(s[0],s[1],s[2],s[3],40,0.35,s[4]), m=new M.Buf(w,h,0); m.poly(pts,1);
    for (y=0;y<h;y++) for (x=14;x<219;x++){ if (x===115||x===116) continue; var c=b.get(x,y); if (c!==P.s3&&c!==P.s4&&c!==P.s5&&c!==P.s6) continue; var inn=m.get(x,y), e=inn&&(!m.get(x-1,y)||!m.get(x+1,y)||!m.get(x,y-1)||!m.get(x,y+1));
      if (e) b.px(x,y,bayer(x,y)<0.7?P.e3:P.s3); else if (inn && bayer(x,y)<0.35) b.px(x,y,M.DN[c]); } }); }
// ---- Seite 1: die Treppe im Palma, „KUĆA“; die Drei; der alte Mann mit dem Teeglas
M.mem.k3_sketch1=function(b){ var i, k, x, y;
  sketchbook(b,3);
  // die Treppe im Hotel Palma, von unten gesehen, mit Geländer
  for (k=0;k<8;k++){ var sx=26+k*6, sy=66-k*5; pl(b,sx,sy,sx+6,sy,2); pl(b,sx+6,sy,sx+6,sy-5,1); }
  pl(b,24,70,76,27,2); pl(b,24,66,24,70,2); hatch(b,[[24,70],[76,27],[76,34],[30,72]],3,0.8,0);
  pl(b,25,49,74,9,2); pl(b,26,50,75,10,1); pl(b,24,66,24,47,3); pl(b,23,47,25,47,3); b.px(24,46,GR[3]);
  for (k=1;k<8;k++){ var bx=27+k*6; pl(b,bx,66-k*5,bx,50-k*5+1,1); }
  pp(b,[[76,26],[84,26],[84,12]],1); pp(b,[[80,16],[86,16]],0);                                      // oben der Treppenabsatz
  for (i=0;i<12;i++){ var hx=80+i*2; pl(b,hx,30,hx+4,26,0); }
  // „KUĆA“, mit einem kleinen Haus daneben
  scrawl(b,'KUĆA',32,78,GR[3]); pl(b,31,87,62,86,2);
  pp(b,[[68,86],[68,80],[72,76],[76,80],[76,86],[68,86]],2); pl(b,71,86,71,83,1); pl(b,73,77,73,74,1); for (i=0;i<4;i++) b.px(74+i,72-i,GR[i%2]);
  // die Straßenbahn mit der Drei
  pp(b,[[132,24],[200,24],[202,26],[202,37],[128,37],[126,34],[126,28],[132,24]],2);
  for (k=0;k<6;k++){ var wx=134+k*11; pp(b,[[wx,27],[wx+7,27],[wx+7,31],[wx,31],[wx,27]],1); }
  pl(b,128,33,201,33,1); pp(b,[[186,27],[186,36]],2); pp(b,[[192,27],[192,36]],2);
  [138,146,178,186].forEach(function(cx){ b.ellipse(cx,38,2.2,2.2,GR[2]); b.px(cx,38,P.s5); });
  pp(b,[[160,24],[164,18],[168,24]],1); pp(b,[[164,18],[160,14],[168,14],[164,18]],1); pl(b,124,13,210,12,0);   // Stromabnehmer, Fahrdraht
  pl(b,120,41,212,41,1); for (x=122;x<212;x+=6) pl(b,x,42,x+2,42,0);
  pp(b,[[127,18],[135,18],[135,24],[127,24],[127,18]],2); M.text(b,'3',129,17,GR[3]);
  // der alte Mann mit dem Teeglas (Bruno): Profil, Mütze, Schnurrbart
  pp(b,[[156,54],[166,51],[176,52],[178,56],[156,57],[152,58]],2); pl(b,152,58,164,58,1);               // Mütze mit Schirm
  pp(b,[[157,58],[155,62],[153,64],[152,66],[154,67],[153,69],[155,71],[156,74],[160,77],[166,77],[172,72],[175,64],[176,57]],2);
  pl(b,153,69,158,69,3); pl(b,154,70,157,70,2); b.px(158,62,GR[3]); pl(b,156,61,159,61,1);               // Schnurrbart, Auge, Braue
  pp(b,[[172,66],[174,68],[173,71]],1);                                                                    // Ohr
  pp(b,[[162,78],[160,84],[150,88],[146,96]],2); pp(b,[[172,76],[180,80],[194,86],[200,96]],2);          // Schultern
  for (k=0;k<4;k++) b.ellipse(178-k*1,84+k*3,0.8,0.8,GR[2]);                                               // Knöpfe der Uniform
  hatch(b,[[176,57],[175,64],[172,72],[166,77],[170,78],[178,70],[180,58]],2,-0.7,1);
  pp(b,[[146,74],[152,74],[150,78],[150,80],[153,85],[145,85],[148,80],[148,78],[146,74]],2);             // das Teeglas
  pl(b,147,79,151,79,0); pl(b,145,85,153,85,3); pp(b,[[153,80],[158,82],[162,84]],1);                     // Tee, Untertasse, die Hand
  for (i=0;i<3;i++) pp(b,[[147+i*2,72],[146+i*2,69],[148+i*2,66]],0);                                    // Dampf
  pl(b,128,58,136,60,0);
  edgeDark(b,1.4); };
// ---- Seite 2: „Dubrovnik 1991“ mit Meer und Stadtmauer; ein Junge mit großen Ohren; ein Fahrer mit Zigarette; ein Fluss mit einem Licht
M.mem.k3_sketch2=function(b){ var i, k, x, y;
  sketchbook(b,7);
  scrawl(b,'Dubrovnik 1991',22,11,GR[3]);
  // die Stadtmauer mit dem runden Turm, davor das Meer
  pp(b,[[22,40],[34,38],[34,26],[50,26],[50,36],[104,34]],2); for (x=34;x<50;x+=4) pp(b,[[x,26],[x,24],[x+2,24],[x+2,26]],2);
  for (x=54;x<104;x+=5) pp(b,[[x,35],[x,33],[x+2,33],[x+2,35]],1); pl(b,22,46,108,45,2); pl(b,34,26,34,46,2); pl(b,50,26,50,46,1);
  hatch(b,[[42,27],[50,27],[50,45],[42,45]],2,1.2,1); for (y=28;y<45;y+=4) pp(b,[[35,y],[42,y+1],[49,y]],1);   // der runde Turm, Mauerbänder
  hatch(b,[[50,37],[104,35],[104,44],[50,45]],3,0.9,0);
  for (i=0;i<9;i++){ var wx=26+i*9, wy=49+(i%3); pp(b,[[wx,wy],[wx+2,wy-1],[wx+4,wy]],1); }
  pp(b,[[90,44],[98,44],[96,46],[91,46],[90,44]],2); pl(b,94,44,94,36,2); pp(b,[[95,37],[99,43],[95,43]],1);   // ein Segelboot
  // der Junge mit den großen Ohren, wie ein Pokal; Mütze, Sommersprossen, ein Grinsen
  b.ellipse(66,74,10,11,function(x,y){ var dx=(x+0.5-66)/10, dy=(y+0.5-74)/11, d=dx*dx+dy*dy; return d>0.82?GR[2]:undefined; });
  pp(b,[[56,68],[58,62],[66,59],[74,62],[76,68]],2); pl(b,56,68,76,68,2); pl(b,57,66,75,66,1); b.px(66,58,GR[2]);   // Mütze
  pp(b,[[56,71],[50,68],[48,74],[51,80],[56,79]],2); pp(b,[[76,71],[82,68],[84,74],[81,80],[76,79]],2);         // die Ohren
  b.px(62,73,GR[3]); b.px(70,73,GR[3]); pp(b,[[61,80],[64,82],[68,82],[71,80]],2); [[60,76],[61,77],[71,76],[72,77],[63,76]].forEach(function(p){ b.px(p[0],p[1],GR[1]); });
  pp(b,[[58,85],[50,90],[46,96]],2); pp(b,[[74,85],[82,90],[86,96]],2); for (y=88;y<96;y+=3) pl(b,52,y,80,y,1);   // gestreifter Pullover
  // der Fahrer mit der Zigarette, im Profil (Vlado)
  pp(b,[[146,16],[142,18],[140,22],[139,26],[140,27],[137,30],[136,32],[138,33],[137,35],[138,37],[139,40],[143,43],[149,43],[153,39],[156,32]],2);
  hatch(b,[[146,16],[156,14],[160,22],[156,32],[152,28],[150,20]],2,0.9,2); pp(b,[[146,16],[156,14],[160,22],[156,32]],2);
  b.px(142,26,GR[3]); pl(b,140,24,144,24,1); pp(b,[[151,27],[153,29],[152,32]],1);
  pl(b,137,35,128,36,2); pl(b,137,36,128,37,1); b.px(127,36,GR[3]);                                         // die Zigarette
  pp(b,[[127,34],[125,30],[127,26],[125,22],[127,18]],0);                                                    // Rauch
  for (i=0;i<14;i++) b.px(141+Math.floor(hash(i,3)*10),37+Math.floor(hash(i,5)*6),GR[1]);                 // Bartstoppeln
  pp(b,[[149,43],[150,50],[146,56]],2); pp(b,[[156,40],[164,46],[172,56]],2); pp(b,[[124,58],[128,48],[136,44]],1);   // Hals, Schulter, das Lenkrad angedeutet
  // ein Fluss bei Nacht mit einem Licht drüben, das sich im Wasser spiegelt (nicht fertig)
  var LX2=184, LY2=69;
  hatch(b,[[126,60],[212,60],[212,73],[126,73]],2,0.6,2); hatch(b,[[126,60],[212,60],[212,72],[126,72]],2,-0.6,1);
  for (y=60;y<=76;y++) for (x=172;x<=196;x++){ var d=Math.hypot(x-LX2,(y-LY2)*1.2); if (d<4.5) b.px(x,y,d<2.2?P.s6:P.s5); else if (d<7 && bayer(x,y)<(7-d)/3) b.px(x,y,P.s4); }   // das Licht: ausgespart, ein Hof drum
  for (i=0;i<8;i++){ var a=i/8*Math.PI*2; pl(b,Math.round(LX2+Math.cos(a)*5),Math.round(LY2+Math.sin(a)*4),Math.round(LX2+Math.cos(a)*7),Math.round(LY2+Math.sin(a)*6),0); }
  pp(b,[[126,75],[140,73],[160,74],[172,73]],3); pp(b,[[196,73],[212,72]],3); pp(b,[[176,73],[177,66],[182,63],[187,63],[192,66],[193,73]],2);   // das Ufer, ein Haus
  for (k=0;k<6;k++){ var yy=78+k*3; pl(b,128+k*3,yy,178-k,yy,k%2?1:2); pl(b,190+k,yy,210-k*2,yy,k%2?0:1); }
  for (y=76;y<94;y++){ var rx=LX2+Math.round(Math.sin(y*1.3)*1.2); b.px(rx,y,P.s6); if (y<86) b.px(rx+1,y,P.s5); }                       // der Spiegel des Lichts
  pl(b,198,93,206,95,0); pl(b,202,95,208,97,0);                                                              // die Linie bricht ab
  edgeDark(b,1.4); };


// ================================================================ 16. Der Springer (ghost): ein Sommerabend in den Sechzigern, die Laternen gehen an. Ein junger Mann in Badehose,
//     Seitenscheitel, im Schwalbensprung vor dem einen hohen Bogen der Alten Brücke; tief unten die grüne Neretva.
M.mem.k3_springer=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1966), RV=88;
  // Himmel in der Dämmerung
  fill(b,0,0,w,RV,function(x,y){ return ra(R('b1 b2 d3 d4 d5 d6'),0.12+y/80+(fbm(x,y*3,30,6)-0.5)*0.12,x,y); });
  // durch den Bogen: die Schlucht flussab, Häuser mit Steindächern an den Hängen, im Dunst
  for (x=0;x<w;x++){ var hy=48+Math.round(fbm(x,2,36,3)*12); for (y=hy;y<RV;y++) b.px(x,y,ra(R('d2 d3 s2 s3'),0.5+(y-hy)/60+(fbm(x,y,6,8)-0.5)*0.3,x,y)); }
  for (i=0;i<26;i++){ var hx=30+Math.floor(rg()*170), hyy=60+Math.floor(rg()*20), hw=4+Math.floor(rg()*5); if (Math.abs(hx-116)<30 && hyy<72) continue;
    b.rect(hx,hyy,hw,3,P.s4); b.hl(hx-1,hx+hw,hyy-1,P.s2); b.px(hx+1,hyy+1,rg()<0.4?P.y4:P.s2); }
  M.fogBake(b,function(x,y){ return y<RV?0.3:0; },{col:P.d4});
  // der Fluss tief unten: grün, mit weißen Strudeln
  fill(b,0,RV,w,h-RV,function(x,y){ var f=Math.sin(x*0.2+y*1.6)+Math.sin(x*0.07-y*0.8+1), c=ra(R('a2 a3 g3 a4 a5'),0.3+(y-RV)/30+f*0.12,x,y); if (f>1.4) c=P.s5; return c; });
  // die Brücke: ein einziger hoher, schlanker Bogen von Fels zu Fels, flacher Buckel, Brüstung; im Scheitel nur eine dünne Steinlage
  var AL=24, AR=208, MX=116, SP=92, CR=27, RISE=52;
  function intr(x){ var u=Math.abs(x-MX)/SP; return CR+RISE*(1-Math.sqrt(Math.max(0,1-Math.pow(u,1.7)))); }
  function deck(x){ var u=(x-MX)/104; return 17+u*u*15; }
  for (x=0;x<w;x++){ var dt=Math.round(deck(x)), it=(x>AL && x<AR)?Math.round(intr(x)):RV; for (y=dt;y<Math.min(RV,it);y++){ var c=M.tex.ashlar(x,y,R('s2 s3 s4 s5'),8,4); if (y<dt+2) c=(y===dt)?P.s5:P.s4; if (y===dt+2) c=P.s2; b.px(x,y,c); }
    if (x>AL && x<AR){ for (y=it-4;y<it;y++){ if (y<=dt+3) continue; var seg=Math.floor(Math.atan2(it-CR,x-MX)*18), c2=((seg+y)%2)?P.s4:P.s3; if (y===it-1) c2=P.s1; if ((Math.round((x-MX)*0.35)+y)%5===0) c2=P.s2; b.px(x,y,c2); } } }   // Ring der Bogensteine
  for (x=0;x<w;x++) b.px(x,Math.round(deck(x))-1,P.s1);
  [[48,1],[116,0],[184,1]].forEach(function(l){ var lx=l[0], ly=Math.round(deck(lx))-1; b.vl(lx,ly-7,ly,P.k2); b.rect(lx-1,ly-10,3,3,P.y4); b.px(lx,ly-11,P.k2); });   // Laternen
  [74,81,87,147,153,160].forEach(function(px,k){ var py=Math.round(deck(px))-1; b.rect(px,py-6,2,6,k%2?P.k2:P.w0); b.px(px,py-7,P.k2); b.px(px+1,py-7,P.k1); });   // Zuschauer an der Brüstung
  // die Widerlager auf dem Fels, die Türme am Rand
  function rock(x,y){ return ra(R('s1 s2 s3 s4'),0.45+(fbm(x,y,5,4)-0.5)*0.6-(y-60)/120,x,y); }
  b.poly([[0,62],[AL+4,66],[AL+14,RV+2],[AL+8,h],[0,h]],rock); b.poly([[w,62],[AR-4,66],[AR-14,RV+2],[AR-8,h],[w,h]],rock);
  fill(b,0,0,14,64,function(x,y){ return M.tex.ashlar(x,y,R('s1 s2 s3 s4'),7,5); }); b.vl(13,0,63,P.s1);
  fill(b,218,0,14,64,function(x,y){ var c=M.tex.ashlar(x,y,R('s1 s2 s3 s4'),7,5); return x<222?M.UP[c]:c; }); b.vl(218,0,63,P.s5);
  // der Springer im Schwalbensprung, auf uns zu: die Arme wie Flügel schräg nach oben geöffnet, die Brust vorn, die Beine geschlossen
  var SB=new M.Buf(w,h,T), SK=[P.p2,P.p3,P.p4], J=[116,48], th=0.18, ct=Math.cos(th), st=Math.sin(th);
  function q(x,y){ return [J[0]+x*ct-y*st, J[1]+x*st+y*ct]; }
  limb(SB,q(-3,-7),q(-13,-14),1.25,[SK[1],SK[2],SK[0]],0,-1); limb(SB,q(-13,-14),q(-22,-18),1.05,[SK[1],SK[2],SK[0]],0,-1);   // Arm links
  limb(SB,q(3,-7),q(13,-14),1.25,[SK[1],SK[2],SK[0]],0,-1); limb(SB,q(13,-14),q(22,-18),1.05,[SK[1],SK[2],SK[0]],0,-1);       // Arm rechts
  SB.poly([q(-4,-8),q(4,-8),q(3.2,3),q(-3.2,3)],function(x,y){ var p=(x-J[0])*ct+(y-J[1])*st; return p<-1.5?SK[2]:(p>1.8?SK[0]:SK[1]); });   // Brust und Bauch
  SB.poly([q(-3.4,2.6),q(3.4,2.6),q(3.2,6),q(-3.2,6)],P.n0); var hb=q(-3,3); SB.px(Math.round(hb[0]),Math.round(hb[1]),P.n1);      // Badehose
  limb(SB,q(-1.6,6),q(-1.2,17),1.45,[SK[1],SK[2],SK[0]],-1,0); limb(SB,q(1.6,6),q(1.4,17),1.45,[SK[1],SK[2],SK[0]],-1,0);   // Beine, geschlossen
  var hd=q(0,-12); SB.ellipse(hd[0],hd[1],2.7,3.1,function(x,y){ return (y<hd[1]-0.8)?P.h1:SK[2]; }); SB.px(Math.round(hd[0])-1,Math.round(hd[1])-2,P.h3); SB.px(Math.round(hd[0])-2,Math.round(hd[1])-2,P.h2);   // Kopf, Seitenscheitel
  SB.px(Math.round(hd[0])-1,Math.round(hd[1]),P.k1); SB.px(Math.round(hd[0])+1,Math.round(hd[1]),P.k1);
  M.outline(SB,P.k1); blitA(b,SB,0,0,false,1);
  M.light(b,M.lf.sum(M.lf.k(-0.2),M.lf.band(0,104,0.25,-0.5),M.lf.pool(112,48,60,34,0.5,1)));
  [48,116,184].forEach(function(lx){ var ly=Math.round(deck(lx))-1; b.rect(lx-1,ly-10,3,3,P.y5); b.px(lx,ly-9,P.l1); });
  edgeDark(b,1.8); };

})(M);
