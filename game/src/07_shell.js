/* ===== 07_shell.js — Systemoberfläche als HTML-Schicht (UI-Konzept Phase 2): Titel, Kapitelwahl, Laden, Speichern (Lesezeichen),
   Einstellungen, Über MALA, Steuerung, Pause, Bestätigungen und die Karte am Kapitelende.
   Das Modell (Bildschirme, Einträge, Aktionen) läuft auch ohne DOM – in der Node-VM der QA-Werkzeuge (M.shell.pick/items).
   Gezeichnet wird nur im Browser; der Canvas zeigt darunter weiter Titelbild bzw. Szene. ===== */
(function(M){
'use strict';
var E=M.E, DOM=(typeof document!=='undefined' && typeof window!=='undefined' && !!document.createElement);
function T(s){ try{ return M.trUI?M.trUI(s):s; }catch(e){ return s; } }
function LS(){ try{ return M.storage||(typeof localStorage!=='undefined'?localStorage:null); }catch(e){ return null; } }
function lsGet(k){ try{ var L=LS(); return L?L.getItem(k):null; }catch(e){ return null; } }
function lsSet(k,v){ try{ var L=LS(); if (L) L.setItem(k,v); return true; }catch(e){ return false; } }
function lsDel(k){ try{ var L=LS(); if (L) L.removeItem(k); }catch(e){} }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function pad(n){ return (n<10?'0':'')+n; }
function iosDev(){ try{ return DOM && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && (navigator.maxTouchPoints||0)>1)); }catch(e){ return false; } }
function standalone(){ try{ return DOM && (navigator.standalone===true || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches); }catch(e){ return false; } }
function touchCap(){ try{ return DOM && ((navigator.maxTouchPoints||0)>0 || matchMedia('(pointer: coarse)').matches); }catch(e){ return false; } }
function fsApi(){ try{ var d=DOM&&document.documentElement; return !!(d && (d.requestFullscreen||d.webkitRequestFullscreen)); }catch(e){ return false; } }
M.iosDev=iosDev; M.standalone=standalone;
function entries(n){ return n+' '+(n===1?'Eintrag':'Einträge'); }
var PLACES=['Split','Sarajevo','Mostar','München','Sarajevo'], ORD=['ersten','zweiten','dritten','vierten','fünften'];

// ---------------------------------------------------------------- Einstellungen ohne Spielbezug (je Gerät)
var PREF={ size:lsGet('mala.textsize')==='1'?1:0, font:lsGet('mala.font')==='read'?'read':'pix', motion:lsGet('mala.motion') };
M.reduceMotion=function(){ if (PREF.motion==='1') return true; if (PREF.motion==='0') return false; try{ return DOM && !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches); }catch(e){ return false; } };
M.uiPrefs=function(){ return {size:PREF.size,font:PREF.font,motion:M.reduceMotion()}; };
function setPref(k,v){ PREF[k]=v; if (k==='size') lsSet('mala.textsize',v?'1':'0'); if (k==='font') lsSet('mala.font',v); if (k==='motion') lsSet('mala.motion',v?'1':'0'); if (k==='motion') PREF.motion=v?'1':'0'; applyPrefs(); }

// ---------------------------------------------------------------- Kapitelsperre (Entscheidung des Autors): Kapitel N erst nach mala.c(N−1)end
// Testschalter ?kapitel=alle (oder M.DEV_ALL_CHAPTERS in der VM) gibt alles frei, ohne Marken zu schreiben.
M.allChapters=function(){ if (M.DEV_ALL_CHAPTERS) return true; try{ return DOM && /(^|[?&])kapitel=alle(&|$)/.test(location.search||''); }catch(e){ return false; } };
function chDone(n){ return !!lsGet('mala.c'+n+'end'); }
function chExists(n){ return n===1 || (n===2 && !!M.startChapter2) || (n===3 && !!M.startChapter3) || (n===4 && !!M.startChapter4) || (n===5 && !!M.startChapter5); }
function chOpen(n){ return chExists(n) && (n===1 || chDone(n-1) || M.allChapters()); }
M.chapterOpen=chOpen;
function chaptersReached(){ var n=1; for (var k=2;k<=5;k++) if (chOpen(k)) n=k; return n; }
// Kapitelwahl („Kapitel wählen“ im Titelmenü, bei Fortschritt auch „Neues Spiel“): jedes Kapitel ist ab dem ersten Start wählbar (Wunsch des Autors,
// ersetzt für die Kapitelwahl die Sperre oben). Wer später einsteigt, bekommt Standardantworten für das Vorherige. Die Sperre gilt für die Kapitelwahl
// nur noch mit M.CHAPTER_LOCK=true oder ?kapitel=sperre (Tests). Beispielstände, Orte im Titel und „Weiter mit Kapitel N“ hängen weiter vom Fortschritt ab.
M.CHAPTER_LOCK=false;
M.chapterLock=function(){ if (M.CHAPTER_LOCK) return true; try{ return DOM && /(^|[?&])kapitel=sperre(&|$)/.test(location.search||''); }catch(e){ return false; } };
function chPick(n){ return chExists(n) && (!M.chapterLock() || chOpen(n)); }
M.chapterPickable=chPick;
function nextChapter(){ for (var n=1;n<=5;n++) if (chExists(n) && !chDone(n)) return n; return 0; }

// ---------------------------------------------------------------- Zeit und Spielstände
function fmtDur(ms){ var m=Math.max(1,Math.round((ms||0)/60000)); return m<60?(m+' '+T('Min.')):(Math.floor(m/60)+' '+T('Std.')+(m%60?' '+(m%60)+' '+T('Min.'):'')); }
function fmtAt(at){ if (!at) return ''; var d=new Date(at), now=new Date(), hm=pad(d.getHours())+':'+pad(d.getMinutes());
  var day=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime(), dd=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();
  if (dd===day) return T('heute')+' '+hm; if (day-dd===86400000) return T('gestern')+' '+hm; return d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear(); }
function ago(at){ var s=Math.max(0,Math.round((Date.now()-at)/1000)); if (s<50) return T('gerade eben'); var m=Math.round(s/60); if (m<60) return T('vor')+' '+m+' '+T('Min.'); var h=Math.round(m/60); return T('vor')+' '+h+' '+T('Std.'); }
function chLabel(n){ return T('Kapitel')+' '+n; }
function stOf(n,k){ var key=k?E.keyMark(n,k):E.keyAuto(n), s=E.readEnv(key); if (!s) return null; s.slot=n; s.mark=k||0; if (!k) s.name=null; if (k==='sat') s.name=T('Vor dem Samstag'); return s; }
function slotStates(n){ var out=[], a=stOf(n,0); if (a) out.push(a); for (var k=1;k<=E.MARKS;k++){ var b=stOf(n,k); if (b) out.push(b); } var z=stOf(n,'sat'); if (z) out.push(z); return out; }
function playable(s){ return s && (s.kind==='auto'||s.kind==='mark'||(s.kind==='chapterEnd'&&s.next&&chExists(s.next))); }
function latest(){ var best=null; for (var n=1;n<=E.SLOTS;n++) slotStates(n).forEach(function(s){ if (playable(s) && (!best||s.at>best.at)) best=s; }); return best; }
function firstFree(){ for (var n=1;n<=E.SLOTS;n++) if (!E.hasSave(n)) return n; return 0; }
function anyState(){ for (var n=1;n<=E.SLOTS;n++) if (slotStates(n).length) return true; return false; }
function placeOf(s){ var m=s.meta||{}; if (s.kind==='chapterEnd') return chLabel(s.chapter)+' '+T('fertig'); if (s.name) return s.name; return chLabel(m.chapter||1)+' · '+T(m.roomName||m.phaseShort||''); }
function summary(s){ if (!s) return T('leer'); if (s.kind==='damaged') return T('Lässt sich nicht lesen'); if (s.kind==='incompatible') return T('Aus einer neueren Fassung'); return placeOf(s)+' · '+fmtDur((s.meta&&s.meta.playMs)||0); }
function badgeOf(s){ return s.kind==='auto'?T('Automatisch'):(s.kind==='mark'&&s.mark==='sat')?T('Punkt ohne Rückkehr'):s.kind==='mark'?(T('Lesezeichen')+' '+s.mark):s.kind==='chapterEnd'?T('Kapitelende'):s.kind==='incompatible'?T('Inkompatibel'):T('Beschädigt'); }
var REASON={ busy:'Nach der Szene wieder möglich.', nosave:'Hier geht Speichern nicht.', quota:'Speichern fehlgeschlagen: Der Browser-Speicher ist voll.', screen:'Gerade nicht möglich.', ended:'Das Kapitel ist zu Ende.', error:'Speichern fehlgeschlagen.' };
var LREASON={ damaged:'Dieser Spielstand lässt sich nicht lesen.', incompatible:'Dieser Spielstand stammt aus einer neueren Fassung. Bitte das Spiel aktualisieren.', empty:'Kein Spielstand.', read:'Der Browser-Speicher ist nicht lesbar.', chapterEnd:'Das Kapitel ist zu Ende.' };

// ---------------------------------------------------------------- Zustand der Schicht
var SH={ ctx:null, stack:[], toast:null, lastScreen:null, pendCh:0, pendCont:false };
M.shell=SH;
function top(){ return SH.stack[SH.stack.length-1]||null; }
function push(id,p){ var t=top(); if (t && DOM && stage && document.activeElement && stage.contains(document.activeElement)) t.focus=keyOf(document.activeElement); SH.stack.push({id:id,p:p||{}}); render(true); }
function replace(id,p){ SH.stack[SH.stack.length-1]={id:id,p:p||{}}; render(true); }
// zurück: Fokus auf den auslösenden Eintrag (F11)
function back(){ if (SH.stack.length>1){ SH.stack.pop(); render(true,(top()||{}).focus); return true; } if (SH.ctx==='pause'){ closePause(); return true; } return false; }
function openCtx(ctx,id,p){ SH.ctx=ctx; SH.stack=[{id:id,p:p||{}}]; render(true); }
function closeAll(){ SH.ctx=null; SH.stack=[]; render(false); }
// Zurück-Taste (Android, Browser): solange eine Menüebene im Spiel offen ist, liegt ein Verlaufseintrag darüber; „zurück“ schließt die oberste Ebene (UI-Konzept D4)
// Der Eintrag bleibt nach dem Schließen liegen und wird beim nächsten Öffnen wiederverwendet (kein history.back(): das liefe asynchron in laufende Eingaben).
var histOn=false; function histPush(){ if (!DOM||histOn) return; try{ history.pushState({mala:1},''); histOn=true; }catch(e){} }
if (DOM) window.addEventListener('popstate',function(){ if (!histOn) return; histOn=false; if (SH.ctx==='pause'){ back(); if (SH.ctx==='pause') histPush(); } });
function closePause(){ if (E.menu){ E.menu=null; E.paused(false); } if (M.duckMusic) M.duckMusic(false); closeAll(); }
function toast(t,ms,act){ SH.toast={t:T(t),until:Date.now()+(ms||2600),act:act||null}; renderToast(); }
SH.toastNow=function(){ return SH.toast&&Date.now()<SH.toast.until?SH.toast:null; };
M.flashShell=toast;

