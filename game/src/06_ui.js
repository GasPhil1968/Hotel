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
      var lift=0;
      if (spirit){ if (ghostView){ o.mask=mask; o.mv=1; o.alpha=1; } else { var isM=a.ch==='mala', tq=E.gt(); o.lut=(isM?M.TINT.malaG:M.TINT.spirit).a; o.alpha=a.alpha||(isM?0.62:0.7); o.wobble=1;
        if (isM){ lift=1+Math.round((Math.sin(tq/760)+1)*0.75); if ((tq%7300)<150) o.alpha*=0.45; } } }
      else { if (room.actorLut) o.lut=room.actorLut(a,S,gs,tod); else if (tod!=='day' && M.TINT[tod]) o.lut=M.TINT[tod].a; }
      if (a.fadeIn && E.gt()-a.fadeIn<900){ o.alpha=(o.alpha||1)*Math.min(1,(E.gt()-a.fadeIn)/900); }
      if (a.fadeOut){ var k=(E.gt()-a.fadeOut)/900; if (k>=1){ a.visible=false; a.fadeOut=0; return; } o.alpha=(o.alpha||1)*(1-k); }
      if (!a.noShadow && !spirit) shadow(sx,a.y,Math.round(7*(a.scale||1)));
      if (spirit && !ghostView) ghostHalo(a,p,f,sx,a.y-lift,o.alpha);
      M.drawPose(fb,sx,a.y-lift,p,f,a.ch,o);
      if (spirit && !ghostView && a.ch==='mala') malaMotes(sx,a.y-lift,o.alpha); }
    else if (l.draw) l.draw(fb,view,S,gs);
    else { fb.blit(l,l.ox-cx+ox,l.oy); clearMask(l,l.ox-cx+ox,l.oy); }
  });
  if (room.front) room.front(fb,view,S,gs);
  if (ghostView){ var t=M.TINT.ghost; for (var i=0;i<W*SH;i++){ if (mask[i]) continue; var c=fb.d[i]; fb.d[i]=M.tintPx(t,c,i%W,(i/W)|0); }
    if (room.ghost) room.ghost(fb,view,S,gs);
    // Leinen: woran die Geister festgemacht sind (nur Mala sieht sie)
    Object.keys(E.ACT).forEach(function(k){ var a=E.ACT[k]; if (!a.ghost || a.id==='mala' || !E.actorShown(a)) return; var an=typeof a.anchor==='function'?a.anchor(S,gs):a.anchor; if (an) drawLeash(a.x-cx+ox,a.y-24,an[0]-cx+ox,an[1],E.gt(),false); });
    var ma=E.ACT.mala; if (ma && E.actorShown(ma) && !room.noMalaLeash){ var mx0=ma.x-cx+ox, my0=ma.y-22; drawLeash(mx0,my0,mx0+64,my0-58,E.gt(),true); }
    // kalter Schimmer am Rand
    var tt=E.gt()/1000; for (var yy=0;yy<SH;yy++){ var e=Math.min(yy,SH-1-yy); if (e>5) continue; for (var xx=0;xx<W;xx++){ if (bayer(xx+Math.floor(tt*3),yy)<(6-e)/14) fb.d[yy*W+xx]=P.x0; } } }
  if (E.crossing) drawCrossing(E.crossing,cx-ox,E.gt());
  // Kopfschmerz: ein unentdeckter Geist ist nah
  var hidden=!ghostView && Object.keys(E.ACT).some(function(k){ var a=E.ACT[k]; return a.ghost && a.id!=='mala' && a.visible && !E.ghostVisible(a) && !a.noAche; });
  var ache=hidden || (E.headache && E.gt()<E.headache);
  if (ache){ var pulse=(Math.sin(E.gt()/260)+1)/2*0.5+0.25; for (var y2=0;y2<SH;y2++) for (var x2=0;x2<W;x2++){ var dx=(x2-160)/170, dy=(y2-72)/95, v=dx*dx+dy*dy; if (v>0.55 && bayer(x2,y2)<(v-0.55)*pulse*1.4){ var k2=y2*W+x2; fb.d[k2]=M.DN[M.DN[fb.d[k2]]]; } } }
  if (M.DEBUG_SPOTS){ var cx1=Math.round(E.camX); for (var wy=0;wy<SH;wy+=3) for (var wx=0;wx<W;wx+=3){ var X=wx+cx1; var mk=room.walk&&room.walk(X,wy,S,gs); var mg=room.walkG&&room.walkG(X,wy,S,gs); if (mk) fb.px(wx,wy,P.b3); else if (mg) fb.px(wx,wy,P.x5); }
    room.hotspots.forEach(function(h){ var r0=E.hsRect(h); if (!r0) return; var X0=r0[0]-cx1, c=h.gexit?P.x6:(h.exit?P.g5:(h.who==='g'?P.x4:P.y4)); fb.hl(X0,X0+r0[2]-1,r0[1],c); fb.hl(X0,X0+r0[2]-1,r0[1]+r0[3]-1,c); fb.vl(X0,r0[1],r0[1]+r0[3]-1,c); fb.vl(X0+r0[2]-1,r0[1],r0[1]+r0[3]-1,c); M.microText(fb,String(h.id).slice(0,10),X0+2,r0[1]+2,c);
      var st=typeof h.st==='function'?h.st(S,gs):h.st; if (st){ fb.rect(st[0]-cx1-1,st[1]-1,3,3,P.r4); } }); }
  if (E.switchFx && E.gt()-E.switchFx<500){ var q=(E.gt()-E.switchFx)/500; for (var j=0;j<W*SH;j++){ if (bayer(j%W,(j/W)|0)>q) fb.d[j]=isG()?M.UP[fb.d[j]]:M.DN[fb.d[j]]; } }
}
// Geisterschein: ein weicher, kalter Rand um die Gestalt
function ghostHalo(a,p,f,x,y,al){ var s=M.poseBuf(p,a.ch,E.gt()), fl=f==='L', bx=Math.round(x)-M.SPR.OX+(fl?1:0), by=Math.round(y)-M.SPR.OY, isM=a.ch==='mala', t=Math.floor(E.gt()/120);
  var gl=isM?[P.x2,P.x3,P.x4]:[P.v2,P.v3,P.v4], w=s.w, h=s.h, at=function(i,j){ if (i<0||j<0||i>=w||j>=h) return false; return s.d[j*w+(fl?w-1-i:i)]!==T; };
  for (var j=-2;j<h+2;j++){ var yy=by+j; if (yy<0||yy>=SH) continue; for (var i=-2;i<w+2;i++){ if (at(i,j)) continue; var n1=at(i-1,j)||at(i+1,j)||at(i,j-1)||at(i,j+1), n2=!n1&&(at(i-2,j)||at(i+2,j)||at(i,j-2)||at(i,j+2));
      if (!n1&&!n2) continue; var xx=bx+i; if (xx<0||xx>=W) continue; var th=(n1?0.55:0.22)*(al+0.3); if (bayer(xx+t,yy)>=th) continue; var k=yy*W+xx, c=fb.d[k]; fb.d[k]=M.lum(c)<70?gl[0]:(M.lum(c)<140?gl[1]:gl[2]); } } }
