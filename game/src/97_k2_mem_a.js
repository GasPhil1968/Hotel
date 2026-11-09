/* ===== 97_k2_mem_a.js — Kapitel 2 (Sarajevo): Erinnerungsbilder, Teil A („Nachhall“ und „Splitter“), je 232 × 104 Pixel =====
   Wie 93_mem.js: in natürlichen Farben gemalt, mit kräftigen Helligkeitsstufen; das Spiel färbt die Bilder danach selbst
   (tint 'ghost' kalt-blau, 'memory' sepia). Erwachsene kommen aus dem Rig (M.drawPose). Kinder gibt es im Rig nicht:
   sie werden hier von Hand gebaut (kid(): Kopf, Rumpf und Glieder wie im Rig, nur kleiner, 30–36 px).
   Zwei Menschen von damals haben keine Spielfigur: Halid (1973) und der alte Kupferschmied (1972). Für sie gibt es hier
   zwei kleine Figuren im Rig-Format ('k2m_halid', 'k2m_majstor'), die nur in diesen Bildern vorkommen. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, A=M.ANIMS, R=M.R, S=M.poseS, F=M.poseF;
M.mem=M.mem||{};

// ---------------------------------------------------------------- kleine Helfer
function fill(b,x0,y0,w,h,fn){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c=fn(x,y); if (c!==undefined) b.px(x,y,c); } }
function fig(b,x,y,pose,face,id,opt){ try{ M.drawPose(b,x,y,pose,face,id,opt||{}); }catch(e){ console.error(e); } }
function edgeDark(b,amt){ M.light(b,M.lf.vignette(b.w,b.h,amt||2.4)); }
function cl(v,a,c){ return v<a?a:(v>c?c:v); }
function sm(t){ t=cl(t,0,1); return t*t*(3-2*t); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
// Wertrauschen (weich), für Berge, Nebel, Ruß
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), c=hash(gx+1+o,gy), d=hash(gx+o,gy+1), e=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(c-a)*ux+(d-a)*uy+(a-c-d+e)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
// Puffer mit Durchsichtigkeit aufkopieren (gespiegelt, gedithert durchscheinend)
function blitA(dst,src,ox,oy,flip,al){ al=al===undefined?1:al;
  for (var j=0;j<src.h;j++){ var y=oy+j; if (y<0||y>=dst.h) continue; for (var i=0;i<src.w;i++){ var c=src.d[j*src.w+(flip?src.w-1-i:i)]; if (c===T) continue; var x=ox+i; if (x<0||x>=dst.w) continue;
    if (al<1 && bayer(x,y)>=al) continue; dst.d[y*dst.w+x]=c; } } }
// Sieben-Segment-Ziffern (Digitaluhr): Kasten dw × dh, Segmentstärke st (1 oder 2); off = Farbe der dunklen Segmente (oder undefined)
var SEG7={'0':'abcdef','1':'bc','2':'abdeg','3':'abcdg','4':'bcfg','5':'acdfg','6':'acdefg','7':'abc','8':'abcdefg','9':'abcdfg'};
function seg7(b,x,y,dw,dh,ch,on,off,st){ st=st||1; var m=Math.floor((dh-st)/2), s=SEG7[ch]||'', L={ a:[st,0,dw-1-st,0], g:[st,m,dw-1-st,m], d:[st,dh-st,dw-1-st,dh-st], f:[0,st,0,m-1], b:[dw-st,st,dw-st,m-1], e:[0,m+st,0,dh-st-1], c:[dw-st,m+st,dw-st,dh-st-1] };
  Object.keys(L).forEach(function(k){ var c=s.indexOf(k)>=0?on:off; if (c===undefined) return; var p=L[k]; for (var i=0;i<st;i++) for (var j=0;j<st;j++) b.line(x+p[0]+i,y+p[1]+j,x+p[2]+i,y+p[3]+j,c); }); }
function clock7(b,x,y,dw,dh,txt,on,off,gap,st){ gap=gap===undefined?2:gap; st=st||1; var cx=x; for (var i=0;i<txt.length;i++){ var ch=txt[i];
  if (ch===':'){ b.rect(cx,y+Math.round(dh*0.28),st,st,on); b.rect(cx,y+Math.round(dh*0.66),st,st,on); cx+=st+gap; continue; } seg7(b,cx,y,dw,dh,ch,on,off,st); cx+=dw+gap; } return cx-gap; }
// Lichthof um leuchtende Pixel: dunkle Nachbarn bekommen eine Halo-Farbe
function haloPx(b,x0,y0,w,h,isLit,col){ var add=[]; for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ if (isLit(b.get(x,y))) continue; if (isLit(b.get(x-1,y))||isLit(b.get(x+1,y))||isLit(b.get(x,y-1))||isLit(b.get(x,y+1))) add.push(x,y); }
  for (var i=0;i<add.length;i+=2) b.px(add[i],add[i+1],col); }
// kahle Zweige
function branch(b,x,y,len,ang,d,c,sd){ var x2=x+Math.cos(ang)*len, y2=y+Math.sin(ang)*len; b.line(Math.round(x),Math.round(y),Math.round(x2),Math.round(y2),c);
  if (d<=0||len<1.6) return; for (var i=0;i<2;i++){ var a2=ang+(i?1:-1)*(0.3+hash(x*1.3+i,y+sd)*0.5); branch(b,x2,y2,len*(0.64+hash(i+sd,d+x)*0.16),a2,d-1,c,sd); } }
// Streifen entlang einer Achse (für gestreifte Ärmel): Farbe je nach Abstand entlang a→c
function stripes(a,c,per,c1,c2){ var vx=c[0]-a[0], vy=c[1]-a[1], L=Math.hypot(vx,vy)||1; return function(x,y,k){ var t=((x+0.5-a[0])*vx+(y+0.5-a[1])*vy)/L; return (Math.floor(t/per)&1)?c2[k]:c1[k]; }; }

// ---------------------------------------------------------------- Gelenke wie im Rig (02_rig.js)
function ik(ax,ay,tx,ty,l1,l2,bend){ var dx=tx-ax, dy=ty-ay, d=Math.sqrt(dx*dx+dy*dy), md=l1+l2-0.01; if (d>md){ dx*=md/d; dy*=md/d; d=md; } if (d<0.01) d=0.01;
  var a=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d)))), base=Math.atan2(dy,dx), ang=base+bend*a; return [ax+Math.cos(ang)*l1, ay+Math.sin(ang)*l1]; }
// Glied als Kapsel mit drei Tönen [mitte, licht, schatten]; col darf fn(x,y,k) sein (k: 0 mitte, 1 licht, 2 schatten)
function limb(b,a,c,r,col){ var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx<0||(nx===0&&ny>0)){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=Math.max(0,Math.min(1,(px*vx+py*vy)/L2)), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=(qx*nx+qy*ny)/r, k=s>0.4?1:(s<-0.4?2:0); b.px(x,y,typeof col==='function'?col(x,y,k):col[k]); } } }

// ---------------------------------------------------------------- Kinder (von Hand). Seitenansicht, nach rechts gemalt, für 'L' gespiegelt.
// Das Mädchen: dunkler Zopf mit rotem Band, verwaschene Jeansjacke, dunkle Hose, helle Turnschuhe.
// Der Junge (Mali): gestreifter Pullover, zwei Nummern zu groß, Wollmütze mit hellem Rand, große Ohren, Cordhose.
// Dazu zwei andere Kinder für den Sommer 1992 (kurzes Haar, T-Shirt, kurze Hose; Pagenkopf, Kleid).
var KID={
  girl:{ th:7.4, sh:7.2, tl:9.2, tw:2.7, hem:1.6, hr:4.7, ua:5.0, fa:4.7, lr:[1.4,1.2], ar:[1.05,0.95],
    skin:[P.p4,P.p5,P.p3], hair:[P.h2,P.h3,P.h1], top:[P.c3,P.c4,P.c2], leg:[P.m1,P.m2,P.m0], shoe:[P.s6,P.s4], braid:1, tie:P.r3, collar:P.c4 },
  boy:{ th:6.2, sh:6.0, tl:7.8, tw:2.9, hem:2.4, hr:4.5, ua:4.3, fa:4.1, lr:[1.35,1.15], ar:[1.1,1.0],
    skin:[P.p4,P.p5,P.p3], hair:[P.h3,P.w2,P.h2], top:[P.s5,P.s6,P.s4], stripe:[P.r2,P.r3,P.r1], leg:[P.w2,P.w3,P.w1], shoe:[P.w1,P.w2], cap:[P.r3,P.r4,P.r2], rim:[P.s5,P.s6,P.s4], ears:1 },
  kidA:{ th:6.8, sh:6.6, tl:8.6, tw:2.6, hem:1.0, hr:4.5, ua:4.6, fa:4.4, lr:[1.35,1.15], ar:[1.0,0.9], short:1,
    skin:[P.p4,P.p5,P.p3], hair:[P.h1,P.h2,P.k2], top:[P.s4,P.s5,P.s3], leg:[P.c1,P.c2,P.c0], shin:[P.p3,P.p4,P.p2], shoe:[P.k2,P.m1], sleeveSkin:1 },
  kidB:{ th:6.6, sh:6.4, tl:8.4, tw:2.6, hem:1.0, hr:4.6, ua:4.5, fa:4.3, lr:[1.3,1.1], ar:[1.0,0.9], bob:1,
    skin:[P.p4,P.p5,P.p3], hair:[P.w2,P.w3,P.w1], top:[P.y3,P.y4,P.y2], leg:[P.p3,P.p4,P.p2], shoe:[P.r2,P.r3], skirt:5.5, sleeveSkin:1 }
};
// o: kind, f 'R'|'L', hip [x,y], ln (Vorbeugen in px), nf/ff [x,y,'f'|'t'] Füße, nh/fh [x,y] Hände, lk Blickwinkel (0 geradeaus, <0 hinauf, >0 hinab),
//    braid [dx,dy] (Zopfende), bsw (Zopf seitlich schwingen), alpha, sz (Größe). Koordinaten relativ zu den Füßen. Gibt die Bildposition der Hände zurück.
function kid(b,x,y,o){ var k=KID[o.kind]||KID.girl, z=o.sz||1, W=64, H=64, OX=32, OY=58, tb=new M.Buf(W,H,T);
  var th=k.th*z, sh=k.sh*z, tl=k.tl*z, hr=k.hr*z;
  var hip=o.hip?o.hip.slice():[0,-(th+sh+1.4)], ln=o.ln||0, shc=[hip[0]+ln, hip[1]-tl];
  var nf=o.nf||[1.5,0,'f'], ff=o.ff||[-1.5,0,'f'], nh=o.nh||[shc[0]+1.5,hip[1]+0.5], fh=o.fh||[shc[0]-1.2,hip[1]+0.5];
  function X(p){ return OX+p[0]; } function Y(p){ return OY+p[1]; }
  function topC(dk){ return function(xx,yy,kk){ var c=k.top; if (k.stripe && (((yy-OY+64)>>1)&1)) c=k.stripe; c=c[kk]; return dk?M.DN[c]:c; }; }
  function leg(hp,f,dk){ var ank=[f[0],f[1]-1.4], kn=ik(hp[0],hp[1],ank[0],ank[1],th,sh,-1), c=dk?[M.DN[k.leg[0]],k.leg[0],M.DN[k.leg[2]]]:k.leg, c2=k.shin?(dk?[M.DN[k.shin[0]],k.shin[0],M.DN[k.shin[2]]]:k.shin):c;
    limb(tb,[X(hp),Y(hp)],[X(kn),Y(kn)],k.lr[0]*z,c); limb(tb,[X(kn),Y(kn)],[X(ank),Y(ank)],k.lr[1]*z,c2);
    var ax=Math.round(X(ank)-0.5), ay=Math.round(Y(ank)-0.5), s=dk?[M.DN[k.shoe[0]],M.DN[k.shoe[1]]]:k.shoe;
    if (f[2]==='t'){ tb.px(ax,ay+1,s[0]); tb.px(ax+1,ay+1,s[1]); tb.px(ax+1,ay+2,s[1]); }
    else { tb.hl(ax-1,ax+1,ay+1,s[0]); tb.hl(ax-1,ax+2,ay+2,s[1]); } }
  function arm(s,hd,dk){ var el=ik(s[0],s[1],hd[0],hd[1],k.ua*z,k.fa*z,1), c=topC(dk), cs=dk?[k.skin[2],k.skin[0],M.DN[k.skin[2]]]:k.skin;
    limb(tb,[X(s),Y(s)],[X(el),Y(el)],k.ar[0]*z,c); limb(tb,[X(el),Y(el)],[X(hd),Y(hd)],k.ar[1]*z,k.sleeveSkin?cs:c);
    var hx=Math.round(X(hd)-1), hy=Math.round(Y(hd)-1), sc=dk?[k.skin[2],M.DN[k.skin[2]]]:[k.skin[0],k.skin[2]];
    tb.px(hx,hy,sc[0]); tb.px(hx+1,hy,sc[0]); tb.px(hx,hy+1,sc[1]); tb.px(hx+1,hy+1,sc[1]); }
  // ferner Arm, Beine
  arm([shc[0]-0.6,shc[1]+1.2],fh,1);
  leg([hip[0]-0.6,hip[1]],ff,1); leg([hip[0]+0.6,hip[1]],nf,0);
  // Rumpf (Jacke / Pullover / Kleid), leicht schräg zwischen Schulter und Hüfte
  var top=shc[1], bot=hip[1]+k.hem*z, hw=k.tw*z, tc=topC(0), yy, xx;
  for (yy=Math.floor(Y([0,top]));yy<=Math.ceil(Y([0,bot]));yy++){ var t=cl((yy+0.5-Y([0,top]))/Math.max(1,bot-top),0,1), cx=X(shc)+(hip[0]-shc[0])*t, w2=hw*(yy<Y([0,top])+1?0.75:1)+(k.stripe&&t>0.8?0.5:0);
    for (xx=Math.floor(cx-w2-1);xx<=Math.ceil(cx+w2+1);xx++){ var u=(xx+0.5-cx)/w2; if (Math.abs(u)>1) continue; tb.px(xx,yy,tc(xx,yy,u>0.38?1:(u<-0.45?2:0))); } }
  if (k.skirt){ var sy0=Y(hip)-1, sy1=sy0+k.skirt*z; for (yy=Math.round(sy0);yy<=Math.round(sy1);yy++){ var sw=hw+0.5+(yy-sy0)*0.45; for (xx=Math.floor(X(hip)-sw);xx<=Math.ceil(X(hip)+sw);xx++){ var u2=(xx+0.5-X(hip))/sw; if (Math.abs(u2)>1) continue; tb.px(xx,yy,k.top[u2>0.4?1:(u2<-0.4?2:0)]); } } }
  if (k.collar){ tb.px(Math.round(X(shc)+1),Math.round(Y(shc)),k.collar); tb.px(Math.round(X(shc)+2),Math.round(Y(shc)+1),k.collar); }
  // Hals und Kopf
  var ang=o.lk||0, ca=Math.cos(ang), sa=Math.sin(ang), hc=[shc[0]+0.6+ca*0.4, shc[1]-hr+0.2-Math.max(0,-sa)*0.4];
  limb(tb,[X(shc)+0.3,Y(shc)+0.5],[X(hc)-ca*0.8,Y(hc)+hr*0.6],1.1*z,[k.skin[2],k.skin[0],k.skin[2]]);
  var fx=ca, fy=sa, dx=-sa, dy=ca, cxh=X(hc), cyh=Y(hc);
  for (yy=Math.floor(cyh-hr-1);yy<=Math.ceil(cyh+hr+1);yy++) for (xx=Math.floor(cxh-hr-1);xx<=Math.ceil(cxh+hr+1);xx++){
    var px=xx+0.5-cxh, py=yy+0.5-cyh, rr=hr+(k.bob&&(px*fx+py*fy)<0?0.6:0); if (px*px+py*py>rr*rr) continue; var f=(px*fx+py*fy)/hr, dn=(px*dx+py*dy)/hr, c;
    if (k.cap && dn<-0.22+f*0.18){ c=(dn>-0.46+f*0.18)?k.rim[f>0.3?1:(f<-0.5?2:0)]:k.cap[(dn<-0.75&&f>-0.3)?1:(f<-0.55?2:0)]; }
    else if (f>-0.12 && dn>-0.42+(k.braid?0.06:0)+(k.bob?0.08:0)) c=(f<0.12||dn>0.72)?k.skin[2]:k.skin[0];
    else if ((k.short||k.cap) && dn>0.42) c=k.skin[2];
    else c=k.hair[(dn<-0.5&&f>-0.45&&f<0.4)?1:(f<-0.6?2:0)];
    tb.px(xx,yy,c); }
  function hp(fw,dw){ return [Math.round(cxh+fx*fw+dx*dw-0.5), Math.round(cyh+fy*fw+dy*dw-0.5)]; }
  var q=hp(hr+0.35,0.35); tb.px(q[0],q[1],k.skin[0]);                         // Nase
  q=hp(hr*0.52,-hr*0.08); tb.px(q[0],q[1],P.k0);                              // Auge
  q=hp(hr*0.66,hr*0.55); tb.px(q[0],q[1],o.open?P.k1:P.p2);                   // Mund
  if (!k.bob){ q=hp(-hr*0.12,hr*0.12); tb.px(q[0],q[1],k.skin[2]); if (k.ears){ tb.px(q[0]-1,q[1],k.skin[0]); tb.px(q[0]-1,q[1]+1,k.skin[2]); } }   // Ohr
  // Zopf
  if (k.braid){ var bs=[cxh-fx*hr*0.78+dx*hr*0.32, cyh-fy*hr*0.78+dy*hr*0.32], be=o.braid||[-1.2,8.5], n=Math.max(4,Math.round(Math.hypot(be[0],be[1])*1.4));
    for (var i=0;i<=n;i++){ var t2=i/n, bx=Math.round(bs[0]+be[0]*t2+(o.bsw||0)*Math.sin(t2*Math.PI)-0.5), by=Math.round(bs[1]+be[1]*t2-0.5), cc=(i%2)?k.hair[1]:k.hair[0];
      if (t2>0.78 && t2<0.9) cc=k.tie; else if (t2>=0.9) cc=k.hair[0]; tb.px(bx,by,cc); if (t2<0.9){ if (Math.abs(be[1])>=Math.abs(be[0])) tb.px(bx+1,by,(i%2)?k.hair[0]:k.hair[2]); else tb.px(bx,by+1,(i%2)?k.hair[0]:k.hair[2]); } } }
  // naher Arm zuletzt
  arm([shc[0]+0.6,shc[1]+1.2],nh,0);
  M.outline(tb,P.k1);
  var fl=o.f==='L'; blitA(b,tb,Math.round(x)-(fl?W-1-OX:OX),Math.round(y)-OY,fl,o.alpha);
  var sg=fl?-1:1; return { nh:[x+sg*nh[0],y+nh[1]], fh:[x+sg*fh[0],y+fh[1]], head:[x+sg*hc[0],y+hc[1]] }; }

// ---------------------------------------------------------------- Hände um eine senkrechte Stange (Nahaufnahme). Die Hand kommt von rechts:
// Handrücken rechts der Stange, die Finger legen sich vorn um die Stange, der Daumen oben. pc = Stangenmitte, y0 = Oberkante, s = Größe.
function fist(b,pc,y0,s,skin){ var tb=new M.Buf(b.w,b.h,T), bw=5.6*s, bh=7*s, bx=pc+3*s+bw*0.7, by=y0+bh+0.5;
  tb.ellipse(bx,by,bw,bh,function(x,y){ return (y<by-bh*0.45)?skin[1]:(x>bx+bw*0.45?skin[2]:skin[0]); });
  var nfg=4, sp=(bh*2-1.2*s)/nfg;
  for (var i=0;i<nfg;i++){ var fy=y0+1.6*s+i*sp; limb(tb,[bx-1.5*s,fy],[pc-2.6*s+(i===3?0.8*s:0),fy+0.3*s],1.3*s,skin); tb.px(Math.round(bx-1.5*s),Math.round(fy-0.5*s),skin[1]); }
  limb(tb,[bx-0.5*s,y0+0.6*s],[pc-1*s,y0-0.4*s],1.35*s,skin);
  M.outline(tb,P.k1); blitA(b,tb,0,0,false,1); return {wrist:[bx+bw*0.6,by]}; }

// ---------------------------------------------------------------- zwei Figuren von damals im Rig-Format (nur für diese Bilder)
function LG(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// HALID KADIĆ (um 50, 1973): schwarzes, zurückgekämmtes Haar, dichter Schnurrbart, schwere Brauen, weißes Hemd, dunkle Weste mit Messingknöpfen
var haS=[
"............",
"...kkkkkk...",
"..kHHHHhHk..",
".kHHHHHhhHk.",
".kHHHHHHSSSk",
".kHHHHSBBSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
".ktSSSSSbbbk.",
".ktSSSSbbbbk.",
"..ktSSSSSmk..",
"...ktSSSSk...",
"....kttk....",
"....ktsk...."];
// der alte Meister (um 70, 1972): Baskenmütze, weißes Haar an den Schläfen, weißer Schnurrbart, runde Brille, Flanellhemd, Lederschürze
var mjS=[
"............",
"...kkkkkk...",
"..kCCCcCCkk.",
".kCCCCCCCCCk",
".kjjSSSSSSk.",
".kjjSSSSSSSk",
".kjtSSgggeSk",
".kjtSSSSSSSSk",
"..ktSSSwwwwk.",
"..ktSSSSSmk..",
"...ktSSSSk...",
"....kkkkk....",
"....ktsk....",
"....ktsk...."];
if (!M.CHARS.k2m_halid) M.defineChar('k2m_halid',{ legend:LG({H:P.h1,h:P.h3,B:P.h0,b:P.h1,S:P.p4,s:P.p3,t:P.p2,m:P.p1}), heads:{S:M.headSet(haS)}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.w1,P.w2,P.w0],buttons:P.y3,vneck:P.s5,side:8,belly:1},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.s4,P.s5,P.s3],sleeveF:[P.s3,P.s4,P.s2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2} });
if (!M.CHARS.k2m_majstor) M.defineChar('k2m_majstor',{ legend:LG({C:P.m1,c:P.m3,j:P.s5,g:P.m3,S:P.p4,s:P.p3,t:P.p2,m:P.p1}), heads:{S:M.headSet(mjS)}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:[P.r1,P.r2,P.r0],apron:[P.w2,P.w3],side:8,hunch:1,belly:1}, bones:[10,9,8,7],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.r1,P.r2,P.r0],sleeveF:[P.r0,P.r1,P.k1],arm:[P.p4,P.p5,P.p3],armF:[P.p3,P.p4,P.p2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2} });

// ---------------------------------------------------------------- Hochhäuser aus Betonplatten (Alipašino Polje)
// flach von vorn: x0..x1, oben y0, unten y1; opt: fl (Geschosshöhe), bay (Achsbreite), lit (Anteil erleuchteter Fenster), night, seed, ramp, laundry
function tower(b,x0,x1,y0,y1,opt){ opt=opt||{}; var fl=opt.fl||5, sd=opt.seed||1, con=opt.ramp||(opt.night?R('k2 m0 m1 m2'):R('s1 s2 s3 s4')), bay=opt.bay||14;
  for (var y=y0;y<y1;y++) for (var x=x0;x<x1;x++){ var fy=(y-y0)%fl, row=Math.floor((y-y0)/fl), bx=(x-x0)%bay, col=Math.floor((x-x0)/bay), c;
    if (y-y0<2){ c=con[3]; }
    else if (bx<2){ c=con[bx===0?1:2]; }
    else if (fy<2){ c=con[fy===0?3:2]; if (hash(col*3+sd,row)<0.12) c=con[1]; }
    else { var lit=opt.lit && hash(col+sd*7,row*3)<opt.lit, win=bx>3 && bx<bay-2; c=con[0]; if (win) c=lit?(fy===2?P.y3:P.y4):(opt.night?P.k1:M.DN[con[0]]); }
    if (x-x0<1) c=con[3]; if (x1-1-x<1) c=con[0];
    b.px(x,y,c); }
  if (opt.laundry) for (var i=0;i<opt.laundry;i++){ var lr=1+Math.floor(hash(i,sd+2)*((y1-y0)/fl-2)), lc=Math.floor(hash(sd,i+5)*((x1-x0)/bay)), lx=x0+lc*bay+4, ly=y0+lr*fl+2;
    if (lx+6<x1){ b.px(lx,ly,P.s6); b.px(lx+1,ly,P.s5); b.px(lx+3,ly,[P.r3,P.b3,P.s6,P.y4][i%4]); b.px(lx+4,ly,[P.r2,P.b2,P.s5,P.y3][i%4]); } } }
// in Untersicht (die Geschosse werden nach oben kürzer, die Kanten laufen zusammen): cx Mitte, yb Fuß, yt Dachkante, wb/wt Breite, nf Geschosse
function towerP(b,cx,yb,yt,wb,wt,nf,opt){ opt=opt||{}; var g=opt.g===undefined?0.8:opt.g, con=opt.ramp||R('k2 m0 m1 m2'), bays=opt.bays||8, sd=opt.seed||1, sw=opt.side||0;
  for (var y=yt;y<yb;y++){ var t=(yb-1-y)/Math.max(1,yb-1-yt), hw=(wb+(wt-wb)*t)/2, r=t/(1+g-g*t), fr=r*nf, row=Math.floor(fr), fy=fr-row, xl=cx-hw, xr=cx+hw, sdw=sw*(1-t*0.4);
    for (var x=Math.floor(xl);x<Math.ceil(xr+sdw);x++){ var c;
      if (x>=xr){ var us=(x-xr)/Math.max(1,sdw); c=(fy<0.36)?con[1]:con[0]; if (fy>=0.36 && us>0.25 && us<0.75 && opt.lit && hash(row+sd*5,Math.floor(us*3))<opt.lit*0.7) c=P.y2; if (y<=yt+1) c=con[2]; b.px(x,y,c); continue; }
      var u=(x+0.5-xl)/(xr-xl); if (u<0) continue; var bu=u*bays, bi=Math.floor(bu), bf=bu-bi;
      if (y<=yt+1) c=con[3];
      else if (bf<0.1) c=con[2];
      else if (fy<0.36) c=con[fy<0.12?3:2];
      else { var lit=opt.lit && hash(bi*3+sd,row*7)<opt.lit, win=bf>0.24 && bf<0.86; c=con[0]; if (win) c=lit?((fy<0.52)?P.y3:P.y4):(opt.night?P.k1:M.DN[con[0]]); if (bf<0.17) c=M.DN[con[0]]; }
      if (u<0.015) c=con[3];
      b.px(x,y,c); } } }
// Spitzbogen (gleichseitig, in der Höhe gestaucht): liegt (x,y) in der Öffnung zwischen xl und xr, Kämpfer ys, Scheitel yt?
function archTop(x,xl,xr,ys,yt){ var s=xr-xl, d=Math.min(x+0.5-xl,xr-x-0.5); if (d<0) return 1e9; var k=(ys-yt)/(0.866*s); return ys-k*Math.sqrt(Math.max(0,s*s-(s-d)*(s-d))); }

// ---------------------------------------------------------------- Kupferwaren (Werkstatt, Kafana): Tablett, Džezva am Haken, Laterne
function tray(b,cx,cy,r){ b.ellipse(cx,cy,r,r,function(x,y){ var dx=x+0.5-cx, dy=y+0.5-cy, d=Math.hypot(dx,dy)/r, v=0.5-d*0.12-(dx+dy)/(r*4.5);
    if (d>0.82) v=0.86-(dx+dy)/(r*2.6); else if (Math.abs(d-0.56)<0.08) v-=0.28; else if (d<0.18) v+=0.12; return ra(R('t1 t2 t3 t4 t5'),v,x,y); });
  b.line(Math.round(cx-r*0.6),Math.round(cy-r*0.15),Math.round(cx-r*0.15),Math.round(cy-r*0.6),P.y5); b.px(Math.round(cx-r*0.4),Math.round(cy-r*0.4),P.l0); b.px(cx,Math.round(cy-r)-1,P.k2); }
function dzezva(b,x,y,s){ var rx=x-s-1, ry=y+s+3; b.line(x,y,rx+s,ry,P.w3); b.px(x,y-1,P.k2);
  for (var yy=0;yy<=s*2;yy++){ var hw=Math.round(s*0.55+yy*0.45); for (var xx=-hw;xx<=hw;xx++){ var c=xx<=-hw+1?P.t4:(xx>=hw-1?P.t2:P.t3); if (yy===0) c=P.t5; b.px(rx+xx,ry+yy,c); } }
  b.px(rx-Math.round(s*0.55)-1,ry,P.t4); b.px(rx-1,ry+2,P.y5); }
function lantern(b,x,y){ b.vl(x,y,y+3,P.k2); b.rect(x-3,y+4,7,2,P.t3); b.hl(x-3,x+3,y+4,P.t5); b.rect(x-2,y+6,5,7,P.k2); b.vl(x-2,y+6,y+12,P.t3); b.vl(x+2,y+6,y+12,P.t2); b.px(x,y+9,P.y3); b.rect(x-3,y+13,7,2,P.t2); }

// ================================================================ 1. Im Bus (memory): Neretva tief unten, Berge, Nebel, eine Hand an der Scheibe
M.mem.k2_bus=function(b){ var w=b.w,h=b.h, X0=12, X1=219, Y0=6, Y1=67, RC=7, x, y, i;
  b.rect(0,0,w,h,P.k1);
  function inWin(x,y){ if (x<X0||x>X1||y<Y0||y>Y1) return false; var cx=cl(x,X0+RC,X1-RC), cy=cl(y,Y0+RC,Y1-RC); return (x-cx)*(x-cx)+(y-cy)*(y-cy)<=RC*RC+1; }
  var o=new M.Buf(w,h,P.s5);
  // Himmel: verhangen
  fill(o,0,0,w,64,function(x,y){ return ra(R('s4 s4 s5 s5 s6'),0.1+y/36+(fbm(x,y*2,22,2)-0.5)*0.3,x,y); });
  // ferne Kämme
  var f1=function(x){ return 14+Math.round(8*fbm(x,1,44,3)+Math.sin(x*0.023)*3); }, f2=function(x){ return 23+Math.round(9*fbm(x,2,34,5)-Math.sin(x*0.016+1)*3); };
  for (x=0;x<w;x++){ for (y=f1(x);y<64;y++) o.px(x,y,ra(R('s2 s2 s3 s3'),0.45+(y-f1(x))/40+(fbm(x,y,8,4)-0.5)*0.3,x,y));
    for (y=f2(x);y<64;y++) o.px(x,y,ra(R('e1 s1 s1 s2'),0.3+(y-f2(x))/50+(fbm(x,y,7,6)-0.5)*0.4,x,y)); }
  // erster Schnee auf den hohen Gipfeln (Prenj, Čvrsnica)
  for (x=0;x<w;x++){ var pk=f1(x); if (pk<f2(x)-2 && pk<20) for (y=pk;y<Math.min(f2(x),pk+4+Math.round(hash(x>>1,3)*3));y++) if (bayer(x,y)<0.85-(y-pk)*0.12) o.px(x,y,(y===pk)?P.s6:P.s5); }
  // die gegenüberliegende Schluchtwand: rechts steil und hoch, links öffnet sich das Tal
  var wt=function(x){ return Math.round(47-34*sm((x-8)/200)+Math.sin(x*0.11)*1.2+(fbm(x,0,12,9)-0.5)*7); }, rv=function(x){ return Math.round(50+5*sm((x-30)/180)+Math.sin(x*0.05+1.2)*1.4); }, bw=function(x){ return 3+Math.round(5*sm((x-30)/170)); };
  var ROCK=R('k1 k2 g0 g1 e1 g2 e2 s2 s3');
  for (x=0;x<w;x++){ var t0=wt(x), r0=rv(x); for (y=t0;y<r0;y++){ var d=(y-t0)/Math.max(5,r0-t0), cliff=Math.sin(x*0.7+fbm(x,y,6,4)*6)*0.16, v=0.56-d*0.5+(fbm(x,y,6,6)-0.5)*0.32+cliff+(y-t0<2?0.42:0)-(d>0.8?0.22:0);
      var c=ra(ROCK,v,x,y); if (hash(x>>1,y>>1)<0.05) c=M.DN[c]; if (hash(x,y>>1)>0.985) c=M.UP[M.UP[c]]; o.px(x,y,c); } }
  // eine Straße am Gegenhang mit einem Tunnelmund
  for (x=118;x<w;x++){ var ly=Math.round(wt(118)+8+(x-118)*-0.1+(fbm(x,3,20,2)-0.5)*2); if (ly>wt(x)+2 && ly<rv(x)-3){ o.px(x,ly,P.s3); o.px(x,ly+1,P.k2); } }
  var tu=Math.round(wt(118)+8+(150-118)*-0.1); if (tu>wt(150)+2) o.ellipse(150,tu-1,2,2,function(x,y){ return y<=tu?P.k0:undefined; });
  // der Fluss: smaragdgrün, mit Stromschnellen
  for (x=0;x<w;x++){ var r1=rv(x), bb=bw(x); for (y=r1;y<r1+bb;y++){ var fl=Math.sin(x*0.33+y*1.9)+Math.sin(x*0.08-y*0.7), c2=ra(R('a3 a4 a5 a6'),0.3+(y-r1)/bb*0.45+fl*0.13,x,y); if (fl>1.35) c2=P.l1; if (y===r1) c2=P.a2; o.px(x,y,c2); }
    for (y=r1+bb;y<h;y++) o.px(x,y,ra(R('k1 k2 g0 g1'),0.75-(y-r1-bb)/14+(fbm(x,y,5,8)-0.5)*0.4,x,y)); }
  // Baumspitzen am diesseitigen Hang, vom Fahren verwischt
  for (i=0;i<18;i++){ var tx=Math.floor(hash(i,3)*w), th=6+Math.floor(hash(i,4)*9), base=rv(tx)+bw(tx)+3+Math.floor(hash(i,5)*7);
    for (y=base-th;y<=base;y++){ var hw=Math.max(0,(y-(base-th))*0.38); for (x=Math.floor(tx-hw);x<=tx+hw;x++){ o.px(x,y,(x<tx)?P.k1:P.g0); for (var k=1;k<7;k++) if (bayer(x+k,y)<0.55-k*0.08) o.px(x+k,y,P.k2); } } }
  // Nebel: links im Tal (dort verschwindet der Fluss), zwischen den Kämmen, an der Kante der Wand
  M.fogBake(o,function(x,y){ var a=sm((66-x)/66)*sm((y-12)/26)*0.9; a+=Math.max(0,1-Math.abs(y-(f2(x)+3))/7)*0.45; a+=Math.max(0,1-Math.abs(y-(rv(x)-1))/4)*0.6*sm((110-x)/60); a+=Math.max(0,1-Math.abs(y-(wt(x)+2))/5)*0.2*sm((x-90)/60); return Math.min(0.96,a+(fbm(x,y,14,12)-0.5)*0.26); },{col:P.s5});
  // Leitplanke
  for (x=0;x<w;x++){ o.px(x,Y1-5,P.m4); o.px(x,Y1-4,P.m3); o.px(x,Y1-3,P.m1); if ((x+5)%34<2){ for (y=Y1-6;y<=Y1+1;y++) o.px(x,y,P.k2); } }
  for (x=0;x<w;x++) for (y=0;y<h;y++) if (inWin(x,y)) b.px(x,y,o.get(x,y));
  // ein Hauch Spiegelung auf dem Glas
  for (x=X0;x<=X1;x++) for (y=Y0;y<=Y1;y++){ if (!inWin(x,y)) continue; var dg=(x*0.8+y*1.2)-40; if (dg>0 && dg<3 && bayer(x,y)<0.4) b.px(x,y,M.UP[b.get(x,y)]); }
  // Gummidichtung, Rahmen, Verkleidung
  for (x=0;x<w;x++) for (y=0;y<76;y++){ if (inWin(x,y)) continue; var e=Math.hypot(Math.max(0,Math.abs(x-cl(x,X0+RC,X1-RC))-RC+1),Math.max(0,Math.abs(y-cl(y,Y0+RC,Y1-RC))-RC+1));
    e=Math.max(e,X0-x,x-X1,Y0-y,y-Y1); if (e<=2) b.px(x,y,P.k2); else if (e<=4) b.px(x,y,y<Y0+4?P.m1:P.m2); else b.px(x,y,ra(R('k1 k2 m0 m1'),0.35+(fbm(x,y,20,5)-0.5)*0.4,x,y)); }
  b.rect(0,0,w,3,P.k1); b.hl(0,w-1,3,P.m1);
  // Fensterbank mit Aschenbecherklappe
  b.rect(0,69,w,6,P.m1); b.hl(0,w-1,69,P.m3); b.hl(0,w-1,70,P.m2); b.hl(0,w-1,74,P.k1); b.rect(94,71,14,3,P.m3); b.hl(94,107,71,P.m4); b.hl(95,106,73,P.m1);
  // Vorhang links, gerafft
  for (y=0;y<77;y++){ var cw=14+Math.round(Math.sin(y*0.08)*1.5)+(y>38&&y<46?-4:0); for (x=0;x<cw;x++){ var fold=Math.sin((x+y*0.12)*1.15), cc=fold>0.55?P.e3:(fold<-0.35?P.e1:P.e2); if (x===cw-1) cc=P.e1; b.px(x,y,cc); } }
  b.rect(0,40,12,4,P.e1); b.hl(0,11,40,P.e3); b.hl(0,11,43,P.k2);
  // Rückenlehnen der Reihe davor, mit Kopfschutztüchern (der Bus ist fast leer)
  function seat(x0,x1,y0){ for (var yy=y0;yy<h;yy++) for (var xx=x0;xx<x1;xx++){ var rr=7, ex=Math.max(0,x0+rr-xx,xx-(x1-1-rr)), ey=Math.max(0,y0+rr-yy); if (ex*ex+ey*ey>rr*rr) continue;
      var u=(xx-x0)/(x1-x0), pat=(((xx>>1)+(yy>>1))%4===0), c=pat?P.c1:P.c2; if (u<0.05) c=P.c0; else if (u>0.94) c=P.c1; else if (u<0.12 || yy<y0+3) c=M.UP[c]; b.px(xx,yy,c); }
    var cx0=x0+14, cx1=x1-14; for (xx=cx0;xx<cx1;xx++){ var sag=Math.round(Math.sin((xx-cx0)/(cx1-cx0)*Math.PI)*1.5), bot=y0+11+sag;
      for (yy=y0-1;yy<=bot;yy++){ var c2=P.s4; if (yy<y0+2) c2=P.s5; if (xx<cx0+1||xx>cx1-2) c2=P.s3; if (yy===bot) c2=P.s2; if (yy===y0+7+Math.round(sag/2)) c2=P.c3; if (((xx-cx0)%13===6) && yy>y0+1 && yy<bot-1) c2=P.s4; b.px(xx,yy,c2); } } }
  seat(16,104,80); seat(118,216,80); b.rect(104,78,14,26,P.k1);
  for (y=82;y<92;y++) b.px(105,y,P.m3); b.hl(105,110,82,P.m4);
  // Malas Hand an der Scheibe: Handrücken, die Finger gespreizt, die Kuppen gegen das Glas gedrückt; der Ärmel verliert sich
  var HB=new M.Buf(w,h,T), SK=[P.p3,P.p4,P.p2];
  function finger(x0,y0,x1,y1,r0,r1){ var mx=x0*0.45+x1*0.55, my=y0*0.45+y1*0.55; limb(HB,[x0,y0],[mx,my],r0,SK); limb(HB,[mx,my],[x1,y1],r1,SK); }
  limb(HB,[160,48],[148,70],4.2,[P.c1,P.c2,P.c0]); limb(HB,[162,44],[160,49],3.5,[P.c2,P.c3,P.c1]);
  HB.poly([[156,32],[171,30],[175,37],[172,45],[159,46],[155,39]],function(x,y){ return (y<34)?P.p4:((x>170||y>43)?P.p2:P.p3); });
  finger(158,33,154,22,1.45,1.15); finger(162,31,160,18,1.5,1.2); finger(166,30,166,16,1.5,1.2); finger(170,31,173,19,1.45,1.15); finger(157,40,149,34,1.6,1.3);
  [[158,33],[162,31],[166,30],[170,31]].forEach(function(p){ HB.px(p[0],p[1],P.p5); });
  [[154,22],[160,18],[166,16],[173,19],[149,34]].forEach(function(p){ HB.px(p[0],p[1],P.p5); });
  M.outline(HB,P.p1);
  for (y=0;y<h;y++) for (x=0;x<w;x++){ var c4=HB.d[y*w+x]; if (c4===T) continue; var fade=y<46?1:Math.max(0,1-(y-46)/14); if (bayer(x,y)<fade) b.px(x,y,c4); }
  [[154,20],[160,16],[166,14],[173,17],[148,33]].forEach(function(p){ b.ellipse(p[0],p[1],2.4,2,function(x,y){ var c=b.get(x,y); return (HB.get(x,y)===T && bayer(x,y)<0.5)?M.UP[c]:c; }); });
  M.light(b,M.lf.sum(M.lf.band(64,104,0,-1.5),M.lf.pool(116,34,130,46,0.5,1)));
  edgeDark(b,1.8); };

// ================================================================ 2. Samstag (ghost): ein entwerteter Fahrschein in einer Kinderhand, zwei Hände an derselben Stange
M.mem.k2_saturday=function(b){ var w=b.w,h=b.h, x, y, i;
  // Decke, Neonröhre, waagrechte Haltestange
  fill(b,0,0,w,13,function(x,y){ return ra(R('s2 s3 s4'),0.3+y/15,x,y); });
  b.rect(16,3,200,2,P.l1); b.hl(16,215,5,P.s5); b.hl(16,215,2,P.s4);
  for (x=0;x<w;x++){ b.px(x,10,P.y4); b.px(x,11,P.y2); } for (i=0;i<4;i++) b.vl(i*64+30,6,10,P.m2);
  // Fenster gegenüber: draußen zieht die Stadt vorbei
  var WY0=15, WY1=50;
  for (y=WY0;y<WY1;y++) for (x=0;x<w;x++){ var sk=12+fbm(x*0.06,0,2,4)*14, c;
    if (y-WY0<sk*0.7) c=ra(R('b4 b5 s6 l1'),0.4+(y-WY0)/20,x,y);
    else { var st=Math.sin(y*1.7+fbm(x*0.03,y,2,6)*3)*0.5+(fbm(x*0.05,y*2,2,5)-0.5); c=ra(R('s1 s2 s3 s3 s4'),0.45+st*0.5,x,y); if (((y*5+(x>>4))%11)===0) c=P.s5; }
    b.px(x,y,c); }
  for (i=0;i<4;i++){ var px0=i*66-8; b.rect(px0,WY0,9,WY1-WY0,P.s4); b.vl(px0,WY0,WY1-1,P.s5); b.vl(px0+8,WY0,WY1-1,P.s2); b.vl(px0+9,WY0,WY1-1,P.m3); b.vl(px0-1,WY0,WY1-1,P.m3); }
  b.hl(0,w-1,WY0-1,P.m3); b.hl(0,w-1,WY0-2,P.m1); b.hl(0,w-1,WY1,P.m3); b.hl(0,w-1,WY1+1,P.m4); b.hl(0,w-1,WY1+2,P.m2);
  // Wand unter den Fenstern, Sitzbänke (Kunstleder, rotbraun) mit Haltegriffen, Boden
  fill(b,0,53,w,6,function(x,y){ return y<54?P.s4:(y>57?P.s2:P.s3); });
  for (y=59;y<82;y++) for (x=0;x<w;x++){ var seg=(x+20)%58, c2=ra(R('r0 r1 t1 t2 t3'),0.7-(y-59)/28+(seg<3?-0.45:0)+(seg>54?-0.25:0),x,y); if ((seg===19||seg===38) && y>61) c2=M.DN[c2]; b.px(x,y,c2); }
  for (i=0;i<4;i++){ var gx=i*58+18; b.rect(gx,56,9,2,P.m4); b.px(gx,58,P.m2); b.px(gx+8,58,P.m2); }
  fill(b,0,82,w,h-82,function(x,y){ return ((y+(x>>1))%3===0)?P.k1:P.k2; });
  // die Stange (gelb lackiert), mit dem Entwerter
  var PC=112; for (y=10;y<h;y++){ b.px(PC-2,y,P.y1); b.px(PC-1,y,P.y3); b.px(PC,y,P.y4); b.px(PC+1,y,P.y3); b.px(PC+2,y,P.y1); }
  b.rect(PC-4,9,9,3,P.y2); b.hl(PC-4,PC+4,9,P.y4);
  b.rect(PC-6,70,13,10,P.t2); b.rect(PC-5,71,11,8,P.t4); b.hl(PC-4,PC+4,73,P.k1); b.hl(PC-6,PC+6,70,P.t5); b.px(PC+3,76,P.r4);
  // die große Hand: Jeansärmel von rechts (Ober- und Unterarm), Manschette mit Knopf, Farbe an den Fingern
  limb(b,[244,48],[188,38],7.2,[P.c1,P.c2,P.c0]); limb(b,[188,38],[133,29],6.0,[P.c2,P.c3,P.c1]); b.line(186,33,138,25,P.c4); b.line(188,43,140,34,P.c1); b.line(214,38,190,34,P.c3);
  limb(b,[128,29],[135,28],5.6,[P.c3,P.c4,P.c2]); b.px(133,33,P.y3); b.px(134,33,P.y4);
  fist(b,PC,21,1,[P.p4,P.p5,P.p3]);
  b.px(109,25,P.b4); b.px(110,25,P.b3); b.px(108,31,P.y4); b.px(111,34,P.r4);
  // die kleine Hand darunter: gestreifter Ärmel von unten rechts
  limb(b,[126,56],[170,112],4.6,stripes([126,56],[170,112],3,[P.s5,P.s6,P.s4],[P.r2,P.r3,P.r1])); limb(b,[124,55],[128,59],4.2,[P.s5,P.s6,P.s4]);
  fist(b,PC,46,0.72,[P.p4,P.p5,P.p3]);
  // vorn: der Fahrschein mit Löchern in der Kinderhand (Ärmel gestreift, Finger dahinter, der Daumen vorn)
  var tx=48, ty=64, tw=46, th=23, SKN=[P.p4,P.p5,P.p3];
  limb(b,[-12,118],[33,99],11,stripes([-12,118],[33,99],4,[P.s5,P.s6,P.s4],[P.r2,P.r3,P.r1]));
  b.ellipse(42,94,10,8,function(x,y){ return y<90?P.p5:(x<36?P.p3:P.p4); });                 // die Faust unter dem Schein
  for (i=0;i<3;i++){ var kfx=50-i*0.6, kfy=88.5+i*3.6; b.ellipse(kfx,kfy,3.4,2,function(x,y){ return y<kfy?P.p5:P.p4; }); b.hl(Math.round(kfx-2),Math.round(kfx+2),Math.round(kfy+1.6),P.p3); }   // die gekrümmten Finger
  b.poly([[tx,ty],[tx+tw,ty-2],[tx+tw+1,ty+th-2],[tx+1,ty+th]],P.s5);
  b.line(tx,ty,tx+tw,ty-2,P.s6); b.line(tx+tw,ty-2,tx+tw+1,ty+th-2,P.s3); b.line(tx+1,ty+th,tx+tw+1,ty+th-2,P.s3); b.line(tx,ty,tx+1,ty+th,P.s4);
  b.poly([[tx+1,ty+1],[tx+tw-1,ty-1],[tx+tw-1,ty+6],[tx+1,ty+8]],P.r3); M.microText(b,'GRAS',tx+4,ty+2,P.s6); b.rect(tx+tw-10,ty+1,6,4,P.s5); M.microText(b,'3',tx+tw-9,ty,P.r2);
  M.microText(b,'VOŽNJA',tx+5,ty+11,P.n1); M.microText(b,'0471',tx+11,ty+17,P.s2);
  for (var gx2=0;gx2<3;gx2++) for (var gy2=0;gy2<2;gy2++){ var hx=tx+29+gx2*5, hy=ty+10+gy2*5; b.rect(hx,hy,4,4,P.s4); b.rect(hx+1,hy+1,2,2,P.s5); }
  [[tx+30,ty+11],[tx+40,ty+11],[tx+35,ty+16]].forEach(function(p){ b.rect(p[0],p[1],2,2,P.k1); b.px(p[0]+2,p[1]+1,P.s3); b.px(p[0],p[1]+2,P.s6); });
  limb(b,[44,87],[51,82],2.9,SKN); b.px(52,81,P.s6); b.px(51,80,P.p5); b.px(53,82,P.p5); b.px(49,85,P.p3);   // der Daumen vorn auf dem Schein
  M.light(b,M.lf.sum(M.lf.k(-0.3),M.lf.pool(120,30,70,40,1.0,1),M.lf.pool(66,80,64,30,1.2,1),M.lf.band(82,104,0,-0.8)));
  edgeDark(b,2.0); };

// ================================================================ 3. Die Uhr (ghost): Betonhochhaus bei Nacht, grüne Ziffern, zwei Kinder sehen hinauf und rennen los
M.mem.k2_clock=function(b){ var w=b.w,h=b.h, x, y, i;
  M.sky(b,0,0,w,96,'night',41); M.vgrad(b,0,56,w,40,R('k2 n0 n1 n1 n2'));
  // Nachbartürme, ferner
  tower(b,0,38,40,96,{night:1,lit:0.12,seed:5,fl:4,bay:10});
  tower(b,204,232,34,96,{night:1,lit:0.14,seed:9,fl:4,bay:10});
  // Haus 7 in Untersicht
  towerP(b,124,96,31,120,92,16,{g:0.9,bays:7,lit:0.24,seed:7,side:12,ramp:R('k2 m0 m1 m2')});
  // auf dem Dach: Gestell, Kasten, grüne Ziffern
  for (i=0;i<5;i++){ var px=96+i*14; b.vl(px,25,31,P.k2); } b.line(96,31,152,25,P.k2); b.line(96,25,152,31,P.k2);
  b.rect(92,10,64,16,P.k1); b.rect(93,11,62,14,P.k0); b.hl(92,155,10,P.m1); b.hl(92,155,25,P.m0);
  M.light(b,M.lf.pool(124,18,86,30,1.8,1.3));
  b.rect(93,11,62,14,P.k0);
  clock7(b,98,12,9,12,'11:10',P.a6,undefined,3,2);
  haloPx(b,94,11,60,14,function(c){ return c===P.a6; },P.a3);
  for (x=94;x<155;x++) for (y=12;y<25;y++) if (b.get(x,y)===P.a6 && (x+y)%5===0) b.px(x,y,P.l1);
  for (x=96;x<152;x++) if (bayer(x,26)<0.5) b.px(x,26,P.a3);
  // Hof: Weg, Wiese, Laterne, Klettergerüst
  fill(b,0,96,w,h-96,function(x,y){ var c=ra(R('k1 k2 m0 m1'),0.35+(y-96)/14+(fbm(x,y,6,3)-0.5)*0.4,x,y); if (y===96) c=P.m1; return c; });
  b.rect(0,92,w,4,P.g0); for (x=0;x<w;x+=2) if (hash(x,3)<0.6) b.px(x,91,P.g1);
  for (i=0;i<4;i++){ var ax=184+i*12; for (x=ax;x<ax+11;x++){ var yy=94-Math.round(Math.sin((x-ax)/10*Math.PI)*14); b.px(x,yy,P.m1); } }
  b.hl(184,231,94,P.m0);
  b.rect(20,44,2,52,P.m0); b.vl(20,44,95,P.m1); b.rect(15,40,11,4,P.m1); b.rect(16,44,9,2,P.y4);
  // die Kinder: das Mädchen läuft schon los und sieht noch hinauf, sie zieht den Jungen an der Hand
  var g=kid(b,66,100,{kind:'girl',f:'R',ln:2.5,lk:-0.8,hip:[0.5,-16.4],nf:[6,0,'f'],ff:[-5.5,-1.5,'t'],nh:[5,-20],fh:[-6.5,-17],braid:[-4.5,6.5],open:1});
  kid(b,46,101,{kind:'boy',f:'R',ln:1,lk:-0.9,nf:[3.5,0,'f'],ff:[-3,-1,'t'],nh:[g.fh[0]-46,g.fh[1]-101+1],fh:[-3,-14],open:1});
  // Licht: Laterne, der grüne Schein von oben
  M.light(b,M.lf.sum(M.lf.pool(24,92,58,20,1.9,1),M.lf.pool(56,84,36,28,1.3,1)));
  b.rect(16,44,9,2,P.y4); b.px(19,45,P.l0); b.px(20,45,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 4. Unter der Uhr (ghost): November 1972, Tomaž unter der Sahat-kula mit dem offenen Kästchen
M.mem.k2_tomaz=function(b){ var w=b.w,h=b.h, G=97, x, y, i;
  M.vgrad(b,0,0,w,G,R('k1 n0 n0 n1 n1 n2 n2'));
  var r=M.rng(72); for (i=0;i<30;i++){ var sx=Math.floor(r()*w), sy=Math.floor(r()*44); b.px(sx,sy,r()<0.2?P.n5:(r()<0.5?P.n4:P.n3)); }
  // hinten: Kuppel und Minarett der Begova džamija, kahle Bäume im Hof
  b.ellipse(14,74,30,18,function(x,y){ return y<74?(x<8?P.m2:P.m1):undefined; }); b.vl(14,50,56,P.y2); b.px(14,49,P.y3);
  M.scn.minaret(b,34,76,70,{stone:R('s1 s2 s3 s4'),cap:R('m0 m1 m2 m3')});
  for (i=0;i<3;i++) branch(b,[96,128,150][i],74,9,-Math.PI/2+(i-1)*0.2,5,P.k2,i*7);
  // Mauer des Moscheehofs mit Bogentor
  fill(b,0,70,w,G-70,function(x,y){ var c=M.tex.ashlar(x,y,R('s1 s2 s2 s3'),12,5); return y<72?P.s3:c; });
  for (y=74;y<G;y++) for (x=98;x<120;x++){ if (y>=archTop(x,98,120,82,74)) b.px(x,y,(x<101||x>116)?P.s3:P.k1); }
  // rechts die Kafana „Kula“: helles Fenster mit Vorhang, Vordach, Tür
  fill(b,168,46,64,G-46,function(x,y){ return M.tex.plaster(x,y,R('s2 s3 s4'),70); });
  b.rect(176,58,30,22,P.w1); fill(b,178,60,26,18,function(x,y){ return (Math.sin(x*1.6)>0.3)?P.y5:((y<66)?P.y4:P.y3); }); b.vl(191,60,77,P.w2);
  b.rect(214,64,14,G-64,P.w2); b.rect(216,66,10,G-68,P.w1); b.px(217,80,P.y3);
  for (x=164;x<232;x++){ b.px(x,52,P.r2); b.px(x,53,(x>>2)%2?P.s5:P.r3); b.px(x,54,(x>>2)%2?P.s4:P.r2); }
  // die Sahat-kula: Bleidach (angeschnitten), Glockenstube mit Bogenöffnungen, Gesims, Zifferblatt, Schaft, Tür, Tafel
  var t0=52, t1=78, tc=65;
  for (y=0;y<6;y++){ var hw=6+y*2.4; for (x=Math.floor(tc-hw);x<=Math.ceil(tc+hw);x++) b.px(x,y,(x<tc-hw+2)?P.m3:(x<tc?P.m2:P.m1)); } b.hl(Math.floor(tc-18),Math.ceil(tc+18),5,P.m0);
  fill(b,t0+1,6,t1-t0-2,12,function(x,y){ return M.tex.ashlar(x,y,R('s2 s3 s4 s5'),8,4); });
  for (var k2=0;k2<2;k2++){ var ox=t0+4+k2*10; for (y=7;y<17;y++) for (x=ox;x<ox+7;x++){ if (y>=archTop(x,ox,ox+7,11,7)) b.px(x,y,P.k1); } }
  b.rect(t0-2,18,t1-t0+4,3,P.s4); b.hl(t0-2,t1+1,18,P.s5); b.hl(t0-2,t1+1,20,P.s1);
  fill(b,t0,21,t1-t0,G-21,function(x,y){ var c=M.tex.ashlar(x-t0,y,R('s2 s3 s4 s5'),9,5); if (x<t0+2) c=M.UP[c]; if (x>=t1-4) c=M.DN[c]; return c; });
  var cx=tc, cy=32, cr=8.5; b.ellipse(cx,cy,cr+1.6,cr+1.6,P.s1); b.ellipse(cx,cy,cr,cr,P.s5); b.ellipse(cx-1,cy-1,cr-2,cr-2,P.s6);
  for (i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(Math.round(cx+Math.cos(a)*(cr-1.4)-0.5),Math.round(cy+Math.sin(a)*(cr-1.4)-0.5),P.k2); }
  var ha=(2.75/12)*Math.PI*2-Math.PI/2, ma=(45/60)*Math.PI*2-Math.PI/2; b.line(cx,cy,Math.round(cx+Math.cos(ma)*(cr-2)),Math.round(cy+Math.sin(ma)*(cr-2)),P.k1); b.line(cx,cy,Math.round(cx+Math.cos(ha)*(cr*0.55)),Math.round(cy+Math.sin(ha)*(cr*0.55)),P.k1); b.px(cx,cy,P.k0);
  b.rect(tc-5,G-19,10,19,P.w1); b.rect(tc-4,G-18,8,18,P.w2); b.hl(tc-4,tc+3,G-14,P.m1); b.hl(tc-4,tc+3,G-6,P.m1); b.px(tc+2,G-10,P.m3); for (y=G-21;y<G-19;y++) b.hl(tc-6,tc+5,y,P.s4);
  b.rect(t0+3,G-34,8,6,P.s5); b.hl(t0+4,t0+9,G-32,P.s2); b.hl(t0+4,t0+8,G-30,P.s2);
  // Pflaster, Laterne
  fill(b,0,G,w,h-G,function(x,y){ return M.tex.cobble(x,y,R('s0 s1 s2 s3'),6); });
  M.prop.lamp(b,132,G+1,44,true);
  // Tomaž mit dem offenen Kästchen: Deckel aufgeklappt (innen Samt), darin das Kupferarmband
  fig(b,108,G+3,F({fi:'box',lh:[-6,-21],rh:[6,-21],ho:[0,1]}),'F','tomaz');
  var bx=108, by=G+3-20;
  b.rect(bx-5,by-11,11,6,P.r0); b.hl(bx-5,bx+5,by-11,P.y3); b.vl(bx-5,by-11,by-6,P.r1); b.vl(bx+5,by-11,by-6,P.r1); b.hl(bx-4,bx+4,by-10,P.r1);   // Deckel, aufgeklappt: dunkler Samt, Messingkante
  b.rect(bx-5,by-4,11,4,P.r2); b.hl(bx-5,bx+5,by-4,P.y3); b.hl(bx-5,bx+5,by-1,P.r1); b.px(bx,by-3,P.y4); b.vl(bx+5,by-4,by-1,P.r1);                // das Kästchen
  b.hl(bx-2,bx+2,by-8,P.t5); b.px(bx-3,by-7,P.t4); b.px(bx+3,by-7,P.t4); b.px(bx-3,by-6,P.t3); b.px(bx+3,by-6,P.t3); b.px(bx-3,by-5,P.t3); b.px(bx+3,by-5,P.t2); b.hl(bx-2,bx+2,by-5,P.t3); // das Armband im Samt
  M.light(b,M.lf.sum(M.lf.k(-0.6),M.lf.pool(130,62,64,46,2.2,0.9),M.lf.pool(192,70,40,30,1.2,1),M.lf.pool(65,32,16,16,0.8,1),M.lf.pool(bx,by-6,12,9,1.2,1)));
  b.hl(bx-2,bx+2,by-8,P.t5); b.px(bx-1,by-8,P.y5); b.px(bx,by-8,P.l0); b.px(bx+4,by-14,P.s6); b.px(bx+4,by-15,P.l1); b.px(bx+3,by-14,P.s5); b.px(bx+5,by-14,P.s5); b.px(bx+4,by-13,P.s5);
  edgeDark(b,2.0); };

// ================================================================ 5. Die Werkbank (ghost): 1972, der alte Meister poliert ein Armband, Tomaž zählt Geld
M.mem.k2_bench=function(b){ var w=b.w,h=b.h, BT=92, x, y, i;
  // Rückwand: senkrechte Bretter, oben verrußt
  fill(b,0,0,w,BT,function(x,y){ var c=M.tex.boards(y,x,R('w1 w2 w2 w3'),9); if (y<22 && bayer(x,y)<(22-y)/28) c=M.DN[c]; return c; });
  // ein Bord mit dem großen Kessel, Tabletts an der Wand, Džezve an einer Stange, Laternen
  b.rect(0,30,44,2,P.w4); b.hl(0,43,32,P.w0);
  b.ellipse(20,23,11,8,function(x,y){ return y>30?undefined:ra(R('t1 t2 t3 t4 t5'),0.75-(x-10)/26+(y<20?0.15:0),x,y); }); b.rect(15,13,10,3,P.t2); b.hl(15,24,13,P.t5); b.line(12,18,8,12,P.t3); b.px(14,20,P.y5);
  tray(b,62,18,10); tray(b,186,16,12); tray(b,214,34,8); tray(b,170,38,6); tray(b,28,48,8);
  b.hl(80,150,32,P.m2); b.hl(80,150,31,P.m4);
  for (i=0;i<7;i++){ dzezva(b,86+i*10,32,2+(i%3)); }
  lantern(b,160,0); lantern(b,206,48);
  // die Lampe über der Bank
  b.vl(112,0,8,P.k2); b.poly([[105,13],[119,13],[115,8],[109,8]],P.m2); b.hl(105,118,13,P.m1); b.ellipse(112,14,2,1.6,P.l1);
  // der Meister (links, über die Arbeit gebeugt, die Brille auf der Nase) und Tomaž (rechts, zählt)
  fig(b,68,112,S({h:[0,-21],ln:4,nh:[13,-21],fh:[11,-22],ho:[1,1]}),'R','k2m_majstor');
  fig(b,152,112,S({ln:3,h:[0,-23],nh:[11,-21],fh:[8,-23],ho:[-1,1]}),'L','tomaz');
  // die Werkbank: Platte (leicht von oben) und Front
  fill(b,0,BT,w,4,function(x,y){ var c=y===BT?P.w4:(y<BT+2?P.w3:P.w2); if (hash(x>>3,y)<0.1) c=M.DN[c]; return c; });
  fill(b,0,BT+4,w,h-BT-4,function(x,y){ return M.tex.boards(x,y-BT-4,R('w0 w1 w1 w2'),6); }); b.hl(0,w-1,BT+4,P.k1);
  // auf der Bank: Schraubstock, Hammer, das offene Kästchen, Geldscheine
  b.rect(10,BT-7,12,7,P.m1); b.rect(11,BT-6,10,3,P.m2); b.hl(10,21,BT-7,P.m3); b.rect(14,BT-3,4,3,P.m0);
  b.line(28,BT+1,38,BT-1,P.w3); b.rect(37,BT-3,4,3,P.m2); b.px(37,BT-3,P.m4);
  b.rect(100,BT-1,8,3,P.r2); b.hl(100,107,BT-1,P.y3); b.rect(100,BT-5,8,4,P.r1); b.hl(101,106,BT-4,P.r2);
  [[114,BT,0],[121,BT+1,1],[128,BT,2],[135,BT+1,0]].forEach(function(n){ var c=[P.s5,P.g5,P.b4][n[2]]; b.rect(n[0],n[1],7,2,c); b.hl(n[0],n[0]+6,n[1],M.UP[c]); b.px(n[0]+2,n[1]+1,M.DN[c]); b.px(n[0]+4,n[1]+1,M.DN[c]); });
  var th=[152-11,112-21], tf=[152-8,112-23];
  b.rect(th[0]-3,th[1]-1,5,3,P.s4); b.hl(th[0]-3,th[0]+1,th[1]-1,P.s5);
  b.rect(tf[0]-2,tf[1]-3,6,3,P.g4); b.hl(tf[0]-2,tf[0]+3,tf[1]-3,P.g5); b.hl(tf[0]-2,tf[0]+3,tf[1]-1,P.s4);
  // das Armband in den Händen des Meisters, das Poliertuch
  var mh=[68+13,112-21]; b.ellipse(mh[0]+1,mh[1]-1,3.2,1.7,function(x,y){ return (y<mh[1]-1)?P.t5:P.t3; }); b.px(mh[0]+1,mh[1]-1,P.r0); b.px(mh[0],mh[1]-2,P.y5);
  b.rect(mh[0]-5,mh[1]-1,4,3,P.s5); b.px(mh[0]-5,mh[1]+1,P.s4);
  M.light(b,M.lf.sum(M.lf.k(-0.9),M.lf.pool(112,80,92,40,2.7,0.9),M.lf.pool(112,16,30,16,1.4,1)));
  b.ellipse(112,14,2,1.6,P.l1); b.px(mh[0],mh[1]-2,P.l1);
  edgeDark(b,2.0); };

// ================================================================ 6. Hinter dem Spiegel (ghost): Winterabend 1973, Halid schiebt die Blechkasse hinter die Leiste
M.mem.k2_halid=function(b){ var w=b.w,h=b.h, G=95, x, y, i;
  // grob verputzte Wand, Dielen
  fill(b,0,0,w,G,function(x,y){ return M.tex.plaster(x,y,R('s1 s2 s3'),40); });
  fill(b,0,G,w,h-G,function(x,y){ return M.tex.boards(x,y-G,R('w0 w1 w2 w2'),3); }); b.hl(0,w-1,G,P.k1);
  // Regal mit Gläsern und Kaffeesäcken, Kisten mit leeren Flaschen
  for (i=0;i<2;i++){ var sy=28+i*24; b.rect(0,sy,74,2,P.w3); b.hl(0,73,sy,P.w4); b.vl(72,sy+2,sy+5,P.w1); }
  for (i=0;i<5;i++){ var jx=6+i*13; b.rect(jx,20,7,8,P.s3); b.rect(jx+1,21,5,6,P.e2); b.vl(jx+1,21,26,P.s5); b.hl(jx,jx+6,19,P.m2); }
  for (i=0;i<3;i++){ var kx=4+i*22; b.ellipse(kx+9,45,10,7,function(x,y){ return y>52?undefined:ra(R('e1 e2 e3 e4'),0.7-(y-38)/16+(x<kx+5?-0.2:0),x,y); }); b.line(kx+3,40,kx+14,40,P.e1); }
  M.microText(b,'BRASIL',10,44,P.e1);
  for (i=0;i<2;i++){ var cx0=4+i*30; b.rect(cx0,74,28,21,P.w2); b.hl(cx0,cx0+27,74,P.w4); b.hl(cx0,cx0+27,84,P.w1); b.vl(cx0,74,94,P.w1); for (var bt=0;bt<5;bt++){ b.rect(cx0+3+bt*5,69,2,5,P.g2); b.px(cx0+3+bt*5,68,P.g4); } }
  M.microText(b,'SARAJEVSKO',6,86,P.w0);
  // Fensterchen hoch oben: Winternacht, Schnee auf dem Sims
  b.rect(84,6,20,14,P.s1); fill(b,86,8,16,10,function(x,y){ return (hash(x,y*3)<0.06)?P.n5:ra(R('n0 n1 n2'),(y-8)/10,x,y); }); b.vl(94,8,17,P.k2); b.hl(86,101,13,P.k2); b.hl(85,102,17,P.s6); b.hl(86,101,16,P.s5);
  // der Spiegel: schwerer Goldrahmen; Glas mit dem Widerschein der Kerze und dem blassen Spiegelbild des Mannes
  var mx0=142, mx1=204, my0=8, my1=92, fw=5, gx0=mx0+fw, gx1=mx1-fw, gy0=my0+fw, gy1=my1-6;
  for (y=my0;y<my1;y++) for (x=mx0;x<mx1;x++){ var e=Math.min(x-mx0,mx1-1-x,y-my0,my1-1-y); if (e>=fw) continue; var c=ra(R('y0 y1 y2 y3 y4'),0.75-e*0.12+((e===1)?0.2:0)+((x-mx0<fw)?0.1:-0.1)+((x+y)%3===0?0.15:0),x,y); b.px(x,y,c); }
  fill(b,gx0,gy0,gx1-gx0,gy1-gy0,function(x,y){ var u=(x-gx0)/(gx1-gx0), v=(y-gy0)/(gy1-gy0), c=ra(R('k1 k2 n0 m0 m1'),0.35+u*0.15-v*0.15+(fbm(x,y,10,4)-0.5)*0.2,x,y); var sh=(x-y*0.5); if (sh>138&&sh<143) c=M.UP[M.UP[c]]; if (hash(x,y)<0.02) c=P.m1; return c; });
  var RB=new M.Buf(w,h,T); fig(RB,178,G+1,S({h:[-1,-13],ln:5,nf:[-7,0,'f'],ff:[9,0,'t'],nh:[-16,-8],fh:[-14,-9]}),'L','k2m_halid',{lut:M.DN});
  for (y=gy0;y<gy1;y++) for (x=gx0;x<gx1;x++){ var rc=RB.get(x,y); if (rc!==T && bayer(x,y)<0.55) b.px(x,y,M.DN[rc]); }
  b.ellipse(167,80,5,4,function(x,y){ var c=b.get(x,y); return bayer(x,y)<0.6?M.UP[c]:c; }); b.px(167,79,P.y5); b.px(167,78,P.y4); b.px(167,80,P.y3);
  // unten: links ist die Leiste abgehoben, dahinter der Hohlraum; rechts sitzt sie noch
  b.rect(mx0,gy1,30,6,P.k0); b.hl(mx0,mx0+29,gy1,P.y1); b.vl(mx0+29,gy1,my1-1,P.y1); b.rect(mx0+30,gy1,mx1-mx0-30,6,P.y2); b.hl(mx0+30,mx1-1,gy1,P.y4); b.hl(mx0+30,mx1-1,my1-1,P.y1);
  b.rect(108,G+2,32,3,P.y2); b.hl(108,139,G+2,P.y4); b.hl(108,139,G+4,P.y1); for (i=0;i<4;i++) b.px(112+i*7,G+3,P.y4);
  // die verbeulte Blechkasse, halb im Hohlraum; der Deckel steht einen Spalt offen, darunter ein Stapel Briefe und das rote Kästchen
  var kx=141, ky=gy1;
  b.rect(kx,ky+1,17,5,P.m2); b.hl(kx,kx+16,ky+1,P.m3); b.vl(kx,ky+1,ky+5,P.m4); b.vl(kx+1,ky+2,ky+5,P.m3); b.hl(kx,kx+16,ky+5,P.m0); b.px(kx+7,ky+3,P.m1); b.px(kx+12,ky+2,P.m1); b.rect(kx+3,ky+3,3,1,P.m4);
  b.hl(kx+1,kx+13,ky,P.s6); b.hl(kx+2,kx+12,ky-1,P.s5); b.px(kx+14,ky,P.r2); b.px(kx+15,ky,P.r3);
  b.line(kx-1,ky,kx+15,ky-4,P.m4); b.line(kx-1,ky+1,kx+15,ky-3,P.m2); b.px(kx+15,ky-4,P.m3);
  // die Kerze am Boden
  b.rect(118,G-5,3,5,P.s6); b.rect(115,G,9,2,P.y2); b.hl(115,123,G,P.y4);
  // Halid kniet und schiebt die Kasse hinein
  fig(b,126,G+1,S({h:[1,-13],ln:5,nf:[7,0,'f'],ff:[-9,0,'t'],nh:[16,-8],fh:[14,-9]}),'R','k2m_halid');
  M.light(b,M.lf.sum(M.lf.k(-1.4),M.lf.pool(122,84,84,48,3.4,0.8),M.lf.beam(94,14,70,95,4,22,1.2)));
  b.px(119,G-7,P.l1); b.px(119,G-6,P.y5); b.px(120,G-6,P.y4); b.px(118,G-6,P.y3); b.px(167,79,P.l0);
  edgeDark(b,1.8); };

// ================================================================ 7. Lauschen (ghost): hinter der Theke Emina und Lejla, von der Seite, halb verdeckt
M.mem.k2_listen=function(b){ var w=b.w,h=b.h, CT=80, x, y, i;
  // Rückwand: warm verputzt, Holzleiste, Regale mit Fildžani und Džezve, Kupfertabletts, ein Foto von 1972
  fill(b,0,0,w,CT,function(x,y){ return M.tex.plaster(x,y,R('s2 s3 s4'),60); });
  b.rect(0,56,w,2,P.w2); b.hl(0,w-1,56,P.w3);
  for (i=0;i<2;i++){ var sy=24+i*15; b.rect(40,sy,176,2,P.w3); b.hl(40,215,sy,P.w4); b.hl(40,215,sy+2,P.w0);
    for (var j=0;j<14;j++){ var cx=44+j*12; if (hash(j,i)<0.5){ b.rect(cx,sy-3,4,3,P.s6); b.vl(cx+3,sy-3,sy-1,P.s4); b.px(cx+4,sy-2,P.s5); b.hl(cx-1,cx+4,sy-1,P.s5); } else { b.rect(cx,sy-4,5,4,P.t3); b.hl(cx,cx+4,sy-4,P.t5); b.line(cx+5,sy-3,cx+8,sy-6,P.w3); } } }
  tray(b,80,10,7); tray(b,158,9,6); tray(b,200,11,7);
  b.rect(178,42,18,14,P.w1); fill(b,180,44,14,10,function(x,y){ return (y>49)?((x%3===0)?P.s1:P.s2):(y<46?P.s5:P.s3); });
  // die Lampe über der Theke
  b.vl(122,0,4,P.k2); b.ellipse(122,7,6,3.5,function(x,y){ return y<7?P.y3:P.y4; }); b.hl(116,128,10,P.y2);
  // Emina (spricht leise, beugt sich zu Lejla) und Lejla mit dem Glas Wasser für Šaćir
  fig(b,114,97,S({hd:'o',ln:2,nh:[8,-27],fh:[4,-23],ho:[1,1]}),'R','emina');
  fig(b,158,97,S({ln:0,nh:[5,-22],fh:[1,-21],it:'glass',ho:[0,1]}),'L','lejla');
  // die Theke: Kaffeeherd mit heißem Sand und Džezve, Tassen
  fill(b,0,CT,w,4,function(x,y){ return y===CT?P.w4:(y<CT+2?P.w3:P.w1); });
  fill(b,0,CT+4,w,h-CT-4,function(x,y){ var c=M.tex.boards(x,y-CT-4,R('w0 w1 w1 w2'),7); if ((x%46)<2) c=P.w0; return c; });
  b.rect(172,CT-5,28,5,P.t2); b.hl(172,199,CT-5,P.t4); fill(b,173,CT-4,26,2,function(x,y){ return hash(x,y)<0.5?P.e4:P.e3; });
  for (i=0;i<3;i++){ var dx=176+i*7; b.rect(dx,CT-9,4,5,P.t3); b.hl(dx,dx+3,CT-9,P.t5); b.line(dx+4,CT-8,dx+7,CT-11,P.w3); }
  b.rect(70,CT-4,4,3,P.s6); b.hl(69,75,CT-1,P.s5); b.rect(80,CT-3,5,3,P.s5); b.hl(80,84,CT-3,P.s6);
  // Vordergrund: der Vorhang der Kammer und der Türpfosten (dunkel), rechts ein Regalpfosten mit Gläsern
  for (y=0;y<h;y++){ var cw=44+Math.round(Math.sin(y*0.06)*2+(y>64?(y-64)*0.22:0)); for (x=0;x<cw;x++){ var fold=Math.sin(x*0.6+y*0.03), c=fold>0.6?P.r1:(fold<-0.3?P.k1:P.r0); if (x>cw-3) c=fold>0?P.r2:P.r1; b.px(x,y,c); } }
  b.rect(48,0,7,h,P.w0); b.vl(54,0,h-1,P.w1); b.vl(48,0,h-1,P.k1);
  for (y=0;y<h;y++){ var ex=44+Math.round(Math.sin(y*0.06)*2+(y>64?(y-64)*0.22:0)); b.px(ex-1,y,(y%4<2)?P.r3:P.r2); if (y>70 && y%5===0) b.px(ex,y,P.r3); }   // Lichtkante am Vorhang
  b.rect(216,0,16,h,P.k1); b.vl(216,0,h-1,P.w1); for (i=0;i<4;i++){ b.rect(218,12+i*24,14,2,P.w1); b.rect(220,6+i*24,5,6,P.k2); b.px(221,7+i*24,P.m2); }
  M.light(b,M.lf.sum(M.lf.k(-0.9),M.lf.pool(136,50,72,40,2.3,0.9),M.lf.xband(0,74,-1.2,0)));
  b.hl(117,127,10,P.y5);
  edgeDark(b,2.2); };

// ================================================================ 8. Die Stimme (ghost): Samstag kurz nach elf, die Drei an der Haltestelle unter der Dachuhr
M.mem.k2_voice=function(b){ var w=b.w,h=b.h, x, y, i;
  M.vgrad(b,0,0,w,96,R('b2 b3 b4 b4 b5 s6'));
  // ferne Türme im Dunst
  tower(b,0,34,30,92,{seed:3,fl:4,bay:11,ramp:R('b2 b3 s4 s5')}); tower(b,190,232,22,92,{seed:4,fl:4,bay:11,ramp:R('b2 b3 s4 s5')});
  // Haus 7 mit der Dachuhr, hinter der Haltestelle
  tower(b,50,170,27,96,{seed:7,fl:5,bay:12,laundry:10});
  for (i=0;i<4;i++){ var px=92+i*14; b.vl(px,21,26,P.m1); } b.rect(84,11,56,11,P.k1); b.rect(85,12,54,9,P.k0); b.hl(84,139,21,P.m2); b.hl(84,139,11,P.m2);
  clock7(b,92,13,6,7,'11:12',P.a6,undefined,2); haloPx(b,85,12,54,9,function(c){ return c===P.a6; },P.a2);
  // Oberleitung, Mast
  b.line(0,24,w-1,28,P.k2); b.line(0,27,w-1,31,P.m1); b.vl(214,26,99,P.m1); b.vl(215,26,99,P.m2); b.hl(210,219,30,P.m1);
  // Wartehäuschen
  b.rect(6,58,48,3,P.s4); b.hl(6,53,58,P.s6); b.hl(6,53,60,P.s2); b.vl(10,61,99,P.m1); b.vl(50,61,99,P.m1); fill(b,11,61,39,26,function(x,y){ return (bayer(x,y)<0.3)?P.b4:P.b3; }); b.hl(11,49,87,P.w2); b.hl(11,49,88,P.w1);
  b.rect(26,44,10,10,P.s6); b.rect(27,45,8,8,P.y4); M.microText(b,'3',29,46,P.k1); b.vl(30,54,58,P.m2);
  // die Straßenbahn: rot, cremefarbenes Fensterband, die vordere Tür offen
  var tr=M.scn.tram(b,60,99,{s:0.75,dir:'L',doors:'open',line:'3'}), dx0=100, dx1=119;
  for (y=tr.winT;y<95;y++) for (x=dx0+1;x<dx1;x++){ var c=(y<tr.winB)?((y-tr.winT)<2?P.s3:P.s5):P.m1; if (y>=tr.winB && y<tr.winB+2) c=P.s3; b.px(x,y,c); }
  b.vl(116,tr.winT,94,P.y3); b.vl(117,tr.winT,94,P.y2); b.hl(dx0,dx1,95,P.m4); b.hl(dx0,dx1,96,P.m2);
  // Bahnsteig vorn
  fill(b,0,99,w,5,function(x,y){ return y===99?P.s5:(y===100?P.s4:ra(R('s2 s3'),0.5+hash(x>>3,y)*0.3,x,y)); });
  // die Kinder: das Mädchen auf der Stufe beugt sich hinaus und zieht den Jungen an der Hand in den Wagen
  var g=kid(b,110,95,{kind:'girl',f:'L',ln:3,lk:0.25,nf:[1.5,0,'f'],ff:[-3,0,'f'],nh:[8,-14],fh:[-5,-27],braid:[2.5,7.8]});
  kid(b,94,103,{kind:'boy',f:'R',ln:2.5,lk:-0.35,nf:[5,-4,'f'],ff:[-4,0,'t'],nh:[g.nh[0]-94,g.nh[1]-103],fh:[-4,-15],open:1});
  M.light(b,M.lf.sum(M.lf.k(0.1),M.lf.band(0,104,0.3,-0.8)));
  edgeDark(b,1.8); };

// ================================================================ 9. Schwarzer Schnee (ghost): August 1992, verbrannte Seiten über der Miljacka, Kinder auf der Lateinerbrücke
M.mem.k2_snow=function(b){ var w=b.w,h=b.h, WL=86, x, y, i;
  // Himmel: rauchiger Morgen, eine blasse Sonne, die Rauchsäule von links
  fill(b,0,0,w,72,function(x,y){ return ra(R('s2 s3 s4 s4 s5 d5'),0.2+y/60+(fbm(x,y,20,3)-0.5)*0.35,x,y); });
  b.ellipse(188,18,8,8,function(x,y){ return Math.hypot(x+0.5-188,y+0.5-18)<5?P.l1:P.s6; });
  M.fogBake(b,function(x,y){ var cx=22+(30-y)*0.35+Math.sin(y*0.15)*3, sp=6+(60-y)*0.5, d=Math.abs(x-cx)/sp; var a=Math.max(0,1-d*d)*0.85; if (y<24) a=Math.max(a,sm((24-y)/14)*sm((150-x)/120)*0.75); return a*(0.7+fbm(x,y,8,5)*0.5); },{col:P.s1});
  // hinten: Hügel, Fassaden am anderen Ufer
  for (x=0;x<w;x++){ var hy=32+Math.round(fbm(x,5,40,8)*10); for (y=hy;y<70;y++) b.px(x,y,ra(R('s2 s3 s3'),0.5+(y-hy)/40,x,y)); }
  var r=M.rng(19), fx=0; while (fx<w){ var fw=14+Math.floor(r()*16), fh=16+Math.floor(r()*14), top=66-fh; for (y=top;y<66;y++) for (x=fx;x<Math.min(w,fx+fw);x++){ var c=(x===fx)?P.s4:P.s3; if ((y-top)%6>2 && (x-fx)%5>1 && (x-fx)%5<4 && y<64) c=P.s1; b.px(x,y,c); } b.hl(fx,fx+fw-1,top,P.t2); b.hl(fx+1,fx+fw-2,top-1,P.t3); fx+=fw+1; }
  // Ufermauer gegenüber, Fluss
  fill(b,0,64,w,WL-64,function(x,y){ return M.tex.ashlar(x,y,R('s1 s2 s3 s4'),12,5); });
  fill(b,0,WL,w,h-WL,function(x,y){ var v=0.5+(y-WL)/36+Math.sin(x*0.2+y*1.3)*0.08; var c=ra(R('a1 a2 a3 s2 s3'),v,x,y); if (Math.sin(x*0.5+y*2.1)>0.9) c=P.s4; return c; });
  // die Lateinerbrücke: hoher Buckel, drei Bögen, runde Öffnungen über den Pfeilern; durch die Bögen sieht man den Fluss
  var deck=function(x){ return 56+Math.round(((x-116)/98)*((x-116)/98)*13); };
  for (x=12;x<220;x++){ for (y=deck(x);y<WL+2;y++){ b.px(x,y,M.tex.ashlar(x,y,R('s2 s3 s4 s5'),9,4)); } }
  function hole(xl,xr,ys,yt){ for (var yy=yt;yy<WL+2;yy++) for (var xx=xl;xx<=xr;xx++){ var at=archTop(xx,xl,xr,ys,yt); if (yy<at) continue; var c;
      if (yy<at+2) c=P.k1; else if (yy<WL-3) c=ra(R('k1 k2 s0'),0.3+(yy-at)/30,xx,yy); else c=ra(R('a1 a2 a3'),0.3+(yy-WL+3)/6+Math.sin(xx*0.4+yy)*0.15,xx,yy); b.px(xx,yy,c); } }
  hole(88,144,80,64); hole(34,76,84,72); hole(156,198,84,72);
  [[82,70],[150,70]].forEach(function(p){ b.ellipse(p[0],p[1],3.5,3.5,P.k1); b.ellipse(p[0],p[1]-0.5,2.4,2.2,P.k2); });
  for (y=WL+2;y<h;y++) for (x=12;x<220;x++){ var my=WL+1-(y-WL-2)*1.2; if (my<56) continue; var c2=b.get(x,Math.round(my)); if (c2===P.k1||c2===P.k2||c2===P.s0) b.px(x,y,bayer(x,y)<0.6?P.a1:P.a0); else if (bayer(x,y)<0.3) b.px(x,y,M.DN[b.get(x,y)]); }
  // die Kinder auf der Brücke
  kid(b,70,deck(70)-1,{kind:'kidA',f:'R',ln:0,lk:-1.0,nf:[1,-1,'t'],ff:[-1,-1,'t'],nh:[3,-33],fh:[0,-32],hip:[0,-15.6],open:1});
  var g=kid(b,104,deck(104)-1,{kind:'girl',f:'R',ln:1.5,lk:0.55,nh:[6,-21],fh:[5,-22],braid:[-1,8.4],sz:1.04});
  kid(b,134,deck(134)-4,{kind:'kidB',f:'L',ln:-0.5,lk:-0.9,nf:[2,0,'t'],ff:[-2,-1,'t'],nh:[2,-31],fh:[-2,-30],sz:0.97,open:1});
  kid(b,164,deck(164)-1,{kind:'kidA',f:'L',ln:1,lk:-0.7,nh:[5,-30],fh:[-2,-18],sz:0.96});
  // das Blatt in den Händen des Mädchens: schwarz, die Ränder glühen noch
  var pxg=Math.round(g.nh[0])+1, pyg=Math.round(g.nh[1])-5; b.rect(pxg-2,pyg,8,7,P.k1); b.rect(pxg-1,pyg+1,6,5,P.s0); b.hl(pxg,pxg+3,pyg+2,P.s1); b.hl(pxg,pxg+2,pyg+4,P.s1);
  b.hl(pxg-2,pxg+5,pyg,P.y4); b.vl(pxg+5,pyg,pyg+3,P.d5); b.px(pxg+5,pyg,P.y5); b.px(pxg-2,pyg+6,P.y3); b.px(pxg+5,pyg+6,P.y4); b.px(pxg-2,pyg,P.d5);
  // Brüstung (vor den Füßen der Kinder)
  for (x=12;x<220;x++){ var d0=deck(x); for (y=d0-4;y<d0;y++) b.px(x,y,y===d0-4?P.s5:(y===d0-3?P.s4:P.s3)); }
  // schwarzer Schnee: verbrannte Seiten mit glimmenden Rändern
  var rr=M.rng(92); for (i=0;i<82;i++){ var sx=rr()*w, sy=rr()*98, s=0.9+rr()*1.9, a=rr()*3, gl=rr(); if (Math.abs(sx-pxg-2)<9 && Math.abs(sy-pyg-3)<8) continue;
    var ca=Math.cos(a), sa=Math.sin(a), pts=[[-s,-s*0.7],[s,-s*0.7],[s,s*0.7],[-s,s*0.7]].map(function(p){ return [sx+p[0]*ca-p[1]*sa, sy+p[0]*sa+p[1]*ca]; });
    b.poly(pts,function(px,py){ return hash(px*3,py*5)<0.25?P.s0:P.k1; }); if (s<1.2) b.px(Math.round(sx),Math.round(sy),P.k1);
    if (gl<0.7){ var e0=pts[Math.floor(rr()*4)], e1=pts[Math.floor(rr()*4)]; b.px(Math.round(e0[0]),Math.round(e0[1]),gl<0.35?P.y4:P.d5); if (s>1.8) b.px(Math.round(e1[0]),Math.round(e1[1]),P.y3); } }
  M.light(b,M.lf.sum(M.lf.pool(188,20,80,40,0.8,1),M.lf.band(60,104,0,-0.5)));
  b.px(pxg+5,pyg,P.y5); b.px(pxg+4,pyg,P.l0);
  edgeDark(b,2.0); };

// ================================================================ 10. Die Ausleihtheke (ghost): verkohlte Theke im Saal mit Spitzbögen, Ivan legt ein Buch darauf
M.mem.k2_desk=function(b){ var w=b.w,h=b.h, G=94, x, y, i;
  // dunkler Raum hinter den Bögen
  fill(b,0,0,w,G,function(x,y){ return ra(R('k0 k1 k2 m0'),0.3+(fbm(x,y,16,2)-0.5)*0.5+y/200,x,y); });
  // Bögen in zwei Geschossen: Säulen, gestreifte Bogensteine; Ruß zieht über den Öffnungen nach oben
  var cols=[14,62,110,158,206], WALL=R('s1 s2 s3 s4');
  for (y=0;y<G;y++) for (x=0;x<w;x++){ var inOpen=false, band=false, lo=y>=30, above=0;
    for (var j=0;j<cols.length-1;j++){ var xl=cols[j]+4, xr=cols[j+1]-3; if (lo){ var at=archTop(x,xl,xr,52,32); if (x>=xl&&x<=xr&&y>=at) inOpen=true; else if (x>=xl-3&&x<=xr+3&&y>=archTop(x,xl-3,xr+3,52,29)) band=true; }
      else { var xm=(xl+xr)/2, a1=archTop(x,xl,xm-1,18,7), a2=archTop(x,xm+1,xr,18,7); if ((x>=xl&&x<=xm-1&&y>=a1)||(x>=xm+1&&x<=xr&&y>=a2)) inOpen=true; if (y>22&&y<29&&x>=xl&&x<=xr) inOpen=false; }
      if (x>xl+4 && x<xr-4){ var top0=archTop(x,xl,xr,52,32); if (y<top0 && y>top0-26) above=Math.max(above,1-(top0-y)/26); } }
    if (inOpen) continue; var c;
    if (band){ var seg=Math.floor(Math.atan2(y-52,x-(Math.floor((x-14)/48)*48+38))*7); c=(seg&1)?ra(R('t1 t2 t3'),0.6,x,y):ra(R('e2 e3 e4'),0.6,x,y); }
    else c=ra(WALL,0.55+(fbm(x,y,9,3)-0.5)*0.4,x,y);
    if (y>=22&&y<29) c=(y===22||y===28)?P.s3:((x%5===0)?P.s1:P.s2);
    var so=above*(0.6+fbm(x*0.5,y*0.15,4,6)*0.8); if (bayer(x,y)<so) c=M.DN[M.DN[c]]; else if (bayer(x,y)<so*1.6) c=M.DN[c];
    b.px(x,y,c); }
  cols.forEach(function(cx,j){ for (y=30;y<G;y++) for (x=cx;x<cx+5;x++){ var c=(x===cx)?P.s4:(x===cx+4?P.s1:P.s3); if (y<34) c=P.s4; if (j%2===1 && fbm(x,y,6,9)<0.55) c=M.DN[M.DN[c]]; b.px(x,y,c); } b.rect(cx-1,30,7,3,P.s4); b.hl(cx-1,cx+5,30,P.s5); });
  // Licht durch die zerstörte Kuppel
  M.light(b,M.lf.sum(M.lf.k(-0.3),M.lf.beam(198,-12,146,96,6,30,3.0),M.lf.beam(154,-12,100,96,3,16,1.6)));
  // Boden: Schutt, Asche, verkohlte Balken, Papierfetzen
  fill(b,0,G,w,h-G,function(x,y){ var c=ra(R('k1 k2 s0 s1 s2'),0.45+(fbm(x,y,4,7)-0.5)*0.7+(y-G)/30,x,y); if (hash(x,y)>0.97) c=P.s4; return c; });
  b.line(10,G+6,48,G+2,P.k1); b.line(10,G+7,48,G+3,P.w0); b.line(170,G+8,224,G+4,P.k1);
  for (i=0;i<9;i++){ var sx=Math.floor(hash(i,4)*w), sy=G+2+Math.floor(hash(i,5)*8); b.rect(sx,sy,3,2,P.s3); b.px(sx,sy,P.s4); }
  // Ivan, Jahr um Jahr: zwei blasse Echos und der Mann selbst, der das Buch auf die Theke legt
  fig(b,56,G+2,A.walkS[2],'R','ivan',{alpha:0.28}); fig(b,82,G+2,A.walkS[5],'R','ivan',{alpha:0.45});
  fig(b,108,G+2,S({ln:2,h:[0,-23],nh:[11,-29],fh:[6,-24],it:'book',nb:1,ho:[1,1]}),'R','ivan');
  // die verkohlte Ausleihtheke mit Messingleiste
  fill(b,118,68,82,G-68+2,function(x,y){ var c=ra(R('k0 k1 k2 w0 w1'),0.5+(fbm(x,y,5,4)-0.5)*0.8-(y-68)/60,x,y); if ((x-118)%20<1) c=P.k0; return c; });
  b.hl(118,199,67,P.y2); b.hl(118,199,66,P.y3); for (x=118;x<200;x++) if (fbm(x,1,6,3)<0.4) b.px(x,66,P.w0);
  b.rect(120,62,7,4,P.s4); b.hl(120,126,62,P.s5); b.vl(120,62,65,P.n1); b.px(127,64,P.s3);   // das Buch auf der Theke
  M.light(b,M.lf.pool(150,72,46,24,1.0,1));
  for (i=0;i<26;i++){ var t=hash(i,7), dx=Math.floor(198-52*t+(hash(i,9)-0.5)*24*t), dy=Math.floor(-12+108*t); if (dy>0 && bayer(dx,dy)<0.6) b.px(dx,dy,P.s5); }
  edgeDark(b,2.0); };

// ================================================================ 11. Neunter Stock (ghost): ein dunkles Treppenhaus, das Mädchen zählt die Stufen, die gemalte 9, der tote Aufzug
M.mem.k2_ninth=function(b){ var w=b.w,h=b.h, x, y, i, L=56;
  // Betonwände, fleckig
  fill(b,0,0,w,h,function(x,y){ var c=M.tex.plaster(x,y,R('m1 m2 m3'),30); if (fbm(x,y,12,5)<0.35) c=M.DN[c]; return c; });
  // Fensterschlitz links mit grauem Tageslicht
  b.rect(14,6,10,52,P.m1); fill(b,16,8,6,48,function(x,y){ return ra(R('s3 s4 s5'),0.4+fbm(x,y,6,3)*0.5,x,y); }); b.hl(15,22,31,P.m2); b.hl(13,24,58,P.m3);
  // Podest oben rechts mit dem Aufzug und der gemalten 9
  fill(b,150,L,w-150,2,function(x,y){ return y===L?P.m4:P.m3; }); b.rect(150,L+2,w-150,4,P.m1);
  b.rect(180,10,38,L-10,P.m0); b.rect(182,12,16,L-12,P.m2); b.rect(199,12,17,L-12,P.m2); b.vl(198,12,L-1,P.k1); b.hl(182,215,12,P.m3);
  b.rect(186,18,8,6,P.k2); b.rect(203,18,8,6,P.k2); b.px(196,40,P.m4); b.px(201,40,P.m4); b.rect(222,28,5,9,P.m2); b.px(224,30,P.r2); b.px(224,34,P.k2);
  b.rect(182,27,36,14,P.s5); b.hl(182,217,27,P.s6); b.hl(183,216,40,P.s3); M.microText(b,'VAN',194,29,P.k2); M.microText(b,'FUNKCIJE',184,35,P.k2);
  b.line(181,26,185,28,P.s4); b.line(214,28,218,26,P.s4);
  M.big(b,'9',163,13,P.s5,3,false);
  for (i=0;i<4;i++){ var dx=[158,163,167,169][i]; b.vl(dx,35,36+[3,5,2,4][i],P.s4); }
  // unten, am Absatz darunter, noch eine verblasste 8
  M.big(b,'8',30,68,P.m4,2,false); for (y=68;y<82;y++) for (x=24;x<38;x++) if (b.get(x,y)===P.m4 && hash(x,y)<0.3) b.px(x,y,P.m3);
  // der Treppenlauf von links unten nach rechts oben
  var N=8, RS=6, RN=12;
  for (var k=1;k<=N;k++){ var ty=L+k*RS, xr=150-(k-1)*RN, xl=xr-RN; b.rect(xl,ty,RN,h-ty,P.m1); b.hl(xl,xr-1,ty,P.m4); b.hl(xl,xr-1,ty+1,P.m3); b.vl(xl,ty,ty+RS-1,P.m2); }
  b.poly([[150,L+6],[150-N*RN,L+N*RS+6],[150-N*RN,h],[150,h]],function(x,y){ var c=b.get(x,y); return (c===P.m1||c===P.m2)?P.m0:c; });
  // das Mädchen, Stufe um Stufe, die Fahrscheine in der Hand
  var gx=120, gy=L+3*RS;
  var g=kid(b,gx,gy,{kind:'girl',f:'R',ln:2.5,lk:0.35,nf:[8,-RS,'f'],ff:[-3,0,'t'],nh:[6,-21],fh:[1,-25],braid:[-1.6,8.2],sz:1.03,open:1});
  var tx=Math.round(g.nh[0]), ty2=Math.round(g.nh[1]); b.rect(tx,ty2-3,4,3,P.s6); b.rect(tx+1,ty2-4,4,3,P.s5); b.px(tx+2,ty2-3,P.k1);
  // Geländer vor dem Lauf
  b.line(150-N*RN+4,L+N*RS-20,150,L-14,P.w1); b.line(150-N*RN+4,L+N*RS-19,150,L-13,P.w2);
  for (k=1;k<=N;k++){ var bx=150-(k-1)*RN-6, by=L+k*RS; b.vl(bx,by-21+Math.round(RS*0.5),by-1,P.k2); }
  M.light(b,M.lf.sum(M.lf.k(-1.2),M.lf.beam(20,30,130,76,8,40,2.4),M.lf.pool(19,32,20,34,1.8,1),M.lf.pool(164,26,22,20,0.8,1)));
  edgeDark(b,2.2); };

// ================================================================ Das Foto „Mala i Mali · 1988“ als Bild (Overlay 'photo'; Wunsch des Autors: beim Ansehen das Foto zeigen, nicht nur den Text)
// Abzug 168 × 112 mit weißem Rand, ein Farbfoto von 1988 (warm, leicht ausgeblichen). Hinter der Haltestelle die Drei, davor Ruža (aus dem
// Figurenbaukasten, Ivkas Kopftuch und Mantel), Mali im gestreiften Pullover und das Mädchen mit Zopf, Hand in Hand. Als halbes Foto fehlt die rechte Hälfte.
var PHW=168, PHH=112, PHB=5;
var PHOTO_TINT=M.tintMake(function(r,g,b){ var L=0.3*r+0.59*g+0.11*b; return [r*0.70+L*0.14+34, g*0.62+L*0.12+24, b*0.46+L*0.10+14]; });
function photoScene(b){ var w=PHW, h=PHH, x, y;
  // Himmel, Wohnblöcke von Alipašino Polje, Oberleitung
  fill(b,0,0,w,h,function(x,y){ return ra(R('b4 b5 s5'),0.25+y/h*0.9+(fbm(x,y,20,5)-0.5)*0.3,x,y); });
  tower(b,-6,38,8,72,{fl:7,seed:3}); tower(b,120,174,2,72,{fl:8,seed:5}); tower(b,52,96,24,72,{fl:5,seed:9});
  b.line(0,16,w-1,20,P.k2); b.line(0,19,w-1,23,P.m1); b.vl(146,18,70,P.m1); b.vl(147,18,70,P.m2);
  // die Drei (nach links, Liniennummer 3), ein Stück Bahnsteig, Asphalt
  M.scn.tram(b,-52,88,{s:0.42,dir:'L',line:'3'});
  fill(b,0,88,w,6,function(x,y){ return y===88?P.s5:(y===89?P.s4:ra(R('s2 s3'),0.5+hash(x>>3,y)*0.3,x,y)); });
  fill(b,0,94,w,h-94,function(x,y){ return ra(R('m0 m1 m2'),0.3+(y-94)/18+(fbm(x,y,5,2)-0.5)*0.5,x,y); });
  // Haltestellenschild
  b.vl(24,46,88,P.m2); b.rect(19,38,11,10,P.s6); b.rect(20,39,9,8,P.y4); M.microText(b,'3',22,40,P.k1);
  // Ruža, von vorn, die Hände vor dem Bauch; Mali und das Mädchen Hand in Hand
  fig(b,60,100,F({lh:[-4,-20],rh:[4,-20],ho:[0,1]}),'F','ivka');
  var g=kid(b,116,100,{kind:'girl',f:'L',ln:0.5,lk:-0.15,nf:[2,0,'f'],ff:[-2,0,'f'],nh:[7,-13],fh:[-2,-14],braid:[1.5,8.6],sz:1.02});
  kid(b,92,100,{kind:'boy',f:'R',ln:0.5,lk:-0.2,nf:[2,0,'f'],ff:[-2,0,'f'],nh:[g.nh[0]-92,g.nh[1]-100],fh:[-3,-14]});
  // Licht wie ein Nachmittag im Spätsommer, Vignette, dann die Farben des alten Abzugs
  M.light(b,M.lf.sum(M.lf.k(0.15),M.lf.band(0,h,0.1,-0.5))); edgeDark(b,1.2);
  M.tintApply(b,PHOTO_TINT);
  for (y=0;y<h;y++) for (x=0;x<w;x++){ if (hash(x+31,y+7)<0.025) b.px(x,y,M.UP[b.get(x,y)]); }   // Korn
}
var PJ=[0,2,3,1,-1,-3,-2,0,2,4,1,-2]; function photoTear(y){ return 96+PJ[(y>>1)%PJ.length]; }
// der fertige Abzug mit Rand (T außerhalb); half: nur die linke, gerissene Hälfte (Riss wie in photoHalves)
M.mem.photoPrint=function(full){ var pw=PHW+2*PHB, ph=PHH+2*PHB, out=new M.Buf(pw,ph,T), pic=new M.Buf(PHW,PHH,P.s4), x, y;
  photoScene(pic); out.rect(0,0,pw,ph,P.s6); for (y=0;y<ph;y++) for (x=0;x<pw;x++){ if (hash(x+3,y+9)<0.02) out.px(x,y,P.s5); }
  out.blit(pic,PHB,PHB);
  if (!full){ for (y=0;y<ph;y++){ var t=photoTear(Math.max(0,y-PHB))+PHB; for (x=t;x<pw;x++) out.d[y*pw+x]=T; out.px(t-1,y,((y)&1)?P.s6:P.s5); if (y%3===0) out.px(t-2,y,P.s6); } }
  else { for (y=PHB;y<ph-PHB;y++){ var t2=photoTear(y-PHB)+PHB; if (y%2===0) out.px(t2,y,M.UP[out.get(t2,y)]); } }   // der Riss bleibt als feine helle Linie
  return out; };
function wrapWords(s,maxw){ var out=[], cur=''; String(s||'').split(' ').forEach(function(wd){ var t=cur?cur+' '+wd:wd; if (M.textWidth(t)>maxw && cur){ out.push(cur); cur=wd; } else cur=t; }); if (cur) out.push(cur); return out; }
M.defineOverlay('photo',function(fb,ov){ var d=ov.data; if (!ov.pic) ov.pic=M.mem.photoPrint(!!d.full);
  var pw=ov.pic.w, ph=ov.pic.h, x0=(fb.w-pw)>>1, y0=4, x, y;
  for (y=0;y<ph;y++) for (x=0;x<pw;x++) if (ov.pic.d[y*pw+x]!==T) fb.px(x0+x+3,y0+y+3,P.k0);   // Schatten
  fb.blit(ov.pic,x0,y0);
  if (d.text){ var lines=wrapWords(M.trUI?M.trUI(d.text):d.text,292), ty=y0+ph+6; fb.rect(0,ty-4,fb.w,lines.length*9+7,P.k0); lines.forEach(function(l,i){ M.text(fb,l,(fb.w-M.textWidth(l))>>1,ty+i*9,P.s5); }); } });   // dunkles Band hinter den Zeilen (sie liegen über der Leiste)
M.showPhoto=function(A,full,text){ return A.overlay('photo',{full:!!full,text:text||''}); };

})(M);
