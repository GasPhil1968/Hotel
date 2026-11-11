/* ===== 08_life.js — Leben in den Nebenfiguren: Tätigkeiten (Animationen) und ihr Tagesablauf =====
   Jede Nebenfigur hat eine Beschäftigung und wechselt sie gelegentlich: aufsehen, ein paar Schritte, etwas holen, zurück.
   Schritte siehe 05_engine.js (routineTick). Der Ablauf ruht, solange eine Szene läuft oder jemand mit der Figur redet. */
(function(M){
'use strict';
var S=M.poseS, F=M.poseF, A=M.ANIMS, C=M.CHARS;
// ---------------------------------------------------------------- allgemeine Bewegungen
A.peer=[[S({}),80],[S({nh:[5,-37],ho:[1,0]}),160],[S({nh:[5,-37],ho:[1,0],ln:1}),1700],[S({nh:[5,-37],ho:[1,0],ln:1,hd:'b'}),110],[S({nh:[5,-37],ho:[1,0],ln:1}),900],[S({}),100]];
A.rubHands=[[F({lh:[-1,-25],rh:[1,-25]}),260],[F({lh:[0,-26],rh:[2,-24]}),220],[F({lh:[-2,-24],rh:[0,-26]}),220],[F({lh:[0,-26],rh:[2,-24]}),220],[F({lh:[-2,-24],rh:[0,-26],hd:'b'}),220],[F({lh:[-1,-25],rh:[1,-25]}),400],[F({}),120]];
A.stretch=[[F({}),80],[F({lh:[-6,-36],rh:[6,-36],ho:[0,-1]}),260],[F({lh:[-5,-41],rh:[5,-41],ho:[0,-1],hd:'b'}),800],[F({lh:[-7,-30],rh:[7,-30]}),200],[F({}),120]];
A.wipeF=[[F({lh:[-8,-22],rh:[-3,-22],ho:[0,1]}),300],[F({lh:[-3,-22],rh:[3,-22],ho:[0,1]}),300],[F({lh:[3,-22],rh:[8,-22],ho:[0,1]}),300],[F({lh:[-3,-22],rh:[3,-22],ho:[0,1],hd:'b'}),300]];
A.readF=[[F({it:'paper',lh:[-5,-27],rh:[4,-27],ho:[0,1]}),1900],[F({it:'paper',lh:[-5,-27],rh:[4,-27],ho:[0,1],hd:'b'}),110],[F({it:'paper',lh:[-5,-26],rh:[4,-27],ho:[1,1]}),1500],[F({it:'paper',lh:[-5,-27],rh:[4,-26],ho:[0,1]}),900]];
A.stampF=[[F({}),60],[F({rh:[6,-31]}),140],[F({rh:[5,-22]}),90],[F({rh:[6,-31]}),140],[F({rh:[5,-22]}),90],[F({}),80]];
A.writeS=[[S({ln:2,nh:[7,-24],fh:[4,-25],ho:[1,1],it:'pencil'}),420],[S({ln:2,nh:[8,-24],fh:[4,-25],ho:[1,1],it:'pencil'}),300],[S({ln:2,nh:[7,-23],fh:[4,-25],ho:[1,1],it:'pencil',hd:'b'}),200],[S({ln:2,nh:[9,-24],fh:[4,-25],ho:[1,1],it:'pencil'}),520]];
A.coilS=[[S({ln:2,nh:[8,-20],fh:[5,-22]}),260],[S({ln:2,nh:[9,-23],fh:[5,-20]}),260],[S({ln:2,nh:[7,-24],fh:[6,-21]}),260],[S({ln:2,nh:[6,-21],fh:[7,-23],hd:'b'}),260]];
A.polishF=[[F({lh:[-2,-24],rh:[2,-24]}),500],[F({lh:[-1,-25],rh:[3,-23]}),350],[F({lh:[-3,-23],rh:[1,-25],hd:'b'}),350],[F({lh:[-2,-24],rh:[2,-24]}),500],[F({}),100]];
A.warmHands=[[F({lh:[-1,-31],rh:[1,-31],ho:[0,1]}),700],[F({lh:[-1,-32],rh:[1,-31],ho:[0,1],hd:'b'}),200],[F({lh:[-1,-31],rh:[1,-32],ho:[0,1]}),900],[F({}),120]];
var SITB={h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],sit:1};
function sit(o){ var p={}; Object.keys(SITB).forEach(function(k){ p[k]=SITB[k]; }); Object.keys(o).forEach(function(k){ p[k]=o[k]; }); return S(p); }
A.sitLook=[[sit({nh:[7,-15],fh:[5,-15],ho:[1,-1]}),1900],[sit({nh:[7,-15],fh:[5,-15],ho:[1,-1],hd:'b'}),110],[sit({nh:[7,-15],fh:[5,-15],ho:[1,-1]}),900]];
A.sitSip=[[sit({nh:[7,-22],fh:[6,-19],it:'cup'}),300],[sit({nh:[5,-30],fh:[6,-19],it:'cup',hd:'b'}),900],[sit({nh:[7,-22],fh:[6,-19],it:'cup'}),300]];
A.cardSlap=[[sit({nh:[9,-26],fh:[6,-19]}),180],[sit({nh:[13,-20],fh:[6,-19]}),120],[sit({nh:[8,-20],fh:[6,-19]}),300]];
// ---------------------------------------------------------------- figurenbezogene Tätigkeiten
function addAnims(id,o){ var ch=C[id]; if (!ch) return; Object.keys(o).forEach(function(k){ ch.anims[k]=o[k]; }); }
// Zdenka strickt (Socken für die halbe Gasse); sie sitzt leicht vorgebeugt
var ZS={h:[0,-13],ln:1,nf:[9,0,'f'],ff:[7,0,'f'],sit:1};
function zs(o){ var p={}; Object.keys(ZS).forEach(function(k){ p[k]=ZS[k]; }); Object.keys(o).forEach(function(k){ p[k]=o[k]; }); return S(p); }
addAnims('zdenka',{ sitKnit:[[zs({nh:[8,-17],fh:[6,-16],it:'needle'}),320],[zs({nh:[9,-18],fh:[5,-16],it:'needle'}),300],[zs({nh:[8,-17],fh:[6,-17],it:'needle',hd:'b'}),200],[zs({nh:[7,-16],fh:[6,-16],it:'needle'}),420]],
  sitLook:[[zs({nh:[7,-15],fh:[5,-15],ho:[1,-1]}),2000],[zs({nh:[7,-15],fh:[5,-15],ho:[1,-1],hd:'b'}),110],[zs({nh:[7,-15],fh:[5,-15],ho:[1,-1]}),900]] });
// Dinko hält beim Flicken inne und sieht aufs Wasser
var DS={h:[0,-12],nf:[9,0,'f'],ff:[7,0,'f'],sit:1,ln:2};
function ds(o){ var p={}; Object.keys(DS).forEach(function(k){ p[k]=DS[k]; }); Object.keys(o).forEach(function(k){ p[k]=o[k]; }); return S(p); }
addAnims('dinko',{ sitLook:[[ds({nh:[8,-15],fh:[7,-14],ln:0,ho:[1,-1]}),2200],[ds({nh:[8,-15],fh:[7,-14],ln:0,ho:[1,-1],hd:'b'}),110],[ds({nh:[8,-15],fh:[7,-14],ln:0,ho:[1,-1]}),1200]] });
// Luka sieht beim Spielen zum Hafen hinüber
addAnims('luka',{ guitarLook:[[sit({nh:[6,-17],fh:[10,-20],it:'guitar',ho:[1,-1]}),2000],[sit({nh:[6,-17],fh:[10,-20],it:'guitar',ho:[1,-1],hd:'b'}),110],[sit({nh:[6,-18],fh:[10,-20],it:'guitar',ho:[1,-1]}),1400]] });

// ---------------------------------------------------------------- Pausen (11.11.2026): wer im Stehen nur einer Tätigkeit nachgeht und keinen eigenen Ablauf hat,
// hält ab und zu inne – steht ein paar Sekunden locker da (Gesten, Hinsehen, Umdrehen wie alle anderen, 05_engine.js) und macht dann weiter.
// Nicht im Sitzen, nicht bei Geistern (sie wiederholen, was sie immer getan haben) und nicht bei Tätigkeiten, die keine Pause vertragen.
A.pauseS=A.idleS; A.pauseF=A.idleF;
var NOPAUSE=/^(hold|lamp|listen|teach|stand|play|sled|bed|eat|rock|guitar|cards|domino|mend|knit|porter|type|cook|phone|wait|arms|talk|lean|wave|sit.*)$/;
M.autoRoutine=function(o,a){ var own=o.idle; if (!own || o.ghost || NOPAUSE.test(own)) return null; var ch=C[o.ch||o.id], an=(ch&&ch.anims&&ch.anims[own])||A[own]; if (!an||!an[0]) return null;
  var p0=an[0][0]; if (!p0 || p0.sit || p0.v==='B') return null; var pz=p0.v==='F'?'pauseF':'pauseS';
  var steps=[['idle',own,9,16],['idle',pz,3,6],['idle',own,8,15],['skip',0.5,1],['idle',pz,2,4]];
  return function(){ if (a.idle && a.idle!==own && a.idle!==pz) return null; return steps; }; };
// ---------------------------------------------------------------- Tagesabläufe (je Figur; Funktion von Raumzustand, Spielstand und Raum)
function ph(G,list){ return list.indexOf(G.phase)>=0; }
M.ROUTINES={
  // Zdenka vor ihrer Tür: strickt, sieht die Gasse hinauf, steht auf, schüttelt die Decke aus, setzt sich wieder
  zdenka:function(S,G,R){ return [['idle','sitKnit',9,15],['idle','sitLook',2,4],['idle','sitKnit',8,13],['idle','sit',2,3],['skip',0.45,4],['idle',null,0.8],['walk',14,1],['anim','stretch'],['home','sit'],['idle','sitKnit',6,10]]; },
  // Mladen am Tresen: Kreuzworträtsel, ein Stempel, Tee, ein Blick auf die Uhr
  mladen:function(){ return [['idle','readF',8,13],['anim','stampF'],['idle','readF',6,10],['skip',0.5,3],['walk',-16,0],['anim','reachB'],['home',null],['anim','drink'],['idle',null,2,3]]; },
  // Dinko flickt, sieht aufs Wasser, steht auf und rollt eine Leine auf
  dinko:function(S,G){ return [['idle','mend',10,16],['idle','sitLook',2,4],['idle','mend',8,12],['skip',0.45,4],['idle',null,0.6],['walk',-24,2],['idle','coilS',4,7],['home','mend'],['idle','mend',4,6]]; },
  // Sanja poliert Gläser, wischt den Tresen, holt eine Flasche aus dem Regal
  sanja:function(){ return [['idle','polish',6,10],['walk',20,0],['idle','wipeF',3,5],['home','polish'],['idle','polish',5,8],['skip',0.55,3],['walk',-14,0],['anim','reachB'],['home','polish']]; },
  stipe:function(){ return [['idle','cards',6,11],['anim','cardSlap'],['idle','cards',5,9],['skip',0.5,1],['anim','sitSip']]; },
  frane:function(){ return [['idle','cards',7,12],['anim','cardSlap'],['idle','cards',6,10],['idle','sitLook',2,3]]; },
  // Nina im Laden: rahmt, misst, holt Leisten vom Regal; abends an der Rampe: wartet, friert, geht ein paar Schritte
  nina:function(S,G,R){ if (R && R.id==='ledana') return G.flags['c2.finale']?null:[['idle',null,4,6],['idle','hugSelf',4,6],['walk',-10,0],['idle',null,3,4],['home','hugSelf']];
    return [['idle','work',8,12],['face','L',2,3],['walk',-18,0],['anim','reachM'],['home','work'],['idle','work',6,9],['anim','stretch']]; },
  // Mira im Kiosk: liest Zeitschriften, sortiert, trinkt Kaffee
  mira:function(){ return [['idle','readF',8,13],['idle',null,2,3],['anim','stampF'],['idle','readF',6,10],['anim','drink'],['idle',null,2,3]]; },
  // Ljerka an der Rezeption: Papiere, Stempel, Schlüsselbrett
  ljerka:function(){ return [['idle','readF',7,11],['anim','stampF'],['idle',null,2,3],['anim','reachB'],['idle','readF',6,9]]; },
  // Geister wiederholen, was sie immer getan haben
  ivka:function(S,G){ if (G.flags['c1.release']) return null; return [['idle','waitF',8,13],['anim','rubHands'],['idle','waitF',6,10],['skip',0.5,3],['walk',-14,0],['anim','peer'],['home','waitF'],['idle','waitF',5,8],['anim','warmHands']]; },
  luka:function(S,G){ if (G.flags['c2.release']) return null; return [['idle','guitarSit',8,12],['idle','guitarLook',3,5],['idle','guitarSit',6,10]]; },
  bruno:function(S,G,R){ if (G.flags['c3.release'] || (R && R.id!=='palma')) return null; return [['idle','porter',8,12],['anim','polishF'],['idle','porter',6,9],['anim','reachB'],['idle','porter',5,8]]; },
  jakov:function(S,G){ if (G.phase==='i2') return null; return [['idle','sweep',6,10],['walk',-24,0],['idle','sweep',6,10],['walk',10,2],['idle','sweep',5,8],['home','sweep']]; }
};
})(M);
