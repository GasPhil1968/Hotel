/* ===== rooms/art/zelenika_in.js — Im Haus Zelenika: die Stube und, eine halbe Treppe höher, das Kinderzimmer (400 px, scrollend).
   Links die Stube: Tür zum Hof in der linken Wand, ein Fenster mit Gardine (Licht fällt schräg herein, Staub tanzt darin), die
   Kommode mit vier Schubladen (oben links Mates Schublade, ein wenig offen), darüber gerahmte Fotos (groß: Mate jung mit Koffer
   vor einem Bus), ein Kalender von 2010 (März), eine Pendeluhr, ein Röhrenfernseher mit Häkeldeckchen auf einem Schränkchen,
   der Tisch mit geblümtem Wachstuch und darauf ein Schuhkarton voller Briefe, Stühle, ein Teppich, ein Sofa mit Decke.
   Rechts die Treppe aus Terrazzo mit Holzhandlauf hinauf zu einem Absatz; dort steht die Tür zum Kinderzimmer offen: Tapete
   mit bunten Luftballons, ein weißes Kinderbett mit Decke und Kissen, ein Regal mit Spielzeug und einem bunten Kinderbuch
   (Titel unleserlich), ein kleines Fenster. Seit 1998 wartet das Zimmer. Geistersicht: ein goldener Schimmer am Bett. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, VP=[150,56], RECT=[30,18,384,98], F=100, FY=98;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var SPLIT=262;                                         // ab hier Treppenhaus (offen nach oben)
var DOORU=[4,26,36,98];                                // Tür zum Hof in der linken Wand
var WIN={x0:40,x1:78,y0:30,y1:68};                     // Fenster der Stube
var KOM={X0:92,X1:142,Y0:72,Z0:1,Z1:11};               // Kommode
var PH={x0:94,y0:32};                                  // Fotos über der Kommode
var CAL={x0:148,y0:36,w:12,h:20};                      // Kalender 2010
var CLK={x:178,y:30};                                  // Pendeluhr
var TVC={X0:200,X1:232,Y0:82,Z0:2,Z1:12};              // Fernsehschränkchen
var TBL={X0:110,X1:156,Y0:80,Z0:24,Z1:44};             // Tisch mit Wachstuch
var DAVOR=[88,113];                                    // Davor sitzt: Hüfte x, Füße y
var STAIR={X0:266,X1:322,Y1:60,Z0:0,Z1:20,n:8};        // Treppe hinauf zum Absatz (Y1 = Absatzhöhe)
var KID={x0:330,x1:374,y0:0,y1:58};                    // Türöffnung zum Kinderzimmer (Bildschirm)
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
function inUV(w,U){ return w && w.u>=U[0] && w.u<U[1] && w.v>=U[2] && w.v<U[3]; }

// ---------------------------------------------------------------- Licht: Fensterlicht (schräger Strahl), eine Deckenlampe, Licht aus dem Kinderzimmer
var WARM=M.tintMake(function(r,g,b){ return [r*0.95+18, g*0.84+8, b*0.66]; });
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
var LAMP=[136,20];
function lampAt(x,y){ var dx=(x-LAMP[0])/120, dy=(y-LAMP[1]-70)/70, d=dx*dx+dy*dy; var a=d<1?Math.pow(1-d,0.9)*0.75:0; var g=Math.hypot((x-LAMP[0])/12,(y-LAMP[1]-4)/6); if (g<1) a=Math.max(a,1-g*0.3); return a; }
// Lichtstrahl vom Fenster schräg nach rechts unten auf den Boden
function beamAt(x,y){ var t=(y-WIN.y0)/((FY+18)-WIN.y0); if (t<0||t>1) return 0; var xa=lerp(WIN.x0,WIN.x0+40,t), xb=lerp(WIN.x1,WIN.x1+62,t); if (x<xa||x>xb) return 0; var e=Math.min(x-xa,xb-x)/6; return Math.min(1,e)*(1-t*0.5); }
function winAt(x,y){ var dx=(x-WIN.x0-30)/120, dy=(y-80)/70, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.2):0; }
function vig(x,y){ var cx=(x-190)/240, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*2.0; }
var BEAM=1;
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.6+winAt(x,y)*0.7+lampAt(x,y)*0.35+beamAt(x,y)*0.9*BEAM+vig(x,y)*1.2; },ox,oy,mask); return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,lampAt(X2,Y2)+(tod==='night'?0:winAt(X2,Y2)*0.35))*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen
// Stube: Walzenmuster (aufgerollte Ornamente) auf hellem Ocker, unten eine Sockelleiste
function rollerWall(u,v,x,y,dim){ var c=P.s4, gu=((u%10)+10)%10, row=Math.floor(v/9), ou=(row&1)?5:0, du=(((u+ou)%10)+10)%10, gv=((v%9)+9)%9;
  if ((du===4||du===5) && (gv===3||gv===4)) c=P.e3; if (du===4 && gv===2) c=P.r2; if (du===5 && gv===5) c=P.g3; if ((du===3||du===6) && gv===4) c=P.e4;
  var f=fbm(u*0.03,v*0.04); if (f>0.64 && bayer(x,y)<(f-0.64)*3) c=M.DN[c];
  if (v>=92) c=(v===92)?P.w4:((v<95)?P.w2:P.w1);
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
// Treppenhaus: glatter Kalkputz
function stairWall(u,v,x,y){ var f=fbm(u*0.04,v*0.05), c=(f>0.62 && bayer(x,y)<(f-0.62)*3)?P.s4:P.s5; if (v>=92) c=(v===92)?P.s3:P.s2; return c; }
function wallBack(u,v,x,y){ var X=u+RECT[0], Y=v+RECT[1]; return X>=SPLIT?stairWall(X,Y,x,y):rollerWall(X,Y,x,y,0); }
function wallSide(u,v,x,y,sd){ var Y=v+RECT[1], c=sd==='L'?rollerWall(u*1.5,Y,x,y,1):stairWall(u*1.5+500,Y,x,y); return sd==='L'?c:M.DN[c]; }
// Parkett im Fischgrät
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z*1.3, a=Math.floor((X+Z)/6), b=Math.floor((X-Z)/6), even=((a+b)&1)===0, u=even?(X+Z):(X-Z), fr=((u/6)%1+1)%1;
  var c=even?P.w3:P.w2; if (fr<0.1) c=P.w1; var h=hash(a,b); if (h<0.12) c=P.w2; else if (h>0.94) c=P.w4; var g=fbm(X*0.04,Z*0.06); if (g>0.64 && bayer(x,y)<(g-0.64)*4) c=M.UP[c];
  if (f.X>SPLIT-2) c=((Math.floor(X/12)+Math.floor(f.Z/12))&1)?P.s3:P.s4;                                              // Treppenhaus: Terrazzoplatten
  return c; }
function ceilTex(xb,d,x,y){ if (xb>SPLIT) return undefined; var f=fbm(xb*0.02,d*0.06); return (f>0.62 && bayer(x,y)<(f-0.62)*3)?P.s4:P.s5; }

// ---------------------------------------------------------------- kleine Malhilfen
function frame(b,x,y,w,h,fc){ b.rect(x,y,w,h,fc[1]); b.hl(x,x+w-1,y,fc[2]); b.vl(x,y,y+h-1,fc[2]); b.hl(x,x+w-1,y+h-1,fc[0]); b.vl(x+w-1,y,y+h-1,fc[0]); }
// Foto: Mate jung mit Koffer vor einem Bus (Schwarzweiß, vergilbt)
function photoMate(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return ra(R('e1 e2 e3 e4 s4'),0.9-(yy-y)/h*0.6,xx,yy); });
  b.rect(x+1,y+3,w-2,h-7,P.e4); b.hl(x+1,x+w-2,y+3,P.s5); for (var wx=x+2;wx<x+w-2;wx+=3) b.rect(wx,y+5,2,3,P.e1); b.hl(x+1,x+w-2,y+h-5,P.e1); b.px(x+3,y+h-4,P.k2); b.px(x+w-4,y+h-4,P.k2);   // der Bus
  var cx=x+5; b.hl(cx-2,cx+2,y+5,P.k1); b.rect(cx-1,y+3,3,2,P.k1); b.px(cx,y+6,P.e4); b.px(cx-1,y+6,P.e4); b.rect(cx-1,y+7,3,h-11,P.k2); b.px(cx,y+8,P.s5);   // Hut, Gesicht, Anzug
  b.rect(cx+2,y+h-7,4,3,P.w1); b.hl(cx+2,cx+5,y+h-7,P.w2); b.px(cx+3,y+h-8,P.k2); b.px(cx-1,y+h-4,P.k1); b.px(cx+1,y+h-4,P.k1); }                                     // Koffer
function photoWed(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return ra(R('m1 m2 m3 m4'),0.85-(yy-y)/h*0.5,xx,yy); }); b.rect(x+2,y+3,3,h-4,P.k2); b.ellipse(x+3.5,y+2.5,1.2,1.4,P.s5); b.rect(x+5,y+3,4,h-4,P.s6); b.ellipse(x+7,y+2.5,1.2,1.4,P.s5); b.px(x+7,y+1,P.s6); }
function photoKid(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return (yy<y+h*0.6)?P.b3:P.g3; }); b.ellipse(x+w/2,y+3,1.6,1.8,P.p4); b.rect(rnd(x+w/2)-1,y+5,3,h-6,P.r3); b.px(rnd(x+w/2)-1,y+1,P.h2); b.px(rnd(x+w/2),y+1,P.h2); }
// Kalender 2010, aufgeschlagen beim März
function calendar(b,x,y,w,h){ b.px(x+(w>>1),y-2,P.m3); b.rect(x,y,w,h,P.s6); b.rect(x,y,w,8,P.b2); b.rect(x+1,y+1,w-2,6,P.g3); b.rect(x+2,y+4,w-4,3,P.g2); b.px(x+4,y+2,P.s6); b.px(x+8,y+3,P.y4);
  M.microText(b,'2010',x+(w>>1)-7,y+9,P.r2); for (var yy=y+15;yy<y+h-1;yy+=2) for (var xx=x+1;xx<x+w-1;xx+=2) b.px(xx,yy,P.m2); b.px(x+5,y+17,P.r3); b.hl(x,x+w-1,y+h-1,P.s3); }

// ---------------------------------------------------------------- Kinderzimmer (durch die offene Tür, eigener kleiner Fluchtpunkt)
var KVP=[352,28];
function kidsRoom(b,tod){ var x, y, K=KID, bk={x0:K.x0+10,x1:K.x1-6,y0:K.y0,y1:K.y1-12};
  for (y=K.y0;y<K.y1;y++) for (x=K.x0;x<K.x1;x++){ var c;
    if (x>=bk.x0 && x<bk.x1 && y<bk.y1){ // Rückwand: Ballontapete
      c=P.b4; var cu=((x-bk.x0)%11+11)%11, cv=((y+(Math.floor((x-bk.x0)/11)&1)*6)%12+12)%12, d=Math.hypot(cu-5,(cv-4)*0.9);
      var bc=[P.r3,P.y4,P.g4,P.b2,P.d4][(Math.floor((x-bk.x0)/11)+Math.floor((y+(Math.floor((x-bk.x0)/11)&1)*6)/12)*2)%5];
      if (d<2.4) c=(d<1)?M.UP[bc]:bc; else if (cu===5 && cv>6 && cv<11) c=P.s4; if (y>=bk.y1-3) c=(y===bk.y1-3)?P.s6:P.s4; }
    else if (y>=bk.y1){ var fx=(x-KVP[0])*(bk.y1-KVP[1])/Math.max(1,(y-KVP[1])); c=((Math.floor((fx+400)/6))&1)?P.w3:P.w4; if (hash(Math.floor(fx/6),3)<0.3) c=P.w2; }   // Dielen
    else c=(x<bk.x0)?P.b3:P.b2;                                                                                                       // Seitenwände
    b.px(x,y,c); }
  // kleines Fenster mit Vorhang an der Rückwand
  b.rect(bk.x0+3,6,10,10,P.s6); b.rect(bk.x0+4,7,8,8,tod==='night'?P.n1:P.b4); b.vl(bk.x0+8,7,14,P.s6); b.rect(bk.x0+1,5,3,13,P.r3); b.rect(bk.x0+12,5,3,13,P.r3);
  // Regal mit Spielzeug und dem bunten Kinderbuch (Titel unleserlich)
  var sx=K.x0+2; b.rect(sx,24,10,1,P.w4); b.rect(sx,34,10,1,P.w4); b.vl(sx,22,40,P.w2);
  b.rect(sx+1,26,3,8,P.r3); b.rect(sx+4,27,2,7,P.b2); b.rect(sx+6,26,3,8,P.y4); b.vl(sx+6,26,33,P.y5); b.px(sx+7,28,P.r3); b.px(sx+7,30,P.g4); b.px(sx+8,29,P.b2);   // das Kinderbuch: bunter Rücken
  b.rect(sx+2,30,1,1,P.s6); b.ellipse(sx+4,31.5,2,2,P.t3); b.px(sx+3,31,P.k2); b.px(sx+5,31,P.k2);                                                               // Teddy auf dem unteren Brett
  BOOK=[sx+5,25,5,10];
  // Kinderbett: weißes Holzbett mit Gitter, Decke mit Sternen, Kissen
  var bx0=bk.x0+12, bx1=K.x1-4, by=K.y1-6; b.rect(bx0,by-10,bx1-bx0,3,P.s6); b.rect(bx0,by-7,bx1-bx0,6,P.b3); b.hl(bx0,bx1-1,by-7,P.b4); for (x=bx0+2;x<bx1-1;x+=4) b.px(x,by-5,P.y4);
  b.rect(bx1-7,by-12,6,4,P.s6); b.hl(bx1-7,bx1-2,by-12,P.s5); b.vl(bx0,by-16,by,P.s6); b.vl(bx1-1,by-18,by,P.s6); b.hl(bx0,bx0+4,by-16,P.s6); for (x=bx0+2;x<bx0+8;x+=2) b.vl(x,by-14,by-11,P.s5);
  b.rect(bx0,by,bx1-bx0,2,P.s4); BED=[bx0-1,by-19,bx1-bx0+2,22];
  // Teppich, ein Ball
  b.ellipse(K.x0+14,K.y1-4,5,1.6,P.r2); b.ellipse(bk.x0+4,K.y1-8,2.2,2.2,P.r3); b.px(bk.x0+3,K.y1-9,P.s6); }
var BOOK=[0,0,0,0], BED=[0,0,0,0];

// ---------------------------------------------------------------- Malen
var REG=new Uint8Array(W*H);   // 1 = Kinderzimmer (eigene Beleuchtung), 2 = Fensterglas
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), x, y, i, night=tod==='night';
  BEAM=(weather==='rain'||weather==='grey'||tod!=='day')?0.35:1;
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  REG.fill(0);
  // Treppenhaus: oben offen (eine Etage höher sieht man die Wand weiter), Deckenkante der Stube als Balken
  for (y=0;y<RECT[1]+2;y++) for (x=SPLIT;x<W;x++){ var w=wallUV('R',x,y); if (x<RECT[2]) b.px(x,y,stairWall(x,y+60,x,y)); else if (w) b.px(x,y,M.DN[stairWall(w.u*1.5+500,w.v,x,y)]); }
  var cb=rp(R3.p(SPLIT,RECT[1],0)), cf=rp(R3.p(SPLIT,RECT[1],60)); b.line(cb[0],cb[1],cf[0],cf[1],P.s3); b.line(cb[0]+1,cb[1],cf[0]+1,cf[1],P.s5);
  for (y=0;y<RECT[1];y++) b.px(SPLIT,y,P.s3);
  // ---- linke Wand: Tür zum Hof (Holz, oben Riffelglas)
  var dq=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]), dq2=M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3]);
  b.poly(dq2,P.w1); b.poly(dq,function(x,y){ var w=wallUV('L',x,y); if (!w) return P.w2; var lv=(w.v-DOORU[2])/(DOORU[3]-DOORU[2]); if (lv>0.08 && lv<0.45 && w.u>DOORU[0]+3 && w.u<DOORU[1]-3) return ((x+y)%3===0)?P.s5:P.s4; return ((x+Math.floor(y/7))%5===0)?P.w2:P.w3; });
  var kn=rp(M.wallPt(SPEC,'L',DOORU[1]-3,66)); b.rect(kn[0],kn[1],2,3,P.y3); b.px(kn[0],kn[1],P.y5);
  // Garderobe neben der Tür mit Mates Hut und Mantel
  var hk=rp(M.wallPt(SPEC,'L',30,46)); b.hl(hk[0]-6,hk[0]+4,hk[1],P.w1); b.px(hk[0]-4,hk[1]+1,P.m3); b.px(hk[0]+2,hk[1]+1,P.m3);
  b.ellipse(hk[0]-4,hk[1]+4,4,1.5,P.m1); b.rect(hk[0]-6,hk[1]+1,5,3,P.m2); b.hl(hk[0]-6,hk[0]-2,hk[1]+3,P.k2);                    // grauer Filzhut
  b.poly([[hk[0]+1,hk[1]+2],[hk[0]+4,hk[1]+2],[hk[0]+6,hk[1]+26],[hk[0]-2,hk[1]+27]],function(xx,yy){ return (xx<hk[0]+2)?P.m1:(((xx+yy)%5===0)?P.m1:P.m2); });
  // ---- Fenster: Rahmen, Blick auf den Hof (Feigenzweige), Gardine, Fensterbank
  var Wn=WIN; b.rect(Wn.x0-4,Wn.y0-4,Wn.x1-Wn.x0+8,Wn.y1-Wn.y0+8,P.s5); b.hl(Wn.x0-4,Wn.x1+3,Wn.y0-4,P.s6);
  for (y=Wn.y0;y<Wn.y1;y++) for (x=Wn.x0;x<Wn.x1;x++){ var v=(y-Wn.y0)/(Wn.y1-Wn.y0), c=night?P.n0:((weather==='grey'||weather==='rain')?ra(R('m3 m4 s4'),v,x,y):ra(R('b2 b3 b4 b5'),0.3+v*0.7,x,y));
    if (v>0.7) c=night?P.k1:(hash(x>>1,y)<0.5?P.s3:P.e3); b.px(x,y,c); REG[y*W+x]=2; }
  [[Wn.x0+4,Wn.y1-1,Wn.x0+14,Wn.y0+12],[Wn.x0+14,Wn.y0+12,Wn.x0+26,Wn.y0+6],[Wn.x0+14,Wn.y0+12,Wn.x0+12,Wn.y0+3],[Wn.x0+26,Wn.y0+6,Wn.x1-2,Wn.y0+9],[Wn.x0+26,Wn.y0+6,Wn.x0+30,Wn.y0]].forEach(function(l){ b.line(l[0],l[1],l[2],l[3],night?P.k2:P.s2); });
  b.vl((Wn.x0+Wn.x1)>>1,Wn.y0,Wn.y1-1,P.s6); b.hl(Wn.x0,Wn.x1-1,Wn.y0+14,P.s6); for (y=Wn.y0;y<Wn.y1;y++) REG[y*W+((Wn.x0+Wn.x1)>>1)]=0;
  for (y=Wn.y0-2;y<Wn.y1+2;y++) for (x=Wn.x0-2;x<Wn.x1+2;x++){ var gx=x-Wn.x0; if (gx>8 && gx<Wn.x1-Wn.x0-8 && y<Wn.y1-6) continue; var m2=((gx+((y>>1)&1))%3===0); if (m2 || bayer(x,y)<0.45){ b.px(x,y,m2?P.s5:P.s6); REG[y*W+x]=0; } }   // Gardine (seitlich gerafft)
  b.hl(Wn.x0-6,Wn.x1+5,Wn.y0-3,P.y2); b.rect(Wn.x0-6,Wn.y1+3,Wn.x1-Wn.x0+12,3,P.s4); b.hl(Wn.x0-6,Wn.x1+5,Wn.y1+3,P.s6); b.hl(Wn.x0-6,Wn.x1+5,Wn.y1+5,P.s2);
  b.rect(Wn.x0+2,Wn.y1-2,5,5,P.t3); for (i=0;i<6;i++) b.px(Wn.x0+2+i,Wn.y1-4-(i%2),P.g3);                                                  // Topfpflanze
  // Heizkörper unter dem Fenster
  for (y=Wn.y1+8;y<Wn.y1+22;y++) for (x=Wn.x0+2;x<Wn.x1-2;x++){ var fu=(x-Wn.x0)%3; b.px(x,y,fu===0?P.s3:(fu===1?P.s6:P.s5)); } b.hl(Wn.x0+2,Wn.x1-3,Wn.y1+8,P.s6);
  // ---- Kommode mit vier Schubladen (oben links: Mates Schublade, einen Spalt offen), darauf ein Deckchen und eine Vase
  var K=KOM; R3.box(b,K.X0,K.X1,K.Y0,FY,K.Z0,K.Z1,{top:P.w3,front:P.w2,left:P.w1});
  var kf=rp(R3.p(K.X0,K.Y0,K.Z1)), kb=rp(R3.p(K.X1,FY,K.Z1)), kw=kb[0]-kf[0], kh=kb[1]-kf[1];
  b.hl(kf[0],kb[0],kf[1],P.w4); b.hl(kf[0],kb[0],kf[1]+1,P.w1);
  var half=kf[0]+rnd(kw/2), row1=kf[1]+2, row2=kf[1]+rnd(kh*0.36), row3=kf[1]+rnd(kh*0.68), bot=kb[1]-3;
  function drw(x0,y0,x1,y1,open){ b.rect(x0,y0,x1-x0,y1-y0,P.w3); b.hl(x0,x1-1,y0,P.w4); b.hl(x0,x1-1,y1-1,P.w1); b.vl(x1-1,y0,y1-1,P.w1); var gx=rnd((x0+x1)/2); b.rect(gx-2,rnd((y0+y1)/2)-1,4,2,P.y2); b.px(gx-2,rnd((y0+y1)/2)-1,P.y4);
    if (open){ b.rect(x0+1,y0-2,x1-x0-2,2,P.k2); b.hl(x0+1,x1-2,y0-2,P.w1); b.px(x0+3,y0-1,P.s5); b.px(x0+5,y0-1,P.s6); } }
  drw(kf[0]+2,row1+2,half,row2,true); drw(half+1,row1,kb[0]-2,row2,false); drw(kf[0]+2,row2+1,kb[0]-2,row3,false); drw(kf[0]+2,row3+1,kb[0]-2,bot,false);
  DRAWER=[kf[0]+1,row1-1,half-kf[0],row2-row1+2];
  for (x=kf[0]+4;x<kb[0]-4;x++){ if (hash(x,2)<0.8) b.px(x,kf[1]-1,P.s6); if (x%2===0) b.px(x,kf[1],P.s5); }                               // Häkeldeckchen
  b.rect(kb[0]-12,kf[1]-9,4,8,P.b2); b.vl(kb[0]-12,kf[1]-9,kf[1]-2,P.b3); b.line(kb[0]-10,kf[1]-9,kb[0]-13,kf[1]-16,P.g3); b.px(kb[0]-13,kf[1]-17,P.e4); b.line(kb[0]-10,kf[1]-9,kb[0]-7,kf[1]-15,P.g3); b.px(kb[0]-7,kf[1]-16,P.e4);   // Vase mit Trockenblumen
  b.rect(kf[0]+6,kf[1]-6,7,5,P.y2); b.rect(kf[0]+7,kf[1]-5,5,3,P.s5);                                                                            // kleines Foto im Rahmen
  // ---- Fotos an der Wand: Mate jung mit Koffer vor dem Bus (groß), Hochzeit, Davor als Kind
  frame(b,PH.x0,PH.y0,22,18,R('w0 w1 w2')); photoMate(b,PH.x0+2,PH.y0+2,18,14);
  frame(b,PH.x0+25,PH.y0+2,12,15,R('y1 y2 y3')); photoWed(b,PH.x0+27,PH.y0+4,8,11);
  frame(b,PH.x0+40,PH.y0+5,10,12,R('w0 w1 w2')); photoKid(b,PH.x0+42,PH.y0+7,6,8);
  b.line(PH.x0+11,PH.y0-5,PH.x0+2,PH.y0,P.k2); b.line(PH.x0+11,PH.y0-5,PH.x0+20,PH.y0,P.k2); b.px(PH.x0+11,PH.y0-6,P.y3);
  calendar(b,CAL.x0,CAL.y0,CAL.w,CAL.h);
  // Pendeluhr (Holzgehäuse, Glas, Pendel in dynamic)
  var C=CLK; b.rect(C.x-6,C.y-2,13,30,P.w1); b.hl(C.x-6,C.x+6,C.y-2,P.w3); b.rect(C.x-5,C.y-1,11,11,P.w2); b.ellipse(C.x+0.5,C.y+4.5,4.2,4.2,P.s5); for (i=0;i<12;i+=3){ var an=i/12*6.283; b.px(rnd(C.x+Math.cos(an)*3.4),rnd(C.y+4.5+Math.sin(an)*3.4),P.k2); }
  b.line(C.x,C.y+4,C.x,C.y+1,P.k1); b.line(C.x,C.y+4,C.x+2,C.y+5,P.k1); b.rect(C.x-4,C.y+11,9,15,P.k2); b.hl(C.x-4,C.x+4,C.y+11,P.w0); b.poly([[C.x-7,C.y-2],[C.x+7,C.y-2],[C.x,C.y-7]],P.w2);
  // ---- Fernsehschränkchen mit Röhrenfernseher auf Häkeldeckchen, Antenne
  var TV=TVC; R3.box(b,TV.X0,TV.X1,TV.Y0,FY,TV.Z0,TV.Z1,{top:P.w3,front:function(xx,yy){ return ((xx+yy)%7===0)?P.w1:P.w2; },left:P.w1});
  var tp=rp(R3.p(TV.X0+3,TV.Y0,TV.Z0+6)), tx=tp[0], ty=tp[1]; for (x=tx-3;x<tx+28;x++){ if (hash(x,5)<0.85) b.px(x,ty,P.s6); if (x%2===0) b.px(x,ty+1,P.s5); if (x%3===0) b.px(x,ty+2,P.s5); }
  b.rect(tx,ty-19,25,19,P.w2); b.hl(tx,tx+24,ty-19,P.w4); b.vl(tx,ty-19,ty-1,P.w3); b.rect(tx+2,ty-17,17,14,P.k1); b.rect(tx+3,ty-16,15,12,P.m1); b.px(tx+4,ty-15,P.m3); b.rect(tx+20,ty-17,4,15,P.m2); b.px(tx+21,ty-15,P.k2); b.px(tx+21,ty-12,P.k2); b.hl(tx+20,tx+23,ty-8,P.k1);
  b.line(tx+9,ty-19,tx+4,ty-30,P.m3); b.line(tx+12,ty-19,tx+18,ty-29,P.m3); for (x=tx+6;x<tx+20;x+=3) b.px(x,ty-19,P.s6);
  TVR=[tx-4,ty-31,33,34]; TVS=[tx+3,ty-16,15,12];
  // ---- Sofa an der Rückwand links neben dem Fenster? nein: ein Teppich unter dem Tisch
  b.poly([R3.p(96,FY,20),R3.p(172,FY,20),R3.p(172,FY,58),R3.p(96,FY,58)],function(x,y){ var f=R3.floor(x,y); if (!f) return P.r1; var u=(f.X-96)/76, v=(f.Z-20)/38, e=Math.min(u,1-u,v,1-v); if (e<0.04) return P.y2; if (e<0.09) return ((Math.floor(f.X/3)+Math.floor(f.Z/2))&1)?P.r1:P.b0; var md=Math.abs(u-0.5)*2+Math.abs(v-0.5)*2; if (md<0.45) return md<0.2?P.y2:P.b0; return (((Math.floor(f.X/4)+Math.floor(f.Z/3))%3)===0)?P.r1:P.r2; });
  // ---- Treppe aus Terrazzo mit Holzhandlauf, Absatz und die offene Tür zum Kinderzimmer
  stairs(b,tod);
  kidsRoom(b,tod); for (y=KID.y0;y<KID.y1;y++) for (x=KID.x0;x<KID.x1;x++) REG[y*W+x]=1;
  // Türrahmen und offener Türflügel
  for (y=KID.y0;y<KID.y1;y++){ b.px(KID.x0-1,y,P.w3); b.px(KID.x0-2,y,P.w1); b.px(KID.x1,y,P.w3); b.px(KID.x1+1,y,P.w1); }
  b.poly([[KID.x0,0],[KID.x0+8,2],[KID.x0+8,KID.y1-4],[KID.x0,KID.y1]],function(xx,yy){ return ((yy%12)<1)?P.s4:P.s5; }); for (y=0;y<KID.y1;y++){ REG[y*W+KID.x0]=0; } b.rect(KID.x0+6,30,2,2,P.y3);
  // ---- Deckenlampe (Glasschale)
  var lp=R3.p(LAMP[0]-14,RECT[1],26); LAMP=[rnd(lp[0]),rnd(lp[1])+8]; b.vl(LAMP[0],rnd(lp[1]),LAMP[1]-2,P.m2); b.ellipse(LAMP[0]+0.5,LAMP[1]+1,7,2.6,P.s6); b.hl(LAMP[0]-6,LAMP[0]+6,LAMP[1]+2,P.s4);
  // ---- Licht
  shade(b,0,0,tod,function(x,y){ return REG[y*W+x]!==2 && REG[y*W+x]!==1; });
  // das Kinderzimmer: still, kühler, etwas heller (eigenes Fenster)
  if (tod==='day') M.light(b,function(x,y){ return -0.25+Math.max(0,1-Math.hypot((x-KID.x0-18)/30,(y-10)/26))*0.6; },0,0,function(x,y){ return REG[y*W+x]===1; });
  else M.tintApply(b,M.TINT[tod]||M.TINT.night,KID.x0,KID.y0,KID.x1-KID.x0,KID.y1-KID.y0,function(x,y){ return REG[y*W+x]===1; });
  if (tod!=='day') M.tintApply(b,M.TINT[tod]||M.TINT.night,WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0,function(x,y){ return REG[y*W+x]===2; });
  b.ellipse(LAMP[0]+0.5,LAMP[1]+1,6,2,tod==='day'?P.s6:P.y4); if (tod!=='day') b.hl(LAMP[0]-5,LAMP[0]+5,LAMP[1]+2,P.y5);
  return b; }
var DRAWER=[0,0,0,0], TVR=[0,0,0,0], TVS=[0,0,0,0];

function stairs(b,tod){ var S=STAIR, n=S.n, i, x, y;
  var rise=(FY-S.Y1)/n, run=(S.X1-S.X0)/n;
  // Wangenwand unter der Treppe (verputzt) und die Stufen (Terrazzo), Absatz
  for (i=0;i<n;i++){ var X0=S.X0+i*run, X1=S.X0+(i+1)*run, Yt=FY-(i+1)*rise;
    R3.box(b,X0,S.X1+52,Yt,Yt+rise,S.Z0,S.Z1,{top:function(xx,yy){ return (hash(xx,yy)<0.15)?P.s3:((hash(xx*2,yy)<0.08)?P.t3:P.s4); },front:function(xx,yy){ return (hash(xx,yy*2)<0.1)?P.s2:P.s3; }}); }
  R3.box(b,S.X1,RECT[2],S.Y1,FY,S.Z0,S.Z1,{front:function(xx,yy){ return (fbm(xx*0.1,yy*0.1)>0.6)?P.s4:P.s5; },top:P.s4});            // Absatz (gemauert)
  // Handlauf aus Holz auf schlanken Stäben, an der vorderen Kante
  var p0=R3.p(S.X0,FY-14,S.Z1), p1=R3.p(S.X1,S.Y1-14,S.Z1), p2=R3.p(RECT[2],S.Y1-14,S.Z1);
  b.line(rnd(p0[0]),rnd(p0[1]),rnd(p1[0]),rnd(p1[1]),P.w3); b.line(rnd(p0[0]),rnd(p0[1])+1,rnd(p1[0]),rnd(p1[1])+1,P.w1); b.line(rnd(p1[0]),rnd(p1[1]),rnd(p2[0]),rnd(p2[1]),P.w3); b.line(rnd(p1[0]),rnd(p1[1])+1,rnd(p2[0]),rnd(p2[1])+1,P.w1);
  for (i=0;i<=n;i++){ var Xs=S.X0+i*run, Ys=FY-i*rise, a=R3.p(Xs,Ys,S.Z1), c2=R3.p(Xs,Ys-14,S.Z1); b.line(rnd(a[0]),rnd(a[1]),rnd(c2[0]),rnd(c2[1]),P.m2); }
  for (x=S.X1+8;x<RECT[2];x+=8){ var a2=R3.p(x,S.Y1,S.Z1), c3=R3.p(x,S.Y1-14,S.Z1); b.line(rnd(a2[0]),rnd(a2[1]),rnd(c3[0]),rnd(c3[1]),P.m2); }
  var np=R3.p(S.X0,FY,S.Z1), nt=R3.p(S.X0,FY-17,S.Z1); b.rect(rnd(np[0])-1,rnd(nt[1]),3,rnd(np[1]-nt[1]),P.w2); b.vl(rnd(np[0])-1,rnd(nt[1]),rnd(np[1])-1,P.w4); b.rect(rnd(nt[0])-2,rnd(nt[1])-2,5,2,P.w3);   // Pfosten am Antritt
  STAIRR=qrect([R3.p(S.X0,FY,S.Z1),R3.p(S.X1,S.Y1-16,S.Z1),R3.p(S.X1,S.Y1-16,S.Z0),R3.p(S.X0,FY,S.Z0)]); }
var STAIRR=[0,0,0,0];

// ---------------------------------------------------------------- Ebenen: Tisch mit Wachstuch und Schuhkarton (vor Davors Beinen), Stühle
var LETTERS=[0,0,0,0];
function layers(S,GS,tod){ var L=[];
  var tr=R3.rect(TBL.X0,TBL.X1,TBL.Y0,FY,TBL.Z0,TBL.Z1), l=M.layer(tr[0]-16,tr[1]-14,tr[2]+34,tr[3]+16,tr[1]+tr[3]), w=M.lw(l);
  // Wachstuch: weiß mit roten und gelben Blumen, hängt vorn über
  var oil=function(x,y){ var u=((x%7)+7)%7, v=((y%5)+5)%5, c=P.s5; if ((u===3&&v===2)) c=P.r3; else if ((u===2||u===4)&&v===2) c=P.r2; else if (u===3&&(v===1||v===3)) c=P.y3; else if ((x+y)%9===0) c=P.g3; return c; };
  R3.box(w,TBL.X0,TBL.X1,TBL.Y0,TBL.Y0+1,TBL.Z0,TBL.Z1,{top:oil,front:oil,left:P.s4});
  var f0=rp(R3.p(TBL.X0,TBL.Y0,TBL.Z1)), f1=rp(R3.p(TBL.X1,TBL.Y0,TBL.Z1)); w.rect(f0[0],f0[1],f1[0]-f0[0]+1,4,P.s5); for (var x=f0[0];x<=f1[0];x++){ w.px(x,f0[1]+4,(x%3)?P.s4:P.s3); if (((x-f0[0])%7)===3) w.px(x,f0[1]+2,P.r3); }
  [[TBL.X0+2,TBL.Z1-2],[TBL.X1-3,TBL.Z1-2]].forEach(function(lg){ var a=R3.p(lg[0],TBL.Y0+5,lg[1]), z=R3.p(lg[0],FY,lg[1]); w.rect(rnd(a[0]),rnd(a[1]),2,rnd(z[1]-a[1]),P.w1); });
  // Schuhkarton voller Briefe (Deckel daneben), ein Brief obenauf, eine Lesebrille
  var sb=rp(R3.p(TBL.X0+18,TBL.Y0,TBL.Z0+12)), bx=sb[0], by=sb[1];
  w.rect(bx,by-6,16,6,P.t3); w.hl(bx,bx+15,by-6,P.t4); w.vl(bx+15,by-6,by-1,P.t1); w.hl(bx,bx+15,by-1,P.t1);
  for (var k=0;k<7;k++){ w.rect(bx+1+k*2,by-9+(k%2),2,4,k%3===0?P.s6:(k%3===1?P.s5:P.b4)); w.px(bx+1+k*2,by-9+(k%2),P.r3); }
  w.poly([[bx+18,by-1],[bx+28,by-2],[bx+29,by],[bx+19,by+1]],P.t2); w.hl(bx+19,bx+27,by-1,P.t4);
  w.poly([[bx-12,by],[bx-3,by-1],[bx-2,by+1],[bx-11,by+2]],P.s6); w.line(bx-10,by,bx-5,by,P.b1); w.px(bx-4,by-1,P.r3);
  w.ellipse(bx-17,by-0.5,1.6,1,P.k2); w.ellipse(bx-13,by-0.5,1.6,1,P.k2); w.hl(bx-16,bx-14,by-1,P.k2);
  LETTERS=[bx-2,by-12,20,13];
  // Stuhl für Davor (Lehne links) und ein zweiter Stuhl rechts am Tisch
  chair(w,DAVOR[0]-1,DAVOR[1]-13,DAVOR[1],'L'); chair(w,f1[0]+8,f1[1]+6,f1[1]+22,'R');
  shade(l,l.ox,l.oy,tod); L.push(l);
  return L; }
function chair(b,x,sy,by,back){ var C=R('w0 w1 w2 w3'), s=back==='L'?-1:1, bx=x+s*5;
  b.line(x-s*4,sy+1,x-s*5,by,C[1]); b.line(bx,sy+1,bx+s,by,C[1]); b.hl(x-5,x+5,sy,C[3]); b.hl(x-5,x+5,sy+1,C[2]); b.hl(x-4,x+4,sy+2,C[0]);
  b.vl(bx,sy-14,sy,C[2]); b.vl(bx+s,sy-13,sy,C[0]); b.hl(Math.min(bx,bx-s*3),Math.max(bx,bx-s*3),sy-13,C[3]); b.hl(Math.min(bx,bx-s*3),Math.max(bx,bx-s*3),sy-8,C[2]); }

// ---------------------------------------------------------------- jedes Bild: Staub im Fensterlicht, das Pendel der Uhr, Fernseher aus
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, i;
  if (v.tod==='day') for (i=0;i<26;i++){ var u=(hash(i,7)+t*0.012*(0.5+hash(i,8)))%1, yy=rnd(WIN.y0+u*(FY+16-WIN.y0)), xa=lerp(WIN.x0,WIN.x0+40,u), xb=lerp(WIN.x1,WIN.x1+62,u), xx=rnd(xa+hash(i,9)*(xb-xa)+Math.sin(t*0.6+i)*2)-cam;
    if (Math.sin(t*1.3+i*2)>0.1 && xx>=0 && xx<fb.w) fb.px(xx,yy,P.s6); }
  // Pendel: schwingt im Sekundentakt hinter dem Glas
  var C=CLK, sw=Math.sin(t*Math.PI)*2.6, px=rnd(C.x+sw)-cam, py=C.y+23; if (px>-4 && px<fb.w+4){ fb.line(C.x-cam,C.y+12,px,py-2,P.y2); fb.rect(px-1,py-2,3,3,P.y3); fb.px(px,py-2,P.y5); } }

// ---------------------------------------------------------------- Geistersicht: ein goldener Schimmer am Kinderbett, warme, unbenutzte Erwartung
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, x0=BED[0]-cam, y0=BED[1], w=BED[2], h=BED[3], a=0.5+Math.sin(t*0.9)*0.2, x, y;
  for (y=y0-6;y<y0+h+2;y++) for (x=x0-6;x<x0+w+6;x++){ if (x<0||x>=fb.w||y<0) continue; var d=Math.hypot((x-x0-w/2)/(w*0.75),(y-y0-h*0.6)/(h*0.8)); if (d<1 && bayer(x,y+Math.floor(t*2))<(1-d)*a){ var k=y*fb.w+x; fb.d[k]=(d<0.45&&bayer(x+1,y)<0.5)?P.y4:M.UP[fb.d[k]]; } }
  for (var i=0;i<10;i++){ var ph=(t*0.18+hash(i,4))%1, gx=rnd(x0+hash(i,5)*w), gy=rnd(y0+h-ph*(h+8)); if (gx>=0&&gx<fb.w&&gy>=0 && ph<0.85) fb.px(gx,gy,ph<0.4?P.y5:P.y3); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<116||y>139||x<10||x>260) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3) return false; return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var L=levels(tod), f=Math.min(1,lampAt(a.x,a.y-24))*(L.length-1); return L[Math.round(f)].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3]));
// Rechtecke aus derselben Geometrie wie beim Malen (beim Laden berechnet)
(function(){ var K=KOM, kf=rp(R3.p(K.X0,K.Y0,K.Z1)), kb=rp(R3.p(K.X1,FY,K.Z1)), kw=kb[0]-kf[0], kh=kb[1]-kf[1], half=kf[0]+rnd(kw/2), row1=kf[1]+2, row2=kf[1]+rnd(kh*0.36);
  DRAWER=[kf[0]+1,row1-1,half-kf[0],row2-row1+2];
  var tp=rp(R3.p(TVC.X0+3,TVC.Y0,TVC.Z0+6)); TVR=[tp[0]-4,tp[1]-31,33,34]; TVS=[tp[0]+3,tp[1]-16,15,12];
  var sb=rp(R3.p(TBL.X0+18,TBL.Y0,TBL.Z0+12)); LETTERS=[sb[0]-2,sb[1]-12,20,13];
  var S2=STAIR; STAIRR=qrect([R3.p(S2.X0,FY,S2.Z1),R3.p(S2.X1,S2.Y1-16,S2.Z1),R3.p(S2.X1,S2.Y1-16,S2.Z0),R3.p(S2.X0,FY,S2.Z0)]);
  var bkx0=KID.x0+10, sx=KID.x0+2, bx0=bkx0+12, bx1=KID.x1-4, by=KID.y1-6; BOOK=[sx+5,25,5,10]; BED=[bx0-1,by-19,bx1-bx0+2,22]; })();
M.defineArt('zelenika_in',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{
    door:DQ,
    letters:LETTERS.slice(),
    drawer:DRAWER.slice(),
    photos:[PH.x0-1,PH.y0-7,52,26],
    tv:TVR.slice(),
    calendar:[CAL.x0-1,CAL.y0-3,CAL.w+2,CAL.h+4],
    stairs:[STAIRR[0],STAIRR[1],STAIRR[2]-20,STAIRR[3]],
    kidsroom:[KID.x0-2,KID.y0,KID.x1-KID.x0+4,KID.y1-KID.y0],
    kidsbook:[BOOK[0]-1,BOOK[1]-1,BOOK[2]+2,BOOK[3]+2],
    kidsbed:BED.slice()
  },
  stands:{ door:[24,120,'L'], letters:[128,118,'B'], drawer:[110,116,'B'], photos:[118,116,'B'], tv:[214,116,'B'], calendar:[154,116,'B'],
    stairs:[258,124,'R'], kidsroom:[258,122,'R'], kidsbook:[258,122,'R'], kidsbed:[258,122,'R'] },
  actorPos:{ davor:[DAVOR[0],DAVOR[1],'R'], lena:[282,124,'L'] },
  start:[26,121,'R'], entries:{ zelenika:[26,121,'R'] }
});
})(M);
