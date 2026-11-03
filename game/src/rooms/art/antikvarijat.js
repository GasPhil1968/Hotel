/* ===== rooms/art/antikvarijat.js — Jakobs Antiquariat in einer Passage an der Ferhadija.
   Ein enger, sehr hoher Laden: Regale bis unter die Decke, eine Rollleiter, Bücherstapel auf dem Boden. Links der abgewetzte grüne
   Lesesessel mit Stehlampe (dort sitzt der Professor, nur Mala sieht ihn), in der Mitte die Glasvitrine mit Messingkanten, darin auf
   rotem Samt das Bibliotheksbuch („900 KM“). Hinten das Regal mit Kalendern und Almanachen („KALENDARI · TAKVIMI“), die Fotokiste
   auf einem Hocker, Zeitungsbündel mit Schnur, alte Landkarten und die gerahmte Kurrent-Tafel, ein kleiner Kanonenofen.
   Rechts Jakobs Schreibtisch (Rechenmaschine, Lupe, das dicke Ankaufbuch, grüne Leselampe), das Schaufenster zur Passage und die Tür
   mit der Türglocke an der Feder. Zustände: S.vitrineOpen, S.bookOut, S.kurrentOff, S.photoOut, S.spook. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;
var VP=[150,56], RECT=[84,4,224,98], F=100, FY=98;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WINU=[10,52,40,84], DOORU=[70,94,64,98];             // Schaufenster und Tür in der rechten Wand (Tiefe u0,u1, Höhe vOben,vUnten)
var VIT={X0:116,X1:152,Y0:74,Y1:85,Z0:36,Z1:46};         // Vitrine: Kasten (Glas) über Beinen
var STOVE={X0:88,X1:100,Z0:8,Z1:18};                     // Kanonenofen in der Ecke hinten links
var DESK={X0:178,X1:224,Y0:80,Z0:28,Z1:42};              // Schreibtisch (Jakob steht dahinter)
var CHAIR={x:72,y:118};                                  // Lesesessel: Fußpunkt des Sitzenden (Blick nach rechts)
var STOOL={X:176,Z:14};                                  // Hocker mit der Fotokiste
var ALM={x0:128,x1:182,y0:60};                           // Regal mit Kalendern und Almanachen (Rückwand)
var KUR={x0:126,y0:21,w:58,h:26};                        // Kurrent-Tafel
var BELL=null, LAMPD=null;
function rnd(v){ return Math.round(v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function q(sd,u,v){ var p=M.wallPt(SPEC,sd,u,v); return [rnd(p[0]),rnd(p[1])]; }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function shade(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'};
function signText(b,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž'){ b.px(cx,y-2,c); b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); }
    else if (ch==='Ć'){ b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); }
    cx+=w+1; }); return cx; }
var WINQ=M.wallQuad(SPEC,'R',WINU[0],WINU[1],WINU[2],WINU[3]), DOORQ=M.wallQuad(SPEC,'R',DOORU[0],DOORU[1],DOORU[2],DOORU[3]);
function inWin(x,y){ return M.inPoly(x+0.5,y+0.5,WINQ); }
var BOOKC=[P.r1,P.r2,P.w1,P.w2,P.g1,P.g2,P.c1,P.c2,P.e2,P.t1,P.y1,P.b0,P.m1,P.s2,P.k2,P.w3,P.r0,P.e3];

// ---------------------------------------------------------------- Bücher: Reihen von Rücken, manche liegen quer, Lücken
function bookRow(b,x0,x1,yb,hmax,sd,dark){ var r=M.rng(sd), x=x0;
  while (x<x1){ var bw=1+Math.floor(r()*3), bh=Math.max(3,hmax-Math.floor(r()*r()*hmax*0.55)), c=BOOKC[Math.floor(r()*BOOKC.length)];
    if (r()<0.06){ x+=2; continue; }                                              // Lücke
    if (r()<0.07 && x+8<x1){ var lh=2+Math.floor(r()*2), lc=BOOKC[Math.floor(r()*BOOKC.length)]; for (var k=0;k<Math.floor(1+r()*3);k++){ b.rect(x,yb-lh*(k+1),8,lh,k%2?lc:M.UP[lc]); b.hl(x,x+7,yb-lh*(k+1),M.UP[M.UP[lc]]); } x+=9; continue; }   // liegender Stapel
    if (x+bw>x1) bw=x1-x;
    for (var yy=yb-bh;yy<yb;yy++) for (var xx=x;xx<x+bw;xx++){ var cc=c; if (xx===x && bw>1) cc=M.UP[c]; if (yy===yb-bh) cc=M.UP[c]; if (bh>6 && (yy===yb-bh+2||yy===yb-3) && bw>1) cc=(c===P.r1||c===P.w1||c===P.g1)?P.y2:M.UP[M.UP[c]]; if (dark) cc=M.DN[cc]; b.px(xx,yy,cc); }
    if (r()<0.08 && bw>1) b.px(x+1,yb-bh-1,P.s5);                                  // Zettel als Lesezeichen
    x+=bw; } }
function shelfCase(b,x0,x1,y0,y1,boards,sd,dark){ var x, y, Wd=R('w0 w1 w2 w3');
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++) b.px(x,y,(x<x0+2||x>=x1-2)?((x===x0||x===x1-1)?P.w0:P.w2):P.k1);
  for (var i=0;i<boards.length;i++){ var by=boards[i]; bookRow(b,x0+2,x1-2,by,(i?boards[i]-boards[i-1]:by-y0)-2,sd+i*13,dark); b.hl(x0,x1-1,by,P.w3); b.hl(x0,x1-1,by+1,P.w1); }
  b.hl(x0-1,x1,y0,P.w3); }

// ---------------------------------------------------------------- Wände, Boden, Decke
var PLR=R('e1 e2 e3');
function backTex(u,v,x,y){ var c=ra(PLR,0.5+(fbm(u*0.7,v*0.7,9,2)-0.5)*0.5,x,y); if (v>86) c=(v===87)?P.w3:P.w1; return c; }
function sideTex(u,v,x,y,sd){ var c=ra(PLR,0.48+(fbm(u*0.5+(sd==='L'?0:300),v*0.6,10,sd==='L'?3:7)-0.5)*0.45-(v/400),x,y); if (v>86) c=(v===87)?P.w2:P.w0; return sd==='L'?M.DN[c]:c; }
function floorTex(xb,d,x,y){ var c=tex.planks(xb,y,VP[1],FY,R('w0 w1 w2 w3'),8); var f=R3.floor(x,y); if (f && fbm(f.X*0.1,f.Z*0.2,4,3)>0.66) c=M.DN[c]; return c; }   // Dielen, ausgetreten
function ceilTex(xb,d,x,y){ var c=((Math.floor(xb)%18)<2)?P.w0:P.w1; if (d%9===0) c=P.k2; return M.DN[c]; }

// ---------------------------------------------------------------- Blick durchs Schaufenster in die Passage
function passageView(b,tod,wea){ var night=tod==='night';
  b.poly(WINQ,function(x,y){ var c;
    if (y<46) c=night?P.k1:ra(R('m1 m2 m3'),0.3+(46-y)*0.02,x,y);                     // Decke der Passage
    else if (y<78){ c=night?P.k2:ra(R('s1 s2 s3'),0.5+(hash(x>>2,y>>2)-0.5)*0.4,x,y); if ((x+y*3)%17===0) c=night?P.k1:P.s1; }   // Wand gegenüber
    else c=night?P.k1:((((x>>2)+(y>>1))%2)?P.m1:P.m2);                                // Fliesen
    // das Schaufenster gegenüber (warm), eine Wandleuchte
    var dx=x-252, dy=y-60; if (Math.abs(dx)<6 && dy>-8 && dy<10) c=night?P.y2:P.y1; if (Math.abs(dx)<6 && (dy===-8||dy===10)) c=P.w1;
    var lx=x-239, ly=y-50; if (lx*lx+ly*ly*2<10) c=night?P.y4:P.s4;
    return c; });
  // spiegelverkehrt auf der Scheibe: ANTIKVARIJAT
  var t=new M.Buf(52,7,T); signText(t,'ANTIKVARIJAT',1,1,night?P.y2:P.y3); var tl=q('R',WINU[0]+3,WINU[2]+4);
  for (var yy=0;yy<7;yy++) for (var xx=0;xx<52;xx++){ var c=t.get(51-xx,yy); if (c===T) continue; var u=WINU[0]+3+xx*0.62, p=M.wallPt(SPEC,'R',u,WINU[2]+4+yy*0.55); b.px(rnd(p[0]),rnd(p[1]),c); } }

// ---------------------------------------------------------------- Bild
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), wea=M.scn.weather(GS), night=tod==='night', x, y, i;
  M.box(b,{vp:VP,rect:RECT,back:backTex,side:sideTex,floor:floorTex,ceil:ceilTex});
  // Deckenbalken
  [4,26,52,80].forEach(function(Z){ var a=R3.p(RECT[0],RECT[1],Z), z=R3.p(RECT[2],RECT[1],Z); b.hl(rnd(a[0]),rnd(z[0]),rnd(a[1]),P.w1); b.hl(rnd(a[0]),rnd(z[0]),rnd(a[1])+1,P.k1); });
  // ---- Rückwand: zwei Bücherschränke bis unter die Decke, dazwischen Karten, die Kurrent-Tafel und das Kalenderregal
  shelfCase(b,RECT[0],RECT[0]+42,RECT[1]+2,FY-1,[18,32,46,60,74,88],5);
  shelfCase(b,RECT[2]-40,RECT[2],RECT[1]+2,FY-1,[16,30,44,58,72,86],9);
  // Landkarten: eine alte Karte von Bosnien (grünbraun, Flüsse), ein Stadtplan, mit Nadeln
  b.rect(128,5,22,13,P.w1); b.fn(129,6,20,11,function(xx,yy){ var c=(fbm(xx*0.7,yy*0.7,3,5)>0.5)?P.e3:P.e4; if (Math.abs(Math.sin(xx*0.5+yy*0.2)*3-(yy-11))<0.6) c=P.b1; if (hash(xx,yy)<0.05) c=P.r2; return c; });
  b.rect(154,4,28,14,P.y1); b.hl(154,181,4,P.y3); b.fn(156,6,24,10,function(xx,yy){ var c=P.s4; if ((xx-156)%5===0||(yy-6)%4===0) c=P.s3; if (Math.abs(yy-12-Math.sin(xx*0.3)*2)<0.7) c=P.b2; if (xx>170&&yy>12) c=P.g4; return c; });
  signText(b,'PLAN',160,7,P.k2); b.px(130,6,P.r3); b.px(179,5,P.r3);
  // Kurrent-Tafel „DEUTSCHE KURRENTSCHRIFT“, darunter das Alphabet in zwei Zeilen (oder ihr heller Fleck an der Wand)
  var k=KUR;
  if (S.kurrentOff){ b.fn(k.x0,k.y0,k.w,k.h,function(xx,yy){ return ra(R('e2 e3 e4'),0.55+(fbm(xx*0.7,yy*0.7,6,2)-0.5)*0.3,xx,yy); }); b.px(k.x0+(k.w>>1),k.y0-2,P.m1); b.px(k.x0+(k.w>>1),k.y0-1,P.m2); for (x=k.x0;x<k.x0+k.w;x++) if (bayer(x,k.y0+k.h)<0.5) shade(b,x,k.y0+k.h,1); }
  else { b.rect(k.x0,k.y0,k.w,k.h,P.w1); b.hl(k.x0,k.x0+k.w-1,k.y0,P.w3); b.vl(k.x0,k.y0,k.y0+k.h-1,P.w2); b.rect(k.x0+1,k.y0+1,k.w-2,k.h-2,P.s5); b.hl(k.x0+1,k.x0+k.w-2,k.y0+1,P.s6);
    signText(b,'DEUTSCHE',k.x0+(k.w>>1)-15,k.y0+2,P.k2); signText(b,'KURRENTSCHRIFT',k.x0+1,k.y0+8,P.k2); b.hl(k.x0+4,k.x0+k.w-5,k.y0+14,P.s3);
    // das Alphabet: spitze, geneigte Kurrentbuchstaben mit Ober- und Unterlängen
    var ABC='abcdefghijklmnopqrstuvwxyz', UP='bdfhklt', DNL='fghjpqyz';
    for (var li=0;li<26;li++){ var ch=ABC[li], row=li<13?0:1, gx=k.x0+3+(li%13)*4, ly=k.y0+(row?22:18);
      b.px(gx,ly,P.k2); b.px(gx+1,ly-1,P.k2); b.px(gx+2,ly,P.k2); if ('mnuw'.indexOf(ch)>=0) b.px(gx+3,ly-1,P.k2);
      if (UP.indexOf(ch)>=0){ b.px(gx+1,ly-2,P.k2); b.px(gx+2,ly-3,P.k2); }
      if (DNL.indexOf(ch)>=0){ b.px(gx+1,ly+1,P.k2); b.px(gx,ly+2,P.k2); }
      if (ch==='u') b.px(gx+1,ly-3,P.k2); if (ch==='i'||ch==='j') b.px(gx+1,ly-3,P.k2); }
    b.line(k.x0+(k.w>>1),k.y0-3,k.x0+3,k.y0,P.m1); b.line(k.x0+(k.w>>1),k.y0-3,k.x0+k.w-4,k.y0,P.m1); b.px(k.x0+(k.w>>1),k.y0-4,P.m3);
    for (x=k.x0+1;x<k.x0+k.w+1;x++) shade(b,x,k.y0+k.h,1); }
  // Kalender und Almanache: niedriges Regal, dünne bunte Rücken, Jahreszahlen, ein Zettel
  var a=ALM; b.rect(a.x0,a.y0,a.x1-a.x0,FY-1-a.y0,P.w1); b.hl(a.x0-1,a.x1,a.y0,P.w4); b.hl(a.x0-1,a.x1,a.y0+1,P.w2);
  [a.y0+12,a.y0+24,FY-3].forEach(function(by,j){ var r=M.rng(31+j), xx=a.x0+2; while (xx<a.x1-2){ var c=[P.r2,P.y2,P.g2,P.b1,P.s4,P.t2,P.c2,P.e3][Math.floor(r()*8)], h=8+Math.floor(r()*3); b.rect(xx,by-h,1,h,c); if (r()<0.4) b.px(xx,by-h+2,P.s6); xx+=1+(r()<0.25?1:0); }
    b.hl(a.x0+1,a.x1-2,by,P.w3); b.hl(a.x0+1,a.x1-2,by+1,P.w0); });
  // Zettel „KALENDARI · TAKVIMI“, an die Wand über dem Regal gesteckt
  var zx=a.x0+7, zy=a.y0-12; b.rect(zx,zy,40,12,P.s5); b.hl(zx,zx+39,zy,P.s6); b.vl(zx+39,zy,zy+11,P.s3); b.hl(zx,zx+39,zy+11,P.s3); b.px(zx+20,zy-1,P.r3);
  signText(b,'KALENDARI',zx+2,zy+1,P.k2); b.px(zx+3,zy+8,P.k2); signText(b,'TAKVIMI',zx+6,zy+6,P.k2); b.px(zx+35,zy+8,P.k2);
  // ---- linke Wand: Regal bis unter die Decke in Perspektive, Rollleiter
  for (var u=4;u<96;u+=0.5){ var top=M.wallPt(SPEC,'L',u,RECT[1]+2), bot=M.wallPt(SPEC,'L',u,FY-1), xx2=rnd(top[0]); if (xx2<0) continue;
    for (y=rnd(top[1]);y<=rnd(bot[1]);y++){ var vv=VP[1]+(y-VP[1])/(1+u/((VP[0]-RECT[0]))), lv=(vv-RECT[1])%14, c=(lv<1.4)?P.w2:P.k1;
      if (lv>=1.4){ var bi=Math.floor(u*1.6)+Math.floor((vv-RECT[1])/14)*37, bc=BOOKC[Math.floor(hash(bi,3)*BOOKC.length)]; if (lv>1.4+hash(bi,5)*4) c=M.DN[bc]; if (hash(bi,7)<0.06) c=P.k1; }
      b.px(xx2,y,c); } }
  for (var lu=6;lu<96;lu+=22){ var t0=M.wallPt(SPEC,'L',lu,RECT[1]+2), b0=M.wallPt(SPEC,'L',lu,FY-1); b.line(rnd(t0[0]),rnd(t0[1]),rnd(b0[0]),rnd(b0[1]),P.w1); }
  // Rollleiter an der linken Wand: Schiene oben, Holme, Sprossen
  var rl0=M.wallPt(SPEC,'L',20,RECT[1]+10), rl1=M.wallPt(SPEC,'L',90,RECT[1]+10); b.line(rnd(rl0[0]),rnd(rl0[1]),rnd(rl1[0]),rnd(rl1[1]),P.y2);
  var la=M.wallPt(SPEC,'L',46,RECT[1]+10), lb=M.wallPt(SPEC,'L',58,FY); b.line(rnd(la[0]),rnd(la[1]),rnd(lb[0])+10,rnd(lb[1]),P.w3); b.line(rnd(la[0])+6,rnd(la[1]),rnd(lb[0])+18,rnd(lb[1])-2,P.w3);
  for (i=1;i<12;i++){ var t=i/12; b.line(rnd(la[0]+(lb[0]+10-la[0])*t),rnd(la[1]+(lb[1]-la[1])*t),rnd(la[0]+6+(lb[0]+18-la[0]-6)*t),rnd(la[1]+(lb[1]-2-la[1])*t),P.w2); }
  // ---- rechte Wand: Schaufenster und Tür
  passageView(b,tod,wea);
  var wf=M.wallQuad(SPEC,'R',WINU[0]-1.5,WINU[1]+1.5,WINU[2]-2,WINU[3]+2); for (var e=0;e<4;e++) b.line(rnd(wf[e][0]),rnd(wf[e][1]),rnd(wf[(e+1)%4][0]),rnd(wf[(e+1)%4][1]),P.w1);
  for (var e2=0;e2<4;e2++) b.line(rnd(WINQ[e2][0]),rnd(WINQ[e2][1]),rnd(WINQ[(e2+1)%4][0]),rnd(WINQ[(e2+1)%4][1]),P.w3);
  var mu=(WINU[0]+WINU[1])/2, m0=q('R',mu,WINU[2]), m1=q('R',mu,WINU[3]); b.line(m0[0],m0[1],m1[0],m1[1],P.w2);
  // Auslage im Fenster: Bücher von hinten, ein Globus
  var pq=M.wallQuad(SPEC,'R',WINU[0],WINU[1],WINU[3],WINU[3]+5); b.poly([pq[0],pq[1],[pq[1][0],pq[1][1]+5],[pq[0][0],pq[0][1]+5]],P.w2);
  for (i=0;i<6;i++){ var bp=q('R',WINU[0]+3+i*6.5,WINU[3]-10+(i%2)*3), bz=q('R',WINU[0]+5+i*6.5,WINU[3]); b.rect(bp[0]-2,bp[1],4,bz[1]-bp[1],BOOKC[(i*5)%BOOKC.length]); }
  var gp=q('R',WINU[1]-6,WINU[3]-14); b.ellipse(gp[0],gp[1],4,4,function(xx,yy){ return ((xx+yy)%3)?P.b1:P.g3; }); b.vl(gp[0],gp[1]+4,gp[1]+8,P.y2);
  // Tür (Holz, oben Glas) mit Klinke; Türglocke an der Feder darüber
  b.poly(M.wallQuad(SPEC,'R',DOORU[0]-1.5,DOORU[1]+1.5,DOORU[2]-2,DOORU[3]),P.w3);
  b.poly(DOORQ,function(xx,yy){ return ((xx+Math.floor(yy/9))%5===0)?P.w0:P.w1; });
  var dg=M.wallQuad(SPEC,'R',DOORU[0]+3,DOORU[1]-3,DOORU[2]+3,DOORU[2]+16); b.poly(dg,function(xx,yy){ return night?P.k2:((yy%3===0)?P.m2:P.m1); });
  var kn=q('R',DOORU[0]+2,DOORU[2]+20); b.rect(kn[0]-1,kn[1],3,2,P.y3); b.px(kn[0]-1,kn[1],P.y5);
  BELL=q('R',DOORU[0]+8,DOORU[2]-4);
  // ---- Ofen: kleiner Kanonenofen in der Ecke hinten links, das Rohr knickt in die Wand
  var so=STOVE, sb=R3.p(so.X0,FY,so.Z1), sb2=R3.p(so.X1,FY,so.Z1), stop=R3.p(so.X0,82,so.Z1), scx=rnd((sb[0]+sb2[0])/2), sw2=rnd((sb2[0]-sb[0])/2);
  for (y=rnd(stop[1]);y<rnd(sb[1])-2;y++){ var bulge=Math.round(Math.sin((y-stop[1])/(sb[1]-stop[1])*Math.PI)*1.5); for (x=scx-sw2-bulge;x<=scx+sw2+bulge;x++){ var u2=(x-(scx-sw2-bulge))/(2*(sw2+bulge)+1); b.px(x,y,u2<0.25?P.m1:(u2<0.6?P.m0:P.k1)); } }
  b.hl(scx-sw2-2,scx+sw2+2,rnd(stop[1])-1,P.m2); b.hl(scx-sw2-1,scx+sw2+1,rnd(stop[1])-2,P.m1); b.rect(scx-sw2,rnd(sb[1])-2,2,2,P.k1); b.rect(scx+sw2-1,rnd(sb[1])-2,2,2,P.k1);
  STOVEP=[scx,rnd(stop[1])+8]; b.rect(scx-3,STOVEP[1]-2,7,5,P.k1); glassMark(b,scx-2,STOVEP[1]-1,5,3);
  var pt=R3.p(so.X0+6,40,so.Z0+2); b.rect(scx-1,rnd(pt[1]),3,rnd(stop[1])-2-rnd(pt[1]),P.k1); b.vl(scx-1,rnd(pt[1]),rnd(stop[1])-3,P.m1); b.rect(scx-1,rnd(pt[1])-2,9,3,P.k1); b.hl(scx-1,scx+7,rnd(pt[1])-2,P.m1);
  b.poly([R3.p(so.X0-2,FY,so.Z0-2),R3.p(so.X1+2,FY,so.Z0-2),R3.p(so.X1+2,FY,so.Z1+2),R3.p(so.X0-2,FY,so.Z1+2)],P.m1);   // Blech unter dem Ofen
  // Zeitungsbündel mit Schnur, neben dem Ofen gestapelt
  [[102,FY,8,0],[104,FY-7,9,1],[114,FY,14,2]].forEach(function(n){ var p0=R3.p(n[0],n[1],n[2]), p1=R3.p(n[0]+18,n[1],n[2]); var w=rnd(p1[0]-p0[0]), h=7;
    b.rect(rnd(p0[0]),rnd(p0[1])-h,w,h,P.s4); for (var yy=rnd(p0[1])-h;yy<rnd(p0[1]);yy+=2) b.hl(rnd(p0[0]),rnd(p0[0])+w-1,yy,P.s3); b.hl(rnd(p0[0]),rnd(p0[0])+w-1,rnd(p0[1])-h,P.s5);
    b.vl(rnd(p0[0])+(w>>1),rnd(p0[1])-h,rnd(p0[1])-1,P.e2); b.hl(rnd(p0[0]),rnd(p0[0])+w-1,rnd(p0[1])-(h>>1),P.e2); if (n[4]===1){ b.rect(rnd(p0[0])+2,rnd(p0[1])-h+1,8,2,P.k2); } });
  NEWS=[R3.p(104,FY-14,9),R3.p(132,FY,14)];
  // Hocker mit der Fotokiste
  var st0=R3.p(STOOL.X-6,FY,STOOL.Z), st1=R3.p(STOOL.X+6,FY,STOOL.Z); R3.box(b,STOOL.X-7,STOOL.X+7,84,86,STOOL.Z-5,STOOL.Z+5,{top:P.w3,front:P.w1});
  [[STOOL.X-6,STOOL.Z+4],[STOOL.X+5,STOOL.Z+4],[STOOL.X-6,STOOL.Z-4],[STOOL.X+5,STOOL.Z-4]].forEach(function(l){ var p=R3.p(l[0],86,l[1]), z=R3.p(l[0],FY,l[1]); b.vl(rnd(p[0]),rnd(p[1]),rnd(z[1]),P.w0); });
  R3.box(b,STOOL.X-6,STOOL.X+6,74,84,STOOL.Z-4,STOOL.Z+4,{top:P.k2,front:function(xx,yy){ return ((xx+yy)%5===0)?P.w1:P.w2; }});
  var pb=R3.p(STOOL.X-5,75,STOOL.Z-2); for (i=0;i<9;i++){ var px=rnd(pb[0])+i*2, ph=2+Math.floor(hash(i,4)*3)+(S.photoOut&&i%3===1?3:0); b.vl(px,rnd(pb[1])-ph,rnd(pb[1]),(i%2)?P.s5:P.s4); b.px(px,rnd(pb[1])-ph,P.s6); }
  if (S.photoOut){ var lp=R3.p(STOOL.X+8,FY,STOOL.Z+8); b.rect(rnd(lp[0]),rnd(lp[1])-1,5,2,P.s5); b.px(rnd(lp[0])+1,rnd(lp[1])-1,P.s3); }
  // Bücherstapel auf dem Boden
  [[104,30,6],[196,52,4],[100,60,5],[172,62,3],[230,58,4]].forEach(function(s,j){ var p=R3.p(s[0],FY,s[1]); for (var k2=0;k2<s[2];k2++){ var w2=9+Math.floor(hash(j,k2)*5), c2=BOOKC[(j*7+k2*3)%BOOKC.length], ox=rnd((hash(k2,j)-0.5)*3); b.rect(rnd(p[0])+ox,rnd(p[1])-3-k2*3,w2,3,c2); b.hl(rnd(p[0])+ox,rnd(p[0])+ox+w2-1,rnd(p[1])-3-k2*3,M.UP[c2]); b.vl(rnd(p[0])+ox+w2-1,rnd(p[1])-3-k2*3,rnd(p[1])-1-k2*3,P.s5); } });
  // Stehleiter hinten links
  var s0=R3.p(124,FY,10), s1=R3.p(124,62,6); b.line(rnd(s0[0]),rnd(s0[1]),rnd(s1[0]),rnd(s1[1]),P.w2); b.line(rnd(s0[0])+7,rnd(s0[1]),rnd(s1[0])+5,rnd(s1[1]),P.w2); for (i=1;i<5;i++){ var t2=i/5; b.hl(rnd(s0[0]+(s1[0]-s0[0])*t2),rnd(s0[0]+7+(s1[0]+5-s0[0]-7)*t2),rnd(s0[1]+(s1[1]-s0[1])*t2),P.w3); }
  // ---- Lesesessel (grün, abgewetzt) im Profil, Blick nach rechts; Stehlampe dahinter
  armchair(b);
  var lmp=[44,58]; b.vl(lmp[0],lmp[1],CHAIR.y-2,P.m1); b.hl(lmp[0]-4,lmp[0]+4,CHAIR.y-1,P.m0); b.poly([[lmp[0]-6,lmp[1]],[lmp[0]+6,lmp[1]],[lmp[0]+4,lmp[1]-8],[lmp[0]-4,lmp[1]-8]],P.e3); b.hl(lmp[0]-6,lmp[0]+6,lmp[1],P.e2); b.hl(lmp[0]-4,lmp[0]+4,lmp[1]-8,P.e4);
  // kleiner Teppich vor dem Sessel
  b.poly([R3.p(92,FY,40),R3.p(150,FY,40),R3.p(150,FY,62),R3.p(92,FY,62)],function(xx,yy){ return tex.carpet(xx,yy,R('r0 r1 r2')); });
  // ---- Licht
  var dayL=!night, glassM=function(x,y){ return !inWin(x,y); };
  if (dayL){ M.light(b,M.lf.sum(M.lf.beam(268,40,150,128,10,26,1.0),M.lf.pool(200,108,80,30,0.6),M.lf.vignette(W,H,1.8),M.lf.xband(0,120,-0.6,0),M.lf.k(-0.35)),0,0,glassM);
    if (wea==='rain'||wea==='fog') M.light(b,M.lf.k(-0.25),0,0,glassM); }
  else nightLight(b,0,0,glassM);
  return b; }
var NEWS=null, STOVEP=null;
function glassMark(b,x,y,w,h){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,(xx+yy)%2?P.k1:P.t0); }
// Lesesessel (Ohrensessel) im Profil, Blick nach rechts: hinten Rückenlehne und Sitzkissen, vorn das Seitenteil mit gerollter Armlehne
var GRN=null;
function armchair(b){ var cx=CHAIR.x, fy=CHAIR.y, sy=fy-13, x, y, G=GRN=R('g0 g1 g2 g3 g4');
  // Rückenlehne: hoch, oben gerundet, mit Ohr
  for (y=sy-30;y<fy-2;y++) for (x=cx-17;x<cx-7;x++){ var dx=x-(cx-12), top=sy-30+Math.round(dx*dx*0.18); if (y<top) continue; var u=(x-(cx-17))/10;
    var c=ra(G,0.25+u*0.45-(y-sy+30)/110+((fbm(x*1.6,y*0.9,3,4)>0.62)?0.22:0),x,y); if (x===cx-17||y===top) c=(y===top)?P.g3:P.g0; b.px(x,y,c); }
  for (y=sy-28;y<sy-16;y++){ b.px(cx-7,y,P.g1); b.px(cx-6,y,P.g0); }                                      // Ohr (Kante)
  // Sitzkissen, blank gescheuert
  for (y=sy-3;y<sy+3;y++) for (x=cx-8;x<cx+11;x++){ var c2=ra(G,(y<sy-1)?0.75:0.5,x,y); if (y===sy-3) c2=P.g4; if (fbm(x*1.5,y,2,9)>0.62) c2=P.g5; b.px(x,y,c2); }
  b.hl(cx-13,cx+12,fy,P.k1); b.hl(cx-12,cx+11,fy+1,P.k1);
  // ein Kissen an der Lehne, ein Buch mit Brille auf der Armlehne kommt in die Ebene
  b.ellipse(cx-6,sy-8,3,5,function(xx,yy){ return (xx<cx-6)?P.r2:P.r1; }); }
function armchairFront(w){ var cx=CHAIR.x, fy=CHAIR.y, sy=fy-13, x, y, G=GRN||R('g0 g1 g2 g3 g4');
  for (y=sy-8;y<fy-3;y++) for (x=cx-12;x<cx+14;x++){ if (x>cx+9 && y<sy-8+(x-(cx+9))) continue; var c=ra(G,0.62-(y-sy+8)/34+((x>cx+9)?-0.25:0)+((fbm(x*1.3,y,3,11)>0.66)?0.22:0),x,y); if (y===sy-8) c=P.g4; if (x===cx-12) c=P.g1; w.px(x,y,c); }
  // gerollte Armlehne vorn
  w.ellipse(cx+10,sy-7,3.5,3,function(xx,yy){ return (yy<sy-8)?P.g4:((xx>cx+11)?P.g1:P.g3); }); w.px(cx+10,sy-7,P.g1);
  for (x=cx-10;x<cx+12;x+=3) w.px(x,fy-5,P.y2);                                                                 // Messingnägel
  w.hl(cx-12,cx+12,fy-4,P.g0);
  [[cx-11,fy-3],[cx+9,fy-3]].forEach(function(f){ w.rect(f[0],f[1],2,3,P.w1); w.px(f[0],f[1],P.w3); w.px(f[0],f[1]+2,P.y1); });
  w.rect(cx+2,sy-10,6,2,P.r1); w.hl(cx+2,cx+7,sy-10,P.r2); w.px(cx-3,sy-9,P.m3); w.px(cx-1,sy-9,P.m3); w.px(cx-2,sy-9,P.m2); }

// ---------------------------------------------------------------- Nacht: nur die grüne Leselampe auf dem Schreibtisch und ein Schimmer aus der Passage
var LIGHTS=[[214,92,70,1.3,36],[200,120,90,0.5,30],[250,58,30,0.5,30]];
function lampAmt(x,y){ var m=0; for (var i=0;i<LIGHTS.length;i++){ var l=LIGHTS[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[4], d=dx*dx+dy*dy; if (d<1) m=Math.max(m,(1-d)*l[3]); } return Math.min(1,m); }
var WARM=M.tintMake(function(r,g,b){ return [r*0.80+12, g*0.64+4, b*0.46+4]; });
function nightLight(b,ox,oy,mask){ var TN=M.TINT.night;
  M.light(b,function(x,y){ return -1.1+lampAmt(x,y)*2.2; },ox,oy,mask);
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var L=lampAmt(X,Y), q1=Math.max(0,Math.min(1,(L-0.16)*4)), q2=Math.max(0,Math.min(1,(L-0.6)*3)), d=bayer(X,Y);
    b.d[k]=(d<q2)?M.tintPx(M.TINT.lamp,c,X,Y):((d<q1)?M.tintPx(WARM,c,X,Y):M.tintPx(TN,c,X,Y)); } }

// ---------------------------------------------------------------- Vordergrund: Vitrine (mit dem Buch) und Schreibtisch (Jakob dahinter)
function layers(S,GS,tod){ var L=[], night=tod==='night';
  var fw=function(w){ return {poly:function(p,c){ w.poly(p,c); }}; };
  // Seitenteil des Lesesessels vor dem Sitzenden
  var cl=M.layer(CHAIR.x-14,CHAIR.y-26,30,27,CHAIR.y+1), cw=M.lw(cl); armchairFront(cw);
  if (night) nightLight(cl,cl.ox,cl.oy); else M.light(cl,M.lf.sum(M.lf.vignette(W,H,1.8),M.lf.xband(0,120,-0.6,0),M.lf.k(-0.35)),cl.ox,cl.oy);
  L.push(cl);
  // Vitrine
  var vb=R3.rect(VIT.X0-1,VIT.X1+1,VIT.Y0-2,FY,VIT.Z0,VIT.Z1), vl=M.layer(vb[0]-4,vb[1]-16,vb[2]+12,vb[3]+18,rnd(R3.p(VIT.X0,FY,VIT.Z1)[1])+1), vw=M.lw(vl), x, y;
  [[VIT.X0+1,VIT.Z1-1],[VIT.X1-2,VIT.Z1-1],[VIT.X0+1,VIT.Z0+1],[VIT.X1-2,VIT.Z0+1]].forEach(function(lg,i){ var a=R3.p(lg[0],VIT.Y1,lg[1]), z=R3.p(lg[0],FY,lg[1]); vw.rect(rnd(a[0]),rnd(a[1]),2,rnd(z[1]-a[1]),i<2?P.w1:P.w0); vw.px(rnd(a[0]),rnd(z[1])-1,P.y2); });
  // Unterbau aus Holz, darauf der Glaskasten mit Messingkanten
  R3.box(fw(vw),VIT.X0,VIT.X1,VIT.Y1-1,VIT.Y1+2,VIT.Z0,VIT.Z1,{top:P.w2,front:function(xx,yy){ return (yy%2)?P.w1:P.w2; }});
  var g0=R3.p(VIT.X0,VIT.Y0,VIT.Z1), g1=R3.p(VIT.X1,VIT.Y0,VIT.Z1), g2=R3.p(VIT.X1,VIT.Y1,VIT.Z1), gb0=R3.p(VIT.X0,VIT.Y0,VIT.Z0), gb1=R3.p(VIT.X1,VIT.Y0,VIT.Z0);
  // Rückwand und Boden: roter Samt mit weichen Falten
  vw.poly([R3.p(VIT.X0+1,VIT.Y0+1,VIT.Z0),R3.p(VIT.X1-1,VIT.Y0+1,VIT.Z0),R3.p(VIT.X1-1,VIT.Y1-1,VIT.Z0),R3.p(VIT.X0+1,VIT.Y1-1,VIT.Z0)],function(xx,yy){ var f=Math.sin(xx*0.9)*0.5+0.5; return (f<0.2)?P.r0:((f>0.8 && yy%2)?P.r2:P.r1); });
  vw.poly([R3.p(VIT.X0+1,VIT.Y1-1,VIT.Z0+1),R3.p(VIT.X1-1,VIT.Y1-1,VIT.Z0+1),R3.p(VIT.X1-1,VIT.Y1-1,VIT.Z1-1),R3.p(VIT.X0+1,VIT.Y1-1,VIT.Z1-1)],function(xx,yy){ return ((xx+yy*2)%7===0)?P.r0:(((xx+yy)%3)?P.r1:P.r2); });
  // das Buch steht aufrecht auf einem kleinen Pult: Halbleder (brauner Rücken, marmorierte Deckel), auf dem Rücken das Bibliotheksschild
  var bk=R3.p(VIT.X0+24,VIT.Y1-1,VIT.Z0+5), bx=rnd(bk[0]), by=rnd(bk[1]);
  vw.line(bx-2,by,bx+14,by,P.w3); vw.line(bx+2,by,bx+5,by-3,P.w2); vw.line(bx+12,by,bx+9,by-3,P.w2);               // Pult
  if (!S.bookOut){
    for (y=by-12;y<by-1;y++) for (x=bx;x<bx+12;x++){ var c;
      if (x<bx+3) c=(y===by-10||y===by-3)?P.y3:((y>by-9&&y<by-5&&x===bx+1)?P.s6:(x===bx?P.w2:P.w1));               // Rücken mit Goldbünden und Schild
      else { var mq=fbm(x*1.3,y*1.1,2,7); c=(mq>0.62)?P.e4:((mq>0.45)?P.e3:P.t2); if ((x+y*2)%7===0) c=P.r1; if (y===by-12||x===bx+11) c=P.w2; if (x===bx+3) c=P.w0; if (x>=bx+9 && y<by-9) c=P.w2; }   // marmorierter Deckel, Lederecken
      vw.px(x,y,c); }
    vw.px(bx+1,by-7,P.b0);                                                                                             // Bibliotheksschild mit Nummer
    vw.hl(bx,bx+11,by-1,P.s4); vw.px(bx+11,by-2,P.s5);
    BOOKR=[bx-1,by-14,15,15]; }
  else { vw.hl(bx+1,bx+10,by-1,P.r2); BOOKR=[bx-1,by-6,15,7]; }
  // Preisschildchen auf dem Samt, links neben dem Buch angelehnt
  var tx=bx-27, ty=by-6; vw.rect(tx,ty,25,7,P.s4); vw.hl(tx,tx+24,ty,P.s5); vw.vl(tx+24,ty,ty+6,P.s2); vw.hl(tx,tx+24,ty+7,P.r0); signText(vw.buf,'900 KM',tx+1-vl.ox,ty+1-vl.oy,P.w0);
  vw.line(tx+24,ty+3,bx-1,by-4,P.y1);                                                                                     // Faden zum Buch
  // Glas: Kanten aus Messing, Spiegelungen; offen = Deckel hochgeklappt
  vw.line(rnd(g0[0]),rnd(g0[1]),rnd(g1[0]),rnd(g1[1]),P.y3); vw.line(rnd(g0[0]),rnd(g0[1]),rnd(R3.p(VIT.X0,VIT.Y1,VIT.Z1)[0]),rnd(R3.p(VIT.X0,VIT.Y1,VIT.Z1)[1]),P.y2); vw.line(rnd(g1[0]),rnd(g1[1]),rnd(g2[0]),rnd(g2[1]),P.y1);
  if (S.vitrineOpen){ var lid0=gb0, lid1=gb1; vw.line(rnd(lid0[0]),rnd(lid0[1]),rnd(lid0[0])+2,rnd(lid0[1])-12,P.y2); vw.line(rnd(lid1[0]),rnd(lid1[1]),rnd(lid1[0])-2,rnd(lid1[1])-12,P.y1); vw.line(rnd(lid0[0])+2,rnd(lid0[1])-12,rnd(lid1[0])-2,rnd(lid1[1])-12,P.y3);
    for (var q2=1;q2<10;q2+=3) vw.px(rnd(lid0[0])+4+q2*2,rnd(lid0[1])-10+q2%2,P.s6); }
  else { vw.line(rnd(gb0[0]),rnd(gb0[1]),rnd(gb1[0]),rnd(gb1[1]),P.y2); vw.line(rnd(gb0[0]),rnd(gb0[1]),rnd(g0[0]),rnd(g0[1]),P.y2); vw.line(rnd(gb1[0]),rnd(gb1[1]),rnd(g1[0]),rnd(g1[1]),P.y1);
    // Spiegelungen auf dem Glas: zwei schräge Lichtstreifen auf Deckel und Front
    for (var s=0;s<5;s++){ vw.px(rnd(gb0[0])+8+s*2,rnd(gb0[1])+1+Math.round(s*0.6),P.s6); vw.px(rnd(gb0[0])+11+s*2,rnd(gb0[1])+1+Math.round(s*0.6),P.s5); }
    var fy0=rnd(g0[1])+1, fy1=rnd(g2[1])-1; for (var yy2=fy0;yy2<=fy1;yy2++){ var k2=yy2-fy0; if (yy2>=by-7) continue; vw.px(rnd(g0[0])+3+k2,yy2,P.s5); if (k2%2===0) vw.px(rnd(g0[0])+6+k2,yy2,P.s4); vw.px(rnd(g1[0])-6+k2,yy2,(k2%2)?P.s4:P.s5); } }
  // Messingpfosten an den Ecken, untere Kante
  [VIT.X0,VIT.X1].forEach(function(X,i){ var p0=R3.p(X,VIT.Y0,VIT.Z1), p1=R3.p(X,VIT.Y1,VIT.Z1); vw.vl(rnd(p0[0])-(i?1:0),rnd(p0[1]),rnd(p1[1]),i?P.y1:P.y3); });
  vw.line(rnd(R3.p(VIT.X0,VIT.Y1,VIT.Z1)[0]),rnd(g2[1]),rnd(g2[0]),rnd(g2[1]),P.y2);
  if (night) nightLight(vl,vl.ox,vl.oy); else M.light(vl,M.lf.sum(M.lf.beam(268,40,150,128,10,26,0.8),M.lf.k(-0.3)),vl.ox,vl.oy);
  L.push(vl);
  // Schreibtisch mit Rechenmaschine, Lupe, Ankaufbuch, Lampe
  var db=R3.rect(DESK.X0-2,DESK.X1+1,DESK.Y0,FY,DESK.Z0,DESK.Z1), dl=M.layer(db[0]-4,db[1]-30,db[2]+8,db[3]+32,rnd(R3.p(DESK.X0,FY,DESK.Z1)[1])+1), dw=M.lw(dl);
  R3.box(fw(dw),DESK.X0,DESK.X1,DESK.Y0+3,FY,DESK.Z1-2,DESK.Z1,{front:function(xx,yy){ var c=tex.boards(xx,yy*0.6,R('w0 w1 w2 w3'),60); if (xx%14===0) c=P.w0; return c; },left:P.w0});
  R3.box(fw(dw),DESK.X0-2,DESK.X1+1,DESK.Y0,DESK.Y0+3,DESK.Z0,DESK.Z1,{top:function(xx,yy){ return (hash(xx>>2,yy)<0.2)?P.w2:P.w3; },front:function(xx,yy){ return (yy%2)?P.w2:P.w4; },left:P.w1});
  var dp=R3.p(DESK.X0+20,DESK.Y0+10,DESK.Z1); dw.rect(rnd(dp[0])-6,rnd(dp[1]),12,8,P.w2); dw.hl(rnd(dp[0])-6,rnd(dp[0])+5,rnd(dp[1]),P.w3); dw.rect(rnd(dp[0])-1,rnd(dp[1])+3,3,2,P.y2);   // Schublade
  // Rechenmaschine (mechanisch, mit Kurbel)
  var rm=R3.p(DESK.X0+3,DESK.Y0,DESK.Z0+9); var rx=rnd(rm[0]), ry=rnd(rm[1]); dw.rect(rx,ry-8,16,8,P.m1); dw.hl(rx,rx+15,ry-8,P.m3); dw.rect(rx+1,ry-7,10,5,P.m0);
  for (var kx=0;kx<5;kx++) for (var ky=0;ky<3;ky++) dw.px(rx+2+kx*2,ry-6+ky*2,P.s5); dw.rect(rx+12,ry-11,3,3,P.m2); dw.line(rx+16,ry-6,rx+19,ry-9,P.m3); dw.px(rx+19,ry-10,P.r2);
  // Ankaufbuch: dick, aufgeschlagen, Spalten
  var ab=R3.p(DESK.X0+22,DESK.Y0,DESK.Z0+8); var ax=rnd(ab[0]), ay=rnd(ab[1]); dw.rect(ax,ay-3,22,3,P.w0); dw.poly([[ax,ay-3],[ax+10,ay-4],[ax+11,ay-2],[ax+1,ay-1]],P.s5); dw.poly([[ax+11,ay-4],[ax+21,ay-3],[ax+21,ay-1],[ax+11,ay-2]],P.s4);
  for (var ln=0;ln<3;ln++){ dw.hl(ax+2,ax+8,ay-3+ln,P.s2); dw.hl(ax+13,ax+19,ay-3+ln,P.s2); } dw.vl(ax+10,ay-4,ay-1,P.w0); LEDGER=[ax-1,ay-6,24,7];
  // Lupe an der Schnur, Federhalter, Tintenfass
  var lu=R3.p(DESK.X1-14,DESK.Y0,DESK.Z0+12); dw.ellipse(lu[0]+0.5,lu[1]-1,2.6,1.3,P.y2); dw.ellipse(lu[0]+0.5,lu[1]-1,1.6,0.6,P.a5); dw.line(rnd(lu[0])+3,rnd(lu[1])-1,rnd(lu[0])+8,rnd(lu[1]),P.k2);
  var ink=R3.p(DESK.X1-24,DESK.Y0,DESK.Z0+4); dw.rect(rnd(ink[0]),rnd(ink[1])-3,3,3,P.k1); dw.px(rnd(ink[0])+1,rnd(ink[1])-4,P.m3); dw.line(rnd(ink[0])+2,rnd(ink[1])-7,rnd(ink[0])+4,rnd(ink[1])-3,P.w4);
  // grüne Bankerlampe
  var lm=R3.p(DESK.X1-8,DESK.Y0,DESK.Z0+4), lx=rnd(lm[0]), ly=rnd(lm[1]); dw.rect(lx-3,ly-2,7,2,P.y1); dw.vl(lx,ly-9,ly-2,P.y2); dw.poly([[lx-6,ly-9],[lx+6,ly-9],[lx+4,ly-13],[lx-4,ly-13]],P.g2); dw.hl(lx-6,lx+6,ly-9,P.g1); dw.hl(lx-4,lx+4,ly-13,P.g4); dw.px(lx-2,ly-12,P.g5);
  LAMPD=[lx,ly-8];
  // Papiere, ein Brief mit Briefmarken (der Sammler aus Frankfurt)
  var pp=R3.p(DESK.X0+40,DESK.Y0,DESK.Z0+12); dw.poly([[pp[0],pp[1]],[pp[0]+9,pp[1]-1],[pp[0]+10,pp[1]+2],[pp[0]+1,pp[1]+3]],P.s6); dw.px(rnd(pp[0])+7,rnd(pp[1]),P.r3); dw.px(rnd(pp[0])+8,rnd(pp[1]),P.b2); dw.hl(rnd(pp[0])+2,rnd(pp[0])+6,rnd(pp[1])+1,P.s3);
  if (night){ nightLight(dl,dl.ox,dl.oy); dw.poly([[lx-5,ly-9],[lx+5,ly-9],[lx+3,ly-12],[lx-3,ly-12]],P.g3); dw.hl(lx-5,lx+5,ly-8,P.y5); dw.px(lx,ly-8,P.l1); }
  else M.light(dl,M.lf.sum(M.lf.pool(200,100,70,30,0.6),M.lf.k(-0.25)),dl.ox,dl.oy);
  L.push(dl);
  return L; }
var BOOKR=[0,0,0,0], LEDGER=[0,0,0,0];

// ---------------------------------------------------------------- bewegte Teile: Staub im Licht, Türglocke, Regen am Schaufenster, Ofenglut
function dyn(fb,v,S,GS){ var t=v.t, night=v.tod==='night', wea=M.scn.weather(GS);
  // Türglocke an der Feder: pendelt sacht, bei Spuk von selbst
  if (BELL){ var sw=Math.sin(t*0.9)*0.25; if (S.spook){ var ph=(t%9); if (ph<2.4) sw=Math.sin(ph*11)*(2.4-ph)*1.2; } var bx=BELL[0]+rnd(sw), by=BELL[1], dark=night;
    // Halter an der Wand, gebogene Feder (Spirale), die Glocke
    fb.rect(BELL[0]-7,by-9,3,4,dark?P.k2:P.m1); for (var k=0;k<7;k++){ var u=k/6, sx0=Math.round(BELL[0]-5+u*5+sw*u), sy0=Math.round(by-8+u*5+Math.sin(k*2.2)*1); fb.px(sx0,sy0,dark?P.m1:P.m3); fb.px(sx0,sy0+1,dark?P.k2:P.m1); }
    fb.px(bx,by-2,dark?P.y1:P.y3); fb.hl(bx-1,bx+1,by-1,dark?P.y1:P.y3); fb.hl(bx-2,bx+2,by,dark?P.y1:P.y2); fb.hl(bx-2,bx+2,by+1,dark?P.y0:P.y2); fb.hl(bx-3,bx+3,by+2,dark?P.y0:P.y1); fb.px(bx-1,by-1,dark?P.y2:P.y5); fb.px(bx+rnd(sw*0.6),by+3,P.y0);
    if (S.spook && Math.abs(sw)>0.8){ fb.px(bx-5,by-1,P.s4); fb.px(bx+5,by,P.s4); fb.px(bx-6,by+1,P.s3); } }
  // Staub im grauen Fensterlicht (am Tag) oder im Lampenlicht (nachts)
  if (!night){ for (var i=0;i<20;i++){ var u=(hash(i,7)+t*0.01*(0.5+hash(i,8)))%1, x=rnd(262-u*112+Math.sin(t*0.6+i)*3), y=rnd(44+u*80+Math.cos(t*0.5+i*1.3)*4+hash(i,9)*12-6); if (Math.sin(t*1.3+i*2)>0.15) fb.px(x,y,P.s5); } }
  else { for (var j=0;j<8;j++){ var u2=(hash(j,3)+t*0.008)%1, x2=rnd(LAMPD[0]-12+hash(j,4)*24+Math.sin(t*0.7+j)*2), y2=rnd(LAMPD[1]+4+u2*24); if (Math.sin(t*1.5+j)>0.3) fb.px(x2,y2,P.y4); } M.glow(fb,LAMPD[0],LAMPD[1]+3,10,t,0.35); }
  // Regen am Schaufenster: Tropfen laufen schräg in der Perspektive
  if (wea==='rain'){ for (var r=0;r<16;r++){ var sp=6+hash(r,12)*12, uu=WINU[0]+2+hash(r,11)*(WINU[1]-WINU[0]-4), vv=WINU[2]+((t*sp+hash(r,13)*44)%(WINU[3]-WINU[2])); var p=M.wallPt(SPEC,'R',uu,vv), p2=M.wallPt(SPEC,'R',uu,vv-2); fb.px(rnd(p[0]),rnd(p[1]),P.m4); fb.px(rnd(p2[0]),rnd(p2[1]),P.m3); } }
  // Ofenglut durch das Türchen
  if (STOVEP){ var gl=(Math.sin(t*3.1)+Math.sin(t*7.3))*0.5; for (var gx=-2;gx<=2;gx++) for (var gy=0;gy<2;gy++) if (bayer(gx+Math.floor(t*4),gy)<0.45+gl*0.3) fb.px(STOVEP[0]+gx,STOVEP[1]+gy,night?(gy?P.t3:P.t4):(gy?P.t2:P.t3)); } }
// ---------------------------------------------------------------- Malas Sicht: Leine vom Sessel zum Buch, das Zeitungsbündel glimmt
function ghost(fb,v,S,GS){ var t=v.t, fl=GS.flags||{};
  if (!fl['k2.s2.free'] && !S.bookOut){ var ax=CHAIR.x+2, ay=CHAIR.y-30, bx=BOOKR[0]+BOOKR[2]/2, by=BOOKR[1]+BOOKR[3]/2;
    for (var s=0;s<=90;s++){ var u=s/90, x=ax+(bx-ax)*u, y=ay+(by-ay)*u-Math.sin(u*Math.PI)*12+Math.sin(t*1.4+u*7)*0.7, pulse=(Math.sin(t*1.8-u*10)+1)/2; if (pulse<0.2 && (s%2)) continue; fb.px(rnd(x),rnd(y),pulse>0.8?P.x6:(pulse>0.45?P.x5:P.x3)); }
    var g=0.5+Math.sin(t*1.2)*0.3; for (var a=0;a<12;a++){ var an=a/12*6.283; if (Math.sin(an*3+t*2)>-0.2) fb.px(rnd(bx+Math.cos(an)*(6+g)),rnd(by+Math.sin(an)*(3+g*0.5)),P.x4); } }
  if (!fl['k2.s2.obit'] && NEWS){ var n0=NEWS[0], gx=rnd(n0[0])+10, gy=rnd(n0[1])+4, a2=0.4+Math.sin(t*0.9)*0.2;
    for (var y=gy-9;y<gy+8;y++) for (var x=gx-14;x<gx+14;x++){ if (x<0||x>=320||y<0||y>=H) continue; var d=Math.hypot((x-gx)/14,(y-gy)/8); if (d<1 && bayer(x,y)<(1-d)*a2){ var k=y*320+x; fb.d[k]=M.UP[fb.d[k]]; } }
    for (var m=0;m<4;m++){ var ph=(t*0.2+hash(m,5))%1; fb.px(rnd(gx+(hash(m,6)-0.5)*16),rnd(gy-ph*14),ph<0.5?P.x5:P.x3); } } }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<20||Z>96||y>140) return false;
  if (X<92) return false;                                                         // Regale an der linken Wand
  if (X<112 && Z>32 && Z<62) return false;                                        // Lesesessel und Stehlampe
  if (X<124 && Z<24) return false;                                                // Ofen und Zeitungsbündel
  if (X>=VIT.X0-4 && X<=VIT.X1+4 && Z>=VIT.Z0-3 && Z<=VIT.Z1+3) return false;      // Vitrine
  if (X>=STOOL.X-9 && X<=STOOL.X+9 && Z<STOOL.Z+8) return false;                  // Hocker mit der Fotokiste
  if (X>=DESK.X0-4 && Z<=DESK.Z1+3) return false;                                  // hinter den Schreibtisch nur Jakob
  if (X>RECT[2]-2) return false;
  return x>4 && x<314; };
function actorLut(a,S,GS,tod){ if (tod!=='night') return null; return lampAmt(a.x,a.y-20)>0.3?WARM.a:M.TINT.night.a; }
var DOORR=(function(){ var xs=DOORQ.map(function(p){ return p[0]; }), ys=DOORQ.map(function(p){ return p[1]; }); return [Math.floor(Math.min.apply(null,xs))-2,Math.floor(Math.min.apply(null,ys))-2,Math.ceil(Math.max.apply(null,xs)-Math.min.apply(null,xs))+4,Math.ceil(Math.max.apply(null,ys)-Math.min.apply(null,ys))+2]; })();
var WINR=(function(){ var xs=WINQ.map(function(p){ return p[0]; }), ys=WINQ.map(function(p){ return p[1]; }); return [Math.floor(Math.min.apply(null,xs)),Math.floor(Math.min.apply(null,ys)),Math.ceil(Math.max.apply(null,xs)-Math.min.apply(null,xs)),Math.ceil(Math.max.apply(null,ys)-Math.min.apply(null,ys))]; })();
var BELLP=M.wallPt(SPEC,'R',DOORU[0]+8,DOORU[2]-4);
M.defineArt('antikvarijat',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{ door:DOORR, shelves:[0,2,128,FY-4], almanacs:[ALM.x0-1,ALM.y0-10,ALM.x1-ALM.x0+2,FY-ALM.y0+9], vitrine:R3.rect(VIT.X0-1,VIT.X1+1,VIT.Y0-2,FY,VIT.Z0,VIT.Z1),
    book:[rnd(R3.p(VIT.X0+24,VIT.Y1-1,VIT.Z0+5)[0])-2,rnd(R3.p(VIT.X0+24,VIT.Y1-1,VIT.Z0+5)[1])-14,16,16], photobox:R3.rect(STOOL.X-7,STOOL.X+7,72,FY,STOOL.Z-5,STOOL.Z+5),
    newspapers:R3.rect(101,134,FY-16,FY,6,16), armchair:[CHAIR.x-16,CHAIR.y-42,28,44], desk:R3.rect(DESK.X0-2,DESK.X1+1,DESK.Y0-12,FY,DESK.Z0,DESK.Z1),
    ledger:[rnd(R3.p(DESK.X0+22,DESK.Y0,DESK.Z0+8)[0])-1,rnd(R3.p(DESK.X0+22,DESK.Y0,DESK.Z0+8)[1])-6,24,8], bell:[rnd(BELLP[0])-9,rnd(BELLP[1])-10,14,15], kurrent:[KUR.x0-1,KUR.y0-4,KUR.w+2,KUR.h+5],
    maps:[127,5,54,18], stove:R3.rect(STOVE.X0-2,STOVE.X1+2,42,FY,STOVE.Z0,STOVE.Z1), window:WINR },
  stands:{ door:R3.st(216,80,'R'), shelves:R3.st(100,80,'L'), almanacs:R3.st(162,30,'B'), vitrine:R3.st(134,56,'B'), book:R3.st(138,54,'B'), photobox:R3.st(166,26,'B'), newspapers:R3.st(128,26,'L'),
    armchair:R3.st(116,64,'L'), desk:R3.st(198,54,'B'), ledger:R3.st(204,52,'B'), bell:R3.st(210,72,'R'), kurrent:R3.st(158,28,'B'), maps:R3.st(160,26,'B'), stove:R3.st(126,30,'L'), window:R3.st(212,62,'R') },
  actorPos:{ jakob:R3.st(200,22,'L'), ivan:[CHAIR.x,CHAIR.y,'R'] },
  start:R3.st(218,78,'L'), entries:{ ferhadija:R3.st(218,78,'L') }
});
})(M);
