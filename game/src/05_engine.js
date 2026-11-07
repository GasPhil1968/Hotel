/* ===== 05_engine.js — Spielstand, Räume, Figuren, Wegfindung, Marko/Mala-Wechsel, Geister, Skript-API, Dialoge, Notizbuch =====
   Marko ist lebendig: er nimmt, benutzt, öffnet, redet mit Lebenden. Mala ist ein Geist: sie geht durch Wände,
   sieht Verborgenes, spürt Nachhall, spricht mit Geistern, lauscht Lebenden. Sie ist an Marko gebunden. */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf, A_=M.ANIMS;
var W=320, H=200, SH=144;
M.W=W; M.H=H;
M.ROOMS={}; M.ART={}; M.ITEMS={}; M.COMBOS={}; M.NOTES={}; M.DEDUCE={}; M.OVERLAYS={}; M.PHASES={}; M.MAPLOCS=[];
M.defineArt=function(id,def){ def.id=id; M.ART[id]=def; return def; };
M.defineRoom=function(def){ def.width=def.width||W; def.hotspots=def.hotspots||[]; def.byId={}; def.hotspots.forEach(function(h){ def.byId[h.id]=h; h.room=def.id; }); M.ROOMS[def.id]=def; return def; };
M.defineItems=function(o){ Object.keys(o).forEach(function(k){ if (M.ITEMS[k]) throw new Error('Gegenstand doppelt: '+k); o[k].id=k; M.ITEMS[k]=o[k]; }); };
M.defineCombos=function(o){ Object.keys(o).forEach(function(k){ M.COMBOS[k]=o[k]; }); };
M.defineNotes=function(o){ Object.keys(o).forEach(function(k){ if (M.NOTES[k]) throw new Error('Notiz doppelt: '+k); var v=o[k]; M.NOTES[k]=typeof v==='string'?{t:v}:v; M.NOTES[k].id=k; }); };
M.defineDeductions=function(o){ Object.keys(o).forEach(function(k){ M.DEDUCE[k]=o[k]; }); };
M.defineOverlay=function(k,fn){ M.OVERLAYS[k]=fn; };
M.definePhases=function(o){ Object.keys(o).forEach(function(k){ M.PHASES[k]=o[k]; }); };

// ---------------------------------------------------------------- Spielstand
function freshGame(){ return { v:1, phase:'pro', tod:'day', active:'marko', malaOn:false, pos:{marko:{room:null,x:160,y:120,f:'R'},mala:{room:null,x:150,y:120,f:'R'}},
  flags:{}, inv:[], notes:[], noteNew:{}, rooms:{}, seen:{}, cyc:{}, playMs:0, map:{}, mapKnown:{}, hints:{}, ended:false }; }
M.freshGame=freshGame;
var GS=freshGame(); M.GS=GS;
var room=null, S={};
function RS(id){ var r=M.ROOMS[id]; if (!r) throw new Error('kein Raum '+id); if (!GS.rooms[id]) GS.rooms[id]=r.state?r.state(GS):{}; return GS.rooms[id]; }
M.RS=RS;
M.E={}; var E=M.E;   // geteilter Engine-Zustand für die UI-Datei
E.get=function(){ return {room:room,S:S,GS:GS}; };

// ---------------------------------------------------------------- Bildspeicher
var bg=null, layers=[], dirty=true;
function rebuild(){ if (!room) return; var tod=todOf(); bg=room.paint(S,GS,tod); layers=room.layers?room.layers(S,GS,tod):[]; dirty=false; }
function todOf(){ return (room && room.tod) ? (typeof room.tod==='function'?room.tod(GS):room.tod) : GS.tod; }
M.todOf=todOf;

// ---------------------------------------------------------------- Wegfindung (2-px-Raster, A*, String-Pulling), je Figur eine Karte
var NW=160, NH=72, navs={marko:null,mala:null}, navDirty=true;
function walkFor(who){ return function(x,y){ if (!room||!room.walk) return false; if (x<0||y<0||x>=room.width||y>=SH) return false; var m=!!room.walk(x,y,S,GS); if (who==='mala' && !m && room.walkG) m=!!room.walkG(x,y,S,GS); return m; }; }
function buildNav(){ NW=Math.ceil(room.width/2); ['marko','mala'].forEach(function(w){ var f=walkFor(w), n=new Uint8Array(NW*NH); for (var j=0;j<NH;j++) for (var i=0;i<NW;i++) n[j*NW+i]=f(i*2+1,j*2+1)?1:0; navs[w]=n; }); navDirty=false; }
function cellOk(n,i,j){ return i>=0&&j>=0&&i<NW&&j<NH&&n[j*NW+i]===1; }
function nearestCell(n,x,y){ var ci=Math.floor(x/2), cj=Math.floor(y/2); if (cellOk(n,ci,cj)) return [ci,cj];
  for (var r=1;r<160;r++) for (var dj=-r;dj<=r;dj++) for (var di=-r;di<=r;di++){ if (Math.max(Math.abs(di),Math.abs(dj))!==r) continue; if (cellOk(n,ci+di,cj+dj)) return [ci+di,cj+dj]; } return [ci,cj]; }
function nearestPoint(who,x,y){ if (navDirty) buildNav(); if (walkFor(who)(x,y)) return [x,y]; var c=nearestCell(navs[who],x,y); return [c[0]*2+1,c[1]*2+1]; }
M.nearestPoint=nearestPoint;
function los(n,ax,ay,bx,by){ var d=Math.max(Math.abs(bx-ax),Math.abs(by-ay)); for (var k=0;k<=d;k++){ var t=d?k/d:0, x=ax+(bx-ax)*t, y=ay+(by-ay)*t; if (!cellOk(n,Math.floor(x/2),Math.floor(y/2))) return false; } return true; }
function Heap(){ this.a=[]; }
Heap.prototype.push=function(p,v){ var a=this.a; a.push([p,v]); var i=a.length-1; while (i>0){ var j=(i-1)>>1; if (a[j][0]<=a[i][0]) break; var t=a[i]; a[i]=a[j]; a[j]=t; i=j; } };
Heap.prototype.pop=function(){ var a=this.a, top=a[0], last=a.pop(); if (a.length){ a[0]=last; var i=0; for(;;){ var l=i*2+1, r=l+1, m=i; if (l<a.length&&a[l][0]<a[m][0]) m=l; if (r<a.length&&a[r][0]<a[m][0]) m=r; if (m===i) break; var t=a[i]; a[i]=a[m]; a[m]=t; i=m; } } return top; };
function findPath(who,sx,sy,tx,ty){ if (navDirty) buildNav(); var n=navs[who];
  var s=nearestCell(n,sx,sy), t=nearestCell(n,tx,ty), tgt=walkFor(who)(tx,ty)?[tx,ty]:[t[0]*2+1,t[1]*2+1];
  if (los(n,sx,sy,tgt[0],tgt[1])) return [tgt];
  var N=NW*NH, g=new Float32Array(N).fill(1e9), came=new Int32Array(N).fill(-1), open=new Heap(), closed=new Uint8Array(N), si=s[1]*NW+s[0], ti=t[1]*NW+t[0];
  g[si]=0; open.push(0,si);
  while (open.a.length){ var cur=open.pop()[1]; if (cur===ti) break; if (closed[cur]) continue; closed[cur]=1; var ci=cur%NW, cj=(cur/NW)|0;
    for (var dj=-1;dj<=1;dj++) for (var di=-1;di<=1;di++){ if (!di&&!dj) continue; var ni=ci+di, nj=cj+dj; if (!cellOk(n,ni,nj)) continue; if (di&&dj&&(!cellOk(n,ci+di,cj)||!cellOk(n,ci,cj+dj))) continue;
      var k=nj*NW+ni, ng=g[cur]+(di&&dj?1.414:1); if (ng<g[k]){ g[k]=ng; came[k]=cur; open.push(ng+Math.hypot(ni-t[0],nj-t[1]),k); } } }
  if (came[ti]<0 && ti!==si) return [tgt];
  var cells=[]; for (var c=ti;c!==si&&c>=0;c=came[c]) cells.push(c); cells.reverse();
  var pts=cells.map(function(c){ return [(c%NW)*2+1,((c/NW)|0)*2+1]; }); if (pts.length) pts[pts.length-1]=tgt; else pts=[tgt];
  var out=[], cx=sx, cy=sy, i=0; while (i<pts.length){ var far=i; for (var q=pts.length-1;q>i;q--){ if (los(n,cx,cy,pts[q][0],pts[q][1])){ far=q; break; } } out.push(pts[far]); cx=pts[far][0]; cy=pts[far][1]; i=far+1; }
  return out; }
function inPoly(x,y,pts){ var c=false; for (var i=0,j=pts.length-1;i<pts.length;j=i++){ var a=pts[i], b=pts[j]; if (((a[1]>y)!==(b[1]>y)) && (x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])) c=!c; } return c; }
M.inPoly=inPoly;
// Lauffläche aus Polygonen minus Löcher (Rechtecke [x,y,w,h] oder Polygone); holes darf eine Funktion von S,GS sein
M.walkPolys=function(polys,holes){ return function(x,y,S,GS){ var ok=false; for (var i=0;i<polys.length;i++) if (inPoly(x,y,polys[i])){ ok=true; break; } if (!ok) return false;
  var hs=typeof holes==='function'?holes(S,GS):(holes||[]); for (i=0;i<hs.length;i++){ var h=hs[i]; if (typeof h[0]==='number'){ if (x>=h[0]&&x<h[0]+h[2]&&y>=h[1]&&y<h[1]+h[3]) return false; } else if (inPoly(x,y,h)) return false; } return true; }; };

// ---------------------------------------------------------------- Uhr, Timer
var gt=0, paused=false, timers=[];
function wait(ms){ return new Promise(function(r){ timers.push({t:gt+ms,r:r}); }); }
function tickTimers(){ var due=[]; for (var i=timers.length-1;i>=0;i--){ if (gt>=timers[i].t){ due.push(timers[i].r); timers.splice(i,1); } } due.forEach(function(r){ r(); }); }
E.gt=function(){ return gt; };

// ---------------------------------------------------------------- Figuren
function Actor(id,o){ this.id=id; this.ch=o.ch||id; this.x=o.x===undefined?160:o.x; this.y=o.y===undefined?120:o.y; this.f=o.f||'R'; this.mode='idle'; this.anim=null; this.fi=0; this.ft=0; this.path=[]; this.res=null; this.hooks=null;
  this.idleT=0; this.visible=o.visible!==false; this.idle=o.idle||null; this.talk=o.talk||null; this.color=o.color===undefined?(M.CAST_COLORS[this.ch]||P.s6):o.color; this.name=o.name||id;
  this.step=o.step||4; this.speed=o.speed||85; this.frozen=null; this.base=o.base||0; this.ghost=!!o.ghost; this.player=!!o.player; this.speechY=o.speechY||null; this.scale=o.scale||1; this.noShadow=!!o.noShadow||this.ghost; this.alpha=o.alpha; this.who=o.who||null; this.reveal=!!o.reveal; this.anchor=o.anchor||null; }   // reveal: Marko sieht einen Geist erst, wenn Mala ihn gefunden hat (A.found)