// ---------------------------------------------------------------- Aktionen
function startNew(ch,n){ SH.pendCh=0; E.setSlot(n); E.newCh=ch; E.titleMode='main'; E.newGame(ch); }
function withSlot(purpose,then){ var n=firstFree(); if (n){ then(n,true); return; } push('slots',{purpose:purpose,then:then}); }
function newGameFlow(){ if (chaptersReached()===1){ withSlot('new',function(n,free){ startNew(1,n); if (free && n>1) toast('Startet auf Platz '+n+'.'); }); return; } push('chapters'); }
function loadState(s,opt){ opt=opt||{}; if (!s) return false; if (s.kind==='chapterEnd'){ E.setSlot(s.slot); push('next',{ch:s.chapter,slot:s.slot}); return true; }
  if (s.kind!=='auto'&&s.kind!=='mark'){ toast(LREASON[s.kind]||LREASON.damaged,4000); return false; }
  var inGame=SH.ctx==='pause', prevSlot=E.slot(); E.setSlot(s.slot);
  var ok=E.loadKey(s.key,{undo:inGame}); if (!ok){ E.setSlot(prevSlot); toast(LREASON[E.loadReason]||'Laden fehlgeschlagen. Das laufende Spiel ist unverändert.',4500); return false; }
  closeAll(); if (inGame && lsGet('mala.undo')) toast('Geladen: '+placeOf(s)+'.',10000,{label:'Rückgängig',fn:undoLoad}); else if (!inGame && opt.recap!==false) recap(); return true; }
function recap(){ var g=M.GS, m=E.metaOf(g), open=(E.nbOpen?E.nbOpen(false):[]).slice().sort(function(a,b){ return g.notes.indexOf(b)-g.notes.indexOf(a); }).slice(0,3);
  SH.recapData={place:chLabel(m.chapter)+' · '+T(m.roomName||''),notes:open.map(function(id){ var n=M.NOTES[id]; return T(n.s||n.t); }),until:Date.now()+9000}; renderRecap(); }
SH.recapNow=function(){ return SH.recapData&&Date.now()<SH.recapData.until?SH.recapData:null; };
function renderRecap(){ if (!DOM) return; if (!root) build(); var r=SH.recapNow(); if (r && !SH.ctx) geom(); if (!r){ recapEl.className='sh-recap'; recapEl.innerHTML=''; return; }
  recapEl.innerHTML='<div class="k">'+esc(T('Zuletzt'))+'</div><div class="p">'+esc(r.place)+'</div>'+(r.notes.length?'<ul>'+r.notes.map(function(t){ return '<li>'+esc(t)+'</li>'; }).join('')+'</ul>':''); recapEl.className='sh-recap on';
  clearTimeout(renderRecap.tm); renderRecap.tm=setTimeout(renderRecap,Math.max(50,r.until-Date.now()+30)); }
function undoLoad(){ var raw=lsGet('mala.undo'); if (!raw) return; try{ var d=JSON.parse(raw); if (d.slot) E.setSlot(d.slot); }catch(e){} if (E.loadKey('mala.undo',{undo:false})){ lsDel('mala.undo'); toast('Zurückgeholt.'); } else toast('Rückgängig ging nicht.'); }
function continueLatest(){ var s=latest(); if (!s){ toast('Kein Spielstand.'); return; } loadState(s); }
function canMark(){ var r=E.room; if (E.screen!=='game'||!r) return 'screen'; if (r.noSave) return 'nosave'; if (M.GS.ended) return 'ended'; if (E.busy||E.dlg||E.overlay||E.transitioning) return 'busy'; return null; }
function saveMark(k){ var why=canMark(); if (why){ toast(REASON[why],3500); return false; } var ok=E.saveMark(k); if (ok){ toast('Gespeichert ✓ Lesezeichen '+k); render(true); } else toast(REASON[E.saveReason]||REASON.error,4500); return ok; }
function toTitle(){ var n=E.slot(); closePause(); E.toTitle(); toast(E.lastSaveOk?('Gespeichert – Platz '+n):'Zum Titelbild.'); }
function confirmDelete(s,after){ push('confirm',{title:'Spielstand löschen?',text:(T('Platz')+' '+s.slot+' · '+badgeOf(s)+' · '+summary(s)),okLabel:'Löschen',danger:true,before:s,
  ok:function(){ lsDel(s.key); back(); if (after) after(); toast('Gelöscht.'); }}); }
function startPreset(id){ var p=M.PRESETS&&M.PRESETS[id]; if (!p) return; withSlot('preset',function(n){ if (!E.loadPreset(id,n)) toast(LREASON.damaged,4000); else closeAll(); }); }
function presetChapter(p){ try{ return M.chapterOf?M.chapterOf(p.GS):1; }catch(e){ return 1; } }
function presets(){ return Object.keys(M.PRESETS||{}).filter(function(k){ return k[0]!=='_' && chOpen(presetChapter(M.PRESETS[k])); }); }

// ---------------------------------------------------------------- Bildschirme: Modell (Titel, Einträge, Aktionen)
// Eintrag: {type:'btn'|'card'|'state'|'seg'|'range'|'note'|'group'|'preview', label, sub, why, dis, primary, danger, act, value, options}
var SCR={};
// Touch-Konzept T14: einmaliger Hinweis auf iPhone/iPad – in Safari der Weg auf den Home-Bildschirm (ohne Leisten, ohne 7-Tage-Löschung),
// in der Home-Bildschirm-App der getrennte Speicher (Spielstände aus Safari kommen über die Sicherung als Datei herüber)
function platformNote(){ if (!iosDev()) return null;
  if (standalone()) return lsGet('mala.hint.app')?null:{key:'mala.hint.app',t:'Als App vom Home-Bildschirm hat das Spiel einen eigenen Speicher. Spielstände aus Safari holst du mit „Sicherung exportieren …“ in Safari und „Sicherung importieren …“ hier herüber (Spiel laden).'};
  return lsGet('mala.hint.home')?null:{key:'mala.hint.home',t:'Tipp für iPhone und iPad: Teilen → „Zum Home-Bildschirm“. Dann startet das Spiel ohne Browserleisten, und Safaris Löschung nach sieben Tagen ohne Besuch gilt dort nicht.'}; }
// Speicher möglichst dauerhaft anfordern, wo der Browser es ohne Rückfrage entscheidet (WebKit); einmal, beim ersten Tipp
if (DOM && navigator.storage && navigator.storage.persist && (iosDev()||standalone())) document.addEventListener('pointerdown',function(){ try{ navigator.storage.persisted().then(function(p){ if (!p) return navigator.storage.persist(); }).catch(function(){}); }catch(e){} },{once:true,capture:true});
SCR.main=function(){ var s=latest(), it=[];
  if (s) it.push({type:'card',label:'Fortsetzen',sub:placeOf(s),meta:(s.kind==='chapterEnd'?T('Weiter mit Kapitel')+' '+s.next:fmtAt(s.at)+' · '+fmtDur((s.meta&&s.meta.playMs)||0)),thumb:s.thumb||null,primary:true,act:continueLatest});
  it.push({type:'btn',label:'Neues Spiel',primary:!s,act:newGameFlow});
  it.push({type:'btn',label:'Kapitel wählen',act:function(){ push('chapters'); }});
  it.push({type:'btn',label:'Spiel laden',sub:anyState()?'':'Beispielstände',act:function(){ push('load',{scope:'title'}); }});
  it.push({type:'btn',label:'Einstellungen',act:function(){ push('settings'); }});
  it.push({type:'btn',label:'Über „Die Stillen“',act:function(){ push('about'); }});
  return {layout:'title',items:it,sound:!(M.audioRunning&&M.audioRunning()),note:platformNote()}; };
SCR.chapters=function(){ var n=firstFree(), it=[], nx=nextChapter(), fresh=!chDone(1);
  for (var c=1;c<=5;c++){ (function(c){ if (!chExists(c)) return; var pick=chPick(c);
    var sub=T(c===1?'von vorn':(chDone(c-1)?'mit deinem Ende von Kapitel '+(c-1):'Quereinstieg mit Standardantworten'));
    if (chDone(c)) sub+=' · '+T('schon gespielt');
    if (pick && c>1 && M.lang!=='de') sub+=' · '+T('bisher nur auf Deutsch');
    it.push(pick?{type:'btn',label:chLabel(c)+' · '+PLACES[c-1],sub:sub,primary:c===nx,act:function(){ withSlot('new',function(m,free){ startNew(c,m); if (free&&m>1) toast('Startet auf Platz '+m+'.'); }); }}
      :{type:'btn',label:chLabel(c),why:'nach Kapitel '+(c-1),dis:true,lock:true}); })(c); }
  if (!chExists(5)) it.push({type:'btn',label:chDone(4)?chLabel(5)+' · Sarajevo':chLabel(5),why:'noch nicht erschienen',dis:true,lock:true});
  if (fresh) it.push({type:'note',label:'Neu hier? Fang mit Kapitel 1 an. Die Kapitel bauen aufeinander auf; wer später einsteigt, bekommt Standardantworten für das Vorherige.'});
  return {layout:'panel',title:'Kapitel wählen',ctx:n?('Startet auf Platz '+n+' (frei). Deine anderen Spielstände bleiben.'):'Alle drei Plätze sind belegt: Du wählst gleich, welcher überschrieben wird.',items:it,back:true}; };
SCR.slots=function(p){ var it=[]; for (var n=1;n<=E.SLOTS;n++){ (function(n){ var s=stOf(n,0);
    it.push({type:'btn',label:T('Platz')+' '+n,sub:s?summary(s):T('leer'),act:function(){ if (!E.hasSave(n)){ p.then(n,true); return; }
      push('confirm',{title:'Platz '+n+' überschreiben?',text:'Der automatische Stand auf diesem Platz geht verloren. Lesezeichen bleiben.',before:s,okLabel:'Überschreiben',danger:true,ok:function(){ SH.stack.pop(); p.then(n,false); }}); }}); })(n); }
  return {layout:'panel',title:'Auf welchem Platz?',ctx:p.purpose==='preset'?'Der Beispielstand wird auf diesen Platz geladen.':'Das neue Spiel beginnt auf diesem Platz.',items:it,back:true}; };
