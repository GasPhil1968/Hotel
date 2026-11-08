/* ===== 07_bar.js — Aktionsleiste für Fingereingabe (Touch-Konzept C2, C3, D1; T03, T06, T07): die Handlungen eines Dings, die Auswahl
   zwischen nahen Dingen, die übrigen Handlungen eines gewählten Gegenstands und „✕“ der Overlays als HTML-Knöpfe ≥ 44 CSS-px.
   Was zu sehen ist und was ein Knopf tut, bestimmt 06_ui.js (M.barView, M.barAct) mit denselben Handlungen wie das Menü am Zeiger;
   hier steht nur die Darstellung. Mit Maus oder Trackpad bleibt das Menü am Zeiger im Canvas. In der Node-VM (ohne DOM) gibt es diese
   Schicht nicht. ===== */
(function(M){
'use strict';
var E=M.E, DOM=(typeof document!=='undefined' && typeof window!=='undefined' && !!document.createElement);
M.barOn=function(){ return DOM; };
if (!DOM) return;
function T(s){ try{ return M.trUI?M.trUI(s):s; }catch(e){ return s; } }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
var root=null, barEl=null, xEl=null, key='';
function build(){ root=document.createElement('div'); root.id='abar';
  root.innerHTML='<div class="ab-bar" role="toolbar"></div><button type="button" class="ab-x" tabindex="-1">✕</button>'; document.body.appendChild(root);
  barEl=root.querySelector('.ab-bar'); xEl=root.querySelector('.ab-x');
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  [barEl,xEl].forEach(function(el){ el.addEventListener('mousedown',function(e){ e.preventDefault(); }); el.addEventListener('pointerdown',function(e){ e.stopPropagation(); }); });   // kein Fokus, kein Tipp in die Szene darunter
  barEl.addEventListener('click',function(e){ var b=e.target.closest('button'); if (!b) return; if (M.audioInit) M.audioInit(); M.barAct(b.dataset.a,+b.dataset.k); M.barSync(); });
  xEl.addEventListener('click',function(){ if (M.audioInit) M.audioInit(); M.barAct('ovx'); M.barSync(); }); }
// Lage im logischen Querformat-Raum wie die Untertitelschicht: im gedrehten Hochformat dreht die ganze Schicht mit
function geo(){ var cv=document.getElementById('game'); if (!cv) return null; var rot=!!(M.isRotated&&M.isRotated()), wide=!!(M.isWide&&M.isWide()), vw=window.innerWidth, vh=window.innerHeight;
  var W=rot?vh:vw, H=rot?vw:vh, cw=parseFloat(cv.style.width)||cv.clientWidth, ch=parseFloat(cv.style.height)||cv.clientHeight, cx, cy;
  if (rot){ cx=(W-cw)/2; cy=(H-ch)/2; } else { var r=cv.getBoundingClientRect(); cx=r.left; cy=r.top; }
  var g={rot:rot,W:W,H:H,cx:cx,cy:cy,cw:cw,ch:ch,s:cw/320};
  if (wide){ var h=document.getElementById('hud').getBoundingClientRect(), WG=M.wideGeo(); g.hx=h.left; g.hy=h.top; g.k=h.width/WG.Wh; }
  return g; }
// Rechteck der Leiste bzw. des Spielbilds (Leistenpixel im Breitbild, sonst Spielpixel) → CSS-Pixel
function rectCss(g,v,r){ if (v.geo.wide) return [g.hx+r[0]*g.k,g.hy+r[1]*g.k,r[2]*g.k,r[3]*g.k]; return [g.cx+r[0]*g.s,g.cy+r[1]*g.s,r[2]*g.s,r[3]*g.s]; }
function yCss(g,v,y){ return v.geo.wide?g.hy+y*g.k:g.cy+y*g.s; }
M.barSync=function(){ if (!root) build(); var v=M.barView?M.barView():null, g=v?geo():null; if (!g) v=null;
  var ghost=M.GS&&M.GS.active==='mala', u=g?Math.max(2,Math.min(4,Math.ceil(g.s*0.75))):2;
  var k=v?JSON.stringify([v.kind,v.title,v.opts,v.item,v.slot,g.rot,g.W,g.H,Math.round(g.cx),Math.round(g.cy),Math.round(g.cw),Math.round(g.hx||0),Math.round(g.hy||0),g.k||0,ghost,M.lang]):'off';
  if (k===key) return; key=k;
  if (!v){ root.className=''; barEl.innerHTML=''; return; }
  root.className='on'+(ghost?' g':'')+(v.kind==='ovx'?' ov':''); root.style.setProperty('--u',u);
  root.style.width=g.W+'px'; root.style.height=g.H+'px'; root.style.left=g.rot?'50%':'0'; root.style.top=g.rot?'50%':'0'; root.style.transform=g.rot?'translate(-50%,-50%) rotate(90deg)':'';
  xEl.setAttribute('aria-label',T('Schließen'));
  if (v.kind==='ovx'){ barEl.innerHTML=''; xEl.style.left=(g.cx+g.cw-48)+'px'; xEl.style.top=(g.cy+4)+'px'; return; }   // „✕“ oben rechts im Bild, wie Esc
  var h='';
  if (v.kind==='pop'){   // Handlungen eines Dings bzw. „Welches?“: statt Inventarzeile, das Ding bleibt im Bild gerahmt
    h+='<span class="ab-t">'+esc(T(v.title))+'</span>';
    v.opts.forEach(function(t,i){ h+='<button type="button" tabindex="-1" class="ab-b" data-a="pop" data-k="'+i+'">'+esc(T(t))+'</button>'; });
    h+='<button type="button" tabindex="-1" class="ab-b ab-c" data-a="popx" data-k="0" aria-label="'+esc(T('Schließen'))+'">✕</button>';
    barEl.innerHTML=h; var R=rectCss(g,v,v.geo.row);
    barEl.className='ab-bar ab-row'; barEl.style.left=R[0]+'px'; barEl.style.width=R[2]+'px'; barEl.style.top=''; barEl.style.bottom=(g.H-(R[1]+R[3]))+'px'; barEl.style.minHeight=R[3]+'px'; return; }
  // gewählter Gegenstand: „Benutze … mit …“ steht in der Satzzeile; hier Ansehen und die übrigen Handlungen, über dem Feld, ohne das Inventar zu verdecken
  v.opts.forEach(function(t,i){ h+='<button type="button" tabindex="-1" class="ab-b" data-a="item" data-k="'+i+'">'+esc(T(t))+'</button>'; });
  h+='<button type="button" tabindex="-1" class="ab-b ab-c" data-a="itemx" data-k="0" aria-label="'+esc(T('Abbrechen'))+'">✕</button>';
  barEl.innerHTML=h; barEl.className='ab-bar ab-item'; barEl.style.minHeight=''; barEl.style.width=''; barEl.style.top='';
  var bw=barEl.getBoundingClientRect().width, sc=v.geo.wide?[g.hx,g.hx+(M.wideGeo().Wh*g.k)]:[g.cx,g.cx+g.cw], cxs;
  if (v.slot){ var S=rectCss(g,v,v.slot); cxs=S[0]+S[2]/2; } else { var R2=rectCss(g,v,v.geo.row); cxs=R2[0]+R2[2]/2; }
  barEl.style.left=Math.max(sc[0]+4,Math.min(sc[1]-4-bw,cxs-bw/2))+'px'; barEl.style.bottom=(g.H-yCss(g,v,v.geo.scB)+4)+'px'; };
var CSS='#abar{position:fixed;left:0;top:0;z-index:12;pointer-events:none;display:none;font-family:"MALA Pixel",ui-monospace,monospace;font-size:calc(var(--u)*10px);line-height:1.2;-webkit-font-smoothing:none;color:#e3d9c0;-webkit-user-select:none;user-select:none}'
+'#abar *{box-sizing:border-box}#abar.on{display:block}#abar .ab-x{display:none}#abar.ov .ab-x{display:flex}#abar.ov .ab-bar{display:none}'
+'#abar .ab-bar{position:absolute;display:flex;flex-wrap:wrap-reverse;align-items:center;gap:6px;pointer-events:auto;background:#08070d;border:2px solid #c8bb9f;padding:4px 6px;touch-action:manipulation}'
+'#abar .ab-row{justify-content:flex-start}#abar .ab-t{color:#f3c75c;margin-right:auto;padding:0 6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:40%}'
+'#abar .ab-item{flex-wrap:nowrap}'
+'#abar .ab-b,#abar .ab-x{appearance:none;font:inherit;color:inherit;background:#1e1b2a;border:2px solid #5a5248;min-height:44px;min-width:96px;padding:2px 10px;cursor:pointer;touch-action:manipulation;align-items:center;justify-content:center}'
+'#abar .ab-b:active,#abar .ab-x:active{background:#3a3346;color:#fffdf4}#abar .ab-c{min-width:44px;color:#f3c75c}'
+'#abar .ab-x{position:absolute;pointer-events:auto;width:44px;height:44px;min-width:44px;padding:0;background:rgba(8,7,13,.92);border-color:#c8bb9f;color:#f3c75c;font-size:22px}'
// spielt man Mala: die kalten Töne wie im Canvas
+'#abar.g .ab-bar{border-color:#2c6074}#abar.g .ab-b{background:#0d202d;border-color:#2c6074;color:#82c1c9}#abar.g .ab-t,#abar.g .ab-c{color:#c3ecee}#abar.g .ab-x{border-color:#2c6074;color:#c3ecee}';
})(M);
