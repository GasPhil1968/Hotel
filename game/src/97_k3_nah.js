/* ===== 97_k3_nah.js — Kapitel 3, Grafikpunkt 11: Nahaufnahmen für Schlüsselmomente.
   Große Bilder in derselben Pixelgröße und Palette wie die Räume (mit den Mostar-Rampen aus 00_core.js), über der ganzen Szene, während
   die Sätze des Moments laufen; sie blenden gerastert ein und aus. Die Texte stehen dabei oben, ohne Brustbild.
     glocke   Samstagnacht, das erste Läuten: die alte Fährglocke, Markos Hand am Seil, drüben das Licht im Schuppen
     haende   Finale: „Ich habe dich unter die Quitte gelegt. Mit diesen Händen.“ – Batos Hände im Licht der Laterne
     laterne  Finale: „Zvono.“ – Zlata hebt die Sturmlaterne am Schuppen
     quitte   Finale: Mala unter dem Quittenbaum, das Brett im Reif
     scheitel Epilog: „Tief unten.“ – vom Scheitel der Alten Brücke hinunter zur Neretva, Malas Hände auf der Brüstung (Dino springt erst danach, im Raum)
   M.k3Close(A, id, fn): zeigt das Bild, spielt fn() und blendet aus; ohne Bildschirm (Tests) oder abgeschaltet nur fn(). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash, W=320, H=144;
function R(s){ return s.split(' ').map(function(n){ if (P[n]===undefined) throw new Error('keine Farbe '+n); return P[n]; }); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function rd(v){ return Math.round(v); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), fx=x-xi, fy=y-yi, h=function(a,b){ return hash(a*1.37+s*7.1,b*1.91+s*3.3); }; fx=fx*fx*(3-2*fx); fy=fy*fy*(3-2*fy);
  var a=h(xi,yi), b=h(xi+1,yi), c=h(xi,yi+1), d=h(xi+1,yi+1); return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
// warmes Licht: Pixel um (cx,cy) gerastert heller, innen zwei Stufen
function glow(b,cx,cy,r,k,col){ for (var y=Math.floor(cy-r);y<=cy+r;y++) for (var x=Math.floor(cx-r);x<=cx+r;x++){ if (x<0||y<0||x>=b.w||y>=b.h) continue; var d=Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy))/r; if (d>=1) continue;
    var a=(1-d)*(1-d)*k, kk=y*b.w+x; if (bayer(x,y)<a){ var c=b.d[kk]; if (c===T) continue; b.d[kk]=col?M.mix(c,col,Math.min(6,1+Math.round(a*6))):M.UP[c]; if (a>0.6 && bayer(x+2,y+1)<a-0.4) b.d[kk]=M.UP[b.d[kk]]; } } }
// Formen aus Grundkörpern (Kreis, Ellipse, Kapsel), schattiert über den Abstand zum Rand und eine Lichtrichtung, mit dunkler Kontur.
// Für Hände, Finger, Ärmel: lesbar statt Kleckse. o: {ramp, light:[lx,ly], alpha (Geist: Rand gerastert), outline, flat}
function inPart(q,x,y){ if (q.cap){ var a=q.cap, dx=a[2]-a[0], dy=a[3]-a[1], L=dx*dx+dy*dy||1, t=cl(((x-a[0])*dx+(y-a[1])*dy)/L,0,1), px=a[0]+dx*t, py=a[1]+dy*t; return (x-px)*(x-px)+(y-py)*(y-py)<=q.r*q.r; }
  if (q.ell){ var e=q.ell, u=(x-e[0])/e[2], v=(y-e[1])/e[3]; return u*u+v*v<=1; } return false; }
function shape(fb,parts,o){ var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; parts.forEach(function(q){ var bx=q.cap?[Math.min(q.cap[0],q.cap[2])-q.r,Math.min(q.cap[1],q.cap[3])-q.r,Math.max(q.cap[0],q.cap[2])+q.r,Math.max(q.cap[1],q.cap[3])+q.r]:[q.ell[0]-q.ell[2],q.ell[1]-q.ell[3],q.ell[0]+q.ell[2],q.ell[1]+q.ell[3]]; x0=Math.min(x0,bx[0]); y0=Math.min(y0,bx[1]); x1=Math.max(x1,bx[2]); y1=Math.max(y1,bx[3]); });
  x0=Math.floor(x0)-2; y0=Math.floor(y0)-2; x1=Math.ceil(x1)+2; y1=Math.ceil(y1)+2; var w=x1-x0+1, h=y1-y0+1, m=new Int16Array(w*h), id=new Int8Array(w*h);
  for (var y=0;y<h;y++) for (var x=0;x<w;x++){ for (var i=0;i<parts.length;i++) if (inPart(parts[i],x+x0+0.5,y+y0+0.5)){ m[y*w+x]=99; id[y*w+x]=i; break; } }
  // Abstand zum Rand (bis 5)
  for (var d=1;d<=5;d++) for (var y2=0;y2<h;y2++) for (var x2=0;x2<w;x2++){ var k=y2*w+x2; if (m[k]!==99) continue; var nb=[x2>0?m[k-1]:0,x2<w-1?m[k+1]:0,y2>0?m[k-w]:0,y2<h-1?m[k+w]:0]; for (var n=0;n<4;n++) if (nb[n]===d-1){ m[k]=d; break; } }
  var L=o.light||[-0.6,-0.8], R=o.ramp;
  for (var y3=0;y3<h;y3++) for (var x3=0;x3<w;x3++){ var k3=y3*w+x3, dv=m[k3]; if (!dv) continue; var X=x3+x0, Y=y3+y0; if (X<0||Y<0||X>=fb.w||Y>=fb.h) continue;
    var gx=((x3<w-1?Math.min(6,m[k3+1]):0)-(x3>0?Math.min(6,m[k3-1]):0)), gy=((y3<h-1?Math.min(6,m[k3+w]):0)-(y3>0?Math.min(6,m[k3-w]):0)), gl=Math.sqrt(gx*gx+gy*gy)||1;
    var ed=Math.min(dv,5)/5, lit=(o.flat?0.55:0.5)+(-(gx*L[0]+gy*L[1])/gl)*0.38*(1-ed*0.7)+(o.grad?o.grad(X,Y):0);
    if (dv===99) lit=0.55; var c=ra(R,cl(lit,0,1),X,Y);
    if (o.alpha && dv<=2 && bayer(X,Y)<0.35) continue; fb.px(X,Y,c); }
  if (o.outline!==false){ var oc=o.outline||P.k1; for (var y4=0;y4<h;y4++) for (var x4=0;x4<w;x4++){ var k4=y4*w+x4; if (m[k4]) continue; var adj=(x4>0&&m[k4-1])||(x4<w-1&&m[k4+1])||(y4>0&&m[k4-w])||(y4<h-1&&m[k4+w]); if (adj && !(o.alpha && bayer(x4+x0,y4+y0)<0.5)) fb.px(x4+x0,y4+y0,oc); } }
  return {x0:x0,y0:y0,w:w,h:h,m:m,id:id}; }
// Hand, Handfläche nach oben (Finger vom Betrachter weg, leicht gefächert); flip: linke Hand
function handUp(fb,cx,cy,s,flip,R,line,o){ var f=flip?-1:1, parts=[{ell:[cx,cy,13*s,11*s]}];
  [[-8,-24,-1.5],[-3,-28,-0.5],[2.5,-27,0.5],[7.5,-22,1.4]].forEach(function(q){ var bx=cx+f*q[0]*s, by=cy-7*s; parts.push({cap:[bx,by,bx+f*q[2]*s*2,cy+q[1]*s],r:2.6*s}); });
  parts.push({cap:[cx+f*11*s,cy+4*s,cx+f*19*s,cy-6*s],r:3*s});
  var sh=shape(fb,parts,Object.assign({ramp:R},o||{}));
  // Gelenkfalten, Handlinien
  [[-8,-24,-1.5],[-3,-28,-0.5],[2.5,-27,0.5],[7.5,-22,1.4]].forEach(function(q){ for (var j=1;j<=2;j++){ var t=j/3, bx=cx+f*q[0]*s+(f*q[2]*s*2)*t, by=cy-7*s+((cy+q[1]*s)-(cy-7*s))*t; for (var k=-2;k<=1;k++) fb.px(rd(bx+k*s*0.8),rd(by),line); } });
  for (var a=0;a<10;a++){ fb.px(rd(cx+f*(-8+a*1.6)*s),rd(cy-2*s+Math.sin(a*0.3)*2*s),line); fb.px(rd(cx+f*(-6+a*1.3)*s),rd(cy+3*s+Math.sin(a*0.4+1)*1.5*s),line); }
  return sh; }
// Faust um ein senkrechtes Seil oder einen Bügel (von der Seite): vier Fingerrollen, Daumen darüber, Handgelenk
function fist(fb,cx,cy,s,dir,R,line){ var parts=[], d=dir||1; for (var i=0;i<4;i++){ var y=cy-4.5*s+i*3*s; parts.push({cap:[cx-5*s*d,y,cx+3*s*d,y+0.4*s],r:1.8*s}); }
  parts.push({cap:[cx-3*s*d,cy-6.5*s,cx+5*s*d,cy-5*s],r:1.9*s}); parts.push({cap:[cx-7*s*d,cy-3*s,cx-9*s*d,cy+8*s],r:3.6*s});
  shape(fb,parts,{ramp:R,light:[-0.5*d,-0.85]}); for (var i2=1;i2<4;i2++){ var y2=rd(cy-4.5*s+i2*3*s-1.5*s); for (var x=-3;x<=2;x++) fb.px(rd(cx+x*s*d),y2,line); } }
// Hand von oben, flach aufgelegt (Handrücken): Finger nach oben
function handFlat(fb,cx,cy,s,flip,R,line,o){ var f=flip?-1:1, parts=[{ell:[cx,cy,9*s,8*s]}];
  [[-6,-15],[-2,-18],[2,-17],[6,-13]].forEach(function(q){ parts.push({cap:[cx+f*q[0]*s,cy-5*s,cx+f*q[0]*s*1.1,cy+q[1]*s],r:1.9*s}); });
  parts.push({cap:[cx+f*8*s,cy+2*s,cx+f*14*s,cy-5*s],r:2.2*s});
  var sh=shape(fb,parts,Object.assign({ramp:R,light:[-0.4,-0.9]},o||{}));
  [[-6,-15],[-2,-18],[2,-17],[6,-13]].forEach(function(q){ var bx=cx+f*q[0]*s, y=rd(cy-5*s+((q[1]+5)*s)*0.45); fb.px(rd(bx),y,line); fb.px(rd(bx+f*s*0.6),y,line); }); return sh; }
// Ärmel: gerippter Strick oder Mantelstoff zwischen zwei Punkten
function sleeve(fb,x0,y0,x1,y1,r,R,rib){ shape(fb,[{cap:[x0,y0,x1,y1],r:r}],{ramp:R,light:[-0.5,-0.8],grad:rib?function(X,Y){ return ((X+Y*2)%5<2)?0.1:0; }:null}); }
function sky(b,y0,y1,r,seed,stars){ for (var y=y0;y<y1;y++) for (var x=0;x<W;x++) b.px(x,y,ra(r,(y-y0)/(y1-y0)*0.85+(fbm(x*0.02,y*0.05,seed)-0.5)*0.12,x,y));
  if (stars) for (var i=0;i<stars;i++){ var sx=Math.floor(hash(i,seed)*W), sy=Math.floor(Math.pow(hash(i,seed+1),1.5)*(y1-y0)*0.7)+y0; b.px(sx,sy,hash(i,seed+2)<0.15?P.n5:(hash(i,seed+3)<0.5?P.n4:P.n3)); } }
// Hand von oben gesehen, Handfläche nach oben (für Batos Hände): Ballen, vier Finger, Daumen; Farben über eine Rampe, Licht von links
function palmUp(b,cx,cy,s,flip,ramp,lineC,lightX){ var f=flip?-1:1, pts=[];
  for (var y=Math.floor(cy-12*s);y<=cy+14*s;y++) for (var x=Math.floor(cx-17*s);x<=cx+17*s;x++){ var u=(x-cx)/(16*s), v=(y-cy-2*s)/(12*s), inPalm=u*u+v*v<1;
      var fing=false, ff=-1; for (var i=0;i<4;i++){ var fx=cx+f*(-9+i*6)*s, fl=(i===0||i===3?15:19)*s, fy0=cy-10*s; if (Math.abs(x-fx)<=2.6*s && y<=fy0+2 && y>=fy0-fl){ var tip=fy0-fl+2.6*s; if (y<tip && (x-fx)*(x-fx)+(y-tip)*(y-tip)>6.8*s*s) continue; fing=true; ff=i; } }
      var thumb=false, tx=cx+f*15*s, ty=cy+2*s; var du=(x-tx)*0.6-(y-ty)*0.8*f, dv=(x-tx)*0.8*f+(y-ty)*0.6; if (Math.abs(dv)<=3*s && du>-2*s && du<13*s) thumb=true;
      if (!inPalm && !fing && !thumb) continue;
      var lt=0.55+(x<lightX?0.18:-0.08)-(y-cy)/(40*s)*0.3+(fbm(x*0.3,y*0.3,4)-0.5)*0.18; if (fing){ var fx2=cx+f*(-9+ff*6)*s; lt+=((x-fx2)*(-f))*0.04; }
      var c=ra(ramp,cl(lt,0,1),x,y);
      if (inPalm && !fing){ var l1=Math.abs((y-cy+3*s)-(x-cx)*0.25*f), l2=Math.abs((y-cy-4*s)+(x-cx)*0.3*f); if ((l1<0.6&&Math.abs(u)<0.75)||(l2<0.6&&Math.abs(u)<0.6)) c=lineC; }
      if (fing && ((y+Math.round(cx))%7===0)) c=lineC;
      b.px(x,y,c); } }

// ---------------------------------------------------------------- 1 Glocke (Skela, Samstagnacht)
var GLO={bx:212, top:34, bot:98, piv:28};
function belR(t){ var sh=1-Math.pow(1-Math.min(1,t/0.2),2); return 9+7*sh+4*t+(t>0.55?Math.pow((t-0.55)/0.45,1.8)*13:0); }   // Haube, Schulter, Flanke, Schlagring
function paintGlocke(b){ sky(b,0,92,R('k0 k1 n0 n1 n2'),11,110);
  // drüben das Ufer, ein Licht im Schuppen
  for (var x=0;x<W;x++){ var top=rd(70+Math.sin(x*0.03)*4+fbm(x*0.05,1,3)*8); for (var y=top;y<92;y++) b.px(x,y,ra(R('k0 k1 n0'),0.3+(y-top)/30,x,y)); }
  b.rect(54,74,3,2,P.f4); b.px(55,74,P.l0); glow(b,55,75,14,0.8,P.f3);
  // die Neretva: dunkel, Mondglanz, Nebel über dem Wasser
  for (var y2=90;y2<H;y2++) for (var x2=0;x2<W;x2++){ var c=ra(R('k0 j0 j1 j2'),0.25+(y2-90)/80+(fbm(x2*0.04,y2*0.3,6)-0.5)*0.3,x2,y2); if (Math.sin(x2*0.21+y2*1.7)>0.96 && x2>60 && x2<140) c=P.u3; b.px(x2,y2,c); }
  for (var y3=84;y3<96;y3++) for (var x3=0;x3<W;x3++){ var m=fbm(x3*0.03,y3*0.2,9); if (bayer(x3,y3)<(m-0.45)*1.2*(1-Math.abs(y3-90)/7)) b.px(x3,y3,P.u2); }
  // Glockenstuhl: zwei Pfosten, Querbalken mit Reif
  var WR=R('k0 w0 w1 w2 w3');
  [[150,158],[264,272]].forEach(function(p){ for (var y=GLO.piv-6;y<H;y++) for (var x=p[0];x<=p[1];x++){ var u=(x-p[0])/(p[1]-p[0]); b.px(x,y,ra(WR,0.25+(1-u)*0.35+(fbm(x*0.6,y*0.08,2)-0.5)*0.3,x,y)); } });
  for (var y4=GLO.piv-8;y4<GLO.piv;y4++) for (var x4=140;x4<284;x4++){ b.px(x4,y4,ra(WR,0.3+(y4-GLO.piv+8)/-14+0.4+(fbm(x4*0.08,y4*0.6,5)-0.5)*0.3,x4,y4)); }
  for (var x5=140;x5<284;x5++){ b.px(x5,GLO.piv-9,(hash(x5,3)<0.55)?P.o6:P.u4); if (hash(x5,4)<0.12) b.px(x5,GLO.piv-10,P.o6); b.px(x5,GLO.piv,P.k0); } }
function drawBell(fb,ang,t){ var cx=GLO.bx, BR=R('k1 z0 y1 f1 y2 f2 y3 f3'), VG=R('j2 j3 i3 j4');
  // Joch
  for (var y=GLO.piv;y<GLO.top+2;y++) for (var x=cx-4;x<=cx+4;x++) fb.px(x+rd(ang*(y-GLO.piv)),y,ra(R('k0 u0 u1 u2'),0.3+(cx+4-x)/14,x,y));
  for (var y2=GLO.top;y2<=GLO.bot;y2++){ var tt=(y2-GLO.top)/(GLO.bot-GLO.top), r=belR(tt), off=rd(ang*(y2-GLO.piv));
    for (var x2=Math.floor(cx-r);x2<=cx+r;x2++){ var u=(x2-cx)/r, n=Math.sqrt(Math.max(0,1-u*u)), lt=0.18+n*0.45+(-u)*0.3-(tt>0.9?0.1:0)+(fbm(x2*0.15,y2*0.12,8)-0.5)*0.12;
      var c=ra(BR,cl(lt,0,1),x2,y2); if (fbm(x2*0.09+3,y2*0.07,12)>0.64 && tt<0.9) c=ra(VG,cl(lt,0,1),x2,y2);   // Grünspan
      if (Math.abs(u)>0.94) c=P.k1; if (tt>0.97) c=P.k0; if (tt>0.9 && tt<0.93) c=M.UP[c]; fb.px(x2+off,y2,c); } }
  // Klöppel
  var kx=cx+rd(ang*(GLO.bot-GLO.piv))+rd(Math.sin(t*2.4)*1.5); fb.ellipse(kx+0.5,GLO.bot+3.5,3,3,P.k1); fb.px(kx,GLO.bot+2,P.u2);
  return kx; }
function animGlocke(fb,t){ var ang=0.05*Math.sin(t*2.6)*Math.exp(-t*0.18)+0.006*Math.sin(t*1.1), kx=drawBell(fb,ang,t);
  // Seil vom Klöppel hinunter zur Hand
  var hx=196+rd(Math.sin(t*2.6)*2*Math.exp(-t*0.18)), hy=120;
  for (var y=GLO.bot+6;y<H;y++){ var f=(y-GLO.bot-6)/(hy-GLO.bot-6), x=rd(kx+(hx-kx)*Math.min(1,f)); fb.px(x,y,((y>>1)&1)?P.w3:P.w2); fb.px(x+1,y,P.w1); }
  // Markos Faust am Seil, der Mantelärmel von links unten (Mondlicht von links oben)
  sleeve(fb,hx-30,H+6,hx-9,hy+8,9,R('k0 u0 u1 c1 c2'),false);
  fist(fb,hx-1,hy+2,1.25,1,R('q0 q1 q2 q3'),P.q0);
  for (var yy=hy-8;yy<hy+12;yy++){ fb.px(hx,yy,((yy>>1)&1)?P.w3:P.w2); fb.px(hx+1,yy,P.w1); }
  // Reif glitzert
  for (var i=0;i<6;i++){ var gx=140+rd(hash(i,Math.floor(t*1.5))*144), gy=GLO.piv-9; if ((Math.floor(t*6)+i)%3===0) fb.px(gx,gy,P.l1); } }

// ---------------------------------------------------------------- 2 Batos Hände im Licht der Laterne (Finale)
function paintHaende(b){ for (var y=0;y<H;y++) for (var x=0;x<W;x++) b.px(x,y,ra(R('k0 k1 n0 k2'),0.2+(y/H)*0.5+(fbm(x*0.02,y*0.04,2)-0.5)*0.2,x,y));
  for (var y2=104;y2<H;y2++) for (var x2=0;x2<W;x2++){ var c=ra(R('k0 j0 j1'),0.3+(y2-104)/60+(fbm(x2*0.05,y2*0.4,5)-0.5)*0.35,x2,y2), wv=fbm(x2*0.3,y2*0.9,8);
    if (Math.abs(x2-52-Math.sin(y2*0.7)*3)<6-(y2-104)*0.06 && wv>0.55) c=(wv>0.66)?P.f4:P.f2;   // das Licht der Laterne im Wasser
    else if (wv>0.74 && hash(x2,y2)<0.3) c=P.j2; b.px(x2,y2,c); }
}
function lantern(fb,cx,cy,t,big){ var s=big?1.6:1, fl=0.85+Math.sin(t*9)*0.08+Math.sin(t*23)*0.05;
  glow(fb,cx,cy,rd(70*s*fl),0.75,P.f3);
  for (var y=rd(cy-14*s);y<=cy+12*s;y++) for (var x=rd(cx-8*s);x<=cx+8*s;x++){ var u=(x-cx)/(7*s), v=(y-cy)/(9*s); if (u*u+v*v>1) continue; var c=ra(R('f2 f3 f4 f5 l0'),cl(0.95-Math.sqrt(u*u+v*v)*0.7*(1/fl),0,1),x,y); if (Math.abs(u)>0.82) c=P.u1; fb.px(x,y,c); }
  for (var k=-1;k<=1;k++) fb.line(rd(cx+k*5*s),rd(cy-10*s),rd(cx+k*5*s),rd(cy+9*s),P.u0);
  fb.rect(rd(cx-9*s),rd(cy-16*s),rd(18*s),rd(3*s),P.u1); fb.rect(rd(cx-10*s),rd(cy+10*s),rd(20*s),rd(5*s),P.u1); fb.hl(rd(cx-10*s),rd(cx+10*s),rd(cy+10*s),P.u2);
  for (var a=0;a<=16;a++){ var an=Math.PI*a/16; fb.px(rd(cx+Math.cos(an)*6*s),rd(cy-17*s-Math.sin(an)*6*s),P.u0); }   // Tragring
  fb.px(cx,rd(cy-1),P.l1); fb.px(cx,rd(cy-2),fl>0.9?P.l1:P.f5); }
function animHaende(fb,t){ lantern(fb,52,62,t,false); var tr=((Math.floor(t*8))%2)?1:0;
  var HR=R('v0 v1 v2 v3 v4 v5'), SL=R('k1 v0 v1 v2 v3');
  // dicke Pulloverärmel (als Geist fahl), dann die Hände, Handflächen nach oben
  sleeve(fb,104+tr,H+14,128+tr,104,15,SL,true); sleeve(fb,226-tr,H+14,202-tr,106,15,SL,true);
  handUp(fb,134+tr,92,1.5,true,HR,P.v1,{alpha:true,light:[-0.8,-0.6]}); handUp(fb,196-tr,94,1.5,false,HR,P.v1,{alpha:true,light:[-0.8,-0.6]});
  // warmer Saum zur Laterne hin
  for (var y=30;y<130;y++) for (var x=100;x<240;x++){ var k=y*W+x, c=fb.d[k], l=fb.d[k-1]; if (!(c===P.v3||c===P.v4||c===P.v5||c===P.v2)) continue; if (l===P.k1) fb.d[k]=(x<170)?P.f4:P.f3; } }

// ---------------------------------------------------------------- 3 Zlatas Sturmlaterne am Schuppen (Finale)
function paintLaterne(b){ var WR=R('k0 w0 w1 w2');
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var pl=Math.floor(x/17), u=(x%17)/17, c=ra(WR,0.25+(0.5-Math.abs(u-0.5))*0.3+(fbm(pl*3.1,y*0.05,4)-0.5)*0.35,x,y); if (x%17===0) c=P.k0; if (hash(pl,Math.floor(y/9))<0.08 && (y%9)===4) c=P.k1; b.px(x,y,c); }
  for (var x2=0;x2<W;x2++){ if (hash(x2,7)<0.4) b.px(x2,0,P.o6); }
}
function animLaterne(fb,t){ var sw=Math.sin(t*1.3)*1.2, cx=rd(160+sw), cy=72; lantern(fb,cx,cy,t,true);
  // Bügel und Hand
  for (var a=0;a<=20;a++){ var ang=Math.PI*(a/20), x=rd(cx+Math.cos(ang)*12), y=rd(cy-40-Math.sin(ang)*10); fb.px(x,y,P.u1); fb.px(x,y+1,P.u0); }
  sleeve(fb,cx+46,-12,cx+12,cy-62,10,R('k1 u0 u1 u2 u3'),true);
  fist(fb,cx+2,cy-50,1.35,-1,R('q0 q1 q2 q3'),P.q0);
  // das Licht von unten auf den Knöcheln
  for (var y4=cy-46;y4<cy-40;y4++) for (var x4=cx-10;x4<cx+14;x4++){ var c4=fb.get(x4,y4); if (c4===P.q2||c4===P.q3) fb.px(x4,y4,P.f4); else if (c4===P.q1) fb.px(x4,y4,P.f3); } }

// ---------------------------------------------------------------- 4 Unter dem Quittenbaum (Finale)
var QU=[[188,40],[226,56],[256,34],[146,58]];
function paintQuitte(b){ sky(b,0,H,R('k0 k1 n0 n1'),23,140);
  // Boden im Reif
  for (var y=110;y<H;y++) for (var x=0;x<W;x++){ var c=ra(R('k0 u0 u1 u2 u3'),0.3+(y-110)/50+(fbm(x*0.1,y*0.3,3)-0.5)*0.4,x,y); if (hash(x,y)<0.03) c=P.o6; b.px(x,y,c); }
  // Äste von rechts oben
  function branch(x0,y0,a,len,w,d){ var x=x0, y=y0; for (var i=0;i<len;i++){ x+=Math.cos(a); y+=Math.sin(a); a+=Math.sin(i*0.3+d)*0.05; for (var k=-w;k<=w;k++){ b.px(rd(x),rd(y+k),k===-w?P.u2:P.k1); } if (w>0 && i>8 && i%11===0 && d<3) branch(x,y,a+(i%22?0.7:-0.6),len*0.45,Math.max(0,w-1),d+1); } }
  branch(330,6,Math.PI*0.86,170,2,0); branch(330,30,Math.PI*0.95,140,1,1); branch(300,0,Math.PI*0.7,90,1,1);
  // das Brett
  var BR=R('k0 w0 w1 w2 w3'); for (var y2=78;y2<126;y2++) for (var x2=104;x2<132;x2++){ var c2=ra(BR,0.3+(132-x2)/60+(fbm(x2*0.4,y2*0.08,6)-0.5)*0.35,x2,y2); if (x2===104||x2===131||y2===78) c2=P.k0; if (y2===79 && hash(x2,9)<0.7) c2=P.o6; b.px(x2,y2,c2); }
  for (var x4=108;x4<128;x4+=5) b.px(x4,94,P.k0); }
function animQuitte(fb,t){ var sw=rd(Math.sin(t*0.8));
  QU.forEach(function(q,i){ var qx=q[0]+(i%2?sw:0), qy=q[1]; fb.px(qx,qy-6,P.k1); fb.px(qx,qy-5,P.k1);
    for (var y=qy-4;y<=qy+5;y++) for (var x=qx-4;x<=qx+4;x++){ var dx=(x-qx)/4.5, dy=(y-qy)/5; if (dx*dx+dy*dy>1) continue; fb.px(x,y,ra(R('z1 f2 f3 f4'),cl(0.6-dx*0.4-dy*0.25,0,1),x,y)); } fb.px(qx-2,qy-2,P.f5); });
  // ein Blatt fällt
  var ph=(t%9)/9, lx=rd(220-ph*90+Math.sin(ph*14)*8), ly=rd(50+ph*70); if (ph<0.95){ fb.px(lx,ly,P.z3); fb.px(lx+1,ly,P.z2); }
  // Malas Hand berührt das Brett (als Geist)
  var GH=R('x1 x2 x3 x4 x5'); sleeve(fb,200,104,150,86,6,R('x0 x1 x2 x3'),false);
  handFlat(fb,128,80,1.1,true,GH,P.x2,{alpha:true,outline:P.x0});
  for (var i=0;i<5;i++){ var gx=rd(hash(i,Math.floor(t*2))*W), gy=112+rd(hash(i+3,Math.floor(t*2))*30); fb.px(gx,gy,P.l1); } }

// ---------------------------------------------------------------- 5 Vom Scheitel der Alten Brücke hinunter (Epilog)
function paintScheitel(b){ var WAT=R('j1 j2 j3 j4 j5'), ST=R('o1 o2 o3 o4 o5');
  // die Schlucht von oben: Felsen links und rechts, die Neretva dazwischen
  for (var y=0;y<104;y++) for (var x=0;x<W;x++){ var l=70+Math.sin(y*0.05)*8+fbm(1,y*0.05,3)*14-y*0.25, r=250-Math.sin(y*0.04+1)*8-fbm(2,y*0.05,4)*14+y*0.28, c;
    if (x>l && x<r){ var u=(x-l)/(r-l), fl=fbm(x*0.06,y*0.012,7), st=fbm(x*0.35,y*0.05,13); c=ra(WAT,cl(0.32+Math.sin(u*Math.PI)*0.28+(fl-0.5)*0.5,0,1),x,y); if (st>0.68) c=M.UP[c]; else if (st<0.26) c=M.DN[c]; if (x<l+3||x>r-3) c=P.j5; }
    else { var rk=fbm(x*0.08,y*0.1,9); c=ra(ST,cl(0.3+rk*0.6-(x>r?0.15:0),0,1),x,y); if (rk>0.66 && hash(x,y)<0.3) c=P.i2; }
    b.px(x,y,c); }
  // die Brüstung vorn: große Steinblöcke
  for (var y2=100;y2<H;y2++) for (var x2=0;x2<W;x2++){ var bl=Math.floor((x2+(y2>120?18:0))/46), u=((x2+(y2>120?18:0))%46)/46, c2=ra(ST,cl(0.5+(y2<104?0.35:0)-(y2-100)/90+(fbm(bl*3+x2*0.05,y2*0.1,2)-0.5)*0.3,0,1),x2,y2); if (u<0.02||y2===120||y2===100) c2=P.o1; b.px(x2,y2,c2); } }
function animScheitel(fb,t){
  // Malas Hände auf der Brüstung (als Geist)
  var GH=R('x1 x2 x3 x4 x5'), SL=R('x0 x1 x2 x3');
  sleeve(fb,96,H+10,124,118,9,SL,true); sleeve(fb,226,H+10,198,118,9,SL,true);
  handFlat(fb,128,112,1.25,true,GH,P.x2,{alpha:true,outline:P.x0}); handFlat(fb,194,112,1.25,false,GH,P.x2,{alpha:true,outline:P.x0});
  for (var i=0;i<8;i++){ var gx=rd(90+hash(i,Math.floor(t*3))*140), gy=rd(5+hash(i+5,Math.floor(t*3))*90); if (fb.get(gx,gy)===P.j4||fb.get(gx,gy)===P.j5) fb.px(gx,gy,P.j6); } }

var CL={ glocke:{paint:paintGlocke,anim:animGlocke}, haende:{paint:paintHaende,anim:animHaende}, laterne:{paint:paintLaterne,anim:animLaterne}, quitte:{paint:paintQuitte,anim:animQuitte}, scheitel:{paint:paintScheitel,anim:animScheitel} };
M.K3CLOSE=CL;
var CACHE={};
function pic(id){ if (!CACHE[id]){ var b=new M.Buf(W,H,P.k0); CL[id].paint(b); CACHE[id]=b; } return CACHE[id]; }
var FRAME=new M.Buf(W,H,P.k0);
// gezeichnet am Ende der Szene (06_ui.js): gerastert ein- und ausblenden
M.k3DrawClose=function(fb,gt,SH){ var C=M.E.k3close; if (!C || !CL[C.id]) return; var t=(gt-C.t0)/1000, kIn=Math.min(1,t/0.7), kOut=C.out?Math.max(0,1-(gt-C.out)/450):1, k=Math.min(kIn,kOut);
  var base=pic(C.id); FRAME.d.set(base.d); try{ CL[C.id].anim(FRAME,t); }catch(e){ if (!M._k3closeErr){ M._k3closeErr=1; console.error(e); } }
  for (var y=0;y<Math.min(SH,H);y++) for (var x=0;x<W;x++){ if (k<1 && bayer(x,y)>=k) continue; var c=FRAME.d[y*W+x]; if (c!==T) fb.d[y*fb.w+x]=c; } };
M.k3Close=async function(A,id,fn){ var E=M.E; if (A!==M.API || !CL[id] || E.screen!=='game' || !M.k3Fx('close',E.room) || M.TEST_NORIDE){ await fn(); return; }
  E.k3close={id:id,t0:E.gt(),out:0}; try{ await A.wait(750); await fn(); await A.wait(500); }
  finally{ if (E.k3close){ E.k3close.out=E.gt(); } await A.wait(460); E.k3close=null; } };
M.k3ClosePic=function(id,t){ var b=new M.Buf(W,H,P.k0); b.d.set(pic(id).d); CL[id].anim(b,t||1.5); return b; };   // Werkzeuge und Tests
})(M);
