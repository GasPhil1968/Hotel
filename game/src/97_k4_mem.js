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
M.K4_MEM_TINT=M.K4_MEM_TINT||{ k4_bus:'memory', k4_stiefel:'memory', k4_kiste:'ghost', k4_kurve:'ghost', k4_bunker:'ghost', k4_april:'memory', k4_depot:'ghost', k4_home:'memory' };

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
  var hip=y-rnd(19*k), sh=y-rnd(31*k), hd=y-rnd(36.5*k), hw=Math.max(2,2.6*k), cw=Math.max(3,rnd(5*k));
  limb(b,[x-1,hip],[x-1-dir*(o.step||1),y-1],Math.max(1,1.4*k),trou); limb(b,[x+1,hip],[x+1+dir*(o.step||1),y-1],Math.max(1,1.4*k),trou);   // Beine
  b.hl(x-2-dir,x,y,P.k2); b.hl(x+1,x+3+dir,y,P.k2);                                                                                   // Schuhe
  b.poly([[x-cw+1,sh],[x+cw-1,sh],[x+cw+(o.long?1:0),hip+(o.long?rnd(8*k):2)],[x-cw-(o.long?1:0),hip+(o.long?rnd(8*k):2)]],function(xx,yy){ return (xx-x)*dir>cw*0.4?coat[2]:((xx-x)*dir<-cw*0.4?coat[1]:coat[0]); });
  b.ellipse(x+0.5,sh+0.5,cw-0.5,1.4,coat[0]);
  b.rect(x-1,sh-2,3,2,skin[2]);                                                                                                       // Hals
  b.ellipse(x+dir*0.6+0.5,hd+0.5,hw,hw+0.7,skin[0]); b.px(rnd(x+dir*(hw+0.6)),hd+1,skin[0]); b.px(rnd(x+dir*hw*0.5),hd,skin[1]);     // Kopf mit Nase
  if (o.hat) { b.ellipse(x+0.5,hd-hw*0.55,hw+0.6,hw*0.55,o.hat); b.hl(rnd(x-hw),rnd(x+hw+dir),rnd(hd-hw*0.2),o.hat); }
  else { b.ellipse(x-dir*0.8+0.5,hd-1,hw+0.2,hw*0.7,hair); b.px(rnd(x-dir*hw),hd,hair); b.px(rnd(x-dir*hw),hd+1,hair); }
  if (o.scarf) b.hl(x-cw+2,x+cw-2,sh+1,o.scarf);
  var hy=hip-rnd(1*k); limb(b,[x+dir*(cw-1),sh+1],[x+dir*(cw-1+(o.reach||0)),hy],Math.max(1,1.1*k),coat); b.px(x+dir*(cw-1+(o.reach||0)),hy+1,skin[0]);   // naher Arm, Hand
  return [x+dir*(cw-1+(o.reach||0)),hy]; }
// Kanister (Plastik, mit Griff oben und Ausguss), Füße bei (x,y)
function canister(b,x,y,w,h,col,o){ o=o||{}; var x0=x-(w>>1), y0=y-h, i, j;
  for (j=0;j<h;j++) for (i=0;i<w;i++){ var u=i/(w-1), c=col[1]; if (u<0.18) c=col[2]; else if (u>0.8) c=col[0]; if (j===0) c=col[2]; if ((j%Math.max(4,rnd(h/4)))===0 && j>2 && u>0.1 && u<0.9) c=M.DN[c]; b.px(x0+i,y0+j,c); }
  var gw=Math.max(3,rnd(w*0.45)); for (i=0;i<gw;i++){ b.px(x0+2+i,y0-2,col[1]); } b.px(x0+2,y0-1,col[1]); b.px(x0+1+gw,y0-1,col[1]); b.hl(x0+3,x0+gw,y0-1,P.k1);   // Griff
  b.rect(x0+w-3,y0-3,2,3,o.cap||P.r2); b.hl(x0,x0+w-1,y,P.k1); }

