/* ===== rooms/art/ostbus.js — Ostbusbahnhof in Mostar (480 px, scrollend) =====
   Links der flache Betonbau des Busbahnhofs aus den 1970ern: Waschbetonplatten, Fensterband der Wartehalle, „AUTOBUSNA
   STANICA“ auf der Stirn des Vordachs, das auf drei schlanken Stützen über zwei Bussteigen liegt. Am Steig 1 der Reisebus
   (weiß-blau, mit der Nase zum Steig; Leuchtschild nach S.busTo, S.busIn: sonst leerer Steig mit Ölfleck). Am Steig 2 die
   Abfahrtstafel „POLASCI“, darunter auf einem Emailleschild gut lesbar „MÜNCHEN · subota“, davor eine Bank. In der Mitte der
   Kiosk (Zeitungen, Postkarten; die Kioskfrau hinter der Theke) mit dem Drehständer voller Stadtpläne. Rechts der Bahnhof
   (Flachdach, hohe Fenster, Uhr), davor der Taxistand mit einem alten weißen Mercedes (W123, Taxischild). Hinten Wohnblocks
   mit leisen Einschussnarben und der kahle Velež. Pfützen auf dem Vorplatz; bei Regen (k3_pro) ein Mann mit Schirm. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=480, H=144, GY=104;
// ---------------------------------------------------------------- Geometrie
var CAN={x0:4,x1:238,y0:30,y1:39,cols:[16,116,228]};   // Vordach (Stirn y0..y1), Stützen
var BUS={x0:40,x1:102,top:48,base:112,side:16};         // Reisebus am Steig 1 (Front x0..x1, Seite nach rechts hinten)
var BOARD={x0:130,x1:190,y0:46,y1:82};                  // Abfahrtstafel am Steig 2
var MUC={x0:122,x1:198,y0:84,y1:96};                    // Emailleschild „MÜNCHEN · subota“
var BENCH={x0:196,x1:230,seat:108,base:117};            // Bank
var BLD={x0:4,x1:246,top:40};                           // Gebäude des Busbahnhofs (hinter dem Vordach)
var KIO={x0:252,x1:294,top:52,win0:60,sill:88,base:110};
var RACK={x0:299,x1:317,top:70,base:112};               // Drehständer mit Stadtplänen
var STA={x0:330,x1:480,roof:24,fl:30};                  // Bahnhof
var CLK={cx:350,cy:50,r:8};
var TAXI={x0:410,base:112};
var PUD=[[318,131,30,4],[196,136,22,3],[110,124,18,3],[440,128,24,3],[262,140,16,2]];   // Pfützen [x,y,rx,ry]
var KIOSKM_Y=110;
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
function inPud(x,y){ for (var i=0;i<PUD.length;i++){ var p=PUD[i], dx=(x-p[0])/p[2], dy=(y-p[1])/p[3]; if (dx*dx+dy*dy<1+Math.sin(x*0.7+i)*0.08) return i+1; } return 0; }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  gdawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.44+10, g*0.2+L*0.44+15, b*0.2+L*0.44+27]; },
  grey:function(r,g,b){ var L=lum(r,g,b); return [r*0.58+L*0.32+4, g*0.58+L*0.32+6, b*0.58+L*0.32+12]; },
  rain:function(r,g,b){ var L=lum(r,g,b); return [r*0.7+L*0.16+1, g*0.7+L*0.16+2, b*0.7+L*0.16+3]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,w){ if (tod==='day') return w==='grey'?'grey':null; if (tod==='night') return 'night'; if (tod==='dawn') return w==='grey'?'gdawn':'dawn'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod){ if (tod==='day') return []; var L=[];
  [40,120,200].forEach(function(x){ L.push([x,46,30,14,0.55],[x,114,32,10,0.35]); });            // Leuchtröhren unter dem Vordach
  L.push([(KIO.x0+KIO.x1)/2,74,26,22,0.85],[(KIO.x0+KIO.x1)/2,114,28,9,0.4],[(BOARD.x0+BOARD.x1)/2,64,30,22,0.5]);
  L.push([(STA.x0+STA.x1)/2+10,70,80,34,0.6],[(STA.x0+STA.x1)/2,110,80,9,0.35],[CLK.cx,CLK.cy,14,14,0.6],[TAXI.x0+24,98,20,10,0.4]);
  return L; }

// ---------------------------------------------------------------- Masken
var DEP=new Uint8Array(W*H), SKYM=new Uint8Array(W*H), PAVE=new Uint8Array(W*H), WINS=[];
function stage(b,d,fn){ var s=b.d.slice(); fn(); for (var k=0;k<W*H;k++) if (b.d[k]!==s[k]) DEP[k]=d; }

// ---------------------------------------------------------------- Himmel
function paintSky(s,tod,w){ var x, y, i, r=M.rng(31);
  if (w==='rain'||w==='grey'){ M.scn.sky(s,0,0,W,H,tod,w,61); if (w==='rain') for (y=0;y<50;y++) for (x=0;x<W;x++){ var cv=fbm(x*0.03+1,y*0.1,4); if (cv>0.6 && bayer(x,y)<(cv-0.6)*3) s.px(x,y,tod==='day'?P.m2:P.k2); } return; }
  if (tod==='day'){ var D=R('b0 b1 b2 b3 b4 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(D,(w==='bura'?0.05:0.15)+Math.pow(y/80,1.1)*0.84,x,y));
    for (i=0;i<(w==='bura'?8:4);i++){ var cx=r()*W, cy=3+r()*20, L=40+r()*80, sl=w==='bura'?0.15:0.02; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy-k*sl+Math.sin(k*0.08+i)*1.2), a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.3) s.px(xx,yy,P.b5); } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(N,0.04+Math.pow(y/96,1.3)*0.8,x,y)); for (i=0;i<240;i++) s.px(Math.floor(r()*W),Math.floor(Math.pow(r(),1.5)*60),r()<0.12?P.n5:P.n3); return; }
  M.sky(s,0,0,W,100,tod,19); }

// ---------------------------------------------------------------- Velež (kahler Kalkberg im Osten) und Wohnblocks
function velezY(x){ return 10+Math.sin(x*0.011+0.4)*7+Math.sin(x*0.037+2)*3+(vn(x*0.06,4.4,2)-0.5)*5; }
function paintVelez(b,w){ var G=R('s0 s1 m2 s2 m3 s3 s4 s5'), x, y;
  for (x=0;x<W;x++){ var top=rd(velezY(x)); for (y=top;y<92;y++){ var d=y-top, gx=x+(fbm(x*0.018,y*0.03,2)-0.5)*34+d*0.25, cw=24+hash(Math.floor(gx/28),5)*14, cell=gx/cw, ci=Math.floor(cell), u=cell-ci, tri=u<0.5?u*2:(1-u)*2;
      var side=(u<0.5?0.17:-0.14)*Math.min(1,d/6), gully=Math.pow(1-tri,5)*0.38*Math.min(1,d/8), strata=(Math.sin(y*0.7+fbm(x*0.05,y*0.05,7)*5)>0.82)?0.07:0;
      var v=0.6-d*0.003+side-gully+strata+(fbm(x*0.15,y*0.2,5)-0.5)*0.16+(y===top?0.22:0), c=ra(G,v,x,y);
      if (d>10 && fbm(x*0.45,y*0.55,21)>0.68) c=(hash(x,y)<0.5)?P.e2:P.g1;
      if ((w==='bura'||w==='frost') && d<2 && hash(x,3)<0.8) c=P.s6;
      b.px(x,y,c); } } }
var BLOCKS=[[214,30,40,'s'],[246,22,52,'e'],[290,24,34,'s'],[150,26,30,'e'],[96,20,26,'s'],[24,28,32,'s']];
function blocks(b){ BLOCKS.forEach(function(q,i){ var x0=q[0], w=q[1], top=q[2], col=q[3]==='e'?R('e2 e3 e4'):R('s2 s3 s4'), x, y;
    for (y=top;y<GY;y++) for (x=x0;x<x0+w;x++){ var u=x-x0, fl=(y-top)%5, c=col[1]; if (u===0) c=col[2]; if (u>=w-2) c=col[0];
      if (fl===0) c=(u>=w-2)?col[0]:col[2];                                                        // Deckenstirnen der Loggien
      else if (fl>=2 && (u%5===1||u%5===2||u%5===3) && u<w-2){ c=(hash(x>>2,y)<0.18)?P.s5:P.m1; if (fl===2) c=P.k2; if (fl===4 && u%5===2) WINS.push([x,y-2,1,2,hash(x,y)]); }
      if (fl===1 && u%9===4 && hash(i,y)<0.4) c=P.s5;                                               // Wäsche, Schüsseln
      b.px(x,y,c); }
    b.hl(x0,x0+w-1,top,col[2]); b.rect(x0+3,top-3,6,3,col[0]); if (i%2===0){ b.vl(x0+w-5,top-8,top-1,P.m2); b.hl(x0+w-7,x0+w-3,top-6,P.m2); }
    for (var k=0;k<14;k++){ var sx=x0+2+Math.floor(hash(i,k)*(w-6)), sy=top+4+Math.floor(hash(k,i)*(GY-top-12)); dk(b,sx,sy,2); dk(b,sx+1,sy,1); }   // leise Einschussnarben
  }); }

// ---------------------------------------------------------------- Busbahnhof: Gebäude, Vordach, Stützen, Leuchtröhren
function building(b){ var x, y, x0=BLD.x0, x1=BLD.x1;
  for (y=BLD.top;y<GY;y++) for (x=x0;x<x1;x++){ var c, u=x-x0;
    if (y<52) c=((u%12)===0)?P.m1:(hash(Math.floor(u/12),2)<0.5?P.s3:P.m3);                       // Waschbetonplatten
    else if (y<86){ var fx=u%18; c=(fx<2)?P.m2:((y===52||y===85)?P.m1:P.c1); if (c===P.c1 && ((x*0.6+y)%23)<1.6) c=P.c3; if (c===P.c1 && y>74) c=P.c0; }   // Fensterband der Wartehalle
    else c=(y===86)?P.s4:((hash(x>>2,y>>1)<0.2)?P.m2:P.m3);
    if (y>=52 && y<56 && c===P.c1) c=P.k2; b.px(x,y,c); }
  for (x=x0;x<x1;x+=18) if (hash(x,3)<0.6){ var wx=x+4; b.rect(wx,66,10,20,P.k2); b.vl(wx+5,66,85,P.m1); b.hl(wx,wx+9,66,P.m1); }    // Glastüren
  for (x=x0+8;x<x1-8;x+=36){ b.rect(x,60,6,4,P.s4); b.px(x+1,61,P.k2); b.px(x+4,61,P.k2); }        // Lautsprecher, Schilder
  for (x=x0;x<x1;x++) for (var k=0;k<8;k++) if (hash(x,k+40)<0.3-k*0.03) dk(b,x,GY-1-k,1);   // Spritzwasserspur
  b.rect(6,88,3,16,P.m1); b.rect(10,92,6,12,P.g1); b.hl(10,15,92,P.g2);                              // Abfalleimer
  // Fahrkartenschalter über der Bank, Wartesaal links
  b.rect(200,56,34,20,P.m1); b.rect(202,60,30,14,P.k2); b.rect(203,61,28,7,P.c1); b.hl(203,230,61,P.c3); b.rect(212,70,10,4,P.w2); b.hl(200,233,75,P.s5); WINS.push([203,61,28,7,0.95]);
  b.rect(200,48,34,7,P.b0); b.hl(200,233,48,P.b2); M.microText(b,'BLAGAJNA',201,49,P.s6);
  b.rect(4,54,40,7,P.b0); b.hl(4,43,54,P.b2); M.microText(b,'ČEKAONICA',6,55,P.s6); }
function canopy(b){ var x, y;
  for (y=CAN.y0;y<CAN.y1;y++) for (x=CAN.x0;x<CAN.x1;x++){ var c=(y===CAN.y0)?P.s5:((y===CAN.y1-1)?P.m1:((y===CAN.y0+1)?P.s4:P.s3)); b.px(x,y,c); }
  for (x=CAN.x0;x<CAN.x1;x++){ b.px(x,CAN.y1,P.m0); dk(b,x,CAN.y1+1,1); }
  var sg='AUTOBUSNA STANICA', sw=M.textWidth(sg); M.text(b,sg,rd((CAN.x0+CAN.x1)/2-sw/2),CAN.y0+1,P.b0); LABEL=[rd((CAN.x0+CAN.x1)/2-sw/2),CAN.y0+1];
  [[24,'1'],[148,'2']].forEach(function(n){ b.rect(n[0]-5,CAN.y1+2,11,8,P.b1); b.hl(n[0]-5,n[0]+5,CAN.y1+2,P.b2); b.hl(n[0]-5,n[0]+5,CAN.y1+9,P.k2); M.text(b,n[1],n[0]-1,CAN.y1+2,P.s6); });
  CAN.cols.forEach(function(cx){ for (y=CAN.y1;y<BUS.base;y++){ var t=(y-CAN.y1)/(BUS.base-CAN.y1), hw=rd(lerp(3,1,t)); for (x=cx-hw;x<=cx+hw;x++) b.px(x,y,(x===cx-hw)?P.s4:((x===cx+hw)?P.m1:P.s2)); } b.rect(cx-2,BUS.base-2,5,2,P.m1); });
  [44,104,170,214].forEach(function(x){ b.hl(x-9,x+9,CAN.y1+11,P.s5); b.hl(x-9,x+9,CAN.y1+12,P.m2); b.vl(x-7,CAN.y1+2,CAN.y1+10,P.m1); b.vl(x+7,CAN.y1+2,CAN.y1+10,P.m1); }); }
var LABEL=[60,31];

// ---------------------------------------------------------------- Reisebus (weiß-blau), Front mit Leuchtschild, Seite nach rechts hinten
var BUSLED=[44,51,54,5], BUSLIGHTS=[], WIPER=[];
function busSign(S){ return (S && S.busTo==='sarajevo')?'MOSTAR - SARAJEVO':((S && S.busTo==='split')?'SPLIT':''); }
function paintBus(b,S){ var x0=BUS.x0, x1=BUS.x1, top=BUS.top, by=BUS.base, w=x1-x0, sd=BUS.side, x, y;
  b.poly([[x1,top+2],[x1+sd,top-5],[x1+sd,by-12],[x1,by-2]],function(xx,yy){ var u=(xx-x1)/sd, d=yy-(top+2-u*7), c=P.s5;
    if (d>3 && d<19) c=(((xx-x1)%5)<1)?P.s4:P.c1; if (d>=19 && d<23) c=P.b1; if (d>=23 && d<26) c=P.s6; if (d>=26 && d<38 && u>0.08 && u<0.92) c=((xx-x1)%5===2)?P.s4:P.s5; if (d>=38) c=P.m2; return c; });
  // Tür vorn rechts (offen, Stufen)
  b.poly([[x1+1,top+4],[x1+5,top+2],[x1+5,by-4],[x1+1,by-2]],P.k1); for (y=by-12;y<by-2;y+=3) b.line(x1+1,y,x1+5,y-1,P.m2);
  b.rect(x0,top,w,by-top,P.s5); b.hl(x0+1,x1-2,top,P.s6); b.vl(x0,top+1,by-1,P.s4); b.vl(x1-1,top+1,by-1,P.s3);
  b.rect(x0+3,top+2,w-6,8,P.k1); b.hl(x0+3,x1-4,top+2,P.k0); BUSLED=[x0+4,top+3,w-8,5];
  var wy0=top+12, wy1=top+37; for (y=wy0;y<wy1;y++) for (x=x0+2;x<x1-2;x++){ var c=(y<wy0+3)?P.k2:P.c0, rf=((x-x0)*0.7+y)%19; if (rf<2) c=P.c3; else if (rf<3 && bayer(x,y)<0.5) c=P.c2; if (y>wy1-7) c=P.k2; b.px(x,y,c); }
  b.vl(x0+(w>>1),wy0,wy1-1,P.k1); b.hl(x0+2,x1-3,wy0,P.k1);
  for (var sI=0;sI<4;sI++){ var sx=x0+5+sI*13; b.rect(sx,wy1-6,8,4,P.c1); b.hl(sx,sx+7,wy1-6,P.c2); }
  b.line(x0+6,wy1-1,x0+19,wy1-7,P.k1); b.line(x0+(w>>1)+3,wy1-1,x0+(w>>1)+16,wy1-7,P.k1); WIPER=[x0+6,wy1-1,x0+(w>>1)+3];
  b.line(x0,top+7,x0-5,top+3,P.k1); b.rect(x0-8,top+3,4,9,P.k1); b.vl(x0-7,top+4,top+10,P.m2); b.line(x1-1,top+7,x1+4,top+3,P.k1); b.rect(x1+3,top+3,4,9,P.k1); b.vl(x1+4,top+4,top+10,P.m2);
  b.rect(x0+1,wy1+1,w-2,3,P.b1); b.hl(x0+1,x1-2,wy1+1,P.b2); b.rect(x0+1,wy1+4,w-2,1,P.b3);
  b.rect(x0+14,wy1+7,w-28,6,P.m1); for (x=x0+15;x<x1-14;x+=2) b.vl(x,wy1+8,wy1+11,P.k2);
  BUSLIGHTS=[[x0+3,wy1+7],[x0+7,wy1+7],[x1-11,wy1+7],[x1-7,wy1+7]]; BUSLIGHTS.forEach(function(q){ b.rect(q[0],q[1],4,3,P.s6); b.px(q[0],q[1],P.m3); });
  b.rect(x0,by-5,w,5,P.m2); b.hl(x0,x1-1,by-5,P.m4); b.rect(x0+(w>>1)-9,by-7,18,4,P.s6); b.hl(x0+(w>>1)-8,x0+(w>>1)+7,by-5,P.k2); b.px(x0+(w>>1)-8,by-6,P.b1);
  b.rect(x0+2,by,6,2,P.k1); b.rect(x1-8,by,6,2,P.k1);
  // Gepäck neben dem Bus
  suitcase(b,x1+22,by,7,9,P.r2); suitcase(b,x1+30,by,9,6,P.c2); }
function suitcase(b,x,by,w,h,col){ b.rect(x,by-h,w,h,col); b.vl(x,by-h,by-1,M.UP[col]); b.vl(x+w-1,by-h,by-1,M.DN[col]); b.hl(x,x+w-1,by-h,M.UP[col]); b.hl(x+1,x+w-2,by-h-3,P.k2); b.px(x+1,by-h-2,P.k2); b.px(x+w-2,by-h-2,P.k2); }

// ---------------------------------------------------------------- Abfahrtstafel „POLASCI“ und das Schild „MÜNCHEN · subota“
var DEPS=[['0700','SARAJEVO'],['0915','SPLIT'],['1030','DUBROVNIK'],['1240','ZAGREB'],['1500','STOLAC']];
var TD={0:'##|##|##',1:'.#|.#|.#',2:'##|.#|#.',3:'##|.#|##',4:'#.|##|.#',5:'#.|##|.#',6:'#.|##|##',7:'##|.#|.#',8:'##|##|##',9:'##|##|.#'};
function tinyNum(b,s,x,y,c){ for (var i=0;i<s.length;i++){ var g=TD[s[i]].split('|'); for (var r=0;r<3;r++) for (var q=0;q<2;q++) if (g[r][q]==='#') b.px(x+i*3+(i>1?1:0)+q,y+r,c); } if (s.length>2) b.px(x+6,y+1,c); }
function paintBoard(b,lit){ var x0=BOARD.x0, x1=BOARD.x1, y0=BOARD.y0, y1=BOARD.y1;
  b.vl(x0+6,CAN.y1,y0,P.m1); b.vl(x1-7,CAN.y1,y0,P.m1);
  b.rect(x0,y0,x1-x0,y1-y0,P.k1); b.rect(x0+1,y0+1,x1-x0-2,y1-y0-2,P.k2); b.hl(x0,x1-1,y0,P.m2); b.hl(x0,x1-1,y1-1,P.k0);
  M.microText(b,'POLASCI',x0+16,y0+2,lit?P.s6:P.s4); b.hl(x0+2,x1-3,y0+8,P.m1);
  DEPS.forEach(function(r,i){ var yy=y0+10+i*5; tinyNum(b,r[0],x0+3,yy+1,lit?P.y4:P.y3); M.microText(b,r[1],x0+15,yy,lit?P.s5:P.s4); });
  // Emailleschild darunter: weiß, blauer Rand, gut lesbar
  var m=MUC; b.vl(rd((m.x0+m.x1)/2)-20,y1,m.y0,P.m1); b.vl(rd((m.x0+m.x1)/2)+20,y1,m.y0,P.m1);
  b.rect(m.x0,m.y0,m.x1-m.x0,m.y1-m.y0,P.b0); b.rect(m.x0+1,m.y0+1,m.x1-m.x0-2,m.y1-m.y0-2,P.s6); b.hl(m.x0+1,m.x1-2,m.y1-2,P.s4);
  var t='MÜNCHEN · subota', tw=M.textWidth(t); M.text(b,t,rd((m.x0+m.x1)/2-tw/2),m.y0+3,P.b0); }

// ---------------------------------------------------------------- Kiosk (Rückwand im Bild, Front als Ebene) und Drehständer mit Stadtplänen
function kioskBack(b){ var x0=KIO.x0, x1=KIO.x1, x, y;
  b.rect(x0,KIO.top+8,x1-x0,KIO.base-KIO.top-8,P.g1);
  for (y=KIO.win0;y<KIO.sill;y++) for (x=x0+3;x<x1-3;x++) b.px(x,y,P.w0);
  var cols=[P.r2,P.y3,P.b2,P.s5,P.g3,P.r3,P.c3,P.e3,P.s6]; for (var s=0;s<3;s++){ var sy=KIO.win0+3+s*8; b.hl(x0+4,x1-5,sy+6,P.w2); for (x=x0+5;x<x1-5;x+=3) { var c=cols[(x*3+s*5)%cols.length]; b.rect(x,sy,2,6,c); b.px(x,sy,M.UP[c]); } }
  // Postkarten an der Seitenwand: Brücke, Fluss, Berg
  for (var k=0;k<6;k++){ var px=x0+4+(k%3)*12, py=KIO.win0+26-(k>2?0:0)+Math.floor(k/3)*0; if (k>2) continue; b.rect(px,py,9,6,P.s6); b.rect(px+1,py+1,7,3,P.b3); b.hl(px+1,px+7,py+4,P.a4); b.px(px+3,py+2,P.s5); b.px(px+4,py+2,P.s5); b.px(px+5,py+3,P.s5); } }
function rack(b){ var x0=RACK.x0, x1=RACK.x1, top=RACK.top, by=RACK.base, cx=rd((x0+x1)/2), x, y;
  b.vl(cx,top-6,by-1,P.m2); b.rect(cx-4,by-2,9,2,P.m1); b.hl(cx-3,cx+3,top-6,P.m3);
  var cs=[[P.b2,P.y3],[P.g3,P.s6],[P.r3,P.s5],[P.y3,P.b1],[P.c3,P.s6],[P.e3,P.r2]];
  for (var r=0;r<4;r++){ var ry=top-4+r*9; b.hl(x0,x1-1,ry+8,P.m2); for (var i=0;i<4;i++){ var px=x0+i*5, q=cs[(r*4+i)%cs.length]; b.rect(px,ry,4,8,q[0]); b.hl(px,px+3,ry,M.UP[q[0]]); b.rect(px+1,ry+2,2,2,q[1]); b.px(px+3,ry+6,P.k2); } }
  b.rect(x0-1,top-14,x1-x0+2,7,P.s6); b.hl(x0-1,x1,top-14,P.r2); M.microText(b,'PLAN',x0+2,top-13,P.k1); }

// ---------------------------------------------------------------- Bahnhof: Flachdach, hohe Fenster, Uhr; Taxistand
var GLASS=new Uint8Array(W*H);
function station(b,tod){ var x0=STA.x0, x1=STA.x1, x, y;
  for (x=x0;x<x1;x++){ for (y=STA.roof;y<STA.fl;y++) b.px(x,y,(y===STA.roof)?P.s6:((y===STA.fl-1)?P.m1:P.s4));
    for (y=STA.fl;y<GY;y++){ var u=x-x0, m=u%14, c;
      if (y>=GY-6) c=(y===GY-6)?P.s4:P.m2;
      else if (y<STA.fl+8) c=(hash(u>>3,1)<0.5)?P.s4:P.s5;
      else if (m<3) c=(m===0)?P.s3:P.s5;
      else { GLASS[y*W+x]=1; var rf=((x*0.5+y)%29); c=(rf<2)?P.b4:(y<STA.fl+28?P.b2:P.c2); if (tod!=='day') c=P.c1; if (((y-STA.fl-8)%20)===0) c=P.s5; }
      b.px(x,y,c); } }
  for (x=x0;x<x1;x++){ dk(b,x,STA.fl,2); dk(b,x,STA.fl+1,1); }
  var t='ŽELJEZNIČKA STANICA', tw=M.textWidth(t); M.text(b,t,rd(x0+(x1-x0)/2+12-tw/2),STA.fl+1,P.b0); STLABEL=[rd(x0+(x1-x0)/2+12-tw/2),STA.fl+1];
  // Eingang mit Vordach
  var ex=438; b.rect(ex,70,24,GY-6-70,P.k2); for (y=71;y<GY-6;y++) for (x=ex+1;x<ex+23;x++){ GLASS[y*W+x]=2; b.px(x,y,((x-ex)%6===0)?P.m1:P.c0); } b.hl(ex-4,ex+27,68,P.s5); b.hl(ex-4,ex+27,69,P.m1);
  // Uhr an der Fassade
  var cx=CLK.cx, cy=CLK.cy, r=CLK.r; for (y=cy-r-2;y<=cy+r+2;y++) for (x=cx-r-2;x<=cx+r+2;x++) GLASS[y*W+x]=0;
  b.ellipse(cx+0.5,cy+0.5,r+1.5,r+1.5,P.m0); b.ellipse(cx+0.5,cy+0.5,r,r,P.s6); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(rd(cx+Math.cos(a)*(r-1.5)),rd(cy+Math.sin(a)*(r-1.5)),P.k1); }
  b.vl(cx,cy+r+2,cy+r+5,P.m1); }
var STLABEL=[360,31];
var TAXISIGN=[0,0], TAXIWIN=[0,0,0,0];
function paintTaxi(b){ var x0=TAXI.x0, by=TAXI.base, L=46, x, y;
  var prof=[[0,10],[3,11],[10,12],[13,12],[14,17],[17,21],[30,21],[34,16],[36,13],[44,12],[46,10]];
  function topAt(u){ for (var i=0;i<prof.length-1;i++){ var a=prof[i], c=prof[i+1]; if (u>=a[0] && u<=c[0]) return lerp(a[1],c[1],(u-a[0])/Math.max(1,c[0]-a[0])); } return 10; }
  for (x=x0;x<x0+L;x++){ var u=x-x0, ht=rd(topAt(u)); for (y=by-ht;y<by-2;y++){ var d=y-(by-ht), c=P.s5;
      if (u>=14 && u<=33 && y<by-12 && d>0){ c=(u===23||u===24)?P.s4:((d<2)?P.c2:P.c1); if (((u*0.7+y)%13)<1.3) c=P.c3; }
      else if (d===0) c=P.s6; else if (y===by-8) c=P.m4; else if (y>by-5) c=P.s3;
      if (u<1 || u>L-2) c=P.s3; b.px(x,y,c); } }
  [[x0+8,by-2],[x0+37,by-2]].forEach(function(wh){ b.ellipse(wh[0],wh[1],4,4,P.k1); b.ellipse(wh[0],wh[1],2,2,P.m3); b.px(wh[0],wh[1],P.m1); });
  b.rect(x0,by-9,2,2,P.y3); b.rect(x0+L-2,by-9,2,2,P.r3); b.hl(x0-1,x0+3,by-5,P.m4); b.hl(x0+L-3,x0+L,by-5,P.m4); b.rect(x0+2,by-11,6,2,P.m3);   // Stern-Grill nur angedeutet
  b.rect(x0+18,by-25,11,4,P.y3); b.hl(x0+18,x0+28,by-25,P.y4); M.microText(b,'TAXI',x0+18,by-25,P.k1); b.hl(x0+20,x0+26,by-21,P.k2);
  for (x=x0+2;x<x0+L-2;x++) if (bayer(x,by)<0.8) dk(b,x,by,2);
  TAXISIGN=[x0+18,by-25]; TAXIWIN=[x0+14,by-20,6,8]; }

// ---------------------------------------------------------------- Boden: Bussteige (Asphalt), Bordstein, Vorplatz aus Betonplatten, Pfützen
function slab(x,y,wet){ var row=Math.floor((y-GY)/5+((y-GY)>20?0.5:0)), off=(row&1)*9, sw=18+((y-GY)>20?6:0), col=Math.floor((x+off)/sw), fx=(x+off)-col*sw, fy=(y-GY)%5;
  if (fy===0 || fx<1) return wet?P.m1:P.s1; var t=hash(col,row), c=t<0.3?P.s2:(t<0.85?P.s3:P.s4); if (fy===1 && fx>2) c=M.UP[c]; if (hash(x>>1,y>>1)<0.03) c=M.DN[c]; if (wet) c=M.DN[c]; return c; }
function asphalt(x,y,wet){ var c=(hash(x>>1,y>>1)<0.5)?P.m1:P.m2; if (hash(x,y)<0.05) c=P.m3; if (fbm(x*0.05,y*0.3,3)>0.66) c=M.DN[c]; if (wet) c=M.DN[c]; return c; }
function ground(b,w,S){ var x, y, wet=(w==='rain');
  for (y=GY;y<H;y++) for (x=0;x<W;x++){ var c; if (x<CAN.x1+4 && y<BUS.base) c=asphalt(x,y,wet); else if (x>=STA.x0 && y<TAXI.base+2) c=asphalt(x,y,wet); else c=slab(x,y,wet); b.px(x,y,c); PAVE[y*W+x]=1; }
  for (x=0;x<CAN.x1+4;x++){ b.px(x,BUS.base,P.s5); b.px(x,BUS.base+1,P.s3); b.px(x,BUS.base+2,P.m1); if ((x>>2)%2===0) b.px(x,BUS.base-2,P.y3); }
  for (x=STA.x0;x<W;x++){ b.px(x,TAXI.base+2,P.s5); b.px(x,TAXI.base+3,P.s2); }
  [[24,1],[128,1]].forEach(function(q){ for (y=GY+1;y<BUS.base-2;y++){ var xx=q[0]+rd((y-GY)*0.8); b.px(xx,y,P.s4); } });
  if (!S.busIn){ b.ellipse(72,108,14,2.2,function(xx,yy){ return hash(xx,yy)<0.6?P.k1:P.m0; }); b.px(66,108,P.v2); b.px(78,107,P.a3); }   // Ölfleck auf dem leeren Steig
  // Pfützen: spiegeln später den Himmel
  for (y=GY+2;y<H;y++) for (x=0;x<W;x++){ if (inPud(x,y)) b.px(x,y,P.m1); }
  for (x=0;x<W;x++){ dk(b,x,GY,2); if (bayer(x,GY+1)<0.6) dk(b,x,GY+1,1); }
  b.ellipse(286,128,4,1.4,P.k1); b.hl(283,289,128,P.m1); for (var i=0;i<30;i++){ var gx=Math.floor(hash(i,8)*W), gy=114+Math.floor(hash(i,9)*28); b.px(gx,gy,P.s1); } }
function puddleReflect(b,sky){ var src=b.clone();
  for (var y=GY+2;y<H;y++) for (var x=0;x<W;x++){ var p=inPud(x,y); if (!p) continue; var q=PUD[p-1], my=q[1]-q[3]-1, sy=my-(y-my)*3, c;
    if (sy>=0 && sy<GY) c=src.get(x+((y%2)?1:0),sy); else c=sky.get(x,Math.max(0,Math.min(H-1,40+(y-my)*2)));
    if (c===T) c=P.m2; c=M.DN[c]; if (Math.abs(((x-q[0])/q[2]))>0.85) c=P.m1; b.px(x,y,c); } }

// ---------------------------------------------------------------- Mann mit Schirm (nur gemalt, bei Regen hinten vor dem Bahnhof)
function umbrellaMan(b){ var x=372, by=106; b.rect(x-2,by-14,5,10,P.c1); b.vl(x-2,by-14,by-5,P.c2); b.rect(x-1,by-4,1,4,P.k1); b.rect(x+1,by-4,1,4,P.k1); b.rect(x-1,by-17,3,3,P.p2); b.px(x,by-18,P.h1);
  b.vl(x+1,by-24,by-12,P.k1); b.ellipse(x+1,by-24,8,3,function(xx,yy){ return yy<by-24?P.k2:(((xx-x)&3)===0?P.k1:P.m0); }); b.px(x+1,by-28,P.k1); b.hl(x-7,x+9,by-23,P.k1); }

// ---------------------------------------------------------------- Bild
var BASE=null, LASTB=null, LIT=[];
function paint(S,GS,tod){ var w=weaOf(GS), b=new M.Buf(W,H,T), sky=new M.Buf(W,H,P.k0);
  DEP.fill(0); PAVE.fill(0); GLASS.fill(0); WINS=[];
  stage(b,1,function(){ paintVelez(b,w); });
  stage(b,2,function(){ blocks(b); });
  stage(b,4,function(){ building(b); station(b,tod); });
  stage(b,5,function(){ ground(b,w,S); });
  stage(b,5,function(){ paintTaxi(b); if (S.busIn) paintBus(b,S); canopy(b); paintBoard(b,tod!=='day'); kioskBack(b); rack(b); if (w==='rain') umbrellaMan(b); });
  var hz={rain:[0.7,0.45,0.25,0.1,0.03],grey:[0.55,0.4,0.25,0.1,0],calm:[0.3,0.18,0.08,0.02,0],frost:[0.26,0.15,0.06,0,0],bura:[0.06,0.04,0.02,0,0]}[w];
  var fcol=(w==='rain')?(tod==='day'?P.s3:P.m1):(w==='grey'?P.s4:P.b4); if (tod==='night') fcol=P.n0;
  M.fogBake(b,function(x,y){ var d=DEP[y*W+x]; if (!d) return 0; var a=hz[d-1]; if (w==='rain' && d===1) a=Math.min(1,a+Math.max(0,(46-y)/30)); return a; },{col:fcol});
  if (w==='rain') for (var y2=8;y2<50;y2++) for (var x2=0;x2<W;x2++){ var cv=fbm(x2*0.02,y2*0.09,8); if (DEP[y2*W+x2]===1 && cv>0.5 && bayer(x2,y2)<(cv-0.5)*2.6) b.px(x2,y2,(cv>0.62)?P.s4:P.m3); }
  paintSky(sky,tod,w); SKYM.fill(0); for (var q=0;q<W*H;q++) if (b.d[q]===T){ b.d[q]=sky.d[q]; SKYM[q]=1; }
  puddleReflect(b,sky);
  if (w==='rain') wetReflect(b);
  M.light(b,M.lf.sum(M.lf.band(118,H,0,-0.35),M.lf.pool((BUS.x0+BUS.x1)/2+6,BUS.base+1,36,3,S.busIn?-1.1:0),M.lf.pool((KIO.x0+KIO.x1)/2,KIO.base+1,22,3,-0.9),M.lf.pool(TAXI.x0+23,TAXI.base+1,26,3,-1)),0,0,function(x,y){ return !SKYM[y*W+x]; });
  M.light(b,M.lf.k(-0.55),0,0,function(x,y){ return x<CAN.x1+3 && y>CAN.y1 && y<BUS.base+6 && !SKYM[y*W+x] && DEP[y*W+x]>=4; });
  BASE=b.clone(); LIT=lightsFor(tod);
  shade(b,0,0,todKey(tod,w),LIT,function(x,y){ return SKYM[y*W+x]===1; });
  if (tod!=='day') afterLights(b,tod,S);
  LASTB=b; return b; }
function wetReflect(b){ var src=b.clone(); for (var y=GY+2;y<H;y++){ var d=y-GY, k=0.5-d/70, sy=GY-1-Math.floor(d*0.9); if (k<=0.04||sy<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (!PAVE[i]||inPud(x,y)) continue; var pud=fbm(x*0.07,y*0.3,4); if (pud<0.55) continue; var sc=src.d[sy*W+x]; if (bayer(x,y)<k*(pud-0.45)*2.2) b.d[i]=M.DN[sc]; } } }
function afterLights(b,tod,S){ var x, y;
  for (y=0;y<H;y++) for (x=STA.x0;x<W;x++){ var g=GLASS[y*W+x]; if (!g) continue; var lv=(g===2)?0.7:0.5-(y-STA.fl)/150; b.px(x,y,bayer(x,y)<lv?P.y3:(bayer(x,y)<lv+0.25?P.y2:P.y1)); }
  WINS.forEach(function(wn){ if (wn[4]<0.7) return; b.rect(wn[0],wn[1],wn[2],wn[3],wn[4]<0.85?P.y3:P.y4); });
  for (y=KIO.win0;y<KIO.sill;y++) for (x=KIO.x0+3;x<KIO.x1-3;x++) b.px(x,y,M.tintPx(levels('night')[4],BASE.get(x,y),x,y));
  [44,104,170,214].forEach(function(xx){ b.hl(xx-9,xx+9,CAN.y1+11,P.l1); b.hl(xx-8,xx+8,CAN.y1+12,P.n5); });
  paintBoard(b,true); if (S.busIn) BUSLIGHTS.forEach(function(q){ b.rect(q[0],q[1],4,3,P.y5); b.px(q[0]+1,q[1]+1,P.l1); });
  b.rect(TAXISIGN[0],TAXISIGN[1],11,4,P.y4); M.microText(b,'TAXI',TAXISIGN[0],TAXISIGN[1],P.k1);
  M.text(b,'ŽELJEZNIČKA STANICA',STLABEL[0],STLABEL[1],P.b2);
  b.ellipse(CLK.cx+0.5,CLK.cy+0.5,CLK.r,CLK.r,P.s6); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(rd(CLK.cx+Math.cos(a)*(CLK.r-1.5)),rd(CLK.cy+Math.sin(a)*(CLK.r-1.5)),P.k1); } }

// ---------------------------------------------------------------- Ebenen: Kioskfront (verdeckt die Kioskfrau), Bank
function finishL(L,tod,w){ shade(L,L.ox,L.oy,todKey(tod,w),LIT); }
function kioskLayer(S,tod,w){ var x0=KIO.x0, x1=KIO.x1, by=KIO.base, L=M.layer(x0-3,KIO.top-3,x1-x0+6,KIOSKM_Y-KIO.top+6,KIOSKM_Y+1), wr=M.lw(L), x;
  wr.rect(x0-3,KIO.top,x1-x0+6,8,P.r1); wr.hl(x0-3,x1+2,KIO.top,P.r3); wr.hl(x0-3,x1+2,KIO.top+7,P.k2); wr.hl(x0-2,x1+1,KIO.top-1,P.m3);
  var t='RAZGLEDNICE', tw=M.microWidth(t); M.microText(L,t,rd((x0+x1)/2-tw/2)-L.ox,KIO.top+2-L.oy,P.s6);
  wr.rect(x0,KIO.top+8,3,by-KIO.top-8,P.g2); wr.vl(x0,KIO.top+8,by-1,P.g3); wr.rect(x1-3,KIO.top+8,3,by-KIO.top-8,P.g1); wr.vl(x1-1,KIO.top+8,by-1,P.g0);
  wr.rect(x0,KIO.sill,x1-x0,2,P.w3); wr.hl(x0,x1-1,KIO.sill,P.w4);
  wr.rect(x0+1,KIO.sill+2,x1-x0-2,KIOSKM_Y+3-KIO.sill-2,P.g2); wr.hl(x0+1,x1-2,KIO.sill+2,P.g1);
  var sx=x0+1; wr.rect(sx,KIO.sill+3,x1-x0-2,17,P.s6); wr.hl(sx,x1-2,KIO.sill+3,P.r2); wr.hl(sx,x1-2,KIO.sill+19,P.s3);
  M.microText(L,'NOVINE',sx+8-L.ox,KIO.sill+5-L.oy,P.k1); M.microText(L,'PLAN GRADA',sx+1-L.ox,KIO.sill+12-L.oy,P.b0);
  // Zeitungen in der Klammerleiste
  for (x=x0+2;x<x1-2;x+=7){ wr.rect(x,KIO.win0-1,5,7,P.s5); wr.hl(x,x+4,KIO.win0,P.r2); wr.hl(x,x+4,KIO.win0+3,P.m2); }
  if (w==='rain') for (x=x0-3;x<x1+3;x++) if (hash(x,5)<0.35) wr.px(x,KIO.top+8,P.m3);
  finishL(L,tod,w);
  if (LASTB) for (var y=by;y<KIOSKM_Y+3;y++) for (x=x0-3;x<x1+3;x++) wr.px(x,y,LASTB.get(x,y));
  return L; }
function benchLayer(S,tod,w){ var bx0=BENCH.x0, bx1=BENCH.x1, s=BENCH.seat, by=BENCH.base, L=M.layer(bx0-2,s-14,bx1-bx0+4,by-s+16,by), wr=M.lw(L);
  for (var k=0;k<2;k++){ var yy=s-11+k*4; wr.rect(bx0,yy,bx1-bx0,3,P.b1); wr.hl(bx0,bx1-1,yy,P.b2); wr.hl(bx0,bx1-1,yy+2,P.b0); }
  wr.rect(bx0-1,s,bx1-bx0+2,3,P.b1); wr.hl(bx0-1,bx1,s,P.b3); wr.hl(bx0-1,bx1,s+2,P.b0);
  [bx0+2,bx1-4].forEach(function(lx){ wr.rect(lx,s-12,2,by-s+12,P.m1); wr.vl(lx,s-12,by-1,P.m2); wr.rect(lx-1,by-1,4,1,P.k2); });
  finishL(L,tod,w); return L; }
function layers(S,GS,tod){ var w=weaOf(GS); return [kioskLayer(S,tod,w),benchLayer(S,tod,w)]; }

// ---------------------------------------------------------------- Bewegung: Leuchtschild, Abgas, Uhr, Regenringe in Pfützen, Scheibenwischer, Tauben
var PIG=[[150,122],[164,128],[236,124],[252,132],[344,124],[362,134]];
function pigeon(fb,x,y,f,t,i,tint){ var peck=Math.sin(t*2.6+i*2.1)>0.45, step=(Math.floor(t*0.9+i*1.3)%5===0)?f:0;
  function px(dx,dy,c){ var X=x+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  px(-3,-3,P.m1); px(-2,-3,P.m3); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m2); px(0,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-2,P.m2); px(3,-1,P.m3); px(4,-1,P.t4); } else { px(2,-3,P.a3); px(2,-4,P.m3); px(3,-5,P.m3); px(2,-5,P.m2); px(4,-4,P.t4); } }
function clockHM(tod,t){ var base=tod==='day'?[12,6]:(tod==='dawn'?[7,12]:[21,40]), m=base[1]+Math.floor(t/60); return [base[0]+Math.floor(m/60),m%60]; }
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, w=weaOf(GS), k=todKey(tod,w), tint=k?levels(k)[0]:null, x, y;
  if (S.busIn){ var led=BUSLED, txt=busSign(S), lx0=led[0]-cam, lit=tod==='day'?P.y3:P.y4, tw=M.microWidth(txt);
    if (txt && lx0>-led[2] && lx0<fb.w){ var off=(tw<=led[2])?Math.floor((led[2]-tw)/2):(led[2]-Math.floor((t*14)%(tw+led[2]))); var tmp={px:function(px,py,c){ if (px<0||px>=led[2]) return; var X=lx0+px; if (X<0||X>=fb.w) return; fb.px(X,led[1]+py,c); }}; M.microText(tmp,txt,off,0,lit); }
    for (var i=0;i<9;i++){ var ph=(t*0.35+i/9)%1, ex=rd(BUS.x1+BUS.side+2+ph*14+Math.sin(t+i)*2)-cam, ey=rd(BUS.base-10-ph*18); if (ex<0||ex>=fb.w-1) continue; if (bayer(ex,ey)<0.7-ph*0.6){ fb.px(ex,ey,tod==='day'?P.s4:P.m2); if (bayer(ex+1,ey)<0.5-ph*0.4) fb.px(ex+1,ey,tod==='day'?P.s5:P.m3); } } }
  // Bahnhofsuhr
  var hm=clockHM(tod,t), cx=CLK.cx-cam, cy=CLK.cy; if (cx>-12 && cx<fb.w+12){ var ha=((hm[0]%12)+hm[1]/60)/12*Math.PI*2-Math.PI/2, ma=hm[1]/60*Math.PI*2-Math.PI/2;
    for (var q=0;q<=12;q++){ var u=q/2, mx=rd(cx+Math.cos(ma)*u), my=rd(cy+Math.sin(ma)*u); if (u<=CLK.r-2 && mx>=0&&mx<fb.w) fb.px(mx,my,P.k0); var hx=rd(cx+Math.cos(ha)*u), hy=rd(cy+Math.sin(ha)*u); if (u<=CLK.r-4 && hx>=0&&hx<fb.w) fb.px(hx,hy,P.k0); }
    var sa=(t%60)/60*Math.PI*2-Math.PI/2; for (var s2=0;s2<CLK.r-1;s2++){ var sx=rd(cx+Math.cos(sa)*s2), sy=rd(cy+Math.sin(sa)*s2); if (sx>=0&&sx<fb.w) fb.px(sx,sy,P.r3); } }
  // Regen: Ringe in den Pfützen, Scheibenwischer am Taxi und am Bus
  if (w==='rain'){ for (var j=0;j<PUD.length;j++){ var p=PUD[j]; for (var r=0;r<3;r++){ var ph2=(t*0.9+r*0.33+j*0.21)%1, rx=p[0]+(hash(j,Math.floor(t*0.9+r*0.33+j*0.21))-0.5)*p[2]*1.2, ry=p[1]+(hash(Math.floor(t*0.9+r*0.33),j)-0.5)*p[3], rr=1+ph2*4;
        for (var a2=0;a2<16;a2++){ var an=a2/16*Math.PI*2, X=rd(rx+Math.cos(an)*rr)-cam, Y=rd(ry+Math.sin(an)*rr*0.35); if (X<0||X>=fb.w||Y<0||Y>=144) continue; if (!inPud(X+cam,Y)) continue; if (ph2<0.8) fb.px(X,Y,P.m3); } } }
    var wa=Math.sin(t*3.2)*0.9, tx=TAXIWIN[0]-cam+3, ty=TAXIWIN[1]+7; if (tx>-10 && tx<fb.w+10) for (var q2=0;q2<7;q2++){ var X2=rd(tx+Math.sin(wa)*q2), Y2=rd(ty-Math.cos(wa)*q2); if (X2>=0&&X2<fb.w) fb.px(X2,Y2,P.k1); }
    if (S.busIn){ var ba=-0.9+Math.abs(Math.sin(t*2.6))*1.3; for (var wi=0;wi<2;wi++){ var bx=(wi?WIPER[2]:WIPER[0])-cam, by=WIPER[1]; for (var q3=0;q3<13;q3++){ var X3=rd(bx+Math.cos(ba)*q3), Y3=rd(by-Math.sin(ba+0.9)*q3*0.5); if (X3>=0&&X3<fb.w) fb.px(X3,Y3,P.k1); } } } }
  if (tod!=='night') PIG.forEach(function(p,i){ var px=p[0]+rd(Math.sin(t*0.33+i*1.7)*4)-cam; if (px<-6||px>fb.w+6) return; if (w==='rain' && i%2) return; pigeon(fb,px,p[1],(Math.sin(t*0.21+i)>0)?1:-1,t,i,tint); });
  if (tod!=='day'){ var kx=KIO.x0+6-cam, fl=(Math.sin(t*17.3)+Math.sin(t*5.1+2))>1.6; if (kx>-40 && kx<fb.w){ for (x=kx;x<kx+28;x++) if (x>=0&&x<fb.w) fb.px(x,KIO.win0+1,fl?P.n4:P.l1); } }
  if (w==='bura'){ M.scn.buraDebris(fb,t,112,140,cam); } }
function front(fb,v,S,GS){ var w=weaOf(GS), tod=v.tod;
  if (w==='rain') M.rain(fb,v.t,{n:90,col:tod==='day'?P.m3:P.n2,col2:tod==='day'?P.m4:P.n3,mask:function(x,y){ return !(x+v.cam<CAN.x1 && y>CAN.y1 && y<BUS.base); }}); }
// Geistersicht: die Pfützen spiegeln kalt
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam; for (var y=GY+2;y<H;y++) for (var x=0;x<320;x++){ var X=x+cam, p=inPud(X,y); if (!p) continue; var q=PUD[p-1], e=Math.abs((X-q[0])/q[2]);
    if (bayer(x,y+Math.floor(t*3))<0.32+0.2*Math.sin(t*0.8+X*0.1)) fb.d[y*320+x]=(e>0.7)?P.x2:(hash(X,y)<0.2?P.x5:P.x3); } }

// ---------------------------------------------------------------- Lauffläche
function WALK(x,y){ if (y<112||y>140||x<6||x>474) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.base+2) return false;
  if (x>=KIO.x0-2 && x<=KIO.x1+2 && y<KIOSKM_Y+4) return false;
  if (x>=RACK.x0-1 && x<=RACK.x1+1 && y<RACK.base+3) return false;
  return true; }
M.defineArt('ostbus',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,weaOf(GS)); if (!k) return null; return levels(k)[tod==='day'?0:1].a; },
  spots:{
    exit:[0,96,10,48],
    bus:[BUS.x0-8,BUS.top-4,BUS.x1-BUS.x0+BUS.side+10,BUS.base-BUS.top+6],
    board:[BOARD.x0,BOARD.y0,BOARD.x1-BOARD.x0,MUC.y1-BOARD.y0],
    kiosk:[KIO.x0-3,KIO.top-1,KIO.x1-KIO.x0+6,KIO.base-KIO.top+2],
    maps:[RACK.x0-2,RACK.top-15,RACK.x1-RACK.x0+4,RACK.base-RACK.top+15],
    taxi:[TAXI.x0-1,TAXI.base-27,48,29],
    bench:[BENCH.x0-1,BENCH.seat-12,BENCH.x1-BENCH.x0+2,BENCH.base-BENCH.seat+12],
    station:[STA.x0,STA.roof-1,STA.x1-STA.x0,GY-STA.roof+1],
    puddle:[PUD[0][0]-PUD[0][2],PUD[0][1]-PUD[0][3]-1,PUD[0][2]*2,PUD[0][3]*2+3],
    clock:[CLK.cx-CLK.r-2,CLK.cy-CLK.r-2,CLK.r*2+5,CLK.r*2+5]
  },
  stands:{ exit:[8,124,'L'], bus:[96,118,'B'], board:[160,116,'B'], kiosk:[273,118,'B'], maps:[308,118,'B'], taxi:[402,118,'R'], bench:[213,121,'B'], station:[450,116,'B'], puddle:[300,126,'R'], clock:[350,116,'B'] },
  actorPos:{ kioskm:[273,KIOSKM_Y,'F'], taxist:[404,118,'L'], nada:[BUS.x1+8,114,'R'] },
  start:[BUS.x1+18,118,'R'], entries:{ map:[14,124,'R'] }
});
})(M);
