/* ===== rooms/art/hacker.js — Hackerbrücke (400 px, scrollend) =====
   Der Gehweg der historischen Stahlbogenbrücke: vorn Schnee, hinten das Stahlgeländer mit Gitterfüllung auf einem Betonsockel,
   zwei alte Laternen. Hinter dem Geländer steigt der genietete Bogen auf (zwei Gurte, Gitterwerk), vorn rechts schneidet der Bogen
   der anderen Seite ins Bild. Unten, tief, das breite Gleisfeld: viele Gleise nebeneinander, die zum Hauptbahnhof hin
   zusammenlaufen, Masten und Quertragwerke der Oberleitung, ein Regionalzug fährt ein. In der Ferne die Halle des Hauptbahnhofs
   mit Lichtern und Bürobauten (keine Türme mit Zeichen). Vorn die Bordsteinkante zur Fahrbahn.
   Phasen: k4_pro (Durchgang, Schneefall), k4_d5_n (Nacht, Nebel: ferne Lichter verschwimmen, Laternen mit Hof). Mala kann in der
   Nacht auf dem Geländer sitzen (actorPos mala_rail, Füße 13 px unter der Geländerkante). Feuerwerk über der Stadt, wenn
   M.k4Fireworks(GS) oder S.fireworks. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144;
var HY=46, VPX=236;                                        // Horizont, Fluchtpunkt der Gleise
var RAIL={top:88, base:100, plinth:103};                   // Geländerkante, Fuß, Betonsockel
var WALK0=104, KERB=139;                                   // Gehweg, Bordstein
var LMP=[{x:86},{x:300}];                                  // Laternen
var ARCH={x0:28,x1:392,crown:14,base:96};                  // Bogen hinter dem Geländer
var TRAIN={u0:-70,u1:-56,z0:1.15,z1:3.6};                  // stehender Zug (in Gleiskoordinaten)
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
var REG=new Uint8Array(W*H), SNW=new Uint8Array(W*H), RG={sky:0,far:1,field:2,arch:3,rail:4,walk:5,prop:6,train:7,hbf:8};
function RW(b){ var o={g:0,s:0,w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; SNW[k]=o.s; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
function dk(w,x,y,n){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,-(n||1))); }
// Perspektive des Gleisfelds: u = Lage quer (Pixel am Geländerfuß, y=RAIL.base), z = Tiefe (1 am Geländerfuß, wächst in die Ferne)
function gy(z){ return HY+(RAIL.base-HY)/z; }
function gx(u,z){ return VPX+u/z; }

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
function paintSky(w,tod,we){ var x, y, i, r=M.rng(41); w.g=RG.sky; w.s=0;
  if (tod!=='night'){
    if (we==='snow'){ var S1=R('m3 m4 s4 s5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(S1,0.18+y/70*0.8+(fbm(x*0.018,y*0.06,3)-0.5)*0.22,x,y)); return; }
    if (we==='fog'){ var F1=R('m3 m4 n5 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(F1,0.45+y/120+(fbm(x*0.01,y*0.04,5)-0.5)*0.14,x,y)); return; }
    if (we==='thaw'){ var G1=R('m2 m3 m4 s4'); for (y=0;y<H;y++) for (x=0;x<W;x++){ var cv=fbm(x*0.012+3,y*0.07,6); w.px(x,y,ra(G1,0.2+y/70*0.6+(cv-0.5)*0.5,x,y)); } return; }
    var D=we==='sun'?R('b1 b2 b3 b4 b5'):R('b2 b3 b4 b5');
    for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(D,(we==='sun'?0.08:0.18)+Math.pow(y/HY,1.2)*0.82,x,y));
    if (we==='sun') for (y=HY-14;y<HY;y++) for (x=0;x<W;x++) if (bayer(x,y)<(y-HY+14)/30) w.px(x,y,P.s6);
    return; }
  if (we==='thaw'||we==='snow'){ var N1=R('k1 m0 d0 m1 d1'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N1,0.12+Math.pow(y/HY,1.3)*0.7+(fbm(x*0.015,y*0.06,4)-0.5)*0.25,x,y)); return; }
  if (we==='fog'){ var N2=R('k1 m0 m1 m1 m2'); for (y=0;y<H;y++) for (x=0;x<W;x++){ var gl=Math.exp(-Math.pow((x-VPX)/90,2))*cl((y-10)/40,0,1)*0.25; w.px(x,y,ra(N2,0.22+y/140+gl+(fbm(x*0.012,y*0.05,7)-0.5)*0.15,x,y)); } return; }
  var N=R('k0 k1 k2 n0 n1 n2'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N,0.04+Math.pow(y/HY,1.6)*0.7,x,y));
  for (i=0;i<(we==='frost'?240:160);i++) w.px(Math.floor(r()*W),Math.floor(Math.pow(r(),1.4)*(HY-8)),r()<0.14?P.n5:(r()<0.5?P.n4:P.n3)); }

// ---------------------------------------------------------------- Ferne: Stadt und Halle des Hauptbahnhofs am Fluchtpunkt
var WINS=[], HBFL=[];
function paintFar(w,we){ var x, y, c;
  w.g=RG.far; w.s=0;
  var r=M.rng(17); x=0;
  while (x<W){ var bw=8+Math.floor(r()*18), bh=4+Math.floor(r()*12)+(Math.abs(x-VPX)<120?4:0), top=HY-bh, col=r()<0.5?R('m2 m3 m4'):R('s2 s3 s4');
    if (Math.abs(x+bw/2-VPX)<56){ x+=bw; continue; }
    for (y=top;y<HY;y++) for (var xx=x;xx<Math.min(W,x+bw);xx++){ c=col[1]; if (xx===x) c=col[2]; if (xx===x+bw-1) c=col[0]; if ((y-top)%3===1 && (xx-x)%3===1){ c=P.m1; WINS.push([xx,y,hash(xx,y)]); } w.px(xx,y,c); }
    w.s=1; w.hl(x,Math.min(W-1,x+bw-1),top-1,P.s6); w.s=0;
    if (r()<0.35 && bw>9){ var ax=x+2+Math.floor(r()*(bw-6)); w.rect(ax,top-3,4,3,col[0]); w.s=1; w.hl(ax,ax+3,top-4,P.s6); w.s=0; }   // Dachaufbau (Maschinenraum), keine Antennen
    x+=bw+(r()<0.3?2:0); }
  // die Halle: breite, flach gewölbte Hallenfront mit Glas, rechts und links niedrige Bauten
  w.g=RG.hbf;
  for (x=VPX-54;x<=VPX+54;x++){ var u=(x-VPX)/54, top=rd(HY-14-Math.sqrt(Math.max(0,1-u*u))*6);
    for (y=top;y<HY;y++){ var d=y-top; c=(d<1)?P.s4:((d<3)?P.m2:P.m1); if (d>=3 && y<HY-2 && Math.abs(u)<0.94){ c=((x-VPX+60)%6<1)?P.m2:P.k2; if (((x-VPX+60)%6)>=2 && (y%3)!==0) HBFL.push([x,y]); } w.px(x,y,c); }
    w.s=1; w.px(x,top-1,P.s6); w.s=0; } }

// ---------------------------------------------------------------- Gleisfeld
var TRK=[]; (function(){ for (var i=-15;i<=15;i++){ var u=i*15+(i>2?5:0)+(i<-6?-4:0); TRK.push(u); } })();   // Gleismitten am Geländerfuß
var MASTS=[-235,-150,-95,-28,45,112,170,250,330];
function trackAt(u,z){ var best=1e9, bi=-1; for (var i=0;i<TRK.length;i++){ var d=Math.abs(u-TRK[i]); if (d<best){ best=d; bi=i; } } return [bi,best]; }
function paintField(w,we){ var x, y, c, wet=we==='thaw';
  w.g=RG.field;
  var BAL=wet?R('m0 e1 m1 e2 m2'):R('m3 n4 n5 b5 s6'), DIRT=R('e1 m1 e2 m2');
  for (y=HY;y<RAIL.base+6;y++){ var z=(RAIL.base-HY)/Math.max(0.5,y-HY), px1=z;     // Pixelbreite in u-Einheiten
    for (x=0;x<W;x++){ var u=(x-VPX)*z, t=trackAt(u,z), d=t[1], snow=!wet, cc;
      // Schotter oder Schnee
      cc=ra(BAL,(wet?0.5:0.55)+(fbm(u*0.02,z*3,3)-0.5)*(wet?0.25:0.35)-(d<4?0.18:0),x,y); w.s=snow?1:0;
      if (wet && d>6 && fbm(u*0.015,z*2,8)>0.6){ cc=ra(R('m2 m3 s3'),0.5,x,y); w.s=1; }                       // Reste von grauem Schnee
      if (snow && d<5.5 && fbm(u*0.1,z*8,6)<0.5) { cc=ra(DIRT,0.5,x,y); w.s=0; }                           // vom Zug freigeblasen
      // Schwellen (nur nah sichtbar)
      if (z<3 && d<4.2 && (Math.floor(z*40)%3===0)) { cc=wet?P.e1:(snow?P.m3:P.w1); w.s=0; }
      // Schienen
      if (z<4.5 && Math.abs(d-3.2)<Math.max(0.5,px1*0.55)){ cc=wet?((z<2.5)?P.m3:P.m2):((z<2.5)?P.m4:P.m2); w.s=0; }
      w.px(x,y,cc); } }
  // Masten der Oberleitung mit Quertragwerken, Fahrdrähte zum Fluchtpunkt
  w.s=0;
  [1.12,1.6,2.3,3.4,5.2].forEach(function(z,zi){ var yb=gy(z), hh=56/z;
    MASTS.forEach(function(u,mi){ var mx=rd(gx(u,z)); if (mx<-4||mx>W+4) return; var top=rd(yb-hh); w.vl(mx,top,rd(yb),z<2?P.m1:P.m2); if (z<1.8) w.vl(mx+1,top,rd(yb),P.m2); });
    var yb2=rd(yb-hh); for (x=rd(gx(MASTS[0],z));x<=rd(gx(MASTS[MASTS.length-1],z));x++){ if (x<0||x>=W) continue; w.px(x,yb2,z<2?P.m1:P.m2); if (z<2.4 && (x%3===0)) w.px(x,yb2+1,P.m2); } });
  TRK.forEach(function(u,i){ if (i%2) return; for (var z=1.05;z<14;z*=1.03){ var X=rd(gx(u,z)), Y=rd(gy(z)-46/z); if (X>=0&&X<W&&Y>HY-6) w.px(X,Y,P.m2); } });
  // Stellwerk-Häuschen und Signale
  var hz=2.0, hx=rd(gx(-180,hz)), hy=rd(gy(hz)); w.rect(hx-6,hy-9,12,9,P.s3); w.hl(hx-7,hx+6,hy-10,P.m2); w.rect(hx-3,hy-7,3,3,P.k2); WINS.push([hx-2,hy-6,1.5]); w.s=1; w.hl(hx-7,hx+6,hy-11,P.s6); w.s=0;
  [[-120,1.5],[60,2.2],[150,1.3],[-40,3.0]].forEach(function(q,i){ var sx=rd(gx(q[0],q[1])), sy=rd(gy(q[1])), sh=rd(18/q[1]); w.vl(sx,sy-sh,sy,P.m1); w.rect(sx-1,sy-sh-3,3,4,P.k1); SIG.push([sx,sy-sh-2,i]); }); }
var SIG=[];
// stehender Zug auf einem Gleis links: Dach mit Schnee, rote Flanke, Fenster
var TRAINWIN=[];
function paintTrain(w,we){ var u0=TRAIN.u0, u1=TRAIN.u1, x, y, z; w.g=RG.train; w.s=0; TRAINWIN=[];
  for (z=TRAIN.z0;z<TRAIN.z1;z+=0.004){ var yb=gy(z), hh=30/z, xl=gx(u0,z), xr=gx(u1,z), top=yb-hh, roof=4/z;
    var X0=rd(xl), X1=rd(xr), YT=rd(top), YB=rd(yb);
    // Flanke zum Fluchtpunkt hin (rechte Seite sichtbar)
    var xs=rd(xr);
    for (y=YT;y<YB;y++){ var q=(y-YT)/Math.max(1,YB-YT), c=(q<0.12)?P.s4:(q<0.5?P.r2:(q<0.56?P.s5:(q<0.9?P.r2:P.k2))); if (q>=0.16 && q<0.44 && (Math.floor(z*22)%4)!==0){ c=P.k2; if (Math.floor(z*22)%4===2 && y===YT+rd((YB-YT)*0.3)) TRAINWIN.push([xs,y,z]); } w.px(xs,y,c); }
    for (x=X0;x<=X1;x++){ w.px(x,YT,(x<X0+1)?P.m3:P.s5); }
  }
  // Zugspitze vorn (unter der Brücke): Frontfenster, Scheinwerfer
  var zf=TRAIN.z0, yb0=rd(gy(zf)), hh0=rd(30/zf), xl0=rd(gx(u0,zf)), xr0=rd(gx(u1,zf));
  for (y=yb0-hh0;y<yb0;y++) for (x=xl0;x<=xr0;x++){ var q=(y-(yb0-hh0))/hh0, c=(q<0.12)?P.s4:(q<0.42?P.k2:(q<0.9?P.r2:P.k1)); if (q>=0.12 && q<0.42 && ((x+y)%7)<1) c=P.n2; w.px(x,y,c); }
  w.s=1; for (x=xl0;x<=xr0;x++) w.px(x,yb0-hh0-1,P.s6); w.s=0;
  TRAINF=[[xl0+2,yb0-rd(hh0*0.2)],[xr0-2,yb0-rd(hh0*0.2)]]; }
var TRAINF=[];

// ---------------------------------------------------------------- der genietete Bogen hinter dem Geländer
function archY(x,off){ var t=(x-ARCH.x0)/(ARCH.x1-ARCH.x0); return ARCH.base-(ARCH.base-ARCH.crown-off)*Math.sin(Math.PI*cl(t,0,1)); }
function paintArch(w,we){ var x, y; w.g=RG.arch; w.s=0;
  for (x=ARCH.x0;x<=ARCH.x1;x++){ var yo=rd(archY(x,0)), yi=rd(archY(x,0)+11+Math.sin(Math.PI*cl((x-ARCH.x0)/(ARCH.x1-ARCH.x0),0,1))*-3);
    for (y=yo;y<=yo+2;y++) w.px(x,y,(y===yo)?P.m3:(y===yo+1?P.m2:P.m0));
    for (y=yi;y<=yi+2;y++) w.px(x,y,(y===yi)?P.m2:(y===yi+1?P.m1:P.k2));
    if (x%3===0){ w.px(x,yo+1,P.m4); w.px(x,yi+1,P.m3); }
    w.s=1; if (we!=='thaw' && hash(x,2)<0.85) w.px(x,yo-1,P.s6); w.s=0; }
  // Gitterwerk: Pfosten und Diagonalen zwischen den Gurten
  for (x=ARCH.x0+6;x<ARCH.x1-4;x+=12){ var a0=rd(archY(x,0))+3, a1=rd(archY(x,0)+8), b0=rd(archY(x+12,0))+3; w.vl(x,a0,a1+2,P.m1); w.line(x,a0,x+12,rd(archY(x+12,0)+9),P.m1); w.line(x+1,a0,x+13,rd(archY(x+12,0)+9),P.m2); }
  // Hänger zum Geländer hin (unterhalb des Bogens sichtbar)
  for (x=ARCH.x0+30;x<ARCH.x1-24;x+=24){ var hy=rd(archY(x,0)+12); w.vl(x,hy,RAIL.top-2,P.m1); } }

// ---------------------------------------------------------------- Geländer, Sockel, Gehweg, Bordstein, Laternen
var LAMPH=[];
function paintRail(w,we){ var x, y, wet=we==='thaw'; w.g=RG.rail; w.s=0;
  // Betonsockel
  for (y=RAIL.base;y<RAIL.plinth+1;y++) for (x=0;x<W;x++) w.px(x,y,(y===RAIL.base)?P.s4:((hash(x>>1,y)<0.5)?P.s3:P.s2));
  // Gitterfüllung: Stäbe mit Rautenband, Pfosten, Handlauf
  for (x=0;x<W;x++){ if (x%4===0) w.vl(x,RAIL.top+3,RAIL.base-1,P.m1); if ((x+RAIL.top)%8===0){ w.px(x,RAIL.top+6,P.m2); }
    var dpos=(x%10); w.px(x,RAIL.top+5+(dpos<5?dpos:10-dpos),P.m1); w.px(x,RAIL.top+3,P.m1); w.px(x,RAIL.base-2,P.m1); }
  for (x=2;x<W;x+=20){ w.rect(x,RAIL.top-1,3,RAIL.base-RAIL.top+1,P.m1); w.vl(x,RAIL.top-1,RAIL.base-1,P.m2); w.px(x+1,RAIL.top+4,P.m3); }
  for (x=0;x<W;x++){ w.px(x,RAIL.top,P.m3); w.px(x,RAIL.top+1,P.m1); w.px(x,RAIL.top+2,P.k2); }
  if (!wet){ w.s=1; for (x=0;x<W;x++){ w.px(x,RAIL.top-1,P.s6); if (hash(x,3)<0.55) w.px(x,RAIL.top-2,hash(x,4)<0.5?P.s6:P.b5); } w.s=0; }
  // Gehweg
  w.g=RG.walk;
  var SN=R('n4 n5 b5 s6 l1'), SL=R('m1 m2 m3 s3 m4');
  for (y=RAIL.plinth+1;y<KERB;y++) for (x=0;x<W;x++){ var tr=Math.exp(-Math.pow((y-121-Math.sin(x*0.025)*4)/6,2))+(fbm(x*0.06,y*0.2,9)-0.5)*0.5, c;
    if (wet){ w.s=0; c=ra(R('m0 m1 m2'),0.5+(fbm(x*0.04,y*0.3,5)-0.5)*0.6,x,y); if (tr<0.3 && fbm(x*0.05,y*0.4,8)>0.55){ c=ra(R('m2 m3 s3'),0.5,x,y); w.s=1; } if ((x+(y>>2)*7)%24===0) c=P.m1; }
    else { var cov=0.95-tr*0.85+(fbm(x*0.03,y*0.12,14)-0.5)*0.3; if (cov>0.5+(bayer(x,y)-0.5)*0.12){ w.s=1; c=ra(SN,0.68+(fbm(x*0.02,y*0.08,4)-0.5)*0.34-(y<RAIL.plinth+4?0.2:0),x,y); } else { w.s=0; c=ra(SL,0.5+(fbm(x*0.12,y*0.3,6)-0.5)*0.5,x,y); } }
    w.px(x,y,c); }
  w.s=0;
  if (!wet) for (var i=0;i<20;i++){ var fx=Math.floor(hash(i,31)*W), fy=RAIL.plinth+6+Math.floor(hash(i,32)*28), dir=hash(i,33)<0.5?1:-1; for (var st=0;st<4;st++){ w.px(fx+st*5*dir,fy+((st&1)?2:0),P.n4); w.px(fx+st*5*dir+1,fy+((st&1)?2:0),P.n5); } }
  // Bordstein, Fahrbahn vorn
  w.g=RG.walk;
  for (x=0;x<W;x++){ w.px(x,KERB,P.m4); w.px(x,KERB+1,P.m2); for (y=KERB+2;y<H;y++){ var c2=wet?ra(R('k2 m0 m1'),0.5+(fbm(x*0.05,y,3)-0.5)*0.6,x,y):((y===KERB+2||Math.abs(y-(KERB+4))<1)?ra(R('m1 m2 m3'),0.5,x,y):ra(R('m3 n5 b5'),0.6,x,y)); w.s=(!wet && c2!==P.m1 && c2!==P.m2)?1:0; w.px(x,y,c2); } }
  w.s=0;
  // Laternen am Geländer
  LAMPH=[]; LMP.forEach(function(l){ var lx=l.x, by=RAIL.base+1, top=26;
    w.g=RG.prop; w.rect(lx-2,by-6,5,6,P.m1); w.hl(lx-3,lx+3,by-6,P.m2); w.vl(lx,top+8,by-6,P.m1); w.vl(lx+1,top+8,by-6,P.m2); w.vl(lx-1,by-22,by-7,P.m1);
    w.poly([[lx-4,top+8],[lx+5,top+8],[lx+3,top],[lx-2,top]],P.m3); w.rect(lx-2,top+1,5,6,P.s4); w.hl(lx-4,lx+5,top+8,P.m1); w.hl(lx-3,lx+4,top-1,P.m1); w.px(lx,top-2,P.m1); w.px(lx+1,top-2,P.m1);
    w.s=1; w.hl(lx-3,lx+4,top-2,P.s6); w.s=0; LAMPH.push([lx+1,top+4]); }); }

// ---------------------------------------------------------------- Bild
var BASE=null, LIT=[], WE='snowlie', FWS=false;
function lightsFor(tod){ if (tod==='day') return []; var L=[];
  LAMPH.forEach(function(l){ L.push([l[0],l[1]+8,26,36,0.85],[l[0],122,42,16,0.5]); });
  L.push([VPX,HY-6,70,14,0.45]);
  return L; }
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k;
  WE=we; HZWIDE=(we==='snowlie'||we==='sun'||we==='frost'); REG.fill(0); SNW.fill(0); WINS=[]; HBFL=[]; SIG=[];
  paintSky(w,tod,we);
  paintFar(w,we);
  paintField(w,we);
  paintTrain(w,we);
  paintArch(w,we);
  paintRail(w,we);
  // Nebel und Dunst nach Tiefe: das Gleisfeld verschwindet zur Ferne
  var fogA={fog:1.25,snow:0.75,thaw:0.5,snowlie:0.32,sun:0.22,frost:0.22}[we], farF=(we==='fog')?0.96:fogA*0.75;
  var fc=tod==='night'?(we==='fog'?P.m1:P.n0):(we==='fog'?P.m4:(we==='thaw'?P.m3:(we==='snow'?P.m4:P.b4)));
  haze(b,function(xx,yy){ var g=REG[yy*W+xx]; if (g===RG.sky) return 0; if (g===RG.far) return farF; if (g===RG.hbf) return (we==='fog')?0.9:fogA*0.7; if (g===RG.field||g===RG.train){ var z=(RAIL.base-HY)/Math.max(0.5,yy-HY); return cl(fogA*(1-1/Math.pow(z,we==='fog'?1.6:1))*1.05,0,1); } if (g===RG.arch) return fogA*0.18; if (g===RG.rail||g===RG.prop) return fogA*0.06; return 0; },{col:fc});
  M.light(b,M.lf.sum(M.lf.band(RAIL.plinth,RAIL.plinth+6,-0.6,0),M.lf.k(we==='thaw'?-0.2:(we==='sun'?0.15:0))),0,0,function(xx,yy){ return REG[yy*W+xx]===RG.walk; });
  if (we==='sun') for (k=0;k<W*H;k++){ if (SNW[k] && REG[k]===RG.walk && hash(k%W,(k/W)|0)<0.012) b.d[k]=P.l1; }
  BASE=b.clone(); LIT=lightsFor(tod);
  shade(b,0,0,tod,LIT,true);
  if (tod!=='day') afterLights(b,tod,we);
  return b; }
function afterLights(b,tod,we){ var fog=we==='fog';
  WINS.forEach(function(q){ if (REG[q[1]*W+q[0]]===RG.sky) return; if (fog){ if (q[2]>0.9 && REG[q[1]*W+q[0]]!==RG.far) b.px(q[0],q[1],P.y2); else if (q[2]>0.93) b.px(q[0],q[1],P.d2); return; } if (q[2]>0.6) b.px(q[0],q[1],q[2]>0.9?P.y4:P.y3); });
  if (!fog) HBFL.forEach(function(p){ var h2=hash(Math.floor(p[0]/6),Math.floor(p[1]/3)); if (h2<0.45 && hash(p[0],p[1])<0.7) b.px(p[0],p[1],h2<0.15?P.y3:P.y2); });
  TRAINWIN.forEach(function(p){ if (fog && p[2]>2.2) return; b.px(p[0],p[1],P.y3); });
  SIG.forEach(function(s){ b.px(s[0],s[1],s[2]%2?P.r4:P.g5); });
  LAMPH.forEach(function(l){ b.rect(l[0]-2,l[1]-3,4,6,P.y4); b.px(l[0]-1,l[1]-1,P.l1); b.px(l[0],l[1],P.l1); });
  if (fog){ LAMPH.forEach(function(l){ halo(b,l[0],l[1],20,1.1); halo(b,l[0],l[1],10,0.8); }); halo(b,VPX,HY-6,40,0.7); SIG.forEach(function(s){ halo(b,s[0],s[1],5,0.6); }); }
  else halo(b,VPX,HY-6,26,0.4); }

// ---------------------------------------------------------------- Ebene: Bogen der anderen Seite, vorn rechts angeschnitten
function frontArch(S,GS,tod){ var we=weaOf(GS), L=M.layer(350,0,50,H,H+1), wr=M.lw(L), x, y;
  function fo(y){ return 352+Math.pow(cl((H+6-y)/(H+36),0,1),1.7)*46; }                      // Außengurt: x in Abhängigkeit von y
  for (y=0;y<H;y++){ var xo=rd(fo(y)), xi=xo+15;
    for (x=xo;x<Math.min(W,xo+7);x++){ var d=x-xo; wr.px(x,y,d<1?P.m2:(d<2?P.m1:(d<6?P.k2:P.k1))); if (d===3 && y%4===0) wr.px(x,y,P.m2); }
    for (x=xi;x<Math.min(W,xi+5);x++){ var d2=x-xi; wr.px(x,y,d2<1?P.m1:(d2<4?P.k2:P.k1)); if (d2===2 && y%4===2) wr.px(x,y,P.m1); }
    if (we!=='thaw' && y%26===0){ wr.px(xo,y-1,P.s6); wr.px(xo+1,y-1,P.s6); } }
  for (y=4;y<H;y+=16){ var a0=rd(fo(y))+6, a1=rd(fo(y+16))+15; wr.line(a0,y,a1,y+16,P.k2); wr.line(a0+1,y,a1+1,y+16,P.k1); wr.line(rd(fo(y))+6,y,rd(fo(y))+15,y,P.k2); }
  if (tod!=='day'){ var key=nkey(tod); if (key) M.tintApply(L,levels(key)[0]); }
  else if (we==='fog') haze(L,function(){ return 0.1; },{col:P.m4});
  return L; }
function layers(S,GS,tod){ return [frontArch(S,GS,tod)]; }

// ---------------------------------------------------------------- jedes Bild: Züge als Lichterreihen, Funken, Nebel, Schnee, Feuerwerk
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
function trainLights(fb,t,cam,tod,we){ var night=tod!=='day', fog=we==='fog';
  // zwei Züge: einer fährt ein (vom Betrachter weg, rote Schlusslichter), einer fährt aus (auf uns zu, Spitzenlicht)
  [[ -25, 0.034, 1,  0],[ 95, 0.045, -1, 0.5]].forEach(function(tr,ti){ var u=tr[0], per=1/tr[1], ph=((t/per)+tr[3])%1, dir=tr[2];
    var zh=dir>0?(1.05+ph*9):(10-ph*9); if (zh<1.02||zh>12) return;
    var len=1.4;   // Zuglänge in z
    for (var s=0;s<26;s++){ var z=dir>0?zh-s*len/26*(zh*0.5):zh+s*len/26*(zh*0.5); if (z<1.02) continue; var X=rd(gx(u+4,z))-cam, Y=rd(gy(z)-10/z); if (X<0||X>=fb.w||Y<HY||Y>=RAIL.base) continue;
      if (fog && z>3.5 && (s%3)) continue; if (s%2===0) fb.px(X,Y,night?(fog?P.m4:P.y4):P.m3); }
    var fz=zh, FX=rd(gx(u+4,fz))-cam, FY=rd(gy(fz)-4/fz); if (FX>=0&&FX<fb.w&&FY>=HY&&FY<RAIL.base){ var c=dir>0?P.r4:P.l1; fb.px(FX,FY,c); if (fz<3){ fb.px(FX+1,FY,c); if (dir<0) fb.px(FX,FY-1,P.y5); } } }); }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, tod=v.tod, we=WE;
  trainLights(fb,t,cam,tod,we);
  // Funken an der Oberleitung, selten
  var sp=Math.floor(t/7.3), sph=t/7.3-sp; if (sph<0.05 && hash(sp,3)<0.6){ var z=1.3+hash(sp,4)*2.5, u=TRK[Math.floor(hash(sp,5)*TRK.length)], X=rd(gx(u,z))-cam, Y=rd(gy(z)-46/z); for (var i=0;i<5;i++){ var px=X+Math.floor(hash(i,sp)*5)-2, py=Y+Math.floor(hash(sp,i)*4); if (px>=0&&px<fb.w&&py>=0&&py<144) fb.px(px,py,i<2?P.l1:P.b5); } }
  // Signale blinken nicht – aber das Zuglicht unten im Nebel atmet
  if (we==='sun') for (var j=0;j<10;j++){ var gx2=Math.floor(hash(j,41)*W)-cam, gy2=WALK0+4+Math.floor(hash(j,42)*30); if (gx2>=0&&gx2<fb.w && Math.sin(t*3.1+j*2.3)>0.82) fb.px(gx2,gy2,P.l1); }
  if (fwOn(S,GS)) fireworks(fb,t,cam,30,4,W-30,40,3,11,function(X,Y){ return X>=0&&X<W&&REG[Y*W+X]===RG.sky; }); }
function front(fb,v,S,GS){ var we=WE, tod=v.tod;
  if (we==='snow') M.snow(fb,v.t,{n:110,cam:v.cam,wind:6,col:tod==='day'?P.s6:P.s5,col2:tod==='day'?P.s5:P.n4});
  else if (we==='fog'){ fogFront(fb,v.t,{y0:30,y1:110,amt:tod==='night'?0.42:0.36,k:2,col:tod==='day'?P.m4:P.m1,cam:v.cam,speed:5}); fogFront(fb,v.t*0.6+40,{y0:90,y1:144,amt:0.22,k:1,col:tod==='day'?P.m4:P.m1,cam:v.cam,speed:3}); } }
// Geistersicht: am Geländer viele blasse Hände (Leute, die hier gesessen und geschaut haben)
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam; for (var i=0;i<30;i++){ var hx=6+Math.floor(hash(i,1)*(W-12))-cam, hy=RAIL.top-1; if (hx<2||hx>316) continue;
    var a=0.5+0.3*Math.sin(t*0.6+i); if (bayer(hx,hy)>a) continue; var c=hash(i,3)<0.35?P.v4:P.x4; fb.px(hx,hy,c); fb.px(hx+1,hy,c); fb.px(hx+2,hy,P.x3); fb.px(hx,hy+1,P.x2); fb.px(hx+2,hy+1,P.x2); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ return y>=114 && y<=136 && x>=6 && x<=394; }
var RAILTOP=RAIL.top;
M.defineArt('hacker',{ snowPrints:true,
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day') return null; var key=nkey(tod); if (!key) return null; var Lv=levels(key), l=lightAt(LIT,a.x,a.y-22); return Lv[Math.max(1,Math.min(Lv.length-1,Math.round(l*(Lv.length-1))))].a; },
  spots:{
    exit:[0,70,10,74],
    railing:[110,RAIL.top-4,180,RAIL.plinth-RAIL.top+5],
    tracks:[0,HY+2,W,RAIL.top-HY-4],
    train:[rd(gx(TRAIN.u0,TRAIN.z1))-2,rd(gy(TRAIN.z0)-30/TRAIN.z0)-2,rd(gx(TRAIN.u1,TRAIN.z0))-rd(gx(TRAIN.u0,TRAIN.z1))+6,rd(gy(TRAIN.z0))-rd(gy(TRAIN.z0)-30/TRAIN.z0)+2],
    arch:[ARCH.x0,ARCH.crown-2,ARCH.x1-ARCH.x0,ARCH.base-ARCH.crown],
    hbf_view:[VPX-56,HY-24,112,22],
    lamp:[LMP[1].x-7,22,15,RAIL.base-21]
  },
  stands:{ exit:[8,124,'L'], railing:[200,116,'B'], tracks:[160,116,'B'], train:[90,116,'B'], arch:[230,118,'B'], hbf_view:[236,116,'B'], lamp:[312,118,'B'] },
  actorPos:{ mala:[212,115,'L'], mala_rail:[210,RAILTOP+13,'L','mala',false,'sit'], marko_rail:[188,117,'R','marko'] },
  start:[18,124,'R'], entries:{ zob:[18,124,'R'], map:[18,124,'R'] }
});
})(M);
