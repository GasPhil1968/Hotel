/* ===== 15_hints.js — Hinweise in vier Stufen, auf Wunsch (Gespräch mit Mala, Menü „Hinweis …“, allein: „Gedanken ordnen“) =====
   Stufen je Rätselabschnitt: 1 Problem einordnen · 2 Denkrichtung · 3 Konkreter Ansatz · 4 Nächster Schritt (nur nach Rückfrage).
   - Themen stehen in 15_hints_k1.js (Split) und 15_hints_k2.js (Sarajevo): {id, t, open(G), s:[s1,s2,s3,s4]}.
     Ein Stufentext ist ein String, {m,g} (g = Fassung, wenn Mala spricht) oder function(G) -> String/{m,g}.
   - Gezeigt wird nur, was zum aktuellen Stand passt: open(G) wird vor jeder Ausgabe neu geprüft. Ein neuer Abschnitt ist ein neues
     Thema und beginnt wieder bei Stufe 1. Ein Hinweis ändert nichts als die Hinweisgeschichte (GS.hints): keine Notiz, kein Schalter,
     kein Gegenstand, kein Ortswechsel. Normales Reden mit Mala verändert die Stufe nicht.
   - Mala hilft nur, wenn sie da und als Gegenüber bekannt ist; sonst ordnet Marko seine Gedanken allein (ohne Malas Bild und Stimme). */
