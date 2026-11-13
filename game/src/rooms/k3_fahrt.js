/* ===== rooms/k3_fahrt.js — Fahrtszene nach Skela und zurück (Kapitel 3). Statt nur eines Satzes über dem Ausgangsraum fährt das Taxi bzw.
   Dinos Roller durchs Neretvatal; Erzähltext und Gespräche laufen darüber (Kunst: rooms/art/k3_fahrt.js).
   M.k3Drive(A, kind, fn): wechselt in die Szene (ohne Speichern, ohne Raum-Ereignisse), setzt die Mitfahrer, fährt an, spielt fn() (die
   bisherigen Texte), bremst und kehrt zurück; danach geht die Reise wie bisher an ihr Ziel. In der Trockenprüfung des Stadtplans und ohne
   Bildschirm (VM-Tests) läuft nur fn(). M.k3RideGo / M.k3RideStop: Anfahren und Anhalten an der passenden Stelle im Text. ===== */
(function(M){
'use strict';
var S=M.poseS, A_=M.ANIMS, GY=108;
// ---------------------------------------------------------------- Haltungen: im Auto sitzen und lenken, auf dem Roller fahren und mitfahren, Mala schwebt mit
function sp(o){ var p={h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1}, k; for (k in o) p[k]=o[k]; return S(p); }
A_.carRide=[[sp({}),1600],[sp({ho:[0,-1]}),900],[sp({hd:'b'}),110],[sp({}),1300],[sp({ho:[1,0]}),1400],[sp({ho:[1,0],hd:'b'}),110],[sp({ho:[1,0]}),900]];
A_.carRideTalk=[[sp({hd:'o'}),140],[sp({}),130],[sp({hd:'o',nh:[8,-18]}),140],[sp({nh:[8,-18]}),150]];
A_.carDrive=[[sp({nh:[10,-22],fh:[9,-22]}),1500],[sp({nh:[10,-21],fh:[9,-22]}),600],[sp({nh:[10,-22],fh:[9,-21],hd:'b'}),110],[sp({nh:[10,-22],fh:[9,-22]}),1200],[sp({nh:[9,-22],fh:[9,-22],ho:[1,0]}),900]];
A_.carDriveTalk=[[sp({nh:[10,-22],fh:[9,-22],hd:'o'}),140],[sp({nh:[10,-22],fh:[9,-22]}),130],[sp({nh:[10,-22],fh:[9,-22],hd:'o',hb:1}),160],[sp({nh:[10,-22],fh:[9,-22],hb:1}),140]];
A_.carGhost=[[sp({h:[0,-14]}),900],[sp({h:[0,-15],ho:[0,-1]}),900]];
function rd(o){ var p={h:[0,-20],nf:[7,-6,'f'],ff:[6,-6,'f'],nh:[12,-29],fh:[11,-29],sit:1,ln:1}, k; for (k in o) p[k]=o[k]; return S(p); }
A_.scootDrive=[[rd({}),900],[rd({h:[0,-21]}),300],[rd({}),1200],[rd({hd:'b'}),110],[rd({}),900],[rd({ho:[1,0]}),700]];
A_.scootDriveTalk=[[rd({hb:1,hd:'o'}),150],[rd({hb:1}),130],[rd({hb:1,hd:'o'}),140],[rd({hb:1}),140],[rd({hd:'o'}),150],[rd({}),160]];   // spricht über die Schulter nach hinten
function rp(o){ var p={h:[0,-21],nf:[8,-7,'f'],ff:[7,-7,'f'],nh:[4,-19],fh:[3,-19],sit:1}, k; for (k in o) p[k]=o[k]; return S(p); }
A_.scootRide=[[rp({}),1300],[rp({ho:[0,-1]}),700],[rp({hd:'b'}),110],[rp({}),1100],[rp({ho:[1,0]}),900],[rp({hb:1}),1100],[rp({}),600]];
A_.scootRideTalk=[[rp({hd:'o'}),140],[rp({}),130],[rp({hd:'o',ho:[1,0]}),140],[rp({ho:[1,0]}),150]];
function rg(o){ var p={h:[0,-24],nf:[6,-10,'f'],ff:[5,-10,'f'],nh:[9,-30],fh:[8,-30],sit:1}, k; for (k in o) p[k]=o[k]; return S(p); }
A_.scootGhost=[[rg({}),800],[rg({h:[0,-25],ho:[0,-1]}),800],[rg({hb:1}),1400],[rg({}),700]];
// Sitzplätze je Fahrt: Marko, Mitfahrer, Mala (x, y = Fußpunkt)
var SEATS={
  taxi:{f:'R',marko:[152,GY+1],mkIdle:'carRide',mkTalk:'carRideTalk',npc:{id:'taxist',ch:'taxist',x:166,y:GY+1,idle:'carDrive',talk:'carDriveTalk'},mala:[147,GY],mlIdle:'carGhost'},
  taxiBack:{f:'L',marko:[168,GY+1],mkIdle:'carRide',mkTalk:'carRideTalk',npc:{id:'taxist',ch:'taxist',x:154,y:GY+1,idle:'carDrive',talk:'carDriveTalk'},mala:[173,GY],mlIdle:'carGhost'},
  dino:{f:'R',marko:[147,GY],mkIdle:'scootRide',mkTalk:'scootRideTalk',npc:{id:'dino',ch:'dino',x:158,y:GY,idle:'scootDrive',talk:'scootDriveTalk'},mala:[137,GY-1],mlIdle:'scootGhost'}
};
M.K3_SEATS=SEATS;
M.defineScape('k3_fahrt',function(o){ var S=o.S||{}, n=o.tod==='night'; return { beds:S.kind==='dino'?['moped','windHigh']:(n?['engine','room']:['engine','city']), step:'none',
  ev:S.kind==='dino'?[['dog',18,40,0.25,-0.8,0.8]]:[['radio',9,20,0.18,-0.2,0.2],['dog',22,45,0.2,-0.8,0.8]] }; });
M.room('k3_fahrt',{ name:'Unterwegs', noSave:true, noFollow:true, noGhostView:true, scape:'k3_fahrt', narrY:30,
  state:function(){ return {kind:'taxi',t0:0,stop:0,riders:[]}; },
  actors:function(S,G){ var st=SEATS[S.kind]||SEATS.taxi, L=[], n=st.npc;
    L.push({id:n.id,ch:n.ch,x:n.x,y:n.y,f:st.f,idle:n.idle,talk:n.talk,routine:false,noShadow:true,name:n.id==='dino'?'Dino':'Taxifahrer'});
    if (S.mala) L.push({id:'mala_ride',ch:'mala',x:st.mala[0],y:st.mala[1],f:st.f,ghost:true,idle:st.mlIdle,routine:false,name:'Mala'});
    return L; },
  hotspots:[] });
// ---------------------------------------------------------------- Ablauf
M.k3RideGo=function(A){ if (A!==M.API) return; var R=A.R('k3_fahrt'); if (M.E.room && M.E.room.id==='k3_fahrt' && !R.t0) R.t0=A.gt; };
M.k3RideStop=function(A){ if (A!==M.API) return; var R=A.R('k3_fahrt'); if (M.E.room && M.E.room.id==='k3_fahrt' && R.t0 && !R.stop) R.stop=A.gt; };
M.k3Drive=async function(A,kind,fn,opt){ opt=opt||{}; var G=A.G, E=M.E;
  if (A!==M.API || !M.ROOMS.k3_fahrt || !E.room || E.screen!=='game' || M.noRides || M.TEST_NORIDE){ await fn(); return; }
  var from=E.room.id, mk0=E.ACT.marko, ma0=E.ACT.mala, st=SEATS[kind]||SEATS.taxi;
  M.k3RideFrom=from;
  var R=A.R('k3_fahrt'); R.kind=kind; R.mala=!!(G.malaOn && ma0 && E.actorShown(ma0) && G.pos.mala.room===from); R.t0=0; R.stop=0; R.riders=[];
  var orc=M.onRoomChange; M.onRoomChange=null;   // kein Ortswechsel im Sinne der Geschichte: Zähler und Warteschlangen bleiben unberührt
  try{ await A.goto('k3_fahrt',{x:st.marko[0],y:st.marko[1],f:st.f,keepPos:true,noSave:true,noEnter:true,fadeMs:360}); }
  finally{ M.onRoomChange=orc; }
  var mk=A.npc('marko'); mk.place(st.marko[0],st.marko[1],st.f); mk.idle(st.mkIdle); mk.set('talk',st.mkTalk); mk.set('noShadow',true);
  R.riders=[{id:'marko',y:st.marko[1]},{id:st.npc.id,y:st.npc.y}]; if (R.mala) R.riders.push({id:'mala_ride',y:st.mala[1]});
  if (!opt.waitStart) R.t0=A.gt;
  await A.wait(opt.lead===undefined?900:opt.lead);
  await fn();
  if (!R.t0) R.t0=A.gt;
  await A.wait(opt.tail===undefined?600:opt.tail);
  if (!R.stop) R.stop=A.gt;
  await A.wait(1300); };
})(M);
// ---------------------------------------------------------------- Vorschau ohne Spielfortschritt: index.html?fahrt=skela | zurueck | nacht
// Stellt den Samstag in Mostar her (nur im Speicher), fährt über dieselbe Reiseprüfung wie im Spiel (mit der Auswahl Taxi/Roller) und lädt
// danach das Titelbild neu. Nichts wird gespeichert: die beteiligten Räume gelten für die Dauer der Vorschau als „nicht speichern“.
M.k3RidePreviewKind=function(){ try{ var m=/[?&]fahrt=([a-z]+)/.exec(location.search||''); return m?m[1]:null; }catch(e){ return null; } };
M.k3RidePreview=async function(kind){ var A=M.API, E=M.E, G=M.GS, night=kind==='nacht', back=kind==='zurueck';
  ['ostbus','skela_d','herberge','k3_fahrt'].forEach(function(id){ if (M.ROOMS[id]) M.ROOMS[id].noSave=true; });
  M.setPhase(night?'k3_d2_n':'k3_d2'); Object.assign(G.flags,{'k3.rules':2,'k3.z.mala':true,'k3.v.part1':true,'k3.b.arrived':true,'k3.b.jela':true,'k3.s.photo':true,'k3.dino.ride':!night&&!back});
  G.map=G.map||{}; ['ostbus','herberge','kujundziluk','starimost','skela'].forEach(function(k){ G.map[k]=true; }); if (G.inv.indexOf('plan')<0) G.inv.push('plan');
  var from=back?'skela_d':'ostbus', R=M.ROOMS[from], st=R.start||[160,124,'R']; G.rooms[from]=Object.assign(R.state?R.state(G):{},G.rooms[from]||{});
  G.malaOn=true; G.pos.marko={room:from,x:st[0],y:st[1],f:'R'}; G.pos.mala={room:from,x:st[0]+24,y:st[1]-2,f:'R'};
  await M.gotoRoom(from,{fade:false,noEnter:true,noSave:true,x:st[0],y:st[1],f:'R'}); A.malaJoin({fadeIn:false}); E.screen='game'; E.busy=true;
  try{ await A.wait(1200); var L=M.mapLoc(back?'ostbus':'skela'); var ok=await M.canTravel(A,L);
    if (ok) await A.goto(L.to,{via:'map',noSave:true,noEnter:true}); await A.wait(2500); }
  finally{ location.replace(location.pathname); } };
if (typeof window!=='undefined' && window.addEventListener) window.addEventListener('load',function(){ var k=M.k3RidePreviewKind(); if (!k) return; var iv=setInterval(function(){ if (M.E && M.E.screen==='title'){ clearInterval(iv); M.k3RidePreview(k); } },300); });
