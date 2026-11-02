/* ===== 93_mem.js — Erinnerungsbilder („Nachhall“): 232 × 104 Pixel, werden danach geisterhaft (blau) oder als Erinnerung (sepia) gefärbt =====
   Gemalt mit dem Malkasten und mit den echten Figuren aus dem Rig, damit die Erinnerung dieselben Menschen zeigt wie das Spiel. */
(function(M){
'use strict';
var P=M.P, hash=M.hash, bayer=M.bayer, A=M.ANIMS;
M.mem=M.mem||{};
function fill(b,x0,y0,w,h,fn){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c=fn(x,y); if (c!==undefined) b.px(x,y,c); } }
function fig(b,x,y,pose,face,id,opt){ try{ M.drawPose(b,x,y,pose,face,id,opt||{}); }catch(e){ console.error(e); } }
function gull(b,x,y,c){ b.px(x-2,y-1,c); b.px(x-1,y,c); b.px(x,y,c); b.px(x+1,y,c); b.px(x+2,y-1,c); }
function edgeDark(b,amt){ M.light(b,M.lf.vignette(b.w,b.h,amt||2.4)); }

// ---------------------------------------------------------------- Fall 1: der Poller an der Mole – Ivka wartet, Jahr um Jahr
M.mem.pier=function(b){ var w=b.w,h=b.h,hz=54;
  M.sky(b,0,0,w,hz,'dusk',23);
  b.ellipse(186,hz-2,8,8,function(x,y){ return y<hz?(bayer(x,y)<0.55?P.l0:P.d6):undefined; });
  M.islands(b,0,w,hz,'dusk',4,{amp:4});
  M.sea(b,0,hz,w,h-hz,'dusk',0.3,0); M.glints(b,186,hz,h,30,0.7,P.d6,0);
  // die Mole: Oberseite (perspektivisch) und Kante aus Quadern
  for (var y=72;y<92;y++) for (var x=0;x<164-Math.max(0,y-80)*0;x++){ var c;
    if (y<79){ c=M.rampAt(M.R('s1 s2 s3 d4'),(y-72)/7*0.7+0.2,x,y); if (hash(x>>3,y)<0.05) c=M.DN[c]; }
    else c=M.tex.ashlar(x,y-79,M.R('k2 s0 s1 s2'),15,5);
    if (x>156 && y<79 && x-156>(y-72)) continue; b.px(x,y,c); }
  b.hl(0,156,72,P.d5); b.hl(0,163,79,P.d4); for (y=79;y<92;y++) b.px(163,y,P.k2);
  for (y=92;y<h;y++) for (x=0;x<166;x++) if (bayer(x,y)<0.55-(y-92)*0.03) b.px(x,y,(y&1)?P.d1:P.k1);
  M.prop.bollard(b,134,79); M.prop.lamp(b,150,79,32,true);
  M.light(b,M.lf.pool(150,47,26,22,2,0.8));
  // dieselbe Frau, viele Jahre übereinander: blasse Echos, eine deutliche Gestalt
  fig(b,96,79,A.idleS[0][0],'R','ivka',{alpha:0.25}); fig(b,108,79,A.waitS[0][0],'R','ivka',{alpha:0.45});
  fig(b,120,79,A.waitS[0][0],'R','ivka');
  // ein Schirm, den der Wind davonträgt
  var ux=56,uy=20; b.ellipse(ux,uy,8,3,function(x,yy){ return yy<=uy?P.k2:undefined; }); b.hl(ux-8,ux+8,uy,P.k1); b.line(ux,uy,ux+4,uy+7,P.k1); b.px(ux+5,uy+7,P.k1); b.px(ux+5,uy+6,P.k1);
  b.line(ux-8,uy,ux,uy+1,P.k1); b.line(ux+8,uy,ux,uy+1,P.k1);
  gull(b,26,14,P.k2); gull(b,38,9,P.k2); gull(b,210,26,P.d1);
  edgeDark(b,2.2); };

// ---------------------------------------------------------------- Fall 1: der Seesack – zwei Jungen am umgedrehten Kiel, Bura
M.mem.storm=function(b){ var w=b.w,h=b.h,r=M.rng(7);
  // Himmel: oben schwarz, zum Horizont hin mondheller Dunst, damit Rumpf und Köpfe sich abheben
  M.vgrad(b,0,0,w,64,M.R('k0 k1 k2 n0 n1 n2 n3'));
  for (var i=0;i<12;i++){ var cx=r()*w, cy=4+r()*26, rx=18+r()*34, ry=1.5+r()*2.2; b.ellipse(cx,cy,rx,ry,function(x,y){ return bayer(x,y)<0.45?P.n1:P.k2; }); }
  for (i=0;i<40;i++) b.px(Math.floor(r()*w),Math.floor(r()*30),r()<0.3?P.n4:P.n2);
  b.ellipse(200,14,10,10,function(x,y){ return bayer(x,y)<0.3?P.n3:undefined; }); b.ellipse(200,14,5,5,P.n5); b.px(199,13,P.l1);
  // hintere Wellen, dunkel, tief unten
  var SEA=M.R('n1 n0 a1 a0 k0'), crest=function(x){ return 62+Math.sin(x*0.045+0.8)*5+Math.sin(x*0.13+2)*2+Math.sin(x*0.31)*0.9; };
  for (var x=0;x<w;x++){ var cy2=Math.round(crest(x)); for (var y=cy2;y<h;y++){ var d=y-cy2, c=M.rampAt(SEA,Math.min(1,d/36),x,y); if (d<1) c=P.n4; else if (d<2 && bayer(x,y)<0.5) c=P.n3; b.px(x,y,c); } }
  for (y=62;y<h;y++){ var k2=(y-62)/(h-62); for (x=186;x<214;x++){ if (Math.abs(x-200)<4+k2*12 && Math.sin(x*0.9+y*2.1)>0.55) b.px(x,y,P.n4); } } // Mondspur
  // der Rumpf, kieloben, als Silhouette mit Mondkante
  var hx0=72,hx1=176,hc=(hx0+hx1)/2,hr=(hx1-hx0)/2, base=72;
  for (x=hx0;x<=hx1;x++){ var q=(x-hc)/hr, top=Math.round(base-17*Math.sqrt(Math.max(0,1-q*q))); for (y=top;y<base;y++){ var cc=(y-top)%5===4?P.k1:P.k2; if (y-top<1) cc=P.n4; else if (y-top<2 && x>hc) cc=P.n3; b.px(x,y,cc); } }
  b.hl(hx0+8,hx1-8,base-18,P.n5); b.hl(hx0+12,hx1-12,base-19,P.k1); b.hl(hx0+14,hx1-14,base-19,P.n4);
  // zwei Jungen: Köpfe, Schultern, Arme über dem Kiel
  function boy(x,y,face,arms,lit){ var f=face==='R'?1:-1; b.ellipse(x,y+8,7,5,P.k1); b.ellipse(x,y,4,4.5,P.k1); b.ellipse(x+f,y+1,3,3.5,P.p1); b.hl(x-4,x+4,y-4,P.k1); b.hl(x-3,x+3,y-3,P.k2);
    if (lit){ for (var yy=y-3;yy<y+4;yy++) b.px(x+4*f,yy,P.n4); b.px(x+5*f,y+6,P.n4); b.px(x+6*f,y+7,P.n4); } else { b.px(x-4*f,y,P.n3); b.px(x-4*f,y+1,P.n3); }
    arms.forEach(function(a){ b.line(x+a[0],y+6,a[1],a[2],P.k1); b.line(x+a[0],y+7,a[1],a[2]+1,P.k1); b.px(a[1],a[2],P.p2); b.px(a[1]+1,a[2],P.p1); }); }
  boy(106,48,'R',[[-5,100,base-18],[5,120,48]],false);
  boy(146,46,'L',[[5,154,base-18],[-5,134,49]],true);
  // der Seesack zwischen ihnen, das Hellste im Bild
  b.ellipse(127,48,8,5,P.e2); b.ellipse(127,47,7,3,P.e3); b.hl(121,133,45,P.e4); b.vl(127,43,52,P.e1); b.line(122,44,119,41,P.e2); b.line(132,44,135,41,P.e2);
  // vordere Welle über den Körpern
  var c2=function(x){ return 70+Math.sin(x*0.052+2.2)*3+Math.sin(x*0.17)*1.4; };
  for (x=0;x<w;x++){ var cy3=Math.round(c2(x)); for (y=cy3;y<h;y++){ var d2=y-cy3, c3=M.rampAt(SEA,Math.min(1,0.1+d2/34),x,y); if (d2<1) c3=P.n5; else if (d2<3 && bayer(x,y)<0.6) c3=P.n4; b.px(x,y,c3); } }
  // Gischt, von der Bura nach rechts gerissen
  for (i=0;i<240;i++){ var sx=Math.floor(r()*w), base2=(r()<0.5?crest(sx):c2(sx)), sy=Math.round(base2)-1-Math.floor(r()*9), L=2+Math.floor(r()*8);
    for (var k=0;k<L;k++) if (bayer(sx+k,sy)<0.8-k*0.08) b.px(sx+k,sy-(k>>2),r()<0.5?P.n4:P.n5); }
  edgeDark(b,2.4); };

// ---------------------------------------------------------------- Fall 1: Tonćis Brief – eine Hand schreibt unter der Kioskbirne in Supetar
M.mem.letter=function(b){ var w=b.w,h=b.h;
  fill(b,0,0,w,56,function(x,y){ return M.tex.boards(x,y,M.R('k1 w0 w1 w1'),7); });
  b.rect(168,10,30,34,P.w1); b.rect(170,12,26,16,P.w2); // ein Plakat im Dunkeln
  // die Theke
  var seams=[56,59,63,68,74,81,89,98]; fill(b,0,56,w,h-56,function(x,y){ var c=(hash(x>>4,y>>2)<0.5)?P.w2:P.w1; if (seams.indexOf(y)>=0) c=P.w0; if (hash(x,y)<0.05) c=P.w0; return c; }); b.hl(0,w-1,55,P.w3);
  // Handschuhe, das Geschenk (Wolle, mit Bündchen)
  function glove(x,y){ b.ellipse(x,y,7,6,P.r3); for (var k=-3;k<=3;k+=2) b.rect(x+k*2-1,y-12+Math.abs(k),3,8,P.r3); b.ellipse(x-8,y-2,2,4,P.r3); b.rect(x-6,y+4,12,5,P.r2); for (var j=x-6;j<x+6;j+=2) b.vl(j,y+4,y+8,P.r1); b.hl(x-5,x+4,y-1,P.r4); }
  glove(46,82); glove(62,90);
  // der Brief
  var pts=[[84,62],[166,58],[182,98],[92,102]]; b.poly(pts,P.s5); b.line(84,62,166,58,P.s6); b.line(166,58,182,98,P.s4);
  for (var i=0;i<6;i++){ var t=i/6+0.1, xa=84+(92-84)*t+6, ya=62+(102-62)*t, xb=166+(182-166)*t-8, yb=58+(98-58)*t, L=i===5?0.45:1;
    for (var s=0;s<=1;s+=0.012){ if (s>L) break; var px=xa+(xb-xa)*s, py=ya+(yb-ya)*s+Math.sin(s*90+i)*0.8; if (Math.sin(s*37+i*3)>-0.6) b.px(Math.round(px),Math.round(py),P.n1); } }
  // Hand und Ärmel
  b.poly([[232,104],[194,104],[166,90],[176,80],[232,88]],P.c1); b.line(166,90,176,80,P.c3); b.line(176,80,232,88,P.c2);
  b.ellipse(160,88,7,5,P.p3); b.ellipse(158,86,4,2,P.p4); b.line(154,91,148,94,P.p2); b.line(155,90,149,93,P.p3);
  b.line(155,85,141,97,P.k2); b.line(156,85,142,97,P.m3); b.px(141,98,P.k1);
  // ein zweites Blatt, das der Wind mitnimmt
  b.poly([[194,14],[212,10],[216,22],[198,26]],P.s4); b.line(196,17,210,14,P.s2); b.line(197,20,211,17,P.s2);
  // die Birne
  b.vl(100,0,8,P.k2); b.rect(98,7,5,3,P.m1); b.ellipse(100,13,3,4,P.l1);
  M.light(b,M.lf.sum(M.lf.k(-2.2),M.lf.pool(112,74,96,46,4.4,0.8),M.lf.pool(100,13,22,18,2,0.8)));
  b.ellipse(100,13,2,3,P.l1); b.px(100,12,P.l1); };

// ---------------------------------------------------------------- Fall 2: das Ticket – Nina am Kiosk, die Fähre legt ohne sie ab
M.mem.kiosk=function(b){ var w=b.w,h=b.h,hz=56;
  M.sky(b,0,0,w,hz,'night',31); M.islands(b,0,w,hz,'night',5,{amp:5});
  M.sea(b,0,hz,w,30,'night',0.2,0);
  M.prop.ferry(b,148,hz+3,66,true); M.glints(b,181,hz+3,86,16,0.4,P.y3,0);
  fill(b,0,86,w,h-86,function(x,y){ return M.tex.paving(x,y,M.R('k2 s0 s1 s2'),16); }); b.hl(0,w-1,86,P.s2); b.hl(0,w-1,87,P.k1);
  // der Kiosk
  b.rect(10,38,52,48,P.s2); b.rect(10,38,52,2,P.s3); for (var x=8;x<66;x++){ var st=Math.floor((x-8)/6)%2; b.vl(x,32,37,st?P.r3:P.s5); } b.hl(8,65,31,P.r2); b.hl(8,65,38,P.k1);
  b.rect(16,46,40,20,P.y4); for (var i=0;i<5;i++){ b.rect(18+i*8,50,6,9,[P.r2,P.b1,P.g3,P.s5,P.d3][i]); } b.hl(16,55,60,P.w2); b.rect(14,66,44,4,P.w2); b.hl(14,57,66,P.w4);
  b.rect(16,72,40,14,P.s1); b.rect(20,74,14,8,P.s4); b.rect(36,74,16,8,P.d4);
  M.prop.bench(b,126,96,30); M.prop.lamp(b,108,92,40,true);
  fig(b,88,97,A.waitS[0][0],'R','nina');
  b.rect(97,88,14,9,P.r1); b.hl(97,110,88,P.r2); b.line(100,88,103,84,P.k2); b.line(106,84,109,88,P.k2); b.hl(103,106,84,P.k2);
  M.light(b,M.lf.sum(M.lf.pool(108,94,46,14,2.2,0.8),M.lf.pool(36,56,44,40,1.6,0.8),M.lf.pool(108,52,20,16,1.5,0.8)));
  edgeDark(b,2.0); };

// ---------------------------------------------------------------- Fall 2: der Koffer – Luka im Kühlraum, die Fahrkarten im Deckel
M.mem.guitarcase=function(b){ var w=b.w,h=b.h;
  fill(b,0,0,w,64,function(x,y){ var c=M.tex.tiles(x,y,P.s2,P.s3,10); if (y>36 && Math.sin(x*0.5)>0.8 && hash(x>>1,y>>3)<0.5) c=M.DN[c]; return c; });
  b.rect(198,8,24,56,P.m1); b.rect(200,10,20,52,P.m2); b.vl(216,28,40,P.m4); // die schwere Tür
  b.vl(8,0,63,P.m1); b.vl(9,0,63,P.m2);
  fill(b,0,64,w,h-64,function(x,y){ return M.rampAt(M.R('k2 s0 s1 s2'),0.2+hash(x>>2,y>>1)*0.3+(y-64)/90,x,y); }); b.hl(0,w-1,64,P.k1);
  b.rect(30,6,18,10,P.s6); b.vl(39,6,15,P.s2); // Oberlicht
  // der Koffer, schräg von oben: Schale mit Samt, dahinter der hochgeklappte Deckel mit dem Fach
  var cx=134, cy=86;
  function body(dx,dy,sx,sy,c){ b.ellipse(cx+dx,cy+dy,22*sx,9*sy,c); b.ellipse(cx+dx+30*sx,cy+dy-1,15*sx,7*sy,c); b.rect(Math.round(cx+dx+40*sx),Math.round(cy+dy-4*sy),Math.round(30*sx),Math.max(2,Math.round(7*sy)),c); }
  body(0,-22,1,0.8,P.k1); body(0,-22,0.88,0.6,P.r3); b.rect(cx-12,cy-27,26,8,P.r2); b.hl(cx-12,cx+13,cy-27,P.r4); // Deckel + Fach
  b.rect(cx-9,cy-31,10,7,P.s6); b.rect(cx+2,cy-32,10,7,P.s5); b.hl(cx-9,cx,cy-28,P.r3); b.hl(cx+2,cx+11,cy-29,P.r3); // zwei Fahrkarten
  body(0,0,1,1,P.k1); body(0,0,0.9,0.8,P.r3); b.ellipse(cx,cy+1,12,4,P.r2); b.ellipse(cx+30,cy,6,3,P.r2);
  b.hl(cx-20,cx+64,cy-8,P.m3); // Kante
  b.rect(cx+10,cy-3,14,9,P.k1); b.rect(cx+12,cy-1,10,3,P.s5); b.px(cx+14,cy+4,P.s3); b.px(cx+20,cy+4,P.s3); // Kassette „Za Ninu“
  fig(b,98,96,A.crouchS[0][0],'R','luka');
  M.light(b,M.lf.sum(M.lf.k(-1.4),M.lf.beam(39,14,134,86,5,34,3.8)));
  for (var i=0;i<30;i++){ var t=hash(i,3), px=Math.round(39+(134-39)*t+(hash(i,5)-0.5)*22*t), py=Math.round(14+(86-14)*t); b.px(px,py,P.s6); }
  edgeDark(b,2.0); };

// ---------------------------------------------------------------- Fall 2: die Treppe – Luka rennt hinauf, die siebte Stufe gibt nach
M.mem.fall=function(b){ var w=b.w,h=b.h;
  fill(b,0,0,w,h,function(x,y){ return M.tex.plaster(x,y,M.R('s2 s3 s4'),60); });
  for (var i=0;i<14;i++){ var wx=8+i*17; if (i%3===1){ b.rect(wx,10,8,12,P.k2); b.hl(wx,wx+7,22,P.s5); } } // kleine Fenster der Ledana
  var SX=14, SY=102, RW=19, RH=9, N=9;
  // Wange unter der Treppe (Schatten)
  b.poly([[SX,SY],[SX+N*RW,SY-N*RH],[SX+N*RW,SY-N*RH+16],[SX+16,SY+4]],P.s1);
  for (i=0;i<N;i++){ var x=SX+i*RW, y=SY-i*RH; if (i===6){ // die gebrochene Stufe
      b.rect(x,y-RH,6,RH,P.s3); b.hl(x,x+5,y-RH,P.s5); b.rect(x+6,y-RH,RW-6,RH+6,P.k0); // ein Loch, wo die Stufe war
      b.poly([[x+8,y+2],[x+RW+1,y-3],[x+RW+3,y+1],[x+10,y+7]],P.s3); b.line(x+8,y+2,x+RW+1,y-3,P.s5); // die abgebrochene Platte, kippend
      for (var k=0;k<9;k++) b.rect(x+5+Math.floor(hash(k,1)*12),y+9+k*3,2,2,k%2?P.s4:P.s2); continue; }
    b.rect(x,y-RH,RW,RH,P.s3); b.hl(x,x+RW-1,y-RH,P.s5); b.hl(x,x+RW-1,y-RH+1,P.s4); b.vl(x,y-RH,y-1,P.s2); }
  // Geländer
  b.line(SX+6,SY-30,SX+N*RW,SY-N*RH-26,P.m1); b.line(SX+6,SY-29,SX+N*RW,SY-N*RH-25,P.m0); for (i=0;i<N;i+=2){ var px=SX+i*RW+9; b.vl(px,SY-i*RH-RH-24,SY-i*RH-RH,P.m1); }
  // der Junge, zwei Stufen auf einmal
  var run=M.poseS({ln:4,h:[1,-22],nf:[7,-8,'f'],ff:[-8,0,'t'],nh:[-6,-21],fh:[8,-27]});
  fig(b,SX+5*RW+8,SY-5*RH-RH,run,'R','luka');
  // tiefe Abendsonne von rechts, Dunkelheit kommt von links
  M.light(b,M.lf.sum(M.lf.xband(0,w,-2.4,1.4),M.lf.band(0,h,0.4,-0.6)));
  for (var y=0;y<h;y++) for (x=0;x<60;x++){ if (bayer(x,y)<(60-x)/60*0.9) b.px(x,y,P.k0); } };

// ---------------------------------------------------------------- Epilog: im Bus nach Osten, Mala öffnet ihre Dose
M.mem.bus=function(b){ var w=b.w,h=b.h;
  b.rect(0,0,w,h,P.k1);
  // Fenster: Morgengrauen über der Küste
  var wy0=8, wy1=62; M.vgrad(b,10,wy0,w-20,wy1-wy0,M.R('n1 n2 d2 d3 d4 d5'));
  M.islands(b,10,w-10,48,'dawn',9,{amp:6}); M.sea(b,10,48,w-20,wy1-48,'dawn',0.2,0); M.glints(b,170,48,wy1,12,0.3,P.d6,0);
  b.ellipse(170,46,6,4,function(x,y){ return y<48?P.d6:undefined; });
  for (var x=10;x<w-10;x++){ b.px(x,wy0,P.k2); b.px(x,wy1,P.m1); b.px(x,wy1+1,P.m2); }
  b.rect(76,wy0,6,wy1-wy0,P.k2); b.vl(77,wy0,wy1,P.m1); b.rect(150,wy0,6,wy1-wy0,P.k2); b.vl(151,wy0,wy1,P.m1);
  // Sitzlehnen vorn
  fill(b,0,66,w,h-66,function(x,y){ var u=((x>>2)+(y>>2))%2; return u?P.c1:P.c2; });
  b.rect(0,64,w,3,P.k2); b.rect(110,64,4,h-64,P.k2);
  // Malas Hände, die offene Dose (Blech, Deckel hochgeklappt), darin ein Ticket und ein halbes Foto
  var tx=128,ty=76,tw=40,th=20; b.rect(tx-4,ty+th-2,tw+8,6,P.v1); // Schoß
  b.poly([[tx+1,ty],[tx+tw-1,ty],[tx+tw+2,ty-13],[tx+4,ty-13]],P.m3); b.hl(tx+4,tx+tw+1,ty-13,P.m4); b.poly([[tx+4,ty-1],[tx+tw-4,ty-1],[tx+tw-2,ty-10],[tx+6,ty-10]],P.m2); // Deckel innen
  b.rect(tx,ty,tw,th,P.m2); b.hl(tx+1,tx+tw-2,ty,P.m4); b.px(tx,ty,P.k1); b.px(tx+tw-1,ty,P.k1); b.px(tx,ty+th-1,P.k1); b.px(tx+tw-1,ty+th-1,P.k1); b.rect(tx+2,ty+2,tw-4,th-4,P.m0);
  b.rect(tx+4,ty+4,14,7,P.s5); b.hl(tx+4,tx+17,ty+6,P.r3); b.px(tx+6,ty+9,P.s2); b.px(tx+9,ty+9,P.s2); b.px(tx+12,ty+9,P.s2); // Straßenbahnticket
  b.poly([[tx+19,ty+4],[tx+35,ty+3],[tx+35,ty+16],[tx+24,ty+16]],P.s4); for (var sy2=ty+6;sy2<ty+15;sy2+=2) b.hl(tx+27,tx+33,sy2,P.n1); b.rect(tx+21,ty+8,5,5,P.b1); b.line(tx+19,ty+4,tx+24,ty+16,P.s6); // halbes Foto: Ärmel, Straßenbahn
  b.ellipse(tx-3,ty+12,5,5,P.x4); b.ellipse(tx+tw+2,ty+12,5,5,P.x4); b.rect(tx-14,ty+10,10,9,P.v2); b.rect(tx+tw+6,ty+10,10,9,P.v2); // Hände, Ärmel
  M.light(b,M.lf.sum(M.lf.k(-0.6),M.lf.pool(120,30,140,70,1.6,0.9)));
  edgeDark(b,1.8); };
})(M);
