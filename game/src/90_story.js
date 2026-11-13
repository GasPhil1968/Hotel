/* ===== 90_story.js — der Rahmen: Phasen (Tage, Tageszeiten), Spielstart, Übergänge zwischen den Fällen, Stadtplan, Titelbild, Abspann ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer;
M.definePhases({
  pro:      {tod:'day',  weather:'rain', case:'c1', title:'Prolog – Die Stillen', short:'Prolog', when:'Dienstag, 15. November 2011 · Nachmittag'},
  pro_eve:  {tod:'dusk', weather:'rain', case:'c1', title:'Prolog – Die Stillen', short:'Prolog, Abend', when:'Dienstag · Abend'},
  pro_night:{tod:'night',weather:'calm', case:'c1', title:'Prolog – Die Stillen', short:'Prolog, Nacht', when:'Dienstag · Nacht'},
  c1:       {tod:'dusk', weather:'calm', case:'c1', title:'Erster Fall – Das Boot um sieben', short:'Erster Fall', when:'Mittwoch, 16. November · Abend'},
  c1_night: {tod:'night',weather:'bura', case:'c1', title:'Erster Fall – Das Boot um sieben', short:'Erster Fall, Nacht', when:'Mittwoch · Nacht'},
  i1:       {tod:'night',weather:'bura', case:'c1', title:'Zwischenspiel – Die Bank an der Riva', short:'Zwischenspiel', when:'Mittwoch · spät'},
  i1m:      {tod:'day',  weather:'bura', case:'c1', title:'Zwischenspiel – Ein gewöhnlicher Morgen', short:'Zwischenspiel, Morgen', when:'Donnerstag, 17. November · Morgen'},
  c2:       {tod:'day',  weather:'bura', case:'c2', title:'Zweiter Fall – Das letzte Schiff nach Ancona', short:'Zweiter Fall', when:'Donnerstag, 17. November · Bura'},
  c2_night: {tod:'night',weather:'bura', case:'c2', title:'Zweiter Fall – Das letzte Schiff nach Ancona', short:'Zweiter Fall, Abend', when:'Donnerstag · Abend'},
  i2:       {tod:'night',weather:'calm', case:'c2', title:'Zwischenspiel – Sustipan', short:'Zwischenspiel', when:'Donnerstag · spät'},
  cj:       {tod:'day',  weather:'calm', case:'cj', title:'Zwischenfall – Der Totengräber', short:'Zwischenfall', when:'Freitag, 18. November · Vormittag'},
  c3:       {tod:'dusk', weather:'rain', case:'c3', title:'Dritter Fall – Der Nachtportier', short:'Dritter Fall', when:'Freitag, 18. November · Abend'},
  c3_night: {tod:'night',weather:'rain', case:'c3', title:'Dritter Fall – Der Nachtportier', short:'Dritter Fall, Nacht', when:'Freitag · Nacht'},
  epi:      {tod:'dawn', weather:'calm', case:'epi',title:'Epilog – Die Straße nach Osten', short:'Epilog', when:'Samstag, 19. November · Morgengrauen'}
});
function phaseIn(GS,list){ return list.indexOf(GS.phase)>=0; }
M.phaseIn=phaseIn;

// ---------------------------------------------------------------- Spielstart: Prolog
// Der Prolog beginnt mit Marko allein: an der Arbeit, mit Kopfschmerzen, die er dem Jugo zuschreibt. Mala erscheint erst nach der Recherche.
M.startGame=async function(A){ var E=M.E; E.busy=true;
  try{ M.setPhase('pro'); M.GS.pos.marko={room:'flat',x:188,y:106,f:'B'}; A.unlock('flat');
    var G=A.G; G.flags['split.intro.v']=2; ['sanja','stipe','frane'].forEach(function(k){ G.flags['met.'+k]=true; });   // die kennt er seit Jahren: keine Vorstellung
    await M.kinoIntro(A,1,{kicker:'Prolog',title:'Die Stillen',sub:'Split',time:'Dienstag, 15. November 2011 · Nachmittag',ms:4400});   // Zwischenfilm statt Karte (89_kinoszenen.js)
    await A.goto('flat',{x:188,y:106,f:'B',noEnter:true});
    A.music('flat'); await A.wait(400); A.sfx('typing');
    await A.narrate('Seit drei Tagen Jugo. Warmer Regen, schwere Luft, und ein Kopf wie Blei.');
    await A.m('Seite einunddreißig von achtundvierzig. Eine Espressomaschine aus Mailand, die man in Graz verkaufen will. Auf Deutsch.');
    A.headache(2200); await A.animM('headache'); await A.m('…Kopfschmerzen. Natürlich.');
    await A.m('Der Anrufbeantworter blinkt.');
  } finally { E.busy=false; } A.save(); };
// nach Ivkas Wohnung: zurück nach Hause, Abend
// alte Spielstände: wie bisher direkt nach Hause. Neu: es wird Abend in Varoš, Marko will noch zur Riva (der Anfall am Poller)
M.endProVisit=async function(A){ A.phase('pro_eve'); if (A.flag('split.intro.legacy')){ await A.fade(8,700); await A.goto('flat',{x:226,y:122,f:'L',noEnter:false}); return; }
  A.rebuild(); A.unlock('riva'); };
// Fall 1 beginnt (nach der Nacht)
// Fall 1 beginnt (nach der Nacht): Mala ist da – aber nur als Stimme und als Flimmern, das Marko überhört
// Mittwochabend: kein Traumgespräch (das gehört nach Ivka). Nur ein Zimmer, das nicht ganz so ist, wie er es verlassen hat.
M.startCase1=async function(A){ M.E.screen='card'; await A.card({kicker:'Erster Fall',title:'Das Boot um sieben',time:'Mittwoch, 16. November · Abend',ms:4400});
  A.phase('c1'); A.setFlag('mala.voice'); A.setFlag('mala.unknown'); A.G.flags['mk.ache']=0; var F=A.R('flat'); F.tram=true; F.photoUp=true; F.winOpen=false;
  await A.goto('flat',{x:200,y:118,f:'L',noEnter:true}); A.malaJoin({x:150,y:116,f:'R',fadeIn:false}); await A.fade(0,600);
  A.headache(3500); await A.animM('headache'); await A.m('Ich habe den ganzen Tag geschlafen und bin müder als vorher.');
  if (A.flag('split.intro.v')){ await A.wait(400); await A.animM('steady'); await A.m('Aufstehen. Langsam. Der Boden ist heute weich wie ein Bootsdeck.'); }
  await A.m('Das Fenster ist zu. Der Riegel ist alt. Er springt manchmal auf.');
  await A.wait(800); A.sfx('phone'); await A.wait(1200); await A.m('Vesna.');
  await A.phoneVoice('„Marko. Dein Text über Ivka Perić ist gut. Er kommt morgen. Ein bisschen traurig, aber das sind sie alle.“');
  if (A.G.flags.leadKnit===1) await A.phoneVoice('„Das mit den Mützen hat mir gefallen. Die Stadt hatte „keine Kontakte“ geschrieben. Gut, dass du gefragt hast.“');
  await A.m('Danke. Ich habe schlecht geschlafen.'); await A.phoneVoice('„Du schläfst immer schlecht. Geh raus. An die Luft. Ciao.“');
  await A.m('Sie hat recht. Die Riva. Ein bisschen Luft, ein bisschen Meer. Nichts weiter.'); A.unlock('riva'); A.unlock('bar'); A.save(); };
// ---------------------------------------------------------------- Spielstände aus der Zeit vor dem neuen Einstieg
// Ohne split.intro.v ist ein Stand „alt“: neue Pflichtschritte gelten für ihn nicht. Wer den Praxistest im Hafenamt schon hatte, kennt Mala.
M.migrateSave=function(G){ var f=G.flags||(G.flags={}), inv=G.inv||(G.inv=[]);
  // Reparatur: Spielstände, die mitten in Ivkas Abschied gespeichert wurden (Handschuhe schon übergeben, Schluss nicht gesichert), bekommen die Handschuhe zurück
  if (f['c1.dinkoTold'] && !f['c1.done'] && inv.indexOf('gloves')<0) inv.push('gloves');
  if (f['split.intro.v']) return;
  // nur Stände aus Kapitel 1 können aus der Zeit vor dem neuen Einstieg stammen; Kapitel 2–4 setzen split.intro.v nie (QA BUG-001)
  if (M.chapterOf && M.chapterOf(G)>1) return;
  f['split.intro.legacy']=true; if (f['mk.test']){ f['split.intro.met']=true; delete f['mala.noSwitch']; }
  if (f['i1.done']) f['split.afterIvka.done']=true; };
// ---------------------------------------------------------------- ausstehende Abschnittswechsel nach dem Laden
// Ein Spielstand kann zwischen dem Ende einer Szene (Zusage, Abschied) und dem automatischen Wechsel in den nächsten Abschnitt liegen:
// ältere Fassungen haben dort gespeichert. Beim Laden wird der Wechsel nachgeholt. Ist sein Schalter schon gesetzt, der Abschnitt aber noch der alte
// (Unterbrechung mitten im Wechsel), wird der Schalter zurückgenommen und der Wechsel neu gestartet oder wieder auslösbar gemacht.
var PENDING=[
  // Analyse K1-B16 (P24): ohne „when“ lief diese Regel nie. Ist die Nacht schon gespielt, beginnt der erste Fall; sonst führt das Bett wieder in die Nacht (flat.js)
  {from:'pro_night', when:function(G){ return !!G.flags['split.intro.night']; }, run:function(A){ return M.startCase1(A); }},
  {from:'i1m', when:function(G){ return G.flags['i1.done']; }, run:function(A){ return M.startCase2(A); }},
  {from:'c2', guard:'c2.nightStarted', when:function(G){ return G.flags['c2.tonight']; }, run:function(A){ return M.startC2Night(A); }},
  {from:'c2_night', when:function(G){ return G.flags['c2.ninaGone']; }, run:function(A){ return M.interlude2(A); }},
  {from:'i2', when:function(G){ return !G.flags['i2.done']; }, run:function(A){ return M.interlude2(A); }},
  {from:'i2', guard:'cj.started', when:function(G){ return G.flags['i2.done']; }, run:function(A){ return M.startCaseJ(A); }},   // nach dem Zwischenspiel: Jakovs Fall (92_jakov.js)
  {from:'cj', when:function(G){ return G.flags['cj.done']; }, run:function(A){ return M.startCase3(A); }},
  {from:'c3_night', when:function(G){ return G.flags['c3.done']; }, run:function(A){ return M.startEpilogue(A); }},
  {from:'k2_pro', guard:'k2.pro.night'}, {from:'k2_pro_n', guard:'k2.s1.started'},
  {from:'k2_s1', guard:'k2.s1.night', when:function(G){ return G.flags['k2.s1.emina']; }, run:function(A){ return M.k2StartS1Night(A); }},
  {from:'k2_s1_n', guard:'k2.s2.started'}, {from:'k2_s2', guard:'k2.s2.night'},
  {from:'k2_s2_n', guard:'k2.i.started', when:function(G){ return G.flags['k2.s2.gone']; }, run:function(A){ return M.k2StartInterlude(A); }},
  {from:'k2_i', guard:'k2.s3.started'},
  {from:'k2_s3', guard:'k2.s3.night', when:function(G){ return true; }, run:function(A){ return M.k2CheckS3Night(A); }},   // prüft selbst, ob alle zugesagt haben
  {from:'k2_s3_n', guard:'k2.f2.started'}, {from:'k2_fin', guard:'k2.f2.night'},
  {from:'k2_fin_n', guard:'k2.epi.started', when:function(G){ return G.notes.indexOf('f2_bridge')>=0; }, run:function(A){ return M.k2StartEpilogue(A); }} ];
M.PENDING_X=M.PENDING_X||[];   // weitere Kapitel hängen ihre Regeln an (Kapitel 3: 96_k3_story.js)
M.resumePending=async function(A){ var G=A.G, PL=PENDING.concat(M.PENDING_X);
  for (var i=0;i<PL.length;i++){ var r=PL[i]; if (r.from!==G.phase) continue;
    if (r.guard && G.flags[r.guard]) delete G.flags[r.guard];
    if (r.run && r.when && r.when(G)){ var E=M.E, wb=E.busy; E.busy=true; try{ await r.run(A); } catch(e){ console.error(e); } finally{ E.busy=wb; } return r.from; } }
  return null; };
M.case3Call=async function(A){ if (M.case3CallImpl) return M.case3CallImpl(A); A.setFlag('c3.call'); };

// ---------------------------------------------------------------- Stadtplan
M.MAPLOCS=[
  {id:'flat',    name:'Markos Wohnung',        x:178,y:70, to:'flat',     at:[226,122,'L'], icon:'house'},
  {id:'varos',   name:'Veli Varoš',            x:132,y:52, to:'varos',    at:null, icon:'church'},
  {id:'riva',    name:'Riva',                  x:200,y:84, to:'riva',     at:null, icon:'palm'},
  {id:'matejuska',name:'Matejuška',            x:146,y:86, to:'matejuska',at:null, icon:'boat'},
  {id:'sustipan',name:'Sustipan',              x:116,y:112,to:'sustipan', at:null, icon:'pine'},
  {id:'bar',     name:'Bar „Bura“',            x:158,y:57, to:'bar',      at:null, icon:'cup'},   // etwas abgerückt: eigene Tippfläche neben der Wohnung
  {id:'oldtown', name:'Altstadt – Peristil',   x:214,y:62, to:'oldtown',  at:null, icon:'tower'},
  {id:'terminal',name:'Fährhafen & Busbahnhof',x:262,y:94, to:'terminal', at:null, icon:'ferry'},
  {id:'palma',   name:'Hotel Palma',           x:70, y:104,to:'palma',    at:null, icon:'hotel'}
];
function coastY(x){ return 76+Math.sin(x*0.03)*4+Math.sin(x*0.11)*1.5; }             // Nordufer des Hafens (Riva)
function marjanCoast(x){ return 104+Math.sin(x*0.07+1)*3+Math.sin(x*0.19)*1.2+Math.sin(x*0.5)*0.6; } // Südküste unter dem Marjan
function marjanEdge(y){ return 98+Math.sin(y*0.06+0.5)*7+Math.sin(y*0.17)*2.5; }             // Ostrand des Waldes
function land(x,y){ // Split-Halbinsel, stark vereinfacht: Festland im Norden, Hafenbecken, Sustipan, Marjan im Westen
  if (x<108 && y<marjanCoast(x)) return true;                                                // Marjan und Meje
  if (((x-116)*(x-116))/121+((y-100)*(y-100))/144<1) return true;                            // Sustipan
  if (x>=104 && x<134 && y<96-(x-104)*0.6) return true;                                      // Zvončac, zwischen Sustipan und Matejuška
  if (y<coastY(x)) return true;
  if (y<99 && y>=coastY(x)-1 && ((x>=246&&x<251)||(x>=264&&x<269)||(x>=282&&x<287))) return true; // Fähranleger
  var t=(x-250)/56; if (t>=0 && t<=1){ var by=110-t*24; if (Math.abs(y-by)<1.6) return true; }   // Wellenbrecher
  return false; }
function forest(x,y){ var e=marjanEdge(y)-x; return e>0 || (e>-6 && bayer(x,y)<(e+6)/6); }
function paintMap(S,GS){ var b=new M.Buf(320,144,P.k0);
  for (var y=0;y<144;y++) for (var x=0;x<320;x++) b.px(x,y,M.tex.boards(x,y,M.R('w0 w1 w2 w3'),7));
  var x0=8,y0=6,x1=312,y1=138;
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var c;
    if (!land(x,y)){ var dc=0; for (var k=1;k<5&&!dc;k++){ if (land(x,y-k)||land(x-k,y)||land(x+k,y)) dc=k; }
      c=M.rampAt(M.R('a3 a4 a5'),0.45+Math.sin(x*0.25+y*0.8)*0.06+(y-90)/160,x,y); if (dc && dc<3) c=P.a5; else if (dc===3 && bayer(x,y)<0.5) c=P.a5;
      if (((x+Math.floor(y/4)*7)%27===0)&&(y%5===0)) c=P.a5; }
    else if (forest(x,y)){ var e=1-Math.hypot((x-50)/56,(y-60)/44); c=M.rampAt(M.R('g2 g3 g4 g5'),0.25+Math.max(0,e)*0.6+(hash(x>>2,y/3|0)-0.5)*0.25,x,y);
      var fr=(Math.max(0,e)*7)%1; if (e>0.05 && fr<0.1) c=P.g2; if (hash(x,y)<0.05) c=P.g1; }
    else if (((x-116)*(x-116))/121+((y-100)*(y-100))/144<0.8){ c=M.tex.foliage(x,y,M.R('g3 g4 g5 g4')); } // Sustipan: Park mit Pinien
    else { c=M.tex.foliage(x,y,M.R('s4 s5 e4 s5')); }
    var u=x-x0, v=y-y0; if (u===Math.floor((x1-x0)/3)||u===Math.floor((x1-x0)*2/3)||v===Math.floor((y1-y0)/2)) c=M.DN[c];
    b.px(x,y,c); }
  // Küstenlinie
  for (y=y0+1;y<y1-1;y++) for (x=x0+1;x<x1-1;x++){ if (land(x,y) && (!land(x+1,y)||!land(x,y+1)||!land(x-1,y)||!land(x,y-1))) b.px(x,y,P.e1); }
  // Leuchtfeuer am Ende des Wellenbrechers
  b.rect(249,109,3,3,P.r2); b.px(250,108,P.s6);
  // Altstadt: der Palast mit Mauern und Ecktürmen
  b.rect(198,48,32,24,P.s3); for (var gx=200;gx<229;gx+=5) b.vl(gx,49,70,P.s2); for (var gy=52;gy<71;gy+=5) b.hl(199,228,gy,P.s2);
  b.hl(197,230,47,P.e1); b.hl(197,230,72,P.e1); b.vl(197,47,72,P.e1); b.vl(230,47,72,P.e1); [[197,47],[227,47],[197,69],[227,69]].forEach(function(q){ b.rect(q[0],q[1],4,4,P.e2); }); b.rect(210,56,8,8,P.s5);
  // Straßen
  [[120,40,300,46],[100,64,196,70],[150,28,158,76],[244,36,250,78],[232,60,300,64],[132,56,150,74]].forEach(function(s2){ b.line(s2[0],s2[1],s2[2],s2[3],P.e2); });
  for (x=12;x<104;x++){ var my=Math.round(marjanCoast(x))-4; if (x%4<3) b.px(x,my,P.e3); } // Uferweg unter dem Marjan
  for (var i=0;i<60;i++){ var px=14+Math.floor(hash(i,7)*80), py=14+Math.floor(hash(i,9)*80); if (forest(px,py) && land(px,py)) b.px(px,py,P.g1); }
  // Riva-Linie
  for (x=150;x<244;x++){ var yy=Math.round(coastY(x))-2; if (x%3) b.px(x,yy,P.g2); }
  // Kartusche + Kompass
  b.rect(16,118,58,16,P.s5); b.hl(16,73,118,P.e1); b.hl(16,73,133,P.e1); b.vl(16,118,133,P.e1); b.vl(73,118,133,P.e1); M.microText(b,'SPLIT',30,121,P.e0); M.microText(b,'2011',34,127,P.e2);
  var cx=290,cy=24; b.line(cx,cy-9,cx,cy+9,P.e1); b.line(cx-9,cy,cx+9,cy,P.e1); b.poly([[cx,cy-10],[cx+2,cy],[cx,cy+10],[cx-2,cy]],P.r2); M.text(b,'N',cx-2,cy-19,P.e1);
  M.microText(b,'MARJAN',37,53,P.g5); M.microText(b,'MARJAN',36,52,P.g0); M.microText(b,'LUKA',190,100,P.a1); M.microText(b,'KANAL BRAČ',196,128,P.a2);
  M.MAPLOCS.forEach(function(L){ var v=M.mapIconVis?M.mapIconVis(L.id,GS):!!GS.map[L.id]; if (v!==null) drawIcon(b,L,v); });   // unbekannte Orte erscheinen nicht
  M.light(b,M.lf.sum(M.lf.pool(170,64,200,110,1.1),M.lf.vignette(320,144,2.2),M.lf.k(-0.3)));
  return b; }
function drawIcon(b,L,on){ var x=L.x, y=L.y, c=on?P.k1:P.e3, f=on?P.r2:P.e4;
  switch(L.icon){
    case 'house': b.rect(x-4,y-6,9,7,f); b.poly([[x-5,y-6],[x,y-10],[x+5,y-6]],c); b.px(x,y-3,on?P.y4:c); break;
    case 'church': b.rect(x-3,y-7,7,8,f); b.rect(x-1,y-12,3,5,c); b.px(x,y-13,c); break;
    case 'palm': b.vl(x,y-8,y,c); b.line(x,y-8,x-4,y-6,on?P.g2:c); b.line(x,y-8,x+4,y-6,on?P.g2:c); b.line(x,y-8,x-3,y-10,on?P.g2:c); b.line(x,y-8,x+3,y-10,on?P.g2:c); break;
    case 'boat': b.poly([[x-6,y-3],[x+6,y-3],[x+4,y],[x-4,y]],f); b.vl(x,y-10,y-3,c); b.poly([[x,y-10],[x+4,y-4],[x,y-4]],on?P.s6:c); break;
    case 'pine': b.poly([[x,y-11],[x+5,y-3],[x-5,y-3]],on?P.g2:c); b.vl(x,y-3,y,c); break;
    case 'cup': b.rect(x-3,y-5,6,5,on?P.s6:f); b.px(x+3,y-4,c); b.px(x+3,y-3,c); b.hl(x-4,x+3,y,c); break;
    case 'tower': b.rect(x-2,y-12,5,13,f); b.poly([[x-2,y-12],[x,y-16],[x+2,y-12]],c); b.px(x,y-8,on?P.y4:c); break;
    case 'ferry': b.poly([[x-8,y-3],[x+8,y-3],[x+6,y],[x-6,y]],on?P.s6:f); b.rect(x-4,y-6,8,3,on?P.s5:f); b.rect(x+2,y-8,2,2,on?P.r3:c); break;
    case 'hotel': b.rect(x-5,y-9,11,10,f); for (var i=0;i<3;i++){ b.px(x-3+i*3,y-6,on?P.y4:c); b.px(x-3+i*3,y-3,on?P.y4:c); } b.hl(x-6,x+6,y-10,c); break; }
  if (on && !M.mapNoNames) M.text(b,L.name,Math.max(10,Math.min(306-M.textWidth(L.name),x-(M.textWidth(L.name)>>1))),y+3,P.k1,P.s5); }   // im Stadtplan setzt 17_map.js die Namen selbst (ohne Überlappung)
M.defineRoom({ id:'map', name:'Stadtplan', width:320, noActor:true, noVerbs:true, noSave:true, noSwitch:true, noGhostView:true, prompt:'Wohin?', verbText:'Gehe zu',
  paint:function(S,GS){ return paintMap(S,GS); }, walk:function(){ return false; }, scape:'map',
  hotspots:M.MAPLOCS.map(function(L){ return {id:'loc_'+L.id,name:L.name,vis:function(S,GS){ return !!GS.map[L.id]; },r:[L.x-16,L.y-16,32,30],
    go:async function(A){ var ok=M.canTravel?await M.canTravel(A,L):true; if (!ok) return; var from=M.E.mapFrom||'flat'; await A.goto(L.to,{x:L.at?L.at[0]:undefined,y:L.at?L.at[1]:undefined,f:L.at?L.at[2]:undefined}); }}; }).concat([
    {id:'back',name:'Zurück',r:[0,0,0,0],noReveal:true}])
});
M.defineScape('map',{beds:['seaFar'],ev:[['gull',10,25,0.4,-1,1],['horn',30,60,0.4,-0.6,0.6]],step:'none'});

// ---------------------------------------------------------------- Titelbild: Split bei Nacht, der Glockenturm, eine Gestalt auf der Mole
M.paintTitle=function(){ var b=new M.Buf(320,144,P.k0), x, y, i; M.sky(b,0,0,320,80,'night',17); M.moon(b,262,20,4);
  // Mosor hinter der Stadt, sehr dunkel
  for (x=0;x<320;x++){ var ry=Math.round(60+Math.sin(x*0.021+1)*4+Math.sin(x*0.067)*2); for (y=ry;y<80;y++) b.px(x,y,bayer(x,y)<0.3?P.n0:P.k1); }
  M.scn.marjan(b,0,120,80,52,'night');
  var r=M.rng(33), base=80;
  // hintere Häuserreihe: dunkle Wände, Ziegeldächer, wenige Fenster
  for (x=104;x<320;){ var w=8+Math.floor(r()*9), h=10+Math.floor(r()*10), top=base-h-6;
    for (y=top;y<base;y++) for (var xx=x;xx<Math.min(320,x+w);xx++){ var c=(xx===x)?P.k1:(bayer(xx,y)<0.5?P.n0:P.k2); b.px(xx,y,c); }
    for (xx=x;xx<Math.min(320,x+w);xx++){ b.px(xx,top-1,P.t1); if (bayer(xx,top)<0.6) b.px(xx,top,P.t0); }
    for (i=0;i<3;i++) if (r()<0.45){ var wx=x+2+Math.floor(r()*(w-3)), wy=top+3+Math.floor(r()*(h-4)); b.px(wx,wy,r()<0.5?P.y3:P.y2); if (r()<0.5) b.px(wx,wy+1,P.y1); }
    x+=w; }
  // Palastfront an der Riva, von unten angestrahlt
  for (y=68;y<base;y++) for (x=148;x<252;x++){ var c2=M.rampAt(M.R('n1 s1 s2 s3'),(y-68)/12,x,y); var ax=(x-150)%9; if (y>71 && y<78 && ax>2 && ax<7) c2=(y<73&&(ax===3||ax===6))?P.s1:P.k1; if (y===68) c2=P.s2; b.px(x,y,c2); }
  for (x=152;x<250;x+=9) if (r()<0.5){ b.px(x+4,75,P.y3); b.px(x+4,76,P.y2); }
  // Glockenturm von Sv. Duje, angestrahlt
  var tx=224, ty0=42; for (y=ty0;y<base;y++){ var top6=y<ty0+6, hw=top6?Math.round((y-ty0)*0.6):3, band=(y-ty0-6)%7, lvl=Math.floor((y-ty0-6)/7);
    for (x=tx-hw;x<=tx+hw;x++){ var cc=x<tx?P.s3:(x===tx?P.s3:P.s2); if (top6) cc=x<=tx?P.s2:P.s1; if (x===tx-hw && !top6) cc=P.s4;
      if (!top6 && band===0) cc=P.s4; // Gesims
      if (!top6 && band>=2 && band<=5){ var offs=lvl<1?[-2,0,2]:(lvl<3?[-1,1]:[0]); if (offs.indexOf(x-tx)>=0) cc=(band===2)?P.s1:P.k1; }
      b.px(x,y,cc); } }
  b.px(tx,ty0-1,P.s3); b.px(tx,ty0-2,P.s2); b.px(tx+1,ty0+24,P.y3);
  // Palmen an der Riva
  [160,184,236,250].forEach(function(px){ for (y=66;y<base;y++) b.px(px+((y<72)?1:0),y,P.k0); [[-6,-2],[-4,-4],[0,-5],[4,-4],[6,-2],[-5,1],[5,1]].forEach(function(f){ b.line(px+1,66,px+1+f[0],66+f[1],P.k0); }); });
  // Laternen an der Uferlinie
  for (x=150;x<252;x+=17){ b.px(x,79,P.y4); b.px(x,78,P.y3); }
  M.sea(b,0,80,320,64,'night',0,0);
  // Mole
  b.rect(0,98,170,6,P.s1); b.hl(0,169,98,P.s2); for (x=0;x<170;x+=20){ M.prop.bollard(b,x+8,98); }
  M.prop.lamp(b,150,98,22,true); M.prop.lamp(b,60,98,22,true);
  return b; };
M.titleDynamic=function(fb,t){ for (var y=80;y<144;y++) for (var x=0;x<320;x++){ if (y>=96&&y<=104&&x<170) continue; var s=Math.sin(x*0.11+y*0.9+t*1.2)+Math.sin(x*0.04-t*0.5+y*0.3); if (s>1.55 && (y&1)) fb.px(x,y,P.n3); }
  M.glints(fb,150,104,140,12,t,P.y3,0); M.glints(fb,262,82,140,8,t,P.n4,0); M.glints(fb,60,104,140,10,t,P.y2,0); M.glints(fb,200,81,96,30,t,P.y2,0);
  // Mala auf der Mole: kaum mehr als ein Schimmer
  var mx=118, my=97, a=0.5+Math.sin(t*0.7)*0.15; M.drawPose(fb,mx,my,M.poseF({},'B'),'B','mala',{lut:M.TINT.mala.a,alpha:a,t:t*1000,wobble:1,h:144});
  // Fähre am Horizont
  var fx=Math.round((t*3)%380)-40; M.prop.ferry(fb,fx,84,26,true); };

// ---------------------------------------------------------------- Ende
M.CREDITS=['DIE STILLEN','Kapitel 1: Split','','','Marko Vuković','Mala','','Ivka Perić, die wartete','Luka Radić, der unterwegs war','Bruno Lalić, der keine Worte mehr hatte','',
  'Zdenka · Mladen · Dinko · Sanja','Stipe & Frane · Nina · Mira · Ljerka','Jakov Matošić, der für die Namen fegt','und Anka, unsere Kleine','','',
  'Alle Bilder, Töne und Lieder','entstehen im Spiel selbst.','Die Orte sind Split nachempfunden.','Manche gibt es nicht.','','','FORTSETZUNG','Kapitel 2: Sarajevo','','','',''];
M.endChapter=async function(A){ M.GS.ended=true; if (M.storeC1End) M.storeC1End(M.GS); M.E.markChapterEnd(1);   // Platz bleibt als „Kapitelende“ belegt (UI-Konzept D3)
  if (await M.kinoOutro(A,1)) M.E.fade=0;
  M.E.creditLines=M.CREDITS; M.E.creditMusic='end'; M.E.afterCredits=M.ROOMS.stanica?'ch2':null; M.E.startCredits(); };
// Testräume aus reiner Kunst (für die Entwicklung): jede M.ART-Definition ohne Raumlogik wird ein einfacher Raum
M.artTestRooms=function(){ Object.keys(M.ART).forEach(function(id){ if (M.ROOMS[id]) return; var A=M.ART[id];
  M.defineRoom({id:id,name:id,width:A.width||320,paint:A.paint,layers:A.layers,walk:A.walk,walkG:A.walkG,dynamic:A.dynamic,front:A.front,ghost:A.ghost,actorLut:A.actorLut,start:A.start,entries:A.entries,scape:A.scape||id,
    actors:function(){ return Object.keys(A.actorPos||{}).map(function(k){ var p=A.actorPos[k]; return {id:k,ch:p[3]||k,x:p[0],y:p[1],f:p[2]||'L',ghost:!!p[4],idle:p[5]||null}; }).filter(function(a){ return M.CHARS[a.ch]; }); },
    hotspots:Object.keys(A.spots||{}).map(function(k){ return {id:k,name:k,r:A.spots[k],st:(A.stands||{})[k],look:'('+k+')'}; })}); }); };
M.boot=function(){ M.artTestRooms(); if (M.pickTitle) M.pickTitle(); M.E.screen='title'; M.E.titleMode='main'; };
})(M);
