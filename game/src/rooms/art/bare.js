/* ===== rooms/art/bare.js — Friedhof Bare, der katholische Teil, ein Hang über der Stadt (320 px) =====
   Hinten die Hänge, darunter im Dunst die Dächer der Stadt. Der Friedhof steigt nach hinten an: Reihen von Kreuzen aus Stein und
   Holz, dunkle und helle Grabsteine mit eingemeißeltem Kreuz, vorn mit Einfassungen und roten Grablichtern, dazwischen Zypressen.
   Vorn ein Kiesweg mit einer Bank. Rechts der Mitte Lanas Grab, ohne religiöses Zeichen: frische Erde, ein Eichenpfosten, oben die
   Messingtafel, darunter Zlatas Brett, daneben der Quittenableger (S.quince). Links ein abgestecktes Feld, am Montag Zorans
   Doppelgrab (S.grave2): ein Holzkreuz mit weißer Tafel, Kränze mit Schleifen, rote Grablichter. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, GY=112;                                 // Fußlinie der vorderen Gräber
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
var LANA={x:216, post:{x0:212,x1:219,y0:74}, plate:{x0:206,x1:226,y0:76,y1:84}, board:{x0:204,x1:228,y0:88,y1:96}, mound:{x0:200,x1:236}, q:{x:240}};
var Z={x0:84,x1:136};                                     // Zorans Feld
var REG=new Uint8Array(W*H), RG={none:0,sky:1,hill:2,city:3,slope:4,stone:5,tree:6,path:7,grave:8,brass:9};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  return o; }
function paintSky(b,wea){ var w=RW(b,RG.sky), x, y, sun=wea==='sun';
  for (y=0;y<44;y++) for (x=0;x<W;x++) w.px(x,y,ra(sun?R('b3 b4 b5 s6'):R('m3 m4 s5 s6'),0.25+y/44*0.7+(fbm(x,y,24,2)-0.5)*0.18,x,y)); }
function paintHills(b){ var w=RW(b,RG.hill), x, y;
  for (x=0;x<W;x++){ var t1=Math.round(20+Math.sin(x*0.013+1.2)*6+Math.sin(x*0.05)*2); for (y=t1;y<52;y++) w.px(x,y,ra(R('e2 g1 e3 g2'),0.6-(y-t1)/50+(fbm(x,y,12,6)-0.5)*0.3,x,y)); }
  // die Stadt im Tal: Reihen kleiner Häuser mit roten Dächern, dazwischen Minarette
  var c=RW(b,RG.city), rr=M.rng(1976), row, i;
  for (i=0;i<7;i++){ var mx=16+Math.floor(rr()*288); for (y=29;y<46;y++) c.px(mx,y,P.s6); c.px(mx,28,P.s4); c.px(mx,27,P.s4); c.px(mx-1,41,P.s5); c.px(mx+1,41,P.s5); }   // schlanke Minarette: Schaft, Spitze, Umgang weit unten
  for (row=0;row<3;row++){ var yb=44+row*4;
    for (x=-2;x<W;){ var hw=3+Math.floor(rr()*5), hh=2+Math.floor(rr()*3), wall=[P.s5,P.s4,P.e4,P.s6][Math.floor(rr()*4)];
      for (y=yb-hh;y<yb;y++) for (var xx=x;xx<x+hw;xx++) c.px(xx,y,wall);
      for (var xr=x;xr<x+hw;xr++) c.px(xr,yb-hh,rr()<0.8?P.t2:P.t3); if (rr()<0.5) c.px(x+1,yb-1,P.k2);
      x+=hw+(rr()<0.35?1:0); } }
  M.fogBake(b,function(x,y){ var r=REG[y*W+x]; return r===RG.city?0.5:(r===RG.hill?0.3:0); },{col:P.s5}); }
function paintSlope(b){ var w=RW(b,RG.slope), x, y;
  for (y=52;y<GY+2;y++) for (x=0;x<W;x++){ var f=fbm(x,y,6,11); w.px(x,y,ra(R('e1 g1 g2 e2 g3'),0.3+(y-52)/70*0.4+(f-0.5)*0.35,x,y)); } }
// Grabzeichen eines katholischen Friedhofs: 0 Steinkreuz · 1 dunkler Grabstein (Granit) mit hellem Kreuz · 2 heller Grabstein mit
// dunklem Kreuz · 3 Holzkreuz. In den vorderen Reihen mit Einfassung, Grablichtern und Blumen.
function cross(w,x,yb,h,arm,c0,c1,c2){ var y0=yb-h, ya=y0+Math.max(1,Math.round(h*0.28)), i;
  for (var y=y0;y<yb;y++){ w.px(x,y,c1); if (h>8) w.px(x+1,y,c2); }
  for (i=-arm;i<=arm+(h>8?1:0);i++) w.px(x+i,ya,i<0?c0:c1);
  if (h>10) for (i=-arm;i<=arm+1;i++) w.px(x+i,ya+1,c2);
  w.px(x,y0,c0); }
function slab(w,x,yb,h,wd,dark,round,shade){ var x0=x-(wd>>1), y0=yb-h, i, j, R0=dark?R('k1 m0 m1 m1'):R('s4 s5 s5 s6');
  for (j=y0;j<yb;j++) for (i=x0;i<x0+wd;i++){ var top=j-y0; if (round && top===0 && (i===x0||i===x0+wd-1)) continue;
    w.px(i,j,i===x0?(dark?P.m2:P.s6):(i===x0+wd-1?(dark?P.k1:P.s3):(top===0?(dark?P.m3:P.s6):ra(R0,0.5+shade+(hash(i,j)-0.5)*0.15,i,j)))); }
  // eingemeißeltes Kreuz oben in der Mitte
  var cx=x0+(wd>>1), cy=y0+(round?2:1), ch=Math.max(2,Math.min(5,Math.round(h*0.35))), cc=dark?P.s5:P.m1;
  if (wd>=3){ for (var k=0;k<ch;k++) w.px(cx,cy+k,cc); if (wd>=5){ w.px(cx-1,cy+1,cc); w.px(cx+1,cy+1,cc); } } }
function nearDecor(w,x,yb,wd,r){ var i;
  // Einfassung aus Stein als heller Streifen am Fuß
  for (i=x-(wd>>1)-2;i<=x+(wd>>1)+2;i++){ w.px(i,yb,P.s5); w.px(i,yb+1,P.s3); }
  // Grablichter: rote und weiße Becher, oben ein Lichtpunkt
  var n=1+Math.floor(r()*3); for (i=0;i<n;i++){ var lx=x-(wd>>1)+Math.floor(r()*(wd+2)), red=r()<0.7; w.px(lx,yb-1,red?P.r3:P.s6); w.px(lx,yb-2,red?P.r2:P.s5); w.px(lx,yb-3,red?P.r4:P.s6); if (r()<0.6) w.px(lx,yb-4,P.y5); }
  // Blumen
  if (r()<0.5){ var fx=x+(wd>>1)+1; w.px(fx,yb-1,P.g2); w.px(fx,yb-2,r()<0.5?P.y4:P.r3); } }
function paintStones(b){ var w=RW(b,RG.stone), r=M.rng(1993);
  // Reihen nach hinten kleiner, dichter; vorn bleiben Lanas Feld, Zorans Feld und der Weg frei
  var rows=[[60,3,2,10,-0.15],[68,4,2,9,-0.1],[77,5,3,8,-0.05],[88,7,4,7,0],[100,9,5,6,0.05]];
  rows.forEach(function(rw){ var yb=rw[0], hmax=rw[1]*2+2, wd0=rw[2], step=rw[3]+4, near=yb>=88;
    for (var x=4+(hash(yb,1)*step|0);x<W-4;x+=step+Math.floor(r()*4)){ if (yb>=86 && ((x>Z.x0-4&&x<Z.x1+4)||(x>LANA.mound.x0-6&&x<LANA.q.x+8))) continue;
      var h=Math.round(hmax*(0.6+r()*0.6)), wd=wd0+Math.floor(r()*3), kind=Math.floor(r()*4);
      if (kind===0) cross(w,x,yb,h+2,Math.max(1,Math.round(h/4)),P.s6,P.s5,P.s3);
      else if (kind===1) slab(w,x,yb,h,wd+1,true,r()<0.5,rw[4]);
      else if (kind===2) slab(w,x,yb,h,wd,false,r()<0.6,rw[4]);
      else cross(w,x,yb,h,Math.max(1,Math.round(h/4)),P.w3,P.w2,P.w0);
      if (near) nearDecor(w,x,yb,wd+1,r); } }); }
function cypress(b,x,yb,h){ var w=RW(b,RG.tree);
  for (var y=yb-h;y<yb;y++){ var t=(y-(yb-h))/h, half=Math.round(1+Math.sin(Math.min(1,t*1.15)*Math.PI*0.62)*5); for (var i=-half;i<=half;i++){ var f=fbm(x+i,y,3,13); if (Math.abs(i)===half && f<0.5) continue; w.px(x+i,y,ra(R('k1 w0 e1 g1'),0.3+f*0.5+(i<0?0.12:-0.1),x+i,y)); } }
  for (var y2=yb;y2<yb+3;y2++){ w.px(x,y2,P.w1); w.px(x+1,y2,P.w0); } }
function paintGraves(b,S){ var g=RW(b,RG.grave), br=RW(b,RG.brass), x, y;
  // Lanas Grab: frische Erde, darüber der Pfosten mit Tafel und Brett
  for (y=GY-6;y<GY+1;y++) for (x=LANA.mound.x0;x<LANA.mound.x1;x++){ var dx=(x-(LANA.mound.x0+LANA.mound.x1)/2)/((LANA.mound.x1-LANA.mound.x0)/2), top=GY-1-Math.round((1-dx*dx)*5); if (y<top) continue; g.px(x,y,ra(R('e0 e1 e2 t1'),0.4+(y-top)*0.05+(hash(x,y)-0.5)*0.4,x,y)); }
  if (S.post!==false){ for (y=LANA.post.y0;y<GY-3;y++) for (x=LANA.post.x0;x<LANA.post.x1;x++) g.px(x,y,x===LANA.post.x0?P.w4:(x===LANA.post.x1-1?P.w1:ra(R('w2 w3 w3'),0.5+hash(x,y>>1)*0.2,x,y)));
    g.hl(LANA.post.x0,LANA.post.x1-1,LANA.post.y0,P.w4);
    for (y=LANA.plate.y0;y<LANA.plate.y1;y++) for (x=LANA.plate.x0;x<LANA.plate.x1;x++) br.px(x,y,(y===LANA.plate.y0||x===LANA.plate.x0)?P.y5:((y===LANA.plate.y1-1||x===LANA.plate.x1-1)?P.y1:((y===LANA.plate.y0+2||y===LANA.plate.y0+5)&&x>LANA.plate.x0+2&&x<LANA.plate.x1-3?P.y1:P.y3)));
    for (y=LANA.board.y0;y<LANA.board.y1;y++) for (x=LANA.board.x0;x<LANA.board.x1;x++) g.px(x,y,(y===LANA.board.y0)?P.w4:((y===LANA.board.y1-1)?P.w0:((y===LANA.board.y0+3&&x>LANA.board.x0+3&&x<LANA.board.x1-4&&(x%3))?P.w0:ra(R('w1 w2 w3'),0.45+((x+y*3)%7===0?-0.3:0),x,y))));
    g.px(LANA.board.x0+1,LANA.board.y0+1,P.m2); g.px(LANA.board.x1-2,LANA.board.y0+1,P.m2); }
  // Quittenableger: ein dünner Stamm, ein Stab, drei Blätter
  if (S.quince){ var qx=LANA.q.x; for (y=GY-16;y<GY;y++) g.px(qx,y,P.w1); g.vl(qx+2,GY-14,GY-1,P.w3); g.px(qx+1,GY-10,P.e3); g.px(qx-1,GY-13,P.g3); g.px(qx+1,GY-16,P.g4); g.px(qx-2,GY-15,P.g3); g.px(qx,GY-17,P.g4); }
  // Zorans Feld: am Freitag abgesteckt; am Montag frische Erde unter Kränzen, ein Holzkreuz mit weißer Tafel, rote Grablichter
  if (S.grave2){ for (y=GY-6;y<GY+1;y++) for (x=Z.x0;x<Z.x1;x++){ var dz=(x-(Z.x0+Z.x1)/2)/((Z.x1-Z.x0)/2), tz=GY-1-Math.round((1-dz*dz)*4); if (y<tz) continue; g.px(x,y,ra(R('e0 e1 e2 t1'),0.4+(y-tz)*0.05+(hash(x,y)-0.5)*0.4,x,y)); }
    // das Holzkreuz
    var cx=111, ct=GY-32;
    for (y=ct;y<GY-2;y++){ g.px(cx-1,y,P.w3); g.px(cx,y,P.w2); g.px(cx+1,y,P.w1); }
    for (x=cx-8;x<=cx+8;x++){ g.px(x,ct+7,x===cx-8?P.w3:P.w2); g.px(x,ct+8,P.w1); }
    g.hl(cx-1,cx+1,ct,P.w4);
    // die Tafel am Kreuz
    for (y=ct+11;y<ct+18;y++) for (x=cx-4;x<=cx+4;x++) g.px(x,y,(y===ct+11||x===cx-4)?P.s6:((y===ct+17||x===cx+4)?P.s3:P.s5));
    g.hl(cx-3,cx+3,ct+13,P.m1); g.hl(cx-2,cx+2,ct+15,P.m2);
    // Kränze mit Schleifen auf dem Hügel
    [[96,GY-4,5],[104,GY-6,4],[121,GY-6,4],[129,GY-4,5]].forEach(function(k,i){ var kx=k[0], ky=k[1], rr=k[2];
      for (var a=0;a<28;a++){ var an=a/28*Math.PI*2, px=Math.round(kx+Math.cos(an)*rr), py=Math.round(ky+Math.sin(an)*rr*0.55); g.px(px,py,(a%5===0)?[P.r3,P.s6,P.y4,P.r2][i]:(a%2?P.g2:P.g3)); }
      g.vl(kx-1,ky+1,ky+4,i%2?P.s6:P.k1); g.vl(kx+1,ky+1,ky+5,i%2?P.s6:P.k1); });
    // rote Grablichter vor dem Kreuz
    [106,109,113,116].forEach(function(lx,i){ g.px(lx,GY-1,P.r3); g.px(lx,GY-2,P.r2); g.px(lx,GY-3,P.r4); if (i%2===0) g.px(lx,GY-4,P.y5); }); }
  else { for (x=Z.x0+6;x<Z.x1-6;x+=12){ g.vl(x,GY-6,GY-1,P.w2); g.px(x,GY-7,P.w3); } } }
function paintPath(b){ var w=RW(b,RG.path), x, y;
  for (y=GY+1;y<H;y++) for (x=0;x<W;x++){ var v=0.45+hash(x>>1,y>>1)*0.35+((y-GY)/40)*0.1; if (y===GY+1) v=0.2; w.px(x,y,ra(R('m2 s3 m3 s4 s5'),v,x,y)); }
  for (x=0;x<W;x++){ if (hash(x,9)<0.35) w.px(x,GY+1,P.g2); if (hash(x,10)<0.15) w.px(x,GY+2,P.g3); }
  // Bank
  for (x=22;x<52;x++){ w.px(x,116,P.w3); w.px(x,117,P.w2); w.px(x,120,P.w3); w.px(x,121,P.w1); } [24,49].forEach(function(px){ for (y=117;y<126;y++) w.px(px,y,P.m1); }); }
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0); REG.fill(0); if (tod!=='night') tod='day';
  paintSky(b,wea); paintHills(b); paintSlope(b); paintStones(b); cypress(b,62,100,52); cypress(b,296,98,58); cypress(b,160,86,34); paintGraves(b,S); paintPath(b);
  M.light(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; var v=0; if (wea==='sun' && (r===RG.stone||r===RG.brass)) v+=0.08; if (r===RG.path) v+=(y-GY)/50*0.1; return v-Math.abs(x-200)/1200; });
  return M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; } }); }
function dynamic(fb,v,S,GS){ var t=v.t; if (M.scn.weather(GS)!=='sun') return;
  if (S.post!==false && Math.sin(t*0.9)>0.82){ var k=Math.floor((t*9)%(LANA.plate.x1-LANA.plate.x0)); fb.px(LANA.plate.x0+k,LANA.plate.y0+1,P.y5); fb.px(LANA.plate.x0+k+1,LANA.plate.y0+2,P.y5); } }
M.defineArt('bare',{
  width:W, paint:paint, dynamic:dynamic,
  walk:function(x,y){ if (y<115||y>140||x<6||x>314) return false; if (x>20&&x<54&&y<122) return false; return true; }, walkG:function(){ return false; },
  spots:{ exit:[0,112,14,30], grave:[LANA.mound.x0-2,LANA.post.y0-2,LANA.mound.x1-LANA.mound.x0+4,GY-LANA.post.y0+2], plate:[LANA.plate.x0-1,LANA.plate.y0-1,LANA.plate.x1-LANA.plate.x0+2,LANA.plate.y1-LANA.plate.y0+2],
    board:[LANA.board.x0-1,LANA.board.y0-1,LANA.board.x1-LANA.board.x0+2,LANA.board.y1-LANA.board.y0+2], quince:[LANA.q.x-5,GY-20,12,20], grave2:[Z.x0,GY-34,Z.x1-Z.x0,36],
    stones:[240,60,50,40], cypress:[54,48,18,52], city:[0,38,320,18], bench:[20,112,34,14], path:[140,124,40,14] },
  stands:{ exit:[10,128,'L'], grave:[260,123,'L'], plate:[260,123,'L'], board:[260,123,'L'], quince:[260,123,'L'], grave2:[188,124,'L'], stones:[262,122,'B'], cypress:[66,124,'B'], city:[160,128,'B'], bench:[36,127,'B'], path:[160,130,'B'] },
  actorPos:{ nada:[188,121,'R'], zlata:[250,121,'L'], jasna:[172,123,'R'], ana:[158,124,'R'], mia:[147,126,'R'], niko:[164,127,'R'], hajra:[272,122,'L'], kolar:[134,123,'R'],
    vlado:[284,121,'L'], dragica:[296,123,'L'], sehic:[308,122,'L'], damir:[120,124,'R'], mala:[196,118,'R'],
    jasna2:[95,122,'R'], ana2:[82,123,'R'], mia2:[70,126,'R'], niko2:[89,127,'R'], fra:[126,121,'L'], nada2:[138,124,'L'], hajra2:[150,122,'L'], sehic2:[162,122,'L'], kolar2:[174,123,'L'] },
  start:[30,128,'R'], entries:{ map:[16,128,'R'] }
});
})(M);