var ACT={}; M.ACT=ACT;
function player(){ return ACT[GS.active]; }
E.player=player;
// Mala hält inne, wenn ein Fährhorn oder eine Glocke im Raumklang ertönt, und dreht sich zum Geräusch (nicht blockierend)
var REACT_EV=/^(horn|hornNear|bellFar|bellSmall|bellBig)$/;
M.onAmbient=function(name,p){ if (!REACT_EV.test(name)) return; var a=ACT.mala; if (!a||!GS.malaOn||!a.visible) return; var now=gt; if (now-(E.lastReact||-1e9)<14000) return;
  setTimeout(function(){ if (!ACT.mala||ACT.mala!==a||a.mode!=='idle'||E.busy||E.dlg||E.overlay||E.screen!=='game') return; E.lastReact=gt; if (p<-0.25) a.f='L'; else if (p>0.25) a.f='R'; playAnimOn(a,'look'); },500); };
function charAnim(a,name){ var ch=M.CHARS[a.ch]; return (ch&&ch.anims&&ch.anims[name])||A_[name]; }
function idleSetFor(a){ if (a.idle){ var an=charAnim(a,a.idle); if (an) return an; } if (a.ghost && a.id==='mala') return a.f==='F'?A_.floatF:(a.f==='B'?A_.idleB:A_.floatS); return a.f==='F'?A_.idleF:(a.f==='B'?A_.idleB:A_.idleS); }
function setIdle(a){ a.mode='idle'; a.anim=idleSetFor(a); a.fi=0; a.ft=0; a.idleT=0; }
function cancelRes(a){ if (a.res){ var r=a.res; a.res=null; r(false); } }
function walkActor(a,x,y){ cancelRes(a); var who=a.id==='mala'?'mala':'marko'; var p=nearestPoint(who,x,y);
  if (Math.abs(p[0]-a.x)<2&&Math.abs(p[1]-a.y)<2){ a.x=p[0]; a.y=p[1]; if (a.mode==='walk') setIdle(a); return Promise.resolve(true); }
  a.path=findPath(who,a.x,a.y,p[0],p[1]); if (a.mode!=='walk'){ a.mode='walk'; a.fi=0; a.ft=0; } a.frozen=null;
  return new Promise(function(r){ a.res=r; }); }
function playAnimOn(a,name,hook,hold){ var an=charAnim(a,name); if (!an){ if (hook) hook(); return Promise.resolve(); } cancelRes(a);
  a.mode='anim'; a.anim=an; a.fi=0; a.ft=0; a.hold=!!hold; a.frozen=null; a.hooks={i:M.CONTACT[name]===undefined?-1:M.CONTACT[name],fn:hook,done:false};
  var v=an[0][0].v; if (v==='S'&&(a.f==='F'||a.f==='B')) a.f='R'; if (v==='B') a.f='B'; if (v==='F') a.f='F';
  if (a.hooks.i===0&&hook){ a.hooks.done=true; hook(); }
  return new Promise(function(r){ a.res=r; }); }
function faceOn(a,f){ if (!a||a.f===f) return Promise.resolve(); a.f=f; if (a.mode!=='anim'&&a.mode!=='walk') setIdle(a); return Promise.resolve(); }
function updateActor(a,dt){ if (a.frozen) return;
  if (a.mode==='walk'){ a.ft+=dt; var spd=a.speed;
    while (a.ft>=spd && a.mode==='walk'){ a.ft-=spd; var tg=a.path[0]; if (!tg){ arrive(a); break; }
      var dx=tg[0]-a.x, dy=tg[1]-a.y, side=Math.abs(dx)>=Math.abs(dy)*0.8, step=side?a.step:2.4, dist=side?Math.abs(dx):Math.abs(dy);
      if (dist<=0.01 && Math.hypot(dx,dy)>0.01){ step=Math.hypot(dx,dy); }
      a.f=side?(dx<0?'L':'R'):(dy<0?'B':'F');
      var d2=Math.hypot(dx,dy); if (d2<=step){ a.x=tg[0]; a.y=tg[1]; a.path.shift(); if (!a.path.length){ arrive(a); break; } } else { var k=step/d2; a.x+=dx*k; a.y+=dy*k; }
      a.fi=(a.fi+1)%8; if ((a.fi===0||a.fi===4) && !a.ghost && a.id==='marko' && room && !room.noActor) M.footstep((a.x-E.camX-160)/160); } }
  else if (a.mode==='anim'){ a.ft+=dt; var an=a.anim;
    while (a.mode==='anim' && a.ft>=an[a.fi][1]){ a.ft-=an[a.fi][1]; a.fi++;
      if (a.hooks&&!a.hooks.done&&a.fi===a.hooks.i){ a.hooks.done=true; if (a.hooks.fn) a.hooks.fn(); }
      if (a.fi>=an.length){ if (a.hooks&&!a.hooks.done&&a.hooks.fn){ a.hooks.done=true; a.hooks.fn(); } var last=an[an.length-1][0]; setIdle(a); if (a.hold){ a.frozen=last; a.hold=false; } var r=a.res; a.res=null; if (r) r(true); break; } } }
  else { var talking=E.speech && E.speech.who===a.id, set;
    if (talking){ var tn=a.talk?charAnim(a,a.talk):null; set=tn||(a.f==='B'?idleSetFor(a):(a.f==='F'?A_.talkF:A_.talkS)); if (a.idle && /sit|mend|cards|guitar/.test(a.idle) && !tn){ set=charAnim(a,'sitTalk')||idleSetFor(a); } }
    else set=idleSetFor(a);
    if (a.anim!==set){ a.anim=set; a.fi=0; a.ft=0; }
    a.ft+=dt; a.idleT+=dt; var guard=0; while (a.ft>=a.anim[a.fi][1] && guard++<50){ a.ft-=a.anim[a.fi][1]; a.fi=(a.fi+1)%a.anim.length; }
    if (a.routine && !a.player) routineTick(a);
    // Mala folgt Marko, wenn sie nicht gespielt wird
    // nicht, wenn sie sitzt oder die Szene sie festhält (Bank an der Riva, Sustipan, Busbahnhof)
    if (a.id==='mala' && GS.active==='marko' && GS.malaOn && ACT.marko && !E.busy && room && !room.noFollow && !GS.flags['mala.lock'] && !(a.idle && /sit/.test(a.idle))){ var mk=ACT.marko, tx=mk.x+(mk.f==='L'?18:-18), ty=mk.y-2;
      if (Math.hypot(a.x-tx,a.y-ty)>34 && a.mode==='idle'){ walkActor(a,tx,ty); } } } }
function arrive(a){ a.mode='idle'; setIdle(a); var r=a.res; a.res=null; if (r) r(true); }
// ---------------------------------------------------------------- Erkenntnis eines Geistes: die Gestalt wird für 5 s instabil und fängt sich wieder
// Phasen: 0–0,8 s Erstarren (Augen weit, Mund offen, kleiner Ruck), 0,8–2,6 s Flackern und Wabern, 2,6–3,6 s Höhepunkt, 3,6–5 s Stabilisieren.
// Danach blickt der Geist traurig (Stimmung 'sad'). Zeichnen: 06_ui.js (drawRealize), Klang: 04_audio.js ('realize').
var REAL_MS=5000;
function playGhostRealization(id,onComplete){ var a=ACT[id], fin=false;
  return new Promise(function(res){
    var end=function(){ if (fin) return; fin=true;
      try{ if (a && ACT[id]===a && a.realize){ a.realize=null; a.frozen=a.realizePrev||null; a.realizePrev=null; if (!a.frozen) setIdle(a); a.rtUntil=gt+4000; a.mood='sad'; } }catch(e){ console.error(e); }
      if (onComplete){ try{ onComplete(); }catch(e){ console.error(e); } } res(); };
    try{
      if (!a || !a.ghost || GS.flags['realized.'+id]){ end(); return; }    // nur einmal je Geist; fehlt die Figur, geht es einfach weiter
      GS.flags['realized.'+id]=true;
      if (a.mode==='walk'){ cancelRes(a); a.path=[]; a.mode='idle'; setIdle(a); }
      var pose=actorPose(a); cancelRes(a); a.realizePrev=a.frozen||null; a.frozen=Object.assign({},pose,{hd:'w'}); a.realize={t0:gt,seed:Math.floor(Math.random()*997)};
      try{ M.sfx('realize'); }catch(e){}
      timers.push({t:gt+REAL_MS,r:end});
    }catch(e){ console.error(e); end(); } }); }
M.playGhostRealization=playGhostRealization; E.REAL_MS=REAL_MS;
// ---------------------------------------------------------------- Tagesablauf der Nebenfiguren: Tätigkeiten wechseln, kurze Wege, umdrehen
// Schritte: ['idle',anim|null,minS,maxS] ['face',f,minS,maxS] ['anim',name] ['walk',dx,dy] (relativ zum Platz) ['home',anim] ['skip',p,n] (mit Wahrscheinlichkeit 1-p n Schritte überspringen)
function glideActor(a,x,y){ cancelRes(a); a.path=[[x,y]]; if (a.mode!=='walk'){ a.mode='walk'; a.fi=0; a.ft=0; } a.frozen=null; return new Promise(function(r){ a.res=r; }); }
function routineSteps(a){ var r=a.routine; if (typeof r==='function') r=r(S,GS,room); return (r&&r.length)?r:null; }
function routineTick(a){ if (E.busy || E.dlg || E.overlay || E.screen!=='game' || a.frozen || a.mode!=='idle' || a.rtHold) return; if (E.conv && E.conv.npc===a.id) return;
  if (gt<(a.rtUntil||0)) return; var r=routineSteps(a); if (!r){ a.rtUntil=gt+2000; return; } if (a.rtI===undefined||a.rtI>=r.length) a.rtI=0;
  var st=r[a.rtI]; a.rtI=(a.rtI+1)%r.length; var dur=function(lo,hi){ lo=lo||3; hi=hi||lo; return (lo+Math.random()*(hi-lo))*1000; }, h=a.home||[a.x,a.y,a.f];
  switch(st[0]){
    case 'idle': a.idle=st[1]||null; setIdle(a); a.rtUntil=gt+dur(st[2],st[3]); break;
    case 'face': a.f=st[1]; setIdle(a); a.rtUntil=gt+dur(st[2],st[3]); break;
    case 'anim': a.rtUntil=gt+400; playAnimOn(a,st[1]); break;
    case 'walk': a.idle=null; a.rtUntil=gt+200; glideActor(a,h[0]+st[1],h[1]+(st[2]||0)); break;
    case 'home': a.idle=null; a.rtUntil=gt+200; var an=st[1]; glideActor(a,h[0],h[1]).then(function(ok){ if (!ok) return; a.f=h[2]||a.f; if (an!==undefined) a.idle=an; setIdle(a); }); break;
    case 'skip': if (Math.random()>st[1]) a.rtI=(a.rtI+st[2])%r.length; break;
    default: a.rtUntil=gt+1000; } }