SCR.load=function(p){ var title=p.scope==='title', groups=[], ns=[];
  if (title||p.all) for (var n=1;n<=E.SLOTS;n++) ns.push(n); else ns.push(E.slot());
  ns.forEach(function(n){ var st=slotStates(n), cards=[];
    st.forEach(function(s){ var ok=playable(s);
      cards.push({type:'state',state:s,badge:badgeOf(s),label:s.kind==='auto'||s.kind==='mark'||s.kind==='chapterEnd'?placeOf(s):T('Platz')+' '+n,
        sub:s.kind==='chapterEnd'?(s.next?T('Weiter mit Kapitel')+' '+s.next:T('Fortsetzung folgt')):(s.kind==='damaged'?T('Lässt sich nicht lesen.'):(s.kind==='incompatible'?T('Aus einer neueren Fassung – bitte aktualisieren.'):fmtAt(s.at)+((s.meta&&s.meta.playMs)?' · '+fmtDur(s.meta.playMs):''))),
        ph:s.meta&&s.meta.chapter?chLabel(s.meta.chapter):'', thumb:s.thumb||null, dis:!ok, act:ok?function(){ loadState(s); }:null,
        del:title?function(){ confirmDelete(s,function(){ render(true); }); }:null}); });
    if (!st.length) cards.push({type:'state',empty:true,badge:T('leer'),label:title?T('Neues Spiel hier'):T('leer'),dis:!title,act:title?function(){ newGameFlow(); }:null});
    groups.push({type:'group',label:T('Platz')+' '+n+(n===E.slot()&&!title?' · '+T('dieses Spiel'):''),cards:cards}); });
  var it=groups.slice();
  if (!title && !p.all) it.push({type:'btn',label:'Andere Plätze …',act:function(){ push('load',{scope:'pause',all:true}); }});
  if (title){ var pr=presets(); if (pr.length) it.push({type:'group',label:T('Beispielstände'),note:T('Enthalten Handlung aus den genannten Kapiteln.'),cards:pr.map(function(id){ var P=M.PRESETS[id];
    return {type:'state',preset:true,badge:T('Beispiel'),label:T(P.short||P.title||id),sub:chLabel(presetChapter(P)),act:function(){ startPreset(id); }}; })}); }
  it.push({type:'note',label:'Spielstände liegen nur in diesem Browser auf diesem Gerät.'});
  // Sicherung als Datei (B3-3): exportieren überall, einspielen nur vom Titelbild aus (ein laufendes Spiel würde die eingespielten Stände beim nächsten Ortswechsel überschreiben)
  if (M.saveExport) it.push({type:'btn',label:'Sicherung exportieren …',act:function(){ M.saveExport(); }});
  if (M.saveImport && title) it.push({type:'btn',label:'Sicherung importieren …',act:function(){ M.saveImport(); }});
  return {layout:'paper',title:'Spiel laden',items:it,back:true}; };
SCR.save=function(){ var n=E.slot(), why=canMark(), a=stOf(n,0), g=M.GS, it=[];
  for (var k=1;k<=E.MARKS;k++){ (function(k){ var s=stOf(n,k);
    it.push({type:'state',state:s,mark:k,badge:T('Lesezeichen')+' '+k,label:s?placeOf(s):T('Hier speichern'),ren:s&&(s.kind==='mark')?function(){ push('rename',{key:s.key,name:s.name||'',def:chLabel((s.meta||{}).chapter||1)+' · '+T((s.meta||{}).roomName||'')}); }:null,sub:s?fmtAt(s.at)+(s.meta?' · '+fmtDur(s.meta.playMs):''):(why?T(REASON[why]):T('jetzt')),ph:s&&s.meta?chLabel(s.meta.chapter):'',thumb:s&&s.thumb||null,empty:!s,dis:!!why,
      act:why?null:function(){ if (!s){ saveMark(k); return; } push('confirm',{title:'Lesezeichen '+k+' überschreiben?',text:'Das bisherige Lesezeichen geht verloren.',before:s,after:{label:T('Neu')+': '+T(E.metaOf(g).roomName||''),sub:T('jetzt'),thumb:M.makeThumb?M.makeThumb():null},okLabel:'Überschreiben',danger:true,ok:function(){ back(); saveMark(k); }}); }}); })(k); }
  var m=E.metaOf(g);
  return {layout:'paper',title:'Speichern',ctx:T('Platz')+' '+n+' · '+chLabel(m.chapter)+' · '+T(m.roomName||''),
    info:(a&&a.kind==='auto'?T('Automatisch gespeichert')+' '+ago(a.at)+' – ':'')+T('bei jedem Ortswechsel neu. Lesezeichen bleiben, bis du sie überschreibst.'),items:[{type:'group',cards:it}],back:true}; };
SCR.settings=function(){ var ts=E.textSpeed(), tap=E.tapText(), it=[];
  it.push({type:'head',label:'Ton'});
  [['mus','Musik'],['sfx','Geräusche'],['amb','Umgebung']].forEach(function(q){ it.push({type:'range',label:q[1],value:Math.round((M.volume?M.volume(q[0]):1)*100),act:function(v){ if (M.volume) M.volume(q[0],v/100); }}); });
  it.push({type:'head',label:'Text'});
  it.push({type:'seg',label:'Tempo',value:ts,options:[[0,'langsam'],[1,'normal'],[2,'schnell']],act:function(v){ E.setText(+v,E.tapText()); }});
  it.push({type:'seg',label:'Weiter erst nach Tippen',sub:'Zeilen bleiben, bis du tippst',value:tap?1:0,options:[[0,'aus'],[1,'an']],act:function(v){ E.setText(E.textSpeed(),+v===1); }});
  it.push({type:'seg',label:'Textgröße',value:PREF.size,options:[[0,'normal'],[1,'groß']],act:function(v){ setPref('size',+v); }});
  it.push({type:'seg',label:'Schrift',value:PREF.font,options:[['pix','Pixel'],['read','Lesbar']],act:function(v){ setPref('font',v); }});
  it.push({type:'preview'});
  it.push({type:'head',label:'Darstellung'});
  it.push({type:'seg',label:'Bewegung reduzieren',sub:'kein Wackeln, Pulsieren, Flackern',value:M.reduceMotion()?1:0,options:[[0,'aus'],[1,'an']],act:function(v){ setPref('motion',+v===1); }});
  if (M.fineOn && touchCap()) it.push({type:'seg',label:'Feinwahl',sub:'Finger kurz ruhig halten: Fadenkreuz über dem Finger, Loslassen wählt',value:M.fineOn()?1:0,options:[[0,'aus'],[1,'an']],act:function(v){ M.fineOn(+v===1); }});   // Touch-Konzept T21, Ergänzung
  it.push({type:'seg',label:'Röhrenbild',value:(M.crtOn&&M.crtOn())?1:0,options:[[0,'aus'],[1,'an']],act:function(v){ if (M.setCRT) M.setCRT(+v===1); }});
  // Touch-Konzept T15: Das iPhone kennt kein Vollbild für Seiten; dort steht stattdessen der Weg über den Home-Bildschirm
  if (fsApi()) it.push({type:'seg',label:'Vollbild',sub:iosDev()?'Wischen nach unten beendet es wieder':'',value:-1,options:[[1,'umschalten']],act:function(){ if (M.fullscreen) M.fullscreen(); }});
  else it.push({type:'hint',label:'Vollbild',sub:standalone()?'Das Spiel läuft schon als App vom Home-Bildschirm.':'Auf dem iPhone: Teilen → „Zum Home-Bildschirm“. Dann startet das Spiel ohne Browserleisten.'});
  // Touch-Konzept T12/T14: was iOS anders macht – als Hinweis, ohne etwas vorauszusetzen
  if (iosDev()){ it.push({type:'head',label:'iPhone und iPad'});
    it.push({type:'hint',label:'Ton',sub:'Ist das iPhone stummgeschaltet (Schalter, Aktionstaste oder Kontrollzentrum), bleibt auch das Spiel stumm.'});
    if (!standalone()) it.push({type:'hint',label:'Spielstände',sub:'Safari kann sie löschen, wenn das Spiel sieben Tage nicht geöffnet wird. Sicher sind sie in der App vom Home-Bildschirm oder als Datei („Sicherung exportieren …“ unter „Spiel laden“).'});
    else it.push({type:'hint',label:'Spielstände',sub:'Die App vom Home-Bildschirm speichert getrennt von Safari. Übertragen: „Sicherung exportieren …“ und „… importieren“ unter „Spiel laden“.'}); }
  it.push({type:'head',label:'Notizbuch'});
  it.push({type:'seg',label:'Ansicht',sub:E.nbStyle()==='think'?'Nachdenken: Marko fragt sich durch':'Liste: alle offenen Notizen auf einer Seite',value:E.nbStyle(),options:[['list','Liste'],['think','Nachdenken']],act:function(v){ E.setNbStyle(v); }});
  it.push({type:'head',label:'Sprache'});
  it.push({type:'seg',label:'Sprache',sub:'Bosanski / Hrvatski: Kapitel 2–4 bisher nur auf Deutsch',value:M.lang,options:[['de','Deutsch'],['bhs','Bos./Hrv.']],act:function(v){ if (M.setLang) M.setLang(v); }});
  return {layout:'settings',title:'Einstellungen',items:it,back:true}; };
SCR.about=function(){ var it=[], done=[]; for (var c=1;c<=5;c++) if (chDone(c)) done.push(c);
  done.forEach(function(c){ it.push({type:'btn',label:'Abspann Kapitel '+c,act:function(){ playCredits(c); }}); });
  return {layout:'about',title:'Über „Die Stillen“',text:['Ein Point-and-Click-Adventure über Menschen, die nicht weiterkommen, und über einen, der mit ihnen reden kann.','„Die Stillen“ heißt die Rubrik in Vesnas Zeitung, für die Marko schreibt: Nachrufe auf Menschen, die allein gestorben sind.','Marko lebt. Mala nicht. Er spricht mit den Lebenden, sie geht durch Wände.','Alle Grafik, Musik und Geräusche entstehen im Spiel selbst. Kopfhörer lohnen sich.'],
    places:PLACES.slice(0,Math.min(5,chaptersReached())).join(' · '),items:it,back:true}; };
