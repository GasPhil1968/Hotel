/* ===== rooms/art/bulevar.js — Der Bulevar, die frühere Frontlinie (480 px, scrollend) =====
   Gegenüber, jenseits der breiten Straße mit Mittelstreifen und kahlen Platanen: links das restaurierte Gymnasium (gelb und
   ocker gestreift, maurische Hufeisenbögen, ein Mittelrisalit mit Portal), in der Mitte die Bankruine (Hochhaus aus Beton und
   Glas, das Glas zerschossen, Geschossdecken und Stützen offen, Moniereisen, ein Bäumchen im fünften Stock, unten ein Bauzaun
   aus Blech), rechts ein altes Haus voller Einschusslöcher. Vorn unser Gehweg mit einer Bank, Platanenlaub, rechts an der Ecke
   der Wegweiser „VULKANIZER RAJIĆ →“ und ein Reifenstapel; dort biegt die Seitengasse ab. Kriegsspuren ohne Parolen, ohne
   Graffiti, ohne Zeichen einer Seite. Malas Sicht: entlang der Straße eine Linie aus Kälte, die alte Front. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144, GY=88;                                       // Fußlinie der Häuser gegenüber
var ST={fw:[88,92],fl:[92,99],med:[99,103],nl:[103,112],curb:112};  // Gehweg gegenüber, Fahrspuren, Mittelstreifen, Bordstein vorn
var GYM={x0:0,x1:156,top:20,bay0:56,bay1:100};
var BANK={x0:178,x1:302,top:4,fl:8};
var OLD={x0:322,x1:424,top:38};
var NEXT={x0:424,x1:480,top:28};
var TREES=[{x:64,s:3},{x:196,s:7},{x:330,s:11},{x:452,s:5}];
var MLAMPS=[130,262,394];
var BENCH={x0:246,x1:290,by:119};
var SIGN={x:428,top:84,by:124};
var TIRES={x:444,by:124};

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
// Dunst: zur Dunstfarbe hin mischen, Ergebnis nur aus Landschaftsfarben (sonst wird Kalk im Blau violett)
function haze(b,amt,col){ for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var a=amt(x,y); if (!(a>0.01)) continue; var k=y*W+x, c=b.d[k]; if (c===T||c>=M.NCOL) continue; var f=Math.min(8,a*8), i=Math.floor(f); if (i<8 && bayer(x,y)<f-i) i++; if (i>0) b.d[k]=hazeLut(col,i)[c]; } }
var REG=new Uint8Array(W*H), RG={sky:0,far:1,bldg:2,glass:3,street:4,walk:5,tree:6,prop:7};
function RW(b){ var o={g:0};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; b.d[k]=c; REG[k]=o.g; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  o.w=W; o.h=H; return o; }
function dk(w,x,y,n){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,-(n||1))); }
function lt(w,x,y,n){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,n||1)); }
// Einschusslöcher: kleine dunkle Krater mit hellem, abgeplatztem Rand, in Nestern
function holes(w,cx,cy,rx,ry,n,sd){ var r=M.rng(sd); for (var i=0;i<n;i++){ var a=r()*6.283, d=Math.pow(r(),0.6), x=rd(cx+Math.cos(a)*rx*d), y=rd(cy+Math.sin(a)*ry*d), big=r()<0.18;
    var c0=w.get(x,y); if (c0===T) continue; w.px(x,y,M.step(c0,-3)); if (big){ w.px(x+1,y,M.step(c0,-2)); lt(w,x-1,y-1,2); lt(w,x,y-1,1); lt(w,x+1,y+1,1); } else if (r()<0.5) lt(w,x-1,y,1); } }
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'};
function sign(w,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(w,base,cx,y,c); var wd=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž') w.px(cx+1,y-1,c); else if (ch==='Ć') w.px(cx+2,y-1,c); cx+=wd+1; }); return cx; }

// ---------------------------------------------------------------- Himmel und Ferne
function paintSky(b,tod,we){ var x, y, h=GY;
  if (we==='grey' && tod==='day'){ var GR=R('m2 m3 m4 s4'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(GR,0.28+y/h*0.5+(fbm(x*0.7,y*2.4,30,8)-0.5)*0.35,x,y)); return; }
  if (we==='rain'){ M.scn.sky(b,0,0,W,h,tod,we,71); return; }
  if (tod==='day'){ var bura=we==='bura', D=bura?R('b0 b1 b2 b3 b4 b5'):R('b1 b2 b3 b4 b5');
    for (y=0;y<h;y++){ var v=(bura?0.05:0.18)+Math.pow(y/70,1.3)*(bura?0.86:0.78); for (x=0;x<W;x++) b.px(x,y,ra(D,v+(vn(x,y,50,2)-0.5)*0.05,x,y)); }
    var r=M.rng(bura?83:39);
    if (bura){ for (var i=0;i<10;i++){ var cx=r()*W-20, cy=3+r()*30, L=16+r()*44, th=1.5+r()*3;
        for (var k=0;k<L;k++){ var u=k/L; if (fbm(cx+k*1.3,i*9,6,3)<0.4) continue; var hh=th*Math.sin(u*Math.PI)*(0.45+fbm(k*2+cx,i*3,5,5)), xx=rd(cx+k), yt=rd(cy-hh*0.6+u*2.5), yb2=rd(cy+hh*0.4+u*2.5);
          for (var yy=yt;yy<=yb2;yy++){ var q=(yy-yt)/Math.max(1,yb2-yt); if (q>0.8 && bayer(xx,yy)<0.5) continue; b.px(xx,yy,q<0.4?P.b5:(q<0.75?P.b4:P.b3)); } } } }
    else { for (var j=0;j<6;j++){ var cx2=r()*W, cy2=5+r()*24, L2=50+r()*90; for (var k2=0;k2<L2;k2++){ var xx2=rd(cx2+k2), yy2=rd(cy2+Math.sin(k2*0.06+j)*1.3+k2*0.02), a=1-Math.abs(k2/L2-0.5)*2; if (bayer(xx2,yy2)<a*0.45) b.px(xx2,yy2,P.b4); } } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<h;y++) for (x=0;x<W;x++) b.px(x,y,ra(N,0.08+Math.pow(y/70,1.5)*0.8,x,y));
    var r2=M.rng(49); for (var s=0;s<170;s++){ var sx=Math.floor(r2()*W), sy=Math.floor(Math.pow(r2(),1.4)*50), q2=r2(); b.px(sx,sy,q2<0.08?P.n5:(q2<0.4?P.n4:P.n3)); } return; }
  M.sky(b,0,0,W,h,tod,27); }
// hinter den Häusern: der Hum (ohne Kreuz) und ferne Blöcke, im Dunst
function paintFar(w,we,tod){ w.g=RG.far; var x, y, dull=(we==='rain'||we==='grey'), C1=tod==='night'?P.k2:(dull?P.m3:P.b3), C2=tod==='night'?P.n0:(dull?P.m2:P.b2), C3=tod==='night'?P.n1:(dull?P.m4:P.b4);
  for (x=0;x<W;x++){ var hy=rd(44-18*Math.exp(-Math.pow((x-120)/150,2))+Math.sin(x*0.05)*1.5); for (y=hy;y<GY;y++) w.px(x,y,(y===hy)?C1:((bayer(x,y)<0.4)?C2:C1)); }
  [[150,10,26],[164,8,30],[312,12,22],[408,9,18]].forEach(function(t){ for (y=GY-t[2];y<GY;y++) for (x=t[0];x<t[0]+t[1];x++) w.px(x,y,((y%3)===1&&(x%2)===0)?C2:C3); }); }

// ---------------------------------------------------------------- das Gymnasium: gelb und ocker, maurische Fenster, Mittelrisalit
function hsArch(w,wx,wy,ww,wh,lit){ var cx=wx+(ww-1)/2, r=ww/2+0.6, x, y;
  for (y=wy-2;y<wy+wh;y++) for (x=wx-2;x<wx+ww+2;x++){ var k=y-wy, dx=x+0.5-wx-ww/2, inA=(k<r*1.1)?((dx*dx)/(r*r)+Math.pow((k-r*1.1)/(r*1.25),2)<1):Math.abs(dx)<ww/2, outA=(k<r*1.1)?((dx*dx)/((r+1.6)*(r+1.6))+Math.pow((k-r*1.1)/(r*1.25+1.6),2)<1):Math.abs(dx)<ww/2+1.6;
    if (inA){ var c=(k<2)?P.k1:P.n0; if (((x-wx)+(y-wy))%7===0) c=P.n1; if (x===rd(cx)) c=P.s5; if (k===rd(r*1.4)) c=P.s5; w.px(x,y,c); if (lit) LITW.push([x,y]); }
    else if (outA && k<wh) w.px(x,y,(k<r*1.1)?(((Math.atan2(k-r*1.1,dx)*5|0)%2)?P.s6:P.t3):P.s6); }
  w.hl(wx-2,wx+ww+1,wy+wh,P.s6); w.hl(wx-2,wx+ww+1,wy+wh+1,P.t2); }
var LITW=[];
function paintGym(w,wet){ var g=GYM, x, y; w.g=RG.bldg;
  var YL=R('y2 y3 y4 d6'), OC=R('t2 t3 t4');
  for (y=g.top;y<GY;y++) for (x=g.x0;x<g.x1;x++){ var bay=(x>=g.bay0&&x<g.bay1), yy=y-(bay?g.top-8:g.top), band=(yy%13)<3;
      var c=band?ra(OC,0.5+(fbm(x,y,6,2)-0.5)*0.4,x,y):ra(YL,0.55+(fbm(x*0.7,y,9,3)-0.5)*0.3+(bay?0.08:0),x,y); if (x===g.bay0||x===g.bay1-1) c=bay?P.d6:P.y2; if (wet) c=M.DN[c]; w.px(x,y,c); }
  // Risalit höher, mit gestuften Zinnen und einer Blendarkade
  for (x=g.bay0-2;x<g.bay1+2;x++){ var ph=(x-g.bay0+2)%6, ht=(ph<2)?3:6; for (y=g.top-8-ht;y<g.top-8;y++) w.px(x,y,(y===g.top-8-ht)?P.s6:P.y3); }
  for (x=g.x0;x<g.x1;x++){ if (x>=g.bay0-2&&x<g.bay1+2) continue; var ph2=x%6; for (y=g.top-(ph2<2?2:4);y<g.top;y++) w.px(x,y,(y===g.top-(ph2<2?2:4))?P.s6:P.y3); }
  for (x=g.x0;x<g.x1;x++){ w.px(x,g.top,P.s6); w.px(x,g.top+1,P.t2); if (x%3===0) w.px(x,g.top+2,P.t1); }
  for (x=g.bay0;x<g.bay1;x+=5) hsArch(w,x+1,g.top-4,3,5,false);
  // Fensterreihen: oben gekuppelte Hufeisenfenster, unten große Bögen, das Portal in der Mitte
  [g.top+7,g.top+29].forEach(function(fy,fi){ for (var wx=g.x0+6;wx<g.x1-6;wx+=12){ if (wx>g.bay0-8 && wx<g.bay1) continue; hsArch(w,wx,fy,4,14,true); hsArch(w,wx+5,fy,4,14,true); }
    for (var bx=g.bay0+5;bx<g.bay1-6;bx+=12) hsArch(w,bx,fy-2,7,16,true); });
  for (var wx2=g.x0+7;wx2<g.x1-6;wx2+=24){ if (wx2>g.bay0-14 && wx2<g.bay1) continue; hsArch(w,wx2,g.top+51,10,14,true); }
  hsArch(w,g.bay0+13,g.top+48,18,GY-(g.top+48),false);
  for (y=GY-8;y<GY;y++) for (x=g.bay0+14;x<g.bay0+31;x++) w.px(x,y,((x+y)%2)?P.w1:P.w2);                // Tür
  for (var st=0;st<3;st++) w.hl(g.bay0+10-st*2,g.bay0+34+st*2,GY-1+st*0,st===0?P.s5:P.s4);
  w.rect(g.bay0+9,g.top+42,26,6,P.s6); w.hl(g.bay0+9,g.bay0+34,g.top+47,P.t2); sign(w,'GIMNAZIJA',g.bay0+10,g.top+42,P.t1);
  // Sockel aus Stein, die Restaurierung ist neu, nur unten Spritzwasser
  for (y=GY-6;y<GY;y++) for (x=g.x0;x<g.x1;x++){ if (x>=g.bay0+10&&x<g.bay0+35) continue; w.px(x,y,(y===GY-6)?P.s5:(((x+y*3)%11===0)?P.s2:P.s3)); }
  // Fallrohr
  w.vl(g.x1-2,g.top+2,GY-1,P.m2); w.vl(g.x1-1,g.top+2,GY-1,P.m1); }

// ---------------------------------------------------------------- die Bankruine
function paintBank(w,wet){ var b=BANK, x, y, nf=Math.floor((GY-b.top)/b.fl), r=M.rng(11); w.g=RG.bldg;
  // ausgebranntes Inneres: fast schwarz; wo die Rückwand fehlt, sieht man durch das Haus den Himmel
  for (y=b.top;y<GY;y++) for (x=b.x0;x<b.x1;x++){ var fl=Math.floor((y-b.top)/b.fl), fy=(y-b.top)%b.fl, c=(fy<2)?P.k0:((hash(x>>1,y)<0.12)?P.m0:P.k1);
      var thru=fy>=2 && fy<b.fl-1 && fbm(x*0.12,fl*1.7,3,7)>0.6; if (thru){ c=SKYB?SKYB.get(x,y):P.b3; if (fy<4) c=M.DN[c]; }
      if (!thru && fy===b.fl-1 && hash(x>>2,fl)<0.5) c=P.m1;                                                   // Schutt auf der Decke
      if (x>b.x1-30 && x<b.x1-20 && !thru) c=(fy<2)?P.m1:P.m0; w.px(x,y,c); if (thru) REG[y*W+x]=RG.glass; }
  // Geschossdecken: helle, abgebrochene Betonkanten, manche hängen durch
  for (var f=0;f<=nf;f++){ var sy=b.top+f*b.fl; for (x=b.x0-2;x<b.x1+2;x++){ var gap=fbm(x*0.25,f*3.1,2,9)>0.72; if (gap && f>0 && f<nf) continue; var sag=(fbm(x*0.1,f,3,4)>0.68)?1:0;
      w.px(x,sy+sag,P.s5); w.px(x,sy+1+sag,P.m3); if (hash(x,f)<0.15) w.px(x,sy+2+sag,P.m2); if (hash(x*3,f)<0.06) w.px(x,sy-1,P.s4); } }
  // Stützen, an den Kanten abgeplatzt
  for (x=b.x0;x<=b.x1;x+=24) for (y=b.top;y<GY;y++){ var chip=hash(x,y>>1)<0.12; w.px(x,y,chip?P.m2:P.m4); w.px(x+1,y,P.m3); w.px(x+2,y,chip?P.k1:P.m2); }
  // Reste der Glasfassade: ein paar dunkle, spiegelnde Scheiben, meist oben; sonst nur Splitter in den Rahmen
  for (var fl2=0;fl2<nf;fl2++) for (var px=b.x0+3;px<b.x1-2;px+=6){ var hp=hash(px,fl2*7), y0=b.top+fl2*b.fl+2, y1=y0+b.fl-3, top=(fl2<3)?0.12:0;
    if (hp<0.06+top){ for (y=y0;y<=y1;y++) for (x=px;x<px+5;x++){ var gc=((x+y*2)%9<2)?P.b3:(y<y0+2?P.a3:P.a2); if (hash(x*5,y)<0.12) gc=P.s5; w.px(x,y,gc); } w.vl(px+5,y0,y1,P.m1); }
    else if (hp<0.3){ var cut=rd(r()*4), up=hp<0.18; for (y=y0;y<=y1;y++) for (x=px;x<px+5;x++){ var tri=up?((x-px)+(y1-y)):((x-px)+(y-y0)); if (tri>cut+1) continue; w.px(x,y,(tri===cut+1)?P.s4:P.a2); } w.vl(px+5,y0,y1,P.m1); }
    else if (hp<0.5){ w.vl(px+5,y0,y1,P.m2); w.px(px+5,y0-1,P.m3); } }
  // die Ecke unten links: ein großes Stück Fassade fehlt, Moniereisen hängen heraus
  for (y=GY-34;y<GY-14;y++) for (x=b.x0-2;x<b.x0+18;x++){ if (Math.pow((x-b.x0+2)/20,2)+Math.pow((y-(GY-14))/20,2)>1) continue; w.px(x,y,(hash(x,y)<0.3)?P.k0:P.k1); }
  for (var k=0;k<34;k++){ var rx=b.x0+Math.floor(r()*(b.x1-b.x0)), ry=b.top+Math.floor(r()*nf)*b.fl+1; var L=2+Math.floor(r()*4); w.line(rx,ry,rx+(r()<0.5?-1:1),ry+L,P.t1); }
  // Treppenkern an der Seite: Beton mit Löchern; Bäumchen und Gras auf den Decken
  for (y=b.top-2;y<GY;y++) for (x=b.x1-4;x<b.x1+6;x++) w.px(x,y,(x<b.x1)?P.m3:((x===b.x1+5)?P.m1:P.m2));
  for (y=b.top+6;y<GY;y+=14) w.rect(b.x1,y,4,3,P.k1);
  var tx=b.x0+46, ty=b.top+5*b.fl; w.vl(tx,ty-6,ty,P.e1); [[-2,-6],[2,-7],[0,-8],[-3,-4],[3,-4]].forEach(function(q){ w.px(tx+q[0],ty+q[1],P.e3); w.px(tx+q[0]+1,ty+q[1],P.e2); });
  for (x=b.x0;x<b.x1;x++) if (hash(x,17)<0.15) w.px(x,b.top+3*b.fl-1,P.g2);
  // Ruß über den Öffnungen
  for (x=b.x0;x<b.x1;x++) for (var f3=1;f3<nf;f3++){ var sy2=b.top+f3*b.fl; if (fbm(x*0.2,f3,3,12)>0.6) for (y=sy2-1;y>sy2-5;y--) if (bayer(x,y)<0.5) dk(w,x,y,1); }
  // Dach: leerer Rahmen einer Leuchtschrift (ohne Buchstaben), Antennenreste
  w.hl(b.x0-2,b.x1+5,b.top-1,P.s4); w.hl(b.x0-2,b.x1+5,b.top-2,P.m2); for (x=b.x0+20;x<b.x0+80;x+=6) w.vl(x,b.top-8,b.top-2,P.m1); w.hl(b.x0+20,b.x0+80,b.top-8,P.m1); w.line(b.x0+92,b.top-2,b.x0+96,b.top-10,P.m1);
  // Einschusslöcher in Beton und Stützen
  holes(w,b.x0+20,GY-30,18,24,70,21); holes(w,b.x0+70,b.top+30,40,24,90,22); holes(w,b.x1-10,b.top+40,8,30,40,23);
  // Bauzaun aus Blech am Fuß, verrostet, ohne Schrift
  for (y=GY-14;y<GY;y++) for (x=b.x0-6;x<b.x1+8;x++){ var pn=Math.floor((x-b.x0+6)/14), c2=ra(R('t1 m1 t2 m2'),0.45+(fbm(x*0.5,y,5,pn)-0.5)*0.6+(hash(pn,1)-0.5)*0.3,x,y); if ((x-b.x0+6)%14===0) c2=P.k2; if ((x%2)===0) c2=M.DN[c2]; if (y===GY-14) c2=P.m3; if (wet) c2=M.DN[c2]; w.px(x,y,c2); }
  for (x=b.x0-6;x<b.x1+8;x+=2) if (hash(x,5)<0.4) w.px(x,GY-15,P.e3); }

// ---------------------------------------------------------------- altes Haus voller Einschusslöcher, daneben ein neueres
function paintOld(w,wet){ var o=OLD, x, y; w.g=RG.bldg;
  for (y=o.top;y<GY;y++) for (x=o.x0;x<o.x1;x++){ var c=ra(R('s3 e4 s4 s5'),0.55+(fbm(x*0.6,y*0.8,9,14)-0.5)*0.35,x,y); if (fbm(x*0.9,y*1.1,7,5)>0.7) c=ra(R('t2 t3 s2'),0.5+hash(x,y)*0.3,x,y); if (wet) c=M.DN[c]; w.px(x,y,c); }   // abgeplatzter Putz: Ziegel
  for (x=o.x0-2;x<o.x1+2;x++){ w.px(x,o.top-1,P.t2); w.px(x,o.top-2,P.t3); w.px(x,o.top-3,(x%3)?P.t3:P.t1); w.px(x,o.top,P.s1); }
  for (y=o.top-9;y<o.top-3;y++){ var ins=(o.top-3-y)*2; for (x=o.x0+ins;x<o.x1-ins;x++) w.px(x,y,((x+y)%4===0)?P.t1:(y%2?P.t2:P.t3)); }
  [[o.x0+10,o.top+8],[o.x0+36,o.top+8],[o.x0+62,o.top+8],[o.x0+86,o.top+8],[o.x0+10,o.top+28],[o.x0+62,o.top+28],[o.x0+86,o.top+28]].forEach(function(p,i){ var wx=p[0], wy=p[1];
    w.rect(wx-1,wy-1,10,15,P.s5); for (y=wy;y<wy+13;y++) for (x=wx;x<wx+8;x++) w.px(x,y,(i===2)?((y<wy+6)?P.w1:P.w2):((x===wx+4||y===wy+5)?P.s4:P.k2)); if (i!==2) LITW.push([wx+1,wy+1]);
    w.hl(wx-2,wx+9,wy+13,P.s6); w.hl(wx-2,wx+9,wy+14,P.s2); });
  // Balkon, beschädigt: Platte gebrochen, Geländer verbogen
  w.rect(o.x0+30,o.top+21,24,2,P.s4); w.hl(o.x0+30,o.x0+53,o.top+23,P.s1); for (x=o.x0+30;x<o.x0+54;x+=2) w.vl(x,o.top+14,o.top+20,P.k2); w.hl(o.x0+30,o.x0+44,o.top+14,P.k1); w.line(o.x0+44,o.top+14,o.x0+52,o.top+18,P.k1);
  // Erdgeschoss: Laden mit heruntergelassenem Rollladen, Hauseingang
  w.rect(o.x0+30,GY-20,30,20,P.m2); for (y=GY-19;y<GY;y+=2) w.hl(o.x0+31,o.x0+58,y,P.m3); w.rect(o.x0+30,GY-23,30,3,P.k2);
  w.rect(o.x0+74,GY-22,12,22,P.w1); w.vl(o.x0+80,GY-22,GY-1,P.w0); w.px(o.x0+83,GY-11,P.y3);
  // die Einschusslöcher: dicht um die Fenster, Garben über die Wand
  holes(w,o.x0+14,o.top+14,14,10,70,31); holes(w,o.x0+66,o.top+16,16,10,60,32); holes(w,o.x0+90,o.top+34,10,12,40,33); holes(w,o.x0+50,GY-30,40,6,50,34); holes(w,o.x0+20,GY-12,10,8,20,35);
  // das neuere Haus rechts: verputzt, Klimagerät, Satellitenschüssel
  var n=NEXT; for (y=n.top;y<GY;y++) for (x=n.x0;x<n.x1;x++){ var c2=(x===n.x0)?P.s6:ra(R('s4 s5 t5'),0.55+(fbm(x,y,10,4)-0.5)*0.2,x,y); if (wet) c2=M.DN[c2]; w.px(x,y,c2); }
  for (x=n.x0-1;x<n.x1;x++){ w.px(x,n.top,P.s2); w.px(x,n.top-1,P.m3); }
  for (var fy=n.top+6;fy<GY-16;fy+=16) for (var fx=n.x0+6;fx<n.x1-6;fx+=16){ w.rect(fx,fy,9,10,P.k2); w.hl(fx-1,fx+9,fy+10,P.s6); w.vl(fx+4,fy,fy+9,P.s4); LITW.push([fx+1,fy+1]); }
  w.rect(n.x0+30,n.top+20,8,5,P.s6); w.hl(n.x0+30,n.x0+37,n.top+24,P.s3); w.ellipse(n.x0+12,n.top+30,3,2.5,P.s5);
  w.rect(n.x0+6,GY-18,36,18,P.k2); w.rect(n.x0+6,GY-21,36,3,P.b0); for (x=n.x0+8;x<n.x0+40;x+=6) w.vl(x,GY-17,GY-1,P.m1); }

// ---------------------------------------------------------------- Straße: Gehweg gegenüber, zwei Spuren, Mittelstreifen, zwei Spuren, Bordstein
function paintStreet(w,we){ var x, y, wet=we==='rain'; w.g=RG.street;
  for (y=ST.fw[0];y<ST.fw[1];y++) for (x=0;x<W;x++) w.px(x,y,(y===ST.fw[0])?P.s5:((x%12===0)?P.s2:P.s4));
  for (y=ST.fw[1];y<ST.curb;y++) for (x=0;x<W;x++){ var c;
    if (y>=ST.med[0] && y<ST.med[1]){ c=(y===ST.med[0])?P.s4:((y===ST.med[1]-1)?P.s2:(fbm(x*0.5,y,4,3)>0.5?P.e2:P.g2)); }
    else { var v=0.42+(fbm(x*0.25,y*1.3,7,5)-0.5)*0.3, ln=(y<ST.med[0])?(y-ST.fl[0]):(y-ST.nl[0]); c=ra(R('m0 m1 m2 s1 m2'),v,x,y);
      if (ln===((y<ST.med[0])?3:4) && ((x>>3)%2===0)) c=P.s4;                                              // Spurlinie
      if (hash(x>>3,y>>1)<0.04) c=P.m1; if (wet){ c=M.DN[c]; if (fbm(x*0.25,y*1.2,5,9)>0.66) c=(bayer(x,y)<0.6)?P.m4:P.m3; } }
    w.px(x,y,c); }
  // Kanaldeckel, eine geflickte Stelle im Asphalt (Granattrichter, längst zugeteert)
  w.ellipse(150,108,5,1.4,P.m0); w.hl(146,154,108,P.k2); w.ellipse(352,95,7,1.6,P.m0); w.ellipse(352,95,5,1,P.m1);
  for (x=60;x<78;x++) for (y=104;y<110;y++) if (Math.pow((x-69)/9,2)+Math.pow((y-107)/3,2)<1) w.px(x,y,(hash(x,y)<0.5)?P.k2:P.m0); }
function paintWalk(w,we){ var x, y, wet=we==='rain', r=M.rng(5); w.g=RG.walk;
  for (x=0;x<W;x++){ w.px(x,ST.curb,P.s5); w.px(x,ST.curb+1,P.s3); w.px(x,ST.curb+2,P.s2); }
  var rows=[ST.curb+3]; while (rows[rows.length-1]<H){ var lr=rows[rows.length-1]; rows.push(lr+Math.round(4+(lr-ST.curb)*0.16)); }
  for (var ri=0;ri<rows.length-1;ri++){ var y0=rows[ri], y1=rows[ri+1], sz=Math.round((y1-y0)*1.7), off=(ri%2)*Math.round(sz/2);
    for (y=y0;y<Math.min(H,y1);y++) for (x=0;x<W;x++){ var fx=(x+off)%sz, c=hash(Math.floor((x+off)/sz),ri)<0.35?P.s3:P.s4; if (hash(Math.floor((x+off)/sz),ri+7)<0.12) c=P.e3; if (y===y0||fx===0) c=(bayer(x,y)<0.6)?P.s2:P.s3; else if (y===y0+1 && fx>1) c=M.UP[c]; if (hash(x,y)<0.03) c=P.s2;
      if (wet){ c=M.DN[c]; if (fbm(x*0.2,y*0.8,5,13)>0.66) c=(bayer(x,y)<0.5)?P.m4:P.m3; } w.px(x,y,c); } }
  // Platanenlaub: groß, braun, in Haufen am Bordstein und an der Bank
  for (var i=0;i<300;i++){ var lx=Math.floor(r()*W), ly=ST.curb+3+Math.floor(Math.pow(r(),1.5)*30); var lc=r()<0.4?P.e3:(r()<0.5?P.y2:(r()<0.5?P.t3:P.e2)); if (wet) lc=M.DN[lc]; w.px(lx,ly,lc); if (r()<0.6) w.px(lx+1,ly,M.DN[lc]); if (r()<0.3) w.px(lx,ly-1,lc); }
  // die Seitengasse rechts: der Bordstein biegt ab, Asphalt der Gasse
  for (y=ST.curb;y<H;y++) for (x=W-16+Math.floor((y-ST.curb)*0.35);x<W;x++) w.px(x,y,ra(R('m0 m1 m2'),0.5+(fbm(x,y,4,3)-0.5)*0.4,x,y));
  for (y=ST.curb;y<H;y++){ var bx=W-17+Math.floor((y-ST.curb)*0.35); w.px(bx,y,P.s5); w.px(bx+1,y,P.s3); } }
function plane(w,x,by,h,sd){ var r=M.rng(sd), BK=[P.s4,P.e3,P.g4,P.s3,P.e4,P.s5]; w.g=RG.tree;
  function bark(xx,yy,u){ var q=fbm(xx*0.9,yy*0.45,3,sd), c=BK[Math.floor(q*BK.length*0.999)]; if (u>0.7) c=M.DN[c]; if (u<0.2) c=M.UP[c]; return c; }
  var th=Math.round(h*0.36), y; for (y=by;y>by-th;y--){ var ww=2.4+(by-y<3?(3-(by-y))*0.5:0); for (var xx=Math.floor(x-ww);xx<=Math.ceil(x+ww);xx++) w.px(xx,y,bark(xx,y,(xx-(x-ww))/(2*ww))); }
  function limb(x0,y0,a,L,wd,dep){ var px=x0, py=y0; for (var i=0;i<L;i++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.16; var ww2=wd*(1-i/L*0.6);
      for (var o=-ww2;o<=ww2;o+=0.6) w.px(rd(px+o*0.8),rd(py),dep<2?bark(px,py,(o+ww2)/(2*ww2+0.01)):(dep<3?P.e3:P.m3));
      if (dep<4 && i>L*0.35 && r()<0.09+dep*0.04) limb(px,py,a+(r()<0.5?-1:1)*(0.4+r()*0.6),L*(0.45+r()*0.25),Math.max(0.3,ww2*0.6),dep+1); }
    if (dep<4) for (var k=0;k<2;k++) limb(px,py,a+(r()-0.5)*1.4,L*0.32,0.3,dep+1); }
  var y0=by-th; limb(x,y0,-Math.PI/2-0.55,h*0.32,1.8,1); limb(x,y0,-Math.PI/2+0.5,h*0.34,1.7,1); limb(x,y0-3,-Math.PI/2-0.05,h*0.38,1.5,1); limb(x,y0+4,-Math.PI/2-1.1,h*0.24,1.2,2); limb(x,y0+2,-Math.PI/2+1.05,h*0.22,1.1,2);
  for (var k2=0;k2<8;k2++){ var fx=rd(x+(r()-0.5)*h*0.7), fy=rd(by-h*0.55-r()*h*0.35); w.px(fx,fy,P.e2); w.px(fx,fy-1,P.m1); } }
function medianLamp(w,x){ w.g=RG.prop; var by=ST.med[0]+2; w.vl(x,by-62,by,P.m2); w.vl(x+1,by-62,by,P.m1); w.rect(x-1,by-4,4,4,P.m1);
  [[-1,0],[1,1]].forEach(function(d){ for (var i=0;i<9;i++) w.px(x+d[1]+d[0]*i,by-62-Math.round(Math.sin(i/8*Math.PI*0.5)*3),P.m2); w.rect(x+d[1]+d[0]*9-(d[0]<0?3:0),by-66,4,2,P.m2); w.hl(x+d[1]+d[0]*9-(d[0]<0?3:0),x+d[1]+d[0]*9-(d[0]<0?3:0)+3,by-64,P.s4); }); }
function paintBench(w,wet){ var x0=BENCH.x0, x1=BENCH.x1, by=BENCH.by, x; w.g=RG.prop;
  // Bank mit dem Rücken zu uns, Blick auf die Straße: Lehne aus Latten, Gusseisenfüße
  for (var k=0;k<3;k++){ var yy=by-18+k*3; w.hl(x0+1,x1-1,yy,P.w4); w.hl(x0+1,x1-1,yy+1,P.w2); }
  w.hl(x0,x1,by-9,P.w3); w.hl(x0,x1,by-8,P.w1);
  [x0+2,x1-3].forEach(function(lx){ w.vl(lx,by-19,by,P.k1); w.vl(lx+1,by-19,by,P.m1); w.line(lx,by-9,lx-2,by,P.k1); });
  for (x=x0;x<=x1;x++) if (bayer(x,by)<0.7) dk(w,x,by+1,2);
  w.px(x0+12,by-9,P.y2); w.px(x0+13,by-10,P.t3); w.px(x1-8,by-9,P.e3); }
function paintSign(w,wet){ var s=SIGN, x, y; w.g=RG.prop;
  // Wegweiser an einem Rohrpfosten: weißes Blech, rote Schrift, ein Pfeil; daneben ein Reifenstapel
  w.vl(s.x,s.top,s.by,P.m3); w.vl(s.x+1,s.top,s.by,P.m1); w.hl(s.x-1,s.x+2,s.by,P.k2);
  var bw=M.microWidth('VULKANIZER RAJIC')+16, bx=s.x-bw+12, by=s.top+2;
  w.rect(bx,by,bw,11,P.s6); w.hl(bx,bx+bw-1,by,P.s5); w.hl(bx,bx+bw-1,by+10,P.s3); w.vl(bx+bw-1,by,by+10,P.s3); w.vl(bx,by,by+10,P.r2);
  var ex=sign(w,'VULKANIZER RAJIĆ',bx+3,by+3,P.r2);
  w.hl(ex+2,ex+7,by+5,P.k1); w.px(ex+6,by+4,P.k1); w.px(ex+6,by+6,P.k1); w.px(ex+5,by+3,P.k1); w.px(ex+5,by+7,P.k1);
  for (x=bx+2;x<bx+bw-2;x++) if (hash(x,3)<0.1) w.px(x,by+9,P.t2); w.px(bx+bw-3,by+1,P.t1);
  // Reifenstapel: alte Reifen, unten ein weiß gestrichener
  for (var i=0;i<6;i++){ var ty=TIRES.by-i*5-5, white=(i===0); for (y=ty;y<ty+5;y++) for (x=TIRES.x-9;x<=TIRES.x+9;x++){ var e=Math.abs(x-TIRES.x)/9, c=(y===ty)?P.m1:((e>0.8)?P.k1:(e>0.4?P.k2:P.m0)); if (white && y>ty) c=(e>0.8)?P.s3:(e>0.4?P.s5:P.s4); if ((x+y+i)%5===0 && !white) c=P.k1; w.px(x+(i%2?1:0),y,c); } w.hl(TIRES.x-5+(i%2),TIRES.x+5+(i%2),ty,P.k0); }
  w.hl(TIRES.x-10,TIRES.x+11,TIRES.by,P.k2); }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H), WE='calm', BASE=null, SKYB=null;
function paint(S,GS,tod){ var we=weaOf(GS), b=new M.Buf(W,H,T), w=RW(b), x, y, k, night=tod==='night', wet=we==='rain';
  WE=we; REG.fill(0); LITW.length=0;
  paintSky(b,tod,we); SKYB=b.clone(); paintFar(w,we,tod);
  paintGym(w,wet); paintBank(w,wet); paintOld(w,wet);
  paintStreet(w,we);
  TREES.forEach(function(t){ plane(w,t.x,ST.med[0]+2,92,t.s); });
  MLAMPS.forEach(function(lx){ medianLamp(w,lx); });
  paintWalk(w,we); paintBench(w,wet); paintSign(w,wet);
  // Dunst in die Ferne, Licht je Wetter
  var fk=we==='bura'?0.1:(we==='rain'?0.6:(we==='grey'?0.45:0.18)), fc=night?P.m1:(we==='rain'?P.m3:(we==='grey'?P.m4:P.b4));
  haze(b,function(xx,yy){ var g=REG[yy*W+xx]; if (g===RG.far) return 0.5*fk+0.2; if (g===RG.bldg) return Math.max(0,(70-yy)/70)*0.35*fk; return 0; },fc);
  var amb=we==='rain'?-0.5:(we==='grey'?-0.3:(we==='bura'?0.1:0));
  M.light(b,M.lf.sum(M.lf.k(amb),M.lf.band(ST.curb,H,0,-0.35),M.lf.pool(240,GY-6,120,8,-0.35)),0,0,function(xx,yy){ return REG[yy*W+xx]!==RG.sky; });
  SKYM.fill(0); for (k=0;k<W*H;k++) if (REG[k]===RG.sky) SKYM[k]=1;
  var lights=[]; if (tod!=='day') MLAMPS.forEach(function(lx){ lights.push([lx-8,40,30,0.7,26]); lights.push([lx+10,40,30,0.7,26]); lights.push([lx,112,40,0.5,10]); });
  BASE=b.clone();
  return M.finishTOD(b,tod,{ sky:function(xx,yy){ return SKYM[yy*W+xx]===1; }, lights:lights, after:function(o,tod2){ if (tod2==='day') return;
      LITW.forEach(function(p){ if (hash(p[0]*1.7,p[1]*0.3)>(tod2==='night'?0.35:0.2)) return; for (var yy=p[1];yy<p[1]+3;yy++) for (var xx=p[0];xx<p[0]+3;xx++) if (BASE.get(xx,yy)===P.k2||BASE.get(xx,yy)===P.n0) o.px(xx,yy,(bayer(xx,yy)<0.5)?P.y3:P.y2); });
      MLAMPS.forEach(function(lx){ o.hl(lx-8,lx-5,ST.med[0]-62,P.l1); o.hl(lx+7,lx+10,ST.med[0]-62,P.l1); }); } }); }

// ---------------------------------------------------------------- jedes Bild: Laub, ein vorbeifahrendes Auto
function car(fb,x0,by,dir,col,L,tint,cam){ var h=11, x, y;
  function px(X,Y,c){ X=rd(X)-cam; if (X<0||X>=320||Y<0||Y>=144) return; fb.px(X,Y,tint?M.tintPx(tint,c,X,Y):c); }
  for (x=0;x<L;x++){ var u=x/(L-1), fw=dir>0?u:1-u, roof=(fw>0.28&&fw<0.78), top=by-(roof?h:6), y0=roof?top+Math.round(Math.max(0,Math.abs(fw-0.53)-0.18)*12):top;
    for (y=y0;y<by-2;y++){ var c=col[1]; if (y===y0) c=col[2]; if (y>by-5) c=col[0]; if (roof && y>y0 && y<by-6) c=((x%9)===0)?col[0]:(y<y0+2?P.n2:P.n1); px(x0+x,y,c); } }
  [0.2,0.8].forEach(function(f){ var cx=x0+L*f; for (var a=-2;a<=2;a++) for (var b=-2;b<=2;b++) if (a*a+b*b<=5) px(cx+a,by-2+b,(a*a+b*b<=1)?P.m2:P.k1); });
  px(dir>0?x0+L-1:x0,by-5,P.y4); }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam, we=WE, tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null;
  // ein Auto auf der nahen Spur, selten eins gegenüber
  var per=13, ph=t%per, x0=-50+ph*48; if (x0<W+10) car(fb,x0,ST.nl[1]-1,1,[P.s3,P.s4,P.s5],32,tint,cam);
  var ph2=(t+5)%19, x1=W+30-ph2*40; if (x1>-40) car(fb,x1,ST.fl[1]-1,-1,[P.r1,P.r2,P.r3],28,tint,cam);
  // Laub weht über den Gehweg (bei Bura viel und schnell)
  var n=we==='bura'?14:(we==='rain'?0:5);
  for (var i=0;i<n;i++){ var sp=(we==='bura'?70:12)+hash(i,3)*30, lx=rd(((hash(i,1)*560+t*sp)%560)-40-cam), ly=rd(ST.curb+4+hash(i,2)*26+Math.sin(t*3+i)*(we==='bura'?4:1)-(we==='bura'?Math.abs(Math.sin(t*2+i))*8:0));
    if (lx<0||lx>=319||ly<0||ly>=144) continue; var c=i%2?P.e3:P.y2; if (tint) c=M.tintPx(tint,c,lx,ly); fb.px(lx,ly,c); fb.px(lx+1,ly+(Math.floor(t*6+i)%2),M.DN[c]); }
  if (we==='bura' && tod==='day') for (var j=0;j<3;j++){ var spd=22+hash(j,3)*18, cx=((hash(j,1)*W+t*spd)%(W+60))-30-cam, cy=5+hash(j,2)*24, L=10+hash(j,4)*16;
    for (var q=0;q<L;q++){ var X=rd(cx+q), Y=rd(cy+Math.sin(q*0.5+j)*0.6); if (X<0||X>=320||Y<0) continue; if (!SKYM[Y*W+X+cam]) continue; var a=1-Math.abs(q/L-0.5)*2; if (bayer(X,Y)<a*0.8) fb.px(X,Y,P.b5); } } }
function front(fb,v,S,GS){ var we=WE;
  if (we==='rain') M.rain(fb,v.t,{n:95,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:250,slant:0.2});
  if (we==='bura') M.scn.buraDebris(fb,v.t,110,140,v.cam); }
// Geistersicht: entlang der Straße eine Linie aus Kälte, die alte Front, sehr zart; Raureif-Splitter daran
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  for (var s=0;s<320;s++){ var X=s+cam, y=rd(ST.med[0]-1+Math.sin(X*0.05+t*0.4)*0.8+Math.sin(X*0.17-t*0.9)*0.5); var ph=(Math.sin(X*0.07-t*0.8)+1)/2; if (ph<0.25 && (s%3)) continue;
    fb.px(s,y,ph>0.85?P.x6:(ph>0.5?P.x5:P.x3)); if (ph>0.6 || hash(X,3)<0.12){ fb.px(s,y-1,P.x3); fb.px(s,y+1,P.x2); } if (hash(X,7)<0.05 && bayer(s,y)<0.5) fb.px(s,y-2,P.x2); } }

// ---------------------------------------------------------------- Lauffläche: unser Gehweg
function walk(x,y){ if (y<114||y>138||x<6||x>474) return false; if (x>BENCH.x0-1 && x<BENCH.x1+1 && y<BENCH.by+2) return false; if (x>TIRES.x-11 && x<TIRES.x+12 && y<TIRES.by+2) return false; if (Math.abs(x-SIGN.x)<2 && y<SIGN.by+1) return false; return true; }
M.defineArt('bulevar',{
  width:W, paint:paint, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{
    exit:[0,88,12,56], to_vulk:[W-22,100,22,44],
    gymnasium:[GYM.x0,GYM.top-14,GYM.x1-GYM.x0,GY-GYM.top+14],
    bank_ruin:[BANK.x0-6,0,BANK.x1-BANK.x0+12,GY],
    bench:[BENCH.x0-1,BENCH.by-20,BENCH.x1-BENCH.x0+3,21],
    holes:[OLD.x0,OLD.top-2,OLD.x1-OLD.x0,GY-OLD.top+2],
    sign:[SIGN.x-M.microWidth('VULKANIZER RAJIC')-6,SIGN.top,M.microWidth('VULKANIZER RAJIC')+16,14]
  },
  stands:{ exit:[10,126,'L'], to_vulk:[468,126,'R'], gymnasium:[78,120,'B'], bank_ruin:[240,126,'B'], bench:[268,124,'B'], holes:[372,120,'B'], sign:[414,126,'B'] },
  actorPos:{},
  start:[24,126,'R'], entries:{ map:[16,126,'R'], vulkanizer:[462,126,'L'] }
});
})(M);