// kleine Lichtpunkte, die von Mala aufsteigen
function malaMotes(x,y,al){ var t=E.gt()/1000; for (var i=0;i<4;i++){ var ph=(t*0.32+i*0.27)%1, px=Math.round(x+Math.sin(i*2.7+t*1.3)*7), py=Math.round(y-12-ph*34); if (ph>0.85||px<0||px>=W||py<0||py>=SH) continue; if (bayer(px,py)<(1-ph)*al) fb.d[py*W+px]=P.x5; } }
// eine Leine aus Licht von (x0,y0) nach (x1,y1), leicht durchhängend; east=true: Malas eigene, die sich im Osten verliert
function drawLeash(x0,y0,x1,y1,gt,east){ var dx=x1-x0, dy=y1-y0, L=Math.max(2,Math.hypot(dx,dy)), sag=Math.min(18,L*0.16), mx=(x0+x1)/2, my=(y0+y1)/2+sag, n=Math.ceil(L*1.3), t=gt/1000;
  for (var i=0;i<=n;i++){ var u=i/n, a=(1-u)*(1-u), b=2*(1-u)*u, c=u*u, px=Math.round(a*x0+b*mx+c*x1), py=Math.round(a*y0+b*my+c*y1+Math.sin(u*9+t*2.2)*0.6); if (px<0||px>=W||py<0||py>=SH) continue;
    var vis=east?(1-u)*(1-u)*0.8:0.9; if (bayer(px+Math.floor(t*8),py)>=vis) continue; var k=py*W+px; fb.d[k]=(Math.sin(u*40-t*5)>0.6)?P.x6:(east?P.x4:P.x5); } }
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
var BTNS=[{id:'notes',t:'Notizen',x:4},{id:'reveal',t:'Zeigen',x:0,right:true},{id:'menu',t:'Menü',x:0,right:true}];
(function(){ var x=W-4; for (var i=BTNS.length-1;i>=0;i--){ var b=BTNS[i]; b.w=M.textWidth(b.t); if (b.right){ x-=b.w; b.x=x; x-=14; } } var lx=4; BTNS.forEach(function(b){ if (!b.right){ b.x=lx; lx+=b.w+14; } }); })();
function btnAt(x,y){ if (y<SH||y>=SH+15) return null; for (var i=0;i<BTNS.length;i++){ var b=BTNS[i]; if (x>=b.x-5&&x<b.x+b.w+5) return b.id; } return null; }
function drawButton(b,on){ var c=ui(), hot=hoverUI===b.id&&pointer.show, act=(b.id==='reveal'&&reveal); var x0=b.x-4, x1=b.x+b.w+3, y0=BTN_Y, y1=BTN_Y+11;
  fb.rect(x0+1,y0+1,x1-x0-1,y1-y0-1,act?c.sel:P.k1); fb.hl(x0+1,x1-1,y0,c.fr); fb.hl(x0+1,x1-1,y1,c.fr); fb.vl(x0,y0+1,y1-1,c.fr); fb.vl(x1,y0+1,y1-1,c.fr);
  M.text(fb,b.t,b.x,BTN_Y+2,!on?c.dim:((hot||act)?c.hi:c.tx));
  if (b.id==='notes' && Object.keys(GS().noteNew).length){ fb.rect(x1-2,y0-1,3,3,P.r4); } }
