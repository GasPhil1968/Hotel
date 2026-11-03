/* ===== rooms/art/oldtown.js — Altstadt: der Peristil des Diokletianpalastes.
   Links die Arkaden des Peristils: Säulen aus rotem ägyptischem Granit mit korinthischen Kapitellen, die Bögen sitzen direkt
   auf den Säulen. Ein Joch ist zugemauert und bewohnt (Tür, Läden, Laterne), auf dem römischen Gebälk sitzt ein späteres
   Stockwerk mit Ziegeldach und Antenne. Im Gang hinter den Bögen Türen, Fenster und das Café, dessen rote Kissen gestapelt
   warten. Dahinter das Oktogon des Mausoleums (heute Kathedrale) mit Umgangsdach und Zeltdach, davor der romanische
   Glockenturm von Sv. Duje: Geschoss um Geschoss mehr Bögen, oben das achteckige Glockengeschoss und die Steinpyramide.
   Die schwarze Sphinx ohne Kopf auf ihrem Sockel. In der Mitte das Protiron auf seinen Stufen (Giebel mit Bogen, Balustraden),
   dahinter die Rotunde des Vestibüls mit ausgebrochenem Scheitel. Rechts ein Haus, das in die Palastmauer gewachsen ist,
   der Zeitungskiosk, eine Gasse mit Wäsche und Ninas Laden „Okvir“. Poliertes, ausgetretenes Kalksteinpflaster.
   c2 (Bura): harte Sonne von links oben, klare Schatten, tiefblauer Himmel. c3 (Dämmerung, Regen): kein Schlagschatten,
   nasses Pflaster spiegelt, Laternen brennen. epi (Morgengrauen): der Platz noch im Blau, nur die Turmspitze hat Sonne. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=480, H=144, GY=100;                              // Breite, Bildhöhe, Fußlinie der Fassaden
var LIT=R('s3 s4 s5 s6'), SHD=R('m2 m3 s2 s3'), OPEN=R('m1 m2 m2 s2'), DEEP=R('k2 m0 m1 m2'), MID=R('s2 s3 s4 s5');
var GRAN=R('t0 t1 t2 q2 t3 q3 q4');                    // roter Granit: Terrakotta und Lehm gemischt, damit er matt und steinern wirkt
var COLS=[6,36,66,96,126,156], SPR=50, RA=11.5, RO=16; // Säulenmitten, Kämpferlinie, Bogen innen/außen
var CORN=28, CAP=10, SH0=SPR+CAP, SH1=86, STY=91;      // Gesims, Kapitellhöhe, Schaft von/bis, Oberkante Stylobat
var TWR={x:198,w:26};                                  // Glockenturm (Mitte, Breite unten)
var PRO={x0:224,x1:336,top:88,cols:[236,259,301,324],apex:16,arc:[280,44,14]};   // Protiron mit Stufen
var KIO={x0:342,x1:364,base:106};                      // Zeitungskiosk
var ALY={x0:366,x1:404};                               // Gasse
var SHOP={x0:404,win:[411,66,28,34],door:[448,62,22,42],sign:[411,49,60,13]};
var OCT={cx:128,hw:30,eave:14,apex:1};                 // Mausoleum: Mitte, halbe Breite der Mauer, Traufe, Spitze
var SUN=[11,15];                                       // Lichtversatz: Sonne von links oben
var LINES=[[368,24,410,20],[372,42,408,38]];           // Wäscheleinen über der Gasse
var CLINE=[[70,58,92,58],[100,58,122,58]];             // Wäscheleinen zwischen den Säulen
var LAMPS=[[29,66],[339,47],[474,39]];                 // Laternen (Mitte des Glases)
var SUNNY=true, WET=false;                             // je Bild gesetzt: Sonne mit Schlagschatten, nasses Pflaster
function rnd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function lime(x,y,sh,sw,hh){ return tex.ashlar(x,y,sh===2?OPEN:(sh?SHD:LIT),sw||17,hh||8); }
function shadePx(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||2))); }
// Alterung: dunkle Krusten im Regenschatten unter Gesimsen, Laufspuren, Gras und Kapern in den Fugen
function crust(b,x0,x1,y0,depth,amt){ for (var x=x0;x<x1;x++){ var d=depth*(0.35+0.9*fbm(x*1.7,y0,5,x0)); for (var y=y0;y<y0+d;y++) if (bayer(x,y)<amt*(1-(y-y0)/d)) shadePx(b,x,y,1); } }
function streaks(b,x0,x1,y0,y1,sd,amt){ for (var x=x0;x<x1;x++){ var s=fbm(x*2.3,sd,4,sd); if (s<0.58) continue; var L=(s-0.58)*(y1-y0)*2.6; for (var y=y0;y<Math.min(y1,y0+L);y++) if (bayer(x,y)<amt*(1-(y-y0)/L)) shadePx(b,x,y,1); } }
function tuft(b,x,y,k){ b.px(x,y,P.g2); b.px(x,y-1,P.g3); if (k>0){ b.px(x-1,y,P.g3); b.px(x+1,y-1,P.g4); } if (k>1){ b.px(x+1,y-2,P.g4); b.px(x-1,y-2,P.g3); b.px(x+2,y-1,P.g3); } }
// Mauer späterer Jahrhunderte: kleinere, unruhige Steine, dazwischen Putzreste
var RUB=[R('s2 s3 s4 s5'),R('e2 e3 e4 s5'),R('s3 s4 s5 s6')];
function rubble(x,y,sd){ var row=Math.floor(y/4), fv=y-row*4, bw=5+hash(row,sd)*4, uu=x+hash(row,sd+1)*9, col=Math.floor(uu/bw), fu=uu-col*bw;
  var plaster=fbm(x,y*1.2,8,sd)>0.6; if (plaster) return M.rampAt(R('s3 s4 s5 s5'),0.55+(hash(x>>1,y)-0.5)*0.3,x,y);
  if (fv<1||fu<1) return P.s2; var r=RUB[Math.floor(hash(col+sd,row)*RUB.length)], t=hash(col*7,row*3+sd), c=r[t<0.3?1:2]; if (fv===1&&fu>1) c=r[3]; if (fu>=bw-1) c=r[0]; return c; }

// ---------------------------------------------------------------- Himmel (eigener Puffer, wird zuletzt dahinter gelegt)
function paintSky(tod,weather){ var s=new M.Buf(W,H,P.k0), x, y;
  if (weather==='rain'){ M.scn.sky(s,0,0,W,GY,tod,'rain',29); return s; }
  if (tod==='day'){ var rp=R('b0 b1 b2 b3 b4');                                  // Bura: tiefblau, klar, ein paar Federwolken
    for (y=0;y<GY;y++) for (x=0;x<W;x++) s.px(x,y,M.rampAt(rp,0.06+y/115,x,y));
    for (var i=0;i<6;i++){ var cx=20+i*83+hash(i,2)*30, cy=5+hash(i,3)*14, L=26+hash(i,4)*36; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+Math.sin(k*0.09+i)*1.5+k*0.04); var a=0.55-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b3); if (bayer(xx,yy)<a-0.3) s.px(xx,yy,P.b4); } }
    return s; }
  M.sky(s,0,0,W,GY,tod,23); if (tod==='night') M.moon(s,424,13,3);
  return s; }

// ---------------------------------------------------------------- Pflaster: große, polierte Kalksteinplatten in Perspektive
var HZ=36, VPX=240, JNT=new Uint8Array(W*H);
function paving(b){ JNT.fill(0);
  for (var y=GY;y<H;y++){ var d=y-HZ, rz=1500/d, row=Math.floor(rz), fy=rz-row, dy=1500/(d*d);
    for (var x=0;x<W;x++){ var X=(x-VPX)/d*3.4+(row%2)*0.5+hash(row,7)*0.3, col=Math.floor(X), fx=X-col, dx=3.4/d;
      var t=hash(col,row), c=t<0.22?P.s4:(t<0.84?P.s5:(t<0.95?P.s6:P.s4)), jn=false;
      var wear=fbm(x*0.6,y*2,12,row*3+col);                                    // ausgetretene, glatt polierte Stellen
      if (wear>0.68 && c!==P.s6) c=M.UP[c]; else if (wear<0.24) c=M.DN[c];
      if (fx<dx*1.05){ c=P.s3; jn=true; }                                       // Stoßfuge
      if (fy<dy*1.1){ c=(fy<dy*0.5)?P.s2:P.s3; jn=true; }                       // Lagerfuge
      else if (fy<dy*2.2 && fx>dx*2 && !jn && c!==P.s6) c=M.UP[c];              // vordere Plattenkante glänzt
      if (hash(x,y)<0.02) c=M.DN[c];
      if (WET) c=M.DN[M.DN[c]];
      if (jn) JNT[y*W+x]=1;
      b.px(x,y,c); } } }

// ---------------------------------------------------------------- Haus auf dem Gebälk (später auf den Säulengang gebaut)
function topHouse(b){ var x, y, x0=0, x1=44, top=9;
  for (y=top;y<CORN;y++) for (x=x0;x<x1+4;x++){ var c;
    if (x>=x1) c=tex.ashlar(x*2.5,y,SHD,7,4);                                   // Seitenwand im Schatten
    else { c=(fbm(x,y*1.3,9,4)>0.64)?tex.ashlar(x,y,LIT,8,4):M.rampAt(R('s3 s4 s5 e4'),0.6+(fbm(x,y,7,9)-0.5)*0.6+(hash(x,y)-0.5)*0.15,x,y); if (x===x1-1) c=P.s3; }
    b.px(x,y,c); }
  for (y=top+2;y<CORN;y++) if (bayer(x1,y)<0.5) shadePx(b,x1,y,1);
  // Traufe: Ziegelköpfe, dahinter die zurückweichende Dachfläche
  for (x=x0;x<x1+5;x++){ b.px(x,top-5,((x+1)%3)?P.t2:P.t1); b.px(x,top-4,(x%3)?P.t3:P.t1); b.px(x,top-3,(x%3===1)?P.t4:P.t3); b.px(x,top-2,(x%3===0)?P.t2:P.t3); b.px(x,top-1,P.t1); shadePx(b,x,top,2); shadePx(b,x,top+1,1); }
  for (x=x0;x<x1+5;x+=3){ b.px(x,top-1,P.t4); b.px(x+1,top-1,P.t2); }
  // Kamin und Fernsehantenne
  b.rect(33,0,4,top-4,P.s4); b.vl(36,0,top-5,P.s2); b.hl(32,37,0,P.t2); b.px(33,1,P.s5);
  b.vl(13,0,top-5,P.m1); b.hl(10,16,1,P.m1); b.hl(11,15,2,P.m2); b.hl(9,17,3,P.m1); b.px(14,0,P.m2);
  // zwei Fenster: links Läden zu, rechts offen mit Geranien
  M.prop.window(b,6,13,7,9,{shut:true,col:R('g1 g2 g3 g4'),frame:R('s2 s3 s4 s6')});
  M.prop.window(b,27,13,7,9,{open:true,fill:function(xx,yy){ return yy<16?P.k1:P.k2; },col:R('g1 g2 g3 g4'),frame:R('s2 s3 s4 s6')});
  b.rect(26,21,9,2,P.t2); b.hl(26,34,21,P.t3); [[27,20,P.r3],[29,19,P.r4],[31,20,P.r3],[33,19,P.d4]].forEach(function(f){ b.px(f[0],f[1],f[2]); b.px(f[0]+1,f[1]+1,P.g3); b.px(f[0]-1,f[1]+1,P.g2); });
  for (y=13;y<23;y++){ shadePx(b,14,y,1); shadePx(b,38,y,1); } }

// ---------------------------------------------------------------- Mausoleum (Kathedrale): achteckiger Tambour, flaches Zeltdach
function mausoleum(b){ var cx=OCT.cx, hw=OCT.hw, x, y, fw=hw*0.414, xl=rnd(cx-hw), xr=rnd(cx+hw), fl=rnd(cx-fw), fr=rnd(cx+fw);
  // Mauer: drei Seiten des Achtecks, links im Licht, vorn halb, rechts im Schatten; an den Ecken Lisenen
  for (y=OCT.eave+1;y<=CORN;y++) for (x=xl;x<=xr;x++){ var f=x<fl?0:(x>fr?2:1), u=f===1?x:(f===0?(x-xl)*2.3:(x-fr)*2.3), c=tex.ashlar(u,y,f===0?LIT:(f===1?R('s2 s3 s4 s4'):R('m1 m2 m3 s2')),9,4);
      if (x===fl||x===fl+1) c=(x===fl)?P.s6:P.s5; else if (x===fr) c=P.s4; else if (x===fr+1) c=P.s2; else if (x===xl) c=P.s6;
      b.px(x,y,c); }
  // Rundbogenfenster, Blendbögen unter dem Gesims
  [[rnd(cx)-2,4,5],[xl+5,2,4],[fl-6,2,4],[fr+4,2,4],[xr-6,2,4]].forEach(function(w,i){ var x0=w[0], ww=w[1], hh=7, y0=OCT.eave+4; for (y=y0;y<y0+hh;y++) for (x=x0;x<x0+ww;x++){ if (y===y0 && ww>2 && (x===x0||x===x0+ww-1)) continue; b.px(x,y,(x===x0||y===y0)?P.k1:(i>2?P.k1:P.k2)); } b.hl(x0-1,x0+ww,y0+hh,i>2?P.s2:P.s5); });
  for (x=xl+1;x<xr;x++){ var ff=x<fl?0:(x>fr?2:1), per=ff===1?5:3; if (((x-xl)%per)===0) b.px(x,OCT.eave+2,ff===2?P.m2:P.s3); }
  b.hl(xl-2,xr+2,OCT.eave,P.s6); b.hl(xl-1,xr+1,OCT.eave+1,P.s3); b.hl(fr+1,xr+2,OCT.eave,P.s4);
  // Zeltdach: achteckige Pyramide, die Grate laufen von den vier sichtbaren Ecken zur Spitze
  for (y=OCT.apex;y<OCT.eave;y++){ var tt=(y-OCT.apex+1)/(OCT.eave-OCT.apex), hh2=(hw+2)*tt, fh=hh2*0.414; for (x=rnd(cx-hh2);x<=rnd(cx+hh2);x++){ var dx=x-cx, c3;
      if (dx<-fh) c3=((x+y)%2)?P.t4:P.t5; else if (dx<=fh) c3=(x%2)?P.t3:P.t2; else c3=((x-y)%2)?P.t1:P.t0;
      if (Math.abs(dx+fh)<0.9) c3=P.l0; else if (Math.abs(dx-fh)<0.9) c3=P.t4;
      if (dx<-hh2+1) c3=P.t5; else if (dx>hh2-1) c3=P.t1;
      b.px(x,y,c3); } }
  b.px(rnd(cx),OCT.apex-1,P.s5); b.px(rnd(cx),OCT.apex-2,P.s4); b.px(rnd(cx)+1,OCT.apex-1,P.s2);
  crust(b,xl,xr+1,OCT.eave+2,3,0.5);
  for (x=xl-6;x<=xr+6;x++){ var fa=x<fl?0:(x>fr?2:1); b.px(x,CORN-2,fa===0?P.t4:(fa===1?P.t3:P.t2)); b.px(x,CORN-1,(x%2)?(fa===2?P.t1:P.t2):(fa===2?P.t2:P.t3)); } }

// ---------------------------------------------------------------- Säulengang
function inOpening(x,y,i){ var a=COLS[i], z=COLS[i+1], cx=(a+z)/2; if (x<a+4||x>z-4) return false; if (y>=SPR) return y<STY; var dx=x-cx, dy=y-SPR; return dx*dx+dy*dy<RA*RA; }
function bayOf(x,y){ for (var i=0;i<COLS.length-1;i++) if (inOpening(x,y,i)) return i; return -1; }
function sunAt(x,y,i){ return SUNNY && inOpening(x-SUN[0],y-SUN[1],i); }
function granite(x,y,cx){ var u=(x-cx+3.5)/7, v=0.86-u*0.72; if (u>0.8) v-=0.1; if (Math.abs(u-0.3)<0.08) v+=0.2;   // Glanz der Politur
  v+=(fbm(x*2,y*0.5,3,cx)-0.5)*0.22; if (y>SH1-9) v-=(y-(SH1-9))/9*0.16; if (y<SH0+3) v-=0.14;
  if (!SUNNY) v=0.45+(v-0.45)*0.6;
  var c=M.rampAt(GRAN,v,x,y), h=hash(x*3+1,y*5+2); if (h<0.06) c=P.t0; else if (h>0.965) c=(u<0.5)?P.s4:P.m3; return c; }
// korinthisches Kapitell, 10 px hoch, oben 15 px breit: Abakus mit Blüte, Voluten, zwei Reihen Akanthus, Halsring
function capital(b,cx,y0,L){ var HW=[7,7,6,6,6,6,5,5,5,4];
  for (var j=0;j<CAP;j++){ var hw=HW[j]; for (var dx=-hw;dx<=hw;dx++){ var u=(dx+hw)/(2*hw), s=u<0.3?3:(u<0.6?2:(u<0.84?1:0)), ad=Math.abs(dx), c, p;
      if (j===0) c=(ad===hw)?L[2]:L[Math.min(3,s+1)];
      else if (j===1){ c=L[Math.max(0,s-1)]; if (dx===0) c=L[3]; if (ad===1) c=L[2]; }
      else if (j<=3){ if (ad>=6) c=(j===2)?(dx<0?L[3]:L[1]):(dx<0?L[1]:L[0]);
        else if (ad===5) c=(j===2)?(dx<0?L[1]:L[0]):L[s];
        else { p=((dx%3)+3)%3; c=p===0?L[Math.max(0,s-1)]:(p===1?L[Math.min(3,s+(j===2?1:0))]:L[s]); } }
      else if (j<=6){ p=(dx+30)%3; c=p===0?L[Math.max(0,s-2)]:(p===1?L[Math.min(3,s+(j===4?1:0))]:L[Math.max(0,s-1)]); if (j===4&&ad===hw) c=dx<0?L[3]:L[1]; }
      else if (j<=8){ p=(dx+31)%3; c=p===0?L[Math.max(0,s-2)]:(p===1?L[Math.min(3,s+(j===7?1:0))]:L[Math.max(0,s-1)]); }
      else c=(u<0.6)?L[2]:L[1];
      b.px(cx+dx,y0+j,c); } } }
function colBase(b,cx,y0){ b.hl(cx-4,cx+4,y0,P.s5); b.px(cx-4,y0,P.s6); b.px(cx+4,y0,P.s3); b.hl(cx-3,cx+3,y0+1,P.s2);
  b.hl(cx-5,cx+5,y0+2,P.s6); b.px(cx+5,y0+2,P.s4); b.hl(cx-5,cx+5,y0+3,P.s4); b.px(cx+5,y0+3,P.s3); b.hl(cx-5,cx+5,y0+4,P.s5); b.px(cx+5,y0+4,P.s3); }
function cushion(b,x,yt,w,dark){ w=w||7; var C=dark?[P.r0,P.r1,P.r2]:[P.r1,P.r2,P.r3]; b.hl(x+1,x+w-2,yt-2,C[2]); b.hl(x,x+w-1,yt-1,C[1]); b.px(x,yt-1,C[2]); b.px(x+w-1,yt-1,C[0]); b.hl(x,x+w-1,yt,C[0]); if (!dark) b.px(x+1,yt-2,P.r4); }
// hinter den Bögen: Rückwand des Gangs mit Türen, Fenster, Café
function bayDetails(b){ var x, y;
  function sh(x,y){ var o=bayOf(x,y); return o>=0 && sunAt(x,y,o); }
  // Joch 1: Rundbogentür, kleines vergittertes Fenster
  for (y=64;y<86;y++) for (x=43;x<53;x++){ var dx=x-47.5, dy=y-70, out=dy>=0||dx*dx+dy*dy<=28, inn=x>=44&&x<=51&&(dy>=0||dx*dx+dy*dy<=16.5); if (!out) continue;
    b.px(x,y,inn?((x===44||y<68)?P.k0:P.k1):(x<48?(sh(x,y)?P.s4:P.s2):(sh(x,y)?P.s5:P.m2))); }
  b.rect(55,60,5,6,P.k1); b.vl(56,60,65,P.m1); b.vl(58,60,65,P.m1); b.hl(54,60,66,sh(57,66)?P.s5:P.s2);
  // Joch 2: Fenster mit grünen Läden und Steinbank davor
  for (y=62;y<74;y++) for (x=76;x<87;x++){ var lt=sh(x,y), s3=(y-62)%3, c=s3===0?(lt?P.g3:P.g1):(lt?P.g4:P.g2); if (x===76||x===86||x===81) c=lt?P.g2:P.g0; b.px(x,y,c); }
  b.hl(75,87,74,sh(80,74)?P.s6:P.s3); b.hl(75,87,75,P.m1);
  // Joch 3: Holztür mit Oberlicht, ein Topf mit Rosmarin
  for (y=65;y<86;y++) for (x=106;x<115;x++){ var c2=(y<69)?P.k1:(((x-106)%3===0)?P.w0:P.w1); if (y===69) c2=P.w0; if (sh(x,y) && y>=69) c2=M.UP[M.UP[c2]]; b.px(x,y,c2); }
  b.vl(105,65,85,P.s2); b.vl(115,65,85,sh(115,70)?P.s5:P.m2); b.hl(105,115,64,P.s2); b.px(108,77,P.y2);
  b.rect(117,81,5,5,P.t2); b.hl(116,122,80,P.t3); for (var k=0;k<14;k++){ var px=117+rnd(hash(k,4)*4), py=79-rnd(hash(k,5)*hash(k,6)*7); b.px(px,py,hash(k,7)<0.5?P.g2:P.c2); }
  // Joch 4: das Café (Glastür mit Sprossen), Tafel auf der Staffelei, die roten Kissen gestapelt, weil die Bura sie sonst holt
  for (y=63;y<86;y++) for (x=136;x<148;x++){ var c3=P.k2; if (x===136||x===147||y===63||x===141||x===142) c3=P.w1; if (y===70||y===76) c3=P.w1; if (y>=79) c3=((x-136)%4===0)?P.w0:P.w1; if (c3===P.k2 && ((x-y+300)%9===0)) c3=P.m1; b.px(x,y,c3); }
  b.hl(135,148,62,P.w2); b.hl(135,148,86,P.s3);
  b.rect(149,77,5,7,P.k2); b.hl(149,153,76,P.w2); b.vl(149,77,85,P.w1); b.vl(153,77,85,P.w1); b.px(150,85,P.w1); b.px(152,85,P.w1); b.hl(150,152,79,P.s4); b.hl(150,151,81,P.s3); b.px(152,82,P.y3);
  for (k=0;k<5;k++){ var yy=85-k*2; b.hl(129,135,yy,P.r1); b.hl(129,135,yy-1,P.r2); b.px(129,yy-1,P.r3); b.px(135,yy,P.r0); } }
// Joch 0: zugemauert, ein Haus ist in den Bogen gewachsen
function infill(b){ var x, y;
  for (y=SPR-12;y<STY;y++) for (x=8;x<36;x++){ if (!inOpening(x,y,0)) continue; var c=rubble(x,y,5);
    if (!inOpening(x-2,y-3,0)) c=SUNNY?M.DN[M.DN[c]]:M.DN[c];                    // die Mauer sitzt etwas zurück
    b.px(x,y,c); }
  M.prop.window(b,17,45,7,8,{shut:true,col:R('g1 g2 g3 g4'),frame:R('s2 s3 s4 s6')});
  // Haustür mit Steinrahmen und Schwelle
  for (y=67;y<STY;y++) for (x=14;x<27;x++){ var c2, fx=x-14;
    if (y<69) c2=(y===67)?P.s6:P.s4; else if (fx<2) c2=fx?P.s4:P.s6; else if (fx>10) c2=(fx===11)?P.s3:P.s2; else c2=((fx-2)%3===0)?P.w1:((fx%3===1)?P.w3:P.w2);
    if (y>=89 && fx>=2 && fx<=10) c2=P.s5; b.px(x,y,c2); }
  b.px(23,79,P.y2); b.px(23,80,P.y1); b.hl(17,23,73,P.w1); b.hl(17,23,83,P.w1);
  b.rect(27,73,5,6,P.b1); b.hl(27,31,73,P.b2); b.hl(27,31,78,P.b0); M.microText(b,'3',28,74,P.s6);
  can(b,10,85,4,5); }
function can(b,x,y,w,h){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) b.px(i,j,(i===x)?P.m4:((i===x+w-1)?P.m1:P.m3)); b.hl(x,x+w-1,y,P.m2);
  for (var k=0;k<10;k++) b.px(x+rnd(hash(k,x)*(w-1)),y-1-rnd(hash(k,y)*3),hash(k,3)<0.5?P.g4:P.g3); }
function lantern(b,cx,cy,mount){ // Wandlaterne aus Eisen; mount: -1 Arm nach links, +1 nach rechts
  var ax=cx+mount*4; b.vl(ax,cy-6,cy-3,P.k1); b.line(ax,cy-5,cx,cy-6,P.k1); b.px(cx+mount*2,cy-7,P.k1);
  b.hl(cx-2,cx+2,cy-4,P.k1); b.hl(cx-1,cx+1,cy-5,P.k1);
  for (var y=cy-3;y<=cy+3;y++) for (var x=cx-2;x<=cx+2;x++){ var c=(x===cx-2||x===cx+2)?P.k1:((x===cx-1)?P.m3:(y%2?P.m2:P.m1)); b.px(x,y,c); }
  b.hl(cx-2,cx+2,cy+4,P.k1); b.px(cx,cy+5,P.k1); }
function litLantern(b,cx,cy){ for (var y=cy-3;y<=cy+3;y++) for (var x=cx-1;x<=cx+1;x++) b.px(x,y,(x===cx&&y<cy+2)?P.l1:(y<cy-1?P.y5:P.l0)); }
function colonnade(b){ var x, y, i;
  for (y=CORN;y<STY;y++) for (x=0;x<166;x++) b.px(x,y,lime(x,y,0,15,7));
  for (y=CORN;y<STY;y++){ b.px(165,y,P.s3); b.px(164,y,(y%7)?P.s4:P.s3); b.px(160,y,P.s6); }   // Endpfeiler
  // Öffnungen: Gang im Schatten, Sonnenflecken durch die Bögen auf Rückwand und Boden
  for (y=SPR-12;y<STY;y++) for (x=0;x<166;x++){ var o=bayOf(x,y); if (o<1) continue;
    var lit=sunAt(x,y,o), c;
    if (y>=86) c=lit?(y===86?P.s4:P.s5):(y===86?P.m1:P.m2);
    else c=tex.ashlar(x*1.15+o*9,y,lit?R('s2 s4 s4 s5'):OPEN,12,6);
    if (!lit && y<SPR-2) c=M.DN[c];
    b.px(x,y,c); }
  bayDetails(b); infill(b); lantern(b,LAMPS[0][0],LAMPS[0][1],-1);
  // Bogenringe aus Keilsteinen mit profilierter Stirn
  for (i=0;i<COLS.length-1;i++){ var cx=(COLS[i]+COLS[i+1])/2;
    for (y=SPR-RO;y<=SPR;y++) for (x=rnd(cx-RO);x<=rnd(cx+RO);x++){ var dx=x-cx, dy=y-SPR, rr=Math.sqrt(dx*dx+dy*dy); if (rr<RA||rr>=RO) continue;
      var ang=Math.atan2(-dy,dx), q=ang/(Math.PI/11), c2;
      if (rr<RA+1) c2=(dx>0)?P.s4:P.s2; else if (rr<RA+2.2) c2=P.s5; else if (rr<RA+3) c2=P.s3; else if (rr<RO-1) c2=(ang>Math.PI*0.45)?P.s6:P.s5; else c2=(ang>Math.PI*0.5)?P.s6:P.s3;
      if (rr>=RA+1 && rr<RO-1 && Math.abs(q-Math.round(q))<0.09) c2=P.s3;
      b.px(x,y,c2); }
    for (y=SPR-RO-1;y<=SPR;y++) for (x=rnd(cx);x<=rnd(cx+RO+1);x++){ var ex=x-cx, ey=y-SPR, er=Math.sqrt(ex*ex+ey*ey); if (er>=RO && er<RO+1.2 && bayer(x,y)<0.7) shadePx(b,x,y,1); } }
  // Gesims mit Zahnschnitt, darunter Schatten und die schwarze Kruste der Jahrhunderte
  for (x=0;x<166;x++){ b.px(x,CORN,P.s6); b.px(x,CORN+1,(x%2)?P.s5:P.s6); b.px(x,CORN+2,P.s4); b.px(x,CORN+3,(x%3===0)?P.s2:P.s5); b.px(x,CORN+4,(x%3===0)?P.s3:P.s4); b.px(x,CORN+5,P.s5);
    if (hash(x>>2,7)<0.09){ b.px(x,CORN,P.s4); b.px(x,CORN+1,P.s3); } }
  for (x=0;x<166;x++) for (y=CORN+6;y<CORN+9;y++) if (bayer(x,y)<(CORN+9-y)/3.4) shadePx(b,x,y,SUNNY?2:1);
  crust(b,0,166,CORN+6,7,0.5); streaks(b,0,166,CORN+8,SPR-1,11,0.55);
  [[9,CORN,1],[52,CORN,0],[87,CORN,2],[131,CORN,0],[150,CORN,1]].forEach(function(t){ tuft(b,t[0],t[1],t[2]); });
  // Säulen: Schaft aus Granit, Kapitell, attische Basis
  COLS.forEach(function(cx){ for (y=SH0;y<SH1;y++) for (x=cx-3;x<=cx+3;x++) b.px(x,y,granite(x,y,cx)); capital(b,cx,SPR,LIT); colBase(b,cx,SH1); });
  // Stylobat: drei Stufen, auf denen man sitzt
  for (y=STY;y<GY;y++){ var r=y-STY, st=Math.floor(r/3), tr=(r%3===0);
    for (x=0;x<PRO.x0;x++){ var c3=tr?(st===0?P.s6:P.s5):((r%3===1)?P.s5:P.s4); if (st===2 && !tr) c3=M.DN[c3];
      if (!tr && ((x+st*7)%23)===0) c3=P.s3; if (tr && hash(x>>1,y)<0.2) c3=P.s5; if (hash(x>>3,y)<0.08) c3=M.DN[c3]; if (WET && !tr) c3=M.DN[c3];
      b.px(x,y,c3); } }
  if (SUNNY) COLS.forEach(function(cx){ for (y=STY;y<GY;y++){ var sx=cx+4+(y-STY)*0.7; for (x=rnd(sx);x<rnd(sx+7);x++) shadePx(b,x,y,2); } });
  if (!WET){ cushion(b,58,94); cushion(b,99,97,6); cushion(b,141,94,6); }
  CLINE.forEach(function(l){ for (x=l[0];x<=l[2];x++) b.px(x,l[1]+Math.round(Math.sin((x-l[0])/(l[2]-l[0])*Math.PI)*2),P.k2); }); }

// ---------------------------------------------------------------- Glockenturm von Sv. Duje: romanisch, nach oben immer offener
var TST=[[70,96,23,4],[58,70,22,4],[47,58,21,4],[37,47,20,4],[27,37,19,3]];   // [oben, unten, Breite, Seitenfläche]
function bell(b,cx,y){ b.hl(cx-1,cx+1,y,P.y1); b.rect(cx-2,y+1,5,2,P.y2); b.hl(cx-3,cx+3,y+3,P.y1); b.px(cx-1,y+1,P.y4); b.px(cx,y+4,P.y0); }
function opening(b,x0,y0,w,h,inner){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ if (y===y0 && w>2 && (x===x0||x===x0+w-1)) continue;
    var c=inner||P.n0; if (x===x0||y<y0+2) c=P.k1; if (x===x0+w-1 && w>3 && y>y0+1) c=P.m1; b.px(x,y,c); } }
function colonnette(b,x,y0,y1){ b.vl(x,y0+1,y1,P.s5); b.px(x,y0,P.s6); b.px(x,y1,P.s4); }
function tower(b){ var cx=TWR.x, x, y, top={};
  if (SUNNY) for (y=62;y<94;y++) for (x=cx+12;x<cx+23-(y-62)*0.1;x++) shadePx(b,x,y,1);   // Schlagschatten auf die Mauer rechts
  TST.forEach(function(s,k){ var y0=s[0], y1=s[1], w=s[2], xl=cx-(w>>1), xr=xl+w-1, xf=xr-s[3], mid=Math.floor((xl+xf)/2);
    for (y=y0;y<y1;y++) for (x=xl;x<=xr;x++){ var sh=x>xf, c=tex.ashlar((x-xl)*1.3+k*7,y,sh?SHD:LIT,8,4);
      if (x===xl) c=P.s6; else if (x===xf) c=P.s4; else if (x===xf+1) c=P.s3; else if (x===xr) c=P.m2; b.px(x,y,c); }
    // Gesims, darunter ein Fries aus kleinen Blendbögen
    b.hl(xl-1,xf,y0,P.s6); b.hl(xf+1,xr+1,y0,P.s4); b.hl(xl-1,xf,y0+1,P.s4); b.hl(xf+1,xr+1,y0+1,P.m2);
    for (x=xl;x<=xr;x++){ shadePx(b,x,y0+2,1); if (x<xf && x>xl){ if ((x-xl)%3===0) shadePx(b,x,y0+3,1); else if (bayer(x,y0+3)<0.3) shadePx(b,x,y0+3,1); } }
    if (k===0){ // Durchgang zur Kathedrale: Rundbogen, drinnen die Treppe und die geschnitzte Holztür
      for (y=76;y<96;y++) for (x=mid-6;x<=mid+7;x++){ var dx=x-mid-0.5, dy=y-83, rr2=dx*dx+(dy<0?dy*dy:0); if (rr2>42.25) continue; var c2=P.k1;
        if (rr2>25) c2=(dx<0)?P.s6:P.s3;
        else { if (y>=86){ var st=(y-86)%3; c2=st===0?(SUNNY?P.s3:P.m2):(st===1?P.m1:P.k2); }
          if (x>=mid-2 && x<=mid+3 && y>=79 && y<86) c2=((x-mid+2)%3===0||(y-79)%2===0)?P.w0:P.w1;
          if (x===mid-4 && y<86) c2=P.k0; }
        b.px(x,y,c2); }
      opening(b,xl+2,73,2,5); opening(b,xf-3,73,2,5); }
    else if (k===1){ b.hl(mid-4,mid+4,60,P.s6); b.hl(mid-3,mid+3,61,P.s4); opening(b,mid-3,62,3,7); opening(b,mid+1,62,3,7); colonnette(b,mid,62,68); b.hl(mid-4,mid+4,69,P.s6); }
    else if (k===2){ [mid-7,mid+1].forEach(function(bx){ opening(b,bx,50,3,7); opening(b,bx+4,50,3,7); colonnette(b,bx+3,50,56); b.hl(bx,bx+6,57,P.s6); }); }
    else if (k===3){ for (var q=0;q<3;q++) opening(b,mid-6+q*5,39,4,8,P.k2); colonnette(b,mid-2,39,46); colonnette(b,mid+3,39,46); b.hl(mid-6,mid+7,47,P.s6); }
    else { for (var q2=0;q2<3;q2++){ opening(b,mid-6+q2*5,29,4,8,P.k2); bell(b,mid-5+q2*5,31); } colonnette(b,mid-2,29,36); colonnette(b,mid+3,29,36); b.hl(mid-6,mid+7,37,P.s6); top={xl:xl,xf:xf,mid:mid}; } });
  // achteckiges Glockengeschoss mit Eckfialen
  var oc=top.mid+0.5, ohw=7;
  for (y=17;y<27;y++) for (x=rnd(oc-ohw);x<=rnd(oc+ohw);x++){ var dxo=x-oc, f=dxo< -2.9?0:(dxo>2.9?2:1), c4=tex.ashlar(x*1.6,y,f===0?LIT:(f===1?MID:SHD),6,4); if (Math.abs(Math.abs(dxo)-2.9)<0.6) c4=(dxo<0)?P.s6:P.s3; b.px(x,y,c4); }
  opening(b,rnd(oc)-2,19,4,7,P.k2); bell(b,rnd(oc)-1,21); opening(b,rnd(oc-6),20,2,6); opening(b,rnd(oc)+4,20,2,6,P.k1);
  b.hl(rnd(oc-ohw)-1,rnd(oc+ohw)+1,17,P.s6); b.hl(rnd(oc-ohw),rnd(oc+ohw),18,P.s4); b.hl(rnd(oc-ohw),rnd(oc+ohw),26,P.s3);
  [[top.xl,P.s6,P.s5],[top.xf-1,P.s4,P.s3]].forEach(function(f){ b.px(f[0],21,f[1]); b.vl(f[0],22,26,f[1]); b.vl(f[0]+1,22,26,f[2]); b.px(f[0]+1,23,f[1]); });
  // steinerne Pyramide mit Kreuz
  for (y=2;y<17;y++){ var hs=Math.max(0.6,(y-1.5)*ohw/15), fr=hs*0.414; for (x=rnd(oc-hs);x<=rnd(oc+hs);x++){ var d=x-oc, c5;
      if (d< -fr) c5=(d<-hs+0.9)?P.s6:P.s5; else if (d<=fr) c5=(y%3===0)?P.s3:P.s4; else c5=(d>hs-0.9)?P.m2:P.s3;
      if (y%3===0 && d< -fr) c5=P.s4; b.px(x,y,c5); } }
  b.vl(rnd(oc),0,2,P.k2); b.hl(rnd(oc)-1,rnd(oc)+1,1,P.k2); }

// ---------------------------------------------------------------- Mauer der Kathedrale hinter Sphinx und Turm (Säulenkranz im Schatten)
function precinct(b){ var x, y;
  for (y=60;y<STY;y++) for (x=160;x<226;x++){ var c=lime(x,y,x<186?0:2,13,6); if (y>=66 && x>=211 && x<224) c=(y<69)?P.m0:DEEP[1+((x+y)%2)]; b.px(x,y,c); }
  [[215,4]].forEach(function(c){ for (y=66;y<STY;y++) for (x=c[0];x<c[0]+c[1];x++) b.px(x,y,(x===c[0])?P.m3:(x===c[0]+c[1]-1?P.m0:P.m2)); b.hl(c[0]-1,c[0]+c[1],66,P.s3); });
  b.hl(160,225,60,P.s5); b.hl(160,225,61,P.s3); b.hl(160,225,65,P.s3); b.hl(160,225,64,P.s4); crust(b,160,226,62,3,0.5); }

// ---------------------------------------------------------------- Sphinx aus schwarzem Granit, ohne Kopf, auf einem Kalksteinsockel (Blick nach rechts)
var SPHX=[                      // Umriss: 1 Körper, 3 Bruchkante am Hals, 4 Nemes-Tuch, 5 Vorderpranken, 2 eigene Granitplatte
"..............3.33........",
".............333333.......",
".............11111144.....",
".............11111144.....",
".............11111144.....",
"....1111.....11111144.....",
"..1111111111111111144.....",
".111111111111111111111....",
".111111111111111111111....",
".1111111111111111111155555",
".1111111111111111111155555",
".1111111111111111111155555",
"22222222222222222222222222",
"22222222222222222222222222"];
function sphinxIn(x,y){ if (y<0||y>=SPHX.length||x<0||x>=26) return 0; var ch=SPHX[y][x]; return ch==='.'?0:+ch; }
function sphinx(b,x0,by){ var x, y, px1=x0+26, pt=by-10, ox=x0, oy=pt-SPHX.length;
  if (SUNNY) for (y=pt;y<by;y++) for (x=px1;x<px1+7-(by-y)*0.3;x++) shadePx(b,x,y,2);
  for (y=pt;y<by;y++) for (x=x0;x<px1;x++){ var c=(x>px1-4)?P.s3:P.s5; if (y===by-2) c=P.s4; if (y===by-1) c=P.s3; if (x===x0) c=P.s6; if (hash(x>>2,y)<0.08) c=M.DN[c]; if (WET) c=M.DN[c]; b.px(x,y,c); }
  b.hl(x0-1,px1,pt,P.s6); b.hl(x0-1,px1,pt+1,P.s4); b.px(px1,pt+1,P.s2);
  for (x=x0+4;x<px1-4;x+=3) b.px(x,pt+5,P.s3);                                           // verwitterte Inschrift
  for (y=0;y<SPHX.length;y++) for (x=0;x<26;x++){ var m=sphinxIn(x,y); if (!m) continue;
    var top=!sphinxIn(x,y-1), left=!sphinxIn(x-1,y), bot=!sphinxIn(x,y+1), rgt=!sphinxIn(x+1,y), c2=(y<=6)?((bayer(x,y)<0.5)?P.m1:P.m0):(y<=8?P.m0:P.k2);
    if (m===2){ c2=(y===12)?(x<20?P.m2:P.m1):((x%3===1)?P.m0:P.k2); if (x>22) c2=M.DN[c2]; }
    else { if (top&&left) c2=P.m4; else if (top) c2=(x<13)?P.m3:P.m2; else if (left) c2=P.m2; if (rgt||(bot&&y<11)) c2=P.k1;
      if (m===3) c2=top?P.m3:((x+y)%2?P.m2:P.m3);
      if (m===4) c2=(y%2)?P.m2:P.k1;
      if (m===5) c2=(y===9)?P.m2:(((x===23||x===25)&&y===11)?P.k0:P.k2); }
    b.px(ox+x,oy+y,c2); }
  [[2,11],[3,10],[4,9],[5,8],[6,8],[7,8],[8,9],[9,10],[10,11]].forEach(function(p){ b.px(ox+p[0],oy+p[1],P.k1); });   // Hinterlauf
  [[4,11],[5,11],[6,11],[7,11],[8,11]].forEach(function(p){ b.px(ox+p[0],oy+p[1],P.m1); });                         // Schwanz am Lauf entlang
  for (x=16;x<=21;x++) b.px(ox+x,oy+8,P.k1);                                                                          // Schatten unter der Brust
  b.px(ox+5,oy+6,P.m4); b.px(ox+11,oy+7,P.m3); b.px(ox+14,oy+3,P.m3); }

// ---------------------------------------------------------------- Vestibül: Rotunde hinter dem Protiron, die Kuppel längst offen
function rotunda(b){ var cx=PRO.arc[0], hw=30, x, y, VR=R('s2 s3 s4 s5 s5');
  for (x=cx-hw;x<=cx+hw;x++){ var u=(x-cx)/hw, bow=u*u*6, yt=5+rnd(bow+(hash(x>>1,3)-0.5)*1.6), ua=Math.asin(Math.max(-1,Math.min(1,u)))*hw*1.25;
    for (y=yt;y<62;y++){ var v=0.78-(u+0.35)*0.55; if (u>0.55) v-=0.25; var c=tex.ashlar(ua+40,y-bow,v>0.6?VR:(v>0.3?MID:SHD),9,5);
      if (y===yt) c=(u<0.3)?P.s5:P.s2; else if (y===yt+1) c=M.DN[c]; b.px(x,y,c); }
    if (hash(x,9)<0.14) tuft(b,x,yt,hash(x,10)<0.5?0:1); }
  crust(b,cx-hw,cx+hw+1,8,4,0.35); }

// ---------------------------------------------------------------- Protiron und Stufen zum Vestibül
function protiron(b){ var x, y, i, x0=PRO.x0, x1=PRO.x1, cx=PRO.arc[0], ar=PRO.arc;
  for (y=ar[1]-ar[2]-1;y<PRO.top;y++) for (x=x0+4;x<x1-4;x++){ if (y<36){ var qx=x-cx+0.5, qy=y-ar[1]; if (qx*qx+qy*qy>=ar[2]*ar[2]) continue; } b.px(x,y,tex.ashlar(x,y,DEEP,13,6)); }
  // großes Tor zum Vestibül, drinnen ein Lichtschacht aus der offenen Kuppel
  for (y=52;y<PRO.top;y++) for (x=cx-12;x<cx+13;x++){ if (y<60){ var dx=x-cx+0.5, dy=y-60; if (dx*dx+dy*dy>12.5*12.5) continue; } var c=P.k1; var sh=Math.abs(x-cx-2+(y-52)*0.25); if (SUNNY && sh<2.5+(y-52)*0.12) c=(sh<1.2)?P.m1:P.k2; if (y>=PRO.top-3 && Math.abs(x-cx)<6) c=SUNNY?P.m0:P.k2; b.px(x,y,c); }
  b.vl(cx-13,50,PRO.top-1,P.m3); b.vl(cx+13,50,PRO.top-1,P.s3);
  // Balustraden zwischen den äußeren Säulen
  [[242,253],[307,318]].forEach(function(g){ for (x=g[0];x<=g[1];x++){ b.px(x,76,P.s6); b.px(x,77,P.s4); var p=(x-g[0])%3; for (y=78;y<86;y++){ var c2=p===2?P.k1:(p===0?P.s5:P.s3); if ((y===78||y===85) && p===2) c2=P.m1; if (y===81 && p!==2) c2=(p===0)?P.s6:P.s4; b.px(x,y,c2); } b.px(x,86,P.s5); b.px(x,87,P.s3); } });
  // Säulen auf Postamenten
  PRO.cols.forEach(function(c){ for (y=76;y<PRO.top;y++) for (x=c-6;x<c+6;x++){ var u=(x-c+6)/11, cc=lime(x,y,u>0.72?1:0,6,4); if (y===76) cc=P.s6; if (y===77) cc=P.s4; if (WET) cc=M.DN[cc]; b.px(x,y,cc); }
    for (y=52;y<76;y++) for (x=c-3;x<=c+3;x++) b.px(x,y,granite(x,y,c)); b.hl(c-3,c+3,75,P.s4); b.hl(c-4,c+4,74,P.s5);
    capital(b,c,42,LIT); });
  // Gebälk (Architrav, Fries, Gesims) über den äußeren Säulen
  for (y=36;y<42;y++) for (x=x0+4;x<x1-4;x++){ var cc2=(y===36)?P.s6:((y===39)?P.s3:P.s5); if (x>x1-12) cc2=M.DN[cc2]; var dax=x-cx+0.5, day=y-ar[1]; if (Math.sqrt(dax*dax+day*day)<ar[2]+4) continue; b.px(x,y,cc2); }
  for (x=x0+4;x<x1-4;x++) for (y=42;y<45;y++){ if (PRO.cols.some(function(c){ return Math.abs(x-c+0.5)<7; })) continue; var dd=x-cx+0.5; if (Math.abs(dd)<ar[2]) continue; if (bayer(x,y)<(45-y)/3.4) shadePx(b,x,y,2); }
  // Bogen in der Mitte (syrischer Giebel)
  for (y=ar[1]-ar[2]-5;y<=ar[1];y++) for (x=cx-ar[2]-5;x<=cx+ar[2]+5;x++){ var dx2=x-cx+0.5, dy2=y-ar[1], r=Math.sqrt(dx2*dx2+dy2*dy2); if (r<ar[2]||r>=ar[2]+4.5) continue;
    var q=Math.atan2(-dy2,dx2)/(Math.PI/10); b.px(x,y,(r<ar[2]+1)?(dx2>0?P.s4:P.s2):((Math.abs(q-Math.round(q))<0.1)?P.s3:((Math.floor(q)%2)?P.s5:P.s6))); }
  // Giebel: Gesims hell, Tympanon mit Schatten unter dem Schräggesims
  for (y=PRO.apex;y<37;y++){ var t=(y-PRO.apex)/(37-PRO.apex), hw=t*(x1-x0)/2; for (x=rnd(cx-hw);x<=rnd(cx+hw);x++){ var dxa=Math.abs(x-cx), edge=hw-dxa, c3;
      if (edge<2.4) c3=(x<cx)?P.s6:P.s4; else { c3=lime(x,y,0,10,5); if (edge<4.8) c3=M.DN[M.DN[c3]]; }
      var ddx=x-cx+0.5, ddy=y-ar[1]; if (Math.sqrt(ddx*ddx+ddy*ddy)<ar[2]+4.5) continue; b.px(x,y,c3); } }
  b.hl(x0+3,x1-4,37,P.s6); b.hl(x0+3,x1-4,38,P.s3);
  streaks(b,x0+10,x1-10,39,52,5,0.5); crust(b,x0+4,x1-4,42,4,0.45);
  [[252,30,1],[266,24,0],[311,30,2],[233,36,0]].forEach(function(t){ tuft(b,t[0],t[1],t[2]); });
  // Stufen hinab aufs Pflaster
  for (i=0;i<5;i++){ var sy1=GY+6-i*3.6, sy0=sy1-3.6, sx0=x0+8, sx1=x1-8;
    for (y=rnd(sy0);y<rnd(sy1);y++) for (x=sx0;x<sx1;x++){ var c4=(y===rnd(sy0))?P.s6:((y===rnd(sy0)+1)?P.s5:P.s4); if (y===rnd(sy1)-1) c4=P.s3; if (hash(x>>2,y)<0.07) c4=M.DN[c4]; if (Math.abs(x-cx)<22 && y===rnd(sy0) && hash(x,y)<0.5) c4=P.s5; if (WET && y!==rnd(sy0)) c4=M.DN[c4]; b.px(x,y,c4); } }
  // Wangenmauern; die linke wirft einen Schatten schräg über die Stufen
  [[x0,x0+8],[x1-8,x1]].forEach(function(s,k){ for (y=76;y<GY+6;y++) for (x=s[0];x<s[1];x++){ var cc5=lime(x,y,(k===1&&x>s[1]-3)?1:0,8,5); if (y===76) cc5=P.s6; if (y===77) cc5=P.s4; b.px(x,y,cc5); } });
  if (SUNNY){ for (y=PRO.top-2;y<GY+6;y++){ var se=x0+8+5+(y-PRO.top)*0.45; for (x=x0+8;x<se;x++) shadePx(b,x,y,2); }
    for (y=GY;y<GY+6;y++) for (x=x1;x<x1+8-(y-GY);x++) shadePx(b,x,y,2); }
  if (!WET) cushion(b,246,rnd(GY+6-3*3.6),6); }

// ---------------------------------------------------------------- Haus in der Palastmauer: unten römische Quader, oben Mittelalter
function palaceHouse(b){ var x, y, x0=PRO.x1-4, x1=ALY.x0;
  for (y=27;y<GY;y++) for (x=x0;x<x1;x++){ var c=(y>=64)?lime(x,y,0,16,8):rubble(x,y,11); if (y===64) c=P.s3; if (x>=x1-3) c=(x===x1-1)?P.m2:M.DN[M.DN[c]]; b.px(x,y,c); }
  for (x=x0-1;x<x1+1;x++){ b.px(x,23,((x+1)%3)?P.t2:P.t1); b.px(x,24,(x%3)?P.t3:P.t1); b.px(x,25,(x%3===1)?P.t4:P.t3); b.px(x,26,P.t1); shadePx(b,x,27,2); shadePx(b,x,28,1); }
  b.rect(355,15,4,8,P.s4); b.vl(358,15,22,P.s2); b.hl(354,359,15,P.t2); b.px(356,16,P.s5);
  // gotisches Fenster mit Spitzbogen, halb offene Läden, Geranie
  for (y=35;y<51;y++) for (x=344;x<355;x++){ var dx=Math.abs(x-349.5), top=35+Math.max(0,dx*dx*0.24); if (y<top) continue; var c2;
    if (dx>4.5 || y<top+1) c2=(x<349)?P.s6:P.s4;
    else if (x<348) c2=((y-35)%2)?P.g3:P.g2; else if (x<351) c2=P.k1; else c2=((y-35)%2)?P.g2:P.g1;
    b.px(x,y,c2); }
  b.hl(343,355,51,P.s6); b.hl(343,355,52,P.s3); for (x=343;x<356;x++) shadePx(b,x,53,1);
  b.rect(352,48,3,3,P.t3); b.px(352,47,P.r3); b.px(353,46,P.r4); b.px(354,47,P.r3); b.px(351,47,P.g3); b.px(353,47,P.g2);
  // Spolie: ein römisches Relief mit Rosette, irgendwann eingemauert
  b.rect(357,56,7,6,P.s5); b.hl(357,363,56,P.s6); b.vl(363,56,61,P.s3); b.hl(357,363,61,P.s3); b.px(360,58,P.s3); b.px(359,59,P.s3); b.px(361,59,P.s3); b.px(360,60,P.s3); b.px(360,59,P.s6);
  for (y=27;y<GY;y++) for (x=x0+1;x<x0+5;x++) shadePx(b,x,y,1);
  crust(b,x0,x1,64,3,0.35);
  lantern(b,LAMPS[1][0],LAMPS[1][1],1); }

// ---------------------------------------------------------------- Zeitungskiosk
function kiosk(b){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, x, y;
  if (SUNNY) for (y=by-6;y<by;y++) for (x=x1;x<x1+9-(by-y);x++) shadePx(b,x,y,2);
  for (y=by-30;y<by;y++) for (x=x0;x<x1;x++){ var u=(x-x0)/(x1-x0), c=u<0.12?P.g4:(u>0.85?P.g1:P.g3); if ((x-x0)%6===0) c=M.DN[c]; if (y>=by-3) c=P.g1; b.px(x,y,c); }
  b.rect(x0+2,by-26,x1-x0-4,12,P.k2); var cols=[P.r3,P.y4,P.b2,P.s6,P.r2,P.a4,P.d4,P.s5,P.y3,P.b3];
  for (var i=0;i<6;i++){ var mx=x0+3+i*3+(i>2?1:0); b.rect(mx,by-25+(i%2),3,5,cols[i%cols.length]); b.px(mx+1,by-24+(i%2),P.k2); b.rect(mx,by-19,3,4,cols[(i+4)%cols.length]); b.px(mx,by-19,M.UP[cols[(i+4)%cols.length]]); }
  b.hl(x0+2,x1-3,by-14,P.g4);
  b.hl(x0+1,x1-2,by-12,P.m2); for (var n=0;n<4;n++){ var nx=x0+1+n*6; b.rect(nx,by-11,5,7,P.s5); b.hl(nx,nx+4,by-10,P.k2); b.hl(nx,nx+3,by-8,P.s3); b.hl(nx,nx+2,by-6,P.s3); b.px(nx+2,by-12,P.m3); }
  b.rect(x0-4,by-36,x1-x0+8,6,P.g2); b.hl(x0-4,x1+3,by-36,P.g4); b.hl(x0-4,x1+3,by-31,P.g1); b.rect(x0-2,by-35,x1-x0+4,4,P.s5); M.microText(b,'NOVINE',x0-1,by-35,P.r2);
  b.hl(x0-4,x1+3,by-30,P.k2); for (x=x0;x<x1;x++) if (bayer(x,by-29)<0.6) shadePx(b,x,by-29,1);
  b.vl(x0-5,by-20,by-1,P.m1); b.hl(x0-8,x0-2,by-1,P.m1); for (var p=0;p<3;p++){ b.rect(x0-8,by-19+p*5,3,4,[P.b3,P.a5,P.t4][p]); b.rect(x0-4,by-19+p*5,3,4,[P.s5,P.y4,P.b2][p]); } }

// ---------------------------------------------------------------- Gasse: eng, im Schatten, Wäscheleinen, hinten eine sonnige Wand
function alley(b){ var x0=ALY.x0, x1=ALY.x1, bx0=380, bx1=392, by0=38, by1=80, x, y;
  for (y=0;y<GY;y++) for (x=x0;x<x1;x++){ var c, tL=(x-x0)/(bx0-x0), tR=(x1-x)/(x1-bx1);
    var topL=31+tL*(by0-31), botL=GY+tL*(by1-GY), botR=GY+tR*(by1-GY);
    if (x<bx0 && y>=topL && y<botL){ c=tex.ashlar((x-x0)*2.6,y,OPEN,9,6); if (y<topL+1) c=P.s4; }
    else if (x>=bx1 && y<botR){ var lit=SUNNY && y<(x1-x)*1.4+6; c=tex.ashlar((x1-x)*2.6,y,lit?LIT:SHD,9,6); }
    else if (x>=bx0 && x<bx1 && y>=by0 && y<by1){ c=lime(x*1.3,y,SUNNY?0:1,7,4); if (y>by1-13 && x>bx0+3 && x<bx1-3){ c=(y<by1-12)?P.s3:P.k2; } }
    else if (y>=by1){ var dpt=(y-by1)/(GY-by1), sr=dpt*7; c=((sr-Math.floor(sr))<0.25)?P.s4:((sr>4)?P.s2:P.m2); }
    else continue;
    b.px(x,y,c); }
  b.px(386,52,P.k1); b.line(386,52,389,49,P.k1); b.rect(388,46,3,4,P.k2); b.px(389,47,P.m3);          // kleine Laterne hinten in der Gasse
  LINES.forEach(function(l){ var n=Math.abs(l[2]-l[0]); for (var i=0;i<=n;i++){ var t=i/n; b.px(rnd(l[0]+(l[2]-l[0])*t),rnd(l[1]+(l[3]-l[1])*t+Math.sin(Math.PI*t)*2),P.k2); } });
  b.rect(LINES[0][0]-1,22,2,3,P.m1); b.rect(LINES[0][2]-2,18,2,3,P.m1);
  for (x=x0;x<x1;x++){ var yw=12+rnd(Math.sin((x-x0)/(x1-x0)*Math.PI)*3); b.px(x,yw,P.k1); } }   // Stromkabel quer über die Gasse

// ---------------------------------------------------------------- Ninas Haus mit Laden „Okvir“
function shopHouse(b){ var x0=SHOP.x0, x, y;
  for (y=0;y<GY+4;y++) for (x=x0;x<W;x++){ var c=lime(x,y,0,15,7); if (x<x0+3) c=(x===x0)?P.s3:P.s6; b.px(x,y,c); }
  for (x=x0-3;x<W;x++){ b.px(x,0,(x%3)?P.t3:P.t1); b.px(x,1,(x%3===1)?P.t2:P.t4); b.px(x,2,P.t1); b.px(x,3,P.k2); shadePx(b,x,4,2); shadePx(b,x,5,1); }
  M.prop.window(b,422,14,12,18,{shut:true,col:R('g1 g2 g3 g4')});
  M.prop.window(b,456,14,12,18,{open:true,fill:function(xx,yy){ return (yy<20)?P.k1:P.k2; },col:R('g1 g2 g3 g4')});
  for (y=14;y<34;y++){ shadePx(b,435,y,1); shadePx(b,436,y,1); }
  b.rect(454,32,16,3,P.s4); b.hl(454,469,32,P.s6); for (var g=0;g<4;g++){ b.rect(455+g*4,29,3,3,P.t3); b.px(456+g*4,27,P.r3); b.px(455+g*4,28,P.g3); b.px(457+g*4,28,P.r4); }
  streaks(b,x0+3,W,6,46,17,0.45);
  // Ladenfront aus Holz, dunkelgrün gestrichen
  for (y=48;y<GY+4;y++) for (x=x0+4;x<W-2;x++){ var c2=(y<50)?P.g4:P.g2; if (x===x0+4||x===W-3) c2=P.g1; if (y>=GY+1) c2=P.g1; b.px(x,y,c2); }
  for (x=x0+4;x<W-2;x++) shadePx(b,x,50,1);
  var sw=SHOP.win; b.rect(sw[0]-2,sw[1]-2,sw[2]+4,sw[3]+4,P.g1); b.rect(sw[0],sw[1],sw[2],sw[3],P.k2);
  for (var yy=sw[1];yy<sw[1]+sw[3];yy++) for (var xx=sw[0];xx<sw[0]+sw[2];xx++) if ((xx-yy+200)%17<2 && yy<sw[1]+20) b.px(xx,yy,P.m1);
  M.prop.frame(b,sw[0]+2,sw[1]+3,11,14,{frame:R('y1 y2 y4'),bg:P.k1});
  M.prop.frame(b,sw[0]+15,sw[1]+2,13,9,{frame:R('w1 w3 w4'),bg:P.k1});
  M.prop.frame(b,sw[0]+15,sw[1]+12,11,9,{frame:R('y1 y2 y3'),fill:function(xx,yy){ var yy0=sw[1]+14, hz=yy0+3; if (yy<hz) return (hash(xx,yy)<0.1)?P.n3:P.n0; if (xx===sw[0]+21&&yy===hz-1) return P.s5; if (yy===hz && xx>sw[0]+19 && xx<sw[0]+24) return P.s5; if (yy>hz && (xx===sw[0]+18) ) return P.y3; return P.n1; }});
  M.prop.frame(b,sw[0]+3,sw[1]+20,9,10,{frame:R('w0 w2 w3'),bg:P.k1});
  M.prop.frame(b,sw[0]+24,sw[1]+14,5,7,{frame:R('y1 y3 y4'),bg:P.k1});
  b.rect(sw[0]+13,sw[1]+24,14,6,P.w2); b.hl(sw[0]+13,sw[0]+26,sw[1]+24,P.w4);
  b.hl(sw[0],sw[0]+sw[2]-1,sw[1]+sw[3],P.s5); b.hl(sw[0]-2,sw[0]+sw[2]+1,sw[1]+sw[3]+1,P.g1);
  var dr=SHOP.door; M.prop.door(b,dr[0],dr[1],dr[2],dr[3],{ramp:R('g0 g1 g2 g3 g4'),frame:R('g0 g1 g2 g3'),glass:true,glassCol:P.k2,knob:'L'});
  b.rect(dr[0]+3,dr[1]+3,dr[2]-6,16,P.k2); b.line(dr[0]+4,dr[1]+4,dr[0]+9,dr[1]+12,P.m1); b.rect(dr[0]+7,dr[1]+9,7,4,P.s5); b.hl(dr[0]+8,dr[0]+12,dr[1]+10,P.r2); b.line(dr[0]+8,dr[1]+8,dr[0]+10,dr[1]+5,P.k1); b.line(dr[0]+12,dr[1]+8,dr[0]+10,dr[1]+5,P.k1);
  b.hl(dr[0]-2,dr[0]+dr[2]+1,dr[1]+dr[3],P.s3);
  b.line(dr[0]+dr[2]-3,dr[1]-4,dr[0]+dr[2]+1,dr[1]-1,P.k1); b.ellipse(dr[0]+dr[2]+1.5,dr[1]+1,1.8,2,P.y3); b.px(dr[0]+dr[2]+1,dr[1],P.y5);   // Türglocke
  // Holzschild „OKVIR“ mit gemalten Buchstaben
  var sg=SHOP.sign; b.rect(sg[0]-1,sg[1]-1,sg[2]+2,sg[3]+2,P.w0); b.fn(sg[0],sg[1],sg[2],sg[3],function(xx2,yy2){ return tex.boards(xx2,yy2-sg[1],R('w1 w2 w3 w4'),5); });
  b.hl(sg[0],sg[0]+sg[2]-1,sg[1],P.w4); M.text(b,'OKVIR',rnd(sg[0]+sg[2]/2-10)+1,sg[1]+2,P.w0); M.text(b,'OKVIR',rnd(sg[0]+sg[2]/2-10),sg[1]+1,P.s5);
  M.microText(b,'N. BARIĆ',rnd(sg[0]+sg[2]/2-15),sg[1]+8,P.e4);
  b.vl(sg[0]+3,sg[1]-4,sg[1]-1,P.k2); b.vl(sg[0]+sg[2]-4,sg[1]-4,sg[1]-1,P.k2);
  for (x=sg[0];x<sg[0]+sg[2]+3;x++) shadePx(b,x,sg[1]+sg[3]+1,1);
  lantern(b,LAMPS[2][0],LAMPS[2][1],-1); }

// ---------------------------------------------------------------- Steinbank vor dem Säulengang
function bench(b,x,by,w){ var xx, yy;
  if (SUNNY) for (yy=by-9;yy<by;yy++) for (xx=x+4;xx<x+w+6;xx++){ if (xx-x-w<(by-yy)*0.7) shadePx(b,xx,yy,2); }
  b.rect(x,by-8,w,2,P.s6); b.rect(x,by-6,w,2,P.s4); b.hl(x,x+w-1,by-4,P.s2); b.vl(x+w-1,by-8,by-5,P.s3);
  [x+3,x+w-9].forEach(function(lx){ b.rect(lx,by-4,6,4,P.s4); b.vl(lx+4,by-4,by-1,P.s3); b.vl(lx+5,by-4,by-1,P.s2); b.hl(lx,lx+5,by-4,P.s2); });
  for (xx=x+9;xx<x+w-9;xx++) for (yy=by-4;yy<by;yy++) shadePx(b,xx,yy,yy===by-4?2:1); }

// ---------------------------------------------------------------- nasses Pflaster: die Fassaden spiegeln sich
var PAVE=new Uint8Array(W*H);
function wetReflect(b,pv){ var src=b.clone(); PAVE.fill(0);
  for (var y=GY;y<H;y++){ var d=y-GY, k=0.7-d/62, sy=GY-1-Math.floor(d*0.85);
    for (var x=0;x<W;x++){ var i=y*W+x, cur=b.d[i], base=pv.d[i]; if (cur!==base && cur!==M.DN[base] && cur!==M.DN[M.DN[base]]) continue; PAVE[i]=1; if (JNT[i] || k<=0.04) continue;
      var sx=x+((y%3===1)?rnd(Math.sin(y*1.3+x*0.07)*1.2):0); if (sx<0||sx>=W||sy<0) continue; var sc=src.d[sy*W+sx];
      if (M.lum(sc)>M.lum(cur)+10 && bayer(x,y)<k*(0.6+0.4*hash(x>>2,y))) b.d[i]=M.DN[sc]; } } }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H);
var DAWNSUN=M.tintMake(function(r,g,b){ return [r*0.9+44, g*0.66+18, b*0.5+14]; });
function paint(S,GS,tod){ var weather=M.scn.weather(GS), b=new M.Buf(W,H,T), x, y;
  SUNNY=(tod==='day' && weather!=='rain'); WET=(weather==='rain');
  paving(b); var pv=b.clone();
  topHouse(b); mausoleum(b); precinct(b); tower(b); colonnade(b); sphinx(b,163,GY);
  rotunda(b); palaceHouse(b); protiron(b); kiosk(b); alley(b); shopHouse(b);
  bench(b,48,GY+9,40);
  // Schatten des gegenüberliegenden Säulengangs (hinter dem Betrachter) fällt vorn aufs Pflaster: Pfeiler als Streifen, Bögen als Lichtzungen
  if (SUNNY) for (var fyy=124;fyy<H;fyy++) for (var fx=0;fx<W;fx++){ var sx=fx-(H-fyy)*0.7, ph=((sx+14)%40+40)%40, col=ph<7, u=col?0:(ph-7)/33, arc=Math.sqrt(Math.max(0,1-(2*u-1)*(2*u-1)));
    var edge=col?125:131+arc*9; if (fyy<edge) continue; shadePx(b,fx,fyy,(fyy-edge<1.2)?1:2); }
  // Kontaktschatten an der Fassadenkante
  for (x=0;x<W;x++){ if (x>=PRO.x0&&x<PRO.x1) continue; shadePx(b,x,GY,1); if (!SUNNY && bayer(x,GY+1)<0.5) shadePx(b,x,GY+1,1); }
  // Tauben auf den Gesimsen (statisch)
  [[22,CORN-1],[27,CORN-1],[90,CORN-1],[244,35],[314,35],[194,16],[300,94]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); });
  M.light(b,M.lf.sum(M.lf.band(112,H,0,-0.6),M.lf.vignette(W,H,0.5)),0,0,function(x,y){ return y>=GY; });
  if (!SUNNY) M.light(b,M.lf.k(-0.35),0,0,function(x,y){ return y<GY; });
  // Himmel dahinter legen
  var sk=paintSky(tod,weather); SKYM.fill(0);
  for (var k=0;k<W*H;k++) if (b.d[k]===T){ b.d[k]=sk.d[k]; SKYM[k]=1; }
  if (WET) wetReflect(b,pv);
  var base=b.clone(), lights=[];
  if (tod!=='day'){ lights=[[LAMPS[0][0],LAMPS[0][1]+6,22,0.95,18],[LAMPS[1][0],LAMPS[1][1]+8,24,0.95,20],[LAMPS[2][0]-4,LAMPS[2][1]+10,24,0.9,22],[425,90,26,0.7,14],[141,76,16,0.75,12],[353,94,15,0.55,10],[30,112,28,0.5,8],[338,114,30,0.5,9],[456,114,30,0.5,9]]; }
  M.finishTOD(b,tod,{ sky:function(x,y){ return SKYM[y*W+x]===1; }, lights:lights, after:function(b,tod){ if (tod==='day') return;
      LAMPS.forEach(function(l){ litLantern(b,l[0],l[1]); });
      // erleuchtete Fenster: Café, Schaufenster, Kiosk, ein paar Läden mit Lichtritzen
      function glass(x0,y0,x1,y1,cs){ for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var c=base.get(x,y); if (cs.indexOf(c)>=0) b.px(x,y,bayer(x,y)<0.45?P.y4:P.y3); } }
      glass(137,64,146,78,[P.k2,P.m1]); glass(27,13,33,21,[P.k1,P.k2]); glass(348,37,350,50,[P.k1]); glass(458,14,467,31,[P.k1,P.k2]);
      var sw=SHOP.win; for (y=sw[1];y<sw[1]+sw[3];y++) for (x=sw[0];x<sw[0]+sw[2];x++){ if (base.get(x,y)===P.k2||base.get(x,y)===P.m1) b.px(x,y,bayer(x,y)<0.35?P.y3:P.y2); }
      for (y=KIO.base-26;y<KIO.base-14;y++) for (x=KIO.x0+2;x<KIO.x1-2;x++) if (base.get(x,y)===P.k2) b.px(x,y,P.y2);
      [[19,47],[21,49],[19,51],[8,15],[10,17],[424,18],[430,24]].forEach(function(p){ b.px(p[0],p[1],P.y3); });
      // nasses Pflaster: lange, weich gebrochene Lichtbahnen unter den Laternen
      if (WET) LAMPS.concat([[425,96]]).forEach(function(l,i){ for (var yy=GY+4;yy<H;yy++){ var a=0.55-(yy-GY)/75; if (a<0.04) break; var wob=Math.round(Math.sin(yy*0.45+i*2)*0.8);
          for (var xx=l[0]-2;xx<=l[0]+2;xx++){ var wx=xx+wob, ad=Math.abs(xx-l[0]), k=a*(ad===0?1:(ad===1?0.55:0.2)); if (wx>=0 && wx<W && PAVE[yy*W+wx] && bayer(wx,yy)<k) b.px(wx,yy,ad===0&&yy<GY+16?P.y3:(yy<GY+26?P.y2:P.d4)); } } }); } });
  // Morgengrauen: die Turmspitze bekommt als Erstes Sonne
  if (tod==='dawn') for (y=0;y<40;y++){ var xr=y<17?197:(y<27?199:204); for (x=184;x<=xr;x++){ var i2=y*W+x; if (SKYM[i2]) continue; var c0=base.d[i2]; if (M.lum(c0)<110) continue; b.d[i2]=M.tintPx(DAWNSUN,c0,x,y); } }
  return b; }

// ---------------------------------------------------------------- bewegte Teile: Tauben, Wäsche im Wind
var PIG=[[226,122],[236,127],[247,120],[258,130],[268,124],[281,128],[214,131]];
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null, wind=M.scn.weather(GS)==='bura'?1:0.15;
  function tp(x,y,c){ var sx=x-cam; if (sx<0||sx>=fb.w||y<0||y>=H) return; fb.px(sx,y,tint?M.tintPx(tint,c,sx,y):c); }
  PIG.forEach(function(p,i){ var cyc=(t*0.35+hash(i,5)*7)%14, fly=cyc>12.5, f=(i%2)?1:-1, x=p[0]+Math.round(Math.sin(t*0.4+i*1.7)*3), y=p[1], peck=Math.floor(t*3+i*0.7)%4===0;
    if (fly){ var k=(cyc-12.5)/1.5, fx=rnd(x+f*k*34), fyy=rnd(y-k*46), wing=Math.floor(t*12+i)%2; tp(fx,fyy,P.m2); tp(fx+1,fyy,P.m3); tp(fx-1,fyy-(wing?1:-1),P.m4); tp(fx+2,fyy-(wing?1:-1),P.m4); tp(fx-2,fyy-(wing?2:-1),P.m3); tp(fx+3,fyy-(wing?2:-1),P.m3); return; }
    tp(x,y,P.m2); tp(x+1,y,P.m2); tp(x-1,y-1,P.m2); tp(x,y-1,P.m3); tp(x+1,y-1,P.m3); tp(x+2,y-1,P.m2); tp(x,y-2,P.m4);
    tp(f>0?x-2:x+3,y-1,P.k2); tp(f>0?x-2:x+3,y,P.m1);
    var hx=f>0?x+2:x-1, hy=peck?y:y-2; tp(hx,hy,P.m3); tp(hx+f,hy,P.y3); tp(hx,hy-1,P.m4); tp(f>0?x+1:x,y-2,P.a4); tp(x,y+1,P.r3); tp(x+1,y+1,P.r3); });
  // Wäsche zwischen den Säulen
  CLINE.forEach(function(l,li){ var items=li?[['towel',0.15,P.s6],['sock',0.55,P.b3],['sock',0.7,P.b3]]:[['shirt',0.1,P.b4],['towel',0.55,P.r2]];
    items.forEach(function(it,k){ var u=it[1], lx=rnd(l[0]+(l[2]-l[0])*u), ly=l[1]+Math.round(Math.sin(u*Math.PI)*2)+1, c=it[2], m=CLOTH[it[0]];
      for (var yy=0;yy<m.length;yy++){ var sh=Math.round((yy*0.4+Math.sin(t*10*wind+k*1.7+li*2+yy*0.9)*0.7)*wind); for (var xx=0;xx<m[yy].length;xx++){ if (m[yy][xx]==='.') continue; var cc=(m[yy][xx]==='d'||yy===m.length-1||xx===0)?M.DN[c]:c; tp(lx+xx+sh,ly+yy,cc); } } tp(lx,ly-1,P.k1); }); });
  // Wäsche über der Gasse: Hemd, Hose, Handtuch, Socken wehen in der Bura nach rechts
  LINES.forEach(function(l,li){ var items=li?[['towel',0.2,P.b3],['shirt',0.5,P.s6],['sock',0.78,P.r3]]:[['shirt',0.14,P.r3],['trous',0.38,P.c2],['towel',0.62,P.y4],['shirt',0.84,P.s5]];
    items.forEach(function(it,k){ var u=it[1], lx=rnd(l[0]+(l[2]-l[0])*u), ly=rnd(l[1]+(l[3]-l[1])*u+Math.sin(Math.PI*u)*2)+1, c=it[2], m=CLOTH[it[0]];
      for (var yy=0;yy<m.length;yy++){ var sh=Math.round((yy*0.45+Math.sin(t*10*wind+k*2.1+li+yy*0.9)*0.7)*wind); for (var xx=0;xx<m[yy].length;xx++){ if (m[yy][xx]==='.') continue; var cc=(m[yy][xx]==='d')?M.DN[c]:c; if (yy===m.length-1||xx===0) cc=M.DN[c]; tp(lx+xx+sh,ly+yy,cc); } }
      tp(lx,ly-1,P.k1); tp(lx+m[0].length-1,ly-1,P.k1); }); });
  if (tod!=='day') LAMPS.forEach(function(l){ M.glow(fb,l[0]-cam,l[1],9,t,0.4); }); }
var CLOTH={ shirt:['#######','#######','##.#.##','.#####.','.#####.','.##d##.'], trous:['######','######','##..##','##..##','##..##','##..##','dd..dd'], towel:['######','######','dddddd','######','######','######'], sock:['##','##','##','###'] };
function front(fb,v,S,GS){ var w=M.scn.weather(GS);
  if (w==='bura'){ M.scn.buraDebris(fb,v.t,112,140,v.cam); if (v.tod==='day') M.scn.gulls(fb,v.t*1.6,0,4,W,18,3,v.cam); }   // Möwen, von der Bura getrieben
  if (w==='rain') M.rain(fb,v.t,{n:80,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3}); }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ return y>=110 && y<=138 && x>=6 && x<=470; };

M.defineArt('oldtown',{
  width:W, paint:paint, walk:WALK, dynamic:dyn, front:front,
  spots:{
    exit:[0,96,12,44],
    columns:[0,CORN,166,72],
    belltower:[184,0,28,96],
    steps:[230,82,100,26],
    sphinx:[164,72,30,28],
    pigeons:[206,112,90,24],
    bench:[46,100,46,10],
    kiosk:[334,66,34,42],
    alley:[368,14,36,86],
    shop_window:[407,62,36,42],
    shop_door:[445,58,28,48],
    sign:[408,47,66,15]
  },
  stands:{
    exit:[8,124,'L'], columns:[80,116,'B'], belltower:[198,114,'B'], steps:[280,114,'B'], sphinx:[176,114,'B'], pigeons:[250,118,'R'],
    bench:[68,114,'B'], kiosk:[353,114,'B'], alley:[385,112,'B'], shop_window:[425,112,'B'], shop_door:[459,112,'B'], sign:[441,114,'B']
  },
  start:[30,124,'R'], entries:{ map:[16,124,'R'], shop:[459,116,'F'] }
});
})(M);