// ================================================================ 1. Im Nachtbus nach München (memory): Schnee ab Salzburg. Mala sitzt am Fenster vor Marko, man sieht sie über die Lehne
//    von hinten, das Gesicht zur Scheibe, eine Hand am Glas; draußen verschneite Berge, ein Dorf, Laternen, das Schild „SALZBURG“.
M.mem.k4_bus=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2412), WX0=18, WX1=214, WY0=4, WY1=58, RC=7;
  b.rect(0,0,w,h,P.k1);
  function inPane(x,y){ if (x<WX0||x>WX1||y<WY0||y>WY1) return false; var cx=cl(x,WX0+RC,WX1-RC), cy=cl(y,WY0+RC,WY1-RC); return (x-cx)*(x-cx)+(y-cy)*(y-cy)<=RC*RC+1; }
  var o=new M.Buf(w,h,P.k0);
  fill(o,0,0,w,60,function(x,y){ return ra(R('k0 k1 k1 k2 n0'),0.1+y/64+(fbm(x*0.5,y*1.6,22,3)-0.5)*0.3,x,y); });
  // der Untersberg: eine große verschneite Masse, unten Waldgürtel; links niedrige Hügel
  var mt=function(x){ return rnd(Math.min(38-24*Math.exp(-Math.pow((x-152)/40,2))-8*Math.exp(-Math.pow((x-196)/16,2)), 33+Math.sin(x*0.06)*3)+(fbm(x,0,7,4)-0.5)*4); };
  for (x=0;x<w;x++) for (y=mt(x);y<46;y++){ var d=(y-mt(x))/(46-mt(x)), f=fbm(x*1.3,y*1.1,5,8), c=ra(R('n1 n2 n3 n4 n5'),0.78-d*0.55+(f-0.5)*0.35,x,y);
    if (d>0.45 && fbm(x*0.7,y*1.8,6,13)>0.52) c=ra(R('k1 k2 n0 n1'),0.4+(f-0.5)*0.5,x,y); if (y===mt(x)) c=P.n4; o.px(x,y,c); }
  for (y=44;y<60;y++) for (x=0;x<w;x++) o.px(x,y,ra(R('k1 k2 n0 n1 n2'),0.25+(y-44)/26+(fbm(x*0.3,y*2,8,5)-0.5)*0.35,x,y));
  for (i=0;i<18;i++){ var vx=86+Math.floor(rg()*52), vy=40+Math.floor(rg()*6); o.px(vx,vy,rg()<0.6?P.y4:P.y3); if (rg()<0.25) o.px(vx+1,vy,P.y2); }   // ein Dorf
  for (i=0;i<4;i++){ var vx2=170+Math.floor(rg()*30), vy2=43+Math.floor(rg()*3); o.px(vx2,vy2,P.y3); }
  for (x=0;x<w;x++){ o.px(x,52,P.m1); o.px(x,53,P.k2); if (x%14===3){ o.px(x,51,P.y3); o.px(x,50,P.k2); } }                          // Leitplanke mit Rückstrahlern
  for (y=54;y<60;y++) for (x=0;x<w;x++) o.px(x,y,(y===57 && (x%12)<6)?P.m2:P.k1);                                                  // Fahrbahn
  for (i=0;i<6;i++){ var lx=10+i*38+Math.floor(rg()*8), ly=26+(i%2); for (y=ly+1;y<52;y++) o.px(lx,y,P.k2); o.hl(lx-3,lx,ly,P.k2); o.px(lx-3,ly+1,P.y5); o.px(lx-2,ly+1,P.y4);   // Laternen, verwischt
    for (var k=1;k<9;k++) if (bayer(lx-3-k,ly+1)<0.6-k*0.06) o.px(lx-3-k,ly+1,k<3?P.y4:P.y2); }
  [[34,48],[64,49]].forEach(function(c){ o.px(c[0],c[1],P.l1); o.px(c[0]+3,c[1],P.l1); for (var k=1;k<10;k++) if (bayer(c[0]+3+k,c[1])<0.6-k*0.06) o.px(c[0]+3+k,c[1],P.s4); });   // Gegenverkehr
  var SGX=118, SGY=20; for (y=SGY+9;y<52;y++){ o.px(SGX+6,y,P.k2); o.px(SGX+26,y,P.k2); } o.rect(SGX,SGY,34,9,P.b1); o.hl(SGX,SGX+33,SGY,P.b3); o.rect(SGX+1,SGY+1,32,7,P.b1);
  M.microText(o,'SALZBURG',SGX+2,SGY+2,P.s6); o.hl(SGX+2,SGX+31,SGY+8,P.b2);
  for (i=0;i<110;i++){ var sx=rg()*w, sy=rg()*58, L=rg()<0.2?4+rg()*4:1+rg()*2; for (var s=0;s<L;s++){ var px=rnd(sx-s*1.4), py=rnd(sy+s*0.6); if (px<0||py<0||py>57) continue; if (bayer(px,py)<(L>3?0.8:0.6)) o.px(px,py,L>3?P.s4:P.n4); } }
  for (y=0;y<h;y++) for (x=0;x<w;x++) if (inPane(x,y)) b.px(x,y,o.get(x,y));
  // Spiegelungen im Glas: Leselampen, Gepäckablage
  for (x=WX0+4;x<WX1-4;x++) if (bayer(x,8)<0.25) mixPx(b,x,8,P.n3,3); [56,96,178].forEach(function(lx){ mixPx(b,lx,11,P.y3,5); mixPx(b,lx+1,11,P.y3,4); });
  // Rahmen, Wand, Vorhang
  for (y=0;y<66;y++) for (x=0;x<w;x++){ if (inPane(x,y)) continue; var e=Math.max(WX0-x,x-WX1,WY0-y,y-WY1), near=(x>=WX0-3&&x<=WX1+3&&y>=WY0-3&&y<=WY1+3);
    b.px(x,y,near&&e<=1?P.k2:(near&&e<=3?P.m1:ra(R('k1 k2 n0 m0'),0.4+(fbm(x,y,20,5)-0.5)*0.4,x,y))); }
  for (y=0;y<62;y++){ var cw=11+Math.round(Math.sin(y*0.09)*1.2)+(y>32&&y<38?-3:0); for (x=0;x<cw;x++){ var fx=WX0-3+x-Math.round(cw/2), fold=Math.sin((x+y*0.1)*1.3), cc=fold>0.5?P.c3:(fold<-0.4?P.c1:P.c2); if (x===0||x===cw-1) cc=P.c1; b.px(fx,y,cc); } }
  b.rect(0,58,w,8,P.m1); b.hl(0,w-1,58,P.m3); b.hl(0,w-1,59,P.m2); b.hl(0,w-1,65,P.k1);
  // Mala: Schultern in der Jeansjacke, grauer Schal, der Kopf im verlorenen Profil zur Scheibe, der Zopf über der Lehne
  var MX=118, MY=40;
  b.poly([[MX-20,70],[MX-16,58],[MX-6,54],[MX+8,54],[MX+18,58],[MX+22,70]],function(xx,yy){ var u=(xx-MX)/22; return ra(R('c0 c1 c2 c3'),0.5+u*0.3-(yy-54)/40+(hash(xx>>1,yy>>1)-0.5)*0.08,xx,yy); });
  b.ellipse(MX+1,54,9,3,function(xx,yy){ return ((xx+yy)%3===0)?P.m2:P.m3; });                                                  // Schal
  b.rect(MX-2,48,6,6,P.p2); b.vl(MX+3,48,53,P.p3);
  headB(b,MX+1,40,8,9.5,1,{skin:[P.p2,P.p3,P.p4,P.p5],hair:[P.h1,P.h2,P.h3,P.w2],lift:0.12});
  for (i=0;i<22;i++){ var bx=MX-3+Math.round(Math.sin(i*0.3)*0.8), by=48+i; b.px(bx,by,(i%3===2)?P.h1:P.h2); b.px(bx+1,by,(i%3===1)?P.h1:P.h3); if (i>17&&i<20) { b.px(bx,by,P.w1); b.px(bx+1,by,P.w1); } }   // Zopf
  // ihre Hand an der Scheibe, ein Hauch Atem
  limb(b,[MX+14,58],[MX+22,40],1.6,[P.c2,P.c3,P.c1]); b.ellipse(MX+23,37,2,2.4,P.p4); b.px(MX+24,35,P.p3); b.px(MX+22,35,P.p4);
  for (y=26;y<44;y++) for (x=MX+10;x<MX+40;x++){ var dd=Math.hypot((x-(MX+20))/12,(y-33)/7); if (inPane(x,y) && dd<1 && bayer(x,y)<(1-dd)*0.45) mixPx(b,x,y,P.s5,3); }
  // die Lehne ihres Sitzes vorn (dunkelblau, Rautenmuster) mit weißem Schonbezug
  var SEAT=function(x,y){ var c=ra(R('k2 n0 n1 c1 c2'),0.62-(y-66)/70-Math.abs(x-118)/260+(hash(x>>1,y>>1)-0.5)*0.06,x,y), d1=((x+y*2)%10+10)%10, d2=((x-y*2)%10+10)%10; if (d1===0||d2===0) c=M.UP[c]; if (d1===0&&d2===0) c=P.r2; return c; };
  b.poly([[60,72],[72,64],[164,64],[176,72],[180,104],[56,104]],SEAT);
  b.poly([[84,66],[96,61],[140,61],[152,66],[146,74],[90,74]],function(xx,yy){ var f=Math.sin(xx*0.7+yy*0.3); return ra(R('s2 s3 s4 s5'),0.66-(yy-61)/30+(f>0.65?0.1:0),xx,yy); });
  b.line(90,74,146,74,P.s1); b.line(84,66,90,74,P.s2); b.line(152,66,146,74,P.s1);
  // Licht: draußen kalt, drinnen dunkel; ein Laternenschein liegt gerade auf ihrem Gesicht und der Lehne
  M.light(b,function(x,y){ if (inPane(x,y)) return 0.05; var v=-0.95+Math.max(0,1-Math.hypot((x-128)/58,(y-44)/26))*0.95; return v; });
  edgeDark(b,1.8); };