SCR.controls=function(){ return {layout:'about',title:'Steuerung',list:[
  'Etwas antippen: Ist nur etwas zu sehen, schaut Marko es an. Kann man etwas damit tun, kommt ein kleines Menü.',
  'Gegenstände aus der Leiste auf ihr Ziel ziehen – auch auf Mala, wenn sie sich etwas ansehen soll.',
  'Unten links wechselst du zwischen Marko und Mala (Tab oder M).',
  '„Notizen“: zwei Notizen nacheinander antippen verbindet sie (N).',
  '„Zeigen“ markiert kurz alles, was man hier anfassen kann (Z).',
  '„Karte“ öffnet den Stadtplan (K). Ein Tipp auf einen Ort, und Marko geht hin.',
  'Ein Tipp auf einen Ausgang, und Marko geht hin; zweimal schnell, und er ist sofort draußen.',
  'Antworten: Ziffern 1–9, Pfeiltasten und Enter; das Mausrad blättert.',
  'Esc schließt immer nur das Oberste; ist nichts offen, öffnet Esc dieses Menü.',
  'Esc gedrückt halten, während eine Szene läuft: Sie läuft schneller ab.',
  'Rechtsklick: Schau an. Leertaste oder Enter: Satz überspringen.'],items:[],back:true}; };
SCR.pause=function(){ var g=M.GS, m=E.metaOf(g), a=stOf(E.slot(),0), busy=!!(E.busy||E.dlg||E.transitioning), why=canMark(), it=[];
  it.push({type:'btn',label:'Weiterspielen',primary:true,act:closePause});
  it.push({type:'btn',label:'Speichern',dis:!!why,why:why?(why==='busy'?'nach der Szene':why==='nosave'?'hier nicht':''):'',act:function(){ push('save'); }});
  it.push({type:'btn',label:'Laden',act:function(){ push('load',{scope:'pause'}); }});
  it.push({type:'btn',label:'Einstellungen',act:function(){ push('settings'); }});
  it.push({type:'btn',label:'Hinweise …',dis:busy||!M.showHints,why:busy?'nach der Szene':'',act:function(){ closePause(); if (M.showHints) M.showHints('menu'); }});
  it.push({type:'btn',label:'Steuerung',act:function(){ push('controls'); }});
  it.push({type:'btn',label:'Zum Titelbild',sub:'speichert automatisch',act:toTitle});
  return {layout:'pause',title:'Pause',ctx:chLabel(m.chapter)+' · '+T(m.roomName||''),status:a&&a.kind==='auto'?(T('Automatisch gespeichert')+' '+ago(a.at)+' ✓'):'',cold:g.active==='mala',items:it}; };
// Lesezeichen benennen (B3-6): Name statt Ort auf der Karte, höchstens 24 Zeichen; leer = wieder der Ort
SCR.rename=function(p){ return {layout:'rename',title:'Lesezeichen benennen',name:p.name,def:p.def,ok:function(){ var el=DOM&&stage?stage.querySelector('#shname'):null, v=el?String(el.value||'').trim().slice(0,24):String(p.value||'').trim().slice(0,24);
    try{ var d=JSON.parse(lsGet(p.key)||'null'); if (d){ if (v) d.name=v; else delete d.name; lsSet(p.key,JSON.stringify(d)); } }catch(e){} back(); toast(v?'Benannt.':'Name entfernt.'); },items:[],back:true}; };
SCR.confirm=function(p){ return {layout:'confirm',title:p.title,text:p.text,before:p.before,after:p.after,items:[
  {type:'btn',label:p.okLabel||'OK',danger:!!p.danger,act:p.ok},{type:'btn',label:'Abbrechen',focus:true,act:back}],back:true}; };
SCR.next=function(p){ var ch=p.ch, nx=ch<5?ch+1:0, rec=null; try{ rec=JSON.parse(lsGet('mala.c'+ch+'end')||'null'); }catch(e){}
  var ms=(rec&&rec.playMs)||0, it=[];
  if (nx && chExists(nx)) it.push({type:'btn',label:'Weiter mit Kapitel '+nx+': '+PLACES[nx-1],primary:true,act:function(){ startNew(nx,p.slot||E.slot()); }});
  it.push({type:'btn',label:'Zum Titelbild',act:function(){ E.titleMode='main'; SH.stack=[{id:'main',p:{}}]; render(true); }});
  return {layout:'endcard',kicker:'Ende des '+ORD[ch-1]+' Kapitels',title:PLACES[ch-1],sub:nx?'Fortsetzung: '+PLACES[nx-1]:(ch===4?'Fortsetzung: Sarajevo':''),time:ms?T('Spielzeit')+' '+fmtDur(ms):'',items:it}; };
function playCredits(c){ var L=c===1?M.CREDITS:(c===2?M.CREDITS2:(c===3?M.CREDITS3:(c===4?M.CREDITS4:M.CREDITS5))); if (!L) return; closeAll(); E.creditLines=L; E.creditMusic=['end','k2_end','k3_end','k4_end',M.K5_END_MUSIC||'k2_end'][c-1]; E.afterCredits=null; E.startCredits(); }

// ---------------------------------------------------------------- Sicherung als Datei (UI-Konzept B3-3)
// Alle MALA-Einträge dieses Browsers (Spielstände, Lesezeichen, Kapitelmarken, Einstellungen) mit Format, Datum und Prüfsumme.
// Ausdrücklich kein Cloud-Versprechen: Die Datei legt der Spieler selbst ab und spielt sie selbst wieder ein.
function fnv(s){ var h=0x811c9dc5; for (var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } return ('0000000'+h.toString(16)).slice(-8); }
function backupData(){ var out={}, L=LS(); if (!L) return out; var ks=[]; for (var i=0;i<L.length;i++){ var k=L.key(i); if (k && /^mala\./.test(k) && k!=='mala.undo') ks.push(k); } ks.sort().forEach(function(k){ out[k]=L.getItem(k); }); return out; }
SH.backupText=function(){ var data=backupData(), body=JSON.stringify(data); return JSON.stringify({app:'MALA',format:1,created:new Date().toISOString(),count:Object.keys(data).length,sum:fnv(body),data:data}); };
SH.importText=function(txt){ var o; try{ o=JSON.parse(txt); }catch(e){ o=null; }
  if (!o||o.app!=='MALA'||o.format!==1||!o.data||typeof o.data!=='object'){ toast('Diese Datei ist keine Sicherung von „Die Stillen“.',4500); return false; }
  if (fnv(JSON.stringify(o.data))!==o.sum){ toast('Die Sicherung ist beschädigt (Prüfsumme stimmt nicht).',4500); return false; }
  var keys=Object.keys(o.data).filter(function(k){ return /^mala\./.test(k); });
  push('confirm',{title:'Sicherung einspielen?',text:'Alle Spielstände und Einstellungen in diesem Browser werden durch die Sicherung ersetzt: '+entries(keys.length)+', gespeichert '+fmtAt(Date.parse(o.created)||0)+'.',okLabel:'Einspielen',danger:true,ok:function(){
    var L=LS(), old=[]; if (L) for (var i=0;i<L.length;i++){ var k=L.key(i); if (k&&/^mala\./.test(k)) old.push(k); } old.forEach(lsDel); keys.forEach(function(k){ lsSet(k,String(o.data[k])); });
    back(); toast('Sicherung eingespielt. Einstellungen gelten ab dem nächsten Start.',5000); render(true); }}); return true; };
if (DOM){ M.saveExport=function(){ try{ var txt=SH.backupText(), n=JSON.parse(txt).count, now=new Date(), a=document.createElement('a'), blob=new Blob([txt],{type:'application/json'});
    a.href=URL.createObjectURL(blob); a.download='Die-Stillen-Sicherung-'+now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())+'.json'; document.body.appendChild(a); a.click();
    setTimeout(function(){ try{ URL.revokeObjectURL(a.href); a.remove(); }catch(e){} },2000); toast('Sicherung als Datei gespeichert ('+entries(n)+').'); }catch(e){ toast('Sicherung fehlgeschlagen.',4000); } };
  M.saveImport=function(){ var inp=document.createElement('input'); inp.type='file'; inp.accept='application/json,.json'; inp.style.display='none'; document.body.appendChild(inp);
    inp.addEventListener('change',function(){ var f=inp.files&&inp.files[0]; inp.remove(); if (!f) return; var rd=new FileReader(); rd.onload=function(){ SH.importText(String(rd.result||'')); }; rd.readAsText(f); }); inp.click(); }; }
// ---------------------------------------------------------------- Schnittstelle für Tests und die Engine
function cur(){ var t=top(); if (!t) return null; var f=SCR[t.id]; return f?Object.assign({id:t.id},f(t.p)):null; }
function flat(v){ var out=[]; (v.items||[]).forEach(function(x){ if (x.type==='group') (x.cards||[]).forEach(function(c){ out.push(c); }); else out.push(x); }); return out; }
function labelOf(x){ return T(x.label||'')+(x.sub?' '+T(x.sub):''); }
SH.current=function(){ var t=top(); return t?t.id:null; };
SH.items=function(){ var v=cur(); return v?flat(v).filter(function(x){ return x.act||x.type==='seg'||x.type==='range'; }).map(function(x){ return {label:T(x.label||''),sub:x.sub?T(x.sub):'',dis:!!x.dis,type:x.type}; }):[]; };
SH.labels=function(){ return SH.items().map(function(x){ return x.label; }); };
// pick('Neues Spiel'), pick('Schrift=Lesbar'), pick('Musik=40'): sucht nach Beschriftung (Teilstring), wie ein Tipp auf den Eintrag
SH.pick=function(q){ var v=cur(); if (!v) return {err:'keine Oberfläche offen'}; var m=String(q).match(/^(.+?)=(.*)$/), xs=flat(v);
  if (m){ var x=xs.filter(function(x){ return (x.type==='seg'||x.type==='range') && T(x.label)===T(m[1]); })[0]; if (!x) return {miss:SH.labels()};
    var val=m[2]; if (x.type==='seg'){ var o=x.options.filter(function(o){ return String(o[0])===val||T(o[1])===val||o[1]===val; })[0]; if (!o) return {miss:x.options.map(function(o){ return o[1]; })}; x.act(o[0]); } else x.act(+val); render(true); return {label:x.label+'='+val}; }
  var hit=xs.filter(function(x){ return x.act && labelOf(x).indexOf(T(q))>=0; })[0]||xs.filter(function(x){ return x.act && labelOf(x).indexOf(q)>=0; })[0];
  if (!hit) return {miss:SH.labels()}; if (hit.dis) return {dis:hit.label}; hit.act(); render(true); return {label:hit.label}; };
SH.back=back; SH.close=function(){ if (SH.ctx==='pause') closePause(); };
// Wege der bisherigen Titelzeilen für die QA-Werkzeuge: 'Kapitel 2: Sarajevo' + 'Platz 1', 'Fortsetzen' + 'Platz 1', 'Weiter mit Kapitel 3'
SH.legacyPick=function(lab){ var m; M.shellSync();
  if ((m=String(lab).match(/^Kapitel (\d)/))){ var c=+m[1]; if (!chOpen(c)) return {dis:lab,miss:SH.labels()}; SH.pendCh=c; SH.pendCont=false; return {label:lab}; }
  if (lab==='Fortsetzen'){ SH.pendCont=true; SH.pendCh=0; return {label:lab}; }
  if ((m=String(lab).match(/^Platz (\d)/))){ var n=+m[1];
    if (SH.pendCh){ var c2=SH.pendCh; SH.pendCh=0; startNew(c2,n); return {label:lab}; }
    if (SH.pendCont){ SH.pendCont=false; var s=stOf(n,0); if (!s) return {miss:['Platz '+n+' leer']}; return loadState(s)?{label:lab}:{err:'Laden fehlgeschlagen'}; }
    return {miss:SH.labels()}; }
  var r=SH.pick(lab); return r; };
