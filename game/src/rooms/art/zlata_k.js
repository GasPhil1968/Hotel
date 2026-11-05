/* ===== rooms/art/zlata_k.js — Zlatas Küche (320 px, Innenraum) =====
   Eine niedrige Bauernküche, weiß gekalkt, Bretterdecke mit dunklen Balken. Links an der Rückwand der gemauerte Holzherd
   (Šporet): weiß getüncht, Eisenplatte mit Ringen, eine Messingstange an der Kante, Feuertür mit Glut im Spalt, der Wasserkessel,
   das Ofenrohr in die Wand. Davor an der linken Wand ein schmales Bett mit grauen Armeedecken (schwarzer Streifen). In der Mitte
   das breite Küchenfenster (dasselbe wie von außen) mit dem Blick über den Fluss zum Hochufer; davor der Tisch mit Wachstuch und
   Schublade, zwei Stühle. Rechts ein Bord mit dem alten Radio (Holzgehäuse, Skala, Lämpchen), ein Kalender, Zwiebelzöpfe, die
   Leiter zur Luke der Dachkammer und die Tür in den Hof. Kein Heiligenbild.
   Malas Sicht: auf dem Bett am Herd eine Kuhle in der Luft, ein zarter Umriss, wo jemand lange lag. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;
var VP=[164,60], RECT=[58,36,262,96], F=92, FY=96, CY=36;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function p3(X,Y,Z){ var k=1+Z/F; return [VP[0]+(X-VP[0])*k, VP[1]+(Y-VP[1])*k]; }
function ip3(X,Y,Z){ var q=p3(X,Y,Z); return [rnd(q[0]),rnd(q[1])]; }
function unp(x,y,Z){ var k=1+Z/F; return [VP[0]+(x+0.5-VP[0])/k, VP[1]+(y+0.5-VP[1])/k]; }
function wq(sd,Z0,Z1,YT,YB){ return M.wallQuad(SPEC,sd,Z0,Z1,YT,YB); }

var DEPTH=new Float32Array(W*H), REG=new Uint8Array(W*H), RG={none:0,view:1,wall:2,floor:3,ceil:4,furn:5,frame:6,table:7,stove:8,bed:9,glass:10}, LAST=null;
function PW(b,reg,zf){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=reg; DEPTH[k]=typeof zf==='function'?zf(x,y):zf; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
function box3(b,X0,X1,Y0,Y1,Z0,Z1,f,reg){ reg=reg||RG.furn;
  function call(fill,x,y,zf){ if (typeof fill!=='function') return fill; var Z=zf(x,y), q=unp(x,y,Z); return fill(x,y,q[0],q[1],Z); }
  var zt=function(x,y){ return ((y+0.5-VP[1])/(Y0-VP[1])-1)*F; }, zr=function(x){ return ((x+0.5-VP[0])/(X1-VP[0])-1)*F; }, zl=function(x){ return ((x+0.5-VP[0])/(X0-VP[0])-1)*F; }, zfr=function(){ return Z1; };
  if (Y0>VP[1] && f.top!==undefined) PW(b,reg,zt).poly([p3(X0,Y0,Z0),p3(X1,Y0,Z0),p3(X1,Y0,Z1),p3(X0,Y0,Z1)],function(x,y){ return call(f.top,x,y,zt); });
  if (X1<VP[0] && f.right!==undefined) PW(b,reg,zr).poly([p3(X1,Y0,Z0),p3(X1,Y0,Z1),p3(X1,Y1,Z1),p3(X1,Y1,Z0)],function(x,y){ return call(f.right,x,y,zr); });
  if (X0>VP[0] && f.left!==undefined) PW(b,reg,zl).poly([p3(X0,Y0,Z0),p3(X0,Y0,Z1),p3(X0,Y1,Z1),p3(X0,Y1,Z0)],function(x,y){ return call(f.left,x,y,zl); });
  if (f.front!==undefined) PW(b,reg,zfr).poly([p3(X0,Y0,Z1),p3(X1,Y0,Z1),p3(X1,Y1,Z1),p3(X0,Y1,Z1)],function(x,y){ return call(f.front,x,y,zfr); }); }

// ---------------------------------------------------------------- Maße (X quer wie auf der Rückwand, Y Höhe, Boden 96, Z Tiefe)
var SV={X0:84,X1:122,Y0:76,Z0:0,Z1:18};                     // Herd (gemauert)
var PIPE={X:97,Z:6,Y1:44};                                   // Ofenrohr
var BED={X0:58,X1:84,Y0:81,Z0:24,Z1:78};                     // Bett an der linken Wand (bis an die Wand)
var WN={X0:132,X1:184,Y0:50,Y1:72};                          // das breite Küchenfenster
var TB={X0:128,X1:176,Y0:80,Z0:42,Z1:62};                    // Tisch
var DRW={X0:141,X1:163,Y0:81.2,Y1:84.4};                     // Schublade (vorne im Tischrahmen)
var CA={X0:112,X1:123,Z0:46,Z1:57,YS:88,YB:76};              // Stuhl links (Lehne links)
var CB={X0:182,X1:193,Z0:44,Z1:55,YS:88,YB:76};              // Stuhl rechts (Lehne rechts)
var SH={X0:200,X1:232,Y:62};                                 // Bord für das Radio
var RAD={X0:205,X1:225,Y0:49,Y1:62};                         // Radio
var CAL={X0:188,X1:198,Y0:42,Y1:56};                         // Kalender
var ONI=[[124,38],[128,39]];                                 // Zwiebelzöpfe (Nagel)
var LAD={X0:236,X1:250,Z:8};                                 // Leiter an der Rückwand rechts, bis zur Luke
var HATCH={X0:230,X1:256,Z0:2,Z1:16};
var DOOR={u0:40,u1:62,v0:46,v1:96};                          // Tür in der rechten Wand
var LX=158;                                                  // Licht: Fenster

// ---------------------------------------------------------------- Wände, Boden, Decke
var LIME=R('s2 s3 s4 s5 s6');
function wallC(u,v,x,y,sd){ var Y=CY+v, n=fbm(u,v,22,sd), base=0.68+(n-0.5)*0.12; if (fbm(u*0.6,v*1.4,9,sd+3)>0.74) base-=0.08;
  if (Y>84){ if (Y<85) return P.e1; return ra(R('e1 e2 e3 e2'),0.55+(fbm(u,v,10,sd+2)-0.5)*0.3,x,y); }   // ockerfarbener Sockel
  if (Y>83) return P.s3;
  return ra(LIME,base-(Y<CY+3?0.2:0),x,y); }
var BZ=[14,52,90,128,166], BW=7, BT=2;
function ceilPx(xb,x,y){ var k=y*W+x, kc=(VP[1]-y)/(VP[1]-CY), ku=(VP[1]-y)/(VP[1]-CY-BT), Zu=(ku-1)*F, i;
  REG[k]=RG.ceil;
  for (i=0;i<BZ.length;i++) if (Zu>=BZ[i]&&Zu<BZ[i]+BW){ DEPTH[k]=Zu; return ((Zu-BZ[i])<0.8||(BZ[i]+BW-Zu)<0.8)?P.w0:(hash(Math.floor(xb/9),i)<0.5?P.w1:P.w0); }
  var best=-1; for (i=0;i<BZ.length;i++){ var k1=1+(BZ[i]+BW)/F; if (k1>=kc && k1<=ku && k1>best) best=k1; }
  if (best>0){ DEPTH[k]=(best-1)*F; return P.w1; }
  var Zc=(kc-1)*F; DEPTH[k]=Zc; var bx=((xb-58)%9+9)%9, c=ra(R('w1 w2 w3 e2'),0.5+(fbm(xb,Zc*0.3,9,6)-0.5)*0.4,x,y); if (bx<0.9) c=P.w0; if (hash(Math.floor(xb/9),Math.floor(Zc/24))<0.12) c=M.DN[c];
  // Luke der Dachkammer
  if (xb>=HATCH.X0&&xb<HATCH.X1&&Zc>=HATCH.Z0&&Zc<HATCH.Z1){ c=(xb<HATCH.X0+1.5||xb>HATCH.X1-1.5||Zc<HATCH.Z0+1.2||Zc>HATCH.Z1-1.2)?P.w0:P.k1; }
  return c; }
function paintRoom(b){
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ var k=y*W+x; REG[k]=RG.wall; DEPTH[k]=0; return wallC(u+58,v,x,y,1); },
    side:function(u,v,x,y,sd){ var k=y*W+x; REG[k]=RG.wall; DEPTH[k]=u; return wallC(u*1.5+(sd==='L'?0:300),v,x,y,sd==='L'?3:5); },
    floor:function(xb,d,x,y){ var k=y*W+x, f=R3.floor(x+0.5,y+0.5); REG[k]=RG.floor; DEPTH[k]=f?f.Z:0; var c=tex.planks(xb,y,VP[1],FY,R('w1 w2 w2 w3'),10); if (f && hash(Math.floor(f.X/10),Math.floor(f.Z/30))<0.25 && c!==P.w0) c=M.DN[c]; return c; },
    ceil:function(xb,d,x,y){ return ceilPx(xb,x,y); } });
  var bw=PW(b,RG.wall,0); bw.hl(58,261,95,P.w1); bw.hl(58,261,94,P.w0);
  bw.line(96,40,100,47,P.s3); bw.line(100,47,98,52,P.s3); }

// ---------------------------------------------------------------- Fenster: Hof, Fluss, das Hochufer drüben mit Glocke und Hütte
function paintWindow(b,tod,wea){ var v=PW(b,RG.view,-4), x0=WN.X0+2, x1=WN.X1-2, y0=WN.Y0+2, y1=WN.Y1-1, x, y, night=tod==='night', grey=wea==='grey';
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var c, u=(x-x0)/(x1-x0);
    if (y<y0+5) c=night?(hash(x,y)<0.05?P.n4:P.k1):(grey?ra(R('m3 m4 s4'),0.4+(y-y0)/5*0.5,x,y):ra(R('b2 b3 b4 b5'),0.3+(y-y0)/5*0.6,x,y));
    else if (y<y0+7) c=night?P.k2:(grey?P.m3:P.b3);                                                                     // Berge
    else if (y<y0+11) c=night?P.k1:ra(R('s1 s2 s3 s4'),0.6-(y-y0-7)/4*0.4+(hash(x,y)-0.5)*0.3,x,y);                 // Felswand des Hochufers
    else if (y<y0+14) c=night?P.k0:(((x+y)%5===0)?P.a4:P.a3);                                                           // Fluss
    else c=night?P.k1:ra(R('e1 e2 g2 e3'),0.4+(fbm(x,y,3,2)-0.5)*0.8,x,y);                                             // Hof, Zaun
    v.px(x,y,c); }
  // Hütte und Glockenpfosten drüben, winzig; der Zaun im Hof
  if (!night){ v.rect(x0+34,y0+5,5,2,P.s2); v.px(x0+35,y0+4,P.s1); v.vl(x0+22,y0+3,y0+7,P.w1); v.px(x0+21,y0+4,P.y3); }
  for (x=x0;x<x1;x+=3) v.vl(x,y0+14,y0+17,night?P.k0:P.w1);
  // Vorhang: Spitze über die untere Hälfte, eine Stange
  var cy0=y0+11; for (y=cy0;y<y1;y++) for (x=x0;x<x1;x++){ var uu=x-x0, w2=y-cy0, net=((uu+w2)%4===0)||((uu-w2+64)%4===0), mot=Math.hypot(((uu%10)-5),((w2%8)-4)*1.2)<2.2;
    var c2=net?P.s6:(bayer(x,y)<0.3?P.s5:b.get(x,y)); if (mot) c2=((uu+w2)%2)?P.s6:P.s4; if (w2===0&&(uu%3)!==1) c2=P.s6; if (night) c2=net||mot?P.s3:b.get(x,y); v.px(x,y,c2); }
  for (x=x0;x<x1;x++) v.px(x,cy0-1,P.m3);
  // Rahmen, Sprossen (drei Flügel wie außen), Laibung, Fensterbrett
  var fr=PW(b,RG.frame,-1);
  for (y=WN.Y0;y<WN.Y1;y++){ fr.px(WN.X0,y,P.s5); fr.px(WN.X0+1,y,P.s4); fr.px(WN.X1-1,y,P.s3); fr.px(WN.X1-2,y,P.s4); }
  for (x=WN.X0;x<WN.X1;x++){ fr.px(x,WN.Y0,P.s5); fr.px(x,WN.Y0+1,P.s4); fr.px(x,WN.Y1-1,P.s3); }
  [WN.X0+Math.round((WN.X1-WN.X0)/3),WN.X0+Math.round((WN.X1-WN.X0)*2/3)].forEach(function(mx){ for (y=WN.Y0;y<WN.Y1;y++){ fr.px(mx,y,P.s4); fr.px(mx-1,y,P.s5); } });
  for (x=WN.X0;x<WN.X1;x++) fr.px(x,WN.Y0+Math.round((WN.Y1-WN.Y0)*0.4),P.s4);
  box3(b,WN.X0-3,WN.X1+3,WN.Y1,WN.Y1+2.5,0,7,{top:P.s5,front:P.s3,left:P.s2,right:P.s4},RG.frame);
  // auf dem Fensterbrett: ein Glas mit eingelegten Paprika, eine Brille
  var gp=ip3(128,WN.Y1,3), g=PW(b,RG.furn,3); g.rect(gp[0]-2,gp[1]-6,5,6,P.r2); g.hl(gp[0]-2,gp[0]+2,gp[1]-7,P.m3); g.px(gp[0]-1,gp[1]-4,P.r3); g.px(gp[0]+1,gp[1]-2,P.y3); g.vl(gp[0]+2,gp[1]-6,gp[1]-1,P.s5);
  var bp=ip3(170,WN.Y1,4); g.px(bp[0]-2,bp[1]-1,P.k1); g.px(bp[0]+2,bp[1]-1,P.k1); g.hl(bp[0]-1,bp[0]+1,bp[1]-2,P.k2); }

// ---------------------------------------------------------------- Rückwand: Herd, Ofenrohr, Kessel; Bord mit Radio, Kalender, Zwiebeln
function paintBack(b,S,tod){ var x, y;
  // Herd: gemauert, getüncht, oben die Eisenplatte mit zwei Ringen, Messingstange vorn, Feuertür, Backrohr, Holzlade
  box3(b,SV.X0,SV.X1,SV.Y0,96,SV.Z0,SV.Z1,{top:function(x,y,X,Y,Z){ var d1=Math.hypot((X-95)/5,(Z-11)/3.2), d2=Math.hypot((X-109)/4.4,(Z-11)/2.8); if (Math.abs(d1-1)<0.28||Math.abs(d2-1)<0.3) return P.m2; if (d1<0.35||d2<0.3) return P.m0; if (Z>SV.Z1-1.2) return P.m3; if (X>SV.X1-6) return P.s3; return (hash(x,y)<0.15)?P.m0:P.k2; },
    left:function(x,y,X,Y,Z){ return ra(LIME,0.55+(hash(x>>1,y)-0.5)*0.2,x,y); },
    front:function(x,y,X,Y){ var oX=X-SV.X0, c=ra(R('s3 s4 s5'),0.6+(fbm(X,Y,6,4)-0.5)*0.4,x,y);
      if (Y<76.8) return P.m3; if (Y<77.6) return P.y3; if (Y<78.2) return P.y1;                                                  // Kante, Messingstange
      if (Y>94.5) return P.s2;                                                                                                   // Sockel
      if (oX>3&&oX<16&&Y>80&&Y<86){ c=P.k1; if (oX>4&&oX<15&&Y>80.6&&Y<85.4){ c=((Math.floor(X*1.4))%2)?P.k2:P.m0; } if (Math.abs(Y-83)<0.5&&oX>6&&oX<13) c=P.t1; if (Math.abs(oX-9.5)<1&&Math.abs(Y-81.3)<0.5) c=P.m4; }   // Feuertür
      if (oX>19&&oX<36&&Y>80&&Y<91){ c=P.k2; if (oX>20&&oX<35&&Y>80.7&&Y<90.3){ c=(Y<81.5)?P.m2:P.m1; if (Math.abs(Y-85.5)<0.5&&oX>23&&oX<32) c=P.m3; } if (Math.abs(Y-81.1)<0.4&&oX>23&&oX<32) c=P.s6; }   // Backrohr
      if (oX>3&&oX<16&&Y>88&&Y<93){ c=P.w1; if (Math.abs(Y-90.5)<0.5&&Math.abs(oX-9.5)<3) c=P.w3; }                            // Holzlade
      if (hash(Math.floor(X*1.3),Math.floor(Y*2))<0.05) c=M.DN[c]; return c; }},RG.stove);
  // Messingstange: Halter
  [SV.X0+3,SV.X1-3].forEach(function(X){ var q=ip3(X,77,SV.Z1+0.5), w=PW(b,RG.stove,SV.Z1+0.5); w.px(q[0],q[1],P.y2); w.px(q[0],q[1]+1,P.y1); });
  // Ofenrohr: hoch, Knie, in die Wand mit Rosette
  var pw=PW(b,RG.stove,PIPE.Z), pb=ip3(PIPE.X,SV.Y0,PIPE.Z), pt=ip3(PIPE.X,PIPE.Y1,PIPE.Z);
  for (y=pt[1];y<pb[1];y++){ pw.px(pb[0]-2,y,P.m3); pw.px(pb[0]-1,y,P.m2); pw.px(pb[0],y,P.m1); pw.px(pb[0]+1,y,P.m0); if ((y-pt[1])%10===0){ pw.hl(pb[0]-2,pb[0]+1,y,P.m4); } }
  var rp=ip3(PIPE.X,PIPE.Y1-3,0); pw.rect(pt[0]-2,pt[1]-4,4,4,P.m1); pw.ellipse(rp[0]+0.5,rp[1]+0.5,3.5,2.5,P.m2); pw.ellipse(rp[0]+0.5,rp[1]+0.5,2,1.4,P.k1);
  // Ruß an der Wand über dem Herd
  for (y=40;y<74;y++) for (x=84;x<122;x++){ var k=y*W+x; if (REG[k]!==RG.wall) continue; var s=Math.exp(-Math.pow((x-99)/12,2))*(1-(74-y)/40); if (bayer(x,y)<s*0.6) b.d[k]=M.DN[b.d[k]]; }
  // Wasserkessel (Emaille, angeschlagen) auf der Platte
  var kq=ip3(108,SV.Y0,11), kw=PW(b,RG.furn,12); kw.ellipse(kq[0]+0.5,kq[1]-3,5,3.4,function(xx,yy){ return (xx<kq[0]-1)?P.s5:((xx<kq[0]+3)?P.s4:P.s3); }); kw.hl(kq[0]-4,kq[0]+4,kq[1]-1,P.b1); kw.hl(kq[0]-3,kq[0]+3,kq[1],P.k1);
  kw.rect(kq[0]-1,kq[1]-8,3,2,P.s4); kw.px(kq[0],kq[1]-9,P.k2); kw.line(kq[0]+4,kq[1]-4,kq[0]+8,kq[1]-7,P.s4); kw.line(kq[0]-4,kq[1]-6,kq[0]-1,kq[1]-10,P.k2); kw.line(kq[0]+3,kq[1]-6,kq[0],kq[1]-10,P.k2); kw.px(kq[0]-2,kq[1]-3,P.k2);
  KETTLE=[kq[0]+8,kq[1]-8];
  // eine Pfanne an der Wand, ein Schürhaken, Holz neben dem Herd
  var pn=PW(b,RG.furn,0.2), pq=ip3(76,56,0); pn.ellipse(pq[0]+0.5,pq[1]+0.5,4,4,P.k2); pn.ellipse(pq[0]+0.5,pq[1]+0.5,2.6,2.6,P.m0); pn.line(pq[0],pq[1]-4,pq[0],pq[1]-9,P.k1); pn.px(pq[0],pq[1]-10,P.m2);
  box3(b,SV.X1+2,SV.X1+12,88,96,6,16,{top:function(x,y){ return ((x+y)%3)?P.w3:P.w4; },front:function(x,y,X,Y){ var r=Math.hypot((X-(Math.floor((X-SV.X1)/3.3)*3.3+SV.X1+1.6)),(Y-(Math.floor((Y-88)/2.7)*2.7+89.3))); return r<1.1?P.w4:(r<1.5?P.w2:P.w1); },left:P.w1});
  // Bord und Radio: Holzgehäuse, Stoffbespannung, Skala, zwei Knöpfe, ein Lämpchen
  var sw=PW(b,RG.furn,1), s0=ip3(SH.X0,SH.Y,0), s1=ip3(SH.X1,SH.Y,0); box3(b,SH.X0,SH.X1,SH.Y,SH.Y+1.6,0,6,{top:P.w3,front:P.w2,left:P.w1});
  [SH.X0+4,SH.X1-4].forEach(function(X){ var q=ip3(X,SH.Y+1.6,1); sw.line(q[0],q[1],q[0],q[1]+3,P.w1); });
  box3(b,RAD.X0,RAD.X1,RAD.Y0,RAD.Y1,0.5,5,{top:P.w3,left:P.w1,front:function(x,y,X,Y){ var c=(Y<RAD.Y0+1)?P.w4:P.w2; var fx=X-RAD.X0, fy=Y-RAD.Y0;
      if (fx>1.5&&fx<9&&fy>2&&fy<11) c=(((Math.floor(X*1.8))+(Math.floor(Y*1.8)))%2)?P.e2:P.e3;                                    // Stoff
      if (fx>10&&fx<18.5&&fy>2&&fy<6){ c=P.s5; if (Math.abs(fy-4)<0.5) c=P.e2; if (Math.abs(fx-14.5)<0.4) c=P.r3; }               // Skala mit Zeiger
      if ((Math.hypot(fx-12,fy-9)<1.3)||(Math.hypot(fx-16.5,fy-9)<1.3)) c=P.k1; return c; }});
  RLAMP=ip3(RAD.X0+18.5,RAD.Y0+9,5);
  // Kalender (ein Bauernkalender ohne Bild eines Heiligen: Landschaft, Monat), Zwiebel- und Knoblauchzöpfe
  var kw2=PW(b,RG.furn,0.2), cx0=CAL.X0, cy0=CAL.Y0, cw=CAL.X1-CAL.X0;
  kw2.px(cx0+5,cy0-3,P.k1); kw2.line(cx0+1,cy0,cx0+5,cy0-3,P.m1); kw2.line(cx0+9,cy0,cx0+5,cy0-3,P.m1);
  kw2.rect(cx0,cy0,cw,CAL.Y1-cy0,P.s5); kw2.vl(CAL.X1,cy0+1,CAL.Y1,P.c1); kw2.hl(cx0+1,CAL.X1,CAL.Y1,P.c1);
  kw2.rect(cx0+1,cy0+1,cw-2,5,P.b3); for (x=cx0+1;x<cx0+cw-1;x++){ var hh=rnd(2+Math.sin(x*0.9)*1.2); for (y=cy0+6-hh;y<cy0+6;y++) kw2.px(x,y,P.g3); } kw2.hl(cx0+1,cx0+cw-2,cy0+5,P.a4);
  M.microText(kw2,'XI',cx0+3,cy0+7,P.r2); for (var rr=0;rr<2;rr++) for (var cc=0;cc<4;cc++) kw2.px(cx0+2+cc*2,cy0+13+rr,(rr*4+cc===6)?P.r3:P.s2);
  ONI.forEach(function(o,i){ var q=ip3(o[0],o[1],0), w=PW(b,RG.furn,0.3); w.px(q[0],q[1],P.k1); for (var j=0;j<14;j++){ var oy=q[1]+1+j, ox=q[0]+rnd(Math.sin(j*0.8+i)*1); if (j%2===0){ w.px(ox-1,oy,i?P.s5:P.y2); w.px(ox,oy,i?P.s4:P.t4); w.px(ox+1,oy,i?P.s5:P.y2); w.px(ox,oy+1,i?P.s3:P.t3); } else w.px(ox,oy,P.e3); } });
  // Leiter an der Rückwand rechts hinauf zur Luke
  var lw=PW(b,RG.furn,LAD.Z), a0=ip3(LAD.X0,96,LAD.Z+6), a1=ip3(LAD.X0,CY,LAD.Z), b0=ip3(LAD.X1,96,LAD.Z+6), b1=ip3(LAD.X1,CY,LAD.Z);
  lw.line(a0[0],a0[1],a1[0],a1[1],P.w3); lw.line(a0[0]+1,a0[1],a1[0]+1,a1[1],P.w1); lw.line(b0[0],b0[1],b1[0],b1[1],P.w3); lw.line(b0[0]+1,b0[1],b1[0]+1,b1[1],P.w1);
  for (var r2=0;r2<9;r2++){ var t=(r2+0.5)/9, ya=a0[1]+(a1[1]-a0[1])*t, xa=a0[0]+(a1[0]-a0[0])*t, xb=b0[0]+(b1[0]-b0[0])*t; lw.hl(rnd(xa)+1,rnd(xb),rnd(ya),P.w2); lw.hl(rnd(xa)+1,rnd(xb),rnd(ya)+1,P.w0); } }
var KETTLE=[0,0], RLAMP=[0,0];

// ---------------------------------------------------------------- Raum: Bett mit Armeedecken, Tisch mit Wachstuch und Schublade, Stühle, Tür
function blanket(X,Y,Z,sd){ var st=Math.abs(Z-(BED.Z0+30))<3.2, n=fbm(X*1.4,Z*0.8+Y,4,sd);
  if (st) return Math.abs(Z-(BED.Z0+30))>2.4?P.m1:(n>0.5?P.k1:P.k0);                                                            // schwarzer Streifen
  return ra(R('m2 m3 m3 m4'),0.45+(n-0.5)*0.6,X+Z,Y); }
function paintProps(b,S){ var x, y;
  // Bett: niedriges Holzgestell, Matratze, zwei graue Armeedecken übereinander, ein Kissen am Herd
  box3(b,BED.X0,BED.X1,BED.Y0+4,96,BED.Z0,BED.Z1,{front:function(x,y,X,Y){ return (Y>94.5)?P.w0:P.w2; },right:function(x,y,X,Y,Z){ return (Y>94.5)?P.w0:(hash(Math.floor(Z/5),1)<0.5?P.w2:P.w1); }},RG.bed);
  box3(b,BED.X0,BED.X1-1,BED.Y0,BED.Y0+4,BED.Z0+1,BED.Z1-1,{top:function(x,y,X,Y,Z){ return blanket(X,Y,Z,1); },right:function(x,y,X,Y,Z){ var c=blanket(X,Y,Z,2); return M.DN[c]; },front:function(x,y,X,Y){ return M.DN[blanket(X,Y,BED.Z1,3)]; }},RG.bed);
  // die Decke hängt seitlich über, in Falten
  var dw=PW(b,RG.bed,function(x){ return ((x+0.5-VP[0])/(BED.X1-VP[0])-1)*F; }); for (var z=BED.Z0+2;z<BED.Z1-2;z+=0.5){ var q0=p3(BED.X1-1,BED.Y0+4,z), q1=p3(BED.X1-1,BED.Y0+9+Math.sin(z*0.6)*1.5,z); for (y=rnd(q0[1]);y<rnd(q1[1]);y++) dw.px(rnd(q0[0]),y,Math.abs(z-(BED.Z0+30))<3.2?P.k1:(Math.sin(z*0.6)>0.3?P.m4:P.m3)); }
  box3(b,BED.X0,BED.X0+12,BED.Y0-3,BED.Y0,BED.Z0+2,BED.Z0+16,{top:function(x,y){ return hash(x,y)<0.2?P.s4:P.s5; },right:P.s4,front:P.s3},RG.bed);       // Kissen
  box3(b,BED.X0+2,BED.X1-2,BED.Y0-2,BED.Y0,BED.Z1-16,BED.Z1-6,{top:function(x,y,X,Y,Z){ var st=Math.abs(Z-(BED.Z1-11))<1.6; return st?P.k1:(hash(x,y)<0.3?P.m2:P.m3); },front:P.m1,right:P.m1},RG.bed);   // gefaltete Decke am Fußende
  // Flickenteppich vor dem Herd
  var rw=PW(b,RG.floor,function(x,y){ var f=R3.floor(x+0.5,y+0.5); return f?f.Z:60; });
  rw.poly([p3(90,96,22),p3(124,96,22),p3(124,96,38),p3(90,96,38)],function(x,y){ var f=R3.floor(x+0.5,y+0.5); if (!f) return undefined; var st=Math.floor((f.X-90)/3), RC=[P.r2,P.e2,P.c2,P.e3,P.r1,P.g2,P.s3]; var c=RC[(st*3+1)%RC.length]; if (hash(st,Math.floor(f.Z/4))<0.2) c=RC[(st*5+2)%RC.length]; if (f.Z<22.8||f.Z>37.2) c=P.e1; return c; });
  // Stühle
  chair(b,CA,'L'); chair(b,CB,'R');
  // Tisch: Beine, Zarge mit Schublade, Wachstuch (rot-weiß kariert), darauf eine Schüssel, Brot, eine Petroleumlampe
  [[TB.X0+2,TB.Z0+2],[TB.X1-4,TB.Z0+2],[TB.X0+2,TB.Z1-4],[TB.X1-4,TB.Z1-4]].forEach(function(l){ box3(b,l[0],l[0]+2,TB.Y0,96,l[1],l[1]+2,{front:P.w2,left:P.w1,right:P.w1},RG.table); });
  box3(b,TB.X0,TB.X1,TB.Y0+1,TB.Y0+5,TB.Z0,TB.Z1,{front:function(x,y,X,Y){ var c=P.w2; if (X>DRW.X0&&X<DRW.X1&&Y>DRW.Y0&&Y<DRW.Y1){ c=S.drawerOpen?P.k1:P.w3; if (Math.abs(Y-(DRW.Y0+DRW.Y1)/2)<0.5&&Math.abs(X-(DRW.X0+DRW.X1)/2)<1.6) c=P.m3; } if (Math.abs(X-DRW.X0)<0.5||Math.abs(X-DRW.X1)<0.5) c=P.w0; return c; },left:P.w0,right:P.w0},RG.table);
  function oil(X,Z){ var u=Math.floor((X-TB.X0)*0.5), v=Math.floor(Z*0.55); return ((u+v)%2)?P.r2:((hash(u,v)<0.08)?P.s4:P.s5); }
  box3(b,TB.X0-1,TB.X1+1,TB.Y0,TB.Y0+1.2,TB.Z0-1,TB.Z1+1,{top:function(x,y,X,Y,Z){ return oil(X,Z); },front:function(x,y,X){ return oil(X,TB.Z1)===P.r2?P.r1:P.s4; },left:P.s3,right:P.s3},RG.table);
  var tw=PW(b,RG.table,52), bq=ip3(132,TB.Y0,50); tw.ellipse(bq[0]+0.5,bq[1]-1.5,4,2,P.s5); tw.hl(bq[0]-3,bq[0]+3,bq[1]-2,P.s6); tw.hl(bq[0]-2,bq[0]+2,bq[1],P.b2);                    // Schüssel
  var br=ip3(146,TB.Y0,54); tw.ellipse(br[0]+0.5,br[1]-1.5,4,2,P.w4); tw.hl(br[0]-2,br[0]+2,br[1]-3,P.w5); tw.px(br[0]+3,br[1]-1,P.w2);                                             // Brot
  var lp=ip3(158,TB.Y0,48); LAMP=lp; tw.rect(lp[0]-2,lp[1]-2,5,2,P.y2); tw.hl(lp[0]-3,lp[0]+3,lp[1],P.y1); tw.rect(lp[0]-1,lp[1]-4,3,2,P.y3); tw.rect(lp[0]-1,lp[1]-10,3,6,P.s5); tw.vl(lp[0]+1,lp[1]-10,lp[1]-5,P.s4); tw.px(lp[0],lp[1]-11,P.s4);   // Petroleumlampe
  // offene Schublade: Bleistift und ein Brief liegen darin
  if (S.drawerOpen){ var dq=ip3((DRW.X0+DRW.X1)/2,DRW.Y1,TB.Z1+3), dw2=PW(b,RG.table,TB.Z1+3); dw2.rect(dq[0]-7,dq[1]-2,15,3,P.w3); dw2.hl(dq[0]-7,dq[0]+7,dq[1]-2,P.w4); dw2.hl(dq[0]-6,dq[0]+6,dq[1]-1,P.k1); dw2.hl(dq[0]-4,dq[0]+1,dq[1]-1,P.y3); dw2.px(dq[0]+2,dq[1]-1,P.s5); dw2.px(dq[0]+3,dq[1]-1,P.e3); }
  // Tür in der rechten Wand (in den Hof): Bretter, Riegel, Klinke; der Rahmen
  var zfR=function(x){ return ((x+0.5-VP[0])/(262-VP[0])-1)*F; }, dw3=PW(b,RG.furn,zfR);
  dw3.poly(wq('R',DOOR.u0-2,DOOR.u1+2,DOOR.v0-3,DOOR.v1),P.w0);
  var dq2=wq('R',DOOR.u0,DOOR.u1,DOOR.v0,DOOR.v1);
  dw3.poly(dq2,function(x,y){ var t=(x-dq2[0][0])/(dq2[1][0]-dq2[0][0]), top=dq2[0][1]+(dq2[1][1]-dq2[0][1])*t, bot=dq2[3][1]+(dq2[2][1]-dq2[3][1])*t, v=(y-top)/(bot-top), c=P.w2;
    var pl=Math.floor(t*5); if ((t*5-pl)<0.12) c=P.w1; if (Math.abs(v-0.2)<0.025||Math.abs(v-0.78)<0.025) c=P.k1; if (hash(x,y>>1)<0.06) c=P.w3; return c; });
  var kp=M.wallPt(SPEC,'R',DOOR.u1-4,74); dw3.rect(rnd(kp[0])-1,rnd(kp[1]),3,2,P.m3); dw3.px(rnd(kp[0]),rnd(kp[1])+3,P.k1);
  // Haken neben der Tür: Zlatas Jacke, ein Korb
  var hk=M.wallPt(SPEC,'R',DOOR.u0-6,56), hx=rnd(hk[0]), hy=rnd(hk[1]), cw2=PW(b,RG.furn,DOOR.u0-6); cw2.rect(hx-1,hy-1,3,2,P.m2);
  cw2.poly([[hx-3,hy],[hx+2,hy],[hx+4,hy+18],[hx-5,hy+18]],function(xx,yy){ return ((xx+yy)%3===0)?P.m1:P.m2; }); cw2.hl(hx-5,hx+4,hy+18,P.m0); }
var LAMP=[0,0];
function chair(b,C,back){ var Wc=R('w1 w2 w3 w4');
  [[C.X0,C.Z0],[C.X1-1.4,C.Z0],[C.X0,C.Z1-1.4],[C.X1-1.4,C.Z1-1.4]].forEach(function(l){ var bk=(back==='L'?l[0]===C.X0:l[0]!==C.X0), top=bk?C.YB:C.YS; box3(b,l[0],l[0]+1.4,top,96,l[1],l[1]+1.4,{front:Wc[1],left:Wc[0],right:Wc[0],top:Wc[3]}); });
  box3(b,C.X0,C.X1,C.YS-1.4,C.YS,C.Z0,C.Z1,{top:Wc[2],front:Wc[1],left:Wc[0],right:Wc[0]});
  var bx=back==='L'?C.X0:C.X1-1.4; box3(b,bx,bx+1.4,C.YB,C.YB+3,C.Z0,C.Z1,{front:Wc[2],left:Wc[1],right:Wc[1],top:Wc[3]}); box3(b,bx,bx+1.4,C.YB+6,C.YB+7.4,C.Z0,C.Z1,{front:Wc[1],left:Wc[0],right:Wc[0]}); }

// ---------------------------------------------------------------- Licht: bei Tag kalt durchs Fenster, nachts Herd und Lampe
var DIMW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+r*0.12+12, L*0.38+g*0.08+8, L*0.26+b*0.1+16]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.45+L*0.36+16, g*0.32+L*0.26+6, b*0.16+L*0.08+4]; });
function paintLight(b,tod,wea){ var day=tod==='day', grey=wea==='grey';
  M.light(b,function(x,y){ var k=y*W+x, r=REG[k]; if (r===RG.view||r===RG.none) return 0; var Z=DEPTH[k], q=unp(x,y,Z), X=q[0], Y=q[1];
    var v=day?(grey?-1.3:-1.05):-1.8;
    var dx=(X-LX)/86, dz=Z/80, dy=(Y-64)/60, g=Math.max(0,1-dx*dx-dz*dz*0.8-dy*dy*0.4); v+=g*(day?(grey?0.8:1.05):0.2);
    if (r===RG.wall && Z<0.5){ var wd=Math.max(0,Math.max(WN.X0-X,X-WN.X1,0)/14)+Math.max(0,Math.max(WN.Y0-Y,Y-WN.Y1,0)/10); if (wd<1) v+=0.45*(1-wd); }
    if (day && (r===RG.floor||r===RG.table||r===RG.bed||r===RG.furn)){ var Xs=X+(Z-30)*0.04, Ys=Y-Z*0.22; if (Xs>WN.X0+2&&Xs<WN.X1-2&&Ys>WN.Y0+2&&Ys<WN.Y1){ var ed=Math.min(Xs-WN.X0-2,WN.X1-2-Xs,Ys-WN.Y0-2,WN.Y1-Ys)/3; v+=(grey?0.8:1.1)*Math.min(1,ed); } }
    if (r===RG.ceil) v-=0.1;
    var cx=(x-160)/190, cy=(y-74)/100; v-=Math.max(0,cx*cx+cy*cy-0.32)*0.9;
    return v; },0,0); }
function warmPass(o,base,L){ var LT=M.TINT.lamp;
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x; if (REG[k]===RG.view) continue; var v=0;
    for (var i=0;i<L.length;i++){ var l=L[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], f=1-dx*dx-dy*dy; if (f>0){ var q=l[4]*Math.pow(f,1.1); if (q>v) v=q; } }
    if (v<0.03) continue; var f2=v*3.3, lv=Math.floor(f2), fr=f2-lv, t=lv===0?fr:(fr-0.5)*1.7+0.5; if (t>bayer(x,y)) lv++; if (lv<=0) continue;
    var c=base.d[k]; o.d[k]=lv===1?M.tintPx(DIMW,c,x,y):(lv===2?M.tintPx(MIDW,c,x,y):(lv===3?M.tintPx(LT,c,x,y):M.UP[M.tintPx(LT,c,x,y)])); } }

// ---------------------------------------------------------------- Bild
var TODN='day';
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0); REG.fill(0); DEPTH.fill(0); if (tod!=='night') tod='day'; TODN=tod;
  paintRoom(b); paintWindow(b,tod,wea); paintBack(b,S,tod); paintProps(b,S);
  paintLight(b,tod,wea);
  var base=b.clone(), fire=ip3(SV.X0+9.5,83,SV.Z1);
  // Herd und Lampe: nachts kräftig, bei Tag ein schwacher Schein der Glut
  var L=tod==='day'?[[fire[0],fire[1]+10,18,8,0.3]]:[[fire[0],fire[1]+6,54,26,0.85],[fire[0]+8,108,60,16,0.6],[LAMP[0],LAMP[1]-14,84,48,0.95],[LAMP[0],LAMP[1]+14,110,24,0.7],[BED.X1-8,96,50,22,0.5]];
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.view; }, after:function(o){ warmPass(o,base,L); if (tod!=='day'){ var w=PW(o,RG.furn,48); w.rect(LAMP[0]-1,LAMP[1]-9,3,4,P.y4); w.px(LAMP[0],LAMP[1]-8,P.l0); w.px(LAMP[0],LAMP[1]-7,P.y5); } } });
  if (tod==='day') warmPass(LAST,base,L);
  return LAST; }
// Tisch als Ebene: wer dahinter steht, verschwindet bis zur Hüfte; das Bett ebenso
function layers(S,GS,tod){ if (!LAST) return []; var out=[];
  [[TB.X0-2,TB.X1+2,TB.Y0-12,96,TB.Z0-2,TB.Z1+2,RG.table,p3(TB.X0,96,TB.Z1)[1]],[BED.X0,BED.X1+2,BED.Y0-4,96,BED.Z0,BED.Z1,RG.bed,p3(BED.X1,96,BED.Z1)[1]]].forEach(function(q){
    var r=R3.rect(q[0],q[1],q[2],q[3],q[4],q[5]), l=M.layer(r[0],r[1],r[2]+1,r[3]+1,Math.round(q[7]));
    for (var y=r[1];y<=r[1]+r[3];y++) for (var x=r[0];x<=r[0]+r[2];x++){ if (x<0||y<0||x>=W||y>=H) continue; if (REG[y*W+x]===q[6]) l.px(x-r[0],y-r[1],LAST.d[y*W+x]); } out.push(l); });
  return out; }

// ---------------------------------------------------------------- jedes Bild: Glut im Herd, Dampf aus dem Kessel, Lämpchen des Radios, Flamme der Lampe
function dynamic(fb,v,S,GS){ var t=v.t, x, y;
  // Glut im Spalt der Feuertür flackert
  var a=ip3(SV.X0+4.5,80.8,SV.Z1), c=ip3(SV.X0+14.5,85.2,SV.Z1), f=0.6+Math.sin(t*6.3)*0.2+Math.sin(t*13.7)*0.12;
  for (y=a[1];y<=c[1];y++) for (x=a[0];x<=c[0];x++){ if (REG[y*W+x]!==RG.stove) continue; var row=(y-a[1])/(c[1]-a[1]+0.01), slit=((Math.floor(x*0.75))%2)===0;
    if (slit && bayer(x,y+Math.floor(t*8))<f*(0.5+row*0.6)) fb.px(x,y,row>0.6?(f>0.75?P.y4:P.y3):(f>0.7?P.t4:P.t3)); }
  var fl=ip3(SV.X0+9.5,96,SV.Z1+5); for (y=fl[1]-2;y<fl[1]+3;y++) for (x=fl[0]-9;x<fl[0]+10;x++){ var d=Math.hypot((x-fl[0])/9,(y-fl[1])/3); if (d<1 && bayer(x+Math.floor(t*5),y)<(1-d)*0.25*f) fb.px(x,y,M.UP[fb.get(x,y)]); }
  // Dampf aus dem Kessel
  for (var p=0;p<7;p++){ var ph=((t*0.35+p/7)%1), px=rnd(KETTLE[0]+ph*5+Math.sin(t*1.3+p)*1.5*ph), py=rnd(KETTLE[1]-ph*14); if (bayer(px,py)<0.75-ph*0.7) fb.px(px,py,ph<0.4?P.s5:P.s4); }
  // Lämpchen des Radios
  var on=Math.sin(t*0.7)>-0.9; fb.px(RLAMP[0],RLAMP[1],on?(Math.sin(t*3.1)>0.6?P.y5:P.y4):P.y1); if (TODN!=='day') M.glow(fb,RLAMP[0],RLAMP[1],3,t,0.4);
  // Flamme der Petroleumlampe (nachts)
  if (TODN!=='day'){ var lf=Math.sin(t*9)>0.3; fb.px(LAMP[0],LAMP[1]-8,lf?P.l0:P.y5); fb.px(LAMP[0],LAMP[1]-9,lf?P.y4:P.y3); M.glow(fb,LAMP[0],LAMP[1]-8,9,t,0.45); } }
// ---------------------------------------------------------------- Malas Sicht: eine Kuhle in der Luft über dem Bett, wo jemand lange lag
function ghost(fb,v,S,GS){ var t=v.t, al=0.65+0.25*Math.sin(t*0.9), xc=(BED.X0+BED.X1)/2-1;
  // liegender Umriss, eingewickelt: Kopf auf dem Kissen am Herd, Schultern, Hüfte, Knie, Füße; eine Kuhle in der Luft
  function prof(u){ return u<0.12?2.4:(u<0.17?1.8:(u<0.45?3.8:(u<0.7?3.3:(u<0.9?2.6:2.0)))); }
  var Z0=BED.Z0+5, Z1=BED.Z1-8;
  for (var z=Z0;z<Z1;z+=0.35){ var u=(z-Z0)/(Z1-Z0), hw=prof(u), lift=u<0.12?2.8:(u<0.45?2.4:1.8);
    for (var X=xc-hw;X<=xc+hw;X+=0.4){ var e=Math.abs(X-xc)/hw, Y=BED.Y0-lift*Math.sqrt(Math.max(0,1-e*e)), s=p3(X,Y,z), sx=rnd(s[0]), sy=rnd(s[1]); if (sx<0||sy<0||sx>=W||sy>=H) continue;
      if (e>0.8){ if (bayer(sx,sy)<0.85*al) fb.px(sx,sy,e>0.92?P.x5:P.x4); } else if (bayer(sx+1,sy)<0.32*al) fb.px(sx,sy,P.x3); } }
  // Kontur oben (der Rücken der Gestalt) als feine helle Linie
  for (var z2=Z0;z2<Z1;z2+=0.25){ var u2=(z2-Z0)/(Z1-Z0), lift2=u2<0.12?2.8:(u2<0.45?2.4:1.8), q=p3(xc,BED.Y0-lift2,z2), qx=rnd(q[0]), qy=rnd(q[1]); if (qx>=0&&qx<W&&qy>=0&&qy<H && bayer(qx,qy)<0.7*al) fb.px(qx,qy,P.x6); }
  // ein Schimmer am Herd, als sei es dort noch warm
  var hq=ip3(SV.X0,84,SV.Z1+4); for (var y=hq[1]-8;y<hq[1]+8;y++) for (var x=hq[0]-12;x<hq[0]+10;x++){ var d=Math.hypot((x-hq[0])/11,(y-hq[1])/8); if (d<1 && bayer(x,y)<(1-d)*0.22*al) fb.px(x,y,P.x4); } }

// ---------------------------------------------------------------- Raum
function rr(X0,X1,Y0,Y1,Z0,Z1){ return R3.rect(X0,X1,Y0,Y1,Z0,Z1); }
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<20||Z>128) return false; if (X<88||X>252) return false;
  if (X>TB.X0-6&&X<TB.X1+5&&Z>TB.Z0-5&&Z<TB.Z1+6) return false;
  if (X>CA.X0-3&&X<CA.X1&&Z>CA.Z0-3&&Z<CA.Z1+4) return false;
  if (X>CB.X0&&X<CB.X1+3&&Z>CB.Z0-3&&Z<CB.Z1+4) return false;
  if (X<BED.X1+5&&Z>BED.Z0-4&&Z<BED.Z1+6) return false; if (X<SV.X1+14&&Z<SV.Z1+6) return false;
  return true; };
var spots={ door:(function(){ var q=wq('R',DOOR.u0-2,DOOR.u1+2,DOOR.v0-3,DOOR.v1); return [rnd(q[0][0]),rnd(q[0][1]),rnd(q[1][0]-q[0][0])+1,rnd(q[3][1]-q[0][1])]; })(),
  stove:rr(SV.X0,SV.X1,SV.Y0-6,96,SV.Z0,SV.Z1), blankets:rr(BED.X0,BED.X1,BED.Y0-3,96,BED.Z0,BED.Z1), radio:[0,0,0,0], drawer:(function(){ var a=ip3(DRW.X0,DRW.Y0,TB.Z1), c=ip3(DRW.X1,DRW.Y1,TB.Z1); return [a[0]-1,a[1]-2,c[0]-a[0]+3,c[1]-a[1]+5]; })(),
  table:rr(TB.X0,TB.X1,TB.Y0,96,TB.Z0,TB.Z1), window:[WN.X0-3,WN.Y0-2,WN.X1-WN.X0+6,WN.Y1-WN.Y0+5], ladder:rr(LAD.X0-2,LAD.X1+2,CY,96,LAD.Z,LAD.Z+6), calendar:[CAL.X0-1,CAL.Y0-4,CAL.X1-CAL.X0+3,CAL.Y1-CAL.Y0+5] };
spots.radio=rr(RAD.X0-1,RAD.X1+1,RAD.Y0-1,SH.Y+2,0,6);
M.defineArt('zlata_k',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, ghost:ghost, walk:WALK, walkG:function(){ return false; },
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!M.TINT[tod]) return null; var d=Math.hypot(a.x-LAMP[0],(a.y-LAMP[1])*1.4); return d<70?M.TINT.lamp.a:(d<110?MIDW.a:null); },
  spots:spots,
  stands:{ door:R3.st(236,70,'R'), stove:R3.st(130,28,'L'), blankets:R3.st(96,52,'L'), radio:R3.st(215,30,'B'), drawer:R3.st(152,72,'B'), table:R3.st(152,72,'B'), window:R3.st(158,32,'B'), ladder:R3.st(240,26,'B'), calendar:R3.st(194,30,'B') },
  actorPos:{ zlata:R3.st(128,26,'L'), nada:(function(){ var q=R3.p((CA.X0+CA.X1)/2+1,96,(CA.Z0+CA.Z1)/2); return [rnd(q[0]),rnd(q[1]),'R']; })() },
  start:R3.st(232,74,'L'), entries:{ skela_l:R3.st(232,74,'L') }
});
})(M);
