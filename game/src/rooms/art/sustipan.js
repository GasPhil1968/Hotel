/* ===== rooms/art/sustipan.js — Sustipan, der Park auf dem alten Friedhof =====
   Eine Landzunge mit hohen Pinien, Kieswegen und niedrigen Steinmauern. Rechts vorn der kleine runde Pavillon mit Säulen und
   Kuppel an der Spitze über dem Meer, in der Mitte der Gedenkstein „ONIMA KOJE JE MORE ZADRŽALO“ mit der Namensliste, eine Bank,
   eine alte Parklaterne. Links in der Ferne die Hafeneinfahrt mit dem grünen Leuchtfeuer auf dem Wellenbrecher und die Lichter
   der Stadt über der Bucht. In Malas Geistersicht erscheint der alte Friedhof, der in den 1950ern eingeebnet wurde:
   Kreuze, Grabsteine und eine kleine Kapelle als blasse, leuchtende Umrisse zwischen den Pinien, auf und neben den Wegen. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144, HZ=60;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rnd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function puff(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bx=0, by=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.15+hash(gx+i+sd,gy+j)*0.7)*sx, cy=(gy+j+0.15+hash(gx+i,gy+j+sd*1.7)*0.7)*sy;
    var dx=(x-cx)/sx, dy=(y-cy)/sy, d=dx*dx+dy*dy; if (d<b1){ b2=b1; b1=d; bx=dx; by=dy; } else if (d<b2) b2=d; }
  var v=0.6-by*0.75-bx*0.25-b1*0.3; if (b2-b1<0.1) v-=0.32; return v; }
function blocks(u,v,sw,sh,sd,ramps,jc){ var row=Math.floor(v/sh), fv=v-row*sh, bw=sw*(0.75+hash(row,sd+2)*0.6), uu=u+hash(row,sd)*sw, col=Math.floor(uu/bw), fu=uu-col*bw;
  if (fv<1||fu<1) return jc; var rr=ramps[Math.floor(hash(col+sd*3,row+11)*ramps.length)], t=hash(col*13+sd,row*7+sd), k=t<0.3?0:(t<0.8?1:2), c=rr[k];
  if (fv<2&&fu>1&&fu<bw-1) c=rr[k+1]; else if (fv>=sh-1||fu>=bw-1) c=rr[Math.max(0,k-1)];
  var p=hash(u*3+col,v*5+row); if (p<0.05) c=M.DN[c]; else if (p>0.975) c=M.UP[c]; return c; }
// Regionen: wer wo gemalt hat
var REG=new Uint8Array(W*H), RG={sky:0,far:1,sea:2,land:3,stone:4,tree:5,prop:6,path:7};
function RW(b,id){ var o={w:W,h:H,buf:null};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Geometrie
function wallTop(x){ return 91+Math.sin(x*0.05)*1.2+Math.sin(x*0.17)*0.6; }    // Oberkante der Brüstungsmauer über dem Meer
var WALLB=99;                                                               // Mauerfuß
function pathTop(x){ return 107+Math.sin(x*0.03+1)*1.5; }                   // hinterer Rand des Kieswegs
var PAV={cx:270,fy:98.5,R:30};                                              // Pavillon: Mitte, Fußboden, Radius
var LAMP={x:84,by:106,h:42};
var MEM={x0:94,x1:146,y0:76,y1:108}, PLQ={x0:98,x1:142,y0:80,y1:104};       // Gedenkstein, Bronzetafel
var BENCH={x0:168,x1:204,by:104};
var BEACON={x:105,y:61};
var MOON=[201,8,5];
// Pinien: Stamm von (x0,y0) unten nach (x1,y1) oben, Krone (cx,cy,rx,ry)
var PINES=[{x0:41,y0:146,x1:53,y1:4,w:6,cr:[34,2,50,14],fg:true},{x0:150,y0:104,x1:141,y1:18,w:4,cr:[148,13,40,12]},{x0:214,y0:102,x1:220,y1:30,w:3,cr:[222,25,28,9]},{x0:313,y0:98,x1:309,y1:12,w:3,cr:[301,8,30,10]}];

// ---------------------------------------------------------------- Himmel, Stadt, Meer
function skyPaint(b,tod,weather){ var w=RW(b,RG.sky);
  if (weather==='rain'){ var RR=tod==='night'?R('k1 k2 n0 n1'):(tod==='dusk'?R('d0 m1 d1 m2 d2'):R('m2 m3 s3 m3'));          // Regen: tief verhangen
    for (var y0=0;y0<HZ;y0++) for (var x0=0;x0<W;x0++) w.px(x0,y0,ra(RR,0.2+y0/HZ*0.55+(fbm(x0,y0*2,18,4)-0.5)*0.45,x0,y0)); return; }
  if (tod==='dusk'){ var DR=R('d0 d1 d2 d3 d4 d5 d6');                    // Nachglühen im Westen (rechts)
    for (var y=0;y<HZ;y++) for (var x=0;x<W;x++){ var v=0.05+Math.pow(y/HZ,1.25)*0.88+(x/W-0.3)*0.12*(y/HZ); w.px(x,y,ra(DR,v,x,y)); }
    var r=M.rng(17); for (var i=0;i<9;i++){ var cx=r()*W, cy=12+r()*36, rx=18+r()*40, ry=1+r()*1.6; for (var yy=Math.floor(cy-ry);yy<=cy+ry;yy++) for (var xx=Math.floor(cx-rx);xx<=cx+rx;xx++){ var dx=(xx-cx)/rx, dy=(yy-cy)/ry; if (dx*dx+dy*dy>1||bayer(xx,yy)<dx*dx*0.8) continue; w.px(xx,yy,dy<-0.2?(cy>34?P.d6:P.d5):(cy>34?P.d4:P.d3)); } } }
  else if (tod==='night'){ var NR=R('k0 k1 k2 n0 n1 n2');
    for (var y2=0;y2<HZ;y2++) for (var x2=0;x2<W;x2++) w.px(x2,y2,ra(NR,0.3+Math.pow(y2/HZ,1.4)*0.62,x2,y2));
    var r2=M.rng(29), n=weather==='bura'?260:200; for (var s=0;s<n;s++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.3)*(HZ-6)), q=r2(); w.px(sx,sy,q<0.08?P.n5:(q<0.35?P.n4:P.n3)); if (q<0.03){ w.px(sx+1,sy,P.n3); w.px(sx-1,sy,P.n3); w.px(sx,sy-1,P.n3); w.px(sx,sy+1,P.n3); } }
    // Milchstraße als feiner Schleier
    for (var x3=0;x3<W;x3++){ var my=8+x3*0.12+Math.sin(x3*0.03)*4; for (var yy3=Math.floor(my-6);yy3<my+6;yy3++){ if (yy3<0||yy3>=HZ-8) continue; if (bayer(x3,yy3)<0.16*(1-Math.abs(yy3-my)/6)*(0.5+fbm(x3,yy3,7,3))) w.px(x3,yy3,P.n1); } }
    if (weather!=='bura'){ var mx=MOON[0], my=MOON[1], mr=MOON[2];                                       // Vollmond mit Hof
      for (var yy4=my-13;yy4<=my+13;yy4++) for (var xx4=mx-13;xx4<=mx+13;xx4++){ var d=Math.hypot(xx4+0.5-mx,yy4+0.5-my); if (d<=mr){ var mar=fbm(xx4*2,yy4*2,5,7)>0.6; w.px(xx4,yy4,(xx4-mx+yy4-my>mr*0.9)?P.n4:(mar?P.n4:P.n5)); }
        else if (d<13 && bayer(xx4,yy4)<(1-(d-mr)/(13-mr))*0.55) w.px(xx4,yy4,M.UP[b.get(xx4,yy4)]); }
      w.px(mx-2,my-2,P.l1); w.px(mx-1,my-3,P.l1); } }
  else if (tod==='dawn'){ M.sky(b,0,0,W,HZ,'dawn',23); }
  else { M.scn.sky(b,0,0,W,HZ,'day',weather,23); } }
function farPaint(b,tod){ var w=RW(b,RG.far), night=tod==='night', dusk=tod==='dusk', day=tod==='day';
  var MT=day?P.b2:(dusk?P.d1:P.n0), MT2=day?P.b1:(dusk?P.d0:P.k2), CT=day?P.s2:(dusk?P.d0:P.k1), CT2=day?P.s1:(dusk?P.k2:P.k0);
  // Kozjak und Mosor hinter der Stadt
  for (var x=0;x<170;x++){ var h=rnd(14+Math.sin(x*0.035+0.6)*5+Math.sin(x*0.11)*2-x*0.06); if (h<0) continue; for (var y=HZ-h;y<HZ;y++) w.px(x,y,(y<HZ-h+1)?MT:(bayer(x,y)<0.3?MT:MT2)); }
  // die Stadt über der Bucht: Häuserzeile, Glockenturm von Sv. Duje
  for (var x2=0;x2<150;x2++){ var hh=rnd(3+hash(Math.floor(x2/5),2)*4*(1-x2/170)); for (var y2=HZ-hh;y2<HZ;y2++) w.px(x2,y2,CT2); }
  M.scn.belltower(w,64,HZ-5,19,CT2,!day); w.rect(62,HZ-8,5,4,CT2);
  if (!day){ var r=M.rng(51); for (var i=0;i<70;i++){ var lx=Math.floor(Math.pow(r(),0.8)*148), ly=HZ-1-Math.floor(r()*Math.max(1,5*(1-lx/170))); w.px(lx,ly,r()<0.3?P.y5:(r()<0.6?P.y4:P.y3)); }
    for (var j=0;j<12;j++){ var hx=Math.floor(r()*120), hy=HZ-6-Math.floor(r()*8*(1-hx/150)); if (b.get(hx,hy)===MT||b.get(hx,hy)===MT2) w.px(hx,hy,P.y3); } }
  // Inseln im Süden (Šolta, Brač): ganz blass
  for (var x3=176;x3<W;x3++){ var h3=rnd(3+Math.sin(x3*0.025)*2+Math.sin(x3*0.09)*0.8); for (var y3=HZ-h3;y3<HZ;y3++) w.px(x3,y3,day?P.b3:(dusk?P.d2:P.n0)); } }
function seaR(tod){ return tod==='dusk'?R('n0 n1 d1 d2 d3 d4'):M.seaRamp(tod); }
function seaV(x,y,t,bura){ var d=(y-HZ)/44, s=Math.sin(x*0.11+y*0.9+t*(bura?2.2:1.1))+Math.sin(x*0.037-t*(bura?1.1:0.5)+y*0.33); return 0.66-d*0.42+s*0.05+(Math.sin(y*2.3)>0.6?0.04:0); }
function seaPaint(b,tod){ var w=RW(b,RG.sea), ramp=seaR(tod);
  for (var y=HZ;y<104;y++) for (var x=0;x<W;x++) w.px(x,y,M.rampAt(ramp,seaV(x,y,0,false),x,y));
  // Wellenbrecher der Hafeneinfahrt mit dem grünen Leuchtfeuer
  var BW=tod==='day'?P.s3:(tod==='dusk'?P.d1:P.k2), BW2=tod==='day'?P.s1:(tod==='dusk'?P.k2:P.k1);
  for (var x2=0;x2<=BEACON.x;x2++){ var yb=rnd(lerp(70,67,x2/BEACON.x)); w.px(x2,yb-1,BW); w.px(x2,yb,BW2); }
  w.rect(BEACON.x-1,BEACON.y,3,6,tod==='day'?P.s5:BW); w.px(BEACON.x,BEACON.y-1,tod==='day'?P.g3:P.g5); w.px(BEACON.x,BEACON.y+2,tod==='day'?P.g2:P.g3); }

// ---------------------------------------------------------------- Land: Mauer, Wiese, Weg
var WS=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5'),R('e1 e2 e3 e4'),R('s1 s2 s3 s4')];
function landPaint(b){ var w=RW(b,RG.land), st=RW(b,RG.stone), pa=RW(b,RG.path);
  for (var x=0;x<W;x++){ var wt=rnd(wallTop(x)), pt=rnd(pathTop(x));
    for (var y=wt;y<H;y++){
      if (y<wt+2){ st.px(x,y,y===wt?P.s5:P.s3); continue; }                                    // Abdeckung der Mauer
      if (y<WALLB){ st.px(x,y,blocks(x,y,7,3,11,WS,P.s0)); continue; }                          // Trockenmauer
      if (y<pt){ var g=fbm(x,y*2,5,4), c=ra(R('g1 g2 g3 e3'),0.35+g*0.55+(y-WALLB)*0.03,x,y); if (y===WALLB) c=P.g1; if (hash(x,y)<0.06) c=P.e2; w.px(x,y,c); continue; }   // Wiese
      var d=(y-pt)/(H-pt), lo=fbm(x,y*1.8,22,3), mid=1-Math.abs(d-0.45)*2, v=0.42+(lo-0.5)*0.4+mid*0.14+(bayer(x,y)-0.5)*0.06, c2=v<0.33?P.e3:(v<0.5?P.s3:(v<0.66?P.s4:P.s5));   // Kies: ruhig, in der Mitte ausgetreten
      var gr=hash(x,y); if (gr<0.035) c2=P.s2; else if (gr>0.975) c2=P.s5; else if (gr>0.955 && hash(x+1,y)>0.5){ c2=P.e2; }
      if (y===pt) c2=P.s1; else if (y===pt+1) c2=(hash(Math.floor(x/4),1)<0.5)?P.s3:P.s4;                 // Kantsteine am Wegrand
      if (y>H-6 && fbm(x,y,5,8)>0.55-((y-(H-6))*0.05)) c2=(hash(x,y)<0.5)?P.g3:P.g2;                       // Gras am vorderen Rand
      pa.px(x,y,c2); } }
  // Kiefernnadeln und Zapfen
  var r=M.rng(33); for (var i=0;i<140;i++){ var nx=Math.floor(r()*W), ny=rnd(pathTop(nx)+2+r()*34); if (ny>=H) continue; pa.line(nx,ny,nx+(r()<0.5?2:-2),ny+(r()<0.5?1:0),r()<0.5?P.w2:P.e2); }
  for (var j=0;j<9;j++){ var cx=Math.floor(r()*W), cy=rnd(pathTop(cx)+4+r()*30); if (cy>=H-1) continue; pa.rect(cx,cy,2,2,P.w1); pa.px(cx,cy,P.w3); }
  // Agaven an der Mauer
  [[12,104,9],[226,104,8],[128,106,5]].forEach(function(a,ai){ var ax=a[0], ay=a[1], L=a[2]; for (var lf=0;lf<9;lf++){ var an=-Math.PI*(0.08+lf/8*0.84), len=L*(0.6+hash(lf,ai)*0.5);
      for (var q=0;q<len;q++){ var px=rnd(ax+Math.cos(an)*q), py=rnd(ay+Math.sin(an)*q*0.85+q*q*0.012), th=Math.max(0,1.6*(1-q/len)); for (var o=-th;o<=th;o++){ w.px(px+rnd(o*Math.sin(an)),py,(q>len-2)?P.e3:(o<0?P.g4:(o>0.5?P.g2:P.g3))); } } } });
  // Grasbüschel und Rosmarin an der Mauer
  for (var k=0;k<30;k++){ var gx=Math.floor(r()*W), gy=rnd(pathTop(gx)); for (var q=0;q<5;q++) w.px(gx+q-2,gy-1-Math.floor(r()*3),r()<0.5?P.g3:P.g2); } }

// ---------------------------------------------------------------- Pinien
function pineCrown(w,cx,cy,rx,ry,sd,G,rim){
  for (var y=Math.floor(cy-ry-2);y<=cy+ry+3;y++) for (var x=Math.floor(cx-rx-3);x<=cx+rx+3;x++){ var dx=(x-cx)/rx, dy=(y-cy)/ry, e=dx*dx+dy*dy*(dy>0?2.2:1.2)+(fbm(x,y,5,sd)-0.5)*0.95;
    if (e>1) continue; var v=puff(x,y,6,3.4,sd)*0.8+0.12-Math.max(0,dy)*0.5; if (e>0.8){ if (rim>0) v+=0.28*(dx>0?1:-0.4); else if (dy<-0.2) v+=0.34; } w.px(x,y,ra(G,v,x,y)); } }
function trunk(w,p,G){ for (var y=p.y1;y<p.y0;y++){ var t=(p.y0-y)/(p.y0-p.y1), x=lerp(p.x0,p.x1,t)+Math.sin(t*5+p.x0)*1.6, wd=Math.max(2,rnd(p.w*(1-t*0.4)));
    for (var i=0;i<wd;i++){ var u=i/(wd-1||1), c=u<0.3?G[2]:(u<0.7?G[1]:G[0]); if (((y+Math.floor(i*1.7))%5)===0) c=G[0]; w.px(rnd(x)-(wd>>1)+i,y,c); } } }
function pinesPaint(b,tod,fgOnly){ var w=RW(b,RG.tree), G=R('g0 g1 g2 g3 g4'), TR=R('w0 w1 t1'), rim=tod==='dusk'?1:-1;
  PINES.forEach(function(p,i){ if (!!p.fg!==!!fgOnly) return; trunk(w,p,TR);
    // Äste zur Krone
    var c=p.cr; for (var k=0;k<3;k++){ var ex=c[0]+(k-1)*c[2]*0.55, ey=c[1]+c[3]*0.4; w.line(rnd(p.x1),rnd(p.y1+8),rnd(ex),rnd(ey),TR[1]); }
    pineCrown(w,c[0],c[1],c[2],c[3],40+i*9,G,rim); pineCrown(w,c[0]+c[2]*0.45,c[1]+c[3]*0.5,c[2]*0.45,c[3]*0.6,47+i*9,G,rim); pineCrown(w,c[0]-c[2]*0.5,c[1]+c[3]*0.35,c[2]*0.4,c[3]*0.55,53+i*9,G,rim); }); }

// ---------------------------------------------------------------- Pavillon an der Spitze
function pavilionPaint(b,tod){ var w=RW(b,RG.stone), cx=PAV.cx, L=tod==='dusk'?1:-1, S=R('s1 s2 s3 s4 s5 s6');
  function shade(x,half){ var u=(x-cx)/half; return 0.55+u*L*0.3; }
  // drei Stufen als Ellipsen
  [[106,39,7,4],[102.5,36,6.5,3.5],[99,33,6,3]].forEach(function(t){ var yc=t[0], rx=t[1], ry=t[2], hh=t[3];
    for (var y=Math.floor(yc-ry);y<=Math.ceil(yc+ry+hh);y++) for (var x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){ var dx=(x+0.5-cx)/rx; if (Math.abs(dx)>1) continue; var e=Math.sqrt(1-dx*dx)*ry;
      if (y>=yc-e&&y<=yc+e) w.px(x,y,ra(S,0.72+(hash(x,y)-0.5)*0.15,x,y)); else if (y>yc+e&&y<=yc+e+hh) w.px(x,y,ra(S,shade(x,rx)-0.15-(y-yc-e)/hh*0.2,x,y)); } });
  // hintere Säulen (im Schatten), dann Gebälk-Innenseite
  [-0.92,-0.38,0.38,0.92].forEach(function(s){ var x=rnd(cx+s*PAV.R*0.86); for (var y=64;y<rnd(PAV.fy-5.5*Math.sqrt(1-s*s));y++){ w.px(x-1,y,P.s2); w.px(x,y,P.s1); w.px(x+1,y,P.s1); } });
  // vordere Säulen: Basis, Schaft mit Kanneluren, Kapitell
  [-0.92,-0.38,0.38,0.92].forEach(function(s){ var x=rnd(cx+s*PAV.R), by=rnd(PAV.fy+5.5*Math.sqrt(1-s*s))-1;
    for (var y=64;y<by;y++) for (var i=-2;i<=2;i++){ var u=i/2, v=0.55-u*L*0.35*(-1)+(i===0?0.08:0); if (Math.abs(i)===2) v-=0.2; w.px(x+i,y,ra(S,v+(L>0?u*0.3:-u*0.3)-0.1,x+i,y)); }
    w.rect(x-3,by-2,7,2,P.s4); w.hl(x-3,x+3,by-2,P.s5); w.rect(x-3,64,7,2,P.s5); w.hl(x-3,x+3,66,P.s3); });
  // Gebälk (Ring) auf Augenhöhe: gerades Band mit Gesims
  for (var y2=56;y2<64;y2++) for (var x2=cx-PAV.R-3;x2<=cx+PAV.R+3;x2++){ var c=ra(S,shade(x2,PAV.R+3)+(y2<58?0.15:0)-(y2>62?0.15:0),x2,y2); if (y2===59&&(x2%3)===0) c=P.s3; w.px(x2,y2,c); }
  w.hl(cx-PAV.R-4,cx+PAV.R+4,55,P.s5); w.hl(cx-PAV.R-4,cx+PAV.R+4,56,P.s3); w.hl(cx-PAV.R-3,cx+PAV.R+3,64,P.s2);
  // Kuppel (Kupfer mit Patina) mit Rippen, Laterne und Kugel
  var CU=R('a1 a2 a3 a4 a5');
  for (var y3=33;y3<55;y3++) for (var x3=cx-PAV.R;x3<=cx+PAV.R;x3++){ var dx=(x3+0.5-cx)/PAV.R, dy=(55-y3)/22; if (dx*dx+dy*dy>1) continue; var nz=Math.sqrt(Math.max(0,1-dx*dx-dy*dy));
    var v=0.45+dx*L*0.35+dy*0.15+nz*0.1; var c=ra(CU,v+(fbm(x3,y3*2,4,6)-0.5)*0.25,x3,y3); var mer=Math.asin(cl(dx/Math.sqrt(Math.max(0.01,1-dy*dy)),-1,1)); if (Math.abs(((mer/Math.PI*8)%1+1)%1-0.5)<0.07) c=M.DN[c]; if (fbm(x3,y3,3,8)>0.72) c=P.g4; w.px(x3,y3,c); }
  w.rect(cx-3,28,7,6,P.s4); w.hl(cx-3,cx+3,28,P.s5); w.vl(cx+L*2,29,33,P.s3); w.ellipse(cx+0.5,26,2.2,2.2,P.a4); w.vl(cx,20,24,P.k2); w.hl(cx-1,cx+1,22,P.k2); }

// ---------------------------------------------------------------- Gedenkstein, Laterne, Bank
function memorialPaint(b){ var w=RW(b,RG.stone), S=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5')];
  w.poly([[MEM.x0,MEM.y1],[MEM.x0+1,MEM.y0+3],[MEM.x0+6,MEM.y0],[MEM.x1-5,MEM.y0+1],[MEM.x1,MEM.y0+4],[MEM.x1+1,MEM.y1]],function(x,y){ var c=blocks(x,y,13,9,61,S,P.s1); if (fbm(x,y,4,2)>0.7) c=M.DN[c]; if (y<MEM.y0+3) c=M.UP[c]; return c; });
  w.hl(MEM.x0-2,MEM.x1+3,MEM.y1,P.s1); w.hl(MEM.x0-1,MEM.x1+2,MEM.y1-1,P.s2);
  // Bronzetafel mit Inschrift und Namensliste
  var x0=PLQ.x0, y0=PLQ.y0, x1=PLQ.x1, y1=PLQ.y1;
  w.rect(x0,y0,x1-x0,y1-y0,P.y1); w.hl(x0,x1-1,y0,P.y3); w.vl(x0,y0,y1-1,P.y2); w.hl(x0,x1-1,y1-1,P.y0); w.vl(x1-1,y0,y1-1,P.y0);
  for (var y=y0+1;y<y1-1;y++) for (var x=x0+1;x<x1-1;x++) if (fbm(x,y,3,5)>0.68) w.px(x,y,P.a3);                       // Patina
  M.microText(w,'ONIMA KOJE',x0+3,y0+2,P.y4); M.microText(w,'JE MORE',x0+9,y0+8,P.y4); M.microText(w,'ZADRŽALO',x0+7,y0+14,P.y4);
  w.hl(x0+5,x1-6,y0+20,P.y2);
  for (var r=0;r<2;r++) for (var cI=0;cI<3;cI++){ var nx=x0+3+cI*13, ny=y0+22+r*1, L=5+rnd(hash(r,cI)*5); w.hl(nx,nx+L,ny,P.y3); } }
function lampPaint(b,lit){ var w=RW(b,RG.prop), x=LAMP.x, by=LAMP.by, h=LAMP.h, top=by-h;
  w.rect(x-2,by-4,5,4,P.k2); w.hl(x-2,x+2,by-4,P.m1); w.rect(x-1,top+8,3,h-12,P.k2); w.vl(x-1,top+8,by-5,P.m1); w.px(x,top+16,P.m1); w.px(x,top+26,P.m1);
  w.hl(x-3,x+3,top+7,P.k1); w.poly([[x-4,top],[x+4,top],[x+3,top+7],[x-3,top+7]],lit?P.y4:P.m2); w.vl(x,top,top+6,lit?P.y5:P.m1);
  w.hl(x-5,x+5,top-1,P.k1); w.poly([[x-4,top-1],[x+4,top-1],[x,top-5]],P.k2); w.px(x,top-6,P.k1);
  if (lit){ w.px(x-1,top+3,P.l1); w.px(x+1,top+3,P.l0); w.vl(x-3,top+1,top+5,P.y3); } }
function benchPaint(b){ var w=RW(b,RG.prop), x0=BENCH.x0, x1=BENCH.x1, by=BENCH.by;
  [x0+3,x1-5].forEach(function(lx){ w.rect(lx,by-12,2,12,P.k2); w.px(lx,by-1,P.k1); w.px(lx+1,by-1,P.k1); });
  w.rect(x0,by-8,x1-x0,2,P.w2); w.hl(x0,x1-1,by-8,P.w3);                                  // Sitz (hinter der Lehne)
  w.rect(x0-1,by-13,x1-x0+2,2,P.w3); w.hl(x0-1,x1,by-13,P.w4); w.rect(x0-1,by-10,x1-x0+2,2,P.w2); w.hl(x0-1,x1,by-10,P.w3);   // Lehne
  for (var x=x0;x<x1;x+=6) w.px(x,by-12,P.w1); }

// ---------------------------------------------------------------- Licht
var DIMW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+r*0.12+12, L*0.38+g*0.08+8, L*0.26+b*0.1+16]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.45+L*0.36+16, g*0.32+L*0.26+6, b*0.16+L*0.08+4]; });
var LW=[[LAMP.x,LAMP.by-LAMP.h+18,48,40,1.0]], LF=[[LAMP.x+6,118,62,15,0.95]];
function lightAt(x,y,tod,r){ var set=(r===RG.path||r===RG.land)?LF:LW, L=0; for (var i=0;i<set.length;i++){ var l=set[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], f=1-dx*dx-dy*dy; if (f>0){ var v=l[4]*Math.pow(f,1.1); if (v>L) L=v; } }
  if (r===RG.tree) L*=0.35; return tod==='dusk'?L*0.7:L; }
function warmPass(b,base,tod){ var LT=M.TINT.lamp;
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, r=REG[k]; if (r===RG.sky||r===RG.far||r===RG.sea) continue; var L=lightAt(x,y,tod,r); if (L<0.03) continue;
    var f=L*3.3, lv=Math.floor(f), fr=f-lv, t=lv===0?fr:(fr-0.5)*1.7+0.5; if (t>bayer(x,y)) lv++; if (lv<=0) continue; if (tod==='dusk'&&lv===1) continue;
    var c=base.d[k]; b.d[k]=lv===1?M.tintPx(DIMW,c,x,y):(lv===2?M.tintPx(MIDW,c,x,y):(lv===3?M.tintPx(LT,c,x,y):M.UP[M.tintPx(LT,c,x,y)])); } }
function actorLut(a,S,GS,tod){ if (tod==='day'||!M.TINT[tod]) return null; var dx=(a.x-LAMP.x-6)/50, dy=(a.y-118)/22, f=1-dx*dx-dy*dy, L=f>0?Math.pow(f,0.8):0; if (tod==='dusk') L*=0.8;
  if (L>0.5) return MIDW.a; if (L>0.2) return DIMW.a; return M.TINT[tod].a; }
function shadePass(b,tod){ var dusk=tod==='dusk';
  M.light(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky||r===RG.far||r===RG.sea) return 0; var v=0, cx=(x-160)/190, cy=(y-80)/105; v-=Math.max(0,cx*cx+cy*cy-0.3)*1.1;
    if (r===RG.path){ v+=(y-pathTop(x))/36*0.2; }
    if (r===RG.tree) v-=0.4;
    if (dusk) v-=0.35;
    return v; },0,0); }

// ---------------------------------------------------------------- Bild
var SEAPX=null, LAST=null;
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS); REG.fill(0);
  skyPaint(b,tod,weather); farPaint(b,tod); seaPaint(b,tod);
  landPaint(b); pinesPaint(b,tod,false);                      // die Pinien stehen auf der Wiese vor der Mauer
  pavilionPaint(b,tod); memorialPaint(b); lampPaint(b,false); benchPaint(b);
  shadePass(b,tod);
  var base=b.clone();
  M.finishTOD(b,tod,{ sky:function(x,y){ var r=REG[y*W+x]; return r===RG.sky||r===RG.far||r===RG.sea; } });
  if (tod!=='day' && M.TINT[tod]){ warmPass(b,base,tod); lampPaint(b,true); }
  SEAPX=[]; for (var y=HZ;y<104;y++) for (var x=0;x<W;x++) if (REG[y*W+x]===RG.sea && !(y<72&&x<=BEACON.x+2&&y>=BEACON.y-1&&x>=BEACON.x-2)) SEAPX.push(y*W+x);
  LAST=b; return b; }

// ---------------------------------------------------------------- Ebenen: die große Pinie vorn links
function layers(S,GS,tod){ var l=M.layer(0,0,110,H,143), w=M.lw(l), G=R('g0 g1 g2 g3 g4'), TR=R('w0 w1 t1'), p=PINES[0];
  var tmp={px:function(x,y,c){ w.px(x,y,c); },line:function(a,b2,c2,d,c){ w.line(a,b2,c2,d,c); }};
  trunk(tmp,p,TR); var c=p.cr; for (var k=0;k<3;k++) w.line(rnd(p.x1),rnd(p.y1+8),rnd(c[0]+(k-1)*c[2]*0.55),rnd(c[1]+c[3]*0.4),TR[1]);
  pineCrown(tmp,c[0],c[1],c[2],c[3],40,G,tod==='dusk'?1:-1); pineCrown(tmp,c[0]+c[2]*0.45,c[1]+c[3]*0.5,c[2]*0.45,c[3]*0.6,47,G,1); pineCrown(tmp,c[0]-c[2]*0.5,c[1]+c[3]*0.35,c[2]*0.4,c[3]*0.55,53,G,1);
  for (var g=0;g<26;g++){ var gx=rnd(30+hash(g,1)*30), gy=140+rnd(hash(g,2)*4); w.px(gx,gy,hash(g,3)<0.5?P.g2:P.g3); w.px(gx,gy-1,P.g3); }   // Gras am Stammfuß
  M.light(l,function(x,y){ return -0.6+(y<30?-0.2:0); },0,0);
  if (tod!=='day' && M.TINT[tod]) M.tintApply(l,M.TINT[tod]);
  return [l]; }

// ---------------------------------------------------------------- jedes Bild: Meer, Lichter im Wasser, Leuchtfeuer, Sterne, Bura-Schaum
function dynamic(fb,v,S,GS){ var t=v.t, tod=v.tod, weather=M.scn.weather(GS), ramp=seaR(tod), bura=weather==='bura';
  if (SEAPX){ for (var i=0;i<SEAPX.length;i++){ var k=SEAPX[i], x=k%W, y=(k/W)|0; fb.d[k]=M.rampAt(ramp,seaV(x,y,t,bura),x,y); } }
  // Bura: Schaumkronen, die aufs offene Meer hinausziehen
  if (bura){ for (var j=0;j<70;j++){ var per=2+hash(j,3)*2.5, ph=((t+hash(j,4)*per)%per)/per, yy=HZ+3+Math.floor(Math.pow(hash(j,5),0.8)*38), sp=0.4+(yy-HZ)/44, xx=Math.floor((hash(j,6)*W+t*14*sp)%(W+20))-10, len=1+Math.floor(sp*3*(1-Math.abs(ph-0.5)*2));
      if (ph>0.85) continue; for (var q=0;q<len;q++){ var px=xx+q; if (px<0||px>=W) continue; var kk=yy*W+px; if (REG[kk]===RG.sea) fb.d[kk]=(q===0||ph>0.6)?(tod==='night'?P.n3:P.s4):(tod==='night'?P.n4:P.s5); } } }
  if (tod!=='day'){ var night=tod==='night';
    // Lichter der Stadt spiegeln sich
    [[20,0.7],[38,1],[56,0.8],[78,1],[96,0.6],[124,0.7]].forEach(function(g,i){ M.glints(fb,g[0],HZ+1,HZ+16+i%3*3,3*g[1],t+i,i%2?P.y3:P.y4,v.cam); });
    // grünes Leuchtfeuer: blinkt alle drei Sekunden
    var on=(t%3)<1.2; fb.px(BEACON.x,BEACON.y-1,on?P.g5:P.g2); if (on){ fb.px(BEACON.x-1,BEACON.y-1,P.g4); fb.px(BEACON.x+1,BEACON.y-1,P.g4); M.glints(fb,BEACON.x,70,84,2,t,P.g4,v.cam); }
    // Mondweg (windstill)
    if (night && !bura && weather!=='rain'){ glitter(fb,MOON[0],HZ+1,100,2,14,t,P.n5,P.n4); glitter(fb,MOON[0]+3,HZ+6,100,1,9,t*1.3+2,P.n4,P.n3); }
    if (tod==='dusk' && weather!=='rain') glitter(fb,262,HZ+1,96,2,10,t,P.d6,P.d5);
    // Sterne funkeln
    if (night && weather!=='rain') for (var s2=0;s2<14;s2++){ var sx=rnd(hash(s2,71)*W), sy=rnd(hash(s2,72)*40); if (REG[sy*W+sx]===RG.sky && Math.sin(t*2.3+s2*1.7)>0.6) fb.px(sx,sy,P.n5); }
    M.glow(fb,LAMP.x-v.cam,LAMP.by-LAMP.h+3,9,t,0.4); } }
// Glitzerweg unter Mond oder Abendhimmel: kurze waagrechte Striche, nach vorn breiter
function glitter(fb,cx,y0,y1,w0,w1,t,c1,c2){ for (var y=y0;y<y1;y++){ var k=(y-y0)/(y1-y0), half=w0+(w1-w0)*k, n=Math.floor(1+half*0.5);
  for (var i=0;i<n;i++){ var sd=y*31+i*7, ph=t*(0.8+hash(sd,1)*1.4)+hash(sd,2)*6.28; if (Math.sin(ph)<0.35) continue; var x=Math.round(cx+(hash(sd,3)-0.5)*2*half+Math.sin(t*0.7+y)*1.5), L=1+Math.floor(hash(sd,4)*2.5*(0.4+k));
    for (var q=0;q<L;q++){ var px=x+q, kk=y*W+px; if (px>=0&&px<W&&REG[kk]===RG.sea) fb.d[kk]=(q===0&&L>1)?c2:c1; } } } }
function front(fb,v,S,GS){ var w=M.scn.weather(GS); if (w==='bura') M.scn.buraDebris(fb,v.t,110,142,v.cam); if (w==='rain') M.rain(fb,v.t,{n:80}); }

// ---------------------------------------------------------------- Geisterebene: der alte Friedhof
// Die Formen werden einmal in eine Maske gemalt (1 Füllung, 2 Umriss, 3 Gravur) und je Bild schimmernd eingefärbt.
// Wo schon eine Figur oder eine Vordergrund-Ebene steht, wird nur gemalt, wenn das Grab davor liegt.
var GM=null, GB=null, GMOTE=[], GLAMP=[], GPX=null, GHALO=null, GFOG=null;
function gravesBuild(){ GM=new Uint8Array(W*H); GB=new Uint8Array(W*H);
  var tmp=new M.Buf(W,H,0);
  function put(x,y,v,base){ x=rnd(x); y=rnd(y); if (x<0||y<0||x>=W||y>=H) return; var k=y*W+x; if (v>=2||GM[k]===0){ GM[k]=v; GB[k]=base; } }
  function shape(polys,base){ tmp.d.fill(0); polys.forEach(function(pts){ tmp.poly(pts,1); });
    for (var y=1;y<H-1;y++) for (var x=1;x<W-1;x++){ var k=y*W+x; if (!tmp.d[k]) continue; var edge=!tmp.d[k-1]||!tmp.d[k+1]||!tmp.d[k-W]||!tmp.d[k+W]; put(x,y,edge?2:1,base); } }
  function rot(pts,cx,cy,a){ if (!a) return pts; var s2=Math.sin(a), c=Math.cos(a); return pts.map(function(p){ var dx=p[0]-cx, dy=p[1]-cy; return [cx+dx*c-dy*s2, cy+dx*s2+dy*c]; }); }
  function rect(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]; }
  function cross(x,base,h,a){ var w=Math.max(2.4,h/5.5), arm=h*0.64, ay=base-h+h*0.27;
    shape([rot(rect(x-w/2,base-h,x+w/2,base),x,base,a),rot(rect(x-arm/2,ay,x+arm/2,ay+w),x,base,a),rect(x-w*1.5,base-2.5,x+w*1.5,base)],base); }
  function stone(x,base,h,a,lamp){ var w=h*0.68, pts=[[x-w/2,base]]; for (var i=0;i<=12;i++){ var an=Math.PI-i/12*Math.PI; pts.push([x+Math.cos(an)*w/2,base-h+w/2-Math.sin(an)*w/2]); } pts.push([x+w/2,base]);
    shape([rot(pts,x,base,a),rect(x-w/2-2,base-2.5,x+w/2+2,base)],base);
    var c=rot([[x,base-h*0.66]],x,base,a)[0]; for (var q=-2;q<=2;q++) put(c[0],c[1]+q,3,base); put(c[0]-1,c[1]-1,3,base); put(c[0]+1,c[1]-1,3,base);
    for (var l=0;l<2;l++){ var ly=base-h*0.36+l*2.2; for (var q2=-w/2+2;q2<w/2-1.5;q2++) if (hash(q2+x,l)<0.75){ var r2=rot([[x+q2,ly]],x,base,a)[0]; put(r2[0],r2[1],3,base); } }
    if (lamp) GLAMP.push([x+w/2+1,base-3]); }
  function obelisk(x,base,h){ var w=Math.max(3.5,h/4.5); shape([rect(x-w/2-2,base-3.5,x+w/2+2,base),[[x-w/2,base-3.5],[x+w/2,base-3.5],[x+w/3,base-h+3],[x,base-h],[x-w/3,base-h+3]]],base); }
  function slab(x0,x1,base,hs){ shape([[[x0,base],[x1,base],[x1-4,base-5],[x0+4,base-5]]],base); for (var q=x0+5;q<x1-5;q+=2) put(q,base-2,3,base); stone((x0+x1)/2,base-5,hs,0,true); }
  function iron(x,base,h){ cross(x,base,h,0); var cy=base-h+h*0.27+1.2; for (var a=0;a<20;a++){ var an=a/20*Math.PI*2; put(x+Math.cos(an)*h*0.24,cy+Math.sin(an)*h*0.24,2,base); } }
  function chapel(x0,x1,base,top){ var mx=(x0+x1)/2, eave=top+15;
    shape([[[x0,base],[x1,base],[x1,eave],[mx,top],[x0,eave]],rect(mx-4,top-9,mx+4,top+3),rect(x0-2,base-3,x1+2,base)],base);
    for (var y=base-18;y<base-3;y++) for (var x=mx-5;x<=mx+5;x++){ var dx=(x-mx)/5.5, yt=base-18+(1-Math.sqrt(Math.max(0,1-dx*dx)))*5; if (y>=yt) GM[y*W+rnd(x)]=0; }
    for (var x2=mx-6;x2<=mx+6;x2++){ var dd=(x2-mx)/6.5, yt2=base-19+(1-Math.sqrt(Math.max(0,1-dd*dd)))*5; put(x2,yt2,2,base); } for (var y3=base-15;y3<base-3;y3++){ put(mx-6,y3,2,base); put(mx+6,y3,2,base); }
    for (var a=0;a<14;a++){ var an=a/14*Math.PI*2; put(mx+Math.cos(an)*3,eave+2+Math.sin(an)*3,3,base); } put(mx,eave+2,3,base);
    [x0+5,x1-6].forEach(function(wx){ for (var y4=base-20;y4<base-10;y4++){ put(wx,y4,3,base); put(wx+1,y4,3,base); } put(wx,base-21,3,base); });
    for (var y5=eave;y5<base-3;y5+=4){ put(x0+1,y5,3,base); put(x1-1,y5,3,base); }
    for (var a2=0;a2<9;a2++){ var an2=Math.PI+a2/8*Math.PI; put(mx+Math.cos(an2)*2.2,top-4+Math.sin(an2)*2.2,3,base); }
    for (var q=0;q<7;q++) put(mx,top-16+q,2,base); put(mx-2,top-13,2,base); put(mx-1,top-13,2,base); put(mx+1,top-13,2,base); put(mx+2,top-13,2,base);
    GLAMP.push([mx-9,base-4]); }
  // hintere Reihe, zwischen den Pinien an der Mauer; die Kapelle hinter der Bank
  chapel(160,208,101,60);
  cross(18,100,13,0.06); stone(58,100,11,0,true); cross(72,99,12,-0.1); cross(222,99,13,0); stone(312,99,10,0.12);
  // mittlere Reihe, am Weg und zum Teil darauf
  stone(16,116,14,-0.05); cross(62,118,19,0.12); slab(90,122,119,13); iron(192,115,18); stone(232,117,14,-0.1); cross(262,114,16,0); stone(300,116,13,0.08);
  // vordere Reihe, mitten auf dem Weg
  cross(30,141,25,-0.07); stone(108,138,21,0.05,true); cross(166,142,27,0.16); stone(228,137,18,-0.06,true); cross(286,141,23,0);
  for (var i=0;i<28;i++) GMOTE.push([hash(i,91)*W,96+hash(i,92)*44,hash(i,93)*6.28]);
  // einmal vorberechnen: Grabpixel (mit Kantenrichtung), Schein, Nebelrauschen
  GPX=[]; GHALO=[];
  for (var k=W*2+2;k<W*H-W*2-2;k++){ var m=GM[k];
    if (m){ var e=0; if (m===2){ var tl=!GM[k-W]||!GM[k-1], br=!GM[k+W]||!GM[k+1]; e=(tl&&!br)?1:((br&&!tl)?2:0); } GPX.push(k,m,GB[k],e); continue; }
    var nb=GM[k-1]===2||GM[k+1]===2||GM[k-W]===2||GM[k+W]===2, nb2=!nb&&(GM[k-2]===2||GM[k+2]===2||GM[k-W*2]===2||GM[k+W*2]===2); if (!nb&&!nb2) continue;
    var bs=GB[k-1]||GB[k+1]||GB[k-W]||GB[k+W]||GB[k-2]||GB[k+2]||GB[k-W*2]||GB[k+W*2]; if (bayer(k%W,(k/W)|0)<(nb?0.5:0.22)) GHALO.push(k,nb?1:2,bs); }
  GFOG=new Float32Array(640*50); for (var fy=0;fy<50;fy++) for (var fx=0;fx<640;fx++) GFOG[fy*640+fx]=fbm(fx,(fy+94)*3,16,5); }
function ghost(fb,v,S,GS){ if (!GM) gravesBuild(); var t=v.t, bg=LAST, G=M.TINT.ghost, cam=v.cam;
  var acts=[]; if (M.ACT && M.E && M.E.actorShown) Object.keys(M.ACT).forEach(function(k){ var a=M.ACT[k]; if (M.E.actorShown(a)) acts.push(a); });
  function plain(k,x,y){ return !bg || fb.d[k]===M.tintPx(G,bg.d[k],x,y); }
  function inFront(x,y,base){ var k=y*W+x; if (plain(k,x,y)) return true;
    for (var i=0;i<acts.length;i++){ var a=acts[i], ax=a.x-cam; if (x>ax-11&&x<ax+11&&y>a.y-52&&y<=a.y+1) return base>a.y+1; }
    return false; }
  // Bodennebel über den alten Grabreihen
  var rows=[100,117,139];
  for (var y=94;y<H;y++){ var md=9; for (var q=0;q<3;q++) md=Math.min(md,Math.abs(y-rows[q]+1)); if (md>3) continue;
    var off=Math.floor(t*3)%320, fr=(y-94)*640; for (var x=0;x<W;x++){ var n=GFOG[fr+x+off]; if (n<0.5||bayer(x,y)>(n-0.5)*1.5*(1-md/4)) continue; var k=y*W+x; if (!plain(k,x,y)) continue; fb.d[k]=n>0.64?P.x2:P.x1; } }
  // Schein um die Umrisse
  for (var h=0;h<GHALO.length;h+=3){ var k3=GHALO[h]; if (inFront(k3%W,(k3/W)|0,GHALO[h+2])) fb.d[k3]=GHALO[h+1]===1?P.x2:P.x1; }
  // Gräber, Kreuze, Kapelle: oben links heller Rand, unten rechts dunkler, innen durchscheinend
  for (var g=0;g<GPX.length;g+=4){ var k2=GPX[g], m=GPX[g+1], base=GPX[g+2], x2=k2%W, y2=(k2/W)|0; if (!inFront(x2,y2,base)) continue;
    var wave=Math.sin(t*1.2+x2*0.045-y2*0.03)+Math.sin(t*0.7-x2*0.02);
    if (m===2){ var e=GPX[g+3]; fb.d[k2]=e===1?(wave>-0.4?P.x6:P.x5):(e===2?P.x4:(wave>0.8?P.x6:P.x5)); }
    else if (m===3) fb.d[k2]=wave>0.4?P.x4:P.x3;
    else { var dn=0.46+wave*0.08; if (bayer(x2,y2)<dn) fb.d[k2]=(bayer(x2+2,y2+1)<0.32)?P.x3:P.x2; } }
  // Grablichter flackern
  GLAMP.forEach(function(l,i){ var x=rnd(l[0]), y=rnd(l[1]), f=Math.sin(t*9+i*2)+Math.sin(t*23+i)*0.5; if (!inFront(x,y,y+3)) return;
    fb.px(x,y,P.x4); fb.px(x+1,y,P.x4); fb.px(x,y-1,f>-0.6?P.x6:P.x5); fb.px(x+1,y-1,P.x5); fb.px(x,y-2,P.x4); fb.px(x+1,y-2,P.x4); if (f>0.2){ fb.px(x,y-3,P.x5); } });
  // Jakovs alter Weg zwischen den Gräbern: zwei Reihen Kantsteine
  for (var x4=84;x4<238;x4+=3){ [123,129].forEach(function(yy,i){ var y4=rnd(yy+Math.sin(x4*0.04)*1.5); if (inFront(x4,y4,yy+1)) fb.px(x4,y4,(x4+i)%2?P.x3:P.x2); }); }
  // aufsteigende Lichtpunkte
  GMOTE.forEach(function(m2,i){ var mx=rnd(m2[0]+Math.sin(t*0.5+m2[2])*4), my=rnd(m2[1]-((t*3+i*7)%40)); if (mx<0||mx>=W||my<0||my>=H) return; if (Math.sin(t*1.7+i)>-0.2 && inFront(mx,my,255)) fb.px(mx,my,(i%3)?P.x4:P.x6); }); }

// ---------------------------------------------------------------- Raum
M.defineArt('sustipan',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, front:front, ghost:ghost, actorLut:actorLut,
  walk:function(x,y,S,GS){ if (x<=6||x>=306||y>=139) return false; if (y<pathTop(x)+2) return false; if (x>228&&x<312&&y<113) return false; if (x>34&&x<60&&y>134) return false; return true; },
  walkG:function(){ return false; },
  spots:{ exit:[0,60,14,84], pines:[104,0,150,34], pavilion:[230,18,80,94], plaque:[93,75,54,34], bench:[166,88,40,18], sea:[150,63,80,26],
    lighthouse:[99,55,13,14], city:[0,34,98,28], wall:[0,88,230,13], graves:[0,44,320,100] },
  stands:{ exit:[10,124,'L'], pines:[150,113,'B'], pavilion:[270,118,'B'], plaque:[120,114,'B'], bench:[186,112,'B'], sea:[190,112,'B'],
    lighthouse:[104,113,'B'], city:[62,113,'B'], wall:[214,112,'B'], graves:[130,124,'B'] },
  actorPos:{ jakov:[150,120,'L','jakov',true,'sweep'] },
  start:[72,124,'R'], entries:{ map:[14,124,'R'] }
});
})(M);