// eine Figur, die gerade angesprochen wird, bleibt stehen und unterbricht ihren Ablauf eine Weile
function holdNpc(a){ if (!a||!a.routine) return; if (a.mode==='walk'){ cancelRes(a); a.path=[]; a.mode='idle'; setIdle(a); } a.rtUntil=gt+9000; }
E.holdNpc=holdNpc;
var MOODHD={sad:'s',shock:'w'}, MOODC=new WeakMap();   // Posen sind Cache-Schlüssel (JSON), deshalb keine Zusatzfelder an ihnen
function actorPose(a){ var p=actorPose0(a); var m=a.mood&&MOODHD[a.mood]; if (!m||!p||(p.hd&&p.hd!=='n')) return p; var c=MOODC.get(p); if (!c){ c={}; MOODC.set(p,c); } return c[m]||(c[m]=Object.assign({},p,{hd:m})); }
function actorPose0(a){ if (a.frozen) return a.frozen; if (a.mode==='walk'){ var ch=M.CHARS[a.ch], anims=(ch&&ch.anims)||{};
    if (a.ghost){ var fl=a.f==='F'?A_.floatF:(a.f==='B'?A_.idleB:A_.floatS); if (a.id==='mala'){ var wS=anims.walkS||A_.walkS, wF=anims.walkF||A_.walkF, wB=anims.walkB||A_.walkB; return (a.f==='F'?wF:(a.f==='B'?wB:wS))[a.fi%8]; } return fl[0][0]; }
    var wS2=anims.walkS||A_.walkS, wF2=anims.walkF||A_.walkF, wB2=anims.walkB||A_.walkB; return (a.f==='F'?wF2:(a.f==='B'?wB2:wS2))[a.fi%8]; }
  var fr=a.anim&&a.anim[a.fi]; return fr?fr[0]:A_.idleS[0][0]; }
E.actorPose=actorPose; E.ACT=ACT;

// dunkle Räume: Marko sieht nur, was in Malas Schein oder in einem festen Licht liegt (room.dark(S,GS), room.darkLights: [[x,y,r],…])
function darkOn(){ return !!(room && room.dark && room.dark(S,GS) && GS.active==='marko'); }
function litAt(x,y){ var best=0, ma=ACT.mala; if (ma && GS.malaOn && GS.pos.mala.room===room.id && ma.visible){ var d=Math.hypot(x-ma.x,(y-(ma.y-24))*1.15); best=Math.max(best,1-d/(room.glowR||48)); }
  var L=typeof room.darkLights==='function'?room.darkLights(S,GS):(room.darkLights||[]); for (var i=0;i<L.length;i++){ var d2=Math.hypot(x-L[i][0],y-L[i][1]); best=Math.max(best,(1-d2/L[i][2])*(L[i][3]||1)); } return Math.max(0,Math.min(1,best)); }
E.darkOn=darkOn; E.litAt=litAt;
// Geister: für Marko erst sichtbar, wenn Mala sie gefunden hat
function ghostVisible(a){ if (!a.ghost||a.id==='mala') return true; if (GS.active==='mala') return true; if (a.reveal) return !!GS.flags['found.'+a.id]; return true; }
E.ghostVisible=ghostVisible;
function actorShown(a){ if (!a.visible) return false; if (a.id==='mala'){ return GS.malaOn && GS.pos.mala.room===room.id; } if (a.id==='marko') return GS.pos.marko.room===room.id && !room.noActor; return ghostVisible(a); }
E.actorShown=actorShown;

// ---------------------------------------------------------------- Sicherungspunkt für Szenen
// Läuft eine Szene (E.busy), wird beim Speichern der Stand von ihrem Beginn geschrieben, oder vom letzten A.save() darin.
// So landet beim Titelbild, beim App-Wechsel oder beim Schließen nie ein halber Ablauf im Spielstand (etwa: Handschuhe schon übergeben, Schluss noch nicht gesichert).
var busyV=false, safeGS=null;
Object.defineProperty(E,'busy',{configurable:true,enumerable:true,get:function(){ return busyV; },
  set:function(v){ v=!!v; if (v && !busyV && GS && room && !room.noSave && E.screen==='game'){ try{ syncPos(); safeGS=JSON.parse(JSON.stringify(GS)); }catch(e){} } busyV=v; }});
// ---------------------------------------------------------------- Sprechen, Overlays, Auswahl
E.speech=null; E.overlay=null; E.dlg=null; E.busy=false; E.screen='title'; E.fade=0; E.shake=0; E.card=null; E.camX=0; E.conv=null; E.msg=null; E.pick=null; E.headache=0;
var textSpeed=1, tapText=false, SPEED=[1.5,1,0.7];
try{ textSpeed=+(localStorage.getItem('mala.tspeed')||1); tapText=localStorage.getItem('mala.tap')==='1'; }catch(e){}
E.textSpeed=function(){ return textSpeed; }; E.tapText=function(){ return tapText; };
E.setText=function(sp,tap){ textSpeed=sp; tapText=tap; try{ localStorage.setItem('mala.tspeed',String(sp)); localStorage.setItem('mala.tap',tap?'1':'0'); }catch(e){} };
// Sprachfassung: wer spricht, und mit wem spricht Marko gerade? (Mit Mala spricht er Bosnisch, sonst Kroatisch)
E.trLast=null;
function trTo(w){ if (w==='marko'||w==='@marko') return (E.conv&&E.conv.npc)||((E.trLast&&gt-(E.trLastAt||0)<9000)?E.trLast:null); return null; }
function say(text,who,opt){ if (E.speech){ var prev=E.speech.res; E.speech=null; prev(); }
  var src=text, w0=who||GS.active; if (M.__speechLog) M.__speechLog.push([String(w0||''),String(src)]);   // nur Tests: wer sagt was
  if (M.lang!=='de' && M.tr){ text=M.tr(text,{who:w0,to:(opt&&opt.to!==undefined)?opt.to:trTo(w0),cat:'speech',log:true}); }
  if (M.__caps && !M.__capNext){ var ck=(w0==='marko'||w0==='@marko')&&trTo(w0)==='mala'?'marko_an_mala':String(w0||'').replace(/^@/,'')||'x'; if (ck==='#') ck='erzaehler'; if (!M.__caps[ck]) M.__capNext=ck; }   // nur Tests: erster Satz je Sprecher als Bild
  if (w0 && w0!=='marko' && w0!=='@marko' && w0!=='#' && w0!=='@'){ E.trLast=String(w0).replace(/^@/,''); E.trLastAt=gt; }
  return new Promise(function(res){ var dur=Math.max(1400,800+text.length*52)*SPEED[textSpeed]; E.speech={text:text,src:src,until:gt+dur,res:res,who:who||GS.active,at:gt,opt:opt||{}};
    var sa=ACT[E.speech.who]; if (sa && sa.id!==GS.active && E.conv && E.conv.room===room) E.conv.npc=sa.id; }); }
function endSpeech(){ if (!E.speech) return; var r=E.speech.res; E.speech=null; r(); }
E.endSpeech=endSpeech;
function showOverlay(kind,data){ return new Promise(function(res){ E.overlay={kind:kind,data:data||{},res:res,at:gt,step:0}; M.sfx('paper'); }); }
function closeOverlay(v){ if (!E.overlay) return; var r=E.overlay.res; E.overlay=null; r(v); }
E.closeOverlay=closeOverlay; E.showOverlay=showOverlay;
var faders=[];
function fadeTo(v,ms){ var from=E.fade, t0=gt; return new Promise(function(res){ faders.push({f:function(){ var k=Math.min(1,(gt-t0)/(ms||500)); E.fade=from+(v-from)*k; if (k>=1){ E.fade=v; return true; } return false; },res:res}); }); }
// Auswahl: Strings oder {t,id,silent}; liefert die id
function choose(opts,o){ o=o||{}; opts=opts.map(function(x,i){ return typeof x==='string'?{t:x,id:i}:Object.assign({id:i},x); });
  // Prüfbericht K3: Eine Auswahl liegt nie unter dem Stadtplan. Fragt eine Reiseprüfung nach (z. B. „Allein gehen / Bei ihr bleiben“),
  // schließt sich der Plan; die Auswahl bekommt die Eingaben. (Der Plan fängt sonst jeden Klick ab, solange er „unterwegs“ ist.)
  if (E.overlay && E.overlay.kind==='map'){ if (E.overlay.data) E.overlay.data.acting=false; closeOverlay(null); E.busy=true; }   // die Szene läuft weiter gesperrt; M.mapGo gibt frei
  if (o.conv!==false) convStart(null);
  var to0=trTo(GS.active);   // Sprachfassung: an wen die Antwort geht, steht fest, wenn die Auswahl aufgeht – nicht erst nach langer Bedenkzeit
  return new Promise(function(res){ E.dlg={opts:opts,res:res,top:0,title:o.title||null,free:o.free,to:to0}; }).then(async function(op){ if (!op.bye && !op.noGray) GS.seen['ask:'+op.t]=1; if (!op.silent) await say(op.t,GS.active,{to:to0}); return op.id; }); }
E.chooseDone=function(i){ var d=E.dlg; if (!d) return; E.dlg=null; d.res(d.opts[i]); };
function convStart(npc){ if (!E.conv||E.conv.room!==room) E.conv={room:room,npc:null}; if (npc && ACT[npc]) E.conv.npc=npc; }
E.convStart=convStart;

// ---------------------------------------------------------------- Notizen
function hasNote(id){ return GS.notes.indexOf(id)>=0; }
function addNote(id,quiet){ if (!M.NOTES[id]) throw new Error('unbekannte Notiz '+id); if (hasNote(id)) return false; GS.notes.push(id); if (!M.NOTES[id].show) return true; GS.noteNew[id]=1; if (!quiet){ M.sfx('note'); E.msg={t:'Neue Notiz: '+(M.NOTES[id].s||M.NOTES[id].t),until:gt+3200,note:1}; } return true; }
E.hasNote=hasNote; E.addNote=addNote;
// zwei Notizen verbinden
async function combineNotes(a,b){ var d=M.DEDUCE[a+'+'+b]||M.DEDUCE[b+'+'+a];
  if (!d){ M.sfx('nope'); return {ok:false,t:M.noCombo?M.noCombo(a,b,GS):'Das hängt nicht zusammen.'}; }
  if (typeof d==='function'){ return await d(API)||{ok:true}; }
  if (d.if && !d.if(GS)) { M.sfx('nope'); return {ok:false,t:(typeof d.no==='function'?d.no(GS):d.no)||'Da fehlt noch etwas.'}; }
  if (hasNote(d.to)) return {ok:false,t:'Das habe ich schon verstanden.'};
  addNote(d.to,true); M.sfx('deduce'); GS.flags['deduced.'+d.to]=true; if (M.onDeduce) try{ M.onDeduce(d.to,GS); }catch(e){ console.error(e); } return {ok:true,t:M.NOTES[d.to].t,to:d.to,say:d.say}; }
