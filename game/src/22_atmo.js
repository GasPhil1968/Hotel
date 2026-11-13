/* ===== 22_atmo.js — Atmosphäre (Probe): Lichtinseln im Dunkeln, Lichtstrahlen mit Staub, Glut und Funken, Lichthöfe, Malas Leuchten,
   schwarzer Rahmen für Erinnerungen. Alles wirkt nach dem Zeichnen der Szene auf das fertige Bild (Palettenindizes, gerastert): Figuren
   werden nicht neu gezeichnet, sie werden nur heller oder dunkler, je nachdem, wo sie stehen. Geister (gmask) bleiben im Dunkeln hell.
   Ein Raum meldet seine Effekte in M.ATMO[raum](S,GS,tod) → {dark, pools, beams, motes, embers, halos, frame}.
   Eingeschaltet nur mit ?atmo=1 oder M.ATMO_ON=true (Probe; im normalen Spiel bleibt alles wie bisher). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash, W=320, SH=144;
M.ATMO=M.ATMO||{};
M.atmoOn=function(){ if (M.ATMO_ON!==undefined) return !!M.ATMO_ON; try{ return /[?&]atmo=1/.test(location.search); }catch(e){ return false; } };
// Farbstiche: warm (Flamme), kalt (Mond), Malas Türkis
var lum=function(r,g,b){ return r*0.3+g*0.59+b*0.11; };
var WARM=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.62+46, g*0.44+L*0.40+18, b*0.18+L*0.08]; });
var COLD=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.40+L*0.30+6, g*0.48+L*0.40+16, b*0.55+L*0.55+40]; });
var MALA=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.30+L*0.25+8, g*0.42+L*0.58+30, b*0.42+L*0.62+40]; });
var TINTS={warm:WARM,cold:COLD,mala:MALA};
function up(c,n){ while (n-->0) c=M.UP[c]; return c; }
function dn(c,n){ while (n-->0) c=M.DN[c]; return c; }
function flick(t,seed,amt){ return 1-amt*(0.5+0.5*Math.sin(t*7.3+seed)*Math.sin(t*3.1+seed*1.7)); }

// ---------------------------------------------------------------- 1 Dunkelheit mit Lichtinseln
// dark: Grundhelligkeit 0…1 (1 = unverändert), steps: wie viele Stufen das völlige Dunkel ausmacht. pools: [{x,y,rx,ry,amt,col,flicker}]
// (x in Raumkoordinaten). Im Kern einer warmen Insel wird zusätzlich warm umgefärbt und eine Stufe aufgehellt.
function darkPass(fb,A,view,cx,ox,gm){ var t=view.t, amb=A.dark, steps=A.steps||5, pools=(A.pools||[]).map(function(p,i){ if (p.follow){ var fa=M.E.ACT[p.follow]; if (!fa || !M.E.actorShown(fa)) return null; p=Object.assign({},p,{x:fa.x,y:fa.y+(p.dy||0)}); } return {x:p.x-cx+ox,y:p.y,rx:p.rx,ry:p.ry||p.rx*0.55,amt:(p.amt||1)*(p.flicker?flick(t,i*3.7,p.flicker):1),col:p.col,core:p.core===undefined?0.72:p.core}; }).filter(Boolean);
  for (var y=0;y<SH;y++) for (var x=0;x<W;x++){ var k=y*W+x; if (gm && gm[k]) continue; var L=amb, tc=null, tl=0;
    for (var i=0;i<pools.length;i++){ var p=pools[i], dx=(x-p.x)/p.rx, dy=(y-p.y)/p.ry, d=dx*dx+dy*dy; if (d>=1) continue; var v=p.amt*Math.pow(1-d,1.6); L+=v; if (p.col && v>tl){ tl=v; tc=p.col; } }
    var c=fb.d[k];
    if (tc && tl>0.18){ var tt=TINTS[tc], f=Math.min(1,(tl-0.18)*1.6); if (f+(bayer(x,y)-0.5)*0.8>0.5) c=tt.a[c]; if (tl>0.72 && bayer(y,x)<(tl-0.72)*1.6) c=M.UP[c]; }
    if (L<1){ var s=Math.floor((1-L)*steps+0.5+(bayer(x,y)-0.5)*0.7); if (s>0) c=dn(c,s); }   // in Bändern: ganze Flächen eine Stufe, gerastert nur am Übergang
    fb.d[k]=c; } }

// ---------------------------------------------------------------- 2 Lichtstrahlen und Staub
// beams: [{x0,y0,x1,y1,w0,w1,amt,col}] – vom Fenster (x0,y0) zum Boden (x1,y1), Breite w0 oben, w1 unten. Gerastert aufgehellt, leicht
// atmend; quer laufen langsame hellere Bahnen (Staubschleier). motes: Staubkörner, die im Strahl treiben und aufblitzen.
function inBeam(b,x,y){ var vx=b.x1-b.x0, vy=b.y1-b.y0, L2=vx*vx+vy*vy, t=((x-b.x0)*vx+(y-b.y0)*vy)/L2; if (t<0||t>1) return null; var px=b.x0+vx*t, py=b.y0+vy*t,
  nx=-vy/Math.sqrt(L2), ny=vx/Math.sqrt(L2), s=(x-px)*nx+(y-py)*ny, w=b.w0+(b.w1-b.w0)*t; if (Math.abs(s)>w) return null; return {t:t,s:s/w}; }
function beamPass(fb,A,view,cx,ox){ var t=view.t;
  (A.beams||[]).forEach(function(b0,bi){ var b={x0:b0.x0-cx+ox,y0:b0.y0,x1:b0.x1-cx+ox,y1:b0.y1,w0:b0.w0,w1:b0.w1}, amt=(b0.amt||0.6)*(0.88+0.12*Math.sin(t*0.7+bi)), tt=b0.col?TINTS[b0.col]:null;
    var minx=Math.max(0,Math.floor(Math.min(b.x0-b.w0,b.x1-b.w1)-2)), maxx=Math.min(W-1,Math.ceil(Math.max(b.x0+b.w0,b.x1+b.w1)+2)), miny=Math.max(0,Math.floor(Math.min(b.y0,b.y1)-b.w0)), maxy=Math.min(SH-1,Math.ceil(Math.max(b.y0,b.y1)+b.w1));
    for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var q=inBeam(b,x,y); if (!q) continue; var k=y*W+x, edge=1-Math.abs(q.s), fall=1-q.t*0.55;
      var veil=0.5+0.5*Math.sin(q.s*5+q.t*9-t*0.6+bi*2)*Math.sin(q.t*4+t*0.35), d=amt*Math.min(1,edge*2.2)*fall*(0.65+0.45*veil);
      var c=fb.d[k], bz=(bayer(x,y)-0.5)*0.5; if (d+bz>0.35) c=M.UP[c]; if (d+bz>0.85) c=M.UP[c]; if (tt && d+bz>0.5) c=tt.a[c]; fb.d[k]=c; }
    // Staub: Körner treiben langsam abwärts und quer, blitzen auf, wenn sie durchs Licht drehen
    var n=b0.motes===undefined?26:b0.motes, mc=b0.col==='cold'?[P.n4,P.b4,P.b5]:[P.s5,P.y5,P.l1];
    for (var i=0;i<n;i++){ var h1=hash(i,bi*17+3), h2=hash(i*7+1,bi), h3=hash(i,bi+29), sp=0.012+h3*0.02, ph=(h1+t*sp)%1, side=(h2*2-1)*0.9+Math.sin(t*0.4+i)*0.08;
      var tw=Math.sin(t*(1.5+h3*2.5)+i*1.3); if (tw<-0.2) continue;
      var vx=b.x1-b.x0, vy=b.y1-b.y0, L=Math.sqrt(vx*vx+vy*vy), nx=-vy/L, ny=vx/L, w=b.w0+(b.w1-b.w0)*ph, X=Math.round(b.x0+vx*ph+nx*side*w), Y=Math.round(b.y0+vy*ph+ny*side*w);
      if (X<0||X>=W||Y<0||Y>=SH) continue; fb.d[Y*W+X]=tw>0.8?mc[2]:(tw>0.3?mc[1]:mc[0]); } }); }
// freie Staubwolke ohne Strahl (motes: {x,y,w,h,n,col})
function motePass(fb,A,view,cx,ox){ var t=view.t; (A.motes||[]).forEach(function(m,mi){ var mc=m.col==='cold'?[P.n3,P.n4,P.b4]:(m.col==='mala'?[P.x3,P.x4,P.x5]:[P.s4,P.y4,P.y5]);
  for (var i=0;i<(m.n||20);i++){ var h1=hash(i,mi+5), h2=hash(i+11,mi), h3=hash(i*3,mi+1); var X=Math.round(m.x-cx+ox+((h1*m.w+Math.sin(t*0.3+i)*6+t*(h3-0.5)*3)%m.w+m.w)%m.w), Y=Math.round(m.y+((h2*m.h-t*(2+h3*3))%m.h+m.h)%m.h);
    var tw=Math.sin(t*(1.2+h3*2)+i); if (tw<0 || X<0||X>=W||Y<0||Y>=SH) continue; fb.d[Y*W+X]=tw>0.85?mc[2]:(tw>0.4?mc[1]:mc[0]); } }); }

// ---------------------------------------------------------------- 3 Glut, Funken, Flamme
// embers: [{x,y,h,spread,n,flame}] – Funken steigen auf, glühen aus (gelb → orange → rot). flame: kleine flackernde Flamme an (x,y).
function emberPass(fb,A,view,cx,ox){ var t=view.t;
  (A.embers||[]).forEach(function(e,ei){ var x0=e.x-cx+ox, y0=e.y, cols=[P.l1,P.y5,P.y4,P.y3,P.t4,P.r3,P.r2];
    if (e.glass){ for (var gy=0;gy<5;gy++) for (var gx=-2;gx<=2;gx++){ var GX=x0+gx, GY=y0+1+gy; if (GX<0||GX>=W||GY<0||GY>=SH) continue; fb.d[GY*W+GX]=gx===-2?P.r4:(gx===2?P.r1:(gy===0?P.r4:P.r3)); } if (y0+6<SH) for (var gx2=-2;gx2<=2;gx2++) fb.d[(y0+6)*W+x0+gx2]=P.r1; }
    if (e.flame){ var fh=3+Math.round(1.5+1.5*Math.sin(t*11+ei)*Math.sin(t*5.3)), sw=Math.round(Math.sin(t*6.7+ei)*0.8);
      for (var j=0;j<fh;j++){ var Y=y0-j, X=x0+(j>fh/2?sw:0); if (Y<0||Y>=SH||X<0||X>=W) continue; fb.d[Y*W+X]=j===0?P.y4:(j<fh-1?P.y5:P.l1); if (j<2 && X+1<W) fb.d[Y*W+X+1]=P.y3; } }
    for (var i=0;i<(e.n||8);i++){ var h1=hash(i,ei+41), h3=hash(i*5,ei), sp=0.25+h3*0.35, ph=(h1+t*sp)%1, X2=Math.round(x0+Math.sin(ph*6+i*2.1+t*0.8)*(e.spread||4)*ph+(h1-0.5)*3), Y2=Math.round(y0-2-ph*(e.h||22));
      if (ph>0.92 || X2<0||X2>=W||Y2<0||Y2>=SH) continue; if (Math.sin(t*14+i*3)>0.7) continue; fb.d[Y2*W+X2]=cols[Math.min(cols.length-1,1+Math.floor(ph*6))]; } }); }

// ---------------------------------------------------------------- 4 Lichthöfe um Fenster, Laternen, Flammen
// halos: [{x,y,r,amt,col}] – gerasterter Hof, zur Mitte hin heller, am Rand ausdünnend.
function haloPass(fb,A,view,cx,ox,gm){ var t=view.t; (A.halos||[]).forEach(function(h,hi){ var X0=h.x-cx+ox, r=h.r*(h.flicker?flick(t,hi*5.1,h.flicker):1), tt=h.col?TINTS[h.col]:null, amt=h.amt||0.7;
  for (var y=Math.max(0,Math.floor(h.y-r));y<=Math.min(SH-1,Math.ceil(h.y+r));y++) for (var x=Math.max(0,Math.floor(X0-r));x<=Math.min(W-1,Math.ceil(X0+r));x++){ var d=Math.hypot(x-X0,y-h.y)/r; if (d>=1) continue; var k=y*W+x; if (gm && gm[k]) continue;
    var v=amt*Math.pow(1-d,1.8), c=fb.d[k]; if (bayer(x,y)<v) c=M.UP[c]; if (v>0.5 && bayer(y,x)<(v-0.5)*2) c=M.UP[c]; if (tt && bayer(x+1,y+2)<v*1.4) c=tt.a[c]; fb.d[k]=c; } }); }

// ---------------------------------------------------------------- 5 Malas Leuchten beim Spüren
// M.atmoPulse(x,y,tx,ty): von Mala (Raumkoordinaten, Höhe der Hand) läuft ein Ring aus Türkis nach außen, die Umgebung färbt sich kurz in ihr
// Licht (wer nah steht, bekommt einen türkisen Saum), und zur gespürten Stelle (tx,ty) zucken verästelte Linien. Dauer 1,6 s.
var PULSE=null;
M.atmoPulse=function(x,y,tx,ty,ms){ PULSE={x:x,y:y,tx:tx,ty:ty,t0:M.E.gt(),ms:ms||1600}; };
M.atmoPulseAt=function(x,y,tx,ty,gt){ PULSE={x:x,y:y,tx:tx,ty:ty,t0:gt,ms:1600,fixed:true}; };   // für Standbilder
function bolt(fb,x0,y0,x1,y1,seed,life,lvl){ var n=Math.max(6,Math.round(Math.hypot(x1-x0,y1-y0)/4)), pts=[[x0,y0]], r=M.rng(seed);
  for (var i=1;i<n;i++){ var f=i/n, j=(r()-0.5)*9*Math.sin(Math.PI*f); var dx=x1-x0, dy=y1-y0, L=Math.hypot(dx,dy)||1; pts.push([x0+dx*f-dy/L*j, y0+dy*f+dx/L*j]); } pts.push([x1,y1]);
  var core=lvl?P.x4:P.x6, glow=lvl?P.x2:P.x4;
  for (var k=0;k<pts.length-1;k++){ if (k/pts.length>life) break; var a=pts[k], b=pts[k+1], m=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])));
    for (var s=0;s<=m;s++){ var X=Math.round(a[0]+(b[0]-a[0])*s/m), Y=Math.round(a[1]+(b[1]-a[1])*s/m); if (X<1||X>=W-1||Y<1||Y>=SH-1) continue;
      fb.d[Y*W+X]=core; if (!lvl){ [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(o){ var q=(Y+o[1])*W+X+o[0]; if (fb.d[q]!==core && bayer(X+o[0],Y+o[1])<0.55) fb.d[q]=glow; }); } }
    if (!lvl && r()<0.28 && k>1){ var a2=Math.atan2(y1-y0,x1-x0)+(r()<0.5?-1:1)*(0.6+r()*0.6), l2=8+r()*14; bolt(fb,a[0],a[1],a[0]+Math.cos(a2)*l2,a[1]+Math.sin(a2)*l2,seed*7+k,1,1); } } }
function pulsePass(fb,view,cx,ox){ if (!PULSE) return; var gt=view.gt, q=(gt-PULSE.t0)/PULSE.ms; if (q<0) return; if (q>=1){ if (!PULSE.fixed) PULSE=null; return; }
  var X0=PULSE.x-cx+ox, Y0=PULSE.y, R=12+q*120, fade=1-q, glowR=46*(1-q*0.4);
  for (var y=0;y<SH;y++) for (var x=0;x<W;x++){ var d=Math.hypot(x-X0,(y-Y0)*1.25), k=y*W+x, c=fb.d[k];
    if (d<glowR){ var v=(1-d/glowR)*fade*1.1; if (bayer(x,y)<v*1.3) c=MALA.a[c]; if (bayer(y,x)<v*0.9) c=M.UP[c]; }
    var ring=Math.abs(d-R); if (ring<2.2 && bayer(x,y)<fade*(1-ring/2.2)*1.2) c=ring<0.9?(fade>0.5?P.x5:P.x4):MALA.a[M.UP[c]];
    fb.d[k]=c; }
  if (PULSE.tx!==undefined && q<0.75){ var life=Math.min(1,q*4), seed=1+Math.floor(gt/70); bolt(fb,X0,Y0,PULSE.tx-cx+ox,PULSE.ty,seed,life,0); if (q<0.5) bolt(fb,X0,Y0,PULSE.tx-cx+ox+6,PULSE.ty+4,seed+13,life,1); } }

// ---------------------------------------------------------------- 6 Schwarzer Rahmen (Erinnerungen, Träume)
// frame: {inset, rough, seed} – die Szene sitzt wie herausgeschnitten im Schwarz; der Rand franst unregelmäßig aus und dunkelt nach innen ab.
var FRAMEC={};
function frameMask(f){ var key=[f.inset,f.rough,f.seed].join(','); if (FRAMEC[key]) return FRAMEC[key]; var m=new Float32Array(W*SH), sd=f.seed||5, inset=f.inset||10, rough=f.rough||9;
  function n1(u,o){ return Math.sin(u*0.045+sd+o)*0.5+Math.sin(u*0.11+sd*2.3+o)*0.3+Math.sin(u*0.27+sd*4.1+o)*0.2; }
  for (var y=0;y<SH;y++) for (var x=0;x<W;x++){ var dl=x-(inset+rough*(1+n1(y,1))), dr=(W-1-x)-(inset+rough*(1+n1(y,2))), dt=y-(inset*0.6+rough*0.8*(1+n1(x,3))), db=(SH-1-y)-(inset*0.9+rough*(1+n1(x,4)));
    m[y*W+x]=Math.min(dl,dr,dt*1.3,db*1.2); }
  return (FRAMEC[key]=m); }
function framePass(fb,A){ var m=frameMask(A.frame); for (var k=0;k<W*SH;k++){ var d=m[k]; if (d>=10) continue; var x=k%W, y=(k/W)|0; if (d<0){ fb.d[k]=P.k0; continue; } var s=Math.round((10-d)/2.5-bayer(x,y)); if (s>0) fb.d[k]=dn(fb.d[k],s); } }

// ---------------------------------------------------------------- Einstieg (aus drawScene in 06_ui.js)
M.atmoApply=function(fb,room,view,S,GS,cx,ox,gm){ if (!M.atmoOn()) return; var f=M.ATMO[room.id], A=null; if (f){ try{ A=f(S,GS,view.tod,view); }catch(e){ A=null; } }
  if (A){ if (A.dark!==undefined && A.dark<1) darkPass(fb,A,view,cx,ox,gm); if (A.halos) haloPass(fb,A,view,cx,ox,gm); if (A.beams) beamPass(fb,A,view,cx,ox); if (A.motes) motePass(fb,A,view,cx,ox);
    if (A.embers) emberPass(fb,A,view,cx,ox); if (A.frame) framePass(fb,A); } };
M.atmoPulseDraw=function(fb,view,cx,ox){ if (M.atmoOn()) pulsePass(fb,view,cx,ox); };   // nach der Geistersicht: Mala spürt ja in ihrem Blick

// ---------------------------------------------------------------- Probe-Räume
// Sustipan bei Nacht: Jakovs Grablicht an der Pinie als warme Lichtinsel, die Laterne, sonst Dunkel; Mondlicht kalt über dem Meer.
M.ATMO.sustipan=function(S,G,tod){ var cand=!!G.flags['cj.candle'], L=[];
  if (tod==='day') return null;
  L.push({x:84,y:66,rx:34,ry:30,amt:0.5,col:'warm',flicker:0.05});            // Laternenkopf
  L.push({x:86,y:114,rx:62,ry:20,amt:0.55,col:'warm',flicker:0.05});           // Lichtkreis der Laterne am Boden
  L.push({x:250,y:44,rx:150,ry:44,amt:0.3,col:'cold'});                       // Mondlicht über dem Wasser
  if (cand) L.push({x:126,y:112,rx:58,ry:34,amt:0.95,col:'warm',flicker:0.16});
  L.push({follow:'marko',dy:-22,rx:24,ry:36,amt:0.5,col:'cold'});              // Mondlicht auf Marko: er bleibt lesbar
  return { dark:0.42, steps:4, pools:L,
    halos:[{x:84,y:66,r:14,amt:0.8,col:'warm',flicker:0.05}].concat(cand?[{x:126,y:108,r:11,amt:0.9,col:'warm',flicker:0.22}]:[]),
    embers:cand?[{x:126,y:109,h:22,spread:3,n:6,flame:true,glass:true}]:[] }; };
// Bar „Bura“ am Vormittag: Sonne durchs Fenster, zwei Strahlen mit Staub, im Raum etwas dunkler, damit das Licht trägt.
M.ATMO.bar=function(S,G,tod){ if (tod!=='day') return { dark:0.66, steps:3, pools:[{x:150,y:50,rx:110,ry:70,amt:0.42,col:'warm'},{x:250,y:118,rx:44,ry:22,amt:0.4,col:'warm'}],
    motes:[{x:110,y:20,w:120,h:70,n:16,col:'warm'}] };
  return { dark:0.8, steps:3, pools:[{x:160,y:80,rx:150,ry:70,amt:0.22},{x:262,y:128,rx:60,ry:20,amt:0.3,col:'warm'}],
    beams:[{x0:232,y0:44,x1:248,y1:138,w0:9,w1:20,amt:1,col:'warm',motes:30},{x0:266,y0:44,x1:294,y1:138,w0:8,w1:18,amt:0.9,col:'warm',motes:24}] }; };
M.ATMO_FRAME={ inset:8, rough:9, seed:7 };
})(M);
