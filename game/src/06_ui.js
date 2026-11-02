/* ===== 06_ui.js — Zeichnen und Eingabe: Szene, Geistersicht, Leiste, Verb-Menü, Gespräche, Notizbuch, Dokumente, Nachhall, Menü, Titel ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf, E=M.E, bayer=M.bayer;
var W=320, H=200, SH=144;
var fb=new Buf(W,H,P.k0); M.fb=fb;
var mask=new Uint8Array(W*SH);
var pointer={x:-99,y:-99,down:false,touch:false,show:false}, hover=null, hoverUI=null, press=null, drag=null, reveal=null, lastTap=null;
E.pending=null; E.pop=null; E.invTop=0; E.menu=null; E.titleMode='main';
function GS(){ return M.GS; }
function isG(){ return M.GS.active==='mala'; }
// Farben der Leiste: Marko warm, Mala kalt
function ui(){ return isG()?{bg:P.k0,fr:P.x1,tx:P.x3,hi:P.x5,dim:P.x1,sel:P.x0}:{bg:P.k0,fr:P.y1,tx:P.y3,hi:P.y5,dim:P.y0,sel:P.w0}; }

// ---------------------------------------------------------------- Szene
function drawScene(){ var r=E.rebuildIfDirty(), bg=r.bg, room=E.room, S=M.RS(room.id), gs=GS(), ghostView=isG()&&!room.noGhostView;
  var ox=E.shake>0?Math.round(Math.sin(E.gt()*0.09)*2):0, cx=Math.round(E.camX), bw=bg.w;
  for (var y=0;y<SH;y++){ var row=y*W, brow=y*bw; for (var x=0;x<W;x++){ var sx=x+cx-ox; fb.d[row+x]=(sx>=0&&sx<bw)?bg.d[brow+sx]:P.k0; } }
  mask.fill(0);
  var view={cam:cx-ox,t:E.gt()/1000,gt:E.gt(),tod:M.todOf(),ghost:ghostView};
  if (room.dynamic) room.dynamic(fb,view,S,gs);
  var list=r.layers.filter(function(l){ return !l.hidden && !(l.vis && !l.vis(S,gs)); }).slice();
  Object.keys(E.ACT).forEach(function(k){ var a=E.ACT[k]; if (E.actorShown(a)) list.push({actor:a,base:a.y+(a.base||0)}); });
  list.sort(function(a,b){ return (a.base-b.base)||((a.actor?1:-1)-(b.actor?1:-1)); });
  var tod=view.tod;
  list.forEach(function(l){
    if (l.actor){ var a=l.actor, sx=a.x-cx+ox; if (sx<-40||sx>W+40) return; var p=E.actorPose(a), f=p.v==='S'?(a.f==='L'?'L':'R'):a.f, o={t:E.gt(),h:SH,scale:a.scale||1};
      var spirit=a.ghost;
      if (spirit){ if (ghostView){ o.mask=mask; o.mv=1; o.alpha=1; } else { o.lut=(a.id==='mala'?M.TINT.mala:M.TINT.spirit).a; o.alpha=a.alpha||(a.id==='mala'?0.8:0.72); o.wobble=1; } }
      else { if (room.actorLut) o.lut=room.actorLut(a,S,gs,tod); else if (tod!=='day' && M.TINT[tod]) o.lut=M.TINT[tod].a; }
      if (a.fadeIn && E.gt()-a.fadeIn<900){ o.alpha=(o.alpha||1)*Math.min(1,(E.gt()-a.fadeIn)/900); }
      if (a.fadeOut){ var k=(E.gt()-a.fadeOut)/900; if (k>=1){ a.visible=false; a.fadeOut=0; return; } o.alpha=(o.alpha||1)*(1-k); }
      if (!a.noShadow && !spirit) shadow(sx,a.y,Math.round(7*(a.scale||1)));
      M.drawPose(fb,sx,a.y,p,f,a.ch,o); }
    else if (l.draw) l.draw(fb,view,S,gs);
    else { fb.blit(l,l.ox-cx+ox,l.oy); clearMask(l,l.ox-cx+ox,l.oy); }
  });
  if (room.front) room.front(fb,view,S,gs);
  if (ghostView){ var t=M.TINT.ghost; for (var i=0;i<W*SH;i++){ if (mask[i]) continue; var c=fb.d[i]; fb.d[i]=M.tintPx(t,c,i%W,(i/W)|0); }
    if (room.ghost) room.ghost(fb,view,S,gs);
    // kalter Schimmer am Rand
    var tt=E.gt()/1000; for (var yy=0;yy<SH;yy++){ var e=Math.min(yy,SH-1-yy); if (e>5) continue; for (var xx=0;xx<W;xx++){ if (bayer(xx+Math.floor(tt*3),yy)<(6-e)/14) fb.d[yy*W+xx]=P.x0; } } }
  // Kopfschmerz: ein unentdeckter Geist ist nah
  var hidden=!ghostView && Object.keys(E.ACT).some(function(k){ var a=E.ACT[k]; return a.ghost && a.id!=='mala' && a.visible && !E.ghostVisible(a) && !a.noAche; });
  var ache=hidden || (E.headache && E.gt()<E.headache);
  if (ache){ var pulse=(Math.sin(E.gt()/260)+1)/2*0.5+0.25; for (var y2=0;y2<SH;y2++) for (var x2=0;x2<W;x2++){ var dx=(x2-160)/170, dy=(y2-72)/95, v=dx*dx+dy*dy; if (v>0.55 && bayer(x2,y2)<(v-0.55)*pulse*1.4){ var k2=y2*W+x2; fb.d[k2]=M.DN[M.DN[fb.d[k2]]]; } } }
  if (M.DEBUG_SPOTS){ var cx1=Math.round(E.camX); for (var wy=0;wy<SH;wy+=3) for (var wx=0;wx<W;wx+=3){ var X=wx+cx1; var mk=room.walk&&room.walk(X,wy,S,gs); var mg=room.walkG&&room.walkG(X,wy,S,gs); if (mk) fb.px(wx,wy,P.b3); else if (mg) fb.px(wx,wy,P.x5); }
    room.hotspots.forEach(function(h){ var r0=E.hsRect(h); if (!r0) return; var X0=r0[0]-cx1, c=h.gexit?P.x6:(h.exit?P.g5:(h.who==='g'?P.x4:P.y4)); fb.hl(X0,X0+r0[2]-1,r0[1],c); fb.hl(X0,X0+r0[2]-1,r0[1]+r0[3]-1,c); fb.vl(X0,r0[1],r0[1]+r0[3]-1,c); fb.vl(X0+r0[2]-1,r0[1],r0[1]+r0[3]-1,c); M.microText(fb,String(h.id).slice(0,10),X0+2,r0[1]+2,c);
      var st=typeof h.st==='function'?h.st(S,gs):h.st; if (st){ fb.rect(st[0]-cx1-1,st[1]-1,3,3,P.r4); } }); }
  if (E.switchFx && E.gt()-E.switchFx<500){ var q=(E.gt()-E.switchFx)/500; for (var j=0;j<W*SH;j++){ if (bayer(j%W,(j/W)|0)>q) fb.d[j]=isG()?M.UP[fb.d[j]]:M.DN[fb.d[j]]; } }
}
function clearMask(l,ox,oy){ for (var j=0;j<l.h;j++){ var y=oy+j; if (y<0||y>=SH) continue; for (var i=0;i<l.w;i++){ if (l.d[j*l.w+i]===T) continue; var x=ox+i; if (x<0||x>=W) continue; mask[y*W+x]=0; } } }
function shadow(x,y,w){ for (var dy=-1;dy<=1;dy++) for (var dx=-w;dx<=w;dx++){ if (Math.abs(dx)>(dy===0?w:w-2)) continue; var px=Math.round(x)+dx, py=Math.round(y)+dy; if (px<0||px>=W||py<0||py>=SH) continue; var c=fb.d[py*W+px]; fb.d[py*W+px]=M.DN[c]; } }

// ---------------------------------------------------------------- Leiste
var BTN_Y=SH+2, INV_Y=161, SLOT_W=40, SLOT_H=36, INV_X=51, INV_N=6, SW_X=2, SW_W=38;
var BTNS=[{id:'hint',t:'Tipp',x:4},{id:'notes',t:'Notizen',x:34},{id:'reveal',t:'Zeigen',x:0,right:true},{id:'menu',t:'Menü',x:0,right:true}];
(function(){ var x=W-4; for (var i=BTNS.length-1;i>=0;i--){ var b=BTNS[i]; b.w=M.textWidth(b.t); if (b.right){ x-=b.w; b.x=x; x-=14; } } var lx=4; BTNS.forEach(function(b){ if (!b.right){ b.x=lx; lx+=b.w+14; } }); })();
function btnAt(x,y){ if (y<SH||y>=SH+15) return null; for (var i=0;i<BTNS.length;i++){ var b=BTNS[i]; if (x>=b.x-5&&x<b.x+b.w+5) return b.id; } return null; }
function drawButton(b,on){ var c=ui(), hot=hoverUI===b.id&&pointer.show, act=(b.id==='reveal'&&reveal); var x0=b.x-4, x1=b.x+b.w+3, y0=BTN_Y, y1=BTN_Y+11;
  fb.rect(x0+1,y0+1,x1-x0-1,y1-y0-1,act?c.sel:P.k1); fb.hl(x0+1,x1-1,y0,c.fr); fb.hl(x0+1,x1-1,y1,c.fr); fb.vl(x0,y0+1,y1-1,c.fr); fb.vl(x1,y0+1,y1-1,c.fr);
  M.text(fb,b.t,b.x,BTN_Y+2,!on?c.dim:((hot||act)?c.hi:c.tx));
  if (b.id==='notes' && Object.keys(GS().noteNew).length){ fb.rect(x1-2,y0-1,3,3,P.r4); } }
function invList(){ return isG()?['tin']:GS().inv; }
function drawUI(){ fb.rect(0,SH,W,H-SH,P.k0); var room=E.room, c=ui();
  if (E.dlg && E.conv) return;
  if (room && room.noVerbs){ var s0=hover?E.nameOf(hover):(room.prompt||''); M.text(fb,s0,Math.max(2,Math.floor((W-M.textWidth(s0))/2)),SH+4,c.tx); drawButton(BTNS[3],true); return; }
  var s=E.overlay?(pointer.touch?'(Tippen zum Schließen)':''):(E.pop||drag?'':sentence()); var sw=M.textWidth(s); M.text(fb,s,Math.max(100,Math.floor((W-sw)/2)),SH+4,c.tx);
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
    if (E.invNew===id && E.gt()%600<300) fb.rect(x+1,y+1,SLOT_W-4,2,c.hi);
    if (ic && !(drag&&drag.on&&drag.id===id)) fb.blit(ic,x+Math.floor((SLOT_W-2-ic.w)/2),y+Math.floor((SLOT_H-ic.h)/2)); }
  if (pages>1) for (var d=0;d<pages;d++) fb.rect(INV_X+INV_N*SLOT_W/2-pages*3+d*6|0,H-2,4,1,d===E.invTop?c.tx:c.dim); }
var ICON_CACHE={};
function iconOf(id){ if (ICON_CACHE[id]) return ICON_CACHE[id]; var it=M.ITEMS[id], b=new Buf(32,24,T); if (it.icon) it.icon(M.lw(Object.assign(b,{ox:0,oy:0}))); M.outline(b,P.k1); var tb=trim(b); ICON_CACHE[id]=tb; return tb; }
M.iconOf=iconOf;
function trim(b){ var x0=b.w,y0=b.h,x1=-1,y1=-1; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++) if (b.d[y*b.w+x]!==T){ if (x<x0)x0=x; if (y<y0)y0=y; if (x>x1)x1=x; if (y>y1)y1=y; } if (x1<0) return b; var o=new Buf(x1-x0+1,y1-y0+1,T); for (y=y0;y<=y1;y++) for (x=x0;x<=x1;x++) o.d[(y-y0)*o.w+(x-x0)]=b.d[y*b.w+x]; return o; }
function drawSwitch(){ var g=GS(), c=ui(), x=SW_X, y=INV_Y-1, w=SW_W, h=SLOT_H+2, avail=g.malaOn && !(E.room&&(E.room.noMala||E.room.noSwitch));
  fb.rect(x,y,w,h,P.k1); fb.hl(x,x+w-1,y,avail?c.fr:P.k2); fb.hl(x,x+w-1,y+h-1,avail?c.fr:P.k2); fb.vl(x,y,y+h-1,avail?c.fr:P.k2); fb.vl(x+w-1,y,y+h-1,avail?c.fr:P.k2);
  if (!g.malaOn) return; var other=g.active==='marko'?'mala':'marko', pb=portraitBuf(other,'n'), hot=hoverUI==='sw'&&pointer.show;
  var ox=x+Math.floor((w-pb.w*1.5)/2), oy=y+2;
  for (var j=0;j<Math.floor(pb.h*1.5);j++) for (var i=0;i<Math.floor(pb.w*1.5);i++){ var col=pb.d[Math.floor(j/1.5)*pb.w+Math.floor(i/1.5)]; if (col===T) continue; if (other==='mala') col=M.TINT.mala.a[col]; if (!avail) col=M.DN[M.DN[col]]; fb.px(ox+i,oy+j,col); }
  var lab=other==='mala'?'Mala':'Marko'; M.text(fb,lab,x+Math.floor((w-M.textWidth(lab))/2),y+h-10,!avail?P.k2:(hot?c.hi:(other==='mala'?P.x4:P.y3))); }
function arrowH(x,y,left,on,hot){ var c=ui(), col=on?(hot?c.hi:c.tx):c.dim; for (var i=0;i<6;i++){ var xx=left?x+i:x-i; fb.vl(xx,y-i,y+i,col); } }
function sentence(){ var v=E.pending?'Benutze':''; var hn=hover?E.nameOf(hover):''; if (E.pending){ var pn=M.ITEMS[E.pending].name; return 'Benutze '+pn+' mit '+(hn||'…'); } return hn; }

// ---------------------------------------------------------------- Verb-Menü (nur Verben, die etwas bewirken)
var POP_RH=13;
function hsOpts(hs){ var room=E.room; if (room.noVerbs) return null; var o=[], g=isG();
  var ex=g?(hs.gexit||(hs.exit&&hs.exit.gok?hs.exit:null)):hs.exit; if (typeof ex==='function') ex=ex(M.RS(room.id),GS());
  if (hs===E.MALA_HS){ return [{t:'Rede mit',v:'talk'},{t:'Schau an',v:'look'}]; }
  if (hs===E.MARKO_HS){ return [{t:'Sprich mit',v:'talk'},{t:'Schau an',v:'look'}]; }
  if (ex) o.push({t:g&&hs.gexit?'Hindurchgehen':'Hingehen',v:g&&hs.gexit?'pass':'walk'});
  if (g){ var gv=hs.g||{}; ['talk','sense','listen'].forEach(function(v){ if (gv[v]!==undefined) o.push({t:E.VLABEL[v==='talk'?'gtalk':v],v:v}); });
    if (hs.npc && !gv.talk && E.ACT[hs.npc] && E.ACT[hs.npc].ghost) o.push({t:'Sprich mit',v:'talk'}); }
  else { ['talk','take','open','use','push','read'].forEach(function(v){ if (hs[v]!==undefined) o.push({t:E.VLABEL[v],v:v}); }); if (hs.npc && hs.talk===undefined) o.unshift({t:'Rede mit',v:'talk'}); }
  if (!ex && o.length===0) return null;
  if (ex && o.length===1 && !(g?(hs.g&&hs.g.look):hs.look)) return null;
  o.push({t:'Schau an',v:'look'}); return o; }
function itemOpts(id){ if (isG()) return [{t:'Schau an',v:'look'}]; var it=M.ITEMS[id], o=[{t:'Benutze',pend:true}]; ['read','open','use2'].forEach(function(v){ if (it[v]!==undefined) o.push({t:v==='read'?'Lies':(v==='open'?'Öffne':it.use2Label||'Benutze'),v:v}); }); o.push({t:'Schau an',v:'look'}); return o; }
function openPop(p){ p.room=E.room; var w=M.textWidth(p.title); p.opts.forEach(function(o){ w=Math.max(w,M.textWidth(o.t)); }); w=Math.max(66,w+14);
  var h=(p.opts.length+1)*POP_RH+4, x0, y0; if (p.item){ x0=p.x-(w>>1); y0=INV_Y-h-3; } else { x0=p.x+10; if (x0+w>W-2) x0=p.x-10-w; y0=p.y-(h>>1); }
  p.bx=Math.max(2,Math.min(W-2-w,x0)); p.by=Math.max(2,Math.min(H-2-h,y0)); p.bw=w; p.bh=h; E.pop=p; }
function popAt(x,y){ var p=E.pop; if (!p||x<p.bx||x>=p.bx+p.bw||y<p.by||y>=p.by+p.bh) return null; var r=Math.floor((y-p.by-2)/POP_RH)-1; return (r>=0&&r<p.opts.length)?r:-1; }
function popPick(po,opt){ E.pop=null; E.pending=null; if (po.hs){ E.actionTok(); E.doVerb(opt.v,po.hs); return; } if (opt.pend){ E.pending=po.item; return; } E.doItem(opt.v==='use2'?'use2':opt.v,po.item); }
function drawPop(){ var p=E.pop; if (!p) return; if (p.room!==E.room||E.busy||E.speech||E.dlg||E.overlay||E.menu||E.screen!=='game'){ E.pop=null; return; } var c=ui();
  fb.rect(p.bx,p.by,p.bw,p.bh,P.k1); fb.rect(p.bx+1,p.by+1,p.bw-2,POP_RH,P.k2); fb.hl(p.bx,p.bx+p.bw-1,p.by,c.fr); fb.hl(p.bx,p.bx+p.bw-1,p.by+p.bh-1,c.fr); fb.vl(p.bx,p.by,p.by+p.bh-1,c.fr); fb.vl(p.bx+p.bw-1,p.by,p.by+p.bh-1,c.fr);
  M.text(fb,p.title,p.bx+7,p.by+4,c.hi);
  p.opts.forEach(function(o,i){ var ry=p.by+2+(i+1)*POP_RH, hot=hoverUI==='p:'+i; if (hot) fb.rect(p.bx+2,ry,p.bw-4,POP_RH-1,c.sel); fb.hl(p.bx+4,p.bx+p.bw-5,ry-1,P.k2); M.text(fb,o.t,p.bx+7,ry+2,hot?c.hi:c.tx); }); }

// ---------------------------------------------------------------- Gespräche: Porträts links/rechts, Auswahl in der Mitte
var PCACHE={};
function portraitBuf(chId,hd){ var key=chId+':'+hd; if (PCACHE[key]) return PCACHE[key];
  var s=M.poseBuf(M.poseF({hd:hd}),chId), top=s.h, x, y; for (y=0;y<s.h&&top===s.h;y++) for (x=0;x<s.w;x++) if (s.d[y*s.w+x]!==T){ top=y; break; }
  var cw=21, ch=22, cx0=M.SPR.OX-10, b=new Buf(cw,ch,T); for (y=0;y<ch;y++) for (x=0;x<cw;x++){ var sy=top-1+y, sx=cx0+x; if (sy>=0&&sy<s.h&&sx>=0&&sx<s.w) b.d[y*cw+x]=s.d[sy*s.w+sx]; }
  return (PCACHE[key]=b); }
M.portraitBuf=portraitBuf;
var PR_W=58, PR_H=64, PR_L=[4,6], PR_R=[W-4-PR_W,6], NB_X=68, NB_W=184, NB_Y=6, NB_LH=10, NB_TW=162;
function convOn(){ return !!(E.screen==='game' && E.room && !E.overlay && !E.menu && (E.dlg || (E.conv && E.conv.room===E.room))); }
function convPartner(){ if (!E.conv||!E.conv.npc) return null; var a=E.ACT[E.conv.npc]; return (a && M.CHARS[a.ch] && !a.player)?a:null; }
function drawPortrait(a,pos,mirror,speaking,dim){ var x0=pos[0], y0=pos[1], hd='n', c=ui(); var g=E.gt();
  if (speaking) hd=(Math.floor(g/130)%2)?'o':'n'; else if ((g+(mirror?1700:0))%4300<120) hd='b';
  var pb=portraitBuf(a.ch,hd), sc=PR_W/pb.w, ox=x0, oy=y0+PR_H-Math.round(pb.h*sc);
  // Rahmen + Hintergrund (abhängig von Geist / Lebend)
  var ghostLook=a.ghost && !isG(), bgR=a.ghost?M.R('x0 x1 x2'):(isG()?M.R('k1 k2 n0'):M.R('w0 w1 w2'));
  for (var y=0;y<PR_H;y++) for (var x=0;x<PR_W;x++){ var v=y/PR_H; var col=M.rampAt(bgR,0.7-v*0.6,x0+x,y0+y);
    var bx=Math.floor((mirror?(PR_W-1-x):x)/sc), by=Math.floor((y0+y-oy)/sc); if (by>=0&&by<pb.h&&bx>=0&&bx<pb.w){ var pc=pb.d[by*pb.w+bx]; if (pc!==T){ col=pc; if (ghostLook) col=(a.id==='mala'?M.TINT.mala:M.TINT.spirit).a[col]; else if (isG() && !a.ghost) col=M.tintPx(M.TINT.ghost,col,x,y); } }
    if (dim) col=M.DN[col]; fb.px(x0+x,y0+y,col); }
  var fr=a.ghost?P.x2:c.fr; fb.hl(x0-1,x0+PR_W,y0-1,fr); fb.hl(x0-1,x0+PR_W,y0+PR_H,fr); fb.vl(x0-1,y0-1,y0+PR_H,fr); fb.vl(x0+PR_W,y0-1,y0+PR_H,fr);
  var nm=a.name||a.id, nw=M.textWidth(nm); M.text(fb,nm,x0+Math.floor((PR_W-nw)/2),y0+PR_H+4,dim?P.k2:(a.color===undefined?P.s6:a.color),P.k0); }
function dlgBye(){ if (!E.dlg) return -1; for (var i=E.dlg.opts.length-1;i>=0;i--) if (E.dlg.opts[i].bye) return i; return -1; }
function drawConv(){ if (!convOn()) return; var who=E.speech?E.speech.who:null, pa=convPartner(), me=E.ACT[GS().active];
  if (pa){ if (me && !E.room.noActor) drawPortrait(me,PR_L,false,who===me.id,!!(who&&who!==me.id&&who===pa.id)); drawPortrait(pa,PR_R,true,who===pa.id,!!(who&&me&&who===me.id)); }
  if (E.dlg) drawChoices(); }
function drawChoices(){ var d=E.dlg, o=d.opts, g=isG(), x0=NB_X, w=NB_W, tx=x0+14, y, i; if (!convPartner()){ x0=40; w=240; tx=x0+14; }
  var tw=w-24; if (d.top>=o.length) d.top=Math.max(0,o.length-1);
  var head=d.title||(convPartner()?(convPartner().name||''):''), hh=head?13:4, rows=[], yy=NB_Y+hh+3, more=false, maxY=SH+52;
  for (var k=d.top;k<o.length;k++){ var ls=o[k].lines||(o[k].lines=M.wrap(o[k].t,tw)), h=ls.length*NB_LH+5; if (yy+h>maxY-((k<o.length-1||d.top>0)?13:0)){ more=true; break; } rows.push({k:k,y:yy,h:h,ls:ls}); yy+=h; }
  if (!rows.length && d.top<o.length){ var l1=o[d.top].lines; rows.push({k:d.top,y:yy,h:l1.length*NB_LH+5,ls:l1}); yy+=rows[0].h; more=d.top<o.length-1; }
  var pager=more||d.top>0, foot=pager?13:0, y1=yy+foot+3;
  // Papier (Marko) oder dunkles Glas (Mala)
  if (!g){ fb.map(x0+3,NB_Y+3,w,y1-NB_Y,M.DN); fb.rect(x0,NB_Y,w,y1-NB_Y,P.s5); for (y=NB_Y+hh+12;y<y1-2;y+=NB_LH) fb.hl(x0+1,x0+w-2,y,P.s4); fb.vl(x0+10,NB_Y+1,y1-2,P.r4); fb.hl(x0,x0+w-1,NB_Y,P.s6);
    fb.ellipse(x0+w-24,y1-14,9,6,function(px,py){ var dd=Math.hypot((px-(x0+w-24))/9,(py-(y1-14))/6); return (dd>0.78&&dd<1&&bayer(px,py)<0.6)?P.s3:fb.get(px,py); }); }
  else { for (y=NB_Y;y<y1;y++) for (var x=x0;x<x0+w;x++){ var cc=fb.get(x,y); fb.px(x,y,bayer(x,y)<0.75?P.x0:M.DN[M.DN[cc]]); } fb.hl(x0,x0+w-1,NB_Y,P.x2); fb.hl(x0,x0+w-1,y1-1,P.x2); fb.vl(x0,NB_Y,y1-1,P.x2); fb.vl(x0+w-1,NB_Y,y1-1,P.x2); }
  fb.hl(x0-1,x0+w,NB_Y-1,P.k1); fb.hl(x0-1,x0+w,y1,P.k1); fb.vl(x0-1,NB_Y,y1-1,P.k1); fb.vl(x0+w,NB_Y,y1-1,P.k1);
  if (head) M.text(fb,head,tx,NB_Y+3,g?P.x4:P.n2);
  var bye=dlgBye(), lay={rows:[],close:null,up:null,dn:null};
  if (bye>=0){ var cxx=x0+w-11, cyy=NB_Y+3, hot=hoverUI==='cx', cc2=hot?P.r4:(g?P.x3:P.n2); for (i=0;i<6;i++){ fb.px(cxx+i,cyy+i,cc2); fb.px(cxx+i+1,cyy+i,cc2); fb.px(cxx+5-i,cyy+i,cc2); fb.px(cxx+6-i,cyy+i,cc2); } lay.close=[x0+w-24,NB_Y-3,26,16]; }
  var talk=!!convPartner();
  rows.forEach(function(r){ var hot=pointer.show&&hoverUI==='c:'+r.k, asked=talk&&!o[r.k].bye&&!o[r.k].noGray&&GS().seen['ask:'+o[r.k].t], col=g?(hot?P.x6:(asked?P.x2:P.x4)):(hot?P.n0:(asked?P.s2:P.n1));
    if (hot) fb.rect(x0+11,r.y+1,w-12,r.h-2,g?P.x1:P.s6);
    if (o[r.k].ask){ fb.px(tx-5,r.y+4,col); fb.px(tx-4,r.y+5,col); fb.px(tx-5,r.y+6,col); }
    r.ls.forEach(function(l,j){ M.text(fb,l,tx,r.y+3+j*NB_LH,col); }); lay.rows.push({k:r.k,r:[x0+11,r.y,w-11,r.h]}); });
  if (pager){ var py=y1-foot-1, upOn=d.top>0, dnOn=more, tri=function(cx,up,on,hot){ var c=on?(hot?(g?P.x6:P.n0):(g?P.x4:P.n2)):(g?P.x1:P.s3); for (var t=0;t<5;t++){ var ty=up?py+3+t:py+7-t; fb.hl(cx-t,cx+t,ty,c); } };
    tri(x0+w/2-20|0,true,upOn,hoverUI==='cu'); tri(x0+w/2+20|0,false,dnOn,hoverUI==='cd'); lay.up=upOn?[x0+11,py,w/2-11,foot+3]:null; lay.dn=dnOn?[x0+w/2,py,w/2,foot+3]:null; }
  d.lay=lay; }

// ---------------------------------------------------------------- Sprechtext
function speakerPos(who){ var a=E.ACT[who]; if (a && E.actorShown(a) && E.room){ return [Math.round(a.x)-Math.round(E.camX), Math.round(a.y)-(a.speechY||(a.idle&&/sit|mend|cards|guitar/.test(a.idle)?40:54))]; } return null; }
function drawSpeech(){ var sp=E.speech; if (!sp) return; var o=sp.opt||{}, lh=10, cx=160, top=14, col=o.color!==undefined?o.color:P.l0, a=E.ACT[sp.who], M2=8;
  var lines=M.wrap(sp.text,200), pos=speakerPos(sp.who);
  if (a) col=o.color!==undefined?o.color:a.color;
  if (sp.who&&sp.who[0]==='@'){ var nm=sp.who.slice(1); if (M.CAST_COLORS[nm]!==undefined && o.color===undefined) col=M.CAST_COLORS[nm]; }
  if (pos){ cx=pos[0]; top=pos[1]-lines.length*lh-2; }
  var inConv=convOn()&&!E.dlg&&a&&(a.player||a===convPartner())&&o.x===undefined&&convPartner();
  if (inConv){ lines=M.wrap(sp.text,NB_W-10); cx=160; top=10; pos=null; M2=PR_W+12; }
  if (o.x!==undefined) cx=o.x; if (o.y!==undefined) top=o.y;
  if (sp.who==='#'){ lines=M.wrap(sp.text,240); cx=160; top=Math.max(8,60-lines.length*lh/2); }
  if (o.phone){ lines=M.wrap(sp.text,220); cx=160; top=18; }
  if (top<4) top=4; if (top+lines.length*lh>SH-4 && o.y===undefined) top=Math.max(4,SH-4-lines.length*lh);
  var bw=0; lines.forEach(function(l){ bw=Math.max(bw,M.textWidth(l)); }); var bx=Math.max(M2,Math.min(W-M2-bw,cx-(bw>>1)));
  var x0=bx-5, x1=bx+bw+5, y0=top-3, y1=top+lines.length*lh+1;
  if (sp.who!=='#'){ for (var y=Math.max(0,y0);y<=Math.min(H-1,y1);y++) for (var x=Math.max(0,x0);x<=Math.min(W-1,x1);x++){ var edge=Math.min(x-x0,x1-x,y-y0,y1-y); if (edge<0) continue; if (edge===0&&((x+y)&1)) continue; if ((x===x0||x===x1)&&(y===y0||y===y1)) continue; var k=y*W+x, c=fb.d[k]; c=M.DN[M.DN[M.DN[c]]]; if (edge>1) c=((x+y)&1)?P.k0:M.DN[c]; fb.d[k]=c; } }
  if (o.phone){ M.text(fb,'☎',x0-1,y0,col); }
  lines.forEach(function(l,i){ var w=M.textWidth(l), x=Math.max(M2,Math.min(W-M2-w,cx-Math.floor(w/2))); if (bw>w&&pos===null) x=bx+((bw-w)>>1); M.text(fb,l,x+1,top+i*lh+1,P.k0); M.text(fb,l,x,top+i*lh,col,P.k0); });
  if (E.tapText() && E.busy && E.gt()>=sp.until && (Math.floor(E.gt()/400)%2)){ var tx=Math.min(W-6,bx+bw+3), ty=top+lines.length*lh-5; for (var t=0;t<3;t++) fb.hl(tx-2+t,tx+2-t,ty+t,P.l0); } }

// ---------------------------------------------------------------- Overlays
function dimAll(n){ for (var i=0;i<W*H;i++){ var c=fb.d[i]; for (var k=0;k<(n||2);k++) c=M.DN[c]; fb.d[i]=c; } }
function paper(x,y,w,h,opt){ opt=opt||{}; var base=opt.col||P.s5; fb.rect(x+2,y+2,w,h,P.k0); fb.rect(x,y,w,h,base); for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ if (M.hash(xx,yy)<0.035) fb.px(xx,yy,M.DN[base]); }
  fb.hl(x,x+w-1,y,M.UP[base]); fb.vl(x+w-1,y,y+h-1,M.DN[base]); fb.hl(x,x+w-1,y+h-1,M.DN[base]); if (opt.lines){ for (var ly=y+opt.lines[0];ly<y+h-4;ly+=opt.lines[1]) fb.hl(x+3,x+w-4,ly,P.b4); } if (opt.margin) fb.vl(x+opt.margin,y+1,y+h-2,P.r4); }
M.paper=paper; M.dimAll=dimAll;
function drawOverlay(){ var ov=E.overlay; if (!ov) return; dimAll(2); var fn=M.OVERLAYS[ov.kind]; if (fn) fn(fb,ov,E.gt()); }
// Tipp
M.defineOverlay('hint',function(fb,ov){ var d=ov.data; paper(36,10,248,124,{lines:[24,9],margin:12}); M.text(fb,'GEDANKEN',54,14,P.k1);
  var y=28; M.text(fb,'Was ich vorhabe:',54,y,P.r2); y+=10; M.wrap(d.goal||'',216).forEach(function(l){ M.text(fb,l,58,y,P.k1); y+=9; });
  if (d.hint){ y+=5; M.text(fb,d.tier!==undefined?('Ein Gedanke ('+(d.tier+1)+' von '+d.of+'):'):'Ein Gedanke:',54,y,P.r2); y+=10; M.wrap(d.hint,216).forEach(function(l){ M.text(fb,l,58,y,P.n1); y+=9; }); } });
// Dokument (Brief, Postkarte, Buch, Register, Ticket, Zeitung)
M.defineOverlay('doc',function(fb,ov){ var d=ov.data, st=d.style||'letter', w=d.w||220, lines=[], col=P.s5, ink=P.k1, x, y;
  (d.lines||[]).forEach(function(l){ if (l==='') lines.push(''); else M.wrap(l,w-28).forEach(function(q){ lines.push(q); }); });
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
  M.text(fb,d.title||'Nachhall',x0,y0+h+4,P.x4);
  var lines=d.lines||[], shown=lines.slice(0,ov.step+1), ty=y0+h+15;
  shown.forEach(function(l,i){ M.wrap(l,w).forEach(function(q){ M.text(fb,q,x0,ty,i===ov.step?P.x5:P.x3); ty+=9; }); });
  if (Math.floor(gt/500)%2) M.text(fb,ov.step<lines.length-1?'▸':'✓',x0+w-6,H-10,P.x4); });
// Satzbau-Rätsel (Übersetzung)
M.defineOverlay('puzzle',function(fb,ov){ var d=ov.data; ov.sel=ov.sel||d.slots.map(function(){ return 0; }); paper(20,8,280,178,{lines:[30,22],margin:12});
  M.text(fb,d.title||'Übersetzung',36,12,P.r2); M.wrap(d.hint||'Tippe auf eine Zeile, um eine andere Fassung zu wählen.',250).forEach(function(l,i){ M.text(fb,l,36,22+i*9,P.s2); });
  var lay=[]; d.slots.forEach(function(sl,i){ var y=44+i*22, hot=hoverUI==='z:'+i, bad=ov.bad===i; fb.rect(32,y-2,256,18,hot?P.s6:(bad?P.r4:P.s4)); M.text(fb,(i+1)+'.',36,y+3,P.r2); M.text(fb,sl[ov.sel[i]],48,y+3,P.n0); fb.px(280,y+4,P.n2); fb.px(281,y+5,P.n2); fb.px(280,y+6,P.n2); lay.push([32,y-2,256,18]); });
  var by=44+d.slots.length*22+4, hot2=hoverUI==='zgo'; fb.rect(110,by,100,14,hot2?P.n2:P.n1); M.text(fb,d.button||'Vorlesen',160-(M.textWidth(d.button||'Vorlesen')>>1),by+3,P.s6); ov.lay={rows:lay,go:[110,by,100,14],close:[262,8,38,16]};
  M.text(fb,'Zurück',262,12,hoverUI==='zx'?P.r3:P.s2);
  if (ov.msg) M.wrap(ov.msg,250).forEach(function(l,i){ M.text(fb,l,36,by+18+i*9,P.r2); }); });

// ---------------------------------------------------------------- Notizbuch (Der Fall / Notizen, Verbinden, Fragen)
function notesOf(){ var g=GS(); var list=g.notes.slice(); var ph=M.PHASES[g.phase]||{}; var cs=ph.case; var mine=list.filter(function(id){ var n=M.NOTES[id]; return !cs || !n.c || n.c===cs || n.c==='mala'; }); return mine.length?mine:list; }
var NB={page:'case',sel:null,top:0,msg:null,lay:null};
E.openNotes=function(){ NB.page='notes'; NB.sel=null; NB.top=0; NB.msg=null; return showNotes(); };
function showNotes(){ return E.showOverlay('notebook',{mode:'browse'}); }
M.defineOverlay('notebook',function(fb,ov,gt){ var d=ov.data, ask=d.mode==='ask'; if (ask) NB.page='notes'; if (ov.page && !ov.init){ NB.page=ov.page; ov.init=1; NB.top=0; NB.sel=null; NB.msg=null; }
  var lx=6, rx=162, y0=6, pw=152, ph=182, g=GS();
  paper(lx,y0,pw,ph,{lines:[22,9],margin:10}); paper(rx,y0,pw,ph,{lines:[22,9],margin:10}); fb.vl(159,y0,y0+ph,P.k1); fb.vl(160,y0,y0+ph,P.s2);
  var lay={notes:[],tabCase:[lx+14,y0+2,60,14],tabNotes:[rx+14,y0+2,70,14],close:[rx+pw-22,y0+2,20,14],up:null,dn:null};
  // linke Seite: der Fall
  var ph0=M.PHASES[g.phase]||{}; M.text(fb,'DER FALL',lx+16,y0+5,NB.page==='case'?P.r2:P.s2);
  var y=y0+22; M.wrap(ph0.title||'',pw-26).forEach(function(l){ M.text(fb,l,lx+16,y,P.k1); y+=9; }); y+=2;
  M.text(fb,'Ziel:',lx+16,y,P.r2); y+=9; M.wrap(E.currentGoal(),pw-30).forEach(function(l){ M.text(fb,l,lx+20,y,P.n1); y+=9; }); y+=3;
  var L=E.leads(); M.text(fb,'Spuren:',lx+16,y,P.r2); y+=9;
  if (!L.leads.length){ M.text(fb,'Keine offenen.',lx+20,y,P.s2); y+=9; }
  L.leads.slice(0,5).forEach(function(t){ var ls=M.wrap(t,pw-36); if (y+ls.length*9>y0+ph-22) return; fb.rect(lx+16,y+2,4,4,P.n2); ls.forEach(function(l){ M.text(fb,l,lx+24,y,P.n1); y+=9; }); });
  if (L.tot){ var by=y0+ph-14, bw=80, fw=Math.round(bw*L.done/L.tot); M.text(fb,'Stand',lx+16,by-1,P.s1); fb.rect(lx+46,by,bw+2,6,P.s2); fb.rect(lx+47,by+1,bw,4,P.s6); fb.rect(lx+47,by+1,fw,4,P.g3); }
  // rechte Seite: Notizen
  M.text(fb,ask?(d.title||'Wonach fragen?'):'NOTIZEN',rx+16,y0+5,P.r2); M.text(fb,ask?'Zurück':'X',rx+pw-(ask?34:12),y0+5,hoverUI==='nx'?P.r3:P.s1); if (ask) lay.close=[rx+pw-40,y0+2,38,14];
  var notes=notesOf(), ny=y0+20, maxY=y0+ph-(NB.msg?40:16);
  if (NB.top>=notes.length) NB.top=Math.max(0,notes.length-1);
  if (!notes.length){ M.text(fb,'Noch nichts.',rx+16,ny,P.s2); }
  for (var i=NB.top;i<notes.length;i++){ var n=M.NOTES[notes[i]], ls=M.wrap(n.t,pw-28), hh=ls.length*9+3; if (ny+hh>maxY){ lay.dn=[rx+pw/2,y0+ph-14,pw/2,14]; break; }
    var sel=NB.sel===notes[i], hot=hoverUI==='n:'+i, isNew=g.noteNew[notes[i]], ded=g.flags['deduced.'+notes[i]];
    if (sel) fb.rect(rx+12,ny-1,pw-16,hh,P.y4); else if (hot) fb.rect(rx+12,ny-1,pw-16,hh,P.s6);
    if (isNew) fb.rect(rx+12,ny+2,2,3,P.r4); if (ded) { fb.px(rx+13,ny+2,P.g3); fb.px(rx+14,ny+3,P.g3); }
    ls.forEach(function(l,j){ M.text(fb,l,rx+16,ny+j*9,ded?P.g1:P.n1); }); lay.notes.push({id:notes[i],idx:i,r:[rx+12,ny-1,pw-16,hh]}); ny+=hh+1; }
  if (NB.top>0) lay.up=[rx+12,y0+ph-14,pw/2-12,14];
  if (lay.up||lay.dn){ var tri=function(cx,up,on){ var c=on?P.n2:P.s3; for (var t=0;t<5;t++){ var ty=up?y0+ph-12+t:y0+ph-8-t; fb.hl(cx-t,cx+t,ty,c); } }; tri(rx+pw/2-16,true,!!lay.up); tri(rx+pw/2+16,false,!!lay.dn); }
  if (!ask){ var hint=NB.sel?'Zweite Notiz antippen zum Verbinden.':'Zwei Notizen antippen, um sie zu verbinden.'; if (!NB.msg) M.wrap(hint,pw-24).forEach(function(l,j){ M.text(fb,l,rx+16,y0+ph-26+j*9-(M.wrap(hint,pw-24).length>1?0:-9),P.s2); }); }
  if (NB.msg){ var my=y0+ph-38; fb.rect(rx+10,my-2,pw-14,36,NB.msg.ok?P.g5:P.s4); M.wrap(NB.msg.t,pw-26).slice(0,4).forEach(function(l,j){ M.text(fb,l,rx+14,my+j*9,NB.msg.ok?P.g0:P.k1); }); }
  ov.lay=lay; });
async function notebookTap(x,y){ var ov=E.overlay, lay=ov.lay; if (!lay) return; var inR=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; }, ask=ov.data.mode==='ask';
  if (inR(lay.close)){ NB.sel=null; NB.msg=null; E.closeOverlay(null); return; }
  if (inR(lay.up)){ NB.top=Math.max(0,NB.top-3); return; } if (inR(lay.dn)){ NB.top=NB.top+3; return; }
  for (var i=0;i<lay.notes.length;i++){ var n=lay.notes[i]; if (!inR(n.r)) continue; delete GS().noteNew[n.id];
    if (ask){ NB.sel=null; E.closeOverlay(n.id); M.sfx('page'); return; }
    if (!NB.sel){ NB.sel=n.id; NB.msg=null; M.sfx('click'); return; }
    if (NB.sel===n.id){ NB.sel=null; return; }
    var a=NB.sel; NB.sel=null; var res=await E.combineNotes(a,n.id); NB.msg={ok:res.ok,t:res.ok?('Schlussfolgerung: '+res.t):res.t};
    if (res.ok && res.say){ /* gesprochen nach dem Schließen */ ov.after=res.say; } return; }
  if (x<160){ NB.page='case'; } }
