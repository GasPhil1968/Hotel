/* ===== rooms/art/gleis11.js — Hauptbahnhof München, Gleis 11 (560 px, scrollend) =====
   Blick vom Querbahnsteig in die hohe Gleishalle des Kopfbahnhofs: ein flacher Stahlbogen-Dachstuhl mit Glasfeldern
   (Schnee darauf), Fachwerkbinder in regelmäßigen Abständen, die alle zum Hallenende laufen. Dort, hinter der Glasschürze,
   liegt das Freie: Gleisfeld, Oberleitungsmasten, weit hinten die Bögen der Hackerbrücke; je nach Wetter klarer Winterhimmel,
   grauer Matsch, Schneefall oder Nebel, in dem alles verschwindet.
   Links der Kopfbau (Südflügel) als hohe Innenfassade: der Ausgang zur Stadt, Schließfächer, die Tür mit dem Schild
   „BAHNHOFSMISSION“ (nur Schrift) und ihr Fenster zum Bahnsteig, oben Fenster und die Bahnhofsuhr. Seine Seitenwand ist die
   Hallenwand mit hohen Bogenfenstern. Davor Bahnsteig 11 mit dem großen Gleisschild „11“; auf Gleis 11 steht ein roter
   Doppelstock-Regionalzug mit der Nase am Prellbock, auf Gleis 13 weiter hinten ein weißer ICE. Auf dem Querbahnsteig
   der Kiosk „PRESSE“, darüber die große Abfahrtstafel, eine Bank, der Weihnachtsbaum (S.tree, Tag 1 und 2), gemalte
   Reisende, Tauben. Im Boden vor dem Bahnsteigende die eiserne Luke mit Gitter (hatch).
   Geistersicht: am Bahnsteigende ein Strom alter Koffer-Umrisse, über der Luke ein Schimmer nach unten. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=560, H=144;
// ---------------------------------------------------------------- Geometrie (Rückebene Z=0 am Hallenende; k=1+Z/F)
var VP=[300,56], F=40, FL=64, R3=M.room3(VP,F,FL);
var KF=6.25, FRONTY=106, ZF=(KF-1)*F;                    // Vorderkante der Gleisfelder (Prellböcke)
var XL=276, XR=430, YE=40, YA=22, XM=(XL+XR)/2;         // Hallenwände, Traufe, First
var YOPEN=45;                                           // unter der Glasschürze offen
var PLAT=[[276,284],[295,308],[319,332],[343,356],[367,380],[391,404],[415,430]];
var TRK=[[284,295],[308,319],[332,343],[356,367],[380,391],[404,415]];
var FAC={x1:150};                                       // Kopfbau links (Fassade bis x1)
var MIS={x0:96,x1:124,top:66};                          // Tür der Bahnhofsmission
var KIO={x0:362,x1:410,top:48,sill:90,base:110};        // Kiosk „PRESSE“
var KIOSKG_Y=108;
var TREE={cx:510,base:110,h:84};
var BENCH={x0:312,x1:350,seat:104,base:113};
var BOARD={x0:410,x1:504,y0:8,y1:54};
var SIGN11={x0:166,x1:198,y0:40,y1:60};
var HATCH={x0:158,x1:190,y0:117,y1:125};
var CLK={cx:62,cy:46,r:7};
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function pk(X,Y,Z){ var k=1+Z/F; return [VP[0]+(X-VP[0])*k, VP[1]+(Y-VP[1])*k]; }
function yroof(X){ var u=(X-XM)/((XR-XL)/2); return YA+(YE-YA)*u*u; }
function wea(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun')?w:'snowlie'; }
function mt(b,s,x,y,c){ var cx=x; for (var i=0;i<s.length;i++){ var ch=s[i], base={'Ä':'A','Ö':'O','Ü':'U'}[ch]||ch; M.microText(b,base,cx,y,c); if (base!==ch){ b.px(cx,y-2,c); b.px(cx+2,y-2,c); } cx+=M.microWidth(base)+1; } }
function mw(s){ return M.microWidth(s.replace(/Ä/g,'A').replace(/Ö/g,'O').replace(/Ü/g,'U')); }
// große Ziffern für Gleisschilder (5×9)
var BIG={'1':['..#..','.##..','#.#..','..#..','..#..','..#..','..#..','..#..','#####'],'2':['.###.','#...#','....#','...#.','..#..','.#...','#....','#....','#####'],'3':['####.','....#','....#','..##.','....#','....#','....#','#...#','.###.'],'4':['...#.','..##.','.#.#.','#..#.','#####','...#.','...#.','...#.','...#.']};
function bigNum(b,s,x,y,c,sc){ sc=sc||1; for (var i=0;i<s.length;i++){ var g=BIG[s[i]]; for (var r=0;r<9;r++) for (var q=0;q<5;q++) if (g[r][q]==='#') b.rect(x+i*(6*sc)+q*sc,y+r*sc,sc,sc,c); } }

// ---------------------------------------------------------------- Masken / Tiefe
var KB=new Float32Array(W*H);       // Tiefe k je Pixel (für Nebel); 0 = Vordergrund
var OPEN=new Uint8Array(W*H);       // 1 = Freies (Hallenende), 2 = Glas zum Freien (Fenster, Tür, Schürze)
var SKY=new Uint8Array(W*H);
function zpx(b,x,y,c,k){ if (x<0||y<0||x>=W||y>=H) return; var i=y*W+x; if (k<KB[i]-1e-6) return; b.d[i]=c; KB[i]=k; OPEN[i]=0; }
function stage(b,k,fn){ var s=b.d.slice(); fn(); for (var i=0;i<W*H;i++) if (b.d[i]!==s[i]){ KB[i]=k; OPEN[i]=0; } }

// ---------------------------------------------------------------- Wetterfarben
var WX=null;
function wxFor(w){ return {
  sky:{snowlie:'b2 b3 b4 b5',sun:'b2 b3 b4 b5 s6',thaw:'m2 m3 m3 m4',snow:'m3 m4 s4 s4',fog:'s4 s4 s5'}[w],
  glass:{snowlie:'s4 s5 s6 b5',sun:'s5 s6 b5 l1',thaw:'m3 m4 s4 m4',snow:'s3 s4 s4 s5',fog:'s4 s4 s5'}[w],
  snow:w==='thaw'?R('m2 m3 s3 s4'):R('s4 s5 s6 l1'),
  haze:{snowlie:0.12,sun:0.08,thaw:0.25,snow:0.42,fog:0.9}[w], hazeCol:(w==='snowlie'||w==='sun')?P.b5:P.m4 }; }

// ---------------------------------------------------------------- Strahl: welche Fläche sieht Pixel (x,y)?
// liefert {s:'floor'|'left'|'right'|'roof'|'back', k, X, Y, Z}
function cast(x,y){ var best=-1, s='back', k;
  if (y>VP[1]+0.01){ k=(y-VP[1])/(FL-VP[1]); if (k>best){ best=k; s='floor'; } }
  if (x<VP[0]-0.01){ k=(VP[0]-x)/(VP[0]-XL); if (k>best && k>=1 && k<=KF+0.02){ var Yl=VP[1]+(y-VP[1])/k; if (Yl>=YE && Yl<=FL){ best=k; s='left'; } } }
  if (x>VP[0]+0.01){ k=(x-VP[0])/(XR-VP[0]); if (k>best && k>=1){ var Yr=VP[1]+(y-VP[1])/k; if (Yr>=YE && Yr<=FL){ best=k; s='right'; } } }
  if (y<VP[1]){ var g1=(y)-yroof(x); if (g1<0){ var lo=1, hi=60; for (var it=0;it<22;it++){ var m=(lo+hi)/2, X=VP[0]+(x-VP[0])/m, Y=VP[1]+(y-VP[1])/m; if (Y-yroof(X)<0) lo=m; else hi=m; } if (lo>best){ best=lo; s='roof'; } } }
  if (best<1){ s='back'; best=1; }
  var X2=VP[0]+(x-VP[0])/best, Y2=VP[1]+(y-VP[1])/best; return {s:s,k:best,X:X2,Y:Y2,Z:(best-1)*F}; }

// ---------------------------------------------------------------- Boden: Gleisfeld (Bahnsteige, Schotter, Schwellen, Schienen) und Querbahnsteig
function inPlat(X){ for (var i=0;i<PLAT.length;i++) if (X>=PLAT[i][0] && X<PLAT[i][1]) return i; return -1; }
function inTrk(X){ for (var i=0;i<TRK.length;i++) if (X>=TRK[i][0] && X<TRK[i][1]) return i; return -1; }
function trackFloor(X,Z,k,x,y,outside,w){ var c, pi=inPlat(X), ti=inTrk(X), snowy=outside && w!=='thaw', slush=outside && w==='thaw';
  if (pi>=0){ var p=PLAT[pi], e0=X-p[0], e1=p[1]-X, ed=Math.min(e0,e1)*k;
    c=(hash(Math.floor(X*2),Math.floor(Z*0.3))<0.5)?P.m3:P.s3; if (fbm(X*0.5,Z*0.05)>0.62) c=P.m2;
    if (ed<1.2) c=P.s5; else if (ed<2.2) c=P.s2;                                          // Kante weiß, dahinter Leitlinie
    if (snowy) c=(ed<1.4)?P.s4:ra(WX.snow,0.55+(fbm(X,Z*0.1)-0.5)*0.6,x,y); if (slush) c=(hash(x,y)<0.5)?P.m3:P.s3;
    return c; }
  if (ti>=0){ var t=TRK[ti], cx=(t[0]+t[1])/2, d=X-cx, sl=((Z%12)+12)%12;
    c=(hash(Math.floor(X*3),Math.floor(Z*0.7))<0.5)?P.s1:P.m1; if (hash(Math.floor(X*5),Math.floor(Z*1.3))<0.12) c=P.s2;
    if (Math.abs(d)<3.4 && sl<5/ (k+1)+0.6) c=(sl<0.5)?P.m2:P.m3;                                   // Betonschwellen
    var rd=Math.abs(Math.abs(d)-2.1); if (rd<0.5/k) c=P.m4;                                  // Schienenköpfe
    else if (rd<1.1/k && Math.abs(d)>2.1) c=P.k2;
    var edge=Math.min(X-t[0],t[1]-X)*k; if (!outside && edge<2.5) c=P.k1;                   // Schatten unter der Bahnsteigkante
    if (snowy){ var sn=(rd<0.6/k)?false:(fbm(X*0.8,Z*0.08)>0.3); if (sn) c=ra(WX.snow,0.5+(fbm(X*2,Z*0.2)-0.5)*0.7,x,y); }
    if (slush && hash(Math.floor(X*4),Math.floor(Z))<0.35) c=P.m3;
    return c; }
  return outside?(w==='thaw'?P.m2:P.s5):P.m1; }
function crossFloor(X,Z,x,y,w){ var k=1+Z/F, gx=(X-200)*0.27, gz=(Z-ZF)/36, ix=Math.floor(gx), iz=Math.floor(gz), fx=gx-ix, fz=gz-iz, c;
  var t=hash(ix,iz); c=t<0.45?P.s3:(t<0.93?P.s4:P.s5); if (fx*k*3.7<1||fz<0.07) c=P.s2;
  var g=fbm(X*0.8,Z*0.03); if (g>0.64 && bayer(x,y)<(g-0.64)*2) c=M.DN[c];
  if (w==='thaw'){ var wet=fbm(X*0.3+3,Z*0.02); if (wet>0.55 && bayer(x,y)<(wet-0.55)*2.4) c=(c===P.s2)?P.m1:P.m2; }
  return c; }

// ---------------------------------------------------------------- Wände und Dach
// linke Hallenwand (Seite des Kopfbaus): Putz, hohe Bogenfenster (Licht von der Straße)
var WINZ=[[16,30],[52,66],[88,102],[124,138],[160,174]];
function leftWall(Z,Y,k,x,y){ var c=((Math.floor(Z*0.4)+Math.floor(Y))%7===0)?P.s3:P.s4; if (Y>FL-1.6) c=P.s2; else if (Y>FL-5) c=(Y>FL-4.7)?P.m2:P.s3;
  for (var i=0;i<WINZ.length;i++){ var a=WINZ[i]; if (Z>=a[0] && Z<a[1] && Y>YE+3 && Y<FL-7){ var u=(Z-a[0])/(a[1]-a[0]), top=YE+3+Math.max(0,1-Math.sqrt(Math.max(0,1-Math.pow(u*2-1,2))))*4;
      if (Y>top){ var fr=(u<0.1||u>0.9||Y<top+0.5||Y>FL-7.6||Math.abs(u-0.5)<0.05); c=fr?P.s2:-1; } } }
  if (c===-1){ OPEN_T=2; return ra(R(WX.glass),0.75+(Y-50)*0.02,x,y); }
  if (Math.abs(((Z+2)%36)-0)<2.4) c=(Z%36<1.2)?P.s5:P.s2;                                // Lisenen
  return c; }
var OPEN_T=0;
function rightWall(Z,Y,k,x,y){ var c=(Y>FL-2)?P.s2:P.s3; if (Y>YE+3 && Y<FL-6 && ((Z%30)>6) && ((Z%30)<26)){ if (((Z%30)>15.5&&(Z%30)<16.5)||Math.abs(Y-50)<0.4) return P.s2; OPEN_T=2; return ra(R(WX.glass),0.7,x,y); } return c; }
var BAYZ=24;                                                                                   // Binderabstand
function roofTex(X,Z,k,x,y,w){ var c, ph=((Z%BAYZ)+BAYZ)%BAYZ, tw=1.1+0.25*k;
  if (ph<tw){ c=(ph<tw*0.45)?P.m1:P.m0; if (k<3 && ((Math.floor(X*1.3)+Math.floor(Z))%4===0)) c=P.m2; return c; }       // Binder (Fachwerk)
  if (ph<tw+1.6*k*0.3 && k>2.5){ var lt=((Math.floor(X*2)+Math.floor(ph*3))%5===0); if (lt) return P.m1; }
  var pu=((X-XL)%7+7)%7; if (pu<0.16*k+0.1) return P.m1;                                        // Pfetten
  var lat=(ph%8); if (lat<0.5+0.05*k) return P.m2;                                        // Sprossen
  OPEN_T=3;
  var g=ra(R(WX.glass),0.45+(fbm(X*0.3,Z*0.05)-0.5)*0.5+Math.max(0,(3-k))*0.08,x,y);
  if (w==='snowlie'||w==='snow'||w==='sun'){ var pane=Math.floor((X-XL)/7)*31+Math.floor(Z/8), cover=0.25+hash(pane,5)*0.6+(w==='snow'?0.25:0), pf=(ph%8)/8; if (pf<cover) g=(pf<cover-0.18||hash(Math.floor(X*3),Math.floor(Z))<0.4)?P.m3:P.s3; if (w==='sun' && pf<cover) g=M.UP[g]; }   // Schnee auf dem Glas (von unten dunkel)
  if (w==='thaw'){ if (((Math.floor(X*3)+Math.floor(Z*0.5))%11)===0) g=P.m2; }
  return g; }

// ---------------------------------------------------------------- Hallenende: Glasschürze und das Freie
function outsideAt(x,y,w,tod){ var c, night=tod==='night';
  // Himmel
  c=ra(R(night?'k1 n0 n1 n2':WX.sky),0.15+(y-10)/48,x,y); SKY[y*W+x]=1;
  if ((w==='snowlie'||w==='sun') && !night){ var cv=fbm(x*0.04,y*0.15); if (cv>0.66 && y<44) c=P.b5; }
  // ferne Stadt und die Hackerbrücke (Stahlbögen über dem Gleisfeld)
  var sk=52+Math.round(Math.sin(x*0.3)*1.5+hash(Math.floor(x/5),3)*3); if (y>=sk){ c=(w==='thaw')?P.m2:P.m3; SKY[y*W+x]=0; if (!night && ((x+y)%4===0)&&hash(x,y)<0.5) c=P.s3; if (night && hash(x,y)<0.15) c=P.y3; }
  var bx=(x-262)%26; if (bx<0) bx+=26; var by=51-Math.sqrt(Math.max(0,1-Math.pow((bx-13)/13,2)))*4;
  if (Math.abs(y-by)<0.7 || (y>=50 && y<=51)) { c=(w==='thaw')?P.m1:P.m2; SKY[y*W+x]=0; }
  if (y>51 && y<56 && bx%13===0){ c=P.m1; SKY[y*W+x]=0; }
  // Oberleitungsmasten (Portale) im Gleisfeld
  [[268,44],[322,46],[371,45],[410,47]].forEach(function(m){ if (x===m[0] && y>=m[1] && y<56){ c=P.m1; SKY[y*W+x]=0; } if (y===m[1] && Math.abs(x-m[0]-12)<12){ c=P.m1; SKY[y*W+x]=0; } });
  if (y===47 && !night && (x%3)) { if (SKY[y*W+x]) c=M.DN[c]; }
  return c; }

// ---------------------------------------------------------------- Züge
// Seitenflächen als Funktion (Z, Y): EC mit roter Lok und grau-weißen Wagen, ICE weiß mit rotem Streifen
var ZN11=196, ZN13=110;
function ecSide(Z,Y,k,x,y){ var d=ZN11-Z;
  if (Y>FL-1.1) return P.k1; if (Y>FL-2.4) return P.m1;
  if (d<52){ // Lok: rot, Lüftergitter, Führerstandstür, graues Dach mit Stromabnehmer
    if (Y<51.9) return (Y<51.5)?P.m3:P.m2; if (d<1.2) return P.r3;
    if (d>4 && d<7.5 && Y>53.4 && Y<55.4) return P.c1;                                           // Seitenfenster Führerstand
    if (d>8 && d<9.4 && Y>53 && Y<FL-3) return P.r1;                                             // Tür
    if (d>14 && d<44 && Y>52.8 && Y<55.6) return ((Math.floor(d*1.4)%2)===0)?P.r1:P.m2;          // Lüftergitter
    if (Y>58.6 && Y<59.3) return P.s5;
    if (Y>FL-3.6) return P.r1;
    return ((Math.floor(d)+Math.floor(Y*2))%11===0)?P.r1:P.r2; }
  if (d<53.5) return P.k2;                                                                       // Übergang
  var L=(d-53.5)%78; if (L<1) return P.k2;
  if (Y<51.8) return (Y<51.4)?P.m3:P.m4;
  var door=(L>3&&L<7)||(L>71&&L<75); if (door){ if (Y>52.6 && Y<FL-3){ return (Math.abs(L-5)<0.4||Math.abs(L-73)<0.4)?P.m1:((Y<55)?P.c1:P.m3); } return P.s4; }
  if (Y>53.2 && Y<56 && (L%6.6)>1.1 && L>8 && L<70) return ((L+Y)%5<1)?P.c3:P.c1;               // Fensterband
  if (Y>57.2 && Y<58.4) return P.r2;                                                              // rotes Band
  if (Y>FL-3.4) return P.m2;
  return (Y<53.2)?P.s5:P.s4; }
function iceSide(Z,Y,k,x,y){ var L=(ZN13-Z)%80; if (L<0) L+=80;
  if (Y>FL-1) return P.k1; if (Y>FL-2.2) return P.m2; if (Y<53) return (Y<52.6)?P.s4:P.s5;
  if (L<0.8) return P.m2;
  if (Y>54.6 && Y<57.4 && (L%6)>0.8 && L>6) return ((L+Y)%5<1)?P.n2:P.k2;
  if (Y>59.6 && Y<60.6) return P.r3;
  return P.s5; }
function trainSide(b,Xs,Y0,Z0,Z1,fn){ // Seitenfläche bei X=Xs von Z0 (fern) bis Z1 (nah), mit Tiefentest
  var a=pk(Xs,Y0,Z0), c=pk(Xs,Y0,Z1), xa=rnd(Math.min(a[0],c[0])), xc=rnd(Math.max(a[0],c[0]));
  for (var x=Math.max(0,xa);x<=Math.min(W-1,xc);x++){ var k=(x-VP[0])/(Xs-VP[0]); if (k<1+Z0/F||k>1+Z1/F) continue; var Z=(k-1)*F, yt=VP[1]+(Y0-VP[1])*k, yb=VP[1]+(FL-VP[1])*k;
    for (var y=Math.max(0,Math.floor(yt));y<=Math.min(H-1,Math.ceil(yb));y++){ var Y=VP[1]+(y-VP[1])/k; if (Y<Y0||Y>FL) continue; zpx(b,x,y,fn(Z,Y,k,x,y),k); } } }
function trainFace(b,X0,X1,Ytop,Z,kind){ // Stirnseite (parallel zur Bildebene)
  var k=1+Z/F, a=pk(X0,Ytop,Z), z=pk(X1,FL,Z), x0=rnd(a[0]), x1=rnd(z[0]), y0=rnd(a[1]), y1=rnd(z[1]), w=x1-x0, h=y1-y0, x, y;
  if (kind==='ec'){
    for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var u=(x-x0)/w, v=(y-y0)/h, c=P.r2, ins=Math.abs(u-0.5);
      if (v<0.05){ if (ins>0.42) continue; c=P.m2; } else if (v<0.08) c=P.m3;                                       // Dachkante
      if (v>0.13 && v<0.34 && ins<0.42 && ins>0.025) c=(((x-x0)*0.7+(y-y0))%11<1.4)?P.c3:((v<0.16)?P.k1:P.c0);     // geteilte Frontscheibe
      if (v>0.13 && v<0.34 && ins<=0.025) c=P.r1;
      if (v>0.4 && v<0.44) c=P.s5; if (v>0.6 && v<0.63) c=P.s5;                                                     // weiße Zierlinien
      if (v>0.36 && v<0.4 && ins<0.2) c=P.k1;                                                                       // Zugnummernanzeige
      if (v>0.84) c=(v>0.93)?P.k1:P.m1;                                                                             // Pufferbohle
      if (u<0.03) c=M.UP[c]; if (u>0.97) c=M.DN[c];
      zpx(b,x,y,c,k); }
    LIGHTS11=[[x0+rnd(w*0.14),y0+rnd(h*0.7)],[x1-rnd(w*0.14)-3,y0+rnd(h*0.7)],[x0+rnd(w*0.5)-1,y0+rnd(h*0.095)]];
    LIGHTS11.forEach(function(q,i){ b.rect(q[0],q[1],i<2?3:2,2,P.s6); b.px(q[0],q[1]+2,P.m1); });
    b.rect(x0+rnd(w*0.28),y0+rnd(h*0.7),2,2,P.r1); b.rect(x1-rnd(w*0.28)-2,y0+rnd(h*0.7),2,2,P.r1);
    b.rect(x0+rnd(w*0.06),y1-rnd(h*0.13),6,4,P.k2); b.hl(x0+rnd(w*0.06),x0+rnd(w*0.06)+5,y1-rnd(h*0.13),P.m3); b.rect(x1-rnd(w*0.06)-6,y1-rnd(h*0.13),6,4,P.k2); b.hl(x1-rnd(w*0.06)-6,x1-rnd(w*0.06)-1,y1-rnd(h*0.13),P.m3);
    b.rect(x0+rnd(w*0.5)-2,y1-rnd(h*0.14),5,3,P.m1); b.px(x0+rnd(w*0.5),y1-rnd(h*0.14)+3,P.k1);
    DEST11=[x0+rnd(w*0.31),y0+rnd(h*0.365),rnd(w*0.38),3];
    b.line(x0+rnd(w*0.2),y0+rnd(h*0.33),x0+rnd(w*0.32),y0+rnd(h*0.17),P.k2); b.line(x0+rnd(w*0.62),y0+rnd(h*0.33),x0+rnd(w*0.74),y0+rnd(h*0.17),P.k2);
    // Stromabnehmer (gesenkt) und Lampen auf dem Dach
    var px0=rnd(pk(X0+1.5,Ytop-0.6,Z-4)[0]), pyy=rnd(pk(X0,Ytop-0.6,Z-4)[1]); b.line(px0,pyy,px0+rnd(w*0.6),pyy-2,P.m1); b.line(px0+4,pyy,px0+rnd(w*0.3),pyy-4,P.m1);
    TRAIN11=[x0,y0,w,h]; }
  else {
    var cx=(x0+x1)/2;
    for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var u2=(x-cx)/(w/2), v2=(y-y0)/h, ok=v2>0.18 || Math.abs(u2)<Math.sqrt(Math.max(0,v2/0.18))*0.9+0.1; if (!ok) continue;
      var c2=P.s5; if (v2<0.2) c2=P.s4; if (v2>0.3 && v2<0.44 && Math.abs(u2)<0.8) c2=(v2<0.33)?P.k1:P.n1; if (v2>0.7 && v2<0.76) c2=P.r3; if (v2>0.88) c2=P.m1; if (u2<-0.85) c2=P.s4; if (u2>0.85) c2=P.s3;
      zpx(b,x,y,c2,k); }
    zpx(b,rnd(cx-w*0.38),y0+rnd(h*0.6),P.s6,k); zpx(b,rnd(cx-w*0.38)+1,y0+rnd(h*0.6),P.s6,k); zpx(b,rnd(cx+w*0.3),y0+rnd(h*0.6),P.s6,k); zpx(b,rnd(cx+w*0.3)+1,y0+rnd(h*0.6),P.s6,k);
    TRAIN13=[x0,y0,w,h]; } }
var LIGHTS11=[], DEST11=[0,0,0,0], TRAIN11=[0,0,0,0], TRAIN13=[0,0,0,0];

// ---------------------------------------------------------------- Prellbock, Säulen, Schilder, Anzeiger
function buffer(b,X0,X1,Z){ var k=1+Z/F, a=pk(X0,FL-3.4,Z), z=pk(X1,FL,Z), x0=rnd(a[0]), x1=rnd(z[0]), y0=rnd(a[1]), y1=rnd(z[1]), w=x1-x0, h=y1-y0, i;
  function R_(x,y,ww,hh,c){ for (var yy=y;yy<y+hh;yy++) for (var xx=x;xx<x+ww;xx++) zpx(b,xx,yy,c,k); }
  // Stahlrahmen von hinten: Querträger mit Warnstreifen, zwei Stützen, Streben, rote Lampe obenauf
  R_(x0+1,y0+2,w-2,3,P.k2); for (i=x0+1;i<x1-1;i++){ zpx(b,i,y0+2,P.m2,k); zpx(b,i,y0+3,(((i>>1)&1)?P.y3:P.k1),k); zpx(b,i,y0+4,P.k1,k); }
  [x0+2,x1-5].forEach(function(px,j){ R_(px,y0+5,3,h-5,P.m1); for (var yy=y0+5;yy<y1;yy++) zpx(b,px,yy,P.m2,k); var ex=px+(j?-5:7); var L=Math.max(1,y1-y0-6); for (var s=0;s<=L;s++) zpx(b,rnd(px+1+(ex-px-1)*s/L),y0+6+s,P.k2,k); });
  R_(x0+rnd(w/2)-2,y0-3,4,5,P.k2); R_(x0+rnd(w/2)-1,y0-2,2,2,P.r3); BUFLAMPS.push([x0+rnd(w/2)-1,y0-2]);
  for (i=x0;i<x1;i++) zpx(b,i,y1,P.k1,k); }
var BUFLAMPS=[];
function column(b,X,Z,topY){ var a=pk(X,topY,Z), z=pk(X,FL,Z), x=rnd(a[0]), k=1+Z/F, hw=Math.max(1,rnd(0.45*k));
  for (var y=Math.max(0,rnd(a[1]));y<rnd(z[1]);y++) for (var q=-hw;q<=hw;q++) zpx(b,x+q,y,(q===-hw)?P.m3:((q===hw)?P.k2:P.m1),k);
  for (var q2=-hw-1;q2<=hw+1;q2++){ zpx(b,x+q2,rnd(z[1])-2,P.m1,k); zpx(b,x+q2,rnd(z[1])-1,P.m0,k); } }
function hangSign(b,x0,y0,w,h,txt,top){ b.vl(x0+3,top,y0-1,P.m1); b.vl(x0+w-4,top,y0-1,P.m1);
  b.rect(x0,y0,w,h,P.b0); b.rect(x0+1,y0+1,w-2,h-2,P.b1); b.hl(x0+1,x0+w-2,y0+1,P.b2); b.hl(x0,x0+w-1,y0+h-1,P.n0);
  var tw=txt.length*6-1; if (h>=16) bigNum(b,txt,x0+rnd((w-tw)/2),y0+rnd((h-9)/2),P.s6,1); else mt(b,txt,x0+rnd((w-mw(txt))/2),y0+rnd((h-5)/2),P.s6);
  for (var yy=Math.max(0,top);yy<y0+h;yy++) for (var xx=x0;xx<x0+w;xx++) if (yy>=y0 || xx===x0+3 || xx===x0+w-4){ KB[yy*W+xx]=KF; OPEN[yy*W+xx]=0; } }
function platIndicator(b,x,base,txt){ var tw=mw(txt)+4, x0=x-(tw>>1);
  b.vl(x,base-30,base-1,P.m1); b.vl(x+1,base-30,base-1,P.m2); b.rect(x0-1,base-37,tw+2,9,P.k1); b.rect(x0,base-36,tw,7,P.k2); b.hl(x0-1,x0+tw,base-37,P.m2);
  mt(b,txt,x0+2,base-35,P.y4); b.rect(x-2,base-1,6,1,P.k2);
  for (var yy=base-37;yy<base;yy++) for (var xx=x0-1;xx<x0+tw+1;xx++) if (yy<base-28||xx===x||xx===x+1){ KB[yy*W+xx]=KF; OPEN[yy*W+xx]=0; } }

// ---------------------------------------------------------------- Kopfbau links: Ausgang, Schließfächer, Bahnhofsmission, Fenster, Uhr
function facade(b,w,tod){ var x, y, X1=FAC.x1;
  for (y=0;y<FRONTY+1;y++) for (x=0;x<X1;x++){ var c;
    if (y<9) c=(y<2)?P.m0:((y===8)?P.k2:(((x%12)===0||(x%12)===6&&y>3)?P.m2:((y===2)?P.m3:P.m1)));
    else if (y<20){ var wx2=x%15; c=(y===9||y===19)?P.s2:((wx2<2)?P.s3:((y<11)?P.s5:ra(R(WX.glass),0.4+(y-11)/14,x,y))); if (wx2>=2 && y>=11 && y<19) OPEN_T=9; }
    else if (y<26) c=(y<22)?P.s5:((y===25)?P.s2:P.s3);                                          // Gesims
    else if (y<62) c=((Math.floor(x/22)+Math.floor(y/9))%2)?P.s4:P.e4;                            // Kunststeinplatten
    else c=(y>FRONTY-3)?P.m1:(((x%24)===0)?P.s2:P.s3);
    if (y>=26 && y<62 && (x%22===0||y%9===0)) c=P.s2;
    b.px(x,y,c); KB[y*W+x]=KF; OPEN[y*W+x]=(OPEN_T===9)?2:0; OPEN_T=0; }
  for (x=3;x<X1;x+=12){ b.px(x,4,P.m3); b.px(x,6,P.m3); }
  // Kante zur Seitenwand
  b.vl(X1-1,0,FRONTY,P.s2); b.vl(X1-2,0,FRONTY,P.s5);
  // obere Fenster (Büros), eines mit Papierstern
  for (var i=0;i<5;i++){ var wx=8+i*28; if (wx+16>X1-4) break; b.rect(wx,30,16,24,P.s2); b.rect(wx+1,31,14,22,P.m1); b.vl(wx+8,31,52,P.s3); b.hl(wx+1,wx+14,40,P.s3); for (y=32;y<52;y++) if ((y+wx)%7===0) b.hl(wx+2,wx+6,y,P.m2); b.hl(wx,wx+15,54,P.s5);
    if (tod!=='day'){ b.rect(wx+1,31,14,22,P.y2); } }
  b.px(46,40,P.s6); b.px(45,41,P.s6); b.px(46,41,P.s6); b.px(47,41,P.s6); b.px(46,42,P.s6);
  // Bahnhofsuhr an einem Ausleger
  b.rect(CLK.cx-1,CLK.cy-12,3,5,P.m1); b.hl(CLK.cx-4,CLK.cx+4,CLK.cy-12,P.m2); b.ellipse(CLK.cx+0.5,CLK.cy+0.5,CLK.r+1.4,CLK.r+1.4,P.k1); b.ellipse(CLK.cx+0.5,CLK.cy+0.5,CLK.r,CLK.r,P.s6);
  for (var q=0;q<12;q++){ var an=q/12*Math.PI*2; b.px(rnd(CLK.cx+Math.cos(an)*(CLK.r-1.3)),rnd(CLK.cy+Math.sin(an)*(CLK.r-1.3)),P.k1); }
  // Ausgang: Portal mit Glastüren, draußen die Straße im Schnee
  var ex0=6, ex1=44, et=64; b.rect(ex0-3,et-4,ex1-ex0+6,FRONTY-et+4,P.m1); b.hl(ex0-3,ex1+2,et-4,P.m2);
  for (y=et;y<FRONTY-1;y++) for (x=ex0;x<ex1;x++){ var u=x-ex0, v=y-et, c2;
    c2=(v<16)?ra(R(tod==='night'?'k1 n0 n1':WX.sky),0.3+v/30,x,y):((v<26)?((u%9<5)?(w==='thaw'?P.m2:P.s3):P.m2):(w==='thaw'?((hash(x,y)<0.4)?P.m2:P.m3):((hash(x,y)<0.2)?P.s4:P.s5)));
    if (v>=12 && v<26 && u%9>=5){ c2=(v<14)?P.s5:P.e3; }                                        // Häuser gegenüber, Schneekanten
    if ((u%13)===0||u===ex1-ex0-1) c2=P.m3; if (v===10) c2=P.m3;
    b.px(x,y,c2); OPEN[y*W+x]=2; SKY[y*W+x]=v<12?1:0; }
  b.rect(ex0+1,et-12,ex1-ex0-2,7,P.b0); b.rect(ex0+2,et-11,ex1-ex0-4,5,P.b1); mt(b,'AUSGANG',ex0+4,et-11,P.s6);
  // Schließfächer
  var lx0=52, lx1=90; b.rect(lx0,68,lx1-lx0,FRONTY-68-2,P.m2); for (y=69;y<FRONTY-3;y++) for (x=lx0+1;x<lx1-1;x++){ var fx=(x-lx0-1)%9, fy=(y-69)%10; b.px(x,y,(fx===0||fy===0)?P.m1:((fx===8||fy===9)?P.m3:P.m2)); if (fx===6 && fy===4) b.px(x,y,P.y3); if (fx===2 && fy===2) b.px(x,y,P.s5); }
  b.rect(lx0+2,57,10,9,P.b0); b.rect(lx0+3,58,8,7,P.b1); b.ellipse(lx0+5.5,61.5,1.6,1.6,P.s6); b.px(lx0+5,61,P.b1); b.hl(lx0+7,lx0+9,61,P.s6); b.px(lx0+9,62,P.s6); b.px(lx0+8,62,P.s6);   // Schlüssel-Piktogramm
  // Tür der Bahnhofsmission: Glastür im Alurahmen, Schild nur mit Schrift
  var m=MIS; b.rect(m.x0-2,m.top-2,m.x1-m.x0+4,FRONTY-m.top+2,P.m3); b.rect(m.x0,m.top,m.x1-m.x0,FRONTY-m.top-1,P.m2);
  for (y=m.top+2;y<FRONTY-4;y++) for (x=m.x0+2;x<m.x1-2;x++){ var c3=((x+y*0.4)%11<1.5)?P.s4:P.e3; if (x===rnd((m.x0+m.x1)/2)) c3=P.m3; b.px(x,y,c3); }
  b.rect(m.x0+3,m.top+14,4,2,P.s5); b.rect(m.x1-7,m.top+14,4,2,P.s5); b.vl(rnd((m.x0+m.x1)/2)-2,m.top+18,m.top+24,P.s5); b.vl(rnd((m.x0+m.x1)/2)+2,m.top+18,m.top+24,P.s5);
  var sw=M.textWidth('BAHNHOFSMISSION'), sx=rnd((m.x0+m.x1)/2-sw/2)-1; b.rect(sx-3,m.top-12,sw+6,9,P.s6); b.hl(sx-3,sx+sw+2,m.top-4,P.s3); b.vl(sx+sw+2,m.top-12,m.top-4,P.s3);
  M.text(b,'BAHNHOFSMISSION',sx,m.top-11,P.b0); MSIGN=[sx-3,m.top-12,sw+6,9];
  // ihr Fenster zum Bahnsteig: warm erleuchtet, Pflanze, Tassen
  var fw0=m.x1+5, fw1=X1-6; b.rect(fw0-1,70,fw1-fw0+2,22,P.m3); for (y=71;y<91;y++) for (x=fw0;x<fw1;x++){ var c4=(y<80)?P.y4:P.y3; if (y===80) c4=P.s5; if ((x+y)%9===0) c4=P.s6; b.px(x,y,c4); }
  b.rect(fw0+1,84,4,6,P.t2); for (var g=0;g<8;g++){ b.px(fw0+1+(g%4),78+(g>>2)*2+(g%2),P.g3); b.px(fw0+2+(g%3),80+(g%2),P.g2); }
  b.rect(fw0+9,87,3,3,P.s6); b.rect(fw0+13,87,3,3,P.r3); b.hl(fw0-2,fw1+1,91,P.s5);
  // Fuß der Fassade: Sockel, ein Abfalleimer
  b.rect(48,FRONTY-12,4,11,P.m1); b.rect(47,FRONTY-13,6,2,P.m3); b.px(49,FRONTY-9,P.s5); }
var MSIGN=[0,0,0,0];

// ---------------------------------------------------------------- Abfahrtstafel
var DEPS=[['10:15','EC 85','VERONA','11'],['10:20','ICE 584','NÜRNBERG','13'],['10:28','RB','GARMISCH','26'],['10:31','IC 2264','STUTTGART','14'],['10:44','RE','SALZBURG','12']];
function board(b,tod){ var B=BOARD, x, y;
  b.vl(B.x0+8,0,B.y0-1,P.m1); b.vl(B.x1-9,0,B.y0-1,P.m1);
  b.rect(B.x0,B.y0,B.x1-B.x0,B.y1-B.y0,P.m1); b.rect(B.x0+1,B.y0+1,B.x1-B.x0-2,B.y1-B.y0-2,P.k1); b.hl(B.x0,B.x1-1,B.y0,P.m3);
  b.rect(B.x0+1,B.y0+1,B.x1-B.x0-2,6,P.b0); mt(b,'ABFAHRT',B.x0+3,B.y0+1,P.s6); mt(b,'GLEIS',B.x1-23,B.y0+1,P.s5);
  DEPS.forEach(function(r,i){ var yy=B.y0+10+i*7; b.hl(B.x0+2,B.x1-3,yy+5,P.k2);
    mt(b,r[0],B.x0+3,yy,P.y4); mt(b,r[2],B.x0+27,yy,P.s6); mt(b,r[3],B.x1-11,yy,P.y4); }); }
// Uhrzeit-Ziffern sind Mikroschrift: '1015' → wir setzen den Doppelpunkt selbst (oben)

// ---------------------------------------------------------------- Kiosk (Rückseite im Bild, Front als Ebene)
function kioskBack(b){ var k=KIO, x, y; b.rect(k.x0,k.top+8,k.x1-k.x0,k.base-k.top-8,P.g1);
  for (y=k.top+12;y<k.sill;y++) for (x=k.x0+3;x<k.x1-3;x++) b.px(x,y,P.w0);
  var cols=[P.r2,P.y3,P.b2,P.s5,P.g3,P.r3,P.c3,P.e3,P.s6,P.d4]; for (var s=0;s<3;s++){ var sy=k.top+14+s*8; b.hl(k.x0+4,k.x1-5,sy+6,P.w2); for (x=k.x0+5;x<k.x1-5;x+=3){ var c=cols[(x*3+s*7)%cols.length]; b.rect(x,sy,2,6,c); b.px(x,sy,M.UP[c]); } }
  for (x=k.x0;x<k.x1;x++){ KB[(k.top+8)*W+x]=0; } }
function kioskLayer(S,tod,w){ var k=KIO, L=M.layer(k.x0-4,k.top-4,k.x1-k.x0+8,KIOSKG_Y-k.top+8,KIOSKG_Y+1), wr=M.lw(L), x;
  wr.rect(k.x0-3,k.top,k.x1-k.x0+6,9,P.g2); wr.hl(k.x0-3,k.x1+2,k.top,P.g4); wr.hl(k.x0-3,k.x1+2,k.top+8,P.k2); wr.hl(k.x0-2,k.x1+1,k.top-1,P.m3);
  if (w!=='thaw') wr.hl(k.x0-2,k.x1+1,k.top-2,P.s6);
  var t='PRESSE', tw=M.microWidth(t); M.microText(L,t,rnd((k.x0+k.x1)/2-tw/2)-L.ox,k.top+2-L.oy,P.s6);
  wr.rect(k.x0,k.top+9,3,k.base-k.top-9,P.g2); wr.vl(k.x0,k.top+9,k.base-1,P.g3); wr.rect(k.x1-3,k.top+9,3,k.base-k.top-9,P.g1); wr.vl(k.x1-1,k.top+9,k.base-1,P.g0);
  wr.rect(k.x0,k.sill,k.x1-k.x0,2,P.w3); wr.hl(k.x0,k.x1-1,k.sill,P.w4);
  wr.rect(k.x0+1,k.sill+2,k.x1-k.x0-2,KIOSKG_Y+3-k.sill-2,P.g2); wr.hl(k.x0+1,k.x1-2,k.sill+2,P.g1);
  // Zeitungsständer vorn mit Schlagzeilen
  for (x=k.x0+3;x<k.x1-4;x+=9){ wr.rect(x,k.sill+5,8,11,P.s6); wr.hl(x,x+7,k.sill+5,P.k2); wr.hl(x+1,x+6,k.sill+7,P.k1); wr.hl(x+1,x+5,k.sill+9,P.m3); wr.rect(x+1,k.sill+11,3,3,P.m2); wr.hl(x+5,x+6,k.sill+12,P.m3); wr.hl(x,x+7,k.sill+16,P.m1); }
  [k.x0+3,k.x0+9,k.x1-14,k.x1-8].forEach(function(x){ wr.rect(x,k.top+11,5,8,P.s5); wr.hl(x,x+4,k.top+12,P.r2); wr.hl(x,x+4,k.top+15,P.m2); wr.hl(x,x+3,k.top+17,P.m3); });   // Zeitungen an der Klammerleiste (Mitte frei für die Kioskfrau)
  finish(L,tod,w); return L; }

// ---------------------------------------------------------------- Weihnachtsbaum, Bank
function treeLayer(S,tod,w){ var t=TREE, L=M.layer(t.cx-40,t.base-t.h-4,80,t.h+8,t.base), wr=M.lw(L), y, x, i, r=M.rng(77);
  // Holzkübel
  wr.rect(t.cx-10,t.base-9,21,9,P.w2); wr.hl(t.cx-11,t.cx+11,t.base-9,P.w4); for (i=0;i<4;i++) wr.vl(t.cx-8+i*6,t.base-8,t.base-1,P.w1); wr.hl(t.cx-10,t.cx+10,t.base-1,P.w0);
  wr.rect(t.cx-1,t.base-14,3,6,P.w1);
  // Zweige in Etagen
  var top=t.base-t.h;
  for (y=top;y<t.base-12;y++){ var f=(y-top)/(t.h-12), tier=((y-top)%11)/11, hw=f*30*(0.72+tier*0.42)+1;
    for (x=Math.floor(t.cx-hw);x<=Math.ceil(t.cx+hw);x++){ var e=Math.abs(x-t.cx)/hw; if (e>1) continue; if (e>0.8 && hash(x,y)<0.5) continue;
      var c=(e>0.65&&tier>0.55)?P.g3:((x<t.cx)?P.g2:P.g1); if (hash(x*3,y*7)<0.18) c=P.g3; if (tier<0.18 && e>0.3) c=P.g0; if (x>t.cx+hw*0.4 && hash(x,y*2)<0.3) c=P.g0;
      wr.px(x,y,c); } }
  // Lichterkette (warme Punkte) und Strohsterne
  LIGHTS=[]; for (i=0;i<46;i++){ var ly=top+6+Math.floor(r()*(t.h-20)), lf=(ly-top)/(t.h-12), lx=rnd(t.cx+(r()*2-1)*lf*26); LIGHTS.push([lx,ly]); wr.px(lx,ly,P.y4); }
  for (i=0;i<9;i++){ var sy=top+12+Math.floor(r()*(t.h-26)), sf=(sy-top)/(t.h-12), sx=rnd(t.cx+(r()*2-1)*sf*22); wr.px(sx,sy,P.y5); wr.px(sx-1,sy,P.e4); wr.px(sx+1,sy,P.e4); wr.px(sx,sy-1,P.e4); wr.px(sx,sy+1,P.e4); }
  wr.px(t.cx,top-1,P.g2); wr.px(t.cx,top-2,P.g3);
  finish(L,tod,w); return L; }
var LIGHTS=[];
function benchLayer(S,tod,w){ var B=BENCH, L=M.layer(B.x0-2,B.seat-14,B.x1-B.x0+4,B.base-B.seat+16,B.base), wr=M.lw(L);
  for (var k=0;k<2;k++){ var yy=B.seat-11+k*4; wr.rect(B.x0,yy,B.x1-B.x0,3,P.w3); wr.hl(B.x0,B.x1-1,yy,P.w4); wr.hl(B.x0,B.x1-1,yy+2,P.w1); }
  wr.rect(B.x0-1,B.seat,B.x1-B.x0+2,3,P.w3); wr.hl(B.x0-1,B.x1,B.seat,P.w5); wr.hl(B.x0-1,B.x1,B.seat+2,P.w1);
  [B.x0+3,B.x1-5].forEach(function(lx){ wr.rect(lx,B.seat-12,2,B.base-B.seat+12,P.k2); wr.vl(lx,B.seat-12,B.base-1,P.m1); wr.line(lx,B.seat+3,lx-3,B.base-1,P.k2); wr.line(lx+1,B.seat+3,lx+4,B.base-1,P.k2); });
  finish(L,tod,w); return L; }
function finish(L,tod,w){ M.light(L,function(x,y){ return -0.15+lgt(x,y); },L.ox,L.oy); if (tod!=='day') M.tintApply(L,M.TINT[tod]||M.TINT.night); }

// ---------------------------------------------------------------- gemalte Reisende
function person(b,x,by,h,coat,opt){ opt=opt||{}; var s=h/30, hw=Math.max(1,rnd(2.2*s)), hy=by-h, legs=rnd(h*0.42), y;
  for (y=by-legs;y<by;y++){ b.px(x-1,y,P.k2); b.px(x+1,y,opt.skirt&&y<by-legs*0.5?coat:P.k2); }
  for (y=hy+rnd(h*0.16);y<by-legs+rnd(h*0.08);y++){ var ww=hw+((y>hy+h*0.3)?1:0); b.hl(x-ww,x+ww,y,coat); b.px(x+ww,y,M.DN[coat]); }
  b.rect(x-1,hy,3,rnd(h*0.16),opt.hair||P.h2); b.px(x+(opt.f==='L'?-1:1),hy+rnd(h*0.08),P.p3); b.px(x,hy+rnd(h*0.1),P.p3);
  if (opt.case){ var cx=x+(opt.f==='L'?-hw-4:hw+2); b.rect(cx,by-rnd(h*0.36),rnd(3*s)+2,rnd(h*0.3),opt.case); b.vl(cx+(opt.f==='L'?2:0),by-rnd(h*0.5),by-rnd(h*0.36),P.k2); }
  if (opt.bag){ b.rect(x-hw-2,hy+rnd(h*0.3),2,rnd(h*0.2),opt.bag); } }

// ---------------------------------------------------------------- Licht
function lgt(x,y){ var a=0;
  var dx=(x-330)/170, dy=(y-50)/60, d=dx*dx+dy*dy; if (d<1) a+=Math.pow(1-d,1.3)*0.55*LF;   // Helligkeit vom Hallenende
  if (y>FRONTY) a-=Math.min(0.35,(y-FRONTY)/90);
  if (x<FAC.x1) a-=0.2;
  return a; }
var LF=1;

// ---------------------------------------------------------------- Malen
var LASTB=null;
function paint(S,GS,tod){ var w=wea(GS), b=new M.Buf(W,H,P.k0), x, y, i;
  WX=wxFor(w); LF={snowlie:1,sun:1.15,thaw:0.6,snow:0.8,fog:0.7}[w]; if (tod!=='day') LF=0.3;
  KB.fill(0); OPEN.fill(0); SKY.fill(0); BUFLAMPS=[];
  // ---- Hintergrund per Strahl: Dach, Wände, Gleisfeld, Hallenende, Querbahnsteig
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=cast(x,y), c, i2=y*W+x; OPEN_T=0;
    if (h.s==='floor'){ if (h.k>=KF) c=crossFloor(h.X,h.Z,x,y,w); else c=trackFloor(h.X,h.Z,h.k,x,y,false,w); }
    else if (h.s==='left') c=leftWall(h.Z,h.Y,h.k,x,y);
    else if (h.s==='right') c=rightWall(h.Z,h.Y,h.k,x,y);
    else if (h.s==='roof') c=roofTex(h.X,h.Z,h.k,x,y,w);
    else { // Rückebene (k=1): Glasschürze oder das Freie
      if (h.Y<YOPEN){ var mu=((x-XL)%10+10)%10; c=(mu<1)?P.m1:((h.Y>YOPEN-1.5)?P.m0:-2); if (Math.abs(h.Y-34)<0.6) c=P.m1; if (c===-2){ c=outsideAt(x,y,w,tod); if (bayer(x,y)<0.25) c=M.DN[c]; OPEN_T=2; } }
      else { if (y>VP[1]) { var kk=(y-VP[1])/(FL-VP[1]); var Xo=VP[0]+(x-VP[0])/kk; c=trackFloor(Xo,(kk-1)*F,kk,x,y,true,w); OPEN_T=1; } else { c=outsideAt(x,y,w,tod); OPEN_T=1; } } }
    b.d[i2]=c; KB[i2]=h.k; OPEN[i2]=OPEN_T; }
  // ---- Säulen auf dem Bahnsteig 13/14 und 14/15
  [[325.5,30],[325.5,90],[325.5,150],[349.5,60],[349.5,120]].forEach(function(q){ column(b,q[0],q[1],yroof(q[0])+1); });
  // ---- Züge: ICE auf Gleis 13 (weiter hinten), Doppelstockzug auf Gleis 11 (am Prellbock)
  trainSide(b,334,52.5,-38,ZN13,iceSide); trainFace(b,334,342,52.5,ZN13,'ice');
  trainSide(b,293.5,51.2,-38,ZN11,ecSide); trainFace(b,285.5,293.5,51.2,ZN11,'ec');
  // ---- Prellböcke
  buffer(b,285,294,206); buffer(b,309,318,206); buffer(b,333,342,206);
  // Reisende weit hinten (klein) und am Bahnsteigkopf
  stage(b,3,function(){ person(b,rnd(pk(301,0,60)[0]),rnd(pk(0,FL,60)[1]),14,P.r2,{case:P.c2,f:'R'}); person(b,rnd(pk(304,0,40)[0]),rnd(pk(0,FL,40)[1]),12,P.c2,{f:'L'}); person(b,rnd(pk(327,0,70)[0]),rnd(pk(0,FL,70)[1]),15,P.e2,{bag:P.w2}); });
  stage(b,5.5,function(){ person(b,284,FRONTY+1,30,P.c1,{case:P.r2,f:'R',hair:P.h1}); person(b,348,FRONTY,29,P.w2,{f:'L',hair:P.s3}); person(b,357,FRONTY,22,P.r3,{f:'L',hair:P.w2,skirt:1}); });
  // ---- Bahnsteigköpfe: Anzeiger
  platIndicator(b,303,FRONTY,'11 VERONA'); platIndicator(b,455,FRONTY,'13 NÜRNBERG');
  // ---- Gleisschilder unter dem Dach
  hangSign(b,SIGN11.x0,SIGN11.y0,SIGN11.x1-SIGN11.x0,SIGN11.y1-SIGN11.y0,'11',0);
  hangSign(b,378,32,16,9,'12',0); hangSign(b,522,44,18,9,'13',0);
  // ---- Kopfbau links
  facade(b,w,tod);
  // ---- Abfahrtstafel, Kiosk-Rückwand
  stage(b,KF,function(){ board(b,tod); kioskBack(b); });
  // ---- Luke im Boden (Eisenplatte mit Gitter)
  hatch(b);
  // Bahnsteigkante / Leitlinie vor den Prellböcken
  for (x=FAC.x1;x<W;x++){ if (b.get(x,FRONTY+1)!==T) b.px(x,FRONTY+1,P.s5); b.px(x,FRONTY+2,P.s2); }
  // ---- Dunst und Nebel nach Tiefe
  var hz=WX.haze, hc=WX.hazeCol; if (tod!=='day') hc=P.n0;
  M.fogBake(b,function(xx,yy){ var i3=yy*W+xx, k=KB[i3]; if (k<=0) return 0; if (OPEN[i3]===1 || OPEN[i3]===2 && k<1.5) return Math.min(1,hz*1.15+0.05); var f=Math.max(0,(KF-k)/(KF-1)); return Math.min(0.95,hz*Math.pow(f,1.4)*(w==='fog'?1.05:1)); },{col:hc});
  // Mischfarben des Dunstes, die ins Lavendel kippen, auf die graue Rampe zurücklegen
  var VFIX={}; VFIX[P.v2]=P.m2; VFIX[P.v3]=P.m3; VFIX[P.v4]=P.m4; VFIX[P.v5]=P.s5; VFIX[P.d3]=P.r3; VFIX[P.d2]=P.r2;
  for (var q=0;q<W*H;q++){ var cq=b.d[q]; if (VFIX[cq]!==undefined && KB[q]<KF) b.d[q]=VFIX[cq]; }
  // ---- Licht
  M.light(b,function(xx,yy){ var i4=yy*W+xx; if (OPEN[i4]) return 0; var a=-0.25+lgt(xx,yy); if (yy>FRONTY && xx>FAC.x1-10 && xx<FAC.x1+50) a-=0.15; return a; });
  if (w==='snowlie'||w==='sun') sunBeams(b);
  LASTB=b.clone();
  if (tod!=='day') b=M.finishTOD(b,tod,{sky:function(xx,yy){ return OPEN[yy*W+xx]>0; },lights:[[136,80,14,0.55,10],[300,104,70,0.35,12],[408,84,26,0.5,20],[456,30,40,0.35,16]]});
  return b; }
// schräge Lichtbahnen durch das Glasdach (klare Tage)
function sunBeams(b){ for (var y=8;y<FRONTY;y++) for (var x=FAC.x1;x<W;x++){ var i=y*W+x; if (OPEN[i]===1) continue; var u=(x-y*0.55-180)%58; if (u<0) u+=58; if (u<9 && bayer(x,y)<0.22*(1-Math.abs(u-4.5)/4.5)*(1-y/FRONTY*0.6)) b.d[i]=M.UP[b.d[i]]; } }
function hatch(b){ var y0=HATCH.y0, y1=HATCH.y1, x, y, cx=(HATCH.x0+HATCH.x1)/2;
  for (y=y0-1;y<=y1+1;y++){ var t=(y-y0)/(y1-y0), hw=(HATCH.x1-HATCH.x0)/2*(0.92+t*0.16); for (x=Math.floor(cx-hw)-1;x<=Math.ceil(cx+hw)+1;x++){ var u=(x-(cx-hw))/(2*hw), c;
      if (y===y0-1||y===y1+1||u<0||u>1) c=(y===y1+1)?P.s5:P.m2;                                                         // Winkelrahmen
      else if (u<0.05||u>0.95||y===y0||y===y1) c=(y===y0)?P.m3:P.m1;                                                    // Kante
      else if (u>0.2&&u<0.8&&t>0.18&&t<0.78){ var gx=Math.floor((x-cx)*0.9+40), gy=y-y0; c=((gx%2)===0)?P.k1:((gy%2)?P.m1:P.m2); }   // Gitter
      else { c=((x*5+y*3)%7===0)?P.m3:P.m2; if (hash(x,y)<0.08) c=P.t1; }                                                // Riffelblech, etwas Rost
      b.px(x,y,c); KB[y*W+x]=0; } }
  b.px(rnd(cx)-11,y1-1,P.k1); b.px(rnd(cx)+11,y1-1,P.k1); b.rect(rnd(cx)-2,y0+1,5,1,P.m4); }

// ---------------------------------------------------------------- Ebenen
function layers(S,GS,tod){ var w=wea(GS), L=[kioskLayer(S,tod,w),benchLayer(S,tod,w)];
  var tr=(S.tree!==false) && (GS.phase==='k4_d1'||GS.phase==='k4_d2'); if (tr) L.push(treeLayer(S,tod,w));
  return L; }

// ---------------------------------------------------------------- jedes Bild
var PIG=[[232,124],[246,130],[262,121],[420,128],[436,134],[600,0]];
function pigeon(fb,x,y,f,t,i){ var peck=Math.sin(t*2.6+i*2.1)>0.45, step=(Math.floor(t*0.9+i*1.3)%5===0)?f:0;
  function px(dx,dy,c){ var X=x+dx*f+step, Y=y+dy; if (X<0||X>=fb.w||Y<0||Y>=144) return; fb.px(X,Y,c); }
  px(-3,-3,P.m1); px(-2,-3,P.m3); px(-1,-3,P.m4); px(0,-3,P.m3); px(1,-3,P.m3); px(-2,-2,P.m2); px(-1,-2,P.k2); px(0,-2,P.m3); px(1,-2,P.m2); px(0,-1,P.m2); px(-1,0,P.t3); px(1,0,P.t3);
  if (peck){ px(2,-2,P.m2); px(3,-1,P.m3); px(4,-1,P.t4); } else { px(2,-3,P.a3); px(2,-4,P.m3); px(3,-5,P.m3); px(2,-5,P.m2); px(4,-4,P.t4); } }
function clockHM(t){ var m=13+Math.floor(t/60); return [10+Math.floor(m/60),m%60]; }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, w=wea(GS), i, x, y;
  function P2(X,Y,c){ var sx=X-cam; if (sx<0||sx>=fb.w||Y<0||Y>=144) return; fb.px(sx,Y,c); }
  // Zug atmet: Scheinwerfer und Fensterlicht flimmern sacht
  var br=(Math.sin(t*1.7)+Math.sin(t*0.53+1))*0.5; LIGHTS11.forEach(function(q,j){ var c=(br>0.3||j===2)?P.l1:P.s6; P2(q[0],q[1],c); P2(q[0]+1,q[1],c); if (j<2) P2(q[0]+2,q[1],P.s6); });
  if (DEST11[2]>0){ var txt='VERONA', tw=M.microWidth(txt), off=Math.floor((t*10)%(tw+DEST11[2])); for (var q=0;q<tw;q++){ var X=DEST11[0]+DEST11[2]-off+q; if (X<DEST11[0]||X>=DEST11[0]+DEST11[2]) continue; for (var r=0;r<3;r++) if (((q*7+r*3+Math.floor(t))%5)<3) P2(X,DEST11[1]+r,P.y4); } }
  // Prellbock-Lampen
  BUFLAMPS.forEach(function(q,j){ var on=Math.sin(t*0.8+j)>-0.6; P2(q[0],q[1],on?P.r4:P.r2); P2(q[0]+1,q[1],on?P.r3:P.r2); });
  // Weihnachtsbaum: Lichter funkeln
  var tr=(S.tree!==false) && (GS.phase==='k4_d1'||GS.phase==='k4_d2'); if (tr) LIGHTS.forEach(function(q,j){ var on=Math.sin(t*1.3+j*2.7)>0.2; P2(q[0],q[1],on?P.y5:P.y3); });
  // Bahnhofsuhr
  var hm=clockHM(t), cx=CLK.cx, cy=CLK.cy, ha=((hm[0]%12)+hm[1]/60)/12*Math.PI*2-Math.PI/2, ma=hm[1]/60*Math.PI*2-Math.PI/2;
  for (var s=0;s<=10;s++){ var u=s/2; if (u<=CLK.r-1.5) P2(rnd(cx+Math.cos(ma)*u),rnd(cy+Math.sin(ma)*u),P.k0); if (u<=CLK.r-3.5) P2(rnd(cx+Math.cos(ha)*u),rnd(cy+Math.sin(ha)*u),P.k0); }
  var sa=(t%60)/60*Math.PI*2-Math.PI/2; for (var s2=0;s2<CLK.r-1;s2++) P2(rnd(cx+Math.cos(sa)*s2),rnd(cy+Math.sin(sa)*s2),P.r3); P2(cx+rnd(Math.cos(sa)*(CLK.r-1.5)),cy+rnd(Math.sin(sa)*(CLK.r-1.5)),P.r3);
  // Abfahrtstafel: ab und zu klappert eine Zeile
  var fl=Math.floor(t/7)%DEPS.length, ph=t%7; if (ph<0.6){ var yy=BOARD.y0+10+fl*7; for (x=BOARD.x0+27;x<BOARD.x0+67;x++) for (y=yy;y<yy+5;y++) if (bayer(x,y+Math.floor(t*20))<0.5) P2(x,y,((x+y+Math.floor(t*30))%3)?P.k2:P.s4); }
  // Tauben
  if (v.tod!=='night') PIG.forEach(function(p,j){ var px=p[0]+rnd(Math.sin(t*0.33+j*1.7)*5); pigeon({w:fb.w,px:function(X,Y,c){ P2(X+cam,Y,c); }},px-cam,p[1],(Math.sin(t*0.21+j)>0)?1:-1,t,j); });
  // Schnee im Freien (Hallenende, Ausgang, Bogenfenster)
  if (w==='snow'){ for (i=0;i<130;i++){ var sp=5+hash(i,41)*8, X2=rnd(XL+((hash(i,43)*(XR-XL)+t*3+Math.sin(t*0.7+i)*4)%(XR-XL)+(XR-XL))%(XR-XL)), Y2=rnd(((t*sp+hash(i,42)*70)%70)+2); var ii=Y2*W+X2; if (Y2<H && OPEN[ii]){ P2(X2,Y2,hash(i,44)<0.4?P.s6:P.s5); if (hash(i,45)<0.25 && OPEN[ii+1]) P2(X2+1,Y2,P.s5); } }
    for (i=0;i<40;i++){ var X5=rnd(FAC.x1+((hash(i,63)*120+t*2)%120)), Y5=rnd(((t*(6+hash(i,62)*6)+hash(i,64)*110)%110)); var i5=Y5*W+X5; if (Y5<H && OPEN[i5]===2 && X5<XL) P2(X5,Y5,P.s6); }
    for (i=0;i<20;i++){ var X3=rnd(6+((hash(i,53)*38+t*3)%38)), Y3=rnd(64+((t*(9+hash(i,52)*6)+hash(i,54)*26)%26)); if (OPEN[Y3*W+X3]) P2(X3,Y3,P.s6); } }
  // Tauwetter: Tropfen an der Kante der Glasschürze
  if (w==='thaw'){ for (i=0;i<10;i++){ var X4=XL+6+rnd(hash(i,61)*140), ph2=(t*0.9+hash(i,62))%1, Y4=YOPEN+rnd(ph2*14); if (OPEN[Y4*W+X4]) P2(X4,Y4,P.s5); } }
  if (v.tod==='day' && (w==='snowlie'||w==='sun')) M.dust({w:fb.w,px:function(X,Y,c){ P2(X,Y,c); }},t,260,30,90,70,14,P.s6); }
function front(fb,v,S,GS){ var w=wea(GS); if (w==='fog') M.fogDrift(fb,v.t,{y0:16,y1:118,amt:0.3,k:2,col:P.s4,cam:v.cam,speed:4}); }

// ---------------------------------------------------------------- Geistersicht: Koffer-Strom am Bahnsteigende, Schimmer über der Luke
// alter Koffer als Umriss: kind 0 Pappkoffer mit Schnur, 1 Reisetasche, 2 Lederkoffer mit Riemen; s = Maßstab (1 = vorn)
function suitcaseShape(fb,cx,by,s,kind,a,cam){ var w=Math.max(4,rnd(s*(kind===2?13:(kind===1?11:12)))), h=Math.max(3,rnd(s*(kind===1?6:8))), x0=rnd(cx-w/2)-cam, y0=rnd(by-h), x, y;
  function px(X,Y,c,p){ if (X<0||X>=fb.w||Y<0||Y>=144) return; if (bayer(X,Y)<p) fb.px(X,Y,c); }
  for (y=y0;y<y0+h;y++) for (x=x0;x<x0+w;x++){ var edge=(x===x0||x===x0+w-1||y===y0||y===y0+h-1); if (kind===1 && (y===y0) && (x<x0+2||x>x0+w-3)) continue;
    if (edge) px(x,y,(y===y0)?P.x5:P.x4,a); else px(x,y,(kind===1)?P.v2:P.x2,a*0.4); }
  if (kind===0){ var sy=y0+rnd(h*0.45); for (x=x0;x<x0+w;x++) px(x,sy,P.x3,a); for (y=y0;y<y0+h;y++) px(x0+rnd(w*0.5),y,P.x3,a); }      // Schnur kreuzweise
  if (kind===2){ for (y=y0;y<y0+h;y++){ px(x0+rnd(w*0.28),y,P.x3,a); px(x0+rnd(w*0.72),y,P.x3,a); } px(x0+2,y0+2,P.x6,a); px(x0+w-3,y0+2,P.x6,a); }   // Riemen, Beschläge
  var hx=x0+rnd(w/2), hw=Math.max(1,rnd(s*2)); for (x=hx-hw;x<=hx+hw;x++) px(x,y0-2,P.x5,a); px(hx-hw,y0-1,P.x4,a); px(hx+hw,y0-1,P.x4,a);     // Griff
  return [x0,y0,w,h]; }
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, i, T11=TRAIN11;
  // Strom alter Koffer: kommen vom Bahnsteig 11 hinter der Lok hervor und ziehen über den Querbahnsteig zum Ausgang, getragen von niemandem
  var NS=(S && S.sepp===false)?4:9, FA=(S && S.sepp===false)?0.6:1;
  for (i=0;i<NS;i++){ var ph=(t*0.035+i/NS)%1, lane=((i*5)%3)-1, fx=lerp(208,24,ph)+lane*3, fy=lerp(103,124+lane*5,Math.min(1,ph*1.3)), step=Math.abs(Math.sin(t*3.4+i*1.9));
    var s=(fy-VP[1])/50, a=Math.min(1,Math.min(ph*7,(1-ph)*3.5))*0.95*FA; if (a<=0.03) continue;
    var r=suitcaseShape(fb,fx,rnd(fy-16*s-step*1.2),s,i%3,a,cam);
    // Hauch eines Trägers: ein paar kalte Pixel über dem Koffer
    var hx=r[0]+((i%2)?r[2]+1:-2), ht=rnd(30*s); for (var q=0;q<ht;q++){ var Y=r[1]+r[3]-q-2; if (hx>=0&&hx<fb.w&&Y>=0&&bayer(hx,Y+Math.floor(t*5))<a*0.25*(1-q/ht)) fb.px(hx,Y,P.x2); } }
  // einzelne Umrisse warten am Bahnsteigende (wie Ankommende von früher)
  [[172,111,0.95,0],[186,113,1.0,2],[150,110,0.85,1]].forEach(function(q,j){ var a=0.5+Math.sin(t*0.9+j*2)*0.18; suitcaseShape(fb,q[0],q[1],q[2],q[3],a,cam); });
  // Schimmer über der Luke: eine kalte Lichtsäule, Fäden sinken hinein, das Gitter leuchtet
  var hx0=HATCH.x0, hx1=HATCH.x1, hy0=HATCH.y0, hy1=HATCH.y1, cx=(hx0+hx1)/2, gl=0.75+Math.sin(t*1.4)*0.2;
  for (var y=hy0-34;y<hy1+1;y++) for (var x=hx0-4;x<hx1+4;x++){ var sx=x-cam; if (sx<0||sx>=fb.w||y<0||y>=144) continue; var dx=(x-cx)/((hx1-hx0)/2+2), dy=(hy1-y)/36; if (Math.abs(dx)>1||dy<0||dy>1) continue;
    var a2=(1-Math.abs(dx))*(1-dy)*gl*0.65; if (bayer(sx,y+Math.floor(t*7))<a2){ var kk=y*fb.w+sx; fb.d[kk]=M.UP[fb.d[kk]]; if (a2>0.45 && bayer(sx+2,y)<0.3) fb.d[kk]=M.UP[fb.d[kk]]; } }
  for (i=0;i<18;i++){ var ph2=(t*0.3+i/18)%1, gx=hx0+3+rnd(hash(i,71)*(hx1-hx0-6))+rnd(Math.sin(t*1.3+i)*1.2), gy=rnd(hy0-32+ph2*(hy1-hy0+30)), sx2=gx-cam; if (sx2<0||sx2>=fb.w||gy<0) continue; fb.px(sx2,gy,ph2>0.7?P.x6:(ph2>0.4?P.x5:P.x3)); if (gy-1>=0 && ph2>0.3) fb.px(sx2,gy-1,P.x2); }
  for (y=hy0;y<=hy1;y++){ var tt=(y-hy0)/(hy1-hy0), hw2=(hx1-hx0)/2*(0.92+tt*0.16); for (x=Math.floor(cx-hw2*0.6);x<=Math.ceil(cx+hw2*0.6);x++){ var s3=x-cam; if (s3<0||s3>=fb.w) continue; if (((Math.floor((x-cx)*0.9+40))%2)===0 && tt>0.18 && tt<0.78 && bayer(x,y+Math.floor(t*3))<gl) fb.px(s3,y,P.x4); } }
  for (x=hx0-3;x<hx1+3;x++){ var s2=x-cam; if (s2<0||s2>=fb.w) continue; if (bayer(x,Math.floor(t*4))<gl){ fb.px(s2,hy0-1,P.x5); fb.px(s2,hy1+1,P.x3); } } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S,GS){ if (y<112||y>140||x<6||x>554) return false;
  if (x>=KIO.x0-2 && x<=KIO.x1+2 && y<KIOSKG_Y+5) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.base+2) return false;
  if (x>=TREE.cx-13 && x<=TREE.cx+13 && y<TREE.base+3 && (!S||S.tree!==false) && GS && (GS.phase==='k4_d1'||GS.phase==='k4_d2')) return false;
  return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; return M.TINT[tod]?M.TINT[tod].a:null; }
M.defineArt('gleis11',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost, actorLut:actorLut,
  spots:{
    exit:[0,56,48,88],   // die ganze AUSGANG-Tür (Blindtest K4: vorher nur ein Streifen am Rand)
    platform:[150,64,52,44],
    sign11:[SIGN11.x0-1,SIGN11.y0-1,SIGN11.x1-SIGN11.x0+2,SIGN11.y1-SIGN11.y0+2],
    mission:[MIS.x0-4,MIS.top-13,MIS.x1-MIS.x0+8,FRONTY-MIS.top+14],
    kiosk:[KIO.x0-4,KIO.top-2,KIO.x1-KIO.x0+8,KIO.base-KIO.top+2],
    board:[BOARD.x0-1,BOARD.y0-1,BOARD.x1-BOARD.x0+2,BOARD.y1-BOARD.y0+2],
    train:[206,28,90,74],
    buffer:[212,88,40,19],
    bench:[BENCH.x0-2,BENCH.seat-14,BENCH.x1-BENCH.x0+4,BENCH.base-BENCH.seat+15],
    tree:[TREE.cx-34,TREE.base-TREE.h-2,68,TREE.h+2],
    hatch:[HATCH.x0-6,HATCH.y0-2,HATCH.x1-HATCH.x0+12,HATCH.y1-HATCH.y0+4]
  },
  stands:{ exit:[8,126,'L'], platform:[178,114,'B'], sign11:[184,115,'B'], mission:[110,114,'B'], kiosk:[386,117,'B'], board:[456,118,'B'], train:[236,114,'B'],
    buffer:[226,114,'B'], bench:[320,117,'B'], tree:[510,117,'B'], hatch:[176,128,'B'] },
  actorPos:{ sepp:[202,113,'L'], kioskg:[386,KIOSKG_Y,'F'], mala:[160,122,'R'] },
  start:[22,124,'R'], entries:{ map:[14,124,'R'], bmission:[110,115,'R'], bunker:[176,128,'R'] }
});
})(M);
