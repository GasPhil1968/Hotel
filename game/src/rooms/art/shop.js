/* ===== rooms/art/shop.js — Ninas Rahmenwerkstatt „Okvir“ in der Altstadt.
   Wände voller leerer Rahmen, dazwischen Ölbilder vom Hafen bei Nacht, Werkbank mit Glasschneider, Passepartoutschneider und Gehrungssäge,
   Werkzeugwand, Ladentisch mit Klingel und Kasse, kleines Radio, hinten der Vorhang „PRIVAT“, links Schaufenster und Ladentür zur Gasse. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320;
var VP=[172,48], RECT=[64,8,282,92], F=100, FY=92;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WINU=[10,34,24,72], DOORU=[40,58,28,92];    // Schaufenster und Ladentür in der linken Wand (u0,u1,vOben,vUnten)
var BENCH={X0:164,X1:222,Y0:78,Z0:30,Z1:44};   // Werkbank (Nina steht davor, mit dem Rücken zu uns)
var CNT={X0:92,X1:128,Y0:74,Z0:26,Z1:40};      // Ladentisch
var PRIV=[232,34,24,58];                       // Durchgang „PRIVAT“ in der Rückwand
var LAMP=[226,66];                             // Arbeitslampe über der Werkbank (Schirm)
function rnd(v){ return Math.round(v); }
function fy(Z){ return VP[1]+(FY-VP[1])*(1+Z/F); }
function q(sd,u,v){ var p=M.wallPt(SPEC,sd,u,v); return [rnd(p[0]),rnd(p[1])]; }
function inPoly(x,y,pts){ return M.inPoly(x,y,pts); }
var WINQ=M.wallQuad(SPEC,'L',WINU[0],WINU[1],WINU[2],WINU[3]), DOORQ=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]);
function inWin(x,y){ return inPoly(x+0.5,y+0.5,WINQ); }

// ---------------------------------------------------------------- kleine Malhilfen
function mirrorText(b,s,x,y,c){ var w=M.textWidth(s)+1, t=new M.Buf(w,9,T); M.text(t,s,0,0,c); b.blit(t,x,y,true); }
function plaster(u,v,x,y,ramp,base,seed){ seed=seed||0;
  var n=0.5*Math.sin(u*0.047+v*0.023+1.1+seed)+0.3*Math.sin(u*0.13-v*0.06+seed*2)+0.4*(hash(Math.floor(u/11)+seed,Math.floor(v/7))-0.5);
  return M.rampAt(ramp,base+n*0.12,x,y); }
// Rahmenprofile: Gold, Holz, Schwarz, Silber, Weiß
var FR={ gold:M.R('y0 y1 y2 y3 y4'), oak:M.R('w0 w2 w3 w4 w5'), dark:M.R('k1 k2 w0 w1 w2'), black:M.R('k0 k1 k2 m0 m1'), silver:M.R('m0 m1 m2 m3 m4'), white:M.R('s2 s3 s4 s5 s6'), red:M.R('r0 r1 r2 r3 r4') };
// leerer Rahmen mit Profil (hell oben/links, dunkel unten/rechts), innen die Wand
function frame(b,x,y,w,h,R,fw,ornate,inner){ fw=fw||2;
  for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var dx=Math.min(xx-x,x+w-1-xx), dy=Math.min(yy-y,y+h-1-yy), d=Math.min(dx,dy); if (d>=fw) continue;
    var top=(yy-y<fw)||(xx-x<fw && yy-y<h-fw), c=R[top?3:1]; if (d===0) c=R[top?2:0]; if (d===fw-1) c=R[top?4:1]; if (ornate && d===1 && ((xx+yy)%3===0)) c=R[4]; b.px(xx,yy,c); }
  if (inner!==undefined){ for (var yy2=y+fw;yy2<y+h-fw;yy2++){ b.px(x+fw,yy2,inner); } b.hl(x+fw,x+w-fw-1,y+fw,inner); } }
// das Motiv: Hafen bei Nacht, eine Fähre mit Lichtern, ein Kiosk, eine einzelne wartende Gestalt
function harborNight(b,x0,y0,w,h,seed){ var r=M.rng(seed||5), hz=y0+Math.round(h*0.48);
  for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c; if (y<hz) c=M.rampAt(M.R('k2 n0 n1 n2'),0.25+(y-y0)/(hz-y0)*0.6+(hash(x,y)-0.5)*0.25,x,y); else c=M.rampAt(M.R('k1 n0 n1'),0.65-(y-hz)/(y0+h-hz)*0.5+(hash(x>>1,y)-0.5)*0.3,x,y); b.px(x,y,c); }
  b.px(x0+Math.round(w*0.8),y0+2,P.n5); if (w>14) b.px(x0+Math.round(w*0.3),y0+1,P.n4);
  var fw=Math.max(6,Math.round(w*0.42)), fx=x0+Math.round(w*0.48), fh=Math.max(2,Math.round(fw*0.22));
  b.rect(fx,hz-fh,fw,fh,P.s4); b.rect(fx+Math.round(fw*0.2),hz-fh-Math.max(1,fh>>1),Math.round(fw*0.55),Math.max(1,fh>>1),P.s4); b.px(fx+Math.round(fw*0.6),hz-fh-Math.max(1,fh>>1)-1,P.r3);
  for (var i=fx+1;i<fx+fw-1;i+=2) b.px(i,hz-Math.max(1,fh>>1),P.y4);
  for (var gy=hz+1;gy<y0+h-1;gy+=2){ var gx=fx+Math.round(fw*0.4)+((gy*3)%3)-1; b.px(gx,gy,P.y3); if (w>16) b.px(gx+2,gy,P.y2); }
  var kx=x0+Math.max(1,Math.round(w*0.12)), ky=y0+h-Math.max(4,Math.round(h*0.34)), kw=Math.max(3,Math.round(w*0.16)), kh=Math.max(3,Math.round(h*0.22));
  b.rect(kx,ky,kw,kh,P.y3); b.hl(kx-1,kx+kw,ky-1,P.n2); b.px(kx+1,ky+1,P.y5);
  var gx2=kx+kw+1, gh=Math.max(3,Math.round(h*0.2)); b.vl(gx2,ky+kh-gh,ky+kh-1,P.k0); b.px(gx2,ky+kh-gh-1,P.k0); if (gh>4) b.px(gx2+1,ky+kh-gh+1,P.k0);
  b.hl(x0,x0+w-1,ky+kh,P.k1); }

// ---------------------------------------------------------------- Blick durchs Schaufenster in die Gasse
function alleyView(b,tod){ var night=tod==='night';
  b.poly(WINQ,function(x,y){ var c;
    if (!night){ c=(y<34)?M.rampAt(M.R('b3 b4 b5'),0.5+(34-y)*0.05,x,y):tex.ashlar(x*1.7,y,M.R('s3 s4 s5 s6'),9,5); if (y>66) c=tex.ashlar(x*1.7,y,M.R('m2 m3 s2 s3'),9,5); }
    else { c=(y<34)?P.n0:tex.ashlar(x*1.7,y,M.R('k2 n0 n1 n2'),9,5); var d=Math.hypot(x-44,y-44); if (d<12 && bayer(x,y)<(1-d/12)*0.9) c=(d<5)?P.y3:P.y1; }
    return c; }); }

function wallBack(u,v,x,y){ var c=plaster(u,v,x,y,M.R('e3 e4 s4 s5'),0.55,3); if (v<4) c=M.DN[c]; if (v>=78){ c=(v===78)?P.w3:((v>=82)?P.w1:P.w2); } return c; }
function wallSide(u,v,x,y,sd){ var c=plaster(u*2.3,v,x,y,M.R('e2 e3 e4 s4'),0.52,sd==='L'?9:17); if (v>=78){ c=(v===78)?P.w3:((v>=82)?P.w0:P.w1); } return sd==='L'?c:M.DN[c]; }
function floorTex(xb,d,x,y){ var c=tex.planks(xb,y,VP[1],FY,M.R('w1 w2 w3 w4'),9); var f=R3.floor(x,y); if (f && hash(Math.floor(f.X/2),Math.floor(f.Z))<0.018) c=P.e3; return c; }   // Dielen mit ein paar Sägespänen
function ceilTex(xb,d,x,y){ var c=((Math.floor(xb)%26)<3)?P.w0:P.w1; if (hash(Math.floor(xb/4),d)<0.1) c=P.w0; return c; }

// ---------------------------------------------------------------- Hintergrund
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), night=tod!=='day';
  var FLOOR=new Uint8Array(W*144);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:function(xb,d,x,y){ FLOOR[y*W+x]=1; return floorTex(xb,d,x,y); },ceil:ceilTex});
  [6,16].forEach(function(Z){ var yy=rnd(R3.p(0,8,Z)[1]); if (yy>=0){ b.hl(0,W-1,yy,P.w0); b.hl(0,W-1,yy+1,P.w2); } });
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.w0);
  // ---- Schaufenster (links) mit der Rückseite der ausgestellten Rahmen
  alleyView(b,tod);
  var wf=M.wallQuad(SPEC,'L',WINU[0]-1.5,WINU[1]+1.5,WINU[2]-2,WINU[3]+2);
  for (var e=0;e<4;e++) b.line(rnd(wf[e][0]),rnd(wf[e][1]),rnd(wf[(e+1)%4][0]),rnd(wf[(e+1)%4][1]),P.w1);
  for (var e2=0;e2<4;e2++) b.line(rnd(WINQ[e2][0]),rnd(WINQ[e2][1]),rnd(WINQ[(e2+1)%4][0]),rnd(WINQ[(e2+1)%4][1]),P.w3);
  var mu=(WINU[0]+WINU[1])/2, m0=q('L',mu,WINU[2]), m1=q('L',mu,WINU[3]); b.line(m0[0],m0[1],m1[0],m1[1],P.w2);
  var tr0=q('L',WINU[0],40), tr1=q('L',WINU[1],40); b.line(tr0[0],tr0[1],tr1[0],tr1[1],P.w2);
  // „OKVIR“ spiegelverkehrt auf der Scheibe
  var ok=q('L',15,30); mirrorText(b,'OKVIR',ok[0]-15,ok[1]+1,night?P.y2:P.y3);
  // Auslage: Podest mit Rahmen (von hinten)
  var pq=M.wallQuad(SPEC,'L',WINU[0],WINU[1],WINU[3],WINU[3]+6); b.poly([pq[0],pq[1],[pq[1][0],pq[1][1]+6],[pq[0][0],pq[0][1]+6]],P.w2);
  for (var k=0;k<4;k++){ var a=q('L',WINU[0]+3+k*5.5,WINU[3]-14+(k%2)*4), z=q('L',WINU[0]+6+k*5.5,WINU[3]); b.rect(a[0]-3,a[1],5,z[1]-a[1],[P.w1,P.y1,P.w0,P.k2][k]); b.vl(a[0]-3,a[1],z[1]-1,[P.w3,P.y3,P.w2,P.m1][k]); }
  // ---- Ladentür (links vorne) mit Glas und Türglocke
  b.poly(M.wallQuad(SPEC,'L',DOORU[0]-1.5,DOORU[1]+1.5,DOORU[2]-2,DOORU[3]),P.w3);
  b.poly(DOORQ,function(x,y){ return ((x+Math.floor(y/7))%6===0)?P.w1:P.w2; });
  var dg=M.wallQuad(SPEC,'L',DOORU[0]+3,DOORU[1]-3,DOORU[2]+4,56); b.poly(dg,function(x,y){ return night?((y<40)?P.n0:P.k2):((y<36)?P.b4:(hash(x,y)<0.2?P.s4:P.s5)); });
  var dp=M.wallQuad(SPEC,'L',DOORU[0]+3,DOORU[1]-3,62,86); b.poly(dp,P.w1);
  var kn=q('L',DOORU[0]+2,62); b.rect(kn[0],kn[1],2,3,P.y3); b.px(kn[0],kn[1],P.y5);
  var bl=q('L',DOORU[0]+1,DOORU[2]-6); b.line(bl[0],bl[1]-3,bl[0]+3,bl[1],P.k2); b.ellipse(bl[0]+3.5,bl[1]+2,2,2,P.y3); b.px(bl[0]+3,bl[1]+1,P.y5);   // Türglocke
  // ---- Rückwand: Rahmen in allen Größen, dazwischen Ölbilder vom Hafen bei Nacht
  var FRS=[ [70,14,22,16,'gold',3,1],[96,12,14,20,'oak',2],[114,14,18,13,'black',2],[136,12,26,18,'gold',3,1],[166,14,12,15,'silver',2],[182,12,20,14,'oak',3],[206,14,18,22,'dark',3],
            [70,34,13,18,'white',2],[86,36,20,14,'red',2],[134,34,10,12,'oak',2],[148,34,16,20,'black',2],[168,32,9,11,'gold',2,1],[226,40,0,0],
            [70,56,24,18,'oak',3],[98,54,14,10,'silver',2],[116,52,18,22,'gold',3,1],[138,58,12,14,'dark',2],[182,52,12,16,'white',2],[198,56,22,14,'oak',2],
            [260,12,20,16,'gold',3,1],[262,32,16,12,'black',2],[260,48,20,26,'oak',3] ];
  FRS.forEach(function(f){ if (!f[2]) return; frame(b,f[0],f[1],f[2],f[3],FR[f[4]],f[5],f[6]); b.hl(f[0]+1,f[0]+f[2],f[1]+f[3],P.e2); b.vl(f[0]+f[2],f[1]+1,f[1]+f[3],P.e2); b.px(f[0]+(f[2]>>1),f[1]-2,P.k2); });
  // Ölbilder: das Motiv, das Nina immer wieder malt
  frame(b,110,36,22,14,FR.gold,2,1); harborNight(b,112,38,18,10,3);
  frame(b,180,32,26,18,FR.dark,2); harborNight(b,182,34,22,14,7);
  frame(b,214,38,14,12,FR.oak,2); harborNight(b,216,40,10,8,11);
  // ovaler Goldrahmen
  b.ellipse(158,66,7,9,P.y1); b.ellipse(158,66,6,8,function(x,y){ return (x+y)%3===0?P.y4:(x<157?P.y3:P.y2); }); b.ellipse(158,66,4,6,function(x,y){ return wallBack(x-64,y-8,x,y); });
  // Musterecken der Leisten an einem Brett (typisch für Rahmenmacher)
  b.rect(226,62,0,0,P.k0);
  var mb=[84,76]; b.rect(mb[0]-1,mb[1]-1,30,9,P.w1); b.rect(mb[0],mb[1],28,7,P.w2);
  [FR.gold,FR.oak,FR.black,FR.silver,FR.red,FR.white,FR.dark].forEach(function(R,i){ var cx=mb[0]+1+i*4; b.rect(cx,mb[1]+1,3,2,R[3]); b.rect(cx,mb[1]+3,2,3,R[2]); b.px(cx+1,mb[1]+3,R[1]); });
  // Rahmen, die unten an der Wand lehnen
  [[66,72,16,18,'oak',3],[78,76,14,14,'gold',2,1],[190,74,18,16,'black',2],[204,78,12,12,'white',2]].forEach(function(f){ frame(b,f[0],f[1],f[2],f[3],FR[f[4]],f[5],f[6]); for (var xx=f[0]+1;xx<f[0]+f[2]+2;xx++){ var cc=b.get(xx,f[1]+f[3]); if (cc!==T) b.px(xx,f[1]+f[3],M.DN[cc]); } });
  // ---- Durchgang mit Holzperlenvorhang, dahinter die Tür „PRIVAT“
  var px0=PRIV[0], py0=PRIV[1], pw=PRIV[2], ph=PRIV[3];
  b.rect(px0-3,py0-3,pw+6,ph+3,P.w2); b.hl(px0-3,px0+pw+2,py0-3,P.w4); b.vl(px0-3,py0-3,py0+ph-1,P.w3); b.vl(px0+pw+2,py0-3,py0+ph-1,P.w0);
  for (var yy=py0;yy<py0+ph;yy++) for (var xx=px0;xx<px0+pw;xx++){ var c=((xx-px0)%11===0||(yy-py0)%26===0)?P.w0:P.w1; if (xx===px0+pw-1) c=P.k2; b.px(xx,yy,c); }   // Tür (dunkel)
  b.rect(px0+3,py0+30,2,3,P.y2); b.px(px0+3,py0+30,P.y4);
  // Perlenschnüre, in der Mitte auseinandergeschoben
  var BEAD=[P.w3,P.w4,P.y2,P.w2,P.e4];
  for (var bs=0;bs<pw;bs+=2){ var bxx=px0+bs, mid=Math.abs(bs-pw/2); if (mid<=7) continue; var bend=(bs<pw/2)?-1:1;
    for (var by2=py0;by2<py0+ph-1;by2+=2){ var sway=Math.round(Math.max(0,(by2-py0-6))*0.04*bend*(7-Math.min(7,mid-5))); var cc2=BEAD[(bs*3+(by2>>1))%BEAD.length]; b.px(bxx+sway,by2,cc2); b.px(bxx+sway,by2+1,P.k2); } }
  b.hl(px0-1,px0+pw,py0-1,P.m2);
  // Schild „PRIVAT“ hängt an zwei Schnüren vor dem Perlenvorhang
  var sx0=px0-1, sy0=py0+8; b.line(sx0+4,py0,sx0+3,sy0,P.k2); b.line(sx0+21,py0,sx0+22,sy0,P.k2); b.rect(sx0,sy0,26,8,P.s5); b.hl(sx0,sx0+25,sy0,P.s6); b.hl(sx0,sx0+25,sy0+7,P.s3); b.vl(sx0+25,sy0,sy0+7,P.s3); M.microText(b,'PRIVAT',sx0+2,sy0+2,P.r2);
  // ---- Werkzeugwand rechts: Lochblech mit Spachteln, Zangen, Hämmern
  var tq=M.wallQuad(SPEC,'R',5,33,22,70); b.poly(tq,function(x,y){ return ((x+y)%3===0 && (y%3===0))?P.e1:P.e3; });
  for (var e3=0;e3<4;e3++) b.line(rnd(tq[e3][0]),rnd(tq[e3][1]),rnd(tq[(e3+1)%4][0]),rnd(tq[(e3+1)%4][1]),P.w1);
  [[8,28,'sp'],[12,28,'sp'],[16,28,'sp'],[21,28,'pl'],[26,28,'pl'],[30,29,'sp'],[9,46,'ha'],[15,46,'ha'],[22,45,'sa'],[29,47,'ha'],[10,60,'cl'],[18,60,'cl'],[26,59,'pl']].forEach(function(t,i){ var p0=q('R',t[0],t[1]);
    if (t[2]==='sp'){ var sw2=1+(i%4); b.vl(p0[0],p0[1],p0[1]+5,P.w3); b.rect(p0[0]-(sw2>>1),p0[1]+6,sw2+1,4,P.m3); b.px(p0[0]-(sw2>>1),p0[1]+6,P.m4); }
    else if (t[2]==='pl'){ b.line(p0[0],p0[1],p0[0]-1,p0[1]+8,P.r2); b.line(p0[0]+1,p0[1],p0[0]+2,p0[1]+8,P.r2); b.rect(p0[0],p0[1]-2,2,3,P.m2); }
    else if (t[2]==='ha'){ b.vl(p0[0],p0[1],p0[1]+9,P.w3); b.rect(p0[0]-2,p0[1]-1,5,3,P.m1); b.px(p0[0]-2,p0[1]-1,P.m3); }
    else if (t[2]==='sa'){ b.rect(p0[0]-2,p0[1],5,10,P.m3); b.hl(p0[0]-2,p0[0]+2,p0[1]+9,P.m2); for (var tt=0;tt<5;tt++) b.px(p0[0]-2+tt,p0[1]+10,P.m2); b.rect(p0[0]-1,p0[1]-3,3,3,P.w2); }
    else { b.rect(p0[0]-2,p0[1],5,2,P.m2); b.vl(p0[0]-2,p0[1],p0[1]+7,P.m2); b.vl(p0[0]+2,p0[1]+1,p0[1]+4,P.r3); } });
  // Regalbrett darunter mit Leimtopf, Farbdosen, Schnur
  var s0=q('R',4,72), s1=q('R',34,74); b.line(s0[0],s0[1],s1[0],s1[1],P.w3); b.line(s0[0],s0[1]+1,s1[0],s1[1]+1,P.w1);
  [[8,'m3'],[13,'y3'],[19,'r2'],[25,'b2'],[30,'e3']].forEach(function(t){ var p0=q('R',t[0],72.5+t[0]*0.06); b.rect(p0[0]-1,p0[1]-4,4,4,P[t[1]]); b.hl(p0[0]-1,p0[0]+2,p0[1]-4,M.UP[P[t[1]]]); });
  // Leisten (Rahmenholz) lehnen in der rechten hinteren Ecke
  for (var li=0;li<7;li++){ var lx=270+li*2; b.line(lx,92,lx+4+li%2,40+li*3,[P.w3,P.y2,P.w1,P.k2,P.w4,P.s4,P.w2][li]); }
  // ---- Ladentisch mit Kasse, Klingel, Packpapier und Radio
  R3.box(b,CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1,{top:function(x,y){ return (hash(x>>2,y)<0.2)?P.w3:P.w4; },front:function(x,y){ var c=tex.boards(x,y*0.5,M.R('w1 w2 w3 w4'),60); if ((x%13)===0) c=P.w1; return c; }});
  var ct=R3.p(CNT.X0,CNT.Y0,CNT.Z1), ct2=R3.p(CNT.X1,CNT.Y0,CNT.Z1); b.hl(rnd(ct[0]),rnd(ct2[0]),rnd(ct[1]),P.w5);
  // Kasse (alt, mechanisch)
  var kx=rnd(R3.p(98,74,32)[0]), ky=rnd(R3.p(98,74,32)[1]); b.rect(kx,ky-9,14,9,P.k2); b.hl(kx,kx+13,ky-9,P.m2); b.rect(kx+1,ky-12,12,3,P.y2); b.hl(kx+1,kx+12,ky-12,P.y4); b.rect(kx+3,ky-11,8,1,P.k1);
  for (var kk=0;kk<8;kk++) b.px(kx+2+(kk%4)*3,ky-7+Math.floor(kk/4)*2,P.s5); b.rect(kx,ky-2,14,2,P.y1); b.px(kx+6,ky-2,P.y4);
  // Klingel
  var bx=rnd(R3.p(118,74,36)[0]), by=rnd(R3.p(118,74,36)[1]); b.ellipse(bx+0.5,by-2,3,2.4,function(x,y){ return y<by-1?(x<bx?P.y4:P.y2):T; }); b.hl(bx-3,bx+3,by-1,P.y1); b.px(bx,by-5,P.y3); b.px(bx-1,by-3,P.y5);
  // Quittungen auf einem Dorn, ein Stapel Zettel
  var qr=R3.p(126,74,38); b.vl(rnd(qr[0]),rnd(qr[1])-6,rnd(qr[1])-1,P.m2); for (var qi=0;qi<4;qi++) b.hl(rnd(qr[0])-2,rnd(qr[0])+2,rnd(qr[1])-2-qi,qi%2?P.s5:P.s6); b.rect(rnd(qr[0])-8,rnd(qr[1])-2,5,2,P.s5); b.hl(rnd(qr[0])-8,rnd(qr[0])-4,rnd(qr[1])-2,P.s6);
  // Packpapierrolle, Schnur
  var pr=R3.p(110,74,29); b.rect(rnd(pr[0]),rnd(pr[1])-3,9,3,P.e3); b.hl(rnd(pr[0]),rnd(pr[0])+8,rnd(pr[1])-3,P.e4); b.ellipse(pr[0]+9,pr[1]-1.5,1,1.5,P.e2);
  // Radio auf dem Tresen
  var rx=rnd(R3.p(124,74,28)[0])-6, ry=rnd(R3.p(124,74,28)[1]); b.rect(rx,ry-6,9,6,P.t3); b.hl(rx,rx+8,ry-6,P.t4); b.rect(rx+1,ry-5,4,4,P.k2); b.px(rx+6,ry-4,P.y4); b.line(rx+7,ry-6,rx+10,ry-12,P.m3);
  // ---- Licht
  var noGlass=function(x,y){ return !inWin(x,y); };
  if (!night){
    // Sonnenstrahl durchs Schaufenster: fällt schräg nach rechts über den Boden
    M.light(b,M.lf.sum(M.lf.pool(60,110,140,46,0.8),M.lf.beam(30,40,170,126,10,24,1.1),M.lf.vignette(W,144,2.0),M.lf.xband(150,320,0,-0.8),M.lf.k(-0.2)),0,0,noGlass);
    M.light(b,function(x,y){ return sunPatch(x,y)*1.8; },0,0,function(x,y){ return FLOOR[y*W+x]===1; });
    return b; }
  // Nacht: nur die Arbeitslampe, dazu ein Schimmer der Gassenlaterne durchs Schaufenster
  nightLight(b,tod,0,0,noGlass);
  b.hl(LAMP[0]-3,LAMP[0]+3,LAMP[1]+1,P.y5); b.px(LAMP[0],LAMP[1]+1,P.l1);
  return b; }
// Sonnenfleck: Bodenpunkt -> zurück zur linken Wand (Strahl kommt von links oben), liegt er im Schaufenster?
function sunPatch(x,y){ var f=R3.floor(x,y); if (!f) return 0; var t=(f.X-RECT[0])/1.25; if (t<=0) return 0; var X=RECT[0], Z=f.Z-t*0.35, Y=FY-t*0.72;
  var D=VP[0]-RECT[0], u=Z; if (u<WINU[0]||u>WINU[1]||Y<WINU[2]||Y>WINU[3]) return 0; if (Math.abs(u-(WINU[0]+WINU[1])/2)<0.9||Math.abs(Y-40)<1.1) return 0.1; return 1; }
var LIGHTS=[[214,92,74,1.25,40],[204,104,120,0.55,42],[46,52,26,0.55,30]];
function lampAmt(x,y){ var m=0; for (var i=0;i<LIGHTS.length;i++){ var l=LIGHTS[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[4], d=dx*dx+dy*dy; if (d<1) m=Math.max(m,(1-d)*l[3]); } return Math.min(1,m); }
function nightLight(b,tod,ox,oy,mask){ var TN=M.TINT[tod]||M.TINT.night;
  M.light(b,function(x,y){ return -1.2+lampAmt(x,y)*2.2; },ox,oy,mask);
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var L=lampAmt(X,Y), q1=Math.max(0,Math.min(1,(L-0.18)*4)), q2=Math.max(0,Math.min(1,(L-0.6)*3)), d=bayer(X,Y);
    b.d[k]=(d<q2)?M.tintPx(M.TINT.lamp,c,X,Y):((d<q1)?M.tintPx(WARM,c,X,Y):M.tintPx(TN,c,X,Y)); } }
var WARM=M.tintMake(function(r,g,b){ return [r*0.80+12, g*0.62+4, b*0.50+6]; });

// ---------------------------------------------------------------- Werkbank (Vordergrund-Ebene, Nina steht rechts daneben)
function layers(S,GS,tod){ var L=[], night=tod!=='day';
  var lay=M.layer(152,52,100,64,111), w=M.lw(lay), fw={poly:function(p,c){ w.poly(p,c); }};
  // Beine und Zwischenboden
  [[BENCH.X0+1,BENCH.Z1-1],[BENCH.X1-2,BENCH.Z1-1],[BENCH.X0+1,BENCH.Z0+1],[BENCH.X1-2,BENCH.Z0+1]].forEach(function(lg,i){ var a=R3.p(lg[0],BENCH.Y0+3,lg[1]), z=R3.p(lg[0],FY,lg[1]); w.rect(rnd(a[0]),rnd(a[1]),3,rnd(z[1]-a[1]),i<2?P.w2:P.w1); w.px(rnd(a[0]),rnd(a[1]),P.w3); });
  R3.box(fw,BENCH.X0,BENCH.X1,85,87,BENCH.Z0+1,BENCH.Z1-1,{top:P.w2,front:P.w1});
  var sh=R3.p(BENCH.X0+4,85,BENCH.Z0+6); w.rect(rnd(sh[0]),rnd(sh[1])-4,10,4,P.k2); w.hl(rnd(sh[0]),rnd(sh[0])+9,rnd(sh[1])-4,P.m1);   // Kiste mit Leisten unten
  for (var lst=0;lst<5;lst++) w.hl(rnd(sh[0])+12,rnd(sh[0])+30,rnd(sh[1])-1-lst,[P.w3,P.y2,P.w4,P.k2,P.w2][lst]);
  // dicke Platte
  R3.box(fw,BENCH.X0-2,BENCH.X1+1,BENCH.Y0,BENCH.Y0+3,BENCH.Z0,BENCH.Z1,{top:function(x,y){ var c=(hash(x>>2,y)<0.25)?P.w3:P.w4; if (hash(x,y)<0.04) c=P.e4; return c; },front:function(x,y){ return (y%2)?P.w2:P.w3; }});
  var t0=R3.p(BENCH.X0-2,BENCH.Y0,BENCH.Z1), t1=R3.p(BENCH.X1+1,BENCH.Y0,BENCH.Z1); w.hl(rnd(t0[0]),rnd(t1[0]),rnd(t0[1]),P.w5);
  // Gehrungssäge (links), Passepartoutschneider (lange Schiene), Glasschneider, Rahmen in Arbeit, Leimflasche
  var gs=R3.p(BENCH.X0+2,BENCH.Y0,BENCH.Z0+9); w.rect(rnd(gs[0]),rnd(gs[1])-3,12,3,P.w1); w.hl(rnd(gs[0]),rnd(gs[0])+11,rnd(gs[1])-3,P.w3);
  w.line(rnd(gs[0])+1,rnd(gs[1])-10,rnd(gs[0])+11,rnd(gs[1])-6,P.m3); w.line(rnd(gs[0])+1,rnd(gs[1])-9,rnd(gs[0])+11,rnd(gs[1])-5,P.m2); w.rect(rnd(gs[0])+9,rnd(gs[1])-9,4,3,P.r2);
  w.vl(rnd(gs[0])+2,rnd(gs[1])-11,rnd(gs[1])-3,P.k2); w.vl(rnd(gs[0])+10,rnd(gs[1])-8,rnd(gs[1])-3,P.k2);
  var pp=R3.p(BENCH.X0+16,BENCH.Y0,BENCH.Z0+4), pp2=R3.p(BENCH.X1-2,BENCH.Y0,BENCH.Z0+4); w.hl(rnd(pp[0]),rnd(pp2[0]),rnd(pp[1])-1,P.m3); w.hl(rnd(pp[0]),rnd(pp2[0]),rnd(pp[1]),P.m1); w.rect(rnd(pp[0])+14,rnd(pp[1])-3,4,3,P.k2); w.px(rnd(pp[0])+15,rnd(pp[1])-3,P.r3);
  var fr=R3.p(BENCH.X0+18,BENCH.Y0,BENCH.Z0+10); w.rect(rnd(fr[0]),rnd(fr[1])-1,16,2,P.y2); w.hl(rnd(fr[0]),rnd(fr[0])+15,rnd(fr[1])-1,P.y4); w.rect(rnd(fr[0])+2,rnd(fr[1])-1,12,1,P.a5);   // Rahmen mit Glas
  var gc=R3.p(BENCH.X1-6,BENCH.Y0,BENCH.Z0+11); w.line(rnd(gc[0]),rnd(gc[1])-1,rnd(gc[0])+4,rnd(gc[1])-3,P.w4); w.px(rnd(gc[0])+5,rnd(gc[1])-3,P.m4);       // Glasschneider
  var lf=R3.p(BENCH.X1-14,BENCH.Y0,BENCH.Z0+3); w.rect(rnd(lf[0]),rnd(lf[1])-5,3,5,P.s5); w.px(rnd(lf[0])+1,rnd(lf[1])-6,P.r3); w.px(rnd(lf[0]),rnd(lf[1])-3,P.b2);  // Leim
  var tc=R3.p(BENCH.X1-4,BENCH.Y0,BENCH.Z0+9); w.rect(rnd(tc[0]),rnd(tc[1])-3,3,3,P.s6); w.px(rnd(tc[0])+3,rnd(tc[1])-2,P.s5); w.hl(rnd(tc[0]),rnd(tc[0])+2,rnd(tc[1])-3,P.e2); w.hl(rnd(tc[0])-1,rnd(tc[0])+3,rnd(tc[1]),P.s4);   // Tasse kalter Tee
  // Arbeitslampe (Gelenkarm)
  var lb=R3.p(BENCH.X1-8,BENCH.Y0,BENCH.Z0+2); w.rect(rnd(lb[0])-2,rnd(lb[1])-1,5,1,P.k2); w.line(rnd(lb[0]),rnd(lb[1])-1,rnd(lb[0])-4,rnd(lb[1])-14,P.m2); w.line(rnd(lb[0])-4,rnd(lb[1])-14,LAMP[0]+2,LAMP[1]-3,P.m2);
  w.poly([[LAMP[0]-3,LAMP[1]-4],[LAMP[0]+3,LAMP[1]-4],[LAMP[0]+4,LAMP[1]],[LAMP[0]-4,LAMP[1]]],P.g3); w.hl(LAMP[0]-3,LAMP[0]+3,LAMP[1]-4,P.g4); w.hl(LAMP[0]-4,LAMP[0]+4,LAMP[1],P.g1);
  if (night){ nightLight(lay,tod,lay.ox,lay.oy); w.hl(LAMP[0]-3,LAMP[0]+3,LAMP[1]+1,P.y5); }
  else M.light(lay,M.lf.sum(M.lf.beam(30,40,170,126,10,24,1.2),M.lf.k(-0.1)),lay.ox,lay.oy);
  L.push(lay);
  return L; }

// ---------------------------------------------------------------- bewegte Teile
function dyn(fb,v,S,GS){ var tod=v.tod, night=tod!=='day';
  function wp(x,y,c){ if (inWin(x,y)) fb.px(x,y,c); }
  // draußen in der Gasse: Wäsche in der Bura
  for (var lx=28;lx<58;lx++) wp(lx,37+Math.round(Math.sin((lx-28)/30*Math.PI)*1.5),night?P.k1:P.k2);
  [[33,night?P.n1:P.s6],[41,night?P.n0:P.r3],[48,night?P.n1:P.b3]].forEach(function(it,k){ for (var yy=0;yy<5;yy++){ var sh=Math.round(yy*0.5+Math.sin(v.t*10+k*2+yy)*0.7); for (var xx=0;xx<4;xx++) wp(it[0]+xx+sh,39+yy,(xx===0||yy===4)?M.DN[it[1]]:it[1]); } });
  // eine Frau mit Einkaufstüten kämpft sich durch die Bura (nur am Tag)
  if (!night){ var ph=(v.t%22)/3.2; if (ph<1){ var x=Math.round(57-ph*30), y=72, st=Math.floor(v.t*6)%2;
      wp(x,y-13,P.h1); wp(x+1,y-13,P.h1); wp(x,y-12,P.p3); wp(x+1,y-12,P.h1);                       // Kopf mit Kopftuch
      for (var cy=y-11;cy<y-4;cy++){ wp(x-1+Math.round((y-4-cy)*-0.15),cy,P.r1); wp(x+Math.round((y-4-cy)*-0.15),cy,P.r2); wp(x+1+Math.round((y-4-cy)*-0.15),cy,P.r2); }   // Mantel, vornübergebeugt
      wp(x-1,y-4,P.r1); wp(x+1,y-4,P.r1); wp(x-1+st,y-3,P.k2); wp(x+1-st,y-3,P.k2); wp(x-1+st,y-2,P.k2); wp(x+1-st,y-2,P.k2); wp(x-1+st,y-1,P.k1); wp(x+1-st,y-1,P.k1);
      for (var by=y-7;by<y-3;by++){ wp(x-3,by,P.s5); wp(x-2,by,P.s4); wp(x+3,by,P.b3); wp(x+4,by,P.b2); }   // Tüten
      wp(x+2,y-11,P.r3); wp(x+3,y-10,P.r3); } }                                                      // Schal im Wind
  if (tod==='day'){ // Staub tanzt im Sonnenstrahl
    for (var i=0;i<22;i++){ var u=(hash(i,7)+v.t*0.012*(0.5+hash(i,8)))%1, x=rnd(36+u*130+Math.sin(v.t*0.7+i)*3), y=rnd(44+u*74+Math.cos(v.t*0.5+i*1.3)*4+hash(i,9)*14-7); if (Math.sin(v.t*1.3+i*2)>0.1) fb.px(x,y,P.s6); } }
  else M.glow(fb,LAMP[0],LAMP[1]+3,9,v.t,0.3); }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<10||Z>94||y>140) return false;
  if (X<40-Z*0.5 && Z<40) return false;
  if (X>=CNT.X0-3 && X<=CNT.X1+3 && Z>=CNT.Z0-4 && Z<=CNT.Z1+3) return false;    // Ladentisch
  if (X>=BENCH.X0-4 && X<=BENCH.X1+4 && Z>=BENCH.Z0-2 && Z<=BENCH.Z1+4) return false;   // Werkbank
  if (X>262 && Z<30) return false;                                                // Leisten in der Ecke
  return x>4 && x<316; };

M.defineArt('shop',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn,
  actorLut:function(a,S,GS,tod){ if (tod==='day') return null; return lampAmt(a.x,a.y-20)>0.35?WARM.a:(M.TINT[tod]||M.TINT.night).a; },   // nachts: wer im Lampenlicht steht, ist warm beleuchtet
  spots:{
    door:[2,16,24,100],
    frames:[66,10,160,66],
    paintings:[108,30,122,22],
    bench:[156,60,92,54],
    tools:[286,20,32,58],
    counter:[58,72,62,40],
    bell:[112,92,10,8],
    window:[28,16,28,70],
    private:[228,20,32,72]
  },
  stands:{ door:[24,122,'L'], frames:[126,112,'B'], paintings:[254,116,'B'], bench:[182,120,'B'], tools:[286,118,'R'], counter:[88,120,'B'], bell:[114,118,'B'], window:[56,112,'L'], private:[250,104,'B'] },
  actorPos:{ nina:[210,116,'L','nina'] },
  start:[26,124,'R'], entries:{ oldtown:[26,124,'R'], backroom:[250,106,'F'] }
});
})(M);
