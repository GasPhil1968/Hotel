/* ===== 97_k4_mem.js — Kapitel 4 (München, Weihnachten 2011 bis Neujahr 2012): Erinnerungsbilder, je 232 × 104 Pixel =====
   Wie 97_k3_mem.js: in natürlichen Farben gemalt, mit kräftigen Helligkeitsstufen; das Spiel färbt die Bilder selbst
   (A.memory({tint:'ghost'}) kalt-blau für Nachhall und Malas Erinnerungen, {tint:'memory'} sepia für Markos Erinnerungen).
   Der Rand (10 px) wird beim Einblenden ausgedithert, deshalb liegt dort nichts Wichtiges.
   Figuren: Lana kommt aus dem Rig ('mala'). Für die Bilder aus den Neunzigern und von 1962 gibt es abgeleitete Figuren
   ('k4m_…', nur hier): Marko mit dreizehn (aus 'k3m_mali', ohne Mütze), Ruža (aus 'babica', graues Haar statt Kopftuch),
   Ana mit sechs (aus 'mia', gelbe Gummistiefel), der junge Giuseppe (aus 'sepp', dunkles Haar, schlichte Mütze), die junge
   Gerda (aus 'gerda', braunes Haar unter dem Tuch). Fehlt eine Vorlage, malt das Bild einen schlichten Umriss.
   Von Hand: die Frau im Bus (verlorenes Profil) mit Kind, der Beamte, die Menschen der Schlange, die Kanister.
   Feinfühlig: k4_april zeigt den Moment davor — eine Schlange vor einer Mauer im Frühling, keine Verletzten, kein Blut,
   keine Waffen. Keine religiösen oder nationalen Zeichen (das Formular von 1993 trägt nur einen roten Kopfstreifen). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R, S=M.poseS, F=M.poseF;
M.mem=M.mem||{};
// Empfohlene Färbung je Bild (die Skripte geben sie beim Aufruf selbst an)
M.K4_MEM_TINT=M.K4_MEM_TINT||{ k4_bus:'memory', k4_stiefel:'ghost', k4_kiste:'ghost', k4_kurve:'ghost', k4_bunker:'ghost', k4_april:'memory', k4_depot:'ghost', k4_home:'memory' };

// ---------------------------------------------------------------- kleine Helfer (wie in 97_k3_mem.js)
function fill(b,x0,y0,w,h,fn){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c=fn(x,y); if (c!==undefined) b.px(x,y,c); } }
function fig(b,x,y,pose,face,id,opt){ if (!id || !M.CHARS[id]) return false; try{ M.drawPose(b,x,y,pose,face,id,opt||{}); return true; }catch(e){ console.error(e); return false; } }
function edgeDark(b,amt){ M.light(b,M.lf.vignette(b.w,b.h,amt||2.4)); }
function cl(v,a,z){ return v<a?a:(v>z?z:v); }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function rnd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), c=hash(gx+1+o,gy), d=hash(gx+o,gy+1), e=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(c-a)*ux+(d-a)*uy+(a-c-d+e)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function mixPx(b,x,y,col,k){ var c=b.get(x,y); if (c===T||k<=0) return; b.px(x,y,M.mix(c,col,Math.min(8,k))); }
// Kopf von Hand (verlorenes Profil, von hinten), wie in 97_k3_mem.js
function headB(b,cx,cy,rx,ry,dir,o){ var K=o.skin, Hc=o.hair, x, y;
  for (y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++) for (x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++){ var u=(x+0.5-cx)/rx*dir, v=(y+0.5-cy)/ry; if (u*u+v*v>1) continue;
    var cheek=(u>0.62 && v>-0.15 && v<0.78 && u*u+v*v>0.5), c, lit=cl((u+1)/2*0.8+(v+1)/2*0.3+(o.lift||0),0,1);
    if (cheek) c=K[cl(Math.floor(lit*K.length),0,K.length-1)];
    else { c=Hc[cl(Math.floor(lit*Hc.length*0.85),0,Hc.length-1)]; var sw=Math.sin((u*3.1+v*1.6)*3.2); if (sw>0.82 && v<0.4) c=M.UP[c]; }
    b.px(x,y,c); }
  var ex=rnd(cx+dir*rx*0.62), ey=rnd(cy+ry*0.12); b.px(ex,ey,K[1]); b.px(ex,ey+1,K[0]); b.px(ex+dir,ey,K[2]); }
// Glied als Kapsel mit drei Tönen (Mitte, Licht, Schatten)
function limb(b,a,c,r,col){ var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx>0){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=cl((px*vx+py*vy)/L2,0,1), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=(qx*nx+qy*ny)/r, k=s>0.4?1:(s<-0.4?2:0); b.px(x,y,col[k]); } } }

// ---------------------------------------------------------------- abgeleitete Figuren (nur für diese Bilder; erst beim Malen angelegt)
function derive(id,baseId,mod){ if (M.CHARS[id]) return id; var base=M.CHARS[baseId]; if (!base) return null;
  try{ var d=Object.assign({},base); d.legend=Object.assign({},base.legend); d.cols=Object.assign({},base.cols); d.anims={}; mod(d); M.defineChar(id,d); return id; }catch(e){ console.error(e); return null; } }
function cMali(){ return derive('k4m_mali','k3m_mali',function(d){ d.legend.r=P.h2; d.legend.R=P.h3; d.legend.w=P.h1; d.torso=Object.assign({},d.torso,{col:[P.c2,P.c3,P.c1],stripe:P.c1}); d.cols.sleeve=[P.c2,P.c3,P.c1]; d.cols.sleeveF=[P.c1,P.c2,P.c0]; }); }
function cRuza(){ return derive('k4m_ruza','babica',function(d){ d.legend.c=P.s3; d.legend.C=P.s4; d.post=null; d.torso=Object.assign({},d.torso,{col:[P.m2,P.m3,P.m1]}); d.cols.sleeve=[P.m2,P.m3,P.m1]; d.cols.sleeveF=[P.m1,P.m2,P.m0]; }); }
function cAna(){ return derive('k4m_ana6','mia',function(d){ d.cols.shoe=P.y4; d.cols.shoeTop=P.y5; }); }
function cPeppino(){ return derive('k4m_peppino','sepp',function(d){ ['w','W','h','b'].forEach(function(k){ if (d.legend[k]!==undefined) d.legend[k]=({w:P.h2,W:P.h3,h:P.h1,b:P.s5})[k]; }); d.legend.y=P.n1; d.legend.Y=P.n2;
  d.torso=Object.assign({},d.torso,{buttons:P.k2,col:[P.e1,P.e2,P.e0]}); d.cols.sleeve=[P.e1,P.e2,P.e0]; d.cols.sleeveF=[P.e0,P.e1,P.k1]; d.post=null; }); }
function cGerda(){ return derive('k4m_gerdaY','gerda',function(d){ d.legend.w=P.h2; d.legend.W=P.h3; d.post=null; }); }
function charInfo(id){ var c=M.CHARS[id]; return c?{hipY:c.hipY||23,tLen:c.tLen||13}:{hipY:23,tLen:13}; }

// Mensch von Hand (klein, für Schlangen und Hintergründe): Füße bei (x,y), Höhe h, Blick dir (1 rechts, -1 links)
function person(b,x,y,h,o){ var dir=o.dir||1, k=h/40, coat=o.coat||[P.c1,P.c2,P.c0], trou=o.trou||[P.m1,P.m2,P.m0], skin=o.skin||[P.p3,P.p4,P.p2], hair=o.hair||P.h2;
  var hip=y-rnd(18*k), sh=y-rnd(31*k), hd=y-rnd(36*k), hw=Math.max(2,rnd(4*k)), cw=Math.max(3,rnd(5.5*k));
  limb(b,[x-1,hip],[x-1-dir*(o.step||1),y-1],Math.max(1,1.5*k),trou); limb(b,[x+1,hip],[x+1+dir*(o.step||1),y-1],Math.max(1,1.5*k),trou);   // Beine
  b.hl(x-2-dir,x,y,P.k2); b.hl(x+1,x+3+dir,y,P.k2);                                                                                   // Schuhe
  b.poly([[x-cw+1,sh],[x+cw-1,sh],[x+cw+(o.long?1:0),hip+(o.long?rnd(8*k):2)],[x-cw-(o.long?1:0),hip+(o.long?rnd(8*k):2)]],function(xx,yy){ return (xx-x)*dir>cw*0.4?coat[2]:((xx-x)*dir<-cw*0.4?coat[1]:coat[0]); });
  b.ellipse(x+0.5,sh+0.5,cw-0.5,1.6,coat[0]);
  b.ellipse(x+dir*0.5+0.5,hd+0.5,hw,hw+0.6,skin[0]); b.px(x+dir*rnd(hw*0.8),hd,skin[1]);
  if (o.hat) b.ellipse(x+0.5,hd-hw*0.6,hw+1,hw*0.6,o.hat); else b.ellipse(x-dir*0.6+0.5,hd-0.8,hw,hw*0.75,hair);
  if (o.scarf) b.hl(x-cw+2,x+cw-2,sh+1,o.scarf);
  var hy=hip-rnd(2*k); limb(b,[x+dir*(cw-1),sh+1],[x+dir*(cw-1+(o.reach||0)),hy],Math.max(1,1.1*k),coat);                          // naher Arm
  return [x+dir*(cw-1+(o.reach||0)),hy]; }
// Kanister (Plastik, mit Griff oben und Ausguss), Füße bei (x,y)
function canister(b,x,y,w,h,col,o){ o=o||{}; var x0=x-(w>>1), y0=y-h, i, j;
  for (j=0;j<h;j++) for (i=0;i<w;i++){ var u=i/(w-1), c=col[1]; if (u<0.18) c=col[2]; else if (u>0.8) c=col[0]; if (j===0) c=col[2]; if ((j%Math.max(4,rnd(h/4)))===0 && j>2 && u>0.1 && u<0.9) c=M.DN[c]; b.px(x0+i,y0+j,c); }
  var gw=Math.max(3,rnd(w*0.45)); for (i=0;i<gw;i++){ b.px(x0+2+i,y0-2,col[1]); } b.px(x0+2,y0-1,col[1]); b.px(x0+1+gw,y0-1,col[1]); b.hl(x0+3,x0+gw,y0-1,P.k1);   // Griff
  b.rect(x0+w-3,y0-3,2,3,o.cap||P.r2); b.hl(x0,x0+w-1,y,P.k1); }

// ================================================================ 1. Im Nachtbus nach München (memory): Schnee ab Salzburg, Mala kniet am Fenster und zählt die Lichter
M.mem.k4_bus=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2412), WX0=26, WX1=206, WY0=6, WY1=60, RC=7;
  b.rect(0,0,w,h,P.k1);
  function inPane(x,y){ if (x<WX0||x>WX1||y<WY0||y>WY1) return false; var cx=cl(x,WX0+RC,WX1-RC), cy=cl(y,WY0+RC,WY1-RC); return (x-cx)*(x-cx)+(y-cy)*(y-cy)<=RC*RC+1; }
  // draußen: Nacht, verschneite Berge, ein Dorf mit Lichtern, die Gegenfahrbahn, Leitplanke mit Rückstrahlern, Laternen
  var o=new M.Buf(w,h,P.k0);
  fill(o,0,0,w,62,function(x,y){ return ra(R('k0 k1 k1 n0 n0'),0.15+y/70+(fbm(x*0.5,y*1.6,20,3)-0.5)*0.35,x,y); });
  var mt=function(x){ return rnd(16+10*Math.sin(x*0.022+0.8)+(fbm(x,0,9,4)-0.5)*9+(x>120&&x<190?-6*Math.sin((x-120)/70*Math.PI):0)); };
  for (x=0;x<w;x++) for (y=mt(x);y<44;y++){ var d=(y-mt(x))/30, f=fbm(x*1.2,y,6,8); var c=ra(R('n1 n2 n3 n3 n4'),0.75-d*0.6+(f-0.5)*0.4,x,y); if (fbm(x*0.6,y*1.5,7,13)>0.6 && d>0.15) c=ra(R('k1 n0 n1'),0.5,x,y); o.px(x,y,c); }   // Schneeberge mit Waldstreifen
  for (y=44;y<62;y++) for (x=0;x<w;x++) o.px(x,y,ra(R('k1 n0 n1 n2'),0.3+(y-44)/30+(fbm(x*0.3,y*2,8,5)-0.5)*0.3,x,y));                 // Talboden, verschneit
  for (i=0;i<22;i++){ var vx=118+Math.floor(rg()*56), vy=41+Math.floor(rg()*5); o.px(vx,vy,rg()<0.6?P.y4:P.y3); if (rg()<0.3) o.px(vx+1,vy,P.y2); LIT.push([vx,vy]); }   // ein Dorf
  for (x=0;x<w;x++){ o.px(x,52,P.m1); o.px(x,53,P.m2); if (x%13===0){ o.px(x,51,P.y3); o.px(x,52,P.y4); } }                          // Leitplanke mit Rückstrahlern
  for (i=0;i<9;i++){ var lx=12+i*24+Math.floor(rg()*6), ly=30+Math.floor(i*0.6); for (y=ly;y<52;y++) o.px(lx,y,P.k1); o.hl(lx-2,lx+1,ly,P.k1); o.px(lx-2,ly+1,P.y5); o.px(lx-1,ly+1,P.y4);   // Laternen, lang gezogenes Licht
    for (var k=1;k<10;k++) if (bayer(lx-2-k,ly+1)<0.7-k*0.07) o.px(lx-2-k,ly+1,k<4?P.y4:P.y2); }
  [[40,47],[150,48]].forEach(function(c){ for (var k=0;k<22;k++){ if (bayer(c[0]+k,c[1])<0.8-k*0.035) o.px(c[0]+k,c[1],k<3?P.l1:P.s5); } o.px(c[0]-2,c[1],P.l1); o.px(c[0]-4,c[1],P.l1); });   // Gegenverkehr, Scheinwerfer verwischt
  for (i=0;i<6;i++){ var tx=60+i*26, ty=55; for (var k2=0;k2<8;k2++) if (bayer(tx+k2,ty)<0.6-k2*0.06) o.px(tx+k2,ty,P.r3); }      // Rücklichter weiter vorn, als Striche
  // Schneetreiben im Licht des Busses: schräge Striche, nah lang
  for (i=0;i<180;i++){ var sx=rg()*w, sy=rg()*62, L=rg()<0.25?6+rg()*7:2+rg()*3; for (var s=0;s<L;s++){ var px=rnd(sx-s*1.6), py=rnd(sy+s*0.7); if (px<0||py<0||py>61) continue; var c2=o.get(px,py); o.px(px,py,L>5?P.s5:M.UP[M.UP[c2]]); } }
  for (y=0;y<h;y++) for (x=0;x<w;x++) if (inPane(x,y)) b.px(x,y,o.get(x,y));
  // Spiegelung des Busses auf der Scheibe: die Leselampen als blasse Punkte, ein Streifen der Gepäckablage
  for (x=WX0+4;x<WX1-4;x++){ if (bayer(x,9)<0.25) mixPx(b,x,9,P.n3,3); } [70,130,190].forEach(function(lx){ mixPx(b,lx,12,P.y3,5); mixPx(b,lx+1,12,P.y3,4); });
  // Rahmen, Wand unter dem Fenster, Vorhang am Pfosten links
  for (y=0;y<70;y++) for (x=0;x<w;x++){ if (inPane(x,y)) continue; var e=Math.max(WX0-x,x-WX1,WY0-y,y-WY1), near=(x>=WX0-3&&x<=WX1+3&&y>=WY0-3&&y<=WY1+3);
    b.px(x,y,near&&e<=1?P.k2:(near&&e<=3?P.m1:ra(R('k1 k2 n0 m0'),0.4+(fbm(x,y,20,5)-0.5)*0.4,x,y))); }
  for (y=0;y<66;y++){ var cw=10+Math.round(Math.sin(y*0.09)*1.2)+(y>34&&y<40?-3:0); for (x=0;x<cw;x++){ var fx=WX0-4+x-Math.round(cw/2), fold=Math.sin((x+y*0.1)*1.3), cc=fold>0.5?P.c3:(fold<-0.4?P.c1:P.c2); if (x===0||x===cw-1) cc=P.c1; b.px(fx,y,cc); } }
  b.rect(0,60,w,10,P.m1); b.hl(0,w-1,60,P.m3); b.hl(0,w-1,61,P.m2); b.hl(0,w-1,69,P.k1); b.rect(150,63,14,3,P.m2); b.hl(150,163,63,P.m3);
  // Sitzpolster (dunkelblau mit Rautenmuster), Mala kniet darauf, von hinten, eine Hand an der Scheibe
  var SEAT=function(x,y){ var c=ra(R('k2 n0 n1 c1 c2'),0.6-(y-70)/60+(hash(x>>1,y>>1)-0.5)*0.06,x,y), d1=((x+y*2)%10+10)%10, d2=((x-y*2)%10+10)%10; if (d1===0||d2===0) c=M.UP[c]; if (d1===0&&d2===0) c=P.r2; return c; };
  b.poly([[70,70],[200,70],[214,104],[58,104]],SEAT); b.hl(70,199,70,P.c3); b.hl(71,198,71,P.c2);
  var mx=128, my=86;
  if (!fig(b,mx,my,F({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-6,-31],rh:[6,-15],sit:1},'B'),'R','mala')){ b.ellipse(mx,my-40,5,6,P.h1); b.rect(mx-6,my-33,13,20,P.s5); }
  // ihre Hand an der Scheibe: ein heller Abdruck, Atem am Glas
  for (y=my-48;y<my-38;y++) for (x=mx-12;x<mx+2;x++){ var dd=Math.hypot((x-(mx-5))/7,(y-(my-42))/5); if (inPane(x,y) && dd<1 && bayer(x,y)<(1-dd)*0.5) mixPx(b,x,y,P.s5,3); }
  // Licht: draußen kalt, innen dunkel; ein Streifen Laternenlicht wandert über Mala
  M.light(b,function(x,y){ if (inPane(x,y)) return 0.1; var v=-1.0+Math.max(0,1-Math.hypot((x-130)/70,(y-70)/30))*1.1; if (x>110&&x<150&&y>30) v+=0.5*(1-Math.abs(x-130)/20); return v; });
  edgeDark(b,1.8); };
var LIT=[];

// ================================================================ 2. Die gelben Stiefel (ghost): 1990, Haltestelle der Drei im Regen. Ana mit sechs weint; Lana sitzt auf der Bank und malt ihr eine Straßenbahn
M.mem.k4_stiefel=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1990), G=80;
  // Häuser gegenüber: Fassaden aus der k.u.k.-Zeit, Fenster, Gesimse; tief hängender Regenhimmel
  fill(b,0,0,w,24,function(x,y){ return ra(R('m2 m3 s3 m3'),0.3+y/30+(fbm(x,y*2,18,2)-0.5)*0.3,x,y); });
  var fac=[[0,40,'s3'],[40,92,'t3'],[92,140,'s2'],[140,190,'e3'],[190,232,'s3']];
  fac.forEach(function(f,k){ var top=8+((k*7)%3)*4; for (y=top;y<G-14;y++) for (x=f[0];x<f[1];x++){ var c=ra(R(f[2]==='t3'?'t2 t3 t4':(f[2]==='e3'?'e2 e3 e4':'s2 s3 s4')),0.5+(fbm(x,y,6,k)-0.5)*0.3,x,y); if (y===top||y===top+1) c=P.s4; if ((y-top)%16===0) c=M.DN[c]; b.px(x,y,c); }
    for (var r=0;r<3;r++) for (x=f[0]+5;x<f[1]-6;x+=11){ var wy=top+5+r*16; b.rect(x,wy,6,9,P.k2); b.rect(x+1,wy+1,4,7,(hash(x,r+k)<0.3)?P.y3:P.n1); b.vl(x+3,wy+1,wy+7,P.s4); b.hl(x-1,x+6,wy+9,P.s4); } });
  // Gehweg gegenüber, Straße mit Schienen der Drei, nass, Pfützen; diesseits der Gehsteig mit der Haltestelle
  fill(b,0,G-14,w,6,function(x,y){ return ra(R('m2 m3 s3'),0.5+(hash(x>>2,y)-0.5)*0.4,x,y); }); b.hl(0,w-1,G-14,P.s4);
  fill(b,0,G-8,w,10,function(x,y){ var c=ra(R('k2 m0 m1 m2'),0.45+(fbm(x*0.4,y*2,6,3)-0.5)*0.5,x,y); var refl=hash(x>>2,3)<0.4?1:0; if (refl && bayer(x,y)<0.3) c=P.m3; return c; });
  b.hl(0,w-1,G-5,P.m4); b.hl(0,w-1,G-4,P.k1); b.hl(0,w-1,G-1,P.m4); b.hl(0,w-1,G,P.k1);                                    // die Schienen
  fill(b,0,G+2,w,h-G-2,function(x,y){ var c=M.tex.paving(x,y,R('m1 m2 m3 s3'),9); if (fbm(x*0.5,y*1.5,9,6)>0.64) c=(bayer(x,y)<0.6)?P.m3:P.s3; return c; });   // Gehsteig, nass
  b.hl(0,w-1,G+2,P.s4); b.hl(0,w-1,G+3,P.m1);
  // die Drei kommt, klein, links in der Ferne (rot-weiß, Scheinwerfer im Regen)
  var TX=22, TY=G-4; b.rect(TX,TY-15,30,13,P.r2); b.rect(TX,TY-11,30,4,P.s5); for (x=TX+2;x<TX+29;x+=6) b.rect(x,TY-10,4,2,P.n2); b.hl(TX,TX+29,TY-15,P.r3); b.rect(TX+29,TY-14,2,11,P.r1);
  b.line(TX+14,TY-15,TX+19,TY-21,P.k1); b.hl(TX+16,TX+22,TY-21,P.k1); b.rect(TX+27,TY-14,3,3,P.k1); M.microText(b,'3',TX+27,TY-14,P.y4);
  b.px(TX+31,TY-5,P.l1); for (i=1;i<8;i++) if (bayer(TX+31+i,TY-5)<0.7-i*0.08) b.px(TX+31+i,TY-5,P.s6);
  // das Wartehäuschen: Stahlrahmen, Dach, Rückwand aus Glas, Bank; das Haltestellenschild mit der Drei
  var SX0=100, SX1=196, ST=40, SB=G+16;
  b.rect(SX0-2,ST-4,SX1-SX0+4,4,P.m1); b.hl(SX0-2,SX1+1,ST-4,P.m3); b.hl(SX0-2,SX1+1,ST-1,P.k1);
  for (y=ST;y<SB-8;y++) for (x=SX0;x<SX1;x++){ var gl=b.get(x,y); if (bayer(x,y)<0.4) b.px(x,y,M.UP[gl]); }
  [SX0,SX0+48,SX1-1].forEach(function(px){ b.vl(px,ST,SB,P.m1); b.vl(px+1,ST,SB,P.k2); });
  b.rect(SX0+8,SB-12,70,3,P.w3); b.hl(SX0+8,SX0+77,SB-12,P.w4); b.vl(SX0+12,SB-9,SB,P.m1); b.vl(SX0+72,SB-9,SB,P.m1);    // Bank
  var PX=210; b.vl(PX,G-10,SB,P.m2); b.vl(PX+1,G-10,SB,P.m1); b.ellipse(PX+0.5,G-16,6,6,P.y4); b.ellipse(PX+0.5,G-16,4.6,4.6,P.s6); M.microText(b,'3',PX-1,G-18,P.k1);
  // Lana auf der Bank, zu Ana gebeugt, den Block auf dem Knie; Ana steht vor ihr und weint, die Fäuste an den Augen
  var LX=140, LY=SB;
  if (!fig(b,LX,LY,S({h:[0,-13],ln:2,nf:[9,0,'f'],ff:[7,0,'f'],nh:[11,-17],fh:[8,-16],sit:1,ho:[1,1]}),'R','mala',{scale:0.94})){ b.ellipse(LX,LY-40,4,5,P.h1); b.rect(LX-4,LY-33,9,18,P.r3); }
  b.rect(LX+7,LY-21,9,6,P.s6); b.hl(LX+7,LX+15,LY-15,P.s4); b.rect(LX+9,LY-19,5,2,P.r3); b.hl(LX+9,LX+13,LY-17,P.s3); b.px(LX+10,LY-16,P.k1); b.px(LX+13,LY-16,P.k1); b.line(LX+15,LY-17,LX+17,LY-21,P.y3);   // Block mit Straßenbahn, Bleistift
  var aid=cAna(), AX=164, AY=SB+1, ai=charInfo(aid||'mala'), fy=-(ai.hipY+ai.tLen)-1;
  if (!fig(b,AX,AY,S({nh:[-2,fy],fh:[-1,fy+1],hd:'b',ho:[-1,1]}),'L',aid)){ fig(b,AX,AY,S({nh:[-2,-30],fh:[-1,-29],hd:'b'}),'L','mala',{scale:0.64}); }
  for (y=AY-6;y<=AY;y++){ b.hl(AX-3,AX-1,y,y<AY-4?P.y5:P.y4); b.hl(AX+1,AX+3,y,y<AY-4?P.y4:P.y3); }                                        // gelbe Gummistiefel
  b.px(AX-3,AY-14,P.x5); b.px(AX-4,AY-12,P.x4);                                                                                          // eine Träne
  // Regen und Kreise in den Pfützen
  for (i=0;i<220;i++){ var rx=rg()*w, ry=rg()*h, L=3+rg()*4; for (var k=0;k<L;k++){ var px=rnd(rx+k*0.25), py=rnd(ry+k); if (py>=h) break; var c3=b.get(px,py); if (bayer(px,py)<0.45) b.px(px,py,M.UP[c3]); } }
  for (i=0;i<9;i++){ var cx=10+rg()*212, cy=G+6+rg()*20; b.ellipse(cx,cy,2.5,0.9,function(xx,yy){ return bayer(xx,yy)<0.5?M.UP[b.get(xx,yy)]:undefined; }); }
  M.light(b,M.lf.sum(M.lf.k(-0.15),M.lf.pool(150,80,70,40,0.5,1),M.lf.band(0,24,0.2,0)));
  edgeDark(b,1.9); };

// ================================================================ 3. Die Kiste (ghost, Nachhall): Mai 1993. Ruža schreibt am Küchentisch die Nachricht, der Junge steht daneben
M.mem.k4_kiste=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1993), FL=94;
  // Wand gekalkt, Sockel, Dielen
  fill(b,0,0,w,FL,function(x,y){ if (y>FL-8) return ra(R('w1 w2'),0.5,x,y); return ra(R('s2 s3 s4 s5'),0.66-y/FL*0.2+(fbm(x,y,12,3)-0.5)*0.12,x,y); });
  b.hl(0,w-1,FL-8,P.w3); fill(b,0,FL,w,h-FL,function(x,y){ return M.tex.boards(x,y,R('w0 w1 w2 w3'),3); }); b.hl(0,w-1,FL,P.w0);
  // Fenster mit Plastikfolie statt Glas, mit Latten angenagelt: milchiges Licht
  var WX0=26, WX1=74, WY0=14, WY1=56; b.rect(WX0-4,WY0-4,WX1-WX0+8,WY1-WY0+8,P.w2);
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ var f=Math.sin((x-WX0)*0.6+Math.sin(y*0.2)*2)+fbm(x,y,6,9)*1.4; return ra(R('s3 s4 s5 s6'),0.45+f*0.18+(1-(y-WY0)/(WY1-WY0))*0.15,x,y); });
  [WY0+1,WY1-2].forEach(function(ly){ b.rect(WX0-2,ly-1,WX1-WX0+4,3,P.w1); b.hl(WX0-2,WX1+1,ly-1,P.w3); }); b.rect(WX0-2,WY0,3,WY1-WY0,P.w1); b.rect(WX1-1,WY0,3,WY1-WY0,P.w1);
  for (i=0;i<6;i++) b.px(WX0+4+i*8,WY0+1,P.m3); b.rect(WX0-6,WY1+3,WX1-WX0+12,3,P.w3); b.hl(WX0-6,WX1+5,WY1+3,P.w4);
  // Kalender „MAJ 1993“, das Regal mit Gläsern, der Kohleherd rechts mit Ofenrohr
  b.rect(96,22,16,20,P.s6); b.rect(96,22,16,6,P.r2); M.microText(b,'MAJ',98,23,P.s6); for (y=30;y<40;y+=2) for (x=98;x<111;x+=3) b.px(x,y,P.s2); M.microText(b,'1993',97,36,P.k2); b.px(104,20,P.k2);
  b.rect(124,30,40,2,P.w3); for (i=0;i<5;i++){ b.rect(127+i*7,24,5,6,i%2?P.e3:P.s4); b.hl(127+i*7,131+i*7,24,P.m3); }
  var HX0=184, HX1=214, HY=66; b.rect(HX0,HY,HX1-HX0,FL-HY-3,P.k2); b.hl(HX0-1,HX1,HY,P.m4); b.hl(HX0-1,HX1,HY+1,P.m3); b.rect(HX0+3,HY+5,10,7,P.k1); b.rect(HX0+4,HY+6,8,5,P.t2); fill(b,HX0+5,HY+7,6,3,function(x,y){ return (x+y)%2?P.t4:P.y3; });
  b.rect(HX0+16,HY+4,12,12,P.k1); b.hl(HX0+16,HX0+27,HY+4,P.m3); b.rect(HX0+4,28,4,HY-28,P.k2); b.vl(HX0+4,28,HY-1,P.m1); b.rect(HX0+3,FL-3,3,3,P.k2); b.rect(HX1-5,FL-3,3,3,P.k2);
  b.rect(HX0+6,HY-6,9,6,P.m2); b.hl(HX0+5,HX0+15,HY-6,P.m4);                                                              // Topf auf der Platte
  // ein Wasserkanister an der Wand, daneben ein Eimer
  canister(b,168,FL,10,14,[P.b0,P.b1,P.b2]); b.rect(152,FL-9,9,9,P.m2); b.hl(151,161,FL-9,P.m4); b.line(152,FL-9,156,FL-15,P.m1); b.line(160,FL-9,156,FL-15,P.m1);
  // Ruža am Tisch, schreibt; der Junge steht rechts daneben, eine Hand auf der Tischkante
  var rz=cRuza(), RX=86, mi=cMali(), MX=134;
  b.rect(RX-8,FL-34,2,20,P.w2); b.rect(RX-8,FL-15,12,2,P.w3); b.vl(RX-7,FL-13,FL-1,P.w1); b.vl(RX+2,FL-13,FL-1,P.w1);       // Stuhl
  if (!fig(b,RX,FL,S({h:[0,-15],ln:2,nf:[9,0,'f'],ff:[7,0,'f'],sit:1,nh:[13,-24],fh:[11,-23],ho:[1,1]}),'R',rz)){ b.ellipse(RX,FL-38,4,5,P.s3); b.rect(RX-4,FL-32,9,17,P.m2); }
  if (!fig(b,MX,FL+1,S({nh:[-6,-21],fh:[-3,-20],ho:[-1,1]}),'L',mi)){ b.ellipse(MX,FL-40,4,5,P.h2); b.rect(MX-4,FL-34,8,18,P.c2); }
  var TX0=92, TX1=128, TY=FL-24;                                                                                             // Tisch mit Wachstuch
  b.rect(TX0+2,TY+2,3,FL-TY-2,P.w1); b.rect(TX1-5,TY+2,3,FL-TY-2,P.w1); b.rect(TX0,TY,TX1-TX0,2,P.w3);
  fill(b,TX0-1,TY-1,TX1-TX0+2,6,function(x,y){ var u=x-TX0, v=y-TY+1; if (v>=4 && ((u+40)%5)>2) return undefined; return ((u>>1)+(v>>1))%2?P.s5:P.b3; });
  var FX=104, FY=TY-3; b.poly([[FX,FY],[FX+12,FY-1],[FX+13,FY+2],[FX+1,FY+3]],P.s6); b.hl(FX+1,FX+11,FY,P.r3); for (i=0;i<2;i++) b.hl(FX+2,FX+9-i*2,FY+1+i,P.s2);   // das Formular mit rotem Kopfstreifen
  b.line(FX+9,FY,FX+12,FY-4,P.k1);                                                                                           // ihr Stift
  b.rect(TX1-9,TY-4,4,4,P.s5); b.hl(TX1-9,TX1-6,TY-4,P.w1);                                                                 // eine Tasse
  // Licht: milchig vom Fenster, warm von der Herdglut
  M.light(b,M.lf.sum(M.lf.k(-0.85),M.lf.pool(50,40,80,64,1.3,0.9),M.lf.pool(HX0+8,HY+8,32,24,1.4,0.9),M.lf.pool(108,70,34,28,1.1,0.8)));
  // Nachhall: blasse Schriftzüge in der Luft über dem Formular — „poginuo“ durchgestrichen, „nije se vratio“
  M.microText(b,'POGINUO',94,40,P.s6); b.hl(93,121,42,P.r4); M.microText(b,'NIJE SE VRATIO',84,48,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 4. Die Kurve (ghost, Nachhall): Mai 1992. Im Bus: eine Frau mit Kind auf dem Schoß sieht zurück; draußen ein Mann mit erhobener Hand, die Straße biegt ab
M.mem.k4_kurve=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1992), WX0=14, WX1=168, WY0=8, WY1=66;
  function inPane(x,y){ return x>=WX0&&x<=WX1&&y>=WY0&&y<=WY1 && !(x<WX0+5&&y<WY0+5&&Math.hypot(x-WX0-5,y-WY0-5)>5) && !(x>WX1-5&&y<WY0+5&&Math.hypot(x-WX1+5,y-WY0-5)>5); }
  var o=new M.Buf(w,h,P.k0);
  fill(o,0,0,w,40,function(x,y){ return ra(R('b3 b4 b5 s6'),0.2+y/44+(fbm(x,y*2,20,1)-0.5)*0.2,x,y); });
  var hl=function(x){ return rnd(22+8*Math.sin(x*0.03+1)+(fbm(x,0,10,4)-0.5)*8); };
  for (x=0;x<w;x++) for (y=hl(x);y<46;y++) o.px(x,y,ra(R('g1 g2 g3 e3'),0.4+(y-hl(x))/40+(fbm(x,y,5,6)-0.5)*0.4,x,y));       // Hügel
  for (i=0;i<10;i++){ var hx=6+Math.floor(rg()*150), hy=hl(hx)+4+Math.floor(rg()*10); o.rect(hx,hy,6,4,P.s4); o.hl(hx-1,hx+6,hy-1,P.t3); o.px(hx+2,hy+1,P.k2); }   // Häuser am Hang
  fill(o,0,46,w,h-46,function(x,y){ return ra(R('e2 e3 g2 g3'),0.4+(fbm(x*0.5,y,7,3)-0.5)*0.6,x,y); });                    // Wiese
  // die Straße: kommt von rechts unten (hinter dem Bus) und biegt links hinter dem Hang ab
  for (y=44;y<h;y++){ var t=(y-44)/(h-44), cx=lerp(30,120,Math.pow(t,0.8))+Math.sin(t*3)*6, hw=1+t*26; for (x=Math.floor(cx-hw);x<=cx+hw;x++){ var c=ra(R('m2 m3 s3'),0.5+(hash(x>>1,y)-0.5)*0.3,x,y); if (Math.abs(x-cx)<0.7 && (y%6)<3) c=P.s5; o.px(x,y,c); } }
  // der Mann am Straßenrand, die Hand erhoben
  var ZX=96, ZY=56; person(o,ZX,ZY,16,{dir:-1,coat:[P.e1,P.e2,P.e0],trou:[P.m1,P.m2,P.m0],hair:P.h1,step:0}); limb(o,[ZX-2,ZY-12],[ZX-4,ZY-19],0.8,[P.e2,P.e3,P.e1]); o.px(ZX-4,ZY-20,P.p3);
  for (y=0;y<h;y++) for (x=0;x<w;x++) if (inPane(x,y)) b.px(x,y,o.get(x,y));
  // Staub und Spiegelung auf dem Glas
  for (y=WY0;y<=WY1;y++) for (x=WX0;x<=WX1;x++){ if (!inPane(x,y)) continue; var s=(x-WX0)+(y-WY0)*0.8; if ((s>40&&s<44)||(s>96&&s<99)) mixPx(b,x,y,P.s6,3); if (hash(x,y)<0.012) mixPx(b,x,y,P.e4,4); }
  // Rahmen, Sitzlehne vorn rechts, die Frau (verlorenes Profil, sieht zurück nach links), das Kind auf ihrem Schoß an ihrer Schulter
  for (y=0;y<h;y++) for (x=0;x<w;x++){ if (inPane(x,y)) continue; var e=Math.max(WX0-x,x-WX1,WY0-y,y-WY1), near=(x>=WX0-3&&x<=WX1+3&&y>=WY0-3&&y<=WY1+3);
    b.px(x,y,near&&e<=1?P.k2:(near&&e<=3?P.m2:ra(R('k1 k2 m0 m1'),0.45+(fbm(x,y,18,7)-0.5)*0.4,x,y))); }
  b.rect(0,WY1+4,w,6,P.m1); b.hl(0,w-1,WY1+4,P.m3);
  // Lehne (Kunstleder, dunkelrot), oben ein weißer Schonbezug
  b.poly([[150,40],[170,34],[200,32],[232,34],[232,104],[148,104]],function(x,y){ return ra(R('k2 r0 r1 r2'),0.5+(x-150)/120+(hash(x>>2,y>>2)-0.5)*0.1-(y-34)/200,x,y); });
  b.poly([[156,38],[176,33],[206,31],[214,40],[180,44],[158,46]],function(x,y){ var f=Math.sin(x*0.7+y*0.3); return ra(R('s3 s4 s5 s6'),0.7+(f>0.6?0.15:0)-(y-31)/50,x,y); });
  // die Frau: dunkles Haar, kurz, ein Mantel; Kopf zum Fenster gedreht
  b.poly([[96,104],[100,78],[112,70],[140,68],[156,76],[164,104]],function(x,y){ var u=(x-96)/68; return ra(R('k2 c0 c1 c2'),0.45+u*0.3-(y-68)/90+(hash(x>>2,y>>1)-0.5)*0.08,x,y); });   // Schultern, Mantel
  b.hl(116,138,70,P.c2); b.rect(126,62,8,9,P.p2); b.vl(126,62,70,P.p1);                                                       // Kragen, Hals
  headB(b,128,52,11,13,-1,{skin:[P.p1,P.p2,P.p3,P.p4],hair:[P.h0,P.h1,P.h2,P.h3],lift:0.1});
  b.px(118,54,P.p4); b.px(118,55,P.p3); b.px(117,57,P.p3);                                                                    // Wangenlinie zum Fenster
  // das Kind: kleiner Kopf an ihrer Brust, helleres Haar, eine Hand an ihrem Mantel
  headB(b,108,80,7,8,-1,{skin:[P.p2,P.p3,P.p4,P.p5],hair:[P.h1,P.h2,P.h3,P.w2],lift:0.2}); b.poly([[100,104],[102,88],[116,86],[120,104]],function(x,y){ return ((x+y)%4<2)?P.r2:P.r3; }); b.rect(113,90,3,3,P.p3);
  M.light(b,M.lf.sum(M.lf.k(-0.25),M.lf.pool(80,36,100,50,0.7,1),M.lf.xband(130,232,0,-0.6)));
  edgeDark(b,1.8); };

// ================================================================ 5. Der Bunker (ghost, Nachhall): 1962, Weiterleitungsstelle. Ein Beamter am Tisch, vor ihm ein junger Mann mit Pappkoffer; dahinter die Schlange
M.mem.k4_bunker=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1962), FL=88, LX=150, LY=14;
  // Tonnengewölbe aus Beton, Wände mit Schalbrettspuren, ein Lüftungsrohr; Boden
  fill(b,0,0,w,FL,function(x,y){ var arc=8+Math.pow((x-116)/116,2)*24, c; if (y<arc) c=ra(R('k0 k1 k2 m0'),0.2+y/40,x,y); else c=ra(R('m0 m1 m2 m3'),0.5+(fbm(x,y,10,4)-0.5)*0.3+((y-arc)%9===0?-0.15:0),x,y); return c; });
  for (x=0;x<w;x++){ var ay=rnd(8+Math.pow((x-116)/116,2)*24); b.px(x,ay,P.m2); b.px(x,ay+1,P.m3); }
  b.rect(0,18,w,4,P.m1); b.hl(0,w-1,18,P.m3); b.hl(0,w-1,21,P.k2); for (x=10;x<w;x+=40){ b.rect(x,17,3,6,P.m2); }                // Lüftungsrohr
  fill(b,0,FL,w,h-FL,function(x,y){ return ra(R('k1 m0 m1 m2'),0.4+(y-FL)/30+(hash(x>>2,y)-0.5)*0.2,x,y); }); b.hl(0,w-1,FL,P.m3);
  // Schilder: WEITERLEITUNGSSTELLE mit Pfeil, WARTERAUM
  b.rect(118,30,84,9,P.s5); b.hl(118,201,30,P.s6); M.microText(b,'WEITERLEITUNGSSTELLE',120,32,P.k1); b.hl(204,210,34,P.s5); b.px(209,33,P.s5); b.px(209,35,P.s5);
  b.rect(16,34,40,8,P.s4); M.microText(b,'WARTERAUM',18,35,P.k2);
  // die Lampe: nackte Birne unter einem Blechschirm
  b.vl(LX,0,LY-3,P.k2); b.poly([[LX-6,LY],[LX+6,LY],[LX+3,LY-3],[LX-3,LY-3]],P.m2); b.ellipse(LX+0.5,LY+1.5,2,1.6,P.l1);
  // die Schlange: junge Männer mit Koffern, ins Dunkel hinein kleiner
  [[20,0.62],[38,0.7],[56,0.78],[76,0.86]].forEach(function(q,k){ var px=q[0], sc=q[1], top=FL-rnd(44*sc); person(b,px,FL,rnd(42*sc),{dir:1,coat:[P.m1,P.m2,P.m0],trou:[P.k2,P.m0,P.k1],hair:P.h1,hat:k%2?P.m1:null,reach:1});
    b.rect(px+4,FL-rnd(12*sc),rnd(9*sc),rnd(7*sc),P.e2); b.hl(px+4,px+4+rnd(9*sc)-1,FL-rnd(12*sc),P.e3); });
  // der junge Giuseppe: Mütze, dunkles Haar, der Pappkoffer mit Schnur
  var pid=cPeppino(), GX=110;
  if (!fig(b,GX,FL+1,S({nh:[4,-18],fh:[-2,-20],ho:[1,0]}),'R',pid)){ person(b,GX,FL+1,46,{dir:1,coat:[P.e1,P.e2,P.e0],hair:P.h2,hat:P.n1}); }
  var CX=GX+1, CY=FL-6; b.rect(CX-2,CY-10,16,11,P.e3); b.hl(CX-2,CX+13,CY-10,P.e4); b.vl(CX+13,CY-9,CY,P.e1); b.hl(CX-2,CX+13,CY,P.e1);
  b.vl(CX+3,CY-10,CY,P.w4); b.vl(CX+9,CY-10,CY,P.w4); b.rect(CX+4,CY-13,4,3,P.w2); b.px(CX+5,CY-12,P.k1);               // Schnur, Griff
  // der Tisch mit Stempel, Kissen, Buch; der Beamte dahinter: graue Jacke, Krawatte, Brille, Füller
  var TX0=134, TX1=196, TY=FL-24;
  var BX=172; b.rect(BX-8,TY-22,17,22,P.m2); b.vl(BX-8,TY-22,TY-1,P.m3); b.rect(BX-2,TY-21,4,12,P.s5); b.vl(BX,TY-20,TY-10,P.r1);   // Oberkörper, Hemd, Krawatte
  b.ellipse(BX+0.5,TY-28,4.6,5.4,P.p3); b.ellipse(BX+0.5,TY-31,4.6,2.6,P.m3); b.hl(BX-4,BX+1,TY-28,P.k1); b.px(BX-2,TY-28,P.s6); b.px(BX-5,TY-26,P.p2);   // Kopf, Haar, Brille
  limb(b,[BX-6,TY-16],[BX-14,TY-3],1.4,[P.m2,P.m3,P.m1]); b.line(BX-15,TY-3,BX-18,TY-6,P.k1);                               // Arm mit Füller
  b.rect(TX0,TY,TX1-TX0,3,P.w3); b.hl(TX0,TX1-1,TY,P.w4); b.rect(TX0+2,TY+3,TX1-TX0-4,FL-TY-3,P.w1); b.hl(TX0+2,TX1-3,TY+3,P.w0);
  b.rect(TX0+4,TY-2,18,2,P.s5); b.hl(TX0+4,TX0+21,TY-2,P.s6); b.vl(TX0+13,TY-2,TY-1,P.s3);                                   // das Buch
  b.rect(TX1-14,TY-2,6,2,P.k2); b.rect(TX1-6,TY-5,3,5,P.w2); b.rect(TX1-7,TY-1,5,1,P.k1);                                    // Stempelkissen, Stempel
  // Licht: nur die eine Lampe
  M.light(b,M.lf.sum(M.lf.k(-1.4),M.lf.pool(LX,LY+30,110,80,2.2,1.0),M.lf.pool(LX,LY+4,14,10,1.5,1)));
  b.ellipse(LX+0.5,LY+1.5,2,1.6,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 6. Der Neunzehnte April (memory, Markos Erinnerung): Frühling 1993. Eine Schlange vor der Mauer, Menschen mit Kanistern;
//    vorn zwei blaue Kanister mit roter Schrift „VUKOVIĆ“. Der Moment davor: niemand ist verletzt, keine Waffen, nur Warten in der Sonne.
M.mem.k4_april=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(419), WT=26, FL=70;
  fill(b,0,0,w,WT,function(x,y){ return ra(R('b3 b4 b5 s6'),0.35+y/40+(fbm(x,y*2,26,2)-0.5)*0.25,x,y); });
  for (i=0;i<4;i++){ var cx=rg()*w, cy=4+rg()*10; b.ellipse(cx,cy,14+rg()*16,2.4,function(xx,yy){ return bayer(xx,yy)<0.6?P.s6:P.b5; }); }
  // die Mauer der Brauerei: Ziegel, oben ein Sims, ein vergittertes Fenster, an der rechten Seite das Rohr mit den Hähnen
  fill(b,0,WT,w,FL-WT,function(x,y){ var c=M.tex.bricks(x,y,R('t1 t2 t3 t4'),9,4); if (fbm(x,y,10,3)>0.62) c=M.UP[c]; return c; });
  b.rect(0,WT,w,3,P.s4); b.hl(0,w-1,WT,P.s5); b.hl(0,w-1,WT+3,P.t1);
  b.rect(60,34,16,14,P.k2); for (x=62;x<76;x+=3) b.vl(x,34,47,P.m2); b.hl(59,76,48,P.s4);
  var PX=198; b.rect(PX,40,4,FL-40,P.m2); b.vl(PX,40,FL-1,P.m3); b.rect(PX-12,46,16,3,P.m2); b.hl(PX-12,PX+3,46,P.m3); b.rect(PX-12,49,2,4,P.m1); b.px(PX-12,53,P.b3);   // Rohr, Hahn, ein Tropfen
  // ein blühender Obstbaum links, frisches Grün
  for (y=36;y<FL;y++){ b.px(22,y,P.w1); b.px(23,y,P.w0); } b.line(22,44,12,32,P.w1); b.line(23,40,34,30,P.w1); b.line(22,50,30,42,P.w1);
  for (i=0;i<160;i++){ var bx=22+(rg()-0.5)*40, by=30+(rg()-0.5)*22; if (Math.hypot((bx-22)/20,(by-31)/12)>1) continue; b.px(rnd(bx),rnd(by),rg()<0.7?(rg()<0.5?P.s6:P.s5):(rg()<0.5?P.g4:P.d5)); }
  // Boden: Pflaster in der Sonne, lange Schatten nach rechts
  fill(b,0,FL,w,h-FL,function(x,y){ return M.tex.cobble(x,y,R('s1 s2 s3 s4'),7); }); b.hl(0,w-1,FL,P.s2);
  // die Schlange entlang der Mauer: vom Hahn nach links, Menschen in Frühlingsjacken, jeder mit Kanistern; manche sitzen auf ihren
  var Q=[[186,1,'b'],[172,1,'s'],[158,1,'a'],[146,1,'c'],[132,1,'kid'],[120,1,'o'],[104,1,'b'],[90,1,'s'],[78,1,'a'],[62,1,'c'],[48,1,'o']];
  var COATS={b:[P.c1,P.c2,P.c0],s:[P.e2,P.e3,P.e1],a:[P.g2,P.g3,P.g1],c:[P.r1,P.r2,P.r0],o:[P.m1,P.m2,P.m0],kid:[P.b1,P.b2,P.b0]};
  Q.forEach(function(q,k){ var px=q[0], kind=q[2], hgt=kind==='kid'?28:(36+((k*5)%5)), sitting=(k===3||k===8);
    if (sitting){ canister(b,px+2,FL+1,8,10,[P.b0,P.b1,P.b2]); person(b,px,FL-9,hgt-10,{dir:1,coat:COATS[kind],hair:k%3?P.h1:P.s4,long:kind==='s'}); }
    else { var hp=person(b,px,FL+1,hgt,{dir:1,coat:COATS[kind],hair:(k%4===0)?P.s4:(k%3?P.h1:P.h2),long:(kind==='s'||kind==='o'),scarf:kind==='s'?P.r3:null,reach:1});
      canister(b,hp[0]+3,FL+1,7,9,[[P.e1,P.e2,P.e3],[P.g1,P.g2,P.g3],[P.m2,P.m3,P.m4],[P.r1,P.r2,P.r3]][k%4],{cap:P.k2}); }
    for (var sx=0;sx<12;sx++) if (bayer(px+sx,FL+2)<0.5) b.px(px+sx,FL+2,M.DN[b.get(px+sx,FL+2)]); });
  // vorn: die zwei blauen Kanister mit roter Schrift, groß, in der Sonne
  [[64,101],[100,103]].forEach(function(c,k){ var cx=c[0], cy=c[1], cw=32, ch=26, x0=cx-cw/2, y0=cy-ch;
    for (y=cy+1;y<cy+4;y++) for (x=x0+4;x<x0+cw+14;x++) if (bayer(x,y)<0.55) b.px(x,y,M.DN[M.DN[b.get(x,y)]]);                 // Schatten
    for (y=y0;y<cy;y++) for (x=x0;x<x0+cw;x++){ var u=(x-x0)/cw, v=(y-y0)/ch, c2=P.b2; if (u<0.14) c2=P.b4; else if (u<0.3) c2=P.b3; else if (u>0.84) c2=P.b1; if (v>0.94) c2=P.b0; if (y===y0) c2=P.b4; if ((y-y0)%7===6 && u>0.08 && u<0.92) c2=M.DN[c2]; b.px(x,y,c2); }
    b.rect(x0+4,y0-4,12,4,P.b2); b.hl(x0+4,x0+15,y0-4,P.b4); b.rect(x0+6,y0-3,8,2,P.k1);                                       // Griff
    b.rect(x0+cw-8,y0-5,5,5,P.r2); b.hl(x0+cw-8,x0+cw-4,y0-5,P.r3);                                                           // Verschluss
    M.microText(b,'VUKOVIĆ',x0+3,y0+9,P.r2); M.microText(b,'VUKOVIĆ',x0+2,y0+8,P.r3); });
  M.light(b,M.lf.sum(M.lf.k(0.05),M.lf.xband(0,w,0.25,-0.15),M.lf.band(70,104,0,-0.1)));
  edgeDark(b,1.6); };

// ================================================================ 7. Am Depot (ghost): die junge Gerda bei Nacht am Depottor, die Thermoskanne in beiden Händen; die Neunzehn fährt ein
M.mem.k4_depot=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1954), FL=82, LMX=58, LMY=24;
  fill(b,0,0,w,FL,function(x,y){ return ra(R('k0 k1 n0 n1'),0.12+y/90+(fbm(x,y*2,22,3)-0.5)*0.2,x,y); });
  // das Depot: Ziegelbau mit zwei Bogentoren, eines offen (innen dunkel, eine Arbeitslampe), Lampe über dem Tor
  var DX0=8, DX1=150, DT=14;
  for (y=DT;y<FL;y++) for (x=DX0;x<DX1;x++){ var c=M.tex.bricks(x,y,R('t0 t1 t2 t3'),8,4); if (y<DT+3) c=P.t2; b.px(x,y,c); }
  [[24,62],[82,130]].forEach(function(g,k){ var gx0=g[0], gx1=g[1], gc=(gx0+gx1)/2, gr=(gx1-gx0)/2, gt=38;
    for (y=gt-gr*0.6;y<FL;y++) for (x=gx0;x<gx1;x++){ var dy=y-gt, inA=dy>=0 || Math.hypot((x-gc)/gr,dy/(gr*0.6))<1; if (!inA) continue;
      var c2=k===1?ra(R('k0 k1 k2'),0.3+(hash(x>>1,y>>1)-0.5)*0.3,x,y):(((x-gx0)%5===0)?P.w0:P.w1); b.px(x,y,c2); }
    for (x=gx0-2;x<gx1+2;x++){ var ay=dyArc(x,gc,gr,gt); if (ay!==null) { b.px(x,ay-1,P.s3); b.px(x,ay-2,P.t3); } } });
  function dyArc(x,gc,gr,gt){ var u=(x-gc)/gr; if (Math.abs(u)>1) return null; return rnd(gt-Math.sqrt(1-u*u)*gr*0.6); }
  b.px(104,58,P.y4); b.px(105,58,P.y3); for (y=59;y<FL;y++) if (bayer(104,y)<0.3) b.px(104,y,P.w1);                                  // Arbeitslampe innen
  // Lampe über dem linken Tor, Lichtkegel
  b.rect(LMX-4,LMY-2,9,3,P.m1); b.hl(LMX-3,LMX+3,LMY+1,P.y5); b.vl(LMX,LMY-6,LMY-3,P.m1);
  // Schnee auf dem Boden, die Gleise kommen von rechts vorn und biegen ins offene Tor
  fill(b,0,FL,w,h-FL,function(x,y){ return ra(R('n2 n3 s3 s4'),0.4+(y-FL)/40+(fbm(x*0.3,y,8,6)-0.5)*0.3,x,y); }); b.hl(0,w-1,FL,P.s4);
  for (i=0;i<2;i++){ for (x=96;x<w;x++){ var t=(x-96)/(w-96), ry=rnd(FL+2+t*t*18+i*(2+t*8)); b.px(x,ry,P.m3); b.px(x,ry+1,P.k2); } }
  // die Bank am Tor
  b.rect(10,FL-10,22,2,P.w2); b.hl(10,31,FL-10,P.w3); b.vl(12,FL-8,FL,P.k2); b.vl(29,FL-8,FL,P.k2); b.hl(10,31,FL-11,P.s5);
  // die Neunzehn: alte blau-weiße Trambahn, runde Stirn, ein Scheinwerfer, warme Fenster, Liniennummer
  var TX=176, TT=40, TB=FL+8;
  b.poly([[TX,TT+4],[TX+6,TT],[w+10,TT],[w+10,TB],[TX+2,TB]],function(xx,yy){ var c=yy<TT+14?P.s5:P.b1; if (yy>=TT+14 && yy<TT+16) c=P.s6; if (yy>TB-5) c=P.b0; if (xx<TX+3) c=M.DN[c]; return c; });
  for (x=TX+10;x<w;x+=12){ b.rect(x,TT+4,8,8,P.y3); b.hl(x,x+7,TT+4,P.y4); }
  b.rect(TX+2,TT+4,6,8,P.y2); b.rect(TX+3,TT-4,8,4,P.k1); M.microText(b,'19',TX+4,TT-4,P.y4); b.line(TX+20,TT,TX+30,TT-14,P.k1); b.hl(TX+26,TX+34,TT-14,P.k1);
  b.ellipse(TX+4,TB-8,2,2,P.l1); for (i=0;i<26;i++) for (var j=-1-Math.floor(i/6);j<=1+Math.floor(i/6);j++) if (bayer(TX+2-i,TB-8+j)<0.75-i*0.026) mixPx(b,TX+2-i,TB-8+j,P.s6,4);   // Scheinwerferkegel
  // Gerda, jung: Kopftuch, Mantel, die grüne Kanne in beiden Händen
  var gid=cGerda(), GX=62;
  if (!fig(b,GX,FL+1,S({nh:[4,-21],fh:[3,-20],ho:[1,0]}),'R',gid)){ person(b,GX,FL+1,44,{dir:1,coat:[P.w2,P.w3,P.w1],hair:P.h2,hat:P.b1,long:true}); }
  b.rect(GX+3,FL-26,4,9,P.g3); b.vl(GX+3,FL-26,FL-18,P.g4); b.rect(GX+3,FL-28,4,2,P.g2); b.px(GX+7,FL-23,P.m2);
  // Schnee fällt im Licht der Lampe
  for (i=0;i<90;i++){ var sx=rg()*w, sy=rg()*h, lit=Math.hypot(sx-LMX,(sy-LMY-20)*0.7)<44; if (lit||rg()<0.35) b.px(rnd(sx),rnd(sy),lit?P.s6:P.s4); }
  M.light(b,M.lf.sum(M.lf.k(-0.7),M.lf.pool(LMX,LMY+40,46,52,1.5,1),M.lf.pool(TX-10,TB-8,40,14,1.0,1)));
  b.hl(LMX-3,LMX+3,LMY+1,P.y5); b.ellipse(TX+4,TB-8,2,2,P.l1);
  edgeDark(b,1.9); };

// ================================================================ 8. Neujahr (memory, letztes Bild): Jasnas Küche in der Morgensonne, drei Tassen, die Džezva, Plätzchen; vor dem Tisch Zorans Pantoffeln
M.mem.k4_home=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2012), FL=84, WX0=24, WX1=78, WY0=10, WY1=56;
  fill(b,0,0,w,FL,function(x,y){ if (y>FL-6) return ra(R('w1 w2'),0.5,x,y); return ra(R('s3 s4 s5 y5'),0.55-y/FL*0.2+(fbm(x,y,14,2)-0.5)*0.1,x,y); });
  b.hl(0,w-1,FL-6,P.w3); fill(b,0,FL,w,h-FL,function(x,y){ return M.tex.tiles(x,y*2,P.s4,P.s3,9); });
  // Fenster: blauer Himmel, Dächer mit Schnee, Sonne; auf dem Brett der kleine Tannenbaum
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ return ra(R('b3 b4 b5 s6'),0.3+(y-WY0)/50,x,y); });
  for (x=WX0;x<WX1;x++){ var ry=WY0+30+((x>>3)%2)*4; for (y=ry;y<WY1;y++) b.px(x,y,y<ry+2?P.s6:((x+y)%5===0?P.k2:P.t2)); }
  b.ellipse(WX0+12,WY0+10,4,4,P.l1); b.ellipse(WX0+12,WY0+10,6,6,function(xx,yy){ return bayer(xx,yy)<0.4?P.l0:undefined; });
  b.rect(WX0-3,WY0-3,WX1-WX0+6,3,P.s6); b.rect(WX0-3,WY1,WX1-WX0+6,3,P.s5); b.rect(WX0-3,WY0,3,WY1-WY0,P.s6); b.rect(WX1,WY0,3,WY1-WY0,P.s5); b.rect(rnd((WX0+WX1)/2)-1,WY0,2,WY1-WY0,P.s5);
  var TRX=WX1-12; for (y=WY1-14;y<WY1;y++){ var tw=rnd((y-(WY1-14))*0.35)+1; b.hl(TRX-tw,TRX+tw,y,((y+x)%3)?P.g2:P.g3); } b.rect(TRX-2,WY1-1,5,2,P.t3); b.px(TRX,WY1-15,P.y4);
  // Sonnenflecken: durchs Fenster schräg auf Wand, Tisch und Boden
  var sun=function(x,y){ var u=x-(y-WY0)*0.9-WX0+6; return u>4 && u<WX1-WX0+10 && y>WY0+10; };
  // der Tisch mit Wachstuch (Blumenmuster), darauf drei Tassen, die Džezva, ein Teller mit Plätzchen, die offene Kiste
  var TX0=60, TX1=200, TY=60;
  b.rect(TX0+4,TY+8,4,FL-TY-6,P.w1); b.rect(TX1-8,TY+8,4,FL-TY-6,P.w1);
  fill(b,TX0,TY,TX1-TX0,10,function(x,y){ var v=y-TY; if (v>6 && ((x+40)%6)>3) return undefined; var c=(v<2)?P.s6:P.s5; if (((x>>2)+(y>>1))%5===0) c=P.r3; if (((x>>2)+(y>>1))%7===3) c=P.g4; if (v===9) c=P.s3; return c; });
  [[100,TY],[126,TY],[150,TY]].forEach(function(c,k){ b.ellipse(c[0]+0.5,c[1]-0.5,5,1.4,P.s5); b.rect(c[0]-3,c[1]-6,7,6,P.s6); b.vl(c[0]+3,c[1]-6,c[1]-1,P.s4); b.hl(c[0]-3,c[0]+3,c[1]-6,P.w2); b.px(c[0]+4,c[1]-4,P.s5); b.px(c[0]+5,c[1]-4,P.s5); b.px(c[0]+4,c[1]-3,P.s5);
    if (k===1) b.line(c[0]+2,c[1]-8,c[0]+4,c[1]-4,P.m4); });
  var DZ=[176,TY-1]; for (i=0;i<7;i++){ var ww=[5,4,5,6,7,7,6][i]; b.hl(DZ[0]-(ww>>1),DZ[0]+(ww>>1),DZ[1]-7+i,[P.t4,P.t3,P.t4,P.t3,P.t3,P.t2,P.t1][i]); } for (i=0;i<7;i++) b.px(DZ[0]+3+i,DZ[1]-5-Math.floor(i/3),i>5?P.k2:P.w1);
  b.ellipse(78,TY-1,8,2,P.s6); [[74,TY-2],[78,TY-3],[82,TY-2],[77,TY-1],[80,TY-1]].forEach(function(p){ b.ellipse(p[0],p[1],1.8,1,P.y4); b.px(p[0],p[1],P.s6); });   // Vanilice mit Puderzucker
  var KX=110; b.rect(KX,TY-16,26,4,P.w3); b.hl(KX,KX+25,TY-16,P.w4); b.rect(KX+1,TY-12,24,0,P.w2);                              // die offene Kiste (Deckel hochgeklappt)
  b.rect(KX+2,TY-11,22,1,P.w1); b.poly([[KX+2,TY-12],[KX+24,TY-12],[KX+25,TY-28],[KX+1,TY-28]],function(xx,yy){ return yy<TY-26?P.w4:P.w3; }); b.rect(KX+5,TY-14,8,3,P.s6); b.px(KX+7,TY-14,P.r3);
  // die Pantoffeln vor dem Tisch, in der Sonne: dunkelbraun kariert, ordentlich nebeneinander
  [[110,FL+12],[124,FL+13]].forEach(function(s){ b.ellipse(s[0],s[1],7,2.6,P.k2); b.ellipse(s[0]-0.5,s[1]-1,6.4,2.2,function(xx,yy){ return ((xx+yy)%3===0)?P.w1:(((xx>>1)+(yy>>1))%2?P.w2:P.r1); }); b.ellipse(s[0]+2,s[1]-1.5,3.6,1.4,P.w3); });
  M.light(b,function(x,y){ var v=-0.35; if (sun(x,y)) v+=0.55; var d=Math.hypot((x-60)/120,(y-60)/60); v+=Math.max(0,0.4-d*0.4); return v; });
  edgeDark(b,1.6); };
})(M);