// ================================================================ 2. Die gelben Stiefel (memory, Lanas Erinnerung): 1990, Samstag, Haltestelle der Drei nach dem Regen. Ana mit sechs sitzt auf dem
//    Bordstein und weint, in gelben Gummistiefeln, zwei Nummern zu groß; Lana sitzt neben ihr und malt ihr eine Straßenbahn, in jedem Fenster ein Gesicht
M.mem.k4_stiefel=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1990), G=78;
  fill(b,0,0,w,24,function(x,y){ return ra(R('m2 m3 s3 m3'),0.3+y/30+(fbm(x,y*2,18,2)-0.5)*0.3,x,y); });
  var fac=[[0,40,'s3'],[40,92,'t3'],[92,140,'s2'],[140,190,'e3'],[190,232,'s3']];
  fac.forEach(function(f,k){ var top=6+((k*7)%3)*4; for (y=top;y<G-12;y++) for (x=f[0];x<f[1];x++){ var c=ra(R(f[2]==='t3'?'t2 t3 t4':(f[2]==='e3'?'e2 e3 e4':'s2 s3 s4')),0.5+(fbm(x,y,6,k)-0.5)*0.3,x,y); if (y===top||y===top+1) c=P.s4; if ((y-top)%16===0) c=M.DN[c]; b.px(x,y,c); }
    for (var r=0;r<3;r++) for (x=f[0]+5;x<f[1]-6;x+=11){ var wy=top+5+r*16; if (wy+9>G-14) continue; b.rect(x,wy,6,9,P.k2); b.rect(x+1,wy+1,4,7,(hash(x,r+k)<0.25)?P.y3:P.n1); b.vl(x+3,wy+1,wy+7,P.s4); b.hl(x-1,x+6,wy+9,P.s4); } });
  fill(b,0,G-12,w,5,function(x,y){ return ra(R('m2 m3 s3'),0.5+(hash(x>>2,y)-0.5)*0.4,x,y); }); b.hl(0,w-1,G-12,P.s4);
  fill(b,0,G-7,w,9,function(x,y){ var c=ra(R('k2 m0 m1 m2'),0.45+(fbm(x*0.4,y*2,6,3)-0.5)*0.5,x,y); if (hash(x>>2,3)<0.4 && bayer(x,y)<0.3) c=P.m3; return c; });
  b.hl(0,w-1,G-4,P.m4); b.hl(0,w-1,G-3,P.k1); b.hl(0,w-1,G,P.m4); b.hl(0,w-1,G+1,P.k1);
  fill(b,0,G+2,w,h-G-2,function(x,y){ var c=M.tex.paving(x,y,R('m1 m2 m3 s3'),9); if (fbm(x*0.5,y*1.5,9,6)>0.64) c=(bayer(x,y)<0.6)?P.m3:P.s3; return c; });
  b.hl(0,w-1,G+2,P.s4); b.hl(0,w-1,G+3,P.m1);
  // die Drei kommt, klein, links in der Ferne
  var TX=16, TY=G-3; b.rect(TX,TY-15,32,13,P.r2); b.rect(TX,TY-11,32,4,P.s5); for (x=TX+2;x<TX+31;x+=6) b.rect(x,TY-10,4,2,P.n2); b.hl(TX,TX+31,TY-15,P.r3); b.rect(TX+31,TY-14,2,11,P.r1);
  b.line(TX+14,TY-15,TX+19,TY-21,P.k1); b.hl(TX+16,TX+22,TY-21,P.k1); b.rect(TX+29,TY-14,4,6,P.k1); M.microText(b,'3',TX+30,TY-14,P.y4);
  b.px(TX+33,TY-5,P.l1); for (i=1;i<8;i++) if (bayer(TX+33+i,TY-5)<0.7-i*0.08) b.px(TX+33+i,TY-5,P.s6);
  // das Wartehäuschen und das Haltestellenschild
  var SX0=96, SX1=200, ST=36, SB=G+18;
  b.rect(SX0-2,ST-4,SX1-SX0+4,4,P.m1); b.hl(SX0-2,SX1+1,ST-4,P.m3); b.hl(SX0-2,SX1+1,ST-1,P.k1);
  for (y=ST;y<SB-8;y++) for (x=SX0;x<SX1;x++){ if (bayer(x,y)<0.35) b.px(x,y,M.UP[b.get(x,y)]); }
  [SX0,SX0+52,SX1-1].forEach(function(px){ b.vl(px,ST,SB,P.m1); b.vl(px+1,ST,SB,P.k2); });
  b.rect(SX0+10,SB-13,74,3,P.w3); b.hl(SX0+10,SX0+83,SB-13,P.w4); b.vl(SX0+14,SB-10,SB,P.m1); b.vl(SX0+78,SB-10,SB,P.m1);
  var PX=212; b.vl(PX,G-12,SB,P.m2); b.vl(PX+1,G-12,SB,P.m1); b.ellipse(PX+0.5,G-18,6,6,P.y4); b.ellipse(PX+0.5,G-18,4.6,4.6,P.s6); M.microText(b,'3',PX-1,G-20,P.k1);
  // der Bordstein vorn am Wartehäuschen: Lana sitzt darauf, das Heft auf den Knien; Ana sitzt neben ihr und weint, die Fäuste an den Augen
  var CY=SB-2; for (x=SX0-6;x<SX1+8;x++){ b.px(x,CY-3,P.s5); b.px(x,CY-2,P.s4); b.px(x,CY-1,P.s3); b.px(x,CY,P.m2); if (x%11===0){ b.px(x,CY-3,P.s3); b.px(x,CY-2,P.s3); } }
  var LX=134, LY=CY+5;
  if (!fig(b,LX,LY,S({h:[0,-9],ln:2,nf:[8,0,'f'],ff:[6,0,'f'],nh:[10,-15],fh:[8,-14],sit:1,ho:[1,1]}),'R','mala')){ b.ellipse(LX,LY-36,4,5,P.h1); b.rect(LX-4,LY-29,9,16,P.c2); }
  var BX=LX+5, BY=LY-24; b.rect(BX,BY,15,10,P.s6); b.hl(BX,BX+14,BY+10,P.s4); b.vl(BX+15,BY+1,BY+10,P.s3);                     // das Blatt: eine Straßenbahn, in jedem Fenster ein Gesicht
  b.rect(BX+2,BY+3,11,5,P.r3); b.hl(BX+2,BX+12,BY+3,P.r4); for (x=BX+3;x<BX+12;x+=3){ b.px(x,BY+4,P.p4); b.px(x+1,BY+4,P.s6); b.px(x,BY+5,P.s6); } b.px(BX+3,BY+8,P.k1); b.px(BX+11,BY+8,P.k1); b.line(BX+7,BY+3,BX+9,BY+1,P.k1);
  b.line(BX+16,BY+2,BX+19,BY-2,P.y3); b.px(BX+16,BY+3,P.k1);
  var aid=cAna(), AX=162, AY=LY, ai=charInfo(aid||'mala'), fy=-(ai.hipY+ai.tLen)+2;
  if (!fig(b,AX,AY,S({h:[0,-14],nf:[-6,0,'f'],ff:[-4,0,'f'],nh:[-3,fy],fh:[-1,fy+1],sit:1,hd:'b',ho:[-1,1]}),'L',aid)){ fig(b,AX,AY,S({h:[0,-9],nh:[-2,-26],fh:[-1,-25],sit:1,hd:'b'}),'L','mala',{scale:0.64}); }
  for (y=AY-7;y<=AY;y++){ b.hl(AX-11,AX-7,y,y<AY-5?P.y5:(y===AY?P.y2:P.y4)); b.hl(AX-6,AX-2,y,y<AY-5?P.y4:(y===AY?P.y1:P.y3)); }   // gelbe Gummistiefel, zu groß
  b.px(AX-5,AY-22,P.x5); b.px(AX-6,AY-20,P.x4);
  for (i=0;i<12;i++){ var rx=SX0+rg()*(SX1-SX0), ry=ST+rg()*30; b.px(rnd(rx),rnd(ry),P.s5); b.px(rnd(rx),rnd(ry)+1,P.s4); }   // Tropfen von der Dachkante
  for (i=0;i<9;i++){ var cx=10+rg()*212, cy=G+6+rg()*20; b.ellipse(cx,cy,2.5,0.9,function(xx,yy){ return bayer(xx,yy)<0.5?M.UP[b.get(xx,yy)]:undefined; }); }
  M.light(b,M.lf.sum(M.lf.k(-0.15),M.lf.pool(150,80,70,40,0.6,1),M.lf.band(0,24,0.2,0)));
  edgeDark(b,1.9); };

