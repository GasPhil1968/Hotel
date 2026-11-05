/* ===== rooms/art/tepa.js — Markt auf der Tepa (480 px, scrollend) =====
   Ein kleiner Marktplatz am Rand der Altstadt, Kopfsteinpflaster aus runden Flusssteinen. Hinten niedrige Steinhäuser mit
   Holzläden und grauen Steinplattendächern, ein Minarett mit Kuppel, darüber der kahle Velež. Zwei feste Stände stehen immer:
   Obst unter einer gestreiften Plane (Granatäpfel, Mandarinen, Äpfel in Kisten) und Honig unter einem Schirm (Gläser, Käse,
   getrocknete Feigen). Am Samstag (k3_d2, oder S.market) kommen die Bauern: der Gemüsestand der Nachbarin und Zlatas Klapptisch
   mit Eierkartons, einer Waage und einem Sack Walnüssen, ihr Hocker dahinter; weitere Tische, Säcke und Marktleute (gemalt).
   S.zlataGone: Zlata hat zusammengepackt, ihr Tisch ist leer. S.eggDropped: ein zerbrochenes Ei auf dem Pflaster.
   Malas Sicht: an Zlatas Hocker eine warme, flackernde Spur. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144, GY=100;                                      // Fuß der Häuser hinten
var FRUIT={x0:116,x1:178,by:112,top:66};                       // Obststand (fest)
var HONEY={x0:338,x1:388,by:112};                              // Honigstand (fest)
var NB={x0:196,x1:242,by:115,top:100};                         // Gemüsestand der Nachbarin (Samstag)
var ZT={x0:250,x1:290,by:117,top:100};                         // Zlatas Klapptisch (Samstag)
var ZLATA=[281,112], SUSJ=[216,110];                           // Füße: Zlata sitzt, die Nachbarin steht
var STOOL={x:281,seat:100,by:112};
var SACK={x:244,by:113};
var EGG=[262,127];
var MIN={x:454,base:74,h:66};
var FOUNT={x:44,by:108};

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function weaOf(GS){ var w=M.scn.weather(GS); if (w==='clear') return 'bura'; if (w==='fog') return 'grey'; return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
function full(S,GS){ return (S && S.market!==undefined)?!!S.market:(GS.phase==='k3_d2'); }
var HZL={}, HZN=null;
function hazeLut(col,k){ var key=col+'_'+k; if (HZL[key]) return HZL[key]; if (!HZN) HZN=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); var q=M.RGB[col], f=k/8;
  return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZN); }
// Dunst: zur Dunstfarbe hin mischen, Ergebnis nur aus Landschaftsfarben (sonst wird Kalk im Blau violett)
function haze(b,amt,col){ for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=hazeLut(col,i)[c]; } }
var REG=new Uint8Array(W*H), RG={sky:0,far:1,bldg:2,glass:3,ground:4,stall:5,prop:6};
function RW(b){ var o={g:0};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.w=W; o.h=H; return o; }
function dk(w,x,y,n){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,-(n||1))); }
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'};
function sign(w,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(w,base,cx,y,c); var wd=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') w.px(cx+1,y-1,c); else if (ch==='Ć') w.px(cx+2,y-1,c); cx+=wd+1; }); return cx; }

// ---------------------------------------------------------------- Himmel, Velež
function paintSky(b,tod,we){ var x, y, h=GY;
  if (we==='grey' && tod==='day'){ var GR=R('m2 m3 m4 s4'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(GR,0.28+y/h*0.5+(fbm(x*0.7,y*2.4,30,8)-0.5)*0.35,x,y)); return; }
  if (we==='rain'){ M.scn.sky(b,0,0,W,h,tod,we,79); return; }
  if (tod==='day'){ var bura=we==='bura', D=bura?R('b0 b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<h;y++){ var v=(bura?0.05:0.18)+Math.pow(y/70,1.3)*(bura?0.86:0.78); for (x=0;x<W;x++) b.px(x,y,ra(D,v+(vn(x,y,50,2)-0.5)*0.05,x,y)); }
    var r=M.rng(bura?89:43);
    if (bura){ for (var i=0;i<10;i++){ var cx=r()*W-20, cy=3+r()*22, L=16+r()*44, th=1.5+r()*3;
        for (var k=0;k<L;k++){ var u=k/L; if (fbm(cx+k*1.3,i*9,6,3)<0.4) continue; var hh=th*Math.sin(u*Math.PI)*(0.45+fbm(k*2+cx,i*3,5,5)), xx=rd(cx+k), yt=rd(cy-hh*0.6+u*2.5), yb2=rd(cy+hh*0.4+u*2.5);
          for (var yy=yt;yy<=yb2;yy++){ var q=(yy-yt)/Math.max(1,yb2-yt); if (q>0.8 && bayer(xx,yy)<0.5) continue; b.px(xx,yy,q<0.4?P.b5:(q<0.75?P.b4:P.b3)); } } } }
    else { for (var j=0;j<6;j++){ var cx2=r()*W, cy2=4+r()*18, L2=50+r()*90; for (var k2=0;k2<L2;k2++){ var xx2=rd(cx2+k2), yy2=rd(cy2+Math.sin(k2*0.06+j)*1.3+k2*0.02), a=1-Math.abs(k2/L2-0.5)*2; if (bayer(xx2,yy2)<a*0.45) b.px(xx2,yy2,P.b4); } } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(N,0.08+Math.pow(y/70,1.5)*0.8,x,y)); var r2=M.rng(57); for (var s=0;s<170;s++) b.px(Math.floor(r2()*W),Math.floor(Math.pow(r2(),1.4)*40),r2()<0.1?P.n5:P.n3); return; }
  M.sky(b,0,0,W,h,tod,31); }
function paintVelez(w,we){ var x, y, VR=R('m0 m1 s1 m2 s2 s3 s4 s5'); w.g=RG.far;
  for (x=0;x<W;x++){ var p=Math.exp(-Math.pow((x-170)/120,2)), p2=Math.exp(-Math.pow((x-380)/70,2)), ty=rd(46-24*p-14*p2+(vn(x,3,7,4)-0.5)*3), sl=Math.sin(x*0.02-1);
    for (y=ty;y<GY-20;y++){ var rib=Math.sin(x*0.36+y*0.33+fbm(x,y,12,2)*6), v=0.5+(x<170?0.1:-0.1)-(y-ty)*0.006+(fbm(x*2.6+y*0.9,y*0.5,8,6)-0.5)*0.55+rib*0.12; if (y===ty) v=0.9; w.px(x,y,ra(VR,v,x,y)); } } }

// ---------------------------------------------------------------- Altstadthäuser hinten: Läden mit Holzläden, weißes Obergeschoss, Steinplattendach
var LITW=[];
function slabRoof(w,x0,x1,ey,rh,sd){ var ins=Math.max(2,rd(rh*0.9));
  for (var y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t)), row=Math.floor((ey-y)/2);
    for (var x=xa;x<=xb;x++){ var off=(row%2)*2, c=(x<xa+2)?P.m4:((x>xb-2)?P.m1:(hash(Math.floor((x+off+sd)/4),row+sd)<0.25?P.s3:P.m3)); if ((ey-y)%2===0) c=M.DN[c]; if (((x+off+sd)%4)===0) c=M.DN[c]; if (hash(x*3+sd,y)<0.04) c=P.e3; if (y===ey-rh||y===ey) c=P.s1; w.px(x,y,c); } } }
function house(w,x0,x1,sd,we){ var x, y, wet=we==='rain', top=GY-36-Math.floor(hash(sd,1)*10), gf=GY-18, r=M.rng(sd*7+1);
  // Obergeschoss: weiß gekalkt, kleine Fenster mit Läden; Erdgeschoss: Stein, Laden mit Kepenci
  for (y=top;y<gf;y++) for (x=x0;x<x1;x++){ var c=ra(R('s4 s5 s6'),0.6+(fbm(x*0.5,y*0.7,8,sd)-0.5)*0.3,x,y); if (y>gf-4) c=M.DN[c]; if (x===x1-1) c=P.s3; if (wet) c=M.DN[c]; w.px(x,y,c); }
  for (y=gf;y<GY;y++) for (x=x0;x<x1;x++){ var row=Math.floor((y-gf)/4), off=(row%2)*4, fx=(x+off)%9, c2=(fx===0||(y-gf)%4===0)?P.s1:(hash(Math.floor((x+off)/9),row+sd)<0.4?P.s2:P.s3); if (wet) c2=M.DN[c2]; w.px(x,y,c2); }
  for (var wx=x0+5;wx<x1-6;wx+=13){ var wy=top+6; w.rect(wx,wy,6,8,P.k2); w.hl(wx-1,wx+6,wy+8,P.s6); LITW.push([wx+1,wy+1]); if (r()<0.6){ w.rect(wx-3,wy,3,8,P.w2); w.rect(wx+6,wy,3,8,P.w2); w.vl(wx-2,wy,wy+7,P.w1); w.vl(wx+7,wy,wy+7,P.w1); } else { w.rect(wx,wy,6,8,P.w1); for (var q=wy+1;q<wy+8;q+=2) w.hl(wx,wx+5,q,P.w2); } }
  // Laden: offene Holzläden (oben als Vordach, unten als Ablage) oder geschlossen
  var s0=x0+4, s1=x1-5, open=hash(sd,4)<0.65;
  if (open){ for (y=gf+3;y<GY-2;y++) for (x=s0;x<s1;x++) w.px(x,y,(y<gf+5)?P.k1:P.k2); for (x=s0-1;x<s1+1;x++){ w.px(x,gf+2,P.w3); w.px(x,gf+1,P.w2); w.px(x,GY-2,P.w4); w.px(x,GY-1,P.w2); }
    var kind=Math.floor(hash(sd,8)*3);
    if (kind===0){ for (x=s0+3;x<s1-3;x+=6){ var cy=gf+7+((x>>2)%2)*4; w.ellipse(x+1,cy,2.4,2.4,P.t3); w.px(x,cy-1,P.t5); w.px(x+2,cy+1,P.t1); w.vl(x+1,gf+3,cy-3,P.k1); } }
    else if (kind===1){ for (x=s0+2;x<s1-2;x+=5){ var cc=[P.r2,P.r1,P.c2,P.y1,P.r3][Math.floor(hash(x,sd)*5)]; for (y=gf+4;y<GY-3;y++) w.px(x,y,((y+x)%4===0)?M.UP[cc]:cc); for (y=gf+4;y<GY-3;y++) w.px(x+1,y,cc); w.px(x+2,gf+4,P.k2); } }
    else { for (x=s0+2;x<s1-2;x++){ var hh=6+Math.round(Math.sin(x*0.7)*2); for (y=gf+4;y<gf+4+hh;y++) w.px(x,y,[P.s5,P.b3,P.y4,P.r4][Math.floor((x-s0)/3)%4]); } } }
  else { for (y=gf+2;y<GY;y++) for (x=s0;x<s1;x++) w.px(x,y,((y-gf)%3===0)?P.w0:(((x-s0)%7===0)?P.w1:P.w2)); w.rect(rd((s0+s1)/2)-1,GY-8,3,3,P.m2); }
  // Dach aus Steinplatten, weit vorgezogen, Holzsparren darunter, Kamin
  slabRoof(w,x0-3,x1+2,top-1,9+Math.floor(hash(sd,2)*5),sd); for (x=x0-2;x<x1+2;x+=3){ w.px(x,top,P.w1); w.px(x,top+1,P.w0); }
  if (hash(sd,6)<0.6){ var cx=x0+6+Math.floor(hash(sd,7)*(x1-x0-12)); w.rect(cx,top-16,4,8,P.s3); w.vl(cx+3,top-16,top-9,P.s1); w.rect(cx-1,top-17,6,2,P.s2); CHIM.push([cx+1,top-18]); } }
var CHIM=[];
function paintHouses(w,we){ w.g=RG.bldg; var x=-6, i=0; while (x<W){ var bw=48+Math.floor(hash(i,9)*30); if (x+bw>MIN.x-24 && x<MIN.x+20){ x=MIN.x+20; continue; } house(w,x,x+bw,i*13+5,we); x+=bw+2; i++; }
  // die Moschee hinter der Lücke: Kuppel, Minarett
  w.g=RG.far; var mx=MIN.x; w.ellipse(mx-14,GY-30,13,10,function(xx,yy){ return yy<GY-35?P.m4:((xx<mx-18)?P.m3:P.m2); }); w.rect(mx-30,GY-30,32,8,P.s4); w.hl(mx-30,mx+1,GY-30,P.s5); w.vl(mx-14,GY-44,GY-40,P.y2); w.px(mx-14,GY-45,P.y3);
  M.scn.minaret(w,mx,MIN.base+20,MIN.h+20,{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')});
  w.g=RG.bldg; for (var y2=GY-22;y2<GY;y2++) for (var x2=mx-30;x2<mx+20;x2++){ var rw=Math.floor((y2-GY+22)/4), fx=(x2+(rw%2)*5)%10; w.px(x2,y2,(fx===0||(y2-GY+22)%4===0)?P.s2:(hash(Math.floor(x2/10),rw)<0.4?P.s3:P.s4)); }
  for (var x3=mx-31;x3<mx+21;x3++){ w.px(x3,GY-23,P.s5); w.px(x3,GY-24,P.s3); w.px(x3,GY-25,P.s2); }
  w.rect(mx-20,GY-18,10,18,P.k2); w.hl(mx-21,mx-10,GY-19,P.s5); for (var yy3=GY-17;yy3<GY;yy3+=3) w.hl(mx-19,mx-11,yy3,P.w1); }

// ---------------------------------------------------------------- Pflaster: Kaldrma aus runden Flusssteinen, in Perspektive
function kaldrma(x,y,wet){ var h0=2.4, kk=0.085, hy=h0+kk*(y-GY), v=Math.log(hy/h0)/kk, row=Math.floor(v), fv=v-row, sc=hy/h0, u=(x-240)/(3.3*sc)+hash(row,3)*0.9+(row&1)*0.5, col=Math.floor(u), fu=u-col;
  var jit=hash(col,row*7), dx=(fu-0.5)*2, dy=(fv-0.5)*2, d=dx*dx*(0.75+jit*0.2)+dy*dy*(0.9+jit*0.3);
  var tone=hash(col*3+1,row), base=tone<0.22?P.e2:(tone<0.5?P.s2:(tone<0.8?P.s3:(tone<0.92?P.e3:P.s4)));
  var c=base; if (d>0.84) c=(d>1.04)?P.e0:P.e1; else { if (dy<-0.42 && dx<0.35) c=M.UP[base]; else if (dy>0.52 || dx>0.7) c=M.DN[base]; }
  if (wet){ c=M.DN[c]; if (d<0.3 && dy<-0.1 && hash(col,row+5)<0.45) c=P.m3; }
  return c; }
function paintGround(w,we){ var x, y, wet=we==='rain'; w.g=RG.ground;
  for (y=GY;y<H;y++) for (x=0;x<W;x++) w.px(x,y,kaldrma(x,y,wet));
  for (x=0;x<W;x++){ dk(w,x,GY,2); if (bayer(x,GY+1)<0.6) dk(w,x,GY+1,1); }
  // eine Rinne aus Steinplatten in der Mitte
  for (x=0;x<W;x++){ var yy=127+rd(Math.sin(x*0.012)*1.2); for (var j=0;j<3;j++){ var c=((x+j*3)%11===0)?P.s1:(j===0?P.s4:(j===2?P.s1:P.s3)); if (wet) c=M.DN[c]; w.px(x,yy+j,c); } }
  // Laub, Stroh, ein paar Kistenbretter
  for (var i=0;i<140;i++){ var lx=Math.floor(hash(i,71)*W), ly=GY+2+Math.floor(Math.pow(hash(i,72),1.6)*40), lc=hash(i,73)<0.4?P.y2:(hash(i,74)<0.5?P.e3:P.t3); if (wet) lc=M.DN[lc]; w.px(lx,ly,lc); } }

// ---------------------------------------------------------------- Stände
// Plane auf Stangen: gestreift (Obst) oder einfarbig, vorne eine Volantkante (die bewegt sich in dynamic)
var VAL=[];
function tarp(w,x0,x1,y0,y1,cols,stripe,we){ var x, y, wet=we==='rain'; w.g=RG.stall;
  for (y=y0;y<y1;y++){ var t=(y-y0)/(y1-y0); for (x=x0+rd((1-t)*3);x<x1-rd((1-t)*3);x++){ var st=stripe?(Math.floor((x-x0)/6)%2):0, c=cols[st][(y<y0+2)?2:(t>0.7?0:1)]; if (Math.sin(x*0.5)>0.9) c=cols[st][0]; if (wet) c=M.DN[c]; w.px(x,y,c); } }
  VAL.push({x0:x0,x1:x1,y:y1,cols:cols,stripe:stripe});
  [x0+1,x1-2].forEach(function(px){ w.vl(px,y1,y1+40,P.w1); w.vl(px+1,y1,y1+40,P.w0); }); }
function crate(w,x,y,cw,ch,fruit){ var xx, yy; for (yy=y;yy<y+ch;yy++) for (xx=x;xx<x+cw;xx++){ var c=((yy-y)%3===0)?P.w1:P.w3; if (xx===x||xx===x+cw-1) c=P.w1; w.px(xx,yy,c); }
  var r=M.rng(x*7+y); for (var i=0;i<cw*1.3;i++){ var fx=x+1+Math.floor(r()*(cw-2)), fy=y-1-Math.floor(r()*3); var c2=fruit[Math.floor(r()*fruit.length)]; w.px(fx,fy,c2); w.px(fx+1,fy,M.DN[c2]); if (r()<0.3) w.px(fx,fy-1,M.UP[c2]); } }
function paintFruit(w,we){ var f=FRUIT, x, y;
  tarp(w,f.x0-6,f.x1+6,f.top,f.top+9,[[P.c1,P.c2,P.c3],[P.s3,P.s5,P.s6]],true,we);
  // Tisch: Bretter auf Böcken, davor schräg gestellte Kisten
  w.g=RG.stall; for (x=f.x0;x<f.x1;x++){ w.px(x,f.by-18,P.w4); w.px(x,f.by-17,P.w2); w.px(x,f.by-16,P.w0); } [f.x0+3,f.x1-5].forEach(function(lx){ w.line(lx,f.by-15,lx-2,f.by,P.w1); w.line(lx+1,f.by-15,lx+3,f.by,P.w1); });
  var PG=[P.r2,P.r3,P.r4,P.r1], MD=[P.t4,P.y3,P.t3,P.t5], AP=[P.r3,P.y3,P.g4,P.r2];
  crate(w,f.x0+2,f.by-26,16,8,PG); crate(w,f.x0+20,f.by-26,16,8,MD); crate(w,f.x0+38,f.by-26,18,8,AP);
  crate(w,f.x0+6,f.by-12,14,7,MD); crate(w,f.x0+24,f.by-12,14,7,PG); crate(w,f.x0+42,f.by-11,12,6,[P.g4,P.g3,P.y2]);
  // Preisschilder aus Karton
  [[f.x0+6,f.by-31,'2KM'],[f.x0+24,f.by-31,'3KM']].forEach(function(p){ w.rect(p[0],p[1],14,7,P.s6); sign(w,p[2],p[0]+1,p[1]+1,P.k2); });
  // eine Waage mit Schale, aufgehängter Knoblauchzopf
  w.rect(f.x1-10,f.by-22,6,4,P.m3); w.ellipse(f.x1-7,f.by-23,4,1,P.s5); w.vl(f.x0+30,f.top+9,f.top+22,P.e3); for (var k=0;k<5;k++) w.ellipse(f.x0+30+(k%2?1:-1),f.top+13+k*2,1.5,1.2,P.s5); }
function paintHoney(w,we){ var h=HONEY, x, y; w.g=RG.stall;
  // Marktschirm (beige), Tisch mit Wachstuch, Honiggläser, Käse, getrocknete Feigen, Kränze aus Feigen
  var ux=(h.x0+h.x1)/2; for (y=56;y<66;y++){ var hw=(y-56)*3.2+4; for (x=rd(ux-hw);x<=rd(ux+hw);x++){ var c=(Math.floor((x-ux)/8+20)%2)?P.s5:P.s4; if (y===65) c=P.s3; if (we==='rain') c=M.DN[c]; w.px(x,y,c); } }
  VAL.push({x0:rd(ux-33),x1:rd(ux+33),y:66,cols:[[P.s3,P.s4,P.s5],[P.s3,P.s4,P.s5]],stripe:false,small:1});
  w.vl(rd(ux),66,h.by,P.w1); w.vl(rd(ux)+1,66,h.by,P.w0); w.px(rd(ux),55,P.w2);
  for (y=h.by-18;y<h.by-6;y++) for (x=h.x0;x<h.x1;x++){ var c2=(y===h.by-18)?P.s6:(((x>>1)+(y>>1))%2?P.r3:P.s6); if (y>h.by-15) c2=(((x>>2)+(y>>2))%2)?P.r2:P.s5; w.px(x,y,c2); }
  for (y=h.by-6;y<h.by;y++){ w.px(h.x0+2,y,P.w1); w.px(h.x1-3,y,P.w1); }
  for (var j=0;j<8;j++){ var jx=h.x0+2+j*6, jy=h.by-26; w.rect(jx,jy,4,7,j%3===0?P.y2:P.y3); w.px(jx+1,jy+1,P.y5); w.rect(jx,jy-2,4,2,j%2?P.r2:P.c2); }
  w.ellipse(h.x0+12,h.by-21,6,2.2,P.s6); w.hl(h.x0+7,h.x0+17,h.by-20,P.s4); w.ellipse(h.x1-12,h.by-21,5,2,P.y4);
  for (var k=0;k<10;k++) w.px(h.x0+22+k*2,h.by-19,k%2?P.w2:P.e3);
  w.rect(h.x1-6,h.by-30,6,10,P.s6); sign(w,'MED',h.x1-6+0,h.by-28,P.y1); }
function paintNeighbor(w,we){ var n=NB, x, y; w.g=RG.stall;
  tarp(w,n.x0-4,n.x1+4,n.top-34,n.top-27,[[P.g1,P.g2,P.g3],[P.g1,P.g2,P.g3]],false,we); }
function paintZlataBack(w,we,S){ var z=ZT; w.g=RG.stall;
  tarp(w,z.x0-4,z.x1+6,z.top-36,z.top-29,[[P.r1,P.r2,P.r3],[P.s4,P.s5,P.s6]],true,we);
  // Hocker hinter dem Tisch (Zlata sitzt darauf)
  var s=STOOL; w.g=RG.prop; w.rect(s.x-6,s.seat,13,2,P.w4); w.hl(s.x-5,s.x+5,s.seat-1,P.w5); w.hl(s.x-6,s.x+6,s.seat+2,P.w1);
  w.line(s.x-5,s.seat+2,s.x-7,s.by,P.w2); w.line(s.x+5,s.seat+2,s.x+7,s.by,P.w2); w.hl(s.x-5,s.x+5,s.seat+7,P.w2);
  // Sack mit Walnüssen neben dem Tisch (nicht mehr da, wenn sie zusammengepackt hat)
  if (!S.zlataGone){ var sx=SACK.x, by=SACK.by; for (var y=by-16;y<by;y++){ var t=(y-(by-16))/16, hw=4+Math.sin(t*Math.PI*0.9)*3.4; for (var x=rd(sx-hw);x<=rd(sx+hw);x++){ var c=((x+y)%3===0)?P.e2:P.e3; if (x>sx+hw-1.5) c=P.e1; w.px(x,y,c); } }
    for (var k=0;k<16;k++){ var nx=sx-4+Math.floor(hash(k,5)*9), ny=by-17+Math.floor(hash(k,6)*3); w.px(nx,ny,hash(k,7)<0.5?P.w2:P.w3); w.px(nx+1,ny,P.w1); } w.hl(sx-3,sx+3,by-15,P.e1); } }
// gemalte Marktleute im Hintergrund (Samstag)
function figure(w,x,by,h,coat,hat,bag,face){ var y, hw; w.g=RG.prop;
  var leg=rd(h*0.42), top=by-h, hy=top+rd(h*0.12);
  w.vl(x-1,by-leg,by-1,P.k2); w.vl(x+1,by-leg,by-1,P.c1); w.px(x-1,by-1,P.k1); w.px(x+2,by-1,P.k1);
  for (y=hy+2;y<by-leg+2;y++){ var t=(y-hy)/(by-leg-hy); hw=rd(2.2+t*1.6); for (var i=-hw;i<=hw;i++) w.px(x+i,y,(i<0)?coat[2]:((i>=hw-1)?coat[0]:coat[1])); }
  w.ellipse(x+0.5,hy,2.2,2.4,face?P.p3:P.h2); if (face) w.px(x+(face>0?2:-1),hy,P.p2);
  if (hat) w.rect(x-2,hy-3,5,2,hat); else w.hl(x-1,x+1,hy-2,P.h1);
  if (bag){ w.rect(x+3,by-leg-2,4,5,bag); w.px(x+3,by-leg-3,P.k2); } }
function paintCrowd(w){ figure(w,92,104,34,[P.w0,P.w1,P.w2],P.k2,P.c2,0); figure(w,104,105,32,[P.r0,P.r1,P.r2],null,null,1); figure(w,312,103,33,[P.c0,P.c1,P.c2],P.m1,P.y2,-1); figure(w,432,104,30,[P.g0,P.g1,P.g2],null,P.r2,1);
  // weitere Tische und Säcke der Bauern
  w.g=RG.stall; for (var x=300;x<330;x++){ w.px(x,98,P.w4); w.px(x,99,P.w2); } w.vl(302,100,108,P.w1); w.vl(327,100,108,P.w1);
  for (var k=0;k<3;k++){ var sx=301+k*10; for (var y=86;y<98;y++){ var hw=3+Math.sin((y-86)/12*Math.PI)*1.5; for (var xx=rd(sx+4-hw);xx<=rd(sx+4+hw);xx++) w.px(xx,y,(k===1)?P.s5:P.e3); } w.ellipse(sx+4,86,3,1.2,[P.w2,P.s6,P.t3][k]); } }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), WE='calm', BASE=null, FULL=false;
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), k, night=tod==='night';
  WE=we; REG.fill(0); LITW.length=0; CHIM.length=0; VAL.length=0; FULL=full(S,GS);
  paintSky(b,tod,we); paintVelez(w,we);
  paintHouses(w,we); paintGround(w,we);
  // der Brunnen links (Česma): Steinplatte mit Rohr und Becken
  w.g=RG.prop; var fx=FOUNT.x, fy=FOUNT.by; w.rect(fx-6,fy-26,12,26,P.s5); w.vl(fx-6,fy-26,fy-1,P.s6); w.vl(fx+5,fy-26,fy-1,P.s3); w.rect(fx-3,fy-22,6,9,P.s3); w.hl(fx-1,fx+2,fy-14,P.t3); w.px(fx+2,fy-13,P.t2);
  w.rect(fx-10,fy-6,20,6,P.s4); w.hl(fx-10,fx+9,fy-6,P.s6); w.hl(fx-9,fx+8,fy-5,P.a3);
  paintFruit(w,we); paintHoney(w,we);
  if (FULL){ paintCrowd(w); paintNeighbor(w,we); paintZlataBack(w,we,S); }
  if (S.eggDropped){ w.g=RG.prop; var ex=EGG[0], ey=EGG[1]; w.ellipse(ex,ey,3.5,1.2,P.s6); w.px(ex,ey,P.y4); w.px(ex+1,ey,P.y3); w.px(ex-1,ey,P.y4); w.px(ex+4,ey-1,P.s5); w.px(ex+5,ey-1,P.s4); w.px(ex-4,ey+1,P.s5); w.px(ex-5,ey,P.t5); w.px(ex+3,ey+2,P.t5); }
  // Licht
  var fk=we==='bura'?0.1:(we==='rain'?0.5:(we==='grey'?0.4:0.25)), fc=night?P.m1:(we==='rain'?P.m3:(we==='grey'?P.m4:P.b4));
  haze(b,function(xx,yy){ return REG[yy*W+xx]===RG.far?(0.4*fk+0.15):0; },fc);
  var amb=we==='rain'?-0.5:(we==='grey'?-0.3:(we==='bura'?0.1:0));
  M.light(b,M.lf.sum(M.lf.k(amb),M.lf.band(GY,H,0,-0.25),M.lf.pool(FRUIT.x0+30,FRUIT.by-6,46,10,-0.6),M.lf.pool(ZT.x0+20,ZT.by-4,40,9,FULL?-0.5:0),M.lf.pool(HONEY.x0+25,HONEY.by-4,36,8,-0.5)),0,0,function(xx,yy){ return REG[yy*W+xx]!==RG.sky; });
  SKYM.fill(0); for (k=0;k<W*H;k++) if (REG[k]===RG.sky) SKYM[k]=1;
  BASE=b.clone();
  return M.finishTOD(b,tod,{ sky:function(xx,yy){ return SKYM[yy*W+xx]===1; }, lights:[], after:function(o,tod2){ if (tod2==='day') return;
      LITW.forEach(function(p){ if (hash(p[0]*1.3,p[1]*2.1)>(tod2==='night'?0.35:0.2)) return; o.rect(p[0],p[1],4,6,P.y2); o.rect(p[0],p[1],4,2,P.y3); }); } }); }

// ---------------------------------------------------------------- Ebenen: die Tische vorn (Figuren dahinter): Gemüse der Nachbarin, Zlatas Klapptisch
function tableLayer(S,GS,tod){ var we=weaOf(GS), out=[]; if (!full(S,GS)) return out;
  // Gemüsestand der Nachbarin: Kisten auf einem Tisch, Kohl, Lauch, Paprika, Kartoffeln
  var n=NB, L=M.layer(n.x0-2,n.top-14,n.x1-n.x0+4,n.by-n.top+16,n.by), w=M.lw(L), x, y;
  for (x=n.x0;x<n.x1;x++){ w.px(x,n.top,P.w4); w.px(x,n.top+1,P.w2); w.px(x,n.top+2,P.w0); } [n.x0+2,n.x1-4].forEach(function(lx){ w.rect(lx,n.top+3,2,n.by-n.top-3,P.w1); });
  for (var i=0;i<4;i++){ var cx=n.x0+4+i*11; for (y=n.top-8;y<n.top;y++) for (x=cx;x<cx+9;x++) w.px(x,y,((y-n.top)%3===0)?P.w1:P.w3); }
  [[n.x0+8,P.g4,P.g3],[n.x0+19,P.r3,P.r2],[n.x0+30,P.e3,P.e2],[n.x0+41,P.s5,P.g4]].forEach(function(v,i){ for (var k=0;k<5;k++){ var vx=v[0]-3+k*1.6, vy=n.top-10+(k%2); w.ellipse(vx,vy,2.2,2,i===0?(k%2?v[1]:v[2]):v[1+(k%2)]); w.px(rd(vx)-1,vy-1,M.UP[v[1]]); } });
  for (var q=0;q<5;q++) w.vl(n.x0+40+q,n.top-18,n.top-9,q%2?P.g4:P.s5);
  w.rect(n.x0+2,n.top+8,12,7,P.s6); sign(w,'1KM',n.x0+3,n.top+9,P.k2);
  if (tod!=='day') M.tintApply(L,M.TINT[tod]); out.push(L);
  // Zlatas Klapptisch: helle Platte, Rohrbeine, darauf Eierkartons und eine Waage (oder leer)
  var z=ZT, L2=M.layer(z.x0-2,z.top-14,z.x1-z.x0+6,z.by-z.top+16,z.by), w2=M.lw(L2);
  for (x=z.x0;x<z.x1;x++){ w2.px(x,z.top,P.s5); w2.px(x,z.top+1,P.s4); w2.px(x,z.top+2,P.m2); }
  w2.line(z.x0+3,z.top+3,z.x0+1,z.by,P.m3); w2.line(z.x1-4,z.top+3,z.x1-2,z.by,P.m3); w2.line(z.x0+3,z.top+3,z.x1-4,z.by-3,P.m2);
  if (!S.zlataGone){
    for (var e=0;e<3;e++){ var ex=z.x0+2+e*10, ey=z.top-4; w2.rect(ex,ey,9,4,P.m3); w2.hl(ex,ex+8,ey,P.s4); for (var j=0;j<4;j++){ w2.px(ex+1+j*2,ey-1,(e===1&&j===2)?P.t5:P.s6); w2.px(ex+1+j*2,ey-2,(e===1&&j===2)?P.t4:P.s5); } }
    w2.rect(z.x0+4,z.top-8,9,4,P.m3); w2.hl(z.x0+4,z.x0+12,z.top-8,P.s4); for (var j2=0;j2<4;j2++) w2.px(z.x0+5+j2*2,z.top-9,j2%2?P.t5:P.s6);
    // Waage: Gestell aus Messing, zwei Schalen
    var sxx=z.x1-8; w2.rect(sxx-1,z.top-8,3,8,P.y1); w2.hl(sxx-6,sxx+6,z.top-9,P.y2); w2.ellipse(sxx-5,z.top-4,3,0.9,P.y3); w2.ellipse(sxx+5,z.top-4,3,0.9,P.y3); w2.vl(sxx-5,z.top-8,z.top-5,P.y1); w2.vl(sxx+5,z.top-8,z.top-5,P.y1); w2.rect(sxx+4,z.top-6,2,2,P.m1); }
  else { w2.px(z.x0+8,z.top-1,P.e3); w2.px(z.x0+20,z.top-1,P.e4); w2.rect(z.x0+24,z.top-3,8,3,P.m3); }
  if (tod!=='day') M.tintApply(L2,M.TINT[tod]); out.push(L2);
  return out; }

// ---------------------------------------------------------------- jedes Bild: Planen, Tauben, die Waage wippt
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, we=WE, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  function px(X,Y,c){ X=rd(X)-cam; if (X<0||X>=320||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  var amp=we==='bura'?2.2:(we==='rain'?0.4:0.7), sp=we==='bura'?9:2.2;
  VAL.forEach(function(vl,i){ for (var x=vl.x0;x<vl.x1;x++){ var ph=Math.sin(t*sp-x*0.45+i)*amp+(we==='bura'?Math.sin(t*17+x)*0.6:0), L=3+rd(ph+amp), st=vl.stripe?(Math.floor((x-vl.x0)/6)%2):0;
      for (var q=0;q<L;q++) px(x,vl.y+q,vl.cols[st][q===L-1?0:1]); if ((x-vl.x0)%6===0) px(x,vl.y+L,vl.cols[st][0]); } });
  // die Waage auf Zlatas Tisch wippt leicht
  if (FULL && !S.zlataGone){ var sxx=ZT.x1-8, d=rd(Math.sin(t*1.4)*1.2); px(sxx-5,ZT.top-4+d,P.y4); px(sxx+5,ZT.top-4-d,P.y4); }
  // Tauben picken zwischen den Ständen
  if (we!=='rain') [[60,122],[78,128],[170,134],[372,126],[396,131]].forEach(function(p,i){ var x=p[0]+Math.sin(t*0.4+i*2)*6, y=p[1], peck=Math.sin(t*2.6+i*2.1)>0.4, f=Math.cos(t*0.4+i*2)>0?1:-1;
    px(x,y,P.m2); px(x+1,y,P.m2); px(x-1,y-1,P.m2); px(x,y-1,P.m3); px(x+1,y-1,P.m3); px(x+2*f,y-1,P.m2); px(x,y-2,P.m4); px(x+(f>0?2:-1),peck?y:y-2,P.m3); px(x+(f>0?2:-1),peck?y-1:y-3,P.a3); px(x,y+1,P.t2); });
  // Rauch aus den Kaminen
  if (we!=='rain') CHIM.forEach(function(c,i){ if (i%2) return; for (var j=0;j<6;j++){ var ph2=(t*0.5+j/6+i*0.3)%1, X=c[0]+(we==='bura'?ph2*26:Math.sin(ph2*5+i)*2+ph2*4), Y=c[1]-(we==='bura'?ph2*4:ph2*14); if (bayer(rd(X),rd(Y))<0.5-ph2*0.45 && SKYM[rd(Y)*W+rd(X)]) px(X,Y,tod==='day'?P.s5:P.m1); } });
  if (we==='bura' && tod==='day') for (var k=0;k<3;k++){ var spd=22+hash(k,3)*18, cx=((hash(k,1)*W+t*spd)%(W+60))-30-cam, cy=4+hash(k,2)*16, L2=10+hash(k,4)*16;
    for (var q2=0;q2<L2;q2++){ var X2=rd(cx+q2), Y2=rd(cy+Math.sin(q2*0.5+k)*0.6); if (X2<0||X2>=320||Y2<0) continue; if (!SKYM[Y2*W+X2+cam]) continue; var a=1-Math.abs(q2/L2-0.5)*2; if (bayer(X2,Y2)<a*0.8) fb.px(X2,Y2,P.b5); } } }
function front(fb,v,S,GS){ var we=WE;
  if (we==='rain') M.rain(fb,v.t,{n:90,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:250,slant:0.2});
  if (we==='bura') M.scn.buraDebris(fb,v.t,112,140,v.cam); }
// Geistersicht: an Zlatas Hocker eine warme, flackernde Spur
function ghost(fb,v,S,GS){ if (!FULL) return; var t=v.t, cam=v.cam, s=STOOL, gone=!!S.zlataGone;
  for (var i=0;i<22;i++){ var a=hash(i,3)*6.283, r=hash(i,4)*7, fl=Math.sin(t*(5+hash(i,5)*4)+i*1.7), x=rd(s.x+Math.cos(a)*r*1.3)-cam, y=rd(s.seat-3-Math.abs(Math.sin(a))*r*0.6-fl*1.5);
    if (x<0||x>=320||y<0||y>=144) continue; if (fl<(gone?0.2:-0.3)) continue; fb.px(x,y,fl>0.7?P.y4:(fl>0.2?P.y3:P.d5)); }
  for (var k=0;k<5;k++){ var X=rd(s.x-4+k*2)-cam, Y=s.seat+rd(Math.sin(t*3+k)); if (X>=0&&X<320) fb.px(X,Y,(Math.sin(t*6+k)>0)?P.y3:P.d4); } }

// ---------------------------------------------------------------- Lauffläche: der Platz vor den Ständen
function walk(x,y,S,GS){ if (y<112||y>138||x<6||x>474) return false;
  if (Math.abs(x-FOUNT.x)<12 && y<FOUNT.by+4) return false;
  if (full(S||{},GS||{phase:''}) && ((x>NB.x0-2 && x<NB.x1+2 && y<NB.by+2) || (x>ZT.x0-2 && x<ZT.x1+4 && y<ZT.by+2) || (Math.abs(x-SACK.x)<7 && y<SACK.by+2))) return false;
  return true; }
M.defineArt('tepa',{
  width:W, paint:paint, layers:tableLayer, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{
    exit:[0,88,12,56],
    zlata_stand:[ZT.x0-2,ZT.top-10,ZT.x1-ZT.x0+6,ZT.by-ZT.top+11],
    eggs:[ZT.x0,ZT.top-10,32,11],
    walnuts:[SACK.x-6,SACK.by-19,13,20],
    neighbor_stand:[NB.x0-2,NB.top-20,NB.x1-NB.x0+4,NB.by-NB.top+21],
    honey:[HONEY.x0-2,HONEY.by-32,HONEY.x1-HONEY.x0+4,33],
    fruit:[FRUIT.x0-2,FRUIT.by-34,FRUIT.x1-FRUIT.x0+4,35],
    crowd:[84,68,32,38]
  },
  stands:{ exit:[8,126,'L'], zlata_stand:[262,124,'B'], eggs:[258,124,'B'], walnuts:[240,122,'B'], neighbor_stand:[214,124,'B'], honey:[362,120,'B'], fruit:[146,120,'B'], crowd:[100,120,'B'] },
  actorPos:{ zlata:[ZLATA[0],ZLATA[1],'L','zlata',false,'sit'], susjeda:[SUSJ[0],SUSJ[1],'R'] },
  start:[24,126,'R'], entries:{ map:[16,126,'R'] }
});
})(M);
