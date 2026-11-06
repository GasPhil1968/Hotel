/* ===== rooms/art/jhaus.js — Jasnas Haus im Westend: Treppenhaus (320 px, Innenraum) =====
   Ein Altbau-Treppenhaus: Terrazzoboden mit dunklem Fries und nassen Schneespuren von der Haustür her, unten ein Ölsockel in Grün
   mit Zierstrich, darüber helles Putzweiß, oben ein Stuckgesims. Links die hohe Haustür mit Glas, Gitter und Oberlicht, daneben
   der Lichtschalter (glimmt orange) und das Klingelbrett aus Messing; die Briefkästen mit Namensschildern (eines „VUKOVIĆ“, eines
   „HUBER“). In der Mitte die Wohnungstür von Frau Huber mit Fußmatte, Spion, Namensschild und einem Stern aus Stroh
   (S.hubOpen: die Tür steht offen, warmes Licht, ihr Flur). Rechts die Holztreppe mit gedrechselten Stäben, Handlauf und
   Antrittspfosten zum Halbstock, dort ein Fenster mit Bleiglas (geometrisch, farbig). Unter der Treppe ein Kinderwagen.
   An der linken Wand die Hausordnung im Rahmen. Die Katze sitzt auf einer Stufe (actorPos mucki).
   Geistersicht: auf der Treppe viele blasse Schritte nach oben, abends am dichtesten. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
var VP=[160,56], F=100, FY=100, XL=34, XR=292, CY=8;
var R3=M.room3(VP,F,FY);
var HDOOR={x0:44,x1:74,y0:44,tr:30};                      // Haustür mit Oberlicht
var SWITCH=[79,70], BELLS={x0:80,x1:88,y0:58,y1:80};
var MAIL={x0:96,x1:160,y0:54,y1:87};                      // Briefkästen 2 x 3
var HUB={x0:168,x1:198,y0:42};                            // Frau Hubers Tür
var ST={X0:204,sw:5.2,sh:4.2,n:10,Z:24};                  // Treppe (Raumkoordinaten)
var WIN={x0:258,x1:286,y0:14,y1:48};                      // Bleiglasfenster am Halbstock
var PRAM={X0:262,X1:286,Z0:4,Z1:18};
var LAMP={X:150,Z:6,len:13};
// ---------------------------------------------------------------- kleine Helfer
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function fwOn(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks && M.k4Fireworks(GS)); }
function stepRect(i){ var X0=ST.X0+i*ST.sw, Yt=FY-(i+1)*ST.sh; return {X0:X0,X1:X0+ST.sw,Yt:Yt,Yb:Yt+ST.sh}; }
var DIA={'Ä':'A','Ö':'O','Ü':'U'};
function sign(w,s,x,y,c){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(w,base,cx,y,c); if (DIA[ch]){ w.px(cx,y-2,c); w.px(cx+2,y-2,c); } cx+=M.microWidth(base)+1; }); return cx; }
// Bildschirmpunkt -> Fläche des Raumkastens
function hit(x,y){ var k, X, Y;
  if (x>=XL && x<=XR && y>=CY && y<=FY) return {s:'back',X:x,Y:y,Z:0};
  if (y>FY){ k=(y-VP[1])/(FY-VP[1]); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'floor',X:X,Y:FY,Z:(k-1)*F}; }
  if (y<CY){ k=(VP[1]-y)/(VP[1]-CY); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'ceil',X:X,Y:CY,Z:(k-1)*F}; }
  if (x<XL){ k=(x-VP[0])/(XL-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'left',X:XL,Y:Y,Z:(k-1)*F}; }
  if (x>XR){ k=(x-VP[0])/(XR-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'right',X:XR,Y:Y,Z:(k-1)*F}; }
  return null; }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.4+L*0.24+10, g*0.4+L*0.24+12, b*0.42+L*0.24+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2));
  return LV[tod]=a; }
var LP=null; function lampPos(){ if (LP) return LP; var top=R3.p(LAMP.X,CY,LAMP.Z); LP=[rd(top[0]),rd(top[1]),rd(top[1])+LAMP.len]; return LP; }
var HUBLIT=false;
function lightAt(x,y){ var lp=lampPos(), dx=(x-lp[0])/170, dy=(y-lp[2]-40)/100, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,0.9)*0.92:0; var g=Math.hypot((x-lp[0])/18,(y-lp[2])/14); if (g<1) a=Math.max(a,1-g*0.3);
  if (HUBLIT){ var hx=(x-183)/40, hy=(y-96)/34, hd=hx*hx+hy*hy; if (hd<1) a=Math.max(a,(1-hd)*0.8); } return a>1?1:a; }
function shadeTOD(b,ox,oy,tod,mask){ var L=levels(tod), n=L.length; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var f=lightAt(X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Wände, Boden, Decke
function wallTex(u,v,x,y,sd){ var c;
  if (v>FY-3) c=(v>FY-1.5)?P.w0:P.w2;                                        // Fußleiste
  else if (v>70){ c=ra(R('g1 g2 g3'),0.6+(fbm(u*0.04,v*0.06,sd)-0.5)*0.3,x,y); if (Math.abs(v-71.5)<0.8) c=P.y2; if (v<72.5 && v>70.5) c=P.g1; }   // Ölsockel mit Zierstrich
  else if (v<CY+6){ var q=v-CY; c=(q<1.5)?P.s5:(q<3?P.s3:(q<4.5?P.s6:P.s4)); if (q>=3 && q<4.5 && (Math.floor(u/3)%2===0)) c=P.s5; }   // Stuckgesims
  else { c=ra(R('s3 s4 s5'),0.72+(fbm(u*0.05,v*0.06,sd+3)-0.5)*0.3,x,y); if (v>60 && fbm(u*0.12,v*0.2,sd+5)>0.7) c=P.s3; }
  return c; }
function floorTex(X,Z,x,y){ var e=Math.min(X-XL,XR-X,Z+40), c;
  if (e<7){ c=(e<1.2)?P.k2:((Math.floor((X+Z)/4)%2)?P.r1:P.w1); return c; }                 // dunkler Fries
  var h=hash(Math.floor(X*1.3),Math.floor(Z*1.1)); c=(fbm(X*0.02,Z*0.03,7)>0.55 && bayer(x,y)<0.5)?P.s4:P.s3; if (h<0.07) c=P.s2; else if (h>0.95) c=P.s5; else if (h>0.935) c=P.t2; else if (h>0.925) c=P.g2;
  return c; }
function surf(h,x,y){ if (h.s==='back') return wallTex(h.X,h.Y,x,y,0); if (h.s==='left') return M.DN[wallTex(h.Z*1.5,h.Y,x,y,9)]; if (h.s==='right') return M.DN[wallTex(h.Z*1.5+400,h.Y,x,y,13)];
  if (h.s==='floor') return floorTex(h.X,h.Z,x,y); if (h.s==='ceil'){ var c=(Math.floor(h.Z)%30<1)?P.s3:P.s5; return c; } return P.k0; }

// ---------------------------------------------------------------- Haustür (Glas, Gitter, Oberlicht), Schalter, Klingelbrett, Briefkästen, Hausordnung
function outside(x,y,tod,we){ var night=tod!=='day', c;
  if (night) c=(y<HDOOR.y0+12)?P.n1:P.n0; else c=(we==='fog')?P.m4:((we==='thaw')?P.m3:((y<HDOOR.y0+10)?P.b4:P.s5));
  if (!night && y>HDOOR.y0+22) c=(we==='thaw')?P.m2:P.s6;                     // Schnee draußen auf dem Gehweg
  if (night && y>HDOOR.y0+22) c=P.n2;
  return c; }
var GLASS=[];
function frontDoor(b,tod,we){ var d=HDOOR, x, y, w=d.x1-d.x0, h=FY-d.y0, wood=R('w0 w1 w2 w3 w4');
  b.rect(d.x0-3,d.tr-3,w+6,FY-d.tr+3,P.w1); b.hl(d.x0-3,d.x1+2,d.tr-3,P.w3);
  // Oberlicht (Halbkreis mit Sprossen)
  for (y=d.tr;y<d.y0-2;y++) for (x=d.x0;x<d.x1;x++){ var u=(x-(d.x0+d.x1)/2)/(w/2), vv=(d.y0-2-y)/(d.y0-2-d.tr); if (u*u+vv*vv>1) continue; var c=outside(x,d.y0,tod,we); if (Math.abs(Math.atan2(vv,u)*4/Math.PI%1)<0.12) c=P.w1; b.px(x,y,c); GLASS.push([x,y]); }
  b.hl(d.x0,d.x1-1,d.y0-2,P.w1); b.hl(d.x0,d.x1-1,d.y0-1,P.w3);
  // zwei Flügel mit Glas oben, Kassetten unten
  [d.x0,d.x0+w/2].forEach(function(fx,fi){ fx=rd(fx); var fw=rd(w/2); b.rect(fx,d.y0,fw,h,wood[2]); b.vl(fx,d.y0,FY-1,wood[3]); b.vl(fx+fw-1,d.y0,FY-1,wood[0]);
    for (y=d.y0+3;y<d.y0+30;y++) for (x=fx+3;x<fx+fw-3;x++){ var c=outside(x,y,tod,we); if (((x-fx)*0.8+y)%13<1.4 && tod==='day') c=M.UP[c]; b.px(x,y,c); GLASS.push([x,y]); }
    for (y=d.y0+3;y<d.y0+30;y++) for (x=fx+3;x<fx+fw-3;x++){ if ((x+y)%6===0 || (x-y+60)%6===0) b.px(x,y,P.k1); }   // schmiedeeisernes Gitter
    b.rect(fx+3,d.y0+34,fw-6,h-38,wood[1]); b.hl(fx+3,fx+fw-4,d.y0+34,wood[0]); b.vl(fx+fw-4,d.y0+34,FY-5,wood[3]); });
  b.rect(d.x0+w/2-3,d.y0+32,2,3,P.y3); b.rect(d.x0+w/2+1,d.y0+32,2,3,P.y3); b.px(d.x0+w/2-3,d.y0+32,P.y5);
  // Fußabstreifer
  var m0=rp(R3.p(d.x0-2,FY,4)), m1=rp(R3.p(d.x1+2,FY,16)); for (y=m0[1];y<m1[1];y++) for (x=m0[0];x<m1[0]+1;x++) b.px(x,y,((x+y)&1)?P.e1:P.e2); }
function bells(b){ var q=BELLS, x, y; b.rect(q.x0,q.y0,q.x1-q.x0,q.y1-q.y0,P.y2); b.hl(q.x0,q.x1-1,q.y0,P.y4); b.vl(q.x1-1,q.y0,q.y1-1,P.y1);
  for (var i=0;i<6;i++){ var yy=q.y0+3+i*3; b.px(q.x0+2,yy,P.k1); b.hl(q.x0+4,q.x1-3,yy,P.s5); }
  b.rect(q.x0+2,q.y1-4,4,2,P.w1); }
function lightSwitch(b){ b.rect(SWITCH[0]-1,SWITCH[1]-1,4,5,P.s5); b.rect(SWITCH[0],SWITCH[1],2,3,P.s6); b.px(SWITCH[0],SWITCH[1]+1,P.t4); }
function mailboxes(b){ var m=MAIL, x, y, cw=32, rh=11, names=['','HUBER','','VUKOVIĆ','',''];
  b.rect(m.x0-1,m.y0-1,m.x1-m.x0+2,m.y1-m.y0+2,P.m1);
  for (var r=0;r<3;r++) for (var c=0;c<2;c++){ var bx=m.x0+c*cw, by=m.y0+r*rh;
    b.rect(bx,by,cw-1,rh-1,P.g2); b.hl(bx,bx+cw-2,by,P.g3); b.vl(bx+cw-2,by,by+rh-2,P.g1);
    b.rect(bx+1,by+1,cw-3,7,P.s5); b.hl(bx+1,bx+cw-3,by+8,P.g1);
    var nm=names[r*2+c]; if (nm){ M.microText(b,nm,bx+2,by+2,P.k1); } else { b.hl(bx+3,bx+14+Math.floor(hash(r,c)*8),by+4,P.m2); }
    b.hl(bx+6,bx+cw-8,by+rh-3,P.k1); b.px(bx+cw-5,by+rh-4,P.y3); }
  // Werbung, die aus einem Schlitz hängt
  b.rect(MAIL.x0+38,MAIL.y0+rh*2+6,9,5,P.r3); b.hl(MAIL.x0+38,MAIL.x0+46,MAIL.y0+rh*2+6,P.y4); }
function houseRules(b){ var q=[rp(R3.p(XL,40,30)),rp(R3.p(XL,40,48)),rp(R3.p(XL,62,48)),rp(R3.p(XL,62,30))]; b.poly(q,P.w1);
  var q2=[rp(R3.p(XL,42,32)),rp(R3.p(XL,42,46)),rp(R3.p(XL,60,46)),rp(R3.p(XL,60,32))]; b.poly(q2,P.s6);
  for (var Y=44;Y<59;Y+=2){ var a=rp(R3.p(XL,Y,34)), c=rp(R3.p(XL,Y,44)); b.line(a[0],a[1],c[0],c[1],Y===44?P.k1:P.m2); } }

// ---------------------------------------------------------------- Frau Hubers Tür
function huberDoor(b,S,tod){ var d=HUB, w=d.x1-d.x0, x, y;
  if (S.hubOpen){ b.rect(d.x0-2,d.y0-2,w+4,FY-d.y0+2,P.w1); b.hl(d.x0-2,d.x1+1,d.y0-2,P.w3);
    for (y=d.y0;y<FY;y++) for (x=d.x0;x<d.x1;x++){ var c=(y<d.y0+36)?(((x>>2)+(y>>2))%2?P.y1:P.w2):P.w1; if (y>FY-12) c=((x+y)%4<2)?P.r1:P.r2; b.px(x,y,c); }   // Tapete, Läufer
    b.rect(d.x0+14,d.y0+12,8,10,P.w3); b.rect(d.x0+15,d.y0+13,6,8,P.a3); b.rect(d.x0+3,d.y0+20,4,24,P.g2); b.rect(d.x0+2,d.y0+18,6,3,P.r2);   // Bild, Garderobe
    b.rect(d.x0,d.y0,4,FY-d.y0,P.w3); b.vl(d.x0+3,d.y0,FY-1,P.w1); b.rect(d.x0-6,d.y0,6,FY-d.y0,P.w2); b.vl(d.x0-6,d.y0,FY-1,P.w3); }   // aufgeschlagener Flügel
  else { M.prop.door(b,d.x0,d.y0,w,FY-d.y0,{ramp:R('w1 w2 w3 w4 w5'),frame:R('w0 w1 w2 w3'),knob:'L'});
    b.px(d.x0+w/2,d.y0+16,P.k1); b.px(d.x0+w/2,d.y0+15,P.m3); }                                                              // Spion
  if (!S.hubOpen){ var nx=rd(d.x0+w/2-11); b.rect(nx,d.y0+21,22,7,P.y2); b.hl(nx,nx+21,d.y0+21,P.y4); b.hl(nx,nx+21,d.y0+27,P.y1); M.microText(b,'HUBER',nx+2,d.y0+22,P.k1); }   // Namensschild aus Messing
  b.rect(d.x0-6,d.y0+30,3,4,P.s5); b.px(d.x0-5,d.y0+31,P.y3);                                                             // Klingelknopf
  // Stern aus Stroh an der Tür (acht Spitzen, rotes Band)
  var sx=rd(d.x0+w/2), sy=d.y0+8; if (!S.hubOpen){ for (var a=0;a<8;a++){ var an=a/8*Math.PI*2; for (var r=1;r<=4;r++) b.px(sx+rd(Math.cos(an)*r),sy+rd(Math.sin(an)*r),r===4?P.e3:P.y4); } b.px(sx,sy,P.r3); b.vl(sx,d.y0+1,sy-5,P.r3); }
  // Fußmatte
  var m0=rp(R3.p(d.x0+1,FY,3)), m1=rp(R3.p(d.x1-1,FY,13)); for (y=m0[1];y<m1[1];y++) for (x=m0[0];x<m1[0];x++) b.px(x,y,(y===m0[1])?P.w2:(((x>>1)+y)&1?P.e2:P.e1)); }

// ---------------------------------------------------------------- Bleiglasfenster am Halbstock
var LEAD=[];
function leadWindow(b,tod,we){ var w=WIN, x, y; LEAD=[];
  b.rect(w.x0-4,w.y0-4,w.x1-w.x0+8,w.y1-w.y0+8,P.s5); b.rect(w.x0-2,w.y0-2,w.x1-w.x0+4,w.y1-w.y0+4,P.w2);
  var cols=[P.y3,P.g3,P.b2,P.r2,P.a3,P.y4];
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var u=x-w.x0, v=y-w.y0, mw=w.x1-w.x0, cx=mw/2, c;
    var dia=Math.abs(u-cx)+Math.abs((v-(w.y1-w.y0)/2)*0.8);
    if (u<3||u>=mw-3||v<3||v>=w.y1-w.y0-3) c=(Math.floor((u+v)/3)%2)?P.y3:P.a4;          // Randfries
    else if (dia<6) c=P.y4; else if (dia<11) c=P.r2; else if (dia<15) c=P.g3; else c=(tod==='day')?(we==='fog'?P.m4:P.b4):P.n1;
    if (Math.abs(dia-6)<0.6 || Math.abs(dia-11)<0.6 || Math.abs(dia-15)<0.6 || u===3 || u===mw-4 || v===3 || v===w.y1-w.y0-4 || Math.abs(u-cx)<0.6) c=P.k1;   // Bleiruten
    b.px(x,y,c); LEAD.push([x,y,c]); }
  b.rect(w.x0-5,w.y1+2,w.x1-w.x0+10,3,P.s4); b.hl(w.x0-5,w.x1+4,w.y1+2,P.s6); }

// ---------------------------------------------------------------- Treppe mit Geländer (Stufen im Bild, Wange und Stäbe als Ebene), Kinderwagen
function stairs(b){ for (var i=0;i<ST.n;i++){ var s=stepRect(i);
    R3.box(b,s.X0,s.X1,s.Yt,s.Yb,0,ST.Z,{top:function(xx,yy){ return ((xx+yy)%9===0)?P.w4:P.w5; },left:function(xx,yy){ return (yy%5===0)?P.w1:P.w2; }});
    var e0=R3.p(s.X0,s.Yt,0), e1=R3.p(s.X0,s.Yt,ST.Z); b.line(rd(e0[0]),rd(e0[1]),rd(e1[0]),rd(e1[1]),P.w3); }
  // Halbstock (Podest) mit Unterseite
  var Yl=FY-ST.n*ST.sh, a=rp(R3.p(ST.X0+ST.n*ST.sw,Yl,0)), c2=rp(R3.p(XR,Yl,ST.Z));
  b.rect(a[0],a[1],c2[0]-a[0]+8,3,P.w3); b.hl(a[0],c2[0]+8,a[1],P.w4);
  }
function pram(b){ var p0=rp(R3.p(PRAM.X0,FY,PRAM.Z1)), p1=rp(R3.p(PRAM.X1,FY,PRAM.Z1)), x, y, cx=rd((p0[0]+p1[0])/2), by=p0[1]-3;
  // Fahrgestell, Räder
  b.line(p0[0]+3,by-8,p0[0]+2,by,P.m1); b.line(p1[0]-3,by-8,p1[0]-2,by,P.m1); b.hl(p0[0]+2,p1[0]-2,by-2,P.m2);
  [[p0[0]+2,by],[p1[0]-3,by]].forEach(function(q){ b.ellipse(q[0],q[1],2.6,2.6,P.k1); b.px(q[0],q[1],P.m3); });
  // Wanne und Verdeck
  b.ellipse(cx,by-12,(p1[0]-p0[0])/2,5,function(xx,yy){ return yy<by-12?P.c2:P.c1; }); b.hl(p0[0]+1,p1[0]-1,by-12,P.c3);
  b.poly([[p0[0]+1,by-12],[p0[0]+2,by-22],[p0[0]+12,by-23],[p0[0]+14,by-12]],P.c1); for (var k=0;k<3;k++) b.line(p0[0]+2+k*4,by-22+k,p0[0]+4+k*4,by-12,P.c0);
  b.line(p1[0]-1,by-13,p1[0]+4,by-22,P.m1); b.hl(p1[0]+3,p1[0]+6,by-22,P.k1); }

// ---------------------------------------------------------------- Bild
var BASE=null, WE='snowlie';
function inGlass(x,y){ return x>=HDOOR.x0 && x<HDOOR.x1 && y>=HDOOR.tr && y<HDOOR.y0+30; }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), we=weaOf(GS), dark=tod!=='day', x, y; WE=we; GLASS=[]; HUBLIT=!!S.hubOpen;
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=hit(x,y); if (h) b.px(x,y,surf(h,x,y)); }
  b.line(XL,CY,XL,FY,P.s2); b.line(XR,CY,XR,FY,P.s2);
  houseRules(b); frontDoor(b,tod,we); lightSwitch(b); bells(b); mailboxes(b); huberDoor(b,S,tod);
  leadWindow(b,tod,we); stairs(b); pram(b);
  // nasse Schneespuren von der Haustür zur Treppe (bei Tauwetter und Schneefall mehr)
  var nwet=(we==='thaw'||we==='snow')?34:18; for (var i=0;i<nwet;i++){ var t=i/nwet, X=lerp(HDOOR.x0+14,ST.X0,t)+Math.sin(i*1.7)*6, Z=8+Math.sin(t*3.1)*10+(i%2)*4, p=rp(R3.p(X,FY,Z)); if (b.get(p[0],p[1])===T) continue; b.px(p[0],p[1],P.m2); b.px(p[0]+1,p[1],P.m3); if (hash(i,2)<0.5) b.px(p[0],p[1]+1,P.s5); }
  // Deckenlampe: Kugel am Pendel
  var lp=lampPos(); b.vl(lp[0],lp[1],lp[2]-3,P.k1); b.ellipse(lp[0]+0.5,lp[2]+1,3.4,3.2,P.s5); b.px(lp[0]-1,lp[2],P.s6); b.hl(lp[0]-2,lp[0]+2,lp[2]+4,P.s3);
  var notGlass=function(xx,yy){ return !inGlass(xx,yy) && !(xx>=WIN.x0&&xx<WIN.x1&&yy>=WIN.y0&&yy<WIN.y1); };
  if (!dark){ M.light(b,M.lf.sum(M.lf.pool(HDOOR.x0+15,FY+18,90,30,0.55),M.lf.pool((WIN.x0+WIN.x1)/2,60,70,46,0.45),M.lf.vignette(W,H,2.2),M.lf.k(we==='thaw'||we==='fog'?-0.4:-0.25)),0,0,notGlass);
    // farbige Lichtflecken des Bleiglases auf den Stufen
    for (var k=0;k<40;k++){ var lx=230+Math.floor(hash(k,5)*40), ly=70+Math.floor(hash(k,6)*30), src=LEAD[Math.floor(hash(k,7)*LEAD.length)]; if (!src || src[2]===P.k1 || we==='fog' || we==='thaw') continue; var c=b.get(lx,ly); if (c===P.w4||c===P.w3) b.px(lx,ly,src[2]===P.b4?P.w5:M.UP[src[2]]); }
    BASE=b.clone(); return b; }
  M.light(b,M.lf.vignette(W,H,1.2),0,0,notGlass);
  BASE=b.clone(); shadeTOD(b,0,0,tod,notGlass);
  // Lampe leuchtet, Lichtschalter glimmt
  b.ellipse(lp[0]+0.5,lp[2]+1,3.4,3.2,P.y5); b.px(lp[0],lp[2],P.l1); b.px(SWITCH[0],SWITCH[1]+1,P.t5);
  GLASS.forEach(function(q){ if (q[1]>HDOOR.y0+18 && hash(q[0],q[1])<0.03) b.px(q[0],q[1],P.y2); });
  return b; }

// ---------------------------------------------------------------- Ebene: Wange, gedrechselte Stäbe, Handlauf, Antrittspfosten (Katze und Treppe dahinter)
var BAL=[];
function rail(S,GS,tod){ var L=M.layer(196,20,124,96,112), wr=M.lw(L), i, X, Zf=ST.Z+1;
  // Wange (Brett entlang der Stufenvorderkanten)
  for (X=ST.X0-2;X<ST.X0+ST.n*ST.sw+1;X+=0.25){ var j=cl(Math.floor((X-ST.X0)/ST.sw),0,ST.n-1), yt=FY-(X-ST.X0)/ST.sw*ST.sh, p0=R3.p(X,yt-1,Zf), p1=R3.p(X,yt+5,Zf);
    for (var y=rd(p0[1]);y<=rd(p1[1]);y++) wr.px(rd(p0[0]),y,y===rd(p0[1])?P.w4:(y>rd(p1[1])-1?P.w0:P.w2)); }
  // Stäbe auf jeder Stufe, gedrechselt (dicker in der Mitte)
  BAL=[]; for (i=0;i<ST.n;i++){ var s=stepRect(i), Xm=s.X0+ST.sw*0.5, base=R3.p(Xm,s.Yt,Zf), top=R3.p(Xm,s.Yt-15,Zf), bx=rd(base[0]);
    for (var yy=rd(top[1]);yy<rd(base[1]);yy++){ var q=(yy-top[1])/(base[1]-top[1]), thick=(q>0.3&&q<0.42)||(q>0.62&&q<0.78); wr.px(bx,yy,P.w2); if (thick){ wr.px(bx-1,yy,P.w3); wr.px(bx+1,yy,P.w1); } }
    BAL.push(bx); }
  // Stäbe am Podest
  var Yl=FY-ST.n*ST.sh; for (X=ST.X0+ST.n*ST.sw+4;X<XR;X+=5){ var b0=R3.p(X,Yl,Zf), t0=R3.p(X,Yl-15,Zf); wr.vl(rd(b0[0]),rd(t0[1]),rd(b0[1]),P.w2); }
  // Handlauf
  var h0=R3.p(ST.X0-2,FY-16,Zf), h1=R3.p(ST.X0+ST.n*ST.sw,Yl-16,Zf), h2=R3.p(XR,Yl-16,Zf);
  wr.line(rd(h0[0]),rd(h0[1]),rd(h1[0]),rd(h1[1]),P.w1); wr.line(rd(h0[0]),rd(h0[1])-1,rd(h1[0]),rd(h1[1])-1,P.w4); wr.line(rd(h1[0]),rd(h1[1]),rd(h2[0]),rd(h2[1]),P.w1); wr.line(rd(h1[0]),rd(h1[1])-1,rd(h2[0]),rd(h2[1])-1,P.w4);
  // Antrittspfosten mit Kugel
  var n0=R3.p(ST.X0-2,FY,Zf), n1=R3.p(ST.X0-2,FY-19,Zf), nx=rd(n0[0]); wr.rect(nx-2,rd(n1[1]),5,rd(n0[1])-rd(n1[1]),P.w2); wr.vl(nx-2,rd(n1[1]),rd(n0[1])-1,P.w4); wr.vl(nx+2,rd(n1[1]),rd(n0[1])-1,P.w0); wr.ellipse(nx+0.5,rd(n1[1])-2,2.6,2.6,P.w3); wr.px(nx-1,rd(n1[1])-3,P.w5);
  if (tod!=='day') shadeTOD(L,L.ox,L.oy,tod);
  else M.light(L,M.lf.sum(M.lf.vignette(W,H,2.2),M.lf.k(-0.2)),L.ox,L.oy);
  return L; }
function layers(S,GS,tod){ return [rail(S,GS,tod)]; }

// ---------------------------------------------------------------- jedes Bild: Lichtschalter glimmt, Flocken vor dem Glas, Feuerwerk färbt das Bleiglas
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, we=WE;
  if (tod!=='day' || Math.sin(t*0.5)>-2) fb.px(SWITCH[0],SWITCH[1]+1,(Math.sin(t*1.3)>0)?P.t5:P.t4);
  if (we==='snow') M.snow(fb,t,{n:24,mask:function(x,y){ return inGlass(x,y) && BASE && GLASS.length && (y<HDOOR.y0+22); },col:P.s6,col2:P.s5,wind:5});
  if (fwOn(S,GS)){ var ph=t%2.7, k=Math.floor(t/2.7); if (ph<0.35){ var cols=[P.y4,P.r3,P.b3,P.g4,P.d5], fc=cols[Math.floor(hash(k,3)*cols.length)];
      for (var y=WIN.y0+3;y<WIN.y1-3;y++) for (var x=WIN.x0+3;x<WIN.x1-3;x++){ var c=fb.d[y*320+x]; if (c===P.n1||c===P.n0) { if (bayer(x,y)<0.6-ph) fb.d[y*320+x]=fc; } }
      for (var q=0;q<GLASS.length;q+=3){ var g=GLASS[q]; if (bayer(g[0],g[1])<0.3-ph*0.6) fb.px(g[0],g[1],M.UP[fc]); } } } }
// Geistersicht: Schritte nach oben, abends am dichtesten
function ghost(fb,v,S,GS){ var t=v.t, tod=v.tod, dense=tod!=='day', n=dense?3:2;
  for (var i=0;i<ST.n;i++){ var s=stepRect(i);
    for (var k=0;k<n;k++){ var Z=6+k*6+((i*7+k*3)%5), X=s.X0+1.5+((i+k)%2)*1.6, p=R3.p(X,s.Yt,Z), x=rd(p[0]), y=rd(p[1]); var a=(dense?0.75:0.45)+0.2*Math.sin(t*0.8+i*0.7+k);
      if (bayer(x,y+Math.floor(t*2))>a) continue; var c=(k===0&&dense)?P.x5:(hash(i,k)<0.3?P.v4:P.x4); fb.px(x,y,c); fb.px(x+1,y,c); fb.px(x,y-1,P.x3); } }
  // ein schwacher Pfad von der Haustür zur Treppe
  for (var j=0;j<24;j++){ var tt=j/24, X2=lerp(HDOOR.x0+14,ST.X0,tt), Z2=10+Math.sin(tt*3)*6, q=R3.p(X2,FY,Z2); if (bayer(rd(q[0]),rd(q[1])+Math.floor(t*2))<(dense?0.5:0.3)) fb.px(rd(q[0]),rd(q[1]),P.x3); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>138||x<10||x>310) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<XL+2||f.X>XR-2) return false; return true; }
var SR=(function(){ var a=R3.p(ST.X0-4,FY-ST.n*ST.sh-18,0), c=R3.p(XR,FY,ST.Z+2); return [rd(a[0]),rd(a[1]),rd(c[0])-rd(a[0]),rd(c[1])-rd(a[1])]; })();
var PR=(function(){ var a=R3.p(PRAM.X0,FY-24,PRAM.Z0), c=R3.p(PRAM.X1+6,FY,PRAM.Z1); return [rd(a[0])-1,rd(a[1]),rd(c[0])-rd(a[0])+4,rd(c[1])-rd(a[1])+2]; })();
var CATP=(function(){ var s=stepRect(4), p=R3.p(s.X0+ST.sw*0.6,s.Yt,11); return [rd(p[0]),rd(p[1])]; })();
M.defineArt('jhaus',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; var L=levels(tod); return L[Math.max(0,Math.min(L.length-1,Math.round(lightAt(a.x,a.y-22)*(L.length-1))))].a; },
  spots:{
    exit:[HDOOR.x0-4,HDOOR.tr-4,HDOOR.x1-HDOOR.x0+8,FY-HDOOR.tr+8],
    up:[SR[0]+18,SR[1],SR[2]-18,SR[3]-24],
    huber_door:[HUB.x0-3,HUB.y0-3,HUB.x1-HUB.x0+6,FY-HUB.y0+6],
    mailboxes:[MAIL.x0-2,MAIL.y0-2,MAIL.x1-MAIL.x0+4,MAIL.y1-MAIL.y0+4],
    bells:[BELLS.x0-3,BELLS.y0-2,BELLS.x1-BELLS.x0+5,BELLS.y1-BELLS.y0+4],
    window:[WIN.x0-5,WIN.y0-5,WIN.x1-WIN.x0+10,WIN.y1-WIN.y0+11],
    pram:PR,
    cat:[CATP[0]-8,CATP[1]-16,16,18]
  },
  stands:{ exit:[58,116,'B'], up:[216,117,'R'], huber_door:[183,115,'B'], mailboxes:[126,116,'B'], bells:[86,116,'B'], window:[262,120,'B'], pram:[280,122,'B'], cat:[226,117,'B'] },
  actorPos:{ huber:[183,104,'L'], mucki:[CATP[0],CATP[1],'F'] },
  start:[56,118,'R'], entries:{ map:[56,118,'R'], jwohnung:[214,118,'L'] }
});
})(M);