// Text für das Notizbuch beim Schließen nachreichen
E.afterNotes=function(){ };

// ---------------------------------------------------------------- Zeigen (alle Hotspots kurz markieren)
var REVEAL_MS=4500;
function drawReveal(){ if (!reveal) return; if (E.gt()-reveal.at>REVEAL_MS||E.busy||E.dlg||E.overlay||E.menu||E.screen!=='game'||!E.room||E.room.noVerbs){ reveal=null; return; }
  var cx0=Math.round(E.camX), k=(E.gt()-reveal.at)/REVEAL_MS; if (k>0.85&&(Math.floor(E.gt()/90)%2)) return; var g=isG(), S=M.RS(E.room.id), list=[];
  E.room.hotspots.forEach(function(h){ if (h.vis&&!h.vis(S,GS())) return; if (h.who==='m'&&g) return; if (h.who==='g'&&!g) return; var r=E.hsRect(h); if (!r) return; if (r[2]*r[3]>W*SH*0.25||h.noReveal) return;
    var x=Math.round(r[0]+r[2]/2-cx0), y=Math.round(r[1]+r[3]/2); if (x<-4||x>W+4) return; list.push({h:h,x:Math.max(4,Math.min(W-5,x)),y:Math.max(4,Math.min(SH-5,y)),a:r[2]*r[3]}); });
  list.sort(function(a,b){ return a.a-b.a; }); var pulse=(Math.sin(E.gt()/160)+1)/2, placed=[];
  list.forEach(function(m){ var ex=g?m.h.gexit:m.h.exit, col=ex?P.g5:(m.h.npc?P.r4:(g?P.x5:P.y4)), R=2+Math.round(pulse); if (g && (m.h.g&&m.h.g.sense)) col=P.x6;
    for (var dy=-R-1;dy<=R+1;dy++) for (var dx=-R-1;dx<=R+1;dx++){ var d2=dx*dx+dy*dy; if (d2<=(R+1)*(R+1)) fb.px(m.x+dx,m.y+dy,d2<=R*R?col:P.k0); } fb.px(m.x,m.y,P.l1); });
  list.forEach(function(m){ var t=E.nameOf(m.h); if (!t) return; var w=M.textWidth(t), lx=Math.max(1,Math.min(W-1-w,m.x-(w>>1))), ly=m.y+6; if (ly+8>SH) ly=m.y-14; var box=[lx-2,ly-2,w+4,12];
    if (placed.some(function(b){ return box[0]<b[0]+b[2]&&b[0]<box[0]+box[2]&&box[1]<b[1]+b[3]&&b[1]<box[1]+box[3]; })) return; placed.push(box); M.text(fb,t,lx,ly,(g?m.h.gexit:m.h.exit)?P.g5:(g?P.x5:P.s6),P.k0); }); }

