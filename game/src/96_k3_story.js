/* ===== 96_k3_story.js — Kapitel 3: Mostar. Phasen, Kapitelstart mit Übernahme aus Sarajevo, Stadtplan und Reiseregeln,
   Tageswechsel (ein Tag endet erst nach seinen Pflichtschritten), Leine, „Mala fragen“, Reaktionen auf Schlüsse,
   feste Zwischenstände im Finale, Laden mitten im Kapitel, Abspann. Vorgaben: game/K3_SPEC.md ===== */
(function(M){
'use strict';
var P=M.P;
M.definePhases({
  k3_pro:   {chapter:3, cases:['p3','l3'], tod:'day',  weather:'rain', case:'p3', title:'Prolog – Die Brücke, die alle kennen', short:'Mostar: Prolog', when:'Donnerstag, 24. November 2011 · Mittag'},
  k3_pro_n: {chapter:3, cases:['p3','l3'], tod:'night',weather:'calm', case:'p3', title:'Prolog – Die Brücke, die alle kennen', short:'Mostar: Prolog, Nacht', when:'Donnerstag · spät'},
  k3_d1:    {chapter:3, cases:['l3','v3','b3'], tod:'day',  weather:'bura', case:'l3', title:'Erster Tag – Die Peilung', short:'Mostar: Erster Tag', when:'Freitag, 25. November · Bura'},
  k3_d1_n:  {chapter:3, cases:['l3','v3','b3'], tod:'night',weather:'calm', case:'l3', title:'Erster Tag – Die Peilung', short:'Mostar: Erster Tag, Nacht', when:'Freitag · Nacht'},
  k3_d2:    {chapter:3, cases:['l3','v3','b3'], tod:'day',  weather:'calm', case:'l3', title:'Zweiter Tag – Markttag', short:'Mostar: Zweiter Tag', when:'Samstag, 26. November · klar'},
  k3_d2_n:  {chapter:3, cases:['a3','l3','v3','b3'], tod:'night',weather:'calm', case:'a3', title:'Die Glocke', short:'Skela: Die Glocke', when:'Samstag · Nacht'},
  k3_d3:    {chapter:3, cases:['a3','l3','v3','b3'], tod:'day',  weather:'calm', case:'a3', title:'Dritter Tag – Zwei Ufer', short:'Mostar: Dritter Tag', when:'Sonntag, 27. November · Frost angesagt'},
  k3_fin_n: {chapter:3, cases:['a3','l3'], tod:'night',weather:'frost',case:'l3', title:'Finale – Die letzte Fähre', short:'Skela: Finale', when:'Sonntag · Nacht'},
  k3_epi:   {chapter:3, cases:['e3','l3'], tod:'dawn', weather:'grey', case:'e3', title:'Epilog – Hin und zurück', short:'Mostar: Epilog', when:'Montag, 28. November · Morgen'},
  k3_epi_d: {chapter:3, cases:['e3','l3'], tod:'day',  weather:'grey', case:'e3', title:'Epilog – Hin und zurück', short:'Mostar: Epilog, Tag', when:'Montag, 28. November'}
});
function CH3(G){ return M.chapterOf(G||M.GS)===3; }
function f(G,k){ return !!G.flags[k]; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
// ---------------------------------------------------------------- Regelversion (Revision nach dem Prüfbericht K3, design/K3_AUSBAU.md Teil R)
// 2 = erweiterter Hauptweg: Fotostandort unter der Brücke (Samstag), Fährplane → Feigen → Mates Garage → Batterie (Sonntag) sind Pflicht.
// 1 = bisheriger Pflichtweg. Neue Spiele beginnen mit 2. Alte Spielstände bis einschließlich Samstag (k3_d2) wechseln auf 2, weil alle neuen
// Pflichtknoten danach noch erreichbar sind; ab Samstagnacht bleibt es bei 1 (Lenas Foto entsteht am Samstag an der Brücke).
M.k3Rules=function(G){ G=G||M.GS; return (G&&G.flags&&G.flags['k3.rules'])||1; };
function R2(G){ return M.k3Rules(G)>=2; }
M.k3R2=R2;
var R2PHASES=['k3_pro','k3_pro_n','k3_d1','k3_d1_n','k3_d2'];
M.MIGRATE=M.MIGRATE||[];
M.MIGRATE.push(function(G){ if (!CH3(G) || G.flags['k3.rules']!==undefined) return; G.flags['k3.rules']=R2PHASES.indexOf(G.phase)>=0?2:1; });
async function card(A,k,t,time,ms,sub){ M.E.screen='card'; await A.card({kicker:k,title:t,sub:sub,time:time,ms:ms||4600}); }
function clean(A,list){ list.forEach(function(i){ if (A.has(i)) A.take(i); }); }
// eine Szene außerhalb eines laufenden Ablaufs (aus dem Leerlauf): sperrt Eingaben, speichert nicht mittendrin
async function run(A,fn){ var E=M.E, wb=E.busy; E.busy=true; try{ await fn(A); } catch(e){ console.error(e); } finally{ E.busy=wb; } }

// ---------------------------------------------------------------- Übernahme aus Sarajevo
var C2KEY='mala.c2end';
M.storeC2End=function(G){ try{ var d={ at:Date.now(), confess:G.flags['k2.f2.confess'], whyMostar:G.flags['k2.epi.whyMostar'], hajra:!!(G.seen&&G.seen['pansion:hjEpi']),
    ana:!!G.flags['k2.f2.ana'], father:!!G.flags['k2.i.father'], playMs:G.playMs||0 }; localStorage.setItem(C2KEY,JSON.stringify(d)); }catch(e){} };
var end2=M.endChapter2;
if (end2) M.endChapter2=async function(A){ var G=A.G; await end2(A); M.storeC2End(G); M.E.afterCredits='ch3'; };
M.k3CarryRead=function(){ var d=null; try{ d=JSON.parse(localStorage.getItem(C2KEY)||'null'); }catch(e){ d=null; }
  var c={ confess:'came', whyMostar:'bridge', hajra:false, ana:false, father:false, fromSave:false };
  if (d && d.confess){ c.confess=['came','ruza','forgot'].indexOf(d.confess)>=0?d.confess:'came'; c.whyMostar=['bridge','feel','truck'].indexOf(d.whyMostar)>=0?d.whyMostar:'bridge';
    c.hajra=!!d.hajra; c.ana=!!d.ana; c.father=!!d.father; c.fromSave=true; }
  return c; };
Object.defineProperty(M,'k3Carry',{configurable:true,get:function(){ var G=M.GS||{flags:{}}, F=G.flags||{};
  return { confess:F['k3.c2.confess']||'came', whyMostar:F['k3.c2.whyMostar']||'bridge', hajra:!!F['k3.c2.hajra'], ana:!!F['k3.c2.ana'], father:!!F['k3.c2.father'], fromSave:!!F['k3.c2.fromSave'] }; }});

// ---------------------------------------------------------------- Kapitelstart
M.startChapter3=async function(A){ var E=M.E; E.busy=true;
  try{ var c=M.k3CarryRead(), G=A.G; M.setPhase('k3_pro'); G.flags['k3.rules']=2;
    G.flags['k3.c2.confess']=c.confess; G.flags['k3.c2.whyMostar']=c.whyMostar; G.flags['k3.c2.hajra']=c.hajra; G.flags['k3.c2.ana']=c.ana; G.flags['k3.c2.father']=c.father; G.flags['k3.c2.fromSave']=c.fromSave;
    G.malaOn=false; G.active='marko'; var st=(M.ART.ostbus&&M.ART.ostbus.start)||[90,124,'R']; G.pos.marko={room:'ostbus',x:st[0],y:st[1],f:st[2]||'R'};
    ['dzezva','mobitel','olovka','km','photo_full','rueckfahrt'].forEach(function(i){ if (M.ITEMS[i] && !A.has(i)) A.give(i); });
    ['k3_c_bridge','k3_c_name','k3_c_missing','k3_c_promise'].forEach(function(id){ A.note(id,true); });
    A.unlock('ostbus'); G.flags['k3.moves']=0;
    ['nada','ljerka','sanja','vesna','hajra','rade','ana','mala'].forEach(function(id){ G.flags['met.'+id]=true; });   // Bekannte aus Split und Sarajevo
    await M.kinoIntro(A,3,{kicker:'Kapitel 3',title:'Mostar',sub:'Prolog – Die Brücke, die alle kennen',time:'Donnerstag, 24. November 2011 · Mittag',ms:5200});
    A.music('k3_bus');
    var lines=['In Jablanica hält der Bus zwanzig Minuten. Der Fahrer isst Lamm am Fenster, mit den Fingern, und sieht dabei in den Regen.',
      'Dann kommt die Neretva. Grün. So grün, als hätte sie jemand angemalt, und tief unten zwischen den Felsen.',
      'Mala zieht die Knie auf den Sitz, als könnte das Wasser bis in den Bus kommen.'];
    if (c.hajra) lines.push('Ich breche Hajras Pita in zwei Hälften und lege eine auf den leeren Sitz neben mir. Die Frau gegenüber reicht mir wortlos eine Serviette.');
    lines.push('Mala, ganz leise: „Ich habe hier auf den Fluss gesehen. Vor einer Woche. Ich wusste nicht, warum.“');
    await A.memory({title:'Im Bus',tint:'memory',blank:true,draw:M.mem&&M.mem.k3_bus,lines:lines});
    await A.goto('ostbus',{x:st[0],y:st[1],f:st[2]||'R',noEnter:true}); A.malaJoin({fadeIn:false}); A.music('k3_mostar'); await A.wait(400);
    if (M.k3Arrive) await M.k3Arrive(A); else await A.m('Mostar. Regen. Und der Fluss ist so laut, dass man ihn bis hierher hört.');
  } finally { E.busy=false; } A.save(); };

// ---------------------------------------------------------------- Stadtplan Mostar (der Raum 'map' malt in Kapitel 3 den Plan von Mostar)
var POS0={ garaze:[80,80], ostbus:[232,34], herberge:[210,74], kujundziluk:[190,84], starimost:[170,90], koski:[184,102], tepa:[230,92], strassenbr:[160,56], bulevar:[118,70], partizan:[58,40], westbus:[110,30], zelenika:[92,112], vermisst:[256,50], skela:[150,134] };
function pos3(id){ var P3=M.MAP3_POS||{}; return P3[id]||POS0[id]||[160,72]; }
var LOC3=[
  {id:'ostbus',     name:'Ostbusbahnhof',      to:'ostbus',     icon:'bus'},
  {id:'herberge',   name:'Herberge „Neretva“', to:'herberge',   icon:'house'},
  {id:'kujundziluk',name:'Kujundžiluk',        to:'kujundziluk',icon:'shop'},
  {id:'starimost',  name:'Alte Brücke',        to:'starimost',  icon:'bridge'},
  {id:'koski',      name:'Koski-Moschee',      to:'koski',      icon:'dome'},
  {id:'tepa',       name:'Tepa (Markt)',       to:'tepa',       icon:'market'},
  {id:'strassenbr', name:'Straßenbrücke',      to:'strassenbr', icon:'road'},
  {id:'bulevar',    name:'Bulevar',            to:'bulevar',    icon:'ruin'},
  {id:'partizan',   name:'Partisanenfriedhof', to:'partizan',   icon:'stone'},
  {id:'westbus',    name:'Westbusbahnhof',     to:'westbus',    icon:'bus'},
  {id:'zelenika',   name:'Haus Zelenika',      to:'zelenika',   icon:'house'},
  {id:'vermisst',   name:'Vermisstenstelle',   to:'vermisst',   icon:'office'},
  {id:'garaze',     name:'Lipova (Garagen)',   to:'garaze',     icon:'garage'},
  {id:'skela',      name:'Skela',              to:'skela_d',    icon:'ferry'}
];
Object.defineProperty(M,'MAPLOCS3',{configurable:true,get:function(){ return LOC3.map(function(L){ var p=pos3(L.id); return {id:L.id,name:L.name,to:L.to,icon:L.icon,x:p[0],y:p[1],at:null}; }); }});
(function(){ var R=M.ROOMS.map; if (!R) return; var paint0=R.paint;
  R.paint=function(S,GS){ if (M.chapterOf(GS)===3){ if (M.paintMap3) return M.paintMap3(S,GS); var b=new M.Buf(320,144,P.e3); M.text(b,'MOSTAR',136,6,P.k1);
      for (var y=0;y<144;y++){ var x=150+Math.round(Math.sin(y*0.05)*10); b.hl(x,x+5,y,P.b3); }
      if (!M.mapNoNames) M.MAPLOCS3.forEach(function(L){ if (!GS.map[L.id]) return; M.text(b,L.name,Math.max(4,L.x-(M.textWidth(L.name)>>1)),L.y+5,P.k1); });
      M.MAPLOCS3.forEach(function(L){ var v=M.mapIconVis?M.mapIconVis(L.id,GS):!!GS.map[L.id]; if (v===null||v===undefined) return; b.rect(L.x-3,L.y-3,7,7,v?P.r2:P.e2); }); return b; }
    return paint0(S,GS); }; })();
// Orte, die Marko kennt, bevor er hin darf
// Der Name „Skela“ steht erst auf dem Plan, wenn Marko ihn auf der alten Karte gelesen hat (Prüfbericht K3: nichts vorwegnehmen)
M.MAP_KNOW.skela={ch:3, know:function(G){ return has(G,'l3_area'); },
  label:function(G){ return has(G,'l3_oldmap')?null:'Hinter dem Kartenrand'; },
  why:function(G){ return has(G,'l3_oldmap')?'Auf meinem Plan steht es nicht. Nur auf der alten Karte, als Name an einer Biegung.':'Irgendwo da unten, hinter dem Rand meines Plans. Ohne Namen finde ich dort nichts.'; }};

// ---------------------------------------------------------------- Reisen
var WEST=['bulevar','partizan','westbus','zelenika','garaze'], NIGHT_OK=['herberge','starimost','ostbus'];
function d2Missing(G){ if (!(f(G,'k3.z.mala')||f(G,'k3.z.lost'))) return has(G,'l3_city')?'Erst will ich wissen, wem die Leine heute nachgeht. Sie zeigt in die Stadt, nicht nach Skela.':'Mala sagt, die Leine zeigt heute woandershin. Erst will ich wissen, wohin.';
  if (!f(G,'k3.v.part1')) return 'Vlado hat gesagt: Kommen Sie morgen. Das ist heute.';
  if (!f(G,'k3.b.arrived')) return f(G,'k3.b.mate')?'Und Mate wartet auf den Bus aus München. Ich habe ihm gesagt, dass ich nachsehe.':'Am Westbusbahnhof kommt heute der Bus aus München. Mate wartet auf ihn.';
  if (f(G,'k3.b.helper') && !f(G,'k3.b.jela')) return 'Ich habe Davor gesagt, ich komme mit. Haus Zelenika, am Südrand, bei den Feigen.';   // zugesagt: erst Jela und das Haus
  if (R2(G)){ if (!f(G,'k3.b.jela')) return 'Davor und Lena sind mit dem Bus aus München gekommen. Haus Zelenika, am Südrand, bei den Feigen.';
    if (!f(G,'k3.s.photo')) return 'Davor sucht an der Brücke den Stein von seinem Foto. Ich habe gesagt, ich komme.'; }
  return null; }
// Sonntag (Analyse K3-B07, P18): Was fehlt noch, bevor die Nacht kommt? Spuren nach Person oder Frage, ohne Ort.
function d3Missing(G){
  if (!has(G,'l3_survived')) return (has(G,'a3_blanket')&&has(G,'a3_fromzlata'))?'Die Decke und Zlatas Haus. Das gehört zusammen. Ich habe es nur noch nicht zu Ende gedacht.':'Lanas Nacht ist noch offen. Was ist nach dem Fluss mit ihr geschehen?';
  if (!has(G,'a3_awake')||!has(G,'a3_girl')) return 'Bato. Er weiß mehr über die Glocke, als er sagt. Ich weiß nur noch nicht, womit ich ihn frage.';
  if (!f(G,'k3.bato.uneasy')) return 'Bato muss beides hören: dass er wach war. Und wer geläutet hat.';
  if (!f(G,'k3.v.free')) return 'Vlado. Ohne ihn und seinen Lastwagen komme ich heute Nacht nirgendwohin.';
  if (!f(G,'k3.b.done')){
    if (R2(G) && has(G,'b3_tarp') && !f(G,'k3.a.tarp') && !f(G,'k3.b.figs')) return 'Der große Feigenbaum braucht Batos Plane. Sie liegt in Skela auf dem alten Ponton, und Bato passt auf sie auf.';
    return 'Davor fährt heute. Die Feigen, das Haus. Das will ich nicht halb lassen.'; }
  if (R2(G) && !f(G,'k3.v.battery')){ if (!has(G,'v3_battery')) return 'Vlado will fahren. Ob der TAM das auch will, weiß nur Kata.';
    if (!f(G,'k3.b.garageKey')) return 'Der TAM braucht eine zweite Batterie. Eine Autobatterie würde reichen. Wer hat ein Auto, das keiner mehr fährt?';
    if (!has(G,'b3_street')) return 'Mates Garage, in der Bratstva i jedinstva. Die Straße steht auf keinem Plan von heute. Auf einem alten schon.';
    return 'Mates Garage in der Lipova. Seine Batterie für den TAM.'; }
  return null; }
M.k3D3Missing=d3Missing;
// Grund, warum eine Reise nicht geht: {t, who:'m'|'g', alone:bool} oder null
function travelWhy(G,L){ var p=G.phase, id=L.id;
  if (p==='k3_fin_n') return {t:'Heute Nacht fährt Vlado. Nicht der Plan.',who:'m'};
  if (p==='k3_epi'){ if (id==='starimost'||id==='herberge') return null; return f(G,'k3.e.call')?{t:'Erst zur Brücke. Mala will etwas sehen, bevor Nada kommt.',who:'m'}:{t:'Erst muss ich Nada anrufen.',who:'m'}; }
  if (p==='k3_epi_d'){ if (!f(G,'k3.e.nada')) return id==='ostbus'?null:{t:'Nada kommt mit dem ersten Bus. Ich hole sie am Ostbusbahnhof ab.',who:'m'};
    if (!f(G,'k3.e.mothers')) return id==='skela'?null:{t:'Nada will zuerst zu ihr. Nach Skela. Vlado wartet mit dem Lastwagen.',who:'m'};
    if (!f(G,'k3.e.mother')) return (id==='vermisst'||id==='herberge'||id==='starimost')?null:{t:'Erst zur Vermisstenstelle. Frau Kolar wartet, und Nada hat ihre Probe dabei.',who:'m'};
    return (id==='ostbus'||id==='herberge'||id==='starimost')?null:{t:'Der Bus nach Sarajevo fährt bald. Am Ostbusbahnhof.',who:'m'}; }
  if ((p==='k3_pro_n'||p==='k3_d1_n') && NIGHT_OK.indexOf(id)<0) return {t:'Mitten in der Nacht? Die Stadt schläft. Morgen.',who:'m'};
  if (p==='k3_pro_n' && id==='ostbus') return {t:'Mitten in der Nacht fährt kein Bus.',who:'m'};
  if (p==='k3_d2_n' && NIGHT_OK.indexOf(id)<0 && id!=='skela') return {t:'Jetzt nicht. Heute Nacht zieht es nur nach Skela.',who:'g'};
  if (WEST.indexOf(id)>=0 && !f(G,'k3.mala.crossed')) return {t:f(G,'k3.mala.refused')?'Nicht über den Fluss. Ich habe es dir gesagt.':'Drüben? Über den Fluss? Nein. Ich gehe über keine Brücke.',who:'g',alone:true};
  if (id==='skela'){ if (p==='k3_d1'||p==='k3_d1_n') return {t:'Nicht heute. Ich will da nicht hin. Nicht heute.',who:'g'};
    if (p==='k3_d2'){ var w=d2Missing(G); return w?{t:w,who:'m'}:null; } }
  if (id==='vermisst' && p!=='k3_epi_d') return {t:'Montag. Vorher ist das Büro zu.',who:'m'};
  return null; }
M.k3TravelWhy=travelWhy;
var travel0=M.canTravel;
M.canTravel=async function(A,L){ var G=A.G; if (!CH3(G)) return travel0?travel0(A,L):true;
  var w=travelWhy(G,L);
  if (w){ if (w.who==='g') await A.g(w.t); else await A.m(w.t);
    if (w.alone){ var c=await A.choose([{t:'(Allein gehen.)',id:'alone',silent:true},{t:'(Bei ihr bleiben.)',id:'stay',bye:true,silent:true}],{title:'Über den Fluss'});
      A.setFlag('k3.mala.refused');
      if (c==='alone'){ await A.narrate('Ich gehe los, zur Straße hinunter. Nach ein paar Straßen zieht es hinter meiner Stirn, als hätte jemand einen Faden um meine Schläfen gelegt und zöge daran.'); A.headache&&A.headache(1600);
        await A.wait(500); await A.m('…'); await A.narrate('Ich bleibe stehen. Ich gehe zurück. Mala steht noch da, wo ich sie gelassen habe.'); await A.g('Ich habe gesagt: nicht ohne mich. Und ich gehe über keine Brücke.'); } }
    return false; }
  // Skela: mit dem Taxi vom Ostbusbahnhof (oder Dinos Roller); zurück steht das Taxi wartend an der Straße
  var from=M.E.room?M.E.room.id:'';
  if (L.id==='skela' && !/^skela_|^zlata_k$/.test(from)){ var ride='taxi';
    if (G.flags['k3.dino.ride'] && G.phase!=='k3_epi_d'){ ride=await A.choose([{t:'(Mit dem Taxi.)',id:'taxi',silent:true},{t:'(Mit Dino auf dem Roller.)',id:'dino',silent:true}],{title:'Nach Skela'})||'taxi'; }
    A.setFlag('k3.ride',ride);
    if (G.phase==='k3_epi_d'){ await A.narrate('Vlado fährt. Nada sitzt neben ihm im Führerhaus und sieht geradeaus. Ich sitze außen, Mala zwischen uns, und keiner sagt etwas.'); return true; }
    // die Fahrt selbst wird gezeigt (rooms/k3_fahrt.js): der Roller mit Dinos Gespräch, sonst das Taxi; die Sätze bleiben dieselben
    if (ride==='dino' && M.k3DinoRide){ var dFirst=!G.seen['k3.dino.ride1']; await (M.k3Drive?M.k3Drive(A,'dino',function(){ return M.k3DinoRide(A); },{waitStart:dFirst,lead:dFirst?500:900}):M.k3DinoRide(A)); }
    else if (A.first('!k3.taxi1')){ await (M.k3Drive?M.k3Drive(A,'taxi',async function(){ A.sfx('taxi'); await A.narrate('Am Ostbusbahnhof lehnt der Taxifahrer an seinem Mercedes. „Skela? Da ist nichts. Eine Brücke und Hunde.“ Er fährt trotzdem, das Radio laut.'); }):(async function(){ A.sfx('taxi'); await A.narrate('Am Ostbusbahnhof lehnt der Taxifahrer an seinem Mercedes. „Skela? Da ist nichts. Eine Brücke und Hunde.“ Er fährt trotzdem, das Radio laut.'); })()); }
    else { var tl=A.cycle('k3taxi',['Der Taxifahrer fragt nicht mehr. Er dreht das Radio leiser, als wir aus der Stadt sind.','Dasselbe Taxi, dasselbe Radio. „Skela“, sage ich, und er nickt.']);
      await (M.k3Drive?M.k3Drive(A,'taxi',async function(){ A.sfx('taxi'); await A.narrate(tl); }):(async function(){ A.sfx('taxi'); await A.narrate(tl); })()); }
    return true; }
  if (/^skela_d$/.test(from) && L.id!=='skela'){ if (G.phase!=='k3_epi_d'){ var back;
      if (G.flags['k3.ride']==='dino'){ A.setFlag('k3.ride','taxi'); back='Dino ist längst weg. Ich rufe das Taxi vom Ostbusbahnhof an. Es kommt nach zwanzig Minuten, mit demselben Radio.'; }
      else back=A.cycle('k3taxiB',['Das Taxi hat an der Straße gewartet. Der Fahrer schläft fast. Er fährt uns zurück in die Stadt.','Zurück nach Mostar. Der Fahrer sagt nichts, und ich sage auch nichts.']);
      await (M.k3Drive?M.k3Drive(A,'taxiBack',async function(){ A.sfx('taxi'); await A.narrate(back); }):(async function(){ A.sfx('taxi'); await A.narrate(back); })()); } }
  return true; };
// Aus Skela weg geht es nur von der Straße am rechten Ufer
M.mapOriginWhy=function(G,R){ if (!CH3(G)||!R) return null; if (R.id==='skela_l'||R.id==='skela_most'||R.id==='zlata_k') return G.phase==='k3_epi_d'?'Vlado wartet drüben an der Straße. Erst zurück über die Brücke.':'Das Taxi wartet drüben an der Straße. Erst zurück über die Brücke.'; return null; };
// Mala bleibt am rechten Ufer, wenn Marko in Skela über die Brücke geht (zweite Nacht, dritter Tag, Finale bis zur Überfahrt)
M.malaStays=function(G,from,to){ if (!CH3(G)) return false; var sk=function(r){ return /^skela_|^zlata_k$/.test(r||''); };
  if (!(sk(from)&&sk(to))) return false; if (G.pos.mala.room!=='skela_d') return false;
  var p=G.phase; if (p==='k3_d2_n'||p==='k3_d3') return true; if (p==='k3_fin_n' && !G.flags['k3.fin.boarded']) return true; return false; };

// ---------------------------------------------------------------- Malas Leine
M.k3Leash=function(G){ var p=G.phase; if (G.flags['k3.fin.bond']) return 'bond'; if (G.flags['k3.fin.free']) return 'none';
  if (p==='k3_pro'||p==='k3_pro_n'||p==='k3_d1'||p==='k3_d1_n') return 'down';
  if (p==='k3_d2') return (G.flags['k3.z.mala']||G.flags['k3.z.lost'])?'down':'city';
  if (p==='k3_epi'||p==='k3_epi_d') return 'bond';
  return 'zlata'; };
// Richtungen je Raum (flussab nach Süden; in die Stadt zur Tepa), in Bildkoordinaten von Malas Kopf aus
var DOWN={ ostbus:[-64,-36], herberge:[70,-30], zimmer:[60,-40], kujundziluk:[66,-34], starimost:[72,-26], koski:[64,-36], minarett:[60,-40], tepa:[-60,-38],
  strassenbr:[70,-30], bulevar:[66,-34], partizan:[70,-26], westbus:[64,-36], kafic:[60,-40], vulkanizer:[64,-36], vhof:[64,-36], zelenika:[60,-40], zelenika_in:[60,-40] };
var CITY={ ostbus:[66,-30], herberge:[-60,-40], zimmer:[-60,-40], kujundziluk:[-64,-36], starimost:[-70,-28], koski:[-64,-34], minarett:[-60,-40], strassenbr:[-70,-30],
  bulevar:[70,-30], partizan:[70,-30], westbus:[70,-30], kafic:[60,-40], vulkanizer:[66,-34], vhof:[66,-34], zelenika:[70,-30], zelenika_in:[60,-40] };
var lv0=M.malaLeashVec;
M.malaLeashVec=function(G,ma,mk){ if (!CH3(G)) return lv0?lv0(G,ma,mk):null; var k=M.k3Leash(G), rid=G.pos.mala.room, E=M.E;
  if (k==='none') return false;
  if (k==='bond'){ if (mk && G.pos.marko.room===rid) return {to:[mk.x,mk.y-26],bond:true}; return false; }
  if (k==='zlata' || (k==='city' && rid==='tepa')){ var z=E.ACT.zlata; if (z && E.actorShown && E.actorShown(z)) return {to:[z.x,z.y-24]};
    if (rid==='skela_d'){ var sp=M.spot('skela_d','far_house'); if (sp[2]) return {to:[sp[0]+(sp[2]>>1),sp[1]+(sp[3]>>1)]}; } }
  var d=(k==='city'?CITY[rid]:null)||DOWN[rid]; return d||[64,-36]; };

// ---------------------------------------------------------------- „Mala fragen“ (ab Gespräch 1)
M.K3ASK=M.K3ASK||{};
M.k3AskOpt=function(A,key,label){ if (!A.flag('k3.ask')||A.flag('k3.asked.'+key)) return null;
  return {t:label||'(Mala fragen.)',id:'ask_'+key,silent:true,go:async function(A){ A.setFlag('k3.asked.'+key); A.setFlag('k3.askCount',(A.flag('k3.askCount')||0)+1); if (M.K3ASK[key]) await M.K3ASK[key](A); else await A.g('Frag mich, wenn du es wissen willst. Nicht, wenn du es schon weißt.'); }}; };
M.k3Asked=function(A,key){ return !!A.flag('k3.asked.'+key); };
M.k3Skipped=async function(A,key){ if (!A.flag('k3.ask')||A.flag('k3.asked.'+key)||A.flag('k3.skipped.'+key)) return; A.setFlag('k3.skipped.'+key); var n=(A.flag('k3.skips')||0)+1; A.setFlag('k3.skips',n);
  var L=['Du hast mich nicht gefragt.','Du hast mich wieder nicht gefragt.','Ich stehe hier, Marko. Du hättest fragen können.']; await A.wait(400); await A.g(L[Math.min(n-1,L.length-1)]); };

// ---------------------------------------------------------------- Malas Gespräche: in Kapitel 3 aus 97_k3_mala.js
var lk=M.lookAtMala, tk=M.talkToMala, mk2=M.malaToMarko, ml=M.malaLooksAtMarko;
M.lookAtMala=function(A){ if (CH3(A.G) && M.k3LookAtMala) return M.k3LookAtMala(A); return lk?lk(A):A.m('Mala.'); };
M.talkToMala=function(A){ if (CH3(A.G) && M.k3TalkToMala) return M.k3TalkToMala(A); return tk?tk(A):A.g('…'); };
M.malaToMarko=function(A){ if (CH3(A.G) && M.k3MalaToMarko) return M.k3MalaToMarko(A); return mk2?mk2(A):A.g('Er hört mich. Das reicht.'); };
M.malaLooksAtMarko=function(A){ if (CH3(A.G) && M.k3MalaLooksAtMarko) return M.k3MalaLooksAtMarko(A); return ml?ml(A):A.g('Er sieht müde aus.'); };

// ---------------------------------------------------------------- Ein Tag endet erst nach seinen Pflichtschritten
function dayReady(G){ var p=G.phase;
  if (p==='k3_pro') return has(G,'l3_notbridge')&&has(G,'l3_onedir')&&f(G,'k3.p.checkin');
  if (p==='k3_d1') return has(G,'l3_skela')&&f(G,'k3.v.drawer');
  if (p==='k3_d2'){ var d2=(f(G,'k3.z.mala')||f(G,'k3.z.lost'))&&f(G,'k3.v.part1')&&f(G,'k3.b.arrived');
    return R2(G) ? (d2&&f(G,'k3.b.jela')&&f(G,'k3.s.photo')) : (d2&&(f(G,'k3.b.jela')||!f(G,'k3.b.helper'))); }
  if (p==='k3_d2_n') return f(G,'k3.bato.found')&&f(G,'k3.z.tomorrow')&&G.pos.marko.room==='skela_d';
  if (p==='k3_d3'){ var d3=has(G,'l3_survived')&&has(G,'a3_awake')&&has(G,'a3_girl')&&f(G,'k3.bato.uneasy')&&f(G,'k3.v.free')&&f(G,'k3.b.done');   // Prüfbericht K3: Bato muss beides gehört haben
    return R2(G) ? (d3&&f(G,'k3.v.battery')) : d3; }   // Regel 2: ohne Mates Batterie springt der TAM nicht an (Prüfbericht K3-05)
  if (p==='k3_fin_n') return f(G,'k3.a.limbo');
  if (p==='k3_epi') return f(G,'k3.e.bridge');
  return false; }
M.k3DayReady=dayReady;
// ---------------------------------------------------------------- Bewusster Tagesabschluss (Prüfbericht K3-02)
// Freitag, Samstag und Sonntag enden nicht mehr von selbst, sobald die Pflichtschritte erledigt sind. Marko sagt es einmal („Für heute …“),
// und der Tag endet erst, wenn der Spieler es will: in der Herberge (Freitag, Samstag), in Vlados Werkstatt (Sonntag) oder am Bett.
// Vorher nennt Marko, was noch offen ist (Zusagen, Briefe, Batterie); wer trotzdem beendet, stellt es bewusst zurück (Schalter k3.left.*).
var CONSC={k3_d1:1,k3_d2:1,k3_d3:1};
function endRoom(G,rid){ var p=G.phase, from=G.flags['k3.lastFrom']||'';
  if (p==='k3_d1'||p==='k3_d2') return rid==='herberge' && from!=='zimmer';
  if (p==='k3_d3') return rid==='vulkanizer' && from!=='vhof' && from!=='kafic';
  return false; }
// Prüfbericht K3-R2-02: Die Aufführung der Australier an der Brücke ist freiwillig und nur am Samstag möglich. Wer sie angefangen hat (Text
// aufgeschrieben, Dinos Erlaubnis, eine Aufführung ohne Ende), bekommt sie vor dem Tagesende eigens genannt – unabhängig vom Pflichtfoto.
function musicOpen(G){ if (!f(G,'k3.s.trip') || f(G,'k3.s.lenaVerse')) return null;
  var words=f(G,'k3.s.words'), dino=f(G,'k3.s.dinoOk'), perf=f(G,'k3.s.perf'), heard=has(G,'b3_hum');   // b3_hum: die erste Aufführung hat stattgefunden
  if (perf && !words) return 'Liam ist an der Brücke beim Fenster stecken geblieben. Den Rest des Liedes wollte ich ihm aufschreiben.';
  if (perf || (heard && words)) return 'Die Australier wollen das Lied an der Brücke noch einmal spielen. Diesmal mit dem Ende.';   // Text nach der ersten Aufführung: perf wurde zurückgesetzt
  if (words && dino) return 'Die Australier warten an der Brücke. Den Text haben sie, gespielt haben sie noch nicht.';
  if (dino) return 'Dino lässt die Australier an der Brücke spielen. Gespielt haben sie noch nicht.';
  if (words) return 'Die Australier haben ihren Text. An der Brücke dürfen sie erst spielen, wenn Dino seine Geschichte hat.';
  return null; }
M.k3MusicOpen=musicOpen;
// offene Fäden, die mit dem Tag verloren gehen oder auf die jemand wartet: [{k,t}]
M.k3OpenThreads=function(G){ var p=G.phase, L=[], inv=function(i){ return (G.inv||[]).indexOf(i)>=0; };
  if (p==='k3_d2'){
    var music=musicOpen(G);
    if (f(G,'k3.s.trip') && !f(G,'k3.s.photo') && !f(G,'k3.s.perf') && !music) L.push({k:'bridge',t:'Davor und Lena sind an der Brücke. Ich habe gesagt, ich komme.'});
    if (music) L.push({k:'music',t:music});
    if ((f(G,'k3.z.mala')||f(G,'k3.z.lost')) && !f(G,'k3.x.vaga') && !f(G,'k3.z.vaga')) L.push({k:'vaga',t:'Zlatas Waage liegt noch auf dem Klapptisch am Markt.'}); }
  if (p==='k3_d3'){
    if (inv('pismo')) L.push({k:'pismo',t:'Veras Brief ist noch in meiner Tasche, nicht bei Vlado.'});
    else if (f(G,'k3.x.veraAsked') && !f(G,'k3.x.pismo')) L.push({k:'vera',t:'Vera wartet. Ihr Brief an Vlado ist nicht geschrieben.'});
    if (!R2(G) && has(G,'v3_battery') && !f(G,'k3.v.battery')) L.push({k:'battery',t:'Kata wollte eine zweite Batterie für den TAM.'});
    if (has(G,'b3_folder') && !f(G,'k3.b.folder')) L.push({k:'folder',t:'Mates Mappe liegt noch bei Zdravko.'}); }
  return L; };
async function readyNotice(A){ var G=A.G, p=G.phase;
  if (p==='k3_d1') await A.m('Skela. Und die Schublade. Für heute habe ich, was ich brauche. Wenn ich zurück in der Herberge bin, ist der Tag vorbei.');
  else if (p==='k3_d2') await A.m('Für heute habe ich das Wichtigste. Wenn ich zurück in die Herberge gehe, ist der Tag vorbei.');
  else if (p==='k3_d3') await A.m('Bis elf ist noch Zeit. Dann wartet Vlado im Hof. Wenn ich in die Werkstatt gehe, fahren wir.');
  if (M.k3OpenThreads(G).length && G.malaOn && A.malaHere && A.malaHere()){ await A.wait(400); await A.g('Nicht alles. Du hast noch etwas versprochen.'); } }
M.k3OfferEnd=async function(A){ var G=A.G, p=G.phase; if (!CONSC[p]||!dayReady(G)) return false; var open=M.k3OpenThreads(G);
  var inShop=!!(M.E.room&&M.E.room.id==='vulkanizer');
  await A.m(p==='k3_d3'?(inShop?'Es ist bald elf. Draußen im Hof steht der TAM.':'Es ist bald elf. Vlado und Kata warten im Hof.'):(p==='k3_d1'?'Draußen wird es dunkel. Die Bura hat sich gelegt.':'Es wird Abend. Unten auf der Terrasse zünden sie die Kerzen an.'));
  for (var i=0;i<open.length;i++) await A.m(open[i].t);
  var c=await A.choose([{t:p==='k3_d3'?'(Es ist Zeit. Zum Lastwagen.)':'(Den Tag beenden.)',id:'end',silent:true},{t:open.length?'(Noch nicht. Erst das.)':'(Noch nicht.)',id:'not',silent:true,bye:true}],{title:p==='k3_d3'?'Sonntag, kurz vor elf':'Feierabend'});
  if (c!=='end') return false;
  open.forEach(function(o){ G.flags['k3.left.'+o.k]=true; });   // bewusst zurückgestellt
  if (p==='k3_d1') await M.k3StartD1Night(A); else if (p==='k3_d2') await M.k3StartD2Night(A); else await M.k3StartFinale(A);
  return true; };
function endPending(G){ var p=G.phase; if (!CONSC[p]||!dayReady(G)) return false; if (!G.flags['k3.ready.'+p]) return true;
  var R=M.E.room; return !!R && endRoom(G,R.id) && G.flags['k3.endAsk']!==G.flags['k3.moves']; }
M.k3EndPending=endPending;
M.k3DayCheck=async function(A){ var G=A.G, R=M.E.room; if (!CH3(G)||G.ended||!R||R.noSave) return false; if (!dayReady(G)) return false;
  var p=G.phase;
  if (CONSC[p]){ if (!G.flags['k3.ready.'+p]){ G.flags['k3.ready.'+p]=true; await readyNotice(A); }
    if (endRoom(G,R.id) && G.flags['k3.endAsk']!==G.flags['k3.moves']){ G.flags['k3.endAsk']=G.flags['k3.moves']; return await M.k3OfferEnd(A); }
    return false; }
  if (p==='k3_pro') return await M.k3StartEvening0(A), true;
  if (p==='k3_d2_n') return await M.k3StartD3(A), true;
  if (p==='k3_d3') return await M.k3StartFinale(A), true;
  if (p==='k3_fin_n') return await M.k3StartEpilogue(A), true;
  if (p==='k3_epi') return await M.k3StartEpiDay(A), true;
  return false; };
M.k3DayReady=dayReady;   // für Tests: sind die Pflichtschritte des Tages erledigt?
// Analyse K3-B10 (Kann-Liste): Ein Ortswechsel bewegt nur die aktive Figur. Endet ein Abschnitt durch Malas Handlung, bliebe Marko
// am alten Ort; vor den Übergängen spielt deshalb Marko (wie bring() in Kapitel 4 und 5), Mala kommt mit.
function asMarko(A){ var G=A.G; if (G.active==='mala'){ G.active='marko'; if (M.setGhostAudio) M.setGhostAudio(false); } }
// das Bett im Zimmer (S1 ruft es auf)
M.k3Bed=async function(A){ var G=A.G, p=G.phase;
  if (p==='k3_pro_n'){ if (A.flag('k3.p.talk1')) return M.k3StartD1(A); return A.m('Noch nicht. Mala steht draußen auf der Terrasse, als wartete sie auf etwas.'); }
  if (p==='k3_d1_n'){ if (A.flag('k3.d1.father')) return M.k3StartD2(A); return A.m('Noch nicht. Mala sitzt auf der Terrasse und sieht mich an, als wollte sie etwas fragen.'); }
  if (p==='k3_pro') return A.m(dayReady(G)?'Es wird gleich dunkel. Erst will ich noch nach draußen.':A.cycle('k3bed0',['Es ist Mittag. Und ich bin wegen einer Brücke hier, nicht wegen eines Betts.','Später. Erst die Brücke.']));
  if (CONSC[p] && dayReady(G)){ G.flags['k3.ready.'+p]=true; if (p==='k3_d3') await A.m('Hinlegen? Um elf wartet Vlado.'); return M.k3OfferEnd(A); }
  if (p==='k3_d1'){ if (!has(G,'l3_skela')) return A.m(has(G,'l3_oldmap')&&has(G,'l3_area')?'Am hellen Tag? Ich habe einen Namen auf einer alten Karte. Mehr noch nicht.':(has(G,'l3_area')?'Am hellen Tag? Ich weiß ungefähr, wo. Hinter dem Rand meines Plans. Mehr nicht.':'Am hellen Tag? Die Leine zeigt irgendwohin, und ich weiß noch nicht, wohin.'));
    // Analyse K3-B08 (P24): den Namen nennt das Bett erst, wenn Marko ihn kennt; die Schublade erst, wenn Kata davon erzählt hat
    var knows=(M.k3KnowsVlado&&M.k3KnowsVlado(G))||has(G,'v3_ljerka');
    return A.m(!knows?'Am hellen Tag? Erst den Fahrer. Den, der geraucht und nichts gesagt hat.':(has(G,'v3_typenschein')?'Vlado. Erst Vlado. Und die Schublade.':'Vlado. Erst Vlado.')); }
  if (p==='k3_d2'){ var w=d2Missing(G); return A.m(w||'Noch nicht.'); }
  if (p==='k3_d2_n') return A.g('Nicht jetzt. Es zieht. Nach Skela.');
  if (p==='k3_d3'){ var w3=d3Missing(G); return A.m(w3?'Heute nicht. '+w3:A.cycle('k3bed3',['Heute nicht. Heute Nacht schon gar nicht.','Wenn ich mich jetzt hinlege, verschlafe ich den Frost.'])); }
  return A.m('Nicht jetzt.'); };

// ---------------------------------------------------------------- Übergänge
function wakeAt(A){ var z=M.ART.zimmer, st=(z&&z.start)||[160,124,'L']; A.G.pos.marko={room:'zimmer',x:st[0],y:st[1],f:st[2]||'L'}; return st; }
M.k3StartEvening0=async function(A){ if (A.flag('k3.ev0.started')) return; A.setFlag('k3.ev0.started'); await A.m('Es wird dunkel. Der Regen hört auf, und der Fluss wird lauter.'); await A.fade(8,900); await card(A,'','Am Abend','Donnerstag · Terrasse der Herberge',3400);
  A.phase('k3_pro_n'); var h=M.ART.herberge, t=(h&&h.stands&&h.stands.table)||null; asMarko(A); await A.goto('herberge',t?{x:t[0],y:t[1],f:t[2]||'R',noEnter:true}:{noEnter:true}); A.music('k3_noc'); A.save();
  if (M.k3Talk1) await M.k3Talk1(A); };
M.k3StartD1=async function(A){ if (A.flag('k3.d1.started')) return; A.setFlag('k3.d1.started'); await A.fade(8,900); await card(A,'Erster Tag','Die Peilung','Freitag, 25. November · Bura');
  A.phase('k3_d1'); var st=wakeAt(A); asMarko(A); await A.goto('zimmer',{x:st[0],y:st[1],f:st[2]||'L',noEnter:false}); A.save(); if (M.k3Wake) await M.k3Wake(A,'k3_d1'); };
M.k3StartD1Night=async function(A){ if (A.flag('k3.d1n.started')) return; A.setFlag('k3.d1n.started'); await A.m('Für heute reicht es. Skela. Und eine Schublade, die nach einem Schlüssel riecht.'); await A.fade(8,900); await card(A,'','Freitag · Nacht','Die Terrasse der Herberge',3400);
  A.phase('k3_d1_n'); var h=M.ART.herberge, t=(h&&h.stands&&h.stands.table)||null; asMarko(A); await A.goto('herberge',t?{x:t[0],y:t[1],f:t[2]||'R',noEnter:true}:{noEnter:true}); A.save();
  if (A.flag('k3.d1.sanja') && !A.flag('k3.d1.ljerka') && M.k3LjerkaCall) await M.k3LjerkaCall(A);
  if (M.k3Father) await M.k3Father(A); };
M.k3StartD2=async function(A){ if (A.flag('k3.d2.started')) return; A.setFlag('k3.d2.started'); await A.fade(8,900); await card(A,'Zweiter Tag','Markttag','Samstag, 26. November · klar');
  A.phase('k3_d2'); var st=wakeAt(A); asMarko(A); await A.goto('zimmer',{x:st[0],y:st[1],f:st[2]||'L',noEnter:false}); A.save(); if (M.k3Wake) await M.k3Wake(A,'k3_d2'); };
M.k3StartD2Night=async function(A){ if (A.flag('k3.d2n.started')) return; A.setFlag('k3.d2n.started');
  if (!A.flag('k3.d2.nada')){ A.sfx('phone'); await A.wait(700); if (M.k3NadaCall2) await M.k3NadaCall2(A); else { await A.phoneVoice('„Weißt du etwas?“','nada'); await A.m('Ich habe eine Spur.'); A.setFlag('k3.d2.nada','truth'); } }
  await A.fade(8,900); await card(A,'','Die Glocke','Samstag · Nacht',3600);
  A.phase('k3_d2_n'); asMarko(A); await A.goto('herberge',{noEnter:false}); A.save();
  await A.g(A.G.flags['k3.z.lost']?'Sie zieht. Nach Süden, aus der Stadt hinaus. Dahin, wo die Eierfrau hingegangen ist.':'Sie zieht. Nach Süden. Ihr nach.'); await A.m('Skela.'); };
M.k3StartD3=async function(A){ if (A.flag('k3.d3.started')) return; A.setFlag('k3.d3.started'); await A.m('Morgen. Bei Tag.'); A.sfx('taxi'); await A.fade(8,1000);
  await card(A,'Dritter Tag','Zwei Ufer','Sonntag, 27. November · Frost angesagt');
  A.phase('k3_d3'); var st=wakeAt(A); asMarko(A); await A.goto('zimmer',{x:st[0],y:st[1],f:st[2]||'L',noEnter:false}); A.save(); if (M.k3Wake) await M.k3Wake(A,'k3_d3'); };
M.k3StartFinale=async function(A){ if (A.flag('k3.fin.started')) return; A.setFlag('k3.fin.started'); await A.m('Es ist bald elf. Vlado wartet.'); await A.fade(8,1100);
  await card(A,'Finale','Die letzte Fähre','Sonntag, 27. November · Nacht',4600);
  A.phase('k3_fin_n'); clean(A,['deka','kljuc_mate','ulaznica']); await M.k3FinBegin(A); };
M.k3FinBegin=async function(A){ var v=M.ART.vhof, st=(v&&v.start)||[60,126,'R']; asMarko(A); await A.goto('vhof',{x:st[0],y:st[1],f:st[2]||'R',noEnter:true}); A.music('k3_fin'); A.save();
  if (M.k3FinDeparture) await M.k3FinDeparture(A); else { await A.narrate('Der TAM springt beim dritten Versuch an. Vlado fährt, zum ersten Mal seit siebzehn Jahren bei Nacht.'); }
  A.setFlag('k3.fin.drive'); await A.fade(8,1200);
  var sd=M.ART.skela_d, s0=(sd&&sd.start)||[40,126,'R']; asMarko(A); await A.goto('skela_d',{x:s0[0],y:s0[1],f:s0[2]||'R',noEnter:true}); A.save();
  if (M.k3FinArrive) await M.k3FinArrive(A); };
// fester Zwischenstand im Finale (S3)
M.k3Checkpoint=async function(A,n){ A.setFlag('k3.fin.cp',n); A.save(); };
M.k3StartEpilogue=async function(A){ if (A.flag('k3.epi.started')) return; A.setFlag('k3.epi.started'); await A.fade(8,1300);
  await card(A,'Epilog','Hin und zurück','Montag, 28. November · Morgen');
  A.phase('k3_epi'); A.G.malaOn=true; A.G.active='marko'; var h=M.ART.herberge, t=(h&&h.stands&&h.stands.railing)||null; asMarko(A); await A.goto('herberge',t?{x:t[0],y:t[1],f:t[2]||'R',noEnter:true}:{noEnter:true}); A.malaJoin({fadeIn:false}); A.music('k3_epi'); A.save();
  if (M.k3NadaCallEpi) await M.k3NadaCallEpi(A); };
M.k3StartEpiDay=async function(A){ if (A.flag('k3.epid.started')) return; A.setFlag('k3.epid.started'); await A.fade(8,1000); await card(A,'','Gegen Mittag','Montag · Ostbusbahnhof',3200);
  A.phase('k3_epi_d'); A.unlock('vermisst'); await A.goto('ostbus',{noEnter:true}); A.save(); if (M.k3NadaArrives) await M.k3NadaArrives(A); };

// ---------------------------------------------------------------- Laden mitten im Kapitel: unterbrochene Wechsel nachholen
M.PENDING_X=M.PENDING_X||[];
[ {from:'k3_pro', guard:'k3.ev0.started'}, {from:'k3_pro_n', guard:'k3.d1.started'}, {from:'k3_d1', guard:'k3.d1n.started'}, {from:'k3_d1_n', guard:'k3.d2.started'},
  {from:'k3_d2', guard:'k3.d2n.started'}, {from:'k3_d2_n', guard:'k3.d3.started'}, {from:'k3_d3', guard:'k3.fin.started'},
  {from:'k3_fin_n', guard:'k3.epi.started', when:function(){ return true; }, run:function(A){ return M.k3FinLoad(A); }},
  {from:'k3_epi', guard:'k3.epid.started'},
  {from:'k3_epi_d', when:function(G){ return !G.flags['k3.e.nada'] && G.pos && G.pos.marko && G.pos.marko.room==='ostbus'; }, run:function(A){ return M.k3NadaArrives(A); }} ].forEach(function(r){ M.PENDING_X.push(r); });   // Kann-Liste: Nadas Ankunft nach dem Laden fortsetzen
// nach dem Laden in der Finalnacht: Abfahrt neu, oder die Szene am letzten Zwischenstand fortsetzen (S3: M.k3FinResume)
M.k3FinLoad=async function(A){ if (A.flag('k3.a.limbo')) return M.k3StartEpilogue(A); if (!A.flag('k3.fin.drive')) return M.k3FinBegin(A); if (M.k3FinResume) return M.k3FinResume(A); };

// ---------------------------------------------------------------- Raumwechsel: Zähler, Ljerkas Rückruf
function storyOpen(G){ if (has(G,'b3_street')) G.map.garaze=true; if (G.flags['k3.mala.crossed']){ G.map.bulevar=true; G.map.westbus=true; G.map.partizan=true; } if (has(G,'l3_flat')){ G.map.strassenbr=true; G.map.partizan=true; } if (has(G,'l3_skela')) G.map.skela=true; if (has(G,'l3_person')||has(G,'l3_tepa')) G.map.tepa=true; }
M.MIGRATE.push(function(G){ if (CH3(G)) storyOpen(G); });
M.onRoomChange=(function(prev){ return function(G,id,from,o){ if (prev) prev(G,id,from,o); if (!CH3(G)) return; G.flags['k3.moves']=(G.flags['k3.moves']||0)+1; G.flags['k3.lastFrom']=(from==='k3_fahrt'?M.k3RideFrom:from)||''; storyOpen(G);   // nach einer Fahrtszene zählt der Ort, an dem sie begann
  if (G.flags['k3.d1.sanja'] && G.flags['k3.d1.sanjaAt']===undefined) G.flags['k3.d1.sanjaAt']=G.flags['k3.moves']-1;
  if (G.flags['k3.d1.sanja'] && !G.flags['k3.d1.ljerka'] && G.flags['k3.moves']>=G.flags['k3.d1.sanjaAt']+2 && G.phase==='k3_d1' && !M.ROOMS[id].noSave) M.k3Queue('ljerka'); }; })(M.onRoomChange);

// ---------------------------------------------------------------- Reaktionen auf Schlüsse und andere ausstehende Szenen (laufen, sobald nichts anderes läuft)
// Reaktionen auf Schlüsse und Ereignisse laufen im Leerlauf nacheinander. Die Warteschlange steht auch im Spielstand (Schalter k3.q):
// Eine Reaktion verlässt sie erst, wenn sie fertig ist. Wird sie durch Laden oder das Titelbild unterbrochen, läuft sie danach von vorn.
var Q=[], idleRun=false, idleAt=0, runTok=0; M.K3REACT=M.K3REACT||{};
function qSave(){ var G=M.GS; if (G && G.flags) G.flags['k3.q']=Q.slice(); }
M.k3Queue=function(k){ if (Q.indexOf(k)<0) Q.push(k); qSave(); };
// nach dem Laden, beim neuen Spiel und beim Titelbild: keine Sperre aus einem abgebrochenen Ablauf, die Warteschlange kommt aus dem Spielstand
M.k3ResetRun=function(){ idleRun=false; runTok++; var G=M.GS; Q=(G && G.flags && Array.isArray(G.flags['k3.q']))?G.flags['k3.q'].slice():[]; };
M.RESET_HOOKS=M.RESET_HOOKS||[]; M.RESET_HOOKS.push(M.k3ResetRun);
var REACT={
  'ded:l3_notbridge':async function(A){ if (!A.G.malaOn) return; await A.wait(300); await A.g('Dann ist es eine andere.'); await A.m('Eine mit Beinen im Wasser.'); },
  'ded:l3_flat':async function(A){ await A.m('Mein Vater hat Brücken berechnet. Er hat mir gezeigt, wie man eine Linie zieht, die nicht wackelt.'); await A.wait(500);
    // Prüfbericht K3: das Problem bleibt, den Ort sucht der Spieler selbst (Stadtplan; die Hinweise nennen ihn)
    await A.m('Zwei Linien von fast derselben Stelle. Sie schneiden sich so flach, dass ich nur weiß: irgendwo flussab.'); await A.m('Die dritte muss quer dazu kommen. Von weit weg. Und von oben, über die Dächer.');
    if (!A.flag('k3.mala.crossed') && A.G.malaOn){ await A.g('Weit weg.'); await A.wait(500); await A.g('Aber nicht über den Fluss.'); A.setFlag('k3.mala.refused'); } },
  'ded:l3_area':async function(A){ await A.m('Hinter dem Rand meines Plans. Mein Plan hört da auf, wo die Stadt aufhört.'); await A.m('Ich brauche eine Karte, die weiter reicht. Eine alte, mit den Dörfern.'); },
  'ded:l3_skela':async function(A){ var G=A.G; if (!G.malaOn) return; await A.wait(400); await A.g('Eine Fähre.'); await A.wait(900);
    await A.g('In Split habe ich auf Boote gewartet. Jedes Mal, wenn eins getutet hat, wollte ich mit.'); await A.m('Am Terminal. Das hast du mir gesagt.'); await A.g('Ich wusste nicht, warum. Ich wollte nicht nach Ancona. Ich wollte nur auf ein Boot.'); await A.wait(600); await A.m('Morgen.'); await A.g('Ja. Nicht heute.'); },
  'ded:l3_person':async function(A){ if (!A.G.malaOn) return; await A.g('Ein Mensch.'); await A.wait(500); await A.g('Ich hänge an einem Menschen. Das war bei dir auch so.'); await A.m('Und jetzt hängst du an jemandem, der heute in die Stadt gekommen ist.'); },
  'ded:l3_onetrail':async function(A){ await A.m('Alle, die sie zuletzt gesehen haben, kannten Mala. Und ich bin der Einzige, der weiß, wer Mala ist.'); if (A.G.malaOn){ await A.wait(400); await A.g('Du hast mich so genannt. Damals, im Bus. Weil ich größer war.'); } },
  'ded:l3_twosearches':async function(A){ await A.m('Wenn ich frage, frage ich nach Mala.'); },
  'ded:l3_survived':async function(A){ await A.m('Sie hat noch gelebt. Nach dem Fluss.'); await A.wait(500); await A.m('Ich suche nicht mehr einen Ort im Wasser. Ich suche den Menschen, der bei ihr war.'); if (A.G.malaOn){ await A.g('Zlata.'); await A.wait(500); await A.g('Deshalb hängt die Leine an ihr.'); } },
  'ded:v3_who':async function(A){ await A.m('Mala hat gesagt: „Er ist gefahren.“ Das stimmt. Aber es ist nicht alles.'); await A.m(A.room&&A.room.id==='vulkanizer'?'Ich muss mit ihr reden. Nicht hier, vor ihm.':'Ich muss mit ihr reden.'); },
  'ded:a3_awake':async function(A){ await A.m('Er war wach. Er hat am Fenster gestanden und mitgezählt.'); },
  'ded:a3_girl':async function(A){ await A.m('Kein Soldat. Ein Mädchen mit einem Bleistift.'); },
  'ded:b3_invite':async function(A){ await A.m('Das muss Davor hören. In seiner Sprache. Und Lena in ihrer.'); },
  'ded:e3_avoid':async function(A){ if (A.G.malaOn) await A.g('Du suchst mich, damit du ihn nicht suchen musst.'); },
  'ljerka':async function(A){ if (M.k3LjerkaCall) await M.k3LjerkaCall(A); },
  'order':async function(A){ if (M.k3OrderNight) await M.k3OrderNight(A); }
};
async function react(A,k){ var fn=M.K3REACT[k]||REACT[k]; if (fn) await fn(A); if (k==='ded:l3_skela' || k==='ded:l3_flat') await M.k3DayCheck(A); }
var idle0=M.idleHook;
M.idleHook=function(A){ if (idle0) idle0(A); var G=A.G; if (!CH3(G)) return; if (idleRun && Date.now()-idleAt>90000) idleRun=false;   // Sicherung: eine abgebrochene Szene blockiert nicht für immer
  if (idleRun) return; var R=M.E.room; if (!R||R.noSave) return;
  if (G.flags['k3.mala.crossed'] && !G.map.westbus) storyOpen(G);
  if (!Q.length && !(dayReady(G) && (!CONSC[G.phase] || endPending(G)))) return;
  idleRun=true; idleAt=Date.now(); var tok=runTok;
  run(A,async function(A){ while (Q.length && tok===runTok){ var k=Q[0]; try{ await react(A,k); } catch(e){ console.error(e); } if (tok!==runTok) return; if (Q[0]===k) Q.shift(); qSave(); }
    if (tok===runTok && dayReady(G)) await M.k3DayCheck(A); }).then(function(){ if (tok===runTok) idleRun=false; },function(){ if (tok===runTok) idleRun=false; }); };

// ---------------------------------------------------------------- Ende des Kapitels
M.CREDITS3=['DIE STILLEN','Kapitel 3: Mostar','','','Marko Vuković','Mala','','Bato Brkić, der beim dritten Läuten wach war','Mate Zelenika, der auf den Bus aus München wartete','und ein Springer, der jeden Abend springt','',
  'Zlata · Vlado · Kata','Davor · Lena · Jela','Zdravko · Dino · Maja','Frau Kolar · Ljerka · Nada','','',
  'Alle Bilder, Töne und Lieder','entstehen im Spiel selbst.','Die Orte sind Mostar nachempfunden.','Skela gibt es nicht.','Alle Figuren sind erfunden.','','',
  'Für alle, die noch gesucht werden,','und für alle, die nicht aufhören zu suchen.','','','FORTSETZUNG','Kapitel 4: München','','',''];
M.endChapter3=async function(A){ var G=A.G; G.ended=true;
  try{ localStorage.setItem('mala.c3end',JSON.stringify({at:Date.now(),consent:G.flags['k3.fin.consent'],promise:G.flags['k3.p.promise'],talk2:G.flags['k3.d3.talk2v'],sample:!!G.flags['k3.e.sample'],asks:G.flags['k3.askCount']||0,skips:G.flags['k3.skips']||0}));
  }catch(e){} M.E.markChapterEnd(3);
  if (await M.kinoOutro(A,3)) M.E.fade=0; else { await card(A,'','Ende des dritten Kapitels','',5200,'Fortsetzung: München'); await A.fade(8,1400); } M.E.fade=0; M.E.creditLines=M.CREDITS3; M.E.creditMusic='k3_end'; M.E.afterCredits=M.startChapter4?'ch4':null; M.E.startCredits(); };
})(M);
