/* ===== rooms/art/skela_d.js — Skela, rechtes Ufer: die Anlegestelle (480 px, scrollend) =====
   Ein Hochufer über der Flussbiegung, zehn Kilometer südlich von Mostar. Links endet die Schotterstraße an der Hütte (Ruine:
   Bruchsteinmauern, das halbe Dach aus Steinplatten, die andere Hälfte nur noch Sparren). Daneben das Widerlager der alten
   Brücke, abgebrochen, Bewehrungseisen; im Fluss die drei Pfeilerstümpfe, wie abgebrochene Zähne, in einer Reihe in die Tiefe.
   An der Kante der Holzpfosten mit der Glocke (Schiffsglocke, Messing, grün angelaufen, Seilzug), der rostige Seilanker
   (Betonblock, Eisenring, ein Stück Stahlseil hängt die Rampe hinab ins Wasser) und die Anlegestelle: eine Betonrampe hinunter
   zum Fluss. Rechts, flussauf, die neue Brücke von 1998 mit ihrer Laterne. Drüben das linke Ufer: Felder, Pappeln, der Weiler,
   Zlatas Haus mit seinen drei Fenstern (unten breit das Küchenfenster, daneben tief und schmal das Stubenfenster, oben unter
   dem Dach klein das Dachfenster), Batos Schuppen am Steg, der Quittenbaum mit dem Grab.
   Zustände: S.lit (welches Fenster drüben leuchtet), S.lantern (Laterne im Schuppen), S.ferry ('far'|'mid'|'here'|'gone'), S.zvono.
   Malas Sicht: ein Stahlseil aus Licht vom Anker hinüber; ab k3.bato.found eine Leine aus Licht von der Glocke zum Schuppen. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=480, H=144;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function puff(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bx=0, by=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.15+hash(gx+i+sd,gy+j)*0.7)*sx, cy=(gy+j+0.15+hash(gx+i,gy+j+sd*1.7)*0.7)*sy;
    var dx=(x-cx)/sx, dy=(y-cy)/sy, d=dx*dx+dy*dy; if (d<b1){ b2=b1; b1=d; bx=dx; by=dy; } else if (d<b2) b2=d; }
  var v=0.6-by*0.75-bx*0.25-b1*0.3; if (b2-b1<0.1) v-=0.32; return v; }
// Bruchstein: unregelmäßige Steine, jede mit eigener Rampe
function blocks(u,v,sw,sh,sd,ramps,jc){ var row=Math.floor(v/sh), fv=v-row*sh, bw=sw*(0.7+hash(row,sd+2)*0.7), uu=u+hash(row,sd)*sw, col=Math.floor(uu/bw), fu=uu-col*bw;
  if (fv<1||fu<1) return jc; var rr=ramps[Math.floor(hash(col+sd*3,row+11)*ramps.length)], t=hash(col*13+sd,row*7+sd), k=t<0.3?0:(t<0.8?1:2), c=rr[k];
  if (fv<2&&fu>1&&fu<bw-1) c=rr[k+1]; else if (fv>=sh-1||fu>=bw-1) c=rr[Math.max(0,k-1)];
  var p=hash(u*3+col,v*5+row); if (p<0.05) c=M.DN[c]; else if (p>0.975) c=M.UP[c]; return c; }
var STONE=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5'),R('e2 e3 s3 s4'),R('s2 s3 s4 s4')];

// Regionen: wer wo gemalt hat (Licht, Himmel, Wasser, Geistersicht)
var REG=new Uint8Array(W*H), RG={none:0,sky:1,hill:2,bank:3,house:4,water:5,stump:6,ground:7,hut:8,wood:9,conc:10,bridge:11,veg:12,glass:13,roof:14};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Geometrie
var HZ=58;                                                       // gedachter Horizont (für die Tiefe im Wasser)
function farWL(x){ return 77+Math.sin(x*0.031)*0.8+Math.sin(x*0.11+1)*0.4; }   // Wasserlinie drüben
var RAMP={xl0:208,xr0:262,y0:113,xl1:221,xr1:249,y1:101};       // Rampe der Anlegestelle: vorn breit, hinten am Wasser schmal
function edgeY(x){ var e=109.5+Math.sin(x*0.13)*0.8+Math.sin(x*0.41+2)*0.5+(hash(x>>2,3)<0.2?1:0); if (x>=106&&x<=142) e=105.5+Math.sin(x*0.7)*0.8+(hash(x,9)<0.3?1.5:0); return e; }
function inRamp(x,y){ if (y<RAMP.y1||y>RAMP.y0) return false; var t=(y-RAMP.y1)/(RAMP.y0-RAMP.y1); return x>=lerp(RAMP.xl1,RAMP.xl0,t)&&x<=lerp(RAMP.xr1,RAMP.xr0,t); }
var HUT={x0:30,x1:104,top:70,ridge:56,by:112};
var DOOR={x0:54,x1:69,top:80}, HWIN={x0:82,x1:91,y0:84,y1:92};
var STUMPS=[{x:121,wl:102,top:80,w:13},{x:129,wl:90.5,top:77,w:9},{x:134.5,wl:83,top:75.5,w:6}];
var STSTONE=[R('s0 s1 s2 s3'),R('s1 s2 s3 s4'),R('e1 s1 s2 s3'),R('s0 s1 s2 s3')];
var POST={x:152,by:114,top:58}, BELL={x:167,y:62};              // Pfosten (Mitte), Aufhängung der Glocke
var ANCH={x0:184,x1:202,y0:105,by:114,rx:199,ry:106};
var FH={x0:180,base:74,w:40};                                    // Zlatas Haus drüben
var SHED={x0:228,x1:256,top:62,base:76};
var JETTY={x0:258,x1:278};
var QX=136;                                                      // Quittenbaum drüben (Stamm)
var BR={x0:470,y0:82,x1:396,y1:73};                              // neue Brücke: nahes Ende (auf dem Felsvorsprung), fernes Ende (Fahrbahnoberkante)
// rechts biegt das eigene Ufer zurück: über eine kleine Bucht sieht man seine Felswand, oben der Weg zur Brücke
function cliffTop(x){ return 84+Math.sin(x*0.09)*1.2+Math.sin(x*0.31)*0.5; }
function cliffFoot(x){ return x<334?lerp(110,97,sm((x-302)/32)):97+Math.sin(x*0.05)*1.5+Math.sin(x*0.23)*0.6; }
function inCliff(x,y){ return x>=302 && y>=cliffTop(x) && y<cliffFoot(x); }
var FERRY={ here:[236,99,1], mid:[248,88,0.62], far:[265,79,0.36] };

// Fassade von Zlatas Haus, als Anteile der Hausbreite (dieselbe in skela_l)
var FAC={gf:0.34, knee:0.11, roof:0.19, door:[0.07,0.24,0,0.92], kitchen:[0.31,0.58,0.42,0.82], stube:[0.70,0.79,0.12,0.84], roofw:[0.47,0.56,0.22,0.86], chim:0.78};
function facRect(k){ var w=FH.w, gf=Math.round(w*FAC.gf), kn=Math.round(w*FAC.knee), f=FAC[k], x0=FH.x0+Math.round(f[0]*w), x1=FH.x0+Math.round(f[1]*w);
  if (k==='roofw'){ var yb=FH.base-gf; return [x0,yb-Math.round(f[3]*kn),x1-x0,Math.max(2,Math.round((f[3]-f[2])*kn))]; }
  return [x0,FH.base-Math.round(f[3]*gf),x1-x0,Math.max(2,Math.round((f[3]-f[2])*gf))]; }

// ---------------------------------------------------------------- Himmel
function paintSky(b,tod,wea){ var w=RW(b,RG.sky), x, y;
  if (wea==='grey'){ M.scn.sky(w,0,0,W,62,tod,'grey',17); return; }
  if (tod==='night'){ var NR=R('k0 k1 k2 n0 n1'), dark=wea==='frost';
    for (y=0;y<62;y++) for (x=0;x<W;x++){ var v=(dark?0.04:0.1)+Math.pow(y/62,1.5)*(dark?0.5:0.6)+(fbm(x,y*2,40,2)-0.5)*0.05; w.px(x,y,ra(NR,v,x,y)); }
    // Milchstraße: ein blasser Schleier schräg über den Himmel (Neumond, klare Luft)
    for (y=0;y<56;y++) for (x=0;x<W;x++){ var m=Math.exp(-Math.pow((y-(4+x*0.09))/9,2))*fbm(x*0.6,y*1.2,9,4); if (m>0.25 && bayer(x,y)<(m-0.25)*(dark?0.9:0.6)) w.px(x,y,m>0.5?P.n1:P.n0); }
    var r=M.rng(dark?57:31); for (var s=0;s<(dark?520:380);s++){ var sx=Math.floor(r()*W), sy=Math.floor(Math.pow(r(),1.3)*56), q=r(); w.px(sx,sy,q<0.06?P.n5:(q<0.3?P.n4:(q<0.7?P.n3:P.n2))); if (q<0.02){ w.px(sx+1,sy,P.n2); w.px(sx-1,sy,P.n2); } }
    return; }
  var DR=R('b0 b1 b2 b3 b4 b5');
  for (y=0;y<62;y++) for (x=0;x<W;x++){ var v2=0.14+Math.pow(y/62,1.3)*0.82+(x-240)/W*0.05; w.px(x,y,ra(DR,v2,x,y)); }
  var r2=M.rng(23); for (var i=0;i<7;i++){ var cx=r2()*W, cy=4+r2()*22, L=40+r2()*90; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.06+Math.sin(k*0.08)*1.4); if (bayer(xx,yy)<0.4*(1-Math.abs(k/L-0.5)*2)) w.px(xx,yy,yy<16?P.b3:P.b4); } } }

// ---------------------------------------------------------------- Berge hinter dem anderen Ufer: Karst, Macchia, Kalkfelsen
function ridgeFar(x){ return 24+Math.sin(x*0.011+0.4)*6+Math.sin(x*0.037+1)*2.2+Math.sin(x*0.09)*0.8; }
function ridgeNear(x){ return 40+Math.sin(x*0.016+2.1)*7+Math.sin(x*0.05+0.3)*2.4+Math.sin(x*0.13)*1; }
function paintHills(b,tod){ var w=RW(b,RG.hill), x, y;
  for (x=0;x<W;x++){ var rf=rnd(ridgeFar(x)); for (y=rf;y<62;y++){ var v=0.62-(y-rf)/70+(fbm(x,y,14,5)-0.5)*0.12; if (y===rf) v+=0.12; w.px(x,y,ra(R('b2 b3 m3 b4'),v,x,y)); } }
  for (x=0;x<W;x++){ var rn=rnd(ridgeNear(x)); for (y=rn;y<72;y++){ var sh=fbm(x*0.4,y*0.8,22,7), v2=0.5+(sh-0.5)*0.5-(y-rn)*0.006+(y===rn?0.22:0)+(y===rn+1?0.1:0), c=ra(R('e1 e2 s2 e3 s3 s4'),v2,x,y);
      var scrub=puff(x,y,2.6,2,11); if (scrub>0.42 && fbm(x,y,8,13)>0.45) c=scrub>0.55?P.g2:P.g1;                                   // Macchia
      if (fbm(x*0.6,y*1.2,6,9)>0.72 && hash(x,y)<0.7) c=P.s4;                                                                           // Kalkfelsen
      w.px(x,y,c); } }
  // Trockenmauern und Terrassen am unteren Hang
  for (var k=0;k<5;k++){ var ty=50+k*3.2; for (x=0;x<W;x++){ if (fbm(x,k*9,30,17)<0.45) continue; var yy=rnd(ty+Math.sin(x*0.02+k)*2+ (ridgeNear(x)-40)*0.3); if (yy>REGY(x)) continue; w.px(x,yy,P.s4); if (hash(x,k)<0.5) w.px(x,yy+1,P.s2); } } }
function REGY(x){ return 64; }
// Dunst über der Ferne (bei Tag): die Berge verblassen nach hinten
function hazeHills(b,tod,wea){ if (tod==='night') return; var col=wea==='grey'?P.m4:P.b5;
  M.fogBake(b,function(x,y){ var r=REG[y*W+x]; if (r!==RG.hill) return 0; return y<ridgeNear(x)?(wea==='grey'?0.7:0.5):(wea==='grey'?0.45:0.22); },{col:col}); }

// ---------------------------------------------------------------- das andere Ufer: Felder, Weiler, Zlatas Haus, Schuppen, Quitte
function bankTop(x){ return 62+Math.sin(x*0.02+1)*1.5; }
function paintFarBank(b,tod,S){ var w=RW(b,RG.bank), x, y;
  // Grund: Felder in Streifen, Wiesen, ein Feldweg am Ufer
  for (x=0;x<W;x++){ var t0=rnd(bankTop(x)), wl=farWL(x); for (y=t0;y<wl;y++){ var fi=Math.floor((x+y*2.2)/23), pr=hash(fi,3), c;
      if (y>=wl-3) c=(hash(x,y)<0.5)?P.e2:P.g2;                                                                     // Uferböschung
      else if (y===rnd(wl-4)||y===rnd(wl-5)) c=(x%7<5)?P.e3:P.e4;                                                   // Feldweg
      else if (pr<0.4) c=((x+y*3)%4===0)?P.e1:ra(R('e1 e2 e3'),0.5+(hash(x>>1,y)-0.5)*0.5,x,y);                    // gepflügt
      else if (pr<0.75) c=ra(R('g2 g3 e3 g4'),0.45+(fbm(x,y,5,4)-0.5)*0.6,x,y);                                   // Wiese
      else c=ra(R('e2 e3 e4'),0.5+(hash(x,y>>1)-0.5)*0.5,x,y);                                                      // Stoppeln
      w.px(x,y,c); } }
  // Hecken und Bäume hinter dem Weiler
  for (x=0;x<W;x+=1){ var hy=rnd(bankTop(x)); if (fbm(x,5,18,21)>0.48){ var hh=2+rnd(fbm(x,9,6,22)*4); for (y=hy-hh;y<hy+1;y++) w.px(x,y,ra(R('g1 g2 e2 g3'),0.3+(hy-y)/hh*0.4+(hash(x,y)-0.5)*0.4,x,y)); } }
  // Pappeln (kahl, schlank) und Weiden am Wasser
  [[14,26],[96,30],[110,24],[292,28],[304,22],[384,26],[452,24],[470,20]].forEach(function(p,i){ poplar(w,p[0],rnd(bankTop(p[0]))+3,p[1],i); });
  [[8,9],[60,8],[286,10],[336,9],[364,8],[420,9]].forEach(function(p,i){ willow(w,p[0],rnd(farWL(p[0])),p[1],i); });
  // Häuser des Weilers
  [[20,30,'w'],[74,26,'s'],[318,28,'w'],[352,24,'s']].forEach(function(h,i){ if (h[2]==='n') return; hamletHouse(w,h[0],rnd(bankTop(h[0]))+9,h[1],h[2],i); });
  quince(w,QX,72); farHouse(b,w); shed(w); jetty(w);
  // Zaun um Zlatas Hof
  for (x=120;x<227;x+=3){ var fy=74; w.vl(x,fy-3,fy,P.w1); } for (x=120;x<227;x++){ w.px(x,72,P.w2); }
  // Schilf an der Wasserlinie
  for (x=0;x<W;x++){ if (x>JETTY.x0-2&&x<JETTY.x1+2) continue; if (fbm(x,3,9,31)<0.5) continue; var wl2=rnd(farWL(x)); var hr=1+rnd(hash(x,4)*3); for (y=wl2-hr;y<wl2;y++) w.px(x,y,hash(x,y)<0.5?P.e3:P.e2); } }
function poplar(w,x,by,h,sd){ var r=M.rng(sd*7+3);
  for (var y=by-h;y<by;y++){ var t=(y-(by-h))/h, hw=Math.max(0.5,Math.sin(t*Math.PI)*2.6*(t<0.2?t*5:1)); for (var xx=Math.floor(x-hw);xx<=Math.ceil(x+hw);xx++){ if (hash(xx*3,y*5+sd)<0.35+Math.abs(xx-x)/hw*0.3) continue; w.px(xx,y,hash(xx,y)<0.5?P.e2:P.w2); } }
  w.vl(x,by-h*0.6,by,P.w1); }
function willow(w,x,by,h,sd){ for (var y=by-h;y<by;y++) for (var xx=x-h;xx<=x+h;xx++){ var dx=(xx-x)/h, dy=(y-by+h*0.45)/(h*0.6); if (dx*dx+dy*dy>1) continue; if (hash(xx,y+sd)<0.25) continue; w.px(xx,y,ra(R('g1 e2 g2 e3'),0.3+puff(xx,y,2.2,1.8,sd)*0.4,xx,y)); } w.vl(x,by-2,by,P.w1); }
function hamletHouse(w,x0,base,wd,kind,i){ var hgt=Math.round(wd*0.42), x, y, wallR=kind==='w'?R('s3 s4 s5 s6'):R('s2 s3 s4 s5');
  for (y=base-hgt;y<base;y++) for (x=x0;x<x0+wd;x++){ var c=kind==='w'?ra(wallR,0.62+(hash(x>>1,y)-0.5)*0.2,x,y):blocks(x,y,3,2,i*5,STONE,P.s1); if (x===x0+wd-1) c=M.DN[c]; w.px(x,y,c); }
  var rh=Math.round(wd*0.22); for (var k=0;k<rh;k++){ var ins=Math.round(k*1.3); for (x=x0-1+ins;x<x0+wd+1-ins;x++) w.px(x,base-hgt-1-k,kind==='w'?((x+k)%3?P.t2:P.t1):((x+k*2)%3?P.s2:P.m2)); }
  for (var wi=0;wi<Math.floor(wd/8);wi++){ var wx=x0+3+wi*7; w.rect(wx,base-hgt+3,2,3,P.k1); W_LIT.push([wx,base-hgt+3,2,3,i*10+wi]); }
  w.rect(x0+wd-6,base-6,3,6,P.w1); }
var W_LIT=[];
// Zlatas Haus: weiß verputzt, Steinplattendach, die drei Fenster aus FAC
function farHouse(b,w){ var x0=FH.x0, wd=FH.w, base=FH.base, gf=Math.round(wd*FAC.gf), kn=Math.round(wd*FAC.knee), rf=Math.round(wd*FAC.roof), x, y;
  var wallTop=base-gf-kn;
  for (y=wallTop;y<base;y++) for (x=x0;x<x0+wd;x++){ var v=0.7+(hash(x>>1,y>>1)-0.5)*0.12, c=ra(R('s3 s4 s5 s6'),v,x,y); if (y>base-2) c=P.s3; if (x===x0+wd-1) c=P.s3; if (x===x0) c=P.s5; w.px(x,y,c); }
  w.hl(x0,x0+wd-1,base-gf,P.s4);                                                                                          // Geschosskante
  // Dach aus Steinplatten mit Überstand
  for (var k=0;k<rf;k++){ var yy=wallTop-1-k, ins=Math.round(k*1.6); for (x=x0-2+ins;x<x0+wd+2-ins;x++){ var row=(rf-k)%2, c2=((x+row*2)%5===0)?P.s1:(hash(x>>1,yy)<0.4?P.s2:P.m3); if (k===0) c2=P.s1; if (x===x0-2+ins||x===x0+wd+1-ins) c2=P.k2; w.px(x,yy,c2); } }
  var chx=x0+Math.round(FAC.chim*wd); w.rect(chx,wallTop-rf+1,3,5,P.s3); w.hl(chx-1,chx+3,wallTop-rf,P.s1); w.vl(chx+2,wallTop-rf+1,wallTop-rf+5,P.s2);
  // Fenster: dunkle Öffnungen mit hellem Rahmen, die Tür aus Holz
  ['kitchen','stube','roofw'].forEach(function(id){ var r=facRect(id), gw=RW(b,RG.glass); w.rect(r[0]-1,r[1]-1,r[2]+2,r[3]+2,P.s6); gw.rect(r[0],r[1],r[2],r[3],P.k1); if (id==='kitchen') gw.vl(r[0]+(r[2]>>1),r[1],r[1]+r[3]-1,P.s4); if (id==='stube') gw.hl(r[0],r[0]+r[2]-1,r[1]+(r[3]>>1),P.s4); w.hl(r[0]-1,r[0]+r[2],r[1]+r[3],P.s3); });
  var d=facRect('door'); w.rect(d[0],d[1],d[2],d[3],P.w1); w.vl(d[0],d[1],d[1]+d[3]-1,P.w2); w.px(d[0]+d[2]-2,d[1]+(d[3]>>1),P.y2); w.hl(d[0]-1,d[0]+d[2],d[1]-1,P.s6);
  // Holzstapel an der Wand, eine Bank
  for (x=x0+wd+1;x<x0+wd+6;x++) for (y=base-5;y<base;y++) w.px(x,y,((x+y)%2)?P.w2:P.w3); }
function shed(w){ var x0=SHED.x0, x1=SHED.x1, top=SHED.top, base=SHED.base, x, y;
  // offen zum Fluss: dunkles Inneres zwischen Pfosten, ein Pultdach aus Brettern
  for (y=top+2;y<base;y++) for (x=x0;x<x1;x++){ var c=(y<top+5)?P.k2:P.k1; if (x>x1-6) c=((x+y)%3)?P.w1:P.w0; w.px(x,y,c); }
  [x0,x0+9,x0+18,x1-1].forEach(function(px){ w.vl(px,top+1,base,P.w2); w.px(px,base,P.w1); });
  for (x=x0-2;x<x1+2;x++){ var ry=top+1-rnd((x-x0)*0.08); w.px(x,ry,P.w3); w.px(x,ry+1,P.w1); if (hash(x,1)<0.3) w.px(x,ry,P.t2); }
  // Ruder, Netz, Wathose (klein)
  w.line(x0+4,base-1,x0+6,top+4,P.w4); w.line(x0+12,base-1,x0+13,top+4,P.w3);
  for (y=top+4;y<top+10;y++) for (x=x0+15;x<x0+18;x++) if ((x+y)%2) w.px(x,y,P.e3);
  w.rect(x1-9,top+4,3,6,P.g1); w.px(x1-8,top+3,P.k2); }
function jetty(w){ for (var y=0;y<5;y++){ var yy=rnd(farWL(236))-1+y, ins=y; for (var x=JETTY.x0+2-ins;x<JETTY.x1-2+ins;x++) w.px(x,yy,((x+y)%4===0)?P.w1:(y%2?P.w2:P.w3)); }
  [JETTY.x0+1,JETTY.x1-2].forEach(function(px){ w.vl(px-2,rnd(farWL(236))+3,rnd(farWL(236))+6,P.w1); }); }
function quince(w,x,base){ var r=M.rng(29);
  for (var y=base-11;y<base;y++){ w.px(x,y,P.w1); if (y>base-5) w.px(x+1,y,P.w0); }
  function br(x0,y0,a,len,d){ var px=x0, py=y0; for (var s=0;s<len;s++){ px+=Math.cos(a); py+=Math.sin(a); a+=(r()-0.5)*0.4; w.px(rnd(px),rnd(py),d<1?P.w1:P.w2); } if (d<2) for (var k=0;k<2;k++) br(px,py,a+(r()-0.5)*1.6,len*0.6,d+1); }
  br(x,base-11,-Math.PI/2-0.7,6,0); br(x,base-11,-Math.PI/2+0.6,6,0); br(x,base-8,-Math.PI/2-1.3,5,1); br(x,base-7,-0.4,4,1);
  w.px(x+5,base-15,P.y4); w.px(x+6,base-15,P.y3); w.px(x+5,base-14,P.y3);                                                   // die letzte Quitte
  // das Grab darunter: ein Beet mit Chrysanthemen, ein Stein (nur angedeutet)
  for (var k2=-3;k2<=3;k2++){ w.px(x+k2+1,base,[P.y3,P.s6,P.t3,P.y4,P.s6,P.t4,P.y3][k2+3]); w.px(x+k2+1,base+1,P.e1); } w.px(x+5,base,P.s4); w.px(x+5,base-1,P.s5); }

// ---------------------------------------------------------------- der Fluss: Wasser, Spiegelung, Stümpfe, neue Brücke
var WBA=new Float32Array(W*H), WK=new Float32Array(W*H), FOAM=new Uint8Array(W*H), REFL=new Uint8Array(W*H);
function waterRamp(tod,wea){ if (wea==='grey') return R('a1 a2 m1 a3 m2 a4 m3');
  return R('a1 a2 g2 a3 g3 a4 a5'); }
var WR=null, NIGHT=false, TODN='day', WEA='calm', FIN=false;
function wcol(x,y,t){ var k=y*W+x, kk=WK[k], v=WBA[k];
  var f=Math.sin((x+t*11*kk)/(11*kk)+y*1.25+Math.sin(x*0.013+y*0.3)*2)*0.55+Math.sin((x+t*17*kk)/(4.5*kk)-y*1.9)*0.3+Math.sin((x+t*6*kk)/(23*kk)+y*0.55)*0.15;
  var c=ra(WR,v+f*0.09,x,y), fo=FOAM[k];
  if (fo){ var fl=Math.sin(t*5+x*0.9+y*1.7)+Math.sin(t*3.1-x*0.5); if (fl>1.5-fo*0.4) c=fo>2?P.s6:P.s5; else if (fl>0.7-fo*0.3) c=P.a5; }
  else if (f>0.8 && ((x+(y>>1))%3===0)) c=WEA==='grey'?P.m3:(v>0.55?P.a6:P.a5);
  if (REFL[k]!==255 && f<0.5) c=REFL[k];
  return c; }
function paintRiver(b,tod){ var w=RW(b,RG.water), x, y; REFL.fill(255); FOAM.fill(0);
  for (x=0;x<W;x++){ var y0=Math.ceil(farWL(x)); for (y=y0;y<H;y++){ if (y>edgeY(x)+1 && !inRamp(x,y)) break; if (inCliff(x,y)) continue; var d=cl((y-77)/(110-77),0,1), kk=0.32+0.68*d, k=y*W+x;
      WK[k]=kk; WBA[k]=0.66-d*0.36+(fbm(x*0.25/kk,y*0.9,9,3)-0.5)*0.22+(y<y0+2?0.06:0)-(y>edgeY(x)-4?0.12:0);
      w.px(x,y,P.a3); } }
  // Spiegelung des anderen Ufers: dunkle, gestauchte Formen unter der Wasserlinie
  for (x=0;x<W;x++){ var wl=farWL(x), y1=Math.ceil(wl); for (y=y1;y<y1+7;y++){ var sy=Math.floor(wl-(y-wl)*1.8)-1, src=b.get(x,sy); if (src===T) continue; var r0=REG[sy*W+x]; if (r0!==RG.bank&&r0!==RG.house&&r0!==RG.glass&&r0!==RG.hill) continue;
      var c=M.DN[M.DN[src]]; if (M.lum(src)>150) c=M.DN[src]; REFL[y*W+x]=c; } }
  // Stümpfe der alten Brücke: Steinpfeiler mit abgebrochenen Zähnen, nasser Fuß, Stau und Wirbel
  STUMPS.forEach(function(s,i){ stump(b,s,i); }); }
function stump(b,s,i){ var w=RW(b,RG.stump), hw=s.w/2, x, y;
  // Oberkante: zwei, drei Zähne, dazwischen tiefe Bruchstellen
  function topAt(x){ var u=(x-(s.x-hw))/s.w, teeth=[[0.12,0.0],[0.42,0.35],[0.7,0.08],[0.95,0.5]], h=1;
    for (var q=0;q<teeth.length;q++){ var d=Math.abs(u-teeth[q][0]); h=Math.min(h,teeth[q][1]+d*2.6); } return s.top+h*(s.wl-s.top)*0.55+(hash(x,i)<0.3?1:0); }
  for (x=Math.floor(s.x-hw);x<=Math.ceil(s.x+hw);x++){ var u=(x-(s.x-hw))/s.w, ty=Math.floor(topAt(x));
    for (y=ty;y<=s.wl;y++){ var c=blocks(x*1.2,(y-s.top)*1.2,3+s.w*0.35,2+s.w*0.12,i*7+3,STSTONE,P.k2);
      if (u>0.62) c=M.DN[c]; if (u>0.85) c=M.DN[c]; if (u<0.18) c=M.UP[c];                                                            // vorn im Licht, Seite im Schatten
      if (y>s.wl-1-s.w*0.18) c=(hash(x,y)<0.55)?P.g1:P.s1;                                                                             // nasser, bemooster Fuß
      if (y===ty) c=(u>0.7)?P.s3:P.s4; if (y===ty+1 && u<0.7) c=P.s3; w.px(x,y,c); } }
  // Bewehrungseisen ragt aus dem nahen Stumpf
  if (i===0){ w.line(s.x+3,s.top+5,s.x+6,s.top-2,P.t1); w.line(s.x-4,s.top+4,s.x-6,s.top-1,P.t1); w.px(s.x+6,s.top-2,P.t2); w.px(s.x-1,s.top+2,P.t1); w.px(s.x-1,s.top+1,P.t2); }
  // Schaum: Stau flussauf (rechts), Kielwasser flussab (links)
  for (y=Math.floor(s.wl-1);y<s.wl+3+s.w*0.3;y++) for (x=Math.floor(s.x-hw-s.w*1.8);x<=Math.ceil(s.x+hw+s.w*0.5);x++){ if (x<0||x>=W||y<0||y>=H) continue; var k=y*W+x; if (REG[k]!==RG.water) continue;
    var dxr=x-(s.x+hw), dxl=(s.x-hw)-x, dyw=Math.abs(y-s.wl-0.5), f=0;
    if (dxr>=-1 && dxr<s.w*0.45 && dyw<1.6) f=3; else if (dxl>=0 && dxl<s.w*1.8 && Math.abs(dyw-dxl*0.22)<1.1) f=dxl<s.w*0.6?2:1; else if (Math.abs(x-s.x)<hw && y>=s.wl && y<s.wl+2) f=2;
    if (f) FOAM[k]=f; } }
// die Felswand des eigenen Ufers jenseits der Bucht: Kalk, senkrecht gebankt, Gestrüpp in den Fugen, oben Gras und der Weg
function paintCliff(b){ var w=RW(b,RG.conc), x, y;
  for (x=302;x<W;x++){ var ct=cliffTop(x), cf=cliffFoot(x); for (y=Math.floor(ct);y<cf;y++){ var u=(y-ct)/Math.max(1,cf-ct), c;
      if (y<ct+2){ c=hash(x,y)<0.5?P.e3:P.g3; if (y<ct+1 && hash(x,3)<0.5) c=P.e4; }
      else { var bed=(y-ct)+Math.sin(x*0.07)*1.5, band=Math.floor(bed/2.6), f=fbm(x*0.9,y*0.5,6,8), crack=((x*3+band*7)%13===0)||(hash(Math.floor(x/4),band)<0.12);
        c=ra(R('s1 s2 s3 s4 s5'),0.66-u*0.4+(f-0.5)*0.3+((band%2)?0.07:-0.05),x,y); if ((bed%2.6)<0.7) c=M.DN[c]; if (crack) c=P.s1;
        if (f>0.68 && hash(x*2,y)<0.6) c=hash(x,y)<0.5?P.g1:P.g2; if (u>0.8) c=(hash(x,y)<0.5)?P.g1:P.s1; if (u<0.18 && hash(x,y)<0.5) c=P.s5; }
      w.px(x,y,c); } }
  // Gestrüpp auf der Kante und in der Wand, ein wilder Feigenbusch
  var vg=RW(b,RG.veg); for (var i=0;i<60;i++){ var vx=310+Math.floor(hash(i,1)*160), vy=Math.floor(cliffTop(vx))-1+Math.floor(hash(i,2)*3); if (hash(i,3)<0.3) vy+=4+Math.floor(hash(i,4)*6);
    for (var k=0;k<5;k++) vg.px(vx+Math.floor(hash(i,k)*4)-2,vy-Math.floor(hash(k,i)*3),hash(i,k+5)<0.5?P.g2:(hash(i,k+6)<0.5?P.e2:P.g1)); } }
// neue Brücke (1998): Betonbalken auf zwei schlanken Pfeilern, Rohrgeländer, eine Laterne
function brPt(u){ return [lerp(BR.x0,BR.x1,u), lerp(BR.y0,BR.y1,u), 1-u*0.62]; }
var LAMPU=0.3;
function paintBridge(b){ var w=RW(b,RG.bridge), x, y, n=200;
  for (var i=0;i<=n;i++){ var u=i/n, p=brPt(u), s=p[2], px=rnd(p[0]), yt=p[1], th=Math.max(1.5,4.5*s), rh=Math.max(1,5.5*s);
    for (y=Math.floor(yt);y<yt+th;y++) w.px(px,y,y<yt+1?P.s5:(y<yt+th-1?P.s3:P.s2));                                       // Fahrbahnkante
    w.px(px,Math.floor(yt-rh),P.m3); if (s>0.6) w.px(px,Math.floor(yt-rh)+1,P.m1);                                            // Handlauf
    if (i%Math.max(3,Math.round(9*s))===0) w.vl(px,Math.floor(yt-rh),Math.floor(yt),P.m2); }
  [0.38,0.72].forEach(function(u){ var p=brPt(u), s=p[2], px=rnd(p[0]), yb=p[1]+4*s, wl=Math.min(farWL(px)+5,p[1]+8*s); for (y=Math.floor(yb);y<wl;y++) for (x=px-rnd(1.6*s);x<=px+rnd(1.6*s);x++) w.px(x,y,x<px?P.s4:P.s2); });
  var lp=brPt(LAMPU), ls=lp[2], lx=rnd(lp[0]), ly=rnd(lp[1]), lh=rnd(20*ls); w.vl(lx,ly-lh,ly,P.m1); w.hl(lx,lx+rnd(3*ls),ly-lh,P.m1); w.rect(lx+rnd(3*ls)-1,ly-lh,3,2,P.m2);
  LAMP=[lx+rnd(3*ls),ly-lh+2];
  // Widerlager auf dem Vorsprung
  for (y=rnd(BR.y0)-1;y<rnd(BR.y0)+7;y++) for (x=462;x<W;x++){ var c=(y<rnd(BR.y0)+1)?P.s4:((x+y)%5===0?P.s2:P.s3); w.px(x,y,c); } }
var LAMP=[0,0];

// ---------------------------------------------------------------- das Hochufer: Boden, Hütte, Widerlager, Glocke, Anker, Rampe
function groundC(x,y){ var d=y-edgeY(x), c, g=hash(x,y);
  if (x<116 && y>=110){ // Schotterstraße mit zwei Fahrspuren, in der Mitte ein Grasstreifen
    var r1=124+(x>60?(x-60)*0.05:0), r2=133+(x>60?(x-60)*0.07:0), n=fbm(x*0.8,y*1.6,6,2), rut=Math.abs(y-r1)<1.5||Math.abs(y-r2)<1.7, mid=Math.abs(y-(r1+r2)/2)<1.6;
    c=ra(R('s1 s2 e3 s3 s4'),0.45+(n-0.5)*0.5+(g-0.5)*0.25,x,y); if (rut) c=(g<0.6)?P.e2:P.s2; if (Math.abs(y-r1+1.6)<0.6||Math.abs(y-r2+1.8)<0.6) c=P.s4;
    if (mid && g<0.45) c=g<0.2?P.g3:P.e3; if (hash(x*3,y*7)<0.05) c=P.s5; if (x>96){ var bl=(x-96)/20; if (hash(x>>1,y)<bl) c=meadow(x,y); } return c; }
  c=meadow(x,y);
  var path=(Math.abs(y-(119+Math.sin(x*0.03)*2))<2.6 && x>112 && x<470)||(x>140&&x<210&&Math.abs((y-113)-(x-140)*0.04)<1.8);
  if (path){ var n2=fbm(x,y*2,5,5); c=ra(R('e1 e2 e3 s3'),0.5+(n2-0.5)*0.6+(g-0.5)*0.2,x,y); }
  if (d<2.5) c=(g<0.5)?P.e2:P.g2; return c; }
// Wiese im November: Strohgelb, ein paar grüne Flecken, Erde dazwischen
function meadow(x,y){ var n=fbm(x*0.5,y*1.1,12,4), m=fbm(x*1.3,y*2.6,4,8), g=hash(x,y), v=0.46+(m-0.5)*0.55+(g-0.5)*0.18-(y-112)/34*0.1;
  if (n>0.5) return ra(R('e2 e3 e4 w4'),v+0.05,x,y);
  if (n>0.4) return ra(R('e2 g3 e3 e4'),v,x,y);
  return ra(R('g2 e2 g3 e3'),v-0.02,x,y); }
function paintGround(b){ var w=RW(b,RG.ground), x, y;
  for (x=0;x<W;x++){ var e=edgeY(x); for (y=Math.ceil(e);y<H;y++){ if (inRamp(x,y)) continue; w.px(x,y,groundC(x,y)); }
    // Kante: Grasbüschel, die überhängen
    var ey=Math.ceil(e); if (inRamp(x,ey)) continue; if (hash(x,5)<0.65){ var hh=1+rnd(hash(x,6)*3); for (var k=1;k<=hh;k++) w.px(x+(k===hh&&hash(x,k)<0.4?1:0),ey-k,k===hh?P.e4:(hash(x,k)<0.5?P.e3:P.g3)); } }
  // Grasbüschel auf der Wiese: helle Halme über einem dunklen Fuß
  var r=M.rng(61); for (var i=0;i<330;i++){ var tx=Math.floor(r()*W), ty=112+Math.floor(r()*31); if (tx<104 && ty>116) continue; if (inRamp(tx,ty)) continue; var hh2=2+Math.floor(r()*3), lt=r()<0.6?P.e4:P.w4;
    w.px(tx,ty,P.e1); w.px(tx+1,ty,P.e2); for (var k2=1;k2<=hh2;k2++){ w.px(tx-((k2>1&&r()<0.5)?1:0),ty-k2,k2===hh2?lt:P.e3); if (r()<0.5) w.px(tx+1+((k2>1)?1:0),ty-k2,lt); } }
  // Steine an der Kante
  [[8,0],[44,0],[146,0],[290,0],[330,0],[402,0]].forEach(function(p,i){ var sx=p[0], sy=Math.ceil(edgeY(sx)); w.ellipse(sx+2,sy+1,3,1.8,function(xx,yy){ return yy<sy+1?P.s4:P.s2; }); }); }
function paintRamp(b){ var w=RW(b,RG.conc), x, y;
  for (y=RAMP.y1;y<=RAMP.y0;y++){ var t=(y-RAMP.y1)/(RAMP.y0-RAMP.y1), xa=lerp(RAMP.xl1,RAMP.xl0,t), xb=lerp(RAMP.xr1,RAMP.xr0,t);
    for (x=Math.ceil(xa);x<=Math.floor(xb);x++){ var u=(x-xa)/(xb-xa), slab=Math.floor(t*6+0.3), c=(Math.abs((t*6+0.3)-slab)<0.12)?P.s1:(hash(Math.floor(u*4),slab)<0.5?P.s3:P.s4);
      if (Math.abs(u-0.5)<0.04) c=P.s2; if (t<0.18) c=(hash(x,y)<0.5)?P.g1:P.s1; else if (t<0.3 && hash(x,y)<0.4) c=P.g2; if (hash(x*3,y)<0.03) c=P.s2; w.px(x,y,c); } }
  // Seitenwände des Einschnitts: links im Licht, rechts im Schatten
  for (y=RAMP.y1-3;y<=RAMP.y0;y++){ var t2=(y-RAMP.y1)/(RAMP.y0-RAMP.y1), xl=rnd(lerp(RAMP.xl1,RAMP.xl0,t2)), xr=rnd(lerp(RAMP.xr1,RAMP.xr0,t2));
    for (var k=1;k<=3;k++){ w.px(xl-k,y-1,k===3?P.s5:(k===2?P.s4:P.s3)); w.px(xr+k,y-1,k===3?P.s3:P.s1); } }
  // Poller an der Rampe, Eisenring
  var px=RAMP.xl0+4, py=111; w.rect(px-1,py-5,4,5,P.m1); w.hl(px-2,px+3,py-6,P.m2); w.hl(px-1,px+2,py-7,P.m3); w.px(px,py-5,P.m3); }
// Bruchstein: Steine aus einem verschobenen Raster, Fugen dunkel, jeder Stein mit eigener Farbe
function rubble(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bi=0, bj=0, bdx=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.2+hash(gx+i+sd,gy+j)*0.6)*sx, cy=(gy+j+0.2+hash(gx+i,gy+j+sd*1.3)*0.6)*sy, dx=(x-cx)/sx, dy=(y-cy)/sy, q=dx*dx+dy*dy;
    if (q<b1){ b2=b1; b1=q; bi=gx+i; bj=gy+j; bdx=dx; bdy=dy; } else if (q<b2) b2=q; }
  var edge=Math.sqrt(b2)-Math.sqrt(b1); if (edge<0.13) return hash(x,y)<0.5?P.s1:P.e1;
  var rr=STONE[Math.floor(hash(bi*3+sd,bj*5)*STONE.length)], t=hash(bi*7,bj*3+sd), k=t<0.35?1:(t<0.85?2:3), c=rr[k];
  if (bdy<-0.18&&bdx<0.2) c=rr[Math.min(3,k+1)]; else if (bdy>0.2||bdx>0.3) c=rr[k-1]; if (edge<0.22 && bdy>0) c=rr[Math.max(0,k-1)];
  if (hash(x*1.7,y*2.3)<0.04) c=M.DN[c]; return c; }
function paintHut(b){ var w=RW(b,RG.hut), x, y, top=HUT.top, by=HUT.by;
  // Mauerkrone: links fast ganz, rechts abgebrochen
  function crown(x){ return top+(x>84?(x-84)*0.42+Math.abs(Math.sin(x*0.8))*3:0)+(hash(x,2)<0.2?1:0); }
  for (x=HUT.x0;x<HUT.x1;x++){ var ct=Math.round(crown(x)); for (y=ct;y<by;y++){ var c=rubble(x,y,7,5,3); if (x<HUT.x0+3) c=M.UP[c]; if (x>HUT.x1-4) c=M.DN[c]; if (y>by-3) c=M.DN[c];
      if (fbm(x,y,8,6)>0.66 && hash(x,y)<0.7 && x<84) c=(c===P.s1||c===P.e1)?P.s3:P.s5;                                         // Reste vom Kalkputz
      w.px(x,y,c); } w.px(x,ct,hash(x,4)<0.5?P.s5:P.s4); }
  // Ecksteine links, groß und hell
  for (y=top;y<by;y+=5){ var ew=(Math.floor((y-top)/5)%2)?5:7; for (var j=0;j<4;j++) for (var i=0;i<ew;i++) w.px(HUT.x0+i,y+j,j===0?P.s5:(i===ew-1||j===3?P.s2:P.s4)); }
  // Dach links: Steinplatten in Reihen, überlappend, Moos; rechts nur Sparren
  for (y=HUT.ridge;y<top;y++){ var tt=(y-HUT.ridge)/(top-HUT.ridge), xa=HUT.x0-3+rnd((1-tt)*3), xb=63+rnd(tt*5), row=Math.floor((y-HUT.ridge)/3), fy=(y-HUT.ridge)%3;
    for (x=xa;x<xb;x++){ var off=row*4+Math.floor(hash(row,1)*5), sl=Math.floor((x+off)/7), c2=hash(sl,row)<0.5?P.s2:(hash(sl,row+9)<0.5?P.m2:P.s3);
      if (fy===2) c2=P.k2; else if (fy===0) c2=M.UP[c2]; if ((x+off)%7===0) c2=P.s1; if (fbm(x,y,5,8)>0.64) c2=(hash(x,y)<0.5)?P.g2:P.g3; if (x===xb-1) c2=P.s1; w.px(x,y,c2); } }
  for (x=HUT.x0-3;x<66;x++){ w.px(x,top-1,P.k2); w.px(x,top,P.k1); }
  var wd=RW(b,RG.wood);
  for (x=HUT.x0-1;x<93;x++){ wd.px(x,HUT.ridge,P.w2); wd.px(x,HUT.ridge+1,P.w0); } wd.line(93,HUT.ridge,99,HUT.ridge+6,P.w1); wd.line(93,HUT.ridge+1,99,HUT.ridge+7,P.w0);   // Firstpfette, abgeknickt
  [64,71,78,85].forEach(function(sx,i){ var ex=sx+4, ey=top+(i===3?-2:0); wd.line(sx,HUT.ridge+1,ex,ey,P.w1); wd.line(sx+1,HUT.ridge+1,ex+1,ey,P.w0); wd.px(ex,ey,P.w2); });
  wd.line(96,HUT.ridge+8,100,top+6,P.w1);
  for (var s2=0;s2<3;s2++){ var sx2=68+s2*7, sy=HUT.ridge+4+s2*3; wd.rect(sx2,sy,5,2,P.s2); wd.hl(sx2,sx2+4,sy,P.s3); wd.px(sx2+4,sy+2,P.s1); }                      // hängende Platten
  // Türloch mit Sturz, drinnen dunkel, oben fällt Licht durchs offene Dach
  for (y=DOOR.top;y<by;y++) for (x=DOOR.x0;x<DOOR.x1;x++){ var c3=(y<DOOR.top+3)?P.k0:P.k1; if (x>DOOR.x0+7 && y<DOOR.top+16 && bayer(x,y)<0.35) c3=P.s0; if (y>by-5 && hash(x,y)<0.45) c3=(hash(x+1,y)<0.5)?P.s1:P.e1; w.px(x,y,c3); }
  for (y=DOOR.top-4;y<DOOR.top;y++) for (x=DOOR.x0-3;x<DOOR.x1+3;x++) w.px(x,y,y===DOOR.top-4?P.s5:(y===DOOR.top-1?P.s2:(hash(x>>2,1)<0.5?P.s4:P.s3)));
  // Fensterloch mit Holzsturz
  for (y=HWIN.y0;y<HWIN.y1;y++) for (x=HWIN.x0;x<HWIN.x1;x++) w.px(x,y,y<HWIN.y0+2?P.k0:P.k1); wd.hl(HWIN.x0-1,HWIN.x1,HWIN.y0-1,P.w2); wd.hl(HWIN.x0-1,HWIN.x1,HWIN.y0-2,P.w1); w.hl(HWIN.x0-1,HWIN.x1,HWIN.y1,P.s4);
  // alte Tür lehnt an der Wand; Unkraut auf der Krone; ein wilder Feigenstrauch aus der Ecke
  wd.poly([[37,by],[46,by],[48,85],[40,84]],function(xx,yy){ return ((xx-37)%3===0)?P.w0:(hash(xx,yy>>1)<0.5?P.w2:P.w1); }); wd.line(38,101,47,99,P.w0); wd.line(39,92,47,90,P.w0);
  var vg=RW(b,RG.veg); for (x=HUT.x0;x<HUT.x1;x++){ if (hash(x,11)<0.5) continue; var ct2=Math.round(crown(x)); var hh=1+rnd(hash(x,12)*3); for (var k=1;k<=hh;k++) vg.px(x+(k>1&&hash(x,k)<0.5?1:0),ct2-k,hash(x,k+2)<0.5?P.e3:P.g3); }
  for (var f=0;f<70;f++){ var a=hash(f,1)*Math.PI*2, rr=Math.sqrt(hash(f,2))*8, fx=HUT.x1-3+rnd(Math.cos(a)*rr*1.2), fy=top+13+rnd(Math.sin(a)*rr); vg.px(fx,fy,hash(f,3)<0.4?P.g2:(hash(f,4)<0.5?P.g3:P.g1)); }
  wd.line(HUT.x1-3,top+24,HUT.x1-2,top+14,P.w1);
  // Wellblech lehnt rechts
  for (y=by-16;y<by;y++) for (x=HUT.x1-1;x<HUT.x1+5;x++){ var u=(x-HUT.x1+1+(by-y)*0.15); w.px(x+rnd((by-y)*0.15),y,((Math.floor(u))%2)?P.t1:P.m1); }
  // Schatten unter der Traufe
  for (x=HUT.x0;x<66;x++) for (y=top;y<top+3;y++){ var k3=y*W+x; if (REG[k3]===RG.hut) b.d[k3]=M.DN[b.d[k3]]; } }
function paintAbutment(b){ var w=RW(b,RG.conc), x, y;
  for (x=106;x<143;x++){ var e=Math.ceil(edgeY(x)); for (y=e;y<113;y++){ var c=(y<e+2)?P.s3:(hash(x>>1,y)<0.5?P.m2:P.m1); if (y>=110) c=P.s2; if (hash(x,y)<0.05) c=P.s4; w.px(x,y,c); }
    for (y=e;y<e+2;y++) w.px(x,y,hash(x,y)<0.6?P.s4:P.s2); }
  // gebrochene Kante: Betonbrocken, Bewehrung
  for (var i=0;i<8;i++){ var bx=108+i*4.5, by=rnd(edgeY(bx))-1; w.line(rnd(bx),by,rnd(bx+hash(i,1)*3-1),by-3-rnd(hash(i,2)*3),P.t1); if (hash(i,3)<0.5) w.px(rnd(bx)+1,by-4,P.t2); }
  // zwei Prellsteine
  [[110,112],[138,112]].forEach(function(p){ w.rect(p[0]-1,p[1]-5,4,5,P.s4); w.hl(p[0]-1,p[0]+2,p[1]-5,P.s5); w.vl(p[0]+2,p[1]-5,p[1]-1,P.s2); }); }
function paintPost(b){ var w=RW(b,RG.wood), x=POST.x, y;
  for (y=POST.top;y<POST.by;y++){ w.px(x-2,y,P.s2); w.px(x-1,y,hash(x,y>>1)<0.5?P.s3:P.w3); w.px(x,y,hash(x+1,y>>1)<0.5?P.w2:P.s2); w.px(x+1,y,P.w1); if (y%9===4){ w.px(x,y,P.w1); w.px(x-1,y,P.w2); } if (hash(y,7)<0.08) w.px(x-1,y,P.k2); }
  w.hl(x-2,x+2,POST.top-1,P.w1); w.hl(x-1,x+1,POST.top-2,P.s2);
  // Galgen: Arm nach rechts, Strebe
  for (var i=0;i<20;i++){ w.px(x+1+i,POST.top+2,P.w3); w.px(x+1+i,POST.top+3,P.w1); } w.px(x+21,POST.top+2,P.w1); w.line(x+1,POST.top+14,x+10,POST.top+4,P.w2); w.line(x+2,POST.top+14,x+10,POST.top+5,P.w0);
  // Klampe für das Glockenseil
  w.rect(x+1,97,3,3,P.m1); w.px(x+3,96,P.m2); w.px(x+3,100,P.m2);
  // Fuß: Steine, festgetreten
  w.ellipse(x+0.5,POST.by-0.5,4,1.5,P.s2); w.px(x-3,POST.by-1,P.s3); }
function paintAnchor(b){ var w=RW(b,RG.conc), x, y, a=ANCH;
  for (y=a.y0;y<a.by;y++) for (x=a.x0;x<a.x1;x++){ var c=(y===a.y0)?P.s4:((x===a.x0)?P.s3:(hash(x>>1,y)<0.5?P.s2:P.s3)); if (y>a.by-2) c=P.s1; if (hash(x*3,y*2)<0.08) c=P.t1; w.px(x,y,c); }
  w.line(a.x0,a.y0,a.x0+3,a.y0+3,P.s1); w.px(a.x0+9,a.y0+3,P.k2);
  // Eisenring, Rostfahnen
  w.ellipse(a.rx+0.5,a.ry,2.5,2,function(xx,yy){ var d=Math.hypot(xx+0.5-a.rx-0.5,(yy+0.5-a.ry)*1.2); return d>1.2?P.t1:T; }); w.px(a.rx-2,a.ry,P.t2); w.px(a.rx,a.ry-2,P.t2);
  for (y=a.ry+2;y<a.by;y++) if (hash(y,3)<0.6) w.px(a.rx,y,P.t1);
  // das alte Stahlseil: vom Ring über die Kante, an der Rampenwand hinab ins Wasser
  var pts=[[a.rx+1,a.ry+1],[205,108],[208,107],[214,103],[218,100],[220,98.5]], wv=RW(b,RG.conc);
  for (var i=0;i<pts.length-1;i++){ var p0=pts[i], p1=pts[i+1], n=Math.max(2,rnd(Math.hypot(p1[0]-p0[0],p1[1]-p0[1])*2)); for (var s=0;s<=n;s++){ var t=s/n; wv.px(rnd(lerp(p0[0],p1[0],t)),rnd(lerp(p0[1],p1[1],t)),(s%3===0)?P.t1:P.m1); } }
  wv.px(219,99,P.m2); wv.px(221,98,P.m1); }
// Büsche: Hagebutten, eine Weide am Ufer rechts
function paintVeg(b){ var w=RW(b,RG.veg), x, y;
  [[284,111,10,7,1],[318,112,7,5,2],[348,111,11,8,3],[392,112,8,6,4],[20,111,7,5,5],[144,111,5,4,6]].forEach(function(s){ var cx=s[0], by=s[1], rx=s[2], ry=s[3], sd=s[4];
    for (y=by-ry*2;y<=by;y++) for (x=cx-rx;x<=cx+rx;x++){ var dx=(x-cx)/rx, dy=(y-by+ry)/ry; if (dx*dx+dy*dy>1) continue; var p=puff(x,y,2.2,1.8,sd);
      if (hash(x*1.3,y+sd)<0.2) continue; var c=ra(R('w0 w1 e1 e2 w2'),0.3+p*0.5,x,y); if (hash(x,y*sd)<0.05) c=P.r3; if (hash(x+3,y*sd)<0.02) c=P.r4; w.px(x,y,c); } });
  // Weide: knorriger Stamm, kahle, hängende Ruten
  var tx=304, ty=112, r=M.rng(9); for (y=ty-22;y<ty;y++){ var xx=rnd(tx+Math.sin(y*0.15)*1.5); w.px(xx,y,P.w1); w.px(xx+1,y,P.w0); w.px(xx-1,y,P.w2); }
  for (var k=0;k<14;k++){ var a=-Math.PI/2+(r()-0.5)*2.2, L=10+r()*14, px=tx, py=ty-22; for (var s=0;s<L;s++){ px+=Math.cos(a)*0.9; py+=Math.sin(a)*0.9; a+=0.05; w.px(rnd(px),rnd(py),s<4?P.w1:P.w2); }
    for (var d=0;d<8+r()*10;d++) w.px(rnd(px)+(d%2),rnd(py)+d,d<6?P.e2:P.e3); }
  // Disteln und trockene Stauden vorn
  [[96,140],[176,138],[262,141],[372,137],[436,140]].forEach(function(p,i){ for (var j=0;j<5;j++){ var hx=p[0]+j*2-4, hh=5+rnd(hash(i,j)*5), lean=(j-2)*0.3; for (var q=0;q<hh;q++) w.px(rnd(hx+lean*q*0.4),p[1]-q,q<2?P.e1:(j%2?P.e2:P.e3));
      var tx=rnd(hx+lean*hh*0.4), ty=p[1]-hh; w.px(tx,ty,P.e1); w.px(tx-1,ty,P.e2); w.px(tx+1,ty,P.e2); w.px(tx,ty-1,j===2?P.v1:P.e2); w.px(tx-1,ty+2,P.e3); w.px(tx+1,ty+3,P.e3); } }); }

// ---------------------------------------------------------------- Licht und Wetter
function lightFn(tod,wea){ var day=tod==='day', grey=wea==='grey';
  return function(x,y){ var r=REG[y*W+x], v=0; if (r===RG.sky) return 0;
    if (r===RG.hut){ if (x<HUT.x0+3) v+=0.2; if (y<HUT.top+6) v-=0.3*(1-(y-HUT.top)/6); v+=day&&!grey?0.12:0; }
    if (r===RG.ground){ v+=(y-112)/32*0.18; if (x>HUT.x0-6 && x<HUT.x0+8 && y<118) v-=0.3; if (x>=HUT.x1 && x<HUT.x1+14 && y<117) v-=0.25; }
    if (r===RG.water){ v-=0.05; }
    if (r===RG.bank||r===RG.house||r===RG.glass) v+=day&&!grey?0.08:0;
    if (grey) v-=0.15;
    var cx=(x-240)/300, cy=(y-80)/110; v-=Math.max(0,cx*cx+cy*cy-0.3)*0.5;
    return v; }; }
function frostBake(b){ for (var y=1;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, r=REG[k]; if (r!==RG.ground&&r!==RG.wood&&r!==RG.veg&&r!==RG.conc&&r!==RG.hut&&r!==RG.roof) continue;
    var up=REG[k-W]; if (up!==r && hash(x,y)<0.55){ b.d[k]=hash(x+1,y)<0.5?P.s4:P.s5; continue; }
    if (r===RG.ground && hash(x*1.3,y*2.1)<0.03) b.d[k]=hash(x,y)<0.5?P.s4:P.s5;
    if (r===RG.bank && hash(x,y)<0.15) b.d[k]=P.s4; } }

// ---------------------------------------------------------------- Bild
var LAST=null;
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0); REG.fill(0); W_LIT.length=0;
  if (tod!=='night' && tod!=='day') tod=tod==='dusk'||tod==='dawn'?tod:'day';
  NIGHT=tod==='night'; TODN=tod; WEA=wea; FIN=(wea==='frost'); WR=waterRamp(tod,wea);
  paintSky(b,tod,wea); paintHills(b,tod); paintFarBank(b,tod,S); paintRiver(b,tod); paintCliff(b); paintBridge(b);
  paintGround(b); paintRamp(b); paintHut(b); paintAbutment(b); paintPost(b); paintAnchor(b); paintVeg(b);
  // Wasser einmal mit t=0 füllen (dynamic malt es jedes Bild neu)
  for (var k=0;k<W*H;k++) if (REG[k]===RG.water){ var xx=k%W, yy=(k/W)|0; b.d[k]=wcol(xx,yy,0); }
  hazeHills(b,tod,wea);
  if (FIN) frostBake(b);
  M.light(b,lightFn(tod,wea),0,0);
  if (wea==='grey') M.fogBake(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; if (r===RG.hill) return 0.35; if (y<80) return 0.22; if (r===RG.water) return 0.12; return 0.04; },{col:P.m4});
  if (FIN) M.light(b,function(x,y){ var r=REG[y*W+x]; return r===RG.sky?0:(r===RG.hill||r===RG.bank?-1.1:-0.8); },0,0);                                       // Finalnacht: sehr dunkel
  var lights=[]; if (tod!=='day'){ lights.push([LAMP[0],LAMP[1]+6,16,0.85,12]); lights.push([LAMP[0],LAMP[1]+20,10,0.4,8]); }
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; }, lights:lights, after:function(o,tod){ if (tod==='day') return;
    // Laternenkopf der Brücke, ferne Fenster des Weilers
    o.rect(LAMP[0]-1,LAMP[1]-2,3,2,P.y5); o.px(LAMP[0],LAMP[1]-1,P.l1);
    W_LIT.forEach(function(q){ if (hash(q[4],FIN?7:3)>(FIN?0.2:0.42)) return; for (var yy=q[1];yy<q[1]+q[3];yy++) for (var xx=q[0];xx<q[0]+q[2];xx++){ if (REG[yy*W+xx]!==RG.bank) continue; o.px(xx,yy,(xx===q[0]&&yy===q[1])?P.y4:P.y3); } }); } });
  return LAST; }

// ---------------------------------------------------------------- jedes Bild: Wasser, Glocke, Fenster, Laterne, Rauch, Vögel
function tintC(c,x,y){ return (TODN!=='day'&&M.TINT[TODN])?M.tintPx(M.TINT[TODN],c,x,y):c; }
function dynamic(fb,v,S,GS){ var t=v.t, cam=v.cam, fw=fb.w, x, y;
  // Wasser: nur Wasserpixel, Strömung nach links
  for (y=74;y<114;y++){ var row=y*fw; for (var sx=0;sx<fw;sx++){ x=sx+cam; var k=y*W+x; if (REG[k]!==RG.water) continue; var c=wcol(x,y,t);
      if (FIN) c=M.DN[c]; if (WEA==='grey') c=M.mix(c,P.s4,2); fb.d[row+sx]=tintC(c,x,y); } }
  // nachts spiegelt sich die Brückenlaterne zitternd im Fluss
  if (TODN==='night'){ var lx=LAMP[0]-cam; if (lx>-4&&lx<fw+4) for (y=LAMP[1]+14;y<LAMP[1]+34;y++){ if (y>=H) break; var wob=Math.round(Math.sin(y*0.9+t*2.4)*1.3), xx=lx+wob; if (xx<0||xx>=fw||REG[y*W+xx+cam]!==RG.water) continue; if (Math.sin(y*1.7+t*3.3)>0.1) fb.d[y*fw+xx]=y<LAMP[1]+22?P.y3:P.y1; } M.glow(fb,lx,LAMP[1]-1,6,t,0.5); }
  bell(fb,v,S,GS);
  farLights(fb,v,S,GS);
  // Rauch aus Zlatas Schornstein (bei Tag)
  if (TODN==='day'){ var chx=FH.x0+Math.round(FAC.chim*FH.w)+1, chy=FH.base-Math.round(FH.w*FAC.gf)-Math.round(FH.w*FAC.knee)-Math.round(FH.w*FAC.roof)-1;
    for (var p=0;p<8;p++){ var ph=((t*0.12+p/8)%1), px=rnd(chx+ph*10+Math.sin(t*0.7+p)*1.5*ph)-cam, py=rnd(chy-ph*16); if (px<0||px>=fw) continue; if (bayer(px,py)<0.9-ph*0.7) fb.px(px,py,ph<0.4?P.s5:P.s4); }
    // Krähen über dem anderen Ufer
    for (var i=0;i<3;i++){ var bx=Math.floor(((t*(6+i*2)+i*140)%560)-40)-cam, by=30+i*6+Math.round(Math.sin(t*1.1+i)*3), f=Math.floor(t*5+i)%2; if (bx<1||bx>=fw-1) continue; fb.px(bx,by,P.k1); fb.px(bx-1,by-f,P.k1); fb.px(bx+1,by-f,P.k1); } } }
// Glocke: Messing, grün angelaufen; bei S.zvono schwingt sie, das Seil zuckt
function bell(fb,v,S,GS){ var t=v.t, cam=v.cam, ang=S.zvono?Math.sin(t*5.2)*0.42:Math.sin(t*0.9)*0.015, cx=BELL.x-cam, cy=BELL.y, fw=fb.w;
  if (cx<-16||cx>fw+16) return;
  function put(x,y,c){ x=rnd(x); y=rnd(y); if (x<0||x>=fw||y<0||y>=H) return; fb.d[y*fw+x]=tintC(c,x+cam,y); }
  var ca=Math.cos(ang), sa=Math.sin(ang);
  function rot(dx,dy){ return [cx+dx*ca-dy*sa, cy+dx*sa+dy*ca]; }
  // Joch am Arm
  for (var i=-3;i<=3;i++){ var q=rot(i,0); put(q[0],q[1],P.w1); var q2=rot(i,1); put(q2[0],q2[1],i>1?P.w0:P.w2); } var qh=rot(0,-1); put(qh[0],qh[1],P.m1);
  // Körper: Profil einer Schiffsglocke (runde Krone, leicht ausgestellt, dicker Rand), Licht von rechts oben, Patina in Flecken und Läufen
  var HB=12, PROF=[1.6,2.5,2.9,3.0,3.1,3.2,3.4,3.6,4.0,4.6,5.2,5.0];
  for (var dy=0;dy<HB;dy++){ var hw=PROF[dy]; for (var dx=-Math.ceil(hw);dx<=Math.ceil(hw);dx++){ if (Math.abs(dx)>hw+0.25) continue; var u=(dx+hw)/(2*hw), c;
      c=u<0.16?P.y0:(u<0.38?P.y1:(u<0.58?P.y2:(u<0.76?P.y3:(u<0.88?P.y4:P.y2)))); if (dy===0) c=u>0.5?P.y3:P.y2;
      if (dy===HB-2) c=u<0.2?P.y1:(u<0.7?P.y3:P.y4); if (dy===HB-1) c=u<0.3?P.y0:(u<0.8?P.y2:P.y3);
      var pn=hash(dx*3+11,dy*7+3), run=(Math.abs(Math.sin(dx*1.3+2))<0.3) && dy<HB-3, pat=(dy<3 && pn<0.75)||(run && pn<0.8)||(dy<HB-3 && pn<0.18);
      if (pat) c=(u<0.4)?P.a2:(u<0.75?(pn<0.4?P.a4:P.g4):P.a5);
      var p=rot(dx,dy+2); put(p[0],p[1],c); } }
  var cl0=rot(0,HB+2), cl1=rot(0,HB+3); put(cl0[0],cl0[1],P.m1); put(cl1[0],cl1[1],P.k2);                                // Klöppel
  // Seil: vom Hebel am Joch zur Klampe am Pfosten, bei Schwung bewegt
  var h=rot(-3,0), x0=h[0], y0=h[1], x1=POST.x+2-cam, y1=97, sag=S.zvono?3+Math.sin(t*5.2)*2.5:4;
  for (var s=0;s<=30;s++){ var u2=s/30, px=lerp(x0,x1,u2)-Math.sin(u2*Math.PI)*sag*0.6, py=lerp(y0,y1,u2)+Math.sin(u2*Math.PI)*sag*0.4; put(px,py,(s%3===0)?P.e2:P.e3); }
  put(x1,y1+1,P.e2); put(x1+1,y1+2,P.e3); put(x1,y1+3,P.e2); }
// Fenster drüben (S.lit) und die Laterne im Schuppen (S.lantern)
function litOf(S,GS){ return S.lit||(GS&&GS.flags&&GS.flags['k3.lit'])||null; }
function farLights(fb,v,S,GS){ var t=v.t, cam=v.cam, fw=fb.w, lit=litOf(S,GS);
  if (lit && (lit==='kitchen'||lit==='stube'||lit==='roof')){ var r=facRect(lit==='roof'?'roofw':lit), x0=r[0]-cam, y0=r[1], day=TODN==='day', fl=0.85+Math.sin(t*2.1)*0.08;
    for (var y=y0-3;y<y0+r[3]+3;y++) for (var x=x0-3;x<x0+r[2]+3;x++){ if (x<0||x>=fw) continue; var inside=x>=x0&&x<x0+r[2]&&y>=y0&&y<y0+r[3], k=y*fw+x;
      if (inside){ var core=Math.abs(x-x0-(r[2]-1)/2)<=Math.max(0.6,r[2]*0.2)&&Math.abs(y-y0-(r[3]-1)/2)<=Math.max(0.6,r[3]*0.25); fb.d[k]=core?P.l1:(day?(bayer(x,y)<0.6?P.s6:P.b5):(bayer(x,y)<0.5?P.y5:P.y4)); }
      else { var dd=Math.max(Math.max(x0-x,x-x0-r[2]+1,0),Math.max(y0-y,y-y0-r[3]+1,0)); if (day){ if (dd<=1 && bayer(x,y)<0.45) fb.d[k]=P.s6; } else if (bayer(x,y)<(1-dd/3.5)*0.45*fl) fb.d[k]=M.UP[fb.d[k]]; } } }
  if (S.lantern){ var lx=SHED.x0+8-cam, ly=SHED.top+6, f2=0.75+Math.sin(t*7.3)*0.12+Math.sin(t*13.1)*0.08; if (lx>-12&&lx<fw+12){
      M.glow(fb,lx,ly,TODN==='day'?3:8,t,TODN==='day'?0.3:0.6*f2);
      if (lx>=0&&lx<fw){ fb.d[ly*fw+lx]=P.y5; fb.d[(ly+1)*fw+lx]=f2>0.8?P.l0:P.y4; if (lx+1<fw) fb.d[ly*fw+lx+1]=P.y3; fb.d[(ly-1)*fw+lx]=P.k2; }
      if (TODN==='night') for (var yy=rnd(farWL(lx+cam))+1;yy<rnd(farWL(lx+cam))+7;yy++){ var xx2=lx+Math.round(Math.sin(yy*1.3+t*2)*1); if (xx2>=0&&xx2<fw&&REG[yy*W+xx2+cam]===RG.water && Math.sin(yy*2.1+t*3)>0) fb.d[yy*fw+xx2]=P.y2; } } } }

// ---------------------------------------------------------------- Geisterfähre: Ponton mit Geländer an einem Seil, das es nicht mehr gibt
var FST={state:null,from:null,to:null,t0:0,cur:null};
function ferryState(S,GS){ var f=S.ferry; if (f===undefined||f===null){ var g=GS&&GS.flags?GS.flags['k3.fin.ferry']:null; f=g==='left'?'far':(g||null); } if (f==='left') f='far'; return f; }
function ferryPos(S,GS,t){ var st=ferryState(S,GS);
  if (st!==FST.state){ var tgt=FERRY[st]||null; if (FST.cur && tgt && FST.state){ FST.from=FST.cur.slice(); FST.to=tgt.slice(); FST.t0=t; } else { FST.from=tgt; FST.to=tgt; FST.t0=t-99; } FST.state=st; if (!tgt){ FST.to=null; FST.t0=t; } }
  if (!FST.to){ if (!FST.cur) return null; var a=1-(t-FST.t0)/2.5; if (a<=0){ FST.cur=null; return null; } return FST.cur.concat([a]); }
  var u=sm((t-FST.t0)/7), p=[lerp(FST.from[0],FST.to[0],u),lerp(FST.from[1],FST.to[1],u),lerp(FST.from[2],FST.to[2],u)]; FST.cur=p; return p.concat([1]); }
function ferryDraw(fb,v,S,GS,part){ var p=ferryPos(S,GS,v.t); if (!p) return; var cam=v.cam, fw=fb.w, s=p[2], al=p[3], cx=p[0]-cam, dy0=p[1], t=v.t, ghost=v.ghost;
  var bob=Math.sin(t*1.3)*0.6*s, len=48*s, dep=Math.max(2,6*s), rail=Math.max(2,8*s), x, y;
  var glow=0.55+Math.sin(t*0.8)*0.1, K=ghost?6:4;
  function put(x,y,c,k){ x=rnd(x); y=rnd(y+bob); if (x<0||x>=fw||y<0||y>=H) return; var i=y*fw+x; if (al<1 && bayer(x,y)>al) return; fb.d[i]=M.mix(fb.d[i],c,k===undefined?K:k); }
  var x0=cx-len/2, x1=cx+len/2;
  if (part==='back'){ // Deck (Oberseite, schmale Trapezfläche), hinteres Geländer, der Seilpfosten mit Laterne
    for (y=0;y<dep;y++){ var ins=(dep-y)*0.6*s; for (x=x0+ins;x<=x1-ins;x++) put(x,dy0-dep+y,((Math.floor((x-x0)/(3*s+0.5)))%2)?P.x2:P.x3); }
    for (x=x0+2*s;x<=x1-2*s;x+=0.5){ put(x,dy0-dep-rail,P.x4); } for (var q=0;q<=6;q++){ var px=lerp(x0+2*s,x1-2*s,q/6); for (y=dy0-dep-rail;y<dy0-dep;y++) put(px,y,P.x3); }
    var pp=x0+len*0.7; for (y=dy0-dep-rail*2.2;y<dy0-dep;y++) put(pp,y,P.x4); put(pp-1,dy0-dep-rail*2.2,P.x5); put(pp+1,dy0-dep-rail*2.2,P.x5);
    var ly=dy0-dep-rail*2.2+2; put(pp+2,ly,P.y4,glow>0.6?6:5); put(pp+2,ly+1,P.y3,5); }
  else { // Schwimmkörper vorn, vorderes Geländer
    for (y=0;y<Math.max(2,3*s);y++) for (x=x0;x<=x1;x++) put(x,dy0+y,y<1?P.x4:P.x2);
    for (x=x0;x<=x1;x+=0.5) put(x,dy0-rail,P.x5,K-1); for (var q2=0;q2<=7;q2++){ var px2=lerp(x0,x1,q2/7); for (y=dy0-rail;y<dy0;y++) put(px2,y,P.x4,K-1); }
    // Wellen am Schwimmkörper
    for (x=x0-2;x<=x1+2;x+=1){ if (Math.sin(x*0.7+t*3)>0.3) put(x,dy0+Math.max(2,3*s),P.x5,3); } } }
function layers(S,GS,tod){ return [
  { get base(){ var p=FST.cur||FERRY[ferryState(S,GS)]; return p?Math.round(p[1])-2:0; }, draw:function(fb,v,S2,GS2){ ferryDraw(fb,v,S2,GS2,'back'); } },
  { get base(){ var p=FST.cur||FERRY[ferryState(S,GS)]; return p?Math.round(p[1])+2:0; }, draw:function(fb,v,S2,GS2){ ferryDraw(fb,v,S2,GS2,'front'); } } ]; }

// ---------------------------------------------------------------- Vordergrund: Nebel im grauen Epilog, Seil der Fähre in der Finalnacht
function front(fb,v,S,GS){ var wea=M.scn.weather(GS), cam=v.cam;
  if (wea==='grey') M.fogDrift(fb,v.t,{y0:66,y1:112,amt:0.3,k:2,col:P.m4,cam:cam,speed:3});
  var f=ferryState(S,GS); if (f && f!=='gone' && !v.ghost) cableLine(fb,v,0.35,true); }
// Seil vom Anker hinüber zum Steg drüben (leicht durchhängend)
function cableLine(fb,v,amt,dim){ var t=v.t, cam=v.cam, a=[ANCH.rx,ANCH.ry], b=[JETTY.x0+8,rnd(farWL(236))-2], n=140;
  for (var s=0;s<=n;s++){ var u=s/n, x=lerp(a[0],b[0],u)-cam, y=lerp(a[1],b[1],u)+Math.sin(u*Math.PI)*3+Math.sin(t*1.2+u*7)*0.4; var px=rnd(x), py=rnd(y); if (px<0||px>=fb.w||py<0||py>=H) continue;
    var pulse=(Math.sin(t*1.5-u*12)+1)/2; if (dim){ if (bayer(px,py)>amt+pulse*0.3) continue; fb.d[py*fb.w+px]=M.mix(fb.d[py*fb.w+px],P.x4,4); continue; }
    if (pulse<0.15 && (s&1)) continue; fb.px(px,py,pulse>0.8?P.x6:(pulse>0.4?P.x5:P.x3)); } }
// ---------------------------------------------------------------- Malas Sicht: das Seil von 1994 aus Licht; Batos Leine von der Glocke zum Schuppen
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam;
  cableLine(fb,v,1,false);
  var g=GS&&GS.flags||{}; if (g['k3.bato.found']){ var a=[BELL.x,BELL.y+4], b=[SHED.x0+8,SHED.top+7], n=120;
    for (var s=0;s<=n;s++){ var u=s/n, x=rnd(lerp(a[0],b[0],u)-cam), y=rnd(lerp(a[1],b[1],u)-Math.sin(u*Math.PI)*10+Math.sin(t*0.9+u*5)*0.6); if (x<0||x>=fb.w||y<0||y>=H) continue;
      var pl=(Math.sin(t*1.1+u*9)+1)/2; if (pl<0.25 && (s%2)) continue; fb.px(x,y,pl>0.75?P.v5:(pl>0.4?P.v4:P.v3)); }
    var bx=a[0]-cam; if (bx>=0&&bx<fb.w){ fb.px(bx,a[1],P.v5); } }
  // an der Glocke ein schwacher Abdruck vieler Schläge
  var gx=BELL.x-cam, gy=BELL.y+5, al=0.5+0.5*Math.sin(t*1.4); if (gx>-8&&gx<fb.w+8) for (var y=gy-6;y<gy+7;y++) for (var x=gx-6;x<gx+7;x++){ var d=Math.hypot(x-gx,y-gy)/6; if (d>1||x<0||x>=fb.w) continue; if (bayer(x,y)<(1-d)*0.18*al) fb.px(x,y,P.x3); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S,GS){ if (x<8||x>472) return false;
  if (y>=114 && y<140) return !(x>=ANCH.x0-2 && x<=ANCH.x1+1 && y<117) && !(x>=POST.x-2&&x<=POST.x+2&&y<116);
  if (inRamp(x,y) && y>=RAMP.y1+2 && x>RAMP.xl0-0 && x<RAMP.xr0-2) return true;                                    // die Rampe hinab
  if (ferryState(S,GS)==='here' && y>=96 && y<=103 && x>=FERRY.here[0]-20 && x<=FERRY.here[0]+20) return true;      // auf die Fähre
  return false; }
M.defineArt('skela_d',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, front:front, ghost:ghost, walk:walk, walkG:function(){ return false; },
  spots:{ road:[0,92,18,52], hut:[HUT.x0-2,HUT.ridge-2,HUT.x1-HUT.x0+8,HUT.by-HUT.ridge+2], bell:[POST.x-3,POST.top-3,BELL.x-POST.x+11,32], anchor:[ANCH.x0-2,ANCH.y0-3,ANCH.x1-ANCH.x0+5,ANCH.by-ANCH.y0+3],
    stumps:[110,74,36,30], river:[262,78,120,28], far_house:[FH.x0-3,46,FH.w+6,30], far_shed:[SHED.x0-1,SHED.top-2,SHED.x1-SHED.x0+3,SHED.base-SHED.top+3], far_tree:[QX-12,56,22,20],
    to_bridge:[462,90,18,54], landing:[RAMP.xl0-2,RAMP.y1-4,RAMP.xr0-RAMP.xl0+4,RAMP.y0-RAMP.y1+5] },
  stands:{ road:[16,124,'L'], hut:[62,118,'B'], bell:[158,119,'R'], anchor:[192,119,'B'], stumps:[126,116,'B'], river:[300,118,'B'], far_house:[176,116,'B'], far_shed:[210,116,'B'],
    far_tree:[140,117,'B'], to_bridge:[466,122,'R'], landing:[234,110,'B'] },
  actorPos:{ komsija:[38,124,'R'], mala:[144,118,'R'], vlado:[46,121,'R'], kata:[68,127,'R'], bato:[FERRY.here[0],FERRY.here[1],'L'] },
  start:[30,124,'R'], entries:{ map:[22,124,'R'], skela_most:[460,122,'L'] },
  ferry:FERRY, ferryAt:function(S,GS){ return FST.cur?FST.cur.slice():null; }
});
})(M);