// ---------------------------------------------------------------- Menü
function menuItems(){ var inG=E.screen==='game', sl=E.slot(); return [
  {t:'Weiterspielen',a:function(){ E.menu=null; E.paused(false); }},
  {t:'Speichern (Platz '+sl+')',dis:E.busy||!inG||(E.room&&E.room.noSave),a:function(){ var ok=E.saveGame(); flash(ok?'Gespeichert.':'Hier geht Speichern nicht.'); }},
  {t:'Laden (Platz '+sl+')',dis:!E.hasSave(),a:function(){ if (E.loadGame()){ E.menu=null; E.paused(false); flash('Geladen.'); } else flash('Kein Spielstand.'); }},
  {t:'Text: '+(E.tapText()?'wartet auf Tippen':['langsam','normal','schnell'][E.textSpeed()]),a:function(){ if (E.tapText()) E.setText(0,false); else if (E.textSpeed()<2) E.setText(E.textSpeed()+1,false); else E.setText(1,true); }},
  {t:'Musik: '+(M.musicOn()?'an':'aus'),a:function(){ M.setMusic(!M.musicOn()); }},
  {t:'Geräusche: '+(M.soundOn()?'an':'aus'),a:function(){ M.setSound(!M.soundOn()); }},
  {t:'Röhrenbild: '+(M.crtOn&&M.crtOn()?'an':'aus'),a:function(){ if (M.setCRT) M.setCRT(!M.crtOn()); }},
  {t:'Vollbild',a:function(){ if (M.fullscreen) M.fullscreen(); }},
  {t:'Spielanleitung',a:function(){ E.menu=null; E.paused(false); help(); }},
  {t:'Zum Titelbild',a:function(){ E.menu=null; E.paused(false); E.toTitle(); }}]; }