E.combineNotes=combineNotes;
// im Gespräch eine Notiz auswählen
// opt.also: Notizen, die in diesem Gespräch gültige Antworten sind; sie stehen zur Wahl, sobald man sie hat, auch wenn das Notizbuch sie sonst ausblendet
function pickNote(title,opt){ var also=(opt&&opt.also)||null; if (E.nbStyle && E.nbStyle()==='think' && E.pickNoteThink) return E.pickNoteThink(title,also); return new Promise(function(res){ E.overlay={kind:'notebook',data:{mode:'ask',title:title||'Wonach fragen?',also:also},res:res,at:gt,page:'notes'}; M.sfx('page'); }); }

// ---------------------------------------------------------------- Interaktions-Helfer
var lastClick=null;
function nsKey(key){ return (room?room.id:'')+':'+key; }
function firstTime(key){ var k=key.indexOf('!')===0?key.slice(1):nsKey(key); if (GS.seen[k]) return false; GS.seen[k]=1; return true; }
function cycle(key,arr){ var k=nsKey(key), i=GS.cyc[k]||0; GS.cyc[k]=(i+1)%arr.length; return arr[i%arr.length]; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function has(id){ return GS.inv.indexOf(id)>=0; }
function give(id){ if (!M.ITEMS[id]) throw new Error('unbekannter Gegenstand '+id); if (!has(id)){ GS.inv.push(id); E.invNew=id; E.invTop=Math.max(0,Math.ceil(GS.inv.length/6)-1); } M.sfx('pickup'); }
function take(id){ var i=GS.inv.indexOf(id); if (i>=0) GS.inv.splice(i,1); if (E.pending===id) E.pending=null; var pages=Math.max(1,Math.ceil(GS.inv.length/6)); if (E.invTop>=pages) E.invTop=pages-1; }
function setR(k,v){ S[k]=v; dirty=true; navDirty=true; }
function flag(k){ return GS.flags[k]; }
function setFlag(k,v){ GS.flags[k]=(v===undefined?true:v); dirty=true; navDirty=true; }
function npcHandle(id){ var a=ACT[id]; if (!a){ var nop=function(){ return Promise.resolve(); }; return { x:160,y:120,f:'F',actor:null,say:function(t){ return say(t,'@'+id,{color:M.CAST_COLORS[id]||P.s5}); },walk:nop,face:nop,anim:function(n,h){ if (h) h(); return nop(); },show:function(){},hide:function(){},place:function(){},idle:function(){},freeze:function(){},set:function(){},mood:function(){},agitate:function(){} }; }
  return { get x(){ return a.x; }, get y(){ return a.y; }, get f(){ return a.f; }, actor:a,
    say:function(t,opt){ return say(t,id,opt); }, walk:function(x,y){ a.rtUntil=gt+12000; return walkActor(a,x,y); }, face:function(f){ return faceOn(a,f); },
    routine:function(v){ if (v===false){ a.rtHold=true; } else { a.rtHold=false; if (v) a.routine=v; a.rtUntil=gt+3000; } }, home:function(x,y,f){ a.home=[x,y,f||a.f]; },
    anim:function(n,h,hold){ return playAnimOn(a,n,h,hold); }, show:function(){ a.visible=true; }, hide:function(){ a.visible=false; },
    place:function(x,y,f){ cancelRes(a); a.x=x; a.y=y; if (f) a.f=f; a.rtHold=true; setIdle(a); }, idle:function(n){ a.idle=n; setIdle(a); }, freeze:function(p){ a.frozen=p||null; }, set:function(k,v){ a[k]=v; },
    mood:function(m){ a.mood=m||null; }, agitate:function(ms){ a.agit=gt+(ms||1600); },   // Geister: Gesichtsausdruck ('sad', 'shock'), aufgewühlt (stärkeres Flimmern)
    faceMe:function(){ var p=player(); if (!p) return Promise.resolve(); return faceOn(a,p.x<a.x?'L':'R'); } }; }

// ---------------------------------------------------------------- Mala: Beitreten, Gehen, Wechseln
function malaPlaceNear(){ var mk=GS.pos.marko; var p=nearestPoint('mala',mk.x-16,mk.y-2); GS.pos.mala={room:mk.room,x:p[0],y:p[1],f:mk.f}; }
function syncPos(){ ['marko','mala'].forEach(function(k){ var a=ACT[k]; if (a && GS.pos[k].room===room.id){ GS.pos[k].x=a.x; GS.pos[k].y=a.y; GS.pos[k].f=a.f; } }); }
// nach Ivka: Mala ist bekannt, aber für Marko vorübergehend nicht wahrnehmbar – dann kommt sie nur über die Wiederkehr in der Bar zurück (o.force)
function malaJoin(o){ o=o||{}; if (GS.flags['split.afterIvka.away'] && !o.force){ E.gSuppressed=(E.gSuppressed||0)+1; return; } GS.malaOn=true; if (o.x!==undefined) GS.pos.mala={room:room.id,x:o.x,y:o.y,f:o.f||'L'}; else malaPlaceNear(); placePlayers(); var a=ACT.mala; if (a && o.fadeIn!==false){ a.fadeIn=gt; } }
function malaLeave(o){ o=o||{}; if (GS.active==='mala') switchTo('marko',true); GS.malaOn=false; var a=ACT.mala; if (a){ a.fadeOut=gt; } }
function canSwitch(){ if (!GS.malaOn||E.busy||E.dlg||E.overlay||E.screen!=='game'||GS.flags['mala.lock']||GS.flags['mala.unknown']||GS.flags['mala.noSwitch']||GS.flags['split.afterIvka.away']) return false; if (room && (room.noMala||room.noSwitch)) return false; return true; }
E.canSwitch=canSwitch;
async function switchTo(who,silent){ if (GS.active===who) return; syncPos(); GS.active=who; M.setGhostAudio(who==='mala'); if (!silent) M.sfx('whoosh');
  var target=GS.pos[who].room; if (target && target!==room.id){ await gotoRoom(target,{x:GS.pos[who].x,y:GS.pos[who].y,f:GS.pos[who].f,noEnter:true,fadeMs:250,keepPos:true}); }
  else { placePlayers(); E.switchFx=gt; }
  snapCamera();
  // Raum darf auf den Wechsel reagieren (z. B. Mala hört unten, was Marko oben ausgelöst hat): läuft direkt danach, der Wechsel wartet nicht darauf
  var rr=room; if (rr && rr.onSwitch && !E.busy){ Promise.resolve().then(async function(){ if (E.busy || room!==rr) return; E.busy=true; try{ await rr.onSwitch(API,who); } catch(e){ console.error(e); } finally{ E.busy=false; } }); } }
E.switchChar=function(){ if (!canSwitch()) return; switchTo(GS.active==='marko'?'mala':'marko'); };
E.switchTo=switchTo;

// ---------------------------------------------------------------- Skript-API
var API={
  // Sprechen: say = gerade gespielte Figur, m = Marko, g = Mala, narrate = Erzähler
  say:function(t,o){ return say(t,GS.active,o); }, m:function(t,o){ return say(t,ACT.marko?'marko':'@marko',Object.assign({color:M.CAST_COLORS.marko},o||{})); },
  // Mala spricht. Solange sie nach Ivka für Marko nicht wahrnehmbar ist, kommt keine Zeile durch – auch keine aus verzögerten Abläufen (für Tests gezählt).
  // In der Stimmenphase ist sie nur eine Stimme ohne Porträt; die steigenden Kopfschmerzen gibt es nur noch für alte Spielstände.
  g:function(t,o){ if (GS.flags['split.afterIvka.away']){ E.gSuppressed=(E.gSuppressed||0)+1; return Promise.resolve(); }
    o=Object.assign({color:M.CAST_COLORS.mala},o||{}); if (GS.flags['mala.voice'] && GS.active==='marko'){ o.voice=true; o.noPortrait=true;
      if (GS.flags['split.intro.legacy']){ GS.flags['mk.ache']=Math.min(9,(GS.flags['mk.ache']||0)+1); E.headache=gt+1500+GS.flags['mk.ache']*120; } else E.headache=Math.max(E.headache||0,gt+1200); M.sfx('static'); }
    return say(t,(ACT.mala&&actorShown(ACT.mala))?'mala':'@mala',o); },
  // die Schwelle: ein Licht, durch das Mala die Geister hinüberbringt (x,y in Weltkoordinaten, y = Fußpunkt)
  crossOpen:function(x,y,o){ o=o||{}; E.crossing={x:x,y:y,w:o.w||16,h:o.h||70,at:gt,close:0}; M.sfx('shimmer'); return API.wait(o.wait===undefined?1400:o.wait); },
  crossClose:function(){ if (E.crossing){ E.crossing.close=gt; } return API.wait(1300).then(function(){ E.crossing=null; }); },
  narrate:function(t){ return say(t,'#',{color:P.s5}); }, voice:function(t,col,x,y){ return say(t,'@',{color:col,x:x,y:y}); },
  phoneVoice:function(t,who){ return say(t,'@'+(who||'vesna'),{color:M.CAST_COLORS[who||'vesna']||P.y5,phone:1}); },
  wait:wait, face:function(f){ return faceOn(player(),f); }, walk:function(x,y){ return walkActor(player(),x,y); },
  walkM:function(x,y){ return ACT.marko?walkActor(ACT.marko,x,y):Promise.resolve(); }, walkG:function(x,y){ return ACT.mala?walkActor(ACT.mala,x,y):Promise.resolve(); },
  anim:function(n,h,hold){ return playAnimOn(player(),n,h,hold); }, animM:function(n,h,hold){ return ACT.marko?playAnimOn(ACT.marko,n,h,hold):Promise.resolve(); }, animG:function(n,h,hold){ return ACT.mala?playAnimOn(ACT.mala,n,h,hold):Promise.resolve(); },
  faceM:function(f){ return faceOn(ACT.marko,f); }, faceG:function(f){ return faceOn(ACT.mala,f); },
  sfx:function(n){ M.sfx(n); }, music:function(n){ M.music(n); }, ambient:function(n,p,v){ M.ambientEvent(n,p,v); },
  set:setR, has:has, give:give, take:take, first:firstTime, cycle:cycle, pick:pick, flag:flag, setFlag:setFlag, npc:npcHandle, R:RS,
  note:function(id,q){ return addNote(id,q); }, hasNote:hasNote, askNote:pickNote,
  choose:choose, overlay:showOverlay,
  doc:function(d){ return showOverlay('doc',d); }, memory:function(d){ M.sfx('shimmer'); return showOverlay('memory',d); }, puzzle:function(d){ return showOverlay('puzzle',d); }, arrange:function(d){ return showOverlay('arrange',d); }, halves:function(d){ return showOverlay('halves',d); }, glyphs:function(d){ return showOverlay('glyphs',d); },
  card:function(c){ return showCard(c); }, fade:function(v,ms){ return fadeTo(v,ms); }, shake:function(ms){ E.shake=ms||300; },
  goto:function(id,o){ return gotoRoom(id,o); }, unlock:function(loc){ GS.map[loc]=true; }, unlocked:function(loc){ return !!GS.map[loc]; },
  phase:function(p){ setPhase(p); }, get phaseId(){ return GS.phase; },
  found:function(id){ if (!GS.flags['found.'+id]){ GS.flags['found.'+id]=true; M.sfx('shimmer'); } }, isFound:function(id){ return !!GS.flags['found.'+id]; },
  malaJoin:malaJoin, malaLeave:malaLeave, get active(){ return GS.active; }, switchTo:function(w){ return switchTo(w,true); }, isMala:function(){ return GS.active==='mala'; },
  malaHere:function(){ return GS.malaOn && GS.pos.mala.room===room.id; },
  save:function(){ return saveGame(true); }, rebuild:function(){ dirty=true; navDirty=true; }, busy:function(v){ E.busy=v; },
  hide:function(){ var p=player(); if (p) p.visible=false; }, show:function(){ var p=player(); if (p) p.visible=true; },
  place:function(x,y,f){ var p=player(); if (!p) return; cancelRes(p); p.x=x; p.y=y; if (f) p.f=f; setIdle(p); syncPos(); },
  placeM:function(x,y,f){ GS.pos.marko.x=x; GS.pos.marko.y=y; if (f) GS.pos.marko.f=f; var a=ACT.marko; if (a){ cancelRes(a); a.x=x; a.y=y; if (f) a.f=f; setIdle(a); } },
  placeG:function(x,y,f){ GS.pos.mala.x=x; GS.pos.mala.y=y; if (f) GS.pos.mala.f=f; var a=ACT.mala; if (a){ cancelRes(a); a.x=x; a.y=y; if (f) a.f=f; setIdle(a); } },
  freezeM:function(p){ if (ACT.marko) ACT.marko.frozen=p||null; }, idleM:function(n){ if (ACT.marko){ ACT.marko.idle=n||null; setIdle(ACT.marko); } }, idleG:function(n){ if (ACT.mala){ ACT.mala.idle=n||null; setIdle(ACT.mala); } },
  menuLoop:menuLoop, endChapter:function(){ return M.endChapter(API); },
  spawn:function(o){ var a=new Actor(o.id,o); ACT[o.id]=a; setIdle(a); if (o.fadeIn!==false) a.fadeIn=gt; return npcHandle(o.id); },
  despawn:function(id){ delete ACT[id]; },
  flash:function(t){ E.msg={t:t,until:gt+2400}; },
  realize:function(id,cb){ return playGhostRealization(id,cb); },
  headache:function(ms){ E.headache=gt+(ms||2500); M.sfx('static'); },
  get S(){ return S; }, get G(){ return GS; }, get gt(){ return gt; }, get room(){ return room; }, get isBusy(){ return E.busy; }, get actor(){ return player(); }, get marko(){ return ACT.marko; }, get mala(){ return ACT.mala; }
};
M.API=API;
// Gesprächsschleife: getOpts() -> [{t, go:async fn(A), once:'key', if:bool, bye:true, silent:true, ask:fn(A,noteId)}]
async function menuLoop(getOpts){
  for (var guard=0;guard<80;guard++){
    var opts=getOpts().filter(function(o){ return o && !(('if' in o) && !o.if) && !(o.once && GS.seen['dlg:'+o.once]); });
    if (!opts.length) return;
    var i=await choose(opts.map(function(o,k){ return {t:o.t,id:k,silent:o.silent||!!o.ask,bye:!!o.bye,ask:!!o.ask,noGray:!!(o.ask||o.noGray)}; }));
    var o=opts[i]; if (o.once) GS.seen['dlg:'+o.once]=1;
    if (o.ask){ var nid=await pickNote(o.askTitle); if (nid){ var r0=await o.ask(API,nid); if (r0==='bye') return; } continue; }
    if (o.go){ var r=await o.go(API); if (r==='bye') return; }
    if (o.bye) return; }
}
// Standard-"Frag nach"-Option für eine Person: ask-Tabelle {notizId: handler}, sonst askAny
// Antworten als Text spricht das Gegenüber (vorher sprach sie die gespielte Figur, also mit falschem Porträt)
API.askOpt=function(table,fallback,label){ return {t:label||'Nach etwas aus dem Notizbuch fragen …',ask:async function(A,nid){ var h=table[nid]; if (h===undefined) h=fallback; if (typeof h==='function') return await h(A,nid);
  var line=Array.isArray(h)?pick(h):h; if (typeof line!=='string') return; var who=E.conv&&E.conv.npc; if (who && who!==GS.active && ACT[who]) return await say(line,who); return await API.say(line); }}; };

// ---------------------------------------------------------------- Hotspots, Verben
// Marko-Verben und Mala-Verben, mit Anzeige-Text
var VLABEL={look:'Schau an',take:'Nimm',use:'Benutze',open:'Öffne',push:'Schiebe',talk:'Rede mit',read:'Lies',walk:'Hingehen',give:'Gib',
  glook:'Schau an',gtalk:'Sprich mit',sense:'Spüre',listen:'Lausche',pass:'Hindurchgehen',cross:'Hinüberbringen'};
E.VLABEL=VLABEL;
var M_VERBS=['talk','take','open','use','push','read'], G_VERBS=['talk','sense','listen'];
function hsRect(h){ if (h.npc){ var a=ACT[h.npc]; if (!a||!actorShown(a)) return null; if (h.r) return typeof h.r==='function'?h.r(S,GS,a):h.r; var hh=h.hgt||48; return [Math.round(a.x)-8,Math.round(a.y)-hh,16,hh]; }
  return typeof h.r==='function'?h.r(S,GS):h.r; }
E.hsRect=hsRect; E.hsStand=function(h){ return hsStand(h); };
function hsVisible(h){ if (h.vis && !h.vis(S,GS)) return false; if (h.who==='m' && GS.active!=='marko') return false; if (h.who==='g' && GS.active!=='mala') return false; if (h.exit && GS.active==='mala' && !h.exit.gok && !h.g && !h.glook) { /* Mala sieht Ausgänge trotzdem */ } return true; }
function hsStand(h){ var isG=GS.active==='mala'; var st=isG&&h.gst!==undefined?h.gst:h.st; st=typeof st==='function'?st(S,GS):st; if (st) return st;
  if (h.npc){ var a=ACT[h.npc], p=player(); if (!a||!p) return null; var side=p.x<a.x?-1:1; return [a.x+side*(h.talkDist||24),a.y,side<0?'R':'L']; }
  if (st===null||!room||room.noActor) return null; var r=hsRect(h); if (!r) return null; var cx=r[0]+r[2]/2, p2=nearestPoint(GS.active,cx,Math.min(SH-4,r[1]+r[3]+6)), dx=cx-p2[0];
  return [p2[0],p2[1],Math.abs(dx)<14?'B':(dx<0?'L':'R')]; }
function hsLit(h,r){ if (!h.dark || !darkOn()) return true; return litAt(r[0]+r[2]/2,r[1]+r[3]/2)>0.15; }
E.hsLit=hsLit;
function hotspotAt(x,y){ var best=null, ba=1e9; room.hotspots.forEach(function(h){ if (!hsVisible(h)) return; var r=hsRect(h); if (!r) return; if (!hsLit(h,r)) return;
  if (x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]){ var a=r[2]*r[3]*(h.pri||1); if (a<ba){ ba=a; best=h; } } });
  // Mala als Ziel (für Marko: Gegenstände zeigen, mit ihr reden). Steht sie auf einer anderen Figur oder einem Ausgang, gehen diese vor.
  var ml=ACT.mala; if (GS.active==='marko' && ml && actorShown(ml)){ var r2=[Math.round(ml.x)-8,Math.round(ml.y)-46,16,46]; if (x>=r2[0]&&x<r2[0]+r2[2]&&y>=r2[1]&&y<r2[1]+r2[3]){ var a2=r2[2]*r2[3]; if (a2<ba && !(best&&(best.npc||best.exit||best.gexit))) best=MALA_HS; } }
  var mk=ACT.marko; if (GS.active==='mala' && mk && actorShown(mk)){ var r3=[Math.round(mk.x)-8,Math.round(mk.y)-48,16,48]; if (x>=r3[0]&&x<r3[0]+r3[2]&&y>=r3[1]&&y<r3[1]+r3[3]){ var a3=r3[2]*r3[3]; if (a3<ba && !(best&&(best.npc||best.exit||best.gexit))) best=MARKO_HS; } }
  return best; }
