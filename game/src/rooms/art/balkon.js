/* ===== rooms/art/balkon.js — Davors Balkon in Moosach (320 px) =====
   Ein kleiner Balkon im dritten Stock eines Mietshauses: links die Hauswand mit Balkontür und Wohnzimmerfenster (drinnen warmes
   Licht, Sofa, Regal, eine Grünpflanze), rechts das Gitter mit Schnee auf dem Handlauf und ein leerer Blumenkasten. Am Gitter der
   Blumentopf mit einem kurzen Feigenzweig unter einer Plastiktüte, die Erde nass und dunkel; daneben eine Gießkanne, ein
   Klappstuhl mit Schnee auf der Sitzfläche. Der Boden ist freigeschaufelt, der Schnee liegt an den Rändern. Dahinter die Dächer
   eines Münchner Wohnviertels mit Kaminen und Gauben, ein paar höhere Blocks, kahle Baumkronen. Kein Ortsname im Bild.
   Geistersicht: am Zweig ein winziger Schimmer, wie ein Ast in einem anderen Sommer. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
var FY=104;                                                // Hinterkante des Balkonbodens
var WALLX=178;                                             // Ende der Hauswand (Hausecke)
var DOOR={x0:24,x1:54,y0:32};                              // Balkontür
var WIN={x0:68,x1:126,y0:34,y1:82};                        // Wohnzimmerfenster
var RAIL={top:82, base:104};                               // Gitter
var POT={x:204,by:110};
var CAN={x:230,by:110};
var CHAIR={x:262,by:111};
// ---------------------------------------------------------------- kleine Helfer
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function fwOn(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks && M.k4Fireworks(GS)); }
var REG=new Uint8Array(W*H), SNW=new Uint8Array(W*H), RG={sky:0,far:1,roofs:2,wall:3,glass:4,rail:5,floor:6,prop:7};
function RW(b){ var o={g:0,s:0,w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; SNW[k]=o.s; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.25+L*0.1, b*0.4+L*0.18+16]; },
  nsnow:function(r,g,b){ var L=lum(r,g,b); return [r*0.24+L*0.14+6, g*0.3+L*0.16+10, b*0.44+L*0.22+28]; },
  dusk:function(r,g,b){ return [r*0.78+16, g*0.58+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=6, A=TF[k]||TF.night, B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.15)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function nkey(tod){ return tod==='night'?'night':(TF[tod]?tod:null); }
function shade(buf,ox,oy,tod,Ls,useSnow){ var key=nkey(tod); if (!key) return; var L=levels(key), LS=levels(tod==='night'?'nsnow':key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy, gk=Y*W+X;
    if (useSnow && (REG[gk]===RG.sky||REG[gk]===RG.glass)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx((useSnow&&SNW[gk])?LS[i]:L[i],c,X,Y); } }

// ---------------------------------------------------------------- Himmel und Dächer des Viertels
function paintSky(w,tod,we){ var x, y, i, r=M.rng(83); w.g=RG.sky; w.s=0;
  if (tod!=='night'){
    if (we==='snow'){ var S1=R('m3 m4 s4 s5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(S1,0.2+y/90*0.75+(fbm(x*0.02,y*0.06,3)-0.5)*0.22,x,y)); return; }
    if (we==='fog'){ var F1=R('m3 m4 n5 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(F1,0.45+y/150+(fbm(x*0.01,y*0.04,5)-0.5)*0.14,x,y)); return; }
    if (we==='thaw'){ var G1=R('m2 m3 m4 s4'); for (y=0;y<H;y++) for (x=0;x<W;x++){ var cv=fbm(x*0.012+3,y*0.07,6); w.px(x,y,ra(G1,0.2+y/90*0.6+(cv-0.5)*0.5,x,y)); } return; }
    var D=R('b1 b2 b3 b4 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(D,(we==='sun'?0.1:0.18)+Math.pow(y/90,1.2)*0.82,x,y)); return; }
  var N=R('k0 k1 k2 n0 n1 n2'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N,0.04+Math.pow(y/90,1.5)*0.75,x,y));
  if (we!=='fog'&&we!=='thaw') for (i=0;i<120;i++) w.px(Math.floor(r()*W),Math.floor(Math.pow(r(),1.4)*60),r()<0.14?P.n5:P.n3); }
var WINS=[];
function paintRoofs(w,we){ var x, y, r=M.rng(19);
  // höhere Blocks in der Ferne
  w.g=RG.far; [[188,26,44],[252,18,50],[292,30,40]].forEach(function(q){ for (y=q[2];y<92;y++) for (x=q[0];x<q[0]+q[1];x++){ var u=x-q[0], c=(u===q[1]-1)?P.s2:((y-q[2])%5===0?P.s4:P.s3); if ((y-q[2])%5>=2 && u%4>0 && u<q[1]-1){ c=P.m1; if ((y-q[2])%5===3 && u%4===2) WINS.push([x,y,hash(x,y)]); } w.px(x,y,c); } w.s=1; w.hl(q[0],q[0]+q[1]-1,q[2]-1,P.s6); w.s=0; });
  // Satteldächer unter Schnee, Kamine, Gauben; Fassaden mit Fenstern
  w.g=RG.roofs; x=WALLX-6;
  while (x<W){ var bw=18+Math.floor(r()*22), ft=72+Math.floor(r()*8), rh=7+Math.floor(r()*5), fc=[R('e3 e4 s4'),R('s3 s4 s5'),R('t3 t4 t5')][Math.floor(r()*3)];
    for (y=ft;y<100;y++) for (var xx=x;xx<Math.min(W,x+bw);xx++){ var c=fc[1]; if (xx===x) c=fc[2]; if ((y-ft)%7>=3 && (y-ft)%7<6 && (xx-x)%6>=2 && (xx-x)%6<5){ c=P.k2; if ((y-ft)%7===4 && (xx-x)%6===3) WINS.push([xx,y,hash(xx,y*2)]); } w.px(xx,y,c); }
    for (var k=0;k<rh;k++){ var ins=Math.round(k*bw/(2*rh+1)); w.s=(we!=='thaw')?1:0; for (xx=x-1+ins;xx<Math.min(W,x+bw+1-ins);xx++){ var sc=(we==='thaw')?((xx+k)%3===0?P.t2:P.t3):((k===rh-1)?P.s6:((xx===x-1+ins)?P.n5:(hash(xx,k)<0.85?P.s6:P.b5))); w.px(xx,ft-1-k,sc); } w.s=0; }
    if (r()<0.7){ var cx=x+4+Math.floor(r()*(bw-8)); w.rect(cx,ft-rh-4,3,6,P.t2); w.vl(cx,ft-rh-4,ft-rh+1,P.t3); w.s=1; w.hl(cx-1,cx+3,ft-rh-5,P.s6); w.s=0; }
    if (r()<0.5 && bw>24){ var gx=x+bw/2-3; w.rect(rd(gx),ft-rh+2,6,4,fc[0]); w.rect(rd(gx)+1,ft-rh+3,4,3,P.k2); w.s=1; w.hl(rd(gx)-1,rd(gx)+6,ft-rh+1,P.s6); w.s=0; }
    x+=bw+(r()<0.3?3:1); }
  // kahle Baumkronen zwischen den Häusern
  for (var t=0;t<5;t++){ var tx=WALLX+10+Math.floor(hash(t,7)*130), ty=92; for (var q=0;q<40;q++){ var a=-Math.PI/2+(hash(t,q)-0.5)*2, L=4+hash(q,t)*10; w.line(tx,ty,rd(tx+Math.cos(a)*L),rd(ty+Math.sin(a)*L*0.8),P.w1); } } }

// ---------------------------------------------------------------- Hauswand, Balkontür, Fenster mit Blick ins Wohnzimmer
var GLASS=[];
function inside(x,y,lit){ var c=lit?P.w2:P.w1;                         // Wohnzimmer: Wand, Sofa, Regal, Pflanze
  if (y>WIN.y0+24) c=lit?P.r2:P.r1;
  if (y>WIN.y0+30) c=lit?P.w1:P.w0;
  if (x>WIN.x0+34 && x<WIN.x0+50 && y<WIN.y0+26){ c=((y-WIN.y0)%6===0)?(lit?P.w3:P.w1):(((x>>1)%3===0)?(lit?P.b2:P.c1):(lit?P.y2:P.w0)); }
  if (x>WIN.x0+4 && x<WIN.x0+10 && y>WIN.y0+10) c=(hash(x,y)<0.5)?P.g2:P.g3;
  return c; }
function wall(w,tod,we){ var x, y; w.g=RG.wall; w.s=0;
  for (y=0;y<FY;y++) for (x=0;x<WALLX;x++){ var c=ra(R('s3 s4 s5'),0.62+(fbm(x*0.04,y*0.05,3)-0.5)*0.25,x,y); if (x>=WALLX-4) c=(x===WALLX-1)?P.s2:P.s3; if (y>FY-4) c=P.s2; w.px(x,y,c); }
  // Balkonplatte darüber (Unterseite), Regenrinne an der Ecke
  for (y=0;y<6;y++) for (x=0;x<WALLX+8;x++) w.px(x,y,(y===5)?P.k2:(y===4?P.s2:P.s3)); w.s=1; for (x=WALLX-2;x<WALLX+8;x++) w.px(x,6,P.s6); w.s=0;
  // Balkontür (Glas) und Fenster
  var d=DOOR; w.rect(d.x0-3,d.y0-3,d.x1-d.x0+6,FY-d.y0+3,P.s6); w.rect(d.x0-1,d.y0-1,d.x1-d.x0+2,FY-d.y0+1,P.m4);
  w.g=RG.glass; for (y=d.y0+2;y<FY-14;y++) for (x=d.x0+2;x<d.x1-2;x++){ var c2=inside(x+40,y,false); if (((x-d.x0)*0.7+y)%17<1.6) c2=P.s4; w.px(x,y,c2); GLASS.push([x,y]); }
  w.g=RG.wall; w.rect(d.x0+2,FY-14,d.x1-d.x0-4,12,P.s5); w.hl(d.x0+2,d.x1-3,FY-14,P.s6); w.rect(d.x1-6,d.y0+36,2,6,P.m2);
  var wn=WIN; w.rect(wn.x0-3,wn.y0-3,wn.x1-wn.x0+6,wn.y1-wn.y0+6,P.s6); w.g=RG.glass;
  for (y=wn.y0;y<wn.y1;y++) for (x=wn.x0;x<wn.x1;x++){ var c3=inside(x,y,false); if (((x-wn.x0)*0.7+y)%23<2) c3=M.UP[M.UP[c3]]; w.px(x,y,c3); GLASS.push([x,y]); }
  w.g=RG.wall; w.rect(rd((wn.x0+wn.x1)/2)-1,wn.y0,2,wn.y1-wn.y0,P.s6); w.hl(wn.x0,wn.x1-1,wn.y0+16,P.s6);
  w.rect(wn.x0-5,wn.y1+2,wn.x1-wn.x0+10,3,P.s5); w.s=1; w.hl(wn.x0-5,wn.x1+4,wn.y1+1,P.s6); w.hl(wn.x0-3,wn.x1+2,wn.y1,hash(1,2)<2?P.b5:P.s6); w.s=0;
  // Rollladenkästen
  w.rect(d.x0-3,d.y0-8,d.x1-d.x0+6,5,P.s4); w.rect(wn.x0-3,wn.y0-8,wn.x1-wn.x0+6,5,P.s4); }

// ---------------------------------------------------------------- Balkonboden, Gitter, Blumenkasten
function floor(w,we){ var x, y, wet=we==='thaw', SN=wet?R('m2 m3 s3 m4'):R('n4 n5 b5 s6 l1'); w.g=RG.floor;
  for (y=FY;y<H;y++) for (x=0;x<W;x++){ var row=Math.floor((y-FY)/3), off=(row&1)*4, fx=(x+off)%9, fy=(y-FY)%3, tile=(fx===0||fy===0)?P.m2:((hash(Math.floor((x+off)/9),row)<0.5)?P.m3:P.s3); if (wet) tile=(fx===0||fy===0)?P.m1:P.m2;
    // freigeschaufelt: ein Band von der Tür zum Topf, Schnee an Wand und Gitter
    var cy=FY+20+Math.sin(x*0.03)*3, band=Math.abs(y-cy)<(9+(fbm(x*0.08,y*0.3,5)-0.5)*6) && x>22 && x<POT.x+16, c;
    if (!band){ w.s=1; c=ra(SN,0.66+(fbm(x*0.05,y*0.2,4)-0.5)*0.35-(y<FY+3?0.2:0),x,y); }
    else { w.s=0; c=tile; var rim=Math.abs(y-cy)>6; if (!wet && (rim||hash(x>>1,y)<0.06) && bayer(x,y)<0.5){ c=P.s5; w.s=1; } }
    w.px(x,y,c); }
  w.s=0; }
function railing(w,we){ var x, y; w.g=RG.rail; w.s=0;
  for (x=WALLX;x<W;x++){ w.px(x,RAIL.top,P.m3); w.px(x,RAIL.top+1,P.m1); w.px(x,RAIL.top+2,P.k2); w.px(x,RAIL.base-1,P.m1); if ((x-WALLX)%5===0) for (y=RAIL.top+3;y<RAIL.base-1;y++) w.px(x,y,P.k1); }
  for (x=WALLX;x<W;x+=40){ for (y=RAIL.top-1;y<RAIL.base;y++){ w.px(x,y,P.m2); w.px(x+1,y,P.k1); } }
  if (we!=='thaw'){ w.s=1; for (x=WALLX;x<W;x++){ w.px(x,RAIL.top-1,P.s6); if (hash(x,3)<0.6) w.px(x,RAIL.top-2,hash(x,4)<0.5?P.s6:P.b5); } w.s=0; }
  // leerer Blumenkasten am Gitter, mit Schnee
  w.g=RG.prop; w.rect(WALLX+66,RAIL.top-5,30,5,P.t2); w.hl(WALLX+66,WALLX+95,RAIL.top-5,P.t3); if (we!=='thaw'){ w.s=1; w.hl(WALLX+66,WALLX+95,RAIL.top-6,P.s6); w.hl(WALLX+68,WALLX+93,RAIL.top-7,P.s6); w.s=0; } }

// ---------------------------------------------------------------- Topf mit Feigenzweig unter der Tüte, Gießkanne, Klappstuhl
function pot(w,we){ var x=POT.x, by=POT.by, y; w.g=RG.prop; w.s=0;
  w.poly([[x-7,by-12],[x+7,by-12],[x+5,by],[x-5,by]],function(xx,yy){ return (xx<x-3)?P.t4:((xx>x+3)?P.t2:P.t3); }); w.hl(x-8,x+7,by-13,P.t4); w.hl(x-8,x+7,by-12,P.t2);
  w.hl(x-6,x+5,by-14,P.k2); w.hl(x-5,x+4,by-15,P.w0); w.px(x-3,by-15,P.m3); w.px(x+2,by-14,P.m2);                         // nasse dunkle Erde mit Glanz
  // der kurze Zweig unter der Plastiktüte
  w.vl(x,by-24,by-15,P.w1); w.px(x+1,by-20,P.w1); w.px(x+2,by-21,P.w2); w.px(x-1,by-22,P.w2);
  w.ellipse(x+0.5,by-21,5.5,8,function(xx,yy){ var e=Math.pow((xx-x-0.5)/5.5,2)+Math.pow((yy-by+21)/8,2); if (e<0.62 && bayer(xx,yy)<0.7) return T; return (e>0.86)?P.s4:((xx<x)?P.s6:P.s5); });
  w.hl(x-3,x+3,by-14,P.s5); w.px(x-4,by-26,P.l1); w.px(x+3,by-18,P.l1); w.line(x+1,by-13,x+4,by-11,P.r3); w.px(x+5,by-11,P.r3);   // Knoten, rotes Band
  if (we!=='thaw'){ w.s=1; w.px(x-1,by-29,P.s6); w.px(x,by-29,P.s6); w.s=0; } }
function can(w,we){ var x=CAN.x, by=CAN.by; w.g=RG.prop; w.s=0;
  w.rect(x-6,by-10,11,10,P.g2); w.vl(x-6,by-10,by-1,P.g3); w.vl(x+4,by-10,by-1,P.g1); w.hl(x-6,x+4,by-10,P.g4); w.ellipse(x-1,by-11,5,1.4,P.g3);
  w.line(x+4,by-7,x+11,by-14,P.g2); w.line(x+4,by-6,x+11,by-13,P.g1); w.rect(x+10,by-16,3,3,P.g3); w.line(x-5,by-12,x-3,by-16,P.g1); w.line(x-3,by-16,x+2,by-16,P.g1); w.line(x+2,by-16,x+3,by-12,P.g1);
  if (we!=='thaw'){ w.s=1; w.ellipse(x-1,by-11,4,1,P.s6); w.s=0; } }
function chair(w,we){ var x=CHAIR.x, by=CHAIR.by; w.g=RG.prop; w.s=0;
  w.line(x-6,by,x+5,by-16,P.m2); w.line(x+5,by,x-5,by-16,P.m1); w.line(x+5,by-16,x+6,by-28,P.m2); w.line(x+6,by-28,x-5,by-28,P.m2);
  w.rect(x-7,by-15,15,3,P.w3); w.hl(x-7,x+7,by-15,P.w4); w.rect(x-4,by-27,10,7,P.w3); w.hl(x-4,x+5,by-27,P.w4); w.hl(x-4,x+5,by-23,P.w2);
  if (we!=='thaw'){ w.s=1; w.hl(x-7,x+7,by-16,P.s6); w.hl(x-6,x+6,by-17,P.s6); w.hl(x-4,x+5,by-28,P.s6); w.s=0; } }

// ---------------------------------------------------------------- Bild
var BASE=null, LIT=[], WE='snowlie';
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k;
  WE=we; REG.fill(0); SNW.fill(0); WINS=[]; GLASS=[];
  paintSky(w,tod,we); paintRoofs(w,we);
  var fk={snow:[0.55,0.3],fog:[0.92,0.7],thaw:[0.4,0.2],snowlie:[0.22,0.08],sun:[0.15,0.05],frost:[0.18,0.06]}[we];
  var fc=tod==='night'?(we==='fog'?P.m1:P.n0):(we==='fog'?P.m4:(we==='thaw'?P.m3:(we==='snow'?P.m4:P.b4)));
  M.fogBake(b,function(xx,yy){ var g=REG[yy*W+xx]; if (g===RG.far) return fk[0]; if (g===RG.roofs) return fk[1]; return 0; },{col:fc});
  wall(w,tod,we); floor(w,we); railing(w,we); pot(w,we); can(w,we); chair(w,we);
  M.light(b,M.lf.sum(M.lf.pool(POT.x,POT.by+1,10,2,-0.8),M.lf.pool(CAN.x,CAN.by+1,9,2,-0.7),M.lf.pool(CHAIR.x,CHAIR.by+1,10,2,-0.7),M.lf.band(FY,FY+4,-0.5,0),M.lf.k(we==='thaw'?-0.2:(we==='sun'?0.12:0))),0,0,function(xx,yy){ var g=REG[yy*W+xx]; return g===RG.floor; });
  M.light(b,M.lf.sum(M.lf.xband(0,WALLX,-0.25,0),M.lf.k(we==='thaw'||we==='fog'?-0.2:0)),0,0,function(xx,yy){ return REG[yy*W+xx]===RG.wall; });
  if (we==='sun') for (k=0;k<W*H;k++){ if (SNW[k] && hash(k%W,(k/W)|0)<0.012) b.d[k]=P.l1; }
  BASE=b.clone(); LIT=tod==='day'?[]:[[(WIN.x0+WIN.x1)/2,96,70,30,0.7],[(DOOR.x0+DOOR.x1)/2,110,40,24,0.6]];
  shade(b,0,0,tod,LIT,true);
  // drinnen brennt Licht (am Tag gedämpft sichtbar, nachts hell)
  GLASS.forEach(function(q){ var c=BASE.get(q[0],q[1]); var lit=inside(q[0]>DOOR.x1?q[0]:q[0]+40,q[1],true); b.px(q[0],q[1],tod==='day'?(bayer(q[0],q[1])<0.35?lit:c):lit); });
  if (tod!=='day') WINS.forEach(function(q){ if (q[2]>0.55) b.px(q[0],q[1],q[2]>0.85?P.y4:P.y3); });
  return b; }

// ---------------------------------------------------------------- jedes Bild: Tropfen bei Tauwetter, Glitzern, Schnee, Nebel, Feuerwerk
var FWC=[[P.l1,P.y5,P.y4,P.y2],[P.l1,P.r4,P.r3,P.r2],[P.l1,P.b5,P.b3,P.b1],[P.l0,P.d6,P.d5,P.d3],[P.l1,P.g5,P.g4,P.g3],[P.l1,P.a6,P.a5,P.a3]];
function fireworks(fb,t,cam,x0,y0,x1,y1,n,rad,mask){
  function pl(X,Y,c){ X=rd(X)-cam; Y=rd(Y); if (X<0||X>=fb.w||Y<0||Y>=144) return; if (mask && !mask(X+cam,Y)) return; fb.px(X,Y,c); }
  for (var i=0;i<n;i++){ var per=3.1+hash(i,71)*2.3, ph=t/per+hash(i,72)*5, cyc=Math.floor(ph), u=ph-cyc; if (hash(cyc,i+76)<0.3) continue;
    var bx=x0+hash(i*13+cyc,73)*(x1-x0), by=y0+hash(cyc,i*7+74)*(y1-y0)*0.6, col=FWC[Math.floor(hash(cyc,i+75)*FWC.length)], rise=0.16;
    if (u<rise){ var q=u/rise, ry=y1+(by-y1)*q; pl(bx+Math.sin(q*7)*0.6,ry,col[1]); if (q>0.2) pl(bx,ry+1,col[3]); continue; }
    var kk=(u-rise)/(1-rise); if (kk>0.62) continue; kk/=0.62;
    var r=rad*Math.sqrt(kk), parts=12+Math.floor(hash(cyc,i)*6), ci=Math.min(3,Math.floor(kk*4.2));
    for (var p=0;p<parts;p++){ var a=p/parts*Math.PI*2+hash(cyc,p+i)*0.4, rr=r*(0.7+hash(p,cyc+i)*0.4), px=bx+Math.cos(a)*rr, py=by+Math.sin(a)*rr*0.85+kk*kk*6; pl(px,py,col[ci]); if (kk<0.45) pl(px-Math.cos(a)*1.2,py-Math.sin(a),col[Math.min(3,ci+1)]); }
    if (kk<0.12) pl(bx,by,P.l1); } }
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, we=WE, i;
  if (we==='thaw'){ for (i=0;i<4;i++){ var dx=WALLX+12+i*37, per=1.4+hash(i,4), q=(t/per+hash(i,5))%1, dy=RAIL.top+2+q*q*(FY+20-RAIL.top); if (dy<H) fb.px(dx,rd(dy),P.s5); } var px2=POT.x-4, q2=(t/1.9)%1; if (q2<0.6) fb.px(px2,rd(POT.by-14+q2*10),P.s5); }
  if (we==='sun') for (i=0;i<10;i++){ var gx=Math.floor(hash(i,41)*W), gy=FY+3+Math.floor(hash(i,42)*36); if (Math.sin(t*3.1+i*2.3)>0.84) fb.px(gx,gy,P.l1); }
  if (fwOn(S,GS)) fireworks(fb,t,0,WALLX+10,8,W-10,60,2,10,function(X,Y){ return REG[Y*W+X]===RG.sky; }); }
function front(fb,v,S,GS){ var we=WE, tod=v.tod;
  if (we==='snow') M.snow(fb,v.t,{n:80,wind:5,col:tod==='day'?P.s6:P.s5,col2:tod==='day'?P.s5:P.n4,mask:function(x,y){ return y>6; }});
  else if (we==='fog') M.fogDrift(fb,v.t,{y0:10,y1:144,amt:0.3,k:2,col:tod==='day'?P.m4:P.m1,speed:4}); }
// Geistersicht: am Zweig ein Schimmer wie ein Ast in einem anderen Sommer
function ghost(fb,v,S,GS){ var t=v.t, x0=POT.x, y0=POT.by-22, al=0.55+0.25*Math.sin(t*0.8);
  function gp(X,Y,c,a){ X=rd(X); Y=rd(Y); if (X<0||X>=320||Y<0||Y>=144) return; if (a!==undefined && bayer(X,Y+Math.floor(t*2))>a) return; fb.d[Y*320+X]=c; }
  // ein paar Feigenblätter (gelappt) um den Zweig, warm und kalt zugleich
  [[-9,-6,1],[8,-9,-1],[-5,-14,1],[6,-2,-1]].forEach(function(q,i){ var cx=x0+q[0], cy=y0+q[1], sway=Math.sin(t*0.9+i)*0.8;
    for (var yy=-4;yy<=4;yy++) for (var xx=-4;xx<=4;xx++){ var a=Math.atan2(yy,xx), rr=Math.hypot(xx,yy), lobe=3.2+Math.cos(a*3)*1.1; if (rr<lobe) gp(cx+xx+sway,cy+yy,rr<1.2?P.v5:(rr>lobe-1?P.x4:P.v4),al*0.9); }
    gp(cx+sway,cy,P.x6,al); gp(x0+q[0]*0.5,y0+q[1]*0.5,P.x3,al); });
  for (var k=0;k<8;k++){ var ph=(t*0.2+k/8)%1; gp(x0+Math.sin(k*2.1)*10,y0+6-ph*20,P.v5,Math.sin(ph*Math.PI)*0.7); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<116||y>138||x<30||x>290) return false; return true; }
M.defineArt('balkon',{
  width:W, paint:paint, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day') return null; var key=nkey(tod); if (!key) return null; var Lv=levels(key), l=lightAt(LIT,a.x,a.y-22); return Lv[Math.max(1,Math.min(Lv.length-1,Math.round(l*(Lv.length-1))))].a; },
  spots:{
    door:[DOOR.x0-4,DOOR.y0-8,DOOR.x1-DOOR.x0+8,FY-DOOR.y0+8],
    pot:[POT.x-9,POT.by-31,18,32],
    can:[CAN.x-8,CAN.by-18,22,19],
    view:[WALLX+2,10,W-WALLX-2,RAIL.top-12],
    chair:[CHAIR.x-8,CHAIR.by-30,16,31],
    window:[WIN.x0-4,WIN.y0-8,WIN.x1-WIN.x0+8,WIN.y1-WIN.y0+12]
  },
  stands:{ door:[42,118,'B'], pot:[196,120,'B'], can:[232,121,'B'], view:[250,118,'B'], chair:[268,122,'B'], window:[96,118,'B'] },
  actorPos:{ davor:[64,118,'R'], lena:[218,121,'L'], mala:[150,120,'R'] },
  start:[40,122,'R'], entries:{ map:[40,122,'R'] }
});
})(M);
