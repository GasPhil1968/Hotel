/* ===== rooms/art/zelenika.js — Haus Zelenika mit Feigengarten (400 px, scrollend).
   Ein Wohnviertel am Westufer im Süden der Stadt. Links Jelas kleines Haus (verputzt, Ziegeldach, Küchenfenster mit Gardine
   und Topfpflanze, Tür unter einem Vordach), davor die Gasse. Von hinten kommt schräg der Gartenzaun der Zelenikas (niedrige
   Mauer mit Eisengitter) bis zum gemauerten Pfosten, an dem Mate immer stand; daneben steht das grüne Eisentor offen, ein
   Flügel in den Hof gedreht. Im Hof zwei kahle Feigenbäume mit glatter grauer Rinde und dicken Ästen (der große hat eine
   Astgabel), Gartenerde und Betonplatten. Rechts das Gastarbeiterhaus der Siebziger: unten verputzt, oben rohe Ziegel,
   ein Betonbalkon mit Eisengeländer, Rollladenkästen, Walmdach mit Antenne; vor dem Erdgeschoss ein Weinstock am Draht,
   die Haustür mit zwei Stufen, eine Holzbank. G.flags['k3.b.figs']: die Feigen sind in Jute gewickelt und mit Schnur verschnürt.
   G.flags['k3.b.keyFree']: in der Astgabel liegt ein Schlüssel. Geistersicht: am Pfosten eine Abnutzung wie von jahrelangem
   Anlehnen. Dämmerung (falls die Logik den Nachmittag dunkler macht): Licht in Jelas Küche und eine Gassenlaterne. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, HZ=70;                               // Horizont (Augenhöhe)
var JH={x0:0,x1:98,base:108,eave:58};                  // Jelas Haus
var JD={x0:60,x1:80,top:72};                           // Jelas Tür
var JW={x0:14,x1:42,y0:74,y1:94};                      // Jelas Küchenfenster
var POST={x:134,base:113,top:72,w:8};                  // gemauerter Torpfosten (Mates Platz)
var FP={x:98,base:132,top:84,w:10};                    // vorderer Pfosten der Zaunlinie
var FENCE_BACK=[[POST.x+4,POST.base],[190,92]];        // Zaun vom Pfosten schräg nach hinten
var GATEW={x0:POST.x+POST.w,x1:POST.x+POST.w+30,base:113,top:82};   // offener Torflügel (in den Hof gedreht, frontal)
var ZH={x0:262,x1:400,base:106,gf:62,uf:30,eave:26};   // Haus Zelenika: Erdgeschoss bis gf, Obergeschoss bis uf
var HD={x0:302,x1:322,top:70};                         // Haustür
var BENCH={x0:336,x1:368,by:111};
var FIG1={x:208,by:110}, FIG2={x:166,by:106};          // großer und kleiner Feigenbaum (Stammfuß)
var FORK={x:206,y:84};                                 // Astgabel des großen Feigenbaums
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function figsWrapped(GS){ return !!(GS && GS.flags && GS.flags['k3.b.figs']); }
function keyFree(GS){ return !!(GS && GS.flags && GS.flags['k3.b.keyFree'] && !GS.flags['k3.b.keyTaken']); }   // liegt nur da, bis Marko ihn nimmt
// Zaunlinie (vorn): vom vorderen Pfosten zur Bildkante unten links
function fenceFrontX(y){ return lerp(FP.x,FP.x-14,(y-FP.base)/12); }

// ---------------------------------------------------------------- Regionen
var REG=new Uint8Array(W*H), RG={sky:1,far:2,wall:3,roof:4,glass:5,ground:6,tree:7,iron:8,wood:9,plant:10,lamp:11};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Himmel, Hum, Nachbarhäuser, Strommasten
function sky(b,tod,weather){ var w=RW(b,RG.sky);
  if (tod==='night'){ var NR=R('k0 k1 k2 n0 n1'); for (var y=0;y<HZ;y++) for (var x=0;x<W;x++) w.px(x,y,ra(NR,0.15+y/HZ*0.75,x,y)); var r=M.rng(19); for (var s=0;s<200;s++){ var sx=Math.floor(r()*W), sy=Math.floor(r()*50); w.px(sx,sy,r()<0.2?P.n5:P.n4); } return; }
  M.scn.sky(w,0,0,W,HZ,tod,weather==='bura'?'calm':weather,57);
  if (weather==='bura' && tod==='day') for (var i=0;i<12;i++){ var cx=hash(i,7)*W, cy=4+hash(i,8)*28, L=40+hash(i,9)*70; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.1); if (bayer(xx,yy)<0.55*(1-Math.abs(k/L-0.5)*2)) w.px(xx,yy,P.s6); } } }
function far(b,tod,weather){ var w=RW(b,RG.far), x, y, grey=weather==='grey'||weather==='rain', night=tod==='night';
  for (x=0;x<W;x++){ var hy=rnd(40+Math.sin(x*0.011+2)*7+Math.sin(x*0.043)*2.5); for (y=hy;y<HZ+4;y++) w.px(x,y,grey?ra(R('m2 m3 m4'),0.55+(hash(x>>1,y)-0.5)*0.3,x,y):ra(R('e2 e3 g4 e4 s4'),0.3+(y-hy)*0.012+(fbm(x*0.08,y*0.15)-0.5)*0.5,x,y)); }
  // Nachbarhäuser (rote Dächer, verputzt), hinten kleiner
  var r=M.rng(31), xx=100; while (xx<W){ var bw=18+Math.floor(r()*22), bh=12+Math.floor(r()*10), base=HZ+12+Math.floor(r()*4), top=base-bh;
    for (y=top;y<base;y++) for (x=xx;x<xx+bw;x++){ var c=(x===xx)?P.s5:P.s4; if (r()<0.002) c=P.s3; if ((y-top)%6===3 && (x-xx)%7>=2 && (x-xx)%7<=4) c=(night&&hash(x,y)<0.4)?P.y3:P.m1; if (grey) c=M.mix(c,P.m3,3); w.px(x,y,c); }
    for (var k=0;k<6;k++) for (x=xx-1+k;x<xx+bw+1-k;x++) w.px(x,top-1-k,(k===5)?P.t3:((x+k)%3===0?P.t1:P.t2));
    xx+=bw+4+Math.floor(r()*14); }
  // Strommast und Leitungen
  var px=246; for (y=26;y<HZ+16;y++){ w.px(px,y,P.w1); w.px(px+1,y,P.w0); } w.hl(px-5,px+6,28,P.w1); w.px(px-5,27,P.s5); w.px(px+6,27,P.s5);
  for (x=0;x<W;x++){ var sag=Math.pow((x-px)/150,2)*8; w.px(x,rnd(28+sag),P.k2); if (x%2) w.px(x,rnd(31+sag*0.9),P.m1); } }

// ---------------------------------------------------------------- Jelas Haus
function jelaHouse(b,tod,night){ var w=RW(b,RG.wall), x, y, J=JH;
  for (y=J.eave;y<J.base;y++) for (x=J.x0;x<J.x1;x++){ var f=fbm(x*0.06,y*0.08), c=ra(R('e3 s3 s4 s5'),0.62+(f-0.5)*0.5,x,y); if (y>J.base-10 && bayer(x,y)<(y-J.base+10)/14) c=M.DN[c]; if (x===J.x1-1) c=P.s2; w.px(x,y,c); }
  for (x=J.x0;x<J.x1;x++){ w.px(x,J.base-1,P.s1); w.px(x,J.base-2,P.s2); }                                  // Sockel
  // Putzschäden
  [[50,64,6,4],[88,96,5,6],[6,100,8,4]].forEach(function(p){ for (y=p[1];y<p[1]+p[3];y++) for (x=p[0];x<p[0]+p[2];x++) if (hash(x,y)<0.75) w.px(x,y,((x+y)%3)?P.t2:P.s2); });
  // Dach: Ziegel, leicht vorstehend
  var rf=RW(b,RG.roof); for (y=J.eave-16;y<J.eave;y++){ var ins=(J.eave-y)*1.6; for (x=J.x0-4;x<J.x1+4-ins;x++){ var row=Math.floor((y-J.eave+16)/3), c2=((x+row*2)%5===0)?P.t1:((y%3===0)?P.t2:P.t3); if (y===J.eave-16) c2=P.t4; rf.px(x,y,c2); } }
  for (x=J.x0-4;x<J.x1+4;x++){ rf.px(x,J.eave,P.t1); rf.px(x,J.eave+1,P.k2); }
  w.rect(70,J.eave-22,6,8,P.s3); w.hl(69,76,J.eave-22,P.s5); w.rect(70,J.eave-23,6,1,P.s2);                 // Kamin
  // Küchenfenster mit Gardine und Topf
  var K=JW, g=RW(b,RG.glass); w.rect(K.x0-3,K.y0-3,K.x1-K.x0+6,K.y1-K.y0+6,P.s5); w.hl(K.x0-4,K.x1+3,K.y1+3,P.s6); w.hl(K.x0-4,K.x1+3,K.y1+4,P.s2);
  for (y=K.y0;y<K.y1;y++) for (x=K.x0;x<K.x1;x++){ var gl=(night)?P.y3:(((x+y)%11<2)?P.n3:P.n1); g.px(x,y,gl); }
  for (y=K.y0;y<K.y0+12;y++) for (x=K.x0;x<K.x1;x++){ if ((x+((y>>1)&1))%3===0||y===K.y0+11) w.px(x,y,night?P.y4:P.s6); else if (bayer(x,y)<0.5) w.px(x,y,night?P.y4:P.s5); }
  w.vl((K.x0+K.x1)>>1,K.y0,K.y1-1,P.s5); w.hl(K.x0,K.x1-1,K.y0,P.w2);
  w.rect(K.x0+3,K.y1-6,6,6,P.t3); w.hl(K.x0+2,K.x0+9,K.y1-7,P.t4); for (var i=0;i<7;i++) w.px(K.x0+3+i,K.y1-8-((i*3)%3),P.g3);      // Topf mit Pelargonie
  // Tür unter einem kleinen Vordach, Fußmatte, Wasserkanne
  var D=JD; w.rect(D.x0-2,D.top-2,D.x1-D.x0+4,J.base-D.top+1,P.s2); for (y=D.top;y<J.base-2;y++) for (x=D.x0;x<D.x1;x++){ var c3=((x-D.x0)%6===0)?P.w1:P.w2; if (y<D.top+12 && x>D.x0+2 && x<D.x1-3) c3=night?P.y2:P.n1; w.px(x,y,c3); }
  w.rect(D.x1-4,D.top+18,2,2,P.y3); for (x=D.x0-6;x<D.x1+6;x++){ w.px(x,D.top-4,P.t3); w.px(x,D.top-3,P.t1); } w.line(D.x0-6,D.top-3,D.x0-2,D.top+2,P.m1); w.line(D.x1+5,D.top-3,D.x1+1,D.top+2,P.m1);
  RW(b,RG.ground).rect(D.x0,J.base-1,D.x1-D.x0,2,P.r1); w.rect(D.x1+4,J.base-7,6,6,P.m2); w.hl(D.x1+4,D.x1+9,J.base-7,P.m3); w.line(D.x1+9,J.base-6,D.x1+12,J.base-9,P.m2);
  // Holzstapel an der Hauswand
  for (i=0;i<4;i++) for (var j=0;j<3;j++){ var lx=84+j*4+(i%2)*2, ly=J.base-3-i*3; w.rect(lx,ly,4,3,P.w2); w.px(lx+1,ly+1,P.w4); } }

// ---------------------------------------------------------------- Haus Zelenika (Gastarbeiterhaus der Siebziger)
function zelHouse(b,tod,night,weather){ var w=RW(b,RG.wall), x, y, Z=ZH, i;
  // Obergeschoss: rohe Ziegel (nie verputzt), Erdgeschoss verputzt
  for (y=Z.uf;y<Z.base;y++) for (x=Z.x0;x<Z.x1;x++){ var c;
    if (y<Z.gf-6){ var row=Math.floor((y-Z.uf)/3), off=(row&1)*4, col=Math.floor((x+off)/8), fu=(x+off)%8, fv=(y-Z.uf)%3; c=(fv===0||fu===0)?P.s2:((hash(col,row)<0.3)?P.t2:((hash(col,row)<0.85)?P.t3:P.t4)); }
    else { var f=fbm(x*0.05,y*0.07); c=ra(R('s3 s4 s5'),0.55+(f-0.5)*0.5,x,y); if (y>Z.base-8) c=M.DN[c]; }
    if (x===Z.x0) c=P.s5; w.px(x,y,c); }
  // Betonbalkon über dem Erdgeschoss mit Eisengeländer
  var bs=Z.gf-6; for (x=Z.x0-6;x<Z.x1;x++){ w.px(x,bs,P.s5); w.px(x,bs+1,P.s4); w.px(x,bs+2,P.s3); w.px(x,bs+3,P.s2); }
  var ir=RW(b,RG.iron); for (x=Z.x0-5;x<Z.x1;x++){ ir.px(x,bs-12,P.g1); if ((x-Z.x0)%4===0) ir.vl(x,bs-11,bs-1,P.g1); if ((x-Z.x0)%16===8){ ir.px(x-1,bs-6,P.g2); ir.px(x+1,bs-6,P.g2); ir.px(x,bs-7,P.g2); ir.px(x,bs-5,P.g2); } } ir.hl(Z.x0-5,Z.x1-1,bs-11,P.g2);
  // Fenster oben mit Rollladenkasten und halb heruntergelassenem Rollladen, Balkontür
  [[272,34],[330,34],[370,34]].forEach(function(p,k){ var fx=p[0], fy=p[1], fw=k===1?20:16, fh=18; w.rect(fx-2,fy-5,fw+4,4,P.w2); w.hl(fx-2,fx+fw+1,fy-5,P.w3);
    for (y=fy;y<fy+fh;y++) for (x=fx;x<fx+fw;x++){ var sh=(y<fy+fh*0.55); RW(b,sh?RG.wall:RG.glass).px(x,y,sh?(((y-fy)%2)?P.w1:P.w3):(night&&k===1?P.y3:P.n1)); }
    w.rect(fx-2,fy+fh,fw+4,2,P.s4); w.vl(fx-1,fy-1,fy+fh,P.s5); w.vl(fx+fw,fy-1,fy+fh,P.s3); });
  // Dach: Walmdach mit Ziegeln, Antenne, Kamin
  var rf=RW(b,RG.roof); for (y=Z.eave-16;y<Z.uf;y++){ var ins=Math.max(0,(Z.uf-2-y))*2.2; for (x=Z.x0-6+ins;x<Z.x1+20;x++){ var row2=Math.floor((y-Z.eave+16)/3), c2=((x+row2*3)%6===0)?P.t1:((y%3===0)?P.t2:P.t3); if (y===Z.uf-1||y===Z.uf-2) c2=(y===Z.uf-1)?P.k2:P.t1; rf.px(x,y,c2); } }
  rf.rect(352,Z.eave-24,7,12,P.s3); rf.hl(351,359,Z.eave-24,P.s5); rf.vl(318,Z.eave-34,Z.eave-14,P.m2); rf.hl(310,326,Z.eave-30,P.m2); rf.hl(313,323,Z.eave-26,P.m2); rf.hl(315,321,Z.eave-22,P.m2);
  // Erdgeschoss: zwei Fenster mit Rollläden, die Haustür (Holz und Glas) mit Vordach, Stufen
  [[272,70],[340,70]].forEach(function(p){ var fx=p[0], fy=p[1], fw=18, fh=20; w.rect(fx-2,fy-5,fw+4,4,P.w2);
    for (y=fy;y<fy+fh;y++) for (x=fx;x<fx+fw;x++){ var sh=(y<fy+6); RW(b,sh?RG.wall:RG.glass).px(x,y,sh?(((y-fy)%2)?P.w1:P.w3):((x-fx+(y-fy)*0.5)%9<1.5?P.n3:P.n1)); }
    w.rect(fx-3,fy+fh,fw+6,2,P.s5); w.hl(fx-3,fx+fw+2,fy+fh+2,P.s2); for (x=fx;x<fx+fw;x+=3) ir.vl(x,fy+6,fy+fh-1,P.k2); });
  var D=HD; w.rect(D.x0-3,D.top-3,D.x1-D.x0+6,Z.base-D.top,P.s2);
  for (y=D.top;y<Z.base-4;y++) for (x=D.x0;x<D.x1;x++){ var c3=((x-D.x0)%10===0)?P.w1:P.w3; if (y>D.top+3 && y<D.top+18 && (x-D.x0)%10>2 && (x-D.x0)%10<8) c3=(night?P.y2:P.n2); RW(b,RG.wood).px(x,y,c3); }
  w.rect(D.x1-4,D.top+20,2,3,P.y3); w.rect(D.x0-6,D.top-6,D.x1-D.x0+12,3,P.s5); w.hl(D.x0-6,D.x1+5,D.top-6,P.s6); w.hl(D.x0-6,D.x1+5,D.top-4,P.s2);
  for (i=0;i<2;i++){ w.rect(D.x0-4-i*2,Z.base-4+i*2,D.x1-D.x0+8+i*4,2,P.s4); w.hl(D.x0-4-i*2,D.x1+3+i*2,Z.base-4+i*2,P.s5); }
  w.rect(D.x0-12,D.top+10,6,7,P.m2); w.rect(D.x0-11,D.top+11,4,2,P.s5);                                           // Briefkasten
  // Weinstock: knorriger Stamm neben der Tür, am Draht unter dem Balkon entlang
  var pl=RW(b,RG.plant); for (y=Z.base-2;y>bs+6;y--){ var vx=rnd(292+Math.sin(y*0.3)*1.5); pl.px(vx,y,P.w1); pl.px(vx+1,y,P.w2); if (y%5===0) pl.px(vx+2,y,P.w1); }
  for (x=Z.x0+2;x<Z.x1-4;x++){ ir.px(x,bs+6,P.m3); } for (x=270;x<392;x++){ var vy=rnd(bs+7+Math.sin(x*0.15)*1.4+Math.sin(x*0.41)); pl.px(x,vy,P.w1); if (hash(x,3)<0.25) pl.line(x,vy,x+Math.round((hash(x,4)-0.5)*6),vy+3+Math.floor(hash(x,5)*5),P.w2); if (hash(x,6)<0.06) pl.px(x,vy+1,P.e3); }
  // Holzbank an der Hauswand
  var bw=RW(b,RG.wood), B=BENCH; bw.rect(B.x0,B.by-9,B.x1-B.x0,2,P.w3); bw.hl(B.x0,B.x1-1,B.by-9,P.w4); bw.rect(B.x0,B.by-17,B.x1-B.x0,2,P.w2); bw.hl(B.x0,B.x1-1,B.by-17,P.w3);
  [B.x0+2,B.x1-4].forEach(function(lx){ bw.rect(lx,B.by-7,2,7,P.w1); bw.vl(lx,B.by-18,B.by-10,P.w1); });
  // Gartenschlauch und Eimer am Haus
  for (i=0;i<14;i++){ var a=i/14*6.283; RW(b,RG.plant).px(rnd(382+Math.cos(a)*5),rnd(Z.base-14+Math.sin(a)*3),P.g2); } w.rect(376,Z.base-6,6,6,P.b1); w.hl(376,381,Z.base-6,P.b2); }

// ---------------------------------------------------------------- Feigenbaum: kurzer Stamm, der sich in einer Gabel in drei dicke, gewundene Äste teilt;
// glatte hellgraue Rinde, die Zweige enden in dicken Knospen. In einen eigenen Puffer gemalt, mit dunkler Kontur.
function figTree(b,x0,by,fx,fy,size,seed,wrapped){ var tb=new M.Buf(W,H,T), r=M.rng(seed), segs=[];
  function seg(xa,ya,xb,yb,ta,tbk,depth){ var n=Math.max(2,Math.ceil(Math.hypot(xb-xa,yb-ya))); for (var i=0;i<=n;i++){ var t=i/n; segs.push([lerp(xa,xb,t),lerp(ya,yb,t),lerp(ta,tbk,t),depth]); } }
  function br(x,y,ang,len,th,depth){ var cx=x, cy=y, a=ang, n=Math.max(2,Math.round(len/3)), step=len/n;
    for (var i=0;i<n;i++){ a+=(r()-0.5)*0.35-(a+Math.PI/2)*0.08*(depth>1?1:0); var nx=cx+Math.cos(a)*step, ny=cy+Math.sin(a)*step, t0=th*(1-i/n*0.3), t1=th*(1-(i+1)/n*0.3); seg(cx,cy,nx,ny,t0,t1,depth); cx=nx; cy=ny; }
    if (depth<3 && th>0.9){ var k=(depth===0)?2:2; for (var j=0;j<k;j++){ var na=a+(j?1:-1)*(0.38+r()*0.4)+(r()-0.5)*0.15; br(cx,cy,na,len*(0.58+r()*0.18),th*0.62,depth+1); } }
    else { segs.push([cx,cy,Math.max(1.1,th+0.7),9]); } }
  // Stamm bis zur Gabel, dann drei Hauptäste
  seg(x0,by,fx,fy,size*0.075,size*0.065,0);
  [-1.05,-0.45,0.2].forEach(function(o,k){ var a=-Math.PI/2+o*1.2+(r()-0.5)*0.12; br(fx+(k-1)*1.2,fy,a,size*(0.36+r()*0.08),size*0.05,1); });
  segs.forEach(function(s2){ var rr=Math.max(0.55,s2[2]);
    for (var yy=Math.floor(s2[1]-rr);yy<=s2[1]+rr;yy++) for (var xx=Math.floor(s2[0]-rr);xx<=s2[0]+rr;xx++){ var dx=xx+0.5-s2[0], dy=yy+0.5-s2[1]; if (dx*dx+dy*dy>rr*rr) continue;
      var u=(dx*0.9-dy*0.45)/Math.max(0.7,rr), c=u<-0.45?P.s4:(u<0.15?P.s3:(u<0.6?P.s2:P.m1)); if (s2[3]===9) c=(u<0)?P.s4:P.s3; if (rr<1.1) c=(u<0)?P.s3:P.s2;
      if (wrapped && s2[3]<=1 && yy<by-1){ var wv=Math.floor(xx*0.9+yy*1.6); c=((wv%4)===0)?P.e2:(u<-0.2?P.e4:(u<0.5?P.e3:P.e2)); if ((Math.floor(yy+xx*0.4)%6)===0) c=P.w1; }
      tb.px(xx,yy,c); } });
  // Wurzelanlauf
  for (var q=-5;q<=5;q++){ tb.px(x0+q,by,(Math.abs(q)<3)?P.s2:P.s1); if (Math.abs(q)<4) tb.px(x0+q,by-1,(q<0)?P.s3:P.s2); }
  M.outline(tb,P.s1);
  var w=RW(b,RG.tree); for (var i=0;i<tb.d.length;i++){ var c=tb.d[i]; if (c!==T) w.px(i%W,(i/W)|0,c); } }

// ---------------------------------------------------------------- Zaun: niedrige Mauer mit Eisengitter, gemauerte Pfosten mit Kappe, das offene Tor
function post(w,x,base,top,pw){ var y, xx; for (y=top;y<base;y++) for (xx=x;xx<x+pw;xx++){ var c=(xx===x)?P.s5:((xx===x+pw-1)?P.s2:P.s4); if ((y-top)%9===0 && y>top+4) c=P.s3; if (hash(xx,y)<0.06) c=P.s3; w.px(xx,y,c); }
  for (xx=x-1;xx<x+pw+1;xx++){ w.px(xx,top,P.s5); w.px(xx,top+1,P.s3); } for (var k=0;k<3;k++) for (xx=x+k;xx<x+pw-k;xx++) w.px(xx,top-1-k,k===2?P.s6:P.s4); }
function railing(w,ir,x0,y0,x1,y1,h0,h1,wallH0,wallH1){ // Mauer und Gitter zwischen zwei Fußpunkten (Perspektive: Höhe interpoliert)
  var n=Math.max(1,Math.abs(x1-x0)); for (var i=0;i<=n;i++){ var t=i/n, x=rnd(lerp(x0,x1,t)), yb=lerp(y0,y1,t), h=lerp(h0,h1,t), wh=lerp(wallH0,wallH1,t);
    for (var y=rnd(yb-wh);y<rnd(yb);y++) w.px(x,y,(y===rnd(yb-wh))?P.s5:(hash(x,y)<0.1?P.s2:P.s3));
    var top=rnd(yb-h); ir.px(x,top,P.g2); ir.px(x,top+1,P.g1); if (i%3===0){ for (y=top+1;y<rnd(yb-wh);y++) ir.px(x,y,P.g1); ir.px(x,top-1,P.y3); } } }

// ---------------------------------------------------------------- Boden: Gasse (Asphalt mit Flicken), Hof (Erde, Betonplatten, Gras)
function ground(b,tod,weather){ var w=RW(b,RG.ground), x, y;
  for (y=HZ;y<H;y++) for (x=0;x<W;x++){ if (REG[y*W+x]) continue; var yard=(x>fenceFrontX(Math.max(y,FP.base))+2 && y>=92) || x>POST.x+4, c;
    var d=(y-HZ)/(H-HZ);
    if (!yard){ var f=fbm(x*0.05,y*0.1); c=ra(R('m1 m2 m3 s3'),0.45+(f-0.5)*0.5,x,y); if (hash(x>>2,y>>1)<0.04) c=P.s2; if (Math.abs(fbm(x*0.02+5,y*0.05)-0.5)<0.012) c=P.k2; if (y>=128 && y<131 && x<60) c=(hash(x,y)<0.5)?P.m1:P.m2; }
    else { var near=(x>ZH.x0-8 && y<ZH.base+10); if (near || (y>116 && x>238)){ var sx=Math.floor(x/14), sy=Math.floor((y-80)/5); c=((x%14)<1||((y-80)%5)<1)?P.s2:((hash(sx,sy)<0.5)?P.s4:P.s3); }
      else { var e=fbm(x*0.07,y*0.12); c=ra(R('w0 w1 e1 e2 e3'),0.45+(e-0.5)*0.7,x,y); if (hash(x,y*1.3)<0.12) c=(hash(x,y)<0.5)?P.g3:P.g2; } }
    if (weather==='rain' && hash(x*3,y)<0.06) c=P.m4; w.px(x,y,c); }
  // Grasbüschel am Mauerfuß und unter den Bäumen
  var r=M.rng(5); for (var i=0;i<90;i++){ var gx=110+Math.floor(r()*280), gy=96+Math.floor(r()*26), h=2+Math.floor(r()*3); if (REG[gy*W+gx]!==RG.ground) continue; RW(b,RG.plant).line(gx,gy,gx+Math.round((r()-0.5)*2),gy-h,r()<0.5?P.g3:P.e3); } }

// ---------------------------------------------------------------- Laterne an der Gasse
function lamp(b,x,by,lit){ var w=RW(b,RG.iron); for (var y=by-60;y<by;y++){ w.px(x,y,P.m1); w.px(x+1,y,P.m0); } w.line(x,by-60,x+8,by-63,P.m1); w.rect(x+6,by-63,6,3,P.m2); RW(b,RG.lamp).hl(x+7,x+10,by-60,lit?P.y5:P.s4); LAMPP=[x+8,by-59]; }
var LAMPP=[60,40];

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), night=tod==='night'||tod==='dusk', wrapped=figsWrapped(GS), x, y;
  REG.fill(0);
  sky(b,tod,weather); far(b,tod,weather);
  jelaHouse(b,tod,night); zelHouse(b,tod,night,weather);
  var w=RW(b,RG.wall), ir=RW(b,RG.iron);
  // Zaun hinten: vom Pfosten schräg nach hinten bis zum Nachbargrundstück, dann die Hinterkante bis zum Haus
  railing(w,ir,POST.x+POST.w,POST.base-1,FENCE_BACK[1][0],FENCE_BACK[1][1],30,20,8,5);
  railing(w,ir,FENCE_BACK[1][0],FENCE_BACK[1][1],ZH.x0-1,92,20,20,5,5);
  lamp(b,104,100,night);
  ground(b,tod,weather);
  // Feigenbäume (der kleine hinten, der große vorn mit der Astgabel)
  figTree(b,FIG2.x,FIG2.by,FIG2.x+1,FIG2.by-12,64,21,wrapped); figTree(b,FIG1.x,FIG1.by,FORK.x,FORK.y+2,88,7,wrapped);
  if (wrapped){ // Schnur in Spiralen um die eingepackten Stämme
    [[FIG1.x,FIG1.by,FIG1.by-FORK.y-2],[FIG2.x,FIG2.by,12]].forEach(function(f){ for (var yy=f[1]-f[2];yy<f[1]-2;yy+=3){ var xm=rnd(lerp(f[0],f[0]-2,(f[1]-yy)/f[2])); b.px(xm-4,yy,P.w1); b.px(xm-2,yy+1,P.w1); b.px(xm,yy+1,P.w1); b.px(xm+2,yy+1,P.w1); b.px(xm+4,yy,P.w1); } }); }
  // Pfosten (Mates Platz) und der offene Torflügel, in den Hof gedreht
  post(w,POST.x,POST.base,POST.top,POST.w);
  var G=GATEW; for (x=G.x0;x<G.x1;x++){ var u=(x-G.x0)/(G.x1-G.x0), top=rnd(G.top-Math.sin(u*Math.PI)*4);
    ir.px(x,top,P.g2); ir.px(x,top+1,P.g1); ir.px(x,G.base-2,P.g1); ir.px(x,G.base-12,P.g1); if ((x-G.x0)%3===0){ for (y=top+1;y<G.base-1;y++) ir.px(x,y,P.g1); ir.px(x,top-1,P.y3); }
    if ((x-G.x0)%9===4){ ir.px(x,G.base-7,P.g2); ir.px(x-1,G.base-6,P.g2); ir.px(x+1,G.base-6,P.g2); ir.px(x,G.base-5,P.g2); } }
  ir.vl(G.x0,G.top-1,G.base-1,P.g2); ir.vl(G.x1-1,G.top-1,G.base-1,P.g2); ir.rect(G.x0-1,G.top+6,2,2,P.m3); ir.rect(G.x0-1,G.base-8,2,2,P.m3);
  // Astgabel: Schlüssel (nur wenn er frei ist)
  if (keyFree(GS)){ var kx=FORK.x, ky=FORK.y; b.px(kx-3,ky,P.y4); b.px(kx-2,ky,P.y4); b.px(kx-1,ky,P.y3); b.px(kx,ky,P.y3); b.px(kx+1,ky-1,P.y4); b.px(kx+2,ky-1,P.y2); b.px(kx+1,ky+1,P.y2); b.px(kx+2,ky,P.y5); b.px(kx-3,ky+1,P.y2); b.px(kx-1,ky+1,P.y2); }
  // Licht und Tageszeit
  if (tod==='day'){ M.light(b,function(x,y){ var g=REG[y*W+x]; if (g===RG.sky||g===RG.far) return 0; var s=(fbm(x*0.02,y*0.03)-0.5)*0.4;
      if (g===RG.ground && y<ZH.base+6 && x>ZH.x0-10) s-=0.6; if (g===RG.ground && Math.abs(x-FIG1.x-8)<26 && y>FIG1.by-4 && y<FIG1.by+8) s-=0.5; if (g===RG.ground && x<JH.x1 && y<JH.base+8) s-=0.5;
      if (weather==='grey') s-=0.25; return s; }); }
  else M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; }, lights:[[LAMPP[0],LAMPP[1]+40,60,0.9,46],[(JW.x0+JW.x1)/2,JW.y1+18,40,0.7,24],[HD.x0+10,HD.top+30,26,0.5,20]],
    after:function(b){ for (var y=JW.y0;y<JW.y1;y++) for (var x=JW.x0;x<JW.x1;x++){ var c=b.get(x,y); if (REG[y*W+x]===RG.glass||REG[y*W+x]===RG.wall) b.px(x,y,(hash(x,y)<0.5)?P.y4:P.y3); }
      b.hl(LAMPP[0]-1,LAMPP[0]+2,LAMPP[1]-1,P.y5); b.px(LAMPP[0],LAMPP[1],P.l1); } });
  return b; }

// ---------------------------------------------------------------- Ebenen: vorderer Zaunpfosten mit Mauerstück (vor allen, die dahinter stehen)
function layers(S,GS,tod){ var L=[];
  var l=M.layer(FP.x-24,FP.top-6,FP.w+28,H-FP.top+6,H), w=M.lw(l), ir={px:function(x,y,c){ w.px(x,y,c); },vl:function(x,y0,y1,c){ w.vl(x,y0,y1,c); }};
  // Mauerstück mit Gitter vom vorderen Pfosten zur Bildkante
  for (var x=FP.x-22;x<FP.x;x++){ var yb=lerp(H+2,FP.base,(x-FP.x+22)/22), wh=lerp(16,10,(x-FP.x+22)/22), h=lerp(46,36,(x-FP.x+22)/22);
    for (var y=rnd(yb-wh);y<Math.min(H,rnd(yb));y++) w.px(x,y,(y===rnd(yb-wh))?P.s5:(hash(x,y)<0.1?P.s2:P.s3));
    var top=rnd(yb-h); w.px(x,top,P.g2); w.px(x,top+1,P.g1); if (((x-FP.x)%3+3)%3===0){ for (y=top+1;y<rnd(yb-wh);y++) w.px(x,y,P.g1); w.px(x,top-1,P.y3); } }
  post(w,FP.x,FP.base,FP.top,FP.w);
  if (tod!=='day') M.tintApply(l,M.TINT[tod]||M.TINT.night);
  l.base=FP.base+1; L.push(l);
  return L; }

// ---------------------------------------------------------------- jedes Bild: ein Blatt weht, Rauch aus Jelas Kamin, Bura: Äste zittern
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, weather=M.scn.weather(GS), i;
  for (i=0;i<6;i++){ var ph=(t*0.35+i*0.17)%1, sx=rnd(73+Math.sin(t*0.8+i)*2+ph*(weather==='bura'?30:8))-cam, sy=rnd(JH.eave-24-ph*26); if (sx>=0&&sx<fb.w && bayer(sx,sy)<0.8-ph*0.7) fb.px(sx,sy,ph<0.4?P.s4:P.s3); }
  var k=(t*0.12)%1, lx=rnd(150+k*240+Math.sin(t*2)*8)-cam, ly=rnd(96+Math.sin(k*Math.PI)*-20+k*28); if (lx>=0 && lx<fb.w-1 && weather!=='rain'){ fb.px(lx,ly,P.e3); fb.px(lx+1,ly+((Math.floor(t*6))&1),P.e2); } }
function front(fb,v,S,GS){ if (M.scn.weather(GS)==='bura') M.scn.buraDebris(fb,v.t,110,140,v.cam); }

// ---------------------------------------------------------------- Geistersicht: am Pfosten die Abnutzung vom jahrelangen Anlehnen
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, x0=POST.x-cam, a=0.55+Math.sin(t*1.1)*0.15, x, y;
  // glatt geriebene, helle Stelle auf der Hofseite des Pfostens: Schulter und Rücken, jahrelang angelehnt
  for (y=POST.base-34;y<POST.base-4;y++) for (x=x0;x<x0+POST.w;x++){ if (x<0||x>=fb.w) continue; var u=(x-x0)/(POST.w-1), sh=Math.exp(-Math.pow((y-(POST.base-27))/5,2)), bk=Math.exp(-Math.pow((y-(POST.base-16))/8,2))*0.7, d=Math.max(sh,bk)*Math.max(0,u-0.15);
    if (d>0.08 && bayer(x,y+Math.floor(t*1.5))<d*a*1.6){ var k=y*fb.w+x; fb.d[k]=d>0.6?P.x5:M.UP[M.UP[fb.d[k]]]; } }
  for (y=POST.base-31;y<POST.base-8;y++){ var xx=x0+POST.w-1; if (xx>=0&&xx<fb.w && Math.sin(t*1.3+y*0.4)>-0.2) fb.px(xx,y,P.x6); }
  // ein Hauch Wärme auf der Kappe, wo die Hand lag
  for (var i=0;i<5;i++){ var px=x0+2+i, py=POST.top-1-(i===2?1:0); if (px>=0&&px<fb.w && Math.sin(t*2+i)>0) fb.px(px,py,P.x5); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>139||x<6||x>394) return false;
  if (y>FP.base-4 && Math.abs(x-fenceFrontX(y))<6) return false;                       // vorderes Zaunstück
  if (y>=FP.base-4 && y<=FP.base+2 && x>FP.x-6 && x<FP.x+FP.w+4) return false;          // vorderer Pfosten
  return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var d=Math.hypot(a.x-LAMPP[0],(a.y-LAMPP[1]-46)*1.4); return d<60?M.TINT.lamp.a:(M.TINT[tod]||M.TINT.night).a; }
M.defineArt('zelenika',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost, actorLut:actorLut,
  spots:{
    exit:[0,70,10,74],
    gate:[GATEW.x0-14,GATEW.top-6,GATEW.x1-GATEW.x0+14,GATEW.base-GATEW.top+10],
    post:[POST.x-2,POST.top-5,POST.w+4,POST.base-POST.top+5],
    figs:[FIG2.x-26,40,FIG1.x-FIG2.x+66,72],
    fork:[FORK.x-7,FORK.y-6,14,12],
    house_door:[HD.x0-4,HD.top-6,HD.x1-HD.x0+8,ZH.base-HD.top+6],
    jela_door:[JD.x0-3,JD.top-4,JD.x1-JD.x0+6,JH.base-JD.top+4],
    bench:[BENCH.x0-1,BENCH.by-19,BENCH.x1-BENCH.x0+2,20],
    vine:[270,ZH.gf,22,ZH.base-ZH.gf-6]
  },
  stands:{ exit:[10,124,'L'], gate:[124,120,'R'], post:[152,119,'L'], figs:[196,122,'B'], fork:[206,118,'B'], house_door:[312,116,'B'], jela_door:[70,117,'B'],
    bench:[352,118,'B'], vine:[284,116,'B'] },
  actorPos:{ jela:[60,117,'R'], davor:[232,121,'L'], lena:[118,121,'R'], mate:[150,115,'R'] },
  start:[40,124,'R'], entries:{ map:[14,124,'R'], zelenika_in:[312,117,'L'] }
});
})(M);
