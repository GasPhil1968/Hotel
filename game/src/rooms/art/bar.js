/* ===== rooms/art/bar.js — Bar „Bura“: kleine Stammkneipe mit Café. Tresen mit Espressomaschine, Flaschen und Spiegel,
   Fenster zur Straße und zum Hafen, Markos Ecktisch, der Kartentisch der beiden Alten (Briškula), Deckenventilator. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320;
var VP=[152,50], RECT=[32,8,288,94], F=100, FY=94;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var WIN=[214,18,68,54];                   // Fenster in der Rückwand (Glas)
var STREETY=WIN[1]+41;                    // ab hier im Fenster: die Straße vor der Bar (wird mit umgefärbt)
var CNT={X0:84,X1:182,Y0:74,Z0:34,Z1:46};   // Tresen
var CT={x:233,y:124,top:104};             // Kartentisch (Mitte, Fußhöhe, Tischplatte)
var FAN=[146,11];                         // Deckenventilator (Nabe)
var LAMPS=[[96,31],[188,31]];             // Pendellampen über dem Tresen (Schirm-Unterkante)
var CLAMP=[233,58];                       // Lampe über dem Kartentisch
var RADIO=[199,50];
var LIGHTS=[[96,70,78,1.7,56],[188,70,78,1.7,56],[233,100,64,1.8,44],[150,96,190,0.95,70],[205,55,14,0.8,10]];   // warme Lichtinseln am Abend
function rnd(v){ return Math.round(v); }
function fy(Z){ return VP[1]+(FY-VP[1])*(1+Z/F); }
function inWin(x,y){ return x>=WIN[0]&&x<WIN[0]+WIN[2]&&y>=WIN[1]&&y<WIN[1]+WIN[3]; }

// ---------------------------------------------------------------- kleine Malhilfen
function mirrorMicro(b,s,x,y,c){ var w=M.microWidth(s), t=new M.Buf(w,5,T); M.microText(t,s,0,0,c); b.blit(t,x,y,true); }
// glatter Putz: großflächige Wolken statt Pixelrauschen, dazu feine Risse
function plaster(u,v,x,y,ramp,base,seed){ seed=seed||0;
  var n=0.5*Math.sin(u*0.043+v*0.021+1.3+seed)+0.3*Math.sin(u*0.11-v*0.07+seed*2)+0.45*(hash(Math.floor(u/11)+seed,Math.floor(v/7))-0.5)+0.25*(hash(Math.floor(u/4),Math.floor(v/3)+seed)-0.5);
  var c=M.rampAt(ramp,base+n*0.13,x,y);
  var cr=Math.sin(u*0.31+Math.sin(v*0.23+seed)*2.2+seed); if (Math.abs(cr)<0.035 && hash(Math.floor(u/6),Math.floor(v/9)+seed)<0.22) c=M.DN[c];
  return c; }
// Flasche mit Etikett; kind: 'wine','sq','tall','round','straw'
function bottle(b,x,by,col,kind,seed){ kind=kind||'wine'; var hi=M.UP[M.UP[col]];
  if (kind==='sq'){ b.rect(x,by-7,4,7,col); b.rect(x+1,by-10,2,3,col); b.vl(x,by-7,by-1,hi); b.vl(x+3,by-7,by-1,M.DN[col]); b.rect(x,by-5,4,2,P.s5); b.px(x+1,by-11,P.k2); }
  else if (kind==='round'){ b.ellipse(x+2,by-3,2.6,3,col); b.rect(x+1,by-9,2,4,col); b.px(x+1,by-5,hi); b.px(x+1,by-10,P.y3); }
  else if (kind==='straw'){ b.rect(x,by-8,4,8,P.e3); for (var yy=by-8;yy<by;yy+=2) b.hl(x,x+3,yy,P.e2); b.rect(x+1,by-12,2,4,col); b.px(x+1,by-13,P.r3); }
  else if (kind==='tall'){ b.rect(x,by-9,3,9,col); b.rect(x+1,by-13,1,4,col); b.vl(x,by-8,by-2,hi); b.rect(x,by-6,3,2,P.s4); b.px(x+1,by-14,P.y2); }
  else { b.rect(x,by-8,3,8,col); b.rect(x+1,by-11,1,3,col); b.vl(x,by-7,by-2,hi); b.px(x+2,by-6,M.DN[col]); b.rect(x,by-5,3,2,(seed&1)?P.s5:P.e4); b.px(x+1,by-12,P.k2); } }
// Thonet-Stuhl von der Seite: x = Mitte der Sitzfläche, sy = Sitzhöhe (y), by = Boden, back = 'L'|'R' (Seite der Lehne)
function thonet(b,x,sy,by,back,R){ R=R||M.R('w0 w1 w2 w3 w4'); var s=back==='L'?-1:1, bx=x+s*5;
  b.line(x-s*4,sy+2,x-s*5,by,R[1]); b.line(x-s*3,sy+2,x-s*4,by,R[2]);          // Vorderbein
  b.line(bx,sy+2,bx+s*1,by,R[1]); b.line(bx-s,sy+2,bx,by-1,R[2]);               // Hinterbein
  b.line(x,sy+2,x+s,by-1,R[0]);                                                 // fernes Bein
  for (var i=-4;i<=4;i++) if ((i&1)===0) b.px(x+i,sy+6+Math.round(Math.abs(i)*0.2),R[1]);  // Ring
  b.ellipse(x+0.5,sy+0.5,6.4,2,R[2]); b.hl(x-5,x+5,sy+1,R[1]); b.hl(x-4,x+4,sy-1,R[4]); b.hl(x-5,x+5,sy+2,R[0]);
  // Lehne: gebogener Bügel
  b.vl(bx,sy-15,sy,R[2]); b.vl(bx+s,sy-14,sy,R[0]); b.px(bx,sy-16,R[4]); b.px(bx-s,sy-16,R[3]); b.px(bx-s*2,sy-16,R[3]); b.px(bx-s*3,sy-15,R[2]);
  b.line(bx-s*3,sy-14,bx-s*3,sy-8,R[1]); b.hl(Math.min(bx,bx-s*3),Math.max(bx,bx-s*3),sy-8,R[1]); b.px(bx-s,sy-12,R[1]); b.px(bx-s*2,sy-11,R[1]); }
// Bistrotisch mit runder Marmorplatte und gusseisernem Fuß
function bistro(b,cx,ty,by,rx){ var Ir=M.R('k1 m0 m1 m2');
  b.vl(cx,ty+3,by-3,Ir[2]); b.vl(cx+1,ty+3,by-3,Ir[1]); b.rect(cx-1,ty+6,4,2,Ir[1]); b.hl(cx-1,cx+2,ty+6,Ir[3]);
  b.line(cx,by-3,cx-6,by,Ir[1]); b.line(cx+1,by-3,cx+7,by,Ir[1]); b.line(cx,by-3,cx+1,by-1,Ir[0]); b.hl(cx-7,cx-5,by,Ir[2]); b.hl(cx+6,cx+8,by,Ir[2]);
  b.ellipse(cx+0.5,ty+1.8,rx+0.6,3.3,P.s2);
  b.ellipse(cx+0.5,ty+0.5,rx,2.7,function(x,y){ var c=P.s5; if (hash(Math.floor(x/2),y)<0.16) c=P.s4; if (Math.sin(x*0.55+y*1.9)>0.88) c=P.s3; if (y>=ty+2) c=P.s4; if (x<cx-rx+4&&y<=ty) c=P.s6; return c; });
  b.hl(cx-rx+2,cx+rx-2,ty+3,P.s1); }
// Pendellampe (Emailleschirm), Kabel von oben
function pendant(b,x,y,lit,col){ col=col||M.R('g1 g2 g3 g4'); b.vl(x,0,y-6,P.k2); b.rect(x-1,y-7,3,2,P.m2); b.px(x-1,y-7,P.m3);
  b.poly([[x-1,y-5],[x+2,y-5],[x+6,y],[x-5,y]],function(xx,yy){ var u=(xx-x+5)/11; return u<0.28?col[3]:(u<0.66?col[2]:col[1]); }); b.hl(x-5,x+6,y,col[0]); b.px(x-3,y-2,M.UP[col[3]]);
  b.hl(x-3,x+4,y+1,lit?P.y5:P.s3); if (lit){ b.px(x,y+1,P.l1); b.px(x+1,y+1,P.l1); } }

// ---------------------------------------------------------------- Blick aus dem Fenster: Straße, Riva, Hafen, Brač
function view(b,tod,weather){ var x0=WIN[0], y0=WIN[1], w=WIN[2], h=WIN[3], hz=y0+23, night=tod!=='day', bura=weather==='bura';
  M.scn.sky(b,x0,y0,w,hz-y0,tod,weather,23);
  if (tod==='dusk' && weather!=='rain'){ for (var gx=x0;gx<x0+w;gx++) for (var gy=hz-6;gy<hz;gy++) if (bayer(gx,gy)<(gy-hz+6)/7) b.px(gx,gy,P.d5); }
  M.islands(b,x0,x0+w,hz,tod,8,{amp:5,bump:function(x){ return (x>x0+34&&x<x0+56)?2:0; }});
  M.sea(b,x0,hz,w,13,tod,0,0);
  if (bura && tod==='day') for (var i=0;i<22;i++){ var wx=x0+Math.floor(hash(i,4)*w), wy=hz+2+Math.floor(hash(i,5)*10); b.px(wx,wy,P.a6); b.px(wx+1,wy,P.s6); }
  M.prop.ferry(b,x0+36,hz+7,20,night);
  // Riva: Kaimauer, Palmen, Laternen
  var qy=hz+14; b.hl(x0,x0+w-1,qy,P.s4); b.rect(x0,qy+1,w,2,P.s2);
  var FR=[[[-1,0],[-2,0],[-3,1],[-4,2]],[[1,0],[2,0],[3,1],[4,2]],[[-1,-1],[-2,-1],[-3,-1],[-4,0]],[[1,-1],[2,-1],[3,-1],[4,0]],[[0,-1],[-1,-2],[-2,-2]],[[0,-1],[1,-2],[2,-2]]];
  for (var pxx=x0+8;pxx<x0+w;pxx+=21){ var lean=bura?2:0; for (var k=0;k<10;k++) b.px(pxx+Math.round(k*k*0.018*lean),qy-k,k%3?P.w2:P.w1);
    var tx=pxx+Math.round(1.8*lean), ty=qy-10;
    FR.forEach(function(fr,fi){ fr.forEach(function(o,oi){ var bx=bura?Math.round(oi*0.6):0; b.px(tx+o[0]+bx,ty+o[1]+(bura&&o[0]<0?1:0),oi===0?P.g1:(fi%2?P.g2:P.g3)); }); }); b.px(tx,ty,P.g1); b.px(tx,ty-1,P.g4); }
  for (var lx=x0+18;lx<x0+w;lx+=21){ b.vl(lx,qy-9,qy-1,P.m1); b.rect(lx-1,qy-11,3,2,night?P.y4:P.m2); }
  // die Straße vor der Bar: helles Pflaster, Bordstein, Poller, eine Vespa
  for (var y=STREETY;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var v=(y-STREETY)/(y0+h-STREETY), c=M.rampAt(M.R('s3 s4 s5'),0.75-v*0.35+(hash(x>>2,y)-0.5)*0.15,x,y);
      if (y===STREETY) c=P.s2; if (y===STREETY+1) c=P.s5; if (((x+y*3)%23)===0) c=P.s3;
      if (weather==='rain'){ c=M.DN[c]; if (bayer(x,y)<0.2) c=M.DN[c]; } b.px(x,y,c); }
  for (var bx2=x0+5;bx2<x0+w;bx2+=29){ b.rect(bx2,STREETY-4,3,5,P.m1); b.hl(bx2,bx2+2,STREETY-4,P.m3); }
  var vx=x0+42, vy=y0+h-3;   // Vespa (hellblau)
  b.ellipse(vx+0.5,vy+0.5,2.2,2.2,P.k1); b.ellipse(vx+12.5,vy+0.5,2.2,2.2,P.k1); b.px(vx,vy,P.m2); b.px(vx+12,vy,P.m2);
  b.poly([[vx-1,vy-2],[vx+5,vy-3],[vx+9,vy-3],[vx+12,vy-7],[vx+14,vy-3],[vx+13,vy-1],[vx-1,vy-1]],P.a5); b.hl(vx,vx+9,vy-3,P.a6); b.rect(vx+1,vy-6,6,2,P.k2);
  b.line(vx+12,vy-7,vx+11,vy-11,P.m2); b.hl(vx+9,vx+13,vy-11,P.k2); b.px(vx+13,vy-9,P.s6);
  if (weather==='rain') for (var r=0;r<w*h/12;r++){ var rx=x0+Math.floor(hash(r,3)*w), ry=y0+Math.floor(hash(r,4)*h); if (ry<STREETY) b.px(rx,ry,tod==='day'?P.m4:P.m2); } }

// ---------------------------------------------------------------- Wände, Boden, Decke
function wallBack(u,v,x,y){ var c;
  if (v<60){ c=plaster(u,v,x,y,M.R('e2 e3 e4 s4 s5'),0.56-(v<10?(10-v)*0.03:0),0); if (v<3) c=M.DN[c]; }
  else { c=(((u+4)%20)<1)?P.w1:(((u+4)%20)<2?P.w4:P.w2); if (v>=64&&v<84&&(((u+4)%20)>3)&&(((u+4)%20)<18)) c=(v===64||((u+4)%20)===4)?P.w1:P.w3; if (v===60) c=P.w4; if (v===61) c=P.w3; if (v===62) c=P.w0; if (v>=84) c=P.w1; if (v>=85) c=P.k2; }
  return c; }
function wallSide(u,v,x,y,sd){ var c;
  if (v<60){ c=plaster(u*2.2,v,x,y,M.R('e1 e2 e3 e4 s4'),0.54,sd==='L'?7:13); }
  else { c=((Math.floor(u*1.6)%8)===0)?P.w1:P.w2; if (v===60) c=P.w3; if (v>=84) c=P.w0; }
  return sd==='L'?M.DN[c]:c; }
var FLOOR=null;   // Bodenpixel (für den Lichtfleck)
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; if (FLOOR) FLOOR[y*W+x]=1;
  var X=f.X+400, Z=f.Z, s=10, cu=Math.floor(X/s), cv=Math.floor(Z/s), fu=X/s-cu, fv=Z/s-cv, lw=0.8/(s*f.k);
  var a=((cu+cv)&1), c=a?P.t2:P.s1, dm=Math.abs(fu-0.5)+Math.abs(fv-0.5);
  if (!a && dm<0.16) c=P.s2; if (a && dm<0.16) c=P.t1;
  if (fu<lw||fv<lw*2.2) c=P.s0;
  var g=hash(Math.floor(x/2),y); if (g<0.05) c=M.DN[c]; else if (g>0.975) c=M.UP[c];
  return c; }
function ceilTex(xb,d,x,y){ var c=((Math.floor(xb)%24)<2)?P.w0:(((Math.floor(xb)%24)<4)?P.w2:P.w1); if (hash(Math.floor(xb/3),d)<0.08) c=P.w0; return c; }
// Sonnenfleck auf dem Boden: Strahl vom Bodenpunkt zurück durchs Fenster (mit Sprossenschatten)
function sunOnFloor(x,y){ var f=R3.floor(x,y); if (!f) return 0; var t=f.Z/0.95, X=f.X-0.25*t, Y=FY-0.62*t;   // Punkt auf der Rückwand
  if (X<WIN[0]||X>=WIN[0]+WIN[2]||Y<WIN[1]||Y>=WIN[1]+WIN[3]) return 0;
  var m1=WIN[0]+Math.floor(WIN[2]/3), m2=WIN[0]+Math.floor(WIN[2]*2/3); if (Math.abs(X-m1)<1.6||Math.abs(X-m2)<1.6||Math.abs(Y-WIN[1]-12.5)<1.3) return 0;
  var e=Math.min(X-WIN[0],WIN[0]+WIN[2]-X,Y-WIN[1],WIN[1]+WIN[3]-Y); return Math.min(1,0.45+e*0.12); }

function paint(S,GS,tod){ var b=new M.Buf(W,144,P.k0), weather=M.scn.weather(GS), lit=tod!=='day';
  FLOOR=new Uint8Array(W*144);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  var floorMask=FLOOR; FLOOR=null;
  // Deckenbalken quer, Kante zur Rückwand
  [4,12,22].forEach(function(Z){ var yy=rnd(R3.p(0,8,Z)[1]); if (yy>=0){ b.hl(0,W-1,yy,P.w0); b.hl(0,W-1,yy+1,P.w2); b.hl(0,W-1,yy+2,P.w1); } });
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.w0); b.hl(RECT[0],RECT[2]-1,RECT[1]+1,P.e1);
  // Kreidetafel an der rechten Wand (Preise in Kuna)
  var kq=M.wallQuad(SPEC,'R',5,27,26,54), kq2=M.wallQuad(SPEC,'R',4,28,25,55); b.poly(kq2,P.w2); b.poly(kq,function(x,y){ return (hash(x,y)<0.12)?P.g1:P.k2; });
  [[30,14],[35,10],[40,16],[45,12],[49,8]].forEach(function(l,i){ for (var uu=7;uu<7+l[1];uu++){ if (hash(uu,i)<0.25) continue; var q=M.wallPt(SPEC,'R',uu,l[0]); b.px(rnd(q[0]),rnd(q[1]),(uu>7+l[1]-4)?P.s5:P.s4); } });
  var kc=M.wallPt(SPEC,'R',22,31); b.rect(rnd(kc[0]),rnd(kc[1]),3,2,P.s5); b.px(rnd(kc[0])+3,rnd(kc[1]),P.s4);

  // ---- Fenster mit Blick auf Straße und Hafen
  var vb=new M.Buf(W,144,P.k0); view(vb,tod,weather);
  var wx=WIN[0], wy=WIN[1], ww=WIN[2], wh=WIN[3];
  b.rect(wx-4,wy-4,ww+8,wh+8,P.w2); b.hl(wx-4,wx+ww+3,wy-4,P.w4); b.vl(wx-4,wy-4,wy+wh+3,P.w3); b.vl(wx+ww+3,wy-4,wy+wh+3,P.w0); b.hl(wx-3,wx+ww+2,wy-1,P.w0); b.vl(wx-1,wy,wy+wh,P.w0);
  b.fn(wx,wy,ww,wh,function(x,y){ return vb.get(x,y); });
  var m1=wx+Math.floor(ww/3), m2=wx+Math.floor(ww*2/3);
  [m1,m2].forEach(function(mx){ b.rect(mx-1,wy,3,wh,P.w2); b.vl(mx-1,wy,wy+wh-1,P.w4); b.vl(mx+1,wy,wy+wh-1,P.w0); });
  b.rect(wx,wy+12,ww,2,P.w2); b.hl(wx,wx+ww-1,wy+12,P.w4); b.hl(wx,wx+ww-1,wy+14,P.w0);
  // Schrift „BURA“ auf der Scheibe, von innen spiegelverkehrt
  mirrorMicro(b,'BURA',m1+4,wy+18,P.y1); mirrorMicro(b,'BURA',m1+3,wy+17,P.y4);
  // Fensterbank, Heizkörper, Aloe in einer Blechdose
  b.rect(wx-6,wy+wh+3,ww+12,3,P.s4); b.hl(wx-6,wx+ww+5,wy+wh+3,P.s6); b.hl(wx-6,wx+ww+5,wy+wh+5,P.s1); b.hl(wx-5,wx+ww+4,wy+wh+6,P.w0);
  for (var rx=wx+6;rx<wx+ww-6;rx+=3){ b.rect(rx,wy+wh+11,2,10,P.s4); b.px(rx,wy+wh+11,P.s6); b.vl(rx+1,wy+wh+12,wy+wh+20,P.s2); b.vl(rx+2,wy+wh+12,wy+wh+20,P.w0); }
  b.hl(wx+5,wx+ww-6,wy+wh+21,P.s1); b.hl(wx+5,wx+ww-6,wy+wh+10,P.s3);
  b.rect(wx+2,wy+wh-3,5,6,P.m3); b.hl(wx+2,wx+6,wy+wh-3,P.m4); b.vl(wx+6,wy+wh-2,wy+wh+2,P.m1); b.px(wx+3,wy+wh,P.r3);
  for (var pl=0;pl<7;pl++) b.line(wx+4,wy+wh-3,wx+pl,wy+wh-9-(pl%3)*2,pl%2?P.g3:P.g4);

  // ---- Fotos von Hajduk an der Rückwand links, Schal, Wimpel
  // Hajduk 1971 (groß), 1979 und 1994 (kleiner), jeweils mit Jahreszahl auf dem Passepartout
  M.prop.frame(b,40,23,30,21,{frame:M.R('k1 k2 m1'),fill:function(x,y){ return (y>=40)?P.s5:team(x-42,y-25,26,15); }}); M.microText(b,'1971',47,39,P.s2);
  M.prop.frame(b,39,47,16,14,{frame:M.R('w0 w1 w2'),fill:function(x,y){ return (y>=57)?P.s5:team(x-41,y-49,12,8); }}); M.microText(b,'79',44,56,P.s2);
  M.prop.frame(b,57,47,15,14,{frame:M.R('w0 w1 w2'),fill:function(x,y){ return (y>=57)?P.s5:team(x-59,y-49,11,8); }}); M.microText(b,'94',61,56,P.s2);
  for (var sc=0;sc<36;sc++){ var sxx=37+sc, syy=22-Math.round(Math.sin(sc/35*Math.PI)*2)+1, band=Math.floor(sc/3)%4, cc=[P.s6,P.s6,P.r3,P.b1][band]; b.px(sxx,syy,cc); b.px(sxx,syy+1,M.DN[cc]); }
  for (var fr=0;fr<7;fr++){ b.px(36,23+fr,fr%3?P.s6:P.r3); b.px(73,23+fr,fr%3?P.s6:P.b1); }

  // ---- Eingangstür in der linken Wand (oben Glas), Fußmatte, Garderobe
  var dq=M.wallQuad(SPEC,'L',9,31,30,94), dq2=M.wallQuad(SPEC,'L',8,32,28,94);
  b.poly(dq2,function(x,y){ return (y<34)?P.w4:P.w3; }); b.poly(dq,function(x,y){ return ((x+Math.floor(y/9))%5===0)?P.w1:P.w2; }); for (var e=0;e<2;e++){ var e0=dq2[e===0?0:3], e1=dq[e===0?0:3]; } var dl0=M.wallPt(SPEC,'L',8,28), dl1=M.wallPt(SPEC,'L',8,94); b.line(rnd(dl0[0]),rnd(dl0[1]),rnd(dl1[0]),rnd(dl1[1]),P.w4); var dr0=M.wallPt(SPEC,'L',31,30), dr1=M.wallPt(SPEC,'L',31,94); b.line(rnd(dr0[0]),rnd(dr0[1]),rnd(dr1[0]),rnd(dr1[1]),P.w0);
  var gq=M.wallQuad(SPEC,'L',12,28,34,64);
  b.poly(gq,function(x,y){ var c; if (tod==='day') c=(y<44)?P.b4:(y<46?P.s2:P.s4); else if (tod==='dusk') c=(y<44)?P.d4:P.d2; else c=(y<44)?P.n1:P.k2; if (weather==='rain'&&bayer(x,y)<0.3) c=M.DN[c]; if (((x*3+y)%11)===0) c=M.UP[c]; return c; });
  var gl0=M.wallPt(SPEC,'L',12,34), gl1=M.wallPt(SPEC,'L',28,34), gl2=M.wallPt(SPEC,'L',28,64), gl3=M.wallPt(SPEC,'L',12,64);
  b.line(rnd(gl0[0]),rnd(gl0[1]),rnd(gl1[0]),rnd(gl1[1]),P.w0); b.line(rnd(gl3[0]),rnd(gl3[1]),rnd(gl2[0]),rnd(gl2[1]),P.w4); b.line(rnd(gl0[0]),rnd(gl0[1]),rnd(gl3[0]),rnd(gl3[1]),P.w4);
  var pq=M.wallQuad(SPEC,'L',13,27,70,90); b.poly(pq,P.w1); var pq2=M.wallQuad(SPEC,'L',14,26,72,88); b.poly(pq2,P.w2);
  var kn=M.wallPt(SPEC,'L',11,66); b.rect(rnd(kn[0]),rnd(kn[1]),2,4,P.y2); b.px(rnd(kn[0]),rnd(kn[1]),P.y5);
  var sg=M.wallPt(SPEC,'L',19,40); b.line(rnd(sg[0])-1,rnd(sg[1])-4,rnd(sg[0])+2,rnd(sg[1])-1,P.k2); b.rect(rnd(sg[0])-4,rnd(sg[1]),9,5,P.s5); b.hl(rnd(sg[0])-3,rnd(sg[0])+3,rnd(sg[1])+2,P.r2);
  b.poly([R3.p(4,FY,10),R3.p(30,FY,10),R3.p(30,FY,24),R3.p(4,FY,24)],function(x,y){ return ((x+y)&1)?P.r1:P.w1; });
  var tb=M.wallPt(SPEC,'L',20,27); b.line(rnd(tb[0]),rnd(tb[1]),rnd(tb[0])+3,rnd(tb[1])+2,P.k2); b.ellipse(tb[0]+3.5,tb[1]+4,1.8,2,P.y3); b.px(rnd(tb[0])+3,rnd(tb[1])+3,P.y5);   // Türglöckchen
  var gx=28, gyb=99;   // Garderobenständer (Bugholz) in der Ecke
  b.vl(gx,46,gyb-2,P.w1); b.vl(gx+1,46,gyb-2,P.w3); b.line(gx,gyb-3,gx-5,gyb,P.w1); b.line(gx+1,gyb-3,gx+6,gyb,P.w2); b.line(gx,gyb-3,gx+1,gyb,P.w0);
  b.line(gx,48,gx-4,44,P.w2); b.line(gx+1,48,gx+5,44,P.w3); b.rect(gx-1,44,4,2,P.w4);
  b.ellipse(gx-4,43.5,3,1.6,P.e2); b.hl(gx-7,gx-2,44,P.e1); b.px(gx-5,42,P.e3);      // Schiebermütze
  b.poly([[gx+3,45],[gx+7,46],[gx+9,72],[gx+5,74],[gx+2,72],[gx+1,56]],function(x,y){ return (x>gx+6)?P.m1:(((x+y)%6===0)?P.m1:P.m2); }); b.vl(gx+4,48,72,P.m0); b.px(gx+3,47,P.m3);
  b.poly([[gx-1,49],[gx-4,50],[gx-6,62],[gx-2,63]],P.r2); b.vl(gx-3,51,62,P.r1);     // roter Schal

  // ---- Bar-Rückwand: Holzaufbau, Spiegel, Glasborde mit Flaschen
  var bx0=76, bx1=198;
  b.rect(bx0,16,bx1-bx0,66,P.w1); b.rect(bx0-2,14,bx1-bx0+4,5,P.w2); b.hl(bx0-3,bx1+2,13,P.w4); b.hl(bx0-2,bx1+1,14,P.w3); b.hl(bx0-2,bx1+1,19,P.w0);
  for (var dn=bx0;dn<bx1;dn+=4) b.px(dn,17,P.w3);
  b.vl(bx0,16,82,P.w2); b.vl(bx1-1,16,82,P.w0);
  // Spiegel (Mitte), leicht blind, spiegelt Fenster und Flaschen
  var mx0=108, mx1=166, my0=22, my1=68;
  for (var yy2=my0;yy2<my1;yy2++) for (var xx=mx0;xx<mx1;xx++){ var dd=(xx-mx0)+(yy2-my0)*0.6, cm=P.m2; if ((dd%26)<5) cm=P.m3; if ((dd%26)<2) cm=P.m4; if (hash(xx,yy2)<0.04) cm=P.m1;
      if (yy2>my1-12 && bayer(xx,yy2)<(yy2-my1+12)/14) cm=M.DN[cm]; if (xx<mx0+2||yy2<my0+1) cm=P.m1; b.px(xx,yy2,cm); }
  b.drect(mx0+40,my0+12,12,15,P.m3,tod==='day'?P.b4:P.m2,0.5); b.vl(mx0+45,my0+12,my0+26,P.m2); b.hl(mx0+40,mx0+51,my0+18,P.m2);   // Fenster im Spiegel
  for (var q=0;q<7;q++) b.rect(mx0+4+q*4,my1-9,2,7,q%2?P.m1:P.g1);                                                                   // Flaschenrücken
  b.rect(mx0-2,my0-2,mx1-mx0+4,2,P.y2); b.rect(mx0-2,my1,mx1-mx0+4,2,P.y1); b.vl(mx0-2,my0-2,my1+1,P.y2); b.vl(mx1,my0-2,my1+1,P.y1); b.vl(mx1+1,my0-2,my1+1,P.y0); b.hl(mx0-2,mx1+1,my0-2,P.y3);
  M.text(b,'Bura',123,my0+5,P.y0); M.text(b,'Bura',122,my0+4,P.y4); b.px(122,my0+4,P.y5); b.hl(117,145,my0+13,P.y2); b.px(116,my0+13,P.y3); b.px(146,my0+13,P.y3);
  // Glasborde links und rechts vom Spiegel
  var cols=[P.g2,P.y2,P.s5,P.r2,P.w3,P.g3,P.a4,P.y3,P.e3,P.k2,P.r1,P.g1,P.t3,P.s4];
  [[bx0+3,mx0-4],[mx1+4,bx1-3]].forEach(function(seg,si){ for (var sh=0;sh<4;sh++){ var syb=32+sh*13, r=M.rng(17+si*7+sh*3), x=seg[0];
      b.hl(seg[0]-1,seg[1],syb,P.a6); b.hl(seg[0]-1,seg[1],syb+1,P.s2); b.hl(seg[0],seg[1]-1,syb+2,P.w0);
      while (x<seg[1]-3){ var kinds=['wine','sq','tall','round','straw','wine','sq'], kd=kinds[Math.floor(r()*kinds.length)], c=cols[Math.floor(r()*cols.length)];
        if (sh===0 && r()<0.5){ b.rect(x,syb-4,2,4,P.a5); b.px(x,syb-4,P.s6); b.px(x+1,syb-1,P.a4); x+=3; continue; }
        bottle(b,x,syb,c,kd,Math.floor(r()*9)); x+=(kd==='sq'||kd==='straw'||kd==='round')?5:4; if (r()<0.15) x+=2; } } });
  // weiß gekachelter Spritzschutz unter dem Spiegel (hinter Sanja)
  for (var ty2=71;ty2<82;ty2++) for (var tx2=mx0-2;tx2<mx1+2;tx2++){ var tc=((tx2-mx0)%6===0||(ty2-71)%5===0)?P.s3:(((tx2+ty2)%9===0)?P.s4:P.s5); if (ty2>=79) tc=M.DN[tc]; b.px(tx2,ty2,tc); }
  b.hl(mx0-3,mx1+2,70,P.w0);
  for (var cu=0;cu<6;cu++){ var cx2=bx0+4+cu*4; b.rect(cx2,73,3,3,P.s6); b.px(cx2+3,74,P.s5); b.hl(cx2,cx2+2,76,P.s4); b.rect(cx2,70,3,2,P.s5); }   // Tassen gestapelt
  // Radio auf einem kleinen Wandbrett rechts
  var rdx=RADIO[0], rdy=RADIO[1]; b.rect(rdx-1,rdy+7,15,2,P.w3); b.hl(rdx-1,rdx+13,rdy+7,P.w4); b.px(rdx+1,rdy+9,P.w1); b.px(rdx+11,rdy+9,P.w1);
  b.rect(rdx,rdy-1,13,8,P.r2); b.hl(rdx,rdx+12,rdy-1,P.r4); b.vl(rdx+12,rdy,rdy+6,P.r1); b.rect(rdx+1,rdy+1,6,5,P.k2); for (var g=0;g<3;g++) b.hl(rdx+1,rdx+6,rdy+2+g*1.5|0,P.m1);
  b.rect(rdx+8,rdy+1,4,2,P.y4); b.px(rdx+9,rdy+1,P.r4); b.px(rdx+9,rdy+4,P.s4); b.px(rdx+11,rdy+4,P.s4); b.line(rdx+11,rdy-1,rdx+16,rdy-10,P.m3); b.px(rdx+16,rdy-10,P.m4);

  // Wimpel (rot-weißes Schachbrett) unter dem Radio
  b.hl(200,211,61,P.b1); b.hl(200,211,60,P.b2); b.px(205,59,P.k2); b.poly([[200.5,62],[211.5,62],[206,74]],function(x,y){ return ((Math.floor((x-200)/2)+Math.floor((y-62)/2))&1)?P.r3:P.s6; });
  // ---- Deckenventilator (Nabe; die Flügel drehen sich in dynamic), Pendellampen
  b.vl(FAN[0],0,FAN[1]-3,P.k2); b.rect(FAN[0]-3,FAN[1]-3,7,4,P.y2); b.hl(FAN[0]-3,FAN[0]+3,FAN[1]-3,P.y4); b.hl(FAN[0]-2,FAN[0]+2,FAN[1]+1,P.y1);
  LAMPS.forEach(function(l){ pendant(b,l[0],l[1],false); });
  pendant(b,CLAMP[0],CLAMP[1],false,M.R('w1 w2 w3 w4'));

  // ---- Markos Ecktisch am Fenster (hinten rechts)
  thonet(b,298,90,98,'R');
  var MT=[254,274,6,15], top=[R3.p(MT[0],80,MT[2]),R3.p(MT[1],80,MT[2]),R3.p(MT[1],80,MT[3]),R3.p(MT[0],80,MT[3])];
  [[MT[0]+1,MT[2]+1],[MT[1]-1,MT[2]+1],[MT[0]+1,MT[3]-0.5],[MT[1]-1,MT[3]-0.5]].forEach(function(lg,i){ var a=R3.p(lg[0],81,lg[1]), z=R3.p(lg[0],FY,lg[1]); b.rect(rnd(a[0]),rnd(a[1]),2,rnd(z[1]-a[1]),i<2?P.m0:P.k2); if (i>=2) b.px(rnd(a[0]),rnd(a[1])+2,P.m2); });
  b.poly([top[3],top[2],R3.p(MT[1],82,MT[3]),R3.p(MT[0],82,MT[3])],P.s2);
  b.poly(top,function(x,y){ var c=P.s5; if (hash(x>>1,y)<0.18) c=P.s4; if (Math.sin(x*0.5+y*2.1)>0.9) c=P.s4; if (x<top[0][0]+5) c=P.s6; return c; });
  var cupA=R3.p(268,80,11); b.rect(rnd(cupA[0]),rnd(cupA[1])-3,3,3,P.s6); b.px(rnd(cupA[0])+3,rnd(cupA[1])-2,P.s5); b.hl(rnd(cupA[0])-1,rnd(cupA[0])+3,rnd(cupA[1]),P.s4);
  var tray=R3.p(258,80,10); b.ellipse(tray[0]+2,tray[1]-0.5,2.6,1,P.m2); b.px(rnd(tray[0])+2,rnd(tray[1])-1,P.s4);
  thonet(b,258,91,100,'L');

  // ---- Kartentisch der beiden Alten: Stühle passend zu den Sitzpositionen (Stipe 214 'R', Frane 252 'L')
  thonet(b,213,111,124,'L'); thonet(b,253,111,124,'R');
  bistro(b,CT.x,CT.top,CT.y,12);
  var ty=CT.top, regulars=(GS.phase==='c1'||GS.phase==='c2'||GS.phase==='pro');   // am Dienstag spielen sie auch; am Donnerstagmorgen noch nicht
  if (regulars){ b.rect(225,ty-1,4,2,P.s6); b.px(226,ty-1,P.r3); b.rect(238,ty-1,4,2,P.s6); b.px(240,ty,P.b1);       // abgelegte Stiche
    b.rect(231,ty,4,2,P.e4); b.hl(231,234,ty,P.s6); b.px(232,ty+1,P.r3); b.rect(229,ty+1,3,1,P.s5);                  // Talon + Trumpf
    b.rect(222,ty-3,2,3,P.a5); b.px(222,ty-3,P.s6); b.px(223,ty-1,P.y3); b.rect(243,ty-3,2,3,P.a5); b.px(243,ty-3,P.s6); b.px(243,ty-1,P.r2); }   // zwei Gläser
  else { b.rect(230,ty,5,2,P.e4); b.hl(230,234,ty,P.s5); }                                                       // nur das Kartenspiel, zusammengelegt
  b.ellipse(236.5,ty+2,1.8,0.8,P.m2); b.px(237,ty+1,P.s5);                                                       // Aschenbecher

  // ---- Licht
  var noWin=function(x,y){ return !inWin(x,y); };
  if (tod==='day'){
    M.light(b,M.lf.sum(M.lf.pool(WIN[0]+WIN[2]/2,110,120,46,0.9),M.lf.pool(WIN[0]+WIN[2]/2,60,80,50,0.5),M.lf.vignette(W,144,2.4),M.lf.xband(0,170,-0.7,0),M.lf.k(-0.2)),0,0,noWin);
    M.light(b,function(x,y){ return sunOnFloor(x,y)*2.2; },0,0,function(x,y){ return floorMask[y*W+x]===1; });
    return b; }
  // Abend: innen Lampenlicht (warm), in den Ecken die kühle Dämmerung, draußen die Straße in Dämmerfarben
  evening(b,tod,0,0,function(x,y){ return !inWin(x,y); });
  M.tintApply(b,M.TINT[tod]||M.TINT.dusk,WIN[0],STREETY,WIN[2],WIN[1]+WIN[3]-STREETY);
  LAMPS.forEach(function(l){ pendant(b,l[0],l[1],true); }); pendant(b,CLAMP[0],CLAMP[1],true,M.R('w1 w2 w3 w4'));
  b.rect(rdx+8,rdy+1,4,2,P.y5); b.px(rdx+9,rdy+1,P.r4);
  return b; }
// Lampenlicht 0..1 an einem Punkt
function lampAmt(x,y){ var m=0; for (var i=0;i<LIGHTS.length;i++){ var l=LIGHTS[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[4], d=dx*dx+dy*dy; if (d<1) m=Math.max(m,(1-d)*l[3]); } return Math.min(1,m); }
// Abendbeleuchtung: Helligkeit nach Lampennähe, dann warm (Lampe) oder kühl (Dämmerung) gefärbt, mit schmalem Übergang
var WARM=M.tintMake(function(r,g,b){ return [r*0.94+20, g*0.80+8, b*0.60+2]; });   // Lampenlicht, behält die Farbtöne
function evening(b,tod,ox,oy,mask){ var TL=WARM, TD=M.TINT[tod]||M.TINT.dusk;
  M.light(b,function(x,y){ var a=lampAmt(x,y); return -1.4+a*2.0; },ox,oy,mask);
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var L=lampAmt(X,Y), q=Math.max(0,Math.min(1,(L-0.22)*5)), q2=Math.max(0,Math.min(1,(L-0.62)*3.5)), d=bayer(X,Y);
    b.d[k]=(d<q2)?M.tintPx(M.TINT.lamp,c,X,Y):((d<q)?M.tintPx(TL,c,X,Y):M.tintPx(TD,c,X,Y)); } }
// Mannschaftsfoto (Schwarzweiß): stehende und kniende Reihe
function team(u,v,w,h){ var c=v<5?P.s4:(v<9?P.s3:P.s2);
  var row=v<8?0:1, top=row?8:2, n=row?6:7, sp=w/n, off=row?sp/2:0.5, k=Math.floor((u-off)/sp), fu=(u-off)-k*sp;
  if (k>=0 && k<n && fu>=0.4 && fu<2.6){ var dv=v-top; if (dv===0) c=P.k2; else if (dv===1) c=P.s1; else if (dv>=2 && dv<5) c=P.s6; else if (dv===5) c=P.k2; else if (dv===6&&!row) c=P.s4; }
  return c; }
function stadium(u,v,w,h){ var c=v<4?P.s4:P.s3; var a=u-w/2, roof=2+a*a*0.09; if (v>roof && v<roof+2) c=P.s6; if (v>=roof+2 && v<6) c=P.s1; if (v>=6) c=P.s2; return c; }
function portrait(u,v){ var c=P.s4; var dx=u-4.5, dy=v-3.2; if (dx*dx+dy*dy<5.5) c=P.s2; if (dy<-1 && dx*dx+dy*dy<6) c=P.k2; if (v>5 && Math.abs(dx)<4) c=P.s5; if (v>5 && Math.abs(dx)<1.2) c=P.s1; return c; }

// ---------------------------------------------------------------- Vordergrund: der Tresen (verdeckt Sanja bis zur Hüfte)
function layers(S,GS,tod){ var L=[];
  var x0=48, y0=56, lay=M.layer(x0,y0,160,60,114), w=M.lw(lay), fw={poly:function(p,c){ w.poly(p,c); }};
  var fl=R3.p(CNT.X0,CNT.Y0,CNT.Z1)[0], frx=R3.p(CNT.X1,CNT.Y0,CNT.Z1)[0];
  R3.box(fw,CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1,{
    top:function(x,y){ var c=(hash(x>>2,y)<0.3)?P.m3:P.m4; var rx=((x*7)%23)-11; if (Math.abs(Math.hypot(rx*0.5,(y-83)*1.6)-2.2)<0.5 && hash(Math.floor(x/23),2)<0.7) c=P.m2; if (y<=82) c=P.m2; return c; },   // Zink, Ringe von Tassen
    front:function(x,y){ var p=((x-fl)%20+20)%20, top=89, bot=108, c=P.w2;
      if (y<88) c=(y<=86)?P.m2:P.w1;                       // Zinkkante, Schattenfuge
      else if (y>=bot+1) c=(y>=bot+4)?P.k2:P.w1;           // Sockel
      else if (p<2) c=p<1?P.w1:P.w3;                       // Rahmen zwischen den Füllungen
      else if (y>=top+2 && y<=bot-2 && p>=4 && p<=17){ c=P.w3; if (y===top+2||p===4) c=P.w4; if (y===bot-2||p===17) c=P.w1; if (p>=6&&p<=15&&y>=top+4&&y<=bot-4){ var tt=(y-top-4)/(bot-top-8); c=(tt<0.42)?P.w3:(tt>0.62?P.w2:(bayer(x,y)<(tt-0.42)/0.2?P.w2:P.w3)); if (p===6||y===top+4) c=P.w1; } }
      return c; } });
  var a=R3.p(CNT.X0,CNT.Y0,CNT.Z1), bb=R3.p(CNT.X1,CNT.Y0,CNT.Z1); w.hl(rnd(a[0]),rnd(bb[0]),rnd(a[1]),P.s6); w.hl(rnd(a[0]),rnd(bb[0]),rnd(a[1])+1,P.m3); w.hl(rnd(a[0]),rnd(bb[0]),rnd(a[1])+2,P.m1);
  // Messingstange unten
  var fr0=R3.p(CNT.X0,90,CNT.Z1+3), fr1=R3.p(CNT.X1,90,CNT.Z1+3); w.hl(rnd(fr0[0])+1,rnd(fr1[0])-1,rnd(fr0[1]),P.y4); w.hl(rnd(fr0[0])+1,rnd(fr1[0])-1,rnd(fr0[1])+1,P.y2);
  for (var hx=rnd(fr0[0])+8;hx<fr1[0];hx+=40){ w.vl(hx,rnd(fr0[1])+2,rnd(fr0[1])+4,P.y1); w.px(hx,rnd(fr0[1])+5,P.y2); }
  espresso(w,57,83);
  // Glasglocke mit Fritule
  var gl=[94,82]; w.ellipse(gl[0]+5.5,gl[1]-5,6,6,function(x,y){ return (y>gl[1]-1)?T:((((x+y)%6)===0)||x<gl[0]+2?P.a6:T); }); w.hl(gl[0]-1,gl[0]+11,gl[1],P.s5); w.hl(gl[0],gl[0]+10,gl[1]-1,P.s4);
  for (var fi=0;fi<5;fi++){ w.ellipse(gl[0]+2.5+fi*1.6,gl[1]-2-(fi%2),1.3,1.2,P.y2); w.px(Math.floor(gl[0]+2+fi*1.6),gl[1]-3-(fi%2),P.y4); }
  w.rect(gl[0]+5,gl[1]-12,2,2,P.s5); w.px(gl[0]+5,gl[1]-12,P.s6);
  // Zapfhahn
  w.rect(108,74,3,8,P.m3); w.vl(108,74,81,P.m4); w.rect(107,71,5,3,P.k2); w.rect(108,66,3,5,P.y3); w.px(108,66,P.y5); w.rect(107,81,5,1,P.m1);
  // Untertassen mit Tassen, Wassergläser
  [140,146].forEach(function(xx){ w.hl(xx,xx+4,81,P.s5); w.rect(xx+1,78,3,3,P.s6); w.px(xx+4,79,P.s5); w.px(xx+1,80,P.s4); });
  [132,135].forEach(function(xx){ w.rect(xx,76,2,5,P.a5); w.px(xx,76,P.s6); w.px(xx+1,80,P.a4); });
  // Zeitung (auf dem Tresen, hängt vorne über die Kante)
  if (!S.paperTaken && (GS.phase==='c2'||GS.phase==='i1m')){ var nx=160, ny=81; w.poly([[nx,ny],[nx+15,ny-1],[nx+17,ny+1],[nx+1,ny+2]],P.s5); w.hl(nx+1,nx+15,ny,P.s6); w.rect(nx+2,ny+2,14,9,P.s5); w.hl(nx+2,nx+15,ny+2,P.s6);
    w.rect(nx+3,ny+3,12,2,P.k2); w.px(nx+4,ny+3,P.s5); w.px(nx+8,ny+3,P.s5); for (var ln=0;ln<3;ln++) w.hl(nx+3,nx+8,ny+6+ln,P.s3); w.rect(nx+10,ny+6,5,4,P.s2); w.px(nx+12,ny+7,P.s4);
    w.vl(nx+16,ny+2,ny+10,P.s3); w.hl(nx+2,nx+16,ny+11,P.s2); }
  // Donnerstagmorgen: Sanjas Zettel, offen auf ihrer Seite des Tresens, unter der Lampe – von vorn nicht lesbar
  if (GS.phase==='i1m'){ var zx=113, zy=77; w.poly([[zx-1,zy],[zx+8,zy-2],[zx+10,zy+2],[zx+1,zy+4]],P.k2); w.poly([[zx,zy],[zx+8,zy-1],[zx+9,zy+2],[zx+1,zy+3]],P.s6);
    w.hl(zx+2,zx+6,zy,P.b2); w.hl(zx+2,zx+7,zy+1,P.s3); w.px(zx+3,zy+2,P.b1); w.px(zx+6,zy+2,P.r3); w.px(zx+7,zy+2,P.r3); w.line(zx+10,zy+3,zx+13,zy+2,P.b1); }
  // Trinkgeld-Schälchen, Serviettenhalter
  w.ellipse(181,81,2.5,1,P.m3); w.px(181,80,P.y4); w.rect(186,76,3,5,P.m3); w.rect(187,77,1,3,P.s6);
  if (tod!=='day') evening(lay,tod,lay.ox,lay.oy);
  else M.light(lay,M.lf.xband(46,80,-0.9,0),lay.ox,lay.oy);
  L.push(lay);
  return L; }
// Hebel-Espressomaschine: Chrom, rote Emaille-Front, Kuppel mit Adler, zwei hochgezogene Hebel; x = linke Kante, by = Tresenoberfläche
function espresso(w,x,by){ var gx2, xx, yy;
  w.rect(x,by-2,26,2,P.k2); for (gx2=x+1;gx2<x+25;gx2+=2) w.px(gx2,by-2,P.m2);            // Abtropfgitter
  for (yy=by-14;yy<by-2;yy++) for (xx=x;xx<x+26;xx++){ var u=(xx-x)/25, c=u<0.04?P.m2:(u<0.14?P.m4:(u<0.2?P.s6:(u<0.75?P.m4:(u<0.9?P.m3:P.m1)))); w.px(xx,yy,c); }
  w.rect(x+3,by-12,20,6,P.r2); w.hl(x+3,x+22,by-12,P.r3); w.hl(x+3,x+22,by-7,P.r1); w.vl(x+3,by-12,by-7,P.r3);   // Emaille-Front
  w.rect(x+10,by-11,6,3,P.y3); w.hl(x+10,x+15,by-11,P.y4); w.px(x+12,by-10,P.r2); w.px(x+13,by-10,P.r2);    // Messingschild
  w.hl(x,x+25,by-14,P.s6); w.hl(x+1,x+24,by-13,P.m2);
  w.ellipse(x+13,by-14,9,4.4,function(px,py){ if (py>by-15) return T; var u=(px-x-4)/18; return u<0.22?P.m4:(u<0.32?P.s6:(u<0.7?P.m3:P.m1)); });   // Kuppel
  w.ellipse(x+9,by-16.5,1.6,1.6,P.s6); w.px(x+9,by-17,P.k2);                                                        // Manometer
  w.hl(x+11,x+15,by-19,P.y2); w.px(x+12,by-20,P.y4); w.px(x+13,by-21,P.y4); w.px(x+14,by-20,P.y3); w.px(x+10,by-20,P.y3); w.px(x+16,by-20,P.y2);   // Adler
  [x+6,x+19].forEach(function(gx){ w.rect(gx-1,by-6,4,3,P.m3); w.px(gx-1,by-6,P.s6); w.hl(gx-1,gx+2,by-3,P.m1);                  // Brühgruppe
    w.line(gx-1,by-4,gx-5,by-3,P.k1); w.px(gx-6,by-3,P.k2);                                                                   // Siebträger
    w.line(gx+1,by-14,gx-2,by-26,P.k1); w.line(gx+2,by-14,gx-1,by-26,P.m1); w.rect(gx-3,by-28,3,3,P.k2); w.px(gx-3,by-28,P.m2); });   // Hebel
  w.line(x+25,by-10,x+28,by-3,P.m3); w.px(x+28,by-3,P.m4);                                                            // Dampflanze
  for (var i=0;i<3;i++){ var cx=x+18+i*3; w.rect(cx,by-17,2,2,P.s6); w.px(cx+1,by-16,P.s4); } }

// ---------------------------------------------------------------- bewegte Teile
function dyn(fb,v,S,GS){ var tod=v.tod, weather=M.scn.weather(GS), tint=tod!=='day'?M.TINT[tod]:null;
  function tp(x,y,c){ fb.px(x,y,tint?M.tintPx(tint,c,x,y):c); }
  // Ventilator: vier Holzflügel, von unten gesehen
  var t=v.t*2.4, cx=FAN[0]+0.5, cy=FAN[1]+1;
  for (var k=0;k<4;k++){ var a=t+k*Math.PI/2, ca=Math.cos(a), sa=Math.sin(a), wd=Math.abs(sa)*1.4;
    for (var s=3;s<24;s++){ var x=rnd(cx+ca*s), y=rnd(cy+sa*s*0.18); tp(x,y,s<5?P.y2:P.w3); tp(x,y+1,s<5?P.y1:(wd>0.7?P.w2:P.w1)); if (wd>1&&s>6) tp(x,y-1,P.w4); } }
  if (tod==='day') M.scn.gulls(fb,v.t,WIN[0]+2,WIN[1]+1,WIN[2]-4,9,2,0);
  if (weather==='rain') M.scn.windowRain(fb,WIN[0],WIN[1],WIN[2],WIN[3],v.t,0);
  if (weather==='bura' && tod==='day'){ var ch=(v.t*0.11)%1, chx=WIN[0]-12+Math.round(ch*(WIN[2]+28)), chy=STREETY+6-Math.round(Math.abs(Math.sin(ch*18))*3), rot=Math.floor(v.t*6)%4;
    var CH=[['#..#','####','#..#','#..#'],['####','#...','####','#..#'],['#..#','#..#','####','#..#'],['#..#','####','...#','####']][rot];
    for (var cy2=0;cy2<4;cy2++) for (var cx2=0;cx2<4;cx2++) if (CH[cy2][cx2]==='#'){ var px2=chx+cx2, py2=chy+cy2; if (px2>=WIN[0]&&px2<WIN[0]+WIN[2]&&py2<WIN[1]+WIN[3]) fb.px(px2,py2,(cy2===0)?P.s6:P.s5); } }
  if (weather==='bura'){ for (var i=0;i<3;i++){ var sp=50+hash(i,41)*50, x2=WIN[0]+Math.floor((v.t*sp+hash(i,42)*200)%(WIN[2]+20))-10, y2=STREETY-4+Math.floor(hash(i,43)*12+Math.sin(v.t*5+i)*2);
      if (x2>=WIN[0]&&x2<WIN[0]+WIN[2]){ fb.px(x2,y2,i%2?P.e3:P.s5); fb.px(x2+1,y2+(i&1),i%2?P.e2:P.s4); } } }
  // Dampf aus der Espressomaschine, ab und zu
  var ph=(v.t%9); if (ph<2.4){ for (var j=0;j<6;j++){ var yy=rnd(79-ph*7-j*2), xx=rnd(86+Math.sin(v.t*3+j)*1.5+j*0.4); if (yy>56) tp(xx,yy,j%2?P.s4:P.s5); } }
  // Zigarettenrauch vom Kartentisch
  for (var n=0;n<7;n++){ var hy=rnd(102-((v.t*5+n*4)%24)), hx=rnd(237+Math.sin(v.t*1.3+n*0.9)*2+n*0.25); tp(hx,hy,n%2?P.s4:P.s3); }
  if (tod!=='day') M.glow(fb,CLAMP[0],CLAMP[1]+3,10,v.t,0.25); }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ if (y>140||x<6||x>314) return false;
  if (x>=200 && x<=264 && y<130) return false;            // Kartentisch mit Stühlen
  if (y>=116) return true;
  if (x>=264 && y>=106) return true;                      // Ecke bei Markos Tisch
  if (x<=50 && y>=104 && y>=95+(32-x)*0.37) return true;  // bei der Tür
  return false; };

// Mala geht auch hinter den Tresen (Geister brauchen keine Klappe): Sanjas Seite, bis an die Lauffläche davor
var WALKG=function(x,y,S,GS){ return x>=86 && x<=182 && y>=99 && y<=118; };
M.defineArt('bar',{
  width:W, paint:paint, layers:layers, walk:WALK, walkG:WALKG, dynamic:dyn,
  actorLut:function(a,S,GS,tod){ return tod==='day'?null:WARM.a; },   // abends: warmes Lampenlicht auf den Figuren
  spots:{
    door:[0,28,30,80],
    counter:[52,82,146,32],
    espresso:[54,58,32,24],
    bottles:[78,20,118,58],
    radio:[198,40,18,20],
    photos:[35,19,40,58],
    window:[208,14,80,64],
    marko_table:[234,78,66,26],
    cards_table:[204,92,60,32],
    newspaper:[158,78,20,14]
  },
  stands:{
    door:[20,118,'L'], counter:[124,120,'B'], espresso:[72,119,'B'], bottles:[104,119,'B'], radio:[196,119,'B'], photos:[46,112,'B'],
    window:[290,110,'B'], marko_table:[280,112,'B'], cards_table:[233,134,'B'], newspaper:[168,119,'B']
  },
  actorPos:{ sanja:[120,106,'F','sanja'], stipe:[214,124,'R','stipe',false,'cards'], frane:[252,124,'L','frane',false,'cards'] },
  start:[22,120,'R'], entries:{ map:[22,120,'R'] }
});
})(M);