function invList(){ return isG()?['tin']:GS().inv; }
function drawUI(){ fb.rect(0,SH,W,H-SH,P.k0); var room=E.room, c=ui();
  if (E.dlg && E.conv) return;
  if (room && room.noVerbs){ var s0=hover?E.nameOf(hover):(room.prompt||''); M.text(fb,s0,Math.max(2,Math.floor((W-M.textWidth(s0))/2)),SH+4,c.tx); drawButton(BTNS.filter(function(b){ return b.id==='menu'; })[0],true); return; }
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
  if (!g.malaOn || g.flags['mala.unknown']) return; var other=g.active==='marko'?'mala':'marko', hot=hoverUI==='sw'&&pointer.show;
  if (M.hasPortrait && M.hasPortrait(other)){ var pp=M.portrait(other,((E.gt()+900)%4300)<120?'b':'n'), cx1=Math.max(0,Math.floor((pp.w-(w-4))/2)), ch1=h-12;
    for (var j2=0;j2<ch1;j2++) for (var i2=0;i2<w-4;i2++){ var sx2=cx1+i2, sy2=2+j2; if (sx2>=pp.w||sy2>=pp.h) continue; var c2=pp.d[sy2*pp.w+sx2]; if (c2===T) continue; if (!avail) c2=M.DN[M.DN[c2]]; fb.px(x+2+i2,y+1+j2,c2); } }
  else { var pb=portraitBuf(other,'n'), cw=14, chh=14, cx0=Math.floor((pb.w-cw)/2), ox=x+Math.floor((w-cw*2)/2), oy=y+1;
    for (var j=0;j<chh*2;j++) for (var i=0;i<cw*2;i++){ var sx=cx0+(i>>1), sy=(j>>1); if (sx<0||sx>=pb.w||sy>=pb.h) continue; var col=pb.d[sy*pb.w+sx]; if (col===T) continue; if (other==='mala') col=M.TINT.ghostP.a[col]; if (!avail) col=M.DN[M.DN[col]]; fb.px(ox+i,oy+j,col); } }
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
  if (g){ var gv=hs.g||{}; if (gv.cross!==undefined && (!gv.crossIf || gv.crossIf(M.RS(room.id),GS()))) o.push({t:E.VLABEL.cross,v:'cross'}); ['talk','sense','listen'].forEach(function(v){ if (gv[v]!==undefined) o.push({t:E.VLABEL[v==='talk'?'gtalk':v],v:v}); });
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
// ---------------------------------------------------------------- Porträts und Gespräche (wie in den Blackwell-Spielen: Brustbild oben, Satz im Kasten daneben)
var PW=56, PH=64, NB_LH=10;
function convOn(){ return !!(E.screen==='game' && E.room && !E.overlay && !E.menu && (E.dlg || (E.conv && E.conv.room===E.room))); }
function convPartner(){ if (!E.conv||!E.conv.npc) return null; var a=E.ACT[E.conv.npc]; return (a && M.CHARS[a.ch] && a.id!==GS().active && E.actorShown(a))?a:null; }
// gemaltes Porträt (portraits/<id>.js) oder ersatzweise der vergrößerte Kopf-Stempel der Spielfigur
var FALLBACK={};
function portraitFor(ch,variant){ if (M.hasPortrait && M.hasPortrait(ch)) return M.portrait(ch,variant); var key=ch+':'+variant; if (FALLBACK[key]) return FALLBACK[key]; if (!M.CHARS[ch]) return null;
  var hb=portraitBuf(ch,variant), b=new Buf(PW,PH,T), sc=PW/hb.w;
  for (var y=0;y<PH;y++) for (var x=0;x<PW;x++){ var sx=Math.floor(x/sc), sy=Math.floor(y/sc); if (sy<hb.h&&sx<hb.w){ var c=hb.d[sy*hb.w+sx]; if (c!==T) b.d[y*PW+x]=c; } }
  M.outline(b,P.k1); var gt=M.PORTRAIT_GHOSTS&&M.PORTRAIT_GHOSTS[ch]; if (gt && M.TINT[gt]){ var lut=M.TINT[gt].a; for (var i=0;i<b.d.length;i++) if (b.d[i]!==T) b.d[i]=lut[b.d[i]]; } return (FALLBACK[key]=b); }
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
  drawChoices(); }
function drawChoices(){ var d=E.dlg, o=d.opts, g=isG(), x0=2, w=W-4, y0=SH+1, y1=H-1, tx=x0+12, tw=w-34, i;
  if (d.top>=o.length) d.top=Math.max(0,o.length-1);
  fb.rect(0,SH,W,H-SH,P.k0); var fr=g?P.x2:P.s4; fb.hl(x0,x0+w-1,y0,fr); fb.hl(x0,x0+w-1,y1,fr); fb.vl(x0,y0,y1,fr); fb.vl(x0+w-1,y0,y1,fr);
  var rows=[], yy=y0+4, more=false;
  for (var k=d.top;k<o.length;k++){ var ls=o[k].lines||(o[k].lines=M.wrap(o[k].t,tw)), h=ls.length*NB_LH+1; if (yy+h>y1-2){ more=true; break; } rows.push({k:k,y:yy,h:h,ls:ls}); yy+=h; }
  if (!rows.length && d.top<o.length){ var l1=o[d.top].lines; rows.push({k:d.top,y:yy,h:l1.length*NB_LH+1,ls:l1}); more=d.top<o.length-1; }
  var bye=dlgBye(), lay={rows:[],close:null,up:null,dn:null}, talk=!!convPartner();
  rows.forEach(function(r){ var hot=pointer.show&&hoverUI==='c:'+r.k, asked=talk&&!o[r.k].bye&&!o[r.k].noGray&&GS().seen['ask:'+o[r.k].t];
    var col=g?(hot?P.x6:(asked?P.x2:P.x4)):(hot?P.l1:(asked?P.s2:P.s5));
    if (hot) fb.rect(x0+3,r.y-1,w-24,r.h,g?P.x0:P.k2);
    if (o[r.k].ask){ fb.px(tx-6,r.y+2,col); fb.px(tx-5,r.y+3,col); fb.px(tx-6,r.y+4,col); } else { fb.px(tx-6,r.y+3,g?P.x1:P.s1); fb.px(tx-5,r.y+3,g?P.x1:P.s1); }
    r.ls.forEach(function(l,j){ M.text(fb,l,tx,r.y+j*NB_LH,col); }); lay.rows.push({k:r.k,r:[x0+3,r.y-1,w-24,r.h]}); });
  // rechts: Schließen und Blättern
  var ax=x0+w-11, upOn=d.top>0, dnOn=more;
  if (bye>=0){ var cyy=y0+4, hot2=hoverUI==='cx', cc2=hot2?P.r4:(g?P.x3:P.s3); for (i=0;i<5;i++){ fb.px(ax-2+i,cyy+i,cc2); fb.px(ax+2-i,cyy+i,cc2); } lay.close=[ax-8,y0+1,18,14]; }
  if (upOn||dnOn){ var tri=function(cy,up,on,hot){ var c=on?(hot?(g?P.x6:P.l1):(g?P.x4:P.s5)):(g?P.x1:P.s1); for (var t=0;t<4;t++){ var ty=up?cy+t:cy+3-t; fb.hl(ax-t,ax+t,ty,c); } };
    tri(y0+20,true,upOn,hoverUI==='cu'); tri(y1-9,false,dnOn,hoverUI==='cd'); lay.up=upOn?[ax-8,y0+16,18,14]:null; lay.dn=dnOn?[ax-8,y1-16,18,14]:null; }
  d.lay=lay; }
// Sprechtext: Figuren mit Porträt sprechen oben im Kasten neben ihrem Brustbild, alles andere wie gehabt
function speechPortrait(sp){ var o=sp.opt||{}; if (!sp.who||sp.who==='#'||o.phone||o.x!==undefined||o.y!==undefined||o.noPortrait) return null;
  var id=sp.who[0]==='@'?sp.who.slice(1):sp.who; if (!id) return null; var a=E.ACT[id], ch=a?a.ch:id; if (!(M.hasPortrait&&M.hasPortrait(ch)) && !M.CHARS[ch]) return null; return {ch:ch,a:a}; }
function drawSpeechBust(sp,pr){ var o=sp.opt||{}, a=pr.a, col=o.color!==undefined?o.color:(a&&a.color!==undefined?a.color:(M.CAST_COLORS[pr.ch]!==undefined?M.CAST_COLORS[pr.ch]:P.s6));
  var right=false, me=E.ACT[GS().active], pa=convPartner();
  if (a && E.actorShown(a)){ var other=(a===me)?(pa||null):me;
    if (!other || other===a){ other=null; var best=1e9, pick=function(npcOnly){ Object.keys(E.ACT).forEach(function(k){ var b=E.ACT[k]; if (b===a||!E.actorShown(b)) return; if (npcOnly && (b.id==='marko'||b.id==='mala')) return; var dd=Math.abs(b.x-a.x); if (dd<best){ best=dd; other=b; } }); };
      pick(a.id==='marko'||a.id==='mala'); if (!other) pick(false); }
    right=other?(a.x>other.x):((a.x-E.camX)>W/2); }
  var px=right?W-4-PW:4, lh=10, tw=W-PW-30, lines=M.wrap(sp.text,tw), bx0=right?4:PW+10, bx1=right?W-PW-10:W-4, by0=6, by1=by0+lines.length*lh+9;
  var bw=0; lines.forEach(function(l){ bw=Math.max(bw,M.textWidth(l)); }); var boxW=Math.min(bx1-bx0,bw+14); if (right) bx1=bx0+boxW; else bx1=bx0+boxW;
  var talking=E.gt()-sp.at<Math.min(4500,sp.text.length*55+250), variant=talking?((Math.floor(E.gt()/140)%2)?'o':'n'):idleVariant(0);
  drawBust(pr.ch,px,4,variant,right);
  var gh=M.PORTRAIT_GHOSTS&&M.PORTRAIT_GHOSTS[pr.ch], frame=pr.ch==='mala'?P.x4:(gh?P.v4:P.s6);
  fb.rect(bx0,by0,bx1-bx0,by1-by0,P.k0); fb.hl(bx0,bx1-1,by0,frame); fb.hl(bx0,bx1-1,by1-1,frame); fb.vl(bx0,by0,by1-1,frame); fb.vl(bx1-1,by0,by1-1,frame);
  lines.forEach(function(l,i){ M.text(fb,l,bx0+7,by0+5+i*lh,col); });
  if (E.tapText() && E.busy && E.gt()>=sp.until && (Math.floor(E.gt()/400)%2)){ var ix=bx1-6, iy=by1-6; for (var t=0;t<3;t++) fb.hl(ix-2+t,ix+2-t,iy+t,frame); } }

// ---------------------------------------------------------------- Sprechtext
function speakerPos(who){ var a=E.ACT[who]; if (a && E.actorShown(a) && E.room){ return [Math.round(a.x)-Math.round(E.camX), Math.round(a.y)-(a.speechY||(a.idle&&/sit|mend|cards|guitar/.test(a.idle)?40:54))]; } return null; }
function drawSpeech(){ var sp=E.speech; if (!sp) return; var pr=speechPortrait(sp); if (pr) return drawSpeechBust(sp,pr); return drawSpeechPlain(sp); }
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
  // dunkler Grund unter dem Text (deckt die Leiste ab), weiche Kanten
  for (var yy=y0+h+1;yy<H;yy++) for (var xx=x0-10;xx<x0+w+10;xx++){ var ed=Math.min(xx-(x0-10),(x0+w+9)-xx); if (ed<8 && bayer(xx,yy)>ed/8) continue; fb.px(xx,yy,P.k0); }
  M.text(fb,d.title||'Nachhall',x0,y0+h+4,P.x4);
  var lines=d.lines||[], rows=[], ty=y0+h+15, maxRows=Math.floor((H-ty-1)/9);
  lines.slice(0,ov.step+1).forEach(function(l,i){ M.wrap(l,w-8).forEach(function(q){ rows.push([q,i===ov.step]); }); });
  rows.slice(-maxRows).forEach(function(r){ M.text(fb,r[0],x0,ty,r[1]?P.x5:P.x3); ty+=9; });
  if (Math.floor(gt/500)%2) M.text(fb,ov.step<lines.length-1?'▸':'✓',x0+w-6,H-10,P.x4); });