// ================================================================ 3. Die Kiste (ghost, Nachhall): Mai 1993, Vratnik, kein Strom. Ruža schreibt bei einer Kerze am Küchentisch die Nachricht,
//    der Junge steht daneben; neben der Tür zwei volle blaue Kanister mit roter Schrift.
//    In der Luft der Nachhall: das Wort „poginuo“, durchgestrichen, darunter „nije se vratio“.
M.mem.k4_kiste=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1993), FL=96;
  fill(b,0,0,w,FL,function(x,y){ if (y>FL-8) return ra(R('w1 w2'),0.5,x,y); return ra(R('s2 s3 s4 s5'),0.62-y/FL*0.2+(fbm(x,y,12,3)-0.5)*0.12,x,y); });
  b.hl(0,w-1,FL-8,P.w3); fill(b,0,FL,w,h-FL,function(x,y){ return M.tex.boards(x,y,R('w0 w1 w2 w3'),3); }); b.hl(0,w-1,FL,P.w0);
  for (i=0;i<5;i++){ var cx=rg()*w, cy=8+rg()*60; b.ellipse(cx,cy,6+rg()*8,3+rg()*4,function(xx,yy){ return bayer(xx,yy)<0.3?M.DN[b.get(xx,yy)]:undefined; }); }   // Flecken, Feuchtigkeit
  // Fenster mit Plastikfolie: milchig, schräge Falten, mit Latten angenagelt
  var WX0=20, WX1=66, WY0=14, WY1=58; b.rect(WX0-4,WY0-4,WX1-WX0+8,WY1-WY0+8,P.w2);
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ var f=Math.sin(((x-WX0)+(y-WY0)*0.6)*0.35+fbm(x,y,8,9)*3), c=ra(R('s2 s3 s4 s5'),0.5+f*0.16+(1-(y-WY0)/(WY1-WY0))*0.12,x,y); var wr=Math.abs(((x-WX0)*0.8-(y-WY0)+80)%13-6.5); if (wr<0.7) c=P.s2; else if (wr<1.4) c=P.s5; return c; });
  [WY0+1,rnd((WY0+WY1)/2),WY1-2].forEach(function(ly){ b.rect(WX0-2,ly-1,WX1-WX0+4,3,P.w0); b.hl(WX0-2,WX1+1,ly-1,P.w2); }); b.rect(WX0-2,WY0,3,WY1-WY0,P.w0); b.rect(WX1-1,WY0,3,WY1-WY0,P.w0);
  for (i=0;i<6;i++){ b.px(WX0+3+i*8,WY0+1,P.m4); b.px(WX0+3+i*8,WY1-2,P.m4); } b.rect(WX0-6,WY1+3,WX1-WX0+12,3,P.w3); b.hl(WX0-6,WX1+5,WY1+3,P.w4);
  // Kalender, Regal mit Gläsern, Kohleherd mit Glut
  b.rect(80,18,16,20,P.s6); b.rect(80,18,16,6,P.r2); M.microText(b,'MAJ',82,19,P.s6); for (y=26;y<34;y+=2) for (x=82;x<95;x+=3) b.px(x,y,P.s2); M.microText(b,'1993',81,33,P.k2); b.px(88,16,P.k2);
  b.rect(150,24,36,2,P.w3); for (i=0;i<4;i++){ b.rect(153+i*8,18,5,6,i%2?P.e3:P.s4); b.hl(153+i*8,157+i*8,18,P.m3); }
  var DX0=192, DX1=216; b.rect(DX0-3,30,DX1-DX0+6,FL-30,P.w1); b.rect(DX0,33,DX1-DX0,FL-33,P.w2); b.vl(DX0,33,FL-1,P.w3); for (y=40;y<FL-4;y+=18) b.rect(DX0+3,y,DX1-DX0-6,12,P.w1);   // die Tür
  b.rect(DX0+3,62,3,2,P.m3);
  [[172,0],[184,1]].forEach(function(c){ var cx=c[0], cw=11, ch=15, x0=cx-5, y0=FL-ch; canister(b,cx,FL,cw,ch,[P.b1,P.b2,P.b3]); M.microText(b,'VUK',x0+1,y0+5,P.r2); });   // zwei Kanister, blau, rote Schrift, voll
  // Ruža am Tisch, schreibt; der Junge steht daneben, eine Hand auf der Tischkante
  var rz=cRuza(), RX=94, mi=cMali(), MX=150, TX0=100, TX1=142, TY=FL-24;
  b.rect(RX-8,FL-34,2,20,P.w2); b.rect(RX-8,FL-15,12,2,P.w3); b.vl(RX-7,FL-13,FL-1,P.w1); b.vl(RX+2,FL-13,FL-1,P.w1);
  if (!fig(b,RX,FL,S({h:[0,-15],ln:2,nf:[9,0,'f'],ff:[7,0,'f'],sit:1,nh:[14,-25],fh:[12,-24],ho:[1,1]}),'R',rz)){ b.ellipse(RX,FL-38,4,5,P.s3); b.rect(RX-4,FL-32,9,17,P.m2); }
  if (!fig(b,MX,FL+1,S({nh:[-8,-25],fh:[-4,-21],ho:[-1,1]}),'L',mi)){ b.ellipse(MX,FL-40,4,5,P.h2); b.rect(MX-4,FL-34,8,18,P.c2); }
  b.rect(TX0+2,TY+2,3,FL-TY-2,P.w1); b.rect(TX1-5,TY+2,3,FL-TY-2,P.w1); b.rect(TX0,TY,TX1-TX0,2,P.w3);
  fill(b,TX0-1,TY-1,TX1-TX0+2,6,function(x,y){ var u=x-TX0, v=y-TY+1; if (v>=4 && ((u+40)%5)>2) return undefined; return ((u>>1)+(v>>1))%2?P.s5:P.b3; });
  var FX=112, FY=TY-3; b.poly([[FX,FY],[FX+13,FY-1],[FX+14,FY+2],[FX+1,FY+3]],P.s6); b.hl(FX+1,FX+12,FY,P.r3); for (i=0;i<2;i++) b.hl(FX+2,FX+10-i*2,FY+1+i,P.s2);
  b.line(FX+10,FY,FX+13,FY-4,P.k1); b.rect(TX1-8,TY-4,4,4,P.s5); b.hl(TX1-8,TX1-5,TY-4,P.w1);
  var KX=TX0+6, KY=TY-1; b.ellipse(KX+0.5,KY+0.5,4,1.2,P.s5); b.rect(KX-1,KY-5,3,5,P.s6); b.vl(KX+1,KY-5,KY-1,P.s4);                  // Kerze in einer Untertasse
  M.light(b,M.lf.sum(M.lf.k(-1.0),M.lf.pool(44,40,74,64,1.0,0.9),M.lf.pool(KX,KY-10,62,40,1.9,1.0)));
  b.px(KX,KY-6,P.y4); b.px(KX,KY-7,P.l1); b.px(KX,KY-8,P.y5); b.px(KX-1,KY-7,P.y3); b.px(KX+1,KY-7,P.y3);
  // Nachhall in der Luft: dunkler Hof, darin leuchtende Schrift
  function glowText(t,x0,y0,col){ var tw=M.microWidth(t); for (var yy=y0-3;yy<y0+8;yy++) for (var xx=x0-4;xx<x0+tw+4;xx++){ var d=Math.max(Math.abs(xx-(x0+tw/2))/(tw/2+4),Math.abs(yy-(y0+2))/5.5); if (d<1 && bayer(xx,yy)<(1-d)*0.9) b.px(xx,yy,M.DN[M.DN[b.get(xx,yy)]]); } M.microText(b,t,x0,y0,col); }
  glowText('POGINUO',104,38,P.s6); b.hl(102,132,40,P.r4); glowText('NIJE SE VRATIO',92,48,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 4. Die Kurve (ghost, Nachhall): Mai 1992. Im Bus: eine Frau mit Kind auf dem Schoß sieht zurück; draußen ein Mann mit erhobener Hand, die Straße biegt ab
M.mem.k4_kurve=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1992), WX0=10, WX1=170, WY0=6, WY1=64;
  function inPane(x,y){ return x>=WX0&&x<=WX1&&y>=WY0&&y<=WY1 && !(x<WX0+5&&y<WY0+5&&Math.hypot(x-WX0-5,y-WY0-5)>5) && !(x>WX1-5&&y<WY0+5&&Math.hypot(x-WX1+5,y-WY0-5)>5); }
  var o=new M.Buf(w,h,P.k0);
  fill(o,0,0,w,40,function(x,y){ return ra(R('b3 b4 b5 s6'),0.25+y/40+(fbm(x,y*2,20,1)-0.5)*0.2,x,y); });
  var far=function(x){ return rnd(20+6*Math.sin(x*0.025+2)+(fbm(x,0,12,4)-0.5)*6); }, near=function(x){ return rnd(32+9*Math.sin(x*0.035+0.4)+(fbm(x,3,9,5)-0.5)*5); };
  for (x=0;x<w;x++) for (y=far(x);y<44;y++) o.px(x,y,ra(R('g3 e3 g4 e4'),0.5+(y-far(x))/40+(fbm(x,y,5,6)-0.5)*0.3,x,y));
  for (x=0;x<w;x++) for (y=near(x);y<h;y++) o.px(x,y,ra(R('g1 g2 g3 e3'),0.35+(y-near(x))/50+(fbm(x,y,5,7)-0.5)*0.35,x,y));
  [[24,26],[40,29],[132,24],[150,27],[60,38],[118,36],[160,40]].forEach(function(p,k){ var hx=p[0], hy=p[1]; o.rect(hx,hy,7,5,P.s3); o.vl(hx+6,hy,hy+4,P.s2); o.poly([[hx-1,hy],[hx+3,hy-3],[hx+8,hy]],P.t1); o.hl(hx-1,hx+7,hy,P.k2); o.px(hx+2,hy+2,P.k1); o.px(hx+5,hy+2,P.k1); o.vl(hx+3,hy+3,hy+4,P.w1); });   // Häuser mit dunklen Dächern
  // die Straße: von rechts unten hinter dem Bus heraus, dann die Kurve nach links hinter den Hang
  var PTS=[[150,72],[128,60],[104,52],[84,47],[66,44],[56,40],[54,35]];
  for (i=0;i<PTS.length-1;i++){ var a2=PTS[i], c2=PTS[i+1], L=Math.max(1,Math.round(Math.hypot(c2[0]-a2[0],c2[1]-a2[1]))); for (var s=0;s<=L;s++){ var t=s/L, cx=lerp(a2[0],c2[0],t), cy=lerp(a2[1],c2[1],t), hw=1+((cy-34)/38)*9;
      for (var q=-hw;q<=hw;q++){ var X=rnd(cx+q), Y=rnd(cy); var c3=ra(R('m2 m3 s3'),0.55+(hash(X>>1,Y)-0.5)*0.3,X,Y); if (Math.abs(q)<0.6 && (s%5)<2) c3=P.s5; if (Math.abs(q)>hw-0.8) c3=P.e3; o.px(X,Y,c3); } } }
  for (i=0;i<5;i++){ var px=140-i*22, py=56-i*5; for (y=py-12;y<py;y++) o.px(px,y,P.w1); o.hl(px-2,px+2,py-12,P.w1); }                         // Leitungsmasten
  // der Mann an der Kurve, die rechte Hand erhoben
  var ZX=80, ZY=47; person(o,ZX,ZY,20,{dir:1,coat:[P.e1,P.e2,P.e0],trou:[P.m1,P.m2,P.m0],hair:P.h1,step:0});
  limb(o,[ZX+3,ZY-15],[ZX+6,ZY-23],0.9,[P.e2,P.e3,P.e1]); o.px(ZX+6,ZY-24,P.p3); o.px(ZX+7,ZY-25,P.p3);
  for (y=0;y<h;y++) for (x=0;x<w;x++) if (inPane(x,y)) b.px(x,y,o.get(x,y));
  for (y=WY0;y<=WY1;y++) for (x=WX0;x<=WX1;x++){ if (!inPane(x,y)) continue; var s2=(x-WX0)+(y-WY0)*0.8; if ((s2>34&&s2<38)||(s2>100&&s2<103)) mixPx(b,x,y,P.s6,2); if (hash(x,y)<0.01) mixPx(b,x,y,P.e4,4); }
  for (y=0;y<h;y++) for (x=0;x<w;x++){ if (inPane(x,y)) continue; var e=Math.max(WX0-x,x-WX1,WY0-y,y-WY1), nr=(x>=WX0-3&&x<=WX1+3&&y>=WY0-3&&y<=WY1+3);
    b.px(x,y,nr&&e<=1?P.k2:(nr&&e<=3?P.m2:ra(R('k1 k2 m0 m1'),0.45+(fbm(x,y,18,7)-0.5)*0.4,x,y))); }
  b.rect(0,WY1+4,w,5,P.m1); b.hl(0,w-1,WY1+4,P.m3);
  // Sitzlehne rechts: dunkelrotes Kunstleder, weißer Schonbezug
  b.poly([[176,38],[194,33],[220,32],[240,34],[240,104],[172,104]],function(x,y){ return ra(R('k2 r0 r1 r2'),0.45+(x-176)/110+(hash(x>>2,y>>2)-0.5)*0.1-(y-34)/200,x,y); });
  b.poly([[180,37],[198,32],[222,31],[230,40],[202,44],[182,45]],function(x,y){ var f=Math.sin(x*0.7+y*0.3); return ra(R('s3 s4 s5 s6'),0.72+(f>0.6?0.14:0)-(y-31)/50,x,y); });
  // die Frau: Mantel, Schultern; Kopf im verlorenen Profil, zum Fenster nach links gedreht; ihre Hand am Fensterrahmen
  b.poly([[110,104],[114,80],[126,72],[156,70],[172,78],[180,104]],function(x,y){ var u=(x-110)/70; return ra(R('k2 c0 c1 c2'),0.42+u*0.32-(y-70)/90+(hash(x>>2,y>>1)-0.5)*0.08,x,y); });
  b.hl(130,154,72,P.c2); b.rect(140,62,8,10,P.p2); b.vl(140,62,71,P.p1);
  headB(b,144,50,12,14,-1,{skin:[P.p1,P.p2,P.p3,P.p4],hair:[P.h0,P.h1,P.h2,P.h3],lift:0.1});
  for (y=40;y<62;y++){ var hx2=rnd(156-Math.abs(y-50)*0.3); b.px(hx2,y,P.h1); b.px(hx2+1,y,P.h0); }                                      // Haar bis zum Kragen
  limb(b,[120,80],[110,60],2,[P.c1,P.c2,P.c0]); b.ellipse(109,58,2.6,2.2,P.p3); b.hl(107,111,57,P.p4);                                    // Arm, Hand am Rahmen
  // das Kind auf ihrem Schoß: kleiner Kopf an ihrer Brust, Wange zum Betrachter
  headB(b,126,84,7,8,1,{skin:[P.p2,P.p3,P.p4,P.p5],hair:[P.h1,P.h2,P.h3,P.w2],lift:0.25}); b.poly([[116,104],[118,92],[134,90],[138,104]],function(x,y){ return ((x+y)%4<2)?P.r2:P.r3; });
  M.light(b,M.lf.sum(M.lf.k(-0.25),M.lf.pool(80,34,100,48,0.7,1),M.lf.xband(140,232,0,-0.55)));
  edgeDark(b,1.8); };

