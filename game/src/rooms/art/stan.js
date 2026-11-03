/* ===== rooms/art/stan.js — Nadas Wohnung im 9. Stock von Haus 7 (480 breit, scrollend) =====
   Zwei Räume nebeneinander, wie im Schnitt gesehen, jeder mit eigenem Fluchtpunkt; dazwischen die Trennwand.
   Links Küche und Wohnzimmer: die gepolsterte Wohnungstür, eine Küchenzeile mit Fliesen und Džezva, die Wanduhr,
   der Kalender, die Balkontür mit Fenster und dem Blick über die Türme, das Tal und die Hügel, darunter der Heizkörper,
   die Anrichte mit dem Fernseher auf dem Häkeldeckchen und den gerahmten Fotos (ein Mädchen mit Zopf, lachend),
   der Tisch mit Wachstuch und zwei Stühlen. An der rechten Wand die geschlossene Tür zu Lanas Zimmer (Schlüsselloch).
   Rechts Lanas Zimmer, seit 1993 unverändert: schmales Bett mit Tagesdecke, Plakate (erfunden), Fenster, Schreibtisch
   mit Stiftedose und Zeichenblock, Zeichnungen an der Wand (Straßenbahnen, Gesichter), Kleiderschrank, eine Postkarte
   vom Meer mit Palmen. Staub. Solange !S.lanaOpen sind dort die Vorhänge zu und es ist dämmrig. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144;
// Wohnzimmer und Lanas Zimmer: je ein Kasten mit eigenem Fluchtpunkt
var VPL=[150,58], RL=[20,22,232,102], SPL={vp:VPL,rect:RL}, FL=88, R3L=M.room3(VPL,FL,102);
var VPR=[396,58], RRm=[340,22,470,102], SPR={vp:VPR,rect:RRm}, FR=88, R3R=M.room3(VPR,FR,102);
var CUT={x0:292,x1:308};                              // Schnitt durch die Trennwand (vorn, als Ebene)
var LDOOR={u0:20,u1:42,v0:34,v1:102};                 // Tür zu Lanas Zimmer (rechte Wand des Wohnzimmers)
var LDOOR_R={u0:14,u1:29};                            // dieselbe Öffnung von Lanas Seite (linke Wand)

function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function sign(b,s,x,y,c){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch){ var base={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'}[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') b.px(cx+1,y-1,c); else if (ch==='Ć') b.px(cx+2,y-1,c); else if (ch==='Đ') b.px(cx,y+2,c); cx+=w+1; }); return cx; }
function wallUV(spec,sd,x,y){ var r=spec.rect, vp=spec.vp, ex=sd==='L'?r[0]:r[2], t=(ex-vp[0])/(x-vp[0]); if (t<=0) return null; var D=sd==='L'?(vp[0]-r[0]):(r[2]-vp[0]); return {u:(1/t-1)*D, v:vp[1]+(y-vp[1])*t}; }
function box(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
// Puffer-Ausschnitt: M.box malt in einen Puffer; dieser Schreiber begrenzt auf x0..x1
function clipW(b,x0,x1){ return {w:b.w,h:b.h,px:function(x,y,c){ if (x<x0||x>=x1) return; b.px(x,y,c); },get:function(x,y){ return b.get(x,y); }}; }

// ---------------------------------------------------------------- Lage der Dinge (Wohnzimmer)
var ADOOR={x0:24,x1:50,y0:38};                        // Wohnungstür (gepolstert)
var KIT={x0:60,x1:118,top:72};                        // Küchenzeile
var CAL={x0:122,x1:134,y0:40,y1:58};                  // Kalender
var CLOCK={x:128,y:30};                               // Wanduhr
var BAL={x0:138,x1:160,y0:34};                        // Balkontür
var WINL={x0:162,x1:194,y0:34,y1:70};                 // Fenster daneben
var RADL={x0:164,x1:192,y0:80,y1:96};                 // Heizkörper unter dem Fenster
var SIDE={X0:198,X1:230,Y0:74,Z0:0,Z1:10};            // Anrichte mit Fernseher (Raumkoordinaten links)
var TABLE={X0:112,X1:150,Z0:30,Z1:50,Y0:78};          // Tisch mit Wachstuch
var NADA=[76,124];                                    // Nada sitzt links am Tisch (Hüfte, Füße)
// ---------------------------------------------------------------- Lage der Dinge (Lanas Zimmer)
var POST={x0:341,x1:380,y0:26,y1:72};                 // Plakate
var WINR={x0:391,x1:419,y0:34,y1:72};                 // Fenster
var DESK={X0:424,X1:450,Y0:80,Z0:0,Z1:14};            // Schreibtisch (Raumkoordinaten rechts)
var DRAW={x0:425,x1:449,y0:30,y1:60};                 // Zeichnungen an der Wand
var WARD={X0:450,X1:470,Y0:30,Z0:0,Z1:16};            // Kleiderschrank
var BED={X0:340,X1:362,Y0:84,Z0:2,Z1:40};             // Bett an der linken Wand
var CARD={x:352,y:62};                                // Postkarte über dem Bett
var CACHE={};

// ---------------------------------------------------------------- Texturen
// Wohnzimmer: Rollenmuster an der Wand (gemalte Blümchen, typisch), unten eine Scheuerleiste
function rollerWall(u,v,x,y,dim){ var c=P.e4; var gu=((u%12)+12)%12, gv=((v%10)+10)%10, row=Math.floor(v/10); var ou=(row&1)?6:0, du=(((u+ou)%12)+12)%12;
  if ((du===5||du===6) && (gv===4||gv===5)) c=P.e3; if (du===5 && gv===3) c=P.d4; if (du===6 && gv===6) c=P.g4;
  var f=fbm(u*0.03,v*0.04); if (f>0.64 && bayer(x,y)<(f-0.64)*3) c=M.DN[c]; if (v>76) c=(v>78)?((v>79)?P.w1:P.w3):P.e3;
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
// Lanas Zimmer: hellblau gestrichen, Flecken, wo früher etwas hing
function lanaWall(u,v,x,y,dim){ var f=fbm(u*0.04,v*0.05), c=f>0.6?P.b3:(f>0.3?P.b4:P.b4); if (bayer(x,y)<(f-0.5)*0.6) c=P.b3; if (v>77) c=(v>79)?P.w1:P.w3; for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
// Parkett im Fischgrät, abgenutzt
function parquet(f,x,y){ if (!f) return P.k1; var X=f.X, Z=f.Z*1.3, a=Math.floor((X+Z)/6), b=Math.floor((X-Z)/6), even=((a+b)&1)===0, u=even?(X+Z):(X-Z), fr=((u/6)%1+1)%1;
  var c=even?P.w3:P.w2; if (fr<0.1) c=P.w1; var h=hash(a,b); if (h<0.12) c=P.w2; else if (h>0.94) c=P.w4; var g=fbm(X*0.04,Z*0.06); if (g>0.64 && bayer(x,y)<(g-0.64)*4) c=M.UP[c]; return c; }
function ceilW(xb,d,x,y){ var f=fbm(xb*0.02,d*0.06); return (f>0.62 && bayer(x,y)<(f-0.62)*3)?P.s4:P.s5; }

// ---------------------------------------------------------------- Ausblick (aus dem 9. Stock): Türme, Tal, Hügel
function viewAt(x,y,tod,weather,x0,y0,w,h){ var u=(x-x0)/w, v=(y-y0)/h, c;
  // Himmel
  var skyR=tod==='dawn'?R('v1 v2 d2 d3 d4'):(weather==='calm'?R('b1 b2 b3 b4 b5'):R('m3 m4 s4 s5'));
  c=ra(skyR,0.2+v*0.75,x,y);
  // Hügel gegenüber (Trebević), mit Schnee bei Kälte
  var hy=0.42+Math.sin(u*5.1+x0*0.01)*0.06+Math.sin(u*13+1)*0.02;
  if (v>hy){ var hc=tod==='dawn'?R('v0 v1 v2'):(weather==='calm'?R('g1 g2 m2 s3'):R('m2 m3 s4')); c=ra(hc,0.6-(v-hy)*0.8,x,y); if ((weather==='calm'||weather==='snow') && v<hy+0.04) c=P.s5; }
  // Türme in der Ferne und nah
  var t1=[[0.06,0.2,0.18],[0.28,0.42,0.3],[0.58,0.7,0.12],[0.8,0.96,0.24]];
  t1.forEach(function(t,i){ if (u>t[0]&&u<t[1]&&v>t[2]){ var near=(i===1||i===3), cc=near?((u-t[0])/(t[1]-t[0])<0.15?P.s4:P.s3):P.s4; var fl=Math.floor((v-t[2])*h/3), bu=Math.floor((u-t[0])*w/3); if ((Math.floor((v-t[2])*h)%3)===1 && (bu%2===0)) cc=P.s1; if (tod==='dawn' && (Math.floor((v-t[2])*h)%3)===1 && hash(bu+i*7,fl)<0.25) cc=P.y3;
      if (weather==='fog') cc=M.mix(cc,P.s4,near?3:5); c=cc; } });
  // Dächer und Bäume unten im Tal
  if (v>0.82){ c=(hash(x>>1,y)<0.5)?P.s2:P.t2; if (weather==='fog') c=M.mix(c,P.s4,4); if (weather==='snow'||weather==='calm'){ if (hash(x,y)<0.3) c=P.s5; } }
  if (weather==='fog' && v<0.82) c=M.mix(c,P.s4,v>0.4?3:4);
  return c; }
// Balkonbrüstung vor dem Ausblick (Beton), Blumentöpfe, ein Wäscheständer
function balconyAt(x,y,c,y0,h){ var v=(y-y0)/h; if (v<0.72) return c; if (v<0.74) return P.s5; var cc=(hash(x>>1,y)<0.3)?P.s2:P.s3; if (((x+3)%17)<5 && v<0.8) cc=((x+3)%17<2)?P.t2:P.t3; if (((x+3)%17)<5 && v<0.76) cc=P.g3; return cc; }

// ---------------------------------------------------------------- Wohnzimmer
function paintLiving(b,S,tod,weather,glass){ var x, y;
  var lb={w:W,h:H,px:function(x,y,c){ if (x>=CUT.x1||x<0) return; b.px(x,y,c); }};
  M.box(lb,{vp:VPL,rect:RL,
    back:function(u,v,x,y){ return rollerWall(u+RL[0],v+RL[1],x,y,0); },
    side:function(u,v,x,y,sd){ return rollerWall(u*1.5+(sd==='L'?0:400),v+RL[1],x,y,sd==='R'?1:0); },
    floor:function(xb,d,x,y){ return parquet(R3L.floor(x,y),x,y); }, ceil:ceilW });
  // Teppich unter dem Tisch
  var rq=[R3L.p(92,102,22),R3L.p(172,102,22),R3L.p(172,102,62),R3L.p(92,102,62)];
  b.poly(rq,function(x,y){ var f=R3L.floor(x,y); if (!f) return P.r1; var u=(f.X-92)/80, v=(f.Z-22)/40, e=Math.min(u,1-u,v,1-v); if (e<0.04) return P.y2; if (e<0.1) return ((Math.floor(f.X/3)+Math.floor(f.Z/2))&1)?P.r1:P.b0; var md=Math.abs(u-0.5)*2+Math.abs(v-0.5)*2; if (md<0.4) return md<0.2?P.y2:P.b0; return (((Math.floor(f.X/4)+Math.floor(f.Z/3))%3)===0)?P.r1:P.r2; });
  // gepolsterte Wohnungstür (Kunstleder mit Ziernägeln), Spion, Garderobe
  var d=ADOOR; b.rect(d.x0-2,d.y0-2,d.x1-d.x0+4,102-d.y0+2,P.w1); b.hl(d.x0-2,d.x1+1,d.y0-2,P.w3);
  for (y=d.y0;y<102;y++) for (x=d.x0;x<d.x1;x++){ var qu=(x-d.x0)%8, qv=(y-d.y0)%9, c=P.w2; if (qu===0||qv===0) c=P.w1; else if (qu<3&&qv<3) c=P.w3; b.px(x,y,c); if (qu===0&&qv===0) b.px(x,y,P.y3); }
  b.rect(d.x1-5,d.y0+30,3,2,P.y3); b.px(d.x1-6,d.y0+33,P.k1); b.px(((d.x0+d.x1)>>1),d.y0+18,P.k1); b.px(((d.x0+d.x1)>>1),d.y0+17,P.m3);
  b.vl(54,40,46,P.w1); b.px(54,39,P.y3); b.poly([[51,46],[58,46],[60,74],[49,74]],function(x,y){ return (x<53)?P.c2:P.c1; }); b.hl(51,58,46,P.c3); b.rect(50,74,2,4,P.k2);   // Nadas Mantel am Haken
  // Küchenzeile: Unterschränke, Arbeitsplatte, Spüle, Herd mit Džezva, Fliesen, Oberschränke
  var K=KIT; for (y=46;y<K.top;y++) for (x=K.x0;x<K.x1;x++){ var tu=(x-K.x0)%6, tv=(y-46)%6, tc=(tu===0||tv===0)?P.s3:P.s5; if (((Math.floor((x-K.x0)/6)+Math.floor((y-46)/6))%5)===0 && tu>1 && tv>1) tc=(tu===3&&tv===3)?P.t3:P.s4; b.px(x,y,tc); }
  b.rect(K.x0,24,K.x1-K.x0,22,P.s5); for (x=K.x0;x<K.x1;x+=19){ b.vl(x,24,45,P.s3); b.px(x+16,36,P.m2); } b.hl(K.x0,K.x1-1,45,P.s3); b.hl(K.x0,K.x1-1,24,P.s6);
  b.rect(K.x0,K.top,K.x1-K.x0,3,P.s4); b.hl(K.x0,K.x1-1,K.top,P.s6); b.rect(K.x0,K.top+3,K.x1-K.x0,102-K.top-3,P.s5); for (x=K.x0;x<K.x1;x+=15){ b.vl(x,K.top+3,101,P.s3); b.rect(x+6,K.top+6,4,1,P.m2); } b.hl(K.x0,K.x1-1,100,P.s2);
  b.rect(K.x0+4,K.top-1,16,2,P.m3); b.hl(K.x0+5,K.x0+18,K.top-1,P.m4); b.vl(K.x0+11,K.top-8,K.top-2,P.m3); b.hl(K.x0+11,K.x0+15,K.top-8,P.m3);   // Spüle, Wasserhahn
  b.rect(K.x1-24,K.top-2,20,2,P.k2); b.ellipse(K.x1-19,K.top-2,3,1,P.m1); b.ellipse(K.x1-9,K.top-2,3,1,P.m1); b.rect(K.x1-23,K.top+4,18,10,P.s4); b.rect(K.x1-21,K.top+6,14,6,P.k2); b.hl(K.x1-22,K.x1-7,K.top+4,P.s6);   // Herd
  b.rect(K.x1-12,K.top-7,5,5,P.y2); b.hl(K.x1-12,K.x1-8,K.top-7,P.y4); b.line(K.x1-7,K.top-5,K.x1-2,K.top-7,P.w1); CACHE.dz=[K.x1-10,K.top-8];   // Džezva
  b.rect(K.x0+26,K.top-6,8,6,P.s6); b.hl(K.x0+26,K.x0+33,K.top-6,P.s5); b.rect(K.x0+36,K.top-4,4,4,P.r3); b.rect(K.x0+42,K.top-9,3,9,P.g3);   // Brotkasten, Tasse, Flasche
  // Wanduhr, Kalender
  b.ellipse(CLOCK.x,CLOCK.y,6,6,P.w2); b.ellipse(CLOCK.x,CLOCK.y,5,5,P.s6); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(rd(CLOCK.x-0.5+Math.cos(a)*4),rd(CLOCK.y-0.5+Math.sin(a)*4),P.m1); }
  var C=CAL; b.rect(C.x0,C.y0,C.x1-C.x0,C.y1-C.y0,P.s6); b.rect(C.x0,C.y0,C.x1-C.x0,7,P.b2); b.ellipse((C.x0+C.x1)/2,C.y0+3,3,2,P.g4); for (y=C.y0+9;y<C.y1-1;y+=2) for (x=C.x0+1;x<C.x1-1;x+=2) b.px(x,y,(x===C.x0+7&&y===C.y0+13)?P.r3:P.m2); b.px((C.x0+C.x1)>>1,C.y0-1,P.m2); M.microText(b,'XI',C.x0+1,C.y1-6,P.r2);
  // Balkontür und Fenster: Holzrahmen, Glas mit dem Ausblick, Vorhänge
  var BA=BAL, WL=WINL; b.rect(BA.x0-2,BA.y0-2,WL.x1-BA.x0+4,102-BA.y0+2,P.s5);
  for (y=BA.y0;y<100;y++) for (x=BA.x0;x<BA.x1;x++){ if (y<BA.y0+44){ b.px(x,y,balconyAt(x,y,viewAt(x,y,tod,weather,BA.x0,BA.y0,WL.x1-BA.x0,46),BA.y0,46)); glass[y*W+x]=1; } else b.px(x,y,(y===BA.y0+44||x===BA.x0)?P.s4:P.s5); }
  for (y=WL.y0;y<WL.y1;y++) for (x=WL.x0;x<WL.x1;x++){ b.px(x,y,balconyAt(x,y,viewAt(x,y,tod,weather,BA.x0,BA.y0,WL.x1-BA.x0,46),BA.y0,46)); glass[y*W+x]=1; }
  b.vl(BA.x1,BA.y0,101,P.s4); b.vl(BA.x1+1,BA.y0,101,P.s3); b.vl((WL.x0+WL.x1)>>1,WL.y0,WL.y1,P.s5); b.hl(WL.x0,WL.x1-1,WL.y0+14,P.s5); b.hl(BA.x0,BA.x1-1,BA.y0+14,P.s5);
  b.hl(WL.x0-2,WL.x1+1,WL.y1,P.s6); b.hl(WL.x0-2,WL.x1+1,WL.y1+1,P.s3); b.rect(BA.x1-4,BA.y0+46,2,4,P.y3);
  CACHE.winL=[BA.x0,BA.y0,WL.x1-BA.x0,46];
  // Vorhänge (Tüll und Übergardinen), Stange
  b.hl(BA.x0-6,WL.x1+6,BA.y0-4,P.y2); for (y=BA.y0-3;y<96;y++){ for (x=BA.x0-6;x<BA.x0+1;x++) b.px(x,y,((x+((y>>2)&1))%3===0)?P.r1:P.r2); for (x=WL.x1-1;x<WL.x1+6;x++) b.px(x,y,((x+((y>>2)&1))%3===0)?P.r1:P.r2); }
  for (y=BA.y0;y<WL.y1;y++) for (x=WL.x0;x<WL.x0+5;x++) if (bayer(x,y)<0.5) b.px(x,y,P.s6);
  // Heizkörper unter dem Fenster
  var RD=RADL; for (y=RD.y0;y<RD.y1;y++) for (x=RD.x0;x<RD.x1;x++){ var fu=(x-RD.x0)%3; b.px(x,y,fu===0?P.s3:(fu===1?P.s6:P.s5)); } b.hl(RD.x0,RD.x1-1,RD.y0,P.s6); b.rect(RD.x1,RD.y0+2,2,3,P.y2); b.rect(RD.x0+4,RD.y0-2,8,2,P.s6);
  // Anrichte mit Fernseher auf Häkeldeckchen, Fotos, Vase
  var SD=SIDE; R3L.box(b,SD.X0,SD.X1,SD.Y0,102,SD.Z0,SD.Z1,{top:P.w3,left:P.w2,front:function(x,y){ var q=R3L.p(SD.X0,SD.Y0,SD.Z1), z=R3L.p(SD.X1,102,SD.Z1), lx=(x-q[0])/(z[0]-q[0]), ly=(y-q[1])/(z[1]-q[1]); if (ly<0.08) return P.w4; if (Math.abs(lx-0.5)<0.02) return P.w1; if (ly>0.3&&ly<0.36&&(Math.abs(lx-0.3)<0.04||Math.abs(lx-0.7)<0.04)) return P.y3; return (((x+y)%9)===0)?P.w2:P.w3; }});
  var tp=R3L.p(SD.X0+4,SD.Y0,SD.Z0+5), tx=rd(tp[0]), ty=rd(tp[1]);
  for (x=tx-2;x<tx+22;x++){ if (hash(x,1)<0.8) b.px(x,ty,P.s6); if ((x%2)===0) b.px(x,ty+1,P.s5); }
  b.rect(tx+1,ty-16,18,16,P.m1); b.rect(tx+3,ty-14,13,11,P.k2); b.rect(tx+4,ty-13,11,9,P.n0); b.px(tx+5,ty-12,P.n2); b.rect(tx+17,ty-12,1,6,P.m2); b.px(tx+17,ty-4,P.r3); b.line(tx+8,ty-16,tx+3,ty-26,P.m2); b.line(tx+11,ty-16,tx+17,ty-25,P.m2);
  CACHE.tv=[tx+3,ty-14,13,11];
  // Fotos: auf der Anrichte und darüber an der Wand (das Mädchen mit Zopf, etwa fünfzehn, lachend)
  var ph=[R3L.p(SD.X1-8,SD.Y0,SD.Z0+4)]; var px=rd(ph[0][0]), py=rd(ph[0][1]); b.rect(px-4,py-11,9,11,P.y2); b.rect(px-3,py-10,7,9,P.s4); girlPhoto(b,px-3,py-10,7,9); b.vl(px+5,py-8,py-1,P.w1); CACHE.photo=[px-5,py-12,11,13];
  b.rect(204,40,12,15,P.w1); b.rect(205,41,10,13,P.s4); girlPhoto(b,205,41,10,13); b.rect(218,44,10,12,P.y2); b.rect(219,45,8,10,P.s3); b.rect(220,47,6,7,P.s2); b.px(222,48,P.p3); b.px(223,48,P.p3);
  b.rect(SD.X0+2,SD.Y0-10,4,6,P.b2); b.line(SD.X0+4,SD.Y0-10,SD.X0+2,SD.Y0-16,P.g3); b.line(SD.X0+4,SD.Y0-10,SD.X0+7,SD.Y0-15,P.g3); b.px(SD.X0+2,SD.Y0-17,P.r3); b.px(SD.X0+7,SD.Y0-16,P.y4);
  // rechte Wand (Trennwand) mit Lanas Tür
  var dq=M.wallQuad(SPL,'R',LDOOR.u0,LDOOR.u1,LDOOR.v0,LDOOR.v1), fq=M.wallQuad(SPL,'R',LDOOR.u0-2,LDOOR.u1+2,LDOOR.v0-3,LDOOR.v1);
  b.poly(fq,P.s5);
  if (S.lanaOpen){ b.poly(dq,function(x,y){ var w=wallUV(SPL,'R',x,y); if (!w) return P.k1; var lv=(w.v-LDOOR.v0)/(LDOOR.v1-LDOOR.v0); return lv>0.85?P.w1:(lv>0.55?P.b2:P.b3); });
    var leaf=M.wallQuad(SPL,'R',LDOOR.u1-6,LDOOR.u1,LDOOR.v0,LDOOR.v1); b.poly(leaf,P.w3); }
  else b.poly(dq,function(x,y){ var w=wallUV(SPL,'R',x,y); if (!w) return P.w3; var lu=(w.u-LDOOR.u0)/(LDOOR.u1-LDOOR.u0), lv=(w.v-LDOOR.v0)/(LDOOR.v1-LDOOR.v0), c=P.s5; if ((lv>0.06&&lv<0.46||lv>0.54&&lv<0.94) && lu>0.14 && lu<0.86) c=(lu<0.2||lv<0.1||(lv>0.54&&lv<0.58))?P.s3:P.s6; return c; });
  var kh=M.wallPt(SPL,'R',LDOOR.u0+3,70), kk=M.wallPt(SPL,'R',LDOOR.u0+3,74); b.rect(rd(kh[0]),rd(kh[1]),3,2,P.y3); b.px(rd(kk[0]),rd(kk[1]),P.k1); b.px(rd(kk[0]),rd(kk[1])+1,P.k1); CACHE.keyhole=[rd(kk[0]),rd(kk[1])];
  // Deckenleuchte (Glasschale an drei Ketten)
  var lp=R3L.p(110,RL[1],36); b.vl(rd(lp[0]),rd(lp[1]),rd(lp[1])+8,P.m2); b.ellipse(rd(lp[0]),rd(lp[1])+11,8,3,P.s6); b.hl(rd(lp[0])-7,rd(lp[0])+7,rd(lp[1])+12,P.s4); CACHE.lampL=[rd(lp[0]),rd(lp[1])+11]; }
function girlPhoto(b,x,y,w,h){ b.rect(x,y,w,h,P.b3); b.rect(x,y+h-3,w,3,P.g3);
  var cx=x+(w>>1); b.ellipse(cx,y+3.5,2,2.2,P.p4); b.px(cx-2,y+2,P.h2); b.px(cx-1,y+1,P.h2); b.px(cx,y+1,P.h2); b.px(cx+1,y+1,P.h2); b.vl(cx+2,y+3,y+h-3,P.h2);   // Zopf
  b.px(cx-1,y+4,P.r3); b.px(cx,y+4,P.r3); b.rect(cx-2,y+6,5,h-7,P.r3); b.px(cx-1,y+3,P.k1); b.px(cx+1,y+3,P.k1); }

// ---------------------------------------------------------------- Lanas Zimmer
function poster1(b,x,y){ // Konzertplakat (erfunden): die Band PLAVI TRAMVAJ, 1991
  b.rect(x,y,20,27,P.k1); for (var i=0;i<20;i++) b.px(x+i,y+15+Math.round(Math.sin(i*0.7)*2),P.b2); b.ellipse(x+10,y+12,4,4,P.y4); b.px(x+9,y+11,P.y5);
  M.microText(b,'PLAVI',x+1,y+1,P.s6); M.microText(b,'91',x+12,y+20,P.y4); b.rect(x+2,y+20,8,5,P.r3); b.hl(x+2,x+9,y+22,P.s6); }
function poster2(b,x,y){ // Filmplakat (erfunden): OBALA – ein Gesicht im Profil vor dem Abendmeer
  b.rect(x,y,21,24,P.d3); for (var yy=y;yy<y+24;yy++) for (var xx=x;xx<x+21;xx++) if (yy>y+11) b.px(xx,yy,(yy>y+15)?P.a2:P.d5);
  b.ellipse(x+7,y+8,3,4,P.k2); b.px(x+10,y+8,P.k2); b.ellipse(x+15,y+5,2,2,P.y4); b.rect(x,y+18,21,6,P.k1); M.microText(b,'OBALA',x+1,y+19,P.s6); }
function paintLana(b,S,tod,weather,glass){ var x, y, open=!!S.lanaOpen;
  var rb={w:W,h:H,px:function(x,y,c){ if (x<CUT.x0) return; b.px(x,y,c); }};
  M.box(rb,{vp:VPR,rect:RRm,
    back:function(u,v,x,y){ return lanaWall(u+RRm[0],v+RRm[1],x,y,0); },
    side:function(u,v,x,y,sd){ return lanaWall(u*1.4+(sd==='L'?0:300),v+RRm[1],x,y,sd==='L'?1:0); },
    floor:function(xb,d,x,y){ return parquet(R3R.floor(x,y),x,y); }, ceil:ceilW });
  // kleiner Teppich am Bett
  b.poly([R3R.p(366,102,20),R3R.p(394,102,20),R3R.p(394,102,40),R3R.p(366,102,40)],function(x,y){ return ((x+y)%5===0)?P.v3:P.v2; });
  // Plakate, Fenster mit Vorhängen, Zeichnungen, Postkarte
  poster1(b,POST.x0,POST.y0); poster2(b,POST.x0+22,POST.y0+3); b.px(POST.x0+10,POST.y0,P.m3); b.px(POST.x0+32,POST.y0+3,P.m3);
  // Stundenplan, ein Wimpel
  b.rect(POST.x0+2,POST.y0+30,12,10,P.s6); for (y=POST.y0+32;y<POST.y0+40;y+=2) b.hl(POST.x0+3,POST.x0+12,y,P.b2);
  b.poly([[POST.x0+18,POST.y0+30],[POST.x0+31,POST.y0+33],[POST.x0+18,POST.y0+36]],P.r3); b.vl(POST.x0+18,POST.y0+29,POST.y0+37,P.w1);
  var WR=WINR; b.rect(WR.x0-2,WR.y0-2,WR.x1-WR.x0+4,WR.y1-WR.y0+4,P.s5);
  for (y=WR.y0;y<WR.y1;y++) for (x=WR.x0;x<WR.x1;x++){ b.px(x,y,viewAt(x+40,y,tod,weather,WR.x0+40,WR.y0,WR.x1-WR.x0,WR.y1-WR.y0)); glass[y*W+x]=1; }
  b.vl((WR.x0+WR.x1)>>1,WR.y0,WR.y1-1,P.s5); b.hl(WR.x0,WR.x1-1,WR.y0+12,P.s5); b.hl(WR.x0-3,WR.x1+2,WR.y1+1,P.s6); b.hl(WR.x0-3,WR.x1+2,WR.y1+2,P.s3);
  CACHE.winR=[WR.x0,WR.y0,WR.x1-WR.x0,WR.y1-WR.y0];
  b.hl(WR.x0-6,WR.x1+6,WR.y0-5,P.y2);
  if (!open){ for (y=WR.y0-4;y<WR.y1+8;y++) for (x=WR.x0-5;x<WR.x1+5;x++){ var fold=((x+((y>>3)&1))%4), c=fold===0?P.v1:(fold===1?P.v3:P.v2); if (y>WR.y1+5) c=P.v1; b.px(x,y,c); glass[y*W+x]=0; } }
  else { for (y=WR.y0-4;y<WR.y1+8;y++){ for (x=WR.x0-6;x<WR.x0;x++) b.px(x,y,((x+((y>>3)&1))%3===0)?P.v1:P.v2); for (x=WR.x1;x<WR.x1+6;x++) b.px(x,y,((x+((y>>3)&1))%3===0)?P.v1:P.v2); } }
  var D=DRAW; [[D.x0,D.y0,12,10,'tram'],[D.x0+14,D.y0+2,10,12,'face'],[D.x0+2,D.y0+13,11,10,'face'],[D.x0+15,D.y0+16,13,9,'tram']].forEach(function(d,i){ drawingL(b,d[0],d[1],d[2],d[3],d[4],i); });
  b.rect(CARD.x,CARD.y,10,7,P.a4); b.rect(CARD.x,CARD.y+4,10,3,P.e4); b.px(CARD.x+3,CARD.y+1,P.y4); b.vl(CARD.x+7,CARD.y+2,CARD.y+4,P.w1); b.px(CARD.x+6,CARD.y+1,P.g3); b.px(CARD.x+8,CARD.y+1,P.g3); b.px(CARD.x+7,CARD.y+1,P.g4); b.px(CARD.x+5,CARD.y-1,P.r3); CACHE.card=[CARD.x-1,CARD.y-2,12,10];
  // Kleiderschrank (rechts hinten), Schreibtisch mit Stuhl, Stiftedose, Zeichenblock, Lampe
  var WD=WARD; R3R.box(b,WD.X0,WD.X1,WD.Y0,102,WD.Z0,WD.Z1,{left:P.w1,front:function(x,y){ var q=R3R.p(WD.X0,WD.Y0,WD.Z1), z=R3R.p(WD.X1,102,WD.Z1), lx=(x-q[0])/(z[0]-q[0]), ly=(y-q[1])/(z[1]-q[1]); if (Math.abs(lx-0.5)<0.03) return P.w0; if (ly<0.04||ly>0.94) return P.w1; if (Math.abs(ly-0.5)<0.04 && (Math.abs(lx-0.42)<0.05||Math.abs(lx-0.58)<0.05)) return P.y3; return ((x%5)===0)?P.w2:P.w3; }});
  var sk=R3R.p(WD.X0+4,WD.Y0-1,WD.Z1-4); b.rect(rd(sk[0]),rd(sk[1])-5,10,5,P.e3); b.hl(rd(sk[0]),rd(sk[0])+9,rd(sk[1])-5,P.e4);   // Koffer oben drauf
  var DK=DESK; R3R.box(b,DK.X0,DK.X1,DK.Y0,102,DK.Z0,DK.Z1,{top:P.w4,left:P.w2,front:function(x,y){ var q=R3R.p(DK.X0,DK.Y0,DK.Z1), z=R3R.p(DK.X1,102,DK.Z1), lx=(x-q[0])/(z[0]-q[0]), ly=(y-q[1])/(z[1]-q[1]); if (ly<0.1) return P.w4; if (lx>0.62 && ly<0.4) return (Math.abs(ly-0.24)<0.05&&Math.abs(lx-0.8)<0.05)?P.y3:P.w3; if (lx>0.3 && lx<0.62 && ly>0.15) return P.k1; return P.w2; }});
  var dt=R3R.p(DK.X0+4,DK.Y0,DK.Z0+6), dx=rd(dt[0]), dy=rd(dt[1]); b.poly([[dx,dy],[dx+12,dy-1],[dx+14,dy+2],[dx+2,dy+3]],P.s6); b.line(dx+3,dy+1,dx+10,dy,P.m2); CACHE.pad=[dx,dy-1];   // Zeichenblock
  b.rect(dx+16,dy-5,4,5,P.m3); b.hl(dx+16,dx+19,dy-5,P.m4); b.line(dx+17,dy-5,dx+16,dy-9,P.r3); b.line(dx+18,dy-5,dx+19,dy-10,P.b2); b.line(dx+19,dy-5,dx+21,dy-8,P.y3); CACHE.tin=[dx+16,dy-5];   // Blechdose mit Stiften
  b.vl(dx+24,dy-12,dy-1,P.m1); b.line(dx+24,dy-12,dx+20,dy-16,P.m1); b.poly([[dx+16,dy-16],[dx+22,dy-18],[dx+21,dy-14]],P.g3);   // Schreibtischlampe
  var ch=R3R.p(DK.X0+12,102,DK.Z1+10); b.rect(rd(ch[0])-5,rd(ch[1])-14,11,2,P.w3); b.vl(rd(ch[0])-5,rd(ch[1])-12,rd(ch[1]),P.w1); b.vl(rd(ch[0])+5,rd(ch[1])-12,rd(ch[1]),P.w1); b.rect(rd(ch[0])+4,rd(ch[1])-28,2,14,P.w2); CACHE.chairR=[rd(ch[0]),rd(ch[1])];
  // Bett an der linken Wand: Kopfteil, Matratze, Tagesdecke mit Muster, Kissen, ein Teddy
  var BD=BED; R3R.box(b,BD.X0,BD.X1,BD.Y0,102,BD.Z0,BD.Z1,{top:function(x,y){ var f=R3R.floor(x,y+(102-BD.Y0)*1.3); var c=((x+y)%6<3)?P.r2:P.r3; if (((x-y)%8+8)%8===0) c=P.y2; return c; },front:function(x,y){ return (y%3===0)?P.r1:P.r2; },right:function(x,y){ return ((x+y)%4===0)?P.r1:P.r2; }});
  var hb=R3R.p(BD.X0,BD.Y0-12,BD.Z0), hb2=R3R.p(BD.X1,BD.Y0,BD.Z0); b.rect(rd(hb[0]),rd(hb[1]),rd(hb2[0]-hb[0]),rd(hb2[1]-hb[1]),P.w2); b.hl(rd(hb[0]),rd(hb2[0]),rd(hb[1]),P.w4);
  var pl=R3R.p(BD.X0+3,BD.Y0,BD.Z0+5); b.ellipse(pl[0]+7,pl[1],8,2.6,P.s6); b.hl(rd(pl[0])+1,rd(pl[0])+13,rd(pl[1])+2,P.s4);
  var td=R3R.p(BD.X1-6,BD.Y0,BD.Z0+12); b.ellipse(td[0],td[1]-3,3,3,P.w4); b.ellipse(td[0],td[1]-7,2.2,2.2,P.w4); b.px(rd(td[0])-2,rd(td[1])-9,P.w3); b.px(rd(td[0])+2,rd(td[1])-9,P.w3); b.px(rd(td[0])-1,rd(td[1])-7,P.k1);
  // die Tür von Lanas Seite (Öffnung in der linken Wand)
  var dq=M.wallQuad(SPR,'L',LDOOR_R.u0,LDOOR_R.u1,LDOOR.v0,102); b.poly(M.wallQuad(SPR,'L',LDOOR_R.u0-1.5,LDOOR_R.u1+1.5,LDOOR.v0-3,102),P.s5);
  if (open){ b.poly(dq,function(x,y){ var w=wallUV(SPR,'L',x,y); if (!w) return P.e3; return (w.v>94)?P.w2:P.e4; }); var lf=M.wallQuad(SPR,'L',LDOOR_R.u0-11,LDOOR_R.u0-1,LDOOR.v0,102); b.poly(lf,function(x,y){ return (x%4===0)?P.s4:P.s6; }); }
  else b.poly(dq,function(x,y){ var w=wallUV(SPR,'L',x,y); if (!w) return P.s5; var lu=(w.u-LDOOR_R.u0)/(LDOOR_R.u1-LDOOR_R.u0), lv=(w.v-LDOOR.v0)/(102-LDOOR.v0); return (lu>0.15&&lu<0.85&&(lv>0.06&&lv<0.46||lv>0.54&&lv<0.94))?P.s6:P.s5; });
  // Staub auf allem: feine helle Punkte
  for (var i=0;i<160;i++){ var sx=CUT.x1+Math.floor(hash(i,91)*(W-CUT.x1)), sy=30+Math.floor(hash(i,92)*100); var c0=b.get(sx,sy); if (c0!==T) b.px(sx,sy,M.UP[c0]); } }
function drawingL(b,x,y,w,h,kind,i){ b.rect(x,y,w,h,P.s6); b.hl(x,x+w-1,y+h-1,P.s4); if (i%2) b.px(x+w-1,y,P.s4);
  if (kind==='tram'){ b.rect(x+1,y+h-6,w-2,4,P.r3); for (var k=0;k<3;k++) b.px(x+2+k*3,y+h-5,P.b3); b.line(x+w/2,y+h-7,x+w/2+1,y+1,P.k2); b.hl(x,x+w-1,y+1,P.k2); M.microText(b,'3',x+w-4,y+2,P.k1); }
  else { var cx=x+(w>>1), cy=y+(h>>1); b.ellipse(cx,cy,3,4,undefined); for (var a=0;a<14;a++){ var an=a/14*Math.PI*2; b.px(rd(cx+Math.cos(an)*3),rd(cy+Math.sin(an)*4),P.k2); } b.px(cx-1,cy-1,P.k2); b.px(cx+1,cy-1,P.k2); b.hl(cx-1,cx+1,cy+2,P.r3); if (i===1){ b.line(cx-3,cy-4,cx-4,cy+3,P.h2); b.line(cx+3,cy-4,cx+4,cy+3,P.h2); } }
  b.px(x+(w>>1),y,P.r3); }

// ---------------------------------------------------------------- Bild
var DAWNIN=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.55+L*0.1+12, g*0.55+L*0.1+10, b*0.66+L*0.12+24]; });
var LAMPW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.75+L*0.2+20, g*0.62+L*0.16+10, b*0.4+L*0.06]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.66+L*0.15+16, g*0.6+L*0.13+10, b*0.52+L*0.09+12]; });
var DUSTY=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.42+L*0.18+10, g*0.38+L*0.16+12, b*0.46+L*0.18+22]; });
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), glass=new Uint8Array(W*H), x, y;
  paintLana(b,S,tod,weather,glass);
  paintLiving(b,S,tod,weather,glass);
  // Licht: tags durchs Fenster, im Morgengrauen dämmrig mit der warmen Deckenleuchte
  var notG=function(x,y){ return !glass[y*W+x]; };
  M.light(b,M.lf.sum(M.lf.pool(176,112,110,30,0.55),M.lf.pool(176,70,60,50,0.35),M.lf.pool(64,126,40,8,-0.6),M.lf.xband(0,30,-0.5,0)),0,0,function(x,y){ return x<CUT.x0 && notG(x,y); });
  if (S.lanaOpen) M.light(b,M.lf.sum(M.lf.pool(397,108,80,30,0.5),M.lf.pool(397,62,40,30,0.3)),0,0,function(x,y){ return x>=CUT.x1 && notG(x,y); });
  else { M.light(b,M.lf.sum(M.lf.k(-0.7),M.lf.pool(397,62,30,40,0.5)),0,0,function(x,y){ return x>=CUT.x1 && notG(x,y); }); for (y=0;y<H;y++) for (x=CUT.x1;x<W;x++){ var k=y*W+x; if (glass[k]) continue; b.d[k]=M.tintPx(DUSTY,b.d[k],x,y); } }
  if (tod==='dawn'){ var L=CACHE.lampL; for (y=0;y<H;y++) for (x=0;x<W;x++){ var k2=y*W+x; if (glass[k2]) continue; var d=Math.hypot((x-L[0])/130,(y-L[1]-30)/85), lv=(x<CUT.x0)?Math.max(0,1-d)*2.2:0, li=Math.floor(lv)+((lv%1)>bayer(x,y)?1:0); b.d[k2]=M.tintPx(li>=2?LAMPW:(li===1?MIDW:DAWNIN),b.d[k2],x,y); }
    b.ellipse(L[0],L[1],8,3,P.y4); b.ellipse(L[0],L[1]-1,5,1.6,P.y5); b.px(CACHE.tv[0]+4,CACHE.tv[1]+3,P.n3); }
  CACHE.glass=glass; return b; }

// ---------------------------------------------------------------- Ebenen: Tisch mit Stühlen, Schnitt durch die Trennwand
function layers(S,GS,tod){ var out=[], dawn=tod==='dawn';
  // Tisch mit Wachstuch (rot-weiß kariert) und zwei Stühlen: Nada sitzt links, rechts der leere Stuhl
  var T0=TABLE, tf=R3L.p(T0.X0,102,T0.Z1), L=M.layer(30,60,130,70,rd(tf[1])+1), w=M.lw(L), box3={poly:function(p,c){ w.poly(p,c); }};
  R3L.box(box3,T0.X0,T0.X1,T0.Y0,T0.Y0+3,T0.Z0,T0.Z1,{top:function(x,y){ var f=R3L.floor(x,y+((102-T0.Y0)*(y-VPL[1])/(102-VPL[1]))); return (((x>>2)+(y>>1))&1)?P.r3:P.s6; },front:function(x,y){ return ((x>>2)&1)?P.r2:P.s5; },right:P.r1});
  [[T0.X0+3,T0.Z1-3],[T0.X1-3,T0.Z1-3],[T0.X1-3,T0.Z0+3],[T0.X0+3,T0.Z0+3]].forEach(function(l){ var a=R3L.p(l[0],T0.Y0+3,l[1]), c=R3L.p(l[0],102,l[1]); w.vl(rd(a[0]),rd(a[1]),rd(c[1]),P.w1); });
  // Wachstuch hängt vorn über, Kaffeetasse, Zuckerdose, Brille
  var cp=R3L.p(T0.X0+12,T0.Y0,T0.Z0+12); w.rect(rd(cp[0]),rd(cp[1])-3,4,3,P.s6); w.px(rd(cp[0])+4,rd(cp[1])-2,P.s5); w.hl(rd(cp[0])-1,rd(cp[0])+4,rd(cp[1]),P.s4);
  var sp=R3L.p(T0.X1-12,T0.Y0,T0.Z0+8); w.rect(rd(sp[0]),rd(sp[1])-4,5,4,P.b3); w.hl(rd(sp[0]),rd(sp[0])+4,rd(sp[1])-4,P.b4);
  var gp=R3L.p(T0.X0+22,T0.Y0,T0.Z1-6); w.px(rd(gp[0]),rd(gp[1]),P.k1); w.px(rd(gp[0])+2,rd(gp[1]),P.k1); w.px(rd(gp[0])+1,rd(gp[1]),P.m2);
  // Stühle (Holz, Sitz mit Polster)
  var nx=NADA[0], ny=NADA[1]; w.rect(nx-6,ny-15,12,3,P.w3); w.hl(nx-6,nx+5,ny-15,P.w4); w.vl(nx-6,ny-12,ny,P.w1); w.vl(nx+4,ny-12,ny,P.w1); w.rect(nx-8,ny-34,2,22,P.w2); w.hl(nx-8,nx-7,ny-34,P.w4); w.rect(nx-8,ny-30,3,2,P.w3);
  var c2=R3L.p(T0.X1+8,102,(T0.Z0+T0.Z1)/2), cx=rd(c2[0]), cy=rd(c2[1]); w.rect(cx-5,cy-14,11,3,P.w3); w.hl(cx-5,cx+5,cy-14,P.w4); w.vl(cx-5,cy-11,cy,P.w1); w.vl(cx+4,cy-11,cy,P.w1); w.rect(cx+5,cy-32,2,21,P.w2); w.hl(cx+5,cx+6,cy-32,P.w4);
  if (dawn) M.tintApply(L,DAWNIN); out.push(L);
  // Schnitt durch die Trennwand und der Wandteil vor der Tür: Figuren gehen dahinter durch die Tür
  var front=M.wallQuad(SPL,'R',LDOOR.u1,90,RL[1]-20,102), base=rd(M.wallPt(SPL,'R',LDOOR.u1,102)[1])+1;
  var C=M.layer(240,0,CUT.x1-240+40,144,base), cw=M.lw(C), x, y;
  cw.poly(front,function(x,y){ if (x>=CUT.x0) return undefined; var q=wallUV(SPL,'R',x,y); if (!q) return P.e3; return rollerWall(q.u*1.5+400,q.v,x,y,1); });
  var rq=M.wallQuad(SPR,'L',LDOOR_R.u1,90,RRm[1]-20,102); cw.poly(rq,function(x,y){ if (x<CUT.x1) return undefined; var q=wallUV(SPR,'L',x,y); if (!q) return P.b3; var c=lanaWall(q.u*1.4,q.v,x,y,1); return S.lanaOpen?c:M.tintPx(DUSTY,c,x,y); });
  for (y=0;y<144;y++) for (x=CUT.x0;x<CUT.x1;x++){ var e=Math.min(x-CUT.x0,CUT.x1-1-x), c=(e===0)?P.s5:(e===1?P.s4:((fbm(x*0.4,y*0.2)>0.55)?P.s2:P.s3)); if (e>1 && hash(x,y)<0.08) c=P.s1; if (e>2 && ((y+3)%38)===0) c=P.m1; cw.px(x,y,c); }
  if (dawn) M.tintApply(C,DAWNIN); out.push(C);
  return out; }

// ---------------------------------------------------------------- Bewegung: Uhr, Vorhang, Schnee draußen, Staub bei Lana
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, weather=M.scn.weather(GS);
  function px(x,y,c){ var sx=x-cam; if (sx<0||sx>=fb.w||y<0||y>=144) return; fb.d[y*fb.w+sx]=c; }
  // Wanduhr: Stunden- und Minutenzeiger nach der Spielzeit, Sekundenzeiger tickt
  var sec=Math.floor(t)%60, mn=(10+Math.floor(t/60))%60, hr=8;
  var cx=CLOCK.x, cy=CLOCK.y; [[hr%12/12+mn/720,2.5,P.k1],[mn/60,3.5,P.k1],[sec/60,4,P.r3]].forEach(function(h){ var a=h[0]*Math.PI*2-Math.PI/2; for (var r=0;r<=h[1];r+=0.5) px(rd(cx+Math.cos(a)*r),rd(cy+Math.sin(a)*r),h[2]); });
  // Vorhang an der Balkontür bewegt sich im Luftzug
  var ba=BAL, sw=Math.sin(t*0.8)+Math.sin(t*1.9)*0.4; if (sw>0.6) for (var y=ba.y0+20;y<96;y+=1){ px(ba.x0+1,y,P.r1); if (y>70) px(ba.x0+2,y,P.r2); }
  // Schnee vor den Fenstern
  if (weather==='snow') [CACHE.winL,CACHE.winR].forEach(function(wr,j){ if (!wr) return; if (j===1 && !S.lanaOpen) return; for (var i=0;i<16;i++){ var sx=wr[0]+Math.floor((hash(i,j+3)*wr[2]+Math.sin(t+i)*3+wr[2])%wr[2]), sy=wr[1]+Math.floor((t*(6+hash(i,9)*6)+hash(i,j+7)*wr[3])%wr[3]); if (CACHE.glass && CACHE.glass[sy*W+sx]) px(sx,sy,P.s6); } });
  // Staub im Licht von Lanas Fenster
  if (S.lanaOpen) for (var i2=0;i2<10;i2++){ var ph=(hash(i2,1)+t*0.02*(0.5+hash(i2,2)))%1, dx=rd(WINR.x0+ph*60+Math.sin(t*0.4+i2)*4), dy=rd(WINR.y0+20+ph*60+Math.sin(t*0.3+i2*2)*3); if (Math.sin(t*1.3+i2)>0) px(dx,dy,P.s6); } }

// ---------------------------------------------------------------- Geistersicht: Lanas Zeichnungen leuchten; am Schreibtisch zeichnet ein Mädchen
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  function px(x,y,c){ var sx=x-cam; if (sx<0||sx>=fb.w||y<0||y>=144) return; fb.d[y*fb.w+sx]=c; }
  var D=DRAW, a=0.5+Math.sin(t*1.1)*0.3;
  for (var y=D.y0-3;y<D.y1+3;y++) for (var x=D.x0-3;x<D.x1+3;x++){ var inside=(x>=D.x0&&x<D.x1&&y>=D.y0&&y<D.y0+28); if (inside){ var sx=x-cam; if (sx<0||sx>=fb.w) continue; var c=fb.d[y*fb.w+sx]; if (bayer(x,y)<a) fb.d[y*fb.w+sx]=M.UP[M.UP[c]]; } else if (bayer(x,y+Math.floor(t*3))<0.25*a) px(x,y,P.x4); }
  [[D.x0+5,D.y0+5],[D.x0+19,D.y0+8],[D.x0+7,D.y0+18],[D.x0+21,D.y0+20]].forEach(function(p,i){ if (Math.sin(t*2+i)>0.2) px(p[0],p[1],P.x6); });
  if (!(GS.flags||{})['k2.f2.echoRoom']) return;
  // das Mädchen (Zopf, Pullover) sitzt auf dem Stuhl am Schreibtisch und zeichnet, nur als Umriss
  var ch=CACHE.chairR; if (!ch) return; var hx=ch[0]-1, hy=ch[1]-13, br=0.6+Math.sin(t*0.9)*0.2, cc=(br>0.65)?P.x5:P.x4, wv=Math.sin(t*3)>0.3?1:0;
  var pts=[[0,-16],[-2,-17],[-3,-19],[-2,-22],[1,-23],[3,-21],[3,-18],[2,-16],[4,-15],[5,-11],[4,-6],[4,0],[-3,0],[-4,2],[-7,3],[-7,13]];
  for (var k=0;k+1<pts.length;k++){ var p0=pts[k], p1=pts[k+1], n=Math.max(Math.abs(p1[0]-p0[0]),Math.abs(p1[1]-p0[1])); for (var q=0;q<=n;q++){ var X=rd(hx+p0[0]+(p1[0]-p0[0])*q/Math.max(1,n)), Y=rd(hy+p0[1]+(p1[1]-p0[1])*q/Math.max(1,n)); if (bayer(X,Y+Math.floor(t*2))<0.9) px(X,Y,cc); } }
  for (var z=0;z<7;z++) px(hx+3+Math.round(z*0.3),hy-17+z,P.x3);                       // Zopf
  px(hx+6,hy-9-wv,P.x6); px(hx+7,hy-8-wv,P.x5); px(hx+8,hy-8,P.x4);                     // Hand mit Stift über dem Block
  M.dust(fb,t*0.3,CUT.x1+10-cam,40,150,80,8,P.x3); }

// ---------------------------------------------------------------- Laufflächen
function inLiving(x,y){ if (y<112||y>140||x<10||x>290) return false; var f=R3L.floor(x,y); if (!f || f.X>RL[2]-3) return false; return true; }
function inLana(x,y){ if (y<112||y>140||x<310||x>470) return false; var f=R3R.floor(x,y); if (!f || f.X<RRm[0]+3 || f.X>RRm[2]-3) return false;
  if (f.X<BED.X1+3 && f.Z<BED.Z1+3) return false; if (f.X>DESK.X0-3 && f.Z<DESK.Z1+8) return false; return true; }
function inPassage(x,y){ var a=M.wallPt(SPL,'R',LDOOR.u0+3,102), c=M.wallPt(SPL,'R',LDOOR.u1-3,102); return x>=a[0]-4 && x<=330 && y>=a[1]+2 && y<=c[1]-1; }
function obstacles(x,y){ var f=R3L.floor(x,y); if (f && f.X>TABLE.X0-8 && f.X<TABLE.X1+14 && f.Z>TABLE.Z0-3 && f.Z<TABLE.Z1+3) return true; if (x>NADA[0]-10 && x<NADA[0]+8 && y<NADA[1]+3 && y>NADA[1]-8) return true; if (x<ADOOR.x0-2 && y<118) return true; return false; }
function walk(x,y,S,GS){ if (inLiving(x,y)) return !obstacles(x,y); if (S && S.lanaOpen && (inLana(x,y)||inPassage(x,y))) return true; return false; }
function walkG(x,y,S,GS){ return inLana(x,y)||inPassage(x,y); }
var spots={
  door:[ADOOR.x0-2,ADOOR.y0-2,ADOOR.x1-ADOOR.x0+4,102-ADOOR.y0+2],
  table:R3L.rect(TABLE.X0,TABLE.X1,TABLE.Y0,102,TABLE.Z0,TABLE.Z1),
  kitchen:[KIT.x0,24,KIT.x1-KIT.x0,78],
  radiator:[RADL.x0-1,RADL.y0-3,RADL.x1-RADL.x0+4,RADL.y1-RADL.y0+4],
  tv:null, sideboard:R3L.rect(SIDE.X0,SIDE.X1,SIDE.Y0,102,SIDE.Z0,SIDE.Z1), photo:null,
  calendar:[CAL.x0-1,CAL.y0-2,CAL.x1-CAL.x0+2,CAL.y1-CAL.y0+3],
  balcony:[BAL.x0-2,BAL.y0-2,BAL.x1-BAL.x0+4,102-BAL.y0+2],
  view:[WINL.x0,WINL.y0,WINL.x1-WINL.x0,WINL.y1-WINL.y0],
  lana_door:box(M.wallQuad(SPL,'R',LDOOR.u0-2,LDOOR.u1+2,LDOOR.v0-3,LDOOR.v1)),
  lana_bed:R3R.rect(BED.X0,BED.X1,BED.Y0-12,102,BED.Z0,BED.Z1),
  lana_desk:R3R.rect(DESK.X0,DESK.X1,DESK.Y0-18,102,DESK.Z0,DESK.Z1),
  drawings_l:[DRAW.x0-2,DRAW.y0-2,DRAW.x1-DRAW.x0+4,30],
  posters:[POST.x0-2,POST.y0-2,POST.x1-POST.x0+4,POST.y1-POST.y0+2],
  wardrobe_l:R3R.rect(WARD.X0,WARD.X1,WARD.Y0-6,102,WARD.Z0,WARD.Z1),
  lana_window:[WINR.x0-6,WINR.y0-6,WINR.x1-WINR.x0+12,WINR.y1-WINR.y0+14],
  postcard:[CARD.x-2,CARD.y-3,14,11]
};
var stands={
  door:[37,116,'B'], table:[176,124,'L'], kitchen:[90,114,'B'], radiator:[178,114,'B'], tv:[212,116,'B'], sideboard:[214,116,'B'], photo:[218,116,'B'], calendar:[128,114,'B'],
  balcony:[150,114,'B'], view:[176,114,'B'], lana_door:[248,118,'R'], lana_bed:[372,122,'L'], lana_desk:[424,124,'B'], drawings_l:[430,124,'B'], posters:[368,118,'B'],
  wardrobe_l:[452,126,'R'], lana_window:[398,118,'B'], postcard:[372,118,'L']
};
(function(){ var SD=SIDE, tp=R3L.p(SD.X0+4,SD.Y0,SD.Z0+5); spots.tv=[rd(tp[0])+1,rd(tp[1])-26,18,26]; var ph=R3L.p(SD.X1-8,SD.Y0,SD.Z0+4); spots.photo=[rd(ph[0])-6,rd(ph[1])-13,13,14]; })();
function actorLut(a,S,GS,tod){ if (a.ghost) return undefined; if (a.x>=CUT.x1 && !(S&&S.lanaOpen)) return DUSTY.a; if (tod==='dawn') return (a.x<CUT.x0?LAMPW:DAWNIN).a; return undefined; }
M.defineArt('stan',{
  width:W, paint:paint, layers:layers, walk:walk, walkG:walkG, dynamic:dyn, ghost:ghost, actorLut:actorLut, spots:spots, stands:stands,
  actorPos:{ nada:[NADA[0],NADA[1],'R'] },
  start:[40,122,'R'], entries:{ haustor:[40,122,'R'] }
});
})(M);