E.hotspotAt=hotspotAt;
function unmetNpc(o){ return !!(o && o.npc && o.npc!=='mala' && o.npc!=='marko' && M.INTRO && M.isMet && M.INTRO[(M.METKEY&&M.METKEY[o.npc])||o.npc] && !M.isMet(GS,o.npc)); }
E.unmetNpc=unmetNpc;
function nameOf(o){ if (!o) return ''; if (o.item) return M.ITEMS[o.item].name; var ga=o.npc&&ACT[o.npc]; if (ga && ga.ghost && GS.active!=='mala' && !ghostVisible(ga)) return o.uname||'Leere Stelle';   // ungefundener Geist: Marko sieht nur die Stelle
  if (unmetNpc(o)) return '???'; var n=(GS.active==='mala'&&o.gname)?o.gname:o.name; return typeof n==='function'?n(S,GS):n; }
E.nameOf=nameOf;
// Mala und Marko als Gesprächsziele
var MALA_HS={id:'_mala',name:function(S,G){ return G.flags['mala.unknown']?'Schimmer':'Mala'; },npc:'mala',hgt:46,talk:function(A){ return M.talkToMala?M.talkToMala(A):A.g('…'); },look:function(A){ return M.lookAtMala?M.lookAtMala(A):A.m('Mala. Durchscheinend, wenn das Licht von hinten kommt.'); }};
var MARKO_HS={id:'_marko',name:'Marko',npc:'marko',hgt:48,g:{talk:function(A){ return M.malaToMarko?M.malaToMarko(A):A.g('Er hört mich. Das reicht.'); },look:function(A){ return M.malaLooksAtMarko?M.malaLooksAtMarko(A):A.g('Er sieht müde aus. Er sieht immer müde aus.'); }}};
E.MALA_HS=MALA_HS; E.MARKO_HS=MARKO_HS;
async function respond(val,ctx){ if (val===undefined||val===null) return false; if (typeof val==='function'){ await val(API,ctx); return true; }
  if (Array.isArray(val)){ await say(cycle(ctx.key,val),GS.active); return true; } if (typeof val==='string'){ await say(val,GS.active); return true; } return false; }
async function approach(hs){ var st=hsStand(hs); if (!st) return true; var p=player(); if (!p) return true; var ok=await walkActor(p,st[0],st[1]); if (!ok) return false;
  var f=st[2]; if (!f && hs.npc){ var a=ACT[hs.npc]; if (a) f=a.x<p.x?'L':'R'; } await faceOn(p,f||p.f); return true; }
