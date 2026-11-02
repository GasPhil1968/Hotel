/* ===== rooms/art/shed.js — Dinkos Schuppen (konoba), nur Mala: niedriger Raum aus rohem Bruchstein.
   Netze hängen von den Balken, Ruder, ein alter Außenborder (Tomos), Bojen, Teerfässer, Kanister, eine Demižana.
   Auf dem Regalbrett der in Plastik gewickelte Segeltuch-Seesack „T.P.“, daneben das angeheftete Foto und der
   Kerzenstummel auf der Untertasse. Dunkel: Licht nur durch die Ritzen der Tür und durch das kleine Fenster. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320, H=144;
var VP=[150,70], RECT=[44,24,276,98], F=90, FY=98;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var R=M.R;
var DOOR=[128,44,28,54];                              // Tür in der Rückwand
var CRACKS=[135,142,149];                             // Ritzen zwischen den Brettern
var WINQ=M.wallQuad(SPEC,'L',10,30,34,48);            // kleines Fenster in der linken Wand
var SHELF={x0:178,x1:262,y:62};                       // Regalbrett rechts der Tür
var BAG=[184,42,42,20];                               // Seesack in Plastik
var PHOTO=[233,37,10,13], CANDLE=[234,55,8,7];

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function inPoly(x,y,pts){ return M.inPoly(x,y,pts); }
// Bruchstein (Voronoi), Licht von oben links
function stones(u,v,ramp,sw,sh,mort){ mort=mort||0.13; var cx=Math.floor(u/sw), cy=Math.floor(v/sh), d1=9, d2=9, bx=0, by=0, bi=0, bj=0;
  for (var j=cy-1;j<=cy+1;j++) for (var i=cx-1;i<=cx+1;i++){ var px=(i+0.15+hash(i,j)*0.7)*sw, py=(j+0.15+hash(i+31,j+17)*0.7)*sh, dx=(u-px)/sw, dy=(v-py)/sh, d=dx*dx+dy*dy;
    if (d<d1){ d2=d1; d1=d; bx=px; by=py; bi=i; bj=j; } else if (d<d2) d2=d; }
  var e=Math.sqrt(d2)-Math.sqrt(d1); if (e<mort) return ramp[0];
  var t=hash(bi*3+1,bj*5+2), k=t<0.3?1:(t<0.8?2:3); k=Math.min(k,ramp.length-1);
  var ly=(v-by)/sh, lx=(u-bx)/sw, l=-(lx*0.5+ly*1.1); if (l>0.32) k++; else if (l<-0.36) k--; if (e<mort+0.07 && ly>0.05) k--;
  if (hash(u*1.7,v*2.3)<0.05) k--; return ramp[cl(k,0,ramp.length-1)]; }
function netTex(x,y,ramp,m){ m=m||3; var a=((x+y)%m+m)%m, b2=((x-y)%m+m)%m, c=ramp[1]; if (a===0||b2===0) c=ramp[2]; if (a===0&&b2===0) c=ramp[3]; if (hash(x,y)<0.08) c=ramp[0]; return c; }

// ---------------------------------------------------------------- Licht: warm (Tür, Dämmerung auch Fenster), kalt (Fenster nachts, Mond)
var WARM={ dusk:M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.78+r*0.25+30, L*0.52+g*0.12+6, L*0.34+b*0.12+10]; }),
           night:M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.72+r*0.2+22, L*0.56+g*0.14+8, L*0.18+b*0.08]; }) };
var COLD={ dusk:M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.7+r*0.15+26, L*0.5+g*0.1+12, L*0.62+b*0.12+30]; }),
           night:M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+12, L*0.66+g*0.08+18, L*0.86+b*0.1+40]; }) };
var AMB={ dusk:M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.42+L*0.1+8, g*0.34+L*0.08+4, b*0.42+L*0.14+14]; }),
          night:M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.2+L*0.1, g*0.24+L*0.12+2, b*0.36+L*0.18+12]; }) };
function finishLit(b,tod,warm,cold,skip){ var A=AMB[tod]||AMB.dusk, Wt=WARM[tod]||WARM.dusk, Ct=COLD[tod]||COLD.dusk, d=b.d;
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, c=d[k]; if (c===T) continue; if (skip && skip(x,y)) continue;
    var bb=bayer(x,y), wv=(warm(x,y)-0.3)*2.6, cv=(cold(x,y)-0.3)*2.6, L=A; if (wv>0 && bb<wv) L=Wt; else if (cv>0 && bb<cv) L=Ct;
    var r=L.r[c]; d[k]=(r>0.2 && bb<(r-0.2)*1.4)?L.b[c]:L.a[c]; } return b; }
// Lichtfunktionen (0..1)
function doorLight(x,y){ var v=0;
  if (y>=FY-1){ var dy=y-FY+1, xl=DOOR[0]+2-dy*0.95, xr=DOOR[0]+DOOR[2]-2+dy*0.95; if (x>=xl && x<=xr){ var e=Math.min(x-xl,xr-x)/6; v=Math.min(1,e)*Math.max(0,0.8-dy/58); }
    CRACKS.forEach(function(cx){ var xs=cx+(cx-142)*2.4*dy/46, w=0.7+dy*0.05, d=Math.abs(x-xs); if (d<w) v=Math.max(v,(1-d/w)*Math.max(0,1-dy/70)); }); }
  // Streulicht auf der Rückwand um die Tür und auf dem Boden davor
  var dx=(x-142)/40, dy2=(y-94)/20; var q=dx*dx+dy2*dy2; if (q<1) v=Math.max(v,(1-q)*0.4);
  return v; }
var WC=[(WINQ[0][0]+WINQ[1][0]+WINQ[2][0]+WINQ[3][0])/4,(WINQ[0][1]+WINQ[1][1]+WINQ[2][1]+WINQ[3][1])/4];
function winBeam(x,y){ // breiter Strahl vom Fenster quer durch den Raum auf das Regal mit dem Seesack
  var ax=WC[0]+2, ay=WC[1], bx=206, by=56, vx=bx-ax, vy=by-ay, L2=vx*vx+vy*vy, t=((x-ax)*vx+(y-ay)*vy)/L2; if (t<0||t>1.25) return 0;
  var px=ax+vx*t, py=ay+vy*t, d=Math.hypot(x-px,y-py), w=7+11*Math.min(t,1); if (d>=w) return 0; var e=Math.min(1,(1-d/w)*1.7);
  var v=e*(0.26+0.32*Math.min(t,1)); var dx=(x-210)/36, dy=(y-52)/15, q=dx*dx+dy*dy; if (q<1) v=Math.max(v,Math.min(1,(1-q)*1.6)); return v; }
function winFloor(x,y){ var dx=(x-118)/40, dy=(y-122)/9, q=dx*dx+dy*dy; return q<1?(1-q)*0.32:0; }

// ---------------------------------------------------------------- Malen
function wallTex(u,v,x,y){ var c=stones(u,v,R('s0 s1 s2 s3 s4'),9,6,0.12); var f=fbm(u*0.05,v*0.06); if (f>0.62) c=M.DN[c]; if (v>58 && bayer(x,y)<(v-58)/60) c=M.DN[c];
  var wet=fbm(u*0.12+9,v*0.02); if (wet>0.66 && v>20) c=(hash(x,y)<0.5)?P.g1:M.DN[c]; return c; }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), x, y, i, k, night=tod==='night';
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return wallTex(u+40,v,x,y); },
    side:function(u,v,x,y,sd){ var c=wallTex(u*2.2+(sd==='L'?0:300),v,x,y); return M.DN[c]; },
    floor:function(xb,d,x,y){ var c=stones(xb*1.1,(y-FY)*2.6,R('e1 e1 e2 s1 s2'),16,7,0.07); if (hash(x>>1,y)<0.05) c=P.e0; return c; },
    ceil:function(xb,d,x,y){ var c=tex.boards(xb,d*3,R('w0 w1 w2 w3'),5); return M.DN[c]; } });
  // Deckenbalken (quer) mit Netzen
  [[0,FY],[30,FY],[64,FY]].forEach(function(bm,bi){ var Z=bm[0], yb=R3.p(0,RECT[1],Z)[1], th=Math.round(3+Z*0.07); var xa=Math.floor(R3.p(RECT[0],RECT[1],Z)[0]), xz=Math.ceil(R3.p(RECT[2],RECT[1],Z)[0]);
    for (y=Math.round(yb)-1;y<Math.round(yb)+th;y++) for (x=Math.max(0,xa);x<Math.min(W,xz);x++){ var c=tex.boards(x,y*6,R('w0 w1 w2 w3'),30); if (y===Math.round(yb)+th-1) c=P.w0; if (y===Math.round(yb)-1) c=P.w1; b.px(x,y,c); } });
  // ---- Tür in der Rückwand: Bretter mit Ritzen, Querriegel, Riegel
  var dx=DOOR[0], dy=DOOR[1], dw=DOOR[2], dh=DOOR[3];
  b.rect(dx-3,dy-3,dw+6,3,P.s2); b.hl(dx-3,dx+dw+2,dy-3,P.s3); b.rect(dx-3,dy,3,dh,P.s1); b.rect(dx+dw,dy,3,dh,P.s1);
  for (y=dy;y<dy+dh;y++) for (x=dx;x<dx+dw;x++){ var bi=Math.floor((x-dx)/7), c=hash(bi,4)<0.5?P.w2:P.w1; if ((x-dx)%7===0) c=P.w0; if (hash(x,y*2)<0.07) c=P.w0; if (fbm(x*0.3,y*0.1)>0.64) c=P.w3; b.px(x,y,c); }
  [dy+8,dy+dh-12].forEach(function(hy){ b.rect(dx+1,hy,dw-2,3,P.w2); b.hl(dx+1,dx+dw-2,hy,P.w3); b.hl(dx+1,dx+dw-2,hy+2,P.w0); });
  b.line(dx+2,dy+dh-10,dx+dw-3,dy+11,P.w2); b.line(dx+2,dy+dh-9,dx+dw-3,dy+12,P.w0);
  b.rect(dx+3,dy+27,7,2,P.m1); b.px(dx+3,dy+27,P.m2); b.rect(dx+9,dy+26,2,4,P.m1);
  // ---- Regalbrett mit dem Seesack, Foto, Kerzenstummel
  var sy=SHELF.y; b.rect(SHELF.x0,sy,SHELF.x1-SHELF.x0,3,P.w3); b.hl(SHELF.x0,SHELF.x1-1,sy,P.w4); b.hl(SHELF.x0,SHELF.x1-1,sy+2,P.w1); b.hl(SHELF.x0+1,SHELF.x1-2,sy+3,P.k1);
  [SHELF.x0+6,SHELF.x1-8].forEach(function(bx){ b.line(bx,sy+3,bx+5,sy+10,P.m1); b.vl(bx,sy+3,sy+10,P.m0); b.hl(bx,bx+5,sy+10,P.m0); });
  // Seesack: liegende Segeltuchrolle, in Plastikfolie gewickelt, Verschnürung, verblichenes T.P.
  var bx0=BAG[0], by0=BAG[1], bw=BAG[2], bh=BAG[3], bcy=by0+bh*0.58, brx=bw/2-2, bry=bh*0.42;
  for (y=by0;y<sy;y++) for (x=bx0;x<bx0+bw;x++){ var u=(x-bx0)/bw, ex=Math.abs(u-0.5)*2, rr=bry*Math.sqrt(Math.max(0,1-Math.pow(ex,6))); var top=bcy-rr, bot=Math.min(sy-1,bcy+rr*0.9); if (y<top||y>bot) continue;
    var v=(y-top)/Math.max(1,bot-top), c=ra(R('e0 e1 e2 e3 e4 s4'),0.92-v*0.75-(ex>0.8?0.2:0),x,y); if (Math.abs(Math.sin(u*22+v*2))<0.1 && v>0.2) c=M.DN[c]; b.px(x,y,c); }
  b.ellipse(bx0+3,bcy,3,bry*0.85,function(x,y){ return ra(R('e1 e2 e3'),0.8-(y-by0)/bh*0.6,x,y); });
  b.line(bx0,bcy-1,bx0-3,bcy-3,P.e2); b.line(bx0,bcy,bx0-4,bcy+1,P.e1); b.px(bx0-4,bcy-3,P.e3);
  [bx0+11,bx0+bw-12].forEach(function(rx){ for (y=Math.round(bcy-bry)+1;y<sy;y++) b.px(rx+((y&1)?0:1),y,P.w1); });
  M.microText(b,'T.P.',bx0+15,Math.round(bcy)-3,P.e1); b.px(bx0+16,Math.round(bcy)-2,P.e2); b.px(bx0+24,Math.round(bcy)-1,P.e2);
  // Folie: Glanzlichter, Knick, abstehende Ecke
  for (i=0;i<18;i++){ var fx=bx0+2+Math.floor(hash(i,1)*(bw-4)), fy=Math.round(bcy-bry+1+hash(i,2)*bry*1.4); var u2=(fx-bx0)/bw, ex2=Math.abs(u2-0.5)*2; if (fy<bcy-bry*Math.sqrt(Math.max(0,1-Math.pow(ex2,6)))+1) continue; b.px(fx,fy,i%4===0?P.s6:P.s5); }
  b.line(bx0+5,Math.round(bcy-bry)+2,bx0+14,Math.round(bcy-bry)+1,P.s5); b.line(bx0+27,Math.round(bcy-bry)+1,bx0+37,Math.round(bcy-bry)+4,P.s4); b.line(bx0+bw-3,Math.round(bcy)+2,bx0+bw+2,Math.round(bcy)+5,P.s4); b.px(bx0+bw+2,Math.round(bcy)+6,P.s5);
  // Farbdose, Gläser mit Nägeln, Tauknäuel auf dem Regal
  b.rect(246,54,7,8,P.b1); b.hl(246,252,54,P.b3); b.vl(252,54,61,P.b0); b.rect(247,56,5,3,P.s4);
  b.rect(255,56,5,6,P.s3); b.hl(255,259,56,P.m3); b.px(256,59,P.m1); b.px(257,58,P.m2);
  // Foto (junger Mann), mit Reißzwecke angeheftet, darunter Untertasse mit Kerzenstummel
  var phx=PHOTO[0], phy=PHOTO[1]; b.rect(phx,phy,PHOTO[2],PHOTO[3],P.s5); b.rect(phx+1,phy+1,PHOTO[2]-2,PHOTO[3]-3,P.e2);
  b.rect(phx+2,phy+7,6,4,P.c1); b.ellipse(phx+5,phy+5,1.8,2.2,P.q3); b.rect(phx+3,phy+2,4,2,P.h2); b.px(phx+4,phy+5,P.q1); b.px(phx+6,phy+5,P.q1); b.rect(phx+1,phy+1,PHOTO[2]-2,1,P.e3);
  b.px(phx+PHOTO[2]-2,phy+PHOTO[3]-2,P.e1); b.px(phx+5,phy-1,P.r3); b.px(phx+5,phy,P.m3);
  var cx=CANDLE[0], cy=CANDLE[1]; b.ellipse(cx+4,cy+6,4,1.2,P.s4); b.hl(cx+1,cx+7,cy+6,P.s5); b.rect(cx+3,cy+2,2,4,P.s6); b.px(cx+3,cy+2,P.s5); b.px(cx+4,cy+1,P.k2); b.px(cx+2,cy+5,P.s5); b.px(cx+5,cy+4,P.s5);
  // Tauwerk an Haken, Petroleumlampe am Nagel
  for (var a=0;a<20;a++){ var ang=a/20*Math.PI*2; b.px(rnd(74+Math.cos(ang)*6),rnd(52+Math.sin(ang)*8),a%2?P.e3:P.e2); b.px(rnd(74+Math.cos(ang)*4.5),rnd(52+Math.sin(ang)*6),P.e1); } b.rect(73,43,2,2,P.m2);
  b.vl(104,38,42,P.m1); b.rect(101,43,7,2,P.m1); b.rect(102,45,5,7,P.s3); b.rect(103,46,3,5,P.a1); b.hl(101,107,52,P.m1); b.px(104,48,P.y2);
  // Netze an Pflöcken links an der Rückwand
  for (y=30;y<92;y++) for (x=48;x<70;x++){ var sw=Math.sin((y-30)*0.12)*3, edge=Math.abs(x-59-sw)<9-((y-30)/62)*4; if (!edge) continue; b.px(x,y,netTex(x,y,R('t0 t1 t2 t3'),3)); }
  for (x=50;x<69;x+=3) b.px(x,31,P.s5);
  // ---- linke Wand: Fenster mit Gitter (Glas schmutzig), Bojen, Rettungsring
  var wq=WINQ; b.poly([[wq[0][0]-2,wq[0][1]-2],[wq[1][0]-2,wq[1][1]-2],[wq[2][0]-2,wq[2][1]+2],[wq[3][0]-2,wq[3][1]+2]],P.s1);
  b.poly(wq,P.k2); for (k=1;k<3;k++){ var ta=M.wallPt(SPEC,'L',10+k*20/3,34), tb=M.wallPt(SPEC,'L',10+k*20/3,48); b.line(rnd(ta[0]),rnd(ta[1]),rnd(tb[0]),rnd(tb[1]),P.m0); }
  var mb0=M.wallPt(SPEC,'L',10,41), mb1=M.wallPt(SPEC,'L',30,41); b.line(rnd(mb0[0]),rnd(mb0[1]),rnd(mb1[0]),rnd(mb1[1]),P.m0);
  [[18,P.t3],[30,P.s5],[42,P.t3]].forEach(function(bo){ var p=M.wallPt(SPEC,'L',bo[0],60); b.ellipse(p[0],p[1]+4,3.2,4,bo[1]); b.px(rnd(p[0])-1,rnd(p[1])+2,M.UP[bo[1]]); b.vl(rnd(p[0]),rnd(p[1])-3,rnd(p[1]),P.e1); });
  var lr=M.wallPt(SPEC,'L',56,66); b.ellipse(lr[0],lr[1],6,7,P.r3); b.ellipse(lr[0],lr[1],3,4,function(x,y){ return M.DN[wallTex(x*2,y,x,y)]; }); b.px(rnd(lr[0])-4,rnd(lr[1])-3,P.s6); b.px(rnd(lr[0])+4,rnd(lr[1])+3,P.s6); b.px(rnd(lr[0])-5,rnd(lr[1])+2,P.s6);
  // ---- rechte Wand: Ruder, Reuse (vrša)
  [[300,2,286,104],[308,0,296,110],[315,4,306,118]].forEach(function(o,oi){ b.line(o[0],o[1],o[2],o[3],P.w3); b.line(o[0]+1,o[1],o[2]+1,o[3],P.w2); b.poly([[o[2]-3,o[3]-18],[o[2]+4,o[3]-18],[o[2]+3,o[3]],[o[2]-2,o[3]]],oi===1?P.b1:P.w3); b.vl(o[2],o[3]-17,o[3]-1,oi===1?P.b2:P.w4); });
  b.ellipse(290,62,10,8,function(x,y){ return ((x+y)%3===0||(x-y)%3===0)?P.e2:((hash(x,y)<0.5)?T:P.e1); }); b.ellipse(290,62,4,4,P.k1);
  // ---- Boden: Teerfass, Kanister, Außenborder auf dem Bock, Anker, Demižana, Tauknäuel
  // Außenborder (TOMOS) am Holzbock: Haube, Schaft, Unterwasserteil mit Schraube
  b.line(222,126,230,100,P.w2); b.line(223,126,231,100,P.w1); b.line(256,126,248,100,P.w2); b.line(236,124,239,100,P.w1); b.rect(226,97,28,3,P.w3); b.hl(226,253,97,P.w4); b.hl(226,253,99,P.w1);
  b.ellipse(240,84,10,8,function(x,y){ var v=(y-76)/16, u=(x-230)/20, c=ra(R('m1 m2 m3 m4 s5'),0.95-v*0.6-u*0.25,x,y); return c; }); b.rect(231,86,19,6,P.m2); b.hl(231,249,86,P.m3); b.hl(231,249,91,P.m0);
  b.hl(232,248,82,P.r2); b.hl(232,248,83,P.r3); M.microText(b,'TOMOS',231,77,P.k2);
  b.rect(237,92,6,5,P.m0); b.rect(238,97,4,20,P.m1); b.vl(238,97,116,P.m2); b.vl(241,97,116,P.m0);
  b.ellipse(240,119,4,3,P.m1); b.rect(236,117,8,3,P.m1); b.vl(244,116,122,P.m2); b.vl(245,115,123,P.m3); b.px(246,116,P.m2); b.px(246,122,P.m2); b.vl(240,121,124,P.m0);
  b.line(250,84,262,80,P.k2); b.rect(260,78,6,3,P.k1); b.px(261,78,P.m2);
  // Teerfass links vorn, Kanister rechts vorn
  M.prop.barrel(b,72,122,9,18,{ramp:R('k0 k1 k2 m0')}); for (k=0;k<5;k++) b.vl(66+k*3,104,105+Math.floor(hash(k,9)*5),P.k0); b.hl(63,81,108,P.m1); b.hl(63,81,117,P.m1);
  M.prop.barrel(b,90,116,7,14,{ramp:R('t0 t1 t2 t3')});
  [[262,128,P.r3],[274,126,P.y3]].forEach(function(cn){ var x0=cn[0], y0=cn[1], cc=cn[2]; b.rect(x0,y0-14,11,14,cc); b.hl(x0,x0+10,y0-14,M.UP[cc]); b.vl(x0+10,y0-14,y0-1,M.DN[cc]); b.rect(x0+2,y0-17,3,3,P.k2); b.rect(x0+6,y0-16,4,2,M.DN[cc]); b.hl(x0+1,x0+9,y0-8,M.DN[cc]); });
  // Demižana im Korbgeflecht
  b.ellipse(108,124,7,8,function(x,y){ return ((x+y*2)%3===0)?P.e1:(((x-y)%4===0)?P.e3:P.e2); }); b.rect(106,113,4,4,P.g2); b.px(107,112,P.e1);
  // Anker und Tauknäuel
  b.vl(180,112,124,P.m1); b.line(174,121,180,125,P.m1); b.line(186,121,180,125,P.m1); b.hl(176,184,113,P.m1); b.ellipse(180,111,2,1.5,P.m2);
  for (a=0;a<26;a++){ var ang2=a/26*Math.PI*2; b.px(rnd(152+Math.cos(ang2)*9),rnd(128+Math.sin(ang2)*2.6),a%2?P.e3:P.e2); b.px(rnd(152+Math.cos(ang2)*6),rnd(128+Math.sin(ang2)*1.6),P.e2); }
  // Kiste mit leeren Flaschen
  b.rect(196,108,20,10,P.w2); b.hl(196,215,108,P.w3); b.vl(215,108,117,P.w0); for (x=198;x<214;x+=4){ b.rect(x,101,2,7,P.g2); b.px(x,100,P.g3); b.px(x,102,P.g4); }
  // ---- Licht: dunkel, nur Tür und Fenster
  var LF=function(x,y){ var v=-0.7; v+=doorLight(x,y)*2.9; v+=winBeam(x,y)*2.6; v+=winFloor(x,y)*1.6; var vx=(x-160)/190, vy=(y-80)/110; v-=Math.max(0,vx*vx+vy*vy-0.25)*3; if (y<RECT[1]) v-=0.6; return v; };
  M.light(b,LF);
  var warm=function(x,y){ return doorLight(x,y)*1.1+(night?0:winBeam(x,y)+winFloor(x,y)); }, cold=function(x,y){ return night?(winBeam(x,y)*1.05+winFloor(x,y)):0; };
  finishLit(b,tod,warm,cold);
  // Schlüsseldetails nach dem Licht in festen Farben: T.P. auf dem Seesack, das Foto, der Kerzenstummel
  var lb=night?[P.n0,P.n2,P.n3,P.n4]:[P.w1,P.e2,P.e3,P.s5], tpx=BAG[0]+15, tpy=Math.round(BAG[1]+BAG[3]*0.58)-3;
  var tt=new M.Buf(16,5,T); M.microText(tt,'T.P.',0,0,lb[0]); b.blit(tt,tpx,tpy); b.px(tpx+1,tpy+1,lb[1]); b.px(tpx+9,tpy+3,lb[1]);
  var phx=PHOTO[0], phy=PHOTO[1], pw=PHOTO[2], ph=PHOTO[3];
  b.rect(phx,phy,pw,ph,night?P.n3:P.s5); b.rect(phx+1,phy+1,pw-2,ph-3,night?P.n1:P.e3); b.rect(phx+1,phy+ph-5,pw-2,3,night?P.n0:P.e2);
  b.ellipse(phx+pw/2,phy+5,1.9,2.3,night?P.n3:P.q3); b.rect(phx+3,phy+2,4,2,night?P.k2:P.h2); b.rect(phx+2,phy+8,pw-4,3,night?P.k2:P.c1); b.px(phx+4,phy+5,night?P.n1:P.q1); b.px(phx+6,phy+5,night?P.n1:P.q1);
  b.px(phx+Math.floor(pw/2),phy-1,P.r3); b.px(phx+Math.floor(pw/2),phy,night?P.n4:P.m3); b.px(phx+pw-1,phy+ph-1,night?P.n2:P.s3);
  var cx2=CANDLE[0], cy2=CANDLE[1]; b.ellipse(cx2+4,cy2+6,4,1.2,night?P.n2:P.s3); b.hl(cx2+1,cx2+7,cy2+6,night?P.n3:P.s4); b.rect(cx2+3,cy2+2,2,4,night?P.n4:P.s6); b.px(cx2+3,cy2+2,night?P.n3:P.s5); b.px(cx2+4,cy2+1,P.k1); b.px(cx2+2,cy2+5,night?P.n3:P.s5); b.px(cx2+5,cy2+5,night?P.n3:P.s5);
  // ---- Lichtquellen selbst: leuchtende Ritzen, Fensterglas
  var cr=night?[P.y3,P.y4,P.y5]:[P.d5,P.d6,P.l0];
  CRACKS.forEach(function(cx,ci){ for (y=dy+1;y<dy+dh-1;y++){ if (hash(cx,y)<0.12) continue; b.px(cx,y,(y%7===0)?cr[1]:cr[ci===1?2:1]); } });
  b.hl(dx+1,dx+dw-2,dy+dh-1,cr[2]); b.hl(dx+2,dx+dw-3,dy+dh-2,cr[0]); b.vl(dx+dw-1,dy+2,dy+dh-2,cr[0]); b.hl(dx+3,dx+dw-4,dy,cr[0]);
  var gl=night?[P.n2,P.n3,P.n4]:[P.d4,P.d5,P.d6]; b.poly(WINQ,function(x,y){ var v=(y-24)/22; return M.rampAt(gl,0.85-v*0.5,x,y); });
  for (k=1;k<3;k++){ var ta2=M.wallPt(SPEC,'L',10+k*20/3,34), tb2=M.wallPt(SPEC,'L',10+k*20/3,48); b.line(rnd(ta2[0]),rnd(ta2[1]),rnd(tb2[0]),rnd(tb2[1]),P.k1); }
  b.line(rnd(mb0[0]),rnd(mb0[1]),rnd(mb1[0]),rnd(mb1[1]),P.k1);
  for (i=0;i<10;i++){ var sx=rnd(WINQ[0][0]+hash(i,3)*(WINQ[1][0]-WINQ[0][0])), sy2=rnd(30+hash(i,4)*12); if (inPoly(sx,sy2,WINQ)) b.px(sx,sy2,gl[0]); }
  return b; }

// ---------------------------------------------------------------- Ebenen: Netz vorn von der Decke, Teerfass vorn
function layers(S,GS,tod){ var L=[];
  var n=M.layer(0,0,70,64,200), w=M.lw(n); // ganz vorn, immer über den Figuren
  for (var y=0;y<62;y++) for (var x=0;x<70;x++){ var sag=8+Math.sin(x*0.09)*6+(x>40?(x-40)*0.6:0), lim=sag+((x*7)%13===0?10:0); if (y>lim) continue; if (y>sag-1 && hash(x,y)<0.4) continue; var c=netTex(x,y,R('k0 k1 k2 w0'),3); if (y<3) c=P.k1; w.px(x,y,c); }
  for (var k=0;k<5;k++){ var fx=6+k*12, fy=Math.round(10+Math.sin(fx*0.09)*6); w.rect(fx,fy,2,2,P.w0); }
  L.push(n);
  var f=M.layer(0,108,44,36,200), fw=M.lw(f); // Fass am linken Rand vorn
  for (y=112;y<144;y++) for (x=0;x<32;x++){ var u=(x+2)/36, c2=M.rampAt(R('k0 k1 k2 m0 m1'),Math.sin(u*Math.PI)*0.75-(u>0.6?0.25:0),x,y); if ((y-112)%10===0||(y-112)%10===1) c2=(y-112)%10===0?P.m1:P.k0; fw.px(x,y,c2); }
  fw.ellipse(14,111,16,3,P.k0); fw.ellipse(14,111,13,2,P.k1); fw.hl(4,24,110,P.m0); for (var k2=0;k2<4;k2++) fw.vl(6+k2*6,112,114+Math.floor(hash(k2,3)*6),P.k0);
  L.push(f);
  return L; }

// ---------------------------------------------------------------- dynamisch: Staub in den Strahlen, flackernde Ritzen (Wind)
function dyn(fb,v,S,GS){ var t=v.t, night=v.tod==='night';
  var col=night?P.n3:P.d5;
  for (var i=0;i<22;i++){ var u=(hash(i,1)+t*0.012*(0.5+hash(i,2)))%1, x=Math.round(WC[0]+8+(206-WC[0]-8)*u+Math.sin(t*0.7+i)*3), y=Math.round(WC[1]+(56-WC[1])*u+(hash(i,3)-0.5)*16+Math.sin(t*0.5+i*2)*2);
    if (winBeam(x,y)>0.25 && Math.sin(t*1.7+i*1.3)>-0.2) fb.px(x,y,night?P.n4:P.d6); }
  for (i=0;i<12;i++){ var x2=Math.round(128+hash(i,7)*30+Math.sin(t*0.4+i)*4), y2=Math.round(100+((hash(i,8)*40+t*(1.5+hash(i,9)*2))%40)); if (doorLight(x2,y2)>0.2 && Math.sin(t*2+i)>0) fb.px(x2,y2,col); }
  var fl=Math.sin(t*3.1)+Math.sin(t*7.3); if (fl>1.4){ var cx=CRACKS[1]; for (var y3=DOOR[1]+4;y3<DOOR[1]+DOOR[3]-4;y3+=3) fb.px(cx,y3,night?P.y2:P.d4); } }
// ---------------------------------------------------------------- Geistersicht: schwacher Schimmer um den Seesack
function ghost(fb,v,S,GS){ var t=v.t, cx=BAG[0]+BAG[2]/2, cy=BAG[1]+BAG[3]*0.6;
  for (var a=0;a<64;a++){ var ang=a/64*Math.PI*2, rr=1+0.12*Math.sin(ang*3+t*1.3), x=Math.round(cx+Math.cos(ang)*(BAG[2]/2+3)*rr), y=Math.round(cy+Math.sin(ang)*(BAG[3]*0.5+3)*rr); if (Math.sin(ang*5-t*2)>0.1) fb.px(x,y,a%3?P.x4:P.x5); }
  for (var i=0;i<10;i++){ var u=(hash(i,4)+t*0.05)%1, x2=Math.round(cx+(hash(i,5)-0.5)*BAG[2]), y2=Math.round(cy-u*16); if (Math.sin(t*2+i)>0.3) fb.px(x2,y2,u<0.5?P.x5:P.x4); }
  if (Math.sin(t*1.1)>0.5) fb.px(BAG[0]+18,BAG[1]+10,P.x6); }

// ---------------------------------------------------------------- Lauffläche (Mala)
function walk(x,y){ var f=R3.floor(x,y); if (!f) return false; if (y<104||y>=139) return false; if (f.X<RECT[0]+6||f.X>RECT[2]-8) return false;
  if (x<40&&y<128) return false;               // Fass vorn links
  if (x>=62&&x<98&&y<124) return false;        // Teerfässer
  if (x>=218&&x<258&&y<126) return false;      // Außenborder auf dem Bock
  if (x>=258&&x<288&&y<130) return false;      // Kanister
  if (x>=100&&x<116&&y<130) return false;      // Demižana
  if (x>=194&&x<218&&y<119) return false;      // Flaschenkiste
  return true; }
var wqx=Math.floor(Math.min(WINQ[0][0],WINQ[3][0])), wqy=Math.floor(Math.min(WINQ[0][1],WINQ[1][1]));
M.defineArt('shed',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  spots:{ door:[DOOR[0]-3,DOOR[1]-3,DOOR[2]+6,DOOR[3]+3], seabag:[BAG[0]-1,BAG[1]-2,BAG[2]+2,BAG[3]+2], photo:[PHOTO[0]-1,PHOTO[1]-2,PHOTO[2]+2,PHOTO[3]+3], candle:[CANDLE[0]-1,CANDLE[1],CANDLE[2]+2,CANDLE[3]+1],
    nets:[46,28,26,66], motor:[222,76,40,50], oars:[282,0,38,118], window:[wqx-2,wqy-2,Math.ceil(Math.max(WINQ[1][0],WINQ[2][0]))-wqx+4,26] },
  stands:{ door:[142,106,'B'], seabag:[188,112,'B'], photo:[226,128,'B'], candle:[230,128,'B'], nets:[62,128,'L'], motor:[236,130,'B'], oars:[280,132,'R'], window:[58,130,'L'] },
  start:[142,108,'F'], entries:{ matejuska:[142,106,'F'] }
});
})(M);