function flash(t){ E.msg={t:t,until:E.gt()+1800}; }
M.flash=flash;
function menuY0(){ var h=34+menuItems().length*12; return Math.max(4,100-(h>>1)); }
function drawMenu(){ if (!E.menu) return; dimAll(2); var items=menuItems(), h=34+items.length*12, y0=menuY0(), c=ui();
  fb.rect(70,y0,180,h,P.k1); fb.hl(70,249,y0,c.fr); fb.hl(70,249,y0+h-1,c.fr); fb.vl(70,y0,y0+h-1,c.fr); fb.vl(249,y0,y0+h-1,c.fr);
  centerText('MALA – Kapitel 1: Split',y0+7,c.hi);
  items.forEach(function(it,i){ var y=y0+22+i*12, hot=hoverUI==='m:'+i; centerText(it.t,y,it.dis?c.dim:(hot?c.hi:c.tx)); }); }
function centerText(s,y,c,oc){ M.text(fb,s,160-(M.textWidth(s)>>1),y,c,oc); }
M.centerText=centerText;
async function help(){ if (E.busy||E.screen!=='game') return; E.busy=true; try{
  await M.API.m('Tippe etwas an: Ist nur etwas zu sehen, schaue ich es mir an. Kann man etwas damit tun, kommt ein kleines Menü.');
  await M.API.m('Gegenstände ziehst du aus der Leiste auf ihr Ziel. Auch auf Mala, wenn sie sich etwas ansehen soll.');
  if (GS().malaOn) await M.API.g('Unten links kannst du zu mir wechseln. Ich gehe durch Wände, sehe, was er nicht sieht, und spüre, was an den Dingen hängt.');
  await M.API.m('„Notizen“ ist mein Notizbuch. Zwei Notizen nacheinander antippen verbindet sie. Im Gespräch kann ich nach jeder Notiz fragen.');
  await M.API.m('„Tipp“ hilft, wenn ich festsitze. „Zeigen“ markiert alles, was man hier anfassen kann. Doppeltipp auf einen Ausgang bringt mich sofort hin.');
 } finally { E.busy=false; } }
