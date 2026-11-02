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
  c2:       {tod:'day',  weather:'bura', case:'c2', title:'Zweiter Fall – Das letzte Schiff nach Ancona', short:'Zweiter Fall', when:'Donnerstag, 17. November · Bura'},
  c2_night: {tod:'night',weather:'bura', case:'c2', title:'Zweiter Fall – Das letzte Schiff nach Ancona', short:'Zweiter Fall, Abend', when:'Donnerstag · Abend'},
  i2:       {tod:'night',weather:'calm', case:'c2', title:'Zwischenspiel – Sustipan', short:'Zwischenspiel', when:'Donnerstag · spät'},
  c3:       {tod:'dusk', weather:'rain', case:'c3', title:'Dritter Fall – Der Nachtportier', short:'Dritter Fall', when:'Freitag, 18. November · Abend'},
  c3_night: {tod:'night',weather:'rain', case:'c3', title:'Dritter Fall – Der Nachtportier', short:'Dritter Fall, Nacht', when:'Freitag · Nacht'},
  epi:      {tod:'dawn', weather:'calm', case:'epi',title:'Epilog – Die Straße nach Osten', short:'Epilog', when:'Samstag, 19. November · Morgengrauen'}
});
function phaseIn(GS,list){ return list.indexOf(GS.phase)>=0; }
M.phaseIn=phaseIn;

// ---------------------------------------------------------------- Spielstart: Prolog
M.startGame=async function(A){ var E=M.E; E.busy=true;
  try{ M.setPhase('pro'); M.GS.pos.marko={room:'flat',x:200,y:118,f:'L'}; A.unlock('flat');
    E.screen='card'; await A.card({kicker:'Prolog',title:'Die Stillen',sub:'Split',time:'Dienstag, 15. November 2011 · Nachmittag',ms:4400});
    await A.goto('flat',{x:200,y:118,f:'L',noEnter:true});
    A.music('flat'); await A.wait(400);
    await A.narrate('Seit drei Tagen Jugo. Warmer Regen, schwere Luft, und ein Kopf wie Blei.');
    A.headache(2200); await A.animM('headache'); await A.m('…Kopfschmerzen. Natürlich.');
    await A.m('Der Anrufbeantworter blinkt.');
  } finally { E.busy=false; } A.save(); };
// nach Ivkas Wohnung: zurück nach Hause, Abend
M.endProVisit=async function(A){ A.phase('pro_eve'); await A.fade(8,700); await A.goto('flat',{x:226,y:122,f:'L',noEnter:false}); };
// Fall 1 beginnt (nach der Nacht)
M.startCase1=async function(A){ M.E.screen='card'; await A.card({kicker:'Erster Fall',title:'Das Boot um sieben',time:'Mittwoch, 16. November · Abend',ms:4400});
  A.phase('c1'); await A.goto('flat',{x:200,y:118,f:'L',noEnter:true}); await A.fade(0,600);
  A.sfx('phone'); await A.wait(1200); await A.m('Vesna.');
  await A.phoneVoice('„Marko. Dein Text über Ivka Perić ist gut. Er kommt morgen. Ein bisschen traurig, aber das sind sie alle.“');
  await A.m('Danke. Ich habe schlecht geschlafen.'); await A.phoneVoice('„Du schläfst immer schlecht. Geh raus. An die Luft. Ciao.“');
  await A.m('Sie hat recht. Die Riva. Ein bisschen Luft, ein bisschen Meer. Nichts weiter.'); A.unlock('riva'); A.save(); };
M.case3Call=async function(A){ if (M.case3CallImpl) return M.case3CallImpl(A); A.setFlag('c3.call'); };

// ---------------------------------------------------------------- Stadtplan
M.MAPLOCS=[
  {id:'flat',    name:'Markos Wohnung',        x:178,y:70, to:'flat',     at:[226,122,'L'], icon:'house'},
  {id:'varos',   name:'Veli Varoš',            x:132,y:52, to:'varos',    at:null, icon:'church'},
  {id:'riva',    name:'Riva',                  x:200,y:84, to:'riva',     at:null, icon:'palm'},
  {id:'matejuska',name:'Matejuška',            x:146,y:86, to:'matejuska',at:null, icon:'boat'},
  {id:'sustipan',name:'Sustipan',              x:116,y:112,to:'sustipan', at:null, icon:'pine'},
  {id:'bar',     name:'Bar „Bura“',            x:166,y:62, to:'bar',      at:null, icon:'cup'},
  {id:'oldtown', name:'Altstadt – Peristil',   x:214,y:62, to:'oldtown',  at:null, icon:'tower'},
  {id:'terminal',name:'Fährhafen & Busbahnhof',x:262,y:94, to:'terminal', at:null, icon:'ferry'},
  {id:'palma',   name:'Hotel Palma',           x:70, y:104,to:'palma',    at:null, icon:'hotel'}
];
function coastY(x){ return 76+Math.sin(x*0.03)*4+Math.sin(x*0.11)*1.5; }
function land(x,y){ // Split-Halbinsel, stark vereinfacht: Festland im Norden, Hafenbecken, Sustipan-Zunge, Marjan im Westen
  if (y<coastY(x)) return true;
  if (x>98 && x<126 && y<120-((x-112)*(x-112))/10) return true;             // Sustipan
  if (x<96 && y<112-(x*0.12)) return true;                                 // Marjan-Küste
  if (x>236 && x<300 && y<104 && y>=coastY(x)) return y<92+((x-236)/64)*6;  // Hafenmole Ost
  return false; }