// Satzbau-Rätsel (Übersetzung)
M.defineOverlay('puzzle',function(fb,ov){ var d=ov.data; ov.sel=ov.sel||d.slots.map(function(){ return 0; }); paper(20,8,280,178,{lines:[30,22],margin:12});
  M.text(fb,d.title||'Übersetzung',36,12,P.r2); M.wrap(d.hint||'Tippe auf eine Zeile, um eine andere Fassung zu wählen.',250).forEach(function(l,i){ M.text(fb,l,36,22+i*9,P.s2); });
  var lay=[]; d.slots.forEach(function(sl,i){ var y=44+i*22, hot=hoverUI==='z:'+i, bad=ov.bad===i; fb.rect(32,y-2,256,18,hot?P.s6:(bad?P.r4:P.s4)); M.text(fb,(i+1)+'.',36,y+3,P.r2); M.text(fb,sl[ov.sel[i]],48,y+3,P.n0); fb.px(280,y+4,P.n2); fb.px(281,y+5,P.n2); fb.px(280,y+6,P.n2); lay.push([32,y-2,256,18]); });
  var by=44+d.slots.length*22+4, hot2=hoverUI==='zgo'; fb.rect(110,by,100,14,hot2?P.n2:P.n1); M.text(fb,d.button||'Vorlesen',160-(M.textWidth(d.button||'Vorlesen')>>1),by+3,P.s6); ov.lay={rows:lay,go:[110,by,100,14],close:[262,8,38,16]};
  M.text(fb,'Zurück',262,12,hoverUI==='zx'?P.r3:P.s2);
  if (ov.msg) M.wrap(ov.msg,250).forEach(function(l,i){ M.text(fb,l,36,by+18+i*9,P.r2); }); });

