/* ===== 06_ui.js — Zeichnen und Eingabe: Szene, Geistersicht, Leiste, Verb-Menü, Gespräche, Notizbuch, Dokumente, Nachhall, Menü, Titel ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf, E=M.E, bayer=M.bayer;
var W=320, H=200, SH=144;
var fb=new Buf(W,H,P.k0); M.fb=fb;
var mask=new Uint8Array(W*SH);
// Geisterpixel dieses Bildes (gmask) und ihre Farbe (gcol): spätere Dunkel-Durchgänge lassen sie aus, solange nichts darübergemalt wurde
var gmask=new Uint8Array(W*SH), gcol=new Uint8Array(W*SH);
var tapMark=null, snapFx=null, noFang=false;   // Touch-Konzept T01: Tippmarke und Rahmen um das erkannte Ding
var pointer={x:-99,y:-99,down:false,touch:false,show:false}, hover=null, hoverUI=null, press=null, drag=null, reveal=null, lastTap=null;
// Touch-Layout: größere Zeilen für Antworten und Verb-Menü, sobald mit dem Finger bedient wird (UI-Konzept D9/D10)
var touchUI=false; try{ touchUI=!!(typeof matchMedia!=='undefined' && matchMedia('(pointer: coarse)').matches); }catch(e){}
M.touchUI=function(v){ if (v!==undefined) touchUI=!!v; return touchUI; };
// letzte Eingabeart (Touch-Konzept C): Finger → Aktionsleiste und Antwortliste als HTML (07_bar.js, 07_subs.js); Maus/Trackpad → Menü am Zeiger im Canvas
var lastIn=touchUI?'touch':'mouse'; M.lastTouch=function(){ return lastIn==='touch'; };
M.reduceMotion=M.reduceMotion||function(){ return false; };
E.pending=null; E.pop=null; E.invTop=0; E.menu=null; E.titleMode='main';
function GS(){ return M.GS; }
function isG(){ return M.GS.active==='mala'; }
// Farben der Leiste: Marko warm, Mala kalt
function ui(){ return isG()?{bg:P.k0,fr:P.x1,tx:P.x3,hi:P.x5,dim:P.x1,sel:P.x0}:{bg:P.k0,fr:P.y1,tx:P.y3,hi:P.y5,dim:P.y0,sel:P.w0}; }

// ---------------------------------------------------------------- Fußspuren im Schnee: Markos Abdrücke drücken den Schnee dunkel ein und verwehen in gut vierzig Sekunden (Mala hinterlässt als Geist keine)
var PRINT_MS=42000;
function printItems(view,room){ var L=E.prints, now=view.gt, keep=[], out=[];
  for (var i=0;i<L.length;i++){ var p=L[i], age=now-p.at; if (p.room!==room.id || age>PRINT_MS || age<0) continue; keep.push(p); out.push({print:p,base:p.y-0.5}); }
  if (keep.length!==L.length) E.prints=keep; return out; }
function drawPrint(p,view){ var age=view.gt-p.at, k=1-age/PRINT_MS, al=p.g?0.6*k:k, sx=p.x-view.cam, y0=p.y-1; if (sx<-5||sx>W+5) return;
  // Abdruck: 5 × 2 Pixel dunkel eingedrückt, darunter ein heller Rand aus aufgeworfenem Schnee; mit dem Alter ausgedünnt (Bayer)
  for (var dy=-1;dy<=1;dy++) for (var dx=-2;dx<=3;dx++){ var xx=sx+dx*p.dir, yy=y0+dy, rim=(dy===1), edge=(dx===-2||dx===3); if (yy<0||yy>=SH||xx<0||xx>=W) continue;
    var th=al*(rim?0.7:(edge?0.6:1.3)); if (bayer(xx,yy)>=th) continue;
    var c=fb.d[yy*W+xx], q=M.RGB[c], lum=q?(q[0]+q[1]+q[2]):0;
    if (p.g) fb.d[yy*W+xx]=rim?(lum>420?P.b4:P.b2):(edge?P.b2:P.b1);
    else fb.d[yy*W+xx]=rim?(lum>420?P.s6:M.UP[c]):(edge?(lum>420?P.m2:P.k1):(lum>420?P.m1:P.k0)); } }
// ---------------------------------------------------------------- Szene
function drawScene(){ var r=E.rebuildIfDirty(), bg=r.bg, room=E.room, S=M.RS(room.id), gs=GS(), ghostView=isG()&&!room.noGhostView;
  var ox=E.shake>0&&!M.reduceMotion()?Math.round(Math.sin(E.gt()*0.09)*2):0, cx=Math.round(E.camX), bw=bg.w;
  for (var y=0;y<SH;y++){ var row=y*W, brow=y*bw; for (var x=0;x<W;x++){ var sx=x+cx-ox; fb.d[row+x]=(sx>=0&&sx<bw)?bg.d[brow+sx]:P.k0; } }
  mask.fill(0); gmask.fill(0);
  var view={cam:cx-ox,t:E.gt()/1000,gt:E.gt(),tod:M.todOf(),ghost:ghostView};
  if (room.dynamic) room.dynamic(fb,view,S,gs);
  var list=r.layers.filter(function(l){ return !l.hidden && !(l.vis && !l.vis(S,gs)); }).slice();
  if (room.snowPrints) list=list.concat(printItems(view,room));   // Fußspuren: über den Bodenebenen, unter den Figuren
  Object.keys(E.ACT).forEach(function(k){ var a=E.ACT[k]; if (E.actorShown(a)) list.push({actor:a,base:a.y+(a.base||0)}); });
  list.sort(function(a,b){ return (a.base-b.base)||((a.actor?1:-1)-(b.actor?1:-1)); });
  var tod=view.tod;
  list.forEach(function(l){
    if (l.actor){ var a=l.actor, sx=a.x-cx+ox; if (sx<-40||sx>W+40) return; var p=E.actorPose(a), f=p.v==='S'?(a.f==='L'?'L':'R'):a.f, o={t:E.gt(),h:SH,scale:a.scale||1};
      var spirit=a.ghost, isM=a.ch==='mala', tq=E.gt(), gst=null;
      var lift=0;
      if (spirit){
        if (!ghostView && isM && gs.flags['mala.voice']){ o.lut=M.TINT.malaG.a; o.wobble=1; var ph5=tq%5200; o.alpha=(ph5<260)?0.34:((ph5<420)?0.2:0.1); o.voice=1; lift=1; }   // nur eine Stimme: noch kein Körper, bewusst nur ein Flimmern
        else { gst=ghostIdle(a,p,tq,isM,ghostView); lift=gst.lift; o.alpha=a.alpha||1; } }
      else { if (room.actorLut) o.lut=room.actorLut(a,S,gs,tod); else if (tod!=='day' && M.TINT[tod]) o.lut=M.TINT[tod].a; }
      if (a.fadeIn && E.gt()-a.fadeIn<900){ o.alpha=(o.alpha||1)*Math.min(1,(E.gt()-a.fadeIn)/900); }
      if (a.fadeOut){ var k=(E.gt()-a.fadeOut)/900; if (k>=1){ a.visible=false; a.fadeOut=0; return; } o.alpha=(o.alpha||1)*(1-k); }
      if (!a.noShadow && !spirit) shadow(sx,a.y,Math.round(7*(a.scale||1)));
      if (a.realize && spirit){ drawRealize(a,p,f,sx,a.y-lift,ghostView,o.alpha||1); return; }
      if (gst){ gst.alpha*=(o.alpha===undefined?1:o.alpha); drawGhost(a,p,f,sx,a.y-lift,gst); if (isM && !ghostView) malaMotes(sx,a.y-lift,gst.alpha); return; }
      M.drawPose(fb,sx,a.y-lift,p,f,a.ch,o); }
    else if (l.print) drawPrint(l.print,view);
    else if (l.draw) l.draw(fb,view,S,gs);
    else { fb.blit(l,l.ox-cx+ox,l.oy); clearMask(l,l.ox-cx+ox,l.oy); }
  });
  if (room.front) room.front(fb,view,S,gs);
  if (!ghostView && E.darkOn()){ var tt0=E.gt()/1000; for (var dy0=0;dy0<SH;dy0++) for (var dx0=0;dx0<W;dx0++){ var k0=dy0*W+dx0; if (gmask[k0] && fb.d[k0]===gcol[k0]) continue; var lt=E.litAt(dx0+cx-ox,dy0); if (lt>=0.98) continue; var dk=Math.round((1-lt)*6-bayer(dx0,dy0+Math.floor(tt0*2))*1.2); var c0=fb.d[k0]; for (var q0=0;q0<dk;q0++) c0=M.DN[c0]; fb.d[k0]=c0; } }
  if (ghostView){ var t=M.TINT.ghost; for (var i=0;i<W*SH;i++){ if (mask[i]) continue; var c=fb.d[i]; fb.d[i]=M.tintPx(t,c,i%W,(i/W)|0); }
    if (room.ghost) room.ghost(fb,view,S,gs);
    // Leinen: woran die Geister festgemacht sind (nur Mala sieht sie)
    Object.keys(E.ACT).forEach(function(k){ var a=E.ACT[k]; if (!a.ghost || a.id==='mala' || !E.actorShown(a)) return; var an=typeof a.anchor==='function'?a.anchor(S,gs):a.anchor; if (an) drawLeash(a.x-cx+ox,a.y-24,an[0]-cx+ox,an[1],E.gt(),false); });
    var ma=E.ACT.mala; if (ma && E.actorShown(ma) && !room.noMalaLeash){ var mx0=ma.x-cx+ox, my0=ma.y-22, lv=M.malaLeashVec?M.malaLeashVec(gs,ma,E.ACT.marko):null;
      if (lv===false){} else if (lv && lv.to) drawLeash(mx0,my0,lv.to[0]-cx+ox,lv.to[1],E.gt(),false,lv.bond); else drawLeash(mx0,my0,mx0+(lv?lv[0]:64),my0+(lv?lv[1]:-58),E.gt(),true); }
    // kalter Schimmer am Rand
    var tt=E.gt()/1000; for (var yy=0;yy<SH;yy++){ var e=Math.min(yy,SH-1-yy); if (e>5) continue; for (var xx=0;xx<W;xx++){ if (bayer(xx+Math.floor(tt*3),yy)<(6-e)/14) fb.d[yy*W+xx]=P.x0; } } }
  if (E.crossing) drawCrossing(E.crossing,cx-ox,E.gt());
  // Kopfschmerz: ein unentdeckter Geist ist nah
  var hidden=!ghostView && Object.keys(E.ACT).some(function(k){ var a=E.ACT[k]; return a.ghost && a.id!=='mala' && a.visible && !E.ghostVisible(a) && !a.noAche; });
  var ak=(hidden || (E.headache && E.gt()<E.headache))?1:0; if (!ghostView && gs.flags['mala.voice'] && gs.malaOn && gs.active==='marko') ak=Math.max(ak,0.35+Math.min(6,gs.flags['mk.ache']||0)*0.07);
  if (ak>0){ var pulse=(M.reduceMotion()?0.5:((Math.sin(E.gt()/260)+1)/2*0.5+0.25))*ak; for (var y2=0;y2<SH;y2++) for (var x2=0;x2<W;x2++){ var dx=(x2-160)/170, dy=(y2-72)/95, v=dx*dx+dy*dy; if (v>0.55 && bayer(x2,y2)<(v-0.55)*pulse*1.4){ var k2=y2*W+x2; fb.d[k2]=M.DN[M.DN[fb.d[k2]]]; } } }
  if (M.DEBUG_SPOTS){ var cx1=Math.round(E.camX); for (var wy=0;wy<SH;wy+=3) for (var wx=0;wx<W;wx+=3){ var X=wx+cx1; var mk=room.walk&&room.walk(X,wy,S,gs); var mg=room.walkG&&room.walkG(X,wy,S,gs); if (mk) fb.px(wx,wy,P.b3); else if (mg) fb.px(wx,wy,P.x5); }
    room.hotspots.forEach(function(h){ var r0=E.hsRect(h); if (!r0) return; var X0=r0[0]-cx1, c=h.gexit?P.x6:(h.exit?P.g5:(h.who==='g'?P.x4:P.y4)); fb.hl(X0,X0+r0[2]-1,r0[1],c); fb.hl(X0,X0+r0[2]-1,r0[1]+r0[3]-1,c); fb.vl(X0,r0[1],r0[1]+r0[3]-1,c); fb.vl(X0+r0[2]-1,r0[1],r0[1]+r0[3]-1,c); M.microText(fb,String(h.id).slice(0,10),X0+2,r0[1]+2,c);
      var st=typeof h.st==='function'?h.st(S,gs):h.st; if (st){ fb.rect(st[0]-cx1-1,st[1]-1,3,3,P.r4); } }); }
  if (E.switchFx && E.gt()-E.switchFx<500){ var q=(E.gt()-E.switchFx)/500; for (var j=0;j<W*SH;j++){ if (bayer(j%W,(j/W)|0)>q) fb.d[j]=isG()?M.UP[fb.d[j]]:M.DN[fb.d[j]]; } }
}
// ---------------------------------------------------------------- Geister in Markos Blick
// Lesbarkeit vor Durchsichtigkeit: der Kern der Figur ist deckend, in der Geisterfarbe der Figur (blasse Haut, gedämpfte Kleidung,
// leicht angehoben, siehe M.ghostLut in 03_cast.js). Nur der äußerste Umriss scheint halb durch. Außen liegt eine feine Lichtkontur,
// deren Helligkeit sich nach dem Grund richtet: auf dunklem Grund hell, auf hellem dunkel, damit die Gestalt sich immer abhebt.
// Ruhig: kaum merkliches Schweben, ein langsam atmender Saum, selten ein schwaches Flimmern mit einem Pixel Versatz, ab und zu ein Glanzpunkt.
var GRIM={ g:{lo:P.v1,hi:P.v4,top:P.v5,glint:P.v5}, m:{lo:P.x1,hi:P.x4,top:P.x5,glint:P.x6} };
function ghostSeed(a){ if (!a._gs){ var h=7; for (var i=0;i<a.id.length;i++) h=(h*31+a.id.charCodeAt(i))%9973; a._gs=1+h; } return a._gs; }
function ghostIdle(a,p,t,isM,gv){ var sd=ghostSeed(a), sit=!!(p&&p.sit);
  var lift=isM?1+Math.round((Math.sin(t/1150+sd)+1)*0.75):((sit||a.noFloat)?0:((Math.sin(t/1900+sd)>0.35)?1:0));
  var rimK=2+Math.round(Math.sin(t/1600+sd*0.7)+1);
  var cyc=6800+(sd%5)*700, ph=(t+sd*131)%cyc, fl=ph<150, band=fl?30+Math.floor(M.hash(Math.floor((t+sd*131)/cyc),sd)*44):-99, dir=(sd&1)?1:-1;
  var gl=((t+sd*977)%2600)<260;
  // aufgewühlt (npc.agitate): stärkerer, unruhiger Saum, kurzes Aufflackern alle 0,7 s, einzelne Zeilen verrutschen
  if (a.agit && t<a.agit){ var aph=(t+sd*53)%700, af=aph<110, ab=30+Math.floor(M.hash(Math.floor((t+sd*53)/700),sd+2)*44);
    return {t:t,gv:gv,alpha:af?0.72:1,rimK:Math.min(8,rimK+2+(af?1:0)),rows:function(j){ return (j>=ab&&j<ab+3)?((Math.floor(t/90)%2)?1:-1):0; },lift:lift,glint:((t%900)<300)?Math.floor(t/900)+sd:null}; }
  return {t:t,gv:gv,alpha:fl?0.8:1,rimK:fl?rimK+1:rimK,rows:fl?function(j){ return (j>=band&&j<band+4)?dir:0; }:null,lift:lift,glint:gl?Math.floor((t+sd*977)/2600)+sd:null}; }
// je Posenbild einmal: welche Pixel Kern (1), Umriss (2) oder Kern direkt unter dem oberen Umriss (3) sind, und wo der Saum außen liegt
function ghostPrep(s){ if (s._g) return s._g; var w=s.w, h=s.h, d=s.d, e=new Uint8Array(w*h), rim=[];
  function op(i,j){ return i>=0&&j>=0&&i<w&&j<h&&d[j*w+i]!==T; }
  for (var j=0;j<h;j++) for (var i=0;i<w;i++){ if (!op(i,j)) continue; var ed=!(op(i-1,j)&&op(i+1,j)&&op(i,j-1)&&op(i,j+1)); e[j*w+i]=ed?2:((j>0&&e[(j-1)*w+i]===2&&!op(i,j-2))?3:1); }
  for (var j2=-1;j2<=h;j2++) for (var i2=-1;i2<=w;i2++){ if (op(i2,j2)) continue; if (op(i2-1,j2)||op(i2+1,j2)||op(i2,j2-1)||op(i2,j2+1)) rim.push(i2,j2,op(i2,j2+1)?1:0); }
  return (s._g={e:e,rim:rim}); }
// o: {t, alpha 0..1 (echtes Durchscheinen über Mischfarben, kein Raster), rimK Saumstärke in Achteln, rows(j) Zeilenversatz, lut, gv (Geistersicht), sprite, noMask, glint}
function drawGhost(a,p,f,x,y,o){ var s=o.sprite||M.poseBuf(p,a.ch,o.t), G=ghostPrep(s), fl=f==='L', bx=Math.round(x)-M.SPR.OX+(fl?1:0), by=Math.round(y)-M.SPR.OY, w=s.w, h=s.h, d=s.d;
  var lut=o.lut!==undefined?o.lut:(o.gv?null:M.ghostLut(a.ch)), R=a.ch==='mala'?GRIM.m:GRIM.g, A8=Math.max(0,Math.min(8,Math.round((o.alpha===undefined?1:o.alpha)*8)));
  if (A8<=0) return; var rows=o.rows, e=G.e, gv=!!o.gv, nm=!!o.noMask, rk=Math.min(8,Math.round((o.rimK===undefined?3:o.rimK)*A8/8));
  if (rk>0){ var rim=G.rim, gi=(o.glint!==null&&o.glint!==undefined&&rim.length)?Math.floor(M.hash(o.glint,3.1)*(rim.length/3))*3:-1;
    for (var q=0;q<rim.length;q+=3){ var i=rim[q], j=rim[q+1], Y=by+j; if (Y<0||Y>=SH) continue; var X=bx+(fl?w-1-i:i)+(rows?rows(j):0); if (X<0||X>=W) continue;
      var k=Y*W+X, c=fb.d[k], rc=M.lum(c)>150?R.lo:(rim[q+2]?R.top:R.hi), kk=rk; if (q===gi){ rc=R.glint; kk=Math.min(8,rk+3); }
      var v=M.mix(c,rc,kk); fb.d[k]=v; if (!nm){ gmask[k]=1; gcol[k]=v; } if (gv) mask[k]=1; } }
  for (var j2=0;j2<h;j2++){ var Y2=by+j2; if (Y2<0||Y2>=SH) continue; var oj=rows?rows(j2):0, row=j2*w;
    for (var i2=0;i2<w;i2++){ var si=fl?w-1-i2:i2, c2=d[row+si]; if (c2===T) continue; var X2=bx+i2+oj; if (X2<0||X2>=W) continue;
      var k2=Y2*W+X2, ty=e[row+si], gc=lut?lut[c2]:c2; if (ty===3 && !gv) gc=M.UP[gc];
      var aa=(ty===2&&!gv)?Math.min(A8,5):A8, v2=aa>=8?gc:M.mix(fb.d[k2],gc,aa); fb.d[k2]=v2; if (!nm){ gmask[k2]=1; gcol[k2]=v2; } if (gv) mask[k2]=1; } } }
var STRB=null;   // ein wiederverwendeter Puffer für die gestreckte Gestalt (weniger Speicherbereinigung während des Effekts)
function stretched(s,sx,sy){ var OX=M.SPR.OX, OY=M.SPR.OY; if (!STRB||STRB.w!==s.w||STRB.h!==s.h) STRB=new Buf(s.w,s.h,T); var b=STRB; b.d.fill(T); b._g=null; for (var j=0;j<s.h;j++){ var sj=Math.round(OY+(j-OY)/sy); if (sj<0||sj>=s.h) continue;
  for (var i=0;i<s.w;i++){ var si=Math.round(OX+(i-OX)/sx); if (si<0||si>=s.w) continue; b.d[j*s.w+i]=s.d[sj*s.w+si]; } } return b; }
var IDLUT=new Uint8Array(256); for (var ii=0;ii<256;ii++) IDLUT[ii]=ii;
function dimLut(l){ if (!l._dim){ l._dim=new Uint8Array(256); for (var i=0;i<256;i++) l._dim[i]=M.DN[l[i]]; } return l._dim; }
// ---------------------------------------------------------------- Erkenntnis eines Geistes (siehe playGhostRealization in 05_engine.js), 5 Sekunden
// Kein Blitz: die sonst ruhige Gestalt flackert unregelmäßig wie ein versagendes Licht (kurze Aussetzer bis auf etwa ein Drittel, nie ganz weg),
// wabert, verzerrt sich und zeigt ein blasses, dunkleres Doppelbild. Höhepunkt 2,6 bis 3,6 s, danach fängt sie sich. Die Szene bleibt ruhig.
function realizeCurve(t){ // Stärke 0..1 über die Zeit (s)
  if (t<0.8) return 0; if (t<2.6){ var u=(t-0.8)/1.8; return 0.12+0.58*u*u; } if (t<3.6) return 0.7+0.3*Math.sin((t-2.6)/1.0*Math.PI); if (t<5.0){ var v=(t-3.6)/1.4; return 0.7*(1-v)*(1-v); } return 0; }
function drawRealize(a,p,f,x,y,gv,baseA){ var R=a.realize, gt=E.gt(), t=(gt-R.t0)/1000, k=realizeCurve(t), peak=(t>=2.6&&t<3.6)?Math.sin((t-2.6)/1.0*Math.PI):0, sd=R.seed, hz=M.hash;
  // Flackern in 45-ms-Schritten: Aussetzer werden mit der Stärke häufiger und tiefer; zwischen den Aussetzern ist die Gestalt fast ganz da
  var tick=Math.floor(gt/45), run=Math.floor(tick/2), drop=k>0 && (hz(tick,sd)<0.05+0.30*k || hz(run,sd+4)<0.02+0.15*k), deep=drop && hz(tick,sd+1)<0.25+0.35*peak;
  var A=drop?(deep?0.34:0.56):(1-0.14*k*hz(tick,sd+2));
  // Phase 1: Erstarren, ein kleiner Ruck, kurzes Zittern
  var jolt=t<0.3?Math.round(Math.sin(t/0.3*Math.PI)*1.5):0, trem=(t>0.05&&t<0.7)?((Math.floor(gt/60)%2)?1:0):0;
  // Wabern: weiche, langsame Wellen (wie Luft über heißem Stein), nur am Höhepunkt wenige kleine Versätze
  var amp=2.8*k, frq=5+4*k;
  function rows(j){ if (k<=0) return trem; var wv=Math.sin(j*0.19+t*frq)*amp+Math.sin(j*0.07-t*2.1)*amp*0.7, slip=(hz(j>>1,tick+sd)-0.5)*2*peak, blk=(peak>0.4&&hz(j>>2,run*7+sd)>0.92)?Math.round((hz(j>>2,run+3)-0.5)*5*peak):0; return Math.round(wv+slip)+blk+trem; }
  var sxs=1+0.18*peak, sys=1+0.05*peak, spr=(sxs>1.01||sys>1.01)?stretched(M.poseBuf(p,a.ch,gt),sxs,sys):null, lut=gv?IDLUT:M.ghostLut(a.ch);
  if (k>0.1){ var ex=(hz(run>>1,sd+9)>0.5?1:-1)*(1+Math.round(3*k)); drawGhost(a,p,f,x+ex,y-jolt,{t:gt,gv:gv,alpha:(0.22+0.16*k)*baseA,rimK:0,rows:rows,lut:dimLut(lut),sprite:spr,noMask:true}); }
  drawGhost(a,p,f,x,y-jolt,{t:gt,gv:gv,alpha:A*baseA,rimK:drop?1:(3+Math.round(2*k)),rows:rows,lut:lut,sprite:spr}); }
// kleine Lichtpunkte, die von Mala aufsteigen
function malaMotes(x,y,al){ var t=E.gt()/1000; for (var i=0;i<4;i++){ var ph=(t*0.32+i*0.27)%1, px=Math.round(x+Math.sin(i*2.7+t*1.3)*7), py=Math.round(y-12-ph*34); if (ph>0.85||px<0||px>=W||py<0||py>=SH) continue; if (bayer(px,py)<(1-ph)*al) fb.d[py*W+px]=P.x5; } }
// eine Leine aus Licht von (x0,y0) nach (x1,y1), leicht durchhängend; east=true: Malas eigene, die sich im Osten verliert
function drawLeash(x0,y0,x1,y1,gt,east,bond){ var dx=x1-x0, dy=y1-y0, L=Math.max(2,Math.hypot(dx,dy)), sag=Math.min(bond?7:18,L*(bond?0.07:0.16)), mx=(x0+x1)/2, my=(y0+y1)/2+sag, n=Math.ceil(L*1.3), t=gt/1000;
  for (var i=0;i<=n;i++){ var u=i/n, a=(1-u)*(1-u), b=2*(1-u)*u, c=u*u, px=Math.round(a*x0+b*mx+c*x1), py=Math.round(a*y0+b*my+c*y1+Math.sin(u*9+t*2.2)*0.6); if (px<0||px>=W||py<0||py>=SH) continue;
    var vis=east?(1-u)*(1-u)*0.8:0.9; if (bayer(px+Math.floor(t*8),py)>=vis) continue; var k=py*W+px; fb.d[k]=bond?((Math.sin(u*30-t*3)>0.2)?P.l1:P.x6):((Math.sin(u*40-t*5)>0.6)?P.x6:(east?P.x4:P.x5)); } }
// die Schwelle: ein warmes, aufrechtes Licht, das sich öffnet und wieder schließt
function drawCrossing(c,cam,gt){ var k=Math.min(1,(gt-c.at)/1200); if (c.close) k*=Math.max(0,1-(gt-c.close)/1200); if (k<=0) return; var X=c.x-cam, hw=Math.max(1,c.w/2*k), top=c.y-c.h, t=gt/1000;
  for (var y=Math.max(0,top-8);y<Math.min(SH,c.y+4);y++){ var vy=y<top?Math.max(0,1-(top-y)/8):(y>c.y-6?Math.max(0,(c.y+4-y)/10):1);
    for (var x=Math.max(0,Math.floor(X-hw-10));x<Math.min(W,Math.ceil(X+hw+10));x++){ var d=Math.abs(x-X)/hw, I=(d<1?1-d*d*0.6:Math.max(0,1-(d-1)*hw/10)*0.4)*vy*k; if (I<=0) continue; var q=I-bayer(x+Math.floor(t*6),y)*0.5;
      var kk=y*W+x, cc=fb.d[kk]; if (q>0.75) fb.d[kk]=P.l1; else if (q>0.55) fb.d[kk]=P.l0; else if (q>0.38) fb.d[kk]=P.y5; else if (q>0.2) fb.d[kk]=M.UP[M.UP[cc]]; else if (q>0.05) fb.d[kk]=M.UP[cc]; } }
  for (var i=0;i<10;i++){ var ph=(t*0.25+i*0.13)%1, px=Math.round(X+Math.sin(i*1.9+t)*hw*0.8), py=Math.round(c.y-ph*c.h*1.1); if (px>=0&&px<W&&py>=0&&py<SH&&ph<0.95) fb.d[py*W+px]=P.l1; } }
function clearMask(l,ox,oy){ for (var j=0;j<l.h;j++){ var y=oy+j; if (y<0||y>=SH) continue; for (var i=0;i<l.w;i++){ if (l.d[j*l.w+i]===T) continue; var x=ox+i; if (x<0||x>=W) continue; mask[y*W+x]=0; } } }
function shadow(x,y,w){ for (var dy=-1;dy<=1;dy++) for (var dx=-w;dx<=w;dx++){ if (Math.abs(dx)>(dy===0?w:w-2)) continue; var px=Math.round(x)+dx, py=Math.round(y)+dy; if (px<0||px>=W||py<0||py>=SH) continue; var c=fb.d[py*W+px]; fb.d[py*W+px]=M.DN[c]; } }

// ---------------------------------------------------------------- Leiste
var BTN_Y=SH+2, INV_Y=161, SLOT_W=40, SLOT_H=36, INV_X=51, INV_N=6, SW_X=2, SW_W=38;
var BTNS=[{id:'notes',t:'Notizen',x:4},{id:'map',t:'Karte',x:0,right:true},{id:'reveal',t:'Zeigen',x:0,right:true},{id:'menu',t:'Menü',x:0,right:true}];
function layoutBtns(){ BTNS[0].t=(E.nbStyle&&E.nbStyle()==='think')?'Nachdenken':'Notizen'; var x=W-4; for (var i=BTNS.length-1;i>=0;i--){ var b=BTNS[i]; b.w=M.textWidth(b.t); if (b.right){ x-=b.w; b.x=x; x-=14; } } var lx=4; BTNS.forEach(function(b){ if (!b.right){ b.x=lx; lx+=b.w+14; } }); }
layoutBtns();
function btnAt(x,y){ if (y<SH||y>=SH+15) return null; for (var i=0;i<BTNS.length;i++){ var b=BTNS[i]; if (x>=b.x-5&&x<b.x+b.w+5) return b.id; } return null; }
function drawButton(b,on){ var c=ui(), hot=hoverUI===b.id&&pointer.show, act=(b.id==='reveal'&&reveal); if (b.id==='map' && M.mapBlocked && M.mapBlocked()) on=false; var x0=b.x-4, x1=b.x+b.w+3, y0=BTN_Y, y1=BTN_Y+11;
  fb.rect(x0+1,y0+1,x1-x0-1,y1-y0-1,act?c.sel:P.k1);
  if (on){ fb.hl(x0+1,x1-1,y0,c.fr); fb.hl(x0+1,x1-1,y1,c.fr); fb.vl(x0,y0+1,y1-1,c.fr); fb.vl(x1,y0+1,y1-1,c.fr); }
  else { for (var gx=x0+1;gx<x1;gx+=2){ fb.px(gx,y0,P.s1); fb.px(gx,y1,P.s1); } for (var gy=y0+1;gy<y1;gy+=2){ fb.px(x0,gy,P.s1); fb.px(x1,gy,P.s1); } }   // gesperrt: gestrichelt, Grund beim Antippen (UI-Konzept B2-5)
  M.text(fb,b.t,b.x,BTN_Y+2,!on?P.s2:((hot||act)?c.hi:c.tx));
  if (b.id==='notes' && Object.keys(GS().noteNew).some(function(k){ return M.NOTES[k]&&M.NOTES[k].show; })){ fb.rect(x1-2,y0-1,3,3,P.r4); } }
function invList(){ return isG()?['tin']:GS().inv; }
function drawUI(){ if (BTNS.v!==M.trVer){ layoutBtns(); BTNS.v=M.trVer; }   // Knopfbreiten nach Sprache
  fb.rect(0,SH,W,H-SH,P.k0); var room=E.room, c=ui();
  if (E.dlg && E.conv) return;
  if (room && room.noVerbs){ var s0=hover?E.nameOf(hover):(room.prompt||''); M.text(fb,s0,Math.max(2,Math.floor((W-M.textWidth(s0))/2)),SH+4,c.tx); drawButton(BTNS.filter(function(b){ return b.id==='menu'; })[0],true); return; }
  var s=E.overlay?(pointer.touch?'(Tippen zum Schließen)':''):(E.pop||drag?'':sentence()); var sx1=BTNS[1].x-8, sx0=BTNS[0].x+BTNS[0].w+10; while (s.length>1 && M.textWidth(s)>sx1-sx0) s=s.slice(0,-2)+'…'; var sw=M.textWidth(s); M.text(fb,s,Math.max(sx0,Math.min(sx1-sw,Math.floor((W-sw)/2))),SH+4,c.tx);
  BTNS.forEach(function(b){ drawButton(b,true); });
  // Wechsel-Knopf
  drawSwitch();
  // Inventar
  var inv=invList(), pages=Math.max(1,Math.ceil(inv.length/INV_N)); if (E.invTop>=pages) E.invTop=pages-1;
  arrowH(INV_X-8,INV_Y+SLOT_H/2|0,true,E.invTop>0,hoverUI==='up'); arrowH(INV_X+INV_N*SLOT_W+6,INV_Y+SLOT_H/2|0,false,E.invTop<pages-1,hoverUI==='dn');
  for (var i=0;i<INV_N;i++){ var x=INV_X+i*SLOT_W, y=INV_Y, idx=E.invTop*INV_N+i;
    fb.rect(x,y,SLOT_W-2,SLOT_H,P.k0); fb.hl(x,x+SLOT_W-3,y,c.dim); fb.vl(x,y,y+SLOT_H-1,c.dim); fb.hl(x,x+SLOT_W-3,y+SLOT_H-1,P.k2); fb.vl(x+SLOT_W-3,y,y+SLOT_H-1,P.k2);
    var id=inv[idx]; if (!id) continue; var it=M.ITEMS[id]; var ic=iconOf(id);
    var sel=E.pending===id||(E.pop&&E.pop.item===id)||(drag&&drag.id===id), hot=hoverUI==='i:'+idx&&pointer.show;
    if (sel||hot) fb.rect(x+1,y+1,SLOT_W-4,SLOT_H-2,sel?c.sel:P.k2);
    if (E.invNew===id && (M.reduceMotion()||E.gt()%600<300)) fb.rect(x+1,y+1,SLOT_W-4,2,c.hi);
    if (ic && !(drag&&drag.on&&drag.id===id)) fb.blit(ic,x+Math.floor((SLOT_W-2-ic.w)/2),y+Math.floor((SLOT_H-ic.h)/2)); }
  if (pages>1) for (var d=0;d<pages;d++) fb.rect(INV_X+INV_N*SLOT_W/2-pages*3+d*6|0,H-2,4,1,d===E.invTop?c.tx:c.dim); }
var ICON_CACHE={};
function iconOf(id){ if (ICON_CACHE[id]) return ICON_CACHE[id]; var it=M.ITEMS[id], b=new Buf(32,24,T); if (it.icon) it.icon(M.lw(Object.assign(b,{ox:0,oy:0}))); M.outline(b,P.k1); var tb=trim(b); ICON_CACHE[id]=tb; return tb; }
M.iconOf=iconOf;
function trim(b){ var x0=b.w,y0=b.h,x1=-1,y1=-1; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++) if (b.d[y*b.w+x]!==T){ if (x<x0)x0=x; if (y<y0)y0=y; if (x>x1)x1=x; if (y>y1)y1=y; } if (x1<0) return b; var o=new Buf(x1-x0+1,y1-y0+1,T); for (y=y0;y<=y1;y++) for (x=x0;x<=x1;x++) o.d[(y-y0)*o.w+(x-x0)]=b.d[y*b.w+x]; return o; }
// Der Knopf zeigt das Ziel des Wechsels mit Pfeil („↔ Mala“); ohne Mala zeigt er Marko selbst, ohne Pfeil – man sieht immer, wen man spielt (UI-Konzept D9)
function switchShown(g){ return !(!g.malaOn || g.flags['mala.unknown'] || g.flags['mala.noSwitch'] || g.flags['split.afterIvka.away']); }
function drawSwitch(){ var g=GS(), c=ui(), x=SW_X, y=INV_Y-1, w=SW_W, h=SLOT_H+2, shown=switchShown(g), avail=shown && g.malaOn && !(E.room&&(E.room.noMala||E.room.noSwitch));
  fb.rect(x,y,w,h,P.k1); fb.hl(x,x+w-1,y,avail?c.fr:P.k2); fb.hl(x,x+w-1,y+h-1,avail?c.fr:P.k2); fb.vl(x,y,y+h-1,avail?c.fr:P.k2); fb.vl(x+w-1,y,y+h-1,avail?c.fr:P.k2);
  var other=shown?(g.active==='marko'?'mala':'marko'):g.active, hot=shown&&hoverUI==='sw'&&pointer.show, dim=function(c0){ return !shown?M.DN[c0]:(!avail?M.DN[M.DN[c0]]:c0); };
  if (M.hasPortrait && M.hasPortrait(other)){ var pp=M.portrait(other,((E.gt()+900)%4300)<120?'b':'n'), cx1=Math.max(0,Math.floor((pp.w-(w-4))/2)), ch1=h-12;
    for (var j2=0;j2<ch1;j2++) for (var i2=0;i2<w-4;i2++){ var sx2=cx1+i2, sy2=2+j2; if (sx2>=pp.w||sy2>=pp.h) continue; var c2=pp.d[sy2*pp.w+sx2]; if (c2===T) continue; fb.px(x+2+i2,y+1+j2,dim(c2)); } }
  else { var pb=portraitBuf(other,'n'), cw=14, chh=14, cx0=Math.floor((pb.w-cw)/2), ox=x+Math.floor((w-cw*2)/2), oy=y+1;
    for (var j=0;j<chh*2;j++) for (var i=0;i<cw*2;i++){ var sx=cx0+(i>>1), sy=(j>>1); if (sx<0||sx>=pb.w||sy>=pb.h) continue; var col=pb.d[sy*pb.w+sx]; if (col===T) continue; if (other==='mala') col=M.ghostLut('mala')[col]; fb.px(ox+i,oy+j,dim(col)); } }
  var lab=other==='mala'?'Mala':'Marko', lab2=shown?'↔ '+lab:lab; if (M.textWidth(lab2)>w-2) lab2=shown?'↔'+lab:lab;
  M.text(fb,lab2,x+Math.floor((w-M.textWidth(lab2))/2),y+h-10,!shown?P.s3:(!avail?P.k2:(hot?c.hi:(other==='mala'?P.x4:P.y3)))); }
function arrowH(x,y,left,on,hot){ var c=ui(), col=on?(hot?c.hi:c.tx):c.dim; for (var i=0;i<6;i++){ var xx=left?x+i:x-i; fb.vl(xx,y-i,y+i,col); } }
// Satzzeile: mit dem Finger steht der Name nur, solange er liegt; nie „Benutze X mit X“
function sentence(){ var v=E.pending?'Benutze':'', h=hover; if (h && ((pointer.touch&&!pointer.down) || (h.item&&h.item===E.pending))) h=null; var hn=h?E.nameOf(h):''; if (E.pending){ var pn=M.ITEMS[E.pending].name; return 'Benutze '+pn+' mit '+(hn||'…'); } return hn; }

// ---------------------------------------------------------------- Verb-Menü (nur Verben, die etwas bewirken)
var POP_RH=13;
// Ausgang für die gerade gespielte Figur: dieselbe Regel wie die Engine (doVerb0), mit M.malaFree (Kapitel 4: Mala darf allein durch Türen)
// Blindtest K4: Tippen, Menü und „Zeigen“ kannten M.malaFree nicht, Mala kam nachts nicht ins Schlafzimmer
function uiExit(hs){ var g=isG(), ex=g?(hs.gexit||(hs.exit&&(hs.exit.gok||(M.malaFree&&M.malaFree(GS(),hs)))?hs.exit:null)):hs.exit; if (typeof ex==='function') ex=ex(M.RS(E.room.id),GS()); return ex||null; }
E.uiExit=uiExit;
function hsOpts(hs){ var room=E.room; if (room.noVerbs) return null; var o=[], g=isG();
  var ex=uiExit(hs);
  if (hs===E.MALA_HS){ return [{t:'Rede mit',v:'talk'},{t:'Schau an',v:'look'}]; }
  if (hs===E.MARKO_HS){ return [{t:'Sprich mit',v:'talk'},{t:'Schau an',v:'look'}]; }
  if (ex) o.push({t:g&&hs.gexit?'Hindurchgehen':'Hingehen',v:g&&hs.gexit?'pass':'walk'});
  if (g){ var gv=hs.g||{}, ns=M.senseNeutral&&M.senseNeutral(hs,room.id); if (gv.cross!==undefined && (!gv.crossIf || gv.crossIf(M.RS(room.id),GS()))) o.push({t:E.VLABEL.cross,v:'cross'}); ['talk','sense','listen','draw'].forEach(function(v){ if ((gv[v]!==undefined || (v==='sense'&&ns)) && (v!=='draw' || !gv.drawIf || gv.drawIf(M.RS(room.id),GS()))) o.push({t:E.VLABEL[v==='talk'?'gtalk':v],v:v}); });   // Analyse P21: „Spüren“ auch an alltäglichen Dingen (08_sense.js)
    if (hs.npc && !gv.talk && E.ACT[hs.npc] && E.ACT[hs.npc].ghost) o.push({t:'Sprich mit',v:'talk'}); }
  else { ['talk','take','open','use','push','read'].forEach(function(v){ if (hs[v]!==undefined) o.push({t:E.VLABEL[v],v:v}); }); if (hs.npc && hs.talk===undefined) o.unshift({t:'Rede mit',v:'talk'}); }
  if (!ex && o.length===0) return null;
  if (ex && o.length===1) return null;   // reiner Ausgang: der erste Klick geht los, ein zweiter schneller Klick überspringt den Weg
  o.push({t:'Schau an',v:'look'}); return o; }
E.hsOpts=hsOpts;   // für Tests: was das Menü an einem Hotspot anbietet
function itemOpts(id){ if (isG()) return [{t:'Schau an',v:'look'}]; var it=M.ITEMS[id], o=[{t:'Benutze',pend:true}]; ['read','open','use2'].forEach(function(v){ if (it[v]!==undefined) o.push({t:v==='read'?'Lies':(v==='open'?'Öffne':it.use2Label||'Benutze'),v:v}); }); o.push({t:'Schau an',v:'look'}); return o; }
function openPop(p){ p.room=E.room; p.rh=touchUI?15:POP_RH; p.html=!!(pointer.touch && M.barOn && M.barOn());   // Finger: Aktionsleiste (07_bar.js) statt Menü am Finger (T06)
  var w=M.textWidth(p.title); p.opts.forEach(function(o){ w=Math.max(w,M.textWidth(o.t)); }); w=Math.max(66,w+14);
  var h=(p.opts.length+1)*p.rh+4, x0, y0; if (p.item){ x0=p.x-(w>>1); y0=(WIDE?SH:INV_Y)-h-3; } else { x0=p.x+14; if (x0+w>W-2) x0=p.x-14-w; y0=p.y-(h>>1); }   // ≥ 12 Spielpixel Abstand: das Ziel bleibt sichtbar (UI-Konzept D9)
  p.bx=Math.max(2,Math.min(W-2-w,x0)); p.by=Math.max(2,Math.min(H-2-h,y0)); p.bw=w; p.bh=h; E.pop=p; }
// Rahmen um das erkannte Ding (nur bei Touch): solange der Finger liegt, solange Verb-Menü oder Aktionsleiste offen sind, kurz nach einem Fangradius-Treffer.
// Er zeigt nur, was berührt wurde – keine Reihenfolge, keine „passenden“ Ziele (Bedienhilfe, keine Lösungshilfe).
function hsFrame(h,col){ var r=E.hsRect(h); if (!r) return; var cam=Math.round(E.camX), x0=Math.max(0,r[0]-cam-1), y0=Math.max(0,r[1]-1), x1=Math.min(W-1,r[0]-cam+r[2]), y1=Math.min(SH-1,r[1]+r[3]);
  if (x1<=x0||y1<=y0) return; fb.hl(x0-1,x1+1,y0-1,P.k0); fb.hl(x0-1,x1+1,y1+1,P.k0); fb.vl(x0-1,y0-1,y1+1,P.k0); fb.vl(x1+1,y0-1,y1+1,P.k0);
  fb.hl(x0,x1,y0,col); fb.hl(x0,x1,y1,col); fb.vl(x0,y0,y1,col); fb.vl(x1,y0,y1,col); }
function drawFocus(){ if (!touchUI||E.overlay||E.menu||E.dlg||E.screen!=='game'||!E.room) return; var col=isG()?P.x6:P.l1;
  if (E.pop&&E.pop.pickFrom){ E.pop.opts.forEach(function(o){ hsFrame(o.pick,col); }); return; }
  if (E.pop&&E.pop.hs){ hsFrame(E.pop.hs,col); return; }
  if (pointer.down&&pointer.touch&&hover&&!hover.item&&pointer.y<SH){ hsFrame(hover,col); return; }
  if (snapFx){ if (E.gt()-snapFx.at>450) snapFx=null; else hsFrame(snapFx.hs,col); } }
// Tippmarke: wo der Finger erkannt wurde (300 ms, ein sich weitender Ring)
function drawTapMark(){ if (!tapMark) return; var t=E.gt()-tapMark.at; if (t>300||E.overlay||E.menu||E.screen!=='game'){ tapMark=null; return; } if (tapMark.y>=SH) return;
  var r=3+Math.round(t/75), cx=Math.round(tapMark.x), cy=Math.round(tapMark.y), col=isG()?P.x5:P.l1;
  for (var a=0;a<24;a++){ var px=cx+Math.round(Math.cos(a/24*Math.PI*2)*r), py=cy+Math.round(Math.sin(a/24*Math.PI*2)*r); if (px>=0&&px<W&&py>=0&&py<SH) fb.px(px,py,col); } }
function popAt(x,y){ var p=E.pop; if (!p||p.html||x<p.bx||x>=p.bx+p.bw||y<p.by||y>=p.by+p.bh) return null; var r=Math.floor((y-p.by-2)/(p.rh||POP_RH))-1; return (r>=0&&r<p.opts.length)?r:-1; }
function popPick(po,opt){ if (opt.pick){ E.pop=null; E.pending=null; pickHs(opt.pick,po); return; } E.pop=null; E.pending=null; if (po.hs){ E.actionTok(); E.doVerb(opt.v,po.hs); return; } if (opt.pend){ E.pending=po.item; return; } E.doItem(opt.v==='use2'?'use2':opt.v,po.item); }
function drawPop(){ var p=E.pop; if (!p) return; if (p.room!==E.room||E.busy||E.speech||E.dlg||E.overlay||E.menu||E.screen!=='game'){ E.pop=null; return; } if (p.html) return; var c=ui();
  var rh=p.rh||POP_RH, tp=(rh-9)>>1;
  fb.rect(p.bx,p.by,p.bw,p.bh,P.k1); fb.rect(p.bx+1,p.by+1,p.bw-2,rh,P.k2); fb.hl(p.bx,p.bx+p.bw-1,p.by,c.fr); fb.hl(p.bx,p.bx+p.bw-1,p.by+p.bh-1,c.fr); fb.vl(p.bx,p.by,p.by+p.bh-1,c.fr); fb.vl(p.bx+p.bw-1,p.by,p.by+p.bh-1,c.fr);
  M.text(fb,p.title,p.bx+7,p.by+2+tp,c.hi);
  p.opts.forEach(function(o,i){ var ry=p.by+2+(i+1)*rh, hot=hoverUI==='p:'+i; if (hot) fb.rect(p.bx+2,ry,p.bw-4,rh-1,c.sel); fb.hl(p.bx+4,p.bx+p.bw-5,ry-1,P.k2); M.text(fb,o.t,p.bx+7,ry+tp,hot?c.hi:c.tx); }); }

// ---------------------------------------------------------------- Gespräche: Porträts links/rechts, Auswahl in der Mitte
var PCACHE={};
function portraitBuf(chId,hd){ var key=chId+':'+hd; if (PCACHE[key]) return PCACHE[key];
  var s=M.poseBuf(M.poseF({hd:hd}),chId), top=s.h, x, y; for (y=0;y<s.h&&top===s.h;y++) for (x=0;x<s.w;x++) if (s.d[y*s.w+x]!==T){ top=y; break; }
  var cw=21, ch=22, cx0=M.SPR.OX-10, b=new Buf(cw,ch,T); for (y=0;y<ch;y++) for (x=0;x<cw;x++){ var sy=top-1+y, sx=cx0+x; if (sy>=0&&sy<s.h&&sx>=0&&sx<s.w) b.d[y*cw+x]=s.d[sy*s.w+sx]; }
  return (PCACHE[key]=b); }
M.portraitBuf=portraitBuf;
// ---------------------------------------------------------------- Porträts und Gespräche (wie in den Blackwell-Spielen: Brustbild oben, Satz im Kasten daneben)
var PW=56, PH=64, NB_LH=10;
function convOn(){ return !!(E.screen==='game' && E.room && !E.overlay && !E.menu && (E.dlg || (E.conv && E.conv.room===E.room))); }
function convPartner(){ if (!E.conv||!E.conv.npc) return null; var a=E.ACT[E.conv.npc]; return (a && M.CHARS[a.ch] && a.id!==GS().active && E.actorShown(a))?a:null; }
// gemaltes Porträt (portraits/<id>.js) oder ersatzweise der vergrößerte Kopf-Stempel der Spielfigur
var FALLBACK={};
function portraitFor(ch,variant){ if (M.hasPortrait && M.hasPortrait(ch)) return M.portrait(ch,variant); var key=ch+':'+variant; if (FALLBACK[key]) return FALLBACK[key]; if (!M.CHARS[ch]) return null;
  var hb=portraitBuf(ch,variant), b=new Buf(PW,PH,T), sc=PW/hb.w;
  for (var y=0;y<PH;y++) for (var x=0;x<PW;x++){ var sx=Math.floor(x/sc), sy=Math.floor(y/sc); if (sy<hb.h&&sx<hb.w){ var c=hb.d[sy*hb.w+sx]; if (c!==T) b.d[y*PW+x]=c; } }
  M.outline(b,P.k1); var gt=M.PORTRAIT_GHOSTS&&M.PORTRAIT_GHOSTS[ch]; if (gt && M.ghostLut){ var lut=M.ghostLut(ch); for (var i=0;i<b.d.length;i++) if (b.d[i]!==T) b.d[i]=lut[b.d[i]]; } return (FALLBACK[key]=b); }
function drawBust(ch,x0,y0,variant,mirror){ var pb=portraitFor(ch,variant); if (!pb) return false; var gh=M.PORTRAIT_GHOSTS&&M.PORTRAIT_GHOSTS[ch];
  if (gh){ var cx=x0+(PW>>1), cy=y0+26, aur=ch==='mala'?[P.x1,P.x2]:[P.v1,P.v2], t=Math.floor(E.gt()/150); // kalter Schein hinter Geistern
    for (var y=Math.max(0,y0-4);y<y0+PH;y++) for (var x=Math.max(0,x0-6);x<Math.min(W,x0+PW+6);x++){ var d=Math.hypot((x-cx)/34,(y-cy)/31); if (d>1) continue; if (bayer(x+t,y)<(1-d)*0.5) fb.px(x,y,d<0.55?aur[1]:aur[0]); } }
  for (var yy=0;yy<pb.h;yy++){ var Y=y0+yy; if (Y<0||Y>=H) continue; for (var xx=0;xx<pb.w;xx++){ var c=pb.d[yy*pb.w+(mirror?pb.w-1-xx:xx)]; if (c!==T) fb.px(x0+xx,Y,c); } }
  return true; }
function idleVariant(seed){ return ((E.gt()+seed)%4300)<120?'b':'n'; }
function dlgBye(){ if (!E.dlg) return -1; for (var i=E.dlg.opts.length-1;i>=0;i--) if (E.dlg.opts[i].bye) return i; return -1; }
// während der Auswahl: oben das Gegenüber, unten die Liste der Sätze
function drawConv(){ if (!convOn()) return; if (!E.dlg) return; var pa=convPartner();
  if (pa && !E.speech){ var right=true, me=E.ACT[GS().active]; if (me) right=pa.x>=me.x; drawBust(pa.ch,right?W-4-PW:4,4,idleVariant(1700),right); }
  if (LISTH){ SUBW.dlg=E.dlg; E.dlg.lay=null; if (!WIDE) fb.rect(0,SH,W,H-SH,P.k0); return; }   // Liste als HTML (07_subs.js): Untertitelschicht oder Fingereingabe (T05); Leiste darunter dunkel
  drawChoices(); }
// Untertitelschicht (UI-Konzept B3-2, 07_subs.js): Mit „Schrift: Lesbar“ oder „Textgröße: groß“ zeichnet der Canvas Sätze und Antwortlisten
// nicht selbst. Er merkt sich nur, was in diesem Bild zu sehen wäre (SUBW); die HTML-Schicht zeigt genau das. Brustbilder bleiben im Canvas.
var SUBS=false, LISTH=false, SUBW={sp:null,dlg:null};
M.subsFrame=function(){ return SUBW; };
// dieselben Antworttexte und Zustände wie in drawChoices (Übersetzung mit Sprecher und Gegenüber, schon gefragte Zeilen)
M.dlgView=function(){ var d=E.dlg; if (!d) return null; var me=GS().active, pa0=convPartner(), to0=(d.to!==undefined&&d.to!==null)?d.to:(pa0?pa0.id:(E.trLast||null));
  return {title:(d.title&&!pa0&&!E.speech)?M.trUI(d.title):'', opts:d.opts.map(function(o){ var t=M.lang==='de'?o.t:M.tr(o.t,{who:me,to:me==='marko'?to0:null,cat:'option',log:true});
    return {t:M.trUI(t), asked:!!(pa0&&!o.bye&&!o.noGray&&GS().seen['ask:'+o.t]), ask:!!o.ask, bye:!!o.bye}; })}; };
function drawChoices(){ var d=E.dlg, o=d.opts, g=isG(), WD=!!WIDE, x0=2, w=W-4, y0=WD?SH-47:SH+1, y1=WD?SH-2:H-1, tx=x0+12, tw=w-34, i;   // Breitbild: Kasten über dem unteren Szenendrittel (UI-Konzept D17)
  if (d.top>=o.length) d.top=Math.max(0,o.length-1);
  if (WD) fb.rect(x0,y0,w,y1-y0+1,P.k0); else fb.rect(0,SH,W,H-SH,P.k0); var fr=g?P.x2:P.s4;
  if (d.title && !convPartner() && !E.speech){ var tw2=M.textWidth(d.title); fb.rect(x0,y0-13,tw2+12,12,P.k0); fb.hl(x0,x0+tw2+11,y0-13,fr); fb.vl(x0,y0-13,y0-1,fr); fb.vl(x0+tw2+11,y0-13,y0-1,fr); M.text(fb,d.title,x0+6,y0-10,g?P.x5:P.y4); }
  fb.hl(x0,x0+w-1,y0,fr); fb.hl(x0,x0+w-1,y1,fr); fb.vl(x0,y0,y1,fr); fb.vl(x0+w-1,y0,y1,fr);
  var rows=[], yy=y0+(WD?3:4), more=false, minH=WD?13:(touchUI?15:0), maxRows=WD?3:(touchUI?3:99);
  var me=GS().active, pa0=convPartner(), to0=(E.dlg&&E.dlg.to!==undefined&&E.dlg.to!==null)?E.dlg.to:(pa0?pa0.id:(E.trLast||null));   // gleich wie die gesprochene Antwort
  for (var k=d.top;k<o.length;k++){ if (o[k].lang!==M.lang){ o[k].lang=M.lang; o[k].lines=null; }
    var ls=o[k].lines||(o[k].lines=M.wrap(M.lang==='de'?o[k].t:M.tr(o[k].t,{who:me,to:me==='marko'?to0:null,cat:'option',log:true}),tw)), h=Math.max(minH,ls.length*NB_LH+1); if (yy+h>y1-2||rows.length>=maxRows){ more=true; break; } rows.push({k:k,y:yy,h:h,ls:ls}); yy+=h; }
  if (!rows.length && d.top<o.length){ var l1=o[d.top].lines; rows.push({k:d.top,y:yy,h:Math.max(minH,l1.length*NB_LH+1),ls:l1}); more=d.top<o.length-1; }
  d.vis=rows.map(function(r){ return r.k; }); d.visTop=d.top;   // sichtbare Zeilen: Ziffern 1–9 und Pfeiltasten (UI-Konzept D10)
  var kbOn=d.kf!==undefined&&d.kf!==null&&!(pointer.show&&!pointer.touch&&hoverUI&&hoverUI[0]==='c');
  var bye=dlgBye(), lay={rows:[],close:null,up:null,dn:null}, talk=!!convPartner(), fresh=d.atR!==undefined && nowR()-d.atR<150 && !(M.reduceMotion&&M.reduceMotion());   // Liste blendet kurz auf: sie ist bereit, sobald sie hell ist
  rows.forEach(function(r){ var hot=(pointer.show&&hoverUI==='c:'+r.k)||(kbOn&&d.kf===r.k), asked=talk&&!o[r.k].bye&&!o[r.k].noGray&&GS().seen['ask:'+o[r.k].t];
    var col=g?(hot?P.x6:(asked?P.x3:P.x4)):(hot?P.l1:(asked?P.s3:P.s5)), my=r.y+((r.h-(r.ls.length*NB_LH+1))>>1); if (fresh) col=M.DN[col];   // gewählte Zeilen ≥ 4,5:1 (s3 7,0:1, x3 5,5:1)
    if (hot) fb.rect(x0+3,r.y-1,w-24,r.h,g?P.x0:P.k2);
    if (o[r.k].ask){ fb.px(tx-6,my+2,col); fb.px(tx-5,my+3,col); fb.px(tx-6,my+4,col); } else { fb.px(tx-6,my+3,g?P.x1:P.s1); fb.px(tx-5,my+3,g?P.x1:P.s1); }
    r.ls.forEach(function(l,j){ M.text(fb,l,tx,my+j*NB_LH,col); }); lay.rows.push({k:r.k,r:[x0+3,r.y-1,w-24,r.h]}); });
  // rechts: Schließen und Blättern
  var ax=x0+w-11, upOn=d.top>0, dnOn=more, rest=(more&&rows.length)?o.length-1-rows[rows.length-1].k:0;
  var ch=WD?14:16;
  if (bye>=0){ var cyy=y0+(WD?4:6), hot2=hoverUI==='cx', cc2=hot2?P.r4:(g?P.x3:P.s3); for (i=0;i<5;i++){ fb.px(ax-2+i,cyy+i,cc2); fb.px(ax+2-i,cyy+i,cc2); } lay.close=[ax-8,y0+1,18,ch]; }
  if (upOn||dnOn){ var tri=function(cy,up,on,hot){ var c=on?(hot?(g?P.x6:P.l1):(g?P.x4:P.s5)):(g?P.x1:P.s1); for (var t=0;t<4;t++){ var ty=up?cy+t:cy+3-t; fb.hl(ax-t,ax+t,ty,c); } };
    tri(y0+(WD?18:22),true,upOn,hoverUI==='cu'); tri(y1-9,false,dnOn,hoverUI==='cd'); lay.up=upOn?[ax-8,y0+(WD?15:17),18,ch]:null; lay.dn=dnOn?[ax-8,y1-ch,18,ch]:null;
    if (rest>0){ var rt='+'+rest; M.text(fb,rt,ax-(M.textWidth(rt)>>1)+1,WD?y0+28:y1-19,g?P.x4:P.s4); } }   // so viele Antworten folgen noch
  d.lay=lay; }
// Sprechtext: Figuren mit Porträt sprechen oben im Kasten neben ihrem Brustbild, alles andere wie gehabt
function speechPortrait(sp){ var o=sp.opt||{}; if (!sp.who||sp.who==='#'||o.x!==undefined||o.y!==undefined||o.noPortrait) return null;   // auch am Telefon: die Person am anderen Ende mit Brustbild
  var id=sp.who[0]==='@'?sp.who.slice(1):sp.who; if (!id) return null; var a=E.ACT[id], ch=a?a.ch:id; if (!(M.hasPortrait&&M.hasPortrait(ch)) && !M.CHARS[ch]) return null; return {ch:ch,a:a}; }
// kleine Note für gesungene Zeilen: k 0 Achtel, 1 zwei Achtel mit Balken
var SONG_NOTE=[['..##.','..#.#','..#..','###..','###..'],['.####','.#..#','.#..#','##.##','##.##']];
function songNote(x,y,col,k){ SONG_NOTE[k].forEach(function(r,j){ for (var i=0;i<r.length;i++) if (r[i]==='#') fb.px(x+i,y+j,col); }); }
function drawSpeechBust(sp,pr,noText){ var o=sp.opt||{}, a=pr.a, col=o.color!==undefined?o.color:(a&&a.color!==undefined?a.color:(M.CAST_COLORS[pr.ch]!==undefined?M.CAST_COLORS[pr.ch]:P.s6));
  var right=false, me=E.ACT[GS().active], pa=convPartner();
  if (a && E.actorShown(a)){ var other=(a===me)?(pa||null):me;
    if (!other || other===a){ other=null; var best=1e9, pick=function(npcOnly){ Object.keys(E.ACT).forEach(function(k){ var b=E.ACT[k]; if (b===a||!E.actorShown(b)) return; if (npcOnly && (b.id==='marko'||b.id==='mala')) return; var dd=Math.abs(b.x-a.x); if (dd<best){ best=dd; other=b; } }); };
      pick(a.id==='marko'||a.id==='mala'); if (!other) pick(false); }
    right=other?(a.x>other.x):((a.x-E.camX)>W/2); }
  else if (o.phone){ var mk=E.ACT.marko; right=!(mk && E.actorShown(mk) && (mk.x-E.camX)>W/2); }   // am Telefon: gegenüber von Marko
  var px=right?W-4-PW:4, lh=10, song=!!o.song, tw=W-PW-30-(song?12:0), lines=M.wrap(sp.text,tw), gls=(song&&o.gloss)?M.wrap(o.gloss,tw):[], bx0=right?4:PW+10, bx1=right?W-PW-10:W-4, by0=6, by1=by0+(lines.length+gls.length)*lh+9;
  var bw=0; lines.concat(gls).forEach(function(l){ bw=Math.max(bw,M.textWidth(l)); }); var boxW=Math.min(bx1-bx0,bw+14+(song?12:0)); if (right) bx1=bx0+boxW; else bx1=bx0+boxW;
  var talking=E.gt()-sp.at<Math.min(4500,sp.text.length*55+250), variant=talking?((Math.floor(E.gt()/140)%2)?'o':'n'):idleVariant(0);
  drawBust(pr.ch,px,4,variant,right); if (noText) return;
  var gh=M.PORTRAIT_GHOSTS&&M.PORTRAIT_GHOSTS[pr.ch], frame=pr.ch==='mala'?P.x4:(gh?P.v4:P.s6);
  fb.rect(bx0,by0,bx1-bx0,by1-by0,P.k0); fb.hl(bx0,bx1-1,by0,frame); fb.hl(bx0,bx1-1,by1-1,frame); fb.vl(bx0,by0,by1-1,frame); fb.vl(bx1-1,by0,by1-1,frame);
  // gesungene Zeile (97_k3_auftritt.js): zwei kleine Noten wippen am Rand, darunter gedämpft die Übersetzung
  var tx0=bx0+7+(song?6:0); lines.forEach(function(l,i){ M.text(fb,l,tx0,by0+5+i*lh,col); });
  if (song){ var nb=Math.floor(E.gt()/375)%2; songNote(bx0+3,by0+5+nb,col,0); songNote(bx1-9,by0+6-nb,col,1); gls.forEach(function(l,i){ M.text(fb,l,tx0,by0+5+(lines.length+i)*lh,P.s3); }); }
  if (o.phone) M.text(fb,'☎',right?bx0+2:bx1-10,by1-1,frame);   // Hörer-Zeichen an der Unterkante: die Stimme kommt aus dem Telefon
  if (E.tapText() && E.busy && E.gt()>=sp.until && (Math.floor(E.gt()/400)%2)){ var ix=bx1-6, iy=by1-6; for (var t=0;t<3;t++) fb.hl(ix-2+t,ix+2-t,iy+t,frame); } }

// ---------------------------------------------------------------- Sprechtext
function speakerPos(who){ var a=E.ACT[who]; if (a && E.actorShown(a) && E.room){ return [Math.round(a.x)-Math.round(E.camX), Math.round(a.y)-(a.speechY||(a.idle&&/sit|mend|cards|guitar/.test(a.idle)?40:54))]; } return null; }
function drawSpeech(){ var sp=E.speech; if (!sp) return;
  if (SUBS && !E.overlay){ SUBW.sp=sp; var pr0=(sp.opt&&sp.opt.voice)?null:speechPortrait(sp); if (pr0) drawSpeechBust(sp,pr0,true); return; }   // Satz in der Untertitelschicht
  if (sp.opt&&sp.opt.voice) return drawSpeechVoice(sp); var pr=speechPortrait(sp); if (pr) return drawSpeechBust(sp,pr); return drawSpeechPlain(sp); }
function drawSpeechVoice(sp){ var lines=M.wrap(sp.text,230), lh=10, top=12, t=E.gt(), bw=0; lines.forEach(function(l){ bw=Math.max(bw,M.textWidth(l)); });
  var x0=160-(bw>>1)-8, x1=160+(bw>>1)+8, y0=top-5, y1=top+lines.length*lh+3;
  for (var y=Math.max(0,y0);y<=Math.min(SH-1,y1);y++) for (var x=Math.max(0,x0);x<=Math.min(W-1,x1);x++){ var e=Math.min(x-x0,x1-x,y-y0,y1-y); if (e<0) continue; if (bayer(x,y)<Math.min(1,e/5)*0.85){ var k=y*W+x; fb.d[k]=M.DN[M.DN[M.DN[fb.d[k]]]]; } }
  var k2=Math.min(1,(t-sp.at)/500);
  lines.forEach(function(l,i){ var w=M.textWidth(l), jx=Math.round(Math.sin(t/110+i*1.7)*0.7), x=160-(w>>1)+jx, y=top+i*lh;
    M.text(fb,l,x+1,y+1,P.x0); if (k2>0.5||(Math.floor(t/60)%2)) M.text(fb,l,x,y,(Math.floor(t/1700+i)%5===0)?P.x3:P.x4); });
  if (E.tapText() && E.busy && E.gt()>=sp.until && (Math.floor(E.gt()/400)%2)){ var ix=160+(bw>>1)+4, iy=top+lines.length*lh-5; for (var q=0;q<3;q++) fb.hl(ix-2+q,ix+2-q,iy+q,P.x4); } }
function drawSpeechPlain(sp){ var o=sp.opt||{}, lh=10, cx=160, top=14, col=o.color!==undefined?o.color:P.l0, a=E.ACT[sp.who], M2=8;
  var lines=M.wrap(sp.text,200), pos=speakerPos(sp.who);
  if (a) col=o.color!==undefined?o.color:a.color;
  if (sp.who&&sp.who[0]==='@'){ var nm=sp.who.slice(1); if (M.CAST_COLORS[nm]!==undefined && o.color===undefined) col=M.CAST_COLORS[nm]; }
  if (pos){ cx=pos[0]; top=pos[1]-lines.length*lh-2; }
  if (o.x!==undefined) cx=o.x; if (o.y!==undefined) top=o.y;
  if (sp.who==='#'){ lines=M.wrap(sp.text,240); cx=160; top=Math.max(8,60-lines.length*lh/2); }
  if (o.phone){ lines=M.wrap(sp.text,220); cx=160; top=18; }
  if (top<4) top=4; if (top+lines.length*lh>SH-4 && o.y===undefined) top=Math.max(4,SH-4-lines.length*lh);
  var bw=0; lines.forEach(function(l){ bw=Math.max(bw,M.textWidth(l)); }); var bx=Math.max(M2,Math.min(W-M2-bw,cx-(bw>>1)));
  var x0=bx-5, x1=bx+bw+5, y0=top-3, y1=top+lines.length*lh+1;
  // Lesbarkeit (Autor, 9.11.2026): Der Erzähler hat keinen Kasten. Liegt hinter dem Text eine helle Szene (Fassaden, Schnee), steht er dunkel mit
  // hellem Rand, sonst hell mit dunklem Rand. Gemessen wird die mittlere Helligkeit unter dem Block, einmal je Satz (während einer Blende jedes Bild).
  var dark=false; if (sp.who==='#'){ if (sp.narDark===undefined || E.fade){ var sum=0, n=0, RGB=M.RGB; for (var yy=Math.max(0,y0);yy<=Math.min(SH-1,y1);yy+=2) for (var xx=Math.max(0,x0);xx<=Math.min(W-1,x1);xx+=2){ var q=RGB[fb.d[yy*W+xx]]; if (!q) continue; sum+=0.2126*q[0]+0.7152*q[1]+0.0722*q[2]; n++; }
      var d=n?(sum/n)>138:false; if (!E.fade) sp.narDark=d; dark=d; } else dark=sp.narDark; }
  if (sp.who!=='#'){ for (var y=Math.max(0,y0);y<=Math.min(H-1,y1);y++) for (var x=Math.max(0,x0);x<=Math.min(W-1,x1);x++){ var edge=Math.min(x-x0,x1-x,y-y0,y1-y); if (edge<0) continue; if (edge===0&&((x+y)&1)) continue; if ((x===x0||x===x1)&&(y===y0||y===y1)) continue; var k=y*W+x, c=fb.d[k]; c=M.DN[M.DN[M.DN[c]]]; if (edge>1) c=((x+y)&1)?P.k0:M.DN[c]; fb.d[k]=c; } }
  if (o.phone){ M.text(fb,'☎',x0-1,y0,col); }
  lines.forEach(function(l,i){ var w=M.textWidth(l), x=Math.max(M2,Math.min(W-M2-w,cx-Math.floor(w/2))); if (bw>w&&pos===null) x=bx+((bw-w)>>1);
    if (dark){ M.text(fb,l,x+1,top+i*lh+1,P.l1); M.text(fb,l,x,top+i*lh,P.k1,P.l1); } else { M.text(fb,l,x+1,top+i*lh+1,P.k0); M.text(fb,l,x,top+i*lh,col,P.k0); } });
  if (E.tapText() && E.busy && E.gt()>=sp.until && (Math.floor(E.gt()/400)%2)){ var tx=Math.min(W-6,bx+bw+3), ty=top+lines.length*lh-5; for (var t=0;t<3;t++) fb.hl(tx-2+t,tx+2-t,ty+t,dark?P.k1:P.l0); } }

// ---------------------------------------------------------------- Overlays
function dimAll(n){ for (var i=0;i<W*H;i++){ var c=fb.d[i]; for (var k=0;k<(n||2);k++) c=M.DN[c]; fb.d[i]=c; } }
function paper(x,y,w,h,opt){ opt=opt||{}; var base=opt.col||P.s5; fb.rect(x+2,y+2,w,h,P.k0); fb.rect(x,y,w,h,base); for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ if (M.hash(xx,yy)<0.035) fb.px(xx,yy,M.DN[base]); }
  fb.hl(x,x+w-1,y,M.UP[base]); fb.vl(x+w-1,y,y+h-1,M.DN[base]); fb.hl(x,x+w-1,y+h-1,M.DN[base]); if (opt.lines){ for (var ly=y+opt.lines[0];ly<y+h-4;ly+=opt.lines[1]) fb.hl(x+3,x+w-4,ly,P.b4); } if (opt.margin) fb.vl(x+opt.margin,y+1,y+h-2,P.r4); }
M.paper=paper; M.dimAll=dimAll;
function drawOverlay(){ var ov=E.overlay; if (!ov) return; dimAll(2); var fn=M.OVERLAYS[ov.kind]; if (fn) fn(fb,ov,E.gt()); }
// Dokument (Brief, Postkarte, Buch, Register, Ticket, Zeitung)
// Briefe als Fließtext ohne Waisen (UI-Konzept B2-2): bricht eine Zeile um und bleibt ein kurzer Rest mitten im Satz, rückt er an den Anfang der nächsten Zeile.
// Listen, Register, Fahrscheine und Dokumente mit verblassten Zeilen bleiben Zeile für Zeile; ein Satzende beendet den Fluss immer.
function docFlow(d,tw,st){ var src=d.lines||[], out=[], prose=!d.faded&&!d.keepLines&&(st==='letter'||st==='news'||st==='faded'||st==='postcard'||st==='ghost'), carry='';
  for (var i=0;i<src.length;i++){ var l=src[i]; if (l===''){ if (carry){ M.wrap(carry,tw).forEach(function(q){ out.push(q); }); carry=''; } out.push(''); continue; }
    var q=M.wrap(carry?carry+' '+l:l,tw), nx=src[i+1]; carry='';
    if (prose && q.length>1 && nx && nx!=='' && !/^[–\-•\d]/.test(nx) && M.textWidth(q[q.length-1])<tw*0.5 && !/[.!?:…»«“”"]$/.test(q[q.length-1])) carry=q.pop();
    q.forEach(function(z){ out.push(z); }); }
  if (carry) M.wrap(carry,tw).forEach(function(q){ out.push(q); }); return out; }
M.docFlow=docFlow;
M.defineOverlay('doc',function(fb,ov){ var d=ov.data, st=d.style||'letter', w=d.w||220, lines=docFlow(d,w-28,st), col=P.s5, ink=P.k1, x, y;
  var h=Math.min(176,(d.title?18:10)+lines.length*9+14); x=(W-w)>>1; y=Math.max(4,(H-h)>>1)-4;
  if (st==='postcard'){ col=P.s4; } else if (st==='ticket'){ col=P.b4; } else if (st==='log'||st==='register'){ col=P.e4; } else if (st==='news'){ col=P.s5; ink=P.k2; } else if (st==='faded'){ col=P.s4; ink=P.s1; } else if (st==='ghost'){ col=P.x1; ink=P.x5; }
  paper(x,y,w,h,{col:col,lines:st==='letter'?[d.title?20:12,9]:null,margin:st==='log'||st==='register'?10:null});
  if (st==='postcard'){ fb.vl(x+Math.floor(w*0.62),y+8,y+h-8,P.s2); fb.rect(x+w-24,y+5,16,19,P.r3); fb.rect(x+w-22,y+7,12,15,P.s5); fb.ellipse(x+w-34,y+14,8,8,function(px,py){ var dd=Math.hypot(px-(x+w-34),py-(y+14)); return dd>6.5?P.s2:fb.get(px,py); }); }
  if (st==='ticket'){ for (var tx=x+4;tx<x+w-4;tx+=4) fb.px(tx,y+h-12,P.b1); }
  if (d.title) M.text(fb,d.title,x+12,y+6,st==='ghost'?P.x4:P.r2);
  var ty=y+(d.title?19:10); lines.forEach(function(l,i){ var c=ink; if (d.faded && d.faded.indexOf(i)>=0) c=M.UP[M.UP[col]]; M.text(fb,l,x+14,ty+i*9,c); });
  if (d.stamp){ var sw=M.textWidth(d.stamp)+8; fb.rect(x+w-sw-10,y+h-20,sw,12,P.r3); fb.rect(x+w-sw-9,y+h-19,sw-2,10,col); M.text(fb,d.stamp,x+w-sw-6,y+h-17,P.r3); } });
// Nachhall: Erinnerungsbild + Zeilen nacheinander
M.defineOverlay('memory',function(fb,ov,gt){ var d=ov.data, x0=44, y0=8, w=232, h=104; ov.step=ov.step||0;
  if (!ov.pic){ var b=new Buf(w,h,P.k0); try{ if (d.draw) d.draw(b,0); }catch(e){ console.error(e); } M.tintApply(b,d.tint==='ghost'?M.TINT.ghost:M.TINT.memory); ov.pic=b; }
  var k=Math.min(1,(gt-ov.at)/600);
  for (var y=0;y<h;y++) for (var x=0;x<w;x++){ var c=ov.pic.d[y*w+x]; var e=Math.min(x,w-1-x,y,h-1-y); if (e<10 && bayer(x,y)>e/10) c=P.k0; if (bayer(x,y)>k) c=P.k0; fb.px(x0+x,y0+y,c); }
  if (d.anim) d.anim(fb,x0,y0,w,h,(gt-ov.at)/1000);
  // dunkler Grund unter dem Text (deckt die Leiste ab), weiche Kanten
  for (var yy=y0+h+1;yy<H;yy++) for (var xx=x0-10;xx<x0+w+10;xx++){ var ed=Math.min(xx-(x0-10),(x0+w+9)-xx); if (ed<8 && bayer(xx,yy)>ed/8) continue; fb.px(xx,yy,P.k0); }
  if (d.blank) M.big(fb,d.title||'',x0+(w>>1),y0+h+4,P.x5,2,P.k0);   // Kapitelanfang: Titel in der Schriftstaffel der Kapitelkarte (UI-Konzept D3)
  else M.text(fb,d.title||'Nachhall',x0,y0+h+4,P.x4);
  var lines=d.lines||[], rows=[], ty=y0+h+(d.blank?24:15), maxRows=Math.floor((H-ty-1)/9);
  lines.slice(0,ov.step+1).forEach(function(l,i){ M.wrap(l,w-8).forEach(function(q){ rows.push([q,i===ov.step]); }); });
  rows.slice(-maxRows).forEach(function(r){ M.text(fb,r[0],x0,ty,r[1]?P.x5:P.x3); ty+=9; });
  if (Math.floor(gt/500)%2) M.text(fb,ov.step<lines.length-1?'▸':'✓',x0+w-6,H-10,P.x4); });
// Satzbau-Rätsel (Übersetzung)
// Felder mit -1 sind noch leer (d.empty: alle leer); „Vorlesen“ prüft erst, wenn jedes Feld belegt ist
// Prüfbericht K3: Knopf und Rückmeldung bleiben immer im Blatt. Die Rückmeldung steht an fester Stelle oben (statt des Hinweises),
// die Zeilenhöhe richtet sich nach der Anzahl der Zeilen, der Knopf liegt höchstens bei y=168.
var OV_BTN_MAX=168;
function ovInfo(fb,ov,text,col,maxL){ maxL=maxL||2; var m=!!ov.msg, ls=M.wrap(m?ov.msg:(text||''),250).slice(0,maxL);
  ls.forEach(function(l,i){ M.text(fb,l,36,22+i*9,m?P.r2:(col||P.s1)); }); ov.msgRect=[34,20,252,maxL*9+2]; return ls.length; }
M.defineOverlay('puzzle',function(fb,ov){ var d=ov.data; ov.sel=ov.sel||(d.init?d.init.slice():d.slots.map(function(){ return d.empty?-1:0; })); paper(20,8,280,178,{lines:[30,22],margin:12});
  M.text(fb,d.title||'Übersetzung',36,12,P.r2); ovInfo(fb,ov,d.hint||'Tippe auf eine Zeile, um eine andere Fassung zu wählen.',P.s1,3);
  var n=d.slots.length, y0=53, step=Math.max(16,Math.min(22,Math.floor((OV_BTN_MAX-2-y0)/n))), bh=step-4, ty=(bh-7)>>1, my=bh>>1;
  var lay=[]; d.slots.forEach(function(sl,i){ var y=y0+i*step, hot=hoverUI==='z:'+i, bad=ov.bad===i; fb.rect(32,y,256,bh,hot?P.s6:(bad?P.r4:P.s4)); M.text(fb,(i+1)+'.',36,y+ty,P.r2); if (ov.sel[i]<0) M.text(fb,'…',48,y+ty,P.s1); else M.text(fb,sl[ov.sel[i]],48,y+ty,P.n0); fb.px(280,y+my-1,P.n2); fb.px(281,y+my,P.n2); fb.px(280,y+my+1,P.n2); lay.push([32,y,256,bh]); });
  var by=Math.min(y0+n*step+2,OV_BTN_MAX), hot2=hoverUI==='zgo'; fb.rect(110,by,100,16,hot2?P.n2:P.n1); M.text(fb,d.button||'Vorlesen',160-(M.textWidth(d.button||'Vorlesen')>>1),by+4,P.s6); ov.lay={rows:lay,go:[110,by,100,16],close:[258,8,42,16],msg:ov.msg?ov.msgRect:null};
  M.text(fb,'Zurück',262,12,hoverUI==='zx'?P.r3:P.k1); });
// ---------------------------------------------------------------- weitere Rätselformen (Prüfbericht: nicht alles als Auswahlzeilen)
// Jede legt ov.lay.hits an ({id, r}); Antippen geht an OVTAP[kind](ov, id). Gemeinsam: Knopf unten Mitte (id 'go'), „Zurück“ oben rechts (id 'x').
var OVTAP={}; M.OVTAP=OVTAP;
function ovFrame(fb,ov,d,def){ paper(20,8,280,178,{lines:[30,22],margin:12}); M.text(fb,d.title||def,36,12,P.r2); M.text(fb,'Zurück',262,12,hoverUI==='o:x'?P.r3:P.k1); return [{id:'x',r:[258,8,42,16]}]; }
// Knopf unten Mitte, nie tiefer als OV_BTN_MAX (die Rückmeldung zeigt ovInfo oben im Blatt)
function ovGo(fb,ov,d,hits,by){ by=Math.min(by,OV_BTN_MAX); var t=d.button||'Vorlesen', w=Math.max(100,M.textWidth(t)+16), x=160-(w>>1); fb.rect(x,by,w,16,hoverUI==='o:go'?P.n2:P.n1); M.text(fb,t,160-(M.textWidth(t)>>1),by+4,P.s6); hits.push({id:'go',r:[x,by,w,16]}); return by; }
// 1) Ordnen: antippen, dann ein zweites antippen = die beiden tauschen. Ist etwas gewählt, steht oben, was darin steht (Markos Übersetzung).
//    Die Kartenhöhe richtet sich nach der Anzahl (bis acht Karten passen mit Knopf ins Blatt).
M.defineOverlay('arrange',function(fb,ov){ var d=ov.data, hits=ovFrame(fb,ov,d,'Ordnen'); if (!ov.ord) ov.ord=d.start.slice();
  var pk=(ov.pick!==undefined&&ov.pick!==null)?d.items[ov.ord[ov.pick]]:null; ovInfo(fb,ov,pk?(pk.gloss||''):(d.hint||''),pk?P.n1:P.s1);
  var n=ov.ord.length, y0=42, rh=Math.max(13,Math.min(20,Math.floor((OV_BTN_MAX-2-y0)/n))), bh=rh-3, ty=(bh-7)>>1;
  ov.ord.forEach(function(k,i){ var it=d.items[k], y=y0+i*rh, hot=hoverUI==='o:r'+i, sel=ov.pick===i, bad=ov.bad===i;
    fb.rect(32,y,256,bh,sel?P.y4:(hot?P.s6:(bad?P.r4:P.s4))); M.text(fb,(i+1)+'.',36,y+ty,P.r2); M.text(fb,it.t,48,y+ty,P.n0); hits.push({id:'r'+i,r:[32,y,256,bh]}); });
  ovGo(fb,ov,d,hits,y0+n*rh+2); ov.lay={hits:hits,msg:ov.msg?ov.msgRect:null}; });
OVTAP.arrange=function(ov,id){ var d=ov.data; if (id==='x'){ E.closeOverlay(null); return; }
  if (id==='go'){ var ids=ov.ord.map(function(k){ return d.items[k].id; }), res=d.check?d.check(ids):{ok:true}; if (res&&res.ok){ E.closeOverlay(ids); } else { ov.bad=res?res.bad:-1; ov.msg=res&&res.msg; ov.pick=null; M.sfx('nope'); } return; }
  if (!id||id[0]!=='r') return; var i=+id.slice(1); ov.bad=-1; ov.msg=null;
  if (ov.pick===undefined||ov.pick===null){ ov.pick=i; M.sfx('click'); return; } if (ov.pick===i){ ov.pick=null; return; }
  var t=ov.ord[i]; ov.ord[i]=ov.ord[ov.pick]; ov.ord[ov.pick]=t; ov.pick=null; M.sfx('page'); };
// 2) Zwei Hälften: eine Hälfte antippen dreht sie um 180°, „Tauschen“ legt sie um. Die Rissränder zeigen, was zusammengehört.
//    d.make() liefert {a:{w,h,c:Uint8Array,m:Uint8Array}, b:{…}, off:Versatz der zweiten Hälfte im ganzen Bild}; richtig: a links, b rechts, beide aufrecht.
M.defineOverlay('halves',function(fb,ov,gt){ var d=ov.data, hits=ovFrame(fb,ov,d,'Zusammenlegen');
  if (ov.joined && gt-ov.joinAt>900 && !ov.closing){ ov.closing=true; Promise.resolve().then(function(){ if (E.overlay===ov) E.closeOverlay(true); }); } if (!ov.pc) ov.pc=d.make(); if (!ov.st) ov.st=JSON.parse(JSON.stringify(d.start));
  ovInfo(fb,ov,d.hint);
  var pc=ov.pc, gap=ov.joined?0:6, x0=160-((pc.off+pc.b.w+gap)>>1), y0=48, slots=[x0, x0+pc.off+gap];
  [ov.st.left,ov.st.right].forEach(function(k,si){ var p=pc[k], rot=ov.st.rot[k], ox=slots[si];
    for (var y=0;y<p.h;y++) for (var x=0;x<p.w;x++){ var sx=rot?p.w-1-x:x, sy=rot?p.h-1-y:y, q=sy*p.w+sx; if (!p.m[q]) continue; fb.px(ox+x,y0+y,p.c[q]); }
    if (hoverUI==='o:p'+si && !ov.joined){ fb.hl(ox,ox+p.w-1,y0+p.h+2,P.r3); }
    hits.push({id:'p'+si,r:[ox,y0,p.w,p.h]}); });
  var by=Math.min(y0+Math.max(pc.a.h,pc.b.h)+8,OV_BTN_MAX), sw=M.textWidth('Tauschen')+16; fb.rect(36,by,sw,16,hoverUI==='o:sw'?P.s6:P.s3); M.text(fb,'Tauschen',44,by+4,P.n0); hits.push({id:'sw',r:[36,by,sw,16]});
  ovGo(fb,ov,d,hits,by); ov.lay={hits:hits,msg:ov.msg?ov.msgRect:null}; });
OVTAP.halves=function(ov,id){ var d=ov.data, st=ov.st; if (ov.joined) return; if (id==='x'){ E.closeOverlay(null); return; } ov.msg=null;
  if (id==='sw'){ var t=st.left; st.left=st.right; st.right=t; M.sfx('paper'); return; }
  if (id==='p0'||id==='p1'){ var k=id==='p0'?st.left:st.right; st.rot[k]=st.rot[k]?0:180; M.sfx('page'); return; }
  if (id==='go'){ if (st.left!=='a'||st.right!=='b'){ ov.msg=d.msgSide; M.sfx('nope'); return; } if (st.rot.a||st.rot.b){ ov.msg=d.msgRot; M.sfx('nope'); return; }
    ov.joined=true; ov.joinAt=E.gt(); M.sfx('shimmer'); } };
// 3) Schriftvergleich: oben die gefundene Schrifttafel, darunter die Wörter. Ein unsicheres Zeichen antippen wechselt seine Lesart.
//    Zellen: {c:'G'} fest, oder {k:'u', o:['n','u','e'], ok:'u'} ein Kurrent-Zeichen mit Lesarten.
function kurrentGlyph(fb,k,x,y,c){ var L=function(a,b,e,f){ fb.line(x+a,y+b,x+e,y+f,c); };
  if (k==='e'){ L(0,9,1,5); L(1,5,2,9); L(2,9,3,5); L(3,5,4,9); }   // klein, eng
  else if (k==='n'||k==='u'){ L(0,9,1,4); L(1,4,3,9); L(3,9,4,4); L(4,4,6,9); if (k==='u'){ L(1,1,2,2); L(2,2,4,2); L(4,2,5,1); } }
  else if (k==='s'||k==='f'){ L(2,0,4,0); L(2,0,1,3); L(1,3,1,12); L(1,12,0,13); if (k==='f') L(0,5,3,5); }
  else if (k==='r'){ L(0,9,1,5); L(1,5,2,7); L(2,7,4,5); } }
M.defineOverlay('glyphs',function(fb,ov){ var d=ov.data, hits=ovFrame(fb,ov,d,'Schrift lesen'); if (!ov.rd) ov.rd=d.words.map(function(w){ return w.map(function(){ return -1; }); });
  ovInfo(fb,ov,d.hint);
  // die Tafel: Zeichen und darunter der Buchstabe
  var tx=40, ty=42; fb.rect(32,ty-4,256,30,P.s4); M.text(fb,d.tableTitle||'Tafel',36,ty-2,P.r2); tx=110;
  d.table.forEach(function(t,i){ var x=tx+i*28; kurrentGlyph(fb,t.k,x,ty-2,P.k1); M.text(fb,t.lat,x,ty+13,P.n1); });
  var y=ty+34;
  d.words.forEach(function(w,wi){ var x=48; M.text(fb,(wi+1)+'.',36,y+4,P.r2);
    w.forEach(function(cell,ci){ if (cell.c){ M.text(fb,cell.c,x,y+4,P.n0); x+=M.textWidth(cell.c)+1; return; }
      var hot=hoverUI==='o:g'+wi+'_'+ci, bad=ov.bad===wi, r=ov.rd[wi][ci]; fb.rect(x-1,y-3,9,26,hot?P.s6:(bad?P.r4:P.s4)); kurrentGlyph(fb,cell.k,x,y-1,P.k1); M.text(fb,r<0?'?':cell.o[r],x+1,y+14,r<0?P.s1:P.g1); hits.push({id:'g'+wi+'_'+ci,r:[x-1,y-3,9,26]}); x+=10; });
    y+=30; });
  ovGo(fb,ov,d,hits,y); ov.lay={hits:hits,msg:ov.msg?ov.msgRect:null}; });
OVTAP.glyphs=function(ov,id){ var d=ov.data; if (id==='x'){ E.closeOverlay(null); return; }
  if (id==='go'){ for (var wi=0;wi<d.words.length;wi++) if (ov.rd[wi].some(function(v,ci){ return v<0 && !d.words[wi][ci].c; })){ ov.bad=wi; ov.msg='Da fehlt noch etwas.'; M.sfx('nope'); return; }
    var res=d.check?d.check(ov.rd):{ok:true}; if (res&&res.ok){ E.closeOverlay(ov.rd); } else { ov.bad=res?res.bad:-1; ov.msg=res&&res.msg; M.sfx('nope'); } return; }
  if (!id||id[0]!=='g') return; var p=id.slice(1).split('_'), w=+p[0], c=+p[1], cell=d.words[w][c]; ov.rd[w][c]=(ov.rd[w][c]+1)%cell.o.length; ov.bad=-1; ov.msg=null; M.sfx('page'); };

// ---------------------------------------------------------------- Notizbuch: zwei Arten, im Menü umschaltbar
// „Liste“ (wie in Blackwell): eine Seite, große Schrift, nur offene Hinweise, zwei antippen = verbinden.
// „Nachdenken“: kein eigener Bildschirm; Marko denkt in der gewohnten Auswahlliste nach, zwei Gedanken = verbinden.
// Analyse P22/P23 (Kann-Liste): Die Liste hat bis zu drei Seiten. „Offen“ ordnet die Notizen nach Frage oder Person;
// „Erledigt“ und „Gehört“ sind nur zum Lesen. „Gehört“ sammelt, was das Spiel sich im Hintergrund merkt (vor allem Gesagtes
// in Kapitel 1 und 2, Analyse K1-B07). Im Gespräch kann man auch auf diesen Seiten nachfragen, damit keine Antwort tot bleibt (P24).
var NB={sel:null,page:0,msg:null,tab:'open'};
var NB_PER=5, NB_RH=20, NB_Y0=26, NB_HH=10, NB_RH2=16;   // Zeilen 26–126 (gruppiert: Zeilen 16 und Überschriften 10 hoch), Blättern 125–138, Beschreibung und „Danach fragen“ 142–186
var nbStyle='list'; try{ nbStyle=localStorage.getItem('mala.nbstyle')||'list'; }catch(e){}
E.nbStyle=function(){ return nbStyle; };
E.setNbStyle=function(v){ nbStyle=v; try{ localStorage.setItem('mala.nbstyle',v); }catch(e){} layoutBtns(); };
layoutBtns();
function nbTargets(){ var t={}; Object.keys(M.DEDUCE).forEach(function(k){ var d=M.DEDUCE[k]; if (d&&d.to) t[d.to]=1; }); return t; }
function doneOwn(n,g){ if (n.doneIf && n.doneIf(g)) return true; if (n.doneBy) for (var i=0;i<n.doneBy.length;i++) if (g.notes.indexOf(n.doneBy[i])>=0) return true; return false; }
// Analyse P22 (Muster 6): Quellen eines Schlusses sind erledigt, wenn der Spieler keinen ihrer Schlüsse gezogen hat und jeder davon
// schon erledigt wäre, weil sein Inhalt auf anderem Weg bekannt wurde (z. B. l3_notbridge + k3_c_bridge → l3_uncounted).
// Hat er einen Schluss gezogen, entscheiden die eigenen Regeln der Quelle (sie wird im Gespräch vielleicht noch gebraucht: s1_twosevens bei Tomaž).
// Nur Quellen aus derselben Frage wie der Schluss: Was aus einer anderen Gruppe kommt, trägt mehr (k3_c_bridge ist auch Malas Fahrer).
var NB_SRC=null;
function srcIndex(){ if (NB_SRC) return NB_SRC; NB_SRC={}; Object.keys(M.DEDUCE).forEach(function(k){ var d=M.DEDUCE[k]; if (!d||typeof d==='function'||!d.to) return; k.split('+').forEach(function(id){ (NB_SRC[id]=NB_SRC[id]||[]).push(d.to); }); }); return NB_SRC; }
function spent(id,g){ var ts=srcIndex()[id], n=M.NOTES[id]; if (!ts||!n) return false; for (var i=0;i<ts.length;i++){ var t=M.NOTES[ts[i]]; if (!t || t.g!==n.g || g.notes.indexOf(ts[i])>=0 || !doneOwn(t,g)) return false; } return true; }
function noteDone(n,g,id){ return doneOwn(n,g) || (!!id && spent(id,g)); }
E.noteDone=function(id,g){ var n=M.NOTES[id]; return !!n && noteDone(n,g||GS(),id); };
// zu welchem Kapitel eine Notiz gehört (über die Fälle der Abschnitte); Malas Notizen aus Split gelten in Kapitel 1 und 2
var NB_CH=null;
function caseChapter(c){ if (!NB_CH){ NB_CH={}; Object.keys(M.PHASES).forEach(function(p){ var ph=M.PHASES[p], ch=ph.chapter||1; if (ph.case) NB_CH[ph.case]=ch; (ph.cases||[]).forEach(function(x){ NB_CH[x]=ch; }); }); } return NB_CH[c]||0; }
function inChapter(n,g){ var ch=M.chapterOf?M.chapterOf(g):1; return n.c==='mala'?ch<=2:caseChapter(n.c)===ch; }
// offene Hinweise des Falls (beim Fragen auch Malas), Schlüsse und Neues zuerst, im Gespräch zuerst die zum Gegenüber
function nbOpen(ask,also){ var g=GS(), ph=M.PHASES[g.phase]||{}, cs=ph.case, ded=nbTargets(), out=[], who=ask&&E.conv&&E.conv.npc&&E.ACT[E.conv.npc]?E.ACT[E.conv.npc].ch:null;
  var cl=ph.cases, old=function(n){ return !!(cs && n.c && n.c!=='mala' && (cl?cl.indexOf(n.c)<0:n.c!==cs)); };
  var hid=function(id){ return !!(ask && g.active!=='mala' && M.k4NoteHidden && M.k4NoteHidden(id,g)); };   // Kapitel 4: was Mala für sich behält, kennt Marko im Gespräch nicht
  g.notes.forEach(function(id){ var n=M.NOTES[id]; if (!n || hid(id)) return; if (ask && also && also.indexOf(id)>=0){ out.push(id); return; } if (!n.show || noteDone(n,g,id)) return; if (n.c==='mala'){ if (!ask) return; } else if (old(n) && !ask) return; out.push(id); });
  out.sort(function(a,b){ var A=M.NOTES[a], B=M.NOTES[b], sa=(who&&A.p==='p:'+who?0:2)+(ded[a]?0:1)+(old(A)?4:0), sb=(who&&B.p==='p:'+who?0:2)+(ded[b]?0:1)+(old(B)?4:0); return (sa-sb)||(g.notes.indexOf(b)-g.notes.indexOf(a)); });
  if (ask && M.chapterOf && M.chapterOf(g)===4){ var va=also?out.filter(function(id){ return also.indexOf(id)>=0; }):[], rest=out.filter(function(id){ return va.indexOf(id)<0 && !old(M.NOTES[id]); }), cap=also?Math.max(4,va.length):8;
    out=va.concat(rest).slice(0,cap); out.sort(function(a,b){ return g.notes.indexOf(b)-g.notes.indexOf(a); }); }   // gültige Antworten nicht immer oben: die Reihenfolge verrät nichts
  return out; }
E.nbOpen=nbOpen;
// die zwei Seiten zum Lesen: „Erledigt“ (erledigt, beim Blättern auch aus früheren Abschnitten) und „Gehört“ (nie im Notizbuch gezeigt), neueste zuerst
function nbRest(ask,also){ var g=GS(), ph=M.PHASES[g.phase]||{}, cs=ph.case, cl=ph.cases, open=nbOpen(ask,also), done=[], heard=[];
  var old=function(n){ return !!(cs && n.c && n.c!=='mala' && (cl?cl.indexOf(n.c)<0:n.c!==cs)); };
  var hid=function(id){ return !!(ask && g.active!=='mala' && M.k4NoteHidden && M.k4NoteHidden(id,g)); };
  var capped=ask && M.chapterOf && M.chapterOf(g)===4;   // Kapitel 4 kürzt die offene Liste im Gespräch bewusst; was dort fehlt, kommt nicht über die anderen Seiten zurück
  g.notes.forEach(function(id){ var n=M.NOTES[id]; if (!n || hid(id) || open.indexOf(id)>=0 || !inChapter(n,g)) return;
    if (!n.show){ heard.push(id); return; } var dn=noteDone(n,g,id); if (dn || (!ask && old(n))){ if (!capped || dn) done.push(id); } });
  var newest=function(a,b){ return g.notes.indexOf(b)-g.notes.indexOf(a); }; done.sort(newest); heard.sort(newest);
  return {open:open,done:done,heard:heard}; }
E.nbLists=nbRest;
E.nbAll=function(ask,also){ var L=nbRest(ask,also); return L.open.concat(L.done,L.heard); };
var NB_TABS=[['open','Offen'],['done','Erledigt'],['heard','Gehört']];
function nbTabs(L){ return NB_TABS.filter(function(t){ return t[0]==='open' || L[t[0]].length; }); }
// Gruppen nach Frage oder Person (Feld g der Notiz); die Reihenfolge der Gruppen folgt der ersten Notiz jeder Gruppe in der Liste
function nbGroups(list){ var out=[], at={}; list.forEach(function(id){ var k=M.NOTES[id].g||''; if (at[k]===undefined){ at[k]=out.length; out.push({k:k,ids:[]}); } out[at[k]].ids.push(id); }); return out; }
// Seiten aus Zeilen und Gruppenüberschriften; beginnt eine Seite mitten in einer Gruppe, steht die Überschrift noch einmal oben
function nbPages(list,grouped,rh){ var pages=[], cur=[], h=0, budget=NB_PER*NB_RH; rh=rh||NB_RH;
  if (!grouped){ for (var i=0;i<list.length;i+=NB_PER) pages.push(list.slice(i,i+NB_PER).map(function(id){ return {id:id}; })); return pages.length?pages:[[]]; }
  nbGroups(list).forEach(function(gr){ gr.ids.forEach(function(id,j){ var head=(j===0||!cur.length)&&gr.k, need=rh+(head?NB_HH:0);
      if (h+need>budget && cur.length){ pages.push(cur); cur=[]; h=0; head=!!gr.k; need=rh+(head?NB_HH:0); }
      if (head){ cur.push({head:gr.k}); h+=NB_HH; } cur.push({id:id}); h+=rh; }); });
  if (cur.length) pages.push(cur); return pages.length?pages:[[]]; }
function notesOf(){ return nbOpen(false); }
E.openNotes=function(){ if (M.onOpenNotes && M.onOpenNotes()) return Promise.resolve();   // ein Raum darf vorher etwas sagen (Morgen nach Ivka)
  if (nbStyle==='think') return M.thinkAbout(); NB.sel=null; NB.page=0; NB.msg=null; NB.tab='open'; return E.showOverlay('notebook',{mode:'browse'}); };
function nbButton(x,y,w,t,hot,h){ h=h||13; fb.rect(x,y,w,h,hot?P.s6:P.s4); var c=hot?P.r3:P.n1; fb.hl(x,x+w-1,y,c); fb.hl(x,x+w-1,y+h-1,c); fb.vl(x,y,y+h-1,c); fb.vl(x+w-1,y,y+h-1,c); M.text(fb,t,x+((w-M.textWidth(t))>>1),y+((h-7)>>1),hot?P.r2:P.n1); return [x,y,w,h]; }
// Variante 1: die Liste
M.defineOverlay('notebook',function(fb,ov,gt){ var d=ov.data, ask=d.mode==='ask', g=GS(), ph0=M.PHASES[g.phase]||{}, ded=nbTargets(), i;
  if (!ov.init){ ov.init=1; NB.page=0; NB.sel=null; NB.msg=null; NB.tab='open'; }
  paper(30,4,260,188,{lines:[NB_Y0-4,NB_RH],margin:16}); var lay={rows:[],close:null,prev:null,next:null,btn:null,tabs:[]};
  var L=nbRest(ask,d.also), tabs=nbTabs(L); if (!tabs.some(function(t){ return t[0]===NB.tab; })){ NB.tab='open'; NB.page=0; NB.sel=null; }
  var cl=ask?'Zurück':'X', cw=M.textWidth(cl); lay.close=[282-cw-11,3,cw+16,16]; M.text(fb,cl,282-cw-3,10,hoverUI==='nx'?P.r3:P.s1);
  if (tabs.length<2){ M.text(fb,ask?(d.title||'Wonach fragen?'):'Notizbuch',52,10,P.r2); if (!ask && ph0.short) M.text(fb,ph0.short,52+M.textWidth('Notizbuch')+10,10,P.s1); }
  else { var tx=50; tabs.forEach(function(t){ var on=NB.tab===t[0], hot=hoverUI==='t:'+t[0], w=M.textWidth(t[1]);
      if (on){ fb.rect(tx-3,5,w+6,14,P.y4); } M.text(fb,t[1],tx,10,on?P.r2:(hot?P.r3:P.s1)); if (on) fb.hl(tx-1,tx+w,18,P.r3);
      lay.tabs.push({k:t[0],r:[tx-5,2,w+10,19]}); tx+=w+14; });
    if (!ask && ph0.short && tx+M.textWidth(ph0.short)<lay.close[0]-2) M.text(fb,ph0.short,tx+2,10,P.s1); }
  var tab=NB.tab, list=L[tab], grouped=!(ask&&tab==='open'), rh=grouped?NB_RH2:NB_RH, ty=grouped?5:7, pg=nbPages(list,grouped,rh), pages=pg.length; if (NB.page>=pages) NB.page=pages-1;
  if (!list.length) M.text(fb,'Noch nichts, was zusammengehören könnte.',54,NB_Y0+6,P.s1);
  var y=NB_Y0; pg[NB.page].forEach(function(r){
    if (r.head!==undefined){ var hl=M.trUI?M.trUI(r.head):r.head; M.text(fb,hl,52,y+2,P.s1); fb.hl(52+M.textWidth(hl)+4,280,y+5,P.s3); y+=NB_HH; return; }
    var id=r.id, n=M.NOTES[id], sel=NB.sel===id, hot=hoverUI==='n:'+id, mark=tab==='open'&&ded[id];
    if (sel) fb.rect(48,y+1,234,rh-3,P.y4); else if (hot) fb.rect(48,y+1,234,rh-3,P.s6);
    var t=M.trUI?M.trUI(n.s||n.t):(n.s||n.t); while (M.textWidth(t)>214 && t.length>3) t=t.slice(0,-2)+'…';   // erst übersetzen, dann kürzen
    M.text(fb,t,56,y+ty,mark?P.g1:(tab==='open'?P.n0:P.n1)); if (mark){ var my=y+ty+2; fb.px(51,my,P.g3); fb.px(50,my+1,P.g3); fb.px(52,my+1,P.g3); fb.px(51,my+2,P.g3); fb.px(51,my+1,P.g2); }
    if (tab==='open' && g.noteNew[id]) fb.rect(276,y+ty+1,3,3,P.r4); lay.rows.push({id:id,r:[48,y,234,rh-1]}); y+=rh; });
  if (pages>1){ M.text(fb,(NB.page+1)+' / '+pages,150,NB_Y0+NB_PER*NB_RH+1,P.s1); if (NB.page>0) lay.prev=nbButton(48,NB_Y0+NB_PER*NB_RH-1,40,'<',hoverUI==='nprev'); if (NB.page<pages-1) lay.next=nbButton(242,NB_Y0+NB_PER*NB_RH-1,40,'>',hoverUI==='nnext'); }
  var by=NB_Y0+NB_PER*NB_RH+16; fb.hl(46,284,by-3,P.s3);
  // Text im unteren Feld: so viele Zeilen, wie Platz ist; wird es eng, rücken die Zeilen zusammen (Blindtest K4: letztes Wort fehlte)
  var fit=function(t,w,y0){ var L=M.wrap(t,w), room=186-y0-1, lh=9; if (L.length*lh>room) lh=8; var n=Math.floor(room/lh); if (L.length>n){ L=L.slice(0,n); L[n-1]=L[n-1].replace(/\s*\S*$/,'')+' …'; } return {L:L,lh:lh}; };
  if (NB.msg){ fb.rect(46,by,238,186-by,NB.msg.ok?P.g5:P.s4); var fm=fit(NB.msg.t,228,by+3); fm.L.forEach(function(l,j){ M.text(fb,l,50,by+3+j*fm.lh,NB.msg.ok?P.g0:P.k1); }); }
  else if (NB.sel && M.NOTES[NB.sel]){ var fs=fit(M.NOTES[NB.sel].t,ask?156:228,by+2); fs.L.forEach(function(l,j){ M.text(fb,l,50,by+2+j*fs.lh,P.n1); }); if (ask){ var bw=Math.max(72,M.textWidth('Danach fragen')+14); lay.btn=nbButton(284-bw,by+12,bw,'Danach fragen',hoverUI==='nb',18); } }
  else { var hint=ask?'Antippen, dann „Danach fragen“.':(tab==='open'?'Eine Notiz antippen, dann eine zweite, die dazu passt.':(tab==='done'?'Erledigt. Antippen zum Nachlesen.':'Was ich gehört habe. Antippen zum Nachlesen.')), hy=by+2;
    if (ask && tabs.length>1){ M.text(fb,d.title||'Wonach fragen?',50,hy,P.r2); hy+=10; }   // der Titel steht oben nicht mehr, wenn dort die Seiten stehen
    M.wrap(hint,228).forEach(function(l,j){ M.text(fb,l,50,hy+j*9,P.s1); }); }
  ov.lay=lay; });
function nbAt(x,y){ var ov=E.overlay, lay=ov&&ov.lay; if (!lay) return null; var inR=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; };
  if (inR(lay.close)) return 'nx'; if (inR(lay.btn)) return 'nb'; if (inR(lay.prev)) return 'nprev'; if (inR(lay.next)) return 'nnext';
  for (var t=0;t<(lay.tabs||[]).length;t++) if (inR(lay.tabs[t].r)) return 't:'+lay.tabs[t].k;
  for (var q=0;q<lay.rows.length;q++) if (inR(lay.rows[q].r)) return 'n:'+lay.rows[q].id; return null; }
async function notebookTap(x,y){ var ov=E.overlay; if (!ov||!ov.lay) return; var ask=ov.data.mode==='ask', u=nbAt(x,y);
  if (!u){ NB.msg=null; return; }
  if (u==='nx'){ NB.sel=null; NB.msg=null; E.closeOverlay(null); return; }
  if (u.indexOf('t:')===0){ var k=u.slice(2); if (k!==NB.tab){ NB.tab=k; NB.page=0; NB.sel=null; NB.msg=null; M.sfx('page'); } return; }
  if (u==='nprev'){ NB.page=Math.max(0,NB.page-1); M.sfx('page'); return; } if (u==='nnext'){ NB.page++; M.sfx('page'); return; }
  if (u==='nb'){ if (NB.sel){ var id0=NB.sel; NB.sel=null; E.closeOverlay(id0); M.sfx('page'); } return; }
  var id=u.slice(2); delete GS().noteNew[id]; NB.msg=null;
  if (ask){ if (NB.sel===id){ NB.sel=null; E.closeOverlay(id); M.sfx('page'); return; } NB.sel=id; M.sfx('click'); return; }
  if (NB.tab!=='open'){ NB.sel=NB.sel===id?null:id; M.sfx('click'); return; }   // Erledigt und Gehört: nur lesen
  if (!NB.sel){ NB.sel=id; M.sfx('click'); return; } if (NB.sel===id){ NB.sel=null; return; }
  var a=NB.sel, res=await E.combineNotes(a,id); NB.msg={ok:res.ok,t:res.ok?('Schlussfolgerung: '+res.t):res.t}; NB.sel=res.ok&&res.to?res.to:null; if (res.ok&&res.to) delete GS().noteNew[res.to]; }
// für Tests und die Prüfwerkzeuge: eine Seite des Notizbuchs aufschlagen
E.nbTab=function(k){ if (E.overlay&&E.overlay.kind==='notebook'){ NB.tab=k||'open'; NB.page=0; NB.sel=null; NB.msg=null; } return NB.tab; };
// Variante 3: Nachdenken in der Auswahlliste (nach Gruppen geordnet; Erledigtes und Gehörtes am Ende zum Nachlesen)
function thinkOrder(list){ var out=[]; nbGroups(list).forEach(function(gr){ out=out.concat(gr.ids); }); return out; }
function thinkOpts(list,ex){ return list.filter(function(id){ return id!==ex; }).map(function(id){ var n=M.NOTES[id]; return {t:n.s||n.t,id:id,silent:true,noGray:true}; }); }
async function thinkRead(A,L){ var more=L.done.concat(L.heard); if (!more.length) return;
  var r=await A.choose(thinkOpts(more).concat([{t:'(Zurück.)',id:null,silent:true,bye:true,noGray:true}]),{title:'Was lese ich nach?',conv:false});
  if (r) await A.m(M.NOTES[r].t); }
M.thinkAbout=async function(){ if (E.busy) return; var A=M.API; E.busy=true;
  try{ var L=nbRest(false), list=thinkOrder(L.open), more=L.done.length+L.heard.length;
    if (!list.length && !more){ await A.m('Mir geht nichts im Kopf herum. Noch nicht.'); return; }
    list.forEach(function(id){ delete GS().noteNew[id]; });
    var extra=more?[{t:'(Erledigtes und Gehörtes nachlesen …)',id:'__more',silent:true,noGray:true}]:[];
    var a=await A.choose(thinkOpts(list).concat(extra,[{t:'(Nicht mehr nachdenken.)',id:null,silent:true,bye:true,noGray:true}]),{title:'Worüber denke ich nach?',conv:false});
    if (!a) return; if (a==='__more') return await thinkRead(A,L); await A.m(M.NOTES[a].t);
    var b=await A.choose(thinkOpts(list,a).concat([{t:'(Das passt zu nichts.)',id:null,silent:true,bye:true,noGray:true}]),{title:'Und was gehört dazu?',conv:false});
    if (!b) return; var res=await E.combineNotes(a,b);
    if (res.ok){ await A.m(res.say||res.t); if (res.to) await A.m(M.NOTES[res.to].t); } else await A.m(res.t);
  } finally { E.busy=false; } };
// im Gespräch fragen: in der Liste oder gleich in der Auswahl (Erledigtes und Gehörtes über einen eigenen Eintrag)
E.pickNoteThink=async function(title,also){ var L=nbRest(true,also), more=L.done.concat(L.heard); if (!L.open.length && !more.length) return null;
  var extra=more.length?[{t:'(Ältere Notizen …)',id:'__more',silent:true,noGray:true}]:[];
  var r=await M.API.choose(thinkOpts(L.open).concat(extra,[{t:'(Doch nichts.)',id:null,silent:true,bye:true,noGray:true}]),{title:title||'Wonach frage ich?'});
  if (r!=='__more') return r;
  return await M.API.choose(thinkOpts(more).concat([{t:'(Doch nichts.)',id:null,silent:true,bye:true,noGray:true}]),{title:title||'Wonach frage ich?'}); };
E.afterNotes=function(){ };



// ---------------------------------------------------------------- Zeigen (alle Hotspots kurz markieren)
var REVEAL_MS=4500;
function drawReveal(){ if (!reveal) return; if (E.gt()-reveal.at>REVEAL_MS||E.busy||E.dlg||E.overlay||E.menu||E.screen!=='game'||!E.room||E.room.noVerbs){ reveal=null; return; }
  var cx0=Math.round(E.camX), k=(E.gt()-reveal.at)/REVEAL_MS; if (k>0.85&&!M.reduceMotion()&&(Math.floor(E.gt()/90)%2)) return; var g=isG(), S=M.RS(E.room.id), list=[];
  E.room.hotspots.forEach(function(h){ if (h.vis&&!h.vis(S,GS())) return; if (h.who==='m'&&g) return; if (h.who==='g'&&!g) return; var r=E.hsRect(h); if (!r) return; if (!E.hsLit(h,r)) return; if (r[2]*r[3]>W*SH*0.25||h.noReveal) return;
    var x=Math.round(r[0]+r[2]/2-cx0), y=Math.round(r[1]+r[3]/2); if (x<-4||x>W+4) return; list.push({h:h,x:Math.max(4,Math.min(W-5,x)),y:Math.max(4,Math.min(SH-5,y)),a:r[2]*r[3]}); });
  list.sort(function(a,b){ return a.a-b.a; }); var pulse=(Math.sin(E.gt()/160)+1)/2, placed=[];
  list.forEach(function(m){ var ex=uiExit(m.h), col=ex?P.g5:(m.h.npc?P.r4:(g?P.x5:P.y4)), R=2+(M.reduceMotion()?1:Math.round(pulse)); if (g && ((m.h.g&&m.h.g.sense) || (M.senseNeutral&&M.senseNeutral(m.h,E.room.id)))) col=P.x6;   // Analyse P21: dieselbe Farbe für alle Stellen, an denen Mala spüren kann
    for (var dy=-R-1;dy<=R+1;dy++) for (var dx=-R-1;dx<=R+1;dx++){ var d2=dx*dx+dy*dy; if (d2<=(R+1)*(R+1)) fb.px(m.x+dx,m.y+dy,d2<=R*R?col:P.k0); } fb.px(m.x,m.y,P.l1); });
  // Namen: Figuren zuerst; stößt ein Schild an ein anderes, wird es darüber oder weiter unten versucht, statt wegzufallen
  list.slice().sort(function(a,b){ return (b.h.npc?1:0)-(a.h.npc?1:0) || a.a-b.a; }).forEach(function(m){ if (!uiExit(m.h) && !m.h.npc) return; var t=E.nameOf(m.h); if (!t) return; var w=M.textWidth(t), lx=Math.max(1,Math.min(W-1-w,m.x-(w>>1)));
    var hit=function(box){ return placed.some(function(b){ return box[0]<b[0]+b[2]&&b[0]<box[0]+box[2]&&box[1]<b[1]+b[3]&&b[1]<box[1]+box[3]; }); }, box=null;
    [6,-14,18,-26,30].some(function(o){ var ly=m.y+o; if (ly<1||ly+8>SH) return false; var bx=[lx-2,ly-2,w+4,12]; if (hit(bx)) return false; box=bx; return true; });
    if (!box) return; placed.push(box); M.text(fb,t,box[0]+2,box[1]+2,uiExit(m.h)?P.g5:(g?P.x5:P.s6),P.k0); }); }

// ---------------------------------------------------------------- Menü
function menuItems(){ var inG=E.screen==='game', sl=E.slot(); return [
  {t:'Weiterspielen',a:function(){ E.menu=null; E.paused(false); }},
  {t:'Speichern (Platz '+sl+')',dis:E.busy||!inG||(E.room&&E.room.noSave),a:function(){ var ok=E.saveGame(); flash(ok?'Gespeichert.':'Hier geht Speichern nicht.'); }},
  {t:'Laden (Platz '+sl+')',dis:!E.hasSave(),a:function(){ if (E.loadGame()){ E.menu=null; E.paused(false); flash('Geladen.'); } else flash('Kein Spielstand.'); }},
  {t:'Text: '+(E.tapText()?'wartet auf Tippen':['langsam','normal','schnell'][E.textSpeed()]),a:function(){ if (E.tapText()) E.setText(0,false); else if (E.textSpeed()<2) E.setText(E.textSpeed()+1,false); else E.setText(1,true); }},
  {t:'Notizbuch: '+(E.nbStyle()==='think'?'Nachdenken':'Liste'),a:function(){ E.setNbStyle(E.nbStyle()==='think'?'list':'think'); }},
  {t:'Musik: '+(M.musicOn()?'an':'aus'),a:function(){ M.setMusic(!M.musicOn()); }},
  {t:'Geräusche: '+(M.soundOn()?'an':'aus'),a:function(){ M.setSound(!M.soundOn()); }},
  {t:'Röhrenbild: '+(M.crtOn&&M.crtOn()?'an':'aus'),a:function(){ if (M.setCRT) M.setCRT(!M.crtOn()); }},
  {t:'Vollbild',a:function(){ if (M.fullscreen) M.fullscreen(); }},
  {t:langLabel(),a:nextLang},
  {t:'Hinweis …',dis:!inG||E.busy||!M.showHints,a:function(){ E.menu=null; E.paused(false); if (M.showHints) M.showHints('menu'); }},
  {t:'Spielanleitung',a:function(){ E.menu=null; E.paused(false); help(); }},
  {t:'Zum Titelbild',a:function(){ E.menu=null; E.paused(false); E.toTitle(); }}]; }
function flash(t){ E.msg={t:t,until:E.gt()+1800}; }
M.flash=flash;
function menuY0(){ var h=34+menuItems().length*12; return Math.max(4,100-(h>>1)); }
// mit der HTML-Schicht (07_shell.js) zeichnet sie die Pause; der Canvas-Fallback bleibt für Werkzeuge ohne Schicht
function drawMenu(){ if (!E.menu||M.shell) return; dimAll(2); var items=menuItems(), h=34+items.length*12, y0=menuY0(), c=ui();
  fb.rect(70,y0,180,h,P.k1); fb.hl(70,249,y0,c.fr); fb.hl(70,249,y0+h-1,c.fr); fb.vl(70,y0,y0+h-1,c.fr); fb.vl(249,y0,y0+h-1,c.fr);
  var mOn=E.msg&&E.gt()<=E.msg.until; if (mOn) centerText(E.msg.t,y0+7,isG()?P.x5:P.y5); else centerText(M.chapterOf&&M.chapterOf(GS())===5?'Die Stillen – Kapitel 5: Sarajevo':M.chapterOf&&M.chapterOf(GS())===4?'Die Stillen – Kapitel 4: München':M.chapterOf&&M.chapterOf(GS())===3?'Die Stillen – Kapitel 3: Mostar':(M.chapterOf&&M.chapterOf(GS())===2?'Die Stillen – Kapitel 2: Sarajevo':'Die Stillen – Kapitel 1: Split'),y0+7,c.hi);
  items.forEach(function(it,i){ var y=y0+22+i*12, hot=hoverUI==='m:'+i; centerText(it.t,y,it.dis?c.dim:(hot?c.hi:c.tx)); }); }
function centerText(s,y,c,oc){ M.text(fb,s,160-(M.textWidth(s)>>1),y,c,oc); }
M.centerText=centerText;
async function help(){ if (E.busy||E.screen!=='game') return; E.busy=true; try{
  await M.API.m('Tippe etwas an: Ist nur etwas zu sehen, schaue ich es mir an. Kann man etwas damit tun, kommt ein kleines Menü.');
  await M.API.m('Gegenstände ziehst du aus der Leiste auf ihr Ziel. Auch auf Mala, wenn sie sich etwas ansehen soll.');
  if (GS().malaOn && !GS().flags['mala.unknown'] && !GS().flags['mala.noSwitch'] && !GS().flags['mala.voice']) await M.API.g('Unten links kannst du zu mir wechseln. Ich gehe durch Wände, sehe, was er nicht sieht, und spüre, was an den Dingen hängt. Und wer losgelassen hat, den bringe ich hinüber.');
  if (E.nbStyle()==='think') await M.API.m('„Nachdenken“: Ich wähle einen Gedanken und dann einen zweiten, der dazugehört. Passt es, ziehe ich einen Schluss. Im Gespräch kann ich nach jedem Gedanken fragen. Im Menü lässt sich auf ein Notizbuch umschalten.');
  else { await M.API.m('„Notizen“ ist mein Notizbuch. Vorn steht, was noch offen ist. Zwei Notizen nacheinander antippen verbindet sie. Im Gespräch kann ich nach jeder Notiz fragen. Im Menü lässt sich auf „Nachdenken“ umschalten.');
    await M.API.m('Oben im Notizbuch liegen, sobald etwas darin steht, „Erledigt“ und „Gehört“: zum Nachlesen, und im Gespräch auch zum Fragen.'); }
  await M.API.m('„Zeigen“ markiert kurz alles, was man hier anfassen kann.');
  await M.API.m('Ein Tipp auf einen Ausgang, und ich gehe hin. Ein zweiter schneller Tipp, ein Doppelklick mit der Maus, und ich bin sofort draußen.');
  await M.API.m('„Karte“ öffnet den Stadtplan, mit der Maus auch die Taste K. Ein Tipp auf einen Ort, und ich gehe hin. „Schließen“ oder Esc, und ich bleibe.');
  await M.API.m(GS().malaOn&&!GS().flags['mala.unknown']?'Komme ich nicht weiter, frage ich Mala: „Ich komme gerade nicht weiter.“ Oder im Menü: „Hinweis …“. Sie verrät erst den Weg, dann den Schritt, und nur, wenn ich will.':'Komme ich nicht weiter, ordne ich meine Gedanken: im Menü unter „Hinweis …“. Erst der Weg, dann der Schritt, und nur, wenn ich will.');
 } finally { E.busy=false; } }
M.help=help;

// ---------------------------------------------------------------- Titel, Karten, Abspann
var TITLE_BG=null;
function slotLabel(n){ var T=M.trUI||function(x){ return x; }, i=E.slotInfo(n); if (!i) return T('Platz')+' '+n+':  '+T('leer'); var ph=M.PHASES[i.phase]||{}; var m=Math.max(1,Math.round(i.ms/60000)); var t=T('Platz')+' '+n+':  '+T(ph.short||ph.title||i.phase)+'  ('+(m<60?m+' '+T('Min.'):Math.floor(m/60)+' '+T('Std.')+' '+(m%60)+' '+T('Min.'))+')'; while (M.textWidth(t)>210) t=t.slice(0,-2); return t; }
function titleItems(){ var tm=E.titleMode;
  if (tm==='slots'){ var b=[], cont=E.titleNext==='cont'; for (var k=1;k<=3;k++){ (function(k){ var has=E.hasSave(k), pre=E.titleNext==='preset'; b.push({t:slotLabel(k),dis:cont&&!has,a:function(){ E.setSlot(k); if (cont){ E.titleMode='main'; if (!E.loadGame(k)) flash('Spielstand beschädigt.'); return; } if (has){ E.confirmSlot=k; E.titleMode='confirm'; return; } E.titleMode='main'; if (pre){ if (!E.loadPreset(E.presetId||'ivka',k)) flash('Spielstand beschädigt.'); return; } E.newGame(E.newCh||1); }}); })(k); }
    b.push({t:'Zurück',a:function(){ E.titleMode='main'; }}); return b; }
  if (tm==='confirm'){ var pre2=E.titleNext==='preset'; return [{t:pre2?'Ja, Platz '+E.confirmSlot+' überschreiben':'Ja, Platz '+E.confirmSlot+' neu beginnen',a:function(){ E.setSlot(E.confirmSlot); E.titleMode='main'; if (pre2){ if (!E.loadPreset(E.presetId||'ivka',E.confirmSlot)) flash('Spielstand beschädigt.'); return; } E.newGame(E.newCh||1); }},{t:'Nein, behalten',a:function(){ E.titleMode='slots'; }}]; }
  if (tm==='presets'){ var pl=Object.keys(M.PRESETS||{}).filter(function(k){ return k[0]!=='_'; }).map(function(k){ return {t:M.PRESETS[k].short||M.PRESETS[k].title,a:function(){ E.presetId=k; E.titleNext='preset'; E.titleMode='slots'; }}; }); pl.push({t:'Zurück',a:function(){ E.titleMode='main'; }}); return pl; }
  if (tm==='next'){ var nch=E.nextCh||2; return [{t:nch===5?'Weiter mit Kapitel 5: Sarajevo':nch===4?'Weiter mit Kapitel 4: München':nch===3?'Weiter mit Kapitel 3: Mostar':'Weiter mit Kapitel 2: Sarajevo',a:function(){ E.titleMode='main'; E.newCh=nch; E.newGame(nch); }},{t:'Zum Titelbild',a:function(){ E.titleMode='main'; }}]; }
  var a=[]; if (E.anySave()) a.push({t:'Fortsetzen',a:function(){ E.titleNext='cont'; E.titleMode='slots'; }}); a.push({t:'Kapitel 1: Split',a:function(){ E.newCh=1; E.titleNext='new'; E.titleMode='slots'; }}); a.push({t:'Kapitel 2: Sarajevo',a:function(){ E.newCh=2; E.titleNext='new'; E.titleMode='slots'; }}); if (M.startChapter3) a.push({t:'Kapitel 3: Mostar',a:function(){ E.newCh=3; E.titleNext='new'; E.titleMode='slots'; }}); if (M.startChapter4) a.push({t:'Kapitel 4: München',a:function(){ E.newCh=4; E.titleNext='new'; E.titleMode='slots'; }}); if (M.startChapter5) a.push({t:'Kapitel 5: Sarajevo',a:function(){ E.newCh=5; E.titleNext='new'; E.titleMode='slots'; }}); if (M.PRESETS&&M.PRESETS.ivka) a.push({t:'Mitgelieferte Spielstände',a:function(){ E.titleMode='presets'; }}); if (M.setLang) a.push({t:langLabel(),a:nextLang}); a.push({t:'Über das Spiel',a:function(){ E.titleMode='about'; }}); if (E.titleMode==='about') return [{t:'Zurück',a:function(){ E.titleMode='main'; }}]; return a; }
function langLabel(){ return M.lang==='de'?'Sprache: Deutsch':'Sprache: Bosanski / Hrvatski'; }
// Die Unterzeile im Titel nennt nur Orte bereits erreichter Kapitel (UI-Konzept D1): Split, nach Kapitel 1 „Split · Sarajevo“ usw.
M.chaptersDone=function(){ var n=0; try{ var L=M.storage||localStorage; for (var k=1;k<=5;k++) if (L.getItem('mala.c'+k+'end')) n=k; }catch(e){} return n; };
function journeyLine(){ return ['Split','Sarajevo','Mostar','München','Sarajevo'].slice(0,Math.min(5,M.chaptersDone()+1)).join('  ·  '); }
M.journeyLine=journeyLine;
function nextLang(){ var ks=Object.keys(M.LANGS||{de:1}), i=ks.indexOf(M.lang); M.setLang(ks[(i+1)%ks.length]); }
function titleRowY(i,n){ if (E.titleMode==='main') return n>7?126+i*9:n>6?134+i*9:(n>5?140+i*10:(n>4?144+i*11:150+i*12)); var h=30+n*13, y0=Math.max(4,100-(h>>1)); return y0+24+i*13; }
function drawTitle(){ if (!TITLE_BG && M.paintTitle) TITLE_BG=M.paintTitle(); fb.rect(0,0,W,H,P.k0); if (TITLE_BG) for (var i=0;i<W*SH;i++) fb.d[i]=TITLE_BG.d[i];
  var tt=E.gt()/1000*(M.reduceMotion()?0.3:1); if (M.titleDynamic) M.titleDynamic(fb,tt); titleWater(tt);
  M.big(fb,M.GAME_TITLE_BIG,160,22,P.x5,M.textWidth(M.GAME_TITLE_BIG)*4>300?3:4,P.k0); centerText(journeyLine(),58,P.s5,P.k0);
  if (M.shell) return;   // Menüs zeichnet die HTML-Schicht (07_shell.js)
  if (E.titleMode==='about'){ dimAll(2); var lines=[M.startChapter5?'Die Stillen – Split · Sarajevo · Mostar · München · Sarajevo':M.startChapter4?'Die Stillen – Split · Sarajevo · Mostar · München':M.startChapter3?'Die Stillen – Split · Sarajevo · Mostar':'Die Stillen – Kapitel 1: Split · Kapitel 2: Sarajevo','','Ein Point-and-Click-Adventure über Menschen,','die nicht weiterkommen, und über einen,','der mit ihnen reden kann.','','Marko lebt. Mala nicht.','Er spricht mit den Lebenden, sie geht durch Wände.','','Alle Grafik, Musik und Geräusche entstehen','im Spiel selbst. Kopfhörer lohnen sich.']; lines.forEach(function(l,i){ centerText(l,30+i*10,i===0?P.x5:P.s5); }); }
  var opts=titleItems(), boxed=['slots','confirm','next','presets'].indexOf(E.titleMode)>=0; if (boxed){ dimAll(2); var h=30+opts.length*13, y0=Math.max(4,100-(h>>1)); fb.rect(46,y0,228,h,P.k1); fb.hl(46,273,y0,P.x2); fb.hl(46,273,y0+h-1,P.x2); fb.vl(46,y0,y0+h-1,P.x2); fb.vl(273,y0,y0+h-1,P.x2);
    var hd=E.titleMode==='presets'?'Welchen Spielstand laden?':E.titleMode==='next'?((E.nextCh||2)===5?'München ist zu Ende. Weiter nach Sarajevo?':(E.nextCh||2)===4?'Mostar ist zu Ende. Weiter nach München?':(E.nextCh||2)===3?'Sarajevo ist zu Ende. Weiter nach Mostar?':'Split ist zu Ende. Weiter nach Sarajevo?'):(E.titleMode==='confirm'?('Auf Platz '+E.confirmSlot+' liegt ein Spielstand. '+(E.titleNext==='preset'?'Überschreiben?':'Neu beginnen?')):(E.titleNext==='cont'?'Welchen Spielstand fortsetzen?':(E.titleNext==='preset'?'Auf welchen Platz laden?':(E.newCh===4?(M.lang!=='de'?'München (bisher nur auf Deutsch): auf welchem Platz?':'München: auf welchem Platz spielen?'):E.newCh===3?(M.lang!=='de'?'Mostar (bisher nur auf Deutsch): auf welchem Platz?':'Mostar: auf welchem Platz spielen?'):(E.newCh===2?(M.lang!=='de'?'Sarajevo (bisher nur auf Deutsch): auf welchem Platz?':'Sarajevo: auf welchem Platz spielen?'):'Split: auf welchem Platz spielen?')))));
    centerText(hd,y0+8,P.x5); }
  opts.forEach(function(o,i){ var y=E.titleMode==='about'?184:titleRowY(i,opts.length), hot=hoverUI==='t:'+i; centerText(o.t,y,o.dis?P.x1:(hot?P.x6:P.x4)); }); }
// Titelbild: das Meer reicht bis zum unteren Rand (UI-Konzept D1) – gespiegelt aus den Zeilen darüber, nach unten dunkler, mit eigenem Glitzern
function titleWater(t){ for (var y=SH;y<H;y++){ var sy=SH-1-((y-SH)%20), dk=1+((y-SH)/18|0); for (var x=0;x<W;x++){ var c=fb.d[sy*W+x]; for (var k=0;k<dk;k++) c=M.DN[c]; fb.d[y*W+x]=c; } }
  for (var y2=SH;y2<H;y2+=2) for (var x2=0;x2<W;x2++){ var q=Math.sin(x2*0.11+y2*0.9+t*1.2)+Math.sin(x2*0.04-t*0.5+y2*0.3); if (q>1.62) fb.px(x2,y2,P.n2); } }
function drawCard(){ var c=E.card; fb.rect(0,0,W,H,P.k0); var t=(E.gt()-c.at)/1000, a=Math.min(1,t/0.8), ms=(c.ms||4200)/1000, b=Math.min(1,(ms-t)/0.8);
  var k=Math.max(0,Math.min(a,b)); var col=function(base){ var n=Math.round((1-k)*5); var cc=base; for (var i=0;i<n;i++) cc=M.DN[cc]; return cc; };
  if (c.kicker) centerText(c.kicker,62,col(P.x3)); M.big(fb,c.title||'',160,78,col(P.s6),2,P.k0); var sl=c.sub?M.wrap(c.sub,280).slice(0,2):[]; sl.forEach(function(l,i){ centerText(l,104+i*10,col(P.s4)); }); if (c.time) centerText(c.time,118+(sl.length>1?10:0),col(P.x3)); }
function creditsDone(){ var nx=E.afterCredits; E.afterCredits=null; E.toTitle(); if (nx==='ch2'||nx==='ch3'||nx==='ch4'||nx==='ch5'){ E.nextCh=nx==='ch5'?5:(nx==='ch4'?4:(nx==='ch3'?3:2)); E.titleMode='next'; } }
function drawCredits(){ fb.rect(0,0,W,H,P.k0); var t=(E.gt()-E.creditsAt)/1000, lines=E.creditLines||M.CREDITS||[], y=200-t*14;
  lines.forEach(function(l,i){ var yy=Math.round(y+i*12); if (yy<-10||yy>H) return; centerText(l,yy,l===l.toUpperCase()&&l.length>2?P.x5:P.s5); }); if (y+lines.length*12<-20){ creditsDone(); return; }
  if (t>3){ var sk='Überspringen ▸'; M.text(fb,sk,W-6-M.textWidth(sk),H-11,P.x3,P.k0); } }   // ab 3 s sichtbar: Tipp, Leertaste, Enter oder Esc (UI-Konzept D3)
E.startCredits=function(){ E.screen='credits'; E.creditsAt=E.gt(); M.music(E.creditMusic||'end'); };
// Während einer längeren Szene ruht die Leiste sichtbar (eine Stufe dunkler); mit Beginn der Kontrolle volle Helligkeit (UI-Konzept D2)
var busyAt=0; function hudRest(){ if (!E.busy||E.dlg||E.overlay||E.menu||E.screen!=='game'){ busyAt=0; return; } if (!busyAt) busyAt=E.gt(); if (E.gt()-busyAt<900) return;
  for (var i=SH*W;i<W*H;i++) fb.d[i]=M.DN[fb.d[i]]; }
function drawCursor(){ if (!pointer.show||pointer.touch||(WIDE&&pointer.y>=1000)) return; var x=Math.round(pointer.x), y=Math.round(pointer.y), c=hover||hoverUI?((Math.floor(E.gt()/140)%2)?(isG()?P.x5:P.y4):P.s6):(isG()?P.x3:P.y3); if (E.busy&&E.screen==='game'&&!E.dlg) c=P.k2;
  for (var i=2;i<=5;i++){ fb.px(x-i,y,c); fb.px(x+i,y,c); fb.px(x,y-i,c); fb.px(x,y+i,c); } }
function applyFade(){ var n=Math.round(E.fade); if (n===0) return; var tb=n<0?M.UP:M.DN, m=Math.abs(n); for (var i=0;i<fb.d.length;i++){ var c=fb.d[i]; for (var k=0;k<m;k++) c=tb[c]; fb.d[i]=c; } if (n<=-7){ for (var j=0;j<fb.d.length;j++) if (bayer(j%W,(j/W)|0)<(m-6)/3) fb.d[j]=P.l1; } }
function drawMsg(){ if (!E.msg||E.gt()>E.msg.until||E.menu) return; var t=E.msg.t, ls=M.wrap(t,250), y=E.screen==='game'?SH-12-ls.length*9:186; ls.forEach(function(l,i){ var w=M.textWidth(l); fb.rect(160-(w>>1)-3,y+i*9-1,w+6,9,P.k1); M.text(fb,l,160-(w>>1),y+i*9,E.msg.note?(isG()?P.x5:P.y4):P.s6); }); }
function drawDrag(){ if (!drag||!drag.on||(WIDE&&pointer.y>=1000)) return; var it=M.ITEMS[drag.id], ic=iconOf(drag.id); var x=Math.round(pointer.x), y=Math.round(pointer.y), ix=x-(ic.w>>1), iy=y-ic.h-8; fb.blit(ic,ix,iy);
  var tgt=null; if (pointer.y<SH && hover && !hover.item) tgt=E.nameOf(hover); else { var u=uiAt(pointer.x,pointer.y); if (u&&u[0]==='i'){ var o=invList()[+u.slice(2)]; if (o&&o!==drag.id) tgt=M.ITEMS[o].name; } }
  var lab=tgt?('Benutze '+it.name+' mit '+tgt):it.name, lw=M.textWidth(lab), lx=Math.max(2,Math.min(W-2-lw,x-(lw>>1))), ly=Math.max(2,iy-11); M.text(fb,lab,lx,ly,tgt?P.l0:P.s4,P.k0); }
M.renderFrame=function(){ SUBS=!!(M.subsOn&&M.subsOn()); LISTH=SUBS||!!(M.listHtml&&M.listHtml()); SUBW.sp=null; SUBW.dlg=null;
  if (E.screen==='title') drawTitle();
  else if (E.screen==='card') drawCard();
  else if (E.screen==='credits') drawCredits();
  else if (E.room && !(E.overlay && E.overlay.data && E.overlay.data.blank)){ drawScene(); drawReveal(); if (!WIDE){ drawUI(); hudRest(); } drawConv(); drawOverlay(); drawSpeech(); drawFocus(); drawFine(); drawTapMark(); drawPop(); drawDrag(); }
  // Prüfbericht K3: Erinnerung vor dem ersten Raum (Kapitelanfang) oder mit data.blank: auf dunklem Grund statt unsichtbar
  else if (E.screen==='game' && (E.overlay || E.speech)){ fb.rect(0,0,W,H,P.k0); drawOverlay(); drawSpeech(); }
  applyFade(); drawFF(); drawMenu(); drawMsg(); drawCursor(); return fb; };
// Schnellvorlauf läuft (UI-Konzept B3-5): kleines „▸▸“ oben rechts in der Szene
function drawFF(){ if (!(M.ffActive&&M.ffActive())) return; var t='▸▸', w=M.textWidth(t); fb.rect(W-w-8,2,w+6,11,P.k0); M.text(fb,t,W-w-5,4,isG()?P.x5:P.y4); }

// ---------------------------------------------------------------- Breitbild-Leiste (UI-Konzept D17)
// Auf Telefonen und breiten Fenstern zeigt 99_main.js die Szene größer auf eigener Zeichenfläche; die Leiste liegt in einem eigenen
// Puffer (HB, Leistenpixel), Aufteilung siehe wideLayout. Leistenkoordinaten
// kommen als y ≥ 1000 an (99_main.js, toLogical). Overlays, Karten, Abspann und Titel nutzen weiter das gewohnte 320×200-Bild.
var WIDE=null, HB=null;
// Aufteilung (Touch-Konzept D1): „rails“ = Figurenknopf und Notizen links, Menü, Karte, Zeigen rechts neben der Szene, unten Satz und Inventar;
// „bottom“ = unter der Szene eine Satzzeile, darunter alle Knöpfe in einer Reihe (Figur, Notizen | Inventar | Menü, Karte, Zeigen).
// g.k: Mindestmaß eines Bedienelements in Leistenpixeln (44 CSS-px bei Touch, sonst 0: gewohnte Maße für die Maus).
function wideLayout(g){ var Wh=g.Wh, S0=g.S0, k=g.k||0, bh=g.bh||32, aw=Math.max(15,k), sw=k?34:36, mode=g.mode||'rails';
  var L={ n:g.n, m:g.m, W:Wh, H:g.Hh, S0:S0, mode:mode, rail:mode==='rails'?(g.rail||33):0, sx:g.sx!=null?g.sx:33, bh:bh };
  if (mode==='rails'){ var r=L.rail, bH=Math.max(27,k), ix=Wh-r-2-2*aw-6*sw;
    L.sw=[0,2,r,40]; L.notes=[0,46,r,bH]; L.menu=[Wh-r,2,r,bH]; L.map=[Wh-r,6+bH,r,bH]; L.reveal=[Wh-r,10+2*bH,r,bH];
    L.inv={x:ix,y:S0+1,aw:aw,sw:sw,sh:bh-2,n:6}; L.text=[r+3,S0+12,ix-4-(r+3)]; L.lines=2; }
  else { var y=S0+13, h=bh-2, bw=Math.max(30,k), xr=Wh-2, a0, z0, iw=2*aw+6*sw;
    L.sw=[2,y,40,h]; L.notes=[44,y,bw,h]; L.reveal=[xr-bw,y,bw,h]; L.map=[xr-2*bw-2,y,bw,h]; L.menu=[xr-3*bw-4,y,bw,h];
    a0=44+bw+4; z0=L.menu[0]-4; L.inv={x:Math.round(a0+(z0-a0-iw)/2),y:y,aw:aw,sw:sw,sh:h,n:6}; L.text=[4,S0+6,Wh-8]; L.lines=1; }
  return L; }
M.setWideLayout=function(g){ WIDE=g?wideLayout(g):null; HB=g?new Buf(g.Wh,g.Hh,P.k0):null; };
M.wideWanted=function(){ return E.screen==='game' && !!E.room && !E.overlay && !E.card; };
M.wide=function(){ return WIDE; };
function inR4(r,x,y){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; }
function uiAtWide(x,y){ var L=WIDE; if (!L) return null; if (E.dlg) return null;
  if (inR4(L.menu,x,y)) return 'menu'; if (E.room&&E.room.noVerbs) return null;
  if (inR4(L.notes,x,y)) return 'notes'; if (inR4(L.map,x,y)) return 'map'; if (inR4(L.reveal,x,y)) return 'reveal';
  if (inR4(L.sw,x,y)){ var gs=GS(); if (!switchShown(gs)) return null; return 'sw'; }
  var I=L.inv, A=I.aw, N=I.n*I.sw; if (y>=I.y-1 && y<I.y+I.sh+1){ if (x>=I.x && x<I.x+A) return 'up'; if (x>=I.x+A+N && x<I.x+2*A+N) return 'dn';
    if (x>=I.x+A && x<I.x+A+N){ return 'i:'+(E.invTop*INV_N+Math.floor((x-I.x-A)/I.sw)); } }
  return null; }
// Beschriftung in einer schmalen Fläche: eine Zeile, sonst zwei (an Leerzeichen oder mit Trennstrich in der Wortmitte)
function fitLines(t,w){ if (M.textWidth(t)<=w) return [t]; var sp=t.indexOf(' '); if (sp>0 && M.textWidth(t.slice(0,sp))<=w && M.textWidth(t.slice(sp+1))<=w) return [t.slice(0,sp),t.slice(sp+1)];
  // schmale Seitenknöpfe (Telefon-Layout): Trennstrich bevorzugt an einer Silbengrenze (Vokal|Konsonant+Vokal oder Vokal+Konsonant|Konsonant+Vokal), sonst möglichst mittig
  var u=M.trUI?M.trUI(t):t, V=/[aeiouyäöüAEIOUYÄÖÜ]/, best=null;
  for (var k=2;k<u.length-1;k++){ var a=u.slice(0,k)+'-', b=u.slice(k); if (M.textWidth(a)>w || M.textWidth(b)>w) continue;
    if (/^(lj|nj|dž)$/i.test(u.slice(k-1,k+1))) continue;   // BHS: lj, nj, dž sind ein Laut und werden nicht getrennt
    var c2=(/^(lj|nj|dž)/i.test(u.slice(k))?u[k+2]:u[k+1])||'', syl=!V.test(u[k]) && V.test(c2) && (V.test(u[k-1]) || V.test(u[k-2]||'')), sc=(syl?0:100)+Math.abs(u.length-2*k);
    if (!best || sc<best.sc) best={sc:sc,l:[a,b]}; }
  return best?best.l:[u]; }
function wideButton(b,r,label,on,hot,act){ var c=ui(), x=r[0], y=r[1], w=r[2], h=r[3];
  b.rect(x+1,y+1,w-2,h-2,act?c.sel:(hot?P.k2:P.k1));
  if (on){ b.hl(x+1,x+w-2,y,c.fr); b.hl(x+1,x+w-2,y+h-1,c.fr); b.vl(x,y+1,y+h-2,c.fr); b.vl(x+w-1,y+1,y+h-2,c.fr); }
  else { for (var gx=x+1;gx<x+w-1;gx+=2){ b.px(gx,y,P.s1); b.px(gx,y+h-1,P.s1); } for (var gy=y+1;gy<y+h-1;gy+=2){ b.px(x,gy,P.s1); b.px(x+w-1,gy,P.s1); } }
  var ls=fitLines(label,w-2), ty=y+((h-(ls.length*10-3))>>1); ls.forEach(function(l,i){ M.text(b,l,x+((w-M.textWidth(l))>>1),ty+i*10,!on?P.s2:((hot||act)?c.hi:c.tx)); }); }
function wideSwitch(b,r){ var g=GS(), c=ui(), x=r[0], y=r[1], w=r[2], h=r[3], shown=switchShown(g), avail=shown && g.malaOn && !(E.room&&(E.room.noMala||E.room.noSwitch));
  b.rect(x,y,w,h,P.k1); var fc=avail?c.fr:P.k2; b.hl(x,x+w-1,y,fc); b.hl(x,x+w-1,y+h-1,fc); b.vl(x,y,y+h-1,fc); b.vl(x+w-1,y,y+h-1,fc);
  var other=shown?(g.active==='marko'?'mala':'marko'):g.active, hot=shown&&hoverUI==='sw'&&pointer.show, dim=function(c0){ return !shown?M.DN[c0]:(!avail?M.DN[M.DN[c0]]:c0); };
  if (M.hasPortrait && M.hasPortrait(other)){ var pp=M.portrait(other,((E.gt()+900)%4300)<120?'b':'n'), cx1=Math.max(0,Math.floor((pp.w-(w-4))/2)), ch1=h-12, cy1=2+Math.max(0,(28-ch1)>>1);   // flacher Knopf (untere Leiste): Ausschnitt um die Augen
    for (var j2=0;j2<ch1;j2++) for (var i2=0;i2<w-4;i2++){ var sx2=cx1+i2, sy2=cy1+j2; if (sx2>=pp.w||sy2>=pp.h) continue; var c2=pp.d[sy2*pp.w+sx2]; if (c2===T) continue; b.px(x+2+i2,y+1+j2,dim(c2)); } }
  else { var pb=portraitBuf(other,'n'), cw=14, chh=13, cx0=Math.floor((pb.w-cw)/2), ox=x+Math.floor((w-cw*2)/2), oy=y+1;
    for (var j=0;j<chh*2;j++) for (var i=0;i<cw*2;i++){ var sx=cx0+(i>>1), sy=(j>>1); if (sx<0||sx>=pb.w||sy>=pb.h) continue; var col=pb.d[sy*pb.w+sx]; if (col===T) continue; if (other==='mala') col=M.ghostLut('mala')[col]; b.px(ox+i,oy+j,dim(col)); } }
  var lab=other==='mala'?'Mala':'Marko', col2=!shown?P.s3:(!avail?P.k2:(hot?c.hi:(other==='mala'?P.x4:P.y3))), lw=M.textWidth(lab), ly=y+h-10;
  M.text(b,lab,x+((w-lw)>>1),ly,col2); if (!shown) return;
  var aw=M.textWidth('↔'); M.text(b,'↔',x+w-3-aw,y+3,col2,P.k0); }   // Breitbild: Pfeil oben rechts auf dem Porträt, darunter der Name (33 Leistenpixel sind für „↔ Marko“ zu schmal)
function wideArrow(b,x,y,left,on,hot){ var c=ui(), col=on?(hot?c.hi:c.tx):c.dim; for (var i=0;i<6;i++){ var xx=left?x+i:x-i; b.vl(xx,y-i,y+i,col); } }
function drawUIWide(){ var b=HB, L=WIDE; if (!b||!L) return; b.d.fill(P.k0); var room=E.room, c=ui(); if (!room) return b;
  if (room.noVerbs){ var s0=hover?E.nameOf(hover):(room.prompt||''); M.text(b,s0,L.text[0],L.text[1]-3,c.tx); wideButton(b,L.menu,'Menü',true,hoverUI==='menu'&&pointer.show,false); return b; }
  // Satz: im Telefon-Layout mit Seitenknöpfen bis zwei Zeilen neben dem Inventar, sonst eine Zeile über den Knöpfen; zu lang: gekürzt mit „…“
  var s=E.pop||drag?'':sentence(), mw=L.text[2], ls=s?M.wrap(s,mw):[]; if (ls.length>L.lines){ ls=ls.slice(0,L.lines); var lt=ls[L.lines-1]+'…'; while (lt.length>1 && M.textWidth(lt)>mw) lt=lt.slice(0,-2)+'…'; ls[L.lines-1]=lt; }
  ls.forEach(function(l,i){ M.text(b,l,L.text[0],L.text[1]-(ls.length>1?7:3)+i*10,c.tx); });
  var nbNew=Object.keys(GS().noteNew).some(function(k){ return M.NOTES[k]&&M.NOTES[k].show; }), mapOn=!(M.mapBlocked&&M.mapBlocked());
  wideButton(b,L.notes,BTNS[0].t,true,hoverUI==='notes'&&pointer.show,false); if (nbNew) b.rect(L.notes[0]+L.notes[2]-4,L.notes[1]+1,3,3,P.r4);
  wideButton(b,L.menu,'Menü',true,hoverUI==='menu'&&pointer.show,false); wideButton(b,L.map,'Karte',mapOn,hoverUI==='map'&&pointer.show,false); wideButton(b,L.reveal,'Zeigen',true,hoverUI==='reveal'&&pointer.show,!!reveal);
  wideSwitch(b,L.sw);
  var I=L.inv, inv=invList(), pages=Math.max(1,Math.ceil(inv.length/INV_N)); if (E.invTop>=pages) E.invTop=pages-1;
  var ao=(I.aw-15)>>1; wideArrow(b,I.x+5+ao,I.y+(I.sh>>1),true,E.invTop>0,hoverUI==='up'); wideArrow(b,I.x+2*I.aw+I.n*I.sw-6-ao,I.y+(I.sh>>1),false,E.invTop<pages-1,hoverUI==='dn');
  for (var i=0;i<I.n;i++){ var x=I.x+I.aw+i*I.sw, y=I.y, idx=E.invTop*INV_N+i;
    b.rect(x,y,I.sw-2,I.sh,P.k0); b.hl(x,x+I.sw-3,y,c.dim); b.vl(x,y,y+I.sh-1,c.dim); b.hl(x,x+I.sw-3,y+I.sh-1,P.k2); b.vl(x+I.sw-3,y,y+I.sh-1,P.k2);
    var id=inv[idx]; if (!id) continue; var ic=iconOf(id), sel=E.pending===id||(E.pop&&E.pop.item===id)||(drag&&drag.id===id), hot=hoverUI==='i:'+idx&&pointer.show;
    if (sel||hot) b.rect(x+1,y+1,I.sw-4,I.sh-2,sel?c.sel:P.k2); if (E.invNew===id && (M.reduceMotion()||E.gt()%600<300)) b.rect(x+1,y+1,I.sw-4,2,c.hi);
    if (ic && !(drag&&drag.on&&drag.id===id)) b.blit(ic,x+Math.floor((I.sw-2-ic.w)/2),y+Math.floor((I.sh-ic.h)/2)); }
  // im Gespräch ruht die Leiste (35 %) und nimmt keine Eingaben an; während längerer Szenen eine Stufe dunkler
  var dk=E.dlg?2:0; if (!dk && E.busy && !E.overlay && !E.menu){ if (!busyAt) busyAt=E.gt(); if (E.gt()-busyAt>=900) dk=1; } else if (!E.busy) busyAt=0;
  if (dk) for (var q=0;q<b.d.length;q++){ var cq=b.d[q]; for (var k2=0;k2<dk;k2++) cq=M.DN[cq]; b.d[q]=cq; }
  // gezogener Gegenstand und Mauszeiger über der Leiste
  if (pointer.y>=1000){ var px=Math.round(pointer.x), py=Math.round(pointer.y-1000);
    if (drag&&drag.on){ var ic2=iconOf(drag.id); b.blit(ic2,px-(ic2.w>>1),py-ic2.h-6); }
    else if (pointer.show&&!pointer.touch){ var cc=hoverUI?((Math.floor(E.gt()/140)%2)?(isG()?P.x5:P.y4):P.s6):(isG()?P.x3:P.y3); for (var t=2;t<=5;t++){ b.px(px-t,py,cc); b.px(px+t,py,cc); b.px(px,py-t,cc); b.px(px,py+t,cc); } } }
  return b; }
M.renderHud=function(){ return drawUIWide(); };
// Vorschaubild für Spielstände: nur die Szene (ohne Leiste, Sprechtext, Menüs), Palettenindizes 320×144; das nächste Bild zeichnet alles neu
M.sceneSnap=function(){ if (!E.room||E.screen!=='game') return null; try{ drawScene(); }catch(e){ return null; } return fb.d.slice(0,W*SH); };
// ---------------------------------------------------------------- Eingabe
function uiAt(x,y){
  if (M.shell && (E.menu || E.screen==='title')) return null;   // Titel und Pause liegen in der HTML-Schicht
  if (E.menu){ var items=menuItems(), y0=menuY0(); for (var i=0;i<items.length;i++){ var yy=y0+22+i*12; if (y>=yy-2&&y<yy+10&&x>=74&&x<246) return 'm:'+i; } return null; }
  if (E.screen==='title'){ var t=titleItems(); for (i=0;i<t.length;i++){ var ty=E.titleMode==='about'?184:titleRowY(i,t.length); if (y>=ty-2&&y<ty+(E.titleMode==='main'?(t.length>5?8:10):11)&&x>=46&&x<274) return 't:'+i; } return null; }
  if (E.screen!=='game') return null;
  var ov=E.overlay; if (ov){ var inR=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; };
    if (ov.kind==='notebook'){ return nbAt(x,y); }
    if (ov.kind==='puzzle'&&ov.lay){ if (inR(ov.lay.go)) return 'zgo'; if (inR(ov.lay.close)) return 'zx'; for (var z=0;z<ov.lay.rows.length;z++) if (inR(ov.lay.rows[z])) return 'z:'+z; return null; }
    if (ov.lay && ov.lay.at){ var aid=ov.lay.at(x,y); return aid?'o:'+aid:null; }
    if (ov.lay && ov.lay.hits){ for (var h=0;h<ov.lay.hits.length;h++) if (inR(ov.lay.hits[h].r)) return 'o:'+ov.lay.hits[h].id; return null; }
    return null; }
  if (E.pop && !E.dlg){ var pr=popAt(x,y); if (pr!==null) return pr>=0?'p:'+pr:'pop'; }
  if (E.dlg){ var L=E.dlg.lay; if (!L) return null; var inR2=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; }; if (inR2(L.close)) return 'cx'; if (inR2(L.up)) return 'cu'; if (inR2(L.dn)) return 'cd'; for (var ri=0;ri<L.rows.length;ri++) if (inR2(L.rows[ri].r)) return 'c:'+L.rows[ri].k; return null; }
  if (WIDE){ if (y>=1000) return uiAtWide(x,y-1000); return null; }
  if (y>=SH&&y<SH+15){ var bt=btnAt(x,y); if (E.room&&E.room.noVerbs&&bt!=='menu') return null; return bt; }
  if (y<SH) return null; if (E.room&&E.room.noVerbs) return null;
  if (x>=SW_X&&x<SW_X+SW_W&&y>=INV_Y-1){ var gs=GS(); if (!gs.malaOn||gs.flags['mala.unknown']||gs.flags['mala.noSwitch']||gs.flags['split.afterIvka.away']) return null; return 'sw'; }   // nur, wenn der Knopf auch gezeichnet ist
  if (y>=INV_Y-2){ if (x>=INV_X-11&&x<INV_X+5) return 'up'; if (x>=INV_X+INV_N*SLOT_W-4&&x<INV_X+INV_N*SLOT_W+12) return 'dn'; }   // Pfeile 16 Spielpixel breit (UI-Konzept D9)
  if (x>=INV_X&&x<INV_X+INV_N*SLOT_W&&y>=INV_Y-2&&y<INV_Y+SLOT_H){ var c=Math.floor((x-INV_X)/SLOT_W); return 'i:'+(E.invTop*INV_N+c); }
  return null; }
// Feinwahl (Touch-Konzept T21, Ergänzung, in den Einstellungen einschaltbar): Finger 0,4 s ruhig auf der Szene halten → Fadenkreuz 40 CSS-px über
// dem Finger, Rahmen und Name des Dings darunter; Loslassen = Tipp genau dort (ohne Fangradius). Ohne Halten bleibt alles wie gewohnt.
var fine=null, fineT=null, FINE=false; try{ FINE=typeof localStorage!=='undefined' && localStorage.getItem('mala.fine')==='1'; }catch(e){}
M.fineOn=function(v){ if (v!==undefined){ FINE=!!v; try{ localStorage.setItem('mala.fine',FINE?'1':'0'); }catch(e){} } return FINE; };
function fineOff(){ if (fineT){ clearTimeout(fineT); fineT=null; } fine=null; }
function fineAt(x,y){ var s=(M.sceneScale&&M.sceneScale())||2; return [x,Math.max(0,y-Math.round(40/s))]; }
function fineArm(x,y){ fineOff(); if (!FINE||E.screen!=='game'||!E.room||E.overlay||E.dlg||E.menu||E.busy||E.pop||y>=SH||E.room.noVerbs) return;
  fineT=setTimeout(function(){ fineT=null; if (pointer.down&&press&&!drag&&!E.busy&&!E.dlg&&!E.overlay){ fine={at:E.gt()}; updateHover(); } },400); }
function drawFine(){ if (!fine||!pointer.down) return; var q=fineAt(pointer.x,pointer.y), cx=Math.round(q[0]), cy=Math.round(q[1]), col=isG()?P.x6:P.l1, fx=Math.round(pointer.x), fy=Math.round(pointer.y);
  for (var y=cy+8;y<fy-2;y+=3) if (y>=0&&y<SH) fb.px(fx,y,P.s3);
  for (var t=2;t<=6;t++){ [[cx-t,cy],[cx+t,cy],[cx,cy-t],[cx,cy+t]].forEach(function(p){ if (p[0]>=0&&p[0]<W&&p[1]>=0&&p[1]<SH){ fb.px(p[0],p[1],col); } }); }
  [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]].forEach(function(p){ if (p[0]>=0&&p[0]<W&&p[1]>=0&&p[1]<SH) fb.px(p[0],p[1],P.k0); }); }
function updateHover(){ hoverUI=uiAt(pointer.x,pointer.y); if (E.menu||E.overlay||E.dlg||!E.room){ hover=null; return; }
  if (fine){ var fq=fineAt(pointer.x,pointer.y); hover=E.hotspotAt(fq[0]+Math.round(E.camX),fq[1]); hoverUI=null; return; }
  if (pointer.y<SH&&pointer.show) hover=E.hotspotAt(pointer.x+Math.round(E.camX),pointer.y); else if (hoverUI&&hoverUI[0]==='i'){ var id=invList()[+hoverUI.slice(2)]; hover=id?{item:id}:null; if (id&&id===E.invNew&&!pointer.touch) E.invNew=null; } else hover=null; }
M.pointerMove=function(x,y,touch){ pointer.x=x; pointer.y=y; pointer.touch=!!touch; pointer.show=true; if (fineT&&press&&Math.abs(x-press.x)+Math.abs(y-press.y)>6){ clearTimeout(fineT); fineT=null; } if (pointer.down&&press&&!drag&&E.screen==='game') dragCheck(x,y); updateHover(); };
// Testhilfe (Touch-Test): welches Bedienelement liegt an x,y; Beschriftungen der Titelzeilen
M.uiHit=function(x,y){ return uiAt(x,y); }; M.revealOn=function(){ return !!reveal; }; M.uiHover=function(){ return pointer.show?hoverUI:null; }; M.uiColors=function(){ return ui(); }; M.titleLabels=function(){ return titleItems().map(function(o){ return o.t; }); };
M.pointerDown=function(x,y,touch){ M.audioInit(); if (touch) touchUI=true; lastIn=touch?'touch':'mouse'; pointer.down=true; drag=null; press={x:x,y:y,ui:(E.screen==='game'?uiAt(x,y):null),t:E.gt(),tr:nowR()}; M.pointerMove(x,y,touch); if (touch&&!press.ui) fineArm(x,y); else fineOff(); };
M.pointerUp=function(x,y,touch){ if (fine){ var fq=fineAt(x,y); fineOff(); pointer.down=false; press=null; pointer.show=false; tapStartR=nowR(); hover=null; noFang=true; try{ click(fq[0],fq[1]); } finally { noFang=false; } return; } fineOff();
  pointer.down=false; M.pointerMove(x,y,touch); if (touch) setTimeout(function(){ if (!pointer.down) pointer.show=false; },350);
  var pr=press; press=null; tapStartR=pr?pr.tr:nowR(); if (drag){ var dg=drag; drag=null; if (dg.on) dropDrag(dg.id,x,y); return; } if (pr&&pr.swiped) return;
  if (pr && !pr.ui && pr.y<SH && Math.abs(x-pr.x)+Math.abs(y-pr.y)>10 && E.screen==='game' && !E.overlay && !E.dlg) return;   // im Bild gezogen: kein Tippen
  click(x,y); };
M.pointerCancel=function(){ fineOff(); if (!pointer.down && !press && !drag) return; pointer.down=false; press=null; drag=null; pointer.show=false; updateHover(); };
M.pointerActive=function(){ return !!(pointer.down||drag); };   // 99_main.js: Layoutwechsel erst nach dem Loslassen (T17)
function canDrag(){ return E.screen==='game'&&!E.busy&&!E.dlg&&!E.overlay&&!E.menu&&!(E.room&&E.room.noVerbs)&&!isG(); }
function dragCheck(x,y){ var u=press.ui; if (!u||u[0]!=='i'||!canDrag()) return; if (press.item===undefined){ press.item=invList()[+u.slice(2)]||null; press.top0=E.invTop; }
  var id=press.item, dx=x-press.x, dy=y-press.y, pages=Math.ceil(invList().length/INV_N);
  // aus der Leiste ins Bild gezogen: immer Benutzen, auch schräg (ein schon ausgelöstes Blättern wird zurückgenommen)
  if (id && y<INV_Y-6){ if (press.swiped){ E.invTop=press.top0; press.swiped=false; } E.pop=null; drag={id:id,on:true}; if (E.invNew===id) E.invNew=null; M.sfx('click'); return; }
  // in der Leiste auf einen anderen Gegenstand ziehen: bei einer Seite sofort, sonst nach einem kleinen Anheben (nach oben ziehen)
  if (id && !press.swiped && (dy<-5 || (pages<=1 && Math.abs(dx)>10))){ E.pop=null; drag={id:id,on:true}; if (E.invNew===id) E.invNew=null; M.sfx('click'); return; }
  if (!press.swiped && pages>1 && Math.abs(dx)>22 && Math.abs(dx)>Math.abs(dy)*1.5){ press.swiped=true; if (dx<0&&E.invTop<pages-1){ E.invTop++; M.sfx('page'); } else if (dx>0&&E.invTop>0){ E.invTop--; M.sfx('page'); } } }
function dropDrag(id,x,y){ if (!canDrag()||invList().indexOf(id)<0) return; E.pop=null;
  if (y<SH){ var wx=x+Math.round(E.camX), hs=E.hotspotAt(wx,y); if (!hs) return; E.pending=null; E.actionTok(); E.setLastClick([wx,y]); E.doVerb('use',hs,id); return; }
  var u=uiAt(x,y); if (u&&u[0]==='i'){ var other=invList()[+u.slice(2)]; if (other&&other!==id){ E.pending=null; E.doItem('use',id,other); } } }
var lastExit=null, lastTapT=-1e9, tapStartR=0;
function nowR(){ try{ return performance.now(); }catch(e){ return Date.now(); } }
// Antwortliste (Touch-Konzept T04): Ein Tipp, der vor oder bis 450 ms nach dem Erscheinen der Liste beginnt, wählt nichts – kein Doppeltipp wählt ungelesen
var DLG_LOCK=450; function dlgLocked(){ var D=E.dlg; return !!(D && D.atR!==undefined && tapStartR < D.atR + DLG_LOCK); }
M.dlgLocked=function(startR){ var D=E.dlg; return !!(D && D.atR!==undefined && (startR===undefined?nowR():startR) < D.atR + DLG_LOCK); };
// Figurenwechsel gesperrt (Touch-Konzept T08): kurz sagen, warum – ohne Hinweis auf die Geschichte
function switchWhy(){ if (E.busy||E.transitioning) return 'Gerade nicht – die Szene läuft.'; if (E.dlg) return 'Erst das Gespräch beenden.'; if (E.overlay) return 'Erst schließen.'; return 'Hier geht das gerade nicht.'; }
function swOffered(){ var gs=GS(); return !!(gs.malaOn && !gs.flags['mala.unknown'] && !gs.flags['mala.noSwitch'] && !gs.flags['split.afterIvka.away']); }
function trySwitch(){ if (E.canSwitch()){ E.switchChar(); return true; } E.msg={t:switchWhy(),until:E.gt()+2400}; M.sfx('nope'); return false; }
M.DBL_MS=M.DBL_MS||350;   // Doppelklick-Fenster in ms (300–400 sinnvoll)
async function click(x,y){ var now0=E.gt(), prevTap=lastTapT; lastTapT=now0;
  if (M.shell && (E.menu || E.screen==='title')) return;
  if (E.menu){ var u=uiAt(x,y); if (u&&u[0]==='m'){ var it=menuItems()[+u.slice(2)]; if (!it.dis){ M.sfx('click'); it.a(); } } else { E.menu=null; E.paused(false); } return; }
  if (E.screen==='title'){ var ut=uiAt(x,y); if (ut&&ut[0]==='t'){ var o=titleItems()[+ut.slice(2)]; if (o&&!o.dis){ M.sfx('click'); o.a(); } } else if (E.titleMode==='about') E.titleMode='main'; return; }
  if (E.screen==='card'){ if (!E.card.noSkip) E.closeCard(); return; }
  if (E.screen==='credits'){ if (E.gt()-E.creditsAt>3000) creditsDone(); return; }
  if (E.screen!=='game') return;
  var ov=E.overlay;
  if (ov){ if (ov.kind==='map'){ var um=uiAt(x,y); M.mapTap(ov,um&&um.slice(0,2)==='o:'?um.slice(2):null); return; }
    if (ov.kind==='notebook'){ await notebookTap(x,y); return; }
    if (OVTAP[ov.kind]){ var uo=uiAt(x,y); OVTAP[ov.kind](ov,uo&&uo.slice(0,2)==='o:'?uo.slice(2):null); return; }
    if (ov.kind==='memory'){ var n=(ov.data.lines||[]).length; if (ov.step<n-1){ ov.step++; M.sfx('shimmer'); } else E.closeOverlay(); return; }
    if (ov.kind==='puzzle'){ var u2=uiAt(x,y); if (!u2) return; if (u2==='zx'){ E.closeOverlay(null); return; } if (u2==='zgo'){ var gap=ov.sel.indexOf(-1); if (gap>=0){ ov.bad=gap; ov.msg='Da fehlt noch etwas.'; M.sfx('nope'); return; } var res=ov.data.check?ov.data.check(ov.sel):{ok:true}; if (res&&res.ok){ E.closeOverlay(ov.sel.slice()); } else { ov.bad=res?res.bad:-1; ov.msg=res&&res.msg; M.sfx('nope'); } return; }
      if (u2[0]==='z'){ var zi=+u2.slice(2); ov.sel[zi]=(ov.sel[zi]<0?0:(ov.sel[zi]+1)%ov.data.slots[zi].length); ov.bad=-1; ov.msg=null; M.sfx('page'); } return; }
    E.closeOverlay(); return; }
  if (E.speech && (E.busy||E.dlg)){ if (E.gt()-E.speech.at>200 && now0-prevTap>M.DBL_MS) E.endSpeech(); return; }   // der zweite Tipp eines Doppeltipps überspringt keinen Satz
  if (E.dlg){ var ud=uiAt(x,y), D=E.dlg; if (!ud) return; if ((ud==='cx'||ud[0]==='c'&&ud[1]===':') && dlgLocked()) return; if (ud==='cx'){ var bi=dlgBye(); if (bi>=0) E.chooseDone(bi); return; } if (ud==='cu'){ D.top=Math.max(0,D.top-1); return; } if (ud==='cd'){ D.top=Math.min(D.opts.length-1,D.top+1); return; } if (ud[0]==='c'){ M.sfx('click'); E.chooseDone(+ud.slice(2)); } return; }
  var uiH=uiAt(x,y);
  if (E.pop && E.pop.hs && lastExit && now0-lastExit.t<=M.DBL_MS && lastExit.key===E.exitKey(E.pop.hs) && !E.busy){ var hp=E.pop.hs; lastExit=null; E.pop=null; E.actionTok(); E.doVerb(isG()&&hp.gexit?'pass':'walk',hp); return; }   // zweiter Tipp eines Doppeltipps auf einen Ausgang mit Menü
  if (E.pop){ var pr=popAt(x,y); if (pr!==null){ if (pr>=0){ M.sfx('click'); popPick(E.pop,E.pop.opts[pr]); } return; } E.pop=null; if (!uiH || y<SH) { if (y<SH) return; } }
  if (uiH==='notes'){ if (!E.busy) E.openNotes(); return; }
  if (uiH==='reveal'){ reveal={at:E.gt()}; M.sfx('click'); return; }
  if (uiH==='menu'){ E.menu=true; E.paused(true); if (M.shellSync) M.shellSync(); return; }
  if (uiH==='map'){ M.sfx('click'); if (M.toggleMap) M.toggleMap(); return; }
  if (uiH==='sw'){ trySwitch(); return; }
  if (uiH==='up'){ if (E.invTop>0){ E.invTop--; M.sfx('page'); } return; }
  if (uiH==='dn'){ var pages=Math.ceil(invList().length/INV_N); if (E.invTop<pages-1){ E.invTop++; M.sfx('page'); } return; }
  if (E.busy) return;
  if (uiH && uiH[0]==='i'){ var id=invList()[+uiH.slice(2)]; if (!id) return; if (E.invNew===id) E.invNew=null;
    if (E.pending && E.pending!==id){ var p0=E.pending; E.pending=null; E.doItem('use',p0,id); return; }
    if (E.pending===id){ E.pending=null; return; }
    var opts=itemOpts(id);
    // Finger (T07): ein Tipp wählt den Gegenstand („Benutze … mit …“), Ansehen und die übrigen Handlungen stehen in der Aktionsleiste; nur eine Handlung: gleich ausführen
    if (pointer.touch && M.barOn && M.barOn()){ if (opts[0].pend){ E.pending=id; E.pendTouch=id; M.sfx('click'); return; } if (opts.length===1){ E.doItem(opts[0].v,id); return; } }
    var sx=INV_X+((+uiH.slice(2))%INV_N)*SLOT_W+SLOT_W/2; if (WIDE) sx=Math.round((WIDE.inv.x+WIDE.inv.aw+((+uiH.slice(2))%INV_N)*WIDE.inv.sw+WIDE.inv.sw/2-WIDE.sx)*WIDE.n/WIDE.m);
    openPop({title:M.ITEMS[id].name,opts:opts,item:id,x:sx,y:INV_Y}); return; }
  if (y>=SH) return;
  if (now0<(E.sceneBlockUntil||0)) return;   // gleich nach einem Ortswechsel: ein nachgereichter Klick wirkt nicht im neuen Raum
  var wx=x+Math.round(E.camX), hs=E.hotspotAt(wx,y), fing=pointer.touch&&!noFang;
  // Touch-Konzept T01: Ein Fingertipp knapp neben ein Ding gilt diesem Ding (Fangradius ≈ 20 CSS-px); liegen zwei fast gleich nah, fragt das Spiel nach
  if (!hs && fing){ var nr=E.hotspotNear(wx,y,fangR());
    if (nr.length===1 || (nr.length>1 && nr[1].d-nr[0].d>=3)){ hs=nr[0].hs; snapFx={hs:hs,at:E.gt()}; }
    else if (nr.length>1){ tapMark={x:x,y:y,at:E.gt()}; openPop({title:'Welches?',opts:nr.slice(0,3).map(function(c){ return {t:E.nameOf(c.hs),pick:c.hs}; }),pickFrom:true,x:x,y:y,pend:E.pending}); return; } }
  // dichte Stellen: Liegt ein viel kleineres Ding im Fangradius des getroffenen, fragt das Spiel nach (sonst verdeckt ein großes Ding die kleinen daneben)
  // schmale Dinge (eine Seite < 8 Spielpixel, etwa gestapelte Schubladen): liegt ein anderes Ding höchstens 3 Spielpixel neben dem Finger, fragt das Spiel ebenfalls
  if (hs && fing && hsThin(hs)){ var nt=E.hotspotNear(wx,y,3).filter(function(c){ return c.hs!==hs; });
    if (nt.length){ tapMark={x:x,y:y,at:E.gt()}; openPop({title:'Welches?',opts:[hs].concat(nt.slice(0,2).map(function(c){ return c.hs; })).map(function(h){ return {t:E.nameOf(h),pick:h}; }),pickFrom:true,x:x,y:y,pend:E.pending}); return; } }
  if (hs && fing){ var aH=hsArea(hs), nb=E.hotspotNear(wx,y,fangR()).filter(function(c){ return c.hs!==hs && c.d>0 && hsArea(c.hs)*4<=aH; });
    if (nb.length){ tapMark={x:x,y:y,at:E.gt()}; openPop({title:'Welches?',opts:[hs].concat(nb.slice(0,2).map(function(c){ return c.hs; })).map(function(h){ return {t:E.nameOf(h),pick:h}; }),pickFrom:true,x:x,y:y,pend:E.pending}); return; } }
  if (fing) tapMark={x:x,y:y,at:E.gt()};
  actOnHs(hs,x,y,wx,now0,null); }
function hsArea(h){ var r=E.hsRect(h); return r?r[2]*r[3]:1e9; }
function hsThin(h){ var r=E.hsRect(h); return !!r && Math.min(r[2],r[3])<8; }
// Fangradius in Spielpixeln: etwa 20 CSS-px, je nach Maßstab 4–12 Spielpixel
function fangR(){ var s=(M.sceneScale&&M.sceneScale())||2; return Math.max(4,Math.min(12,20/s)); }
// Kandidat aus der Nachfrage gewählt: wie ein Tipp auf dieses Ding (mit einer gewählten Gegenstand: benutzen)
function pickHs(hs,po){ var wx=po.x+Math.round(E.camX); if (po.pend){ E.actionTok(); E.setLastClick([wx,po.y]); E.doVerb('use',hs,po.pend); return; } actOnHs(hs,po.x,po.y,wx,E.gt(),null,true); }
function actOnHs(hs,x,y,wx,now0,unused,picked){
  if (E.pending){ var pid=E.pending; E.pending=null; if (hs){ E.actionTok(); E.setLastClick([wx,y]); E.doVerb('use',hs,pid); } return; }
  if (!hs){ E.actionTok(); E.walkPlayerTo(wx,y); return; }
  E.setLastClick([wx,y]);
  var ex=uiExit(hs);
  var opts2=hsOpts(hs);
  if (!opts2){ if (ex){ var key=E.exitKey(hs);
      if (lastExit&&lastExit.key===key&&now0-lastExit.t<=M.DBL_MS){ lastExit=null; E.skipExitWalk(key); return; }   // Doppelklick: Rest des Weges überspringen, keine zweite Prüfung
      lastExit={key:key,t:now0}; dblTip(hs); E.actionTok(); E.doVerb(isG()&&hs.gexit?'pass':'walk',hs); return; }
    // reiner Blickfang: einfach ansehen
    E.actionTok(); E.doVerb('look',hs); return; }
  if (ex){ var key2=E.exitKey(hs); if (lastExit&&lastExit.key===key2&&now0-lastExit.t<=M.DBL_MS){ lastExit=null; E.pop=null; E.actionTok(); E.doVerb(isG()&&hs.gexit?'pass':'walk',hs); return; } lastExit={key:key2,t:now0}; }   // Doppeltipp auf einen Ausgang mit Menü: hindurch
  openPop({title:E.nameOf(hs),opts:opts2,hs:hs,x:x,y:y}); }
// Aktionsleiste (07_bar.js, Touch-Konzept C2/C3/D1): was die HTML-Leiste zeigen soll und was ihre Knöpfe tun. Dieselben Handlungen wie im Menü am Zeiger.
function barGeo(){ if (WIDE){ var L=WIDE, I=L.inv; return {wide:true, row:L.mode==='rails'?[L.rail,L.S0,L.W-2*L.rail,L.H-L.S0]:[0,L.S0+12,L.W,L.H-L.S0-12], scB:L.S0, slot:function(i){ return [I.x+I.aw+i*I.sw,I.y,I.sw-2,I.sh]; }}; }
  return {wide:false, row:[0,SH,W,H-SH], scB:SH, slot:function(i){ return [INV_X+i*SLOT_W,INV_Y,SLOT_W-2,SLOT_H]; }}; }
M.barView=function(){ if (E.screen!=='game'||E.menu||!E.room&&!E.overlay) return null;
  if (E.overlay){ var ov=E.overlay; if (!M.lastTouch()||ov.kind==='memory'||(ov.data&&(ov.data.blank||ov.data.acting))) return null; return {kind:'ovx'}; }   // „✕“ wie Esc
  var p=E.pop, g=barGeo(); if (p&&p.html){ if (p.room!==E.room||E.busy||E.speech||E.dlg) return null; return {kind:'pop',title:p.title,opts:p.opts.map(function(o){ return o.t; }),pick:!!p.pickFrom,geo:g}; }
  if (E.pending&&E.pendTouch===E.pending&&!E.busy&&!E.dlg&&!E.speech&&!drag){ var id=E.pending, idx=invList().indexOf(id), sl=idx-E.invTop*INV_N; if (idx<0) return null;
    return {kind:'item',item:id,opts:itemOpts(id).filter(function(o){ return !o.pend; }).map(function(o){ return o.t; }),slot:(sl>=0&&sl<INV_N)?g.slot(sl):null,geo:g}; }
  return null; };
M.barAct=function(a,k){ if (a==='ovx'){ if (E.overlay) escape(); return; }
  if (a==='pop'){ var p=E.pop; if (!p||!p.html||!p.opts[k]) return; M.sfx('click'); popPick(p,p.opts[k]); return; }
  if (a==='popx'){ E.pop=null; return; }
  if (a==='item'){ var id=E.pending; if (!id||E.busy) return; var o=itemOpts(id).filter(function(x){ return !x.pend; })[k]; if (!o) return; E.pending=null; M.sfx('click'); E.doItem(o.v==='use2'?'use2':o.v,id); return; }
  if (a==='itemx'){ E.pending=null; return; } };
// Rechtsklick (UI-Konzept B1-15): hebt Ziehen, Verb-Menü oder Gegenstandswahl auf, sonst „Schau an“ – zusätzlich zum Antippen, nie als einziger Weg
M.rightClick=function(x,y){ if (M.audioInit) M.audioInit(); if (E.screen!=='game'||E.menu||E.overlay) return; if (drag){ drag=null; return; } if (E.pop){ E.pop=null; return; } if (E.pending){ E.pending=null; return; }
  if (E.busy||E.dlg||(E.room&&E.room.noVerbs)) return;
  if (y<SH){ if (now0ok()){ var wx=x+Math.round(E.camX), hs=E.hotspotAt(wx,y); if (hs){ E.actionTok(); E.setLastClick([wx,y]); E.doVerb('look',hs); } } return; }
  var u=uiAt(x,y); if (u&&u[0]==='i'){ var id=invList()[+u.slice(2)]; if (id){ if (E.invNew===id) E.invNew=null; E.doItem('look',id); } } };
function now0ok(){ return E.gt()>=(E.sceneBlockUntil||0); }
// Mausrad (UI-Konzept D10): blättert Antwortlisten, Notizbuchseiten und das Inventar
M.wheel=function(dy){ if (E.screen!=='game'||E.menu||!dy) return; var s=dy>0?1:-1;
  if (E.dlg){ var d=E.dlg; if (s>0 && !(d.lay&&d.lay.dn)) return; d.top=Math.max(0,Math.min(d.opts.length-1,d.top+s)); return; }
  if (E.overlay){ if (E.overlay.kind==='notebook'){ var p0=NB.page; NB.page=Math.max(0,NB.page+s); if (NB.page!==p0) M.sfx('page'); } return; }
  if (!E.busy){ var pages=Math.max(1,Math.ceil(invList().length/INV_N)), t=Math.max(0,Math.min(pages-1,E.invTop+s)); if (t!==E.invTop){ E.invTop=t; M.sfx('page'); } } };
// einmalige Erklärung, beim ersten längeren Weg zu einem Ausgang (pro Gerät, nicht im Spielstand)
function dblTip(hs){ var seen=false; try{ seen=localStorage.getItem('mala.dblTip')==='1'; }catch(e){} if (seen||M.TEST) return; var p=E.player(), st=E.hsStand?E.hsStand(hs):null; if (!p||!st||Math.abs(p.x-st[0])+Math.abs(p.y-st[1])<50) return;
  try{ localStorage.setItem('mala.dblTip','1'); }catch(e){} E.msg={t:pointer.touch?'Zweimal schnell auf einen Ausgang tippen: Ich gehe sofort hinaus.':'Doppelklick auf einen Ausgang: Ich gehe sofort hinaus.',until:E.gt()+4200}; }
// Esc schließt nur die oberste Ebene (UI-Konzept B1-5): Ziehen → Overlay → Menü → Verb-Menü → gewählter Gegenstand; erst ohne offene Ebene öffnet Esc die Pause
function escape(){ if (drag){ drag=null; return; }
  if (E.overlay&&E.overlay.kind==='map'){ if (!E.overlay.data.acting) M.closeMap(); return; }
  if (E.overlay){ E.closeOverlay(null); return; }
  if (E.menu){ E.menu=null; E.paused(false); if (M.shellSync) M.shellSync(); return; }
  if (E.pop){ E.pop=null; return; }
  if (E.pending){ E.pending=null; return; }
  if (E.screen==='game'){ E.menu=true; E.paused(true); if (M.shellSync) M.shellSync(); } }
M.escape=escape;
// Würde Esc jetzt die Pause öffnen (nichts anderes offen)? Nur dann darf gehaltenes Esc den Schnellvorlauf starten (99_main.js)
M.escWouldPause=function(){ return !drag && !E.overlay && !E.menu && !E.pop && !E.pending && E.screen==='game'; };
// Antwortlisten per Tastatur (UI-Konzept D10): Ziffern 1–9 wählen eine sichtbare Zeile, ↑/↓ bewegen die Auswahl, Enter bestätigt
function dlgKey(k){ var d=E.dlg; if (!d||E.speech) return false; if (d.visTop!==d.top) M.renderFrame();   // nach dem Blättern erst neu auslegen
  var vis=d.vis||[], n=d.opts.length;
  if (/^[1-9]$/.test(k)){ var i=vis[+k-1]; if (i!==undefined){ M.sfx('click'); E.chooseDone(i); } return true; }
  if (k==='ArrowDown'||k==='ArrowUp'){ var up=k==='ArrowUp'; if (d.kf===undefined||d.kf===null) d.kf=vis.length?vis[0]:d.top; else d.kf=Math.max(0,Math.min(n-1,d.kf+(up?-1:1)));
    if (d.kf<d.top) d.top=d.kf; else if (vis.length && d.kf>vis[vis.length-1]) d.top=Math.min(n-1,d.top+1); return true; }
  if ((k==='Enter'||k===' ') && d.kf!==undefined && d.kf!==null){ M.sfx('click'); E.chooseDone(d.kf); return true; }
  return false; }
M.key=function(k){ var kl0=String(k).toLowerCase(); if (M.audioInit) M.audioInit(); if (M.shellSync) M.shellSync();
  if (M.shell && M.shell.ctx==='title'){ if (k==='Escape') M.shell.back(); return; }
  if (E.screen==='card'){ if ((k===' '||k==='Enter'||k==='Escape') && E.card && !E.card.noSkip) E.closeCard(); return; }   // Karte: auch per Taste überspringen (D2)
  if (E.screen==='credits'){ if ((k===' '||k==='Enter'||k==='Escape') && E.gt()-E.creditsAt>3000) creditsDone(); return; }
  if (E.screen==='title'){ if (k==='Escape' && E.titleMode && E.titleMode!=='main') E.titleMode=E.titleMode==='confirm'?'slots':'main'; return; }
  if (k==='Escape'){ escape(); return; }
  if (E.screen!=='game'||E.menu) return; if (E.dlg && dlgKey(k)) return; if (k===' '||k==='Enter'){ if (E.speech) E.endSpeech(); return; }
  if (kl0==='k' && E.overlay && E.overlay.kind==='map'){ M.toggleMap(); return; }
  if (kl0==='k' && !E.overlay && !E.dlg){ M.toggleMap(); return; }   // K: Karte (meldet selbst, wenn sie gerade nicht geht)
  if (E.overlay||E.dlg||E.busy) return; var kl=k.toLowerCase(); if (k==='Tab'||kl==='m'){ if (swOffered()) trySwitch(); } else if (kl==='n'){ E.openNotes(); } else if (kl==='z'||kl==='r'){ reveal={at:E.gt()}; } };
})(M);
