/* ===== 07_subs.js — Untertitelschicht (UI-Konzept B3-2, Phase 4): Sätze und Antwortlisten der Gespräche als HTML, in der Leseschrift
   oder groß. Aktiv, sobald in den Einstellungen „Schrift: Lesbar“ oder „Textgröße: groß“ gewählt ist. Der Canvas zeichnet dann weiter
   Szene und Brustbilder, aber keine Sätze und keine Antwortzeilen; was in einem Bild zu sehen wäre, meldet er über M.subsFrame()
   (06_ui.js). In der Node-VM (ohne DOM) bleibt alles beim Canvas. ===== */
(function(M){
'use strict';
var E=M.E, DOM=(typeof document!=='undefined' && typeof window!=='undefined' && !!document.createElement);
M.subsOn=function(){ if (!DOM) return false; var p=M.uiPrefs?M.uiPrefs():null; return !!(p && (p.font==='read' || p.size===1)); };
// Touch-Konzept T05: War die letzte Eingabe ein Finger, steht die Antwortliste immer als HTML (Zeilen ≥ 44 CSS-px, Wischen scrollt), auch in der Pixelschrift;
// die Sätze zeichnet dann weiter der Canvas (nur mit „Lesbar“ oder „groß“ wandern auch sie in diese Schicht)
M.listHtml=function(){ return DOM && !!(M.lastTouch && M.lastTouch()); };
if (!DOM) return;
function T(s){ try{ return M.trUI?M.trUI(s):s; }catch(e){ return s; } }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function css(ci){ var q=M.RGB[ci]; return q?'rgb('+q[0]+','+q[1]+','+q[2]+')':'#e3d9c0'; }
var root=null, lineEl=null, choEl=null, key='', sidN=0;
function build(){ root=document.createElement('div'); root.id='subs'; root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="sb-line" role="status" aria-live="polite"></div><div class="sb-cho" role="listbox"></div>'; document.body.appendChild(root);
  lineEl=root.querySelector('.sb-line'); choEl=root.querySelector('.sb-cho');
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  // Antworten: Klick wählt wie ein Tipp auf die Canvas-Zeile; läuft noch ein Satz, beendet der Tipp erst den Satz (wie im Canvas)
  choEl.addEventListener('mousedown',function(e){ e.preventDefault(); });   // kein Fokus auf den Knöpfen: Tasten laufen weiter über M.key
  choEl.addEventListener('pointerdown',function(e){ e.stopPropagation(); });
  var downR=0; choEl.addEventListener('pointerdown',function(){ try{ downR=performance.now(); }catch(e){ downR=Date.now(); } },true);
  choEl.addEventListener('click',function(e){ var b=e.target.closest('button'); if (!b||!E.dlg) return; if (M.audioInit) M.audioInit();
    if (E.speech){ if (E.gt()-E.speech.at>200) E.endSpeech(); return; }
    if (M.dlgLocked && M.dlgLocked(downR)) return;   // Touch-Konzept T04: gerade erschienene Liste nimmt noch keinen Tipp an
    var k=+b.dataset.k; if (!(k>=0&&k<E.dlg.opts.length)) return; if (M.sfx) M.sfx('click'); E.chooseDone(k); }); }
// Lage im logischen Querformat-Raum: gewohntes Bild (Canvas) oder Breitbild (Szene + Leiste); im gedrehten Hochformat dreht die Schicht mit
function geo(){ var cv=document.getElementById('game'); if (!cv) return null; var rot=!!(M.isRotated&&M.isRotated()), wide=!!(M.isWide&&M.isWide()), WG=wide&&M.wideGeo?M.wideGeo():null, vw=window.innerWidth, vh=window.innerHeight;
  var W=rot?vh:vw, H=rot?vw:vh, cw=parseFloat(cv.style.width)||cv.clientWidth, ch=parseFloat(cv.style.height)||cv.clientHeight, cx, cy;
  if (rot){ cx=(W-cw)/2; cy=(H-ch)/2; } else { var r=cv.getBoundingClientRect(); cx=r.left; cy=r.top; }
  var picB=WG?WG.y0+WG.cssH:cy+ch, picH=WG?WG.cssH:ch, s=cw/320, u=Math.max(2,Math.min(4,Math.ceil(s*0.75)));
  var below=(!rot && !WG)?H-picB:0;   // Touch-Konzept T22: freier Platz unter dem Bild (Tablet: das Bild steht oben, 99_main.js)
  return {rot:rot,wide:!!WG,W:W,H:H,cx:cx,cy:cy,cw:cw,ch:ch,picB:picB,picH:picH,u:u,below:below>=132?below:0,scB:cy+ch*144/200}; }
function speakerName(sp){ var w=String(sp.who||''); if (!w||w==='#'||w==='@') return ''; var id=w.replace(/^@/,'');
  if (id==='marko') return 'Marko'; if (id==='mala') return M.GS.flags['mala.unknown']?T('Schimmer'):'Mala';
  var R=E.room, h=R&&R.hotspots?R.hotspots.filter(function(x){ return x.npc===id; })[0]:null;
  if (h){ var n=E.nameOf(h); if (n && n!==h.uname && n!=='Leere Stelle') return T(n); }   // wie beim Zeigen; ungesehene Geister bleiben ohne Namen
  return ''; }
function speakerColor(sp){ var o=sp.opt||{}, w=String(sp.who||''), id=w.replace(/^@/,''), a=E.ACT[w]||E.ACT[id];
  if (o.color!==undefined) return css(o.color); if (o.voice) return css(M.P.x4); if (w==='#') return css(M.P.l0);
  if (a && a.color!==undefined) return css(a.color); if (M.CAST_COLORS[id]!==undefined) return css(M.CAST_COLORS[id]); return css(M.P.l0); }
M.subsSync=function(){ if (!root) build(); var full=M.subsOn(), F=M.subsFrame?M.subsFrame():null, on=!!(F && (full || M.listHtml()) && E.screen==='game' && !E.menu);
  var sp=on&&full&&F.sp===E.speech?F.sp:null, d=on&&F.dlg===E.dlg?F.dlg:null, g=(sp||d)?geo():null; if (!g){ sp=null; d=null; }
  if (d && !d._sid) d._sid=++sidN;
  var waiting=!!(sp && E.tapText() && E.busy && E.gt()>=sp.until), P=M.uiPrefs(), ghost=M.GS.active==='mala';
  var k=(sp||d)?JSON.stringify([sp?[sp.text,sp.who,sp.at,waiting]:0, d?[d._sid,d.opts.length,d.kf==null?-1:d.kf,!!E.speech,M.lang]:0, [g.rot,g.wide,g.W,g.H,Math.round(g.cx),Math.round(g.cy),Math.round(g.cw),Math.round(g.picB),g.u,Math.round(g.below)], P.font, P.size, P.motion, ghost]):'off';
  if (d){ d.vis=d.opts.map(function(o,i){ return i; }).slice(0,9); d.visTop=d.top; }   // Ziffern 1–9 wählen die ersten neun Zeilen der Liste
  if (k===key) return; key=k;
  if (!sp&&!d){ root.className=''; lineEl.innerHTML=''; choEl.innerHTML=''; return; }
  root.className='on'+(P.font==='read'?' rd':'')+(P.size===1?' sz1':'')+(P.motion?' rm':'')+(ghost?' g':'')+(g.below&&d?' bl':'');
  root.style.setProperty('--u',g.u); root.style.width=g.W+'px'; root.style.height=g.H+'px'; root.style.left=g.rot?'50%':'0'; root.style.top=g.rot?'50%':'0'; root.style.transform=g.rot?'translate(-50%,-50%) rotate(90deg)':'';
  var side=g.cx+g.cw*0.04, w=g.cw*0.92, bot=g.H-g.picB+Math.max(8,g.u*2);   // ≥ 8 CSS-px über der Unterkante (Safe Area, T05)
  // Antwortliste: unten im Bild über der (abgedunkelten) Leiste; schon gefragte Zeilen gedämpft, Tastaturauswahl hervorgehoben
  if (d){ var v=M.dlgView(), h='';
    if (v.title) h+='<div class="sb-title">'+esc(v.title)+'</div>';
    v.opts.forEach(function(o,i){ h+='<button type="button" tabindex="-1" class="sb-o'+(o.asked?' asked':'')+(d.kf===i?' kf':'')+'" data-k="'+i+'"><span class="n">'+(i<9?(i+1):'')+'</span><span class="t">'+esc(o.t)+'</span></button>'; });
    choEl.innerHTML=h; choEl.style.left=side+'px'; choEl.style.width=w+'px';
    if (g.below){ choEl.style.top=(g.picB+6)+'px'; choEl.style.bottom=''; choEl.style.maxHeight=(g.below-12)+'px'; }   // unter dem Bild: Szene und Leiste bleiben sichtbar
    else { choEl.style.top=''; choEl.style.bottom=bot+'px'; choEl.style.maxHeight=(g.picH*(sp?0.5:0.72))+'px'; }
    choEl.style.display='flex';
    var kb=d.kf!=null?choEl.querySelector('[data-k="'+d.kf+'"]'):null; if (kb&&kb.scrollIntoView) try{ kb.scrollIntoView({block:'nearest'}); }catch(e){} }
  else { choEl.innerHTML=''; choEl.style.display='none'; }
  // Satz: unten im Bild, über einer offenen Antwortliste; Tippen geht an den Canvas darunter (überspringt wie gewohnt)
  if (sp){ var nm=speakerName(sp), col=speakerColor(sp), voice=!!(sp.opt&&sp.opt.voice);
    lineEl.innerHTML=(nm?'<span class="who" style="color:'+col+'">'+esc(nm)+': </span>':'')+'<span class="tx'+(voice?' voice':'')+'" style="color:'+col+'">'+esc(T(sp.text))+'</span>'+(waiting?' <span class="more">▸</span>':'');
    lineEl.style.left=side+'px'; lineEl.style.width=w+'px'; lineEl.style.display='block';
    lineEl.style.bottom=(d&&g.below?g.H-g.scB+Math.max(4,g.u*2):(d?bot+choEl.getBoundingClientRect().height+Math.max(4,g.u*2):bot))+'px'; }
  else { lineEl.innerHTML=''; lineEl.style.display='none'; } };
var CSS='#subs{position:fixed;left:0;top:0;z-index:11;pointer-events:none;display:none;--fs:calc(var(--u)*10px);--lh:calc(var(--u)*12px);font-family:"MALA Pixel",ui-monospace,monospace;font-size:var(--fs);line-height:var(--lh);-webkit-font-smoothing:none;color:#e3d9c0;-webkit-user-select:none;user-select:none}'
+'#subs *{box-sizing:border-box}#subs.on{display:block}#subs.sz1{--fs:calc((var(--u) + 1)*10px);--lh:calc((var(--u) + 1)*12px)}#subs.rd{font-family:"Atkinson Hyperlegible Next","MALA Pixel",system-ui,sans-serif;-webkit-font-smoothing:auto;--lh:calc(var(--fs)*1.3)}'
+'#subs .sb-line{position:absolute;display:none;background:rgba(8,7,13,.88);border:calc(var(--u)*1px) solid #5a5248;padding:calc(var(--u)*3px) calc(var(--u)*6px)}'
+'#subs .sb-line .voice{font-style:italic}#subs .sb-line .more{color:#f3c75c;animation:sbblink .8s steps(1) infinite}#subs.rm .sb-line .more{animation:none}@keyframes sbblink{50%{opacity:0}}'
+'#subs .sb-cho{position:absolute;display:none;flex-direction:column;gap:calc(var(--u)*1px);overflow:auto;pointer-events:auto;background:rgba(8,7,13,.96);border:calc(var(--u)*1px) solid #c8bb9f;padding:calc(var(--u)*2px);overscroll-behavior:contain}'
+'#subs .sb-title{color:#f3c75c;padding:0 calc(var(--u)*3px)}#subs.bl .sb-cho{padding:2px;gap:2px;border-width:2px}#subs.bl .sb-o{min-height:44px}'
+'#subs .sb-o{appearance:none;border:0;background:transparent;color:#e3d9c0;font:inherit;text-align:left;display:flex;gap:calc(var(--u)*4px);align-items:center;flex:0 0 auto;min-height:max(44px,calc(var(--u)*16px));padding:calc(var(--u)*1px) calc(var(--u)*4px);cursor:pointer}'
+'#subs .sb-o:hover,#subs .sb-o.kf{background:#1e1b2a;color:#fffdf4}#subs .sb-o.asked{color:#a39882}#subs .sb-o .n{color:#d99a33;min-width:1ch;flex:0 0 auto}#subs .sb-o .t{min-width:0;overflow-wrap:anywhere}'
// Palette wie die Canvas-Liste: s5/s3/l1 auf k2, Rahmen s4; spielt man Mala, die kalten Töne x4/x3/x6 auf x0, Rahmen x2
+'#subs.g .sb-cho{border-color:#2c6074}#subs.g .sb-o{color:#82c1c9}#subs.g .sb-o.asked{color:#4b8f9f}#subs.g .sb-o:hover,#subs.g .sb-o.kf{background:#0d202d;color:#eefbfb}#subs.g .sb-o .n{color:#4b8f9f}#subs.g .sb-title{color:#c3ecee}';
})(M);
