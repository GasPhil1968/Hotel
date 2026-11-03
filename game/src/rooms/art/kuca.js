/* ===== rooms/art/kuca.js — Großmutter Ružas Küche in Vratnik =====
   Eine niedrige Küche eines alten Hauses, seit 1994 unbewohnt, aber gelüftet. Hinten die Kredenz mit Glastüren voller
   Fildžani und Untertassen, das Fenster mit Spitzenvorhang und dem Blick in den verwilderten Garten mit dem kahlen
   Quittenbaum, der Wandkalender von 1994 (aufgeschlagen: Februar) und rechts der gusseiserne Kohleherd mit Backrohr,
   Feuertür, Aschenlade und dem kleinen, verrosteten Wärmefach oben seitlich; das Ofenrohr geht in die Wand. Rechts an der
   Wand das Sofa mit Kelim unter einem weißen Tuch, darüber das Hochzeitsfoto (ein Mann mit Schnurrbart). In der Mitte der
   Tisch mit Häkeldecke und zwei Stühlen, links die Tür und ein kleines, verhängtes Nähtischchen. Kaltes Licht fällt
   durch die Spitze und zeichnet ihr Muster auf Boden und Tisch; Staub tanzt darin.
   Zustände: S.compOpen (Wärmefach offen), S.msgTaken (das gefaltete Formular darin ist fort), S.sheetsOff (Tücher ab). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;
var VP=[160,61], RECT=[64,50,256,94], F=96, FY=94, CY=50;
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
function wq(sd,Z0,Z1,YT,YB){ return M.wallQuad(SPEC,sd,Z0,Z1,YT,YB); }          // Seitenwand: u = Z, weil Abstand zur Wand = F

// Tiefen- und Regionenpuffer: jede gemalte Fläche merkt sich ihre Raumtiefe Z
var DEPTH=new Float32Array(W*H), REG=new Uint8Array(W*H), RG={none:0,view:1,wall:2,floor:3,ceil:4,furn:5,frame:6,table:7,stove:8,sheet:9,glass:10}, LAST=null;
function PW(b,reg,zf){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=reg; DEPTH[k]=typeof zf==='function'?zf(x,y):zf; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
// Quader in Raumkoordinaten; jede Seite Farbe oder fn(x,y,X,Y,Z) mit dem Raumpunkt der Fläche
function box3(b,X0,X1,Y0,Y1,Z0,Z1,f,reg){ reg=reg||RG.furn;
  function call(fill,x,y,zf){ if (typeof fill!=='function') return fill; var Z=zf(x,y), q=unp(x,y,Z); return fill(x,y,q[0],q[1],Z); }
  var zt=function(x,y){ return ((y+0.5-VP[1])/(Y0-VP[1])-1)*F; }, zr=function(x){ return ((x+0.5-VP[0])/(X1-VP[0])-1)*F; }, zl=function(x){ return ((x+0.5-VP[0])/(X0-VP[0])-1)*F; }, zfr=function(){ return Z1; };
  if (Y0>VP[1] && f.top!==undefined) PW(b,reg,zt).poly([p3(X0,Y0,Z0),p3(X1,Y0,Z0),p3(X1,Y0,Z1),p3(X0,Y0,Z1)],function(x,y){ return call(f.top,x,y,zt); });
  if (X1<VP[0] && f.right!==undefined) PW(b,reg,zr).poly([p3(X1,Y0,Z0),p3(X1,Y0,Z1),p3(X1,Y1,Z1),p3(X1,Y1,Z0)],function(x,y){ return call(f.right,x,y,zr); });
  if (X0>VP[0] && f.left!==undefined) PW(b,reg,zl).poly([p3(X0,Y0,Z0),p3(X0,Y0,Z1),p3(X0,Y1,Z1),p3(X0,Y1,Z0)],function(x,y){ return call(f.left,x,y,zl); });
  if (f.front!==undefined) PW(b,reg,zfr).poly([p3(X0,Y0,Z1),p3(X1,Y0,Z1),p3(X1,Y1,Z1),p3(X0,Y1,Z1)],function(x,y){ return call(f.front,x,y,zfr); }); }

// ---------------------------------------------------------------- Maße (X quer wie auf der Rückwand, Y Höhe, Boden 94, Z Tiefe)
var CR={X0:70,X1:108,Y0:79,Z1:12, UX0:72,UX1:106,UY0:55,UY1:77,UZ1:8};   // Kredenz: Unterschrank, Aufsatz mit Glastüren
var WN={X0:118,X1:160,Y0:57,Y1:79};                                      // Fenster (Öffnung)
var CAL={X0:166,X1:182,Y0:55,Y1:77};                                     // Kalender
var SV={X0:190,X1:232,Y0:80,Z0:2,Z1:20};                                 // Herd
var WB={X0:216,X1:232,Y0:71,Z0:2,Z1:10};                                 // Wärmefach (Kasten oben seitlich)
var FL={X0:219,X1:229,Y0:72.5,Y1:78};                                    // Klappe des Wärmefachs (auf seiner Vorderseite)
var PIPE={X:198,Z:5,Y1:56};                                              // Ofenrohr
var TB={X0:116,X1:162,Y0:82,Z0:46,Z1:64};                                // Tisch
var CA={X0:100,X1:112,Z0:50,Z1:60,YS:87,YB:76};                          // Stuhl links (Lehne links)
var CB={X0:166,X1:178,Z0:48,Z1:58,YS:87,YB:76};                          // Stuhl rechts (Lehne rechts)
var SO={X0:226,X1:256,Z0:30,Z1:76,YS:86,YB:76};                          // Sofa an der rechten Wand
var NT={X0:65,X1:83,Y0:82,Z0:16,Z1:28};                                  // Nähtischchen (unter einem Tuch)
var DOOR={u0:36,u1:56,v0:60,v1:94};                                      // Tür in der linken Wand
var PHOTO={u0:34,u1:46,v0:59,v1:71};                                     // Hochzeitsfoto über dem Sofa (rechte Wand)
var LX=139, LZ=0;                                                        // Lichtquelle: Fenster

// ---------------------------------------------------------------- Wände, Boden, Decke
var WALLR=R('c1 c2 c3 c4 m4 b5'), DADO=R('c2 c3 c4 b4');
function wallTone(u,v,sd){ var n=fbm(u,v,24,sd), base=0.64+(n-0.5)*0.1;
  var st=fbm(u*0.6,v*1.4,9,sd+3); if (st>0.74) base-=0.08;                                                  // Wasserflecken, alte Kalkschichten
  return base; }
function wallC(u,v,x,y,sd){ var Y=CY+v;
  if (Y>82){ if (Y<83) return P.c1; var mu=((Math.round(u)%8)+8)%8, mv=((Math.round(Y)%6)+6)%6, c=ra(DADO,0.55+(fbm(u,v,12,sd+2)-0.5)*0.3,x,y);   // gerollter Sockel mit Muster
    if ((mu===4&&mv===2)||(mu===3&&mv===3)||(mu===5&&mv===3)) c=P.s5; return c; }
  if (Y>81) return P.b4;
  return ra(WALLR,wallTone(u,v,sd)-(Y<CY+3?0.2:0),x,y); }
// Decke: Bretter in Raumrichtung, schwere Balken quer (Strahltest: Unterseite, Vorderseite oder Decke dahinter)
var BZ=[20,70,120,170,220,270,320,370,420,470], BW=7, BT=2;
function ceilPx(xb,x,y){ var k=y*W+x, kc=(VP[1]-y)/(VP[1]-CY), ku=(VP[1]-y)/(VP[1]-CY-BT), Zu=(ku-1)*F, i;
  REG[k]=RG.ceil;
  for (i=0;i<BZ.length;i++) if (Zu>=BZ[i]&&Zu<BZ[i]+BW){ DEPTH[k]=Zu; var xu=VP[0]+(x+0.5-VP[0])/ku; return ((Zu-BZ[i])<0.8||(BZ[i]+BW-Zu)<0.8)?P.w0:(hash(Math.floor(xu/9),i)<0.5?P.w1:(hash(xu,i)<0.15?P.w0:P.w1)); }
  var best=-1; for (i=0;i<BZ.length;i++){ var k1=1+(BZ[i]+BW)/F; if (k1>=kc && k1<=ku && k1>best) best=k1; }
  if (best>0){ DEPTH[k]=(best-1)*F; var fy=(y-(VP[1]-(VP[1]-CY)*best))/((VP[1]-(VP[1]-CY)*best)-(VP[1]-(VP[1]-CY-BT)*best)); return (Math.abs(fy)<0.3)?P.w3:P.w2; }
  var Zc=(kc-1)*F; DEPTH[k]=Zc; var bx=((xb-64)%7+7)%7, c=ra(R('w2 w3 e2 e3 e4'),0.5+(fbm(xb,Zc*0.3,9,6)-0.5)*0.4,x,y); if (bx<0.9) c=P.w1; if (hash(Math.floor(xb/7),Math.floor(Zc/20))<0.12) c=M.DN[c]; return c; }
function paintRoom(b){
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ var k=y*W+x; REG[k]=RG.wall; DEPTH[k]=0; return wallC(u+64,v,x,y,1); },
    side:function(u,v,x,y,sd){ var k=y*W+x; REG[k]=RG.wall; DEPTH[k]=u; return wallC(u*1.5+(sd==='L'?0:300),v,x,y,sd==='L'?3:5); },
    floor:function(xb,d,x,y){ var k=y*W+x, f=R3.floor(x+0.5,y+0.5); REG[k]=RG.floor; DEPTH[k]=f?f.Z:0; var c=tex.planks(xb,y,VP[1],FY,R('w0 w1 w2 w3'),11); if (f && hash(Math.floor(f.X/11),Math.floor(f.Z/30))<0.25 && c!==P.w0) c=M.DN[c]; return c; },
    ceil:function(xb,d,x,y){ return ceilPx(xb,x,y); } });
  var bw=PW(b,RG.wall,0); bw.hl(64,255,93,P.w1); bw.hl(64,255,92,P.w0);
  // Risse und ein alter Nagel mit einem hellen Fleck (dort hing einmal ein Spiegel)
  bw.line(92,44,97,50,P.m2); bw.line(97,50,95,53,P.m2); bw.rect(170,48,6,4,P.s6); bw.px(173,47,P.k1); }

// ---------------------------------------------------------------- Fenster: Garten mit Quittenbaum, Spitzenvorhang
function paintWindow(b,tod){ var v=PW(b,RG.view,-4), x0=WN.X0+2, x1=WN.X1-2, y0=WN.Y0+2, y1=WN.Y1-1, x, y;
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var c;
    if (y<y0+12) c=ra(R('b2 b3 b4 b5'),0.25+(y-y0)/12*0.6,x,y);                                             // kalter, klarer Himmel
    else if (y<y0+15) c=(hash(x>>2,3)<0.5)?P.t2:P.t3;                                                       // Dächer
    else if (y<y0+19) c=ra(R('s2 s3 s4'),0.5+(hash(x,y)-0.5)*0.4,x,y);                                     // Gartenmauer
    else c=ra(R('e1 e2 g1 e3'),0.4+(fbm(x,y,3,2)-0.5)*0.8,x,y);                                            // verwildertes, dürres Gras
    v.px(x,y,c); }
  // Quittenbaum, kahl
  var qx=x0+12; for (y=y0+6;y<y1;y++){ v.px(qx+rnd(Math.sin(y*0.3)),y,P.w1); }
  [[-1,-0.7,9],[1,-0.4,10],[-1,-1.2,6],[1,-1.4,7]].forEach(function(br,i){ var px=qx, py=y0+12-i; for (var s=0;s<br[2];s++){ px+=br[0]*Math.cos(br[1]*0.6)*0.9; py+=Math.sin(br[1])*0.8; v.px(rnd(px),rnd(py),P.w1); if (s>3 && s%2) v.px(rnd(px)+br[0],rnd(py)-1,P.w2); } });
  v.px(qx+5,y0+9,P.y3);
  // Spitzenvorhang über die untere Hälfte: feines Rautennetz, Blütenmotive, gewellter Saum; oben ist das Glas frei
  var cy0=y0+10, mx0=(x0+x1)/2;
  for (y=cy0;y<y1;y++) for (x=x0;x<x1;x++){ var u=x-x0, w2=y-cy0, bg=b.get(x,y);
    var net=((u+w2)%4===0)||((u-w2+64)%4===0), mot=Math.hypot(((u%10)-5),((w2%8)-4)*1.2)<2.2, scal=(w2===0&&(u%3)!==1);
    var c2=net?P.s6:(bayer(x,y)<0.35?P.s5:bg); if (mot) c2=((u+w2)%2)?P.s6:P.s4; if (w2<2) c2=(w2===0)?(scal?P.s6:bg):P.s5; if (Math.abs(x+0.5-mx0)<0.6) c2=P.s4; if (u%11===0 && w2>3) c2=P.s4;
    v.px(x,y,c2); }
  for (x=x0;x<x1;x++){ if ((x-x0)%3===1) v.px(x,cy0-1,P.s6); }
  for (x=x0;x<x1;x++) v.px(x,y0+8,P.m3);                                                                        // Stange
  // Rahmen (weiß lackiert, abgeblättert), Kreuz, Laibung, Fensterbrett
  var fr=PW(b,RG.frame,-1);
  for (y=WN.Y0;y<WN.Y1;y++){ fr.px(WN.X0,y,P.s5); fr.px(WN.X0+1,y,P.s4); fr.px(WN.X1-1,y,P.s3); fr.px(WN.X1-2,y,P.s4); }
  for (x=WN.X0;x<WN.X1;x++){ fr.px(x,WN.Y0,P.s5); fr.px(x,WN.Y0+1,P.s4); fr.px(x,WN.Y1-1,P.s3); }
  var mx=rnd((WN.X0+WN.X1)/2); for (y=WN.Y0;y<WN.Y0+10;y++){ fr.px(mx,y,P.s4); fr.px(mx-1,y,P.s5); } for (x=WN.X0;x<WN.X1;x++) fr.px(x,WN.Y0+9,P.s4);
  for (var k=0;k<7;k++){ var fx=WN.X0+rnd(hash(k,3)*(WN.X1-WN.X0)), fy=WN.Y0+rnd(hash(k,4)*2); fr.px(fx,fy,P.w2); }
  box3(b,WN.X0-3,WN.X1+3,WN.Y1,WN.Y1+2.5,0,6,{top:P.s5,front:P.s3,left:P.s2,right:P.s4},RG.frame);
  // eine leere Vase auf dem Fensterbrett
  var vp=ip3(158,WN.Y1,3), vw=PW(b,RG.furn,3); vw.rect(vp[0]-1,vp[1]-6,3,6,P.a3); vw.px(vp[0]-1,vp[1]-6,P.a5); vw.px(vp[0],vp[1]-7,P.a4); vw.vl(vp[0]+1,vp[1]-5,vp[1]-1,P.a2); }

// ---------------------------------------------------------------- Rückwand: Kredenz mit Fildžani, Kalender, Herd mit Wärmefach, Ofenrohr
function paintBack(b,S){ var Wd=R('w0 w1 w2 w3 w4'), x, y;
  // Kredenz unten: zwei Türen, eine Schublade, Messingknöpfe
  box3(b,CR.X0,CR.X1,CR.Y0,94,0,CR.Z1,{top:P.w3,right:P.w0,front:function(x,y,X,Y){ var c=Wd[2]; if (Y>92.5) return P.w0; var mid=(CR.X0+CR.X1)/2, lx=X<mid?X-CR.X0:X-mid;
      if (Y>71.5&&Y<75.5&&lx>2&&lx<19){ c=Wd[3]; if (Y<72.3) c=Wd[4]; if (Y>74.7) c=Wd[1]; if (Math.abs(lx-10.5)<1.2&&Math.abs(Y-73.5)<0.8) c=P.y3; }
      if (Y>77&&Y<91&&lx>2&&lx<19){ c=Wd[1]; if (lx>3.3&&lx<17.7&&Y>78&&Y<90){ c=Wd[3]; if (Y<79||lx<4.3) c=Wd[4]; if (Y>89) c=Wd[2]; } }
      if (Math.abs(X-mid)<0.6&&Y>76) c=Wd[0]; if (Math.abs(Y-76.2)<0.5) c=Wd[1]; if (hash(Math.floor(X*2),Math.floor(Y))<0.06) c=M.DN[c]; return c; }});
  var kn=PW(b,RG.furn,CR.Z1); [[(CR.X0+CR.X1)/2-3,84],[(CR.X0+CR.X1)/2+3,84]].forEach(function(q){ var p=ip3(q[0],q[1],CR.Z1); kn.px(p[0],p[1],P.y3); });
  // Häkeldeckchen auf der Platte
  var dl=PW(b,RG.furn,CR.Z1+0.2), a0=ip3(CR.X0+4,CR.Y0,CR.Z1), a1=ip3(CR.X1-4,CR.Y0,CR.Z1); for (x=a0[0];x<=a1[0];x++){ var dd=(x%4===0)?2:((x%2===0)?1:3); for (y=a0[1];y<a0[1]+dd;y++) dl.px(x,y,((x+y)%3===0)?P.s3:P.s5); dl.px(x,a0[1]-1,(x%2)?P.s5:P.s6); }
  // Aufsatz mit Glastüren: Borde voller Fildžani und Untertassen
  box3(b,CR.UX0,CR.UX1,CR.UY0,CR.UY1,0,CR.UZ1,{right:P.w0,front:function(x,y,X,Y){ var c=Wd[2], mid=(CR.UX0+CR.UX1)/2, lx=X<mid?X-CR.UX0:X-mid, gl=(lx>1.6&&lx<17.4&&Y>46&&Y<67);
      if (Y<45.5) return (Y<44.8)?Wd[4]:Wd[3]; if (gl){ c=P.n0; if (Math.abs(Y-55.5)<0.5) c=Wd[1]; } if (Math.abs(X-mid)<0.55) c=Wd[0]; return c; }});
  var cw=PW(b,RG.glass,CR.UZ1); [48.5,57.5].forEach(function(sy,si){ for (var i=0;i<7;i++){ var X=CR.UX0+3.5+i*5.1; if (Math.abs(X-(CR.UX0+CR.UX1)/2)<2) continue; var p=ip3(X,sy+6,CR.UZ1-2);
      var cc=[P.s6,P.s5,P.s6,P.r3,P.s6,P.b3,P.s6][(i+si*3)%7]; cw.rect(p[0]-1,p[1]-3,3,3,cc); cw.px(p[0]-1,p[1]-2,P.s5); cw.hl(p[0]-1,p[0]+1,p[1]-3,M.DN[cc]); if ((i+si)%3===0) cw.px(p[0],p[1]-2,P.r3);   // Fildžan, Muster
      cw.hl(p[0]-2,p[0]+2,p[1],P.s4); } });
  var pl=ip3(CR.UX0+8,56,CR.UZ1-1); cw.ellipse(pl[0]+0.5,pl[1]-3,3.5,3.5,P.s5); cw.ellipse(pl[0]+0.5,pl[1]-3,2,2,P.b3);   // aufgestellter Teller
  // Spiegelung im Glas
  var gw=PW(b,RG.glass,CR.UZ1+0.1); for (var g=0;g<14;g++){ var gp=ip3(CR.UX0+4+g*2.4,46.5+g*1.3,CR.UZ1); if (gp[1]<ip3(0,66.5,CR.UZ1)[1]) gw.px(gp[0],gp[1],P.n2); }
  // Kalender 1994, aufgeschlagen: Februar
  var kw=PW(b,RG.furn,0.2), cx0=CAL.X0, cy0=CAL.Y0, cw2=CAL.X1-CAL.X0;
  kw.px(cx0+9,cy0-3,P.k1); kw.line(cx0+3,cy0,cx0+9,cy0-3,P.m1); kw.line(cx0+15,cy0,cx0+9,cy0-3,P.m1);
  kw.rect(cx0,cy0,cw2,CAL.Y1-cy0,P.s5); kw.vl(CAL.X1,cy0+1,CAL.Y1,P.c1); kw.hl(cx0+1,CAL.X1,CAL.Y1,P.c1);
  kw.rect(cx0+1,cy0+1,cw2-2,7,P.b3); for (x=cx0+1;x<cx0+cw2-1;x++){ var hh=rnd(3+Math.sin(x*0.9)*1.5+Math.sin(x*0.4)*1.2); for (y=cy0+8-hh;y<cy0+8;y++) kw.px(x,y,y===cy0+8-hh?P.s6:P.c3); } kw.hl(cx0+1,cx0+cw2-2,cy0+7,P.g2);   // Bild: Berge im Schnee
  M.microText(kw,'1994',cx0+2,cy0+9,P.r2); M.microText(kw,'FEB',cx0+4,cy0+15,P.k2);
  for (var rr=0;rr<2;rr++) for (var cc2=0;cc2<7;cc2++){ kw.px(cx0+2+cc2*2,cy0+20+rr,(rr*7+cc2===8)?P.r3:P.s2); }
  kw.hl(cx0,cx0+cw2-1,cy0,P.s6);
  // Herd: Gusseisen, vernickelte Kante und Stange, Backrohr mit Zierleiste, Feuertür, Aschenlade, kurze Beine
  box3(b,SV.X0,SV.X1,SV.Y0,94,SV.Z0,SV.Z1,{top:function(x,y,X,Y,Z){ var d1=Math.hypot((X-200)/4.6,(Z-14)/3.2), d2=Math.hypot((X-211)/3.8,(Z-14)/2.8); if (Math.abs(d1-1)<0.28||Math.abs(d2-1)<0.3) return P.m2; if (d1<0.35||d2<0.3) return P.m0; if (Z>SV.Z1-1.2) return P.m3; return (hash(x,y)<0.15)?P.m0:P.k2; },
    left:function(x,y,X,Y,Z){ if (Y>92.6) return (Z>SV.Z1-2.5)?P.k1:P.k0; if (Y<82) return P.m3; return (hash(x,y)<0.1)?P.t1:((Z>SV.Z1-1.2)?P.m1:P.k2); },
    front:function(x,y,X,Y){ var c=P.m0, oX=X-SV.X0;
      if (Y<81.7) return P.m4; if (Y<82.5) return (oX<1.5||oX>SV.X1-SV.X0-1.5)?P.m2:P.k2; if (Y<83.3) return P.m4;                                   // Kante, Spalt, Stange
      if (Y>92.6) return (oX<3||oX>SV.X1-SV.X0-3)?P.k1:P.k0;                                                                                      // Beine
      if (oX>1.5&&oX<20&&Y>84&&Y<92){ c=P.k2; if (oX>2.6&&oX<19&&Y>84.8&&Y<91.2){ c=(Y<85.6)?P.m2:P.m1; if (Math.abs(Y-88)<0.5&&oX>5&&oX<16) c=P.m3; } if (Math.abs(Y-85.2)<0.5&&oX>5&&oX<16) c=P.s6; }   // Backrohr
      if (oX>22&&oX<33&&Y>84&&Y<88){ c=P.k1; if (oX>23&&oX<32&&Y>84.6&&Y<87.4) c=((Math.floor(X*1.5))%2)?P.k2:P.m0; if (Math.abs(oX-27.5)<1.2&&Math.abs(Y-86)<0.6) c=P.m4; }   // Feuertür mit Luftschlitzen
      if (oX>22&&oX<33&&Y>89&&Y<92){ c=P.k1; if (Math.abs(Y-90.4)<0.5&&Math.abs(oX-27.5)<2.6) c=P.m3; }                                               // Aschenlade
      if (oX>34.5&&Y>84&&Y<92){ c=((Math.floor(Y*1.2)+Math.floor(X*1.2))%3===0)?P.m1:P.m0; }                                                      // Zierplatte rechts
      if (hash(Math.floor(X*1.3),Math.floor(Y*2))<0.05) c=P.t1; return c; }});
  // Wärmefach oben seitlich: kleiner Blechkasten, verrostet; die Klappe vorn
  box3(b,WB.X0,WB.X1,WB.Y0,SV.Y0,WB.Z0,WB.Z1,{top:P.m1,left:function(x,y){ return (hash(x,y)<0.4)?P.t1:P.m0; },front:function(x,y,X,Y){ var c=tex.rust(x*2,y*2,R('t0 t1 t2 m0 m1')); if (Y<WB.Y0+0.8) c=P.m2; if (X<WB.X0+0.8) c=P.m1; return c; }},RG.stove);
  var ow=PW(b,RG.stove,WB.Z1+0.1), f0=ip3(FL.X0,FL.Y0,WB.Z1), f1=ip3(FL.X1,FL.Y1,WB.Z1);
  if (!S.compOpen){ ow.rect(f0[0],f0[1],f1[0]-f0[0],f1[1]-f0[1],P.t1); ow.hl(f0[0],f1[0]-1,f0[1],P.t2); ow.hl(f0[0],f1[0]-1,f1[1]-1,P.k1); ow.vl(f1[0]-1,f0[1],f1[1]-1,P.k2); ow.vl(f0[0],f0[1],f1[1]-1,P.t2);
    for (var r1=0;r1<8;r1++){ var rx=f0[0]+1+rnd(hash(r1,5)*(f1[0]-f0[0]-2)), ry=f0[1]+1+rnd(hash(r1,6)*(f1[1]-f0[1]-2)); ow.px(rx,ry,hash(r1,7)<0.5?P.t2:P.t0); }
    ow.rect(rnd((f0[0]+f1[0])/2)-1,f0[1]+2,3,2,P.m3); ow.px(rnd((f0[0]+f1[0])/2),f0[1]+2,P.m4); }
  else { ow.rect(f0[0],f0[1],f1[0]-f0[0],f1[1]-f0[1],P.k0); ow.hl(f0[0],f1[0]-1,f0[1],P.k1);                          // offen: dunkler Kasten
    if (!S.msgTaken){ var mp=[rnd((f0[0]+f1[0])/2),f1[1]-2]; ow.rect(mp[0]-3,mp[1]-2,7,2,P.e4); ow.hl(mp[0]-3,mp[0]+3,mp[1]-2,P.s5); ow.px(mp[0]+3,mp[1]-1,P.e3); ow.px(mp[0]-1,mp[1]-1,P.r2); }   // das gefaltete Formular
    var hy=f1[1]; ow.rect(f0[0],hy,f1[0]-f0[0],3,P.t1); ow.hl(f0[0],f1[0]-1,hy+2,P.t0); ow.hl(f0[0],f1[0]-1,hy,P.t2); }                     // Klappe hängt nach unten
  // Ofenrohr: senkrecht hoch, Knie, in die Wand mit Rosette
  var pw=PW(b,RG.stove,PIPE.Z), pb=ip3(PIPE.X,SV.Y0,PIPE.Z), pt=ip3(PIPE.X,PIPE.Y1,PIPE.Z);
  for (y=pt[1];y<pb[1];y++){ pw.px(pb[0]-3,y,P.m3); pw.px(pb[0]-2,y,P.m2); pw.px(pb[0]-1,y,P.m1); pw.px(pb[0],y,P.m0); pw.px(pb[0]+1,y,P.k2); if ((y-pt[1])%11===0){ pw.hl(pb[0]-3,pb[0]+1,y,P.m4); pw.hl(pb[0]-3,pb[0]+1,y+1,P.m1); } }
  var rp=ip3(PIPE.X,PIPE.Y1-3,0); pw.rect(pt[0]-3,pt[1]-4,5,4,P.m1); pw.hl(pt[0]-3,pt[0]+1,pt[1]-4,P.m3); pw.ellipse(rp[0]+0.5,rp[1]+0.5,4,3,P.m2); pw.ellipse(rp[0]+0.5,rp[1]+0.5,2.4,1.8,P.k1);
  pw.px(pb[0]-1,pt[1]+15,P.t1); pw.px(pb[0],pt[1]+16,P.t2);
  // ein alter Emaille-Wasserkessel auf der Platte, seit damals nicht bewegt
  var kq=ip3(203,SV.Y0,12), kw2=PW(b,RG.furn,12); kw2.ellipse(kq[0]+0.5,kq[1]-3,5,3.4,function(xx,yy){ return (xx<kq[0]-1)?P.s5:((xx<kq[0]+3)?P.s4:P.s3); }); kw2.hl(kq[0]-4,kq[0]+4,kq[1]-1,P.r2); kw2.hl(kq[0]-3,kq[0]+3,kq[1],P.k1);
  kw2.rect(kq[0]-1,kq[1]-8,3,2,P.s4); kw2.px(kq[0],kq[1]-9,P.k2); kw2.line(kq[0]+4,kq[1]-4,kq[0]+8,kq[1]-7,P.s4); kw2.line(kq[0]-4,kq[1]-6,kq[0]-1,kq[1]-10,P.k2); kw2.line(kq[0]+3,kq[1]-6,kq[0],kq[1]-10,P.k2); kw2.px(kq[0]-2,kq[1]-4,P.s6);
  // Schürhaken und ein Kohleneimer neben dem Herd
  var hw=PW(b,RG.furn,SV.Z1+2), hk=ip3(SV.X0-2,94,SV.Z1+2); hw.line(hk[0],hk[1],hk[0]+3,hk[1]-20,P.m1); hw.px(hk[0]+3,hk[1]-21,P.m3);
  box3(b,SV.X0-12,SV.X0-4,86,94,14,22,{top:P.k1,front:function(x,y,X,Y){ return (Y<87)?P.m3:(X<SV.X0-10?P.m2:P.m1); },left:P.m0});
  var co=PW(b,RG.furn,18); var cq=ip3(SV.X0-8,86,18); co.px(cq[0]-1,cq[1],P.k2); co.px(cq[0]+1,cq[1],P.k1); co.px(cq[0],cq[1]-1,P.m0); }

// ---------------------------------------------------------------- Raum: Tür, Foto, Sofa, Tisch, Stühle, Nähtischchen
var SH=R('s3 s4 s5 s6');
function sheetC(x,y,v,sd){ var n=fbm(x*1.3,y*0.7,6,sd), c=ra(SH,0.35+n*0.6+v,x,y); if (fbm(x*0.6,y*1.8,4,sd+2)>0.72) c=M.DN[c]; return c; }
function kilim(X,Z,sd){ var u=Math.floor(X*0.8+sd), v=Math.floor(Z*0.55), d=(Math.abs((u%10)-5)+Math.abs((v%6)-3)), C=[P.r2,P.r3,P.c1,P.y2,P.r2,P.e3];
  if (d<2) return P.y3; if (d===3) return P.c1; if (d===5) return P.s4; return C[(Math.floor(u/10)+Math.floor(v/6))%C.length]===P.y2?P.r2:((d<5)?P.r3:P.r2); }
function paintRoomProps(b,S){ var x, y;
  // Tür in der linken Wand: alte Brettertür mit Rahmen, Klinke
  var zfL=function(x){ return ((x+0.5-VP[0])/(64-VP[0])-1)*F; }, dw=PW(b,RG.furn,zfL);
  dw.poly(wq('L',DOOR.u0-2,DOOR.u1+2,DOOR.v0-3,DOOR.v1),P.w1);
  var dq=wq('L',DOOR.u0,DOOR.u1,DOOR.v0,DOOR.v1);
  dw.poly(dq,function(x,y){ var t=(x-dq[0][0])/(dq[1][0]-dq[0][0]), top=dq[0][1]+(dq[1][1]-dq[0][1])*t, bot=dq[3][1]+(dq[2][1]-dq[3][1])*t, v=(y-top)/(bot-top), c=P.w2;
    var pl=Math.floor(t*5); if ((t*5-pl)<0.12) c=P.w1; if (t<0.06||t>0.94) c=P.w3; if (Math.abs(v-0.18)<0.025||Math.abs(v-0.8)<0.025) c=P.w1; if (hash(x,y>>1)<0.06) c=P.w3; return c; });
  var kp=M.wallPt(SPEC,'L',DOOR.u0+3,76); dw.rect(rnd(kp[0])-1,rnd(kp[1]),3,2,P.m3); dw.px(rnd(kp[0])-1,rnd(kp[1])+3,P.k1);
  // Haken neben der Tür mit einer Schürze
  var hk=M.wallPt(SPEC,'L',DOOR.u0-7,58), hx=rnd(hk[0]), hy=rnd(hk[1]), cw=PW(b,RG.furn,DOOR.u0-6); cw.rect(hx-1,hy-1,3,2,P.m2);
  cw.poly([[hx-1,hy],[hx+2,hy],[hx+4,hy+16],[hx-3,hy+16]],function(xx,yy){ return (((xx>>1)+((yy-hy)>>1))%2===0)?P.b2:P.s5; }); cw.hl(hx-3,hx+4,hy+16,P.s4);
  // Hochzeitsfoto über dem Sofa (rechte Wand): Mann mit Schnurrbart, Frau im Weißen, Sepia
  var zfR=function(x){ return ((x+0.5-VP[0])/(256-VP[0])-1)*F; }, fw=PW(b,RG.furn,zfR), fq=wq('R',PHOTO.u0,PHOTO.u1,PHOTO.v0,PHOTO.v1), iq=wq('R',PHOTO.u0+1.4,PHOTO.u1-1.4,PHOTO.v0+1.6,PHOTO.v1-1.6);
  fw.poly(fq,function(xx,yy){ return (hash(xx,yy)<0.2)?P.y1:P.w2; });
  fw.poly(iq,function(xx,yy){ var t=(xx-iq[0][0])/(iq[1][0]-iq[0][0]), top=iq[0][1]+(iq[1][1]-iq[0][1])*t, bot=iq[3][1]+(iq[2][1]-iq[3][1])*t, v=(yy-top)/(bot-top), c=(v<0.6)?P.e3:P.e2;
    if (t>0.18&&t<0.48){ if (v>0.18&&v<0.38) c=P.e4; if (v>0.3&&v<0.34&&t>0.25&&t<0.42) c=P.e1; if (v>=0.38) c=P.e1; if (v<0.18&&v>0.1) c=P.e0; }                     // er: Gesicht, Schnurrbart, dunkler Anzug
    if (t>0.55&&t<0.86){ if (v>0.22&&v<0.4) c=P.e4; if (v>=0.4) c=P.s5; if (v<0.24&&v>0.12) c=P.s4; }                                                      // sie: Schleier, weißes Kleid
    return c; });
  var nail=M.wallPt(SPEC,'R',(PHOTO.u0+PHOTO.u1)/2,PHOTO.v0-5); fw.line(rnd(fq[0][0])+1,rnd(fq[0][1]),rnd(nail[0]),rnd(nail[1]),P.k2); fw.line(rnd(fq[1][0])-1,rnd(fq[1][1]),rnd(nail[0]),rnd(nail[1]),P.k2);
  // Sofa (sećija) an der rechten Wand: eine niedrige Bank mit Kelim und zwei Kissen an der Wand, oder alles unter einem weißen Tuch
  if (S.sheetsOff){
    box3(b,SO.X0,SO.X1,SO.YS,94,SO.Z0,SO.Z1,{top:function(x,y,X,Y,Z){ return kilim(X,Z,0); },left:function(x,y,X,Y,Z){ if (Y>92.6) return P.w0; if (Y>91) return ((Math.floor(Z*1.3))%2)?P.r1:P.y2; return M.DN[kilim(SO.X0+(Y-SO.YS)*2.2,Z,0)]; },front:function(x,y,X,Y){ return (Y>92.6)?P.w0:M.DN[M.DN[kilim(X,SO.Z1,1)]]; }});
    [[SO.Z0+3,SO.Z0+21],[SO.Z0+24,SO.Z1-3]].forEach(function(cz,ci){ box3(b,SO.X1-8,SO.X1,SO.YB,SO.YS,cz[0],cz[1],{left:function(x,y,X,Y,Z){ var u=(Z-cz[0])/(cz[1]-cz[0]), v=(Y-SO.YB)/(SO.YS-SO.YB), c=ci?P.c2:P.r2; if (Math.abs(u-0.5)<0.18&&Math.abs(v-0.5)<0.22) c=P.y3; else if ((Math.floor(u*8)+Math.floor(v*6))%2===0) c=ci?P.c3:P.r3; if (u<0.06||u>0.94||v<0.08) c=M.DN[c]; return c; },top:ci?P.c3:P.r3}); }); }
  else { // Tuch: weich, faltig, bis auf den Boden, die Kissen zeichnen sich darunter ab
    var top0=SO.YS-1; box3(b,SO.X0-1,SO.X1,top0,94,SO.Z0-1,SO.Z1+1,{left:function(x,y,X,Y,Z){ var v=-0.1-((Y-top0)/(94-top0))*0.12+Math.sin(Z*0.55+Y*0.3)*0.08; if (Y>93.2) return P.s2; return sheetC(x,y,v,4); },
      front:function(x,y,X,Y){ return sheetC(x,y,-0.25+Math.sin(X*0.7)*0.06,6); },top:function(x,y,X,Y,Z){ return sheetC(x,y,0.12+Math.sin(Z*0.35)*0.06,8); }},RG.sheet);
    [[SO.Z0+3,SO.Z0+21],[SO.Z0+24,SO.Z1-3]].forEach(function(cz,ci){ box3(b,SO.X1-8,SO.X1,SO.YB-1,top0,cz[0],cz[1],{left:function(x,y,X,Y,Z){ var u=(Z-cz[0])/(cz[1]-cz[0]); return sheetC(x,y,0.08-Math.abs(u-0.5)*0.3,9+ci); },top:function(x,y){ return sheetC(x,y,0.15,11); }},RG.sheet); }); }
  // Nähtischchen links an der Wand: unter einem Tuch, oder eine alte schwarze Nähmaschine
  if (S.sheetsOff){ [[NT.X0+1,NT.Z0+1],[NT.X1-3,NT.Z0+1],[NT.X0+1,NT.Z1-3],[NT.X1-3,NT.Z1-3]].forEach(function(l){ box3(b,l[0],l[0]+2,NT.Y0,94,l[1],l[1]+2,{front:P.w2,right:P.w1,left:P.w1}); });
    box3(b,NT.X0,NT.X1,NT.Y0,NT.Y0+2,NT.Z0,NT.Z1,{top:P.w3,front:P.w2,right:P.w1});
    box3(b,NT.X0+4,NT.X1-4,NT.Y0-8,NT.Y0,NT.Z0+4,NT.Z0+9,{front:function(x,y,X,Y){ return (Y<NT.Y0-6.5)?P.m2:((X>NT.X1-8&&Y>NT.Y0-5)?P.k2:P.k1); },top:P.m1,right:P.k2});
    var sm=PW(b,RG.furn,NT.Z0+9), sp=ip3(NT.X0+9,NT.Y0-7,NT.Z0+9); sm.px(sp[0],sp[1],P.y3); sm.px(sp[0]+1,sp[1],P.y2); }
  else box3(b,NT.X0-1,NT.X1+1,NT.Y0-9,94,NT.Z0-1,NT.Z1+1,{top:function(x,y){ return sheetC(x,y,0.15,14); },front:function(x,y,X,Y){ return sheetC(x,y,-0.15+(Math.abs(Math.sin(X*0.9))>0.8?-0.1:0),15); },right:function(x,y){ return sheetC(x,y,-0.3,16); }},RG.sheet);
  // Flickenteppich unter dem Tisch
  var rw0=PW(b,RG.floor,function(x,y){ var f=R3.floor(x+0.5,y+0.5); return f?f.Z:60; });
  rw0.poly([p3(110,94,40),p3(178,94,40),p3(178,94,74),p3(110,94,74)],function(x,y){ var f=R3.floor(x+0.5,y+0.5); if (!f) return undefined; var st=Math.floor((f.Z-40)/2.6), RC=[P.c2,P.e2,P.r2,P.e3,P.c3,P.e1,P.r1,P.s3];
    var c=RC[(st*3+1)%RC.length]; if (hash(Math.floor(f.X/2.5),st)<0.22) c=RC[(st*5+2)%RC.length]; if (f.X<111.5||f.X>176.5) c=P.e1; return c; });
  // Stühle: einfache Holzstühle mit Lehne
  chair(b,CA,'L'); chair(b,CB,'R');
  // Tisch mit Häkeldecke
  [[TB.X0+2,TB.Z0+2],[TB.X1-4,TB.Z0+2],[TB.X0+2,TB.Z1-4],[TB.X1-4,TB.Z1-4]].forEach(function(l){ box3(b,l[0],l[0]+2,TB.Y0,94,l[1],l[1]+2,{front:P.w2,left:P.w1,right:P.w1},RG.table); });
  box3(b,TB.X0,TB.X1,TB.Y0+2,TB.Y0+4,TB.Z0,TB.Z1,{front:P.w1,left:P.w0,right:P.w0},RG.table);
  function lace(X,Z){ var u=Math.floor(X*1.1), v=Math.floor(Z*0.9), c=P.s5; if ((u%4===0)!==(v%4===0)) c=P.s6; if (u%4===2&&v%4===2) c=P.s3; if (Math.abs(X-(TB.X0+TB.X1)/2)<6&&Math.abs(Z-(TB.Z0+TB.Z1)/2)<3.5){ var d=Math.hypot((X-(TB.X0+TB.X1)/2)/6,(Z-(TB.Z0+TB.Z1)/2)/3.5); if (Math.abs(d-0.7)<0.12) c=P.s3; } return c; }
  box3(b,TB.X0-1,TB.X1+1,TB.Y0,TB.Y0+1.2,TB.Z0-1,TB.Z1+1,{top:function(x,y,X,Y,Z){ return lace(X,Z); },front:function(x,y,X){ return ((Math.floor(X)%3)===0)?P.s4:P.s5; },left:P.s4,right:P.s4},RG.table);
  var fe=PW(b,RG.table,TB.Z1+1.5), e0=ip3(TB.X0-1,TB.Y0+1.2,TB.Z1+1), e1=ip3(TB.X1+1,TB.Y0+1.2,TB.Z1+1); for (x=e0[0];x<=e1[0];x++){ var dd=((x-e0[0])%4<2)?3:2; for (y=e0[1];y<e0[1]+dd;y++) fe.px(x,y,(y===e0[1]+dd-1)?P.s4:(((x+y)%2)?P.s6:P.s5)); }
  // auf dem Tisch: eine Zuckerdose mit Deckel, eine umgedrehte Tasse
  var tw=PW(b,RG.table,56), sq=ip3(136,TB.Y0,54); tw.rect(sq[0]-2,sq[1]-4,5,4,P.s5); tw.hl(sq[0]-2,sq[0]+2,sq[1]-4,P.s6); tw.px(sq[0],sq[1]-5,P.s4); tw.hl(sq[0]-2,sq[0]+2,sq[1]-2,P.b2);
  var cq2=ip3(148,TB.Y0,58); tw.rect(cq2[0]-1,cq2[1]-3,3,3,P.s6); tw.hl(cq2[0]-2,cq2[0]+2,cq2[1],P.s4); tw.px(cq2[0],cq2[1]-2,P.r3); }
function chair(b,C,back){ var Wc=R('w1 w2 w3 w4');
  [[C.X0,C.Z0],[C.X1-1.4,C.Z0],[C.X0,C.Z1-1.4],[C.X1-1.4,C.Z1-1.4]].forEach(function(l){ var bk=(back==='L'?l[0]===C.X0:l[0]!==C.X0), top=bk?C.YB:C.YS; box3(b,l[0],l[0]+1.4,top,94,l[1],l[1]+1.4,{front:Wc[1],left:Wc[0],right:Wc[0],top:Wc[3]}); });
  box3(b,C.X0,C.X1,C.YS-1.4,C.YS,C.Z0,C.Z1,{top:Wc[2],front:Wc[1],left:Wc[0],right:Wc[0]});
  var bx=back==='L'?C.X0:C.X1-1.4; box3(b,bx,bx+1.4,C.YB,C.YB+3,C.Z0,C.Z1,{front:Wc[2],left:Wc[1],right:Wc[1],top:Wc[3]});
  box3(b,bx,bx+1.4,C.YB+6,C.YB+7.4,C.Z0,C.Z1,{front:Wc[1],left:Wc[0],right:Wc[0]}); }

// ---------------------------------------------------------------- Licht: kaltes Tageslicht durch die Spitze
function laceLit(X,Y){ var u=Math.floor((X-WN.X0)*1.0), v=Math.floor((Y-WN.Y0)*1.0); if ((u+v)%4===0||(u-v+64)%4===0) return 0.45; if (Math.hypot((u%10)-5,((v-10)%8)-4)<2.2) return 0.3; return 0.9; }
function paintLight(b,tod){ var day=tod==='day';
  M.light(b,function(x,y){ var k=y*W+x, r=REG[k]; if (r===RG.view||r===RG.none) return 0; var Z=DEPTH[k], q=unp(x,y,Z), X=q[0], Y=q[1];
    var v=day?-1.15:-1.7;                                                                                        // gedämpftes Zimmer
    var dx=(X-LX)/80, dz=Z/85, dy=(Y-64)/60, g=Math.max(0,1-dx*dx-dz*dz*0.8-dy*dy*0.4); v+=g*(day?1.0:0.3);      // weiches Fensterlicht
    if (r===RG.wall && Z<0.5){ var wd=Math.max(0,Math.max(WN.X0-X,X-WN.X1,0)/14)+Math.max(0,Math.max(WN.Y0-Y,Y-WN.Y1,0)/10); if (wd<1) v+=0.45*(1-wd); }   // heller Schein um das Fenster
    if (r===RG.ceil) v-=0.05;
    var cx=(x-160)/190, cy=(y-74)/100; v-=Math.max(0,cx*cx+cy*cy-0.32)*0.9;
    // Lichtfleck der Spitze auf Boden und Tisch: vom Fenster schräg nach vorn
    if (day && (r===RG.floor||r===RG.table||r===RG.sheet||r===RG.furn)){ var Xs=X+(Z-30)*0.05, Ys=Y-Z*0.24; if (Xs>WN.X0+2&&Xs<WN.X1-2&&Ys>WN.Y0+10&&Ys<WN.Y1){ v+=2.5*laceLit(Xs,Ys); } else if (Xs>WN.X0+2&&Xs<WN.X1-2&&Ys>WN.Y0+2&&Ys<WN.Y1) v+=2.6; }
    return v; },0,0); }

// ---------------------------------------------------------------- Bild
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0); REG.fill(0); DEPTH.fill(0);
  paintRoom(b); paintWindow(b,tod); paintBack(b,S); paintRoomProps(b,S);
  paintLight(b,tod);
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.view; } }); return LAST; }
// Tisch als Ebene: wer dahinter steht, verschwindet bis zur Hüfte
function layers(S,GS,tod){ if (!LAST) return []; var r=R3.rect(TB.X0-2,TB.X1+2,TB.Y0,94,TB.Z0-2,TB.Z1+2), base=Math.round(p3(TB.X0,94,TB.Z1)[1]), l=M.layer(r[0],r[1],r[2]+1,r[3]+1,base);
  for (var y=r[1];y<=r[1]+r[3];y++) for (var x=r[0];x<=r[0]+r[2];x++){ if (x<0||y<0||x>=W||y>=H) continue; if (REG[y*W+x]===RG.table) l.px(x-r[0],y-r[1],LAST.d[y*W+x]); }
  return [l]; }

// ---------------------------------------------------------------- jedes Bild: Staub im Licht
var MOTES=[]; (function(){ for (var i=0;i<30;i++) MOTES.push([WN.X0+4+hash(i,1)*(WN.X1-WN.X0-8),WN.Y0+10+hash(i,2)*(WN.Y1-WN.Y0-12),6+hash(i,3)*90,hash(i,4)*6.28]); })();
function dynamic(fb,v,S,GS){ var t=v.t; if (v.tod!=='day') return;
  MOTES.forEach(function(m,i){ var Z=m[2]+Math.sin(t*0.11+m[3])*4, X0=m[0]+Math.sin(t*0.19+i)*2.5, Y0=m[1]+Math.cos(t*0.15+i*1.3)*2+(((t*0.4+i*7)%10)-5);
    var X=X0-(Z-30)*0.05, Y=Y0+Z*0.24; if (Y>93) return; var q=p3(X,Y,Z), sx=rnd(q[0]), sy=rnd(q[1]); if (sx<0||sy<0||sx>=W||sy>=H) return;
    if (Math.sin(t*1.9+i*1.7)>-0.2) fb.px(sx,sy,Math.sin(t*1.3+i)>0.4?P.s6:P.s5); }); }
// Geistersicht: warmes Glimmen am Herd (solange das Formular im Wärmefach liegt); am Tisch blass die Großmutter mit Kopftuch
var GRAN=[ // sitzend, Blick nach rechts zum Tisch: Kopftuch (S), Gesicht (f), Strickjacke (i), Hände auf dem Tisch (h)
 '......oooo..............',
 '.....oSSSSo.............',
 '....oSSSSSSo............',
 '....oSSSSffo............',
 '....oSSSfffo............',
 '....oSSSffo.............',
 '.....oSSSo..............',
 '....oSSSSSo.............',
 '...oiiiiiiioo...........',
 '...oiiiiiiiiio..........',
 '..oiiiiiiiiiiioo........',
 '..oiiiiiiiiiiiiiooo.....',
 '..oiiiiiiioooiiiiiihho..',
 '..oiiiiiiio..ooooooooo..',
 '..oiiiiiiio.............',
 '..oiiiiiiio.............',
 '..oiiiiiiio.............',
 '..oiiiiiiio.............',
 '..oiiiiiiiio............',
 '..oiiiiiiiiiiiioo.......',
 '..oiiiiiiiiiiiiio.......',
 '...ooooooooooiiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '.............oiio.......',
 '............oooooo......'];
function ghost(fb,v,S,GS){ var t=v.t, bg=LAST, G=M.TINT.ghost;
  function free(x,y){ if (!bg) return true; return fb.get(x,y)===M.tintPx(G,bg.get(x,y),x,y); }
  if (!S.msgTaken){ var c=p3((FL.X0+FL.X1)/2,(FL.Y0+FL.Y1)/2,WB.Z1), a=0.55+0.45*Math.sin(t*1.7), rr=9+a*3;
    for (var y=rnd(c[1]-rr);y<=c[1]+rr;y++) for (var x=rnd(c[0]-rr);x<=c[0]+rr;x++){ var d=Math.hypot(x-c[0],(y-c[1])*1.2)/rr; if (d>1||!free(x,y)) continue; if (bayer(x,y)<(1-d)*(0.35+a*0.35)) fb.px(x,y,d<0.35?P.x6:(d<0.7?P.x5:P.x3)); }
    for (var i=0;i<5;i++){ var mx=rnd(c[0]+Math.sin(t*0.9+i*2)*4), my=rnd(c[1]-((t*5+i*6)%22)); if (free(mx,my)) fb.px(mx,my,i%2?P.x5:P.x6); } }
  if (GS.flags && GS.flags['k2.f2.echoOven']){ var seat=p3(CA.X0,CA.YS,(CA.Z0+CA.Z1)/2), x0=rnd(seat[0])-2, y0=rnd(seat[1])-21, al=0.5+0.2*Math.sin(t*0.8);
    for (var j=0;j<GRAN.length;j++) for (var q=0;q<GRAN[j].length;q++){ var ch=GRAN[j][q]; if (ch==='.') continue; var X=x0+q, Y=y0+j; if (X<0||Y<0||X>=W||Y>=H) continue;
      if (ch==='o'){ if (bayer(X,Y)<0.6+al*0.4) fb.px(X,Y,j<8?P.x5:P.x4); } else if (ch==='f'||ch==='h'){ fb.px(X,Y,P.x5); } else if (ch==='S'){ if (bayer(X,Y)<0.45+al*0.2) fb.px(X,Y,P.x4); } else if (bayer(X+1,Y)<0.3+al*0.15) fb.px(X,Y,P.x3); } } }

// ---------------------------------------------------------------- Raum
function rr(X0,X1,Y0,Y1,Z0,Z1){ return R3.rect(X0,X1,Y0,Y1,Z0,Z1); }
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<34||Z>132) return false; if (X<76||X>246) return false;
  if (X>TB.X0-6&&X<TB.X1+5&&Z>TB.Z0-5&&Z<TB.Z1+6) return false;            // Tisch
  if (X>CA.X0-3&&X<CA.X1&&Z>CA.Z0-3&&Z<CA.Z1+4) return false;              // Stuhl links
  if (X>CB.X0&&X<CB.X1+3&&Z>CB.Z0-3&&Z<CB.Z1+4) return false;              // Stuhl rechts
  if (X>SO.X0-5&&Z>SO.Z0-6&&Z<SO.Z1+6) return false;                          // Sofa
  if (X<NT.X1+5&&Z<NT.Z1+5) return false;                                    // Nähtischchen
  return true; };
var spots={ door:(function(){ var q=wq('L',DOOR.u0-2,DOOR.u1+2,DOOR.v0-3,DOOR.v1); return [rnd(q[1][0]),rnd(q[1][1]),rnd(q[0][0]-q[1][0])+1,rnd(q[2][1]-q[1][1])]; })(),
  stove:rr(SV.X0,SV.X1,SV.Y0,94,SV.Z0,SV.Z1), compartment:(function(){ var a=ip3(FL.X0,FL.Y0,WB.Z1), c=ip3(FL.X1,FL.Y1,WB.Z1); return [a[0]-2,a[1]-2,c[0]-a[0]+4,c[1]-a[1]+6]; })(),
  pipe:(function(){ var a=ip3(PIPE.X,PIPE.Y1-6,0), c=ip3(PIPE.X,SV.Y0,PIPE.Z); return [a[0]-4,a[1],8,c[1]-a[1]]; })(),
  table:rr(TB.X0,TB.X1,TB.Y0,94,TB.Z0,TB.Z1), chairs:rr(CA.X0,CB.X1,CA.YB,94,CB.Z0,CA.Z1),
  cupboard:rr(CR.X0,CR.X1,CR.UY0-1,94,0,CR.Z1), cups:rr(CR.UX0+1,CR.UX1-1,CR.UY0+2,CR.UY1-1,0,CR.UZ1),
  window:[WN.X0-3,WN.Y0-2,WN.X1-WN.X0+6,WN.Y1-WN.Y0+5], calendar:[CAL.X0-1,CAL.Y0-4,CAL.X1-CAL.X0+3,CAL.Y1-CAL.Y0+5],
  sofa:rr(SO.X0,SO.X1,SO.YB-2,94,SO.Z0,SO.Z1), photo:(function(){ var q=wq('R',PHOTO.u0,PHOTO.u1,PHOTO.v0-5,PHOTO.v1); return [rnd(q[0][0])-1,rnd(q[0][1])-1,rnd(q[1][0]-q[0][0])+3,rnd(q[2][1]-q[0][1])+3]; })(),
  sheets:rr(SO.X0,SO.X1,SO.YB,94,SO.Z0+2,SO.Z1-2) };
M.defineArt('kuca',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, ghost:ghost, walk:WALK, walkG:function(){ return false; },
  spots:spots,
  stands:{ door:R3.st(84,48,'L'), stove:R3.st(208,36,'B'), compartment:R3.st(220,36,'B'), pipe:R3.st(200,36,'B'), table:R3.st(140,74,'B'), chairs:R3.st(104,72,'B'),
    cupboard:R3.st(92,36,'B'), cups:R3.st(90,36,'B'), window:R3.st(140,38,'B'), calendar:R3.st(176,38,'B'), sofa:R3.st(212,66,'R'), photo:R3.st(214,62,'R'), sheets:R3.st(212,70,'R') },
  actorPos:{}, start:R3.st(86,50,'R'), entries:{ vratnik:R3.st(86,50,'R') }
});
})(M);