var actionTok=0;
function verbHandler(hs,v){ var isG=GS.active==='mala';
  if (isG){ var g=hs.g||{}; if (v==='look') return g.look!==undefined?g.look:hs.glook; return g[v]; }
  return hs[v]; }
E.verbHandler=verbHandler;
// Standardsätze, wenn niemand etwas Besonderes geschrieben hat
var DEF={
  m:{ look:['Nichts Besonderes.','Ich sehe es an. Es bleibt, was es ist.','Da ist nichts, was mir weiterhilft.'], take:['Das lasse ich, wo es ist.','Das brauche ich nicht.'], use:['Ich wüsste nicht, wie.','Damit kann ich nichts anfangen.'],
      open:['Das lässt sich nicht öffnen.'], push:['Es bewegt sich nicht.'], talk:['Es antwortet nicht. Zum Glück.'], read:['Da steht nichts.'],
      usewith:['Das passt nicht zusammen.','So nicht.','Damit erreiche ich nichts.'], give:['Das will hier niemand.'], itemitem:['Die beiden haben nichts miteinander zu tun.','Das ergibt nichts.'] },
  g:{ look:['Für mich ist das nur ein Ding.','Da ist nichts, das sich an etwas erinnert.','Stumm. Wie fast alles.'], talk:['Dinge antworten nicht. Nicht einmal mir.'], sense:['Da ist nichts. Kein Nachhall.','Kalt, aber leer.'], listen:['Nur das Meer.','Nichts, was gesagt wird.'],
      notouch:['Ich kann es nicht anfassen. Das weißt du.','Meine Hand geht hindurch.'], living:['Er hört mich nicht.','Sie hört mich nicht. Niemand von ihnen.'] }
};
M.DEF=DEF;
async function doVerb(v,hs,withItem){ E.acting=(E.acting||0)+1; try{ return await doVerb0(v,hs,withItem); } finally { E.acting--; } }
async function doVerb0(v,hs,withItem){ var tok=++actionTok, isG=GS.active==='mala';
  if (room.noActor){ E.busy=true; try{ if (hs.go) await hs.go(API); else await respond(verbHandler(hs,v==='walk'?'look':v),{key:hs.id+':'+v,hs:hs}); } finally { E.busy=false; } return; }
  var ex=isG?(hs.gexit||(hs.exit&&(hs.exit.gok||(M.malaFree&&M.malaFree(GS,hs)))?hs.exit:null)):hs.exit; if (typeof ex==='function') ex=ex(S,GS);   // M.malaFree: ein Kapitel lässt Mala allein durch Ausgänge (Kapitel 4)
  if (v==='walk' && ex) return takeExit(hs,ex);
  if (v==='pass' && hs.gexit) return takeExit(hs,typeof hs.gexit==='function'?hs.gexit(S,GS):hs.gexit);
  if (v==='walk' && isG && hs.exit && !ex){ E.busy=true; try{ await say(pick(['Ohne Marko komme ich nicht weit.','Dorthin gehe ich nicht ohne ihn.']),'mala'); } finally{ E.busy=false; } return; }
  if (v==='walk'){ if (lastClick && !hs.st && !hs.npc){ await walkActor(player(),lastClick[0],lastClick[1]); return; } if (hsStand(hs)) await approach(hs); return; }
  if (hs.npc && ACT[hs.npc]) holdNpc(ACT[hs.npc]);
  // QA BUG-008: während des Zudrehens (E.busy noch nicht gesetzt) kann ein Tipp aufs Porträt die Figur wechseln → Aktion verwerfen
  var gone=function(){ return tok!==actionTok || !player() || GS.active!==(isG?'mala':'marko'); };
  var ok=await approach(hs); if (!ok||gone()) return;
  if (hs.npc && ACT[hs.npc]) holdNpc(ACT[hs.npc]);
  if (hs.npc && ACT[hs.npc] && hs.npc!=='mala' && hs.npc!=='marko'){ var na=ACT[hs.npc]; if (!hs.noTurn && na.mode!=='anim' && !na.frozen && !na.idle) await faceOn(na,na.x<player().x?'R':'L'); if (gone()) return; var tf=player().x<na.x?'R':'L'; if (player().f!==tf && !(isG&&hs.noTurn)) await faceOn(player(),tf); }
  if (gone()) return;
  E.busy=true;
  if ((v==='talk') && hs.npc) convStart(hs.npc);
  try{ var ctx={key:hs.id+':'+v+(withItem?':'+withItem:'')+(isG?':g':''),hs:hs,item:withItem};
    if (unmetNpc(hs)){ if ((v==='talk'||withItem) && M.introduce) await M.introduce(API,hs.npc); else if (v==='look' && !isG && M.lookUnknown && M.lookUnknown(hs.npc)){ await say(M.lookUnknown(hs.npc),GS.active); return; } }
    API.reach=function(fn){ var an=reachFor(hs); if (!an||isG){ if (fn) fn(); return Promise.resolve(); } return playAnimOn(player(),an,fn); };
    if (withItem){
      if (isG){ await say(withItem==='tin'?pick(['Nein.','Die bleibt bei mir.']):pick(DEF.g.notouch),'mala'); }
      else { var it=M.ITEMS[withItem], h=hs.with&&hs.with[withItem];
        if (h===undefined && hs.give && hs.give[withItem]!==undefined){ h=hs.give[withItem];
          // Reaktion als Text: spricht die beschenkte Figur selbst (vorher sprach sie Marko, mit seinem Porträt)
          if (hs.npc && hs.npc!==GS.active && ACT[hs.npc] && (typeof h==='string'||Array.isArray(h))){ var gt0=h, gid=hs.npc; h=function(A,c){ return say(Array.isArray(gt0)?cycle((c&&c.key)||gid,gt0):gt0,gid); }; } }
        if (h===undefined && it.on && it.on[hs.id]!==undefined) h=it.on[hs.id];
        if (h===undefined && hs===MALA_HS){ h=it.mala!==undefined?it.mala:(M.showToMalaDefault||null); if (typeof h==='string'){ var mt=h; h=function(A){ return A.g(mt); }; }
          if (GS.flags['mala.voice'] && h){ var h0=h; h=async function(A,c){ await A.m('Ich halte einem Lichtfleck etwas hin. So weit ist es schon.'); return h0(A,c); }; } }
        if (h===undefined) h=hs.withAny;
        if (h!==undefined && h!==null) await respond(h,ctx); else await say(pick(hs.npc?DEF.m.give:DEF.m.usewith),'marko'); } }
    else { var val=verbHandler(hs,v);
      if (val!==undefined) await respond(val,ctx);
      else if (isG && hs.npc && ACT[hs.npc] && !ACT[hs.npc].ghost && hs.npc!=='marko' && v==='talk') await say(pick(DEF.g.living),'mala');
      else if (ex && v==='look') await say(isG?'Dort geht es hinaus.':'Da geht es hinaus.',GS.active);
      else await say(pick((isG?DEF.g:DEF.m)[v]||(isG?DEF.g.look:DEF.m.look)),GS.active); }
    if (room.check) await room.check(API);
  } finally { E.busy=false; } }
E.doVerb=doVerb;
function reachFor(hs){ var mode=hs.reach||'M'; if (mode==='none') return null; var r=hsRect(hs), st=hsStand(hs); if (!r||!st) return 'reachM';
  var h=st[1]-(r[1]+r[3]/2); if (r[1]>st[1]-30) h=Math.min(h,st[1]-r[1]-2); var back=st[2]==='B';
  if (mode==='floor'||h<10) return 'kneelF'; if (back) return h<38?'reachB':'reachBH'; return h<22?'reachL':(h<37?'reachM':'reachH'); }
// ---------------------------------------------------------------- Ortswechsel: ein Weg für Ausgang, Doppelklick und Stadtplan
// Jeder Wechsel endet in transition(): höchstens einer zur Zeit, kein direktes Setzen des Raums. Ein neuer Klick, ein anderer Raum oder
// ein schon laufender Wechsel machen einen älteren Auftrag ungültig (exitTok), sein Rückruf tut dann nichts mehr.
var exitTok=0; E.exitWalk=null; E.transitioning=false; E.sceneBlockUntil=0; M.DBL_MS=M.DBL_MS||350;
async function transition(to,o){ if (E.transitioning||!M.ROOMS[to]) return false; E.transitioning=true; ++exitTok; E.exitWalk=null; E.pop=null; E.pending=null;
  E.busy=true; try{ await gotoRoom(to,o||{}); } finally{ E.busy=false; E.transitioning=false; E.sceneBlockUntil=gt+M.DBL_MS; E.transitions=(E.transitions||0)+1; } return true; }
E.transition=transition; M.transition=transition;
// Laden, neues Spiel, Titelbild: „Übergang läuft“ und „zweiter Klick erwartet“ gelten nur in der laufenden Szene (nie im Spielstand, nie als Dauersperre)
function resetTransient(){ ++exitTok; E.transitioning=false; E.exitWalk=null; E.sceneBlockUntil=0; }
E.resetTransient=resetTransient;
// QA BUG-009: wer den Ausgang gewählt hat, geht auch hindurch – wechselt die Figur unterwegs (Porträt), wird der Ausgang verworfen
async function takeExit(hs,ex,opt){ opt=opt||{}; if (!ex||E.transitioning) return false; var my=++exitTok, rid=room.id, key=rid+'/'+hs.id, who=GS.active;
  if (hs.canExit){ E.busy=true; var ok; try{ ok=await hs.canExit(API); } finally{ E.busy=false; } if (!ok){ E.exitDenied={key:key,t:gt}; return false; } }
  if (my!==exitTok||!room||room.id!==rid||GS.active!==who) return false;
  var st=hsStand(hs), p=player();
  if (st && p){ E.exitWalk={key:key,tok:my,st:st}; var ok2=await walkActor(p,st[0],st[1]); var skipped=E.exitWalk&&E.exitWalk.tok===my&&E.exitWalk.skipped; if (E.exitWalk&&E.exitWalk.tok===my) E.exitWalk=null; if (!ok2&&!skipped) return false; }
  if (my!==exitTok||!room||room.id!==rid||E.transitioning||GS.active!==who) return false;
  if (ex.to==='map' && M.openMap){ M.openMap({exit:hs.id,room:rid}); return true; }   // Stadtplan: keine Fahrt in einen eigenen Raum, erst die Wahl löst den einen Wechsel aus
  return transition(ex.to,ex); }
// Doppelklick: den Rest des Weges zum schon gewählten Ausgang überspringen. Die Prüfungen (canExit) sind dann schon gelaufen, sie laufen nicht noch einmal.
E.skipExitWalk=function(key){ var w=E.exitWalk, p=player(); if (!w||w.key!==key||!p||p.mode!=='walk'||!p.res||E.transitioning) return false;
  w.skipped=true; p.path=[]; p.x=w.st[0]; p.y=w.st[1]; if (w.st[2]) p.f=w.st[2]; var r=p.res; p.res=null; setIdle(p); syncPos(); r(true); return true; };