M.help=help;

// ---------------------------------------------------------------- Titel, Karten, Abspann
var TITLE_BG=null;
function slotLabel(n){ var i=E.slotInfo(n); if (!i) return 'Platz '+n+':  leer'; var ph=M.PHASES[i.phase]||{}; var m=Math.max(1,Math.round(i.ms/60000)); var t='Platz '+n+':  '+(ph.short||ph.title||i.phase)+'  ('+(m<60?m+' Min.':Math.floor(m/60)+' Std. '+(m%60)+' Min.')+')'; while (M.textWidth(t)>210) t=t.slice(0,-2); return t; }
function titleItems(){ var tm=E.titleMode;
  if (tm==='slots'){ var b=[], cont=E.titleNext==='cont'; for (var k=1;k<=3;k++){ (function(k){ var has=E.hasSave(k); b.push({t:slotLabel(k),dis:cont&&!has,a:function(){ E.setSlot(k); if (cont){ E.titleMode='main'; if (!E.loadGame(k)) flash('Spielstand beschädigt.'); return; } if (has){ E.confirmSlot=k; E.titleMode='confirm'; return; } E.titleMode='main'; E.newGame(); }}); })(k); }
    b.push({t:'Zurück',a:function(){ E.titleMode='main'; }}); return b; }
  if (tm==='confirm') return [{t:'Ja, Platz '+E.confirmSlot+' neu beginnen',a:function(){ E.setSlot(E.confirmSlot); E.titleMode='main'; E.newGame(); }},{t:'Nein, behalten',a:function(){ E.titleMode='slots'; }}];
  var a=[]; if (E.anySave()) a.push({t:'Fortsetzen',a:function(){ E.titleNext='cont'; E.titleMode='slots'; }}); a.push({t:'Neues Spiel',a:function(){ E.titleNext='new'; E.titleMode='slots'; }}); a.push({t:'Über das Spiel',a:function(){ E.titleMode='about'; }}); if (E.titleMode==='about') return [{t:'Zurück',a:function(){ E.titleMode='main'; }}]; return a; }
