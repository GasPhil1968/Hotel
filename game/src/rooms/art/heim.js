/* ===== rooms/art/heim.js — Haus am Bavariapark: die Eingangshalle (320 px, Innenraum) =====
   Eine helle Halle eines Altenheims: Fliesenboden, cremefarbene Wände mit Handlauf, Deckenspots. Hinten links die große
   Glastür mit Oberlicht und Seitenlicht, draußen Schnee, die kahlen Bäume des Bavariaparks und eine Laterne; über der Tür
   das grüne Notausgangsschild. Daneben die Empfangstheke aus hellem Holz mit Lichterkette an der Kante, darauf ein
   Weihnachtsstern im Topf, eine Klingel, das Besucherbuch; über der Theke Holzbuchstaben „HAUS AM BAVARIAPARK“, an der
   Wand Schlüsselkasten und Rettungsplan. Rechts die Pinnwand mit Speiseplan und dem gelben Zettel „BESUCHSZEITEN 10-18 UHR“,
   darunter eine Bank. Ganz rechts hinten die Aufzugtür aus Edelstahl mit Anzeige und Rufknopf, in der rechten Wand die
   offene Tür zum Treppenhaus mit den ersten Stufen. Vorn links der Tannenbaum mit Lichterkette, an der linken Wand ein
   Landschaftsbild und ein Desinfektionsspender.
   Nacht (k4_fin_n oder S.night): Deckenlicht aus, nur die Notlichter (grün) und die Lichterketten; durch die Glastür
   Frost, Laternenlicht und in der Silvesternacht Feuerwerk. Geistersicht: Eisblumen auf dem Glas der Tür. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[160,50], F=100, FY=96, RECT=[40,14,280,96];
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var GL={x0:44,x1:96,y0:28};                              // Glastür (Rückwand): Seitenlicht, zwei Flügel, Oberlicht
var DESK={X0:110,X1:174,Y0:72,Z0:8,Z1:28};               // Empfangstheke
var BRD={x0:186,x1:236,y0:33,y1:66};                     // Pinnwand
var BEN={X0:188,X1:232,Z0:3,Z1:11,Y:84};                 // Bank (Sitzfläche)
var LIFT={x0:244,x1:272,y0:40};                          // Aufzugtür
var STAIRU=[8,30,40,96];                                 // Tür zum Treppenhaus in der rechten Wand (Tiefe u0..u1, oben, unten)
var TREE={X:54,Z:24,h:60,r:15};                          // Tannenbaum vorn links
var EMPF=[138,104], KEVIN=[134,104];                     // hinter der Theke (der Monitor steht rechts davon, vor ihnen)
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
// Wetter: Kapitel 4 kennt snow, snowlie, thaw, fog, sun, frost; alles Unbekannte gilt als snowlie
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function isNight(S,GS,tod){ return tod!=='day' || !!(S&&S.night) || (GS&&GS.phase==='k4_fin_n'); }
function fireworks(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks&&M.k4Fireworks(GS)); }

// ---------------------------------------------------------------- Licht: nachts nur Notlicht (grün) und Lichterketten (warm)
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.1+L*0.04, g*0.13+L*0.05, b*0.25+L*0.1+8]; },
  warm:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.36+24, g*0.52+L*0.3+12, b*0.3+L*0.12+2]; },
  green:function(r,g,b){ var L=lum(r,g,b); return [r*0.16+L*0.12, g*0.34+L*0.42+20, b*0.24+L*0.22+14]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=6, A=TF.night, B=TF[k];
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.25));
  return LV[k]=a; }
var EXIT1=[70,23], EXIT2=null;                           // Notausgangsschilder (das zweite über der Treppenhaustür, in paint gesetzt)
var TLIGHTS=[], DLIGHTS=[];                              // Lichter der Ketten (Baum, Theke): [x,y,farbe]
function warmAt(x,y){ var tp=treeBase(), dx=(x-tp[0])/46, dy=(y-tp[1]+26)/52, a=1-dx*dx-dy*dy, v=a>0?Math.pow(a,1.3)*0.95:0;
  var dx2=(x-138)/58, dy2=(y-84)/26, a2=1-dx2*dx2-dy2*dy2; if (a2>0) v+=Math.pow(a2,1.4)*0.7; return v>1?1:v; }
function greenAt(x,y){ var v=0, dx=(x-EXIT1[0])/34, dy=(y-EXIT1[1]-14)/30, a=1-dx*dx-dy*dy; if (a>0) v=Math.pow(a,1.5)*0.75;
  if (EXIT2){ var dx2=(x-EXIT2[0])/16, dy2=(y-EXIT2[1]-8)/18, a2=1-dx2*dx2-dy2*dy2; if (a2>0) v=Math.max(v,Math.pow(a2,1.6)*0.45); } return v; }
function shadeNight(b,ox,oy,mask){ var LW=levels('warm'), LG=levels('green'), n=LW.length;
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var w=warmAt(X,Y), g=greenAt(X,Y), Ls=w>=g?LW:LG, f=Math.max(w,g)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(Ls[i],c,X,Y); } }
// Tag: Deckenspots, Licht durch die Glastür, Rand dunkler
function dayFn(wea){ var k=wea==='thaw'?-0.22:(wea==='fog'||wea==='snow'?-0.12:0);
  return function(x,y){ var v=k-0.18, dx=(x-70)/80, dy=(y-112)/30, a=1-dx*dx-dy*dy; if (a>0) v+=a*0.55;
    var dx2=(x-160)/190, dy2=(y-80)/90, a2=1-dx2*dx2-dy2*dy2; if (a2>0) v+=a2*0.35;
    var cx=(x-160)/200, cy=(y-76)/100, q=cx*cx+cy*cy; v-=Math.max(0,q-0.32)*1.4; return v; }; }

// ---------------------------------------------------------------- Flächen: cremefarbene Wand mit Handlauf, Fliesen, Decke mit Spots
function wall(u,v,x,y,dim){ var c;
  if (v>=FY-3) c=(v>=FY-1)?P.w1:P.w2;                                             // Sockelleiste
  else if (v>=73 && v<76) c=(v===73)?P.w5:(v===74?P.w4:P.w2);                     // Handlauf aus Holz
  else if (v>=76){ c=P.s4; if (hash(u>>2,v>>1)<0.05) c=P.s3; }                    // unten etwas dunkler (abwaschbar)
  else { var f=fbm(u*0.035,v*0.05,3); c=(f>0.64 && bayer(x,y)<(f-0.64)*2.5)?P.s4:P.s5; if (v<RECT[1]+2) c=P.s4; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ var c=wall(u*1.6+(sd==='L'?0:300),v+RECT[1],x,y,0); if (v+RECT[1]>=73 && v+RECT[1]<76){ c=(v+RECT[1]===73)?P.w4:P.w2; } return sd==='L'?M.DN[c]:c; }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.s3; var X=f.X+800, Z=f.Z+800, s=18, ix=Math.floor(X/s), iz=Math.floor(Z/s), fx=X-ix*s, fz=Z-iz*s;
  var c=(hash(ix,iz)<0.5)?P.s4:((hash(ix+3,iz)<0.5)?P.s4:P.s3); if (fx<0.7||fz<0.8) c=P.s2;
  var g=fbm(f.X*0.06,f.Z*0.05,7); if (g>0.62 && bayer(x,y)<(g-0.62)*2) c=M.UP[c];
  var dx=f.X-70, dz=f.Z-4; if (Math.abs(dx)<24 && dz>-2 && dz<14){ c=((Math.floor(f.X)+400)%3===0)?P.m1:P.m2; if (Math.abs(dx)>22.5||dz<-0.8||dz>12.8) c=P.k2; }   // Fußmatte vor der Tür
  return c; }
function ceilTex(xb,d,x,y){ var c=P.s5; if ((Math.floor(xb+600)%30)<1) c=P.s4; if (d%9===0) c=P.s4; return c; }

// ---------------------------------------------------------------- Blick nach draußen: Schnee, Bäume des Parks, Laterne
var HZ=50, VX=70, OUT=null, GLM=new Uint8Array(W*H);
// kahler Baum: Äste rekursiv, Schnee auf den Oberseiten
function branch(o,x,y,len,ang,dep,col,snow,rg){ var x1=x+Math.cos(ang)*len, y1=y+Math.sin(ang)*len; o.line(Math.round(x),Math.round(y),Math.round(x1),Math.round(y1),col);
  if (snow && dep<3 && Math.abs(Math.cos(ang))>0.35) o.px(Math.round((x+x1)/2),Math.round((y+y1)/2)-1,snow);
  if (dep<=0||len<2) return; var n=dep>2?2:(rg()<0.6?2:3); for (var i=0;i<n;i++) branch(o,x1,y1,len*(0.62+rg()*0.18),ang+(i-(n-1)/2)*0.62+(rg()-0.5)*0.4,dep-1,col,snow,rg); }
function outside(tod,wea,night){ var o=new M.Buf(W,H,P.k0), x, y, i, rg=M.rng(31);
  var skyW=(wea==='snow'||wea==='thaw')?'snow':(wea==='fog'?'fog':'clear');
  // Himmel
  if (night){ for (y=0;y<HZ+2;y++) for (x=0;x<W;x++) o.px(x,y,ra(R('k0 k1 k1 n0 n1'),0.1+y/62,x,y)); for (i=0;i<50;i++) o.px(Math.floor(rg()*W),Math.floor(rg()*44),rg()<0.3?P.n4:P.n3); }
  else if (skyW==='clear') for (y=0;y<HZ+2;y++) for (x=0;x<W;x++) o.px(x,y,ra(wea==='sun'?R('b2 b3 b4 b5 b5'):R('b2 b3 b4 b4 b5'),0.12+y/52,x,y));
  else M.scn.sky(o,0,0,W,HZ+2,tod,skyW,7);
  // Parkbäume in der Ferne: ein Band aus feinem Geäst über dem Horizont
  var far=night?P.k1:(wea==='fog'?P.s3:P.m1), far2=night?P.k2:(wea==='fog'?P.s4:P.m2);
  for (x=0;x<W;x++){ var top=34+Math.round(fbm(x*0.07,2,4)*10); for (y=top;y<HZ+1;y++){ var d=(y-top)/(HZ+1-top), f=fbm(x*0.45,y*0.6,9);
      if (bayer(x,y)<0.18+d*0.62+(f-0.5)*0.45) o.px(x,y,d>0.6?far:far2); } }
  // Boden: Schnee (nachts mondhell), ein geräumter Weg geradeaus in die Tiefe, bei Tauwetter Matsch und Pfützen
  for (y=HZ;y<H;y++){ var dd=(y-HZ)/30, hw=(y-HZ)*0.52+0.6, cross=(y>=57 && y<=59); for (x=0;x<W;x++){ var c, onP=(y>59 && Math.abs(x+0.5-VX)<hw)||cross, edge=onP && ((!cross && Math.abs(x+0.5-VX)>hw-1.6)||y===57||(y===59 && Math.abs(x+0.5-VX)>=hw));
      if (night){ c=ra(R('n0 n1 n2 n2 n3'),0.3+dd*0.45+(fbm(x*0.1,y*0.3,6)-0.5)*0.3,x,y); if (onP) c=edge?P.n2:ra(R('k1 k2 n0'),0.5+(hash(x>>1,y)-0.5)*0.4,x,y); }
      else if (wea==='thaw'){ var mud=fbm(x*0.09/(0.25+dd),y*0.35,5); c=ra(R('m2 s2 s3 m3 s4'),0.5+dd*0.3+(mud-0.5)*0.9,x,y); if (mud>0.64 && !onP) c=((x+y)%3)?P.m3:P.b3; if (onP) c=edge?P.s3:ra(R('m0 m1 m2'),0.55+(hash(x>>1,y)-0.5)*0.4,x,y); }
      else { c=ra(R('s4 s5 s5 s6 s6'),0.45+dd*0.45+(fbm(x*0.1,y*0.3,6)-0.5)*0.3,x,y); if (wea==='sun' && hash(x,y)<0.03) c=P.l1; if (onP) c=edge?P.s6:ra(R('m3 s3 s3 m4'),0.5+(hash(x>>1,y)-0.5)*0.35,x,y); }
      o.px(x,y,c); } }
  // nahe Bäume: links einer, der über das Glas hinaus ragt; rechts ein kleinerer hinter der Laterne
  var tc=night?P.k1:(wea==='fog'?P.m2:P.e0), sn=(wea==='thaw'||wea==='fog')?null:(night?P.n3:P.s6);
  for (y=HZ-14;y<HZ+16;y++){ o.px(52,y,tc); o.px(53,y,tc); if (y>HZ+6) o.px(51,y,tc); }
  branch(o,52.5,HZ-12,9,-1.9,4,tc,sn,M.rng(5)); branch(o,52.5,HZ-8,8,-1.0,4,tc,sn,M.rng(6)); branch(o,52.5,HZ-4,7,-2.6,3,tc,sn,M.rng(7));
  for (y=HZ-6;y<HZ+5;y++) o.px(84,y,tc); branch(o,84,HZ-5,6,-1.7,3,tc,sn,M.rng(8)); branch(o,84,HZ-3,5,-0.9,3,tc,sn,M.rng(9));
  // Laterne am Weg
  var LX=78; for (y=33;y<HZ+12;y++){ o.px(LX,y,night?P.k2:P.m1); } o.rect(LX-2,31,5,2,night?P.k2:P.m1); o.hl(LX-1,LX+1,33,night?P.y4:P.s5); if (sn) o.hl(LX-2,LX+2,30,sn);
  if (wea==='fog') M.fogBake(o,function(x,y){ return y<HZ+3?0.66:Math.max(0,0.6-(y-HZ)/60); },{col:P.s4});
  if (night){ for (y=HZ;y<H;y++) for (x=LX-26;x<LX+28;x++){ var dl=Math.hypot((x-LX)/24,(y-HZ-13)/8); if (dl<1 && bayer(x,y)<(1-dl)*0.9) o.px(x,y,dl<0.45?P.y2:P.w2); }   // warmer Lichtkreis im Schnee
    for (y=28;y<40;y++) for (x=LX-8;x<=LX+8;x++){ var dg=Math.hypot(x-LX,(y-33)*1.2); if (dg>1.5 && dg<7 && bayer(x,y)<(1-dg/7)*0.5) o.px(x,y,M.UP[o.get(x,y)]); }
    o.hl(LX-1,LX+1,33,P.y5); o.px(LX,34,P.y3); }
  return o; }

// ---------------------------------------------------------------- Glastür mit Rahmen, Notausgangsschild
function inPane(x,y){ if (x<GL.x0+2||x>GL.x1-2||y<GL.y0+2||y>FY-1) return false;
  if (y>=GL.y0+10 && y<=GL.y0+11) return false;                                    // Kämpfer unter dem Oberlicht
  if (x>=GL.x0+11 && x<=GL.x0+13) return false;                                    // Pfosten zum Seitenlicht
  if (y>GL.y0+11 && x>=GL.x0+32 && x<=GL.x0+33) return false;                      // Stoß der beiden Flügel
  if (y>=FY-8 && x>GL.x0+13) return false;                                         // Trittblech
  return true; }
function glassDoor(b,tod,wea,night){ var x, y, o=outside(tod,wea,night); OUT=o; GLM.fill(0);
  b.rect(GL.x0-2,GL.y0-2,GL.x1-GL.x0+5,FY-GL.y0+2,P.m2);                          // Laibung
  for (y=GL.y0;y<FY;y++) for (x=GL.x0;x<=GL.x1;x++){ if (inPane(x,y)){ b.px(x,y,o.get(x,y)); GLM[y*W+x]=1; continue; }
    var c=P.m3; if (y>=FY-8 && x>GL.x0+13) c=(y===FY-8)?P.m4:((x+y)%5===0?P.m2:P.m3); if (x===GL.x0||y===GL.y0) c=P.m4; if (x===GL.x1) c=P.m1; b.px(x,y,c); }
  // Spiegelungen: zwei schräge helle Streifen auf dem Glas
  for (y=GL.y0+2;y<FY-8;y++) for (x=GL.x0+2;x<GL.x1-1;x++){ if (!GLM[y*W+x]) continue; var s=(x-GL.x0)+(y-GL.y0)*0.45; if ((s>18&&s<21)||(s>40&&s<42)){ if (bayer(x,y)<(night?0.2:0.45)) b.px(x,y,M.UP[b.get(x,y)]); } }
  // Griffe (senkrechte Stangen), Türschließer-Kasten, Sensor
  for (y=62;y<80;y++){ b.px(GL.x0+30,y,P.m4); b.px(GL.x0+35,y,P.m4); } b.px(GL.x0+30,61,P.m3); b.px(GL.x0+35,61,P.m3);
  b.rect(GL.x0+22,GL.y0-6,22,4,P.m2); b.hl(GL.x0+22,GL.x0+43,GL.y0-6,P.m3); b.px(GL.x0+40,GL.y0-4,night?P.r4:P.r2);
  // Notausgang: grünes Schild mit weißer laufender Figur und Pfeil
  var ex=EXIT1[0]-9, ey=EXIT1[1]-3; b.rect(ex,ey,19,7,P.g3); b.hl(ex,ex+18,ey,P.g4); b.hl(ex,ex+18,ey+6,P.g1);
  [[3,1],[3,2],[2,3],[4,3],[3,4],[2,5],[4,5],[5,2],[1,2]].forEach(function(p){ b.px(ex+2+p[0],ey+p[1]-0,P.s6); });
  b.rect(ex+9,ey+2,2,3,P.s6); b.rect(ex+12,ey+3,4,1,P.s6); b.px(ex+15,ey+2,P.s6); b.px(ex+15,ey+4,P.s6); b.px(ex+16,ey+3,P.s6); }

// ---------------------------------------------------------------- Dinge an den Wänden
function lettering(b){ var s='HAUS AM BAVARIAPARK', w=M.microWidth(s), x0=rd((DESK.X0+DESK.X1)/2-w/2), y0=29;
  M.microText(b,s,x0+1,y0+1,P.s3); M.microText(b,s,x0,y0,P.w2); }
function keyBox(b){ var x0=118, y0=42; b.rect(x0,y0,16,14,P.w3); b.rect(x0+1,y0+1,14,12,P.w1); for (var i=0;i<3;i++) for (var j=0;j<2;j++){ b.px(x0+3+i*4,y0+3+j*5,P.m4); b.vl(x0+3+i*4,y0+4+j*5,y0+6+j*5,(i+j)%2?P.y3:P.m3); } b.hl(x0,x0+15,y0,P.w4); }
function rescuePlan(b){ var x0=150, y0=40; b.rect(x0,y0,16,12,P.s6); b.rect(x0,y0,16,3,P.g3); b.hl(x0+1,x0+14,y0+1,P.s6);
  b.rect(x0+2,y0+5,12,5,P.s4); b.hl(x0+2,x0+13,y0+7,P.g3); b.px(x0+5,y0+6,P.r3); b.rect(x0+9,y0+5,1,5,P.m2); b.vl(x0+15,y0,y0+11,P.s3); }
function pinBoard(b){ var p=BRD, x, y;
  b.rect(p.x0-2,p.y0-2,p.x1-p.x0+4,p.y1-p.y0+4,P.w3); b.hl(p.x0-2,p.x1+1,p.y0-2,P.w4); b.hl(p.x0-2,p.x1+1,p.y1+1,P.w1);
  for (y=p.y0;y<p.y1;y++) for (x=p.x0;x<p.x1;x++){ var h=hash(x,y); b.px(x,y,h<0.2?P.e2:(h<0.8?P.e3:P.e4)); }
  // Speiseplan: weißes Blatt, Überschrift, Zeilen je Tag
  var sx=p.x0+2, sy=p.y0+2; b.rect(sx,sy,25,28,P.s6); b.vl(sx+25,sy+1,sy+28,P.s3); b.hl(sx+1,sx+25,sy+28,P.s3);
  M.microText(b,'SPEISE',sx+1,sy+2,P.r2); M.microText(b,'PLAN',sx+5,sy+8,P.r2);
  for (y=sy+15;y<sy+27;y+=3){ b.px(sx+2,y,P.m2); b.hl(sx+5,sx+5+6+((y*7)%9),y,P.m3); } b.px(sx+12,sy-1,P.r3);
  // Besuchszeiten: gelber Zettel
  var bx=p.x0+29, by=p.y0+3; b.rect(bx,by,25,21,P.y4); b.hl(bx,bx+24,by,P.y5); b.vl(bx+25,by+1,by+21,P.y2); b.hl(bx+1,bx+25,by+21,P.y2);
  M.microText(b,'BESUCH',bx+1,by+2,P.k2); M.microText(b,'10-18',bx+3,by+9,P.k1); M.microText(b,'UHR',bx+7,by+15,P.k2); b.px(bx+12,by-1,P.b2);
  // eine Kinderzeichnung (Schneemann) und ein Zettel mit Abrissstreifen
  var kx=p.x0+31, ky=p.y0+26; b.rect(kx,ky,13,6,P.s5); b.ellipse(kx+4,ky+4,1.6,1.6,P.s6); b.ellipse(kx+4,ky+2,1.2,1.2,P.s6); b.px(kx+4,ky+1,P.r3); b.hl(kx+1,kx+12,ky+5,P.g4); b.px(kx+10,ky+1,P.y4);
  var zx=p.x0+46, zy=p.y0+25; if (zx+5<p.x1){ b.rect(zx,zy,4,7,P.s6); for (x=zx;x<zx+4;x+=2) b.vl(x,zy+5,zy+6,P.s4); } }
function bench(b){ var B=BEN;
  R3.box(b,B.X0,B.X1,B.Y,B.Y+2,B.Z0,B.Z1,{top:P.w4,front:P.w2});
  [[B.X0+2,B.Z1-1],[B.X1-3,B.Z1-1],[B.X0+2,B.Z0+1],[B.X1-3,B.Z0+1]].forEach(function(l,i){ var a=R3.p(l[0],B.Y+2,l[1]), c=R3.p(l[0],FY,l[1]); b.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),i<2?P.m2:P.m1); });
  var bk0=rp(R3.p(B.X0,B.Y-14,B.Z0+0.5)), bk1=rp(R3.p(B.X1,B.Y-6,B.Z0+0.5)); b.rect(bk0[0],bk0[1],bk1[0]-bk0[0],3,P.w3); b.hl(bk0[0],bk1[0]-1,bk0[1],P.w4); b.rect(bk0[0],bk0[1]+5,bk1[0]-bk0[0],3,P.w3); b.hl(bk0[0],bk1[0]-1,bk0[1]+5,P.w4); }
function liftDoor(b,night){ var L=LIFT, x, y;
  b.rect(L.x0-3,L.y0-3,L.x1-L.x0+6,FY-L.y0+3,P.m2); b.hl(L.x0-3,L.x1+2,L.y0-3,P.m3);
  for (y=L.y0;y<FY;y++) for (x=L.x0;x<L.x1;x++){ var u=(x-L.x0)/(L.x1-L.x0), c=ra(R('m2 m3 m4 m3'),0.35+Math.sin(u*Math.PI*2+0.6)*0.25+(y-L.y0)/220,x,y); if (hash(x,y>>2)<0.04) c=P.m4; b.px(x,y,c); }
  var mid=rd((L.x0+L.x1)/2); b.vl(mid,L.y0,FY-1,P.m1); b.vl(mid+1,L.y0,FY-1,P.m4);
  // Anzeige über der Tür: Pfeil und Etage, Rufknopf daneben
  b.rect(mid-6,L.y0-10,13,6,P.k1); b.hl(mid-6,mid+6,L.y0-10,P.m1); M.microText(b,'E',mid+1,L.y0-9,night?P.r4:P.r3); b.px(mid-3,L.y0-9,P.r2); b.hl(mid-4,mid-2,L.y0-8,P.r2);
  var px=L.x1+3; b.rect(px,64,4,9,P.m3); b.vl(px+3,64,72,P.m1); b.rect(px+1,66,2,2,night?P.y4:P.s6); b.rect(px+1,69,2,2,P.m4); }
function stairDoor(b){ var q=M.wallQuad(SPEC,'R',STAIRU[0],STAIRU[1],STAIRU[2],STAIRU[3]), fr=M.wallQuad(SPEC,'R',STAIRU[0]-1.5,STAIRU[1]+1.5,STAIRU[2]-2,STAIRU[3]);
  b.poly(fr,P.m3);
  b.poly(q,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.k2; var lu=(w.u-STAIRU[0])/(STAIRU[1]-STAIRU[0]), lv=(w.v-STAIRU[2])/(STAIRU[3]-STAIRU[2]);
    // Blick ins Treppenhaus: eine Treppe steigt nach vorn an (Sägezahn der Wange), dahinter die helle Wand
    var n=6, st=Math.floor(lu*n), top=0.97-st*0.105, fr=lu*n-st;
    if (lv>top){ var c=(lv-top<0.022)?P.s6:((fr<0.12)?P.s2:P.s3); if (lv-top>0.022 && lv-top<0.05) c=P.s4; return c; }
    return (lu<0.12)?P.s3:((lv<0.08)?P.s3:P.s4); });
  var r0=M.wallPt(SPEC,'R',STAIRU[0]+3,62), r1=M.wallPt(SPEC,'R',STAIRU[1]-2,46); b.line(rd(r0[0]),rd(r0[1]),rd(r1[0]),rd(r1[1]),P.w3); b.line(rd(r0[0]),rd(r0[1])+1,rd(r1[0]),rd(r1[1])+1,P.w1);
  // die Tür steht offen (an die Wand geklappt, vorn), mit Glasstreifen
  var dq=M.wallQuad(SPEC,'R',STAIRU[1]+2,STAIRU[1]+14,STAIRU[2],STAIRU[3]-1); b.poly(dq,function(x,y){ var w=wallUV('R',x,y); if (!w) return P.m2; var lu=(w.u-STAIRU[1]-2)/12, lv=(w.v-STAIRU[2])/(STAIRU[3]-STAIRU[2]); if (lu>0.3&&lu<0.7&&lv>0.1&&lv<0.45) return P.b4; return (lu<0.1)?P.m4:P.m3; });
  var es=M.wallPt(SPEC,'R',(STAIRU[0]+STAIRU[1])/2,34); EXIT2=[rd(es[0]),rd(es[1])]; b.rect(EXIT2[0]-5,EXIT2[1]-2,11,5,P.g3); b.hl(EXIT2[0]-5,EXIT2[0]+5,EXIT2[1]-2,P.g4); b.rect(EXIT2[0]-3,EXIT2[1],5,1,P.s6); b.px(EXIT2[0]+1,EXIT2[1]-1,P.s6); b.px(EXIT2[0]+1,EXIT2[1]+1,P.s6); }
function leftWall(b){ // Landschaftsbild (Berge, See) und Desinfektionsspender
  var f=M.wallQuad(SPEC,'L',10,30,40,58); b.poly(f,P.w3); var g=M.wallQuad(SPEC,'L',11.5,28.5,41.5,56.5);
  b.poly(g,function(x,y){ var w=wallUV('L',x,y); if (!w) return P.b4; var t=(w.v-41.5)/15; if (t<0.35) return P.b4; if (t<0.6) return (Math.abs((w.u-20)*0.18)+t*2<1.3)?P.s5:P.g3; return (t<0.8)?P.b2:P.g2; });
  var d=rp(M.wallPt(SPEC,'L',36,66)); b.rect(d[0],d[1],3,7,P.s6); b.px(d[0]+1,d[1]+7,P.m3); b.vl(d[0]+2,d[1],d[1]+6,P.s4); }

// ---------------------------------------------------------------- Tannenbaum mit Lichterkette (Ebene, vorn links)
function treeBase(){ var p=R3.p(TREE.X,FY,TREE.Z); return [rd(p[0]),rd(p[1])]; }
function paintTree(w,day){ var bp=treeBase(), cx=bp[0], by=bp[1], top=by-TREE.h, x, y, i; TLIGHTS=[];
  // Topf (Terrakotta) und Ständer
  for (y=by-8;y<=by;y++){ var hw=5-((y>by-2)?1:0); for (x=cx-hw;x<=cx+hw;x++) w.px(x,y,(x<cx-hw+2)?P.t4:(x>cx+hw-2?P.t1:P.t3)); } w.hl(cx-6,cx+6,by-8,P.t4); w.hl(cx-5,cx+5,by-7,P.t2);
  w.rect(cx-1,by-12,3,5,P.w1);
  // Zweige: Etagen, unten breit
  for (y=top;y<by-10;y++){ var t=(y-top)/(by-10-top), tier=(t*6)%1, hw2=1+t*TREE.r*(0.62+tier*0.38);
    for (x=Math.floor(cx-hw2);x<=Math.ceil(cx+hw2);x++){ var u=(x-cx)/Math.max(1,hw2), edge=Math.abs(u)>0.82, c=(u<-0.3)?P.g3:(u>0.35?P.g1:P.g2);
      if (tier>0.82 && bayer(x,y)<0.6) c=P.g1; if (edge && hash(x,y)<0.45) continue; if (hash(x*1.7,y*2.1)<0.08) c=P.g4; w.px(x,y,c); } }
  w.px(cx,top-1,P.g3);
  // Lichterkette: Girlanden schräg um den Baum
  for (i=0;i<4;i++){ var y0=top+8+i*12; for (var s=0;s<=10;s++){ var t2=s/10, yy=rd(y0+t2*7+Math.sin(t2*Math.PI)*2), hw3=1+((yy-top)/(by-10-top))*TREE.r*0.9, xx=rd(cx-hw3+t2*hw3*2);
      if (s%2===0){ var col=((i+s)%3===0)?P.y5:(((i+s)%3===1)?P.y4:P.l0); TLIGHTS.push([xx,yy,col]); w.px(xx,yy,day?P.y3:col); } else w.px(xx,yy,P.g0); } } }

// ---------------------------------------------------------------- Empfangstheke (Ebene, vor den Leuten dahinter)
function paintDesk(w,night){ var D=DESK, x, y; DLIGHTS=[];
  R3.box(w,D.X0,D.X1,D.Y0+4,FY,D.Z0,D.Z1-2,{top:P.s5});                                                 // Schreibfläche dahinter
  R3.box(w,D.X0,D.X1,D.Y0,FY,D.Z1-2,D.Z1,{top:P.s6,front:function(xx,yy){ var f=(xx*3+(yy>>1))%11===0; return f?P.w3:P.w4; }});
  var f0=rp(R3.p(D.X0,D.Y0,D.Z1)), f1=rp(R3.p(D.X1,FY,D.Z1));
  for (x=f0[0];x<f1[0];x++){ w.px(x,f0[1],P.s6); w.px(x,f0[1]+1,P.s5); w.px(x,f0[1]+2,P.w2); w.px(x,f1[1]-1,P.w1); w.px(x,f1[1]-2,P.w2); }
  for (x=f0[0]+10;x<f1[0];x+=21){ for (y=f0[1]+4;y<f1[1]-3;y++) w.px(x,y,P.w3); }                      // Fugen der Front
  M.microText(w,'EMPFANG',rd((f0[0]+f1[0])/2)-13,f0[1]+9,P.w1);
  // Lichterkette an der Vorderkante
  for (x=f0[0]+2;x<f1[0]-1;x+=4){ var yy=f0[1]+3+((x>>2)%2); w.px(x,yy,P.g0); var col=((x>>2)%3===0)?P.y5:P.y4; DLIGHTS.push([x+1,yy+1,col]); w.px(x+1,yy+1,night?col:P.y3); }
  // auf der Theke: Weihnachtsstern im Topf, Klingel, Besucherbuch mit Stift; dahinter der Monitor (Rückseite)
  var pt=[f0[0]+9,f0[1]];
  w.rect(pt[0]-4,pt[1]-6,9,6,P.t3); w.hl(pt[0]-5,pt[0]+5,pt[1]-7,P.t4); w.vl(pt[0]+4,pt[1]-6,pt[1]-1,P.t1);
  [[-6,-11],[-3,-14],[1,-15],[5,-12],[7,-9],[-7,-8],[0,-10],[3,-9],[-4,-9]].forEach(function(o,i){ var lx=pt[0]+o[0], ly=pt[1]+o[1], red=i<6;
    w.ellipse(lx,ly,2.2,1.4,red?function(xx,yy){ return (xx<lx)?P.r4:P.r3; }:P.g3); w.px(lx+(o[0]>0?2:-2),ly+1,red?P.r2:P.g2); });
  w.px(pt[0],pt[1]-11,P.y4); w.px(pt[0]+1,pt[1]-12,P.y5); w.px(pt[0]-1,pt[1]-12,P.y4);
  var bl=[f0[0]+30,f0[1]]; w.hl(bl[0]-2,bl[0]+2,bl[1]-1,P.m2); w.hl(bl[0]-1,bl[0]+1,bl[1]-2,P.m4); w.px(bl[0],bl[1]-3,P.m3);
  var gb=[f0[0]+40,f0[1]]; w.poly([[gb[0],gb[1]-1],[gb[0]+12,gb[1]-2],[gb[0]+13,gb[1]],[gb[0]+1,gb[1]+1]],P.s6); w.line(gb[0]+6,gb[1]-1,gb[0]+7,gb[1],P.s3); w.line(gb[0]+14,gb[1]-1,gb[0]+18,gb[1]-3,P.b1);
  var mn=rp(R3.p(D.X1-7,D.Y0+4,D.Z0+8)); w.rect(mn[0]-7,mn[1]-12,14,10,P.m2); w.hl(mn[0]-7,mn[0]+6,mn[1]-12,P.m3); w.vl(mn[0]+6,mn[1]-12,mn[1]-3,P.m1); w.rect(mn[0]-1,mn[1]-2,3,2,P.m1);
  MON=[mn[0],mn[1]-12]; }
var MON=[0,0];

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), wea=weaOf(GS), night=isNight(S,GS,tod), x, y;
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  // Deckenspots
  for (var zi=0;zi<3;zi++) for (var xi=0;xi<4;xi++){ var q=rp(R3.p(76+xi*56,RECT[1],10+zi*26)); b.ellipse(q[0]+0.5,q[1]+0.5,2.4+zi*0.5,0.9+zi*0.25,night?P.m1:P.l1); b.hl(q[0]-2,q[0]+2,q[1]-1,P.s3); }
  glassDoor(b,tod,wea,night); lettering(b); keyBox(b); rescuePlan(b); pinBoard(b); bench(b); liftDoor(b,night); stairDoor(b); leftWall(b);
  // Heizkörper unter dem Seitenlicht, eine Uhr über der Pinnwand
  M.prop.clock(b,211,23,4,10,10); b.ellipse(211.5,23.5,4.2,4.2,P.m1); b.ellipse(211.5,23.5,3.2,3.2,P.s6); b.line(211,23,211,21,P.k1); b.line(211,23,213,23,P.k1);
  // Licht
  var notGlass=function(xx,yy){ return !GLM[yy*W+xx]; };
  if (!night) M.light(b,dayFn(wea),0,0,notGlass);
  else { shadeNight(b,0,0,notGlass); b.rect(EXIT1[0]-9,EXIT1[1]-3,19,7,P.g4); b.hl(EXIT1[0]-9,EXIT1[0]+9,EXIT1[1]-3,P.g5); paintExitFig(b); if (EXIT2){ b.rect(EXIT2[0]-5,EXIT2[1]-2,11,5,P.g4); b.rect(EXIT2[0]-3,EXIT2[1],5,1,P.s6); } }
  return b; }
function paintExitFig(b){ var ex=EXIT1[0]-9, ey=EXIT1[1]-3; [[3,1],[3,2],[2,3],[4,3],[3,4],[2,5],[4,5],[5,2],[1,2]].forEach(function(p){ b.px(ex+2+p[0],ey+p[1],P.l1); });
  b.rect(ex+9,ey+2,2,3,P.l1); b.rect(ex+12,ey+3,4,1,P.l1); b.px(ex+15,ey+2,P.l1); b.px(ex+15,ey+4,P.l1); b.px(ex+16,ey+3,P.l1); }
function layers(S,GS,tod){ var L=[], night=isNight(S,GS,tod);
  var dr=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), l=M.layer(dr[0]-2,dr[1]-18,dr[2]+4,dr[3]+20,dr[1]+dr[3]), w=M.lw(l);
  paintDesk(w,night);
  if (!night) M.light(l,dayFn(weaOf(GS)),l.ox,l.oy); else { shadeNight(l,l.ox,l.oy); DLIGHTS.forEach(function(p){ w.px(p[0],p[1],p[2]); }); }
  L.push(l);
  var bp=treeBase(), t=M.layer(bp[0]-TREE.r-3,bp[1]-TREE.h-3,TREE.r*2+7,TREE.h+5,bp[1]), tw=M.lw(t);
  paintTree(tw,!night);
  if (!night) M.light(t,dayFn(weaOf(GS)),t.ox,t.oy); else { shadeNight(t,t.ox,t.oy); TLIGHTS.forEach(function(p){ tw.px(p[0],p[1],p[2]); }); }
  L.push(t);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Lichterketten, Schnee und Feuerwerk hinter dem Glas, Monitor
// Feuerwerk: drei Startplätze, je mit eigenem Takt; aufsteigender Funke, Aufblitzen, Büschel mit Funkenregen (nur im Glas)
var FWC=[[P.r3,P.r4],[P.y3,P.y5],[P.x4,P.x6],[P.v3,P.v5],[P.g4,P.s6],[P.d4,P.d6]];
function burst(i,t){ var per=2.9+hash(i,71)*2.4, ph=t/per+hash(i,72), cyc=Math.floor(ph), f=ph-cyc;
  return {cyc:cyc,f:f,on:hash(cyc,i*7+5)<0.72,x:hash(cyc,i*3+1),y:hash(cyc,i*3+2),c:FWC[Math.floor(hash(cyc,i*3+3)*FWC.length)],n:14+Math.floor(hash(cyc,i*3+4)*8)}; }
function fireworksDraw(fb,t,x0,y0,x1,y1,ok){ for (var i=0;i<3;i++){ var B=burst(i,t), k; if (!B.on) continue; var cx=x0+4+B.x*(x1-x0-8), cy=y0+3+B.y*Math.max(1,y1-y0-10);
    if (B.f<0.16){ var ty=y1+(cy-y1)*(B.f/0.16); for (k=0;k<3;k++){ var tx=rd(cx), tyy=rd(ty+k*1.5); if (ok(tx,tyy)) fb.px(tx,tyy,k===0?P.y5:P.y2); } continue; }
    var g=(B.f-0.16)/0.62; if (g>1) continue;
    if (g<0.08) for (var yy=Math.floor(cy-5);yy<=cy+5;yy++) for (var xx=Math.floor(cx-6);xx<=cx+6;xx++){ var d=Math.hypot(xx-cx,(yy-cy)*1.2)/6; if (d<1 && ok(xx,yy) && bayer(xx,yy)<(1-d)*0.7) fb.px(xx,yy,M.UP[fb.get(xx,yy)]); }
    var r=2+Math.sqrt(g)*9;
    for (k=0;k<B.n;k++){ var a=k/B.n*Math.PI*2+B.cyc*1.3, sp=0.75+hash(B.cyc+k,i)*0.35, rr=r*sp, X=rd(cx+Math.cos(a)*rr), Y=rd(cy+Math.sin(a)*rr*0.85+g*g*6);
      if (!ok(X,Y)) continue; if (g>0.55 && bayer(X,Y+Math.floor(t*8))>1.5-g*1.2) continue;
      fb.px(X,Y,g<0.18?P.l1:(g<0.5?B.c[1]:B.c[0]));
      var X2=rd(cx+Math.cos(a)*rr*0.78), Y2=rd(cy+Math.sin(a)*rr*0.66+g*g*5); if (g<0.6 && ok(X2,Y2)) fb.px(X2,Y2,B.c[0]); } } }
function dyn(fb,v,S,GS){ var t=v.t, night=isNight(S,GS,v.tod), wea=weaOf(GS), i;
  // Lichterketten: sachtes Blinken, nachts deutlich
  var all=TLIGHTS.concat(DLIGHTS); for (i=0;i<all.length;i++){ var p=all[i], s=Math.sin(t*(0.9+(i%5)*0.23)+i*1.7); if (s>0.55) fb.px(p[0],p[1],night?P.l1:P.y4); else if (s<-0.75) fb.px(p[0],p[1],night?P.y2:P.y2); }
  // Monitor am Empfang (tags): ein schwacher Schein über dem Rand
  if (!night && Math.floor(t*2)%5===0) fb.px(MON[0]-4,MON[1]-1,P.b4);
  var ok=function(x,y){ return x>=0&&y>=0&&x<W&&y<H&&GLM[y*W+x]===1; };
  if (wea==='snow' && !night) M.snow(fb,t,{n:26,mask:function(x,y){ return ok(x,y); },col:P.s6,col2:P.s5,wind:5});
  if (fireworks(S,GS)) fireworksDraw(fb,t,GL.x0+2,GL.y0+2,GL.x1-2,HZ-2,ok); }
// Geistersicht: Eisblumen auf dem Glas, von den Rändern her
function ghost(fb,v,S,GS){ var t=v.t; for (var y=GL.y0;y<FY;y++) for (var x=GL.x0;x<=GL.x1;x++){ if (!GLM[y*W+x]) continue; var e=Math.min(x-GL.x0,GL.x1-x,(y-GL.y0)*1.3,(FY-y)*0.7), f=fbm(x*0.4,y*0.4,3)*10-e*0.9+Math.sin(x*1.3+y*0.7)*1.2;
    if (f>2.6+Math.sin(t*0.3)*0.4) fb.d[y*W+x]=(f>5)?P.x6:(f>3.8?P.x5:P.x4); else if (f>1.8 && bayer(x,y)<0.3) fb.d[y*W+x]=P.x3; } }

// ---------------------------------------------------------------- Lauffläche, Figurenlicht
function walk(x,y){ if (y<114||y>139||x<10||x>310) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+4||f.X>RECT[2]-3) return false;
  if (Math.abs(f.X-TREE.X)<14 && Math.abs(f.Z-TREE.Z)<10) return false; return true; }
function actorLut(a,S,GS,tod){ if (!isNight(S,GS,tod)) return null; var w=warmAt(a.x,a.y-26), g=greenAt(a.x,a.y-26), Ls=w>=g?levels('warm'):levels('green'); var f=Math.max(w,g,0.18)*(Ls.length-1); return Ls[Math.min(Ls.length-1,Math.round(f))].a; }
var DKR=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), TB=treeBase();
var SQ=qrect(M.wallQuad(SPEC,'R',STAIRU[0]-1.5,STAIRU[1]+1.5,STAIRU[2]-2,STAIRU[3]));
M.defineArt('heim',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{
    door:[GL.x0-2,GL.y0-8,GL.x1-GL.x0+5,FY-GL.y0+8],
    reception:[DKR[0],DKR[1]-14,DKR[2],DKR[3]+14],
    elevator:[LIFT.x0-4,LIFT.y0-11,LIFT.x1-LIFT.x0+12,FY-LIFT.y0+11],
    stairs:SQ,
    board:[BRD.x0-2,BRD.y0-2,BRD.x1-BRD.x0+4,BRD.y1-BRD.y0+4],
    tree:[TB[0]-TREE.r-1,TB[1]-TREE.h-2,TREE.r*2+3,TREE.h+3],
    bench:(function(){ var r=R3.rect(BEN.X0,BEN.X1,BEN.Y-14,FY,BEN.Z0,BEN.Z1); return [r[0],r[1],r[2],r[3]]; })()
  },
  stands:{ door:[70,116,'B'], reception:[142,116,'B'], elevator:[258,116,'B'], stairs:[294,120,'R'], board:[206,116,'B'], tree:[52,120,'L'], bench:[210,116,'B'] },
  actorPos:{ empfang:[EMPF[0],EMPF[1],'R'], kevin:[KEVIN[0],KEVIN[1],'R'] },
  start:[70,119,'R'], entries:{ map:[70,119,'R'], heim_flur:[258,118,'L'] }
});
})(M);
