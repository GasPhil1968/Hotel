/* ===== rooms/art/podmost.js — Unter der Alten Brücke, Ostufer (Revision K3, Fotostandort von 1965).
   Blick flussab nach Süden, von der Kiesbank am Fuß der Uferstufen. Oben spannt sich der Bogen über die ganze Breite: Brüstung, Stirnmauer,
   der Bogenring aus hellen Keilsteinen und darunter die Leibung des Gewölbes, die man von hier unten sieht. Links der halbrunde Turm Tara
   auf seinem Felsen (nah, groß), rechts drüben Halebija (klein, im Dunst). Durch den Bogen der Fluss nach Süden, ferne Dächer, der Hum.
   Vorn die Kiesbank mit vier Uferfelsen: R1 ein runder Block unter dem Turm, R2 ein Felsen mit einem Riss, R3 eine flache Platte mit einer
   Kerbe, auf der ein behauener Quader der alten Brücke liegt (zwei leere Klammerschlitze), R4 ein spitzer Felsen am Wasser. Links die
   Uferstufen hinauf zum Brückenkopf. S.davorSits: Davor sitzt auf dem Quader (gemalt, die Figur ist dann ausgeblendet). M.PODMOST teilt die
   Geometrie mit dem Fotovergleich (97_k3_foto.js). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
var ARC={cx:176,cy:150,r:132,th:10,sof:9};       // Bogen: Leibung = Kreis (cx,cy,r), Ring th, sichtbare Leibungsfläche sof (von unten)
var WY0=96, WY1=114;                               // Fluss: Oberkante (fern), Vorderkante
var ROCKS={ r1:{x0:18,x1:62,top:112,base:131}, r2:{x0:86,x1:126,top:108,base:131}, r3:{x0:144,x1:202,top:117,base:129}, r4:{x0:238,x1:274,top:102,base:127} };
var BLOCK={x0:156,x1:186,top:103,base:118};       // Quader auf R3
var TARA={x0:0,x1:46,top:0,base:92};
var HALE={x0:298,x1:320,top:14,base:88};
function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function intra(x){ var dx=x-ARC.cx; if (Math.abs(dx)>=ARC.r) return 999; return ARC.cy-Math.sqrt(ARC.r*ARC.r-dx*dx); }
function deckY(x){ var t=(x-ARC.cx)/150; return 3+t*t*44; }
// Felsen der beiden Widerlager (Oberkante je x): links unter Tara bis zum Kämpfer, rechts drüben
function rockTopE(x){ return x<46?92:(x<70?lerp(92,104,(x-46)/24):999); }
function rockTopW(x){ return x>300?90:(x>286?lerp(104,90,(x-286)/14):999); }

// ---------------------------------------------------------------- Hintergrund durch den Bogen: Himmel, Hum, ferne Dächer, der Fluss nach Süden
function far(b,tod){ var x, y, SK=R('b5 b4 b3 b2'), HL=R('e2 g3 e3 g4 e4');
  for (y=0;y<WY0;y++) for (x=0;x<W;x++){ var c;
    if (y<52) c=ra(SK,0.15+y/70+(fbm(x*0.03,y*0.08)-0.5)*0.1,x,y);
    else c=ra(SK,0.9,x,y);
    b.px(x,y,c); }
  // Wolkenfetzen
  for (var i=0;i<9;i++){ var cx=hash(i,7)*W, cy=8+hash(i,8)*30, L=18+hash(i,9)*40; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy+Math.sin(k*0.2)*1.2); if (bayer(xx,yy)<0.7*(1-Math.abs(k/L-0.5)*2)) b.px(xx,yy,P.b5); } }
  // der Hum (kahl, ohne Zeichen) und ein fernerer Rücken
  for (x=0;x<W;x++){ var h1=rd(58+Math.sin(x*0.018+0.6)*6+Math.sin(x*0.07)*1.5), h2=rd(66+Math.sin(x*0.03+2)*4);
    for (y=h1;y<WY0;y++) b.px(x,y,ra(R('n4 b3 n3'),0.4+(y-h1)*0.03,x,y));
    for (y=h2;y<WY0;y++) b.px(x,y,ra(HL,0.3+(y-h2)*0.03+(fbm(x*0.1,y*0.2)-0.5)*0.4,x,y)); }
  // ferne Häuser am Westufer und am Ostufer (helle Wände, rote Dächer), klein
  for (i=0;i<26;i++){ var hx=60+rd(hash(i,3)*200), hy=80+rd(hash(i,4)*8), hw=4+rd(hash(i,5)*5), hh=3+rd(hash(i,6)*3);
    b.rect(hx,hy-hh,hw,hh,hash(i,11)<0.5?P.s5:P.s4); b.hl(hx,hx+hw-1,hy-hh-1,hash(i,12)<0.6?P.t3:P.t2); b.px(hx+1,hy-hh+1,P.s2); }
  // der Fluss nach Süden, schmal in der Ferne
  for (y=86;y<WY0;y++){ var hw2=lerp(18,60,(y-86)/(WY0-86)); for (x=rd(176-hw2);x<=rd(176+hw2);x++) b.px(x,y,ra(R('a3 a4 a5'),0.4+(hash(x>>1,y)-0.5)*0.4,x,y)); }
}

// ---------------------------------------------------------------- der Bogen: Brüstung, Stirnmauer, Keilsteine, Leibung
function arch(b){ var x, y, cx=ARC.cx, r=ARC.r, ro=r+ARC.th, LS=R('s3 s4 s5 s6');
  for (x=0;x<W;x++){ var dy=deckY(x), iy=intra(x);
    for (y=Math.max(0,rd(dy)-5);y<Math.min(H,iy+ARC.sof+1);y++){ var d=Math.hypot(x-cx,y-ARC.cy), c;
      if (y<dy-1){ c=(y<dy-4)?P.s5:P.s4; if (y===rd(dy)-5) c=P.s6; if (((x+3)%9)===0 && y>dy-4) c=P.s3; b.px(x,y,c); continue; }   // Brüstung
      if (d>ro){ // Stirnmauer (Spandrille): Lagen mit versetzten Stoßfugen
        var row=Math.floor((y-dy)/5), off=(row&1)*5, f=fbm(x*0.12,y*0.2); c=ra(LS,0.55+(f-0.5)*0.5,x,y);
        if (((y-rd(dy))%5)===0) c=P.s2; else if (((x+off)%11)===0) c=P.s2;
        if (y===rd(dy)) c=P.s6; b.px(x,y,c); continue; }
      if (d>r){ // Bogenring: Keilsteine mit radialen Fugen
        var a=Math.atan2(y-ARC.cy,x-cx), seg=Math.floor(a/0.055); c=ra(LS,0.75+(hash(seg,3)-0.5)*0.3,x,y);
        if (Math.abs(a/0.055-Math.round(a/0.055))<0.07) c=P.s2; if (d>ro-1) c=P.s3; if (d<r+1) c=P.s6; b.px(x,y,c); continue; }
      if (d>r-ARC.sof){ // die Leibung, von unten gesehen: dunkler, Lagerfugen quer, Rußspuren
        var a2=Math.atan2(y-ARC.cy,x-cx), s2=Math.floor(a2/0.07), u=(r-d)/ARC.sof; c=ra(R('s1 s2 s3'),0.75-u*0.5+(hash(s2,5)-0.5)*0.2,x,y);
        if (Math.abs(a2/0.07-Math.round(a2/0.07))<0.08) c=P.s1; if (u>0.85) c=P.s1; b.px(x,y,c); } } }
}

// ---------------------------------------------------------------- Türme: Tara (halbrund, nah) und Halebija (rechteckig, fern)
function tara(b){ var t=TARA, x, y, mid=(t.x0+t.x1)/2, hw=(t.x1-t.x0)/2;
  for (y=t.top;y<t.base;y++) for (x=t.x0;x<t.x1;x++){ var u=(x-mid)/hw, sh=Math.sqrt(Math.max(0,1-u*u)), lit=0.35+sh*0.4+u*0.2, f=fbm(x*0.15,y*0.12);
    var c=ra(R('s2 s3 s4 s5'),lit+(f-0.5)*0.3,x,y); var row=Math.floor(y/4), off=(row&1)*4; if (y%4===0) c=M.DN[c]; else if (((x+off)%8)===0 && Math.abs(u)<0.9) c=M.DN[c];
    b.px(x,y,c); }
  // Fenster (Schießscharten) und ein Gesims
  [[20,26],[28,52],[16,72]].forEach(function(w){ b.rect(w[0],w[1],2,6,P.k1); b.px(w[0],w[1]-1,P.s2); b.px(w[0]+1,w[1]-1,P.s2); });
  for (x=t.x0;x<t.x1;x++){ b.px(x,10,P.s5); b.px(x,11,P.s2); }
  // Fels unter Tara und das Widerlager mit dem Kämpfer
  for (x=0;x<74;x++){ var top=rockTopE(x); if (top>=999) continue; for (y=rd(top);y<WY1;y++){ var g=fbm(x*0.08,y*0.11); b.px(x,y,ra(R('e1 e2 s2 e3 s3'),0.35+(g-0.5)*0.8-(y-top)*0.008,x,y)); } }
  b.rect(46,98,14,5,P.s4); b.hl(46,59,98,P.s6); b.hl(46,59,102,P.s2); }
function hale(b){ var t=HALE, x, y;
  for (y=t.top;y<t.base;y++) for (x=t.x0;x<t.x1;x++){ var c=(x<t.x0+3)?P.s3:P.s4; if (y%4===0) c=P.s3; if (y===t.top) c=P.s5; b.px(x,y,M.mix?M.mix(c,P.b4,2):c); }
  b.rect(306,30,2,5,P.s2); b.rect(312,50,2,5,P.s2);
  for (x=284;x<W;x++){ var top=rockTopW(x); if (top>=999) continue; for (y=rd(top);y<WY1;y++) b.px(x,y,ra(R('e2 s2 e3 s3'),0.45+(fbm(x*0.08,y*0.1)-0.5)*0.6,x,y)); } }

// ---------------------------------------------------------------- Fluss (nah), Kiesbank, Uferfelsen, Quader, Uferstufen
function river(b){ var x, y;
  for (y=WY0;y<WY1;y++) for (x=0;x<W;x++){ if (y>=rockTopE(x) || y>=rockTopW(x)) continue; var t=(y-WY0)/(WY1-WY0), f=fbm(x*0.05,y*0.4);
    var c=ra(R('a1 a2 a3 a4 a5'),0.75-t*0.45+(f-0.5)*0.4,x,y); if (hash(x>>2,y)<0.04+0.04*t) c=P.a6; b.px(x,y,c); } }
function bank(b){ var x, y;
  for (y=WY1-4;y<H;y++) for (x=0;x<W;x++){ var edge=WY1-2+Math.sin(x*0.06)*2+(x>220?(x-220)*0.04:0); if (y<edge) continue; var d=(y-edge)/(H-edge+1), s=1+d*2.2;
    var g=hash(Math.floor(x/s),Math.floor(y/(s*0.7))), c=ra(R('s1 s2 e2 s3 e3 s4 s5'),0.45+(g-0.5)*0.7+(fbm(x*0.05,y*0.1)-0.5)*0.3,x,y);
    if (y<edge+2) c=(hash(x,y)<0.5)?P.a4:P.s2; b.px(x,y,c); }
  // Kiesel als einzelne helle Punkte
  for (var i=0;i<140;i++){ var kx=rd(hash(i,21)*W), ky=118+rd(hash(i,22)*25); b.px(kx,ky,hash(i,23)<0.5?P.s5:P.s4); b.px(kx+1,ky,P.s2); } }
function rockShape(k,u,v){ if (k==='r1') return (u*u+(v-1)*(v-1)*0.9)<1.05; if (k==='r2') return Math.abs(u)<1-v*0.15 && v>0.05+Math.abs(u)*0.2; if (k==='r3') return Math.abs(u)<1 && v>Math.abs(u)*0.15; return Math.abs(u)<v*1.05+0.05; }
function rock(b,k){ var r=ROCKS[k], x, y, mid=(r.x0+r.x1)/2, hw=(r.x1-r.x0)/2, hh=r.base-r.top, inS=function(x,y){ if (x<r.x0||x>=r.x1||y<r.top||y>=r.base) return false; return rockShape(k,(x-mid)/hw,(y-r.top)/hh); };
  // Schlagschatten auf dem Kies (nach rechts unten, die Sonne steht im Südwesten hinter dem Bogen)
  for (y=r.base-3;y<r.base+3;y++) for (x=r.x0+2;x<r.x1+5;x++){ if (inS(x,y)) continue; var dd=Math.abs((x-(mid+3))/(hw+3))+Math.abs(y-r.base)/4; if (dd<1 && bayer(x,y)<0.75) b.px(x,y,M.DN[b.get(x,y)]); }
  for (y=r.top;y<r.base;y++) for (x=r.x0;x<r.x1;x++){ if (!inS(x,y)) continue; var u=(x-mid)/hw, v=(y-r.top)/hh, lit=0.7-v*0.4+u*0.15, f=fbm(x*0.2,y*0.3), c=ra(R('e1 s1 s2 s3 s4 s5'),lit+(f-0.5)*0.35,x,y);
    if (k==='r3' && v<0.25) c=(hash(x,y)<0.5)?P.s4:P.s5;                   // ausgetretene, helle Oberseite
    if (!inS(x,y-1)) c=(k==='r3')?P.s6:M.UP[c];                             // Lichtkante oben
    if (!inS(x,y+1) || !inS(x-1,y)) c=P.e1;                                 // dunkle Kontur unten und links
    else if (!inS(x+1,y)) c=P.s2;
    b.px(x,y,c); }
  if (k==='r2') b.line(r.x0+12,r.top+2,r.x0+18,r.base-2,P.k2);                 // Riss
  if (k==='r3'){ var nx=r.x1-10; b.line(nx,r.top+1,nx+3,r.top+5,P.s1); b.line(nx+6,r.top+1,nx+3,r.top+5,P.s1); b.px(nx+3,r.top+4,P.k2); }   // die Kerbe
  if (k==='r4'){ b.line(rd(mid),r.top,rd(mid)+3,r.top+8,P.s5); } }
function block(b){ var q=BLOCK, x, y;
  for (y=q.top;y<q.base;y++) for (x=q.x0;x<q.x1;x++){ var front=y>q.top+4, c;
    if (!front){ c=(y===q.top)?P.s6:P.s5; if (x>q.x1-3) c=P.s4; }
    else { c=ra(R('s3 s4 s5'),0.55+(fbm(x*0.4,y*0.6)-0.5)*0.4,x,y); if (((x+y*2)%5)===0 && hash(x,y)<0.6) c=P.s3; if (x>q.x1-4) c=P.s2; }   // Werkzeugspuren
    if ((x===q.x0 && y<q.top+2) || (x===q.x1-1 && y>q.base-3)) continue;      // abgeschlagene Ecken
    b.px(x,y,c); }
  b.hl(q.x0,q.x1-1,q.top+4,P.s2); b.rect(q.x0+6,q.top+1,5,2,P.k1); b.rect(q.x1-12,q.top+1,5,2,P.k1);   // Kante, zwei Klammerschlitze
  b.hl(q.x0+1,q.x1-2,q.base,P.k2); }
function steps(b){ var x, y, i;
  for (i=0;i<9;i++){ var sy=96+i*4, sx1=24-Math.round(i*0.5); for (y=sy;y<sy+4;y++) for (x=0;x<sx1;x++){ var c=(y===sy)?P.s5:((x>sx1-3)?P.s2:P.s3); if (hash(x,y+i)<0.08) c=P.s2; b.px(x,y,c); } }
  for (y=92;y<132;y++) b.px(25-Math.round((y-92)*0.12),y,P.m1); }   // rostiges Geländer
// Davor sitzt auf dem Quader (gemalt): beiger Mantel, graues Haar, Hände auf den Knien
function davorSitting(b){ var x0=BLOCK.x0+9, y0=BLOCK.top-16;
  b.rect(x0+3,y0,6,6,P.p3); b.rect(x0+3,y0,6,2,P.m3); b.px(x0+4,y0+3,P.k1); b.px(x0+7,y0+3,P.k1);
  b.rect(x0+1,y0+6,10,8,P.e4); b.vl(x0+1,y0+6,y0+13,P.e3); b.hl(x0+1,x0+10,y0+13,P.e3); b.rect(x0+11,y0+11,5,3,P.e4);
  b.rect(x0+14,y0+14,3,6,P.m1); b.rect(x0+3,y0+14,3,4,P.m1); b.px(x0+17,y0+19,P.k1); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0);
  far(b,tod); hale(b); arch(b); tara(b); river(b); bank(b); steps(b);
  ['r1','r2','r4'].forEach(function(k){ rock(b,k); }); rock(b,'r3'); block(b);
  if (S && S.davorSits) davorSitting(b);
  if (tod==='day') M.light(b,function(x,y){ var s=0; if (y>intra(x)-2 && y<WY0 && x>40 && x<300) s-=0.25; if (y>118) s-=Math.max(0,(y-118)/50)*0.3; return s+(fbm(x*0.02,y*0.03)-0.5)*0.3; });
  else M.tintApply(b,M.TINT[tod]||M.TINT.night);
  return b; }
// jedes Bild: Schaumstreifen im Fluss, Glitzern
function dyn(fb,v,S,GS){ var t=v.t; for (var i=0;i<22;i++){ var y=WY0+2+(i%8)*2, x=Math.round((hash(i,31)*W+t*(10+hash(i,32)*14))%W); if (y>=rockTopE(x)||y>=rockTopW(x)) continue; if (Math.sin(t*3+i)>-0.2){ fb.px(x,y,P.a6); fb.px((x+1)%W,y,P.a5); } } }
// Geistersicht: ein heller Fleck unter dem Quader, wie ein Atem
function ghost(fb,v,S,GS){ var t=v.t, q=BLOCK, a=0.4+Math.sin(t*1.2)*0.15; for (var y=q.base-2;y<q.base+6;y++) for (var x=q.x0-4;x<q.x1+4;x++){ var d=Math.hypot((x-(q.x0+q.x1)/2)/18,(y-q.base-1)/5); if (d<1 && bayer(x,y+Math.floor(t*2))<(1-d)*a){ var k=y*fb.w+x; fb.d[k]=M.UP[fb.d[k]]; } } }
function walk(x,y){ if (y<120||y>140||x<8||x>304) return false; if (x<26 && y<128) return false; return true; }
M.PODMOST={ARC:ARC,TARA:TARA,ROCKS:ROCKS,BLOCK:BLOCK};
M.defineArt('podmost',{
  width:W, paint:paint, dynamic:dyn, ghost:ghost, walk:walk,
  spots:{
    steps:[0,92,26,40],
    arch:[70,4,212,30],
    tara:[0,0,46,92],
    hale:[294,10,26,80],
    river:[74,WY0,200,14],
    r1:[ROCKS.r1.x0,ROCKS.r1.top-2,ROCKS.r1.x1-ROCKS.r1.x0,ROCKS.r1.base-ROCKS.r1.top+2],
    r2:[ROCKS.r2.x0,ROCKS.r2.top-2,ROCKS.r2.x1-ROCKS.r2.x0,ROCKS.r2.base-ROCKS.r2.top+2],
    r3:[ROCKS.r3.x0,ROCKS.r3.top-2,ROCKS.r3.x1-ROCKS.r3.x0,ROCKS.r3.base-ROCKS.r3.top+3],
    block:[BLOCK.x0-2,BLOCK.top-3,BLOCK.x1-BLOCK.x0+4,BLOCK.base-BLOCK.top+3],
    r4:[ROCKS.r4.x0,ROCKS.r4.top-2,ROCKS.r4.x1-ROCKS.r4.x0,ROCKS.r4.base-ROCKS.r4.top+2]
  },
  stands:{ steps:[16,128,'L'], arch:[176,130,'B'], tara:[40,130,'L'], hale:[290,132,'R'], river:[200,128,'B'], r1:[42,134,'B'], r2:[106,135,'B'], r3:[172,134,'B'], block:[172,134,'B'], r4:[256,133,'B'] },
  actorPos:{ davor:[72,131,'R'], lena:[222,133,'L'], mala:[124,129,'R'] },
  start:[22,129,'R'], entries:{ starimost:[22,129,'R'] }
});
})(M);
