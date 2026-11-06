/* ===== rooms/art/jwohnung.js — Jasnas Wohnung: Flur und Wohnküche (400 px, scrollend) =====
   Links der Flur: Wohnungstür mit Spion und Kette, davor ein Paar Herrenpantoffeln, gerade gestellt (S.slippers, bis zum
   Epilog), an der Wand das gerahmte Foto (ein Mann mit Schnurrbart lehnt an einem roten Zastava 101, auf der Motorhaube sitzt
   ein kleines Mädchen), die Garderobe (S.jasnaHome: Jasnas dunkelblauer Mantel und die Handtasche). Ein Wandvorsprung trennt die
   Wohnküche: Küchenzeile mit Spüle, Hängeschränken, weißen Fliesen und Herd (S.dzezva: die Džezva auf der Platte, die Platte
   glüht bei S.cook), davor der Tisch mit Wachstuch und vier Stühlen (S.box: die Kiste steht offen darauf). Das Fenster zur
   Straße mit dem kleinen Tannenbaum auf dem Fensterbrett (winzige Lichter), gegenüber Altbaufenster, nachts gelb; S.ironing: in
   einem bügelt eine Frau. Der Kalender mit Kinderzeichnungen über dem Röhrenfernseher (S.tv: er läuft und flimmert), das zu
   kurze Sofa mit Wolldecke, darüber das Regal mit Ordnern (einer liegt quer: „VRATNIK - KROV“), rechts die Schlafzimmertür.
   Geistersicht: Glanz auf den Pantoffeln; am Fensterrahmen der Abdruck einer Hand in Kopfhöhe einer kleinen Frau. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144;
var VP=[200,54], F=110, FY=100, XL=6, XR=394, CY=10;
var R3=M.room3(VP,F,FY);
var DOOR={x0:20,x1:48,y0:42};                             // Wohnungstür (Rückwand)
var PHOTO={x0:58,x1:80,y0:36,y1:54};
var COAT={x0:86,x1:114,y0:34};
var STUB={X0:118,X1:124,Z1:10};                           // Wandvorsprung zwischen Flur und Küche
var KIT={X0:128,X1:228,Y0:78,Z1:14}, SINK={X0:146,X1:168}, STOVE={X0:202,X1:228};
var UPC={X0:128,X1:194,Y0:24,Y1:46}, HOOD={X0:202,X1:228,Y0:34,Y1:44};
var WIN={x0:236,x1:272,y0:24,y1:70};
var TV={X0:282,X1:308,Y0:64,Y1:84}, TVC={X0:278,X1:312,Y0:84};
var CAL={x0:285,x1:301,y0:24,y1:48};
var SOFA={X0:314,X1:360,Z0:2,Z1:20};
var SHELF={X0:314,X1:366,Y1:34,Y2:52};
var BED={x0:368,x1:392,y0:44};                            // Schlafzimmertür
var TBL={X0:144,X1:188,Y0:80,Z0:24,Z1:44};
var LAMP={X:166,Z:34,len:20};
// ---------------------------------------------------------------- kleine Helfer
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function hit(x,y){ var k, X, Y;
  if (x>=XL && x<=XR && y>=CY && y<=FY) return {s:'back',X:x,Y:y,Z:0};
  if (y>FY){ k=(y-VP[1])/(FY-VP[1]); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'floor',X:X,Y:FY,Z:(k-1)*F}; }
  if (y<CY){ k=(VP[1]-y)/(VP[1]-CY); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) return {s:'ceil',X:X,Y:CY,Z:(k-1)*F}; }
  if (x<XL){ k=(x-VP[0])/(XL-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'left',X:XL,Y:Y,Z:(k-1)*F}; }
  if (x>XR){ k=(x-VP[0])/(XR-VP[0]); Y=VP[1]+(y-VP[1])/k; return {s:'right',X:XR,Y:Y,Z:(k-1)*F}; }
  return null; }

// ---------------------------------------------------------------- Licht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.4+L*0.24+10, g*0.4+L*0.24+12, b*0.42+L*0.24+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2));
  return LV[tod]=a; }
var LP=null; function lampPos(){ if (LP) return LP; var top=R3.p(LAMP.X,CY,LAMP.Z); LP=[rd(top[0]),Math.max(0,rd(top[1])),Math.max(0,rd(top[1]))+LAMP.len]; return LP; }
var TVON=false;
function lightAt(x,y){ var lp=lampPos(), dx=(x-lp[0])/150, dy=(y-lp[2]-30)/90, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,0.9)*0.95:0; var g=Math.hypot((x-lp[0])/22,(y-lp[2])/14); if (g<1) a=Math.max(a,1-g*0.35);
  var fx=(x-48)/60, fy=(y-70)/60, fd=fx*fx+fy*fy; if (fd<1) a=Math.max(a,(1-fd)*0.55);                 // Flurlampe
  if (TVON){ var tx=(x-300)/50, ty=(y-90)/40, td=tx*tx+ty*ty; if (td<1) a=Math.max(a,(1-td)*0.35); }
  var sx=(x-FLAMPW[0])/70, sy=(y-FLAMPW[1]-24)/64, sd=sx*sx+sy*sy; if (sd<1) a=Math.max(a,Math.pow(1-sd,0.9)*0.7);   // Stehlampe am Sofa
  return a>1?1:a; }
function shadeTOD(b,ox,oy,tod,mask){ var L=levels(tod), n=L.length; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var f=lightAt(X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Flächen: Flur mit Tapete, Küche hell, Dielen
function wallTex(u,v,x,y,sd){ var c;
  if (v>FY-3) return (v>FY-1.5)?P.w0:P.w2;
  if (u<121){ var su=((u%9)+9)%9, mv=((v%10)+10)%10; c=ra(R('e3 e4 s4'),0.5+(fbm(u*0.05,v*0.05,sd)-0.5)*0.3,x,y); if (su<1) c=P.e3; if (Math.abs(su-4.5)+Math.abs(mv-5)<1.6) c=P.s5; return c; }   // Flur: Tapete
  c=ra(R('s3 s4 s5 s6'),0.66+(fbm(u*0.04,v*0.05,sd+2)-0.5)*0.3,x,y); if (v<CY+3) c=P.s4; return c; }
function surf(h,x,y){ if (h.s==='back') return wallTex(h.X,h.Y,x,y,0); if (h.s==='left') return M.DN[wallTex(h.Z*1.4,h.Y,x,y,7)]; if (h.s==='right') return M.DN[wallTex(h.Z*1.4+300,h.Y,x,y,11)];
  if (h.s==='floor') return M.tex.planks(h.X,y,VP[1],FY,R('w1 w2 w3 w3'),12); if (h.s==='ceil') return (Math.floor(h.Z)%34<1)?P.s3:P.s5; return P.k0; }

// ---------------------------------------------------------------- Flur: Tür, Pantoffeln, Foto, Garderobe
function hallway(b,S,tod){ var d=DOOR, w=d.x1-d.x0, x, y;
  M.prop.door(b,d.x0,d.y0,w,FY-d.y0,{ramp:R('w1 w2 w3 w4 w5'),frame:R('s3 s4 s5 s6'),knob:'R'});
  b.px(d.x0+w/2,d.y0+14,P.k1); b.px(d.x0+w/2,d.y0+13,P.m3);                                           // Spion
  b.line(d.x1-3,d.y0+24,d.x1+2,d.y0+27,P.m3); b.px(d.x1+2,d.y0+28,P.m3);                               // Kette
  b.rect(d.x1+6,d.y0+20,6,9,P.w2); for (var k=0;k<3;k++) b.px(d.x1+7+k*2,d.y0+22,P.y3); b.vl(d.x1+9,d.y0+23,d.y0+27,P.m3);   // Schlüsselbrett
  // Foto im Rahmen: der Mann am roten Zastava, das Mädchen auf der Motorhaube
  var p=PHOTO; b.rect(p.x0,p.y0,p.x1-p.x0,p.y1-p.y0,P.w1); b.hl(p.x0,p.x1-1,p.y0,P.w3); b.rect(p.x0+2,p.y0+2,p.x1-p.x0-4,p.y1-p.y0-4,P.s6);
  var ix=p.x0+3, iy=p.y0+3, iw=p.x1-p.x0-6, ih=p.y1-p.y0-6; for (y=iy;y<iy+ih;y++) for (x=ix;x<ix+iw;x++) b.px(x,y,y<iy+ih-5?((y<iy+5)?P.b4:P.s4):P.e3);
  b.rect(ix+5,iy+ih-8,11,4,P.r3); b.rect(ix+7,iy+ih-10,6,2,P.r2); b.hl(ix+5,ix+15,iy+ih-8,P.r4); b.px(ix+6,iy+ih-4,P.k1); b.px(ix+14,iy+ih-4,P.k1); b.rect(ix+8,iy+ih-10,3,1,P.c3);   // Auto
  b.rect(ix+2,iy+ih-12,2,8,P.c1); b.rect(ix+2,iy+ih-14,2,2,P.p2); b.px(ix+2,iy+ih-13,P.h1);                                                                       // der Mann
  b.rect(ix+11,iy+ih-12,2,3,P.y4); b.px(ix+11,iy+ih-13,P.p3);                                                                                                       // das Mädchen
  M.tintApply(b,M.TINT.memory,ix,iy,iw,ih);
  // Garderobe: Hakenleiste, Mäntel, Schuhablage
  var c=COAT; b.rect(c.x0,c.y0,c.x1-c.x0,3,P.w2); b.hl(c.x0,c.x1-1,c.y0,P.w4); for (x=c.x0+3;x<c.x1;x+=7) b.px(x,c.y0+3,P.m3);
  b.rect(c.x0+2,c.y0+4,8,32,P.e2); b.vl(c.x0+2,c.y0+4,c.y0+35,P.e3); b.rect(c.x0+3,c.y0+4,6,3,P.e1);                     // Markos Jacke
  if (S.jasnaHome){ b.rect(c.x0+11,c.y0+4,9,40,P.c1); b.vl(c.x0+11,c.y0+4,c.y0+43,P.c2); b.vl(c.x0+19,c.y0+6,c.y0+43,P.c0); b.rect(c.x0+12,c.y0+4,7,3,P.c0);   // Jasnas dunkelblauer Mantel
    b.rect(c.x0+20,c.y0+20,7,8,P.w1); b.hl(c.x0+20,c.x0+26,c.y0+20,P.w2); b.line(c.x0+21,c.y0+20,c.x0+23,c.y0+10,P.w0); b.line(c.x0+25,c.y0+20,c.x0+23,c.y0+10,P.w0); }   // Handtasche
  b.rect(c.x0+21,c.y0+4,5,14,P.m2); b.hl(c.x0+21,c.x0+25,c.y0+4,P.m3);                                                    // grauer Schal
  var s0=rp(R3.p(c.x0,FY-8,2)), s1=rp(R3.p(c.x1,FY-8,10)); b.rect(s0[0],s0[1],s1[0]-s0[0],2,P.w3); b.rect(s0[0],s0[1]+2,s1[0]-s0[0],1,P.w1);
  b.rect(s0[0]+3,s0[1]-5,4,5,P.k2); b.rect(s0[0]+8,s0[1]-6,4,6,P.w0); b.rect(s0[0]+15,s0[1]-3,6,3,P.e1); }               // Stiefel, Schuhe
function slippers(b,S){ if (S.slippers===false) return;                                                                 // Herrenpantoffeln, gerade gestellt
  [[38,8],[47,8]].forEach(function(q){ var a=rp(R3.p(q[0],FY,q[1])), e=rp(R3.p(q[0]+7,FY,q[1]+7)); var w=Math.max(4,e[0]-a[0]), h=Math.max(3,e[1]-a[1]);
    b.ellipse(a[0]+w/2,a[1]+h/2,w/2+0.5,h/2+0.4,function(xx,yy){ return yy<a[1]+h/2?P.r1:P.r2; }); b.hl(a[0]+1,a[0]+w-2,a[1],P.w1); b.px(a[0]+1,a[1]+h-1,P.k2); }); }

// ---------------------------------------------------------------- Küche: Zeile, Herd, Džezva, Hängeschränke, Fliesen
function kitchen(b,S,tod){ var x, y;
  // Fliesen zwischen Arbeitsplatte und Hängeschränken
  for (y=46;y<KIT.Y0;y++) for (x=KIT.X0;x<KIT.X1;x++){ var c=((x-KIT.X0)%6===0||(y-46)%6===0)?P.s3:P.s6; if (hash(x>>2,y>>2)<0.08 && c===P.s6) c=P.b5; b.px(x,y,c); }
  b.hl(KIT.X0,KIT.X1-1,46,P.s4);
  // Hängeschränke und Dunstabzug
  R3.box(b,UPC.X0,UPC.X1,UPC.Y0,UPC.Y1,0,9,{front:P.s5,bottom:P.s3,right:P.s4});
  var u0=rp(R3.p(UPC.X0,UPC.Y0,9)), u1=rp(R3.p(UPC.X1,UPC.Y1,9)); for (x=u0[0]+rd((u1[0]-u0[0])/3);x<u1[0];x+=rd((u1[0]-u0[0])/3)) b.vl(x,u0[1],u1[1]-1,P.s3); for (x=u0[0]+6;x<u1[0];x+=rd((u1[0]-u0[0])/3)) b.rect(x,u1[1]-5,1,3,P.m2);
  R3.box(b,HOOD.X0,HOOD.X1,HOOD.Y0,HOOD.Y1,0,12,{front:P.m3,bottom:P.m1,left:P.m2}); var h0=rp(R3.p(HOOD.X0+6,HOOD.Y0,0)); b.rect(h0[0],CY+2,(HOOD.X1-HOOD.X0)-12,HOOD.Y0-CY-2,P.m3);
  // Unterschränke mit Arbeitsplatte, Herd mit Backofen
  R3.box(b,KIT.X0,KIT.X1,KIT.Y0+2,FY,0,KIT.Z1,{front:P.s5,left:P.s4});
  R3.box(b,KIT.X0,KIT.X1+1,KIT.Y0,KIT.Y0+2,0,KIT.Z1+1,{top:P.e4,front:P.e2,left:P.e3});
  var f0=rp(R3.p(KIT.X0,KIT.Y0+2,KIT.Z1)), f1=rp(R3.p(KIT.X1,FY,KIT.Z1));
  for (x=f0[0];x<f1[0];x+=11){ b.vl(x,f0[1]+1,f1[1]-2,P.s3); if (x+5<f1[0]) b.rect(x+4,f0[1]+3,3,1,P.m2); }
  b.hl(f0[0],f1[0]-1,f1[1]-3,P.k2);
  var o0=rp(R3.p(STOVE.X0,KIT.Y0+2,KIT.Z1)), o1=rp(R3.p(STOVE.X1,FY,KIT.Z1)); b.rect(o0[0],o0[1],o1[0]-o0[0],o1[1]-o0[1]-3,P.s6); b.rect(o0[0]+2,o0[1]+6,o1[0]-o0[0]-4,o1[1]-o0[1]-12,P.k2); b.hl(o0[0]+2,o1[0]-3,o0[1]+4,P.m3);
  for (var k=0;k<4;k++) b.px(o0[0]+3+k*5,o0[1]+1,P.k1);
  b.rect(o0[0]+4,o0[1]+5,5,9,P.r2); b.hl(o0[0]+4,o0[0]+8,o0[1]+5,P.r3);                                                    // Geschirrtuch am Griff
  // Spüle mit Hahn
  var sp0=rp(R3.p(SINK.X0,KIT.Y0,3)), sp1=rp(R3.p(SINK.X1,KIT.Y0,KIT.Z1-2)); b.rect(sp0[0],sp0[1],sp1[0]-sp0[0],Math.max(2,sp1[1]-sp0[1]),P.m3); b.hl(sp0[0]+1,sp1[0]-2,sp1[1]-1,P.m2);
  var tp=rp(R3.p((SINK.X0+SINK.X1)/2,KIT.Y0,1)); b.vl(tp[0],tp[1]-7,tp[1]-1,P.m4); b.hl(tp[0],tp[0]+3,tp[1]-7,P.m4); b.px(tp[0]+3,tp[1]-6,P.m3);
  // Kochplatten auf dem Herd
  PLATES=[]; [[STOVE.X0+6,4],[STOVE.X0+18,4],[STOVE.X0+6,11],[STOVE.X0+18,11]].forEach(function(q){ var pp=rp(R3.p(q[0],KIT.Y0,q[1])); b.ellipse(pp[0],pp[1],3,1.2,P.k1); b.px(pp[0]-1,pp[1],P.m1); PLATES.push(pp); });
  // Dinge auf der Arbeitsplatte: Kaffeedose, Brotkorb, Tassen
  var a=rp(R3.p(KIT.X0+4,KIT.Y0,5)); b.rect(a[0],a[1]-6,5,6,P.r2); b.hl(a[0],a[0]+4,a[1]-6,P.r3); b.rect(a[0]+7,a[1]-3,9,3,P.w3); b.hl(a[0]+7,a[0]+15,a[1]-4,P.w4);
  var cp=rp(R3.p(SINK.X1+10,KIT.Y0,6)); b.rect(cp[0],cp[1]-3,3,3,P.s6); b.rect(cp[0]+5,cp[1]-3,3,3,P.b3); b.px(cp[0]+3,cp[1]-2,P.s5);
  if (S.dzezva){ var dz=PLATES[2]; dzezva(b,dz[0],dz[1]); } }
var PLATES=[];
function dzezva(b,cx,by){ var col=R('t0 t1 t2 t3 t4 t5'), rows=[5,3,4,5,6,6], h=rows.length, top=by-h; for (var j=0;j<h;j++){ var wj=rows[j], x0=cx-(wj>>1); for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=col[4]; if (j===h-1) c=col[1]; b.px(x0+i,top+j,c); } }
  b.px(cx-3,top,col[4]); for (var k=0;k<6;k++) b.px(cx+2+k,top+1-Math.floor(k/3),k>4?P.k2:P.w1); }

// ---------------------------------------------------------------- Fenster mit Blick auf die Altbaufassade gegenüber, Tannenbaum
var OWIN=[], IRON=null;
function view(b,tod,we,S){ var w=WIN, x, y, night=tod!=='day'; OWIN=[]; IRON=null;
  var fac=R('e3 e4 s4 s5'), sky=night?P.n0:(we==='fog'?P.m4:(we==='thaw'?P.m3:(we==='snow'?P.s4:P.b4)));
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var c;
    if (y<w.y0+6) c=sky;                                                                         // Himmelsstreifen über dem Dach
    else if (y<w.y0+8) c=night?P.n2:P.s6;                                                        // Schnee auf dem Dachrand
    else { var fy=(y-w.y0-8)%18, fx=(x-w.x0+3)%14; c=ra(fac,0.55+(fbm(x*0.2,y*0.2,4)-0.5)*0.3,x,y);
      if (fy===0) c=P.s5; if (fy===1) c=P.e2;                                                    // Gesims mit Schnee
      if (fy>=4 && fy<15 && fx>=3 && fx<11){ c=(fy===4)?P.k2:P.n0; if (fx===7) c=P.e2; OWIN.push([x,y,Math.floor((y-w.y0-8)/18),Math.floor((x-w.x0+3)/14)]); }
      if (fy===15 && fx>=2 && fx<12) c=night?P.n2:P.s6; }                                         // Schnee auf den Fensterbänken
    b.px(x,y,c); }
  if (we==='fog') M.fogBake(b,function(){ return night?0.25:0.4; },{col:night?P.m1:P.m4,x:w.x0,y:w.y0,w:w.x1-w.x0,h:w.y1-w.y0});
  if (we==='thaw' && !night) M.fogBake(b,function(){ return 0.15; },{col:P.m3,x:w.x0,y:w.y0,w:w.x1-w.x0,h:w.y1-w.y0}); }
function windowFrame(b,tod){ var w=WIN, x, y, mx=rd((w.x0+w.x1)/2);
  b.rect(w.x0-4,w.y0-4,w.x1-w.x0+8,3,P.s6); b.rect(w.x0-4,w.y0-4,3,w.y1-w.y0+8,P.s5); b.rect(w.x1+1,w.y0-4,3,w.y1-w.y0+8,P.s4);
  b.rect(w.x0-1,w.y0-1,w.x1-w.x0+2,2,P.s5); b.rect(w.x0-1,w.y1-1,w.x1-w.x0+2,2,P.s4); b.rect(w.x0-1,w.y0,2,w.y1-w.y0,P.s5); b.rect(w.x1-1,w.y0,2,w.y1-w.y0,P.s4);
  b.rect(mx-1,w.y0,2,w.y1-w.y0,P.s5); b.hl(w.x0,w.x1-1,w.y0+16,P.s5); b.rect(mx+2,w.y0+26,1,4,P.m3);
  // Gardine, halb zur Seite
  for (y=w.y0-3;y<w.y1+1;y++){ var g=4+rd(Math.sin(y*0.5)*0.8); for (x=w.x0-1;x<w.x0-1+g;x++) if (bayer(x,y)<0.75) b.px(x,y,((x+y)%3)?P.s6:P.s5); }
  // Fensterbank, Heizkörper
  R3.box(b,w.x0-6,w.x1+6,w.y1+1,w.y1+4,0,6,{top:P.s6,front:P.s4});
  var h0=rp(R3.p(w.x0+2,78,1)), h1=rp(R3.p(w.x1-2,94,1)); for (y=h0[1];y<h1[1];y++) for (x=h0[0];x<h1[0];x++){ var fx=(x-h0[0])%4; b.px(x,y,fx===0?P.s3:(fx===1?P.s5:P.s6)); } b.hl(h0[0],h1[0]-1,h0[1],P.s6); b.rect(h1[0],h1[1]-4,2,3,P.m3); }
var TREE=[], TREEL=[];
function tree(b){ var t=rp(R3.p(WIN.x1-8,WIN.y1+1,3)), x, y; TREE=t; TREEL=[];
  b.rect(t[0]-3,t[1]-5,7,5,P.t3); b.hl(t[0]-4,t[0]+4,t[1]-6,P.t4); b.hl(t[0]-3,t[0]+3,t[1]-1,P.t2);
  for (y=0;y<18;y++){ var hw=Math.floor(y*0.42)+((y%4===3)?1:0); for (x=-hw;x<=hw;x++){ var c=(x<-hw+1)?P.g2:(x>hw-2?P.g1:((hash(x+7,y)<0.3)?P.g4:P.g3)); b.px(t[0]+x,t[1]-24+y,c); } }
  b.px(t[0],t[1]-25,P.y4); [[-2,-17,P.r3],[2,-13,P.y4],[-3,-9,P.b3],[3,-8,P.r3]].forEach(function(q){ b.px(t[0]+q[0],t[1]+q[1],q[2]); });
  for (var k=0;k<7;k++) TREEL.push([t[0]-3+Math.floor(hash(k,4)*7),t[1]-20+Math.floor(hash(k,5)*14)]); }

// ---------------------------------------------------------------- Wohnteil: Kalender, Fernseher, Sofa, Regal, Schlafzimmertür
function living(b,S,tod){ var x, y;
  // Kalender mit Kinderzeichnung (Schneemann, Haus, Sonne)
  var c=CAL; b.rect(c.x0,c.y0,c.x1-c.x0,c.y1-c.y0,P.s6); b.hl(c.x0,c.x1-1,c.y0,P.r3); b.px(rd((c.x0+c.x1)/2),c.y0-2,P.m2);
  b.rect(c.x0+2,c.y0+2,c.x1-c.x0-4,12,P.b5); b.ellipse(c.x0+5,c.y0+11,2,2,P.s6); b.ellipse(c.x0+5,c.y0+8,1.4,1.4,P.s6); b.px(c.x0+5,c.y0+8,P.k1); b.rect(c.x0+9,c.y0+8,5,5,P.r3); b.px(c.x0+10,c.y0+10,P.y4); b.px(c.x0+12,c.y0+4,P.y4); b.px(c.x0+13,c.y0+4,P.y3);
  M.microText(b,'DEZ',c.x0+2,c.y0+15,P.k1); for (y=c.y0+21;y<c.y1-1;y+=2) for (x=c.x0+2;x<c.x1-2;x+=3) b.px(x,y,P.m2); b.px(c.x0+11,c.y0+27,P.r3);
  // Röhrenfernseher auf dem Schränkchen
  R3.box(b,TVC.X0,TVC.X1,TVC.Y0,FY,0,12,{front:P.w2,top:P.w3,left:P.w1}); var tc=rp(R3.p(TVC.X0+3,TVC.Y0+3,12)); b.hl(tc[0],tc[0]+rd((TVC.X1-TVC.X0)*1.1)-6,tc[1]+5,P.w1);
  R3.box(b,TV.X0,TV.X1,TV.Y0,TV.Y1,1,11,{front:P.m1,top:P.m2,left:P.k2});
  var s0=rp(R3.p(TV.X0+3,TV.Y0+3,11)), s1=rp(R3.p(TV.X1-6,TV.Y1-3,11)); TVS=[s0[0],s0[1],s1[0]-s0[0],s1[1]-s0[1]];
  b.rect(TVS[0],TVS[1],TVS[2],TVS[3],P.k2); b.hl(TVS[0]+1,TVS[0]+TVS[2]-2,TVS[1]+1,P.m1); b.px(s1[0]+2,s0[1]+3,P.r3); b.px(s1[0]+2,s0[1]+6,P.m3);
  // Sofa mit Wolldecke
  R3.box(b,SOFA.X0,SOFA.X1,86,FY,SOFA.Z0,SOFA.Z1,{front:P.g2,top:P.g3,left:P.g1});
  R3.box(b,SOFA.X0,SOFA.X1,68,86,0,SOFA.Z0+4,{front:P.g3,top:P.g4,left:P.g2});
  R3.box(b,SOFA.X0-2,SOFA.X0+3,76,FY,SOFA.Z0,SOFA.Z1,{front:P.g2,top:P.g4,left:P.g1}); R3.box(b,SOFA.X1-3,SOFA.X1+2,76,FY,SOFA.Z0,SOFA.Z1,{front:P.g1,top:P.g3,left:P.g2});
  var bl0=rp(R3.p(SOFA.X0+20,70,SOFA.Z0+5)), bl1=rp(R3.p(SOFA.X1-6,FY-4,SOFA.Z1)); for (y=bl0[1];y<bl1[1];y++) for (x=bl0[0];x<bl1[0];x++){ var ck=((Math.floor((x-bl0[0])/3)+Math.floor((y-bl0[1])/3))%2); b.px(x,y,ck?P.r2:P.e3); if ((x-bl0[0])%6===0||(y-bl0[1])%6===0) b.px(x,y,P.r1); }
  var pl=rp(R3.p(SOFA.X0+6,86,SOFA.Z0+6)); b.ellipse(pl[0]+3,pl[1]-3,4,3,P.s5); b.hl(pl[0],pl[0]+6,pl[1],P.s3);
  // Regal mit Ordnern und Büchern
  [SHELF.Y1,SHELF.Y2].forEach(function(Y){ R3.box(b,SHELF.X0,SHELF.X1,Y,Y+2,0,7,{top:P.w3,front:P.w2,bottom:P.w1}); });
  var x0=rp(R3.p(SHELF.X0+1,SHELF.Y2,1))[0], yb=rp(R3.p(SHELF.X0,SHELF.Y2,1))[1];
  var cols=[P.m2,P.c2,P.k2,P.m3,P.c3,P.b1,P.m2]; for (var i=0;i<7;i++){ var fx=x0+i*6; b.rect(fx,yb-15,5,15,cols[i]); b.vl(fx,yb-15,yb-1,M.UP[cols[i]]); b.rect(fx+1,yb-11,3,4,P.s6); b.px(fx+2,yb-4,P.k1); }
  M.prop.books(b,x0+44,yb-12,10,12,7);
  var yt=rp(R3.p(SHELF.X0,SHELF.Y1,1))[1];
  FOLD=[x0+1,yt-8,50,8]; b.rect(FOLD[0],FOLD[1],FOLD[2],FOLD[3],P.r2); b.hl(FOLD[0],FOLD[0]+FOLD[2]-1,FOLD[1],P.r3); b.rect(FOLD[0]+1,FOLD[1]+1,FOLD[2]-2,6,P.s6); M.microText(b,'VRATNIK-KROV',FOLD[0]+2,FOLD[1]+2,P.k1);
  // Schlafzimmertür
  M.prop.door(b,BED.x0,BED.y0,BED.x1-BED.x0,FY-BED.y0,{ramp:R('s3 s4 s5 s6 l1'),frame:R('s3 s4 s5 s6'),knob:'L'});
  // Stehlampe neben dem Sofa
  var sl=rp(R3.p(SOFA.X1+4,FY,4)); b.vl(sl[0],sl[1]-44,sl[1]-1,P.m1); b.hl(sl[0]-3,sl[0]+3,sl[1]-1,P.m1); b.poly([[sl[0]-5,sl[1]-44],[sl[0]+5,sl[1]-44],[sl[0]+3,sl[1]-52],[sl[0]-3,sl[1]-52]],P.e4); FLAMP=[sl[0],sl[1]-48]; }
var TVS=[0,0,0,0], FOLD=[0,0,0,0], FLAMP=[0,0], FLAMPW=(function(){ var q=R3.p(SOFA.X1+4,FY,4); return [Math.round(q[0]),Math.round(q[1])-48]; })();

// ---------------------------------------------------------------- Bild
var BASE=null, WE='snowlie';
function inWin(x,y){ return x>=WIN.x0&&x<WIN.x1&&y>=WIN.y0&&y<WIN.y1; }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), we=weaOf(GS), dark=tod!=='day', x, y; WE=we; TVON=!!S.tv;
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=hit(x,y); if (h) b.px(x,y,surf(h,x,y)); }
  // Wandvorsprung zwischen Flur und Küche
  R3.box(b,STUB.X0,STUB.X1,CY,FY,0,STUB.Z1,{front:P.s4,right:P.s5});
  hallway(b,S,tod); slippers(b,S);
  view(b,tod,we,S); windowFrame(b,tod); tree(b);
  kitchen(b,S,tod); living(b,S,tod);
  // Teppich unter dem Tisch
  b.poly([rp(R3.p(TBL.X0-14,FY,TBL.Z0-8)),rp(R3.p(TBL.X1+14,FY,TBL.Z0-8)),rp(R3.p(TBL.X1+14,FY,TBL.Z1+10)),rp(R3.p(TBL.X0-14,FY,TBL.Z1+10))],function(xx,yy){ var f=R3.floor(xx,yy); if (!f) return P.r1; var u=(f.X-TBL.X0+14)/(TBL.X1-TBL.X0+28), v=(f.Z-TBL.Z0+8)/(TBL.Z1-TBL.Z0+18), e=Math.min(u,1-u,v,1-v); if (e<0.04) return P.b0; if (e<0.1) return ((Math.floor(f.X/3)+Math.floor(f.Z/3))&1)?P.y2:P.b1; return (((Math.floor(f.X/5)+Math.floor(f.Z/4))%3)===0)?P.b1:P.c1; });
  // Deckenlampe über dem Tisch
  var lp=lampPos(); b.vl(lp[0],lp[1],lp[2]-4,P.k1); b.poly([[lp[0]-7,lp[2]+1],[lp[0]+7,lp[2]+1],[lp[0]+4,lp[2]-4],[lp[0]-4,lp[2]-4]],P.e4); b.hl(lp[0]-7,lp[0]+7,lp[2]+1,P.e2);
  // Flurlampe an der Decke
  b.ellipse(48,CY+3,5,2.5,P.s5); b.hl(44,52,CY+5,P.s3);
  var notWin=function(xx,yy){ return !inWin(xx,yy); };
  if (!dark){ var bright=(we==='sun'||we==='snowlie'||we==='frost')?0.75:0.45; M.light(b,M.lf.sum(M.lf.pool((WIN.x0+WIN.x1)/2,118,150,36,bright),M.lf.pool((WIN.x0+WIN.x1)/2,56,110,60,0.4),M.lf.pool(40,90,90,60,-0.35),M.lf.vignette(W,H,1.8),M.lf.k(we==='thaw'||we==='fog'?-0.35:-0.1)),0,0,notWin);
    if (we==='sun'){ var q=[[WIN.x0-4,118],[WIN.x1+4,118],[WIN.x1+40,140],[WIN.x0-24,140]]; b.poly(q,function(xx,yy){ var c=b.get(xx,yy); return (bayer(xx,yy)<0.45)?M.UP[c]:c; }); }
    BASE=b.clone(); dayLights(b,S); return b; }
  M.light(b,M.lf.vignette(W,H,1.1),0,0,notWin);
  BASE=b.clone(); shadeTOD(b,0,0,tod,notWin);
  nightLights(b,S,tod); return b; }
function dayLights(b,S){ if (S.tv){ b.rect(TVS[0],TVS[1],TVS[2],TVS[3],P.b3); } }
function nightLights(b,S,tod){ var lp=lampPos();
  b.poly([[lp[0]-7,lp[2]+1],[lp[0]+7,lp[2]+1],[lp[0]+4,lp[2]-4],[lp[0]-4,lp[2]-4]],P.y3); b.hl(lp[0]-6,lp[0]+6,lp[2]+1,P.y5); b.hl(lp[0]-3,lp[0]+3,lp[2]+2,P.l1);
  b.ellipse(48,CY+3,5,2.5,P.y4); b.poly([[FLAMP[0]-5,FLAMP[1]+4],[FLAMP[0]+5,FLAMP[1]+4],[FLAMP[0]+3,FLAMP[1]-4],[FLAMP[0]-3,FLAMP[1]-4]],P.y3);
  // gegenüber: erleuchtete Fenster, in einem bügelt eine Frau
  OWIN.forEach(function(o){ var lit=hash(o[2]*3+1,o[3]*7+2)<0.55 || (S.ironing && o[2]===1 && o[3]===1); if (!lit) return; var c=(o[1]%3===0)?P.y3:P.y4; if (b.get(o[0],o[1])===P.e2) c=P.y2; b.px(o[0],o[1],c); });
  if (S.ironing){ var ix=WIN.x0-3+14+7, iy=WIN.y0+8+18+4; ironing(b,ix,iy); }
  if (S.tv) b.rect(TVS[0],TVS[1],TVS[2],TVS[3],P.b3); }
function ironing(b,x,y){ b.rect(x-2,y+2,3,7,P.k1); b.rect(x-2,y,2,2,P.k1); b.px(x+1,y+4,P.k1); b.px(x+2,y+5,P.k1); b.hl(x-4,x+3,y+7,P.k2); b.px(x+2,y+6,P.m2); }

// ---------------------------------------------------------------- Ebenen: Tisch mit Stühlen (Figuren davor und dahinter), Kiste im Epilog
function tableLayer(S,GS,tod){ var r0=R3.rect(TBL.X0-14,TBL.X1+14,TBL.Y0-22,FY,TBL.Z0-10,TBL.Z1+10), L=M.layer(r0[0]-2,r0[1]-2,r0[2]+4,r0[3]+4,rd(R3.p(0,FY,TBL.Z1)[1])+1), wr=M.lw(L);
  function chair(X,Z,back){ var seatY=FY-12; R3.box(wr,X-5,X+5,seatY,seatY+2,Z-5,Z+5,{top:P.w3,front:P.w1,left:P.w2,right:P.w2});
    [[X-4,Z-4],[X+4,Z-4],[X-4,Z+4],[X+4,Z+4]].forEach(function(q){ var a=R3.p(q[0],seatY+2,q[1]), c=R3.p(q[0],FY,q[1]); wr.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),P.w1); });
    if (back==='B'){ R3.box(wr,X-5,X+5,seatY-16,seatY-12,Z-6,Z-4,{front:P.w2,top:P.w3}); [X-4,X+4].forEach(function(xx){ var a=R3.p(xx,seatY-12,Z-5), c=R3.p(xx,seatY,Z-5); wr.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),P.w2); }); }
    if (back==='L'||back==='R'){ var bx=back==='L'?X-5:X+5; R3.box(wr,bx-1,bx+1,seatY-16,seatY,Z-5,Z+5,{front:P.w2,top:P.w3,left:P.w1,right:P.w2}); } }
  chair(TBL.X0+12,TBL.Z0-6,'B'); chair(TBL.X1-12,TBL.Z0-6,'B');
  // Tisch: Platte mit Wachstuch (rot-weiß kariert), Beine
  [[TBL.X0+2,TBL.Z0+2],[TBL.X1-2,TBL.Z0+2],[TBL.X0+2,TBL.Z1-2],[TBL.X1-2,TBL.Z1-2]].forEach(function(q){ var a=R3.p(q[0],TBL.Y0+2,q[1]), c=R3.p(q[0],FY,q[1]); wr.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),P.w1); wr.line(rd(a[0])+1,rd(a[1]),rd(c[0])+1,rd(c[1]),P.w0); });
  R3.box(wr,TBL.X0,TBL.X1,TBL.Y0,TBL.Y0+2,TBL.Z0,TBL.Z1,{top:function(xx,yy){ var f=R3.floor(xx,yy+(FY-TBL.Y0)*0.0); return (((xx>>1)+(yy>>1))&1)?P.r3:P.s6; },front:P.r2,left:P.r1,right:P.r1});
  var ft=rp(R3.p(TBL.X0,TBL.Y0+2,TBL.Z1)), ft2=rp(R3.p(TBL.X1,TBL.Y0+2,TBL.Z1)); for (var x=ft[0];x<=ft2[0];x++) if ((x>>1)&1) wr.px(x,ft[1]+1,P.r2);
  // Dinge auf dem Tisch
  var mid=rp(R3.p((TBL.X0+TBL.X1)/2,TBL.Y0,(TBL.Z0+TBL.Z1)/2));
  if (S.box){ wr.rect(mid[0]-9,mid[1]-6,18,6,P.w2); wr.hl(mid[0]-9,mid[0]+8,mid[1]-6,P.w3); wr.rect(mid[0]-8,mid[1]-5,16,2,P.w0); wr.rect(mid[0]-7,mid[1]-5,6,2,P.s5); wr.rect(mid[0]+1,mid[1]-5,5,2,P.e4);   // Kiste offen, Papiere
    wr.poly([[mid[0]-9,mid[1]-6],[mid[0]+9,mid[1]-6],[mid[0]+7,mid[1]-14],[mid[0]-7,mid[1]-14]],P.w2); wr.hl(mid[0]-7,mid[0]+7,mid[1]-14,P.w3); wr.px(mid[0],mid[1]-8,P.y3);   // aufgeklappter Deckel mit Schloss
    wr.rect(mid[0]+11,mid[1]-1,7,2,P.s6); wr.hl(mid[0]+12,mid[0]+16,mid[1]-1,P.m2); }
  else { wr.rect(mid[0]-14,mid[1]-2,6,2,P.s5); wr.px(mid[0]-12,mid[1]-3,P.s6); wr.rect(mid[0]+6,mid[1]-3,3,3,P.s6); wr.px(mid[0]+9,mid[1]-2,P.s5); wr.ellipse(mid[0]-2,mid[1]-1,4,1.4,P.y2); wr.px(mid[0]-3,mid[1]-2,P.r3); wr.px(mid[0]-1,mid[1]-2,P.y4); }   // Zeitung, Tasse, Obstschale
  chair(TBL.X0-8,(TBL.Z0+TBL.Z1)/2,'L'); chair(TBL.X1+8,(TBL.Z0+TBL.Z1)/2,'R');
  if (tod!=='day') shadeTOD(L,L.ox,L.oy,tod); else M.light(L,M.lf.sum(M.lf.vignette(W,H,1.8),M.lf.k(-0.05)),L.ox,L.oy);
  return L; }
function layers(S,GS,tod){ return [tableLayer(S,GS,tod)]; }

// ---------------------------------------------------------------- jedes Bild: Herdplatte glüht, Fernseher flimmert, Lichter am Baum, Schnee vor dem Fenster, Dampf
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, tod=v.tod, we=WE, i;
  function px(X,Y,c){ X=X-cam; if (X<0||X>=320||Y<0||Y>=144) return; fb.px(X,Y,c); }
  if (S.cook || (S.dzezva && S.cook!==false && S.jasnaHome)){ var pl=PLATES[2]; if (pl){ var gl=Math.sin(t*2.1)>-0.3; px(pl[0]-2,pl[1],gl?P.r4:P.r3); px(pl[0]+2,pl[1],P.r3); px(pl[0]-1,pl[1]+1,P.r3); px(pl[0]+1,pl[1]+1,gl?P.d5:P.r4); }
    if (S.dzezva) for (i=0;i<4;i++){ var ph=(t*0.5+i/4)%1; if (Math.sin(t*0.9+i)>0.2) px(pl[0]+4+rd(Math.sin(t+i*2)*1.5),pl[1]-8-rd(ph*10),ph<0.5?P.s5:P.s4); } }
  if (S.tv){ var s=TVS; for (var y=s[1];y<s[1]+s[3];y++) for (var x=s[0];x<s[0]+s[2];x++){ var n=Math.sin(x*0.7+t*9)+Math.sin(y*1.3-t*13)+hash(x,(y+Math.floor(t*12))); px(x,y,n>1.6?P.b5:(n>0.4?P.b3:(n>-0.6?P.b2:P.c2))); } }
  if (tod!=='day' || true) TREEL.forEach(function(q,k){ var on=Math.sin(t*1.7+k*1.9)>-0.2; px(q[0],q[1],on?(k%2?P.y5:P.y4):P.y2); });
  if (we==='snow') M.snow(fb,t,{n:26,cam:cam,mask:function(X,Y){ return inWin(X,Y); },col:P.s6,col2:P.s5,wind:5}); }
// Geistersicht: Glanz auf den Pantoffeln, Handabdruck am Fensterrahmen
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  function gp(X,Y,c,a){ X-=cam; if (X<0||X>=320||Y<0||Y>=144) return; if (a!==undefined && bayer(X,Y+Math.floor(t*2))>a) return; fb.d[Y*320+X]=c; }
  if (S.slippers!==false){ [[38,8],[47,8]].forEach(function(q,k){ var a=rp(R3.p(q[0]+3,FY,q[1]+3)); var g=0.6+0.35*Math.sin(t*1.4+k); gp(a[0],a[1]-1,P.x6,g); gp(a[0]+1,a[1]-1,P.x5,g); gp(a[0]-1,a[1],P.x5,g*0.8); gp(a[0]+2,a[1],P.x4,g*0.8); gp(a[0],a[1]-2,P.x4,g*0.6); });
    for (var i=0;i<6;i++){ var sx=26+Math.floor(hash(i,2)*20), sy=96+Math.floor(hash(i,3)*8); gp(sx,sy-Math.floor((t*3+i*2)%8),P.x3,0.5); } }
  // Handabdruck am rechten Fensterrahmen, Kopfhöhe einer kleinen Frau
  var hx=WIN.x1+1, hy=WIN.y0+30, a2=0.65+0.25*Math.sin(t*0.7);
  var hand=['.#.#.','.####','#####','#####','.###.','.###.'];
  for (var r=0;r<hand.length;r++) for (var c=0;c<5;c++) if (hand[r][c]==='#') gp(hx+c-1,hy+r,(r<2)?P.x4:P.x5,a2); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>138||x<10||x>390) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<XL+3||f.X>XR-3) return false;
  if (f.X>TBL.X0-20 && f.X<TBL.X1+20 && f.Z<TBL.Z1+8) return false; return true; }
var TR=R3.rect(TBL.X0-14,TBL.X1+14,TBL.Y0-20,FY,TBL.Z0-10,TBL.Z1+8), KR=R3.rect(STOVE.X0,STOVE.X1,KIT.Y0-2,FY,0,KIT.Z1), SFR=R3.rect(SOFA.X0-2,SOFA.X1+2,68,FY,0,SOFA.Z1), TVR=R3.rect(TV.X0,TV.X1,TV.Y0,FY,0,12);
var SL=(function(){ var a=rp(R3.p(38,FY,8)), c=rp(R3.p(54,FY,15)); return [a[0]-2,a[1]-3,c[0]-a[0]+4,c[1]-a[1]+5]; })();
var SH=(function(){ var a=rp(R3.p(SHELF.X0,SHELF.Y1-12,0)), c=rp(R3.p(SHELF.X1,SHELF.Y2+2,7)); return [a[0],a[1],c[0]-a[0],c[1]-a[1]]; })();
function st(X,Z,f){ return R3.st(X,Z,f); }
M.defineArt('jwohnung',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; var L=levels(tod); return L[Math.max(0,Math.min(L.length-1,Math.round(lightAt(a.x,a.y-22)*(L.length-1))))].a; },
  spots:{
    door:[DOOR.x0-3,DOOR.y0-3,DOOR.x1-DOOR.x0+6,FY-DOOR.y0+3],
    slippers:SL,
    photo:[PHOTO.x0-2,PHOTO.y0-2,PHOTO.x1-PHOTO.x0+4,PHOTO.y1-PHOTO.y0+4],
    coats:[COAT.x0-2,COAT.y0-2,COAT.x1-COAT.x0+4,60],
    stove:[KR[0]-1,KR[1]-8,KR[2]+2,KR[3]+8],
    table:[TR[0],TR[1]+8,TR[2],TR[3]-8],
    shelf:SH,
    folder:[0,0,0,0],
    sofa:[SFR[0],SFR[1],SFR[2],SFR[3]],
    tv:[TVR[0]-1,TVR[1]-1,TVR[2]+2,TVR[3]+1],
    calendar:[CAL.x0-2,CAL.y0-3,CAL.x1-CAL.x0+4,CAL.y1-CAL.y0+5],
    bedroom:[BED.x0-3,BED.y0-3,BED.x1-BED.x0+6,FY-BED.y0+3],
    window:[WIN.x0-5,WIN.y0-5,WIN.x1-WIN.x0+10,WIN.y1-WIN.y0+9],
    tree:[0,0,0,0]
  },
  stands:{ door:[34,114,'B'], slippers:[44,117,'L'], photo:[70,115,'B'], coats:[100,116,'B'], stove:[220,114,'B'], table:[168,127,'B'], shelf:[340,115,'B'], folder:[340,115,'B'], sofa:[338,116,'B'],
    tv:[296,115,'B'], calendar:[294,114,'B'], bedroom:[378,115,'B'], window:[254,115,'B'], tree:[262,115,'B'] },
  actorPos:{ jasna:[0,0,'L'], jasna_table:[0,0,'R','jasna',false,'sit'], mala:[0,0,'L'], ana:[0,0,'L','ana',false,'sit'] },
  start:[64,118,'R'], entries:{ jhaus:[34,116,'R'], jschlaf:[378,116,'L'] }
});
// Spots und Figurenpunkte, die erst nach dem Malen ihre Bildkoordinaten kennen
(function(){ var A=M.ART.jwohnung, b=new M.Buf(W,H,P.k0);
  var sx=rp(R3.p(SHELF.X0+1,SHELF.Y1,1)); A.spots.folder=[sx[0],sx[1]-10,52,11];
  var t=rp(R3.p(WIN.x1-8,WIN.y1+1,3)); A.spots.tree=[t[0]-7,t[1]-27,15,28];
  var j=R3.st(STOVE.X1+10,18,'L'); A.actorPos.jasna=[j[0],j[1],'L'];
  var jt=R3.st(TBL.X0-8,(TBL.Z0+TBL.Z1)/2,'R'); A.actorPos.jasna_table=[jt[0],jt[1],'R','jasna',false,'sit'];
  var an=R3.st(TBL.X1+8,(TBL.Z0+TBL.Z1)/2,'L'); A.actorPos.ana=[an[0],an[1],'L','ana',false,'sit'];
  var ml=R3.st(WIN.x1-4,9,'L'); A.actorPos.mala=[ml[0],ml[1],'L']; })();
})(M);