SH.testSaveMark=function(k){ var ok=saveMark(k||1); return {ok:ok,msg:ok?'Gespeichert.':(REASON[E.saveReason||canMark()]||'')}; };
SH.testLoadMark=function(k){ var s=stOf(E.slot(),k||1); var ok=s?loadState(s):false; return {ok:ok,msg:ok?'Geladen.':'Kein Spielstand.'}; };
SH.openPause=function(){ if (E.screen!=='game') return; if (!E.menu){ E.menu=true; E.paused(true); } openCtx('pause','pause'); if (M.duckMusic) M.duckMusic(true); histPush(); };
M.titleLabels=function(){ M.shellSync(); return SH.labels(); };
// jede Bildaktualisierung (M.update): Schicht an den Spielzustand anpassen
M.shellSync=function(){
  if (E.screen==='title'){ var wantNext=E.titleMode==='next';
    if (SH.ctx!=='title'){ openCtx('title',wantNext?'next':'main',wantNext?{ch:(E.nextCh||2)-1}:{}); SH.nextFor=wantNext?E.nextCh:null; }
    else if (wantNext && SH.nextFor!==E.nextCh){ SH.stack=[{id:'main',p:{}},{id:'next',p:{ch:(E.nextCh||2)-1}}]; SH.nextFor=E.nextCh; render(true); }
    return; }
  if (SH.ctx==='title'){ closeAll(); SH.nextFor=null; }
  if (E.menu && SH.ctx!=='pause' && E.screen==='game'){ SH.openPause(); return; }
  if (!E.menu && SH.ctx==='pause'){ closePause(); }
  if (SH.ctx==='pause' && E.screen!=='game'){ closePause(); }
  if (SH.ctx==='title' && SH.current()==='main' && DOM && root && root.querySelector('.chip') && M.audioRunning && M.audioRunning()) render(false); };

// ---------------------------------------------------------------- Ansicht (nur im Browser)
var root=null, stage=null, topEl=null, toastEl=null, recapEl=null, lastHTML='', focusKey=null, prevFocus=null, previewT=null;
function applyPrefs(){ if (!root) return; root.classList.toggle('rd',PREF.font==='read'); root.classList.toggle('sz1',PREF.size===1); }
function geom(){ if (!root) return; var cv=document.getElementById('game'); if (!cv) return; var rot=!!(M.isRotated&&M.isRotated()), vw=window.innerWidth, vh=window.innerHeight;
  var cw=parseFloat(cv.style.width)||cv.clientWidth||vw, ch=parseFloat(cv.style.height)||cv.clientHeight||vh, s=cw/320, u=Math.max(2,Math.min(4,Math.ceil(s*0.75)));
  var W=rot?vh:vw, H=rot?vw:vh, cx=(W-cw)/2, cy=(H-ch)/2; if (!rot){ var r=cv.getBoundingClientRect(); cx=r.left; cy=r.top; }
  [stage,topEl].forEach(function(el){ if (!el) return; el.style.width=W+'px'; el.style.height=H+'px'; el.style.transform=rot?'translate(-50%,-50%) rotate(90deg)':''; el.style.left=rot?'50%':'0'; el.style.top=rot?'50%':'0'; });   // Meldungen drehen im gedrehten Hochformat mit
  // Touch-Konzept T18: Solange das Namensfeld den Fokus hat und die Bildschirmtastatur Platz nimmt, steht das Fenster mittig in der sichtbaren Fläche
  var vv=window.visualViewport, ae=document.activeElement; if (!rot && stage && vv && ae && ae.id==='shname' && vv.height<H-60){ stage.style.top=vv.offsetTop+'px'; stage.style.height=vv.height+'px'; }
  root.style.setProperty('--u',u); root.style.setProperty('--s',s); root.style.setProperty('--cx',cx+'px'); root.style.setProperty('--cy',cy+'px'); root.style.setProperty('--cw',cw+'px'); root.style.setProperty('--ch',ch+'px');
  root.classList.toggle('narrow',ch<420||W<700); root.classList.toggle('short',H<560); SH.geo={u:u,s:s,W:W,H:H,cx:cx,cy:cy,cw:cw,ch:ch,rot:rot}; }
M.onFit=function(){ geom(); };
var LOCK='<svg class="lock" viewBox="0 0 7 8" aria-hidden="true"><path fill="currentColor" d="M1 3V2a2 2 0 0 1 4 0v1h1v5H0V3h1zm1 0h2V2a1 1 0 0 0-2 0v1z"/></svg>';
function btnHTML(x,i,cls){ var dis=x.dis?' aria-disabled="true"':'';
  return '<button type="button" class="mi '+(cls||'')+(x.primary?' primary':'')+(x.danger?' danger':'')+'" data-i="'+i+'"'+dis+((x.focus||(x.primary&&!x.dis))?' data-focus="1"':'')+'>'+(x.lock?LOCK:'')+'<span class="t">'+esc(T(x.label))+(x.sub?'<span class="sub">'+esc(T(x.sub))+'</span>':'')+'</span>'+(x.why?'<span class="why">'+esc(T(x.why))+'</span>':'')+'</button>'; }
function cardHTML(c,i,paperish){ var s=c.state, kind=c.empty?'empty':(s?s.kind:(c.preset?'preset':'')), bad=kind==='damaged'||kind==='incompatible';
  var ph=c.thumb?'<span class="ph" style="background-image:url('+esc(c.thumb)+')"></span>':'<span class="ph empty">'+(bad?'<span class="seal">!</span>':esc(c.empty?T('leer'):(c.ph||'')))+'</span>';
  var inner='<span class="kindb '+(kind==='auto'?'auto':kind==='mark'?'mark':kind==='chapterEnd'?'end':'')+'">'+esc(c.badge||'')+'</span>'+ph+'<b>'+esc(c.label||'')+'</b>'+(c.sub?'<span class="meta">'+esc(c.sub)+'</span>':'')+(c.meta?'<span class="meta">'+esc(c.meta)+'</span>':'');
  var main=c.act?'<button type="button" class="cardmain" data-i="'+i+'">'+inner+'</button>':'<div class="cardmain" aria-disabled="true">'+inner+'</div>';
  return '<div class="card'+(bad?' bad':'')+(c.dis?' dis':'')+'">'+main+(c.del?'<button type="button" class="btn danger small" data-del="'+i+'">'+esc(T('Löschen …'))+'</button>':'')+(c.ren?'<button type="button" class="btn small" data-ren="'+i+'">'+esc(T('Benennen …'))+'</button>':'')+'</div>'; }
