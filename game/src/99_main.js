/* ===== 99_main.js — Canvas, ganzzahlige Skalierung, Eingabe, Schleife ===== */
(function(M){
'use strict';
if (typeof document==='undefined') return;
var cv=document.getElementById('game'), ctx=cv.getContext('2d',{alpha:false}), img=ctx.createImageData(320,200);
var u32=new Uint32Array(img.data.buffer), PAL=new Uint32Array(256);
for (var i=0;i<256;i++){ var q=M.RGB[i]||M.RGB[0]; PAL[i]=(255<<24)|(q[2]<<16)|(q[1]<<8)|q[0]; }
ctx.imageSmoothingEnabled=false;
var hint=document.getElementById('hint');
// Röhrenbild (Menüpunkt): Scanlines + Vignette
var crtEl=document.createElement('div'); crtEl.id='crt'; document.body.appendChild(crtEl);
var st=document.createElement('style'); st.textContent='#crt{position:fixed;pointer-events:none;display:none;z-index:5}#crt.on{display:block;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.5) 100%),repeating-linear-gradient(var(--dir,to bottom),rgba(0,0,0,.3) 0,rgba(0,0,0,.3) var(--a),rgba(0,0,0,0) var(--a),rgba(0,0,0,0) var(--b));border-radius:16px}#game.crt{filter:saturate(1.15) contrast(1.06) brightness(1.1);border-radius:16px}';
document.head.appendChild(st);
var crt=false; try{ crt=localStorage.getItem('mala.crt')==='1'; }catch(e){}
function placeCRT(){ var r=cv.getBoundingClientRect(); crtEl.style.left=r.left+'px'; crtEl.style.top=r.top+'px'; crtEl.style.width=r.width+'px'; crtEl.style.height=r.height+'px'; var row=(rot?r.width:r.height)/200; crtEl.style.setProperty('--a',(row*0.45)+'px'); crtEl.style.setProperty('--b',row+'px'); crtEl.style.setProperty('--dir',rot?'to left':'to bottom'); }
M.crtOn=function(){ return crt; };
M.setCRT=function(on){ crt=on; try{ localStorage.setItem('mala.crt',on?'1':'0'); }catch(e){} crtEl.className=on?'on':''; cv.className=on?'crt':''; placeCRT(); };
M.fullscreen=function(){ var d=document.documentElement; try{ var r=(d.requestFullscreen||d.webkitRequestFullscreen||function(){}).call(d); if (r&&r.then) r.then(function(){ lockLandscape(); setTimeout(fit,200); }).catch(function(){}); }catch(e){} };
// Querformat: Steht das Gerät hochkant, wird das Spielbild um 90° gedreht und füllt die lange Seite.
// So spielt man immer quer, auch mit gesperrter Bildschirmdrehung (iPad/iPhone können die Ausrichtung nicht per Skript sperren).
var rot=false;
function touchDev(){ try{ return (navigator.maxTouchPoints||0)>0 || (window.matchMedia&&matchMedia('(pointer: coarse)').matches); }catch(e){ return false; } }   // nur Tablets und Telefone drehen, kein hohes Desktopfenster
function fit(){ var dpr=window.devicePixelRatio||1, box=window.MALA_FIT?window.MALA_FIT():[window.innerWidth,window.innerHeight], vw=box[0], vh=box[1];
  rot=touchDev()&&vh>vw*1.05; var lw=rot?vh:vw, lh=rot?vw:vh;   // verfügbare Breite und Höhe im Querformat
  var s=Math.floor(Math.min(lw*dpr/320,lh*dpr/200)), css;
  if (s>=1) css=320*s/dpr; else css=lw; if (css*200/320>lh) css=lh*320/200; if (css>lw) css=lw;
  cv.style.width=css+'px'; cv.style.height=(css*200/320)+'px';
  if (rot){ cv.style.position='fixed'; cv.style.left='50%'; cv.style.top='50%'; cv.style.transform='translate(-50%,-50%) rotate(90deg)'; }
  else { cv.style.position=''; cv.style.left=''; cv.style.top=''; cv.style.transform=''; }
  document.documentElement.classList.toggle('mala-rot',rot); if (hint) hint.style.display='none'; setTimeout(placeCRT,0); }
M.isRotated=function(){ return rot; };
// Wo der Browser es kann (Android, Vollbild, installierte App), zusätzlich die Ausrichtung auf quer sperren
function lockLandscape(){ try{ var o=screen.orientation; if (o&&o.lock){ var r=o.lock('landscape'); if (r&&r.catch) r.catch(function(){}); } }catch(e){} }
window.addEventListener('resize',fit); window.addEventListener('orientationchange',function(){ setTimeout(fit,250); }); fit();
function toLogical(e){ var r=cv.getBoundingClientRect();
  if (rot) return [(e.clientY-r.top)/r.height*320,(r.right-e.clientX)/r.width*200];   // im Uhrzeigersinn gedreht: x läuft nach unten, y nach links
  return [(e.clientX-r.left)/r.width*320,(e.clientY-r.top)/r.height*200]; }
var locked=false; cv.addEventListener('pointerdown',function(e){ e.preventDefault(); if (!locked){ locked=true; lockLandscape(); } try{ cv.setPointerCapture(e.pointerId); }catch(_){} var p=toLogical(e); M.pointerDown(p[0],p[1],e.pointerType!=='mouse'); });
cv.addEventListener('pointermove',function(e){ var p=toLogical(e); M.pointerMove(p[0],p[1],e.pointerType!=='mouse'); });
cv.addEventListener('pointerup',function(e){ e.preventDefault(); var p=toLogical(e); M.pointerUp(p[0],p[1],e.pointerType!=='mouse'); });
cv.addEventListener('contextmenu',function(e){ e.preventDefault(); });
document.addEventListener('keydown',function(e){ if (e.key===' '||e.key==='Tab') e.preventDefault(); M.key(e.key); });
document.addEventListener('touchmove',function(e){ if (e.target===cv) e.preventDefault(); },{passive:false});
document.addEventListener('touchend',function(){ try{ M.audioInit(); }catch(_){} },{passive:true});
document.addEventListener('gesturestart',function(e){ e.preventDefault(); });
document.addEventListener('visibilitychange',function(){ if (document.hidden){ try{ M.saveGame(); }catch(e){} } });
window.addEventListener('pagehide',function(){ try{ M.saveGame(); }catch(e){} });
var last=performance.now();
function frame(now){ var dt=now-last; last=now;
  try{ M.update(dt); var fb=M.renderFrame(), d=fb.d; for (var i=0;i<64000;i++) u32[i]=PAL[d[i]]; ctx.putImageData(img,0,0);
    if (M.__capNext && M.E.speech){ var ck=M.__capNext; M.__capNext=null; try{ M.__caps[ck]=cv.toDataURL(); }catch(e){} } }catch(err){ console.error(err); }
  requestAnimationFrame(frame); }
if (M.boot) M.boot();
M.setCRT(crt);
M.music('title');
requestAnimationFrame(frame);
})(M);
