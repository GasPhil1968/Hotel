/* ===== rooms/art/coldroom.js — Der Kühlraum der Ledana (Mala zuerst): ein dunkler, isolierter Raum.
   Verzinkte Isolierwände mit Stockflecken, Fleischhaken an Laufschienen unter der Decke. Hinten rechts ist ein Teil der
   Decke eingestürzt und hat einen Schutthaufen gebildet; darunter liegt Lukas Gitarrenkoffer (S.caseOpen: offen, die
   Gitarre mit gebrochenem Hals). Ein Lichtkeil fällt aus der Tür in der linken Wand, ein dünner Schacht durch das Deckenloch. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320, H=144;
var VP=[176,60], F=90, FY=100, RECT=[72,24,268,100];
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var R=M.R;
var DOORQ=M.wallQuad(SPEC,'L',40,70,40,100);       // Tür in der linken Wand
var HOLE={X0:204,X1:250,Z0:8,Z1:30};                // Loch in der Decke
var CASE={x:214,y:110};                             // Gitarrenkoffer (unter dem Schutt, Ende ragt heraus)

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function p3(X,Y,Z){ var q=R3.p(X,Y,Z); return [q[0],q[1]]; }

// ---------------------------------------------------------------- Licht: kaltes Dunkel, warmes Tageslicht aus der Tür und vom Loch
var DARK=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.46+L*0.1+2, g*0.5+L*0.12+4, b*0.6+L*0.14+10]; });
var DAY=M.tintMake(function(r,g,b){ return [r*0.96+10, g*0.9+6, b*0.8+2]; });
function finishLit(b,lit){ var d=b.d; for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var k=y*W+x, c=d[k]; if (c===T) continue; var bb=bayer(x,y), v=(lit(x,y)-0.3)*2.4, L=(v>0&&bb<v)?DAY:DARK, r=L.r[c]; d[k]=(r>0.2&&bb<(r-0.2)*1.4)?L.b[c]:L.a[c]; } }
var DOORW=null;   // Lichtkeil (abhängig davon, ob die Tür offen steht)
function wedge(x,y,wide){ // Keil aus der Tür quer über den Boden nach rechts
  var dB=DOORQ[3], dA=DOORQ[2]; // untere Türkante: von (x≈32,115) bis (x≈2,127)
  if (y<100) { var dx=(x-12)/(wide?34:22), dy=(y-78)/40, q=dx*dx+dy*dy; return q<1?(1-q)*0.4:0; }
  var t=(y-108)/36; if (t<-0.2) return 0; var xl=8+t*30, xr=(wide?60:44)+t*(wide?190:150); if (x<xl||x>xr) return 0; var e=Math.min(1,Math.min(x-xl,xr-x)/7); return e*Math.max(0,1.05-(x-xl)/(xr-xl+40)*1.1)*Math.min(1,(t+0.3)*1.6); }
function shaft(x,y){ // dünner Schacht durch das Deckenloch auf den Schutt
  var ax=232, ay=12, bx=228, by=104, vx=bx-ax, vy=by-ay, L2=vx*vx+vy*vy, t=((x-ax)*vx+(y-ay)*vy)/L2; if (t<0||t>1.1) return 0; var qx=ax+vx*t, qy=ay+vy*t, d=Math.hypot(x-qx,y-qy), w=7+12*t; if (d>w) return 0;
  return Math.min(1,(1-d/w)*1.8)*(0.32+0.25*t); }
function pool(x,y){ var dx=(x-230)/36, dy=(y-104)/12, q=dx*dx+dy*dy; return q<1?Math.min(1,(1-q)*1.4)*0.85:0; }

// ---------------------------------------------------------------- Texturen
function panel(u,v,x,y){ // verzinkte Blechpaneele mit Nietreihen, Stockflecken, Rost
  var pw=22, ph=26, fu=((u%pw)+pw)%pw, fv=((v%ph)+ph)%ph, c=ra(R('m0 m1 m2 m3'),0.62+(fbm(u*0.08,v*0.05)-0.5)*0.5,x,y);
  if (fu<1) c=P.k1; else if (fu<2) c=P.m3; if (fv<1) c=P.k1; if ((fu===3||fu===pw-3) && fv%5===2) c=P.m4;
  var mold=fbm(u*0.11+3,v*0.09+7), sp=hash(Math.floor(u/2)*7+1,Math.floor(v/2)*3); if (mold>0.6 && sp<(mold-0.6)*4.5) c=(sp<0.12)?P.k2:((sp<0.3)?P.g0:P.g1); if (v>40 && mold>0.5 && sp<(v-40)/90) c=M.DN[c];
  var rs=fbm(u*0.4,v*0.02); if (rs>0.7 && v>10 && hash(x,y)<0.6) c=(hash(x,y)<0.3)?P.t2:P.t1;
  if (v>62){ c=ra(R('k1 m0 m1'),0.6-(v-62)/40,x,y); if ((v-62)%7===0) c=P.m2; }
  return c; }
function floorTex(xb,d,x,y){ var k=(y-VP[1])/(FY-VP[1]), Z=(k-1)*F, X=VP[0]+(x-VP[0])/k, c;
  var tx=((X+400)%12), tz=((Z+400)%8); c=(hash(Math.floor((X+400)/12),Math.floor((Z+400)/8))<0.5)?P.t1:P.t0; if (tx<0.8/k+0.3||tz<0.5) c=P.k1;
  var wet=fbm(X*0.05,Z*0.08); if (wet>0.62) c=(c===P.k1)?P.k2:P.n0; if (hash(x,y)<0.04) c=P.t2; return c; }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), x, y, i, k;
  var ld=GS&&GS.rooms&&GS.rooms.ledana, wide=!!(ld&&ld.coldOpen);
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return panel(u+72,v,x,y); },
    side:function(u,v,x,y,sd){ var c=panel(u*1.7+(sd==='L'?0:400),v,x,y); return sd==='L'?c:M.DN[c]; },
    floor:floorTex,
    ceil:function(xb,d,x,y){ var kk=(VP[1]-y)/(VP[1]-RECT[1]), Z=(kk-1)*F, X=VP[0]+(x-VP[0])/kk; var c=ra(R('k1 m0 m1 m2'),0.55+(fbm(X*0.05,Z*0.1)-0.5)*0.6,x,y); if (((X+400)%22)<0.8/kk+0.3) c=P.k1; if (((Z+400)%18)<1) c=P.k1; if (fbm(X*0.1,Z*0.1)>0.66) c=P.g0; return c; } });
  // Abfluss im Boden, Pfützen
  var dr=p3(150,FY,40); b.ellipse(dr[0],dr[1],5,1.6,P.k1); for (x=rnd(dr[0])-3;x<=rnd(dr[0])+3;x+=2) b.px(x,rnd(dr[1]),P.m2);
  // ---- Thermometer, Lampe mit Drahtkorb (tot)
  b.ellipse(118,46,7,7,P.m2); b.ellipse(118,46,5.6,5.6,P.s4); for (k=0;k<10;k++){ var an=Math.PI*0.75+k/9*Math.PI*1.5; b.px(rnd(118+Math.cos(an)*4.5),rnd(46+Math.sin(an)*4.5),P.k2); } b.line(118,46,115,49,P.r2); b.px(118,46,P.k1); M.microText(b,'°C',116,50,P.k2);
  var lp=p3(170,RECT[1],20); b.vl(rnd(lp[0]),rnd(lp[1]),rnd(lp[1])+4,P.k1); b.ellipse(lp[0],lp[1]+7,3,3.4,P.m1); for (y=rnd(lp[1])+4;y<rnd(lp[1])+11;y+=2) b.hl(rnd(lp[0])-2,rnd(lp[0])+2,y,P.k1); b.px(rnd(lp[0]),rnd(lp[1])+7,P.s3);
  // ---- Deckenschienen mit Fleischhaken
  var rails=[[110,0,92],[176,0,96],[238,0,40]], hooks=[];
  rails.forEach(function(rl,ri){ var X=rl[0], a=p3(X,RECT[1]+2,rl[1]), z=p3(X,RECT[1]+2,rl[2]); b.line(rnd(a[0]),rnd(a[1]),rnd(z[0]),rnd(z[1]),P.m3); b.line(rnd(a[0]),rnd(a[1])-1,rnd(z[0]),rnd(z[1])-1,P.m1); b.line(rnd(a[0]),rnd(a[1])+1,rnd(z[0]),rnd(z[1])+1,P.k1);
    for (var hz=rl[1]+6;hz<rl[2];hz+=(hz>40?20:13)){ if (ri===2 && hz>30) break; var hp=p3(X,RECT[1]+2,hz), kk=1+hz/F, len=Math.round((10+hash(ri,hz)*9)*kk); hooks.push([rnd(hp[0]),rnd(hp[1]),len,kk]); } });
  // Schiene an der Rückwand mit Haken vor der Wand
  b.hl(RECT[0]+4,RECT[2]-4,40,P.m3); b.hl(RECT[0]+4,RECT[2]-4,41,P.k1); for (x=RECT[0]+14;x<RECT[2]-10;x+=17){ if (x>196&&x<262) continue; hooks.push([x,41,10+Math.floor(hash(x,3)*8),1]); }
  hooks.forEach(function(h,hi){ drawHook(b,h[0],h[1],h[2],h[3],(hi%4===2)?0.15:0); });
  // ---- Schutthaufen unter dem Deckenloch: weicher Hügel aus Putz und Kork, darauf große Stücke; der Koffer ragt vorn heraus
  var r=M.rng(23), MX=246, MY=108;
  for (y=MY-18;y<MY+8;y++) for (x=MX-48;x<MX+44;x++){ var u=(x-MX)/46, hgt=Math.max(0,1-u*u)*(15+fbm(x*0.08,3)*6)*(u<0?1:0.9), top=MY+5-hgt, bot=MY+6-Math.abs(u)*2; if (y<top||y>bot) continue;
    var v=(y-top)/Math.max(1,bot-top), f=fbm(x*0.25,y*0.4), c=ra(R('k1 m0 m1 s1 s2 s3'),0.9-v*0.6+(f-0.5)*0.5,x,y); if (f>0.68) c=(hash(x,y)<0.5)?P.e1:P.e2; b.px(x,y,c); }
  [[214,96,22,4,'m'],[236,90,26,5,'m'],[258,96,18,4,'e'],[226,100,14,4,'e'],[268,102,14,3,'s'],[246,98,12,3,'s']].forEach(function(pc){ var x0=pc[0], y0=pc[1], w=pc[2], h=pc[3], col=pc[4]==='m'?R('k1 m0 m1 m2 m3'):(pc[4]==='e'?R('e0 e1 e2 e3'):R('s1 s2 s3 s4')), sl=(hash(x0,y0)-0.5)*0.35;
    b.poly([[x0,y0],[x0+w,y0+sl*w],[x0+w-1,y0+h+sl*w],[x0+1,y0+h]],function(xx,yy){ var v=(yy-y0-sl*(xx-x0))/(h+0.5); return col[cl(Math.floor((1-v)*col.length*0.99),0,col.length-1)]; });
    b.line(x0,y0,x0+w,rnd(y0+sl*w),col[col.length-1]); if (pc[4]==='m') for (var q=x0+3;q<x0+w-2;q+=5) b.px(q,rnd(y0+1+sl*(q-x0)),P.m4); });
  for (i=0;i<7;i++){ var sx=220+r()*50, sy=90+r()*12; b.line(rnd(sx),rnd(sy),rnd(sx+(r()-0.5)*16),rnd(sy-5-r()*8),P.t1); b.px(rnd(sx),rnd(sy),P.t2); }
  // heruntergefallene Schiene mit Haken quer über dem Haufen
  b.line(230,94,276,86,P.m3); b.line(230,95,276,87,P.k1); drawHook(b,254,90,7,1.1,0.4);
  // ---- Deckenloch: zerbrochene Paneele, Kork, Bewehrung hängt herab, darüber schwaches Tageslicht
  var hp=[p3(HOLE.X0,RECT[1],HOLE.Z0),p3(HOLE.X1,RECT[1],HOLE.Z0),p3(HOLE.X1,RECT[1],HOLE.Z1),p3(HOLE.X0,RECT[1],HOLE.Z1)];
  b.poly(hp,function(x,y){ return (fbm(x*0.3,y*0.5)>0.55)?P.s3:P.s2; }); for (x=rnd(hp[0][0])-4;x<rnd(hp[1][0])+4;x++){ var jg=Math.round(fbm(x*0.4,1)*5); for (var yy=rnd(hp[0][1])-jg;yy<=rnd(hp[0][1]);yy++) b.px(x,yy,P.k1); }
  for (i=0;i<6;i++){ var ix=rnd(hp[0][0]+4+i*8+r()*4), iy=rnd(hp[0][1])+1, il=6+rnd(r()*10); b.rect(ix,iy,3,il,P.e1); b.vl(ix,iy,iy+il-1,P.e2); b.px(ix+1,iy+il,P.e0); }
  for (i=0;i<12;i++){ var hx=rnd(hp[0][0]+r()*(hp[1][0]-hp[0][0])), hy=rnd(Math.min(hp[0][1],hp[2][1])+r()*8); b.line(hx,hy,hx+rnd((r()-0.5)*6),hy+3+rnd(r()*9),r()<0.5?P.t1:P.e1); }
  for (x=rnd(hp[3][0]);x<rnd(hp[2][0]);x++){ if (hash(x,5)<0.5) b.px(x,rnd(hp[3][1])+1,P.e1); }
  // ---- Tür in der linken Wand (dicke Isolierung), Lichtkeil
  var dq=DOORQ; b.poly([[dq[0][0]+2,dq[0][1]-2],[dq[1][0]-2,dq[1][1]-3],[dq[2][0]-2,dq[2][1]+2],[dq[3][0]+2,dq[3][1]+2]],P.k1);
  b.poly(dq,function(x,y){ return ra(R('s2 s3 s4 s5'),0.7-(y-30)/100*0.4,x,y); });
  var inner=M.wallQuad(SPEC,'L',wide?44:52,wide?68:58,42,100); b.poly(inner,function(x,y){ return ra(R('s3 s4 s5 s6'),0.9-(y-30)/100*0.3,x,y); });
  // Türblatt (von innen): steht offen in den Raum, Kante sichtbar
  var lf=M.wallQuad(SPEC,'L',40,wide?44:52,42,100); b.poly([lf[0],lf[1],lf[2],lf[3]],function(x,y){ return ra(R('m0 m1 m2'),0.5,x,y); });
  var e0=M.wallPt(SPEC,'L',wide?44:52,42), e1=M.wallPt(SPEC,'L',wide?44:52,100); b.line(rnd(e0[0]),rnd(e0[1]),rnd(e1[0]),rnd(e1[1]),P.m3);
  // Kisten an der Rückwand, ein Holzschemel
  R3.box(b,84,112,86,FY,2,16,{front:function(x,y){ return tex.boards(x,y,R('w0 w1 w2 w3'),4); },top:P.w2,right:P.w0});
  R3.box(b,90,108,74,86,6,14,{front:function(x,y){ return tex.boards(x,y*1.3,R('w0 w1 w2'),4); },top:P.w2,right:P.w0});
  // ---- Licht
  var lit=function(x,y){ return wedge(x,y,wide)+shaft(x,y)+pool(x,y)+(inDoor(x,y)?1:0); };
  var LF=function(x,y){ var v=-0.25+wedge(x,y,wide)*2.6+shaft(x,y)*2.2+pool(x,y)*1.5; var vx=(x-180)/210, vy=(y-80)/120; v-=Math.max(0,vx*vx+vy*vy-0.32)*2.0; if (inDoor(x,y)) v=1.4; return v; };
  function inDoor(x,y){ return M.inPoly(x+0.5,y+0.5,inner); }
  M.light(b,LF); finishLit(b,lit);
  // der Koffer erst nach dem Licht, in festen Farben (bleibt lesbar)
  if (!S.caseOpen) caseClosed(b,CASE.x,CASE.y); else caseOpen(b,CASE.x,CASE.y);
  // Lichtkante am Deckenloch und in der Tür
  for (x=rnd(hp[0][0])+2;x<rnd(hp[1][0])-2;x++){ if (hash(x,3)<0.6) b.px(x,rnd(hp[0][1])+1,P.s5); }
  return b; }
function drawHook(b,x,y,len,kk,tilt){ var D=P.k0, M1=P.k2, HL=P.m4; b.rect(x-2,y,5,3,M1); b.hl(x-2,x+2,y,P.m3); b.px(x-2,y+1,HL); var ex=x+Math.round((tilt||0)*len);
  for (var k=0;k<len;k++){ var cx=Math.round(x+(ex-x)*k/len), cy=y+3+k; b.px(cx,cy,(k%3===0)?M1:D); b.px(cx+1,cy,(k%3===1)?M1:D); if (k%3===0) b.px(cx-1,cy,HL); }
  var hx=ex, hy=y+3+len; b.px(hx,hy,D); b.px(hx+1,hy,D); b.px(hx+1,hy+1,M1); b.px(hx+2,hy+2,D); b.px(hx+2,hy+3,D); b.px(hx+1,hy+4,D); b.px(hx,hy+4,M1); b.px(hx-1,hy+3,D); b.px(hx-2,hy+2,HL); b.px(hx-2,hy+1,HL); b.px(hx-1,hy+4,HL); }
// Gitarrenkoffer (Dreadnought-Form), liegend, Kopfende links
function caseShape(x,y,sx,sy){ var pts=[], i, t, X, half;
  function hw(t){ return (t<0.42)?(2.6+t*2.2):(3.6+Math.sin((t-0.42)/0.58*Math.PI)*2.4+(t>0.7?1.2:0)); }
  for (i=0;i<=24;i++){ t=i/24; X=-22+t*44; pts.push([x+X*sx,y-hw(t)*sy]); }
  for (i=24;i>=0;i--){ t=i/24; X=-22+t*44; pts.push([x+X*sx,y+hw(t)*sy*0.55]); }
  return pts; }
function caseClosed(b,x,y){ var sh=caseShape(x,y,1,1), i;
  b.poly(caseShape(x+1,y+1,1.04,1.1),P.k0);
  b.poly(sh,function(xx,yy){ var v=(yy-(y-8))/11; return v<0.25?P.m1:(v<0.5?P.k2:(v<0.8?P.k1:P.k0)); });
  for (i=0;i<25;i++){ var q=sh[i]; b.px(rnd(q[0]),rnd(q[1]),i%3?P.m2:P.m3); }
  b.line(x-21,y,x+22,y-1,P.m0); b.line(x-21,y+1,x+22,y,P.k0);
  b.rect(x-4,y-7,7,2,P.k0); b.hl(x-4,x+2,y-8,P.m2); b.px(x-5,y-7,P.m1); b.px(x+3,y-7,P.m1);
  [[x+10,y-2],[x-12,y-1],[x+1,y-1]].forEach(function(l){ b.rect(l[0],l[1],2,2,P.y3); b.px(l[0],l[1],P.y5); });
  b.rect(x+13,y-6,4,3,P.r3); b.px(x+13,y-6,P.s6); b.px(x+16,y-4,P.b2);
  // Schutt liegt halb darüber (rechtes Ende)
  [[x+14,y-9,10,4,R('m1 m2 m3 s4')],[x+19,y-5,9,5,R('e1 e2 e3 e4')],[x+8,y-11,8,3,R('s2 s3 s4 s5')]].forEach(function(pc){ var x0=pc[0], y0=pc[1], w=pc[2], h=pc[3], col=pc[4];
    b.poly([[x0,y0],[x0+w,y0-1],[x0+w-1,y0+h],[x0+1,y0+h+1]],function(xx,yy){ var v=(yy-y0)/(h+1); return col[cl(Math.floor((1-v)*col.length*0.99),0,col.length-1)]; }); b.hl(x0+1,x0+w-1,y0,col[col.length-1]); });
  for (i=0;i<8;i++) b.px(x+12+Math.floor(hash(i,2)*16),y+Math.floor(hash(i,3)*3)-1,P.s3); }
function caseOpen(b,x,y){ var k;
  var lid=caseShape(x-2,y-9,1,1.05).map(function(p){ return [p[0],y-9-(y-9-p[1])*1.6-(p[0]-x)*0.05]; });
  b.poly(lid,function(xx,yy){ var v=(yy-(y-24))/16; return v<0.3?P.m1:(v<0.7?P.k2:P.k1); }); b.poly(caseShape(x-2,y-10,0.9,0.9).map(function(p){ return [p[0],y-10-(y-10-p[1])*1.4]; }),function(xx,yy){ return hash(xx,yy)<0.35?P.r3:P.r2; });
  var sh=caseShape(x,y,1,1); b.poly(caseShape(x+1,y+1,1.04,1.1),P.k0); b.poly(sh,P.k1); b.poly(caseShape(x,y,0.92,0.75),function(xx,yy){ return hash(xx,yy)<0.4?P.r2:P.r1; });
  // Gitarre: Fichtendecke, Schallloch mit Rosette, Steg, abgebrochener Hals, lose Saiten
  b.ellipse(x+12,y-1,8.5,3.6,function(xx,yy){ var v=(yy-(y-5))/8; return v<0.3?P.d6:(v<0.7?P.w5:P.w4); }); b.ellipse(x+2,y-1,6,3,function(xx,yy){ var v=(yy-(y-4))/6; return v<0.3?P.d6:(v<0.7?P.w5:P.w4); });
  b.ellipse(x+5,y-1.5,2.2,1.5,P.w2); b.ellipse(x+5,y-1.5,1.6,1.1,P.k0); b.hl(x+13,x+16,y-1,P.w1); b.px(x+12,y-2,P.w2);
  b.line(x-4,y-1,x-12,y,P.w2); b.line(x-4,y,x-12,y+1,P.w1);
  b.line(x-13,y+1,x-17,y-6,P.w3); b.line(x-12,y+1,x-16,y-6,P.w1); b.rect(x-20,y-9,3,4,P.w2); b.px(x-19,y-9,P.m4); b.px(x-18,y-7,P.m4);
  for (k=0;k<3;k++) b.line(x+15,y-2+k,x-11,y-1+Math.round(k*0.5),P.s5); b.line(x-12,y-1,x-18,y-9,P.s6); b.line(x-18,y-9,x-23,y-4,P.s5); b.line(x-11,y,x-14,y+4,P.s5); b.line(x-14,y+4,x-9,y+5,P.s4);
  // Splitter neben dem Koffer
  b.line(x+22,y+2,x+27,y,P.w3); b.line(x+21,y+3,x+25,y+3,P.w2); }
// ---------------------------------------------------------------- Ebenen: ein Haken ganz vorn (Figuren gehen dahinter)
function layers(S,GS,tod){ var L=[], h=M.layer(286,0,20,40,200), w=M.lw(h);
  w.line(290,0,304,0,P.m1); for (var y=1;y<22;y++){ w.px(296+((y>>2)&1),y,y%2?P.m1:P.m0); } w.rect(295,22,3,3,P.m1); w.px(297,25,P.m2); w.px(298,26,P.m2); w.px(298,27,P.m1); w.px(297,28,P.m1); w.px(295,27,P.m2); w.px(294,26,P.m3);
  M.tintApply(h,DARK); L.push(h); return L; }

// ---------------------------------------------------------------- dynamisch: Staub im Licht, ein Haken pendelt leise
function dyn(fb,v,S,GS){ var t=v.t, ld=GS&&GS.rooms&&GS.rooms.ledana, wide=!!(ld&&ld.coldOpen);
  for (var i=0;i<26;i++){ var u=(hash(i,1)+t*0.015*(0.4+hash(i,2)))%1, x, y; if (i<16){ x=Math.round(20+u*(wide?180:130)+Math.sin(t*0.5+i)*3); y=Math.round(104+hash(i,3)*36-u*6); if (wedge(x,y,wide)<0.3) continue; }
    else { x=Math.round(230-4*u+(hash(i,3)-0.5)*14+Math.sin(t*0.7+i)*2); y=Math.round(14+u*88); if (shaft(x,y)<0.2) continue; }
    if (Math.sin(t*1.6+i*1.7)>0) fb.px(x,y,P.s5); }
  // Rieseln aus dem Deckenloch
  var fall=(t*0.6)%1; if (fall<0.5){ fb.px(226,Math.round(18+fall*170),P.s3); } }
// ---------------------------------------------------------------- Geistersicht: der Koffer unter dem Schutt glimmt
function ghost(fb,v,S,GS){ if (S.caseOpen) return; var t=v.t, cx=CASE.x, cy=CASE.y-2;
  for (var a=0;a<40;a++){ var ang=a/40*Math.PI*2, rr=1+0.15*Math.sin(ang*4+t*1.7); if (Math.sin(ang*3-t*2.2)>0.2) fb.px(Math.round(cx+Math.cos(ang)*19*rr),Math.round(cy+Math.sin(ang)*7*rr),a%3?P.x4:P.x5); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ var f=R3.floor(x,y); if (!f) return false; if (y<104||y>=139) return false; if (f.X<RECT[0]+4||f.X>RECT[2]-6) return false;
  if (Math.hypot((x-238)/46,(y-107)/9)<1) return false;    // Schutthaufen mit Koffer
  if (x>=74&&x<124&&y<112) return false;                    // Kisten
  return true; }
var dqx=[DOORQ[0][0],DOORQ[1][0],DOORQ[2][0],DOORQ[3][0]], dqy=[DOORQ[0][1],DOORQ[1][1],DOORQ[2][1],DOORQ[3][1]];
M.defineArt('coldroom',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost,
  actorLut:function(a,S,GS,tod){ if (a.ghost) return undefined; return a.x<80||(a.y>110&&a.x<180)?undefined:DARK.a; },
  spots:{ door:[0,24,36,104], case:[CASE.x-24,CASE.y-12,48,18], debris:[200,84,86,34], hooks:[96,24,170,34], walls:[72,24,196,60] },
  stands:{ door:[34,124,'L'], case:[212,124,'B'], debris:[230,124,'B'], hooks:[170,120,'B'], walls:[150,112,'B'] },
  start:[40,124,'R'], entries:{ ledana:[40,124,'R'] }
});
})(M);
