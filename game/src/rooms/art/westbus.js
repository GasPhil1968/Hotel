/* ===== rooms/art/westbus.js — Westbusbahnhof mit Café „Zdravko“ (400 px, scrollend) =====
   Ein kleiner, neuerer Busbahnhof am Westufer: rechts der Bussteig unter einem Wellblechdach auf Stahlstützen, eine Bank, ein
   Fahrplan im Glaskasten, eine Anzeige „POLASCI“; dahinter die Busbucht und Wohnblöcke. Links das Café „Zdravko“, ein Pavillon
   der 1980er: großes Fenster mit Alurahmen (drinnen der Fenstertisch mit Stuhl, Tasse und Aschenbecher, hinten Theke und Flaschen),
   eine Glastür, ein Schild. Mit S.munich steht der Reisebus aus München in der Bucht (Kopf rechts, Türseite zu uns), Zielanzeige
   „MÜNCHEN – MOSTAR“, die Gepäckklappe ist offen, Koffer im Bauch, einer auf dem Bussteig. Keine echten Marken. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, GY=104;                                      // Fuß der Busbucht hinten
var CAFE={x0:12,x1:148,top:54,base:112};
var WIN={x0:24,x1:94,y0:66,y1:102};
var DOOR={x0:104,x1:126,y0:62,y1:112};
var CAN={x0:150,x1:W,y0:20,y1:34,posts:[168,262,356]};       // Wellblechdach
var EDGE=110;                                                  // Bussteigkante
var BUS={x0:176,x1:394,top:44,base:107};                       // Reisebus, Kopf rechts
var HATCH={x0:248,x1:300};
var BENCH={x0:186,x1:224,by:117};
var CASE={x:264,y0:62,y1:86};                                  // Fahrplan am Pfosten
var BOARD={x0:290,x1:330,y0:36,y1:48};                         // Anzeige unter dem Dach

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
var HZL={}, HZN=null;
function hazeLut(col,k){ var key=col+'_'+k; if (HZL[key]) return HZL[key]; if (!HZN) HZN=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); var q=M.RGB[col], f=k/8;
  return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZN); }
// Dunst: zur Dunstfarbe hin mischen, Ergebnis nur aus Landschaftsfarben (sonst wird Kalk im Blau violett)
function haze(b,amt,col){ for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=hazeLut(col,i)[c]; } }
var REG=new Uint8Array(W*H), RG={sky:0,far:1,bldg:2,glass:3,road:4,walk:5,bus:6,prop:7,lit:8};
function RW(b){ var o={g:0};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.w=W; o.h=H; return o; }
function dk(w,x,y,n){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,-(n||1))); }
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D','Ü':'U'};
function sign(w,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(w,base,cx,y,c); var wd=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') w.px(cx+1,y-1,c); else if (ch==='Ć') w.px(cx+2,y-1,c); else if (ch==='Ü'){ w.px(cx,y-2,c); w.px(cx+2,y-2,c); } cx+=wd+1; }); return cx; }

// ---------------------------------------------------------------- Himmel, Ferne
function paintSky(b,tod,we){ var x, y, h=GY;
  if (we==='grey' && tod==='day'){ var GR=R('m2 m3 m4 s4'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(GR,0.28+y/h*0.5+(fbm(x*0.7,y*2.4,30,8)-0.5)*0.35,x,y)); return; }
  if (we==='rain'){ M.scn.sky(b,0,0,W,h,tod,we,73); return; }
  if (tod==='day'){ var bura=we==='bura', D=bura?R('b0 b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<h;y++){ var v=(bura?0.05:0.18)+Math.pow(y/80,1.3)*(bura?0.86:0.78); for (x=0;x<W;x++) b.px(x,y,ra(D,v+(vn(x,y,50,2)-0.5)*0.05,x,y)); }
    var r=M.rng(bura?87:41);
    if (bura){ for (var i=0;i<9;i++){ var cx=r()*W-20, cy=3+r()*24, L=16+r()*44, th=1.5+r()*3;
        for (var k=0;k<L;k++){ var u=k/L; if (fbm(cx+k*1.3,i*9,6,3)<0.4) continue; var hh=th*Math.sin(u*Math.PI)*(0.45+fbm(k*2+cx,i*3,5,5)), xx=rd(cx+k), yt=rd(cy-hh*0.6+u*2.5), yb2=rd(cy+hh*0.4+u*2.5);
          for (var yy=yt;yy<=yb2;yy++){ var q=(yy-yt)/Math.max(1,yb2-yt); if (q>0.8 && bayer(xx,yy)<0.5) continue; b.px(xx,yy,q<0.4?P.b5:(q<0.75?P.b4:P.b3)); } } } }
    else { for (var j=0;j<5;j++){ var cx2=r()*W, cy2=5+r()*20, L2=50+r()*90; for (var k2=0;k2<L2;k2++){ var xx2=rd(cx2+k2), yy2=rd(cy2+Math.sin(k2*0.06+j)*1.3+k2*0.02), a=1-Math.abs(k2/L2-0.5)*2; if (bayer(xx2,yy2)<a*0.45) b.px(xx2,yy2,P.b4); } } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(N,0.08+Math.pow(y/80,1.5)*0.8,x,y)); var r2=M.rng(53); for (var s=0;s<150;s++){ b.px(Math.floor(r2()*W),Math.floor(Math.pow(r2(),1.4)*50),r2()<0.1?P.n5:P.n3); } return; }
  M.sky(b,0,0,W,h,tod,29); }
var LITW=[];
function paintFar(w){ var x, y; w.g=RG.far;
  // der Hum dahinter (ohne Kreuz), davor Wohnblöcke des Westufers mit Loggien und Satellitenschüsseln
  for (x=0;x<W;x++){ var hy=rd(36-16*Math.exp(-Math.pow((x-300)/110,2))+Math.sin(x*0.07)*1.2); for (y=hy;y<GY;y++) w.px(x,y,(fbm(x*1.2,y*1.4,6,12)>0.55)?P.g2:((y===hy)?P.g3:P.e2)); }
  w.g=RG.bldg;
  [[140,196,30,R('s3 s4 s5')],[196,240,42,R('e3 e4 t5')],[238,300,24,R('m2 m3 m4')],[300,352,36,R('s4 s5 s6')],[350,400,18,R('e3 e4 s5')]].forEach(function(bl,i){
    for (y=bl[2];y<GY;y++) for (x=bl[0];x<bl[1];x++){ var fy=(y-bl[2])%7, fx=(x-bl[0])%9, c=bl[3][1]; if (x===bl[0]) c=bl[3][2]; if (x===bl[1]-1) c=bl[3][0];
        if (fy>=2 && fy<=4 && fx>=2 && fx<=6){ c=(fy===2)?P.k1:P.n0; if (fx===4) c=bl[3][0]; if (fy===4 && fx<4 && hash(x,y*i)<0.4) c=P.r3; LITW.push([x,y]); }
        if (fy===5 && fx>=1 && fx<=7) c=bl[3][2]; w.px(x,y,c); }
    for (x=bl[0];x<bl[1];x++){ w.px(x,bl[2]-1,P.s2); w.px(x,bl[2]-2,P.m3); }
    for (var k=0;k<3;k++){ var dx=bl[0]+5+Math.floor(hash(i,k)*(bl[1]-bl[0]-10)), dy=bl[2]+4+Math.floor(hash(k,i)*30); w.ellipse(dx,dy,2,1.6,P.s5); w.px(dx+1,dy+1,P.m2); } }); }

// ---------------------------------------------------------------- Café „Zdravko“: Pavillon, großes Fenster, Glastür, Schild
function inside(x,y,lit){ var c;
  // drinnen: Wand mit Holzpaneel, Theke mit Flaschen hinten, vorn der Fenstertisch mit Stuhl
  if (y<WIN.y0+14) c=lit?P.y2:P.w1; else if (y<WIN.y0+22) c=lit?P.w3:P.w0; else c=lit?P.w2:P.k2;
  if (y>WIN.y0+3 && y<WIN.y0+12 && x>WIN.x0+40 && x<WIN.x0+64){ c=((x+y)%3===0)?(lit?P.g4:P.g1):(((x>>1)%3===0)?(lit?P.y4:P.y1):(lit?P.t3:P.t0)); }   // Flaschenregal
  if (y>=WIN.y0+14 && y<WIN.y0+17 && x>WIN.x0+36) c=lit?P.s4:P.s1;                                                // Theke
  if (x>WIN.x0+2 && x<WIN.x0+5 && y>WIN.y0+2 && y<WIN.y0+9) c=lit?P.s5:P.m1;                                       // Fernseher-Ecke
  return c; }
function paintCafe(w,we,tod){ var c=CAFE, x, y, wet=we==='rain', night=tod!=='day'; w.g=RG.bldg;
  // dahinter ein Wohnblock (oben)
  for (y=14;y<c.top;y++) for (x=c.x0;x<c.x1-8;x++){ var fy=(y-14)%8, fx=(x-c.x0)%11, cc=(fy===0)?P.s3:P.s4; if (fy>=2&&fy<=5&&fx>=3&&fx<=8){ cc=(fy===2)?P.k1:P.n0; LITW.push([x,y]); } if (x===c.x0) cc=P.s5; w.px(x,y,cc); }
  for (x=c.x0;x<c.x1-8;x++){ w.px(x,13,P.s2); w.px(x,12,P.m3); }
  // Pavillon: Fassade aus braunen Keramikplatten, darüber eine Blende mit dem Schild
  for (y=c.top;y<c.base;y++) for (x=c.x0;x<c.x1;x++){ var tx=(x-c.x0)%6, ty=(y-c.top)%6, cc2=(tx===0||ty===0)?P.w1:((hash(x>>2,y>>2)<0.5)?P.w3:P.w2); if (y<c.top+9) cc2=(y===c.top)?P.s5:((y===c.top+8)?P.k2:P.s4); if (wet) cc2=M.DN[cc2]; w.px(x,y,cc2); }
  w.rect(c.x0+14,c.top+2,98,6,P.k2); var tx0=c.x0+16; tx0=sign(w,'CAFFE',tx0,c.top+2,P.r3); sign(w,'ZDRAVKO',tx0+4,c.top+2,P.y4);
  // großes Fenster mit Alurahmen und Spiegelung
  w.g=RG.glass;
  for (y=WIN.y0;y<WIN.y1;y++) for (x=WIN.x0;x<WIN.x1;x++){ var cc3=inside(x,y,false); if (((x-WIN.x0)*0.7+(y-WIN.y0))%29<2.5) cc3=M.UP[M.UP[cc3]]; if ((x-WIN.x0)>=34 && (x-WIN.x0)<36) cc3=P.m3; w.px(x,y,cc3); }
  // der Fenstertisch: Resopalplatte, ein Stuhl mit Lehne zum Fenster, Tasse und Aschenbecher
  var tx=WIN.x0+10, ty=WIN.y1-12; w.rect(tx,ty,20,2,P.s5); w.hl(tx,tx+19,ty+2,P.m2); w.vl(tx+9,ty+3,WIN.y1-1,P.m1); w.vl(tx+10,ty+3,WIN.y1-1,P.m2); w.rect(tx+4,ty-2,3,2,P.s6); w.px(tx+7,ty-1,P.s6); w.ellipse(tx+15,ty-1,2,1,P.m3);
  w.rect(tx+23,ty-8,2,12,P.w1); w.rect(tx+21,ty+3,7,2,P.w2); w.vl(tx+22,ty+5,WIN.y1-1,P.w0); w.vl(tx+27,ty+5,WIN.y1-1,P.w0);
  w.g=RG.bldg;
  for (x=WIN.x0-2;x<WIN.x1+2;x++){ w.px(x,WIN.y0-2,P.m4); w.px(x,WIN.y0-1,P.m2); w.px(x,WIN.y1,P.m3); w.px(x,WIN.y1+1,P.m1); }
  for (y=WIN.y0-2;y<WIN.y1+2;y++){ w.px(WIN.x0-2,y,P.m4); w.px(WIN.x0-1,y,P.m2); w.px(WIN.x1,y,P.m3); w.px(WIN.x1+1,y,P.m1); w.px(WIN.x0+35,y,P.m3); }
  for (y=WIN.y1+2;y<c.base;y++) for (x=WIN.x0-3;x<WIN.x1+3;x++) w.px(x,y,(y===WIN.y1+2)?P.s4:P.s2);
  // Glastür mit Griffstange und Klebezetteln
  var d=DOOR; w.g=RG.glass;
  for (y=d.y0;y<d.y1;y++) for (x=d.x0;x<d.x1;x++){ var cc4=(y<d.y0+20)?P.w1:P.k2; if (((x-d.x0)*0.7+(y-d.y0))%23<2) cc4=M.UP[M.UP[cc4]]; w.px(x,y,cc4); }
  w.g=RG.bldg; for (y=d.y0-2;y<d.y1;y++){ w.px(d.x0-2,y,P.m4); w.px(d.x0-1,y,P.m2); w.px(d.x1,y,P.m3); w.px(d.x1+1,y,P.m1); } w.hl(d.x0-2,d.x1+1,d.y0-2,P.m4); w.hl(d.x0-2,d.x1+1,d.y0-1,P.m2);
  w.hl(d.x0+3,d.x1-4,d.y0+26,P.m4); w.hl(d.x0+3,d.x1-4,d.y0+27,P.m2); w.rect(d.x0+4,d.y0+8,6,4,P.s6); w.rect(d.x0+12,d.y0+9,5,5,P.y3); w.rect(d.x0+5,d.y0+30,8,3,P.s5);
  w.hl(d.x0-3,d.x1+2,d.y1,P.s5); w.hl(d.x0-3,d.x1+2,d.y1+1,P.s2);
  // Standaschenbecher, ein vertrockneter Oleander im Kübel, ein Getränkekasten (ohne Marke)
  w.vl(136,98,111,P.m2); w.ellipse(136,97,3,1.5,P.m3); w.hl(133,139,111,P.m1);
  w.rect(2,100,10,12,P.t2); w.hl(1,12,100,P.t3); for (var k=0;k<20;k++) w.px(3+Math.floor(hash(k,3)*8),98-Math.floor(hash(k,4)*16),hash(k,5)<0.5?P.e2:P.g2);
  w.rect(94,104,9,8,P.r2); w.hl(94,102,104,P.r3); for (x=95;x<102;x+=2) w.px(x,103,P.m4); }

// ---------------------------------------------------------------- Bussteig: Wellblechdach, Stützen, Fahrplan, Anzeige, Bank
function paintStation(w,we,tod){ var x, y, wet=we==='rain', c=CAN; w.g=RG.prop;
  // Stützen (Doppel-T-Träger), unten Beton
  c.posts.forEach(function(px){ for (y=c.y1;y<EDGE;y++){ w.px(px,y,P.m4); w.px(px+1,y,P.m3); w.px(px+2,y,P.m2); w.px(px+3,y,P.m1); } w.rect(px-1,EDGE-4,6,4,P.s3); w.hl(px-1,px+4,EDGE-4,P.s4); });
  // Dach: Blende mit Träger, Untersicht aus Wellblech, Neonröhren
  for (x=c.x0;x<c.x1;x++){ for (y=c.y0;y<c.y0+6;y++) w.px(x,y,(y===c.y0)?P.m4:((y===c.y0+5)?P.m1:P.m3)); for (y=c.y0+6;y<c.y1;y++){ var rib=(x%4)<2; w.px(x,y,rib?P.m2:P.m1); } w.px(x,c.y1,P.k2); }
  for (x=c.x0+16;x<c.x1;x+=58){ w.hl(x,x+22,c.y1-2,P.s5); w.hl(x,x+22,c.y1-1,P.m3); }
  // Fahrplan im Glaskasten am mittleren Pfosten
  var cs=CASE; w.rect(cs.x-13,cs.y0,26,cs.y1-cs.y0,P.m1); w.rect(cs.x-12,cs.y0+1,24,cs.y1-cs.y0-2,P.s6); sign(w,'VOZNI',cs.x-11,cs.y0+2,P.b0); sign(w,'RED',cs.x-11,cs.y0+8,P.b0); for (y=cs.y0+15;y<cs.y1-2;y+=2) for (x=cs.x-11;x<cs.x+11;x++) if (hash(x,y)<0.7 && (x-cs.x+11)%8!==6) w.px(x,y,(x<cs.x-4)?P.k2:P.m2); w.px(cs.x+9,cs.y0+3,P.r3); w.hl(cs.x-12,cs.x+11,cs.y0+1,P.s5);
  // Anzeige unter dem Dach: schwarz, gelbe Punktschrift
  var bd=BOARD; w.vl(bd.x0+6,c.y1,bd.y0,P.m1); w.vl(bd.x1-6,c.y1,bd.y0,P.m1); w.rect(bd.x0,bd.y0,bd.x1-bd.x0,bd.y1-bd.y0,P.k1); w.hl(bd.x0,bd.x1-1,bd.y0,P.m2);
  sign(w,'POLASCI',bd.x0+2,bd.y0+2,P.y3); for (var ln=0;ln<1;ln++) for (x=bd.x0+2;x<bd.x1-2;x++) if (hash(x,ln)<0.6 && (x-bd.x0)%5) w.px(x,bd.y0+9,P.y2);
  // Bank aus Lochblech mit Armlehnen
  var b=BENCH; for (x=b.x0;x<b.x1;x++){ w.px(x,b.by-9,P.w4); w.px(x,b.by-8,P.w2); w.px(x,b.by-7,P.w0); [b.by-20,b.by-16,b.by-12].forEach(function(sy){ w.px(x,sy,P.w4); w.px(x,sy+1,P.w2); }); if ((x-b.x0)%9===0) w.px(x,b.by-8,P.w1); }
  [b.x0+2,b.x1-3].forEach(function(lx){ w.vl(lx,b.by-20,b.by,P.k1); w.vl(lx+1,b.by-20,b.by,P.m1); w.hl(lx-1,lx+2,b.by,P.k2); });
  for (x=b.x0;x<b.x1;x++) if (bayer(x,b.by+1)<0.6) dk(w,x,b.by+1,2); }
function paintBay(w,we){ var x, y, wet=we==='rain'; w.g=RG.road;
  // Busbucht: Asphalt mit gelber Markierung, Ölflecken
  for (y=GY-6;y<EDGE;y++) for (x=CAFE.x1;x<W;x++){ var c=ra(R('m0 m1 m2 s1'),0.45+(fbm(x*0.3,y*1.5,6,5)-0.5)*0.3,x,y); if (y===GY-1 && (x>>3)%2===0) c=P.y3; if (fbm(x*0.4,y,4,9)>0.7) c=P.k2; if (wet){ c=M.DN[c]; if (fbm(x*0.25,y*1.2,5,9)>0.64) c=(bayer(x,y)<0.6)?P.m4:P.m3; } w.px(x,y,c); }
  // Bussteigkante: hoher Bordstein mit gelbem Streifen
  w.g=RG.walk; for (x=CAFE.x1-4;x<W;x++){ w.px(x,EDGE,P.y3); w.px(x,EDGE+1,P.s5); w.px(x,EDGE+2,P.s3); w.px(x,EDGE+3,P.s2); } }
function paintWalk(w,we){ var x, y, wet=we==='rain'; w.g=RG.walk;
  // Bussteig und Vorplatz: Betonsteinpflaster in Reihen, vor dem Café hellere Platten
  for (y=EDGE+4;y<H;y++) for (x=0;x<W;x++){ var rh=3+Math.floor((y-EDGE)/9), row=Math.floor((y-EDGE-4)/rh), off=(row%2)*5, fx=(x+off)%10, c=(hash(Math.floor((x+off)/10),row)<0.4)?P.s3:P.s4; if (fx===0||(y-EDGE-4)%rh===0) c=P.s2; if (x<CAFE.x1-4 && bayer(x,y)<cl((CAFE.x1-4-x)/30,0,0.7)) c=M.UP[c];
      if (wet){ c=M.DN[c]; if (fbm(x*0.2,y*0.8,5,13)>0.66) c=(bayer(x,y)<0.5)?P.m4:P.m3; } w.px(x,y,c); }
  for (x=0;x<CAFE.x1-4;x++){ w.px(x,CAFE.base,P.s5); w.px(x,CAFE.base+1,P.s3); }
  // Kaugummiflecken, Kippen, ein Kanaldeckel
  for (var i=0;i<40;i++){ var gx=Math.floor(hash(i,61)*W), gy=EDGE+5+Math.floor(hash(i,62)*34); w.px(gx,gy,hash(i,63)<0.5?P.m2:P.s5); }
  w.ellipse(232,134,6,1.8,P.m1); w.hl(227,237,134,P.k2); }

// ---------------------------------------------------------------- der Reisebus aus München (Kopf rechts, Türseite zu uns)
function paintBus(w,we,tod){ var b=BUS, x, y, wet=we==='rain'; w.g=RG.bus;
  var L=b.x1-b.x0, winT=b.top+8, winB=b.top+26, skirt=b.base-12;
  for (x=b.x0;x<b.x1;x++){ var u=(x-b.x0)/L, front=x>b.x1-14, top=b.top+(front?Math.round(Math.pow((x-(b.x1-14))/14,2)*5):0)+(x<b.x0+4?2:0);
    for (y=top;y<b.base-4;y++){ var c;
      if (y<top+2) c=(y===top)?P.s6:P.s5;
      else if (y<winT) c=(y===winT-1)?P.s4:P.s6;
      else if (y<winB){ var pane=((x-b.x0)%30<2); c=pane?P.s4:((y<winT+3)?P.n1:(((x+y)%13<2)?P.b2:P.n0)); if (front && x>b.x1-12) c=(y<winT+3)?P.n2:P.n1; }
      else if (y<winB+3) c=(y===winB+1)?P.r3:P.b1;                                                   // Zierstreifen (ohne Namen)
      else c=(y>skirt)?P.s4:((y>winB+10)?P.s5:P.s6);
      if (x===b.x0 || x===b.x1-1) c=M.DN[c]; w.px(x,y,c); } }
  for (x=b.x0+6;x<b.x1-16;x++){ w.px(x,b.top+3,P.s5); w.px(x,skirt,P.s3); }
  // Tür vorn (zweiflügelig, Glas), Spiegel, Scheinwerfer, Kühlergrill
  var dx=b.x1-38; for (y=winT;y<b.base-4;y++) for (x=dx;x<dx+14;x++){ var c2=(y<b.base-12)?((x===dx+7)?P.m2:P.n1):P.m2; if (x===dx||x===dx+13) c2=P.m3; w.px(x,y,c2); }
  for (y=b.base-6;y<b.base-2;y++) w.hl(dx+1,dx+12,y,(y%2)?P.m3:P.m1);
  w.vl(b.x1+1,winT-2,winT+8,P.k1); w.rect(b.x1,winT+6,3,5,P.k1); w.rect(b.x1-4,b.base-12,4,3,P.s6); w.px(b.x1-2,b.base-11,P.y4);
  // Zielanzeige an der Seite neben der Tür: schwarze Leiste, orange Leuchtschrift
  var zx=b.x1-128, zy=winT+1; w.rect(zx,zy-3,86,12,P.k1); w.hl(zx,zx+85,zy-3,P.m1); M.text(w,'MÜNCHEN – MOSTAR',zx+3,zy+1,P.y3);
  // Räder, Radkästen
  [b.x0+30,b.x1-62].forEach(function(cx){ w.ellipse(cx,b.base-5,9,6,P.k1); for (var a=-6;a<=6;a++) for (var q=-6;q<=6;q++){ var d=a*a+q*q; if (d>36) continue; w.px(cx+a,b.base-4+q*0.7,d<9?P.m3:(d<20?P.m1:P.k0)); } w.px(cx-1,b.base-5,P.m4); });
  // Gepäckklappe offen: hochgeklappt, darunter der dunkle Gepäckraum mit Koffern
  var h0=HATCH.x0, h1=HATCH.x1; for (y=winB+4;y<b.base-4;y++) for (x=h0;x<h1;x++) w.px(x,y,(y<winB+7)?P.k0:P.k1);
  [[h0+3,10,10,P.r2],[h0+14,12,8,P.b1],[h0+27,9,11,P.m2],[h0+37,11,9,P.e2]].forEach(function(s){ var sx=s[0], sw=s[1], sh=s[2]; for (y=b.base-4-sh;y<b.base-4;y++) for (x=sx;x<sx+sw;x++) w.px(x,y,(y===b.base-4-sh)?M.UP[s[3]]:((x===sx||x===sx+sw-1)?M.DN[s[3]]:s[3])); w.hl(sx+2,sx+sw-3,b.base-5-sh,P.k2); });
  for (x=h0-2;x<h1+2;x++){ w.px(x,winB+1,P.s6); w.px(x,winB+2,P.s4); w.px(x,winB+3,P.m2); }                 // Klappe als Dach über der Öffnung
  w.line(h0,winB+3,h0-2,winB+9,P.m3); w.line(h1-1,winB+3,h1+1,winB+9,P.m3);
  // Kennzeichen ohne Lesbarkeit, Heckleuchte, Auspuff hinten links
  w.rect(b.x0+2,b.base-12,3,4,P.r3); w.rect(b.x0-2,b.base-5,4,2,P.m1);
  for (x=b.x0;x<b.x1;x++) if (bayer(x,b.base-3)<0.8) w.px(x,b.base-3,P.k1); for (x=b.x0+2;x<b.x1-2;x++) w.px(x,b.base-2,P.k2); }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), WE='calm', BASE=null, MUN=false;
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k, night=tod==='night';
  WE=we; REG.fill(0); LITW.length=0; MUN=!!S.munich;
  paintSky(b,tod,we); paintFar(w);
  paintBay(w,we);
  if (MUN) paintBus(w,we,tod);
  paintCafe(w,we,tod); paintStation(w,we,tod); paintWalk(w,we);
  // ein Koffer auf dem Bussteig, wenn der Bus da ist
  if (MUN){ w.g=RG.prop; var kx=302, ky=EDGE+12; w.rect(kx,ky-11,9,11,P.v2); w.hl(kx,kx+8,ky-11,P.v3); w.vl(kx+8,ky-11,ky-1,P.v1); w.rect(kx+3,ky-14,3,3,P.k2); w.px(kx+4,ky-13,P.v2); w.hl(kx,kx+8,ky,P.k2); w.px(kx+1,ky,P.k1); w.px(kx+7,ky,P.k1); }
  var fk=we==='bura'?0.1:(we==='rain'?0.55:(we==='grey'?0.42:0.18)), fc=night?P.m1:(we==='rain'?P.m3:(we==='grey'?P.m4:P.b4));
  haze(b,function(xx,yy){ var g=REG[yy*W+xx]; if (g===RG.far) return 0.45*fk+0.18; return 0; },fc);
  var amb=we==='rain'?-0.5:(we==='grey'?-0.3:(we==='bura'?0.1:0));
  M.light(b,M.lf.sum(M.lf.k(amb),M.lf.band(EDGE,H,0,-0.3),function(xx,yy){ return (xx>CAN.x0 && yy>CAN.y1 && yy<EDGE+30)?-0.45:0; }),0,0,function(xx,yy){ var g=REG[yy*W+xx]; return g!==RG.sky && g!==RG.glass; });
  SKYM.fill(0); for (k=0;k<W*H;k++) if (REG[k]===RG.sky) SKYM[k]=1;
  var lights=[]; if (tod!=='day'){ lights.push([WIN.x0+35,WIN.y0+20,50,0.9,30]); lights.push([DOOR.x0+11,DOOR.y0+25,24,0.6,30]); for (var lx=CAN.x0+27;lx<CAN.x1;lx+=58) lights.push([lx,EDGE+8,34,0.6,24]); }
  for (y=0;y<H;y++) for (x=W-1;x>=0;x--){ k=y*W+x; if (b.d[k]===T) b.d[k]=x+1<W?b.d[k+1]:P.k1; }   // keine durchsichtigen Lücken am Rand (Geister lesen den Grund)
  BASE=b.clone();
  return M.finishTOD(b,tod,{ sky:function(xx,yy){ return SKYM[yy*W+xx]===1; }, lights:lights, after:function(o,tod2){ if (tod2==='day') return;
      for (var yy=WIN.y0;yy<WIN.y1;yy++) for (var xx=WIN.x0;xx<WIN.x1;xx++){ var c=inside(xx,yy,true); if (REG[yy*W+xx]===RG.glass && BASE.get(xx,yy)===inside(xx,yy,false)) o.px(xx,yy,c); }
      for (var lx2=CAN.x0+16;lx2<CAN.x1;lx2+=58){ o.hl(lx2,lx2+22,CAN.y1-2,P.l1); o.hl(lx2,lx2+22,CAN.y1-1,P.y4); }
      LITW.forEach(function(p){ if (hash(p[0]*1.3,p[1]*2.1)>(tod2==='night'?0.3:0.18)) return; o.px(p[0],p[1],hash(p[0],p[1])<0.5?P.y3:P.y4); });
      sign(o,'POLASCI',BOARD.x0+2,BOARD.y0+2,P.y4); } }); }

// ---------------------------------------------------------------- jedes Bild: Abgas am Bus, eine Taube, das Lauflicht der Anzeige
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, we=WE, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  function px(X,Y,c){ X=rd(X)-cam; if (X<0||X>=320||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  if (MUN){ for (var i=0;i<8;i++){ var ph=(t*0.55+i/8)%1, ex=BUS.x0-3-ph*18-(we==='bura'?ph*20:0), ey=BUS.base-5-ph*8+Math.sin(t*2+i)*1.2; if (bayer(rd(ex),rd(ey))<0.55-ph*0.45) px(ex,ey,tod==='day'?P.s4:P.m2); if (ph<0.4) px(ex+1,ey,P.s3); } }
  // Lauflicht in der Anzeige
  var sx=Math.floor(t*14)%(BOARD.x1-BOARD.x0-4); for (var q=0;q<3;q++) px(BOARD.x0+2+((sx+q*9)%(BOARD.x1-BOARD.x0-4)),BOARD.y0+9,P.y4);
  // eine Taube pickt auf dem Bussteig, läuft ein Stück
  if (we!=='rain'){ var tx=330+Math.sin(t*0.3)*14, ty=EDGE+18, peck=Math.sin(t*3)>0.4, f=Math.cos(t*0.3)>0?1:-1;
    px(tx,ty,P.m2); px(tx+1,ty,P.m2); px(tx-1,ty-1,P.m2); px(tx,ty-1,P.m3); px(tx+1,ty-1,P.m3); px(tx+2*f,ty-1,P.m2); px(tx,ty-2,P.m4); px(tx+(f>0?2:-1),peck?ty:ty-2,P.m3); px(tx+(f>0?2:-1),peck?ty-1:ty-3,P.a3); px(tx,ty+1,P.t2); }
  if (we==='bura' && tod==='day') for (var j=0;j<3;j++){ var spd=22+hash(j,3)*18, cx=((hash(j,1)*W+t*spd)%(W+60))-30-cam, cy=4+hash(j,2)*14, L=10+hash(j,4)*16;
    for (var k=0;k<L;k++){ var X=rd(cx+k), Y=rd(cy+Math.sin(k*0.5+j)*0.6); if (X<0||X>=320||Y<0) continue; if (!SKYM[Y*W+X+cam]) continue; var a=1-Math.abs(k/L-0.5)*2; if (bayer(X,Y)<a*0.8) fb.px(X,Y,P.b5); } } }
function front(fb,v,S,GS){ var we=WE;
  if (we==='rain') M.rain(fb,v.t,{n:90,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:250,slant:0.2,mask:function(x,y){ return !(x+v.cam>CAN.x0 && y>CAN.y0 && y<EDGE+6); }});
  if (we==='bura') M.scn.buraDebris(fb,v.t,112,140,v.cam); }

// ---------------------------------------------------------------- Lauffläche: Vorplatz und Bussteig
function walk(x,y){ if (y<112||y>138||x<6||x>394) return false; if (x>BENCH.x0-1 && x<BENCH.x1+1 && y<BENCH.by+2) return false; if (x<16 && y<114) return false; return true; }
M.defineArt('westbus',{
  width:W, paint:paint, walk:walk, dynamic:dyn, front:front,
  spots:{
    exit:[0,70,10,74],
    cafe_door:[DOOR.x0-2,DOOR.y0-2,DOOR.x1-DOOR.x0+4,DOOR.y1-DOOR.y0+2],
    cafe_window:[WIN.x0-2,WIN.y0-2,WIN.x1-WIN.x0+4,WIN.y1-WIN.y0+4],
    bus:[BUS.x0-4,BUS.top-2,BUS.x1-BUS.x0+8,BUS.base-BUS.top+3],
    platform:[CAN.x0,EDGE-2,W-CAN.x0,H-EDGE+2],
    bench:[BENCH.x0-1,BENCH.by-21,BENCH.x1-BENCH.x0+3,22],
    timetable:[CASE.x-14,CASE.y0-1,28,CASE.y1-CASE.y0+2]
  },
  stands:{ exit:[8,126,'L'], cafe_door:[115,117,'B'], cafe_window:[60,118,'B'], bus:[238,120,'B'], platform:[330,128,'B'], bench:[205,124,'B'], timetable:[252,118,'B'] },
  actorPos:{ davor:[266,121,'L'], lena:[288,123,'L'] },
  start:[24,126,'R'], entries:{ map:[16,126,'R'], kafic:[118,118,'R'] }
});
})(M);