function titleRowY(i,n){ if (E.titleMode==='main') return 150+i*12; var h=30+n*13, y0=Math.max(4,100-(h>>1)); return y0+24+i*13; }
function drawTitle(){ if (!TITLE_BG && M.paintTitle) TITLE_BG=M.paintTitle(); fb.rect(0,0,W,H,P.k0); if (TITLE_BG) for (var i=0;i<W*SH;i++) fb.d[i]=TITLE_BG.d[i];
  if (M.titleDynamic) M.titleDynamic(fb,E.gt()/1000);
  M.big(fb,'MALA',160,22,P.x5,4,P.k0); centerText('Kapitel eins: Split',58,P.s5,P.k0);
  if (E.titleMode==='about'){ dimAll(2); var lines=['MALA – Kapitel 1: Split','','Ein Point-and-Click-Adventure über Menschen,','die nicht weiterkommen, und über einen,','der mit ihnen reden kann.','','Marko lebt. Mala nicht.','Er spricht mit den Lebenden, sie geht durch Wände.','','Alle Grafik, Musik und Geräusche entstehen','im Spiel selbst. Kopfhörer lohnen sich.']; lines.forEach(function(l,i){ centerText(l,30+i*10,i===0?P.x5:P.s5); }); }
  var opts=titleItems(); if (E.titleMode==='slots'||E.titleMode==='confirm'){ dimAll(2); var h=30+opts.length*13, y0=Math.max(4,100-(h>>1)); fb.rect(46,y0,228,h,P.k1); fb.hl(46,273,y0,P.x2); fb.hl(46,273,y0+h-1,P.x2); fb.vl(46,y0,y0+h-1,P.x2); fb.vl(273,y0,y0+h-1,P.x2);
    centerText(E.titleMode==='confirm'?'Auf Platz '+E.confirmSlot+' liegt ein Spielstand. Neu beginnen?':(E.titleNext==='cont'?'Welchen Spielstand fortsetzen?':'Auf welchem Platz spielen?'),y0+8,P.x5); }
  opts.forEach(function(o,i){ var y=E.titleMode==='about'?184:titleRowY(i,opts.length), hot=hoverUI==='t:'+i; centerText(o.t,y,o.dis?P.x1:(hot?P.x6:P.x4)); }); }