function paintMap(S,GS){ var b=new M.Buf(320,144,P.k0);
  for (var y=0;y<144;y++) for (var x=0;x<320;x++) b.px(x,y,M.tex.boards(x,y,M.R('w0 w1 w2 w3'),7));
  var x0=8,y0=6,x1=312,y1=138;
  for (y=y0;y<y1;y++) for (x=x0;x<x1;x++){ var c; if (!land(x,y)){ c=M.rampAt(M.R('a3 a4 a5'),0.45+Math.sin(x*0.25+y*0.8)*0.06+(y-90)/160,x,y); if (((x+Math.floor(y/4)*7)%27===0)&&(y%5===0)) c=P.a5; }
    else { c=M.tex.foliage(x,y,M.R('s4 s5 e4 s5')); if (x<104 && y<100) c=M.rampAt(M.R('g3 g4 g5'),0.3+hash(Math.floor(x/4),Math.floor(y/3))*0.5,x,y); }
    var u=x-x0, v=y-y0; if (u===Math.floor((x1-x0)/3)||u===Math.floor((x1-x0)*2/3)||v===Math.floor((y1-y0)/2)) c=M.DN[c];
    b.px(x,y,c); }
  // Küstenlinie
  for (y=y0+1;y<y1-1;y++) for (x=x0+1;x<x1-1;x++){ if (land(x,y) && (!land(x+1,y)||!land(x,y+1)||!land(x-1,y)||!land(x,y-1))) b.px(x,y,P.e1); }
  // Altstadt (Palast) als Raster
  b.rect(196,50,34,22,P.s3); for (var gx=198;gx<230;gx+=5) b.vl(gx,50,71,P.s2); for (var gy=52;gy<72;gy+=5) b.hl(196,229,gy,P.s2); b.rect(208,56,8,8,P.s5);
  // Straßen
  [[120,40,300,48],[100,64,240,72],[150,30,160,76],[240,40,250,80],[60,80,140,70]].forEach(function(s){ b.line(s[0],s[1],s[2],s[3],P.e2); });
  // Riva-Linie
  for (x=150;x<248;x++){ var yy=Math.round(coastY(x))-2; if (x%3) b.px(x,yy,P.g2); }
  // Kartusche + Kompass
  b.rect(16,118,58,16,P.s5); b.hl(16,73,118,P.e1); b.hl(16,73,133,P.e1); b.vl(16,118,133,P.e1); b.vl(73,118,133,P.e1); M.microText(b,'SPLIT',30,121,P.e0); M.microText(b,'2011',34,127,P.e2);
  var cx=290,cy=24; b.line(cx,cy-9,cx,cy+9,P.e1); b.line(cx-9,cy,cx+9,cy,P.e1); b.poly([[cx,cy-10],[cx+2,cy],[cx,cy+10],[cx-2,cy]],P.r2); M.text(b,'N',cx-2,cy-19,P.e1);
  M.microText(b,'MARJAN',40,40,P.g1); M.microText(b,'LUKA',190,104,P.a1); M.microText(b,'KANAL BRAČ',200,130,P.a2);
  M.MAPLOCS.forEach(function(L){ drawIcon(b,L,!!GS.map[L.id]); });
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
  if (on) M.text(b,L.name,Math.max(10,Math.min(306-M.textWidth(L.name),x-(M.textWidth(L.name)>>1))),y+3,P.k1,P.s5); }
