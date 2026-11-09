/* ===== 96_k5_story.js — Kapitel 5: Sarajevo („Angekommen“). Phasen, Kapitelstart mit Übernahme aus München und Mostar,
   Stadtplan (der Plan von Sarajevo aus Kapitel 2 mit neuen Orten), Reiseregeln, Tageswechsel (ein Abschnitt endet erst nach seinen
   Pflichtschritten), Reaktionen auf Schlüsse, Punkt ohne Rückkehr vor dem Samstag, Laden mitten im Kapitel, Ende und Abspann.
   Vorgaben: KAPITEL5_KONZEPT.md. Szenen: 97_k5_a.js (Donnerstag, Freitag), 97_k5_b.js (Begräbnis bis Montag), 97_k5_mala.js. ===== */
(function(M){
'use strict';
var P=M.P;
M.definePhases({
  k5_pro:  {chapter:5, cases:['j5','b5','f5'], tod:'day',  weather:'grey', case:'j5', title:'Prolog – Ankunft', short:'Sarajevo: Ankunft', when:'Donnerstag, 1. März 2012 · früh'},
  k5_d1:   {chapter:5, cases:['s5','b5','f5','j5'], tod:'day', weather:'grey', case:'s5', title:'Erster Tag – Donnerstag', short:'Sarajevo: Donnerstag', when:'Donnerstag, 1. März · Tauwetter'},
  k5_n1:   {chapter:5, cases:['b5','s5','f5','j5'], tod:'night', weather:'frost', case:'b5', title:'Donnerstag · Nacht', short:'Sarajevo: Donnerstagnacht', when:'Donnerstag · Nacht, Frost'},
  k5_d2:   {chapter:5, cases:['s5','b5','f5','j5'], tod:'day', weather:'calm', case:'s5', title:'Zweiter Tag – Freitag', short:'Sarajevo: Freitag', when:'Freitag, 2. März · kalt und klar'},
  k5_fun:  {chapter:5, cases:['s5','f5'], tod:'day', weather:'sun', case:'s5', title:'Lanas Begräbnis', short:'Sarajevo: Begräbnis', when:'Freitag, 2. März · 14 Uhr · Friedhof Bare'},
  k5_d2_n: {chapter:5, cases:['f5','j5'], tod:'night', weather:'calm', case:'f5', title:'Freitag · Abend', short:'Sarajevo: Freitagabend', when:'Freitag · Abend und Nacht'},
  k5_sat:  {chapter:5, cases:['f5'], tod:'day', weather:'sun', case:'f5', title:'Zehn nach elf', short:'Sarajevo: Samstag', when:'Samstag, 3. März 2012 · Lanas Geburtstag'},
  k5_epi:  {chapter:5, cases:['f5'], tod:'day', weather:'sun', case:'f5', title:'Epilog – Montag', short:'Sarajevo: Epilog', when:'Montag, 5. März 2012'}
});
function CH5(G){ return M.chapterOf(G||M.GS)===5; }
M.k5Is=CH5;
function f(G,k){ return !!G.flags[k]; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
async function card(A,k,t,time,ms,sub){ M.E.screen='card'; await A.card({kicker:k,title:t,sub:sub,time:time,ms:ms||4600}); }
async function run(A,fn){ var E=M.E, wb=E.busy; E.busy=true; try{ await fn(A); } catch(e){ console.error(e); } finally{ E.busy=wb; } }
M.k5Run=run;
var DAY5=['k5_pro','k5_d1','k5_d2'], NIGHT5=['k5_n1','k5_d2_n'];
M.K5_END_MUSIC='k3_end';
// Kostüme teilen ein Porträt (07_portraits.js), wie in Kapitel 4
['jasnaW','jasnaC'].forEach(function(k){ M.PORTRAIT_ALIAS[k]='jasna'; }); M.PORTRAIT_ALIAS.anaC='ana'; M.PORTRAIT_ALIAS.miaC='mia'; M.PORTRAIT_ALIAS.nikoC='niko';

// ---------------------------------------------------------------- Übernahme aus München (Kapitel 4) und Mostar (Kapitel 3)
var C4KEY='mala.c4end', C3KEY='mala.c3end';
function abc(v){ return ['a','b','c'].indexOf(v)>=0; }
M.k5CarryRead=function(){ var d4=null, d3=null; try{ d4=JSON.parse(localStorage.getItem(C4KEY)||'null'); }catch(e){ d4=null; } try{ d3=JSON.parse(localStorage.getItem(C3KEY)||'null'); }catch(e){ d3=null; }
  // Vorgaben ohne gespeichertes Kapitelende: wie Kapitel 4 (Zustimmung b, Versprechen a, Probe ja), Pantoffeln und Dose wie im Durchlauf der Musterlösung
  var c={ consent:'b', promise:'a', sample:true, sample2:false, kurve:false, slippers:true, nada:true, fake:false, davor:false, consent2:null, fromSave:false };
  if (d3 && typeof d3==='object'){ if (abc(d3.consent)) c.consent=d3.consent; if (abc(d3.promise)) c.promise=d3.promise; c.sample=d3.sample!==false; }
  if (d4 && typeof d4==='object'){ c.sample=d4.sample!==false; c.sample2=!!d4.sample2; c.kurve=!!d4.kurve; c.slippers=!!d4.slippers; c.nada=!!d4.nada; c.fake=!!d4.fake; c.davor=!!d4.davor;
    if (abc(d4.consent2)) c.consent2=d4.consent2; c.fromSave=true; }
  return c; };
Object.defineProperty(M,'k5Carry',{configurable:true,get:function(){ var G=M.GS||{flags:{}}, F=G.flags||{};
  return { consent:F['k5.c.consent']||'b', promise:F['k5.c.promise']||'a', sample:F['k5.c.sample']!==false, sample2:!!F['k5.c.sample2'], kurve:!!F['k5.c.kurve'], slippers:F['k5.c.slippers']!==false,
    nada:F['k5.c.nada']!==false, fake:!!F['k5.c.fake'], davor:!!F['k5.c.davor'], consent2:F['k5.c.consent2']||null, fromSave:!!F['k5.c.fromSave'] }; }});

// ---------------------------------------------------------------- Kapitelstart
M.startChapter5=async function(A){ var E=M.E; E.busy=true;
  try{ var c=M.k5CarryRead(), G=A.G; M.setPhase('k5_pro');
    G.flags['k5.c.consent']=c.consent; G.flags['k5.c.promise']=c.promise; G.flags['k5.c.sample']=c.sample; G.flags['k5.c.sample2']=c.sample2; G.flags['k5.c.kurve']=c.kurve;
    G.flags['k5.c.slippers']=c.slippers; G.flags['k5.c.nada']=c.nada; G.flags['k5.c.fake']=c.fake; G.flags['k5.c.davor']=c.davor; G.flags['k5.c.consent2']=c.consent2; G.flags['k5.c.fromSave']=c.fromSave;
    G.malaOn=false; G.active='marko'; var st=(M.ART.stanica5&&M.ART.stanica5.start)||[118,121,'R']; G.pos.marko={room:'stanica5',x:st[0],y:st[1],f:st[2]||'R'};
    ['dzezva','mobitel','photo_full'].forEach(function(i){ if (M.ITEMS[i] && !A.has(i)) A.give(i); });
    if (c.slippers && M.ITEMS.pantoffeln) A.give('pantoffeln'); if (c.nada && M.ITEMS.dose_voll) A.give('dose_voll');
    ['k5_c_muenchen','k5_c_mala'].forEach(function(id){ A.note(id,true); });
    ['nada','zlata','kolar','vlado','hajra','rade','damir','dragica','sehic','nedzad','jasna','ana','mia','niko','tobias','mala','jasnaW','jasnaC','anaC','miaC','nikoC'].forEach(function(id){ G.flags['met.'+id]=true; });
    G.flags['k5.moves']=0; G.map=G.map||{}; G.map.stanica=true; G.map.pansion=true;   // Busbahnhof und Hajras Pension kennt Marko aus Kapitel 2
    E.screen='card'; await A.card({kicker:'Kapitel 5',title:'Sarajevo',sub:'Prolog – Ankunft',time:'Donnerstag, 1. März 2012 · früh',ms:5200});
    A.music('k2_bus');
    var lines=['Fünfzehn Stunden Bus. Seit Ljubljana sagt Mama nichts. Bei Tarčin wird es hell, und sie sitzt am Fenster und sieht hinaus. Die ganze Zeit.'];
    lines.push(c.kurve?'Bis zur Kurve hat sie damals zurückgesehen, zweiundneunzig. Jetzt kommt sie von der anderen Seite.':'Sie sieht hin. Das ist neu.');
    lines.push('Mala ist seit Januar bei Nada. Acht Wochen. Ich habe geschlafen wie ein Stein, ohne Kopfweh.');
    lines.push({a:'Am Grab habe ich „Ja“ gesagt. Morgen frage ich mich, ob es richtig war.',b:'„Wenn es zu schwer wird, sagen wir es.“ Nach dem Begräbnis sagen wir es. So war es abgemacht.',c:'In München habe ich ihr noch einmal geantwortet. Nach dem Begräbnis antworte ich ein drittes Mal.'}[c.consent]);
    await A.memory({title:'Im Bus nach Sarajevo',tint:'memory',draw:M.mem&&M.mem.k2_bus,lines:lines});
    await A.goto('stanica5',{x:st[0],y:st[1],f:st[2]||'R',noEnter:true}); A.music('k2_sarajevo'); await A.wait(400);
    A.setFlag('k5.p.arrived');
    if (M.k5Arrive) await M.k5Arrive(A); else { await A.m('Sarajevo. Sieben Uhr. Tauwetter.'); }
  } finally { E.busy=false; } A.save(); };

// ---------------------------------------------------------------- Stadtplan Sarajevo (der Plan aus Kapitel 2, neue Orte dazu)
var POS5={ stanica:[116,63], neboder:[52,84], carsija:[248,82], pansion:[268,50], vratnik:[293,28], kazandziluk:[222,100], pivara:[262,116], institut:[196,40], bare:[160,24] };
var LOC5=[
  {id:'pansion',    name:'Kovači – Pension', to:'pansion5',     icon:'house'},
  {id:'vratnik',    name:'Vratnik',          to:'vratnik5',     icon:'fort'},
  {id:'carsija',    name:'Baščaršija',       to:'carsija5',     icon:'dome'},
  {id:'kazandziluk',name:'Kazandžiluk',      to:'kazandziluk5', icon:'shop'},
  {id:'neboder',    name:'Alipašino Polje',  to:'neboder5',     icon:'tower'},
  {id:'pivara',     name:'Brauerei',         to:'pivara',       icon:'well'},
  {id:'institut',   name:'Gerichtsmedizin',  to:'institut',     icon:'office'},
  {id:'bare',       name:'Friedhof Bare',    to:'bare',         icon:'stone'},
  {id:'stanica',    name:'Busbahnhof',       to:'stanica5',     icon:'bus'}
];
Object.defineProperty(M,'MAPLOCS5',{configurable:true,get:function(){ return LOC5.map(function(L){ var p=POS5[L.id]||[160,72]; return {id:L.id,name:L.name,to:L.to,icon:L.icon,x:p[0],y:p[1],at:null}; }); }});
// Symbole für die neuen Orte (in der Art der Symbole aus Kapitel 2): Kupferkanne, Brunnen, Amtshaus, Grabstein
function icon5(b,id,on){ var p=POS5[id], x=p[0], y=p[1], c=on?P.k1:P.e3, fl=on?P.r2:P.e4, lt=on?P.y4:c, i;
  if (id==='kazandziluk'){ b.ellipse(x,y+1,3,3,on?P.y2:fl); b.rect(x-1,y-4,3,2,c); b.vl(x+3,y-2,y+1,c); b.px(x+4,y-2,c); b.px(x-4,y,c); b.px(x-5,y-1,c); b.hl(x-4,x+4,y+4,c); b.px(x-1,y,lt); }
  else if (id==='pivara'){ b.rect(x-6,y-5,7,10,on?P.t2:fl); b.hl(x-6,x,y-5,c); b.vl(x-6,y-5,y+4,c); b.vl(x,y-5,y+4,c); b.rect(x-4,y-9,3,4,c); for (i=0;i<3;i++) b.px(x-5+i*2,y-2,on?P.y3:c);
    b.vl(x+3,y-3,y+1,c); b.hl(x+3,x+6,y-3,c); b.px(x+6,y-2,on?P.a5:c); b.px(x+6,y,on?P.a5:c); b.hl(x+2,x+7,y+4,c); }
  else if (id==='institut'){ b.rect(x-6,y-4,13,9,fl); b.hl(x-7,x+7,y-5,c); b.hl(x-6,x+6,y+4,c); for (i=-4;i<=4;i+=4){ b.rect(x+i-1,y-2,2,2,on?P.b4:c); b.rect(x+i-1,y+1,2,2,on?P.b4:c); } b.rect(x-1,y+1,2,3,c); }
  else if (id==='bare'){ b.rect(x-3,y-4,7,9,on?P.s5:fl); b.hl(x-2,x+2,y-5,c); b.px(x-3,y-4,c); b.px(x+3,y-4,c); b.vl(x-4,y-3,y+4,c); b.vl(x+4,y-3,y+4,c); b.hl(x-6,x+6,y+5,c); b.hl(x-1,x+1,y-1,on?P.s2:c);
    for (i=-6;i<=-5;i++) b.vl(x+i,y,y+4,on?P.g3:c); b.vl(x+6,y-1,y+4,on?P.g3:c); }
  else if (id==='stanica' && M.paintMap2) return; }
(function(){ var R=M.ROOMS.map; if (!R) return; var paint0=R.paint;
  R.paint=function(S,GS){ if (M.chapterOf(GS)!==5) return paint0(S,GS);
    var b=M.paintMap2?M.paintMap2(S,GS):new M.Buf(320,144,P.e3);
    ['kazandziluk','pivara','institut','bare'].forEach(function(id){ var v=M.mapIconVis?M.mapIconVis(id,GS):!!(GS.map&&GS.map[id]); if (v===null||v===undefined) return; icon5(b,id,!!v); });
    if (!M.mapNoNames && !M.paintMap2) M.MAPLOCS5.forEach(function(L){ if (!GS.map[L.id]) return; M.text(b,L.name,Math.max(4,L.x-(M.textWidth(L.name)>>1)),L.y+6,P.k1); });
    return b; }; })();
M.MAP_KNOW.institut={ch:5, know:function(G){ return M.chapterOf(G)===5 && has(G,'k5_c_muenchen'); }, why:'Die Gerichtsmedizin. Frau Kolar ruft an, wenn sie so weit sind. Vorher bin ich dort nur im Weg.'};
M.MAP_KNOW.bare={ch:5, know:function(G){ return M.chapterOf(G)===5 && has(G,'s5_tafel'); }, why:'Friedhof Bare. Am Freitag um zwei. Vorher gehe ich da nicht hin.'};

// ---------------------------------------------------------------- Reisen
function travelWhy(G,L){ var p=G.phase, id=L.id, alone=G.active==='mala';
  if (alone) return {tg:'Ohne ihn fahre ich nicht durch die Stadt. Nicht in dieser Woche.'};
  if (p==='k5_pro'){ if (!f(G,'k5.p.taxi')) return {t:'Erst ein Taxi. Mama steht mit den Koffern am Bahnsteig.'}; if (!f(G,'k5.p.hajra') && id!=='pansion') return {t:'Erst zu Hajra. Mama ist seit fünfzehn Stunden unterwegs.'}; return null; }
  if (p==='k5_n1'){ if (id==='pansion'||id==='pivara') return null; return {t:'Es ist Nacht. Die Stadt schläft, und ich sollte es auch.'}; }
  if (p==='k5_d2'){ if (id==='bare') return {t:'Um zwei. Vorher ist da nichts für uns.'}; return null; }
  if (p==='k5_fun') return {t:'Erst das Begräbnis.'};
  if (p==='k5_d2_n') return {t:'Heute Abend sind wir bei Nada. Alle.'};
  if (p==='k5_sat'){ if (!f(G,'k5.sat.tickets') && id==='neboder') return null; return {t:'Heute ist Samstag. Lanas Samstag. Ich weiß, wohin.'}; }
  if (p==='k5_epi'){ if (id==='pivara'||id==='vratnik') return null; return {t:'Heute ist Montag. Heute wird Papa begraben. Erst das Wasser.'}; }
  return null; }
M.k5TravelWhy=travelWhy;
var travel0=M.canTravel;
M.canTravel=async function(A,L){ var G=A.G; if (!CH5(G)) return travel0?travel0(A,L):true;
  var w=travelWhy(G,L), alone=G.active==='mala';
  if (w){ if (alone) await A.g(w.tg||'Nicht ohne ihn.'); else await A.m(w.t||'Nicht jetzt.'); return false; }
  return true; };
// Mala in Sarajevo: Sie geht mit Marko; wo sie bleibt, wenn er geht, entscheidet die Szene (Samstagmorgen ist sie bei Nada)
M.malaFree=(function(prev){ return function(G,hs){ if (!CH5(G)) return prev?prev(G,hs):false; return false; }; })(M.malaFree);
M.malaMayTravel=(function(prev){ return function(G){ if (!CH5(G)) return prev?prev(G):false; return false; }; })(M.malaMayTravel);
M.malaStays=(function(prev){ return function(G,from,to,o){ if (!CH5(G)) return prev?prev(G,from,to,o):false; return !!(G.malaOn && G.pos.mala.room && G.pos.mala.room!==from); }; })(M.malaStays);
// Der Faden: nur, wenn eine Szene ihn zeigt
var lv0=M.malaLeashVec;
M.malaLeashVec=function(G,ma,mk){ if (!CH5(G)) return lv0?lv0(G,ma,mk):null; if (!f(G,'k5.bond')) return false;
  if (mk && G.pos.marko.room===G.pos.mala.room) return {to:[mk.x,mk.y-26],bond:true}; return false; };

// ---------------------------------------------------------------- Malas Gespräche in Kapitel 5 (97_k5_mala.js)
var lk=M.lookAtMala, tk=M.talkToMala, mk2=M.malaToMarko, ml=M.malaLooksAtMarko;
M.lookAtMala=function(A){ if (CH5(A.G) && M.k5LookAtMala) return M.k5LookAtMala(A); return lk?lk(A):A.m('Mala.'); };
M.talkToMala=function(A){ if (CH5(A.G) && M.k5TalkToMala) return M.k5TalkToMala(A); return tk?tk(A):A.g('…'); };
M.malaToMarko=function(A){ if (CH5(A.G) && M.k5MalaToMarko) return M.k5MalaToMarko(A); return mk2?mk2(A):A.g('Er hört mich. Das reicht.'); };
M.malaLooksAtMarko=function(A){ if (CH5(A.G) && M.k5MalaLooksAtMarko) return M.k5MalaLooksAtMarko(A); return ml?ml(A):A.g('Er sieht ausgeschlafen aus.'); };

// ---------------------------------------------------------------- Ein Abschnitt endet erst nach seinen Pflichtschritten
function dayReady(G){ var p=G.phase;
  if (p==='k5_pro') return f(G,'k5.p.nada');
  if (p==='k5_d1') return has(G,'s5_frist')&&has(G,'b5_reihe');
  if (p==='k5_d2') return f(G,'k5.d2.inst')&&f(G,'k5.s.mounted')&&f(G,'k5.b.gone');
  if (p==='k5_fun') return f(G,'k5.fun.done');
  if (p==='k5_d2_n') return has(G,'f5_jasna')&&f(G,'k5.e.meal')&&!f(G,'k5.n2.started');   // danach beginnt der Spieler den Samstag selbst
  if (p==='k5_sat') return f(G,'k5.sat.done');
  if (p==='k5_epi') return f(G,'k5.e.done')||(f(G,'k5.e.water')&&!f(G,'k5.e.funeral'));
  return false; }   // Donnerstagnacht endet im Bett: M.k5Bed
M.k5DayReady=dayReady;
M.k5DayCheck=async function(A){ var G=A.G, R=M.E.room; if (!CH5(G)||G.ended||!R||R.noSave) return false; if (!dayReady(G)) return false;
  var p=G.phase;
  if (p==='k5_pro') return await M.k5StartD1(A), true;
  if (p==='k5_d1') return await M.k5StartEve(A), true;
  if (p==='k5_d2') return await M.k5StartFuneral(A), true;
  if (p==='k5_fun') return await M.k5StartMeal(A), true;
  if (p==='k5_d2_n'){ if (!f(G,'k5.n2.done')) return await M.k5StartTabija(A), true; return false; }   // der Samstag beginnt erst, wenn der Spieler ihn beginnt (Punkt ohne Rückkehr)
  if (p==='k5_sat') return await M.k5StartEpi(A), true;
  if (p==='k5_epi'){ if (!f(G,'k5.e.done')) return await M.k5StartZoran(A), true; return await M.endChapter5(A), true; }
  return false; };
// was fehlt (ohne zu sagen, wo): für das Bett und für die Hinweise
function missing(G){ var p=G.phase;
  if (p==='k5_pro'){ if (!f(G,'k5.p.hajra')) return 'Erst zu Hajra. Mama ist seit fünfzehn Stunden unterwegs.'; if (!has(G,'b5_hand')) return 'Mama will unter das Dach in Vratnik. Achtzehn Jahre hat sie es bezahlt.'; if (!f(G,'k5.p.nada')) return 'Haus 7. Mama will es sehen. Und Nada wartet.'; }
  if (p==='k5_d1'){ if (!has(G,'s5_frist')) return 'Nada hat bei Nedžad eine Tafel bestellt. Der Text fehlt noch.'; if (!has(G,'b5_reihe')) return 'Die Hand auf meinen Augen. Ein nasser Ärmel. Ich weiß, wo das war.'; }
  if (p==='k5_n1'){ if (!f(G,'k5.n1.atem')) return 'Ich bin müde. Das Fenster ist kalt.'; if (!has(G,'b5_hamdija')) return 'An der Brauerei zeigt er sich nicht. Er wartet auf etwas. Auf etwas Blaues.'; }
  if (p==='k5_d2'){ if (!f(G,'k5.d2.inst')) return 'Um neun bei Frau Kolar. Mama kommt mit.'; if (!f(G,'k5.b.gone')) return 'Der Mann an der Brauerei wartet noch.'; if (!f(G,'k5.s.mounted')) return 'Nada und Zlata. Eine Tafel und ein Brett. Bis zwei.'; }
  return null; }
M.k5Missing=missing;
// das Bett in der Pension (pansion5 ruft es auf)
M.k5Bed=async function(A){ var G=A.G, p=G.phase;
  if (p==='k5_n1'){ if (f(G,'k5.n1.atem')&&has(G,'b5_hamdija')) return M.k5StartD2(A); var w=missing(G); return A.m(w||'Noch nicht.'); }
  if (DAY5.indexOf(p)>=0){ var w2=missing(G); return A.m(w2?A.cycle('k5bedday',['Am hellen Tag? ','Jetzt schlafen? '])+w2:'Noch nicht. Es ist hell draußen.'); }
  return A.m('Nicht jetzt.'); };

// ---------------------------------------------------------------- Übergänge
function standOf(room,key){ var a=M.ART[room]; return (a&&a.stands&&a.stands[key])||(a&&a.start)||[160,124,'R']; }
M.k5StandOf=standOf;
async function bring(A,room,o){ var G=A.G; o=o||{}; if (G.active==='mala'){ G.active='marko'; if (M.setGhostAudio) M.setGhostAudio(false); }
  var st=o.at||((M.ART[room]&&M.ART[room].start)||[160,124,'R']);
  if (G.malaOn && !o.noMala) G.pos.mala={room:room,x:st[0]-16,y:st[1]-2,f:st[2]||'R'};
  await A.goto(room,{x:st[0],y:st[1],f:st[2]||'R',noEnter:!o.enter});
  if (G.malaOn && !o.noMala) A.malaJoin({fadeIn:false}); }
M.k5Bring=bring;
M.k5StartD1=async function(A){ if (A.flag('k5.d1.started')) return; A.setFlag('k5.d1.started'); await A.fade(8,900);
  await card(A,'Erster Tag','Donnerstag','Donnerstag, 1. März · Mittag, Tauwetter'); A.phase('k5_d1');
  ['carsija','kazandziluk','pivara'].forEach(function(l){ A.unlock(l); }); A.save();
  if (M.k5D1Start) await M.k5D1Start(A); };
M.k5StartEve=async function(A){ if (A.flag('k5.eve.started')) return; A.setFlag('k5.eve.started'); await A.m('Es wird dunkel. Zlata kommt heute Abend.'); await A.fade(8,900);
  await card(A,'','Donnerstag · Abend','Nadas Wohnung, neunter Stock',3600);
  A.phase('k5_n1'); A.G.malaOn=true; await bring(A,'stan5',{at:standOf('stan5','table')}); A.music('k2_noc'); A.save();
  if (M.k5Evening) await M.k5Evening(A); else { A.note('s5_brett'); A.setFlag('k5.n1.home'); } };
M.k5StartD2=async function(A){ if (A.flag('k5.d2.started')) return; A.setFlag('k5.d2.started'); await A.fade(8,1000);
  await card(A,'Zweiter Tag','Freitag','Freitag, 2. März · kalt und klar'); A.phase('k5_d2'); A.unlock('institut');
  await bring(A,'pansion5',{at:standOf('pansion5','bed')}); A.music('k2_sarajevo'); A.save();
  if (M.k5D2Start) await M.k5D2Start(A); };
M.k5StartFuneral=async function(A){ if (A.flag('k5.fun.started')) return; A.setFlag('k5.fun.started'); await A.m('Es ist halb zwei.'); await A.fade(8,1200);
  await card(A,'','Lanas Begräbnis','Freitag, 2. März · 14 Uhr · Friedhof Bare',4800);
  A.phase('k5_fun'); A.unlock('bare'); A.G.malaOn=true; await bring(A,'bare',{at:standOf('bare','grave')}); A.music('k3_grob'); A.save();
  if (M.k5Funeral) await M.k5Funeral(A); else A.setFlag('k5.fun.done'); };
M.k5StartMeal=async function(A){ if (A.flag('k5.meal.started')) return; A.setFlag('k5.meal.started'); await A.fade(8,1200);
  await card(A,'','Freitag · Abend','Bei Nada, neunter Stock',3800);
  A.phase('k5_d2_n'); A.G.malaOn=true; await bring(A,'stan5',{at:standOf('stan5','table')}); A.music('vecer'); A.save();
  if (M.k5Meal) await M.k5Meal(A); };
M.k5StartTabija=async function(A){ if (A.flag('k5.n2.started')) return; A.setFlag('k5.n2.started'); await A.m('Mama geht früh. Ana bringt die Kinder ins Bett. Mala sieht mich an und dann zur Tür.'); await A.fade(8,1200);
  await card(A,'','Freitag · Nacht','Die Žuta tabija',3600);
  A.G.malaOn=true; await bring(A,'vratnik5',{at:standOf('vratnik5','tabija')}); A.music('k2_noc'); A.save();
  if (M.k5Tabija) await M.k5Tabija(A); else { A.give('dose_lana'); A.setFlag('k5.n2.done'); } };
// Punkt ohne Rückkehr: Warnung, eigener Stand; der Spieler beginnt den Samstag selbst (vratnik5: „In den Samstag“)
M.k5BeginSaturday=async function(A){ var G=A.G; if (G.phase!=='k5_d2_n' || !f(G,'k5.n2.done') || f(G,'k5.sat.started')) return false;
  var c=await A.choose([{t:'(Den Samstag beginnen.)',id:'go',silent:true},{t:'(Noch einen Augenblick.)',id:'wait',silent:true}],{title:'Ab hier gibt es kein Zurück in die Tage davor'});
  if (c!=='go'){ await A.m('Noch ist es nicht hell.'); return false; }
  await M.k5StartSat(A); return true; };
M.k5StartSat=async function(A){ if (A.flag('k5.sat.started')) return; A.setFlag('k5.sat.started'); await A.fade(8,1400);
  await card(A,'Höhepunkt','Zehn nach elf','Samstag, 3. März 2012 · Lanas sechsunddreißigster Geburtstag',5200);
  A.phase('k5_sat'); var G=A.G; G.malaOn=true;
  // Mala ist seit dem Morgengrauen bei Nada; Marko frühstückt in der Pension
  var sm=standOf('stan5','table'); G.pos.mala={room:'stan5',x:sm[0]+20,y:sm[1],f:'L'};
  await bring(A,'pansion5',{at:standOf('pansion5','table'),noMala:true}); A.music('k2_sarajevo'); A.save();
  if (M.k5SatStart) await M.k5SatStart(A); };
M.k5StartEpi=async function(A){ if (A.flag('k5.epi.started')) return; A.setFlag('k5.epi.started'); await A.fade(8,1400);
  await card(A,'','Sonntag','Sonntag, 4. März · Regen',5200,'Zlata fährt mit Vlado nach Hause. Sie lässt Nada einen zweiten Ableger da, falls der erste nicht angeht.');
  await card(A,'Epilog','Montag','Montag, 5. März 2012 · Sonne',4800);
  A.phase('k5_epi'); A.G.malaOn=false; A.G.active='marko'; await bring(A,'pansion5',{at:standOf('pansion5','bed'),noMala:true}); A.music('k4_epi'); A.save();
  if (M.k5EpiStart) await M.k5EpiStart(A); };
M.k5StartZoran=async function(A){ if (A.flag('k5.e.funeral')) return; A.setFlag('k5.e.funeral'); await A.fade(8,1200);
  await card(A,'','Zorans Begräbnis','Montag, 5. März · 11 Uhr · Friedhof Bare',4600);
  await bring(A,'bare',{at:standOf('bare','grave2'),noMala:true}); A.music('k3_grob'); A.save();
  if (M.k5Zoran) await M.k5Zoran(A);
  await A.fade(8,1200); await card(A,'','Ružas Küche','Montag · Abend',3600);
  await bring(A,'kuca5',{at:[156,128,'L'],noMala:true}); A.music('k4_epi'); A.save();
  if (M.k5Final) await M.k5Final(A); };

// ---------------------------------------------------------------- Laden mitten im Kapitel: unterbrochene Wechsel nachholen
M.PENDING_X=M.PENDING_X||[];
[ {from:'k5_pro', guard:'k5.d1.started'}, {from:'k5_d1', guard:'k5.eve.started'},
  {from:'k5_n1', when:function(G){ return !G.flags['k5.n1.home']; }, run:function(A){ return M.k5EveLoad?M.k5EveLoad(A):null; }},
  {from:'k5_d2', guard:'k5.fun.started'},
  {from:'k5_fun', guard:'k5.meal.started', when:function(G){ return !G.flags['k5.fun.done']; }, run:function(A){ return M.k5Funeral?M.k5Funeral(A):null; }},
  {from:'k5_d2_n', when:function(G){ return G.flags['k5.n2.started'] && !G.flags['k5.n2.done']; }, run:function(A){ return M.k5Tabija?M.k5Tabija(A):null; }},
  {from:'k5_sat', when:function(G){ return !G.flags['k5.sat.gate']; }, run:function(A){ return M.k5SatLoad?M.k5SatLoad(A):null; }},
  {from:'k5_epi', when:function(G){ return G.flags['k5.e.funeral'] && !G.flags['k5.e.done']; }, run:function(A){ return M.k5FinalLoad?M.k5FinalLoad(A):null; }} ].forEach(function(r){ M.PENDING_X.push(r); });

// ---------------------------------------------------------------- Raumwechsel: Zähler, Freigaben aus dem Stand der Geschichte
function storyOpen(G){ if (!G.map) G.map={}; G.map.stanica=true; G.map.pansion=true; if (f(G,'k5.p.hajra')){ G.map.vratnik=true; } if (has(G,'b5_hand')) G.map.neboder=true;
  if (f(G,'k5.d1.started')){ G.map.carsija=true; G.map.kazandziluk=true; G.map.pivara=true; } if (f(G,'k5.d2.started')) G.map.institut=true; if (f(G,'k5.fun.started')) G.map.bare=true; }
M.MIGRATE.push(function(G){ if (CH5(G)) storyOpen(G); });
M.onRoomChange=(function(prev){ return function(G,id,from,o){ if (prev) prev(G,id,from,o); if (!CH5(G)) return; G.flags['k5.moves']=(G.flags['k5.moves']||0)+1; storyOpen(G); }; })(M.onRoomChange);

// ---------------------------------------------------------------- Reaktionen auf Schlüsse und andere ausstehende Szenen (laufen, sobald nichts anderes läuft)
var Q=[], idleRun=false, idleAt=0, runTok=0; M.K5REACT=M.K5REACT||{};
function qSave(){ var G=M.GS; if (G && G.flags) G.flags['k5.q']=Q.slice(); }
M.k5Queue=function(k){ if (Q.indexOf(k)<0) Q.push(k); qSave(); };
M.k5ResetRun=function(){ idleRun=false; runTok++; var G=M.GS; Q=(G && G.flags && Array.isArray(G.flags['k5.q']))?G.flags['k5.q'].slice():[]; };
M.RESET_HOOKS=M.RESET_HOOKS||[]; M.RESET_HOOKS.push(M.k5ResetRun);
function here(A){ return A.G.malaOn && A.malaHere(); }
var REACT={
  'ded:s5_beide':async function(A){ await A.m('Beide haben ihren Namen geschrieben, damit man sie findet.'); if (here(A) && A.G.active==='marko'){ await A.wait(300); await A.g('Dann hatten sie beide recht. Das ist schlimmer.'); } },
  'ded:s5_teile':async function(A){ await A.m('Oben die Geburt, unten der Tod. Zwei Hälften.'); if (here(A)){ await A.wait(300); await A.g('…'); } },
  'ded:b5_wer':async function(A){ await A.m('Der vorn die Hand hob, hat mich festgehalten. Und danach meine Kanister gefüllt.'); },
  'ded:f5_wem':async function(A){ if (here(A)){ await A.g('…Du hast recht. Mama war nie samstags dabei.'); } else await A.m('Die Fahrscheine gehören zu den Samstagen. Nicht zu Nada.'); },
  'ded:f5_jasna':async function(A){ await A.m('Zwei Plätze. Am Fenster und daneben.'); if (here(A)){ await A.wait(400); await A.g('Ja. So.'); await A.wait(300); await A.g('Sie hat „Ich setze mich ans Fenster“ gesagt. Das war dein Platz.'); } }
};
async function react(A,k){ var fn=M.K5REACT[k]||REACT[k]; if (fn) await fn(A); await M.k5DayCheck(A); }
var idle0=M.idleHook;
M.idleHook=function(A){ if (idle0) idle0(A); var G=A.G; if (!CH5(G)) return; if (idleRun && Date.now()-idleAt>90000) idleRun=false;
  if (idleRun) return; var R=M.E.room; if (!R||R.noSave) return;
  if (!Q.length && !dayReady(G)) return;
  idleRun=true; idleAt=Date.now(); var tok=runTok;
  run(A,async function(A){ while (Q.length && tok===runTok){ var k=Q[0]; try{ await react(A,k); } catch(e){ console.error(e); } if (tok!==runTok) return; if (Q[0]===k) Q.shift(); qSave(); }
    if (tok===runTok && dayReady(G)) await M.k5DayCheck(A); }).then(function(){ if (tok===runTok) idleRun=false; },function(){ if (tok===runTok) idleRun=false; }); };

// ---------------------------------------------------------------- Ende des Kapitels und der Geschichte
M.CREDITS5=['MALA','Kapitel 5: Sarajevo','','','Marko Vuković','Lana Delić, die man Mala nannte','','Hamdija Selimović, der am Hahn die Hand hob','',
  'Jasna Vuković · Nada Delić','Zlata · Vlado','Ana · Mia · Niko','Hajra Mešić und Mačak','Rade · Damir · Nedžad','Šehić · Dragica','Frau Kolar','','',
  'Alle Bilder, Töne und Lieder','entstehen im Spiel selbst.','Die Orte sind Sarajevo nachempfunden.','Alle Figuren sind erfunden.','','',
  'Für alle, die angekommen sind,','und für alle, die sie gehen ließen.','','','','ENDE','','',''];
M.endChapter5=async function(A){ var G=A.G; if (G.ended) return; G.ended=true;
  try{ localStorage.setItem('mala.c5end',JSON.stringify({at:Date.now(),answer:G.flags['k5.n2.answer']||null,cap:G.flags['k5.sat.cap']||null,silent:G.flags['k5.sat.silent']!==false,
      rade:!!G.flags['k5.d1.radeHeft'],damir:!!G.flags['k5.d2.damir'],flat7:!!G.flags['k5.sat.flat'],playMs:G.playMs||0})); }catch(e){}
  M.E.markChapterEnd(5);
  await card(A,'','Ende','',5200,'Diese Geschichte ist zu Ende erzählt.');
  await A.fade(8,1400); M.E.fade=0; M.E.creditLines=M.CREDITS5; M.E.creditMusic=M.K5_END_MUSIC; M.E.afterCredits=null; M.E.startCredits(); };
})(M);