E.exitKey=function(hs){ return (room?room.id:'')+'/'+hs.id; };
async function doItem(v,id,other){ E.acting=(E.acting||0)+1; try{ return await doItem0(v,id,other); } finally { E.acting--; } }
async function doItem0(v,id,other){ E.busy=true;
  try{ var it=M.ITEMS[id], ctx={key:'inv:'+id+':'+v,item:id}; API.reach=function(fn){ if (fn) fn(); return Promise.resolve(); };
    if (GS.active==='mala'){ if (v==='look') await respond(it.look,ctx); else await say(pick(['Nein.','Die bleibt bei mir.']),'mala'); return; }
    if (other){ var h=M.COMBOS[id+'+'+other]; if (h===undefined) h=M.COMBOS[other+'+'+id];
      if (id===other){ await say('Das ist ein und dasselbe.','marko'); }
      else if (h!==undefined) await respond(h,ctx); else await say(pick(DEF.m.itemitem),'marko'); }
    else if (v==='look'||v==='walk') await respond(it.look||('Das ist '+it.name+'.'),ctx);
    else if (it[v]!==undefined) await respond(it[v],ctx);
    else await say(pick(DEF.m[v]||DEF.m.use),'marko');
  } finally { E.busy=false; } }
E.doItem=doItem;
E.setLastClick=function(p){ lastClick=p; };
E.walkPlayerTo=function(x,y){ var p=player(); if (p) walkActor(p,x,y); };
E.actionTok=function(){ return ++actionTok; };

// ---------------------------------------------------------------- Räume betreten
function placePlayers(){ ['marko','mala'].forEach(function(k){ var pos=GS.pos[k]; var here=pos.room===room.id && (k==='marko'||GS.malaOn);
    if (here){ var a=ACT[k]; if (!a){ a=new Actor(k,{ch:k,x:pos.x,y:pos.y,f:pos.f,player:true,ghost:k==='mala',name:k==='mala'?'Mala':'Marko',speed:k==='mala'?78:85,step:k==='mala'?3.5:4}); ACT[k]=a; setIdle(a); }
      else { a.x=pos.x; a.y=pos.y; a.f=pos.f; } a.visible=!(k==='marko'&&room.noActor); }
    else if (ACT[k]){ if (ACT[k].mode==='walk') cancelRes(ACT[k]); delete ACT[k]; } }); }   // QA BUG-002: ein laufender Weg endet als abgebrochen, statt ewig offen zu bleiben
// QA BUG-002: Spielerfiguren, die beim Raumwechsel noch unterwegs sind, beenden ihren Weg als abgebrochen (sonst bliebe die Aktion ewig offen)
function placeActors(){ Object.keys(ACT).forEach(function(k){ var a=ACT[k]; if (a && a.player && a.mode==='walk') cancelRes(a); delete ACT[k]; }); var list=room.actors?room.actors(S,GS):[];
  list.forEach(function(o){ if (o.vis===false) return; var a=new Actor(o.id,o); a.home=[a.x,a.y,a.f]; if (o.routine!==false){ var rt=o.routine||(M.ROUTINES&&M.ROUTINES[o.id]); if (rt) a.routine=rt; } a.rtUntil=gt+1500+Math.random()*4000; ACT[o.id]=a; setIdle(a); }); placePlayers(); }
function loadRoom(id){ E.crossing=null; room=M.ROOMS[id]; if (!room) throw new Error('kein Raum '+id); S=RS(id); dirty=true; navDirty=true; lastClick=null; E.room=room;
  placeActors(); E.camX=0; var mus=typeof room.music==='function'?room.music(GS):room.music; if (mus!==undefined && mus!==null) M.music(mus);
  if (room.load) room.load(API); var sc=room.scape||room.id; M.scape(sc,{tod:todOf(),S:S,GS:GS}); }
M.loadRoom=loadRoom;
async function gotoRoom(id,o){ o=o||{}; var cur=room?room.id:null, from=o.via||cur; syncPos();   // via: Herkunft für Eingänge und enter (Stadtplan = 'map')
  if (cur && room.leave) await room.leave(API,id);
  if (o.fade!==false && E.screen==='game') await fadeTo(8,o.fadeMs||320);
  if (E.speech) endSpeech(); E.speech=null; E.pop=null; E.conv=null; E.trLast=null;
  var who=GS.active;
  var tgt=M.ROOMS[id]; if (!tgt) throw new Error('kein Raum '+id);
  var ent=o.x!==undefined?[o.x,o.y,o.f]:((tgt.entries&&tgt.entries[from])||tgt.start||[160,120,'R']);
  GS.pos[who]={room:id,x:ent[0],y:ent[1],f:ent[2]||'R'};
  // Mala kommt mit, wenn Marko einen normalen Ausgang nimmt (außer sie bleibt: o.leaveMala oder die Geschichte will es, M.malaStays)
  var stayM=!!o.leaveMala || !!(M.malaStays && who==='marko' && GS.malaOn && M.malaStays(GS,cur,id,o));
  if (who==='marko' && GS.malaOn && !o.keepPos && !stayM){ GS.pos.mala={room:id,x:ent[0]-14,y:ent[1]-2,f:ent[2]||'R'}; }
  loadRoom(id);
  if (M.onRoomChange) try{ M.onRoomChange(GS,id,cur,o); }catch(e){ console.error(e); }
  if (who==='marko' && GS.malaOn && !o.keepPos && !stayM){ var p=nearestPoint('mala',ent[0]+(ent[2]==='L'?16:-16),ent[1]-2); GS.pos.mala={room:id,x:p[0],y:p[1],f:ent[2]||'R'}; placePlayers(); }
  var pl=player(); if (pl){ cancelRes(pl); setIdle(pl); }
  snapCamera(); if (E.screen!=='game') E.screen='game';
  if (o.fade!==false) await fadeTo(0,o.fadeMs||320);
  if (!o.noEnter && room.enter){ var wb=E.busy; E.busy=true; try{ await room.enter(API,from); } finally{ E.busy=wb; } }
  if (!o.noEnter && M.autoIntro && GS.active==='marko' && E.screen==='game'){ var wb2=E.busy; E.busy=true; try{ await M.autoIntro(API); } finally{ E.busy=wb2; } }
  if (!o.noSave) autosave(); }
M.gotoRoom=gotoRoom;
function snapCamera(){ var p=player(); var tgt=Math.round((p?p.x:160)-160); E.camX=Math.max(0,Math.min(room.width-W,tgt)); if (room.camX!==undefined) E.camX=room.camX; }
function updateCamera(dt){ if (!room||room.width<=W){ E.camX=0; return; } if (room.camLock!==undefined){ E.camX=room.camLock; return; } var p=player(); if (!p) return;
  var tgt=p.x-160; if (Math.abs(tgt-E.camX)>36){ var d=tgt-E.camX; E.camX+=(d-(d>0?36:-36))*Math.min(1,dt/170); } E.camX=Math.max(0,Math.min(room.width-W,E.camX)); }
E.snapCamera=snapCamera;

// ---------------------------------------------------------------- Phasen (Tage, Tageszeiten)
function setPhase(p){ var ph=M.PHASES[p]; if (!ph) throw new Error('keine Phase '+p); GS.phase=p; if (ph.tod) GS.tod=ph.tod; dirty=true; navDirty=true; if (room) M.scape(room.scape||room.id,{tod:todOf(),S:S,GS:GS}); }
M.setPhase=setPhase;
function showCard(c){ return new Promise(function(res){ E.card=Object.assign({at:gt,res:res},c); var prev=E.screen; E.card.prev=prev; E.screen='card'; var ms=c.ms||4200; timers.push({t:gt+ms,r:function(){ if (E.card&&E.card.res===res) closeCard(); }}); }); }
function closeCard(){ if (!E.card) return; var r=E.card.res, p=E.card.prev; E.card=null; E.screen=(p==='card'?'game':p)||'game'; r(); }
E.closeCard=closeCard;

// ---------------------------------------------------------------- Speichern / Laden
var SAVE='mala.save.', SLOTS=3, slot=1;
try{ slot=Math.max(1,Math.min(SLOTS,+localStorage.getItem('mala.slot')||1)); }catch(e){}
function LS(){ return M.storage||localStorage; }
E.slot=function(){ return slot; }; E.setSlot=function(n){ slot=n; try{ localStorage.setItem('mala.slot',String(n)); }catch(e){} };
function slotInfo(n){ try{ var raw=LS().getItem(SAVE+n); if (!raw) return null; var d=JSON.parse(raw); return {phase:d.GS.phase,ms:d.GS.playMs||0,at:d.at||0}; }catch(e){ return null; } }
E.slotInfo=slotInfo;
// live: ein ausdrücklicher Sicherungspunkt im Skript (A.save) – sonst gilt während einer Szene der Stand von ihrem Beginn
function saveGame(live){ if (!room||E.screen!=='game'||room.noSave||GS.ended) return false; var g=GS;
  if (busyV && live!==true && safeGS) g=safeGS; else syncPos();
  try{ var js=JSON.stringify({GS:g,at:Date.now()}); if (busyV && g===GS) safeGS=JSON.parse(js).GS; LS().setItem(SAVE+slot,js); return true; }catch(e){ return false; } }
function autosave(){ if (E.busy){ E.pendingSave=true; return; } saveGame(); }
function hasSave(n){ try{ return !!LS().getItem(SAVE+(n||slot)); }catch(e){ return false; } }
E.hasSave=hasSave; E.saveGame=saveGame; M.saveGame=saveGame;
E.anySave=function(){ for (var n=1;n<=SLOTS;n++) if (hasSave(n)) return true; return false; };
function setGame(ns){ GS=ns; M.GS=ns; }
// Nachzüge für ältere Spielstände: eine Liste, unabhängig davon, wer M.migrateSave zuletzt gesetzt hat (Karte, Hinweise …)
M.MIGRATE=M.MIGRATE||[];
M.migrateAll=function(G){ if (M.migrateSave) try{ M.migrateSave(G); }catch(e){ console.error(e); } M.MIGRATE.forEach(function(fn){ try{ fn(G); }catch(e){ console.error(e); } }); };
function validate(d){ var base=freshGame(); Object.keys(base).forEach(function(k){ if (d.GS[k]!==undefined) base[k]=d.GS[k]; });
  base.inv=(base.inv||[]).filter(function(id,i,a){ return M.ITEMS[id] && a.indexOf(id)===i; }); base.notes=(base.notes||[]).filter(function(id){ return M.NOTES[id]; });
  if (!M.PHASES[base.phase]) return null; ['marko','mala'].forEach(function(k){ if (!base.pos[k]||!M.ROOMS[base.pos[k].room]) base.pos[k]={room:base.pos.marko&&M.ROOMS[base.pos.marko.room]?base.pos.marko.room:'flat',x:160,y:120,f:'R'}; });
  if (M.ROOMS[base.pos[base.active].room].noSave) return null; return base; }
