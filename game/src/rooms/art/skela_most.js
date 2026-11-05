/* ===== rooms/art/skela_most.js — Skela, die neue Brücke (320 px) =====
   Auf einer schmalen Betonbrücke von 1998 über die Neretva. Vorn die Fahrbahn aus Betonplatten mit Bordsteinen, dahinter das
   Rohrgeländer und eine Laterne. Links der Brückenkopf am rechten Ufer mit der Spendertafel aus Messing (Text erfunden, ohne
   echte Organisationen), rechts der Brückenkopf am linken Ufer. Über das Geländer der Blick flussab: links das Hochufer, rechts das
   flache Ufer mit Weiden und Feldern, tief unten der grüne Fluss, der nach links hinter die Felswand biegt. Die Stümpfe und das
   Seil sieht man von hier nicht, nur den Fluss. In der Finalnacht, wenn die Fähre übersetzt, ein blasses Licht weit unten. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144;
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function puff(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bx=0, by=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.15+hash(gx+i+sd,gy+j)*0.7)*sx, cy=(gy+j+0.15+hash(gx+i,gy+j+sd*1.7)*0.7)*sy;
    var dx=(x-cx)/sx, dy=(y-cy)/sy, d=dx*dx+dy*dy; if (d<b1){ b2=b1; b1=d; bx=dx; by=dy; } else if (d<b2) b2=d; }
  var v=0.6-by*0.75-bx*0.25-b1*0.3; if (b2-b1<0.1) v-=0.32; return v; }
var REG=new Uint8Array(W*H), RG={none:0,sky:1,hill:2,bank:3,water:4,cliff:5,deck:6,rail:7,conc:8,plaque:9,veg:10};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Geometrie
var RT=100, RM=108, DK=116;                                   // Handlauf, Mittelholm, Fahrbahnkante hinten
var POSTS=[]; for (var px=40;px<300;px+=18) POSTS.push(px);
var LAMP={x:196,top:42};
var PLQ={x0:8,y0:72,w:52,h:36};                               // Spendertafel am Brückenkopf (Betonpfeiler)
// der Fluss im Blick flussab: kommt unter der Brücke hervor und windet sich nach links in die Ferne
function rivC(y){ var t=cl((y-62)/(DK-62),0,1); return lerp(70,170,Math.pow(t,0.9))+Math.sin(t*5.2)*14*(1-t*0.4); }
function rivW(y){ var t=cl((y-62)/(DK-62),0,1); return 3+t*t*70; }
function cliffEdge(y){ var t=cl((y-62)/(DK-62),0,1); return rivC(y)-rivW(y)-2-t*4; }           // Fuß des Hochufers links
var VPX=70;
// ---------------------------------------------------------------- Himmel, Berge
function paintSky(b,tod,wea){ var w=RW(b,RG.sky), x, y;
  if (wea==='grey'){ M.scn.sky(w,0,0,W,60,tod,'grey',41); return; }
  if (tod==='night'){ var NR=R('k0 k1 k2 n0 n1'), dark=wea==='frost'; for (y=0;y<60;y++) for (x=0;x<W;x++) w.px(x,y,ra(NR,(dark?0.04:0.1)+Math.pow(y/60,1.5)*(dark?0.5:0.6),x,y));
    for (y=0;y<52;y++) for (x=0;x<W;x++){ var m=Math.exp(-Math.pow((y-(8+x*0.12))/8,2))*fbm(x*0.6,y*1.2,9,4); if (m>0.25 && bayer(x,y)<(m-0.25)*(dark?0.9:0.6)) w.px(x,y,m>0.5?P.n1:P.n0); }
    var r=M.rng(dark?91:63); for (var s=0;s<(dark?300:220);s++){ var sx=Math.floor(r()*W), sy=Math.floor(Math.pow(r(),1.3)*52), q=r(); w.px(sx,sy,q<0.06?P.n5:(q<0.3?P.n4:(q<0.7?P.n3:P.n2))); } return; }
  var DR=R('b0 b1 b2 b3 b4 b5'); for (y=0;y<60;y++) for (x=0;x<W;x++) w.px(x,y,ra(DR,0.14+Math.pow(y/60,1.3)*0.82,x,y));
  var r2=M.rng(53); for (var i=0;i<4;i++){ var cx=r2()*W, cy=4+r2()*20, L=40+r2()*70; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.05+Math.sin(k*0.08)*1.2); if (bayer(xx,yy)<0.38*(1-Math.abs(k/L-0.5)*2)) w.px(xx,yy,yy<14?P.b3:P.b4); } } }
function paintHills(b,tod,wea){ var w=RW(b,RG.hill), x, y;
  for (x=0;x<W;x++){ var rf=rnd(30+Math.sin(x*0.02+1)*6+Math.sin(x*0.07)*2); for (y=rf;y<64;y++) w.px(x,y,ra(wea==='grey'?R('m2 m3 s3 m4'):R('m2 b2 m3 b3'),0.62-(y-rf)/60+(fbm(x,y,14,5)-0.5)*0.12+(y===rf?0.12:0),x,y)); }
  for (x=0;x<W;x++){ var rn=rnd(44+Math.sin(x*0.03+2)*5+Math.sin(x*0.09)*1.5); for (y=rn;y<66;y++){ var v2=0.5+(fbm(x*0.4,y*0.8,22,7)-0.5)*0.5-(y-rn)*0.006+(y===rn?0.2:0), c=ra(R('e1 e2 s2 e3 s3 s4'),v2,x,y);
      var sc=puff(x,y,2.6,2,15); if (sc>0.42 && fbm(x,y,8,17)>0.45) c=sc>0.55?P.g2:P.g1; w.px(x,y,c); } }
  if (tod!=='night') M.fogBake(b,function(x,y){ return REG[y*W+x]===RG.hill?0.3:0; },{col:wea==='grey'?P.m4:P.b4}); }

// ---------------------------------------------------------------- Blick flussab: Hochufer links, flaches Ufer rechts, der Fluss tief unten
var WBA=new Float32Array(W*H), WK=new Float32Array(W*H), WR=null, TODN='day', WEA='calm', FIN=false;
function wcol(x,y,t){ var k=y*W+x, kk=WK[k], v=WBA[k], dx=(x-rivC(y))/kk;
  var f=Math.sin(dx*0.12+y*1.4/kk-t*1.1)*0.5+Math.sin(dx*0.37-y*2.2/kk-t*1.9)*0.3+Math.sin(y*3.1/kk-t*2.6)*0.2;
  var c=ra(WR,v+f*0.1,x,y); if (f>0.78 && ((x+y)%3===0)) c=WEA==='grey'?P.m3:P.a5; return c; }
function paintView(b,tod){ var wb=RW(b,RG.bank), wc=RW(b,RG.cliff), ww=RW(b,RG.water), x, y;
  for (y=60;y<DK;y++){ var t=cl((y-62)/(DK-62),0,1), kk=0.2+t*0.95, c0=rivC(y), hw=rivW(y), ce=cliffEdge(y);
    for (x=0;x<W;x++){ var k=y*W+x;
      if (x<ce){ // Hochufer links: Kalkwand mit Bänken, oben Gestrüpp; nach links hin höher
        var top=60-(ce-x)*0.22, u=(y-top)/Math.max(1,DK-top), f=fbm(x*0.8,y*0.5,6,8), band=Math.floor((y+Math.sin(x*0.08)*2)/3);
        var c=(y<top+2)?(hash(x,y)<0.5?P.g2:P.e2):ra(R('s1 s2 s3 s4 s5'),0.64-u*0.3+(f-0.5)*0.35+((band%2)?0.06:-0.04),x,y); if (f>0.64 && hash(x,y)<0.6) c=hash(x,y)<0.5?P.g1:P.g2; if (x>ce-2) c=P.s1; if (y<top) continue; wc.px(x,y,c); }
      else if (Math.abs(x-c0)<=hw){ WK[k]=kk; WBA[k]=0.6-t*0.22+(fbm((x-c0)/kk*0.3,y*0.9,9,3)-0.5)*0.2+(Math.abs(x-c0)>hw-1.5?0.1:0); ww.px(x,y,P.a3); }
      else if (x>c0+hw){ // flaches Ufer rechts: Böschung, Wiese, Felder in Streifen
        var d=x-c0-hw, fi=Math.floor((x*0.6+y*2)/18), c2; if (d<1.5+t*2) c2=hash(x,y)<0.5?P.e2:P.g2; else if (hash(fi,3)<0.35) c2=ra(R('e1 e2 e3'),0.5+(hash(x>>1,y)-0.5)*0.5,x,y); else c2=ra(R('g2 e2 g3 e3 e4'),0.45+(fbm(x*0.5,y*1.2,9,4)-0.5)*0.5+(hash(x,y)-0.5)*0.15,x,y); wb.px(x,y,c2); }
      else { // Kiesbank zwischen Fluss und Felswand
        wb.px(x,y,hash(x,y)<0.5?P.s3:P.e3); } } }
  // Weiden am flachen Ufer, Pappeln, ein Zaun; in der Ferne zwei Dächer
  [[118,66,4],[150,72,7],[196,80,10],[248,92,14],[292,104,16]].forEach(function(p,i){ var cx=p[0], by=p[1], h=p[2];
    for (y=by-h;y<by;y++) for (x=cx-h;x<=cx+h;x++){ var dx=(x-cx)/h, dy=(y-by+h*0.45)/(h*0.6); if (dx*dx+dy*dy>1) continue; if (hash(x,y+i)<0.25) continue; wb.px(x,y,ra(R('g1 e2 g2 e3'),0.3+puff(x,y,2.2,1.8,i)*0.4,x,y)); } wb.vl(cx,by-2,by+1,P.w1); });
  [[104,63,8],[226,80,20],[268,86,24]].forEach(function(p,i){ var cx=p[0], by=p[1], h=p[2]; for (y=by-h;y<by;y++){ var tt=(y-(by-h))/h, hw2=Math.max(0.5,Math.sin(tt*Math.PI)*h*0.1); for (x=Math.floor(cx-hw2);x<=Math.ceil(cx+hw2);x++) if (hash(x*3,y)<0.7) wb.px(x,y,hash(x,y)<0.5?P.e2:P.w2); } });
  [[136,64],[170,66]].forEach(function(r){ for (var k=0;k<3;k++) for (x=r[0]-4+k;x<r[0]+5-k;x++) wb.px(x,r[1]-k,(x+k)%3?P.t2:P.t1); wb.rect(r[0]-3,r[1]+1,7,3,P.s4); wb.px(r[0]-1,r[1]+2,P.k1); });
  for (x=200;x<W;x+=4){ var fy=rnd(lerp(74,106,(x-200)/120)); wb.vl(x,fy-3,fy,P.w1); }
  // Büsche auf der Kante des Hochufers
  for (var q=0;q<40;q++){ var by2=62+Math.floor(hash(q,1)*40), bx2=rnd(cliffEdge(by2))-3-Math.floor(hash(q,2)*40); for (var j=0;j<6;j++) wc.px(bx2+Math.floor(hash(q,j)*5)-2,by2-Math.floor(hash(j,q)*3),hash(q,j+3)<0.5?P.g2:P.g1); } }
// ---------------------------------------------------------------- Brücke: Fahrbahn, Bordsteine, Rohrgeländer, Laterne, Brückenköpfe, Tafel
function paintDeck(b){ var w=RW(b,RG.deck), x, y;
  // Gesims der Brücke hinten (die Außenkante, über den Fluss)
  for (x=0;x<W;x++){ w.px(x,DK-3,P.s4); w.px(x,DK-2,P.s3); w.px(x,DK-1,P.s2); }
  // Bordstein hinten, Fahrbahn aus Betonplatten mit Fugen, Rinne, ein Abflussloch, Bordstein vorn
  for (y=DK;y<H;y++) for (x=0;x<W;x++){ var c;
    if (y<DK+3) c=(y===DK)?P.s5:(y===DK+1?P.s4:P.s2);
    else if (y>=H-5) c=(y===H-5)?P.s5:(y===H-4?P.s4:P.s2);
    else { var v=0.5+(fbm(x*0.7,y*1.4,8,5)-0.5)*0.35+(hash(x,y)-0.5)*0.12, j=(x%40===0); c=ra(R('m1 m2 s2 m3 s3'),v,x,y); if (j) c=P.m1; if (y===DK+3||y===H-6) c=P.e2; if (hash(x*3,y*5)<0.02) c=P.s4;
      if (Math.abs(y-(DK+12))<1.2 && hash(x>>2,1)<0.6) c=M.DN[c]; }                                                          // Reifenspur
    w.px(x,y,c); }
  [[70,DK+4],[230,DK+4]].forEach(function(p){ w.rect(p[0],p[1],5,2,P.k1); w.px(p[0]+1,p[1],P.m1); w.px(p[0]+3,p[1],P.m1); });
  // Laub und Splitt in der Rinne
  for (var i=0;i<40;i++){ var lx=Math.floor(hash(i,7)*W), ly=DK+3+Math.floor(hash(i,8)*2); w.px(lx,ly,hash(i,9)<0.5?P.e3:P.w3); } }
function paintRail(b){ var w=RW(b,RG.rail), x, y;
  // Rohrgeländer: Pfosten, Handlauf, Mittelholm, verzinkt, etwas Rost
  POSTS.forEach(function(px){ for (y=RT;y<DK;y++){ w.px(px,y,P.m3); w.px(px+1,y,P.m1); } w.px(px,RT-1,P.m4); w.px(px+1,RT-1,P.m2); w.px(px,DK-4,P.m1); w.px(px+1,DK-4,P.k2); });
  for (x=30;x<W-24;x++){ w.px(x,RT,P.m4); w.px(x,RT+1,P.m2); w.px(x,RM,P.m3); w.px(x,RM+1,P.m1); if (hash(x>>2,3)<0.08){ w.px(x,RT+1,P.t1); w.px(x,RM+1,P.t1); } }
  // Laterne: Mast mit Ausleger und Leuchte
  for (y=LAMP.top;y<DK;y++){ w.px(LAMP.x,y,P.m3); w.px(LAMP.x+1,y,P.m1); } w.rect(LAMP.x-1,DK-6,4,6,P.m2); w.hl(LAMP.x-1,LAMP.x+2,DK-6,P.m3);
  for (x=LAMP.x;x<LAMP.x+9;x++) w.px(x,LAMP.top+rnd(Math.sin((x-LAMP.x)/9*Math.PI)*-1.5),P.m2);
  w.rect(LAMP.x+7,LAMP.top,5,3,P.m1); w.hl(LAMP.x+6,LAMP.x+12,LAMP.top,P.m2); w.hl(LAMP.x+8,LAMP.x+10,LAMP.top+3,P.s4); }
function paintHeads(b){ var w=RW(b,RG.conc), p=RW(b,RG.plaque), x, y;
  // linker Brückenkopf: Betonpfeiler mit der Tafel, dahinter das Hochufer
  for (y=PLQ.y0-6;y<DK;y++) for (x=0;x<PLQ.x0+PLQ.w+8;x++){ var c=(y<PLQ.y0-4)?P.s5:(x>PLQ.x0+PLQ.w+5?P.s2:(hash(x>>1,y>>1)<0.5?P.s3:P.s4)); if (hash(x*3,y)<0.04) c=P.s2; if (fbm(x,y,5,3)>0.7) c=P.g2; w.px(x,y,c); }
  for (x=0;x<PLQ.x0+PLQ.w+8;x++){ w.px(x,PLQ.y0-6,P.s6); w.px(x,PLQ.y0-5,P.s5); } for (y=PLQ.y0-6;y<DK;y++) w.px(PLQ.x0+PLQ.w+7,y,P.s1);
  // die Tafel: Messing, Schraubenköpfe, erhabene Schrift (erfunden)
  var x0=PLQ.x0, y0=PLQ.y0, pw=PLQ.w, ph=PLQ.h;
  for (y=y0;y<y0+ph;y++) for (x=x0;x<x0+pw;x++){ var c2=(x===x0||y===y0)?P.y4:((x===x0+pw-1||y===y0+ph-1)?P.y1:(hash(x,y)<0.12?P.y3:P.y2)); if (fbm(x,y,4,6)>0.72 && (x<x0+3||x>x0+pw-4||y>y0+ph-3)) c2=P.a3; p.px(x,y,c2); }
  [[x0+2,y0+2],[x0+pw-3,y0+2],[x0+2,y0+ph-3],[x0+pw-3,y0+ph-3]].forEach(function(s){ p.px(s[0],s[1],P.y4); p.px(s[0]+1,s[1]+1,P.y0); });
  var L=['OVAJ MOST JE','IZGRAĐEN','1998. GODINE','DONACIJOM','DOBRIH LJUDI','ZA SKELU'];
  L.forEach(function(t,i){ var tw=sw(t), tx=x0+Math.round((pw-tw)/2), ty=y0+3+i*5; st(p,t,tx+1,ty,P.y0); });
  // rechter Brückenkopf: niedrige Mauer, der Weg ins Dorf
  for (y=RT-2;y<DK;y++) for (x=W-26;x<W;x++){ var c3=(y<RT)?P.s5:(hash(x>>1,y>>1)<0.5?P.s3:P.s4); if (x===W-26) c3=P.s2; w.px(x,y,c3); }
  for (x=W-26;x<W;x++) w.px(x,RT-2,P.s6); }
// Mikroschrift mit Đ und den Haken der Mikroschrift
function st(b,s,x,y,c){ var cx=x; s.split('').forEach(function(ch){ if (ch==='Đ'){ M.microText(b,'D',cx,y,c); b.px(cx-1,y+2,c); cx+=M.microWidth('D')+1; return; } M.microText(b,ch,cx,y,c); cx+=M.microWidth(ch)+1; }); }
function sw(s){ var w=0; s.split('').forEach(function(ch){ w+=M.microWidth(ch==='Đ'?'D':ch)+1; }); return w-1; }

// ---------------------------------------------------------------- Bild
var LAST=null;
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0); REG.fill(0); if (tod!=='night') tod='day'; TODN=tod; WEA=wea; FIN=wea==='frost';
  WR=wea==='grey'?R('a1 a2 m1 a3 m2 a4 m3'):R('a1 a2 g2 a3 g3 a4 a5');
  paintSky(b,tod,wea); paintHills(b,tod,wea); paintView(b,tod);
  for (var k=0;k<W*H;k++) if (REG[k]===RG.water) b.d[k]=wcol(k%W,(k/W)|0,0);
  paintDeck(b); paintRail(b); paintHeads(b);
  if (FIN) for (var y=1;y<H;y++) for (var x=0;x<W;x++){ var kk=y*W+x, r=REG[kk]; if ((r===RG.rail||r===RG.deck||r===RG.conc) && REG[kk-W]!==r && hash(x,y)<0.5) b.d[kk]=P.s5; if (r===RG.deck && hash(x*1.3,y*2.1)<0.03) b.d[kk]=P.s4; }
  M.light(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; var v=0; if (r===RG.deck) v+=(y-DK)/28*0.25; if (r===RG.water||r===RG.cliff||r===RG.bank) v-=0.05; if (wea==='grey') v-=0.15; var cx=(x-160)/220, cy=(y-80)/110; v-=Math.max(0,cx*cx+cy*cy-0.3)*0.5; return v; },0,0);
  if (wea==='grey') M.fogBake(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; if (r===RG.hill) return 0.35; if (y<90 && r!==RG.rail) return 0.25*(1-(y-58)/40); return 0.03; },{col:P.m4});
  if (FIN) M.light(b,function(x,y){ var r=REG[y*W+x]; return r===RG.sky?0:-0.8; },0,0);
  var base=b.clone(), lights=tod==='day'?[]:[[LAMP.x+9,LAMP.top+16,22,26,0.75],[LAMP.x+9,DK+10,64,14,0.8],[LAMP.x+4,DK-8,40,12,0.55]];
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; }, after:function(o,tod){ if (tod==='day') return; warmPass(o,base,lights); o.hl(LAMP.x+8,LAMP.x+10,LAMP.top+3,P.y5); o.px(LAMP.x+9,LAMP.top+3,P.l1); } });
  return LAST; }
// warme Lichtinseln in Stufen (wie in Vratnik): weich auslaufend statt grob gerastert
var DIMW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+r*0.12+12, L*0.38+g*0.08+8, L*0.26+b*0.1+16]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.45+L*0.36+16, g*0.32+L*0.26+6, b*0.16+L*0.08+4]; });
function warmPass(o,base,L){ if (!L.length) return; var LT=M.TINT.lamp;
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, rg=REG[k]; if (rg!==RG.deck&&rg!==RG.rail&&rg!==RG.conc&&rg!==RG.plaque) continue; var v=0;
    for (var i=0;i<L.length;i++){ var l=L[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], f=1-dx*dx-dy*dy; if (f>0){ var q=l[4]*Math.pow(f,1.15); if (q>v) v=q; } }
    if (v<0.03) continue; var f2=v*3.3, lv=Math.floor(f2), fr=f2-lv, t=lv===0?fr:(fr-0.5)*1.7+0.5; if (t>bayer(x,y)) lv++; if (lv<=0) continue;
    var c=base.d[k]; o.d[k]=lv===1?M.tintPx(DIMW,c,x,y):(lv===2?M.tintPx(MIDW,c,x,y):(lv===3?M.tintPx(LT,c,x,y):M.UP[M.tintPx(LT,c,x,y)])); } }

// ---------------------------------------------------------------- jedes Bild: Fluss, Laterne, ein blasses Licht weit unten (Finalnacht)
function tintC(c,x,y){ return (TODN!=='day'&&M.TINT[TODN])?M.tintPx(M.TINT[TODN],c,x,y):c; }
function dynamic(fb,v,S,GS){ var t=v.t, x, y;
  for (y=58;y<DK;y++) for (x=0;x<W;x++){ var k=y*W+x; if (REG[k]!==RG.water) continue; var c=wcol(x,y,t); if (FIN) c=M.DN[c]; if (WEA==='grey') c=M.mix(c,P.s4,2); fb.d[k]=tintC(c,x,y); }
  if (TODN==='night'){ M.glow(fb,LAMP.x+9,LAMP.top+4,7,t,0.55); for (y=DK-30;y<DK-3;y++){ var xx=LAMP.x+9+Math.round(Math.sin(y*0.8+t*2)*1.5); if (REG[y*W+xx]===RG.water && Math.sin(y*1.6+t*3)>0.2) fb.d[y*W+xx]=P.y2; } }
  // die Geisterfähre, weit flussab: nur ein Licht und ein Hauch von Geländer
  var g=GS&&GS.flags?GS.flags['k3.fin.ferry']:null; if (g==='mid'||g==='here'||S.ferry==='mid'){ var fy=70, fx=rnd(rivC(fy))+Math.round(Math.sin(t*0.3)*1), al=0.6+Math.sin(t*1.3)*0.2;
    for (var i=-4;i<=4;i++){ var k2=fy*W+fx+i; if (REG[k2]===RG.water) fb.d[k2]=M.mix(fb.d[k2],P.x4,5); } fb.px(fx-1,fy-2,P.x3); fb.px(fx+3,fy-2,P.x3); fb.px(fx+1,fy-3,al>0.6?P.y4:P.y3); M.glow(fb,fx+1,fy-3,3,t,0.5); } }
function front(fb,v,S,GS){ if (M.scn.weather(GS)==='grey') M.fogDrift(fb,v.t,{y0:58,y1:98,amt:0.3,k:2,col:P.m4,speed:3}); }
// Vordergrund: der vordere Bordstein mit einem niedrigen Rohr (Figuren stehen dahinter)
function layers(S,GS,tod){ if (!LAST) return []; var l=M.layer(0,H-7,W,7,H+4), w=M.lw(l);
  for (var x=0;x<W;x++){ w.px(x,H-6,P.m3); w.px(x,H-5,P.m1); } for (var px=12;px<W;px+=24){ w.vl(px,H-6,H-1,P.m2); w.vl(px+1,H-6,H-1,P.m0); }
  if (tod!=='day') M.tintApply(l,M.TINT[tod]); return [l]; }
M.defineArt('skela_most',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, front:front,
  walk:function(x,y,S,GS){ return y>=118 && y<=134 && x>=6 && x<=314; }, walkG:function(){ return false; },
  spots:{ exit_d:[0,96,12,48], exit_l:[308,96,12,48], plaque:[PLQ.x0-2,PLQ.y0-2,PLQ.w+4,PLQ.h+4], railing:[70,RT-2,110,DK-RT+2], river:[60,64,124,34], lamp:[LAMP.x-3,LAMP.top-2,16,DK-LAMP.top] },
  stands:{ exit_d:[10,126,'L'], exit_l:[310,126,'R'], plaque:[40,120,'B'], railing:[120,120,'B'], river:[160,120,'B'], lamp:[200,120,'B'] },
  actorPos:{ vlado:[104,125,'R'], kata:[128,128,'R'] }, start:[16,126,'R'], entries:{ skela_d:[14,126,'R'], skela_l:[306,126,'L'] }
});
})(M);
