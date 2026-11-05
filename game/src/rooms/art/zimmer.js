/* ===== rooms/art/zimmer.js — Markos Zimmer unter dem Dach der Herberge (320 px, Innenraum) =====
   Ein schmales Dachzimmer: rechts die Dachschräge mit Sparren und Brettern, oben dunkle Deckenbalken, weiß gekalkte Wände
   mit Bruchstein, wo der Kalk abgeplatzt ist, ein Dielenboden. Hinten links die Tür zur Treppe, in der Mitte das Fenster
   mit tiefer Laibung und tiefem Fensterbrett (S.dzezva: darauf die kupferne Džezva), dahinter Neretva und Westufer,
   darunter der alte Heizkörper. Unter der Schräge das Bett mit grauer Wolldecke (roter Streifen), am Fußende der Stuhl
   mit Markos Tasche, links der kleine Tisch mit Wasserflasche und Notizbuch. Von einem Balken hängt die Glühbirne am Kabel.
   Geistersicht: Raureif am Glas. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;
// ---------------------------------------------------------------- Raum (Koordinaten wie M.room3: X, Y in Rückwand-Pixeln, Z zum Betrachter)
var VP=[158,54], F=92, XL=60, XR=252, CY=14, FY=100, XS=196, YK=58;   // Fluchtpunkt, Brennweite, Wände, Decke, Boden, Beginn der Schräge, Kniestock
var R3=M.room3(VP,F,FY);
var WIN={X0:124,X1:168,Y0:34,Y1:70,D:9};                 // Fenster in der Rückwand, Tiefe der Laibung
var DOOR={X0:70,X1:94,Y0:42};                            // Tür hinten links
var HEAT={X0:128,X1:164,Y0:78,Y1:94};                    // Heizkörper unter dem Fenster
var BED={X0:198,X1:252,Y0:84,Z0:2,Z1:44};                // Bett unter der Schräge
var TBL={X0:98,X1:118,Y0:80,Z0:6,Z1:20};                 // kleiner Tisch
var CHR={X:110,Z:30};                                    // Kelim vor dem Bett, Markos Schuhe
  b.poly([rp(R3.p(178,FY,48)),rp(R3.p(236,FY,48)),rp(R3.p(236,FY,78)),rp(R3.p(178,FY,78))],function(xx,yy){ var f=R3.floor(xx,yy); if (!f) return P.r2; var u=(f.X-178)/58, v=(f.Z-48)/30, e=Math.min(u,1-u,v,1-v);
    if (e<0.05) return P.r0; if (e<0.12) return ((Math.floor(f.X/3)+Math.floor(f.Z/3))&1)?P.y2:P.r1; var d=Math.abs(u-0.5)*1.4+Math.abs(v-0.5); return d<0.22?P.b0:(d<0.3?P.y2:(((Math.floor(f.X/4)+Math.floor(f.Z/4))%3===0)?P.r1:P.r2)); });
  var sh=rp(R3.p(242,FY,60)); b.rect(sh[0],sh[1]-2,7,2,P.k1); b.rect(sh[0]+3,sh[1]-3,4,1,P.k1); b.rect(sh[0]+9,sh[1]-1,7,2,P.k1); b.rect(sh[0]+12,sh[1]-2,4,1,P.k1);
  // Stuhl mit Markos Tasche (vor dem Tisch)
var BULB={X:150,Z:40,len:22};                            // Glühbirne am Kabel, hängt vom Balken
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
function slopeY(X){ return CY+(X-XS)*(YK-CY)/(XR-XS); }
// Bildschirmpunkt -> sichtbare Fläche {s:'back'|'left'|'right'|'floor'|'ceil'|'slope', X, Y, Z}
function hit(x,y){ var best=null, bk=0, k, X, Y;
  function take(s,kk,XX,YY){ if (kk>=1-1e-6 && kk>bk-1e-9){ bk=kk; best={s:s,X:XX,Y:YY,Z:F*(kk-1)}; } }
  if (x>=XL && x<=XR && y>=CY && y<=FY && (x<XS || y>=slopeY(x))) take('back',1,x,y);
  if (x<XL){ k=(x-VP[0])/(XL-VP[0]); Y=VP[1]+(y-VP[1])/k; if (Y>=CY && Y<=FY) take('left',k,XL,Y); }
  if (x>XR){ k=(x-VP[0])/(XR-VP[0]); Y=VP[1]+(y-VP[1])/k; if (Y>=YK && Y<=FY) take('right',k,XR,Y); }
  if (y>FY){ k=(y-VP[1])/(FY-VP[1]); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XR+0.5) take('floor',k,X,FY); }
  if (y<CY){ k=(y-VP[1])/(CY-VP[1]); X=VP[0]+(x-VP[0])/k; if (X>=XL-0.5 && X<=XS) take('ceil',k,X,CY); }
  var s=(YK-CY)/(XR-XS), den=VP[1]-CY-(VP[0]-XS)*s; if (Math.abs(den)>1e-6){ k=((x-VP[0])*s-(y-VP[1]))/den; if (k>=1){ X=VP[0]+(x-VP[0])/k; Y=VP[1]+(y-VP[1])/k; if (X>=XS-0.5 && X<=XR+0.5) take('slope',k,X,Y); } }
  return best; }

// ---------------------------------------------------------------- Licht: Tag durchs Fenster, nachts die Glühbirne
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.17+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.4+L*0.24+10, g*0.4+L*0.24+12, b*0.42+L*0.24+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.66+L*0.42+26, g*0.54+L*0.32+12, b*0.32+L*0.12]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2));
  return LV[tod]=a; }
var BP=null;
function bulbPos(){ if (BP) return BP; var top=R3.p(BULB.X,CY,BULB.Z); BP=[rd(top[0]),rd(top[1]),rd(top[1])+BULB.len]; return BP; }
function lightAt(x,y,tod){ var bp=bulbPos(), dx=(x-bp[0])/150, dy=(y-bp[2]-34)/96, d=dx*dx+dy*dy, a=d<1?Math.pow(1-d,0.9)*0.95:0; var g=Math.hypot((x-bp[0])/20,(y-bp[2])/16); if (g<1) a=Math.max(a,1-g*0.35); return a>1?1:a; }
function shadeTOD(b,ox,oy,tod,mask){ var L=levels(tod), n=L.length; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var f=lightAt(X,Y,tod)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(L[i],c,X,Y); } }

// ---------------------------------------------------------------- Texturen der Flächen
function lime(u,v,x,y,sd){ var n=fbm(u*0.06+sd,v*0.07,sd), c=ra(R('s3 s4 s5 s6'),0.7+(n-0.5)*0.3+(hash(u>>2,v>>1)-0.5)*0.05,x,y); var p=fbm(u*0.07+sd,v*0.08,sd+4); if (p>0.74) c=tex.ashlar(u,v,R('s2 s3 s4 s4'),6,3); else if (p>0.71) c=P.s3; if (fbm(u*0.13+sd,v*0.04,sd+2)>0.75 && bayer(x,y)<0.3) c=M.DN[c]; return c; }
function surf(h,x,y){ var c;
  if (h.s==='back'){ c=lime(h.X,h.Y,x,y,0); if (h.Y>FY-6) c=(h.Y>FY-1.5)?P.w0:P.w2; return c; }
  if (h.s==='left'){ c=lime(h.Z*1.6,h.Y,x,y,7); if (h.Y>FY-6) c=(h.Y>FY-1.5)?P.w0:P.w2; return M.DN[c]; }
  if (h.s==='right'){ c=lime(h.Z*1.6+300,h.Y,x,y,11); if (h.Y>FY-6) c=(h.Y>FY-1.5)?P.w0:P.w2; return c; }
  if (h.s==='floor') return tex.planks(h.X,y,VP[1],FY,R('w1 w2 w3 w3'),11);
  if (h.s==='ceil'){ var bz=h.Z%28; if (bz<5) return bz<1?P.w0:(bz<3?P.w2:P.w1); c=tex.boards(h.X,h.Z*2.2,R('w1 w2 w3 w3'),9); return c; }   // Querbalken und Bretter
  if (h.s==='slope'){ var rz=h.Z%24, along=(h.X-XS)/(XR-XS); if (rz<4) return rz<1?P.w0:(rz<3?P.w2:P.w1);   // Sparren
    c=tex.boards(h.Z*3+40,along*60,R('w1 w2 w2 w3'),5); if (along>0.97) c=P.w0; return c; }
  return P.k0; }

// ---------------------------------------------------------------- Blick aus dem Fenster: Himmel, Westufer, Neretva
function view(tod,w,GS){ var b=new M.Buf(W,H,P.k0), x0=WIN.X0, y0=WIN.Y0, ww=WIN.X1-WIN.X0, wh=WIN.Y1-WIN.Y0, x, y, r=M.rng(9), night=tod==='night';
  if (w==='rain'||w==='grey') M.scn.sky(b,x0,y0,ww,wh,tod,w,4); else if (tod==='day'){ for (y=y0;y<y0+wh;y++) for (x=x0;x<x0+ww;x++) b.px(x,y,ra(R('b1 b2 b3 b4 b5'),0.1+(y-y0)/wh*1.1,x,y)); } else M.sky(b,x0,y0,ww,wh,tod,3);
  // Hum, dann Häuser des Westufers, Fels, Fluss
  for (x=x0;x<x0+ww;x++){ var t=rd(y0+12+Math.sin(x*0.08)*2); for (y=t;y<y0+wh;y++) b.px(x,y,ra(R('g0 e1 g1 e2 g2'),0.5+(fbm(x*0.3,y*0.4,3)-0.5)*0.6,x,y)); }
  for (x=x0;x<x0+ww;){ var hw=3+Math.floor(r()*5), hh=3+Math.floor(r()*4), base=y0+23+Math.floor(r()*3); for (y=base-hh;y<base;y++) for (var xx=x;xx<Math.min(x0+ww,x+hw);xx++) b.px(xx,y,(xx===x+hw-1)?P.s3:P.s5); for (xx=x;xx<Math.min(x0+ww,x+hw);xx++) b.px(xx,base-hh-1,r()<0.5?P.t3:P.m2); if (hh>3) { b.px(x+1,base-hh+1,P.k2); WL.push([x+1,base-hh+1]); } x+=hw+1+Math.floor(r()*2); }
  for (y=y0+25;y<y0+29;y++) for (x=x0;x<x0+ww;x++) b.px(x,y,ra(R('m1 s1 s2 s3'),0.5+(fbm(x*0.5,y,4)-0.5)*0.6,x,y));
  var WR=w==='rain'?R('e1 a2 e2 a3 m3'):(w==='grey'?R('a1 a2 m2 a3 m3'):R('a2 a3 a4 a5 a6'));
  for (y=y0+29;y<y0+wh;y++) for (x=x0;x<x0+ww;x++){ var c=ra(WR,0.35+(y-y0-29)*0.05+(fbm(x*0.08,y*0.7,7)-0.5)*0.4,x,y); if (Math.sin(x*0.3+y*2.1)>0.92) c=M.UP[c]; b.px(x,y,c); }
  var fog=w==='rain'?0.5:(w==='grey'?0.35:(tod==='day'?0.1:0.2)); M.fogBake(b,function(xx,yy){ return (yy-y0)<26?fog*(1-(yy-y0)/40):0; },{col:w==='rain'?P.s3:P.s4,x:x0,y:y0,w:ww,h:wh});
  if (tod!=='day'){ var tint=M.TINT[tod]||M.TINT.night; for (y=y0+10;y<y0+wh;y++) for (x=x0;x<x0+ww;x++) b.px(x,y,M.tintPx(tint,b.get(x,y),x,y));
    WL.forEach(function(p){ if (hash(p[0],p[1])<(night?0.7:0.4)) b.px(p[0],p[1],hash(p[1],p[0])<0.5?P.y4:P.y3); }); }
  return b; }
var WL=[];

// ---------------------------------------------------------------- Dinge
function dzezva(b,cx,by){ var col=R('t0 t1 t2 t3 t4 t5'), rows=[5,3,4,5,6,6], h=rows.length, top=by-h; for (var j=0;j<h;j++){ var wj=rows[j], x0=cx-(wj>>1); for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=col[4]; if (j===h-1) c=col[1]; b.px(x0+i,top+j,c); } }
  b.px(cx-3,top,col[4]); for (var k=0;k<6;k++) b.px(cx+2+k,top+1-Math.floor(k/3),k>4?P.k2:P.w1); }
function bag(b,x,by){ // Markos Tasche: dunkelblaue Reisetasche mit Riemen
  b.rect(x,by-9,20,9,P.c1); b.hl(x,x+19,by-9,P.c2); b.vl(x,by-9,by-1,P.c2); b.vl(x+19,by-9,by-1,P.c0); b.hl(x+1,x+18,by-5,P.c0); b.rect(x+8,by-11,4,2,P.k2);
  b.line(x+3,by-9,x+8,by-15,P.k1); b.line(x+8,by-15,x+14,by-15,P.k1); b.line(x+14,by-15,x+17,by-9,P.k1); b.px(x+16,by-4,P.m3); b.px(x+3,by-4,P.m3); }

// ---------------------------------------------------------------- Malen
var BASE=null, VIEWB=null;
function inWin(x,y){ return x>=WIN.X0&&x<WIN.X1&&y>=WIN.Y0&&y<WIN.Y1; }
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), w=weaOf(GS), dark=tod!=='day', x, y; WL=[];
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var h=hit(x,y); if (!h) continue; b.px(x,y,surf(h,x,y)); }
  // Kanten: Rückwand zur Schräge, Boden zur Wand, Fußleisten
  for (x=XS;x<=XR;x++){ var sy=rd(slopeY(x)); b.px(x,sy,P.w0); b.px(x,sy+1,P.s2); }
  var c0=R3.p(XL,CY,0); b.line(XL,CY,XL,FY,P.s2);
  // Tür hinten links
  M.prop.door(b,DOOR.X0,DOOR.Y0,DOOR.X1-DOOR.X0,FY-DOOR.Y0,{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),knob:'R'});
  b.rect(DOOR.X0+3,DOOR.Y0+4,6,3,P.s5); b.px(DOOR.X0+5,DOOR.Y0+4,P.k2);                                        // Zimmernummer
  b.px(DOOR.X1+7,58,P.m3); b.px(DOOR.X1+13,58,P.m3); b.rect(DOOR.X1+5,59,6,12,P.s5); b.vl(DOOR.X1+10,59,70,P.s3); b.hl(DOOR.X1+5,DOOR.X1+10,62,P.r3);   // Haken mit Handtuch
  // Fenster: Laibung, Glas mit dem Blick, Rahmen, Fensterbrett
  var vb=view(tod,w,GS); VIEWB=vb;
  var D=WIN.D, a=R3.p(WIN.X0,WIN.Y0,0), q=R3.p(WIN.X1,WIN.Y1,0);
  b.rect(WIN.X0-5,WIN.Y0-5,WIN.X1-WIN.X0+10,WIN.Y1-WIN.Y0+8,P.s5);
  b.poly([[WIN.X0-5,WIN.Y0-5],[WIN.X0,WIN.Y0],[WIN.X0,WIN.Y1],[WIN.X0-5,WIN.Y1+2]],P.s4); b.poly([[WIN.X1+5,WIN.Y0-5],[WIN.X1,WIN.Y0],[WIN.X1,WIN.Y1],[WIN.X1+5,WIN.Y1+2]],P.s3); b.poly([[WIN.X0-5,WIN.Y0-5],[WIN.X1+5,WIN.Y0-5],[WIN.X1,WIN.Y0],[WIN.X0,WIN.Y0]],P.s2);
  b.fn(WIN.X0,WIN.Y0,WIN.X1-WIN.X0,WIN.Y1-WIN.Y0,function(xx,yy){ return vb.get(xx,yy); });
  var mx=rd((WIN.X0+WIN.X1)/2); b.rect(WIN.X0-1,WIN.Y0-1,WIN.X1-WIN.X0+2,2,P.w3); b.rect(WIN.X0-1,WIN.Y1-1,WIN.X1-WIN.X0+2,2,P.w1); b.rect(WIN.X0-1,WIN.Y0,2,WIN.Y1-WIN.Y0,P.w2); b.rect(WIN.X1-1,WIN.Y0,2,WIN.Y1-WIN.Y0,P.w1);
  b.rect(mx-1,WIN.Y0,2,WIN.Y1-WIN.Y0,P.w2); b.hl(WIN.X0,WIN.X1-1,WIN.Y0+14,P.w2); b.rect(mx-4,WIN.Y0+20,2,4,P.y2);
  R3.box(b,WIN.X0-7,WIN.X1+7,WIN.Y1,WIN.Y1+4,0,D,{top:function(xx,yy){ return ((xx+yy)%11===0)?P.s3:P.s5; },front:P.s3});
  SILL=rp(R3.p((WIN.X0+WIN.X1)/2+8,WIN.Y1,D*0.55));
  if (S.dzezva) dzezva(b,SILL[0],SILL[1]); else { b.rect(SILL[0]-10,SILL[1]-2,5,2,P.s6); b.px(SILL[0]-9,SILL[1]-2,P.k2); }   // sonst nur eine Streichholzschachtel
  // Heizkörper (alt, gerippt), Ventil, Rohr
  var h0=rp(R3.p(HEAT.X0,HEAT.Y0,1)), h1=rp(R3.p(HEAT.X1,HEAT.Y1,1)); for (y=h0[1];y<h1[1];y++) for (x=h0[0];x<h1[0];x++){ var fx=(x-h0[0])%4; b.px(x,y,fx===0?P.m1:(fx===1?P.s4:(fx===2?P.s5:P.s3))); }
  b.hl(h0[0],h1[0]-1,h0[1],P.s6); b.hl(h0[0],h1[0]-1,h1[1]-1,P.m1); b.rect(h1[0],h1[1]-4,3,3,P.m2); b.px(h1[0]+1,h1[1]-5,P.r2); b.vl(h1[0]+1,h1[1]-1,FY+3,P.m2); HEATR=[h0[0],h0[1],h1[0]-h0[0],h1[1]-h0[1]];
  // kleiner Tisch mit Wasserflasche und Notizbuch
  R3.box(b,TBL.X0,TBL.X1,TBL.Y0,TBL.Y0+2,TBL.Z0,TBL.Z1,{top:P.w3,front:P.w1,left:P.w2});
  [[TBL.X0+1,TBL.Z1-1],[TBL.X1-2,TBL.Z1-1],[TBL.X0+1,TBL.Z0+1],[TBL.X1-2,TBL.Z0+1]].forEach(function(lg,li){ var p1=R3.p(lg[0],TBL.Y0+2,lg[1]), p2=R3.p(lg[0],FY,lg[1]); b.line(rd(p1[0]),rd(p1[1]),rd(p2[0]),rd(p2[1]),li<2?P.w2:P.w1); });
  var tt=rp(R3.p(TBL.X0+4,TBL.Y0,(TBL.Z0+TBL.Z1)/2)); b.rect(tt[0],tt[1]-8,3,8,P.a5); b.px(tt[0]+1,tt[1]-9,P.b2); b.px(tt[0],tt[1]-6,P.s6); b.rect(tt[0]+6,tt[1]-2,8,2,P.r1); b.hl(tt[0]+6,tt[0]+13,tt[1]-2,P.r2);
  // Bett unter der Schräge: Holzgestell, Matratze, graue Wolldecke mit rotem Streifen, Kissen
  R3.box(b,BED.X0,BED.X1,BED.Y0+6,FY,BED.Z0,BED.Z1,{left:function(xx,yy){ return ((xx+yy)%7===0)?P.w0:P.w1; },front:P.w1});
  R3.box(b,BED.X0,BED.X1,BED.Y0,BED.Y0+6,BED.Z0,BED.Z1,{top:function(xx,yy){ var u=(xx*0.5+yy)%14; return (yy%6===2)?P.r2:((u<1)?P.m2:(((xx+yy)&1)?P.m3:P.m2)); },
    left:function(xx,yy){ return (yy%6===2)?P.r2:(((xx+yy)&1)?P.m2:P.m1); },front:function(xx,yy){ return ((xx>>1)+(yy>>1))&1?P.m2:P.m1; }});
  var pil=rp(R3.p(BED.X0+26,BED.Y0,BED.Z0+5)); b.ellipse(pil[0],pil[1]-1,11,3,P.s6); b.hl(pil[0]-9,pil[0]+9,pil[1]+1,P.s4);
  R3.box(b,BED.X0-2,BED.X0,BED.Y0-10,FY,BED.Z1-2,BED.Z1,{front:P.w2,left:P.w3});                                // Fußteil
  // Kelim vor dem Bett, Markos Schuhe
  b.poly([rp(R3.p(178,FY,48)),rp(R3.p(236,FY,48)),rp(R3.p(236,FY,78)),rp(R3.p(178,FY,78))],function(xx,yy){ var f=R3.floor(xx,yy); if (!f) return P.r2; var u=(f.X-178)/58, v=(f.Z-48)/30, e=Math.min(u,1-u,v,1-v);
    if (e<0.05) return P.r0; if (e<0.12) return ((Math.floor(f.X/3)+Math.floor(f.Z/3))&1)?P.y2:P.r1; var d=Math.abs(u-0.5)*1.4+Math.abs(v-0.5); return d<0.22?P.b0:(d<0.3?P.y2:(((Math.floor(f.X/4)+Math.floor(f.Z/4))%3===0)?P.r1:P.r2)); });
  var sh=rp(R3.p(242,FY,60)); b.rect(sh[0],sh[1]-2,7,2,P.k1); b.rect(sh[0]+3,sh[1]-3,4,1,P.k1); b.rect(sh[0]+9,sh[1]-1,7,2,P.k1); b.rect(sh[0]+12,sh[1]-2,4,1,P.k1);
  // Stuhl mit Markos Tasche
  var cs=rp(R3.p(CHR.X,FY,CHR.Z)); var cx=cs[0], cy=cs[1]; b.rect(cx-7,cy-15,15,3,P.w3); b.hl(cx-7,cx+7,cy-15,P.w4); b.vl(cx-6,cy-12,cy-1,P.w1); b.vl(cx+6,cy-12,cy-1,P.w1); b.vl(cx-4,cy-13,cy-3,P.w0); b.vl(cx+4,cy-13,cy-3,P.w0);
  b.rect(cx+5,cy-34,3,20,P.w2); b.hl(cx+5,cx+7,cy-34,P.w4); b.hl(cx-6,cx+7,cy-26,P.w2); b.hl(cx-6,cx+7,cy-30,P.w2); b.rect(cx-7,cy-35,2,21,P.w2);
  bag(b,cx-10,cy-15); CHAIR=[cx-10,cy-36,20,36];
  // Glühbirne: Kabel vom Balken (die Birne selbst in dynamic, sie schwingt)
  var bp=bulbPos(); b.px(bp[0],bp[1],P.w0); b.px(bp[0]-1,bp[1],P.k1); b.px(bp[0]+1,bp[1],P.k1);
  // Licht
  var notWin=function(xx,yy){ return !inWin(xx,yy); };
  if (!dark){ var wl=M.lf.sum(M.lf.pool((WIN.X0+WIN.X1)/2,118,120,30,w==='bura'||w==='calm'||w==='frost'?0.7:0.4),M.lf.pool((WIN.X0+WIN.X1)/2,60,90,56,0.4),M.lf.vignette(W,144,2.0),M.lf.k(w==='rain'?-0.45:(w==='grey'?-0.3:-0.05)));
    M.light(b,wl,0,0,notWin); BASE=b.clone(); return b; }
  M.light(b,M.lf.vignette(W,144,1.2),0,0,notWin);
  BASE=b.clone(); shadeTOD(b,0,0,tod,notWin);
  return b; }
var SILL=[160,74], HEATR=[130,78,34,16], CHAIR=[180,90,20,36];

// ---------------------------------------------------------------- jedes Bild: Glühbirne schwingt, Regen am Fenster, Heizkörper tickt
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, w=weaOf(GS), bp=bulbPos(), sw=Math.sin(t*1.3)*1.6+Math.sin(t*0.53)*0.6, lit=tod!=='day'||w==='rain'||w==='grey', i;
  var bx=rd(bp[0]+sw), by=bp[2];
  for (i=1;i<=BULB.len;i++){ var xx=rd(bp[0]+sw*i/BULB.len); fb.px(xx,bp[1]+i,P.k1); }
  fb.rect(bx-1,by,3,2,P.m1); fb.px(bx,by+1,P.m2);
  var gc=lit?P.y5:P.s5; fb.ellipse(bx+0.5,by+4.5,2.4,2.8,gc); fb.px(bx,by+4,lit?P.l1:P.s6); if (!lit) fb.px(bx+1,by+5,P.s3);
  if (lit && tod!=='day') M.glow(fb,bx+0.5,by+4,10,t,0.25);
  if (w==='rain') M.scn.windowRain(fb,WIN.X0,WIN.Y0,WIN.X1-WIN.X0,WIN.Y1-WIN.Y0,t,0);
  if ((t%3.1)<0.08){ var hr=HEATR; fb.px(hr[0]+hr[2]-2,hr[1]+1,P.l1); }                                            // tickt
  if (S.dzezva && tod!=='night'){ var s=SILL; if (Math.sin(t*0.7)>0.6) fb.px(s[0]-1,s[1]-8,P.s5); } }
// Geistersicht: Raureif am Glas (Eisblumen, von den Rändern her), kälter am Fenster
function ghost(fb,v,S,GS){ var t=v.t, x0=WIN.X0, y0=WIN.Y0, ww=WIN.X1-WIN.X0, wh=WIN.Y1-WIN.Y0;
  for (var y=y0;y<y0+wh;y++) for (var x=x0;x<x0+ww;x++){ var e=Math.min(x-x0,x0+ww-1-x,(y-y0)*1.4,(y0+wh-1-y)*0.6), f=fbm(x*0.4,y*0.4,3)*10-e*0.8+Math.sin(x*1.3+y*0.7)*1.2;
    if (f>2.6+Math.sin(t*0.3)*0.4) fb.d[y*320+x]=(f>5)?P.x6:(f>3.8?P.x5:P.x4); else if (f>1.8 && bayer(x,y)<0.3) fb.d[y*320+x]=P.x3; }
  for (var k=0;k<40;k++){ var gx=x0-10+Math.floor(hash(k,1)*(ww+20)), gy=y0+wh+2+Math.floor(hash(k,2)*20); if (bayer(gx,gy+Math.floor(t*2))<0.35) fb.px(gx,gy,P.x2); } }

// ---------------------------------------------------------------- Lauffläche (Boden ohne Möbel)
function walk(x,y){ if (y<114||y>138||x<20||x>300) return false; var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (X<XL+3||X>XR-3) return false;
  if (X>BED.X0-4 && Z<BED.Z1+4) return false;
  if (X>238 && Z>54 && Z<66) return false;                                    // Schuhe
  if (X>TBL.X0-4 && X<TBL.X1+4 && Z<TBL.Z1+4) return false;
  if (Math.abs(X-CHR.X)<9 && Math.abs(Z-CHR.Z)<6) return false;
  return true; }
var BR=R3.rect(BED.X0,BED.X1,BED.Y0-10,FY,BED.Z0,BED.Z1), TR=R3.rect(TBL.X0,TBL.X1,TBL.Y0-10,FY,TBL.Z0,TBL.Z1);
M.defineArt('zimmer',{
  width:W, paint:paint, dynamic:dyn, ghost:ghost, walk:walk,
  actorLut:function(a,S,GS,tod){ if (tod==='day'||!TF[tod]) return null; var L=levels(tod); return L[Math.max(0,Math.min(L.length-1,Math.round(lightAt(a.x,a.y-22,tod)*(L.length-1))))].a; },
  spots:{
    door:[DOOR.X0-3,DOOR.Y0-3,DOOR.X1-DOOR.X0+6,FY-DOOR.Y0+3],
    bed:[BR[0],BR[1]-2,Math.min(BR[2],W-BR[0]),BR[3]+2],
    window:[WIN.X0-6,WIN.Y0-6,WIN.X1-WIN.X0+12,WIN.Y1-WIN.Y0+4],
    sill:[WIN.X0-8,WIN.Y1-2,WIN.X1-WIN.X0+16,9],
    bag:[CHAIR[0],CHAIR[1]+14,22,10],
    chair:[CHAIR[0],CHAIR[1],CHAIR[2]+2,CHAIR[3]],
    heater:[HEATR[0]-2,HEATR[1]-1,HEATR[2]+6,HEATR[3]+4],
    lamp:(function(){ var bp=bulbPos(); return [bp[0]-6,bp[1],13,BULB.len+10]; })()
  },
  stands:{ door:[84,116,'B'], bed:[200,122,'R'], window:[146,116,'B'], sill:[150,116,'B'], bag:[124,118,'L'], chair:[124,118,'L'], heater:[146,116,'B'], lamp:[150,120,'B'] },
  actorPos:{ mala:[92,117,'R'] },
  start:[196,123,'L'], entries:{ herberge:[86,117,'R'] }
});
})(M);
