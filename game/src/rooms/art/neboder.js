/* ===== rooms/art/neboder.js — Hof von Haus 7, Alipašino Polje (640 breit, scrollend) =====
   Sozialistische Wohntürme aus Betonplatten. Links die Haltestelle „ALIPAŠINO POLJE“ der Linie 3 mit Wartehäuschen,
   Oberleitung und Gleisen, die nach hinten in den Dunst abbiegen (S.tramIn: eine Tatra K2 hält, Türen offen).
   Daneben die alte Kioskstelle: Betonplatte, vier abgesägte Stahlstümpfe, ein verrostetes Schild „KIOSK“.
   In der Mitte Haus Nr. 7: der flache Eingangsbau mit Vordach, Glastür und großer „7“, dahinter steigt der Turm auf;
   auf seinem Dach die große, rußgeschwärzte Uhr ohne Zeiger. Rechts Bank, Laterne, Spielplatz mit Klettergerüst und
   Sandkasten, am Rand des Sandkastens die eiserne Luke des Schutzraums, ganz rechts geparkte Autos (Golf, Yugo).
   Die beiden nahen Türme links und rechts sind oben angeschnitten, dahinter weitere Türme und Hügel im Dunst,
   kahle Pappeln. Nachts einzelne gelbe Fenster, bei Nebel ziehende Schwaden, bei Schnee dünne weiße Kanten,
   bei Regen glänzender Asphalt mit Pfützen. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=640, H=144, HY=96, VPX=320;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }

// Schilderschrift: Mikroschrift, der Haken über ČŠŽ und der Strich über Ć eine Zeile höher (klarer als die gestauchten Glyphen)
function sign(b,s,x,y,c){ var cx=x; String(s).toUpperCase().split('').forEach(function(ch){ var base={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'}[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') b.px(cx+1,y-1,c); else if (ch==='Ć') b.px(cx+2,y-1,c); else if (ch==='Đ') b.px(cx,y+2,c); cx+=w+1; }); return cx; }
// Regionen (wer hat welchen Pixel gemalt): für Himmelsmaske, Nebel, Licht
var REG=new Uint8Array(W*H), RG={sky:0,hill:1,far:2,t7:3,near:4,far2:5,ground:6,prop:7,glass:8,tram:9,clock:10,tree:11,lamp:12};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.micro=function(s,x,y,c){ M.microText(o,s,x,y,c); };
  return o; }

// ---------------------------------------------------------------- Licht: weiche Stufen zwischen Tageszeit-Färbung und Lampenlicht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+14, g*0.58+L*0.1+9, b*0.7+L*0.12+26]; },
  dusk:function(r,g,b){ return [r*0.8+18, g*0.58+4, b*0.66+22]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.17+16]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(t){ if (LV[t]) return LV[t]; var a=[], n=5, A=TF[t], B=TF.lamp; for (var i=0;i<n;i++){ (function(k){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],k),lerp(p[1],q[1],k),lerp(p[2],q[2],k)]; })); })(Math.pow(i/(n-1),1.1)); } return LV[t]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.4); } return s>1?1:s; }
function shade(buf,ox,oy,tod,Ls,skip){ if (tod==='day'||!TF[tod]) return; var L=levels(tod), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Lage der Dinge
var SHEL={x0:18,x1:86,top:42,base:110};             // Wartehäuschen
var POLE={x:170,base:111};                          // Haltestellenmast
var RAIL={y0:101,y1:106,x1:168};                    // Gleise (gerade bis x1, dann Bogen nach hinten)
var TRAM={x1:166,s:0.86};                           // Bahn an der Haltestelle (Kopf rechts)
var KIO={x0:178,x1:226,yb:104,yf:111};              // Kioskplatte
var VEST={x0:264,x1:396,top:52,base:106};           // Eingangsbau von Nr. 7 (zwei Stufen davor)
var DOOR7={x0:314,x1:346,top:62};                   // Glastür
var T7={x0:300,x1:364,base:98,top:28,fh:4,bay:8,seed:7,paint:P.e4};
var CLK={x:331,y:13,r:11.5};                        // Dachuhr
var NEARL={x0:24,x1:126,base:103,top:-64,fh:8,bay:12,seed:3,side:18,sd:'R',paint:P.e3};
var NEARR={x0:494,x1:596,base:103,top:-64,fh:8,bay:12,seed:5,side:18,sd:'L',paint:P.s4};
// ferne Türme: x0,x1,Fuß,Dach,Geschoss,Achse,Saat,Anstrich
var FAR2=[[196,216,94,58,2,3,31,P.s4],[262,282,94,60,2,3,32,P.b3],[426,446,94,62,2,3,33,P.e4],[560,586,94,57,2,3,34,P.t4],[0,18,94,60,2,3,35,P.s5]];
var FAR=[[0,24,95,46,3,4,19,P.s3],[146,176,95,47,3,4,11,P.y3],[176,206,96,38,3,4,12,P.s4],[232,262,95,50,3,5,13,P.t5],[372,400,95,44,3,4,14,P.b4],[400,428,96,53,3,4,15,P.s4],[440,474,95,40,3,5,16,P.e4],[598,624,95,45,3,4,17,P.s5],[618,640,96,52,3,4,18,P.t4]];
var POPLARS=[[240,105,1.0,21],[132,103,0.75,22],[420,105,1.0,23],[630,104,0.9,24]];
var BENCH={x0:446,x1:480,base:113};
var LAMP={x:488,base:113,top:30};
var CLIMB={x0:498,x1:546,base:109};
var SAND={x0:552,x1:604,yb:108,yf:117};
var HATCH={x0:604,x1:616,y0:109,y1:116};
var CARS={golf:[566,620,103],yugo:[600,648,107]};
var PLANT={x0:250,x1:278,base:143};                 // Pflanzkübel vorn (Ebene)
var PUDDLES=[[112,128,24,3.2],[236,121,16,2.2],[384,134,28,3.6],[540,125,20,2.4],[70,140,26,2.6],[300,139,14,2]];
var CACHE={};

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod,weather){ var x, y;
  if (weather==='calm' && tod==='day'){ var Rk=R('b1 b2 b3 b4 b5');
    for (y=0;y<HY+4;y++){ var v=0.06+Math.pow(y/(HY+4),1.2)*0.92; for (x=0;x<W;x++) b.px(x,y,ra(Rk,v+(vn(x*0.012,y*0.06)-0.5)*0.05,x,y)); }
    // dünne, hohe Schleier im kalten Licht
    var r=M.rng(31); for (var i=0;i<7;i++){ var cx=r()*W, cy=6+r()*30, len=50+r()*110; for (var k=0;k<len;k++){ var xx=rd(cx+k), yy=rd(cy+Math.sin(k*0.05+i)*1.4+k*0.02), a=1-Math.abs(k/len-0.5)*2; if (bayer(xx,yy)<a*0.55) b.px(xx,yy,P.b4); if (a>0.6 && bayer(xx,yy+1)<a*0.3) b.px(xx,yy+1,P.b5); } }
    return; }
  if (weather==='calm'){ var Rn=R(tod==='night'?'k0 k1 k2 n0 n1':'n1 n2 d2 d3 d4'); for (y=0;y<HY+4;y++) for (x=0;x<W;x++) b.px(x,y,ra(Rn,0.1+Math.pow(y/(HY+4),1.3)*0.85,x,y));
    if (tod==='night'){ var r2=M.rng(17); for (var s=0;s<260;s++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.6)*70), q=r2(); b.px(sx,sy,q<0.1?P.n5:(q<0.4?P.n4:P.n3)); } } return; }
  M.scn.sky(b,0,0,W,HY+4,tod,weather,23);
  // Nebel bei Nacht: das gelbe Licht der Stadt hängt unten im Grau
  if (tod==='night' && (weather==='fog'||weather==='snow')) for (y=50;y<HY+4;y++) for (x=0;x<W;x++){ var g=(y-50)/(HY-46)*(0.5+fbm(x*0.01,2)*0.6); if (bayer(x,y)<g*0.45) b.px(x,y,weather==='fog'?P.w1:P.m1); }
  if (weather==='snow') for (y=0;y<HY;y++) for (x=0;x<W;x++){ var f=fbm(x*0.02,y*0.09); if (f>0.64 && bayer(x,y)<(f-0.64)*3) b.px(x,y,M.UP[b.get(x,y)]); } }
// ferne Hügel: Mojmilo und Igman, Wald und Hänge, im Winter mit Schnee auf den Kämmen
function hillY(x){ return 72+Math.sin(x*0.011+0.6)*7+Math.sin(x*0.031+2.0)*3+(vn(x*0.05,1.7)-0.5)*4-(x>380?Math.min(12,(x-380)*0.05):0); }
function paintHills(wr,cold){ var G=R('g0 g1 g2 m1 g3 m2');
  for (var x=0;x<W;x++){ var top=rd(hillY(x)); for (var y=top;y<100;y++){ var d=(y-top)/30, f=fbm(x*0.12,y*0.3), v=0.45-d*0.2+(f-0.5)*0.6; if (y===top) v+=0.3;
      var c=ra(G,v,x,y); if (cold && y<top+3+fbm(x*0.2,4)*4 && bayer(x,y)<0.7) c=(y===top)?P.s6:P.s5; wr.px(x,y,c); }
    if (hash(x,4)<0.3){ wr.px(x,top-1,P.g1); if (hash(x,5)<0.4) wr.px(x,top-2,P.g0); } }
  var mx=556, my=rd(hillY(556)); wr.vl(mx,my-14,my,P.m1); wr.line(mx-3,my,mx,my-14,P.m1); wr.line(mx+3,my,mx,my-14,P.m1); CACHE.mast=[mx,my-15];
  for (var i=0;i<30;i++){ var hx=Math.floor(hash(i,61)*W), hy=rd(hillY(hx))+4+Math.floor(hash(i,62)*12); if (hy>94) continue; wr.rect(hx,hy,3,2,P.s3); wr.px(hx,hy-1,P.t2); wr.px(hx+1,hy-1,P.t2); } }

// ---------------------------------------------------------------- Plattenbau-Türme
var LOGC=[P.s6,P.s5,P.w1,P.m3,P.s6,P.e3];          // Rahmen verglaster Loggien (PVC weiß, Alu braun/silber)
var WASH=[P.r3,P.b3,P.s6,P.y4,P.g4,P.d4,P.c3,P.r2,P.s5,P.v3];
function colKind(o,bi){ var h=hash(bi*3+1,o.seed*7); if (o.fh<=3) return h<0.5?'W':'L'; if (bi===0||bi===o.nb-1) return 'W'; if (o.stair===bi) return 'S'; return h<0.55?'L':'W'; }
function facade(o,u,y,side){ var fh=o.fh, bay=o.bay, rel=y-o.top, fl=Math.floor(rel/fh), fy=rel-fl*fh, bi=Math.floor(u/bay), bu=u-bi*bay, kind=colKind(o,bi), cell=bi*97+fl;
  var floorNo=o.nF-1-fl;                         // 0 = Erdgeschoss
  var pr=hash(bi+o.seed*13,fl*7+3), pc=pr<0.25?P.s2:(pr<0.8?P.s3:P.s4);  // Platte
  if (o.paint && hash(bi*5+o.seed,Math.floor(fl/4))<0.45) pc=(pr<0.3)?M.DN[o.paint]:o.paint;      // renovierte, gestrichene Felder
  if (floorNo<0) return {c:P.s1};
  if (floorNo===0){ var c0=(fy===0)?P.s4:P.s1; if (fy>0 && bu>1 && bu<bay-1 && (bi%2===0)) c0=P.k2; if (bi===o.door && fy>0) return {c:(bu>0&&bu<bay)?P.n0:P.s4,win:{lit:0.9,cell:cell}}; return {c:c0}; }
  if (fy===0) return {c:side?P.s2:((bu===0)?P.s2:P.s4)};
  var gz=fh>=8?[1,4]:(fh>=4?[1,2]:[1,1]);        // Glas-/Loggiazone
  var inWin=(fy>=gz[0] && fy<=gz[1]);
  if (bu===0) return {c:P.s1};                    // Fuge zwischen Achsen
  if (kind==='S'){ if (fh>=8 && fy>=2 && fy<=5 && bu>=bay/2-1 && bu<=bay/2) return {c:P.k2,win:{lit:0.18,stair:1,cell:cell}}; return {c:pc}; }
  if (kind==='W'){ if (inWin && bu>1 && bu<bay-1){ var g=(fy===gz[0])?P.n1:P.n0; if (o.refl && (u*0.7+y)%13<2) g=o.refl; if (fh>=8 && bu===((bay>>1)|0)) g=P.s1; return {c:g,win:{lit:0.3,cell:cell}}; }
    if (fh>=8 && fy===gz[1]+1 && bu>1 && bu<bay-1) return {c:P.s4};
    return {c:pc}; }
  var lh=hash(bi*11+o.seed,fl*5+1), glazed=lh<0.28, junk=hash(bi+fl*3,o.seed+9);
  if (fh>=8){
    if (fy>=5){ if (glazed) return {c:(fy===5)?P.s5:pc}; var rail=(fy===5)?P.s4:((hash(bi,fl)<0.5)?P.m2:pc); if (fy>5 && (bu===2||bu===bay-2)) rail=P.s2; return {c:rail}; }
    if (glazed){ var fr=LOGC[Math.floor(lh*97)%LOGC.length]; if (bu<=1||bu>=bay-1||fy===1||(bu===(bay>>1))) return {c:fr}; return {c:(fy===2)?P.c2:P.c1,win:{lit:0.36,cell:cell}}; }
    if (junk<0.3 && fy>=2 && fy<=4){ var wi=Math.floor(hash(bi*7+bu,fl)*WASH.length); if ((bu+fl)%3!==0 && fy<=2+((bu*7+fl)%3)) return {c:WASH[wi]}; }
    if (junk>0.86 && fy>=3 && bu>=2 && bu<=4) return {c:(fy===3)?P.g3:P.g2};
    if (junk>0.7 && junk<0.78 && fy===4 && bu>1 && bu<bay-1) return {c:P.w1};
    if (bu>=3 && bu<=bay-3 && fy>=2) return {c:P.k2,win:{lit:0.22,loggia:1,cell:cell}};
    return {c:(fy===1)?P.k1:P.s0}; }
  if (fh>=4){ if (fy===3) return {c:glazed?P.s5:P.s4};
    if (glazed) return {c:(bu<=1||bu>=bay-1)?LOGC[Math.floor(lh*97)%LOGC.length]:P.c1,win:{lit:0.36,cell:cell}};
    if (junk<0.32 && fy===2 && bu>1 && bu<bay-1 && (bu+fl)%2===0) return {c:WASH[Math.floor(hash(bi,fl*3+bu)*WASH.length)]};
    return {c:(fy===1)?P.k1:P.s0,win:(bu>2&&bu<bay-2)?{lit:0.22,loggia:1,cell:cell}:null}; }
  if (fh>=3){ if (fy===1 && bu>0) return {c:(bu%2)?P.s1:P.m1,win:{lit:0.26,cell:cell}}; return {c:pc}; }
  if (fy===1 && bu===1) return {c:P.s1,win:{lit:0.22,cell:cell}};
  return {c:pc}; }
// Satellitenschüsseln und Klimageräte an Brüstungen (nah)
function dishes(wr,o){ var fh=o.fh, bay=o.bay;
  for (var fl=0;fl<o.nF;fl++) for (var bi=0;bi<o.nb;bi++){ var h=hash(bi*17+o.seed,fl*3+11); if (h>0.16) continue; var y=o.top+fl*fh+5, x=o.x0+bi*bay+(h<0.08?2:bay-5); if (y<2||y>o.base-12) continue;
    if (h<0.11){ wr.ellipse(x+1.5,y,2.2,1.8,P.s5); wr.px(x+2,y-1,P.s6); wr.px(x+1,y+1,P.s3); wr.px(x+3,y,P.m2); wr.px(x+2,y+2,P.m1); } else { wr.rect(x,y,4,3,P.s5); wr.hl(x,x+3,y+2,P.s3); wr.px(x+1,y+1,P.m2); } } }
// Granatsplitter-Narben: kleine dunkle Nester, ruhig, beiläufig
function scars(wr,x0,x1,y0,y1,seed,n){ for (var i=0;i<n;i++){ var cx=x0+hash(i,seed)*(x1-x0), cy=y0+hash(seed,i)*(y1-y0); for (var k=0;k<5;k++){ var px=rd(cx+(hash(i*5+k,seed+1)-0.5)*6), py=rd(cy+(hash(seed+2,i*5+k)-0.5)*4); if (px<x0||px>=x1) continue; var c=wr.get(px,py); if (c===T) continue; wr.px(px,py,k%2?M.DN[c]:M.DN[M.DN[c]]); } } }
var WINS=[], TOGGLE=[];
function tower(wr,o,reg){ var x, y, nb=Math.ceil((o.x1-o.x0)/o.bay); o.nb=nb; o.nF=Math.ceil((o.base-o.top)/o.fh); if (o.door===undefined) o.door=Math.floor(nb/2); if (o.stair===undefined) o.stair=o.fh>=8?Math.floor(nb/2)-1:-1;
  var lit=[];
  for (y=Math.max(0,o.top);y<o.base;y++) for (x=o.x0;x<o.x1;x++){ var u=x-o.x0, f=facade(o,u,y,false), c=f.c;
    var st=fbm(x*0.6,y*0.04); if (st>0.62 && !f.win) c=M.DN[c];            // Schmutzfahnen
    if (x===o.x0 && o.sd!=='L') c=M.UP[c]; if (x===o.x1-1) c=M.DN[c];
    wr.px(x,y,c); if (f.win) lit.push([x,y,f.win.lit,f.win.cell,f.win.loggia?1:(f.win.stair?2:0)]); }
  if (o.side){ var sw=o.side, so={fh:o.fh,bay:Math.max(4,Math.round(o.bay*0.8)),top:o.top,base:o.base,seed:o.seed+50,nF:o.nF,nb:3,door:-1,stair:-1,paint:o.paint};
    for (var k=0;k<sw;k++){ var t=(k+0.5)/sw, xs=o.sd==='R'?o.x1+k:o.x0-1-k, s=1-0.16*t;
      for (y=0;y<o.base+2;y++){ var y0=HY+(y-HY)/s; if (y0<o.top||y0>=o.base) continue; var f2=facade(so,t*sw*1.2,Math.floor(y0),true), c2=M.DN[f2.c]; if (o.sd==='L') c2=M.UP[c2]; if (k===sw-1) c2=M.DN[c2]; wr.px(xs,y,c2); if (f2.win) lit.push([xs,y,f2.win.lit,5000+f2.win.cell,f2.win.loggia?1:0]); } } }
  lit.forEach(function(p){ WINS.push([p[0],p[1],hash(p[3]*1.37+0.5,o.seed*3.1),p[2],reg,p[4]]); });
  return o; }
function towerRoof(wr,o){ var y=o.top, x;
  wr.hl(o.x0-1,o.x1,y-1,P.s4); wr.hl(o.x0-1,o.x1,y-2,P.s3); for (x=o.x0;x<o.x1;x+=3) wr.px(x,y-3,P.s2);
  var r=M.rng(o.seed*3+1);
  for (var i=0;i<3;i++){ var bx=o.x0+2+Math.floor(r()*(o.x1-o.x0-8)), bw=3+Math.floor(r()*4), bh=2+Math.floor(r()*3); wr.rect(bx,y-2-bh,bw,bh,P.s2); wr.hl(bx,bx+bw-1,y-2-bh,P.s3); }
  for (i=0;i<2;i++){ var ax=o.x0+3+Math.floor(r()*(o.x1-o.x0-6)), ah=4+Math.floor(r()*6); wr.vl(ax,y-2-ah,y-2,P.m1); wr.hl(ax-1,ax+1,y-ah,P.m1); } }

// ---------------------------------------------------------------- Haus 7 und seine Uhr
function clockMarks(){ var cx=CLK.x, cy=CLK.y, out={dots:[],nums:[]};
  for (var i=0;i<12;i++){ if (i%3===0) continue; var a=i/12*Math.PI*2-Math.PI/2; out.dots.push([rd(cx-0.5+Math.cos(a)*8),rd(cy-0.5+Math.sin(a)*8)]); }
  out.nums=[['12',cx-4,cy-9],['3',cx+5,cy-3],['6',cx-2,cy+4],['9',cx-8,cy-3]]; return out; }
var SKYB=null;
function paintClock(wr){ var cx=CLK.x, cy=CLK.y, r=CLK.r, x, y, base=T7.top-2;
  // Gerüst: zwei Stahlbeine mit Kreuzstreben, Wartungsleiter, Kasten für die alte Leuchtröhre
  [cx-7,cx+6].forEach(function(lx){ wr.vl(lx,cy+2,base,P.m1); wr.vl(lx+1,cy+4,base,P.k2); });
  wr.line(cx-7,base,cx+6,cy+r-2,P.m0); wr.line(cx+7,base,cx-6,cy+r-2,P.m0); wr.hl(cx-10,cx+10,base,P.m1);
  for (y=cy;y<base;y+=2) wr.px(cx+r+1,y,P.m1); wr.vl(cx+r+2,cy-2,base,P.m0);
  wr.rect(cx-5,cy-r-2,10,3,P.m0); wr.hl(cx-5,cx+4,cy-r-2,P.m1);
  // Zifferblatt: dicker Stahlring (oben links Licht, Rostflecken), rußschwarze Scheibe mit hellen Regenfahnen
  for (y=Math.floor(cy-r-1);y<=Math.ceil(cy+r+1);y++) for (x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++){ var dx=x+0.5-cx, dy=y+0.5-cy, d=Math.hypot(dx,dy); if (d>r+0.5) continue;
    var c, li=-(dx*0.7+dy*0.75)/Math.max(1,d);
    if (d>r-1.6){ c=li>0.35?P.m3:(li>-0.2?P.m1:P.k2); if (hash(x*3,y)<0.22) c=P.t1; if (d>r-0.4 && li>0.5) c=P.m4; }
    else if (d>r-2.5) c=P.k1;
    else { var streak=fbm(x*0.9,y*0.07), soot=fbm(x*0.3,y*0.4)*0.6+(cy-y)/r*0.25; c=soot>0.42?P.k1:(soot>0.28?P.k2:P.m0); if (streak>0.62) c=(streak>0.7)?P.m1:M.UP[c]; if (hash(x*5,y*7)<0.03) c=P.s1; }
    wr.px(x,y,c); REG[y*W+x]=RG.clock; }
  // Stundenstriche und vier Ziffern: noch zu erkennen, kaum noch zu lesen
  for (var i=0;i<12;i++){ var a=i/12*Math.PI*2-Math.PI/2, ex=Math.cos(a), ey=Math.sin(a); if (i%3===0) continue; wr.px(rd(cx-0.5+ex*8.2),rd(cy-0.5+ey*8.2),P.m2); wr.px(rd(cx-0.5+ex*9.2),rd(cy-0.5+ey*9.2),P.m3); }
  var mk=clockMarks(); mk.nums.forEach(function(n){ M.microText(wr,n[0],n[1],n[2],P.m2); });
  wr.px(cx,cy,P.m3); wr.px(cx-1,cy,P.m2); wr.px(cx,cy+1,P.k1);                 // Achse, ohne Zeiger
  // Rußfahnen am Dach darunter
  for (x=T7.x0+14;x<T7.x0+50;x++){ var len=3+Math.floor(fbm(x*0.4,3)*12); for (y=T7.top;y<T7.top+len;y++){ var cc=wr.get(x,y); if (cc!==T && bayer(x,y)<0.6-(y-T7.top)/(len+4)) wr.px(x,y,M.DN[M.DN[cc]]); } } }
function paintT7(wr){ tower(wr,T7,RG.t7); towerRoof(wr,T7);
  // große aufgemalte Hausnummer an der Stirnseite
  var nx=T7.x1-12, ny=T7.top+5; wr.rect(nx-1,ny-1,9,11,P.s5); wr.hl(nx-1,nx+7,ny-1,P.s6); M.big(wr,'7',nx+3,ny+1,P.b0,1,false); wr.hl(nx-1,nx+7,ny+9,P.s2);
  scars(wr,T7.x0,T7.x1,T7.top+4,60,71,9);
  paintClock(wr); }

// ---------------------------------------------------------------- Boden: Bahnsteig, Asphalt, Plattenweg zur Tür, Rasen, Laub
function gUV(x,y){ var d=Math.max(0.5,y-HY+0.5); return {z:232/d, X:(x-VPX)*1.074/d}; }
function asphalt(x,y){ var q=gUV(x,y), f=fbm(q.X*0.5+3,q.z*0.7), g=fbm(q.X*2.2,q.z*2.6), c=ra(R('m1 s1 m2 s2'),0.3+f*0.5+(g-0.5)*0.3,x,y);
  var ix=Math.floor(q.X/2.4+7), iz=Math.floor(q.z/1.6); if (hash(ix,iz)<0.12 && fbm(q.X,q.z)>0.45) c=M.DN[c];          // Flicken
  if (hash(x,y)<0.03) c=P.s3; return c; }
function slabs(x,y,sx,sz,ramp){ var q=gUV(x,y), u=q.X/sx, v=q.z/sz, iu=Math.floor(u+(Math.floor(v)&1)*0.5), iv=Math.floor(v), fu=u+(iv&1)*0.5-iu, fv=v-iv, ex=0.035*(y-HY)/12+0.02;
  if (fv>1-0.11 || fu<ex*1.2) return ramp[0]; var t=hash(iu,iv), c=t<0.3?ramp[1]:(t<0.85?ramp[2]:ramp[3]); if (fbm(x*0.1,y*0.5)>0.66) c=M.DN[c]; if (t>0.94 && fv<0.4) c=ramp[0]; return c; }
function grass(x,y){ var q=gUV(x,y), f=fbm(q.X*1.5,q.z*1.5), c=f<0.35?P.e1:(f<0.55?P.e2:(f<0.72?P.g2:P.e3)); if (hash(x,y)<0.08) c=P.g3; if (hash(x*3,y)<0.04) c=P.t2; return c; }
function onPath(x,y){ var q=gUV(x,y); return y>=110 && Math.abs(q.X-(330-VPX)*1.074/14.5)<1.5; }
function paintGround(wr){ var x, y, PR=R('s1 s2 s3 s4'), AR=R('s2 s3 s4 s5');
  for (y=94;y<H;y++) for (x=0;x<W;x++){ var c;
    if (y<108){ c=grass(x,y); if (y<99 && hash(x>>1,y)<0.55) c=(hash(x,y)<0.5)?P.g1:P.g0; }                 // Hecken am Fuß der Türme, Rasen
    else if (y<111){ c=(y===108)?P.s5:((y===109)?P.s3:P.s1); }                                                // Bordstein
    else if (x<210 && y<121){ c=slabs(x,y,1.0,1.0,PR); }                                                      // Bahnsteig
    else if (onPath(x,y)) c=slabs(x,y,0.6,0.6,AR);
    else c=asphalt(x,y);
    wr.px(x,y,c); }
  // Kante Bahnsteig / Gehweg und Wegränder
  for (x=0;x<210;x++){ wr.px(x,121,P.s4); wr.px(x,122,P.s1); }
  for (y=110;y<H;y++) for (x=260;x<420;x++){ if (onPath(x,y)!==onPath(x-1,y)) wr.px(x,y,P.s1); }
  // Rasenstreifen vorn links und rechts
  for (y=126;y<H;y++) for (x=0;x<W;x++){ var inL=(x<170 && y>137-((x*0.05)|0)), inR=(x>520 && y>131+((x-520)*0.05)); if (!inL && !inR) continue; wr.px(x,y,grass(x,y)); var top=inL?Math.ceil(137-x*0.05):Math.ceil(131+(x-520)*0.05); if (y===top+1) wr.px(x,y,P.s3); if (y===top+2) wr.px(x,y,P.s1); }
  // Laub: vor dem Haus zusammengekehrt, unter den Pappeln dichter, sonst verstreut
  var r=M.rng(77), LC=[P.y2,P.t3,P.y3,P.t2,P.e3,P.y1];
  for (var i=0;i<320;i++){ var lx=Math.floor(r()*W), ly=111+Math.floor(r()*33); var near=POPLARS.some(function(p){ return Math.abs(p[0]-lx)<30; }); if (!near && r()<0.45) continue; if (Math.abs(lx-330)<70 && ly<130 && r()<0.7) continue; wr.px(lx,ly,LC[Math.floor(r()*LC.length)]); if (r()<0.3) wr.px(lx+1,ly,LC[Math.floor(r()*LC.length)]); }
  for (i=0;i<90;i++){ var a=r()*Math.PI*2, rr=Math.sqrt(r()), px=rd(292+Math.cos(a)*10*rr), py=rd(129+Math.sin(a)*3*rr-(1-rr)*2); wr.px(px,py,LC[Math.floor(r()*LC.length)]); }
  // Gullydeckel, Risse, Kronkorken
  wr.ellipse(222,132,6,1.8,P.m1); wr.hl(218,226,132,P.k2); wr.hl(219,225,131,P.m2); wr.hl(219,225,133,P.m2);
  wr.line(370,124,392,128,P.k2); wr.line(392,128,404,127,P.k2); wr.line(440,136,470,139,P.k2); wr.line(140,126,156,129,P.k2); }

// ---------------------------------------------------------------- Gleise, Oberleitung
function railCurve(t){ var x=RAIL.x1+t*92, k=1-t*0.82; return {x:x,y0:HY+(RAIL.y0-HY)*k+t*0.4, y1:HY+(RAIL.y1-HY)*k}; }
function paintRails(wr){ var x, y;
  for (y=RAIL.y0-1;y<=RAIL.y1+1;y++) for (x=0;x<RAIL.x1;x++){ var c=(hash(x>>1,y)<0.5)?P.m1:P.m2; if (y===RAIL.y0||y===RAIL.y1) c=P.m4; if (y===RAIL.y0+1||y===RAIL.y1+1) c=P.k2; wr.px(x,y,c); }
  for (var i=0;i<=60;i++){ var t=i/60, q=railCurve(t), xa=rd(q.x); for (y=Math.floor(q.y0)-1;y<=Math.ceil(q.y1);y++) wr.px(xa,y,(hash(xa,y)<0.5)?P.m1:P.m2); wr.px(xa,rd(q.y0),P.m4); wr.px(xa,rd(q.y1),P.m4); wr.px(xa+1,rd(q.y1),P.m3); }
  [[52,RAIL.y0-2],[150,RAIL.y0-2]].forEach(function(m){ var mx=m[0], my=m[1]; wr.rect(mx,my-80,2,80,P.m1); wr.vl(mx,my-80,my,P.m2); wr.hl(mx-2,mx+3,my,P.m0); wr.line(mx,my-77,mx+34,my-75,P.m1); wr.line(mx+1,my-72,mx+30,my-75,P.m0); });
  for (x=0;x<RAIL.x1+92;x++){ var yw=x<=RAIL.x1?24+Math.sin(x*0.034)*1.2:HY+(24-HY)*(1-(x-RAIL.x1)/92*0.82); wr.px(x,rd(yw),P.k2); if (x%40===12 && x<RAIL.x1) wr.vl(x,rd(yw)-3,rd(yw),P.m0); }
  for (x=0;x<RAIL.x1+80;x++){ var yw2=x<=RAIL.x1?21+Math.sin(x*0.034+0.7):HY+(21-HY)*(1-(x-RAIL.x1)/92*0.82); if (bayer(x,rd(yw2))<0.7) wr.px(x,rd(yw2),P.m1); } }

// ---------------------------------------------------------------- Straßenbahn Tatra K2 an der Haltestelle (rot, cremefarbenes Fensterband)
function paintTram(wr){ var s=TRAM.s, x1=TRAM.x1, bot=RAIL.y1-1, Ht=Math.round(80*s), top=bot-Ht, winT=top+Math.round(Ht*0.2), winB=top+Math.round(Ht*0.55), L=Math.round(552*s), sec=Math.round(270*s), x0=x1-L, x, y;
  var RED=R('r1 r2 r3 r4'), CR=R('s3 s4 s5 s6'), GL=R('k1 n0 n1 n2'), out={x0:x0,x1:x1,top:top,bot:bot,winT:winT,winB:winB,lit:[]};
  var joint=[x0+sec,x0+sec+Math.round(12*s)], nose=Math.round(30*s);
  for (x=Math.max(0,x0);x<=x1;x++){ var fu=x1-x, inJ=(x>=joint[0]&&x<joint[1]);
    var r0=fu<nose?Math.round(Math.pow(1-fu/nose,2)*Ht*0.2):0, t0=top+r0;
    for (y=t0;y<bot;y++){ var c;
      if (inJ){ c=(((y>>1)+x)&1)?P.k2:P.m1; if (y<top+3) c=P.k1; wr.px(x,y,c); continue; }
      if (y===t0) c=P.m4; else if (y<winT-2) c=ra(R('m2 m3 m4'),1-(y-t0)/Math.max(1,winT-t0),x,y);
      else if (y<winT) c=CR[3];
      else if (y<winB){ var su=(x-x0)%Math.round(32*s), post=(su<=1); c=post?CR[2]:GL[(y-winT)<2?0:((x*0.6+y)%11<2?3:1)]; if (!post && y-winT===1) c=GL[2]; if (!post) out.lit.push([x,y]);
        if (fu<Math.round(22*s)){ c=((y-winT)<2)?P.n1:P.k1; if ((x+y)%7<2) c=P.n2; } }
      else if (y<winB+3) c=(y===winB+2)?CR[2]:CR[3];
      else { c=RED[(y>bot-5)?0:((y===winB+3)?2:1)]; if ((x-x0)%Math.round(90*s)===0) c=RED[0]; if (y>bot-8 && y<bot-5 && ((x-x0)%Math.round(45*s))<2) c=P.m1; }
      if (fu===0) c=M.DN[c]; wr.px(x,y,c); } }
  // Türen (offen: dunkle Öffnung, Stufen, Licht drinnen)
  var doors=[x0+Math.round(60*s),x0+sec-Math.round(42*s),x0+sec+Math.round(80*s),x1-Math.round(84*s)]; out.doors=[];
  doors.forEach(function(dx){ var dw=Math.round(26*s); if (dx+dw<0) return; out.doors.push(dx+dw/2);
    for (x=dx;x<dx+dw;x++) for (y=winT-1;y<bot;y++){ var c=(y>bot-7)?((y===bot-7||y===bot-4)?P.s3:P.k1):P.k1; if (x===dx||x===dx+dw-1) c=P.m1; if (y<winB && x>dx+1 && x<dx+dw-2 && (x+y)%11===0) c=P.k2; wr.px(x,y,c); if (y<bot-7 && x>dx+3 && x<dx+dw-4) out.lit.push([x,y]); }
    wr.vl(dx+1,winT,bot-2,P.r2); wr.vl(dx+2,winT,bot-2,P.r1); wr.vl(dx+dw-2,winT,bot-2,P.r2); wr.vl(dx+dw-3,winT,bot-2,P.r1);
    wr.vl(dx+(dw>>1),winT+2,winB-2,P.m3); wr.hl(dx+3,dx+dw-4,winT+((winB-winT)>>1),P.m3); });
  // Seitliche Zielanzeige hinter der ersten Scheibe, Liniennummer am Kopf, Scheinwerfer
  var sx=x1-78, sy=winT+2, sw=M.microWidth('3 BASCARSIJA')+4; wr.rect(sx,sy,sw,9,P.k1); wr.hl(sx,sx+sw-1,sy,P.m1); sign(wr,'3 BAŠČARŠIJA',sx+2,sy+3,P.y3); out.sign=[sx,sy,sw];
  wr.rect(x1-11,top+3,8,7,P.k1); M.microText(wr,'3',x1-8,top+4,P.y4); out.num=[x1-11,top+3];
  wr.rect(x1-3,bot-14,3,3,P.s5); wr.px(x1-2,bot-13,P.s6); out.head=[x1-2,bot-13];
  wr.hl(x1-18,x1,bot-6,P.m3); wr.hl(x1-18,x1,bot-5,P.m1);
  M.microText(wr,'714',x0+sec+Math.round(150*s),winB+5,P.s5);
  [x0+Math.round(46*s),x0+sec-Math.round(46*s),x0+sec+Math.round(60*s),x1-Math.round(48*s)].forEach(function(cx){ wr.rect(cx-12,bot,26,RAIL.y1-bot+1,P.k1); wr.ellipse(cx-6,bot+2,3,3,P.k2); wr.ellipse(cx+7,bot+2,3,3,P.k2); wr.px(cx-6,bot+1,P.m2); wr.px(cx+7,bot+1,P.m2); });
  var ph=top-25; [x0+Math.round(150*s),x0+sec+Math.round(150*s)].forEach(function(pc){ if (pc<-10||pc>x1) return; wr.line(pc-9,top,pc,top-ph+1,P.k1); wr.line(pc+9,top,pc,top-ph+1,P.k1); wr.line(pc-5,top,pc+3,top-ph/2,P.k2); wr.hl(pc-6,pc+6,25,P.m1); wr.rect(pc-3,top-2,7,2,P.m1); });
  return out; }

// ---------------------------------------------------------------- Wartehäuschen, Mast, Kioskstelle
function paintShelter(wr){ var x0=SHEL.x0, x1=SHEL.x1, top=SHEL.top, base=SHEL.base, x, y;
  for (y=top+6;y<base-6;y++) for (x=x0+2;x<x1-2;x++){ var c=wr.get(x,y); if (c===T) continue; var g=M.mix(c,P.c3,2); if (((x*0.6+y)%19)<1.2) g=P.s4; wr.px(x,y,g); }
  [x0,x0+22,x0+45,x1-2].forEach(function(px){ wr.rect(px,top+4,2,base-top-4,P.m1); wr.vl(px,top+4,base-1,P.m3); });
  wr.hl(x0,x1-1,base-22,P.m1); wr.hl(x0,x1-1,top+6,P.m1);
  // Werbetafel (erfunden: Kaffee), Fahrplan
  wr.rect(x0+48,top+12,16,28,P.s5); wr.rect(x0+49,top+13,14,18,P.w1); wr.ellipse(x0+56,top+22,4,3,P.w3); wr.rect(x0+53,top+19,6,2,P.s6); M.microText(wr,'KAFA',x0+49,top+33,P.r2); wr.hl(x0+49,x0+62,top+39,P.r2);
  wr.rect(x0+4,top+14,12,16,P.s6); for (y=top+19;y<top+29;y+=2) wr.hl(x0+5,x0+14,y,P.m2); M.microText(wr,'3',x0+6,top+15,P.r2);
  wr.rect(x0-4,top-2,x1-x0+8,5,P.m2); wr.hl(x0-4,x1+3,top-2,P.m4); wr.hl(x0-4,x1+3,top+2,P.m0); wr.hl(x0-4,x1+3,top+3,P.k2);
  var nm='ALIPAŠINO POLJE', nw=M.microWidth('ALIPASINO POLJE')+6, nx=rd((x0+x1)/2-nw/2); wr.rect(nx,top-11,nw,9,P.b0); wr.hl(nx,nx+nw-1,top-11,P.b2); wr.hl(nx,nx+nw-1,top-3,P.k2); sign(wr,nm,nx+3,top-8,P.s6);
  wr.vl(nx+6,top-3,top-2,P.m1); wr.vl(nx+nw-7,top-3,top-2,P.m1);
  wr.rect(x0+6,base-14,44,3,P.w3); wr.hl(x0+6,x0+49,base-14,P.w4); wr.hl(x0+6,x0+49,base-12,P.w1); [x0+9,x0+46].forEach(function(lx){ wr.rect(lx,base-11,2,11,P.m1); });
  wr.rect(x1+2,base-12,7,12,P.g2); wr.hl(x1+2,x1+8,base-12,P.g4); wr.rect(x1+1,base-14,9,2,P.m2); wr.hl(x1+3,x1+7,base-6,P.g1);
  CACHE.tube=[x0+8,x1-8,top+4]; CACHE.shelTop=top-2; }
function paintPole(wr){ var x=POLE.x, by=POLE.base, top=by-72;
  wr.rect(x,top,2,by-top,P.m2); wr.vl(x,top,by-1,P.m3); wr.rect(x-1,by-3,4,3,P.m0);
  // Haltestellenschild: blau mit Straßenbahn-Piktogramm und Linie 3, darunter der Fahrplan
  wr.rect(x-7,top-14,16,14,P.b0); wr.hl(x-7,x+8,top-14,P.b2); wr.rect(x-5,top-11,12,5,P.s6); wr.hl(x-5,x+6,top-7,P.s4); wr.px(x-3,top-6,P.s6); wr.px(x+4,top-6,P.s6); wr.line(x+1,top-11,x+3,top-13,P.s6); wr.micro('3',x-1,top-5,P.y4);
  wr.rect(x-6,top+2,15,12,P.s5); for (var yy=top+4;yy<top+13;yy+=2) wr.hl(x-5,x+7,yy,P.m2); wr.micro('3',x-5,top+3,P.r2); }
function paintKiosk(wr){ var x0=KIO.x0, x1=KIO.x1, yb=KIO.yb, yf=KIO.yf, x, y;
  wr.poly([[x0+4,yb],[x1-2,yb],[x1+2,yf-2],[x0,yf-2]],function(x,y){ var c=(hash(x>>1,y)<0.4)?P.s2:P.s3; if (fbm(x*0.3,y*0.6)>0.66) c=P.g2; return c; });
  wr.rect(x0,yf-2,x1-x0+3,3,P.s2); wr.hl(x0,x1+2,yf-2,P.s4); wr.hl(x0,x1+2,yf,P.s1); wr.line(x0+20,yb+1,x0+27,yf-3,P.s1);
  [[x0+8,yf-4],[x1-8,yf-4],[x0+12,yb+1],[x1-10,yb+1]].forEach(function(p,i){ var hh=i<2?4:3; wr.rect(p[0],p[1]-hh,3,hh,P.t1); wr.px(p[0],p[1]-hh,P.m3); wr.px(p[0]+1,p[1]-hh,P.t3); wr.px(p[0]+2,p[1]-hh,P.m2); wr.vl(p[0]+2,p[1]-hh+1,p[1]-1,P.t0); });
  var sx=x1-24, sy=yf-16; for (y=0;y<10;y++) for (x=0;x<22;x++){ var X=sx+x+Math.round(y*0.3), Y=sy+y; var c=M.rampAt(R('t0 t1 t2 y2'),0.5+fbm(X*0.4,Y*0.5)*0.6-y*0.03,X,Y); if (y===0||x===0) c=P.t2; if (x===21||y===9) c=P.t0; wr.px(X,Y,c); }
  wr.micro('KIOSK',sx+3,sy+3,P.s4); for (x=sx+3;x<sx+20;x++) if (hash(x,9)<0.35) wr.px(x,sy+5,P.t1);
  wr.px(sx+12,sy+11,P.k2); wr.px(sx+13,sy+11,P.k2);
  wr.px(x0+16,yf-3,P.m3); wr.px(x0+30,yf-5,P.y3); wr.rect(x0-6,yf+3,7,3,P.s4); wr.hl(x0-6,x0,yf+4,P.m2); }

// ---------------------------------------------------------------- Eingangsbau von Haus 7
// was man durch das Glas in der Halle sieht (Tagesfarben; nachts hell in 'after')
function hallAt(x,y,lit){ var v=VEST, c, g0=v.top+9;
  if (y<g0+5) c=lit?P.s5:P.s1;                                       // Decke
  else if (y<v.base-20) c=lit?P.s5:P.s2;                             // Wand
  else if (y<v.base-9) c=lit?((bayer(x,y)<0.5)?P.g5:P.s4):((bayer(x,y)<0.5)?P.g1:P.m1);      // hellgrüner Ölsockel
  else c=((x>>2)+(y>>1))%2?(lit?P.s4:P.s1):(lit?P.s3:P.s0);          // Terrazzo
  if (y===g0+2 && x>v.x0+44 && x<v.x0+76) c=lit?P.l1:P.m3;           // Neonröhre
  if (x>v.x0+14 && x<v.x0+42 && y>g0+10 && y<g0+24){ c=((x-v.x0)%5===0||(y-g0)%5===0)?(lit?P.m2:P.k2):(lit?P.m4:P.m1); }   // Briefkästen
  if (x>v.x1-44 && x<v.x1-12){ var sy=v.base-9-Math.floor((x-(v.x1-44))*0.9); if (y>sy && y<sy+3) c=lit?P.s4:P.s1; if (y===sy-12) c=lit?P.w4:P.w1; }   // Treppe mit Handlauf
  return c; }
function paintVest(wr){ var x0=VEST.x0, x1=VEST.x1, top=VEST.top, base=VEST.base, x, y, d0=DOOR7.x0, d1=DOOR7.x1, dt=DOOR7.top, g0=top+9;
  // Glasfront: drinnen die Halle (bei Tag dunkel), draußen spiegeln sich Himmel und Türme
  for (y=g0;y<base;y++) for (x=x0+8;x<x1-8;x++){ var c=hallAt(x,y,false), rf=(x*0.5+y)%29; if (rf<1.6) c=P.s4; else if (rf<3 && bayer(x,y)<0.5) c=P.c3; else if (y<g0+14 && bayer(x,y)<0.3) c=P.c2; wr.px(x,y,c); REG[y*W+x]=RG.glass; }
  for (x=x0+8;x<x1-8;x+=16){ wr.rect(x,g0,2,base-g0,P.m2); wr.vl(x,g0,base-1,P.m4); }
  wr.hl(x0+8,x1-9,g0+14,P.m2); wr.hl(x0+8,x1-9,base-11,P.m2);
  [[x0+44,g0+18,7,9],[x0+53,g0+20,6,7],[x1-38,g0+17,8,10]].forEach(function(n){ wr.rect(n[0],n[1],n[2],n[3],P.s5); wr.hl(n[0]+1,n[0]+n[2]-2,n[1]+2,P.m2); wr.hl(n[0]+1,n[0]+n[2]-3,n[1]+4,P.m2); wr.hl(n[0]+1,n[0]+n[2]-2,n[1]+6,P.m2); wr.px(n[0]+1,n[1],P.s3); });
  for (y=top;y<base;y++){ for (x=x0;x<x0+8;x++) wr.px(x,y,(hash(x,y)<0.3)?P.s2:P.s3); for (x=x1-8;x<x1;x++) wr.px(x,y,(hash(x,y)<0.3)?P.s1:P.s2); }
  wr.rect(x0,base-4,x1-x0,4,P.s2); wr.hl(x0,x1-1,base-4,P.s3);
  // Glastür (Doppeltür, Aluminiumrahmen, Griffstangen), Klingeltableau, Emailschild mit der Hausnummer
  wr.rect(d0-2,dt-2,d1-d0+4,base-dt+2,P.m1); for (y=dt;y<base-1;y++) for (x=d0;x<d1;x++){ var cc=hallAt(x,y,false); if ((x*0.6+y)%17<1.4) cc=P.s4; wr.px(x,y,cc); REG[y*W+x]=RG.glass; }
  wr.vl((d0+d1)>>1,dt,base-2,P.m3); wr.vl(d0,dt,base-2,P.m3); wr.vl(d1-1,dt,base-2,P.m3); wr.hl(d0,d1-1,dt,P.m3); wr.hl(d0,d1-1,base-2,P.m2); wr.hl(d0,d1-1,dt+24,P.m2);
  wr.vl(((d0+d1)>>1)-3,dt+16,dt+27,P.m4); wr.vl(((d0+d1)>>1)+3,dt+16,dt+27,P.m4);
  wr.rect(d1+5,dt+14,7,14,P.m2); for (y=dt+16;y<dt+27;y+=2){ wr.px(d1+7,y,P.s5); wr.px(d1+9,y,P.s5); } wr.hl(d1+5,d1+11,dt+14,P.m3);
  wr.rect(d0-12,dt+8,8,8,P.b1); wr.hl(d0-12,d0-5,dt+8,P.b3); wr.micro('7',d0-10,dt+10,P.s6);
  // Vordach: Betonplatte, auf der Stirn die Hausnummer, zwei Stützen; die Dachkante ist zugleich das Dach des Eingangsbaus
  wr.rect(x0-6,top,x1-x0+12,9,P.s4); wr.hl(x0-6,x1+5,top,P.s5); wr.hl(x0-6,x1+5,top+7,P.s3); wr.hl(x0-6,x1+5,top+8,P.s1); wr.hl(x0-4,x1+3,top+9,P.k2);
  var nw=M.textWidth('7')+8, nx=((d0+d1)>>1)-(nw>>1); wr.rect(nx,top+1,nw,7,P.b0); wr.hl(nx,nx+nw-1,top+1,P.b2); M.text(wr,'7',nx+4,top+1,P.s6); CACHE.big7=[nx,top+1,nw];
  [x0+4,x1-6].forEach(function(px){ wr.rect(px,top+9,3,base-top-9,P.s3); wr.vl(px,top+9,base-1,P.s4); wr.vl(px+2,top+9,base-1,P.s1); });
  wr.rect(((d0+d1)>>1)-3,top+9,6,2,P.s5); CACHE.vlamp=[(d0+d1)>>1,top+11];
  // zwei Stufen vor der Tür, Fußabtreter, ein altes kleines Graffito am Sockel
  for (y=base;y<base+5;y++) for (x=d0-14;x<d1+14;x++){ var st=y<base+2?0:1, c2=(y===base||y===base+2)?P.s4:(st?P.s2:P.s3); if (x===d0-14||x===d1+13) c2=P.s1; wr.px(x,y,c2); }
  wr.hl(d0-14,d1+13,base+5,P.s1);
  wr.rect(d0+2,base-1,d1-d0-4,2,P.e1); wr.hl(d0+2,d1-3,base-1,P.e2);
  M.microText(wr,'FK',x0+12,base-10,P.r2); wr.line(x1-30,base-9,x1-18,base-11,P.b2);
  CACHE.vest=[x0,x1,top,base]; }

// ---------------------------------------------------------------- Pappeln (kahl, ein paar gelbe Blätter), Bank, Laterne
function poplar(wr,x,base,sc,seed){ var hgt=Math.round(165*sc), cw=Math.round(12*sc)+2, cb=base-Math.round(hgt*0.17), ct=base-hgt, r=M.rng(seed), y, k, i;
  // feiner Zweigschleier in Spindelform
  for (y=Math.max(0,ct);y<cb+6;y++){ var t=(y-ct)/(cb-ct), half=cw*Math.pow(Math.sin(Math.min(1,t)*Math.PI*0.92+0.08),0.8);
    for (var xx=Math.floor(x-half);xx<=Math.ceil(x+half);xx++){ var u=Math.abs(xx-x)/Math.max(1,half), dn=0.42*(1-u*u)+0.05; var tw=fbm(xx*0.9+seed,y*0.22); if (bayer(xx,y)<dn && tw>0.42) wr.px(xx,y,(tw>0.62)?P.k2:P.w0); } }
  // aufstrebende Äste
  for (i=0;i<70;i++){ var t0=0.04+r()*0.92, sy=cb-t0*(cb-ct), side=r()<0.5?-1:1, maxLen=(1-Math.abs(t0-0.4)*1.2)*hgt*0.34+5, ang=side*(0.28+r()*0.32), px=x, py=sy;
    for (var s=0;s<maxLen;s++){ var a=ang*(1-s/maxLen*0.75); px+=Math.sin(a); py-=Math.cos(a); var X=rd(px), Y=rd(py); if (Y<0) break; if (Math.abs(X-x)>cw+1) break; wr.px(X,Y,(s<maxLen*0.35)?P.w1:((s%4===0)?P.w0:P.k2)); if (r()<0.035) wr.px(X+side,Y,[P.y3,P.y2,P.t3,P.y4][Math.floor(r()*4)]); } }
  // Stamm: graue, rissige Rinde
  for (y=base;y>ct+hgt*0.3;y--){ var tt=(base-y)/hgt, w=Math.max(1,Math.round((1-tt)*2.4*sc+0.4)); for (k=-w;k<=w;k++){ var c=k<0?P.s1:(k===w?P.k2:P.m0); if (hash(x+k,y)<0.15) c=P.s2; if (((y+k*3)%7)===0) c=P.k2; wr.px(x+k,y,c); } }
  wr.hl(x-4,x+4,base,P.e1); }
function paintBench(wr){ var x0=BENCH.x0, x1=BENCH.x1, by=BENCH.base;
  for (var s=0;s<2;s++){ var y=by-20+s*4; wr.rect(x0,y,x1-x0,3,P.g2); wr.hl(x0,x1-1,y,P.g3); wr.hl(x0,x1-1,y+2,P.g1); }
  wr.rect(x0-1,by-11,x1-x0+2,3,P.g2); wr.hl(x0-1,x1,by-11,P.g4); wr.hl(x0-1,x1,by-9,P.g1);
  [x0+2,x1-4].forEach(function(lx){ wr.rect(lx,by-22,2,22,P.k2); wr.vl(lx,by-22,by-1,P.m1); wr.rect(lx-1,by-1,4,1,P.k1); });
  wr.px(x0+9,by-18,P.s1); wr.px(x0+21,by-14,P.y3); for (var i=0;i<4;i++) wr.px(x0+5+i*7,by-11,P.t2); }
function paintLamp(wr){ var x=LAMP.x, by=LAMP.base, top=LAMP.top;
  wr.rect(x-1,top,3,by-top,P.m1); wr.vl(x-1,top,by-1,P.m3); wr.rect(x-3,by-5,7,5,P.m0); wr.hl(x-3,x+3,by-5,P.m2);
  for (var y=top+12;y<by-8;y+=14) wr.hl(x-1,x+1,y,P.k2);
  wr.line(x,top,x+10,top-4,P.m1); wr.line(x,top+3,x+8,top-3,P.m0);
  wr.poly([[x+5,top-7],[x+17,top-7],[x+15,top-2],[x+7,top-2]],P.m2); wr.hl(x+7,x+15,top-2,P.s4); wr.hl(x+6,x+16,top-7,P.m3);
  CACHE.lamp=[x+11,top-3]; }

// ---------------------------------------------------------------- Spielplatz, Sandkasten, Luke
function paintClimb(wr){ var x0=CLIMB.x0, x1=CLIMB.x1, by=CLIMB.base, cx=(x0+x1)/2, H0=40, x;
  var COL=[P.r3,P.y3,P.b2,P.g3];
  for (var m=0;m<=8;m++){ var ex=Math.cos(m/8*Math.PI); for (var k=0;k<=60;k++){ var t=k/60, px=cx+ex*(x1-x0)/2*Math.cos(t*Math.PI/2), py=by-Math.sin(t*Math.PI/2)*H0; var c=COL[m%4]; if (hash(m,k)<0.25) c=P.t1; if (ex>0.2 && hash(m*3,k)<0.5) c=M.DN[c]; wr.px(rd(px),rd(py),c); } }
  for (var l=1;l<=4;l++){ var t2=l/5, yy=rd(by-Math.sin(t2*Math.PI/2)*H0), hw=(x1-x0)/2*Math.cos(t2*Math.PI/2); for (x=Math.floor(cx-hw);x<=Math.ceil(cx+hw);x++){ var c2=COL[(l+1)%4]; if (hash(x,l)<0.2) c2=P.t1; wr.px(x,yy,c2); } }
  wr.hl(x0,x1,by,P.m1); wr.hl(x0-2,x1+2,by+1,P.e1);
  wr.rect(cx-10,by+1,4,3,P.r3); wr.hl(cx-10,cx-7,by+1,P.r4); }
function paintSand(wr){ var x0=SAND.x0, x1=SAND.x1, yb=SAND.yb, yf=SAND.yf, x;
  wr.poly([[x0+4,yb],[x1-2,yb],[x1+2,yf],[x0,yf]],function(x,y){ var c=(hash(x,y)<0.3)?P.e3:((hash(x>>1,y)<0.5)?P.e4:P.e3); if (fbm(x*0.3,y*0.8)>0.7) c=P.e2; return c; });
  wr.line(x0+4,yb,x1-2,yb,P.w3); wr.line(x0+4,yb-1,x1-2,yb-1,P.w4); wr.line(x0,yf,x0+4,yb,P.w2); wr.line(x1+2,yf,x1-2,yb,P.w1);
  wr.rect(x0,yf,x1-x0+3,3,P.w2); wr.hl(x0,x1+2,yf,P.w4); wr.hl(x0,x1+2,yf+2,P.w0); for (x=x0+8;x<x1;x+=12) wr.vl(x,yf,yf+2,P.w1);
  wr.ellipse(x0+18,yb+4,4,1.6,P.e4); wr.px(x0+18,yb+2,P.e2); wr.rect(x0+34,yb+5,3,2,P.b2); wr.px(x0+35,yb+4,P.b3); wr.line(x0+40,yb+3,x0+48,yb+6,P.e2);
  // die Luke: eiserne Klappe mit Griff und Scharnieren, bündig im Boden, Rost
  var hx=HATCH.x0, hy=HATCH.y0, hw=HATCH.x1-HATCH.x0, hh=HATCH.y1-HATCH.y0;
  wr.poly([[hx+1,hy],[hx+hw-1,hy],[hx+hw,hy+hh],[hx,hy+hh]],function(x,y){ var c=M.rampAt(R('t0 t1 m1 m2'),0.4+fbm(x*0.6,y*0.9)*0.5,x,y); if ((x+y)%4===0) c=P.m0; return c; });
  wr.hl(hx,hx+hw,hy+hh,P.k1); wr.hl(hx+1,hx+hw-1,hy,P.m3); wr.rect(hx+4,hy+2,4,2,P.k2); wr.hl(hx+4,hx+7,hy+2,P.m3); wr.px(hx+1,hy+1,P.k2); wr.px(hx+hw-2,hy+1,P.k2); wr.px(hx+2,hy+hh-1,P.t2);
  wr.hl(hx-1,hx+hw+1,hy+hh+1,P.s2); }

// ---------------------------------------------------------------- geparkte Autos: alter Golf (weiß), Yugo (rot)
function car(wr,x0,x1,base,col,kind){ var L=x1-x0, h=kind==='yugo'?16:15, roof=kind==='yugo'?0.62:0.58, x, y, top=base-h;
  var C=R(col);
  for (x=x0;x<x1;x++){ var u=(x-x0)/L;
    var rt=(u>0.18 && u<0.18+roof)?top:(u<=0.18?top+Math.round((0.18-u)/0.18*7):top+Math.round((u-0.18-roof)/(1-0.18-roof)*(kind==='yugo'?8:6)));
    if (u<0.06||u>0.94) rt=Math.max(rt,top+8);
    for (y=rt;y<base-3;y++){ var c;
      if (y<top+7 && u>0.2 && u<0.16+roof){ c=(y===rt)?C[3]:P.n1; if ((x+y)%9<2) c=P.c3; if (Math.abs(u-0.48)<0.012) c=C[1]; }
      else { c=y<top+8?C[3]:(y<base-7?C[2]:C[1]); if (y===top+8) c=C[3]; }
      if (y===base-8 && u>0.08 && u<0.92) c=C[0];
      wr.px(x,y,c); } }
  [x0+Math.round(L*0.2),x0+Math.round(L*0.8)].forEach(function(cx){ wr.ellipse(cx,base-3,3.4,3.4,P.k1); wr.ellipse(cx,base-3,1.5,1.5,P.m2); wr.hl(cx-4,cx+4,base-6,P.k2); });
  wr.hl(x0,x1-1,base-4,P.m2); wr.rect(x1-3,base-9,2,2,P.y4); wr.rect(x0+1,base-9,2,2,P.r3); wr.hl(x0+2,x1-3,base,P.k2);
  if (kind==='yugo'){ wr.rect(x0+rd(L*0.62),base-7,8,3,P.s5); wr.hl(x0+rd(L*0.62)+1,x0+rd(L*0.62)+6,base-6,P.k2); } }   // Kennzeichen

// ---------------------------------------------------------------- Wetter auf dem Boden
function puddleAt(x,y){ for (var i=0;i<PUDDLES.length;i++){ var p=PUDDLES[i], dx=(x-p[0])/p[2], dy=(y-p[1])/p[3], e=1+Math.sin(x*0.4+i)*0.08; if (dx*dx+dy*dy<e) return i; } return -1; }
function wetGround(b){ var src=b.clone();
  for (var y=111;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x; if (REG[k]!==RG.ground) continue; var c=b.d[k];
    if (puddleAt(x,y)>=0){ var ry=2*110-y+Math.round(Math.sin(y*1.9+x*0.15)*0.8); var rc=src.get(x,ry); if (rc===T) rc=P.m2; b.d[k]=M.mix(M.DN[rc],P.n1,2); continue; }
    // nasser Belag: dunkler, mit mattem Glanz in langen Streifen (Spiegelung des hellen Himmels)
    var q=gUV(x,y), sh=fbm(q.X*0.35,q.z*1.6); c=M.DN[c]; if (sh>0.6 && bayer(x,y)<(sh-0.6)*3) c=M.mix(c,P.m4,3); b.d[k]=c; } }
function snowPass(b){ var top=function(x,y){ var r=REG[y*W+x]; return r===RG.prop||r===RG.tram||r===RG.lamp; };
  M.snowCap(b,0,30,W,H-30,top);
  // dünner erster Schnee: Rasen und Hecken weiß, auf den Wegen nur am Rand, dazwischen nasser, dunkler Belag
  for (var y=94;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x; if (REG[k]!==RG.ground) continue; var c=b.d[k], q=gUV(x,y), f=fbm(q.X*0.9+5,q.z*0.9);
    var g=(c===P.e1||c===P.e2||c===P.e3||c===P.g0||c===P.g1||c===P.g2||c===P.g3||c===P.t2);
    if (g){ b.d[k]=(f>0.42)?P.s6:(bayer(x,y)<0.6?P.s5:c); continue; }
    var trod=(y>114 && y<134 && f<0.56)||onPath(x,y)&&f<0.62;
    if (!trod){ b.d[k]=(f>0.55)?P.s6:(bayer(x,y)<(f-0.3)*2.4?P.s5:M.DN[c]); }
    else if (bayer(x,y)<0.5) b.d[k]=M.DN[c]; }
  for (var i=0;i<36;i++){ var px=30+i*16+Math.round(Math.sin(i)*3), py=124+(i%2)*3; if (REG[py*W+px]!==RG.ground) continue; b.px(px,py,P.s2); b.px(px+1,py,P.s3); } }

// ---------------------------------------------------------------- Malen
function lightsFor(tod,S,weather){ if (tod==='day') return []; var f=(weather==='fog'||weather==='snow')?1.25:1, L=CACHE.lamp;
  var ls=[[L[0],121,38*f,10*f,0.9],[L[0],L[1]+4,18*f,16*f,0.6],[330,121,72*f,12*f,0.8],[330,96,70*f,30*f,0.35],[CACHE.vlamp[0],CACHE.vlamp[1]+2,26,9,0.5]];
  if (tod==='night') ls.push([52,80,34,34,0.4],[52,116,42,8,0.45]);
  if (S.tramIn) ls.push([80,74,96,26,0.3],[96,113,82,8,0.35]);
  return ls; }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), snow=weather==='snow', fog=weather==='fog', rain=weather==='rain', cold=snow||(weather==='calm');
  REG.fill(0); WINS.length=0;
  paintSky(RW(b,RG.sky),tod,weather); SKYB=b.clone();
  paintHills(RW(b,RG.hill),cold);
  var gr=RW(b,RG.ground); paintGround(gr);
  var f2=RW(b,RG.far2); FAR2.forEach(function(f){ var o={x0:f[0],x1:f[1],base:f[2],top:f[3],fh:f[4],bay:f[5],seed:f[6],paint:f[7]}; tower(f2,o,RG.far2); towerRoof(f2,o); });
  var far=RW(b,RG.far); FAR.forEach(function(f){ var o={x0:f[0],x1:f[1],base:f[2],top:f[3],fh:f[4],bay:f[5],seed:f[6],paint:f[7]}; tower(far,o,RG.far); towerRoof(far,o); });
  paintT7(RW(b,RG.t7));
  var near=RW(b,RG.near);
  tower(near,NEARL,RG.near); dishes(near,NEARL); scars(near,NEARL.x0,NEARL.x1,10,95,31,16);
  tower(near,NEARR,RG.near); dishes(near,NEARR); scars(near,NEARR.x0,NEARR.x1,0,90,41,14);
  paintRails(gr);
  var tr=RW(b,RG.tree); POPLARS.forEach(function(p){ poplar(tr,p[0],p[1],p[2],p[3]); });
  var pr=RW(b,RG.prop);
  car(pr,CARS.golf[0],CARS.golf[1],CARS.golf[2],'s3 s4 s5 s6','golf'); car(pr,CARS.yugo[0],CARS.yugo[1],CARS.yugo[2],'r1 r2 r3 r4','yugo');
  paintClimb(pr); paintSand(pr);
  paintVest(pr);
  CACHE.tram=S.tramIn?paintTram(RW(b,RG.tram)):null;
  paintShelter(pr); paintPole(pr); paintKiosk(pr);
  paintBench(pr); paintLamp(RW(b,RG.lamp));
  // ---- Kontaktschatten, bei klarem Wetter lange Schatten der tiefen Sonne nach rechts
  var LF=M.lf.sum(M.lf.pool(VEST.x0+66,VEST.base+2,80,4,-1.1),M.lf.pool(52,111,44,3,-1),M.lf.pool(463,114,22,3,-0.9),M.lf.pool(522,110,28,3,-0.8),M.lf.pool(593,105,34,3,-0.9),M.lf.band(111,124,-0.3,0));
  if (weather==='calm' && tod==='day') LF=M.lf.sum(LF,longShadows(),M.lf.k(0.15));
  M.light(b,LF,0,0,function(x,y){ var r=REG[y*W+x]; return r===RG.ground; });
  if (rain) wetGround(b);
  if (snow) snowPass(b);
  // ---- Dunst und Nebel: Ferne verblasst, Turmspitzen verschwinden im Grau (oben kühl, unten warm vom Kohlerauch)
  var base0={calm:0.3,fog:0.64,rain:0.42,snow:0.5}[weather]||0.4;
  function amt(x,y){ var r=REG[y*W+x], hgt=1-y/100;
    if (r===RG.sky) return 0;
    if (r===RG.hill) return Math.min(0.95,base0*1.25+0.15);
    if (r===RG.far2) return Math.min(0.95,base0*1.15+0.2);
    if (r===RG.far) return Math.min(0.9,base0+0.08+hgt*0.15);
    if (r===RG.t7||r===RG.clock) return weather==='calm'?0.06+hgt*0.06:Math.min(0.78,base0*0.5+hgt*0.3);
    if (r===RG.near) return weather==='calm'?hgt*0.05:base0*0.22+hgt*hgt*0.45;
    if (r===RG.tree) return weather==='calm'?0:base0*0.2+hgt*0.3;
    if (y<108) return weather==='calm'?0.04:base0*0.28;
    return 0; }
  // ---- Nacht und Morgengrauen: weiches Licht; der Dunst geht immer in den Himmel dahinter über; danach die Lichtquellen selbst
  if (tod!=='day'){ CACHE.lights=lightsFor(tod,S,weather); shade(b,0,0,tod,CACHE.lights,function(x,y){ return REG[y*W+x]===RG.sky; }); }
  fogTo(b,amt,SKYB);
  if (tod!=='day') afterLights(b,tod,S,weather);
  return b; }
// Pixel nach amt(x,y) zur Himmelsfarbe dahinter mischen (so verschwindet die Ferne nahtlos im Dunst)
function fogTo(b,amt,sky){ for (var y=0;y<H;y++){ var sy=Math.min(y,HY+2); for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k], tc=sky.d[sy*W+x];
    var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=M.mix(c,tc,i); } } }
// lange Schatten der tiefen Novembersonne (von links)
function longShadows(){ var objs=[[VEST.x0,VEST.x1,VEST.base,30],[SHEL.x0,SHEL.x1,SHEL.base,22],[BENCH.x0,BENCH.x1,BENCH.base,8],[LAMP.x-1,LAMP.x+1,LAMP.base,40],[CLIMB.x0,CLIMB.x1,CLIMB.base,16],[KIO.x0,KIO.x1,KIO.yf,4],[POLE.x,POLE.x+1,POLE.base,34]];
  POPLARS.forEach(function(p){ objs.push([p[0]-1,p[0]+1,p[1]+6,40]); });
  return function(x,y){ if (y<111) return 0; var s=0; for (var i=0;i<objs.length;i++){ var o=objs[i], j=y-o[2]; if (j<0||j>o[3]) continue; var dx=j*1.7; if (x>=o[0]+dx && x<=o[1]+dx+2) s=Math.min(s,-1.1*(1-j/(o[3]+8))); } return s; }; }

// ---------------------------------------------------------------- nach dem Umfärben: Fenster, Laternen, Glas, Bahn
function afterLights(b,tod,S,weather){ var night=tod==='night', fog=weather==='fog'||weather==='snow', k, x, y;
  var pBase=night?0.75:0.42;
  WINS.forEach(function(w){ var x=w[0], y=w[1], h=w[2], p=w[3]*pBase, reg=w[4]; if (h>p) return; var k=y*W+x; if (REG[k]!==reg) return;
    var tv=(h*37)%1<0.16, c;
    if (reg===RG.far2) c=fog?(bayer(x,y)<0.4?P.y1:P.m1):P.y2;
    else if (reg===RG.far) c=fog?(bayer(x,y)<0.6?P.y2:P.y1):(h<p*0.5?P.y3:P.y2);
    else if (reg===RG.t7) c=fog?(h<p*0.4?P.y3:P.y2):(h<p*0.4?P.y4:P.y3);
    else { c=tv?(bayer(x,y)<0.5?P.n4:P.n3):(h<p*0.3?P.y4:(h<p*0.7?P.y3:P.y2)); if (w[5]===2) c=P.y2; if (w[5]===1 && bayer(x,y)<0.4) c=P.w3; if (fog && y<40 && bayer(x,y)<(40-y)/50) c=M.DN[c]; }
    b.d[k]=c; });
  // Laterne
  var L=CACHE.lamp; b.poly([[L[0]-6,L[1]-4],[L[0]+6,L[1]-4],[L[0]+4,L[1]+1],[L[0]-4,L[1]+1]],P.y4); b.hl(L[0]-4,L[0]+4,L[1]+1,P.y5); b.px(L[0],L[1],P.l1); b.px(L[0]-1,L[1],P.l0);
  // Eingangsbau: hell erleuchtete Halle (kaltes Neonlicht), Leuchte unter dem Vordach
  var v=CACHE.vest; for (y=v[2]+9;y<v[3];y++) for (x=v[0]+8;x<v[1]-8;x++){ k=y*W+x; if (REG[k]!==RG.glass) continue; var hc=hallAt(x,y,true); if (((x*0.5+y)%29)<1.6) hc=M.UP[hc]; b.d[k]=hc; }
  for (x=v[0]+8;x<v[1]-8;x+=16) for (y=v[2]+9;y<v[3];y++){ if (REG[y*W+x]===RG.glass||REG[y*W+x]===RG.prop) b.px(x,y,P.m2); }
  b.rect(CACHE.vlamp[0]-3,CACHE.vlamp[1]-2,6,2,P.y5); b.px(CACHE.vlamp[0],CACHE.vlamp[1]-2,P.l1);
  var n7=CACHE.big7; b.rect(n7[0],n7[1],n7[2],7,P.b2); b.hl(n7[0],n7[0]+n7[2]-1,n7[1],P.b3); M.text(b,'7',n7[0]+4,n7[1],P.l1);
  // Spiegelung von Halle und Laterne auf dem Boden davor (nass oder Schnee)
  if (weather==='rain'||weather==='snow') for (y=112;y<138;y++){ var fade=(y-112)/26; for (x=v[0]+10;x<v[1]-10;x++){ if (REG[y*W+x]!==RG.ground) continue; if (Math.sin(x*0.9+y*2.3)>0.6+fade*0.8 && bayer(x,y)<0.6-fade*0.5) b.px(x,y,P.y2); }
    for (x=L[0]-2;x<=L[0]+2;x++) if (REG[y*W+x]===RG.ground && bayer(x,y)<0.55-fade*0.5) b.px(x,y,P.y3); }
  // Wartehäuschen: Leuchtröhre unter dem Dach (nachts)
  if (night){ var tb=CACHE.tube; b.hl(tb[0],tb[1],tb[2],P.s6); b.hl(tb[0]+1,tb[1]-1,tb[2]+1,P.n5); }
  // Straßenbahn: erleuchtete Fenster, Zielanzeige, Scheinwerfer
  var tm=CACHE.tram; if (tm){ tm.lit.forEach(function(p){ var kk=p[1]*W+p[0]; if (REG[kk]!==RG.tram) return; var dy=p[1]-tm.winT, c=(dy<2)?P.y5:(bayer(p[0],p[1])<0.3?P.y4:P.y3);
      if (p[1]>tm.winB-7 && p[1]<tm.winB && ((p[0]+3)%12)<8) c=(p[1]===tm.winB-7)?P.w3:P.w2; if (p[0]%9===0 && dy>2) c=P.y2; if (p[1]>tm.winB) c=bayer(p[0],p[1])<0.5?P.y2:P.w2; b.d[kk]=c; });
    b.rect(tm.sign[0],tm.sign[1],tm.sign[2],9,P.k1); sign(b,'3 BAŠČARŠIJA',tm.sign[0]+2,tm.sign[1]+3,P.y5);
    b.rect(tm.num[0],tm.num[1],8,7,P.k1); M.microText(b,'3',tm.num[0]+3,tm.num[1]+1,P.y5);
    b.px(tm.head[0],tm.head[1],P.l1); b.px(tm.head[0]-1,tm.head[1],P.y5); }
  if (CACHE.mast) b.px(CACHE.mast[0],CACHE.mast[1],P.r3);
  // einige Fenster schalten später ein und aus (dynamic)
  TOGGLE.length=0; var r=M.rng(91); for (var i=0;i<10;i++){ var o=i<6?NEARL:NEARR, nb=Math.floor((o.x1-o.x0)/o.bay), bx=o.x0+Math.floor(r()*nb)*o.bay+2, fl=2+Math.floor(r()*10), wy=o.base-fl*o.fh-o.fh+1; if (wy<2) continue; TOGGLE.push([bx,wy,o.bay-3,4,r()*20,6+r()*14]); } }

// ---------------------------------------------------------------- Ebenen: Pflanzkübel vorn
function layers(S,GS,tod){ var L=[], l=M.layer(PLANT.x0-2,PLANT.base-28,PLANT.x1-PLANT.x0+4,30,PLANT.base), w=M.lw(l), x0=PLANT.x0, x1=PLANT.x1, by=PLANT.base, x, y, weather=M.scn.weather(GS);
  for (y=by-12;y<by;y++) for (x=x0;x<x1;x++){ var c=(hash(x>>1,y)<0.4)?P.s2:P.s3; if (y===by-12) c=P.s4; if (x===x0) c=P.s4; if (x===x1-1) c=P.s1; if (y===by-1) c=P.s1; w.px(x,y,c); }
  for (y=by-14;y<by-11;y++) for (x=x0+1;x<x1-1;x++) w.px(x,y,(hash(x,y)<0.5)?P.e1:P.w1);
  var r=M.rng(5); for (var i=0;i<9;i++){ var sx=x0+3+Math.floor(r()*(x1-x0-6)), hh=5+Math.floor(r()*8); w.line(sx,by-13,sx+Math.round((r()-0.5)*6),by-13-hh,P.e2); if (r()<0.5) w.px(sx+1,by-14-hh,P.t2); }
  M.microText(l,'7',x1-8-l.ox,by-9-l.oy,P.s1);
  if (weather==='snow'){ for (x=x0;x<x1;x++){ w.px(x,by-13,P.s6); if (hash(x,1)<0.5) w.px(x,by-12,P.s5); } }
  if (tod!=='day') shade(l,l.ox,l.oy,tod,CACHE.lights||[]);
  L.push(l); return L; }

// ---------------------------------------------------------------- Bewegung: Krähen, Wäsche, Fenster, Laternenflackern
function crow(fb,x,y,f,ph,col){ fb.px(x,y,col); fb.px(x+1,y,col); fb.px(x-1,y,col); if (ph<0.5){ fb.px(x-2,y-1,col); fb.px(x+2,y-1,col); fb.px(x-3,y-2,col); fb.px(x+3,y-2,col); } else { fb.px(x-2,y+1,col); fb.px(x+2,y+1,col); } fb.px(x+f*2,y,col); }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, tod=v.tod, i;
  if (tod!=='night'){ var cc=tod==='dawn'?P.k2:P.k1;
    for (i=0;i<4;i++){ var sp=9+hash(i,3)*8, X=Math.floor((hash(i,1)*900+t*sp)%900)-130-cam, Y=Math.floor(16+hash(i,2)*36+Math.sin(t*0.7+i*2)*4); if (X<2||X>fb.w-4) continue; crow(fb,X,Y,1,((t*2.2+i*0.37)%1),cc); }
    var lx=CACHE.lamp[0]-cam+1, ly=CACHE.lamp[1]-6, hop=(Math.floor(t*0.5)%7===0)?1:0; if (lx>2&&lx<fb.w-4){ var c0=tod==='day'?P.k1:P.k2; fb.px(lx,ly-hop,c0); fb.px(lx+1,ly-hop,c0); fb.px(lx-1,ly+1-hop,c0); fb.px(lx,ly+1-hop,c0); fb.px(lx+1,ly+1-hop,c0); fb.px(lx+2,ly-1-hop,c0); fb.px(lx-2,ly+2-hop,c0); fb.px(lx+3,ly-1-hop,P.m1); } }
  // Wäsche flattert (an den nahen Türmen): ein Zipfel schlägt um
  for (i=0;i<16;i++){ var o=i<8?NEARL:NEARR, bx=o.x0+3+Math.floor(hash(i,21)*(o.x1-o.x0-8)), by=o.base-o.fh*(2+Math.floor(hash(i,22)*10))+3, sx=bx-cam; if (sx<0||sx>=fb.w-2||by<0) continue; if (Math.sin(t*(2+hash(i,23)*2)+i)>0.4){ var c1=fb.d[by*fb.w+sx]; if (WASH.indexOf(c1)>=0) fb.d[by*fb.w+sx+1]=c1; } }
  if (tod!=='day') TOGGLE.forEach(function(q,j){ var on=((t+q[4])%(q[5]+8))<q[5], sx=q[0]-cam; if (sx<-q[2]||sx>=fb.w) return; for (var yy=q[1];yy<q[1]+q[3];yy++) for (var xx=0;xx<q[2];xx++){ var X2=sx+xx; if (X2<0||X2>=fb.w) continue; fb.d[yy*fb.w+X2]=on?((j%3===0)?P.n3:P.y3):P.k1; } });
  if (tod==='dawn' && Math.sin(t*11.3)+Math.sin(t*4.1)>1.3){ var L=CACHE.lamp, X3=L[0]-cam; for (var q=-4;q<=4;q++) fb.px(X3+q,L[1]+1,P.y3); }
  if (tod!=='day' && CACHE.mast && Math.floor(t*1.1)%2===0){ var mx=CACHE.mast[0]-cam; if (mx>=0&&mx<fb.w) fb.px(mx,CACHE.mast[1],P.r4); }
  // Regen: Ringe in den Pfützen
  if (M.scn.weather(GS)==='rain') for (i=0;i<10;i++){ var p=PUDDLES[i%PUDDLES.length], ph=(t*1.3+hash(i,5)*3)%1, rx=p[0]+(hash(i,6)-0.5)*p[2]*1.2, ry=p[1]+(hash(i,7)-0.5)*p[3], rr=ph*4; for (var a=0;a<10;a++){ var an=a/10*Math.PI*2, xx2=rd(rx+Math.cos(an)*rr)-cam, yy2=rd(ry+Math.sin(an)*rr*0.35); if (xx2<0||xx2>=fb.w||puddleAt(xx2+cam,yy2)<0) continue; if (ph<0.8) fb.d[yy2*fb.w+xx2]=M.UP[fb.d[yy2*fb.w+xx2]]; } } }
function front(fb,v,S,GS){ var w=M.scn.weather(GS), tod=v.tod;
  if (w==='fog') M.fogDrift(fb,v.t,{y0:54,y1:128,amt:tod==='night'?0.32:0.38,k:2,col:tod==='night'?P.m1:P.s4,cam:v.cam});
  else if (w==='snow'){ M.snow(fb,v.t,{n:90,cam:v.cam,col:tod==='night'?P.s5:P.s6,col2:tod==='night'?P.m3:P.s4}); M.fogDrift(fb,v.t*0.6,{y0:30,y1:100,amt:0.22,k:1,col:tod==='night'?P.m1:P.m3,cam:v.cam}); }
  else if (w==='rain') M.rain(fb,v.t,{n:70,col:tod==='night'?P.n2:P.m3,col2:tod==='night'?P.n3:P.m4}); }

// ---------------------------------------------------------------- Geistersicht: der alte Kiosk in Lichtlinien, die Uhr leuchtet grünlich
function gpx(fb,X,Y,c,cam){ var sx=X-cam; if (sx<0||sx>=fb.w||Y<0||Y>=144) return; fb.d[Y*fb.w+sx]=c; }
function gline(fb,x0,y0,x1,y1,c,cam,t,ph){ var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0)); for (var i=0;i<=n;i++){ var tt=n?i/n:0, X=rd(x0+(x1-x0)*tt), Y=rd(y0+(y1-y0)*tt); if (((i+Math.floor(t*5+ph))%11)<9) gpx(fb,X,Y,c,cam); } }
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, yb=KIO.yf-3, a=0.5+Math.sin(t*1.1)*0.5, c1=P.x4, c2=P.x5;
  var top=yb-52, x0=KIO.x0+4, x1=KIO.x1-4;
  gline(fb,x0,yb,x0,top,c1,cam,t,0); gline(fb,x1,yb,x1,top,c1,cam,t,3); gline(fb,x0,yb,x1,yb,c1,cam,t,5);
  gline(fb,x0-4,top,x1+4,top,c2,cam,t,1); gline(fb,x0-4,top,x0,top-5,c1,cam,t,2); gline(fb,x0,top-5,x1,top-5,c1,cam,t,4); gline(fb,x1,top-5,x1+4,top,c1,cam,t,6);
  gline(fb,x0+3,top+8,x1-3,top+8,c1,cam,t,7); gline(fb,x0+3,top+30,x1-3,top+30,c2,cam,t,8); gline(fb,x0+3,top+8,x0+3,top+30,c1,cam,t,9); gline(fb,x1-3,top+8,x1-3,top+30,c1,cam,t,2);
  gline(fb,x0,top+34,x1,top+34,c1,cam,t,4); gline(fb,x0+(x1-x0>>1),top+8,x0+(x1-x0>>1),top+30,P.x3,cam,t,5);
  for (var n=0;n<5;n++){ var nx=x0+5+n*7, ny=top+33; for (var j=0;j<4;j++) gpx(fb,nx+j,ny-(j%2),n%2?P.x3:P.x4,cam); }
  for (var m=0;m<4;m++){ var mx=x0+4+m*9; for (var q=0;q<6;q++) gpx(fb,mx+q%3,top+11+((q/3)|0)*4+m%2,P.x3,cam); }
  var sw=M.microWidth('KIOSK'), sx=rd((x0+x1)/2-sw/2); gline(fb,sx-3,top-14,sx+sw+2,top-14,c1,cam,t,3); gline(fb,sx-3,top-6,sx+sw+2,top-6,c1,cam,t,6); gline(fb,sx-3,top-14,sx-3,top-6,c1,cam,t,1); gline(fb,sx+sw+2,top-14,sx+sw+2,top-6,c1,cam,t,2);
  M.microText({px:function(X,Y,c){ gpx(fb,X,Y,c,cam); }},'KIOSK',sx,top-12,a>0.4?P.x6:P.x5);
  // Dachuhr: Ziffern und Punkte glimmen grünlich, ein Hof aus Licht
  var cx=CLK.x, cy=CLK.y, gl=0.55+Math.sin(t*0.8)*0.2;
  for (var y=cy-17;y<=cy+17;y++) for (var x=cx-17;x<=cx+17;x++){ var d=Math.hypot(x-cx,y-cy); if (d<CLK.r+4 && d>CLK.r-1 && bayer(x,y)<(1-(d-CLK.r+1)/5)*gl*0.6){ var sx2=x-cam; if (sx2>=0&&sx2<fb.w&&y>=0) fb.d[y*fb.w+sx2]=M.UP[fb.d[y*fb.w+sx2]]; } }
  var mk=clockMarks(); mk.dots.forEach(function(p){ gpx(fb,p[0],p[1],P.a6,cam); });
  mk.nums.forEach(function(nn){ M.microText({px:function(X,Y){ gpx(fb,X,Y,gl>0.6?P.x6:P.a6,cam); }},nn[0],nn[1],nn[2]); }); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S,GS){ if (y<111||y>140||x<6||x>634) return false;
  if (x>=BENCH.x0-2 && x<=BENCH.x1+2 && y<BENCH.base+3) return false;
  if (x>=SAND.x0-1 && x<=SAND.x1+3 && y<SAND.yf+4) return false;
  if (x>=KIO.x0-1 && x<=KIO.x1+3 && y<KIO.yf+2) return false;
  if (Math.abs(x-LAMP.x)<4 && y<LAMP.base+2) return false;
  if (x>=PLANT.x0-1 && x<=PLANT.x1 && y>=PLANT.base-5) return false;
  return true; }
var spots={
  exit:[0,92,12,52],
  tram_stop:[SHEL.x0-4,SHEL.top-11,POLE.x+10-SHEL.x0,SHEL.base-SHEL.top+12],
  tram:function(S){ return (S&&S.tramIn)?[0,24,TRAM.x1+2,RAIL.y1-22]:[0,0,0,0]; },
  kiosk_spot:[KIO.x0-6,KIO.yb-14,KIO.x1-KIO.x0+12,KIO.yf-KIO.yb+18],
  tower7:[T7.x0-2,T7.top-2,T7.x1-T7.x0+4,VEST.top-T7.top+2],
  roofclock:[CLK.x-14,0,28,T7.top-1],
  haustor_door:[DOOR7.x0-4,DOOR7.top-3,DOOR7.x1-DOOR7.x0+8,VEST.base-DOOR7.top+3],
  balconies:[T7.x0+4,T7.top+4,26,18],
  towers:[0,0,W,98],
  playground:[CLIMB.x0-2,CLIMB.base-42,CLIMB.x1-CLIMB.x0+4,44],
  sandpit:[SAND.x0-1,SAND.yb-2,SAND.x1-SAND.x0+4,SAND.yf-SAND.yb+5],
  hatch:[HATCH.x0-2,HATCH.y0-2,HATCH.x1-HATCH.x0+4,HATCH.y1-HATCH.y0+4],
  bench:[BENCH.x0-2,BENCH.base-23,BENCH.x1-BENCH.x0+4,24],
  cars:[CARS.golf[0]-2,CARS.golf[2]-19,W-CARS.golf[0]+2,CARS.yugo[2]-CARS.golf[2]+20],
  trees:[POPLARS[2][0]-12,4,24,POPLARS[2][1]-4],
  lamp:[LAMP.x-3,LAMP.top-8,22,LAMP.base-LAMP.top+8]
};
var stands={
  exit:[10,124,'L'], tram_stop:[60,124,'B'], tram:[112,118,'B'], kiosk_spot:[202,118,'B'], tower7:[340,120,'B'], roofclock:[352,124,'B'],
  haustor_door:[330,114,'B'], balconies:[312,122,'B'], towers:[240,124,'B'], playground:[520,118,'B'], sandpit:[576,124,'B'], hatch:[612,122,'B'],
  bench:[463,118,'B'], cars:[600,124,'B'], trees:[424,118,'B'], lamp:[496,118,'B']
};
// Figuren im Laternen- und Hallenlicht warm, sonst Tageszeit
function actorLut(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return undefined; var Ls=CACHE.lights||[], v=lightAt(Ls,a.x,a.y-10); return levels(tod)[Math.min(4,Math.round(v*4))].a; }
M.defineArt('neboder',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost, actorLut:actorLut, spots:spots, stands:stands,
  actorPos:{ alija:[198,112,'R'], mirza:[300,121,'R'], nada:[356,118,'L'] },
  start:[118,120,'R'], entries:{ map:[16,124,'R'], haustor:[330,116,'F'], tramvaj:[118,120,'R'] }
});
})(M);
