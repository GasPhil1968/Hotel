/* ===== rooms/art/strassenbr.js — Die Straßenbrücke (400 px, scrollend) =====
   Eine nüchterne Betonbrücke der Nachkriegszeit, flach über den Fluss: vorn der Bürgersteig aus Betonplatten und ein schlichtes
   Rohrgeländer auf einem Betonsockel (Ebene), zwei Laternenmasten aus verzinktem Stahl; dahinter die zweispurige Fahrbahn,
   gegenüber der zweite Gehweg mit Geländer. Darüber der Blick flussab: die grüne Neretva tief unten zwischen den Ufern, links
   das Ostufer mit Kalkfelsen, Altstadthäusern und einem Minarett, rechts das Westufer mit Ufermauer, Uferstraße und Wohnblöcken,
   hinten der Velež und der Hum (ohne Kreuz). Links und rechts enden die Brückengeländer an Betonpfeilern, dahinter die Ufer.
   Für Mala ist das keine Brücke, sondern „eine Straße mit Geländer“. Autos fahren in dynamic. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, HZ=46, VP=[200,46];
var FR={top:80,base:91};                                       // Geländer gegenüber (Oberkante, Fuß)
var ROAD={y0:93,y1:112};                                       // Fahrbahn: zwei Spuren
var WALKY=112;                                                 // Bordstein vorn, dahinter der Bürgersteig
var NR={top:109,base:137};                                     // vorderes Geländer (Ebene)
var POSTS=[24,68,112,156,200,244,288,332,376];
var LAMPS=[118,302];                                           // Laternen vorn (auf den Pfosten)
var FLAMPS=[60,200,340];                                       // Laternen gegenüber
var BANK={l:22,r:378};                                         // hier enden die Brückengeländer an Pfeilern

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function weaOf(GS){ var w=M.scn.weather(GS); if (w==='clear') return 'bura'; if (w==='fog') return 'grey'; return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
var HZL={}, HZN=null;
function hazeLut(col,k){ var key=col+'_'+k; if (HZL[key]) return HZL[key]; if (!HZN) HZN=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); var q=M.RGB[col], f=k/8;
  return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZN); }
function haze(b,amt,col){ for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=hazeLut(col,i)[c]; } }
var DEP=new Uint8Array(W*H), REG=new Uint8Array(W*H), RG={sky:0,mtn:1,town:2,water:3,bank:4,bridge:5,road:6,walk:7,lamp:8};
function RW(b){ var o={d:0,g:0};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; DEP[k]=o.d; REG[k]=o.g; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.w=W; o.h=H; return o; }

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod,we){ var x, y, h=HZ+20;
  if (we==='grey' && tod==='day'){ var GR=R('m2 m3 m4 s4'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(GR,0.28+y/h*0.5+(fbm(x*0.7,y*2.4,30,8)-0.5)*0.35,x,y)); return; }
  if (we==='rain'){ M.scn.sky(b,0,0,W,h,tod,we,67); if (tod==='day'){ var CL=R('m2 m3 s3 m4'); for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var f=fbm(x*1.5,y*3.1,28,4); if (f>0.56 && bayer(x,y)<(f-0.56)*4) b.px(x,y,ra(CL,0.3+(f-0.56)*2.5-y/100,x,y)); } } return; }
  if (tod==='day'){ var bura=we==='bura', D=bura?R('b0 b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<h;y++){ var v=(bura?0.05:0.18)+Math.pow(y/(HZ+10),1.3)*(bura?0.86:0.78); for (x=0;x<W;x++) b.px(x,y,ra(D,v+(vn(x,y,50,2)-0.5)*0.05,x,y)); }
    var r=M.rng(bura?79:37);
    if (bura){ for (var i=0;i<9;i++){ var cx=r()*W-20, cy=3+r()*26, L=16+r()*44, th=1.5+r()*3;
        for (var k=0;k<L;k++){ var u=k/L; if (fbm(cx+k*1.3,i*9,6,3)<0.4) continue; var hh=th*Math.sin(u*Math.PI)*(0.45+fbm(k*2+cx,i*3,5,5)), xx=rd(cx+k), yt=rd(cy-hh*0.6+u*2.5), yb2=rd(cy+hh*0.4+u*2.5);
          for (var yy=yt;yy<=yb2;yy++){ var q=(yy-yt)/Math.max(1,yb2-yt); if (q>0.8 && bayer(xx,yy)<0.5) continue; b.px(xx,yy,q<0.4?P.b5:(q<0.75?P.b4:P.b3)); } } } }
    else { for (var j=0;j<6;j++){ var cx2=r()*W, cy2=5+r()*22, L2=50+r()*90; for (var k2=0;k2<L2;k2++){ var xx2=rd(cx2+k2), yy2=rd(cy2+Math.sin(k2*0.06+j)*1.3+k2*0.02), a=1-Math.abs(k2/L2-0.5)*2; if (bayer(xx2,yy2)<a*0.45) b.px(xx2,yy2,P.b4); if (a>0.6 && bayer(xx2,yy2+1)<a*0.25) b.px(xx2,yy2+1,P.b5); } } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(N,0.08+Math.pow(y/(HZ+10),1.5)*0.8,x,y));
    var r2=M.rng(47); for (var s=0;s<190;s++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.4)*(HZ-6)), q2=r2(); b.px(sx,sy,q2<0.08?P.n5:(q2<0.4?P.n4:P.n3)); } return; }
  M.sky(b,0,0,W,h,tod,23); }

// ---------------------------------------------------------------- Ferne: Velež links, Hum rechts
function paintHills(w){ var x, y; w.d=1; w.g=RG.mtn;
  var VR=R('m0 m1 s1 m2 s2 s3 s4 s5');
  for (x=0;x<230;x++){ var p=Math.exp(-Math.pow((x-70)/70,2)), ty=rd(HZ-2-26*p-6*Math.exp(-Math.pow((x-170)/30,2))+(vn(x,3,7,4)-0.5)*3), sl=Math.sin(x*0.05); for (y=ty;y<=HZ+4;y++){ var rib=Math.sin(x*0.4+y*0.35+fbm(x,y,12,2)*6), v=0.5+(x<70?0.12:-0.1)-(y-ty)*0.008+(fbm(x*2.6+y*0.9,y*0.5,8,6)-0.5)*0.55+rib*0.12; if (y===ty) v=0.9; w.px(x,y,ra(VR,v,x,y)); } }
  for (x=250;x<W;x++){ var t=(x-250)/150, hy=rd(HZ-4-22*Math.sin(Math.min(1,t*1.1)*Math.PI*0.62)+Math.sin(x*0.2)*0.6); for (y=hy;y<=HZ+6;y++){ var f=fbm(x*1.3,y*1.6,7,12), c=(fbm(x*2.6,y*2.8,4,17)>0.58)?ra(R('g0 g1 g2'),0.3+f*0.6,x,y):ra(R('g1 e1 g2 e2 g3 e3'),0.35+f*0.55,x,y); if (y===hy) c=P.g3; w.px(x,y,c); } } }

// ---------------------------------------------------------------- der Fluss in Perspektive zwischen den Ufern
var WY=89;                                                     // Wasser direkt hinter dem gegenüberliegenden Geländer
function wl(y){ return lerp(VP[0]-1,74,cl((y-VP[1])/(WY-VP[1]),0,1)); }   // linke Wasserkante
function wr(y){ return lerp(VP[0]+1,326,cl((y-VP[1])/(WY-VP[1]),0,1)); }  // rechte Wasserkante
function bl(y){ return lerp(VP[0]-2,-60,cl((y-VP[1])/(WY+8-VP[1]),0,1)); } // Oberkante Ostufer (Felsen) projiziert
function ltop(x){ return VP[1]+(VP[0]-x)/(VP[0]+40)*14; }      // Felskante links: von VP nach links unten
function rtop(x){ return VP[1]+(x-VP[0])/(W-VP[0]+40)*16; }    // Ufermauer rechts
var WA=new Float32Array(W*H);
// smaragdgrünes Wasser: Türkis mit etwas Olivgrün gerastert, in klaren Stufen statt Rauschen
function emer(v,x,y){ var b=bayer(x,y); if (v<0.28) return b<0.5?P.g1:P.a2; if (v<0.5) return (b<(v-0.28)/0.22*0.6)?P.a4:P.a3; if (v<0.74) return (b<0.22)?P.g4:P.a4; return (b<(v-0.74)/0.26)?P.a5:P.a4; }
function paintRiver(w,we){ var x, y, rain=we==='rain', rp=rain?R('e0 e1 e2 e3 s2 e4'):(we==='grey'?R('a1 a2 g3 a3 a4'):R('a1 a2 g3 a3 g4 a4 a5'));
  for (y=VP[1]+1;y<WY+2;y++){ var x0=wl(y), x1=wr(y), d=(y-VP[1])/(WY-VP[1]), z=1/Math.max(0.05,d);
    for (x=Math.floor(x0);x<=Math.ceil(x1);x++){ var u=(x+0.5-VP[0])/Math.max(1,(x1-x0)/2), au=Math.abs(u);
      // Strömungslinien laufen zum Fluchtpunkt, die Ufer spiegeln sich dunkel, hinten der Himmel hell
      var rip=Math.sin(z*7.5+fbm(u*4,z*0.8,1.5,4)*5), v=0.5+rip*0.13+Math.sin(u*9+fbm(z*0.9,u*3,2,4)*4)*0.05+(fbm(u*6+40,z*1.2,1.4,5)-0.5)*0.14;
      if (au>0.66) v-=(au-0.66)*0.9; if (d<0.35) v+=(0.35-d)*0.7; if (au<0.2 && d>0.5) v-=0.08;
      WA[y*W+x]=v; var c=(!rain && we!=='grey')?emer(v,x,y):ra(rp,v,x,y);
      if (rain && fbm(u*9,z*4,1.2,9)>0.64) c=(hash(x,y)<0.5)?P.s4:P.s3;                       // Hochwasser: Schaum und Treibgut
      if (!rain && rip>0.93 && hash(x,y)<0.5 && d>0.25) c=we==='grey'?P.a4:P.a5;                // Kräusel
      w.d=d<0.4?2:3; w.g=RG.water; w.px(x,y,c); } }
  // Schatten der Brücke auf dem Wasser
  for (y=WY-6;y<WY+2;y++) for (x=Math.floor(wl(y));x<=Math.ceil(wr(y));x++) if (bayer(x,y)<(y-WY+7)/8*0.8) w.px(x,y,M.DN[w.get(x,y)]); }
// Ostufer: hohe Kalkfelsen, oben die Altstadt; Westufer: Ufermauer, Uferstraße, Wohnblöcke
function paintBanks(w,we){ var x, y, wet=we==='rain';
  for (y=VP[1];y<WY+2;y++){ var d=(y-VP[1])/(WY-VP[1]);
    // links: Felswand vom Wasser bis zur Kante
    for (x=0;x<Math.ceil(wl(y));x++){ if (y<ltop(x)) continue; var c=ra(R('s1 s2 s3 s4 s5'),0.5+(fbm(x*0.6,y*1.4,5,3)-0.5)*0.8-(y-ltop(x))*0.006,x,y); if (fbm(x*1.5,y*0.5,4,8)>0.66) c=(hash(x,y)<0.5)?P.g2:P.g1; if (wet) c=M.DN[c]; w.d=d<0.4?2:3; w.g=RG.bank; w.px(x,y,c); }
    // rechts: senkrechte Ufermauer aus Betonblöcken, Lagen laufen zum Fluchtpunkt, Abflussrohre mit Rostfahnen
    for (x=Math.floor(wr(y))+1;x<W;x++){ if (y<rtop(x)) continue; var yw=VP[1]+(x-VP[0])/(326-VP[0])*(WY-VP[1]), hf=(y-rtop(x))/Math.max(1,yw-rtop(x)), dz=Math.log(Math.max(1,x-VP[0]))*7;
      var c2=ra(R('m1 m2 s2 m3 s3'),0.62-hf*0.3+(fbm(x*0.4,y*2,6,4)-0.5)*0.35,x,y);
      if (Math.abs(hf*6-Math.round(hf*6))<0.06*(1+(x-VP[0])/120)) c2=P.m1; if (Math.abs(dz-Math.round(dz))<0.05) c2=P.m1;
      if (Math.abs(dz-Math.round(dz)-0.5)<0.04 && hf>0.3 && hf<0.45){ c2=P.k1; } else if (Math.abs(dz-Math.round(dz)-0.5)<0.06 && hf>=0.45) c2=(hash(x,y)<0.6)?P.t1:c2;
      if (hf>0.88) c2=wet?P.e1:P.g1; if (y<rtop(x)+1) c2=P.s4; if (wet) c2=M.DN[c2]; w.d=d<0.4?2:3; w.g=RG.bank; w.px(x,y,c2); } }
  // Uferstraße rechts mit kleinen Autos (gemalt)
  for (x=VP[0]+4;x<W;x++){ var ry=rd(rtop(x)); w.d=2; w.g=RG.town; w.px(x,ry-1,P.m2); if (x%5===0) w.px(x,ry-2,P.m1); }
  [[250,0],[296,1],[344,2]].forEach(function(cp){ var x0=cp[0], by=rd(rtop(x0))-1, s=(x0-VP[0])/(W-VP[0]), cw=rd(5+s*9), ch=Math.max(2,rd(2+s*3)), col=[P.r3,P.s5,P.b2][cp[1]];
    w.rect(x0,by-ch,cw,ch,col); w.hl(x0+1,x0+cw-2,by-ch-1,col); w.px(x0+1,by-ch+1,P.n1); w.px(x0+cw-2,by-ch+1,P.n1); w.px(x0+1,by,P.k1); w.px(x0+cw-2,by,P.k1); }); }

// ---------------------------------------------------------------- Häuser an den Ufern, in die Tiefe kleiner werdend
var LIT=[];
function slabRoof(w,x0,x1,ey,rh){ var ins=Math.max(1,rd(rh*0.85)); for (var y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t)); for (var x=xa;x<=xb;x++){ var c=(x<xa+1)?P.m4:((x>xb-1)?P.m2:(hash(x>>1,y)<0.25?P.s3:P.m3)); if (y===ey) c=P.s1; w.px(x,y,c); } } }
function tileRoof(w,x0,x1,ey,rh,sd){ var ins=Math.max(1,rd(rh*0.8)); for (var y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t)); for (var x=xa;x<=xb;x++){ var c=((x+sd)%3===0)?P.t2:P.t3; if (x<xa+1) c=P.t4; if (x>xb-1) c=P.t1; if (y===ey) c=P.t1; w.px(x,y,c); } } }
var WCOL=[R('s3 s4 s5'),R('e3 e4 s5'),R('t3 t4 t5'),R('m2 m3 m4'),R('s4 s5 s6'),R('y2 y3 y4')];
function oldHouse(w,x0,x1,yb,wh,sd){ var x, y; for (y=yb-wh;y<yb;y++) for (x=x0;x<=x1;x++) w.px(x,y,(x===x0)?P.s6:((x===x1)?P.s3:P.s5));
  var big=x1-x0>9; for (var i=x0+2;i<x1-1;i+=big?4:3){ var wy=yb-wh+(big?2:1); w.rect(i,wy,big?2:1,big?3:2,P.k2); LIT.push([i,wy]); if (big && wh>9){ w.rect(i,wy+5,2,3,P.k2); LIT.push([i,wy+5]); } if (big && hash(i,sd)<0.4){ w.px(i-1,wy,P.w2); w.px(i+2,wy,P.w2); } }
  slabRoof(w,x0-1,x1+1,yb-wh-1,Math.max(1,rd((x1-x0)*0.35))); }
function block(w,x0,x1,yb,wh,sd,side){ var x, y, wc=WCOL[Math.floor(hash(sd,5)*WCOL.length)], fl=Math.max(2,rd(wh/7));
  for (y=yb-wh;y<yb;y++) for (x=x0;x<=x1;x++){ var c=wc[1]; if (x===x0) c=wc[2]; if (x===x1) c=wc[0]; if ((y-(yb-wh))%fl===1 && x>x0 && x<x1 && (x-x0)%2===1){ c=P.k2; if (hash(x,y)<0.7) LIT.push([x,y]); } w.px(x,y,c); }
  if (side>0) for (y=yb-wh+1;y<yb;y++) for (x=x0-side;x<x0;x++) w.px(x,y,M.DN[wc[0]]);
  w.hl(x0-side,x1,yb-wh-1,P.s2); if (hash(sd,2)<0.6) w.rect(x0+2,yb-wh-3,2,2,P.m2); }
function paintTown(w){ var s, x, y;
  // von hinten nach vorn: Häuser auf der Felskante (links) und hinter der Uferstraße (rechts)
  for (s=0.04;s<1.5;s*=1.12){ var xl=VP[0]-s*170, xr=VP[0]+s*170, by=rd(VP[1]+s*10.5), sd=Math.floor(s*997);
    w.d=s<0.35?2:3; w.g=RG.town;
    if (xl>-30){ var bw=Math.max(2,rd(s*(18+hash(sd,1)*16))), wh=Math.max(1,rd(s*(8+hash(sd,2)*8))); var hx=rd(xl-bw);
      if (hash(sd,7)<0.12 && s>0.15) cypress(w,rd(xl-bw*0.5),by,rd(s*30)); else oldHouse(w,hx,hx+bw,by,wh,sd);
      if (s>0.5 && s<0.6) M.scn.minaret(w,rd(xl-bw-s*20),by,rd(s*62),{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')}); }
    if (xr<W+30){ var bw2=Math.max(2,rd(s*(20+hash(sd,3)*18))), wh2=Math.max(2,rd(s*(18+hash(sd,4)*30))); block(w,rd(xr),rd(xr)+bw2,rd(VP[1]+s*12),wh2,sd+3,Math.max(0,rd(s*4))); }
    if (s>0.2 && hash(sd,9)<0.5){ var tx=rd(xr+s*6), ty=rd(VP[1]+s*12.5); w.vl(tx,ty-rd(s*12),ty,P.e1); w.px(tx-1,ty-rd(s*9),P.e2); w.px(tx+1,ty-rd(s*7),P.e2); } } }
function cypress(w,x,yb,h){ for (var y=yb-h;y<yb;y++){ var t=(yb-y)/h, hw=Math.max(0,rd(Math.sin(Math.min(1,t*1.25)*Math.PI*0.5)*h*0.14)); for (var i=-hw;i<=hw;i++) w.px(x+i,y,i<0?P.g2:(i>0?P.g0:P.g1)); } }

// ---------------------------------------------------------------- Brücke: Geländer gegenüber, Fahrbahn, Bürgersteig, Pfeiler an den Enden
function paintBridge(w,we){ var x, y, wet=we==='rain';
  // gegenüberliegender Gehweg und Geländer: Rohre und Pfosten, dahinter sieht man durch
  w.d=5; w.g=RG.bridge;
  for (x=0;x<W;x++){ w.px(x,FR.base,P.s4); w.px(x,FR.base+1,P.s3); w.px(x,FR.base-1,P.m3); for (y=FR.base+2;y<ROAD.y0;y++) w.px(x,y,(y===ROAD.y0-1)?P.s2:P.s3);
    w.px(x,FR.top,P.m4); w.px(x,FR.top+1,P.m2); w.px(x,FR.top+5,P.m3); if ((x%22)===0){ w.vl(x,FR.top,FR.base-1,P.m2); w.px(x+1,FR.top+2,P.m1); } }
  FLAMPS.forEach(function(lx){ w.g=RG.lamp; w.vl(lx,18,FR.base-1,P.m3); w.vl(lx+1,18,FR.base-1,P.m1); w.line(lx,18,lx+8,14,P.m2); w.rect(lx+6,13,8,2,P.m2); w.hl(lx+7,lx+12,15,P.s5); w.g=RG.bridge; });
  // Fahrbahn: Asphalt, Mittellinie gestrichelt, Fahrspuren abgefahren, ein Gully, Flickstellen
  w.g=RG.road;
  for (y=ROAD.y0;y<ROAD.y1;y++) for (x=0;x<W;x++){ var v=0.42+(fbm(x*0.3,y*1.4,7,5)-0.5)*0.3, c=ra(R('m0 m1 m2 s1 m2'),v,x,y); var ln=y-ROAD.y0;
    if ((ln===4||ln===5||ln===14||ln===15) && hash(x>>2,ln)<0.6) c=M.DN[c];                    // Fahrspuren
    if (ln===9 && ((x>>3)%2===0)) c=P.s5;                                                      // Mittellinie
    if (hash(x>>3,y>>2)<0.05) c=P.m1; if (wet){ c=M.DN[c]; if (fbm(x*0.25,y*1.2,5,9)>0.66) c=(bayer(x,y)<0.6)?P.m4:P.m3; } w.px(x,y,c); }
  // Bordstein und Bürgersteig aus Betonplatten
  w.g=RG.walk;
  for (x=0;x<W;x++){ w.px(x,WALKY,P.s5); w.px(x,WALKY+1,P.s3); w.px(x,WALKY+2,P.s2); }
  for (y=WALKY+3;y<H;y++) for (x=0;x<W;x++){ var fy=(y-WALKY-3)%8, fx=(x+((Math.floor((y-WALKY-3)/8)%2)*12))%24, c2=hash(Math.floor(x/24),Math.floor(y/8))<0.4?P.s3:P.s4; if (fy===0||fx===0) c2=P.s2; if (hash(x,y)<0.04) c2=P.s2; if (wet){ c2=M.DN[c2]; if (fbm(x*0.2,y*0.8,5,13)>0.67) c2=(bayer(x,y)<0.5)?P.m4:P.m3; } w.px(x,y,c2); }
  // Pfeiler an den Enden: dort beginnt das Ufer (links: Steinmauer, rechts: Ampelmast)
  w.g=RG.bridge;
  [BANK.l,BANK.r].forEach(function(px,i){ for (y=FR.top-6;y<FR.base+2;y++) for (x=px-4;x<px+4;x++) w.px(x,y,(x===px-4)?P.s5:((x>px+1)?P.s2:P.s4)); w.hl(px-5,px+4,FR.top-7,P.s5); });
  for (y=FR.top-2;y<FR.base;y++) for (x=0;x<BANK.l-4;x++) w.px(x,y,ra(R('s2 s3 s4'),0.5+(fbm(x,y,4,2)-0.5)*0.8,x,y));
  w.vl(392,40,FR.base,P.m1); w.vl(393,40,FR.base,P.m2); w.rect(389,40,7,14,P.k1); [P.r2,P.y1,P.g2].forEach(function(c3,i){ w.rect(391,42+i*4,3,3,c3); }); }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), WE='calm';
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k, night=tod==='night';
  WE=we; DEP.fill(0); REG.fill(0); LIT.length=0;
  paintSky(b,tod,we); paintHills(w);
  // Land hinter den Ufern
  w.g=RG.town; w.d=2; for (y=HZ;y<WY+2;y++) for (x=0;x<W;x++){ if (REG[y*W+x]!==RG.sky) continue; w.px(x,y,ra(R('e1 g1 e2 s2 g2 e3'),0.5+(fbm(x*1.1,y*1.9,6,7)-0.5)*0.7,x,y)); }
  paintRiver(w,we); paintBanks(w,we); paintTown(w);
  paintBridge(w,we);
  var hk=we==='bura'?[0,0.12,0.06,0.03]:(we==='rain'?[0,0.82,0.55,0.3]:(we==='grey'?[0,0.6,0.4,0.2]:[0,0.22,0.13,0.06]));
  var hc=night?P.m0:(we==='rain'?P.m3:(we==='grey'?P.m4:P.b4));
  haze(b,function(xx,yy){ var d=DEP[yy*W+xx]; if (REG[yy*W+xx]===RG.sky||d>=4) return 0; return hk[d]||0; },hc);
  var amb=we==='rain'?-0.55:(we==='grey'?-0.3:(we==='bura'?0.1:0));
  M.light(b,M.lf.sum(M.lf.k(amb),M.lf.band(WALKY,H,0,-0.3)),0,0,function(xx,yy){ return REG[yy*W+xx]!==RG.sky; });
  SKYM.fill(0); for (k=0;k<W*H;k++) if (REG[k]===RG.sky) SKYM[k]=1;
  var lights=[]; if (tod!=='day'){ FLAMPS.forEach(function(lx){ lights.push([lx+10,30,26,0.6,40]); }); LAMPS.forEach(function(lx){ lights.push([lx+10,120,34,0.8,20]); }); }
  return M.finishTOD(b,tod,{ sky:function(xx,yy){ return SKYM[yy*W+xx]===1; }, lights:lights, after:function(o,tod2){ if (tod2==='day') return;
      LIT.forEach(function(p){ if (hash(p[0]*1.3,p[1]*2.1)>(tod2==='night'?0.4:0.22)) return; o.px(p[0],p[1],hash(p[0],p[1])<0.5?P.y3:P.y4); });
      FLAMPS.forEach(function(lx){ o.hl(lx+7,lx+12,15,P.l1); o.hl(lx+8,lx+11,16,P.y4); }); } }); }

// ---------------------------------------------------------------- Ebene: vorderes Geländer mit Sockel und zwei Laternen
function railLayer(S,GS,tod){ var we=weaOf(GS), wet=we==='rain', L=M.layer(0,0,W,H,H+6), w=M.lw(L), x, y;
  // Betonsockel ganz vorn
  for (x=0;x<W;x++) for (y=NR.base;y<H;y++){ var c=(y===NR.base)?P.s5:(((x+3)%31===0)?P.s1:(hash(x>>1,y)<0.2?P.s2:P.s3)); if (wet) c=M.DN[c]; w.px(x,y,c); }
  // Rohrgeländer: drei waagerechte Rohre, Pfosten aus Flachstahl, rostige Stellen
  POSTS.forEach(function(px){ for (y=NR.top-1;y<NR.base;y++){ w.px(px,y,P.m4); w.px(px+1,y,P.m2); w.px(px+2,y,P.m1); } w.hl(px-1,px+3,NR.base-1,P.m1); w.hl(px-1,px+3,NR.top-2,P.m3); });
  [[NR.top,3],[NR.top+11,2],[NR.top+21,2]].forEach(function(rr){ for (x=0;x<W;x++){ w.px(x,rr[0],P.m4); w.px(x,rr[0]+1,rr[1]>2?P.m3:P.m2); if (rr[1]>2) w.px(x,rr[0]+2,P.m1); if (hash(x>>1,rr[0])<0.05) w.px(x,rr[0]+1,P.t2); } });
  // Laternen: verzinkte Masten mit gebogenem Arm und flacher Leuchte
  LAMPS.forEach(function(lx){ for (y=10;y<NR.base;y++){ w.px(lx,y,P.m4); w.px(lx+1,y,P.m3); w.px(lx+2,y,P.m1); } w.rect(lx-1,NR.base-12,5,12,P.m2); w.vl(lx-1,NR.base-12,NR.base-1,P.m4);
    for (var i=0;i<12;i++){ var ax=lx+1+i, ay=rd(10-Math.sin(i/11*Math.PI*0.5)*4); w.px(ax,ay,P.m3); w.px(ax,ay+1,P.m1); } w.rect(lx+9,6,10,3,P.m2); w.hl(lx+9,lx+18,6,P.m4); w.hl(lx+10,lx+17,9,P.s4); w.px(lx+12,9,P.s6); });
  // ein Aufkleber und ein Rest Absperrband am Pfosten (ohne Schrift)
  w.rect(POSTS[3]+1,NR.top+6,2,3,P.y3); w.px(POSTS[6]+2,NR.top+13,P.r3); w.px(POSTS[6]+3,NR.top+14,P.s6); w.px(POSTS[6]+3,NR.top+15,P.r3);
  if (tod!=='day'){ M.tintApply(L,M.TINT[tod]); LAMPS.forEach(function(lx){ w.hl(lx+10,lx+17,9,P.l1); w.hl(lx+11,lx+16,10,P.y4); }); }
  return L; }

// ---------------------------------------------------------------- jedes Bild: Wasser, Autos, Wind
var CARS=[{dir:1,lane:103,sp:70,ph:0,col:[P.r1,P.r2,P.r3],len:30},{dir:-1,lane:111,sp:85,ph:6,col:[P.s3,P.s4,P.s5],len:34},{dir:1,lane:103,sp:60,ph:11,col:[P.b0,P.b1,P.b2],len:28}];
function car(fb,x0,by,o,tint,cam){ var L=o.len, h=11, x, y;
  function px(X,Y,c){ X=rd(X)-cam; if (X<0||X>=320||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  for (x=0;x<L;x++){ var u=x/(L-1), fw=o.dir>0?u:1-u, roof=(fw>0.28&&fw<0.78), top=by-(roof?h:6), y0=roof?top+Math.round(Math.max(0,Math.abs(fw-0.53)-0.18)*12):top;
    for (y=y0;y<by-2;y++){ var c=o.col[1]; if (y===y0) c=o.col[2]; if (y>by-5) c=o.col[0]; if (roof && y>y0 && y<by-6) c=((x%9)===0)?o.col[0]:(y<y0+2?P.n2:P.n1); px(x0+x,y,c); } }
  [0.2,0.8].forEach(function(f){ var cx=x0+L*f; for (var a=-2;a<=2;a++) for (var b=-2;b<=2;b++) if (a*a+b*b<=5) px(cx+a,by-2+b,(a*a+b*b<=1)?P.m2:P.k1); });
  px(o.dir>0?x0+L-1:x0,by-5,P.y4); px(o.dir>0?x0:x0+L-1,by-5,P.r3); }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, we=WE, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null, x, y;
  // Glitzern und Strömung auf dem Wasser
  for (y=VP[1]+4;y<WY;y++){ var x0=Math.max(cam,Math.floor(wl(y))), x1=Math.min(cam+319,Math.ceil(wr(y))); for (x=x0;x<=x1;x++){ var k=y*W+x; if (REG[k]!==RG.water) continue; var d=(y-VP[1])/(WY-VP[1]), u=(x-VP[0])/Math.max(1,(wr(y)-wl(y))/2), z=1/Math.max(0.05,d);
      var wv=Math.sin(u*14+z*2.2-t*3.1)+Math.sin(u*5-z*1.3+t*1.7)*0.7; var sk=(y*320+x-cam); if (wv>1.45) fb.d[sk]=M.UP[fb.d[sk]]; else if (wv<-1.5) fb.d[sk]=M.DN[fb.d[sk]]; } }
  // Autos auf der Fahrbahn (hinter dem Bürgersteig)
  CARS.forEach(function(o){ var per=(W+120)/o.sp+5, ph=(t+o.ph)%per, x0=o.dir>0?-60+ph*o.sp:W+20-ph*o.sp; if (x0<-o.len-10||x0>W+10) return; if (we==='grey' && o.ph>10) return; car(fb,x0,o.lane,o,tint,cam); });
  // Wolkenfetzen bei Bura
  if (we==='bura' && tod==='day') for (var i=0;i<4;i++){ var sp=24+hash(i,3)*18, cx=((hash(i,1)*W+t*sp)%(W+60))-30-cam, cy=5+hash(i,2)*24, L=10+hash(i,4)*16;
    for (var q=0;q<L;q++){ var X=rd(cx+q), Y=rd(cy+Math.sin(q*0.5+i)*0.6); if (X<0||X>=320||Y<0) continue; if (!SKYM[Y*W+X+cam]) continue; var a=1-Math.abs(q/L-0.5)*2; if (bayer(X,Y)<a*0.8) fb.px(X,Y,P.b5); } } }
function front(fb,v,S,GS){ var we=WE;
  if (we==='rain') M.rain(fb,v.t,{n:95,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:250,slant:0.2});
  if (we==='bura'){ M.scn.buraDebris(fb,v.t,100,136,v.cam);
    // eine Plastiktüte, die über die Fahrbahn treibt
    var ph=(v.t*0.12)%1, bx=rd(-20+ph*440-v.cam), by=rd(102+Math.sin(v.t*5)*4-Math.abs(Math.sin(v.t*2.3))*6); if (bx>0&&bx<318){ fb.px(bx,by,P.s6); fb.px(bx+1,by,P.s5); fb.px(bx,by+1,P.s5); fb.px(bx+1,by-1,P.s6); } } }

// ---------------------------------------------------------------- Lauffläche: der Bürgersteig, von Ufer zu Ufer
function walk(x,y){ return y>=118 && y<=134 && x>=6 && x<=394; }
M.defineArt('strassenbr',{
  width:W, paint:paint, layers:function(S,GS,tod){ return [railLayer(S,GS,tod)]; }, walk:walk, dynamic:dyn, front:front,
  spots:{
    exit_e:[0,80,14,64], exit_w:[W-14,80,14,64],
    railing:[30,NR.top-2,340,NR.base-NR.top+7],
    river:[90,VP[1]+2,220,WY-VP[1]-4],
    traffic:[30,ROAD.y0-1,340,ROAD.y1-ROAD.y0+1],
    lamp:[LAMPS[1]-2,4,22,NR.base-4]
  },
  stands:{ exit_e:[8,126,'L'], exit_w:[392,126,'R'], railing:[200,128,'F'], river:[200,120,'B'], traffic:[150,120,'B'], lamp:[296,124,'B'] },
  actorPos:{ mala:[40,126,'R'] },
  start:[24,126,'R'], entries:{ map:[16,126,'R'] }
});
})(M);
