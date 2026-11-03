/* ===== rooms/art/pansion.js — Zimmer in Hajras Pension in Kovači: ein Raum in einem alten bosnischen Haus.
   Weiß gekalkte Wände mit einer Schablonenborte unter der Holzdecke (Bretter mit Leisten). In der Mitte das Fenster mit tiefer
   Laibung, weißem Holzrahmen und Eisengitter, dahinter der Blick über die Stadt im Tal: die Dächer von Kovači mit einem
   nahen Minarett, Kuppeln, Minarette und die Sahat-kula der Baščaršija, die Stadt im Nebel, dahinter der Trebević; nachts
   gelbe Lichter im Dunst. Links vorn der grüne Kachelofen mit Rohr, hinten links die Tür, daneben das Tischchen mit dem alten
   Wählscheibentelefon, darunter die Steckdose (S.charging: Ladekabel mit grünem Lämpchen), darüber gerahmte Fotos (zwei Frauen
   vor einem Haus, 80er Jahre). Rechts das Bett mit Kelim, darüber das Wandbord mit Hajras Kaffeegeschirr, vorn rechts der
   Kleiderschrank. Auf dem Teppich ein rundes Tischchen mit Spitzendecke (S.coffee: Kupfertablett mit Džezva und zwei Tassen).
   Die Katze Mačak schläft auf dem Bett oder sitzt auf dem Fensterbrett (S.catAt: 'bed' | 'window'). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, VP=[166,54], RECT=[60,14,262,98], F=90, FY=98;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WIN={x:128,y:22,w:76,h:50};                        // Fensterglas in der Rückwand
var STOVE={X0:60,X1:80,Y0:52,Z0:10,Z1:30};              // Kachelofen an der linken Wand
var DOOR={x:70,y:40,w:23,h:58};                        // Tür in der Rückwand
var PT={X0:106,X1:124,Y0:79,Z0:2,Z1:12};                // Telefontischchen
var BED={X0:206,X1:262,Y0:80,Z0:2,Z1:32};               // Bett
var WARD={X0:240,X1:262,Y0:28,Z0:46,Z1:84};             // Kleiderschrank vorn rechts
var TBL={cx:204,top:100,base:124,rx:13};               // rundes Tischchen mit Spitzendecke (Bildschirm)
var LAMP=[166,8];                                      // Deckenlampe (Schirm unter der Decke)
var COP=R('t0 t1 t2 t3 t4 t5');
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function inWin(x,y){ return x>=WIN.x&&x<WIN.x+WIN.w&&y>=WIN.y&&y<WIN.y+WIN.h; }
function catOf(S){ return (S && S.catAt==='window')?'window':'bed'; }
function curS(){ return (M.GS&&M.GS.rooms&&M.GS.rooms.pansion)||{}; }
// Rechteck/Standpunkt, das je nach Zustand nachgelesen wird (bleibt für die Logik ein gewöhnliches Array)
function live(n,fn){ var a=[]; for (var i=0;i<n;i++) (function(i){ Object.defineProperty(a,i,{get:function(){ return fn()[i]; },enumerable:true}); })(i); return a; }
var STOVE_DOOR=(function(){ var p=R3.p(STOVE.X1,86,STOVE.Z0+6), q=R3.p(STOVE.X1,94,STOVE.Z0+13); return [rnd(q[0]),rnd(p[1]),rnd(p[0]-q[0]),rnd(q[1]-p[1])]; })();
var PTF=rp(R3.p(PT.X0,PT.Y0,PT.Z1)), PTW=rnd(R3.p(PT.X1,PT.Y0,PT.Z1)[0])-PTF[0], SOCKET=[PTF[0]+PTW-6,PTF[1]+9];
var SILL=rnd(R3.p(0,74,4)[1]);                         // Oberkante der Fensterbank (Katze)
var CAT_BED=[224,82], CAT_WIN=[WIN.x+WIN.w-17,SILL];

// ---------------------------------------------------------------- Licht am Abend und in der Nacht: weiche Stufen zwischen Dunkel und Lampe
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.17+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
function lightAt(x,y,tod){ var dx=(x-LAMP[0])/165, dy=(y-74)/92, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,0.9)*0.92:0;
  var g=Math.hypot((x-LAMP[0])/26,(y-LAMP[1]-3)/14); if (g<1) a=Math.max(a,1-g*0.3);
  var sx=STOVE_DOOR[0]+3, sy=STOVE_DOOR[1]+12, s=Math.hypot((x-sx)/34,(y-sy)/16); if (s<1) a=Math.max(a,(1-s)*0.55);
  return a>1?1:a; }
function shadeTOD(b,ox,oy,tod,mask){ var L=levels(tod), n=L.length;
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var f=lightAt(X,Y,tod)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Blick über die Stadt im Tal (nach Südwesten: rechts ist Westen)
var CHIMNEY=[], LIGHTS=[];
function cityView(tod,weather){ var b=new M.Buf(W,144,P.k0), x0=WIN.x, y0=WIN.y, w=WIN.w, h=WIN.h, x, y, i, night=tod==='night', dusk=tod==='dusk'||tod==='dawn', fog=weather==='fog', rain=weather==='rain', snow=weather==='snow', clear=!fog&&!rain&&!snow;
  CHIMNEY=[]; LIGHTS=[];
  function px(xx,yy,c){ if (xx>=x0&&xx<x0+w&&yy>=y0&&yy<y0+h) b.px(xx,yy,c); }
  function spire(xx,base,hh,col,cap){ for (var yy=base-hh;yy<base;yy++){ px(xx,yy,col); if (yy>base-hh+3) px(xx+1,yy,M.DN[col]); } px(xx,base-hh-1,cap); px(xx,base-hh-2,cap); px(xx-1,base-hh+3,col); px(xx+2,base-hh+3,M.DN[col]); }   // schlankes Minarett in der Ferne
  // Himmel
  if (tod==='day' && clear){ for (y=y0;y<y0+30;y++) for (x=x0;x<x0+w;x++) b.px(x,y,M.rampAt(R('b2 b3 b4 b5 s6'),0.12+(y-y0)/30*0.88,x,y)); }
  else M.scn.sky(b,x0,y0,w,30,tod,clear?'calm':weather,41);
  if (night && clear) for (i=0;i<18;i++) b.px(x0+Math.floor(hash(i,3)*w),y0+Math.floor(hash(i,4)*12),hash(i,5)<0.3?P.n5:P.n4);
  // Trebević: langer, bewaldeter Rücken (links höher), Schnee auf dem Kamm bei klarem Wetter
  for (x=x0;x<x0+w;x++){ var u=(x-x0)/w, ry=y0+10+Math.round(-Math.sin(u*2.3+0.4)*2.5+Math.sin(u*8.1)*0.9+u*3);
    for (y=ry;y<y0+30;y++){ var c=M.rampAt(R('g0 g1 m1 g2'),0.5+(fbm(x*0.35,y*0.5)-0.5)*0.7-(y-ry)*0.02,x,y); if ((snow||(clear&&tod==='day')) && y<ry+2+((x*7)%3===0?1:0)) c=(hash(x,y)<0.7)?P.s6:P.s4; b.px(x,y,c); } }
  // gegenüberliegender Hang mit verstreuten Häusern, dann die Stadt im Tal
  for (x=x0;x<x0+w;x++){ var hy2=y0+18+Math.round(Math.sin((x-x0)*0.07+1)*1.5); for (y=hy2;y<y0+31;y++) b.px(x,y,M.rampAt(R('e1 e2 g2'),0.5+(hash(x>>1,y)-0.5)*0.5,x,y)); }
  var r=M.rng(7); for (i=0;i<26;i++){ var hx=x0+Math.floor(r()*w), hy=y0+18+Math.floor(r()*6); px(hx,hy,P.s5); px(hx+1,hy,P.s4); px(hx,hy-1,P.t2); }
  for (y=y0+24;y<y0+32;y++) for (x=x0;x<x0+w;x++){ var col=Math.floor((x-x0)/3), top=y0+24+Math.floor(hash(col,3)*3), c2; if (y<top) continue;
    c2=(y===top)?(hash(col,5)<0.5?P.t1:P.m1):(((x-x0)%3===0)?P.s3:(hash(col,7)<0.3?P.e4:P.s5)); if (y>top && ((y+col)%3===0) && ((x-x0)%3===1)) c2=P.s2; b.px(x,y,c2); }   // dichte Blöcke der Stadt
  var kt=x0+36; spire(kt,y0+28,6,P.s4,P.m1); spire(kt+4,y0+28,6,P.s4,P.m1); b.rect(kt-1,y0+25,7,3,P.s4); b.px(kt+2,y0+24,P.s3);                         // Kathedrale
  for (i=0;i<4;i++){ var tx=x0+w-17+i*4, th=8+((i*5)%4); b.rect(tx,y0+30-th,3,th,P.m3); b.vl(tx,y0+30-th,y0+29,P.m4); for (var fy=y0+31-th;fy<y0+29;fy+=2) b.px(tx+1,fy,P.m2); }   // Hochhäuser im Westen
  b.rect(x0+w-22,y0+23,4,6,P.y3); b.vl(x0+w-22,y0+23,y0+28,P.y4);                                                                             // der gelbe Würfel
  // Baščaršija: Ziegel- und Bleidächer, Kuppel, schlanke Minarette, die Sahat-kula
  for (y=y0+31;y<y0+40;y++) for (x=x0;x<x0+w;x++){ var row=(y-y0-31)>>1, cc=((x+row*3)%6<1)?P.t1:(((y-y0)&1)?P.t2:P.t3); if (hash((x>>2)+row*13,row)<0.22) cc=(y%2)?P.m2:P.m3; if (hash((x>>3)+row*7,row+3)<0.18 && (y-y0-31)%2===1) cc=P.s4; b.px(x,y,cc); }
  b.ellipse(x0+46,y0+32,6,3.2,function(xx,yy){ return (xx<x0+45)?P.m3:P.m2; }); px(x0+46,y0+28,P.y3); px(x0+46,y0+27,P.y2); b.ellipse(x0+31,y0+33,3,1.8,P.m2);
  spire(x0+54,y0+36,15,P.s5,P.m1); spire(x0+26,y0+37,11,P.s4,P.m1); spire(x0+40,y0+36,8,P.s4,P.m2);
  var sk=x0+61; b.rect(sk,y0+26,3,11,P.s4); b.vl(sk,y0+26,y0+36,P.s5); b.rect(sk-1,y0+24,5,2,P.m2); px(sk+1,y0+23,P.m1); px(sk+1,y0+28,P.s6); px(sk+1,y0+29,P.s2);   // Sahat-kula
  // Dächer von Kovači direkt unter dem Fenster: Walmdächer aus dunklen Ziegeln, weiße Wände, Kamine
  [[x0-8,y0+40,28,5],[x0+16,y0+43,24,4],[x0+38,y0+39,24,5],[x0+58,y0+42,22,5]].forEach(function(hs){ var rx=hs[0], ry=hs[1], rw=hs[2], rh=hs[3];
    for (y=ry;y<ry+rh;y++){ var t2=(y-ry)/rh, a0=rx+4-Math.round(t2*4), a1=rx+rw-4+Math.round(t2*4); for (x=a0;x<a1;x++){ var c=((y-ry)%2===0)?P.t1:(((x+y)%3===0)?P.t2:P.t3); if (y===ry) c=P.t4; px(x,y,c); } }
    for (x=rx;x<rx+rw;x++) px(x,ry+rh,P.w0);
    for (y=ry+rh+1;y<y0+h;y++) for (x=rx+1;x<rx+rw-1;x++) px(x,y,(x===rx+1)?P.s3:((hash(x>>1,y)<0.15)?P.s3:P.s5));
    for (var wi=rx+4;wi<rx+rw-4;wi+=7) if (ry+rh+3<y0+h){ px(wi,ry+rh+3,P.k2); px(wi+1,ry+rh+3,P.k2); px(wi,ry+rh+4,P.k2); px(wi+1,ry+rh+4,P.w1); }
    var cx=rx+rw-8; b.rect(cx,ry-4,2,4,P.s3); px(cx-1,ry-5,P.s2); px(cx,ry-5,P.s2); px(cx+1,ry-5,P.s2); CHIMNEY.push([cx,ry-6]); });
  M.scn.minaret(b,x0+10,y0+h,42,{stone:R('s3 s4 s5 s5'),cap:R('m1 m2 m3 m3')});                                                              // nahes Minarett (Kovači)
  for (i=0;i<8;i++) b.line(x0+w-7,y0+h,x0+w-13+i*2,y0+31+((i*5)%8),P.w1);                                                                    // kahler Baum
  // Wetter: Nebel liegt im Tal, Regen verhängt alles, Schnee auf den Dächern
  var cityFog=function(xx,yy){ var v=(yy-y0)/h; if (fog) return v<0.62?0.74:(v<0.78?0.5:0.06); if (rain) return v<0.62?0.55:0.16; if (snow) return v<0.62?0.42:0.06; return v<0.62?(tod==='day'?0.14:0.26):0.0; };
  M.fogBake(b,function(xx,yy){ return inWin(xx,yy)&&yy>=y0+8?cityFog(xx,yy):0; },{col:rain?P.m3:P.s4,x:x0,y:y0,w:w,h:h});
  if (fog) for (y=y0+22;y<y0+33;y++) for (x=x0;x<x0+w;x++) if (bayer(x,y)<0.52+Math.sin(x*0.13+y*0.5)*0.22-Math.abs(y-y0-28)*0.07) b.px(x,y,(y<y0+28)?P.s5:P.s4);   // der Nebelsee über der Stadt
  if (snow) M.snowCap(b,x0,y0+30,w,h-30,function(xx,yy){ var c=b.get(xx,yy); return c===P.t1||c===P.t2||c===P.t3||c===P.t4||c===P.m2||c===P.m3; });
  // Tageszeit: umfärben, dann Lichter
  if (tod!=='day'){ var tint=M.TINT[tod]||M.TINT.night; for (y=y0+8;y<y0+h;y++) for (x=x0;x<x0+w;x++) b.px(x,y,M.tintPx(tint,b.get(x,y),x,y)); }
  if (night||dusk){ var lr=M.rng(13), n=night?110:44;
    if (fog||rain){ for (y=y0+15;y<y0+40;y++) for (x=x0;x<x0+w;x++) if (bayer(x,y)<(0.44-Math.abs(y-y0-28)*0.034)) b.px(x,y,fog?(night?P.y1:P.d2):P.m1); }   // Lichtglocke im Dunst
    for (i=0;i<n*3;i++){ var lx=x0+Math.floor(lr()*w), ly=y0+16+Math.floor(lr()*24), v4=(ly-y0-16)/24, band=(v4<0.3)?0.25:((v4<0.62)?1:0.6), cl2=fbm(lx*0.22,ly*0.5);   // Häufung: im Tal dicht, am Hang dünn
      if (lr()>band*(cl2>0.48?1:0.25)) continue; var c3=lr()<0.22?P.y5:(lr()<0.6?P.y4:P.y3); if ((fog||rain) && ly<y0+32 && lr()<0.6) c3=P.y2; px(lx,ly,c3); if ((fog||rain) && lr()<0.35) px(lx+1,ly,P.y1); if (lr()<0.35) LIGHTS.push([lx,ly]); }
    for (var st2=0;st2<3;st2++){ var sy0=y0+20+st2*4, sx0=x0+8+st2*14; for (i=0;i<12;i++){ var lx2=sx0+i*3, ly2=rnd(sy0+i*0.4+Math.sin(i*0.8+st2)*0.6); if (lx2<x0+w) px(lx2,ly2,P.y3); } }      // Straßenzüge
    for (i=0;i<=34;i++){ var u3=i/34, sx=rnd(x0+1+u3*(w-2)), sy=rnd(y0+31-u3*4+Math.sin(u3*6)*1.1); if (i%2===0) px(sx,sy,P.y4); }                // Straßenlaternen an der Miljacka
    for (i=0;i<10;i++){ var wx=x0+3+Math.floor(lr()*(w-6)), wy=y0+44+Math.floor(lr()*4); b.rect(wx,wy,2,2,lr()<0.5?P.y4:P.y3); }                 // Fenster in Kovači
    px(x0+62,y0+28,P.y4); px(x0+63,y0+28,P.y3); }                                                                                           // die beleuchtete Uhr
  return b; }
function plasterLite(x,y){ return (hash(x>>1,y)<0.2)?P.s3:P.s4; }

// ---------------------------------------------------------------- Wände, Decke, Boden
function lime(u,v,x,y,seed){ var n=fbm(u*0.05+seed,v*0.06), c=M.rampAt(R('s3 s4 s5 s6'),0.66+(n-0.5)*0.35+(hash(u>>2,v>>1)-0.5)*0.06,x,y); if (fbm(u*0.12+seed,v*0.03)>0.7 && bayer(x,y)<0.4) c=M.DN[c]; return c; }
function border(u,v){ var m=((u%12)+12)%12, d=Math.abs(m-6)+Math.abs(v-4); if (v===0||v===8) return P.b1; if (d<2) return P.r2; if (d===3) return P.b2; if (Math.abs(m-6)>4 && v===4) return P.g3; return null; }   // Schablonenborte
function wallBack(u,v,x,y){ var Y=v+RECT[1], c;
  if (Y>=90) return (Y===90)?P.w3:((Y<97)?P.w2:P.w0);
  c=lime(u+RECT[0],v,x,y,0); if (Y>=RECT[1]+2 && Y<RECT[1]+11){ var bc=border(u,Y-RECT[1]-2); if (bc!==null) c=bc; } if (Y<RECT[1]+2) c=P.s3; return c; }
function wallSide(u,v,x,y,sd){ var Y=v+RECT[1], c;
  if (Y>=90) c=(Y===90)?P.w3:((Y<97)?P.w2:P.w0);
  else { c=lime(u*1.7+(sd==='L'?0:300),v,x,y,sd==='L'?5:11); if (Y>=RECT[1]+2 && Y<RECT[1]+11){ var bc=border(Math.floor(u*1.7),Y-RECT[1]-2); if (bc!==null) c=bc; } }
  return sd==='L'?M.DN[c]:c; }
function ceilTex(xb,d,x,y){ var u=((Math.floor(xb)-RECT[0])%13+13)%13, c=tex.boards(xb,d*3,R('w2 w3 w3 w4'),9); if (u===0) c=P.w1; else if (u===1) c=P.w4; else if (u===2) c=P.w2; return c; }   // Bretter mit Leisten
function floorTex(xb,d,x,y){ return tex.planks(xb,y,VP[1],FY,R('w1 w2 w3 w3'),12); }
// Teppich (Ćilim) in der Mitte
function rugCol(X,Z){ var X0=110, X1=226, Z0=24, Z1=76; if (X<X0||X>X1||Z<Z0||Z>Z1) return null; var u=(X-X0)/(X1-X0), v=(Z-Z0)/(Z1-Z0), e=Math.min(u,1-u,v*0.45,(1-v)*0.45);
  if (e<0.012) return P.r0; if (e<0.035) return ((Math.floor(X/4)+Math.floor(Z/3))&1)?P.b0:P.c1; if (e<0.05) return P.y2;
  var cu=(u-0.5)*2, cv=(v-0.5)*2, md=Math.abs(cu)*1.2+Math.abs(cv); if (md<0.36) return md<0.15?P.y2:P.b0; if (md<0.42) return P.y1;
  var c=((Math.floor(X/5)+Math.floor(Z/4))%3===0)?P.r1:P.r2; if (Math.abs(Math.sin(X*0.35)*Math.cos(Z*0.4))>0.9) c=P.r3; return c; }

// ---------------------------------------------------------------- Dinge
function tile(x,y){ var u=((x%6)+6)%6, v=((y%6)+6)%6; if (u===0||v===0) return P.g1; if (u===1||v===1) return P.g4; if (u===5||v===5) return P.g2; return (Math.abs(u-3)+Math.abs(v-3)<2)?P.g4:P.g3; }
function dzezva(b,cx,by,col){ col=col||COP; var rows=[5,3,4,5,6,6], h=rows.length, top=by-h; for (var j=0;j<h;j++){ var wj=rows[j], x0=cx-(wj>>1); for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=col[4]; if (j===h-1) c=col[1]; b.px(x0+i,top+j,c); } }
  b.px(cx-3,top,col[4]); for (var k=0;k<6;k++) b.px(cx+2+k,top+1-Math.floor(k/3),k>4?P.k2:P.w1); }
function cup(b,x,by){ b.rect(x,by-3,3,3,P.s6); b.hl(x,x+2,by-3,P.b2); b.px(x+2,by-2,P.s4); b.hl(x-1,x+3,by,P.s5); }
// Mačak, die Katze: grau getigert, weiße Pfoten
function catSleep(b,x,y){ b.ellipse(x+6,y+3,6.5,3.2,function(xx,yy){ var c=((xx+(yy>>1))%4===0)?P.m1:P.m2; if (yy<y+2) c=((xx%4)===1)?P.m2:P.m3; return c; });
  b.ellipse(x+11,y+2,2.8,2.4,P.m2); b.px(x+12,y,P.m3); b.px(x+10,y,P.m3); b.px(x+12,y-1,P.m1); b.px(x+10,y-1,P.m1); b.px(x+11,y+2,P.k2); b.px(x+13,y+3,P.s5);
  for (var i=0;i<8;i++) b.px(x+1+i,y+6-(i>5?1:0),i%2?P.m1:P.m2); b.px(x+8,y+5,P.s5); b.px(x+9,y+5,P.s5); }
function catSit(b,x,y){ // sitzt auf dem Fensterbrett, von hinten, und schaut hinaus (y = Unterkante)
  b.ellipse(x+4,y-4,4,4.4,function(xx,yy){ return ((xx+yy)%3===0)?P.m1:P.m2; }); b.ellipse(x+4,y-10,3,2.8,P.m2);
  b.px(x+2,y-13,P.m2); b.px(x+1,y-14,P.m1); b.px(x+6,y-13,P.m2); b.px(x+7,y-14,P.m1); b.px(x+2,y-12,P.m3); b.px(x+6,y-12,P.m3);
  b.hl(x+1,x+7,y,P.m1); for (var i=0;i<6;i++) b.px(x+8+Math.floor(i*0.6),y-i,P.m2); b.px(x+9,y-6,P.m1); b.px(x+1,y-1,P.s5); b.px(x+7,y-1,P.s5); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), weather=M.scn.weather(GS), night=tod==='night', dark=tod!=='day', x, y, i;
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:function(xb,d,x,y){ var f=R3.floor(x,y), rc=f?rugCol(f.X,f.Z):null; return rc!==null?rc:floorTex(xb,d,x,y); },ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.w1); b.hl(RECT[0],RECT[2]-1,RECT[1]+1,P.w3);
  R3.box(b,RECT[0]-2,RECT[2]+2,RECT[1],RECT[1]+3,34,38,{bottom:P.w3,front:P.w2});                                           // Querbalken der Decke
  // ---- Fenster: tiefe Laibung, weißer Holzrahmen, Eisengitter, der Blick, Fensterbank
  var vb=cityView(tod,weather);
  b.rect(WIN.x-7,WIN.y-6,WIN.w+14,WIN.h+8,P.s5);
  b.poly([[WIN.x-7,WIN.y-6],[WIN.x-2,WIN.y-2],[WIN.x-2,WIN.y+WIN.h],[WIN.x-7,WIN.y+WIN.h+2]],P.s4);                       // Laibung links (im Licht)
  b.poly([[WIN.x+WIN.w+7,WIN.y-6],[WIN.x+WIN.w+2,WIN.y-2],[WIN.x+WIN.w+2,WIN.y+WIN.h],[WIN.x+WIN.w+7,WIN.y+WIN.h+2]],P.s3);   // Laibung rechts (Schatten)
  b.poly([[WIN.x-7,WIN.y-6],[WIN.x+WIN.w+7,WIN.y-6],[WIN.x+WIN.w+2,WIN.y-2],[WIN.x-2,WIN.y-2]],P.s2);                     // Sturz
  b.fn(WIN.x,WIN.y,WIN.w,WIN.h,function(x,y){ return vb.get(x,y); });
  var gc=night?P.k1:P.m1;                                                                                                   // Eisengitter (draußen vor dem Glas)
  for (x=WIN.x+9;x<WIN.x+WIN.w;x+=19){ b.vl(x,WIN.y,WIN.y+WIN.h-1,gc); b.px(x-1,WIN.y+WIN.h-12,gc); b.px(x+1,WIN.y+WIN.h-12,gc); }
  b.hl(WIN.x,WIN.x+WIN.w-1,WIN.y+WIN.h-11,gc);
  if (weather==='snow'){ var sc=night?P.s3:P.s5, sc2=night?P.s2:P.s4;
    [[WIN.x,WIN.x+(WIN.w>>1)-1],[WIN.x+(WIN.w>>1)+2,WIN.x+WIN.w]].forEach(function(pn){ for (x=pn[0];x<pn[1];x++){ var e=Math.min(x-pn[0],pn[1]-1-x), dh=Math.max(1,4-Math.floor(e/3))+(hash(x,9)<0.3?1:0); for (y=WIN.y+WIN.h-dh;y<WIN.y+WIN.h;y++) b.px(x,y,(y===WIN.y+WIN.h-dh)?sc:sc2); } });
    for (x=WIN.x;x<WIN.x+WIN.w;x++) if (hash(x,4)<0.6) b.px(x,WIN.y+WIN.h-12,sc); }
  var mx=WIN.x+(WIN.w>>1);                                                                                                  // Holzrahmen, weiß gestrichen
  b.rect(WIN.x-2,WIN.y-2,WIN.w+4,2,P.s6); b.rect(WIN.x-2,WIN.y+WIN.h,WIN.w+4,2,P.s4); b.rect(WIN.x-2,WIN.y,2,WIN.h,P.s5); b.rect(WIN.x+WIN.w,WIN.y,2,WIN.h,P.s4);
  b.rect(mx-1,WIN.y,3,WIN.h,P.s5); b.vl(mx+1,WIN.y,WIN.y+WIN.h-1,P.s3); b.rect(WIN.x,WIN.y+17,WIN.w,2,P.s5); b.hl(WIN.x,WIN.x+WIN.w-1,WIN.y+18,P.s3);
  b.rect(mx-4,WIN.y+27,2,4,P.y3); b.px(mx-4,WIN.y+27,P.y5);                                                                 // Fenstergriff
  R3.box(b,WIN.x-8,WIN.x+WIN.w+8,74,78,0,7,{top:function(x,y){ return ((x+y)%9===0)?P.s4:P.s5; },front:P.s3});              // tiefe Fensterbank
  b.rect(WIN.x+3,SILL-5,6,5,P.t3); b.hl(WIN.x+3,WIN.x+8,SILL-5,P.t4); b.vl(WIN.x+8,SILL-4,SILL-1,P.t1);                    // Geranie
  for (i=0;i<11;i++){ var ga=-Math.PI*0.95+i*0.19; b.px(rnd(WIN.x+6+Math.cos(ga)*4.5),rnd(SILL-7+Math.sin(ga)*3),i%3?P.g3:P.g2); b.px(rnd(WIN.x+6+Math.cos(ga)*3),rnd(SILL-6+Math.sin(ga)*2),P.g2); }
  [[WIN.x+4,SILL-10],[WIN.x+7,SILL-11],[WIN.x+9,SILL-9]].forEach(function(f){ b.px(f[0],f[1],P.r3); b.px(f[0]+1,f[1],P.r4); b.px(f[0],f[1]+1,P.r2); });
  b.hl(WIN.x-9,WIN.x+WIN.w+8,WIN.y-8,P.w2); for (x=WIN.x-8;x<WIN.x+WIN.w+8;x++) b.px(x,WIN.y-7+((x>>1)&1),P.s6);           // Vorhangleiste mit kurzer Spitzenborte
  // ---- Tür (hinten links), Tischchen mit Telefon, Steckdose, Fotos
  M.prop.door(b,DOOR.x,DOOR.y,DOOR.w,DOOR.h,{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),knob:'R'});
  b.rect(DOOR.x+DOOR.w-5,DOOR.y+30,2,4,P.m2); b.px(DOOR.x+DOOR.w-5,DOOR.y+34,P.k1);
  b.rect(DOOR.x+3,DOOR.y-9,DOOR.w-6,5,P.w1); for (x=DOOR.x+4;x<DOOR.x+DOOR.w-3;x+=2) b.px(x,DOOR.y-7,P.w3);                  // geschnitzter Sturz
  R3.box(b,PT.X0,PT.X1,PT.Y0,PT.Y0+2,PT.Z0,PT.Z1,{top:P.w3,front:P.w1});
  [[PT.X0+1,PT.Z1-1],[PT.X1-2,PT.Z1-1],[PT.X0+1,PT.Z0+1],[PT.X1-2,PT.Z0+1]].forEach(function(lg,li){ var a=R3.p(lg[0],PT.Y0+2,lg[1]), z=R3.p(lg[0],FY,lg[1]); b.line(rnd(a[0]),rnd(a[1]),rnd(z[0]),rnd(z[1]),li<2?P.w2:P.w1); });
  var pt=PTF, ptw=PTW;
  for (x=pt[0]-1;x<=pt[0]+ptw+1;x++) b.px(x,pt[1]+1+((x&1)?1:0),P.s6);                                                     // Häkeldeckchen
  var ph=[pt[0]+3,pt[1]-1]; b.poly([[ph[0],ph[1]],[ph[0]+11,ph[1]],[ph[0]+9,ph[1]-5],[ph[0]+2,ph[1]-5]],P.r2); b.hl(ph[0]+1,ph[0]+10,ph[1],P.r1);   // Telefon (rot), Wählscheibe
  b.rect(ph[0]+1,ph[1]-8,10,3,P.r2); b.hl(ph[0]+1,ph[0]+10,ph[1]-8,P.r3); b.rect(ph[0],ph[1]-7,2,2,P.r1); b.rect(ph[0]+10,ph[1]-7,2,2,P.r1);
  b.ellipse(ph[0]+5.5,ph[1]-2.5,2.4,1.8,P.s5); b.px(ph[0]+5,ph[1]-3,P.k2); b.px(ph[0]+6,ph[1]-2,P.k2); b.px(ph[0]+4,ph[1]-2,P.k2); b.px(ph[0]+5,ph[1]-2,P.r2);
  for (i=0;i<6;i++) b.px(ph[0]+12+((i&1)),ph[1]+1+i,P.k2);                                                                    // Spiralkabel
  var so=SOCKET; b.rect(so[0],so[1],5,4,P.s6); b.hl(so[0],so[0]+4,so[1]+3,P.s3); b.px(so[0]+1,so[1]+1,P.k2); b.px(so[0]+3,so[1]+1,P.k2);   // Steckdose
  if (S.charging){ b.rect(so[0]+1,so[1]+1,3,3,P.k2); b.px(so[0]+2,so[1]+1,P.g5); b.px(so[0]+3,so[1]+1,P.g4); for (i=0;i<9;i++) b.px(so[0]+2+Math.round(Math.sin(i*0.6)*1.5),so[1]+4+i,P.k1); b.line(so[0]+3,so[1]+12,so[0]-6,pt[1]+3,P.k1); b.line(so[0]-6,pt[1]+3,so[0]-4,pt[1]-1,P.k1); b.rect(so[0]-7,pt[1]-3,5,2,P.k1); b.px(so[0]-6,pt[1]-3,P.m3); }   // Ladekabel, Handy
  M.prop.frame(b,98,36,22,17,{frame:R('w0 w1 w2'),bg:P.s5});                                                                // Foto: zwei Frauen vor einem Haus (80er)
  b.fn(100,38,18,13,function(xx,yy){ return yy<42?P.b4:(yy<48?P.s4:P.e3); }); b.rect(103,40,10,7,P.s6); b.poly([[102,40],[108,37],[114,40]],P.t3); b.rect(106,43,3,4,P.w2);
  b.rect(102,44,3,6,P.r3); b.px(103,43,P.p3); b.px(103,42,P.h1); b.rect(112,44,3,6,P.c3); b.px(113,43,P.p3); b.px(113,42,P.w3); b.hl(102,104,50,P.k2); b.hl(112,114,50,P.k2);
  M.tintApply(b,FADE,100,38,18,13);                                                                                         // ausgeblichen
  M.prop.frame(b,102,56,13,11,{frame:R('y1 y2 y3'),bg:P.s4}); b.ellipse(108.5,60,2,2.4,P.e3); b.rect(106,62,5,3,P.e2);         // kleines Porträt
  // ---- Kachelofen (links vorn) mit Rohr
  R3.box(b,STOVE.X0,STOVE.X1,STOVE.Y0,FY,STOVE.Z0,STOVE.Z1,{right:function(x,y){ var Z=((VP[0]-x)/(VP[0]-STOVE.X1)-1)*F, Y=VP[1]+(y-VP[1])/(1+Z/F); if (Y>92) return P.w1; if (Y<STOVE.Y0+4) return (Y<STOVE.Y0+2)?P.g4:P.g2; return tile(Math.floor(Z*1.6),Math.floor(Y)); },
    front:function(x,y){ var k=1+STOVE.Z1/F, X=VP[0]+(x-VP[0])/k, Y=VP[1]+(y-VP[1])/k; if (Y>92) return P.w0; if (Y<STOVE.Y0+4) return (Y<STOVE.Y0+2)?P.g3:P.g1; return M.DN[tile(Math.floor(X*1.3),Math.floor(Y))]; }});
  var sd=STOVE_DOOR; b.rect(sd[0],sd[1],sd[2],sd[3],P.k1); b.rect(sd[0]+1,sd[1]+1,sd[2]-2,sd[3]-2,P.k2); b.hl(sd[0],sd[0]+sd[2]-1,sd[1],P.m2); b.px(sd[0]+sd[2]-2,sd[1]+sd[3]/2|0,P.m3);
  var top=rp(R3.p(STOVE.X0+10,STOVE.Y0,STOVE.Z0+10)); b.rect(top[0]-2,top[1]-14,4,14,P.k2); b.vl(top[0]-2,top[1]-14,top[1]-1,P.m1); b.line(top[0],top[1]-14,top[0]-14,top[1]-22,P.k2); b.line(top[0]+1,top[1]-14,top[0]-13,top[1]-22,P.k2); b.line(top[0]+1,top[1]-15,top[0]-12,top[1]-23,P.m1);   // Rohr in die Wand
  b.rect(top[0]-16,top[1]-25,4,5,P.m1);
  var kz=rp(R3.p(STOVE.X0+6,STOVE.Y0,STOVE.Z1-4)); b.rect(kz[0]-3,kz[1]-5,6,5,P.t3); b.hl(kz[0]-3,kz[0]+2,kz[1]-5,P.t5); b.line(kz[0]+3,kz[1]-4,kz[0]+7,kz[1]-6,P.w1);   // Kupferkanne auf dem Ofen
  // ---- Bett mit Kelim (rechts hinten), Kopfteil an der Wand
  b.rect(BED.X0,62,BED.X1-BED.X0,18,P.w2); b.hl(BED.X0,BED.X1-1,62,P.w4); b.vl(BED.X0,62,79,P.w3); for (x=BED.X0+6;x<BED.X1-4;x+=10){ b.rect(x,66,6,10,P.w1); b.hl(x,x+5,66,P.w3); }
  R3.box(b,BED.X0,BED.X1,BED.Y0+5,FY,BED.Z0,BED.Z1,{left:function(x,y){ return ((x+y)%7===0)?P.w0:P.w1; },front:P.w1});
  R3.box(b,BED.X0,BED.X1,BED.Y0,BED.Y0+5,BED.Z0,BED.Z1,{top:function(x,y){ var u=x-BED.X0, v=y*3, band=Math.floor(v/5)%4, d=Math.abs(((u%10)+10)%10-5)+Math.abs((v%5)-2), c=[P.r2,P.r1,P.r2,P.b0][band]; if (d<2) c=band===3?P.y2:P.s4; else if (d===2) c=P.r3; return c; },
    left:function(x,y){ return ((x+y)&1)?P.r1:P.r2; },front:function(x,y){ var v=y-R3.p(0,BED.Y0,BED.Z1)[1]; return v<1?P.r3:(((x>>2)+(v>>1))&1?P.r1:P.y1); }});
  b.ellipse(244,81,9,2.6,P.s6); b.hl(237,251,83,P.s4);                                                                         // Kissen
  // ---- Wandbord mit Hajras Kaffeegeschirr (über dem Bett)
  b.rect(214,46,44,2,P.w3); b.hl(214,257,48,P.w1); for (x=214;x<258;x++) b.px(x,49+((x>>1)&1),P.s6);                            // Brett mit Spitzenborte
  b.ellipse(221,40,5,5,function(xx,yy){ var d=Math.hypot(xx-221,yy-40)/5; return d>0.8?P.t5:(d>0.6?P.t2:P.t3); }); b.px(219,38,P.l0);   // Kupfertablett
  dzezva(b,231,46,COP); for (i=0;i<3;i++) cup(b,238+i*5,46); b.ellipse(254,43.5,2.6,2.4,P.t3); b.px(254,40,P.t5); b.hl(252,256,42,P.t4);
  // ---- Kleiderschrank (vorn rechts)
  R3.box(b,WARD.X0,WARD.X1,WARD.Y0,FY,WARD.Z0,WARD.Z1,{left:function(x,y){ var Z=((x-VP[0])/(WARD.X0-VP[0])-1)*F, Y=VP[1]+(y-VP[1])/(1+Z/F), c=tex.boards(Z*4,Y,R('w0 w1 w1 w2'),70);
      if (Y<WARD.Y0+5) return (Y<WARD.Y0+2)?P.w3:P.w1; if (Y>92) return P.w0; var mid=Math.abs(Z-(WARD.Z0+WARD.Z1)/2)<0.8; if (mid) return P.k2;
      var pz=((Z-WARD.Z0)%((WARD.Z1-WARD.Z0)/2)), py=Y-WARD.Y0-8; if (pz>3 && pz<15 && py>2 && py<26){ c=(pz<4||py<3)?P.w3:(pz>14||py>25?P.w0:P.w2); } if (pz>3 && pz<15 && py>32 && py<56){ c=(pz<4||py<33)?P.w3:(pz>14||py>55?P.w0:P.w2); } return c; },
    front:function(x,y){ return ((x+y)%5===0)?P.w0:P.w1; }});
  var kn=rp(R3.p(WARD.X0,62,(WARD.Z0+WARD.Z1)/2-1.5)), kn2=rp(R3.p(WARD.X0,62,(WARD.Z0+WARD.Z1)/2+1.5)); b.rect(kn[0],kn[1],1,3,P.y3); b.rect(kn2[0],kn2[1],1,3,P.y3);
  var st0=rp(R3.p(WARD.X0+2,WARD.Y0,WARD.Z0+6)); b.rect(st0[0]-2,st0[1]-7,22,7,P.w2); b.hl(st0[0]-2,st0[0]+19,st0[1]-7,P.w4); b.rect(st0[0]+7,st0[1]-9,5,2,P.k2); b.vl(st0[0]+4,st0[1]-7,st0[1]-1,P.w1);   // Koffer obenauf
  // ---- Katze
  if (catOf(S)==='window') catSit(b,CAT_WIN[0],CAT_WIN[1]); else catSleep(b,CAT_BED[0],CAT_BED[1]);
  // ---- Deckenlampe (Milchglasschale an kurzer Stange)
  b.vl(LAMP[0],0,LAMP[1]-3,P.y1); b.rect(LAMP[0]-1,LAMP[1]-3,3,1,P.y2); b.ellipse(LAMP[0]+0.5,LAMP[1]+0.5,6,2.6,P.s5); b.hl(LAMP[0]-5,LAMP[0]+6,LAMP[1]+2,P.s3); b.px(LAMP[0]-3,LAMP[1],P.s6);
  // ---- Licht
  var notWin=function(x,y){ return !inWin(x,y); };
  if (!dark){ var wl=M.lf.sum(M.lf.pool(WIN.x+WIN.w/2,118,120,30,0.75),M.lf.pool(WIN.x+WIN.w/2,64,96,60,0.45),M.lf.vignette(W,144,2.0),M.lf.k(weather==='calm'?0.05:-0.25));
    M.light(b,wl,0,0,notWin); return b; }
  M.light(b,M.lf.vignette(W,144,1.2),0,0,notWin);
  shadeTOD(b,0,0,tod,notWin);
  b.ellipse(LAMP[0]+0.5,LAMP[1]+0.5,6,2.6,P.y4); b.hl(LAMP[0]-5,LAMP[0]+6,LAMP[1]+2,P.y5); b.px(LAMP[0]-3,LAMP[1],P.l1); b.px(LAMP[0],LAMP[1]+3,P.l0);
  b.rect(sd[0]+1,sd[1]+1,sd[2]-2,sd[3]-2,P.t1); b.px(sd[0]+2,sd[1]+sd[3]-3,P.y3);
  if (S.charging){ b.px(so[0]+2,so[1]+1,P.g5); b.px(so[0]+3,so[1]+1,P.g4); }                                                 // das grüne Lämpchen leuchtet auch im Dunkeln
  return b; }
var FADE=M.tintMake(function(r,g,bb){ return [r*0.85+30,g*0.82+26,bb*0.7+20]; });

// ---------------------------------------------------------------- Ebenen: das runde Tischchen mit Spitzendecke (vorn, auf dem Teppich)
function layers(S,GS,tod){ var L=[], cx=TBL.cx, ty=TBL.top, by=TBL.base, rx=TBL.rx, lay=M.layer(cx-rx-3,ty-14,2*rx+7,by-ty+16,by), w=M.lw(lay), x;
  w.vl(cx,ty+7,by-3,P.w1); w.vl(cx+1,ty+7,by-3,P.w0); w.line(cx,by-3,cx-6,by,P.w1); w.line(cx+1,by-3,cx+7,by,P.w0); w.line(cx,by-3,cx+1,by,P.k2);   // gedrechselter Fuß
  w.ellipse(cx+0.5,ty+0.5,rx,3.2,P.s6); w.hl(cx-rx+2,cx+rx-2,ty-2,P.s6);
  for (x=cx-rx;x<=cx+rx;x++){ var e=Math.abs(x-cx)/rx, dh=rnd(6-e*e*3), sc=(Math.abs(Math.sin(x*0.8))>0.5)?1:0; for (var yy=ty+2;yy<ty+2+dh+sc;yy++) w.px(x,yy,((x+yy)%3===0)?P.s4:(yy>ty+dh?P.s5:P.s6)); }   // Spitzendecke hängt über, gebogter Saum
  for (x=cx-rx+2;x<cx+rx-1;x+=3) w.px(x,ty,P.s4);
  if (S.coffee){ w.ellipse(cx,ty-0.5,9,2.2,P.t3); w.ellipse(cx,ty-0.5,7,1.4,P.t4); w.hl(cx-8,cx+8,ty+1,P.t1); w.px(cx-5,ty-2,P.t5);
    dzezva(w,cx-3,ty-1,COP); cup(w,cx+2,ty); cup(w,cx+6,ty-1); w.rect(cx-8,ty-2,3,2,P.s6); w.px(cx-7,ty-2,P.r4); }
  else { w.ellipse(cx+4,ty-0.5,2.2,1.1,P.g3); w.vl(cx+4,ty-6,ty-1,P.g2); w.px(cx+3,ty-7,P.r3); w.px(cx+5,ty-7,P.y4); w.px(cx+4,ty-8,P.r4); }   // kleine Vase
  if (tod==='day') M.light(lay,M.lf.pool(WIN.x+WIN.w/2,118,120,30,0.5),lay.ox,lay.oy); else shadeTOD(lay,lay.ox,lay.oy,tod);
  L.push(lay); return L; }

// ---------------------------------------------------------------- jedes Bild: Ofenglut, Regen/Schnee am Fenster, Lichter der Stadt, Rauch, Katze
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, weather=M.scn.weather(GS), i, sd=STOVE_DOOR;
  for (i=0;i<4;i++){ var gx=sd[0]+1+((i*3+Math.floor(t*5))%Math.max(1,sd[2]-2)), gy=sd[1]+sd[3]-2-((i+Math.floor(t*3))%3); if (Math.sin(t*6+i*2)>-0.2) fb.px(gx,gy,(i&1)?P.y3:P.t4); }
  if (tod!=='day') for (i=0;i<LIGHTS.length;i++){ if (Math.sin(t*(1.3+hash(i,2))+i*7)>0.9){ var l=LIGHTS[i]; fb.px(l[0],l[1],P.l0); } }
  for (i=0;i<CHIMNEY.length;i++){ var ch=CHIMNEY[i]; for (var k=0;k<5;k++){ var ph=((t*0.25+k*0.2+i*0.3)%1), sx=rnd(ch[0]+Math.sin(t*0.8+k+i)*1.2+ph*(weather==='calm'?0.5:4)), sy=rnd(ch[1]-ph*12); if (inWin(sx,sy) && bayer(sx,sy)<0.7-ph*0.6) fb.px(sx,sy,tod==='day'?P.s5:(tod==='night'?P.m1:P.m2)); } }
  if (weather==='rain') M.scn.windowRain(fb,WIN.x,WIN.y,WIN.w,WIN.h,t,0);
  if (weather==='snow') M.snow(fb,t,{n:30,mask:function(x,y){ return inWin(x,y); },col:P.s6,col2:P.s4,wind:6});
  if (catOf(S)==='window'){ if ((t%5.3)<0.18) fb.px(CAT_WIN[0]+1,CAT_WIN[1]-15,P.m2); }        // Ohrzucken
  else if ((t%4.7)<0.2) fb.px(CAT_BED[0]+12,CAT_BED[1]-2,P.m3); }

// ---------------------------------------------------------------- Geistersicht: ein zartes Netz aus Licht über der Stadt, nach Westen (rechts) gerichtet
function ghost(fb,v,S,GS){ var t=v.t, x0=WIN.x, y0=WIN.y, w=WIN.w, h=WIN.h, i, k, src=[x0+w+16,y0+23];   // die Fäden laufen im Westen (rechts, jenseits des Fensters) zusammen
  var ends=[[x0+2,y0+24],[x0+8,y0+33],[x0+20,y0+41],[x0+36,y0+46],[x0+14,y0+18]];
  for (i=0;i<ends.length;i++){ var e=ends[i], n=Math.ceil(Math.hypot(src[0]-e[0],src[1]-e[1]));
    for (k=0;k<=n;k++){ var u=k/n, x=rnd(src[0]+(e[0]-src[0])*u), y=rnd(src[1]+(e[1]-src[1])*u+Math.sin(u*Math.PI)*(i-2)*1.5);
      if (!inWin(x,y)) continue; var mv=Math.abs(((u-t*0.09-i*0.23)%1+1)%1-0.5)<0.025;                       // Lichtpunkte wandern von Westen herein
      if (mv) fb.px(x,y,P.x6); else if (bayer(x,y+Math.floor(t))<0.78-u*0.35) fb.px(x,y,u<0.35?P.x4:P.x3); } }
  for (k=0;k<4;k++){ var u2=0.25+k*0.15, pa=[src[0]+(ends[0][0]-src[0])*u2,src[1]+(ends[0][1]-src[1])*u2], pb=[src[0]+(ends[3][0]-src[0])*u2,src[1]+(ends[3][1]-src[1])*u2], m=Math.ceil(Math.hypot(pa[0]-pb[0],pa[1]-pb[1]));
    for (var j=0;j<=m;j++){ var xx=rnd(pa[0]+(pb[0]-pa[0])*j/m), yy=rnd(pa[1]+(pb[1]-pa[1])*j/m); if (inWin(xx,yy) && bayer(xx,yy)<0.32) fb.px(xx,yy,P.x2); } } }   // Querfäden: ein Netz

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<101||y>140||x<6||x>314) return false; var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (X<RECT[0]+3||X>RECT[2]-3) return false;
  if (X<STOVE.X1+3 && Z<STOVE.Z1+4) return false;                                // Kachelofen
  if (X>BED.X0-3 && Z<BED.Z1+3) return false;                                    // Bett
  if (X>WARD.X0-3 && Z>WARD.Z0-4) return false;                                  // Schrank
  if (Math.hypot((x-TBL.cx)/(TBL.rx+6),(y-TBL.base+1)/4.5)<1) return false;       // Tischchen
  if (X<PT.X1+2 && X>PT.X0-2 && Z<PT.Z1+3) return false;                         // Telefontischchen
  return true; }
var BR=R3.rect(BED.X0,BED.X1,BED.Y0,FY,BED.Z0,BED.Z1), SR=R3.rect(STOVE.X0,STOVE.X1,STOVE.Y0,FY,STOVE.Z0,STOVE.Z1), WR=R3.rect(WARD.X0,WARD.X1,WARD.Y0,FY,WARD.Z0,WARD.Z1), PR=R3.rect(PT.X0,PT.X1,PT.Y0,FY,PT.Z0,PT.Z1);
M.defineArt('pansion',{
  width:W, paint:paint, layers:layers, dynamic:dyn, ghost:ghost, walk:walk,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; var L=levels(tod); return L[Math.max(0,Math.min(L.length-1,Math.round(lightAt(a.x,a.y-22,tod)*(L.length-1))))].a; },
  spots:{
    door:[DOOR.x-3,DOOR.y-10,DOOR.w+6,DOOR.h+10],
    bed:[BR[0],62,Math.min(BR[2],275-BR[0]),BR[1]+BR[3]-62],
    window:[WIN.x-8,WIN.y-7,WIN.w+16,WIN.h+12],
    stove:[SR[0],SR[1]-26,SR[2],SR[3]+26],
    table:[TBL.cx-TBL.rx-2,TBL.top-9,2*TBL.rx+5,TBL.base-TBL.top+10],
    phone:[PR[0],PR[1]-10,PR[2],12],
    socket:[SOCKET[0]-2,SOCKET[1]-2,9,8],
    photos:[97,35,25,33],
    cat:live(4,function(){ return catOf(curS())==='window'?[CAT_WIN[0]-2,CAT_WIN[1]-16,14,17]:[CAT_BED[0]-3,CAT_BED[1]-3,22,11]; }),
    wardrobe:[WR[0],WR[1]+8,W-WR[0],WR[3]-8],
    shelf:[213,32,46,20],
    rug:[96,112,150,22]
  },
  stands:{
    door:[82,103,'B'], bed:[200,116,'R'], window:[160,106,'B'], stove:[80,122,'L'], table:[186,130,'R'], phone:[112,108,'B'], socket:[114,108,'B'], photos:[108,108,'B'],
    cat:live(3,function(){ return catOf(curS())==='window'?[182,106,'B']:[232,118,'B']; }), wardrobe:[262,124,'R'], shelf:[210,116,'B'], rug:[150,126,'B']
  },
  actorPos:{ hajra:[132,113,'L'] },
  start:[160,106,'B'], entries:{ map:[84,104,'R'] }
});
})(M);
