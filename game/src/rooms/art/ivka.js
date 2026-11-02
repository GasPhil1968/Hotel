/* ===== rooms/art/ivka.js — Ivkas Wohnung: ein kleines, sehr ordentliches Zimmer einer alten Frau =====
   Rückwand: Kochecke mit Herd, Kredenz mit Häkeldeckchen, zwei Fotos (Tonći im Matrosenpullover, zwei junge Männer auf einem
   weißen Boot) und dem alten Radiorekorder, darüber der Kalender 2011 und die Nikolaus-Ikone. Das Fenster mit halb geschlossenen
   grünen Läden, davor ihr Stuhl mit der gefalteten Decke, zum Fenster gedreht, daneben der Nähkorb. Rechts das Bett in der Nische,
   die tickende Wanduhr, links die Tür mit dem schwarzen Mantel am Haken. In der Mitte der Tisch mit Wachstuch, zwei Tassen und
   dem verschnürten Schuhkarton. Das Licht fällt in Streifen durch die Lamellen, Staub tanzt darin. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;
var VP=[152,60], RECT=[68,34,236,96], F=84, FY=96;
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

// Tiefen- und Regionenpuffer: jede gemalte Fläche merkt sich ihre Raumtiefe Z (für Lichtstreifen und Lichtschächte)
var DEPTH=new Float32Array(W*H), REG=new Uint8Array(W*H), RG={none:0,view:1,wall:2,floor:3,ceil:4,furn:5,frame:6,table:7}, LAST=null;
function PW(b,reg,zf){ var o={w:W,h:H,buf:null};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=reg; DEPTH[k]=typeof zf==='function'?zf(x,y):zf; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
// Quader in Raumkoordinaten; jede Seite Farbe oder fn(x,y,X,Y,Z) mit dem Raumpunkt der Fläche
function box3(b,X0,X1,Y0,Y1,Z0,Z1,f,reg){ reg=reg||RG.furn;
  function call(fill,x,y,zf){ if (typeof fill!=='function') return fill; var Z=zf(x,y), q=unp(x,y,Z); return fill(x,y,q[0],q[1],Z); }
  var zt=function(x,y){ return ((y+0.5-VP[1])/(Y0-VP[1])-1)*F; }, zr=function(x){ return ((x+0.5-VP[0])/(X1-VP[0])-1)*F; }, zl=function(x){ return ((x+0.5-VP[0])/(X0-VP[0])-1)*F; }, zfr=function(){ return Z1; };
  if (Y0>VP[1] && f.top!==undefined) PW(b,reg,zt).poly([p3(X0,Y0,Z0),p3(X1,Y0,Z0),p3(X1,Y0,Z1),p3(X0,Y0,Z1)],function(x,y){ return call(f.top,x,y,zt); });
  if (X1<VP[0] && f.right!==undefined) PW(b,reg,zr).poly([p3(X1,Y0,Z0),p3(X1,Y0,Z1),p3(X1,Y1,Z1),p3(X1,Y1,Z0)],function(x,y){ return call(f.right,x,y,zr); });
  if (X0>VP[0] && f.left!==undefined) PW(b,reg,zl).poly([p3(X0,Y0,Z0),p3(X0,Y0,Z1),p3(X0,Y1,Z1),p3(X0,Y1,Z0)],function(x,y){ return call(f.left,x,y,zl); });
  if (f.front!==undefined) PW(b,reg,zfr).poly([p3(X0,Y0,Z1),p3(X1,Y0,Z1),p3(X1,Y1,Z1),p3(X0,Y1,Z1)],function(x,y){ return call(f.front,x,y,zfr); }); }

// ---------------------------------------------------------------- Maße (Raumkoordinaten: X quer, Y Höhe wie auf der Rückwand, Boden 96, Z Tiefe)
var CR={X0:90,X1:144,Y0:81,Z1:12};                      // Kredenz
var TB={X0:100,X1:146,Y0:84,Z0:42,Z1:60};                // Tisch
var CH={X0:160,X1:176,YS:88,YB:78,Z0:8,Z1:20};          // Stuhl am Fenster (Lehne vorn)
var BK={X0:180,X1:194,Y0:90,Z0:14,Z1:26};               // Nähkorb
var BD={X0:206,X1:236,Y0:88,Z0:14,Z1:58};               // Bett
var SV={X0:68,X1:86,Y0:82,Z0:2,Z1:18};                  // Herd
var WN={X0:150,X1:194,Y0:44,Y1:80}, GL={X0:152,X1:192,Y0:46,Y1:78,MX:172,MY:62};   // Fensteröffnung, Glas, Kreuz
var CK={X0:208,X1:222,Y0:40,Y1:74,PX:215,PY:58};        // Wanduhr, Pendelaufhängung
var CAL={X0:97,X1:114,Y0:46,Y1:64}, ICO={X0:119,X1:129,Y0:49,Y1:62};
var PT={X0:96,X1:106,Y0:68,Z:5}, PB={X0:109,X1:125,Y0:71,Z:5}, RD={X0:127,X1:143,Y0:72,Z0:2,Z1:10};
var DOOR={u0:46,u1:64,v0:62,v1:96}, HOOK={u:39,v:64};
var SX=0.5, SY=0.6, LP=6, LG=0.5, LW=12;                    // Lichtrichtung (vom Fenster nach vorn, links, unten), Lamellenabstand und -spalt

// ---------------------------------------------------------------- Licht durch das Fenster
function winLit(X0,Y0){ if (X0<GL.X0||X0>GL.X1||Y0<GL.Y0||Y0>GL.Y1) return 0;
  if (Math.abs(X0-GL.MX)<1.1||Math.abs(Y0-GL.MY)<1.0) return 0;        // Fensterkreuz
  if (X0<GL.X0+LW||X0>GL.X1-LW){ var f=((Y0-GL.Y0+(X0>GL.MX?2.5:0))/LP)%1; return f<LG?1:0; }   // beide Läden halb offen: Licht durch die Lamellen
  return 1; }
function lit3(X,Y,Z){ var L=winLit(X+SX*Z,Y-SY*Z); if (!L) return 0;
  if (Y>TB.Y0+0.3 && Z>TB.Z0){ var s=(Y-TB.Y0)/SY, Xt=X+SX*s, Zt=Z-s; if (Xt>TB.X0&&Xt<TB.X1&&Zt>TB.Z0&&Zt<TB.Z1) return 0; }
  if (Z>CH.Z1+0.3){ var s2=Z-CH.Z1, Xc=X+SX*s2, Yc=Y-SY*s2; if (Xc>CH.X0&&Xc<CH.X1&&Yc>CH.YB&&Yc<CH.YS+0.5){ var sl=(Xc-CH.X0)%4; if (sl<1.5||Yc<CH.YB+2.2||Yc>CH.YS-1.2) return 0; } }
  if (Y>CH.YS+0.3 && Z>CH.Z0){ var s3=(Y-CH.YS)/SY, Xs=X+SX*s3, Zs=Z-s3; if (Xs>CH.X0&&Xs<CH.X1&&Zs>CH.Z0&&Zs<CH.Z1) return 0; }
  if (Y>BK.Y0+0.3 && Z>BK.Z0){ var s4=(Y-BK.Y0)/SY, Xb=X+SX*s4, Zb=Z-s4; if (Xb>BK.X0&&Xb<BK.X1&&Zb>BK.Z0&&Zb<BK.Z1) return 0; }
  return L; }
function volAt(x,y,Zs){ var n=0; for (var Z=Zs+2;Z<Math.min(Zs+66,106);Z+=4){ var k=1+Z/F, X=VP[0]+(x-VP[0])/k, Y=VP[1]+(y-VP[1])/k; if (Y>96||Y<34||X<68||X>236) continue; if (winLit(X+SX*Z,Y-SY*Z)) n++; } return n; }

// ---------------------------------------------------------------- Wände, Boden, Decke
var WALL=R('c1 c2 c3 c4 b4'), DADO=R('c0 c1 c2 c3');
function wallTone(u,v,sd){ var n=fbm(u,v,26,sd), base=0.5+(n-0.5)*0.16;
  var row=Math.floor(v/9), mu=(((Math.round(u)+(row%2)*5)%10)+10)%10, mv=((Math.round(v)%9)+9)%9;   // Walzenmuster: kleine verblasste Blüten
  if ((mu===5&&(mv===4||mv===3||mv===5))||(mv===4&&(mu===4||mu===6))) base-=(mu===5&&mv===4)?0.16:0.09;
  return base; }
function wallC(u,v,x,y,sd){ var Y=34+v;
  if (Y>82){ if (Y<83.5) return P.c1; if (Y<84.8) return P.b3; return ra(DADO,0.55+(fbm(u,v,14,sd+2)-0.5)*0.3,x,y); }   // Sockelfarbe mit Zierlinie
  return ra(WALL,wallTone(u,v,sd)-(Y<38?0.15:0),x,y); }
function paintRoom(b){
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ var k=y*W+x; REG[k]=RG.wall; DEPTH[k]=0; return wallC(u+68,v,x,y,1); },
    side:function(u,v,x,y,sd){ var k=y*W+x; REG[k]=RG.wall; DEPTH[k]=u*F/84; var c=wallC(u*1.6+(sd==='L'?0:300),v,x,y,sd==='L'?3:5); return c; },
    floor:function(xb,d,x,y){ var k=y*W+x, f=R3.floor(x+0.5,y+0.5); REG[k]=RG.floor; DEPTH[k]=f?f.Z:0; var c=tex.planks(xb,y,VP[1],FY,R('w1 w2 w3 w4'),10); return c; },
    ceil:function(xb,d,x,y){ var k=y*W+x, kk=(VP[1]-y)/(VP[1]-34); REG[k]=RG.ceil; DEPTH[k]=(kk-1)*F; var bx=((xb-70)%28+28)%28; if (bx<6){ return bx<1?P.w0:(bx<4?P.w2:P.w1); } return ra(R('s1 s2 s3'),0.5+(fbm(xb,d*2,12,6)-0.5)*0.2,x,y); } });
  // Deckenbalken: Unterkante dunkler, Seitenflächen
  var wb=PW(b,RG.ceil,0); for (var X=70;X<236;X+=28){ var a=p3(X,34,0), c=p3(X,34,40); wb.line(rnd(a[0]),rnd(a[1]),rnd(c[0]),rnd(c[1]),P.w0); var a2=p3(X+6,34,0), c2=p3(X+6,34,40); wb.line(rnd(a2[0]),rnd(a2[1]),rnd(c2[0]),rnd(c2[1]),P.w3); }
  // Wasserfleck an der Decke (nach dem Regen) und ein feiner Riss
  var sw=PW(b,RG.ceil,10); for (var yy=2;yy<30;yy++) for (var xx=176;xx<222;xx++){ if (REG[yy*W+xx]!==RG.ceil) continue; var e=Math.pow((xx-199)/22,2)+Math.pow((yy-14)/9,2)+(fbm(xx,yy,6,9)-0.5)*0.7; if (e<1&&e>0.78) sw.px(xx,yy,P.e2); else if (e<0.78&&hash(xx,yy)<0.35) sw.px(xx,yy,P.e3); }
  sw.line(120,3,132,11,P.s1); sw.line(132,11,137,10,P.s1);
  // Fußleisten
  var bw=PW(b,RG.wall,0); bw.hl(68,235,95,P.w1); bw.hl(68,235,94,P.w2);
  // Bettnische in der rechten Wand: dunklere Laibung mit Rundbogen
  var nq=M.wallQuad(SPEC,'R',10,60,64,96), nw=PW(b,RG.wall,function(x){ return ((x+0.5-VP[0])/(236-VP[0])-1)*F; });
  nw.poly(nq,function(x,y){ var t=(x-nq[0][0])/(nq[1][0]-nq[0][0]), top=nq[0][1]+(nq[1][1]-nq[0][1])*t, bot=nq[3][1]+(nq[2][1]-nq[3][1])*t, ah=(bot-top)*0.22, arc=top+ah*(1-Math.sin(Math.PI*cl(t,0,1)));
    if (y<arc) return undefined; var c=ra(R('c1 c2 c3 c4'),0.42+(fbm(x,y,10,4)-0.5)*0.15,x,y); if (y<arc+1.2) c=P.b4; else if (y<arc+2.4) c=P.c1; return c; }); }

// ---------------------------------------------------------------- Fenster: Blick über Dächer auf Mole und Meer, Läden, Fensterflügel
function paintWindow(b,tod,weather){ var v=PW(b,RG.view,-4), x0=GL.X0, x1=GL.X1, y0=GL.Y0, y1=GL.Y1, hz=y0+12;
  var sky=tod==='day'?R('m3 s3 s4 s5'):(tod==='dusk'?R('d1 d2 d3 d5'):(tod==='dawn'?R('n2 d2 d3 d4'):R('k1 k2 n0 n1')));
  for (var y=y0;y<y1;y++) for (var x=x0;x<x1;x++){ var c;
    if (y<hz){ var t=(y-y0)/(hz-y0); c=ra(sky,0.3+t*0.65+(fbm(x,y*2,9,3)-0.5)*0.35,x,y); }
    else { var d=(y-hz)/(y1-hz); c=ra(M.seaRamp(tod),0.62-d*0.4+Math.sin(x*0.9+y*1.7)*0.06,x,y); }
    v.px(x,y,c); }
  // Brač am Horizont, die Mole mit dem Leuchtfeuer, ein Boot
  for (var xx=x0;xx<x1;xx++){ var h=rnd(2+Math.sin(xx*0.12)*1.2+Math.sin(xx*0.31)*0.6); for (var yy=hz-h;yy<hz;yy++) v.px(xx,yy,tod==='day'?(yy===hz-h?P.c3:P.c2):P.n1); }
  for (var i=0;i<26;i++){ var mx=x0+2+i, my=rnd(hz+8-i*0.16); v.px(mx,my,P.s4); v.px(mx,my+1,P.s2); }
  v.rect(x0+27,hz+2,2,5,P.s5); v.px(x0+27,hz+1,P.r3); v.px(x0+28,hz+1,P.r3);
  v.hl(x0+31,x0+34,hz+5,P.s6); v.px(x0+33,hz+4,P.s5);
  // Dächer tief unten: Terrakotta von oben, Kamine
  for (var y2=y1-11;y2<y1;y2++) for (var x2=x0;x2<x1;x2++){ var edge=y1-11+rnd(Math.sin(x2*0.21)*2+Math.sin(x2*0.07)*2); if (y2<edge) continue;
    var blk=Math.floor((x2+Math.floor(y2/5)*5)/9), sh=hash(blk,Math.floor(y2/5)), c2=((x2+y2*2)%4===0)?P.t1:(sh<0.4?P.t2:(sh<0.85?P.t3:P.t4)); if (y2===edge) c2=P.t4; if ((y2-edge)%4===3) c2=P.t1; v.px(x2,y2,c2); }
  v.rect(x0+9,y1-14,2,4,P.s2); v.rect(x0+30,y1-13,2,3,P.s3);
  // beide Läden (außen) halb offen: Lamellen, durch die das Licht fällt; in der Mitte der Spalt mit dem Blick
  for (var y3=y0;y3<y1;y3++) for (var x3=x0;x3<x1;x3++){ if (x3>=x0+LW && x3<x1-LW) continue; var f=((y3-y0+(x3>GL.MX?2.5:0))/LP)%1;
    if (f<LG){ var c3=b.get(x3,y3); v.px(x3,y3,M.UP[c3]); continue; } v.px(x3,y3,f<LG+0.1?P.g4:(f<0.78?P.g3:(f<0.9?P.g2:P.g1))); }
  for (var y4=y0;y4<y1;y4++){ v.px(x0+LW-1,y4,P.g1); v.px(x0+LW,y4,P.g0); v.px(x1-LW,y4,P.g1); v.px(x1-LW-1,y4,P.g0); v.px(x0,y4,P.g2); v.px(x1-1,y4,P.g1); }
  // Tropfen am Glas
  for (var k=0;k<9;k++){ var dx=x0+3+rnd(hash(k,21)*(x1-x0-6)), dy=y0+3+rnd(hash(k,22)*(y1-y0-6)); v.px(dx,dy,P.s6); v.px(dx,dy+1,P.s4); if (hash(k,23)<0.5) v.px(dx,dy-1,P.m4); }
  // Fensterflügel innen (weiß lackiert), Fensterkreuz, Laibung, Brett
  var fr=PW(b,RG.frame,-1), Fr=R('s2 s3 s4 s5 s6');
  fr.rect(WN.X0,WN.Y0,WN.X1-WN.X0,2,Fr[3]); fr.rect(WN.X0,WN.Y1-2,WN.X1-WN.X0,2,Fr[2]); fr.rect(WN.X0,WN.Y0,2,WN.Y1-WN.Y0,Fr[4]); fr.rect(WN.X1-2,WN.Y0,2,WN.Y1-WN.Y0,Fr[2]);
  fr.rect(GL.MX-1,WN.Y0,2,WN.Y1-WN.Y0,Fr[3]); fr.vl(GL.MX,WN.Y0,WN.Y1-1,Fr[1]); fr.rect(WN.X0,GL.MY-1,WN.X1-WN.X0,2,Fr[3]); fr.hl(WN.X0,WN.X1-1,GL.MY,Fr[1]);
  fr.px(GL.MX+2,GL.MY+5,P.y3); fr.px(GL.MX+2,GL.MY+6,P.y2);   // Griff
  var lb=PW(b,RG.wall,-2); for (var y6=WN.Y0-2;y6<WN.Y1+1;y6++){ lb.px(WN.X1,y6,P.c2); lb.px(WN.X1+1,y6,P.c3); } lb.hl(WN.X0-2,WN.X1+1,WN.Y0-2,P.c1); lb.hl(WN.X0-1,WN.X1,WN.Y0-1,P.c2);
  box3(b,WN.X0-3,WN.X1+3,WN.Y1,WN.Y1+2.5,0,5,{top:P.s5,front:P.s3,left:P.s2,right:P.s4},RG.frame);   // Fensterbrett aus Stein
  // Topf mit Zimmerpflanze auf dem Brett
  var pp=ip3(186,80,3); var pw=PW(b,RG.furn,3); pw.rect(pp[0]-2,pp[1]-4,5,4,P.t3); pw.hl(pp[0]-3,pp[0]+2,pp[1]-5,P.t4); for (var q=0;q<12;q++) pw.px(pp[0]-3+rnd(hash(q,5)*7),pp[1]-6-rnd(hash(q,6)*5),hash(q,7)<0.3?P.g4:P.g3); }

// ---------------------------------------------------------------- Rückwand: Herd, Regal, Kredenz, Fotos, Radio, Kalender, Ikone, Uhr
function paintBack(b,S){
  // Herd (Smederevac): cremeweiße Emaille, gusseiserne Platte, Ofenrohr in die Wand
  var E=R('s2 s3 s4 s5 s6');
  box3(b,SV.X0,SV.X1,SV.Y0,96,SV.Z0,SV.Z1,{top:function(x,y,X,Y,Z){ var d1=Math.hypot((X-74)/4,(Z-7)/3), d2=Math.hypot((X-81)/3.4,(Z-12)/3); if (Math.abs(d1-1)<0.3||Math.abs(d2-1)<0.3) return P.m2; return (hash(x,y)<0.2)?P.m1:P.k2; },
    right:function(x,y,X,Y){ return Y>94?P.k1:E[1]; },
    front:function(x,y,X,Y){ var c=E[3]; if (X<SV.X0+1.2||Y<SV.Y0+1) c=E[4]; if (Y>94.5) return P.k1;
      if (X>69.5&&X<77&&Y>84&&Y<93.5){ c=E[2]; if (X>70.5&&X<76&&Y>85&&Y<92.5) c=(Y<86)?E[4]:E[3]; }      // Backofentür
      if (X>78.5&&X<85&&Y>84&&Y<88){ c=P.k2; if (Y>86.8) c=P.m1; }                                    // Feuertür
      if (X>78.5&&X<85&&Y>89.5&&Y<93.5) c=E[2];                                                       // Aschenlade
      if (Math.abs(Y-83.2)<0.5) c=P.m4; return c; }});
  var pr=PW(b,RG.furn,5), a=ip3(76,82,6), t=ip3(76,52,1); pr.rect(a[0]-1,t[1],3,a[1]-t[1],P.m1); pr.vl(a[0]-1,t[1],a[1],P.m2); pr.hl(a[0]-2,a[0]+2,t[1]+8,P.m3); pr.rect(a[0]-1,t[1]-1,6,3,P.m1); pr.hl(a[0]+3,a[0]+5,t[1]-2,P.m2);
  var tw=ip3(73,84,18); pr.rect(tw[0],tw[1],4,7,P.s5); for (var j=0;j<7;j+=2) pr.hl(tw[0],tw[0]+3,tw[1]+j,P.r3); pr.hl(tw[0],tw[0]+3,tw[1],P.m4);   // Geschirrtuch
  var dz=ip3(80,82,9); pr.rect(dz[0],dz[1]-4,4,4,P.y2); pr.hl(dz[0],dz[0]+3,dz[1]-4,P.y4); pr.line(dz[0]+4,dz[1]-3,dz[0]+8,dz[1]-5,P.w1);   // Džezva
  // Regal über dem Herd
  var sh=PW(b,RG.furn,2); sh.hl(70,92,66,P.w3); sh.hl(70,92,67,P.w1); sh.px(72,68,P.w0); sh.px(90,68,P.w0);
  [[71,4,5,P.s5,P.r2],[77,4,6,P.s5,P.g3],[83,5,4,P.r2,P.y3],[89,3,5,P.b2,P.s5]].forEach(function(j){ sh.rect(j[0],66-j[2],j[1],j[2],j[3]); sh.hl(j[0],j[0]+j[1]-1,66-j[2],j[4]); sh.vl(j[0],66-j[2]+1,65,M.UP[j[3]]); });
  // Kredenz: dunkles Nussholz, zwei Schubladen, zwei Türen mit Kassetten
  var Wd=R('w0 w1 w2 w3 w4');
  box3(b,CR.X0,CR.X1,CR.Y0,96,0,CR.Z1,{top:P.w3,right:P.w0,front:function(x,y,X,Y){ var c=Wd[2]; if (Y>94.8) return P.w0;
      var mid=(CR.X0+CR.X1)/2, inD=(Y>82.5&&Y<86.5), inT=(Y>88&&Y<94), lx=X<mid?X-CR.X0:X-mid;
      if (inD&&lx>2&&lx<25){ c=Wd[3]; if (Y<83.3) c=Wd[4]; if (Y>85.7) c=Wd[1]; if (Math.abs(lx-13.5)<1.2&&Math.abs(Y-84.5)<0.8) c=P.y3; }
      if (inT&&lx>2&&lx<25){ c=Wd[1]; if (lx>3.2&&lx<23.8&&Y>89&&Y<93){ c=Wd[3]; if (Y<89.8||lx<4) c=Wd[4]; if (Y>92.2) c=Wd[2]; } }
      if (Math.abs(X-mid)<0.6&&Y>87) c=Wd[0]; if (Math.abs(Y-87.2)<0.5) c=Wd[1];
      if (hash(Math.floor(X*2),Math.floor(Y))<0.06) c=M.DN[c]; return c; }});
  var kn=ip3((CR.X0+CR.X1)/2-2,91,CR.Z1), kn2=ip3((CR.X0+CR.X1)/2+2,91,CR.Z1); var kw=PW(b,RG.furn,CR.Z1); kw.px(kn[0],kn[1],P.y3); kw.px(kn2[0],kn2[1],P.y3);
  // Häkeldeckchen: weiß, hängt vorn über die Kante, gezackter Rand
  var dl=PW(b,RG.furn,CR.Z1+0.2), a0=ip3(CR.X0+3,CR.Y0,CR.Z1), a1=ip3(CR.X1-3,CR.Y0,CR.Z1), tb=ip3(CR.X0+3,CR.Y0,0);
  for (var x=a0[0];x<=a1[0];x++){ for (var y=tb[1];y<a0[1];y++) dl.px(x,y,(hash(x,y)<0.15)?P.s4:P.s6); var dd=(x%4===0)?3:((x%2===0)?2:4); for (var y2=a0[1];y2<a0[1]+dd;y2++) dl.px(x,y2,((x+y2)%3===0)?P.s3:P.s5); }
  // Fotos auf der Kredenz
  var pf=PW(b,RG.furn,PT.Z), q0=ip3(PT.X0,PT.Y0,PT.Z), q1=ip3(PT.X1,CR.Y0,PT.Z);
  frameF(pf,q0[0],q0[1],q1[0]-q0[0],q1[1]-q0[1]+1,R('w0 w1 w2'),function(x,y,u,v){ // Tonći im Matrosenpullover
    if (v<0.18) return (u<0.5)?P.b3:P.b4; var hx=Math.abs(u-0.5), c=P.s3; if (v<0.55&&hx<0.2){ c=(v<0.28&&hx<0.18)?P.h1:P.p4; if (v>0.4&&hx<0.12) c=P.p3; } else if (v>=0.55&&hx<0.42-((v-0.55)*0.1)){ c=(Math.floor(v*20)%2)?P.c1:P.s5; } else c=(v>0.5)?P.s2:P.b3; return c; });
  if (!S.photoTaken){ var pb=PW(b,RG.furn,PB.Z), r0=ip3(PB.X0,PB.Y0,PB.Z), r1=ip3(PB.X1,CR.Y0,PB.Z);
    frameF(pb,r0[0],r0[1],r1[0]-r0[0],r1[1]-r0[1]+1,R('y1 y2 y3'),function(x,y,u,v){ // zwei junge Männer auf einem weißen Boot
      var c=(v<0.42)?((v<0.2)?P.b4:P.s5):((v<0.75)?P.b2:P.a3); if (Math.sin(u*30+v*8)>0.7&&v>0.5) c=P.b3;
      if (v>0.5&&v<0.72&&u>0.15&&u<0.88&&(v<0.62||u>0.2+(v-0.62)*0.8)) c=(v<0.54)?P.s4:P.s6;
      if (Math.abs(u-0.5)<0.03&&v>0.12&&v<0.52) c=P.w2;
      if ((Math.abs(u-0.36)<0.05||Math.abs(u-0.62)<0.05)&&v>0.3&&v<0.52) c=(v<0.37)?P.p3:P.c1; return c; }); }
  else { var g0=ip3(PB.X0+1,CR.Y0,CR.Z1-6), g1=ip3(PB.X1-1,CR.Y0,CR.Z1-6); var gw=PW(b,RG.furn,PB.Z); gw.hl(g0[0],g1[0],g0[1],P.s5); gw.hl(g0[0]+1,g1[0]-1,g0[1]-1,P.s6); }
  // Radiorekorder (80er): zwei Lautsprecher, Kassettenfach, Skala, Griff, Antenne
  box3(b,RD.X0,RD.X1,RD.Y0,CR.Y0,RD.Z0,RD.Z1,{top:P.m2,right:P.m0,front:function(x,y,X,Y){ var c=P.m1; var dl2=Math.hypot(X-RD.X0-3.3,Y-77.2), dr=Math.hypot(X-RD.X1+3.3,Y-77.2);
      if (dl2<2.8||dr<2.8){ c=((rnd(X*2)+rnd(Y*2))%2)?P.k1:P.m0; if (dl2<1||dr<1) c=P.m2; }
      else if (X>RD.X0+7&&X<RD.X1-7&&Y>75&&Y<79.5){ c=(Y<76)?P.m3:P.k2; if (Y>77.3&&Y<78.5&&X>RD.X0+8&&X<RD.X1-8) c=P.m2; }
      else if (Y<74.4&&X>RD.X0+1&&X<RD.X1-1){ c=P.s4; if (Math.abs(X-RD.X0-9)<0.5) c=P.r3; }
      if (Y>80.2) c=P.k1; if (Y<72.6) c=P.m3; return c; }});
  var rw=PW(b,RG.furn,RD.Z1), hd0=ip3(RD.X0+3,RD.Y0,RD.Z0+4), hd1=ip3(RD.X1-3,RD.Y0,RD.Z0+4); rw.hl(hd0[0],hd1[0],hd0[1]-3,P.m2); rw.vl(hd0[0],hd0[1]-3,hd0[1],P.m1); rw.vl(hd1[0],hd1[1]-3,hd1[1],P.m1);
  var an=ip3(RD.X1-2,RD.Y0,RD.Z0+2); rw.line(an[0],an[1],an[0]+7,an[1]-16,P.m4); rw.px(an[0]+7,an[1]-17,P.m3);
  var led=ip3(RD.X0+8.5,79.2,RD.Z1); rw.px(led[0],led[1],S.radioOn?P.g5:P.g1); if (S.radioOn){ rw.px(led[0]+1,led[1],P.g4); var sk0=ip3(RD.X0+2,73.4,RD.Z1), sk1=ip3(RD.X1-2,73.4,RD.Z1); rw.hl(sk0[0],sk1[0],sk0[1],P.y4); }
  // Kalender 2011 mit kleinen Strichen
  var cw=PW(b,RG.furn,0.2), cx0=CAL.X0, cy0=CAL.Y0;
  cw.px(cx0+8,cy0-2,P.k1); cw.line(cx0+3,cy0,cx0+8,cy0-2,P.m1); cw.line(cx0+13,cy0,cx0+8,cy0-2,P.m1);
  cw.rect(cx0,cy0,CAL.X1-cx0,CAL.Y1-cy0,P.s6); cw.vl(CAL.X1,cy0+1,CAL.Y1,P.c0); cw.hl(cx0+1,CAL.X1,CAL.Y1,P.c0);
  cw.rect(cx0+1,cy0+1,CAL.X1-cx0-2,6,P.b3); cw.rect(cx0+1,cy0+5,CAL.X1-cx0-2,2,P.a3); cw.hl(cx0+5,cx0+9,cy0+4,P.s6); cw.px(cx0+7,cy0+3,P.s5);   // Bild: Meer mit Boot
  M.microText(cw,'2011',cx0+1,cy0+8,P.r2);
  for (var rr=0;rr<4;rr++) for (var cc=0;cc<7;cc++){ var gx=cx0+2+cc*2, gy=cy0+14+rr*1; if (gy>=CAL.Y1-1) continue; cw.px(gx,gy,(rr*7+cc<20)?P.k1:P.s3); }
  // Nikolaus-Ikone mit Olivenzweig
  var iw=PW(b,RG.furn,0.3), ix=ICO.X0, iy=ICO.Y0, iw0=ICO.X1-ICO.X0, ih=ICO.Y1-ICO.Y0;
  iw.rect(ix,iy,iw0,ih,P.w1); iw.hl(ix,ix+iw0-1,iy,P.w3); iw.vl(ix,iy,iy+ih-1,P.w2); iw.rect(ix+1,iy+1,iw0-2,ih-2,P.y3); iw.drect(ix+1,iy+1,iw0-2,4,P.y3,P.y4,0.4);
  iw.ellipse(ix+5,iy+4,2.6,2.6,P.y5); iw.rect(ix+4,iy+3,3,3,P.p3); iw.rect(ix+4,iy+5,3,2,P.s6); iw.rect(ix+2,iy+7,7,ih-8,P.r2); iw.vl(ix+5,iy+7,iy+ih-2,P.s5); iw.px(ix+5,iy+9,P.k1); iw.rect(ix+6,iy+9,2,2,P.r3); iw.vl(ix+2,iy+7,iy+ih-2,P.r1);
  iw.line(ix-2,iy-3,ix+2,iy+1,P.e2); [[-2,-3],[-1,-4],[0,-2],[1,-3],[-3,-2]].forEach(function(o,i){ iw.px(ix+o[0],iy+o[1],i%2?P.g3:P.g4); });
  // Wanduhr (Regulator): Gehäuse, Zifferblatt, Glastür; das Pendel schwingt in dynamic
  var ck=PW(b,RG.furn,0.4), X0=CK.X0, X1=CK.X1;
  ck.rect(X0,CK.Y0+4,X1-X0,CK.Y1-CK.Y0-4,P.w2); ck.vl(X0,CK.Y0+4,CK.Y1-1,P.w3); ck.vl(X1-1,CK.Y0+4,CK.Y1-1,P.w0); ck.hl(X0-1,X1,CK.Y1,P.w1);
  ck.poly([[X0-1,CK.Y0+4],[X1+1,CK.Y0+4],[X1-2,CK.Y0+1],[X0+2,CK.Y0+1]],P.w3); ck.px((X0+X1)>>1,CK.Y0,P.w4); ck.hl(X0-1,X1,CK.Y0+4,P.w1);
  ck.ellipse(CK.PX+0.5,CK.Y0+10.5,5,5,P.y2); ck.ellipse(CK.PX+0.5,CK.Y0+10.5,4,4,P.s5);
  for (var hh=0;hh<12;hh++){ var an2=hh/12*Math.PI*2; ck.px(rnd(CK.PX+Math.cos(an2)*3.2),rnd(CK.Y0+10+Math.sin(an2)*3.2),P.s2); }
  ck.line(CK.PX,CK.Y0+10,CK.PX+2,CK.Y0+8,P.k1); ck.line(CK.PX,CK.Y0+10,CK.PX-1,CK.Y0+13,P.k1);   // zehn nach vier
  ck.rect(X0+2,CK.PY-1,X1-X0-4,CK.Y1-CK.PY-2,P.w0); ck.hl(X0+2,X1-3,CK.PY-1,P.w1); ck.px(X0+3,CK.PY+1,P.s3); ck.px(X0+3,CK.PY+2,P.s2);
}
function frameF(w,x,y,fw,fh,F,img){ w.rect(x,y,fw,fh,F[1]); w.hl(x,x+fw-1,y,F[2]); w.vl(x,y,y+fh-1,F[2]); w.hl(x,x+fw-1,y+fh-1,F[0]); w.vl(x+fw-1,y,y+fh-1,F[0]);
  for (var j=y+1;j<y+fh-1;j++) for (var i=x+1;i<x+fw-1;i++) w.px(i,j,img(i,j,(i-x-1)/Math.max(1,fw-3),(j-y-1)/Math.max(1,fh-3))); }

// ---------------------------------------------------------------- Raum: Tür, Mantel, Bett, Stuhl, Korb, Tisch
function paintRoomProps(b,S){
  // Tür in der linken Wand (cremefarben lackiert), Rahmen, Klinke
  var dq=M.wallQuad(SPEC,'L',DOOR.u0,DOOR.u1,DOOR.v0,DOOR.v1), zfL=function(x){ return ((x+0.5-VP[0])/(68-VP[0])-1)*F; }, dw=PW(b,RG.furn,zfL);
  var fq=M.wallQuad(SPEC,'L',DOOR.u0-2,DOOR.u1+2,DOOR.v0-3,DOOR.v1); dw.poly(fq,P.w1);
  dw.poly(dq,function(x,y){ var t=(x-dq[0][0])/(dq[1][0]-dq[0][0]), top=dq[0][1]+(dq[1][1]-dq[0][1])*t, bot=dq[3][1]+(dq[2][1]-dq[3][1])*t, v=(y-top)/(bot-top), c=P.s4;
    if (t<0.08||t>0.92||v<0.04) c=P.s5; if (Math.abs(v-0.5)<0.02) c=P.s3; if ((t>0.2&&t<0.8)&&((v>0.1&&v<0.45)||(v>0.56&&v<0.92))){ c=P.s3; if (t>0.25&&t<0.75&&((v>0.13&&v<0.42)||(v>0.59&&v<0.89))) c=P.s4; }
    if (hash(x,y)<0.05) c=P.s3; return c; });
  var kp=M.wallPt(SPEC,'L',DOOR.u0+2.5,80); dw.rect(rnd(kp[0])-1,rnd(kp[1]),3,2,P.y3); dw.px(rnd(kp[0])-1,rnd(kp[1])+3,P.k1);
  // gesticktes Bild (Goblen) mit Segelboot an der linken Wand
  var gq=M.wallQuad(SPEC,'L',16,30,50,68), gw=PW(b,RG.furn,zfL); gw.poly(gq,P.w2);
  var gi=M.wallQuad(SPEC,'L',17.3,28.7,51.5,66.5); gw.poly(gi,function(x,y){ var t=(x-gi[0][0])/(gi[1][0]-gi[0][0]), top=gi[0][1]+(gi[1][1]-gi[0][1])*t, bot=gi[3][1]+(gi[2][1]-gi[3][1])*t, v=(y-top)/(bot-top), c;
    c=v<0.45?(((x+y)%2)?P.d5:P.d4):(((x+y)%2)?P.b2:P.a3); if (v>0.25&&v<0.62&&Math.abs(t-0.5)<0.06) c=P.w1; if (v>0.22&&v<0.58&&t>0.52&&t<0.52+(v-0.22)*0.9) c=P.s5; if (v>0.6&&v<0.7&&t>0.3&&t<0.72) c=P.r2; return c; });
  // Kruzifix über dem Bett, in der Nische
  var cr=M.wallPt(SPEC,'R',36,66), cxr=rnd(cr[0]), cyr=rnd(cr[1]), xw=PW(b,RG.furn,36); xw.vl(cxr,cyr,cyr+9,P.w1); xw.hl(cxr-2,cxr+2,cyr+2,P.w1); xw.px(cxr,cyr+3,P.p3); xw.px(cxr,cyr+4,P.p3); xw.px(cxr+1,cyr,P.w3);
  // Haken mit dem schwarzen Mantel
  var hk=M.wallPt(SPEC,'L',HOOK.u,HOOK.v), hx=rnd(hk[0]), hy=rnd(hk[1]), cw=PW(b,RG.furn,function(){ return HOOK.u+3; });
  cw.rect(hx-1,hy-1,3,2,P.m2);
  cw.poly([[hx-1,hy],[hx+2,hy],[hx+5,hy+6],[hx+6,hy+30],[hx+4,hy+38],[hx-5,hy+38],[hx-6,hy+30],[hx-4,hy+6]],function(x,y){ var u=(x-hx+6)/12, c=P.k2; if (u>0.62) c=P.m0; if (u>0.8) c=P.k1; if (u<0.2) c=P.k1; if (Math.abs(x-hx)<0.6&&y>hy+8) c=P.k1; if ((y-hy)%9===4&&Math.abs(x-hx-1)<0.6) c=P.m1; return c; });
  cw.line(hx-2,hy+3,hx-4,hy+12,P.k1); cw.line(hx+3,hy+3,hx+5,hy+12,P.m1);
  // Bett in der Nische: Kopfteil, Matratze, Häkeldecke aus bunten Quadraten, Spitzenkissen
  box3(b,BD.X0,BD.X1,78,96,BD.Z0-2,BD.Z0,{front:function(x,y,X,Y){ return (Y<79.5)?P.w3:((Math.abs(X-BD.X0-2)<1||Y>94)?P.w0:P.w1); },left:P.w0});
  var GR=[P.r2,P.g3,P.y2,P.c2,P.d2,P.e3,P.r1,P.e2,P.c3];
  function granny(X,Z,x,y){ var s=5.5, gi=Math.floor((X-BD.X0)/s), gj=Math.floor((Z-BD.Z0)/s), fu=(X-BD.X0)/s-gi, fv=(Z-BD.Z0)/s-gj;
    if (fu<0.12||fv<0.12) return P.s4; var c=GR[Math.floor(hash(gi,gj)*GR.length)], d=Math.max(Math.abs(fu-0.56),Math.abs(fv-0.56)); if (d<0.14) c=P.s4; else if (d<0.28) c=GR[Math.floor(hash(gj,gi+3)*GR.length)]; else if (d>0.4) c=M.DN[c]; return c; }
  box3(b,BD.X0,BD.X1,BD.Y0,96,BD.Z0,BD.Z1,{top:function(x,y,X,Y,Z){ if (Z<BD.Z0+9) return (hash(x,y)<0.2)?P.s4:P.s5; return granny(X,Z,x,y); },
    left:function(x,y,X,Y,Z){ if (Y>93.5) return (Y>95)?P.w0:P.w1; return granny(BD.X0+(Y-BD.Y0)*1.6,Z,x,y); },
    front:function(x,y,X,Y){ if (Y>93.5) return P.w1; return granny(X,BD.Z1-2+(Y-BD.Y0),x,y); }});
  box3(b,BD.X1-24,BD.X1-2,85.5,BD.Y0,BD.Z0+1,BD.Z0+8,{top:function(x,y){ return (hash(x,y)<0.25)?P.s5:P.s6; },left:P.s4,front:function(x,y){ return ((x+y)%3===0)?P.s4:P.s5; }});
  box3(b,BD.X0,BD.X0+2,82,96,BD.Z1-1,BD.Z1+1,{front:P.w2,left:P.w1,top:P.w3});
  // Stuhl am Fenster, zum Fenster gedreht (wir sehen die Lehne), darauf die gefaltete Decke
  var C=R('w1 w2 w3 w4');
  [[CH.X0,CH.Z0],[CH.X1-1.4,CH.Z0]].forEach(function(l){ box3(b,l[0],l[0]+1.4,CH.YS,96,l[1],l[1]+1.4,{front:C[0],left:C[0],right:C[0]}); });
  box3(b,CH.X0,CH.X1,CH.YS-1.4,CH.YS,CH.Z0,CH.Z1,{top:C[2],front:C[1],left:C[0]});
  box3(b,CH.X0+1.5,CH.X1-1.5,CH.YS-4,CH.YS-1.4,CH.Z0+1.5,CH.Z1-2.5,{top:function(x,y,X,Y,Z){ return ((Math.floor(X)+Math.floor(Z))%4<2)?P.r2:P.r3; },front:function(x,y,X,Y){ return (Y>CH.YS-2.4)?P.r1:((Math.floor(X)%4<2)?P.r2:P.e2); },left:P.r1});
  [[CH.X0,CH.Z1-1.4],[CH.X1-1.4,CH.Z1-1.4]].forEach(function(l){ box3(b,l[0],l[0]+1.4,CH.YB,96,l[1],l[1]+1.4,{front:C[1],left:C[0],right:C[0],top:C[3]}); });
  box3(b,CH.X0,CH.X1,CH.YB,CH.YB+2.2,CH.Z1-1.2,CH.Z1,{front:C[2],top:C[3]});
  for (var sl=CH.X0+4;sl<CH.X1-2;sl+=4) box3(b,sl,sl+1.5,CH.YB+2.2,CH.YS-1.2,CH.Z1-1,CH.Z1-0.2,{front:C[1]});
  // Nähkorb mit grauer Wolle und Stricknadeln
  box3(b,BK.X0,BK.X1,BK.Y0,96,BK.Z0,BK.Z1,{top:P.e1,left:function(x,y){ return ((x+(y>>1))%3===0)?P.e1:(((x+y)%2)?P.e3:P.e2); },front:function(x,y){ return ((x+(y>>1))%3===0)?P.e1:(((x*2+y)%3)?P.e3:P.e4); }});
  var wl=PW(b,RG.furn,BK.Z0+6); [[184,89,BK.Z0+5,2.4],[189,89.4,BK.Z0+8,2.2],[186.5,88.5,BK.Z0+10,2]].forEach(function(o){ var q=p3(o[0],o[1],o[2]); wl.ellipse(q[0],q[1],o[3]*1.15,o[3],function(x,y){ var dx=x-q[0], dy=y-q[1]; return (dx*0.6+dy*0.8<-0.6)?P.m4:((dx+dy>0.9)?P.m2:P.m3); }); });
  var n0=ip3(186,89,BK.Z0+8); wl.line(n0[0],n0[1],n0[0]-4,n0[1]-9,P.m4); wl.line(n0[0]+2,n0[1],n0[0]+5,n0[1]-8,P.s5); wl.px(n0[0]-4,n0[1]-10,P.y3); wl.px(n0[0]+5,n0[1]-9,P.y3);
  // Flickenteppich vor dem Bett
  var rw0=PW(b,RG.floor,function(x,y){ var f=R3.floor(x+0.5,y+0.5); return f?f.Z:60; });
  rw0.poly([p3(176,96,62),p3(214,96,62),p3(214,96,80),p3(176,96,80)],function(x,y){ var f=R3.floor(x+0.5,y+0.5); if (!f) return undefined; var st=Math.floor((f.Z-62)/2.2), RC=[P.r2,P.e3,P.c2,P.s4,P.r1,P.e2,P.c3,P.y2];
    var c=RC[(st*3+1)%RC.length]; if (hash(Math.floor(f.X/2),st)<0.25) c=RC[(st*5+2)%RC.length]; if (f.X<177.2||f.X>212.8) c=P.s3; return c; });
  // Tisch mit Wachstuch
  [[TB.X0+2,TB.Z0+2],[TB.X1-4,TB.Z0+2],[TB.X0+2,TB.Z1-4],[TB.X1-4,TB.Z1-4]].forEach(function(l){ box3(b,l[0],l[0]+2,TB.Y0,96,l[1],l[1]+2,{front:P.w2,left:P.w1,right:P.w1},RG.table); });
  function oil(X,Z){ var a=Math.floor((X-TB.X0)/3.2)%2, c2=Math.floor((Z-TB.Z0)/2.6)%2; return (a&&c2)?P.r2:((a||c2)?P.r3:P.s4); }   // rot-weiß kariertes Wachstuch
  box3(b,TB.X0-1,TB.X1+1,TB.Y0,TB.Y0+4,TB.Z0-1,TB.Z1+1,{top:function(x,y,X,Y,Z){ return oil(X,Z); },front:function(x,y,X,Y){ var c=oil(X,TB.Z1+(Y-TB.Y0)*1.3); if (Y>TB.Y0+3.3) c=M.DN[c]; return (Y<TB.Y0+0.8)?M.UP[c]:c; },right:function(x,y,X,Y,Z){ return M.DN[oil(TB.X1+Y,Z)]; }},RG.table);
  // Tassen: eine benutzt (Kaffeerand, Löffel), eine unbenutzt, umgedreht auf der Untertasse
  var cu=PW(b,RG.table,52), c1=p3(107,TB.Y0,51), c2=p3(117,TB.Y0,49);
  cu.ellipse(c1[0],c1[1],3.6,1.3,P.s4); cu.rect(rnd(c1[0])-2,rnd(c1[1])-4,4,4,P.s6); cu.vl(rnd(c1[0])+1,rnd(c1[1])-4,rnd(c1[1])-1,P.s4); cu.hl(rnd(c1[0])-2,rnd(c1[0])+1,rnd(c1[1])-4,P.w1); cu.px(rnd(c1[0])-1,rnd(c1[1])-4,P.w0); cu.px(rnd(c1[0])+2,rnd(c1[1])-3,P.s5); cu.px(rnd(c1[0])+2,rnd(c1[1])-2,P.s5); cu.line(rnd(c1[0])-4,rnd(c1[1]),rnd(c1[0])-6,rnd(c1[1])-1,P.m4);
  cu.ellipse(c2[0],c2[1],3.6,1.3,P.s5); cu.rect(rnd(c2[0])-2,rnd(c2[1])-3,4,3,P.s6); cu.hl(rnd(c2[0])-1,rnd(c2[0]),rnd(c2[1])-4,P.s6); cu.vl(rnd(c2[0])+1,rnd(c2[1])-3,rnd(c2[1])-1,P.s5);
  // Schuhkarton, mit Band verschnürt (oder offen: Briefe)
  var BX={X0:127,X1:143,Y0:79,Z0:46,Z1:55};
  if (!S.boxOpen){ box3(b,BX.X0,BX.X1,BX.Y0,TB.Y0,BX.Z0,BX.Z1,{top:function(x,y,X,Y,Z){ if (Math.abs(X-135)<0.7||Math.abs(Z-50.5)<0.6) return P.r3; return (hash(x,y)<0.1)?P.e3:P.e4; },
      front:function(x,y,X,Y){ if (Math.abs(X-135)<0.7) return P.r2; if (Y<BX.Y0+1.6) return P.e4; return (Y<BX.Y0+2.2)?P.e1:P.e3; },right:P.e2},RG.table);
    var bw=PW(b,RG.table,BX.Z1), kt=ip3(135,BX.Y0,50.5); bw.px(kt[0]-1,kt[1]-1,P.r4); bw.px(kt[0]+1,kt[1]-1,P.r4); bw.px(kt[0],kt[1],P.r2); }
  else { // offen: dunkles Inneres, Briefe mit Luftpostrand, gebündelt; Deckel und Band liegen davor
    box3(b,BX.X0,BX.X1,BX.Y0,TB.Y0,BX.Z0,BX.Z1,{top:function(x,y,X,Y,Z){ var u=(X-BX.X0)/(BX.X1-BX.X0), v=(Z-BX.Z0)/(BX.Z1-BX.Z0); if (u<0.07||u>0.93||v<0.12||v>0.88) return P.e4;
        var row=Math.floor(v*3.2), lu=(u*5+row*0.5)%1; if (lu<0.12) return P.w0; var c=(row%2)?P.s6:P.s5; if (lu>0.86) c=((Math.floor(u*40))%2)?P.r3:P.b2; if (Math.abs(u-0.45)<0.05) c=P.r2; return c; },
      front:function(x,y,X,Y){ return (Y<BX.Y0+1.2)?P.e4:((Y<BX.Y0+2)?P.e1:P.e3); },right:P.e2},RG.table);
    box3(b,BX.X0+1,BX.X1-1,TB.Y0-1,TB.Y0,BX.Z1+0.5,TB.Z1-0.3,{top:function(x,y,X){ return (Math.abs(X-135)<0.7)?P.r3:P.e4; },front:P.e2},RG.table);
    var rb=PW(b,RG.table,TB.Z1-1), rb0=ip3(BX.X0-6,TB.Y0,58), rb1=ip3(BX.X0+2,TB.Y0,57); rb.line(rb0[0],rb0[1],rb1[0],rb1[1],P.r3); rb.px(rb0[0]-1,rb0[1],P.r2);
    var ew=PW(b,RG.table,BX.Z0+4); [[129,3,0],[133,4,1],[138,3,0]].forEach(function(e,i){ var q=ip3(e[0],BX.Y0,BX.Z0+3+i*2); ew.rect(q[0],q[1]-e[1],5,e[1]+1,P.s6); ew.hl(q[0],q[0]+4,q[1]-e[1],e[2]?P.b2:P.r3); ew.px(q[0]+4,q[1]-e[1]+1,P.s4); }); }
}

// ---------------------------------------------------------------- Licht: gedämpft, weiches Fensterlicht, Streifen, Lichtschächte
function paintLight(b,tod){ var day=tod==='day';
  M.light(b,function(x,y){ var k=y*W+x, r=REG[k]; if (r===RG.view||r===RG.none) return 0; var Z=DEPTH[k], q=unp(x,y,Z), X=q[0], Y=q[1];
    var v=day?-1:-0.4;                                                                                           // gedämpftes Zimmer
    var dx=(X-172)/85, dz=Z/80, dy=(Y-62)/64, g=Math.max(0,1-dx*dx-dz*dz*0.7-dy*dy*0.35); v+=g*(day?1.15:0.4);    // weiches Fensterlicht
    if (r===RG.wall && Z<0.5 && X>WN.X0-22 && X<WN.X1+22 && Y>WN.Y0-12 && Y<WN.Y1+6) v-=0.3;                    // Gegenlicht um das Fenster
    if (r===RG.ceil) v-=0.35;
    var cx=(x-160)/190, cy=(y-72)/105; v-=Math.max(0,cx*cx+cy*cy-0.36)*0.8;
    if (day){ var L=lit3(X,Y,Z); if (L) v+=2.5*L; v+=Math.min(0.7,volAt(x,y,Z)*0.11); }
    return v; },0,0); }

// ---------------------------------------------------------------- Bild
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS); REG.fill(0); DEPTH.fill(0);
  paintRoom(b); paintWindow(b,tod,weather); paintBack(b,S); paintRoomProps(b,S);
  paintLight(b,tod);
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.view; } }); return LAST; }
// der Tisch (mit Tassen und Karton) als Ebene: wer dahinter steht, verschwindet bis zur Hüfte hinter ihm
function layers(S,GS,tod){ if (!LAST) return []; var r=R3.rect(TB.X0-2,TB.X1+2,72,96,TB.Z0-2,TB.Z1+2), base=Math.round(p3(TB.X0,96,TB.Z1)[1]), l=M.layer(r[0],r[1],r[2]+1,r[3]+1,base);
  for (var y=r[1];y<=r[1]+r[3];y++) for (var x=r[0];x<=r[0]+r[2];x++){ if (x<0||y<0||x>=W||y>=H) continue; if (REG[y*W+x]===RG.table) l.px(x-r[0],y-r[1],LAST.d[y*W+x]); }
  return [l]; }

// ---------------------------------------------------------------- jedes Bild: Pendel, Staub im Licht, ein Tropfen am Glas
var MOTES=[]; (function(){ for (var i=0;i<34;i++) MOTES.push([GL.X0+hash(i,1)*(GL.X1-GL.X0),GL.Y0+hash(i,2)*(GL.Y1-GL.Y0),4+hash(i,3)*52,hash(i,4)*6.28]); })();
function dynamic(fb,v,S,GS){ var t=v.t, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  function tc(c,x,y){ return tint?M.tintPx(tint,c,x,y):c; }
  // Pendel der Wanduhr (eine Schwingung je Sekunde)
  var th=Math.sin(t*Math.PI)*0.3, L=11, px=CK.PX, py=CK.PY, bx=px+Math.sin(th)*L, by=py+Math.cos(th)*L;
  for (var s=0;s<=L;s++){ var xx=rnd(px+Math.sin(th)*s), yy=rnd(py+Math.cos(th)*s); if (xx>CK.X0+1&&xx<CK.X1-2) fb.px(xx,yy,tc(P.y1,xx,yy)); }
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var qx=rnd(bx)+i, qy=rnd(by)+j; if (qx>CK.X0+1&&qx<CK.X1-2&&qy<CK.Y1-1) fb.px(qx,qy,tc((i<0||j<0)?P.y4:P.y2,qx,qy)); }
  if (tod!=='day') return;
  // Staub tanzt in den Lichtstreifen
  MOTES.forEach(function(m,i){ var Z=m[2]+Math.sin(t*0.13+m[3])*3, X0=m[0]+Math.sin(t*0.21+i)*2.5, Y0=m[1]+Math.cos(t*0.17+i*1.3)*2+(((t*0.5+i*7)%10)-5);
    if (!winLit(X0,Y0)) return; var X=X0-SX*Z, Y=Y0+SY*Z; if (Y>95) return; var q=p3(X,Y,Z), sx=rnd(q[0]), sy=rnd(q[1]); if (sx<0||sy<0||sx>=W||sy>=H) return;
    if (Math.sin(t*2.1+i*1.7)>-0.3) fb.px(sx,sy,Math.sin(t*1.3+i)>0.35?P.s6:P.s5); });
  // ein Tropfen rinnt langsam übers Glas
  var dx=GL.X0+27, dy=GL.Y0+rnd(((t*2.2)%40)); if (dy<GL.Y1-1 && Math.abs(dx-GL.MX)>1 && Math.abs(dy-GL.MY)>1){ fb.px(dx,dy,P.s6); fb.px(dx,dy-1,P.m4); } }

// Geistersicht: der Stuhl am Fenster, auf dem sie siebenundzwanzig Jahre gewartet hat, und die zweite Tasse schimmern kalt
function ghost(fb,v,S,GS){ var t=v.t, bg=LAST, G=M.TINT.ghost;
  function free(x,y){ if (!bg) return true; return fb.get(x,y)===M.tintPx(G,bg.get(x,y),x,y); }
  var r=R3.rect(CH.X0,CH.X1,CH.YB,96,CH.Z0,CH.Z1), a=0.5+0.5*Math.sin(t*1.1);
  for (var y=r[1];y<r[1]+r[3];y++) for (var x=r[0];x<r[0]+r[2];x++){ if (!bg) break; var c=bg.get(x,y), k=y*W+x; if (REG[k]!==RG.furn||DEPTH[k]>CH.Z1+0.5||DEPTH[k]<CH.Z0-0.5) continue;
    var edge=REG[k-1]!==RG.furn||REG[k+1]!==RG.furn||REG[k-W]!==RG.furn; if (edge && free(x,y) && bayer(x,y)<0.35+a*0.5) fb.px(x,y,a>0.6?P.x5:P.x4); }
  var cq=p3(117,TB.Y0-2,49); for (var i=0;i<6;i++){ var mx=rnd(cq[0]+Math.sin(t*0.8+i*2)*3), my=rnd(cq[1]-((t*4+i*5)%14)); if (free(mx,my)) fb.px(mx,my,i%2?P.x4:P.x5); } }

// ---------------------------------------------------------------- Raum
function rr(X0,X1,Y0,Y1,Z0,Z1){ return R3.rect(X0,X1,Y0,Y1,Z0,Z1); }
var WALK=function(x,y){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<30||Z>100) return false; if (X<74||X>230) return false;
  if (X>TB.X0-6&&X<TB.X1+5&&Z>TB.Z0-6&&Z<TB.Z1+6) return false;     // Tisch
  if (X>BD.X0-5&&Z<BD.Z1+6) return false;                 // Bett
  return true; };
M.defineArt('ivka',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, ghost:ghost, walk:WALK, walkG:function(){ return false; },
  spots:{ door:(function(){ var q=M.wallQuad(SPEC,'L',DOOR.u0-2,DOOR.u1+2,DOOR.v0-3,DOOR.v1); return [rnd(q[1][0]),rnd(q[1][1]),rnd(q[0][0]-q[1][0])+1,rnd(q[2][1]-q[1][1])]; })(),
    window:[WN.X0-3,WN.Y0-2,WN.X1-WN.X0+6,WN.Y1-WN.Y0+4], chair:rr(CH.X0,CH.X1,CH.YB,96,CH.Z0,CH.Z1), cupboard:(function(){ var a=ip3(CR.X0,CR.Y0,CR.Z1), c=ip3(CR.X1,CR.Y0,CR.Z1), tb=ip3(TB.X0,TB.Y0,TB.Z0); return [a[0],a[1]-3,c[0]-a[0]+1,tb[1]-a[1]+3]; })(),
    photo_tonci:(function(){ var a=ip3(PT.X0,PT.Y0,PT.Z), c=ip3(PT.X1,CR.Y0,PT.Z); return [a[0]-1,a[1]-1,c[0]-a[0]+2,c[1]-a[1]+2]; })(),
    photo_boat:(function(){ var a=ip3(PB.X0,PB.Y0,PB.Z), c=ip3(PB.X1,CR.Y0,PB.Z); return [a[0]-1,a[1]-1,c[0]-a[0]+2,c[1]-a[1]+2]; })(),
    radio:rr(RD.X0,RD.X1,RD.Y0-3,CR.Y0,RD.Z0,RD.Z1), table:rr(TB.X0,TB.X1,TB.Y0,96,TB.Z0,TB.Z1), cups:rr(102,122,TB.Y0-5,TB.Y0,47,53),
    shoebox:rr(127,143,78,TB.Y0,46,55), calendar:[CAL.X0-1,CAL.Y0-3,CAL.X1-CAL.X0+3,CAL.Y1-CAL.Y0+4], icon:[ICO.X0-3,ICO.Y0-4,ICO.X1-ICO.X0+4,ICO.Y1-ICO.Y0+5],
    basket:rr(BK.X0,BK.X1,BK.Y0-6,96,BK.Z0,BK.Z1), bed:rr(BD.X0,BD.X1,78,96,BD.Z0-2,BD.Z1+1), coat:(function(){ var hk=M.wallPt(SPEC,'L',HOOK.u,HOOK.v); return [rnd(hk[0])-7,rnd(hk[1])-2,14,41]; })(),
    clock:[CK.X0-2,CK.Y0-1,CK.X1-CK.X0+4,CK.Y1-CK.Y0+3], stove:rr(SV.X0,SV.X1,52,96,SV.Z0,SV.Z1) },
  stands:{ door:R3.st(77,70,'L'), window:R3.st(172,32,'B'), chair:R3.st(166,32,'B'), cupboard:R3.st(118,33,'B'), photo_tonci:R3.st(102,33,'B'), photo_boat:R3.st(116,33,'B'),
    radio:R3.st(136,33,'B'), table:R3.st(120,70,'B'), cups:R3.st(106,70,'B'), shoebox:R3.st(134,70,'B'), calendar:R3.st(106,33,'B'), icon:R3.st(124,33,'B'),
    basket:R3.st(190,32,'B'), bed:R3.st(196,68,'R'), coat:R3.st(80,46,'L'), clock:R3.st(194,32,'B'), stove:R3.st(82,33,'B') },
  actorPos:{},
  start:R3.st(78,72,'R'), entries:{ varos:R3.st(78,72,'R') }
});
})(M);