// ================================================================ 5. Der Bunker (ghost, Nachhall): 1962, Weiterleitungsstelle. Ein Beamter am Tisch, vor ihm ein junger Mann mit Pappkoffer; dahinter die Schlange
M.mem.k4_bunker=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1962), FL=88, LX=176, LY=12;
  fill(b,0,0,w,FL,function(x,y){ var arc=8+Math.pow((x-116)/116,2)*24, c; if (y<arc) c=ra(R('k0 k1 k2 m0'),0.2+y/40,x,y); else c=ra(R('m0 m1 m2 m3'),0.5+(fbm(x,y,10,4)-0.5)*0.3+((y-arc)%9===0?-0.15:0),x,y); return c; });
  for (x=0;x<w;x++){ var ay=rnd(8+Math.pow((x-116)/116,2)*24); b.px(x,ay,P.m2); b.px(x,ay+1,P.m3); }
  b.rect(0,17,w,4,P.m1); b.hl(0,w-1,17,P.m3); b.hl(0,w-1,20,P.k2); for (x=10;x<w;x+=40) b.rect(x,16,3,6,P.m2);
  fill(b,0,FL,w,h-FL,function(x,y){ return ra(R('k1 m0 m1 m2'),0.4+(y-FL)/30+(hash(x>>2,y)-0.5)*0.2,x,y); }); b.hl(0,w-1,FL,P.m3);
  // Schilder (verblasst): über der Schlange WEITERLEITUNGSSTELLE mit Pfeil zum Tisch, über dem Tisch WARTERAUM mit Pfeil zurück
  b.rect(12,28,84,9,P.s4); b.hl(12,95,28,P.s5); M.microText(b,'WEITERLEITUNGSSTELLE',14,30,P.k2); b.hl(98,104,32,P.s4); b.px(103,31,P.s4); b.px(103,33,P.s4);
  b.rect(150,22,38,8,P.s4); M.microText(b,'WARTERAUM',152,23,P.k2); b.hl(144,149,26,P.s4); b.px(145,25,P.s4); b.px(145,27,P.s4);
  b.vl(LX,0,LY-3,P.k2); b.poly([[LX-6,LY],[LX+6,LY],[LX+3,LY-3],[LX-3,LY-3]],P.m2); b.ellipse(LX+0.5,LY+1.5,2,1.6,P.l1);
  // die Schlange: junge Männer mit Koffern, ins Dunkel hinein
  [[18,0.66],[36,0.74],[56,0.82],[78,0.9]].forEach(function(q,k){ var px=q[0], sc=q[1]; person(b,px,FL,rnd(44*sc),{dir:1,coat:[P.m1,P.m2,P.m0],trou:[P.k2,P.m0,P.k1],hair:P.h1,hat:k%2?P.m1:null,reach:1});
    var cw=rnd(10*sc), chh=rnd(7*sc); b.rect(px+4,FL-chh-2,cw,chh,P.e2); b.hl(px+4,px+3+cw,FL-chh-2,P.e3); b.vl(px+4+(cw>>1),FL-chh-2,FL-3,P.w3); });
  // der junge Giuseppe mit dem Pappkoffer an der Schnur
  var pid=cPeppino(), GX=116;
  if (!fig(b,GX,FL+1,S({nh:[5,-17],fh:[-2,-20],ho:[1,0]}),'R',pid)){ person(b,GX,FL+1,46,{dir:1,coat:[P.e1,P.e2,P.e0],hair:P.h2,hat:P.n1}); }
  var CX=GX+2, CY=FL-3; b.rect(CX-1,CY-11,17,11,P.e3); b.hl(CX-1,CX+15,CY-11,P.e4); b.vl(CX+15,CY-10,CY-1,P.e1); b.hl(CX-1,CX+15,CY-1,P.e1); b.vl(CX-1,CY-10,CY-1,P.e4);
  b.vl(CX+4,CY-11,CY-1,P.w4); b.vl(CX+10,CY-11,CY-1,P.w4); b.hl(CX-1,CX+15,CY-6,P.w4); b.rect(CX+5,CY-14,5,3,P.w2); b.px(CX+7,CY-13,P.k1);
  // der Tisch, der Beamte im Profil (Blick zu Giuseppe): graue Jacke, Brille, Füller über dem Buch, der Stempel daneben
  var TX0=140, TX1=214, TY=FL-24, BX=192;
  b.poly([[BX-6,TY],[BX-5,TY-20],[BX-2,TY-24],[BX+8,TY-24],[BX+11,TY-20],[BX+11,TY]],function(xx,yy){ return xx<BX-2?P.m3:(xx>BX+7?P.m1:P.m2); });   // Jacke
  b.rect(BX-4,TY-24,4,7,P.s5); b.vl(BX-3,TY-22,TY-15,P.r1); b.rect(BX-1,TY-27,5,3,P.p2);                                              // Kragen, Krawatte, Hals
  b.ellipse(BX+1.5,TY-32,5.6,6.2,P.p3); b.ellipse(BX+3,TY-36,5,3.4,P.m4); b.vl(BX+7,TY-36,TY-31,P.m3); b.px(BX-5,TY-32,P.p3); b.px(BX-5,TY-31,P.p3); b.px(BX-4,TY-30,P.p2);   // Kopf, Haar, Nase
  b.hl(BX-4,BX+1,TY-33,P.k1); b.rect(BX-4,TY-34,3,2,P.k1); b.px(BX-3,TY-33,P.s6); b.px(BX+4,TY-32,P.p2); b.px(BX+5,TY-31,P.p2); b.hl(BX-3,BX-1,TY-28,P.p1);   // Brille, Ohr, Mund
  limb(b,[BX-2,TY-16],[BX-14,TY-4],1.4,[P.m2,P.m3,P.m1]); b.ellipse(BX-15,TY-4,1.6,1.4,P.p3); b.line(BX-16,TY-5,BX-20,TY-8,P.k1);
  b.rect(BX-6,TY-6,2,6,P.w1);                                                                                                 // Stuhllehne
  b.rect(TX0,TY,TX1-TX0,3,P.w3); b.hl(TX0,TX1-1,TY,P.w4); b.rect(TX0+2,TY+3,TX1-TX0-4,FL-TY-3,P.w1); b.hl(TX0+2,TX1-3,TY+3,P.w0);
  b.rect(TX0+12,TY-2,20,2,P.s5); b.hl(TX0+12,TX0+31,TY-2,P.s6); b.vl(TX0+22,TY-2,TY-1,P.s3); for (i=0;i<3;i++) b.hl(TX0+14,TX0+20,TY-2,P.m3);   // das Buch
  b.rect(TX0+2,TY-2,7,2,P.k2); b.rect(TX0+4,TY-6,3,4,P.w2); b.rect(TX0+3,TY-1,5,1,P.k1);                                       // Stempel und Kissen
  M.light(b,M.lf.sum(M.lf.k(-1.4),M.lf.pool(LX-20,LY+40,110,74,2.2,1.0),M.lf.pool(LX,LY+4,14,10,1.5,1)));
  b.ellipse(LX+0.5,LY+1.5,2,1.6,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 6. Der Neunzehnte April (memory, Markos Erinnerung): Frühling 1993. Eine Schlange vor der Mauer, Menschen mit Kanistern;
//    vorn zwei blaue Kanister mit roter Schrift „VUKOVIĆ“. Der Moment davor: niemand ist verletzt, keine Waffen, nur Warten in der Sonne.
M.mem.k4_april=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(419), WT=22, FL=72;
  fill(b,0,0,w,WT,function(x,y){ return ra(R('b3 b4 b5 s6'),0.4+y/34+(fbm(x,y*2,26,2)-0.5)*0.2,x,y); });
  for (i=0;i<4;i++){ var cx=rg()*w, cy=3+rg()*10; b.ellipse(cx,cy,14+rg()*16,2.2,function(xx,yy){ return bayer(xx,yy)<0.6?P.s6:P.b5; }); }
  // die Mauer: heller Putz, darunter stellenweise Ziegel; ein Eisentor; rechts das Rohr mit den Hähnen
  fill(b,0,WT,w,FL-WT,function(x,y){ var f=fbm(x,y,14,3), c; if (x<34) return (y<54)?ra(R('b4 b5 s6'),0.5+(y-WT)/60,x,y):((y<58)?P.s3:(y<62?P.s4:ra(R('s2 s3'),0.5,x,y))); if (f>0.7 && y>WT+6) c=M.tex.bricks(x,y,R('t2 t3 t3 t4'),9,4); else c=ra(R('s3 s4 s4 s5'),0.58+(f-0.5)*0.4+(hash(x>>2,y>>1)-0.5)*0.06,x,y); if (y>FL-6) c=M.DN[c]; return c; });
  for (x=0;x<34;x+=4){ b.vl(x,54,57,P.s5); } for (i=0;i<5;i++){ var bx2=3+i*6; b.rect(bx2,47,2,7,[P.c1,P.e1,P.m1,P.g1,P.r1][i]); b.px(bx2,46,P.p3); }   // die Brücke, die Schlange geht weiter
  b.vl(34,WT,FL,P.s2); b.vl(35,WT,FL,P.s5);
  b.rect(0,WT,w,3,P.s5); b.hl(0,w-1,WT,P.s6); b.hl(0,w-1,WT+3,P.s2);
  for (y=34;y<FL;y++) for (x=56;x<74;x++){ var c4=((x-56)%4===0||(y-34)%8===0)?P.k2:P.t1; b.px(x,y,c4); } b.hl(55,74,33,P.m2);   // Eisentor, rostig
  var PX=206; b.rect(PX,38,4,FL-38,P.m2); b.vl(PX,38,FL-1,P.m3); b.rect(PX-14,46,18,3,P.m2); b.hl(PX-14,PX+3,46,P.m3); b.rect(PX-14,49,2,4,P.m1); b.px(PX-14,54,P.b3); b.rect(PX-6,49,2,3,P.m1);
  // ein blühender Obstbaum links
  for (y=34;y<FL;y++){ b.px(22,y,P.w1); b.px(23,y,P.w0); } b.line(22,44,10,30,P.w1); b.line(23,40,36,28,P.w1); b.line(22,50,32,40,P.w1); b.line(22,38,20,24,P.w1);
  for (i=0;i<520;i++){ var bx=22+(rg()-0.5)*50, by=28+(rg()-0.5)*28; if (Math.hypot((bx-22)/25,(by-28)/14)>1) continue; var bc=rg()<0.7?(rg()<0.55?P.s6:P.s5):(rg()<0.5?P.g4:P.d5); b.px(rnd(bx),rnd(by),bc); if (rg()<0.3) b.px(rnd(bx)+1,rnd(by),bc); }
  fill(b,0,FL,w,h-FL,function(x,y){ return M.tex.cobble(x,y,R('s2 s3 s3 s4'),7); }); b.hl(0,w-1,FL,P.s2);
  // die Schlange: vom Hahn nach links; Menschen in Frühlingsjacken, jeder mit Kanistern; zwei sitzen auf ihren, zwei reden miteinander
  var CANS=[[P.e1,P.e2,P.e3],[P.g1,P.g2,P.g3],[P.m2,P.m3,P.m4],[P.s2,P.s3,P.s4],[P.r1,P.r2,P.r3]];
  var Q=[[192,'komsija','L',3],[176,'kioskm','R',0],[160,'taxist','R',1],[143,'kasir','L',0],[128,'milka','R',0],[112,'ilija','R',2],[94,'haendler','R',0],[78,'jakob','R',1],[44,'kioskm','L',0]];
  Q.forEach(function(q,k){ var px=q[0], id=q[1], f=q[2], mode=q[3], dir=f==='R'?1:-1;
    for (var sx=0;sx<16;sx++) for (var sy=0;sy<2;sy++) if (bayer(px+sx,FL+1+sy)<0.55) b.px(px+sx,FL+1+sy,M.DN[b.get(px+sx,FL+1+sy)]);   // Schatten nach rechts
    if (mode===1){ canister(b,px,FL+1,9,11,CANS[k%5]); if (!fig(b,px,FL-9,S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1}),f,id)) person(b,px,FL-10,28,{dir:dir,coat:[P.c1,P.c2,P.c0]}); canister(b,px+dir*12,FL+1,7,9,CANS[(k+1)%5],{cap:P.k2}); return; }
    if (mode===3){ if (!fig(b,px,FL+1,S({nh:[4,-38],fh:[-1,-14],ho:[1,0]}),f,id)) person(b,px,FL+1,40,{dir:dir,coat:[P.c1,P.c2,P.c0]}); canister(b,px+8,FL+1,7,10,CANS[1],{cap:P.k2}); return; }   // vorn: er dreht sich um und hebt die Hand
    if (!fig(b,px,FL+1,S({nh:[3,-13],fh:[-1,-14],ho:[mode===2?1:0,0]}),f,id)) person(b,px,FL+1,40,{dir:dir,coat:[P.c1,P.c2,P.c0],reach:1});
    canister(b,px+dir*4,FL+1,7,10,CANS[k%5],{cap:P.k2}); if (k%3===0) canister(b,px-dir*8,FL+1,8,10,CANS[(k+2)%5],{cap:P.k2}); });
  // ein Kinderwagen ohne Kind, voller Kanister; Flaschen am Boden
  var KWX=60; b.ellipse(KWX+0.5,FL-12,8,5,P.k2); b.rect(KWX-8,FL-12,17,5,P.m1); b.hl(KWX-8,KWX+8,FL-12,P.m2); b.line(KWX+8,FL-12,KWX+14,FL-20,P.m2); b.hl(KWX+13,KWX+16,FL-20,P.m2);
  [KWX-6,KWX+6].forEach(function(wx){ b.ellipse(wx+0.5,FL-2.5,2.6,2.6,P.k1); b.px(wx,FL-3,P.m3); }); canister(b,KWX-3,FL-14,6,7,CANS[2],{cap:P.k2}); canister(b,KWX+3,FL-14,6,7,CANS[0],{cap:P.k2});
  [[84,0],[150,1],[170,0]].forEach(function(bt){ var bx3=bt[0]; b.rect(bx3,FL-6,2,6,bt[1]?P.g3:P.s4); b.px(bx3,FL-7,P.s5); b.px(bx3,FL-4,P.s6); });
  // vorn: die zwei blauen Kanister, groß, in der Sonne; die rote Schrift
  [[70,101],[108,103]].forEach(function(c,k){ var cx=c[0], cy=c[1], cw=34, ch=27, x0=cx-cw/2, y0=cy-ch;
    for (y=cy+1;y<cy+4;y++) for (x=x0+4;x<x0+cw+16;x++) if (bayer(x,y)<0.6) b.px(x,y,M.DN[M.DN[b.get(x,y)]]);
    for (y=y0;y<cy;y++) for (x=x0;x<x0+cw;x++){ var u=(x-x0)/cw, v=(y-y0)/ch, c2=P.b3; if (u<0.12) c2=P.b5; else if (u<0.28) c2=P.b4; else if (u>0.86) c2=P.b2; if (v>0.94) c2=P.b1; if (y===y0) c2=P.b5;
      if ((u<0.04||u>0.96) && (v<0.06||v>0.94)) continue; if ((y-y0)%7===6 && u>0.08 && u<0.92) c2=M.DN[c2]; b.px(x,y,c2); }
    b.rect(x0+4,y0-4,13,4,P.b3); b.hl(x0+4,x0+16,y0-4,P.b5); b.rect(x0+6,y0-3,9,2,P.k1);
    b.rect(x0+cw-8,y0-5,5,5,P.r2); b.hl(x0+cw-8,x0+cw-4,y0-5,P.r3);
    var tx=x0+3, ty=y0+10; M.microText(b,'VUKOVIĆ',tx+1,ty+1,P.b1); M.microText(b,'VUKOVIĆ',tx,ty,P.r1); });
  M.light(b,M.lf.sum(M.lf.k(0.08),M.lf.xband(0,w,0.25,-0.1),M.lf.band(72,104,0,-0.05)));
  edgeDark(b,1.6); };

