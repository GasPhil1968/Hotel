/* ===== 96_k4_story.js — Kapitel 4: München. Phasen, Kapitelstart mit Übernahme aus Mostar, Stadtplan und Reiseregeln,
   Mala allein unterwegs, Tageswechsel (ein Tag endet erst nach seinen Pflichtschritten), „Mala fragen“, Reaktionen auf Schlüsse,
   feste Zwischenstände in der Silvesternacht, Laden mitten im Kapitel, Abspann. Vorgaben: game/K4_SPEC.md ===== */
(function(M){
'use strict';
var P=M.P;
M.definePhases({
  k4_pro:   {chapter:4, cases:['h4','z4'], tod:'day',  weather:'snow',   case:'h4', title:'Prolog – Heiligabend', short:'München: Prolog', when:'Samstag, 24. Dezember 2011 · Morgen'},
  k4_pro_n: {chapter:4, cases:['z4'], tod:'night',weather:'snowlie',case:'z4', title:'Prolog – Heiligabend', short:'München: Heiligabend', when:'Samstag, 24. Dezember · Abend'},
  k4_d1:    {chapter:4, cases:['z4','s4','g4'], tod:'day',  weather:'snowlie',case:'z4', title:'Erster Tag – Christtag', short:'München: Erster Tag', when:'Sonntag, 25. Dezember · klar'},
  k4_d1_n:  {chapter:4, cases:['z4','s4','g4'], tod:'night',weather:'snowlie',case:'z4', title:'Erster Tag – Christtag', short:'München: Erster Tag, Abend', when:'Sonntag · Abend'},
  k4_d2:    {chapter:4, cases:['z4','s4','g4'], tod:'day',  weather:'thaw',   case:'z4', title:'Zweiter Tag – Der Anruf', short:'München: Zweiter Tag', when:'Dienstag, 27. Dezember · Tauwetter'},
  k4_d2_n:  {chapter:4, cases:['z4','s4','g4'], tod:'night',weather:'thaw',   case:'z4', title:'Zweiter Tag – Der Anruf', short:'München: Zweiter Tag, Abend', when:'Dienstag · Abend'},
  k4_d3:    {chapter:4, cases:['s4','g4','z4'], tod:'day',  weather:'snow',   case:'s4', title:'Dritter Tag – Namen', short:'München: Dritter Tag', when:'Mittwoch, 28. Dezember · Schneefall'},
  k4_d4:    {chapter:4, cases:['s4','g4','z4'], tod:'day',  weather:'snowlie',case:'g4', title:'Vierter Tag – Abschiede', short:'München: Vierter Tag', when:'Donnerstag, 29. Dezember · klar'},
  k4_d4_n:  {chapter:4, cases:['z4'], tod:'night',weather:'snowlie',case:'z4', title:'Vierter Tag – Abschiede', short:'München: Vierter Tag, Abend', when:'Donnerstag · Abend'},
  k4_d5:    {chapter:4, cases:['z4'], tod:'day',  weather:'fog',    case:'z4', title:'Fünfter Tag – Ohne Mala', short:'München: Fünfter Tag', when:'Freitag, 30. Dezember · Nebel'},
  k4_d5_n:  {chapter:4, cases:['z4'], tod:'night',weather:'fog',    case:'z4', title:'Fünfter Tag – Die Brücke', short:'München: Hackerbrücke', when:'Freitag · Nacht'},
  k4_fin_a: {chapter:4, cases:['z4'], tod:'night',weather:'frost',  case:'z4', title:'Finale – Silvester', short:'München: Silvester', when:'Samstag, 31. Dezember · Abend'},
  k4_fin_n: {chapter:4, cases:['z4'], tod:'night',weather:'frost',  case:'z4', title:'Finale – Silvester', short:'München: Silvesternacht', when:'Samstag, 31. Dezember · Nacht'},
  k4_epi:   {chapter:4, cases:['z4'], tod:'day',  weather:'sun',    case:'z4', title:'Epilog – Neujahr', short:'München: Epilog', when:'Sonntag, 1. Januar 2012 · Vormittag'}
});
function CH4(G){ return M.chapterOf(G||M.GS)===4; }
M.k4Is=CH4;
// Feuerwerk: in der Silvesternacht, und am Ende des Silvesterabends (die Kunst liest S.fireworks oder M.k4Fireworks(GS))
M.k4Fireworks=function(GS){ GS=GS||M.GS; if (!GS) return false; if (GS.phase==='k4_fin_n') return true; return GS.phase==='k4_fin_a' && !!(GS.flags&&GS.flags['k4.fin.late']); };
function f(G,k){ return !!G.flags[k]; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
async function card(A,k,t,time,ms,sub){ M.E.screen='card'; await A.card({kicker:k,title:t,sub:sub,time:time,ms:ms||4600}); }
// eine Szene außerhalb eines laufenden Ablaufs (aus dem Leerlauf): sperrt Eingaben, speichert nicht mittendrin
async function run(A,fn){ var E=M.E, wb=E.busy; E.busy=true; try{ await fn(A); } catch(e){ console.error(e); } finally{ E.busy=wb; } }
var DAY4=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'], NIGHT4=['k4_pro_n','k4_d1_n','k4_d2_n','k4_d4_n','k4_d5_n'];
M.K4_DAYS=DAY4; M.K4_NIGHTS=NIGHT4;
// Kostüme teilen ein Porträt (07_portraits.js)
['jasnaW','jasnaC'].forEach(function(k){ M.PORTRAIT_ALIAS[k]='jasna'; }); M.PORTRAIT_ALIAS.anaC='ana'; M.PORTRAIT_ALIAS.miaC='mia'; M.PORTRAIT_ALIAS.nikoC='niko';

// ---------------------------------------------------------------- Übernahme aus Mostar (und Sarajevo)
var C3KEY='mala.c3end', C2KEY='mala.c2end';
M.k4CarryRead=function(){ var d3=null, d2=null; try{ d3=JSON.parse(localStorage.getItem(C3KEY)||'null'); }catch(e){ d3=null; } try{ d2=JSON.parse(localStorage.getItem(C2KEY)||'null'); }catch(e){ d2=null; }
  var c={ consent:'b', promise:'a', talk2:'a', sample:true, asks:3, skips:0, ana:false, father:false, fromSave:false }, abc=function(v){ return ['a','b','c'].indexOf(v)>=0; };
  if (d3 && typeof d3==='object'){ if (abc(d3.consent)) c.consent=d3.consent; if (abc(d3.promise)) c.promise=d3.promise; if (abc(d3.talk2)) c.talk2=d3.talk2;
    c.sample=!!d3.sample; c.asks=Math.max(0,+d3.asks||0); c.skips=Math.max(0,+d3.skips||0); c.fromSave=true; }
  if (d2 && typeof d2==='object'){ c.ana=!!d2.ana; c.father=!!d2.father; }
  return c; };
Object.defineProperty(M,'k4Carry',{configurable:true,get:function(){ var G=M.GS||{flags:{}}, F=G.flags||{};
  return { consent:F['k4.c3.consent']||'b', promise:F['k4.c3.promise']||'a', talk2:F['k4.c3.talk2']||'a', sample:F['k4.c3.sample']!==false, asks:F['k4.c3.asks']===undefined?3:F['k4.c3.asks'], skips:F['k4.c3.skips']||0,
    ana:!!F['k4.c2.ana'], father:!!F['k4.c2.father'], fromSave:!!F['k4.c3.fromSave'] }; }});
M.k4Variant=function(G){ G=G||M.GS; return (G && G.flags && G.flags['k4.c3.sample']===false)?'no':'yes'; };

// ---------------------------------------------------------------- Kapitelstart
M.startChapter4=async function(A){ var E=M.E; E.busy=true;
  try{ var c=M.k4CarryRead(), G=A.G; M.setPhase('k4_pro');
    G.flags['k4.c3.consent']=c.consent; G.flags['k4.c3.promise']=c.promise; G.flags['k4.c3.talk2']=c.talk2; G.flags['k4.c3.sample']=c.sample; G.flags['k4.c3.asks']=c.asks; G.flags['k4.c3.skips']=c.skips;
    G.flags['k4.c2.ana']=c.ana; G.flags['k4.c2.father']=c.father; G.flags['k4.c3.fromSave']=c.fromSave;
    G.malaOn=false; G.active='marko'; var st=(M.ART.zob&&M.ART.zob.start)||[90,124,'R']; G.pos.marko={room:'zob',x:st[0],y:st[1],f:st[2]||'R'};
    ['dzezva','mobitel','olovka','photo_full','vizitka','vanilice'].forEach(function(i){ if (M.ITEMS[i] && !A.has(i)) A.give(i); });
    ['k4_c_lana','k4_c_vater'].forEach(function(id){ A.note(id,true); });
    ['zob','westend','hbf'].forEach(function(l){ A.unlock(l); }); G.flags['k4.moves']=0;
    ['nada','kolar','davor','lena','jela','mala','ana','jasna','tobias','mia','niko','anaC','jasnaW','jasnaC','miaC','nikoC'].forEach(function(id){ G.flags['met.'+id]=true; });   // Familie und Bekannte aus Mostar
    E.screen='card'; await A.card({kicker:'Kapitel 4',title:'München',sub:'Prolog – Heiligabend',time:'Samstag, 24. Dezember 2011 · Morgen',ms:5200});
    A.music('k4_bus');
    var lines=['Zehn Stunden Bus. Ab Salzburg schneit es. Mala sitzt am Fenster und zählt die Lichter, die ganze Nacht, laut, auf Bosnisch.'];
    lines.push({a:'Am Grab habe ich „Ja“ gesagt. „Einfach so?“, hat sie gefragt. Seitdem frage ich mich, ob es einfach war.',b:'„Wenn es zu schwer wird, sagen wir es.“ Bisher hat keiner von uns etwas gesagt.',c:'„Frag mich in München noch mal.“ Ab Salzburg sieht sie mich an, als wäre München ein Datum.'}[c.consent]);
    lines.push(c.sample?'In der Jackentasche die Quittung aus Mostar: vier Kreise, oben mein Name, darunter seiner.':'In der Jackentasche nichts aus Mostar. „Heute nicht“, habe ich gesagt. Zweimal.');
    lines.push('Auf meinem Schoß eine Blechdose. Nada hat sie mir am Busbahnhof in die Hand gedrückt: „Vanilice. Für deine Mutter. Sag ihr: von Nada, vom Neunten.“');
    if (c.fromSave && c.asks>=3) lines.push('Kurz vor München sagt Mala: „Du hast in Mostar oft gefragt. Das war gut.“'); else if (c.fromSave) lines.push('Kurz vor München sagt Mala: „Du hast in Mostar selten gefragt. Hier fragst du mehr.“ Es klingt nicht wie eine Bitte.');
    await A.memory({title:'Im Bus nach München',tint:'memory',blank:true,draw:M.mem&&M.mem.k4_bus,lines:lines});
    await A.goto('zob',{x:st[0],y:st[1],f:st[2]||'R',noEnter:true}); A.malaJoin({fadeIn:false}); A.music('k4_muenchen'); await A.wait(400);
    A.setFlag('k4.p.arrived');
    if (M.k4Arrive) await M.k4Arrive(A); else { await A.m('München. Sieben Uhr vierzig. Schnee.'); A.note('u4_sms'); }
  } finally { E.busy=false; } A.save(); };

// ---------------------------------------------------------------- Stadtplan München (der Raum 'map' malt in Kapitel 4 den Plan von München)
var POS0={ zob:[100,66], hbf:[132,72], bhfviertel:[146,90], westend:[80,92], wiesn:[118,108], heim:[74,114], friedhof:[178,82], giesing:[236,118], moosach:[56,30], konsulat:[186,44] };
function pos4(id){ var P4=M.MAP4_POS||{}; return P4[id]||POS0[id]||[160,72]; }
var LOC4=[
  {id:'zob',       name:'ZOB / Hackerbrücke',   to:'zob',      icon:'bus'},
  {id:'westend',   name:'Westend (Mama)',       to:'jhaus',    icon:'house'},
  {id:'giesing',   name:'Giesing (Ana)',        to:'ana',      icon:'house'},
  {id:'wiesn',     name:'Theresienwiese',       to:'wiesn',    icon:'park'},
  {id:'heim',      name:'Haus am Bavariapark',  to:'heim',     icon:'office'},
  {id:'hbf',       name:'Hauptbahnhof',         to:'gleis11',  icon:'train'},
  {id:'bhfviertel',name:'Bahnhofsviertel',      to:'barsport', icon:'shop'},
  {id:'friedhof',  name:'Städtische Friedhöfe', to:'friedamt', icon:'office'},
  {id:'moosach',   name:'Moosach (Davor)',      to:'balkon',   icon:'house'},
  {id:'konsulat',  name:'Generalkonsulat',      to:'konsulat', icon:'office'}
];
Object.defineProperty(M,'MAPLOCS4',{configurable:true,get:function(){ return LOC4.map(function(L){ var p=pos4(L.id); return {id:L.id,name:L.name,to:L.to,icon:L.icon,x:p[0],y:p[1],at:null}; }); }});
(function(){ var R=M.ROOMS.map; if (!R) return; var paint0=R.paint;
  R.paint=function(S,GS){ if (M.chapterOf(GS)===4){ if (M.paintMap4) return M.paintMap4(S,GS); var b=new M.Buf(320,144,P.e4); M.text(b,'MÜNCHEN',8,6,P.k1);
      for (var y=0;y<144;y++){ var x=262+Math.round(Math.sin(y*0.045)*8); b.hl(x,x+4,y,P.b3); } M.text(b,'ISAR',272,128,P.b1);
      for (var gx=96;gx<170;gx+=3) b.hl(gx,gx+1,74,P.m2);
      if (!M.mapNoNames) M.MAPLOCS4.forEach(function(L){ if (!GS.map[L.id]) return; M.text(b,L.name,Math.max(4,L.x-(M.textWidth(L.name)>>1)),L.y+5,P.k1); });
      M.MAPLOCS4.forEach(function(L){ var v=M.mapIconVis?M.mapIconVis(L.id,GS):!!GS.map[L.id]; if (v===null||v===undefined) return; b.rect(L.x-3,L.y-3,7,7,v?P.r2:P.e2); }); return b; }
    return paint0(S,GS); }; })();
// Orte, die Marko kennt, bevor er hin darf (Gründe ohne Wegweisung)
M.MAP_KNOW.giesing={ch:4, know:function(G){ return M.chapterOf(G)===4; }, why:'Ana wohnt in Giesing. Heute Abend sind wir dort. Erst Mama.'};
M.MAP_KNOW.heim={ch:4, know:function(G){ return !!G.flags['k4.p.jasna']; }, why:'Mamas Heim. Einfach so hingehen, an ihren Arbeitsplatz? Ohne Grund?'};
M.MAP_KNOW.moosach={ch:4, know:function(G){ return G.inv.indexOf('vizitka')>=0; }, why:'Davors Adresse steht auf seiner Karte. Unangemeldet klingeln? Erst rufe ich an.'};

// ---------------------------------------------------------------- Reisen
// Grund, warum eine Reise nicht geht: {t (Marko), tg (Mala allein)} oder null
function travelWhy(G,L){ var p=G.phase, id=L.id, alone=G.active==='mala';
  if (p==='k4_d5_n') return {t:'Nicht jetzt.',tg:'Nicht jetzt.'};
  if (NIGHT4.indexOf(p)>=0) return {t:A_EVE(p),tg:'Nachts gehe ich nicht ohne ihn durch die Stadt. Nicht hier.'};
  if (p==='k4_fin_a') return id==='giesing'?null:{t:'Heute ist Silvester. Wir feiern bei Ana.'};
  if (p==='k4_fin_n'){ if (!f(G,'k4.fin.trail')) return {t:'Wohin? Ich weiß nicht, wohin sie gegangen ist.',tg:'Erst muss ich wissen, wohin.'}; return id==='heim'?null:{t:'Nicht jetzt. Mama.'}; }
  if (p==='k4_epi') return {t:'Heute nicht. Heute ist Neujahr.',tg:'Heute bleibe ich.'};
  if (id==='heim' && p==='k4_d1' && !f(G,'k4.d1.bread')) return {t:'Mamas Arbeit. Einfach so hingehen, an ihren Arbeitsplatz? Ohne Grund?',tg:'Dort arbeitet seine Mutter. Ohne ihn gehe ich da nicht hin.'};
  if (alone && M.k4MalaAway(G)) return {tg:'…'};
  return null; }
function A_EVE(p){ return p==='k4_pro_n'?'Es ist Heiligabend. Ich bleibe bei meiner Familie.':'Es ist Abend. Mama hat gekocht.'; }
M.k4TravelWhy=travelWhy;
var travel0=M.canTravel;
M.canTravel=async function(A,L){ var G=A.G; if (!CH4(G)) return travel0?travel0(A,L):true;
  var w=travelWhy(G,L), alone=G.active==='mala';
  if (w){ if (alone) await A.g(w.tg||'Nicht ohne ihn.'); else await A.m(w.t||'Nicht jetzt.'); return false; }
  // Silvesternacht: der Weg zum Heim (Nachttram, zu Fuß, oder Davor)
  if (G.phase==='k4_fin_n' && L.id==='heim' && !alone){ var opts=[{t:'(Mit der Nachttram.)',id:'tram',silent:true},{t:'(Zu Fuß.)',id:'walk',silent:true}];
    if (f(G,'k4.v.car')) opts.push({t:'(Davor anrufen.)',id:'davor',silent:true});
    var r=await A.choose(opts,{title:'Zum Bavariapark'})||'tram'; A.setFlag('k4.fin.ride',r);
    if (M.k4Ride) await M.k4Ride(A); else await A.narrate(r==='walk'?'Ich gehe. Über mir knallt der Himmel.':(r==='davor'?'Davor ist nach zwölf Minuten da. „Diesmal ist keiner zu spät.“':'Die Nachttram ist voll mit Leuten, die singen. Ich stehe an der Tür.'));
    return true; }
  if (alone && A.first('!k4.m.alone1')){ await A.g('Allein durch eine fremde Stadt.'); await A.wait(300); await A.g('Ohne Faden. Es fühlt sich an wie Fallen. Nur langsamer.'); }
  return true; };
// Mala in München: allein durch Ausgänge und über den Stadtplan (tags); nachts nur in Mamas Wohnung; fort von Donnerstagabend bis Freitagnacht
M.k4MalaAway=function(G){ G=G||M.GS; if (!G||!CH4(G)) return false; var p=G.phase; if (p==='k4_d5') return !f(G,'k4.d5.bridge'); if (p==='k4_d4_n') return f(G,'k4.d4.fight'); return false; };
M.malaFree=(function(prev){ return function(G,hs){ if (!CH4(G)) return prev?prev(G,hs):false; if (M.k4MalaAway(G)) return false; var p=G.phase;
  if (DAY4.indexOf(p)>=0) return true;
  var ex=hs&&hs.exit, to=(ex&&typeof ex==='object')?ex.to:null;
  if (NIGHT4.indexOf(p)>=0 && (to==='jschlaf'||to==='jwohnung'||to==='jhaus')) return true;
  return false; }; })(M.malaFree);
M.malaMayTravel=(function(prev){ return function(G){ if (!CH4(G)) return prev?prev(G):false; return DAY4.indexOf(G.phase)>=0 && !M.k4MalaAway(G); }; })(M.malaMayTravel);
// Geht Marko, während Mala anderswo ist, bleibt sie, wo sie ist. Ist sie bei ihm, kommt sie mit.
M.malaStays=(function(prev){ return function(G,from,to,o){ if (!CH4(G)) return prev?prev(G,from,to,o):false; return !!(G.malaOn && G.pos.mala.room && G.pos.mala.room!==from); }; })(M.malaStays);

// ---------------------------------------------------------------- Der Faden: in Kapitel 4 nur, wenn eine Szene ihn zeigt
M.k4Leash=function(G){ G=G||M.GS; return f(G,'k4.bond')?'bond':'none'; };
var lv0=M.malaLeashVec;
M.malaLeashVec=function(G,ma,mk){ if (!CH4(G)) return lv0?lv0(G,ma,mk):null; if (M.k4Leash(G)!=='bond') return false;
  if (mk && G.pos.marko.room===G.pos.mala.room) return {to:[mk.x,mk.y-26],bond:true}; return false; };

// ---------------------------------------------------------------- „Mala fragen“: nur noch für Malas eigene Geschichte (Lana), ohne Rüge
M.K4ASK=M.K4ASK||{};
M.k4AskOpt=function(A,key,label){ if (A.flag('k4.asked.'+key)) return null; if (!A.G.malaOn || !A.malaHere()) return null;
  return {t:label||'(Mala fragen.)',id:'ask_'+key,silent:true,go:async function(A){ A.setFlag('k4.asked.'+key); A.setFlag('k4.askCount',(A.flag('k4.askCount')||0)+1); if (M.K4ASK[key]) await M.K4ASK[key](A); else await A.g('Frag mich, wenn du es wissen willst. Nicht, wenn du es schon weißt.'); }}; };
M.k4Asked=function(A,key){ return !!A.flag('k4.asked.'+key); };

// ---------------------------------------------------------------- Malas Gespräche: in Kapitel 4 aus 97_k4_mala.js
var lk=M.lookAtMala, tk=M.talkToMala, mk2=M.malaToMarko, ml=M.malaLooksAtMarko;
M.lookAtMala=function(A){ if (CH4(A.G) && M.k4LookAtMala) return M.k4LookAtMala(A); return lk?lk(A):A.m('Mala.'); };
M.talkToMala=function(A){ if (CH4(A.G) && M.k4TalkToMala) return M.k4TalkToMala(A); return tk?tk(A):A.g('…'); };
M.malaToMarko=function(A){ if (CH4(A.G) && M.k4MalaToMarko) return M.k4MalaToMarko(A); return mk2?mk2(A):A.g('Er hört mich. Das reicht.'); };
M.malaLooksAtMarko=function(A){ if (CH4(A.G) && M.k4MalaLooksAtMarko) return M.k4MalaLooksAtMarko(A); return ml?ml(A):A.g('Er sieht müde aus.'); };

// ---------------------------------------------------------------- Ein Abschnitt endet erst nach seinen Pflichtschritten
function dayReady(G){ var p=G.phase;
  if (p==='k4_pro') return f(G,'k4.p.hansi')&&f(G,'k4.p.jasna');
  if (p==='k4_d1') return has(G,'s4_peppino')&&has(G,'g4_gerda')&&has(G,'z4_stiefel');
  if (p==='k4_d2') return has(G,'z4_ana2004')&&has(G,'s4_name')&&has(G,'g4_drei');
  if (p==='k4_d3') return f(G,'k4.s.crossed')&&f(G,'k4.g.decided')&&(M.k4Variant(G)==='yes'||f(G,'k4.e.sample2'));
  if (p==='k4_d4') return f(G,'k4.s.farewell')&&f(G,'k4.g.thermos');
  if (p==='k4_d5') return f(G,'k4.d5.ana')&&has(G,'z4_zweistaedte');
  if (p==='k4_d5_n') return f(G,'k4.d5.bridge');
  if (p==='k4_fin_a') return f(G,'k4.fin.gone');
  if (p==='k4_fin_n') return f(G,'k4.fin.done');
  if (p==='k4_epi') return f(G,'k4.e.done');
  return false; }   // Nächte (Heiligabend, Christtag, Dienstag, Donnerstag) enden im Bett: M.k4Bed
M.k4DayReady=dayReady;
M.k4DayCheck=async function(A){ var G=A.G, R=M.E.room; if (!CH4(G)||G.ended||!R||R.noSave) return false; if (!dayReady(G)) return false;
  var p=G.phase;
  if (p==='k4_pro') return await M.k4StartEve(A), true;
  if (p==='k4_d1') return await M.k4StartD1Night(A), true;
  if (p==='k4_d2') return await M.k4StartD2Night(A), true;
  if (p==='k4_d3') return await M.k4StartD4(A), true;
  if (p==='k4_d4') return await M.k4StartD4Night(A), true;
  if (p==='k4_d5') return await M.k4StartD5Night(A), true;
  if (p==='k4_d5_n') return await M.k4StartFinale(A), true;
  if (p==='k4_fin_a') return await M.k4FinGone(A), true;
  if (p==='k4_fin_n') return await M.k4StartEpilogue(A), true;
  if (p==='k4_epi') return await M.endChapter4(A), true;
  return false; };
// was fehlt (ohne zu sagen, wo): für das Bett am Tag und für die Hinweise
function missing(G){ var p=G.phase;
  if (p==='k4_pro'){ if (!f(G,'k4.p.hansi')) return 'Am Busbahnhof war noch etwas. Mein Kopf weiß es besser als ich.'; return f(G,'k4.p.coffee')?'Erst Mama. Sie kommt um zwei.':'Erst Mama. Sie kommt um zwei. Bis dahin könnte ich Kaffee kochen, in Großmutters Džezva. Mama soll sie auf dem Herd sehen.'; }
  if (p==='k4_d1'){ if (!has(G,'z4_stiefel')) return 'Ana wollte heute mit den Kindern raus. Mit uns.'; if (!has(G,'s4_peppino')) return 'Mein Kopf pocht. Irgendwo in der Stadt wartet einer.'; if (!has(G,'g4_gerda')) return 'Mama ist bei der Arbeit. Und ich habe den Tag noch nicht zu Ende gedacht.'; }
  if (p==='k4_d2'){ if (!has(G,'z4_ana2004')) return 'Ana. Ich muss mit Ana reden. Nicht am Telefon.'; if (!has(G,'s4_name')) return 'Sepp hat einen Namen. Ich habe ihn noch nicht.'; if (!has(G,'g4_drei')) return 'Und um drei geht im Heim ein alter Mann zum Aufzug. Warum, weiß ich nicht.'; }
  if (p==='k4_d3'){ if (!f(G,'k4.s.crossed')) return 'Sepp wartet noch auf seinen Brief.'; if (!f(G,'k4.g.decided')) return 'Gerda kommt jeden Tag um drei. Noch.'; if (M.k4Variant(G)==='no' && !f(G,'k4.e.sample2')) return 'Die Probenkarte von Frau Kolar. Heute.'; }
  if (p==='k4_d4'){ if (!f(G,'k4.s.farewell')) return 'Heute ist Donnerstag. Sepps Donnerstag.'; if (!f(G,'k4.g.thermos')) return 'Um drei, im Heim. Heute zum letzten Mal.'; }
  if (p==='k4_d5'){ if (!f(G,'k4.d5.ana')) return 'Ana hat geschrieben: „Komm vorbei.“'; if (!has(G,'z4_zweistaedte')) return 'Ein Satz. Zwei Städte. Ich muss ihn einmal ganz zu Ende denken.'; }
  return null; }
M.k4Missing=missing;
// Freitag: wer Mala in der Stadt sucht, bekommt nach dem zweiten leeren Ort einen Fingerzeig aufs Nachdenken (Blindtest K4 D)
M.k4D5Search=async function(A){ var G=A.G; if (G.phase!=='k4_d5' || has(G,'z4_zweistaedte')) return; G.flags['k4.d5.searched']=(G.flags['k4.d5.searched']||0)+1;
  if (G.flags['k4.d5.searched']>=2 && A.first('k4d5think')){ await A.wait(500); await A.m('Ich suche sie in der Stadt. Aber sie ist nicht in der Stadt verschwunden. Sie ist gegangen, als wir uns gestritten haben.'); await A.m('Ich muss den Satz zu Ende denken, den alle über Papa sagen. Im Notizbuch, nicht auf der Straße.'); } };
// die Couch in Mamas Wohnung (S1 ruft es auf)
M.k4Bed=async function(A){ var G=A.G, p=G.phase;
  if (p==='k4_pro_n'){ if (f(G,'k4.p.eve')&&f(G,'k4.p.talk1')) return M.k4StartD1(A); return A.m(f(G,'k4.p.eve')?'Noch nicht. Mala steht am Fenster und sieht mich an, als wollte sie etwas fragen.':'Erst Heiligabend.'); }
  if (p==='k4_d1_n'){ if (f(G,'k4.d1.dzezva')&&f(G,'k4.d1.box')) return M.k4StartD2(A); if (!f(G,'k4.d1.dzezva')) return A.m('Mama sitzt noch in der Küche. Ich gehe nicht schlafen, solange sie da sitzt.');
    return A.m('Ich bin müde. Aber Mala geht noch durch die Wohnung. Ich höre sie nicht, ich weiß es nur.'); }
  if (p==='k4_d2_n'){ if (has(G,'z4_ankunft')) return M.k4StartD3(A); return A.m('Mama ist noch wach. Der Aushang liegt auf dem Tisch.'); }
  if (p==='k4_d4_n'){ if (f(G,'k4.d4.fight')) return M.k4StartD5(A); return A.m('Nicht jetzt.'); }
  if (DAY4.indexOf(p)>=0){ var w=missing(G); return A.m(w?A.cycle('k4bedday',['Am hellen Tag? ','Jetzt schlafen? '])+w:'Noch nicht. Es ist hell draußen.'); }
  return A.m('Nicht jetzt.'); };

// ---------------------------------------------------------------- Übergänge
function standOf(room,key){ var a=M.ART[room]; return (a&&a.stands&&a.stands[key])||(a&&a.start)||[160,124,'R']; }
// Marko (und Mala, wenn sie da ist) an einen Ort bringen: auch wenn gerade Mala in einem anderen Raum die Aktive ist
async function bring(A,room,o){ var G=A.G; o=o||{}; if (G.active==='mala'){ G.active='marko'; if (M.setGhostAudio) M.setGhostAudio(false); }
  var st=o.at||((M.ART[room]&&M.ART[room].start)||[160,124,'R']);
  if (G.malaOn) G.pos.mala={room:room,x:st[0]-16,y:st[1]-2,f:st[2]||'R'};
  await A.goto(room,{x:st[0],y:st[1],f:st[2]||'R',noEnter:!o.enter});
  if (G.malaOn && !o.noMala) A.malaJoin({fadeIn:false}); }
M.k4Bring=bring;
async function wake(A,phase){ A.phase(phase); await bring(A,'jwohnung',{at:standOf('jwohnung','sofa')}); A.save(); if (M.k4Wake) await M.k4Wake(A,phase); }
M.k4StartEve=async function(A){ if (A.flag('k4.eve.started')) return; A.setFlag('k4.eve.started'); await A.m('Ana wartet.'); await A.fade(8,900);
  await card(A,'','Heiligabend','Samstag, 24. Dezember · Abend',3600);
  A.phase('k4_pro_n'); A.unlock('giesing'); await bring(A,'ana'); A.music('k4_ana'); A.save();
  if (M.k4Eve) await M.k4Eve(A); else { A.setFlag('k4.p.eve'); A.setFlag('k4.p.talk1'); A.note('r4_kopf',true); await bring(A,'jwohnung',{at:standOf('jwohnung','sofa')}); } };
M.k4StartD1=async function(A){ if (A.flag('k4.d1.started')) return; A.setFlag('k4.d1.started'); await A.fade(8,900);
  await card(A,'Erster Tag','Christtag','Sonntag, 25. Dezember · klar'); await wake(A,'k4_d1'); };
M.k4StartD1Night=async function(A){ if (A.flag('k4.d1n.started')) return; A.setFlag('k4.d1n.started'); await A.m('Es wird früh dunkel. Mama ist vom Frühdienst zurück. Für ein paar Stunden.'); await A.fade(8,900);
  await card(A,'','Christtag · Abend','Sonntag · Mamas Küche',3400);
  A.phase('k4_d1_n'); await bring(A,'jwohnung',{at:standOf('jwohnung','table')}); A.music('k4_wohnung'); A.save();
  if (M.k4Dzezva) await M.k4Dzezva(A); };
M.k4StartD2=async function(A){ if (A.flag('k4.d2.started')) return; A.setFlag('k4.d2.started'); await A.fade(8,900);
  await card(A,'','Zweiter Feiertag','Montag, 26. Dezember',5600,'Schneeregen, Reste, Fernsehen. Mama schläft nach dem Nachtdienst. Ana schreibt nicht. Mala sitzt am Fenster und zählt nichts.');
  await card(A,'Zweiter Tag','Der Anruf','Dienstag, 27. Dezember · Tauwetter'); A.phase('k4_d2'); await bring(A,'jwohnung',{at:standOf('jwohnung','sofa')}); A.save();
  if (M.k4KolarCall) await M.k4KolarCall(A); else { A.setFlag('k4.d2.kolar'); A.note('z4_kolar'); A.note('z4_kode'); } };
M.k4StartD2Night=async function(A){ if (A.flag('k4.d2n.started')) return; A.setFlag('k4.d2n.started'); await A.m('Für heute reicht es.'); await A.fade(8,900);
  await card(A,'','Dienstag · Abend','Mamas Küche',3400);
  A.phase('k4_d2_n'); await bring(A,'jwohnung',{at:standOf('jwohnung','table')}); A.music('k4_wohnung'); A.save();
  if (M.k4JasnaNotice) await M.k4JasnaNotice(A); else A.note('z4_ankunft'); };
M.k4StartD3=async function(A){ if (A.flag('k4.d3.started')) return; A.setFlag('k4.d3.started'); await A.fade(8,900);
  await card(A,'Dritter Tag','Namen','Mittwoch, 28. Dezember · Schneefall'); await wake(A,'k4_d3'); };
M.k4StartD4=async function(A){ if (A.flag('k4.d4.started')) return; A.setFlag('k4.d4.started'); await A.m('Morgen ist Donnerstag.'); await A.fade(8,1000);
  await card(A,'Vierter Tag','Abschiede','Donnerstag, 29. Dezember · klar'); await wake(A,'k4_d4'); };
M.k4StartD4Night=async function(A){ if (A.flag('k4.d4n.started')) return; A.setFlag('k4.d4n.started'); await A.fade(8,900);
  await card(A,'','Donnerstag · Abend','Mamas Küche',3400);
  A.phase('k4_d4_n'); await bring(A,'jwohnung',{at:standOf('jwohnung','table')}); A.music('k4_wohnung'); A.save();
  if (M.k4Fight) await M.k4Fight(A); else A.setFlag('k4.d4.fight'); };
M.k4StartD5=async function(A){ if (A.flag('k4.d5.started')) return; A.setFlag('k4.d5.started'); await A.fade(8,1000);
  await card(A,'Fünfter Tag','Ohne Mala','Freitag, 30. Dezember · Nebel');
  A.G.malaOn=false; A.G.active='marko'; await wake(A,'k4_d5'); };
M.k4StartD5Night=async function(A){ if (A.flag('k4.d5n.started')) return; A.setFlag('k4.d5n.started'); await A.fade(8,1000);
  await card(A,'','Freitag · Nacht','Die Hackerbrücke',3600);
  A.phase('k4_d5_n'); var G=A.G; G.malaOn=false; await bring(A,'hacker',{at:standOf('hacker','railing')}); A.music('k4_bruecke');
  var mr=railPos(); G.malaOn=true; G.pos.mala={room:'hacker',x:mr[0],y:mr[1],f:mr[2]||'L'}; A.malaJoin({x:mr[0],y:mr[1],f:mr[2]||'L',fadeIn:true}); A.save();
  if (M.k4Bridge) await M.k4Bridge(A); else { A.note('z4_dabei'); A.setFlag('k4.d5.bridge'); } };
M.k4StartFinale=async function(A){ if (A.flag('k4.fin.started')) return; A.setFlag('k4.fin.started'); await A.fade(8,1200);
  await card(A,'Finale','Silvester','Samstag, 31. Dezember · Abend',4800);
  A.phase('k4_fin_a'); A.G.malaOn=true; await bring(A,'ana'); A.music('k4_silvester'); A.save();
  if (M.k4SilvesterEve) await M.k4SilvesterEve(A); else A.setFlag('k4.fin.gone'); };
// 23:15, Jasna ist fort: kein Bildwechsel, nur die Phase (S1 setzt k4.fin.gone in der Szene)
M.k4FinGone=async function(A){ if (A.G.phase!=='k4_fin_a') return; A.phase('k4_fin_n'); A.save(); };
// feste Zwischenstände in der Silvesternacht (S1)
M.k4Checkpoint=async function(A,n){ A.setFlag('k4.fin.cp',n); A.save(); };
M.k4StartEpilogue=async function(A){ if (A.flag('k4.epi.started')) return; A.setFlag('k4.epi.started'); await A.fade(8,1400);
  await card(A,'Epilog','Neujahr','Sonntag, 1. Januar 2012 · Vormittag',5000);
  A.phase('k4_epi'); A.G.malaOn=true; await bring(A,'jwohnung',{at:standOf('jwohnung','table')}); A.music('k4_epi'); A.save();
  if (M.k4Epilogue) await M.k4Epilogue(A); else A.setFlag('k4.e.done'); };

// ---------------------------------------------------------------- Laden mitten im Kapitel: unterbrochene Wechsel nachholen
M.PENDING_X=M.PENDING_X||[];
[ {from:'k4_pro', guard:'k4.eve.started'}, {from:'k4_pro_n', guard:'k4.d1.started'}, {from:'k4_d1', guard:'k4.d1n.started'}, {from:'k4_d1_n', guard:'k4.d2.started'},
  {from:'k4_d2', guard:'k4.d2n.started'}, {from:'k4_d2_n', guard:'k4.d3.started'}, {from:'k4_d3', guard:'k4.d4.started'}, {from:'k4_d4', guard:'k4.d4n.started'},
  {from:'k4_d4_n', guard:'k4.d5.started'}, {from:'k4_d5', guard:'k4.d5n.started'},
  {from:'k4_d5_n', guard:'k4.fin.started', when:function(G){ return !G.flags['k4.d5.bridge']; }, run:function(A){ return M.k4BridgeLoad(A); }},
  {from:'k4_fin_a', when:function(G){ return !G.flags['k4.fin.gone']; }, run:function(A){ return M.k4FinALoad(A); }},
  {from:'k4_fin_n', guard:'k4.epi.started', when:function(){ return true; }, run:function(A){ return M.k4FinLoad(A); }} ].forEach(function(r){ M.PENDING_X.push(r); });
// nach dem Laden auf der Brücke: Mala sitzt wieder auf dem Geländer, das Gespräch beginnt neu (S1: M.k4BridgeResume, sonst M.k4Bridge)
function railPos(){ var a=M.ART.hacker, p=a&&a.actorPos; return (p&&(p.mala_rail||p.mala))||[200,120,'L']; }
M.k4BridgeLoad=async function(A){ var G=A.G; if (!G.malaOn){ var mr=railPos(); A.malaJoin({x:mr[0],y:mr[1],f:mr[2]||'L',fadeIn:false}); }
  if (M.k4BridgeResume) return M.k4BridgeResume(A); if (M.k4Bridge) return M.k4Bridge(A); };
M.k4FinALoad=async function(A){ if (M.k4FinAResume) return M.k4FinAResume(A); };
// nach dem Laden in der Silvesternacht: Spur neu, oder das Gespräch am letzten Zwischenstand fortsetzen (S1: M.k4FinResume)
M.k4FinLoad=async function(A){ if (A.flag('k4.fin.done')) return M.k4StartEpilogue(A); if (M.k4FinResume) return M.k4FinResume(A); };

// ---------------------------------------------------------------- Raumwechsel: Zähler, Freigaben aus dem Stand der Geschichte
function storyOpen(G){ if (!G.map) G.map={}; if (f(G,'k4.p.jasna')) G.map.giesing=true; if (f(G,'k4.d1.bread')) G.map.heim=true; if (f(G,'k4.s.wimmer')) G.map.friedhof=true; if (f(G,'k4.v.called')) G.map.moosach=true; }
M.MIGRATE.push(function(G){ if (CH4(G)) storyOpen(G); });
M.onRoomChange=(function(prev){ return function(G,id,from,o){ if (prev) prev(G,id,from,o); if (!CH4(G)) return; G.flags['k4.moves']=(G.flags['k4.moves']||0)+1; storyOpen(G); }; })(M.onRoomChange);

// ---------------------------------------------------------------- Reaktionen auf Schlüsse und andere ausstehende Szenen (laufen, sobald nichts anderes läuft)
// Wie in Kapitel 3: Die Warteschlange steht im Spielstand (Schalter k4.q); eine Reaktion verlässt sie erst, wenn sie fertig ist.
var Q=[], idleRun=false, idleAt=0, runTok=0; M.K4REACT=M.K4REACT||{};
function qSave(){ var G=M.GS; if (G && G.flags) G.flags['k4.q']=Q.slice(); }
M.k4Queue=function(k){ if (Q.indexOf(k)<0) Q.push(k); qSave(); };
M.k4ResetRun=function(){ idleRun=false; runTok++; var G=M.GS; Q=(G && G.flags && Array.isArray(G.flags['k4.q']))?G.flags['k4.q'].slice():[]; };
M.RESET_HOOKS=M.RESET_HOOKS||[]; M.RESET_HOOKS.push(M.k4ResetRun);
function here(A){ return A.G.malaOn && A.malaHere(); }
var REACT={
  'ded:s4_tarnung':async function(A){ await A.m('Bairisch für die anderen. Italienisch für sich.'); if (here(A) && A.G.active==='marko'){ await A.wait(300); await A.g('Wie du. Deutsch für die Leute. Und nachts zählst du auf Bosnisch.'); } },
  'ded:s4_derselbe':async function(A){ await A.m('Eine Nummer ist noch kein Name.'); },
  'ded:s4_name':async function(A){ await A.m('Giuseppe Ruggiero. Seit neunundvierzig Jahren hat ihn keiner so genannt.'); },
  'ded:s4_wusste':async function(A){ if (here(A)){ await A.g('Sie hat gelogen, damit er nicht lügen muss.'); await A.m('Oder damit er weiterlügen kann.'); } else await A.m('Sie hat es gewusst. Und „Auch mir geht es gut“ geschrieben.'); },
  'ded:g4_beides':async function(A){ await A.m('Der Gong holt ihn. Ihre Hand hält ihn.'); if (here(A) && A.G.active==='marko'){ await A.wait(300); await A.g('Sie meint es gut. Das ist das Schlimmste daran.'); } },
  'ded:g4_worte':async function(A){ await A.m('Endstation. Feierabend. Das sind seine Wörter, nicht meine.'); },
  'ded:z4_vermisst':async function(A){ await A.m('Achtzehn Jahre Pantoffeln an der Tür. Für einen Vermissten.'); },
  'ded:z4_tot':async function(A){ if (A.G.active==='mala'){ await A.g('Die Jungenstimme in der Kiste.'); await A.wait(500); await A.g('Ich kenne sie. Ich habe sie lange nicht gehört. Sie war noch nicht tief.'); }
    else await A.m('In Sarajevo hieß es tot. Das wusste jeder, der dort war.'); },
  'ded:z4_zweistaedte':async function(A){ await A.m('Ich übersetze seit achtzehn Jahren.'); await A.wait(500); await A.m('Diesen einen Satz habe ich nie übersetzt.'); },
  'ded:z4_kurve':async function(A){ await A.m('Sie hat zurückgesehen. Bis zur Kurve.'); }
};
async function react(A,k){ var fn=M.K4REACT[k]||REACT[k]; if (fn) await fn(A); await M.k4DayCheck(A); }
var idle0=M.idleHook;
M.idleHook=function(A){ if (idle0) idle0(A); var G=A.G; if (!CH4(G)) return; if (idleRun && Date.now()-idleAt>90000) idleRun=false;   // Sicherung: eine abgebrochene Szene blockiert nicht für immer
  if (idleRun) return; var R=M.E.room; if (!R||R.noSave) return;
  if (!Q.length && !dayReady(G)) return;
  idleRun=true; idleAt=Date.now(); var tok=runTok;
  run(A,async function(A){ while (Q.length && tok===runTok){ var k=Q[0]; try{ await react(A,k); } catch(e){ console.error(e); } if (tok!==runTok) return; if (Q[0]===k) Q.shift(); qSave(); }
    if (tok===runTok && dayReady(G)) await M.k4DayCheck(A); }).then(function(){ if (tok===runTok) idleRun=false; },function(){ if (tok===runTok) idleRun=false; }); };

// ---------------------------------------------------------------- Ende des Kapitels
M.CREDITS4=['DIE STILLEN','Kapitel 4: München','','','Marko Vuković','Mala','','Hansi Kirchmaier, der auf seine Ablösung wartete','Giuseppe Ruggiero, Gepäckträger Nr. 17','Gerda Lechner, die jeden Tag um drei kam','',
  'Jasna Vuković','Ana · Tobias · Mia · Niko','Frau Huber und Mucki','Frau Wimmer · Signor Enzo · Herr Obermaier','Alois Lechner · Frau Ertl · Kevin · Herr Kraus','Wastl · Davor · Lena','Frau Kolar · Nada · Carmela','','',
  'Alle Bilder, Töne und Lieder','entstehen im Spiel selbst.','Die Orte sind München nachempfunden.','Das Haus am Bavariapark gibt es nicht.','Alle Figuren sind erfunden.','','',
  'Für alle, die nicht zurückgekommen sind,','und für alle, die es aussprechen mussten.','','','FORTSETZUNG','Kapitel 5: Sarajevo','','',''];
M.endChapter4=async function(A){ var G=A.G; if (G.ended) return; G.ended=true;
  try{ localStorage.setItem('mala.c4end',JSON.stringify({at:Date.now(),sample:G.flags['k4.c3.sample']!==false,sample2:!!G.flags['k4.e.sample2'],kurve:has(G,'z4_kurve'),slippers:!!G.flags['k4.e.slippers'],
      nada:!!G.flags['k4.e.nada'],fake:G.inv.indexOf('brief_falsch')>=0||!!G.flags['k4.s.fake'],davor:!!G.flags['k4.v.car'],consent2:G.flags['k4.e.consent2']||null,playMs:G.playMs||0}));
  }catch(e){} M.E.markChapterEnd(4);
  await card(A,'','Ende des vierten Kapitels','',5200,'Fortsetzung: Sarajevo');
  await A.fade(8,1400); M.E.fade=0; M.E.creditLines=M.CREDITS4; M.E.creditMusic='k4_end'; M.E.afterCredits=null; M.E.startCredits(); };
})(M);