function view(v){ var xs=flat(v), idx=function(x){ return xs.indexOf(x); }, h='', u;
  var backBtn=v.back?'<div class="btnrow"><button type="button" class="btn" data-back="1">'+esc(T('Zurück'))+'</button></div>':'';
  if (v.layout==='title'){ h+='<div class="band"></div><nav class="menu tmenu" aria-label="'+esc(T('Hauptmenü'))+'">';
    v.items.forEach(function(x){ if (x.type==='card') h+='<button type="button" class="mi cont primary" data-i="'+idx(x)+'" data-focus="1">'+(x.thumb?'<span class="thumb" style="background-image:url('+esc(x.thumb)+')"></span>':'')+'<span class="t"><span>'+esc(T(x.label))+'</span><span class="sub">'+esc(x.sub)+'</span><span class="sub">'+esc(x.meta)+'</span></span></button>'; else h+=btnHTML(x,idx(x)); });
    h+='</nav>'; if (v.note) h+='<div class="pnote" role="note"><span>'+esc(T(v.note.t))+'</span><button type="button" class="btn" data-pnote="'+esc(v.note.key)+'">'+esc(T('Verstanden'))+'</button></div>';
    if (v.sound) h+='<div class="chip">'+esc(T('Ton startet mit dem ersten Tipp'))+'</div>'; return h; }
  if (v.layout==='endcard') return '<div class="endcard" role="dialog" aria-label="'+esc(T(v.kicker))+'"><div class="kick">'+esc(T(v.kicker))+'</div><h2>'+esc(T(v.title))+'</h2>'+(v.sub?'<div class="sub">'+esc(T(v.sub))+'</div>':'')+(v.time?'<div class="time">'+esc(v.time)+'</div>':'')+'<nav class="menu">'+v.items.map(function(x){ return btnHTML(x,idx(x)); }).join('')+'</nav></div>';
  if (v.layout==='paper'){ h+='<div class="paper" role="dialog" aria-label="'+esc(T(v.title))+'"><div class="phead"><h3>'+esc(T(v.title))+'</h3><button type="button" class="btn" data-back="1">'+esc(T('Zurück'))+'</button></div><div class="pmid scroll">';
    if (v.ctx) h+='<div class="ctx">'+esc(v.ctx)+'</div>'; if (v.info) h+='<div class="ctx">'+esc(v.info)+'</div>';
    v.items.forEach(function(x){ if (x.type==='group'){ h+=(x.label?'<h4>'+esc(x.label)+'</h4>':'')+(x.note?'<div class="ctx">'+esc(x.note)+'</div>':'')+'<div class="cards" style="--n:'+Math.max(3,Math.min(4,x.cards.length))+'">'+x.cards.map(function(c){ return cardHTML(c,idx(c)); }).join('')+'</div>'; }
      else if (x.type==='note') h+='<div class="ctx foot">'+esc(T(x.label))+'</div>'; else h+=btnHTML(x,idx(x),'plain'); });
    return h+'</div></div>'; }
  if (v.layout==='settings'){ h+='<div class="panel wide" role="dialog" aria-label="'+esc(T(v.title))+'"><h3>'+esc(T(v.title))+'</h3><div class="set scroll">';
    v.items.forEach(function(x){ var i=idx(x); if (x.type==='head') h+='<h4>'+esc(T(x.label))+'</h4>';
      else if (x.type==='range') h+='<label class="lbl" for="r'+i+'">'+esc(T(x.label))+' <small id="v'+i+'">'+x.value+' %</small></label><input type="range" id="r'+i+'" min="0" max="100" step="5" value="'+x.value+'" data-r="'+i+'">';
      else if (x.type==='seg') h+='<span class="lbl">'+esc(T(x.label))+(x.sub?'<small>'+esc(T(x.sub))+'</small>':'')+'</span><span class="segp" role="group" aria-label="'+esc(T(x.label))+'">'+x.options.map(function(o){ return '<button type="button" data-s="'+i+'" data-v="'+esc(o[0])+'" aria-pressed="'+(String(o[0])===String(x.value))+'">'+esc(T(o[1]))+'</button>'; }).join('')+'</span>';
      else if (x.type==='preview') h+='<div class="preview" id="shprev"><span class="who">Marko: </span><span class="pt"></span></div>';
      else if (x.type==='hint') h+='<span class="lbl" style="grid-column:1/-1">'+(x.label?esc(T(x.label)):'')+'<small>'+esc(T(x.sub||''))+'</small></span>'; });
    return h+'</div>'+backBtn+'</div>'; }
  if (v.layout==='about'){ h+='<div class="paper about" role="dialog" aria-label="'+esc(T(v.title))+'"><div class="phead"><h3>'+esc(T(v.title))+'</h3><button type="button" class="btn" data-back="1">'+esc(T('Zurück'))+'</button></div><div class="pmid scroll">';
    if (v.places) h+='<div class="ctx">Die Stillen – '+esc(v.places)+'</div>'; (v.text||[]).forEach(function(t){ h+='<p>'+esc(T(t))+'</p>'; });
    if (v.list) h+='<ul>'+v.list.map(function(t){ return '<li>'+esc(T(t))+'</li>'; }).join('')+'</ul>';
    if (v.items.length) h+='<nav class="menu">'+v.items.map(function(x){ return btnHTML(x,idx(x),'plain'); }).join('')+'</nav>';
    return h+'</div></div>'; }
  if (v.layout==='rename') return '<div class="paper confirm" role="dialog" aria-label="'+esc(T(v.title))+'"><h3>'+esc(T(v.title))+'</h3><label class="ctx" for="shname">'+esc(T('Name (leer lassen für den Ort):'))+'</label><input id="shname" type="text" maxlength="24" value="'+esc(v.name)+'" placeholder="'+esc(v.def)+'" autocomplete="off" spellcheck="false"><div class="btnrow"><button type="button" class="btn" data-ok="1">'+esc(T('Speichern'))+'</button><button type="button" class="btn" data-back="1">'+esc(T('Abbrechen'))+'</button></div></div>';
  if (v.layout==='confirm'){ var cmp=function(s,lab){ if (!s) return ''; if (s.kind) return '<div class="card"><div class="cardmain">'+(s.thumb?'<span class="ph" style="background-image:url('+esc(s.thumb)+')"></span>':'<span class="ph empty"></span>')+'<b>'+esc(lab)+': '+esc(placeOf(s))+'</b><span class="meta">'+esc(fmtAt(s.at))+'</span></div></div>';
      return '<div class="card"><div class="cardmain">'+(s.thumb?'<span class="ph" style="background-image:url('+esc(s.thumb)+')"></span>':'<span class="ph empty"></span>')+'<b>'+esc(s.label)+'</b><span class="meta">'+esc(s.sub||'')+'</span></div></div>'; };
    h+='<div class="paper confirm" role="alertdialog" aria-label="'+esc(T(v.title))+'"><h3>'+esc(T(v.title))+'</h3><div class="ctx">'+esc(T(v.text||''))+'</div>';
    if (v.before) h+='<div class="cards cmp">'+cmp(v.before,T('Bisher'))+(v.after?'<span class="arrow">→</span>'+cmp(v.after):'')+'</div>';
    return h+'<div class="btnrow">'+v.items.map(function(x){ return '<button type="button" class="btn'+(x.danger?' danger':'')+'" data-i="'+idx(x)+'"'+(x.focus?' data-focus="1"':'')+'>'+esc(T(x.label))+'</button>'; }).join('')+'</div></div>'; }
  // panel / pause
  var two=v.layout==='pause';
  h+='<div class="panel'+(v.cold?' cold':'')+(two?' pause':'')+'" role="dialog" aria-label="'+esc(T(v.title))+'"><h3>'+esc(T(v.title))+'</h3>'+(v.ctx?'<div class="ctx">'+esc(T(v.ctx))+'</div>':'')+(v.status?'<div class="status">'+esc(v.status)+'</div>':'');
  h+='<nav class="menu'+(two?' two':'')+' scroll">'+v.items.map(function(x){ return x.type==='note'?'<div class="ctx foot">'+esc(T(x.label))+'</div>':btnHTML(x,idx(x)); }).join('')+'</nav>'+(two?'':backBtn)+'</div>';
  return h; }
function render(newScreen,focusSel){ if (!DOM){ return; } if (!root) build(); var v=cur(); vItems=v?flat(v):[];   // Klicks gehören zu genau dieser Darstellung
  if (!v){ root.classList.remove('on'); root.setAttribute('aria-hidden','true'); stage.innerHTML=''; lastHTML=''; if (prevFocus&&prevFocus.focus) try{ prevFocus.focus({preventScroll:true}); }catch(e){} prevFocus=null; return; }
  if (!root.classList.contains('on')){ prevFocus=document.activeElement; }
  root.classList.add('on'); root.removeAttribute('aria-hidden'); root.classList.toggle('dimmed',v.layout!=='title'); root.classList.toggle('titlemode',SH.ctx==='title'); root.dataset.screen=v.id;
  geom(); var html=view(v); var fk=document.activeElement&&stage.contains(document.activeElement)?keyOf(document.activeElement):null; var sc=stage.querySelector('.scroll'), st=sc?sc.scrollTop:0;
  if (html!==lastHTML){ stage.innerHTML=html; lastHTML=html; var sc2=stage.querySelector('.scroll'); if (sc2&&!newScreen) sc2.scrollTop=st; }
  var fb0=focusSel?stage.querySelector(focusSel):null; if (fb0){ try{ fb0.focus({preventScroll:true}); }catch(e){} }
  else if (newScreen||!fk){ var f=stage.querySelector('[data-focus]')||stage.querySelector('button:not([aria-disabled="true"]),input'); if (f) try{ f.focus({preventScroll:true}); }catch(e){} }
  else { var g=stage.querySelector(fk); if (g) try{ g.focus({preventScroll:true}); }catch(e){} }
  if (v.layout==='settings') preview(); }
function keyOf(el){ var a=['data-i','data-s','data-r','data-back','data-del','data-ren','data-ok']; for (var i=0;i<a.length;i++) if (el.hasAttribute(a[i])) return '['+a[i]+'="'+el.getAttribute(a[i])+'"]'+(el.hasAttribute('data-v')?'[data-v="'+el.getAttribute('data-v')+'"]':''); return null; }
function preview(){ var el=stage.querySelector('#shprev .pt'); if (!el) return; clearInterval(previewT); var full=T('Der Anrufbeantworter blinkt. Zwei neue Nachrichten.'), i=0, sp=E.textSpeed(), dur=Math.max(1400,800+full.length*52)*[1.5,1,0.7][sp]; var step=Math.max(16,dur/2/full.length);
  previewT=setInterval(function(){ i++; el.textContent=full.slice(0,i); if (i>=full.length){ clearInterval(previewT); if (E.tapText()) el.textContent=full+' ▸'; } },step); }
function renderToast(){ if (!DOM) return; if (!root) build(); var t=SH.toastNow(); if (t && !SH.ctx) geom(); if (!t){ toastEl.className='sh-toast'; toastEl.innerHTML=''; return; }
  toastEl.innerHTML='<span>'+esc(t.t)+'</span>'+(t.act?'<button type="button" class="btn small" data-toast="1">'+esc(T(t.act.label))+'</button>':''); toastEl.className='sh-toast on'+(t.act?' act':'');
  clearTimeout(renderToast.tm); renderToast.tm=setTimeout(renderToast,Math.max(50,t.until-Date.now()+30)); }
// Einträge der zuletzt gezeichneten Darstellung: data-i zeigt immer auf das, was zu sehen war – auch wenn sich Spielstände inzwischen geändert haben
var vItems=[]; function vEl(){ return vItems; }
function onClick(e){ var b=e.target.closest('button');
  if (!b){ var cs=SH.current(); if ((cs==='confirm'||cs==='rename') && stage.contains(e.target) && !e.target.closest('.paper,.panel,.endcard')){ if (M.sfx) M.sfx('click'); back(); } return; }   // D8: Tipp neben das Fenster = Abbrechen
  if (!root.contains(b)) return; if (M.audioInit) M.audioInit();
  if (b.dataset.toast){ var t=SH.toastNow(); SH.toast=null; renderToast(); if (t&&t.act) t.act.fn(); return; }
  if (b.dataset.pnote){ lsSet(b.dataset.pnote,'1'); if (M.sfx) M.sfx('click'); render(true); return; }
  if (b.getAttribute('aria-disabled')==='true'){ var xs0=vEl(), x0=xs0[+b.dataset.i]; if (x0&&x0.why) toast(T(x0.label)+': '+T(x0.why)); if (M.sfx) M.sfx('nope'); return; }
  if (b.dataset.back){ if (M.sfx) M.sfx('click'); back(); return; }
  var xs=vEl();
  if (b.dataset.del!==undefined){ var d=xs[+b.dataset.del]; if (d&&d.del) d.del(); return; }
  if (b.dataset.ren!==undefined){ var rn=xs[+b.dataset.ren]; if (rn&&rn.ren) rn.ren(); return; }
  if (b.dataset.ok!==undefined){ var vv=cur(); if (vv&&vv.ok) vv.ok(); return; }
  if (b.dataset.s!==undefined){ var s=xs[+b.dataset.s]; if (s){ var val=b.dataset.v, o=s.options.filter(function(o){ return String(o[0])===val; })[0]; s.act(o?o[0]:val); if (M.sfx) M.sfx('click'); render(false); } return; }
  if (b.dataset.i!==undefined){ var x=xs[+b.dataset.i]; if (x&&x.act){ if (M.sfx) M.sfx(SH.current()==='load'||SH.current()==='save'?'page':'click'); x.act(); if (cur()) render(false); } } }
