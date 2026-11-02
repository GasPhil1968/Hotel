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
var st=document.createElement('style'); st.textContent='#crt{position:fixed;pointer-events:none;display:none;z-index:5}#crt.on{display:block;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.5) 100%),repeating-linear-gradient(to bottom,rgba(0,0,0,.3) 0,rgba(0,0,0,.3) var(--a),rgba(0,0,0,0) var(--a),rgba(0,0,0,0) var(--b));border-radius:16px}#game.crt{filter:saturate(1.15) contrast(1.06) brightness(1.1);border-radius:16px}';
document.head.appendChild(st);
var crt=false; try{ crt=localStorage.getItem('mala.crt')==='1'; }catch(e){}
function placeCRT(){ var r=cv.getBoundingClientRect(); crtEl.style.left=r.left+'px'; crtEl.style.top=r.top+'px'; crtEl.style.width=r.width+'px'; crtEl.style.height=r.height+'px'; var row=r.height/200; crtEl.style.setProperty('--a',(row*0.45)+'px'); crtEl.style.setProperty('--b',row+'px'); }
M.crtOn=function(){ return crt; };
M.setCRT=function(on){ crt=on; try{ localStorage.setItem('mala.crt',on?'1':'0'); }catch(e){} crtEl.className=on?'on':''; cv.className=on?'crt':''; placeCRT(); };
M.fullscreen=function(){ var d=document.documentElement; try{ (d.requestFullscreen||d.webkitRequestFullscreen||function(){}).call(d); }catch(e){} };
function fit(){ var dpr=window.devicePixelRatio||1, vw=window.innerWidth, vh=window.innerHeight; var s=Math.floor(Math.min(vw*dpr/320,vh*dpr/200)), css;
  if (s>=1) css=320*s/dpr; else css=vw; if (css*200/320>vh) css=vh*320/200; if (css>vw) css=vw;
  cv.style.width=css+'px'; cv.style.height=(css*200/320)+'px'; if (hint) hint.style.display=(vh>vw*1.1)?'block':'none'; setTimeout(placeCRT,0); }
window.addEventListener('resize',fit); window.addEventListener('orientationchange',function(){ setTimeout(fit,250); }); fit();
function toLogical(e){ var r=cv.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*320,(e.clientY-r.top)/r.height*200]; }
cv.addEventListener('pointerdown',function(e){ e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(_){} var p=toLogical(e); M.pointerDown(p[0],p[1],e.pointerType!=='mouse'); });
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
  try{ M.update(dt); var fb=M.renderFrame(), d=fb.d; for (var i=0;i<64000;i++) u32[i]=PAL[d[i]]; ctx.putImageData(img,0,0); }catch(err){ console.error(err); }
  requestAnimationFrame(frame); }
if (M.boot) M.boot();
M.setCRT(crt);
M.music('title');
requestAnimationFrame(frame);
})(M);