(function(M){
'use strict';
var E=M.E;
function topics(G){ var ch=M.chapterOf(G); return (ch===3?M.HINTS_K3:(ch===2?M.HINTS_K2:M.HINTS_K1))||[]; }
M.hintTopics=topics;
function isOpen(h,G){ try{ return !!h.open(G); }catch(e){ return false; } }
M.hintsOpen=function(G){ G=G||M.GS; return topics(G).filter(function(h){ return isOpen(h,G); }); };
function stageOf(G,id){ var r=G.hints&&G.hints[id]; return r?(r.s||0):0; }
function setStage(G,id,s){ if (!G.hints) G.hints={}; var r=G.hints[id]||(G.hints[id]={s:0,n:0}); if (s>r.s) r.s=s; r.n=(r.n||0)+1; }
// ein Stufentext für den Sprecher (mala | marko), zum aktuellen Stand
function text(h,i,G,who){ var v=h.s[i]; if (typeof v==='function') v=v(G); if (v&&typeof v==='object') v=(who==='mala'&&v.g)?v.g:v.m; return v||''; }
M.hintText=text;

// Kann Mala gerade helfen? Nur, wenn sie für Marko da ist (sichtbar, bekannt, im selben Raum) – sonst denkt Marko allein.
function malaHelps(G){ G=G||M.GS; var f=G.flags;
  if (!G.malaOn||f['mala.unknown']||f['mala.voice']||f['split.afterIvka.away']) return false;
  if (f['split.intro.meet'] && !f['split.intro.met']) return false;
  if (!G.pos||!G.pos.mala||!G.pos.marko||G.pos.mala.room!==G.pos.marko.room) return false;
  return true; }
M.hintMalaHelps=malaHelps;

// Sätze des Rahmens, je nach Sprecher. Bei Marko allein: Gedanken, keine Fragen an jemanden.
var FRAME={
  mala:{ title:'Woran hängst du?', none:'Ich sehe gerade nichts, woran du hängst.', other:'Etwas anderes.', bye:'Schon gut. Danke.',
    again:'Sag das noch einmal.', next:['','In welche Richtung soll ich denken?','Wie könnte ich das angehen?','Was ist der nächste Schritt?'],
    ask4:'Soll ich dir den konkreten nächsten Schritt verraten?', yes:'Ja. Sag es mir.', no:'Nein, noch nicht.', noLater:'Gut. Dann denk noch ein bisschen.',
    done:'Das hat sich erledigt. Das hast du schon.', last:'Mehr weiß ich dazu auch nicht.', start:'Womit?' },
  marko:{ title:'Gedanken ordnen: Woran hänge ich?', none:'Gerade fällt mir nichts ein, woran ich hänge.', other:'Etwas anderes.', bye:'(Genug nachgedacht.)',
    again:'(Noch einmal von vorn.)', next:['','(In welche Richtung muss ich denken?)','(Wie könnte ich das angehen?)','(Und der nächste Schritt?)'],
    ask4:'Will ich den nächsten Schritt wirklich schon wissen?', yes:'(Ja.)', no:'(Nein, noch nicht.)', noLater:'Noch nicht. Ich denke selbst weiter.',
    done:'Das hat sich erledigt.', last:'Weiter komme ich so nicht.', start:null }
};
M.HINT_FRAME=FRAME;
function sayAs(A,who,t){ return who==='mala'?A.g(t):A.m(t); }

// Eine Hinweis-Sitzung. mode: 'mala' (im Gespräch mit Mala), 'menu' (Menü/Knopf: Mala, wenn sie da ist, sonst Marko allein)
M.showHints=async function(mode){ var A=M.API, G=A.G; if (E.screen!=='game') return; var inTalk=mode==='mala';
  if (!inTalk && (E.busy||E.dlg||E.overlay)) return;
  var who=(inTalk||malaHelps(G))?'mala':'marko', F=FRAME[who], own=!inTalk;
  if (own) E.busy=true;
  try{
    if (inTalk && F.start) await A.g(F.start);
    for (var guard=0;guard<40;guard++){
      var list=M.hintsOpen(G); if (!list.length){ await sayAs(A,who,F.none); return; }
      var opts=list.map(function(h,i){ var s=stageOf(G,h.id); return {t:h.t+(s?'  ·'+s+'/4':''),id:i,silent:true,noGray:true}; });   // übersetzt wird beim Zeichnen
      opts.push({t:F.bye,id:-1,silent:true,bye:true,noGray:true});
      var c=await A.choose(opts,{title:F.title,conv:inTalk}); if (c===-1||c===null||c===undefined) return;
      var h=list[c]; if (!h) return;
      var r=await topicLoop(A,G,h,who,F); if (r==='bye') return; }
  } finally{ if (own) E.busy=false; } };

async function topicLoop(A,G,h,who,F){
  var s=stageOf(G,h.id);
  if (s===0){ if (!isOpen(h,G)){ await sayAs(A,who,F.done); return 'list'; } setStage(G,h.id,1); s=1; await sayAs(A,who,text(h,0,G,who)); }
  for (var guard=0;guard<20;guard++){
    var o=[{t:F.again,id:'again',silent:true,noGray:true}];
    if (s<4) o.push({t:F.next[s],id:'next',silent:true,noGray:true});
    o.push({t:F.other,id:'other',silent:true,noGray:true}); o.push({t:F.bye,id:'bye',silent:true,bye:true,noGray:true});
    var c=await A.choose(o,{title:h.t,conv:who==='mala'});
    if (c==='bye'||c===null||c===undefined) return 'bye'; if (c==='other') return 'list';
    if (!isOpen(h,G)){ await sayAs(A,who,F.done); return 'list'; }   // vor jeder Ausgabe: Stand neu prüfen
    if (c==='again'){ for (var i=0;i<s;i++) await sayAs(A,who,text(h,i,G,who)); continue; }
    if (c==='next'){ var n=s+1;
      if (n===4){ if (who==='mala') await A.g(F.ask4);   // vor Stufe 4 immer die Rückfrage
        var y=await A.choose([{t:F.yes,id:'y',silent:true,noGray:true},{t:F.no,id:'n',silent:true,noGray:true}],{title:who==='mala'?null:F.ask4,conv:who==='mala'});
        if (y!=='y'){ await sayAs(A,who,F.noLater); continue; }
        if (!isOpen(h,G)){ await sayAs(A,who,F.done); return 'list'; } }
      setStage(G,h.id,n); s=n; await sayAs(A,who,text(h,n-1,G,who)); continue; } }
  return 'bye'; }

// Eintrag für Malas Gesprächsmenü (Kapitel 1 und 2): dasselbe System wie im Menü
M.hintTalkOpt=function(A){ return {t:'Ich komme gerade nicht weiter.',noGray:true,go:async function(A){ await M.showHints('mala'); }}; };

// ältere Spielstände: die alten drei Stufen (Schalter hint.<id>) in die neue Hinweisgeschichte übernehmen (3 hieß: Schritt verraten)
M.MIGRATE=M.MIGRATE||[]; M.MIGRATE.push(function(G){ if (!G.hints) G.hints={};
  Object.keys(G.flags).forEach(function(k){ var m=/^hint\.(.+)$/.exec(k); if (!m) return; var lv=+G.flags[k]||0; var s=lv>=3?4:lv; if (s && !(G.hints[m[1]]&&G.hints[m[1]].s>=s)) G.hints[m[1]]={s:s,n:lv}; delete G.flags[k]; }); });
})(M);