function onInput(e){ var r=e.target; if (!r.dataset||r.dataset.r===undefined) return; var x=vEl()[+r.dataset.r]; if (!x) return; x.act(+r.value); var lab=stage.querySelector('#v'+r.dataset.r); if (lab) lab.textContent=r.value+' %'; }
function onChange(e){ var r=e.target; if (r.dataset&&r.dataset.r!==undefined && M.sfx) M.sfx('click'); }
// Tastatur: ↑/↓ wandern durch die Einträge, ←/→ in Schaltergruppen, Enter tippt an, Esc geht eine Ebene zurück
SH.key=function(e){ if (!SH.ctx) return false; var k=e.key;
  if (k==='Escape'){ if (SH.toastNow()&&SH.toast.act){ SH.toast=null; renderToast(); } if (!back() && SH.ctx==='title' && SH.stack.length===1){ /* Titel: bleibt */ } e.preventDefault&&e.preventDefault(); return true; }
  if (!DOM) return true; var list=Array.prototype.slice.call(stage.querySelectorAll('button:not([aria-disabled="true"]),input[type=range]')); if (!list.length) return true;
  var i=list.indexOf(document.activeElement);
  if (k==='ArrowDown'||k==='ArrowUp'){ if (document.activeElement&&document.activeElement.type==='range'&&false) return true; var n=i<0?0:(i+(k==='ArrowDown'?1:-1)+list.length)%list.length; list[n].focus(); e.preventDefault&&e.preventDefault(); return true; }
  if ((k==='ArrowLeft'||k==='ArrowRight') && document.activeElement && document.activeElement.dataset && document.activeElement.dataset.s!==undefined){ var grp=Array.prototype.slice.call(document.activeElement.parentNode.querySelectorAll('button')), j=grp.indexOf(document.activeElement), nj=Math.max(0,Math.min(grp.length-1,j+(k==='ArrowRight'?1:-1))); grp[nj].focus(); e.preventDefault&&e.preventDefault(); return true; }
  if (k==='Tab') return false;
  return true; };
function build(){ root=document.createElement('div'); root.id='shell'; root.setAttribute('aria-hidden','true'); root.innerHTML='<div class="sh-dim"></div><div class="sh-stage"></div><div class="sh-top"><div class="sh-toast" role="status" aria-live="polite"></div><div class="sh-recap" role="status"></div></div>';
  document.body.appendChild(root); stage=root.querySelector('.sh-stage'); topEl=root.querySelector('.sh-top'); toastEl=root.querySelector('.sh-toast'); recapEl=root.querySelector('.sh-recap');
  // „Zuletzt“-Karte: blockiert nichts; der erste Tipp oder Tastendruck schließt sie (und geht trotzdem ans Spiel)
  var dropRecap=function(){ if (SH.recapData){ SH.recapData=null; renderRecap(); } }; window.addEventListener('pointerdown',dropRecap,true); window.addEventListener('keydown',dropRecap,true);
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  root.addEventListener('click',onClick); root.addEventListener('input',onInput); root.addEventListener('change',onChange);
  // Namensfeld: Enter speichert (die übrigen Tasten bleiben im Feld, Esc bricht über SH.key ab)
  root.addEventListener('keydown',function(e){ if (e.target && e.target.id==='shname' && e.key==='Enter'){ e.preventDefault(); var v=cur(); if (v&&v.ok) v.ok(); } });
  root.addEventListener('focusin',function(e){ if (e.target && e.target.id==='shname') setTimeout(geom,0); }); root.addEventListener('focusout',function(e){ if (e.target && e.target.id==='shname') setTimeout(geom,0); });
  if (window.visualViewport){ var kbT=null, kbF=function(){ var ae=document.activeElement; if (ae && ae.id==='shname'){ clearTimeout(kbT); kbT=setTimeout(geom,60); } }; window.visualViewport.addEventListener('resize',kbF); window.visualViewport.addEventListener('scroll',kbF); }
  root.addEventListener('pointerdown',function(e){ e.stopPropagation(); }); root.addEventListener('contextmenu',function(e){ e.preventDefault(); });
  toastEl.addEventListener('click',onClick);
  window.addEventListener('resize',function(){ if (SH.ctx||SH.toastNow()||SH.recapNow()) geom(); });
  applyPrefs(); }

// ---------------------------------------------------------------- Vorschaubild für Spielstände: aktuelle Szene ohne Leiste, 160×72 (nur was der Spieler sieht)
if (DOM) M.makeThumb=function(){ if (!M.sceneSnap) return null; var snap=M.sceneSnap(); if (!snap) return null; var c=document.createElement('canvas'); c.width=160; c.height=72; var g=c.getContext('2d'), im=g.createImageData(160,72), d=im.data;
  for (var y=0;y<72;y++) for (var x=0;x<160;x++){ var q=M.RGB[snap[(y*2)*320+x*2]]||[0,0,0], o=(y*160+x)*4; d[o]=q[0]; d[o+1]=q[1]; d[o+2]=q[2]; d[o+3]=255; }
  g.putImageData(im,0,0); try{ return c.toDataURL('image/png'); }catch(e){ return null; } };

