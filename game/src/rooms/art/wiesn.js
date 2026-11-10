/* ===== rooms/art/wiesn.js — Theresienwiese im Schnee (560 px, scrollend) =====
   Die leere Festwiese: eine riesige weiße Fläche bis zum Horizont, dort die Häuser des Westends (ohne Kirchtürme). Links hinten auf
   der Anhöhe die Ruhmeshalle (dorische Säulenhalle mit Seitenflügeln) und davor die Bavaria auf ihrem Sockel: eine Frau aus
   dunkler Bronze, den Kranz hoch erhoben, neben ihr der Löwe; die große Treppe hinauf. Davor der Hang, auf dem Kinder rodeln
   (gemalt), kahle Bäume am Rand. Vorn der geräumte Weg mit Schneewällen und Laternen, eine Bank, ein Nebenweg führt in die Wiese.
   Fußspuren im Schnee. S.walk: Mias roter Schlitten am Fuß des Hangs.
   Wetter (Kapitel 4): snowlie (klar, kalt), snow, thaw, fog, sun, frost. Geistersicht: auf der leeren Wiese viele blasse Abdrücke
   von Menschenmengen, Zeltdächer und ein Riesenrad, wie ein verblasster Jahrmarkt. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=560, H=144;
var HY=74;                                                 // ferner Rand der Wiese
var HALL={x0:34,x1:196,y0:42,base:58};                     // Ruhmeshalle
var BAV={x:115,base:56,h:42};                              // Bavaria (Fuß der Figur auf dem Sockel)
var PED={x0:105,x1:127,y0:56,y1:70};                       // Sockel
var SLOPE={x0:0,x1:262,top:64,foot:104};                   // Hang
var PATH0=112, PATH1=142;                                  // geräumter Weg (Lauffläche)
var LAMPS=[88,236,384,532];
var BENCH={x0:446,x1:476,by:113};
var SLED={x:172,y:110};
var SIDE={x0:316,x1:344};                                  // Nebenweg in die Wiese (am Weg)
// ---------------------------------------------------------------- kleine Helfer
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
// Dunst und Nebel: nur zu kühlen Grau- und Blautönen mischen (Nebel entsättigt; keine Lavendel-, Geister- oder Hauttöne)
var HZN=null, HZW=null, HZL={}, HZWIDE=false;                 // bei klarem Wetter behält der Dunst die Farbtöne
function hazeLut(col,k){ var key=col+'_'+k+(HZWIDE?'w':''); if (HZL[key]) return HZL[key]; if (!HZN){ HZN=M.PNAME.filter(function(n){ return /^[kmnbc]/.test(n) || n==='s5' || n==='s6'; }); HZW=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); } var q=M.RGB[col], f=k/8; return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZWIDE?HZW:HZN); }
function haze(b,amt,opt){ opt=opt||{}; var col=opt.col, x0=opt.x||0, y0=opt.y||0, w=opt.w||b.w, h=opt.h||b.h, ox=b.ox||0, oy=b.oy||0;
  for (var y=Math.max(0,y0);y<Math.min(b.h,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(b.w,x0+w);x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*b.w+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x+ox,y+oy)<f-i) i++; if (i>0) b.d[k]=(i>=8)?col:hazeLut(col,i)[c]; } }
var SINT=null; function sinT(){ if (SINT) return SINT; SINT=new Float32Array(1024); for (var i=0;i<1024;i++) SINT[i]=Math.sin(i*Math.PI*2/1024); return SINT; }
function fogFront(fb,t,opt){ var y0=opt.y0||0, y1=Math.min(opt.y1||144,144), amt=opt.amt, cam=opt.cam||0, sp=opt.speed||5, L=hazeLut(opt.col,opt.k||2), S=sinT(), K=1024/(Math.PI*2);
  for (var y=y0;y<y1;y++){ var ry=(y-y0)/Math.max(1,y1-y0), band=Math.sin(ry*Math.PI)*amt; if (band<0.03) continue; var o1=(t*sp*0.05+y*0.11)*K, o2=(-t*sp*0.03+y*0.047)*K;
    for (var x=0;x<fb.w;x++){ var wx=x+cam, n=0.5+0.28*S[((wx*0.031*K+o1)|0)&1023]+0.22*S[((wx*0.012*K+o2)|0)&1023], d=band*(n*1.25-0.2); if (d>0.04 && bayer(x,y)<d){ var k=y*fb.w+x, c=fb.d[k]; if (c!==T && c<M.NCOL) fb.d[k]=L[c]; } } } }
function fwOn(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks && M.k4Fireworks(GS)); }
var REG=new Uint8Array(W*H), SNW=new Uint8Array(W*H), RG={sky:0,city:1,hall:2,bav:3,tree:4,slope:5,field:6,path:7,prop:8};
function RW(b){ var o={g:0,s:0,w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; SNW[k]=o.s; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.25+L*0.1, b*0.4+L*0.18+16]; },
  nsnow:function(r,g,b){ var L=lum(r,g,b); return [r*0.24+L*0.14+6, g*0.3+L*0.16+10, b*0.44+L*0.22+28]; },
  dusk:function(r,g,b){ return [r*0.78+16, g*0.58+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=6, A=TF[k]||TF.night, B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.15)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function nkey(tod){ return tod==='night'?'night':(TF[tod]?tod:null); }
function shade(buf,ox,oy,tod,Ls,useSnow){ var key=nkey(tod); if (!key) return; var L=levels(key), LS=levels(tod==='night'?'nsnow':key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy, gk=Y*W+X;
    if (useSnow && REG[gk]===RG.sky) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx((useSnow&&SNW[gk])?LS[i]:L[i],c,X,Y); } }
function halo(b,cx,cy,r,amt){ for (var y=Math.floor(cy-r);y<=cy+r;y++) for (var x=Math.floor(cx-r);x<=cx+r;x++){ if (x<0||y<0||x>=b.w||y>=b.h) continue; var d=Math.hypot(x-cx,(y-cy)*1.15)/r; if (d>1) continue; if (bayer(x,y)<(1-d)*(1-d)*amt){ var k=y*b.w+x; b.d[k]=M.UP[b.d[k]]; } } }

// ---------------------------------------------------------------- Himmel
function paintSky(w,tod,we){ var x, y, i, r=M.rng(61); w.g=RG.sky; w.s=0;
  if (tod!=='night'){
    if (we==='snow'){ var S1=R('m3 m4 s4 s5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(S1,0.2+y/HY*0.75+(fbm(x*0.018,y*0.06,3)-0.5)*0.22,x,y)); return; }
    if (we==='fog'){ var F1=R('m3 m4 n5 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(F1,0.45+y/130+(fbm(x*0.01,y*0.04,5)-0.5)*0.14,x,y)); return; }
    if (we==='thaw'){ var G1=R('m2 m3 m4 s4'); for (y=0;y<H;y++) for (x=0;x<W;x++){ var cv=fbm(x*0.012+3,y*0.07,6); w.px(x,y,ra(G1,0.2+y/HY*0.6+(cv-0.5)*0.5,x,y)); } return; }
    var D=we==='sun'?R('b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(D,(we==='sun'?0.1:0.16)+Math.pow(y/HY,1.25)*0.84,x,y));
    return; }
  var N=R('k0 k1 k2 n0 n1 n2'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N,0.04+Math.pow(y/HY,1.5)*0.75,x,y));
  if (we!=='fog'&&we!=='thaw'&&we!=='snow') for (i=0;i<(we==='frost'?300:200);i++) w.px(Math.floor(r()*W),Math.floor(Math.pow(r(),1.4)*(HY-10)),r()<0.14?P.n5:(r()<0.5?P.n4:P.n3)); }

// ---------------------------------------------------------------- Westend am Horizont (ohne Kirchtürme)
var WINS=[];
function paintCity(w,we){ var x, y, r=M.rng(29); w.g=RG.city; w.s=0; x=250;
  while (x<W){ var bw=10+Math.floor(r()*16), bh=8+Math.floor(r()*9), top=HY-bh, col=[R('s2 s3 s4'),R('e2 e3 e4'),R('t2 t3 t4'),R('m2 m3 m4')][Math.floor(r()*4)];
    for (y=top;y<HY+2;y++) for (var xx=x;xx<Math.min(W,x+bw);xx++){ var c=col[1]; if (xx===x) c=col[2]; if (xx===x+bw-1) c=col[0]; if ((y-top)%4===2 && (xx-x)%3===1 && xx<x+bw-1){ c=P.m1; WINS.push([xx,y,hash(xx,y)]); } w.px(xx,y,c); }
    var rh=2+Math.floor(r()*3); w.s=1; for (var k=0;k<rh;k++) for (xx=x-1+k;xx<Math.min(W,x+bw+1-k);xx++) w.px(xx,top-1-k,(k===rh-1)?P.s6:(xx===x-1+k?P.n5:P.s5)); w.s=0;
    if (r()<0.5){ var cxx=x+2+Math.floor(r()*(bw-4)); w.rect(cxx,top-rh-3,2,3,col[0]); w.s=1; w.hl(cxx,cxx+1,top-rh-4,P.s6); w.s=0; }
    x+=bw+(r()<0.2?3:0); }
  // Bäume am Rand der Wiese vor den Häusern
  for (x=250;x<W;x+=7+Math.floor(hash(x,3)*6)){ var th=6+Math.floor(hash(x,4)*5); w.g=RG.tree; for (y=HY-th;y<HY+1;y++){ var hw=Math.floor((y-(HY-th))*0.5); for (var q=-hw;q<=hw;q++) if (hash(x+q,y)<0.45) w.px(x+q,y,P.m1); } w.vl(x,HY-th-1,HY+1,P.w1); } }

// ---------------------------------------------------------------- Ruhmeshalle und Bavaria auf der Anhöhe
function paintHall(w,we){ var x, y, H0=HALL; w.g=RG.hall; w.s=0;
  // Mitteltrakt und Seitenflügel: Gebälk, Säulen, dunkle Halle dahinter
  var wings=[[H0.x0,H0.x0+26,H0.y0+3],[H0.x0+26,H0.x1-26,H0.y0],[H0.x1-26,H0.x1,H0.y0+3]];
  wings.forEach(function(q,qi){ var top=q[2];
    for (y=top;y<H0.base;y++) for (x=q[0];x<q[1];x++){ var d=y-top, c;
      if (d<2) c=P.s5; else if (d<4) c=(x%3===0)?P.s3:P.s4; else if (d<5) c=P.s3;                 // Gebälk mit Triglyphen
      else if (y>=H0.base-2) c=(y===H0.base-2)?P.s4:P.s3;                                          // Stufen
      else { var u=(x-q[0])%5; c=(u===0)?P.s5:((u===1)?P.s4:(qi===1?P.m2:P.m3)); if (u>1 && y>H0.base-6) c=M.DN[c]; }     // Säulen und Schatten der Halle
      w.px(x,y,c); }
    w.s=1; for (x=q[0]-1;x<=q[1];x++){ w.px(x,top-1,P.s6); if (hash(x,2)<0.6) w.px(x,top-2,P.s6); } w.s=0; });
  // Terrasse davor
  for (y=H0.base;y<H0.base+4;y++) for (x=H0.x0-10;x<H0.x1+10;x++) w.px(x,y,(y===H0.base)?P.s4:P.s3);
  // Sockel der Bavaria
  for (y=PED.y0;y<PED.y1;y++) for (x=PED.x0;x<PED.x1;x++) w.px(x,y,(x===PED.x0)?P.s5:((x>=PED.x1-2)?P.s2:((y===PED.y0)?P.s5:P.s4)));
  w.s=1; w.hl(PED.x0,PED.x1-1,PED.y0-1,P.s6); w.s=0;
  // die große Treppe hinab zur Wiese
  for (y=PED.y1;y<SLOPE.foot;y++){ var hw2=rd(12+(y-PED.y1)*0.55); for (x=BAV.x-hw2;x<=BAV.x+hw2;x++){ var c2=((y-PED.y1)%3===0)?P.s3:P.s4; w.g=RG.hall; w.s=(we!=='thaw' && (y-PED.y1)%3!==0 && Math.abs(x-BAV.x)>3)?1:0; w.px(x,y,w.s?P.s6:c2); } } w.s=0; }
function paintBavaria(w,we){ var x=BAV.x, by=BAV.base, h=BAV.h, y, xx; w.g=RG.bav; w.s=0;
  var BR=R('k1 w0 w1 g1 g2');
  // Gewand: weit fallend, Falten; Mantel über der Schulter
  for (y=by-h+14;y<by;y++){ var t=(y-(by-h+14))/(h-14), hl=rd(3+t*5.5), hr=rd(3+t*4); for (xx=x-hl;xx<=x+hr;xx++){ var f=((xx*2+y)%5===0)?-0.2:0, c=ra(BR,0.5-(xx-x)/Math.max(hl,hr)*0.3+f,xx,y); if (xx===x-hl) c=P.g1; w.px(xx,y,c); } }
  // Oberkörper, Kopf mit Haarkranz
  w.rect(x-3,by-h+7,7,8,P.w1); w.vl(x-3,by-h+7,by-h+14,P.g1); w.vl(x+3,by-h+8,by-h+14,P.w0);
  w.rect(x-1,by-h+2,4,5,P.w1); w.px(x-1,by-h+2,P.g1); w.hl(x-2,x+3,by-h+1,P.w0); w.px(x+2,by-h+4,P.w0);
  // linker Arm hoch erhoben, darin der Kranz
  w.line(x+3,by-h+8,x+7,by-h-3,P.w1); w.line(x+4,by-h+8,x+8,by-h-3,P.w0); w.ellipse(x+8.5,by-h-6,3.6,3.6,P.g2); w.ellipse(x+8.5,by-h-6,1.8,1.8,T); w.px(x+6,by-h-8,P.g3); w.px(x+11,by-h-5,P.g1);
  // rechter Arm hängt, hält den Saum
  w.line(x-4,by-h+9,x-6,by-h+18,P.w1); w.px(x-6,by-h+19,P.w0);
  // der Löwe, sitzend, links neben ihr
  var lx=x-12, ly=by; w.rect(lx-4,ly-8,9,8,P.w1); w.vl(lx-4,ly-8,ly-1,P.g1); w.ellipse(lx-5,ly-11,4,4,function(a,b2){ return (hash(a,b2)<0.5)?P.w0:P.w1; }); w.rect(lx-8,ly-11,3,3,P.w1); w.px(lx-8,ly-10,P.k1); w.hl(lx-4,lx+4,ly-1,P.w0); w.vl(lx+5,ly-5,ly-1,P.w1); w.px(lx+6,ly-6,P.w0);
  if (we!=='thaw'){ w.s=1; w.px(x,by-h,P.s6); w.px(x+1,by-h,P.s6); w.px(x+8,by-h-10,P.s6); w.hl(lx-7,lx-3,ly-15,P.s6); w.hl(lx-3,lx+3,ly-9,P.s6); w.s=0; } }
// ---------------------------------------------------------------- Hang mit Rodelspuren und gemalten Kindern, kahle Bäume
function slopeTop(x){ return SLOPE.top+Math.max(0,(x-HALL.x1)*0.18)+Math.sin(x*0.05)*1.5; }
function slopeFoot(x){ return SLOPE.foot+Math.sin(x*0.03)*2; }
function paintSlope(w,we){ var x, y, wet=we==='thaw', SN=wet?R('m2 m3 s3 m4 s4'):R('n4 n5 b5 s6 l1'); w.g=RG.slope;
  for (x=0;x<SLOPE.x1+30;x++){ var t0=rd(slopeTop(x)), f0=rd(slopeFoot(x)); if (x>SLOPE.x1) f0=rd(lerp(f0,HY+6,cl((x-SLOPE.x1)/30,0,1))); for (y=t0;y<f0;y++){ var d=(y-t0)/Math.max(1,f0-t0);
      w.s=1; var c=ra(SN,0.7-d*0.25+(fbm(x*0.05,y*0.15,4)-0.5)*0.3,x,y); if (wet && fbm(x*0.06,y*0.2,9)>0.62){ c=ra(R('g1 e1 g2 e2'),0.5,x,y); w.s=0; }
      // Rodelbahnen: dunklere Spuren hangabwärts
      if (!wet && d>0.06){ for (var k=0;k<5;k++){ var sx=[28,64,150,200,236][k]+Math.sin(d*3+k)*5+d*14*(k%2?1:-1); if (Math.abs(x-sx)<0.8+d*0.6){ c=(Math.abs(x-sx)<0.5)?P.n4:P.n5; } } } w.px(x,y,c); } }
  w.s=0; }
function bareTree(w,x,by,h,seed){ var r=M.rng(seed), y; w.g=RG.tree; w.vl(x,by-h,by,P.w1); w.vl(x+1,by-rd(h*0.7),by,P.w0);
  function br(x0,y0,a,L,dep){ var x1=x0+Math.cos(a)*L, y1=y0+Math.sin(a)*L; w.line(rd(x0),rd(y0),rd(x1),rd(y1),dep>1?P.w1:P.m2); if (dep<3) for (var k=0;k<2;k++) br(x1,y1,a+(r()-0.5)*1.2,L*0.62,dep+1); }
  for (var k=0;k<4;k++) br(x,by-h*(0.45+k*0.14),-Math.PI/2+(r()-0.5)*1.6,h*0.42,1);
  w.s=1; w.px(x,by-h-1,P.s6); w.s=0; }
var KIDS=[];
function kids(w){ KIDS=[[36,82,P.r3,1],[70,94,P.b3,1],[214,86,P.y4,-1],[240,98,P.g4,1],[150,76,P.v3,-1],[20,98,P.a4,1]];
  KIDS.forEach(function(q){ var x=q[0], y=q[1]; w.g=RG.prop; w.s=0; w.rect(x-2,y-1,5,1,P.w2); w.px(x+3*q[3],y-2,P.w2); w.rect(x-1,y-4,2,3,q[2]); w.px(x-1,y-5,P.p3); w.px(x,y-6,q[2]); }); }

// ---------------------------------------------------------------- Wiese, Nebenweg, Fußspuren; Hauptweg mit Schneewällen; Laternen, Bank, Schlitten
function paintField(w,we){ var x, y, wet=we==='thaw', SN=wet?R('m2 m3 s3 m4 s4'):R('n4 n5 b5 s6 l1'); w.g=RG.field;
  for (y=HY;y<PATH0;y++) for (x=0;x<W;x++){ if (REG[y*W+x]===RG.slope||REG[y*W+x]===RG.hall||REG[y*W+x]===RG.prop) continue; var d=(y-HY)/(PATH0-HY);
    w.s=1; var c=ra(SN,0.66+(fbm(x*0.02/(0.3+d),y*0.2,4)-0.5)*0.3+d*0.08,x,y); if (wet && fbm(x*0.03,y*0.3,7)>0.6){ c=ra(R('g1 g2 e2 e3'),0.5,x,y); w.s=0; } w.px(x,y,c); }
  // Nebenweg in die Tiefe zur Bavaria
  for (y=HY+4;y<PATH0;y++){ var t=(y-HY-4)/(PATH0-HY-4), cx=lerp(BAV.x+40,(SIDE.x0+SIDE.x1)/2,t), hw=lerp(1.5,(SIDE.x1-SIDE.x0)/2,t); for (x=rd(cx-hw);x<=rd(cx+hw);x++){ w.s=wet?0:(hash(x,y)<0.25?1:0); w.px(x,y,wet?ra(R('m1 m2 m3'),0.5,x,y):(w.s?P.s6:ra(R('m3 m4 n5'),0.5+(fbm(x*0.3,y,3)-0.5)*0.6,x,y))); } }
  w.s=0;
  // Fußspuren quer in die Wiese
  if (!wet) for (var i=0;i<26;i++){ var t2=i/26, fx=lerp(230,312,t2)+Math.sin(i*0.7)*3, fy=lerp(PATH0-2,HY+10,Math.pow(t2,0.8)); w.g=RG.field; w.px(rd(fx)+((i&1)?2:0),rd(fy),P.n4); if (t2<0.6) w.px(rd(fx)+((i&1)?3:1),rd(fy),P.n5); }
  if (!wet) for (var j=0;j<20;j++){ var t3=j/20, gx=lerp(470,430,t3)+((j&1)?2:0), gy=lerp(PATH0-2,HY+12,t3); w.px(rd(gx),rd(gy),P.n4); } }
function paintPath(w,we){ var x, y, wet=we==='thaw', SL=R('m1 m2 m3 s3 m4'), SN=wet?R('m2 m3 s3 m4'):R('n4 n5 b5 s6'); w.g=RG.path;
  for (y=PATH0;y<H;y++) for (x=0;x<W;x++){ var c, e=Math.min(y-PATH0,H-1-y);
    if (y<PATH0+4){ w.s=1; c=ra(SN,0.5+(y-PATH0)*0.1+(fbm(x*0.1,y,5)-0.5)*0.4,x,y); }                // hinterer Schneewall
    else { w.s=0; var tr=fbm(x*0.03,y*0.25,8); c=wet?ra(R('k2 m0 m1 m2'),0.45+(tr-0.5)*0.6,x,y):ra(SL,0.55+(tr-0.5)*0.5,x,y); if (!wet && tr>0.62){ c=ra(SN,0.7,x,y); w.s=1; } if (wet && tr>0.66){ c=P.m3; } }
    w.px(x,y,c); }
  for (x=0;x<W;x++){ w.s=1; w.px(x,PATH0,wet?P.m3:P.s6); w.s=0; }
  if (wet) for (y=PATH0+6;y<H;y++) for (x=0;x<W;x++){ var p=fbm(x*0.04,y*0.4,11); if (p>0.64){ var sy=PATH0-(y-PATH0)*2-4, sc=w.get(x,Math.max(0,sy)); w.px(x,y,M.DN[sc]); } } }
var LAMPH=[];
function paintLamps(w,we){ LAMPH=[]; LAMPS.forEach(function(lx){ var by=PATH0+1, top=by-46; w.g=RG.prop; w.s=0;
    w.rect(lx-1,top,2,by-top,P.m1); w.vl(lx-1,top,by-1,P.m2); w.rect(lx-2,by-4,4,4,P.m1); w.rect(lx-4,top-6,8,6,P.m2); w.rect(lx-3,top-5,6,4,P.s4); w.hl(lx-5,lx+4,top-7,P.m1); w.px(lx,top-8,P.m1);
    if (we!=='thaw'){ w.s=1; w.hl(lx-5,lx+4,top-8,P.s6); w.s=0; } LAMPH.push([lx,top-3]); }); }
function paintBench(w,we){ var b=BENCH, x; w.g=RG.prop; w.s=0;
  for (x=b.x0;x<b.x1;x++){ w.px(x,b.by-8,P.w4); w.px(x,b.by-7,P.w2); [b.by-16,b.by-12].forEach(function(sy){ w.px(x,sy,P.w4); w.px(x,sy+1,P.w2); }); }
  [b.x0+2,b.x1-3].forEach(function(lx){ w.vl(lx,b.by-16,b.by,P.k1); w.vl(lx+1,b.by-16,b.by,P.m1); });
  if (we!=='thaw'){ w.s=1; for (x=b.x0;x<b.x1;x++){ w.px(x,b.by-9,P.s6); if (hash(x,4)<0.6) w.px(x,b.by-10,P.s6); w.px(x,b.by-17,P.s6); } w.s=0; } }
function paintSled(w){ var x=SLED.x, y=SLED.y; w.g=RG.prop; w.s=0; w.rect(x-8,y-4,16,2,P.r3); w.hl(x-8,x+7,y-4,P.r4); w.vl(x-6,y-2,y,P.w1); w.vl(x+5,y-2,y,P.w1); w.hl(x-9,x+8,y,P.w2); w.px(x-10,y-1,P.w2); w.px(x+9,y-1,P.w2); w.line(x+8,y-3,x+14,y-1,P.e3); }

// ---------------------------------------------------------------- Bild
var BASE=null, LIT=[], WE='snowlie';
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k;
  WE=we; HZWIDE=(we==='snowlie'||we==='sun'||we==='frost'); REG.fill(0); SNW.fill(0); WINS=[];
  paintSky(w,tod,we);
  paintCity(w,we);
  paintHall(w,we);
  paintSlope(w,we);
  [[8,64,22,3],[214,66,20,5],[238,70,16,7],[12,98,12,9],[252,96,14,11],[196,58,16,13]].forEach(function(q){ bareTree(w,q[0],q[1],q[2],q[3]); });
  paintBavaria(w,we);
  kids(w);
  paintField(w,we);
  if (S.walk) paintSled(w);
  paintPath(w,we);
  paintLamps(w,we); paintBench(w,we);
  // Dunst: die Ferne verschwindet bei Schnee und Nebel
  var fk={snow:[0.6,0.45,0.25],fog:[0.95,0.8,0.55],thaw:[0.42,0.3,0.15],snowlie:[0.25,0.15,0.05],sun:[0.18,0.1,0.03],frost:[0.2,0.12,0.04]}[we];
  var fc=tod==='night'?(we==='fog'?P.m1:P.n0):(we==='fog'?P.m4:(we==='thaw'?P.m3:(we==='snow'?P.m4:P.b4)));
  haze(b,function(xx,yy){ var g=REG[yy*W+xx]; if (g===RG.city) return fk[0]; if (g===RG.hall||g===RG.bav) return fk[1]; if (g===RG.tree) return yy<HY+4?fk[1]:fk[2]; if (g===RG.slope) return fk[2]*0.8; if (g===RG.field) return fk[2]*cl(1-(yy-HY)/(PATH0-HY),0,1); return 0; },{col:fc});
  M.light(b,M.lf.sum(M.lf.band(PATH0,PATH0+5,-0.4,0),M.lf.k(we==='thaw'?-0.2:(we==='sun'?0.15:0))),0,0,function(xx,yy){ return REG[yy*W+xx]===RG.path; });
  if (we==='sun'||we==='snowlie'||we==='frost') for (k=0;k<W*H;k++){ if (SNW[k] && (REG[k]===RG.field||REG[k]===RG.slope) && hash(k%W,(k/W)|0)<(we==='sun'?0.012:0.004)) b.d[k]=P.l1; }
  BASE=b.clone(); LIT=lightsFor(tod);
  shade(b,0,0,tod,LIT,true);
  if (tod!=='day'){ WINS.forEach(function(q){ if (q[2]>(we==='fog'?0.9:0.55) && REG[q[1]*W+q[0]]===RG.city) b.px(q[0],q[1],q[2]>0.85?P.y4:P.y3); });
    LAMPH.forEach(function(l){ b.rect(l[0]-3,l[1]-2,6,4,P.y4); b.px(l[0],l[1]-1,P.l1); if (we==='fog') halo(b,l[0],l[1],16,1); }); }
  return b; }
function lightsFor(tod){ if (tod==='day') return []; var L=[]; LAMPH.forEach(function(l){ L.push([l[0],l[1]+10,30,40,0.7],[l[0],PATH0+14,44,14,0.5]); }); return L; }

// ---------------------------------------------------------------- jedes Bild: Glitzern, Kinder rodeln, Schnee, Nebel, Feuerwerk
var FWC=[[P.l1,P.y5,P.y4,P.y2],[P.l1,P.r4,P.r3,P.r2],[P.l1,P.b5,P.b3,P.b1],[P.l0,P.d6,P.d5,P.d3],[P.l1,P.g5,P.g4,P.g3],[P.l1,P.a6,P.a5,P.a3]];
function fireworks(fb,t,cam,x0,y0,x1,y1,n,rad,mask){
  function pl(X,Y,c){ X=rd(X)-cam; Y=rd(Y); if (X<0||X>=fb.w||Y<0||Y>=144) return; if (mask && !mask(X+cam,Y)) return; fb.px(X,Y,c); }
  for (var i=0;i<n;i++){ var per=3.1+hash(i,71)*2.3, ph=t/per+hash(i,72)*5, cyc=Math.floor(ph), u=ph-cyc; if (hash(cyc,i+76)<0.3) continue;
    var bx=x0+hash(i*13+cyc,73)*(x1-x0), by=y0+hash(cyc,i*7+74)*(y1-y0)*0.6, col=FWC[Math.floor(hash(cyc,i+75)*FWC.length)], rise=0.16;
    if (u<rise){ var q=u/rise, ry=y1+(by-y1)*q; pl(bx+Math.sin(q*7)*0.6,ry,col[1]); if (q>0.2) pl(bx,ry+1,col[3]); continue; }
    var kk=(u-rise)/(1-rise); if (kk>0.62) continue; kk/=0.62;
    var r=rad*Math.sqrt(kk), parts=12+Math.floor(hash(cyc,i)*6), ci=Math.min(3,Math.floor(kk*4.2));
    for (var p=0;p<parts;p++){ var a=p/parts*Math.PI*2+hash(cyc,p+i)*0.4, rr=r*(0.7+hash(p,cyc+i)*0.4), px=bx+Math.cos(a)*rr, py=by+Math.sin(a)*rr*0.85+kk*kk*6; pl(px,py,col[ci]); if (kk<0.45) pl(px-Math.cos(a)*1.2,py-Math.sin(a),col[Math.min(3,ci+1)]); }
    if (kk<0.12) pl(bx,by,P.l1); } }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, tod=v.tod, we=WE, i;
  var tint=tod!=='day'?levels(nkey(tod)||'night')[1]:null;
  function px(X,Y,c){ X=rd(X)-cam; Y=rd(Y); if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  // zwei Kinder sausen auf Schlitten den Hang hinab
  if (tod==='day' && we!=='thaw') for (i=0;i<2;i++){ var per=7+i*2.3, ph=((t+i*3.1)/per)%1; if (ph>0.75) continue; var q=ph/0.75, x0=[60,190][i], sx=x0+q*26*(i?-1:1), sy=lerp(slopeTop(x0)+4,slopeFoot(x0)-3,q);
    px(sx-2,sy,P.w2); px(sx-1,sy,P.w2); px(sx,sy,P.w2); px(sx+1,sy,P.w2); px(sx-1,sy-1,i?P.r3:P.b2); px(sx,sy-1,i?P.r3:P.b2); px(sx-1,sy-2,i?P.r3:P.b2); px(sx-1,sy-3,P.p3); if (q>0.2) px(sx+(i?2:-2)*1,sy+1,P.s6); }
  if (we==='sun'||we==='snowlie'||we==='frost') for (i=0;i<16;i++){ var gx=Math.floor(hash(i,41)*W), gy=HY+6+Math.floor(hash(i,42)*(PATH0-HY-8)); if (Math.sin(t*3.1+i*2.3)>0.86) px(gx,gy,P.l1); }
  if (fwOn(S,GS)) fireworks(fb,t,cam,260,6,W-20,52,3,11,function(X,Y){ return X>=0&&X<W&&REG[Y*W+X]===RG.sky; }); }
function front(fb,v,S,GS){ var we=WE, tod=v.tod;
  if (we==='snow') M.snow(fb,v.t,{n:110,cam:v.cam,wind:6,col:tod==='day'?P.s6:P.s5,col2:tod==='day'?P.s5:P.n4});
  else if (we==='fog') fogFront(fb,v.t,{y0:20,y1:144,amt:0.34,k:2,col:tod==='day'?P.m4:P.m1,cam:v.cam,speed:4}); }
// Geistersicht: ein verblasster Jahrmarkt auf der leeren Wiese
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  function gp(X,Y,c,a){ var sx=rd(X)-cam; Y=rd(Y); if (sx<0||sx>=320||Y<0||Y>=144) return; if (a!==undefined && bayer(sx,Y+Math.floor(t*2))>a) return; fb.d[Y*320+sx]=c; }
  var al=0.58+0.14*Math.sin(t*0.5);
  // Zeltdächer (lange Satteldächer) und ein Riesenrad
  [[300,82,60,8],[390,80,70,9],[480,83,50,7]].forEach(function(z,zi){ for (var x=z[0];x<z[0]+z[2];x++){ var e=Math.min(x-z[0],z[0]+z[2]-1-x), ry=z[1]-Math.min(z[3],e*0.6); gp(x,ry,P.x4,al); gp(x,z[1]+6,P.x3,al*0.7); if (x%9===0) for (var y=ry;y<z[1]+6;y++) gp(x,y,P.x2,al*0.6); } });
  var wx=262, wy=60, wr=16, rot=t*0.05; for (var a=0;a<48;a++){ var an=a/48*Math.PI*2; gp(wx+Math.cos(an)*wr,wy+Math.sin(an)*wr,P.x4,al); }
  for (var s=0;s<8;s++){ var sa=s/8*Math.PI*2+rot; for (var r=0;r<wr;r+=2) gp(wx+Math.cos(sa)*r,wy+Math.sin(sa)*r,P.x3,al*0.7); gp(wx+Math.cos(sa)*wr,wy+Math.sin(sa)*wr+2,P.v4,al); }
  gp(wx,wy,P.x5,al); for (var y2=wy;y2<wy+wr+10;y2++){ gp(wx-(y2-wy)*0.4,y2,P.x3,al*0.6); gp(wx+(y2-wy)*0.4,y2,P.x3,al*0.6); }
  // viele blasse Abdrücke von Menschen, dicht wie eine Menge
  for (var i=0;i<170;i++){ var px=262+hash(i,61)*290, py=HY+8+hash(i,62)*(PATH0-HY-10), ph=Math.sin(t*0.6+i); if (ph<0.1) continue; gp(px,py,hash(i,63)<0.3?P.v4:P.x4,0.7*ph); gp(px,py-1,P.x3,0.5*ph); gp(px,py-2,P.x2,0.4*ph); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<116||y>140||x<6||x>554) return false; if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.by+3) return false; for (var i=0;i<LAMPS.length;i++) if (Math.abs(x-LAMPS[i])<3 && y<PATH0+6) return false; return true; }
M.defineArt('wiesn',{ snowPrints:true,
  width:W, paint:paint, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day') return null; var key=nkey(tod); if (!key) return null; var Lv=levels(key), l=lightAt(LIT,a.x,a.y-22); return Lv[Math.max(1,Math.min(Lv.length-1,Math.round(l*(Lv.length-1))))].a; },
  spots:{
    exit:[W-10,70,10,74],
    bavaria:[BAV.x-16,BAV.base-BAV.h-12,34,PED.y1-(BAV.base-BAV.h-12)],
    slope:[0,SLOPE.top+4,SLOPE.x1,SLOPE.foot-SLOPE.top-2],
    field:[250,HY,W-250,PATH0-HY-2],
    path:[SIDE.x0-40,HY+4,SIDE.x1-SIDE.x0+60,PATH0-HY-2],
    bench:[BENCH.x0-1,BENCH.by-19,BENCH.x1-BENCH.x0+2,21],
    sled:[SLED.x-11,SLED.y-6,26,8],
    tracks:[226,HY+8,92,PATH0-HY-8],
    city:[250,HY-22,W-250,24]
  },
  stands:{ exit:[548,126,'R'], bavaria:[118,120,'B'], slope:[140,120,'B'], field:[420,120,'B'], path:[330,120,'B'], bench:[461,121,'B'], sled:[176,120,'B'], tracks:[262,120,'B'], city:[480,124,'B'] },
  actorPos:{ ana:[300,124,'L','anaC'], mia:[188,112,'R','miaC'], niko:[284,126,'L','nikoC'], mala:[342,122,'L'] },
  start:[530,124,'L'], entries:{ map:[536,124,'L'] }
});
})(M);