// ---------------------------------------------------------------- Notizbuch (Notizen, Verbinden, Fragen)
function notesOf(){ var g=GS(); var list=g.notes.slice(); var ph=M.PHASES[g.phase]||{}; var cs=ph.case; var mine=list.filter(function(id){ var n=M.NOTES[id]; return !cs || !n.c || n.c===cs || n.c==='mala'; }); return mine.length?mine:list; }
var NB={sel:null,top:0,msg:null,lay:null};
E.openNotes=function(){ NB.sel=null; NB.top=0; NB.msg=null; return showNotes(); };
function showNotes(){ return E.showOverlay('notebook',{mode:'browse'}); }
// zwei Seiten, auf denen die Notizen weiterlaufen; keine Ziele, keine Hinweise auf den nächsten Schritt
M.defineOverlay('notebook',function(fb,ov,gt){ var d=ov.data, ask=d.mode==='ask'; if (!ov.init){ ov.init=1; NB.top=0; NB.sel=null; NB.msg=null; }
  var lx=6, rx=162, y0=6, pw=152, ph=182, g=GS(), ph0=M.PHASES[g.phase]||{};
  paper(lx,y0,pw,ph,{lines:[22,9],margin:10}); paper(rx,y0,pw,ph,{lines:[22,9],margin:10}); fb.vl(159,y0,y0+ph,P.k1); fb.vl(160,y0,y0+ph,P.s2);
  var lay={notes:[],close:ask?[rx+pw-40,y0+2,38,14]:[rx+pw-22,y0+2,20,14],up:null,dn:null};
  M.text(fb,ask?(d.title||'Wonach fragen?'):'NOTIZBUCH',lx+16,y0+5,P.r2);
  if (ph0.short) M.text(fb,ph0.short,rx+16,y0+5,P.s2);
  M.text(fb,ask?'Zurück':'X',rx+pw-(ask?34:12),y0+5,hoverUI==='nx'?P.r3:P.s1);
  var notes=notesOf(); if (NB.top>=notes.length) NB.top=Math.max(0,notes.length-1);
  var pages=[{x:lx,ny:y0+20,max:y0+ph-(ask?14:24)},{x:rx,ny:y0+20,max:y0+ph-(NB.msg?40:16)}], pi=0;
  if (!notes.length) M.text(fb,'Noch nichts.',lx+16,y0+20,P.s2);
  for (var i=NB.top;i<notes.length;i++){ var n=M.NOTES[notes[i]], ls=M.wrap(n.t,pw-28), hh=ls.length*9+3, pg=pages[pi];
    if (pg.ny+hh>pg.max){ pi++; if (pi>=pages.length){ lay.dn=[rx+pw/2,y0+ph-14,pw/2,14]; break; } pg=pages[pi]; if (pg.ny+hh>pg.max){ lay.dn=[rx+pw/2,y0+ph-14,pw/2,14]; break; } }
    var px0=pg.x, ny=pg.ny, sel=NB.sel===notes[i], hot=hoverUI==='n:'+i, isNew=g.noteNew[notes[i]], ded=g.flags['deduced.'+notes[i]];
    if (sel) fb.rect(px0+12,ny-1,pw-16,hh,P.y4); else if (hot) fb.rect(px0+12,ny-1,pw-16,hh,P.s6);
    if (isNew) fb.rect(px0+12,ny+2,2,3,P.r4); if (ded){ fb.px(px0+13,ny+2,P.g3); fb.px(px0+14,ny+3,P.g3); }
    ls.forEach(function(l,j){ M.text(fb,l,px0+16,ny+j*9,ded?P.g1:P.n1); }); lay.notes.push({id:notes[i],idx:i,r:[px0+12,ny-1,pw-16,hh]}); pg.ny+=hh+1; }
  if (NB.top>0) lay.up=[rx+12,y0+ph-14,pw/2-12,14];
  if (lay.up||lay.dn){ var tri=function(cx,up,on){ var c=on?P.n2:P.s3; for (var t=0;t<5;t++){ var ty=up?y0+ph-12+t:y0+ph-8-t; fb.hl(cx-t,cx+t,ty,c); } }; tri(rx+pw/2-16,true,!!lay.up); tri(rx+pw/2+16,false,!!lay.dn); }
  if (!ask){ var hint=NB.sel?'Zweite Notiz antippen zum Verbinden.':'Zwei Notizen antippen, um sie zu verbinden.'; var hl=M.wrap(hint,pw-24); hl.forEach(function(l,j){ M.text(fb,l,lx+16,y0+ph-21+j*9+(hl.length>1?0:9),P.s2); }); }
  if (NB.msg){ var my=y0+ph-38; fb.rect(rx+10,my-2,pw-14,36,NB.msg.ok?P.g5:P.s4); M.wrap(NB.msg.t,pw-26).slice(0,4).forEach(function(l,j){ M.text(fb,l,rx+14,my+j*9,NB.msg.ok?P.g0:P.k1); }); }
  ov.lay=lay; });
