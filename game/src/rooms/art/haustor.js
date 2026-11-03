/* ===== rooms/art/haustor.js — Eingangshalle von Haus 7 (Alipašino Polje) =====
   Eine Betonhalle mit Terrazzoboden (Messingleisten) und hellgrünem Ölsockel. Links an der Wand die Blechbriefkästen
   mit Namenszetteln, der Glaskasten „STANARI“, der Heizkörper und davor Dragicas alter Sessel mit Häkeldecke, daneben
   der Vogelkäfig mit dem Kanarienvogel; vorn links die Haustür (Drahtglas) zum Hof. Hinten das Schwarze Brett des
   Hausrats, der Lichtschalter mit Zeitschaltung (orangefarbenes Lämpchen), der Aufzug mit „VAN FUNKCIJE“, die Treppe
   nach oben (darunter der Kinderwagen), die Tür „DOMAR“, eine Topfpflanze. Rechts die Wohnungstür von Šehić
   (Hochparterre, zwei Stufen, Fußabtreter) und vorn ein paar Stufen hinunter die schwere Stahltür „SKLONIŠTE“ mit
   Hebel und Vorhängeschloss, daneben der alte Klingelknopf mit dem vergilbten Zettel „ŠKOLA“.
   S.shelterOpen: die Stahltür steht offen, dahinter die dunkle Treppe. S.strollerGone: der Kinderwagen ist fort. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
var VP=[160,58], RECT=[60,18,262,100], F=90, FY=100;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
// Schilderschrift: Mikroschrift, der Haken über ČŠŽ und der Strich über Ć eine Zeile höher (klarer als die gestauchten Glyphen)
function sign(b,s,x,y,c){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch){ var base={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'}[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') b.px(cx+1,y-1,c); else if (ch==='Ć') b.px(cx+2,y-1,c); else if (ch==='Đ') b.px(cx,y+2,c); cx+=w+1; }); return cx; }
function wq(sd,u0,u1,v0,v1){ return M.wallQuad(SPEC,sd,u0,u1,v0,v1); }
function wp(sd,u,v){ var q=M.wallPt(SPEC,sd,u,v); return [rd(q[0]),rd(q[1])]; }
// Punkt auf einer Seitenwand -> Wandkoordinaten (u Tiefe, v Höhe)
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }

// ---------------------------------------------------------------- Lage der Dinge
var NOTE={x0:70,x1:98,y0:34,y1:58};                 // Schwarzes Brett (Rückwand)
var CASE={x0:102,x1:130,y0:34,y1:60};               // Glaskasten STANARI (Rückwand)
var SWITCH={x:133,y:66};                            // Lichtschalter mit Zeitschaltung
var LIFT={x0:137,x1:175,y0:42,dx0:141,dx1:171,dy:50};
var STAIR={x0:179,x1:233,yTop:60};                  // Treppe nach oben (steigt nach rechts)
var DOMAR={x0:236,x1:258,y0:50};
var PLANT={x:63};
var MAIL={u0:2,u1:20,v0:30,v1:58};                  // Briefkästen (linke Wand)
var RAD={u0:10,u1:26,v0:76,v1:94};                  // Heizkörper (linke Wand)
var HDOOR={u0:40,u1:60,v0:34,v1:100};               // Haustür (linke Wand, vorn)
var SEHIC={u0:2,u1:17,v0:44,v1:96};                 // Wohnungstür Šehić (rechte Wand, zwei Stufen hoch)
var STEEL={u0:32,u1:54,v0:58,v1:122};               // Stahltür des Schutzraums (rechte Wand, unten)
var BELL={u:21,v:64};
var CHAIR={x:56,y:112};                             // Dragicas Sessel (Hüfte x, Füße y)
var CAGE={x:28,y:52};                               // Vogelkäfig (hängt an der Wand)
var PRAM={x0:186,x1:214,base:106};
var CACHE={};

// ---------------------------------------------------------------- Texturen
// Putz oben (graues Weiß, Stockflecken), hellgrüner Ölsockel mit dunklerer Kante, Sockelleiste
function wallCol(u,v,x,y,dim){ var c;
  if (v<60){ var f=fbm(u*0.03,v*0.05); c=(f>0.6 && bayer(x,y)<(f-0.6)*3)?P.s3:(f>0.42?P.s4:((bayer(x,y)<(0.42-f)*4)?P.s5:P.s4)); if (hash(Math.floor(u/2),Math.floor(v/2))<0.025) c=P.s3; if (v<3) c=P.s3; if (v>52 && bayer(x,y)<(v-52)/20) c=M.DN[c]; }
  else if (v<62) c=(v<61)?P.a3:P.a4;
  else if (v<97){ var g=fbm(u*0.05+7,v*0.06); c=g>0.62?P.a4:(g>0.3?P.a5:P.a6); if (((u*0.3+v)%31)<1 && v>70) c=P.a4; if (v>90 && bayer(x,y)<(v-90)/14) c=P.a4; if (hash(u*1.3,v*2.1)<0.02) c=P.s4; }
  else c=(v<98)?P.s2:P.s1;
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
// Terrazzo mit Messingleisten im Raster
function floorCol(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z;
  var gx=((X-60)%50+50)%50, gz=((Z+4)%30+30)%30, ln=0.5/f.k+0.1;
  if (gx<ln || gz<0.35) return (bayer(x,y)<0.35)?P.y2:P.e2;
  var wear=fbm(X*0.025,Z*0.04), c=(wear>0.58)?P.s4:P.s3; if (wear<0.36 && bayer(x,y)<(0.36-wear)*3) c=P.s2;
  var h=hash(x,y); if (h<0.05) c=P.s2; else if (h>0.975) c=P.s5; else if (h>0.965) c=P.t3;
  return c; }
function ceilCol(xb,d,x,y){ var t=(VP[1]-RECT[1])/(VP[1]-y), Z=(1/t-1)*F*0.6, f=fbm(xb*0.015,Z*0.03), c=(f>0.62 && bayer(x,y)<(f-0.62)*2.5)?P.s3:P.s4; if (((Z+3)%30)<0.7) c=P.s3; return c; }

// ---------------------------------------------------------------- Linke Wand: Briefkästen, Glaskasten, Heizkörper, Haustür
function paintMail(b){ var cols=5, rows=3, du=(MAIL.u1-MAIL.u0)/cols, dv=(MAIL.v1-MAIL.v0)/rows;
  b.poly(wq('L',MAIL.u0-1,MAIL.u1+1,MAIL.v0-2,MAIL.v1+2),P.m1);
  for (var r=0;r<rows;r++) for (var c=0;c<cols;c++){ var u0=MAIL.u0+c*du+0.4, u1=u0+du-0.8, v0=MAIL.v0+r*dv+0.5, v1=v0+dv-1, i=r*cols+c, col=(hash(i,3)<0.25)?P.m2:P.m3;
    b.poly(wq('L',u0,u1,v0,v1),function(x,y){ var q=wallUV('L',x,y); if (!q) return col; var lv=(q.v-v0)/(v1-v0), lu=(q.u-u0)/(u1-u0); if (lv<0.12) return P.m4; if (lv>0.88) return P.m0; if (lu>0.9) return P.m1; return col; });
    var s=wq('L',u0+du*0.15,u1-du*0.15,v0+dv*0.3,v0+dv*0.42); b.poly(s,P.k1);
    if (hash(i,9)<0.8){ var n=wq('L',u0+du*0.2,u1-du*0.25,v0+dv*0.58,v0+dv*0.78); b.poly(n,(hash(i,5)<0.5)?P.s6:P.s5); var nn=wp('L',(u0+u1)/2,v0+dv*0.68); b.px(nn[0],nn[1],P.m1); }
    if (hash(i,7)<0.2){ var ad=wp('L',u0+du*0.5,v0+dv*0.36); b.px(ad[0],ad[1]+1,P.r3); b.px(ad[0],ad[1],P.y4); } }
  }
function paintCase(b){ var x0=CASE.x0, x1=CASE.x1, y0=CASE.y0, y1=CASE.y1, x, y;
  b.rect(x0-2,y0-2,x1-x0+4,y1-y0+4,P.w1); b.hl(x0-2,x1+1,y0-2,P.w3); b.hl(x0-2,x1+1,y1+1,P.w0); b.vl(x1+1,y0-2,y1+1,P.w0);
  b.rect(x0,y0,x1-x0,y1-y0,P.s5); b.rect(x0,y0,x1-x0,7,P.b0); M.microText(b,'STANARI',x0+1,y0+1,P.s6);
  // Liste nach Stockwerken: Nummer links, Namen als feine Zeilen
  for (var r=0;r<9;r++){ var yy=y0+9+r*2; M.microText(b,'',x0,yy,P.k1); b.px(x0+2,yy,P.r2); b.hl(x0+4,x0+4+6+Math.floor(hash(r,3)*8),yy,P.m1); b.hl(x0+17,x0+17+3+Math.floor(hash(r,4)*6),yy,P.m2); }
  // Glas: Spiegelung, ein Riss, eine eingeklemmte Zusatzliste
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ if (((x*0.7+y)%15)<1.2) b.px(x,y,P.s6); }
  b.line(x1-6,y0+8,x1-2,y1-3,P.s3); b.rect(x0+18,y1-7,9,7,P.y4); b.hl(x0+19,x0+25,y1-5,P.m2); b.hl(x0+19,x0+24,y1-3,P.m2);
  b.px(x0+(x1-x0>>1),y0-1,P.y3); }
function paintRad(b){ var q=wq('L',RAD.u0,RAD.u1,RAD.v0,RAD.v1);
  b.poly(q,function(x,y){ var w=wallUV('L',x,y); if (!w) return P.s4; var fu=((w.u-RAD.u0)*1.4)%2; return fu<0.7?P.s3:(fu<1.3?P.s5:P.s4); });
  var p0=wp('L',RAD.u0,RAD.v1+1), p1=wp('L',RAD.u1,RAD.v1+1); b.line(p0[0],p0[1],p1[0],p1[1],P.s2); var v0=wp('L',RAD.u1+0.5,RAD.v0+4); b.rect(v0[0]-1,v0[1],2,3,P.y2); }
function outsideAt(x,y,tod,weather){ // Blick durch die Haustür in den Hof
  if (tod==='night') return (y<70)?((hash(x>>1,y>>1)<0.06)?P.y3:P.n0):((y<96)?P.n1:P.k2);
  if (tod==='dawn') return (y<70)?P.v2:((y<96)?P.v1:P.m1);
  if (weather==='calm') return (y<62)?P.b4:((y<74)?P.s5:((y<96)?P.s4:P.s3));
  return (y<74)?P.s5:((y<96)?P.s4:P.s3); }
function paintHouseDoor(b,tod,weather,glassM){ var Q=wq('L',HDOOR.u0-1,HDOOR.u1+1,HDOOR.v0-2,HDOOR.v1); b.poly(Q,P.m1);
  var G=wq('L',HDOOR.u0+1,HDOOR.u1-1,HDOOR.v0+1,HDOOR.v1-12);
  b.poly(G,function(x,y){ glassM[y*W+x]=1; var c=outsideAt(x,y,tod,weather), w=wallUV('L',x,y); if (w && ((Math.floor(w.u*2)+Math.floor(w.v*0.5))%4===0)) c=M.DN[c]; return c; });
  // Drahtglas: feines Rautengitter
  b.poly(G,function(x,y){ var w=wallUV('L',x,y); if (!w) return undefined; var a=(w.u*1.8+w.v*0.5)%5, c2=(w.u*1.8-w.v*0.5+400)%5; if (a<0.35||c2<0.35) return M.DN[b.get(x,y)]; return undefined; });
  var pb=wq('L',HDOOR.u0+1,HDOOR.u1-1,HDOOR.v1-12,HDOOR.v1-1); b.poly(pb,P.m2);
  var m0=wp('L',(HDOOR.u0+HDOOR.u1)/2,HDOOR.v0), m1=wp('L',(HDOOR.u0+HDOOR.u1)/2,HDOOR.v1); b.line(m0[0],m0[1],m1[0],m1[1],P.m3);
  var h0=wp('L',HDOOR.u0+3,66), h1=wp('L',HDOOR.u1-3,66); b.line(h0[0],h0[1],h1[0],h1[1],P.m4); b.line(h0[0],h0[1]+1,h1[0],h1[1]+1,P.m1);
  var tr=wq('L',HDOOR.u0-1,HDOOR.u1+1,HDOOR.v0-8,HDOOR.v0-3); b.poly(tr,function(x,y){ glassM[y*W+x]=1; return outsideAt(x,y-20,tod,weather); });
  CACHE.hdoor=G; }

// ---------------------------------------------------------------- Rückwand: Schwarzes Brett, Schalter, Aufzug, Treppe, DOMAR, Pflanze
function paintNotes(b){ var x0=NOTE.x0, x1=NOTE.x1, y0=NOTE.y0, y1=NOTE.y1, x, y;
  b.rect(x0-1,y0-1,x1-x0+2,y1-y0+2,P.w1); b.rect(x0,y0,x1-x0,y1-y0,P.w3); for (y=y0;y<y1;y++) for (x=x0;x<x1;x++) if (hash(x,y)<0.25) b.px(x,y,P.w4);
  b.hl(x0-1,x1,y0-1,P.w2); b.hl(x0-1,x1,y1,P.w0);
  var notes=[[x0+2,y0+2,12,14,P.s6],[x0+15,y0+3,14,10,P.s5],[x0+3,y0+17,10,6,P.y4],[x0+14,y0+14,15,9,P.s6],[x0+20,y0+1,9,6,P.b4]];
  notes.forEach(function(n,i){ b.rect(n[0],n[1],n[2],n[3],n[4]); for (var yy=n[1]+3;yy<n[1]+n[3]-1;yy+=2) b.hl(n[0]+1,n[0]+n[2]-2-((yy+i)%3),yy,P.m2); b.px(n[0]+(n[2]>>1),n[1],P.r3); });
  sign(b,'KUĆNI SAVJET',x0-1,y1+3,P.s1); }
function paintSwitch(b){ var x=SWITCH.x, y=SWITCH.y; b.rect(x-2,y-3,5,7,P.s5); b.hl(x-2,x+2,y-3,P.s6); b.rect(x-1,y-1,3,3,P.s3); b.px(x,y,P.t3); CACHE.sw=[x,y]; b.line(x,y+4,x,y+12,P.s2); }
function paintLift(b){ var L=LIFT, x, y;
  b.rect(L.x0,L.y0,L.x1-L.x0,FY-L.y0,P.m2); b.hl(L.x0,L.x1-1,L.y0,P.m4); b.vl(L.x0,L.y0,FY-1,P.m3); b.vl(L.x1-1,L.y0,FY-1,P.m0);
  for (y=L.dy;y<FY;y++) for (x=L.dx0;x<L.dx1;x++){ var c=((x-L.dx0)%5===0)?P.m2:P.m3; if (x===((L.dx0+L.dx1)>>1)) c=P.k2; if (fbm(x*0.4,y*0.2)>0.66) c=P.m2; if (y>FY-6 && hash(x,y)<0.3) c=P.t1; b.px(x,y,c); }
  // Stockwerksanzeige (dunkel), Rufknopf, Zettel quer über den Türen
  b.rect(L.dx0+8,L.y0+2,18,5,P.k1); for (var i=0;i<6;i++) b.px(L.dx0+10+i*3,L.y0+4,P.m1); b.px(L.dx0+16,L.y0+4,P.r1);
  b.rect(L.x1+1,70,4,8,P.m3); b.px(L.x1+2,72,P.k2); b.px(L.x1+2,75,P.k2);
  var sw=M.microWidth('FUNKCIJE')+4, sx=((L.dx0+L.dx1)>>1)-(sw>>1), sy=62; for (y=sy;y<sy+14;y++) for (x=sx;x<sx+sw;x++){ var yy=y+Math.round((x-sx)*0.05); b.px(x,yy,(x===sx||x===sx+sw-1)?P.s4:P.s5); }
  b.rect(sx-2,sy-1,3,2,P.e4); b.rect(sx+sw-1,sy+1,3,2,P.e4); M.microText(b,'VAN',sx+((sw-11)>>1),sy+2,P.r2); M.microText(b,'FUNKCIJE',sx+2,sy+8,P.r2);
  CACHE.lift=[L.x0,L.y0,L.x1,FY]; }
function stepY(i){ return FY-i*4; }
function paintStairs(b,S){ var x0=STAIR.x0, x1=STAIR.x1, n=10, x, y;
  // Treppenlauf an der Rückwand: Stufen steigen nach rechts, darüber das Geländer mit Holzhandlauf
  var dx=(x1-x0)/n;
  for (var i=0;i<n;i++){ var sx=rd(x0+i*dx), ex=rd(x0+(i+1)*dx), top=FY-(i+1)*4;
    for (y=top;y<FY;y++) for (x=sx;x<x1;x++){ var c=(y===top)?P.s5:((y<top+2)?P.s4:P.s3); if (x<ex && y>=top+2) c=P.s2; b.px(x,y,c); } }
  // Wange und Untersicht (darunter steht der Kinderwagen)
  for (x=x0;x<x1;x++){ var yt=rd(FY-(x-x0)/dx*4); for (y=yt+1;y<yt+5 && y<FY;y++) b.px(x,y,P.s2); }
  for (i=0;i<=n;i++){ var px=rd(x0+i*dx+2), py=rd(FY-i*4-2); b.vl(px,py-18,py,P.m1); }
  b.line(x0+2,FY-20,x1+2,FY-4-n*4-18,P.w3); b.line(x0+2,FY-19,x1+2,FY-4-n*4-17,P.w1);
  // Podest oben, Fenster des Treppenhauses (Licht von oben)
  b.rect(x1-2,STAIR.yTop-2,(DOMAR.x0-2)-(x1-2),3,P.s4); CACHE.stairWin=[x0+30,22,34,18];
  var sw=CACHE.stairWin; b.rect(sw[0]-1,sw[1]-1,sw[2]+2,sw[3]+2,P.s3); b.rect(sw[0],sw[1],sw[2],sw[3],P.s5); for (x=sw[0]+5;x<sw[0]+sw[2];x+=6) b.vl(x,sw[1],sw[1]+sw[3]-1,P.s3); b.hl(sw[0],sw[0]+sw[2]-1,sw[1]+8,P.s3); }
function paintDomar(b){ var x0=DOMAR.x0, x1=DOMAR.x1, y0=DOMAR.y0;
  M.prop.door(b,x0,y0,x1-x0,FY-y0,{ramp:R('w0 w1 w2 w3 w4'),frame:R('m1 m2 m3 m4'),knob:'R'});
  var sw=M.microWidth('DOMAR')+4, sx=x0+((x1-x0-sw)>>1); b.rect(sx,y0+6,sw,7,P.s5); b.hl(sx,sx+sw-1,y0+6,P.s6); M.microText(b,'DOMAR',sx+2,y0+7,P.k1);
  b.rect(x0+4,y0+20,6,8,P.s6); b.hl(x0+5,x0+8,y0+22,P.m2); b.hl(x0+5,x0+8,y0+24,P.m2); }
function paintPlant(b){ var x=PLANT.x, by=104; b.rect(x-5,by-9,11,9,P.t3); b.hl(x-6,x+5,by-10,P.t4); b.vl(x+5,by-9,by-1,P.t2); b.hl(x-5,x+5,by-1,P.t1);
  var r=M.rng(12); b.vl(x,by-34,by-10,P.w1); for (var i=0;i<12;i++){ var ly=by-14-Math.floor(r()*24), side=(i%2)?1:-1, L=4+Math.floor(r()*4);
    b.ellipse(x+side*L*0.8,ly,L*0.7,1.6,function(xx,yy){ return yy<ly?P.g4:P.g3; }); b.line(x,ly+1,x+side*L*0.8,ly,P.g2); } }

// ---------------------------------------------------------------- Rechte Wand: Šehić, Stahltür, Klingel
function paintSehic(b){ var q=wq('R',SEHIC.u0,SEHIC.u1,SEHIC.v0,SEHIC.v1);
  b.poly(wq('R',SEHIC.u0-1,SEHIC.u1+1,SEHIC.v0-2,SEHIC.v1),P.w0);
  b.poly(q,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.w2; var lu=(w.u-SEHIC.u0)/(SEHIC.u1-SEHIC.u0), lv=(w.v-SEHIC.v0)/(SEHIC.v1-SEHIC.v0); var c=(lu<0.08)?P.w3:P.w2; if ((lv>0.08&&lv<0.42||lv>0.52&&lv<0.92) && lu>0.18 && lu<0.82) c=(lu<0.24||lv<0.12||(lv>0.52&&lv<0.56))?P.w1:P.w3; return c; });
  var k=wp('R',SEHIC.u1-3,70); b.rect(k[0],k[1],2,2,P.y3); var sp=wp('R',(SEHIC.u0+SEHIC.u1)/2,60); b.px(sp[0],sp[1],P.k1);
  var nt=wp('R',SEHIC.u0+3,54); b.rect(nt[0]-3,nt[1]-2,24,8,P.y3); b.hl(nt[0]-3,nt[0]+20,nt[1]-2,P.y4); b.hl(nt[0]-3,nt[0]+20,nt[1]+5,P.y1); sign(b,'ŠEHIĆ',nt[0]-1,nt[1],P.k1);
  // zwei Stufen (Hochparterre) und der Fußabtreter
  var st=[R3.p(246,FY-4,SEHIC.u0),R3.p(262,FY-4,SEHIC.u0),R3.p(262,FY-4,SEHIC.u1+2),R3.p(246,FY-4,SEHIC.u1+2)]; b.poly(st,P.s4);
  var sf=[R3.p(246,FY-4,SEHIC.u1+2),R3.p(262,FY-4,SEHIC.u1+2),R3.p(262,FY,SEHIC.u1+2),R3.p(246,FY,SEHIC.u1+2)]; b.poly(sf,P.s2);
  var sl=[R3.p(246,FY-4,SEHIC.u0),R3.p(246,FY-4,SEHIC.u1+2),R3.p(246,FY,SEHIC.u1+2),R3.p(246,FY,SEHIC.u0)]; b.poly(sl,P.s3);
  var mat=[R3.p(250,FY-4,SEHIC.u0+4),R3.p(261,FY-4,SEHIC.u0+4),R3.p(261,FY-4,SEHIC.u1-2),R3.p(250,FY-4,SEHIC.u1-2)]; b.poly(mat,function(x,y){ return ((x+y)&1)?P.e1:P.e2; });
  CACHE.sehicSt=R3.st(242,(SEHIC.u0+SEHIC.u1)/2,'R'); }
function paintSteel(b,S){ var D=STEEL, q=wq('R',D.u0,D.u1,D.v0,D.v1);
  // Treppenschacht: die rechte Wand reicht hier bis unter den Boden
  var wellQ=[R3.p(240,FY,D.u0-4),R3.p(262,FY,D.u0-4),R3.p(262,D.v1+2,D.u0-4),R3.p(262,D.v1+2,62),R3.p(240,D.v1+2,62),R3.p(240,FY,62)];
  b.poly(wq('R',D.u0-4,62,FY,D.v1+2),function(x,y){ var w=wallUV('R',x,y); if (!w) return P.a4; return M.DN[wallCol(w.u,Math.min(w.v,96),x,y,0)]; });
  // Stufen hinunter (zum Betrachter hin), seitlich die Wange
  for (var i=0;i<4;i++){ var z0=D.u0-4+i*6, z1=z0+6, yy=FY+i*5.5, top=[R3.p(240,yy,z0),R3.p(262,yy,z0),R3.p(262,yy,z1),R3.p(240,yy,z1)], fr=[R3.p(240,yy,z1),R3.p(262,yy,z1),R3.p(262,yy+5.5,z1),R3.p(240,yy+5.5,z1)];
    b.poly(top,i%2?P.s3:P.s4); b.poly(fr,P.s2); var e0=R3.p(240,yy,z0), e1=R3.p(262,yy,z0); b.line(rd(e0[0]),rd(e0[1]),rd(e1[0]),rd(e1[1]),P.s5); }
  b.poly([R3.p(240,FY+22,D.u0+20),R3.p(262,FY+22,D.u0+20),R3.p(262,FY+22,64),R3.p(240,FY+22,64)],P.s2);
  // die Tür: schweres Stahlblatt mit Nieten, Hebel, Vorhängeschloss; offen: dunkle Treppe dahinter
  b.poly(wq('R',D.u0-1.5,D.u1+1.5,D.v0-2,D.v1),P.m0);
  if (S.shelterOpen){ b.poly(q,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.k0; var lv=(w.v-D.v0)/(D.v1-D.v0), lu=(w.u-D.u0)/(D.u1-D.u0); if (lv>0.45){ var sv=(lv-0.45)*12+lu*2.5; if ((sv%2)<0.5) return P.m0; if ((sv%2)<0.9) return P.k2; } return (lv<0.2 && lu<0.3)?P.k2:((bayer(x,y)<0.08)?P.k1:P.k0); });
    var leaf=wq('R',D.u0-9,D.u0-1,D.v0,D.v1); b.poly(leaf,function(x,y){ return (x%3===0)?P.m1:P.m2; }); var lv0=wp('R',D.u0-6,(D.v0+D.v1)/2); b.rect(lv0[0],lv0[1],3,2,P.m3); }
  else { b.poly(q,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.m2; var lu=(w.u-D.u0)/(D.u1-D.u0), lv=(w.v-D.v0)/(D.v1-D.v0), c=(fbm(x*0.3,y*0.15)>0.62)?P.m1:P.m2;
      if (lu<0.06||lu>0.94||lv<0.04||lv>0.96) c=P.m3; if ((lu>0.12&&lu<0.16)||(lu>0.84&&lu<0.88)) c=P.m1; if (Math.abs(lv-0.5)<0.012) c=P.m1; if (fbm(x*0.5,y*0.3)>0.7) c=P.t1; return c; });
    for (var r=0;r<6;r++){ var rv=D.v0+5+r*10; [D.u0+2,D.u1-2].forEach(function(uu){ var pp=wp('R',uu,rv); b.px(pp[0],pp[1],P.m4); }); }
    var h0=wp('R',D.u0+4,86), h1=wp('R',D.u0+12,80); b.line(h0[0],h0[1],h1[0],h1[1],P.m4); b.line(h0[0],h0[1]+1,h1[0],h1[1]+1,P.k1); b.rect(h0[0]-1,h0[1]-1,3,4,P.m1);
    var lk=wp('R',D.u0+5,92); b.rect(lk[0],lk[1],4,4,P.y2); b.hl(lk[0],lk[0]+3,lk[1],P.y4); b.px(lk[0]+1,lk[1]-1,P.m3); b.px(lk[0]+2,lk[1]-2,P.m3); b.px(lk[0]+3,lk[1]-1,P.m3); b.px(lk[0]+2,lk[1]+2,P.k1); }
  // Schablonenschrift SKLO-NIŠTE auf dem Türblatt (zwei Zeilen), darüber ein Hinweisschild
  if (!S.shelterOpen){ var s1=wp('R',D.u0+3,D.v0+8); M.microText(b,'SKLO',s1[0]-1,s1[1],P.r2); var s2=wp('R',D.u0+3,D.v0+15); sign(b,'NIŠTE',s2[0]-2,s2[1],P.r2); }
  var s0=wp('R',D.u0+1,D.v0-9); b.rect(s0[0]-6,s0[1]-1,22,8,P.s5); b.hl(s0[0]-6,s0[0]+15,s0[1]-1,P.s6); b.hl(s0[0]-6,s0[0]+15,s0[1]+6,P.s3); b.rect(s0[0]-5,s0[1],7,6,P.t4); b.hl(s0[0]-2,s0[0]-2,s0[1]+1,P.b1); b.hl(s0[0]-3,s0[0]-1,s0[1]+2,P.b1); b.hl(s0[0]-3,s0[0]-1,s0[1]+3,P.b1); b.hl(s0[0]-4,s0[0],s0[1]+4,P.b1); M.microText(b,'CZ',s0[0]+4,s0[1]+1,P.b0);
  // Klingelknopf mit vergilbtem Zettel „ŠKOLA“
  var bb=wp('R',BELL.u,BELL.v); b.rect(bb[0]-1,bb[1]-1,4,4,P.s5); b.px(bb[0],bb[1],P.k2); b.px(bb[0]+1,bb[1],P.k1); b.rect(bb[0]-3,bb[1]+4,13,13,P.e4); b.hl(bb[0]-3,bb[0]+9,bb[1]+4,P.s4); b.vl(bb[0]+9,bb[1]+4,bb[1]+16,P.e2); sign(b,'ŠKO',bb[0]-2,bb[1]+6,P.e1); M.microText(b,'LA',bb[0]-2,bb[1]+11,P.e1); b.px(bb[0]+7,bb[1]+15,P.e2);
  CACHE.bell=[bb[0],bb[1]];
  // Geländer um den Schacht (Rohr)
  var g0=R3.p(240,FY-18,D.u0-4), g1=R3.p(240,FY-18,62); b.line(rd(g0[0]),rd(g0[1]),rd(g1[0]),rd(g1[1]),P.m3); b.line(rd(g0[0]),rd(g0[1])+1,rd(g1[0]),rd(g1[1])+1,P.m1);
  [D.u0-4,D.u0+12,D.u0+28].forEach(function(z){ var a=R3.p(240,FY-18,z), c=R3.p(240,FY,z); b.vl(rd(a[0]),rd(a[1]),rd(c[1]),P.m2); }); }

// ---------------------------------------------------------------- Sessel mit Häkeldecke, Vogelkäfig, Kinderwagen
function paintChair(w,tod){ var x=CHAIR.x, by=CHAIR.y, C=R('t0 t1 t2 t3 t4'), Wd=R('w0 w1 w2 w3 w4'), xx, yy;
  // Rückenlehne links (sie sitzt mit Blick nach rechts): hohes, rundes Polster in abgewetztem Orangebraun
  for (yy=by-46;yy<by-9;yy++) for (xx=x-14;xx<x-3;xx++){ var u=(xx-(x-14))/11, v=(yy-(by-46))/37; if (v<0.12 && Math.abs(u-0.5)>0.55-v*3) continue; var c=u<0.22?C[3]:(u<0.7?C[2]:C[1]); if (v>0.9) c=C[1]; if (((xx+yy*2)%6)===0) c=M.DN[c]; w.px(xx,yy,c); }
  // Sitzkissen, Vorderkante, Holzarmlehne vorn mit Polster
  for (yy=by-17;yy<by-8;yy++) for (xx=x-5;xx<x+14;xx++){ var c2=(yy===by-17)?C[4]:((yy<by-14)?C[3]:C[2]); if (yy===by-9) c2=C[0]; w.px(xx,yy,c2); }
  w.hl(x-12,x+13,by-8,C[0]);
  // gehäkeltes Deckchen über der Lehne: weiß, Lochmuster, Zacken
  for (yy=by-47;yy<by-32;yy++) for (xx=x-15;xx<x-1;xx++){ var u2=xx-(x-15), v2=yy-(by-47); if (v2>11-Math.abs(u2-7)*0.4+((u2%2)?1:0)) continue; if (((u2+v2)%3===0)&&((u2-v2+30)%4===1)) continue; w.px(xx,yy,(v2<1)?P.s6:((u2+v2)%2?P.s6:P.s5)); }
  for (var f=0;f<7;f++) w.px(x-14+f*2,by-35+(f%2)*2-Math.round(Math.abs(f-3)*0.4),P.s5);
  // ein kleines Kissen und das Strickzeug
  w.ellipse(x-3,by-19,3.5,2.8,P.b2); w.px(x-4,by-20,P.b3); w.line(x+6,by-18,x+10,by-21,P.s4); w.px(x+8,by-17,P.r3); w.px(x+9,by-17,P.r3); }
function paintChairFront(w){ var x=CHAIR.x, by=CHAIR.y, Wd=R('w0 w1 w2 w3 w4');
  // kurze Holzarmlehne vorn (auf Sitzhöhe + Handbreit), Stütze, Füße
  w.rect(x+2,by-20,14,2,Wd[3]); w.hl(x+2,x+15,by-20,Wd[4]); w.ellipse(x+15,by-19,1.6,1.6,Wd[3]); w.rect(x+13,by-18,3,10,Wd[2]); w.vl(x+13,by-18,by-9,Wd[3]); w.vl(x+15,by-18,by-9,Wd[0]);
  w.rect(x-4,by-8,2,8,Wd[1]); w.rect(x+12,by-8,2,8,Wd[1]); w.px(x-4,by-1,Wd[3]); w.px(x+12,by-1,Wd[3]); }
function paintCage(w){ var cx=CAGE.x, cy=CAGE.y, x, y;
  w.vl(cx,cy-12,cy-8,P.y2); w.px(cx,cy-13,P.m2);   // Haken
  for (y=cy-8;y<cy+12;y++){ var t=(y-(cy-8))/20, hw=Math.round(y<cy-3?2+Math.sqrt(Math.max(0,(y-(cy-8))))*2.2:7); for (x=cx-hw;x<=cx+hw;x++){ if (x===cx-hw||x===cx+hw||(x-cx+20)%3===0||y===cy-8) w.px(x,y,(x<cx)?P.y3:P.y2); } }
  w.rect(cx-8,cy+12,17,3,P.y2); w.hl(cx-8,cx+8,cy+12,P.y4); w.hl(cx-7,cx+7,cy+11,P.s5);
  w.hl(cx-5,cx+5,cy+4,P.w2); w.hl(cx-4,cx+4,cy-1,P.w2);   // Stangen
  CACHE.bird=[cx-2,cy+3]; }
function bird(w,x,y,f){ w.px(x,y,P.y4); w.px(x+f,y,P.y4); w.px(x,y-1,P.y4); w.px(x+f,y-1,P.y5); w.px(x+2*f,y-1,P.y2); w.px(x-f,y,P.y3); w.px(x+f,y-2,P.y4); w.px(x+2*f,y-2,P.t3); w.px(x+f,y-2,P.k1); }
function paintPram(w){ var x0=PRAM.x0, x1=PRAM.x1, by=PRAM.base, Rk=R('c0 c1 c2 c3');
  w.ellipse(x0+6,by-3,3,3,P.k1); w.ellipse(x1-6,by-3,3,3,P.k1); w.px(x0+6,by-3,P.m3); w.px(x1-6,by-3,P.m3);
  w.line(x0+6,by-3,x1-6,by-9,P.m2); w.line(x1-6,by-3,x0+6,by-9,P.m2);
  w.rect(x0+1,by-18,x1-x0-4,9,Rk[2]); w.hl(x0+1,x1-4,by-18,Rk[3]); w.hl(x0+1,x1-4,by-10,Rk[0]);
  w.poly([[x0,by-18],[x0+12,by-18],[x0+12,by-30],[x0+4,by-28]],function(x,y){ return ((x+y)%4===0)?Rk[1]:Rk[2]; }); w.line(x0+4,by-28,x0+12,by-30,Rk[3]);
  w.line(x1-4,by-18,x1+3,by-26,P.m3); w.hl(x1+1,x1+5,by-26,P.k2); w.rect(x0+16,by-20,8,2,P.s5); }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var NEON=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.08+4, g*0.74+L*0.1+8, b*0.78+L*0.1+14]; });
var DAWNI=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.1+10, g*0.62+L*0.1+8, b*0.72+L*0.12+20]; });
var NIGHT_DARK=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.4+L*0.06, g*0.46+L*0.08+2, b*0.56+L*0.12+10]; });

function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), glassM=new Uint8Array(W*H), x, y;
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return wallCol(u+60,v+RECT[1],x,y,0); },
    side:function(u,v,x,y,sd){ return wallCol(u*1.6+(sd==='L'?0:500),v+RECT[1],x,y,sd==='L'?0:1); },
    floor:floorCol, ceil:ceilCol });
  // Neonröhre an der Decke (Leuchte, Halterungen)
  var n0=R3.p(132,RECT[1]+1,30), n1=R3.p(188,RECT[1]+1,30); b.rect(rd(n0[0]),rd(n0[1]),rd(n1[0]-n0[0]),3,P.s3); b.hl(rd(n0[0])+1,rd(n1[0])-2,rd(n0[1])+2,P.s5); CACHE.neon=[rd(n0[0]),rd(n1[0]),rd(n0[1])+2];
  paintMail(b); paintCase(b); paintRad(b); paintHouseDoor(b,tod,weather,glassM);
  paintNotes(b); paintSwitch(b); paintLift(b); paintStairs(b,S); paintDomar(b); paintPlant(b);
  paintSehic(b); paintSteel(b,S);
  if (!S.strollerGone){ var pw={px:function(x,y,c){ b.px(x,y,c); },rect:function(x,y,w,h,c){ b.rect(x,y,w,h,c); },hl:function(a,z,y,c){ b.hl(a,z,y,c); },vl:function(x,a,z,c){ b.vl(x,a,z,c); },line:function(a,c,d,e,f){ b.line(a,c,d,e,f); },ellipse:function(a,c,d,e,f){ b.ellipse(a,c,d,e,f); },poly:function(p,c){ b.poly(p,c); }}; paintPram(pw); }
  // Kontaktschatten, Schmutz an der Wand hinter dem Sessel
  var LF=M.lf.sum(M.lf.vignette(W,H,1.2),M.lf.pool(42,120,26,4,-1.2),M.lf.pool(170,106,20,3,-0.8),M.lf.pool(250,104,16,3,-0.6),M.lf.pool(125,101,24,2,-0.6));
  // Licht: tags die Haustür (links vorn) und das Treppenhausfenster; nachts die Neonröhre
  var notGlass=function(x,y){ return !glassM[y*W+x]; };
  if (tod==='day'){ M.light(b,M.lf.sum(LF,M.lf.pool(36,128,90,20,0.9),M.lf.beam(20,70,150,136,10,40,0.7),M.lf.pool(190,40,50,40,0.5),M.lf.k(-0.1)),0,0,notGlass); }
  else { M.light(b,M.lf.sum(LF,M.lf.pool(160,60,140,80,0.4),M.lf.pool(160,112,90,24,0.5),M.lf.k(-0.35)),0,0,notGlass);
    var tint=tod==='night'?NEON:DAWNI; for (var k=0;k<W*H;k++){ if (glassM[k]) continue; b.d[k]=M.tintPx(tint,b.d[k],k%W,(k/W)|0); }
    // Ecken und der Treppenschacht bleiben dunkel
    for (y=0;y<H;y++) for (x=0;x<W;x++){ var k2=y*W+x; if (glassM[k2]) continue; var dx=(x-160)/170, dy=(y-70)/90; if (dx*dx+dy*dy>0.75 && bayer(x,y)<(dx*dx+dy*dy-0.75)*2.4) b.d[k2]=M.tintPx(NIGHT_DARK,b.d[k2],x,y); } }
  // Lichtquellen selbst
  var nn=CACHE.neon; if (tod!=='day'){ b.hl(nn[0]+1,nn[1]-2,nn[2],P.l1); b.hl(nn[0]+2,nn[1]-3,nn[2]-1,P.s6); M.glow(b,(nn[0]+nn[1])/2,nn[2]+2,18,0,0.4); }
  var s=CACHE.sw; b.px(s[0],s[1],tod==='day'?P.t4:P.y4);
  CACHE.glassM=glassM; return b; }

// ---------------------------------------------------------------- Ebenen: Sessel mit Käfig (Figuren gehen davor vorbei), Treppengeländer vorn
function finishL(L,tod){ if (tod==='day'){ M.light(L,M.lf.pool(36,128,90,20,0.5),L.ox,L.oy); return; } M.tintApply(L,tod==='night'?NEON:DAWNI); }
function layers(S,GS,tod){ var out=[];
  var c=M.layer(CHAIR.x-16,CHAIR.y-48,34,50,CHAIR.y-1), w=M.lw(c); paintChair(w,tod); finishL(c,tod); out.push(c);
  var cf=M.layer(CHAIR.x-8,CHAIR.y-26,26,27,CHAIR.y+2), wf=M.lw(cf); paintChairFront(wf); finishL(cf,tod); out.push(cf);
  var g=M.layer(CAGE.x-10,CAGE.y-16,22,34,CHAIR.y-2), gw=M.lw(g); paintCage(gw); finishL(g,tod); out.push(g);
  return out; }

// ---------------------------------------------------------------- Bewegung: Vogel hüpft, Lämpchen, Neon flackert
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod;
  var bp=CACHE.bird; if (bp){ var ph=Math.floor(t*0.9)%6, bx=bp[0]+(ph<3?0:4), by=bp[1]+(ph<3?0:-5)+((Math.floor(t*3.1)%9===0)?-1:0), f=(Math.floor(t*0.45)%2)?1:-1; bird(fb,bx,by,f); }
  var s=CACHE.sw; if (s){ var on=(tod!=='day')||(Math.sin(t*1.7)>-0.2); fb.px(s[0],s[1],on?P.y4:P.t3); if (tod!=='day') fb.px(s[0],s[1]-1,P.y2); }
  if (tod==='night' && Math.sin(t*9.7)+Math.sin(t*3.3)>1.55){ var nn=CACHE.neon; for (var x=nn[0];x<nn[1];x++){ fb.px(x,nn[2],P.s3); fb.px(x,nn[2]-1,P.s2); } for (var y=nn[2]+3;y<nn[2]+40;y+=2) for (var x2=nn[0]-20;x2<nn[1]+20;x2+=2){ if (x2<0||x2>=fb.w) continue; var k=y*fb.w+x2; fb.d[k]=M.DN[fb.d[k]]; } } }

// ---------------------------------------------------------------- Geistersicht: Kreidepfeile und „ŠKOLA →“ auf der Stahltür, kleine Handabdrücke
function ghost(fb,v,S,GS){ var t=v.t, a=0.55+Math.sin(t*1.2)*0.25, D=STEEL;
  var c=a>0.6?P.x5:P.x4, p=wp('R',D.u0+4,D.v0+16);
  if (!S.shelterOpen){ M.microText(fb,'ŠKOLA',p[0]-1,p[1],c); var ar=wp('R',D.u0+4,D.v0+24); for (var i=0;i<8;i++) fb.px(ar[0]+i,ar[1]+Math.round(i*0.25),c); fb.px(ar[0]+6,ar[1]-1,c); fb.px(ar[0]+6,ar[1]+3,c);
    // Pfeile nach unten, kindlich schief
    [[D.u0+8,D.v0+34],[D.u0+14,D.v0+48]].forEach(function(q,j){ var a0=wp('R',q[0],q[1]); for (var k=0;k<7;k++) fb.px(a0[0]+(k>>2)*(j?1:0),a0[1]+k,P.x4); fb.px(a0[0]-2,a0[1]+4,P.x4); fb.px(a0[0]-1,a0[1]+5,P.x4); fb.px(a0[0]+2,a0[1]+4,P.x4); fb.px(a0[0]+1,a0[1]+5,P.x4); }); }
  else { var ar2=wp('R',D.u0-2,D.v0+20); for (var j=0;j<6;j++) fb.px(ar2[0]+j,ar2[1],P.x4); fb.px(ar2[0]+4,ar2[1]-1,P.x4); fb.px(ar2[0]+4,ar2[1]+1,P.x4); }
  // kleine Handabdrücke neben dem Klingelknopf (Kinderhände, in Augenhöhe eines Kindes)
  var bb=CACHE.bell; if (bb) [[-9,10],[-5,16],[-12,19],[-3,24]].forEach(function(h,i){ var hx=bb[0]+h[0], hy=bb[1]+h[1], cc=(Math.sin(t*0.8+i)>0)?P.x4:P.x3;
    fb.px(hx,hy,cc); fb.px(hx+1,hy,cc); fb.px(hx,hy+1,cc); fb.px(hx+1,hy+1,cc); fb.px(hx-1,hy-1,cc); fb.px(hx,hy-2,cc); fb.px(hx+1,hy-2,cc); fb.px(hx+2,hy-1,cc); fb.px(hx+2,hy+1,cc); });
  M.dust(fb,t*0.4,262,60,40,60,7,P.x3); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; if (y<102||y>140) return false; var X=f.X, Z=f.Z;
  if (X<RECT[0]+4||X>RECT[2]-4) return false;
  if (x>CHAIR.x-16 && x<CHAIR.x+18 && y<CHAIR.y+4) return false;              // Sessel
  if (!S.strollerGone && x>=PRAM.x0-2 && x<=PRAM.x1+4 && y<PRAM.base+3) return false;
  if (X>238 && Z>STEEL.u0+2) return false;                                       // Treppenschacht
  if (X>244 && Z<SEHIC.u1+3) return false;                                       // Stufen vor Šehić
  if (x<PLANT.x+8 && y<106) return false;
  return true; }
var spots={
  exit:function(){ var q=wq('L',HDOOR.u0-1,HDOOR.u1+1,HDOOR.v0-8,HDOOR.v1); return box(q); },
  mailboxes:function(){ return box(wq('L',MAIL.u0-1,MAIL.u1+1,MAIL.v0-2,MAIL.v1+2)); },
  housebook:[CASE.x0-3,CASE.y0-3,CASE.x1-CASE.x0+6,CASE.y1-CASE.y0+6],
  notices:[NOTE.x0-2,NOTE.y0-2,NOTE.x1-NOTE.x0+4,NOTE.y1-NOTE.y0+10],
  elevator:[LIFT.x0,LIFT.y0,LIFT.x1-LIFT.x0+6,FY-LIFT.y0],
  stairs:[STAIR.x0,STAIR.yTop-24,STAIR.x1-STAIR.x0,FY-STAIR.yTop+24],
  chair:[CHAIR.x-15,CHAIR.y-47,32,47],
  birdcage:[CAGE.x-9,CAGE.y-14,19,30],
  radiator:function(){ return box(wq('L',RAD.u0-1,RAD.u1+1,RAD.v0-2,RAD.v1+2)); },
  domar_door:[DOMAR.x0-2,DOMAR.y0-2,DOMAR.x1-DOMAR.x0+4,FY-DOMAR.y0+2],
  shelter_door:function(){ return box(wq('R',STEEL.u0-2,STEEL.u1+2,STEEL.v0-10,STEEL.v1)); },
  bell_button:function(){ var p=wp('R',BELL.u,BELL.v); return [p[0]-3,p[1]-3,14,15]; },
  sehic_door:function(){ return box(wq('R',SEHIC.u0-1,SEHIC.u1+1,SEHIC.v0-2,SEHIC.v1)); },
  stroller:function(S){ return (S&&S.strollerGone)?[0,0,0,0]:[PRAM.x0-1,PRAM.base-31,PRAM.x1-PRAM.x0+8,32]; },
  lightswitch:[SWITCH.x-4,SWITCH.y-5,9,11],
  plant:[PLANT.x-8,64,17,42]
};
function box(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.max(0,Math.floor(Math.min.apply(null,xs))), y0=Math.max(0,Math.floor(Math.min.apply(null,ys))); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
var stands={
 exit:[24,130,'L'], mailboxes:[80,106,'L'], housebook:[116,105,'B'], notices:[84,105,'B'], elevator:[156,105,'B'], stairs:[180,107,'B'], chair:[82,120,'L'], birdcage:[34,128,'B'],
  radiator:[80,114,'L'], domar_door:[247,106,'B'], shelter_door:[274,128,'R'], bell_button:[268,122,'R'], sehic_door:[258,109,'R'], stroller:[222,110,'L'], lightswitch:[133,105,'B'], plant:[76,106,'L']
};
function actorLut(a,S,GS,tod){ if (tod==='day') return undefined; return (tod==='night'?NEON:DAWNI).a; }
M.defineArt('haustor',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut, spots:spots, stands:stands,
  actorPos:{ dragica:[CHAIR.x,CHAIR.y,'R'], mirza:[247,106,'L'], sehic:[264,113,'L'], selma:[222,110,'L'] },
  start:[24,130,'R'], entries:{ neboder:[24,130,'R'], stan:[180,107,'F'], skloniste:[278,128,'L'] }
});
})(M);
