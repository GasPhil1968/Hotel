/* ===== rooms/art/barsport.js — „Bar Sport“ im Bahnhofsviertel: eine kleine italienische Bar.
   Schachbrettboden aus cremefarbenen und dunkelroten Fliesen, unten dunkles Holzpaneel, darüber ockergelbe Wände, eine
   Decke mit zwei Hängelampen und einem stillstehenden Ventilator. Links die Glastür zur Straße mit Kleiderständer.
   Hinten links das Fenster zur Straße (Gründerzeithäuser, ein Lebensmittelladen, Autos mit Schnee; Wetter: klar,
   Tauwetter, Schneefall, Nebel). In der Mitte die Fotowand: alte Schwarzweißfotos, groß das Foto von 1962 (junge Männer
   mit Koffern auf einem Bahnsteig), ein Fußballwimpel in Vereinsfarben (ohne Wappen), ein Mannschaftsfoto.
   Rechts die Theke mit der verchromten Espressomaschine, Tassen, einer Vitrine mit Cornetti; dahinter der Spiegel mit
   dem Schriftzug „BAR SPORT“, Glasborde mit Flaschen; Enzo hinter der Theke. Rechts an der Wand der Fernseher (italienisches
   Programm) über der Kühltruhe „GELATI“. Zwei kleine Marmortische, an einem sitzt der alte Mann mit Zeitung. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[168,54], RECT=[40,18,270,96], F=100, FY=96;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOOR=[6,36,26,96];                                  // Glastür in der linken Wand
var WIN={x0:50,x1:108,y0:28,y1:70};                     // Fenster zur Straße
var PH={x0:116,x1:178,y0:24,y1:68};                     // Fotowand
var P62={x:124,y:28,w:28,h:20};                         // das Foto von 1962
var MIR={x0:188,x1:266,y0:24,y1:58};                    // Spiegel hinter der Theke
var CNT={X0:186,X1:268,Y0:72,Z0:16,Z1:30};              // Theke
var FRZ={X0:246,X1:268,Y0:82,Z0:38,Z1:62};              // Kühltruhe an der rechten Wand
var TV={u:30,v:34};                                     // Fernseher an der rechten Wand
var T1={X:104,Z:42}, T2={X:146,Z:56};                   // Marmortische (Mitte)
var GAST3=[63,113], ENZO=[244,100];
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
function wea(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun')?w:'snowlie'; }

// ---------------------------------------------------------------- Licht: warme Hängelampen, Tageslicht durch Fenster und Tür
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var WARM=M.tintMake(function(r,g,b){ return [r*0.95+18, g*0.84+8, b*0.66]; });
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
var LMP=[[92,30],[180,30]];
function lampAt(x,y){ var a=0; for (var i=0;i<LMP.length;i++){ var l=LMP[i], dx=(x-l[0])/70, dy=(y-l[1]-56)/50, d=dx*dx+dy*dy; if (d<1) a=Math.max(a,Math.pow(1-d,0.9)*0.9); var g=Math.hypot((x-l[0])/14,(y-l[1]-3)/8); if (g<1) a=Math.max(a,1-g*0.3); } return Math.min(1,a); }
var WLF=1;
function winAt(x,y){ var dx=(x-70)/120, dy=(y-80)/70, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.4)*WLF:0; }
function vig(x,y){ var cx=(x-170)/190, cy=(y-76)/100, v=cx*cx+cy*cy; return -Math.max(0,v-0.3)*1.9; }
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.55+lampAt(x,y)*0.6+winAt(x,y)*0.5+vig(x,y)*1.2; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue; var a=lampAt(X,Y); if (bayer(X,Y)<cl((a-0.5)*1.2,0,0.45)) b.d[k]=M.tintPx(WARM,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,lampAt(X2,Y2))*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen: Holzpaneel, ockergelbe Wand, Schachbrettboden
function wall(u,v,x,y,dim){ var c;
  if (v>=93) c=(v===93)?P.w1:P.k2;
  else if (v>=64){ var bi=Math.floor((u+500)/16), fu=(u+500)-bi*16; c=(v===64)?P.w4:((v===65)?P.w1:((fu<1)?P.w0:((fu<2||v===66||v===91)?P.w1:P.w2))); if (fu>3&&fu<13&&v>68&&v<89){ c=(fu===4||v===69)?P.w1:((fu===12||v===88)?P.w3:P.w2); } }   // Kassetten
  else { var f=fbm(u*0.03,v*0.05); c=(f>0.62 && bayer(x,y)<(f-0.62)*3)?P.e3:P.y3; if (v<RECT[1]+3) c=P.e3; if (fbm(u*0.1,v*0.1)>0.7 && bayer(x,y)<0.3) c=P.e4; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ return wall(u*1.5+(sd==='L'?0:400),v+RECT[1],x,y,sd==='L'?1:0); }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X+700, Z=f.Z+700, s=12, ix=Math.floor(X/s), iz=Math.floor(Z/s), fx=X-ix*s, fz=Z-iz*s;
  var dark=((ix+iz)&1)===1, c=dark?P.r1:P.s4; if (!dark && hash(ix,iz)<0.3) c=P.s3; if (dark && hash(ix,iz)<0.25) c=P.r0;
  if (fx<0.5||fz<0.5) c=P.s2; var g=fbm(f.X*0.06,f.Z*0.08); if (g>0.64 && bayer(x,y)<(g-0.64)*2) c=M.DN[c];
  var wear=Math.exp(-Math.pow((f.Z-40)/14,2))*Math.exp(-Math.pow((f.X-200)/40,2))+Math.exp(-Math.pow((f.Z-64)/14,2))*Math.exp(-Math.pow((f.X-60)/40,2))*0.8; if (wear>0.35 && bayer(x,y)<(wear-0.35)*0.7) c=M.UP[c];
  return c; }
function ceilTex(xb,d,x,y){ var c=P.s4; if (d<2) c=P.e3; if ((Math.floor(xb+600)%30)<1) c=P.s3; return c; }

// ---------------------------------------------------------------- Straße draußen (Fenster und Glastür)
var WM=new Uint8Array(W*H);   // 1 = Glas nach draußen
function street(x,y,w,tod,lx,ly){ var night=tod==='night', c;
  var SK={snowlie:'b2 b3 b4',sun:'b3 b4 b5',thaw:'m3 m4 m4',snow:'m4 s4 s5',fog:'s4 s5 s5'}[w]; if (night) SK='k1 n0 n1';
  c=ra(R(SK),0.2+ly/14,x,y);
  // Häuser gegenüber: Gründerzeitfassade mit Gesimsen und Fenstern, Schnee auf den Simsen
  if (ly>=6 && ly<30){ var fac=(lx<26)?R('e3 e4 s4'):R('s3 s4 s5'); c=ra(fac,0.55+(fbm(lx*0.2,ly*0.2)-0.5)*0.3,x,y); var wx=(lx+2)%10, wy=(ly-6)%11;
    if (wy===0) c=(w==='thaw')?P.s3:P.s6; else if (wy===1) c=P.e2; else if (wx>=3&&wx<8&&wy>=3&&wy<10){ c=night?(hash(Math.floor((lx+2)/10),Math.floor((ly-6)/11))<0.5?P.y3:P.n1):(((wx+wy)%4===0)?P.m3:P.m1); if (wy===9) c=(w==='thaw')?P.s3:P.s5; }
    if (lx===26) c=P.e2; }
  // Ladenschild unten: Lebensmittel, Vordach
  if (ly>=30 && ly<34){ c=(lx<26)?P.g2:P.r2; if (ly===30) c=(w==='thaw')?P.m3:P.s6; }
  if (ly>=34 && ly<40){ c=(lx<26)?((lx%5<3)?P.y3:P.g3):((lx%4<2)?P.m1:P.c1); }                       // Auslagen, Schaufenster
  // Gehweg mit Schneerand, Fahrbahn, parkendes Auto mit Schnee
  if (ly>=40){ c=(w==='thaw')?((hash(x,y)<0.4)?P.m2:P.m3):((ly===40)?P.s5:((hash(x>>1,y)<0.3)?P.s4:P.s5)); if (ly>=43) c=(w==='thaw')?P.m1:((hash(x,y)<0.3)?P.m2:P.s3); }
  var cx=lx-30; if (cx>=0 && cx<24 && ly>=36 && ly<44){ var top=(cx<5||cx>19)?40:37; if (ly>=top){ c=(ly===top)?((w==='thaw')?P.m4:P.s6):((ly<top+3 && cx>6 && cx<18)?P.c1:P.r2); if (ly===43 && (cx===4||cx===18)) c=P.k1; } }
  if (night && ly>=30 && ly<40 && hash(lx,ly)<0.5) c=P.y3;
  return c; }

// ---------------------------------------------------------------- Fotowand: Schwarzweißfotos, das Foto von 1962, Wimpel
function photo(b,x,y,w,h,kind,frame){ b.rect(x-1,y-1,w+2,h+2,frame||P.k2); b.rect(x,y,w,h,P.s5);
  b.fn(x+1,y+1,w-2,h-2,function(xx,yy){ return ra(R('m1 m2 m3 m4'),0.85-(yy-y)/h*0.55,xx,yy); });
  var i, cx=x+(w>>1);
  if (kind==='1962'){ // Bahnsteig, Zugwand, sechs junge Männer mit Koffern
    b.rect(x+1,y+1,w-2,6,P.m2); for (i=x+2;i<x+w-2;i+=4) b.rect(i,y+2,2,3,P.m1); b.hl(x+1,x+w-2,y+7,P.m4); b.rect(x+1,y+h-4,w-2,3,P.m3);
    for (i=0;i<6;i++){ var px=x+3+i*4, py=y+8+(i%2); b.px(px,py,P.s5); b.px(px,py-1,P.k1); b.rect(px-1,py+1,3,5,(i%3===0)?P.k1:P.m1); b.px(px-1,py+6,P.k1); b.px(px+1,py+6,P.k1); if (i%2===0){ b.rect(px+1,py+4,3,3,P.s3); } else b.rect(px-3,py+4,3,2,P.m4); }
    b.px(x+w-4,y+h-3,P.s6); }
  else if (kind==='team'){ for (var r=0;r<2;r++) for (i=0;i<6;i++){ var tx=x+2+i*3+(r?1:0), ty=y+3+r*5; b.px(tx,ty,P.s5); b.rect(tx,ty+1,2,3,r?P.m1:P.s6); } b.rect(x+1,y+h-3,w-2,2,P.m3); }
  else if (kind==='couple'){ b.ellipse(cx-2,y+4,1.6,2,P.s5); b.ellipse(cx+2,y+4,1.6,2,P.s5); b.rect(cx-4,y+6,4,h-8,P.k1); b.rect(cx,y+6,4,h-8,P.s4); b.px(cx-2,y+3,P.k1); b.px(cx+2,y+2,P.k1); }
  else if (kind==='village'){ b.rect(x+1,y+h-6,w-2,5,P.m3); for (i=0;i<4;i++){ var hx=x+2+i*4; b.rect(hx,y+h-9-(i%2)*2,3,4+(i%2)*2,P.s4); b.px(hx+1,y+h-10-(i%2)*2,P.m2); } b.hl(x+1,x+w-2,y+4,P.m4); }
  else { b.ellipse(cx,y+4,1.8,2,P.s5); b.rect(cx-2,y+6,4,h-8,P.k2); b.px(cx,y+3,P.k1); b.hl(cx-1,cx+1,y+2,P.k1); } }
function pennant(b,x,y,w,h){ for (var yy=0;yy<h;yy++){ var ww=rnd(w*(1-yy/h)); for (var xx=0;xx<ww;xx++){ b.px(x+xx,y+yy,(xx<ww/2)?P.r3:P.b1); } } b.vl(x-1,y-2,y+h,P.y3); b.hl(x-2,x+w,y-1,P.y2); b.px(x+w,y-1,P.y3); b.px(x+w+1,y-1,P.y4); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), w=wea(GS), x, y, i;
  WLF=(tod==='night')?0:({snowlie:1,sun:1.1,thaw:0.6,snow:0.8,fog:0.65}[w]);
  WM.fill(0);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.w1); b.hl(RECT[0],RECT[2]-1,RECT[1]+1,P.e2);
  // ---- linke Wand: Glastür (Holzrahmen), Kleiderständer
  for (y=0;y<H;y++) for (x=0;x<RECT[0];x++){ var wv=wallUV('L',x,y); if (!inUV(wv,[DOOR[0]-2,DOOR[1]+2,DOOR[2]-2,DOOR[3]])) continue;
    var g=inUV(wv,[DOOR[0]+2,DOOR[1]-2,DOOR[2]+2,DOOR[3]-16]);
    if (g){ if (Math.abs(wv.v-62)<1.1){ b.px(x,y,P.w3); continue; } var lx=rnd((wv.u-DOOR[0])*1.8), ly=rnd((wv.v-DOOR[2])*0.6); b.px(x,y,street(x,y,w,tod,lx+56,ly+4)); WM[y*W+x]=1; }
    else b.px(x,y,(wv.u<DOOR[0]||wv.u>=DOOR[1]||wv.v<DOOR[2])?P.w1:((wv.v>=DOOR[3]-16)?((wv.v<DOOR[3]-15)?P.w4:P.w2):P.w3)); }
  var dp=rp(M.wallPt(SPEC,'L',(DOOR[0]+DOOR[1])/2,DOOR[2]+14)); b.line(dp[0]-3,dp[1]-4,dp[0],dp[1]-7,P.k2); b.line(dp[0]+3,dp[1]-4,dp[0],dp[1]-7,P.k2); b.rect(dp[0]-5,dp[1]-4,11,6,P.r2); b.hl(dp[0]-4,dp[0]+4,dp[1]-2,P.s5); b.hl(dp[0]-4,dp[0]+2,dp[1],P.s5); for (x=dp[0]-5;x<dp[0]+7;x++) for (y=dp[1]-8;y<dp[1]+2;y++) WM[y*W+x]=0;   // Schild an der Tür (Rückseite)
  var hb=rp(M.wallPt(SPEC,'L',DOOR[1]-4,62)), hb2=rp(M.wallPt(SPEC,'L',DOOR[1]-4,72)); b.rect(hb[0],hb[1],2,hb2[1]-hb[1],P.y3);
  var cr=rp(M.wallPt(SPEC,'L',DOOR[1]+10,FY)); b.vl(cr[0],cr[1]-50,cr[1]-1,P.k2); b.vl(cr[0]+1,cr[1]-50,cr[1]-1,P.m1); b.hl(cr[0]-5,cr[0]+6,cr[1]-1,P.k2); b.line(cr[0]-4,cr[1]-50,cr[0]+5,cr[1]-50,P.m1);
  b.poly([[cr[0]-1,cr[1]-48],[cr[0]+5,cr[1]-48],[cr[0]+7,cr[1]-24],[cr[0]-3,cr[1]-23]],function(xx,yy){ return (xx<cr[0]+1)?P.e1:(((xx+yy)%5===0)?P.e1:P.e2); });   // Mantel des alten Mannes
  b.ellipse(cr[0]+2,cr[1]-50,4,1.4,P.k2); b.rect(cr[0],cr[1]-54,5,4,P.k2); b.hl(cr[0],cr[0]+4,cr[1]-54,P.m1);                                                        // Hut
  // ---- Rückwand: Fenster, Fotowand, Spiegel mit Schriftzug und Flaschen
  for (y=WIN.y0;y<WIN.y1;y++) for (x=WIN.x0;x<WIN.x1;x++){ b.px(x,y,street(x,y,w,tod,x-WIN.x0,y-WIN.y0)); WM[y*W+x]=1; }
  var fa={fog:0.75,snow:0.3,thaw:0.12}[w]||0; if (fa && tod==='day') M.fogBake(b,function(xx,yy){ return WM[yy*W+xx]?fa*(yy<WIN.y0+40||xx<WIN.x0?1:0.7):0; },{col:w==='fog'?P.s4:P.s5});
  b.rect(WIN.x0-3,WIN.y0-3,WIN.x1-WIN.x0+6,3,P.w2); b.rect(WIN.x0-3,WIN.y1,WIN.x1-WIN.x0+6,4,P.w2); b.rect(WIN.x0-3,WIN.y0,3,WIN.y1-WIN.y0,P.w2); b.rect(WIN.x1,WIN.y0,3,WIN.y1-WIN.y0,P.w2);
  b.hl(WIN.x0-3,WIN.x1+2,WIN.y0-3,P.w4); b.hl(WIN.x0-4,WIN.x1+3,WIN.y1+4,P.w4); b.hl(WIN.x0-4,WIN.x1+3,WIN.y1+5,P.w1);
  for (y=WIN.y0;y<WIN.y1;y++){ var mx=rnd((WIN.x0+WIN.x1)/2); b.px(mx,y,P.w2); WM[y*W+mx]=0; } for (x=WIN.x0;x<WIN.x1;x++){ b.px(x,WIN.y0+14,P.w2); WM[(WIN.y0+14)*W+x]=0; }
  // Halbgardine (Bistro) unten im Fenster
  for (y=WIN.y0+25;y<WIN.y1;y++) for (x=WIN.x0;x<WIN.x1;x++){ var cu=(y===WIN.y0+25)?P.y2:(((x+(y>>1))%6===0||(x-(y>>1)+60)%6===0)?P.s4:P.s5); if (y===WIN.y1-1) cu=P.s4; if (y===WIN.y0+26 && x%3===0) cu=P.y3; b.px(x,y,cu); WM[y*W+x]=0; }
  // Fotowand
  photo(b,P62.x,P62.y,P62.w,P62.h,'1962',P.w1); b.rect(P62.x,P62.y+P62.h+2,P62.w,3,P.s5); M.microText(b,'1962',P62.x+7,P62.y+P62.h+2,P.k1);
  photo(b,156,26,14,11,'couple',P.y2); photo(b,158,42,16,12,'team',P.k2); photo(b,124,54,13,11,'village',P.w1); photo(b,141,54,11,12,'man',P.k2); photo(b,174,44,0,0,'man');
  pennant(b,162,58,14,9);
  // Spiegel mit „BAR SPORT“, Glasborde mit Flaschen
  var m=MIR; b.rect(m.x0-2,m.y0-2,m.x1-m.x0+4,m.y1-m.y0+4,P.w1); b.hl(m.x0-2,m.x1+1,m.y0-2,P.w3);
  for (y=m.y0;y<m.y1;y++) for (x=m.x0;x<m.x1;x++){ var mc=(fbm(x*0.15,y*0.2)>0.55)?P.m3:P.m2; if (((x-m.x0)+(y-m.y0)*1.2)%37<3) mc=P.m4; b.px(x,y,mc); }
  var tw=M.textWidth('BAR SPORT'), tx=rnd((m.x0+m.x1)/2-tw/2); M.text(b,'BAR SPORT',tx+1,m.y0+4,P.y1); M.text(b,'BAR SPORT',tx,m.y0+3,P.y4); SIGN=[tx-2,m.y0+1,tw+4,11];
  [[m.y0+26,3],[m.y1-2,5]].forEach(function(sh,j){ var yb=sh[0], r=M.rng(11+j*7); b.hl(m.x0,m.x1-1,yb,P.s5); b.hl(m.x0,m.x1-1,yb+1,P.m1);
    var xx=m.x0+3; while (xx<m.x1-5){ var k=Math.floor(r()*6), hgt=9+Math.floor(r()*4), col=[P.r3,P.t4,P.g2,P.k1,P.y3,P.s5][k]; b.rect(xx,yb-hgt+3,4,hgt-3,col); b.vl(xx,yb-hgt+3,yb-1,M.UP[col]); b.rect(xx+1,yb-hgt,2,3,col); b.px(xx+1,yb-hgt,P.k2); if (k!==5){ b.rect(xx,yb-hgt+5,4,3,P.s6); b.px(xx+1,yb-hgt+6,P.r2); } b.px(xx+1,yb-hgt+4,P.l0); xx+=5+(r()<0.3?1:0); } });
  // Preistafel neben dem Spiegel
  var pb={x:244,y:62,w:0}; // (bewusst ohne: die Theke verdeckt den unteren Rand)
  // ---- rechte Wand: Fernseher auf Wandarm, darunter Kalender eines Fußballvereins (nur Farben)
  var tv=rp(M.wallPt(SPEC,'R',TV.u,TV.v)); TVP=[tv[0]-12,tv[1]-8];
  b.line(tv[0]+6,tv[1]+10,tv[0]+12,tv[1]+14,P.k2); b.rect(tv[0]-14,tv[1]-10,22,17,P.k1); b.hl(tv[0]-14,tv[0]+7,tv[1]-10,P.m2); b.rect(tv[0]-13,tv[1]-9,20,15,P.m1); b.rect(tv[0]-12,tv[1]-8,16,12,P.n1); b.rect(tv[0]+5,tv[1]-8,1,12,P.m2);
  var sc=rp(M.wallPt(SPEC,'R',14,64)); b.rect(sc[0],sc[1],10,14,P.s6); b.rect(sc[0]+1,sc[1]+1,8,5,P.b1); b.hl(sc[0]+1,sc[0]+8,sc[1]+3,P.s6); for (y=sc[1]+8;y<sc[1]+13;y+=2) for (x=sc[0]+1;x<sc[0]+9;x+=2) b.px(x,y,P.m3);
  // ---- Hängelampen (Glasschirme), Ventilator
  var ct=rnd(R3.p(0,RECT[1],34)[1]); LMP.forEach(function(l){ b.vl(l[0],0,l[1]-4,P.k2); b.poly([[l[0]-2,l[1]-4],[l[0]+3,l[1]-4],[l[0]+7,l[1]+2],[l[0]-6,l[1]+2]],function(xx,yy){ return (yy>=l[1])?P.y4:((xx<l[0])?P.s5:P.s4); }); b.hl(l[0]-6,l[0]+7,l[1]+2,P.y5); b.px(l[0],l[1]+3,P.l1); });
  var fp=rp(R3.p(160,RECT[1],30)); b.vl(fp[0],fp[1],fp[1]+4,P.k2); b.rect(fp[0]-2,fp[1]+4,5,3,P.w1); b.line(fp[0]-16,fp[1]+6,fp[0]-2,fp[1]+5,P.w2); b.line(fp[0]+3,fp[1]+5,fp[0]+17,fp[1]+7,P.w2); b.line(fp[0]-3,fp[1]+7,fp[0]-8,fp[1]+9,P.w1);
  // ---- Licht
  shade(b,0,0,tod,function(x,y){ return !WM[y*W+x]; });
  LMP.forEach(function(l){ b.hl(l[0]-6,l[0]+7,l[1]+2,P.y5); b.px(l[0],l[1]+3,P.l1); b.px(l[0]+1,l[1]+3,P.l0); });
  return b; }
var SIGN=[0,0,0,0], TVP=[0,0];

// ---------------------------------------------------------------- Ebenen: Theke (vor Enzo), Kühltruhe, Tische und Stühle
function bistroTable(w,cx,fy){ var ty=fy-21; w.ellipse(cx+0.5,ty,9,2.4,P.s5); w.ellipse(cx+0.5,ty-0.4,8,1.8,P.s6); w.hl(cx-8,cx+9,ty+2,P.s3); for (var i=0;i<5;i++) w.px(cx-6+i*3+(i%2),ty,P.s4);
  w.vl(cx,ty+2,fy-2,P.m1); w.vl(cx+1,ty+2,fy-2,P.m3); w.ellipse(cx+0.5,fy-1,5,1.2,P.k2); }
function chair(w,x,fy,face){ var sy=fy-13, s=face==='R'?-1:1, bx=x+s*6;   // Wiener Kaffeehausstuhl, Lehne hinter der Figur
  w.line(x-4,sy+2,x-5,fy,P.w1); w.line(x+4,sy+2,x+5,fy,P.w1); w.hl(x-4,x+4,sy+7,P.w0);
  w.ellipse(x+0.5,sy+1,6,1.6,P.w2); w.hl(x-5,x+5,sy,P.w3);
  w.vl(bx,sy-14,sy+1,P.w1); w.vl(bx-s*3,sy-12,sy-2,P.w1); w.line(bx,sy-14,bx-s*3,sy-12,P.w1); w.line(bx,sy-7,bx-s*3,sy-5,P.w1); w.px(bx,sy-15,P.w2); }
var MACH=[0,0,0,0];
function layers(S,GS,tod){ var L=[];
  function fin(l){ shade(l,l.ox,l.oy,tod); L.push(l); }
  // Theke: dunkles Holz mit Messingleiste, Marmorplatte; Espressomaschine, Tassen, Cornetti-Vitrine, Zuckerstreuer
  var cr=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1), cl0=M.layer(cr[0]-2,cr[1]-28,cr[2]+6,cr[3]+30,cr[1]+cr[3]), cw=M.lw(cl0);
  var by=rnd(R3.p(0,CNT.Y0,CNT.Z1)[1]);
  R3.box(cw,CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1,{top:function(x,y){ return (fbm(x*0.3,y*0.5)>0.6)?P.s4:P.s5; },front:function(x,y){ var yy=y-by; if (yy<2) return P.s6; if (yy<3) return P.y3; if (yy>=21) return P.k2; var p=(x%12); return (p<1)?P.w0:((yy>4&&yy<19&&p>2&&p<11)?((p===3||yy===5)?P.w1:P.w3):P.w2); },left:P.w1});
  var ct=rp(R3.p(CNT.X0,CNT.Y0,CNT.Z1)), cty=ct[1]-1, ex=ct[0]+16;
  cw.rect(ex,cty-14,30,14,P.m3); cw.hl(ex,ex+29,cty-14,P.m4); cw.vl(ex,cty-14,cty-1,P.m4); cw.vl(ex+29,cty-14,cty-1,P.m1); cw.hl(ex,ex+29,cty-8,P.m2);
  cw.rect(ex+3,cty-12,24,3,P.s6); cw.hl(ex+3,ex+26,cty-12,P.l1); cw.rect(ex+12,cty-17,6,3,P.m4); cw.px(ex+14,cty-18,P.y3);                            // Chromhaube, Adler-loser Knauf
  cw.rect(ex+5,cty-7,5,2,P.k2); cw.rect(ex+19,cty-7,5,2,P.k2); cw.hl(ex+2,ex+12,cty-6,P.m1); cw.hl(ex+17,ex+27,cty-6,P.m1); cw.px(ex+7,cty-5,P.k1); cw.px(ex+21,cty-5,P.k1);
  cw.rect(ex+6,cty-3,3,2,P.s6); cw.rect(ex+20,cty-3,3,2,P.s6); cw.line(ex+29,cty-10,ex+33,cty-4,P.m4); cw.px(ex+33,cty-3,P.m3);
  for (var c=0;c<5;c++){ cw.rect(ex+2+c*6,cty-17,4,3,P.s6); cw.px(ex+4+c*6,cty-16,P.s4); }
  MACH=[ex-2,cty-20,38,21];
  var vx=ex+52; cw.rect(vx,cty-9,18,9,P.m4); cw.rect(vx+1,cty-8,16,7,P.s5); for (var q=0;q<4;q++) cw.ellipse(vx+3+q*4,cty-2,1.8,1.2,P.t4); cw.hl(vx,vx+17,cty-9,P.s6);                // Vitrine mit Cornetti
  cw.rect(ct[0]+4,cty-6,3,6,P.s6); cw.rect(ct[0]+4,cty-8,3,2,P.m3); cw.rect(ct[0]+9,cty-4,5,4,P.s4); cw.hl(ct[0]+9,ct[0]+13,cty-4,P.s6);                                             // Zuckerstreuer, Serviettenspender
  fin(cl0);
  // Kühltruhe „GELATI“ an der rechten Wand
  var fr=R3.rect(FRZ.X0,FRZ.X1,FRZ.Y0,FY,FRZ.Z0,FRZ.Z1), fl=M.layer(fr[0]-2,fr[1]-4,fr[2]+4,fr[3]+6,fr[1]+fr[3]), fw=M.lw(fl);
  R3.box(fw,FRZ.X0,FRZ.X1,FRZ.Y0,FY,FRZ.Z0,FRZ.Z1,{top:function(x,y){ return ((x+y)%6<1)?P.m3:P.b4; },front:P.s5,left:P.s4});
  var ff=rp(R3.p(FRZ.X0,FRZ.Y0+3,FRZ.Z1)), gw=M.microWidth('GELATI'); fw.rect(ff[0]+1,ff[1],gw+4,7,P.b1); M.microText(fl,'GELATI',ff[0]+3-fl.ox,ff[1]-fl.oy+1,P.s6);
  fin(fl);
  // Tisch 1 mit Stuhl des alten Mannes, Zeitung und Tässchen
  var t1=rp(R3.st(T1.X,T1.Z)), l1=M.layer(t1[0]-12,t1[1]-26,26,28,t1[1]), w1=M.lw(l1); bistroTable(w1,t1[0],t1[1]);
  w1.rect(t1[0]+2,t1[1]-24,3,2,P.s6); w1.px(t1[0]+5,t1[1]-23,P.s6); w1.ellipse(t1[0]+3.5,t1[1]-22,3,0.8,P.s5); w1.poly([[t1[0]-7,t1[1]-22],[t1[0]-1,t1[1]-23],[t1[0],t1[1]-21],[t1[0]-6,t1[1]-20]],P.s4);
  fin(l1);
  var c1=M.layer(GAST3[0]-10,GAST3[1]-32,20,34,GAST3[1]-1), cw1=M.lw(c1); chair(cw1,GAST3[0],GAST3[1],'R'); fin(c1);
  // Tisch 2 mit zwei Stühlen
  var t2=rp(R3.st(T2.X,T2.Z)), l2=M.layer(t2[0]-12,t2[1]-26,26,28,t2[1]), w2=M.lw(l2); bistroTable(w2,t2[0],t2[1]); w2.rect(t2[0]-3,t2[1]-24,3,3,P.s6); w2.rect(t2[0]+3,t2[1]-23,4,2,P.k2); fin(l2);
  var c2=M.layer(t2[0]-24,t2[1]-30,20,32,t2[1]-3), cw2=M.lw(c2); chair(cw2,t2[0]-14,t2[1]-3,'R'); fin(c2);
  var c3=M.layer(t2[0]+4,t2[1]-30,20,32,t2[1]-3), cw3=M.lw(c3); chair(cw3,t2[0]+14,t2[1]-3,'L'); fin(c3);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Fernsehbild, Dampf an der Maschine, Schnee draußen
function dyn(fb,v,S,GS){ var t=v.t, w=wea(GS), i;
  var sx=TVP[0], sy=TVP[1], scene=Math.floor(t/5)%3;
  for (var yy=0;yy<12;yy++) for (var xx=0;xx<16;xx++){ var c;
    if (scene<2){ c=(yy<3)?P.m2:((((xx+Math.floor(t*3))>>2)&1)?P.g4:P.g3); if (yy===3) c=P.s5; if (Math.abs(xx-((t*5)%16))<1 && yy>6) c=P.s6; if ((xx===5||xx===11) && yy>5 && yy<9) c=(xx===5)?P.b3:P.s6; if (yy===0 && xx<6) c=P.s6; }
    else { c=(yy<8)?P.b1:P.m1; if (xx>5&&xx<11&&yy>2&&yy<10) c=(yy<5)?P.p3:P.k2; if (yy===10) c=P.s5; if (yy===10 && xx<9) c=P.y4; }
    if (bayer(xx,yy+Math.floor(t*30))<0.1) c=M.UP[c]; fb.px(sx+xx,sy+yy,c); }
  M.glow(fb,TVP[0]+8,TVP[1]+6,13,t,0.15);
  var ph=(t*0.5)%4; if (ph<1.6) for (i=0;i<8;i++){ var q=((t*0.9+i*0.13)%1), px=rnd(MACH[0]+38+Math.sin(t*2+i)*1.5+q*2), py=rnd(MACH[1]+16-q*14); if (bayer(px,py+Math.floor(t*4))<0.8-q*0.7) fb.px(px,py,q<0.4?P.s6:P.s5); }
  if (w==='snow'){ for (i=0;i<30;i++){ var X=rnd(((hash(i,43)*80+t*4+Math.sin(t*0.7+i)*3)%80+80)%80), Y=rnd(WIN.y0-4+((t*(7+hash(i,41)*7)+hash(i,42)*50)%50)); var X2=X+WIN.x0-6; if (X2>=0&&X2<W&&Y>=0&&Y<H&&WM[Y*W+X2]) fb.px(X2,Y,(i%3)?P.s5:P.s6); }
    for (i=0;i<10;i++){ var X3=rnd(2+((hash(i,53)*30+t*3)%30)), Y3=rnd(30+((t*(7+hash(i,52)*5)+hash(i,54)*60)%60)); if (WM[Y3*W+X3]) fb.px(X3,Y3,P.s6); } } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<116||y>138||x<10||x>310) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false;
  var t2=R3.st(T2.X,T2.Z); if (Math.abs(x-t2[0])<22 && y<t2[1]+2) return false;
  var fr=R3.rect(FRZ.X0,FRZ.X1,FRZ.Y0,FY,FRZ.Z0,FRZ.Z1); if (x>fr[0]-2 && y<fr[1]+fr[3]+2) return false;
  return true; }
function actorLut(a,S,GS,tod){ if (tod==='day'){ return lampAt(a.x,a.y-24)>0.6?WARM.a:null; } var L=levels(tod), f=Math.min(1,lampAt(a.x,a.y-24))*(L.length-1); return L[Math.round(f)].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOOR[0]-2,DOOR[1]+2,DOOR[2]-2,DOOR[3]));
var CR=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1);
var SP=(function(){ var t1=R3.st(T1.X,T1.Z), t2=R3.st(T2.X,T2.Z), tv=M.wallPt(SPEC,'R',TV.u,TV.v), ct=rp(R3.p(CNT.X0,CNT.Y0,CNT.Z1));
  return { door:DQ, counter:[CR[0],CR[1]-10,CR[2],CR[3]+10], machine:[ct[0]+16,ct[1]-22,38,22], photos:[PH.x0,PH.y0,PH.x1-PH.x0,PH.y1-PH.y0], photo1962:[P62.x-2,P62.y-2,P62.w+4,P62.h+8],
    tv:[rnd(tv[0])-16,rnd(tv[1])-12,26,22], tables:[t1[0]-14,t1[1]-28,t2[0]-t1[0]+30,t2[1]-t1[1]+30], window:[WIN.x0-4,WIN.y0-4,WIN.x1-WIN.x0+8,WIN.y1-WIN.y0+10] }; })();
M.defineArt('barsport',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, actorLut:actorLut,
  spots:SP,
  stands:{ door:[26,124,'L'], counter:[226,118,'B'], machine:[214,118,'B'], photos:[146,118,'B'], photo1962:[138,118,'B'], tv:[282,122,'R'], tables:[110,124,'B'], window:[80,118,'B'] },
  actorPos:{ enzo:[ENZO[0],ENZO[1],'L'], gast3:[GAST3[0],GAST3[1],'R'], mala:[176,124,'L'] },
  start:[28,124,'R'], entries:{ map:[28,124,'R'] }
});
})(M);
