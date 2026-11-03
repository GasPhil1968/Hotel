/* ===== rooms/art/ferhadija.js — Ferhadija: die Fußgängerzone im österreichisch-ungarischen Sarajevo (640 px, scrollend).
   Links das Eckhaus mit der Ewigen Flamme: eine Nische unter der Inschrift, davor Kränze und eine Kette (ruhig, würdevoll).
   Daneben das Café „Šeher“ mit Markise und Stühlen, die Litfaßsäule mit dem Jazzfest-Plakat, das niedrige Haus mit der Passage
   (Rundbogen, am Arm das Schild „ANTIKVARIJAT ↓“), darüber im Dunst ein Minarett. Ein Haus mit zwei Läden unter Markisen, eine Bank.
   Rechts, etwas zurückgesetzt auf ihrem Platz, die neugotische Kathedrale mit zwei Türmen, Rosette, Portal, Stufen und Tauben.
   Große Steinplatten; in der Mitte im Pflaster eine Sarajevoer Rose. Narben von Granatsplittern an den Fassaden, leise.
   k2_s1 Nebel (die Türme verschwinden im Dunst), k2_s2 Regen (nasse Platten spiegeln), k2_s2_n Nacht im Regen (Läden, Laternen, Flamme). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=640, H=144, GY=100, GF=60, FH=17;                  // Fußlinie der Fassaden, Oberkante Erdgeschoss, Geschosshöhe
var HZ=40, VPX=320;                                       // Fluchtpunkt der Platten
var MEM={x0:44,x1:126};                                   // Gedenkwand mit der Flamme
var NICHE={cx:85,top:83,bot:97,hw:7};                     // Nische mit der Flamme
var FLAME=[85,93];                                        // Fuß der Flamme
var CAFE={x0:160,x1:262};
var COL={cx:268,base:107,r:17,top:60};                    // Litfaßsäule
var PAS={x0:290,x1:322,spr:72,top:56};                    // Passage: Kämpfer, Scheitel
var SIGN={x0:325,y0:50,w:61,h:11};                        // Schild am Arm
var SHOPS=[{x0:352,x1:394,name:'OBUĆA',aw:'r'},{x0:402,x1:442,name:'ZLATARA',aw:'g'}];
var BENCH={x0:404,x1:434,by:108};
var CAT={x0:460,x1:628,base:88,lt:[460,504],rt:[584,628],por:[521,561]};   // Kathedrale: Türme, Portal
var ROSEW={cx:541,cy:30,r:11};
var ROSE={cx:372,cy:127};                                 // Sarajevoer Rose im Pflaster
var LAMPS=[140,396,452];                                  // Laternen (Mast), Fuß bei y=106
var LB=106, LH=40;
var PUD=[[118,124,11,2],[236,133,14,2.5],[470,126,12,2],[566,136,16,2.6],[330,138,10,2]];
var WET=false, FOG=false, NIGHT=false, TOD='day';

// ---------------------------------------------------------------- Masken (vom letzten paint)
// CODE: 0 vorn, 1 Himmel, 2 ferne Stadt, 3 Kathedrale, 4 Fassaden, 5 Pflaster
var CODE=new Uint8Array(W*H), GLW=new Uint16Array(W*H), WINS=[];
function track(b){ b.code=0; b.gw=0;
  b.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; var k=y*W+x; this.d[k]=c; CODE[k]=this.code; GLW[k]=this.gw; };
  b.rect=function(x,y,w,h,c){ for (var j=Math.max(0,y|0);j<Math.min(H,(y|0)+h);j++) for (var i=Math.max(0,x|0);i<Math.min(W,(x|0)+w);i++){ var k=j*W+i; this.d[k]=c; CODE[k]=this.code; GLW[k]=this.gw; } };
  return b; }
function glass(b,x,y,w,h,kind,fn,lit){ WINS.push({x:x,y:y,w:w,h:h,k:kind,lit:lit}); b.gw=WINS.length; for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=fn(xx,yy); if (c!==undefined) b.px(xx,yy,c); } b.gw=0; }

// ---------------------------------------------------------------- kleine Helfer
function rnd(v){ return Math.round(v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function shade(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
// Schildschrift 3×5 wie M.microText, aber Hatschek und Akut als eigene Pixel über dem Buchstaben (braucht 2 px Platz darüber)
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'};
function signText(b,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž'){ b.px(cx,y-2,c); b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); }
    else if (ch==='Ć'){ b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); }
    else if (ch==='Đ'){ b.px(cx-1,y+2,c); b.px(cx+1,y+2,c); }
    cx+=w+1; }); return cx; }
function signWidth(s){ var w=0; s.toUpperCase().split('').forEach(function(ch){ w+=M.microWidth(DIA[ch]||ch)+1; }); return Math.max(0,w-1); }
function lift(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
// Ruß und Regenspuren unter Gesimsen (Kohlerauch im Winter)
function soot(b,x0,x1,y0,depth,amt,sd){ for (var x=x0;x<x1;x++){ var d=depth*(0.3+0.9*fbm(x*1.3,y0,6,sd)); for (var y=y0;y<y0+d;y++) if (bayer(x,y)<amt*(1-(y-y0)/d)) shade(b,x,y,1); } }
function streaks(b,x0,x1,y0,y1,sd,amt){ for (var x=x0;x<x1;x++){ var s=fbm(x*2.1,sd,5,sd); if (s<0.6) continue; var L=(s-0.6)*(y1-y0)*2.4; for (var y=y0;y<Math.min(y1,y0+L);y++) if (bayer(x,y)<amt*(1-(y-y0)/L)) shade(b,x,y,1); } }
// Narben von Granatsplittern: kleine dunkle Kerben mit hellem Rand, in einer lockeren Gruppe
function scars(b,cx,cy,rx,ry,n,sd){ var r=M.rng(sd); for (var i=0;i<n;i++){ var a=r()*6.283, d=Math.pow(r(),0.7), x=rnd(cx+Math.cos(a)*rx*d), y=rnd(cy+Math.sin(a)*ry*d);
    shade(b,x,y,2); if (r()<0.5) shade(b,x+1,y,1); lift(b,x,y-1,1); if (r()<0.25){ shade(b,x,y+1,1); shade(b,x-1,y,1); } } }

// ---------------------------------------------------------------- Himmel und ferne Stadt
function sky(b,tod,wea){ b.code=1; var w=(wea==='bura'||wea==='calm')?'calm':wea;
  if (w==='calm') M.sky(b,0,0,W,GY,tod,17); else M.scn.sky(b,0,0,W,GY,tod,wea,17);
  b.code=0; }
function farCity(b){ b.code=2; var x, y;
  // Hügel im Norden, kaum zu sehen
  for (x=0;x<W;x++){ var hy=30+Math.round(Math.sin(x*0.013+0.7)*6+Math.sin(x*0.041)*2.5); for (y=hy;y<GY;y++) b.px(x,y,ra(R('m1 m2 m3'),0.55-(y-hy)/50,x,y)); }
  // Dächer und Giebel hinter dem niedrigen Haus und neben der Kathedrale
  var r=M.rng(41); for (x=270;x<W;){ var w=8+Math.floor(r()*14), h=6+Math.floor(r()*12), top=40-h; for (y=top;y<GY;y++) for (var xx=x;xx<x+w&&xx<W;xx++){ var c=(xx===x)?P.s3:P.s2; if (y<top+2) c=(xx+y)%3?P.t2:P.t1; else if (hash(xx>>1,y>>1)<0.12) c=P.k2; b.px(xx,y,c); } x+=w+(r()<0.3?2:0); }
  // Minarett der Ferhadija-Moschee hinter der Passage, schlank im Dunst
  M.scn.minaret(b,312,58,64,{stone:R('s3 s4 s5 s6'),cap:R('m1 m2 m3 m4')});
  b.code=0; }

// ---------------------------------------------------------------- Kathedrale (neugotisch, 1889): zwei Türme, Rosette, Portal
function lancet(b,x,y0,w,y1,fill,ring){ var cx=x+(w-1)/2, hw=w/2, ah=Math.max(2,Math.round(w*0.85));
  for (var y=y0;y<=y1;y++) for (var xx=x;xx<x+w;xx++){ var k=y-y0; if (k<ah){ var t=k/ah, half=hw*Math.sqrt(1-(1-t)*(1-t)); if (Math.abs(xx-cx)>half+0.15) continue; } var c=fill(xx,y,k); if (c!==undefined) b.px(xx,y,c); }
  if (ring) for (var y2=y0-1;y2<=y0+ah;y2++) for (var x2=x-1;x2<=x+w;x2++){ var k2=y2-y0, inside; if (k2<0) inside=false; else if (k2>=ah) inside=true; else { var t2=k2/ah; inside=Math.abs(x2-cx)<=hw*Math.sqrt(1-(1-t2)*(1-t2))+0.15; }
      var near=false; [[0,1],[1,0],[-1,0],[0,-1]].forEach(function(o){ var kk=y2+o[1]-y0, xx2=x2+o[0]; if (xx2<x||xx2>=x+w) return; if (kk>=ah&&kk<=y1-y0) near=true; else if (kk>=0&&kk<ah){ var tt=kk/ah; if (Math.abs(xx2-cx)<=hw*Math.sqrt(1-(1-tt)*(1-tt))+0.15) near=true; } });
      if (!inside && near) b.px(x2,y2,ring(x2,y2,x2<cx)); } }
var STN=null;
function stone(x,y,sh){ var band=Math.floor((y+2)/5)%3===0, v=0.62+(fbm(x*0.8,y*0.8,7,3)-0.5)*0.25+(band?0.12:0)-sh*0.3;
  var c=ra(STN,v,x,y); if ((y+2)%5===0 && hash(x>>2,y)<0.7) c=M.DN[c]; if (((x+Math.floor((y+2)/5)*5)%11)===0) c=M.DN[c]; return c; }
function cathedral(b){ var x, y, x0=CAT.x0, x1=CAT.x1, by=CAT.base; STN=R('s1 s2 s3 e4 s4 s5 s6'); b.code=3;
  // Mittelbau und Türme: Mauerwerk aus hellem Sandstein mit Bändern
  for (y=0;y<by;y++) for (x=x0;x<x1;x++){ var inT=(x<CAT.lt[1]||x>=CAT.rt[0]); if (!inT && y<16+Math.abs(x-541)*0.48) continue; var sh=(x>=CAT.rt[0])?0.35:(inT?0:0.15); b.px(x,y,stone(x,y,sh)); }
  // Giebel des Mittelschiffs mit Kreuzblume
  for (y=4;y<40;y++){ var hw=(y-4)*1.02; for (x=rnd(541-hw);x<=rnd(541+hw);x++){ if (x<CAT.lt[1]||x>=CAT.rt[0]) continue; var e=hw-Math.abs(x-541); b.px(x,y,e<2?(x<541?P.s6:P.s3):stone(x,y,0.2)); } }
  b.vl(541,0,4,P.s5); b.hl(539,543,1,P.s5); b.px(541,0,P.s6);
  // Strebepfeiler an den Turmkanten (gestuft)
  [CAT.lt[0],CAT.lt[1]-5,CAT.rt[0],CAT.rt[1]-5].forEach(function(px,i){ for (y=0;y<by;y++){ var step=Math.floor(y/22), w=4+(step>2?1:0); for (x=px;x<px+w;x++){ var c=stone(x,y,(x>px+w-2)?0.45:0); if (x===px) c=P.s5; b.px(x,y,c); } if (y%22===0){ b.hl(px-1,px+w,y,P.s6); b.hl(px-1,px+w,y+1,P.s2); } } });
  // Turmgeschosse: Seitenportal, Lanzettfenster, Uhr, Glockenstube (oben angeschnitten)
  [CAT.lt,CAT.rt].forEach(function(t,ti){ var cx=Math.round((t[0]+t[1])/2), sh=ti?0.35:0;
    // Gesimse
    [62,38,14].forEach(function(gy){ b.hl(t[0]+4,t[1]-6,gy,P.s6); b.hl(t[0]+4,t[1]-6,gy+1,P.s3); for (x=t[0]+5;x<t[1]-6;x+=3) b.px(x,gy+2,P.s2); });
    // Seitenportal
    lancet(b,cx-6,66,12,by-1,function(xx,yy,k){ if (k<1) return P.k1; if (yy>by-4) return P.s2; if (yy<72) return (xx===cx-6||xx===cx+5)?P.k1:P.k2; return ((xx-cx+6)%4===0)?P.w0:P.w1; },function(xx,yy,l){ return l?P.s6:P.s3; });
    lancet(b,cx-8,64,16,66,function(){ return undefined; },function(xx,yy,l){ return l?P.s5:P.s2; });
    b.hl(cx-6,cx+5,72,P.w2); b.px(cx-2,80,P.y2); b.px(cx+1,80,P.y2);
    // Zwillingsfenster
    [cx-5,cx+1].forEach(function(wx){ glass(b,wx,42,4,16,'cat',function(xx,yy){ var k=yy-42; if (k<3 && Math.abs(xx-wx-1.5)>k*0.8+0.4) return undefined; return (k<2||xx===wx)?P.k1:((yy%4===0)?P.n0:P.k2); },false); });
    b.vl(cx,44,57,P.s5); b.hl(cx-6,cx+5,58,P.s6); b.hl(cx-6,cx+5,59,P.s2);
    // Uhr: helles Zifferblatt, dunkle Zeiger (steht still auf zehn vor zwei, im Dunst kaum lesbar)
    b.ellipse(cx+0.5,25.5,7.2,7.2,P.s2); b.ellipse(cx+0.5,25.5,6,6,P.s6); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(rnd(cx+0.5+Math.cos(a)*4.8),rnd(25.5+Math.sin(a)*4.8),P.s3); }
    b.line(cx,25,cx-3,22,P.k2); b.line(cx,25,cx+2,21,P.k2); b.px(cx,25,P.k1);
    // Glockenstube
    [cx-6,cx+2].forEach(function(wx){ lancet(b,wx,0,5,12,function(xx,yy,k){ return (xx===wx)?P.k1:P.k2; },null); });
    b.vl(cx,0,12,P.s4);
    // Schatten der rechten Turmseite
    if (ti) for (y=0;y<by;y++) for (x=t[1]-3;x<t[1];x++) shade(b,x,y,1); });
  // Rosette
  var rc=ROSEW;
  b.ellipse(rc.cx+0.5,rc.cy+0.5,rc.r+2.4,rc.r+2.4,function(x,y){ var a=Math.atan2(y-rc.cy,x-rc.cx); return (Math.floor((a+3.1416)/0.3927)%2)?P.s5:P.s4; });
  b.ellipse(rc.cx+0.5,rc.cy+0.5,rc.r+0.5,rc.r+0.5,P.s2);
  glass(b,rc.cx-rc.r,rc.cy-rc.r,rc.r*2+1,rc.r*2+1,'rose',function(x,y){ var dx=x-rc.cx, dy=y-rc.cy, d=Math.hypot(dx,dy); if (d>rc.r-0.3) return undefined;
    var a=Math.atan2(dy,dx), sp=Math.abs(Math.sin(a*6)); if (d<2.2) return P.s4; if (d>rc.r-1.6) return P.s3; if (sp<0.16 && d>3) return P.s4; if (Math.abs(d-6.2)<0.6) return P.s3;
    var q=hash(Math.floor(a*3+7),Math.floor(d/2)); return d<6?(q<0.5?P.r1:P.b0):(q<0.4?P.n1:(q<0.7?P.r1:P.k2)); },false);
  // Hauptportal: Spitzbogen mit Archivolten, Tympanon, Wimperg mit Kreuzblume
  var p0=CAT.por[0], pw=CAT.por[1]-CAT.por[0];
  for (var a2=3;a2>=0;a2--) lancet(b,p0-a2*2,50-a2*2,pw+a2*4,by-1,function(xx,yy){ return yy>by-3?P.s3:((a2%2)?P.s5:P.s3); },null);
  lancet(b,p0,50,pw,by-1,function(xx,yy,k){ if (yy<66){ if (k<2) return P.s2; var tr=Math.abs(xx-541)<3&&yy>55; return tr?P.s5:((xx+yy)%5===0?P.s3:P.s4); } if (yy===66) return P.s6; if (xx===541||xx===540) return P.w0; var c=((xx-p0)%5===0)?P.w0:P.w1; if (yy%7===0) c=P.w0; return c; },null);
  b.px(536,76,P.y2); b.px(545,76,P.y2); for (y=67;y<by;y+=5){ b.hl(p0+2,p0+6,y,P.m1); b.hl(p0+pw-7,p0+pw-3,y,P.m1); }
  for (y=26;y<50;y++){ var hw2=(y-26)*0.9; for (x=rnd(541-hw2);x<=rnd(541+hw2);x++){ if (y<38 && Math.hypot(x-rc.cx,y-rc.cy)<rc.r+3) continue; var e2=hw2-Math.abs(x-541); if (e2<1.6) b.px(x,y,x<541?P.s6:P.s3); } }
  // Bogenfries unter der Rosette, Säulchen am Portal
  for (x=CAT.lt[1];x<CAT.rt[0];x++){ var ph=(x-CAT.lt[1])%6; if (Math.abs(x-541)<19) continue; b.px(x,45,ph===0?P.s2:P.s5); if (ph===0) b.vl(x,46,48,P.s3); }
  [p0-7,p0+pw+5].forEach(function(cx2){ b.vl(cx2,58,by-1,P.s6); b.vl(cx2+1,58,by-1,P.s3); b.hl(cx2-1,cx2+2,57,P.s5); });
  // Stufen (zum Platz hinab)
  for (var s=0;s<4;s++){ var sy=by+s*3; for (y=sy;y<sy+3;y++) for (x=x0-6-s*3;x<x1+6+s*3;x++){ var c=(y===sy)?P.s6:((y===sy+1)?P.s4:P.s3); if (hash(x>>2,y)<0.08) c=M.DN[c]; if (WET && y!==sy) c=M.DN[c]; b.px(x,y,c); } }
  soot(b,x0,x1,15,4,0.4,3); soot(b,x0,x1,39,3,0.35,5); soot(b,x0,x1,63,4,0.45,7);
  b.code=0; }

// ---------------------------------------------------------------- Fassaden (österreichisch-ungarisch, 1890–1910)
var BLD=[
 {x0:0,x1:150,top:9,ramp:'s2 s3 s4 s5 s6',win:[10,30,50,70,90,110,130],st:['ped','hood','seg'],roof:'mansard',seed:3,scar:[[96,30,9,5,11],[22,48,6,4,7]]},
 {x0:150,x1:284,top:9,ramp:'e2 e3 e4 s4 s5',win:[162,182,202,222,242,262],st:['seg','ped','hood'],roof:'attic',seed:7,balc:[196,43,36],scar:[[250,22,7,4,9]]},
 {x0:284,x1:350,top:26,ramp:'m2 m3 m4 s5 s6',win:[296,316,334],st:['hood','plain'],roof:'tile',seed:11},
 {x0:350,x1:446,top:9,ramp:'d3 d4 d5 t5 s5',win:[360,378,396,414,432],st:['ped','seg','hood'],roof:'mansard',seed:13,scar:[[420,40,10,6,14],[372,18,5,4,6]]}
];
function window_(b,x,y,w,h,st,rp,shut,curtain){
  b.rect(x-1,y-1,w+2,h+2,rp[4]); b.vl(x+w,y-1,y+h,rp[2]);
  glass(b,x,y,w,h,'win',function(xx,yy){ var c=(yy<y+2)?P.k1:P.k2; if (curtain && (xx===x+1||xx===x+w-2) && yy>y+1) c=P.s3; if (xx===x+(w>>1)) c=P.s4; if (yy===y+Math.round(h*0.32)) c=P.s4; if (c===P.k2 && (xx+yy*2)%9===0) c=P.n0; return c; },false);
  if (shut>0){ var sh=Math.max(1,Math.round(h*shut)); for (var yy=y;yy<y+sh;yy++) b.hl(x,x+w-1,yy,(yy-y)%2?P.s4:P.s5); b.hl(x,x+w-1,y+sh,P.s2); }
  b.hl(x-2,x+w+1,y+h+1,rp[4]); b.hl(x-2,x+w+1,y+h+2,rp[0]); b.px(x-1,y+h+3,rp[1]); b.px(x+w,y+h+3,rp[1]);
  if (st==='ped'){ for (var i=0;i<3;i++) b.hl(x-1+i,x+w-i,y-3-i,rp[4]); b.hl(x-2,x+w+1,y-2,rp[4]); b.hl(x-2,x+w+1,y-1,rp[1]); b.px(x+(w>>1),y-5,rp[3]); }
  else if (st==='seg'){ for (var j=-2;j<=w+1;j++){ var u=(j-(w-1)/2)/((w+3)/2), yy2=y-2-Math.round((1-u*u)*2.2); b.px(x+j,yy2,rp[4]); b.px(x+j,yy2+1,rp[1]); } }
  else if (st==='hood'){ b.hl(x-2,x+w+1,y-3,rp[4]); b.hl(x-2,x+w+1,y-2,rp[2]); b.hl(x-1,x+w,y-1,rp[0]); b.px(x-2,y-1,rp[3]); b.px(x+w+1,y-1,rp[3]); }
  // Brüstungsfeld mit Ornament unter dem Fenster
  if (st!=='plain'){ b.hl(x,x+w-1,y+h+5,rp[2]); b.px(x+(w>>1),y+h+4,rp[4]); b.px(x+(w>>1)-1,y+h+5,rp[4]); b.px(x+(w>>1)+1,y+h+5,rp[4]); } }
function facade(b,F){ var x0=F.x0, x1=F.x1, top=F.top, rp=R(F.ramp), x, y; b.code=4;
  for (y=top;y<GY;y++) for (x=x0;x<x1;x++){ var v=0.6+(fbm(x*0.6,y*0.8,9,F.seed)-0.5)*0.32+(hash(x>>1,y>>1)-0.5)*0.07; if (y>=GF) v-=0.06; b.px(x,y,ra(rp,v,x,y)); }
  // Ecklisenen mit Quaderung
  [x0,x1-5].forEach(function(lx,i){ for (y=top;y<GF;y++){ var q=Math.floor((y-top)/4)%2; for (x=lx;x<lx+5;x++){ if (i===0 && q && x>lx+3) continue; if (i===1 && q && x<lx+1) continue; var c=((y-top)%4===0)?rp[1]:(x===lx?rp[4]:rp[3]); b.px(x,y,c); } } });
  // Geschosse: Gurtgesimse, Fenster
  var floors=Math.round((GF-top)/FH);
  for (var f=0;f<floors;f++){ var fy=GF-(f+1)*FH, st=F.st[f%F.st.length];
    if (f>0){ b.hl(x0,x1-1,fy+FH,rp[4]); b.hl(x0,x1-1,fy+FH+1,rp[1]); }
    var wy=fy+3+f, wh=11-f;
    F.win.forEach(function(wx,i){ var sd=hash(wx,f*7+F.seed), shut=sd<0.3?0.45:(sd<0.45?0.2:(sd>0.9?1:0)); window_(b,wx,wy,7,wh,st,rp,shut,sd>0.6&&sd<0.8); }); }
  // Erdgeschoss: Quaderputz (Rustika) und kräftiges Gurtgesims darüber
  for (y=GF+1;y<GY;y++) for (x=x0;x<x1;x++){ if ((y-GF)%4===0) b.px(x,y,rp[1]); else if ((y-GF)%4===1) b.px(x,y,M.UP[b.get(x,y)]); }
  b.hl(x0,x1-1,GF-1,rp[4]); b.hl(x0,x1-1,GF,rp[3]); b.hl(x0,x1-1,GF+1,rp[0]); for (x=x0+1;x<x1;x+=3) b.px(x,GF+2,rp[1]);
  // Hauptgesims mit Konsolen, darüber Dach
  b.hl(x0-1,x1,top,rp[4]); b.hl(x0-1,x1,top+1,rp[3]); b.hl(x0,x1-1,top+2,rp[1]); for (x=x0+1;x<x1;x+=4){ b.px(x,top+3,rp[3]); b.px(x,top+4,rp[0]); b.px(x+1,top+3,rp[1]); }
  if (F.roof==='mansard'){ for (y=top-1;y>=Math.max(0,top-9);y--){ var ins=Math.floor((top-1-y)*0.4); for (x=x0+ins;x<x1-ins;x++){ var c=((x+(top-y))%5===0)?P.m0:(y<top-6?P.m1:P.m2); b.px(x,y,c); } }
      for (var dx=x0+12;dx<x1-12;dx+=26){ b.rect(dx,top-7,6,6,P.s4); b.rect(dx+1,top-5,4,4,P.k2); b.hl(dx-1,dx+6,top-8,P.m3); b.px(dx+2,top-4,P.n0); } }
  else if (F.roof==='attic'){ for (y=top-6;y<top;y++) for (x=x0;x<x1;x++){ var c2=(y===top-6)?rp[4]:((y===top-1)?rp[1]:(((x-x0)%4===1)?rp[0]:rp[3])); if (y===top-5) c2=rp[2]; b.px(x,y,c2); }
      b.rect(rnd((x0+x1)/2)-8,top-11,16,5,rp[3]); b.hl(rnd((x0+x1)/2)-8,rnd((x0+x1)/2)+7,top-11,rp[4]); M.microText(b,'1903',rnd((x0+x1)/2)-7,top-10,rp[0]); }
  else if (F.roof==='tile'){ for (y=top-1;y>=top-8;y--){ var ins2=(top-1-y); for (x=x0-1+ins2;x<x1+1-ins2;x++) b.px(x,y,((x+y*2)%4===0)?P.t1:(y<top-6?P.t3:P.t2)); } b.rect(x0+10,top-12,4,6,P.s3); b.hl(x0+9,x0+14,top-12,P.s4); }
  // Balkon mit Eisengeländer
  if (F.balc){ var bx=F.balc[0], byy=F.balc[1], bw=F.balc[2]; b.rect(bx,byy,bw,2,rp[3]); b.hl(bx,bx+bw-1,byy,rp[4]); b.hl(bx+1,bx+bw-2,byy+2,rp[0]); [bx+3,bx+bw-4].forEach(function(cx){ b.px(cx,byy+3,rp[1]); b.px(cx,byy+4,rp[0]); });
    b.hl(bx,bx+bw-1,byy-7,P.k1); b.hl(bx,bx+bw-1,byy-1,P.k2); b.vl(bx,byy-7,byy-1,P.k1); b.vl(bx+bw-1,byy-7,byy-1,P.k1);
    for (x=bx+2;x<bx+bw-1;x+=3){ b.vl(x,byy-6,byy-2,P.k2); if ((x-bx)%6===2){ b.px(x-1,byy-4,P.k2); b.px(x+1,byy-4,P.k2); } } }
  // Alter: Ruß unter Gesimsen, Regenspuren, Narben
  soot(b,x0,x1,top+5,4,0.5,F.seed); streaks(b,x0,x1,top+6,GF-2,F.seed,0.4); soot(b,x0,x1,GF+3,3,0.4,F.seed+1);
  (F.scar||[]).forEach(function(s){ scars(b,s[0],s[1],s[2],s[3],s[4],s[0]*3+s[1]); });
  // Fallrohr an der Hauskante
  if (x1<440){ for (y=top+2;y<GY;y++){ b.px(x1-2,y,P.m2); b.px(x1-1,y,P.m1); } for (y=top+8;y<GY;y+=14) b.hl(x1-3,x1-1,y,P.m3); }
  b.code=0; }

// ---------------------------------------------------------------- Die Ewige Flamme: Gedenkwand, Nische, Kränze
function memorial(b){ var x0=MEM.x0, x1=MEM.x1, x, y, n=NICHE;
  // Rahmen aus hellem Stein, innen polierter dunkler Granit (ruhig, kaum Muster)
  for (y=GF+2;y<GY;y++) for (x=x0;x<x1;x++){ var c, e=Math.min(x-x0,x1-1-x);
    if (e<3) c=(e===0)?P.s3:(x<x0+3?P.s6:P.s4);
    else { var v=0.5+(fbm(x*1.1,y*0.5,6,21)-0.5)*0.22-(y-GF)/120; c=ra(R('k2 m0 w0 m1'),v,x,y); if (hash(x,y*3)<0.02) c=P.m2; }
    b.px(x,y,c); }
  b.hl(x0-2,x1+1,GF+1,P.s6); b.hl(x0-2,x1+1,GF+2,P.s3);
  // Glanzstreifen im polierten Stein
  for (y=GF+4;y<GY-4;y++){ var gx=x0+10+Math.round((y-GF)*0.9); if (gx<x1-4 && bayer(gx,y)<0.5) lift(b,gx,y,1); }
  // Inschrift: drei Zeilen kleiner bronzener Buchstaben, darunter das Datum
  for (var row=0;row<3;row++){ var ry=GF+5+row*4, len=x1-x0-14-row*6, sx=x0+7+row*3;
    for (x=sx;x<sx+len;x++){ var g=hash(Math.floor(x/4)*3+1,row*11+3), ph=x%4; if (ph===3 || (g<0.1 && ph===0)) continue; b.px(x,ry,(ph===1)?P.y2:P.y1); if ((g>0.4&&ph===0)||(g>0.7&&ph===2)) b.px(x,ry+1,P.y1); if (g>0.85&&ph===1) b.px(x,ry-1,P.y2); } }
  signText(b,'6. IV 1945',rnd((x0+x1)/2)-19,GF+17,P.y3);
  // Nische (oben rund) mit der Bronzeschale
  for (y=n.top;y<=n.bot;y++) for (x=n.cx-n.hw-2;x<=n.cx+n.hw+2;x++){ var dx=x-n.cx, dy=y-(n.top+n.hw), r2=dx*dx+(dy<0?dy*dy:0); if (r2>(n.hw+2)*(n.hw+2)) continue;
    var c2; if (r2>n.hw*n.hw) c2=(dx<0)?P.s5:P.s3; else { var depth=1-Math.min(1,Math.sqrt(r2)/n.hw); c2=ra(R('k0 k1 k2 t0'),0.25+depth*0.4+(y-n.top)/60,x,y); }
    b.px(x,y,c2); }
  b.hl(n.cx-n.hw-3,n.cx+n.hw+3,n.bot+1,P.s5); b.hl(n.cx-n.hw-3,n.cx+n.hw+3,n.bot+2,P.s2);
  b.rect(n.cx-5,n.bot-3,11,2,P.y1); b.hl(n.cx-6,n.cx+6,n.bot-4,P.y2); b.hl(n.cx-4,n.cx+4,n.bot-1,P.y0); b.px(n.cx-5,n.bot-4,P.y3); b.vl(n.cx,n.bot-1,n.bot,P.y1);
  // Sockelstufe, Kette zwischen zwei Pollern
  b.rect(x0-4,GY-2,x1-x0+8,3,P.s4); b.hl(x0-4,x1+3,GY-2,P.s6); b.hl(x0-4,x1+3,GY,P.s2);
  [x0-1,x1].forEach(function(px){ b.rect(px-1,GY-9,3,10,P.m1); b.vl(px-1,GY-9,GY,P.m2); b.hl(px-1,px+1,GY-10,P.m3); });
  for (x=x0;x<x1;x++){ var sag=Math.round(Math.sin((x-x0)/(x1-x0)*Math.PI)*3); b.px(x,GY-7+sag,(x%2)?P.m2:P.m0); }
  // Kränze auf Ständern: dunkles Grün, Bänder
  [[56,GY-14,'r'],[114,GY-14,'s']].forEach(function(k){ var cx=k[0], cy=k[1];
    b.line(cx-5,cy+8,cx-2,cy,P.w1); b.line(cx+5,cy+8,cx+2,cy,P.w1); b.line(cx,cy+9,cx,cy+2,P.w0);
    b.ellipse(cx+0.5,cy+0.5,7,7,function(x,y){ var d=Math.hypot(x+0.5-cx-0.5,y+0.5-cy-0.5); if (d<3.6) return undefined; var h2=hash(x,y*3); return h2<0.18?P.g1:(h2<0.6?P.g2:(h2<0.85?P.g3:P.g4)); });
    for (var q=0;q<6;q++){ var a=q*1.05+0.4; b.px(rnd(cx+Math.cos(a)*5.5),rnd(cy+Math.sin(a)*5.5),q%2?P.s6:P.r3); }
    var rb=k[2]==='r'?[P.r2,P.r3]:[P.s5,P.s6]; b.line(cx-1,cy+5,cx-3,cy+12,rb[0]); b.line(cx+1,cy+5,cx+3,cy+12,rb[1]); b.px(cx,cy+5,rb[1]); });
  // ein Strauß roter Nelken auf der Stufe
  for (var f2=0;f2<6;f2++){ var fx=78+f2*2, fy=GY-3-(f2%2); b.px(fx,fy,P.r3); b.px(fx,fy+1,P.g2); b.px(fx+1,fy+1,P.r2); }
  b.hl(77,90,GY-1,P.s5); }

// ---------------------------------------------------------------- Erdgeschoss der Häuser: Café, Läden, Haustüren, Passage
function shopWindow(b,x,y,w,h,kind,lit){ b.rect(x-2,y-2,w+4,h+4,P.w1); b.hl(x-2,x+w+1,y-2,P.w3); b.vl(x-2,y-2,y+h+1,P.w2);
  glass(b,x,y,w,h,kind,function(xx,yy){ var gx=xx-x, gy=yy-y;
    if (kind==='cafe'){ if (gy===Math.round(h*0.35)) return P.w2; if (gy>h-6) return (gx%4===0)?P.w0:P.w1; var t=hash(Math.floor(gx/3)+x,Math.floor(gy/3)); if (gy>h*0.5 && t<0.2) return [P.r2,P.y1,P.s3][Math.floor(t*15)%3]; return ((gx+gy*2)%13<2 && gy<h*0.35)?P.n0:P.k2; }
    if (kind==='shoe'){ if (gy%7===6) return P.s3; if (gy%7===5) return P.s2; var u=hash(Math.floor(gx/5)+x*3,Math.floor(gy/7)), q=gx%5; if (gy%7>1 && gy%7<5 && q>0 && u<0.75){ var sc=[P.w1,P.k1,P.r1,P.w3,P.c1,P.t1][Math.floor(u*12)%6]; return (gy%7===2&&q>1)?P.k2:(q===1?M.UP[sc]:sc); } return (gy<2)?P.k1:P.k2; }
    if (kind==='books'){ if (gy%8===7) return P.w2; var bk=hash(gx+x*5,Math.floor(gy/8)); if (gy%8>1 && bk<0.85) return [P.r2,P.g2,P.c2,P.y1,P.w2,P.s3,P.b0][Math.floor(bk*20)%7]; return P.k2; }
    if (kind==='gold'){ var row=Math.floor(gy/6), py=gy%6; if (py===5) return P.r1; if (py===4) return (gx%2)?P.r0:P.k1;
      var it=gx%6, u2=hash(Math.floor(gx/6)+x,row*3); if (py===2 && it===2) return u2<0.5?P.y4:P.s5; if (py===3 && (it===1||it===3)) return u2<0.5?P.y3:P.s4; if (py===1 && it===2 && u2>0.6) return P.y3; return (gy<2)?P.k0:P.r0; }
    return (gy<2)?P.k1:P.k2; },lit);
  b.hl(x-3,x+w+2,y+h+2,P.s4); b.hl(x-3,x+w+2,y+h+3,P.s2); }
function awning(b,x0,x1,y,col,ext){ var C=col==='r'?[P.r1,P.r2,P.r3,P.s5]:(col==='g'?[P.g1,P.g2,P.g3,P.s5]:[P.w1,P.w2,P.w3,P.s5]);
  for (var j=0;j<ext;j++){ var yy=y+j, ins=Math.round(j*0.6); for (var x=x0-ins;x<x1+ins;x++){ var stripe=Math.floor((x-x0+40)/3)%2; b.px(x,yy,stripe?C[2]:C[3]); if (j===ext-1) b.px(x,yy,stripe?C[1]:C[2]); } }
  for (var x2=x0-ext;x2<x1+ext;x2++){ var sc=(x2%4<2)?1:0; b.px(x2,y+ext,C[1]); if (sc) b.px(x2,y+ext+1,C[0]); }
  b.line(x0,y,x0-ext,y+ext,P.m1); b.line(x1-1,y,x1-1+ext,y+ext,P.m1); }
function houseDoor(b,x,y,w,h,num){ b.rect(x-3,y-3,w+6,h+3,P.s4); b.hl(x-3,x+w+2,y-3,P.s6); b.vl(x+w+2,y-3,y+h-1,P.s2);
  for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=((xx-x)%5===0)?P.w0:P.w1; if (yy<y+8) c=(yy===y+7)?P.w0:((xx+yy)%3?P.k2:P.n0); if (yy===y+20||yy===y+21) c=P.w2; b.px(xx,yy,c); }
  glass(b,x+1,y+1,w-2,6,'door',function(){ return undefined; },false);
  b.px(x+w-3,y+h-14,P.y3); b.rect(x+(w>>1)-3,y-9,7,5,P.b1); b.hl(x+(w>>1)-3,x+(w>>1)+3,y-9,P.b2); M.microText(b,num,x+(w>>1)-1-(num.length>1?2:0),y-9,P.s6); }
function cafe(b){ var x0=CAFE.x0, x1=CAFE.x1, x, y;
  // Schild „CAFFE ŠEHER“ auf dunkelgrünem Brett
  b.rect(x0+18,GF+2,66,10,P.g1); b.hl(x0+18,x0+83,GF+2,P.g3); b.hl(x0+18,x0+83,GF+11,P.k1); b.vl(x0+18,GF+2,GF+11,P.g2); b.vl(x0+83,GF+2,GF+11,P.g0);
  var cw=signWidth('CAFFE ŠEHER'); signText(b,'CAFFE ŠEHER',x0+51-Math.floor(cw/2),GF+6,P.y3);
  b.px(x0+20,GF+4,P.y2); b.px(x0+81,GF+4,P.y2); b.px(x0+20,GF+9,P.y2); b.px(x0+81,GF+9,P.y2);
  // drei große Fenster, Tür in der Mitte
  shopWindow(b,x0+4,GF+16,26,24,'cafe',true); shopWindow(b,x0+66,GF+16,30,24,'cafe',true);
  b.rect(x0+36,GF+14,24,GY-GF-14,P.w1); b.rect(x0+38,GF+16,20,GY-GF-16,P.w2); glass(b,x0+40,GF+18,16,14,'cafe',function(xx,yy){ return (xx===x0+48)?P.w1:((yy<GF+20)?P.k1:P.k2); },true); b.px(x0+46,GF+38,P.y3); b.px(x0+50,GF+38,P.y3);
  awning(b,x0+2,x1-2,GF+13,'r',4);
  // Terrasse: Tische und Stühle (im Regen an die Tische gelehnt)
  [[x0+12,105],[x0+48,106],[x0+84,105]].forEach(function(t,i){ var tx=t[0], ty=t[1];
    b.ellipse(tx+0.5,ty-10,5,1.4,P.m3); b.hl(tx-4,tx+4,ty-10,P.m4); b.vl(tx,ty-9,ty-1,P.m1); b.hl(tx-2,tx+2,ty,P.m1);
    [-7,7].forEach(function(o,j){ var cx=tx+o; if (WET){ b.line(cx,ty-1,cx+(o<0?3:-3),ty-14,P.w2); b.line(cx+(o<0?-2:2),ty,cx+(o<0?2:-2),ty-12,P.w1); b.hl(cx-2,cx+2,ty-7,P.w3); return; }
      b.rect(cx-3,ty-7,6,2,P.w3); b.hl(cx-3,cx+2,ty-7,P.w4); b.vl(cx-3,ty-5,ty,P.w1); b.vl(cx+2,ty-5,ty,P.w1); var bk=o<0?cx-3:cx+2; b.vl(bk,ty-15,ty-7,P.w2); b.hl(Math.min(bk,bk+(o<0?3:-3)),Math.max(bk,bk+(o<0?3:-3)),ty-15,P.w3); }); });
  // Tafel auf dem Gehweg
  var tx2=x0-2; b.line(tx2,GY+7,tx2+3,GY-6,P.w1); b.line(tx2+7,GY+7,tx2+4,GY-6,P.w1); b.rect(tx2,GY-4,7,9,P.k2); b.hl(tx2,tx2+6,GY-4,P.w2); b.hl(tx2+1,tx2+4,GY-2,P.s5); b.hl(tx2+1,tx2+5,GY,P.s4); b.hl(tx2+1,tx2+3,GY+2,P.s4); b.px(tx2+5,GY+2,P.y3); }
function litfass(b){ var cx=COL.cx, r=COL.r, by=COL.base, top=COL.top, x, y;
  function cyl(x){ var u=(x-cx)/(r+0.5); return Math.sqrt(Math.max(0,1-u*u)); }          // Wölbung: vorn hell, an den Seiten dunkel
  function bow(x){ return Math.round((1-cyl(x))*-2.2); }                                  // Kanten biegen sich nach oben (Blick leicht von oben)
  for (x=cx-r;x<=cx+r;x++){ var u=(x-cx)/r, sh=cyl(x)*0.7-(u>0?u*0.45:0)+(u<-0.2&&u>-0.6?0.15:0);
    for (y=top+bow(x);y<by-bow(x)*0.5;y++) b.px(x,y,ra(R('g0 g1 g2 g3 g4'),0.18+sh*0.72,x,y)); }
  // Plakat: JAZZ FEST SARAJEVO – NOVEMBAR 2011, um die Säule gebogen
  var pl=cx-r+1, pr=cx+r-1;
  for (x=pl;x<=pr;x++){ var u2=(x-cx)/r, dk=(u2>0.72)?1:0, lt=(u2<-0.2&&u2>-0.55)?1:0, o=bow(x);
    for (y=top+5+o;y<top+37+o;y++){ var yy=y-o, c2;
      if (yy<top+17) c2=((x+yy)%7===0)?P.n0:P.k2; else if (yy<top+30) c2=P.s6; else c2=P.r2;
      if (yy===top+17||yy===top+30) c2=P.y3; if (dk) c2=M.DN[c2]; if (lt) c2=M.UP[c2]; b.px(x,y,c2); } }
  function ctext(s,yy,c){ var w=signWidth(s); signText(b,s,cx-Math.floor(w/2),yy,c); }
  ctext('JAZZ',top+6,P.y4); ctext('FEST',top+11,P.s6);
  for (x=cx-11;x<=cx+11;x+=2) b.px(x,top+16,P.y2);                                        // kleine Notenzeile
  b.px(cx+10,top+7,P.y4); b.vl(cx+11,top+5,top+8,P.y4); b.px(cx+12,top+5,P.y4);            // eine Achtelnote
  ctext('SARAJEVO',top+19,P.k1); ctext('NOVEMBAR',top+25,P.r2); ctext('2011',top+32,P.s6);
  // kleinere Zettel darunter
  b.rect(cx-12,top+38,9,7,P.s5); b.hl(cx-11,cx-5,top+40,P.k2); b.hl(cx-11,cx-6,top+42,P.k2);
  b.rect(cx+2,top+38,10,7,P.b2); b.hl(cx+3,cx+10,top+40,P.s6); b.rect(cx+4,top+42,6,2,P.b4); b.vl(cx+11,top+38,top+44,P.b1);
  // Gesims und Kuppel mit Knauf, Sockel
  for (x=cx-r-1;x<=cx+r+1;x++){ var o2=bow(Math.max(cx-r,Math.min(cx+r,x))); b.px(x,top-2+o2,P.g3); b.px(x,top-1+o2,P.g4); b.px(x,top+o2,P.g1); b.px(x,top+1+o2,P.g0); }
  for (y=top-9;y<top-2;y++){ var hw=(y-(top-10))*2.3+2; for (x=rnd(cx-hw);x<=rnd(cx+hw);x++){ var uu=(x-cx)/Math.max(1,hw); b.px(x,y,uu<-0.3?P.g4:(uu<0.3?P.g3:P.g2)); } }
  b.px(cx,top-11,P.g3); b.px(cx,top-12,P.g4); b.px(cx-1,top-11,P.g2);
  for (x=cx-r-1;x<=cx+r+1;x++) for (y=by-4;y<by;y++) b.px(x,y,(y===by-4)?P.g3:((x<cx-r+3)?P.g2:P.g0));
  b.hl(cx-r-2,cx+r+2,by,P.s2); }
function passage(b){ var x0=PAS.x0, x1=PAS.x1, w=x1-x0, cx=(x0+x1-1)/2, x, y;
  // Gang: Fliesen, Wände mit Schaufenstern, ganz hinten der Laden des Antiquars (warm)
  for (y=PAS.top;y<GY;y++) for (x=x0;x<x1;x++){ var dx=x-cx, dy=y-PAS.spr; if (dy<0 && dx*dx+dy*dy*1.0>(w/2)*(w/2)) continue;
    var c, t=(y-62)/(GY-62); var hw=3+Math.max(0,t)*13;
    if (y>=86 && Math.abs(dx)<3+(y-86)*1.0){ var row=Math.floor(60/(y-80)); c=((row+Math.floor((dx+40)/(1+(y-86)*0.3)))%2)?P.s1:P.w1; if (y>96) c=M.UP[c]; }
    else if (y>=60 && y<86 && Math.abs(dx)<4){ c=(y<66)?P.k1:((y<78)?P.y2:P.w1); if (y===72||Math.abs(dx)===3) c=P.w0; }
    else { c=(y<64)?P.k0:((Math.abs(dx)>hw)?P.w0:P.k2); if (y>=64 && Math.abs(dx)>hw && y>84 && ((y+Math.floor(Math.abs(dx)))%4===0)) c=P.k2; }
    b.px(x,y,c); }
  glass(b,rnd(cx)-3,66,7,12,'pas',function(xx,yy){ return (yy===72||xx===rnd(cx))?P.w0:((hash(xx,yy)<0.3)?P.y3:P.y2); },true);
  [[x0+4,74],[x1-8,74]].forEach(function(p,i){ glass(b,p[0],p[1],4,8,'pas',function(xx,yy){ return (xx===p[0]+(i?0:3))?P.k1:P.n0; },true); });
  b.vl(rnd(cx),56,60,P.k1); b.rect(rnd(cx)-1,61,3,2,P.m1); glass(b,rnd(cx)-1,63,3,1,'pasL',function(){ return P.s3; },true);
  // Bogen aus Keilsteinen mit Schlussstein
  for (y=PAS.top-5;y<=PAS.spr+1;y++) for (x=x0-5;x<x1+5;x++){ var dx2=x-cx, dy2=y-PAS.spr, rr=Math.sqrt(dx2*dx2+dy2*dy2); if (dy2>0||rr<w/2||rr>=w/2+4.5) continue; var a=Math.atan2(-dy2,dx2), q=a/(Math.PI/9);
    var c3=(Math.abs(q-Math.round(q))<0.12)?P.s2:((rr<w/2+1)?P.s3:(dx2<0?P.s6:P.s4)); b.px(x,y,c3); }
  b.rect(rnd(cx)-2,PAS.top-6,5,6,P.s6); b.vl(rnd(cx)+2,PAS.top-6,PAS.top-1,P.s3); b.px(rnd(cx),PAS.top-4,P.s3);
  [x0-4,x1].forEach(function(px,i){ for (y=PAS.spr;y<GY;y++) for (x=px;x<px+4;x++){ var c4=((y-PAS.spr)%5===0)?P.s3:(i?P.s4:P.s6); if (x===px+3&&!i) c4=P.s4; b.px(x,y,c4); } });
  b.hl(x0-5,x1+4,GY-1,P.s3); }
function signArm(b){ var s=SIGN, x, y;
  // geschmiedeter Arm mit Volute, das Schild hängt an zwei Ketten
  b.hl(s.x0-3,s.x0+s.w+2,s.y0-6,P.k1); b.hl(s.x0-3,s.x0+s.w,s.y0-5,P.k2); b.vl(s.x0-4,s.y0-9,s.y0-2,P.k1); b.rect(s.x0-5,s.y0-10,3,3,P.k1);
  b.line(s.x0-3,s.y0-2,s.x0+8,s.y0-6,P.k1); for (var i=0;i<5;i++){ var a=i/5*Math.PI*1.6; b.px(rnd(s.x0+12+Math.cos(a)*2),rnd(s.y0-9+Math.sin(a)*2),P.k1); }
  b.px(s.x0+s.w+2,s.y0-7,P.k1); b.vl(s.x0+3,s.y0-5,s.y0-1,P.k2); b.vl(s.x0+s.w-4,s.y0-5,s.y0-1,P.k2);
  b.rect(s.x0,s.y0,s.w,s.h,P.w1); b.rect(s.x0+1,s.y0+1,s.w-2,s.h-2,P.k2); b.hl(s.x0+1,s.x0+s.w-2,s.y0+1,P.w0);
  M.microText(b,'ANTIKVARIJAT',s.x0+2,s.y0+3,P.y3);
  var ax=s.x0+s.w-5, ay=s.y0+3; [[2,0],[2,1],[0,2],[2,2],[4,2],[1,3],[2,3],[3,3],[2,4]].forEach(function(p){ b.px(ax+p[0]-2,ay+p[1],P.y3); });
  b.hl(s.x0,s.x0+s.w-1,s.y0+s.h,P.k1); }

// ---------------------------------------------------------------- Straßenmöbel
function lamp(b,x){ var by=LB, h=LH, I=R('k1 m0 m1 m2');
  b.rect(x-2,by-5,5,5,I[1]); b.vl(x-2,by-5,by-1,I[2]); b.hl(x-3,x+3,by-1,I[1]); b.hl(x-2,x+2,by-6,I[2]);
  b.rect(x-1,by-h,2,h-5,I[1]); b.vl(x-1,by-h,by-6,I[3]); for (var yy=by-h+6;yy<by-6;yy+=9) b.hl(x-1,x,yy,I[3]);
  b.hl(x-3,x+3,by-h,I[1]); b.px(x-3,by-h-1,I[1]); b.px(x+3,by-h-1,I[1]);
  // Laternenkopf: vier Glasflächen, Dach mit Spitze
  var hy=by-h-2; b.poly([[x-4,hy],[x+4,hy],[x+5,hy-9],[x-5,hy-9]],P.m2); b.vl(x,hy-9,hy,I[0]); b.hl(x-4,x+4,hy-5,I[0]); b.px(x-3,hy-7,P.m3); b.px(x+3,hy-7,P.m1);
  b.poly([[x-6,hy-9],[x+6,hy-9],[x+2,hy-13],[x-2,hy-13]],I[1]); b.hl(x-6,x+6,hy-9,I[3]); b.px(x,hy-14,I[1]); b.px(x,hy-15,I[2]); }
function lampGlass(b,x){ var hy=LB-LH-2; for (var yy=hy-8;yy<hy;yy++) for (var xx=x-4;xx<=x+4;xx++){ if (xx===x||yy===hy-5) continue; var e=hy-yy; var ww=4+(e>5?1:0); if (Math.abs(xx-x)>ww) continue; b.px(xx,yy,(yy<hy-5)?P.y5:P.y4); } b.px(x-2,hy-7,P.l1); b.px(x+2,hy-7,P.l1); b.px(x-2,hy-3,P.l0); }
function bench(b){ var x0=BENCH.x0, x1=BENCH.x1, by=BENCH.by, x;
  for (x=x0+1;x<x1;x++) b.px(x,by,P.s2);
  for (var k=0;k<2;k++){ var yy=by-16+k*4; b.hl(x0+1,x1-1,yy,P.w4); b.hl(x0+1,x1-1,yy+1,P.w2); }
  b.hl(x0,x1,by-9,P.w4); b.hl(x0,x1,by-8,P.w3); b.hl(x0,x1,by-7,P.w1);
  [x0+2,x1-2].forEach(function(lx){ b.vl(lx,by-17,by-1,P.k1); b.px(lx-1,by,P.k1); b.px(lx+1,by,P.k1); b.line(lx,by-12,lx+(lx<x0+5?-2:2),by-10,P.k1); }); }
function bin(b,x,by){ b.rect(x,by-9,6,9,P.m1); b.vl(x,by-9,by-1,P.m3); b.vl(x+5,by-9,by-1,P.m0); b.hl(x-1,x+6,by-10,P.m2); b.hl(x,x+5,by,P.s2); for (var yy=by-7;yy<by;yy+=3) b.hl(x+1,x+4,yy,P.m2); }

// ---------------------------------------------------------------- Pflaster: große Steinplatten (Ferhadija), in der Mitte die Rose
var JNT=new Uint8Array(W*H);
function paving(b){ JNT.fill(0); b.code=5; var rp=R('s2 s3 s4 s5');
  for (var y=GY;y<H;y++){ var d=y-HZ, rz=820/d, row=Math.floor(rz), fy=rz-row, dy=820/(d*d);
    for (var x=0;x<W;x++){ var X=(x-VPX)/d*4.1+(row%2)*0.5+hash(row,3)*0.4, col=Math.floor(X), fx=X-col, dx=4.1/d, jn=false;
      var t=hash(col*1.7,row*3.1), c=t<0.25?rp[1]:(t<0.82?rp[2]:(t<0.94?rp[3]:rp[1]));
      var wear=fbm(x*0.5,y*2,10,row+col*3); if (wear>0.7) c=M.UP[c]; else if (wear<0.22) c=M.DN[c];
      if (hash(col*5+1,row)<0.15 && c===rp[2]) c=P.e4;                                   // rötlicher Granit dazwischen
      if (fx<dx*1.2){ c=P.s2; jn=true; }
      if (fy<dy*1.2){ c=(fy<dy*0.6)?P.s1:P.s2; jn=true; } else if (fy<dy*2.3 && fx>dx*2 && !jn) c=M.UP[c];
      if (hash(x,y)<0.025) c=M.DN[c];
      if (WET){ c=M.DN[c]; if (!jn && fbm(x*0.4,y*1.6,9,row)<0.5) c=M.DN[c]; }
      if (jn) JNT[y*W+x]=1; b.px(x,y,c); } }
  b.code=0; }
// Sarajevoer Rose: ein Einschlag im Pflaster, mit roter Masse ausgegossen. Flach, klein, still.
function rose(b){ var cx=ROSE.cx, cy=ROSE.cy, r=M.rng(1992), i, k, N=10, SX=1.45, SY=0.4;
  // Blütenblätter: regelmäßig, abwechselnd lang und kurz, zur Spitze schmal; oben (zum Licht) eine Spur heller
  for (i=0;i<N;i++){ var a=i/N*Math.PI*2+(r()-0.5)*0.22, L=(i%2?5.5:9)+r()*2.2, W0=1.5+r()*0.5;
    for (k=1.5;k<L;k+=0.35){ var w=W0*Math.pow(1-k/L,0.8)+0.2, px=cx+Math.cos(a)*k*SX, py=cy+Math.sin(a)*k*SY;
      for (var o=-w;o<=w;o+=0.4){ var qx=rnd(px-Math.sin(a)*o*SX), qy=rnd(py+Math.cos(a)*o*SY); var c=(k<3)?P.r0:((o<-w*0.45 && k<L*0.6)?P.r2:P.r1); if (k>L-1.4) c=P.r0; b.px(qx,qy,c); } } }
  b.ellipse(cx+0.5,cy+0.5,3.6,1.6,P.r1); b.ellipse(cx+0.5,cy+0.5,2,0.9,P.r0);
  // feiner dunkler Rand, ein paar Splitterkerben außen, Glanz auf dem Harz
  for (var y=cy-6;y<=cy+6;y++) for (var x=cx-18;x<=cx+18;x++){ var c0=b.get(x,y); if (c0===P.r1||c0===P.r2||c0===P.r3||c0===P.r0) continue; var nb=[b.get(x-1,y),b.get(x+1,y),b.get(x,y-1),b.get(x,y+1)]; if (nb.some(function(q){ return q===P.r2||q===P.r3; }) && bayer(x,y)<0.5) shade(b,x,y,1); }
  for (i=0;i<7;i++){ var a2=i/7*6.283+0.3, d=12+r()*3; b.px(rnd(cx+Math.cos(a2)*d*SX),rnd(cy+Math.sin(a2)*d*SY),P.r1); }
  [[-3,-1],[2,-1],[5,0],[-6,0]].forEach(function(o){ b.px(cx+o[0],cy+o[1],WET?P.r4:P.r3); }); }

// ---------------------------------------------------------------- nasse Platten: Fassaden und Lichter spiegeln sich
function wetReflect(b){ var src=b.clone();
  for (var y=GY+1;y<H;y++){ var d=y-GY, k=0.82-d/58, sy=GY-1-Math.floor(d*0.9); if (k<=0.04||sy<0) continue;
    for (var x=0;x<W;x++){ var i=y*W+x; if (CODE[i]!==5 || JNT[i]) continue; var sx=x+((y%3===1)?rnd(Math.sin(y*1.3+x*0.07)*1.2):0); if (sx<0||sx>=W) continue; var sc=src.d[sy*W+sx], cur=b.d[i];
      if (M.lum(sc)>M.lum(cur)+10 && bayer(x,y)<k*(0.55+0.45*hash(x>>2,y))) b.d[i]=(d<14)?sc:M.DN[sc]; } }
  // Pfützen: fast ein Spiegel
  PUD.forEach(function(q){ for (var y=Math.floor(q[1]-q[3]);y<=q[1]+q[3];y++) for (var x=Math.floor(q[0]-q[2]);x<=q[0]+q[2];x++){ var dx=(x-q[0])/q[2], dy=(y-q[1])/q[3]; if (dx*dx+dy*dy>1) continue; var sy=GY-1-Math.floor((y-GY)*0.9); if (sy<0) continue; var sc=src.d[sy*W+x]; b.d[y*W+x]=(bayer(x,y)<0.3)?M.DN[M.DN[sc]]:M.DN[sc]; } }); }

// ---------------------------------------------------------------- Bild
var SKYM=new Uint8Array(W*H);
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=track(new M.Buf(W,H,P.k0)), x, y;
  CODE.fill(0); GLW.fill(0); WINS.length=0; TOD=tod; WET=(wea==='rain'); FOG=(wea==='fog'); NIGHT=(tod==='night');
  sky(b,tod,wea); farCity(b); cathedral(b);
  BLD.forEach(function(F){ facade(b,F); });
  // Gasse zum Kathedralplatz: schmaler Spalt, hinten Dunst
  b.code=2; for (y=10;y<GY;y++) for (x=446;x<CAT.x0-6;x++){ if (y<40) continue; b.px(x,y,ra(R('m2 m3 m4'),0.3+(y-40)/80,x,y)); } b.code=0;
  for (y=8;y<GY;y++){ b.px(446,y,P.s2); b.px(447,y,P.s1); }
  // Erdgeschosse
  b.code=4;
  shopWindow(b,6,GF+14,26,26,'books',true); b.rect(5,GF+4,28,8,P.k2); b.hl(5,32,GF+4,P.m2); signText(b,'KNJIGE',7,GF+6,P.s5);   // links: kleiner Buchladen
  houseDoor(b,130,GF+18,13,GY-GF-18,'2');
  memorial(b);
  cafe(b);
  passage(b); signArm(b);
  houseDoor(b,334,GF+20,11,GY-GF-20,'9');
  SHOPS.forEach(function(s,i){ var w=s.x1-s.x0; shopWindow(b,s.x0+2,GF+16,w-16,24,i?'gold':'shoe',true); b.rect(s.x1-12,GF+14,10,GY-GF-14,P.w1); glass(b,s.x1-11,GF+16,8,16,'shop',function(xx,yy){ return (yy===GF+16)?P.k1:P.k2; },true); b.px(s.x1-10,GF+30,P.y3);
    b.rect(s.x0,GF+2,w,9,P.k2); b.hl(s.x0,s.x1-1,GF+2,P.m2); b.hl(s.x0,s.x1-1,GF+10,P.k1); signText(b,s.name,s.x0+Math.floor((w-signWidth(s.name))/2),GF+5,i?P.y4:P.s6); awning(b,s.x0,s.x1,GF+12,s.aw,5); });
  b.code=0;
  paving(b); rose(b);
  // Kontaktschatten an der Fassadenkante, Platz vor der Kathedrale
  for (x=0;x<W;x++){ if (x>=CAT.x0-18 && x<CAT.x1+18) continue; shade(b,x,GY,1); if (bayer(x,GY+1)<0.5) shade(b,x,GY+1,1); }
  litfass(b); bench(b); bin(b,436,107); bin(b,194,107);
  LAMPS.forEach(function(lx){ lamp(b,lx); });
  // Pfützen bei Regen
  if (WET) PUD.forEach(function(q){ b.ellipse(q[0],q[1],q[2],q[3],function(x,y){ return (y<q[1]-q[3]*0.3)?P.s3:(bayer(x,y)<0.35?P.s1:P.s2); }); });
  // Tauben auf den Gesimsen und auf der Kathedrale (statisch)
  [[40,8],[44,8],[214,59],[218,59],[506,61],[580,37],[584,37],[300,25]].forEach(function(p){ b.px(p[0],p[1],P.m3); b.px(p[0]+1,p[1],P.m2); b.px(p[0]-1,p[1]-1,P.m4); });
  // Licht: Straße zur Mitte etwas heller, Ränder dunkler; bei Nebel und Regen weich
  M.light(b,M.lf.sum(M.lf.band(112,H,0,-0.5),M.lf.vignette(W,H,0.4)),0,0,function(x,y){ return CODE[y*W+x]===5; });
  if (WET) M.light(b,function(x,y){ return -0.45-(y<GF?0.1:0)+(fbm(x*1.5,y*0.25,6,9)-0.5)*0.5; },0,0,function(x,y){ var c=CODE[y*W+x]; return c===4||c===0||c===3; });
  // Nebel: die Ferne verschwindet, die Türme verblassen nach oben
  if (FOG||WET||NIGHT){ var fc=NIGHT?P.m1:P.s4, f0=FOG?1:(WET?0.5:0.4);
    M.fogBake(b,function(x,y){ var c=CODE[y*W+x]; if (c===1) return 0; if (c===2) return Math.min(0.9,0.68*f0+0.12); if (c===3) return (0.1+Math.pow(Math.max(0,(86-y)/86),1.3)*0.62)*f0;
      if (c===4) return (y>=GF)?0:Math.pow(Math.max(0,(62-y)/62),1.2)*0.5*f0; if (c===0 && y<GF) return Math.max(0,(62-y)/62)*0.3*f0; return 0; },{col:fc}); }
  if (WET) wetReflect(b);
  SKYM.fill(0); for (var k=0;k<W*H;k++) if (CODE[k]===1) SKYM[k]=1;
  var base=b.clone(), lights=[];
  if (tod!=='day'){ lights=[[FLAME[0],FLAME[1]-2,26,0.9,18],[CAFE.x0+50,GF+30,62,0.75,24],[PAS.x0+16,84,22,0.8,20],[373,GF+30,26,0.6,16],[422,GF+30,26,0.7,16],[SIGN.x0+SIGN.w/2,SIGN.y0+4,30,0.55,10]];
    LAMPS.forEach(function(lx){ lights.push([lx,LB-LH-6,22,0.9,20]); lights.push([lx,LB+8,24,0.6,8]); }); }
  var out=M.finishTOD(b,tod,{ sky:function(x,y){ return SKYM[y*W+x]===1; }, lights:lights, after:function(o,tod){ if (tod==='day') return; nightLights(o,base,tod); } });
  return out; }
// erleuchtete Fenster, Laternenglas, die Flamme leuchtet in der Nische
var FLOOD=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.98+16, L*0.8+4, L*0.52-6]; });
function nightLights(o,base,tod){ var n=tod==='night', x, y;
  // die Kathedrale wird von unten angestrahlt: warm am Sockel, nach oben verlöschend
  if (n) for (y=0;y<GY+2;y++) for (x=CAT.x0-20;x<CAT.x1+20;x++){ var k0=y*W+x; if (CODE[k0]!==3) continue; var a=Math.max(0,1-(CAT.base+6-y)/92), sp=0;
      [CAT.lt[0]+22,541,CAT.rt[0]+22].forEach(function(fx){ var dx=(x-fx)/28; sp=Math.max(sp,1-dx*dx); }); a=a*a*(0.35+0.65*sp);
      if (a<0.06 || bayer(x,y)>a*2.2) continue; var c=M.tintPx(FLOOD,base.d[k0],x,y), dn=M.qd(1+(1-a)*2.2,x,y); while (dn>0){ c=M.DN[c]; dn--; } o.d[k0]=c; }
  WINS.forEach(function(w,id){ var on=w.lit; if (w.k==='win') on=hash(w.x,w.y)<(n?0.34:0.5); if (w.k==='cat'||w.k==='rose') on=false; if (!on) return;
    for (var yy=w.y;yy<w.y+w.h;yy++) for (var xx=w.x;xx<w.x+w.w;xx++){ var k=yy*W+xx; if (GLW[k]!==id+1) continue; var c0=base.d[k], dark=(c0===P.k2||c0===P.k1||c0===P.n0||c0===P.k0||c0===P.r0), c;
      if (w.k==='rose'){ c=(c0===P.r1)?P.r3:((c0===P.b0)?P.b2:(c0===P.n1?P.y2:o.d[k])); }
      else if (w.k==='gold') c=dark?(bayer(xx,yy)<0.5?P.y2:P.y1):(c0===P.y4||c0===P.y3?P.l0:P.y4);
      else if (w.k==='pasL') c=P.l0;
      else if (w.k==='win') c=dark?((yy-w.y<2)?P.y2:(bayer(xx,yy)<0.4?P.y4:P.y3)):M.tintPx(M.TINT.lamp,c0,xx,yy);
      else { var gy=(yy-w.y)/Math.max(1,w.h-1); c=dark?ra(R('y1 y2 y3 y4 y5'),0.92-gy*0.62,xx,yy):M.DN[M.tintPx(M.TINT.lamp,c0,xx,yy)]; }
      o.d[k]=c; } });
  LAMPS.forEach(function(lx){ lampGlass(o,lx); });
  // Schilder abends: das Schild der Passage hat eine kleine Lampe am Arm, das Café ein beleuchtetes Brett
  var s=SIGN; signText(o,'ANTIKVARIJAT',s.x0+2,s.y0+3,P.y4); [[2,0],[2,1],[0,2],[2,2],[4,2],[1,3],[2,3],[3,3],[2,4]].forEach(function(p){ o.px(s.x0+s.w-7+p[0],s.y0+3+p[1],P.y4); });
  o.px(s.x0+s.w/2,s.y0-4,P.y5); o.px(s.x0+s.w/2-1,s.y0-4,P.y4); o.px(s.x0+s.w/2+1,s.y0-4,P.y4);
  var cw=signWidth('CAFFE ŠEHER'); signText(o,'CAFFE ŠEHER',CAFE.x0+51-Math.floor(cw/2),GF+6,P.y5);
  SHOPS.forEach(function(sh,i){ signText(o,sh.name,sh.x0+Math.floor((sh.x1-sh.x0-signWidth(sh.name))/2),GF+5,i?P.y5:P.s6); });
  // Spiegelungen der Laternen und Läden auf den nassen Platten
  if (WET){ var refl=function(cx,y0,y1,wd,cA,cB){ for (var yy=y0;yy<y1;yy++){ var fade=(yy-y0)/(y1-y0); for (var xx=Math.round(cx-wd);xx<=Math.round(cx+wd);xx++){ if (xx<0||xx>=W) continue; var k=yy*W+xx; if (CODE[k]!==5||JNT[k]) continue; var e=Math.abs(xx-cx)/wd; if (hash(xx*3,yy)<fade*0.7+e*0.5) continue; if ((yy+Math.floor(hash(yy,xx>>2)*3))%3===0) continue; o.d[k]=e<0.4?cA:cB; } } };
    LAMPS.forEach(function(lx){ refl(lx+0.5,GY+8,H,2.5,P.y4,P.y2); });
    refl(CAFE.x0+17,GY+3,124,9,P.y3,P.y1); refl(CAFE.x0+81,GY+3,124,10,P.y3,P.y1); refl(CAFE.x0+48,GY+3,128,6,P.y3,P.y1);
    refl(373,GY+3,120,9,P.y3,P.y1); refl(422,GY+3,120,8,P.y2,P.y1); refl(PAS.x0+16,GY+2,116,5,P.y3,P.y1); refl(FLAME[0],GY+3,118,4,P.y4,P.t3); } }

// ---------------------------------------------------------------- Vordergrund: zwei Steinpoller, eine Pflanzschale
function layers(S,GS,tod){ var L=[];
  function pol(x,by){ var l=M.layer(x-5,by-13,11,15,by), w=M.lw(l); w.rect(x-3,by-10,7,10,P.s3); w.vl(x-3,by-10,by-1,P.s5); w.vl(x+3,by-10,by-1,P.s2); w.ellipse(x+0.5,by-10.5,3.6,1.6,P.s4); w.hl(x-2,x+2,by-11,P.s6); w.hl(x-4,x+4,by,P.s1);
    if (WET) M.light(l,M.lf.k(-0.6),l.ox,l.oy); if (tod!=='day') M.tintApply(l,M.TINT[tod]); L.push(l); }
  pol(226,143); pol(604,143);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Flamme, Tauben, Regenringe, Rauch
var PIG=[[486,112],[496,115],[509,110],[522,116],[548,113],[561,117],[577,111],[592,115],[530,119]];
function flame(fb,v,cam){ var t=v.t, fx=FLAME[0]-cam, fy=FLAME[1]; if (fx<-8||fx>330) return;
  var h=5+Math.round(Math.sin(t*9)*0.8+Math.sin(t*23+1)*0.6), sway=Math.sin(t*5.3)*0.8+Math.sin(t*13)*0.4;
  for (var j=0;j<h;j++){ var u=j/h, w=Math.max(0,Math.round((1-u)*2.2-0.2)), sx=Math.round(fx+sway*u); for (var i=-w;i<=w;i++){ var c=(j<2&&Math.abs(i)<1)?P.l1:(u<0.45?P.y5:(u<0.75?P.y4:P.y3)); if (Math.abs(i)===w && w>0) c=P.y3; if (u>0.8) c=P.t4; fb.px(sx+i,fy-j,c); } }
  fb.px(Math.round(fx-2),fy,P.y3); fb.px(Math.round(fx+2),fy,P.y3);
  if (v.tod!=='day') M.glow(fb,fx,fy-3,8,t,0.4); }
function pigeons(fb,t,cam){ PIG.forEach(function(p,i){ var cyc=(t*0.3+hash(i,5)*9)%15, fly=cyc>13.6, f=(i%2)?1:-1, x=p[0]+Math.round(Math.sin(t*0.35+i*1.9)*4), y=p[1], peck=Math.floor(t*2.6+i*0.7)%5===0, sx=x-cam;
    if (sx<-30||sx>350) return;
    if (fly){ var k=(cyc-13.6)/1.4, fx=rnd(sx+f*k*40), fy=rnd(y-k*60), wg=Math.floor(t*12+i)%2; fb.px(fx,fy,P.m2); fb.px(fx+1,fy,P.m3); fb.px(fx-1,fy-(wg?1:-1),P.m4); fb.px(fx+2,fy-(wg?1:-1),P.m4); fb.px(fx-2,fy-(wg?2:-1),P.m3); fb.px(fx+3,fy-(wg?2:-1),P.m3); return; }
    fb.px(sx,y,P.m2); fb.px(sx+1,y,P.m2); fb.px(sx-1,y-1,P.m2); fb.px(sx,y-1,P.m3); fb.px(sx+1,y-1,P.m3); fb.px(sx+2,y-1,P.m2); fb.px(sx,y-2,P.m4);
    fb.px(f>0?sx-2:sx+3,y-1,P.m1); var hx=f>0?sx+2:sx-1, hy=peck?y:y-2; fb.px(hx,hy,P.m3); fb.px(hx+f,hy,P.s3); fb.px(hx,hy-1,P.m4); fb.px(f>0?sx+1:sx,y-2,P.c3); fb.px(sx,y+1,P.t2); fb.px(sx+1,y+1,P.t2); }); }
function rings(fb,t,cam){ PUD.forEach(function(q,i){ for (var j=0;j<2;j++){ var ph=(t*0.8+hash(i,j*5+1))%1, n=Math.floor(t*0.8+hash(i,j*5+1)), rx=q[0]+(hash(i*7+n,j)-0.5)*q[2]*1.2, ry=q[1]+(hash(i+n,j*3)-0.5)*q[3], r=1+ph*3, sx=Math.round(rx-cam);
    [[-r,0],[r,0],[-r*0.6,-0.6],[r*0.6,-0.6],[-r*0.6,0.6],[r*0.6,0.6]].forEach(function(o){ var xx=Math.round(sx+o[0]), yy=Math.round(ry+o[1]); if (xx<0||xx>=320||yy<0||yy>=H) return; var k=yy*320+xx; fb.d[k]=M.UP[fb.d[k]]; }); } });
  // Tropfen, die auf den Platten zerspringen
  for (var i2=0;i2<22;i2++){ var n2=Math.floor(t*5+hash(i2,9)), x=Math.floor(hash(i2,n2)*320), y=GY+4+Math.floor(hash(n2,i2)*(H-GY-4)); if (CODE[y*W+x+cam]!==5) continue; var k2=y*320+x; fb.d[k2]=M.UP[fb.d[k2]]; } }
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t;
  flame(fb,v,cam);
  if (v.tod==='day' && !WET) pigeons(fb,t,cam);
  else if (v.tod==='day') pigeons(fb,t*0.5,cam);
  if (WET) rings(fb,t,cam);
  if (v.tod!=='day') LAMPS.forEach(function(lx){ var sx=lx-cam; if (sx>-12&&sx<332) M.glow(fb,sx+0.5,LB-LH-7,9,t,0.45); });
  // Kohlerauch aus einem Kamin auf dem Mansarddach
  [[38,0],[400,0]].forEach(function(c,i){ var sx=c[0]-cam; if (sx<-20||sx>340) return; for (var q=0;q<6;q++){ var ph=(t*0.12+q/6+i*0.3)%1, px=Math.round(sx+ph*14+Math.sin(t*0.7+q)*1.5), py=Math.round(1-ph*2); if (py<0) continue; if (bayer(px,py+q)<0.5*(1-ph)) fb.px(px,py,v.tod==='day'?P.s3:P.n1); } }); }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS);
  if (wea==='rain') M.rain(fb,v.t,{n:85,col:v.tod==='day'?P.m3:P.n2,col2:v.tod==='day'?P.m4:P.n3,speed:250,slant:0.2});
  if (wea==='fog') M.fogDrift(fb,v.t,{y0:40,y1:118,amt:0.34,k:2,col:v.tod==='night'?P.m1:P.s4,cam:v.cam,speed:4});
  if (wea==='snow') M.snow(fb,v.t,{n:70,cam:v.cam}); }
// nur in Malas Sicht: über der Rose ein schwaches Glühen
function ghost(fb,v,S,GS){ var sx=ROSE.cx-v.cam, sy=ROSE.cy, t=v.t; if (sx<-30||sx>350) return; var a=0.55+Math.sin(t*0.9)*0.12;
  for (var y=sy-18;y<sy+5;y++) for (var x=sx-20;x<=sx+20;x++){ if (x<0||x>=320||y<0||y>=H) continue; var d=Math.hypot((x-sx)/20,(y-sy+2)/(y<sy?18:5)); if (d<1 && bayer(x,y)<(1-d)*a){ var k=y*320+x; fb.d[k]=M.UP[fb.d[k]]; if (d<0.45) fb.d[k]=M.UP[fb.d[k]]; } }
  // ein feiner Lichtrand um die Blütenblätter, der langsam atmet, und Funken, die aufsteigen und vergehen
  var br=(Math.sin(t*0.9)+1)/2; for (var i=0;i<20;i++){ var an=i/20*6.283, rr=(i%2?7:11)+br*1.2, px0=Math.round(sx+Math.cos(an)*rr*1.45), py0=Math.round(sy+Math.sin(an)*rr*0.4); if (px0>=0&&px0<320&&py0>=0&&py0<H && Math.sin(an*5+t*1.3)>-0.3) fb.px(px0,py0,br>0.6?P.x5:P.x4); }
  for (var j=0;j<7;j++){ var ph=(t*0.16+hash(j,7))%1, px=Math.round(sx+(hash(j,3)-0.5)*18+Math.sin(t*0.8+j)*1.2), py=Math.round(sy-2-ph*26); if (px>=0&&px<320) fb.px(px,py,ph<0.4?P.x6:(ph<0.7?P.x5:P.x3)); }
  fb.px(sx,sy,P.x5); fb.px(sx-1,sy,P.x4); fb.px(sx+1,sy,P.x4); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ return y>=112 && y<=140 && x>=6 && x<=634; }
M.defineArt('ferhadija',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{ exit:[0,96,12,48], flame:[MEM.x0-6,GF,MEM.x1-MEM.x0+12,GY-GF+2], rose:[ROSE.cx-14,ROSE.cy-5,29,10], passage:[PAS.x0-5,PAS.top-6,PAS.x1-PAS.x0+10,GY-PAS.top+6],
    sign:[SIGN.x0-6,SIGN.y0-11,SIGN.w+10,SIGN.h+12], shops:[350,GF,96,GY-GF+2], cafe:[CAFE.x0,GF+2,CAFE.x1-CAFE.x0+4,GY-GF+8], cathedral:[CAT.x0-14,36,CAT.x1-CAT.x0+28,74],
    towers:[CAT.x0,0,CAT.x1-CAT.x0,36], bench:[BENCH.x0-2,BENCH.by-18,BENCH.x1-BENCH.x0+5,19], lamp:[LAMPS[1]-6,LB-LH-17,13,LH+17], pigeons:[478,104,124,18], poster:[COL.cx-COL.r-1,COL.top-11,COL.r*2+3,COL.base-COL.top+11] },
  stands:{ exit:[10,124,'L'], flame:[85,114,'B'], rose:[352,126,'R'], passage:[306,113,'B'], sign:[340,114,'B'], shops:[396,114,'B'], cafe:[210,114,'B'],
    cathedral:[541,114,'B'], towers:[541,116,'B'], bench:[413,114,'B'], lamp:[LAMPS[1],114,'B'], pigeons:[514,120,'R'], poster:[COL.cx,114,'B'] },
  start:[40,124,'R'], entries:{ map:[16,124,'R'], antikvarijat:[306,114,'F'] }
});
})(M);
