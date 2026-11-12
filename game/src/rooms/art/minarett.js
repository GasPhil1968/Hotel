/* ===== rooms/art/minarett.js — Oben auf dem Minarett der Koski-Mehmed-Pascha-Moschee (320 px) =====
   Der enge Umgang (Šerefe): links der Schaft aus Kalksteinquadern mit der kleinen Spitzbogentür zur Wendeltreppe, zwei
   Lautsprechertrichter und ein verblichener Stoffwimpel ohne Zeichen; vorn die Brüstung aus durchbrochenem Kalkstein (Ebene).
   Dahinter der Blick nach Südwesten: unten die grauen Steinplattendächer der Altstadt, die Alte Brücke von oben mit ihren
   beiden Türmen, die grüne Neretva, die nach Süden aus der Stadt fließt. Landmarken für die Peilung: am Westufer links der
   schlanke Glockenturm (ohne Kreuz), in der Mitte und rechts zwei gelbe Baukräne, am Ostufer links das Hochhaus „Razvitak“,
   hinten links der kahle Velež, rechts der Hum (ohne Kreuz). Regen: Wolken hängen am Velež, der Fluss geht hoch und trüb;
   Bura: tiefblau, Wolkenfetzen, der Wimpel knattert; grau: flaches Licht. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, HZ=42;                                       // Augenhöhe (Horizont)
var SHX=36, DOOR={x0:10,x1:28,apex:63,spring:73,sill:119};    // Schaft: rechte Kante; Tür zur Treppe
var PARA={top:111,x0:0};                                       // Brüstung (Ebene)
var BR={x0:113,x1:159,cx:136,deck:62,crown:66,spring:83,water:87}; // Alte Brücke
var TARA={x0:99,x1:114,top:55,base:82}, HALE={x0:158,x1:170,top:53,base:80};
var TOWER={x:158,base:58,top:5};                              // Glockenturm (Westufer, links)
var CRANES=[{x:212,base:61,top:25,j0:-13,j1:36},{x:287,base:66,top:30,j0:-35,j1:11}];
var RAZ={x0:66,x1:79,side:4,base:63,top:27};                   // Hochhaus Razvitak (Ostufer, links)
var SPK={x:34,y:8};                                           // Lautsprecher am Schaft, dort der Wimpel

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
// Schreiber, der Tiefe (für den Dunst) und Region mitschreibt
// Dunst: zur Dunstfarbe hin mischen, Ergebnis nur aus Landschaftsfarben (sonst werden Ziegel im Grau violett)
var HZL={}, HZN=null;
function hazeLut(col,k){ var key=col+'_'+k; if (HZL[key]) return HZL[key]; if (!HZN) HZN=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); var q=M.RGB[col], f=k/8;
  return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZN); }
function haze(b,amt,col){ for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=hazeLut(col,i)[c]; } }
var DEP=new Uint8Array(W*H), REG=new Uint8Array(W*H), RG={sky:0,mtn:1,town:2,water:3,bridge:4,land:5,near:6,shaft:7,floor:8};
function RW(b){ var o={d:0,g:0};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; DEP[k]=o.d; REG[k]=o.g; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.w=W; o.h=H; return o; }

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod,we){ var x, y;
  if (we==='grey' && tod==='day'){ var GR=R('m2 m3 m4 s4'); for (y=0;y<HZ+20;y++) for (x=0;x<W;x++){ var gb=fbm(x*0.7,y*2.4,30,8); b.px(x,y,ra(GR,0.3+y/(HZ+20)*0.5+(gb-0.5)*0.35,x,y)); } return; }
  if (we==='rain'||we==='grey'){ M.scn.sky(b,0,0,W,HZ+20,tod,we,53);
    if (tod==='day'){ var CL=R('m2 m3 s3 m4'); for (y=0;y<HZ+14;y++) for (x=0;x<W;x++){ var f=fbm(x*1.6,y*3.2,26,4)+(y<10?0.08:0); if (f>0.56 && bayer(x,y)<(f-0.56)*4) b.px(x,y,ra(CL,0.3+(f-0.56)*2.5-y/90,x,y)); } }
    return; }
  if (tod==='day'){ var bura=we==='bura', D=bura?R('b0 b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<HZ+20;y++){ var v=(bura?0.05:0.18)+Math.pow(y/(HZ+16),1.3)*(bura?0.86:0.78); for (x=0;x<W;x++) b.px(x,y,ra(D,v+(vn(x,y,50,2)-0.5)*0.05,x,y)); }
    var r=M.rng(bura?71:29);
    if (bura){ // Wolkenfetzen: vom Wind gestreckt und zerrissen, oben hell, unten bläulich
      for (var i=0;i<8;i++){ var cx=r()*W-20, cy=4+r()*26, L=16+r()*44, th=1.5+r()*3;
        for (var k=0;k<L;k++){ var u=k/L; if (fbm(cx+k*1.3,i*9,6,3)<0.4) continue; var hh=th*Math.sin(u*Math.PI)*(0.45+fbm(k*2+cx,i*3,5,5)), xx=rd(cx+k), yt=rd(cy-hh*0.6+u*2.5), yb2=rd(cy+hh*0.4+u*2.5);
          for (var yy=yt;yy<=yb2;yy++){ var q=(yy-yt)/Math.max(1,yb2-yt); if (q>0.8 && bayer(xx,yy)<0.5) continue; b.px(xx,yy,q<0.4?P.b5:(q<0.75?P.b4:P.b3)); } }
        for (var k3=0;k3<L*0.6;k3++){ var xs=rd(cx+L+k3), ys=rd(cy+2.5+k3*0.06); if (bayer(xs,ys)<0.5*(1-k3/(L*0.6))) b.px(xs,ys,P.b4); } } }
    else { for (var j=0;j<5;j++){ var cx2=r()*W, cy2=6+r()*22, L2=50+r()*90; for (var k2=0;k2<L2;k2++){ var xx2=rd(cx2+k2), yy2=rd(cy2+Math.sin(k2*0.06+j)*1.3+k2*0.02), a=1-Math.abs(k2/L2-0.5)*2; if (bayer(xx2,yy2)<a*0.45) b.px(xx2,yy2,P.b4); if (a>0.6 && bayer(xx2,yy2+1)<a*0.25) b.px(xx2,yy2+1,P.b5); } } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<HZ+20;y++) for (x=0;x<W;x++) b.px(x,y,ra(N,0.08+Math.pow(y/(HZ+14),1.5)*0.8,x,y));
    var r2=M.rng(41); for (var s=0;s<150;s++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.4)*(HZ-6)), q2=r2(); b.px(sx,sy,q2<0.08?P.n5:(q2<0.4?P.n4:P.n3)); } return; }
  M.sky(b,0,0,W,HZ+20,tod,17); }

// ---------------------------------------------------------------- Berge: Velež (links, kahler Kalk), Hügel im Süden, Hum (rechts)
function velY(x){ var p=Math.exp(-Math.pow((x-70)/44,2)), p2=Math.exp(-Math.pow((x-132)/30,2)), p3=Math.exp(-Math.pow((x-18)/30,2)); return HZ+4-30*p-12*p2-10*p3+Math.abs(Math.sin(x*0.21))*-1.6+(vn(x,3,7,4)-0.5)*3.4; }
function farY(x){ return HZ-4+Math.sin(x*0.05+1)*1.6+Math.sin(x*0.17)*0.7-Math.exp(-Math.pow((x-196)/20,2))*3; }
function humY(x){ if (x<170) return 99; var t=(x-170)/124; return x<294?24+27*Math.pow(1-t,1.5)+Math.sin(x*0.19)*0.6:24+(x-294)*0.18+Math.sin(x*0.3)*0.4; }
function paintHills(w,tod){ var x, y, night=tod==='night';
  // ganz hinten im Süden: blaue Hügel über der Ebene
  w.d=1; w.g=RG.mtn;
  for (x=90;x<240;x++){ var fy=rd(farY(x)); for (y=fy;y<=HZ+3;y++) w.px(x,y,night?P.k2:((y===fy||bayer(x,y)<0.3)?P.b3:P.b2)); }
  // Velež: kahler Kalk, Runsen und Grate; die Südflanken (links) im Licht, Schluchten im Schatten
  var VR=R('m0 m1 s1 m2 s2 s3 s4 s5');
  for (x=0;x<185;x++){ var ty=rd(velY(x)), sl=velY(x+2)-velY(x-2); for (y=ty;y<=HZ+5;y++){ var d=(y-ty)/(HZ+5-ty+1), gul=fbm(x*2.6+y*0.9,y*0.5,8,6), rib=Math.sin(x*0.42+y*0.35+fbm(x,y,12,2)*6);
      var v=0.5+(sl>0?-0.14:0.12)-d*0.2+(gul-0.5)*0.55+rib*0.12; if (rib>0.82) v+=0.18; if (rib<-0.8) v-=0.2; if (y===ty) v=0.9; else if (y===ty+1) v+=0.15;
      var c=ra(VR,v,x,y); if (d>0.7 && fbm(x*2,y*2,5,9)>0.56) c=(hash(x,y)<0.5)?P.e2:P.g2; w.px(x,y,c); } }
  // Hum: rundlich, Kiefern und Macchia, helle Felsen; oben eine kleine Lichtung (das Kreuz bleibt weg)
  for (x=170;x<W;x++){ var hy=rd(humY(x)); for (y=hy;y<HZ+22;y++){ var f=fbm(x*1.3,y*1.6,7,12), pine=fbm(x*2.6,y*2.8,4,17)>0.58;
      var c2=pine?ra(R('g0 g1 g2'),0.3+f*0.6,x,y):ra(R('g1 e1 g2 e2 g3 e3'),0.35+f*0.55-(y-hy)*0.004,x,y); if (y===hy) c2=P.g3; if (fbm(x*3,y*3,3,21)>0.74) c2=(y%2)?P.s3:P.e3; w.px(x,y,c2); } }
  if (night) return; }

// ---------------------------------------------------------------- Fluss: Lauf, Ufer
function riverX(y){ if (y<=84){ var t=cl((y-46)/38,0,1); return lerp(117,136,Math.pow(t,0.85))+Math.sin(y*0.31)*1.2*(1-t); } return lerp(136,198,cl((y-84)/28,0,1)); }
function riverW(y){ if (y<46) return 0; if (y<=84){ var t=(y-46)/38; return 0.5+t*t*15; } return 15.5+(y-84)/28*15; }
function inRiver(x,y,m){ return y>=46 && Math.abs(x+0.5-riverX(y))<=riverW(y)+(m||0); }
var WA=new Float32Array(W*H);                                  // Grundwert des Wassers (für dynamic)
function waterCol(x,y,t,we){ var k=y*W+x, base=WA[k], rx=riverX(y), u=(x+0.5-rx)/Math.max(1,riverW(y));
  var fl=Math.sin((y*1.7-t*2.4)+x*0.35)*0.5+Math.sin(y*0.9+x*0.11-t*1.3)*0.35, rp=we==='rain'?R('e1 e2 e3 s2 e4'):(we==='grey'?R('g1 a2 g2 a3 g3'):R('g1 a2 g3 a3 a4 a5')), c=ra(rp,base+fl*0.07,x,y);
  if (Math.abs(u)>0.82 && Math.sin(y*2.3+t*3+x)>0.3) c=we==='rain'?P.s4:P.a6;                 // Kräusel am Ufer
  if (y>80 && y<92 && Math.abs(x-BR.cx)<20 && Math.sin(x*1.3-t*4+y*2)>(we==='rain'?0.6:0.94)) c=we==='rain'?P.s4:P.s5;              // Strudel unter dem Bogen
  return c; }
function paintRiver(w,we){ var x, y, rain=we==='rain';
  for (y=46;y<H;y++){ var rx=riverX(y), hw=riverW(y); for (x=Math.floor(rx-hw-8);x<=Math.ceil(rx+hw+8);x++){ if (x<0||x>=W) continue; var dx=Math.abs(x+0.5-rx);
      if (dx<=hw){ var d=(y-46)/66, u=(x+0.5-rx)/Math.max(1,hw); WA[y*W+x]=0.52-d*0.14-Math.abs(u)*0.14+(fbm(x*0.4+y*0.3,y*2.6,7,3)-0.5)*0.22+(rain?0.06:0); w.d=3; w.g=RG.water; w.px(x,y,waterCol(x,y,0,we)); continue; }
      // Felsufer: heller Kalk, nach unten im Schatten, nass dunkel am Wasser
      var bandW=y<60?1:(y<84?2+(y-60)*0.25:8-(y-84)*0.1); if (dx>hw+bandW) continue; var e=(dx-hw)/bandW;
      var c=ra(R('s1 s2 s3 s4 s5'),0.25+e*0.6+(fbm(x*2,y*1.5,4,8)-0.5)*0.5,x,y); if (e<0.25) c=rain?P.e1:P.s1; w.d=y<60?2:3; w.g=RG.land; w.px(x,y,c); } } }

// ---------------------------------------------------------------- Häuser: Steinplattendächer (Altstadt), Ziegel- und Flachdächer (Westufer)
var LIT=[];                                                    // Fenster, die nachts leuchten können
function slabRoof(w,x0,x1,ey,rh,sd,big){ var ins=Math.max(1,rd(rh*0.85)), x, y;
  for (y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t)), row=Math.floor((ey-y)/(big?2:1));
    for (x=xa;x<=xb;x++){ var face=(x<x0+ins*(1-t)+1)?0:((x>x1-ins*(1-t)-1)?2:1), off=(row%2)*2, sl=Math.floor((x+off+sd*3)/(big?4:3));
      var c=face===0?P.m4:(face===2?P.m2:(hash(sl,row+sd)<0.25?P.s3:P.m3)); if (big && (ey-y)%2===0) c=face===2?P.m1:P.s2; else if (big && ((x+off+sd*3)%4===0)) c=M.DN[c];
      if (big && hash(x*3+sd,y)<0.04) c=P.e3; if (y===ey-rh) c=P.s1; if (y===ey) c=P.s1; w.px(x,y,c); } } }
function tileRoof(w,x0,x1,ey,rh,sd){ var ins=Math.max(1,rd(rh*0.8));
  for (var y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t));
    for (var x=xa;x<=xb;x++){ var c=((x+sd)%3===0)?P.t2:(hash(sd,1)<0.4?P.t2:P.t3); if (hash(sd,6)<0.3) c=(c===P.t3)?P.s2:P.m2; if (x<xa+1) c=P.t4; if (x>xb-1) c=P.t1; if (y===ey) c=P.t1; if (hash(x,y+sd)<0.06) c=P.t2; w.px(x,y,c); } } }
function oldHouse(w,x0,x1,yb,wh,rh,sd){ var x, y, wall=hash(sd,3)<0.7?R('s4 s5 s6'):R('s3 s4 s5'), big=(x1-x0)>13;
  for (y=yb-wh;y<yb;y++) for (x=x0;x<=x1;x++){ var c=wall[1]; if (x===x0) c=wall[2]; if (x>=x1-1) c=wall[0]; if (y===yb-wh) c=P.s1; if (hash(x>>1,y)<0.05) c=wall[0]; w.px(x,y,c); }
  // Fenster mit Holzläden, im Erdgeschoss eine Tür
  if (wh>=4){ var n=Math.max(1,Math.floor((x1-x0)/(big?7:5))); for (var i=0;i<n;i++){ var wx=x0+2+Math.floor((i+0.5)*(x1-x0-3)/n)-1, wy=yb-wh+(big?3:1), ww=big?2:1, wv=big?3:2;
      if (hash(wx,sd)<0.25 && big){ w.rect(wx-1,wy,ww+2,wv,P.w2); w.vl(wx,wy,wy+wv-1,P.w1); } else { w.rect(wx,wy,ww,wv,P.k2); if (big) w.px(wx-1,wy,P.w2); } LIT.push([wx,wy,ww,wv]);
      if (big && wh>9){ w.rect(wx,wy+5,ww,wv,P.k2); LIT.push([wx,wy+5,ww,wv]); } } }
  if (big && wh>8) w.rect(x0+3+Math.floor(hash(sd,7)*(x1-x0-8)),yb-5,3,5,P.w1);
  slabRoof(w,x0-1,x1+1,yb-wh-1,rh,sd,big);
  if (hash(sd,9)<0.45){ var cx=x0+3+Math.floor(hash(sd,11)*(x1-x0-5)), ch=big?4:2; w.rect(cx,yb-wh-rh-ch+1,big?2:1,ch,P.s3); w.px(cx,yb-wh-rh-ch,P.s1); CHIM.push([cx,yb-wh-rh-ch]); } }
var WCOL=[R('s3 s4 s5'),R('e3 e4 s5'),R('t3 t4 t5'),R('m2 m3 m4'),R('s4 s5 s6'),R('y2 y3 y4')];
function newHouse(w,x0,x1,yb,wh,rh,sd,flat){ var x, y, wc=WCOL[Math.floor(hash(sd,5)*WCOL.length)];
  for (y=yb-wh;y<yb;y++) for (x=x0;x<=x1;x++){ var c=wc[1]; if (x===x0) c=wc[2]; if (x===x1) c=wc[0]; w.px(x,y,c); }
  var fl=Math.max(2,Math.min(3,rd(wh/4)));
  for (y=yb-wh+1;y<yb-1;y+=fl) for (x=x0+1;x<x1;x+=2){ if (hash(x,y*sd)<0.15) continue; w.px(x,y,P.k2); LIT.push([x,y,1,1]); }
  if (flat){ w.hl(x0,x1,yb-wh-1,P.s2); w.hl(x0,x1,yb-wh-2,P.m4); if (hash(sd,2)<0.5) w.px(x0+2,yb-wh-3,P.m1); }
  else tileRoof(w,x0-1,x1+1,yb-wh-1,rh,sd); }
function cypress(w,x,yb,h){ for (var y=yb-h;y<yb;y++){ var t=(yb-y)/h, hw=Math.max(0,rd(Math.sin(Math.min(1,t*1.25)*Math.PI*0.5)*h*0.14*(t>0.85?(1-t)*5:1))); for (var i=-hw;i<=hw;i++) w.px(x+i,y,i<0?P.g2:(i>0?P.g0:P.g1)); } }
function bareTree(w,x,yb,h,sd){ var r=M.rng(sd*13+5); w.vl(x,yb-rd(h*0.45),yb,P.e1);
  for (var i=0;i<7;i++){ var a=-Math.PI/2+(r()-0.5)*1.9, L=h*(0.35+r()*0.45), bx=x, by=yb-h*0.35-r()*h*0.2; for (var k=0;k<L;k++){ bx+=Math.cos(a)*0.9; by+=Math.sin(a)*0.9; a+=(r()-0.5)*0.3; w.px(rd(bx),rd(by),k<L*0.4?P.e1:P.e2); }
    if (r()<0.5) w.px(rd(bx),rd(by),r()<0.5?P.y2:P.t3); } }
var CHIM=[];

// ---------------------------------------------------------------- Landmarken
function belltower(w){ var x=TOWER.x, by=TOWER.base, top=TOWER.top, y, i;
  // das Kirchenschiff (nur das Dach schaut über die Häuser), dann der hohe eckige Turm mit Glockenstube und Spitzhelm, ohne Kreuz
  tileRoof(w,x-2,x+18,by-1,4,3); w.rect(x-1,by-1,19,2,P.s4);
  var tw=3, hb=top+12;
  for (y=hb;y<by;y++){ for (i=-tw;i<=tw;i++){ var c=i<-1?P.s6:(i<1?P.s5:(i<tw?P.s4:P.s2)); if ((y-hb)%9===0) c=P.s3; w.px(x+i,y,c); } }
  for (y=hb+18;y<by-3;y+=8){ w.px(x-1,y,P.k2); w.px(x,y,P.k2); w.px(x-1,y+1,P.k2); }           // schmale Fenster
  w.hl(x-tw-1,x+tw+1,hb,P.s6); w.hl(x-tw-1,x+tw+1,hb+1,P.s3);
  for (y=hb+2;y<hb+10;y++){ w.px(x-tw,y,P.s5); w.px(x+tw,y,P.s2); for (i=-tw+1;i<tw;i++) w.px(x+i,y,(i===0)?P.s4:((y<hb+3)?P.k2:P.k1)); }   // Glockenstube, zwei Schallöffnungen
  w.px(x-1,hb+6,P.y1); w.px(x+1,hb+6,P.y1);
  w.hl(x-tw-1,x+tw+1,hb+10,P.s6); w.hl(x-tw,x+tw,hb+11,P.s3); w.rect(x-1,hb+13,3,3,P.s6); w.px(x,hb+14,P.k2);     // Uhr
  for (y=top;y<hb;y++){ var hw=Math.floor((y-top)/3.2); for (i=-hw;i<=hw;i++) w.px(x+i,y,i<0?P.m3:(i>0?P.m0:P.m2)); }
  w.px(x,top-1,P.m2); }
function crane(w,c){ var x=c.x, top=c.top, by=c.base, y, i, Y=[P.y2,P.y3,P.y4];
  // Gittermast, Drehkranz mit Führerhaus, Ausleger, Gegenausleger mit Ballast, Seil und Haken
  for (y=top+3;y<by;y++){ w.px(x-1,y,Y[2]); w.px(x+1,y,Y[0]); w.px(x,y,((y+x)%3===0)?Y[1]:T); }
  for (y=top+5;y<by;y+=3) w.px(x,y,Y[1]);
  w.rect(x-2,top+1,5,3,Y[1]); w.px(x+2,top+2,P.s6); w.px(x+1,top+2,P.b3);
  w.vl(x,top-4,top,Y[1]); var jy=top+1;
  for (i=c.j0;i<=c.j1;i++){ var xx=x+i; w.px(xx,jy,(i%2)?Y[2]:Y[1]); if (i%3===0) w.px(xx,jy+1,Y[0]); }
  var tipA=x+c.j0, tipB=x+c.j1; w.line(x,top-4,tipB,jy,Y[0]); w.line(x,top-4,tipA,jy,Y[0]);
  var bx=c.j0<-20?x+c.j1-3:x+c.j0; w.rect(bx,jy+1,4,3,P.m2); w.hl(bx,bx+3,jy+1,P.m3);
  var hx=c.j1>20?x+c.j1-7:x+c.j0+9; w.vl(hx,jy+1,jy+8,P.k2); c.hook=[hx,jy+1,jy+14];
  // Rohbau am Fuß: Betonskelett mit Schalung
  var b0=x-9, b1=x+12; for (y=by-9;y<by;y++) for (var xx2=b0;xx2<b1;xx2++){ var cc=((y-(by-9))%3===0)?P.s4:(((xx2-b0)%4===0)?P.m3:P.k2); w.px(xx2,y,cc); }
  w.hl(b0,b1-1,by-10,P.w3); }
function razvitak(w){ var o=RAZ, x, y;
  for (y=o.top;y<o.base;y++){ for (x=o.x0;x<o.x1;x++){ var fy=(y-o.top)%3, c=fy===0?P.s5:((fy===1)?(((x-o.x0)%3===2)?P.s4:P.n1):P.s4); if (x===o.x0) c=P.s6; if (x===o.x0+6) c=P.s5; w.px(x,y,c); if (fy===1 && (x-o.x0)%3!==2) LIT.push([x,y,1,1]); }
    for (x=o.x1;x<o.x1+o.side;x++){ var fy2=(y-o.top)%3; w.px(x,y,fy2===1?P.k2:P.m2); } }
  w.rect(o.x0+3,o.top-3,5,3,P.s3); w.hl(o.x0,o.x1+o.side-1,o.top,P.s6); w.vl(o.x0+9,o.top-7,o.top-1,P.m1); w.px(o.x0+9,o.top-8,P.r3); }

// ---------------------------------------------------------------- Die Alte Brücke von oben, mit Tara und Halebija
function archTop(x){ var u=(x+0.5-BR.cx)/((BR.x1-BR.x0)/2); if (Math.abs(u)>1) return 99; var a=Math.sqrt(Math.max(0,1-u*u)); return BR.spring-(BR.spring-BR.crown)*Math.pow(a,0.75)-(Math.abs(u)<0.18?(0.18-Math.abs(u))*4:0); }
function deckY(x){ var u=(x+0.5-BR.cx)/((BR.x1-BR.x0)/2); return BR.deck+Math.pow(Math.abs(u),1.6)*5; }
function paintBridge(w,we){ var x, y, wet=we==='rain';
  w.d=4; w.g=RG.bridge;
  for (x=BR.x0-2;x<=BR.x1+2;x++){ var dy=rd(deckY(x)), at=archTop(x);
    // Gehweg oben (von oben gesehen): Stufenrippen, Brüstungen
    w.px(x,dy-2,P.s6); w.px(x,dy-1,(x%3===0)?P.s4:P.s5); w.px(x,dy,P.s5); w.px(x,dy+1,P.s6);
    // Stirnseite: Quader in Lagen, darunter die Bogenleibung im Schatten, das Wasser hinten
    for (y=dy+2;y<BR.water;y++){ if (y>=at){ if (y<at+2) w.px(x,y,P.s1); continue; } var lay=Math.floor((y-dy)/2), c=(((x+lay*3)%6)===0)?P.s2:(hash(x>>1,lay)<0.3?P.s3:P.s4); if (y===dy+2) c=P.s2; if (y>at-2) c=P.s5; if (wet) c=M.DN[c]; w.px(x,y,c); } }
  // Widerlager: der Bogen sitzt auf dem Fels
  for (y=BR.spring-4;y<BR.water+1;y++){ for (x=BR.x0-4;x<BR.x0+3;x++) w.px(x,y,ra(R('s1 s2 s3 s4'),0.4+(fbm(x*2,y*2,3,5)-0.5)*0.7,x,y)); for (x=BR.x1-3;x<BR.x1+4;x++) w.px(x,y,ra(R('s1 s2 s3'),0.4+(fbm(x*2,y*2,3,6)-0.5)*0.7,x,y)); }
  // Leute auf der Brücke (winzig), bei Regen mit Schirmen
  [[128,0],[133,1],[146,2]].forEach(function(p,i){ var px=p[0], py=rd(deckY(px))-1; w.px(px,py,[P.r3,P.c2,P.k2][i]); w.px(px,py-1,P.p3); if (wet){ w.hl(px-1,px+1,py-2,[P.r2,P.b1,P.y2][i]); } });
  // Tara (Ostseite, links): halbrund, Steinplattendach; Halebija (Westseite, rechts): eckig
  var t=TARA; for (y=t.top+4;y<t.base;y++) for (x=t.x0;x<t.x1;x++){ var u=(x-t.x0)/(t.x1-t.x0), c2=u<0.3?P.s5:(u<0.7?P.s4:P.s2); if ((y-t.top)%4===0) c2=M.DN[c2]; w.px(x,y,c2); }
  slabRoof(w,t.x0-1,t.x1,t.top+4,4,7,false); w.rect(t.x0+5,t.top+9,2,3,P.k2); w.rect(t.x0+10,t.top+12,1,2,P.k2);
  var h=HALE; for (y=h.top+4;y<h.base;y++) for (x=h.x0;x<h.x1;x++){ var c3=(x===h.x0)?P.s5:((x>h.x1-3)?P.s2:P.s4); if ((y-h.top)%4===0) c3=M.DN[c3]; w.px(x,y,c3); }
  slabRoof(w,h.x0-1,h.x1,h.top+4,4,9,false); w.rect(h.x0+4,h.top+8,2,3,P.k2);
  // Felsen unter den Türmen bis zum Wasser
  for (y=t.base;y<BR.water+2;y++){ for (x=t.x0-2;x<t.x1+2;x++) if (!inRiver(x,y)) w.px(x,y,ra(R('s1 s2 s3 s4'),0.45+(fbm(x*1.7,y*1.7,4,11)-0.5)*0.8,x,y)); }
  for (y=h.base;y<BR.water+2;y++){ for (x=h.x0-1;x<h.x1+3;x++) if (!inRiver(x,y)) w.px(x,y,ra(R('s1 s2 s3 s4'),0.42+(fbm(x*1.7,y*1.7,4,13)-0.5)*0.8,x,y)); } }

// ---------------------------------------------------------------- die Stadt: Reihen von hinten nach vorn, Landmarken an ihrer Stelle
function paintTown(w,we){ var yb, x, r=M.rng(91);
  var marks=[{y:TOWER.base,f:function(){ w.d=3; w.g=RG.town; belltower(w); }},{y:CRANES[0].base,f:function(){ w.d=3; crane(w,CRANES[0]); }},{y:CRANES[1].base,f:function(){ w.d=3; crane(w,CRANES[1]); }},
    {y:RAZ.base,f:function(){ w.d=3; razvitak(w); }},{y:BR.spring+1,f:function(){ paintBridge(w,we); }}];
  // zwei Wohnblöcke am Westufer, ein Minarett am Ostufer weiter südlich
  marks.push({y:55,f:function(){ w.d=2; newHouse(w,236,246,55,13,0,41,true); newHouse(w,304,318,56,15,0,43,true); }});
  marks.push({y:52,f:function(){ w.d=2; M.scn.minaret(w,48,52,22,{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')}); w.ellipse(56,50,4,3,function(xx,yy){ return yy<49?P.m3:P.m2; }); }});
  marks.sort(function(a,b){ return a.y-b.y; }); var mi=0;
  for (yb=HZ+2;yb<=PARA.top+6;){ while (mi<marks.length && marks[mi].y<=yb){ marks[mi].f(); mi++; }
    var s=(yb-HZ)/(110-HZ), sc=0.25+s*2.6+Math.max(0,s-0.72)*5; w.d=yb<54?2:(yb<84?3:6); w.g=RG.town;
    x=Math.floor(hash(yb,1)*5)+SHX-4;
    while (x<W){ var bw=Math.max(2,rd((3+hash(x,yb)*6)*sc)), wh=Math.max(1,rd((1.5+hash(yb,x)*3)*sc*(yb>84?0.7:1))), rh=Math.max(1,rd(bw*(yb>84?0.4:0.28)+0.3)), xc=x+bw/2, east=xc<riverX(yb);
      if (!inRiver(xc,yb,bw/2+2+(yb<84?2:5))){ var sd=Math.floor(hash(x*3,yb*7)*997);
        if (hash(x*0.7,yb*1.3)<0.1){ if (east && hash(sd,1)<0.5) cypress(w,rd(xc),yb,rd(5+sc*4)); else bareTree(w,rd(xc),yb,rd(4+sc*4),sd); }
        else if (east || yb>86 || hash(sd,8)<0.22) oldHouse(w,x,x+bw,yb,wh+(yb>86?2:0),rh,sd);
        else newHouse(w,x,x+bw,yb,rd(wh*(yb<60?1.7:1.3)),rh,sd,hash(sd,4)<(yb<62?0.65:0.45)); }
      x+=bw+(hash(x,yb*5)<0.3?Math.max(1,rd(sc)):0)+1; }
    yb+=Math.max(1,rd(s*3.4)); }
  while (mi<marks.length){ marks[mi].f(); mi++; } }

// ---------------------------------------------------------------- Vordergrund: Schaft mit Tür, Umgang
function paintShaft(w,we){ var x, y, wet=we==='rain'; w.d=7; w.g=RG.shaft;
  function ang(xx){ return Math.asin(cl((xx+0.5)/(SHX+1),0,0.995)); }
  for (y=0;y<H;y++){ var course=Math.floor(y/6), fv=y-course*6, off=(course%2)*0.5;
    for (x=0;x<=SHX;x++){ var u=x/SHX, j=Math.floor(ang(x)*9+off)!==Math.floor(ang(x-1)*9+off);
      var v=0.64-Math.pow(u,2.4)*0.46+(fbm(x*1.5,y*0.8,7,4)-0.5)*0.16, c=ra(R('m1 s1 s2 s3 s4 s5'),v,x,y);
      if (fv===0) c=M.DN[c]; else if (fv===1 && u<0.85) c=M.UP[c]; if (j && fv>0) c=M.DN[c]; if (x>=SHX-1) c=(x===SHX)?P.s4:P.s1; if (wet) c=M.DN[c]; w.px(x,y,c); } }
  // Regenspuren und dunkle Kruste unter dem Umgang
  for (x=0;x<SHX;x++){ var L=10+rd(fbm(x*0.9,1,8,3)*30); for (y=0;y<L;y++) if (bayer(x,y)<0.3*(1-y/L)) w.px(x,y,M.DN[w.get(x,y)]); }
  // Spitzbogentür, drinnen die ersten Stufen der Wendeltreppe
  var d=DOOR, cx=(d.x0+d.x1)/2, hw=(d.x1-d.x0)/2;
  function inA(xx,yy,e){ var dx=Math.abs(xx+0.5-cx); if (dx>hw+e) return false; if (yy>=d.spring) return yy<d.sill; var R0=hw*1.55+e, ccx=cx+(xx<cx?hw*0.55:-hw*0.55), ddx=xx+0.5-ccx, ddy=yy-d.spring; return ddx*ddx+ddy*ddy<R0*R0 && yy>=d.apex-e; }
  for (y=d.apex-3;y<d.sill+1;y++) for (x=d.x0-3;x<=d.x1+3;x++){ if (inA(x,y,0)){ var dd=(y-d.apex)/(d.sill-d.apex), c2=P.k0; if (y>d.sill-14){ var st=Math.floor((y-(d.sill-14))/3); c2=((y-(d.sill-14))%3===0)?P.s2:(st%2?P.k2:P.m0); if (x>cx+st) c2=P.k1; } else if (dd>0.25 && x<cx-2) c2=P.k1; w.px(x,y,c2); } else if (inA(x,y,2.2)) w.px(x,y,(x<cx)?P.s5:P.s2); }
  w.hl(d.x0-3,d.x1+3,d.sill,P.s5); w.hl(d.x0-2,d.x1+2,d.sill+1,P.s2);
  // Lautsprecher und Kabel
  w.vl(SPK.x-6,SPK.y+4,d.apex-4,P.k2); w.rect(SPK.x-7,SPK.y-1,8,3,P.m1);
  w.poly([[SPK.x,SPK.y-2],[SPK.x+5,SPK.y-5],[SPK.x+5,SPK.y+5],[SPK.x,SPK.y+2]],function(xx,yy){ return yy<SPK.y?P.m4:P.m2; }); w.vl(SPK.x+5,SPK.y-5,SPK.y+5,P.m1);
  w.poly([[SPK.x-8,SPK.y+9],[SPK.x-2,SPK.y+7],[SPK.x-2,SPK.y+14],[SPK.x-8,SPK.y+12]],function(xx,yy){ return yy<SPK.y+10?P.m3:P.m2; }); w.px(SPK.x-2,SPK.y+10,P.m1); }
function paintFloor(w,we){ var x, y, wet=we==='rain'; w.d=7; w.g=RG.floor;
  for (y=PARA.top;y<H;y++) for (x=0;x<W;x++){ if (x<=SHX && y<=DOOR.sill) continue; var row=Math.floor((y-PARA.top)/5), fy=(y-PARA.top)%5, off=(row%2)*9, fx=(x+off)%18, c=hash(Math.floor((x+off)/18),row)<0.4?P.s1:P.s2;
      if (fy===0||fx===0) c=P.k2; if (x<SHX+16) c=M.DN[c]; if (wet) c=(fy===1 && hash(x>>2,row)<0.4)?P.m3:M.DN[c]; w.px(x,y,c); } }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), WE='calm';
var LASTL=[];   // Lichter des letzten Bildes (Kapitel-3-Grafik)
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k, night=tod==='night';
  WE=we; DEP.fill(0); REG.fill(0); LIT.length=0; CHIM.length=0;
  paintSky(b,tod,we); for (k=0;k<W*H;k++){ DEP[k]=0; REG[k]=RG.sky; }
  paintHills(w,tod);
  // Land unter dem Horizont: Talgrund im Süden, Gärten und Gassen zwischen den Häusern
  w.g=RG.land; for (y=HZ;y<H;y++){ var s0=cl((y-HZ)/(PARA.top-HZ),0,1); w.d=y<52?2:(y<84?3:6); for (x=0;x<W;x++){ if (REG[y*W+x]!==RG.sky) continue;
      var f0=fbm(x*1.1,y*1.9,6,7), c0=s0<0.18?ra(R('e2 e3 s3 e4 s4'),0.55+(f0-0.5)*0.6,x,y):(s0<0.5?ra(R('e1 g1 e2 s2 g2 e3'),0.5+(f0-0.5)*0.7,x,y):ra(R('k2 s0 e1 g1 s1 e2'),0.45+(f0-0.5)*0.7,x,y)); w.px(x,y,c0); } }
  paintRiver(w,we); paintTown(w,we);
  paintShaft(w,we); paintFloor(w,we);
  // Dunst: die Ferne verblasst, je nach Wetter
  var hk=we==='bura'?[0,0.12,0.06,0.03,0.01,0]:(we==='rain'?[0,0.82,0.58,0.34,0.16,0.08]:(we==='grey'?[0,0.62,0.42,0.24,0.1,0.04]:[0,0.22,0.14,0.07,0.03,0.01]));
  var hc=night?P.m0:(we==='rain'?P.m3:(we==='grey'?P.m4:P.b4));
  haze(b,function(xx,yy){ var d=DEP[yy*W+xx]; if (d===0||d>=6) return 0; var a=hk[d]||0; if (d===1 && REG[yy*W+xx]===RG.mtn) a+=Math.max(0,(HZ-yy)/HZ)*0.12; return a; },hc);
  // Regen und Grau: Wolken hängen am Velež
  if ((we==='rain'||we==='grey') && !night) for (y=0;y<HZ+4;y++) for (x=0;x<200;x++){ var f=fbm(x*1.2,y*2.6,18,31), lim=we==='rain'?0.42:0.5; if (REG[y*W+x]===RG.mtn && f>lim-(HZ-y)*0.012 && bayer(x,y)<(we==='rain'?0.85:0.55)) b.d[y*W+x]=we==='rain'?(f>0.6?P.s3:P.m3):(f>0.6?P.m4:P.m3); }
  // Licht: Bura klar und hart, Grau und Regen flach und dunkler
  var amb=we==='rain'?-0.55:(we==='grey'?-0.3:(we==='bura'?0.1:0));
  M.light(b,M.lf.sum(M.lf.k(amb),function(xx,yy){ return REG[yy*W+xx]===RG.floor?-0.4:0; }),0,0,function(xx,yy){ return REG[yy*W+xx]!==RG.sky; });
  SKYM.fill(0); for (k=0;k<W*H;k++) if (REG[k]===RG.sky) SKYM[k]=1;
  var lights=[]; LASTL=lights; if (tod!=='day'){ lights.push([BR.cx,BR.deck+6,30,0.5,10]); lights.push([DOOR.x0+9,DOOR.sill-8,12,0.6,20]); }
  return M.finishTOD(b,tod,{ sky:function(xx,yy){ return SKYM[yy*W+xx]===1; }, lights:lights, after:function(o,tod2){ if (tod2==='day') return;
      LIT.forEach(function(p){ if (hash(p[0]*1.3,p[1]*2.1)>(tod2==='night'?0.42:0.25)) return; for (var yy=p[1];yy<p[1]+p[3];yy++) for (var xx=p[0];xx<p[0]+p[2];xx++) o.px(xx,yy,hash(xx,yy)<0.5?P.y3:P.y4); });
      for (var xx=BR.x0+2;xx<BR.x1-1;xx+=7) o.px(xx,rd(deckY(xx))-2,P.y5); } }); }

// ---------------------------------------------------------------- Ebene: die durchbrochene Steinbrüstung
function paraLayer(S,GS,tod){ var we=weaOf(GS), L=M.layer(0,PARA.top-3,W,H-PARA.top+3,H+4), w=M.lw(L), x, y, wet=we==='rain';
  var top=PARA.top, pan0=top+5, pan1=H-6;
  for (x=0;x<W;x++){ var u=x/W;
    // Abdeckplatte, gerundet, oben im Licht
    if (wet){ w.px(x,top-2,P.s3); w.px(x,top-1,(hash(x>>2,3)<0.3)?P.m4:P.s4); w.px(x,top,P.s3); w.px(x,top+1,P.s2); w.px(x,top+2,P.s2); w.px(x,top+3,P.k2); w.px(x,top+4,P.s1); }
    else { w.px(x,top-2,P.s5); w.px(x,top-1,P.s6); w.px(x,top,P.s5); w.px(x,top+1,P.s4); w.px(x,top+2,P.s3); w.px(x,top+3,P.s1); w.px(x,top+4,P.s2); }
    var seg=(x+6)%38, post=seg<5;
    for (y=pan0;y<pan1;y++){ var c;
      if (post){ c=seg===0?P.s4:(seg===4?P.s1:(seg===1?P.s5:P.s3)); if ((y-pan0)%9===0) c=P.s2; }
      else { var uu=(seg-5)%8, vv=(y-pan0)%8, dd=Math.abs(uu-3.5)+Math.abs(vv-3.5); if (dd<2.6 && y>pan0+1 && y<pan1-2 && seg>6 && seg<36) continue;   // Rautenöffnung
        c=dd<3.6?P.s2:(dd<4.4?P.s4:P.s3); if (y===pan0||y===pan1-1) c=P.s2; if (hash(x>>1,y)<0.06) c=P.s1; }
      if (wet) c=M.DN[c]; w.px(x,y,c); }
    for (y=pan1;y<H;y++) w.px(x,y,(y===pan1)?P.s4:(hash(x>>2,y)<0.3?P.s2:P.s3)); }
  // Moos und Regenspuren in den Fugen, ein Vogelkot-Fleck auf der Abdeckung
  for (x=0;x<W;x+=1){ if (fbm(x*2,1,6,8)>0.66) w.px(x,top+4,P.g2); }
  w.px(212,top-1,P.s6); w.px(213,top,P.s6); w.px(212,top,P.s5);
  if (tod!=='day') M.tintApply(L,M.TINT[tod]);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Fluss, Wimpel, Vögel, Rauch, Wolkenfetzen, Kranhaken
function dyn(fb,v,S,GS){ var t=v.t, we=WE, tod=v.tod, x, y, tint=tod!=='day'?M.TINT[tod]:null;
  // Wasser fließt: helle Strömungslinien und Glanz wandern über das fertige Bild
  for (y=56;y<PARA.top;y++){ var rx=riverX(y), hw=riverW(y); for (x=Math.max(0,Math.floor(rx-hw));x<=Math.min(W-1,Math.ceil(rx+hw));x++){ var k=y*W+x; if (REG[k]!==RG.water) continue;
      var wv=Math.sin(y*1.9-t*2.6+x*0.42)+Math.sin(y*0.7+x*0.13-t*1.4)*0.8; if (wv>1.35) fb.d[k]=M.UP[fb.d[k]]; else if (wv<-1.55) fb.d[k]=M.DN[fb.d[k]];
      if (y>BR.spring-4 && y<BR.water+6 && Math.abs(x-BR.cx)<17 && Math.sin(x*1.1-t*5+y*2.2)>(we==='rain'?0.8:0.97)) fb.d[k]=tod==='day'?(we==='rain'?P.s4:P.s5):P.n3; } }
  // Rauch aus den Kaminen: steigt bei Windstille, liegt bei Bura flach, bei Regen keiner
  if (we!=='rain') CHIM.forEach(function(c,i){ if (c[1]<70 || i%2) return; for (var j=0;j<7;j++){ var ph=(t*0.6+j/9+i*0.37)%1, sx=c[0]+(we==='bura'?ph*18:Math.sin(ph*5+i)*1.5+ph*3), sy=c[1]-1-(we==='bura'?ph*2:ph*10); var X=rd(sx), Y=rd(sy); if (X<0||X>=W||Y<0||Y>=H||REG[Y*W+X]===RG.shaft) continue; if (bayer(X,Y)<0.45-ph*0.4) fb.px(X,Y,tod==='day'?(we==='grey'?P.s4:P.s5):P.m1); } });
  // Wolkenfetzen ziehen bei Bura schnell über den Himmel
  if (we==='bura' && tod==='day') for (var i=0;i<4;i++){ var sp=24+hash(i,3)*20, cx=((hash(i,1)*W+t*sp)%(W+60))-30, cy=6+hash(i,2)*26, L=10+hash(i,4)*14;
    for (var q=0;q<L;q++){ var X2=rd(cx+q), Y2=rd(cy+Math.sin(q*0.5+i)*0.6); if (X2<0||X2>=W||Y2<0) continue; var kk=Y2*W+X2; if (!SKYM[kk]) continue; var a=1-Math.abs(q/L-0.5)*2; if (bayer(X2,Y2)<a*0.8) fb.d[kk]=P.b5; if (a>0.5 && bayer(X2,Y2+1)<a*0.5 && SKYM[kk+W]) fb.d[kk+W]=P.b4; } }
  // Kranhaken pendeln im Wind (Seil unten und Haken)
  CRANES.forEach(function(c,i){ if (!c.hook) return; var sw=(we==='bura'?Math.sin(t*1.7+i)*2.2:Math.sin(t*0.5+i)*0.4), hx=c.hook[0], y0=c.hook[1]+8;
    for (y=y0;y<=c.hook[2]+2;y++){ var X3=rd(hx+sw*(y-y0)/8), cc=y>c.hook[2]?P.r2:P.k2; if (tint) cc=M.tintPx(tint,cc,X3,y); fb.px(X3,y,cc); if (y>c.hook[2]) fb.px(X3+1,y,cc); } });
  // Tauben kreisen über den Dächern, bei Bura werden sie abgetrieben
  if (we!=='rain') for (var n=0;n<5;n++){ var a2=t*(0.6+hash(n,5)*0.4)+n*1.3, rx2=26+hash(n,6)*20, px=rd(80+n*22+Math.cos(a2)*rx2+(we==='bura'?Math.sin(t*0.9+n)*12:0)), py=rd(84+hash(n,7)*16+Math.sin(a2)*6), f=Math.floor(t*7+n)%2;
    if (px<SHX+2||px>=W-2||py>=PARA.top) continue; var bc=tod==='day'?P.m1:P.k2; fb.px(px,py,bc); fb.px(px-1,py-f,bc); fb.px(px+1,py-f,bc); if (f) fb.px(px,py+1,P.m3); }
  // ferne Dohlen über dem Hum
  if (tod==='day' && we!=='rain') for (var m=0;m<3;m++){ var fx=rd((hash(m,9)*120+t*(4+m*2))%140)+170, fy=rd(30+hash(m,8)*10+Math.sin(t*1.2+m)*2); if (fx<W) fb.px(fx,fy,P.k2); }
  // der Wimpel am Lautsprecher: bei Bura flatternd, sonst hängend (ein Stoffstreifen ohne Zeichen)
  var wx=SPK.x+2, wy=SPK.y+5, len=we==='bura'?15:9, py0=null;
  function cpx(X,Y,c){ fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  for (var s=0;s<len;s++){ var c1=we==='rain'?P.s3:P.s6, c2=we==='rain'?P.s1:P.s3;
    if (we==='bura'){ var X5=wx+s, Y5=rd(wy+Math.sin(t*12-s*0.75)*(0.5+s*0.17)+s*0.12), ya=py0===null?Y5:Math.min(Y5,py0), yb=py0===null?Y5:Math.max(Y5,py0); py0=Y5;
      for (var yy=ya;yy<=yb+(s<len-4?1:0);yy++) cpx(X5,yy,yy>yb?c2:c1); if (s%5===4) cpx(X5,yb+1,c2); }
    else { var sw2=(we==='calm'?Math.sin(t*0.7)*0.25:Math.sin(t*1.3)*0.6)*s*0.3, X6=wx+rd(sw2), Y6=wy+s; cpx(X6,Y6,c1); if (s<len-2) cpx(X6+1,Y6,c2); } }
  cpx(wx,wy,P.k2); cpx(wx-1,wy,P.k2); cpx(wx-1,wy+1,P.k2); }
function front(fb,v,S,GS){ var we=WE;
  if (we==='rain') M.rain(fb,v.t,{n:90,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:250,slant:0.18});
  if (we==='bura') M.scn.buraDebris(fb,v.t,96,128,v.cam); }

// ---------------------------------------------------------------- Lauffläche: der schmale Umgang
function walk(x,y){ return y>=118 && y<=134 && x>=40 && x<=280; }
M.defineArt('minarett',{
fx:{ lights:function(){ return M.k3LB(LASTL); } },   // Lampen für Licht auf den Figuren und Schatten (Kapitel 3, 21_k3_look.js)
  width:W, paint:paint, layers:function(S,GS,tod){ return [paraLayer(S,GS,tod)]; }, walk:walk, dynamic:dyn, front:front,
  spots:{
    stairs:[DOOR.x0-3,DOOR.apex-3,DOOR.x1-DOOR.x0+7,DOOR.sill-DOOR.apex+4],
    rail:[SHX,PARA.top-3,W-SHX,H-PARA.top+3],
    view:[SHX+2,0,W-SHX-2,PARA.top-4],
    tower_l:[TOWER.x-6,TOWER.top-2,13,TOWER.base-TOWER.top+2],
    cranes:[CRANES[0].x+CRANES[0].j0-2,CRANES[0].top-6,CRANES[1].x+CRANES[1].j1-(CRANES[0].x+CRANES[0].j0)+5,CRANES[1].base-CRANES[0].top+7]
  },
  stands:{ stairs:[44,122,'L'], rail:[176,126,'B'], view:[150,122,'B'], tower_l:[158,122,'B'], cranes:[236,122,'B'] },
  actorPos:{},
  start:[46,124,'R'], entries:{ koski:[46,124,'R'] }
});
})(M);
