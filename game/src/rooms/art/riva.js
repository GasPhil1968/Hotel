/* ===== rooms/art/riva.js — Die Riva und die Mole (640 px, scrollend) =====
   Links die Promenade mit poliertem Kalksteinpflaster vor der Südfront des Diokletianpalastes, darüber der
   Glockenturm von Sveti Duje, davor Palmen, Bänke und Laternen; bei x≈248–336 das Hafenbüro (Lučka kapetanija).
   Rechts die Mole ins Hafenbecken mit Pollern, Bank und Laterne am Ende, dahinter das Becken, Fähren und Brač.
   Wasser, Spiegelungen, Möwen, Flagge, Gischt und die einlaufende Fähre (S.ferryAt) laufen in dynamic. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=640, H=144;
// ---------------------------------------------------------------- Geometrie
var HZ=76;                 // Horizont (rechts, offenes Meer)
var PAL1=246;              // Palastfront x 0..246
var OF0=248, OF1=336;      // Hafenbüro
var PB=100;                // hintere Pflasterkante an den Gebäuden
var QY=136;                // vordere Kaikante (Oberkante)
var FW=140;                // Wasser vorn ab y
var MX0=402, MX1=634;      // Mole
var MB=104, MF=126, MW=132;// Mole: hintere Kante, vordere Kante, Wasserlinie der Stirnseite
var TWX=157;               // Glockenturm (Mitte)
var PALMS=[{x:30,h:62,s:3},{x:106,h:66,s:11},{x:208,h:61,s:5},{x:372,h:64,s:17}];
var LAMPS=[68,132,238,322,397];
var LH=44, LB=105;         // Laternenhöhe, Fußpunkt
var BENCH=[146,174];       // die Bank für das Nachtgespräch (x0,x1)
var BENCH2=[218,242];
var MBENCH=[498,528];      // Bank auf der Mole
var MLAMP=628, MLB=116, MLH=50;   // Laterne am Molenende
var IBOL=610;              // Ivkas Poller (hintere Kante)
var FERRY_END=518;         // dort kommt die Fähre zum Stehen (Bug)
var FLAG=[350,26];         // Fahnenspitze am Hafenbüro
// ---------------------------------------------------------------- Masken (vom letzten paint)
// FAR: 0 = Vordergrund (wird umgefärbt), 1 = Himmel, 2 = Berge/Inseln, 3 = Becken, 4 = Wasser vorn
var FAR=new Uint8Array(W*H), WM=new Uint16Array(W*H), OBJ=new Uint8Array(W*H), WIN=[], FWIN=[], LIT={tod:'day',wea:'calm'};
function track(b){ b.code=0; b.wcode=0; b.ocode=0;
  b.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; this.d[k]=c; FAR[k]=this.code; WM[k]=this.wcode; OBJ[k]=this.ocode; };
  b.rect=function(x,y,w,h,c){ for (var j=Math.max(0,y|0);j<Math.min(H,(y|0)+h);j++) for (var i=Math.max(0,x|0);i<Math.min(W,(x|0)+w);i++){ var k=j*W+i; this.d[k]=c; FAR[k]=this.code; WM[k]=this.wcode; OBJ[k]=this.ocode; } };
  return b; }
function glass(b,x,y,w,h,kind,s,fn){ WIN.push({x:x,y:y,w:w,h:h,k:kind,s:s}); b.wcode=WIN.length; for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,fn(xx,yy)); b.wcode=0; }
// ---------------------------------------------------------------- kleine Helfer
function R(s){ return M.R(s); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57;
  var a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03,y*2.03,s+3)*0.3+vn(x*4.1,y*4.1,s+7)*0.15; }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

// ---------------------------------------------------------------- Himmel
function glowX(x){ return Math.exp(-Math.pow((x-560)/150,2)); }   // hellster Teil des Abendhimmels über dem Meer
function paintSky(b,tod,wea){ var rain=wea==='rain', r, x, y, v;
  if (rain && tod!=='night'){ r=R(tod==='day'?'m2 m3 s3 m4 s4':'k2 d0 m0 d1 m1 m2 d2 d3');
    for (y=0;y<HZ;y++) for (x=0;x<W;x++){ var n=fbm(x/52,y/8,4), n2=fbm(x/19,y/4.5,9); v=0.12+Math.pow(y/HZ,1.2)*0.62+(n-0.5)*0.5+(n2-0.5)*0.16+glowX(x)*0.08*(y/HZ); b.px(x,y,ra(r,v,x,y)); }
    return; }
  if (tod==='dusk'){ r=R('d0 d1 d2 d3 d4 d5 d6');
    for (y=0;y<HZ;y++){ var t=y/(HZ-1); for (x=0;x<W;x++){ v=Math.pow(t,1.25)*0.86+glowX(x)*0.16*t*t+(1-glowX(x))*-0.04*t; b.px(x,y,ra(r,v,x,y)); } }
    // Wolkenbänke: dunkle Körper, von unten angeleuchtet
    var C=R('d1 d2 d3 d4 d5 d6');
    for (y=6;y<HZ-6;y++) for (x=0;x<W;x++){ var cy=fbm(x/90,y/5.5,2), m=cy-0.58+Math.sin(x*0.004+y*0.3)*0.02; if (m<=0) continue; var below=fbm(x/90,(y+2)/5.5,2)-0.58;
      var lv=0.08+y/HZ*0.5+glowX(x)*0.1; if (below<=0) lv+=0.38+glowX(x)*0.15; else if (fbm(x/90,(y-2)/5.5,2)-0.58<=0) lv+=0.12;
      b.px(x,y,ra(C,lv,x,y)); }
    return; }
  var G={ day:'b1 b2 b3 b4 b5', night:'k1 k2 n0 n1 n2', dawn:'n1 n2 d2 d3 d4 d5' }[tod]||'b1 b2 b3 b4 b5';
  r=R(rain?'k1 k2 m0 n0 m1':G);
  for (y=0;y<HZ;y++){ var t2=y/(HZ-1); v=tod==='day'?0.06+t2*0.94:Math.pow(t2,1.8); for (x=0;x<W;x++) b.px(x,y,ra(r,v,x,y)); }
  if (tod==='day'){ var D=R('b3 b4 b5 s6');   // Bura: klar, ein paar Fetzen über den Bergen
    for (y=4;y<44;y++) for (x=0;x<W;x++){ var q=fbm(x/34,y/5,6)-0.66-(x>360?0.1:0); if (q<=0) continue; if (q<0.03&&bayer(x,y)>q/0.03) continue; b.px(x,y,ra(D,0.35+q*5,x,y)); } }
  if (tod==='night'||tod==='dawn'){ var rr=M.rng(91);
    for (var i=0;i<380;i++){ var sx=Math.floor(rr()*W), sy=Math.floor(Math.pow(rr(),1.4)*(HZ-10)), q2=rr(); if (q2<0.06) b.px(sx,sy,P.n5); else if (q2<0.35) b.px(sx,sy,P.n4); else b.px(sx,sy,P.n3); if (q2<0.015){ b.px(sx-1,sy,P.n3); b.px(sx+1,sy,P.n3); b.px(sx,sy-1,P.n3); b.px(sx,sy+1,P.n3); } }
    if (tod==='night' && !rain){ var mx=574, my=18;
      b.ellipse(mx+0.5,my+0.5,9,9,function(x,y){ return bayer(x,y)<0.3?P.n2:undefined; });
      b.ellipse(mx+0.5,my+0.5,5.2,5.2,function(x,y){ var dx=x+0.5-mx, dy=y+0.5-my; if (dx*0.7+dy*0.7>2.2) return P.n4; return (dx*dx+dy*dy<6&&dx<1)?P.l1:P.n5; });
      b.px(mx-2,my+1,P.n4); b.px(mx+1,my-2,P.n4); b.px(mx,my+2,P.n4); } } }

// ---------------------------------------------------------------- Ferne: Berge hinter der Stadt, Inseln
function farCols(tod,wea,near){ var rain=wea==='rain';
  if (rain) return tod==='night'?R('k1 k2 m0'):R(near?'d0 d1 m1':'d1 m1 d2');
  if (near) return { day:R('b1 b2 b3'), dusk:R('d0 d1 d2'), night:R('k1 k2 n0'), dawn:R('n0 n1 n2') }[tod]||R('b1 b2 b3');
  return { day:R('b2 b3 b4'), dusk:R('d1 d2 d3'), night:R('k2 n0 n1'), dawn:R('n1 n2 d2') }[tod]||R('b2 b3 b4'); }
function paintMountains(b,tod,wea){ var c=farCols(tod,wea,false);
  for (var x=0;x<400;x++){ var ridge=37+Math.sin(x*0.011+1.3)*5+Math.sin(x*0.034+0.4)*2.6+Math.sin(x*0.093)*1.1+(x>300?Math.pow((x-300)/100,2)*36:0);
    for (var y=Math.round(ridge);y<HZ;y++){ var v=0.7-(y-ridge)/22+(fbm(x/9,y/5,12)-0.5)*0.3; if (y===Math.round(ridge)) v=0.95; b.px(x,y,ra(c,v,x,y)); } } }
function brac(x){ if (x<392||x>606) return 0; var t=(x-392)/214; return Math.max(0,Math.round(Math.sin(Math.min(1,t*4)*Math.PI*0.5)*6.5+Math.sin(x*0.045+1)*1.4+Math.sin(x*0.15)*0.5+Math.max(0,1.6-Math.abs(x-470)/14)*1.4-(t>0.86?(t-0.86)*44:0))); }
function solta(x){ if (x<614) return 0; return Math.max(0,Math.round(Math.sin(Math.min(1,(x-614)/20)*Math.PI*0.5)*3.6+Math.sin(x*0.2)*0.4)); }
function paintIslands(b,tod,wea){ var c=farCols(tod,wea,true);
  for (var x=386;x<W;x++){ var h=Math.max(brac(x),solta(x)); for (var y=HZ-h;y<HZ;y++){ var v=0.5-(y-(HZ-h))*0.07; if (y===HZ-h) v=0.95; b.px(x,y,ra(c,v,x,y)); } } }

// ---------------------------------------------------------------- Wasser (gleiche Formel für paint und dynamic)
var WR={ day:'a1 b0 a2 a3 a4 a5 a6', dusk:'k2 d0 d1 d2 d3 d4 d5 d6', night:'k0 k1 a0 n0 a1 n1 n2 n3', dawn:'n0 n1 a2 n2 d3 a4 d4', rain:'k2 d0 m0 d1 m1 m2 d2 m3', rainN:'k0 k1 m0 n0 m1 n1' };
var WRC={}; function wramp(tod,wea){ var k=wea==='rain'?(tod==='night'?'rainN':'rain'):tod; return WRC[k]||(WRC[k]=R(WR[k]||WR.day)); }
function wdepth(kind,y){ return kind===3?clamp((y-HZ)/(MB-HZ),0,1):1; }
function wbase(kind,y,tod,wea,x){ var d=wdepth(kind,y), n=0;
  if (kind===4){ var e=(y-MW)/(H-MW); if (tod==='dusk') return 0.3-e*0.12; if (tod==='night') return 0.32-e*0.12; return 0.4-e*0.12; }
  if (tod==='dusk') n=0.92-Math.pow(d,0.7)*0.58+glowX(x)*0.06*(1-d);
  else if (tod==='night') n=0.62-d*0.34;
  else if (wea==='rain') n=0.78-d*0.4;
  else n=0.8-Math.pow(d,0.8)*0.5;
  if (y<HZ+4 && (brac(x)||solta(x))) n-=0.09*(HZ+4-y)/4;   // Spiegelung der Inseln
  return n; }
function wcol(wx,y,t,kind,tod,wea,rmp){ var d=wdepth(kind,y), bura=wea==='bura', st=1/(rmp.length-1);
  var per=5+d*24+(kind===4?14:0), dir=(hash(y,kind*3)<0.5)?1:-1, spd=(bura?10:4)*(0.35+d)*dir, ph=hash(y,kind+7)*40;
  var u=(wx+t*spd+ph)/per, s=Math.sin(u*6.2832), s2=Math.sin((wx-t*spd*0.5+ph*3)/(per*2.7)*6.2832);
  var n=rmp.length-1, v=wbase(kind,y,tod,wea,wx)*n, i=Math.floor(v), f=v-i;
  if (f>bayer(Math.floor((wx+ph*7)/3),y)) i++;
  if (s>0.68-s2*0.22) i+=1; else if (s<-0.74+s2*0.12) i-=1;
  var c=rmp[i<0?0:(i>n?n:i)];
  if (bura && s>0.93 && s2>0.35 && (y&1)===0) c=(tod==='night'?P.n4:(tod==='dusk'?P.d6:P.s6));
  return c; }
function paintWater(b,tod,wea){ var rmp=wramp(tod,wea), x, y;
  b.code=3; for (y=HZ;y<=MB;y++) for (x=338;x<W;x++) b.px(x,y,wcol(x,y,0,3,tod,wea,rmp));
  for (y=MB+1;y<H;y++) for (x=MX1;x<W;x++) b.px(x,y,wcol(x,y,0,3,tod,wea,rmp));
  b.code=4; for (y=MW;y<H;y++) for (x=MX0;x<MX1;x++) b.px(x,y,wcol(x,y,0,4,tod,wea,rmp));
  for (y=FW;y<H;y++) for (x=0;x<MX0;x++) b.px(x,y,wcol(x,y,0,4,tod,wea,rmp));
  b.code=0; }

// ---------------------------------------------------------------- Glockenturm von Sveti Duje
var TWM=null;
function tower(b,tod){ var cx=TWX, S6=R('s1 s2 s3 s4 s5 s6'), x, y;
  function wall(x,y,x0,x1){ var u=(x+0.5-x0)/(x1-x0+1); var v=0.86-u*0.46+(hash(Math.floor(x/4)+Math.floor(y/3)*7,3)-0.5)*0.1; if ((y%4)===0) v-=0.1; return ra(S6,v,x,y); }
  function level(y0,y1,hw,n,kind){ var x0=cx-hw, x1=cx+hw, yy, xx;
    for (yy=y0;yy<y1;yy++) for (xx=x0;xx<=x1;xx++) b.px(xx,yy,wall(xx,yy,x0,x1));
    // Eckpilaster
    for (yy=y0+2;yy<y1;yy++){ b.px(x0,yy,P.s5); b.px(x0+1,yy,P.s6); b.px(x1,yy,P.s2); b.px(x1-1,yy,P.s3); }
    // Gesims
    b.hl(x0-1,x1+1,y0,P.s6); b.hl(x0-1,x1+1,y0+1,P.s4); b.hl(x0,x1,y0+2,P.s1); b.px(x0-1,y0+1,P.s3); b.px(x1+1,y0+1,P.s2);
    // Öffnungen
    var span=x1-x0-4, ow=Math.floor((span-(n-1)*2)/n), oy0=y0+4, oy1=y1-1;
    for (var i=0;i<n;i++){ var ox=x0+3+i*(ow+2);
      for (yy=oy0;yy<oy1;yy++) for (xx=ox;xx<ox+ow;xx++){ var dx=(xx+0.5-(ox+ow/2))/(ow/2), top=oy0+Math.round((1-Math.sqrt(Math.max(0,1-dx*dx)))*Math.min(3,ow/2)); if (yy<top) continue;
        var c=P.k1; if (yy===top||xx===ox) c=P.s0; else if (yy>oy1-3) c=P.k2; if (kind==='bell' && yy>top+1 && yy<top+5 && Math.abs(xx+0.5-(ox+ow/2))<2) c=(yy===top+2)?P.y1:P.w0; b.px(xx,yy,c); }
      // Bogenlaibung hell
      for (xx=ox-1;xx<=ox+ow;xx++){ var dx2=(xx+0.5-(ox+ow/2))/(ow/2+1), tp=oy0-1+Math.round((1-Math.sqrt(Math.max(0,1-dx2*dx2)))*Math.min(3,ow/2)); if (tp>=oy0-1) b.px(xx,tp,P.s5); }
      if (kind==='bif' && ow>=5){ b.vl(ox+(ow>>1),oy0+3,oy1-1,P.s4); b.px(ox+(ow>>1),oy0+2,P.s5); }
      if (i>0) b.vl(ox-1,oy0+1,oy1-1,P.s5); }
    b.hl(x0,x1,y1-1,P.s2); }
  // Kreuz und Pyramide
  b.vl(cx,0,6,P.m1); b.hl(cx-2,cx+2,2,P.m1); b.px(cx,7,P.s3);
  for (y=8;y<20;y++){ var hw=Math.round((y-7)*0.72); for (x=cx-hw;x<=cx+hw;x++){ var lit=x<cx-hw*0.15, edge=(x===cx-hw); b.px(x,y,edge?P.s6:(lit?(bayer(x,y)<0.25?P.s4:P.s5):(bayer(x,y)<0.5?P.s2:P.s3))); } }
  level(20,30,9,2,'bell');
  level(30,40,11,3,'arch');
  level(40,50,12,2,'bif');
  level(50,60,13,2,'bif'); }

// ---------------------------------------------------------------- Palastfront
var SHOPS=[[12,30],[42,62],[74,96],[132,150],[164,186],[198,218],[226,244]];
var GATE=[110,124];
function palace(b,tod){ var x, y, A=R('s1 s2 s3 s4 s5'), r=M.rng(5);
  // Häuser auf der Mauer (Dachlandschaft)
  var hx=0, blocks=[];
  while (hx<PAL1){ var w=14+Math.floor(r()*16), top=37+Math.floor(r()*9); if (hx+w>PAL1-6) w=PAL1-hx; blocks.push([hx,w,top]); hx+=w; }
  var PL=[R('s3 s4 s5'),R('e3 e4 s5'),R('t3 t4 t5'),R('s2 s3 s4'),R('e2 e3 e4'),R('s3 s4 s5')];
  blocks.forEach(function(k,i){ var x0=k[0], w=k[1], top=k[2], pl=PL[Math.floor(hash(i,3)*PL.length)];
    if (x0<TWX+16 && x0+w>TWX-16) top=Math.max(top,49);   // vor dem Turm niedrig
    for (var yy=top;yy<56;yy++) for (var xx=x0;xx<x0+w;xx++){ var c=tex.plaster(xx,yy,pl,0); if (xx===x0) c=M.UP[c]; if (xx===x0+w-1) c=M.DN[c]; b.px(xx,yy,c); }
    var rh=3; for (var q=0;q<rh;q++) for (var xx2=x0-1+q;xx2<x0+w+1-q;xx2++) b.px(xx2,top-1-q,q===rh-1?P.t4:((xx2+q)%3===0?P.t1:P.t3));
    b.hl(x0,x0+w-1,top,P.t0); b.hl(x0,x0+w-1,top+1,M.DN[tex.plaster(x0,top+1,pl,0)]);
    if (hash(i,5)<0.5){ var cxh=x0+3+Math.floor(hash(i,6)*(w-6)); b.rect(cxh,top-7,3,4,P.s2); b.vl(cxh,top-7,top-4,P.s3); b.hl(cxh-1,cxh+3,top-8,P.s1); }
    if (hash(i,8)<0.35){ var ax=x0+2+Math.floor(hash(i,9)*(w-4)); b.vl(ax,top-10,top-4,P.m1); b.hl(ax-3,ax+3,top-9,P.m1); b.hl(ax-2,ax+2,top-7,P.m1); }
    else if (hash(i,8)<0.5){ var sx=x0+2+Math.floor(hash(i,9)*(w-6)); b.ellipse(sx+2,top-4,2.4,2.6,P.s5); b.px(sx+3,top-4,P.m2); b.px(sx+1,top-5,P.s6); }
    for (var wx=x0+3;wx<x0+w-5;wx+=8){ var wy=top+3; if (wy+6>54) continue; var st=hash(wx,top); win(b,wx,wy,4,6,st<0.4?'shut':(st<0.7?'half':'open'),st); } });
  // antike Mauer
  for (y=55;y<PB;y++) for (x=0;x<PAL1;x++) b.px(x,y,tex.ashlar(x+7,y-55,A,17,7));
  // Arkadengalerie (Kryptoportikus): Halbsäulen und Bögen, viele zugemauert
  for (var ax0=4;ax0<PAL1-8;ax0+=12){ var i2=Math.floor(ax0/12), kind=hash(i2,21);
    b.rect(ax0,57,2,16,P.s4); b.vl(ax0,57,72,P.s6); b.vl(ax0+1,57,72,P.s3); b.px(ax0,57,P.s5); b.px(ax0+1,58,P.s5);
    var ox=ax0+3, ow=8, oy=59, oh=14;
    for (var yy=oy;yy<oy+oh;yy++) for (var xx=ox;xx<ox+ow;xx++){ var dx=(xx+0.5-(ox+ow/2))/(ow/2), topy=oy+3-Math.sqrt(Math.max(0,1-dx*dx))*3; if (yy<topy) continue; var c2;
      if (kind<0.28) c2=(yy<oy+6)?P.k1:(xx===ox?P.k1:P.k2);
      else if (kind<0.62) c2=tex.cobble(xx*2,yy*2,R('s1 s2 s3 s4'),5);
      else c2=tex.plaster(xx,yy,(kind<0.8?R('e3 e4 s5'):R('s3 s4 s5')),0);
      if (xx===ox && kind>=0.28) c2=M.DN[c2];
      b.px(xx,yy,c2); }
    for (var k2=-1;k2<=ow;k2++){ var dx2=(k2+0.5-ow/2)/(ow/2+0.5), ty=Math.round(oy+3-Math.sqrt(Math.max(0,1-dx2*dx2))*3)-1; b.px(ox+k2,ty,P.s5); b.px(ox+k2,ty-1,P.s3); }
    if (kind<0.28 && hash(i2,24)<0.5){ b.hl(ox,ox+ow-1,oy+10,P.m1); for (var bx=ox;bx<ox+ow;bx+=2) b.vl(bx,oy+8,oy+10,P.m1); }
    if (kind>=0.28 && kind<0.95){ var st2=hash(i2,23); win(b,ox+2,oy+4,4,6,st2<0.45?'shut':(st2<0.75?'half':'open'),st2); }
    if (kind>0.8 && kind<0.95){ b.hl(ox-1,ox+ow,oy+11,P.m1); for (var bx2=ox;bx2<ox+ow;bx2+=2) b.vl(bx2,oy+9,oy+11,P.m1); b.px(ox+1,oy+8,P.g3); b.px(ox+2,oy+8,P.r3); b.px(ox+5,oy+8,P.g4); b.px(ox+6,oy+9,P.g2); }
    if (kind>0.95){ b.rect(ox+1,oy+6,6,5,P.m3); b.hl(ox+1,ox+6,oy+6,P.m4); b.rect(ox+2,oy+7,4,3,P.m2); b.vl(ox+3,oy+7,oy+9,P.m1); } }
  b.hl(0,PAL1-1,55,P.s6); b.hl(0,PAL1-1,56,P.s3); b.hl(0,PAL1-1,57,P.s1);
  b.hl(0,PAL1-1,73,P.s6); b.hl(0,PAL1-1,74,P.s4); b.hl(0,PAL1-1,75,P.s1); b.hl(0,PAL1-1,76,P.s2);
  SHOPS.forEach(function(s,i){ shop(b,s[0],s[1],i); });
  // Bronzenes Tor
  var g0=GATE[0], g1=GATE[1];
  for (y=78;y<PB;y++) for (x=g0;x<g1;x++){ var dx3=(x+0.5-(g0+g1)/2)/((g1-g0)/2), top2=81-Math.sqrt(Math.max(0,1-dx3*dx3))*3; if (y<top2) continue; b.px(x,y,y<84?P.k1:(x<g0+2||x>g1-3?P.k2:P.s0)); }
  glass(b,g0+3,86,g1-g0-6,PB-88,'gate',0,function(x,y){ return (y>94)?P.s1:P.s0; });
  b.rect(g0-2,77,2,23,P.s5); b.vl(g0-2,77,PB-1,P.s6); b.rect(g1,77,2,23,P.s3); b.vl(g1+1,77,PB-1,P.s2);
  for (var k3=0;k3<=g1-g0+3;k3++){ var dx4=(k3-(g1-g0+3)/2)/((g1-g0+3)/2), ty2=Math.round(81-Math.sqrt(Math.max(0,1-dx4*dx4))*4)-1; b.px(g0-2+k3,ty2,P.s6); b.px(g0-2+k3,ty2-1,P.s4); }
  b.hl(0,PAL1-1,PB-1,P.s1); b.hl(0,PAL1-1,PB-2,P.s2);
  // Schmutzfahnen unter dem Gesims
  for (x=0;x<PAL1;x++){ var st3=Math.sin(x*0.37)+Math.sin(x*0.11+2)+hash(x,77); if (st3>1.5){ var L=4+Math.floor(hash(x,78)*10); for (y=58;y<58+L;y++) if (bayer(x,y)<0.45*(1-(y-58)/L)){ var c3=b.get(x,y); if (FAR[y*W+x]===0 && WM[y*W+x]===0 && c3!==P.k1 && c3!==P.k2) b.px(x,y,M.DN[c3]); } } } }
// kleines Fenster mit grünen Läden (škure)
function win(b,x,y,w,h,mode,seed){ b.rect(x-1,y-1,w+2,h+2,P.s4); b.hl(x-1,x+w,y+h,P.s5); b.hl(x-1,x+w,y-1,P.s3);
  if (mode==='shut'){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,((yy-y)%2===0)?P.g2:P.g3); b.vl(x+(w>>1),y,y+h-1,P.g1); return; }
  glass(b,x,y,w,h,'house',seed,function(xx,yy){ return (xx===x+(w>>1))?P.s2:((yy===y)?P.k1:P.k2); });
  if (mode==='half'){ for (var y2=y;y2<y+h;y2++){ b.px(x,y2,(y2%2)?P.g2:P.g3); b.px(x+w-1,y2,(y2%2)?P.g1:P.g2); } }
  else { for (var y3=y;y3<y+h;y3++){ b.px(x-2,y3,(y3%2)?P.g2:P.g3); b.px(x+w+1,y3,(y3%2)?P.g1:P.g2); } } }
// Laden im Erdgeschoss: Sturz, Schaufenster mit Auslage, Markise, Schild
function shop(b,x0,x1,i){ var y0=80, w=x1-x0, aw=hash(i,31)<0.6, AW=[R('g1 g2 g3'),R('r1 r2 r3'),R('c1 c2 c3'),R('w1 w2 w3')][i%4], rr=M.rng(40+i);
  b.rect(x0-1,y0-3,w+2,3,P.s4); b.hl(x0-1,x1,y0-3,P.s6); b.hl(x0-1,x1,y0-1,P.s2);
  // Rahmen
  b.rect(x0,y0,w,PB-1-y0,P.w0);
  var dx=x0+Math.floor(w*0.6), ty=y0+5;
  glass(b,x0+1,y0+1,w-2,PB-3-y0,'shop',i,function(x,y){ var gx=x-x0, gy=y-y0;
    if (y===ty || x===dx || x===dx+5) return P.w1;                         // Kämpfer, Türrahmen
    if (x>dx && x<dx+5){ return (y===y0+11)?P.y2:P.k2; }                    // Ladentür
    if (y===y0+11 || y===y0+15) return P.w1;                               // Regalböden
    if (y>PB-6) return (gx%3===0)?P.w0:P.w1;                               // Theke
    var g=hash(Math.floor(x/2)+i*13,Math.floor((y-y0)/4)); if (y>ty && g<0.38) return [P.r2,P.g2,P.c2,P.y1,P.t2,P.s2][Math.floor(g*16)%6];
    return ((gx+gy*2)%13<2 && y<ty)?P.n0:P.k2; });
  if (aw){ for (var ax=x0-2;ax<x1+2;ax++){ for (var ay=0;ay<4;ay++){ var c2=(((ax-x0)>>1)%2)?AW[2]:AW[1]; if (ay===3) c2=((ax%2)?AW[0]:AW[1]); if (ay===0) c2=M.UP[AW[2]]; b.px(ax,y0-4+ay,c2); } } }
  var sg=['KAVA','BAR','SUVENIRI','SLASTICE','TISAK','KAVANA','RIVA'][i%7], sw=M.microWidth(sg)+4;
  if (!aw && sw<w){ var sx=x0+Math.floor((w-sw)/2); b.rect(sx,y0-10,sw,7,P.w1); b.hl(sx,sx+sw-1,y0-10,P.w3); b.hl(sx,sx+sw-1,y0-4,P.w0); M.microText(b,sg,sx+2,y0-9,P.y4); } }

// ---------------------------------------------------------------- Hafenbüro (Lučka kapetanija), 19. Jh.
var ODOOR=[280,58,24,42];   // Türflügel x,y,w,h (darüber Oberlicht)
function office(b,tod){ var x0=OF0, x1=OF1, x, y, PL=R('t3 t4 t5 d6');
  // Walmdach mit Kaminen
  for (y=6;y<15;y++) for (x=x0+(15-y)+1;x<x1-(15-y)-1;x++) b.px(x,y,((x+y*2)%4===0)?P.t2:(y<8?P.t4:(y>12?P.t2:P.t3)));
  b.rect(x0+18,1,4,7,P.s3); b.vl(x0+18,1,7,P.s4); b.hl(x0+17,x0+22,1,P.s5); b.rect(x1-24,2,4,6,P.s3); b.vl(x1-24,2,7,P.s4); b.hl(x1-25,x1-20,2,P.s5);
  // Traufgesims mit Zahnschnitt
  b.hl(x0-2,x1+1,15,P.s6); b.hl(x0-2,x1+1,16,P.s4); b.hl(x0-1,x1,17,P.s2); for (x=x0;x<x1;x+=3){ b.px(x,18,P.s4); b.px(x+1,18,P.s2); b.px(x+2,18,P.s1); }
  // Fries mit Inschrift
  for (y=19;y<26;y++) for (x=x0;x<x1;x++) b.px(x,y,(y===19)?P.s4:(y===25?P.s3:P.s5));
  M.microText(b,'LUČKA KAPETANIJA',x0+Math.floor((x1-x0-63)/2),20,P.n0);
  b.hl(x0,x1-1,26,P.s6); b.hl(x0,x1-1,27,P.s2);
  // Obergeschoss: Putz, Ecklisenen
  for (y=28;y<49;y++) for (x=x0;x<x1;x++) b.px(x,y,tex.plaster(x,y,PL,40));
  for (y=28;y<49;y++){ var q=Math.floor((y-28)/5)%2; for (x=x0;x<x0+5+(q?2:0);x++) b.px(x,y,(y%5===3)?P.s2:(x===x0?P.s6:P.s4)); for (x=x1-5-(q?2:0);x<x1;x++) b.px(x,y,(y%5===3)?P.s2:(x===x1-1?P.s2:P.s4)); }
  [258,285,312].forEach(function(wx,i){ var wy=31, ww=13, wh=15;
    b.rect(wx-2,wy-2,ww+4,wh+3,P.s4); b.hl(wx-2,wx+ww+1,wy-2,P.s5); b.vl(wx+ww+1,wy-2,wy+wh,P.s2); b.vl(wx-2,wy-2,wy+wh,P.s5);
    b.rect(wx-3,wy+wh,ww+6,2,P.s5); b.hl(wx-3,wx+ww+2,wy+wh+1,P.s2);
    if (i===1){ b.poly([[wx-4,wy-3],[wx+ww/2,wy-7],[wx+ww+3,wy-3]],P.s4); b.line(wx-4,wy-3,Math.round(wx+ww/2),wy-7,P.s6); b.hl(wx-4,wx+ww+3,wy-3,P.s2); }
    else { b.rect(wx-3,wy-5,ww+6,2,P.s5); b.hl(wx-3,wx+ww+2,wy-5,P.s6); b.hl(wx-3,wx+ww+2,wy-3,P.s2); }
    glass(b,wx,wy,ww,wh,'office',i,function(xx,yy){ if ((xx-wx)===6||(yy-wy)===7) return P.s4; return (yy===wy||xx===wx)?P.k1:((xx+yy)%7===0?P.n1:P.k2); });
    for (var yy=wy;yy<wy+wh;yy++){ for (var k=0;k<3;k++){ b.px(wx-5+k,yy,((yy-wy)%2)?P.g2:P.g3); b.px(wx+ww+2+k,yy,((yy-wy)%2)?P.g2:P.g3); } b.px(wx-5,yy,P.g1); b.px(wx+ww+4,yy,P.g1); } });
  // Balkon mit Geländer über der Tür
  b.rect(278,46,28,3,P.s5); b.hl(278,305,46,P.s6); b.hl(278,305,48,P.s2); b.hl(279,304,49,P.s1);
  for (x=279;x<305;x+=2) b.vl(x,41,45,P.m0); b.hl(278,305,41,P.m1); b.hl(279,304,43,P.m0);
  // Gurtgesims, Erdgeschoss mit Rustika
  b.hl(x0-1,x1,49,P.s6); b.hl(x0-1,x1,50,P.s3); b.hl(x0-1,x1,51,P.s1);
  for (y=52;y<PB;y++) for (x=x0;x<x1;x++){ var c2=((y-52)%6===0)?P.s2:(((y-52)%6===1)?P.s5:P.s4); if (((x+((Math.floor((y-52)/6)%2)*10))%20)===0) c2=P.s2; if (hash(x>>1,y)<0.05) c2=M.DN[c2]; b.px(x,y,c2); }
  // Fenster im Erdgeschoss mit Gittern
  [[254,62],[316,62]].forEach(function(p,i){ var wx=p[0], wy=p[1], ww=15, wh=24; b.rect(wx-2,wy-3,ww+4,wh+5,P.s3); b.hl(wx-2,wx+ww+1,wy-3,P.s5); b.vl(wx-2,wy-3,wy+wh+1,P.s5); b.rect(wx-3,wy+wh,ww+6,2,P.s5); b.hl(wx-3,wx+ww+2,wy+wh+1,P.s2);
    glass(b,wx,wy,ww,wh,'office',5+i,function(xx,yy){ if ((xx-wx)%5===2||(yy-wy)%8===4) return P.m1; return (yy===wy)?P.k1:((xx+yy)%9===0?P.n1:P.k2); }); });
  // Portal: Steinrahmen, Oberlicht, zweiflügelige Tür
  var dx=ODOOR[0], dy=ODOOR[1], dw=ODOOR[2], dh=ODOOR[3];
  b.rect(dx-4,dy-8,dw+8,dh+8,P.s3); b.vl(dx-4,dy-8,PB-1,P.s6); b.vl(dx-3,dy-8,PB-1,P.s4); b.vl(dx+dw+3,dy-8,PB-1,P.s1); b.vl(dx+dw+2,dy-8,PB-1,P.s2); b.hl(dx-4,dx+dw+3,dy-8,P.s5);
  b.rect(dx+dw/2-3,dy-9,6,3,P.s5); b.hl(dx+dw/2-3,dx+dw/2+2,dy-9,P.s6);   // Schlussstein
  glass(b,dx,dy-6,dw,5,'fan',0,function(xx,yy){ return ((xx-dx)%4===2||yy===dy-6)?P.w1:P.k2; });
  b.hl(dx,dx+dw-1,dy-1,P.w1);
  M.prop.door(b,dx,dy,dw,dh,{ramp:R('w0 w1 w2 w3 w4'),frame:R('s1 s2 s3 s4'),glass:true,glassCol:P.k2,knob:'R'});
  b.vl(dx+(dw>>1),dy,dy+dh-1,P.w0); b.vl(dx+(dw>>1)+1,dy,dy+dh-1,P.w3);
  glass(b,dx+3,dy+3,(dw>>1)-4,Math.floor(dh*0.38),'door',0,function(xx,yy){ return (yy===dy+3)?P.k1:P.k2; });
  glass(b,dx+(dw>>1)+2,dy+3,(dw>>1)-5,Math.floor(dh*0.38),'door',1,function(xx,yy){ return (yy===dy+3)?P.k1:P.k2; });
  b.rect(dx-5,PB-2,dw+10,2,P.s4); b.hl(dx-5,dx+dw+4,PB-2,P.s6);
  // Wappen, Messingschild, Wandlaterne
  var wx2=dx+(dw>>1)-3; b.rect(wx2,36,7,7,P.s6); for (var yy2=0;yy2<4;yy2++) for (var xx2=0;xx2<5;xx2++) if ((xx2+yy2)%2===0) b.px(wx2+1+xx2,37+yy2,P.r3); b.hl(wx2+1,wx2+5,41,P.s6); b.px(wx2+3,42,P.r3); b.hl(wx2,wx2+6,35,P.y3);
  b.rect(dx-11,dy+14,5,4,P.y2); b.hl(dx-11,dx-7,dy+14,P.y4); b.px(dx-9,dy+16,P.y1);
  b.hl(dx-14,dx-8,dy-2,P.m0); b.vl(dx-14,dy-6,dy-1,P.m0); b.rect(dx-16,dy-5,5,6,P.m1); b.rect(dx-15,dy-4,3,4,P.m3); b.hl(dx-17,dx-11,dy-6,P.m0);
  // Fahnenstange
  b.line(x1-2,40,FLAG[0],FLAG[1],P.m2); b.px(FLAG[0],FLAG[1]-1,P.y3);
  b.hl(x0,x1-1,PB-1,P.s1); }

// ---------------------------------------------------------------- Brüstung rechts vom Hafenbüro
function parapet(b){ for (var x=OF1;x<MX0;x++){ for (var y=92;y<=PB;y++){ var c=(y===92)?P.s6:((y===93)?P.s4:((y===94)?P.s2:((x%11===0)?P.s2:(y<97?P.s4:P.s3)))); b.px(x,y,c); } }
  for (var px=OF1+6;px<MX0-4;px+=22){ b.rect(px,89,5,4,P.s4); b.hl(px,px+4,89,P.s6); b.vl(px+4,89,92,P.s2); } }

// ---------------------------------------------------------------- Pflaster (poliert, mit Perspektive)
function paveAt(x,y,yb,yf,ramp,seed){ var d=(y-yb)/(yf-yb), a=3, bb=3.2/(yf-yb), v=Math.log((a+bb*(y-yb))/a)/bb, row=Math.floor(v/2.2), fy=v/2.2-row;
  var s=11+d*12, off=(row%2)*0.5+hash(row,seed)*0.37, u=x/s+off, col=Math.floor(u), fx=u-col, rh=(a+bb*(y-yb))*2.2;
  if (fy*rh<1 || fx*s<1) return ramp[0];
  var t=hash(col*7.13+row*3.71,row*1.93+seed), c=t<0.3?ramp[1]:(t<0.86?ramp[2]:ramp[3]);
  if (fy*rh<2 && fx*s>2) c=M.UP[c];
  return c; }
function pavement(b,tod,wea){ var rp=R('s2 s3 s4 s5'), x, y;
  for (y=PB;y<QY;y++) for (x=0;x<MX0;x++){ if (x>=OF1 && y<=PB) continue; b.px(x,y,paveAt(x,y,PB,QY,rp,3)); }
  // Glanz: der polierte Stein spiegelt den hellen Himmel (nach hinten heller)
  M.light(b,function(x,y){ var d=(y-PB)/(QY-PB); return 0.5-d*0.75; },0,0,function(x,y){ return y>=PB&&y<QY&&x<MX0&&FAR[y*W+x]===0; });
  // Kaikante vorn
  for (x=0;x<MX0;x++){ b.px(x,QY,P.s6); b.px(x,QY+1,(x%17===0)?P.s2:P.s4); b.px(x,QY+2,(x%17===0)?P.s1:P.s3); b.px(x,QY+3,(x%17===0)?P.s0:P.s1); }
  for (x=20;x<MX0;x+=46){ b.px(x,QY+2,P.m2); b.px(x+1,QY+2,P.m1); b.px(x,QY+3,P.m1); }   // Ringe
  [[60,122],[190,118],[300,128]].forEach(function(g){ b.rect(g[0],g[1],8,2,P.m0); for (var k=0;k<8;k+=2) b.px(g[0]+k,g[1],P.m2); }); }

// ---------------------------------------------------------------- Mole
function mole(b,tod,wea){ var x, y, rp=R('s1 s2 s3 s4');
  for (y=MB;y<MF;y++) for (x=MX0;x<MX1;x++) b.px(x,y,paveAt(x+300,y,MB,MF,rp,9));
  M.light(b,function(x,y){ return 0.3-(y-MB)/(MF-MB)*0.5; },0,0,function(x,y){ return x>=MX0&&x<MX1&&y>=MB&&y<MF; });
  for (x=MX0;x<MX1;x++){ b.px(x,MB,P.s5); b.px(x,MB+1,P.s2); }
  for (x=MX0;x<MX1;x++){ b.px(x,MF,P.s6); b.px(x,MF+1,P.s4); for (y=MF+2;y<MW;y++){ var c2=tex.ashlar(x,y-MF-2,R('s1 s2 s3 s3'),15,3); if (y===MW-1) c2=(hash(x,5)<0.6)?P.g1:P.a1; b.px(x,y,c2); } }
  for (y=MB;y<MW;y++){ b.px(MX1-1,y,P.s1); b.px(MX1-2,y,M.DN[b.get(MX1-2,y)]); }
  for (y=MF+1;y<MW+2;y++){ b.px(470,y,P.m1); b.px(474,y,P.m1); } for (y=MF+2;y<MW+2;y+=2) b.hl(470,474,y,P.m2);
  [440,520,580].forEach(function(rx){ b.px(rx,MF+3,P.m2); b.px(rx+1,MF+3,P.m1); b.px(rx,MF+4,P.m1); });
  for (y=MB;y<=QY+3;y++) b.px(MX0,y,y<MF?P.s4:P.s1); }

// ---------------------------------------------------------------- Requisiten
function palm(b,x,by,h,o){ o=o||{}; var r=M.rng(o.seed||7), lean=o.lean||0, wind=o.wind||0, TR=R('w0 w1 w2 w3 w4 e3'), LF=R('g0 g1 g2 g3 g4 g5');
  b.ellipse(x+0.5,by+0.5,7,2.2,P.m0); b.ellipse(x+0.5,by,5,1.3,P.e1);
  var tx=x, ty=by-h;
  for (var i=0;i<=h;i++){ var t=i/h, cx=x+lean*Math.sin(t*Math.PI*0.5), y=by-i, hw=3.3-t*1.1; if (i<4) hw+=(4-i)*0.35;
    for (var k=Math.floor(cx-hw);k<=Math.ceil(cx+hw);k++){ var u=(k+0.5-(cx-hw))/(2*hw); if (u<0||u>1) continue;
      var ring=(i%3===0), scar=(i%3===1)&&(((k+Math.floor(i/3))%3)===0);
      b.px(k,y,ra(TR,0.86-u*0.75+(ring?-0.2:0)+(scar?-0.14:0),k,y)); }
    if (i===h) tx=Math.round(cx); }
  // Knolle aus Blattansätzen
  for (var yy=ty-2;yy<=ty+3;yy++) for (var xx=tx-4;xx<=tx+4;xx++){ var dd=Math.pow((xx-tx)/4.5,2)+Math.pow((yy-ty-0.5)/3,2); if (dd>1) continue; b.px(xx,yy,((xx+yy*2)%3===0)?P.w1:(xx<tx?P.e3:P.e2)); }
  // tote, hängende Wedel
  for (var dw=0;dw<5;dw++){ var a0=Math.PI*(0.3+dw*0.1), px=tx+(dw-2)*1.5, py=ty+2; for (var s=0;s<9;s++){ px+=Math.cos(a0)*0.55+(dw-2)*0.12; py+=0.95; b.px(Math.round(px),Math.round(py),s<5?P.e2:P.e1); if (s>2&&s%2) b.px(Math.round(px)+1,Math.round(py),P.e1); } }
  // grüne Wedel: hintere zuerst, die oberen hell
  var N=o.n||12, fr=[];
  for (var f=0;f<N;f++){ var a=-Math.PI*0.5+(f/(N-1)-0.5)*Math.PI*1.7+(r()-0.5)*0.18; fr.push([a,15+r()*8,r()]); }
  fr.sort(function(p,q){ return Math.abs(Math.sin(q[0]))-Math.abs(Math.sin(p[0])); });
  fr.forEach(function(F){ var a=F[0], L=F[1], dx=Math.cos(a), dy=Math.sin(a), px=tx, py=ty, up=-dy;
    var pts=[]; for (var s=0;s<L;s++){ dy+=0.06+s*0.006; dx+=wind*0.055*(dx<0?1.6:1); var n=Math.hypot(dx,dy); dx/=n; dy/=n; px+=dx; py+=dy*0.92; pts.push([px,py,dx,dy]); }
    var base=0.5+up*0.32;
    // Fiedern unten (lang, hängend), dann Mittelrippe und obere Fiedern
    pts.forEach(function(p,s){ if (s<2) return; var ll=Math.min(5,1+s*0.42)*(1-Math.pow(s/L,2)*0.75); var nx=-p[3], ny=p[2]; if (ny<0){ nx=-nx; ny=-ny; }
      for (var q=1;q<=ll;q++){ var qx=p[0]+nx*q*0.55+wind*q*0.35-p[2]*q*0.2, qy=p[1]+ny*q*0.45+q*0.62; b.px(Math.round(qx),Math.round(qy),ra(LF,base-0.22-q*0.04,qx,qy)); } });
    pts.forEach(function(p,s){ var ll=s<2?0:Math.min(3,0.6+s*0.25)*(1-Math.pow(s/L,2)*0.8); var nx=p[3], ny=-p[2]; if (ny>0){ nx=-nx; ny=-ny; }
      b.px(Math.round(p[0]),Math.round(p[1]),ra(LF,base+0.1,p[0],p[1]));
      for (var q=1;q<=ll;q++){ var qx=p[0]+nx*q*0.6-p[2]*q*0.35+wind*q*0.3, qy=p[1]+ny*q*0.35+q*0.3; b.px(Math.round(qx),Math.round(qy),ra(LF,base+0.18-q*0.03,qx,qy)); } }); }); }
function lamp(b,x,by,h){ var I=R('k1 m0 m1 m2 m3');
  b.rect(x-3,by-4,7,4,I[1]); b.hl(x-3,x+3,by-4,I[3]); b.hl(x-4,x+4,by-1,I[1]); b.vl(x-3,by-4,by-1,I[2]);
  b.rect(x-2,by-9,5,5,I[1]); b.vl(x-2,by-9,by-5,I[2]); b.hl(x-2,x+2,by-9,I[3]);
  b.rect(x-1,by-h,3,h-9,I[1]); b.vl(x-1,by-h,by-10,I[3]); b.vl(x+1,by-h,by-10,I[0]);
  b.hl(x-2,x+2,by-h,I[2]); b.hl(x-3,x+3,by-h-1,I[1]); b.hl(x-3,x+3,by-h-2,I[2]);
  var hy=by-h-3; b.poly([[x-4,hy],[x+5,hy],[x+4,hy-8],[x-3,hy-8]],P.m3); b.vl(x,hy-8,hy,I[1]); b.hl(x-3,x+4,hy-4,I[1]); b.px(x-3,hy-6,P.m4); b.px(x+3,hy-6,P.m2);
  b.poly([[x-5,hy-8],[x+6,hy-8],[x+3,hy-11],[x-2,hy-11]],I[1]); b.hl(x-5,x+5,hy-8,I[3]); b.px(x,hy-12,I[1]); b.px(x,hy-13,I[2]); }
function lampGlass(b,x,by,h,c1,c2){ var hy=by-h-3; for (var yy=hy-7;yy<hy;yy++) for (var xx=x-3;xx<=x+4;xx++){ if (xx===x||yy===hy-4) continue; var e=(xx===x-3||xx===x+4)&&(yy===hy-7||yy===hy-1); if (e) continue; b.px(xx,yy,(yy<hy-4)?c2:c1); } b.px(x-1,hy-6,P.l1); b.px(x+1,hy-6,P.l1); b.px(x-1,hy-2,P.l0); }
// Bank zum Meer hin: Lehne (2 Latten), Sitzfläche (von oben sichtbar), geschwungene Gusseisenwangen mit Armlehne
function bench(b,x0,x1,by){ var Wd=R('w1 w2 w3 w4 w5'), I=R('k1 m0 m1 m2 m3'), x;
  // Schatten auf dem Boden
  for (x=x0+1;x<x1;x++){ b.px(x,by,P.s1); if (x>x0+2&&x<x1-2) b.px(x,by-1,P.s2); }
  // Lehne
  for (var k=0;k<2;k++){ var yy=by-24+k*5; b.hl(x0+2,x1-2,yy,Wd[4]); b.hl(x0+2,x1-2,yy+1,Wd[3]); b.hl(x0+2,x1-2,yy+2,Wd[1]); }
  b.vl(x0+((x1-x0)>>1),by-22,by-15,I[1]);
  // Sitzfläche (drei Latten von oben) und Vorderkante
  b.hl(x0+1,x1-1,by-14,Wd[2]); b.hl(x0+1,x1-1,by-13,Wd[4]); b.hl(x0+1,x1-1,by-12,Wd[3]); b.hl(x0,x1,by-11,Wd[4]); b.hl(x0,x1,by-10,Wd[1]); b.hl(x0+1,x1-1,by-9,Wd[0]);
  // Wangen
  [[x0+1,1],[x1-1,-1]].forEach(function(e){ var lx=e[0], s=e[1];
    b.line(lx+s,by-25,lx,by-19,I[1]); b.line(lx,by-19,lx,by-12,I[1]); b.px(lx+s,by-26,I[3]);
    b.line(lx,by-17,lx+s*3,by-17,I[2]); b.px(lx+s*3,by-16,I[1]);                     // Armlehne
    b.line(lx,by-10,lx-s,by-1,I[1]); b.line(lx+s,by-9,lx+s*3,by-1,I[1]); b.px(lx-s,by,I[0]); b.px(lx+s*3,by,I[0]);
    b.px(lx,by-12,I[3]); b.px(lx,by-15,I[3]); }); }
function bollard(b,cx,by,big){ var I=R('k1 m0 m1 m2 m3'), w=big?4:3, h=big?9:7;
  b.rect(cx-w,by-h,w*2+1,h,I[1]); b.vl(cx-w,by-h,by-1,I[3]); b.vl(cx-w+1,by-h,by-1,I[2]); b.vl(cx+w,by-h,by-1,I[0]);
  b.rect(cx-w-1,by-h-2,w*2+3,2,I[1]); b.hl(cx-w-1,cx+w+1,by-h-2,I[4]); b.hl(cx-w,cx,by-h-1,I[2]); b.rect(cx-w+1,by-h-4,w*2-1,2,I[1]); b.hl(cx-w+1,cx+w-1,by-h-4,I[3]);
  b.hl(cx-w,cx+w,by,P.s1); }
function bin(b,x,by){ b.rect(x,by-9,6,9,P.g2); b.vl(x,by-9,by-1,P.g4); b.vl(x+1,by-9,by-1,P.g3); b.vl(x+5,by-9,by-1,P.g1); b.hl(x-1,x+6,by-10,P.g1); b.hl(x,x+5,by-11,P.g3); b.hl(x,x+5,by,P.s1); }
function cafe(b,x,by){
  [[x,by],[x+16,by+1]].forEach(function(p){ var tx=p[0], ty=p[1]; b.hl(tx-3,tx+3,ty-9,P.s5); b.hl(tx-3,tx+3,ty-8,P.m1); b.vl(tx,ty-8,ty-1,P.m1); b.hl(tx-2,tx+2,ty,P.m1);
    [[-6,1],[6,-1]].forEach(function(c){ var cx=tx+c[0]; b.vl(cx,ty-13,ty-1,P.m1); b.hl(cx,cx+c[1]*3,ty-6,P.m2); b.vl(cx+c[1]*3,ty-6,ty-1,P.m1); b.hl(cx,cx+c[1]*3,ty-7,P.w3); }); });
  var ux=x+8; b.vl(ux,by-32,by-1,P.m2); b.poly([[ux-2,by-29],[ux+3,by-29],[ux+1,by-14],[ux,by-14]],P.s5); b.vl(ux-1,by-28,by-16,P.s6); b.vl(ux+2,by-28,by-18,P.s3); b.rect(ux-3,by-2,7,2,P.m1); }

// ---------------------------------------------------------------- Fähre (seitlich, Bug links); put(x,y,c,licht)
function ferryShape(put,x,wy,L,lit,onlyLights){ var s=L/120, x1=x+L, hh=Math.max(3,Math.round(12*s)), d1=Math.max(2,Math.round(7*s)), d2=Math.max(2,Math.round(6*s)), ix, iy;
  function P2(xx,yy,c,raw){ if (onlyLights && !raw) return; put(xx,yy,c,raw); }
  for (iy=0;iy<hh;iy++){ var yy=wy-iy, xs=x+Math.round((hh-iy)*1.0*s+1), xe=x1-Math.round(iy<3?(3-iy)*s:0);
    for (ix=xs;ix<=xe;ix++){ var c=P.s5; if (iy<2) c=P.n1; else if (iy===2) c=P.r2; else if (iy===hh-1) c=P.s6; else if (iy===Math.round(hh*0.6)) c=P.b0; else if (ix>xe-2) c=P.s3; if (ix===xs&&iy>2) c=P.s6; P2(ix,yy,c); } }
  var top=wy-hh;
  if (L>60){ for (ix=x+Math.round(10*s);ix<x1-4;ix+=Math.round(6*s)){ P2(ix,wy-Math.round(hh*0.6)+2,lit?P.y3:P.s3,lit); } }
  var a0=x+Math.round(14*s), a1=x1-Math.round(5*s), per=Math.max(2,Math.round(4*s));
  for (iy=0;iy<d1;iy++) for (ix=a0;ix<=a1;ix++){ var w1=(iy===Math.floor(d1/2)||(d1>4&&iy===Math.floor(d1/2)-1))&&((ix-a0)%per<per-1); if (iy===d1-1) P2(ix,top-1-iy,P.s6); else if (w1) P2(ix,top-1-iy,lit?(hash(ix,iy)<0.75?P.y4:P.y3):P.n1,lit); else P2(ix,top-1-iy,(ix===a0)?P.s6:P.s5); }
  var b0=x+Math.round(24*s), b1=x1-Math.round(22*s), t2=top-d1;
  for (iy=0;iy<d2;iy++) for (ix=b0;ix<=b1;ix++){ var w2=(iy===Math.floor(d2/2))&&((ix-b0)%per<per-1); if (iy===d2-1) P2(ix,t2-1-iy,P.s6); else if (w2) P2(ix,t2-1-iy,lit?(hash(ix,iy+5)<0.6?P.y4:P.y2):P.n1,lit); else P2(ix,t2-1-iy,(ix===b0)?P.s6:P.s5); }
  var t3=t2-d2, br0=x+Math.round(24*s), br1=x+Math.round(48*s), bh=Math.max(2,Math.round(5*s));
  for (iy=0;iy<bh;iy++) for (ix=br0;ix<=br1;ix++){ var wb=(iy===bh-2)&&(ix%2===0); P2(ix,t3-1-iy,wb?(lit?P.y3:P.k2):(iy===bh-1?P.s6:P.s5),wb&&lit); }
  var f0=x+Math.round(72*s), f1=x+Math.round(82*s), fh=Math.max(3,Math.round(12*s));
  for (iy=0;iy<fh;iy++) for (ix=f0+Math.round(iy*0.3);ix<=f1+Math.round(iy*0.3);ix++){ var c4=(ix>f1+Math.round(iy*0.3)-2)?P.s3:P.s5; if (iy>fh-3) c4=P.k2; else if (iy>fh-6&&iy<fh-3) c4=P.b0; P2(ix,t3-iy,c4); }
  var mx=x+Math.round(40*s), mh=Math.round(10*s); for (iy=0;iy<mh;iy++) P2(mx,t3-bh-iy,P.m2);
  if (lit){ P2(mx,t3-bh-mh,P.l1,true); P2(x+Math.round(5*s)+1,wy-hh+1,P.g5,true); P2(x1-1,wy-hh-1,P.r4,true); }
  return {top:t3-fh, x0:x, x1:x1}; }

// kleine Fähre in der Ferne (Bug links); Fensterpunkte für die Nacht in FWIN
function farFerry(b,x,wy,L){ var x1=x+L, i, j;
  for (i=x+2;i<=x1;i++){ b.px(i,wy,P.n1); b.px(i,wy-1,P.s3); }
  for (i=x+1;i<=x1;i++){ b.px(i,wy-2,P.s5); b.px(i,wy-3,i<x+3?P.s6:P.s5); } b.px(x,wy-3,P.s6);
  b.hl(x+3,x1-1,wy-2,P.b0);
  var a0=x+Math.round(L*0.18), a1=x1-2;
  for (j=4;j<=6;j++) for (i=a0+(j-4);i<=a1-(j>5?3:0);i++) b.px(i,wy-j,j===6?P.s6:P.s5);
  for (i=a0+1;i<a1-1;i+=2){ b.px(i,wy-5,P.n1); FWIN.push([i,wy-5]); }
  var br0=x+Math.round(L*0.26), br1=x+Math.round(L*0.46); for (i=br0;i<=br1;i++){ b.px(i,wy-7,P.s6); if (i%2===0){ b.px(i,wy-7,P.k2); FWIN.push([i,wy-7]); } } b.hl(br0,br1,wy-8,P.s5);
  var f0=x+Math.round(L*0.62); b.rect(f0,wy-10,3,3,P.s5); b.hl(f0,f0+2,wy-10,P.k2); b.hl(f0,f0+2,wy-9,P.b0); b.px(f0+3,wy-8,P.s3);
  var mx=x+Math.round(L*0.45); b.vl(mx,wy-12,wy-9,P.m2); FWIN.push([mx,wy-13,P.l1],[x+2,wy-3,P.g5],[x1,wy-4,P.r4]); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=track(new M.Buf(W,H,P.k0)), wea=M.scn.weather(GS), night=tod==='night', dusk=tod==='dusk', x, y;
  FAR.fill(0); WM.fill(0); OBJ.fill(0); WIN.length=0; FWIN.length=0; LIT.tod=tod; LIT.wea=wea;
  b.code=1; paintSky(b,tod,wea);
  b.code=2; paintMountains(b,tod,wea); paintIslands(b,tod,wea);
  paintWater(b,tod,wea);
  b.code=0;
  // Ferne: Wellenbrecher mit Leuchtfeuer, Fähren am Terminal
  b.ocode=2;
  for (x=444;x<566;x++){ b.px(x,85,P.s4); b.px(x,86,P.s2); } b.rect(561,78,3,7,P.s5); b.vl(561,78,84,P.s6); b.px(562,77,P.g4); b.px(562,76,P.m1);
  farFerry(b,452,91,44); farFerry(b,503,89,30);
  // Segelboot im Becken
  for (y=0;y<9;y++){ var sw=Math.round(y*0.55); b.hl(424-sw,424,83+y,y===8?P.s4:P.s6); b.px(425,83+y,P.m2); } b.hl(418,428,92,P.s5); b.hl(419,427,93,P.n1);
  b.ocode=0;
  b.ocode=1; tower(b,tod); b.ocode=0;
  palace(b,tod);
  office(b,tod);
  parapet(b);
  pavement(b,tod,wea);
  mole(b,tod,wea);
  cafe(b,46,104); bin(b,128,107); bin(b,250,107); bin(b,486,110);
  var wind=wea==='bura'?1:0;
  PALMS.forEach(function(p){ palm(b,p.x,104,p.h,{seed:p.s,wind:wind,lean:p.x>300?-2:2}); });
  LAMPS.forEach(function(lx){ lamp(b,lx,LB,LH); });
  bench(b,BENCH[0],BENCH[1],108); bench(b,BENCH2[0],BENCH2[1],108); bench(b,MBENCH[0],MBENCH[1],108);
  bollard(b,456,107,false); bollard(b,IBOL,108,true);
  // Tau vom Poller ins Wasser
  b.line(IBOL+4,101,IBOL+12,104,P.e2); b.px(IBOL+3,101,P.e3);
  lamp(b,MLAMP,MLB,MLH);
  b.rect(MX1-5,MF-6,3,6,P.s5); b.vl(MX1-5,MF-6,MF-1,P.s6); b.px(MX1-4,MF-7,P.g3); b.px(MX1-4,MF-8,P.m1);
  // Flagge (statischer Stand; bewegt sich in dynamic)
  flag(b,FLAG[0],FLAG[1],0,wea);
  // ---- Licht (Tag): Schatten der Palmen auf Fassade und Pflaster
  if (tod==='day') dayShadows(b);
  var pre=b.clone();
  var out=M.finishTOD(b,tod,{ sky:function(x,y){ return FAR[y*W+x]>0; } });
  if (tod==='dusk' && wea!=='rain'){ var NT=M.TINT.night; for (var k=0;k<W*H;k++){ if (OBJ[k]===2) out.d[k]=M.UP[M.tintPx(NT,pre.d[k],k%W,(k/W)|0)]; } }
  if (tod!=='day') nightLights(out,pre,tod,wea);
  return out; }
function dayShadows(b){ var m=new Uint8Array(W*H), tmp={px:function(x,y){ x|=0; y|=0; if (x>=0&&y>=0&&x<W&&y<H) m[y*W+x]=1; },rect:function(){},hl:function(){},vl:function(){},line:function(){},ellipse:function(){},poly:function(){}};
  PALMS.forEach(function(p){ palm(tmp,p.x,104,p.h,{seed:p.s,wind:1,lean:p.x>300?-2:2}); });
  var DX=13, DY=10; LAMPS.forEach(function(lx){ for (var yy=LB-LH-14;yy<LB-LH;yy++) for (var xx=lx-4;xx<=lx+5;xx++) m[yy*W+xx]=1; });
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ if (!m[y*W+x]) continue; var sx=x+DX, sy=y+DY; if (sx>=W||sy>=PB) continue; var k=sy*W+sx; if (FAR[k]!==0 || m[k]) continue; if (WM[k]) continue; b.d[k]=M.DN[M.DN[b.d[k]]]; }
  // Laternen und Stämme werfen kurze Schatten aufs Pflaster
  PALMS.concat(LAMPS.map(function(l){ return {x:l}; })).forEach(function(p){ for (var k=0;k<12;k++){ var sx=p.x+1+Math.round(k*0.9), sy=103-Math.round(k*0.25); for (var w=0;w<2;w++){ var kk=sy*W+sx+w; if (FAR[kk]===0 && !m[kk]) b.d[kk]=M.DN[b.d[kk]]; } } }); }
// Flagge: x,y = Spitze der Stange; ph = Wehen
function flag(b,x,y,ph,wea){ var bura=wea==='bura', calm=wea==='calm';
  for (var i=0;i<11;i++) for (var j=0;j<7;j++){ var w=bura?Math.round(Math.sin(i*0.9-ph*9)*1.2):0, droop=calm?Math.round(i*0.55):(wea==='rain'?Math.round(i*0.8):0);
    var xx=x+1+(calm?Math.round(i*0.5):i), yy=y+j+w+droop; var c=j<2?P.r3:(j<5?P.s6:P.b1); if (calm && i>3) xx=x+1+Math.round(i*0.4); if (j>=2&&j<5&&i>=3&&i<=5&&j<4) c=((i+j)%2)?P.r3:P.s6; b.px(xx,yy,c); } }

// ---------------------------------------------------------------- Lichter bei Dämmerung und Nacht
var LAMPT=M.TINT.lamp;
// angestrahlter Stein: warm, aber mit voller Helligkeitsstaffel (Bögen bleiben dunkel)
var FLOOD=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*1.06+14, L*0.84+2, L*0.42-6]; });
// warme Lichtinsel: Kern hell, Körper warm, schmaler geditherter Rand
function pool(out,pre,cx,cy,rx,ry,amt,mask){ var y0=Math.max(0,Math.floor(cy-ry)), y1=Math.min(H-1,Math.ceil(cy+ry)), x0=Math.max(0,Math.floor(cx-rx)), x1=Math.min(W-1,Math.ceil(cx+rx));
  for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var k=y*W+x; if (FAR[k]!==0 || WM[k]) continue; if (mask && !mask(x,y)) continue; var dx=(x-cx)/rx, dy=(y-cy)/ry, q=1-dx*dx-dy*dy; if (q<=0) continue;
    var L=clamp(q/0.22,0,1); if (L<1 && bayer(x,y)>=L) continue;
    var c=M.tintPx(LAMPT,pre.d[k],x,y), dn=M.qd((0.55-q)*2.2*amt,x,y), up=M.qd((q-0.78)*4*amt,x,y);
    while (dn>0){ c=M.DN[c]; dn--; } while (up>0){ c=M.UP[c]; up--; } out.d[k]=c; } }
// Lichthof: hellt die vorhandenen (schon umgefärbten) Farben auf, ohne Farbton zu wechseln
function halo(out,cx,cy,rx,ry,amt,mask){ for (var y=Math.max(0,Math.floor(cy-ry));y<=Math.min(H-1,cy+ry);y++) for (var x=Math.max(0,Math.floor(cx-rx));x<=Math.min(W-1,cx+rx);x++){ var k=y*W+x; if (FAR[k]!==0||WM[k]) continue; if (mask && !mask(x,y)) continue;
    var dx=(x-cx)/rx, dy=(y-cy)/ry, q=1-dx*dx-dy*dy; if (q<=0) continue; var up=M.qd(q*amt,x,y), c=out.d[k]; while (up>0){ c=M.UP[c]; up--; } out.d[k]=c; } }
function nightLights(b,pre,tod,wea){ var n=tod==='night', rain=wea==='rain', x, y;
  // Lichtinseln der Laternen auf dem Pflaster, Lichthöfe an der Wand dahinter
  var wallM=function(x,y){ return y<PB; };
  LAMPS.forEach(function(lx){ pool(b,pre,lx,LB+5,25,9,1); halo(b,lx,LB-LH-8,18,26,n?1.6:1.0,wallM); pool(b,pre,lx,LB-LH-7,7,9,1,wallM); });
  pool(b,pre,MLAMP,MLB+3,24,8,1); halo(b,MLAMP,MLB-MLH-8,14,20,1.4);
  halo(b,ODOOR[0]-14,ODOOR[1]-2,14,18,1.4,wallM); pool(b,pre,ODOOR[0]-14,ODOOR[1]-3,6,7,1,wallM);
  // Läden werfen warmes Licht aufs Pflaster (abends offen)
  SHOPS.forEach(function(s,i){ if (n && i%3) return; pool(b,pre,(s[0]+s[1])/2,102,(s[1]-s[0])*0.55,5,0.7); });
  // Fenster
  WIN.forEach(function(w,id){ var on, cold=(w.k==='office'||w.k==='door'||w.k==='fan');
    if (w.k==='shop') on=n?(w.s%3===0):true; else if (cold||w.k==='gate') on=true; else on=hash(w.x,w.y)<(n?0.32:0.5);
    if (!on) return;
    for (var yy=w.y;yy<w.y+w.h;yy++) for (var xx=w.x;xx<w.x+w.w;xx++){ var k=yy*W+xx; if (WM[k]!==id+1) continue; var c0=pre.d[k], c;
      var dark=(c0===P.k2||c0===P.k1||c0===P.n1||c0===P.n0||c0===P.s0||c0===P.s1);
      if (cold){ c=dark?((yy-w.y)<w.h*0.45?(bayer(xx,yy)<0.4?P.s6:P.a6):(bayer(xx,yy)<0.5?P.a6:P.a5)):(c0===P.s4?P.a4:P.n1); }
      else if (w.k==='shop'){ var gy=(yy-w.y)/w.h; c=dark?ra(R('y2 y3 y4 y5'),0.95-gy*0.8,xx,yy):M.DN[M.tintPx(LAMPT,c0,xx,yy)]; if (c0===P.w1||c0===P.w0) c=P.w1; }
      else if (w.k==='gate') c=dark?ra(R('y1 y2 y3'),0.8-(yy-w.y)/w.h*0.5,xx,yy):c0;
      else c=dark?((yy===w.y)?P.y3:(bayer(xx,yy)<0.3?P.y5:P.y4)):M.tintPx(LAMPT,c0,xx,yy);
      b.d[k]=c; } });
  // Glockenturm: angestrahlt (nachts), Abendlicht (Dämmerung)
  if (n){ for (y=0;y<60;y++) for (x=TWX-16;x<=TWX+16;x++){ var k=y*W+x; if (FAR[k]!==0||OBJ[k]!==1) continue; var c0=pre.d[k]; var c=M.tintPx(FLOOD,c0,x,y), dn=M.qd((50-y)/50*1.3,x,y); while (dn>0){ c=M.DN[c]; dn--; } b.d[k]=c; } }
  // Laternenglas
  LAMPS.forEach(function(lx){ lampGlass(b,lx,LB,LH,P.y4,P.y5); }); lampGlass(b,MLAMP,MLB,MLH,P.y4,P.y5);
  // Fähren in der Ferne: Fensterlichter
  FWIN.forEach(function(p,i){ if (p[2]!==undefined) b.px(p[0],p[1],p[2]); else if (hash(p[0],p[1])<0.78) b.px(p[0],p[1],(i%4)?P.y4:P.y3); });
  // Supetar auf Brač, Leuchtfeuer
  for (var k2=0;k2<11;k2++){ var sx=512+k2*3+(k2%3); b.px(sx,HZ-1-(k2%2),k2%3?P.y3:P.y4); }
  b.px(MX1-4,MF-7,P.g5); b.px(562,77,P.g5);
  // nasses Pflaster: Spiegelungen der Laternen und Läden
  var refl=function(cx,y0,y1,wd,cA,cB){ for (var yy=y0;yy<y1;yy++){ var fade=(yy-y0)/(y1-y0); for (var xx=Math.round(cx-wd);xx<=Math.round(cx+wd);xx++){ var k=yy*W+xx; if (FAR[k]!==0||WM[k]) continue; var e=Math.abs(xx-cx)/wd; if (hash(xx*3,yy)<fade*0.7+e*0.5) continue; if ((yy+Math.floor(hash(yy,xx>>2)*3))%3===0) continue; b.d[k]=e<0.4?cA:cB; } } };
  if (rain){ LAMPS.forEach(function(lx){ refl(lx+0.5,108,134,2.5,P.y4,P.y2); }); refl(MLAMP+0.5,112,125,2.5,P.y4,P.y2);
    SHOPS.forEach(function(s,i){ if (n && i%3) return; refl((s[0]+s[1])/2,101,116,(s[1]-s[0])*0.35,P.y3,P.y1); }); }
  else if (!n){ LAMPS.forEach(function(lx){ refl(lx+0.5,108,122,1.5,P.y3,P.t3); }); } }
function isTower(x,y){ var hw; if (y<1) return false; if (y<8) return x===TWX||(y===2&&Math.abs(x-TWX)<=2); if (y<20) hw=Math.round((y-7)*0.72); else if (y<30) hw=10; else if (y<40) hw=12; else if (y<50) hw=13; else hw=14; return Math.abs(x-TWX)<=hw; }

// ---------------------------------------------------------------- Vordergrund-Ebenen
function layers(S,GS,tod){ var L=[];
  function pol(x,by,big){ var l=M.layer(x-6,by-14,13,16,by), w=M.lw(l); bollard(w,x,by,big); if (tod!=='day') M.tintApply(l,M.TINT[tod]); L.push(l); }
  [104,232,360].forEach(function(x){ pol(x,QY+1,true); });
  [432,490,548].forEach(function(x){ pol(x,MF+1,false); });
  return L; }

// ---------------------------------------------------------------- jedes Bild: Wasser, Spiegelungen, Fähre, Möwen, Flagge
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=LIT.tod, wea=LIT.wea, rmp=wramp(tod,wea), x, y, sx;
  for (y=HZ;y<H;y++){ var row=y*W; for (sx=0;sx<320;sx++){ x=sx+cam; if (x<0||x>=W) continue; var k=FAR[row+x]; if (k<3) continue; fb.d[y*320+sx]=wcol(x,y,t,k,tod,wea,rmp); } }
  if (tod!=='day'){
    LAMPS.forEach(function(lx){ gl(fb,lx+0.5,FW,H,3,t,P.y4,P.y2,cam); }); gl(fb,MLAMP+0.5,MW,H,5,t,P.y4,P.y2,cam);
    if (tod==='night' && wea!=='rain') gl(fb,574,HZ+1,MB+1,9,t*0.7,P.n4,P.n3,cam);
    gl(fb,525,HZ,HZ+9,2,t,P.y3,P.y2,cam);
  } else if (wea!=='rain'){ gl(fb,560,HZ+1,MB+1,6,t,P.a6,P.s6,cam); }
  if (tod==='dusk' && wea!=='rain') gl(fb,560,HZ+1,MB+1,8,t*0.8,P.d6,P.d5,cam);
  if (tod==='day') M.scn.gulls(fb,t,300,10,340,30,4,cam);
  if (S && S.ferryAt && v.gt>=S.ferryAt) ferry(fb,v,S);
  // Flagge
  var fx=FLAG[0]-cam; if (fx>-14 && fx<330) flagFb(fb,v,cam);
  // Gischt an der Molenspitze bei Bura
  if (wea==='bura'){ var ph=(t*0.55)%1; if (ph<0.35){ var a=ph/0.35; for (var i=0;i<14;i++){ var sx2=Math.round(MX1-8+hash(i,1)*12-cam), sy2=Math.round(MW-2-a*14*hash(i,2)-Math.sin(a*3.14)*6); if (sx2>=0&&sx2<320&&sy2>=0&&sy2<H && hash(i,3)>a*0.8) fb.d[sy2*320+sx2]=(tod==='night'?P.n4:P.s6); } } }
  if (tod!=='day'){ LAMPS.forEach(function(lx){ M.glow(fb,lx-cam+0.5,LB-LH-7,9,t,0.45); }); M.glow(fb,MLAMP-cam+0.5,MLB-MLH-7,11,t,0.5); }
}
function gl(fb,cx,y0,y1,spread,t,c1,c2,cam){ for (var y=y0;y<y1;y++){ var k=(y-y0)/(y1-y0+1), half=1+spread*k; for (var x=Math.floor(cx-half);x<=cx+half;x++){ var sx=x-cam; if (sx<0||sx>=320||x<0||x>=W) continue; if (FAR[y*W+x]<3) continue; var f=Math.sin(x*0.9+y*2.3+t*3)+Math.sin(x*0.31-t*2.2+y*1.7); if (f>1.2) fb.d[y*320+sx]=(Math.abs(x-cx)<half*0.45)?c1:c2; } } }
function flagFb(fb,v,cam){ var tod=LIT.tod, tint=M.TINT[tod]; var tmp={px:function(x,y,c){ var sx=x-cam; if (sx<0||sx>=320||y<0||y>=H) return; fb.d[y*320+sx]=(tod==='day'||!tint)?c:M.tintPx(tint,c,x,y); }};
  // alten Stand nicht löschen (gleiche Fläche wird übermalt) – nur bei Wind bewegt
  if (LIT.wea==='bura') flag(tmp,FLAG[0],FLAG[1],v.t,LIT.wea); }
function ferry(fb,v,S){ var ft=(v.gt-S.ferryAt)/1000, T0=24, e=clamp(ft/T0,0,1), p=1-Math.pow(1-e,3), x=Math.round(700+(FERRY_END-700)*p), cam=v.cam, tod=LIT.tod, lit=tod!=='day', tint=M.TINT[tod];
  if (tod==='dusk' && LIT.wea!=='rain') tint=M.TINT.night;
  function put(wx,wy,c,raw){ var sx=wx-cam; if (sx<0||sx>=320||wy<0||wy>=H||wx<0||wx>=W) return; var f=FAR[wy*W+wx]; if (f===0||f===4) return; var cc=(raw||tod==='day'||!tint)?c:M.tintPx(tint,c,wx,wy); if (!raw && tod==='dusk') cc=M.UP[cc]; fb.d[wy*320+sx]=cc; }
  var sh=ferryShape(put,x,MB-2,124,lit);
  for (var yy=MB-1;yy<=MB;yy++) for (var xx=sh.x0+4;xx<sh.x1;xx++){ var sxx=xx-cam; if (sxx<0||sxx>=320) continue; if (FAR[yy*W+xx]!==3) continue; if (((xx+yy)&1)===0) fb.d[yy*320+sxx]=lit?(hash(xx,1)<0.35?P.y3:P.n0):P.a2; }
  if (e<1){ var foam=(1-e); for (var q=0;q<Math.round(16*foam)+3;q++){ var wx2=sh.x0+1-q, wy2=MB-1-((q+Math.floor(v.t*9))%2); put(wx2,wy2,lit?P.n4:P.s6,true); } } }

// ---------------------------------------------------------------- über allem: Regen, Bura
function front(fb,v,S,GS){ var wea=LIT.wea;
  if (wea==='rain') M.rain(fb,v.t,{n:90,col:P.m3,col2:P.m4,speed:260,slant:0.25});
  if (wea==='bura') M.scn.buraDebris(fb,v.t,108,138,v.cam); }

// ---------------------------------------------------------------- Laufflächen, Hotspots
function walk(x,y){ if (x>6 && x<MX0 && y>=108 && y<=134) return true; if (x>=MX0 && x<620 && y>=108 && y<=124) return true; return false; }
M.defineArt('riva',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front,
  spots:{ exit:[0,96,9,44], palace:[0,36,246,64], belltower:[TWX-14,0,29,50], palms:[84,36,44,70], bench:[BENCH[0]-2,80,BENCH[1]-BENCH[0]+5,30],
    lamp:[LAMPS[1]-6,44,13,62], office:[OF0,0,OF1-OF0,100], office_door:[ODOOR[0]-4,ODOOR[1]-8,ODOOR[2]+8,ODOOR[3]+8],
    sea:[338,76,302,68], ferries:[448,72,92,20], mole:[MX0,MB-2,MX1-MX0,MW-MB+2], bollard:[IBOL-7,94,15,15],
    mole_lamp:[MLAMP-6,MLB-MLH-17,13,MLH+17], mole_bench:[MBENCH[0]-2,80,MBENCH[1]-MBENCH[0]+5,30], islands:[386,62,254,14] },
  stands:{ exit:[10,120,'L'], palace:[100,112,'B'], belltower:[TWX,112,'B'], palms:[106,112,'B'], bench:[160,112,'B'], lamp:[136,112,'B'],
    office:[292,114,'B'], office_door:[292,110,'B'], sea:[300,132,'F'], ferries:[480,112,'B'], mole:[440,116,'R'], bollard:[598,112,'R'],
    mole_lamp:[612,118,'R'], mole_bench:[513,112,'B'], islands:[560,112,'B'] },
  actorPos:{ ivka:[596,114,'R'], mala:[560,116,'R'] },
  start:[60,122,'R'], entries:{ map:[12,122,'R'], office:[292,112,'F'] }
});
})(M);
