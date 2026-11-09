/* ===== 99_main.js — Canvas, ganzzahlige Skalierung, Eingabe, Schleife ===== */
(function(M){
'use strict';
if (typeof document==='undefined') return;
var cv=document.getElementById('game'), ctx=cv.getContext('2d',{alpha:false}), img=ctx.createImageData(320,200);
var u32=new Uint32Array(img.data.buffer), PAL=new Uint32Array(256);
for (var i=0;i<256;i++){ var q=M.RGB[i]||M.RGB[0]; PAL[i]=(255<<24)|(q[2]<<16)|(q[1]<<8)|q[0]; }
ctx.imageSmoothingEnabled=false;
var hint=document.getElementById('hint');
// Hochformat (UI-Konzept D15): einmal erklären, dann gedreht weiterspielen lassen; die Wahl wird gemerkt
var rotOk=false; try{ rotOk=localStorage.getItem('mala.rotOk')==='1'; }catch(e){}
var rotNote=document.createElement('div'); rotNote.id='rotnote'; rotNote.setAttribute('role','dialog'); rotNote.setAttribute('aria-modal','true');
var stR=document.createElement('style'); stR.textContent='#rotnote{position:fixed;inset:0;z-index:20;display:none;align-items:center;justify-content:center;background:rgba(8,7,13,.94);padding:24px;box-sizing:border-box}#rotnote.on{display:flex}#rotnote .rn{max-width:22em;background:#13111c;border:2px solid #6a400e;box-shadow:4px 4px 0 rgba(0,0,0,.6);padding:18px 20px;color:#e3d9c0;font:16px/1.45 var(--mala-read,system-ui,-apple-system,"Segoe UI",sans-serif)}#rotnote h2{margin:0 0 8px;color:#c3ecee;font:inherit;font-size:18px;font-weight:700}#rotnote p{margin:0 0 10px}#rotnote button{display:block;min-height:44px;width:100%;margin-top:6px;background:#6a400e;color:#fff0a6;border:1px solid #d99a33;font:inherit;cursor:pointer}#rotnote button:focus-visible{outline:2px solid #f3c75c;outline-offset:2px}';
document.head.appendChild(stR); document.body.appendChild(rotNote);
function trU(t){ try{ return M.trUI?M.trUI(t):t; }catch(e){ return t; } }
function fillRot(){ rotNote.setAttribute('aria-label',trU('„Die Stillen“ wird quer gespielt')); rotNote.innerHTML='<div class="rn"><h2></h2><p class="a"></p><p class="b"></p><button type="button"></button></div>';
  rotNote.querySelector('h2').textContent=trU('„Die Stillen“ wird quer gespielt'); rotNote.querySelector('.a').textContent=trU('Dreh dein Gerät ins Querformat.');
  rotNote.querySelector('.b').textContent=trU('Ist die Drehsperre an? Dann spiel hier weiter: Das Bild liegt richtig, sobald du das Gerät drehst.');
  var b=rotNote.querySelector('button'); b.textContent=trU('Gedreht weiterspielen'); b.addEventListener('click',function(){ rotOk=true; try{ localStorage.setItem('mala.rotOk','1'); }catch(e){} showRot(false); try{ M.audioInit(); }catch(_){} }); }
// Touch-Konzept T11: Solange der Hinweis die Fläche verdeckt, steht das Spiel still (wie in der Pause); danach geht es an derselben Stelle weiter
var rotPausedByUs=false;
function showRot(on){ var v=!!(on&&!rotOk); if (v&&!rotNote.firstChild) fillRot(); rotNote.classList.toggle('on',v); if (v){ var b=rotNote.querySelector('button'); if (b) try{ b.focus({preventScroll:true}); }catch(e){} }
  try{ var E=M.E; if (v && !rotPausedByUs && E && !E.paused()){ rotPausedByUs=true; E.paused(true); if (M.duckMusic) M.duckMusic(true); }
    else if (!v && rotPausedByUs){ rotPausedByUs=false; if (E && !E.menu){ E.paused(false); if (M.duckMusic) M.duckMusic(false); } } }catch(e){} }
// Röhrenbild (Menüpunkt): Scanlines + Vignette
var crtEl=document.createElement('div'); crtEl.id='crt'; document.body.appendChild(crtEl);
var st=document.createElement('style'); st.textContent='#crt{position:fixed;pointer-events:none;display:none;z-index:5}#crt.on{display:block;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.5) 100%),repeating-linear-gradient(var(--dir,to bottom),rgba(0,0,0,.3) 0,rgba(0,0,0,.3) var(--a),rgba(0,0,0,0) var(--a),rgba(0,0,0,0) var(--b));border-radius:16px}#game.crt,#hud.crt{filter:saturate(1.15) contrast(1.06) brightness(1.1)}#game.crt{border-radius:16px}#hud{display:none;position:fixed;z-index:1;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:none;cursor:none;background:#08070d}';
document.head.appendChild(st);
var crt=false; try{ crt=localStorage.getItem('mala.crt')==='1'; }catch(e){}
function placeCRT(){ var r=(wideOn?hudCv:cv).getBoundingClientRect(); crtEl.style.left=r.left+'px'; crtEl.style.top=r.top+'px'; crtEl.style.width=r.width+'px'; crtEl.style.height=r.height+'px'; var row=wideOn?r.height/WG.Hh:(rot?r.width:r.height)/200; crtEl.style.setProperty('--a',(row*0.45)+'px'); crtEl.style.setProperty('--b',row+'px'); crtEl.style.setProperty('--dir',rot?'to left':'to bottom'); }
M.crtOn=function(){ return crt; };
M.setCRT=function(on){ crt=on; try{ localStorage.setItem('mala.crt',on?'1':'0'); }catch(e){} crtEl.className=on?'on':''; cv.className=on?'crt':''; hudCv.className=on?'crt':''; placeCRT(); };
M.fullscreen=function(){ var d=document.documentElement; try{ var r=(d.requestFullscreen||d.webkitRequestFullscreen||function(){}).call(d); if (r&&r.then) r.then(function(){ lockLandscape(); setTimeout(fit,200); }).catch(function(){}); }catch(e){} };
// Querformat: Steht das Gerät hochkant, wird das Spielbild um 90° gedreht und füllt die lange Seite.
// So spielt man immer quer, auch mit gesperrter Bildschirmdrehung (iPad/iPhone können die Ausrichtung nicht per Skript sperren).
var rot=false;
// ---------------------------------------------------------------- Breitbild-Leiste (UI-Konzept D17) und Telefon-Layout (Touch-Konzept D1, T02/T17)
// Die Szene liegt im größten ganzzahligen Maßstab m (Gerätepixel je Spielpixel) auf #game (320×144), der mit der Leiste in die Safe-Area passt;
// die Leiste hat einen eigenen Puffer auf #hud im Maßstab n des gewohnten 320×200-Bildes. Seitenknöpfe neben der Szene nur, wenn links und
// rechts genug Platz bleibt (bei Touch ≥ 44 CSS-px), sonst stehen alle Knöpfe in der unteren Leiste. Bei Touch sind Knöpfe, Felder und Pfeile ≥ 44 CSS-px.
var hudCv=document.createElement('canvas'); hudCv.id='hud'; hudCv.setAttribute('aria-hidden','true'); document.body.appendChild(hudCv);
var hctx=hudCv.getContext('2d',{alpha:false}), himg=null, hu32=null, WG=null, wideOn=false, STD={w:320,h:200}, lastG=null;
var probe=document.createElement('div'); probe.style.cssText='position:fixed;left:env(safe-area-inset-left,0px);right:env(safe-area-inset-right,0px);top:env(safe-area-inset-top,0px);bottom:env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none;z-index:-1'; document.body.appendChild(probe);
function safeBox(){ if (window.MALA_FIT){ var f=window.MALA_FIT(); return {x:(window.innerWidth-f[0])/2,y:(window.innerHeight-f[1])/2,w:f[0],h:f[1]}; } var r=probe.getBoundingClientRect(); return {x:r.left,y:r.top,w:r.width,h:r.height}; }
function wideGeo(){ if (rot || M.WIDE_OFF){ lastG=null; return null; } var dpr=window.devicePixelRatio||1, B=safeBox();
  var Wd=B.w*dpr, Hd=B.h*dpr, n=Math.floor(Math.min(Wd/320,Hd/200)); if (n<1){ lastG=null; return null; }
  var k=touchDev()?Math.ceil(44*dpr/n-0.01):0, bh=Math.max(32,k+2), rMin=Math.max(26,k), aw=Math.max(15,k), bw=Math.max(30,k), slot=k?34:36;
  function rails(m){ var r=Math.min(33,Math.floor((Wd-320*m)/2/n)), S0=Math.ceil(144*m/n); if (r<rMin || (S0+bh)*n>Hd+0.5) return null; return {mode:'rails',m:m,S0:S0,rail:r,Wh:Math.round(320*m/n)+2*r,Hh:S0+bh}; }
  function bottom(m){ var S0=Math.ceil(144*m/n), Wh=Math.floor(Wd/n), need=2+40+2+bw+4+2*aw+6*slot+4+3*bw+4+2; if (Wh<need || (S0+12+bh)*n>Hd+0.5) return null; return {mode:'bottom',m:m,S0:S0,rail:0,Wh:Wh,Hh:S0+12+bh}; }
  // Hysterese (T17): Ändert sich die Fläche um weniger als 8 CSS-px, bleibt es bei der bisherigen Aufteilung, solange sie passt
  var c=null, near=lastG && lastG.n===n && lastG.k===k && Math.abs(B.w-lastG.box[0])<8 && Math.abs(B.h-lastG.box[1])<8;
  if (near){ if (!lastG.c) return null; c=lastG.c.mode==='rails'?rails(lastG.c.m):bottom(lastG.c.m); }
  if (!c){ for (var m=Math.floor(Wd/320); !c && m>n; m--) c=rails(m)||bottom(m); lastG={n:n,k:k,box:[B.w,B.h],c:c}; }
  if (!c) return null;
  var cssW=c.Wh*n/dpr, cssH=c.Hh*n/dpr, x0=Math.round(B.x+(B.w-cssW)/2), y0=Math.round(B.y+(B.h-cssH)/2), sxd=c.mode==='rails'?c.rail*n:Math.round((c.Wh*n-320*c.m)/2);
  return {n:n,m:c.m,dpr:dpr,k:k,bh:bh,mode:c.mode,rail:c.rail,sx:sxd/n,S0:c.S0,Wh:c.Wh,Hh:c.Hh,x0:x0,y0:y0,cssW:cssW,cssH:cssH,scene:{x:x0+sxd/dpr,y:y0,w:320*c.m/dpr,h:144*c.m/dpr}}; }
function setSize(h){ if (cv.height===h) return; cv.width=320; cv.height=h; img=ctx.createImageData(320,h); u32=new Uint32Array(img.data.buffer); ctx.imageSmoothingEnabled=false; }
function applyStd(){ setSize(200); hudCv.style.display='none'; cv.style.zIndex=''; cv.style.width=STD.w+'px'; cv.style.height=STD.h+'px';
  if (rot){ cv.style.position='fixed'; cv.style.left='50%'; cv.style.top='50%'; cv.style.transform='translate(-50%,-50%) rotate(90deg)'; }
  else if (STD.top!=null){ cv.style.position='fixed'; cv.style.left=Math.round((window.innerWidth-STD.w)/2)+'px'; cv.style.top=STD.top+'px'; cv.style.transform=''; }   // T22: Tablet, Bild oben
  else { cv.style.position=''; cv.style.left=''; cv.style.top=''; cv.style.transform=''; }
  if (M.setWideLayout) M.setWideLayout(null); }
function applyWide(on){ if (!on||!WG){ wideOn=false; applyStd(); setTimeout(placeCRT,0); if (M.onFit) try{ M.onFit(); }catch(e){} return; }
  var g=WG; wideOn=true; setSize(144); cv.style.position='fixed'; cv.style.transform=''; cv.style.left=g.scene.x+'px'; cv.style.top=g.scene.y+'px'; cv.style.width=g.scene.w+'px'; cv.style.height=g.scene.h+'px'; cv.style.zIndex='2';
  if (hudCv.width!==g.Wh||hudCv.height!==g.Hh||!himg){ hudCv.width=g.Wh; hudCv.height=g.Hh; himg=hctx.createImageData(g.Wh,g.Hh); hu32=new Uint32Array(himg.data.buffer); hctx.imageSmoothingEnabled=false; }
  hudCv.style.left=g.x0+'px'; hudCv.style.top=g.y0+'px'; hudCv.style.width=g.cssW+'px'; hudCv.style.height=g.cssH+'px'; hudCv.style.display='block';
  if (M.setWideLayout) M.setWideLayout(g); setTimeout(placeCRT,0); if (M.onFit) try{ M.onFit(); }catch(e){} }
// Wechsel zwischen Breitbild und gewohntem Bild (Overlay, Karte, Pause zurück): 150 ms Überblendung aus dem Dunkel, ohne bei „Bewegung reduzieren“
function fadeSwap(){ if (M.reduceMotion && M.reduceMotion()) return; [cv,hudCv].forEach(function(el){ el.style.transition='none'; el.style.opacity='0'; });
  requestAnimationFrame(function(){ [cv,hudCv].forEach(function(el){ el.style.transition='opacity 150ms linear'; el.style.opacity='1'; }); }); }
// CSS-Pixel je Spielpixel der Szene (für den Fangradius bei Touch, Touch-Konzept T01)
M.sceneScale=function(){ var r=cv.getBoundingClientRect(); return wideOn?r.width/320:(rot?r.height/320:r.width/320); };
M.isWide=function(){ return wideOn; }; M.wideGeo=function(){ return WG; }; M.sceneRect=function(){ return cv; };
function touchDev(){ try{ return (navigator.maxTouchPoints||0)>0 || (window.matchMedia&&matchMedia('(pointer: coarse)').matches); }catch(e){ return false; } }   // nur Tablets und Telefone drehen, kein hohes Desktopfenster
function fit(){ if (zoomed()) return;   // gezoomt (Menü, T16): Bild nicht verkleinern; nach dem Zurückzoomen folgt ein resize
  var dpr=window.devicePixelRatio||1, box=window.MALA_FIT?window.MALA_FIT():[window.innerWidth,window.innerHeight], vw=box[0], vh=box[1];
  rot=touchDev()&&vh>vw*1.05; var lw=rot?vh:vw, lh=rot?vw:vh;   // verfügbare Breite und Höhe im Querformat
  if (rot && !window.MALA_FIT){ var sb=safeBox(), it=Math.max(0,sb.y), ib=Math.max(0,vh-sb.y-sb.h), il=Math.max(0,sb.x), ir=Math.max(0,vw-sb.x-sb.w); lw=vh-2*Math.max(it,ib); lh=vw-2*Math.max(il,ir); }   // T20: gedrehtes Bild innerhalb der Safe Area (mittig, daher der größere Rand beidseitig)
  var s=Math.floor(Math.min(lw*dpr/320,lh*dpr/200)), css;
  if (s>=1) css=320*s/dpr; else css=lw; if (css*200/320>lh) css=lh*320/200; if (css>lw) css=lw;
  STD.w=css; STD.h=css*200/320;
  // T22: Tablet mit viel Platz unter dem Bild (≥ 132 CSS-px, wenn das Bild 6 px unter den oberen Rand rückt): Bild oben, Antwortliste darunter (07_subs.js)
  STD.top=null; if (!rot && !window.MALA_FIT && touchDev()){ var sb2=safeBox(); if (sb2.h-6-STD.h>=132) STD.top=Math.round(sb2.y+6); }
  WG=wideGeo(); if (wideOn && WG) applyWide(true); else { wideOn=false; applyStd(); }
  document.documentElement.classList.toggle('mala-rot',rot); if (hint) hint.style.display='none'; showRot(rot); setTimeout(placeCRT,0); if (M.onFit) try{ M.onFit(); }catch(e){} }
M.isRotated=function(){ return rot; };
// Wo der Browser es kann (Android, Vollbild, installierte App), zusätzlich die Ausrichtung auf quer sperren
function lockLandscape(){ try{ var o=screen.orientation; if (o&&o.lock){ var r=o.lock('landscape'); if (r&&r.catch) r.catch(function(){}); } }catch(e){} }
// Größenwechsel (T17): auch visualViewport (Safari-Leisten), entprellt; während ein Finger oder ein gezogener Gegenstand unterwegs ist, erst danach
var fitLater=0; function onResize(){ if (M.pointerActive && M.pointerActive()){ if (!fitLater) fitLater=setTimeout(fitNow,1500); return; } fit(); }
function fitNow(){ if (!fitLater) return; clearTimeout(fitLater); fitLater=0; fit(); }
window.addEventListener('resize',onResize); window.addEventListener('orientationchange',function(){ setTimeout(onResize,250); });
if (window.visualViewport){ var vvT=null; window.visualViewport.addEventListener('resize',function(){ zoomTouch(); clearTimeout(vvT); vvT=setTimeout(onResize,150); }); }
fit();
function toLogical(e){ var r=cv.getBoundingClientRect();
  if (wideOn){ if (e.clientX>=r.left&&e.clientX<r.right&&e.clientY>=r.top&&e.clientY<r.bottom) return [(e.clientX-r.left)/r.width*320,Math.min(143.99,(e.clientY-r.top)/r.height*144)];
    var h=hudCv.getBoundingClientRect(); return [(e.clientX-h.left)/h.width*WG.Wh,1000+(e.clientY-h.top)/h.height*WG.Hh]; }   // Leiste: eigene Koordinaten ab y=1000
  if (rot) return [(e.clientY-r.top)/r.height*320,(r.right-e.clientX)/r.width*200];   // im Uhrzeigersinn gedreht: x läuft nach unten, y nach links
  return [(e.clientX-r.left)/r.width*320,(e.clientY-r.top)/r.height*200]; }
// nur der erste Finger zählt: ein zweiter Finger oder eine nachgereichte Mausnachbildung löst keine zweite Aktion aus
// Dieselben Zeiger-Handler für Szene (#game) und Breitbild-Leiste (#hud); die Koordinaten richten sich nach der Stelle, nicht nach dem Element
var locked=false, wAcc=0, lastTouchEnd=0;
function onDown(e){ e.preventDefault(); if (e.isPrimary===false) return;
  if (e.pointerType==='mouse' && e.button>0){ if (e.button===2){ var q=toLogical(e); M.rightClick(q[0],q[1]); } return; }   // Rechtsklick: Auswahl aufheben oder „Schau an“ (UI-Konzept B1-15)
  if (!locked){ locked=true; lockLandscape(); } try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_){} var p=toLogical(e); M.pointerDown(p[0],p[1],e.pointerType!=='mouse'); }
function onMove(e){ if (e.isPrimary===false) return; var p=toLogical(e); M.pointerMove(p[0],p[1],e.pointerType!=='mouse'); }
function onUp(e){ e.preventDefault(); if (e.isPrimary===false) return; if (e.pointerType==='mouse' && e.button>0) return; var p=toLogical(e); M.pointerUp(p[0],p[1],e.pointerType!=='mouse'); if (fitLater) setTimeout(fitNow,0); }
// Mausrad: blättert Antwortlisten, Notizbuch und Inventar (gesammelt, damit ein Trackpad nicht rast)
function onWheel(e){ e.preventDefault(); wAcc+=e.deltaMode===1?e.deltaY*16:e.deltaY; if (Math.abs(wAcc)>=40){ M.wheel(wAcc); wAcc=0; } }
// Doppeltipp auf dem Spielbild zoomt nicht (das Spiel wertet Doppeltipps selbst über pointerup aus)
function onTouchEnd(e){ var t=Date.now(); if (t-lastTouchEnd<450) e.preventDefault(); lastTouchEnd=t; }
[cv,hudCv].forEach(function(el){ el.addEventListener('pointerdown',onDown); el.addEventListener('pointermove',onMove); el.addEventListener('pointerup',onUp);
  el.addEventListener('pointercancel',function(e){ if (e.isPrimary!==false){ M.pointerCancel(); if (fitLater) setTimeout(fitNow,0); } }); el.addEventListener('lostpointercapture',function(e){ if (e.isPrimary!==false) M.pointerCancel(); });   // Touch-Konzept T10
  el.addEventListener('contextmenu',function(e){ e.preventDefault(); }); el.addEventListener('wheel',onWheel,{passive:false}); el.addEventListener('dblclick',function(e){ e.preventDefault(); }); el.addEventListener('touchend',onTouchEnd,{passive:false}); });
document.addEventListener('keydown',function(e){ if (rotNote.classList.contains('on')) return;
  if (M.shell && M.shell.ctx){ if (M.audioInit) M.audioInit(); if (e.key==='Escape'||!(e.target&&e.target.closest&&e.target.closest('input'))) { if (M.shell.key(e)) return; } else return; }   // Titel und Pause: Tasten gehören der HTML-Schicht
  if (e.target&&e.target.closest&&e.target.closest('input,textarea,select')) return;
  // Schnellvorlauf (UI-Konzept B3-5): Läuft eine Szene und ist nichts geöffnet, öffnet Esc die Pause erst beim Loslassen; gehalten (≥ 350 ms) läuft die Szene schneller ab
  if (e.key==='Escape'){ if (ffDown){ e.preventDefault(); return; }
    if (!e.repeat && M.E.busy && !M.E.dlg && M.escWouldPause && M.escWouldPause()){ e.preventDefault(); if (M.audioInit) M.audioInit(); ffDown=1; clearTimeout(ffT); ffT=setTimeout(function(){ ffT=null; if (ffDown) M.fastForward(true); },350); return; } }
  if (e.key===' '||e.key==='Tab'||e.key==='ArrowUp'||e.key==='ArrowDown') e.preventDefault(); M.key(e.key); });   // Tasten geben auch den Ton frei (M.key → audioInit)
var ffDown=0, ffT=null;
function ffEnd(openPause){ if (!ffDown) return; var was=M.E.ff; ffDown=0; clearTimeout(ffT); ffT=null; M.fastForward(false); if (openPause && !was) M.key('Escape'); }   // kurz gedrückt: wie gewohnt Esc
document.addEventListener('keyup',function(e){ if (e.key==='Escape') ffEnd(true); });
window.addEventListener('blur',function(){ ffEnd(false); });
document.addEventListener('touchmove',function(e){ if (e.target===cv||e.target===hudCv) e.preventDefault(); },{passive:false});
document.addEventListener('touchend',function(){ try{ M.audioInit(); }catch(_){} },{passive:true});
// Touch-Konzept T16: keine globale Gestensperre. Menüs und Ränder dürfen gezoomt werden; auf Szene und Leiste sind Tipp, Ziehen und Doppeltipp
// Spielaktionen und bleiben ohne Zoom – außer die Seite ist schon gezoomt: dann geht das Zurückzoomen auch dort (sonst säße man in der Vergrößerung fest)
function zoomed(){ return !!(window.visualViewport && window.visualViewport.scale>1.01); }
document.addEventListener('gesturestart',function(e){ if ((e.target===cv||e.target===hudCv) && !zoomed()) e.preventDefault(); });
function zoomTouch(){ var t=zoomed()?'pinch-zoom':'none'; if (cv.style.touchAction!==t){ cv.style.touchAction=t; hudCv.style.touchAction=t; } }
document.addEventListener('visibilitychange',function(){ if (document.hidden){ try{ M.saveGame(); }catch(e){} } else { try{ if (M.audioResume) M.audioResume(); }catch(e){} } });   // zurück aus dem Hintergrund: Ton fortsetzen, sonst beim nächsten Tipp
window.addEventListener('pagehide',function(){ try{ M.saveGame(); }catch(e){} });
var last=performance.now();
function frame(now){ var dt=now-last; last=now;
  try{ M.update(dt); var want=!!WG && !!(M.wideWanted&&M.wideWanted()); if (want!==wideOn){ applyWide(want); fadeSwap(); }   // Overlays, Karten, Titel: gewohntes 320×200-Bild
    var fb=M.renderFrame(), d=fb.d, N=wideOn?46080:64000; for (var i=0;i<N;i++) u32[i]=PAL[d[i]]; ctx.putImageData(img,0,0);
    if (wideOn && himg){ var hb=M.renderHud&&M.renderHud(); if (hb){ var hd=hb.d, nn=Math.min(hd.length,hu32.length); for (var j=0;j<nn;j++) hu32[j]=PAL[hd[j]]; hctx.putImageData(himg,0,0); } }
    if (M.subsSync) M.subsSync(); if (M.barSync) M.barSync();
    if (M.__capNext && M.E.speech){ var ck=M.__capNext; M.__capNext=null; try{ M.__caps[ck]=cv.toDataURL(); }catch(e){} } }catch(err){ console.error(err); }
  requestAnimationFrame(frame); }
if (M.boot) M.boot();
M.setCRT(crt);
M.music('title');
requestAnimationFrame(frame);
})(M);
