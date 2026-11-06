/* ===== rooms/art/friedamt.js — Städtische Friedhöfe, Verwaltung: ein Amtszimmer in einem Altstadthaus.
   Hohe Decke mit Stuckleiste und einer Opalglaslampe, cremefarbene Wände über einem graugrünen Ölsockel, abgetretenes
   Fischgrätparkett. Links in der Seitenwand die schwere Holztür (Sprechzeiten-Zettel daneben), ein Kleiderständer mit
   grauem Mantel und Hut. Hinten links der hohe Aktenschrank aus Holz (oben Glastüren mit Ordnern, obenauf Archivkartons),
   daneben der Wandkalender mit einem Winterfoto vom Friedhof (Bäume, Schnee, schlichte runde Steine, keine Kreuze).
   In der Mitte das hohe Kastenfenster mit Oberlicht: gegenüber ein Altstadthaus mit Schnee auf Gesimsen und Dach
   (Wetter: klar, Tauwetter, Schneefall, Nebel), davor ein gusseiserner Heizkörper; bei klarem Wetter fällt ein schräges
   Sonnenfeld aufs Parkett. Rechts das Regal mit den Formularfächern. Vorn der graue Amtsschreibtisch mit Aktenstapeln,
   Telefon, Bildschirm, Schreibtischlampe, Stempelkarussell und einer aufgeschlagenen Akte; Herr Obermaier sitzt rechts
   dahinter (Blick nach links), links davor der Besucherstuhl. Rechts vorn eine Yuccapalme im Topf. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[150,54], RECT=[40,18,262,96], F=100, FY=96;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOORU=[8,34,30,96];                                 // Tür in der linken Wand (Tiefe u0,u1; Höhe oben, unten)
var CAB={X0:46,X1:90,Y0:30,Z0:1,Z1:13};                 // Aktenschrank
var CAL={x0:98,y0:30,w:28,h:40};                        // Wandkalender
var WIN={x0:136,x1:186,y0:24,y1:76};                    // Fenster (Glas innen)
var RACK={x0:204,x1:252,y0:36,y1:72};                   // Formularfächer
var DESK={X0:140,X1:216,Y0:81,Z0:28,Z1:44};             // Schreibtisch
var OBER=[234,110], CHAIR=[116,111];                    // Obermaier (Hüfte x, Füße y), Besucherstuhl
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
// Wetter: unbekannte Schlüssel wie 'snowlie'
function wea(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun')?w:'snowlie'; }
// Mikroschrift mit Umlautpunkten
function mt(b,s,x,y,c){ var cx=x; for (var i=0;i<s.length;i++){ var ch=s[i], base={'Ä':'A','Ö':'O','Ü':'U'}[ch]||ch; M.microText(b,base,cx,y,c); if (base!==ch){ b.px(cx,y-2,c); b.px(cx+2,y-2,c); } cx+=M.microWidth(base)+1; } }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var COOL=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.9+L*0.05, g*0.94+L*0.06+3, b*0.98+L*0.08+10]; });
var WARM=M.tintMake(function(r,g,b){ return [r*0.96+16, g*0.86+8, b*0.7]; });
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.68+L*0.36+22, g*0.58+L*0.3+12, b*0.38+L*0.14+2]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
var WLF=1;   // Stärke des Fensterlichts (Wetter)
function winAt(x,y){ var dx=(x-160)/150, dy=(y-96)/80, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.6)*WLF*0.8:0; }
function lampAt(x,y){ var a=0, dx=(x-180)/30, dy=(y-93)/9, d=dx*dx+dy*dy; if (d<1) a=Math.pow(1-d,0.9)*0.8; var g=Math.hypot((x-181)/6,(y-78)/5); if (g<1) a=Math.max(a,1-g*0.4); return a; }
function ceilAt(x,y){ var dx=(x-150)/150, dy=(y-70)/80, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,0.9):0; }
function vig(x,y){ var cx=(x-158)/190, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*2.0; }
var SUNP=0;  // Sonnenfeld am Boden (nur klar)
function sunAt(X,Z){ if (!SUNP||Z<4) return 0; var xw=X+0.32*Z, yw=FY-0.36*Z; if (xw<WIN.x0+2||xw>WIN.x1-2||yw<WIN.y0+2||yw>WIN.y1-2) return 0;
  if (Math.abs(xw-(WIN.x0+WIN.x1)/2)<1.6) return 0; if (Math.abs(yw-(WIN.y0+16))<1.4) return 0; if (Math.abs(yw-(WIN.y0+15))<1) return 0; return SUNP; }
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.45+ceilAt(x,y)*0.3+winAt(x,y)*0.6+lampAt(x,y)*0.4+vig(x,y)*1.0; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
      var wl=winAt(X,Y), la=lampAt(X,Y); if (la>0.55 && bayer(X,Y)<(la-0.55)*1.6) b.d[k]=M.tintPx(WARM,c,X,Y); else if (wl>0.3 && bayer(X,Y)<(wl-0.3)*0.25) b.d[k]=M.tintPx(COOL,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,Math.max(lampAt(X2,Y2),ceilAt(X2,Y2)*0.7)+(tod==='night'?0:winAt(X2,Y2)*0.3))*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen
function wall(u,v,x,y,dim){ var c;
  if (v>=93) c=(v===93)?P.w2:P.w1;                                                     // Fußleiste
  else if (v>=66){ c=(v===66)?P.m1:((v===67)?P.g5:P.e4); var f=fbm(u*0.05,v*0.09); if (f>0.62 && bayer(x,y)<(f-0.62)*3) c=P.e3; if (v>88 && hash(u>>1,v)<0.12) c=P.e3; }   // Ölsockel
  else { var f2=fbm(u*0.03,v*0.05); c=(f2>0.64 && bayer(x,y)<(f2-0.64)*3)?P.s4:P.s5; if (v<RECT[1]+4) c=(v<RECT[1]+2)?P.s6:P.s4; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ return wall(u*1.5+(sd==='L'?0:500),v+RECT[1],x,y,sd==='L'?1:0); }
// Fischgrätparkett (Zickzack in Spalten), abgetreten zwischen Tür und Schreibtisch
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X+700, Z=f.Z, Lc=11, col=Math.floor(X/Lc), fx=X-col*Lc, sg=(col&1)?-1:1, s=(Z+(sg>0?fx:(Lc-fx))*0.9)/8.5, st=Math.floor(s), fs=s-st;
  var t=hash(col,st), c=t<0.6?P.w3:P.w4; if (t>0.93) c=P.w2; if (fx<0.7||fs<0.2) c=P.w2;
  var g=fbm(f.X*0.04,Z*0.06); if (g>0.66 && bayer(x,y)<(g-0.66)*2) c=M.DN[c];
  var wear=Math.exp(-Math.pow((Z-62)/16,2))*Math.exp(-Math.pow((f.X-110)/60,2)); if (wear>0.35 && bayer(x,y)<(wear-0.35)*0.6 && c!==P.w2) c=M.UP[c];
  var sp=sunAt(f.X,Z); if (sp>0){ c=M.UP[c]; if (bayer(x,y)<0.35) c=M.UP[c]; }
  return c; }
function ceilTex(xb,d,x,y){ var c=P.s5; if (d<3) c=(d===0)?P.s4:P.s6; else if (d<5) c=P.s3; else if (d<6) c=P.s6; return c; }

// ---------------------------------------------------------------- Blick aus dem Fenster: Altstadthaus gegenüber
var WM=new Uint8Array(W*H);    // 1 = Glas
function outside(x,y,w,tod){ var lx=x-WIN.x0, ly=y-WIN.y0, night=tod==='night', c;
  var SK={snowlie:'b2 b3 b4 b5',sun:'b2 b3 b4 b5 s6',thaw:'m3 m4 s4 m4',snow:'m4 s4 s5 s4',fog:'s4 s5 s5'}[w];
  if (night) SK='k1 n0 n1 n2';
  var roof=13+Math.round(Math.sin(lx*0.21)*0.6)+(lx>34?-3:0);
  c=ra(R(SK),0.2+ly/28,x,y);
  if (ly>=roof){ var dy=ly-roof;
    if (dy<7){ // Dach mit Schnee, Gaube
      var snow=(w==='thaw')?(hash(lx,ly)<0.45?P.s3:((dy+lx)%3===0?P.t1:P.t2)):((dy<2)?P.s6:(hash(lx>>1,ly)<0.85?P.s5:P.t2)); c=snow;
      if (lx>=14 && lx<22 && dy>=1 && dy<7){ c=(dy===1)?((w==='thaw')?P.s3:P.s6):((lx===14||lx===21)?P.s4:((dy>=3 && lx>15 && lx<20)?(night?((lx+dy)%2?P.y3:P.y2):P.m1):P.s4)); }
      if (lx>=40 && lx<43 && dy<4){ c=(dy===0)?P.s6:P.t1; } }
    else if (dy<8){ c=P.s2; }                                                                                     // Traufgesims
    else { // Fassade: ocker, Fensterachsen mit weißen Rahmen, Gesimse mit Schnee
      var fy=dy-8, wx=(lx+3)%14, wy=fy%17, fac=(w==='thaw')?R('e2 e3 e3 e4'):R('e3 e4 e4 s4');
      c=ra(fac,0.55+(fbm(lx*0.2,ly*0.2)-0.5)*0.3-(w==='thaw'&&hash(lx,7)<0.3?0.25:0),x,y);
      if (wy===0){ c=(w==='thaw')?P.s3:P.s6; } else if (wy===1){ c=P.e2; }                                         // Gesims mit Schnee, Schatten
      else if (wx>=4 && wx<11 && wy>=4 && wy<15){ var ix=wx-4, iy=wy-4;
        if (ix===0||ix===6||iy===0) c=P.s5; else if (ix===3) c=P.s4; else if (iy===4) c=P.s4;
        else { c=night?(hash(Math.floor((lx+3)/14),Math.floor(fy/17))<0.5?P.y3:P.n1):(((ix+iy)%5===0)?P.m3:P.m1); }
        if (iy===11){ c=(w==='thaw')?P.s3:P.s6; } }
      if (wy===15||wy===16){ if (wx>=3 && wx<12) c=(wy===15)?((w==='thaw')?P.s4:P.s6):P.e2; } }                  // Fensterbank mit Schnee
    if (w==='snowlie'||w==='sun'){ if (ly>=roof+8 && (lx+ly*0.6)%40<9 && ly<roof+30) c=M.DN[c]; } }
  // Papierstern im Fenster gegenüber
  if (!night && lx>=31 && lx<36 && ly>=roof+13 && ly<roof+18){ var sx=lx-33, sy=ly-(roof+15); if (Math.abs(sx)+Math.abs(sy)<=1 || (sx===0&&Math.abs(sy)<=2) || (sy===0&&Math.abs(sx)<=2)) c=P.s6; }
  return c; }
function paintWindow(b,w,tod){ var x, y, x0=WIN.x0, x1=WIN.x1, y0=WIN.y0, y1=WIN.y1;
  // Laibung (dicke Altbaumauer), Fensterbank, Rahmen
  b.rect(x0-6,y0-5,x1-x0+12,y1-y0+8,P.s4); b.hl(x0-6,x1+5,y0-5,P.s5);
  for (y=y0-4;y<y1+2;y++){ b.px(x0-6,y,P.s3); b.px(x0-5,y,P.s4); b.px(x1+5,y,P.s3); }
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var o=outside(x,y,w,tod); b.px(x,y,o); WM[y*W+x]=1; }
  // Dunst: Nebel verschluckt das Haus gegenüber fast ganz, Schneefall macht es weich
  var fa={fog:0.8,snow:0.34,thaw:0.12}[w]||0; if (fa && tod==='day') M.fogBake(b,function(xx,yy){ return WM[yy*W+xx]?fa*(0.85+0.15*Math.sin(xx*0.2+yy*0.07)):0; },{col:w==='fog'?P.s4:P.s5,x:x0,y:y0,w:x1-x0,h:y1-y0});
  var fx=[x0,x0+1,rnd((x0+x1)/2)-1,rnd((x0+x1)/2),x1-2,x1-1], ty=y0+15;
  for (y=y0-2;y<y1+1;y++){ fx.forEach(function(q,i){ b.px(q,y,(i%2)?P.s4:P.s6); WM[y*W+q]=0; }); }
  for (x=x0-2;x<x1+2;x++){ [y0-2,y0-1,ty,ty+1,y1-1,y1].forEach(function(q,i){ b.px(x,q,(i%2)?P.s4:P.s6); WM[q*W+x]=0; }); }
  // innere Flügelrahmen (Kastenfenster: zweiter Rahmen sichtbar als feine Linie)
  for (y=ty+2;y<y1-1;y++){ b.px(x0+3,y,P.s5); b.px(x1-4,y,P.s5); WM[y*W+x0+3]=0; WM[y*W+x1-4]=0; }
  b.px(rnd((x0+x1)/2)+1,ty+18,P.m3); b.px(rnd((x0+x1)/2)+1,ty+19,P.y2); b.px(rnd((x0+x1)/2)-2,ty+18,P.m3); b.px(rnd((x0+x1)/2)-2,ty+19,P.y2);   // Griffe
  // Fensterbank innen (Stein) und Heizkörper
  b.rect(x0-9,y1+1,x1-x0+18,3,P.s5); b.hl(x0-9,x1+8,y1+1,P.s6); b.hl(x0-9,x1+8,y1+3,P.s3);
  for (y=y1+7;y<y1+18;y++) for (x=x0-2;x<x1+2;x++){ var fu=(x-x0)%4; b.px(x,y,fu===0?P.s2:P.s4); }
  b.hl(x0-2,x1+1,y1+7,P.s4); b.hl(x0-2,x1+1,y1+17,P.s2); b.rect(x1+2,y1+12,2,3,P.m2); b.px(x1+3,y1+11,P.r2);
  // Rollo halb herunter
  b.rect(x0,y0-1,x1-x0,1,P.m2); for (x=x0+2;x<x1-2;x++) for (y=y0+1;y<y0+9;y++){ b.px(x,y,(y===y0+8)?P.e2:(((y+x*0)%3===0)?P.e3:P.e4)); WM[y*W+x]=0; } b.px(rnd((x0+x1)/2),y0+10,P.e2); b.px(rnd((x0+x1)/2),y0+11,P.e1); WM[(y0+10)*W+rnd((x0+x1)/2)]=0; WM[(y0+11)*W+rnd((x0+x1)/2)]=0; }

// ---------------------------------------------------------------- Kalender mit Friedhofsfoto (Winter, Bäume, schlichte runde Steine)
function calendar(b){ var c=CAL, x, y, x0=c.x0, y0=c.y0;
  b.px(x0+c.w/2,y0-2,P.m2); b.line(x0+c.w/2,y0-2,x0+3,y0,P.k2); b.line(x0+c.w/2,y0-2,x0+c.w-4,y0,P.k2);
  b.rect(x0,y0,c.w,c.h,P.s6); b.vl(x0+c.w,y0+1,y0+c.h,P.s3); b.hl(x0+1,x0+c.w,y0+c.h,P.s3);
  var px0=x0+2, py0=y0+2, pw=c.w-4, ph=17;
  b.fn(px0,py0,pw,ph,function(xx,yy){ var u=xx-px0, v=yy-py0, cc;
    cc=(v<9)?ra(R('b3 b4 s5 s6'),0.2+v/11,xx,yy):(hash(xx,yy)<0.12?P.s5:P.s6);                      // Winterhimmel, Schnee
    if (v>=7 && v<10 && ((u*5+3)%7<4)) cc=(v===7)?P.g2:P.g1;                                        // Hecke hinten
    if (v===10) cc=P.s4;
    return cc; });
  // kahle Bäume: Stamm und Äste
  [[px0+4,py0+12,9],[px0+19,py0+11,10]].forEach(function(t){ var tx=t[0], ty=t[1], th=t[2]; b.vl(tx,ty-th,ty,P.k2); b.line(tx,ty-th+3,tx-3,ty-th,P.m1); b.line(tx,ty-th+5,tx+3,ty-th+1,P.m1); b.line(tx,ty-th+2,tx+2,ty-th-1,P.m1); b.px(tx-2,ty-th-1,P.m2); b.px(tx+1,ty-th-2,P.m2); b.px(tx-4,ty-th+1,P.m2); });
  // schlichte runde Steine mit Schneekappe
  [[px0+8,py0+14],[px0+13,py0+15],[px0+23,py0+14]].forEach(function(s){ b.rect(s[0]-1,s[1]-3,3,4,P.m3); b.vl(s[0]+1,s[1]-3,s[1],P.m2); b.px(s[0],s[1]-4,P.s6); b.px(s[0]-1,s[1]-3,P.s6); b.px(s[0]+1,s[1]-3,P.s5); b.hl(s[0]-1,s[0]+2,s[1]+1,P.s4); });
  b.rect(px0,py0+ph,pw,4,P.r3); M.microText(b,'2011',px0+(pw>>1)-7,py0+ph,P.s6);
  for (y=0;y<5;y++) for (x=0;x<7;x++){ var gx=px0+1+x*3, gy=py0+ph+6+y*3; if (y===0&&x<3) continue; if (y===4&&x>5) continue; b.px(gx,gy,(x>=5)?P.r3:P.m2); if (y===3&&x===3) b.px(gx+1,gy,P.r2); } }

// ---------------------------------------------------------------- Formularfächer
function rack(b){ var r=RACK, x, y, cols=4, rows=4, cw=(r.x1-r.x0)/cols, rh=(r.y1-r.y0)/rows;
  b.rect(r.x0-2,r.y0-2,r.x1-r.x0+4,r.y1-r.y0+4,P.w2); b.hl(r.x0-2,r.x1+1,r.y0-2,P.w4); b.vl(r.x1+1,r.y0-1,r.y1+1,P.w1);
  for (var j=0;j<rows;j++) for (var i=0;i<cols;i++){ var x0=rnd(r.x0+i*cw), y0=rnd(r.y0+j*rh), x1=rnd(r.x0+(i+1)*cw)-1, y1=rnd(r.y0+(j+1)*rh)-1;
    b.rect(x0,y0,x1-x0,y1-y0,P.w0); var sh=2+Math.floor(hash(i,j)*4), col=[P.s6,P.s5,P.g5,P.r4,P.y4,P.b4][Math.floor(hash(i+3,j)*6)];
    for (y=y1-sh;y<y1;y++){ b.hl(x0+1,x1-2,y,(y%2)?col:M.DN[col]); } b.hl(x0+1,x1-2,y1-sh,M.UP[col]);
    b.hl(x0,x1,y1,P.w3); b.rect(rnd((x0+x1)/2)-2,y1,5,1,P.s6); }
  for (i=1;i<cols;i++) b.vl(rnd(r.x0+i*cw)-1,r.y0,r.y1,P.w3);
  mt(b,'FORMULARE',r.x0+(r.x1-r.x0)/2-17|0,r.y0-9,P.m1);
  // Unterschrank
  b.rect(r.x0-2,r.y1+3,r.x1-r.x0+4,93-r.y1-3,P.w2); b.hl(r.x0-3,r.x1+2,r.y1+3,P.w4); b.vl(rnd((r.x0+r.x1)/2),r.y1+5,92,P.w1); b.px(rnd((r.x0+r.x1)/2)-2,r.y1+12,P.y3); b.px(rnd((r.x0+r.x1)/2)+2,r.y1+12,P.y3);
  // Ablagekörbe obenauf (Postein- und -ausgang)
  b.rect(r.x0+4,r.y1+0,14,3,P.m2); b.hl(r.x0+5,r.x0+16,r.y1-1,P.s6); b.rect(r.x0+30,r.y1,14,3,P.m2); b.hl(r.x0+31,r.x0+42,r.y1-1,P.e4); }

// ---------------------------------------------------------------- Aktenschrank
function cabinet(b){ var C=CAB, x, y;
  R3.box(b,C.X0,C.X1,C.Y0,FY,C.Z0,C.Z1,{top:P.w3,front:P.w2,left:P.w1});
  var f0=rp(R3.p(C.X0,C.Y0,C.Z1)), f1=rp(R3.p(C.X1,FY,C.Z1)), mid=rnd((f0[0]+f1[0])/2), gy1=f0[1]+rnd((f1[1]-f0[1])*0.58);
  b.hl(f0[0],f1[0]-1,f0[1],P.w4); b.hl(f0[0]-1,f1[0],f0[1]+1,P.w3);
  // Glastüren oben mit Ordnern (Rücken mit Etiketten), unten Holztüren
  for (var s=0;s<2;s++){ var gx0=(s?mid+1:f0[0]+2), gx1=(s?f1[0]-3:mid-1), shH=rnd((gy1-f0[1]-4)/3);
    for (var r=0;r<3;r++){ var sy0=f0[1]+3+r*shH, sy1=sy0+shH-1; b.rect(gx0,sy0,gx1-gx0+1,shH,P.w0);
      for (x=gx0+1;x<=gx1-1;x+=3){ var col=[P.m2,P.b1,P.r2,P.e3,P.g3,P.m3][Math.floor(hash(x,r+s*7)*6)], tall=sy1-1-(hash(x+1,r)<0.3?1:0); if (hash(x,r*3+s)<0.08) continue;
        b.vl(x,sy0+2+(sy1-1-tall),sy1,col); b.vl(x+1,sy0+2+(sy1-1-tall),sy1,M.DN[col]); b.px(x,sy0+(sy1-sy0>>1)+1,P.s6); b.px(x+1,sy0+(sy1-sy0>>1)+1,P.s5); b.px(x,sy1-2,P.k2); }
      b.hl(gx0,gx1,sy1,P.w3); }
    for (y=f0[1]+3;y<gy1;y++){ if ((y+gx0)%9<2){ b.px(gx0+2+((y*3)%(gx1-gx0-3)),y,P.s5); } }               // Glasglanz
    b.rect(gx0,gy1+2,gx1-gx0+1,f1[1]-gy1-6,P.w3); b.hl(gx0,gx1,gy1+2,P.w4); b.vl(gx1,gy1+2,f1[1]-5,P.w1);
    b.rect(gx0+2,gy1+5,gx1-gx0-3,f1[1]-gy1-12,P.w2); b.hl(gx0+2,gx1-2,gy1+5,P.w1); }
  b.vl(mid,f0[1]+2,f1[1]-4,P.w1); b.px(mid-2,gy1+8,P.y3); b.px(mid+2,gy1+8,P.y3); b.px(mid+2,gy1-6,P.y4);
  b.hl(f0[0],f1[0]-1,f1[1]-3,P.w1); b.hl(f0[0],f1[0]-1,f1[1]-2,P.w0);
  // Archivkartons obenauf
  var tp=rp(R3.p(C.X0+4,C.Y0,C.Z0+6)); [[0,10,8,P.s3],[11,9,6,P.e4],[22,12,9,P.s3]].forEach(function(q){ var bx=tp[0]+q[0], bh=q[2]; b.rect(bx,tp[1]-bh,q[1],bh,q[3]); b.hl(bx,bx+q[1]-1,tp[1]-bh,M.UP[q[3]]); b.vl(bx+q[1]-1,tp[1]-bh,tp[1]-1,M.DN[q[3]]); b.rect(bx+2,tp[1]-bh+2,q[1]-4,2,P.s6); });
  CABR=R3.rect(C.X0,C.X1,C.Y0,FY,C.Z0,C.Z1); CABR=[CABR[0],CABR[1]-10,CABR[2],CABR[3]+10]; }
var CABR=[0,0,0,0];

// ---------------------------------------------------------------- Stühle, Kleiderständer, Uhr, Zettel
function visitorChair(b,x,fy){ var sy=fy-13, C=R('w0 w1 w2 w3');   // Holzstuhl, Lehne links (Blick nach rechts)
  b.line(x-4,sy+2,x-5,fy,C[1]); b.line(x+4,sy+2,x+5,fy,C[1]); b.line(x+2,sy+2,x+3,fy-1,C[0]); b.hl(x-4,x+4,sy+7,C[0]);
  b.rect(x-5,sy,11,3,P.g2); b.hl(x-5,x+5,sy,P.g4); b.hl(x-5,x+5,sy+2,C[1]);
  b.vl(x-6,sy-15,sy+2,C[2]); b.vl(x-5,sy-15,sy-1,C[3]); b.rect(x-7,sy-14,3,7,C[2]); b.hl(x-7,x-5,sy-14,C[3]); b.px(x-6,sy-16,C[3]); }
function officeChair(b,x,fy){ var sy=fy-13, bx=x+6;
  b.rect(x-5,sy,11,3,P.k2); b.hl(x-5,x+5,sy,P.m1); b.rect(bx,sy-19,4,18,P.k2); b.vl(bx,sy-19,sy-2,P.m1); b.hl(bx,bx+3,sy-19,P.m2);
  b.vl(x,sy+3,fy-3,P.m2); b.vl(x+1,sy+3,fy-3,P.m0); b.line(x-6,fy-1,x+7,fy-1,P.k1); b.line(x-4,fy-2,x+5,fy-2,P.m1); b.px(x-6,fy,P.k1); b.px(x+7,fy,P.k1); }
function coatStand(b){ var cr=rp(M.wallPt(SPEC,'L',DOORU[1]+14,FY)), x=cr[0], y=cr[1];
  b.vl(x,y-52,y-1,P.w1); b.vl(x+1,y-52,y-1,P.w3); b.hl(x-5,x+6,y-1,P.w0); b.line(x-4,y-1,x,y-6,P.w1); b.line(x+5,y-1,x+1,y-6,P.w1);
  b.line(x-3,y-52,x+4,y-52,P.w2); b.px(x-4,y-51,P.w2); b.px(x+5,y-51,P.w2);
  b.poly([[x-2,y-50],[x+4,y-50],[x+7,y-24],[x-4,y-23]],function(xx,yy){ return (xx<x)?P.m1:(((xx+yy)%6===0)?P.m1:P.m2); }); b.vl(x+1,y-47,y-25,P.m0);   // grauer Mantel
  b.ellipse(x+1,y-53,4,1.5,P.m1); b.rect(x-1,y-57,5,4,P.m2); b.hl(x-1,x+3,y-57,P.m3); b.hl(x-1,x+3,y-54,P.k2); }                                   // Hut
function wallClock(b,cx,cy){ b.ellipse(cx+0.5,cy+0.5,4.6,5.6,P.w1); b.ellipse(cx+0.5,cy+0.5,3.6,4.6,P.s6); b.px(cx,cy-4,P.k2); b.px(cx+3,cy,P.k2); b.px(cx,cy+4,P.k2); b.px(cx-3,cy,P.k2); b.vl(cx,cy-3,cy,P.k1); b.line(cx,cy,cx+2,cy+1,P.k1); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), w=wea(GS), x, y, i;
  WLF=(tod==='night')?0:({snowlie:1,sun:1.1,thaw:0.55,snow:0.8,fog:0.6}[w]);
  SUNP=(tod==='day' && (w==='snowlie'||w==='sun'))?1:0;
  WM.fill(0);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  // Stuckleiste an der Decke, Opalglaslampe
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.s6); b.hl(RECT[0],RECT[2]-1,RECT[1]+1,P.s3); b.hl(RECT[0],RECT[2]-1,RECT[1]+2,P.s5);
  [['L',0,90],['R',0,70]].forEach(function(s){ var p0=M.wallPt(SPEC,s[0],s[1],RECT[1]), p1=M.wallPt(SPEC,s[0],s[2],RECT[1]); b.line(rnd(p0[0]),rnd(p0[1]),rnd(p1[0]),rnd(p1[1]),P.s6); b.line(rnd(p0[0]),rnd(p0[1])+1,rnd(p1[0]),rnd(p1[1])+1,P.s3); });
  var lp=rp(R3.p(150,RECT[1],40)); b.ellipse(lp[0]+0.5,lp[1]+1,9,2.5,P.s4); b.ellipse(lp[0]+0.5,lp[1]+1,6,1.5,P.s6);           // Stuckrosette
  b.vl(lp[0],lp[1],lp[1]+8,P.k2); b.rect(lp[0]-2,lp[1]+8,5,2,P.m2); LAMP0=[lp[0],lp[1]+15];
  // ---- linke Wand: Tür, Zettel „Sprechzeiten“, Lichtschalter, Kleiderständer
  var dq=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]), dq2=M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-4,DOORU[3]);
  b.poly(dq2,P.w1); b.poly(dq,function(xx,yy){ var wv=wallUV('L',xx,yy); if (!wv) return P.w2; var lu=(wv.u-DOORU[0])/(DOORU[1]-DOORU[0]), lv=(wv.v-DOORU[2])/(DOORU[3]-DOORU[2]);
    var pan=(lu>0.14&&lu<0.86)&&((lv>0.08&&lv<0.44)||(lv>0.52&&lv<0.92)); if (pan){ var e=(lu<0.2||lv<0.12||(lv>0.52&&lv<0.56))?P.w1:((lu>0.8||(lv>0.4&&lv<0.44)||lv>0.88)?P.w4:P.w3); return e; } return ((xx+(yy>>2))%9===0)?P.w2:P.w3; });
  var kn=rp(M.wallPt(SPEC,'L',DOORU[1]-4,66)); b.rect(kn[0]-1,kn[1],3,2,P.y3); b.px(kn[0]+1,kn[1]+1,P.y2); b.px(kn[0],kn[1]+4,P.k2);
  var sw=rp(M.wallPt(SPEC,'L',DOORU[1]+5,62)); b.rect(sw[0],sw[1],3,4,P.s6); b.px(sw[0]+1,sw[1]+1,P.m3);
  var nt=rp(M.wallPt(SPEC,'L',DOORU[1]+6,40)); b.rect(nt[0],nt[1],9,12,P.s6); b.hl(nt[0]+1,nt[0]+7,nt[1]+2,P.k2); for (y=nt[1]+4;y<nt[1]+11;y+=2) b.hl(nt[0]+1,nt[0]+6-(y%3),y,P.m3); b.px(nt[0]+4,nt[1]-1,P.r3);
  coatStand(b);
  // ---- Rückwand: Aktenschrank, Kalender, Fenster, Formularfächer
  cabinet(b); calendar(b); paintWindow(b,w,tod); rack(b);
  // ---- rechte Wand: Uhr, ein gerahmter Stadtplan der Altstadt (nur Straßenlinien)
  var ck=rp(M.wallPt(SPEC,'R',30,36)); wallClock(b,ck[0],ck[1]);
  var mq=M.wallQuad(SPEC,'R',8,30,44,68); b.poly(mq,P.w1); var mi=M.wallQuad(SPEC,'R',9.5,28.5,45.5,66.5); b.poly(mi,function(xx,yy){ var wv=wallUV('R',xx,yy); if (!wv) return P.s5; var u=wv.u, v=wv.v; var c=(((Math.round(u*1.3)+Math.round(v*0.7))%5===0)||((Math.round(v)%7)===0))?P.s3:P.s5; if (Math.abs(u-20+v*0.15)<0.8) c=P.b3; return c; });
  // ---- Stühle
  visitorChair(b,CHAIR[0],CHAIR[1]); officeChair(b,OBER[0],OBER[1]);
  // ---- Licht
  shade(b,0,0,tod,function(x,y){ return !WM[y*W+x]; });
  // Lampe: Opalglaskugel (leuchtet gedämpft am Tag)
  b.ellipse(LAMP0[0]+0.5,LAMP0[1]-3,5,4.6,P.s5); b.ellipse(LAMP0[0]-0.5,LAMP0[1]-4,2.5,2,P.s6); b.px(LAMP0[0]-1,LAMP0[1]-5,P.l1); b.hl(LAMP0[0]-2,LAMP0[0]+2,LAMP0[1]+1,P.s4);
  return b; }
var LAMP0=[150,40];

// ---------------------------------------------------------------- Ebenen: Schreibtisch (vor Obermaiers Beinen), Yuccapalme vorn rechts
var STAMP=[0,0,0,0], FILE=[0,0,0,0], PHONE=[0,0];
function layers(S,GS,tod){ var L=[];
  var dr=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), l=M.layer(dr[0]-6,dr[1]-34,dr[2]+12,dr[3]+36,dr[1]+dr[3]), w=M.lw(l), k;
  // Platte (hellgraues Resopal), Stahlwangen, Schubladenblock links, Blende
  R3.box(w,DESK.X0,DESK.X1,DESK.Y0,DESK.Y0+1.5,DESK.Z0,DESK.Z1,{top:function(x,y){ return ((x*3+y*7)%23===0)?P.m3:P.m4; },front:P.m2,left:P.m1});
  R3.box(w,DESK.X0+1,DESK.X0+24,DESK.Y0+1.5,FY,DESK.Z0+2,DESK.Z1-1,{front:P.m2,left:P.m1});
  R3.box(w,DESK.X0+24,DESK.X1-3,DESK.Y0+1.5,DESK.Y0+8,DESK.Z1-3,DESK.Z1-2,{front:P.m2});
  R3.box(w,DESK.X1-3,DESK.X1-1,DESK.Y0+1.5,FY,DESK.Z0+1,DESK.Z1-1,{front:P.m2,left:P.m1});
  var f0=rp(R3.p(DESK.X0,DESK.Y0,DESK.Z1)), f1=rp(R3.p(DESK.X1,DESK.Y0,DESK.Z1)), pd=rp(R3.p(DESK.X0+1,DESK.Y0+1.5,DESK.Z1-1)), pb=rp(R3.p(DESK.X0+24,FY,DESK.Z1-1));
  for (var i=0;i<3;i++){ var y0=pd[1]+2+rnd(i*(pb[1]-pd[1]-2)/3), y1=pd[1]+rnd((i+1)*(pb[1]-pd[1]-2)/3); w.hl(pd[0]+1,pb[0]-2,y0,P.m3); w.hl(pd[0]+1,pb[0]-2,y1,P.m1); w.rect(rnd((pd[0]+pb[0])/2)-2,y0+2,5,1,P.m0); }
  w.hl(f0[0],f1[0],f0[1],P.m4);
  var my=f0[1]-1;
  // Aktenstapel (bunte Deckel) links hinten und Mitte
  var ax=f0[0]+6; for (k=0;k<9;k++){ var cc=[P.e4,P.b2,P.e3,P.r3,P.e4,P.g4,P.s5,P.e3,P.b1][k]; w.hl(ax+(k%2),ax+14+(k%3===0?1:0),my-3-k,cc); w.px(ax+14,my-3-k,M.DN[cc]); }
  w.hl(ax+2,ax+12,my-12,P.s6); w.px(ax+4,my-6,P.s6); w.px(ax+5,my-6,P.s6);
  var bx2=f0[0]+24; for (k=0;k<6;k++){ var c2=[P.e3,P.e4,P.b2,P.e4,P.r2,P.e3][k]; w.hl(bx2,bx2+12,my-6-k,c2); } w.hl(bx2+1,bx2+11,my-12,P.e4);
  // aufgeschlagene Akte (Pappdeckel, Formular, Ausweis mit Foto) vorn links
  var fx=f0[0]+8; w.poly([[fx,my],[fx+22,my-1],[fx+23,my+1],[fx+1,my+2]],P.e4); w.poly([[fx+2,my],[fx+11,my-0.5],[fx+11,my+1],[fx+2,my+1.5]],P.s6); w.poly([[fx+12,my-0.5],[fx+21,my-1],[fx+21,my+0.5],[fx+12,my+1]],P.s5);
  w.px(fx+4,my,P.m2); w.px(fx+5,my,P.m3); w.px(fx+7,my+1,P.m3); w.px(fx+14,my,P.c2); w.px(fx+15,my,P.c2); w.px(fx+17,my,P.m3); w.px(fx+19,my,P.m3);
  FILE=[fx-1,my-3,26,6];
  // Stempelkarussell: runder Ständer mit hängenden Stempeln, Stempelkissen
  var sx=f0[0]+40, sy=my-1; w.ellipse(sx+0.5,sy,5,1.4,P.k2); w.vl(sx,sy-11,sy,P.m2); w.vl(sx+1,sy-11,sy,P.m1); w.ellipse(sx+0.5,sy-11,6,1.4,P.m2); w.hl(sx-5,sx+6,sy-11,P.m3);
  for (k=0;k<5;k++){ var hx=sx-4+k*2+(k>2?1:0); w.vl(hx,sy-10,sy-6,P.w3); w.px(hx,sy-10,P.w4); w.px(hx,sy-5,P.k2); }
  w.rect(sx+8,sy-2,7,2,P.k2); w.hl(sx+8,sx+14,sy-2,P.r1);
  STAMP=[sx-7,sy-14,23,16];
  // Bildschirm (flach), Tastatur, Telefon, Stifteköcher, Kaffeebecher
  var mx=f0[0]+60; w.rect(mx,my-19,18,13,P.k2); w.rect(mx+1,my-18,16,11,P.n1); w.hl(mx+1,mx+16,my-18,P.n2); w.rect(mx+8,my-6,3,4,P.m1); w.rect(mx+5,my-3,9,1,P.m1); MON=[mx+1,my-18];
  w.rect(mx-6,my-2,14,2,P.s5); w.hl(mx-6,mx+7,my-2,P.s6); for (k=0;k<6;k++) w.px(mx-5+k*2,my-1,P.s3);
  var phx=f1[0]-13; w.rect(phx,my-4,10,4,P.m1); w.hl(phx,phx+9,my-4,P.m2); w.rect(phx+1,my-7,8,2,P.m0); w.hl(phx,phx+9,my-8,P.m2); w.px(phx+3,my-3,P.s5); w.px(phx+5,my-3,P.s5); w.px(phx+7,my-3,P.s5);
  for (k=0;k<6;k++) w.px(phx-2-((k%2)),my-3+k*0.4|0,P.k2); PHONE=[phx,my-8];
  w.rect(f0[0]+52,my-6,3,5,P.b1); w.px(f0[0]+52,my-8,P.r3); w.px(f0[0]+53,my-9,P.k2); w.px(f0[0]+54,my-8,P.y3);
  w.rect(f1[0]-20,my-4,3,4,P.s6); w.px(f1[0]-17,my-3,P.s5);
  // Schreibtischlampe (Gelenkarm, grau) hinten Mitte
  var lx=f0[0]+34, ly=rnd(R3.p(0,DESK.Y0,DESK.Z0+4)[1]); w.ellipse(lx+0.5,ly,3,1,P.m1); w.line(lx,ly-1,lx+3,ly-12,P.m2); w.line(lx+3,ly-12,lx+9,ly-15,P.m2); w.poly([[lx+8,ly-17],[lx+13,ly-15],[lx+12,ly-11],[lx+7,ly-13]],P.m1); w.px(lx+10,ly-12,P.y5);
  // Namensschild zum Besucher
  w.rect(f0[0]+16,my-5,4,0,P.s6);
  shade(l,l.ox,l.oy,tod); L.push(l);
  // Yuccapalme im Topf vorn rechts
  var yl=M.layer(282,64,38,80,142), yw=M.lw(yl); yucca(yw); if (tod==='day') M.light(yl,function(x,y){ return -0.5+winAt(x,y)*0.3+vig(x,y)*0.6; },yl.ox,yl.oy); else shade(yl,yl.ox,yl.oy,tod); L.push(yl);
  return L; }
var MON=[0,0];
function yucca(w){ var px=302, by=142, i, k;
  w.rect(px-9,by-14,19,14,P.t3); w.hl(px-10,px+10,by-15,P.t4); w.hl(px-10,px+10,by-14,P.t2); w.vl(px-9,by-13,by-1,P.t4); w.vl(px+9,by-13,by-1,P.t1); w.hl(px-9,px+9,by-1,P.t0); w.hl(px-9,px+9,by-8,P.t2);
  w.rect(px-2,by-36,4,22,P.e2); w.vl(px-2,by-36,by-15,P.e3); for (k=0;k<6;k++) w.hl(px-2,px+1,by-17-k*3,P.e1);
  w.rect(px+3,by-28,3,13,P.e2); w.vl(px+3,by-28,by-15,P.e3);
  var r=M.rng(23); [[px,by-37],[px+4,by-29]].forEach(function(t,j){ for (i=0;i<16;i++){ var a=-Math.PI*(0.08+0.84*r()), len=8+r()*10, cx=t[0], cy=t[1];
    for (k=0;k<len;k++){ var X=rnd(cx+Math.cos(a)*k), Y=rnd(cy+Math.sin(a)*k+k*k*0.012*(Math.cos(a)>0?1:1)); w.px(X,Y,k<len*0.3?P.g2:(k<len*0.75?P.g3:P.g4)); if (k%3===0) w.px(X,Y+1,P.g1); } } }); }

// ---------------------------------------------------------------- jedes Bild: Schnee vor dem Fenster, Bildschirm, Staub im Licht
function dyn(fb,v,S,GS){ var t=v.t, w=wea(GS), i;
  if (w==='snow'){ for (i=0;i<26;i++){ var sp=6+hash(i,41)*8, x=WIN.x0+((hash(i,43)*60+t*3+Math.sin(t*0.8+i)*3)%54+54)%54-2, y=WIN.y0+((t*sp+hash(i,42)*60)%60)-4, X=rnd(x), Y=rnd(y); if (X>=0&&X<W&&Y>=0&&Y<H && WM[Y*W+X]) fb.px(X,Y,hash(i,44)<0.3?P.s6:P.s5); } }
  if (w==='thaw'){ for (i=0;i<4;i++){ var dx=WIN.x0+6+i*12+(i>1?2:0), ph=(t*0.7+i*0.37)%1, dy=WIN.y0+9+rnd(ph*14); if (WM[dy*W+dx]) fb.px(dx,dy,P.s5); } }
  var x0=MON[0], y0=MON[1]; for (var yy=0;yy<11;yy++) for (var xx=0;xx<16;xx++){ var c=(yy<2)?P.b1:((yy%3===1 && xx>1 && xx<12-(yy%5))?P.s5:P.s6); if (xx<1||xx>14||yy>9) c=P.n2; if (((yy+Math.floor(t*20))%7)===0) c=M.UP[c]; fb.px(x0+xx,y0+yy,c); }
  if (Math.floor(t*1.6)%2) fb.px(x0+9,y0+7,P.k2);
  if (v.tod==='day' && SUNP) M.dust(fb,t,110,40,70,70,12,P.s6); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<116||y>139||x<20||x>300) return false; if (x>286 && y<132) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false; return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var L=levels(tod), f=Math.min(1,Math.max(lampAt(a.x,a.y-24),ceilAt(a.x,a.y-24)*0.7))*(L.length-1); return L[Math.round(f)].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-4,DOORU[3]));
var DKR=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1);
var SPOTS=(function(){ cabinet(new M.Buf(W,H,0)); var f0=rp(R3.p(DESK.X0,DESK.Y0,DESK.Z1)), my=f0[1]-1;
  return { door:DQ, desk:[DKR[0],DKR[1]-18,DKR[2],DKR[3]+18], files:CABR, forms:[RACK.x0-3,RACK.y0-10,RACK.x1-RACK.x0+6,RACK.y1-RACK.y0+14],
    calendar:[CAL.x0-1,CAL.y0-3,CAL.w+3,CAL.h+4], window:[WIN.x0-7,WIN.y0-5,WIN.x1-WIN.x0+14,WIN.y1-WIN.y0+9], chair:[CHAIR[0]-8,CHAIR[1]-30,15,31],
    stamp:[f0[0]+33,my-14,16,16] }; })();
M.defineArt('friedamt',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, actorLut:actorLut,
  spots:SPOTS,
  stands:{ door:[30,122,'L'], desk:[150,118,'B'], files:[72,118,'B'], forms:[226,117,'B'], calendar:[112,117,'B'], window:[166,117,'B'], chair:[106,120,'R'], stamp:[178,118,'B'] },
  actorPos:{ obermaier:[OBER[0],OBER[1],'L'] },
  start:[34,124,'R'], entries:{ map:[34,124,'R'] }
});
})(M);
