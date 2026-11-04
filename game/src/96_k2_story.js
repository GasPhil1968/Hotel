/* ===== 96_k2_story.js — Kapitel 2: Sarajevo. Phasen, Kapitelstart, Übernahme aus Split, Stadtplan, Übergänge, Abspann ===== */
(function(M){
'use strict';
var P=M.P;
M.definePhases({
  k2_pro:   {chapter:2, cases:['p2','m2'], tod:'dusk', weather:'fog',  case:'p2', title:'Prolog – Die Linie Drei', short:'Sarajevo: Prolog', when:'Samstag, 19. November 2011 · Nachmittag'},
  k2_pro_n: {chapter:2, cases:['p2','m2','s1'], tod:'night',weather:'fog',  case:'p2', title:'Prolog – Die Linie Drei', short:'Sarajevo: Prolog, Nacht', when:'Samstag · Nacht'},
  k2_s1:    {chapter:2, cases:['s1','m2'], tod:'day',  weather:'fog',  case:'s1', title:'Erster Fall – Sieben am Turm', short:'Sarajevo: Erster Fall', when:'Sonntag, 20. November · Tag'},
  k2_s1_n:  {chapter:2, cases:['s1','m2'], tod:'night',weather:'calm', case:'s1', title:'Erster Fall – Sieben am Turm', short:'Sarajevo: Erster Fall, Nacht', when:'Sonntag · Nacht'},
  k2_s2:    {chapter:2, cases:['s2','m2'], tod:'day',  weather:'rain', case:'s2', title:'Zweiter Fall – Die Leihfrist', short:'Sarajevo: Zweiter Fall', when:'Montag, 21. November · Regen'},
  k2_s2_n:  {chapter:2, cases:['s2','m2'], tod:'night',weather:'rain', case:'s2', title:'Zweiter Fall – Die Leihfrist', short:'Sarajevo: Zweiter Fall, Nacht', when:'Montag · Nacht'},
  k2_i:     {chapter:2, cases:['m2','s2'], tod:'night',weather:'calm', case:'m2', title:'Zwischenspiel – Die Gelbe Bastei', short:'Sarajevo: Zwischenspiel', when:'Montag · spät'},
  k2_s3:    {chapter:2, cases:['s3','m2'], tod:'day',  weather:'fog',  case:'s3', title:'Dritter Fall – Das verschlossene Zimmer', short:'Sarajevo: Dritter Fall', when:'Dienstag, 22. November · Nebel'},
  k2_s3_n:  {chapter:2, cases:['s3','m2'], tod:'night',weather:'fog',  case:'s3', title:'Dritter Fall – Das verschlossene Zimmer', short:'Sarajevo: Dritter Fall, Nacht', when:'Dienstag · Nacht'},
  k2_fin:   {chapter:2, cases:['f2','m2','s3'], tod:'day',  weather:'calm', case:'f2', title:'Finale – Malas Spur', short:'Sarajevo: Finale', when:'Mittwoch, 23. November · klar und kalt'},
  k2_fin_n: {chapter:2, cases:['f2','m2'], tod:'night',weather:'snow', case:'f2', title:'Finale – Malas Spur', short:'Sarajevo: Finale, Nacht', when:'Mittwoch · Nacht, erster Schnee'},
  k2_epi:   {chapter:2, cases:['f2','m2'], tod:'dawn', weather:'snow', case:'f2', title:'Epilog – Der erste Schnee', short:'Sarajevo: Epilog', when:'Donnerstag, 24. November · Morgen'}
});
M.chapterOf=function(GS){ var ph=M.PHASES[(GS||M.GS).phase]||{}; return ph.chapter||1; };
M.k2In=function(G,list){ return list.indexOf(G.phase)>=0; };

// ---------------------------------------------------------------- Übernahme aus Split
// Am Ende von Kapitel 1 werden die Entscheidungen und Malas Notizen gemerkt. Kapitel 2 liest sie beim Start.
var C1KEY='mala.c1end';
M.storeC1End=function(G){ try{ var d={ at:Date.now(), answer:G.flags['i1.answer'], sarajevo:G.flags['i1.sarajevo'], notes:G.notes.filter(function(n){ return /^m_/.test(n); }), playMs:G.playMs||0 };
  localStorage.setItem(C1KEY,JSON.stringify(d)); }catch(e){} };
M.ch2Unlocked=function(){ try{ return !!localStorage.getItem(C1KEY); }catch(e){ return false; } };
M.k2Carry=function(){ var d=null; try{ d=JSON.parse(localStorage.getItem(C1KEY)||'null'); }catch(e){ d=null; }
  var def={ answer:1, sarajevo:2, notes:['m_register','m_journal','m_chalk','m_tin','m_waited','m_bells','m_31','m_sarajevo'], fromSave:false };
  if (!d) return def;
  return { answer:(d.answer===0||d.answer===1||d.answer===2)?d.answer:def.answer, sarajevo:(d.sarajevo===0||d.sarajevo===1||d.sarajevo===2)?d.sarajevo:def.sarajevo, notes:Array.isArray(d.notes)?d.notes:def.notes, fromSave:true }; };
var CARRY={ m_register:'m2_split_register', m_journal:'m2_split_journal', m_chalk:'m2_split_chalk', m_tin:'m2_split_tin', m_waited:'m2_split_waited', m_bells:'m2_split_bells' };
function applyCarry(A,c){ var G=A.G; G.flags['k2.c1.answer']=c.answer; G.flags['k2.c1.sarajevo']=c.sarajevo; G.flags['k2.c1.fromSave']=!!c.fromSave;
  // das Register ist der Kern von Malas Spur: es kommt immer mit (wer Split nicht gespielt hat, bekommt es im Prolog erzählt)
  ['m_register','m_journal','m_chalk'].forEach(function(k){ if (c.notes.indexOf(k)<0) c.notes.push(k); });
  c.notes.forEach(function(k){ if (CARRY[k]) A.note(CARRY[k],true); }); }

// ---------------------------------------------------------------- Kapitelstart
M.startChapter2=async function(A){ var E=M.E; E.busy=true;
  try{ var c=M.k2Carry(); M.setPhase('k2_pro'); A.G.malaOn=false; A.G.pos.marko={room:'stanica',x:60,y:124,f:'R'}; applyCarry(A,c);
    ['dzezva','mobitel','olovka'].forEach(function(i){ if (!A.has(i)) A.give(i); }); A.unlock('stanica');
    E.screen='card'; await A.card({kicker:'Kapitel 2',title:'Sarajevo',sub:'Prolog – Die Linie Drei',time:'Samstag, 19. November 2011 · Nachmittag',ms:5200});
    A.music('k2_bus');
    await A.memory({title:'Im Bus',tint:'memory',draw:M.mem&&M.mem.k2_bus,lines:['Bei Mostar hält der Bus zwanzig Minuten. Mala steigt nicht aus. Sie sieht auf den Fluss hinunter, bis wir weiterfahren.',
      'Hinter Konjic kommt der Nebel. Die Berge rücken zusammen, als wollten sie die Straße festhalten.','Am Stadtrand steht ein Hochhaus neben dem anderen. Mala hat die Hand an der Scheibe.','Als der Bus in den Bahnhof einfährt, ist der Platz neben mir leer.']});
    await A.goto('stanica',{x:60,y:124,f:'R',noEnter:true}); A.music('k2_sarajevo'); await A.wait(500);
    await A.m('Mala?'); await A.wait(900); await A.m('…'); await A.wait(500);
    await A.m('Siebzehn Jahre. Und das Erste, was ich wiedersehe, ist ein Busbahnhof im Nebel.'); A.note('p2_mala_gone');
    await A.m('Die Straßenbahn hält da drüben. Die Eins fährt in die Altstadt. Das weiß ich noch.');
    if (!c.fromSave) await A.m('In Split stand in einem alten Register: „…ić, L., 17, Sarajevo.“ Zimmer 31. Und dahinter, bei „Abreise“, nichts.');
  } finally { E.busy=false; } A.save(); };

// ---------------------------------------------------------------- Stadtplan: derselbe Raum 'map', in Kapitel 2 mit Sarajevo
var POS=M.MAP2_POS||{ neboder:[38,92], stanica:[112,70], ferhadija:[196,84], obala:[232,100], carsija:[262,80], pansion:[270,58], vratnik:[290,40] };
M.MAPLOCS2=[
  {id:'neboder', name:'Alipašino Polje',  to:'neboder', icon:'tower'},
  {id:'stanica', name:'Busbahnhof',       to:'stanica', icon:'bus'},
  {id:'ferhadija',name:'Ferhadija',       to:'ferhadija',icon:'church'},
  {id:'obala',   name:'Miljacka',         to:'obala',   icon:'bridge'},
  {id:'carsija', name:'Baščaršija',       to:'carsija', icon:'dome'},
  {id:'pansion', name:'Kovači – Pension', to:'pansion', icon:'house'},
  {id:'vratnik', name:'Vratnik',          to:'vratnik', icon:'fort'}
].map(function(L){ var p=POS[L.id]||[160,72]; L.x=p[0]; L.y=p[1]; L.at=null; return L; });
(function(){ var R=M.ROOMS.map; if (!R) return; var paint0=R.paint;
  R.paint=function(S,GS){ if (M.chapterOf(GS)===2){ if (M.paintMap2) return M.paintMap2(S,GS); var b=new M.Buf(320,144,P.e3); M.text(b,'SARAJEVO',130,8,P.k1); M.MAPLOCS2.forEach(function(L){ if (!GS.map[L.id]) return; b.rect(L.x-3,L.y-3,7,7,P.r2); M.text(b,L.name,Math.max(4,L.x-(M.textWidth(L.name)>>1)),L.y+5,P.k1); }); return b; } return paint0(S,GS); };
  R.hotspots.forEach(function(h){ if (/^loc_/.test(h.id)){ var v0=h.vis; h.vis=function(S,GS){ return M.chapterOf(GS)!==2 && (!v0||v0(S,GS)); }; } });
  M.MAPLOCS2.forEach(function(L){ var h={id:'loc2_'+L.id,name:L.name,room:'map',r:[L.x-16,L.y-16,32,30],vis:function(S,GS){ return M.chapterOf(GS)===2 && !!GS.map[L.id]; },
    go:async function(A){ var ok=M.canTravel?await M.canTravel(A,L):true; if (!ok) return; await A.goto(L.to,{}); }};
    R.hotspots.splice(R.hotspots.length-1,0,h); R.byId[h.id]=h; });
  var scape0=R.scape; R.scape='map'; })();
M.defineScape('map2',{beds:['cityFar'],ev:[['tramBellFar',14,30,0.4,-0.8,0.8],['dog',30,60,0.25,-1,1]],step:'none'});
// Reisebeschränkungen in Kapitel 2 (in Kapitel 1 gilt die alte Regel)
var travel1=M.canTravel;
M.canTravel=async function(A,L){ if (M.chapterOf(A.G)!==2) return travel1?travel1(A,L):true; var p=A.G.phase, f=function(k){ return !!A.G.flags[k]; };
  if (p==='k2_pro' && !f('k2.p2.back') && L.id!=='carsija' && L.id!=='stanica'){ await A.m('Ohne Mala gehe ich nirgends hin. Eben war sie noch neben mir.'); return false; }
  if (p==='k2_pro_n' && L.id!=='kula' && L.id!=='pansion' && L.id!=='carsija'){ await A.m('Mitten in der Nacht? Die Stadt schläft. Nur das Lied von vorhin geht mir nicht aus dem Kopf.'); return false; }
  if (p==='k2_s3' && !f('k2.s3.called') && L.id!=='pansion'){ await A.m('Nicht, bevor ich mit Sanja gesprochen habe. Sonst verliere ich den Mut.'); return false; }
  if ((p==='k2_fin_n') && L.id!=='neboder'){ await A.g('Nicht dorthin. Heute Nacht fährt die Drei.'); return false; }
  if (p==='k2_epi' && L.id!=='stanica' && L.id!=='neboder'){ await A.m('Heute nicht mehr. Nada wartet, und der Bus fährt bald.'); return false; }
  return true; };

// ---------------------------------------------------------------- Mala: Gespräche (in Kapitel 2 aus 97_k2_mala.js)
var lk=M.lookAtMala, tk=M.talkToMala, mk=M.malaToMarko, ml=M.malaLooksAtMarko;
M.lookAtMala=function(A){ if (M.chapterOf(A.G)===2 && M.k2LookAtMala) return M.k2LookAtMala(A); return lk?lk(A):A.m('Mala.'); };
M.talkToMala=function(A){ if (M.chapterOf(A.G)===2 && M.k2TalkToMala) return M.k2TalkToMala(A); return tk?tk(A):A.g('…'); };
M.malaToMarko=function(A){ if (M.chapterOf(A.G)===2 && M.k2MalaToMarko) return M.k2MalaToMarko(A); return mk?mk(A):A.g('Er hört mich. Das reicht.'); };
M.malaLooksAtMarko=function(A){ if (M.chapterOf(A.G)===2 && M.k2MalaLooksAtMarko) return M.k2MalaLooksAtMarko(A); return ml?ml(A):A.g('Er sieht müde aus.'); };

// ---------------------------------------------------------------- Übergänge zwischen den Akten
async function card(A,k,t,time,ms){ M.E.screen='card'; await A.card({kicker:k,title:t,time:time,ms:ms||4600}); }
function clean(A,list){ list.forEach(function(i){ if (A.has(i)) A.take(i); }); }
M.k2Night0=async function(A){ if (A.flag('k2.pro.night')) return; A.setFlag('k2.pro.night'); await A.fade(8,900); await card(A,'','In der Nacht','Samstag · kurz vor elf',3400);
  A.phase('k2_pro_n'); A.unlock('carsija'); await A.goto('pansion',{noEnter:false}); A.save(); };
M.k2StartS1=async function(A){ if (A.flag('k2.s1.started')) return; A.setFlag('k2.s1.started'); await A.fade(8,900); await card(A,'Erster Fall','Sieben am Turm','Sonntag, 20. November · Tag');
  A.phase('k2_s1'); A.G.pos.marko={room:'pansion',x:200,y:122,f:'L'}; await A.goto('pansion',{noEnter:false}); A.save(); };
M.k2StartS1Night=async function(A){ if (A.flag('k2.s1.night')) return; A.setFlag('k2.s1.night'); await A.fade(8,900); await card(A,'','Die Nacht unter der Uhr','Sonntag · kurz vor elf',3600);
  A.phase('k2_s1_n'); await A.goto('kula',{noEnter:false}); A.save(); };
M.k2StartS2=async function(A){ if (A.flag('k2.s2.started')) return; A.setFlag('k2.s2.started'); await A.fade(8,900); await card(A,'Zweiter Fall','Die Leihfrist','Montag, 21. November · Regen');
  A.phase('k2_s2'); clean(A,['letters_tz','bracelet','lejla_letter','note_e']); A.unlock('ferhadija'); A.G.pos.marko={room:'pansion',x:200,y:122,f:'L'}; await A.goto('pansion',{noEnter:false}); A.save(); };
M.k2StartS2Night=async function(A){ if (A.flag('k2.s2.night')) return; A.setFlag('k2.s2.night'); await A.fade(8,900); await card(A,'','Nach sechs','Montag · Abend, Regen',3600);
  A.phase('k2_s2_n'); A.unlock('obala'); await A.goto('obala',{noEnter:false}); A.save(); };
M.k2StartInterlude=async function(A){ if (A.flag('k2.i.started')) return; A.setFlag('k2.i.started'); await A.fade(8,900); await card(A,'Zwischenspiel','Die Gelbe Bastei','Montag · spät');
  A.phase('k2_i'); clean(A,['pass','kurrent']); A.unlock('vratnik'); await A.goto('vratnik',{x:470,y:124,f:'R',noEnter:false}); A.save(); };
M.k2StartS3=async function(A){ if (A.flag('k2.s3.started')) return; A.setFlag('k2.s3.started'); await A.fade(8,900); await card(A,'Dritter Fall','Das verschlossene Zimmer','Dienstag, 22. November · Nebel');
  A.phase('k2_s3'); A.G.pos.marko={room:'pansion',x:200,y:122,f:'L'}; await A.goto('pansion',{noEnter:false}); A.save(); };
M.k2StartS3Night=async function(A){ if (A.flag('k2.s3.night')) return; A.setFlag('k2.s3.night'); await A.fade(8,900); await card(A,'','Die letzte Stunde','Dienstag · neun Uhr abends',3600);
  A.phase('k2_s3_n'); await A.goto('haustor',{noEnter:false}); A.save(); };
M.k2StartFinale=async function(A){ if (A.flag('k2.f2.started')) return; A.setFlag('k2.f2.started'); await A.fade(8,900); await card(A,'Finale','Malas Spur','Mittwoch, 23. November · klar und kalt');
  A.phase('k2_fin'); clean(A,['dnevnik','svjedocanstva','pecat','deskkey','zvono']); A.setFlag('k2.f2.dead'); A.G.pos.marko={room:'pansion',x:200,y:122,f:'L'}; await A.goto('pansion',{noEnter:false}); A.save(); };
M.k2StartFinNight=async function(A){ if (A.flag('k2.f2.night')) return; A.setFlag('k2.f2.night'); await A.fade(8,1100); await card(A,'','Die letzte Fahrt der Drei','Mittwoch · Nacht',4200);
  A.phase('k2_fin_n'); A.music('k2_finale'); await A.goto('neboder',{x:96,y:126,f:'L',noEnter:false}); A.save(); };
M.k2StartEpilogue=async function(A){ if (A.flag('k2.epi.started')) return; A.setFlag('k2.epi.started'); await A.fade(8,1200); await card(A,'Epilog','Der erste Schnee','Donnerstag, 24. November · Morgen');
  A.phase('k2_epi'); clean(A,['tramkarta_v','ticket_m','photo_stop','chisel','key_kuca','drawing','sweater','ashpage','key_shelter','km','olovka']); A.G.pos.marko={room:'neboder',x:300,y:126,f:'R'}; await A.goto('neboder',{x:300,y:126,f:'R',noEnter:false}); A.save(); };

// ---------------------------------------------------------------- Ende des Kapitels
M.CREDITS2=['MALA','Kapitel 2: Sarajevo','','','Marko Vuković','Mala','','Tomaž Zupan, der um sieben kam','Ivan Barać, der zurückgeben wollte','Zora Marić, die die Namen bewahrte','und Alija, der Fahrscheine für später verkaufte','',
  'Fikret · Senada · Hajra · Rade','Emina · Lejla · Šaćir · Nedžad','Jakob · Amra · Ilija · Milka','Dragica · Nada · Mirza · Sulejman','Selma · Damir · Fadila','','',
  'Alle Bilder, Töne und Lieder','entstehen im Spiel selbst.','Die Orte sind Sarajevo nachempfunden.','Alle Figuren sind erfunden.','','',
  'Für alle, die in Kellern Schule hielten,','und für alle, die noch gesucht werden.','','','FORTSETZUNG','Kapitel 3: Mostar','','',''];
M.endChapter2=async function(A){ M.GS.ended=true; try{ localStorage.setItem('mala.c2end',JSON.stringify({at:Date.now()})); localStorage.removeItem('mala.save.'+M.E.slot()); }catch(e){}
  await A.fade(8,1400); M.E.fade=0; M.E.creditLines=M.CREDITS2; M.E.creditMusic='k2_end'; M.E.afterCredits=null; M.E.startCredits(); };
})(M);