function drawCard(){ var c=E.card; fb.rect(0,0,W,H,P.k0); var t=(E.gt()-c.at)/1000, a=Math.min(1,t/0.8), ms=(c.ms||4200)/1000, b=Math.min(1,(ms-t)/0.8);
  var k=Math.max(0,Math.min(a,b)); var col=function(base){ var n=Math.round((1-k)*5); var cc=base; for (var i=0;i<n;i++) cc=M.DN[cc]; return cc; };
  if (c.kicker) centerText(c.kicker,62,col(P.x3)); M.big(fb,c.title||'',160,78,col(P.s6),2,P.k0); if (c.sub) centerText(c.sub,104,col(P.s4)); if (c.time) centerText(c.time,118,col(P.x3)); }
function drawCredits(){ fb.rect(0,0,W,H,P.k0); var t=(E.gt()-E.creditsAt)/1000, lines=M.CREDITS||[], y=200-t*14;
  lines.forEach(function(l,i){ var yy=Math.round(y+i*12); if (yy<-10||yy>H) return; centerText(l,yy,l===l.toUpperCase()&&l.length>2?P.x5:P.s5); }); if (y+lines.length*12<-20){ E.toTitle(); } }
E.startCredits=function(){ E.screen='credits'; E.creditsAt=E.gt(); M.music('end'); };
function drawCursor(){ if (!pointer.show||pointer.touch) return; var x=Math.round(pointer.x), y=Math.round(pointer.y), c=hover||hoverUI?((Math.floor(E.gt()/140)%2)?(isG()?P.x5:P.y4):P.s6):(isG()?P.x3:P.y3); if (E.busy&&E.screen==='game'&&!E.dlg) c=P.k2;
  for (var i=2;i<=5;i++){ fb.px(x-i,y,c); fb.px(x+i,y,c); fb.px(x,y-i,c); fb.px(x,y+i,c); } }
function applyFade(){ var n=Math.round(E.fade); if (n<=0) return; for (var i=0;i<fb.d.length;i++){ var c=fb.d[i]; for (var k=0;k<n;k++) c=M.DN[c]; fb.d[i]=c; } }
function drawMsg(){ if (!E.msg||E.gt()>E.msg.until) return; var t=E.msg.t, ls=M.wrap(t,250), y=E.screen==='game'?SH-12-ls.length*9:186; ls.forEach(function(l,i){ var w=M.textWidth(l); fb.rect(160-(w>>1)-3,y+i*9-1,w+6,9,P.k1); M.text(fb,l,160-(w>>1),y+i*9,E.msg.note?(isG()?P.x5:P.y4):P.s6); }); }
function drawDrag(){ if (!drag||!drag.on) return; var it=M.ITEMS[drag.id], ic=iconOf(drag.id); var x=Math.round(pointer.x), y=Math.round(pointer.y), ix=x-(ic.w>>1), iy=y-ic.h-8; fb.blit(ic,ix,iy);
  var tgt=null; if (pointer.y<SH && hover && !hover.item) tgt=E.nameOf(hover); else { var u=uiAt(pointer.x,pointer.y); if (u&&u[0]==='i'){ var o=invList()[+u.slice(2)]; if (o&&o!==drag.id) tgt=M.ITEMS[o].name; } }
  var lab=tgt?('Benutze '+it.name+' mit '+tgt):it.name, lw=M.textWidth(lab), lx=Math.max(2,Math.min(W-2-lw,x-(lw>>1))), ly=Math.max(2,iy-11); M.text(fb,lab,lx,ly,tgt?P.l0:P.s4,P.k0); }
M.renderFrame=function(){
  if (E.screen==='title') drawTitle();
  else if (E.screen==='card') drawCard();
  else if (E.screen==='credits') drawCredits();
  else if (E.room){ drawScene(); drawReveal(); drawUI(); drawConv(); drawOverlay(); drawSpeech(); drawPop(); drawDrag(); }
  applyFade(); drawMenu(); drawMsg(); drawCursor(); return fb; };

// ---------------------------------------------------------------- Eingabe
function uiAt(x,y){
  if (E.menu){ var items=menuItems(), y0=menuY0(); for (var i=0;i<items.length;i++){ var yy=y0+22+i*12; if (y>=yy-2&&y<yy+10&&x>=74&&x<246) return 'm:'+i; } return null; }
  if (E.screen==='title'){ var t=titleItems(); for (i=0;i<t.length;i++){ var ty=E.titleMode==='about'?184:titleRowY(i,t.length); if (y>=ty-2&&y<ty+(E.titleMode==='main'?10:11)&&x>=46&&x<274) return 't:'+i; } return null; }
  if (E.screen!=='game') return null;
  var ov=E.overlay; if (ov){ var inR=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; };
    if (ov.kind==='notebook'&&ov.lay){ if (inR(ov.lay.close)) return 'nx'; for (var q=0;q<ov.lay.notes.length;q++) if (inR(ov.lay.notes[q].r)) return 'n:'+ov.lay.notes[q].idx; return null; }
    if (ov.kind==='puzzle'&&ov.lay){ if (inR(ov.lay.go)) return 'zgo'; if (inR(ov.lay.close)) return 'zx'; for (var z=0;z<ov.lay.rows.length;z++) if (inR(ov.lay.rows[z])) return 'z:'+z; return null; }
    return null; }
  if (E.pop && !E.dlg){ var pr=popAt(x,y); if (pr!==null) return pr>=0?'p:'+pr:'pop'; }
  if (E.dlg){ var L=E.dlg.lay; if (!L) return null; var inR2=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; }; if (inR2(L.close)) return 'cx'; if (inR2(L.up)) return 'cu'; if (inR2(L.dn)) return 'cd'; for (var ri=0;ri<L.rows.length;ri++) if (inR2(L.rows[ri].r)) return 'c:'+L.rows[ri].k; return null; }
  if (y>=SH&&y<SH+15){ var bt=btnAt(x,y); if (E.room&&E.room.noVerbs&&bt!=='menu') return null; return bt; }
  if (y<SH) return null; if (E.room&&E.room.noVerbs) return null;
  if (x>=SW_X&&x<SW_X+SW_W&&y>=INV_Y-1) return 'sw';
  if (y>=INV_Y-2){ if (x>=INV_X-10&&x<INV_X) return 'up'; if (x>=INV_X+INV_N*SLOT_W&&x<INV_X+INV_N*SLOT_W+12) return 'dn'; }
  if (x>=INV_X&&x<INV_X+INV_N*SLOT_W&&y>=INV_Y-2&&y<INV_Y+SLOT_H){ var c=Math.floor((x-INV_X)/SLOT_W); return 'i:'+(E.invTop*INV_N+c); }
  return null; }
function updateHover(){ hoverUI=uiAt(pointer.x,pointer.y); if (E.menu||E.overlay||E.dlg||!E.room){ hover=null; return; }
  if (pointer.y<SH&&pointer.show) hover=E.hotspotAt(pointer.x+Math.round(E.camX),pointer.y); else if (hoverUI&&hoverUI[0]==='i'){ var id=invList()[+hoverUI.slice(2)]; hover=id?{item:id}:null; } else hover=null; }