// ================================================================ 7. Am Depot (ghost): die junge Gerda bei Nacht am Depottor, die Thermoskanne in beiden Händen; die Neunzehn fährt ein
M.mem.k4_depot=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(1954), FL=82, LMX=56, LMY=26;
  fill(b,0,0,w,FL,function(x,y){ return ra(R('k0 k1 n0 n1'),0.12+y/90+(fbm(x,y*2,22,3)-0.5)*0.2,x,y); });
  var DX0=0, DX1=146, DT=12;
  for (y=DT;y<FL;y++) for (x=DX0;x<DX1;x++){ var c=M.tex.bricks(x,y,R('t0 t1 t2 t3'),8,4); if (y<DT+3) c=P.t2; if (x>DX1-3) c=M.DN[c]; b.px(x,y,c); }
  function arcY(x,gc,gr,gt){ var u=(x-gc)/gr; if (Math.abs(u)>1) return null; return rnd(gt-Math.sqrt(1-u*u)*gr*0.6); }
  [[20,60,0],[78,128,1]].forEach(function(g){ var gx0=g[0], gx1=g[1], gc=(gx0+gx1)/2, gr=(gx1-gx0)/2, gt=38, open=g[2];
    for (y=Math.floor(gt-gr*0.6);y<FL;y++) for (x=gx0;x<gx1;x++){ var dy=y-gt; if (!(dy>=0 || Math.hypot((x-gc)/gr,dy/(gr*0.6))<1)) continue;
      var c2=open?ra(R('k0 k1 k2'),0.3+(hash(x>>1,y>>1)-0.5)*0.3,x,y):(((x-gx0)%5===0)?P.w0:P.w1); b.px(x,y,c2); }
    for (x=gx0-2;x<gx1+2;x++){ var ay=arcY(x,gc,gr,gt); if (ay!==null){ b.px(x,ay-1,P.s3); b.px(x,ay-2,P.t3); } } });
  b.px(100,58,P.y4); b.px(101,58,P.y3); for (y=59;y<FL;y++) if (bayer(100,y)<0.3) b.px(100,y,P.w1);
  b.rect(LMX-4,LMY-2,9,3,P.m1); b.hl(LMX-3,LMX+3,LMY+1,P.y5); b.vl(LMX,LMY-6,LMY-3,P.m1);
  fill(b,0,FL,w,h-FL,function(x,y){ return ra(R('n2 n3 s3 s4'),0.4+(y-FL)/40+(fbm(x*0.3,y,8,6)-0.5)*0.3,x,y); }); b.hl(0,w-1,FL,P.s4);
  for (i=0;i<2;i++){ for (x=92;x<w;x++){ var t=(x-92)/(w-92), ry=rnd(FL+1+t*t*16+i*(2+t*7)); b.px(x,ry,P.m3); b.px(x,ry+1,P.k2); } }
  b.rect(6,FL-10,20,2,P.w2); b.hl(6,25,FL-10,P.w3); b.vl(8,FL-8,FL,P.k2); b.vl(23,FL-8,FL,P.k2); b.hl(6,25,FL-11,P.s5);       // Bank am Tor, Schnee darauf
  // die Neunzehn: Seitenansicht, Stirn links mit Fenstern und Scheinwerfer, unten blau, oben ein weißes Band; Stromabnehmer
  var TX=168, TT=38, TB=FL+8;
  b.poly([[TX,TT+6],[TX+4,TT+1],[TX+10,TT],[w+10,TT],[w+10,TB],[TX+1,TB]],function(xx,yy){ var c=(yy<TT+16)?P.s5:P.b1; if (yy>=TT+16&&yy<TT+18) c=P.s6; if (yy<TT+2) c=P.m3; if (yy>TB-4) c=P.b0; if (xx<TX+4) c=M.DN[c]; return c; });
  for (x=TX+14;x<w;x+=11){ b.rect(x,TT+4,8,9,P.y3); b.hl(x,x+7,TT+4,P.y4); b.vl(x+7,TT+5,TT+12,P.y2); }
  b.rect(TX+3,TT+4,8,9,P.y2); b.vl(TX+7,TT+4,TT+12,P.m1); b.rect(TX+4,TT-5,9,5,P.k1); M.microText(b,'19',TX+5,TT-5,P.y4);
  b.ellipse(TX+10,TT+9,1.8,2,P.p3); b.rect(TX+8,TT+6,5,2,P.n1); b.px(TX+8,TT+8,P.n1); b.rect(TX+9,TT+11,4,2,P.n1); b.vl(TX+6,TT+5,TT+9,P.p3); b.px(TX+5,TT+5,P.p4);   // der junge Fahrer winkt
  b.line(TX+26,TT,TX+38,TT-16,P.k1); b.hl(TX+33,TX+43,TT-16,P.k1); b.vl(TX+44,TT-17,TT-16,P.k2);
  b.ellipse(TX+5,TB-7,2,2,P.l1); for (i=0;i<30;i++) for (var j=-1-Math.floor(i/6);j<=1+Math.floor(i/6);j++) if (bayer(TX+3-i,TB-7+j)<0.75-i*0.023) mixPx(b,TX+3-i,TB-7+j,P.s6,4);
  // Gerda, jung: Kopftuch, Mantel, die grüne Kanne in beiden Händen, im Licht der Lampe
  var gid=cGerda(), GX=56;
  if (!fig(b,GX,FL+1,S({nh:[4,-21],fh:[3,-20],ho:[1,0]}),'R',gid)){ person(b,GX,FL+1,44,{dir:1,coat:[P.w2,P.w3,P.w1],hair:P.h2,hat:P.b1,long:true}); }
  var KX=GX+4, KY=FL-17; b.rect(KX-1,KY-10,5,10,P.g3); b.vl(KX-1,KY-10,KY-1,P.g4); b.vl(KX+3,KY-9,KY-1,P.g2); b.rect(KX-1,KY-12,5,2,P.g2); b.hl(KX-1,KX+3,KY-12,P.g4);
  for (i=0;i<90;i++){ var sx=rg()*w, sy=rg()*h, lit=Math.hypot(sx-LMX,(sy-LMY-20)*0.7)<46; if (lit||rg()<0.3) b.px(rnd(sx),rnd(sy),lit?P.s6:P.s4); }
  M.light(b,M.lf.sum(M.lf.k(-0.7),M.lf.pool(LMX,LMY+40,46,52,1.5,1),M.lf.pool(TX-10,TB-7,40,14,1.0,1)));
  b.hl(LMX-3,LMX+3,LMY+1,P.y5); b.ellipse(TX+5,TB-7,2,2,P.l1);
  edgeDark(b,1.9); };

