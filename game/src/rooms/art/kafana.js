/* ===== rooms/art/kafana.js — Kafana „Kula“, innen: ein niedriger, warmer Raum unter einer Holzdecke mit schweren Balken.
   Hinten die Theke aus dunklem Holz (Vordergrund-Ebene, Emina steht dahinter bis zur Brust verdeckt) mit dem Kaffeeherd
   (heißer Sand, Džezve darin), Zuckerdose, Fildžani mit Lokum, Kaffeemühle; dahinter das Regal voller Džezve und die Preistafel.
   Links das Fenster mit Spitzenvorhang (draußen die Sahat-kula im Nebel) und der Fenstertisch mit Dominosteinen, an dem Šaćir
   sitzt; daneben die gerahmten Fotos (die Belegschaft 1972 vor dem Turm). Rechts hinter der Theke die schmale Tür zur Kammer
   „OSTAVA“ hinter einem Vorhang, an der rechten Wand Kupfertabletts, das alte Radio auf dem Wandbord und eine Sećija mit Kelim.
   Vorn rechts ein Kupfertischchen (Sofra) mit niedrigen Hockern. Links die Eingangstür zur Kula.
   Tag: Kupferlaternen brennen, durchs Fenster kommt graues Nebellicht. Nacht (S.closed, ohne Angabe nachts an): Stühle auf
   den Tischen, nur die Laterne über der Theke. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, VP=[160,52], RECT=[40,18,284,94], F=100, FY=94;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WIN={x:46,y:28,w:44,h:37}, LACE=WIN.y+20;           // Fenster in der Rückwand; Spitzenvorhang ab LACE
var CNT={X0:136,X1:222,Y0:73,Z0:32,Z1:43};             // Theke: Vorderkante unten y≈112, oben y≈82
var TB={X0:84,X1:112,Y0:78,Z0:14,Z1:28};                // Fenstertisch
var SEC={X0:266,X1:284,Y0:80,Z0:2,Z1:44};               // Sećija an der rechten Wand
var OD={x:250,y:48,w:24,h:46};                         // Kammertür in der Rückwand
var DOORL=[16,36,40,94];                               // Eingangstür in der linken Wand (u0,u1,vOben,vUnten)
var FT={cx:294,top:118,base:134,rx:21};                // Kupfertischchen vorn rechts
var LMP={bar:[193,46],win:[125,30],right:[262,30]};    // Kupferlaternen (Mitte des Körpers)
var COP=R('t0 t1 t2 t3 t4 t5'), BRS=R('y0 y1 y2 y3 y4 y5'), WD=R('w0 w1 w2 w3 w4');
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
var RD0=M.wallPt(SPEC,'R',6,65), RADIO=[rnd(RD0[0]),rnd(RD0[1])-9,13,9];
var TT0=R3.p(TB.X0,TB.Y0,TB.Z1), TT1=R3.p(TB.X1,TB.Y0,TB.Z1), ASH=[rnd(TT1[0])-3,rnd(TT0[1])-2];
var BY=rnd(R3.p(CNT.X0,CNT.Y0,CNT.Z1)[1])-1;           // Thekenoberfläche vorn (y)
function closedOf(S,tod){ return (S && S.closed!==undefined) ? !!S.closed : tod==='night'; }
function nightOf(tod){ return tod==='night'||tod==='dusk'; }
function inWin(x,y){ return x>=WIN.x&&x<WIN.x+WIN.w&&y>=WIN.y&&y<WIN.y+WIN.h; }

// ---------------------------------------------------------------- Licht: Kupferlaternen (warm), Nebellicht vom Fenster (kühl)
var WARM=M.tintMake(function(r,g,b){ return [r*0.96+18, g*0.84+7, b*0.66+0]; });
var DEEP=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.30+L*0.06+3, g*0.30+L*0.07+4, b*0.42+L*0.12+12]; });
function lightsOf(night){ return night ? [[LMP.bar[0],76,100,1.25,56],[LMP.bar[0],108,74,0.55,18]]
  : [[LMP.bar[0],70,96,1.15,54],[LMP.win[0]-30,72,70,0.9,42],[LMP.right[0],60,46,0.8,40],[170,114,160,0.35,34]]; }
function lampAmt(L,x,y){ var m=0; for (var i=0;i<L.length;i++){ var l=L[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[4], d=dx*dx+dy*dy; if (d<1) m=Math.max(m,(1-d)*l[3]); } return Math.min(1,m); }
var WLF=1;                                              // Stärke des Fensterlichts (bei Regen schwächer), wird in paint gesetzt
function winLight(x,y){ var dx=(x-WIN.x-WIN.w/2)/64, dy=(y-80)/40, d=dx*dx+dy*dy; return d<1?(1-d)*WLF:0; }
function vig(x,y){ var cx=(x-165)/185, cy=(y-74)/105, v=cx*cx+cy*cy; return -Math.max(0,v-0.28)*2.4; }
function shade(b,ox,oy,night,mask){ var L=lightsOf(night);
  M.light(b,function(x,y){ var a=lampAmt(L,x,y); if (night) return -1.65+a*2.4+vig(x,y)*0.4+winLight(x,y)*0.45; return -0.2+a*0.85+winLight(x,y)*0.6+vig(x,y)*(y<RECT[1]?0.6:1); },ox,oy,mask);
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var a=lampAmt(L,X,Y), q=night?cl((a-0.18)*4.2,0,1):cl((a-0.4)*2.4,0,0.8), q2=cl((a-(night?0.72:0.92))*4,0,1), d=bayer(X,Y);
    b.d[k]=(d<q2)?M.tintPx(M.TINT.lamp,c,X,Y):((d<q)?M.tintPx(WARM,c,X,Y):(night?M.tintPx(DEEP,c,X,Y):c)); } }

// ---------------------------------------------------------------- Texturen
function plaster(u,v,x,y,ramp,base,seed){ var n=0.5*Math.sin(u*0.043+v*0.021+1.3+seed)+0.3*Math.sin(u*0.11-v*0.07+seed*2)+0.45*(hash(Math.floor(u/11)+seed,Math.floor(v/7))-0.5)+0.25*(hash(Math.floor(u/4),Math.floor(v/3)+seed)-0.5);
  var c=M.rampAt(ramp,base+n*0.12,x,y), cr=Math.sin(u*0.29+Math.sin(v*0.21+seed)*2.4+seed); if (Math.abs(cr)<0.03 && hash(Math.floor(u/6),Math.floor(v/9)+seed)<0.25) c=M.DN[c]; return c; }
function wainscot(u,Y,x,y,pw){ var pu=((u+6)%pw+pw)%pw, c=P.w1; if (Y===66) return P.w4; if (Y===67) return P.w3; if (Y===68) return P.w0; if (Y>=91) return (Y===91)?P.w2:P.k2;
  if (pu<2) return pu?P.w0:P.w2; if (pu>=4 && pu<=pw-3 && Y>=71 && Y<=88){ c=P.w2; if (pu===4||Y===71) c=P.w3; if (pu===pw-3||Y===88) c=P.w0; if (c===P.w2 && fbm(x*0.3,y*0.6)>0.62) c=P.w1; } return c; }
function wallBack(u,v,x,y){ var Y=v+RECT[1], c;
  if (Y<66){ c=plaster(u,v,x,y,R('e2 e3 e4 s4 s5'),0.62-(Y<30?(30-Y)*0.024:0),0); if (Y<20) c=M.DN[c]; return c; }
  return wainscot(u,Y,x,y,26); }
function wallSide(u,v,x,y,sd){ var Y=v+RECT[1], c;
  if (Y<66) c=plaster(u*2.1+(sd==='L'?0:300),v,x,y,R('e1 e2 e3 e4 s4'),0.58-(Y<30?(30-Y)*0.022:0),sd==='L'?7:13);
  else c=wainscot(u*1.4,Y,x,y,18);
  return sd==='L'?M.DN[c]:c; }
function floorTex(xb,d,x,y){ var c=tex.planks(xb,y,VP[1],FY,R('w0 w1 w2 w3'),10), f=R3.floor(x,y); if (!f) return c;
  if (c===P.w3 && hash(Math.floor(xb/10),7)<0.7) c=P.w2;
  var wear=Math.exp(-Math.pow((f.Z-50)/14,2))*Math.exp(-Math.pow((f.X-180)/60,2)); if (wear>0.35 && bayer(x,y)<(wear-0.35)*1.2 && c!==P.w0) c=M.UP[c];
  if (hash(Math.floor(f.X/3),Math.floor(f.Z/2))<0.01) c=P.k2; return c; }
function ceilTex(xb,d,x,y){ var c=tex.boards(xb,d*4,R('w0 w1 w1 w2'),7); if ((Math.floor(xb)%14)===0) c=P.k2; return c; }
function kilim(u,v){ var band=Math.floor(v/5)%3, du=((u%8)+8)%8-3.5, dv=((v%5)+5)%5-2, dd=Math.abs(du)*0.6+Math.abs(dv), c=[P.r2,P.r1,P.r2][band];
  if (dd<1.3) c=band===1?P.y2:P.s4; else if (dd<2.1) c=band===1?P.r3:P.b0; if (dv===-2) c=P.w0; return c; }

// ---------------------------------------------------------------- kleine Malhilfen
var DZ=[[3,2,3,4],[4,3,3,4,5],[5,3,4,5,6,6],[6,4,4,5,6,7,7],[7,5,5,6,7,8,8,8]];
function dzezva(b,cx,by,s,col,hd){ col=col||COP; hd=hd===undefined?1:hd; var rows=DZ[s], h=rows.length, top=by-h;   // cx = Mitte, by = Standfläche, s = Größe 0..4
  for (var j=0;j<h;j++){ var wj=rows[j], x0=cx-(wj>>1);
    for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=(i===0)?col[5]:col[4]; if (j===h-1) c=(i<1)?col[2]:col[1]; if (j===1 && i===0) c=col[2]; b.px(x0+i,top+j,c); } }
  var lw=rows[0], lx=cx-(lw>>1); b.px(hd>0?lx-1:lx+lw,top,col[4]);                           // Schnabel
  var hx=hd>0?cx-(rows[1]>>1)+rows[1]:cx-(rows[1]>>1)-1, n=s+4;
  for (var k=0;k<n;k++) b.px(hx+k*hd,top+1-Math.floor(k/3),k>=n-1?P.k2:(k%2?P.w2:P.w1)); }
function tray(b,cx,cy,r,col){ col=col||COP;   // rundes, graviertes Kupfertablett (frontal), hängt an einem Nagel
  b.ellipse(cx+1.2,cy+1.3,r+0.4,r+0.4,P.w0);
  b.ellipse(cx,cy,r+0.5,r+0.5,function(x,y){ var dx=x+0.5-cx, dy=y+0.5-cy, d=Math.hypot(dx,dy)/(r+0.5), a=Math.atan2(dy,dx), c=col[3];
    if (d>0.84) c=(dx+dy<-0.3*r)?col[5]:((dx+dy>0.3*r)?col[1]:col[4]);
    else if (d>0.74) c=col[2];
    else { var ring=Math.abs(d-0.48)<0.07; if (ring) c=col[2]; else if (d<0.48 && d>0.18 && ((Math.floor(a*6/Math.PI)+12)%2)) c=col[4]; else if (d<0.14) c=col[2];
      if (!ring && (dx-dy)<-r*0.2 && (dx-dy)>-r*0.75 && bayer(x,y)<0.5) c=M.UP[c]; }
    return c; });
  b.px(rnd(cx-r*0.5),rnd(cy-r*0.5),P.l0); b.px(rnd(cx),rnd(cy-r)-1,P.k2); }
function lantern(b,x,y,lit,chainTop){ var c0=lit?P.y5:P.t1, c1=lit?P.y4:P.t1;   // Kupferlaterne mit durchbrochenem Körper, an einer Kette
  for (var yy=chainTop;yy<y-7;yy++) b.px(x,yy,(yy%2)?P.k2:P.m1);
  b.px(x,y-8,P.t4); b.rect(x-1,y-7,3,2,P.t3); b.hl(x-1,x+1,y-7,P.t5);
  b.poly([[x-1,y-5],[x+2,y-5],[x+4,y-2],[x+4,y+3],[x+2,y+5],[x-1,y+5],[x-3,y+3],[x-3,y-2]],function(xx,yy){ var u=xx-x+3, c=u<2?P.t4:(u<5?P.t3:P.t2); if (((xx+yy)%3===0) && yy>y-4 && yy<y+4 && u>0 && u<7) c=lit?(u<4?c0:c1):P.k1; return c; });
  b.hl(x-3,x+4,y-2,P.t5); b.hl(x-2,x+3,y+5,P.t1); b.px(x,y+6,P.t3); b.px(x+1,y+6,P.t2); b.px(x,y+7,P.t4); }
function chair(b,x,sy,by,back,ramp){ var Rm=ramp||WD, s=back==='L'?-1:1, bx=x+s*5;   // niedriger Holzstuhl mit Binsensitz (x = Sitzmitte, sy = Sitzhöhe)
  b.line(x-s*4,sy+1,x-s*4,by,Rm[1]); b.line(bx,sy+1,bx,by,Rm[1]); b.line(x+s,sy+2,x+s,by-1,Rm[0]); b.hl(x-4,x+4,sy+6,Rm[0]);
  for (var i=-5;i<=5;i++){ b.px(x+i,sy,((i+sy)&1)?P.e3:P.e4); b.px(x+i,sy+1,((i+sy)&1)?P.e2:P.e3); } b.hl(x-5,x+5,sy+2,Rm[0]);
  b.vl(bx,sy-14,sy,Rm[2]); b.vl(bx+s,sy-13,sy,Rm[0]); b.px(bx,sy-15,Rm[3]); for (var r=0;r<3;r++){ b.hl(Math.min(bx,bx-s*3),Math.max(bx,bx-s*3),sy-12+r*4,Rm[r===0?3:2]); } }
function chairUp(b,x,ty,ramp){ var Rm=ramp||WD;   // Stuhl kopfüber auf dem Tisch (Sitz auf der Platte, Beine nach oben)
  for (var i=-5;i<=5;i++){ b.px(x+i,ty-1,((i+ty)&1)?P.e2:P.e3); b.px(x+i,ty-2,((i+ty)&1)?P.e3:P.e4); } b.hl(x-5,x+5,ty-3,Rm[1]);
  b.vl(x-4,ty-18,ty-4,Rm[2]); b.vl(x+4,ty-18,ty-4,Rm[1]); b.vl(x+1,ty-16,ty-4,Rm[0]); b.vl(x-2,ty-16,ty-4,Rm[0]); b.hl(x-4,x+4,ty-10,Rm[0]); b.px(x-4,ty-19,Rm[3]); b.px(x+4,ty-19,Rm[2]);
  b.vl(x-6,ty,ty+11,Rm[2]); b.vl(x-7,ty,ty+10,Rm[0]); for (var r=0;r<3;r++) b.hl(x-9,x-6,ty+2+r*4,Rm[r?2:3]); }
// niedriger Hocker mit geflochtenem Binsensitz (by = Boden); up = kopfüber (by = Tischplatte)
function stool(b,x,by,up){ var Rm=WD, i;
  function seat(y0){ for (var yy=0;yy<3;yy++) for (var xx=-6;xx<=6;xx++){ var c=(((xx+yy*2)>>1)&1)?P.e3:P.e4; if (yy===2) c=(xx&1)?P.e2:P.e3; if (Math.abs(xx)===6) c=Rm[2]; b.px(x+xx,y0+yy,c); } b.hl(x-6,x+6,y0-1,Rm[3]); }
  if (up){ seat(by-3); b.hl(x-6,x+6,by,Rm[0]); for (i=0;i<2;i++){ b.vl(x-5+i*10,by-13,by-4,Rm[2-i]); b.vl(x-4+i*10,by-13,by-4,Rm[0]); } b.vl(x,by-11,by-4,Rm[0]); b.hl(x-5,x+5,by-9,Rm[1]); b.px(x-5,by-14,Rm[3]); b.px(x+5,by-14,Rm[2]); return; }
  seat(by-11); b.hl(x-6,x+6,by-8,Rm[0]);
  for (i=0;i<2;i++){ b.vl(x-5+i*10,by-8,by,Rm[2-i]); b.vl(x-4+i*10,by-8,by-1,Rm[0]); } b.vl(x,by-8,by-2,Rm[0]); b.hl(x-5,x+5,by-4,Rm[1]); b.hl(x-5,x+5,by-3,Rm[0]); }

// ---------------------------------------------------------------- Blick aus dem Fenster: die Sahat-kula im Nebel
function view(b,tod,weather){ var x0=WIN.x, y0=WIN.y, w=WIN.w, h=WIN.h, x, y, rain=weather==='rain';
  M.scn.sky(b,x0,y0,w,h,'day',rain?'rain':'fog',31);
  // Minarett der Moschee (weit, blass), kahle Äste, Hofmauer
  M.scn.minaret(b,x0+9,y0+h,46,{stone:R('s3 s4 s5 s5'),cap:R('m2 m3 m3 m4')});
  var my=y0+20; for (y=my;y<y0+h;y++) for (x=x0;x<x0+w;x++) b.px(x,y,tex.ashlar(x*1.4,y,R('s2 s3 s4 s5'),8,4));
  for (x=x0;x<x0+w;x++){ b.px(x,my-2,(x%3)?P.t2:P.t1); b.px(x,my-1,P.t3); b.px(x,my,P.s1); }
  // Sahat-kula: schlanker Turm aus hellem Stein, oben das Zifferblatt
  var kx=x0+27, kw=10; for (y=y0;y<y0+h;y++) for (x=kx;x<kx+kw;x++){ var c=tex.ashlar((x-kx)*2.2,y,R('s3 s4 s5 s6'),7,4); if (x===kx) c=P.s6; if (x>=kx+kw-2) c=P.s3; b.px(x,y,c); }
  b.hl(kx-1,kx+kw,y0+11,P.s6); b.hl(kx-1,kx+kw,y0+12,P.s2);
  b.ellipse(kx+kw/2,y0+5.5,3.6,3.6,P.s2); b.ellipse(kx+kw/2,y0+5.5,2.8,2.8,P.s6); for (var m=0;m<12;m+=3){ var an=m/12*Math.PI*2; b.px(rnd(kx+kw/2-0.5+Math.cos(an)*2.2),rnd(y0+5+Math.sin(an)*2.2),P.s3); }
  b.line(rnd(kx+kw/2-0.5),y0+5,rnd(kx+kw/2-0.5),y0+3,P.k2); b.line(rnd(kx+kw/2-0.5),y0+5,rnd(kx+kw/2+1.5),y0+6,P.k2);
  b.vl(kx+4,y0+15,y0+18,P.s1);
  [[x0+3,y0+2,x0+16,y0+9],[x0+10,y0+5,x0+5,y0+13],[x0+16,y0+9,x0+22,y0+6],[x0+1,y0+8,x0+8,y0+11]].forEach(function(l){ b.line(l[0],l[1],l[2],l[3],P.w1); });
  var lx=x0+40; b.vl(lx,y0+12,y0+h-1,P.k2); b.rect(lx-1,y0+9,3,3,P.m2); b.px(lx,y0+8,P.k2);
  M.fogBake(b,function(xx,yy){ if (!inWin(xx,yy)) return 0; var a=rain?0.28:0.42; if (xx<x0+20) a+=0.18; return a; },{col:rain?P.m3:P.s4,x:x0,y:y0,w:w,h:h}); }
// Spitzenvorhang (Scheibengardine): untere Hälfte, gegenlichtig, mit Blumenmuster und gebogtem Saum
function lace(x,y){ var u=x-WIN.x, v=y-LACE, H=WIN.y+WIN.h-LACE; if (v<0||v>=H) return null; if (u===(WIN.w>>1)||u===(WIN.w>>1)-1||u===(WIN.w>>1)+1) return null;
  var sc=Math.round(Math.abs(Math.sin((u+1.5)*Math.PI/5))*2); if (v<3-sc) return null;                       // gebogter Saum oben (die Gardine hängt an der Stange)
  if (v===3-sc) return P.s4; var mu=((u%7)+7)%7-3, mv=((v%8)+8)%8-4, d=Math.abs(mu)+Math.abs(mv)*0.8;
  if (d<0.9) return P.s3; if (d<1.8) return P.s6; if (d<2.6) return (((u+v)&1)===0)?P.s4:P.s5; if (v>H-3) return ((u+v)&1)?P.s4:P.s5; return ((u*3+v*5)%11===0)?P.s4:P.s5; }

// ---------------------------------------------------------------- Fotos: Belegschaft 1972 vor dem Turm, ein Porträt, die Brücke
function photoStaff(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return M.rampAt(R('m1 m2 m3 m4'),0.95-(yy-y)/h*0.8,xx,yy); });
  for (var yy=y+1;yy<y+h-3;yy++){ b.px(x+3,yy,P.s5); b.px(x+4,yy,P.m4); b.px(x+5,yy,P.m3); } b.hl(x+2,x+6,y+4,P.m2); b.ellipse(x+4.5,y+2,1.2,1.2,P.s6); b.px(x+4,y,P.m2);   // der Turm mit der Uhr
  b.rect(x+w-9,y+3,8,2,P.m0); b.hl(x+w-9,x+w-2,y+5,P.m1);                                                                                  // Vordach der Kafana
  for (var i=0;i<6;i++){ var cx=x+8+i*3; b.px(cx,y+6,P.k1); b.px(cx,y+7,P.s5); b.rect(cx-1,y+8,3,4,(i===2)?P.s6:P.k1); b.px(cx,y+8,P.s6); b.px(cx,y+9,(i===2)?P.s5:P.s4); b.px(cx-1,y+12,P.k0); b.px(cx+1,y+12,P.k0); }
  b.hl(x,x+w-1,y+h-2,P.m2); b.hl(x,x+w-1,y+h-1,P.m1); }
function photoPortrait(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ var d=Math.hypot(xx-x-w/2,yy-y-3)/w; return M.rampAt(R('e1 e2 e3 e4'),0.85-d,xx,yy); });
  b.ellipse(x+w/2,y+3.5,1.8,2.2,P.e4); b.hl(rnd(x+w/2)-1,rnd(x+w/2),y+5,P.e1); b.rect(x+1,y+6,w-2,h-6,P.e1); b.px(rnd(x+w/2),y+6,P.e4); }
function photoBridge(b,x,y,w,h){ b.fn(x,y,w,h,function(xx,yy){ return (yy<y+h*0.55)?P.s4:(bayer(xx,yy)<0.5?P.s2:P.s3); });
  for (var xx=x;xx<x+w;xx++){ var a=Math.abs(xx-x-w/2)/(w/2), ty=rnd(y+h*0.4+a*a*2); b.px(xx,ty,P.s1); b.px(xx,ty+1,P.s2); }
  b.ellipse(x+w/2,y+h*0.62,2.2,1.6,P.s1); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), weather=M.scn.weather(GS), night=nightOf(tod), closed=closedOf(S,tod), x, y, i;
  WLF=weather==='rain'?0.5:1;
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.w0); b.hl(RECT[0],RECT[2]-1,RECT[1]+1,P.e1);
  // Deckenbalken (quer), mit Unterseite und Stirn
  [3,19,37].forEach(function(Z){ R3.box(b,RECT[0]-2,RECT[2]+2,RECT[1],RECT[1]+4,Z,Z+5,{bottom:function(x,y){ var c=(fbm(x*0.2,Z)>0.62)?P.w2:P.w3; if ((x*7+Z)%23===0) c=P.w1; return c; },front:function(x,y){ var top=R3.p(0,RECT[1],Z+5)[1]; return (y<top+1)?P.k2:((hash(x>>2,Z)<0.2)?P.w0:P.w1); }}); });
  // ---- Fenster: Laibung, Rahmen, Blick, Spitzenvorhang, Fensterbank mit Geranie
  var vb=new M.Buf(W,144,P.k0); view(vb,tod,weather);
  b.rect(WIN.x-5,WIN.y-5,WIN.w+10,WIN.h+9,P.s5); b.hl(WIN.x-5,WIN.x+WIN.w+4,WIN.y-5,P.s6); b.vl(WIN.x-5,WIN.y-5,WIN.y+WIN.h+3,P.s6); b.vl(WIN.x+WIN.w+4,WIN.y-5,WIN.y+WIN.h+3,P.s3);
  b.rect(WIN.x-3,WIN.y-3,WIN.w+6,3,P.s3); b.rect(WIN.x+WIN.w,WIN.y,3,WIN.h,P.s4); b.rect(WIN.x-3,WIN.y,3,WIN.h,P.s3);   // tiefe Laibung
  b.fn(WIN.x,WIN.y,WIN.w,WIN.h,function(x,y){ var c=vb.get(x,y); if (night) c=M.tintPx(M.TINT.night,c,x,y); return c; });
  if (night){ var lx0=WIN.x+40; for (y=WIN.y+2;y<WIN.y+20;y++) for (x=WIN.x+28;x<WIN.x+WIN.w;x++){ var dd=Math.hypot(x-lx0,(y-WIN.y-10)*1.3); if (dd<10 && bayer(x,y)<(1-dd/10)*0.85) b.px(x,y,dd<3?P.y4:(dd<6?P.y2:P.y1)); }
    b.px(lx0,WIN.y+10,P.l1); b.ellipse(WIN.x+32,WIN.y+5.5,2.8,2.8,P.y3); b.ellipse(WIN.x+32,WIN.y+5.5,1.6,1.6,P.y4); }
  var mx=WIN.x+(WIN.w>>1); b.rect(mx-1,WIN.y,3,WIN.h,P.w1); b.vl(mx-1,WIN.y,WIN.y+WIN.h-1,P.w3); b.vl(mx+1,WIN.y,WIN.y+WIN.h-1,P.w0);
  for (var gy2=WIN.y+1;gy2<LACE;gy2++){ if (((gy2*3)%11)===0) b.px(WIN.x+3+(gy2%5),gy2,M.UP[b.get(WIN.x+3+(gy2%5),gy2)]); }   // ein Glanz auf dem Glas
  b.hl(WIN.x,WIN.x+WIN.w-1,WIN.y,P.w0); b.vl(WIN.x,WIN.y,WIN.y+WIN.h-1,P.w0);
  for (y=WIN.y;y<WIN.y+WIN.h;y++) for (x=WIN.x;x<WIN.x+WIN.w;x++){ var lc=lace(x,y); if (lc!==null) b.px(x,y,lc); }
  b.hl(WIN.x-1,WIN.x+WIN.w,LACE-1,P.m3); b.px(WIN.x-2,LACE-1,P.m4); b.px(WIN.x+WIN.w+1,LACE-1,P.m4);   // Vorhangstange
  b.rect(WIN.x-7,WIN.y+WIN.h+3,WIN.w+14,3,P.s4); b.hl(WIN.x-7,WIN.x+WIN.w+6,WIN.y+WIN.h+3,P.s6); b.hl(WIN.x-7,WIN.x+WIN.w+6,WIN.y+WIN.h+5,P.s2); b.hl(WIN.x-6,WIN.x+WIN.w+5,WIN.y+WIN.h+6,P.w0);
  var gx=WIN.x+2, gy=WIN.y+WIN.h+3; b.rect(gx,gy-4,6,4,P.t3); b.hl(gx,gx+5,gy-4,P.t4); b.vl(gx+5,gy-3,gy-1,P.t1);              // Geranie im Topf
  for (i=0;i<11;i++){ var ga=-Math.PI*0.95+i*0.19; b.px(rnd(gx+3+Math.cos(ga)*4.5),rnd(gy-6+Math.sin(ga)*3),i%3?P.g3:P.g2); b.px(rnd(gx+3+Math.cos(ga)*3),rnd(gy-5+Math.sin(ga)*2),P.g2); }
  [[gx+1,gy-9],[gx+4,gy-10],[gx+6,gy-8]].forEach(function(f){ b.px(f[0],f[1],P.r3); b.px(f[0]+1,f[1],P.r4); b.px(f[0],f[1]+1,P.r2); });
  // Kupferteller über dem Fenster
  tray(b,WIN.x+WIN.w/2,19,3.6);
  // ---- Fotos und ein großes Kupfertablett zwischen Fenster und Theke
  tray(b,109,28,8.4);
  M.prop.frame(b,95,40,28,22,{frame:R('k1 k2 w0'),bg:P.s5}); b.rect(97,42,24,18,P.s5); photoStaff(b,98,43,22,13); M.microText(b,'1972',102,56,P.k2); b.line(109,36,100,40,P.k2); b.line(109,36,118,40,P.k2); b.px(109,35,P.y3);
  M.prop.frame(b,96,64,12,13,{frame:R('w0 w1 w2'),bg:P.e3}); photoPortrait(b,98,66,8,9);
  M.prop.frame(b,111,64,12,11,{frame:R('w0 w1 w2'),bg:P.s3}); photoBridge(b,113,66,8,7);
  // ---- hinter der Theke: Preistafel, Regal mit Džezve, Fildžani, Kaffeedosen
  var bx0=128, bx1=234;
  b.rect(bx0,20,bx1-bx0,58,P.w1); b.vl(bx0,20,77,P.w2); b.vl(bx1-1,20,77,P.w0); b.hl(bx0-2,bx1+1,19,P.w3); b.hl(bx0-2,bx1+1,20,P.w0);
  for (x=bx0+1;x<bx1-1;x++) for (y=41;y<77;y++) b.px(x,y,(fbm(x*0.25,y*0.15)>0.6)?P.w0:(y%14===13?P.w0:P.w1));
  var pb={x:134,y:22,w:94,h:17}; b.rect(pb.x,pb.y,pb.w,pb.h,P.w3); b.rect(pb.x+1,pb.y+1,pb.w-2,pb.h-2,P.k2); b.hl(pb.x,pb.x+pb.w-1,pb.y,P.w4); b.hl(pb.x,pb.x+pb.w-1,pb.y+pb.h-1,P.w0);
  for (y=pb.y+1;y<pb.y+pb.h-1;y++) for (x=pb.x+1;x<pb.x+pb.w-1;x++) if (hash(x,y*3)<0.07) b.px(x,y,P.g1);
  M.microText(b,'BOSANSKA KAFA 1,50 KM',pb.x+5,pb.y+3,P.s5); var lx=pb.x+8; M.microText(b,'ČAJ',lx,pb.y+10,P.s4); b.px(lx+14,pb.y+12,P.y4); M.microText(b,'SOK',lx+18,pb.y+10,P.s4); b.px(lx+32,pb.y+12,P.y4); M.microText(b,'RAHATLOKUM',lx+36,pb.y+10,P.s4);
  [[44,0],[58,1],[72,2]].forEach(function(sh){ var syb=sh[0], si=sh[1]; b.hl(bx0+1,bx1-2,syb,P.w4); b.hl(bx0+1,bx1-2,syb+1,P.w2); b.hl(bx0+2,bx1-3,syb+2,P.k2);
    var r=M.rng(31+si*7), xx=bx0+6;
    if (si<2){ while (xx<bx1-12){ var s=Math.min(4,Math.floor(r()*4)+si), brass=r()<0.3; dzezva(b,xx+(DZ[s][1]>>1),syb,s,brass?BRS:COP,1); xx+=DZ[s][1]+s+6; } }
    else { while (xx<bx1-6){ if (r()<0.3){ b.rect(xx,syb-6,5,6,[P.r2,P.b1,P.y2,P.g2][Math.floor(r()*4)]); b.hl(xx,xx+4,syb-6,P.m3); b.rect(xx+1,syb-4,3,2,P.s5); xx+=7; continue; }
      for (var st=0;st<3;st++){ b.rect(xx,syb-2-st*2,4,2,P.s6); b.px(xx+3,syb-1-st*2,P.s4); b.hl(xx,xx+3,syb-2-st*2,P.s5); } b.px(xx+1,syb-6,P.b2); xx+=6; } } });
  for (x=bx0+8;x<bx1-6;x+=11){ b.px(x,47,P.m3); b.rect(x-1,48,3,3,P.s6); b.hl(x-1,x+1,48,P.b2); }   // Fildžani an Haken
  // ---- Kammertür „OSTAVA“ mit Vorhang
  var ox=OD.x, oy=OD.y, ow=OD.w, oh=OD.h;
  b.rect(ox-3,oy-3,ow+6,oh+3,P.w1); b.hl(ox-3,ox+ow+2,oy-3,P.w3); b.vl(ox-3,oy-3,oy+oh-1,P.w2); b.vl(ox+ow+2,oy-3,oy+oh-1,P.w0);
  if (S.ostavaOpen){ b.rect(ox,oy,ow,oh,P.k0); b.rect(ox,oy,5,oh,P.w1); b.vl(ox+4,oy,oy+oh-1,P.w3); b.vl(ox,oy,oy+oh-1,P.w0); for (y=oy+oh-6;y<oy+oh;y++) for (x=ox+5;x<ox+ow;x++) if (bayer(x,y)<0.25) b.px(x,y,P.k1); }
  else { b.rect(ox,oy,ow,oh,P.w2); b.hl(ox,ox+ow-1,oy+14,P.w1); b.hl(ox,ox+ow-1,oy+30,P.w1); }
  var cw=S.ostavaOpen?9:ow+2, cx0=S.ostavaOpen?ox+ow-cw+1:ox-1;   // Vorhang: geblümter Baumwollstoff in Falten
  for (y=oy-1;y<oy+oh-2;y++) for (x=cx0;x<cx0+cw;x++){ var u=x-cx0, fold=Math.sin((u+(S.ostavaOpen?0:Math.sin(y*0.05)*1.5))*(S.ostavaOpen?1.3:0.9)), c=fold>0.45?P.r3:(fold>-0.35?P.r2:P.r1);
    if (((u*5+y*3)%13===0) && fold>-0.3) c=P.y3; else if (((u*7+y*5)%17===0)) c=P.s4; if (y>oy+oh-4) c=M.DN[c]; b.px(x,y,c); }
  if (S.ostavaOpen){ b.vl(cx0,oy-1,oy+oh-3,P.r0); for (y=oy+18;y<oy+22;y++) b.hl(cx0,cx0+cw-1,y,(y===oy+19)?P.y2:P.e2); }   // gerafft, mit Kordel
  b.hl(ox-3,ox+ow+2,oy-2,P.m2); b.px(ox-4,oy-2,P.m3); b.px(ox+ow+3,oy-2,P.m3);
  var sw=M.microWidth('OSTAVA')+4, sx=ox+((ow-sw)>>1); b.rect(sx,oy-11,sw,7,P.s5); b.hl(sx,sx+sw-1,oy-11,P.s6); b.hl(sx,sx+sw-1,oy-5,P.s2); b.vl(sx+sw-1,oy-11,oy-5,P.s3); M.microText(b,'OSTAVA',sx+2,oy-10,P.b0);
  tray(b,262,27,4.6); tray(b,280,30,3.0); b.rect(276,40,7,12,P.s6); b.rect(276,40,7,2,P.r3); M.microText(b,'11',277,44,P.k2); b.hl(277,282,50,P.s3);   // Teller, Kalender (November)
  // ---- linke Wand: Eingangstür (oben Glas mit Spitze), Garderobe
  var dq=M.wallQuad(SPEC,'L',DOORL[0],DOORL[1],DOORL[2],DOORL[3]), dq2=M.wallQuad(SPEC,'L',DOORL[0]-2,DOORL[1]+2,DOORL[2]-3,DOORL[3]);
  b.poly(dq2,P.w3); b.poly(dq,function(x,y){ return ((x+Math.floor(y/8))%5===0)?P.w1:P.w2; });
  var gq=M.wallQuad(SPEC,'L',DOORL[0]+3,DOORL[1]-3,DOORL[2]+4,DOORL[2]+26);
  b.poly(gq,function(x,y){ var c=night?((y<48)?P.n1:P.k2):((y<50)?P.s4:P.m3); if (weather==='rain'&&bayer(x,y)<0.3) c=M.DN[c]; if (((x*3+y)%7)===0 || (((x+y*2)%9)===0)) c=night?P.n2:P.s6; return c; });
  var pq=M.wallQuad(SPEC,'L',DOORL[0]+3,DOORL[1]-3,DOORL[2]+32,DOORL[3]-6); b.poly(pq,P.w1); b.poly(M.wallQuad(SPEC,'L',DOORL[0]+5,DOORL[1]-5,DOORL[2]+34,DOORL[3]-8),P.w2);
  var kn=rp(M.wallPt(SPEC,'L',DOORL[0]+2.5,DOORL[2]+30)); b.rect(kn[0]-1,kn[1],2,3,P.y3); b.px(kn[0]-1,kn[1],P.y5);
  var bl=rp(M.wallPt(SPEC,'L',DOORL[0]+4,DOORL[2]-4)); b.line(bl[0],bl[1]-3,bl[0]+3,bl[1],P.k2); b.ellipse(bl[0]+3.5,bl[1]+2,1.8,2,P.y3); b.px(bl[0]+3,bl[1]+1,P.y5);   // Türglöckchen
  var hk=rp(M.wallPt(SPEC,'L',7,50)); b.rect(hk[0]-1,hk[1],3,2,P.y2);                                                  // Haken mit Mantel und Schal
  b.poly([[hk[0]-1,hk[1]+2],[hk[0]+3,hk[1]+2],[hk[0]+5,hk[1]+26],[hk[0]-4,hk[1]+28]],function(x,y){ return (x<hk[0])?P.m1:(((x+y)%5===0)?P.m1:P.m2); }); b.vl(hk[0]+1,hk[1]+4,hk[1]+26,P.m0);
  b.poly([[hk[0]-2,hk[1]+3],[hk[0]-4,hk[1]+4],[hk[0]-5,hk[1]+18],[hk[0]-2,hk[1]+18]],P.g2); b.vl(hk[0]-3,hk[1]+5,hk[1]+17,P.g1);
  // ---- rechte Wand: Kupfertabletts, Radio auf dem Wandbord, Sećija mit Kelim
  [[12,33,5.2],[27,42,6.0],[14,52,3.2]].forEach(function(t){ var p=M.wallPt(SPEC,'R',t[0],t[1]); tray(b,p[0],p[1],t[2]); });
  var sh0=rp(M.wallPt(SPEC,'R',3,66)), sh1=rp(M.wallPt(SPEC,'R',24,66)); b.line(sh0[0],sh0[1],sh1[0],sh1[1],P.w4); b.line(sh0[0],sh0[1]+1,sh1[0],sh1[1]+1,P.w1); b.px(sh0[0]+3,sh0[1]+2,P.w1); b.px(sh1[0]-3,sh1[1]+2,P.w1);
  var rd=[RADIO[0],RADIO[1]+RADIO[3]], rw=RADIO[2], rh=RADIO[3];
  b.rect(rd[0],rd[1]-rh,rw,rh,P.w2); b.hl(rd[0],rd[0]+rw-1,rd[1]-rh,P.w4); b.vl(rd[0],rd[1]-rh,rd[1]-1,P.w3); b.vl(rd[0]+rw-1,rd[1]-rh,rd[1]-1,P.w0); b.hl(rd[0],rd[0]+rw-1,rd[1]-1,P.w0);
  b.rect(rd[0]+1,rd[1]-rh+1,5,6,P.e2); for (y=rd[1]-rh+2;y<rd[1]-2;y+=2) b.hl(rd[0]+1,rd[0]+5,y,P.e1);                          // Stoffbespannung
  b.rect(rd[0]+7,rd[1]-rh+2,5,3,P.e3); b.hl(rd[0]+7,rd[0]+11,rd[1]-rh+2,P.e4); b.px(rd[0]+9,rd[1]-rh+3,P.r2);                     // Skala
  b.px(rd[0]+8,rd[1]-3,P.s5); b.px(rd[0]+11,rd[1]-3,P.s5); b.line(rd[0]+rw-2,rd[1]-rh,rd[0]+rw+3,rd[1]-rh-8,P.m3);
  b.line(rd[0]+rw-1,rd[1],rd[0]+rw+1,rd[1]+12,P.k2);                                                                         // Kabel
  function zOf(x){ return ((x-VP[0])/(SEC.X0-VP[0])-1)*F; }
  R3.box(b,SEC.X0,SEC.X1,87,FY,SEC.Z0,SEC.Z1,{top:P.w2,left:function(x,y){ return (((x>>1)+(y>>1))%5===0)?P.w0:P.w1; }});                         // Holzsockel
  R3.box(b,SEC.X0,SEC.X1,SEC.Y0,87,SEC.Z0,SEC.Z1,{top:function(x,y){ var z=zOf(x); return kilim(z*2.6,(y*3)%5+5); },left:function(x,y){ var z=zOf(x), v=(y-R3.p(SEC.X0,SEC.Y0,z)[1])/((1+z/F)); return v<0.7?P.r3:kilim(z*2.6,v*1.6+5); }});   // Sitzpolster mit Kelim
  for (var cs=0;cs<4;cs++){ var z0=SEC.Z0+1+cs*11, z1=z0+10; R3.box(b,SEC.X1-6,SEC.X1,66,SEC.Y0,z0,z1,{top:P.r2,left:function(x,y){ var z=zOf2(x), v=(y-R3.p(SEC.X1-6,66,z)[1])/(1+z/F); return (v<1||v>12.5)?P.r1:kilim(z*2.6+cs*3,v+1); }}); }   // Rückenkissen
  function zOf2(x){ return ((x-VP[0])/(SEC.X1-6-VP[0])-1)*F; }
  // ---- Fenstertisch mit Dominosteinen, Šaćirs Stuhl
  R3.box(b,TB.X0,TB.X1,TB.Y0,FY,TB.Z0,TB.Z1,{top:function(x,y){ return (hash(x>>2,y)<0.25)?P.w3:P.w4; },front:function(x,y){ var yy=y-R3.p(TB.X0,TB.Y0,TB.Z1)[1]; return yy<2?P.w2:(yy<3?P.w0:T); },right:P.w0});
  [[TB.X0+1,TB.Z1-1],[TB.X1-2,TB.Z1-1],[TB.X1-2,TB.Z0+1]].forEach(function(lg,li){ var a=R3.p(lg[0],TB.Y0+3,lg[1]), z=R3.p(lg[0],FY,lg[1]); b.rect(rnd(a[0]),rnd(a[1]),2,rnd(z[1]-a[1]),li<2?P.w2:P.w1); });
  var tt=rp(TT0), tw=rnd(TT1[0])-tt[0]; b.hl(tt[0],tt[0]+tw,tt[1],P.w5);
  if (closed) chairUp(b,tt[0]+14,tt[1]-1);
  else { chair(b,57,93,106,'L');
    var dy0=tt[1]-2; [[0,0],[4,0],[8,0],[12,1]].forEach(function(o,k){ var dx=tt[0]+7+o[0]; b.rect(dx,dy0-o[1],3,2,P.s6); b.px(dx+(k%2)+1,dy0-o[1],P.k1); b.px(dx+2,dy0+1-o[1],P.s4); });   // Dominosteine in einer Reihe
    for (var dk=0;dk<4;dk++){ var ex=tt[0]+tw-13+(dk%2)*4, ey=tt[1]-3+Math.floor(dk/2); b.rect(ex,ey,3,1,P.k2); b.px(ex,ey,P.s3); }                                                    // verdeckte Steine
    b.ellipse(tt[0]+3,tt[1]-0.5,2.4,0.9,P.t3); b.rect(tt[0]+2,tt[1]-4,3,3,P.s6); b.hl(tt[0]+2,tt[0]+4,tt[1]-4,P.b2);                                                                  // Fildžan auf dem Tablett
    b.ellipse(ASH[0],ASH[1]+0.5,2,0.9,P.m2); b.px(ASH[0]+1,ASH[1],P.s6); b.px(ASH[0]+2,ASH[1],P.r4); }
  // ---- Kupferlaternen
  var ch1=R3.p(0,RECT[1]+4,22)[1]|0; lantern(b,LMP.win[0],LMP.win[1],false,R3.p(0,RECT[1]+4,40)[1]|0); lantern(b,LMP.bar[0],LMP.bar[1],false,ch1); lantern(b,LMP.right[0],LMP.right[1],false,R3.p(0,RECT[1]+4,5)[1]|0);
  // ---- Licht
  shade(b,0,0,night,function(x,y){ return !inWin(x,y)||lace(x,y)!==null; });
  lantern(b,LMP.bar[0],LMP.bar[1],true,0); if (!night){ lantern(b,LMP.win[0],LMP.win[1],true,0); lantern(b,LMP.right[0],LMP.right[1],true,0); }
  if (S.radioOn){ b.rect(RADIO[0]+7,RADIO[1]+2,5,3,P.y4); b.hl(RADIO[0]+7,RADIO[0]+11,RADIO[1]+2,P.y5); b.px(RADIO[0]+9,RADIO[1]+3,P.r3); b.px(RADIO[0]+6,RADIO[1]+3,P.y2); b.px(RADIO[0]+12,RADIO[1]+3,P.y2); }
  return b; }

// ---------------------------------------------------------------- Ebenen: Theke (vor Emina), Kupfertischchen mit Hockern
function layers(S,GS,tod){ var L=[], night=nightOf(tod), closed=closedOf(S,tod);
  var lay=M.layer(112,56,150,58,113), w=M.lw(lay), fw={poly:function(p,c){ w.poly(p,c); }};
  var fl=R3.p(CNT.X0,CNT.Y0,CNT.Z1)[0], ftop=R3.p(CNT.X0,CNT.Y0,CNT.Z1)[1];
  R3.box(fw,CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1,{
    top:function(x,y){ var c=(hash(x>>2,y)<0.3)?P.w3:P.w4; if (y<=ftop-2) c=P.w2; return c; },
    front:function(x,y){ var p=((x-fl)%22+22)%22, yy=y-ftop, c=P.w1;
      if (yy<2) c=yy<1?P.t4:P.t2;                                                // Kupferkante
      else if (yy<4) c=P.w0; else if (yy>=26) c=(yy>=28)?P.k2:P.w0;              // Sockel
      else if (p<2) c=p<1?P.w0:P.w2;
      else if (yy>=7 && yy<=23 && p>=4 && p<=19){ c=P.w2; if (yy===7||p===4) c=P.w3; if (yy===23||p===19) c=P.w0; var mx=p-11.5, my=yy-15; if (Math.abs(mx)+Math.abs(my)<4.5){ c=(Math.abs(mx)+Math.abs(my)<2)?P.t4:P.t3; if (mx+my<-1.5) c=P.t5; } }
      return c; } });
  var a=R3.p(CNT.X0,CNT.Y0,CNT.Z1), bb=R3.p(CNT.X1,CNT.Y0,CNT.Z1); w.hl(rnd(a[0]),rnd(bb[0]),rnd(a[1]),P.t5);
  var by=BY;
  // Kaffeemühle (Messing), Glas mit Lokum, Zuckerdose
  w.rect(132,by-11,4,11,P.y2); w.vl(132,by-11,by-1,P.y4); w.vl(135,by-11,by-1,P.y1); w.hl(131,136,by-12,P.y3); w.line(134,by-13,138,by-15,P.k2); w.px(139,by-15,P.w2); for (var gy=by-9;gy<by-1;gy+=3) w.hl(132,135,gy,P.y1);
  w.rect(142,by-8,6,8,P.a6); w.hl(142,147,by-9,P.m3); for (var lk=0;lk<5;lk++){ w.rect(143+(lk%2)*2,by-6+Math.floor(lk/2)*2,2,2,lk%2?P.s6:P.r4); } w.vl(142,by-8,by-1,P.s6);
  w.ellipse(156,by-2.5,3.5,2.5,P.t3); w.ellipse(156,by-5,3,1.6,P.t4); w.px(156,by-7,P.t5); w.px(154,by-4,P.t5); w.hl(153,159,by-1,P.t1);
  // Tablett mit zwei Fildžani und Lokum
  w.ellipse(171,by-0.5,9,1.6,P.t3); w.hl(163,179,by,P.t1); w.hl(164,178,by-2,P.t5);
  [165,170].forEach(function(cx){ w.ellipse(cx+1.5,by-1.5,2.5,0.8,P.s5); w.rect(cx,by-5,3,3,P.s6); w.hl(cx,cx+2,by-5,P.b2); w.px(cx+2,by-4,P.s4); });
  w.rect(175,by-3,4,2,P.s6); w.px(176,by-4,P.s6); w.px(175,by-3,P.r4); w.px(178,by-2,P.r4);
  // der Kaffeeherd: Kupferwanne mit heißem Sand auf einem Eisenkasten, Džezve darin
  var hx=198, hw=22; w.rect(hx,by-4,hw,4,P.m1); w.hl(hx,hx+hw-1,by-4,P.m2); w.px(hx+3,by-2,P.r3); w.px(hx+4,by-2,P.y3);
  w.rect(hx-1,by-8,hw+2,4,P.t3); w.hl(hx-1,hx+hw,by-8,P.t5); w.hl(hx-1,hx+hw,by-5,P.t1);
  for (var sx=hx;sx<hx+hw;sx++){ w.px(sx,by-9,((sx*7)%5===0)?P.e4:P.e3); if (hash(sx,3)<0.3) w.px(sx,by-8,P.e4); }
  dzezva(w,hx+4,by-7,1,COP,1); dzezva(w,hx+12,by-7,2,BRS,1); dzezva(w,hx+19,by-7,0,COP,-1);
  // Glocke, Serviettenhalter
  w.ellipse(230,by-1.5,2.4,2,P.y3); w.px(230,by-4,P.y4); w.px(229,by-2,P.y5); w.rect(237,by-6,4,6,P.m3); w.rect(238,by-5,2,4,P.s6);
  shade(lay,lay.ox,lay.oy,night); L.push(lay);
  // Kupfertischchen (Sofra) mit niedrigen Hockern vorn rechts
  var t=M.layer(262,92,58,52,FT.base+4), tw=M.lw(t), cx=FT.cx, ty=FT.top;
  if (!closed) stool(tw,cx-27,FT.base+1,false);
  // Gestell: vier geschwungene Holzbeine mit Querleiste (die Sofra ist niedrig)
  [[-15,1],[15,-1],[-8,1],[8,-1]].forEach(function(lg,i){ var x0=cx+lg[0], dir=lg[1]; tw.line(x0,ty+4,x0-dir*2,FT.base-(i>1?2:0),i>1?P.w0:P.w2); tw.line(x0+1,ty+4,x0+1-dir*2,FT.base-(i>1?2:0),i>1?P.k2:P.w1); });
  tw.hl(cx-13,cx+13,ty+9,P.w1); tw.hl(cx-13,cx+13,ty+10,P.w0);
  // runde Kupferplatte mit graviertem Rand und Rosette
  tw.ellipse(cx+0.5,ty+2.2,FT.rx+0.7,4.4,P.t1);
  tw.ellipse(cx+0.5,ty+0.5,FT.rx,3.8,function(x,y){ var dx=(x+0.5-cx-0.5)/FT.rx, dy=(y+0.5-ty-0.5)/3.8, d=Math.hypot(dx,dy), c=P.t3;
    if (d>0.86) c=(dy<0)?P.t5:P.t2; else if (Math.abs(d-0.62)<0.09) c=P.t2; else if (d<0.34){ c=((x+y)&1)?P.t4:P.t3; if (d<0.12) c=P.t2; }
    if (dx<-0.3 && dx>-0.7 && dy<0 && bayer(x,y)<0.5) c=P.t5; if (hash(x,y)<0.05) c=P.t4; return c; });
  tw.hl(cx-FT.rx+3,cx+FT.rx-3,ty+4,P.t0); tw.hl(cx-FT.rx+2,cx+FT.rx-2,ty+3,P.t2);
  if (closed){ stool(tw,cx-9,ty+1,true); stool(tw,cx+9,ty+1,true); }
  else { stool(tw,cx+25,FT.base+5,false);
    tw.ellipse(cx-6,ty+0.5,3,0.9,P.t4); tw.rect(cx-7,ty-3,3,3,P.s6); tw.hl(cx-7,cx-5,ty-3,P.b2); tw.px(cx-4,ty-1,P.s5);                         // Fildžan auf Untertasse
    tw.rect(cx+3,ty-2,4,2,P.s6); tw.px(cx+3,ty-2,P.r4); tw.px(cx+6,ty-1,P.r4);                                                            // Lokum
    tw.ellipse(cx+10,ty,2.4,0.9,P.m3); tw.px(cx+10,ty-1,P.s6); tw.px(cx+11,ty-1,P.k2); }
  shade(t,t.ox,t.oy,night); L.push(t);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Dampf über den Džezve, Zigarettenrauch, Regen am Fenster
function dyn(fb,v,S,GS){ var t=v.t, tod=v.tod, weather=M.scn.weather(GS), closed=closedOf(S,tod), i;
  if (weather==='rain') M.scn.windowRain(fb,WIN.x,WIN.y,WIN.w,LACE-WIN.y,t,0);
  if (!closed){ for (i=0;i<9;i++){ var ph=((t*0.55+i*0.11)%1), sx=201+(i%3)*8+Math.round(Math.sin(t*2+i)*1.4+ph*3), sy=rnd(BY-12-ph*18); if (ph<0.85 && bayer(sx,sy+Math.floor(t*3))<0.75-ph*0.6) fb.px(sx,sy,ph<0.4?P.s6:P.s5); }
    for (var n=0;n<8;n++){ var hy=rnd(ASH[1]-2-((t*4+n*3.2)%26)), hx=rnd(ASH[0]+1+Math.sin(t*1.1+n*0.8)*2+n*0.2); if (hy>40) fb.px(hx,hy,n%2?P.s4:P.s3); } }
  else M.glow(fb,LMP.bar[0],LMP.bar[1]+2,9,t,0.25+Math.sin(t*1.7)*0.05); }

// ---------------------------------------------------------------- Geistersicht: Schimmer an der Kammertür, Halid hinter der Theke
function ghost(fb,v,S,GS){ var t=v.t, i;
  for (i=0;i<44;i++){ var k=(i/44+t*0.03)%1, per=2*OD.h+OD.w, d=k*per, x, y; if (d<OD.h){ x=OD.x-1; y=OD.y+OD.h-d; } else if (d<OD.h+OD.w){ x=OD.x+(d-OD.h); y=OD.y-1; } else { x=OD.x+OD.w; y=OD.y+(d-OD.h-OD.w); }
    var a=Math.sin(t*1.6+i*0.9); if (a>0.1) fb.px(rnd(x),rnd(y),a>0.7?P.x5:P.x3); }
  for (i=0;i<10;i++){ var ph=(t*0.12+hash(i,5))%1, gx=rnd(OD.x+2+hash(i,6)*(OD.w-4)+Math.sin(t+i)*1.5), gy=rnd(OD.y+OD.h-2-ph*40); if (ph<0.8) fb.px(gx,gy,ph<0.3?P.x4:P.x2); }
  if (!GS.flags['k2.s1.echoHalid']) return;
  var top=BY-1, x0=153, y0=top-HALID.h, fl=Math.sin(t*0.9)*0.5, al=0.84+Math.sin(t*1.3)*0.1, sh=Math.round(fl);
  for (var yy=0;yy<HALID.h;yy++) for (var xx=0;xx<HALID.w;xx++){ var c=HALID.d[yy*HALID.w+xx], X=x0+xx+sh, Y=y0+yy;
    if (c===T){ var nb=HALID.get(xx-1,yy)!==T||HALID.get(xx+1,yy)!==T||HALID.get(xx,yy-1)!==T||HALID.get(xx,yy+1)!==T; if (nb && Y<top && bayer(X,Y+Math.floor(t*3))<0.6) fb.px(X,Y,P.x6); continue; }
    if (bayer(X,Y+Math.floor(t*2))<al || c===P.x1 || c===P.v2) fb.px(X,Y,c); } }
// Halid (1973): Kellner mit Schnurrbart und Weste, nur Kopf und Brust über der Theke (Geisterfarben)
var HALID=M.stamp([
"....hhhhh....",
"...hhhhhhh...",
"..hhfffffhh..",
"..ffffffff...",
"..feffffef...",
"..ffffffff...",
"..fmmmmmmf...",
"...fmfffmf...",
"....fffff....",
".....fff.....",
"...vvsssvv...",
".avvvsssvvva.",
"aavvvvsvvvvaa",
"aavvvvsvvvvaa",
"aavvvvbvvvvaa",
"aavvvvsvvvvaa",
"aavvvvbvvvvaa",
"aavvvvsvvvvaa",
"aavvvvsvvvvaa",
"aavvvvsvvvvaa"],{h:P.x3,f:P.x4,e:P.x1,m:P.v2,v:P.v3,s:P.x5,a:P.x4,b:P.x6});

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (x<5||x>315||y>140) return false; var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (Math.hypot((x-FT.cx+3)/33,(y-FT.base+2)/8)<1) return false;                    // Kupfertischchen mit Hockern
  if (y>=114) return true;
  if (X>CNT.X1+3 && X<SEC.X0-2 && Z>8) return true;                                  // Durchgang zur Kammertür
  if (y>=108 && x<128 && !(x>44 && x<112 && y<110)) return true;                    // vor dem Fenstertisch und an der Tür
  return false; }

// Bildschirm-Rechteck eines Wandvierecks
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
var CR=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1), TR=R3.rect(TB.X0,TB.X1,TB.Y0,FY,TB.Z0,TB.Z1);
M.defineArt('kafana',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var night=nightOf(tod), L=lampAmt(lightsOf(night),a.x,a.y-22); if (!night) return L>0.45?WARM.a:null; return L>0.3?WARM.a:DEEP.a; },
  spots:{
    door:qrect(M.wallQuad(SPEC,'L',DOORL[0]-2,DOORL[1]+2,DOORL[2]-3,DOORL[3])),
    counter:[CR[0],CR[1]-4,CR[2],CR[3]+4],
    stove:[196,70,28,12],
    dzezve:[129,36,104,24],
    trays:[285,18,35,48],
    window_table:[TR[0]-14,TR[1]-6,TR[2]+16,TR[3]+6],
    dominoes:[66,80,26,6],
    photos:[94,38,30,40],
    radio:[RADIO[0]-2,RADIO[1]-9,RADIO[2]+8,RADIO[3]+11],
    ostava_door:[OD.x-4,OD.y-12,OD.w+8,OD.h+12],
    pricelist:[133,21,96,19],
    stools:[262,104,58,36]
  },
  stands:{
    door:[22,116,'L'], counter:[186,118,'B'], stove:[208,118,'B'], dzezve:[164,118,'B'], trays:[278,116,'R'], window_table:[92,112,'B'],
    dominoes:[82,112,'B'], photos:[110,112,'B'], radio:[282,108,'R'], ostava_door:R3.st(261,16,'B'), pricelist:[180,118,'B'], stools:[258,126,'R']
  },
  actorPos:{ emina:[190,107,'F'], lejla:[258,119,'L'], sacir:[57,105,'R'] },
  start:[24,118,'R'], entries:{ kula:[24,118,'R'], ostava:[R3.st(261,18,'L')[0],R3.st(261,18,'L')[1],'L'] }
});
})(M);
