/* ===== rooms/art/varos.js — Veli Varoš: eine Gasse am Marjan-Hang =====
   Links Zdenkas Haus (Nr. 12, Ockerputz) mit Schemel und Blechdosen voller Basilikum und Geranien, in der Mitte Ivkas
   Steinhaus (Nr. 14) mit grüner Tür, geschlossenen Läden, Briefkasten „PERIĆ“ und der Todesanzeige. Rechts führt eine
   Treppengasse hinauf zum Kirchlein Sv. Nikola mit Glockengiebel, darüber die Pinien des Marjan. Wäscheleine, Wandlaterne,
   eine Katze auf den Stufen. Weiter oben am Hang schauen kleinere Häuser zwischen den Pinien über die Dächer, an Ivkas Wand steht
   eine steinerne Bank, die Treppe ist von Töpfen gesäumt, Kabel, Antenne und Schüssel erzählen von 2011. Nach dem Regen glänzt
   das Pflaster, die Pfützen spiegeln den grauen Himmel. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;

// ---------------------------------------------------------------- kleine Helfer
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rnd(v){ return Math.round(v); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
// Büschel (Worley): Kronen, Hecken. Ergebnis ~0..1, oben links hell, Fugen dunkel
function puff(x,y,sx,sy,sd){ var gx=Math.floor(x/sx), gy=Math.floor(y/sy), b1=9, b2=9, bx=0, by=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.15+hash(gx+i+sd,gy+j)*0.7)*sx, cy=(gy+j+0.15+hash(gx+i,gy+j+sd*1.7)*0.7)*sy;
    var dx=(x-cx)/sx, dy=(y-cy)/sy, d=dx*dx+dy*dy; if (d<b1){ b2=b1; b1=d; bx=dx; by=dy; } else if (d<b2) b2=d; }
  var v=0.6-by*0.75-bx*0.25-b1*0.3; if (b2-b1<0.1) v-=0.32; return v; }
// unregelmäßige Steinquader mit eigener Rampe je Stein
function blocks(u,v,sw,sh,sd,ramps,jc){ var row=Math.floor(v/sh), fv=v-row*sh, bw=sw*(0.75+hash(row,sd+2)*0.6), uu=u+hash(row,sd)*sw, col=Math.floor(uu/bw), fu=uu-col*bw;
  if (fv<1||fu<1) return jc; var rr=ramps[Math.floor(hash(col+sd*3,row+11)*ramps.length)], t=hash(col*13+sd,row*7+sd), k=t<0.3?0:(t<0.8?1:2), c=rr[k];
  if (fv<2&&fu>1&&fu<bw-1) c=rr[k+1]; else if (fv>=sh-1||fu>=bw-1) c=rr[Math.max(0,k-1)];
  var p=hash(u*3+col,v*5+row); if (p<0.05) c=M.DN[c]; else if (p>0.975) c=M.UP[c]; return c; }

// Regionen: wer wo gemalt hat (für Licht, Spiegelungen, Himmelsmaske)
var REG=new Uint8Array(W*H), RG={sky:0,far:1,up:2,stair:3,wall:4,floor:5,prop:6,glass:7,side:8,wallE:9};
function RW(b,id){ var o={w:W,h:H,buf:null};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.get=function(x,y){ return b.get(x,y); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn','drect'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }

// ---------------------------------------------------------------- Geometrie
function baseY(x){ return 111-x*0.028; }            // Mauerfuß: die Gasse steigt nach rechts leicht an
var EA=20, EB=17, EE=7;                             // Traufkanten Haus A (Zdenka), Haus B (Ivka), Haus E (rechts)
var DA=[48,52,28], DB=[150,50,28];                  // Türen: x, oben, Breite
var WA=[52,27,20,17], WB=[152,21,24,22], WG=[15,63,16,17];
var NOTE=[130,64,14,18], MAIL=[185,71,23,15], LAMP=[218,37];
var STOOL=[79,110,16,122];                          // x, Sitzhöhe, Breite, Fußhöhe
var LINE=[84,30,146,27];                            // Wäscheleine
var LINE2=[0,33,37,31];                             // zweite Leine links, vom Nachbarhaus herüber
var BENCH=[188,99,34];                              // Steinbank an Ivkas Wand: x, Sitzfläche, Breite
var FAR=[[40,63,4,0],[77,99,2,1],[124,147,1,2],[163,186,0,3],[203,224,1,4]];   // Häuser weiter oben am Hang: x0, x1, Traufe, Muster
var LX=226;                                         // linke Kante der Treppengasse (Ecke von Haus B)
var STEPS=(function(){ var a=[], y=108; for (var i=0;i<10;i++){ var rise=4.8-0.13*i; a.push({y0:y-rise,y1:y,xl:LX,xr:lerp(306,295,i/10)}); y-=rise; } return a; })();
var TOPY=STEPS[9].y0, KX=261;                       // Absatz oben, Mitte des Kirchleins
var CAT=[284,Math.round(STEPS[3].y0)+1];            // Füße der Katze (auf der vierten Stufe)
function doorBot(d){ return Math.round(baseY(d[0]+d[2]/2)); }
function lineY(t){ return LINE[1]+(LINE[3]-LINE[1])*t+Math.sin(Math.PI*t)*5; }
function line2Y(t){ return LINE2[1]+(LINE2[3]-LINE2[1])*t+Math.sin(Math.PI*t)*3; }

// ---------------------------------------------------------------- Himmel und Marjan
function paintSky(b,tod,weather){
  if (tod==='day' && weather!=='rain'){ var rp=R('b0 b1 b2 b3 b4');
    for (var y=0;y<80;y++) for (var x=0;x<W;x++) b.px(x,y,ra(rp,0.1+y/80*0.95,x,y));
    var r=M.rng(5); for (var i=0;i<6;i++){ var cx=r()*W, cy=2+r()*30, L=24+r()*44; for (var k=0;k<L;k++){ var xx=rnd(cx+k), yy=rnd(cy+k*0.06+Math.sin(k*0.21)*0.7); if (bayer(xx,yy)<0.5*(1-Math.abs(k/L-0.5)*2)) b.px(xx,yy,yy<24?P.b3:P.b4); } }
  } else if (tod==='night' && weather==='rain'){ var NR=R('k1 k2 n0 n1');                       // Regennacht: tiefe Wolken, keine Sterne
    for (var y2=0;y2<80;y2++) for (var x2=0;x2<W;x2++) b.px(x2,y2,ra(NR,0.25+y2/80*0.45+(fbm(x2,y2*2,16,4)-0.5)*0.4,x2,y2));
  } else M.scn.sky(b,0,0,W,72,tod,weather,23);
  if (tod==='night' && weather!=='rain') M.moon(b,244,8,3);
}
function hillY(x){ return x<LX ? 13+Math.sin(x*0.045)*1.5+Math.sin(x*0.13) : 13+(x-LX)*0.5+Math.sin(x*0.09)*2; }
var PINES=[[16,6,15,6],[60,9,12,5],[101,4,18,7],[147,8,12,5],[192,5,16,7],[229,22,10,5],[296,8,16,7]];
function pineCrown(w,cx,cy,rx,ry,sd,G){
  for (var y=Math.floor(cy-ry-2);y<=cy+ry+2;y++) for (var x=Math.floor(cx-rx-2);x<=cx+rx+2;x++){ var dx=(x-cx)/rx, dy=(y-cy)/ry, e=dx*dx+dy*dy*(dy>0?2.4:1.15)+(fbm(x,y,4,sd)-0.5)*0.85;
    if (e>1) continue; var v=puff(x,y,4.5,3,sd)*0.85+0.22-Math.max(0,dy)*0.5-Math.max(0,e-0.75)*0.35-(dy<-0.5?-0.08:0); w.px(x,y,ra(G,v,x,y)); } }
function paintForest(b){ var w=RW(b,RG.far), G=R('g0 g1 g2 g3 g4'), G2=R('g0 g1 g2 g3 g4 g5');
  for (var x=0;x<W;x++){ var hy=rnd(hillY(x)); for (var y=hy;y<H;y++){ var v=puff(x,y,6,4,3)*0.75+0.02-(y-hy)*0.008; w.px(x,y,ra(G,v,x,y)); } }
  paintFar(w);
  [[296,12,70,1],[229,26,60,-1]].forEach(function(t){ for (var y=t[1];y<t[2];y++){ var x=rnd(t[0]+Math.sin(y*0.06)*1.5+(y-t[1])*t[3]*0.03); w.px(x,y,P.w1); w.px(x+1,y,P.t1); } });
  PINES.forEach(function(p,i){ pineCrown(w,p[0],p[1],p[2],p[3],31+i*7,G2); }); }

// ---------------------------------------------------------------- weiter oben am Hang: kleine Häuser, nur Traufe und Oberlicht über den Dächern
var FARC=[R('s2 s3 s4 s5'),R('e2 e3 e4 s5'),R('s3 s4 s5 s6'),R('w3 w4 w5 d6'),R('s2 s3 s4 s5')];
function paintFar(w){ FAR.forEach(function(h,k){ var x0=h[0], x1=h[1], ye=h[2], F=FARC[k];
    for (var y=ye+2;y<26;y++) for (var x=x0;x<x1;x++){ var v=0.6+(fbm(x,y,6,k+20)-0.5)*0.4+(hash(x,y)-0.5)*0.1-(x>x1-4?0.35:0); w.px(x,y,ra(F,v,x,y)); }
    for (var x2=x0-1;x2<=x1;x2++){ w.px(x2,ye,((x2+k)%3)?P.t3:P.t1); w.px(x2,ye+1,(x2%2)?P.t2:P.t3); if (ye>0) w.px(x2,ye-1,((x2+k)%4)?P.t2:P.t1); }
    for (var i=x0+3;i<x1-4;i+=8){ w.rect(i,ye+4,3,4,P.k2); w.px(i+1,ye+4,P.k1); if ((k+i)%3){ w.vl(i-1,ye+4,ye+7,P.g2); w.vl(i+3,ye+4,ye+7,P.g1); } w.hl(i-1,i+3,ye+8,P.s4); } });
  w.vl(87,0,1,P.m1); w.hl(85,89,0,P.m1); w.rect(170,0,2,1,P.s3); }                      // eine Antenne, ein Kamin

// ---------------------------------------------------------------- oben am Hang: Haus C, Kirchlein Sv. Nikola
var CHR=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5'),R('e1 e2 e3 e4'),R('s1 s2 s3 s4')];
function paintUpper(b){ var w=RW(b,RG.up);
  // Haus C: schmales verputztes Haus links neben der Kirche
  for (var y=40;y<66;y++) for (var x=LX;x<238;x++) w.px(x,y,ra(R('s2 s3 s4 s5'),0.5+(fbm(x,y,9,4)-0.5)*0.6+(hash(x,y)-0.5)*0.12-(y-40)*0.006,x,y));
  for (var x2=LX;x2<239;x2++){ w.px(x2,38,(x2%3)?P.t3:P.t1); w.px(x2,39,P.t2); w.px(x2,40,P.s1); }
  w.rect(229,46,6,9,P.k1); w.hl(228,235,45,P.s5); w.hl(228,235,55,P.s4); for (var j=46;j<55;j++){ w.px(236,j,(j%2)?P.g3:P.g2); w.px(237,j,P.g1); }
  // Kirchlein: Fassade mit Giebel, Glockengiebel (preslica) mit einer Glocke
  var K0=KX-24, K1=KX+24, KB=65, KE=35, KA=21;
  w.poly([[K0,KB],[K0,KE],[KX,KA],[K1,KE],[K1,KB]],function(x,y){ return blocks(x,y,8,5,7,CHR,P.s1); });
  for (var x5=K0-2;x5<=K1+2;x5++){ var yy=rnd(KE-(KE-KA)*(1-Math.abs(x5-KX)/(KX-K0))); w.px(x5,yy-2,(x5%5===0)?P.s2:P.s3); w.px(x5,yy-1,(x5%5===0)?P.s3:P.s5); w.px(x5,yy,P.s4); w.px(x5,yy+1,P.s2); }   // Steinplatten wie auf den alten Kirchen
  w.hl(K0-1,K1+1,KE+1,P.s2);
  var gx0=KX-8, gx1=KX+8, gy0=6, gy1=24;
  for (var y6=gy0;y6<gy1;y6++) for (var x6=gx0;x6<=gx1;x6++){ var inA=(x6>=KX-5&&x6<=KX+5&&y6>=10&&y6<=22)&&!(y6<14&&Math.pow((x6-KX)/5.6,2)+Math.pow((y6-14)/4.2,2)>1); if (inA) continue; w.px(x6,y6,blocks(x6,y6,6,4,13,CHR,P.s1)); }
  w.poly([[gx0-1,gy0],[gx1+1,gy0],[KX,gy0-4]],function(x){ return (x<KX)?P.s4:P.s3; }); w.hl(gx0-1,gx1+1,gy0,P.s5); w.hl(gx0-1,gx1+1,gy1-1,P.s2);
  w.vl(KX,gy0-10,gy0-4,P.s4); w.hl(KX-2,KX+2,gy0-8,P.s4); w.px(KX+1,gy0-9,P.s2);           // Steinkreuz
  w.hl(KX-5,KX+5,11,P.w1); w.hl(KX-4,KX+4,10,P.w2);                                          // Joch
  [[12,-1,1],[13,-2,2],[14,-3,3],[15,-3,3],[16,-3,3],[17,-4,4],[18,-4,4],[19,-5,5]].forEach(function(r){ for (var x=KX+r[1];x<=KX+r[2];x++){ var u=(x-KX-r[1])/Math.max(1,r[2]-r[1]), c=u<0.18?P.y1:(u<0.4?P.y3:(u<0.75?P.y2:P.y1)); if (r[0]===19) c=(u<0.5?P.y2:P.y1); if (hash(x,r[0])<0.12) c=P.a3; w.px(x,r[0],c); } });
  w.px(KX-2,14,P.y4); w.px(KX-2,15,P.y4); w.px(KX,20,P.y0); w.px(KX,21,P.k1);
  w.fn(KX-8,46,17,19,function(x,y){ var dx=(x-KX)/8.6, top=46+(1-Math.sqrt(Math.max(0,1-dx*dx)))*6; if (y<top) return undefined; return (y<top+1.5||x<KX-7||x>KX+7)?P.s5:undefined; });
  w.fn(KX-6,48,13,17,function(x,y){ var dx=(x-KX)/6.6, top=48+(1-Math.sqrt(Math.max(0,1-dx*dx)))*5; if (y<top) return undefined; var c=((x-KX)%3===0)?P.w0:P.w1; if (y===62&&(x-KX)%3===1) c=P.y1; return c; });
  w.ellipse(KX+0.5,38.5,3.2,3.2,P.s5); w.ellipse(KX+0.5,38.5,2,2,P.k1);
  w.hl(K0,K1,KB-1,P.s2); }

// ---------------------------------------------------------------- Treppengasse: Stufen, rechte Hauswand, Haus E
var SIDE=R('s2 s3 s4 s5'), EPL=R('s3 s4 s5 s6');
function paintLane(b){ var w=RW(b,RG.stair);
  for (var y=rnd(TOPY)-2;y<rnd(TOPY);y++) for (var x=LX;x<298;x++) w.px(x,y,ra(R('s3 s4 s5'),0.5+(hash(x,y)-0.5)*0.4,x,y));
  STEPS.forEach(function(s,i){ var y0=rnd(s.y0), y1=rnd(s.y1), xl=rnd(s.xl), xr=rnd(s.xr), tv=cl(rnd((s.y0-74)/10),0,2);
    for (var y=y0;y<y1;y++) for (var x=xl;x<xr;x++){ var u=(x-xl)/(xr-xl), mid=Math.max(0,1-Math.abs(u-0.45)*2.2), c;
      if (y<y0+tv) c=ra(R('s2 s3 s4 s5'),0.4+mid*0.4+(hash(x,y)-0.5)*0.2,x,y);
      else if (y===y0+tv) c=mid>0.2?P.s5:P.s4;                                         // abgerundete Kante
      else { var vv=(y-y0-tv)/Math.max(1,y1-y0-tv); c=ra(R('s0 s1 s2 s3'),0.85-vv*0.6+mid*0.12+(hash(x*3,y)-0.5)*0.18,x,y); }
      if ((u<0.05||u>0.95)&&y>=y0+tv&&hash(x*7,y)<0.4) c=hash(x,y*3)<0.5?P.g2:P.g3;     // Moos in den Ecken
      w.px(x,y,c); }
    if (i%3===1){ var lx=rnd(lerp(s.xl,s.xr,0.2+hash(i,5)*0.6)); w.px(lx,y0,P.y3); w.px(lx+1,y0,P.e3); }  // ein gelbes Feigenblatt
  });
  // Töpfe und Dosen am Rand der Treppe: Geranien, Basilikum, eine Aloe
  [[1,229,'g'],[3,231,'b'],[5,229,'a'],[7,230,'g'],[2,0,'b'],[6,0,'g']].forEach(function(q,k){ var st=STEPS[q[0]], px=q[1]||rnd(st.xr)-9, by=rnd(st.y0)+1; potOn(w,px,by,q[2],k); });
  // rechte Gassenwand (Seite von Haus E), im Licht
  var sw=RW(b,RG.side);
  sw.poly([[306,EE],[295,29],[295,rnd(TOPY)],[306,108]],function(x,y){ var t=(306-x)/11, v=0.55+(fbm(x*3,y,10,6)-0.5)*0.5+(hash(x,y)-0.5)*0.1-t*0.2;
    if (fbm(x*2.5,y*1.2,9,8)>0.7) return blocks(x*2,y,8,5,15,CHR,P.s1); return ra(SIDE,v,x,y); });
  for (var y2=EE;y2<108;y2++){ var xe=rnd(306-(y2<29?(y2-EE)*11/22:0)); }
  sw.line(306,EE-1,295,28,P.t2); sw.line(306,EE,295,29,P.t1); sw.line(305,EE-1,294,28,P.t3);
  for (var y3=40;y3<92;y3++){ var xx=rnd(304-(y3-40)*0.02); sw.px(xx,y3,P.m1); sw.px(xx+1,y3,P.m2); }   // Fallrohr
  sw.rect(298,54,5,4,P.t3); sw.hl(297,303,53,P.t4); for (var g=0;g<10;g++) sw.px(297+rnd(hash(g,7)*7),51-rnd(hash(g,8)*3),hash(g,9)<0.4?P.r3:P.g3);   // Blumentopf am Haken
  sw.vl(300,46,53,P.k1);
  // Wandnische mit einer kleinen Madonna und einem roten Grablicht, wie an vielen Ecken in Varoš
  for (var y6=33;y6<42;y6++) for (var x7=297;x7<303;x7++){ var top=(x7===297||x7===302)?35:33; if (y6<top) continue; sw.px(x7,y6,(x7===297||y6===top)?P.k1:P.k2); }
  sw.hl(297,302,32,P.s5); sw.px(296,33,P.s5); sw.px(303,33,P.s3); sw.hl(296,303,42,P.s6); sw.hl(296,303,43,P.s2);
  sw.px(299,35,P.s5); sw.px(300,35,P.s4); sw.rect(299,36,2,4,P.b2); sw.px(299,36,P.b4); sw.px(299,40,P.b1); sw.px(300,40,P.b1);
  sw.px(301,40,P.r2); sw.px(301,39,P.r3); sw.px(301,38,P.y2);
  // Haus E: Front am rechten Bildrand
  var e=RW(b,RG.wallE);
  for (var y4=EE;y4<108;y4++) for (var x4=306;x4<W;x4++) e.px(x4,y4,ra(EPL,0.5+(fbm(x4,y4,14,12)-0.5)*0.5+(hash(x4,y4)-0.5)*0.12-(y4>96?(y4-96)/12*0.3:0),x4,y4));
  for (var y5=EE;y5<108;y5++){ var q=Math.floor((y5-EE)/7)%2; for (var x5=306;x5<(q?313:310);x5++) e.px(x5,y5,(y5-EE)%7===0?P.s1:(x5===306?P.s3:(hash(x5,y5)<0.1?P.s3:P.s4))); }
  winFrameE(e,314,30,10,20); shutters(e,314,30,10,20,13); shutters(e,312,72,9,18,17);
  e.ellipse(312.5,15.5,3.2,3.6,function(x,y){ return (x<312)?P.m4:P.m3; }); e.px(311,14,P.s6); e.line(313,16,316,18,P.m1); e.px(316,18,P.k1); e.vl(317,13,20,P.m1); e.px(317,21,P.k1);   // Satellitenschüssel
  for (var x6=305;x6<W;x6++){ e.px(x6,EE-3,(x6%3)?P.t3:P.t1); e.px(x6,EE-2,P.t2); e.px(x6,EE-1,P.s5); e.px(x6,EE,P.s2); } }
function potOn(w,x,by,kind,sd){ var tin=kind==='b', r=M.rng(sd*31+7);
  for (var y=by-4;y<by;y++) for (var x2=x;x2<x+5;x2++){ var u=(x2-x)/4, c=tin?(u<0.3?P.m4:(u<0.7?P.m3:P.m1)):(u<0.3?P.t4:(u<0.7?P.t3:P.t1)); if (y===by-4) c=tin?P.m2:P.t4; w.px(x2,y,c); }
  if (tin){ w.hl(x,x+4,by-2,P.r2); }
  if (kind==='a'){ [[0,-1],[1,-2],[2,-3],[2,-4],[3,-2],[4,-1],[-1,-2]].forEach(function(o,i){ w.px(x+o[0]+(i%2),by-4+o[1],i%2?P.c3:P.g4); w.px(x+o[0],by-5+o[1],P.g3); }); return; }
  for (var i=0;i<26;i++){ var a=-Math.PI*(0.1+r()*0.8), d=Math.sqrt(r()), px=rnd(x+2+Math.cos(a)*d*4), py=rnd(by-5+Math.sin(a)*d*4); w.px(px,py,kind==='b'?(r()<0.5?P.g4:P.g5):(r()<0.5?P.g2:P.g3)); }
  if (kind==='g') for (var f=0;f<3;f++){ var fx=x+rnd(r()*4), fy=by-7-rnd(r()*3); w.px(fx,fy,P.r3); w.px(fx+1,fy,P.r4); w.px(fx,fy+1,P.r2); } }
function winFrameE(w,x,y,ww,wh){ w.rect(x-2,y-2,ww+4,wh+4,P.s5); w.hl(x-3,x+ww+2,y+wh+2,P.s4); w.hl(x-3,x+ww+2,y+wh+3,P.s1); }

// ---------------------------------------------------------------- Häuser A und B
var OCH=R('w3 w4 w5 d6'), STA=[R('s1 s2 s3 s4'),R('s2 s3 s4 s5'),R('e1 e2 e3 e4')];
function wallA(x,y,wet){ var by=baseY(x);
  var p=fbm(x*0.9,y*1.25,15,5)+(y>by-24?(y-(by-24))/24*0.22:0)+(x<10?0.1:0)+(x>106?0.07:0)-(y<30?0.06:0);
  if (p>0.705){ var c=blocks(x,y,10,6,3,STA,P.s1); if (p<0.73 && fbm(x*0.9,(y-2)*1.25,15,5)<0.705) c=M.DN[c]; return c; }
  var v=0.52+(fbm(x,y,28,1)-0.5)*0.5+(hash(x,y)-0.5)*0.1;
  if (p>0.675) v+=(fbm(x*0.9,(y+2)*1.25,15,5)>0.705)?0.32:-0.12;                     // Putzkante
  if (y>WA[1]+WA[3]+3 && x>=WA[0]-3 && x<WA[0]+WA[2]+3) v-=0.16*Math.max(0,1-(y-WA[1]-WA[3])/30)*(0.55+0.45*Math.sin(x*1.9));   // Regenspuren
  if (y>EA && y<EA+16) v-=0.14*(1-(y-EA)/16)*(0.5+0.5*Math.sin(x*0.7+y*0.1));
  if (y>by-12) v-=(y-(by-12))/12*0.3+(wet?0.14:0);
  return ra(OCH,v,x,y); }
var SB=[R('s2 s3 s4 s5'),R('s2 s3 s4 s5'),R('s1 s2 s3 s4'),R('e2 e3 e4 s5')];
function wallB(x,y,wet){ var by=baseY(x), c=blocks(x-116,y,15,7,9,SB,P.s1);
  if (y>by-10 && hash(x>>1,y>>1)<0.2+(wet?0.25:0)) c=M.DN[c];
  if (y>by-5 && hash(x,y)<0.09) c=P.g3;
  if (x>=MAIL[0]+4 && x<MAIL[0]+MAIL[2]-4 && y>=MAIL[1]+MAIL[3] && y<MAIL[1]+MAIL[3]+9 && hash(x,3)<0.3 && hash(x,y)<0.55-(y-MAIL[1]-MAIL[3])/16) c=P.t2;   // Rostspur unter dem Briefkasten
  return c; }
function eaves(w,x0,x1,ye,sd){
  for (var y=ye-9;y<ye-4;y++) for (var x=x0;x<x1;x++){ var row=y-(ye-9), c=(((x+row*2+sd)%5)===0)?P.t1:(row<2?P.t2:P.t3); if (hash(x,y+sd)<0.07) c=P.t4; if (hash(x*3,y)<0.04) c=P.g3; w.px(x,y,c); }
  for (var x2=x0;x2<x1;x2++){ var k=((x2-x0+sd)%5+5)%5, top=ye-5+((k===0||k===4)?1:0); for (var y2=top;y2<ye-2;y2++) w.px(x2,y2,k===0?P.t0:(k===1?P.t4:(y2===top?P.t4:P.t3))); }
  w.hl(x0,x1-1,ye-2,P.s5); w.hl(x0,x1-1,ye-1,P.s3); w.hl(x0,x1-1,ye,P.s1); }
function paintHouses(b,wet){ var w=RW(b,RG.wall), f=RW(b,RG.far);
  for (var x=0;x<LX;x++){ var by=Math.ceil(baseY(x)); for (var y=(x<116?EA:EB);y<by;y++) w.px(x,y,x<116?wallA(x,y,wet):wallB(x,y,wet)); }
  eaves(w,0,117,EA,0); eaves(w,116,LX+1,EB,2);
  for (var y=2;y<12;y++) for (var x2=26;x2<33;x2++) f.px(x2,y,blocks(x2,y,4,3,5,STA,P.s1)); f.rect(25,0,9,2,P.t3); f.hl(25,33,2,P.t1); f.vl(32,3,11,P.s1);   // Kamin
  // Ecksteine (Haus B rechts) und Fallrohr zwischen den Häusern
  for (var y3=EB;y3<106;y3++){ var q=Math.floor((y3-EB)/7)%2; for (var x3=(q?219:222);x3<LX;x3++) w.px(x3,y3,(y3-EB)%7===0?P.s1:((x3===LX-1)?P.s2:(hash(x3,y3)<0.1?P.s3:P.s4))); }
  for (var y4=EA-1;y4<108;y4++){ w.px(114,y4,P.m1); w.px(115,y4,P.m3); w.px(116,y4,P.m2); if ((y4-EA)%14===0){ w.hl(113,117,y4,P.m0); } }
  w.hl(113,118,108,P.m1); w.px(118,109,P.m2);
  for (var x5=0;x5<LX-2;x5++){ var seg=x5%38, yy=24+rnd(Math.sin(Math.PI*seg/38)*2)-(x5>116?2:0); w.px(x5,yy,P.k1); if (seg===0) w.px(x5,yy-1,P.s5); } }   // Stromkabel

// ---------------------------------------------------------------- Türen, Fenster, Kleinkram
function portal(w,x,y,dw,yb,F){ F=F||R('s2 s3 s4 s5');
  for (var j=y-5;j<yb;j++){ for (var k=1;k<=3;k++){ w.px(x-k,j,k===1?F[1]:(k===2?F[3]:F[2])); w.px(x+dw-1+k,j,k===1?F[0]:(k===2?F[2]:F[1])); } if ((j-y)%13===0){ w.px(x-2,j,F[0]); w.px(x-3,j,F[0]); w.px(x+dw+1,j,F[0]); w.px(x+dw+2,j,F[0]); } }
  for (var j2=y-6;j2<y;j2++) for (var i=x-4;i<x+dw+4;i++){ var c=j2===y-6?F[3]:(j2===y-1?F[0]:F[2]); if (hash(i,j2)<0.08) c=F[1]; w.px(i,j2,c); }
  for (var i2=x-4;i2<x+dw+4;i2++){ w.px(i2,yb,F[3]); w.px(i2,yb+1,F[1]); } w.hl(x-5,x+dw+4,yb+2,F[0]); }
function doorA(w,x,y,dw,yb){ var Rw=R('w0 w1 w2 w3 w4'), th=9;
  w.rect(x,y,dw,th,P.k1); for (var i=x+2;i<x+dw;i+=4) w.vl(i,y,y+th-1,P.m1); w.fn(x,y,dw,th,function(xx,yy){ var dx=(xx-x-dw/2)/(dw/2), r=Math.sqrt(dx*dx+Math.pow((yy-y-th)/th,2)); return (Math.abs(r-0.7)<0.09)?P.m2:undefined; });
  w.hl(x,x+dw-1,y+th,P.w0); var half=dw>>1, top=y+th+1;
  for (var j=top;j<yb;j++) for (var i2=x;i2<x+dw;i2++){ var lx=i2<x+half?i2-x:i2-x-half, ly=j-top, hh=yb-top, c=Rw[2];
    var inP=(lx>=2&&lx<=half-3)&&((ly>=3&&ly<hh*0.55)||(ly>=hh*0.55+3&&ly<hh-4));
    if (inP){ c=Rw[3]; var pt=(ly<hh*0.55)?3:rnd(hh*0.55+3), pb=(ly<hh*0.55)?rnd(hh*0.55)-1:hh-5; if (lx===2||ly===pt) c=Rw[1]; else if (lx===half-3||ly===pb) c=Rw[4]; else if (hash(i2,j>>1)<0.2) c=Rw[2]; }
    else if (hash(i2>>1,j)<0.12) c=Rw[1];
    if (lx===0) c=Rw[3]; if (lx===half-1) c=Rw[0];
    w.px(i2,j,c); }
  var ky=top+rnd((yb-top)*0.5); w.px(x+half-3,ky,P.y3); w.px(x+half+2,ky,P.y3); w.px(x+half-3,ky+1,P.y1); w.px(x+half+2,ky+1,P.y1); }
function doorB(w,x,y,dw,yb){ var G=R('g1 g2 g3 g4'), Wd=R('s1 s2 s3');
  for (var j=y;j<yb;j++) for (var i=x;i<x+dw;i++){ var fu=(i-x)%5, c=G[2]; if (fu===0) c=G[0]; else if (fu===1) c=G[3]; else if (hash(i,j>>2)<0.15) c=G[1];
    var n=fbm(i,j,5,9); if (n>0.69) c=ra(Wd,(n-0.69)*9,i,j); if (j>yb-7&&hash(i,j)<0.3) c=G[1];
    w.px(i,j,c); }
  for (var k=0;k<2;k++){ var hy=y+7+k*(yb-y-16); w.hl(x+1,x+dw-7,hy,P.k1); w.hl(x+1,x+dw-9,hy+1,P.m1); w.px(x+dw-7,hy+1,P.m2); }
  var ky=y+rnd((yb-y)*0.52); w.rect(x+dw-6,ky,3,5,P.m1); w.px(x+dw-5,ky+3,P.k0); w.hl(x+dw-9,x+dw-5,ky-2,P.m2); w.px(x+dw-9,ky-2,P.m3);
  w.hl(x,x+dw-1,y,G[0]); }
function shutters(w,x,y,ww,wh,sd,G){ G=G||R('g1 g2 g3 g4 g5'); var half=ww>>1;
  for (var j=y;j<y+wh;j++) for (var i=x;i<x+ww;i++){ var lx=(i-x)%half, s=(j-y)%3, c=s===0?G[3]:(s===1?G[2]:G[0]);
    if (j===y||j===y+wh-1||j===y+(wh>>1)) c=G[2]; if (lx===0) c=G[3]; if (lx===half-1) c=G[1];
    var n=fbm(i,j,6,sd); if (n>0.64) c=M.UP[c]; if (n>0.77) c=ra(R('s2 s3 s4'),0.5,i,j);
    w.px(i,j,c); } }
function winFrame(w,x,y,ww,wh){ var F=R('s2 s3 s4 s5'); w.rect(x-2,y-2,ww+4,2,F[3]); w.vl(x-2,y,y+wh,F[2]); w.vl(x-1,y,y+wh,F[1]); w.vl(x+ww,y,y+wh,F[1]); w.vl(x+ww+1,y,y+wh,F[0]);
  w.hl(x-3,x+ww+2,y+wh,F[3]); w.hl(x-3,x+ww+2,y+wh+1,F[1]); w.hl(x-2,x+ww+1,y+wh+2,F[0]); }
// Spitzengardine: bei Tag hell mit feinem Muster, nachts warm durchleuchtet
function curtain(x,y,lit){ var ux=x-WA[0], uy=y-WA[1], fold=(ux%5===0), lace=((ux+uy*2)%6===0)&&(uy%2===0), top=uy<3;
  if (lit) return top?P.y3:(fold?P.y3:(lace?P.y5:P.y4));
  return top?P.s1:(fold?P.s3:(lace?P.s3:P.s4)); }
function paintProps(b,wet){ var w=RW(b,RG.prop), g=RW(b,RG.glass);
  // ---- Haus A: Tür Nr. 12, Fenster oben (Läden offen, Spitzengardine, Geranien), vergittertes Fenster unten
  var ya=doorBot(DA); portal(w,DA[0],DA[1],DA[2],ya); doorA(w,DA[0],DA[1],DA[2],ya);
  winFrame(w,WA[0],WA[1],WA[2],WA[3]); g.fn(WA[0],WA[1],WA[2],WA[3],function(x,y){ return curtain(x,y,false); }); w.vl(WA[0]+(WA[2]>>1),WA[1],WA[1]+WA[3]-1,P.s2);
  shutters(w,WA[0]-13,WA[1]-1,11,WA[3]+1,4); shutters(w,WA[0]+WA[2]+2,WA[1]-1,11,WA[3]+1,6);
  w.rect(WA[0]-1,WA[1]+WA[3]-2,WA[2]+2,3,P.t2); w.hl(WA[0]-1,WA[0]+WA[2],WA[1]+WA[3]-2,P.t3);    // Blumenkasten
  geraniums(w,WA[0],WA[1]+WA[3]-3,WA[2],5,61);
  winFrame(w,WG[0],WG[1],WG[2],WG[3]); g.rect(WG[0],WG[1],WG[2],WG[3],P.k1); g.hl(WG[0]+1,WG[0]+4,WG[1]+2,P.n2); g.px(WG[0]+2,WG[1]+3,P.n1);
  for (var gx=WG[0]+1;gx<WG[0]+WG[2];gx+=3) w.vl(gx,WG[1],WG[1]+WG[3]-1,P.m0); for (var gy=WG[1]+3;gy<WG[1]+WG[3];gy+=5) w.hl(WG[0],WG[0]+WG[2]-1,gy,P.m0);
  plate(w,82,52,'12');
  // ---- Haus B: grüne Tür Nr. 14, geschlossene Läden, Briefkasten, Todesanzeige, Laterne
  var yb=doorBot(DB); portal(w,DB[0],DB[1],DB[2],yb); doorB(w,DB[0],DB[1],DB[2],yb);
  winFrame(w,WB[0],WB[1],WB[2],WB[3]); shutters(w,WB[0],WB[1],WB[2],WB[3],8); w.px(WB[0]+5,WB[1]+13,P.k1); w.px(WB[0]+6,WB[1]+13,P.k1);
  plate(w,184,51,'14'); mailbox(w); notice(w,wet); lantern(w,false);
  // ---- Schemel, Blechdosen mit Basilikum und Geranien (auch zwei an Nägeln an der Wand)
  stool(w); cans(w);
  // ---- Wäscheleine (die Wäsche selbst hängt in dynamic)
  for (var i=0;i<=LINE[2]-LINE[0];i++){ var t=i/(LINE[2]-LINE[0]); w.px(LINE[0]+i,rnd(lineY(t)),P.s1); }
  w.px(LINE[0],LINE[1]-1,P.m2); w.px(LINE[2],LINE[3]-1,P.m2); w.px(LINE[2],LINE[3],P.m1);
  for (var i2=0;i2<=LINE2[2]-LINE2[0];i2++){ var t2=i2/(LINE2[2]-LINE2[0]); w.px(LINE2[0]+i2,rnd(line2Y(t2)),P.s1); }
  w.px(LINE2[2],LINE2[3]-1,P.m1); w.px(LINE2[2]+1,LINE2[3]-1,P.m2); w.px(LINE2[2]+1,LINE2[3],P.k1);           // Rolle am Fensterladen
  // ---- Steinbank an Ivkas Wand, darauf eine Dose Basilikum: Zdenka gießt auch Ivkas Pflanzen
  stoneBench(w); can(w,191,BENCH[1]-6,5,6,'b',null);
  // ---- Kabel an der Hausecke hinunter zum Zählerkasten, Antenne auf dem Dach, ein Kapernstrauch aus der Fuge
  for (var y3=EB+6;y3<86;y3++){ w.px(223,y3,P.k1); if ((y3-EB)%9===0){ w.px(222,y3,P.m2); w.px(224,y3,P.m2); } }
  w.rect(220,86,6,7,P.m2); w.hl(220,225,86,P.m3); w.vl(225,86,92,P.m1); w.px(221,88,P.k2); w.px(222,88,P.y2);
  var f=RW(b,RG.far); f.vl(180,1,EB-8,P.m1); f.hl(177,183,2,P.m1); f.hl(178,182,4,P.m2); f.hl(176,184,6,P.m1);
  caper(w,190,EB+3); }
function stoneBench(w){ var x0=BENCH[0], y0=BENCH[1], bw=BENCH[2], x, y;
  for (x=x0+3;x<x0+bw-3;x++) for (y=y0+3;y<Math.ceil(baseY(x));y++){ var c=w.get(x,y); if (c!==T) w.px(x,y,M.step(c,-3)); }   // Schatten unter der Platte
  for (x=x0;x<x0+bw;x++){ var e=(x===x0||x===x0+bw-1); w.px(x,y0-1,P.s1); w.px(x,y0,e?P.s5:(hash(x>>2,9)<0.2?P.s5:P.s6)); w.px(x,y0+1,e?P.s3:P.s4); w.px(x,y0+2,P.s2); }
  [x0+2,x0+bw-8].forEach(function(lx){ for (y=y0+3;y<Math.ceil(baseY(lx));y++) for (x=lx;x<lx+6;x++) w.px(x,y,(x===lx)?P.s4:(x===lx+5?P.s1:(hash(x,y)<0.15?P.s2:P.s3))); }); }
function caper(w,x,y){ var r=M.rng(77);   // Kapern wachsen in Split aus jeder alten Mauer
  for (var i=0;i<34;i++){ var a=Math.PI*(0.05+r()*0.9), d=Math.sqrt(r()), px=rnd(x+Math.cos(a)*d*7), py=rnd(y+Math.sin(a)*d*5); w.px(px,py,r()<0.35?P.g4:(r()<0.6?P.g3:P.g2)); }
  [[x-3,y+3],[x+2,y+4],[x+5,y+2]].forEach(function(p){ w.px(p[0],p[1],P.d5); w.px(p[0]+1,p[1],P.s6); }); w.px(x,y,P.g1); }
function geraniums(w,x,y,ww,hh,sd){ var r=M.rng(sd);
  for (var i=0;i<ww*3;i++){ var px=x+rnd(r()*ww), py=y-rnd(r()*r()*hh); w.px(px,py,r()<0.5?P.g2:(r()<0.6?P.g3:P.g1)); }
  for (var f=0;f<Math.max(2,ww/4);f++){ var fx=x+1+rnd(r()*(ww-3)), fy=y-2-rnd(r()*(hh-1)), fc=r()<0.7?P.r3:P.d4; w.px(fx,fy,fc); w.px(fx+1,fy,M.UP[fc]); w.px(fx,fy+1,M.DN[fc]); w.px(fx+1,fy+1,fc); if (r()<0.6) w.px(fx-1,fy,fc); } }
function plate(w,x,y,s){ w.rect(x,y,9,7,P.b1); w.hl(x,x+8,y,P.b2); w.hl(x,x+8,y+6,P.b0); M.microText(w,s,x+1,y+1,P.s6); }
function mailbox(w){ var x=MAIL[0], y=MAIL[1], mw=MAIL[2], mh=MAIL[3];
  w.fn(x,y,mw,mh,function(xx,yy){ var c=tex.rust(xx*2,yy*2,R('t1 t2 t3 m1 m2')); if (yy===y) c=P.m3; if (xx===x) c=P.m2; if (xx===x+mw-1||yy===y+mh-1) c=P.m0; return c; });
  w.hl(x+3,x+mw-4,y+3,P.k0); w.hl(x+3,x+mw-4,y+4,P.m1); w.hl(x+2,x+mw-3,y+2,P.m3);
  w.rect(x+1,y+7,21,7,P.s5); w.hl(x+1,x+21,y+7,P.s6); w.hl(x+1,x+21,y+13,P.s3); M.microText(w,'PERIĆ',x+2,y+8,P.k2);
  w.px(x+mw-3,y+mh-2,P.y2); }
function notice(w,wet){ var x=NOTE[0], y=NOTE[1], nw=NOTE[2], nh=NOTE[3];
  w.vl(x+nw,y+1,y+nh,P.s1); w.hl(x+1,x+nw,y+nh,P.s1);
  w.fn(x,y,nw,nh,function(xx,yy){ var c=P.s6; if (wet && fbm(xx,yy,3,2)>0.62) c=P.s5; if (xx===x||yy===y||xx===x+nw-1||yy===y+nh-1) c=P.s5;
    if ((xx===x+1||xx===x+nw-2)&&yy>y&&yy<y+nh-1) c=P.k1; if ((yy===y+1||yy===y+nh-2)&&xx>x&&xx<x+nw-1) c=P.k1; return c; });
  w.vl(x+6,y+3,y+7,P.k1); w.hl(x+5,x+7,y+4,P.k1);
  w.rect(x+5,y+9,3,3,P.s3); w.px(x+6,y+9,P.s2);
  w.hl(x+3,x+10,y+13,P.k2); w.hl(x+4,x+9,y+15,P.s2); w.hl(x+3,x+10,y+14,P.s3);
  w.px(x+1,y,P.s4); w.px(x+nw-2,y,P.s4); }
function lantern(w,lit){ var x=LAMP[0], y=LAMP[1];
  w.rect(205,y-4,2,7,P.k1); w.px(207,y-3,P.m1); w.px(207,y+1,P.m1);
  w.hl(207,x+1,y-2,P.k1); w.hl(208,x,y-3,P.m1); w.line(208,y+2,x-4,y-1,P.k1); w.px(x-4,y-1,P.k1); w.px(211,y+3,P.k1); w.px(210,y+2,P.k1);
  w.vl(x,y-2,y,P.k1); w.hl(x-3,x+3,y+1,P.k1); w.hl(x-2,x+2,y,P.m1);
  for (var j=y+2;j<y+11;j++){ var hw=j<y+9?3:2; for (var i=x-hw;i<=x+hw;i++){ var c=(i===x-hw||i===x+hw)?P.k1:(lit?((i===x&&j<y+8)?P.l0:(j<y+4?P.y5:P.y4)):((i===x-1)?P.m3:(j%3===0?P.m1:P.m2))); if (!lit&&i===x+hw-1) c=P.m1; w.px(i,j,c); } }
  w.hl(x-2,x+2,y+11,P.k1); w.px(x,y+12,P.k1); }
function stool(w){ var x=STOOL[0], ys=STOOL[1], sw=STOOL[2], yf=STOOL[3];
  w.hl(x+3,x+sw-4,ys+4,P.w1); w.vl(x+3,ys+2,yf-3,P.w1); w.vl(x+sw-4,ys+2,yf-3,P.w1);
  w.hl(x+1,x+sw-2,ys+7,P.w2);
  w.line(x+2,ys+2,x,yf,P.w2); w.line(x+3,ys+2,x+1,yf,P.w3); w.line(x+sw-3,ys+2,x+sw-1,yf,P.w2); w.line(x+sw-4,ys+2,x+sw-2,yf,P.w3);
  w.rect(x,ys,sw,2,P.w4); w.hl(x+1,x+sw-2,ys-1,P.w5); w.hl(x,x+sw-1,ys+2,P.w1); w.px(x+5,ys,P.w5); w.px(x+9,ys,P.w3); }
function can(w,cx,y0,cw,ch,kind,lab){ for (var j=y0;j<y0+ch;j++) for (var i=cx;i<cx+cw;i++){ var u=(i-cx)/(cw-1), c=u<0.2?P.m2:(u<0.45?P.m4:(u<0.8?P.m3:P.m1)); if (j===y0) c=(u<0.6)?P.s5:P.m3;
    if (lab && j>y0+2 && j<y0+ch-2) c=u<0.25?lab[0]:(u<0.7?lab[1]:lab[0]); if (lab && j===y0+3 && u>0.3&&u<0.6) c=P.s5;
    if (hash(i,j)<0.1) c=P.t2; if (j===y0+ch-1) c=P.m1; w.px(i,j,c); }
  var mx=cx+(cw-1)/2, r=M.rng(cx*7+y0);
  if (kind==='b'){ for (var p=0;p<cw*7;p++){ var a=r()*Math.PI, d=Math.sqrt(r()), px=rnd(mx+Math.cos(a)*d*(cw*0.85)), py=rnd(y0-1-Math.sin(a)*d*6.5); w.px(px,py,r()<0.45?P.g4:(r()<0.6?P.g5:P.g3)); } }
  else { for (var q=0;q<cw*5;q++){ var a2=r()*Math.PI, d2=Math.sqrt(r()), qx=rnd(mx+Math.cos(a2)*d2*(cw*0.8)), qy=rnd(y0-1-Math.sin(a2)*d2*9); w.px(qx,qy,r()<0.5?P.g2:(r()<0.7?P.g3:P.g1)); }
    for (var f=0;f<3;f++){ var fx=rnd(mx-3+r()*5), fy=rnd(y0-6-r()*6), fc=kind==='p'?P.d4:P.r3; w.px(fx,fy,fc); w.px(fx+1,fy,M.UP[fc]); w.px(fx,fy+1,M.DN[fc]); w.px(fx+1,fy+1,fc); w.px(fx+1,fy-1,fc); } } }
function cans(w){
  [[9,8,10,'r',[P.r1,P.r3]],[18,6,7,'b',null],[25,9,11,'p',[P.b0,P.b2]],[35,7,8,'b',[P.r1,P.r2]],[43,5,6,'r',null]].forEach(function(c){ var yb=rnd(baseY(c[0]))+1; can(w,c[0],yb-c[2],c[1],c[2],c[3],c[4]); });
  // zwei Dosen an Nägeln an der Wand
  [[36,78,6,7,'r']].forEach(function(c){ w.px(c[0]+2,c[1]-3,P.k1); w.line(c[0],c[1],c[0]+2,c[1]-3,P.m1); w.line(c[0]+c[2]-1,c[1],c[0]+2,c[1]-3,P.m1); can(w,c[0],c[1],c[2],c[3],c[4],null); }); }

// ---------------------------------------------------------------- Pflaster der Gasse
var FLD=R('s1 s2 s3 s4 s5'), FLW=R('s0 s1 s2 s3 s4');
function floorPx(x,y,wet){ var VPY=30, D=2000/(y-VPY), X=(x-160)*D/100, rf=D/1.75, row=Math.floor(rf), fr=rf-row, rpp=2000/((y-VPY)*(y-VPY))/1.75;
  var off=hash(row,4)*2.6+(row&1)*1.4, cf=(X+off)/3.0, col=Math.floor(cf), fc=cf-col, cpp=D/100/3.0;
  var F=wet?FLW:FLD, t=hash(col*3+1,row*5+2), k=t<0.28?1:(t<0.86?2:3);
  if (fr>1-rpp||fc<cpp) return F[0];
  var c=F[k];
  if (fr>1-rpp*2.2&&fc>cpp*1.5) c=(wet&&hash(col,row*3)<0.45)?F[4]:F[k+1];
  else if (fr<rpp*1.1||fc>1-cpp) c=F[k-1];
  else { var g=vn(x,y*1.6,9,row*7+col); if (g>0.76) c=F[Math.min(4,k+1)]; else if (g<0.18) c=F[k-1]; }
  return c; }
var PUD=[[120,128,24,4.2],[205,119,17,3.2],[40,135,19,4],[266,124,21,3.6],[168,139,13,3]];
function puddle(x,y){ var best=9; for (var i=0;i<PUD.length;i++){ var p=PUD[i], dx=(x-p[0])/p[2], dy=(y-p[1])/p[3], d=dx*dx+dy*dy+(fbm(x,y*2,5,i)-0.5)*0.9; if (d<best) best=d; } return best; }
function floorTop(x){ return x<LX?baseY(x):108; }
function paintFloor(b,wet){ var w=RW(b,RG.floor);
  for (var x=0;x<W;x++){ var y0=Math.ceil(floorTop(x)); for (var y=y0;y<H;y++) w.px(x,y,floorPx(x,y,wet)); }
  for (var x2=0;x2<LX;x2++){ var y1=Math.ceil(baseY(x2)); if (hash(x2,7)<0.22){ w.px(x2,y1,P.g2); if (hash(x2,8)<0.5) w.px(x2,y1-1,P.g3); } } }
// nasses Pflaster: Pfützen spiegeln den grauen Himmel und die Fassaden, sonst nur ein Schimmer unter hellen Dingen
function reflections(b){ var src=b.clone(), PR=R('s0 m1 m2 m3 m4 s5');
  for (var x=0;x<W;x++){ var ax=floorTop(x); for (var y=Math.ceil(ax);y<H;y++){ var k=y*W+x; if (REG[k]!==RG.floor) continue;
    var pd=puddle(x,y), d=y-ax, sy=Math.floor(ax-d-1), sx=cl(x+((y%3===0)?rnd(Math.sin(y*0.9+x*0.03)):0),0,W-1);
    var sc=(sy>=0)?src.d[sy*W+sx]:P.m4, sc2=(sy>0)?src.d[(sy-1)*W+sx]:sc, sky=(sy<0||REG[sy*W+sx]===RG.sky), L=sky?0.85:(M.lum(sc)+M.lum(sc2))/510;
    if (pd<1){ var c=PR[cl(Math.floor((0.1+L*0.92)*(PR.length-1)+0.5),0,PR.length-1)];
      if (hash(Math.floor(x/5)+y*13,y)<0.12 && pd<0.7) c=P.s5;                          // Kräusel, die das Licht fangen
      if (puddle(x,y-1)>=1) c=P.s4; else if (puddle(x,y+1)>=1) c=P.s0;
      b.d[k]=c; }
    else if (L>0.55 && bayer(x,y)<(L-0.55)*1.4*(0.35+0.65*hash(x,Math.floor(y/2)))*(1-d/45)) b.d[k]=M.UP[b.d[k]]; } } }

// ---------------------------------------------------------------- Licht (Tag) und Lichtinseln (Dämmerung, Nacht)
function lightFn(tod,weather){ var sunny=tod==='day'&&weather!=='rain', grey=tod==='day'&&weather==='rain', eve=tod!=='day';
  function sunY(x){ return 47+x*0.03+5*Math.sin(x*0.033+1)+(x>58&&x<72?-7:0)+(x>170&&x<178?-5:0); }
  function gap(x,y){ if (!sunny) return false; var o=(y-40)*0.42, g0=176+o, g1=203+o; return x>=g0&&x<g1; }   // Lücke zwischen den Häusern gegenüber: ein Sonnenstreifen
  return function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; var v=0, cx=(x-160)/190, cy=(y-(y<72?40:80))/110, vg=cx*cx+cy*cy; v-=Math.max(0,vg-0.32)*1.0;
    if (r===RG.wall||r===RG.prop||r===RG.glass){ var by=baseY(x), ev=x<116?EA:EB;
      if (y>by-16) v-=(y-(by-16))/16*0.5; if (y<ev+6) v-=(ev+6-y)/6*0.9;
      if (sunny){ var s=sunY(x); v+=(y<s-1||gap(x,y))?0.7:((y<s+1)?(bayer(x,y)<0.5?0.7:-0.6):-0.6); }
      else if (grey) v+=-0.12+(1-y/110)*0.3; }
    else if (r===RG.floor){ var d=y-floorTop(x); if (d<7) v-=(7-d)/7*0.7; if (sunny) v+=gap(x,y)?0.35:-0.75; v+=(y-110)/34*0.2; }
    else if (r===RG.stair){ if (sunny) v+=(y<92?0.45:0.1); if (x<LX+14) v-=(LX+14-x)/14*0.6; }
    else if (r===RG.side){ v+=sunny?0.55:0.1; if (y>95) v-=(y-95)/13*0.4; }
    else if (r===RG.wallE){ if (y>96) v-=(y-96)/12*0.4; if (sunny) v-=0.25; }
    else if (r===RG.up){ if (sunny) v+=0.45; }
    else if (r===RG.far){ if (sunny) v+=0.2; }
    if (eve) v-=(tod==='dusk'?(r===RG.far?0.6:0.85):(tod==='night'?0.12:0.25));
    return v; }; }
// warme Lichtinseln in vier Stufen (blau → umbra → bernstein → gold), weich gedithert; eigene Ellipsen für Wände und Boden
var DIMW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.5+r*0.12+12, L*0.38+g*0.08+8, L*0.26+b*0.1+16]; });
var MIDW=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.45+L*0.36+16, g*0.32+L*0.26+6, b*0.16+L*0.08+4]; });
var LWALL=[[217,50,64,54,1.08],[62,38,25,22,0.95],[232,51,9,8,0.8],[318,40,8,12,0.7],[300,39,6,6,0.8]];
var LFLOOR=[[212,120,74,17,1.0],[62,119,30,8,0.42]];
function lightAt(x,y,tod,r){ var set=r===RG.floor?LFLOOR:LWALL, L=0; for (var i=0;i<set.length;i++){ var l=set[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], f=1-dx*dx-dy*dy; if (f>0){ var v=l[4]*Math.pow(f,1.15); if (v>L) L=v; } }
  if (r===RG.up) L*=(x>228&&x<238)?1:0.3; else if (r===RG.far) L*=0.15; else if (r===RG.wallE) L*=(y<52&&x>312)?1:0.4;
  return tod==='dusk'?L*0.72:L; }
function warmPass(b,base,tod){ var LT=M.TINT.lamp;
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, r=REG[k]; if (r===RG.sky) continue; var L=lightAt(x,y,tod,r); if (L<0.03) continue;
    var f=L*3.3, lv=Math.floor(f), fr=f-lv, t=lv===0?fr:(fr-0.5)*1.7+0.5; if (t>bayer(x,y)) lv++; if (lv<=0) continue; if (tod==='dusk' && lv===1) continue;
    var c=base.d[k]; b.d[k]=lv===1?M.tintPx(DIMW,c,x,y):(lv===2?M.tintPx(MIDW,c,x,y):(lv===3?M.tintPx(LT,c,x,y):M.UP[M.tintPx(LT,c,x,y)])); } }
// Figuren unter der Laterne werden warm angeleuchtet
function actorLut(a,S,GS,tod){ if (tod==='day'||!M.TINT[tod]) return null; var dx=(a.x-214)/58, dy=(a.y-116)/26, f=1-dx*dx-dy*dy, L=f>0?Math.pow(f,0.8):0; if (tod==='dusk') L*=0.8;
  var dz=(a.x-62)/26; if (Math.abs(dz)<1 && a.y<126) L=Math.max(L,0.28*(1-dz*dz));
  if (L>0.5) return MIDW.a; if (L>0.2) return DIMW.a; return M.TINT[tod].a; }

// ---------------------------------------------------------------- Bild
var catSave=null, catCol=[P.k1,P.s5], LAST=null;
var CATS=['.k.k......','.kkk......','kykk......','.kkkw.....','..kkkk....','..kkkkk...','..kwkkkk..','..kwkkkk..','.wwkkkkk..'];
function drawCat(b){ var x0=CAT[0], y0=CAT[1]-CATS.length; for (var j=0;j<CATS.length;j++) for (var i=0;i<CATS[j].length;i++){ var ch=CATS[j][i]; if (ch==='.') continue; var c=ch==='k'?((i>4&&j>5)?P.k2:P.k1):(ch==='w'?P.s5:P.g4); b.px(x0+i,y0+j,c); REG[(y0+j)*W+x0+i]=RG.prop; } }
var TAILS=[[[8,8],[9,8],[10,7],[10,6]],[[8,8],[9,7],[10,6],[10,5],[11,4]],[[8,8],[9,7],[10,7],[11,6],[11,5]]];
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), wet=weather==='rain'; REG.fill(0);
  paintSky(b,tod,weather); paintForest(b); paintUpper(b); paintLane(b); paintHouses(b,wet); paintFloor(b,wet); paintProps(b,wet); drawCat(b);
  M.light(b,lightFn(tod,weather),0,0);
  if (wet) reflections(b);
  var base=b.clone();
  M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; } });
  if (tod!=='day' && M.TINT[tod]) warmPass(b,base,tod);
  // Katze: Untergrund unter dem Schwanz merken, dann den Schwanz in Ruhelage malen
  var x0=CAT[0], y0=CAT[1]-CATS.length; catSave=[]; for (var j=3;j<10;j++) for (var i=7;i<13;i++) catSave.push(b.get(x0+i,y0+j)); catCol=[b.get(x0+3,y0+5),b.get(x0+1,y0+8)];
  TAILS[0].forEach(function(p){ b.px(x0+p[0],y0+p[1],catCol[0]); });
  if (tod!=='day'){ var lw={px:function(x,y,c){ b.px(x,y,c); },hl:function(a,z,y,c){ b.hl(a,z,y,c); },vl:function(x,a,z,c){ b.vl(x,a,z,c); },rect:function(x,y,w,h,c){ b.rect(x,y,w,h,c); },line:function(a,c2,d,e,c){ b.line(a,c2,d,e,c); }};
    lantern(lw,true);
    b.fn(WA[0],WA[1],WA[2],WA[3],function(x,y){ return (x===WA[0]+(WA[2]>>1))?P.y2:curtain(x,y,true); });
    b.rect(229,46,6,9,P.y3); b.drect(229,46,6,9,P.y3,P.y4,0.4); b.vl(232,46,54,P.y1);
    b.rect(314,30,6,20,P.y2); b.drect(314,31,6,4,P.y3,P.y4,0.5);
    [[43,8,3],[88,6,4],[166,4,4],[214,5,3]].forEach(function(q){ for (var yy=q[1];yy<q[1]+q[2];yy++) for (var xx=q[0];xx<q[0]+3;xx++){ if (REG[yy*W+xx]!==RG.far) continue; b.px(xx,yy,(yy===q[1])?P.y2:(bayer(xx,yy)<0.5?P.y4:P.y3)); } });   // Fenster oben am Hang
    b.px(x0,y0+2,P.y4);
    b.px(301,38,P.y5); b.px(301,37,P.y4); b.px(301,39,P.r4); }   // das Grablicht in der Nische
  LAST=b; return b; }

// ---------------------------------------------------------------- Ebenen
function layers(S,GS,tod){ var L=[];
  // großer Terrakottatopf mit Rosmarin vorn rechts (Figuren gehen dahinter vorbei)
  var l=M.layer(288,100,32,44,142), w=M.lw(l), r=M.rng(9);
  for (var y=124;y<144;y++){ var t=(y-124)/20, hw=11+Math.sin(t*2.6)*3; for (var x=rnd(306-hw);x<=rnd(306+hw);x++){ var u=(x-(306-hw))/(2*hw), c=u<0.16?P.t1:(u<0.42?P.t4:(u<0.75?P.t3:P.t2)); if (y===124||y===125) c=(u<0.5)?P.t5:P.t3; if (y>=134&&y<=135) c=M.DN[c]; if (hash(x,y)<0.07) c=P.t2; w.px(x,y,c); } }
  w.hl(293,319,123,P.t4); w.hl(294,318,126,P.t1);
  for (var i=0;i<260;i++){ var a=-Math.PI*(0.1+r()*0.8), d=Math.sqrt(r()), px=rnd(306+Math.cos(a)*d*14), py=rnd(123+Math.sin(a)*d*20), c2=r()<0.25?P.g1:(r()<0.55?P.g2:(r()<0.85?P.g3:P.c3)); w.px(px,py,c2); if (r()<0.4) w.px(px,py-1,c2); }
  for (var f=0;f<9;f++) w.px(296+rnd(r()*20),106+rnd(r()*14),P.v3);   // Rosmarinblüten
  if (tod!=='day') M.tintApply(l,M.TINT[tod]);
  L.push(l); return L; }

// ---------------------------------------------------------------- jedes Bild
var CLOTHES=[[0.08,8,9,'s6'],[0.23,6,11,'b3'],[0.4,13,13,'s5'],[0.61,7,9,'r3'],[0.75,3,5,'m3'],[0.81,3,5,'m3'],[0.9,6,10,'c2']];
var CLOTHES2=[[0.12,7,8,'d4'],[0.42,3,5,'s5'],[0.52,3,5,'s5'],[0.7,8,10,'g4']];
function dynamic(fb,v,S,GS){ var weather=M.scn.weather(GS), tod=v.tod, tint=tod!=='day'?M.TINT[tod]:null, cam=v.cam, t=v.t;
  // Wäsche: hängt schlaff, flattert in der Bura
  var wind=weather==='bura'?1:0;
  CLOTHES.concat(CLOTHES2).forEach(function(cd,k){ var two=k>=CLOTHES.length, L=two?LINE2:LINE, tt=cd[0], cw=cd[1], ch=cd[2], base=P[cd[3]], x0=rnd(L[0]+(L[2]-L[0])*tt), y0=rnd(two?line2Y(tt):lineY(tt))+1;
    var ph=t*(wind?7:0.9)+k*1.7, lift=wind?(0.32+0.22*Math.sin(ph)):0.03*Math.sin(ph);
    for (var u=0;u<cw;u++){ var hgt=Math.max(2,rnd(ch*(1-lift*(0.6+0.4*Math.sin(ph+u*0.6)))));
      for (var q=0;q<hgt;q++){ var sh=wind?rnd((q/hgt)*(q/ch)*(3+2*Math.sin(ph*1.3+u*0.4))):0, sx=x0+u+sh, sy=y0+q;
        var c=base; if (u===0||q===hgt-1) c=M.DN[base]; else if (((u+rnd(Math.sin(ph+q*0.3)*1.2))%4)===0) c=M.DN[base]; else if (u===1) c=M.UP[base];
        if (weather==='rain') c=M.DN[c]; if (tint){ c=M.tintPx(tint,c,sx,sy); if (tod==='night') c=M.DN[c]; } fb.px(sx-cam,sy,c); } }
    var pc=tint?M.tintPx(tint,P.w4,x0,y0):P.w4; fb.px(x0-cam,y0-1,pc); fb.px(x0+cw-1-cam,y0-1,pc); });
  // Katze: ab und zu ein Schwanzzucken
  if (catSave){ var ph2=t%6.5, fr=ph2<0.25?1:(ph2<0.5?2:(ph2<0.75?1:0)); if (fr){ var x0=CAT[0], y0=CAT[1]-CATS.length, n=0;
    for (var j=3;j<10;j++) for (var i=7;i<13;i++){ var c=catSave[n++]; if (c!==undefined&&c!==T) fb.px(x0+i-cam,y0+j,c); }
    TAILS[fr].forEach(function(p){ fb.px(x0+p[0]-cam,y0+p[1],catCol[0]); }); } }
  if (tod!=='day') M.glow(fb,LAMP[0]-cam,LAMP[1]+6,10,t,0.45);
  // Tropfen von der Traufe (eben hat es aufgehört zu regnen) und Ringe in den Pfützen
  if (weather==='rain' && GS.phase==='pro'){ [[36,EA,0.0],[99,EA,0.4],[131,EB,0.8],[196,EB,0.2],[60,WA[1]+WA[3]+2,0.6]].forEach(function(d,i){ var per=1.1+i*0.23, ph=((t+d[2]*per)%per)/per, yb=rnd(baseY(d[0]))+2, y=rnd(d[1]+(yb-d[1])*ph*ph);
      if (ph<0.93){ fb.px(d[0]-cam,y,P.s5); fb.px(d[0]-cam,y-1,P.s3); } else { fb.px(d[0]-1-cam,yb-1,P.s4); fb.px(d[0]+1-cam,yb-1,P.s4); } });
    PUD.forEach(function(p,i){ var per=2.2+i*0.7, ph=((t+i*0.9)%per)/per; if (ph>0.5) return; var rr=1+ph*10, cx=p[0]+Math.sin(i*3)*p[2]*0.4, cy=p[1];
      for (var a=0;a<12;a++){ var x=rnd(cx+Math.cos(a/12*Math.PI*2)*rr), y=rnd(cy+Math.sin(a/12*Math.PI*2)*rr*0.3); if (puddle(x,y)<0.8) fb.px(x-cam,y,P.s4); } }); } }
function front(fb,v,S,GS){ var weather=M.scn.weather(GS);
  if (weather==='bura') M.scn.buraDebris(fb,v.t,112,140,v.cam);
  if (weather==='rain' && GS.phase!=='pro') M.rain(fb,v.t,{n:70}); }
// Geistersicht: Ivkas tausend Wege zur Riva als blasse Spur, ein kalter Schimmer an ihrer Tür
function ghost(fb,v,S,GS){ var t=v.t, bg=LAST, G=M.TINT.ghost;
  function free(x,y){ if (!bg) return true; var c=bg.get(x+v.cam,y); return fb.get(x,y)===M.tintPx(G,c,x,y); }
  for (var i=0;i<44;i++){ var x=rnd(160-i*3.6), y=rnd(117+Math.sin(i*0.5)*2.5+((i%2)?1.5:-1.5)); if (x<2) break; var a=0.55+0.45*Math.sin(t*0.9-i*0.25); if (a<0.3||!free(x,y)) continue; fb.px(x,y,a>0.75?P.x5:P.x4); if (free(x+1,y)) fb.px(x+1,y,a>0.75?P.x4:P.x3); if (free(x,y+1)&&a>0.6) fb.px(x,y+1,P.x2); }
  for (var k=0;k<9;k++){ var mx=DB[0]+2+rnd(hash(k,3)*(DB[2]-4)+Math.sin(t*0.7+k)*2), my=rnd(doorBot(DB)-((t*5+hash(k,4)*60)%60)); if (free(mx,my)) fb.px(mx,my,(k%3)?P.x4:P.x5); }
  var nx=NOTE[0]-1, ny=NOTE[1]-1, pulse=Math.sin(t*1.6)>0; for (var q=0;q<NOTE[2]+2;q++){ if (pulse||q%2){ fb.px(nx+q,ny,P.x3); fb.px(nx+q,ny+NOTE[3]+1,P.x3); } } }

// ---------------------------------------------------------------- Raum
M.defineArt('varos',{
  width:W, paint:paint, layers:layers, dynamic:dynamic, front:front, ghost:ghost, actorLut:actorLut,
  walk:function(x,y,S,GS){ if (x<=6||x>=310||y>=140) return false; var top=x<LX?baseY(x)+3:109.5; if (y<top) return false;
    if (x>=76&&x<=99&&y<125) return false;          // Schemel mit Zdenka
    if (x>=290&&y>=127) return false;               // Topf vorn rechts
    return true; },
  walkG:function(){ return false; },
  spots:{ exit:[0,44,12,100], zdenka_door:[44,46,36,64], stool:[78,108,18,15], plants:[7,74,42,38],
    ivka_door:[146,43,36,64], ivka_window:[147,17,34,29], mailbox:[184,69,25,18], notice:[129,62,16,21],
    church:[235,2,52,63], bell:[251,4,20,20], steps:[226,63,80,46], laundry:[84,26,64,24], lamp:[203,29,22,24], cat:[281,79,16,12] },
  stands:{ exit:[10,124,'L'], zdenka_door:[62,115,'B'], stool:[106,122,'L'], plants:[30,117,'B'],
    ivka_door:[164,112,'B'], ivka_window:[164,114,'B'], mailbox:[196,112,'B'], notice:[137,113,'B'],
    church:[258,113,'B'], bell:[262,114,'B'], steps:[262,112,'B'], laundry:[116,121,'B'], lamp:[214,113,'B'], cat:[286,113,'B'] },
  actorPos:{ zdenka:[86,122,'R','zdenka',false,'sit'] },
  start:[40,124,'R'], entries:{ map:[14,126,'R'], ivka:[164,113,'F'] }
});
})(M);
