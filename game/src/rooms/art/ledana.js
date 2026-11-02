/* ===== rooms/art/ledana.js — In der alten Eisfabrik: eine große, verlassene Halle.
   Links unter der Galerie rostige Eismaschinen und Kompressoren, darüber die Galerie (Büroebene) mit Geländer und dem
   Bürofenster zum Hafen; die eingestürzte Holztreppe führt hinauf (nur Mala kommt hoch: walkG). Rechts hinten die schwere
   Kühlraumtür (S.coldOpen), rechts vorn das offene Ladetor mit der Rampe, dahinter das Hafenbecken und gegenüber der
   Fährhafen. Im Torrahmen der lockere Ziegel (S.brickOut). Tag: Lichtstreifen durch kaputte Oberlichter, Tauben, Staub.
   Nacht: Mond, gegenüber die erleuchtete Nachtfähre nach Ancona (S.ferryGo: sie legt ab und fährt nach rechts). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320, H=144;
var VP=[104,46], F=100, FY=100, RECT=[28,18,196,100];
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var R=M.R;
var GAL={X0:28,X1:124,Y:66,Z1:34};                       // Galerie (Raumkoordinaten)
var ST={X0:124,X1:164,Z0:18,Z1:30};                      // Treppe: von der Galerie (Y=66) hinab zum Boden (Y=100)
var OWIN=[92,26,32,30];                                  // Bürofenster in der Rückwand (über der Galerie)
var BWIN=[[134,24,24,34],[166,24,24,34]];                // hohe Hallenfenster
var DOORQ=M.wallQuad(SPEC,'R',6,28,44,100);              // Kühlraumtür
var GATEQ=M.wallQuad(SPEC,'R',38,140,22,100);            // Ladetor (Öffnung)
var BRICK=M.wallQuad(SPEC,'R',32.5,35.5,82,85);          // lockerer Ziegel im Torrahmen
var HZ=44;                                               // Horizont draußen
var LUKA=[92,70], NINA=[270,124];

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function inPoly(x,y,p){ return M.inPoly(x,y,p); }
function p3(X,Y,Z){ var q=R3.p(X,Y,Z); return [q[0],q[1]]; }
// ist (x,y) draußen (Blick durch das Tor)?
function inGate(x,y){ return inPoly(x+0.5,y+0.5,GATEQ); }

// ---------------------------------------------------------------- Licht-Tönungen (eigener Abschluss, wie im Schuppen)
var MOONT=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*0.42+10, L*0.58+g*0.06+16, L*0.82+b*0.08+36]; });
var NIGHTA=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.18+L*0.08, g*0.22+L*0.1+2, b*0.34+L*0.18+14]; });
var HALL=M.tintMake(function(r,g,b){ return [r*0.78, g*0.78, b*0.84+4]; });   // Figuren im Halbdunkel der Halle (Tag)
function finishNight(b,mask,cold){ var d=b.d; for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, c=d[k]; if (c===T||mask[k]) continue; var bb=bayer(x,y), cv=(cold(x,y)-0.25)*2.4, L=(cv>0&&bb<cv)?MOONT:NIGHTA, r=L.r[c]; d[k]=(r>0.2&&bb<(r-0.2)*1.4)?L.b[c]:L.a[c]; } }

// ---------------------------------------------------------------- Blick nach draußen: Himmel, Kozjak, Fährhafen, Wasser, Rampe
var OUT=null;
function rampOuter(y){ return 234+(y-122)*1.9+34; }      // Kante der Rampe zum Wasser (Bildschirm-x bei Zeile y)
function paintOut(tod,weather){ var o=new M.Buf(W,H,P.k0), x, y, night=tod==='night';
  for (y=0;y<H;y++) for (x=0;x<W;x++){ var c;
    if (y<HZ){ if (night){ c=ra(R('k0 k1 k2 n0 n1'),Math.pow(y/HZ,1.2)*0.95,x,y); } else { c=ra(R('b0 b1 b2 b3 b4 b5'),0.2+Math.pow(y/HZ,1.3)*0.78,x,y); } }
    else { var d=(y-HZ)/(H-HZ); c=night?ra(R('k0 a0 a1 n0 n1'),0.62-d*0.5,x,y):ra(R('a1 a2 a3 a4 a5'),0.75-d*0.55,x,y); }
    o.px(x,y,c); }
  if (night){ for (var i=0;i<60;i++){ var sx=220+Math.floor(hash(i,1)*100), sy=Math.floor(hash(i,2)*34); o.px(sx,sy,hash(i,3)<0.25?P.n5:P.n3); } M.moon(o,300,14,3); }
  else { for (i=0;i<4;i++){ var cy=8+i*7, cx=230+i*20; for (var k=0;k<40;k++){ var xx=cx+k, yy=cy+Math.round(Math.sin(k*0.1+i)); if (bayer(xx,yy)<0.5*(1-Math.abs(k/40-0.5)*2)) o.px(xx,yy,P.b5); } } }
  // Kozjak und Mosor als Silhouette
  for (x=200;x<W;x++){ var mt=HZ-7-Math.round(Math.sin(x*0.05)*2.5+Math.sin(x*0.13+1)*1.5+(x-200)*0.03); for (y=mt;y<HZ-2;y++) o.px(x,y,night?(y<mt+2?P.k2:P.k1):(y<mt+2?P.b2:P.b1)); }
  // Stadt und Fährhafen am anderen Ufer: Blöcke, Kräne, Terminal, Lichter
  var r=M.rng(77); for (x=214;x<W;){ var w=4+Math.floor(r()*9), h=2+Math.floor(r()*6); for (y=HZ-2-h;y<HZ;y++) for (var xx2=x;xx2<x+w&&xx2<W;xx2++){ var c2=night?((hash(xx2,y)<0.18)?(hash(xx2,y*3)<0.5?P.y4:P.y3):P.k2):((xx2===x)?P.s5:(hash(xx2,y)<0.15?P.s2:P.s4)); o.px(xx2,y,c2); } x+=w+(r()<0.3?1:0); }
  [[236,14],[312,18]].forEach(function(cr){ var cx2=cr[0], ch=cr[1]; o.vl(cx2,HZ-2-ch,HZ-2,night?P.k2:P.m2); o.line(cx2-6,HZ-2-ch,cx2+8,HZ-2-ch,night?P.k2:P.m2); o.vl(cx2+7,HZ-1-ch,HZ-ch+4,night?P.k2:P.m1); if (night) o.px(cx2,HZ-3-ch,P.r4); });
  // Terminalgebäude (Beton, 70er) mit Lichterkette
  for (y=HZ-9;y<HZ;y++) for (x=256;x<300;x++){ var c3=night?P.k2:(y===HZ-9?P.s5:P.s4); if (!night && (x-256)%5===0 && y>HZ-7) c3=P.n1; if (night && (x-256)%4===0 && y===HZ-6) c3=P.y3; o.px(x,y,c3); }
  for (x=214;x<W;x+=3) if (hash(x,9)<0.6) o.px(x,HZ-1,night?P.y4:P.s3);
  // Kai drüben
  o.hl(214,W-1,HZ,night?P.k1:P.s3); o.hl(214,W-1,HZ+1,night?P.k0:P.s2);
  // Rampe (Beton, nach außen abfallend, nasse Kante mit Algen)
  for (y=100;y<H;y++) for (x=200;x<W;x++){ if (x>rampOuter(y)) continue; var dd=(rampOuter(y)-x)/40, c4=night?ra(R('k1 k2 m0 m1'),0.25+dd*0.6,x,y):ra(R('m1 m2 s2 s3 s4'),0.3+dd*0.6,x,y);
    if ((x+y*2)%23===0) c4=M.DN[c4]; if (rampOuter(y)-x<3) c4=night?P.k1:(rampOuter(y)-x<1.5?P.g1:P.e1); if (hash(x>>1,y)<0.05) c4=M.DN[c4]; o.px(x,y,c4); }
  // Poller und Kette an der Rampenkante
  var bx=rnd(rampOuter(128))-8; o.rect(bx-2,120,5,8,night?P.k1:P.m1); o.hl(bx-3,bx+3,119,night?P.k2:P.m2); o.px(bx,118,night?P.k2:P.m3);
  return o; }

// ---------------------------------------------------------------- Texturen der Halle
function wallTex(u,v,x,y){ var c, f=fbm(u*0.045,v*0.06);
  if (v>66){ c=tex.plaster(u,v,R('g0 g1 g2'),0); if (v===67) c=P.g2; if (f<0.32) c=tex.bricks(u,v,R('t0 t1 t2 t3'),8,4); }
  else { c=tex.plaster(u,v,R('s2 s3 s4'),0); if (f<0.36) c=tex.bricks(u,v,R('t0 t1 t2 t3'),8,4); else if (f<0.38) c=P.s4; }
  var st=fbm(u*0.3,v*0.015); if (st>0.62) c=M.DN[c]; if (v<14 && bayer(x,y)<(14-v)/18) c=M.DN[c]; return c; }
function floorTex(xb,d,x,y){ var k=(y-VP[1])/(FY-VP[1]), Z=(k-1)*F, X=VP[0]+(x-VP[0])/k;
  var c=ra(R('m0 m1 m2 s1 s2'),0.45+(fbm(X*0.05,Z*0.08)-0.5)*0.7,x,y);
  if (Math.abs(((X+400)%42)-21)<0.5/k*1.2 || Math.abs(((Z+400)%26)-13)<0.35) c=P.m0;     // Dehnungsfugen
  if (fbm(X*0.2+4,Z*0.3)>0.7) c=M.DN[c]; if (hash(x,y)<0.03) c=P.s3; return c; }

// ---------------------------------------------------------------- Malen
var DYN=null;
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), night=tod==='night', x, y, i, k;
  OUT=paintOut(tod,weather);
  var OUTM=new Uint8Array(W*H);   // Pixel, die den Blick nach draußen zeigen (nicht umfärben)
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return wallTex(u+28,v,x,y); },
    side:function(u,v,x,y,sd){ var c=wallTex(u*1.6+(sd==='L'?0:500),v,x,y); return sd==='L'?M.DN[c]:c; },
    floor:floorTex,
    ceil:function(xb,d,x,y){ var kk=(VP[1]-y)/(VP[1]-RECT[1]), Z=(kk-1)*F, X=VP[0]+(x-VP[0])/kk, c;
      var bay=((X+400)%40), purl=((Z+400)%22), gi=Math.floor((X+400)/40)*7+Math.floor((Z+400)/22), skyl=(Math.floor((X+400)/40)%2===0);
      if (bay<2.4/kk+0.8) c=(bay<1.2/kk+0.4)?P.k1:P.m1; else if (purl<1.4) c=P.k1; else if (skyl){ var pane=((X+400)%8<0.8)||((Z+400)%5<0.6), broken=hash(gi,3)<0.3&&hash(Math.floor((X+400)/8),Math.floor((Z+400)/5))<0.6;
        if (pane) c=P.m0; else if (broken) c=night?P.n2:P.b4; else c=night?P.k2:(((x+y)%3===0)?P.m3:P.m2); }
      else { c=tex.boards(X*2,Z*2,R('k1 m0 m1 m2'),6); }
      return c; } });
  // ---- Fenster der Rückwand (hoch, Stahlsprossen) und Bürofenster
  BWIN.forEach(function(wd,wi){ for (y=wd[1];y<wd[1]+wd[3];y++) for (x=wd[0];x<wd[0]+wd[2];x++){ var fu=(x-wd[0])%6, fv=(y-wd[1])%7, c; if (fu===0||fv===0) c=P.m0; else { var hb=hash(Math.floor((x-wd[0])/6)+wi*9,Math.floor((y-wd[1])/7)); c=hb<0.45?(night?P.k2:P.b4):(night?P.n0:((x+y)%4===0?P.a2:P.a3)); if (!night && hb<0.45 && fv<3) c=P.b5; } b.px(x,y,c); }
    b.rect(wd[0]-2,wd[1]-2,wd[2]+4,2,P.s2); b.rect(wd[0]-2,wd[1]+wd[3],wd[2]+4,3,P.s4); b.hl(wd[0]-2,wd[0]+wd[2]+1,wd[1]+wd[3]+2,P.s1); });
  // ---- Rohre an der Rückwand
  for (x=126;x<196;x++){ b.px(x,62,P.t2); b.px(x,63,P.t1); b.px(x,64,P.t0); if (x%18===0){ b.rect(x-1,61,3,5,P.m1); } }
  b.vl(186,22,61,P.m1); b.vl(187,22,61,P.m2); b.vl(188,22,61,P.m0); b.rect(184,40,5,3,P.r2); b.hl(184,188,40,P.r3);
  // ---- Graffiti (2000er): SPLIT in Blasenschrift, HAJDUK ŽIVI VJEČNO, Tags
  var gt=new M.Buf(60,16,T); M.big(gt,'SPLIT',30,3,P.b3,2,false); M.outline(gt,P.k1);
  for (y=0;y<gt.h;y++) for (x=0;x<gt.w;x++){ var gc=gt.get(x,y); if (gc===T) continue; var X=136+x, Y=74+y; if (gc===P.b3){ gc=(y<7)?P.b4:(y>11?P.b1:P.b3); if (hash(X,Y)<0.06) continue; } b.px(X,Y,gc); }
  M.microText(b,'HAJDUK ŽIVI VJEČNO',126,92,P.r3); b.hl(126,196,98,P.k2);
  b.line(150,70,158,67,P.s5); b.line(158,67,160,71,P.s5); M.microText(b,'03',162,67,P.y3); b.ellipse(126,80,3,3,P.y3); b.px(125,79,P.k1); b.px(127,79,P.k1); b.hl(125,127,81,P.k1);
  // ---- Galerie: Bodenbretter, Stahlträger, Säulen; Bürotür und Plakat an der Rückwand
  var gp=[p3(GAL.X0-40,GAL.Y,0),p3(GAL.X1,GAL.Y,0),p3(GAL.X1,GAL.Y,GAL.Z1),p3(GAL.X0-40,GAL.Y,GAL.Z1)];
  b.poly(gp,function(x,y){ var kk=(y-VP[1])/(GAL.Y-VP[1]), X=VP[0]+(x-VP[0])/kk, fu=((X+400)%7), c=fu<0.9/kk?P.w0:(hash(Math.floor((X+400)/7),2)<0.5?P.w2:P.w1); if (hash(x,y)<0.06) c=P.w0; return c; });
  var gf0=p3(GAL.X0-40,GAL.Y,GAL.Z1), gf1=p3(GAL.X1,GAL.Y,GAL.Z1), gb1=p3(GAL.X1,GAL.Y+5,GAL.Z1);
  for (y=rnd(gf1[1]);y<rnd(gb1[1]);y++) for (x=0;x<=rnd(gf1[0]);x++){ var c5=(y===rnd(gf1[1]))?P.t3:((y===rnd(gb1[1])-1)?P.t0:P.t1); if (x%11===0 && y===rnd(gf1[1])+2) c5=P.m2; b.px(x,y,c5); }
  b.poly([p3(GAL.X1,GAL.Y,0),p3(GAL.X1,GAL.Y,GAL.Z1),p3(GAL.X1,GAL.Y+5,GAL.Z1),p3(GAL.X1,GAL.Y+5,0)],P.t0);
  [50,100].forEach(function(cX){ R3.box(b,cX-2,cX+2,GAL.Y+5,FY,GAL.Z1-3,GAL.Z1,{front:function(x,y){ return (x%3===0)?P.m1:P.m2; },left:P.m0,right:P.m0}); });
  // Bürotür und Plakat auf der Galerie
  b.rect(36,30,18,36,P.w1); b.rect(38,32,14,12,P.a1); b.hl(38,51,32,P.a2); b.rect(38,46,14,18,P.w2); b.px(51,50,P.y3); b.rect(37,24,16,5,P.s4); M.microText(b,'UPRAVA',37,24,P.k2);
  b.rect(62,34,14,18,P.s5); b.rect(63,35,12,6,P.r3); M.microText(b,'PAZI',63,42,P.k1); b.rect(64,48,10,2,P.s3);
  // Bürofenster mit zerbrochener Scheibe, Blick über den Hafen
  var ow=OWIN; b.rect(ow[0]-3,ow[1]-3,ow[2]+6,ow[3]+6,P.s1); b.hl(ow[0]-3,ow[0]+ow[2]+2,ow[1]+ow[3]+2,P.s4);
  for (y=ow[1];y<ow[1]+ow[3];y++) for (x=ow[0];x<ow[0]+ow[2];x++){ var ux=x-ow[0], vy=y-ow[1], c6; var hz=ow[1]+17;
      if (y<hz) c6=night?ra(R('k0 k1 k2 n0'),(y-ow[1])/17,x,y):ra(R('b1 b2 b3 b4'),0.3+(y-ow[1])/17*0.7,x,y);
      else if (y<hz+2) c6=night?P.k2:P.b1; else c6=night?ra(R('k0 a0 a1 n0'),0.7-(y-hz)/14*0.5,x,y):ra(R('a2 a3 a4 a5'),0.8-(y-hz)/14*0.5,x,y);
      if (y===hz+2 && x>ow[0]+6 && x<ow[0]+20) c6=night?P.k1:P.b2;
      b.px(x,y,c6); OUTM[y*W+x]=1; }
  if (night){ b.px(ow[0]+24,ow[1]+5,P.n5); for (x=ow[0]+2;x<ow[0]+ow[2];x+=4) b.px(x,ow[1]+18,P.y3); } else { b.rect(ow[0]+8,ow[1]+15,8,2,P.s5); b.px(ow[0]+12,ow[1]+14,P.s4); }
  b.vl(ow[0]+15,ow[1],ow[1]+ow[3]-1,P.m0); b.hl(ow[0],ow[0]+ow[2]-1,ow[1]+15,P.m0); b.vl(ow[0]+16,ow[1],ow[1]+ow[3]-1,P.m1);
  // Sprünge (Spinnennetz) und fehlende Scheibe
  var cx0=ow[0]+23, cy0=ow[1]+22; for (k=0;k<7;k++){ var ang=k/7*Math.PI*2+0.3, len=5+hash(k,4)*7; b.line(cx0,cy0,rnd(cx0+Math.cos(ang)*len),rnd(cy0+Math.sin(ang)*len),P.s4); }
  for (y=ow[1]+1;y<ow[1]+14;y++) for (x=ow[0]+1;x<ow[0]+14;x++) if (x-ow[0]+(y-ow[1])*0.6<9) OUTM[y*W+x]=1; else b.px(x,y,M.UP[b.get(x,y)]);
  // Lukas Stuhl am Fenster (Holz, Lehne links)
  var cx=LUKA[0], cy=LUKA[1]; b.rect(cx-6,cy-13,12,2,P.w3); b.hl(cx-6,cx+5,cy-13,P.w4); b.vl(cx-5,cy-11,cy,P.w1); b.vl(cx+4,cy-11,cy,P.w1); b.vl(cx-3,cy-11,cy-1,P.w0); b.rect(cx-7,cy-29,2,17,P.w2); b.vl(cx-7,cy-29,cy-13,P.w3); b.hl(cx-7,cx-3,cy-29,P.w3); b.hl(cx-7,cx-4,cy-22,P.w1);
  // Gitarrenkoffer? nein – der liegt im Kühlraum. Eine leere Flasche und Zigarettenstummel neben dem Stuhl
  b.rect(cx+9,cy-6,2,6,P.g2); b.px(cx+9,cy-7,P.g3); b.px(cx+10,cy-5,P.g4); b.px(cx-10,cy-1,P.s5); b.px(cx-12,cy,P.s5);
  // ---- Eismaschinen und Kompressoren unter der Galerie
  // großer liegender Ammoniakbehälter auf Sätteln
  for (y=86;y<104;y++) for (x=2;x<62;x++){ var u=(y-86)/18, cc=ra(R('k1 m0 m1 m2 m3 m4'),0.2+Math.pow(Math.sin(u*Math.PI),0.7)*0.8-(u>0.55?0.25:0),x,y); var rs=tex.rust(x,y,R('t0 t1 t2 t3')); if (fbm(x*0.15,y*0.3)<0.38) cc=rs; if (x===2||x===61) cc=P.k1; if (u>0.92) cc=P.k1; b.px(x,y,cc); }
  b.ellipse(62,95,3,9,function(x,y){ return ra(R('m0 m1 m2'),0.6-(y-86)/18*0.4,x,y); }); [12,48].forEach(function(sx){ b.rect(sx,104,8,10,P.m0); b.hl(sx,sx+7,104,P.m1); });
  for (x=4;x<60;x++) if (hash(x,1)<0.8) b.px(x,87,P.m3); for (x=8;x<58;x+=10){ b.px(x,89,P.m4); b.px(x,101,P.k1); } M.microText(b,'NH3',26,92,P.s4);
  // Kompressor mit Schwungrad und Riemen
  b.rect(70,90,26,24,P.m1); b.hl(70,95,90,P.m3); b.vl(95,90,113,P.m0); b.rect(72,84,10,6,P.m2); b.rect(84,84,10,6,P.m2); b.hl(72,81,84,P.m3); b.hl(84,93,84,P.m3);
  for (y=92;y<112;y+=4) b.hl(72,93,y,P.m0);
  b.ellipse(108,98,11,11,function(x,y){ var d=Math.hypot(x+0.5-108,y+0.5-98); if (d>9.5) return P.k1; if (d>8) return (Math.atan2(y-98,x-108)>0)?P.m1:P.m2; if (d<2) return P.m3; var a=Math.atan2(y-98,x-108)*3; return (Math.abs(Math.sin(a))<0.25)?P.m1:T; });
  b.line(96,96,104,88,P.k1); b.line(96,104,104,108,P.k1); b.rect(107,97,3,3,P.m3);
  // Ventile, Manometer, Rohre zur Galerie
  [[66,78],[84,76]].forEach(function(v){ b.ellipse(v[0],v[1],3,3,P.s5); b.px(v[0],v[1],P.k1); b.line(v[0],v[1],v[0]+2,v[1]-2,P.r2); b.vl(v[0],v[1]+3,v[1]+8,P.m1); });
  for (y=79;y<104;y++){ b.px(120,y,P.t1); b.px(121,y,P.t2); } b.ellipse(120.5,96,3,1.5,P.r3); b.hl(117,124,96,P.r2);
  // ---- die eingestürzte Treppe
  var sTop0=p3(ST.X0,GAL.Y,ST.Z0), sTop1=p3(ST.X0,GAL.Y,ST.Z1);
  function stairPt(t,Z){ return p3(ST.X0+(ST.X1-ST.X0)*t,GAL.Y+(FY-GAL.Y)*t,Z); }
  // Wangen (oberer Teil intakt bis t=0.56, darunter weggebrochen), Stufen mit Vorderkante
  for (var s=0;s<=80;s++){ var t=s/80; if (t>0.56) break; var a0=stairPt(t,ST.Z0), a1=stairPt(t,ST.Z1);
    for (var q=0;q<3;q++) b.px(rnd(a0[0]),rnd(a0[1])+1+q,q===0?P.w2:P.w0);
    for (q=0;q<4;q++) b.px(rnd(a1[0]),rnd(a1[1])+q,q===0?P.w4:(q===1?P.w3:(q===2?P.w2:P.w1))); }
  for (s=0;s<10;s++){ var ts=(s+0.6)/18; if (ts>0.54) break; var e0=stairPt(ts,ST.Z0), e1=stairPt(ts,ST.Z1), e2=stairPt(ts+0.03,ST.Z0), e3=stairPt(ts+0.03,ST.Z1);
    b.poly([[e0[0],e0[1]-1],[e1[0],e1[1]-1],[e3[0],e3[1]-1],[e2[0],e2[1]-1]],P.w2); b.line(rnd(e0[0]),rnd(e0[1])-1,rnd(e1[0]),rnd(e1[1])-1,P.w4); b.line(rnd(e0[0]),rnd(e0[1]),rnd(e1[0]),rnd(e1[1]),P.w1); }
  // abgebrochene Enden (splittrig), eine Stufe hängt schräg herab
  var br0=stairPt(0.56,ST.Z1), br1=stairPt(0.56,ST.Z0);
  [[0,0,3,5],[1,1,4,3],[0,2,2,7],[-1,3,1,6]].forEach(function(sp){ b.line(rnd(br0[0])+sp[0],rnd(br0[1])+sp[1],rnd(br0[0])+sp[2],rnd(br0[1])+sp[1]+sp[3],sp[0]<0?P.w1:P.w4); });
  b.line(rnd(br1[0]),rnd(br1[1])+1,rnd(br1[0])+2,rnd(br1[1])+6,P.w1); b.line(rnd(br1[0])+1,rnd(br1[1])+1,rnd(br1[0])+3,rnd(br1[1])+5,P.w2);
  b.line(rnd(br0[0])-3,rnd(br0[1])+1,rnd(br0[0])-8,rnd(br0[1])+13,P.w3); b.line(rnd(br0[0])-2,rnd(br0[1])+1,rnd(br0[0])-7,rnd(br0[1])+13,P.w1); b.line(rnd(br0[0])-7,rnd(br0[1])+13,rnd(br0[0])-2,rnd(br0[1])+14,P.w2);
  // Geländer der Treppe (oben noch da, unten abgerissen)
  var hr0=stairPt(0,ST.Z1), hr1=stairPt(0.42,ST.Z1); b.line(rnd(hr0[0]),rnd(hr0[1])-15,rnd(hr1[0]),rnd(hr1[1])-15,P.w3); b.line(rnd(hr0[0]),rnd(hr0[1])-14,rnd(hr1[0]),rnd(hr1[1])-14,P.w1); for (s=0;s<4;s++){ var hp=stairPt(s*0.13,ST.Z1); b.vl(rnd(hp[0]),rnd(hp[1])-14,rnd(hp[1]),P.w1); }
  b.line(rnd(hr1[0]),rnd(hr1[1])-15,rnd(hr1[0])+3,rnd(hr1[1])-6,P.w2);
  // Trümmer am Fuß der Treppe
  var r=M.rng(17); b.ellipse(181,117,17,4.5,function(x,y){ return hash(x,y)<0.5?P.s1:P.m1; }); for (i=0;i<22;i++){ var tx=164+r()*32, ty=108+r()*11, len=5+r()*11, an=(r()-0.5)*1.4; b.line(rnd(tx),rnd(ty),rnd(tx+Math.cos(an)*len),rnd(ty+Math.sin(an)*len*0.5),r()<0.5?P.w2:P.w1); if (r()<0.4) b.px(rnd(tx),rnd(ty)-1,P.w3); }
  for (i=0;i<30;i++){ var dx=168+r()*30, dy=113+r()*6; b.px(rnd(dx),rnd(dy),r()<0.5?P.s2:P.m1); }
  // ---- rechte Wand: Torrahmen (Ziegel), Kühlraumtür, Ladetor
  // Pfeiler zwischen Tür und Tor
  var pq=M.wallQuad(SPEC,'R',28,38,18,100); b.poly(pq,function(x,y){ return tex.bricks(x*1.5,y,R('t0 t1 t2 t3'),8,4); });
  b.line(rnd(pq[1][0]),rnd(pq[1][1]),rnd(pq[2][0]),rnd(pq[2][1]),P.t0);
  // lockerer Ziegel (oder das Loch)
  if (!S.brickOut){ b.poly([[BRICK[0][0]-1,BRICK[0][1]-1],[BRICK[1][0]+1,BRICK[1][1]-1],[BRICK[2][0]+1,BRICK[2][1]+1],[BRICK[3][0]-1,BRICK[3][1]+1]],P.k0); b.poly(BRICK,P.t4); b.line(rnd(BRICK[0][0]),rnd(BRICK[0][1]),rnd(BRICK[1][0]),rnd(BRICK[1][1]),P.t4); b.line(rnd(BRICK[3][0]),rnd(BRICK[3][1])+1,rnd(BRICK[2][0]),rnd(BRICK[2][1])+1,P.k1); b.px(rnd(BRICK[1][0])+1,rnd(BRICK[1][1])+1,P.k1); }
  else { b.poly(BRICK,P.k0); b.px(rnd(BRICK[0][0])+1,rnd(BRICK[0][1])+1,P.k1); var fb=p3(184,FY,34); b.rect(rnd(fb[0]),rnd(fb[1])-2,5,2,P.t3); b.hl(rnd(fb[0]),rnd(fb[0])+4,rnd(fb[1])-2,P.t4); b.px(rnd(fb[0])+5,rnd(fb[1])-1,P.t1); }
  // Kühlraumtür: dick isoliert, Blech mit Nieten, großer Hebel
  var dq=DOORQ; var open=!!S.coldOpen;
  var frame=M.wallQuad(SPEC,'R',3,31,39,100); b.poly(frame,function(x,y){ return (x+y)%3?P.m0:P.k1; }); var fr2=M.wallQuad(SPEC,'R',4.5,29.5,41,100); b.poly(fr2,P.e2);
  // Türblatt (zu oder einen Spalt offen: Riegelseite links schwingt in die Halle, dahinter Dunkelheit)
  var leaf=open?[M.wallPt(SPEC,'R',11,44),dq[1],dq[2],M.wallPt(SPEC,'R',11,100)]:dq;
  if (open){ b.poly([dq[0],M.wallPt(SPEC,'R',11,44),M.wallPt(SPEC,'R',11,100),dq[3]],P.k0); }
  b.poly(leaf,function(x,y){ var c=ra(R('m0 m1 m2 m3'),0.7-(y-44)/80*0.35+(fbm(x*0.4,y*0.1)-0.5)*0.4,x,y); if (fbm(x*0.2,y*0.05)>0.66) c=tex.rust(x,y,R('t0 t1 t2 m1')); return c; });
  for (k=0;k<8;k++){ var ry0=48+k*8; var rl=M.wallPt(SPEC,'R',open?13:8,ry0), rr=M.wallPt(SPEC,'R',26,ry0); b.px(rnd(rl[0]),rnd(rl[1]),P.m4); b.px(rnd(rr[0]),rnd(rr[1]),P.m0); }
  var hg=[M.wallPt(SPEC,'R',27,56),M.wallPt(SPEC,'R',27,88)]; hg.forEach(function(h){ b.rect(rnd(h[0])-1,rnd(h[1])-2,3,5,P.m0); b.px(rnd(h[0]),rnd(h[1])-1,P.m3); });
  var lv=M.wallPt(SPEC,'R',open?14:9,72); b.rect(rnd(lv[0])-1,rnd(lv[1])-3,4,7,P.m0); b.line(rnd(lv[0])+1,rnd(lv[1]),rnd(lv[0])+8,rnd(lv[1])-(open?2:6),P.m4); b.line(rnd(lv[0])+1,rnd(lv[1])+1,rnd(lv[0])+8,rnd(lv[1])-(open?1:5),P.m2); b.rect(rnd(lv[0])+7,rnd(lv[1])-(open?4:8),3,3,P.k1);
  var sg=M.wallPt(SPEC,'R',14,52); b.rect(rnd(sg[0]),rnd(sg[1]),11,7,P.s5); M.microText(b,'-18',rnd(sg[0])+1,rnd(sg[1])+1,P.b0);
  if (open){ var e0=M.wallPt(SPEC,'R',11,44), e1=M.wallPt(SPEC,'R',11,100); b.line(rnd(e0[0])-1,rnd(e0[1])+1,rnd(e1[0])-1,rnd(e1[1])-1,P.m4); b.line(rnd(e0[0])-2,rnd(e0[1])+2,rnd(e1[0])-2,rnd(e1[1])-2,P.m2); }
  // Ladetor: Laufschiene oben, Torflügel zurückgeschoben (rostig)
  var g0=M.wallPt(SPEC,'R',38,20), g1=M.wallPt(SPEC,'R',140,20); b.line(rnd(g0[0]),rnd(g0[1]),rnd(g1[0]),rnd(g1[1]),P.k1); b.line(rnd(g0[0]),rnd(g0[1])-1,rnd(g1[0]),rnd(g1[1])-1,P.m1);
  // ---- Blick nach draußen durch das Tor
  for (y=0;y<H;y++) for (x=228;x<W;x++){ if (!inGate(x,y)) continue; b.px(x,y,OUT.get(x,y)); OUTM[y*W+x]=1; }
  // Torpfosten (Schatten) und Schwelle aus Stahl
  for (y=0;y<H;y++){ var gl=M.wallPt(SPEC,'R',38,22)[0]; } b.line(234,12,234,122,P.k1); b.line(235,12,235,122,P.m0);
  var th0=M.wallPt(SPEC,'R',38,100), th1=M.wallPt(SPEC,'R',90,100); b.line(rnd(th0[0]),rnd(th0[1]),rnd(th1[0]),rnd(th1[1]),P.m2); b.line(rnd(th0[0]),rnd(th0[1])+1,rnd(th1[0]),rnd(th1[1])+1,P.k1);
  // ---- Pfütze, Paletten, Federn, Taubendreck
  var PUD=[146,129,24,4.2]; b.ellipse(PUD[0],PUD[1],PUD[2],PUD[3],function(x,y){ var v=(y-PUD[1]+PUD[3])/(2*PUD[3]); return night?(((x+y)%5===0)?P.n1:P.k1):((x*3+y)%7<2?P.s3:P.m1); }); OUTM[0]=0;
  for (i=0;i<40;i++){ var px=rnd(hash(i,51)*300+10), py=rnd(102+hash(i,52)*38); if (inGate(px,py)) continue; b.px(px,py,hash(i,53)<0.6?P.s5:P.s4); }
  // ---- Licht
  var beams=[[60,0,104,130,4,13],[142,0,188,128,4,14],[204,0,232,116,3,9]];
  function beamV(x,y){ var v=0; beams.forEach(function(bm){ var vx=bm[2]-bm[0], vy=bm[3]-bm[1], L2=vx*vx+vy*vy, t=((x-bm[0])*vx+(y-bm[1])*vy)/L2; if (t<0||t>1) return; var qx=bm[0]+vx*t, qy=bm[1]+vy*t, d=Math.hypot(x-qx,y-qy), w=bm[4]+(bm[5]-bm[4])*t; if (d<w){ var e=Math.min(1,(1-d/w)*1.8); v=Math.max(v,e*(0.5+0.5*t)); } }); return v; }
  function spots(x,y){ var v=0; beams.forEach(function(bm){ var dy=(y-bm[3])/(bm[5]*0.45); if (Math.abs(dy)>1) return; var dx=(x-bm[2]-dy*bm[5]*0.6)/(bm[5]*1.5); if (Math.abs(dx)>1) return; var e=Math.min(1,(1-Math.abs(dx))*3)*Math.min(1,(1-Math.abs(dy))*3); v=Math.max(v,e); }); return v; }
  function gateSpill(x,y){ if (y<100) return 0; var dx=(x-252)/56, dy=(y-128)/16, q=dx*dx+dy*dy; return q<1?(1-q):0; }
  function underGal(x,y){ var f=R3.floor(x,y); if (!f) return 0; if (y>=78 && f.X<GAL.X1+4 && f.Z<GAL.Z1) return 1; return (y>=78 && y<120 && x<132)?0.6:0; }
  var LF=function(x,y){ var v=night?-0.5:-1.3; v+=beamV(x,y)*(night?1.4:2.7)+spots(x,y)*(night?1.3:2.4)+gateSpill(x,y)*(night?0.8:2.0); v-=underGal(x,y)*(night?0.45:0.75); var vx=(x-170)/230, vy=(y-80)/120; v-=Math.max(0,vx*vx+vy*vy-0.3)*2.2; return v; };
  M.light(b,LF,0,0,function(x,y){ return !OUTM[y*W+x]; });
  if (night) finishNight(b,OUTM,function(x,y){ return beamV(x,y)*0.85+spots(x,y)*0.9+gateSpill(x,y)*0.75; });
  // nach dem Licht: Pfütze spiegelt (Mond/Oberlicht), Lichtkante am Tor
  for (x=PUD[0]-PUD[2]+3;x<PUD[0]+PUD[2]-3;x+=1){ var yy=PUD[1]+Math.round(Math.sin(x*0.5)*0.6); if (hash(x,7)<0.4) b.px(x,yy,night?P.n3:P.s5); }
  DYN={OUTM:OUTM,night:night};
  return b; }

// ---------------------------------------------------------------- Ebenen: Geländer der Galerie (vor Luka/Mala), Paletten vorn links
function layers(S,GS,tod){ var L=[], night=tod==='night';
  var g=M.layer(0,40,140,36,73.5), w=M.lw(g); var f0=p3(GAL.X0-40,GAL.Y,GAL.Z1), f1=p3(GAL.X1,GAL.Y,GAL.Z1), top=46, mid=58, yb=rnd(f1[1]);
  var x1=rnd(f1[0]);
  for (var x=0;x<=x1;x++){ var bent=(x>104&&x<122); var ty=top+(bent?Math.round((x-104)*0.5):0); w.px(x,ty,P.m3); w.px(x,ty+1,P.m1); if (!(x>70&&x<84)) { w.px(x,mid,P.m2); w.px(x,mid+1,P.m0); } }
  for (x=2;x<=x1;x+=14){ if (x>72&&x<84) continue; w.vl(x,top,yb,P.m1); w.vl(x+1,top,yb,P.m0); }
  w.line(84,mid,90,mid+8,P.m2); w.line(70,mid,66,mid+6,P.m2);
  if (night) M.tintApply(g,NIGHTA); else M.light(g,M.lf.k(-0.5),g.ox,g.oy);
  L.push(g);
  var p=M.layer(0,112,70,32,142), pw=M.lw(p);
  for (var k=0;k<3;k++){ var px0=4+k*3, py0=128-k*7; pw.rect(px0,py0,44,3,P.w3); pw.hl(px0,px0+43,py0,P.w4); pw.hl(px0,px0+43,py0+2,P.w1); for (var bx=px0+2;bx<px0+44;bx+=13) pw.rect(bx,py0+3,5,4,P.w2); }
  pw.line(48,140,62,124,P.w2); pw.line(49,140,63,124,P.w1); pw.line(40,141,54,134,P.w3); pw.rect(10,138,30,4,P.w1); pw.hl(10,39,138,P.w2);
  if (night) M.tintApply(p,NIGHTA); else M.light(p,M.lf.k(-0.8),p.ox,p.oy);
  L.push(p);
  return L; }

// ---------------------------------------------------------------- dynamisch: Wasser draußen, Fähre, Tauben, Staub, Tropfen
function ferryX(S,v){ var base=262; if (S.ferryGo){ var dt=(v.gt-S.ferryGo)/1000; if (dt>0) base+=Math.pow(dt,1.4)*0.9; } return base; }
function drawFerry(fb,x0,wy,night){ // große Fähre, Bug nach rechts
  var Wd=58, hull=night?P.n2:P.s5, hull2=night?P.n1:P.s4, sup=night?P.n2:P.s6, dk=night?P.k1:P.n1;
  function px(x,y,c){ if (x<0||x>=W||y<0||y>=H) return; if (!DYN.OUTM[y*W+x]||!inGate(x,y)) return; if (y>=HZ+1 && !(x>=228)) return; fb.d[y*W+x]=c; }
  for (var i=0;i<Wd;i++){ var t=i/(Wd-1), top=wy-9+Math.round(Math.pow(Math.max(0,t-0.8)/0.2,2)*-2), bot=wy-(t>0.88?Math.round((t-0.88)/0.12*5):0); for (var y=top;y<=bot;y++) px(x0+i,y,y>bot-2?(night?P.k2:P.b0):(y<top+2?sup:hull)); px(x0+i,top+4,night?P.b0:P.b1); }
  for (i=6;i<48;i++){ px(x0+i,wy-11,sup); px(x0+i,wy-12,sup); px(x0+i,wy-10,hull2); }
  for (i=12;i<40;i++){ px(x0+i,wy-14,sup); px(x0+i,wy-13,hull2); }
  for (var y2=wy-19;y2<wy-14;y2++) for (i=26;i<32;i++) px(x0+i,y2,night?P.r2:P.r3);
  px(x0+28,wy-20,P.k1); px(x0+29,wy-20,P.k1);
  if (night){ for (i=4;i<54;i+=2){ px(x0+i,wy-7,hash(i,3)<0.75?P.y4:P.y2); if (i>8&&i<46) px(x0+i,wy-11,hash(i,4)<0.7?P.y5:P.y3); if (i>14&&i<38) px(x0+i,wy-13,hash(i,5)<0.6?P.y4:P.n1); }
    px(x0+Wd-1,wy-9,P.g5); px(x0+1,wy-9,P.r4); px(x0+30,wy-21,P.l1); px(x0+30,wy-22,P.y5); }
  else { for (i=8;i<50;i+=3) px(x0+i,wy-6,P.n1); for (i=10;i<46;i+=3) px(x0+i,wy-11,P.n1); } }
function dyn(fb,v,S,GS){ if (!DYN) return; var t=v.t, night=v.tod==='night', D=DYN, x, y;
  // Wasser draußen (im Tor) animieren
  for (y=HZ+2;y<H;y++) for (x=228;x<W;x++){ var o=y*W+x; if (!D.OUTM[o]) continue; if (x<=rampOuter(y)) continue; var d=(y-HZ)/(H-HZ);
    var s=Math.sin(x*0.21+y*1.1+t*1.9)+Math.sin(x*0.07-t*1.1+y*0.4)*0.8+Math.sin(x*0.4+y*2.4-t*3.2)*0.5;
    var c=night?M.rampAt(R('k0 a0 a1 n0 n1'),0.62-d*0.55+s*0.1,x,y):M.rampAt(R('n1 b0 a2 a3 b2 a4'),0.82-d*0.62+s*0.1,x,y); if (s>1.9 && ((x+y)&1)) c=night?P.n2:(d<0.3?P.b4:P.s6); fb.d[o]=c; }
  // Fähre (und ihre Spiegelung)
  var fx=Math.round(ferryX(S,v)); if (fx<W+4){ drawFerry(fb,fx,HZ+3,night);
    if (night){ for (var ci=0;ci<9;ci++){ var cx=fx+6+ci*6+Math.round(Math.sin(t*0.7+ci)*0.6); for (y=HZ+5;y<HZ+46;y++){ var k=(y-HZ-5)/41, f=Math.sin(y*1.7+t*2.6+ci*1.3)+0.7*Math.sin(y*0.53-t*1.2+ci); if (f<0.75+k*0.55) continue; var half=Math.round(0.5+k*2.6*(0.6+0.4*Math.sin(y*0.9+ci))), sh=Math.round(Math.sin(y*0.31+t+ci)*k*2);
        for (x=cx-half+sh;x<=cx+half+sh;x++){ if (x<228||x>=W) continue; var o2=y*W+x; if (!D.OUTM[o2]||x<=rampOuter(y)) continue; fb.d[o2]=(f>1.5&&k<0.5)?P.y5:((ci+y)%3?P.y4:P.y3); } } } }
    else { for (y=HZ+4;y<HZ+9;y++) for (x=Math.max(228,fx+2);x<Math.min(W,fx+56);x++){ var o3=y*W+x; if (!D.OUTM[o3]||x<=rampOuter(y)) continue; if (bayer(x,y)<0.5-(y-HZ-4)*0.1 && Math.sin(x*0.5+t*2+y)>0) fb.d[o3]=P.a5; } } }
  // Lichter am Ufer funkeln
  if (night){ for (var i=0;i<6;i++){ var lx=230+Math.floor(hash(i,8)*88), ly=HZ-1; if (Math.sin(t*2.3+i*1.7)>0.6 && D.OUTM[ly*W+lx]) fb.d[ly*W+lx]=P.y5; } }
  // Tauben (Tag): flattern durch die Halle, zwei sitzen auf dem Geländer
  if (!night){ for (i=0;i<4;i++){ var ph=t*0.25+i*1.6, px0=Math.round(160+Math.sin(ph)*140+Math.sin(ph*2.3)*12), py0=Math.round(30+Math.sin(ph*1.7+i)*16+i*5), fl=Math.floor(t*10+i*3)%2;
      fb.px(px0,py0,P.m3); fb.px(px0+1,py0,P.m2); fb.px(px0-1,py0-(fl?1:0),P.m3); fb.px(px0+2,py0-(fl?1:0),P.m3); fb.px(px0-2,py0-(fl?2:-1),P.m2); fb.px(px0+3,py0-(fl?2:-1),P.m2); }
    [[30,45],[54,45]].forEach(function(pg,j){ var hb=Math.sin(t*1.3+j*2)>0.7?1:0; fb.px(pg[0],pg[1]-1,P.m3); fb.px(pg[0]+1,pg[1]-1,P.m2); fb.px(pg[0]+2,pg[1]-2-hb,P.m3); fb.px(pg[0]-1,pg[1]-1,P.m1); fb.px(pg[0]+2,pg[1]-1,P.m2); }); }
  // Staub in den Lichtstreifen
  var beams=[[60,0,104,130],[142,0,188,128],[204,0,232,116]];
  for (i=0;i<36;i++){ var bm=beams[i%3], u=(hash(i,1)+t*0.01*(0.5+hash(i,2)))%1, xx=Math.round(bm[0]+(bm[2]-bm[0])*u+(hash(i,3)-0.5)*10+Math.sin(t*0.6+i)*2), yy=Math.round(bm[1]+(bm[3]-bm[1])*u); if (Math.sin(t*1.5+i*1.9)>0.1) fb.px(xx,yy,night?P.n3:P.s5); }
  // Tropfen in die Pfütze
  var dp=(t*0.45)%1, rr=dp*7; if (dp<0.7){ for (var a=0;a<12;a++){ var ang=a/12*Math.PI*2; fb.px(Math.round(150+Math.cos(ang)*rr),Math.round(129+Math.sin(ang)*rr*0.3),night?P.n3:P.s4); } }
  if (dp>0.85){ fb.px(150,Math.round(40+(dp-0.85)/0.15*88),night?P.n3:P.s4); } }
// ---------------------------------------------------------------- Geistersicht: Ninas Zettel hinter dem Ziegel schimmert
function ghost(fb,v,S,GS){ if (S.brickOut) return; var t=v.t, c=[(BRICK[0][0]+BRICK[2][0])/2,(BRICK[0][1]+BRICK[2][1])/2];
  for (var a=0;a<20;a++){ var ang=a/20*Math.PI*2, rr=5+Math.sin(t*2+a)*0.8; if (Math.sin(ang*3+t*2.5)>0) fb.px(Math.round(c[0]+Math.cos(ang)*rr*0.7),Math.round(c[1]+Math.sin(ang)*rr*0.6),P.x4); }
  var x0=Math.round(c[0])-2, y0=Math.round(c[1])-1; fb.hl(x0,x0+4,y0,P.x6); fb.hl(x0,x0+4,y0+2,P.x5); fb.px(x0,y0+1,P.x5); fb.px(x0+4,y0+1,P.x5); fb.px(x0+2,y0+1,P.x4); }

// ---------------------------------------------------------------- Laufflächen
function walk(x,y,S,GS){ if (y<108||y>=139||x<4) return false; var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z;
  if (X>192){ return X<=232 && Z>=41 && x<316; }                       // durch das Tor auf die Rampe
  if (X<GAL.X1+2 && Z<GAL.Z1+3) return false;                          // unter der Galerie (Maschinen)
  if (X>=ST.X0-2 && X<ST.X1+22 && Z<ST.Z1+5) return false;             // unter der Treppe, Trümmer
  if (X<36) return false;
  return true; }
// nur Mala: die Treppe als Rampe und die Galerie
var SB=[p3(ST.X0-3,GAL.Y,24),p3(ST.X1+3,FY,24)];
function walkG(x,y,S,GS){
  if (y>=66 && y<73){ var xr=GAL.X1+(y-66)*(130.8-124)/6.8; if (x>=4 && x<=xr) return true; }
  var ax=SB[0][0], ay=SB[0][1], bx=SB[1][0], by=SB[1][1], vx=bx-ax, vy=by-ay, L2=vx*vx+vy*vy, t=((x-ax)*vx+(y-ay)*vy)/L2; if (t<0||t>1.08) return false;
  var qx=ax+vx*t, qy=ay+vy*t; return Math.hypot(x-qx,y-qy)<4.2; }
function actorLut(a,S,GS,tod){ if (a.ghost) return undefined; var inside=a.x<236||a.y>136; if (tod==='night') return inside?NIGHTA.a:MOONT.a; return inside?HALL.a:undefined; }
var dqx=[DOORQ[0][0],DOORQ[1][0],DOORQ[2][0],DOORQ[3][0]], dqy=[DOORQ[0][1],DOORQ[1][1],DOORQ[2][1],DOORQ[3][1]];
var DOORR=[Math.floor(Math.min.apply(null,dqx)),Math.floor(Math.min.apply(null,dqy)),Math.ceil(Math.max.apply(null,dqx)-Math.min.apply(null,dqx)),Math.ceil(Math.max.apply(null,dqy)-Math.min.apply(null,dqy))];
var BR=[Math.floor(Math.min(BRICK[0][0],BRICK[3][0]))-1,Math.floor(Math.min(BRICK[0][1],BRICK[1][1]))-1,5,6];
M.defineArt('ledana',{
  width:W, paint:paint, layers:layers, walk:walk, walkG:walkG, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{ exit:[0,96,12,48], stairs:[124,62,64,58], gallery:[0,42,132,38], office_window:[OWIN[0]-3,OWIN[1]-3,OWIN[2]+6,OWIN[3]+6], machines:[0,76,124,40], pipes:[124,58,72,10],
    graffiti:[124,66,72,34], puddle:[122,124,48,10], pallets:[2,114,64,28], colddoor:DOORR, gate:[230,4,90,120], ramp:[238,110,82,34], brick:BR, harbor_view:[240,10,80,44] },
  stands:{ exit:[10,128,'L'], stairs:[194,124,'L'], gallery:[110,124,'B'], office_window:[120,124,'B'], machines:[70,126,'L'], pipes:[160,124,'B'], graffiti:[160,124,'B'], puddle:[150,136,'B'],
    pallets:[40,134,'L'], colddoor:[208,113,'R'], gate:[230,128,'R'], ramp:[262,126,'R'], brick:[222,120,'R'], harbor_view:[262,126,'R'] },
  actorPos:{ luka:[LUKA[0],LUKA[1],'R','luka',1,'guitarSit'], nina:[NINA[0],NINA[1],'R','nina'] },
  start:[30,128,'R'], entries:{ matejuska:[18,128,'R'], coldroom:[208,113,'L'] }
});
})(M);