M.pointerMove=function(x,y,touch){ pointer.x=x; pointer.y=y; pointer.touch=!!touch; pointer.show=true; if (pointer.down&&press&&!drag&&E.screen==='game') dragCheck(x,y); updateHover(); };
M.pointerDown=function(x,y,touch){ M.audioInit(); pointer.down=true; drag=null; press={x:x,y:y,ui:(E.screen==='game'?uiAt(x,y):null),t:E.gt()}; M.pointerMove(x,y,touch); };
M.pointerUp=function(x,y,touch){ pointer.down=false; M.pointerMove(x,y,touch); if (touch) setTimeout(function(){ if (!pointer.down) pointer.show=false; },350);
  var pr=press; press=null; if (drag){ var dg=drag; drag=null; if (dg.on) dropDrag(dg.id,x,y); return; } if (pr&&pr.swiped) return; click(x,y); };
function canDrag(){ return E.screen==='game'&&!E.busy&&!E.dlg&&!E.overlay&&!E.menu&&!(E.room&&E.room.noVerbs)&&!isG(); }
function dragCheck(x,y){ var u=press.ui; if (!u||u[0]!=='i'||!canDrag()) return; var id=invList()[+u.slice(2)], dx=x-press.x, dy=y-press.y;
  if (id && !press.swiped && y<INV_Y-6){ E.pop=null; drag={id:id,on:true}; M.sfx('click'); return; }
  if (!press.swiped && Math.abs(dx)>22 && Math.abs(dx)>Math.abs(dy)*1.5){ var pages=Math.ceil(invList().length/INV_N); press.swiped=true; if (dx<0&&E.invTop<pages-1){ E.invTop++; M.sfx('page'); } else if (dx>0&&E.invTop>0){ E.invTop--; M.sfx('page'); } } }
function dropDrag(id,x,y){ if (!canDrag()||invList().indexOf(id)<0) return; E.pop=null;
  if (y<SH){ var wx=x+Math.round(E.camX), hs=E.hotspotAt(wx,y); if (!hs) return; E.pending=null; E.actionTok(); E.setLastClick([wx,y]); E.doVerb('use',hs,id); return; }
  var u=uiAt(x,y); if (u&&u[0]==='i'){ var other=invList()[+u.slice(2)]; if (other&&other!==id){ E.pending=null; E.doItem('use',id,other); } } }
var lastExit=null;
async function click(x,y){
  if (E.menu){ var u=uiAt(x,y); if (u&&u[0]==='m'){ var it=menuItems()[+u.slice(2)]; if (!it.dis){ M.sfx('click'); it.a(); } } else { E.menu=null; E.paused(false); } return; }
  if (E.screen==='title'){ var ut=uiAt(x,y); if (ut&&ut[0]==='t'){ var o=titleItems()[+ut.slice(2)]; if (o&&!o.dis){ M.sfx('click'); o.a(); } } else if (E.titleMode==='about') E.titleMode='main'; return; }
  if (E.screen==='card'){ if (!E.card.noSkip) E.closeCard(); return; }
  if (E.screen==='credits'){ if (E.gt()-E.creditsAt>3000) E.toTitle(); return; }
  if (E.screen!=='game') return;
  var ov=E.overlay;
  if (ov){ if (ov.kind==='notebook'){ await notebookTap(x,y); return; }
    if (ov.kind==='memory'){ var n=(ov.data.lines||[]).length; if (ov.step<n-1){ ov.step++; M.sfx('shimmer'); } else E.closeOverlay(); return; }
    if (ov.kind==='puzzle'){ var u2=uiAt(x,y); if (!u2) return; if (u2==='zx'){ E.closeOverlay(null); return; } if (u2==='zgo'){ var res=ov.data.check?ov.data.check(ov.sel):{ok:true}; if (res&&res.ok){ E.closeOverlay(ov.sel.slice()); } else { ov.bad=res?res.bad:-1; ov.msg=res&&res.msg; M.sfx('nope'); } return; }
      if (u2[0]==='z'){ var zi=+u2.slice(2); ov.sel[zi]=(ov.sel[zi]+1)%ov.data.slots[zi].length; ov.bad=-1; ov.msg=null; M.sfx('page'); } return; }
    E.closeOverlay(); return; }
  if (E.speech && (E.busy||E.dlg)){ if (E.gt()-E.speech.at>200) E.endSpeech(); return; }
  if (E.dlg){ var ud=uiAt(x,y), D=E.dlg; if (!ud) return; if (ud==='cx'){ var bi=dlgBye(); if (bi>=0) E.chooseDone(bi); return; } if (ud==='cu'){ D.top=Math.max(0,D.top-1); return; } if (ud==='cd'){ D.top=Math.min(D.opts.length-1,D.top+1); return; } if (ud[0]==='c'){ M.sfx('click'); E.chooseDone(+ud.slice(2)); } return; }
  var uiH=uiAt(x,y);
  if (E.pop){ var pr=popAt(x,y); if (pr!==null){ if (pr>=0){ M.sfx('click'); popPick(E.pop,E.pop.opts[pr]); } return; } E.pop=null; if (!uiH || y<SH) { if (y<SH) return; } }
  if (uiH==='hint'){ if (!E.busy) E.useHint(); return; }
  if (uiH==='notes'){ if (!E.busy) E.openNotes(); return; }
  if (uiH==='reveal'){ reveal={at:E.gt()}; M.sfx('click'); return; }
  if (uiH==='menu'){ E.menu=true; E.paused(true); return; }
  if (uiH==='sw'){ E.switchChar(); return; }
  if (uiH==='up'){ if (E.invTop>0){ E.invTop--; M.sfx('page'); } return; }
  if (uiH==='dn'){ var pages=Math.ceil(invList().length/INV_N); if (E.invTop<pages-1){ E.invTop++; M.sfx('page'); } return; }
  if (E.busy) return;
  if (uiH && uiH[0]==='i'){ var id=invList()[+uiH.slice(2)]; if (!id) return;
    if (E.pending && E.pending!==id){ var p0=E.pending; E.pending=null; E.doItem('use',p0,id); return; }
    if (E.pending===id){ E.pending=null; return; }
    var opts=itemOpts(id); var sx=INV_X+((+uiH.slice(2))%INV_N)*SLOT_W+SLOT_W/2; openPop({title:M.ITEMS[id].name,opts:opts,item:id,x:sx,y:INV_Y}); return; }
  if (y>=SH) return;
  var wx=x+Math.round(E.camX), hs=E.hotspotAt(wx,y);
  if (E.pending){ var pid=E.pending; E.pending=null; if (hs){ E.actionTok(); E.setLastClick([wx,y]); E.doVerb('use',hs,pid); } return; }
  if (!hs){ E.actionTok(); E.walkPlayerTo(wx,y); return; }
  E.setLastClick([wx,y]);
  var ex=isG()?(hs.gexit||(hs.exit&&hs.exit.gok?hs.exit:null)):hs.exit; if (typeof ex==='function') ex=ex(M.RS(E.room.id),GS());
  var opts2=hsOpts(hs);
  if (!opts2){ if (ex){ var now=E.gt(); if (lastExit&&lastExit.hs===hs&&now-lastExit.t<700){ fastExit(hs,ex); return; } lastExit={hs:hs,t:now}; E.actionTok(); E.doVerb(isG()&&hs.gexit?'pass':'walk',hs); return; }
    // reiner Blickfang: einfach ansehen
    E.actionTok(); E.doVerb('look',hs); return; }
  openPop({title:E.nameOf(hs),opts:opts2,hs:hs,x:x,y:y}); }
function fastExit(hs,ex){ var p=E.player(); if (!p) return; var st=hs.st; if (typeof st==='function') st=st(M.RS(E.room.id),GS()); if (st){ p.x=st[0]; p.y=st[1]; } E.actionTok(); E.doVerb(isG()&&hs.gexit?'pass':'walk',hs); }
M.key=function(k){ if (k==='Escape'){ if (E.overlay) E.closeOverlay(null); else if (E.menu){ E.menu=null; E.paused(false); } else if (E.screen==='game'){ E.menu=true; E.paused(true); } return; }
  if (E.screen!=='game'||E.menu) return; if (k===' '||k==='Enter'){ if (E.speech) E.endSpeech(); return; }
  if (E.overlay||E.dlg||E.busy) return; var kl=k.toLowerCase(); if (k==='Tab'||kl==='m'){ E.switchChar(); } else if (kl==='n'){ E.openNotes(); } else if (kl==='h'||kl==='t'){ E.useHint(); } else if (kl==='z'||kl==='r'){ reveal={at:E.gt()}; } };
})(M);
