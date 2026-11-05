/* ===== rooms/art/limbo.js — Zwischenwelt: der Ort zwischen den Welten, an dem ein Geist ins Licht geht =====
   Schwarze Leere mit feinem Sternenstaub, der sich in einer langsamen Spirale um ein großes, weiches, weißes Licht legt.
   Davor schwebt eine Plattform aus Kalksteinplatten wie auf der Riva, hier aber kalt und mondhell, mit ausgebrochenen
   Rändern und fehlenden Platten; lose Steine treiben daneben. Links steht ein Rundbogentor wie in der Altstadt, schwach
   blau leuchtend: der Weg zurück. Darin, je nach Geist (S.who), die Riva in der Dämmerung mit Palme und Laterne (Ivka),
   der nächtliche Hafen mit der erleuchteten Fähre (Luka) oder der warme, dunkle Hotelflur (Bruno), sonst nur ein Schimmer.
   Vor dem Licht liegt ein Stück des Ortes, an den der Geist gebunden war: Poller und zwei Kaisteine (Ivka), Holzstufen,
   die ins Nichts führen (Luka), ein Stück Rezeption mit Messingglocke (Bruno). Die Tageszeit spielt hier keine Rolle. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
// Rampe mit sparsamem Dither: gemischt wird nur im mittleren Drittel jeder Stufe
function q(r,v,x,y,k){ var n=r.length-1, f=cl(v,0,0.9999)*n, i=Math.floor(f), t=(f-i-0.5)*(k||3)+0.5; return r[i+(t>bayer(x,y)?1:0)]; }
// Stufen mit eigenen Schwellen: Dither nur in einem schmalen Fenster um jede Schwelle
function qsb(st,cs,v,b,win){ var n=st.length, i=0; while (i<n && v>=st[i]) i++;
  if (i<n){ var du=st[i]-v; if (du<win && b<0.5*(1-du/win)) return cs[i+1]; }
  if (i>0){ var dl=v-st[i-1]; if (dl<win && b>1-0.5*(1-dl/win)) return cs[i-1]; }
  return cs[i]; }
function whoOf(S){ return (S&&S.who)||''; }
// Regionen: 0 = Leere und Licht (darf in dynamic schimmern), 1 = gemalt (Staub, Stein, Tor, Requisit)
var REG=new Uint8Array(W*H);
function RW(b){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=1; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
// Schreiber, der nur innerhalb einer Maske malt
function clipW(w,ok){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (ok(x,y)) w.px(x,y,c); };
  o.get=w.get; o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  o.rect=function(x,y,ww,hh,c){ for (var j=y;j<y+hh;j++) for (var i=x;i<x+ww;i++) o.px(i,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- das Licht
var LX=200, LY=57, LB=[142,0,258,121];            // Mitte; Rechteck, in dem es schimmert (x0,y0,x1,y1)
// Stärke 1 in der Mitte, linear fallend mit dem Abstand; Form: weiche Vereinigung eines hohen Kerns und eines runden Hofs
var LST=[0.07,0.16,0.26,0.36,0.45,0.54,0.625,0.70,0.755,0.79], LCS=[P.k0,P.x0,P.x0,P.x1,P.x2,P.x3,P.x4,P.x5,P.x6,P.l0,P.l1];
var LI=new Float32Array(W*H);                      // Lichtstärke je Pixel (für den Schimmer)
function lightI(x,y){ var dx=x+0.5-LX, dy=y+0.5-LY; dy*=dy>0?1.3:0.92;                 // unten (hinter den Figuren) fällt es schneller ab
  var d1=Math.sqrt(dx*dx/420+dy*dy/1700), d2=Math.sqrt(dx*dx/680+dy*dy/840);
  var d=-Math.log(Math.exp(-5*d1)+Math.exp(-5*d2))/5+0.139, th=Math.atan2(dy,dx);
  d*=1+0.025*Math.sin(th*9+1.3)*sm(d-0.8);                                 // ganz feine Strahlen im Hof
  return 1-d/2.25; }
function lightCol(I,x,y){ return lightColB(I,bayer(x,y)); }
function lightColB(I,b){ if (I<0.07) return (I>0 && b<Math.pow(I/0.07,2)*0.4)?P.x0:P.k0;
  if (I<0.16) return (b<0.25+(I-0.07)/0.09*0.75)?P.x0:P.k0;              // äußerster Saum: weich ausgedithert
  return qsb(LST,LCS,I,b,0.014+(1-cl(I,0,1))*0.016); }
// Farbtabelle für den Schimmer: Stärke (1/900-Schritte) x Bayer-Zelle -> Farbe
var LUTN=1024, LUTC=new Uint8Array(LUTN*16);
(function(){ for (var j=0;j<LUTN;j++) for (var c=0;c<16;c++) LUTC[j*16+c]=lightColB(j/900,bayer(c&3,c>>2)); })();

// ---------------------------------------------------------------- Leere: Licht, Sternenstaub als Spirale, ferne Trümmer
var TWINK=[];
function voidPaint(b){ var x, y, k, i; TWINK.length=0;
  for (y=0;y<H;y++) for (x=0;x<W;x++){ k=y*W+x; var I=lightI(x,y); LI[k]=I; b.d[k]=lightCol(I,x,y); REG[k]=0; }
  function dot(x,y,lev,hu){ x=Math.round(x); y=Math.round(y); if (x<0||y<0||x>=W||y>=H) return; k=y*W+x; if (REG[k]) return; var I=LI[k], c;
    if (I>0.2) c=M.UP[M.UP[b.d[k]]];
    else { var set=hu<0.42?['n0','n1','n2','n3']:(hu<0.72?['v0','v1','v2','v3']:(hu<0.93?['x0','x1','x2','x3']:['k2','m0','m1','m2'])); c=P[set[lev]]; if (lev===3 && TWINK.length<16 && y<96) TWINK.push([x,y,c]); }
    b.d[k]=c; REG[k]=1; }
  // feiner Grund: sehr sparsam, in Haufen, mit leeren Stellen
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var cl0=fbm(x,y,23,4); if (cl0<0.4) continue; if (hash(x*1.31+7.1,y*0.77+3.3)>=0.02*(cl0-0.36)*3 || bayer(x,y)>0.85) continue;
    var e=hash(x+3.7,y*1.9); dot(x,y,e<0.62?0:(e<0.9?1:(e<0.98?2:3)),hash(x*0.37,y+9.1)); }
  // zwei Arme einer langsamen Spirale um das Licht, leicht geneigt, nach innen dichter und heller
  var rg=M.rng(4711);
  for (i=0;i<2200;i++){ var arm=i%2, s=Math.pow(rg(),0.85), r=24*Math.pow(10,s), th=arm*Math.PI+0.5+s*2.0*Math.PI, sc=(rg()+rg()+rg()-1.5)*(3+r*0.1), al=th+(rg()-0.5)*0.12;
    var px=LX+Math.cos(al)*(r+sc), py=LY+Math.sin(al)*(r+sc)*0.7; if (rg()<0.3) continue;
    var near=cl(1.25-r/130,0,1), e2=rg()*0.6+near*0.42+0.12, lev=e2<0.4?0:(e2<0.72?1:(e2<0.95?2:3)); dot(px,py,lev,rg()*0.75+near*0.3); }
  // ein paar Körnchen mehr dicht um den Hof
  for (i=0;i<140;i++){ var a2=rg()*Math.PI*2, r2=50+(rg()+rg()-1)*14; dot(LX+Math.cos(a2)*r2*1.05,LY+Math.sin(a2)*r2*1.12,rg()<0.6?1:2,0.55+rg()*0.4); }
  // ferne Trümmerstücke, winzig, mit kaltem Saum zur Lichtseite
  var w=RW(b);
  [[112,80,4],[287,30,3],[18,54,3],[238,16,2],[134,26,2],[300,74,2]].forEach(function(f,i){ var x0=f[0], y0=f[1], n=f[2], side=x0<LX?1:-1;
    for (var j=0;j<3;j++){ var hw=n-j*(n>2?1.5:1)-(hash(i,j)<0.5?0.5:0); if (hw<0.5) break; for (var xx=Math.round(x0-hw);xx<=Math.round(x0+hw);xx++){ var c=j===0?P.k2:P.k1; if (j===0 && (xx-x0)*side>=hw-1) c=P.n2; w.px(xx,y0+j,c); } } }); }

// ---------------------------------------------------------------- Plattform: Geometrie der Platten (einmal beim Laden)
// Bodenebene in Perspektive: y = VPY + VC/D, D = 1+Z/VK; Boden-X = VPX + (x-VPX)*D. Reihen nach Tiefe Z, Platten nach X.
var VPX=200, VPY=-40, VC=180, VK=140;
var ZR=[0,10.2,20.4,29.8,38.9], NR=4;
var XL=[24,6,4,22], XR=[300,311,313,304];                         // Ausdehnung je Reihe (vorn -> hinten), in Boden-X
var HOLES=[[3,128],[3,296],[0,30],[1,309],[2,-2]];                // fehlende Platten: [Reihe, Boden-X]
var BITES=[[0,100,0,-1,0.30],[0,232,0,-1,0.32],[3,62,0,1,0.26],[3,190,0,1,0.3],[1,296,1,0.3,0.12]];   // ausgebrochene Kanten: [Reihe, X, nx, nz, k]
var COLS=[], EXIST=[], CUT={};
var SID=new Int16Array(W*H).fill(-1), SCX=new Float32Array(NR*64), SCY=new Float32Array(NR*64);
(function(){ var r, c, x, y, cnt=new Float32Array(NR*64);
  for (r=0;r<NR;r++){ var xs=[]; x=-46+hash(r,7)*18; c=0; while (x<370){ xs.push(x); x+=20+hash(r*31+c,13)*16; c++; } xs.push(x); COLS.push(xs);
    var ex=[], first=-1, last=-1; for (c=0;c<xs.length-1;c++){ var xc=(xs[c]+xs[c+1])/2; ex.push(xc>XL[r]&&xc<XR[r]); }
    HOLES.forEach(function(h){ if (h[0]!==r) return; for (var c2=0;c2<xs.length-1;c2++) if (h[1]>=xs[c2]&&h[1]<xs[c2+1]) ex[c2]=false; });
    for (c=0;c<ex.length;c++) if (ex[c]){ if (first<0) first=c; last=c; }
    EXIST.push(ex);
    CUT[r*64+first]=[-1,(hash(r,22)-0.5)*1.2,0.08+hash(r,21)*0.28];     // Endplatten: schräge, gezackte Bruchkante
    CUT[r*64+last]=[1,(hash(r,24)-0.5)*1.2,0.08+hash(r,23)*0.28]; }
  BITES.forEach(function(bt){ var xs=COLS[bt[0]]; for (var c2=0;c2<xs.length-1;c2++) if (bt[1]>=xs[c2]&&bt[1]<xs[c2+1]) CUT[bt[0]*64+c2]=[bt[2],bt[3],bt[4]]; });
  for (y=90;y<H;y++){ var D=VC/(y+0.5-VPY), Z=(D-1)*VK;
    for (x=0;x<W;x++){ var X=VPX+(x+0.5-VPX)*D, Zw=Z+0.8*Math.sin(X*0.061+0.4)+0.4*Math.sin(X*0.19+2.1), Xw=X+1.4*Math.sin(Z*0.33+X*0.011);
      if (Zw<0||Zw>=ZR[NR]) continue; r=0; while (Zw>=ZR[r+1]) r++; var cs=COLS[r]; if (Xw<cs[0]||Xw>=cs[cs.length-1]) continue; c=0; while (Xw>=cs[c+1]) c++;
      if (!EXIST[r][c]) continue; var fx=(Xw-cs[c])/(cs[c+1]-cs[c]), fz=(Zw-ZR[r])/(ZR[r+1]-ZR[r]), cu=CUT[r*64+c];
      if (cu && (fx-0.5)*cu[0]+(fz-0.5)*cu[1]+(hash(Math.floor(fx*7)+r*5,Math.floor(fz*4)+c*3)-0.5)*0.16>cu[2]) continue;
      var id=r*64+c; SID[y*W+x]=id; SCX[id]+=x; SCY[id]+=y; cnt[id]++; } }
  for (var i=0;i<NR*64;i++) if (cnt[i]){ SCX[i]/=cnt[i]; SCY[i]/=cnt[i]; } })();
function sidAt(x,y){ if (x<0||y<0||x>=W||y>=H) return -1; return SID[y*W+x]; }

// ---------------------------------------------------------------- Farben
var STONE=R('k1 n0 n1 n2 m2 m3 s3 s4 s5 s6'), BSTONE=R('k1 n0 n1 n2 n3 c3 n4 x4 n5 x5'), FACE=R('k0 k1 k2 n0 n1 n2 m2');
var BLUE=new Uint8Array(256), i0; for (i0=0;i0<256;i0++) BLUE[i0]=i0;          // kühler Schein des Tores auf Stein
[['k0','k2'],['k1','n0'],['k2','n0'],['n0','n1'],['n1','n2'],['n2','n3'],['m2','n3'],['m3','n4'],['s3','n4'],['s4','n5'],['s5','n5'],['s6','n5']].forEach(function(p){ BLUE[P[p[0]]]=P[p[1]]; });

// ---------------------------------------------------------------- Plattform malen
// Licht auf dem Boden: am hellsten hinten unter dem Licht, kühl und dunkler nach vorn und zu den Enden
function floorV(x,y){ var Lp=Math.exp(-Math.pow((x-LX)/95,2)-Math.pow((y-100)/26,2));
  return 0.45+Lp*0.24+0.05*(1-Math.abs(x-LX)/200)-0.07*sm((y-116)/24)-0.12*sm((Math.abs(x-172)-96)/40); }
function archGlow(x,y){ return Math.exp(-Math.pow((x-55)/26,2)-Math.pow((y-121)/8,2)); }       // Schein aus dem Tor auf den Platten
function platPaint(b){ var w=RW(b), x, y, k, j;
  // Dicke: Stirn- und Seitenflächen unter allen Kanten (auch in den Löchern), darunter an den Enden etwas Geröll
  for (y=96;y<H;y++) for (x=0;x<W;x++){ k=y*W+x; if (SID[k]>=0) continue; var th=Math.round(4+4*(y-100)/40), t=0;
    for (j=1;j<=th;j++){ if (y-j>=0 && SID[k-j*W]>=0){ t=j; break; } }
    if (!t){ var end=(x<84||x>262), rb=end?th+Math.round(fbm(x*1.3,3,4,9)*11-3):0; if (rb<=th) continue;          // Geröll unter den Enden
      for (j=th+1;j<=rb;j++){ if (y-j>=0 && SID[k-j*W]>=0){ t=j; break; } } if (!t) continue;
      w.px(x,y,(t===rb)?P.k0:((sidAt(x-1,y-t)<0||sidAt(x+1,y-t)<0)?P.k2:P.k1)); continue; }
    var s0=SID[k-t*W], vj=(sidAt(x-1,y-t)!==s0 && sidAt(x-1,y-t)>=0), v=0.46-t*0.05+(hash(x>>1,y)-0.5)*0.05;
    if (t===1) v+=0.14; if (vj) v-=0.22; v+=0.1*Math.exp(-Math.pow((x-LX)/70,2));
    w.px(x,y,q(FACE,v,x,y)); }
  // Oberfläche: große Platten, je Platte ein Ton, leichte Kante zum Licht hin, weiche Fugen
  for (y=96;y<H;y++) for (x=0;x<W;x++){ k=y*W+x; var sid=SID[k]; if (sid<0) continue;
    var up=sidAt(x,y-1), up2=sidAt(x,y-2), lf=sidAt(x-1,y), rt=sidAt(x+1,y), lf2=sidAt(x-2,y);
    var vs=floorV(SCX[sid],SCY[sid])+(hash(sid*1.7,3.1)-0.5)*0.1, v=vs+(floorV(x,y)-vs)*0.28+(vn(x,y*2,7,sid)-0.5)*0.03;
    if (hash(x*1.9,y*2.3)<0.02) v-=0.06;
    var gl=archGlow(x,y), ramp=(gl>0.1 && ((gl-0.36)*2.2+0.5)>bayer(x,y))?BSTONE:STONE; if (ramp===BSTONE) v+=gl*0.2;
    var c;
    if (up<0){ v+=0.14+0.36*Math.exp(-Math.pow((x-LX)/46,2)); c=q(ramp,v,x,y,4.5); }                  // hintere Kante im Gegenlicht
    else if (up!==sid || (lf>=0 && lf!==sid)){ c=ramp[cl(Math.floor(v*9)-2,0,9)]; }               // Fuge, zwei Stufen dunkler
    else { if (up2!==sid) v+=0.07;                                                                // Kante zum Licht (hinten)
      if (x<LX){ if (rt!==sid) v+=0.05; } else if (lf2!==sid) v+=0.05;
      if (lf<0||rt<0) v-=0.05;
      c=q(ramp,v,x,y,4.5); }
    w.px(x,y,c); } }

// ---------------------------------------------------------------- Rundbogentor (Weg zurück)
var A={x0:32,x1:76,cx:54,cy:62,ri:13.5,ro:22.5,thr:114,base:118};
function archTopY(x){ return x<36?53:(x<41?47:(x<46?44:(x<51?40:(x<58?36:(x<64?39:(x<70?41:44)))))); }
function inOpen(x,y){ if (y>=A.thr) return false; var dx=x+0.5-A.cx, dy=y+0.5-A.cy; if (dy>=0) return Math.abs(dx)<A.ri; return dx*dx+dy*dy<A.ri*A.ri; }
function isReveal(x,y){ var dx=x+0.5-A.cx, dy=y+0.5-A.cy; if (dx<-A.ri+3) return true; if (dy<0 && dx<-2) return Math.sqrt(dx*dx+dy*dy)>A.ri-2.4; return false; }
function inView(x,y){ return inOpen(x,y) && !isReveal(x,y); }
function archBlock(x,y){ var dx=x+0.5-A.cx, dy=y+0.5-A.cy, r=Math.sqrt(dx*dx+dy*dy), L=A.x0, Rr=A.x1;
  if (y>A.base||y<30) return -1;
  if (y>=A.cy && y<=A.cy+2 && ((x>=L-1&&x<=L+9)||(x>=Rr-9&&x<=Rr+1))) return x<A.cx?200:201;          // Kämpfer
  if (y>=111){ if ((x>=L-1&&x<=L+9)||(x>=Rr-9&&x<=Rr+1)) return x<A.cx?210:211; if (y>=A.thr && x>L+9 && x<Rr-9) return 220; }   // Sockel, Schwelle
  if (x<L||x>Rr||inOpen(x,y)) return -1;
  if (y>=A.cy){ if (x>L+8 && x<Rr-8) return -1;                                                          // Pfeiler, Quader im Wechsel
    var row=Math.floor((y-(A.cy+3))/7), left=x<A.cx, xi=left?x-L:Rr-x, sp=(row%2===1)?(xi<4?0:1):0; return 300+row*4+(left?0:2)+sp; }
  if (r>=A.ri && r<A.ro){ var th=Math.atan2(-dy,dx), idx=Math.floor(th/(Math.PI/11)); return 100+cl(idx,0,10); }   // Keilsteine
  if (dy<0 && Math.abs(dx)<2.6+(A.cy-A.ri-(y+0.5))*0.12 && y>=A.cy-A.ro-3.5) return 105;                  // Schlussstein
  if (y<archTopY(x)) return -1;
  var crow=Math.floor((A.cy-1-y)/6), off=hash(crow,5)*9, col=Math.floor((x+off)/9);
  return 400+crow*20+col; }
function openDist(x,y){ var dx=x+0.5-A.cx, dy=y+0.5-A.cy; if (dy>=0) return Math.max(0,Math.abs(dx)-A.ri)+(y>=A.thr?(y-A.thr+1):0); return Math.max(0,Math.sqrt(dx*dx+dy*dy)-A.ri); }
function archPaint(b,S){ var w=RW(b), x, y, X0=26, X1=84, Y0=28, Y1=119, BW=X1-X0+1, ids=new Int32Array(BW*(Y1-Y0+1));
  function id(x,y){ if (x<X0||x>X1||y<Y0||y>Y1) return -1; return ids[(y-Y0)*BW+(x-X0)]; }
  for (y=Y0;y<=Y1;y++) for (x=X0;x<=X1;x++) ids[(y-Y0)*BW+(x-X0)]=archBlock(x,y);
  // ganz schwacher blauer Hof in der Leere um das Tor
  for (y=Y0;y<=Y1;y++) for (x=X0-6;x<=X1+6;x++){ if (x<0||REG[y*W+x]) continue; if (id(x,y)>=0) continue; var dx=x+0.5-A.cx, dy=y+0.5-A.cy, d=(dy>=0)?Math.max(0,Math.abs(dx)-22.5):Math.max(0,Math.sqrt(dx*dx+dy*dy)-23);
    if (d<9 && bayer(x,y)<(1-d/9)*(1-d/9)*0.3) b.d[y*W+x]=(b.d[y*W+x]===P.k0)?P.x0:P.x1; }
  // Blick zurück (je nach Geist) und die Laibung links
  viewPaint(w,whoOf(S));
  for (y=Y0;y<=Y1;y++) for (x=X0;x<=X1;x++){ if (!inOpen(x,y)||!isReveal(x,y)) continue; var e=(x+0.5-(A.cx-A.ri));
    var v=0.42+(e>2?0.12:0)+(hash(x,y>>1)-0.5)*0.08-(y<A.cy?0.06:0); w.px(x,y,q(R('k2 n0 n1 n2 n3 x3'),v,x,y)); }
  // Mauerwerk
  for (y=Y0;y<=Y1;y++) for (x=X0;x<=X1;x++){ var i=id(x,y); if (i<0) continue;
    var up=id(x,y-1), dn=id(x,y+1), lf=id(x-1,y), rt=id(x+1,y), c;
    var v=0.40+0.16*(x-30)/50+(hash(i*1.3,7)-0.5)*0.08+(vn(x,y,4,i)-0.5)*0.05; if (hash(x*2.7,y*1.1)<0.05) v-=0.07;
    if (i>=100&&i<111) v+=0.03; if (i===105) v+=0.04; if (i===220) v+=0.06;
    if ((up>=0&&up!==i)||(lf>=0&&lf!==i)){ c=(x>60)?P.n1:P.n0; }
    else { if (up<0 && !inOpen(x,y-1)) v+=0.16; else if (id(x,y-2)!==i) v+=0.08;
      if (dn<0 && !inOpen(x,y+1)) v-=0.03; if (dn>=0 && dn!==i) v-=0.05;
      if (rt<0 && !inOpen(x+1,y)) v+=0.07; if (lf<0 && !inOpen(x-1,y)) v-=0.05;
      c=q(STONE,v,x,y,4.5); }
    var od=openDist(x,y), gw=1-od/5.5; if (gw>0 && ((gw-0.45)*2.4+0.5)>bayer(x,y)) c=BLUE[c];       // blauer Schein am Rand der Öffnung
    w.px(x,y,c); }
  // rechte Seitenfläche (Mauerdicke), dem Licht zugewandt
  for (y=Y0;y<=Y1;y++){ var xr=-1; for (x=X1;x>=A.x1-10;x--){ if (id(x,y)>=0){ xr=x; break; } } if (xr<0) continue;
    var ir=id(xr,y), top=id(xr,y-1)<0, jn=(id(xr,y-1)>=0&&id(xr,y-1)!==ir);
    for (x=xr+1;x<=xr+3;x++){ if (x>X1||id(x,y)>=0) continue; var v2=0.62-(x-xr)*0.03+(hash(x,y*3)-0.5)*0.06+(top?0.12:0); w.px(x,y,jn?P.n1:q(STONE,v2,x,y)); } } }

// ---------------------------------------------------------------- Blick durch das Tor (gedämpft, blau-türkis)
function forView(fn){ for (var y=A.cy-15;y<A.thr;y++) for (var x=A.cx-14;x<=A.cx+14;x++){ if (inView(x,y)) fn(x,y); } }
function viewPaint(w,who){ var vw=clipW(w,inView), x, y;
  if (who==='ivka'){ var hz=96, SKY=R('n0 v1 v2 n3 x3 x4 x5'), SEA=R('k2 n0 x1 n1 x2 x3');
    forView(function(x,y){ var c; if (y<hz){ var t=(y-48)/(hz-48); c=q(SKY,0.05+Math.pow(t,1.35)*0.82+(fbm(x*0.8,y*2.2,7,2)-0.5)*0.14,x,y); }
      else { var d=(y-hz)/(A.thr-hz), s=Math.sin(x*0.8+y*1.9)+Math.sin(x*0.27-y*0.7); c=q(SEA,0.62-d*0.5+s*0.06,x,y); } vw.px(x,y,c); });
    for (x=40;x<=68;x++){ var hh=Math.round(1.6+Math.sin(x*0.35)*1.1+Math.sin(x*0.13+1)*1.4); for (y=hz-hh;y<hz;y++) vw.px(x,y,y===hz-hh?P.n2:P.n1); }
    for (y=hz+2;y<108;y++){ var gx=62+Math.round(Math.sin(y*1.7)*1.2); if ((y&1)===0) vw.hl(gx-1,gx+1,y,y<102?P.x4:P.x3); }   // Spiegelung der Laterne
    for (x=40;x<=68;x++){ vw.px(x,108,P.n2); vw.px(x,109,P.n1); for (y=110;y<A.thr;y++) vw.px(x,y,(hash(x>>2,y)<0.2)?P.k2:P.n0); }   // Riva-Kante
    // eine zweite, fernere Palme hinter der Laterne (heller, kleiner)
    for (y=88;y<=107;y++) vw.px(Math.round(58+Math.sin((107-y)/19*1.3)*1.5),y,P.n1);
    [[-160,6],[-125,5],[-60,5],[-25,7],[5,5]].forEach(function(f){ var a=f[0]*Math.PI/180; for (var s=0;s<=f[1];s++){ var u=s/f[1]; vw.px(Math.round(59+Math.cos(a)*s),Math.round(87+Math.sin(a)*s*0.7+u*u*f[1]*0.6),P.n1); } });
    vw.rect(53,105,3,3,P.k2); vw.hl(52,56,105,P.n1);                                                     // kleiner Poller
    vw.vl(63,86,108,P.k2); vw.vl(62,104,108,P.k2); vw.rect(61,82,5,5,P.n1); vw.rect(62,83,3,3,P.x5); vw.px(63,84,P.x6); vw.hl(61,65,81,P.k2); vw.px(63,80,P.k2);   // Laterne
    for (y=74;y<96;y++) for (x=54;x<=68;x++){ var d2=Math.hypot(x-63.5,(y-84.5)*1.1); if (d2<9 && d2>2.5 && bayer(x,y)<(1-d2/9)*0.6){ var c0=w.get(x,y); if (c0!==P.k2 && c0!==P.n1) vw.px(x,y,M.UP[c0]); } }
    // Palme links: gebogener Stamm, Wedel wie ein Springbrunnen, als Silhouette gegen den hellen Horizont
    for (y=77;y<=110;y++){ var t2=(110-y)/33, tx=Math.round(46+Math.sin(t2*1.5)*3.5); vw.px(tx,y,P.k2); vw.px(tx+1,y,(y%3===0)?P.n0:P.k2); }
    var px0=50, py0=76; [[-165,10],[-140,11],[-112,7],[-88,5],[-62,8],[-36,12],[-12,11],[12,8]].forEach(function(f,fi){ var a=f[0]*Math.PI/180, L=f[1];
      for (var s=0;s<=L;s++){ var u=s/L, fx=Math.round(px0+Math.cos(a)*s), fy=Math.round(py0+Math.sin(a)*s*0.7+u*u*L*0.62); vw.px(fx,fy,fi%3===2?P.n0:P.k2); if (s<3) vw.px(fx,fy+1,P.k2); else if (s%2===1) vw.px(fx,fy+1,P.n0); } });
    vw.rect(49,75,3,2,P.k2); }
  else if (who==='luka'){ var hz2=99, SK=R('k1 k2 n0 n1 n2'), SE=R('k1 k2 n0 x0 x1');
    forView(function(x,y){ var c; if (y<hz2){ var t=(y-48)/(hz2-48); c=q(SK,0.1+t*0.7+(fbm(x,y*2,8,5)-0.5)*0.1,x,y); if (hash(x*1.7,y*2.9)<0.02) c=(hash(x,y)<0.3)?P.n4:P.n3; }
      else { var s=Math.sin(x*0.9+y*1.6)+Math.sin(x*0.3-y*0.8); c=q(SE,0.55-(y-hz2)/16*0.3+s*0.06,x,y); } vw.px(x,y,c); });
    for (x=40;x<=68;x++){ var h3=Math.round(1+Math.sin(x*0.21+2)*1.2+hash(x>>2,3)*1.5); for (y=hz2-h3;y<hz2;y++) vw.px(x,y,P.k2); if (hash(x,41)<0.18) vw.px(x,hz2-h3-0,P.x3); }
    // Fähre, die gerade ablegt (rechts angeschnitten)
    var fx0=47, fy=98; vw.poly([[fx0,fy-5],[fx0+24,fy-5],[fx0+22,fy+2],[fx0+2,fy+2]],P.n1); vw.hl(fx0+1,fx0+23,fy-5,P.n3); vw.hl(fx0+2,fx0+22,fy,P.n0);
    vw.rect(fx0+4,fy-10,17,5,P.n2); vw.hl(fx0+4,fx0+20,fy-10,P.n4); vw.rect(fx0+8,fy-13,9,3,P.n2); vw.hl(fx0+8,fx0+16,fy-13,P.n4); vw.rect(fx0+13,fy-17,3,4,P.n1); vw.px(fx0+11,fy-19,P.x6); vw.vl(fx0+11,fy-18,fy-14,P.n1);
    for (x=fx0+5;x<fx0+21;x+=2){ vw.px(x,fy-8,hash(x,1)<0.75?P.l0:P.x4); vw.px(x,fy-3,hash(x,2)<0.6?P.x5:P.n2); } for (x=fx0+9;x<fx0+17;x+=2) vw.px(x,fy-12,P.x5);
    for (x=fx0+3;x<fx0+23;x+=2) for (y=fy+3;y<110;y+=2){ if (hash(x,y)<0.5-(y-fy)*0.035) vw.px(x+((y>>1)&1),y,(y<fy+6)?P.x4:P.x2); }
    for (x=40;x<=68;x++){ vw.px(x,110,P.n1); for (y=111;y<A.thr;y++) vw.px(x,y,P.k2); } vw.rect(43,107,3,3,P.k1); }
  else if (who==='bruno'){ var vx=54, vy=83;      // warmer, dunkler Hotelflur in Fluchtpunktperspektive
    forView(function(x,y){ var dx=x+0.5-vx, dy=y+0.5-vy, sx=Math.abs(dx)/4, sf=dy/7, sc=-dy/5, s=Math.max(sx,sf,sc), c;
      if (s<1){ var lit=(Math.abs(dx)<2.5&&dy>-4&&dy<6); c=lit?q(R('w2 y1 y2 y3'),0.55+(hash(x,y)-0.5)*0.2,x,y):P.w1; vw.px(x,y,c); return; }
      var d=1/s;     // 1 hinten, -> 0 vorn
      if (s===sf){ var u=dx/s; if (Math.abs(u)<2.3){ c=(Math.abs(u)>1.9)?P.y1:q(R('r0 r1 r2'),0.35+d*0.5+(hash(Math.floor(d*30),Math.floor(u*2))-0.5)*0.15,x,y); } else c=q(R('w0 w1 w2'),0.3+d*0.5,x,y); }
      else if (s===sc){ c=q(R('k2 w0 w1'),0.25+d*0.6,x,y); if (Math.abs(d*10-Math.round(d*10))<0.09*s && d<0.9) c=P.w0; if (Math.abs(dx/s)<0.7 && Math.abs(d-0.55)<0.04) c=P.y3; }   // Deckenbalken, ferne Deckenlampe
      else { var hgt=(dy/s+6)/13, seg=Math.floor(d*14); c=q(R('w0 w1 w2 e2'),0.3+d*0.45+(hgt>0.85?-0.15:0),x,y); if ((seg===3||seg===7) && hgt>0.25) c=P.w0; if ((seg===3||seg===7) && hgt>0.25 && Math.abs(d*14-seg-0.5)>0.4) c=P.w2;
        if ((seg===5||seg===9) && Math.abs(hgt-0.62)<0.07) c=P.y3; if ((seg===5||seg===9) && Math.abs(hgt-0.62)<0.18 && c!==P.y3 && bayer(x,y)<0.5) c=M.UP[c]; }
      vw.px(x,y,c); });
    // nahe Hängelampe oben im Bogen, warm, mit weichem Hof
    vw.vl(54,49,55,P.k2); vw.hl(52,56,56,P.w2); vw.hl(51,57,57,P.y2); vw.hl(52,56,58,P.y4); vw.px(54,58,P.y5);
    for (y=52;y<70;y++) for (x=44;x<=64;x++){ var dl=Math.hypot(x-54,(y-59)*1.2); if (dl>2.5 && dl<9 && bayer(x,y)<(1-dl/9)*0.55){ var c1=w.get(x,y); if (c1===P.k2||c1===P.w0||c1===P.w1) vw.px(x,y,M.UP[c1]); } }
    forView(function(x,y){ var e=Math.min(x-(A.cx-A.ri+3),A.cx+A.ri-1-x,A.thr-1-y); if (e<3 && bayer(x,y)<(3-e)/3*0.55) vw.px(x,y,BLUE[w.get(x,y)]===w.get(x,y)?P.n1:BLUE[w.get(x,y)]); }); }
  else if (who==='tomaz') viewTomaz(w,vw);
  else if (who==='ivan') viewIvan(w,vw);
  else if (who==='zora') viewZora(w,vw);
  else if (who==='mate') viewMate(w,vw);
  else if (who==='bato') viewBato(w,vw);
  else { forView(function(x,y){ var dx=(x+0.5-A.cx)/13, dy=(y+0.5-84)/30, d=Math.sqrt(dx*dx+dy*dy); vw.px(x,y,q(R('n0 n1 x1 x2 x3 x4'),0.95-d*0.75+Math.sin(x*1.3)*0.03,x,y)); }); }
  // leichte Abdunklung an den Rändern der Öffnung
  forView(function(x,y){ var e=Math.min(x-(A.cx-A.ri+3),A.cx+A.ri-1-x), top=openDist(x,y-3)>0||!inOpen(x,y-2); if ((e<1||top) && bayer(x,y)<0.6) vw.px(x,y,M.DN[w.get(x,y)]); }); }

// Kapitel 2 (Sarajevo): Tomaž – der Platz unter der Sahat-kula bei Nacht mit Laterne
function viewTomaz(w,vw){ var x, y, hz=100;
  forView(function(x,y){ var c; if (y<hz){ var t=(y-48)/(hz-48); c=q(R('k1 k2 n0 n1 n2 n3'),0.15+t*0.6+(fbm(x,y*2,8,9)-0.5)*0.08,x,y); if (y<78 && hash(x*2.1,y*1.3)<0.016) c=(hash(x,y)<0.4)?P.n4:P.n3; }
    else { var d=(y-hz)/(A.thr-hz); c=q(R('k1 k2 n0 n1'),0.6-d*0.35+(hash(x>>1,y)-0.5)*0.2,x,y); if ((((x+(y>>1)*2)%5)===0)&&(y%2===0)) c=P.k1; } vw.px(x,y,c); });   // Nachthimmel, Kopfsteinpflaster
  for (y=89;y<hz;y++) for (x=40;x<=68;x++){ var arch=(x>=55&&x<=61&&y>=92-(x>=57&&x<=59?1:0)); vw.px(x,y,arch?P.k1:(y===89?P.n2:(hash(x,y>>1)<0.2?P.n0:P.n1))); }   // Hofmauer der Moschee mit Bogentor
  for (x=54;x<=62;x+=2) vw.px(x,88,P.n0);
  for (y=56;y<hz;y++) for (x=45;x<=51;x++){ var c2=(x===45)?P.n4:((x===51)?P.k2:(x<48?P.n3:P.n2)); if ((y-56)%9===0) c2=P.n1; vw.px(x,y,c2); }          // Sahat-kula
  vw.poly([[44,56],[53,56],[48.5,49]],P.n1); vw.vl(48,47,49,P.n2); vw.px(48,46,P.n3); vw.hl(44,52,56,P.n3);
  vw.ellipse(48.5,62.5,2.6,2.6,P.x5); vw.px(48,61,P.k2); vw.px(48,62,P.k2); vw.px(49,62,P.k2);                                                  // Zifferblatt, schwach erleuchtet
  vw.rect(47,93,3,7,P.k1); vw.px(48,92,P.k1);                                                                                              // Tür im Turm
  vw.vl(63,82,112,P.k2); vw.vl(64,97,112,P.k1); vw.rect(61,77,5,5,P.n1); vw.rect(62,78,3,3,P.y3); vw.px(63,79,P.y5); vw.hl(61,65,76,P.k2); vw.px(63,75,P.k2);   // Laterne
  for (y=69;y<93;y++) for (x=52;x<=68;x++){ var d2=Math.hypot(x-63.5,(y-79.5)*1.1); if (d2<10 && d2>2.6 && bayer(x,y)<(1-d2/10)*0.55){ var c0=w.get(x,y); if (c0!==P.k2&&c0!==P.k1) vw.px(x,y,M.UP[c0]); } }
  for (y=104;y<113;y++) for (x=52;x<=68;x++){ var d3=Math.hypot((x-62.5)/7,(y-109)/3); if (d3<1 && bayer(x,y)<(1-d3)*0.7) vw.px(x,y,d3<0.5?P.y1:P.w1); }   // Lichtfleck auf dem Pflaster
  vw.hl(50,58,107,P.n2); vw.vl(51,108,110,P.k2); vw.vl(57,108,110,P.k2); }                                                                // Steinbank
// Ivan – die Miljacka und die gestreifte Fassade der Vijećnica
function viewIvan(w,vw){ var x, y;
  forView(function(x,y){ var c; if (y<58) c=q(R('k1 k2 n0 n1'),0.15+(y-48)/10*0.5,x,y);
    else if (y<96){ var band=Math.floor((y-58)/3)%2; c=band?q(R('t0 t1 t2'),0.45+(hash(x,y)-0.5)*0.25,x,y):q(R('n1 e1 e2 e3'),0.55+(hash(x,y)-0.5)*0.25,x,y);      // ockerrote Streifen
      var col=(x-43)%7, row=y-63; if (col>=2&&col<=4 && ((row>=0&&row<9)||(row>=14&&row<22))){ var top=(row<9?0:14); if (row-top>=((col===3)?0:1)) c=(hash(x>>1,y>>2)<0.25)?P.y2:P.k1; } }   // Spitzbogenfenster
    else if (y<100) c=(y===96)?P.n2:(hash(x,y)<0.3?P.n0:P.n1);                                                                               // Ufermauer
    else { var s=Math.sin(x*0.9+y*1.7)+Math.sin(x*0.3-y*0.6); c=q(R('k1 k2 n0 x0 x1'),0.55-(y-100)/13*0.3+s*0.08,x,y); if ((Math.floor((y-100+Math.sin(x*0.7)*1.2)/2)%2) && hash(x,y)<0.3) c=P.d0; }   // Miljacka, Spiegelung der Streifen
    vw.px(x,y,c); });
  for (x=40;x<=68;x++){ if ((x%4)<2) vw.vl(x,55,57,P.n1); vw.px(x,58,P.n2); }                                                               // Zinnen
  for (y=82;y<96;y++) for (x=50;x<=58;x++){ var dx=(x+0.5-54.5)/4.5, top2=82+(1-Math.sqrt(Math.max(0,1-dx*dx)))*4; if (y>=top2) vw.px(x,y,(y<top2+1)?P.e2:((x===54&&y>88)?P.y1:P.k0)); }   // Portal
  for (x=46;x<=62;x+=8){ for (y=100;y<113;y+=2) if (hash(x,y)<0.6) vw.px(x+((y>>1)%2),y,P.y1); } }                                       // Lichter im Wasser
// Zora – der Hof der Hochhäuser im Nebel
function viewZora(w,vw){ var x, y, FG=R('n1 n2 n3 x2 x3 n4');
  forView(function(x,y){ var t=(y-48)/(A.thr-48); vw.px(x,y,q(FG,0.78-t*0.28+(fbm(x,y*1.5,9,4)-0.5)*0.12,x,y)); });
  for (y=60;y<101;y++) for (x=57;x<=68;x++){ var c=(((x-57)%3===0)||((y-60)%4===0))?P.n3:P.x3; if (hash(x,y)<0.3) c=P.n4; vw.px(x,y,c); }        // hinteres Hochhaus, kaum zu sehen
  for (y=50;y<104;y++) for (x=40;x<=53;x++){ var c2=P.n2; if ((y-50)%5===0) c2=P.n1; else if (((x-41)%4===1||(x-41)%4===2)&&(y-50)%5<3) c2=P.n1; if (x===53) c2=P.n1; if (x===52) c2=P.n3; vw.px(x,y,c2); }   // vorderes Hochhaus mit Loggien
  vw.px(43,62,P.x4); vw.px(47,77,P.x4);                                                                                                    // zwei Fenster
  for (y=104;y<113;y++) for (x=40;x<=68;x++) vw.px(x,y,q(R('n1 n2 n3'),0.35+(y-104)/9*0.35+(hash(x,y)-0.5)*0.2,x,y));                         // Hofboden
  for (x=55;x<=63;x++){ vw.px(x,99,P.n1); } [55,59,63].forEach(function(px){ vw.vl(px,99,105,P.n1); }); vw.hl(55,63,102,P.n1);                 // Klettergerüst
  vw.vl(66,86,105,P.n1); vw.px(66,85,P.x4); vw.px(65,85,P.n3); vw.px(67,85,P.n3);                                                           // Laterne im Nebel
  for (y=88;y<104;y++){ var tx=46+Math.round(Math.sin(y*0.4)*0.6); vw.px(tx,y,P.n1); } [[-4,-3],[-3,-6],[3,-5],[4,-2]].forEach(function(o){ vw.line(46,92,46+o[0],92+o[1],P.n1); });   // kahler Baum
  forView(function(x,y){ var f=Math.sin(y*0.33+x*0.05)+Math.sin(y*0.12-x*0.03); if (f>1.15 && bayer(x,y)<0.55) vw.px(x,y,M.UP[w.get(x,y)]); }); }   // Nebelbänke
// Kapitel 3 (Mostar): Mate – ein Bussteig unter einem Blechdach, ein Reisebus wartet mit hellen Fenstern
function viewMate(w,vw){ var x, y, bx0=47, bx1=60, bt=70, bb=103;
  forView(function(x,y){ var c; if (y<60) c=q(R('k1 k2 n0 n1'),0.12+(y-48)/12*0.6+(fbm(x,y*2,8,7)-0.5)*0.1,x,y);
    else if (y<106) c=q(R('k1 k2 n0'),0.4+(fbm(x,y,6,3)-0.5)*0.25,x,y);
    else { c=q(R('n1 n2 n3'),0.4+(y-106)/8*0.35+(hash(x>>1,y)-0.5)*0.2,x,y); if (y===106) c=P.x3; }                           // Bussteig mit heller Kante
    vw.px(x,y,c); });
  for (x=40;x<=68;x++){ vw.px(x,60,P.n2); vw.px(x,61,P.n1); vw.px(x,62,P.k1); } vw.hl(45,63,63,P.x5); vw.hl(46,62,64,P.x3);   // Blechdach mit Leuchtröhre
  vw.vl(43,63,105,P.n1); vw.vl(44,63,105,P.k2);                                                                                // Stütze
  // der Reisebus, die Front leicht schräg: Zielanzeige, große Scheibe, Scheinwerfer, Stoßstange; rechts die Flanke mit Fenstern
  for (y=bt;y<=bb;y++) for (x=bx0;x<=bx1;x++){ var c=(x===bx0)?P.n4:P.n2;
    if (y===bt) c=P.n3; else if (y===bt+2) c=(x>bx0 && x<bx1)?(((x+y)%2)?P.y4:P.y2):P.n2;                                     // Zielanzeige, ohne Namen lesbar
    else if (y>bt+3 && y<bt+19 && x>bx0 && x<bx1){ c=P.k2; if (x-bx0===y-bt-4 || x-bx0===y-bt-3) c=P.n3; }                    // Frontscheibe mit Spiegelung
    else if (y===bb-9 && (x===bx0+2||x===bx0+3||x===bx1-3||x===bx1-2)) c=P.x5;                                               // Scheinwerfer
    else if (y>bb-4) c=(y===bb-3)?P.n3:P.k2;
    vw.px(x,y,c); }
  for (y=bt+1;y<=bb-2;y++) for (x=bx1+1;x<=68;x++){ var c2=(y<bt+3)?P.n1:P.n0; if (y>bt+4 && y<bt+15 && (x-bx1)%4!==0) c2=(y<bt+7)?P.y3:P.y2; if (y>bb-6) c2=P.k2; vw.px(x,y,c2); }   // Flanke, Fenster mit warmem Licht
  vw.ellipse(bx1+4,bb-1,2.2,2.2,P.k1); vw.px(bx1+4,bb-1,P.n2);
  for (y=bb+1;y<=bb+3;y++) for (x=bx0-1;x<=68;x++){ if (bayer(x,y)<0.5-(y-bb)*0.12) vw.px(x,y,P.k1); }                         // Schatten auf dem Steig
  for (y=92;y<112;y++) for (x=bx0-4;x<=bx1+6;x++){ var d=Math.hypot(x-54,(y-100)*1.4); if (d<9 && d>4 && bayer(x,y)<(1-d/9)*0.4){ var c0=w.get(x,y); if (c0===P.n1||c0===P.n2) vw.px(x,y,M.UP[c0]); } } }
// Kapitel 3 (Skela): Bato – ein Flussufer im Morgengrauen: Nebel überm Wasser, drüben Hügel, eine Weide, Schilf, das Fährseil quer über den Fluss
function viewBato(w,vw){ var x, y, k, hz=91;
  forView(function(x,y){ var c; if (y<hz){ var t=(y-48)/(hz-48); c=q(R('n0 n1 v1 v2 v3 x3 x4'),0.06+Math.pow(t,1.25)*0.86+(fbm(x*0.8,y*2.2,7,9)-0.5)*0.12,x,y); }
    else if (y<106){ var d=(y-hz)/(106-hz), s=Math.sin(x*0.8+y*1.9)+Math.sin(x*0.27-y*0.7); c=q(R('n1 n2 v2 x2 x3 x4'),0.78-d*0.5+s*0.07,x,y); }
    else c=q(R('k1 k2 n0 n1'),0.45+(hash(x>>1,y)-0.5)*0.4,x,y);
    vw.px(x,y,c); });
  for (x=40;x<=68;x++){ var hh=Math.round(2+Math.sin(x*0.23+1.3)*1.6+fbm(x,2,8,3)*3); for (y=hz-hh;y<hz;y++) vw.px(x,y,y===hz-hh?P.n2:P.n1); }   // Hügel drüben
  forView(function(x,y){ if (y>=hz-1 && y<hz+6 && bayer(x,y)<0.4-Math.abs(y-hz-2)*0.06) vw.px(x,y,P.v3); });                               // Nebel überm Wasser
  for (y=hz+2;y<105;y+=2){ var gx=57+Math.round(Math.sin(y*1.3)*1.5); vw.hl(gx-1,gx+1,y,y<hz+7?P.x5:P.x4); }                                  // Widerschein des hellen Himmels
  for (x=40;x<=68;x++){ if (x%2===0) vw.px(x,Math.round(83+(x-40)*0.14),P.n1); }                                                             // das Fährseil drüben
  vw.vl(64,84,106,P.k2); vw.vl(65,85,106,P.n0); vw.px(64,83,P.n1);                                                                           // ein Pfosten am Ufer
  for (y=74;y<107;y++) vw.px(46+Math.round((y-74)*0.06),y,P.k2);                                                                              // Weide links
  for (k=0;k<7;k++){ var ax=42+k*2.2; for (y=72+k%3;y<92+(k*3)%7;y++) if ((y+k)%2) vw.px(Math.round(ax+Math.sin(y*0.3)*0.6),y,k%2?P.n0:P.k2); }
  for (x=40;x<=68;x+=2){ var rh=3+Math.floor(hash(x,7)*6); vw.vl(x,106-rh,106,hash(x,3)<0.5?P.k2:P.n0); } }                                // Schilf vorn

// ---------------------------------------------------------------- Stücke der Orte, an die die Geister gebunden waren
var PROPS={
  ivka:{ r:[230,95,30,29], st:[222,126,'R'], foot:[228,0,260,123] },
  luka:{ r:[225,84,40,40], st:[218,126,'R'], foot:[226,0,265,123] },
  bruno:{ r:[228,89,36,35], st:[220,126,'R'], foot:[228,0,264,123] },
  // Kapitel 2
  tomaz:{ r:[229,75,35,49], st:[221,126,'R'], foot:[228,0,264,123] },
  ivan:{ r:[226,88,40,36], st:[219,126,'R'], foot:[226,0,265,123] },
  zora:{ r:[227,88,38,36], st:[220,126,'R'], foot:[227,0,265,123] },
  // Kapitel 3: Mates Bank mit Feigenkübel und Schild; Batos Ponton am Seil (groß: Marko steht vorn am Ponton und fasst das Seil an der Rolle)
  mate:{ r:[226,68,64,56], st:[220,126,'R'], foot:[228,0,286,123] },
  bato:{ r:[224,80,76,44], st:[252,127,'R'], foot:[226,0,278,123] }
};
var PROP_ANY={ r:[224,68,76,56], st:[218,126,'R'] };     // Vereinigung aller Varianten, falls niemand gesetzt ist
function castShadow(b,cx,by,rx,ry){ for (var y=by-1;y<=by+ry+1;y++) for (var x=Math.floor(cx-rx-2);x<=cx+rx+2;x++){ var k=y*W+x; if (x<0||x>=W||y>=H||SID[k]<0) continue;
  var dx=(x-cx)/rx, dy=(y-by)/ry, d=dx*dx+dy*dy; if (d<1 && bayer(x,y)<(1-d)*1.2) b.d[k]=M.DN[b.d[k]]; } }
// Ivka: zwei Kaisteine der Riva mit einem gusseisernen Poller, die Kappe von Händen blank gerieben; kein Tau mehr daran
function propIvka(b,w){ var x, y, x0=232, x1=257, ty=107, fy=112, by=121, jx=245;
  castShadow(b,249,123,15,3.5);
  for (y=ty;y<=by;y++) for (x=x0;x<=x1;x++){ var c, top=y<fy, lt=(x-x0)/(x1-x0);
    if ((x===x0||x===x1||x===jx-1||x===jx+1) && y===ty) continue;                            // abgerundete Kanten
    if (x===jx){ c=top?P.n1:P.n0; }
    else if (top){ c=(y===ty)?P.s6:((y===fy-1)?P.s3:(lt<0.45&&x<jx?P.s5:P.s4)); if (y>ty && hash(x*1.7,y)<0.12) c=P.s3; if (x===x1||x===jx-1) c=(y===ty)?P.s4:P.s3; }
    else { c=(y===fy)?P.m3:(y===by?P.n1:(lt<0.3?P.m3:P.m2)); if (y===by-1 && hash(x,3)<0.5) c=P.m1; if (x===x0) c=(y===fy)?P.s3:P.m3; if (x===x1||x===jx-1) c=P.n1; }
    w.px(x,y,c); }
  w.hl(x0+1,x1-1,ty-1,P.n1); w.px(x0,ty,P.n1); w.px(x1,ty,P.n1); w.vl(x0-1,ty+1,by,P.n1);          // Kontur gegen die Platten dahinter
  w.hl(x0,x1,by+1,P.k1); w.vl(x1+1,fy,by+1,P.k1);
  w.px(238,115,P.m3); w.px(237,116,P.m1); w.px(239,116,P.k2); w.px(238,117,P.k2); w.px(238,114,P.n1);   // Eisenring
  // Poller: Kappe, Hals, Körper, Fuß; links Kaltlicht, rechts Schatten
  var cx=251, prof=[[97,2.5],[98,4],[99,5],[100,5.5],[101,4.5],[102,2.5],[103,3],[104,3.5],[105,3.7],[106,3.8],[107,3.9],[108,4],[109,4.6],[110,5.5]];
  prof.forEach(function(p){ var yy=p[0], hw=p[1], xa=Math.round(cx-hw), xb=Math.round(cx+hw)-1;
    for (var xx=xa;xx<=xb;xx++){ var u=(xx-xa)/Math.max(1,xb-xa), c;
      c=u<0.3?P.m2:(u<0.55?P.m1:(u<0.8?P.m0:P.k2));
      if (yy<=99) c=u<0.45?P.m3:(u<0.75?P.m2:P.m0);                                               // Kappe oben im Gegenlicht
      if (yy===101) c=u<0.3?P.m0:P.k1;                                                              // Unterseite der Kappe
      if (yy===97 && xx>xa && xx<xb) c=P.m4;
      if (xx===xa) c=(yy===101)?P.m1:P.x4; if (xx===xb) c=P.k1;
      w.px(xx,yy,c); } });
  w.hl(cx-3,cx-1,98,P.s6); w.px(cx-2,97,P.l1); w.px(cx,99,P.m4); w.px(cx-4,99,P.m4);              // blank geriebene Kappe
  w.px(cx-1,106,P.t1); w.px(cx+1,108,P.t1);                                                         // Rost
  w.hl(cx-5,cx+4,111,P.k1); }
// Luka: drei Holzstufen der alten Treppe (wie in der Ledana), die ins Nichts führen
function propLuka(b,w){ var x, y, i, x0=229, by=122, run=10, rise=10, N=3;
  castShadow(b,249,123,16,3.5);
  var pts=[[x0,by],[x0,by-rise]]; for (i=0;i<N;i++){ pts.push([x0+i*run,by-(i+1)*rise]); pts.push([x0+(i+1)*run,by-(i+1)*rise]); }
  pts.push([x0+N*run+2,by-N*rise]); pts.push([x0+N*run+2,by-N*rise+6]); pts.push([x0+12,by]);
  w.poly(pts,function(xx,yy){ var g=((xx-x0)+(by-yy)*1.1)|0, c=(g%9===0)?P.w0:((g%9===4&&hash(g,2)<0.7)?P.w2:P.w1); return c; });   // Wange, Maserung schräg
  w.line(x0+12,by,x0+N*run+2,by-N*rise+6,P.k1); w.line(x0+13,by,x0+N*run+2,by-N*rise+7,P.k2);            // Unterkante, darunter ist nichts
  for (i=0;i<N;i++){ var tx=x0+i*run, ty=by-(i+1)*rise;
    w.vl(tx,ty,ty+rise-1,i?P.w3:P.w2); w.vl(tx+1,ty+2,ty+rise-1,P.w2);                                     // Stirnseite der Stufe, zum Licht
    for (y=ty-3;y<ty;y++){ var sh=(y===ty-3)?1:0; for (x=tx-1-sh;x<=tx+run+1-sh;x++){ var c=(y===ty-3)?P.w5:(y===ty-2?P.w4:P.w3); if (x===tx-1-sh) c=P.x4; if (hash(x*1.3,y)<0.1) c=P.w3; w.px(x,y,c); } }
    w.hl(tx-1,tx+run+1,ty,P.w1); w.px(tx-1,ty,P.w3); }
  var ex=x0+N*run+2, ey=by-N*rise; w.px(ex+1,ey-2,P.w4); w.px(ex+1,ey-1,P.w3); w.px(ex+2,ey,P.w1); w.px(ex+1,ey+2,P.w1); w.px(ex+2,ey+3,P.w0); w.px(ex,ey+7,P.w0);   // Splitter
  // Pfosten des Geländers, oben abgebrochen, ein Stück Handlauf
  w.vl(x0+1,by-rise-15,by-rise-1,P.w3); w.vl(x0+2,by-rise-15,by-rise-1,P.w1); w.px(x0+1,by-rise-16,P.w5); w.px(x0+2,by-rise-16,P.w3);
  w.line(x0+3,by-rise-15,x0+10,by-rise-22,P.w3); w.line(x0+3,by-rise-14,x0+10,by-rise-21,P.w1); w.px(x0+11,by-rise-23,P.w4); w.px(x0+11,by-rise-21,P.w0); }
// Bruno: ein Stück Rezeption aus dunklem Holz mit Marmorplatte, Gästebuch und Messingglocke; links abgebrochen
function propBruno(b,w){ var x, y, x0=231, x1=261, top=97, by=122;
  castShadow(b,250,123,18,3.5);
  for (y=top+4;y<=by;y++){ var brk=x0+Math.round(Math.abs(Math.sin(y*1.7))*2+(hash(y,3)<0.3?1:0));
    for (x=brk;x<=x1;x++){ var c=P.w1, px1=x0+4, px2=x0+13, qx1=x0+17, qx2=x1-3, py1=top+7, py2=by-6, inA=(x>=px1&&x<=px2), inB=(x>=qx1&&x<=qx2), inP=(inA||inB)&&y>=py1&&y<=py2;
      if (inP){ c=P.w2; if (y===py1||x===px1||x===qx1) c=P.w0; else if (y===py2||x===px2||x===qx2) c=P.w3; else if (y===py1+1||x===px1+1||x===qx1+1) c=P.w1; }
      if (y===top+4) c=P.w0; if (y===top+5) c=P.w3; if (y>=by-3) c=(y===by-3)?P.w3:P.w0;
      if (x===brk) c=(y%3===0)?P.e2:P.w0; else if (x===brk+1) c=(y%4===1)?P.x4:P.w3; if (x===x1) c=P.k1;
      if (c===P.w1 && hash(x,y*2)<0.08) c=P.w0;
      w.px(x,y,c); } }
  for (y=top;y<top+4;y++) for (x=x0-1;x<=x1+1;x++){ if (x<x0+2 && y>top+1) continue; var c2=(y===top)?P.m4:(y===top+1?P.m3:(y===top+2?P.m1:P.k2)); if (x===x1+1) c2=P.k1; if (x<=x0+1) c2=(y===top)?P.s5:P.m3; if (y===top+1 && hash(x*1.7,y)<0.15) c2=P.m2; w.px(x,y,c2); }
  // Gästebuch (aufgeschlagen) und Stift
  w.hl(236,242,96,P.s3); w.hl(236,238,95,P.s5); w.hl(240,242,95,P.s4); w.px(239,95,P.m2); w.px(239,96,P.m1); w.px(237,95,P.m3); w.px(241,95,P.m3); w.line(244,96,247,95,P.k1);
  // Messingglocke
  w.hl(250,257,96,P.y1); w.hl(251,256,95,P.y3); w.hl(251,256,94,P.y3); w.hl(252,255,93,P.y4); w.px(252,94,P.y5); w.px(252,93,P.l0); w.px(253,93,P.y5); w.px(256,94,P.y2); w.px(255,93,P.y3); w.px(256,95,P.y2);
  w.px(253,92,P.y3); w.px(254,92,P.y2); w.px(253,91,P.y5); w.px(254,91,P.y3); }
// Tomaž: ein Pfeiler aus Steinquadern, oben abgebrochen, mit dem Zifferblatt der Sahat-kula (arabische Ziffern, zwei Zeiger)
var AR=[['#','#','#'],['##','#.','#.'],['###','#..','#..'],['##','#.','##'],['.#.','#.#','.#.'],['##','.#','.#'],['#.#','#.#','.#.'],['.#.','#.#','#.#'],['##','##','.#'],['#..','#.#','#..'],['#.#','#.#','#.#'],['#.##','#.#.','#.#.']];
var CLK={x:245,y:93,r:12};
function propTomaz(b,w,S){ var x, y, x0=231, x1=259, top=77, by=122, cx=CLK.x, cy=CLK.y;
  castShadow(b,249,123,17,3.5);
  for (y=top;y<=by;y++) for (x=x0;x<=x1;x++){ var brk=top+Math.round(Math.abs(Math.sin(x*0.9+1))*2.5+(hash(x,7)<0.3?1:0)); if (y<brk) continue;
    var row=Math.floor((y-top)/7), off=(row%2)*7, col=Math.floor((x-x0+off)/14), jx=((x-x0+off)%14===0), jy=((y-top)%7===0);
    var v=0.5+(hash(col,row)-0.5)*0.12+(x<cx?0.06:-0.04)-(y>by-4?0.1:0)+0.1*Math.exp(-Math.pow((x-LX)/80,2)), c=(jx||jy)?P.n1:q(STONE,v,x,y);
    if (y===brk) c=P.s5; else if (y===brk+1) c=P.s4; if (x===x0) c=(y===brk)?P.s5:P.x4; if (x===x1) c=P.n1; w.px(x,y,c); }
  for (y=top+3;y<=by;y++){ w.px(x1+1,y,P.n0); w.px(x1+2,y,(y>top+5)?P.k2:P.n0); }                                         // rechte Seitenfläche im Schatten
  w.hl(x0-1,x1+2,108,P.s4); w.hl(x0-1,x1+2,109,P.n1); w.hl(x0-2,x1+3,by,P.n1); w.hl(x0-2,x1+3,by+1,P.k1); w.vl(x0-2,108,by,P.n1);   // Gesims, Sockel
  for (y=cy-CLK.r;y<=cy+CLK.r;y++) for (x=cx-CLK.r;x<=cx+CLK.r;x++){ var d=Math.hypot(x-cx,y-cy); if (d>CLK.r+0.4) continue;
    var c2=d>CLK.r-0.6?P.n1:(d>CLK.r-1.6?P.m3:(d>CLK.r-2.2?P.m2:P.s5)); if (d<CLK.r-2.2 && (x-cx)+(y-cy)>7) c2=P.s4; w.px(x,y,c2); }               // Zifferblatt
  AR.forEach(function(g,i){ var a=(i+1)/12*Math.PI*2, gw=g[0].length, gx=Math.round(cx+Math.sin(a)*7.6-(gw-1)/2), gy=Math.round(cy-Math.cos(a)*7.6-1);
    for (var j=0;j<3;j++) for (var k=0;k<gw;k++) if (g[j][k]==='#') w.px(gx+k,gy+j,P.n0); });                                             // arabische Ziffern
  var set=!!(S&&S.clockSet), hr=set?7:2+40/60, ha=hr/12*Math.PI*2, ma=(set?0:40)/60*Math.PI*2;   // Zeiger: sieben, oder zwanzig vor drei (18:55 am 14.11.1972, Sonnenuntergang 16:16)
  w.line(cx,cy,Math.round(cx+Math.sin(ma)*8),Math.round(cy-Math.cos(ma)*8),P.k1); w.line(cx,cy,Math.round(cx+Math.sin(ha)*5.4),Math.round(cy-Math.cos(ha)*5.4),P.k1); w.px(cx+Math.round(Math.sin(ha)*1.5),cy-Math.round(Math.cos(ha)*1.5),P.k1);
  w.px(cx,cy,P.y3); w.px(cx+1,cy,P.y2); }
// Ivan: ein Lesetisch aus dunklem Holz mit grüner Bankerlampe und einem aufgeschlagenen Buch; S.lineDone: die Lampe leuchtet heller
function propIvan(b,w,S){ var x, y, x0=228, x1=263, ty=105, by=122, lit=!!(S&&S.lineDone), lx=255;
  castShadow(b,247,123,18,3.5);
  [x0+2,x1-4].forEach(function(px){ for (y=ty+4;y<=by;y++){ var bl=((y-ty)%6===2)?1:0; for (x=px-bl;x<=px+2+bl;x++) w.px(x,y,x===px-bl?P.w3:(x===px+2+bl?P.k1:P.w1)); } });   // gedrechselte Beine
  w.hl(x0+5,x1-5,by-6,P.w2); w.hl(x0+5,x1-5,by-5,P.w0);                                                                                  // Querstrebe
  for (y=ty;y<ty+4;y++) for (x=x0;x<=x1;x++){ var c=(y===ty)?P.w4:(y===ty+1?P.w3:(y===ty+2?P.w2:P.w0)); if (x===x0) c=(y===ty)?P.w4:P.x4; if (x===x1) c=P.k1; w.px(x,y,c); }   // Platte
  // aufgeschlagenes Buch: zwei Seiten, zur Mitte hin abfallend, Zeilen
  var bx=233; for (x=bx;x<bx+16;x++){ var u=x-bx, mid=Math.abs(u-7.5), top=ty-2-Math.round(mid*0.3); for (y=top;y<ty;y++){ var c3=(y===top)?P.s6:(((y-top)%2===1&&u>1&&u<14&&Math.abs(u-7.5)>1)?P.n3:P.s5); if (mid<0.6) c3=P.s3; w.px(x,y,c3); } }
  w.hl(bx-1,bx+16,ty-1,P.r1); w.px(bx-1,ty-2,P.r1); w.px(bx+16,ty-2,P.r1);
  // Bankerlampe: Messingfuß, Stiel, grüner Glasschirm
  w.hl(lx-3,lx+3,ty-1,P.y1); w.hl(lx-2,lx+2,ty-2,P.y3); w.vl(lx,ty-9,ty-3,P.y2); w.px(lx+1,ty-7,P.y1); w.vl(lx+3,ty-8,ty-5,P.y2);
  for (y=ty-14;y<ty-9;y++){ var hw=2+(y-(ty-14)); for (x=lx-hw;x<=lx+hw;x++){ var c2=lit?((y===ty-14||x<lx-hw+2)?P.g5:P.g4):((y===ty-14||x<lx-hw+2)?P.g4:P.g3); if (x===lx+hw) c2=lit?P.g3:P.g2; w.px(x,y,c2); } }
  w.hl(lx-6,lx+6,ty-9,lit?P.y5:P.y3); w.px(lx-6,ty-9,lit?P.l0:P.y2);
  // warmer Lichtkegel auf Buch und Platte
  for (y=ty-8;y<=ty+1;y++) for (x=lx-17;x<=lx+7;x++){ var dl=Math.hypot((x-lx+3)/(lit?14:10),(y-ty)/(lit?6:4.5)); if (dl>1||bayer(x,y)>(1-dl)*(lit?0.95:0.6)) continue; var c4=w.get(x,y); if (c4===T||c4===P.k0) continue; if (c4===P.s5||c4===P.s6||c4===P.n3) w.px(x,y,lit?P.l0:P.y5); else if (c4===P.w4||c4===P.w3) w.px(x,y,lit?P.y4:P.w5); } }
// Zora: eine alte Schulbank (Pult mit schräger Platte, gusseiserne Wangen, Sitz davor) mit einer Handglocke; S.rung: die Glocke ist fort
function propZora(b,w,S){ var x, y, x0=230, x1=262, ty=103, by=122, rung=!!(S&&S.rung);
  castShadow(b,247,123,18,3.5);
  [x0+1,x1-3].forEach(function(px){ for (y=ty+1;y<=by;y++){ w.px(px,y,P.k2); w.px(px+1,y,P.m0); }                                         // gusseiserne Wangen mit Bogen
    for (var k=0;k<6;k++){ var ax=px+(px<246?1:-1)*(1+Math.round(Math.sin(k/5*Math.PI)*3)); w.px(ax,by-7+k,P.m0); } w.hl(px-2,px+3,by,P.k1); });
  for (y=ty+4;y<ty+13;y++) for (x=x0+2;x<=x1-2;x++){ var c=((x-x0)%5===0)?P.w1:P.w2; if (y===ty+4) c=P.w3; if (y===ty+12) c=P.w0; w.px(x,y,c); }   // Vorderwand
  for (x=x0-1;x<=x1+1;x++){ var sl=Math.round((x-x0)*0.04); for (y=ty-sl;y<ty+4-sl;y++){ var c2=(y===ty-sl)?P.w5:(y===ty+1-sl?P.w4:(y===ty+3-sl?P.w1:P.w3)); if (x===x0-1) c2=P.x4; if (x===x1+1) c2=P.k2; if (hash(x*1.7,y)<0.08) c2=P.w2; w.px(x,y,c2); } }   // schräge Pultplatte
  w.hl(x0+2,x1-2,ty+4,P.w1);                                                                                                            // Stiftrinne
  w.rect(x0+6,ty,3,2,P.k1); w.px(x0+6,ty,P.y2); w.px(x0+8,ty+1,P.y1);                                                                  // Tintenfass
  w.px(x0+14,ty+1,P.w1); w.px(x0+15,ty+2,P.w1); w.px(x0+18,ty+1,P.w1);                                                                  // eingeritzte Kerben
  for (x=x0+3;x<=x1-3;x++){ w.px(x,by-4,P.w3); w.px(x,by-3,P.w1); } w.hl(x0+3,x1-3,by-2,P.k2);                                           // Sitz davor
  if (!rung){ var gx=251, gy=ty-1;                                                                                                       // Handglocke aus Messing mit Holzgriff
    w.vl(gx,gy-11,gy-7,P.w2); w.vl(gx+1,gy-11,gy-7,P.w1); w.rect(gx-1,gy-13,4,2,P.w3); w.hl(gx-1,gx+2,gy-13,P.w4);
    [[gy-6,1],[gy-5,2],[gy-4,2],[gy-3,3],[gy-2,3],[gy-1,4]].forEach(function(r){ for (x=gx-r[1];x<=gx+1+r[1];x++){ var u=(x-(gx-r[1]))/(2*r[1]+1), c5=u<0.25?P.y4:(u<0.55?P.y3:(u<0.85?P.y2:P.y1)); if (r[0]===gy-1) c5=(u<0.5)?P.y2:P.y1; w.px(x,r[0],c5); } });
    w.px(gx-1,gy-5,P.y5); w.px(gx-2,gy-3,P.y5); w.px(gx,gy,P.y0); w.px(gx+1,gy,P.y0); }
  else { for (x=248;x<=255;x++) if (hash(x,4)<0.7) w.px(x,ty-1,P.w4); } }                                                    // nur ein heller Ring, wo sie stand
// Kapitel 3, Mate: eine Bushaltebank mit Betonfüßen, daneben ein Kübel mit einem kleinen Feigenbaum (zwei reife Feigen), dahinter ein Haltestellenschild ohne Namen
function propMate(b,w,S){ var x, y, k, x0=229, x1=259, sy=108, by=122, tx=269, px=282;
  castShadow(b,257,123,28,3.5);
  // Lehne: zwei Latten auf Eisenstützen; Sitz: Bohlen, vorn die Kante; Füße aus Beton
  [x0+3,x1-4].forEach(function(ux){ w.vl(ux,96,sy-1,P.k2); w.vl(ux+1,96,sy-1,P.n0); });
  [[98,99],[102,103]].forEach(function(r){ for (y=r[0];y<=r[1];y++) for (x=x0+1;x<=x1-1;x++){ var c=(y===r[0])?P.w4:P.w2; if (x===x0+1) c=P.x4; if (x===x1-1) c=P.w0; if (y===r[0] && hash(x*1.7,y)<0.1) c=P.w3; w.px(x,y,c); } });
  for (y=sy;y<sy+4;y++) for (x=x0;x<=x1;x++){ var c2=(y===sy)?P.w5:(y===sy+1?P.w4:(y===sy+2?P.w2:P.w1)); if ((x-x0)%10===0 && y>sy) c2=P.w1; if (x===x0) c2=(y===sy)?P.w5:P.x4; if (x===x1) c2=P.k1; w.px(x,y,c2); }
  [[x0+1,x0+6],[x1-6,x1-1]].forEach(function(f){ for (y=sy+4;y<=by;y++) for (x=f[0];x<=f[1];x++){ var c3=(x===f[0])?P.x4:(x===f[1]?P.n0:(y>by-2?P.n1:(x<f[0]+3?P.m3:P.m2))); w.px(x,y,c3); } });
  // Feigenkübel aus Beton, Erde; ein kleiner Feigenbaum mit großen Blättern
  for (y=110;y<=by;y++){ var ins=(y>by-2)?1:0; for (x=tx-7+ins;x<=tx+7-ins;x++){ var c4=(y===110)?P.m4:((x<=tx-6+ins)?P.x4:((x>=tx+6-ins)?P.n0:(y<113?P.m3:P.m2))); w.px(x,y,c4); } }
  w.hl(tx-6,tx+6,111,P.w0); w.hl(tx-5,tx+5,112,P.k2);
  w.vl(tx,92,110,P.w2); w.vl(tx+1,96,110,P.w1); w.line(tx,98,tx-5,92,P.w2); w.line(tx+1,96,tx+6,90,P.w1); w.line(tx,93,tx+2,87,P.w2);    // Stamm und Äste
  [[tx-8,90],[tx-4,86],[tx+2,84],[tx+7,87],[tx+9,92],[tx-6,96],[tx+5,97]].forEach(function(l,i){ var lx=l[0], ly=l[1];               // Feigenblätter: drei Lappen
    w.ellipse(lx,ly,2.6,2.2,function(xx,yy){ return (xx<lx-1)?P.g4:((yy>ly)?P.g2:P.g3); }); w.px(lx-2,ly-2,P.g3); w.px(lx+2,ly-2,P.g2); w.px(lx,ly+2,P.g2); w.px(lx,ly,P.g1); if (i%3===0) w.px(lx-3,ly,P.x4); });
  w.ellipse(tx-3,99,1.4,1.7,P.v1); w.px(tx-4,98,P.v3); w.ellipse(tx+4,94,1.3,1.6,P.v1); w.px(tx+3,93,P.v2);                          // zwei reife Feigen
  // Haltestellenschild: Mast, blaues Schild mit einem kleinen Bus, darunter ein leeres Namensfeld
  w.vl(px,72,by,P.m3); w.vl(px+1,72,by,P.m1); w.px(px-1,by,P.n1); w.hl(px-1,px+2,by+1,P.k1); w.px(px,72,P.x4);
  for (y=70;y<=81;y++) for (x=px-6;x<=px+7;x++){ var c5=(y===70||x===px-6)?P.b3:((y===81||x===px+7)?P.b0:P.b1); w.px(x,y,c5); }
  w.rect(px-3,73,8,4,P.s6); w.hl(px-3,px+4,77,P.s4); w.px(px-2,78,P.k1); w.px(px+3,78,P.k1); w.hl(px-2,px+3,74,P.n1);            // der kleine Bus
  for (y=83;y<=88;y++) for (x=px-5;x<=px+6;x++) w.px(x,y,(y===83||x===px-5)?P.s6:((y===88||x===px+6)?P.s3:P.s5));                  // Namensfeld, leer
  w.px(px-6,82,P.k1); w.px(px+7,82,P.k1); }
// Kapitel 3, Bato: ein Holzponton mit Geländer auf zwei Schwimmern; ein Stahlseil läuft vom Anker auf den Platten über eine Rolle schräg hinauf ins Licht
var BCAB={x0:LX, y0:LY, x1:293, y1:115};                                                     // Seil: vom Licht bis zum Ring am Anker
function cabY(x){ return BCAB.y0+(BCAB.y1-BCAB.y0)*(x-BCAB.x0)/(BCAB.x1-BCAB.x0); }
function propBato(b,w,S){ var x, y, x0=226, x1=276, dy=109, by=122, rx=262;
  castShadow(b,255,123,30,3.5);
  // zwei Schwimmer aus Blech, darauf das Deck aus Bohlen
  [[x0+2,x0+22],[x1-22,x1-2]].forEach(function(f){ for (y=dy+4;y<=by-1;y++){ var ins=(y>by-3)?2:((y>by-4)?1:0); for (x=f[0]+ins;x<=f[1]-ins;x++){ var c=(y===dy+4)?P.m2:(x===f[0]+ins?P.x4:(x===f[1]-ins?P.k1:(y<dy+7?P.m1:P.m0))); if (y===dy+8 && (x-f[0])%5===0) c=P.k2; w.px(x,y,c); } } });
  for (y=dy;y<dy+4;y++) for (x=x0;x<=x1;x++){ var c2=(y===dy)?P.w5:(y===dy+1?P.w4:(y===dy+2?P.w3:P.w1)); if (y>dy && (x-x0)%9===0) c2=P.w1; if (x===x0) c2=(y===dy)?P.w5:P.x4; if (x===x1) c2=P.k1; if (y===dy && hash(x*1.3,3)<0.12) c2=P.w3; w.px(x,y,c2); }
  w.hl(x0,x1,dy+4,P.k1);
  // Geländer an der hinteren Kante: Pfosten und Handlauf
  [x0+3,x0+19,x0+35,x1-3].forEach(function(p){ w.vl(p,dy-12,dy-1,P.w3); w.vl(p+1,dy-12,dy-1,P.w1); });
  w.hl(x0+3,x1-2,dy-12,P.w4); w.hl(x0+3,x1-2,dy-11,P.w2); w.hl(x0+3,x1-2,dy-6,P.w2); w.px(x0+3,dy-12,P.x4);
  // der Anker: ein Betonblock mit Eisenring rechts auf den Platten
  for (y=112;y<=121;y++) for (x=287;x<=297;x++){ var c3=(y===112)?P.m4:(x===287?P.x4:(x===297?P.n0:(y>119?P.n1:P.m2))); if (hash(x,y*2)<0.1) c3=P.m1; w.px(x,y,c3); }
  w.hl(286,298,122,P.k1); w.ellipse(293,114,1.6,1.6,P.k2); w.px(293,114,P.m2);
  // das Stahlseil: vom Ring über die Rolle hinauf; vor dem Licht ein dunkler Strich mit hellem Rand, im Licht hell, bis es darin verschwindet
  for (x=BCAB.x1;x>=LX;x--){ var yy=cabY(x), yi=Math.round(yy), I=lightI(x,yi), lo=(yy-yi>0.15);
    if (I>0.86) break;
    if (I<0.5){ w.px(x,yi,P.m1); w.px(x,yi-1,P.x4); if (lo) w.px(x,yi+1,P.k2); }
    else if (I<0.72){ w.px(x,yi,P.n1); w.px(x,yi-1,P.x5); }
    else if (bayer(x,yi)<1-(I-0.72)/0.14) w.px(x,yi,P.x6); }
  var ry=Math.round(cabY(rx));                                                               // Rolle auf einem kurzen Pfosten, daran hängt der Ponton
  w.vl(rx,ry+2,dy-1,P.m3); w.vl(rx+1,ry+2,dy-1,P.m1); w.ellipse(rx+0.5,ry+0.5,2.1,2.1,function(xx,yy){ return (xx<rx)?P.m3:P.m1; }); w.px(rx,ry,P.x5); w.px(rx+1,ry+1,P.k2); }
function propPaint(b,S){ var w=RW(b), who=whoOf(S); if (who==='ivka') propIvka(b,w); else if (who==='luka') propLuka(b,w); else if (who==='bruno') propBruno(b,w);
  else if (who==='tomaz') propTomaz(b,w,S); else if (who==='ivan') propIvan(b,w,S); else if (who==='zora') propZora(b,w,S);
  else if (who==='mate') propMate(b,w,S); else if (who==='bato') propBato(b,w,S); }

// ---------------------------------------------------------------- lose, schwebende Steine (wippen in dynamic um 1 px)
var FLOAT=[{x:8,y:113,w:12,h:7,s:1.05,p:0.4},{x:18,y:130,w:8,h:5,s:1.3,p:2.2},{x:2,y:99,w:6,h:4,s:0.9,p:4.1},{x:22,y:95,w:4,h:3,s:1.4,p:0.9},
  {x:303,y:103,w:11,h:6,s:0.95,p:1.3},{x:310,y:121,w:7,h:5,s:1.2,p:3.4},{x:296,y:136,w:9,h:5,s:1.1,p:5.2}];
var FSPR=[];
function floatPaint(b){ var w=RW(b); FSPR.length=0;
  FLOAT.forEach(function(f,i){ var ww=f.w, hh=f.h, bg=new Uint8Array(ww*(hh+1)), fg=new Uint8Array(ww*hh).fill(T), tH=Math.max(2,Math.round(hh*0.4)), side=f.x<LX?1:-1, j, ii;
    for (j=0;j<=hh;j++) for (ii=0;ii<ww;ii++){ var gc=b.get(f.x+ii,f.y+j); bg[j*ww+ii]=gc===T?P.k0:gc; }
    for (j=0;j<hh;j++){ var a, e;
      if (j<tH){ a=Math.round((tH-1-j)*0.7); e=ww-1-Math.round(j*0.4); }
      else { var t=(j-tH+1)/(hh-tH+1); a=Math.round(t*ww*0.32+hash(i,j)*1.5); e=ww-1-Math.round(t*ww*0.38+hash(i,j+9)*1.5); }
      for (ii=a;ii<=e;ii++){ var c, xx=f.x+ii, yy=f.y+j, u=(ii-a)/Math.max(1,e-a);
        if (j<tH){ var v=0.5+(j===0?0.16:0)+(side>0?u:1-u)*0.12+(hash(xx,yy)-0.5)*0.08; c=q(STONE,v,xx,yy); }
        else { var v2=0.36-(j-tH)*0.05+((side>0)?(u>0.7?0.12:0):(u<0.3?0.12:0)); c=q(FACE,v2,xx,yy); }
        fg[j*ww+ii]=c; } }
    for (j=0;j<hh;j++) for (ii=0;ii<ww;ii++){ var c3=fg[j*ww+ii]; if (c3!==T) w.px(f.x+ii,f.y+j,c3); }
    FSPR.push({x:f.x,y:f.y,w:ww,h:hh,bg:bg,fg:fg,s:f.s,p:f.p}); }); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0);
  voidPaint(b); platPaint(b); archPaint(b,S); propPaint(b,S); floatPaint(b); shimBuild();
  return b; }
// Pixel, die beim Schimmern ihre Farbe wechseln können: freie Lichtpixel nahe einer Stufengrenze
var SHIM=new Int32Array(W*H), SHC=new Uint8Array(W*H), NSHIM=0, SHV=0, SHT=-1;
function shimBuild(){ NSHIM=0; SHV++; for (var y=LB[1];y<=LB[3];y++) for (var x=LB[0];x<=LB[2];x++){ var k=y*W+x; if (REG[k]) continue; var I=LI[k]; if (I<0.16||I>1.06) continue;
  var m=I*0.04+0.034, i; for (i=0;i<LST.length;i++) if (Math.abs(I-LST[i])<m){ SHIM[NSHIM++]=k; break; } } }

// ---------------------------------------------------------------- jedes Bild: Schimmer im Licht, aufsteigende Funken, wippende Steine
var SX=new Float32Array(LB[2]-LB[0]+1);
function dyn(fb,view,S,GS){ var t=view.t, cam=view.cam|0, x, y, k, i;
  var tick=Math.floor(t*15);                                                 // 15-mal je Sekunde neu berechnet, sonst nur kopiert
  if (tick!==SHT || SHV!==dyn.v){ SHT=tick; dyn.v=SHV; var tq=tick/15, ph=Math.floor(tq*1.3);    // das Dithermuster kriecht langsam nach oben
    for (x=LB[0];x<=LB[2];x++) SX[x-LB[0]]=Math.sin(x*0.085-tq*0.55)*1.3;
    for (i=0;i<NSHIM;i++){ k=SHIM[i]; y=(k/W)|0; x=k-y*W; var j=Math.min(LUTN-1,(LI[k]*(1+0.035*Math.sin(tq*0.8+y*0.12+SX[x-LB[0]]))*900)|0); SHC[i]=LUTC[j*16+(((y+ph)&3)<<2)+(x&3)]; } }
  if (cam===0 && fb.w===W){ for (i=0;i<NSHIM;i++) fb.d[SHIM[i]]=SHC[i]; }
  else for (i=0;i<NSHIM;i++){ k=SHIM[i]; y=(k/W)|0; x=k-y*W-cam; if (x>=0 && x<fb.w) fb.d[y*fb.w+x]=SHC[i]; }
  for (i=0;i<14;i++){ var sp=3+hash(i,1)*4, yy=Math.round(101-((t*sp+hash(i,2)*96)%96)), xx=Math.round(LX+(hash(i,3)-0.5)*42*(0.5+(101-yy)/120)+Math.sin(t*0.6+i*1.7)*2.5);
    if (yy<4||xx<0||xx>=W) continue; k=yy*W+xx; if (REG[k]) continue; var I2=LI[k], fade=yy<34?(yy-4)/30:1; if (bayer(xx,yy)>fade) continue;
    fb.px(xx-cam,yy,I2>0.75?P.l1:(I2>0.45?P.x6:(I2>0.2?P.x5:P.x3))); }
  for (i=0;i<TWINK.length;i++){ var tw=TWINK[i], a=Math.sin(t*(0.7+i*0.11)+i*2.4); if (a>0.8) fb.px(tw[0]-cam,tw[1],M.UP[M.UP[tw[2]]]); else if (a<-0.8) fb.px(tw[0]-cam,tw[1],M.DN[tw[2]]); }
  for (i=0;i<FSPR.length;i++){ var f=FSPR[i]; if (Math.sin(t*f.s+f.p)<=0) continue; var j, ii, ox=f.x-cam;
    for (j=0;j<=f.h;j++) for (ii=0;ii<f.w;ii++) fb.px(ox+ii,f.y+j,f.bg[j*f.w+ii]);
    for (j=0;j<f.h;j++) for (ii=0;ii<f.w;ii++){ var c=f.fg[j*f.w+ii]; if (c!==T) fb.px(ox+ii,f.y+j+1,c); } }
  // Kapitel 2, Ivan: ist die Zeile übersetzt, schimmern die Seiten des Buchs
  if (S && S.who==='ivan' && S.lineDone){ for (i=0;i<7;i++){ var px=234+Math.round(hash(i,51)*14), py=101+Math.round(hash(i,52)*3), a=Math.sin(t*(2+hash(i,53)*2)+i*1.9); if (a>0.55) fb.px(px-cam,py,a>0.85?P.l1:P.x6); } }
  // Kapitel 3, Bato: ab und zu läuft ein Glanz am Seil hinauf ins Licht
  if (S && S.who==='bato'){ var ph=(t*0.22)%1.6; if (ph<1){ var gx=Math.round(262-ph*(262-LX-16)), gy=Math.round(cabY(gx)); k=gy*W+gx; if (gx>=0 && gx<W && LI[k]<0.86){ fb.px(gx-cam,gy,LI[k]>0.5?P.l1:P.x6); fb.px(gx+1-cam,gy,P.x5); } } } }

// ---------------------------------------------------------------- Lauffläche, Hotspots
function surfOK(x,y){ x|=0; y|=0; if (x<3||x>W-4||y<2||y>H-3) return false; var k=y*W+x; return SID[k]>=0&&SID[k-3]>=0&&SID[k+3]>=0&&SID[k-2*W]>=0&&SID[k+2*W]>=0; }
function walk(x,y,S,GS){ if (y<108||y>138||x<44||x>286) return false; if (!surfOK(x,y)) return false;
  if (x<84 && y<121) return false;                                                           // Tor mit Schwelle
  var p=PROPS[whoOf(S)]; if (p && x>=p.foot[0] && x<=p.foot[2] && y<=p.foot[3]) return false; // Requisit und dahinter
  return true; }
function curWho(){ var g=M.GS, rs=g&&g.rooms&&g.rooms.limbo; return whoOf(rs); }
var MOON=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.58+L*0.14+6, g*0.62+L*0.17+10, b*0.70+L*0.2+28]; });
var spots={ arch:[32,36,46,84], light:[150,8,100,96] }, stands={ arch:[62,124,'L'], light:[184,118,'R'] };
// prop hängt von S.who ab: Getter auf den aktuellen Raumzustand, sonst die Vereinigung aller drei Varianten
Object.defineProperty(spots,'prop',{ enumerable:true, get:function(){ return (PROPS[curWho()]||PROP_ANY).r.slice(); } });
Object.defineProperty(stands,'prop',{ enumerable:true, get:function(){ return (PROPS[curWho()]||PROP_ANY).st.slice(); } });
M.defineArt('limbo',{ width:W, paint:paint, dynamic:dyn, walk:walk,
  actorLut:function(a,S,GS,tod){ return a.ghost?undefined:MOON.a; },           // Lebende im kalten Licht der Leere
  spots:spots, stands:stands,
  propSpot:function(S){ return (PROPS[whoOf(S)]||PROP_ANY).r.slice(); },       // für Logik: r:function(S){ return M.ART.limbo.propSpot(S); }
  propStand:function(S){ return (PROPS[whoOf(S)]||PROP_ANY).st.slice(); },
  actorPos:{ ghost:[214,116,'L'], mala:[178,120,'R'], marko:[88,126,'R'] },
  start:[88,126,'R'], entries:{} });
})(M);
