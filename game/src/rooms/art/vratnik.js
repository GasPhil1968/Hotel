/* ===== rooms/art/vratnik.js — Vratnik und die Gelbe Bastei (640 px, scrollend) =====
   Links eine steile, gepflasterte Gasse der alten Mahala: ein weißes Haus mit dunklem Holz-Obergeschoss und Erker (doksat),
   eine hohe Gartenmauer mit großem Holztor (kapija) und Weinrebe, ein Gässchen mit Stufen, das zwischen den Mauern zur Stadt
   abfällt, die kleine Mahalla-Moschee mit hölzernem Minarett hinter ihrer Hofmauer und Ružas kleines weißes Haus hinter
   ihrer Gartenmauer, mit eigenem Holztor und einem kahlen Quittenbaum. Rechts die Stadtmauer aus gelblichem Stein und die
   Žuta tabija: eine runde Bastei mit Brüstung, einer Bank, einer Laterne und dem Sockel, auf dem im Ramadan die Kanone
   steht. Dahinter der weite Blick über das Tal: die ganze Stadt mit Minaretten, Kuppeln und den zwei Türmen der Kathedrale,
   ganz hinten im Westen die Hochhäuser, links der Trebević, rechts der Hum mit dem Fernsehturm. Nachts ein Lichtermeer im
   leichten Dunst. Ein streunender Hund döst an der Stadtmauer und trottet ab und zu ein Stück (dynamic). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=640, H=144;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rnd(v){ return Math.round(v); }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
// Büschel (Worley): Baumkronen am Hang. ~0..1, oben links hell, Fugen dunkel
function puff(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bx=0, by=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.15+hash(gx+i+sd,gy+j)*0.7)*sx, cy=(gy+j+0.15+hash(gx+i,gy+j+sd*1.7)*0.7)*sy;
    var dx=(x-cx)/sx, dy=(y-cy)/sy, d=dx*dx+dy*dy; if (d<b1){ b2=b1; b1=d; bx=dx; by=dy; } else if (d<b2) b2=d; }
  var v=0.6-by*0.75-bx*0.25-b1*0.3; if (b2-b1<0.1) v-=0.32; return v; }
// unregelmäßige Steinquader mit eigener Rampe je Stein
function blocks(u,v,sw,sh,sd,ramps,jc){ var row=Math.floor(v/sh), fv=v-row*sh, bw=sw*(0.75+hash(row,sd+2)*0.6), uu=u+hash(row,sd)*sw, col=Math.floor(uu/bw), fu=uu-col*bw;
  if (fv<1||fu<1) return jc; var rr=ramps[Math.floor(hash(col+sd*3,row+11)*ramps.length)], t=hash(col*13+sd,row*7+sd), k=t<0.3?0:(t<0.8?1:2), c=rr[k];
  if (fv<2&&fu>1&&fu<bw-1) c=rr[k+1]; else if (fv>=sh-1||fu>=bw-1) c=rr[Math.max(0,k-1)];
  var p=hash(u*3+col,v*5+row); if (p<0.05) c=M.DN[c]; else if (p>0.975) c=M.UP[c]; return c; }

// Regionen: wer wo gemalt hat (Licht, Himmelsmaske, Geistersicht)
var REG=new Uint8Array(W*H), RG={sky:0,view:1,wall:2,wood:3,roof:4,lane:5,terr:6,stone:7,prop:8,glass:9,tree:10,gate:11};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Geometrie
var HZ=50;                                                      // Talgrund am Horizont (ganz hinten im Westen)
function laneBase(x){ return 117-x*0.03; }                      // Fuß der Mauern: die Gasse steigt nach rechts an
var PX0=366;                                                    // hier beginnt die Brüstung der Bastei
function paraFoot(x){ return x<530?106:106+Math.pow((x-530)/110,2)*15; }   // Fuß der Brüstung (innen); rechts biegt sie nach vorn
function paraH(x){ return 17+(paraFoot(x)-106)*0.35; }
function backY(x){ return x<PX0?laneBase(x):paraFoot(x); }      // hintere Kante der Lauffläche
var CW0=300, CW1=372, CWT=20;                                   // Stadtmauer: x von, bis, Oberkante
var HA={x1:100, gf:58, uf:22, ev:16, rf:3};                     // Haus A: rechts, Erdgeschoss oben, Obergeschoss oben, Traufe, Dachfirst
var BAY={x0:8,x1:58,top:20,bot:56};                             // Erker (doksat)
var DOORA={x0:68,x1:92,top:62};
var KAP={x0:108,x1:140,top:52,wt:64};                           // großes Holztor des Nachbarn, Mauerkrone
var HB={x0:108,x1:148,uf:30,bx0:114,bx1:140};                   // Haus B hinter der Hofmauer: Obergeschoss oben, Erker
var GAP={x0:151,x1:176};                                        // Gässchen mit Stufen hinunter
var MOS={x0:176,x1:238,wt:60,hall0:180,hall1:222,ht:34,rf:18,mx:231}; // Moschee: Hofmauer, Gebetsraum, Minarett-Mitte
var RZ={x0:238,x1:300,wt:66,h0:268,h1:300,ht:36,rf:20};         // Ružas Mauer und Haus
var GATE={x0:242,x1:266,top:56};                                // Ružas Tor
var QX=262;                                                     // Quittenbaum (Stamm)
var BENCH={x0:462,x1:510,by:111};                               // Bank (von hinten gesehen, Blick über die Stadt)
var CANNON={x0:556,x1:580,by:122};
var LAMP={x:420,by:114,h:88};
var DOG={x0:318,x1:358,y:114};
var CHIM=[[66,0,12,16],[GAP.x0+17,75,34,12],[142,6,18,14]];                   // Kamine mit Rauch: x, Austritt y, Steighöhe, Drift (Haus A oben angeschnitten; ein Haus weiter unten im Gässchen)

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod){ var w=RW(b,RG.sky), x, y;
  if (tod==='night'){ var NR=R('k0 k1 k2 n0 n1');
    for (y=0;y<72;y++) for (x=0;x<W;x++){ var v=0.1+Math.pow(y/72,1.6)*0.62+(fbm(x,y*2,40,2)-0.5)*0.05; w.px(x,y,ra(NR,v,x,y)); }
    // Dunst über der Stadt: warmer Schein über dem Horizont
    for (y=22;y<72;y++) for (x=300;x<W;x++){ var g=Math.exp(-Math.pow((x-520)/120,2))*sm((y-22)/34)*0.8; if (g>0.06 && bayer(x,y)<g*0.75) w.px(x,y,g>0.6?P.d1:P.d0); }
    var r=M.rng(81); for (var s=0;s<360;s++){ var sx=Math.floor(r()*W), sy=Math.floor(Math.pow(r(),1.5)*54), q=r(); if (sy>32 && sx>380 && q>0.1) continue; w.px(sx,sy,q<0.07?P.n5:(q<0.3?P.n4:P.n3)); if (q<0.02){ w.px(sx+1,sy,P.n2); w.px(sx-1,sy,P.n2); } }
    for (x=0;x<W;x++){ var my=3+x*0.045+Math.sin(x*0.02)*5; for (y=Math.floor(my-5);y<my+5;y++){ if (y<0||y>=40) continue; if (bayer(x,y)<0.13*(1-Math.abs(y-my)/5)*(0.4+fbm(x,y,9,6))) w.px(x,y,P.n1); } }
    // schmale Mondsichel
    var mx=168, my2=9; for (y=my2-5;y<=my2+5;y++) for (x=mx-5;x<=mx+5;x++){ var d1=Math.hypot(x+0.5-mx,y+0.5-my2), d2=Math.hypot(x+0.5-mx-2.2,y+0.5-my2+1.2); if (d1<=4.6 && d2>4.1) w.px(x,y,d1>3.8?P.n4:P.n5); }
    return; }
  // Tag: klar und kalt, oben tiefblau, zum Horizont blass
  var DR=R('b0 b1 b2 b3 b4 b5');
  for (y=0;y<74;y++) for (x=0;x<W;x++){ var v2=0.16+Math.pow(y/74,1.25)*0.8+(x-320)/W*0.04; w.px(x,y,ra(DR,v2,x,y)); }
  var r2=M.rng(13); for (var i=0;i<6;i++){ var cx=r2()*W, cy=5+r2()*24, L=40+r2()*80; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.05+Math.sin(k*0.09)*1.2); if (bayer(xx,yy)<0.42*(1-Math.abs(k/L-0.5)*2)) w.px(xx,yy,yy<18?P.b3:P.b4); } } }

// ---------------------------------------------------------------- Blick über das Tal
// Trebević (links, Süden), Igman ganz hinten, Hum mit Fernsehturm (rechts, Norden), dazwischen die Stadt im Talgrund
function trebY(x){ var y=19+5*Math.sin(x*0.009+0.7)+2.2*Math.sin(x*0.031+1.3)+1.2*Math.sin(x*0.083); if (x>300) y+=Math.pow(Math.min(1,(x-300)/230),1.7)*34; return y; }
function igY(x){ return 43+2.2*Math.sin(x*0.021+1)+1.3*Math.sin(x*0.07+2)+(x>570?(x-570)*0.05:0); }
function humY(x){ if (x<540) return 99; var t=(x-540)/100; return 53-Math.pow(t,0.85)*25+Math.sin(x*0.11)*1.2; }
function footL(x){ return x<318?98+(318-x)*0.03:98-(x-318)/194*(98-HZ-1); }   // Fuß des Trebević im Tal
function footR(x){ return x<578?99:HZ+1+(x-578)/62*24; }                    // Fuß des Hum
function riverX(y){ var t=(104-y)/(104-HZ-2); return lerp(318,505,Math.pow(cl(t,0,1),0.8))+5*Math.sin(t*5.5); }
function riverW(y){ return 0.4+2.6*cl((y-HZ)/(96-HZ),0,1); }
var TOWERX=622;
function hillTex(x,y,top,sd,night){ var p=puff(x,y,3.2,2.4,sd), con=fbm(x*0.8,y*1.3,11,sd+4)>0.56, v=0.42+p*0.26+(fbm(x,y,18,sd+9)-0.5)*0.3+(y-top)*0.003+(y===top?0.24:0);
  if (night) return ra(R('k0 k1 k2 n0'),0.15+v*0.45,x,y);
  return con?ra(R('g0 g1 g2 g3'),v,x,y):ra(R('w0 w1 e1 e2 s2 e3'),v,x,y); }
function paintView(b,tod){ var w=RW(b,RG.view), night=tod==='night', x, y;
  var FARC=night?[P.k2,P.n0]:[P.b3,P.b2];
  // Igman: ganz blass hinter dem Talende
  for (x=380;x<W;x++){ var iy=rnd(igY(x)); for (y=iy;y<=HZ+1;y++) w.px(x,y,(y===iy)?FARC[1]:(bayer(x,y)<0.35?FARC[1]:FARC[0])); }
  // Hum (rechts) mit Fernsehturm
  for (x=540;x<W;x++){ var hy=rnd(humY(x)); for (y=hy;y<104;y++) w.px(x,y,hillTex(x,y,hy,5,night)); }
  var ty=rnd(humY(TOWERX)); w.rect(TOWERX-1,ty-17,2,17,night?P.k1:P.s3); w.vl(TOWERX-1,ty-17,ty,night?P.k2:P.s5); w.rect(TOWERX-3,ty-14,6,2,night?P.k1:P.s4); w.hl(TOWERX-3,TOWERX+2,ty-14,night?P.k2:P.s5); w.vl(TOWERX,ty-24,ty-18,night?P.k2:P.m3);
  // Trebević (links): Wald, unten am Hang Häuser
  for (x=0;x<545;x++){ var ry=rnd(trebY(x)); for (y=ry;y<H;y++){ if (y>=footL(x)) break; w.px(x,y,hillTex(x,y,ry,8,night)); } }
  // Talgrund: Grundton, nach hinten im Dunst heller
  for (y=HZ;y<108;y++) for (x=140;x<W;x++){ if (x<545 && y<footL(x)) continue; if (x>=578 && y<footR(x)) continue; if (y<HZ+1 && x<380) continue;
    var s=(y-HZ)/(96-HZ); w.px(x,y,night?ra(R('k1 k2 n0 d0'),0.8-s*0.62+(hash(x>>1,y)-0.5)*0.1,x,y):ra(R('s3 e4 s4 s5'),0.55+(fbm(x,y*2,5,3)-0.5)*0.5,x,y)); }
  // Miljacka: ein schmales Band am Fuß des Trebević
  for (y=HZ+2;y<108;y++){ var rx=riverX(y), hw=riverW(y); for (x=Math.floor(rx-hw);x<=Math.ceil(rx+hw);x++){ if (Math.abs(x+0.5-rx)>hw) continue; w.px(x,y,night?(hash(x,y)<0.2?P.n1:P.k0):(Math.abs(x+0.5-rx)<hw*0.5?P.a3:P.a2)); } }
  // Stadt: Reihen von hinten nach vorn (Maler-Verfahren)
  cityRows(w,night);
  // Häuser und Lichter auf den Hängen
  for (y=20;y<108;y++) for (x=140;x<W;x++){ var onT=(x<545 && y>=trebY(x)+2 && y<footL(x)), onH=(x>=540 && y>=humY(x)+2 && y<footR(x)); if (!onT&&!onH) continue;
    var hgt=onT?(footL(x)-y):(footR(x)-y), dens=cl(1-hgt/(onT?40:22),0,1); dens=Math.pow(dens,1.6); if (hash(x*1.7,y*2.3)>dens*0.55) continue;
    if (night){ if (hash(x,y*3.1)<0.45) w.px(x,y,hash(y,x)<0.5?P.y3:(hash(x,y)<0.6?P.y4:P.y2)); }
    else if (hash(x*2.1,y)<0.6){ w.px(x,y,hash(x,y*1.3)<0.6?P.s4:P.t3); } }
  // Lichterketten: Boulevard nach Westen, Uferstraße an der Miljacka, eine Straße am Hum
  if (night){ lightLine(w,452,103,537,HZ+2,P.y3,P.y4,1); lightLine(w,326,104,507,HZ+3,P.y2,P.y4,2); lightLine(w,604,100,552,HZ+5,P.y2,P.y3,3); }
  // ferne Hochhäuser im Westen (Alipašino Polje)
  [[494,3,7],[499,4,9],[507,3,6],[513,4,10],[520,3,8],[531,4,9],[538,3,6],[545,5,8],[553,3,7],[560,4,9],[567,3,5]].forEach(function(t,i){ var x0=t[0], tw=t[1], th=t[2], yb=HZ+2;
    for (var yy=yb-th;yy<yb;yy++) for (var xx=x0;xx<x0+tw;xx++){ var c=night?((((yy+i)%2)===0&&hash(xx,yy)<0.6)?(hash(yy,xx)<0.6?P.y3:P.y2):(xx===x0?P.n0:P.k2)):((xx===x0)?P.s6:(((yy-yb)%2)?P.s4:P.m4)); w.px(xx,yy,c); } });
  // Nachtdunst: um den fernen Talgrund hellt sich die Luft warm auf, die fernen Lichter verschwimmen
  if (night){ for (y=HZ-14;y<HZ+26;y++) for (x=380;x<W;x++){ var k=y*W+x; if (REG[k]!==RG.view) continue; var g=Math.exp(-Math.pow((x-524)/105,2))*Math.exp(-Math.pow((y-HZ-3)/11,2)), c=b.d[k];
      if (M.lum(c)<50){ if (bayer(x,y)<g*0.85) b.d[k]=g>0.55?P.d1:(g>0.3?P.d0:P.n0); } else if (g>0.5 && bayer(x+1,y)<0.4) b.d[k]=M.DN[c]; } } }
function lightLine(w,x0,y0,x1,y1,c1,c2,sd){ var n=90; for (var i=0;i<n;i++){ var t=i/n, tt=1-Math.pow(1-t,1.9), x=rnd(lerp(x0,x1,tt)), y=rnd(lerp(y0,y1,tt)); if (hash(i,sd)<0.35) continue; w.px(x,y,hash(i,sd+7)<0.3?c2:c1); } }
// Minarett, schlank: x Mitte, by Fuß, h Höhe
function minaretV(w,x,by,h,night){ var sw=h>=26?3:(h>=14?2:1), top=by-h, coneH=Math.max(2,rnd(h*0.24)), balc=by-rnd(h*0.7), y, i;
  for (y=top+coneH;y<by;y++) for (i=0;i<sw;i++){ var c=night?(i===0?P.n4:P.n3):(i===0?P.s6:(i===sw-1&&sw>1?P.s3:P.s5)); if (night && y>by-h*0.3) c=M.DN[c]; w.px(x-(sw>>1)+i,y,c); }
  if (h>=9){ if (night){ if (h>12){ w.px(x-(sw>>1)-1,balc,P.y4); w.px(x-(sw>>1)+sw,balc,P.y3); } } else { for (i=-1;i<=sw;i++) w.px(x-(sw>>1)+i,balc,P.s4); if (h>=16) for (i=-1;i<=sw;i++) w.px(x-(sw>>1)+i,balc+1,P.s2); } }
  for (y=top;y<top+coneH;y++){ var f=(y-top)/coneH, cw=Math.max(1,Math.round(f*sw+0.3)); for (i=0;i<cw;i++) w.px(x-(cw>>1)+i,y,night?(i===0?P.n1:P.k2):(i===0?P.m3:P.m2)); }
  w.px(x,top-1,night?P.n2:P.y2); if (h>=18) w.px(x,top-2,night?P.n1:P.y3); }
// Gebäude im Talgrund
var MINS=[[398,104,36],[446,96,24],[541,88,15],[466,79,13],[503,71,10],[421,92,20],[589,86,13],[518,63,7],[556,66,7],[383,96,16],[171,103,26],[488,87,11],[574,74,8],[612,92,12]];
var DOMES=[[409,90,7],[455,88,5],[531,85,4],[486,83,3],[380,89,5],[600,88,4],[181,102,5],[434,86,4]];
function cityRows(w,night){ var yb, x;
  var WALLD=[P.s5,P.s4,P.s6,P.e4,P.m4,P.t5,P.s4,P.s5], ROOFD=[P.t2,P.t3,P.t1,P.m2,P.t2,P.w2,P.t3];
  for (yb=HZ+2;yb<=108;){ var s=(yb-HZ)/(96-HZ), sc=Math.max(0.05,s);
    x=140+Math.floor(hash(yb,3)*6);
    while (x<W){ var hA=hash(x,yb*1.3), hB=hash(yb,x*0.7), bw=Math.max(1,rnd((2.5+hA*6)*sc+0.6)), bh=Math.max(1,rnd((1.5+hB*8)*Math.pow(sc,1.15)+0.4));
      var xc=x+bw/2, ok=(x>=545||yb>=footL(xc)-1)&&(xc<578||yb>=footR(xc)-1); if (yb<HZ+3 && xc<480) ok=false; if (Math.abs(xc-riverX(yb))<riverW(yb)+0.8) ok=false;
      if (ok){ var tree=hash(x*0.31,yb*0.91)<0.12, flat=hash(x*0.7,yb*0.13)<(0.25+0.5*(1-s));
        if (tree){ for (var ty=yb-rnd(bh*0.9);ty<yb;ty++) for (var tx=x;tx<x+bw;tx++){ if (hash(tx,ty)<0.25) continue; w.px(tx,ty,night?P.k1:(hash(tx*3,ty)<0.5?P.e2:P.w2)); } }
        else { var wc=WALLD[Math.floor(hash(x*1.9,yb)*WALLD.length)], rc=ROOFD[Math.floor(hash(x,yb*2.9)*ROOFD.length)], rh=flat?0:Math.max(1,rnd(bh*0.45)), top=yb-bh;
          for (var yy=top;yy<yb;yy++) for (var xx=x;xx<x+bw;xx++){ var c;
            if (night){ c=(xx===x||yy===top)?P.k2:P.k1; if (yy>top && ((xx-x)%2===1||bw<3) && ((yy-top)%2===1||bh<3) && hash(xx*1.3,yy*1.7)<0.27+0.25*(1-s)) c=hash(xx,yy*3)<0.55?P.y3:(hash(yy,xx)<0.5?P.y4:(hash(xx,yy)<0.6?P.y2:P.l0)); }
            else { c=wc; if (xx===x+bw-1&&bw>2) c=M.DN[wc]; if (bw>3&&bh>3&&(xx-x)%2===1&&(yy-top)%3===1&&yy<yb-1) c=P.s1; }
            w.px(xx,yy,c); }
          if (rh>0){ for (var k=0;k<rh;k++){ var ins=Math.floor(k*bw/(2*rh+1)); for (var xr=x+ins-(k===0?1:0);xr<x+bw-ins+(k===0?1:0);xr++) w.px(xr,top-1-k,night?P.k0:(k===0?M.DN[rc]:rc)); } }
          else if (!night){ w.hl(x,x+bw-1,top,M.DN[wc]); } } }
      x+=bw+(hash(x,yb*7)<0.18?Math.max(1,rnd(sc*3)):0); }
    yb+=Math.max(1,rnd(s*3.1)); }
  // Kuppeln, Minarette, Brücken
  DOMES.forEach(function(d){ var cx=d[0], by=d[1], r=d[2]; for (var yy=by-r-2;yy<by;yy++) for (var xx=cx-r-1;xx<=cx+r+1;xx++){ var dx=(xx+0.5-cx)/(r+0.5), dy=(yy+0.5-(by-2))/(r+0.5);
      if (yy>=by-2){ if (Math.abs(dx)<=1.05) w.px(xx,yy,night?P.k1:(dx>0.5?P.s3:P.s5)); continue; } if (dx*dx+dy*dy>1) continue; w.px(xx,yy,night?(dx<-0.4&&dy<-0.2?P.n1:P.k1):(dx<-0.2?P.m4:(dx<0.4?P.m3:P.m2))); }
    if (r>3) w.vl(cx,by-r-4,by-r-2,night?P.n2:P.y2); });
  MINS.forEach(function(m){ minaretV(w,m[0],m[1],m[2],night); });
  [[96,4],[84,3],[74,2],[66,2]].forEach(function(br){ var y=br[0], rx=riverX(y), hw=riverW(y)+1.5; w.hl(rnd(rx-hw-br[1]*0.3),rnd(rx+hw+br[1]*0.3),y,night?P.y2:P.s5); });
  // Kathedrale: Schiff mit Dach, zwei Türme
  for (var cx2=471;cx2<484;cx2++) for (var cy2=73;cy2<80;cy2++) w.px(cx2,cy2,night?(hash(cx2,cy2)<0.15?P.y3:P.k1):(cx2<477?P.s5:P.s3));
  for (var cx3=471;cx3<484;cx3++){ var ry=73-Math.max(0,3-Math.abs(cx3-477.5)*0.7); for (var cy3=Math.floor(ry);cy3<73;cy3++) w.px(cx3,cy3,night?P.k0:P.t2); }
  [[472,80],[481,80]].forEach(function(t){ for (var yy=t[1]-15;yy<t[1];yy++){ w.px(t[0],yy,night?P.n1:P.s6); w.px(t[0]+1,yy,night?P.k2:P.s3); } w.px(t[0],t[1]-16,night?P.n1:P.m3); w.px(t[0],t[1]-17,night?P.k2:P.m2); w.px(t[0],t[1]-11,night?P.y3:P.k2); });
  // zwei gläserne Bürotürme und der gelbe Hotelwürfel
  [[523,62,3,13],[528,62,3,13]].forEach(function(t){ for (var yy=t[1]-t[3];yy<t[1];yy++) for (var xx=t[0];xx<t[0]+t[2];xx++) w.px(xx,yy,night?((yy%2)&&hash(xx,yy)<0.6?P.x3:P.n0):(xx===t[0]?P.b3:P.b1)); });
  for (var yy2=61;yy2<66;yy2++) for (var xx2=510;xx2<516;xx2++) w.px(xx2,yy2,night?((yy2%2===0&&xx2%2===0)?P.y4:P.k2):(xx2<512?P.y4:P.y3)); }
// Dunst: die Ferne verblasst (nur bei Tag; nachts ist der Dunst schon gemalt)
function hazeView(b,tod){ if (tod==='night') return;
  M.fogBake(b,function(x,y){ if (REG[y*W+x]!==RG.view) return 0; if (y<HZ+2 && x>=380 && y>=igY(x)-1) return 0.45;
    if (x<545 && y>=trebY(x) && y<footL(x)) return 0.32+0.26*sm((x-200)/330);
    if (x>=540 && y>=humY(x) && y<footR(x)) return 0.34;
    var s=(y-HZ)/(96-HZ); return 0.08+0.6*Math.pow(1-cl(s,0,1),1.7); },{col:P.b5}); }

// ---------------------------------------------------------------- Gasse: Häuser, Mauern, Tore
var PL=R('s2 s3 s4 s5 s6'), PLX=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5'),R('e1 e2 e3 e4')], YST=[R('e2 e3 e4 s5'),R('e3 e4 s4 s5'),R('e3 e4 s5 s6'),R('e2 e3 e4 s4')];
function plaster(x,y,sd,bot){ var n=fbm(x,y,14,sd), v=0.62+(n-0.5)*0.3+(hash(x,y)-0.5)*0.08;
  if (y>bot-12) v-=(y-(bot-12))/12*0.25;                                                    // Spritzwasser, Schmutz am Fuß
  if (fbm(x*0.8,y*1.1,9,sd+5)>0.72) return blocks(x,y,7,4,sd,PLX,P.s1);                  // abgefallener Putz: Bruchstein
  return ra(PL,v,x,y); }
function woodBoard(x,y,sd){ var col=Math.floor((x+sd)/4), u=(x+sd)-col*4, c=hash(col,sd)<0.4?P.w1:P.w2; if (u===0) c=P.w0; if (u===1&&hash(col,sd+1)<0.5) c=M.UP[c]; if (hash(col,Math.floor(y/11)+sd)<0.1 && (y%11)===0) c=P.w0; if (hash(x,y)<0.05) c=M.UP[c]; return c; }
function tileRoof(w,x0,x1,yTop,yEave,hip,sd){ var hY=yEave-yTop;
  for (var y=yTop;y<=yEave;y++){ var t=(y-yTop)/Math.max(1,hY), inL=hip?rnd(lerp(hip,0,t)):0, xa=x0+inL, xb=x1-inL;
    for (var x=xa;x<=xb;x++){ var col=Math.floor((x-x0)/3), u=(x-x0)%3, row=Math.floor((yEave-y)/3), c=u===0?P.t1:(u===1?P.t3:P.t2);
      if ((yEave-y)%3===0) c=P.t1; if (hash(col*7+sd,row)<0.12) c=(u===1)?P.t2:P.t1; if (hash(x*3,y+sd)<0.05) c=P.g2; if (hash(col,row*3+sd)<0.06) c=P.w1;
      if (y===yTop) c=P.t1; if (x===xa||x===xb) c=P.t0; w.px(x,y,c); } } }
function eave(w,x0,x1,y,depth){ for (var x=x0;x<=x1;x++){ w.px(x,y,P.t1); w.px(x,y+1,P.w0); for (var d=2;d<depth;d++) w.px(x,y+d,(x%4===0)?P.w2:(d===depth-1?P.w0:P.k2)); } }
function paintLane(b,S){ var wa=RW(b,RG.wall), wd=RW(b,RG.wood), rf=RW(b,RG.roof), gl=RW(b,RG.glass), st=RW(b,RG.stone), pr=RW(b,RG.prop), x, y;
  // ---- Haus A: weißes Erdgeschoss, dunkles Holz-Obergeschoss mit Erker, tiefe Traufe, Ziegeldach (oben angeschnitten)
  for (x=0;x<=HA.x1;x++){ var bb=Math.ceil(laneBase(x)); for (y=HA.gf;y<bb;y++) wa.px(x,y,y>bb-9?blocks(x,y,7,4,4,PLX,P.s0):plaster(x,y,2,bb)); }
  for (x=0;x<=HA.x1+2;x++) for (y=HA.uf;y<HA.gf;y++) wd.px(x,y,woodBoard(x,y,0));
  wd.hl(0,HA.x1+2,HA.gf,P.w3); wd.hl(0,HA.x1+2,HA.gf+1,P.w0); wd.hl(0,HA.x1+2,HA.gf+2,P.k2); for (x=0;x<=HA.x1+2;x++) if (x%13===6) wd.vl(x,HA.uf,HA.gf-1,P.w0);
  frameWin(wd,gl,72,30,13,18,'curtain');                                                       // Fenster rechts neben dem Erker
  // Erker: steht vor, Konsolen darunter, Schatten auf dem Erdgeschoss
  for (x=BAY.x0;x<=BAY.x1;x++) for (y=BAY.top;y<BAY.bot;y++){ var c=woodBoard(x,y,5); if (y===BAY.bot-1) c=P.w3; if (y===BAY.bot-2) c=P.w1; wd.px(x,y,c); }
  for (y=BAY.top;y<BAY.bot+1;y++){ wd.px(BAY.x1+1,y,P.w0); wd.px(BAY.x1+2,y,P.k2); wd.px(BAY.x1+3,y,P.k2); wd.px(BAY.x0-1,y,P.w3); }
  wd.hl(BAY.x0-1,BAY.x1+3,BAY.bot,P.k2); wd.hl(BAY.x0,BAY.x1+2,BAY.bot+1,P.w0);
  for (x=BAY.x0-2;x<=BAY.x1+8;x++) for (y=BAY.bot+2;y<BAY.bot+16;y++){ if (REG[y*W+x]===RG.wall && bayer(x,y)<0.75-(y-BAY.bot)/20) wa.px(x,y,M.DN[b.get(x,y)]); }
  [BAY.x0+2,BAY.x0+18,BAY.x0+34,BAY.x1-3].forEach(function(cx){ for (var j=0;j<11;j++){ var hw=Math.max(0,2-Math.floor(j/4)); for (var i=-hw;i<=hw;i++) wd.px(cx+i,BAY.bot+2+j,i===-hw?P.w3:(i===hw?P.w0:P.w1)); } });
  for (var k=0;k<3;k++) frameWin(wd,gl,BAY.x0+5+k*16,BAY.top+6,12,22,'curtain');
  // Traufe und Dach
  eave(rf,-2,HA.x1+6,HA.ev,7); tileRoof(rf,-6,HA.x1+5,HA.rf,HA.ev,11,3);
  rf.rect(CHIM[0][0]-4,0,8,HA.rf+1,P.s4); rf.vl(CHIM[0][0]+3,0,HA.rf,P.s2); rf.vl(CHIM[0][0]-4,0,HA.rf,P.s5);
  pr.ellipse(93.5,40.5,4.5,5,function(x,y){ return x<93?P.m4:P.m3; }); pr.px(91,38,P.s6); pr.line(94,41,98,44,P.m1); pr.px(98,44,P.k1);   // Satellitenschüssel
  // Erdgeschoss: vergittertes Fenster, Tür, Straßenschild, Hausnummer
  frameWin(wa,gl,18,72,16,20,'bars');
  var dby=Math.ceil(laneBase(DOORA.x0+12)); doorWood(wd,DOORA.x0,DOORA.top,DOORA.x1-DOORA.x0,dby,R('w0 w1 w2 w3'));
  for (y=DOORA.top-2;y<dby;y++){ wa.px(DOORA.x0-1,y,P.s3); wa.px(DOORA.x0-2,y,P.s6); wa.px(DOORA.x1,y,P.s2); wa.px(DOORA.x1+1,y,P.s4); }
  wa.hl(DOORA.x0-3,DOORA.x1+2,DOORA.top-1,P.s6); wa.hl(DOORA.x0-3,DOORA.x1+2,DOORA.top-2,P.s3); wa.hl(DOORA.x0-2,DOORA.x1+1,dby,P.s2);
  pr.rect(38,73,29,8,P.b1); pr.hl(38,66,73,P.b2); pr.hl(38,66,80,P.b0); pr.vl(66,73,80,P.b0); M.microText(pr,'VRATNIK',39,74,P.s6);
  pr.rect(95,64,7,7,P.b1); pr.hl(95,101,64,P.b2); M.microText(pr,'7',97,65,P.s6);
  // ---- Haus B hinter der Hofmauer des Nachbarn: weißes Erdgeschoss, Holz-Obergeschoss mit kleinem Erker, Walmdach
  for (x=HB.x0;x<=HB.x1;x++) for (y=HB.uf+20;y<KAP.wt;y++) wa.px(x,y,plaster(x,y,23,KAP.wt+8));
  for (x=HB.x0;x<=HB.x1;x++) for (y=HB.uf;y<HB.uf+20;y++) wd.px(x,y,woodBoard(x,y,9));
  wd.hl(HB.x0,HB.x1,HB.uf+20,P.w3); wd.hl(HB.x0,HB.x1,HB.uf+21,P.k2);
  for (x=HB.bx0;x<=HB.bx1;x++) for (y=HB.uf-2;y<HB.uf+19;y++){ var cb=woodBoard(x,y,13); if (y===HB.uf+18) cb=P.w3; wd.px(x,y,cb); }
  for (y=HB.uf-2;y<HB.uf+20;y++){ wd.px(HB.bx1+1,y,P.w0); wd.px(HB.bx1+2,y,P.k2); wd.px(HB.bx0-1,y,P.w3); } wd.hl(HB.bx0-1,HB.bx1+2,HB.uf+19,P.k2);
  [HB.bx0+2,HB.bx1-2].forEach(function(cx){ for (var j=0;j<6;j++){ var hw=Math.max(0,1-Math.floor(j/3)); for (var i=-hw;i<=hw;i++) wd.px(cx+i,HB.uf+20+j,i===-hw?P.w3:P.w1); } });
  frameWin(wd,gl,HB.bx0+3,HB.uf+2,8,13,'curtain'); frameWin(wd,gl,HB.bx0+15,HB.uf+2,8,13,'curtain');
  eave(rf,HB.x0-3,HB.x1+3,HB.uf-7,5); tileRoof(rf,HB.x0-5,HB.x1+4,HB.uf-17,HB.uf-7,10,11);
  rf.rect(CHIM[2][0]-2,CHIM[2][1],5,HB.uf-17-CHIM[2][1]+2,P.s4); rf.vl(CHIM[2][0]+2,CHIM[2][1],HB.uf-16,P.s2); rf.hl(CHIM[2][0]-3,CHIM[2][0]+3,CHIM[2][1]-1,P.t1);
  // ---- Gartenmauer des Nachbarn mit großem Holztor und Weinrebe
  for (x=HA.x1+1;x<GAP.x0;x++){ var bb2=Math.ceil(laneBase(x)); for (y=KAP.wt;y<bb2;y++) wa.px(x,y,y>bb2-7?blocks(x,y,7,4,7,PLX,P.s0):plaster(x,y,6,bb2)); wa.px(x,KAP.wt-1,P.t2); wa.px(x,KAP.wt-2,(x%3)?P.t3:P.t1); wa.px(x,KAP.wt-3,P.t1); wa.px(x,KAP.wt,P.s2); }
  for (y=KAP.wt-3;y<Math.ceil(laneBase(GAP.x0));y++){ wa.px(GAP.x0,y,P.s4); wa.px(GAP.x0+1,y,P.s2); }
  var kb=Math.ceil(laneBase((KAP.x0+KAP.x1)/2)); doorWood(wd,KAP.x0,KAP.top,KAP.x1-KAP.x0,kb,R('w0 w1 w2 w3'),true);
  for (y=KAP.top-3;y<kb;y++){ wd.px(KAP.x0-1,y,P.w0); wd.px(KAP.x0-2,y,P.w2); wd.px(KAP.x1,y,P.w0); wd.px(KAP.x1+1,y,P.w1); }
  wd.rect(KAP.x0-4,KAP.top-4,KAP.x1-KAP.x0+8,3,P.w1); wd.hl(KAP.x0-4,KAP.x1+3,KAP.top-4,P.w3);
  for (y=KAP.top-13;y<KAP.top-4;y++){ var t2=(y-(KAP.top-13))/9, ins=rnd((1-t2)*7); for (x=KAP.x0-8+ins;x<=KAP.x1+7-ins;x++) rf.px(x,y,((x-KAP.x0)%3===0)?P.t1:(y===KAP.top-5?P.t1:(hash(x,y)<0.1?P.t2:P.t3))); }
  vine(pr,147,kb);
  // ---- Gässchen: Stufen hinunter, weiter unten das Dach eines tieferen Hauses, Geländer
  var gb=Math.ceil(laneBase(GAP.x0+12));
  for (y=82;y<gb-15;y++) for (x=GAP.x0+1;x<GAP.x1;x++){ var ry2=y-82, ridge=(ry2<2), c4=ridge?P.t1:((((x-GAP.x0)+(ry2>>1))%3===0)?P.t1:(ry2%3===0?P.t2:P.t3)); if (hash(x,y)<0.08) c4=P.t2; rf.px(x,y,c4); }
  rf.rect(GAP.x0+15,77,4,6,P.s3); rf.vl(GAP.x0+18,77,82,P.s1); rf.hl(GAP.x0+14,GAP.x0+19,76,P.t1);
  for (var s=0;s<6;s++){ var sy=gb-2-s*3, ins=rnd(s*0.6); for (x=GAP.x0+2+ins;x<GAP.x1-ins;x++){ st.px(x,sy,s<2?P.s4:(s<4?P.s3:P.s2)); st.px(x,sy+1,s<3?P.s2:P.s1); st.px(x,sy+2,s===0?P.s0:P.k2); } }
  for (y=gb-17;y<gb-2;y++){ wa.px(GAP.x0+1,y,P.s3); wa.px(GAP.x1-1,y,P.s2); }
  for (y=gb-16;y<gb-2;y++) pr.px(GAP.x0+5+rnd((gb-2-y)*0.25),y,P.m1);
  pr.line(GAP.x0+4,gb-15,GAP.x0+9,gb-19,P.m2);
  // ---- Moschee: Gebetsraum mit Walmdach hinter der Hofmauer, hölzernes Minarett, Hofmauer mit Rundbogentor
  for (x=MOS.hall0;x<=MOS.hall1;x++) for (y=MOS.ht;y<MOS.wt;y++) wa.px(x,y,plaster(x,y,11,MOS.wt+20));
  [MOS.hall0+7,MOS.hall0+19,MOS.hall0+31].forEach(function(wx){ archWin(gl,wx,MOS.ht+7,6,14); });
  eave(rf,MOS.hall0-3,MOS.hall1+3,MOS.ht-4,4); tileRoof(rf,MOS.hall0-5,MOS.hall1+5,MOS.rf,MOS.ht-4,12,8);
  minaretW(wd,MOS.mx,MOS.wt+1);
  for (x=MOS.x0;x<MOS.x1;x++){ var bb3=Math.ceil(laneBase(x)); for (y=MOS.wt;y<bb3;y++) wa.px(x,y,y>bb3-7?blocks(x,y,7,4,9,PLX,P.s0):plaster(x,y,13,bb3)); wa.px(x,MOS.wt-1,P.t2); wa.px(x,MOS.wt-2,(x%3)?P.t3:P.t1); wa.px(x,MOS.wt-3,P.t1); wa.px(x,MOS.wt,P.s3); }
  for (y=MOS.wt-3;y<Math.ceil(laneBase(MOS.x0));y++){ wa.px(MOS.x0,y,P.s3); wa.px(MOS.x0+1,y,P.s5); }
  var mg=Math.ceil(laneBase(201)); archDoor(wd,wa,191,MOS.wt+10,20,mg);
  pr.rect(199,MOS.wt+1,4,4,P.m1); pr.px(200,MOS.wt+5,P.s5); pr.px(201,MOS.wt+5,P.s4);                   // Lampe über dem Tor
  // ---- Ružas Haus hinter der Gartenmauer, der Quittenbaum, das eigene Tor
  for (x=RZ.h0;x<=RZ.h1;x++) for (y=RZ.ht;y<RZ.wt;y++) wa.px(x,y,plaster(x,y,17,RZ.wt+20));
  frameWin(wd,gl,278,RZ.ht+8,12,16,'curtain');
  for (y=RZ.ht+6;y<RZ.ht+26;y++){ wd.px(276-5,y,P.w2); for (x=271;x<276;x++) wd.px(x,y,((y-RZ.ht)%3===0)?P.w1:P.w3); }   // ein offener Holzladen
  eave(rf,RZ.h0-3,RZ.h1+3,RZ.ht-4,4); tileRoof(rf,RZ.h0-5,RZ.h1+4,RZ.rf,RZ.ht-4,10,5);
  rf.rect(292,RZ.rf-7,6,9,P.s3); rf.vl(297,RZ.rf-7,RZ.rf+1,P.s1); rf.hl(291,298,RZ.rf-8,P.t1);
  quince(RW(b,RG.tree),QX,RZ.wt);
  for (x=RZ.x0;x<RZ.x1;x++){ var bb4=Math.ceil(laneBase(x)), top=RZ.wt+(hash(x>>2,5)<0.3?1:0); for (y=top;y<bb4;y++) wa.px(x,y,y>bb4-7?blocks(x,y,7,4,12,PLX,P.s0):plaster(x,y,19,bb4)); if (hash(x>>1,9)<0.75){ wa.px(x,top-1,P.s3); } wa.px(x,top,P.s2); }
  weeds(pr,RZ.x0,RZ.x1,RZ.wt-1,31);
  for (y=RZ.wt-1;y<Math.ceil(laneBase(RZ.x0));y++){ wa.px(RZ.x0,y,P.s2); wa.px(RZ.x0+1,y,P.s4); }
  var gb2=Math.ceil(laneBase((GATE.x0+GATE.x1)/2)); gateRuza(wd,rf,gb2);
  // ---- Stadtmauer aus gelblichem Stein mit Zinnen
  for (x=CW0;x<CW1;x++){ var bb5=Math.ceil(laneBase(x)), cr=(x-CW0)%12<7; for (y=CWT-(cr?7:0);y<bb5;y++){ var c2=blocks(x-CW0,y,9+(Math.floor(y/6)%3),6,21,YST,P.e2); if (fbm(x,y*0.5,6,4)>0.66) c2=M.DN[c2]; if (x>=CW1-3) c2=M.DN[c2]; st.px(x,y,c2); } }
  for (x=CW0;x<CW1;x++){ var cr2=(x-CW0)%12<7, ty=CWT-(cr2?7:0); st.px(x,ty,P.s5); st.px(x,ty+1,P.e4); if (!cr2) st.px(x,ty+2,P.e2); }
  [[318,56],[346,56]].forEach(function(l){ st.rect(l[0],l[1],2,9,P.k1); st.px(l[0],l[1]-1,P.e2); st.px(l[0]+1,l[1]+9,P.e4); });       // Schießscharten
  weeds(pr,CW0,CW1,Math.ceil(laneBase(CW0+30))-1,37);
  for (var q=0;q<16;q++){ var fx=330+rnd(hash(q,4)*9), fy=82+rnd(hash(q,5)*7); pr.px(fx,fy,hash(q,6)<0.5?P.g2:P.g3); }   // Strauch aus einer Fuge
  // ---- Stromkabel von Haus A zur Moschee
  for (x=HA.x1+2;x<MOS.mx-4;x++){ var t3=(x-HA.x1)/(MOS.mx-4-HA.x1); pr.px(x,rnd(30+t3*14+Math.sin(Math.PI*t3)*7),P.k1); }
}
// Fenster: Rahmen, Glas mit Spitzengardine oder Gitter
function frameWin(w,g,x,y,ww,wh,kind){ w.rect(x-2,y-2,ww+4,wh+4,P.w0); w.hl(x-2,x+ww+1,y-2,P.w3); w.hl(x-3,x+ww+2,y+wh+1,P.s4); w.hl(x-3,x+ww+2,y+wh+2,P.s2);
  for (var j=y;j<y+wh;j++) for (var i=x;i<x+ww;i++){ var c; if (kind==='bars'){ c=(j<y+3)?P.n1:P.k1; if ((i-x)%4===1||(j-y)%5===2) c=P.m1; }
    else { var u=i-x, v=j-y; c=(u%5===0)?P.s3:((((u+v*2)%6)===0&&(v%2===0))?P.s3:P.s5); if (v<2) c=P.s2; if (u===(ww>>1)) c=P.w1; if (v===(wh>>1)) c=P.w1; }
    g.px(i,j,c); } }
function archWin(g,x,y,ww,wh){ for (var j=y;j<y+wh;j++) for (var i=x;i<x+ww;i++){ var dx=(i+0.5-x-ww/2)/(ww/2), top=y+(1-Math.sqrt(Math.max(0,1-dx*dx)))*3.5; if (j<top) continue; g.px(i,j,(i===x||j===y+wh-1)?P.s2:((j<top+1)?P.s3:P.k2)); }
  for (var i2=x-1;i2<=x+ww;i2++) g.px(i2,y+wh,P.s5); }
function archDoor(w,wa,x,y,dw,yb){ for (var j=y-4;j<yb;j++) for (var i=x-3;i<x+dw+3;i++){ var dx=(i+0.5-x-dw/2)/(dw/2+3), top=y-4+(1-Math.sqrt(Math.max(0,1-dx*dx)))*8; if (j<top) continue; wa.px(i,j,(j<top+1.5)?P.s6:((i<x||i>=x+dw)?P.s4:P.s3)); }
  for (var j2=y;j2<yb;j2++) for (var i2=x;i2<x+dw;i2++){ var dx2=(i2+0.5-x-dw/2)/(dw/2), top2=y+(1-Math.sqrt(Math.max(0,1-dx2*dx2)))*7; if (j2<top2) continue; var u=i2-x, c=(u%4===0)?P.g1:P.g2; if (u===(dw>>1)) c=P.g0; if (j2<top2+1) c=P.g1; if (hash(i2,j2)<0.08) c=P.g3; if ((j2-y)%10===5 && u%4===2) c=P.y2; w.px(i2,j2,c); }
  w.px(x+(dw>>1)-2,y+rnd((yb-y)*0.5),P.y3); w.px(x+(dw>>1)+1,y+rnd((yb-y)*0.5),P.y3); }
// Holztür (Bretter, Beschläge); big = zwei Flügel mit Nagelreihen
function doorWood(w,x,y,dw,yb,Rw,big){ for (var j=y;j<yb;j++) for (var i=x;i<x+dw;i++){ var u=i-x, c=(u%4===0)?Rw[0]:((hash(Math.floor(u/4),3)<0.5)?Rw[2]:Rw[1]); if (big && u===(dw>>1)) c=P.k1; if (big && (j-y)%9===4 && (u%4)===2) c=P.m2; if (hash(i,j>>1)<0.1) c=Rw[1]; if (j>yb-5 && hash(i,j)<0.3) c=Rw[0]; w.px(i,j,c); }
  for (var k=0;k<2;k++){ var hy=y+6+k*(yb-y-14); w.hl(x+1,x+dw-2,hy,P.k1); w.hl(x+1,x+dw-2,hy+1,P.m1); }
  if (big){ w.ellipse(x+(dw>>1)-3.5,y+(yb-y)*0.48,1.8,1.8,P.m2); w.px(x+(dw>>1)-4,y+rnd((yb-y)*0.48)-1,P.m3); w.ellipse(x+(dw>>1)+3.5,y+(yb-y)*0.48,1.8,1.8,P.m1); }
  else { var ky=y+rnd((yb-y)*0.5); w.rect(x+dw-5,ky,2,4,P.y2); w.px(x+dw-5,ky,P.y4); w.px(x+dw-5,ky+5,P.k1); } }
// Ružas Tor: verwittertes, silbergraues Holz, kleines Ziegeldach, rostiger Riegel
function gateRuza(w,rf,yb){ var x0=GATE.x0, x1=GATE.x1, top=GATE.top, j, i;
  for (j=top;j<yb;j++) for (i=x0;i<x1;i++){ var u=i-x0, c=(u%4===0)?P.s1:((hash(Math.floor(u/4),7)<0.5)?P.e2:P.s2); if (hash(i*1.3,j>>1)<0.12) c=P.e1; if (fbm(i,j,4,3)>0.7) c=P.e3; if (j>yb-6 && hash(i,j)<0.35) c=P.g2; w.px(i,j,c); }
  for (j=top-1;j<yb;j++){ w.px(x0-1,j,P.w0); w.px(x1,j,P.w0); w.px(x0-2,j,P.w2); w.px(x1+1,j,P.w1); }
  [top+6,yb-9].forEach(function(hy){ w.hl(x0,x1-1,hy,P.w1); w.hl(x0,x1-1,hy+1,P.t1); });
  w.line(x0+1,yb-9,x1-2,top+8,P.w1);                                                                  // Schrägstrebe
  var ly=top+rnd((yb-top)*0.46); w.rect(x1-6,ly,3,5,P.t1); w.px(x1-5,ly+2,P.k0); w.hl(x1-11,x1-6,ly-1,P.t2); w.px(x1-11,ly-1,P.t3);   // Riegel, Schlüsselloch
  for (j=top-9;j<top-1;j++){ var t=(j-(top-9))/8, ins=rnd((1-t)*6); for (i=x0-6+ins;i<=x1+5-ins;i++){ var c2=((i-x0)%3===0)?P.t1:(j===top-2?P.t1:P.t3); if (hash(i,j)<0.12) c2=P.t2; if (i===x0+9 && j>top-6) c2=P.w0; rf.px(i,j,c2); } }
  rf.hl(x0-4,x1+3,top-1,P.w0); }
// hölzernes Minarett: weiß verputzte Bretter, Balkon mit Geländer, hohe spitze Haube
function minaretW(w,cx,by){ var x0=cx-3, x1=cx+3, j, i, balc=30, capB=24, top=4;
  for (j=capB;j<by;j++) for (i=x0;i<=x1;i++){ var c=(i===x0)?P.s6:((i===x1)?P.s2:((i-x0)%2?P.s4:P.s5)); if (j>balc+2 && j<balc+6) c=M.DN[c]; if (j===balc+14) c=P.s3; w.px(i,j,c); }
  for (i=x0-3;i<=x1+3;i++){ w.px(i,balc,P.w3); w.px(i,balc+1,P.w1); w.px(i,balc+3,P.w2); if ((i-x0)%2===0) w.px(i,balc+2,P.w1); }
  for (i=x0-2;i<=x1+2;i++){ w.px(i,balc-1,P.m2); } for (j=balc-5;j<balc-1;j++){ w.px(x0-2,j,P.w1); w.px(x1+2,j,P.w1); }
  for (j=capB-1;j<balc-1;j++) for (i=x0-1;i<=x1+1;i++) w.px(i,j,(i<cx)?P.m3:P.m2);
  for (j=top;j<capB;j++){ var f=(j-top)/(capB-top), hw=Math.max(0,rnd(f*4.2)); for (i=cx-hw;i<=cx+hw;i++) w.px(i,j,i<cx?P.m3:(i===cx?P.m4:P.m1)); }
  w.vl(cx,top-4,top-1,P.y2); w.px(cx+1,top-4,P.y3); w.px(cx-1,top-3,P.y3); w.px(cx,top-5,P.y3);
  w.rect(cx-1,balc+8,2,6,P.k2); w.px(cx-1,balc+8,P.s3); }
// Weinrebe: knorriger Stamm, kahle Ranken über Mauer und Tor, ein paar gelbe und rostrote Blätter
function vine(w,x,yb){ var r=M.rng(5);
  for (var y=KAP.wt-3;y<yb;y++){ var xx=rnd(x+Math.sin(y*0.3)*1.2); w.px(xx,y,P.w1); w.px(xx+1,y,y%3?P.w0:P.w2); }
  for (var k=0;k<6;k++){ var y0=KAP.wt-3-k, len=12+rnd(r()*32); for (var s=0;s<len;s++){ var px=x-s, py=rnd(y0-Math.sin(s*0.18+k)*2.5-s*0.03*(k%2?1:-1)); w.px(px,py,(s%5===0)?P.w2:P.w1); if (r()<0.12) w.px(px,py-1,P.w1); } }
  for (var i=0;i<70;i++){ var lx=x-rnd(r()*44), ly=KAP.wt-4-rnd(r()*10), q=r(), c=q<0.35?P.y3:(q<0.6?P.t3:(q<0.8?P.y2:P.e3)); w.px(lx,ly,c); if (r()<0.5) w.px(lx+1,ly,M.DN[c]); }
  [[133,KAP.wt-2],[118,KAP.wt-1],[125,KAP.wt-3]].forEach(function(g){ w.px(g[0],g[1],P.d1); w.px(g[0]+1,g[1],P.d2); w.px(g[0],g[1]+1,P.d1); w.px(g[0]+1,g[1]+1,P.d0); }); }
// Quittenbaum: kahl, knorrig, zwei vergessene Früchte
function quince(w,x,wt){ var r=M.rng(17);
  for (var y=wt-24;y<wt;y++){ var xx=rnd(x+Math.sin(y*0.2)*1.5); w.px(xx,y,P.w1); w.px(xx+1,y,P.w0); w.px(xx-1,y,P.w2); }
  function br(x0,y0,a,len,d){ var px=x0, py=y0; for (var s=0;s<len;s++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.35; w.px(rnd(px),rnd(py),d<2?P.w1:P.w2); if (d<1) w.px(rnd(px)+1,rnd(py),P.w0); }
    if (d<3){ var n=d<1?3:2; for (var k=0;k<n;k++) br(px,py,a+(r()-0.5)*1.6,len*(0.55+r()*0.2),d+1); } }
  br(x,wt-24,-Math.PI/2-0.55,12,0); br(x,wt-24,-Math.PI/2+0.45,11,0); br(x,wt-17,-Math.PI/2-1.15,9,1); br(x,wt-15,-0.3,8,1);
  [[x-11,wt-36],[x+10,wt-41]].forEach(function(f){ w.px(f[0],f[1],P.y3); w.px(f[0]+1,f[1],P.y2); w.px(f[0],f[1]+1,P.y2); w.px(f[0]+1,f[1]+1,P.y1); w.px(f[0]+1,f[1]-1,P.w1); }); }
function weeds(w,x0,x1,y,sd){ var r=M.rng(sd); for (var x=x0;x<x1;x++){ if (r()<0.45) continue; var h=1+rnd(r()*r()*8); for (var k=0;k<h;k++) w.px(x+(k>2&&r()<0.5?1:0),y-k,r()<0.5?P.e3:(r()<0.5?P.e2:P.w2)); if (r()<0.06){ w.px(x,y-h-1,P.r3); w.px(x+1,y-h,P.r2); } } }

// ---------------------------------------------------------------- Bastei: Brüstung, Bank, Kanonensockel, Laterne
function paintBastion(b){ var st=RW(b,RG.stone), pr=RW(b,RG.prop), x, y;
  for (x=PX0;x<W;x++){ var f=rnd(paraFoot(x)), h=rnd(paraH(x)), top=f-h;
    for (y=top;y<=f;y++){ var c=blocks(x,y,9,5,31,YST,P.e2); if (fbm(x,y,5,6)>0.68) c=M.DN[c]; if (y<top+4) c=(y===top)?P.s6:(y===top+1?P.s4:(y===top+2?P.e3:P.e1)); if (y===f) c=P.e1; st.px(x,y,c); } }
  // Ecke, an der die Stadtmauer zur Brüstung herabsteigt
  for (x=CW1-3;x<PX0+5;x++){ var t=(x-(CW1-3))/(PX0+8-CW1), ty=rnd(lerp(CWT,paraFoot(x)-paraH(x),sm(t))); for (y=ty;y<rnd(paraFoot(x));y++) st.px(x,y,y<ty+2?(y===ty?P.s5:P.e4):M.DN[blocks(x,y,10,5,33,YST,P.e1)]); }
  // Bank von hinten: Lehne aus zwei Brettern (oben ein breites), gusseiserne Beine
  var bx0=BENCH.x0, bx1=BENCH.x1, by=BENCH.by;
  [bx0+3,bx1-5].forEach(function(lx){ pr.rect(lx,by-12,2,12,P.k2); pr.px(lx-1,by-1,P.k1); pr.px(lx+2,by-1,P.k1); pr.vl(lx,by-23,by-12,P.k2); pr.vl(lx+1,by-23,by-12,P.k1); });
  pr.rect(bx0,by-13,bx1-bx0,2,P.w1); pr.hl(bx0,bx1-1,by-13,P.w3);                                        // Sitz (hinten)
  pr.rect(bx0-1,by-24,bx1-bx0+2,6,P.w2); pr.hl(bx0-1,bx1,by-24,P.w4); pr.hl(bx0-1,bx1,by-19,P.w1);       // breites oberes Brett
  pr.rect(bx0-1,by-17,bx1-bx0+2,3,P.w2); pr.hl(bx0-1,bx1,by-17,P.w3); pr.hl(bx0-1,bx1,by-15,P.w1);
  for (x=bx0;x<bx1;x++){ if (hash(x,3)<0.15) pr.px(x,by-22+rnd(hash(x,4)*3),P.w1); }
  // Kanonensockel: niedriger Block aus hellem, behauenem Stein mit Eisenplatte und Ringen, Schatten davor
  var cx0=CANNON.x0, cx1=CANNON.x1, cb=CANNON.by;
  for (x=cx0-2;x<cx1+5;x++){ var kk=cb*W+x; b.d[kk]=M.DN[M.DN[b.d[kk]]]; b.d[kk+W]=M.DN[b.d[kk+W]]; }
  for (y=cb-12;y<cb;y++) for (x=cx0;x<cx1;x++){ var u=(x-cx0)/(cx1-cx0), c3=u<0.12?P.s5:(u>0.85?P.s2:(hash(x>>2,y>>2)<0.5?P.s4:P.s3)); if ((y-cb)%6===0) c3=P.s2; if (hash(x,y)<0.06) c3=P.e3; pr.px(x,y,c3); }
  for (y=cb-12;y<cb-2;y++){ pr.px(cx1,y,P.s1); pr.px(cx1+1,y,P.s0); }
  pr.rect(cx0-1,cb-15,cx1-cx0+2,3,P.s4); pr.hl(cx0-1,cx1,cb-15,P.s6); pr.hl(cx0-1,cx1,cb-13,P.s2); pr.px(cx1+1,cb-14,P.s1);
  pr.rect(cx0+4,cb-17,cx1-cx0-8,2,P.m1); pr.hl(cx0+4,cx1-5,cb-17,P.m3); [cx0+6,cx1-7].forEach(function(bx){ pr.px(bx,cb-17,P.m4); });   // Eisenplatte, Bolzen
  [cx0+5,cx1-7].forEach(function(rx){ pr.px(rx,cb-9,P.m2); pr.px(rx+1,cb-8,P.m1); pr.px(rx-1,cb-8,P.m1); pr.px(rx,cb-7,P.m0); pr.px(rx,cb-10,P.m1); });
  lampPaint(pr,false); }
// Laterne: gusseiserner Mast mit Sockel und Querstange, vierseitiger Glaskopf
function lampPaint(w,lit){ var x=LAMP.x, by=LAMP.by, top=by-LAMP.h, y;
  if (!lit){ w.rect(x-3,by-9,7,9,P.k2); w.hl(x-3,x+3,by-9,P.m1); w.hl(x-4,x+4,by-1,P.k1); w.vl(x-3,by-9,by-1,P.m0); w.rect(x-2,by-13,5,4,P.k2); w.hl(x-2,x+2,by-13,P.m1);
    for (y=top+13;y<by-13;y++){ w.px(x-1,y,P.m1); w.px(x,y,P.k2); w.px(x+1,y,P.k1); }
    for (y=top+30;y<by-13;y+=12) w.hl(x-1,x+1,y,P.m2);
    w.hl(x-5,x+5,top+12,P.k2); w.px(x-5,top+13,P.k1); w.px(x+5,top+13,P.k1); w.hl(x-2,x+2,top+13,P.k2); }
  w.poly([[x-5,top+3],[x+5,top+3],[x+4,top+11],[x-4,top+11]],lit?P.y4:P.m2); w.vl(x,top+3,top+10,lit?P.y5:P.m1); w.vl(x-4,top+4,top+10,lit?P.y3:P.m3);
  w.hl(x-6,x+6,top+2,P.k1); w.poly([[x-5,top+2],[x+5,top+2],[x,top-3]],P.k2); w.px(x,top-4,P.k1); w.px(x,top-5,P.k2); w.hl(x-4,x+4,top+11,P.k1);
  if (lit){ w.px(x-1,top+6,P.l1); w.px(x+1,top+6,P.l0); w.px(x-1,top+7,P.l0); } }

// ---------------------------------------------------------------- Pflaster: Kopfsteine in der Gasse, Steinplatten auf der Bastei
function laneFloor(x,y){ var d=y-laneBase(x), D=2600/(d+70), u=(x-260)*D/100/2.1, v=D/1.9, du=D/100/2.1, dv=2600/((d+70)*(d+70))/1.9;
  var gx=Math.floor(u), gy=Math.floor(v), b1=9, b2=9, bi=0, bj=0, bdx=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=gx+i+0.2+hash(gx+i,gy+j)*0.6, cy=gy+j+0.2+hash(gx+i+31,(gy+j)*1.7)*0.6, dx=u-cx, dy=(v-cy)*1.15, q=dx*dx+dy*dy;
    if (q<b1){ b2=b1; b1=q; bi=gx+i; bj=gy+j; bdx=dx; bdy=dy; } else if (q<b2) b2=q; }
  var edge=Math.sqrt(b2)-Math.sqrt(b1), thr=0.62*(du+dv);
  if (edge<thr) return (hash(x,y)<0.35)?P.e1:P.s0;                                                        // Fugen: Erde
  var t=hash(bi*3+1,bj*5+2), base=t<0.3?P.s2:(t<0.58?P.s3:(t<0.8?P.e2:(t<0.92?P.e3:P.s4))), c=base;
  if (bdy<-0.12&&bdx<0.25) c=M.UP[base]; else if (bdy>0.22||bdx>0.32) c=M.DN[base]; if (edge<thr*1.8 && bdy>0) c=M.DN[c];
  if (hash(x*1.7,y*2.1)<0.025) c=hash(x,y)<0.5?P.y2:P.t3;                                                // ein Blatt
  return c; }
function terrFloor(x,y){ var d=y-paraFoot(x), D=2600/(d+70), u=(x-480)*D/100/3.6, v=D/3.0, du=D/100/3.6, dv=2600/((d+70)*(d+70))/3.0;
  var gx=Math.floor(u), gy=Math.floor(v), b1=9, b2=9, bi=0, bj=0, bdx=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=gx+i+0.15+hash(gx+i+7,gy+j)*0.7, cy=gy+j+0.15+hash(gx+i,(gy+j)*2.3+5)*0.7, dx=u-cx, dy=(v-cy)*1.2, q=dx*dx+dy*dy;
    if (q<b1){ b2=b1; b1=q; bi=gx+i; bj=gy+j; bdx=dx; bdy=dy; } else if (q<b2) b2=q; }
  var edge=Math.sqrt(b2)-Math.sqrt(b1), thr=0.5*(du+dv)*(1+fbm(x,y,7,3)*1.2), worn=fbm(x*0.7,y*1.5,14,9);
  if (edge<thr) return hash(x,y)<0.55?P.g2:(hash(x+3,y)<0.5?P.e1:P.g1);                                   // Fugen mit Gras
  if (worn>0.66){ var gr=hash(x,y); return gr<0.3?P.e2:(gr<0.65?P.e3:(gr<0.85?P.s3:P.g2)); }               // ausgetretene Kiesstelle
  var t=hash(bi*7+3,bj*3+1), c=t<0.3?P.e3:(t<0.62?P.s3:(t<0.88?P.e4:P.s4));
  if (bdy<-0.2 && edge<thr*2.6) c=M.UP[c]; else if (bdy>0.25 && edge<thr*2.2) c=M.DN[c];
  if (fbm(x,y*2,5,bi)>0.72) c=M.DN[c]; if (hash(x*2.3,y*1.9)<0.035) c=P.e2;
  if (d<5 && hash(x,y)<0.55-d*0.1) c=(hash(x+1,y)<0.5)?P.g2:P.e2;                                         // dürres Gras an der Brüstung
  return c; }
function paintFloors(b){ var la=RW(b,RG.lane), te=RW(b,RG.terr), x, y;
  for (x=0;x<W;x++){ var y0=Math.ceil(backY(x)); for (y=y0;y<H;y++){ var lane=x<PX0-6||(x<PX0+30 && (x-(PX0-6))<(y-y0)*0.9); if (lane) la.px(x,y,laneFloor(x,y)); else te.px(x,y,terrFloor(x,y)); } }
  for (x=0;x<PX0;x++){ var yb=Math.ceil(laneBase(x)); if (hash(x,7)<0.25){ la.px(x,yb,P.g2); if (hash(x,8)<0.5) la.px(x,yb-1,P.e2); } } }

// ---------------------------------------------------------------- Licht
function lightFn(tod){ var day=tod==='day';
  return function(x,y){ var r=REG[y*W+x]; if (r===RG.sky||r===RG.view) return 0; var v=0;
    if (r===RG.wall||r===RG.wood||r===RG.glass||r===RG.gate){ var by=laneBase(x);
      if (y>by-16) v-=(y-(by-16))/16*0.35;
      if (x<=HA.x1+2 && y<HA.ev+16 && y>=HA.ev) v-=(HA.ev+16-y)/16*0.9;                                     // Schatten der Traufe
      if (x>=MOS.hall0 && x<=MOS.hall1 && y<MOS.ht+8) v-=(MOS.ht+8-y)/8*0.7;
      if (x>=HB.x0 && x<=HB.x1+2 && y>=HB.uf-2 && y<HB.uf+8) v-=(HB.uf+8-y)/10*0.8;
      if (x>=RZ.h0 && y<RZ.ht+8 && y>=RZ.ht) v-=(RZ.ht+8-y)/8*0.7;
      if (day){ v+=0.25; if (x>GAP.x1 && x<GAP.x1+7) v-=0.45; } }
    else if (r===RG.lane||r===RG.terr){ var d=y-backY(x); if (d<6) v-=(6-d)/6*0.55; if (day){ v+=0.1; if (r===RG.lane && x<HA.x1+40 && d<16) v-=0.3*(1-d/16); } v+=(y-120)/24*0.12; }
    else if (r===RG.stone){ if (day) v+=(x>=CW1-3&&x<PX0+5)?-0.35:0.25; if (y>backY(x)-7 && x>=PX0) v-=0.25; }
    else if (r===RG.roof){ if (day) v+=0.1; }
    else if (r===RG.tree){ if (day) v+=0.15; }
    if (!day) v-=0.12;
    return v; }; }
// warme Lichtinseln: Laterne auf der Bastei, Lampe am Moscheetor (gedithert in Stufen wie in Varoš)
var DIMW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+r*0.12+12, L*0.38+g*0.08+8, L*0.26+b*0.1+16]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.45+L*0.36+16, g*0.32+L*0.26+6, b*0.16+L*0.08+4]; });
var LWALL=[[LAMP.x,LAMP.by-LAMP.h+10,70,64,0.95],[LAMP.x+18,100,74,24,0.62],[201,MOS.wt+4,34,30,0.85]];
var LFLOOR=[[LAMP.x+6,124,78,16,0.9],[201,118,38,10,0.55]];
function lightAt(x,y,r){ var set=(r===RG.lane||r===RG.terr)?LFLOOR:LWALL, L=0; for (var i=0;i<set.length;i++){ var l=set[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], f=1-dx*dx-dy*dy; if (f>0){ var v=l[4]*Math.pow(f,1.15); if (v>L) L=v; } } return L; }
function warmPass(b,base){ var LT=M.TINT.lamp;
  for (var y=0;y<H;y++) for (var x=150;x<520;x++){ var k=y*W+x, r=REG[k]; if (r===RG.sky||r===RG.view) continue; var L=lightAt(x,y,r); if (L<0.03) continue;
    var f=L*3.3, lv=Math.floor(f), fr=f-lv, t=lv===0?fr:(fr-0.5)*1.7+0.5; if (t>bayer(x,y)) lv++; if (lv<=0) continue;
    var c=base.d[k]; b.d[k]=lv===1?M.tintPx(DIMW,c,x,y):(lv===2?M.tintPx(MIDW,c,x,y):(lv===3?M.tintPx(LT,c,x,y):M.UP[M.tintPx(LT,c,x,y)])); } }
function actorLut(a,S,GS,tod){ if (tod==='day'||!M.TINT[tod]) return null; var dx=(a.x-LAMP.x-6)/72, dy=(a.y-124)/22, f=1-dx*dx-dy*dy, L=f>0?Math.pow(f,0.8):0;
  var dz=(a.x-201)/36; if (Math.abs(dz)<1 && a.y<126) L=Math.max(L,0.32*(1-dz*dz));
  if (L>0.5) return MIDW.a; if (L>0.2) return DIMW.a; return M.TINT[tod].a; }

// ---------------------------------------------------------------- Bild
var LAST=null, VIEWPX=null;
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0); REG.fill(0); if (tod!=='night') tod='day';
  paintSky(b,tod); paintView(b,tod); hazeView(b,tod);
  paintLane(b,S); paintFloors(b); paintBastion(b);
  M.light(b,lightFn(tod),0,0);
  var base=b.clone();
  M.finishTOD(b,tod,{ sky:function(x,y){ var r=REG[y*W+x]; return r===RG.sky||r===RG.view; } });
  if (tod==='night'){ warmPass(b,base); nightLights(b); }
  // Lichter im Tal, die funkeln dürfen
  VIEWPX=[]; if (tod==='night'){ for (var y=HZ-6;y<104;y++) for (var x=140;x<W;x++){ var k=y*W+x; if (REG[k]!==RG.view) continue; var c=b.d[k]; if ((c===P.y4||c===P.y5||c===P.l0) && hash(x*0.7,y*1.3)<0.35) VIEWPX.push(k,c); } }
  LAST=b; return b; }
// erleuchtete Fenster, Laternenglas
function nightLights(b){ var w={px:function(x,y,c){ b.px(x,y,c); },rect:function(x,y,ww,hh,c){ b.rect(x,y,ww,hh,c); },hl:function(a,z,y,c){ b.hl(a,z,y,c); },vl:function(x,a,z,c){ b.vl(x,a,z,c); },poly:function(p,c){ b.poly(p,c); }};
  lampPaint(w,true);
  [[BAY.x0+5,BAY.top+6,12,22],[BAY.x0+37,BAY.top+6,12,22],[72,30,13,18],[HB.bx0+15,HB.uf+2,8,13]].forEach(function(q,qi){ var x0=q[0], y0=q[1]; for (var j=y0;j<y0+q[3];j++) for (var i=x0;i<x0+q[2];i++){ if (REG[j*W+i]!==RG.glass) continue; var u=i-x0, v=j-y0;
      var c=(u===(q[2]>>1)||v===(q[3]>>1))?P.y1:((((u+v*2)%6)===0&&(v%2===0))?P.y3:(v<2?P.y2:(bayer(i,j)<0.5?P.y4:P.y3))); if (qi>=2) c=M.DN[c]; b.px(i,j,c); } });
  b.rect(199,MOS.wt+2,4,3,P.y4); b.px(200,MOS.wt+3,P.l0); b.px(201,MOS.wt+3,P.y5); }

// ---------------------------------------------------------------- jedes Bild: Lichter funkeln, Rauch, Hund, Licht am Fernsehturm
function dynamic(fb,v,S,GS){ var t=v.t, cam=v.cam, night=v.tod==='night', fw=fb.w;
  if (VIEWPX) for (var i=0;i<VIEWPX.length;i+=2){ var k=VIEWPX[i], x=k%W, y=(k/W)|0, sx=x-cam; if (sx<0||sx>=fw) continue; var s=Math.sin(t*(1.3+hash(i,1)*2.2)+hash(i,2)*6.28); if (s>0.75) fb.d[y*fw+sx]=P.l1; else if (s<-0.85) fb.d[y*fw+sx]=P.y2; }
  if (night){ var on=(t%2.4)<1.2, tx=TOWERX-cam, ty=rnd(humY(TOWERX))-25; if (tx>=0&&tx<fw) fb.px(tx,ty,on?P.r4:P.r1); }
  // Rauch aus den Kaminen: nur vor Himmel und Talblick (hinter Mauern und Dächern)
  CHIM.forEach(function(c,ci){ for (var p=0;p<9;p++){ var per=6+ci*1.5, ph=((t+p*per/9)%per)/per, wx=rnd(c[0]+1+ph*c[3]+Math.sin(t*0.7+p)*2*ph), py=rnd(c[1]-1-ph*c[2]), px=wx-cam; if (px<0||px>=fw||py<0) continue;
    var col=night?(ph<0.5?P.m1:P.n1):(ph<0.5?P.s5:P.b4);
    for (var q=0;q<3;q++){ var qx=px+(q===1?1:0), qy=py+(q===2?1:0), r=REG[qy*W+wx+(q===1?1:0)]; if (r!==RG.sky&&r!==RG.view) continue; if (qx>=fw) continue; if (bayer(qx,qy)<(q===0?1-ph*0.8:0.65-ph*0.5)) fb.px(qx,qy,col); } } });
  dogDraw(fb,t,cam,night); }
// der Hund: liegt, steht auf, trottet zur anderen Seite, legt sich wieder hin
var DOGS={ trot:[[
 '................kk..',
 '...............kekk.',
 '..............keeeee',
 '.t............eeeeen',
 't...dddddddddeeeew..',
 't..deeeeeeeeeeeeew..',
 '.tdeeeeeeeeeeeeew...',
 '..eeeeeeeeeeeeew....',
 '..weeeewwwwweeww....',
 '..ee..e.....ee.e....',
 '.ee....e...ee...e...',
 '.e.....e...e....e...',
 'ee.....ee.ee....ee..'],[
 '................kk..',
 '...............kekk.',
 '..............keeeee',
 '..t...........eeeeen',
 '.t..dddddddddeeeew..',
 '.t.deeeeeeeeeeeeew..',
 '..deeeeeeeeeeeeew...',
 '..eeeeeeeeeeeeew....',
 '..weeeewwwwweeww....',
 '...ee.e....ee.e.....',
 '...e..e....e..e.....',
 '...e.e.....e.e......',
 '..ee.ee...ee.ee.....']],
 lie:[
 '....................',
 '....................',
 '....................',
 '....................',
 '....................',
 '....................',
 '...............kk...',
 '..............kekk..',
 '....dddddddddkeeee..',
 '..ddeeeeeeeeeeeeeeen',
 '.deeeeeeeeeeeeeeeee.',
 'tdeeeeeeeeeeeeeeeew.',
 'twwwwwwwwwwwwwwwwww.'] };
function dogState(t){ var cyc=34, ph=t%cyc;
  if (ph<12) return {x:DOG.x0,f:'R',pose:'lie'}; if (ph<17) return {x:lerp(DOG.x0,DOG.x1,(ph-12)/5),f:'R',pose:'trot',fr:Math.floor(t*6)%2};
  if (ph<29) return {x:DOG.x1,f:'L',pose:'lie'}; return {x:lerp(DOG.x1,DOG.x0,(ph-29)/5),f:'L',pose:'trot',fr:Math.floor(t*6)%2}; }
var DOGC={e:P.w3,d:P.w2,k:P.w1,t:P.w2,n:P.k1,w:P.e4};
function dogDraw(fb,t,cam,night){ var st=dogState(t), rows=st.pose==='lie'?DOGS.lie:DOGS.trot[st.fr], x0=rnd(st.x)-10-cam, y0=DOG.y-rows.length, fw=fb.w;
  if (x0<-20||x0>=fw) return; var tint=night?M.TINT.night:null, lamp=night?Math.max(0,1-Math.abs(st.x-LAMP.x)/110):0;
  for (var q=1;q<19;q++){ var sx=x0+q; if (sx<0||sx>=fw) continue; var kk=DOG.y*fw+sx; fb.d[kk]=M.DN[fb.d[kk]]; }      // Schatten
  for (var j=0;j<rows.length;j++) for (var i=0;i<20;i++){ var ch=rows[j][st.f==='R'?i:19-i]; if (ch==='.') continue; var c=DOGC[ch]; if (ch==='e' && j===rows.length-2) c=P.w2;
    if (st.pose==='lie' && j===9 && ch==='e' && Math.sin(t*1.8)>0.6) c=P.w4;                              // atmet
    var X=x0+i, Y=y0+j; if (X<0||X>=fw) continue; if (tint){ c=(lamp>0.3)?M.tintPx(DIMW,c,X+cam,Y):M.UP[M.tintPx(tint,c,X+cam,Y)]; } fb.d[Y*fw+X]=c; } }
// Geistersicht: in die Lehne der Bank geritzt und leuchtend „M + M 91“
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, x0=BENCH.x0+9-cam, y0=BENCH.by-24, a=0.5+0.5*Math.sin(t*1.3);
  if (x0>fb.w||x0+40<0) return;
  var tmp={px:function(x,y,c){ if (x<0||x>=fb.w) return; fb.px(x,y,c); }};
  for (var i=-3;i<35;i++){ var X=x0+i; if (X<0||X>=fb.w) continue; if (bayer(X,y0+6)<0.3+a*0.3) fb.px(X,y0+6,P.x2); if (bayer(X,y0-1)<0.18+a*0.2) fb.px(X,y0-1,P.x1); }
  M.microText(tmp,'M + M 91',x0,y0+1,a>0.55?P.x6:P.x5); }

// ---------------------------------------------------------------- Raum
function walk(x,y,S,GS){ if (x<=6||x>=634||y>=140) return false; if (y<backY(x)+3) return false;
  if (x>=DOG.x0-11&&x<=DOG.x1+11&&y<DOG.y+2) return false;                     // Hund an der Mauer
  if (x>=BENCH.x0-3&&x<=BENCH.x1+3&&y<BENCH.by+3) return false;                // Bank
  if (x>=CANNON.x0-4&&x<=CANNON.x1+4&&y<CANNON.by+3) return false;             // Kanonensockel
  if (x>=LAMP.x-6&&x<=LAMP.x+6&&y<LAMP.by+3) return false;                     // Laterne
  return true; }
M.defineArt('vratnik',{
  width:W, paint:paint, dynamic:dynamic, ghost:ghost, actorLut:actorLut, walk:walk, walkG:function(){ return false; },
  spots:{ exit:[0,92,10,52], alley:[GAP.x0,40,GAP.x1-GAP.x0,74], houses:[0,0,GAP.x0,114], mosque:[MOS.x0,0,MOS.x1-MOS.x0,112], ruza_house:[RZ.h0-4,RZ.rf-9,RZ.h1-RZ.h0+8,RZ.wt-RZ.rf+9],
    ruza_gate:[GATE.x0-7,GATE.top-10,GATE.x1-GATE.x0+14,64], garden:[RZ.x0,22,RZ.h0-RZ.x0-2,46], wall:[CW0,12,CW1-CW0+2,98], tabija:[PX0,86,W-PX0,22],
    bench:[BENCH.x0-2,BENCH.by-25,BENCH.x1-BENCH.x0+4,27], cannon:[CANNON.x0-3,CANNON.by-17,CANNON.x1-CANNON.x0+6,19], view:[PX0+12,0,W-PX0-12,86],
    lamp:[LAMP.x-7,LAMP.by-LAMP.h-6,15,LAMP.h+6], dog:[DOG.x0-12,DOG.y-14,DOG.x1-DOG.x0+24,16] },
  stands:{ exit:[10,124,'L'], alley:[164,116,'B'], houses:[52,121,'B'], mosque:[201,116,'B'], ruza_house:[284,115,'B'], ruza_gate:[254,115,'B'], garden:[262,115,'B'],
    wall:[340,118,'B'], tabija:[540,116,'B'], bench:[486,117,'B'], cannon:[568,128,'B'], view:[530,112,'B'], lamp:[432,118,'B'], dog:[328,118,'B'] },
  actorPos:{}, start:[60,124,'R'], entries:{ map:[14,124,'R'], kuca:[254,115,'F'] }
});
})(M);
