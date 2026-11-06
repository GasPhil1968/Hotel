/* ===== 17_map.js — Stadtplan als Überlagerung: Ortszustände, Reise über den gemeinsamen Ortswechsel =====
   Der Stadtplan ist kein eigener Raum mehr, in den man wechselt. Er liegt über dem Raum, in dem Marko steht:
   - geöffnet über einen Ausgang „In die Stadt“ (dann sind dessen Prüfungen schon gelaufen) oder über den Knopf „Karte“ / Taste K;
   - eine Wahl löst genau einen Ortswechsel aus (M.transition, derselbe Weg wie jeder Ausgang), mit denselben Prüfungen:
     canExit des Straßenausgangs, M.canTravel (Tageszeit, Begleitung, Pflichtereignisse), Mala nur mit Marko.
   Zustände je Ort: unbekannt (nicht gezeigt) · bekannt, aber gesperrt (mit Grund) · erreichbar · aktueller Ort · gerade nicht erreichbar (mit Grund).
   Freigeschaltet wird nur durch die Geschichte (A.unlock); „bekannt“ (GS.mapKnown) ergibt sich aus dem, was Marko schon weiß. */
(function(M){
'use strict';
var E=M.E, P=M.P;
function has(G,id){ return G.notes.indexOf(id)>=0; }

// ---------------------------------------------------------------- Orte, die man kennt, bevor man hin darf
// know(G): woraus Marko den Ort kennt (Notiz oder Abschnitt). why: was er dazu denkt. Freigabe bleibt bei der Geschichte.
M.MAP_KNOW={
  terminal:{ch:1, know:function(G){ return has(G,'c2_meet'); },
    why:'Der Kiosk am Fährterminal. Nach zwölf Jahren? Ich wüsste nicht, wen ich dort fragen soll.'},
  carsija:{ch:2, know:function(G){ return !!G.flags['k2.p1.rode']; },
    why:'Die Baščaršija. Bis dorthin fährt die Eins.'},
  pansion:{ch:2, know:function(G){ return M.chapterOf(G)===2; },
    why:'Eine Pension in Kovači, bei Hajra Mešić. Den Weg dorthin kenne ich nicht.'},
  vratnik:{ch:2, know:function(G){ return has(G,'p2_rade_ruza'); },
    why:'Vratnik. Dort hat Großmutter gewohnt. So weit bin ich noch nicht.'},
  neboder:{ch:2, know:function(G){ return has(G,'m2_photo')||has(G,'m2_stop'); },
    why:'Alipašino Polje, die Hochhäuser im Westen. Was ich dort suchen soll, weiß ich noch nicht.'}
};
// bekannte Orte nachtragen (auch für ältere Spielstände): nie etwas freischalten, nur „bekannt“ vermerken
M.mapRefresh=function(G){ G=G||M.GS; if (!G.mapKnown) G.mapKnown={}; var ch=M.chapterOf(G);
  Object.keys(M.MAP_KNOW).forEach(function(id){ var k=M.MAP_KNOW[id]; if (k.ch===ch && !G.mapKnown[id]){ try{ if (k.know(G)) G.mapKnown[id]=true; }catch(e){} } }); };
// Freigaben, die ältere Fassungen vergessen hatten, aus dem Stand der Geschichte nachholen (nie pauschal):
// Obala in Fall 2 von Kapitel 2, sobald die Adresse „Obala 14“ bekannt ist.
function storyUnlocks(G){ if (!G.map) G.map={}; if (M.chapterOf(G)===2 && (has(G,'s2_ledger')||(G.seen&&G.seen['dlg:iv3']))) G.map.obala=true; }
M.mapStoryUnlocks=storyUnlocks;
M.MIGRATE=M.MIGRATE||[]; M.MIGRATE.push(function(G){ if (!G.mapKnown) G.mapKnown={}; storyUnlocks(G); M.mapRefresh(G); });

// ---------------------------------------------------------------- Orte des Kapitels, Straße eines Raums
function locs(G){ var ch=M.chapterOf(G||M.GS); return ch===4?(M.MAPLOCS4||[]):(ch===3?(M.MAPLOCS3||[]):(ch===2?(M.MAPLOCS2||[]):M.MAPLOCS)); }
M.mapLocs=locs;
function locById(id,G){ return locs(G).filter(function(L){ return L.id===id; })[0]||null; }
M.mapLoc=locById;
M.mapCenter=function(id){ var L=locById(id); return L?[L.x,cyOf(L)]:null; };
function exitOf(h,S,G){ var ex=h.exit; if (typeof ex==='function') ex=ex(S,G); return ex||null; }
// Ausgang „In die Stadt“ dieses Raums (für Marko sichtbar), sonst null: dann ist der Raum ein Innenraum
function mapExit(R,G){ if (!R) return null; var S=M.RS(R.id); for (var i=0;i<R.hotspots.length;i++){ var h=R.hotspots[i]; if (h.vis && !h.vis(S,G)) continue; if (h.who==='g') continue; var ex=exitOf(h,S,G); if (ex && ex.to==='map') return h; } return null; }
M.mapExit=mapExit;
// zu welchem Ort des Stadtplans gehört ein Raum (Innenräume über ihre Ausgänge nach draußen)
function streetOf(rid,G){ var L=locs(G), seen={}, q=[rid];
  while (q.length){ var r=q.shift(); if (seen[r]) continue; seen[r]=1; var hit=L.filter(function(l){ return l.to===r; })[0]; if (hit) return hit; var R=M.ROOMS[r]; if (!R) continue;
    R.hotspots.forEach(function(h){ var ex=null; try{ ex=typeof h.exit==='function'?null:h.exit; }catch(e){} if (ex && ex.to && ex.to!=='map' && !seen[ex.to]) q.push(ex.to); }); }
  return null; }
M.mapStreetOf=streetOf;

// ---------------------------------------------------------------- Trockenprüfung: würde M.canTravel jetzt Nein sagen, und mit welchem Satz?
// Läuft mit einer Attrappe der Skript-API: kein Satz wird gesprochen, nichts wird gesetzt, kein Zähler läuft weiter.
function dryAPI(rec){ var A=M.API, D=Object.create(A), nop=function(){}, res=function(){ return Promise.resolve(); };
  var say=function(t){ if (rec.t===undefined) rec.t=t; return res(); };
  D.m=say; D.say=say; D.narrate=say; D.voice=say; D.g=function(t){ if (rec.t===undefined) rec.who='mala'; return say(t); };
  D.cycle=function(k,arr){ return arr[0]; }; D.pick=function(arr){ return arr[0]; }; D.first=function(){ return false; };
  ['setFlag','unlock','set','give','take','note','sfx','music','ambient','shake','found','phase','malaJoin','malaLeave','rebuild','busy','save','flash','headache'].forEach(function(k){ D[k]=nop; });
  ['wait','fade','goto','card','doc','overlay','choose','walk','walkM','walkG','face','anim','memory','puzzle'].forEach(function(k){ D[k]=res; });
  return D; }
async function dryTravel(L){ if (!M.canTravel) return {ok:true}; var rec={}; var ok=true;
  try{ ok=await M.canTravel(dryAPI(rec),L); }catch(e){ ok=true; } return {ok:!!ok, why:rec.t, who:rec.who}; }

// ---------------------------------------------------------------- Zustände aller Orte
// st: 'here' | 'open' | 'blocked' | 'locked' | 'unknown'
async function computeStates(G){ var out={}, here=E.room?streetOf(E.room.id,G):null, L=locs(G);
  for (var i=0;i<L.length;i++){ var l=L[i], o={};
    if (here && here.id===l.id) o.st='here';
    else if (G.map[l.id]){ var d=await dryTravel(l); o.st=d.ok?'open':'blocked'; o.why=d.why; o.who=d.who; }
    else if (G.mapKnown && G.mapKnown[l.id]){ var kk=M.MAP_KNOW[l.id]||{}; o.st='locked'; o.why=(typeof kk.why==='function'?kk.why(G):kk.why)||'Da kann ich noch nicht hin.'; }
    else o.st='unknown';
    out[l.id]=o; }
  return out; }
M.mapStates=async function(){ M.mapRefresh(M.GS); return computeStates(M.GS); };

// ---------------------------------------------------------------- Von wo aus kann Marko gerade aufbrechen?
// ok | 'mala' (Mala allein reist nicht) | 'inside' (Innenraum: erst hinaus) — beim Öffnen über einen Ausgang immer ok
function origin(ov){ var G=M.GS; if (G.active==='mala' && !(M.malaMayTravel && M.malaMayTravel(G))) return {ok:false,k:'mala',why:'Ohne Marko gehe ich nirgends hin.'};   // Kapitel 4: Mala reist auch allein
  if (ov && ov.exit) return {ok:true};
  if (M.mapOriginWhy){ var ow=M.mapOriginWhy(G,E.room); if (ow) return {ok:false,k:'inside',why:ow}; }   // ein Kapitel kennt eigene Gründe (Skela: das Taxi wartet drüben)
  var h=mapExit(E.room,G); if (!h) return {ok:false,k:'inside',why:'Von hier drinnen nicht. Erst muss ich hinaus auf die Straße.'};
  return {ok:true,hs:h}; }

// Warum die Karte gerade nicht aufgeht (null = sie geht auf)
function mapBlocked(){ var G=M.GS; if (E.screen!=='game'||!E.room) return 'Gerade nicht.';
  if (E.room.noMap) return E.room.noMap===true?'Hier gibt es keinen Stadtplan.':E.room.noMap;
  if (E.transitioning||E.busy||E.dlg||E.card||E.menu||(E.overlay&&E.overlay.kind!=='map')) return 'Gerade nicht.';
  if (G.ended) return 'Gerade nicht.';
  return null; }
M.mapBlocked=mapBlocked;

// ---------------------------------------------------------------- Öffnen, Schließen
// o.exit: über welchen Ausgang (dessen canExit ist schon gelaufen); ohne o.exit: über Knopf oder Taste
M.openMap=async function(o){ o=o||{}; if (E.overlay&&E.overlay.kind==='map') return true;
  if (!o.exit){ var why=mapBlocked(); if (why){ M.flash(why); return false; } }
  M.mapRefresh(M.GS); var st=await computeStates(M.GS);
  if (E.overlay||E.transitioning) return false;
  E.busy=true;   // solange der Plan offen ist, läuft im Raum nichts an (kein Ereignis, kein Wechsel, kein Speichern mitten darin)
  E.pop=null; E.pending=null;
  var data={exit:o.exit||null,room:E.room.id,st:st,ch:M.chapterOf(M.GS),sel:null,msg:null,acting:false};
  E.overlay={kind:'map',data:data,res:function(){ E.busy=false; },at:E.gt(),step:0,lay:mapLay(data)};
  M.sfx('paper'); E.mapOpened=(E.mapOpened||0)+1; return true; };
M.closeMap=function(){ if (E.overlay&&E.overlay.kind==='map') E.closeOverlay(null); };
M.toggleMap=function(){ if (E.overlay&&E.overlay.kind==='map'){ if (!E.overlay.data.acting) M.closeMap(); return; } M.openMap(); };

// ---------------------------------------------------------------- Einen Ort wählen
// Ein Tippen genügt. Erreichbar: aufbrechen. Sonst: ein Satz, warum nicht, und der Plan bleibt offen. Der aktuelle Ort schließt den Plan.
M.mapGo=async function(id){ var ov=E.overlay&&E.overlay.kind==='map'?E.overlay:null;
  if (!ov){ var ok0=await M.openMap(); if (!ok0) return false; ov=E.overlay; }
  var d=ov.data; if (d.acting||E.transitioning) return false; var L=locById(id); var s=L&&d.st[id]; if (!s||s.st==='unknown') return false;
  if (E.speech) E.endSpeech();
  var A=M.API; d.acting=true; d.sel=id;
  try{
    if (s.st==='here'){ M.closeMap(); return false; }
    if (s.st==='locked'){ await A.m(s.why); return false; }
    var org=origin(d); if (!org.ok){ if (org.k==='mala') await A.g(org.why); else await A.m(org.why); return false; }
    if (s.st==='blocked'){ try{ await M.canTravel(A,L); } finally{ if (!(E.overlay&&E.overlay.kind==='map')) E.busy=false; } return false; }   // dieselbe Prüfung wie beim Aufbrechen, mit ihrem eigenen Satz;
    // fragt sie nach (Auswahl), schließt sich der Plan dafür (05_engine.js, choose), und die Szene bleibt bis hier gesperrt
    // aufbrechen: Plan schließen, dann die Prüfungen in der Reihenfolge eines Fußwegs (Ausgang, dann Ziel), dann ein Wechsel
    E.closeOverlay(null); E.busy=true; var go=false;
    try{ var ok=true; if (org.hs && org.hs.canExit) ok=await org.hs.canExit(A); if (ok && M.canTravel) ok=await M.canTravel(A,L); go=!!ok; }
    finally{ E.busy=false; }
    if (!go) return false;
    var at=L.at||null;
    return await M.transition(L.to,{via:'map',x:at?at[0]:undefined,y:at?at[1]:undefined,f:at?at[2]:undefined});
  } finally{ d.acting=false; } };

// ---------------------------------------------------------------- Zeichnen
var CACHE={key:null,buf:null};
function iconVis(id){ var ov=E.overlay; var s=ov&&ov.kind==='map'&&ov.data.st?ov.data.st[id]:null; if (!s) return null; if (s.st==='unknown') return null; return s.st==='locked'?false:true; }
M.mapIconVis=function(id,G){ var v=iconVis(id); if (v!==null||(E.overlay&&E.overlay.kind==='map')) return v; return G&&G.map&&G.map[id]?true:null; };
function baseMap(d){ var key=d.ch+'|'+JSON.stringify(d.st); if (CACHE.key===key) return CACHE.buf; var R=M.ROOMS.map; M.mapNoNames=true; var b; try{ b=R&&R.paint?R.paint({},M.GS):new M.Buf(320,144,P.e3); } finally{ M.mapNoNames=false; } CACHE.key=key; CACHE.buf=b; return b; }
function lock(fb,x,y,c){ fb.rect(x,y+2,5,4,c); fb.px(x+1,y,c); fb.px(x+3,y,c); fb.px(x+1,y+1,c); fb.px(x+3,y+1,c); fb.px(x+2,y-1,c); fb.px(x+2,y+3,P.k0); }
function ring(fb,x,y,r,c,dots){ for (var a=0;a<64;a++){ if (dots && a%4>1) continue; var t=a/64*Math.PI*2, px=Math.round(x+Math.cos(t)*r), py=Math.round(y+Math.sin(t)*r*0.8); if (px>=0&&px<320&&py>=0&&py<144) fb.px(px,py,c); } }
// Namen ohne Überlappung: unter, über, rechts oder links neben dem Symbol, je nachdem, wo Platz ist
function cyOf(L){ return M.chapterOf(M.GS)>=2?L.y-1:L.y-7; }   // Mitte des Symbols (Split: über dem Punkt gezeichnet, Sarajevo: um ihn herum)
function iconBox(L){ return M.chapterOf(M.GS)>=2?[L.x-9,L.y-10,19,16]:[L.x-8,L.y-16,17,17]; }
function overlap(a,b){ return a[0]<b[0]+b[2]&&b[0]<a[0]+a[2]&&a[1]<b[1]+b[3]&&b[1]<a[1]+a[3]; }
function layoutNames(d){ var vis=locs().filter(function(L){ var s=d.st[L.id]; return s&&s.st!=='unknown'; }), placed=vis.map(iconBox), out={};
  vis.slice().sort(function(a,b){ function n(L){ return vis.filter(function(o){ return o!==L && Math.hypot(o.x-L.x,o.y-L.y)<40; }).length; } return n(b)-n(a); }).forEach(function(L){ var nm=labelOf(L), w=M.textWidth(nm)+2, h=9, ib=iconBox(L), cx=L.x-(w>>1);
    var my=L.y-(M.chapterOf(M.GS)>=2?4:10), bot=ib[1]+ib[3]+1, top=ib[1]-h-1, rx=ib[0]+ib[2]+2, lx=ib[0]-w-2;
    var cand=[[cx,bot],[cx,top],[rx,my],[lx,my],[rx,bot-4],[lx,bot-4],[rx,top+4],[lx,top+4],[cx,bot+9],[cx,top-9],[rx,bot+6],[lx,bot+6]];
    function area(a,b){ var x=Math.max(0,Math.min(a[0]+a[2],b[0]+b[2])-Math.max(a[0],b[0])), y=Math.max(0,Math.min(a[1]+a[3],b[1]+b[3])-Math.max(a[1],b[1])); return x*y; }
    var best=null, bestA=1e9; for (var i=0;i<cand.length;i++){ var bx=[Math.max(9,Math.min(311-w,cand[i][0])),Math.max(7,Math.min(137-h,cand[i][1])),w,h], ar=0; placed.forEach(function(p){ ar+=area(p,bx); }); if (ar<bestA){ bestA=ar; best=bx; if (!ar) break; } }
    placed.push(best); out[L.id]={nm:nm,x:best[0]+1,y:best[1]+1}; });
  return out; }
function nameAt(fb,L,lay,c,oc){ var n=lay[L.id]; if (n) M.text(fb,n.nm,n.x,n.y,c,oc); }
// Prüfbericht K3: ein bekannter, aber noch nicht erreichbarer Ort trägt seinen Namen erst, wenn Marko ihn kennt (MAP_KNOW[id].label)
function labelOf(L){ var k=M.MAP_KNOW&&M.MAP_KNOW[L.id], G=M.GS; if (k && k.label && !(G.map&&G.map[L.id])){ var t=k.label(G); if (t) return M.tr?M.tr(t):t; } return M.tr?M.tr(L.name):L.name; }
var LEG={here:'hier',open:'erreichbar',blocked:'gerade nicht',locked:'noch nicht'};
function infoFor(id,d){ var L=locById(id), s=d.st[id]; if (!L||!s) return null; var nm=labelOf(L);
  if (s.st==='here') return nm+' – hier bin ich.'; if (s.st==='open') return nm; return nm+': '+(M.tr?M.tr(s.why||''):(s.why||'')); }
// nächstgelegener bekannter Ort im Umkreis: große Trefferflächen, auch wenn zwei Orte nah beieinander liegen
function locAt(d,x,y){ var best=null, bd=1e9; locs().forEach(function(L){ var s=d.st[L.id]; if (!s||s.st==='unknown') return; var dx=x-L.x, dy=(y-cyOf(L))*1.15, q=dx*dx+dy*dy; if (q<bd){ bd=q; best=L; } }); return best&&bd<=20*20?best.id:null; }
var CLOSE_R=[4,149,78,24];
// Trefferflächen stehen ab dem Öffnen fest (nicht erst nach dem ersten gezeichneten Bild): auch ein sehr schneller Tipp trifft
function mapLay(d){ var cr=CLOSE_R; return {at:function(x,y){ if (x>=cr[0]&&x<cr[0]+cr[2]&&y>=cr[1]-2&&y<cr[1]+cr[3]+4) return 'x'; if (y<144) return locAt(d,x,y); return null; }}; }
M.defineOverlay('map',function(fb,ov,gt){ var d=ov.data, b=baseMap(d), i, hov=M.uiHover?M.uiHover():null, c=M.uiColors?M.uiColors():{fr:P.y1,tx:P.y3,hi:P.y5,dim:P.y0};
  for (i=0;i<320*144;i++) fb.d[i]=b.d[i];
  var pulse=(Math.sin(gt/220)+1)/2, hid=hov&&hov.slice(0,2)==='o:'?hov.slice(2):null; if (!d.lay||d.layKey!==CACHE.key){ d.lay=layoutNames(d); d.layKey=CACHE.key; }
  locs().forEach(function(L){ var s=d.st[L.id]; if (!s||s.st==='unknown') return; var cy=cyOf(L);
    if (s.st==='here'){ ring(fb,L.x,cy,10+Math.round(pulse*2),pulse>0.5?P.s6:P.y4); ring(fb,L.x,cy,12+Math.round(pulse*2),P.k0,true); nameAt(fb,L,d.lay,P.k1,P.s6); }
    else if (s.st==='open'){ nameAt(fb,L,d.lay,P.k1,P.s5); }
    else if (s.st==='blocked'){ ring(fb,L.x,cy,10,P.e3,true); nameAt(fb,L,d.lay,P.e2,P.s4); }
    else if (s.st==='locked'){ lock(fb,L.x+7,cy-9,P.e2); nameAt(fb,L,d.lay,P.e3,P.s4); }
    if ((hid===L.id||d.sel===L.id) && s.st!=='here') ring(fb,L.x,cy,11,s.st==='open'?P.y4:P.s4); });
  // Leiste unten: Schließen, Auskunft zum Ort unter dem Zeiger (nur Zusatz – auf Touch genügt das Tippen), Zeichenerklärung
  fb.rect(0,144,320,56,P.k0); fb.hl(0,319,144,c.fr);
  var cr=CLOSE_R, hot=hov==='o:x'; fb.rect(cr[0],cr[1],cr[2],cr[3],hot?P.k2:P.k1); fb.hl(cr[0],cr[0]+cr[2]-1,cr[1],c.fr); fb.hl(cr[0],cr[0]+cr[2]-1,cr[1]+cr[3]-1,c.fr); fb.vl(cr[0],cr[1],cr[1]+cr[3]-1,c.fr); fb.vl(cr[0]+cr[2]-1,cr[1],cr[1]+cr[3]-1,c.fr);
  var cl=M.tr?M.tr('Schließen'):'Schließen'; M.text(fb,cl,cr[0]+((cr[2]-M.textWidth(cl))>>1),cr[1]+8,hot?c.hi:c.tx);
  var info=(hid&&hid!=='x')?infoFor(hid,d):null; if (!info) info=M.tr?M.tr(ov.data.exit?'Wohin?':'Wohin? Ein Ort genügt.'):'Wohin?';
  var ls=M.wrap(info,226); ls.slice(0,3).forEach(function(l,k){ M.text(fb,l,88,150+k*9,c.tx); });
  // Zeichenerklärung
  var lx=88, ly=186; fb.rect(lx,ly+1,5,5,P.s6); M.text(fb,M.tr?M.tr(LEG.here):LEG.here,lx+8,ly,P.s4); lx+=12+M.textWidth(M.tr?M.tr(LEG.here):LEG.here);
  for (i=0;i<6;i++) if (i%2===0) fb.px(lx+i,ly+3,P.e3); M.text(fb,M.tr?M.tr(LEG.blocked):LEG.blocked,lx+9,ly,P.s4); lx+=13+M.textWidth(M.tr?M.tr(LEG.blocked):LEG.blocked);
  lock(fb,lx,ly+1,P.e2); M.text(fb,M.tr?M.tr(LEG.locked):LEG.locked,lx+8,ly,P.s4);
  if (!ov.lay) ov.lay=mapLay(d); });
// Antippen: Schließen oder Ort. Neben die Orte getippt: nichts (kein Durchklicken in den Raum dahinter).
M.mapTap=function(ov,id){ if (ov.data.acting) { if (E.speech && E.gt()-E.speech.at>200) E.endSpeech(); return; }
  if (E.speech){ if (E.gt()-E.speech.at>200) E.endSpeech(); return; }
  if (id==='x'){ M.sfx('click'); M.closeMap(); return; } if (!id) return; M.sfx('click'); M.mapGo(id); };
})(M);
