/* ===== rooms/art/herberge.js — Herberge „Neretva“: Rezeption und Terrasse (400 px, scrollend) =====
   Links die kleine Rezeption im alten Steinhaus (aufgeschnitten): Holzbalkendecke, weiß gekalkte Bruchsteinwand, hinten
   links die Haustür mit Glasfeld, daneben die Holztreppe nach oben zu den Zimmern (Tür am Absatz), unter der Treppe ein
   Stapel Rucksäcke. Der Holztresen mit Tischglocke, Gästebuch und Laptop, dahinter das Schlüsselbrett, ein Prospektständer,
   eine Stadtkarte und das Schild „HOSTEL NERETVA · free wifi“. Rechts durch den Bogen die Terrasse über dem Fluss:
   Holzboden, Geländer, eine Pergola mit kahlem Weinstock und einer Lichterkette, zwei Tische mit Plastikstühlen (Markos
   Tisch; der Tisch der Australier). Hinter dem Geländer tief unten die grüne Neretva, drüben das Westufer, in der Ferne
   rechts die Alte Brücke klein im Profil (ein Bogen). S.aussies: Flaschen, Rucksäcke und die drei Stühle besetzt;
   S.candles: Kerzen in Gläsern. Nachts leuchten die Lichterkette, die Rezeption und die angestrahlte Brücke. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=400, H=144, FY=104;
// ---------------------------------------------------------------- Geometrie
var REC={x0:0,x1:166,ceil:16};                          // Rezeption: Rückwand bis zur Hausecke, Decke
var CORNER={x0:164,x1:178,arch:40};                     // Hausecke mit Bogen zur Terrasse
var DOOR={x:6,y:46,w:22,h:58};                          // Haustür (hinten links)
var STAIR={x0:30,x1:80,top:42};                         // Treppe: unten rechts (x1,FY), oben links (x0,top)
var UPDOOR={x:30,y:14,w:16,h:28};                       // Zimmertür am oberen Absatz
var DESK={x0:88,x1:156,top:86,base:110};                // Tresen
var KEYS={x0:96,x1:126,y0:46,y1:64};                    // Schlüsselbrett
var BROCH={x0:134,x1:154,y0:50,y1:78};                  // Prospektständer an der Wand
var BELL=[146,DESK.top-1], REG=[104,DESK.top-1], LAP=[124,DESK.top-1];
var TER={x0:178,x1:400};                                // Terrasse
var RAIL={top:84,base:106};                             // Geländer
var PERG={posts:[188,394],beam:20};                     // Pergola mit Weinstock
var TBL=[{x0:212,x1:242,top:107,base:124},{x0:326,x1:356,top:107,base:124}];   // Markos Tisch, Tisch der Australier
var BR={cx:362,sp:90,span:22,top:66};                   // Alte Brücke in der Ferne (Bogenmitte, Kämpferlinie, halbe Spannweite, Brüstung)
var MAJA_Y=106;
var AUS=[[318,124,'R'],[364,124,'L'],[341,115,'L']];    // aussie1, aussie2 (sitzend vorn), aussie3 (sitzend hinter dem Tisch, mit Gitarre)
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
function wetOf(GS,w){ return w==='rain' || (GS && GS.phase==='k3_pro_n'); }
function inside(x,y){ return x<CORNER.x0 && y<H; }

// ---------------------------------------------------------------- Licht: draußen Tageszeit, drinnen warme Lampe; nachts Lichterkette und Kerzen
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  gdawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.44+10, g*0.2+L*0.44+15, b*0.2+L*0.44+27]; },
  grey:function(r,g,b){ var L=lum(r,g,b); return [r*0.42+L*0.5+4, g*0.42+L*0.5+5, b*0.42+L*0.5+7]; },
  rain:function(r,g,b){ var L=lum(r,g,b); return [r*0.7+L*0.16+1, g*0.7+L*0.16+2, b*0.7+L*0.16+3]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,w){ if (tod==='day') return w==='grey'?'grey':null; if (tod==='night') return 'night'; if (tod==='dawn') return w==='grey'?'gdawn':'dawn'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod,S){ if (tod==='day') return []; var L=[[84,40,96,56,0.95],[84,112,100,26,0.6],[CORNER.x1+10,70,20,40,0.4]];   // Lampe der Rezeption
  for (var x=TER.x0+10;x<TER.x1;x+=36) L.push([x,34,26,22,0.42]);                                                       // Lichterkette
  L.push([300,118,120,18,0.3]);
  if (S.candles||S.aussies) TBL.forEach(function(t,i){ if (i===0 && !S.candles) return; L.push([(t.x0+t.x1)/2,t.top-2,22,16,0.7]); });
  return L; }

// ---------------------------------------------------------------- Masken
var SKYM=new Uint8Array(W*H), OUT=new Uint8Array(W*H), WINS=[];

// ---------------------------------------------------------------- Draußen: Himmel, Hum, Westufer, Fluss, die Alte Brücke klein
function paintSky(b,tod,w,GS){ var x, y, i, r=M.rng(5), x0=CORNER.x0;
  if (w==='grey' && tod==='dawn'){ var GD=R('k2 m0 m1 m2 m3'); for (y=0;y<96;y++) for (x=x0;x<W;x++) b.px(x,y,ra(GD,0.25+Math.pow(y/80,1.2)*0.6+(fbm(x*0.02,y*0.08,3)-0.5)*0.16,x,y)); return; }
  if (w==='rain'||w==='grey'){ M.scn.sky(b,x0,0,W-x0,96,tod,w,13); return; }
  if (tod==='day'){ var D=R('b0 b1 b2 b3 b4 b5'); for (y=0;y<96;y++) for (x=x0;x<W;x++) b.px(x,y,ra(D,(w==='bura'?0.05:0.15)+Math.pow(y/72,1.1)*0.82,x,y));
    for (i=0;i<(w==='bura'?6:3);i++){ var cx=x0+r()*(W-x0), cy=4+r()*22, L=30+r()*60, sl=w==='bura'?0.15:0.02; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy-k*sl+Math.sin(k*0.08+i)*1.2), a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) b.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.3) b.px(xx,yy,P.b5); } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<96;y++) for (x=x0;x<W;x++) b.px(x,y,ra(N,0.05+Math.pow(y/80,1.3)*0.8,x,y)); var broken=GS&&GS.phase==='k3_pro_n';
    for (i=0;i<120;i++){ var sx=x0+Math.floor(r()*(W-x0)), sy=Math.floor(Math.pow(r(),1.4)*50); if (broken && fbm(sx*0.03,sy*0.08,6)>0.5) continue; b.px(sx,sy,r()<0.15?P.n5:P.n3); }
    if (broken) for (y=0;y<60;y++) for (x=x0;x<W;x++){ var cv=fbm(x*0.03,y*0.08,6); if (cv>0.52 && bayer(x,y)<(cv-0.52)*4) b.px(x,y,P.k2); }
    return; }
  M.sky(b,x0,0,W-x0,96,tod,7); }
function miniHouse(b,x,base,w,h,sd,tile){ var y, xx; for (y=base-h;y<base;y++) for (xx=x;xx<x+w;xx++) b.px(xx,y,(xx===x+w-1)?P.s3:((hash(xx,y+sd)<0.08)?P.s4:P.s5));
  for (var k=0;k<3;k++) for (xx=x-1+k;xx<x+w+1-k;xx++) b.px(xx,base-h-1-k,tile?(k===2?P.t4:((xx+k)%3?P.t3:P.t2)):(k===2?P.s3:((xx+k)%3?P.s2:P.m2)));
  for (xx=x+1;xx<x+w-1;xx+=3) if (hash(xx,sd)<0.7){ b.px(xx,base-h+2,P.k2); WINS.push([xx,base-h+2,1,1,hash(xx,sd+1)]); if (h>6){ b.px(xx,base-h+5,P.k2); WINS.push([xx,base-h+5,1,1,hash(xx,sd+2)]); } } }
function farView(b,tod,w){ var x, y, x0=CORNER.x0, r=M.rng(17);
  // Hum (Westen): runder Hügel mit Macchia, ohne Zeichen
  for (x=x0;x<W;x++){ var top=rd(40+Math.sin(x*0.018+1.2)*6+Math.sin(x*0.07)*1.5); for (y=top;y<84;y++){ var v=0.5-(y-top)*0.01+(fbm(x*0.2,y*0.3,12)-0.5)*0.6+(y===top?0.25:0), c=ra(R('g0 e1 g1 e2 g2 e3'),v,x,y); if (hash(x,y)<0.04) c=P.s3; b.px(x,y,c); } }
  // Westufer: hinten am Hang wenige Wohnblocks und Ziegeldächer, vorn alte Steinhäuser auf dem Fels
  [[214,10,48],[300,12,46],[246,8,52]].forEach(function(q){ for (y=q[2];y<70;y++) for (x=q[0];x<q[0]+q[1];x++){ var u=x-q[0], fl=(y-q[2])%3, c=(fl===0)?P.s5:((u%3===1)?((hash(x>>2,y)<0.2)?P.s5:P.m2):P.s4); if (u===q[1]-1) c=P.s2; b.px(x,y,c); if (fl===2 && u%3===1) WINS.push([x,y,1,1,hash(x,y)]); } });
  x=x0; while (x<W){ var w2=5+Math.floor(r()*7), h2=5+Math.floor(r()*6), base=70-Math.floor(r()*4); miniHouse(b,x,base,w2,h2,rd(x),r()<0.55); x+=w2+1+Math.floor(r()*4); }
  x=x0; while (x<W){ var w3=7+Math.floor(r()*9), h3=6+Math.floor(r()*5), base3=82+Math.floor(r()*2); miniHouse(b,x,base3,w3,h3,rd(x)+5,false); x+=w3+2+Math.floor(r()*4); }
  for (var i=0;i<12;i++){ var tx=x0+Math.floor(r()*(W-x0)), ty=80+Math.floor(r()*3); for (y=ty-7;y<ty;y++) b.px(tx,y,P.g1); b.px(tx+1,ty-3,P.g0); }   // Zypressen
  // Fels am Wasser, tief unten
  for (y=82;y<95;y++) for (x=x0;x<W;x++){ var c2=ra(R('m0 m1 s1 s2 s3'),0.55+(fbm(x*0.25,y*0.4,3)-0.5)*0.7-(y-82)*0.02,x,y); if (fbm(x*0.4,y*0.5,9)>0.62) c2=(hash(x,y)<0.5)?P.g1:P.g2; b.px(x,y,c2); }
  // Fluss tief unten (nur der ferne Teil zu sehen): grün, mit hellen Strömungsstreifen
  var WR=w==='rain'?R('e1 a2 e2 a3 m3 s3'):(w==='grey'?R('a1 a2 m2 a3 m3 a4'):R('a1 a2 a3 a4 a5 a6'));
  for (y=95;y<RAIL.base;y++) for (x=x0;x<W;x++){ var c3=ra(WR,0.36+(y-95)*0.03+(fbm(x*0.05,y*0.8,11)-0.5)*0.4,x,y); if (Math.sin(x*0.09+y*1.9)>0.9) c3=M.UP[c3]; b.px(x,y,c3); OUT[y*W+x]=2; }
  for (x=x0;x<W;x++) if (hash(x,1)<0.5) b.px(x,95,P.s4);
  bridgeSmall(b); }
// die Alte Brücke in der Ferne: ein Bogen von Fels zu Fels über der dunklen Schlucht, flacher Buckel, zwei Türme
var BRM=new Uint8Array(W*H);
function bridgeSmall(b){ var cx=BR.cx, sp=BR.sp, a=BR.span, rise=21, r=(a*a+rise*rise)/(2*rise), cy=sp-rise+r, x, y; BRM.fill(0);
  function bp(xx,yy,c){ b.px(xx,yy,c); BRM[yy*W+xx]=1; }
  // Schlucht unter und neben der Brücke: dunkler Fels, unten das Wasser
  for (y=BR.top+2;y<96;y++) for (x=cx-a-10;x<=cx+a+10;x++){ var e=Math.abs(x-cx)/(a+10), c=ra(R('k2 m0 m1 s1 s2'),0.25+e*0.5+(fbm(x*0.4,y*0.3,2)-0.5)*0.4,x,y); if (y>=sp+3 && Math.abs(x-cx)<a-2+(y-sp)) c=(y>=sp+6)?((hash(x,y)<0.3)?P.a4:P.a3):P.m1; b.px(x,y,c); }
  // Bogen, Zwickel, Brüstung
  for (x=cx-a-9;x<=cx+a+9;x++){ var t=Math.min(1,Math.abs(x-cx)/(a+9)), dy=rd(BR.top+5*Math.pow(t,1.5)), inS=Math.abs(x-cx)<a, iy=inS?cy-Math.sqrt(Math.max(0,r*r-(x-cx)*(x-cx))):sp+1;
    for (y=dy-2;y<Math.min(iy,sp+2);y++){ var c2=(y<dy)?P.s6:((y===dy)?P.s3:P.s5); if (inS && y>=iy-2) c2=P.s4; if (!inS && Math.abs(x-cx)<a+3 && y>sp-6) c2=P.s4; bp(x,y,c2); }
    if (inS) bp(x,rd(iy),P.k2); }
  // Türme an den Enden (Tara links halbrund, Halebija rechts mit Dach)
  for (y=BR.top-10;y<BR.top+9;y++) for (x=cx-a-17;x<cx-a-8;x++) bp(x,y,(x===cx-a-17)?P.s5:((x>=cx-a-10)?P.s3:P.s4));
  for (x=cx-a-18;x<cx-a-7;x++) bp(x,BR.top-11,P.m2); b.hl(cx-a-16,cx-a-9,BR.top-12,P.m2);
  for (y=BR.top-12;y<BR.top+9;y++) for (x=cx+a+8;x<cx+a+16;x++) bp(x,y,(x===cx+a+8)?P.s5:((x>=cx+a+14)?P.s3:P.s4));
  for (var k=0;k<4;k++) for (x=cx+a+7+k;x<=cx+a+16-k;x++) bp(x,BR.top-13-k,P.m2);
  b.px(cx-a-13,BR.top-4,P.k2); b.px(cx+a+11,BR.top-6,P.k2); b.px(cx+a+11,BR.top,P.k2); }

// ---------------------------------------------------------------- Rezeption: Decke, Wand, Boden, Tür, Treppe, Rucksäcke, Schlüsselbrett, Schild
function interior(b,tod){ var x, y;
  for (y=0;y<FY;y++) for (x=0;x<CORNER.x0;x++){ var c;
    if (y<REC.ceil){ var bm=(x%24<5); c=bm?((y===REC.ceil-1)?P.w0:(x%24===0?P.w3:P.w1)):((y%4===0)?P.w0:P.w2); }   // Balken und Bretter
    else { var lime=0.72+(fbm(x*0.12,y*0.1,3)-0.5)*0.3; c=ra(R('s3 s4 s5 s6'),lime,x,y); if (fbm(x*0.08+3,y*0.09,7)>0.66) c=tex.ashlar(x,y,R('s1 s2 s3 s4'),7,4);   // Kalk, darunter Bruchstein
      if (y>FY-8) c=(y===FY-8)?P.w3:P.w1; }                                                                        // Holzleiste unten
    b.px(x,y,c); }
  for (x=0;x<CORNER.x0;x++){ dk(b,x,REC.ceil,2); dk(b,x,REC.ceil+1,1); }
  // Haustür mit Glasfeld (draußen Tageslicht der Gasse)
  M.prop.door(b,DOOR.x,DOOR.y,DOOR.w,DOOR.h,{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),glass:true,glassCol:tod==='day'?P.s4:P.n1,knob:'R'});
  for (y=DOOR.y+3;y<DOOR.y+22;y++) for (x=DOOR.x+3;x<DOOR.x+DOOR.w-3;x++){ var gc=(tod==='day')?((y<DOOR.y+10)?P.b4:P.s4):((y<DOOR.y+10)?P.n1:P.n0); if (x===DOOR.x+(DOOR.w>>1)) gc=P.w1; b.px(x,y,gc); }
  b.rect(DOOR.x-1,FY,DOOR.w+2,2,P.r1); b.hl(DOOR.x-1,DOOR.x+DOOR.w,FY,P.r2);                                         // Fußmatte
  // Treppe (Holz) nach oben links, Geländer; Tür am Absatz
  var n=9, sx=(STAIR.x1-STAIR.x0)/n, sy=(FY-STAIR.top)/n;
  for (var i=0;i<n;i++){ var tx0=rd(STAIR.x1-(i+1)*sx), tx1=rd(STAIR.x1-i*sx), ty=rd(FY-(i+1)*sy);
    b.rect(tx0,ty,tx1-tx0,rd(sy),P.w2); b.hl(tx0,tx1-1,ty,P.w4); b.hl(tx0,tx1-1,ty+1,P.w3); b.vl(tx1-1,ty,ty+rd(sy)-1,P.w0); }
  b.poly([[STAIR.x0,STAIR.top+3],[STAIR.x1,FY+1],[STAIR.x1,FY+5],[STAIR.x0,STAIR.top+8]],P.w1);                      // Wange
  b.line(STAIR.x0,STAIR.top-14,STAIR.x1,FY-16,P.w3); b.line(STAIR.x0,STAIR.top-13,STAIR.x1,FY-15,P.w1);              // Handlauf
  for (i=0;i<=n;i+=2){ var px=rd(STAIR.x1-i*sx), py=rd(FY-i*sy); b.vl(px,py-15,py-1,P.w1); }
  b.rect(STAIR.x0-8,STAIR.top-1,22,3,P.w3); b.hl(STAIR.x0-8,STAIR.x0+13,STAIR.top-1,P.w4);                             // Absatz
  M.prop.door(b,UPDOOR.x,UPDOOR.y,UPDOOR.w,UPDOOR.h,{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),knob:'R'});
  b.rect(UPDOOR.x+5,UPDOOR.y+4,6,3,P.s5); M.microText(b,'1',UPDOOR.x+7,UPDOOR.y+3,P.k1);
  // Rucksäcke unter der Treppe
  [[34,104,13,15,P.r2],[44,104,11,12,P.g3],[38,92,12,11,P.b1],[52,104,10,9,P.y2]].forEach(function(q){ var x0=q[0], by=q[1], w=q[2], h=q[3], c=q[4];
    b.ellipse(x0+w/2,by-h/2,w/2,h/2,function(xx,yy){ return (xx<x0+w*0.35)?M.UP[c]:((xx>x0+w*0.75)?M.DN[c]:c); }); b.rect(x0+2,by-h/2,w-4,3,M.DN[c]); b.hl(x0+3,x0+w-4,by-h+1,P.k2); b.px(x0+w-3,by-3,P.s5); });
  b.rect(55,96,3,8,P.m2); b.px(55,95,P.m3);                                                                         // Isomatte
  // Schild, Schlüsselbrett, Prospekte, Stadtkarte
  var sg='HOSTEL NERETVA', sw=M.microWidth(sg); b.rect(88,22,70,16,P.w1); b.rect(89,23,68,14,P.g1); b.hl(89,156,23,P.g3);
  M.microText(b,sg,rd(123-sw/2),25,P.s6); var fw=M.textWidth('free wifi'); M.text(b,'free wifi',rd(123-fw/2),29,P.y4); SIGNP=[rd(123-sw/2),25,rd(123-fw/2),29];
  b.rect(KEYS.x0,KEYS.y0,KEYS.x1-KEYS.x0,KEYS.y1-KEYS.y0,P.w2); b.rect(KEYS.x0+1,KEYS.y0+1,KEYS.x1-KEYS.x0-2,KEYS.y1-KEYS.y0-2,P.w3);
  for (var ky=0;ky<3;ky++) for (var kx=0;kx<5;kx++){ var hx=KEYS.x0+4+kx*5, hy=KEYS.y0+4+ky*6; b.px(hx,hy,P.m3); if (hash(kx,ky)<0.7){ b.vl(hx,hy+1,hy+3,P.y3); b.rect(hx-1,hy+3,3,2,(kx+ky)%2?P.r2:P.w0); } }
  b.rect(BROCH.x0,BROCH.y0,BROCH.x1-BROCH.x0,BROCH.y1-BROCH.y0,P.m1); for (var pr=0;pr<3;pr++) for (var pc=0;pc<3;pc++){ var bx=BROCH.x0+2+pc*6, by=BROCH.y0+2+pr*9, cc=[P.b2,P.y3,P.g3,P.r3,P.s6,P.a4,P.t3,P.c3,P.y4][pr*3+pc]; b.rect(bx,by,5,8,cc); b.hl(bx,bx+4,by,M.UP[cc]); b.rect(bx+1,by+3,3,2,P.s6); }
  b.rect(62,28,20,16,P.w0); b.rect(63,29,18,14,P.s5); b.line(66,30,70,42,P.a4); b.line(70,42,68,30,P.a3); for (var mk=0;mk<9;mk++) b.px(64+Math.floor(hash(mk,2)*16),30+Math.floor(hash(mk,3)*12),hash(mk,4)<0.5?P.t3:P.m2);   // Stadtkarte
  // Lampe (Messingschirm an der Decke)
  b.vl(84,REC.ceil,30,P.k1); b.poly([[78,34],[90,34],[87,30],[81,30]],P.y2); b.hl(78,89,34,P.y1); b.px(82,31,P.y4);
  // Boden der Rezeption: alte Steinplatten
  for (y=FY;y<H;y++) for (x=0;x<CORNER.x1;x++){ var row=Math.floor((y-FY)/(4+(y-FY)*0.12)), off=(row&1)*8, col=Math.floor((x+off)/(16+row*2)), fx=(x+off)%(16+row*2), c2=(fx===0||(y-FY)%(4+row)===0)?P.s1:(hash(col,row)<0.4?P.s2:P.s3); if (hash(x>>1,y>>1)<0.04) c2=P.s1; b.px(x,y,c2); }
  for (x=0;x<CORNER.x1;x++) dk(b,x,FY,2); }
var SIGNP=[100,25,108,29];
function corner(b){ var x, y, x0=CORNER.x0, x1=CORNER.x1;
  for (y=0;y<FY+2;y++) for (x=x0;x<x1;x++){ var archY=CORNER.arch+Math.round(Math.pow(Math.abs(x-(x0+x1)/2)/5,2)*4); if (y>archY && x>x0+2 && x<x1-3) continue;
    var c=tex.ashlar(x*1.3,y,R('s1 s2 s3 s4 s5'),6,4); if (x>=x1-2) c=M.DN[c]; if (x<=x0+1) c=M.UP[c]; b.px(x,y,c); }
  for (y=0;y<10;y++) for (x=x0-4;x<x1+10;x++){ var t=y/10; b.px(x,y,(y===9)?P.m1:((x+y)%4===0?P.s1:(y<3?P.m2:P.s2))); }           // Traufe des Steinplattendachs
  for (x=x0-4;x<x1+10;x++) dk(b,x,10,2); }

// ---------------------------------------------------------------- Terrasse: Boden, Geländer, Pergola mit Weinstock, Lichterkette
function deck(b,wet){ var x, y; for (y=RAIL.base;y<H;y++) for (x=CORNER.x1-4;x<W;x++){ var bw=3+Math.floor((y-RAIL.base)/9), row=Math.floor((y-RAIL.base)/bw), fy=(y-RAIL.base)-row*bw, seam=Math.floor((x+hash(row,3)*60)/(50+hash(row,5)*30)), c=(hash(row,seam)<0.5)?P.w2:P.w3;
    if (fy===0) c=P.w0; else if (fy===1) c=M.UP[c]; if (hash(x>>2,row)<0.06) c=P.w1; if (wet) c=M.DN[c]; b.px(x,y,c); OUT[y*W+x]=3; } }
function railing(b){ var x, y;
  for (x=CORNER.x1;x<W;x++){ b.px(x,RAIL.top,P.w4); b.px(x,RAIL.top+1,P.w2); b.px(x,RAIL.top+2,P.w0); b.px(x,RAIL.top+12,P.w2); b.px(x,RAIL.top+13,P.w0); b.px(x,RAIL.base-1,P.w1); }
  for (x=CORNER.x1+2;x<W;x+=6){ for (y=RAIL.top+3;y<RAIL.base-1;y++){ b.px(x,y,P.w2); b.px(x+1,y,P.w0); } }
  for (x=CORNER.x1+4;x<W;x+=36){ for (y=RAIL.top-2;y<RAIL.base;y++){ b.px(x,y,P.w3); b.px(x+1,y,P.w2); b.px(x+2,y,P.w0); } b.hl(x-1,x+3,RAIL.top-3,P.w4); } }
function pergola(b,w){ var x, y; PERG.posts.forEach(function(px){ for (y=PERG.beam;y<RAIL.base;y++){ b.px(px,y,P.w3); b.px(px+1,y,P.w2); b.px(px+2,y,P.w0); } });
  for (x=CORNER.x1;x<W;x++){ b.px(x,PERG.beam,P.w4); b.px(x,PERG.beam+1,P.w2); b.px(x,PERG.beam+2,P.w0); }
  for (x=CORNER.x1+8;x<W;x+=16){ b.rect(x,PERG.beam-3,2,3,P.w2); b.px(x,PERG.beam-4,P.w3); }
  // Weinstock: knorriger Stamm am linken Pfosten, kahle Ranken am Balken entlang
  var r=M.rng(77), sx=PERG.posts[0]+4; for (y=RAIL.base;y>PERG.beam+2;y--){ var ox=rd(Math.sin(y*0.21)*1.5); b.px(sx+ox,y,P.w1); b.px(sx+ox+1,y,P.w0); if (y%7===0) b.px(sx+ox-1,y,P.w2); }
  function vine(x0,y0,dir,L){ var px=x0, py=y0; for (var i=0;i<L;i++){ px+=dir; py=y0+Math.sin(i*0.25+x0)*1.6+(i>L*0.6?(i-L*0.6)*0.12:0); b.px(rd(px),rd(py),i%5===0?P.w0:P.w1); if (r()<0.12){ var tl=3+Math.floor(r()*5); for (var k=1;k<tl;k++) b.px(rd(px+k*0.4*dir),rd(py+k),P.w1); b.px(rd(px+tl*0.4*dir),rd(py+tl),P.e2); } } }
  vine(sx,PERG.beam+4,1,120); vine(sx,PERG.beam+6,1,80); vine(sx+60,PERG.beam+3,1,150);
  for (var k=0;k<10;k++){ var gx=sx+20+Math.floor(r()*170), gy=PERG.beam+6+Math.floor(r()*6); b.px(gx,gy,P.d1); b.px(gx+1,gy+1,P.d0); }   // vertrocknete Trauben
  if (w==='frost') for (x=CORNER.x1;x<W;x++) if (hash(x,9)<0.7) b.px(x,PERG.beam-1,P.s6); }
var BULBS=[];
function chain(b){ BULBS=[]; var x0=CORNER.x1-2, x1=W, seg=46, cols=[P.y4,P.r4,P.b3,P.y5,P.g4];
  for (var x=x0;x<x1;x++){ var u=((x-x0)%seg)/seg, y=rd(PERG.beam+4+Math.sin(u*Math.PI)*9); b.px(x,y,P.k1); if ((x-x0)%6===3){ b.px(x,y+1,P.k1); b.px(x,y+2,P.s5); b.px(x,y+3,P.s4); BULBS.push([x,y+2,cols[((x-x0)/6|0)%cols.length]]); } } }

// ---------------------------------------------------------------- Tische, Stühle, Dinge der Australier, Kerzen
function chairBack(b,x,by,face,col){ col=col||R('s4 s5 s6'); var bx=face==='R'?x-5:x+3;              // Plastikstuhl: Sitz und Lehne (Lehne hinter der Figur)
  b.rect(x-5,by-14,10,2,col[2]); b.hl(x-5,x+4,by-14,col[2]); b.hl(x-5,x+4,by-13,col[0]);
  b.rect(bx,by-27,3,13,col[1]); b.vl(bx,by-27,by-15,col[2]); for (var yy=by-25;yy<by-16;yy+=3) b.px(bx+1,yy,col[0]);
  b.line(x-5,by-12,x-6,by,col[0]); b.line(x+4,by-12,x+5,by,col[0]); b.line(x-4,by-12,x-2,by,col[1]); }
function table(b,t,cloth){ var x0=t.x0, x1=t.x1, y=t.top;
  b.rect(x0,y,x1-x0,2,cloth?P.s6:P.s5); b.hl(x0,x1-1,y,P.l1); b.hl(x0+1,x1-2,y+2,P.s3);
  b.vl(rd((x0+x1)/2),y+3,t.base-2,P.s4); b.vl(rd((x0+x1)/2)+1,y+3,t.base-2,P.s3); b.hl(rd((x0+x1)/2)-5,rd((x0+x1)/2)+6,t.base-1,P.s3); }
function aussieStuff(b,S,tod){ var t=TBL[1], y=t.top, t0=TBL[0];
  if (S.aussies){ [[t.x0+3,P.m4,P.r3],[t.x0+8,P.m3,P.g3],[t.x1-6,P.m4,P.b2]].forEach(function(q){ b.rect(q[0],y-4,3,4,q[1]); b.hl(q[0],q[0]+2,y-3,q[2]); b.px(q[0]+1,y-5,P.m2); });   // Bierdosen
    b.rect(t.x0+12,y-1,10,2,P.s5); b.hl(t.x0+12,t.x0+21,y-1,P.s6); b.px(t.x0+14,y-1,P.a4); b.px(t.x0+15,y-1,P.g4); b.px(t.x0+19,y,P.e2); b.px(t.x0+18,y-1,P.e2);   // Landkarte mit Kaffeefleck
    if (tod!=='night'){ var gx=t.x1+24; b.line(gx,RAIL.base-1,gx+5,RAIL.top+4,P.w3); b.ellipse(gx+1,RAIL.base-5,4,4,P.w4); b.ellipse(gx+1,RAIL.base-5,1.5,1.5,P.k1); b.line(gx+2,RAIL.base-8,gx+5,RAIL.top+4,P.w0); b.rect(gx+4,RAIL.top+2,3,3,P.w1); }   // Gitarre am Geländer
    b.ellipse(t.x1+18,t.base-6,6,6,function(xx,yy){ return xx<t.x1+16?P.y3:P.y2; }); b.rect(t.x1+14,t.base-8,8,3,P.y1); b.hl(t.x1+15,t.x1+20,t.base-11,P.k2);   // Rucksäcke
    b.ellipse(t.x0-16,t.base-5,5,5,P.b1); b.hl(t.x0-19,t.x0-13,t.base-9,P.b2); }
  else { b.px(t.x0+9,y-1,P.y3); b.px(t.x0+10,y-1,P.y2); b.ellipse(t.x1-8,y-2,4,2.2,function(xx,yy){ return yy<y-2?P.r3:P.r2; }); b.hl(t.x1-12,t.x1-4,y-1,P.r1); }   // Kronkorken, vergessene Mütze
  if (tod==='night') { b.rect(t0.x1-9,y-4,3,4,P.m4); b.hl(t0.x1-9,t0.x1-7,y-3,P.r3); }                                                                  // die Dose Bier auf Markos Tisch
  if (S.candles){ TBL.forEach(function(tb){ var cx=rd((tb.x0+tb.x1)/2)-1; b.rect(cx,y-4,3,4,P.a5); b.px(cx,y-4,P.a6); b.px(cx+1,y-2,P.s6); CANDLES.push([cx+1,y-5]); }); } }
var CANDLES=[];

// ---------------------------------------------------------------- Bild
var BASE=null, LASTB=null, LIT=[];
function paint(S,GS,tod){ var w=weaOf(GS), wet=wetOf(GS,w), b=new M.Buf(W,H,T), x, y;
  SKYM.fill(0); OUT.fill(0); WINS=[]; CANDLES=[];
  var sky=new M.Buf(W,H,T); paintSky(sky,tod,w,GS);
  farView(b,tod,w);
  // Dunst über dem Westufer (bei Bura fast keiner)
  var hz={rain:0.55,grey:0.38,calm:0.18,frost:0.15,bura:0.04}[w], fcol=(w==='rain')?(tod==='day'?P.s3:P.m1):(w==='grey'?P.s4:P.b4); if (tod==='night') fcol=P.n0;
  M.fogBake(b,function(xx,yy){ return (xx>=CORNER.x0 && yy<95)?hz*(1.1-yy/140):0; },{col:fcol});
  for (var q=0;q<W*H;q++) if (b.d[q]===T && sky.d[q]!==T){ b.d[q]=sky.d[q]; SKYM[q]=1; }
  for (y=0;y<RAIL.base;y++) for (x=CORNER.x0;x<W;x++) if (!OUT[y*W+x]) OUT[y*W+x]=1;
  pergola(b,w); railing(b); deck(b,wet); chain(b);
  interior(b,tod); corner(b);
  table(b,TBL[0],false); chairBack(b,TBL[0].x0-6,124,'R'); chairBack(b,TBL[0].x1+6,124,'L');
  chairBack(b,AUS[2][0],AUS[2][1],'L',R('s3 s4 s5')); table(b,TBL[1],false); chairBack(b,AUS[0][0],AUS[0][1],'R'); chairBack(b,AUS[1][0],AUS[1][1],'L'); aussieStuff(b,S,tod);
  // Licht: drinnen etwas dunkler und wärmer, Schatten unter den Tischen, draußen Kontaktschatten am Geländer
  M.light(b,M.lf.sum(M.lf.vignette(CORNER.x0*2,144,1.1),M.lf.k(-0.15)),0,0,function(xx,yy){ return xx<CORNER.x0; });
  M.light(b,M.lf.sum(M.lf.pool((TBL[0].x0+TBL[0].x1)/2,TBL[0].base,22,3,-0.9),M.lf.pool((TBL[1].x0+TBL[1].x1)/2,TBL[1].base,22,3,-0.9),M.lf.band(RAIL.base,RAIL.base+6,-0.5,0)),0,0,function(xx,yy){ return OUT[yy*W+xx]===3; });
  if (wet) for (y=RAIL.base+2;y<H;y++) for (x=CORNER.x1;x<W;x++){ if (fbm(x*0.05,y*0.3,4)>0.6 && bayer(x,y)<0.4){ var sc=b.get(x,RAIL.base-(y-RAIL.base)); if (sc!==T) b.px(x,y,M.DN[sc]); } }
  BASE=b.clone(); LIT=lightsFor(tod,S);
  var key=todKey(tod,w); shade(b,0,0,key,LIT,function(xx,yy){ return SKYM[yy*W+xx]===1; });
  if (tod!=='day') afterLights(b,tod,S);
  LASTB=b; return b; }
function afterLights(b,tod,S){ var x, y;
  WINS.forEach(function(wn){ if (wn[4]<0.6) return; b.px(wn[0],wn[1],wn[4]<0.8?P.y3:P.y4); });
  // die angestrahlte Brücke in der Ferne
  for (y=0;y<H;y++) for (x=BR.cx-BR.span-20;x<=BR.cx+BR.span+20;x++){ if (!BRM[y*W+x]) continue; var c=BASE.get(x,y), tw=Math.abs(x-BR.cx)>BR.span+6;
    if (tw){ if (bayer(x,y)<0.45) b.px(x,y,M.UP[b.get(x,y)]); continue; } b.px(x,y,(c===P.s6)?P.y4:((c===P.s5)?(bayer(x,y)<0.4?P.y3:P.y2):(c===P.k2?P.k1:(bayer(x,y)<0.5?P.y2:P.y1)))); }
  b.poly([[78,34],[90,34],[87,30],[81,30]],P.y4); b.hl(79,88,34,P.l1);
  M.text(b,'free wifi',SIGNP[2],SIGNP[3],P.y5);
  BULBS.forEach(function(q){ b.px(q[0],q[1],q[2]); b.px(q[0],q[1]+1,M.DN[q[2]]); });
  CANDLES.forEach(function(c){ b.px(c[0],c[1],P.y4); }); }

// ---------------------------------------------------------------- Ebenen: Tresen (Maja dahinter), Tische (Figuren dahinter), vordere Stuhllehnen
function finishL(L,tod,w){ shade(L,L.ox,L.oy,todKey(tod,w),LIT); }
function deskLayer(S,tod,w){ var x0=DESK.x0, x1=DESK.x1, L=M.layer(x0-2,DESK.top-10,x1-x0+4,DESK.base-DESK.top+12,MAJA_Y+1), wr=M.lw(L), x, y;
  for (y=DESK.top+3;y<DESK.base;y++) for (x=x0;x<x1;x++){ var c=tex.boards(y*2,x,R('w0 w1 w2 w3'),8); if (x===x0||x===x1-1) c=P.w0; if ((x-x0)%17===0) c=P.w1; wr.px(x,y,c); }
  for (x=x0;x<x1;x+=17) for (y=DESK.top+7;y<DESK.base-4;y++) if ((x-x0)%17===0){ wr.px(x+3,y,P.w3); }
  wr.rect(x0-2,DESK.top,x1-x0+4,3,P.w4); wr.hl(x0-2,x1+1,DESK.top,P.w5); wr.hl(x0-2,x1+1,DESK.top+2,P.w1);
  // Gästebuch, Laptop, Tischglocke, Kugelschreiber, Visitenkarten
  var rg=REG; wr.rect(rg[0],rg[1]-2,12,2,P.r1); wr.hl(rg[0],rg[0]+11,rg[1]-2,P.s5); wr.px(rg[0]+6,rg[1]-2,P.r2); wr.line(rg[0]+13,rg[1]-1,rg[0]+17,rg[1]-3,P.b0);
  var lp=LAP; wr.rect(lp[0],lp[1]-1,12,1,P.m2); wr.poly([[lp[0]+1,lp[1]-1],[lp[0]+3,lp[1]-9],[lp[0]+13,lp[1]-9],[lp[0]+11,lp[1]-1]],P.m1); wr.poly([[lp[0]+3,lp[1]-2],[lp[0]+4,lp[1]-8],[lp[0]+12,lp[1]-8],[lp[0]+11,lp[1]-2]],tod==='day'?P.c2:P.b3); LAPSCR=[lp[0]+5,lp[1]-7];
  var bl=BELL; wr.ellipse(bl[0],bl[1]-2,3,2.5,function(xx,yy){ return yy<bl[1]-3?P.y4:P.y2; }); wr.hl(bl[0]-3,bl[0]+3,bl[1],P.m1); wr.px(bl[0],bl[1]-5,P.y3); wr.px(bl[0]-1,bl[1]-3,P.l1);
  wr.rect(x1-8,DESK.top-1,5,1,P.s6);
  finishL(L,tod,w); return L; }
function tableLayer(t,S,tod,w,front){ var L=M.layer(t.x0-10,t.top-12,t.x1-t.x0+20,t.base-t.top+14,t.base), wr=M.lw(L);
  table(wr,t,false); if (t===TBL[1]) aussieStuffL(wr,S); if (t===TBL[0] && tod==='night'){ wr.rect(t.x1-9,t.top-4,3,4,P.m4); wr.hl(t.x1-9,t.x1-7,t.top-3,P.r3); }
  if (w==='rain'){ wr.hl(t.x0+4,t.x1-6,t.top,P.m3); wr.hl(t.x0+8,t.x1-10,t.top,P.s6); }   // im Regen ein kleiner See auf dem Tisch if (S.candles){ var cx=rd((t.x0+t.x1)/2)-1; wr.rect(cx,t.top-4,3,4,P.a5); wr.px(cx,t.top-4,P.a6); wr.px(cx+1,t.top-2,P.s6); }
  finishL(L,tod,w); if (tod!=='day' && S.candles){ var cx2=rd((t.x0+t.x1)/2); wr.px(cx2,t.top-5,P.y4); } return L; }
function aussieStuffL(wr,S){ var t=TBL[1], y=t.top; if (S.aussies){ [[t.x0+3,P.m4,P.r3],[t.x0+8,P.m3,P.g3],[t.x1-6,P.m4,P.b2]].forEach(function(q){ wr.rect(q[0],y-4,3,4,q[1]); wr.hl(q[0],q[0]+2,y-3,q[2]); wr.px(q[0]+1,y-5,P.m2); }); wr.rect(t.x0+12,y-1,10,2,P.s5); wr.px(t.x0+18,y-1,P.e2); }
  else { wr.px(t.x0+9,y-1,P.y3); wr.ellipse(t.x1-8,y-2,4,2.2,function(xx,yy){ return yy<y-2?P.r3:P.r2; }); } }
function layers(S,GS,tod){ var w=weaOf(GS); return [deskLayer(S,tod,w),tableLayer(TBL[0],S,tod,w),tableLayer(TBL[1],S,tod,w)]; }
var LAPSCR=[129,78];

// ---------------------------------------------------------------- Bewegung: Lichterkette, Kerzen, Gitarrensaite, Glitzern unten im Fluss, Laptop
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, w=weaOf(GS), i;
  if (tod!=='day'){ BULBS.forEach(function(q,k){ var X=q[0]-cam; if (X<0||X>=320) return; var on=(k%3!==2) || Math.sin(t*(7.3+hash(k,3)*5)+k*2.3)+Math.sin(t*13.1+k)>-0.6; fb.px(X,q[1],on?(hash(k,7)<0.4?P.l1:q[2]):M.DN[q[2]]); if (on && hash(k,5)<0.5) fb.px(X,q[1]-1,P.y5); });
    CANDLES.forEach(function(c,k){ var X=c[0]-cam, f=Math.sin(t*9+k*3)>0; if (X<0||X>=320) return; fb.px(X,c[1],f?P.y5:P.y4); fb.px(X,c[1]-1,f?P.y3:P.l0); if (Math.sin(t*13+k)>0.6) fb.px(X+1,c[1]-1,P.y3); }); }
  else CANDLES.forEach(function(c,k){ var X=c[0]-cam; if (X>=0&&X<320 && Math.sin(t*9+k*3)>-0.3) fb.px(X,c[1],P.y4); });
  // Glitzern unten auf der Neretva
  M.glints(fb,300,93,RAIL.base-1,60,t,tod==='night'?P.n4:(w==='rain'?P.m4:P.a6),cam);
  if (tod!=='day') M.glints(fb,BR.cx,93,RAIL.base-1,10,t,P.y3,cam);
  // Gitarrensaite (aussie3 spielt): ein heller Strich, der zittert
  if (S.aussies){ var gx=AUS[2][0]-4-cam, gy=AUS[2][1]-16; if (gx>-4 && gx<324) for (i=0;i<6;i++){ var X=gx+i, Y=gy+((Math.floor(t*30)+i)%2); if (X>=0&&X<320 && Math.sin(t*2)>-0.2) fb.px(X,Y,P.s6); } }
  // Laptop-Bildschirm flimmert leicht
  var lx=LAPSCR[0]-cam; if (lx>-8 && lx<320 && Math.sin(t*1.7)>0.6) fb.px(lx+2,LAPSCR[1]+2,P.s6);
  if (w==='bura'){ M.scn.buraDebris(fb,t,108,140,cam); } }
function front(fb,v,S,GS){ var w=weaOf(GS), tod=v.tod; if (w==='rain') M.rain(fb,v.t,{n:70,col:tod==='day'?P.m3:P.n2,col2:tod==='day'?P.m4:P.n3,mask:function(x,y){ return x+v.cam>=CORNER.x1 && y>12; }});
  if (M.k3PerfFront) M.k3PerfFront(fb,v,'herberge'); }   // Noten über der Terrasse, wenn die Australier singen (97_k3_auftritt.js)
// Geistersicht: am Geländer ein schwacher Abdruck vieler Hände
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam; for (var i=0;i<34;i++){ var hx=CORNER.x1+8+Math.floor(hash(i,1)*(W-CORNER.x1-16))-cam, hy=RAIL.top-1+Math.floor(hash(i,2)*2); if (hx<2||hx>316) continue;
    var a=0.55+0.3*Math.sin(t*0.7+i); if (bayer(hx,hy)>a) continue; var warm=hash(i,6)<0.4, c=warm?((hash(i,3)<0.4)?P.v5:P.v3):((hash(i,3)<0.3)?P.x5:P.x3);
    fb.px(hx,hy,c); fb.px(hx+1,hy,c); fb.px(hx+2,hy,c); fb.px(hx-1,hy+1,P.x2); fb.px(hx+3,hy+1,P.x2); fb.px(hx,hy-1,P.x2); fb.px(hx+2,hy-1,P.x2); if (hash(i,4)<0.5) fb.px(hx+1,hy+1,P.x4); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<112||y>138||x<10||x>390) return false;
  for (var i=0;i<TBL.length;i++){ var t=TBL[i]; if (x>=t.x0-9 && x<=t.x1+9 && y<t.base+3) return false; }
  return true; }
M.defineArt('herberge',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  rain:function(x,y){ return x>=CORNER.x1; },   // Regenschirm (05_engine.js): auf der Terrasse offen, an der Rezeption zu
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,weaOf(GS)); if (!k) return null; if (tod==='day') return levels(k)[0].a; var l=lightAt(LIT,a.x,a.y-22); return levels(k)[Math.max(1,Math.min(4,Math.round(l*4)))].a; },
  spots:{
    door:[DOOR.x-3,DOOR.y-3,DOOR.w+6,DOOR.h+5],
    desk:[DESK.x0-2,DESK.top-2,DESK.x1-DESK.x0+4,DESK.base-DESK.top+2],
    bell:[BELL[0]-5,BELL[1]-8,10,9],
    register:[REG[0]-2,REG[1]-6,18,7],
    stairs:[STAIR.x0-8,UPDOOR.y-2,STAIR.x1-STAIR.x0+10,FY-UPDOOR.y+2],
    railing:[CORNER.x1,RAIL.top-4,W-CORNER.x1,RAIL.base-RAIL.top+4],
    table:[TBL[0].x0-12,TBL[0].top-6,TBL[0].x1-TBL[0].x0+24,TBL[0].base-TBL[0].top+6],
    guitar:[TBL[1].x0-12,TBL[1].top-8,TBL[1].x1-TBL[1].x0+24,TBL[1].base-TBL[1].top+8],
    lights:[CORNER.x1,PERG.beam-4,W-CORNER.x1,16],
    bridge_view:[BR.cx-BR.span-18,BR.top-16,BR.span*2+34,BR.sp-BR.top+20]
  },
  stands:{ door:[18,116,'B'], desk:[120,116,'B'], bell:[142,116,'B'], register:[108,116,'B'], stairs:[72,114,'B'], railing:[290,114,'B'], table:[227,129,'B'], guitar:[340,130,'B'], lights:[280,118,'B'], bridge_view:[376,116,'B'] },
  actorPos:{ maja:[122,MAJA_Y,'R'], aussie1:[AUS[0][0],AUS[0][1],'R','aussie1',false,'sit'], aussie2:[AUS[1][0],AUS[1][1],'L','aussie2',false,'sit'], aussie3:[AUS[2][0],AUS[2][1],'L','aussie3',false,'guitar'], mala:[300,114,'R'] },
  start:[110,120,'R'], entries:{ map:[18,118,'R'], zimmer:[70,116,'R'] }
});
})(M);