function loadGame(n){ try{ var raw=LS().getItem(SAVE+(n||slot)); if (!raw) return false; return loadData(JSON.parse(raw)); }catch(e){ console.error(e); return false; } }
// mitgelieferter Spielstand: in den gewählten Platz laden und dort gleich speichern
E.loadPreset=function(name,n){ var p=M.PRESETS&&M.PRESETS[name]; if (!p) return false; if (n) E.setSlot(n); var ok=loadData({GS:JSON.parse(JSON.stringify(p.GS))}); if (ok) saveGame(); return ok; };
// Kapitelmodule hängen hier ein, was beim Laden, beim neuen Spiel und beim Titelbild zurückgesetzt werden muss (z. B. Kapitel 3: Warteschlange und Leerlaufsperre)
function gameReset(){ (M.RESET_HOOKS||[]).forEach(function(f){ try{ f(); }catch(e){ console.error(e); } }); }
function loadData(d){ try{ var base=validate(d); if (!base) return false;
    M.migrateAll(base);   // ältere Spielstände an den neuen Ablauf anpassen (90_story.js, dann die Nachzüge aus M.MIGRATE)
    setGame(base); safeGS=null; Object.keys(GS.rooms||{}).forEach(function(r){ ['ferryAt','ferryGo','radioT','steam','nudge'].forEach(function(k){ delete GS.rooms[r][k]; }); }); // Spielzeit-Stempel gelten nur in der laufenden Sitzung (QA BUG-004: auch Dampf und Stimmen-Takt)
    timers.length=0; faders.length=0; E.speech=null; E.overlay=null; E.dlg=null; E.card=null; E.busy=false; E.acting=0; E.menu=null; paused=false; E.fade=0; E.pop=null; E.crossing=null;   // eine abgebrochene Szene bleibt stehen, sie läuft nicht weiter
    resetTransient(); gameReset();
    M.setGhostAudio(GS.active==='mala'); loadRoom(GS.pos[GS.active].room); var pl=player(); if (pl) setIdle(pl); snapCamera(); E.screen='game'; if (room.resume) room.resume(API); if (M.resumePending) Promise.resolve().then(function(){ return M.resumePending(API); }); return true; }catch(e){ console.error(e); return false; } }
E.loadGame=loadGame; M.loadGame=loadGame;
E.newGame=function(ch){ setGame(freshGame()); safeGS=null; resetTransient(); gameReset(); timers.length=0; faders.length=0; E.speech=null; E.overlay=null; E.dlg=null; E.card=null; E.busy=false; E.acting=0; E.menu=null; E.pop=null; M.setGhostAudio(false);
  if (ch===4 && M.startChapter4) M.startChapter4(API); else if (ch===3 && M.startChapter3) M.startChapter3(API); else if (ch===2 && M.startChapter2) M.startChapter2(API); else if (M.startGame) M.startGame(API); };
E.toTitle=function(){ saveGame(); M.scapeStop(); resetTransient(); gameReset(); E.screen='title'; E.titleMode='main'; timers.length=0; faders.length=0; E.speech=null; E.overlay=null; E.dlg=null; E.card=null; E.busy=false; E.acting=0; E.fade=0; E.menu=null; E.pop=null; M.setGhostAudio(false); M.music('title'); };

// ---------------------------------------------------------------- Taktgeber
M.TURBO=1;
M.update=function(dt){ if (dt>60 && !M.TEST) dt=60; dt*=M.TURBO;
  if (!paused){ gt+=dt; if (E.screen==='game' && !GS.ended) GS.playMs+=dt/M.TURBO; if (E.shake>0) E.shake-=dt; tickTimers();
    for (var f=faders.length-1;f>=0;f--){ var F=faders[f]; if (F.f()){ faders.splice(f,1); F.res(); } }
    if (E.speech && gt>=E.speech.until && !(tapText && E.busy && E.screen==='game' && !M.TEST)) endSpeech();
    if (E.conv && ((!E.busy && !E.dlg) || E.conv.room!==room || E.screen!=='game')) E.conv=null;
    if (!E.busy && !E.dlg && !E.speech) E.trLast=null;
    if (room && E.screen==='game'){ Object.keys(ACT).forEach(function(k){ updateActor(ACT[k],dt); }); updateCamera(dt); if (room.tick) room.tick(API,dt); if (M.ambientTick) M.ambientTick(API,dt); syncPos(); }
    if (E.pendingSave && !E.busy){ E.pendingSave=false; saveGame(); }
    // Leerlauf: ein Kapitel darf hier ausstehende Szenen anstoßen (nur wenn nichts läuft)
    if (M.idleHook && E.screen==='game' && room && !E.busy && !E.dlg && !E.overlay && !E.card && !E.speech && !E.transitioning && !E.menu && !GS.ended) M.idleHook(API); }
  M.scheduleMusic(); };
E.gtAdd=function(ms){ gt+=ms; };
E.rebuildIfDirty=function(){ if (dirty && room) rebuild(); return {bg:bg,layers:layers}; };
E.markDirty=function(){ dirty=true; navDirty=true; };
E.room=null;
E.todOf=todOf;
E.paused=function(v){ if (v!==undefined) paused=v; return paused; };

// ---------------------------------------------------------------- Testzugang (für den automatischen Durchlauf)
M.TA={
  status:function(){ var pl=player(); return {trn:!!E.transitioning,map:!!(E.overlay&&E.overlay.kind==='map'),mapActing:!!(E.overlay&&E.overlay.kind==='map'&&E.overlay.data.acting),transitions:E.transitions||0,acting:E.acting||0,walk:!!(pl&&pl.mode==='walk'),screen:E.screen,room:room&&room.id,busy:E.busy,dlg:E.dlg?E.dlg.opts.map(function(o){ return o.t; }):null,overlay:E.overlay?E.overlay.kind:null,speech:!!E.speech,card:!!E.card,active:GS.active,phase:GS.phase,inv:GS.inv.slice(),notes:GS.notes.slice()}; },
  hs:function(id){ return room.byId[id]; },
  act:function(verb,id,item){ if (E.overlay && E.overlay.kind==='map' && /^loc2?_/.test(id)){ M.mapGo(id.replace(/^loc2?_/,'')); return; } var hs=id==='_mala'?MALA_HS:(id==='_marko'?MARKO_HS:room.byId[id]); if (!hs) throw new Error('kein Hotspot '+id+' in '+room.id); E.pop=null; doVerb(verb,hs,item); },
  exit:function(id){ var hs=room.byId[id]; if (!hs) throw new Error('kein Ausgang '+id); E.pop=null; doVerb(hs.gexit&&GS.active==='mala'?'pass':'walk',hs); },
  item:function(verb,id,other){ doItem(verb,id,other); },
  choose:function(sub){ if (!E.dlg) throw new Error('keine Auswahl offen'); var i=E.dlg.opts.findIndex(function(o){ return o.t.indexOf(sub)>=0; }); if (i<0) throw new Error('Option nicht gefunden: '+sub+' | '+E.dlg.opts.map(function(o){ return o.t; }).join(' / ')); E.chooseDone(i); },
  pickNote:function(id){ if (E.dlg){ var k=E.dlg.opts.findIndex(function(o){ return o.id===id; }); if (k<0) throw new Error('Gedanke nicht in der Auswahl: '+id); E.chooseDone(k); return; } if (!E.overlay||E.overlay.kind!=='notebook') throw new Error('kein Notizbuch offen');
    if (id && E.nbOpen){ var L=E.nbOpen(true,E.overlay.data&&E.overlay.data.also); if (L.indexOf(id)<0) throw new Error('Notiz steht im Notizbuch nicht zur Wahl: '+id); }   // Tests wählen nur, was ein Spieler sehen kann
    closeOverlay(id); },
  closeOverlay:function(v){ closeOverlay(v); },
  combine:function(a,b){ return combineNotes(a,b); },
  switchTo:function(w){ return switchTo(w,true); },
  skip:function(){ if (E.speech) endSpeech(); if (E.card) closeCard(); },
  // Reisen wie ein Spieler: über den Stadtplan (öffnet ihn bei Bedarf wie der Knopf „Karte“), mit allen Prüfungen. Kein Teleport.
  travel:function(loc){ if (!M.mapLoc(loc)) throw new Error('kein Ort '+loc+' in diesem Kapitel'); M.mapGo(loc); return true; },
  map:function(){ M.openMap(); return true; }, mapStates:function(){ return E.overlay&&E.overlay.kind==='map'?E.overlay.data.st:null; },
  get GS(){ return GS; }
};
})(M);
/* ---- M.room: Logik-Raum aus einer Kunst-Definition (M.ART[id]) zusammensetzen ----
   Hotspots ohne r/st bekommen Rechteck und Standpunkt aus ART.spots/ART.stands. Fehlt die Kunst, gibt es einen schlichten Ersatzraum. */
(function(M){
'use strict';
var P=M.P;
function fallbackArt(id,w){ return { width:w||320, paint:function(S,GS,tod){ var b=new M.Buf(w||320,144,P.k1); for (var y=0;y<144;y++) for (var x=0;x<b.w;x++) b.px(x,y,y<100?(((x>>3)+(y>>3))&1?P.m1:P.m0):P.s1); M.text(b,'['+id+']',8,8,P.s5); return b; },
  walk:function(x,y){ return y>104&&y<140&&x>6&&x<(w||320)-6; }, spots:{}, stands:{}, actorPos:{}, start:[160,120,'R'], entries:{} }; }
M.room=function(id,def){ var A=M.ART[id]; if (!A){ console.warn('Kunst fehlt für '+id); A=fallbackArt(id,def.width); }
  var spots=A.spots||{}, stands=A.stands||{};
  var hs=(def.hotspots||[]).map(function(h){ if (h.r===undefined && spots[h.id]) h.r=spots[h.id]; if (h.st===undefined && stands[h.id]) h.st=stands[h.id]; if (!h.r && !h.npc){ console.warn('Spot fehlt: '+id+'.'+h.id); h.r=[0,0,0,0]; } return h; });
  var base={id:id,width:A.width||320,paint:A.paint,layers:A.layers,walk:A.walk,walkG:A.walkG,dynamic:A.dynamic,front:A.front,ghost:A.ghost,actorLut:A.actorLut,start:A.start,entries:A.entries||{}};
  var r=M.defineRoom(Object.assign(base,def,{hotspots:hs}));
  if (def.entries) r.entries=Object.assign({},A.entries||{},def.entries);
  return r; };
// Position eines NPC aus der Kunst: M.apos('varos','zdenka') -> [x,y,f]
M.apos=function(room,id,fb){ var A=M.ART[room]; var p=A&&A.actorPos&&A.actorPos[id]; return p||fb||[160,120,'L']; };
M.spot=function(room,id){ var A=M.ART[room]; return (A&&A.spots&&A.spots[id])||[0,0,0,0]; };
M.stand=function(room,id){ var A=M.ART[room]; return (A&&A.stands&&A.stands[id])||null; };
})(M);
