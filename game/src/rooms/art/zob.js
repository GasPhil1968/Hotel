/* ===== rooms/art/zob.js — ZOB an der Hackerbrücke (480 px, scrollend) =====
   Der Fernbusbahnhof von 2009: ein lang gestreckter, heller Bau mit geschwungener Dachkante, zwei Fensterbändern und einem
   Vordach, darunter die Ladenpassage (Heiligabend geschlossen: Gitter, ein Zettel, nur die Wartehalle hat Licht). Davor die
   Busspur mit Schneematsch und Fahrspuren, der Bussteig 14 mit Stele, die elektronische Abfahrtsanzeige, eine Bank, ein
   Schneehaufen. Links am Rand ein Betonpfeiler, daneben ein hellerer Fleck im Pflaster, wo früher eine Bude stand (Geistersicht:
   die Bude mit Schalterfenster und „FAHRKARTEN“). S.busIn: der weiße Reisebus mit blauem Streifen, Zielanzeige
   „SARAJEVO - MÜNCHEN“, sonst ein leerer Steig mit Ölfleck. Rechts der Taxistand mit einem cremeweißen Mercedes (Blinklicht),
   dahinter der Aufgang zur Hackerbrücke mit dem genieteten Stahlbogen, angeschnitten. Im Hintergrund das Dach der Gleisanlagen
   und fern die Halle des Hauptbahnhofs. Zwei gemalte Reisende mit Koffern.
   Wetter (Kapitel 4): snow (Schneefall in front), snowlie, thaw (grau, nass, Pfützen), fog, sun (Glitzern), frost; Unbekanntes
   wie snowlie. Nachts gelbe Fenster, Lampen, Leuchtanzeige. Feuerwerk über den Gleisen, wenn M.k4Fireworks(GS) oder S.fireworks. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144;
var GB=100, LANE=103, KERB=111, PLAT=114;                 // Passage-Boden, Busspur, Bordstein, Bussteig
var BX1=356;                                              // Ostende des ZOB-Baus
var PIL={x0:14,x1:40,base:117};                           // Betonpfeiler (Ebene)
var PATCH={x0:42,x1:82,y0:115,y1:127};                    // heller Fleck im Pflaster
var BOOTH={x0:40,x1:84,top:78,base:118};                  // Umriss der Bude (nur Geistersicht)
var BUS={x0:50,x1:230,top:50,base:109,door:206,wf:192,wr:98};
var STELE={x:241,top:62,base:112};
var BOARD={x0:254,x1:302,y0:60,y1:88,base:112};
var BENCH={x0:308,x1:336,by:116};
var PILE={x0:338,x1:360,by:117};
var TAXI={x0:364,x1:420,base:110};
var LAMP={x:423,base:112,top:34};
var STAIR={x0:428,x1:480,y0:112,y1:52};
var COLS=[96,182,268,346];                                 // Stützen unter dem Vordach
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
// Regionen (wer hat welchen Pixel gemalt) und Schneemaske (Schnee leuchtet nachts heller)
var REG=new Uint8Array(W*H), SNW=new Uint8Array(W*H), RG={sky:0,far:1,mid:2,bld:3,glass:4,road:5,plat:6,bus:7,prop:8,bridge:9};
function RW(b){ var o={g:0,s:0,w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; SNW[k]=o.s; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
function dk(w,x,y,n){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,-(n||1))); }
// Schilderschrift: Mikroschrift, Umlaute als zwei Punkte darüber
var DIA={'Ä':'A','Ö':'O','Ü':'U'};
function sign(w,s,x,y,c){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(w,base,cx,y,c); if (DIA[ch]){ w.px(cx,y-2,c); w.px(cx+2,y-2,c); } cx+=M.microWidth(base)+1; }); return cx; }
function signW(s){ return M.microWidth(String(s).toUpperCase().replace(/Ä/g,'A').replace(/Ö/g,'O').replace(/Ü/g,'U')); }

// ---------------------------------------------------------------- Licht: Nacht kalt, Schnee heller, Lampen warm
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.25+L*0.1, b*0.4+L*0.18+16]; },
  nsnow:function(r,g,b){ var L=lum(r,g,b); return [r*0.24+L*0.14+6, g*0.3+L*0.16+10, b*0.44+L*0.22+28]; },
  dusk:function(r,g,b){ return [r*0.78+16, g*0.58+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=6, A=TF[k]||TF.night, B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.15)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1 && !(l[5] && !l[5](x,y))) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function nkey(tod){ return tod==='night'?'night':(TF[tod]?tod:null); }
function shade(buf,ox,oy,tod,Ls,useSnow){ var key=nkey(tod); if (!key) return; var L=levels(key), LS=levels(tod==='night'?'nsnow':key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy, gk=Y*W+X;
    if (useSnow && REG[gk]===RG.sky) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx((useSnow&&SNW[gk])?LS[i]:L[i],c,X,Y); } }
function halo(b,cx,cy,r,amt){ for (var y=Math.floor(cy-r);y<=cy+r;y++) for (var x=Math.floor(cx-r);x<=cx+r;x++){ if (x<0||y<0||x>=b.w||y>=b.h) continue; var d=Math.hypot(x-cx,(y-cy)*1.15)/r; if (d>1) continue; if (bayer(x,y)<(1-d)*(1-d)*amt){ var k=y*b.w+x; b.d[k]=M.UP[b.d[k]]; } } }

// ---------------------------------------------------------------- Himmel
function paintSky(w,tod,we){ var x, y, i, r=M.rng(23); w.g=RG.sky; w.s=0;
  if (tod!=='night'){
    if (we==='snow'){ var S1=R('m3 m4 s4 s5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(S1,0.18+y/120*0.8+(fbm(x*0.018,y*0.06,3)-0.5)*0.22,x,y)); return; }
    if (we==='fog'){ var F1=R('m3 m4 n5 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(F1,0.4+y/170+(fbm(x*0.01,y*0.04,5)-0.5)*0.14,x,y)); return; }
    if (we==='thaw'){ var G1=R('m2 m3 m4 s4'); for (y=0;y<H;y++) for (x=0;x<W;x++){ var cv=fbm(x*0.012+3,y*0.07,6); w.px(x,y,ra(G1,0.2+y/120*0.6+(cv-0.5)*0.5,x,y)); } return; }
    var D=we==='sun'?R('b1 b2 b3 b4 b5'):R('b2 b3 b4 b5');
    for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(D,(we==='sun'?0.08:0.18)+Math.pow(y/92,1.15)*0.8,x,y));
    if (we!=='sun') for (i=0;i<4;i++){ var cx=r()*W, cy=6+r()*18, L=50+r()*90; for (var k=0;k<L;k++){ var xx=rd(cx+k), a=0.5-Math.abs(k/L-0.5); for (var q=0;q<3;q++){ var yy=rd(cy+Math.sin(k*0.05+i)*1.2+k*0.02)+q; if (bayer(xx,yy)<a*(q===1?0.7:0.3)) w.px(xx,yy,P.b4); } } }
    return; }
  if (we==='thaw'||we==='snow'){ var N1=R('k1 m0 d0 m1 d1'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N1,0.12+Math.pow(y/96,1.3)*0.7+(fbm(x*0.015,y*0.06,4)-0.5)*0.25,x,y)); return; }
  if (we==='fog'){ var N2=R('k1 m0 m1 m1'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N2,0.3+y/150+(fbm(x*0.012,y*0.05,7)-0.5)*0.15,x,y)); return; }
  var N=R('k0 k1 k2 n0 n1'); for (y=0;y<H;y++) for (x=0;x<W;x++) w.px(x,y,ra(N,0.04+Math.pow(y/90,1.4)*0.82,x,y));
  for (i=0;i<(we==='frost'?260:170);i++) w.px(Math.floor(r()*W),Math.floor(Math.pow(r(),1.5)*60),r()<0.14?P.n5:(r()<0.5?P.n4:P.n3)); }

// ---------------------------------------------------------------- Hintergrund: Dach der Gleisanlagen, Hauptbahnhof in der Ferne
var WINS=[];
function paintFar(w,we){ var x, y, i, c;
  w.g=RG.far; w.s=0;
  // Bürobauten und die Halle des Hauptbahnhofs am Horizont (keine Türme mit Zeichen)
  [[356,30,62,R('m2 m3 m4')],[388,22,48,R('s2 s3 s4')],[440,26,56,R('m2 m3 m4')],[464,20,44,R('s3 s4 s5')]].forEach(function(q){ for (y=q[2];y<86;y++) for (x=q[0];x<q[0]+q[1];x++){ var u=x-q[0], fy=(y-q[2])%5; c=q[3][1]; if (u===0) c=q[3][2]; if (u===q[1]-1) c=q[3][0];
      if (fy>=2 && u%4>0 && u<q[1]-1){ c=P.m1; if (fy===3 && u%4===2) WINS.push([x,y,1,1,hash(x,y)]); } w.px(x,y,c); } w.s=1; w.hl(q[0],q[0]+q[1]-1,q[2]-1,P.s6); w.s=0; });
  // die Halle: langes, flach gewölbtes Dach mit Lichtband, davor die Stirnwand mit hohen Glasfeldern
  for (x=360;x<480;x++){ var ht=rd(66-Math.sin((x-360)/120*Math.PI)*6); for (y=ht;y<88;y++){ var d=y-ht; c=(d<1)?P.s5:(d<3?P.m3:(d<8?((x%6<1)?P.m2:P.c2):(d<10?P.m2:((x%9<2)?P.m2:P.c1)))); if (d>=10 && (x%9>=2) && (x%9<=6) && y<84 && (y%3)!==0){ WINS.push([x,y,1,1,(hash(Math.floor(x/9),Math.floor(y/3))<0.45)?0.7:0.3]); } w.px(x,y,c); }
    w.s=1; w.px(x,ht-1,P.s6); if (hash(x,3)<0.6) w.px(x,ht,P.s6); w.s=0; }
  // Dach der Gleisanlagen (Bahnsteigdächer) näher, mit Schnee, Masten der Oberleitung
  w.g=RG.mid;
  for (x=BX1-6;x<W;x++){ for (y=88;y<96;y++){ c=(y===88)?P.s5:((y<91)?P.m3:((y<93)?P.m2:P.m1)); w.px(x,y,c); } w.s=1; w.px(x,87,P.s6); w.px(x,86,hash(x,5)<0.5?P.s6:P.s5); w.s=0; }
  for (x=BX1;x<W;x+=22){ w.vl(x,96,103,P.m1); w.vl(x+1,96,103,P.m2); }
  for (x=BX1+8;x<W;x+=34){ w.vl(x,60,88,P.m1); w.hl(x-6,x+6,62,P.m1); w.hl(x-4,x+4,66,P.m2); }
  for (x=BX1;x<W;x++){ if (hash(x,7)<0.85) w.px(x,63+rd(Math.sin(x*0.19)*0.6),P.m2); }
  for (y=96;y<LANE;y++) for (x=BX1-6;x<W;x++) w.px(x,y,(hash(x>>1,y)<0.5)?P.m2:P.m3); }

// ---------------------------------------------------------------- der ZOB-Bau: geschwungene Dachkante, Fensterbänder, Vordach, Passage
function roofTop(x){ var t=17+Math.sin((x+60)*0.011)*5+Math.sin(x*0.029+1)*2; if (x>BX1-26){ var e=(x-(BX1-26))/26; t+=Math.pow(e,2.2)*40; } return t; }
var SHOPS=[[0,44,'',0],[44,96,'WARTEHALLE',1],[96,182,'IMBISS',2],[182,268,'SCHLIESSFÄCHER',3],[268,312,'BÄCKEREI',4],[312,BX1-8,'REISEBÜRO',5]];
function shopFront(w,s,tod){ var x0=s[0]+2, x1=s[1]-2, kind=s[3], x, y, c;
  // Schildband
  w.g=RG.bld; for (y=62;y<69;y++) for (x=x0;x<x1;x++) w.px(x,y,(y===62)?P.s6:((y===68)?P.m2:P.s5));
  if (s[2]){ var tw=signW(s[2]); sign(w,s[2],rd((x0+x1)/2-tw/2),64,kind===1?P.b1:P.m1); }
  // Glas, Rahmen
  w.g=RG.glass;
  for (y=69;y<GB;y++) for (x=x0;x<x1;x++){ var u=x-x0; c=(u%14<1)?P.m3:P.c0; if (c===P.c0){ if (((u*0.6+y)%27)<2) c=P.c2; if (y>GB-6) c=P.k2; }
    if (kind===1 && c!==P.m3){ c=(y<78)?P.w2:((y<90)?P.w1:P.w0); if (((u*0.6+y)%27)<2) c=P.s3; }    // Wartehalle: warmes Licht
    w.px(x,y,c); }
  if (kind===1){ WINS.push([x0+1,70,x1-x0-2,GB-71,1.1,'wait']); for (x=x0+6;x<x1-6;x+=11){ w.vl(x,84,GB-2,P.m2); w.hl(x-3,x+3,84,P.m3); } }          // Sitze in der Wartehalle
  if (kind===4||kind===2){ for (y=70;y<GB-1;y++) for (x=x0;x<x1;x++) if ((x-x0)%3===0 || (y-70)%9===0) w.px(x,y,P.m2); w.rect(x0+6,80,9,11,P.s6); w.hl(x0+7,x0+13,82,P.m2); w.hl(x0+7,x0+12,84,P.m2); w.hl(x0+7,x0+13,86,P.m2); }   // Rollgitter, Zettel
  if (kind===5){ [[x0+4,P.b3,P.y4],[x0+18,P.a4,P.s6],[x0+30,P.d4,P.y4]].forEach(function(q){ w.rect(q[0],72,10,14,q[1]); w.rect(q[0],80,10,6,P.y3); w.ellipse(q[0]+7,75,1.6,1.6,q[2]); }); w.rect(x0+3,90,12,3,P.s5); }
  if (kind===3){ for (y=72;y<GB-2;y+=6) for (x=x0+4;x<x1-4;x+=7){ w.rect(x,y,6,5,P.m3); w.px(x+4,y+2,P.y3); } }
  w.g=RG.bld; for (x=x0;x<x1;x++){ w.px(x,GB,P.m3); w.px(x,GB+1,P.m2); } }
function building(w,tod,we){ var x, y, c;
  w.g=RG.bld;
  for (x=0;x<BX1;x++){ var t=rd(roofTop(x)), bot=x>BX1-10?rd(lerp(60,94,(x-(BX1-10))/10)):59;
    for (y=t;y<Math.min(bot,GB);y++){ var d=y-t;
      if (d<2) c=P.m4; else if (d<3) c=P.s5; else if (d<4) c=P.m3; else if (d<6) c=P.m2;                     // Dachkante (Blech)
      else if (y<54){ var band=(y>=26&&y<34)||(y>=40&&y<48); if (band){ var u=(x+3)%9; c=(u<1)?P.m3:((y===26||y===40)?P.k2:P.c1); if (c===P.c1 && ((x*0.7+y)%23)<2) c=P.c3; if (c===P.c1 && y%8>5) c=P.c0; if (c!==P.m3 && c!==P.k2 && (y===30||y===44) && u===4) WINS.push([x,y,1,1,hash(x,y*3)]); }
        else c=((x+y*2)%61<1)?P.s3:(((y-26)%14===10||(y-26)%14===11)?P.s3:P.s5); }
      else if (y<59) c=(y===54)?P.s4:((y===58)?P.k2:P.m1);                                                    // Vordach-Untersicht
      else c=P.k2;
      w.px(x,y,c); }
    // Schnee auf der Dachkante
    w.s=1; var sh=2+Math.floor(fbm(x*0.08,2,7)*3); for (var k2=1;k2<=sh;k2++) w.px(x,t-k2,k2===sh?(hash(x,4)<0.5?P.b5:P.s6):(k2===1?P.b5:P.s6)); w.s=0; }
  // Lichtleisten unter dem Vordach
  for (x=8;x<BX1-12;x+=26){ w.hl(x,x+12,56,P.s6); w.hl(x,x+12,57,P.s4); }
  // Schriftzug „ZOB“
  w.rect(292,30,30,12,P.s6); w.hl(292,321,41,P.s4); M.text(w,'ZOB',297,32,P.b1);
  // Eiszapfen an der Vordachkante (nicht bei Tauwetter)
  if (we!=='thaw'){ w.s=1; for (x=10;x<BX1-12;x+=3){ var L=Math.floor(hash(x,11)*4); if (hash(x,12)<0.45) continue; for (var k=0;k<L;k++) w.px(x,59+k,k<L-1?P.b5:P.n5); } w.s=0; }
  // Passage: Läden
  SHOPS.forEach(function(s){ shopFront(w,s,tod); });
  // Stützen
  w.g=RG.bld; COLS.forEach(function(cx){ for (y=59;y<GB+2;y++){ w.px(cx-2,y,P.m2); w.px(cx-1,y,P.m4); w.px(cx,y,P.s5); w.px(cx+1,y,P.m3); w.px(cx+2,y,P.m1); } w.rect(cx-3,GB,7,2,P.m2); });
  // Gehweg vor der Passage
  w.g=RG.road; for (y=GB+2;y<LANE;y++) for (x=0;x<BX1;x++){ w.s=(we!=='thaw' && hash(x>>1,y)<0.6)?1:0; w.px(x,y,w.s?((hash(x,y)<0.5)?P.s5:P.b5):((hash(x,y)<0.5)?P.m2:P.m3)); } w.s=0; }

// ---------------------------------------------------------------- Boden: Busspur mit Matsch und Fahrspuren, Bordstein, Bussteig mit Schnee
var PUD=[[150,124,18,2.2],[300,132,22,2.6],[96,136,14,2],[390,126,16,2]];
function inPud(x,y){ for (var i=0;i<PUD.length;i++){ var p=PUD[i], dx=(x-p[0])/p[2], dy=(y-p[1])/p[3]; if (dx*dx+dy*dy<1+Math.sin(x*0.7+i)*0.1) return i+1; } return 0; }
function trodden(x,y){ var a=Math.exp(-Math.pow((y-125-Math.sin(x*0.02)*3)/5,2))*0.9; a=Math.max(a,Math.exp(-Math.pow((x-BUS.door-6)/10,2))*cl((136-y)/20,0,1)); a=Math.max(a,Math.exp(-Math.pow((x-445+(y-112)*0.4)/8,2))); a=Math.max(a,Math.exp(-Math.pow((x-60)/14,2))*cl((132-y)/18,0,1)*0.8); return a+(fbm(x*0.08,y*0.2,9)-0.5)*0.5; }
function ground(w,we,S){ var x, y, c, wet=we==='thaw', SN=R('n4 n5 b5 s6 l1'), SL=R('m1 m2 m3 s3 m4');
  // Busspur
  w.g=RG.road;
  for (y=LANE;y<KERB;y++) for (x=0;x<W;x++){ var t1=Math.abs(y-(LANE+2.2+Math.sin(x*0.031)*0.7)), t2=Math.abs(y-(KERB-2.6+Math.sin(x*0.023+2)*0.8)), trk=(t1<1.1+fbm(x*0.2,1,3)*0.8)||(t2<1.1+fbm(x*0.2,4,3)*0.9);
    if (wet){ w.s=0; c=ra(R('k2 m0 m1 m2'),0.35+(fbm(x*0.05,y*0.6,3)-0.5)*0.5,x,y); if (!trk && fbm(x*0.04,y,5)>0.62){ c=(hash(x,y)<0.5)?P.m3:P.s3; w.s=1; } }
    else if (trk){ w.s=0; c=ra(SL,0.35+(fbm(x*0.1,y,4)-0.5)*0.6,x,y); if (hash(x>>1,y)<0.08) c=P.e2; }
    else { w.s=1; c=ra(SN,0.55+(fbm(x*0.06,y*0.5,4)-0.5)*0.5,x,y); }
    w.px(x,y,c); }
  w.s=0;
  if (!S.busIn){ w.ellipse(140,107,18,1.8,function(xx,yy){ return hash(xx,yy)<0.6?P.k1:P.m0; }); w.px(132,107,P.v2); w.px(148,106,P.a3); }   // Ölfleck auf dem leeren Steig
  // Fahrbahnmarkierung „TAXI“ vor dem Taxistand (halb unter Matsch)
  M.microText({px:function(xx,yy,cc){ if (hash(xx,yy)<0.7) w.px(xx,yy,cc); }},'TAXI',TAXI.x0+2,LANE+2,wet?P.s4:P.s3);
  // Bordstein aus Granit, mit Schneekante
  for (x=0;x<W;x++){ w.g=RG.plat; w.s=0; w.px(x,KERB,P.m4); w.px(x,KERB+1,P.m3); w.px(x,KERB+2,P.m1); if (!wet || hash(x,3)<0.3){ w.s=1; w.px(x,KERB,hash(x,1)<0.6?P.s6:P.b5); } }
  // Bussteig: Betonpflaster unter Schnee, zertretene Wege, Matsch
  w.g=RG.plat;
  for (y=PLAT;y<H;y++) for (x=0;x<W;x++){ var row=Math.floor((y-PLAT)/4), off=(row&1)*6, fx=(x+off)%12, fy=(y-PLAT)%4, pave=(fx===0||fy===0)?P.m1:((hash(Math.floor((x+off)/12),row)<0.4)?P.m2:P.m3);
    var tr=trodden(x,y), patch=(x>=PATCH.x0&&x<PATCH.x1&&y>=PATCH.y0&&y<PATCH.y1), shelter=x<PATCH.x1+6 && y<PATCH.y1+4;
    if (patch){ pave=(fx===0||fy===0)?P.s3:((hash(Math.floor((x+off)/12),row)<0.4)?P.s4:P.s5); }
    if (wet){ w.s=0; c=(fy===0||(fx===0&&bayer(x,y)<0.6))?P.m1:(fbm(x*0.05,y*0.2,21)>0.6&&bayer(x,y)<0.35?P.m3:P.m2); if (tr<0.35 && fbm(x*0.05,y*0.3,8)>0.52){ c=ra(R('m2 m3 s3 m4'),0.5+(fbm(x*0.2,y*0.4,2)-0.5)*0.6,x,y); w.s=1; } if (patch) c=(fx===0||fy===0)?P.s2:P.s3; }
    else { var cov=(shelter?0.3:0.95)-tr*0.8+(fbm(x*0.03,y*0.12,14)-0.5)*0.3; if (cov>0.5+(bayer(x,y)-0.5)*0.12){ w.s=1; var sv=0.66+(fbm(x*0.022,y*0.09,4)-0.5)*0.34+(cov-0.5)*0.25-(y<PLAT+3?0.18:0); c=ra(SN,sv,x,y); }
      else { w.s=0; c=(tr>0.5 && !patch)?ra(SL,0.5+(fbm(x*0.12,y*0.3,6)-0.5)*0.5,x,y):pave; if (tr>0.5 && !patch && hash(x>>1,y)<0.05) c=P.m1; } }
    w.px(x,y,c); }
  w.s=0;
  // Ankerlöcher der alten Bude im hellen Fleck
  [[PATCH.x0+3,PATCH.y0+2],[PATCH.x1-4,PATCH.y0+2],[PATCH.x0+3,PATCH.y1-3],[PATCH.x1-4,PATCH.y1-3]].forEach(function(q){ w.px(q[0],q[1],P.t1); w.px(q[0]+1,q[1],P.k2); });
  // Fußspuren im Schnee
  if (!wet) for (var i=0;i<26;i++){ var fx2=Math.floor(hash(i,31)*W), fy2=PLAT+5+Math.floor(hash(i,32)*24), dir=hash(i,33)<0.5?1:-1; if (trodden(fx2,fy2)>0.25) continue;
      for (var st=0;st<5;st++){ var qx=fx2+st*5*dir, qy=fy2+((st&1)?2:0); if (trodden(qx,qy)>0.35) break; w.px(qx,qy,P.n4); w.px(qx+1,qy,P.n4); w.px(qx+2,qy,P.n5); } }
  // Pfützen (Tauwetter)
  if (wet) for (y=PLAT+2;y<H;y++) for (x=0;x<W;x++) if (inPud(x,y)){ w.s=0; w.px(x,y,P.m1); } }
function wetReflect(b){ var src=b.clone(); for (var y=PLAT+1;y<H;y++){ var d=y-PLAT, k=0.55-d/60, sy=PLAT-2-Math.floor(d*1.6); if (k<=0.05||sy<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (REG[i]!==RG.plat||SNW[i]||inPud(x,y)) continue; var f=fbm(x*0.06,y*0.25,4); if (f<0.48) continue; var sc=src.d[sy*W+x]; if (bayer(x,y)<k*(f-0.4)*2.4) b.d[i]=M.DN[sc]; } } }
function puddleReflect(b){ var src=b.clone();
  for (var y=PLAT+2;y<H;y++) for (var x=0;x<W;x++){ var p=inPud(x,y); if (!p) continue; var q=PUD[p-1], my=q[1]-q[3]-1, sy=my-(y-my)*4-10, c=sy>=0?src.get(x+((y&1)?1:0),sy):P.m2; if (c===T) c=P.m2; c=M.DN[c]; if (Math.abs((x-q[0])/q[2])>0.88) c=P.m1; b.px(x,y,c); } }

// ---------------------------------------------------------------- Reisebus (weiß, blauer Streifen), Kopf rechts, Türseite zu uns
var BUSSIGN=[0,0,0,0], BUSWIN=[];
function paintBus(w,we,tod){ var b=BUS, x, y, c; w.g=RG.bus; w.s=0; BUSWIN=[];
  var L=b.x1-b.x0, winT=b.top+7, winB=b.top+28, bot=b.base-5, skirt=bot-5;
  for (x=b.x0;x<b.x1;x++){ var u=x-b.x0, fr=b.x1-1-x;
    var top=b.top+(fr<7?rd(7-Math.sqrt(Math.max(0,49-(7-fr)*(7-fr)))):0)+(u<4?rd(4-Math.sqrt(Math.max(0,16-(4-u)*(4-u)))):0);
    var sw=winB+3-(fr<46?rd((46-fr)*0.22):0);                                                          // blauer Schwung nach vorn hoch
    for (y=top;y<bot;y++){
      if (y<top+1) c=P.s5; else if (y<top+2) c=P.s6;
      else if (y<winT) c=(y===winT-1)?P.s4:P.s6;
      else if (y<winB){ var pane=(u%27)<2 && fr>8 && u>6; c=pane?P.k1:((y<winT+2)?P.k2:P.n0); if (!pane && (((u*0.9)+y*1.1)%24)<2.2) c=P.n2; if (!pane && y>winB-4) c=P.k2;
        if (fr<=8){ c=(y<winT+2)?P.k2:(((fr*1.4+y)%11)<1.5?P.n3:P.n1); }                                // Frontscheibe
        if (u<=6) c=(y<winT+3)?P.k2:P.n0; }
      else if (y>=sw && y<sw+4) c=(y===sw)?P.b3:((y<sw+3)?P.b1:P.b0);
      else if (y<skirt) c=(fr<3)?P.s4:P.s6;
      else c=(y===skirt)?P.m3:P.m2;
      if (u===0) c=M.DN[c]; if (fr===0 && y>winB) c=P.s4;
      w.px(x,y,c); }
    if (fr>5 && u>3){ w.s=1; w.px(x,top-1,P.s6); if (hash(x,6)<0.75) w.px(x,top-2,hash(x,7)<0.5?P.s6:P.b5); w.s=0; } }
  // Klimaanlage auf dem Dach (mit Schnee)
  w.rect(b.x0+70,b.top-3,40,3,P.s4); w.hl(b.x0+70,b.x0+109,b.top-3,P.s5); w.s=1; w.hl(b.x0+69,b.x0+110,b.top-4,P.s6); w.hl(b.x0+72,b.x0+106,b.top-5,P.b5); w.s=0;
  // Tür (zweiflügelig, Glas) gleich hinter der Front, Trittstufen
  var dx=b.door; for (y=winT-1;y<bot;y++) for (x=dx;x<dx+12;x++){ c=(x===dx||x===dx+11)?P.s4:((x===dx+6)?P.m2:(y<bot-9?(((x+y)%9)<1?P.n2:P.n1):P.m1)); if (y>=bot-9 && (bot-y)%3===0) c=P.m4; w.px(x,y,c); }
  // Zielanzeige an der Seite (oben im ersten Fenster hinter der Tür)
  BUSSIGN=[dx-82,winT+1,78,7]; w.rect(BUSSIGN[0],BUSSIGN[1],BUSSIGN[2],BUSSIGN[3],P.k1);
  // Front: Scheinwerfer, Stoßfänger; Spiegel wie Hasenohren
  w.rect(b.x1-3,skirt-6,3,3,P.s6); w.px(b.x1-2,skirt-5,P.y4); w.rect(b.x1-6,skirt,6,4,P.m1); w.hl(b.x1-6,b.x1-1,skirt,P.m3);
  w.line(b.x1-2,b.top+5,b.x1+4,b.top+2,P.k1); w.rect(b.x1+3,b.top+2,3,10,P.k1); w.vl(b.x1+4,b.top+3,b.top+10,P.m3);
  // Heck: Rückleuchten
  w.rect(b.x0,winB+4,2,6,P.r3); w.px(b.x0,winB+4,P.r4); w.rect(b.x0,skirt,3,4,P.m1);
  // Gepäckklappen (Fugen), Tankdeckel
  for (x=b.x0+30;x<b.x1-46;x+=34){ if (Math.abs(x-b.wr)<12) continue; w.vl(x,winB+8,skirt-1,P.s4); w.hl(x+1,x+3,skirt-3,P.m3); }
  w.rect(b.x0+20,winB+10,4,3,P.s4);
  // Räder: Radkasten, Reifen, Felge mit Nabe; Matsch im Radkasten
  [b.wr,b.wf].forEach(function(cx){ var cy=b.base-6;
    w.ellipse(cx,cy,10,9,function(xx,yy){ return yy<cy-1?P.k0:T; });
    w.ellipse(cx,cy,7,7,P.k1); w.ellipse(cx,cy,4.4,4.4,P.m3); w.ellipse(cx,cy,3,3,P.m2); w.px(cx,cy,P.m4); w.px(cx-1,cy-1,P.m4);
    for (var a=0;a<5;a++){ var an=a/5*Math.PI*2; w.px(cx+rd(Math.cos(an)*3.6),cy+rd(Math.sin(an)*3.6),P.m1); }
    for (var k=-9;k<=9;k++){ var ay=cy-rd(Math.sqrt(Math.max(0,81-k*k))*0.95); w.px(cx+k,ay-1,P.m3); } });
  // Spritzmatsch an der Flanke, dichter hinter den Rädern
  for (x=b.x0;x<b.x1;x++) for (y=skirt-5;y<skirt;y++){ var nearW=Math.max(0,1-Math.min(Math.abs(x-b.wr+14),Math.abs(x-b.wf+14))/22), sp=fbm(x*0.3,y*0.7,12)+(y-skirt+5)*0.05+nearW*0.2; if (sp>0.72 && bayer(x,y)<0.5) w.px(x,y,(hash(x,y)<0.3)?P.e4:P.s4); }
  for (x=b.x0+2;x<b.x1-2;x++){ w.px(x,b.base,P.k1); if (bayer(x,b.base+1)<0.5) w.px(x,b.base+1,P.k2); }
  for (var i=0;i<12;i++){ var wx=b.x0+10+i*14; if (wx>dx-6) break; BUSWIN.push([wx,winT+8]); } }
function busSignText(w,lit){ var s=BUSSIGN, txt='SARAJEVO - MÜNCHEN', tw=signW(txt); w.rect(s[0],s[1],s[2],s[3],P.k1); sign(w,txt,s[0]+rd((s[2]-tw)/2),s[1]+1,lit?P.y4:P.y3); }

// ---------------------------------------------------------------- Taxi: cremeweißer Mercedes, Kopf links
var TAXIP={sign:[0,0],blink:[],win:[]};
function paintTaxi(w,we){ var x0=TAXI.x0, by=TAXI.base, L=TAXI.x1-TAXI.x0, x, y, c; w.g=RG.prop; w.s=0;
  var prof=[[0,10],[3,11],[11,12],[15,13],[19,19],[23,22],[37,22],[42,18],[45,14],[53,13],[56,10]];
  function topAt(u){ for (var i=0;i<prof.length-1;i++){ var a=prof[i], d=prof[i+1]; if (u>=a[0] && u<=d[0]) return lerp(a[1],d[1],(u-a[0])/Math.max(1,d[0]-a[0])); } return 10; }
  for (x=x0;x<x0+L;x++){ var u=x-x0, ht=rd(topAt(u)); for (y=by-ht;y<by-2;y++){ var d=y-(by-ht);
      if (u>=19 && u<=41 && y<by-13 && d>0){ c=(u===30||u===31)?P.s4:((d<2)?P.c2:P.c1); if (((u*0.7+y)%13)<1.3) c=P.c3; }
      else if (d===0) c=P.s6; else if (y===by-8) c=P.e4; else if (y>by-5) c=P.e3; else c=(y<by-12)?P.s5:P.s4;
      if (u<1 || u>L-2) c=P.e3; w.px(x,y,c); }
    if (ht>12){ w.s=1; w.px(x,by-ht-1,P.s6); if (u>21 && u<39 && hash(x,4)<0.8) w.px(x,by-ht-2,P.s6); w.s=0; } }
  for (y=by-12;y<by-3;y++) w.px(x0+31,y,P.s3);
  [[x0+10,by-2],[x0+45,by-2]].forEach(function(wh){ w.ellipse(wh[0],wh[1],4.5,4.5,P.k1); w.ellipse(wh[0],wh[1],2.2,2.2,P.m3); w.px(wh[0],wh[1],P.m1); });
  w.rect(x0,by-10,2,2,P.y3); w.rect(x0+L-2,by-10,2,2,P.r3); w.rect(x0+1,by-12,5,2,P.m3); w.hl(x0-1,x0+3,by-5,P.m4); w.hl(x0+L-3,x0+L,by-5,P.m4);
  w.rect(x0+24,by-26,11,4,P.y3); w.hl(x0+24,x0+34,by-26,P.y4); M.microText(w,'TAXI',x0+24,by-26,P.k1); TAXIP.sign=[x0+24,by-26];
  TAXIP.blink=[[x0,by-10],[x0+L-2,by-10]];
  for (x=x0+2;x<x0+L-2;x++) if (bayer(x,by)<0.8) dk(w,x,by,2); }

// ---------------------------------------------------------------- Stele „BUSSTEIG 14“, Abfahrtsanzeige, Bank, Schneehaufen, Lampe
var DEPS=[['07:55','ZAGREB','9'],['08:30','BEOGRAD','11'],['09:15','PRAG','6'],['10:00','SPLIT','12'],['10:40','WIEN','3'],['11:20','BUDAPEST','8'],['12:05','LJUBLJANA','5'],['13:30','ROM','2']];
function boardRows(w,page,lit){ var bd=BOARD; w.rect(bd.x0+2,bd.y0+8,bd.x1-bd.x0-4,bd.y1-bd.y0-10,P.k1);
  for (var i=0;i<4;i++){ var r=DEPS[(page*4+i)%DEPS.length], yy=bd.y0+9+i*5; M.microText(w,r[0].replace(':',''),bd.x0+3,yy,lit?P.y4:P.y3); sign(w,r[1].slice(0,7),bd.x0+20,yy,lit?P.s5:P.s4); } }
function props(w,we,tod){ var x, y, c;
  w.g=RG.prop; w.s=0;
  // Stele
  var sx=STELE.x; w.rect(sx-1,STELE.top+18,3,STELE.base-STELE.top-18,P.m2); w.vl(sx-1,STELE.top+18,STELE.base-1,P.m3);
  w.rect(sx-11,STELE.top,23,19,P.b1); w.hl(sx-11,sx+11,STELE.top,P.b2); w.vl(sx-11,STELE.top,STELE.top+18,P.b2); w.hl(sx-11,sx+11,STELE.top+18,P.b0); M.microText(w,'STEIG',sx-9,STELE.top+2,P.s5); M.text(w,'14',sx-4,STELE.top+9,P.s6);
  w.s=1; w.hl(sx-11,sx+11,STELE.top-1,P.s6); w.hl(sx-9,sx+9,STELE.top-2,P.b5); w.s=0;
  // Abfahrtsanzeige auf zwei Pfosten
  var bd=BOARD; [bd.x0+4,bd.x1-5].forEach(function(px){ w.rect(px,bd.y1,2,bd.base-bd.y1,P.m2); w.vl(px,bd.y1,bd.base-1,P.m3); });
  w.rect(bd.x0,bd.y0,bd.x1-bd.x0,bd.y1-bd.y0,P.m1); w.rect(bd.x0+1,bd.y0+1,bd.x1-bd.x0-2,bd.y1-bd.y0-2,P.k1); w.hl(bd.x0,bd.x1-1,bd.y0,P.m3);
  sign(w,'ABFAHRT',bd.x0+3,bd.y0+2,P.s5); boardRows(w,0,false);
  w.s=1; w.hl(bd.x0,bd.x1-1,bd.y0-1,P.s6); w.hl(bd.x0+2,bd.x1-3,bd.y0-2,P.s6); w.s=0;
  // Abfalleimer
  w.rect(bd.x1+2,104,6,9,P.m1); w.hl(bd.x1+2,bd.x1+7,104,P.m3); w.s=1; w.hl(bd.x1+2,bd.x1+7,103,P.s6); w.s=0;
  // Lampe am Taxistand
  var lx=LAMP.x; w.rect(lx-1,LAMP.top,2,LAMP.base-LAMP.top,P.m1); w.vl(lx-1,LAMP.top,LAMP.base-1,P.m3); w.rect(lx-2,LAMP.base-4,4,4,P.m1); w.hl(lx-1,lx-8,LAMP.top,P.m1); w.rect(lx-12,LAMP.top-1,7,3,P.m2); w.hl(lx-12,lx-6,LAMP.top+2,P.s5);
  w.s=1; w.hl(lx-12,lx-6,LAMP.top-2,P.s6); w.s=0; }
function pile(w,we){ var x, y, x0=PILE.x0, x1=PILE.x1, by=PILE.by, cx=(x0+x1)/2, hw=(x1-x0)/2, wet=we==='thaw';
  w.g=RG.prop; w.s=1;
  for (x=x0;x<x1;x++){ var u=(x-cx)/hw, ht=rd(13*Math.sqrt(Math.max(0,1-u*u))*(0.85+fbm(x*0.3,1,3)*0.3)); for (y=by-ht;y<by;y++){ var d=(y-(by-ht))/Math.max(1,ht), v=0.8-d*0.5-u*0.15+(fbm(x*0.25,y*0.4,6)-0.5)*0.5;
      var c=wet?ra(R('m1 m2 m3 s3 m4'),v-0.1,x,y):ra(R('m3 n4 n5 b5 s6'),v,x,y); if (fbm(x*0.2,y*0.9,8)>0.66) c=wet?P.e1:P.m2; w.px(x,y,c); } }
  w.s=0; }
function bench(w,we){ var b=BENCH, x; w.g=RG.prop; w.s=0;
  for (x=b.x0;x<b.x1;x++){ w.px(x,b.by-9,P.m4); w.px(x,b.by-8,P.m2); [b.by-18,b.by-14].forEach(function(sy){ w.px(x,sy,P.m4); w.px(x,sy+1,P.m2); }); }
  [b.x0+2,b.x1-3].forEach(function(lx){ w.vl(lx,b.by-18,b.by,P.k1); w.vl(lx+1,b.by-18,b.by,P.m1); });
  if (we!=='thaw'){ w.s=1; for (x=b.x0;x<b.x1;x++){ w.px(x,b.by-10,P.s6); if (hash(x,3)<0.6) w.px(x,b.by-11,P.b5); w.px(x,b.by-19,hash(x,8)<0.7?P.s6:P.b5); } w.s=0; }
  for (x=b.x0;x<b.x1;x++) if (bayer(x,b.by+1)<0.6) dk(w,x,b.by+1,1); }

// ---------------------------------------------------------------- Aufgang zur Hackerbrücke: Treppe, Brüstung, genieteter Bogen, Laterne
function bridge(w,we){ var x, y, c, s=STAIR; w.g=RG.bridge; w.s=0;
  // Bogen (zwei Gurte, Gitterwerk), angeschnitten: steigt nach rechts aus dem Bild
  function chord(u){ return 58-Math.sin(cl((u-410)/150,0,1)*Math.PI*0.5)*44; }
  for (x=410;x<W;x++){ var yt=rd(chord(x)), yb=rd(chord(x)+7);
    for (y=yt;y<=yt+2;y++) w.px(x,y,(y===yt)?P.m3:P.m1); for (y=yb;y<=yb+2;y++) w.px(x,y,(y===yb)?P.m2:P.k2);
    if (x%3===0){ w.px(x,yt+1,P.m4); w.px(x,yb+1,P.m3); }                                                   // Nieten
    var ph=(x-410)%10; if (ph<2) for (y=yt+3;y<yb;y++) w.px(x+((y-yt)>>1)*(ph?1:0),y,P.m1);
    w.s=1; w.px(x,yt-1,P.s6); w.s=0; }
  for (x=414;x<W;x+=10) w.line(x,rd(chord(x))+3,x+9,rd(chord(x+9))+7,P.m2);
  // Fahrbahn und Brüstung der Brücke oben
  for (x=452;x<W;x++){ for (y=s.y1;y<s.y1+5;y++) w.px(x,y,(y===s.y1)?P.s4:P.m2); for (y=s.y1-8;y<s.y1;y++) if ((x%4)===0||y===s.y1-8) w.px(x,y,P.m1); w.s=1; w.px(x,s.y1-9,P.s6); w.s=0; }
  // Laterne auf der Brücke
  var lx=468; w.vl(lx,s.y1-34,s.y1-1,P.m1); w.vl(lx+1,s.y1-34,s.y1-1,P.m2); w.rect(lx-2,s.y1-40,6,6,P.m1); w.rect(lx-1,s.y1-39,4,4,P.m3); w.hl(lx-3,lx+4,s.y1-41,P.m1); w.px(lx,s.y1-42,P.m1);
  w.s=1; w.hl(lx-3,lx+4,s.y1-42,P.s6); w.s=0; LAMPS.push([lx,s.y1-37]);
  // Treppe: Stufen von links unten nach rechts oben (frontal gestaffelt), Handlauf links
  var n=14, sxw=(s.x1-s.x0)/n, syh=(s.y0-s.y1)/n;
  for (var i=0;i<n;i++){ var tx0=rd(s.x0+i*sxw), ty=rd(s.y0-(i+1)*syh), th=rd(s.y0-i*syh)-ty;
    for (y=ty;y<ty+th;y++) for (x=tx0;x<W;x++){ var d=y-ty; c=(d===0)?P.s4:((d===1)?P.m4:P.m3); if (d>=2 && d===th-1) c=P.m2; if (x===tx0 && d>0) c=P.m2; w.px(x,y,c); }
    if (we!=='thaw'){ w.s=1; for (x=tx0;x<W;x++){ var trod=(x-tx0)>5 && (x-tx0)<15; w.px(x,ty,trod?P.n5:P.s6); if (!trod && hash(x,i)<0.5) w.px(x,ty-1,P.s6); } w.s=0; }
    else for (x=tx0+6;x<tx0+15;x++) w.px(x,ty,P.m2); }
  w.line(s.x0+2,s.y0-16,s.x1,s.y1-16,P.m3); w.line(s.x0+2,s.y0-15,s.x1,s.y1-15,P.m1);
  for (i=0;i<=n;i+=3){ var px=rd(s.x0+2+i*sxw), py=rd(s.y0-i*syh); w.vl(px,py-15,py-1,P.m1); }
  w.s=1; w.line(s.x0+2,s.y0-17,s.x1,s.y1-17,P.s6); w.s=0; }
var LAMPS=[];

// ---------------------------------------------------------------- zwei gemalte Reisende mit Koffern
function traveler(w,x,by,coat,hat,dir){ w.g=RG.prop; w.s=0; var f=dir||1;
  w.rect(x-2,by-15,5,11,coat); w.vl(x-2,by-15,by-5,M.UP[coat]); w.rect(x-1,by-4,1,4,P.k1); w.rect(x+1,by-4,1,4,P.k1); w.rect(x-1,by-18,3,3,P.p3); w.hl(x-1,x+1,by-19,hat); w.px(x,by-20,hat);
  var sx=x+4*f; w.line(x+2*f,by-11,sx,by-8,P.k1); w.rect(sx-(f<0?4:0),by-8,5,7,P.r2); w.hl(sx-(f<0?4:0),sx+(f<0?0:4),by-8,P.r3); w.px(sx-(f<0?3:1),by,P.k1); }

// ---------------------------------------------------------------- Bild
var BASE=null, LIT=[], WE='snowlie', BUSIN=false;
function lightsFor(tod,S){ if (tod==='day') return []; var L=[];
  for (var x=20;x<BX1-12;x+=26) L.push([x+6,70,22,22,0.5]);
  var notBus=function(X,Y){ var g=REG[Y*W+X]; return g!==RG.bus; };
  L.push([70,90,30,16,0.7,notBus],[LAMP.x-9,LAMP.top+8,40,60,0.75],[LAMP.x-9,124,46,14,0.45],[468,24,26,30,0.6],[(BOARD.x0+BOARD.x1)/2,74,24,20,0.45],[TAXI.x0+29,82,10,8,0.4]);
  if (S.busIn) L.push([140,66,84,10,0.3,function(X,Y){ return REG[Y*W+X]===RG.bus; }]);
  return L; }
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k;
  WE=we; HZWIDE=(we==='snowlie'||we==='sun'||we==='frost'); BUSIN=!!S.busIn; REG.fill(0); SNW.fill(0); WINS=[]; LAMPS=[];
  paintSky(w,tod,we);
  paintFar(w,we);
  building(w,tod,we);
  ground(w,we,S);
  bridge(w,we);
  traveler(w,334,GB+2,P.c2,P.k2,-1); traveler(w,442,93,P.g2,P.r2,1);
  paintTaxi(w,we);
  if (BUSIN){ paintBus(w,we,tod); busSignText(w,false); }
  props(w,we,tod); bench(w,we); pile(w,we);
  // Dunst: Ferne verschwindet bei Schneefall und Nebel
  var fk={snow:[0.55,0.4,0.22,0.08,0.05],fog:[0.9,0.75,0.5,0.32,0.22],thaw:[0.4,0.28,0.12,0.05,0.04],snowlie:[0.22,0.12,0.04,0,0],sun:[0.16,0.08,0.02,0,0],frost:[0.18,0.1,0.03,0,0]}[we];
  var fc=tod==='night'?(we==='fog'?P.m1:P.n0):(we==='fog'?P.m4:(we==='thaw'?P.m3:(we==='snow'?P.m4:P.b4)));
  haze(b,function(xx,yy){ var g=REG[yy*W+xx]; if (g===RG.far) return fk[0]; if (g===RG.mid) return fk[1]; if (g===RG.bld||g===RG.glass) return fk[2]+(GB-yy)*0.002; if (g===RG.bridge) return fk[3]; if (g===RG.road||g===RG.bus||g===RG.prop) return fk[4]*0.6; return 0; },{col:fc});
  if (we==='thaw'){ puddleReflect(b); wetReflect(b); }
  // Kontaktschatten und Tageslicht
  M.light(b,M.lf.sum(M.lf.pool((BUS.x0+BUS.x1)/2,BUS.base+1,96,4,BUSIN?-1:0),M.lf.pool(TAXI.x0+28,TAXI.base+1,30,3,-0.9),M.lf.pool(PIL.x0+13,PIL.base+1,18,3,-0.8),
    function(xx,yy){ return (yy>58 && yy<GB+2 && xx<BX1)?-0.35:0; },M.lf.k(we==='thaw'?-0.2:(we==='sun'?0.15:0))),0,0,function(xx,yy){ return REG[yy*W+xx]!==RG.sky; });
  if (we==='sun') for (k=0;k<W*H;k++){ if (SNW[k] && hash(k%W,(k/W)|0)<0.012) b.d[k]=P.l1; }
  BASE=b.clone(); LIT=lightsFor(tod,S);
  shade(b,0,0,tod,LIT,true);
  if (tod!=='day') afterLights(b,tod,S,we);
  else dayLights(b,S);
  return b; }
function dayLights(b,S){ WINS.forEach(function(q){ if (q[5]==='wait'){ for (var y=q[1];y<q[1]+q[3];y++) for (var x=q[0];x<q[0]+q[2];x++){ var c=BASE.get(x,y); if (c===P.w2||c===P.w1) b.px(x,y,bayer(x,y)<0.4?P.y2:c); } } }); }
function afterLights(b,tod,S,we){ var w={px:function(x,y,c){ b.px(x,y,c); },get:function(x,y){ return b.get(x,y); },rect:function(x,y,ww,hh,c){ b.rect(x,y,ww,hh,c); }};
  WINS.forEach(function(q){ if (q[5]==='wait'){ for (var y=q[1];y<q[1]+q[3];y++) for (var x=q[0];x<q[0]+q[2];x++){ var c=BASE.get(x,y); if (c===P.w2||c===P.w1||c===P.w0) b.px(x,y,c===P.w2?(bayer(x,y)<0.5?P.y4:P.y3):(c===P.w1?P.y2:P.y1)); } return; }
    if (q[4]>0.62 && (REG[q[1]*W+q[0]]===RG.far||REG[q[1]*W+q[0]]===RG.bld)) b.px(q[0],q[1],q[4]>0.85?P.y4:P.y3); });
  for (var x=8;x<BX1-12;x+=26){ for (var xx=x;xx<=x+12;xx++){ if (REG[56*W+xx]!==RG.bld) continue; b.px(xx,56,P.l1); b.px(xx,57,P.y4); } }
  LAMPS.forEach(function(l){ b.rect(l[0]-1,l[1]-2,4,4,P.y4); b.px(l[0],l[1]-1,P.l1); });
  b.hl(LAMP.x-12,LAMP.x-6,LAMP.top+2,P.l1); b.hl(LAMP.x-11,LAMP.x-7,LAMP.top+3,P.y4);
  boardRows(w,0,true); sign(w,'ABFAHRT',BOARD.x0+3,BOARD.y0+2,P.s6);
  b.rect(TAXIP.sign[0],TAXIP.sign[1],11,4,P.y4); M.microText(b,'TAXI',TAXIP.sign[0],TAXIP.sign[1],P.k1);
  if (S.busIn){ busSignText(w,true); BUSWIN.forEach(function(p){ b.px(p[0],p[1],P.y2); b.px(p[0]+1,p[1],P.y1); }); }
  if (we==='fog'){ LAMPS.forEach(function(l){ halo(b,l[0],l[1],14,0.9); }); halo(b,LAMP.x-9,LAMP.top+2,18,1); halo(b,70,84,22,0.6); } }

// ---------------------------------------------------------------- Ebene: Betonpfeiler (Figuren gehen davor und dahinter vorbei)
function pillarLayer(S,GS,tod){ var we=weaOf(GS), x0=PIL.x0, x1=PIL.x1, by=PIL.base, L=M.layer(x0-2,0,x1-x0+5,by+2,by), wr=M.lw(L), x, y;
  for (y=0;y<by;y++) for (x=x0;x<x1;x++){ var u=x-x0, c=tex(u,y); wr.px(x,y,c); }
  function tex(u,y){ var wd=x1-x0, c=ra(R('s2 s3 s4'),0.55+(fbm(u*0.15,y*0.05,5)-0.5)*0.35-(u/wd)*0.35,x0+u,y); if (u<2) c=P.s5; else if (u===2) c=P.s4; if (u>=wd-3) c=(u===wd-1)?P.m1:P.s2;
    if ((y%16)===0 && u>1) c=P.s2; if ((y%16)===8 && (u===6||u===wd-7)) c=P.m1; if (y>by-14 && fbm(u*0.5,y*0.5,9)>0.6) c=P.m3; return c; }
  for (x=x0;x<x1;x++) if (hash(x,5)<0.6){ wr.px(x,by-1,P.m1); }
  // Schnee am Fuß, ein Schild „Rauchen verboten“ wäre zu viel – nur zwei alte Dübel, wo das Schild der Bude hing
  wr.px(x1-2,70,P.t1); wr.px(x1-2,76,P.t1);
  if (we!=='thaw'){ for (x=x0-2;x<x1+2;x++){ var hh=Math.floor(hash(x,2)*3); for (y=by-hh;y<by;y++) wr.px(x,y,P.s6); } }
  if (tod!=='day') shadeL(L,tod);
  else if (we==='fog'||we==='snow') haze(L,function(){ return we==='fog'?0.18:0.06; },{col:P.m4});
  return L; }
function shadeL(L,tod){ var key=nkey(tod); if (!key) return; var Lv=levels(key), n=Lv.length;
  for (var y=0;y<L.h;y++) for (var x=0;x<L.w;x++){ var k=y*L.w+x, c=L.d[k]; if (c===T) continue; var X=x+L.ox, Y=y+L.oy, f=lightAt(LIT,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; L.d[k]=M.tintPx(Lv[i],c,X,Y); } }
function layers(S,GS,tod){ return [pillarLayer(S,GS,tod)]; }

// ---------------------------------------------------------------- jedes Bild: Anzeige blättert, Abgas, Blinklicht, Schnee, Nebel, Glitzern, Tropfen, Feuerwerk
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
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, tod=v.tod, we=WE, i, x, y;
  var tint=tod!=='day'?levels(nkey(tod)||'night')[1]:null;
  function px(X,Y,c,raw){ X=rd(X)-cam; Y=rd(Y); if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,(tint&&!raw)?M.tintPx(tint,c,X,Y):c); }
  // Anzeige blättert alle sechs Sekunden
  var page=Math.floor(t/6)%2, fl=(t%6)<0.12, bx=BOARD.x0-cam; if (bx>-60 && bx<fb.w){ var o={px:function(X,Y,c){ px(X,Y,c,true); },rect:function(X,Y,w2,h2,c){ for (var yy=Y;yy<Y+h2;yy++) for (var xx=X;xx<X+w2;xx++) px(xx,yy,c,true); }};
    if (fl) o.rect(BOARD.x0+2,BOARD.y0+8,BOARD.x1-BOARD.x0-4,BOARD.y1-BOARD.y0-10,P.k1); else boardRows(o,page,tod!=='day'); }
  // Abgas am Bus
  if (BUSIN) for (i=0;i<9;i++){ var ph=(t*0.4+i/9)%1, ex=BUS.x0-2-ph*14+Math.sin(t+i)*1.5, ey=BUS.base-6-ph*16; if (bayer(rd(ex-cam)&7,rd(ey)&7)<0.7-ph*0.65) px(ex,ey,tod==='day'?(ph<0.4?P.s4:P.s5):P.m2); }
  // Blinklicht am Taxi (Warnblinker)
  if ((t%1)<0.5) TAXIP.blink.forEach(function(q){ px(q[0],q[1],P.y5,true); px(q[0]+1,q[1],P.y4,true); px(q[0],q[1]+1,P.t4,true); });
  // Tauwetter: Tropfen vom Vordach, Ringe in Pfützen
  if (we==='thaw'){ for (i=0;i<6;i++){ var dx=20+i*52+Math.floor(hash(i,3)*20), per=1.3+hash(i,4), q=(t/per+hash(i,5))%1, dy=60+q*q*(GB-60); if (dx>BUS.x0-4 && dx<BUS.x1+4 && BUSIN) continue; px(dx,dy,P.s5); px(dx,dy-1,P.m4); }
    for (var j=0;j<PUD.length;j++){ var pd=PUD[j], ph2=(t*0.7+j*0.3)%1, rr=1+ph2*5; for (var a=0;a<14;a++){ var an=a/14*Math.PI*2, X=pd[0]+Math.cos(an)*rr, Y=pd[1]+Math.sin(an)*rr*0.3; if (inPud(rd(X),rd(Y)) && ph2<0.8) px(X,Y,P.m3); } } }
  // Sonne: Glitzern im Schnee
  if (we==='sun') for (i=0;i<14;i++){ var gx=Math.floor(hash(i,41)*W), gy=PLAT+2+Math.floor(hash(i,42)*28); if (Math.sin(t*3.1+i*2.3)>0.82) px(gx,gy,P.l1,true); }
  // Feuerwerk über den Gleisen
  if (fwOn(S,GS)) fireworks(fb,t,cam,BX1+6,6,W-6,46,3,11,function(X,Y){ var k=Y*W+X; return X>=0&&X<W&&REG[k]===RG.sky; }); }
function front(fb,v,S,GS){ var we=WE, tod=v.tod;
  if (we==='snow') M.snow(fb,v.t,{n:110,cam:v.cam,wind:5,col:tod==='day'?P.s6:P.s5,col2:tod==='day'?P.s5:P.n4});
  else if (we==='fog') fogFront(fb,v.t,{y0:20,y1:144,amt:0.32,k:2,col:tod==='day'?P.m4:P.m1,cam:v.cam,speed:4}); }
// Geistersicht: die Bude am Pfeiler mit Schalterfenster und „FAHRKARTEN“
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, b=BOOTH, x, y;
  function gp(X,Y,c,a){ var sx=X-cam; if (sx<0||sx>=320||Y<0||Y>=144) return; if (a!==undefined && bayer(sx,Y+Math.floor(t*2))>a) return; fb.d[Y*320+sx]=c; }
  var al=0.75+0.15*Math.sin(t*0.9);
  // Dach mit Überstand, Wände, Schalterfenster, Ablage
  for (x=b.x0-3;x<=b.x1+2;x++){ gp(x,b.top,P.x5,al); gp(x,b.top+1,P.x3,al); }
  for (y=b.top+2;y<b.base;y++){ gp(b.x0,y,P.x4,al); gp(b.x1-1,y,P.x4,al); for (x=b.x0+1;x<b.x1-1;x++) if ((y<b.top+11||y>b.top+27) && bayer(x-cam,y)<0.16) gp(x,y,P.x2); }
  for (x=b.x0+5;x<b.x1-5;x++){ gp(x,b.top+11,P.x4,al); gp(x,b.top+27,P.x5,al); gp(x,b.top+28,P.x3,al*0.8); }
  gp(b.x0+5,b.top+12,P.x4,al); gp(b.x1-6,b.top+12,P.x4,al); for (y=b.top+12;y<b.top+27;y++){ gp(b.x0+5,y,P.x3,al*0.7); gp(b.x1-6,y,P.x3,al*0.7); }
  var tw=M.microWidth('FAHRKARTEN'), tx=rd((b.x0+b.x1)/2-tw/2); M.microText({px:function(X,Y,c){ gp(X,Y,c,0.92); }},'FAHRKARTEN',tx,b.top+4,P.x6);
  // ein paar Zettel und ein Fahrplan am Rand der Bude
  for (y=b.top+14;y<b.top+24;y+=3){ gp(b.x0+2,y,P.v3,al); gp(b.x0+3,y,P.v4,al); }
  for (var i=0;i<6;i++){ var sx=b.x0+8+Math.floor(hash(i,3)*(b.x1-b.x0-16)), sy=b.top+31+Math.floor(hash(i,4)*12); gp(sx,sy,P.x3,0.5+0.3*Math.sin(t+i)); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<112||y>140||x<6||x>474) return false;
  if (x>=PIL.x0-2 && x<=PIL.x1+2 && y<PIL.base+2) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.by+2) return false;
  if (x>=PILE.x0-2 && x<=PILE.x1+1 && y<PILE.by+2) return false;
  if (x>=STAIR.x0+6 && y<114) return false;
  return true; }
M.defineArt('zob',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day'){ var we=weaOf(GS); return we==='fog'?FOGLUT():null; } var key=nkey(tod); if (!key) return null; var Lv=levels(key), l=lightAt(LIT,a.x,a.y-22); return Lv[Math.max(1,Math.min(Lv.length-1,Math.round(l*(Lv.length-1))))].a; },
  spots:{
    exit:[0,70,10,74],
    to_bridge:[STAIR.x0-4,STAIR.y1-40,W-STAIR.x0+4,STAIR.y0-STAIR.y1+42],
    bus:[BUS.x0-2,BUS.top-3,BUS.x1-BUS.x0+10,BUS.base-BUS.top+5],
    board:[BOARD.x0-1,BOARD.y0-3,BOARD.x1-BOARD.x0+2,BOARD.base-BOARD.y0+3],
    pillar:[PIL.x0-2,22,PATCH.x1-PIL.x0+2,PATCH.y1-22],
    taxi:[TAXI.x0-2,TAXI.base-28,TAXI.x1-TAXI.x0+4,30],
    bench:[BENCH.x0-1,BENCH.by-21,BENCH.x1-BENCH.x0+2,23],
    shops:[232,58,BX1-238,44],
    hbf_view:[BX1+2,40,66,48],
    snow:[PILE.x0-2,PILE.by-16,PILE.x1-PILE.x0+4,18]
  },
  stands:{ exit:[8,126,'L'], to_bridge:[458,120,'R'], bus:[150,120,'B'], board:[278,120,'B'], pillar:[88,126,'L'], taxi:[398,120,'B'], bench:[322,123,'B'], shops:[300,126,'B'], hbf_view:[404,124,'B'], snow:[349,124,'B'] },
  actorPos:{ wastl:[372,120,'L','wastl'], hansi:[60,121,'F','hansi',true], mala:[BUS.door+4,117,'R'] },
  start:[BUS.door+24,121,'R'], entries:{ map:[16,124,'R'], hacker:[462,122,'L'] }
});
var FL=null; function FOGLUT(){ if (FL) return FL; FL=M.tintMake(function(r,g,b){ var q=M.RGB[P.s4]; return [r+(q[0]-r)*0.18,g+(q[1]-g)*0.18,b+(q[2]-b)*0.18]; }).a; return FL; }
})(M);
