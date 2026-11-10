/* ===== rooms/art/partizan.js — Partisanenfriedhof am Westhang (400 px, scrollend) =====
   Das Gedenkareal von Bogdan Bogdanović (1965), verwildert: Terrassen und Wege aus Kalksteinplatten, Gras in den Fugen,
   zerbrochene und verschobene Platten, gekrümmte Mauern aus unregelmäßigen Steinen, darauf Steinblüten (hohe, gelappte
   Steinzungen, ohne Inschriften und Zeichen), eine zerbrochen am Boden. Links die gekrümmte Mauer der oberen Terrasse mit
   Treppe und einem kahlen Baum, rechts die Kante, an der der Hang abfällt (dort steht Mala). Dahinter der weite Blick nach
   Süden: die Stadt beiderseits der grünen Neretva, die Alte Brücke klein, am Westufer der Glockenturm (ohne Kreuz) und zwei
   Kräne, am Ostufer das Hochhaus, darüber der kahle Velež, rechts der Hum (ohne Kreuz), ganz hinten die Flussebene im Süden.
   Bura: das trockene Gras liegt flach, Wolkenfetzen; Regen: alles nass, die Ferne verschwindet; grau: flaches Licht. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, HZ=50;
var EDGE=108;                                                  // hintere Kante der Terrasse (dahinter fällt der Hang ab)
var WALLC={x1:150};                                            // gekrümmte Mauer der oberen Terrasse (links)
var STAIR={x0:118,x1:146};
var BLOOMS=[{x:170,by:111,h:38,k:0},{x:198,by:110,h:30,k:1},{x:226,by:111,h:35,k:2},{x:250,by:111,h:13,k:0,broken:1}];  // Steinblüten auf der Terrasse
var UPB=[{x:22,by:70,h:20,k:1},{x:46,by:74,h:24,k:0},{x:72,by:80,h:18,k:2},{x:94,by:86,h:15,k:1}];                       // auf der oberen Terrasse
var LOWB=[{x:262,by:101,h:10,k:0},{x:296,by:100,h:11,k:1},{x:323,by:101,h:9,k:2},{x:378,by:99,h:10,k:1}];
var BENCH={x0:276,x1:314,seat:104,by:113};
var FRONTB={x:58,by:143,h:30,k:2};                             // eine Steinblüte vorn (Ebene)
var TREE={x:38,by:66};
var TOWER={x:172,base:92,top:36}, CRANES=[{x:232,base:95,top:58,j0:-11,j1:28},{x:266,base:92,top:60,j0:-26,j1:9}], RAZ={x0:56,x1:64,side:3,base:72,top:46};

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
var HZL={}, HZN=null;
function hazeLut(col,k){ var key=col+'_'+k; if (HZL[key]) return HZL[key]; if (!HZN) HZN=M.PNAME.filter(function(n){ return !/^[vxdpqhl]/.test(n); }); var q=M.RGB[col], f=k/8;
  return HZL[key]=M.tintIn(function(r,g,b){ return [r+(q[0]-r)*f, g+(q[1]-g)*f, b+(q[2]-b)*f]; },HZN); }
function haze(b,amt,col){ for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=hazeLut(col,i)[c]; } }
var DEP=new Uint8Array(W*H), REG=new Uint8Array(W*H), RG={sky:0,mtn:1,town:2,water:3,land:4,wall:5,terr:6,stone:7,plant:8};
function RW(b){ var o={d:0,g:0};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; DEP[k]=o.d; REG[k]=o.g; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.w=W; o.h=H; return o; }

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod,we){ var x, y, h=HZ+30;
  if (we==='grey' && tod==='day'){ var GR=R('m2 m3 m4 s4'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(GR,0.28+y/h*0.5+(fbm(x*0.7,y*2.4,30,8)-0.5)*0.35,x,y)); return; }
  if (we==='rain'){ M.scn.sky(b,0,0,W,h,tod,we,61); if (tod==='day'){ var CL=R('m2 m3 s3 m4'); for (y=0;y<HZ+10;y++) for (x=0;x<W;x++){ var f=fbm(x*1.5,y*3.1,28,4); if (f>0.56 && bayer(x,y)<(f-0.56)*4) b.px(x,y,ra(CL,0.3+(f-0.56)*2.5-y/100,x,y)); } } return; }
  if (tod==='day'){ var bura=we==='bura', D=bura?R('b0 b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<h;y++){ var v=(bura?0.05:0.18)+Math.pow(y/(HZ+16),1.3)*(bura?0.86:0.78); for (x=0;x<W;x++) b.px(x,y,ra(D,v+(vn(x,y,50,2)-0.5)*0.05,x,y)); }
    var r=M.rng(bura?73:31);
    if (bura){ for (var i=0;i<10;i++){ var cx=r()*W-20, cy=4+r()*30, L=16+r()*48, th=1.5+r()*3;
        for (var k=0;k<L;k++){ var u=k/L; if (fbm(cx+k*1.3,i*9,6,3)<0.4) continue; var hh=th*Math.sin(u*Math.PI)*(0.45+fbm(k*2+cx,i*3,5,5)), xx=rd(cx+k), yt=rd(cy-hh*0.6+u*2.5), yb2=rd(cy+hh*0.4+u*2.5);
          for (var yy=yt;yy<=yb2;yy++){ var q=(yy-yt)/Math.max(1,yb2-yt); if (q>0.8 && bayer(xx,yy)<0.5) continue; b.px(xx,yy,q<0.4?P.b5:(q<0.75?P.b4:P.b3)); } }
        for (var k3=0;k3<L*0.6;k3++){ var xs=rd(cx+L+k3), ys=rd(cy+2.5+k3*0.06); if (bayer(xs,ys)<0.5*(1-k3/(L*0.6))) b.px(xs,ys,P.b4); } } }
    else { for (var j=0;j<6;j++){ var cx2=r()*W, cy2=6+r()*24, L2=50+r()*90; for (var k2=0;k2<L2;k2++){ var xx2=rd(cx2+k2), yy2=rd(cy2+Math.sin(k2*0.06+j)*1.3+k2*0.02), a=1-Math.abs(k2/L2-0.5)*2; if (bayer(xx2,yy2)<a*0.45) b.px(xx2,yy2,P.b4); if (a>0.6 && bayer(xx2,yy2+1)<a*0.25) b.px(xx2,yy2+1,P.b5); } } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(N,0.08+Math.pow(y/(HZ+14),1.5)*0.8,x,y));
    var r2=M.rng(43); for (var s=0;s<200;s++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.4)*(HZ-6)), q2=r2(); b.px(sx,sy,q2<0.08?P.n5:(q2<0.4?P.n4:P.n3)); } return; }
  M.sky(b,0,0,W,h,tod,19); }

// ---------------------------------------------------------------- Berge: Velež (links), Ebene im Süden, Hum (rechts)
function velY(x){ var p=Math.exp(-Math.pow((x-96)/60,2)), p2=Math.exp(-Math.pow((x-184)/34,2)), p3=Math.exp(-Math.pow((x-20)/30,2)); return HZ+5-34*p-15*p2-14*p3+Math.abs(Math.sin(x*0.17))*-1.5+(vn(x,3,8,4)-0.5)*3.4; }
function farY(x){ return HZ-3+Math.sin(x*0.05+1)*1.4+Math.sin(x*0.17)*0.6; }
function humY(x){ if (x<268) return 999; var t=(x-268)/96; return x<364?22+58*Math.pow(1-t,1.7)+Math.sin(x*0.21)*0.7:22+(x-364)*0.12+Math.sin(x*0.3)*0.5; }
function paintHills(w){ var x, y;
  w.d=1; w.g=RG.mtn;
  for (x=190;x<320;x++){ var fy=rd(farY(x)); for (y=fy;y<=HZ+2;y++) w.px(x,y,(y===fy||bayer(x,y)<0.3)?P.b3:P.b2); }
  var VR=R('m0 m1 s1 m2 s2 s3 s4 s5');
  for (x=0;x<240;x++){ var ty=rd(velY(x)), sl=velY(x+2)-velY(x-2); for (y=ty;y<=HZ+8;y++){ var d=(y-ty)/(HZ+8-ty+1), gul=fbm(x*2.6+y*0.9,y*0.5,8,6), rib=Math.sin(x*0.38+y*0.33+fbm(x,y,12,2)*6);
      var v=0.5+(sl>0?-0.14:0.12)-d*0.2+(gul-0.5)*0.55+rib*0.12; if (rib>0.82) v+=0.18; if (rib<-0.8) v-=0.2; if (y===ty) v=0.9; else if (y===ty+1) v+=0.15;
      var c=ra(VR,v,x,y); if (d>0.7 && fbm(x*2,y*2,5,9)>0.56) c=(hash(x,y)<0.5)?P.e2:P.g2; w.px(x,y,c); } }
  // der Hum: nah, rundlich, Kiefern und Macchia, Felsbänder; ohne Kreuz
  w.d=2;
  for (x=268;x<W;x++){ var hy=rd(humY(x)); for (y=hy;y<HZ+50;y++){ var f=fbm(x*1.2,y*1.5,8,12), pine=fbm(x*2.4,y*2.6,5,17)>0.56;
      var c2=pine?ra(R('g0 g1 g2'),0.3+f*0.6,x,y):ra(R('g1 e1 g2 e2 g3 e3'),0.35+f*0.55-(y-hy)*0.003,x,y); if (y===hy) c2=P.g3; if (fbm(x*3,y*3,3,21)>0.73) c2=(y%2)?P.s3:P.e3; w.px(x,y,c2); } } }

// ---------------------------------------------------------------- Fluss (von links heran, nach rechts in die Ferne)
var RVP=[[0,92,6],[150,82,4.2],[250,69,2.6],[330,57,1.1],[420,55,0.8]];
function rvAt(x,i){ for (var k=0;k<RVP.length-1;k++){ var a=RVP[k], b=RVP[k+1]; if (x<=b[0]){ var t=cl((x-a[0])/(b[0]-a[0]),0,1); t=t*t*(3-2*t); return lerp(a[i],b[i],t); } } return RVP[RVP.length-1][i]; }
function riverY(x){ return rvAt(x,1)+Math.sin(x*0.04)*1.2; }
function riverH(x){ return rvAt(x,2); }
function inRiver(x,y,m){ return Math.abs(y+0.5-riverY(x))<=riverH(x)+(m||0); }

// ---------------------------------------------------------------- Häuser (wie vom Minarett, nur ferner)
var LIT=[];
function slabRoof(w,x0,x1,ey,rh,sd){ var ins=Math.max(1,rd(rh*0.85));
  for (var y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t));
    for (var x=xa;x<=xb;x++){ var c=(x<xa+1)?P.m4:((x>xb-1)?P.m2:(hash(x>>1,y+sd)<0.25?P.s3:P.m3)); if (y===ey) c=P.s1; w.px(x,y,c); } } }
function tileRoof(w,x0,x1,ey,rh,sd){ var ins=Math.max(1,rd(rh*0.8));
  for (var y=ey-rh;y<=ey;y++){ var t=(y-(ey-rh))/Math.max(1,rh), xa=rd(lerp(x0+ins,x0,t)), xb=rd(lerp(x1-ins,x1,t));
    for (var x=xa;x<=xb;x++){ var c=((x+sd)%3===0)?P.t2:(hash(sd,1)<0.4?P.t2:P.t3); if (hash(sd,6)<0.3) c=(c===P.t3)?P.s2:P.m2; if (x<xa+1) c=P.t4; if (x>xb-1) c=P.t1; if (y===ey) c=P.t1; w.px(x,y,c); } } }
var WCOL=[R('s3 s4 s5'),R('e3 e4 s5'),R('t3 t4 t5'),R('m2 m3 m4'),R('s4 s5 s6'),R('y2 y3 y4')];
function house(w,x0,x1,yb,wh,rh,sd,east,flat){ var x, y, wc=east?R('s4 s5 s6'):WCOL[Math.floor(hash(sd,5)*WCOL.length)];
  for (y=yb-wh;y<yb;y++) for (x=x0;x<=x1;x++){ var c=wc[1]; if (x===x0) c=wc[2]; if (x===x1) c=wc[0]; w.px(x,y,c); }
  for (y=yb-wh+1;y<yb-1;y+=2) for (x=x0+1;x<x1;x+=2){ if (hash(x,y*sd)<0.25) continue; w.px(x,y,P.k2); LIT.push([x,y]); }
  if (flat){ w.hl(x0,x1,yb-wh-1,P.s2); w.hl(x0,x1,yb-wh-2,P.m4); } else if (east) slabRoof(w,x0-1,x1+1,yb-wh-1,rh,sd); else tileRoof(w,x0-1,x1+1,yb-wh-1,rh,sd); }
function tree(w,x,yb,h,sd){ var r=M.rng(sd*13+5); if (hash(sd,2)<0.4){ for (var y=yb-h;y<yb;y++){ var t=(yb-y)/h, hw=Math.max(0,rd(Math.sin(Math.min(1,t*1.3)*Math.PI*0.5)*h*0.13)); for (var i=-hw;i<=hw;i++) w.px(x+i,y,i<0?P.g2:(i>0?P.g0:P.g1)); } return; }
  w.vl(x,yb-rd(h*0.45),yb,P.e1); for (var k=0;k<5;k++){ var a=-Math.PI/2+(r()-0.5)*1.9, L=h*(0.3+r()*0.4), bx=x, by=yb-h*0.4; for (var q=0;q<L;q++){ bx+=Math.cos(a)*0.9; by+=Math.sin(a)*0.9; w.px(rd(bx),rd(by),P.e2); } } }

// ---------------------------------------------------------------- Landmarken (vom Westhang gesehen)
function belltower(w){ var x=TOWER.x, by=TOWER.base, top=TOWER.top, y, i, tw=3, hb=top+12;
  tileRoof(w,x-1,x+20,by-1,5,3); w.rect(x,by-1,20,2,P.s4);
  for (y=hb;y<by;y++) for (i=-tw;i<=tw;i++){ var c=i<-1?P.s4:(i<1?P.s5:(i<tw?P.s5:P.s6)); if ((y-hb)%9===0) c=P.s3; w.px(x+i,y,c); }
  for (y=hb+18;y<by-3;y+=8){ w.px(x,y,P.k2); w.px(x+1,y,P.k2); w.px(x,y+1,P.k2); }
  w.hl(x-tw-1,x+tw+1,hb,P.s6); w.hl(x-tw-1,x+tw+1,hb+1,P.s3);
  for (y=hb+2;y<hb+10;y++){ w.px(x-tw,y,P.s4); w.px(x+tw,y,P.s6); for (i=-tw+1;i<tw;i++) w.px(x+i,y,(i===0)?P.s5:((y<hb+3)?P.k2:P.k1)); }
  w.px(x-1,hb+6,P.y1); w.px(x+1,hb+6,P.y1);
  w.hl(x-tw-1,x+tw+1,hb+10,P.s6); w.hl(x-tw,x+tw,hb+11,P.s3); w.rect(x-1,hb+13,3,3,P.s6); w.px(x,hb+14,P.k2);
  for (y=top;y<hb;y++){ var hw=Math.floor((y-top)/3.2); for (i=-hw;i<=hw;i++) w.px(x+i,y,i<0?P.m1:(i>0?P.m3:P.m2)); } w.px(x,top-1,P.m2); }
function crane(w,c){ var x=c.x, top=c.top, by=c.base, y, i, Y=[P.y2,P.y3,P.y4];
  for (y=top+3;y<by;y++){ w.px(x-1,y,Y[2]); w.px(x+1,y,Y[0]); if ((y+x)%3===0) w.px(x,y,Y[1]); }
  w.rect(x-2,top+1,5,3,Y[1]); w.px(x+2,top+2,P.s6); w.vl(x,top-4,top,Y[1]); var jy=top+1;
  for (i=c.j0;i<=c.j1;i++){ w.px(x+i,jy,(i%2)?Y[2]:Y[1]); if (i%3===0) w.px(x+i,jy+1,Y[0]); }
  w.line(x,top-4,x+c.j1,jy,Y[0]); w.line(x,top-4,x+c.j0,jy,Y[0]);
  var bx=c.j0<-20?x+c.j1-3:x+c.j0; w.rect(bx,jy+1,4,3,P.m2);
  var hx=c.j1>20?x+c.j1-6:x+c.j0+7; w.vl(hx,jy+1,jy+10,P.k2); w.rect(hx-1,jy+11,3,2,P.r2);
  for (y=by-7;y<by;y++) for (var xx=x-7;xx<x+9;xx++) w.px(xx,y,((y-(by-7))%3===0)?P.s4:(((xx-x)%4===0)?P.m3:P.k2)); }
function razvitak(w){ var o=RAZ; for (var y=o.top;y<o.base;y++){ for (var x=o.x0;x<o.x1;x++){ var fy=(y-o.top)%3, c=fy===1?(((x-o.x0)%3===2)?P.s4:P.n1):P.s4; if (x===o.x0) c=P.s5; w.px(x,y,c); if (fy===1) LIT.push([x,y]); }
    for (var x2=o.x1;x2<o.x1+o.side;x2++) w.px(x2,y,((y-o.top)%3===1)?P.k2:P.m2); } w.hl(o.x0,o.x1+o.side-1,o.top,P.s6); w.vl(o.x0+4,o.top-5,o.top-1,P.m1); }

// ---------------------------------------------------------------- Stadt im Tal: Reihen von hinten nach vorn
function paintCity(w,we){ var yb, x;
  var marks=[{y:TOWER.base,f:function(){ belltower(w); }},{y:CRANES[0].base,f:function(){ crane(w,CRANES[0]); }},{y:CRANES[1].base,f:function(){ crane(w,CRANES[1]); }},{y:RAZ.base,f:function(){ razvitak(w); }},
    {y:76,f:function(){ M.scn.minaret(w,88,76,15,{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')}); M.scn.minaret(w,121,70,12,{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')}); }},
    {y:84,f:function(){ oldBridge(w); }}];
  marks.sort(function(a,b){ return a.y-b.y; }); var mi=0;
  for (yb=HZ+3;yb<=EDGE+2;){ while (mi<marks.length && marks[mi].y<=yb){ w.d=2; w.g=RG.town; marks[mi].f(); mi++; }
    var s=(yb-HZ)/(EDGE-HZ), sc=0.3+s*1.4; w.d=yb<64?2:3; w.g=RG.town;
    x=Math.floor(hash(yb,1)*5)-3;
    while (x<W){ var bw=Math.max(2,rd((3+hash(x,yb)*6)*sc)), wh=Math.max(1,rd((1.5+hash(yb,x)*4)*sc)), rh=Math.max(1,rd(bw*0.3)), xc=x+bw/2, east=yb<riverY(xc);
      var onHum=(xc>268 && yb<humY(xc)+3), onVel=(yb<velY(xc)+6 && xc<240);
      var quay=(yb>riverY(xc) && yb<riverY(xc)+riverH(xc)+4+bw*0.6);
      if (!inRiver(xc,yb,1+bw*0.1) && !quay && !onHum && !(onVel && yb<HZ+6)){ var sd=Math.floor(hash(x*3,yb*7)*997);
        if (hash(x*0.7,yb*1.3)<0.12) tree(w,rd(xc),yb,rd(3+sc*4),sd);
        else house(w,x,x+bw,yb,rd(wh*(east?1:(yb<80?1.6:1.2))),rh,sd,east,!east && hash(sd,4)<0.45); }
      x+=bw+(hash(x,yb*5)<0.3?1:0)+1; }
    yb+=Math.max(1,rd(s*2.6)); }
  while (mi<marks.length){ marks[mi].f(); mi++; } }
function oldBridge(w){ var cx=141, y0=riverY(cx); for (var x=cx-5;x<=cx+5;x++){ var u=(x-cx)/5, top=rd(y0-3.5+u*u*1.2); w.px(x,top,P.s6); w.px(x,top+1,P.s4); if (Math.abs(u)<0.75) w.px(x,top+2,P.k2); else w.px(x,top+2,P.s3); }
  w.rect(cx-8,rd(y0)-6,3,5,P.s4); w.px(cx-8,rd(y0)-7,P.m2); w.rect(cx+6,rd(y0)-6,3,5,P.s5); w.px(cx+7,rd(y0)-7,P.m2); }
function paintRiver(w,we){ var rain=we==='rain', x, y;
  for (x=0;x<W;x++){ var ry=riverY(x), rh=riverH(x); for (y=Math.floor(ry-rh-2);y<=Math.ceil(ry+rh+2);y++){ var d=Math.abs(y+0.5-ry);
      if (d<=rh){ w.d=x<200?2:1; w.g=RG.water; var c=rain?ra(R('e1 e2 e3 s2'),0.5+(fbm(x*0.4,y*2,6,3)-0.5)*0.5,x,y):ra(R('a2 g3 a3 a4'),0.6-(d/rh)*0.3+(fbm(x*0.3,y*3,8,3)-0.5)*0.15,x,y); if (Math.sin(x*0.45+y*2.5)>0.96 && d<rh*0.6) c=rain?P.s3:P.a5; w.px(x,y,c); }
      else if (d<=rh+1.6){ w.d=2; w.g=RG.land; w.px(x,y,y<ry?P.s3:P.s5); } }
    // Uferstraße mit Bäumen am nahen Ufer
    var qy=rd(ry+rh+2); w.d=2; w.g=RG.land; w.px(x,qy,P.m3); w.px(x,qy+1,P.s2); if (hash(x,7)<0.18){ w.px(x,qy-1,P.g2); w.px(x,qy-2,P.g1); } } }

// ---------------------------------------------------------------- das Gedenkareal: Steine, Mauern, Platten, Blüten
// Mauerwerk: behauene Kalksteine in leicht gekrümmten Lagen (Bogdanović), Fugen dunkel, Moos
function courses(x,y,lay,sd,wet){ var row=Math.floor(lay/4.2), fv=lay-row*4.2, bw=7+hash(row,sd)*6, u=x+hash(row,sd+1)*bw, col=Math.floor(u/bw), fu=u-col*bw;
  if (fv<1||fu<1) return (hash(col,row)<0.25)?(wet?P.g1:P.g2):(wet?P.k2:P.s0); var t=hash(col*7+sd,row), c=t<0.3?P.s1:(t<0.8?P.s2:P.s3); if (fv<2) c=M.UP[c]; if (fu>bw-1.5) c=M.DN[c]; if (hash(x*3,y*5)<0.06) c=(hash(x,y)<0.5)?P.e2:M.DN[c]; if (wet) c=M.DN[c]; return c; }
// große Bodenplatten in Perspektive, unregelmäßig, Gras in den Fugen, manche gebrochen, gekippt oder fehlend
var SLB=null;
function slabAt(x,y){ var d=(y-EDGE+6)/(H-EDGE+6), rh=3+d*8, v=Math.log(1+(y-EDGE)/4)*3.1, row=Math.floor(v), fv=v-row, sw=(12+d*22)*(0.8+hash(row,4)*0.5), u=(x-200)/(0.6+d*0.8)+hash(row,9)*40, col=Math.floor(u/14+hash(row,2)*0.7), fu=u/14+hash(row,2)*0.7-col;
  return {row:row,col:col,fu:fu,fv:fv,d:d}; }
function slabs(x,y,wet,sd){ var q=slabAt(x,y), id=q.col*131+q.row*7, t=hash(id,sd);
  var jw=0.07+0.05*(1-q.d), grassy=hash(id,3)<0.55;
  if (q.fv<jw*1.4 || q.fu<jw) return grassy?(hash(x,y)<0.5?P.g2:P.g3):(wet?P.e0:P.e1);
  if (t<0.07) return (fbm(x,y,3,sd)>0.5)?P.e2:P.g2;                                  // fehlende Platte: Erde und Gras
  var c=t<0.3?P.s2:(t<0.75?P.s3:P.s4); if (hash(id,5)<0.08) c=P.e3;
  if (hash(id,6)<0.14 && q.fv<0.25) c=P.s5;                                         // gekippte Platte, Kante im Licht
  var crack=fbm(x*0.7,y*1.6,6,id%17); if (Math.abs(crack-0.5)<0.014) return wet?P.k2:P.s1;
  if (fbm(x*1.4,y*2.4,4,sd+9)>0.7) c=(hash(x,y)<0.5)?P.e3:P.g4;                       // Flechten
  if (hash(x*3,y*7)<0.04) c=M.DN[c]; if (wet){ c=M.DN[c]; if (fbm(x*0.25,y*0.9,6,sd+21)>0.62) c=(bayer(x,y)<0.5)?P.m3:P.m2; } return c; }
// Steinblüte: Schaft, eine bauchige Knospe, oben in zwei oder drei spitze Blätter geöffnet (oder eine Steinzunge);
// eingemeißelte Blattlinien, grob behauen, im Gegenlicht mit hellem Rand
function bloom(w,o,lit,wet){ var x0=o.x, by=o.by, h=o.h, k=o.k%3, y, x;
  // Bogdanovićs Steinblüten: runde, flache Steinscheiben mit gelapptem Rand und Blütenrillen, hochkant auf einem niedrigen Sockel (k: Zahl der Lappen, k=1 mit Loch in der Mitte)
  var lobes=[8,6,10][k], base=Math.max(2,Math.round(h*0.16)), bw=Math.max(2,Math.round(h*0.2)), r=(h-base)/2, cy=by-base-r, rx=r*[0.94,1,0.9][k], ry=r, boss=[0.3,0.2,0.26][k], hole=k===1;
  var cut=o.broken?cy-r*0.15:-1e9;
  for (y=by-base;y<by;y++) for (x=Math.round(x0-bw);x<=Math.round(x0+bw);x++){ var cb=(x>x0+bw*0.4)?P.s4:((x<x0-bw*0.4)?P.s1:P.s2); if (y===by-base) cb=P.s4; if (!lit) cb=M.DN[cb]; if (wet) cb=M.DN[cb]; w.px(x,y,cb); }
  for (y=Math.floor(cy-ry-2);y<=Math.ceil(cy+ry+1);y++){ if (y<cut+Math.round(Math.sin((o.x+y)*1.3)*1.5)) continue;
    for (x=Math.floor(x0-rx-2);x<=Math.ceil(x0+rx+2);x++){ var dx=(x+0.5-x0)/rx, dy=(y+0.5-cy)/ry, d=Math.hypot(dx,dy), ang=Math.atan2(dy,dx);
      var rim=1-0.09*(0.5+0.5*Math.cos(ang*lobes));
      if (d>rim){ if (d<rim+1.4/r && y>=cut) w.px(x,y,wet?P.k1:P.s0); continue; }
      var e=dx, c=e>0.6?P.s5:(e>0.15?P.s3:(e>-0.5?P.s2:P.s1));
      var a2=((ang/(2*Math.PI))*lobes)%1; if (a2<0) a2+=1; var near=Math.min(a2,1-a2);
      if (near<0.07 && d>boss+0.1 && d<rim-0.08) c=M.DN[c];                                                          // Rillen zwischen den Blättern
      if (d<boss){ c=hole?(wet?P.k1:P.s0):((dx<-0.4*boss)?P.s4:(dx>0.4*boss?P.s1:P.s3)); } else if (d<boss+0.1) c=M.DN[c];   // Mitte: Loch oder Knauf, Ring darum
      if (d>rim-0.09) c=M.DN[c];                                                                                        // Kante der Scheibe
      if (((x+y*2)&3)===0 && e<0.45 && d<rim-0.12) c=M.DN[c];
      if (hash(x*2+o.x,y)<0.05) c=P.e3; if (!lit) c=M.DN[c]; if (wet) c=M.DN[c]; w.px(x,y,c); } }
  if (o.broken){ for (x=Math.floor(x0-rx);x<=x0+rx;x++){ var yb=cut+Math.round(Math.sin((o.x+x)*1.3)*1.5); if (w.get(x,yb+1)!==T) w.px(x,yb,wet?P.s3:P.s5); } }   // Bruchkante hell
  for (x=Math.floor(x0-bw-2);x<=x0+bw+2;x++){ w.px(x,by,P.k2); } }
function wallTop(xx){ return 62+Math.pow(cl(xx/WALLC.x1,0,1),1.6)*42; }
function paintMemorial(w,we,tod){ var x, y, wet=we==='rain', frost=we==='frost';
  // Terrassenfläche aus großen Platten
  w.d=6; w.g=RG.terr;
  for (y=EDGE;y<H;y++) for (x=0;x<W;x++) w.px(x,y,slabs(x,y,wet,3));
  // untere Terrassen hinter der Kante: Mauerkronen mit Gras, sehr kleine Steinblüten, Gebüsch
  w.d=4; w.g=RG.land;
  for (x=WALLC.x1-20;x<W;x++){ var t1=rd(95+Math.sin(x*0.05)*1.5), t2=rd(100+Math.sin(x*0.07+1)*1.2);
    for (y=t1;y<EDGE-5;y++){ var c2=(y<t1+2)?((y===t1)?P.s3:P.s2):(fbm(x*0.8,y,5,12)>0.52?P.e2:P.g2); if (y>=t2 && y<t2+2) c2=(y===t2)?P.s3:P.s1; if (wet) c2=M.DN[c2]; w.px(x,y,c2); } }
  LOWB.forEach(function(o){ w.d=4; w.g=RG.stone; var o2=Object.assign({},o); o2.by=o.by-4; bloom(w,o2,false,wet); });
  // Kante: niedrige Mauer aus behauenen Steinen; rechts bricht sie ab, ein Block ist heruntergefallen
  w.d=6; w.g=RG.wall;
  for (x=WALLC.x1-8;x<W;x++){ if (x>338 && x<362) continue; var top=EDGE-6+((x>330&&x<338)||(x>=362&&x<370)?2:0); for (y=top;y<EDGE+1;y++){ var c=courses(x,y,y-top,11,wet); if (y===top) c=wet?P.s3:P.s5; else if (y===top+1) c=P.s3; w.px(x,y,c); } }
  for (y=EDGE-3;y<EDGE+3;y++) for (x=344;x<356;x++){ var c4=(y===EDGE-3)?P.s4:((x>352)?P.s1:P.s2); if (wet) c4=M.DN[c4]; w.px(x,y+(x>350?1:0),c4); }
  // gekrümmte Mauer der oberen Terrasse links, Lagen folgen dem Bogen; oben Gras und Steinblüten
  for (x=0;x<WALLC.x1;x++){ var wt=rd(wallTop(x)); for (y=wt;y<EDGE;y++){ var lay=(y-wt)*1.0+x*0.04, c3=courses(x,y,lay,5,wet); if (y<wt+2) c3=(y===wt)?(wet?P.s3:P.s5):P.s4; if (y>EDGE-3) c3=M.DN[c3]; w.px(x,y,c3); }
    for (y=wt-4;y<wt;y++) if (fbm(x*0.9,y*2,4,8)>0.45-(wt-y)*0.06) w.px(x,y,(hash(x,y)<0.5)?P.e3:(wet?P.g2:P.e4)); }
  // Treppe hinauf, breite Stufen, Gras in den Fugen
  for (var st=0;st<8;st++){ var sy=EDGE-2-st*4, sx0=STAIR.x0+st*3, sx1=STAIR.x1-st; for (x=sx0;x<sx1;x++){ if (wallTop(x)>sy+3) continue; w.px(x,sy,wet?P.s3:P.s5); w.px(x,sy+1,P.s3); w.px(x,sy+2,P.s1); w.px(x,sy+3,(hash(x,st)<0.3)?P.g2:P.k2); } }
  UPB.forEach(function(o){ var b2=Object.assign({},o); b2.by=rd(wallTop(o.x))+1; w.d=5; w.g=RG.stone; bloom(w,b2,true,wet); });
  w.g=RG.plant; w.d=5; branchTree(w,TREE.x,rd(wallTop(TREE.x))+1,58,4,frost); w.d=4; branchTree(w,392,98,40,9,frost);
  // Gras, Brombeeren, Disteln
  for (var i=0;i<30;i++){ var gx=Math.floor(hash(i,31)*W), gy=EDGE+3+Math.floor(hash(i,32)*32); if (Math.abs(gx-BENCH.x0-18)<22 && gy<BENCH.by+2) continue; tuft(w,gx,gy,4+Math.floor(hash(i,33)*7),we,i); }
  for (x=WALLC.x1-4;x<W;x+=4) if (hash(x,41)<0.5) tuft(w,x,EDGE-6,3+Math.floor(hash(x,42)*4),we,x);
  bramble(w,372,EDGE+2,wet); bramble(w,150,EDGE+3,wet); bramble(w,6,EDGE+5,wet);
  // Steinblüten auf der Terrasse, eine zerbrochen
  BLOOMS.forEach(function(o){ w.d=6; w.g=RG.stone; bloom(w,o,true,wet); });
  // steinerne Bank: eine Platte auf zwei Blöcken
  var bx0=BENCH.x0, bx1=BENCH.x1; w.d=6; w.g=RG.stone;
  [[bx0+3,bx0+10],[bx1-10,bx1-3]].forEach(function(l){ for (y=BENCH.seat+3;y<BENCH.by;y++) for (x=l[0];x<l[1];x++){ var c5=(x===l[0])?P.s1:((x>=l[1]-2)?P.s4:P.s2); if (wet) c5=M.DN[c5]; w.px(x,y,c5); } w.hl(l[0],l[1]-1,BENCH.by,P.k2); });
  for (x=bx0;x<bx1;x++){ var c6=[P.s5,P.s4,P.s2,P.s1][0]; w.px(x,BENCH.seat,wet?P.s3:P.s5); w.px(x,BENCH.seat+1,P.s4); w.px(x,BENCH.seat+2,P.s2); w.px(x,BENCH.seat+3,P.s0); if (hash(x>>2,9)<0.25) w.px(x,BENCH.seat,P.s3); }
  w.px(bx0+12,BENCH.seat-1,P.e3); w.px(bx0+13,BENCH.seat-1,P.y2); }
function tuft(w,x,y,h,we,sd){ var dry=[P.e3,P.e4,P.y2,P.e2], lean=we==='bura'?0.9:(we==='rain'?0.15:0.3);
  for (var k=0;k<5;k++){ var bx=x+k-2, L=h-Math.abs(k-2), a=-Math.PI/2+(k-2)*0.25+lean*(hash(sd,k)*0.6+0.4); for (var q=0;q<L;q++) w.px(rd(bx+Math.cos(a)*q),rd(y+Math.sin(a)*q),dry[(k+sd)%4]); } }
function bramble(w,x,y,wet){ for (var k=0;k<46;k++){ var a=hash(k,x)*Math.PI*2, d=Math.sqrt(hash(x,k))*10, px=rd(x+Math.cos(a)*d*1.4), py=rd(y-Math.abs(Math.sin(a))*d*0.7); w.px(px,py,hash(k,3)<0.3?P.r1:(wet?P.g1:(hash(k,4)<0.5?P.e1:P.g2))); } }
function branchTree(w,x,by,h,sd,frost){ var r=M.rng(sd*17+3), cols=[P.e0,P.e1,P.e2];
  function limb(px,py,a,L,wd,dep){ for (var i=0;i<L;i++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.22; var ww=Math.max(1,wd*(1-i/L*0.6)); for (var o=0;o<ww;o++) w.px(rd(px+o*0.7),rd(py),(o>=ww-1&&ww>1)?cols[2]:(dep<2?cols[0]:cols[1]));
      if (dep<4 && i>L*0.3 && r()<0.12+dep*0.04) limb(px,py,a+(r()<0.5?-1:1)*(0.4+r()*0.6),L*(0.45+r()*0.3),Math.max(1,ww*0.6),dep+1); }
    if (dep<4) for (var k=0;k<2;k++) limb(px,py,a+(r()-0.5)*1.3,L*0.35,1,dep+1); }
  for (var y=by;y>by-h*0.3;y--){ w.px(x,y,P.e0); w.px(x+1,y,P.e1); w.px(x+2,y,P.e2); }
  limb(x,by-h*0.3,-Math.PI/2-0.5,h*0.45,3,1); limb(x+1,by-h*0.3,-Math.PI/2+0.45,h*0.5,3,1); limb(x,by-h*0.35,-Math.PI/2,h*0.55,2,1);
  for (var k2=0;k2<14;k2++){ var lx=rd(x+(r()-0.5)*h*0.9), ly=rd(by-h*0.45-r()*h*0.5); if (w.get(lx,ly)!==T) w.px(lx,ly,r()<0.5?P.y2:P.t3); } }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), WE='calm', GRASS=[];
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k, night=tod==='night';
  WE=we; DEP.fill(0); REG.fill(0); LIT.length=0;
  paintSky(b,tod,we);
  paintHills(w);
  // Land unter dem Horizont
  w.g=RG.land; for (y=HZ;y<H;y++){ w.d=y<64?2:3; for (x=0;x<W;x++){ if (REG[y*W+x]!==RG.sky) continue; var f0=fbm(x*1.1,y*1.9,6,7); w.px(x,y,y<HZ+6?ra(R('e2 e3 s3 e4 s4'),0.55+(f0-0.5)*0.6,x,y):ra(R('e1 g1 e2 s2 g2 e3'),0.5+(f0-0.5)*0.7,x,y)); } }
  paintRiver(w,we); paintCity(w,we);
  paintMemorial(w,we,tod);
  // Dunst über dem Tal
  var hk=we==='bura'?[0,0.14,0.08,0.04,0.02]:(we==='rain'?[0,0.84,0.62,0.4,0.18]:(we==='grey'?[0,0.62,0.44,0.26,0.1]:[0,0.24,0.15,0.08,0.03]));
  var hc=night?P.m0:(we==='rain'?P.m3:(we==='grey'?P.m4:P.b4));
  haze(b,function(xx,yy){ var d=DEP[yy*W+xx], g=REG[yy*W+xx]; if (g===RG.sky||d>=5) return 0; var a=hk[d]||0; if (d===1) a+=Math.max(0,(HZ-yy)/HZ)*0.12; return a; },hc);
  if ((we==='rain'||we==='grey') && !night) for (y=0;y<HZ+6;y++) for (x=0;x<260;x++){ var f=fbm(x*1.2,y*2.6,18,31), lim=we==='rain'?0.42:0.5; if (REG[y*W+x]===RG.mtn && f>lim-(HZ-y)*0.012 && bayer(x,y)<(we==='rain'?0.85:0.55)) b.d[y*W+x]=we==='rain'?(f>0.6?P.s3:P.m3):(f>0.6?P.m4:P.m3); }
  // Licht: Mittagssonne von rechts vorn; bei Grau und Regen flach
  var amb=we==='rain'?-0.55:(we==='grey'?-0.3:(we==='bura'?0.1:0));
  M.light(b,M.lf.sum(M.lf.k(amb),M.lf.band(EDGE,H,0,-0.45),M.lf.pool(60,118,80,14,-0.5),function(xx,yy){ return REG[yy*W+xx]===RG.wall?-0.25:0; }),0,0,function(xx,yy){ return REG[yy*W+xx]!==RG.sky; });
  SKYM.fill(0); for (k=0;k<W*H;k++) if (REG[k]===RG.sky) SKYM[k]=1;
  // Grashalme für dynamic merken (nah, auf der Terrasse)
  GRASS.length=0; for (var i=0;i<22;i++) GRASS.push([Math.floor(hash(i,51)*W),EDGE+6+Math.floor(hash(i,52)*32),4+Math.floor(hash(i,53)*6)]);
  return M.finishTOD(b,tod,{ sky:function(xx,yy){ return SKYM[yy*W+xx]===1; }, lights:[], after:function(o,tod2){ if (tod2==='day') return;
      LIT.forEach(function(p){ if (hash(p[0]*1.3,p[1]*2.1)>(tod2==='night'?0.4:0.22)) return; o.px(p[0],p[1],hash(p[0],p[1])<0.5?P.y3:P.y4); }); } }); }

// ---------------------------------------------------------------- Ebene: eine Steinblüte vorn mit Gras
function frontLayer(S,GS,tod){ var we=weaOf(GS), o=FRONTB, L=M.layer(o.x-16,o.by-o.h-2,32,o.h+3,o.by), w=M.lw(L);
  bloom(w,o,false,we==='rain');
  for (var k=0;k<4;k++) tuft(w,o.x-10+k*6,o.by-1,5+k%3,we,k+7);
  if (tod!=='day') M.tintApply(L,M.TINT[tod]); return L; }

// ---------------------------------------------------------------- jedes Bild: Gras im Wind, Vögel
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, we=WE, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  // Grashalme schwanken; bei Bura liegen sie flach und zittern
  var amp=we==='bura'?1.6:(we==='rain'?0.3:0.6), base=we==='bura'?1.1:0.2;
  GRASS.forEach(function(g,i){ var sx=g[0]-cam; if (sx<-6||sx>325) return; var sw=Math.sin(t*(we==='bura'?7:2)+i*1.7)*amp;
    for (var q=0;q<g[2];q++){ var X=rd(sx+(base+sw*0.6)*q*0.45), Y=g[1]-q+rd(Math.abs(base)*q*0.2); var c=(q>g[2]-2)?P.e4:P.e3; if (tint) c=M.tintPx(tint,c,X,Y); fb.px(X,Y,c); } });
  // Krähen und Dohlen über dem Hang
  if (we!=='rain') for (var n=0;n<4;n++){ var bx=rd(((hash(n,3)*480+t*(we==='bura'?26:9)*(n%2?1:-1))%480+480)%480-40-cam), by=rd(18+hash(n,4)*26+Math.sin(t*1.1+n)*4), f=Math.floor(t*6+n)%2;
    if (bx<1||bx>318) continue; var k=by*320+bx; if (!SKYM[by*W+bx+cam]) continue; fb.px(bx,by,P.k1); fb.px(bx-1,by-f,P.k1); fb.px(bx+1,by-f,P.k1); fb.px(bx-2,by-f*2+1,P.k2); fb.px(bx+2,by-f*2+1,P.k2); }
  // Wolkenfetzen ziehen bei Bura
  if (we==='bura' && tod==='day') for (var i=0;i<4;i++){ var sp=22+hash(i,3)*18, cx=((hash(i,1)*W+t*sp)%(W+60))-30-cam, cy=6+hash(i,2)*24, L=10+hash(i,4)*16;
    for (var q2=0;q2<L;q2++){ var X2=rd(cx+q2), Y2=rd(cy+Math.sin(q2*0.5+i)*0.6); if (X2<0||X2>=320||Y2<0) continue; if (!SKYM[Y2*W+X2+cam]) continue; var a=1-Math.abs(q2/L-0.5)*2; if (bayer(X2,Y2)<a*0.8) fb.px(X2,Y2,P.b5); } } }
function front(fb,v,S,GS){ var we=WE;
  if (we==='rain') M.rain(fb,v.t,{n:90,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:240,slant:0.2});
  if (we==='bura') M.scn.buraDebris(fb,v.t,112,140,v.cam); }
// Geistersicht: viele Namen an den Steinen, wie Kreide unter Wasser, unlesbar
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  function scrib(x0,y0,w0,rows,sd){ for (var r=0;r<rows;r++){ var y=y0+r*3, wob=Math.sin(t*1.3+r*0.9+sd)*1.2; for (var i=0;i<w0;i++){ var x=rd(x0+i+wob+Math.sin(t*2+i*0.4+r)*0.5)-cam, yy=y+((hash(i>>1,r+sd)<0.5)?0:1); if (x<0||x>=320||yy<0||yy>=144) continue;
        if (hash(i+sd*3,r)<0.35) continue; var ph=(Math.sin(t*0.9+i*0.13+r+sd)+1)/2; if (ph<0.3) continue; fb.px(x,yy,ph>0.85?P.x5:(ph>0.6?P.x4:P.x3)); } } }
  BLOOMS.forEach(function(o,i){ if (o.broken) return; scrib(o.x-3,o.by-o.h+8,7,4,i*5); });
  scrib(10,82,70,5,21); scrib(160,EDGE-2,60,1,33); scrib(270,BENCH.seat+4,30,2,41); }

// ---------------------------------------------------------------- Lauffläche: die Terrasse
function walk(x,y){ if (y<112||y>134||x<10||x>390) return false; if (x>BENCH.x0-2 && x<BENCH.x1+2 && y<BENCH.by+1) return false; if (Math.abs(x-FRONTB.x)<5 && y>130) return false; return true; }
M.defineArt('partizan',{
  width:W, paint:paint, layers:function(S,GS,tod){ return [frontLayer(S,GS,tod)]; }, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{
    exit:[0,92,12,52],
    view:[150,0,250,EDGE-14],
    stones:[BLOOMS[0].x-12,BLOOMS[0].by-BLOOMS[0].h-2,BLOOMS[3].x+18-(BLOOMS[0].x-12),BLOOMS[0].h+4],
    terraces:[0,60,WALLC.x1,EDGE-60],
    bench:[BENCH.x0-2,BENCH.seat-3,BENCH.x1-BENCH.x0+4,BENCH.by-BENCH.seat+3],
    grass:[70,126,110,18]
  },
  stands:{ exit:[12,124,'L'], view:[330,118,'B'], stones:[200,118,'B'], terraces:[88,118,'B'], bench:[287,118,'B'], grass:[124,126,'F'] },
  actorPos:{ mala:[364,120,'R'] },
  start:[24,124,'R'], entries:{ map:[16,124,'R'] }
});
})(M);