M.defineRoom({ id:'map', name:'Stadtplan', width:320, noActor:true, noVerbs:true, noSave:true, noSwitch:true, noGhostView:true, prompt:'Wohin?', verbText:'Gehe zu',
  paint:function(S,GS){ return paintMap(S,GS); }, walk:function(){ return false; }, scape:'map',
  hotspots:M.MAPLOCS.map(function(L){ return {id:'loc_'+L.id,name:L.name,vis:function(S,GS){ return !!GS.map[L.id]; },r:[L.x-16,L.y-16,32,30],
    go:async function(A){ var ok=M.canTravel?await M.canTravel(A,L):true; if (!ok) return; var from=M.E.mapFrom||'flat'; await A.goto(L.to,{x:L.at?L.at[0]:undefined,y:L.at?L.at[1]:undefined,f:L.at?L.at[2]:undefined}); }}; }).concat([
    {id:'back',name:'Zurück',r:[0,0,0,0],noReveal:true}])
});
M.defineScape('map',{beds:['seaFar'],ev:[['gull',10,25,0.4,-1,1],['horn',30,60,0.4,-0.6,0.6]],step:'none'});

// ---------------------------------------------------------------- Titelbild: Split bei Nacht, der Glockenturm, eine Gestalt auf der Mole
M.paintTitle=function(){ var b=new M.Buf(320,144,P.k0); M.sky(b,0,0,320,78,'night',17); M.moon(b,252,18,4);
  M.scn.marjan(b,0,120,78,52,'night'); M.scn.roofs(b,96,320,78,'night',33,{min:8,var:14,lit:0.4}); M.scn.belltower(b,214,78,44,P.k1,true);
  for (var x=96;x<320;x+=13) M.scn.belltower;
  M.sea(b,0,78,320,66,'night',0,0);
  // Mole
  b.rect(0,98,170,6,P.s1); b.hl(0,169,98,P.s2); for (x=0;x<170;x+=20){ M.prop.bollard(b,x+8,98); }
  M.prop.lamp(b,150,98,22,true); M.prop.lamp(b,60,98,22,true);
  return b; };
M.titleDynamic=function(fb,t){ for (var y=80;y<144;y++) for (var x=0;x<320;x++){ if (y>=96&&y<=104&&x<170) continue; var s=Math.sin(x*0.11+y*0.9+t*1.2)+Math.sin(x*0.04-t*0.5+y*0.3); if (s>1.55 && (y&1)) fb.px(x,y,P.n3); }
  M.glints(fb,150,104,140,12,t,P.y3,0); M.glints(fb,252,82,140,8,t,P.n4,0); M.glints(fb,60,104,140,10,t,P.y2,0);
  // Mala auf der Mole: kaum mehr als ein Schimmer
  var mx=118, my=97, a=0.5+Math.sin(t*0.7)*0.15; M.drawPose(fb,mx,my,M.poseF({},'B'),'B','mala',{lut:M.TINT.mala.a,alpha:a,t:t*1000,wobble:1,h:144});
  // Fähre am Horizont
  var fx=Math.round((t*3)%380)-40; M.prop.ferry(fb,fx,84,26,true); };

// ---------------------------------------------------------------- Ende
M.CREDITS=['MALA','Kapitel 1: Split','','','Marko Vuković','Mala','','Ivka Perić, die wartete','Luka Radić, der unterwegs war','Bruno Lalić, der keine Worte mehr hatte','',
  'Zdenka · Mladen · Dinko · Sanja','Stipe & Frane · Nina · Mira · Ljerka','und Jakov, der Wege fegt, die es nicht mehr gibt','','',
  'Alle Bilder, Töne und Lieder','entstehen im Spiel selbst.','Die Orte sind Split nachempfunden.','Manche gibt es nicht.','','','FORTSETZUNG','Kapitel 2: Sarajevo','','','',''];
M.endChapter=async function(A){ M.GS.ended=true; try{ localStorage.removeItem('mala.save.'+M.E.slot()); }catch(e){} await A.fade(8,1400); M.E.fade=0; M.E.startCredits(); };
// Testräume aus reiner Kunst (für die Entwicklung): jede M.ART-Definition ohne Raumlogik wird ein einfacher Raum
M.artTestRooms=function(){ Object.keys(M.ART).forEach(function(id){ if (M.ROOMS[id]) return; var A=M.ART[id];
  M.defineRoom({id:id,name:id,width:A.width||320,paint:A.paint,layers:A.layers,walk:A.walk,walkG:A.walkG,dynamic:A.dynamic,front:A.front,ghost:A.ghost,actorLut:A.actorLut,start:A.start,entries:A.entries,scape:A.scape||id,
    actors:function(){ return Object.keys(A.actorPos||{}).map(function(k){ var p=A.actorPos[k]; return {id:k,ch:p[3]||k,x:p[0],y:p[1],f:p[2]||'L',ghost:!!p[4],idle:p[5]||null}; }).filter(function(a){ return M.CHARS[a.ch]; }); },
    hotspots:Object.keys(A.spots||{}).map(function(k){ return {id:k,name:k,r:A.spots[k],st:(A.stands||{})[k],look:'('+k+')'}; })}); }); };
M.boot=function(){ M.artTestRooms(); M.E.screen='title'; M.E.titleMode='main'; };
})(M);
