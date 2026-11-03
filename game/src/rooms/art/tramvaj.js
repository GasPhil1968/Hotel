/* ===== rooms/art/tramvaj.js — In der Straßenbahn (Tatra K2), Innenraum (320 px) =====
   Seitenblick quer durch den Wagen: die gegenüberliegende Fensterreihe mit Aluminiumrahmen und Klappfenstern, darunter Sitze
   aus rotbraunem Kunstleder mit gelben Haltegriffen, gelbe senkrechte und waagrechte Haltestangen, Neonröhren an der Decke.
   Links das Gelenk zum hinteren Wagenteil (Faltenbalg, Drehteller im Boden), rechts die vierteilige Falttür und dahinter die
   Glaswand der Fahrerkabine. Am Türpfosten der orange Entwerter. Über den Fenstern der Linienplan (S.line '1' oder '3')
   und eine Werbung. Boden aus geriffeltem Gummi; bei Schnee Matsch an der Tür.
   Hinter den Scheiben zieht die Stadt vorbei (S.moving): S.view = city | towers | unitic | yellow | museum | cathedral |
   river | bascarsija, zwei Ebenen mit Parallaxe, in dynamic aus vorbereiteten Streifen kopiert. Steht die Bahn, steht das Bild. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144, VX=160, VY=62, FL=104, CT=14;      // Fluchtpunkt, Bodenlinie und Deckenlinie der Rückwand
var WIN={y0:27,y1:69,cols:[38,76,114,152,190],w:32}; // Fensterreihe (linke Kante je Fenster)
var SEATS=[36,74,112,150,188];                       // Rückenlehnen der Sitze (x), Sitz nach rechts
var SEAT={top:94,base:108};
var DOOR={x0:232,x1:278,y0:24};
var CAB={x0:284};
var JOINT={x0:9,x1:30};
var POLES=[34,110,186,228,281];                      // Stangen an der Rückwand
var NEAR=[{x:206,base:126},{x:84,base:132}];         // Stangen im Gang (Ebenen, schaukeln)
var VAL={x:224,y:72};
var ROUTE={x0:74,x1:226,y0:15,y1:25};
var AD={x0:36,x1:71,y0:15,y1:25};
var LAMPS=[50,130,210,282];
var SW=720, SH=70, SY0=20;                           // Außenstreifen: Breite, Höhe, Bildschirm-y der ersten Zeile
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
// Neonlicht im Wagen: kühles, etwas grünliches Weiß; nachts etwas härter
var NEON={ dusk:M.tintMake(function(r,g,b){ return [r*0.88+6, g*0.9+8, b*0.92+12]; }), night:M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.8+L*0.06+4, g*0.84+L*0.06+8, b*0.86+L*0.06+14]; }) };
function neonKey(tod){ return tod==='day'?null:(tod==='night'?'night':'dusk'); }

// ---------------------------------------------------------------- Masken: Glas (Fenster, Tür, Kabine)
var GLASS=new Uint8Array(W*H), GL=null;           // GL: Liste der Glaspixel (Index), für dynamic
function glassPx(x,y){ if (x<0||x>=W||y<0||y>=H) return; GLASS[y*W+x]=1; }

// ---------------------------------------------------------------- Außenstreifen: Stadtansichten (Tagesfarben, dann Tageszeit)
var STRIP={};
function facade(b,x0,w,top,base,col,seed,opt){ opt=opt||{}; var r=M.rng(seed), x, y, fl=opt.fl||7;
  for (y=top;y<base;y++) for (x=x0;x<x0+w;x++){ var c=col[1]; if (x===x0) c=col[2]; if (x>=x0+w-1) c=col[0]; b.px(((x%SW)+SW)%SW,y,c); }
  for (x=x0-1;x<x0+w+1;x++){ b.px(((x%SW)+SW)%SW,top,col[2]); b.px(((x%SW)+SW)%SW,top+1,col[0]); }
  var rows=Math.floor((base-top-10)/fl);
  for (var j=0;j<rows;j++){ var wy=top+4+j*fl; for (x=x0+3;x<x0+w-4;x+=5){ var lit=r(); for (var yy=wy;yy<wy+4;yy++) for (var xx=x;xx<x+2;xx++) b.px(((xx%SW)+SW)%SW,yy,(yy===wy)?P.k1:P.k2); WLIT.push([((x%SW)+SW)%SW,wy,lit]); } for (x=x0;x<x0+w;x++) b.px(((x%SW)+SW)%SW,wy+fl-2,col[2]); }
  if (opt.shop){ for (x=x0+1;x<x0+w-1;x++) for (y=base-7;y<base;y++) b.px(((x%SW)+SW)%SW,y,(y===base-7)?opt.shop:(((x-x0)%9<6)?P.k2:col[0])); }
  if (opt.sign){ var sw=M.microWidth(opt.sign)+4, sx=x0+Math.max(1,Math.floor((w-sw)/2)); for (x=sx;x<sx+sw;x++) for (y=base-14;y<base-7;y++) b.px(((x%SW)+SW)%SW,y,(y===base-14)?M.UP[opt.signCol||P.g1]:(opt.signCol||P.g1));
    M.microText({px:function(px,py,c){ b.px(((px%SW)+SW)%SW,py,c); }},opt.sign,sx+2,base-13,P.s6); }
  if (opt.roof) for (x=x0;x<x0+w;x++) for (y=top-3;y<top;y++) if (Math.abs(x-x0-w/2)<w/2-(top-y)) b.px(((x%SW)+SW)%SW,y,opt.roof); }
var WLIT=[];
function lampN(n,x,base){ for (var y=base-46;y<base;y++){ n.px(x,y,P.m1); } n.px(x+1,base-46,P.m1); n.hl(x+1,x+5,base-47,P.m1); n.hl(x+3,x+6,base-46,P.m2); NLAMP.push([x+5,base-45]); }
var NLAMP=[];
function treeN(n,x,base,h,r){ for (var y=base-h;y<base;y++){ n.px(x,y,P.e1); if (y>base-h*0.6) n.px(x+1,y,P.e0); }
  for (var k=0;k<26;k++){ var a=-Math.PI/2+(r()-0.5)*2.2, L=h*0.25+r()*h*0.3, sx=x, sy=base-h*0.55-r()*h*0.3; n.line(rd(sx),rd(sy),rd(sx+Math.cos(a)*L*0.6),rd(sy+Math.sin(a)*L),P.e1); } }
function walkerN(n,x,base,col,r){ var h=14+Math.floor(r()*4), f=r()<0.5?1:-1; n.rect(x,base-h,3,h-5,col); n.rect(x,base-h-3,2,3,P.h1); n.px(x+1,base-5,col); n.px(x,base-4,col); n.px(x+2,base-3,col); n.px(x,base-2,col); n.px(x+2,base-1,col); if (r()<0.35){ n.hl(x-3,x+5,base-h-5,P.k1); n.hl(x-2,x+4,base-h-6,P.k1); n.vl(x+1,base-h-4,base-h,P.k1); } if (r()<0.4) n.rect(x+(f>0?3:-2),base-h+4,2,4,P.r2); }
function carN(n,x,base,col){ n.rect(x,base-6,22,4,col); n.rect(x+5,base-9,11,3,col); n.rect(x+6,base-8,9,2,P.c1); n.px(x+3,base-2,P.k1); n.px(x+4,base-2,P.k1); n.px(x+16,base-2,P.k1); n.px(x+17,base-2,P.k1); n.hl(x,x+21,base-6,M.UP[col]); }
function buildStrip(view,tod,wea){ var key=view+'|'+tod+'|'+wea; if (STRIP[key]) return STRIP[key]; if (Object.keys(STRIP).length>10) STRIP={};
  var F=new M.Buf(SW,SH,T), N=new M.Buf(SW,SH,T), x, y, GB=54, r=M.rng(view.length*31+7); WLIT=[]; NLAMP=[];
  // Himmel
  var sk=new M.Buf(SW,SH,P.k0); M.scn.sky(sk,0,0,SW,GB,tod,wea==='calm'?'calm':wea,11); for (var k=0;k<SW*SH;k++) F.d[k]=sk.d[k];
  // Straße und Gehsteig (durch die Türscheiben sichtbar)
  for (y=GB;y<SH;y++) for (x=0;x<SW;x++){ var c=(y<GB+5)?((x%14===0)?P.s2:P.s3):((y<GB+6)?P.s4:P.m1); if (y>GB+6 && hash(x>>1,y)<0.1) c=P.m2; F.px(x,y,c); }
  var cols=[R('s3 s4 s5'),R('e3 e4 s5'),R('t3 t4 t5'),R('s2 s3 s4'),R('d3 d4 d5'),R('g3 g4 g5'),R('y2 y3 y4')];
  if (view==='towers'){ for (x=0;x<SW;){ var w=46+Math.floor(r()*22), gap=10+Math.floor(r()*26), top=-4+Math.floor(r()*14); var C=r()<0.5?R('s2 s3 s4'):R('e2 e3 e4');
      for (y=Math.max(0,top);y<GB;y++) for (var xx=x;xx<x+w;xx++){ var u=xx-x, fl=(y-top)%5, cc=C[1]; if (fl===0) cc=C[2]; else if (fl>=2 && u%6>=1 && u%6<=3 && u<w-2) cc=(hash(xx,y)<0.12)?P.s5:P.m1; if (u===0) cc=C[2]; if (u>=w-2) cc=C[0]; F.px(xx%SW,y,cc); if (fl>=2 && u%6===2 && u<w-2 && y%5===3) WLIT.push([xx%SW,y,hash(xx,y)]); }
      for (y=Math.max(0,top)+2;y<GB;y+=10) F.px((x+w-5)%SW,y,P.s5);                                     // Satellitenschüsseln
      x+=w+gap; }
    for (x=0;x<SW;x+=36) treeN(N,x+Math.floor(r()*10),GB+8,40+Math.floor(r()*12),r);
    for (x=0;x<SW;x+=60){ if (r()<0.5){ var mw=M.microWidth('MARKET')+4; F.rect(x+10,GB-12,mw,7,P.r2); M.microText(F,'MARKET',x+12,GB-11,P.s6); } } for (x=30;x<SW;x+=110) walkerN(N,x,GB+5,P.k2,r); }
  else if (view==='unitic'){ var tx=120; [0,46].forEach(function(o){ var x0=tx+o; for (y=0;y<GB;y++) for (var xx=x0;xx<x0+36;xx++){ var u=xx-x0, cc=((y%4)===0)?P.m2:(((u%5)===0)?P.m1:(y<20?P.b1:P.c1)); if (((u*0.6+y)%17)<1.5) cc=P.b3; if (u===0) cc=P.m3; if (u===35) cc=P.k2; F.px(xx,y,cc); if ((y%4)===2 && u%5===2) WLIT.push([xx,y,hash(xx,y)]); } });
    for (x=0;x<SW;x+=70){ if (x>90 && x<220) continue; facade(F,x,60,22+Math.floor(r()*10),GB,cols[Math.floor(r()*4)],x+3,{shop:P.r2}); } for (x=0;x<SW;x+=96) lampN(N,x+40,GB+10); }
  else if (view==='yellow'){ var yx=200, yw=150; for (y=4;y<GB;y++) for (var xx2=yx;xx2<yx+yw;xx2++){ var u2=xx2-yx, band=(y-4)%9, cc2=(band<5)?((u2%2)?P.y3:P.y4):P.w2; if (band===5) cc2=P.y1; if (u2<2) cc2=P.y5; if (u2>yw-3) cc2=P.y2; F.px(xx2,y,cc2); if (band>=6 && u2%4===1) WLIT.push([xx2,y,hash(xx2,y)]); }
    for (xx2=yx;xx2<yx+yw;xx2++){ F.px(xx2,4,P.w1); F.px(xx2,3,P.y2); }
    for (x=0;x<SW;x+=80){ if (x>160 && x<380) continue; facade(F,x,64,24+Math.floor(r()*10),GB,cols[Math.floor(r()*4)],x+9,{shop:P.b1}); } for (x=0;x<SW;x+=110) lampN(N,x+30,GB+10); for (x=20;x<SW;x+=140) treeN(N,x,GB+8,36,r); }
  else if (view==='museum'){ var mx=150;
    // flacher Museumsbau der 60er: weißer Riegel auf Stützen, dunkles Fensterband, verglastes Erdgeschoss
    for (y=22;y<41;y++) for (x=mx;x<mx+230;x++){ var cc3=(y<24)?P.s6:((y>=31&&y<35)?((x%6===0)?P.s3:P.c0):P.s5); if ((x-mx)%23===0 && (y<31||y>=35)) cc3=P.s4; F.px(x,y,cc3); if (y===32 && x%6===3) WLIT.push([x,32,hash(x,3)]); }
    for (x=mx;x<mx+230;x++){ F.px(x,41,P.s3); F.px(x,42,P.m1); }
    for (y=43;y<GB;y++) for (x=mx+4;x<mx+226;x++) F.px(x,y,((x-mx)%20<2)?P.s4:(y<46?P.k2:P.c0));
    // davor das Denkmal: eine riesige Konservendose auf einem Sockel
    var cx=430; for (y=22;y<44;y++) for (x=cx-10;x<=cx+10;x++){ var u3=(x-cx+10)/20, cc4=u3<0.2?P.s5:(u3<0.65?P.s4:P.s2); if (y>27 && y<38) cc4=u3<0.25?P.y4:(u3<0.7?P.y3:P.y2); if (y===30||y===35) cc4=P.r2; F.px(x,y,cc4); }
    for (x=cx-10;x<=cx+10;x++){ F.px(x,21,P.s5); F.px(x,44,P.s2); } F.ellipse(cx,21,10,1.5,P.s4); F.hl(cx-6,cx+6,20,P.s6);
    for (y=45;y<GB;y++) for (x=cx-13;x<=cx+13;x++) F.px(x,y,(x===cx-13||y===45)?P.s5:P.s3);
    for (x=0;x<SW;x+=60){ if (x>110 && x<470) continue; facade(F,x,52,26,GB,cols[Math.floor(r()*4)],x+5,{}); } for (x=0;x<SW;x+=120) lampN(N,x+60,GB+10); for (x=10;x<SW;x+=90){ if (x>400 && x<460) continue; treeN(N,x,GB+8,34,r); } }
  else if (view==='cathedral'){ var c0=260; for (y=24;y<GB;y++) for (x=c0;x<c0+90;x++){ var cc5=tex.ashlar(x,y,R('t2 t3 s3 s4'),6,4); F.px(x,y,cc5); }
    [c0+4,c0+70].forEach(function(t0){ for (y=-2;y<GB;y++) for (var xx=t0;xx<t0+16;xx++){ var cc6=tex.ashlar(xx,y,R('s2 s3 s4 s5'),5,4); if (xx===t0) cc6=P.s5; F.px(xx,y,cc6); } for (y=8;y<20;y++){ F.px(t0+6,y,P.k1); F.px(t0+7,y,P.k1); F.px(t0+9,y,P.k1); F.px(t0+10,y,P.k1); } for (y=-2;y<6;y++) for (xx=t0+2;xx<t0+14;xx++) if (Math.abs(xx-t0-8)<(y+4)*0.8) F.px(xx,y,P.m2); });
    F.ellipse(c0+45,32,7,7,P.k2); F.ellipse(c0+45,32,5,5,P.d3); F.px(c0+45,32,P.y3); for (y=42;y<GB;y++) for (x=c0+38;x<c0+52;x++) if (Math.abs(x-c0-45)<7-(y<45?(45-y):0)) F.px(x,y,P.k1);
    for (x=0;x<SW;x+=64){ if (x>220 && x<380) continue; facade(F,x,58,22+Math.floor(r()*10),GB,cols[Math.floor(r()*3)],x+7,{shop:P.g2}); } for (x=0;x<SW;x+=100) lampN(N,x+50,GB+10); }
  else if (view==='river'){ for (y=34;y<SH;y++) for (x=0;x<SW;x++){ var cc7=(y<38)?P.s3:((y<44)?((x%10===0)?P.s2:P.s3):(((x+y*3)%11<2)?P.g3:P.g2)); F.px(x,y,cc7); }
    for (x=0;x<SW;x+=58) facade(F,x,52,8+Math.floor(r()*8),34,cols[Math.floor(r()*4)],x+11,{roof:P.t2});
    var bx=160; for (y=36;y<46;y++) for (x=bx;x<bx+70;x++){ var u4=(x-bx)%35, ar=y>39 && Math.abs(u4-17)<13-Math.max(0,(y-40)*0)-(y<42?(42-y)*2:0); F.px(x,y,ar?P.g1:P.s4); } for (x=bx-4;x<bx+74;x++){ F.px(x,35,P.s5); F.px(x,34,P.s3); }
    var vx=420; for (y=6;y<34;y++) for (x=vx;x<vx+110;x++){ var st=((y>>1)&1)?P.t3:P.y3; if ((x-vx)%14<2) st=P.s4; F.px(x,y,st); }
    for (y=6;y<34;y+=4) for (x=vx-2;x<vx+112;x++) F.px(x,y,P.m2); for (x=vx-2;x<vx+112;x+=6) for (y=6;y<34;y++) F.px(x,y,P.m2);
    for (y=10;y<30;y++) for (x=vx+30;x<vx+80;x++) if (bayer(x,y)<0.75) F.px(x,y,P.g2);            // grüne Plane
    for (x=0;x<SW;x+=12){ N.vl(x,GB-2,GB+6,P.k1); } for (x=0;x<SW;x++) N.px(x,GB-2,P.k1); for (x=0;x<SW;x+=110) lampN(N,x+20,GB+10); for (x=60;x<SW;x+=160) treeN(N,x,GB+8,40,r); }
  else if (view==='bascarsija'){ for (x=0;x<SW;){ var w3=28+Math.floor(r()*14), top3=30+Math.floor(r()*6); for (y=top3;y<GB;y++) for (var xx3=x;xx3<x+w3;xx3++){ var cc8=(y<top3+8)?((xx3+y)%5===0?P.t1:P.t3):(((xx3-x)%7===0)?P.w1:P.w2); if (y>top3+12 && y<GB-3 && (xx3-x)>3 && (xx3-x)<w3-3) cc8=(y<top3+14)?P.w3:P.k2; F.px(xx3%SW,y,cc8); } x+=w3+1; }
    var sx=330; for (y=22;y<GB;y++) for (x=sx-10;x<=sx+10;x++){ var cc9=(y<32)?((Math.hypot(x-sx,(y-32)*1.2)<10)?P.g3:T):((y<36)?P.g2:P.w2); if (cc9!==T) F.px(x,y,cc9); } F.vl(sx,16,22,P.y3);
    for (y=0;y<GB;y++) for (x=500;x<506;x++) F.px(x,y,(x===500)?P.s5:P.s3); for (y=-2;y<8;y++) for (x=500;x<506;x++) if (Math.abs(x-502.5)<(y+3)*0.35) F.px(x,y,P.m2);
    for (x=0;x<SW;x+=90) lampN(N,x+45,GB+10); for (x=40;x<SW;x+=70+Math.floor(r()*50)) walkerN(N,x,GB+5,[P.c1,P.k2,P.w1,P.m1][Math.floor(r()*4)],r); }
  else { // city: österreichisch-ungarische Fassaden, Läden mit Markisen, Seitenstraßen
    var SIGNS=['PEKARA','APOTEKA','KAFE','OPTIKA','KNJIGE','CVIJEĆE','MESNICA','FOTO','OBUĆA','SAT'], si=0;
    for (x=0;x<SW;){ var w4=48+Math.floor(r()*30), top4=6+Math.floor(r()*14); if (r()<0.15){ x+=16; continue; } facade(F,x,w4,top4,GB,cols[Math.floor(r()*cols.length)],x*3+1,{shop:[P.r2,P.g2,P.b1,P.y2][Math.floor(r()*4)],roof:P.t2,sign:SIGNS[si%SIGNS.length],signCol:[P.g1,P.r1,P.b0,P.w0][si%4]}); si++; x+=w4; }
    for (x=24;x<SW;x+=57+Math.floor(r()*40)) walkerN(N,x,GB+5,[P.c1,P.k2,P.w1,P.m1,P.r1][Math.floor(r()*5)],r);
    for (x=0;x<SW;x+=92) lampN(N,x+30,GB+10); for (x=70;x<SW;x+=184) treeN(N,x,GB+8,42,r); carN(N,150,GB+10,P.r2); carN(N,410,GB+10,P.s4); carN(N,600,GB+10,P.b1); }
  // Fahrleitungsmasten der Gegenrichtung
  for (x=17;x<SW;x+=150){ N.vl(x,0,GB+8,P.m2); N.vl(x+1,0,GB+8,P.m1); }
  for (x=0;x<SW;x++) N.px(x,3,P.k1);
  // Wetter und Tageszeit
  if (wea==='snow'||view==='cathedral'){ for (y=GB;y<GB+6;y++) for (x=0;x<SW;x++) if (hash(x,y)<0.7) F.px(x,y,P.s6); }
  var skyF=new Uint8Array(SW*SH); for (k=0;k<SW*SH;k++) skyF[k]=(F.d[k]===sk.d[k] && Math.floor(k/SW)<GB)?1:0;
  if (wea==='snow'||view==='cathedral'){ for (y=1;y<GB;y++) for (x=0;x<SW;x++){ var kk=y*SW+x; if (skyF[kk]) continue; if (skyF[kk-SW] && hash(x,y)<0.85){ F.d[kk]=P.s6; if (y+1<GB && !skyF[kk+SW] && hash(x+1,y)<0.5) F.d[kk+SW]=P.s5; } } }
  if (wea==='fog'||wea==='snow'||wea==='rain'){ var fc=tod==='night'?P.m1:(tod==='dusk'?P.m2:P.s4), fa=wea==='fog'?0.55:0.3; M.fogBake(F,function(x,y){ return skyF[y*SW+x]?0:fa*(1-y/SH*0.4); },{col:fc}); M.fogBake(N,function(){ return fa*0.4; },{col:fc}); }
  if (tod!=='day'){ var tt=M.TINT[tod]||M.TINT.dawn; M.tintApply(F,tt,0,0,SW,SH,function(x,y){ return !skyF[y*SW+x]; }); M.tintApply(N,tt);
    WLIT.forEach(function(w){ if (w[2]<(tod==='night'?0.42:0.3)) for (var yy=w[1]+1;yy<w[1]+4;yy++){ F.px(w[0],yy,w[2]<0.12?P.y4:P.y3); F.px((w[0]+1)%SW,yy,P.y2); } });
    NLAMP.forEach(function(l){ N.px(l[0],l[1],P.l1); N.px(l[0]-1,l[1],P.y4); N.px(l[0]+1,l[1],P.y4); N.px(l[0],l[1]+1,P.y3); for (var yy=l[1]+2;yy<l[1]+9;yy++) if (bayer(l[0],yy)<0.4-(yy-l[1])*0.04) N.px(l[0]+((yy>>1)&1),yy,P.y2); }); }
  return (STRIP[key]={F:F,N:N}); }

// ---------------------------------------------------------------- Wagenkasten: Rückwand, Boden, Decke
function backWall(x,y){ // y in Rückwand-Pixeln
  if (y<CT+1) return P.m2;
  if (y<26){ return (y===CT+1)?P.s4:((y===25)?P.m2:P.s5); }                        // Voute über den Fenstern
  if (y<WIN.y1+4){ return P.m3; }                                                     // Fensterband (Rahmen werden darauf gemalt)
  if (y<98) return (((x+400)%38)===0)?P.s3:((y===WIN.y1+4)?P.s6:P.s4);                 // Wandverkleidung
  return (y===98)?P.m3:(((x+y)%3===0)?P.m1:P.m2);                                      // Heizungskanal
}
function floorAt(x,y,wet){ var t=(FL-VY)/(y-VY), xb=VX+(x-VX)*t, d=y-FL, per=1.8+d*0.05, rib=Math.floor(d/per), fr=d/per-rib, c=(fr<0.34)?P.m0:P.m1;
  if (fr>0.7) c=P.m2; var seam=((xb+4000)%64); if (seam<1.2*t+0.4) c=P.k2;
  var glow=Math.exp(-Math.pow((xb-160)/120,2))*Math.exp(-Math.pow((d-12)/14,2)); if (glow>0.45 && fr>0.6) c=P.m3;
  if (wet){ var n=fbm(xb*0.04,d*0.22,7), door=Math.exp(-Math.pow((xb-255)/40,2)); if (n+door*0.25>0.66){ c=(fr>0.5)?P.s3:P.m2; if (n+door*0.25>0.74) c=(fr>0.5)?P.s4:P.s3; } else if (n>0.6 && fr>0.6) c=P.m3; }
  return c; }
function paintBox(b,wet){ var x, y;
  M.box(b,{vp:[VX,VY],rect:[0,CT,CAB.x0,FL],
    back:function(u,v,x,y){ return backWall(x,y); },
    side:function(u,v,x,y,sd){ if (sd!=='R') return P.m2; var V=v+CT; if (V<26) return P.s4; if (V<70){ return (u<3||u>24)?P.m2:P.c1; } if (V<74) return P.m3; return (V<FL-6)?P.s4:P.m2; },
    floor:function(xb,d,x,y){ return floorAt(x,y,wet); },
    ceil:function(xb,d,x,y){ var c=(d%6===0)?P.s4:P.s5; if (Math.abs(((xb+400)%80)-40)<1) c=P.s4; return c; } });
  // Fußleiste
  for (x=0;x<CAB.x0;x++){ b.px(x,FL,P.k2); b.px(x,FL-1,P.m1); } }
function paintWindows(b,S){ var x, y;
  WIN.cols.forEach(function(x0,i){ var x1=x0+WIN.w, y0=WIN.y0, y1=WIN.y1, vy=y0+11;
    for (y=y0-2;y<y1+2;y++) for (x=x0-2;x<x1+2;x++){ var inG=(x>=x0&&x<x1&&y>=y0&&y<y1&&y!==vy&&y!==vy+1); if (inG){ glassPx(x,y); continue; }
      var c=(x===x0-2||y===y0-2)?P.m4:((x===x1+1||y===y1+1)?P.m1:P.m3); if (y===vy||y===vy+1) c=(y===vy)?P.m4:P.m1; if (x===x0-1||x===x1||y===y0-1||y===y1) c=P.k2; b.px(x,y,c); }
    // Klappfenster oben: Griff und Riegel, eines leicht gekippt
    b.px(x0+2,vy-2,P.m4); b.px(x1-3,vy-2,P.m4);
    b.rect(x0+WIN.w/2-2,vy-1,4,1,P.m1); if (i===3){ for (x=x0;x<x1;x++) b.px(x,y0+1,P.m2); }
    // Sims
    for (x=x0-3;x<x1+3;x++){ b.px(x,y1+2,P.s6); b.px(x,y1+3,P.m3); } });
  // Säulen zwischen den Fenstern mit Kabelkanal, Kleber „Nicht hinauslehnen“
  for (var k=0;k<WIN.cols.length-1;k++){ var px=WIN.cols[k]+WIN.w+2; for (y=WIN.y0-2;y<WIN.y1+2;y++) for (x=px;x<WIN.cols[k+1]-2;x++) b.px(x,y,(x===px)?P.s5:P.s4); }
  b.rect(WIN.cols[2]+4,WIN.y1-8,6,5,P.r3); b.hl(WIN.cols[2]+4,WIN.cols[2]+9,WIN.y1-8,P.s6); b.px(WIN.cols[2]+6,WIN.y1-6,P.s6); }
function paintSeats(b){ var x, y, CU=R('r0 r1 r2 r3 t3');
  SEATS.forEach(function(sx,i){ var bt=SEAT.top-24, ct=SEAT.top;
    // Rückenlehne (gepolstert, Kunstleder) mit Haltegriff oben
    for (y=bt;y<ct+4;y++) for (x=sx;x<sx+4;x++){ var c=(x===sx)?CU[3]:((x===sx+3)?CU[0]:CU[2]); if (y===bt) c=CU[4]; if ((y-bt)%7===3 && x>sx) c=CU[1]; b.px(x,y,c); }
    b.hl(sx-1,sx+4,bt-1,P.m3); b.px(sx-1,bt-2,P.y3); b.px(sx+4,bt-2,P.y3); b.hl(sx,sx+3,bt-3,P.y4); b.hl(sx,sx+3,bt-2,P.y2);
    // Sitzfläche
    for (y=ct;y<ct+4;y++) for (x=sx+4;x<sx+19;x++){ var c2=(y===ct)?CU[4]:((y===ct+3)?CU[0]:CU[2]); if (x===sx+18) c2=CU[1]; if (y===ct+1 && (x-sx)%5===0) c2=CU[1]; b.px(x,y,c2); }
    // Gestell
    b.rect(sx+9,ct+4,3,SEAT.base-ct-4,P.m1); b.vl(sx+9,ct+4,SEAT.base-1,P.m3); b.hl(sx+5,sx+16,SEAT.base-1,P.m1); b.hl(sx+4,sx+17,ct+4,P.k2);
    for (x=sx+2;x<sx+18;x++) if (bayer(x,SEAT.base)<0.7) dk(b,x,SEAT.base,2); }); }
function paintFarStraps(b){ [57,95,133,171,209].forEach(function(sx){ b.px(sx,CT+5,P.m2); b.px(sx,CT+6,P.m2); b.px(sx-1,CT+7,P.k2); b.px(sx+1,CT+7,P.k2); b.px(sx-1,CT+8,P.k2); b.px(sx+1,CT+8,P.k2); b.px(sx,CT+9,P.k2); }); }
function paintPolesBack(b){ POLES.forEach(function(px){ for (var y=CT+3;y<FL+2;y++){ b.px(px,y,P.y3); b.px(px+1,y,P.y1); if (y%11===0) b.px(px,y,P.y4); } b.px(px,FL+2,P.m1); b.px(px+1,FL+2,P.m1); });
  for (var x=0;x<CAB.x0;x++){ b.px(x,CT+3,P.y3); b.px(x,CT+4,P.y1); } }
function paintJoint(b){ var x, y;
  // Faltenbalg: Falten aus Gummi (Licht oben links), Stirnrahmen des Wagenteils, dahinter ein Streifen des hinteren Wagens
  for (y=CT-2;y<FL+2;y++) for (x=0;x<JOINT.x1;x++){ var c;
    if (x<JOINT.x0-1){ c=backWall(x,y); if (y>=WIN.y0 && y<WIN.y1){ c=(x>JOINT.x0-4)?P.m3:P.c0; if (y===WIN.y0+11) c=P.m4; } if (y>=SEAT.top-24 && y<SEAT.top+4 && x>1 && x<5) c=(x===2)?P.r3:P.r1; if (y>=SEAT.top && y<SEAT.top+4 && x<2) c=P.r2; c=M.DN[c]; }
    else if (x<JOINT.x0+1){ c=(x===JOINT.x0)?P.s4:P.m1; }
    else { var f=(x-JOINT.x0)%5, bend=Math.sin((y-CT)/(FL-CT)*Math.PI); c=f===0?P.m3:(f===1?P.m2:(f===2?P.m1:(f===3?P.m0:P.k2))); if (bend<0.25 && f<2) c=P.m2; }
    if (y<CT+1||y>FL-1) c=P.k1; b.px(x,y,c); }
  for (y=CT-2;y<FL+2;y++){ b.px(JOINT.x1,y,P.s5); b.px(JOINT.x1+1,y,P.s4); b.px(JOINT.x1+2,y,P.m2); }
  for (x=JOINT.x0;x<JOINT.x1;x++){ b.px(x,CT+2,P.m3); b.px(x,FL-2,P.m1); }
  // Drehteller im Boden: runde Platte mit Riffelung und Ring
  var cx=16, cy=121, rx=30, ry=8.5; for (y=Math.floor(cy-ry);y<=cy+ry;y++) for (x=0;x<cx+rx;x++){ var dx=(x-cx)/rx, dy=(y-cy)/ry, d=dx*dx+dy*dy; if (d>1) continue; var c2=(((x*2+y*3)%6)<2)?P.m2:P.m3; if (d>0.82) c2=(d>0.92)?P.k2:P.s3; if (d<0.06) c2=P.m1; b.px(x,y,c2); } }
function paintDoor(b){ var x0=DOOR.x0, x1=DOOR.x1, y0=DOOR.y0, x, y, n=4, pw=(x1-x0)/n;
  for (y=y0-2;y<FL+1;y++) for (x=x0-2;x<x1+2;x++){ if (x<x0||x>=x1||y<y0){ b.px(x,y,(x===x0-2||y===y0-2)?P.m4:P.m2); continue; }
    var k=Math.floor((x-x0)/pw), u=(x-x0)-k*pw, c=P.s4, gTop=y0+3, gBot=y0+52;
    if (u<1||u>=pw-1) c=P.k2; else if (u<2) c=P.m4; else if (u>=pw-2) c=P.m1;
    else if (y>=gTop && y<gBot && !(y>=y0+26 && y<y0+28)) { glassPx(x,y); c=P.c1; }
    else if (y>=y0+26 && y<y0+28) c=P.m3;
    else if (y>FL-6) c=P.m1;
    b.px(x,y,c); }
  // Gummi zwischen den Flügeln, Griffstangen innen, Stufe mit gelber Kante
  b.vl(x0+2*pw-1,y0,FL,P.k1); b.vl(x0+2*pw,y0,FL,P.k1);
  [x0+pw-3,x0+3*pw+2].forEach(function(hx){ b.vl(hx,y0+30,y0+50,P.y3); });
  b.rect(x0+4,y0-9,x1-x0-8,6,P.k1); b.hl(x0+4,x1-5,y0-9,P.m2); for (var i=0;i<4;i++) b.px(x0+8+i*10,y0-6,i===1?P.g4:P.r3);   // Türanzeige
  b.rect(x0+20,FL-3,6,2,P.y4); b.hl(x0+21,x0+24,FL-3,P.l0);   // Stufenlicht
  for (y=FL+1;y<FL+14;y++){ var t=(y-FL)/14, l=lerp(x0,x0-6,t), r=lerp(x1,x1+6,t); for (x=Math.floor(l);x<Math.ceil(r);x++){ var c3=(y<FL+3)?P.y3:((((x+y)%3)===0)?P.k1:P.m0); if (y===FL+13) c3=P.y2; b.px(x,y,c3); } } }
function paintCab(b){ var x, y;
  // Glaswand der Fahrerkabine (rechte Stirnseite, perspektivisch): Rahmen, oben Glas; dahinter Fahrersitz, Pult mit Lämpchen
  // und die Frontscheibe, durch die man die Straße sieht (gehört zum Glas, zieht also mit vorbei)
  for (y=0;y<H;y++) for (x=CAB.x0;x<W;x++){ var t=(CAB.x0-VX)/(x-VX), v=VY+(y-VY)*t; if (v<CT||v>=FL) continue; var u=(1/t-1)*(CAB.x0-VX);
    if (v>=27 && v<70 && u>3 && u<25){ var cc;
      if (v<46 && u>6 && u<22){ glassPx(x,y); cc=P.c1; }                                   // Frontscheibe weit hinten
      else if (v>=58) cc=(v<60)?P.m3:P.m1;                                                   // Pult
      else if (u>9 && u<17 && v>=44) cc=(u<10||u>15)?P.k1:P.k2;                              // Sitzlehne
      else cc=P.c0;
      b.px(x,y,cc); }
    else if (v>=24 && v<27) b.px(x,y,P.m4);
    else if (v>=70 && v<74) b.px(x,y,P.m3);
    else if (v>=74 && u>8 && u<18 && v<FL-4) b.px(x,y,((v|0)%4===0)?P.s3:P.s4); }       // Kabinentür unten
  // Lämpchen auf dem Pult, Fahrzeugnummer, Spiegelung im Glas
  [[294,82,P.r3],[297,83,P.g4],[300,84,P.y4],[303,85,P.g4],[306,86,P.r4]].forEach(function(q){ if (!GLASS[q[1]*W+q[0]]) b.px(q[0],q[1],q[2]); });
  M.microText(b,'251',290,99,P.m1);
  for (y=34;y<70;y++){ var gx=CAB.x0+6+Math.round((y-34)*0.3); if (!GLASS[y*W+gx]) b.px(gx,y,P.c2); }
}
function paintRoute(b,line){ var x0=ROUTE.x0, x1=ROUTE.x1, y0=ROUTE.y0, y1=ROUTE.y1, x;
  b.rect(x0,y0,x1-x0,y1-y0,P.s6); b.hl(x0,x1-1,y0,P.m3); b.hl(x0,x1-1,y1-1,P.m2); b.vl(x0,y0,y1-1,P.m3); b.vl(x1-1,y0,y1-1,P.m2);
  var txt=line==='3'?'3 ILIDŽA - BAŠČARŠIJA':'1 ŽELJ. STANICA - BAŠČARŠIJA', tw=M.microWidth(txt);
  b.rect(x0+2,y0+2,7,7,line==='3'?P.r2:P.b1); M.microText(b,txt.slice(0,1),x0+4,y0+3,P.s6); M.microText(b,txt.slice(2),x0+12,y0+2,P.k1);
  for (x=x0+12;x<x1-4;x++) b.px(x,y0+8,line==='3'?P.r3:P.b2); var n=line==='3'?16:9; for (var i=0;i<n;i++){ var sx=rd(lerp(x0+12,x1-5,i/(n-1))); b.px(sx,y0+7,P.k2); b.px(sx,y0+8,P.s6); b.px(sx,y0+9,P.k2); } }
function paintAd(b){ var x0=AD.x0, x1=AD.x1, y0=AD.y0, y1=AD.y1, x, y;
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++) b.px(x,y,(y<y0+2)?P.w3:P.w2); b.hl(x0,x1-1,y0,P.m3); b.hl(x0,x1-1,y1-1,P.w0);
  // Džezva und Tasse, „KAFA“
  b.rect(x0+3,y0+3,4,5,P.y3); b.px(x0+3,y0+3,P.y5); b.line(x0+7,y0+5,x0+10,y0+3,P.w0); b.px(x0+5,y0+2,P.s5); b.px(x0+4,y0+1,P.s4);
  M.microText(b,'KAFA',x0+13,y0+2,P.s6); b.rect(x0+28,y0+5,4,3,P.s6); b.px(x0+32,y0+6,P.s5); }
function paintDetails(b){ var x, y, i;
  // Feuerlöscher neben der Kabinenwand, Nothammer an einer Säule, Haltewunsch-Taster, Nieten in der Voute
  b.rect(279,84,4,12,P.r2); b.vl(279,84,95,P.r3); b.hl(279,282,83,P.k1); b.px(280,82,P.k1); b.px(281,86,P.s5);
  b.rect(WIN.cols[3]+WIN.w+3,WIN.y0+4,3,6,P.r3); b.px(WIN.cols[3]+WIN.w+4,WIN.y0+3,P.k1);
  POLES.forEach(function(px,i){ if (i===0) return; b.rect(px-1,78,4,3,P.r2); b.px(px,79,P.r4); });
  for (x=4;x<CAB.x0;x+=8){ b.px(x,CT+2,P.m3); b.px(x,24,P.m2); }
  // Heizungsgitter unter den Sitzen, Handlauf an der Wand
  for (x=36;x<230;x+=3) b.vl(x,99,102,P.m0);
  for (x=34;x<230;x++){ b.px(x,80,P.m4); b.px(x,81,P.m1); }
  // Aufkleber: Kinderwagen, Rauchverbot, Ausgang über der Tür
  b.rect(DOOR.x0-10,WIN.y0+2,7,7,P.b1); b.px(DOOR.x0-8,WIN.y0+4,P.s6); b.hl(DOOR.x0-9,DOOR.x0-5,WIN.y0+6,P.s6); b.px(DOOR.x0-8,WIN.y0+7,P.s6); b.px(DOOR.x0-6,WIN.y0+7,P.s6);
  var nx=WIN.cols[1]+WIN.w+3; b.ellipse(nx+3,WIN.y0+19,3.4,3.4,P.r3); b.ellipse(nx+3,WIN.y0+19,2.2,2.2,P.s6); b.hl(nx+1,nx+5,WIN.y0+19,P.k2); b.px(nx+6,WIN.y0+18,P.s4); b.line(nx+1,WIN.y0+21,nx+5,WIN.y0+17,P.r3);
  b.rect(DOOR.x0+12,DOOR.y0-17,22,7,P.g2); b.hl(DOOR.x0+12,DOOR.x0+33,DOOR.y0-17,P.g4); M.microText(b,'IZLAZ',DOOR.x0+13,DOOR.y0-16,P.s6);
  // Kratzer und ein Name in den Lehnen, eine liegengebliebene Zeitung, ein weggeworfener Fahrschein
  [[SEATS[1]+1,77],[SEATS[3]+2,80],[SEATS[4]+1,74]].forEach(function(q){ b.px(q[0],q[1],P.r3); b.px(q[0]+1,q[1]+1,P.r3); b.px(q[0],q[1]+3,P.t3); });
  var nz=SEATS[4]+5; b.rect(nz,SEAT.top-2,10,2,P.s5); b.hl(nz,nz+9,SEAT.top-2,P.s6); for (x=nz+1;x<nz+9;x+=2) b.px(x,SEAT.top-1,P.m2);
  b.rect(92,129,3,2,P.y3); b.px(93,129,P.y4); b.px(170,136,P.s5); b.px(171,136,P.s4);
  // Lüftungsgitter und Lautsprecher in der Decke
  for (i=0;i<4;i++){ var gx=30+i*80; for (x=gx;x<gx+12;x+=2) b.px(x,10,P.m2); }
  b.ellipse(250,11,3,1.2,P.m2); b.px(250,11,P.k2);
  // Fahrpreis am Türpfosten, Bodenluke am Gelenk
  b.rect(209,84,12,13,P.s6); b.hl(209,220,84,P.b1); M.microText(b,'KM',211,86,P.k1); for (x=210;x<219;x+=2){ b.px(x,93,P.m2); b.px(x,95,P.m2); }
  for (x=40;x<56;x++){ b.px(x,126,P.m0); b.px(x,131,P.m0); } b.vl(40,126,131,P.m0); b.vl(55,126,131,P.m0); b.px(47,128,P.m3); b.px(48,128,P.m3); }
// nasse Fußspuren von der Tür in den Gang (bei Regen und Schnee)
function paintFootprints(b,wea){ if (wea!=='snow' && wea!=='rain') return; var r=M.rng(17), x=262, y=128, k;
  for (k=0;k<22;k++){ x-=7+Math.floor(r()*4); y+=Math.round((r()-0.55)*3); if (y<118) y=118; if (y>136) y=136; if (x<40) break; var ox=(k&1)?0:3, oy=(k&1)?-2:2;
    b.px(x+ox,y+oy,P.s3); b.px(x+ox+1,y+oy,P.s3); b.px(x+ox+2,y+oy,P.m3); if (wea==='snow' && r()<0.5) b.px(x+ox+1,y+oy-1,P.s4); } }
function paintLamps(b){ LAMPS.forEach(function(lx){ b.rect(lx-14,4,28,4,P.s4); b.hl(lx-14,lx+13,4,P.m3); b.hl(lx-13,lx+12,5,P.l1); b.hl(lx-13,lx+12,6,P.s6); b.hl(lx-14,lx+13,8,P.m2); }); }
function paintValidator(b){ var x=VAL.x, y=VAL.y; b.rect(x-4,y,9,12,P.t3); b.vl(x-4,y,y+11,P.t4); b.vl(x+4,y,y+11,P.t1); b.hl(x-4,x+4,y,P.t5); b.rect(x-2,y+2,5,2,P.k1); b.px(x-2,y+2,P.k2);
  b.rect(x-2,y+6,5,3,P.k2); b.px(x-1,y+7,P.g4); b.px(x+1,y+7,P.g4); b.hl(x-3,x+3,y+11,P.t1); }

// ---------------------------------------------------------------- Bild
var BASEB=null;
var FOCUS={city:0,towers:0,unitic:160,yellow:275,museum:395,cathedral:305,river:445,bascarsija:330};
function stillOff(v){ return ((FOCUS[v]||0)-130+SW)%SW; }
function viewOf(S){ var v=S&&S.view; return (v && /^(city|towers|unitic|yellow|museum|cathedral|river|bascarsija)$/.test(v))?v:'city'; }
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0), x, y, wet=(wea==='snow'||wea==='rain');
  GLASS.fill(0);
  paintBox(b,wet); paintJoint(b); paintWindows(b,S); paintDoor(b); paintCab(b); paintPolesBack(b); paintFarStraps(b); paintSeats(b); paintRoute(b,(S&&S.line)==='3'?'3':'1'); paintAd(b); paintValidator(b); paintDetails(b); paintFootprints(b,wea); paintLamps(b);
  // Licht: Röhren oben, Boden zur Kamera dunkler, Ecken weich
  // Licht: Röhren oben werfen helle Inseln auf Boden und Sitze, Boden zur Kamera dunkler, Ecken weich, Schatten unter den Sitzen
  var LP=[M.lf.vignette(W,H,1.1),M.lf.band(128,H,0,-0.55),M.lf.pool(160,60,170,60,0.22)];
  LAMPS.forEach(function(lx){ LP.push(M.lf.pool(lx,118,34,9,0.45)); LP.push(M.lf.pool(lx,84,30,22,0.25)); });
  SEATS.forEach(function(sx){ LP.push(M.lf.pool(sx+11,SEAT.base+1,12,2.5,-0.9)); });
  M.light(b,M.lf.sum.apply(null,LP),0,0,function(x,y){ return !GLASS[y*W+x] && y>8; });
  // Außenansicht (Standbild); dynamic ersetzt sie, wenn die Bahn fährt
  var vw=viewOf(S), st=buildStrip(vw,tod,wea), so=stillOff(vw); GL=[]; for (var k=0;k<W*H;k++) if (GLASS[k]) GL.push(k);
  GL.forEach(function(k){ var x=k%W, y=(k/W)|0, sy=y-SY0; if (sy<0||sy>=SH) return; var n=st.N.d[sy*SW+((x+so)%SW)], c=(n!==T)?n:st.F.d[sy*SW+((x+so)%SW)]; b.d[k]=c; });
  var key=neonKey(tod); if (key) M.tintApply(b,NEON[key],0,0,W,H,function(x,y){ return !GLASS[y*W+x]; });
  BASEB=b; return b; }

// ---------------------------------------------------------------- Ebenen: Stangen im Gang (schaukeln, wenn die Bahn fährt)
function nearPole(p){ return { base:p.base, draw:function(fb,v,S,GS){ var sw=(S&&S.moving)?Math.round(Math.sin(v.t*1.9+p.x)*0.7):0, x=p.x+sw, tod=v.tod, c1=P.y3, c2=P.y1, c3=P.y4;
    for (var y=0;y<p.base;y++){ var xx=x+(y<40?0:0); if (xx<0||xx>=fb.w) continue; fb.px(xx,y,c1); fb.px(xx+1,y,c2); if (y%13===5) fb.px(xx,y,c3); }
    fb.px(x-1,p.base,P.m1); fb.px(x,p.base,P.m1); fb.px(x+1,p.base,P.m1); fb.px(x+2,p.base,P.m1); } }; }
function layers(S,GS,tod){ return NEAR.map(nearPole); }

// ---------------------------------------------------------------- Bewegung: Stadt hinter den Scheiben, Lichter, Schlaufen, Neonflackern, Wetter am Glas
var STRAPS=[56,96,136,176,252];
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, wea=M.scn.weather(GS), mv=!!(S&&S.moving), st=buildStrip(viewOf(S),tod,wea), x, y, i;
  if (!GL) return;
  var so=stillOff(viewOf(S)), oF=(mv?Math.floor(t*16):0)+so, oN=(mv?Math.floor(t*44):0)+so, gk=neonKey(tod);
  if (mv){ for (i=0;i<GL.length;i++){ var k=GL[i], gx=k%W, gy=(k/W)|0, sy=gy-SY0; if (sy<0||sy>=SH) continue; var n=st.N.d[sy*SW+((gx+oN)%SW)], c=(n!==T)?n:st.F.d[sy*SW+((gx+oF)%SW)]; fb.d[k]=c; } }
  // Spiegelungen der Röhren im Glas, Beschlag unten an den Scheiben
  WIN.cols.forEach(function(x0){ for (x=x0+3;x<x0+WIN.w-3;x+=2){ var k2=(WIN.y0+2)*W+x; if (tod!=='day') fb.d[k2]=M.UP[fb.d[k2]]; }
    if (wea==='snow'||tod==='night') for (y=WIN.y1-7;y<WIN.y1;y++) for (x=x0;x<x0+WIN.w;x++){ if (bayer(x,y)<(y-WIN.y1+8)/9){ var k3=y*W+x; fb.d[k3]=M.mix(fb.d[k3],P.s4,3); } } });
  // nachts spiegeln sich die Röhren und die Sitzlehnen schwach in den Scheiben
  if (tod!=='day') WIN.cols.forEach(function(x0){ for (x=x0+1;x<x0+WIN.w-1;x++){ var k5=(WIN.y0+4)*W+x; if (GLASS[k5] && (x>>1)%5!==0) fb.d[k5]=M.mix(fb.d[k5],P.s5,tod==='night'?3:2); }
    for (y=WIN.y1-9;y<WIN.y1-1;y++){ var k6=y*W+x0+4; if (GLASS[k6]) fb.d[k6]=M.mix(fb.d[k6],P.r1,2); var k7=y*W+x0+5; if (GLASS[k7]) fb.d[k7]=M.mix(fb.d[k7],P.r1,2); } });
  // Schnee und Regen außen am Glas
  if (wea==='snow'||wea==='rain'){ for (i=0;i<26;i++){ var wx=Math.floor(hash(i,3)*W), sp=mv?60:14, wy=Math.floor((t*sp*(0.6+hash(i,4))+hash(i,5)*60)%60)+WIN.y0, dx=mv?-Math.floor((t*sp+hash(i,6)*300)%300):0, xx=((wx+dx)%W+W)%W; var k4=wy*W+xx; if (wy<H && GLASS[k4]){ fb.d[k4]=wea==='snow'?P.s6:P.m4; if (mv && GLASS[k4-1]) fb.d[k4-1]=wea==='snow'?P.s4:P.m3; } } }
  if (wea==='snow'||wea==='rain'){ for (i=0;i<6;i++){ var dx2=DOOR.x0+4+Math.floor(hash(i,21)*(DOOR.x1-DOOR.x0-8)), dy2=DOOR.y0+4+Math.floor(((t*(3+hash(i,22)*4))+hash(i,23)*40)%46), kd=dy2*W+dx2; if (GLASS[kd]){ fb.d[kd]=P.s5; if (GLASS[kd-W]) fb.d[kd-W]=M.mix(fb.d[kd-W],P.s5,3); } } }
  // Lichter, die vorbeihuschen: ein heller Streifen über Boden und Wand
  if (mv && tod!=='day'){ var ph=(t*0.37)%1; if (ph<0.4){ var bx=Math.floor(W+40-ph/0.4*(W+80)); for (y=WIN.y1+4;y<H;y+=1) for (x=bx-10;x<bx+10;x++){ if (x<0||x>=W) continue; var kk=y*W+x; if (GLASS[kk]) continue; if (bayer(x,y)<(1-Math.abs(x-bx)/10)*0.35) fb.d[kk]=M.UP[fb.d[kk]]; } } }
  // Haltegriffe (Schlaufen) an der vorderen Stange pendeln
  for (x=0;x<W;x++){ fb.px(x,1,P.y3); fb.px(x,2,P.y1); }
  STRAPS.forEach(function(sx,j){ var sw=mv?Math.round(Math.sin(t*1.9+j*0.9)*1.2):0; fb.px(sx,3,P.m2); fb.px(sx,4,P.m2); fb.px(sx+Math.round(sw*0.5),5,P.m2); fb.px(sx+Math.round(sw*0.5),6,P.m2);
    var cx=sx+sw; fb.px(cx-1,7,P.k2); fb.px(cx+1,7,P.k2); fb.px(cx-2,8,P.k2); fb.px(cx+2,8,P.k2); fb.px(cx-2,9,P.k2); fb.px(cx+2,9,P.k2); fb.px(cx-1,10,P.k2); fb.px(cx,10,P.k2); fb.px(cx+1,10,P.k2); });
  // Neon flackert selten
  var fl=Math.floor(t*3.1)%23===0 && Math.sin(t*41)>0; if (fl){ var lx=LAMPS[1]; for (x=lx-13;x<lx+13;x++){ fb.px(x,5,P.s4); fb.px(x,6,P.s4); } } }
function front(fb,v,S,GS){ }
// Geistersicht: an der Scheibe neben dem freien Platz zwei kleine Handabdrücke im Hauch und eine mit dem Finger gemalte „3“
function ghost(fb,v,S,GS){ var t=v.t, x0=WIN.cols[2], y0=WIN.y0, a=0.55+Math.sin(t*0.7)*0.15, x, y;
  for (y=y0+14;y<WIN.y1-1;y++) for (x=x0+2;x<x0+WIN.w-2;x++){ var d=Math.hypot((x-x0-16)/13,(y-y0-28)/12); if (d>1) continue; if (bayer(x,y+Math.floor(t*2))<(1-d)*0.5) fb.px(x,y,P.x3); }
  function hand(hx,hy){ [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2],[1,3],[2,3],[0,-2],[0,-3],[1,-3],[1,-4],[2,-3],[2,-4],[3,-3],[3,-2],[4,-1],[5,-2]].forEach(function(q){ if (bayer(hx+q[0],hy+q[1])<a+0.2) fb.px(hx+q[0],hy+q[1],P.x5); }); }
  hand(x0+6,y0+22); hand(x0+12,y0+21);
  var g=[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[2,3],[1,3],[3,4],[3,5],[3,6],[2,7],[1,7],[0,7]]; g.forEach(function(q){ if (bayer(x0+20+q[0],y0+18+q[1]+Math.floor(t))<a+0.25) fb.px(x0+20+q[0],y0+18+q[1],P.x6); });
  fb.px(x0+21,y0+27,P.x4); fb.px(x0+23,y0+26,P.x4); }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<114||y>138||x<20||x>300) return false;
  for (var i=0;i<NEAR.length;i++){ var p=NEAR[i]; if (Math.abs(x-p.x-0.5)<3 && Math.abs(y-p.base)<3) return false; }
  return true; }
M.defineArt('tramvaj',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=neonKey(tod); return k?NEON[k].a:null; },
  spots:{
    door:[DOOR.x0-2,DOOR.y0-10,DOOR.x1-DOOR.x0+4,FL-DOOR.y0+18],
    validator:[VAL.x-5,VAL.y-1,11,14],
    seat:[SEATS[2]-1,SEAT.top-27,21,SEAT.base-SEAT.top+27],
    window:[WIN.cols[2]-2,WIN.y0-2,WIN.w+4,WIN.y1-WIN.y0+4],
    route:[ROUTE.x0,ROUTE.y0,ROUTE.x1-ROUTE.x0,ROUTE.y1-ROUTE.y0],
    cab:[CAB.x0,8,W-CAB.x0,104],
    joint:[0,CT-2,JOINT.x1+3,FL-CT+22],
    ad:[AD.x0,AD.y0,AD.x1-AD.x0,AD.y1-AD.y0],
    lamp:[LAMPS[1]-15,3,30,7]
  },
  stands:{
    door:[256,124,'B'], validator:[222,120,'B'], seat:[128,118,'B'], window:[132,116,'B'], route:[150,120,'B'], cab:[290,124,'R'], joint:[34,124,'L'], ad:[54,120,'B'], lamp:[130,124,'B']
  },
  actorPos:{ kontrolor:[244,126,'L'], babica:[46,SEAT.base,'R'], student:[200,127,'F'], mala:[160,SEAT.base,'R'] },
  start:[252,126,'L'], entries:{ stanica:[252,126,'L'], carsija:[252,126,'L'], neboder:[252,126,'L'] }
});
})(M);