// ================================================================ 8. Neujahr (memory, letztes Bild): Jasnas Küche in der Morgensonne. Drei Tassen, die Džezva, Vanilice, die offene Kiste;
//    unter dem Tisch, in einem Sonnenfleck, Zorans Pantoffeln an Markos Füßen. An der Wand der neue Kalender.
M.mem.k4_home=function(b){ var w=b.w,h=b.h, x, y, i, rg=M.rng(2012), WB=58, WX0=10, WX1=56, WY0=6, WY1=44;
  fill(b,0,0,w,WB,function(x,y){ if (y>WB-5) return ra(R('w1 w2'),0.5,x,y); return ra(R('s3 s4 s5 y5'),0.5-y/WB*0.16+(fbm(x,y,14,2)-0.5)*0.1,x,y); });
  b.hl(0,w-1,WB-5,P.w3); fill(b,0,WB,w,h-WB,function(x,y){ var d=(y-WB)/(h-WB), u=(x-116)/(0.6+d*0.8); return ((Math.floor(u/12)+Math.floor((y-WB)/(4+d*6)))%2)?P.s4:P.s3; });
  // Fenster: Sonne, Dächer mit Schnee; auf dem Brett Anas kleiner Tannenbaum mit Lichterkette
  fill(b,WX0,WY0,WX1-WX0,WY1-WY0,function(x,y){ return ra(R('b3 b4 b5 s6'),0.3+(y-WY0)/40,x,y); });
  for (x=WX0;x<WX1;x++){ var ry=WY0+22+((x>>3)%2)*4; for (y=ry;y<WY1;y++) b.px(x,y,y<ry+2?P.s6:((x+y)%5===0?P.k2:P.t2)); }
  b.ellipse(WX0+11,WY0+8,4,4,P.l1); b.ellipse(WX0+11,WY0+8,7,7,function(xx,yy){ return bayer(xx,yy)<0.4?P.l0:undefined; });
  b.rect(WX0-3,WY0-3,WX1-WX0+6,3,P.s6); b.rect(WX0-4,WY1,WX1-WX0+8,3,P.s5); b.rect(WX0-3,WY0,3,WY1-WY0,P.s6); b.rect(WX1,WY0,3,WY1-WY0,P.s5); b.rect(rnd((WX0+WX1)/2)-1,WY0,2,WY1-WY0,P.s5);
  var TRX=WX1-9; for (y=WY1-14;y<WY1;y++){ var tw=rnd((y-(WY1-14))*0.36)+1; b.hl(TRX-tw,TRX+tw,y,((y+TRX)%3)?P.g2:P.g3); } b.rect(TRX-2,WY1-1,5,2,P.t3); b.px(TRX,WY1-15,P.y4);
  for (i=0;i<6;i++) b.px(TRX-4+Math.floor(rg()*9),WY1-12+Math.floor(rg()*10),P.y4);
  // der neue Kalender an der Wand
  b.rect(186,8,20,24,P.s6); b.rect(186,8,20,7,P.r2); M.microText(b,'2012',188,9,P.s6); for (y=18;y<30;y+=3) for (x=188;x<204;x+=3) b.px(x,y,P.s2); b.rect(188,17,2,2,P.r3); b.px(196,6,P.k2);
  // der Tisch: Platte in leichter Aufsicht, Wachstuch mit Blumen, vorn überhängend
  var TB=58, TF=74, TX0=34, TX1=236;
  b.rect(TX0+8,TF+4,5,98-TF-4,P.w1); b.rect(TX1-18,TF+4,5,98-TF-4,P.w1);
  for (y=TB;y<TF+4;y++){ var t=(y-TB)/(TF-TB), xa=rnd(lerp(TX0+10,TX0,Math.min(1,t))), xb=rnd(lerp(TX1-6,TX1,Math.min(1,t))); for (x=xa;x<=xb;x++){ var c=(y<TF)?P.s5:(y===TF+3?P.s3:P.s4); if (y>=TF && ((x+40)%8)>5 && y===TF+3) continue;
      if (y<TF){ c=(((x>>2)+((y-TB)>>1))%2)?P.b3:P.b4; if (((x>>2)*3+((y-TB)>>1)*5)%17===0) c=P.r3; if (y===TB) c=P.s5; } else c=(y===TF+3)?P.b1:P.b2; b.px(x,y,c); } }
  [[96,WB-14],[150,WB-16]].forEach(function(c){ b.rect(c[0],c[1],18,3,P.w3); b.hl(c[0],c[0]+17,c[1],P.w4); b.rect(c[0],c[1]+3,2,TB-c[1]-3,P.w2); b.rect(c[0]+16,c[1]+3,2,TB-c[1]-3,P.w2); b.hl(c[0]+2,c[0]+15,c[1]+7,P.w2); });   // Stuhllehnen
  b.vl(132,0,14,P.k2); b.poly([[124,20],[140,20],[136,14],[128,14]],P.s5); b.hl(124,140,20,P.s3); b.hl(128,136,14,P.s6);           // Hängelampe
  // drei Tassen auf Untertassen, in einer der Löffel
  [[104,69],[132,64],[158,70]].forEach(function(c,k){ var cx=c[0], cy=c[1];
    b.ellipse(cx+0.5,cy+0.5,8,2,P.s6); b.hl(cx-7,cx+7,cy+2,P.s3);
    for (y=cy-10;y<cy;y++){ var hw=4-(y>cy-2?1:0); for (x=cx-hw;x<=cx+hw;x++) b.px(x,y,(x<cx-2)?P.s6:(x>cx+2?P.s4:P.s5)); }
    b.hl(cx-4,cx+4,cy-10,P.w1); b.hl(cx-3,cx+3,cy-10,P.w0); b.px(cx-2,cy-10,P.w2); for (y=cy-8;y<cy-3;y++) b.px(cx+5+(y>cy-7&&y<cy-4?1:0),y,P.s5);
    if (k===1){ b.line(cx+1,cy-14,cx+3,cy-9,P.m4); b.px(cx+1,cy-15,P.m4); } });
  // die Džezva: Kupfer, bauchig, langer Holzstiel
  var DX=184, DY=67, DW=[7,6,6,7,9,10,11,11,10,9]; for (i=0;i<DW.length;i++){ var ww=DW[i]; for (x=0;x<ww;x++){ var u=x/(ww-1); b.px(rnd(DX-ww/2+x),DY-DW.length+i,u<0.25?P.t5:(u<0.55?P.t4:(u<0.82?P.t3:P.t2))); } }
  b.hl(DX-4,DX+3,DY-10,P.t5); b.px(DX-5,DY-10,P.t4); for (i=0;i<12;i++) b.px(DX+5+i,DY-6-Math.floor(i/3),i>8?P.k2:P.w2); b.ellipse(DX,DY+1,6,1.4,P.s4);
  // ein Teller Vanilice mit Puderzucker
  b.ellipse(74,69,11,2.6,P.s6); b.hl(64,84,71,P.s4); [[68,67],[73,66],[79,67],[71,68],[77,68],[82,68]].forEach(function(p){ b.ellipse(p[0],p[1],2.3,1.1,P.y4); b.px(p[0]-1,p[1]-1,P.s6); b.px(p[0]+1,p[1],P.y3); });
  // die offene Kiste, ein gefaltetes Blatt mit rotem Kopfstreifen
  var KX=204, KY=66; b.rect(KX,KY-8,24,8,P.w3); b.hl(KX,KX+23,KY-8,P.w4); b.vl(KX+23,KY-7,KY-1,P.w1); b.hl(KX,KX+23,KY,P.w1);
  b.poly([[KX,KY-8],[KX+24,KY-8],[KX+26,KY-24],[KX+2,KY-24]],function(xx,yy){ return (yy<KY-22)?P.w4:((xx<KX+5)?P.w2:P.w3); }); b.hl(KX+3,KX+24,KY-20,P.w2);
  b.rect(KX+3,KY-11,11,4,P.s6); b.hl(KX+3,KX+13,KY-11,P.r3); b.rect(KX+13,KY-10,8,3,P.s5);
  // Markos Beine unter dem Tisch: Jeans bis zu den Pantoffeln
  [[112,78],[132,79]].forEach(function(l){ for (y=l[1];y<l[1]+18;y++){ var lx=l[0]+rnd((y-l[1])*0.28); b.hl(lx-3,lx+3,y,(y%5===0)?P.c1:P.c2); b.px(lx-3,y,P.c3); b.px(lx+3,y,P.c0); } });
  // die Pantoffeln an seinen Füßen, in der Sonne
  [[120,98],[140,99]].forEach(function(s2){ var sx=s2[0], sy=s2[1];
    b.ellipse(sx,sy,10,3.4,P.k2); b.ellipse(sx,sy-0.8,9,2.8,P.w1);                                                                 // Sohle, Innenseite
    b.ellipse(sx+3,sy-1.4,6,2.6,function(xx,yy){ return ((xx+yy)%3===0)?P.w1:(((xx>>1)+(yy>>1))%2?P.w2:P.r1); }); b.hl(sx-2,sx+8,sy-4,P.w3); b.hl(sx-3,sx-3,sy-3,P.w2); });
  // Licht: schräge Sonnenstrahlen aus dem Fenster über Tisch und Boden
  var sun=function(x,y){ var u=x-(y-WY0)*1.05-WX0+2; return u>0 && u<WX1-WX0+12 && y>WY0+4; };
  M.light(b,function(x,y){ var v=-0.32; if (sun(x,y)) v+=0.6; var d=Math.hypot((x-110)/150,(y-74)/60); v+=Math.max(0,0.32-d*0.32); return v; });
  edgeDark(b,1.6); };
})(M);
