/* ===== rooms/art/office.js — Hafenbüro (Lučka kapetanija): ein schlichtes Amtszimmer unter Neonlicht =====
   Grün gestrichene Wände, Holztresen mit Glasaufsatz und Durchreiche (Vordergrund-Ebene vor Mladen), Fahrpläne,
   alte Schiffsfotos, Wanduhr, Funkgerät (Lämpchen blinkt in dynamic), Wartebank, Gummibaum,
   links die Eingangstür zur Riva, rechts die Tür „ARHIVA – SAMO OSOBLJE“. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var VP=[160,54], RECT=[48,12,272,90], F=112, R3=M.room3(VP,F,90), SPEC={vp:VP,rect:RECT};
// Tresen (Raumkoordinaten: X quer, Y Höhe auf Rückwandmaß, Z Tiefe)
var CX0=106, CX1=204, CZ0=46, CZ1=52, CY=68, GY=44;
var DOORL=[10,36,38,90];            // Eingangstür in der linken Wand: u0,u1 (Tiefe), vOben, vUnten
var ADOOR=[234,38,30,52];           // Archivtür in der Rückwand: x,y,w,h
var CLK=[157,25,6];                 // Wanduhr
var RADIO=[176,58,28,13];           // Funkgerät auf dem Schreibtisch hinten (Bildschirm-Rechteck)
function R(s){ return M.R(s); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function rp(p){ return [Math.round(p[0]),Math.round(p[1])]; }

// Wände: unten Ölsockel in Grün (glänzend), oben blasses Grün-Beige, dazwischen ein Abschlussstrich
var DADO=62;
function wallCol(u,v,x,y,shade){ var c;
  if (v>=DADO){ c=P.g3; if (bayer(x,y)<0.16) c=P.g4; if (hash(Math.floor(u/9),Math.floor(v/7))<0.1 && bayer(x,y)<0.5) c=P.g2; if (v===DADO||v===DADO+1) c=(v===DADO)?P.g1:P.g4; if (v>86) c=(v>88)?P.w0:P.w1; }
  else { var st=Math.sin(u*0.05+1.3)+Math.sin(u*0.13+v*0.04)+Math.sin(v*0.09); c=P.s4; if (bayer(x,y)<0.3) c=P.a6; if (st>1.9 && bayer(x,y)<0.5) c=P.s3; if (v>DADO-3 && bayer(x,y)<0.5) c=P.s3; if (v<RECT[1]+3 && bayer(x,y)<0.4) c=P.s3; }
  return shade?M.step(c,-shade):c; }
function paint(S,GS,tod){ var b=new M.Buf(320,144,P.k0), wea=M.scn.weather(GS), x, y;
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return wallCol(x,y,x,y,0); },
    side:function(u,v,x,y,sd){ var c=wallCol(u*1.6+(sd==='L'?0:300),v+RECT[1],x,y,0); return sd==='L'?M.DN[c]:c; },
    floor:function(xb,d,x,y){ var f=R3.floor(x,y), f2=R3.floor(x+1,y), f3=R3.floor(x,y+1), TS=20, tu=Math.floor(f.X/TS), tz=Math.floor(f.Z/TS);
      var c=((tu+tz)%2)?P.m2:P.s2; if (bayer(x,y)<0.12) c=((tu+tz)%2)?P.s2:P.m2;
      if (hash(tu*7+Math.floor(f.X/3),tz*5+Math.floor(f.Z/3))<0.05) c=M.DN[c];
      if (Math.floor(f2.X/TS)!==tu || Math.floor(f3.Z/TS)!==tz) c=P.m1; return c; },
    ceil:function(xb,d,x,y){ var c=(bayer(x,y)<0.25)?P.s3:P.s4; if (Math.abs(((xb-48)%56+56)%56)<1) c=P.s3; return c; } });
  // Sockelleiste / Ecken
  b.hl(RECT[0],RECT[2]-1,RECT[3]-1,P.w0);
  b.line(RECT[0],RECT[1],RECT[0],RECT[3],P.g1); b.line(RECT[2],RECT[1],RECT[2],RECT[3],P.s3);
  // ---- Rückwand links (öffentlich): Fahrplan „SUPETAR“ mit dem Boot um sieben, Aushänge
  board(b,52,17,36,41);
  M.microText(b,'SUPETAR',54,19,P.n1); b.hl(53,86,25,P.n2); b.hl(53,86,26,P.s4);
  ['06:30','09:00','12:00','15:30','19:00'].forEach(function(s,i){ M.microText(b,s,55,28+i*6,i===4?P.r2:P.k2); b.hl(75,85,30+i*6,P.s3); b.hl(75,80,32+i*6,P.s4); });
  // Aushänge: ein Zettel mit Reißzwecke, eine Bura-Warnung mit rotem Rand
  b.rect(55,61,10,8,P.s5); b.hl(56,63,63,P.s2); b.hl(56,62,65,P.s2); b.hl(56,61,67,P.s2); b.px(59,61,P.r3);
  b.rect(68,60,19,10,P.s6); b.rect(68,60,19,1,P.r3); b.rect(68,69,19,1,P.r3); b.vl(68,60,69,P.r3); b.vl(86,60,69,P.r3); M.microText(b,'BURA',70,62,P.r2); b.hl(70,84,68,P.s3); b.px(77,60,P.y3);
  // ---- Rückwand Mitte (hinter dem Tresen): Schiffsfotos, Uhr, Seekarte, Kalender
  [[98,16,15,11,0],[116,18,13,10,1],[132,15,14,12,2]].forEach(function(f){ photo(b,f[0],f[1],f[2],f[3],f[4]); });
  M.prop.clock(b,CLK[0],CLK[1],CLK[2],(tod==='night')?11:6,(tod==='night')?20:52);
  chart(b,170,15,42,26);
  b.rect(198,44,11,13,P.s6); b.rect(198,44,11,3,P.r3); M.microText(b,'11',200,48,P.k2); b.hl(199,207,54,P.s3); b.px(203,43,P.m1);   // Kalender, November 2011
  // Aktenschrank, Regal mit Ordnern, Schreibtisch mit Funkgerät
  cabinet(b,96,54,16,36);
  b.rect(116,48,26,42,P.w1); for (var s=0;s<3;s++){ var sy=50+s*13; ordner(b,118,sy,22,10,s); b.hl(116,141,sy+10,P.w3); b.hl(116,141,sy+11,P.w0); }
  desk(b);
  // ---- Archivtür rechts mit Schild
  archiveDoor(b);
  // Heizkörper unter dem Fenster der rechten Wand, Papierkorb
  var hz=[M.wallPt(SPEC,'R',30,70),M.wallPt(SPEC,'R',44,70),M.wallPt(SPEC,'R',44,84),M.wallPt(SPEC,'R',30,84)]; b.poly(hz,function(x,y){ return (x%2)?P.s4:P.s3; });
  b.rect(262,82,7,9,P.m1); b.hl(261,269,81,P.m2); b.vl(262,82,90,P.m2); b.px(264,81,P.s5); b.px(266,80,P.s6);
  // ---- Wartebank vor der linken Rückwand
  waitBench(b,51,92,40);
  // ---- linke Wand: Eingangstür (Glas, Blick auf die Riva), Feuerlöscher
  entryDoor(b,tod,wea);
  var fe=rp(M.wallPt(SPEC,'L',42,74)); b.rect(fe[0]-1,fe[1],4,10,P.r3); b.vl(fe[0]-1,fe[1],fe[1]+9,P.r4); b.vl(fe[0]+2,fe[1],fe[1]+9,P.r1); b.rect(fe[0],fe[1]-2,2,2,P.k2); b.line(fe[0]+1,fe[1]-2,fe[0]+3,fe[1]+3,P.k2);
  // Lichtschalter, Schild ULAZ über der Tür
  var ls=rp(M.wallPt(SPEC,'L',4,64)); b.rect(ls[0],ls[1],2,3,P.s5);
  // ---- rechte Wand: Urkunde und ein Wandtelefon
  var q=[M.wallPt(SPEC,'R',10,30),M.wallPt(SPEC,'R',26,30),M.wallPt(SPEC,'R',26,50),M.wallPt(SPEC,'R',10,50)]; b.poly(q,P.y1); var q2=[M.wallPt(SPEC,'R',11.5,31.5),M.wallPt(SPEC,'R',24.5,31.5),M.wallPt(SPEC,'R',24.5,48.5),M.wallPt(SPEC,'R',11.5,48.5)]; b.poly(q2,P.s5);
  for (var ln=0;ln<4;ln++){ var a=M.wallPt(SPEC,'R',13,36+ln*3), c2=M.wallPt(SPEC,'R',23,36+ln*3); b.line(Math.round(a[0]),Math.round(a[1]),Math.round(c2[0]),Math.round(c2[1]),P.s3); }
  var tp=rp(M.wallPt(SPEC,'R',36,60)); b.rect(tp[0],tp[1],5,9,P.s4); b.vl(tp[0],tp[1],tp[1]+8,P.s5); b.rect(tp[0]+1,tp[1]+1,3,3,P.m1); b.line(tp[0]+2,tp[1]+9,tp[0]+1,tp[1]+16,P.k2);
  // ---- Decke: Neonleuchte
  neon(b,false);
  // ---- Glas des Aufsatzes: der Raum dahinter erscheint leicht kühler/heller
  var g0=R3.p(CX0,GY,CZ0+3), g1=R3.p(CX1,CY,CZ0+3);
  for (y=Math.round(g0[1]);y<Math.round(g1[1]);y++) for (x=Math.round(g0[0]);x<Math.round(g1[0]);x++){ if (bayer(x,y)<0.25) b.px(x,y,M.UP[b.get(x,y)]); }
  // ---- Licht: Neonröhre oben Mitte, Ecken dunkler
  M.light(b,M.lf.sum(M.lf.pool(160,64,190,90,0.9,1.2),M.lf.pool(160,132,120,22,0.5),M.lf.vignette(320,144,2.2),M.lf.k(-0.35)),0,0,function(x,y){ return !inDoorGlass(x,y); });
  return M.finishTOD(b,tod,{ sky:function(){ return true; }, after:function(b,tod){ neon(b,true); } }); }
function inDoorGlass(x,y){ return DG && x>=DG[0]&&x<DG[2]&&y>=DG[1]&&y<DG[3]&&DGM[y*320+x]; }
var DG=null, DGM=new Uint8Array(320*144);
// gerahmtes Brett (Fahrplan)
function board(b,x,y,w,h){ b.rect(x-1,y-1,w+2,h+2,P.w1); b.hl(x-1,x+w,y-1,P.w3); b.vl(x+w,y-1,y+h,P.w0); b.rect(x,y,w,h,P.s6); for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) if (bayer(xx,yy)<0.12) b.px(xx,yy,P.s5); }
// altes Schiffsfoto (sepia) im schwarzen Rahmen
function photo(b,x,y,w,h,k){ b.rect(x,y,w,h,P.k2); b.hl(x,x+w-1,y,P.m1); b.rect(x+1,y+1,w-2,h-2,P.s6); var ix=x+2, iy=y+2, iw=w-4, ih=h-4;
  for (var yy=iy;yy<iy+ih;yy++) for (var xx=ix;xx<ix+iw;xx++) b.px(xx,yy,(yy<iy+ih*0.55)?P.e4:(bayer(xx,yy)<0.5?P.e3:P.e2));
  var wy=iy+Math.round(ih*0.62);
  if (k===0){ b.hl(ix+1,ix+iw-2,wy,P.e0); b.hl(ix+2,ix+iw-3,wy-1,P.e1); b.rect(ix+4,wy-3,4,2,P.e1); b.vl(ix+6,wy-6,wy-3,P.e0); b.px(ix+8,wy-4,P.e0); }
  else if (k===1){ b.hl(ix,ix+iw-1,wy,P.e1); b.rect(ix+2,wy-2,iw-4,2,P.e0); b.rect(ix+4,wy-4,3,2,P.e1); b.vl(ix+5,wy-7,wy-4,P.e0); }
  else { b.hl(ix+1,ix+iw-1,wy,P.e0); b.hl(ix+2,ix+iw-2,wy-1,P.e1); b.rect(ix+3,wy-3,iw-6,2,P.e1); b.rect(ix+5,wy-5,3,2,P.e0); b.vl(ix+iw-4,wy-6,wy-3,P.e0); } }
// Seekarte der Adria
function chart(b,x,y,w,h){ b.rect(x-1,y-1,w+2,h+2,P.s3); for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var coast=y+5+Math.sin((xx-x)*0.25)*2+(xx-x)*0.25+Math.sin((xx-x)*0.7)*1; var land=yy<coast;
    var isl=(Math.hypot((xx-x-24)/7,(yy-y-17)/2.2)<1)||(Math.hypot((xx-x-12)/5,(yy-y-15)/1.8)<1)||(Math.hypot((xx-x-33)/6,(yy-y-21)/1.6)<1);
    var c=land||isl?((hash(xx,yy)<0.2)?P.e3:P.e4):((hash(xx>>1,yy)<0.08)?P.b3:P.b4); if (!land && !isl && Math.abs(yy-coast)<1.2) c=P.b2; b.px(xx,yy,c); }
  for (var k=0;k<5;k++) b.px(x+6+k*7,y+h-4-(k%2)*3,P.b1); b.line(x+18,y+10,x+26,y+16,P.r3); b.px(x+26,y+16,P.r2); }
function cabinet(b,x,y,w,h){ b.rect(x,y,w,h,P.m2); b.vl(x,y,y+h-1,P.m3); b.vl(x+w-1,y,y+h-1,P.m1); b.hl(x,x+w-1,y,P.m4);
  for (var d=0;d<3;d++){ var dy=y+3+d*11; b.rect(x+2,dy,w-4,9,P.m3); b.hl(x+2,x+w-3,dy,P.m4); b.hl(x+2,x+w-3,dy+8,P.m1); b.rect(x+w/2-2,dy+3,4,1,P.m1); b.rect(x+w/2-3,dy+1,6,2,P.s5); } }
function ordner(b,x,y,w,h,s){ var r=M.rng(70+s), xx=x, cols=[P.c2,P.r2,P.g2,P.m2,P.c3,P.e2]; while (xx<x+w-2){ var bw=2+Math.floor(r()*2), c=cols[Math.floor(r()*cols.length)]; b.rect(xx,y+1,bw,h-1,c); b.vl(xx,y+1,y+h-1,M.UP[c]); b.px(xx+bw-1,y+3,P.s5); xx+=bw; } }
function desk(b){ var R3b=R3;
  R3b.box(b,160,214,72,90,2,16,{top:function(x,y){ return (y%3===0)?P.w2:P.w3; },front:function(x,y){ return ((x%9)===0)?P.w0:P.w1; },left:P.w0});
  // Funkgerät: graues Gehäuse, Skala, Regler, Lautsprecher, Handmikrofon
  var x=RADIO[0], y=RADIO[1], w=RADIO[2], h=RADIO[3];
  b.rect(x,y,w,h,P.m2); b.hl(x,x+w-1,y,P.m4); b.vl(x,y,y+h-1,P.m3); b.vl(x+w-1,y,y+h-1,P.m0); b.hl(x,x+w-1,y+h-1,P.m0);
  b.rect(x+2,y+2,12,4,P.k2); for (var i=0;i<12;i+=2) b.px(x+2+i,y+5,P.y2); b.px(x+8,y+3,P.r3); M.microText(b,'16',x+3,y+2,P.a4);
  for (var yy=y+2;yy<y+h-2;yy+=2) b.hl(x+16,x+w-3,yy,P.m1);
  b.rect(x+3,y+8,3,3,P.k2); b.px(x+4,y+8,P.m4); b.rect(x+8,y+8,3,3,P.k2); b.px(x+9,y+8,P.m4);
  b.rect(x+w+1,y+3,3,5,P.k2); b.px(x+w+2,y+3,P.m3); b.line(x+w+2,y+8,x+w-2,y+h+1,P.k2);   // Mikrofon am Haken
  b.vl(x+w-4,y-8,y,P.m1); b.px(x+w-4,y-9,P.m3);   // Antenne
  // Schreibtischlampe und Papiere
  b.rect(196,69,10,2,P.s6); b.rect(198,68,7,1,P.s5); b.vl(166,64,71,P.m1); b.line(166,64,170,61,P.m1); b.poly([[168,59],[174,60],[172,63],[167,62]],P.g2); }
function archiveDoor(b){ var x=ADOOR[0], y=ADOOR[1], w=ADOOR[2], h=ADOOR[3];
  b.rect(x-2,y-2,w+4,h+2,P.s3); b.hl(x-2,x+w+1,y-2,P.s5); b.vl(x-2,y-2,y+h-1,P.s5); b.vl(x+w+1,y-2,y+h-1,P.s2);
  for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=P.m2; if ((xx-x)===0) c=P.m3; else if ((xx-x)===w-1) c=P.m1; else if (yy===y) c=P.m3; if (((yy-y)===10||(yy-y)===36) && xx>x+2 && xx<x+w-3) c=P.m1; if (((yy-y)===11||(yy-y)===37) && xx>x+2 && xx<x+w-3) c=P.m3; if (hash(xx>>1,yy>>1)<0.05) c=M.DN[c]; b.px(xx,yy,c); }
  // Schild: ARHIVA / SAMO / OSOBLJE (Emaille)
  var sx=x+1, sy=y+12, sw=w-2, sh=23; b.rect(sx,sy,sw,sh,P.s6); b.hl(sx,sx+sw-1,sy,P.s5); b.hl(sx,sx+sw-1,sy+sh-1,P.s3); b.vl(sx,sy,sy+sh-1,P.s4);
  M.microText(b,'ARHIVA',sx+Math.floor((sw-23)/2),sy+2,P.k1); b.hl(sx+3,sx+sw-4,sy+8,P.r3);
  M.microText(b,'SAMO',sx+Math.floor((sw-15)/2),sy+10,P.r2); M.microText(b,'OSOBLJE',sx+Math.floor((sw-27)/2),sy+16,P.r2);
  // Klinke, Schloss, Schwelle
  b.rect(x+w-6,y+38,4,1,P.m4); b.px(x+w-6,y+39,P.m0); b.rect(x+w-5,y+41,2,2,P.k2);
  b.hl(x-2,x+w+1,y+h,P.m1); }
function rubberTree(b,x,by,sc){ sc=sc||1; // Gummibaum (Ficus elastica) im Terrakottatopf
  b.rect(x-6,by-9,13,9,P.t3); b.hl(x-7,x+7,by-10,P.t4); b.hl(x-7,x+7,by-9,P.t2); b.vl(x-6,by-8,by-1,P.t4); b.vl(x+6,by-8,by-1,P.t1); b.hl(x-5,x+5,by-1,P.t1); b.hl(x-4,x+4,by,P.k2);
  b.vl(x,Math.round(by-46*sc),by-10,P.w1); b.vl(x+1,Math.round(by-30*sc),by-10,P.w2); b.line(x,Math.round(by-22*sc),Math.round(x-5*sc),Math.round(by-30*sc),P.w1); b.line(x+1,Math.round(by-28*sc),Math.round(x+6*sc),Math.round(by-36*sc),P.w1);
  var L=[[-6,-14,-0.5],[7,-16,0.45],[-5,-24,-0.8],[8,-26,0.6],[-6,-33,-0.4],[6,-35,0.9],[-3,-42,-1.1],[4,-44,0.8],[0,-49,-1.5],[10,-20,0.2],[-7,-21,-0.2]];
  L.forEach(function(l,i){ var cx=x+l[0]*sc, cy=by+l[1]*sc, a=l[2], ca=Math.cos(a), sa=Math.sin(a), A=5.2*sc, B=2.4*sc;
    for (var yy=-6;yy<=6;yy++) for (var xx=-8;xx<=8;xx++){ var u=xx*ca+yy*sa, v=-xx*sa+yy*ca; var d=(u*u)/(A*A)+(v*v)/(B*B); if (d>1) continue;
      var c=v<-0.6?P.g2:P.g1; if (Math.abs(v)<0.6) c=P.g3; if (v<-1.4 && u<0) c=P.g4; if (d>0.75) c=P.g0; b.px(Math.round(cx+xx),Math.round(cy+yy),c); } });
  var ty=Math.round(by-50*sc); b.px(x,ty,P.r2); b.px(x,ty-1,P.r3); b.px(x+1,ty,P.r1); }
function waitBench(b,x,by,w){ // Holzbank mit Metallgestell an der Wand
  b.rect(x,by-13,w,3,P.w3); b.hl(x,x+w-1,by-13,P.w4); b.hl(x,x+w-1,by-10,P.w1); b.rect(x+1,by-22,w-2,2,P.w3); b.hl(x+1,x+w-2,by-22,P.w4); b.rect(x+1,by-18,w-2,2,P.w2);
  [x+2,x+w-3].forEach(function(lx){ b.vl(lx,by-21,by-1,P.m1); b.vl(lx+1,by-12,by-1,P.m0); });
  b.hl(x,x+w-1,by,P.g1); b.rect(x+w-12,by-16,6,3,P.s5); b.hl(x+w-12,x+w-7,by-16,P.s6); }   // vergessene Zeitung
function entryDoor(b,tod,wea){ var q=M.wallQuad(SPEC,'L',DOORL[0],DOORL[1],DOORL[2],DOORL[3]), qi=M.wallQuad(SPEC,'L',DOORL[0]+3,DOORL[1]-3,DOORL[2]+4,DOORL[2]+30);
  // Rahmen, Türblatt
  b.poly(M.wallQuad(SPEC,'L',DOORL[0]-2,DOORL[1]+2,DOORL[2]-3,DOORL[3]),P.s3);
  b.poly(q,function(x,y){ return (hash(x,y>>2)<0.1)?P.w1:P.w2; });
  // Glas mit Blick nach draußen
  var xs=qi.map(function(p){ return p[0]; }), ys=qi.map(function(p){ return p[1]; }); DG=[Math.floor(Math.min.apply(null,xs)),Math.floor(Math.min.apply(null,ys)),Math.ceil(Math.max.apply(null,xs)),Math.ceil(Math.max.apply(null,ys))];
  DGM.fill(0); var vb=new M.Buf(320,144,P.k0); outside(vb,DG,tod,wea);
  b.poly(qi,function(x,y){ DGM[y*320+x]=1; return vb.get(x,y); });
  // Sprossen, Griff, Türschild
  var m0=M.wallPt(SPEC,'L',(DOORL[0]+DOORL[1])/2,DOORL[2]+4), m1=M.wallPt(SPEC,'L',(DOORL[0]+DOORL[1])/2,DOORL[2]+30); b.line(Math.round(m0[0]),Math.round(m0[1]),Math.round(m1[0]),Math.round(m1[1]),P.w1);
  var h0=M.wallPt(SPEC,'L',DOORL[0]+3,DOORL[2]+17), h1=M.wallPt(SPEC,'L',DOORL[1]-3,DOORL[2]+17); b.line(Math.round(h0[0]),Math.round(h0[1]),Math.round(h1[0]),Math.round(h1[1]),P.w1);
  var kn=rp(M.wallPt(SPEC,'L',DOORL[0]+2.5,DOORL[2]+40)); b.rect(kn[0]-1,kn[1],3,2,P.y3); b.px(kn[0]-1,kn[1],P.y4);
  var ul=rp(M.wallPt(SPEC,'L',DOORL[0]+6,DOORL[2]-8)); b.rect(ul[0]-6,ul[1],16,6,P.g2); M.microText(b,'ULAZ',ul[0]-5,ul[1]+1,P.s6); }
// Blick durch die Glastür: die Riva bei Abend oder Nacht (Laterne, Palme)
function outside(vb,r,tod,wea){ var x, y, night=tod==='night', rain=wea==='rain';
  var sky=night?R('k1 k2 n0 n1'):(tod==='day'?R('b2 b3 b4'):(rain?R('d0 m1 d1 m2'):R('d1 d2 d3 d4 d5')));
  for (y=r[1];y<r[3];y++) for (x=r[0];x<r[2];x++){ var t=(y-r[1])/(r[3]-r[1]); vb.px(x,y,ra(sky,t*0.9,x,y)); }
  var gy=r[1]+Math.round((r[3]-r[1])*0.74); for (y=gy;y<r[3];y++) for (x=r[0];x<r[2];x++) vb.px(x,y,night?(bayer(x,y)<0.3?P.n1:P.n0):(tod==='day'?P.s4:P.d1));
  // Palme als Silhouette, Laterne mit Licht
  var px=r[0]+Math.round((r[2]-r[0])*0.3); for (y=gy-16;y<gy;y++) vb.px(px+Math.round((gy-y)*0.08),y,night?P.k1:P.d0);
  for (var a=0;a<7;a++){ var an=-Math.PI*0.9+a*0.45; for (var s=0;s<6;s++) vb.px(Math.round(px+1+Math.cos(an)*s),Math.round(gy-16+Math.sin(an)*s*0.6+s*s*0.06),night?P.k1:P.d0); }
  var lx=r[0]+Math.round((r[2]-r[0])*0.72); for (y=gy-14;y<gy;y++) vb.px(lx,y,night?P.k1:P.d0); vb.rect(lx-1,gy-17,3,3,tod==='day'?P.m2:P.y4); vb.px(lx,gy-16,tod==='day'?P.m3:P.l1);
  if (tod!=='day'){ for (y=gy;y<Math.min(r[3],gy+5);y++) for (x=lx-3;x<=lx+3;x++) if (bayer(x,y)<0.5-(y-gy)*0.08) vb.px(x,y,P.y2); }
  if (rain) for (var i=0;i<20;i++) vb.px(r[0]+Math.floor(hash(i,3)*(r[2]-r[0])),r[1]+Math.floor(hash(i,4)*(r[3]-r[1])),P.m3); }
// Neonleuchte an der Decke (lit = Röhren leuchten)
function neon(b,lit){ var a=R3.p(108,RECT[1],24), c=R3.p(212,RECT[1],24), y=Math.round(a[1]);
  b.hl(Math.round(a[0])-1,Math.round(c[0])+1,y-1,P.m2); b.hl(Math.round(a[0])-2,Math.round(c[0])+2,y,P.m3); b.hl(Math.round(a[0])-1,Math.round(c[0])+1,y+3,P.m2);
  b.hl(Math.round(a[0]),Math.round(c[0]),y+1,lit?P.l1:P.s6); b.hl(Math.round(a[0]),Math.round(c[0]),y+2,lit?P.s6:P.s5);
  b.vl(Math.round(a[0])+10,0,y-1,P.m1); b.vl(Math.round(c[0])-10,0,y-1,P.m1); }

// ---------------------------------------------------------------- Tresen (Vordergrund-Ebene vor Mladen)
function layers(S,GS,tod){ var L=[];
  var p0=R3.p(CX0,CY,CZ1), p1=R3.p(CX1,90,CZ1), top=R3.p(CX0,GY,CZ0), base=Math.round(R3.p(CX0,90,CZ1)[1]);
  var l=M.layer(60,30,200,82,base+1), w=M.lw(l);
  var wr={poly:function(p,c){ w.poly(p,c); }};
  // Seitenteile (zurück zur Wand)
  // Front: senkrechte Paneele, Sockel; Deckplatte
  R3.box(wr,CX0,CX1,CY,90,CZ0,CZ1,{top:function(x,y){ return P.w4; },front:function(x,y){ var u=Math.round(x-p0[0]), c=(u%14===0)?P.w1:((u%14===1)?P.w4:((u%2)?P.w3:P.w2)); if (y>p1[1]-5) c=P.w0; if (y<p0[1]+2) c=P.w4; return c; }});
  var fl=Math.round(p0[1]); w.hl(Math.round(p0[0])-3,Math.round(p1[0])+3,fl-1,P.w5); w.hl(Math.round(p0[0])-3,Math.round(p1[0])+3,fl,P.w4); w.hl(Math.round(p0[0])-2,Math.round(p1[0])+2,fl+1,P.w1);
  // Schild am Tresen: Rauchverbot
  var sx=Math.round(p0[0])+10, sy=fl+7; w.rect(sx,sy,54,14,P.s6); w.hl(sx,sx+53,sy,P.s5); w.hl(sx,sx+53,sy+13,P.s4); w.micro('ZABRANJENO',sx+13,sy+2,P.r2); w.micro('PUŠENJE',sx+13,sy+8,P.r2);
  w.ellipse(sx+6.5,sy+7,4.8,4.8,P.r3); w.ellipse(sx+6.5,sy+7,3.4,3.4,P.s6); w.rect(sx+3,sy+6,7,2,P.k2); w.px(sx+9,sy+6,P.r3); w.line(sx+3,sy+3,sx+10,sy+10,P.r3); w.line(sx+4,sy+3,sx+10,sy+9,P.r3);
  // Glasaufsatz: Rahmen (Aluminium), Sprossen, Durchreiche, Spiegelungen
  var gL=R3.p(CX0,GY,CZ0+3), gR=R3.p(CX1,GY,CZ0+3), bL=R3.p(CX0,CY,CZ0+3), gx0=Math.round(gL[0]), gx1=Math.round(gR[0]), gy0=Math.round(gL[1]), gy1=Math.round(bL[1])-1;
  w.hl(gx0,gx1,gy0,P.m4); w.hl(gx0,gx1,gy0+1,P.m2); w.hl(gx0,gx1,gy1,P.m3);
  var mul=[0,0.25,0.5,0.75,1]; mul.forEach(function(f){ var mx=Math.round(gx0+(gx1-gx0)*f); w.vl(mx,gy0,gy1,P.m3); w.vl(mx+(f<1?1:-1),gy0,gy1,P.m1); });
  // Durchreiche vor Mladen (Öffnung unten in der Scheibe) mit Messingblech
  var dx0=137, dx1=163, dyT=gy1-9; for (var xx=dx0;xx<=dx1;xx++){ var e=Math.abs((xx-(dx0+dx1)/2)/((dx1-dx0)/2)), ty=Math.round(dyT+e*e*4); w.px(xx,ty,P.m4); w.px(xx,ty+1,P.m2); }
  w.rect(dx0+1,gy1-1,dx1-dx0-1,2,P.y2); w.hl(dx0+1,dx1-1,gy1-1,P.y4);
  // Spiegelungen: wenige schräge Lichtstriche (Mladen bleibt sichtbar)
  for (var k=0;k<4;k++){ var sx2=gx0+18+k*44; for (var j=0;j<14;j++){ var xx2=sx2+j, yy2=gy0+3+j; if (yy2>=gy1-1) break; if (xx2>dx0-2&&xx2<dx1+2&&yy2>dyT-2) continue; if (j%3!==1) w.px(xx2,yy2,P.s6); } }
  // Schildchen INFORMACIJE über der Durchreiche
  w.rect(132,gy0+3,45,7,P.c1); w.hl(132,176,gy0+3,P.c3); w.micro('INFORMACIJE',133,gy0+4,P.s6);
  // auf dem Tresen: Formulare, Klingel, Stempel
  w.rect(112,fl-3,9,2,P.s6); w.hl(113,121,fl-4,P.s5); w.ellipse(128,fl-1.5,2.2,1.5,P.y3); w.px(128,fl-3,P.y4); w.rect(196,fl-4,3,3,P.w1); w.rect(195,fl-1,5,1,P.k2);
  if (tod==='night') M.light(l,M.lf.k(-0.4),l.ox,l.oy);
  L.push(l);
  // Gummibaum vorn rechts (Figuren gehen dahinter vorbei)
  var pl=M.layer(270,70,48,72,140), pw=M.lw(pl); rubberTree(pw,296,139,1.35); M.light(pl,M.lf.k(-0.6),pl.ox,pl.oy); L.push(pl);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Funklämpchen, Neonflackern, Sekundenzeiger
function dyn(fb,v,S,GS){ var t=v.t, gt=v.gt;
  // Funkgerät: grünes Empfangslämpchen flackert, rotes Sendelämpchen blinkt selten; Skala zittert
  var x=RADIO[0], y=RADIO[1]; var rx=(Math.sin(t*23)+Math.sin(t*37.1)>0.6)||(Math.floor(t*1.5)%7===0);
  fb.px(x+14,y+8,rx?P.g5:P.g1); fb.px(x+15,y+8,rx?P.g4:P.g1);
  fb.px(x+14,y+10,(Math.floor(t*0.8)%5===0)?P.r4:P.r1);
  var nd=x+3+Math.floor(((Math.sin(t*0.7)+1)/2)*9); fb.px(nd,y+4,P.y4);
  // Neonröhre flackert ab und zu kurz
  var fl=(Math.floor(t*10)%97===0)||(Math.floor(t*10)%131<2 && Math.sin(t*61)>0); if (fl){ var a=R3.p(108,RECT[1],24), c=R3.p(212,RECT[1],24), yy=Math.round(a[1]); for (var xx=Math.round(c[0])-40;xx<=Math.round(c[0]);xx++){ fb.px(xx,yy+1,P.s4); fb.px(xx,yy+2,P.s3); } }
  // Sekundenzeiger
  var a2=(gt/1000%60)/60*Math.PI*2-Math.PI/2, ex=Math.round(CLK[0]+Math.cos(a2)*(CLK[2]-1)), ey=Math.round(CLK[1]+Math.sin(a2)*(CLK[2]-1)); fb.line(CLK[0],CLK[1],ex,ey,P.r3);
  fb.px(CLK[0],CLK[1],P.k1); }

// ---------------------------------------------------------------- Laufflächen
function walk(x,y){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (x<6||x>314||y>139) return false;
  if (Z<6||X<52||X>268) return false;
  if (X>CX0-6 && X<CX1+6 && Z<CZ1+5) return false;     // Tresen und Bereich dahinter
  if (X<94 && Z<12) return false;                       // Wartebank
  if (X>258 && Z>100 && x>282) return false;             // Gummibaum vorn rechts
  return true; }
function rr(X0,X1,Y0,Y1,Z0,Z1){ return R3.rect(X0,X1,Y0,Y1,Z0,Z1); }
var dq=M.wallQuad(SPEC,'L',DOORL[0],DOORL[1],DOORL[2],DOORL[3]);
var DR=(function(){ var xs=dq.map(function(p){ return p[0]; }), ys=dq.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; })();
var CR=rr(CX0,CX1,CY,90,CZ0,CZ1);
M.defineArt('office',{
  width:320, paint:paint, layers:layers, walk:walk, dynamic:dyn,
  actorLut:function(a,S,GS,tod){ return NEONLUT; },
  spots:{ door:DR, counter:[CR[0],CR[1]-2,CR[2],CR[3]+2], timetable:[51,19,38,40], photos:[97,14,50,15], radio:[RADIO[0]-2,RADIO[1]-10,RADIO[2]+8,RADIO[3]+12],
    clock:[CLK[0]-8,CLK[1]-8,17,17], bench:[50,68,42,25], plant:[280,72,32,68], archive_door:[ADOOR[0]-3,ADOOR[1]-3,ADOOR[2]+6,ADOOR[3]+3] },
  stands:{ door:R3.st(58,26,'L'), counter:[156,113,'B'], timetable:R3.st(70,16,'B'), photos:[122,113,'B'], radio:[188,113,'B'], clock:[158,113,'B'],
    bench:R3.st(72,16,'B'), plant:[272,124,'R'], archive_door:R3.st(241,10,'B') },
  actorPos:{ mladen:[150,104,'F'] },
  start:[160,124,'L'], entries:{ riva:R3.st(60,28,'R'), archive:R3.st(241,10,'F') }
});
var NEONLUT=M.tintMake(function(r,g,b){ return [r*0.9+2, g*0.97+8, b*0.95+10]; }).a;
})(M);
