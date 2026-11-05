/* ===== rooms/art/skela_l.js — Skela, linkes Ufer: Zlatas Hof, Batos Schuppen, der Quittenbaum (480 px, scrollend) =====
   Ein Bauernhof am flachen Ufer. Links kommt der Weg von der neuen Brücke, am Wasser der Holzsteg und Batos Schuppen (offen,
   darin die Sturmlaterne, zwei Ruder, ein Netz, die Wathose am Haken). In der Mitte der Hof mit Hackklotz und Hühnern, rechts
   Zlatas Haus: weiß verputzt, Steinplattendach, unten das breite Küchenfenster, daneben tief und schmal das Stubenfenster,
   oben unter dem Dach klein das Dachfenster (dieselben Fenster wie in skela_d von drüben), Haustür, Holzstapel. Ganz rechts der
   Quittenbaum mit der letzten gelben Quitte und darunter das kleine Grab: ein Beet mit Chrysanthemen, ein flacher Stein, ein
   verwittertes Brett. Drüben über dem Fluss das Hochufer, klein: Hütte, Glocke, Anker, die Rampe, die Stümpfe.
   Zustände: S.lit, S.lantern, S.zlataLamp (Zlata mit der Petroleumlampe), S.ferry ('here' = am Steg).
   Malas Sicht: am Grab das Ende ihrer Leine (zum Haus, zu Zlata); im Schuppen Batos Leine über den Fluss zur Glocke. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function puff(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bx=0, by=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.15+hash(gx+i+sd,gy+j)*0.7)*sx, cy=(gy+j+0.15+hash(gx+i,gy+j+sd*1.7)*0.7)*sy;
    var dx=(x-cx)/sx, dy=(y-cy)/sy, d=dx*dx+dy*dy; if (d<b1){ b2=b1; b1=d; bx=dx; by=dy; } else if (d<b2) b2=d; }
  var v=0.6-by*0.75-bx*0.25-b1*0.3; if (b2-b1<0.1) v-=0.32; return v; }
var STONE=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5'),R('e2 e3 s3 s4'),R('s2 s3 s4 s4')];
function rubble(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bi=0, bj=0, bdx=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.2+hash(gx+i+sd,gy+j)*0.6)*sx, cy=(gy+j+0.2+hash(gx+i,gy+j+sd*1.3)*0.6)*sy, dx=(x-cx)/sx, dy=(y-cy)/sy, q=dx*dx+dy*dy;
    if (q<b1){ b2=b1; b1=q; bi=gx+i; bj=gy+j; bdx=dx; bdy=dy; } else if (q<b2) b2=q; }
  var edge=Math.sqrt(b2)-Math.sqrt(b1); if (edge<0.13) return hash(x,y)<0.5?P.s1:P.e1;
  var rr=STONE[Math.floor(hash(bi*3+sd,bj*5)*STONE.length)], t=hash(bi*7,bj*3+sd), k=t<0.35?1:(t<0.85?2:3), c=rr[k];
  if (bdy<-0.18&&bdx<0.2) c=rr[Math.min(3,k+1)]; else if (bdy>0.2||bdx>0.3) c=rr[k-1]; return c; }
var REG=new Uint8Array(W*H), RG={none:0,sky:1,hill:2,far:3,water:4,ground:5,wall:6,roof:7,wood:8,glass:9,veg:10,grave:11,stone:12};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Geometrie
function farTop(x){ return 49+Math.sin(x*0.03+1)*1.5+Math.sin(x*0.11)*0.6; }       // Oberkante des Hochufers drüben
function farWL(x){ return 66+Math.sin(x*0.05)*0.6; }                                  // Wasserlinie drüben
function nearWL(x){ return 98+Math.sin(x*0.07+2)*1.2+Math.sin(x*0.19)*0.6; }          // Wasserlinie hier (flaches Ufer)
var HSE={x0:250,base:112,w:150};                                                       // Zlatas Haus
var FAC={gf:0.34, knee:0.11, roof:0.19, door:[0.07,0.24,0,0.92], kitchen:[0.31,0.58,0.42,0.82], stube:[0.70,0.79,0.12,0.84], roofw:[0.47,0.56,0.22,0.86], chim:0.78};
function facRect(k){ var w=HSE.w, gf=Math.round(w*FAC.gf), kn=Math.round(w*FAC.knee), f=FAC[k], x0=HSE.x0+Math.round(f[0]*w), x1=HSE.x0+Math.round(f[1]*w);
  if (k==='roofw'){ var yb=HSE.base-gf; return [x0,yb-Math.round(f[3]*kn),x1-x0,Math.max(2,Math.round((f[3]-f[2])*kn))]; }
  return [x0,HSE.base-Math.round(f[3]*gf),x1-x0,Math.max(2,Math.round((f[3]-f[2])*gf))]; }
var GF=Math.round(HSE.w*FAC.gf), KN=Math.round(HSE.w*FAC.knee), RF=Math.round(HSE.w*FAC.roof), EAVE=HSE.base-GF-KN;
var SHED={x0:84,x1:164,top:58,base:112};                                              // Batos Schuppen
var LANT={x:116,y:72};                                                                // Sturmlaterne (Mitte des Glases)
var JETTY={x0:44,x1:68,yb:109,yt:86};                                                 // Holzsteg: am Ufer breit, draußen schmal
var QT={x:440,base:113};                                                              // Quittenbaum
var GRAVE={x0:422,x1:452,y0:116,y1:123};                                              // das Beet
var WOOD={x0:404,x1:426,base:112};
var BLOCK={x:206,y:124};                                                              // Hackklotz
var FB={bell:[100,42],anchor:[88,50],ramp:[60,80],hut:[150,190],stumps:[[128,63,4],[134,65,3],[139,66.5,2]]};   // drüben
var FERRY={ here:[58,89,0.85], mid:[66,77,0.52], far:[71,67,0.32] };

// ---------------------------------------------------------------- Himmel und Berge
function paintSky(b,tod,wea){ var w=RW(b,RG.sky), x, y;
  if (wea==='grey'){ M.scn.sky(w,0,0,W,50,tod,'grey',29); return; }
  if (tod==='night'){ var NR=R('k0 k1 k2 n0 n1'), dark=wea==='frost';
    for (y=0;y<50;y++) for (x=0;x<W;x++){ var v=(dark?0.04:0.1)+Math.pow(y/50,1.5)*(dark?0.5:0.6)+(fbm(x,y*2,40,2)-0.5)*0.05; w.px(x,y,ra(NR,v,x,y)); }
    for (y=0;y<46;y++) for (x=0;x<W;x++){ var m=Math.exp(-Math.pow((y-(30-x*0.05))/8,2))*fbm(x*0.6,y*1.2,9,4); if (m>0.25 && bayer(x,y)<(m-0.25)*(dark?0.9:0.6)) w.px(x,y,m>0.5?P.n1:P.n0); }
    var r=M.rng(dark?77:44); for (var s=0;s<(dark?460:340);s++){ var sx=Math.floor(r()*W), sy=Math.floor(Math.pow(r(),1.3)*44), q=r(); w.px(sx,sy,q<0.06?P.n5:(q<0.3?P.n4:(q<0.7?P.n3:P.n2))); }
    return; }
  var DR=R('b0 b1 b2 b3 b4 b5'); for (y=0;y<50;y++) for (x=0;x<W;x++){ var v2=0.14+Math.pow(y/50,1.3)*0.82; w.px(x,y,ra(DR,v2,x,y)); }
  var r2=M.rng(37); for (var i=0;i<6;i++){ var cx=r2()*W, cy=3+r2()*18, L=40+r2()*80; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.05+Math.sin(k*0.08)*1.2); if (bayer(xx,yy)<0.38*(1-Math.abs(k/L-0.5)*2)) w.px(xx,yy,yy<14?P.b3:P.b4); } } }
function ridgeFar(x){ return 20+Math.sin(x*0.012+2)*5+Math.sin(x*0.04)*2; }
function ridgeNear(x){ return 32+Math.sin(x*0.018+0.6)*6+Math.sin(x*0.06+1.7)*2; }
function paintHills(b,tod,wea){ var w=RW(b,RG.hill), x, y;
  for (x=0;x<W;x++){ var rf=rnd(ridgeFar(x)); for (y=rf;y<52;y++){ var v=0.62-(y-rf)/60+(fbm(x,y,14,5)-0.5)*0.12; if (y===rf) v+=0.12; w.px(x,y,ra(wea==='grey'?R('m2 m3 s3 m4'):R('b2 b3 m3 b4'),v,x,y)); } }
  for (x=0;x<W;x++){ var rn=rnd(ridgeNear(x)); for (y=rn;y<56;y++){ var sh=fbm(x*0.4,y*0.8,22,7), v2=0.5+(sh-0.5)*0.5-(y-rn)*0.006+(y===rn?0.22:0), c=ra(R('e1 e2 s2 e3 s3 s4'),v2,x,y);
      var sc=puff(x,y,2.6,2,15); if (sc>0.42 && fbm(x,y,8,17)>0.45) c=sc>0.55?P.g2:P.g1; if (fbm(x*0.6,y*1.2,6,19)>0.72 && hash(x,y)<0.7) c=P.s4; w.px(x,y,c); } }
  if (tod!=='night') M.fogBake(b,function(x,y){ return REG[y*W+x]===RG.hill?(y<ridgeNear(x)?0.5:0.22):0; },{col:wea==='grey'?P.m4:P.b5}); }

// ---------------------------------------------------------------- drüben: das Hochufer mit Hütte, Glocke, Anker, Rampe, Stümpfen; die neue Brücke links
function paintFar(b,tod){ var w=RW(b,RG.far), x, y;
  for (x=0;x<W;x++){ var t0=rnd(farTop(x)), wl=farWL(x); for (y=t0;y<wl;y++){ var u=(y-t0)/(wl-t0), c;
      if (y<t0+2) c=hash(x,y)<0.5?P.e3:P.g3;                                                                           // Grasnarbe oben
      else { var bed=(y-t0)+Math.sin(x*0.09)*1.5, band=Math.floor(bed/2.4), f=fbm(x*0.8,y*0.6,6,8), crack=((x*5+band*3)%17===0)||(hash(Math.floor(x/3),band)<0.1);
        c=ra(R('s0 s1 s2 s3 s4 s5'),0.7-u*0.5+(f-0.5)*0.35+((band%2)?0.06:-0.05),x,y); if (crack) c=P.s1; if ((bed%2.4)<0.6) c=M.DN[c];
        if (f>0.64 && hash(x,y)<0.7) c=hash(x,y)<0.5?P.g1:P.g2; if (u>0.8) c=(hash(x,y)<0.5)?P.g1:P.s1; }
      w.px(x,y,c); } }
  // Gestrüpp auf der Kante
  for (x=0;x<W;x++){ if (fbm(x,2,11,23)<0.42) continue; var ty=rnd(farTop(x)), hh=1+rnd(fbm(x,5,5,24)*5); for (var k=1;k<=hh;k++) w.px(x,ty-k,hash(x,k)<0.5?P.g2:(hash(x,k+3)<0.5?P.g1:P.e2)); }
  // die Rampe drüben: ein heller Einschnitt hinab zum Wasser
  for (y=rnd(farTop(FB.ramp[0]));y<farWL(FB.ramp[0]);y++){ var t=(y-farTop(FB.ramp[0]))/(farWL(FB.ramp[0])-farTop(FB.ramp[0])), xa=rnd(lerp(FB.ramp[0]+6,FB.ramp[0]+1,t)), xb=rnd(lerp(FB.ramp[1]-4,FB.ramp[1],t)); for (x=xa;x<=xb;x++) w.px(x,y,(x===xa)?P.s2:(t>0.8?P.g2:P.s4)); }
  // Anker, Glockenpfosten mit Arm und Glocke, das Widerlager, die Hütte
  var ax=FB.anchor[0], ay=rnd(farTop(ax)); w.rect(ax-2,ay-2,5,2,P.s3); w.px(ax+2,ay-3,P.t2);
  var bx=FB.bell[0], by=rnd(farTop(bx)); w.vl(bx,by-15,by,P.w1); w.px(bx+1,by-15,P.w2); w.hl(bx-6,bx,by-14,P.w2); w.px(bx-4,by-13,P.y1); w.hl(bx-5,bx-3,by-12,P.y3); w.hl(bx-6,bx-2,by-11,P.y2); w.px(bx-5,by-12,P.a4); w.px(bx-4,by-10,P.k2);
  for (x=170;x<200;x++){ var t1=rnd(farTop(x)); w.px(x,t1-1,P.m2); w.px(x,t1,P.s3); }
  var h0=FB.hut[0], h1=FB.hut[1]; for (x=h0;x<h1;x++){ var tt=rnd(farTop(x)), ct=tt-9+(x>h0+24?rnd((x-h0-24)*0.35):0); for (y=ct;y<tt;y++) w.px(x,y,rubble(x*2,y*2,6,4,5)); }
  for (y=0;y<5;y++){ var ins=y; for (x=h0+ins;x<h0+22-ins;x++) w.px(x,rnd(farTop(h0))-10-y,(x+y)%3?P.s2:P.m2); } w.rect(h0+10,rnd(farTop(h0))-6,3,6,P.k1);
  for (var sp=0;sp<3;sp++) w.line(h0+24+sp*5,rnd(farTop(h0))-14,h0+27+sp*5,rnd(farTop(h0))-8,P.w1);
  // Stümpfe drüben im Wasser
  FB.stumps.forEach(function(s,i){ for (y=rnd(s[1]-s[2]*1.6);y<=s[1];y++) for (x=rnd(s[0]-s[2]*0.6);x<=rnd(s[0]+s[2]*0.6);x++) if (!(y<s[1]-s[2]*1.2 && hash(x,i)<0.5)) w.px(x,y,x>s[0]?P.s1:P.s3); });
  // die neue Brücke: von drüben (oben links) herüber zum eigenen Ufer am linken Rand
  var n=140; for (var i=0;i<=n;i++){ var u=i/n, px=rnd(lerp(36,-20,u)), py=lerp(50,94,u), s=0.45+u*0.75, th=Math.max(1.5,4*s), rh=Math.max(1,5*s);
    for (y=Math.floor(py);y<py+th;y++) w.px(px,y,y<py+1?P.s5:(y<py+th-1?P.s3:P.s2)); w.px(px,Math.floor(py-rh),P.m3); if (i%Math.max(3,rnd(8*s))===0) w.vl(px,Math.floor(py-rh),Math.floor(py),P.m2); }
  [0.3,0.62].forEach(function(u){ var px=rnd(lerp(36,-20,u)), py=lerp(50,94,u), s=0.45+u*0.75, yb=py+4*s, wl=yb+8*s; for (y=Math.floor(yb);y<wl;y++) for (x=px-rnd(1.6*s);x<=px+rnd(1.6*s);x++) w.px(x,y,x<px?P.s4:P.s2); });
  LAMPF=[rnd(lerp(36,-20,0.45)),rnd(lerp(50,94,0.45))-rnd(16*(0.45+0.45*0.75))]; w.vl(LAMPF[0],LAMPF[1],rnd(lerp(50,94,0.45)),P.m1); w.rect(LAMPF[0]-1,LAMPF[1]-1,3,2,P.m2); }
var LAMPF=[0,0];

// ---------------------------------------------------------------- Fluss (fließt von links nach rechts)
var WBA=new Float32Array(W*H), WK=new Float32Array(W*H), REFL=new Uint8Array(W*H), WR=null, TODN='day', WEA='calm', FIN=false;
function wcol(x,y,t){ var k=y*W+x, kk=WK[k], v=WBA[k];
  var f=Math.sin((x-t*11*kk)/(11*kk)+y*1.25+Math.sin(x*0.013+y*0.3)*2)*0.55+Math.sin((x-t*17*kk)/(4.5*kk)-y*1.9)*0.3+Math.sin((x-t*6*kk)/(23*kk)+y*0.55)*0.15;
  var c=ra(WR,v+f*0.09,x,y); if (f>0.8 && ((x+(y>>1))%3===0)) c=WEA==='grey'?P.m3:(v>0.55?P.a6:P.a5); if (REFL[k]!==255 && f<0.5) c=REFL[k]; return c; }
function paintRiver(b){ var w=RW(b,RG.water), x, y; REFL.fill(255);
  for (x=0;x<W;x++){ var y0=Math.ceil(farWL(x)), y1=nearWL(x); for (y=y0;y<y1+2;y++){ var d=cl((y-66)/(98-66),0,1), kk=0.35+0.65*d, k=y*W+x; WK[k]=kk; WBA[k]=0.64-d*0.22+(fbm(x*0.25/kk,y*0.9,9,3)-0.5)*0.22; w.px(x,y,P.a3); } }
  // Spiegelung des Hochufers: dunkle Felswand im Wasser
  for (x=0;x<W;x++){ var wl=farWL(x), y1b=Math.ceil(wl); for (y=y1b;y<y1b+6;y++){ var sy=Math.floor(wl-(y-wl)*1.7)-1, src=b.get(x,sy); if (src===T||REG[sy*W+x]!==RG.far) continue; REFL[y*W+x]=M.DN[M.DN[src]]; } } }

// ---------------------------------------------------------------- unser Ufer: Schilf, Weide, Steg, Hof
function groundC(x,y){ var g=hash(x,y), n=fbm(x*0.6,y*1.3,10,4), m=fbm(x*1.2,y*2.4,4,8), v=0.46+(m-0.5)*0.5+(g-0.5)*0.15, c;
  var path=Math.abs(y-(122+Math.sin(x*0.02)*3))<4 && x<300, door=(x>254&&x<292&&y>112&&y<128&&Math.abs(x-273-(y-112)*0.4)<10);
  if (path||door){ c=ra(R('e1 e2 e3 s3'),0.5+(n-0.5)*0.6+(g-0.5)*0.2,x,y); if (hash(x*3,y)<0.04) c=P.s4; return c; }
  if (x>160 && x<250 && y>112 && y<138){ c=ra(R('e1 e2 e3 e2'),v,x,y); if (hash(x*2,y*3)<0.03) c=P.s5; if (hash(x,y*2)<0.02) c=P.w3; return c; }   // festgetretener Hof (Hühner)
  if (n>0.5) c=ra(R('e2 e3 e4 w4'),v+0.04,x,y); else if (n>0.4) c=ra(R('e2 g3 e3 e4'),v,x,y); else c=ra(R('g2 e2 g3 e3'),v,x,y);
  return c; }
function paintGround(b){ var w=RW(b,RG.ground), x, y;
  for (x=0;x<W;x++){ var wl=nearWL(x); for (y=Math.ceil(wl);y<H;y++){ var c=groundC(x,y); if (y<wl+4) c=(hash(x,y)<0.5)?P.e2:P.g2; w.px(x,y,c); } }
  // Grasbüschel
  var r=M.rng(73); for (var i=0;i<300;i++){ var tx=Math.floor(r()*W), ty=104+Math.floor(r()*39); if (tx>160&&tx<300&&ty>112&&ty<138) continue; var hh=2+Math.floor(r()*3), lt=r()<0.6?P.e4:P.w4;
    w.px(tx,ty,P.e1); for (var k=1;k<=hh;k++){ w.px(tx-((k>1&&r()<0.5)?1:0),ty-k,k===hh?lt:P.e3); if (r()<0.5) w.px(tx+1,ty-k,lt); } }
  // Schilf und Weidengebüsch am Wasser (nicht am Steg)
  var vg=RW(b,RG.veg); for (x=0;x<W;x++){ if (x>JETTY.x0-3&&x<JETTY.x1+6) continue; if (x>SHED.x0&&x<SHED.x1) continue; var wl2=rnd(nearWL(x)); if (fbm(x,7,8,31)<0.42) continue;
    var hr=3+rnd(hash(x,4)*7); for (y=wl2-hr;y<wl2+2;y++) vg.px(x,y,y<wl2-hr+2?(hash(x,y)<0.5?P.e4:P.e3):(hash(x,y)<0.5?P.e2:P.g2)); }
  // Weide am Ufer links
  var tx2=24, ty2=104; for (y=ty2-30;y<ty2;y++){ var xx=rnd(tx2+Math.sin(y*0.12)*2); vg.px(xx,y,P.w1); vg.px(xx+1,y,P.w0); vg.px(xx-1,y,P.w2); }
  var rr=M.rng(5); for (var q=0;q<16;q++){ var a=-Math.PI/2+(rr()-0.5)*2.4, L=12+rr()*16, px=tx2, py=ty2-30; for (var s=0;s<L;s++){ px+=Math.cos(a)*0.9; py+=Math.sin(a)*0.9; a+=0.05; vg.px(rnd(px),rnd(py),s<4?P.w1:P.w2); }
    for (var d=0;d<10+rr()*12;d++) vg.px(rnd(px)+(d%2),rnd(py)+d,d<6?P.e2:P.e3); } }
function paintJetty(b){ var w=RW(b,RG.wood), y, x, xa, xb;
  function edges(y){ var t=(y-JETTY.yt)/(JETTY.yb-JETTY.yt); return [lerp(JETTY.x0+3,JETTY.x0,t),lerp(JETTY.x1-3,JETTY.x1,t),t]; }
  // Pfähle im Wasser (unter dem Steg), dann die Bohlen quer, mit Fugen
  for (var pi=0;pi<4;pi++){ var py=JETTY.yt+1+pi*4, e=edges(py), s=0.5+e[2]*0.5, ph=rnd(5*s); [e[0]+1,e[1]-1].forEach(function(px){ for (var yy=py;yy<py+ph;yy++){ w.px(rnd(px),yy,P.w0); } }); }
  for (y=JETTY.yt;y<=JETTY.yb;y++){ var e2=edges(y), t=e2[2], plank=Math.floor((y-JETTY.yt)/(1.5+t*2.5)); xa=Math.round(e2[0]); xb=Math.round(e2[1]);
    for (x=xa;x<=xb;x++){ var c=(((y-JETTY.yt)%Math.max(2,rnd(1.5+t*2.5)))===0)?P.w2:(hash(plank,3)<0.5?P.w3:P.w4); if (hash(x,plank)<0.05) c=P.w2; if (Math.abs(x-(xa+xb)/2)<0.6 && hash(plank,9)<0.5) c=P.w2; if (x===xa) c=P.w4; if (x===xb) c=P.w1; w.px(x,y,c); }
    if (y===JETTY.yt){ for (x=xa;x<=xb;x++) w.px(x,y-1,P.w5); }
    if (y>=nearWL(xb)-1){ for (x=xb+1;x<xb+3;x++) w.px(x,y,P.e1); } }
  // dunkle Spiegelung der Bohlen im Wasser daneben
  for (y=JETTY.yt;y<nearWL(56);y++){ var e3=edges(y); [rnd(e3[0])-1,rnd(e3[1])+1].forEach(function(xx,si){ var k=y*W+xx; if (REG[k]===RG.water){ REFL[k]=si?P.a1:P.a2; } }); }
  // Poller am Ende, ein Ring, ein altes Tau
  var ee=edges(JETTY.yt+1); w.rect(rnd(ee[0]),JETTY.yt-3,2,4,P.w1); w.rect(rnd(ee[1])-1,JETTY.yt-3,2,4,P.w0); w.px(rnd(ee[1])-1,JETTY.yt-4,P.w2);
  for (var k=0;k<7;k++) w.px(rnd(ee[1])+k-3,JETTY.yt+2+rnd(Math.sin(k*0.7)*1.2),k%2?P.e3:P.e4); }
// ---------------------------------------------------------------- Batos Schuppen: Holz, offen, Laterne, Ruder, Netz, Wathose
function paintShed(b){ var w=RW(b,RG.wood), x, y, x0=SHED.x0, x1=SHED.x1, top=SHED.top, base=SHED.base;
  // Rückwand aus senkrechten Brettern mit Spalten, dahinter Licht vom Fluss
  for (y=top+6;y<base;y++) for (x=x0+2;x<x1-2;x++){ var bd=Math.floor((x-x0)/5), c=(((x-x0)%5)===0)?P.k1:(hash(bd,2)<0.5?P.w1:P.w0); if (((x-x0)%5)===0 && hash(bd,y>>2)<0.3) c=P.s2; if (y>base-3) c=P.k1; w.px(x,y,c); }
  // Pfosten, Pfette, Pultdach aus Brettern und rostigem Wellblech
  [x0,x0+26,x0+52,x1-2].forEach(function(px){ for (y=top+3;y<base;y++){ w.px(px,y,P.w2); w.px(px+1,y,P.w1); w.px(px+2,y,P.w0); } });
  for (x=x0-4;x<x1+4;x++){ var ry=top+rnd((x-x0)*0.05); for (var k=0;k<4;k++){ var c2=k===0?P.t2:(k===3?P.k1:(((x>>1)%2)?P.t1:P.m1)); if (x>x0+30 && x<x0+56) c2=k===0?P.w3:(k===3?P.k1:P.w1); w.px(x,ry+k,c2); } if (hash(x,5)<0.2) w.px(x,ry,P.t3); }
  for (x=x0;x<x1;x++) w.px(x,top+5,P.w0);
  // Netz an der Rückwand (Rautenmaschen, eine Korkleine)
  for (y=top+10;y<top+28;y++) for (x=x0+30;x<x0+50;x++){ var u=x-x0-30, v=y-top-10, sag=rnd(Math.sin(u/20*Math.PI)*3); if (((u+v+sag)%4===0)||((u-v-sag+40)%4===0)) w.px(x,y+sag,P.e3); }
  for (x=x0+30;x<x0+50;x+=3) w.px(x,top+10,P.w4);
  // zwei Ruder, angelehnt
  w.line(x0+8,base-1,x0+13,top+12,P.w4); w.line(x0+9,base-1,x0+14,top+12,P.w2); w.poly([[x0+6,base-1],[x0+10,base-1],[x0+11,base-12],[x0+8,base-12]],P.w3);
  w.line(x0+17,base-1,x0+19,top+10,P.w3); w.poly([[x0+15,base-1],[x0+19,base-1],[x0+20,base-11],[x0+17,base-11]],P.w2);
  // Wathose am Haken: dunkles Oliv, Träger, Stiefel
  var wx=x1-14; w.px(wx+3,top+9,P.m3); w.vl(wx+3,top+10,top+11,P.m2);
  for (y=top+12;y<top+38;y++){ var hw2=y<top+16?4:3; for (x=wx-hw2+3;x<=wx+hw2+3;x++){ if (y>top+24 && Math.abs(x-wx-3)<1) continue; w.px(x,y,(x<wx+3)?P.g1:P.g0); } }
  w.line(wx,top+12,wx+3,top+10,P.k1); w.line(wx+6,top+12,wx+3,top+10,P.k1); w.rect(wx-1,top+38,4,3,P.k1); w.rect(wx+4,top+38,4,3,P.k1);
  // Eimer, Taurolle, ein Bootshaken, eine Bank
  w.rect(x0+60,base-7,7,6,P.m2); w.hl(x0+60,x0+66,base-7,P.m3); w.hl(x0+59,x0+67,base-8,P.m1);
  w.ellipse(x0+40,base-3,6,2.5,function(xx,yy){ return ((xx+yy)%2)?P.e3:P.e2; }); w.ellipse(x0+40,base-3,2.5,1,P.k1);
  w.line(x0+70,base-1,x0+74,top+8,P.w1); w.px(x0+74,top+7,P.m2); w.px(x0+75,top+8,P.m2);
  w.rect(x0+46,base-11,24,2,P.w3); w.vl(x0+48,base-9,base-1,P.w1); w.vl(x0+67,base-9,base-1,P.w1);
  // Haken und Laterne (das Glas leuchtet nur bei S.lantern, siehe dynamic)
  w.vl(LANT.x,top+6,LANT.y-6,P.m1); lanternBody(w,LANT.x,LANT.y,false); }
function lanternBody(w,x,y,lit){ // Sturmlaterne: Bügel, Haube, Glaskugel, Tank
  w.px(x-1,y-6,P.m1); w.px(x+1,y-6,P.m1); w.px(x,y-7,P.m1); w.hl(x-2,x+2,y-5,P.m2); w.hl(x-3,x+3,y-4,P.m1);
  for (var j=-3;j<=2;j++){ var hw=j<-2||j>1?2:3; for (var i=-hw;i<=hw;i++) w.px(x+i,y+j,lit?(Math.abs(i)<2&&Math.abs(j+0.5)<2?P.l0:P.y4):(i===-hw||i===hw?P.m1:(i<0?P.m3:P.k2))); }
  w.vl(x-3,y-3,y+2,P.m1); w.vl(x+3,y-3,y+2,P.m1); w.hl(x-3,x+3,y+3,P.t1); w.hl(x-3,x+3,y+4,P.t0); }

// ---------------------------------------------------------------- Zlatas Haus
function plaster(x,y){ var n=fbm(x,y,14,3), v=0.68+(n-0.5)*0.22+(hash(x,y)-0.5)*0.06; if (y>HSE.base-14) v-=(y-(HSE.base-14))/14*0.22;
  if (fbm(x*0.8,y*1.1,9,5)>0.74) return rubble(x,y,6,4,3);                                                                  // abgefallener Putz
  return ra(R('s3 s4 s5 s6'),v,x,y); }
function paintHouse(b){ var wa=RW(b,RG.wall), rf=RW(b,RG.roof), wd=RW(b,RG.wood), gl=RW(b,RG.glass), x, y, x0=HSE.x0, x1=HSE.x0+HSE.w, base=HSE.base;
  for (y=EAVE;y<base;y++) for (x=x0;x<x1;x++){ var c=plaster(x,y); if (y>=base-6) c=rubble(x,y,6,3,7); if (x===x0) c=M.UP[c]; if (x>x1-3) c=M.DN[c]; wa.px(x,y,c); }
  wa.hl(x0,x1-1,base-GF,P.s3); wa.hl(x0,x1-1,base-GF+1,P.s5);                                                                   // Geschosskante
  for (x=x0;x<x1;x++) for (y=EAVE;y<EAVE+5;y++) if (bayer(x,y)<0.7-(y-EAVE)*0.12) wa.px(x,y,M.DN[b.get(x,y)]);                   // Schatten unter der Traufe
  // Sparrenköpfe unter der Traufe
  for (x=x0-4;x<x1+4;x+=9){ wd.rect(x,EAVE-2,3,3,P.w1); wd.px(x,EAVE+1,P.w0); }
  // Steinplattendach: dicke Reihen, unregelmäßige Kanten, Moos und Flechten, Überstand
  for (y=EAVE-RF;y<EAVE;y++){ var k=EAVE-y, ins=rnd((RF-k)*0.0), xa=x0-6+rnd(k*0.25), xb=x1+6-rnd(k*0.25), row=Math.floor(k/4), fy=k%4;
    for (x=xa;x<xb;x++){ var off=row*5+Math.floor(hash(row,3)*6), sl=Math.floor((x+off)/11), c2=hash(sl,row)<0.4?P.s2:(hash(sl,row+7)<0.5?P.m2:P.s3);
      if (fy===0) c2=P.k2; else if (fy===1) c2=M.DN[c2]; else if (fy===3) c2=M.UP[c2]; if ((x+off)%11===0) c2=P.s1; if (((x+off)%11===1) && fy>0) c2=M.UP[c2];
      if (fbm(x,y,6,9)>0.66) c2=(hash(x,y)<0.5)?P.g2:(hash(x,y)<0.7?P.g3:P.y1); if (x===xa||x===xb-1) c2=P.s1; rf.px(x,y,c2); } }
  for (x=x0-6;x<x1+6;x++){ rf.px(x,EAVE,P.k1); rf.px(x,EAVE-RF,P.s4); rf.px(x,EAVE-RF-1,P.s2); }                                  // Traufe, First
  // Schornstein aus Stein mit Deckplatte
  var chx=x0+Math.round(FAC.chim*HSE.w); for (y=EAVE-RF-10;y<EAVE-RF+6;y++) for (x=chx;x<chx+9;x++) wa.px(x,y,rubble(x*1.5,y*1.5,5,3,11)); wa.rect(chx-2,EAVE-RF-12,13,2,P.s4); wa.hl(chx-2,chx+10,EAVE-RF-12,P.s5); wa.rect(chx+2,EAVE-RF-10,5,1,P.k1);
  CHIM=[chx+4,EAVE-RF-13];
  // Fenster: Holzrahmen, Glas mit Spiegelung, Vorhänge; Fensterbrett
  winFrame(wa,gl,wd,'kitchen'); winFrame(wa,gl,wd,'stube'); winFrame(wa,gl,wd,'roofw');
  // ein Blumentopf auf dem Küchenfensterbrett, verblüht
  var kr=facRect('kitchen'); wd.rect(kr[0]+4,kr[1]+kr[3]+1,6,4,P.t2); wd.hl(kr[0]+3,kr[0]+10,kr[1]+kr[3]+1,P.t3); for (var q=0;q<6;q++) wd.px(kr[0]+5+q,kr[1]+kr[3]-1-rnd(hash(q,3)*3),q%2?P.e2:P.g2);
  // ein Zopf roter Paprika und ein Zwiebelzopf hängen an der Wand
  var pz=facRect('kitchen'), px0=pz[0]+pz[2]+8; wd.px(px0,pz[1]-2,P.m2); for (var q2=0;q2<16;q2++){ var py=pz[1]+q2, ox=rnd(Math.sin(q2*0.9)*1.2); wd.px(px0+ox,py,P.e3); if (q2%2===0){ wd.px(px0+ox-1,py,P.r2); wd.px(px0+ox-2,py+1,P.r3); wd.px(px0+ox+1,py+1,P.r2); wd.px(px0+ox+2,py,P.r3); wd.px(px0+ox-1,py+1,P.r1); } }
  wd.px(px0+5,pz[1]-1,P.m2); for (var q3=0;q3<10;q3++){ var py2=pz[1]+1+q3; if (q3%2===0){ wd.px(px0+5,py2,P.t4); wd.px(px0+4,py2+1,P.y2); wd.px(px0+6,py2+1,P.t4); } else wd.px(px0+5,py2,P.e3); }
  // Haustür: Bretter, Beschläge, Klinke, Schwelle, kleines Vordach
  var dr=facRect('door'); for (y=dr[1];y<base;y++) for (x=dr[0];x<dr[0]+dr[2];x++){ var u=x-dr[0], c3=(u%5===0)?P.w0:((hash(Math.floor(u/5),3)<0.5)?P.w2:P.w1); if (hash(x,y>>1)<0.06) c3=P.w3; wd.px(x,y,c3); }
  [dr[1]+6,base-10].forEach(function(hy){ wd.hl(dr[0]+1,dr[0]+dr[2]-2,hy,P.k1); wd.hl(dr[0]+1,dr[0]+dr[2]-2,hy+1,P.m1); });
  wd.rect(dr[0]+dr[2]-5,dr[1]+24,2,4,P.m3); wd.px(dr[0]+dr[2]-5,dr[1]+24,P.m4); wd.px(dr[0]+dr[2]-4,dr[1]+29,P.k1);
  for (y=dr[1]-2;y<base;y++){ wa.px(dr[0]-1,y,P.s2); wa.px(dr[0]+dr[2],y,P.s2); } wa.rect(dr[0]-3,base-2,dr[2]+6,2,P.s4); wa.hl(dr[0]-3,dr[0]+dr[2]+2,base-2,P.s5);
  for (y=dr[1]-6;y<dr[1]-2;y++) for (x=dr[0]-5;x<dr[0]+dr[2]+5;x++){ var tt=(dr[1]-2-y)/4; if (Math.abs(x-dr[0]-dr[2]/2)>(dr[2]/2+5)*(1-tt*0.2)) continue; rf.px(x,y,y===dr[1]-6?P.s4:((x%4)?P.s2:P.s1)); }
  // Bank neben der Tür, ein Besen
  wd.rect(dr[0]+dr[2]+4,base-12,20,2,P.w3); wd.vl(dr[0]+dr[2]+6,base-10,base-1,P.w1); wd.vl(dr[0]+dr[2]+21,base-10,base-1,P.w1);
  wd.line(dr[0]-6,base-1,dr[0]-3,base-30,P.w3); for (var bq=0;bq<6;bq++) wd.line(dr[0]-7+bq,base-1,dr[0]-5+bq*0.6,base-8,P.e3);
  // Holzstapel unter einem Brettdach an der rechten Wand
  for (y=WOOD.base-24;y<WOOD.base;y++) for (x=WOOD.x0;x<WOOD.x1;x++){ var lg=Math.floor((y-WOOD.base+24)/4), lx=(x+lg*3)%7; var c4=(lx===0)?P.w0:(Math.hypot(lx-3.5,((y-WOOD.base+24)%4)-1.5)<1.3?P.w4:P.w2); if (lx===1&&((y%4)===1)) c4=P.e4; wd.px(x,y,c4); }
  for (x=WOOD.x0-3;x<WOOD.x1+3;x++){ rf.px(x,WOOD.base-26,P.w1); rf.px(x,WOOD.base-25,P.w0); } }
var CHIM=[0,0];
function winFrame(wa,gl,wd,id){ var r=facRect(id), x0=r[0], y0=r[1], w=r[2], h=r[3], x, y, big=id!=='roofw';
  // Laibung (Schatten), Rahmen aus Holz, weiß gestrichen und abgeblättert
  for (y=y0-2;y<y0+h+2;y++) for (x=x0-2;x<x0+w+2;x++) wa.px(x,y,(x<x0||y<y0)?P.s2:P.s4);
  for (y=y0;y<y0+h;y++) for (x=x0;x<x0+w;x++){ var u=x-x0, v=y-y0, c=(v<2)?P.k1:(((u+v*2)%7===0&&v<h*0.5)?P.n1:P.k2); if (u+v>w*0.9 && u+v<w*0.9+2) c=P.n1; gl.px(x,y,c); }
  // Vorhänge: Spitze unten (Küche), ein heller Vorhang seitlich (Stube)
  if (id==='kitchen') for (y=y0+Math.round(h*0.45);y<y0+h;y++) for (x=x0;x<x0+w;x++){ var uu=x-x0, vv=y-y0; if (((uu+vv)%3===0)||((uu-vv+60)%3===0)||vv===Math.round(h*0.45)) gl.px(x,y,P.s5); else if (bayer(x,y)<0.3) gl.px(x,y,P.s4); }
  if (id==='stube') for (y=y0;y<y0+h;y++) for (x=x0;x<x0+4;x++) gl.px(x,y,((x+y)%2)?P.s4:P.s3);
  // Sprossen und Rahmen
  var fr=P.s5; for (x=x0-1;x<=x0+w;x++){ wd.px(x,y0-1,fr); wd.px(x,y0+h,P.s4); } for (y=y0-1;y<=y0+h;y++){ wd.px(x0-1,y,fr); wd.px(x0+w,y,P.s3); }
  if (id==='kitchen'){ var m1=x0+Math.round(w/3), m2=x0+Math.round(w*2/3); for (y=y0;y<y0+h;y++){ wd.px(m1,y,fr); wd.px(m2,y,fr); } for (x=x0;x<x0+w;x++) wd.px(x,y0+Math.round(h*0.4),fr); }
  else if (id==='stube'){ for (y=y0;y<y0+h;y++) wd.px(x0+Math.round(w/2),y,fr); for (x=x0;x<x0+w;x++){ wd.px(x,y0+Math.round(h/3),fr); wd.px(x,y0+Math.round(h*2/3),fr); } }
  else { for (y=y0;y<y0+h;y++) wd.px(x0+Math.round(w/2),y,fr); for (x=x0;x<x0+w;x++) wd.px(x,y0+Math.round(h/2),fr); }
  for (x=x0-3;x<=x0+w+2;x++){ wa.px(x,y0+h+1,P.s5); if (big) wa.px(x,y0+h+2,P.s2); }
  // abgeblätterte Farbe
  for (var q=0;q<w;q+=3) if (hash(q,x0)<0.4) wd.px(x0+q,y0-1,P.w2); }

// ---------------------------------------------------------------- Quittenbaum und Grab
function paintQuince(b){ var w=RW(b,RG.wood), x=QT.x, base=QT.base, y, r=M.rng(17);
  for (y=base-36;y<base;y++){ var xx=rnd(x+Math.sin(y*0.18)*2), tw=y>base-6?2:1; for (var i=-tw;i<=tw;i++) w.px(xx+i,y,i<0?P.w2:(i>0?P.w0:P.w1)); if (hash(y,3)<0.15) w.px(xx,y,P.w3); }
  function br(x0,y0,a,len,d){ var px=x0, py=y0; for (var s=0;s<len;s++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.35; w.px(rnd(px),rnd(py),d<2?P.w1:P.w2); if (d<1) w.px(rnd(px)+1,rnd(py),P.w0); }
    if (d<3){ var n=d<1?3:2; for (var k=0;k<n;k++) br(px,py,a+(r()-0.5)*1.6,len*(0.55+r()*0.2),d+1); } else if (r()<0.35){ w.px(rnd(px),rnd(py),r()<0.5?P.y3:P.e4); } }
  br(x,base-36,-Math.PI/2-0.6,16,0); br(x,base-36,-Math.PI/2+0.5,15,0); br(x,base-26,-Math.PI/2-1.25,12,1); br(x,base-22,-0.35,11,1); br(x,base-30,-Math.PI/2-0.1,13,1);
  QFRUIT=[x+15,base-50]; }
var QFRUIT=[0,0];
function paintGrave(b){ var g=RW(b,RG.grave), x, y, G=GRAVE;
  // Einfassung aus Feldsteinen, Erde, Chrysanthemen in Büscheln (gelb, weiß, rostrot)
  for (y=G.y0;y<=G.y1;y++) for (x=G.x0;x<=G.x1;x++){ var edge=(y===G.y0||y===G.y1||x===G.x0||x===G.x1), c=edge?((hash(x>>1,y)<0.5)?P.s3:P.s4):((hash(x,y)<0.5)?P.e1:P.w1); if (edge && y===G.y1) c=P.s2; g.px(x,y,c); }
  var C=[[P.y3,P.y4],[P.s5,P.s6],[P.t3,P.t4],[P.y3,P.y4],[P.s5,P.s6]];
  for (var i=0;i<9;i++){ var cx=G.x0+4+i*3+rnd(hash(i,1)*2), cy=G.y0+1+rnd(hash(i,2)*3), cc=C[i%5]; for (var q=0;q<7;q++){ var px=cx+rnd((hash(i,q)-0.5)*3), py=cy-rnd(hash(q,i)*3); g.px(px,py,q%3?cc[0]:cc[1]); } g.px(cx,cy+1,P.g2); g.px(cx+1,cy+2,P.g1); }
  // flacher Stein am Kopfende
  for (y=G.y0-4;y<G.y0+1;y++) for (x=G.x0-6;x<G.x0;x++){ var c2=(y===G.y0-4)?P.s5:((x===G.x0-6)?P.s4:(hash(x,y)<0.6?P.s3:P.s4)); if (y===G.y0) c2=P.s2; g.px(x,y,c2); }
  // das Brett, verwittert, die Schrift nur angedeutet
  var bx=G.x1+2, by=G.y1; for (y=by-16;y<by;y++) for (x=bx;x<bx+7;x++){ var c3=(x===bx)?P.s2:(x===bx+6?P.w0:(hash(x,y>>1)<0.5?P.s2:P.e3)); if (y===by-16) c3=P.e4; g.px(x,y,c3); }
  [by-13,by-10,by-7].forEach(function(ly,i){ for (x=bx+1;x<bx+6;x++) if (hash(x,ly)<0.7) g.px(x,ly,P.w1); }); g.vl(bx+3,by,by+2,P.w0); }

// ---------------------------------------------------------------- Hof: Hackklotz, Zaun, Brunnen der Hühner, Pfad
function paintYard(b){ var w=RW(b,RG.wood), x, y;
  // Hackklotz mit Beil, Späne
  var bx=BLOCK.x, by=BLOCK.y; w.ellipse(bx+0.5,by-8,6,2,function(xx,yy){ return (Math.hypot(xx-bx,(yy-by+8)*2.5)<3)?P.w4:P.w3; }); w.rect(bx-6,by-8,13,8,P.w2); w.vl(bx-6,by-8,by-1,P.w3); w.vl(bx+6,by-8,by-1,P.w1); w.hl(bx-6,bx+6,by-1,P.w0);
  w.line(bx+1,by-9,bx+7,by-18,P.w4); w.rect(bx-1,by-10,4,2,P.m3); w.px(bx-1,by-10,P.m4);
  for (var i=0;i<12;i++) w.px(bx-10+rnd(hash(i,1)*22),by+rnd(hash(i,2)*4),hash(i,3)<0.5?P.w4:P.e4);
  // Zaun aus Latten zwischen Schuppen und Haus, hinten am Ufer
  for (x=162;x<248;x++){ var fy=102+rnd(Math.sin(x*0.04)*1); if ((x-162)%6===0){ w.vl(x,fy-12,fy,P.w1); w.px(x,fy-13,P.w2); } if (hash(x,1)<0.92){ w.px(x,fy-9,P.w2); w.px(x,fy-4,P.w2); } }
  // Wäscheleine mit einem Tuch
  for (x=170;x<240;x++){ var ly=78+rnd(Math.sin((x-170)/70*Math.PI)*3); w.px(x,ly,P.s1); } w.vl(169,76,102,P.w1); w.vl(240,76,102,P.w1);
  w.rect(192,81,6,7,P.s5); w.vl(192,81,87,P.s4); w.hl(192,197,81,P.s6); w.rect(206,82,5,8,P.b2); w.vl(206,82,89,P.b1); w.rect(220,81,6,5,P.r2); w.hl(220,225,81,P.r3);
  // ein Brunnen? nein: ein Wasserfass unter der Dachrinne
  var fx=HSE.x0-14; for (y=96;y<112;y++) for (x=fx;x<fx+10;x++){ var u=(x-fx)/10, c=u<0.2?P.w1:(u<0.6?P.w3:P.w2); if ((y-96)%5===0) c=P.m1; w.px(x,y,c); } w.ellipse(fx+5,96,5,1.4,P.k2); }

// ---------------------------------------------------------------- Licht, Raureif
function lightFn(tod,wea){ var day=tod==='day', grey=wea==='grey';
  return function(x,y){ var r=REG[y*W+x], v=0; if (r===RG.sky) return 0;
    if (r===RG.wall){ v+=day&&!grey?0.15:0; if (x<HSE.x0+3) v+=0.1; }
    if (r===RG.ground){ v+=(y-112)/32*0.12; if (x>SHED.x0-4&&x<SHED.x1+6&&y<118) v-=0.35; if (x>HSE.x0-4&&x<HSE.x0+HSE.w+6&&y<117) v-=0.3; }
    if (r===RG.wood && x>SHED.x0 && x<SHED.x1 && y>SHED.top+5) v-=0.35;                                                           // im Schuppen dunkel
    if (grey) v-=0.15;
    var cx=(x-240)/300, cy=(y-80)/110; v-=Math.max(0,cx*cx+cy*cy-0.3)*0.5; return v; }; }
function frostBake(b){ for (var y=1;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, r=REG[k]; if (r!==RG.ground&&r!==RG.wood&&r!==RG.veg&&r!==RG.roof&&r!==RG.grave) continue;
    if (REG[k-W]!==r && hash(x,y)<0.55){ b.d[k]=hash(x+1,y)<0.5?P.s4:P.s5; continue; } if (r===RG.ground && hash(x*1.3,y*2.1)<0.03) b.d[k]=P.s4; } }

function frostLight(b){ for (var y=1;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, r=REG[k]; if (r!==RG.ground&&r!==RG.veg&&r!==RG.wood) continue; if (REG[k-W]!==r && hash(x,y)<0.25) b.d[k]=hash(x+1,y)<0.5?P.s4:P.s5; } }
// ---------------------------------------------------------------- Bild
var LAST=null, NIGHT=false;
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0); REG.fill(0);
  if (tod!=='night' && tod!=='day') tod=tod==='dusk'||tod==='dawn'?tod:'day';
  NIGHT=tod==='night'; TODN=tod; WEA=wea; FIN=wea==='frost'; WR=wea==='grey'?R('a1 a2 m1 a3 m2 a4 m3'):R('a1 a2 g2 a3 g3 a4 a5');
  paintSky(b,tod,wea); paintHills(b,tod,wea); paintFar(b,tod); paintRiver(b);
  for (var k=0;k<W*H;k++) if (REG[k]===RG.water){ b.d[k]=wcol(k%W,(k/W)|0,0); }
  paintGround(b); paintJetty(b); paintShed(b); paintYard(b); paintHouse(b); paintQuince(b); paintGrave(b);
  if (FIN) frostBake(b); else if (GS && GS.phase==='k3_d3') frostLight(b);
  M.light(b,lightFn(tod,wea),0,0);
  if (wea==='grey') M.fogBake(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; if (r===RG.hill) return 0.35; if (r===RG.far) return 0.3; if (r===RG.water) return 0.12; return 0.03; },{col:P.m4});
  if (FIN) M.light(b,function(x,y){ var r=REG[y*W+x]; return r===RG.sky?0:(r===RG.hill||r===RG.far?-1.5:(r===RG.wall?-0.8:-1.05)); },0,0);
  var base=b.clone(), lights=[]; if (tod!=='day'){ lights.push([LAMPF[0],LAMPF[1]+4,9,7,0.7]); if (S.lantern){ lights.push([LANT.x,LANT.y+6,34,26,0.95]); lights.push([LANT.x-6,118,40,9,0.6]); } if (S.zlataLamp){ var zp=ZPOS; lights.push([zp[0]-6,zp[1]-24,44,30,0.95]); lights.push([zp[0]-6,zp[1]+2,46,10,0.7]); } }
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; }, after:function(o,tod){ if (tod==='day') return; warmPass(o,base,lights); o.rect(LAMPF[0]-1,LAMPF[1]-1,3,2,P.y5); } });
  return LAST; }
// warme Lichtinseln in Stufen (wie in Vratnik): weich auslaufend statt grob gerastert
var DIMW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+r*0.12+12, L*0.38+g*0.08+8, L*0.26+b*0.1+16]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.45+L*0.36+16, g*0.32+L*0.26+6, b*0.16+L*0.08+4]; });
function warmPass(o,base,L){ if (!L.length) return; var LT=M.TINT.lamp;
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x; if (REG[k]===RG.sky) continue; var v=0;
    for (var i=0;i<L.length;i++){ var l=L[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], f=1-dx*dx-dy*dy; if (f>0){ var q=l[4]*Math.pow(f,1.15); if (q>v) v=q; } }
    if (v<0.03) continue; var f2=v*3.3, lv=Math.floor(f2), fr=f2-lv, t=lv===0?fr:(fr-0.5)*1.7+0.5; if (t>bayer(x,y)) lv++; if (lv<=0) continue;
    var c=base.d[k]; o.d[k]=lv===1?M.tintPx(DIMW,c,x,y):(lv===2?M.tintPx(MIDW,c,x,y):(lv===3?M.tintPx(LT,c,x,y):M.UP[M.tintPx(LT,c,x,y)])); } }
var ZPOS=[272,118];

// ---------------------------------------------------------------- jedes Bild: Wasser, Hühner, Rauch, Laterne, Fenster, Quitte, Fähre
function tintC(c,x,y){ return (TODN!=='day'&&M.TINT[TODN])?M.tintPx(M.TINT[TODN],c,x,y):c; }
function litOf(S,GS){ return S.lit||(GS&&GS.flags&&GS.flags['k3.lit'])||null; }
var HENS=[[186,128,0],[202,134,1],[224,126,2],[238,132,3],[176,136,4]];
function dynamic(fb,v,S,GS){ var t=v.t, cam=v.cam, fw=fb.w, x, y;
  for (y=64;y<102;y++){ var row=y*fw; for (var sx=0;sx<fw;sx++){ x=sx+cam; var k=y*W+x; if (REG[k]!==RG.water) continue; var c=wcol(x,y,t); if (FIN) c=M.DN[c]; if (WEA==='grey') c=M.mix(c,P.s4,2); fb.d[row+sx]=tintC(c,x,y); } }
  if (TODN==='night'){ var lx=LAMPF[0]-cam; if (lx>-4&&lx<fw+4){ M.glow(fb,lx,LAMPF[1],5,t,0.5); for (y=LAMPF[1]+10;y<LAMPF[1]+30;y++){ var xx=lx+Math.round(Math.sin(y*0.9+t*2.4)*1.2); if (xx<0||xx>=fw||y>=H||REG[y*W+xx+cam]!==RG.water) continue; if (Math.sin(y*1.7+t*3.3)>0.15) fb.d[y*fw+xx]=P.y2; } } }
  // Hühner picken (bei Tag)
  if (TODN==='day') HENS.forEach(function(h,i){ var hx=h[0]+rnd(Math.sin(t*0.4+i*2)*6)-cam, hy=h[1], peck=(Math.floor(t*2+i*0.7)%3)===0, f=(Math.cos(t*0.4+i*2)>0)?1:-1, white=i%2===0;
    if (hx<-8||hx>fw+8) return; var B=white?P.s5:P.t3, L=white?P.s6:P.t4, D=white?P.s3:P.t1;
    var body=[[-3,-4,D],[-2,-5,B],[-1,-5,L],[0,-5,L],[1,-5,B],[-3,-3,D],[-2,-4,B],[-1,-4,L],[0,-4,B],[1,-4,B],[2,-4,B],[-2,-3,D],[-1,-3,B],[0,-3,B],[1,-3,B],[2,-3,D],[-1,-2,D],[0,-2,D],[1,-2,D],[-4,-5,D],[-4,-6,B]];
    body.forEach(function(q){ fb.px(hx+q[0]*f,hy+q[1],q[2]); });
    var hd=peck?[[3,-2],[3,-1]]:[[3,-6],[3,-5],[2,-6]]; hd.forEach(function(q){ fb.px(hx+q[0]*f,hy+q[1],B); }); var top=peck?hy-3:hy-7; fb.px(hx+3*f,top,P.r3); fb.px(hx+4*f,top+1+(peck?1:0),P.y3);
    fb.px(hx-1,hy-1,P.y2); fb.px(hx+1,hy-1,P.y2); fb.px(hx-1,hy,P.y1); fb.px(hx+1,hy,P.y1); });
  // Rauch aus dem Schornstein (bei Tag)
  if (TODN==='day') for (var p=0;p<9;p++){ var ph=((t*0.1+p/9)%1), px=rnd(CHIM[0]+ph*16+Math.sin(t*0.6+p)*2*ph)-cam, py=rnd(CHIM[1]-ph*22); if (px<0||px>=fw||py<0) continue; var r0=REG[py*W+px+cam]; if (r0!==RG.sky&&r0!==RG.hill) continue; if (bayer(px,py)<0.9-ph*0.7){ fb.px(px,py,ph<0.4?P.s5:P.s4); if (ph<0.5) fb.px(px+1,py,P.s4); } }
  // die letzte Quitte schaukelt
  var qx=QFRUIT[0]+rnd(Math.sin(t*1.3)*0.6)-cam, qy=QFRUIT[1]; if (qx>-3&&qx<fw+3){ var Q=[[0,0,P.y4],[1,0,P.y3],[0,1,P.y3],[1,1,P.y2],[-1,1,P.y3],[0,2,P.y2],[0,-1,P.w1]]; Q.forEach(function(q){ var X=qx+q[0], Y=qy+q[1]; if (X>=0&&X<fw) fb.d[Y*fw+X]=tintC(q[2],X+cam,Y); }); }
  windowLight(fb,v,S,GS); lantern(fb,v,S,GS); zlataLamp(fb,v,S,GS); }
function windowLight(fb,v,S,GS){ var lit=litOf(S,GS);
  if (!lit && TODN==='night'){ var kr=facRect('kitchen'), gl=0.5+Math.sin(v.t*1.7)*0.05; for (var ky=kr[1];ky<kr[1]+kr[3];ky++) for (var kx=kr[0];kx<kr[0]+kr[2];kx++){ var sx0=kx-v.cam; if (sx0<0||sx0>=fb.w) continue; if (REG[ky*W+kx]!==RG.glass) continue; var cc=fb.d[ky*fb.w+sx0]; if (bayer(kx,ky)<gl) fb.d[ky*fb.w+sx0]=(cc===P.s5||cc===P.s4||cc===P.s3)?P.y2:P.y1; } }
  if (!(lit==='kitchen'||lit==='stube'||lit==='roof')) return; var r=facRect(lit==='roof'?'roofw':lit), cam=v.cam, fw=fb.w, t=v.t, day=TODN==='day';
  // Markos Handylicht: ein kalter, heller Punkt hinter dem Glas, um ihn ein Schein; nachts fällt Licht nach draußen
  var cx=r[0]+r[2]*0.5, cy=r[1]+r[3]*0.45;
  for (var y=r[1]-6;y<r[1]+r[3]+(day?3:16);y++) for (var x=r[0]-6;x<r[0]+r[2]+6;x++){ var sx=x-cam; if (sx<0||sx>=fw||y<0||y>=H) continue; var k=y*fw+sx, inside=x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3];
    var d=Math.hypot((x-cx)/(r[2]*0.5+2),(y-cy)/(r[3]*0.5+2));
    if (inside){ if (REG[y*W+x]!==RG.glass) continue; var core=Math.hypot(x-cx,(y-cy)*1.2)<2.2; fb.d[k]=core?P.l1:(d<0.6?P.s6:(bayer(x,y)<0.6?P.b5:P.b4)); }
    else if (!day){ var dd=Math.max(Math.max(r[0]-x,x-r[0]-r[2]+1,0)/4,Math.max(r[1]-y,y-r[1]-r[3]+1,0)/(y>r[1]?10:4)); if (dd<1 && bayer(x,y)<(1-dd)*0.5) fb.d[k]=M.UP[fb.d[k]]; } } }
function lantern(fb,v,S,GS){ if (!S.lantern) return; var t=v.t, cam=v.cam, fw=fb.w, x=LANT.x-cam, y=LANT.y, f=0.8+Math.sin(t*7.1)*0.1+Math.sin(t*12.7)*0.07;
  if (x<-30||x>fw+30) return; M.glow(fb,x,y,TODN==='day'?6:16,t,TODN==='day'?0.25:0.55*f);
  var w={px:function(px,py,c){ px=rnd(px); py=rnd(py); if (px<0||px>=fw||py<0||py>=H) return; fb.d[py*fw+px]=c; }, hl:function(a,b2,py,c){ for (var i=a;i<=b2;i++) w.px(i,py,c); }, vl:function(px,a,b2,c){ for (var j=a;j<=b2;j++) w.px(px,j,c); }};
  lanternBody(w,x,y,true); if (f>0.85) w.px(x,y,P.l1); }
function zlataLamp(fb,v,S,GS){ if (!S.zlataLamp) return; var t=v.t, cam=v.cam, fw=fb.w, A=M.E&&M.E.ACT&&M.E.ACT.zlata, zx=(A&&A.visible)?A.x:ZPOS[0], zy=(A&&A.visible)?A.y:ZPOS[1];
  var lx=rnd(zx+(A&&A.f==='R'?7:-7))-cam, ly=rnd(zy-26), f=0.85+Math.sin(t*6.3)*0.06+Math.sin(t*11.1)*0.04; if (lx<-40||lx>fw+40) return;
  M.glow(fb,lx,ly,TODN==='day'?5:20,t,TODN==='day'?0.2:0.5*f);
  // Petroleumlampe: Glaszylinder mit Flamme, Messingfuß
  [[0,-3,P.y5],[0,-2,P.l0],[0,-1,P.y4],[-1,-1,P.y3],[1,-1,P.y3],[-1,-2,P.y4],[1,-2,P.y4],[0,-4,P.y3],[-2,0,P.y2],[-1,0,P.y3],[0,0,P.y3],[1,0,P.y3],[2,0,P.y2],[-1,1,P.y1],[0,1,P.y2],[1,1,P.y1],[0,-5,P.m2],[0,-6,P.m1]].forEach(function(q){ var X=lx+q[0], Y=ly+q[1]; if (X>=0&&X<fw&&Y>=0&&Y<H) fb.d[Y*fw+X]=q[2]; }); }
// Geisterfähre am Steg (S.ferry==='here'), sonst nach dem Schalter k3.fin.ferry auf dem Fluss
var FST={state:null,from:null,to:null,t0:0,cur:null};
function ferryState(S,GS){ if (S.ferry==='here') return 'here'; if (S.ferry==='gone') return null; var g=GS&&GS.flags?GS.flags['k3.fin.ferry']:null; if (!g) return S.ferry||null; return g==='left'||g==='far'?'here':(g==='here'?'far':g); }
function ferryPos(S,GS,t){ var st=ferryState(S,GS);
  if (st!==FST.state){ var tgt=FERRY[st]||null; if (FST.cur && tgt && FST.state){ FST.from=FST.cur.slice(); FST.to=tgt.slice(); FST.t0=t; } else { FST.from=tgt; FST.to=tgt; FST.t0=t-99; } FST.state=st; if (!tgt){ FST.to=null; FST.t0=t; } }
  if (!FST.to){ if (!FST.cur) return null; var a=1-(t-FST.t0)/2.5; if (a<=0){ FST.cur=null; return null; } return FST.cur.concat([a]); }
  var u=sm((t-FST.t0)/7), p=[lerp(FST.from[0],FST.to[0],u),lerp(FST.from[1],FST.to[1],u),lerp(FST.from[2],FST.to[2],u)]; FST.cur=p; return p.concat([1]); }
function ferryDraw(fb,v,S,GS,part){ var p=ferryPos(S,GS,v.t); if (!p) return; var cam=v.cam, fw=fb.w, s=p[2], al=p[3], cx=p[0]-cam, dy0=p[1], t=v.t, K=v.ghost?6:4;
  var bob=Math.sin(t*1.3)*0.6*s, len=48*s, dep=Math.max(2,6*s), rail=Math.max(2,8*s), x, y;
  function put(x,y,c,k){ x=rnd(x); y=rnd(y+bob); if (x<0||x>=fw||y<0||y>=H) return; if (al<1 && bayer(x,y)>al) return; var i=y*fw+x; fb.d[i]=M.mix(fb.d[i],c,k===undefined?K:k); }
  var x0=cx-len/2, x1=cx+len/2;
  if (part==='back'){ for (y=0;y<dep;y++){ var ins=(dep-y)*0.6*s; for (x=x0+ins;x<=x1-ins;x++) put(x,dy0-dep+y,((Math.floor((x-x0)/(3*s+0.5)))%2)?P.x2:P.x3); }
    for (x=x0+2*s;x<=x1-2*s;x+=0.5) put(x,dy0-dep-rail,P.x4); for (var q=0;q<=6;q++){ var px=lerp(x0+2*s,x1-2*s,q/6); for (y=dy0-dep-rail;y<dy0-dep;y++) put(px,y,P.x3); }
    var pp=x0+len*0.3; for (y=dy0-dep-rail*2.2;y<dy0-dep;y++) put(pp,y,P.x4); put(pp+2,dy0-dep-rail*2.2+2,P.y4,5); }
  else { for (y=0;y<Math.max(2,3*s);y++) for (x=x0;x<=x1;x++) put(x,dy0+y,y<1?P.x4:P.x2); for (x=x0;x<=x1;x+=0.5) put(x,dy0-rail,P.x5,K-1);
    for (var q2=0;q2<=7;q2++){ var px2=lerp(x0,x1,q2/7); for (y=dy0-rail;y<dy0;y++) put(px2,y,P.x4,K-1); } for (x=x0-2;x<=x1+2;x++){ if (Math.sin(x*0.7-t*3)>0.3) put(x,dy0+Math.max(2,3*s),P.x5,3); } } }
function layers(S,GS,tod){ var L=[
  { get base(){ var p=FST.cur||FERRY[ferryState(S,GS)]; return p?Math.round(p[1])-2:0; }, draw:function(fb,v,S2,GS2){ ferryDraw(fb,v,S2,GS2,'back'); } },
  { get base(){ var p=FST.cur||FERRY[ferryState(S,GS)]; return p?Math.round(p[1])+2:0; }, draw:function(fb,v,S2,GS2){ ferryDraw(fb,v,S2,GS2,'front'); } } ];
  // Vordergrund: die Pfosten des Schuppens und der Zaunpfosten vorn, Figuren im Schuppen gehen dahinter
  if (LAST){ var l=M.layer(SHED.x0,SHED.top,SHED.x1-SHED.x0+2,SHED.base-SHED.top+1,SHED.base+3); [SHED.x0,SHED.x1-2].forEach(function(px){ for (var y=SHED.top+3;y<SHED.base;y++) for (var i=0;i<3;i++) l.px(px-SHED.x0+i,y-SHED.top,LAST.d[y*W+px+i]); }); L.push(l); }
  return L; }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS); if (wea==='grey') M.fogDrift(fb,v.t,{y0:56,y1:104,amt:0.28,k:2,col:P.m4,cam:v.cam,speed:3}); }
// ---------------------------------------------------------------- Malas Sicht: das Ende ihrer Leine am Grab, Batos Leine zur Glocke
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, fw=fb.w;
  // Batos Leine: vom Schuppen über den Fluss zur Glocke drüben
  var a=[LANT.x,LANT.y+8], b=[FB.bell[0]-4,rnd(farTop(FB.bell[0]))-11], n=120;
  for (var s=0;s<=n;s++){ var u=s/n, x=rnd(lerp(a[0],b[0],u)-cam), y=rnd(lerp(a[1],b[1],u)-Math.sin(u*Math.PI)*8+Math.sin(t*0.9+u*5)*0.6); if (x<0||x>=fw||y<0||y>=H) continue; var pl=(Math.sin(t*1.1+u*9)+1)/2; if (pl<0.25&&(s%2)) continue; fb.px(x,y,pl>0.75?P.v5:(pl>0.4?P.v4:P.v3)); }
  // am Grab: ein warmer Knoten, das Ende von Malas Leine; ein zarter Faden zur Haustür (zu Zlata), bis die Leine sich löst
  if (GS && GS.phase==='k3_epi_d') return; if (GS && GS.flags && GS.flags['k3.fin.free']) return;
  var gx=(GRAVE.x0+GRAVE.x1)/2-cam, gy=GRAVE.y0-2, al=0.6+0.4*Math.sin(t*1.7);
  for (var yy=gy-8;yy<gy+8;yy++) for (var xx=rnd(gx-10);xx<gx+10;xx++){ if (xx<0||xx>=fw) continue; var d=Math.hypot((xx-gx)/10,(yy-gy)/7); if (d>1) continue; if (bayer(xx,yy)<(1-d)*0.45*al) fb.px(xx,yy,d<0.4?P.x6:(d<0.7?P.x5:P.x3)); }
  var A=M.E&&M.E.ACT&&M.E.ACT.zlata, tx=(A&&A.visible)?A.x:facRect('door')[0]+12, ty=(A&&A.visible)?A.y-26:HSE.base-30;
  for (var q=0;q<=90;q++){ var u2=q/90, x2=rnd(lerp(gx+cam,tx,u2)-cam), y2=rnd(lerp(gy,ty,u2)-Math.sin(u2*Math.PI)*14+Math.sin(t*1.3+u2*6)*0.8); if (x2<0||x2>=fw) continue; var pu=(Math.sin(t*1.8-u2*10)+1)/2; if (pu<0.3&&(q%2)) continue; fb.px(x2,y2,pu>0.8?P.x6:(pu>0.45?P.x5:P.x3)); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S,GS){ if (x<8||x>472||y<112||y>=140) return false;
  if (x>=GRAVE.x0-6&&x<=GRAVE.x1+8&&y<GRAVE.y1+3) return false;                       // nicht über das Grab
  if (x>=BLOCK.x-8&&x<=BLOCK.x+8&&y>BLOCK.y-3&&y<BLOCK.y+3) return false;             // Hackklotz
  return true; }
function walkJetty(x,y,S,GS){ var t=(y-JETTY.yt)/(JETTY.yb-JETTY.yt); return y>=JETTY.yt+4&&y<=JETTY.yb&&x>=lerp(JETTY.x0+12,JETTY.x0,t)+2&&x<=lerp(JETTY.x1-10,JETTY.x1,t)-2; }
var dr=facRect('door');
M.defineArt('skela_l',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, front:front, ghost:ghost,
  walk:function(x,y,S,GS){ return walk(x,y,S,GS)||walkJetty(x,y,S,GS); }, walkG:function(){ return false; },
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!M.TINT[tod]) return null; var best=0; if (S.zlataLamp){ var A=M.E&&M.E.ACT&&M.E.ACT.zlata, zx=(A&&A.visible)?A.x:ZPOS[0], zy=(A&&A.visible)?A.y:ZPOS[1]; best=Math.max(best,1-Math.hypot(a.x-zx+6,(a.y-zy)*1.5)/60); }
    if (S.lantern) best=Math.max(best,1-Math.hypot(a.x-LANT.x,(a.y-112)*1.5)/50); return best>0.55?M.TINT.lamp.a:(best>0.25?MIDW.a:null); },
  spots:{ to_bridge:[0,90,16,54], house:[HSE.x0,EAVE-RF-2,HSE.w,HSE.base-EAVE+RF+2], house_door:[dr[0]-2,dr[1]-2,dr[2]+4,dr[3]+2], shed:[SHED.x0-4,SHED.top-2,SHED.x1-SHED.x0+8,SHED.base-SHED.top+2],
    quince:[QT.x-20,QT.base-60,40,46], grave:[GRAVE.x0-7,GRAVE.y0-6,GRAVE.x1-GRAVE.x0+9,GRAVE.y1-GRAVE.y0+8], board:[GRAVE.x1+1,GRAVE.y1-17,9,19], landing:[JETTY.x0-2,JETTY.yt-4,JETTY.x1-JETTY.x0+6,JETTY.yb-JETTY.yt+6],
    hens:[170,118,80,20], woodpile:[WOOD.x0-2,WOOD.base-27,WOOD.x1-WOOD.x0+5,28], far_bell:[FB.bell[0]-10,28,18,24] },
  stands:{ to_bridge:[12,124,'L'], house:[330,118,'B'], house_door:[dr[0]+12,116,'B'], shed:[120,116,'B'], quince:[436,126,'B'], grave:[437,128,'B'], board:[456,126,'L'], landing:[56,114,'B'],
    hens:[210,130,'B'], woodpile:[414,118,'B'], far_bell:[160,116,'B'] },
  actorPos:{ zlata:[dr[0]+12,117,'L'], bato:[124,111,'L'], nada:[414,126,'R'], vlado:[214,122,'R'], kata:[236,126,'L'], mala:[462,125,'L'] },
  start:[20,124,'R'], entries:{ skela_most:[16,124,'R'], zlata_k:[dr[0]+12,117,'R'] },
  ferry:FERRY, facRect:facRect
});
ZPOS=[dr[0]+12,117];
})(M);