async function notebookTap(x,y){ var ov=E.overlay, lay=ov.lay; if (!lay) return; var inR=function(r){ return r&&x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]; }, ask=ov.data.mode==='ask';
  if (inR(lay.close)){ NB.sel=null; NB.msg=null; E.closeOverlay(null); return; }
  if (inR(lay.up)){ NB.top=Math.max(0,NB.top-4); return; } if (inR(lay.dn)){ NB.top=NB.top+4; return; }
  for (var i=0;i<lay.notes.length;i++){ var n=lay.notes[i]; if (!inR(n.r)) continue; delete GS().noteNew[n.id];
    if (ask){ NB.sel=null; E.closeOverlay(n.id); M.sfx('page'); return; }
    if (!NB.sel){ NB.sel=n.id; NB.msg=null; M.sfx('click'); return; }
    if (NB.sel===n.id){ NB.sel=null; return; }
    var a=NB.sel; NB.sel=null; var res=await E.combineNotes(a,n.id); NB.msg={ok:res.ok,t:res.ok?('Schlussfolgerung: '+res.t):res.t};
    if (res.ok && res.say){ ov.after=res.say; } return; } }
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
  if (GS().malaOn) await M.API.g('Unten links kannst du zu mir wechseln. Ich gehe durch Wände, sehe, was er nicht sieht, und spüre, was an den Dingen hängt. Und wer losgelassen hat, den bringe ich hinüber.');
  await M.API.m('„Notizen“ ist mein Notizbuch. Zwei Notizen nacheinander antippen verbindet sie. Im Gespräch kann ich nach jeder Notiz fragen.');
  await M.API.m('„Zeigen“ markiert kurz alles, was man hier anfassen kann. Doppeltipp auf einen Ausgang bringt mich sofort hin.');
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
  if (E.overlay||E.dlg||E.busy) return; var kl=k.toLowerCase(); if (k==='Tab'||kl==='m'){ E.switchChar(); } else if (kl==='n'){ E.openNotes(); } else if (kl==='z'||kl==='r'){ reveal={at:E.gt()}; } };
})(M);
