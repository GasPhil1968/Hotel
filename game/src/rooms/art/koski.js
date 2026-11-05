/* ===== rooms/art/koski.js — Hof der Koski-Mehmed-Pascha-Moschee (320 px) =====
   Links das Tor in der Hofmauer. Dahinter die kleine Moschee aus hellem Stein: Vorhalle mit drei Bögen und kleinen Kuppeln,
   darüber die große, bleigraue Kuppel; rechts daneben das schlanke Minarett (Tür am Fuß, Šerefe, Kegeldach mit schlichter
   Spitze, ohne Zeichen). Neben der Minaretttür das Kassenhäuschen mit dem Schild „ULAZNICA / TICKET / MINARET“ (der
   Kassierer sitzt darin, Oberkörper im Fenster). Im Hof das Kieselmosaik (helle und dunkle Flusskiesel in Ringen und
   Bändern), der Šadrvan mit achteckigem Becken und Holzdach, ein kahler Granatapfelbaum mit einer letzten Frucht. Hinter
   der niedrigen Hofmauer der berühmte Blick: die Neretva tief unten und die Alte Brücke im Profil, ein Bogen von Fels zu
   Fels mit den beiden Türmen. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144, GY=106;
// ---------------------------------------------------------------- Geometrie
var GATE={x0:0,x1:26,spring:62};                         // Tor in der Hofmauer (links)
var MOS={x0:30,x1:148,wall:56,porch:70,dome:[90,52,30]}; // Moschee: Wandoberkante, Vorhalle, Kuppel [cx,Fuß,r]
var MIN={cx:157,base:GY,top:4,w:5,serefe:38};            // Minarett
var MDOOR={x0:153,x1:162,y0:86};                          // Minaretttür
var BOOTH={x0:166,x1:196,top:54,win0:61,sill:86,base:110};// Kassenhäuschen
var SIGN={x0:199,x1:235,y0:66,y1:86};                    // Schild auf dem Pfosten
var WALL={x0:198,top:86};                                 // niedrige Hofmauer rechts, darüber der Blick
var BR={cx:262,sp:76,span:30,rise:24,top:46};             // die Alte Brücke im Blick
var FOUNT={cx:96,base:112,r:16};                          // Šadrvan
var TREE={x:292,base:110};                                // Granatapfelbaum
var KASIR_Y=106;
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }

// ---------------------------------------------------------------- Licht (nur Tagesphasen vorgesehen; Dämmerung und Nacht trotzdem stimmig)
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  gdawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.44+10, g*0.2+L*0.44+15, b*0.2+L*0.44+27]; },
  grey:function(r,g,b){ var L=lum(r,g,b); return [r*0.58+L*0.32+4, g*0.58+L*0.32+6, b*0.58+L*0.32+12]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,w){ if (tod==='day') return w==='grey'?'grey':null; if (tod==='night') return 'night'; if (tod==='dawn') return w==='grey'?'gdawn':'dawn'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod){ if (tod==='day') return []; return [[(BOOTH.x0+BOOTH.x1)/2,90,24,22,0.8],[MOS.x0+60,84,50,20,0.45],[BR.cx,BR.sp-8,40,24,0.6],[FOUNT.cx,104,24,10,0.3]]; }

// ---------------------------------------------------------------- Masken
var SKYM=new Uint8Array(W*H), DEP=new Uint8Array(W*H), PAVE=new Uint8Array(W*H), BRM=new Uint8Array(W*H);
function stage(b,d,fn){ var s=b.d.slice(); fn(); for (var k=0;k<W*H;k++) if (b.d[k]!==s[k]) DEP[k]=d; }

// ---------------------------------------------------------------- Himmel
function paintSky(s,tod,w){ var x, y, r=M.rng(29);
  if (w==='rain'||w==='grey'){ M.scn.sky(s,0,0,W,H,tod,w,33); return; }
  if (tod==='day'){ for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(R('b0 b1 b2 b3 b4 b5'),(w==='bura'?0.05:0.15)+Math.pow(y/86,1.1)*0.82,x,y));
    for (var i=0;i<(w==='bura'?7:3);i++){ var cx=r()*W, cy=4+r()*26, L=30+r()*70, sl=w==='bura'?0.15:0.02; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy-k*sl+Math.sin(k*0.08+i)*1.2), a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.3) s.px(xx,yy,P.b5); } }
    return; }
  if (tod==='night'){ for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(R('k0 k1 k2 n0 n1'),0.05+Math.pow(y/96,1.3)*0.8,x,y)); for (var j=0;j<140;j++) s.px(Math.floor(r()*W),Math.floor(Math.pow(r(),1.4)*60),r()<0.15?P.n5:P.n3); return; }
  M.sky(s,0,0,W,100,tod,13); }

// ---------------------------------------------------------------- Der Blick über die Mauer: Hügel, Ufer, Fluss, die Alte Brücke
function miniHouse(b,x,base,w,h,sd,tile){ var y, xx; for (y=base-h;y<base;y++) for (xx=x;xx<x+w;xx++) b.px(xx,y,(xx===x+w-1)?P.s3:((hash(xx,y+sd)<0.08)?P.s4:P.s5));
  for (var k=0;k<3;k++) for (xx=x-1+k;xx<x+w+1-k;xx++) b.px(xx,base-h-1-k,tile?(k===2?P.t4:((xx+k)%3?P.t3:P.t2)):(k===2?P.s3:((xx+k)%3?P.s2:P.m2)));
  for (xx=x+1;xx<x+w-1;xx+=3) if (hash(xx,sd)<0.7) b.px(xx,base-h+2,P.k2); }
function viewScene(b,tod,w){ var x, y, x0=WALL.x0-30, r=M.rng(51);
  // Velež (fern, rechts) und Hügel im Norden
  for (x=x0;x<W;x++){ var t=rd(30+Math.sin(x*0.03+2)*6-(x-x0)*0.06+(vn(x*0.1,2,3)-0.5)*3); for (y=t;y<80;y++) b.px(x,y,ra(R('m2 s2 m3 s3 s4'),0.6-(y-t)*0.008+(fbm(x*0.12,y*0.15,4)-0.5)*0.4+(y===t?0.2:0),x,y)); }
  // Häuser an beiden Ufern (hinter der Brücke)
  x=x0; while (x<W){ var hw=5+Math.floor(r()*7), hh=5+Math.floor(r()*7), base=60+Math.floor(r()*6); miniHouse(b,x,base,hw,hh,rd(x),r()<0.35); x+=hw+1+Math.floor(r()*3); }
  x=x0; while (x<W){ var hw2=6+Math.floor(r()*9), hh2=6+Math.floor(r()*6), base2=70+Math.floor(r()*3); miniHouse(b,x,base2,hw2,hh2,rd(x)+9,false); x+=hw2+2+Math.floor(r()*4); }
  for (var i=0;i<6;i++){ var zx=x0+Math.floor(r()*(W-x0)), zy=70+Math.floor(r()*3); for (y=zy-8;y<zy;y++) b.px(zx,y,P.g1); }
  // Schlucht: Felsen links und rechts, unten die Neretva (fließt auf uns zu)
  for (y=64;y<WALL.top+2;y++) for (x=x0;x<W;x++){ var cxL=BR.cx-BR.span-8+(y-64)*0.4, cxR=BR.cx+BR.span+8-(y-64)*0.3;
    if (x<cxL||x>cxR){ var c=ra(R('m1 s1 s2 s3 s4'),0.5+(fbm(x*0.3,y*0.3,6)-0.5)*0.6+(x<cxL?0.05:-0.08),x,y); if (fbm(x*0.4,y*0.4,8)>0.64) c=(hash(x,y)<0.5)?P.g1:P.g2; b.px(x,y,c); } }
  var WR=w==='rain'?R('e1 a2 e2 a3 m3 s3'):(w==='grey'?R('a1 a2 m2 a3 m3 a4'):R('a1 a2 a3 a4 a5 a6'));
  for (y=BR.sp+2;y<WALL.top+2;y++){ var l=BR.cx-BR.span-6+(y-BR.sp)*0.4, rr=BR.cx+BR.span+6-(y-BR.sp)*0.3; for (x=Math.ceil(l);x<rr;x++){ var c2=ra(WR,0.4+(y-BR.sp)*0.03+(fbm(x*0.1,y*0.7,9)-0.5)*0.4,x,y); if (Math.sin(x*0.25+y*1.7)>0.9) c2=M.UP[c2]; b.px(x,y,c2); } }
  bridge(b); }
function bridge(b){ var cx=BR.cx, sp=BR.sp, a=BR.span, rise=BR.rise, r=(a*a+rise*rise)/(2*rise), cy=sp-rise+r, x, y; BRM.fill(0);
  function bp(xx,yy,c){ b.px(xx,yy,c); BRM[yy*W+xx]=1; }
  for (x=cx-a-12;x<=cx+a+12;x++){ var t=Math.min(1,Math.abs(x-cx)/(a+12)), dy=rd(BR.top+7*Math.pow(t,1.5)), inS=Math.abs(x-cx)<a, iy=inS?cy-Math.sqrt(Math.max(0,r*r-(x-cx)*(x-cx))):sp+1;
    for (y=dy-3;y<Math.min(iy,sp+3);y++){ var c=(y<dy-1)?((y===dy-3)?P.s6:P.s5):((y===dy-1)?P.s3:P.s5); if (inS && y>=iy-3) c=(y>=iy-1)?P.s3:P.s4;   // Brüstung, Gesims, Bogenring
      if (!inS && y>sp-8) c=((x+y)%3===0)?P.s3:P.s4; if (y>dy && y<iy-3 && ((x-cx)*0.4+y)%6<0.6) c=P.s4; bp(x,y,c); }
    if (inS) bp(x,rd(iy),P.k2); }
  // Kämpfer auf dem Fels: kein Pfeiler im Wasser
  for (x=cx-a-4;x<cx-a+3;x++) bp(x,sp+3,P.s2); for (x=cx+a-3;x<cx+a+4;x++) bp(x,sp+3,P.s2);
  // Türme: Tara (rechts, Ostufer, halbrund) und Halebija (links, Westufer, mit Dach)
  for (y=BR.top-12;y<BR.top+12;y++) for (x=cx+a+12;x<cx+a+24;x++){ var u=(x-(cx+a+18))/6; bp(x,y,ra(R('s2 s3 s4 s5'),0.62-u*0.3,x,y)); }
  for (x=cx+a+11;x<cx+a+25;x++){ bp(x,BR.top-13,P.s5); bp(x,BR.top-14,P.m2); } b.hl(cx+a+14,cx+a+22,BR.top-15,P.m2);
  for (y=BR.top-14;y<BR.top+12;y++) for (x=cx-a-24;x<cx-a-12;x++) bp(x,y,(x===cx-a-24)?P.s5:((x>cx-a-15)?P.s2:P.s4));
  for (var k=0;k<5;k++) for (x=cx-a-25+k;x<=cx-a-11-k;x++) bp(x,BR.top-15-k,P.m2);
  [[cx-a-20,BR.top-6],[cx-a-17,BR.top+2],[cx+a+16,BR.top-4],[cx+a+19,BR.top+4]].forEach(function(q){ b.px(q[0],q[1],P.k2); b.px(q[0],q[1]+1,P.k2); }); }

// ---------------------------------------------------------------- Moschee: Mauer, Vorhalle mit drei Bögen, kleine Kuppeln, große Kuppel
function dome(b,cx,base,r,h){ for (var y=rd(base-h);y<=base;y++) for (var x=rd(cx-r);x<=rd(cx+r);x++){ var u=(x-cx)/r, v=(base-y)/h, e=u*u+v*v; if (e>1) continue;
    var c=ra(R('m1 m2 m3 m4 s5'),0.75-u*0.4+(1-e)*0.12-(v<0.1?0.15:0),x,y); if (((x-rd(cx))&7)===0 && v>0.1) c=M.DN[c]; b.px(x,y,c); } }
function mosque(b,tod){ var x0=MOS.x0, x1=MOS.x1, x, y;
  // Gebetsraum: Steinquader, kleine Fenster mit Gittern, Tambour, große Kuppel mit schlichter Spitze
  for (y=MOS.wall;y<GY;y++) for (x=x0;x<x1;x++){ var c=tex.ashlar(x,y,R('s2 s3 s4 s5'),9,4); if (x>=x1-4) c=M.DN[c]; b.px(x,y,c); }
  for (x=x0;x<x1;x++){ b.px(x,MOS.wall,P.s5); b.px(x,MOS.wall+1,P.s2); }
  var dc=MOS.dome; for (y=dc[1]-4;y<dc[1]+1;y++) for (x=dc[0]-dc[2]-2;x<=dc[0]+dc[2]+2;x++) b.px(x,y,(y===dc[1]-4)?P.s5:P.s3);   // Tambour
  for (x=dc[0]-dc[2]+3;x<dc[0]+dc[2]-3;x+=7){ b.rect(x,dc[1]-3,2,2,P.k2); }
  dome(b,dc[0],dc[1]-4,dc[2],dc[2]*0.9); b.vl(dc[0],dc[1]-4-rd(dc[2]*0.9)-5,dc[1]-4-rd(dc[2]*0.9)-1,P.y2); b.px(dc[0],dc[1]-4-rd(dc[2]*0.9)-6,P.y3);
  [[x0+8,60],[x1-14,60]].forEach(function(q){ b.rect(q[0],q[1],6,8,P.k2); b.ellipse(q[0]+3,q[1],3,2,P.k2); for (var gx=q[0]+1;gx<q[0]+6;gx+=2) b.vl(gx,q[1]-1,q[1]+7,P.k1); b.hl(q[0]-1,q[0]+6,q[1]+8,P.s5); });
  // Vorhalle: drei Spitzbögen auf Säulen, darüber drei kleine Kuppeln
  var py=MOS.porch, n=3, bw=(x1-x0)/n;
  for (y=py;y<GY;y++) for (x=x0-2;x<x1+2;x++){ var c2=(y<py+4)?((y===py)?P.s6:P.s4):P.s5; b.px(x,y,c2); }
  for (var i=0;i<n;i++){ var ax0=rd(x0+i*bw+5), ax1=rd(x0+(i+1)*bw-5), acx=(ax0+ax1)/2, ah=12;
    for (y=py+5;y<GY;y++) for (x=ax0;x<ax1;x++){ var dx=Math.abs(x-acx)/((ax1-ax0)/2), top=py+5+ah*(1-Math.sqrt(Math.max(0,1-dx*dx)))*0.9+(dx<0.18?-1:0); if (y<top) continue; b.px(x,y,(y<top+2)?P.k1:(hash(x>>1,y>>1)<0.25?P.k1:P.k2)); }
    b.vl(ax0-1,py+10,GY-1,P.s6); b.vl(ax1,py+10,GY-1,P.s3);
    dome(b,acx,py,(ax1-ax0)/2+2,8); b.px(rd(acx),py-9,P.y2); }
  for (x=x0-2;x<x1+2;x++) dk(b,x,GY,2);
  // durch die Bögen: das Portal und Schuhregale im Schatten
  var pc=rd(x0+1.5*bw); b.rect(pc-6,py+16,12,GY-py-16,P.w1); b.vl(pc,py+16,GY-1,P.w0); b.rect(pc-8,py+14,16,2,P.s3);
  for (var sx=x0+8;sx<x0+bw-6;sx+=4) b.rect(sx,GY-8,3,2,(sx>>2)%2?P.w2:P.w3); }

// ---------------------------------------------------------------- Minarett: viereckiger Sockel, schlanker Schaft, Šerefe, Kegeldach mit schlichter Spitze
function minaret(b){ var cx=MIN.cx, w=MIN.w, x, y;
  for (y=MIN.base-22;y<MIN.base;y++) for (x=cx-w-2;x<=cx+w+2;x++){ var c=tex.ashlar(x,y,R('s2 s3 s4 s5'),6,4); if (x>=cx+w) c=M.DN[c]; b.px(x,y,c); }   // Sockel
  for (y=MIN.serefe+6;y<MIN.base-22;y++) for (x=cx-w;x<=cx+w;x++){ var u=(x-cx)/w, c2=ra(R('s2 s3 s4 s5 s6'),0.7-u*0.45,x,y); if (((y-MIN.serefe)%9)===0) c2=M.DN[c2]; b.px(x,y,c2); }
  for (x=cx-w-1;x<=cx+w+1;x++){ b.px(x,MIN.base-22,P.s5); b.px(x,MIN.base-21,P.s2); }
  // Šerefe: Balkon mit Steingeländer und Konsolen
  for (x=cx-w-3;x<=cx+w+3;x++){ b.px(x,MIN.serefe,P.s6); b.px(x,MIN.serefe+1,P.s4); b.px(x,MIN.serefe+5,P.s3); if ((x-cx)%2===0){ b.vl(x,MIN.serefe+2,MIN.serefe+4,P.s4); } else { b.vl(x,MIN.serefe+2,MIN.serefe+4,P.s2); } }
  for (x=cx-w-2;x<=cx+w+2;x++){ b.px(x,MIN.serefe+6,P.s2); if ((x&1)===0) b.px(x,MIN.serefe+7,P.s3); }
  for (y=MIN.serefe-14;y<MIN.serefe;y++) for (x=cx-w+1;x<=cx+w-1;x++) b.px(x,y,ra(R('s2 s3 s4 s5'),0.7-(x-cx)/w*0.45,x,y));
  b.rect(cx-1,MIN.serefe-11,2,4,P.k2);
  for (y=MIN.top+2;y<MIN.serefe-14;y++){ var f=(y-MIN.top)/(MIN.serefe-14-MIN.top), cw=Math.max(0,rd(f*(w))); for (x=cx-cw;x<=cx+cw;x++) b.px(x,y,x<cx?P.m3:(x===cx?P.m2:P.m1)); }
  b.vl(cx,MIN.top-2,MIN.top+1,P.y2); b.px(cx,MIN.top-3,P.y3);   // schlichte Spitze, ohne Halbmond
  // Tür am Fuß
  var d=MDOOR; b.rect(d.x0-1,d.y0-2,d.x1-d.x0+2,GY-d.y0+2,P.s2); b.rect(d.x0,d.y0,d.x1-d.x0,GY-d.y0,P.w1); for (y=d.y0+2;y<GY;y+=4) b.hl(d.x0+1,d.x1-2,y,P.w0); b.px(d.x1-3,d.y0+9,P.y3);
  for (y=d.y0-4;y<d.y0;y++){ var aw=rd((d.x1-d.x0)/2*Math.sqrt(Math.max(0,1-Math.pow((d.y0-y)/4,2)))); b.hl(rd((d.x0+d.x1)/2)-aw,rd((d.x0+d.x1)/2)+aw-1,y,P.s2); } }

// ---------------------------------------------------------------- Tor (links), Hofmauer mit Blick, Schild
function gate(b){ var x0=GATE.x0, x1=GATE.x1, x, y;
  for (y=40;y<GY;y++) for (x=x0;x<x1+6;x++){ var c=tex.ashlar(x,y,R('s1 s2 s3 s4'),7,4); if (y<42) c=(y===40)?P.s5:P.s2; b.px(x,y,c); }
  for (y=GATE.spring-6;y<GY;y++) for (x=x0+4;x<x1-2;x++){ var cx=(x0+4+x1-2)/2, dx=Math.abs(x-cx)/((x1-6-x0)/2), top=GATE.spring-6+8*(1-Math.sqrt(Math.max(0,1-dx*dx))); if (y<top) continue; b.px(x,y,(y<top+2)?P.s2:(hash(x>>1,y>>2)<0.2?P.s3:P.s4)); }   // Durchgang (draußen die helle Gasse)
  for (x=x0;x<x1+8;x++){ b.px(x,38,P.s2); b.px(x,39,P.m1); } for (x=x0;x<x1+8;x+=3) b.px(x,37,P.m2); }
function wallRight(b,wet){ var x, y; for (y=WALL.top;y<GY+2;y++) for (x=WALL.x0;x<W;x++){ var c=tex.ashlar(x,y,R('s1 s2 s3 s4'),8,4); if (y<WALL.top+2) c=(y===WALL.top)?P.s6:P.s4; if (wet && y>=WALL.top+2) c=M.DN[c]; b.px(x,y,c); }
  for (x=WALL.x0;x<W;x++) dk(b,x,WALL.top+2,1); b.vl(WALL.x0,WALL.top,GY+1,P.s5); }
function signPost(b){ var s=SIGN, x; b.vl(s.x0+4,s.y1,GY+3,P.w1); b.vl(s.x1-5,s.y1,GY+3,P.w1);
  b.rect(s.x0,s.y0,s.x1-s.x0,s.y1-s.y0,P.g1); b.rect(s.x0+1,s.y0+1,s.x1-s.x0-2,s.y1-s.y0-2,P.s6); b.hl(s.x0+1,s.x1-2,s.y0+1,P.g3);
  ['ULAZNICA','TICKET','MINARET'].forEach(function(t,i){ var tw=M.microWidth(t); M.microText(b,t,rd((s.x0+s.x1)/2-tw/2),s.y0+2+i*6,i===2?P.g1:P.k1); }); }

// ---------------------------------------------------------------- Kieselmosaik: helle Kiesel, dunkle Bänder in Ringen um den Brunnen und als Bordüre
function pebble(x,y,wet){ var k=lerp(0.6,1.2,(y-GY)/38), X=(x-160)/k, Z=(y-GY)/((k+0.6)/2)*1.5, cs=3.4, gx=Math.floor(X/cs), gz=Math.floor(Z/(cs*0.9)), best=9, bt=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.5+(hash(gx+i,gz+j)-0.5)*0.5)*cs, cz=(gz+j+0.5+(hash(gz+j+7,gx+i)-0.5)*0.5)*cs*0.9, dx=(X-cx)/(cs*0.55), dz=(Z-cz)/(cs*0.5), d=dx*dx+dz*dz; if (d<best){ best=d; bt=hash(gx+i+31,gz+j); bdy=dz; } }
  // Muster (in Bodenkoordinaten): Ringe um den Brunnen, Rauten-Bordüre am Rand
  var fx=(x-FOUNT.cx)/k, fz=Z-(FOUNT.base-GY)*1.5, rr=Math.sqrt(fx*fx*0.6+fz*fz), ring=(Math.abs(((rr+2)%14)-7)<1.6) && rr<44;
  var zz=Z-42, zig=Math.abs((((X*0.5)%8)+8)%8-4), bord=(zz>0 && zz<9 && Math.abs(zz-2.5-zig*0.9)<1.2) || Math.abs(zz)<0.9 || Math.abs(zz-9)<0.9;   // Bordüre: Zickzack zwischen zwei Linien
  var dark=ring||bord;
  if (best>0.8) return wet?P.k2:P.s1;
  var c=dark?(bt<0.5?P.m1:P.s1):(bt<0.3?P.s3:(bt<0.8?P.s4:P.s5)); if (bdy<-0.3) c=M.UP[c]; else if (bdy>0.45) c=M.DN[c]; if (wet) c=M.DN[c]; return c; }
function court(b,wet){ for (var y=GY;y<H;y++) for (var x=0;x<W;x++){ b.px(x,y,pebble(x,y,wet)); PAVE[y*W+x]=1; } for (var x2=0;x2<W;x2++){ dk(b,x2,GY,2); if (bayer(x2,GY+1)<0.6) dk(b,x2,GY+1,1); } }

// ---------------------------------------------------------------- Šadrvan: achteckiges Steinbecken, Hähne, Holzdach auf vier Pfosten
var TAPS=[];
function fountain(w,x0,b){ var cx=FOUNT.cx, by=FOUNT.base, r=FOUNT.r, x, y; TAPS=[];
  // Becken (achteckig, in Ansicht: drei Seiten sichtbar)
  for (y=by-12;y<by;y++) for (x=cx-r;x<=cx+r;x++){ var u=(x-cx)/r, side=Math.abs(u)>0.55?(u<0?0.12:-0.18):0.05, c=ra(R('s2 s3 s4 s5'),0.6+side+(hash(x>>1,y>>1)-0.5)*0.15,x,y); if (Math.abs(Math.abs(u)-0.55)<0.04) c=P.s2; if (y===by-12) c=P.s6; if (y===by-11) c=P.s4; b.px(x,y,c); }
  b.ellipse(cx,by-12,r,2.4,function(xx,yy){ return yy<by-12?P.s5:P.a3; }); b.hl(cx-r+3,cx+r-3,by-12,P.a4);           // Wasserfläche
  for (var i=-2;i<=2;i++){ var tx=cx+i*6; b.rect(tx,by-8,2,2,P.y2); b.px(tx,by-8,P.y4); TAPS.push([tx,by-6]); }          // Messinghähne
  for (x=cx-r+1;x<cx+r;x+=3) b.px(x,by-1,P.s1); b.hl(cx-r-1,cx+r+1,by,P.s2);
  // Pfosten und Dach
  [cx-r+1,cx+r-2].forEach(function(px){ for (y=by-36;y<by-12;y++){ b.px(px,y,P.w2); b.px(px+1,y,P.w1); } });
  for (y=by-48;y<by-35;y++){ var t=(y-(by-48))/13, ins=rd((1-t)*r*0.7); for (x=cx-r-4+ins;x<=cx+r+4-ins;x++) b.px(x,y,(y===by-36)?P.w0:(((x+y)%4===0)?P.w1:(t<0.3?P.w2:P.w3))); }
  b.hl(cx-r-4,cx+r+4,by-35,P.w0); for (x=cx-r-3;x<=cx+r+3;x+=3) b.px(x,by-34,P.w1); b.vl(cx,by-52,by-48,P.w1); b.px(cx,by-53,P.y2); }

// ---------------------------------------------------------------- Granatapfelbaum (kahl, eine letzte Frucht)
function tree(b,w){ var r=M.rng(7), x0=TREE.x, by=TREE.base, x, y;
  for (y=by;y>by-22;y--){ var ox=rd(Math.sin((by-y)*0.18)*1.5); b.px(x0+ox,y,P.w1); b.px(x0+ox+1,y,P.w0); if (y>by-4) b.px(x0+ox-1,y,P.w1); }
  function limb(px,py,a,L,d){ for (var i=0;i<L;i++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.3; b.px(rd(px),rd(py),d<2?P.w1:P.w0); if (d<3 && r()<0.14) limb(px,py,a+(r()<0.5?-0.7:0.7),L*0.55,d+1); } if (d<3) for (var k=0;k<2;k++) limb(px,py,a+(r()-0.5)*1.2,L*0.35,d+1); }
  var ty=by-22; limb(x0,ty,-Math.PI/2-0.6,18,1); limb(x0,ty,-Math.PI/2+0.5,20,1); limb(x0,ty-2,-Math.PI/2,16,1); limb(x0,ty+4,-Math.PI/2-1.2,12,2); limb(x0,ty+3,-Math.PI/2+1.1,14,2);
  var fx=x0+9, fy=ty-9; b.ellipse(fx,fy,2.2,2.2,P.r3); b.px(fx-1,fy-1,P.r4); b.px(fx,fy-2,P.e2); FRUIT=[fx,fy];
  if (w==='frost') for (x=x0-20;x<x0+20;x++) for (y=ty-30;y<by;y++){ var c=b.get(x,y); if ((c===P.w1||c===P.w0) && b.get(x,y-1)!==P.w1 && hash(x,y)<0.6) b.px(x,y-1,P.s6); }
  b.ellipse(x0+1,by,6,1.6,P.s1); }
var FRUIT=[300,80];

// ---------------------------------------------------------------- Bild
var BASE=null, LASTB=null, LIT=[];
function paint(S,GS,tod){ var w=weaOf(GS), wet=w==='rain', b=new M.Buf(W,H,T), x, y; SKYM.fill(0); DEP.fill(0); PAVE.fill(0);
  stage(b,1,function(){ viewScene(b,tod,w); });
  var hz={rain:0.5,grey:0.35,calm:0.15,frost:0.12,bura:0.03}[w], fcol=(w==='rain')?P.s3:(w==='grey'?P.s4:P.b4); if (tod==='night') fcol=P.n0;
  M.fogBake(b,function(xx,yy){ return (DEP[yy*W+xx]===1 && !BRM[yy*W+xx])?hz:(BRM[yy*W+xx]?hz*0.5:0); },{col:fcol});
  stage(b,3,function(){ wallRight(b,wet); mosque(b,tod); minaret(b); gate(b); boothInterior(b); signPost(b); });
  stage(b,4,function(){ court(b,wet); fountain(w,0,b); tree(b,w); });
  var sky=new M.Buf(W,H,P.k0); paintSky(sky,tod,w); for (var q=0;q<W*H;q++) if (b.d[q]===T){ b.d[q]=sky.d[q]; SKYM[q]=1; }
  // Licht: Vorhalle im Schatten, Kontaktschatten, bei Sonne ein Schatten des Minaretts quer über den Hof
  var sunny=tod==='day'&&(w==='bura'||w==='calm'||w==='frost');
  M.light(b,M.lf.sum(M.lf.pool(FOUNT.cx,FOUNT.base+1,22,3,-1),M.lf.pool(TREE.x,TREE.base+1,10,2,-0.8),M.lf.pool((BOOTH.x0+BOOTH.x1)/2,BOOTH.base+1,16,2,-0.8)),0,0,function(xx,yy){ return PAVE[yy*W+xx]===1; });
  if (sunny) for (y=GY+1;y<H;y++){ var sx=rd(MIN.cx+8+(y-GY)*1.6); for (x=sx-3;x<=sx+3;x++) if (x>=0&&x<W && bayer(x,y)<0.75) dk(b,x,y,1); }
  if (wet) for (y=GY+2;y<H;y++) for (x=0;x<W;x++){ if (fbm(x*0.06,y*0.3,4)>0.62 && bayer(x,y)<0.35){ var sc=b.get(x,rd(GY-(y-GY)*1.2)); if (sc!==T) b.px(x,y,M.DN[sc]); } }
  BASE=b.clone(); LIT=lightsFor(tod);
  shade(b,0,0,todKey(tod,w),LIT,function(xx,yy){ return SKYM[yy*W+xx]===1; });
  if (tod!=='day'){ for (y=0;y<H;y++) for (x=0;x<W;x++){ if (!BRM[y*W+x]) continue; var c=BASE.get(x,y); if (c===P.s5||c===P.s6) b.px(x,y,bayer(x,y)<0.5?P.y3:P.y2); } }
  LASTB=b; return b; }

// ---------------------------------------------------------------- Ebenen: Kassenhäuschen (Front verdeckt den Kassierer), Brunnenbecken
function finishL(L,tod,w){ shade(L,L.ox,L.oy,todKey(tod,w),LIT); }
function boothLayer(S,tod,w){ var x0=BOOTH.x0, x1=BOOTH.x1, L=M.layer(x0-3,BOOTH.top-4,x1-x0+6,BOOTH.base-BOOTH.top+6,KASIR_Y+1), wr=M.lw(L), x, y;
  // Dach, Seitenwände, Fenster (offen: Kassierer dahinter), Brüstung mit Ablage
  wr.rect(x0-3,BOOTH.top-3,x1-x0+6,4,P.g1); wr.hl(x0-3,x1+2,BOOTH.top-3,P.g3); wr.hl(x0-3,x1+2,BOOTH.top,P.k2);
  wr.rect(x0,BOOTH.top+1,3,BOOTH.base-BOOTH.top-1,P.g2); wr.vl(x0,BOOTH.top+1,BOOTH.base-1,P.g3); wr.rect(x1-3,BOOTH.top+1,3,BOOTH.base-BOOTH.top-1,P.g1);
  wr.rect(x0+3,BOOTH.top+1,x1-x0-6,BOOTH.win0-BOOTH.top-1,P.g2);
  wr.rect(x0,BOOTH.sill,x1-x0,2,P.w3); wr.hl(x0,x1-1,BOOTH.sill,P.w4);
  for (y=BOOTH.sill+2;y<BOOTH.base;y++) for (x=x0+1;x<x1-1;x++) wr.px(x,y,((x-x0)%6===0)?P.g1:P.g2);
  wr.rect(x0+5,BOOTH.sill+4,x1-x0-10,7,P.s6); M.microText(L,'KASA',x0+7-L.ox,BOOTH.sill+5-L.oy,P.k1);
  wr.rect(x0+4,BOOTH.sill-1,6,1,P.s6); wr.px(x0+5,BOOTH.sill-2,P.s5);                                       // Ticketblock
  finishL(L,tod,w); return L; }
// Inneres des Kassenhäuschens (hinter dem Kassierer); die Front ist eine Ebene
function boothInterior(b){ var x0=BOOTH.x0, x1=BOOTH.x1; b.rect(x0+3,BOOTH.win0,x1-x0-6,BOOTH.sill-BOOTH.win0,P.w0); b.rect(x0+4,BOOTH.win0+2,4,4,P.y2); b.hl(x0+3,x1-4,BOOTH.win0,P.k2); b.rect(x0+3,BOOTH.sill,x1-x0-6,BOOTH.base-BOOTH.sill,P.g1); }
function basinLayer(S,tod,w){ var cx=FOUNT.cx, by=FOUNT.base, r=FOUNT.r, L=M.layer(cx-r-2,by-14,2*r+5,16,by), wr=M.lw(L);
  for (var y=by-14;y<by+1;y++) for (var x=cx-r-2;x<=cx+r+2;x++){ var c=LASTB?LASTB.get(x,y):T; if (c!==T && y>=by-13) wr.px(x,y,c); } return L; }
function layers(S,GS,tod){ var w=weaOf(GS); return [boothLayer(S,tod,w),basinLayer(S,tod,w)]; }

// ---------------------------------------------------------------- Bewegung: Wasser aus den Hähnen, Tauben, Glanz auf dem Fluss
var PIG=[[150,124],[166,130],[198,122],[230,128],[60,132]];
function pigeon(fb,x,y,f,t,i,tint){ var peck=Math.sin(t*2.6+i*2.1)>0.45, step=(Math.floor(t*0.9+i*1.3)%5===0)?f:0;
  function px(dx,dy,c){ var X=x+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  px(-3,-3,P.m1); px(-2,-3,P.m3); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m2); px(0,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-2,P.m2); px(3,-1,P.m3); px(4,-1,P.t4); } else { px(2,-3,P.a3); px(2,-4,P.m3); px(3,-5,P.m3); px(2,-5,P.m2); px(4,-4,P.t4); } }
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, w=weaOf(GS), k=todKey(tod,w), tint=k?levels(k)[0]:null;
  TAPS.forEach(function(q,i){ var on=Math.sin(t*0.6+i*1.9)>-0.4; if (!on) return; for (var y=q[1];y<FOUNT.base-10+6;y++){ var ph=(t*6+y*0.7+i)%1; if (ph<0.6) fb.px(q[0]+((y>q[1]+2)?1:0),y,ph<0.3?P.a6:P.a5); } });
  var wy=FOUNT.base-12; for (var x=FOUNT.cx-FOUNT.r+3;x<FOUNT.cx+FOUNT.r-3;x++) if (Math.sin(x*0.9+t*4)>0.85) fb.px(x,wy,P.a6);
  if (tod!=='night') PIG.forEach(function(p,i){ var px=p[0]+rd(Math.sin(t*0.33+i*1.7)*4); if (w==='rain' && i%2) return; pigeon(fb,px,p[1],(Math.sin(t*0.21+i)>0)?1:-1,t,i,tint); });
  M.glints(fb,BR.cx,BR.sp+4,WALL.top,14,t,w==='rain'?P.m4:P.a6,0);
  if (w==='bura') M.scn.buraDebris(fb,t,112,140,0); }
function front(fb,v,S,GS){ var w=weaOf(GS), tod=v.tod; if (w==='rain') M.rain(fb,v.t,{n:70,col:tod==='day'?P.m3:P.n2,col2:tod==='day'?P.m4:P.n3}); }
// Geistersicht: am Brunnen viele Hände, die Wasser schöpfen (blass)
function ghost(fb,v,S,GS){ var t=v.t, cx=FOUNT.cx, by=FOUNT.base;
  for (var i=0;i<12;i++){ var a=(i/12)*Math.PI+0.15, hx=rd(cx+Math.cos(a)*(FOUNT.r+2)*((i%2)?0.7:1)), hy=rd(by-9-Math.sin(t*0.8+i)*2+(i%3)), al=0.4+0.35*Math.sin(t*0.6+i*1.3); if (bayer(hx,hy+Math.floor(t))>al) continue;
    var c=(i%3===0)?P.x5:P.x4; fb.px(hx,hy,c); fb.px(hx+1,hy,c); fb.px(hx+2,hy,c); fb.px(hx-1,hy-1,P.x3); fb.px(hx+3,hy-1,P.x3); fb.px(hx,hy+1,P.x3); fb.px(hx+2,hy+1,P.x3); fb.px(hx+1,hy-2,P.x2); if (Math.sin(t*2+i)>0.5) fb.px(hx+1,hy+2,P.x6); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<112||y>138||x<10||x>310) return false;
  if (Math.abs(x-FOUNT.cx)<FOUNT.r+4 && y<FOUNT.base+4) return false;
  if (x>=BOOTH.x0-2 && x<=BOOTH.x1+2 && y<BOOTH.base+3) return false;
  if (Math.abs(x-TREE.x)<5 && y<TREE.base+3) return false;
  return true; }
M.defineArt('koski',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,weaOf(GS)); if (!k) return null; return levels(k)[tod==='day'?0:1].a; },
  spots:{
    exit:[0,48,22,90],
    minaret_door:[MDOOR.x0-2,MDOOR.y0-5,MDOOR.x1-MDOOR.x0+4,GY-MDOOR.y0+5],
    ticket:[BOOTH.x0-3,BOOTH.top-4,SIGN.x1-BOOTH.x0+3,BOOTH.base-BOOTH.top+4],
    fountain:[FOUNT.cx-FOUNT.r-5,FOUNT.base-54,FOUNT.r*2+10,56],
    tree:[TREE.x-22,TREE.base-46,40,48],
    view:[WALL.x0,30,W-WALL.x0,WALL.top-28],
    mosque:[MOS.x0-2,MOS.dome[1]-34,MOS.x1-MOS.x0+4,GY-MOS.dome[1]+34]
  },
  stands:{ exit:[14,124,'L'], minaret_door:[158,114,'B'], ticket:[184,116,'B'], fountain:[96,120,'B'], tree:[282,116,'R'], view:[248,114,'B'], mosque:[60,116,'B'] },
  actorPos:{ kasir:[181,KASIR_Y,'F'] },
  start:[18,122,'R'], entries:{ map:[18,122,'R'], minarett:[160,116,'L'] }
});
})(M);
