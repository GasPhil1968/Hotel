/* ===== rooms/art/bunker.js — Bunker unter Gleis 11 (nur Mala): der Gang der alten Weiterleitungsstelle.
   Ein Betongang mit Tonnengewölbe (Schalbretter-Abdrücke, Gurtbögen), unten ein alter graugrüner Ölanstrich, darüber roher,
   fleckiger Beton. Links führt eine Betontreppe mit Eisengeländer hinauf zum Schacht unter der Luke: dort fällt kaltes
   Tageslicht durch das Gitter (Wetter: klar, grau und tropfend bei Tauwetter, Flocken bei Schneefall, trüb bei Nebel).
   An der Wand verblasste Schablonenschrift: „WARTERAUM“ mit Pfeil über zwei Holzbänken, „WEITERLEITUNGSSTELLE“ über dem
   alten Tisch mit Stuhl (Registrierstelle), weitere Pfeile. Oben laufen alte Lüftungsrohre mit Flanschen und Schellen.
   Rechts eine rostige Stahltür und in der Ecke Theaterkram: zwei Scheinwerfer auf Stativen, gestapelte Klappstühle, eine
   Kiste „GLEIS 11“, eine gemalte Kulisse. Eine einzige Lampe mit Drahtkorb gibt kaltes Licht, Staub schwebt darin.
   Geistersicht (zentral für Fall A): am Tisch eine Schlange junger Männer mit Pappkoffern, 1962, und ein Beamter mit
   Stempel, der sitzt und stempelt. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[160,62], F=90, FY=100, R3=M.room3(VP,F,FY);
var YW=38, RV=58, ZC=58;                                  // Gewölbe: Kämpferlinie an der Rückwand, Radius, Mitte in der Tiefe
var DESK={X0:190,X1:236,Y0:80,Z0:12,Z1:28};
var BEN=[{X0:66,X1:104},{X0:110,X1:148}];                 // Bänke an der Wand (Z 2..10)
var DOOR={x0:252,x1:282,top:58};                          // Stahltür in der Rückwand
var OFF=[214,94];                                         // Beamter (Geist): Hüfte x, Füße y (sitzend hinter dem Tisch)
var LAMP=[176,18];
var STAIR={x0:4,x1:64,top:24};                            // Treppe links: unten bei x1, oben bei x0
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function wea(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun')?w:'snowlie'; }

// ---------------------------------------------------------------- Licht: eine Lampe, der Schacht links
var LM=new Uint8Array(W*H);    // 1 = Licht aus dem Schacht (Himmel)
var SF=1;                      // Stärke des Schachtlichts (Wetter)
function lampAt(x,y){ var dx=(x-LAMP[0])/120, dy=(y-LAMP[1]-90)/80, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,1.2):0; var g=Math.hypot((x-LAMP[0])/26,(y-LAMP[1]-8)/20); if (g<1) a=Math.max(a,(1-g)*0.9); return a; }
function shaftAt(x,y){ if (y<STAIR.top-4) return 0; var u=(x-8-(y-30)*0.18)/30; if (u<0||u>1) return 0; var v=1-Math.min(1,(y-20)/120); return (1-Math.abs(u-0.5)*2)*v*SF; }
function lgt(x,y){ return -0.9+lampAt(x,y)*1.45+shaftAt(x,y)*0.9; }
var COLD=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.8+L*0.1, g*0.9+L*0.1+4, b*0.96+L*0.12+14]; });

// ---------------------------------------------------------------- Strahl auf Gewölbe, Rückwand, Boden
function vaultK(x,y){ var lo=1, hi=1+ZC/F; for (var it=0;it<24;it++){ var m=(lo+hi)/2, Y=VP[1]+(y-VP[1])/m, Z=(m-1)*F, f=(Y-YW)*(Y-YW)+(Z-ZC)*(Z-ZC)-RV*RV; if (f>0) lo=m; else hi=m; } return hi; }
function ribAt(X){ var d=((X-40)%80+80)%80; return d<5?d:(d>75?80-d:99); }
function vaultTex(x,y,k){ var X=VP[0]+(x-VP[0])/k, Y=VP[1]+(y-VP[1])/k, Z=(k-1)*F, ang=Math.atan2(YW-Y,ZC-Z), s=ang*RV, c;
  var rb=ribAt(X); if (rb<3.2){ c=(rb<1)?P.m2:P.m3; if (rb>2.6) c=P.m1; return c; }                                   // Gurtbogen
  var band=((s%6)+6)%6, st=fbm(X*0.05,s*0.07); c=P.m2; if (st>0.6 && bayer(x,y)<(st-0.6)*1.6) c=P.m3; else if (st<0.36 && bayer(x,y)<(0.36-st)*1.6) c=P.m1;   // Beton
  if (band<0.45) c=M.DN[c];                                                                                                       // Schalbretter-Abdrücke
  var wet=fbm(X*0.09+3,s*0.04); if (wet>0.66 && bayer(x,y)<(wet-0.66)*2.5) c=P.e1;
  // Lüftungskanal im Gewölbe (konstante Bogenlänge)
  var dd=s-34; if (dd>0 && dd<7){ c=(dd<1.2)?P.m4:((dd>5.6)?P.k2:P.m3); if (((X%24)+24)%24<1.4) c=P.m1; if (((X%24)+24)%24>22.8) c=P.m4; }
  return c; }
function backWall(x,y){ var c;
  if (y>=FY-2) return (y===FY-1)?P.m1:P.k2;
  if (y>=74){ c=(y===74)?P.g1:(y===75?P.g3:(((x+y)%2)?P.g2:P.m2)); var f=fbm(x*0.09,y*0.13); if (f>0.62 && bayer(x,y)<(f-0.62)*2.4) c=P.m2; }   // alter Ölanstrich, abgeplatzt
  else { var f2=fbm(x*0.05,y*0.07); c=P.m2; if (f2>0.58 && bayer(x,y)<(f2-0.58)*1.8) c=P.m3; else if (f2<0.36 && bayer(x,y)<(0.36-f2)*1.6) c=P.m1; if (((y-YW)%9)===0) c=M.DN[c]; var drip=fbm(x*0.6,1.3); if (drip>0.68 && y>YW+2 && y<74 && bayer(x,y)<0.5) c=P.e1; }
  var rb=ribAt(x); if (rb<3.2) c=(rb<1)?P.m3:((rb>2.6)?P.m1:P.m2);                                                // Wandpfeiler unter den Gurtbögen
  return c; }
function floorTex(x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, g=fbm(X*0.06,Z*0.09), c=P.m1; if (g>0.5 && bayer(x,y)<(g-0.5)*1.8) c=P.m2;
  if (hash(Math.floor(X*1.7),Math.floor(Z*1.3))<0.04) c=P.s1;
  if (((X%40)+40)%40<0.7 || ((Z%30)+30)%30<0.5) c=P.k2;                                                          // Fugen
  var cr=Math.abs(Math.sin(X*0.11+Math.sin(Z*0.2)*2)); if (cr<0.03 && hash(Math.floor(X),3)<0.6) c=P.k2;             // Riss
  var dust=fbm(X*0.1+7,Z*0.1); if (dust>0.68 && bayer(x,y)<(dust-0.68)*1.6) c=P.s1;
  return c; }

// ---------------------------------------------------------------- Treppe mit Geländer, Schacht mit Tageslicht
function stairs(b,w,tod){ var x, y, s, n=11, x0=STAIR.x0, x1=STAIR.x1, yb=128, yt=STAIR.top+16, sx=(x1-x0)/n, sy=(yb-yt)/n;
  // Schacht oben links: Licht durch das Gitter der Luke
  var SK={snowlie:'b4 b5 s6',sun:'b5 s6 l1',thaw:'m3 m4 s4',snow:'s4 s5 s6',fog:'m3 m4 s4'}[w]; if (tod==='night') SK='k1 n0 n1';
  for (y=0;y<STAIR.top+4;y++) for (x=x0;x<x0+34;x++){ var c=ra(R(SK),0.3+y/30,x,y); if (y<10 && ((x+y)%4===0||(x-y+40)%4===0)) c=P.m1; if (y===10) c=P.k2; LM[y*W+x]=(y<10)?1:2; if (y>=10) c=(x<x0+3||x>x0+30)?P.m1:((y<16)?P.m2:P.m3); b.px(x,y,c); }
  b.rect(x0+34,0,3,STAIR.top+6,P.m1); b.vl(x0+33,0,STAIR.top+5,P.m3);
  // Stufen (von oben links nach unten rechts), Wange, Geländer
  for (s=0;s<n;s++){ var sx0=rnd(x0+s*sx), sy0=rnd(yt+s*sy); for (y=sy0;y<rnd(yt+(s+1)*sy);y++) for (x=0;x<rnd(x0+(s+1)*sx);x++){ var tr=(y<sy0+2); b.px(x,y,tr?((x%7===0)?P.m3:P.m4):((hash(x>>1,y)<0.2)?P.m1:P.m2)); } b.hl(0,rnd(x0+(s+1)*sx)-1,sy0,P.s3); }
  for (y=yt;y<144;y++){ var ex=rnd(x0+(y-yt)/sy*sx); if (ex>x1+4) ex=x1+4; for (x=ex;x<ex+3&&x<W;x++){ if (y>=yb) break; b.px(x,y,(x===ex)?P.m3:P.m1); } }
  // Eisengeländer auf Pfosten
  for (s=0;s<=n;s+=3){ var px=rnd(x0+s*sx)+3, py=rnd(yt+s*sy); b.vl(px,py-16,py,P.k2); b.vl(px+1,py-16,py,P.t1); }
  b.line(x0+3,yt-16,rnd(x0+n*sx)+3,rnd(yt+n*sy)-16,P.t1); b.line(x0+3,yt-17,rnd(x0+n*sx)+3,rnd(yt+n*sy)-17,P.k2);
  for (y=yb;y<144;y++) for (x=0;x<x1+6;x++){ if (b.get(x,y)===P.k0) b.px(x,y,floorTex(x,y)); }
  // Pfeil „hinauf“ an der Wand neben der Treppe
  arrow(b,72,52,'U',P.s3); }
function arrow(b,x,y,d,c){ var i;
  if (d==='L'||d==='R'){ var s=d==='L'?-1:1; b.hl(x,x+9*s,y,c); b.hl(x,x+9*s,y+1,c); for (i=0;i<4;i++){ b.px(x+9*s-i*s,y-i,c); b.px(x+9*s-i*s,y+1+i,c); } }
  else { b.vl(x,y,y+9,c); b.vl(x+1,y,y+9,c); for (i=0;i<4;i++){ b.px(x-i,y+i,c); b.px(x+1+i,y+i,c); } } }
// verblasste Schablonenschrift: Lücken in den Buchstaben
function stencil(b,s,x,y,c,c2){ var tmp=new M.Buf(200,7,T); M.microText(tmp,s,0,0,c); var tw=M.microWidth(s);
  for (var yy=0;yy<5;yy++) for (var xx=0;xx<tw;xx++){ if (tmp.get(xx,yy)===T) continue; var f=fbm((x+xx)*0.3,(y+yy)*0.3); if (f<0.22) continue; b.px(x+xx,y+yy,f<0.36?c2:c); } return tw; }
function stencilBig(b,s,x,y,c,c2){ var tmp=new M.Buf(240,9,T); M.text(tmp,s,0,0,c); var tw=M.textWidth(s);
  for (var yy=0;yy<8;yy++) for (var xx=0;xx<tw;xx++){ if (tmp.get(xx,yy)===T) continue; var f=fbm((x+xx)*0.25,(y+yy)*0.25); if (f<0.24) continue; b.px(x+xx,y+yy,f<0.36?c2:c); } return tw; }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), w=wea(GS), x, y, i;
  SF={snowlie:1,sun:1.15,thaw:0.6,snow:0.8,fog:0.5}[w]; if (tod==='night') SF=0.15;
  LM.fill(0);
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var c;
    if (y>=FY) c=floorTex(x,y); else if (y>=YW) c=backWall(x,y); else c=vaultTex(x,y,vaultK(x,y));
    b.px(x,y,c); }
  // Kämpferlinie, Rohrleitungen an der Wand
  b.hl(0,W-1,YW,P.m1); b.hl(0,W-1,YW+1,P.m3);
  for (x=40;x<W;x++){ b.px(x,YW+4,P.m4); b.px(x,YW+5,P.m3); b.px(x,YW+6,P.m3); b.px(x,YW+7,P.m2); b.px(x,YW+8,P.m1); b.px(x,YW+9,P.k2); if ((x%30)===0){ b.vl(x,YW+3,YW+10,P.m1); b.vl(x+1,YW+3,YW+10,P.m4); } }
  for (x=40;x<W;x++){ b.px(x,YW+12,P.t2); b.px(x,YW+13,P.t1); if ((x%24)===8){ b.vl(x,YW+11,YW+15,P.m1); } }
  b.vl(240,YW+13,FY-2,P.t1); b.vl(241,YW+13,FY-2,P.t2); b.rect(238,FY-6,6,3,P.m1);                               // Fallrohr
  for (x=40;x<W;x+=47){ b.rect(x,YW+2,3,3,P.k2); }
  // Schablonenschrift und Pfeile
  stencil(b,'WARTERAUM',76,58,P.k2,P.m1); arrow(b,74,68,'L',P.k2); arrow(b,128,68,'L',P.m1);
  var tw=stencilBig(b,'WEITERLEITUNGSSTELLE',150,50,P.k2,P.m1); SIGNS=[70,48,150+tw-70+4,26];
  arrow(b,232,64,'R',P.k2); stencil(b,'NR.',238,62,P.m1,P.m2); stencil(b,'1',252,62,P.k2,P.m1);
  // rostige Stahltür
  var d=DOOR; for (y=d.top;y<FY-1;y++) for (x=d.x0;x<d.x1;x++){ var u=x-d.x0, v=y-d.top, c2=M.tex.rust(u,v); if (u<2||u>d.x1-d.x0-3||v<2) c2=P.m1; if (hash(x,y)<0.3) c2=P.t1; b.px(x,y,c2); }
  b.rect(d.x0-2,d.top-2,d.x1-d.x0+4,2,P.m3); b.rect(d.x0-2,d.top,2,FY-d.top-1,P.m3); b.rect(d.x1,d.top,2,FY-d.top-1,P.m3);
  [d.top+8,FY-12].forEach(function(hy){ b.rect(d.x0-3,hy,5,4,P.k2); }); b.rect(d.x1-9,d.top+18,6,2,P.k2); b.rect(d.x1-6,d.top+18,2,8,P.k2); b.px(d.x1-6,d.top+19,P.m3);
  for (i=0;i<6;i++){ b.px(d.x0+4+i*4,d.top+4,P.m3); b.px(d.x0+4+i*4,FY-5,P.m3); }
  // Bänke an der Wand (Warteraum)
  BEN.forEach(function(bn){ var a=rp(R3.p(bn.X0,84,10)), z=rp(R3.p(bn.X1,FY,10)), bk=rp(R3.p(bn.X0,72,2)), bk2=rp(R3.p(bn.X1,72,2));
    for (var k=0;k<2;k++){ b.rect(bk[0],bk[1]+k*4,bk2[0]-bk[0],2,P.w2); b.hl(bk[0],bk2[0]-1,bk[1]+k*4,P.w3); }
    b.rect(a[0],a[1],z[0]-a[0],3,P.w3); b.hl(a[0],z[0]-1,a[1],P.w4); b.hl(a[0],z[0]-1,a[1]+2,P.w1); b.rect(a[0],a[1]+3,z[0]-a[0],1,P.k2);
    [a[0]+2,z[0]-4].forEach(function(lx){ b.rect(lx,a[1]+3,2,z[1]-a[1]-3,P.w1); b.vl(lx,bk[1],a[1],P.w1); });
    for (var q=0;q<12;q++){ var dx=a[0]+2+Math.floor(hash(q,bn.X0)*(z[0]-a[0]-4)); b.px(dx,a[1],P.s2); } });
  // Lampe: Kabel aus dem Gewölbe, Emailleschirm mit Drahtkorb
  b.vl(LAMP[0],0,LAMP[1]-2,P.k2); b.rect(LAMP[0]-2,LAMP[1]-2,5,2,P.m1);
  b.poly([[LAMP[0]-3,LAMP[1]],[LAMP[0]+4,LAMP[1]],[LAMP[0]+9,LAMP[1]+5],[LAMP[0]-8,LAMP[1]+5]],function(xx,yy){ return (yy===LAMP[1]+5)?P.m3:((xx<LAMP[0])?P.g3:P.g2); });
  // Treppe und Schacht
  stairs(b,w,tod);
  // Licht
  M.light(b,function(xx,yy){ return LM[yy*W+xx]?0:lgt(xx,yy); });
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var k=y*W+x; if (LM[k]) continue; var la=lampAt(x,y); if (bayer(x,y)<la*0.35) b.d[k]=M.tintPx(COLD,b.d[k],x,y); }
  // Lichtkegel der Lampe auf dem Boden, Lichtbahn aus dem Schacht
  for (y=LAMP[1]+6;y<H;y++) for (x=LAMP[0]-60;x<LAMP[0]+60;x++){ var t=(y-LAMP[1])/(H-LAMP[1]), hw=6+t*52, dx=Math.abs(x-LAMP[0]); if (dx>hw) continue; if (bayer(x,y)<0.16*(1-dx/hw)*(1-t*0.5)){ var k2=y*W+x; b.d[k2]=M.UP[b.d[k2]]; } }
  for (y=STAIR.top;y<H;y++) for (x=0;x<120;x++){ var sa=shaftAt(x,y); if (sa>0.05 && bayer(x,y)<sa*0.35){ var k3=y*W+x; if (!LM[k3]) b.d[k3]=M.UP[b.d[k3]]; } }
  // Glühbirne
  b.px(LAMP[0],LAMP[1]+5,P.l1); b.px(LAMP[0]+1,LAMP[1]+5,P.y5); b.px(LAMP[0],LAMP[1]+6,P.y5); for (i=-2;i<=3;i++) b.px(LAMP[0]+i,LAMP[1]+7,P.m1);
  if (tod!=='day') M.tintApply(b,M.TINT.night,0,0,W,H,function(xx,yy){ return LM[yy*W+xx]===1; });
  return b; }
var SIGNS=[70,48,180,26];

// ---------------------------------------------------------------- Ebenen: Tisch mit Stuhl, Theaterkram, Kiste „GLEIS 11“
var DESKTOP=[0,0,0];
function layers(S,GS,tod){ var L=[];
  function fin(l){ M.light(l,function(x,y){ return lgt(x,y)+0.1; },l.ox,l.oy); for (var y=0;y<l.h;y++) for (var x=0;x<l.w;x++){ var k=y*l.w+x, c=l.d[k]; if (c===T) continue; var X=x+l.ox, Y=y+l.oy; if (bayer(X,Y)<lampAt(X,Y)*0.35) l.d[k]=M.tintPx(COLD,c,X,Y); } if (tod!=='day') M.tintApply(l,M.TINT.night); L.push(l); }
  // Stuhl hinter dem Tisch (Holz, Lehne zur Wand)
  var cp=rp(R3.st((DESK.X0+DESK.X1)/2+2,5,'F')), cl0=M.layer(cp[0]-8,cp[1]-30,17,31,cp[1]), cw=M.lw(cl0);
  cw.rect(cp[0]-6,cp[1]-26,13,3,P.w2); cw.hl(cp[0]-6,cp[0]+6,cp[1]-26,P.w3); cw.vl(cp[0]-6,cp[1]-26,cp[1],P.w1); cw.vl(cp[0]+6,cp[1]-26,cp[1],P.w1); cw.rect(cp[0]-6,cp[1]-12,13,2,P.w3); cw.hl(cp[0]-6,cp[0]+6,cp[1]-12,P.w4);
  fin(cl0);
  // alter Holztisch (Registrierstelle): Platte, Schublade, vier Beine, darauf ein Stempelkasten, Papiere, Staub
  var dr=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), dl=M.layer(dr[0]-4,dr[1]-14,dr[2]+8,dr[3]+16,dr[1]+dr[3]), dw=M.lw(dl);
  R3.box(dw,DESK.X0,DESK.X1,DESK.Y0,DESK.Y0+2,DESK.Z0,DESK.Z1,{top:function(x,y){ return (hash(x,y)<0.25)?P.s2:P.w2; },front:P.w2,left:P.w1});
  R3.box(dw,DESK.X0+2,DESK.X1-2,DESK.Y0+2,DESK.Y0+6,DESK.Z1-2,DESK.Z1-1,{front:P.w1});
  [[DESK.X0+2,DESK.Z1-2],[DESK.X1-3,DESK.Z1-2],[DESK.X0+2,DESK.Z0+2],[DESK.X1-3,DESK.Z0+2]].forEach(function(l){ R3.box(dw,l[0],l[0]+1.6,DESK.Y0+2,FY,l[1],l[1]+1.4,{front:P.w1,left:P.w0}); });
  var t0=rp(R3.p(DESK.X0,DESK.Y0,DESK.Z1)), t1=rp(R3.p(DESK.X1,DESK.Y0,DESK.Z1)), ty=t0[1]-1, dm=rp(R3.p((DESK.X0+DESK.X1)/2,DESK.Y0+4,DESK.Z1)); dw.rect(dm[0]-3,dm[1],6,1,P.m3);
  dw.rect(t0[0]+8,ty-3,9,3,P.k2); dw.hl(t0[0]+8,t0[0]+16,ty-3,P.m1); dw.px(t0[0]+10,ty-4,P.w3); dw.px(t0[0]+14,ty-4,P.w3);                // Stempelkasten
  dw.poly([[t0[0]+22,ty],[t0[0]+32,ty-1],[t0[0]+33,ty+1],[t0[0]+23,ty+1]],P.s3); dw.px(t0[0]+26,ty,P.s2);                                   // vergilbtes Blatt
  dw.rect(t1[0]-12,ty-6,6,6,P.m2); dw.hl(t1[0]-12,t1[0]-7,ty-6,P.m3); dw.px(t1[0]-10,ty-8,P.m1); dw.px(t1[0]-9,ty-9,P.m1);                  // alte Schreibtischlampe (kaputt)
  DESKTOP=[t0[0],ty,t1[0]];
  fin(dl);
  // Theaterkram rechts: Kulisse an der Wand, Scheinwerfer, Klappstühle, Kiste „GLEIS 11“
  var pl=M.layer(236,40,84,100,128), pw=M.lw(pl), x, y;
  // gemalte Kulisse (Zugfenster mit Abendhimmel), angelehnt
  pw.poly([[284,50],[318,48],[318,106],[288,108]],function(xx,yy){ var c=(yy<70)?((yy<60)?P.b3:P.b2):((yy<74)?P.m3:P.e3); if (yy>=74 && (xx+yy)%7===0) c=P.e2;   // gemalter Himmel, Bahnsteigdach, Bahnsteig
      if (Math.hypot(xx-302,yy-62)<5) c=(Math.hypot(xx-302,yy-62)<4)?P.s5:P.k2; if (xx===302 && yy>=59 && yy<=62) c=P.k2; if (yy===62 && xx>=302 && xx<=304) c=P.k2;
      if (xx<288+(108-yy)*0.07) c=P.w2; if (yy<50+ (318-xx)*0.06) c=P.w2; return c; });
  pw.poly([[290,80],[318,76],[318,106],[294,108]],function(xx,yy){ return ((xx+yy*2)%9<2)?P.m1:(((xx>>2)+(yy>>3))%2?P.m2:P.m3); });                    // Staubtuch
  pw.line(288,108,284,50,P.w0);
  // Klappstühle gestapelt
  for (var q=0;q<4;q++){ var cx=262+q*2, cy=112-q*1; pw.line(cx-6,cy,cx+2,cy-24,P.m1); pw.line(cx+4,cy,cx-2,cy-24,P.m2); pw.rect(cx-5,cy-12,10,2,P.m3); }
  // Scheinwerfer auf Stativ
  [[250,116,1],[300,122,-1]].forEach(function(sp){ var sx=sp[0], sy=sp[1], f=sp[2]; pw.line(sx,sy-26,sx-6,sy,P.k2); pw.line(sx,sy-26,sx+6,sy,P.k2); pw.line(sx,sy-26,sx,sy-1,P.m1); pw.vl(sx,sy-36,sy-26,P.m1);
    pw.poly([[sx-5,sy-44],[sx+6,sy-46],[sx+8,sy-36],[sx-3,sy-34]],P.k1); pw.ellipse(sx+7*f*0+ (f>0?8:-5),sy-40,2,4.5,f>0?P.m2:P.m3); pw.px(sx+(f>0?8:-5),sy-41,P.s4); pw.hl(sx-2,sx+3,sy-46,P.m2); });
  fin(pl);
  // Kiste „GLEIS 11“ vorn in der Ecke
  var kl=M.layer(270,104,46,30,132), kw=M.lw(kl);
  kw.rect(272,110,40,20,P.w3); kw.hl(272,311,110,P.w4); kw.vl(272,110,129,P.w4); kw.vl(311,110,129,P.w1); kw.hl(272,311,129,P.w1); for (y=114;y<129;y+=5) kw.hl(273,310,y,P.w2);
  kw.poly([[272,106],[312,106],[316,110],[276,110]],P.w4); kw.hl(272,312,106,P.w5);
  var tw=M.microWidth('GLEIS 11'); kw.rect(278,116,tw+4,8,P.w2); M.microText(kl,'GLEIS 11',280-kl.ox,117-kl.oy,P.k1); kw.rect(305,112,4,2,P.k2); kw.rect(275,112,4,2,P.k2);
  fin(kl);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Staub im Licht, Lampe flackert selten, Tropfen bei Tauwetter, Flocken im Schacht
function dyn(fb,v,S,GS){ var t=v.t, w=wea(GS), i;
  M.dust(fb,t,LAMP[0]-40,LAMP[1]+10,80,90,18,P.s3);
  M.dust(fb,t*0.8+3,10,30,60,90,10,P.s4);
  var fl=(Math.sin(t*13.7)+Math.sin(t*4.3+1))>1.75; if (fl){ fb.px(LAMP[0],LAMP[1]+5,P.y3); fb.px(LAMP[0]+1,LAMP[1]+5,P.y2); }
  if (w==='thaw'){ for (i=0;i<3;i++){ var ph=(t*0.8+i*0.33)%1, dx=12+i*9, dy=rnd(12+ph*100); fb.px(dx,dy,P.s4); fb.px(dx,dy-1,P.m4); } var rr=(t*0.8)%1; fb.px(20+rnd(rr*4),131,P.m4); }
  if (w==='snow'){ for (i=0;i<8;i++){ var X=rnd(8+((hash(i,3)*26+Math.sin(t+i)*3)%26)), Y=rnd(((t*(5+hash(i,4)*4)+hash(i,5)*60)%60)); if (Y<40) fb.px(X,Y,P.s6); } } }

// ---------------------------------------------------------------- Geistersicht: die Schlange von 1962, der Beamte mit dem Stempel
// Figur als Maske (Blick nach rechts), dann Füllung dünn, Umriss hell: ein Nachhall, kein Körper
var GM=new Uint8Array(40*60);
function gpoly(pts,v,sc,ox,oy){ var xs=pts.map(function(p){ return ox+p[0]*sc; }), ys=pts.map(function(p){ return oy+p[1]*sc; }), y0=Math.floor(Math.min.apply(null,ys)), y1=Math.ceil(Math.max.apply(null,ys));
  for (var y=y0;y<=y1;y++){ var xx=[]; for (var i=0;i<pts.length;i++){ var j=(i+1)%pts.length, ya=ys[i], yb=ys[j]; if ((ya<=y+0.5&&yb>y+0.5)||(yb<=y+0.5&&ya>y+0.5)){ xx.push(xs[i]+(y+0.5-ya)/(yb-ya)*(xs[j]-xs[i])); } }
    xx.sort(function(p,q){ return p-q; }); for (var k=0;k+1<xx.length;k+=2) for (var x=Math.ceil(xx[k]-0.5);x<=Math.floor(xx[k+1]-0.5);x++){ if (x>=0&&x<40&&y>=0&&y<60) GM[y*40+x]=v; } } }
function gell(cx,cy,rx,ry,v,sc,ox,oy){ for (var y=Math.floor(oy+(cy-ry)*sc);y<=Math.ceil(oy+(cy+ry)*sc);y++) for (var x=Math.floor(ox+(cx-rx)*sc);x<=Math.ceil(ox+(cx+rx)*sc);x++){ var dx=(x+0.5-(ox+cx*sc))/(rx*sc), dy=(y+0.5-(oy+cy*sc))/(ry*sc); if (dx*dx+dy*dy<=1 && x>=0&&x<40&&y>=0&&y<60) GM[y*40+x]=v; } }
// v: 1 Körper, 2 Kopf/Haut, 3 Koffer, 4 Mütze/Hut, 5 Bündel
function youngMan(opt,sc){ GM.fill(0); var ox=18, oy=56, st=opt.stride||0;
  gpoly([[-3.5,-13],[-1,-13],[-1.5-st,0],[-4-st,0]],1,sc,ox,oy); gpoly([[0.5,-13],[3,-13],[3.5+st,0],[1+st,0]],1,sc,ox,oy);         // Beine
  gpoly([[-4.5-st,-1.2],[-0.5-st,-1.2],[0-st,0.6],[-4.5-st,0.6]],1,sc,ox,oy); gpoly([[0.5+st,-1.2],[5+st,-1.2],[5.5+st,0.6],[0.5+st,0.6]],1,sc,ox,oy);   // Schuhe
  var hem=opt.long?-9:-14; gpoly([[-3.5,-35.5],[2.5,-36],[4.5,-33],[5,-22],[5.5,hem],[-5,hem],[-5,-24],[-5,-33]],1,sc,ox,oy);   // Mantel/Jacke, hängende Schultern
  gpoly([[-1,-38],[1.5,-38],[1.5,-35],[-1,-35]],2,sc,ox,oy);                                                                     // Hals
  gell(0.6,-41.2,3.2,3.7,2,sc,ox,oy); gpoly([[3.4,-41.4],[4.6,-40.4],[3.4,-39.8]],2,sc,ox,oy);                                     // Kopf, Nase
  if (opt.hat) { gpoly([[-5,-43.6],[5.5,-43.6],[5.5,-42.8],[-5,-42.8]],4,sc,ox,oy); gpoly([[-3,-47.5],[3.2,-47.5],[3.2,-43.6],[-3,-43.6]],4,sc,ox,oy); }
  else { gpoly([[-3.8,-45],[2.5,-45.5],[6.5,-43.4],[3,-42.6],[-3.8,-42.6]],4,sc,ox,oy); }                                          // Schiebermütze, Schirm nach vorn
  if (opt.bundle) gell(-5.5,-31,3.5,5,5,sc,ox,oy);                                                                                // Bündel auf dem Rücken
  if (opt.case){ gpoly([[1.5,-34],[3.8,-33.5],[4.3,-20],[2.3,-20]],1,sc,ox,oy); gpoly([[-1.5,-19.5],[10,-19.5],[10,-12],[-1.5,-12]],3,sc,ox,oy); }   // Arm, Pappkoffer
  else gpoly([[1.5,-34],[3.6,-33.5],[3.8,-21],[1.8,-21]],1,sc,ox,oy);
  return [ox,oy]; }
function official(up,sc){ GM.fill(0); var ox=20, oy=56;
  gpoly([[-6,-28],[5,-28],[6,-14],[-7,-14]],1,sc,ox,oy);                                                                          // Oberkörper (Uniformjacke), unten verdeckt
  gpoly([[-1,-31],[1.5,-31],[1.5,-28],[-1,-28]],2,sc,ox,oy); gell(0,-34.5,3.5,3.8,2,sc,ox,oy);
  gpoly([[-4,-39],[4,-39],[4,-36.5],[-4,-36.5]],4,sc,ox,oy); gpoly([[-7,-37],[-3,-37],[-3,-36],[-7,-36]],4,sc,ox,oy);                 // Schirmmütze, Schirm nach links
  var hy=-20-up*7; gpoly([[-4,-27],[-2,-25],[-9,hy+1],[-11,hy]],1,sc,ox,oy); gpoly([[-12,hy-5],[-9,hy-5],[-9,hy+1],[-12,hy+1]],3,sc,ox,oy);   // Arm mit Stempel
  return [ox,oy]; }
function drawMask(fb,X,FYs,a,t,face){ var ox=18, oy=56;
  for (var y=0;y<60;y++) for (var x=0;x<40;x++){ var v=GM[y*40+x]; if (!v) continue; var sx=rnd(X)+(face<0?(ox-x):(x-ox)), sy=FYs+(y-oy); if (sx<0||sx>=fb.w||sy<0||sy>=144) continue;
    var e=!GM[y*40+x-1]||!GM[y*40+x+1]||!GM[(y-1)*40+x]||!GM[(y+1)*40+x], top=!GM[(y-1)*40+x], c, p;
    if (e){ c=top?P.x5:((v===3)?P.x5:P.x4); p=Math.min(1,a+0.3); } else { c=(v===2)?P.x3:((v===3)?P.x2:((v===4)?P.x3:((v===5)?P.v3:P.x1))); p=a*0.45; if (v===3 && (x%4===0||y===oy-14)) { c=P.x4; p=a; } }
    if (bayer(sx,sy+Math.floor(t*2))<p) fb.px(sx,sy,c); } }
function ghost(fb,v,S,GS){ var t=v.t, i;
  // die Schlange: junge Männer mit Pappkoffern und Bündeln, Blick zum Tisch (nach rechts), leise schwankend
  var Q=[[180,110,1.0,{case:1}],[162,112,0.98,{hat:1,case:1,long:1}],[145,111,1.04,{bundle:1}],[128,113,0.95,{case:1,stride:1}],[111,112,1.0,{hat:1,case:1}],[94,114,0.97,{case:1,long:1}],[77,113,0.93,{bundle:1,case:1}]];
  Q.forEach(function(q,j){ var a=0.62+Math.sin(t*0.7+j*1.3)*0.12-(j*0.04), sw=Math.sin(t*0.8+j*1.7)*0.6; youngMan(q[3],q[2]); drawMask(fb,q[0]+sw,q[1],a,t,1); });
  // der Beamte: sitzt hinter dem Tisch, stempelt
  var ph=(t*1.1)%2.4, up=ph<0.5?ph/0.5:(ph<0.7?1-(ph-0.5)/0.2:0); official(up,1); drawMask(fb,OFF[0]+2,DESKTOP[1]+12,0.8,t,1);
  var sx=OFF[0]-9, sy=DESKTOP[1]-1;
  if (up<0.08){ for (var k=-3;k<=3;k++){ var X=sx+k; if (X>=0&&X<fb.w) fb.px(X,sy,P.v4); } }
  // Formulare auf dem Tisch, eines mit Stempelabdruck
  for (k=0;k<9;k++) fb.px(DESKTOP[0]+16+k,DESKTOP[1]-1,P.x5); fb.px(DESKTOP[0]+19,DESKTOP[1]-2,P.v4); fb.px(DESKTOP[0]+20,DESKTOP[1]-2,P.v4);
  // ein Kalenderblatt an der Wand: 1962
  var cx=262, cy=24, y; for (y=cy;y<cy+12;y++) for (k=0;k<14;k++){ var e=(y===cy||y===cy+11||k===0||k===13); if (bayer(cx+k,y)<(e?0.7:0.25)) fb.px(cx+k,y,e?P.x4:P.x1); }
  for (k=1;k<13;k++) fb.px(cx+k,cy+2,P.v3); M.microText(fb,'1962',cx+2,cy+5,P.x5);
  // kaltes Glimmen um Tisch und Schlange
  for (y=60;y<116;y++) for (var x=60;x<250;x++){ var d=Math.hypot((x-170)/95,(y-92)/30); if (d<1 && bayer(x,y+Math.floor(t*3))<(1-d)*0.14){ var kk=y*fb.w+x; fb.d[kk]=M.UP[fb.d[kk]]; } } }

// ---------------------------------------------------------------- Lauffläche (nur Mala: walk und walkG gleich)
function walk(x,y){ if (y<114||y>138||x<20||x>300) return false; var f=R3.floor(x,y); if (!f) return false;
  if (x>266 && y<134) return false;                                     // Theaterkram und Kiste
  if (x<40 && y<124) return false;                                      // Treppenwange
  return true; }
var DR=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1);
M.defineArt('bunker',{
  width:W, paint:paint, layers:layers, walk:walk, walkG:walk, dynamic:dyn, ghost:ghost,
  spots:{
    up:[0,0,62,128],
    desk:[DR[0]-2,DR[1]-14,DR[2]+4,DR[3]+14],
    signs:SIGNS,
    benches:[66,64,90,44],
    props:[240,40,80,92],
    pipes:[40,YW+1,280,16]
  },
  stands:{ up:[42,126,'L'], desk:[212,118,'B'], signs:[190,118,'B'], benches:[112,118,'B'], props:[262,136,'R'], pipes:[150,118,'B'] },
  actorPos:{ mala:[120,124,'R'] },
  start:[44,126,'R'], entries:{ gleis11:[44,126,'R'] }
});
})(M);
