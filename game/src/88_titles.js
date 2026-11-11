/* ===== 88_titles.js — Vier Titelbilder mit eigener Bewegung; bei jedem Start ein anderes (der Reihe nach, je Gerät gemerkt)
   Split (Kapitel 1, das bisherige Bild), Sarajevo (Kapitel 2, Samstag 19. November 2011), Mostar (Kapitel 3, Donnerstag
   24. November 2011, Regen), München (Kapitel 4, Heiligabend 2011). Jedes Bild: paint() → 320×144 (ruhender Teil, einmal),
   dynamic(fb,t) → Bewegung darüber, lower(fb,t,water) → die Zeilen unter der Szene (sonst gespiegeltes Wasser).
   Gezeichnet wird mit den Mitteln des Spiels (Palette, Rampen, Himmel, Nebel, Schnee, Regen, Minarett); Mala ist in jedem Bild,
   immer nur als Schimmer. Unterzeile und Menü bleiben wie gehabt (06_ui.js, 07_shell.js). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
function ra(r,v,x,y){ return M.rampAt(r,v<0?0:(v>1?1:v),x,y); }
function sstep(v){ v=v<0?0:(v>1?1:v); return v*v*(3-2*v); }
// Mala als kleiner Schimmer (Figuren in der Ferne, 1 × 6 Pixel): zittert leicht, nur jedes zweite Bild voll
function tinyGhost(fb,x,y,t,a){ x=Math.round(x); y=Math.round(y); var fl=(Math.sin(t*5.3)+1)*0.5*(a||0.8);
  for (var k=0;k<6;k++){ if (bayer(x,y-k+Math.floor(t*7))>fl) continue; fb.px(x,y-k,k<2?P.x4:P.x5); if (k===3||k===4) fb.px(x+1,y-k,P.x3); } }
// kleiner Mensch in der Ferne (2 × 5 Pixel), Beine im Schritt
function tinyWalker(fb,x,y,t,col){ x=Math.round(x); y=Math.round(y); var st=Math.floor(t*4)%2, c=col||P.k1;
  fb.px(x,y-4,c); fb.px(x+1,y-4,c); fb.px(x,y-3,c); fb.px(x+1,y-3,c); fb.px(x,y-2,c); fb.px(x+1,y-2,c); fb.px(st?x:x+1,y-1,c); fb.px(st?x+1:x,y,c); fb.px(x,y-5,c); }
function glowAt(fb,cx,cy,r,col,amt){ for (var y=Math.floor(cy-r);y<=cy+r;y++) for (var x=Math.floor(cx-r);x<=cx+r;x++){ var d=Math.hypot(x-cx,y-cy)/r; if (d>1) continue; if (bayer(x,y)<(1-d)*(amt||0.5)) fb.px(x,y,col); } }

// ================================================================ 1 · Split: das bisherige Titelbild (90_story.js)
var SPLIT={ id:'split', name:'Split', paint:function(){ return M.paintTitle(); }, dynamic:function(fb,t){ M.titleDynamic(fb,t); } };

// ================================================================ 2 · Sarajevo: Novembernacht an der Miljacka, Nebel, erster Schnee, die Linie 3
var SA={ hillL:function(x){ return 50+44*sstep(x/150); }, hillR:function(x){ return 94-36*sstep((x-188)/132); }, quay:100, water:107,
  lamps:[134,160,188,216,244,272,300], bridge:{x0:14,x1:116,deck:101} };
function saBridgeY(x){ var B=SA.bridge; return B.deck-Math.round(4*Math.sin(Math.PI*(x-B.x0)/(B.x1-B.x0))); }
function paintSarajevo(){ var b=new M.Buf(320,144,P.k0), x, y, i, r=M.rng(52);
  // Himmel: Nacht, über der Stadt ein warmer Schein im Nebel
  var sky=R('k0 k1 k2 n0 n1'), glow=R('n0 v1 v2 d1');
  for (y=0;y<100;y++) for (x=0;x<320;x++){ var c=ra(sky,y/100*0.95,x,y); if (y>36){ var g=(y-36)/60; if (bayer(x,y)<g*0.8) c=ra(glow,g*0.7+(hash(x>>3,y>>2)-0.5)*0.2,x,y); } b.px(x,y,c); }
  for (i=0;i<60;i++){ var sx=Math.floor(r()*320), sy=Math.floor(r()*30); b.px(sx,sy,r()<0.25?P.n4:P.n3); }
  // ferne Berge im Dunst
  for (x=0;x<320;x++){ var my=Math.round(60+Math.sin(x*0.018+0.6)*7+Math.sin(x*0.051)*3+Math.sin(x*0.13)); for (y=my;y<100;y++) b.px(x,y,bayer(x,y)<0.5+(y-my)*0.02?P.v1:P.v0); }
  // Hügel links und rechts: dunkle Hänge, verstreute Häuser mit Schneedächern und Fenstern
  function hill(f,x0,x1){ for (var xx=x0;xx<x1;xx++){ var top=Math.round(f(xx)); for (var yy=top;yy<SA.quay;yy++) b.px(xx,yy,bayer(xx,yy)<0.22?P.k2:P.k1); b.px(xx,top,P.v1); if (bayer(xx,top+1)<0.5) b.px(xx,top+1,P.n0); } }
  hill(SA.hillL,0,170); hill(SA.hillR,180,320);
  // Häuser am Hang: Dichte nach Rauschen, weiter unten dichter; kleine Wände, Schnee auf manchen Dächern, viele warme Fenster
  function houses(f,x0,x1,seed){ var q=M.rng(seed);
    for (var n=0;n<520;n++){ var xx=x0+Math.floor(q()*(x1-x0)), top=f(xx), yy=Math.round(top+3+Math.pow(q(),0.7)*(SA.quay-6-top-3));
      var cl=hash(Math.floor(xx/11),Math.floor(yy/7)); if (cl<0.35 || yy>=SA.quay-6) continue;
      var w=2+Math.floor(q()*3); b.px(xx,yy,P.s0); b.px(xx+1,yy,P.s0); if (w>2) b.px(xx+2,yy,P.k2);
      if (q()<0.45) for (var rx=0;rx<w;rx++) b.px(xx+rx,yy-1,q()<0.6?P.s3:P.s2);
      if (q()<0.55) b.px(xx+Math.floor(q()*w),yy,q()<0.45?P.y4:(q()<0.6?P.y3:P.y2)); } }
  houses(SA.hillL,0,165,7); houses(SA.hillR,186,320,8);
  // Altstadt am Fluss: niedrige Häuser, Kuppel, Minarette (eines am Hang)
  M.scn.roofs(b,112,256,SA.quay-2,'night',29,{wall:R('k1 k2 s0'),roof:R('s3 s4 s5 s6'),min:6,var:7,lit:0.45});
  // Kuppelmoschee
  var dcx=184, dcy=88; for (y=dcy-9;y<=dcy;y++){ var hw=Math.round(Math.sqrt(Math.max(0,81-(dcy-y)*(dcy-y)))*1.15); for (x=dcx-hw;x<=dcx+hw;x++) b.px(x,y,x<dcx-hw*0.3?P.s3:(x<dcx+hw*0.4?P.s2:P.s1)); }
  b.hl(dcx-11,dcx+11,dcy+1,P.s1); b.rect(dcx-12,dcy+2,25,6,P.k2); for (x=dcx-10;x<=dcx+10;x+=4) b.px(x,dcy+4,P.y3); b.vl(dcx,dcy-12,dcy-10,P.y2);
  for (x=dcx-7;x<=dcx+6;x++) if (hash(x,3)<0.8) b.px(x,dcy-9+Math.round(Math.abs(x-dcx)*Math.abs(x-dcx)/14),P.s5);
  var st=R('s1 s2 s3 s4'), cap=R('k2 m0 m1 m2'); M.scn.minaret(b,206,SA.quay-4,36,{lit:true,stone:st,cap:cap}); M.scn.minaret(b,150,SA.quay-4,28,{stone:st,cap:cap}); M.scn.minaret(b,62,Math.round(SA.hillL(62))+6,18,{stone:st,cap:cap});
  // Uferstraße mit Laternen und Gleis; Mauer zum Fluss
  b.rect(110,SA.quay-2,210,4,P.k2); b.hl(110,319,SA.quay+1,P.m1); b.hl(110,319,SA.quay+2,P.k1);
  for (x=0;x<320;x++){ b.px(x,SA.quay+3,P.s1); b.px(x,SA.quay+4,(x%6===0)?P.k2:P.s0); b.px(x,SA.quay+5,P.k1); }
  SA.lamps.forEach(function(lx){ b.vl(lx,SA.quay-10,SA.quay-1,P.k0); b.px(lx-1,SA.quay-11,P.y3); b.px(lx,SA.quay-11,P.y5); b.px(lx+1,SA.quay-11,P.y3); b.px(lx,SA.quay-12,P.y3); glowAt(b,lx,SA.quay-11,6,P.y1,0.35); });
  // Fluss: dunkel, Lichter als senkrechte Streifen
  for (y=SA.water;y<144;y++) for (x=0;x<320;x++){ var v=(y-SA.water)/37; b.px(x,y,ra(R('k1 n0 k1 a0'),0.2+v*0.5+(hash(x>>2,y)-0.5)*0.3,x,y)); }
  SA.lamps.forEach(function(lx){ for (y=SA.water;y<136;y++){ var w=1+Math.floor((y-SA.water)/9); for (var dx=-w;dx<=w;dx++) if (bayer(lx+dx,y)<0.5-(y-SA.water)/70-Math.abs(dx)*0.1) b.px(lx+dx,y,(y-SA.water)<6?P.y3:P.y1); } });
  // Lateinerbrücke: steinerne Bögen, über den Pfeilern die runden „Augen“
  var B=SA.bridge; for (x=B.x0;x<=B.x1;x++){ var dy=saBridgeY(x); for (y=dy;y<SA.water+6;y++){ var c2=(y===dy)?P.s3:(y===dy+1?P.s2:P.s1); b.px(x,y,c2); } }
  [[B.x0+4,B.x0+30],[B.x0+36,B.x0+66],[B.x0+72,B.x1-4]].forEach(function(a){ var cx=(a[0]+a[1])/2, rr=(a[1]-a[0])/2; for (x=a[0];x<=a[1];x++){ var top=SA.water+6-Math.round(Math.sqrt(Math.max(0,rr*rr-(x-cx)*(x-cx)))*0.75); for (y=top;y<SA.water+7;y++) b.px(x,y,y===top?P.s0:P.k1); } });
  [B.x0+33,B.x0+69].forEach(function(ex){ var ey=saBridgeY(ex)+4; b.ellipse(ex,ey,2,2,P.k1); });
  for (x=B.x0;x<=B.x1;x+=3) b.px(x,saBridgeY(x)-1,P.s2);
  return b; }
function saTram(fb,x,t){ var y0=SA.quay-2, L=46, H=10, xx, yy;   // Straßenbahn (rot, Fensterband erleuchtet), fährt nach links
  for (xx=0;xx<L;xx++){ var px=Math.round(x+xx); if (px<0||px>=320) continue; var nose=(xx<4)?4-xx:((xx>L-4)?xx-(L-4):0), top=y0-H+(nose>2?1:0);
    for (yy=top;yy<y0;yy++){ var c; if (yy===top) c=P.m2; else if (yy<y0-7) c=P.r1; else if (yy<y0-3){ var w=(xx-2)%6; c=(w<1||xx<2||xx>L-3)?P.r1:((yy===y0-7)?P.y5:P.y4); if (xx===22||xx===23) c=P.k2; } else c=yy===y0-1?P.k1:P.r0; fb.px(px,yy,c); } }
  var pg=Math.round(x+L*0.62); fb.px(pg,y0-H-1,P.m3); fb.px(pg+1,y0-H-2,P.m3); fb.px(pg+2,y0-H-3,P.m3); fb.hl(pg-1,pg+4,y0-H-4,P.m2);
  // Liniennummer vorn
  var fx=Math.round(x+1); [[0,0],[1,0],[2,1],[1,2],[2,3],[0,4],[1,4]].forEach(function(d){ fb.px(fx+d[0],y0-8+d[1],P.s6); });
  // Spiegelung im Fluss
  for (xx=4;xx<L-4;xx+=6){ var rx=Math.round(x+xx); for (yy=SA.water+1;yy<SA.water+12;yy++) if (bayer(rx,yy+Math.floor(t*6))<0.45-(yy-SA.water)*0.035) fb.px(rx+Math.round(Math.sin(t*3+yy)*0.8),yy,P.y2); } }
function dynSarajevo(fb,t){
  // Linie 3: alle 26 s von rechts nach links über die Uferstraße
  var cyc=26, ph=t%cyc, x=330-ph*22; if (x>-50 && x<330) saTram(fb,x,t);
  // Lichter auf dem Wasser zittern
  SA.lamps.forEach(function(lx){ M.glints(fb,lx,SA.water+1,138,5,t,P.y3,0); });
  // ein paar Fenster gehen an und aus
  for (var i=0;i<6;i++){ var wx=Math.floor(hash(i,61)*150)+(i%2?180:4), on=hash(i,Math.floor(t/7+i))<0.6; if (on){ var wy=Math.round((i%2?SA.hillR(wx):SA.hillL(wx))+6+hash(i,62)*20); if (wy<SA.quay-6) fb.px(wx,wy,P.y4); } }
  // Mala als Schimmer auf der Brücke, langsam hinüber
  var gx=SA.bridge.x0+6+((t*2.2)%(SA.bridge.x1-SA.bridge.x0+30)); if (gx<SA.bridge.x1-4) tinyGhost(fb,gx,saBridgeY(gx)-1,t,0.75);
  M.fogDrift(fb,t,{y0:46,y1:104,amt:0.42,col:P.m1,k:1,speed:3});
  M.snow(fb,t,{n:46,h:144,wind:5,col:P.s5,col2:P.s3}); }

// ================================================================ 3 · Mostar: die Alte Brücke am Abend im Regen, die Neretva grün, oben ein roter Schirm
var MO={ cx:170, crest:63, sprL:106, sprR:234, sprY:101, inCrest:69, water:114, deckL:88, deckR:252 };
function moDeck(x){ var k=(x-MO.cx)/82; return MO.crest+Math.round(19*k*k); }
function moIntra(x){ var k=(x-MO.cx)/((MO.sprR-MO.sprL)/2); if (Math.abs(k)>1) return 999; return MO.inCrest+Math.round((MO.sprY-MO.inCrest)*k*k); }
function paintMostar(){ var b=new M.Buf(320,144,P.k0), x, y, i;
  M.scn.sky(b,0,0,320,100,'dusk','rain',7);
  for (y=40;y<84;y++) for (x=0;x<320;x++) if (bayer(x,y)<(y-40)/44*0.55) b.px(x,y,(y>70)?P.d2:P.d1);   // letztes Licht am Horizont
  // Berge: links der Hum, rechts der Velež, im Regendunst
  for (x=0;x<320;x++){ var hy=x<160?Math.round(46+Math.sin(x*0.03+1.2)*6+Math.sin(x*0.09)*2+x*0.04):Math.round(34+Math.sin(x*0.022+0.3)*8+Math.sin(x*0.07)*3+(320-x)*0.06);
    for (y=hy;y<100;y++) b.px(x,y,bayer(x,y)<0.35+(y-hy)*0.015?P.m1:P.m0); }
  // Häuser an beiden Ufern, Steinplattendächer, erleuchtete Fenster
  function town(x0,x1,base,seed,stepUp){ var q=M.rng(seed); for (var xx=x0;xx<x1;){ var w=7+Math.floor(q()*8), h=8+Math.floor(q()*8), tb=base+Math.round(stepUp*(xx-x0)), top=tb-h;
      for (var yy=top;yy<tb+14;yy++) for (var hx=xx;hx<Math.min(x1,xx+w);hx++) b.px(hx,yy,hx===xx?P.s2:(bayer(hx,yy)<0.4?P.s1:P.s0));
      for (var k=0;k<3;k++) for (var rx=xx-1+k;rx<Math.min(x1,xx+w+1-k);rx++) b.px(rx,top-1-k,k===2?P.m3:(rx%3===0?P.m1:P.m2));
      for (var wi=0;wi<2;wi++) if (q()<0.65){ var wx=xx+1+Math.floor(q()*(w-3)), wy=top+2+Math.floor(q()*(h-4)); b.rect(wx,wy,2,2,q()<0.6?P.y4:P.y3); }
      xx+=w; } }
  town(0,66,84,11,0.18); town(268,320,92,12,-0.25);
  // Koski-Mehmed-Paša-Moschee mit Minarett (linkes Ufer)
  var ks=R('s2 s3 s4 s5'); M.scn.minaret(b,30,90,50,{stone:ks,cap:R('m0 m1 m2 m3'),lit:true});
  for (y=78;y<=86;y++){ var hw2=Math.round(Math.sqrt(Math.max(0,64-(86-y)*(86-y)))*1.2); for (x=48-hw2;x<=48+hw2;x++) b.px(x,y,x<46?P.m3:P.m2); } b.rect(38,87,21,8,P.s2); b.px(44,90,P.y3); b.px(52,90,P.y3);
  // Felsen der Schlucht
  for (x=56;x<120;x++){ var top=x<92?86+Math.round((x-56)*0.2):Math.round(MO.sprY-2+(x-92)*0.9); if (x>=MO.sprL) top=Math.max(top,moIntra(x)+1); for (y=top;y<MO.water+2;y++) b.px(x,y,hash(x>>1,y>>1)<0.25?P.k2:(bayer(x,y)<0.5?P.s1:P.m1)); }
  for (x=220;x<284;x++){ var top2=x>256?90-Math.round((x-256)*0.1):Math.round(MO.sprY-2+(256-x)*0.75); if (x<=MO.sprR) top2=Math.max(top2,moIntra(x)+1); for (y=top2;y<MO.water+2;y++) b.px(x,y,hash(x>>1,y>>1)<0.25?P.k2:(bayer(x,y)<0.5?P.s1:P.m1)); }
  // Türme: Tara (links, rund) und Halebija (rechts, eckig)
  for (y=58;y<100;y++) for (x=66;x<=92;x++){ var u=(x-66)/26, c=ra(R('s1 s2 s3 s4'),0.15+Math.sin(u*Math.PI)*0.75,x,y); b.px(x,y,c); }
  for (y=50;y<58;y++){ var hw3=Math.round((y-50)*1.7); for (x=79-hw3;x<=79+hw3;x++) b.px(x,y,x<79?P.m2:P.m1); }
  b.rect(76,66,2,4,P.k1); b.rect(84,74,2,3,P.y3);
  for (y=66;y<100;y++) for (x=250;x<=270;x++) b.px(x,y,x<254?P.s3:(bayer(x,y)<0.5?P.s2:P.s1));
  for (y=60;y<66;y++){ var hw4=Math.round((y-60)*1.8)+1; for (x=260-hw4;x<=260+hw4;x++) b.px(x,y,x<260?P.m2:P.m1); }
  b.rect(256,72,2,3,P.k1); b.rect(262,82,2,3,P.y4);
  // Durchblick unter dem Bogen: die Schlucht flussabwärts im Dunst, ferne Felsen, Wasser
  for (x=MO.sprL;x<=MO.sprR;x++){ var iy0=moIntra(x); for (y=iy0+1;y<MO.water;y++){ var d=(y-iy0)/(MO.water-iy0), c0=(y>MO.water-8)?(bayer(x,y)<0.5?P.a1:P.a0):(d<0.45?(bayer(x,y)<0.35?P.m1:P.m0):(hash(x>>1,y)<0.3?P.k2:(bayer(x,y)<0.4?P.m0:P.k2))); b.px(x,y,c0); } }
  // die Brücke: schlanker Bogen, Rücken mit Brüstung, Steinlagen, von unten warm angestrahlt
  for (x=MO.deckL;x<=MO.deckR;x++){ var dy=moDeck(x), iy=moIntra(x);
    for (y=dy;y<Math.min(iy,dy+44);y++){ var lit=Math.max(0,1-Math.abs(x-MO.cx)/110), c3;
      if (y===dy) c3=P.s5; else if (y===dy+1) c3=P.s4; else if (y===dy+2) c3=P.s2; else { c3=ra(R('s2 s3 s4'),0.3+lit*0.35+(y-dy)/50,x,y); if ((y-dy)%5===0 && hash(x>>2,y)<0.6) c3=P.s2; if (y>iy-3) c3=P.s4; } b.px(x,y,c3); } }
  for (x=MO.sprL;x<=MO.sprR;x++){ var iy2=moIntra(x); b.px(x,iy2,P.s5); }
  [[MO.deckL+6,'L'],[MO.deckR-6,'R']].forEach(function(l){ var lx=l[0], ly=moDeck(lx)-1; b.vl(lx,ly-6,ly,P.k0); b.px(lx,ly-7,P.y5); b.px(lx-1,ly-7,P.y3); b.px(lx+1,ly-7,P.y3); glowAt(b,lx,ly-7,7,P.y2,0.3); });
  // die Neretva: grün, Schaum, unter dem Bogen dunkler
  for (y=MO.water;y<144;y++) for (x=0;x<320;x++){ var v=(y-MO.water)/30, c4=ra(R('a0 a1 a2 a3'),0.62-v*0.35+(hash(x>>2,y)-0.5)*0.3,x,y); b.px(x,y,c4); }
  // Spiegelung des Bogens und der Lampen im Fluss
  for (x=MO.sprL;x<=MO.sprR;x++){ var ry=MO.water+Math.round((MO.sprY-moIntra(x))*0.35); if (ry<144 && bayer(x,ry)<0.6) b.px(x,ry,P.s2); }
  [MO.deckL+6,MO.deckR-6,30].forEach(function(lx){ for (y=MO.water+1;y<140;y++) if (bayer(lx,y)<0.55-(y-MO.water)/50){ b.px(lx,y,P.y2); if (y<MO.water+8) b.px(lx+1,y,P.y1); } });
  return b; }
function dynMostar(fb,t){ var i, x, y;
  // Strömung: Schaumstreifen ziehen flussabwärts (nach rechts)
  for (i=0;i<26;i++){ var sp=10+hash(i,71)*14, len=3+Math.floor(hash(i,72)*6); x=Math.floor((hash(i,73)*360+t*sp)%360)-20; y=MO.water+2+Math.floor(hash(i,74)*28);
    for (var k=0;k<len;k++) if (bayer(x+k,y)<0.6) fb.px(x+k,y,k===0?P.a5:P.a4); }
  // Regenringe auf dem Wasser
  for (i=0;i<10;i++){ var life=(t*1.3+hash(i,75)*5)%1.2; if (life>0.5) continue; var rx=Math.floor(hash(i,Math.floor((t*1.3+hash(i,75)*5)/1.2))*320), ry=MO.water+4+Math.floor(hash(i+7,Math.floor(t))*24), rr=1+Math.floor(life*4);
    fb.px(rx-rr,ry,P.a4); fb.px(rx+rr,ry,P.a4); if (rr>1){ fb.px(rx,ry-1,P.a3); fb.px(rx,ry+1,P.a3); } }
  // auf der Brücke: ein roter Schirm geht hinüber, neben ihm ein Schimmer
  var s=(t*4.2)%230, wx=MO.deckL+4+s; if (wx<MO.deckR-4){ var fy=moDeck(wx)-1; tinyWalker(fb,wx,fy,t,P.k1); var ux=Math.round(wx); fb.hl(ux-2,ux+3,fy-7,P.r3); fb.hl(ux-1,ux+2,fy-8,P.r4); fb.px(ux-3,fy-6,P.r2); fb.px(ux+4,fy-6,P.r2); fb.vl(ux+1,fy-6,fy-5,P.k0);
    tinyGhost(fb,wx-5,moDeck(wx-5)-1,t,0.7); }
  // Lampen flackern im Regen
  [[MO.deckL+6],[MO.deckR-6]].forEach(function(l){ var lx=l[0], ly=moDeck(lx)-8; if (Math.sin(t*9+lx)>0.6) fb.px(lx,ly-1,P.y4); });
  M.rain(fb,t,{n:120,h:144,col:P.m2,col2:P.m3,speed:250,slant:0.22}); }

// ================================================================ 4 · München: Heiligabend, Schnee, die Türme der Frauenkirche, der Christbaum
var MU={ ground:112, tree:{x:158,top:74,base:120}, towers:[282,306], tw:8, chim:[[62,92],[112,88],[196,95],[236,90]] };
function paintMuenchen(){ var b=new M.Buf(320,144,P.k0), x, y, i, r=M.rng(77);
  var sky=R('k0 k1 k2 n0 n1'), glow=R('n1 v1 v2 d1');
  for (y=0;y<110;y++) for (x=0;x<320;x++){ var c=ra(sky,y/110,x,y); if (y>50){ var g=(y-50)/60; if (bayer(x,y)<g*0.7) c=ra(glow,g*0.75+(hash(x>>3,y>>2)-0.5)*0.2,x,y); } b.px(x,y,c); }
  for (i=0;i<9;i++){ var cx=r()*320, cy=6+r()*40, rx=18+r()*40, ry=2+r()*2; for (y=Math.floor(cy-ry);y<=cy+ry;y++) for (x=Math.floor(cx-rx);x<=cx+rx;x++){ var dx=(x-cx)/rx, dy=(y-cy)/ry; if (dx*dx+dy*dy>1||bayer(x,y)<dx*dx) continue; b.px(x,y,dy>0.2?P.n0:P.n1); } }
  // Frauenkirche: Kirchendach, zwei Türme mit den runden Hauben
  for (y=72;y<MU.ground;y++) for (x=266;x<320;x++) b.px(x,y,bayer(x,y)<0.3?P.m0:P.k2);
  for (x=266;x<320;x++) if (hash(x,5)<0.85) b.px(x,72,P.s4);
  MU.towers.forEach(function(tx,k){ var w=MU.tw, top=36;
    for (y=top;y<MU.ground;y++) for (x=tx-w;x<=tx+w;x++){ var c2=(x===tx-w)?P.q2:((x===tx+w)?P.p0:(bayer(x,y)<0.5?P.q1:P.t1)); if ((x-tx+w)%6===0 && y>top+4) c2=P.q1; b.px(x,y,c2); }
    for (y=top-14;y<top;y++){ var f=(y-(top-14))/14, hw=Math.round(Math.sin(Math.min(1,f*1.15)*Math.PI*0.62)*(w+2)); for (x=tx-hw;x<=tx+hw;x++) b.px(x,y,x<tx-1?P.g3:(x<tx+2?P.g2:P.g1)); }
    b.rect(tx-1,top-18,3,4,P.g2); b.px(tx,top-19,P.g3); b.px(tx,top-20,P.y3);
    for (x=tx-w-1;x<=tx+w+1;x++) b.px(x,top,P.s3);
    b.rect(tx-2,top+8,5,10,P.k1); b.px(tx,top+12,P.y3); b.rect(tx-1,top+30,3,6,P.k1);
    b.ellipse(tx,top+24,3,3,P.s3); b.px(tx,top+23,P.k1); b.px(tx+1,top+24,P.k1); });
  // Rathausturm links: spitzer Helm mit Fialen, Uhr erleuchtet
  var rt=30; for (y=50;y<MU.ground;y++) for (x=rt-6;x<=rt+6;x++) b.px(x,y,x===rt-6?P.s2:(bayer(x,y)<0.5?P.s1:P.s0));
  for (y=22;y<50;y++){ var hw2=Math.round((y-22)/28*7); for (x=rt-hw2;x<=rt+hw2;x++) b.px(x,y,x<rt?P.m2:P.m1); } b.px(rt,21,P.s3);
  [-6,6].forEach(function(o){ for (y=42;y<52;y++) b.px(rt+o,y,y<45?P.m2:P.s2); }); b.ellipse(rt,60,3,3,P.y4); b.px(rt,60,P.y1); b.px(rt+1,59,P.y1);
  // Giebelhäuser mit Schnee auf den Dächern, warme Fenster, Sterne in manchen Fenstern
  var q=M.rng(81); for (x=-4;x<320;){ var w=14+Math.floor(q()*12), h=12+Math.floor(q()*10), base=MU.ground, top=base-h, peak=top-Math.floor(w/2)-2;
    if (x+w>266 && h<18){ x+=w; continue; }
    for (y=top;y<base;y++) for (var hx=x;hx<x+w;hx++) b.px(hx,y,hx===x?P.s1:(bayer(hx,y)<0.45?P.s0:P.k2));
    for (y=peak;y<top;y++){ var hw3=Math.round((y-peak)/(top-peak)*(w/2)); for (var gx=x+Math.floor(w/2)-hw3;gx<=x+Math.floor(w/2)+hw3;gx++){ var lft=gx<x+w/2; b.px(gx,y,lft?(bayer(gx,y)<0.8?P.s5:P.s4):(bayer(gx,y)<0.6?P.s3:P.c3)); } }
    for (var wy=top+3;wy<base-3;wy+=6) for (var wx=x+3;wx<x+w-4;wx+=5){ var lw=q(); if (lw<0.42){ b.rect(wx,wy,2,2,q()<0.5?P.y4:P.y3); if (q()<0.18){ b.px(wx-1,wy,P.y5); b.px(wx+2,wy,P.y5); } } else if (lw<0.7) b.rect(wx,wy,2,2,P.k1); }
    x+=w; }
  // Platz im Schnee: Christbaum, Buden des Christkindlmarkts
  for (y=MU.ground;y<144;y++) for (x=0;x<320;x++){ var v=(y-MU.ground)/32; b.px(x,y,ra(R('c1 c2 c3 s3'),0.8-v*0.55+(hash(x>>2,y>>1)-0.5)*0.25,x,y)); }
  var T0=MU.tree; for (y=T0.top;y<T0.base;y++){ var f2=(y-T0.top)/(T0.base-T0.top), hw4=Math.round(2+f2*15+((y%5)<2?1:0)); for (x=T0.x-hw4;x<=T0.x+hw4;x++) b.px(x,y,x<T0.x-hw4*0.4?P.g2:(bayer(x,y)<0.5?P.g1:P.g0)); }
  b.rect(T0.x-1,T0.base,3,4,P.w1); [[0,-3],[-1,-2],[1,-2],[0,-2],[0,-1],[-2,-2],[2,-2]].forEach(function(d){ b.px(T0.x+d[0],T0.top+d[1],P.y5); });
  function stall(sx,w){ var by=MU.ground+12; b.rect(sx,by-9,w,9,P.w1); b.rect(sx+1,by-7,w-2,4,P.y3); for (var xx=sx-1;xx<=sx+w;xx++){ b.px(xx,by-10,P.s5); b.px(xx,by-11,xx%2?P.r2:P.s5); } b.hl(sx+1,sx+w-2,by-3,P.w2); }
  [12,34,56,204,228,252,280].forEach(function(sx,k){ stall(sx,16+(k%2)*2); });
  return b; }
function dynMuenchen(fb,t){ var i, T0=MU.tree;
  // Lichter am Christbaum funkeln
  for (i=0;i<26;i++){ var f=hash(i,91), y=Math.floor(T0.top+4+f*(T0.base-T0.top-6)), hw=Math.round(2+((y-T0.top)/(T0.base-T0.top))*15), x=Math.floor(T0.x-hw+hash(i,92)*(hw*2+1));
    if (hash(i,Math.floor(t*2.5+i*0.37))<0.7) fb.px(x,y,hash(i,93)<0.5?P.y5:P.y4); }
  // Rauch aus den Kaminen
  MU.chim.forEach(function(c,k){ for (var j=0;j<7;j++){ var age=((t*0.8+j*0.55+k*0.3)%3.85), px=Math.round(c[0]+age*4+Math.sin(age*2+k)*1.5), py=Math.round(c[1]-age*6); if (bayer(px,py)<0.7-age*0.15) fb.px(px,py,age<1.5?P.m2:P.m1); } });
  // Leute über den Platz
  for (i=0;i<6;i++){ var sp=4+hash(i,94)*5, dir=i%2?1:-1, w=360, px2=dir>0?((t*sp+hash(i,95)*w)%w)-20:w-20-((t*sp+hash(i,95)*w)%w), py2=MU.ground+16+Math.floor(hash(i,96)*12);
    tinyWalker(fb,px2,py2,t+i,i%3?P.k1:P.n0); }
  // Mala steht im Schnee und sieht zum Baum
  var a=0.42+Math.sin(t*0.6)*0.1; M.drawPose(fb,T0.x+30,T0.base+6,M.poseF({},'B'),'B','mala',{lut:M.TINT.mala.a,alpha:a,t:t*1000,wobble:1,h:144});
  M.snow(fb,t,{n:110,h:200,wind:5,col:P.s6,col2:P.s4}); }
function lowerMuenchen(fb,t){ var x, y, W=fb.w;   // unter der Szene: Schnee auf dem Platz, nach unten dunkler (kein Spiegelbild)
  for (y=144;y<fb.h;y++){ var v=(y-144)/(fb.h-144); for (x=0;x<W;x++) fb.d[y*W+x]=M.rampAt(R('k1 k2 c1 c2'),0.75-v*0.75+(hash(x>>2,y>>1)-0.5)*0.2,x,y); }
  M.snow(fb,t+3,{n:40,h:fb.h,wind:5,col:P.s5,col2:P.s3}); }

M.TITLES=[SPLIT,
  { id:'sarajevo', name:'Sarajevo', paint:paintSarajevo, dynamic:dynSarajevo },
  { id:'mostar', name:'Mostar', paint:paintMostar, dynamic:dynMostar },
  { id:'muenchen', name:'München', paint:paintMuenchen, dynamic:dynMuenchen, lower:lowerMuenchen } ];
// Auswahl beim Start: der Reihe nach (Split, Sarajevo, Mostar, München, …), je Gerät gemerkt (mala.titel); erster Start: Split.
// ?titel=<id> wählt fest (Tests, Bildschirmfotos); in der QA-VM (ohne Fenster) bleibt es beim ersten Bild.
M.titleIndex=0;
M.pickTitle=function(){ var L=M.TITLES, n=L.length, q=null; if (typeof window==='undefined') return 0;
  try{ q=((location.search||'').match(/[?&]titel=([a-z]+)/)||[])[1]; }catch(e){}
  if (q){ for (var k=0;k<n;k++) if (L[k].id===q){ M.titleIndex=k; return k; } }
  var last=-1; try{ var v=localStorage.getItem('mala.titel'); if (v!==null && v!=='') last=parseInt(v,10); }catch(e){}
  var nx=((isNaN(last)?-1:last)+1)%n; if (nx<0) nx=0; M.titleIndex=nx; try{ localStorage.setItem('mala.titel',String(nx)); }catch(e){} return nx; };
})(M);