// ---------------------------------------------------------------- Aussehen (Tokens aus UI_KONZEPT.md, Abschnitt C)
var CSS='#shell{position:fixed;inset:0;z-index:12;display:none;--ink0:#08070d;--ink1:#13111c;--ink2:#1e1b2a;--lamp1:#6a400e;--lamp3:#d99a33;--lamp4:#f3c75c;--lamp5:#fff0a6;--ghost1:#1a3a4c;--ghost2:#2c6074;--ghost4:#82c1c9;--ghost5:#c3ecee;--paper:#e3d9c0;--paper2:#f5efe0;--pink:#13111c;--pmuted:#5a5248;--margin:#cc5f68;--seal:#cc5f68;--seal2:#79212e;--text:#e3d9c0;--muted:#a39882;--dis:#7d7364;--pix:"MALA Pixel",ui-monospace,monospace;--read:"Atkinson Hyperlegible Next","MALA Pixel",system-ui,-apple-system,"Segoe UI",sans-serif;--fs:calc(var(--u)*10px);--lh:calc(var(--u)*12px);color:var(--text);font-family:var(--pix);font-size:var(--fs);line-height:var(--lh);-webkit-font-smoothing:none;-webkit-user-select:none;user-select:none}'
+'#shell.on{display:block}#shell.sz1{--fs:calc((var(--u) + 1)*10px);--lh:calc((var(--u) + 1)*12px)}#shell.rd{font-family:var(--read);-webkit-font-smoothing:auto}#shell.rd h2,#shell.rd h3{font-family:var(--pix);-webkit-font-smoothing:none}'
+'#shell *{box-sizing:border-box}#shell .sh-dim{position:absolute;inset:0;background:rgba(8,7,13,.74);display:none}#shell.dimmed .sh-dim{display:block}#shell[data-screen="next"] .sh-dim{background:rgba(8,7,13,.96)}#shell .sh-stage{position:absolute}'
+'#shell button{font:inherit;color:inherit;letter-spacing:0}#shell h2,#shell h3,#shell h4{margin:0;font-weight:400}#shell h3{font-size:calc(var(--fs)*2);line-height:calc(var(--lh)*1.8)}'
+'#shell .scroll{overflow:auto;scrollbar-color:var(--lamp1) transparent;overscroll-behavior:contain}'
+'#shell .panel,#shell .paper,#shell .endcard{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-height:calc(100% - 16px);max-width:calc(100% - 16px);display:flex;flex-direction:column;gap:calc(var(--u)*4px)}'
+'#shell .panel{width:min(calc(var(--u)*190px),calc(100% - 16px));background:rgba(19,17,28,.97);border:calc(var(--u)*1px) solid var(--lamp1);box-shadow:0 0 0 calc(var(--u)*1px) var(--ink0),calc(var(--u)*2px) calc(var(--u)*2px) 0 calc(var(--u)*1px) rgba(0,0,0,.55);padding:calc(var(--u)*6px)}'
+'#shell .panel.wide{width:min(calc(var(--u)*250px),calc(100% - 16px))}#shell .panel.cold{border-color:var(--ghost2)}#shell .panel h3{color:var(--lamp5)}#shell .ctx{color:var(--muted)}#shell .status{color:var(--ghost4)}'
+'#shell .menu{display:flex;flex-direction:column;gap:calc(var(--u)*1px);min-height:0}#shell .menu.two{display:grid;grid-template-columns:1fr;column-gap:calc(var(--u)*4px)}#shell.short .menu.two{grid-template-columns:1fr 1fr}#shell.short .panel.pause{width:min(calc(var(--u)*280px),calc(100% - 16px))}'
+'#shell .mi{appearance:none;border:0;background:transparent;text-align:left;display:flex;align-items:center;gap:calc(var(--u)*3px);min-height:max(44px,calc(var(--u)*16px));padding:calc(var(--u)*1px) calc(var(--u)*5px) calc(var(--u)*1px) calc(var(--u)*3px);cursor:pointer;width:100%;color:var(--text)}'
+'#shell .mi::before{content:"";flex:0 0 calc(var(--u)*5px);color:var(--lamp4)}#shell .mi:hover,#shell .mi:focus-visible,#shell .mi.sel{color:var(--lamp5);background:var(--ink2)}#shell .mi:hover::before,#shell .mi:focus-visible::before,#shell .mi.sel::before{content:"▸"}'
+'#shell .mi:focus-visible,#shell .btn:focus-visible,#shell .card button:focus-visible,#shell input:focus-visible{outline:calc(var(--u)*1px) solid var(--lamp4);outline-offset:calc(var(--u)*-1px)}'
+'#shell .mi.primary{color:var(--lamp4)}#shell .paper .mi.primary{color:var(--seal2)}#shell .mi[aria-disabled="true"]{color:var(--dis);cursor:default;background:transparent}#shell .mi[aria-disabled="true"]::before{content:""}#shell .mi .t{display:flex;flex-direction:column;min-width:0}#shell .mi .why{color:var(--muted);margin-left:auto;padding-left:calc(var(--u)*4px);white-space:nowrap}#shell .mi .sub{color:var(--muted)}'
+'#shell .mi .lock{width:calc(var(--u)*7px);height:calc(var(--u)*8px);flex:0 0 auto}#shell .mi.danger{color:#f0b3b8}'
+'#shell .btnrow{display:flex;flex-wrap:wrap;gap:calc(var(--u)*4px);justify-content:flex-end}#shell .btn{appearance:none;cursor:pointer;min-height:max(44px,calc(var(--u)*16px));padding:0 calc(var(--u)*8px);background:var(--ink1);color:var(--lamp4);border:calc(var(--u)*1px) solid var(--lamp1)}'
+'#shell .btn:hover,#shell .btn:focus-visible{background:var(--ink2);color:var(--lamp5);box-shadow:0 0 0 calc(var(--u)*1px) var(--lamp4)}#shell .btn.danger{color:#f0b3b8;border-color:var(--seal2)}#shell .btn.small{min-height:max(36px,calc(var(--u)*12px));padding:0 calc(var(--u)*4px)}'
+'#shell.titlemode .band{position:absolute;left:0;right:0;top:calc(var(--cy) + var(--ch)*.52);bottom:0;background:linear-gradient(180deg,rgba(8,7,13,0),rgba(8,7,13,.86) 34%)}'
+'#shell .tmenu{position:absolute;left:calc(var(--cx) + var(--cw)/2);transform:translateX(-50%);bottom:max(16px,calc(100% - var(--cy) - var(--ch) + var(--u)*8px));width:min(calc(var(--u)*150px),calc(var(--cw)*.6))}'
+'#shell.narrow.titlemode .band{top:0;bottom:0;left:0;right:auto;width:min(46%,calc(var(--u)*175px));background:linear-gradient(90deg,rgba(8,7,13,.94) 64%,rgba(8,7,13,0))}#shell.narrow .tmenu{left:max(14px,env(safe-area-inset-left));top:50%;bottom:auto;transform:translateY(-50%);width:min(calc(var(--u)*118px),34%);max-height:calc(100% - 12px);overflow-y:auto;overscroll-behavior:contain}'
+'#shell .tmenu>.mi{flex:0 0 auto}@media (max-height:340px){#shell .mi.cont .thumb,#shell .mi.cont .sub+.sub{display:none}}'
+'#shell .mi.cont{align-items:stretch;color:var(--lamp4);padding-block:calc(var(--u)*2px);border:calc(var(--u)*1px) solid var(--lamp1);margin-bottom:calc(var(--u)*2px)}#shell .mi.cont .thumb{flex:0 0 auto;width:calc(var(--u)*48px);height:calc(var(--u)*21.6px);border:calc(var(--u)*1px) solid var(--lamp1);background:var(--ink0) center/cover no-repeat;image-rendering:pixelated;align-self:center}'
+'#shell .paper{width:min(calc(var(--u)*290px),calc(100% - 16px));color:var(--pink);background:var(--paper);border:calc(var(--u)*1px) solid #a39882;box-shadow:calc(var(--u)*2px) calc(var(--u)*2px) 0 0 rgba(0,0,0,.6);padding:calc(var(--u)*6px) calc(var(--u)*8px) calc(var(--u)*6px) calc(var(--u)*14px);background-image:linear-gradient(90deg,transparent calc(var(--u)*9px),var(--margin) calc(var(--u)*9px),var(--margin) calc(var(--u)*10px),transparent calc(var(--u)*10px))}'
+'#shell .paper.about,#shell .paper.confirm{width:min(calc(var(--u)*230px),calc(100% - 16px))}#shell .paper h3,#shell .paper h4{color:var(--seal2)}#shell .paper .ctx{color:var(--pmuted)}#shell .paper p{margin:0}#shell .paper ul{margin:0;padding-left:1.1em}#shell .paper li{margin:0 0 calc(var(--u)*2px)}'
+'#shell .phead{display:flex;align-items:center;justify-content:space-between;gap:calc(var(--u)*4px)}#shell .pmid{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:calc(var(--u)*4px)}'
+'#shell .paper .btn{background:#1f2c50;color:var(--paper2);border-color:#2f4274}#shell .paper .btn:hover,#shell .paper .btn:focus-visible{box-shadow:0 0 0 calc(var(--u)*1px) var(--seal2);color:#fff}#shell .paper .btn.danger{background:var(--paper2);color:var(--seal2);border-color:var(--seal2)}'
+'#shell .paper .mi{color:var(--pink)}#shell .paper .mi::before{color:var(--seal2)}#shell .paper .mi:hover,#shell .paper .mi:focus-visible{background:var(--paper2);color:var(--pink)}'
+'#shell .cards{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:calc(var(--u)*4px)}#shell .cards.cmp{grid-template-columns:1fr auto 1fr;align-items:center}#shell .arrow{font-size:calc(var(--fs)*2)}'
+'#shell .card{display:flex;flex-direction:column;gap:calc(var(--u)*2px);background:var(--paper2);border:calc(var(--u)*1px) solid #c8bb9f;min-width:0}#shell .card.bad{background:#f3e1df;border-color:var(--seal)}'
+'#shell .cardmain{appearance:none;border:0;background:transparent;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:calc(var(--u)*2px);padding:calc(var(--u)*3px);color:var(--pink);min-width:0;position:relative}#shell div.cardmain{cursor:default}'
+'#shell .card:hover,#shell .card:focus-within{border-color:var(--seal2);box-shadow:0 0 0 calc(var(--u)*1px) var(--seal2)}#shell .card.dis:hover{border-color:#c8bb9f;box-shadow:none}'
+'#shell .card .ph{width:100%;aspect-ratio:320/144;background:#c8bb9f center/cover no-repeat;image-rendering:pixelated;border:calc(var(--u)*1px) solid #a39882;display:grid;place-items:center}#shell.narrow .card .ph{aspect-ratio:320/112}'
+'#shell .card .ph.empty{background:repeating-linear-gradient(135deg,transparent 0 calc(var(--u)*3px),rgba(90,82,72,.18) calc(var(--u)*3px) calc(var(--u)*4px));color:var(--pmuted)}#shell .card b{font-weight:400}#shell .card .meta{color:var(--pmuted)}'
+'#shell .kindb{align-self:flex-start;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--paper2);background:var(--pmuted);padding:0 calc(var(--u)*2px)}#shell .kindb.auto{background:#1f2c50}#shell .kindb.mark{background:var(--seal2)}#shell .kindb.end{background:#3f5a2e}'
+'#shell input[type=text]{font:inherit;min-height:max(44px,calc(var(--u)*16px));padding:0 calc(var(--u)*4px);border:calc(var(--u)*1px) solid #a39882;background:var(--paper2);color:var(--pink);-webkit-user-select:text;user-select:text}#shell .seal{display:inline-grid;place-items:center;width:calc(var(--u)*9px);height:calc(var(--u)*9px);background:var(--seal);color:var(--paper2);border-radius:50%}#shell .card .btn.small{margin:0 calc(var(--u)*3px) calc(var(--u)*3px)}#shell .foot{margin-top:calc(var(--u)*2px)}'
+'#shell .set{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:calc(var(--u)*2px) calc(var(--u)*6px);align-items:center;min-height:0}#shell .set h4{grid-column:1/-1;margin-top:calc(var(--u)*3px);color:var(--ghost4)}#shell .set .lbl{min-width:0;overflow-wrap:anywhere}#shell .set .lbl small{display:block;color:var(--muted);font-size:inherit}'
+'#shell .set input[type=range]{justify-self:end;width:calc(var(--u)*70px);accent-color:var(--lamp3);height:max(44px,calc(var(--u)*14px))}#shell .segp{display:inline-flex;justify-self:end;border:calc(var(--u)*1px) solid var(--lamp1)}'
+'#shell .segp button{appearance:none;background:transparent;border:0;min-height:max(44px,calc(var(--u)*14px));padding:0 calc(var(--u)*4px);cursor:pointer;color:var(--text)}#shell .segp button+button{border-left:calc(var(--u)*1px) solid var(--lamp1)}#shell .segp button[aria-pressed="true"]{background:var(--lamp1);color:var(--lamp5)}'
+'#shell .preview{grid-column:1/-1;border:calc(var(--u)*1px) dashed var(--ghost2);padding:calc(var(--u)*3px) calc(var(--u)*4px);min-height:calc(var(--lh)*2.2)}#shell .preview .who{color:var(--lamp3)}'
+'#shell .endcard{width:min(calc(var(--u)*200px),calc(100% - 16px));text-align:center;align-items:center;background:transparent}#shell .endcard .kick{color:var(--ghost4)}#shell .endcard h2{font-size:calc(var(--fs)*3);line-height:calc(var(--lh)*2.6);color:var(--paper2)}#shell .endcard .sub{color:var(--paper)}#shell .endcard .time{color:var(--ghost4)}#shell .endcard .menu{width:100%}'
+'#shell .sh-toast{position:absolute;left:50%;top:max(10px,calc(var(--cy) + var(--u)*4px));transform:translateX(-50%);display:none;align-items:center;gap:calc(var(--u)*4px);background:var(--ink1);border:calc(var(--u)*1px) solid var(--ghost2);color:var(--ghost5);padding:calc(var(--u)*2px) calc(var(--u)*6px);z-index:3;max-width:calc(100% - 20px)}'
+'#shell .pnote{position:absolute;left:calc(var(--cx) + var(--u)*6px);right:calc(100% - var(--cx) - var(--cw) + var(--u)*6px);top:max(10px,calc(var(--cy) + var(--u)*4px));display:flex;gap:calc(var(--u)*6px);align-items:center;background:rgba(8,7,13,.94);border:calc(var(--u)*1px) solid var(--ghost2);color:var(--ghost5);padding:calc(var(--u)*3px) calc(var(--u)*5px);pointer-events:auto;max-width:calc(var(--u)*300px)}#shell .pnote span{flex:1 1 auto;min-width:0}#shell .pnote .btn{flex:0 0 auto;min-height:44px}#shell.titlemode .pnote~.chip{display:none}#shell.narrow .pnote{left:calc(36% + 10px);right:max(10px,env(safe-area-inset-right));flex-direction:column;align-items:flex-start}'
+'#shell .chip{position:absolute;right:max(10px,calc(100% - var(--cx) - var(--cw) + var(--u)*4px));top:max(10px,calc(var(--cy) + var(--u)*4px));background:rgba(8,7,13,.85);border:calc(var(--u)*1px) solid var(--ghost1);color:var(--ghost4);padding:calc(var(--u)*1px) calc(var(--u)*4px);pointer-events:none}'
+'#shell .sh-top{position:absolute;pointer-events:none;z-index:3}#shell .sh-toast.on{pointer-events:auto}'
+'#shell .sh-recap{position:absolute;left:50%;top:max(10px,calc(var(--cy) + var(--u)*6px));transform:translateX(-50%);display:none;width:max-content;max-width:min(calc(var(--u)*200px),calc(100% - 20px));background:rgba(19,17,28,.96);border:calc(var(--u)*1px) solid var(--lamp1);padding:calc(var(--u)*3px) calc(var(--u)*6px);pointer-events:none}'
+'#shell .sh-recap.on{display:block}#shell .sh-recap .k{color:var(--ghost4)}#shell .sh-recap .p{color:var(--lamp4)}#shell .sh-recap ul{margin:calc(var(--u)*2px) 0 0;padding-left:1.1em}#shell .sh-recap li{color:var(--text)}'
+'#shell .sh-toast.on{display:flex}#shell:not(.on) .sh-toast.on{position:fixed}';
// Aufbau erst hier: CSS (oben) ist jetzt belegt
if (DOM){ if (document.body) build(); else document.addEventListener('DOMContentLoaded',build); }
// Meldungen auch bei geschlossener Schicht zeigen (Toast liegt im #shell-Element, das dann nur ihn anzeigt)
if (DOM){ var tst=document.createElement('style'); tst.textContent='#shell:not(.on){display:block;pointer-events:none;background:none}#shell:not(.on) .sh-dim,#shell:not(.on) .sh-stage{display:none}#shell:not(.on) .sh-toast.on{pointer-events:auto}'; (document.head||document.documentElement).appendChild(tst); }
})(M);
