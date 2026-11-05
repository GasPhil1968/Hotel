/* ===== 97_k3_limbo_bato.js — Kapitel 3 in der Zwischenwelt: Bato. Ein Ponton an einem Seil, das ins Licht führt =====
   „Bei Hochwasser braucht es zwei.“ Marko nimmt das Seil, sie ziehen zusammen. Am Rand des Lichts: „Oprosti, mala.“ – „Du bist gekommen. Nur später.“
   Bato geht, Mala bleibt am Rand, diesmal, weil sie es so entschieden hat. Zurück durch das Tor beginnt das Gerüst den Epilog.
   Requisit und Ansicht malt rooms/art/limbo.js unter S.who==='bato'. Vorbild: 97_k2_limbo.js. ===== */
(function(M){
'use strict';
var P=M.P, R=M.ROOMS.limbo; if (!R) return;
var lm=R.music; R.music=function(G){ return M.chapterOf(G)===3?'k3_limbo':(typeof lm==='function'?lm(G):lm); };
M.LIMBO_GHOST.bato={name:'Bato',idle:'lamp'};
function who(S){ return S.who||''; }
function lightPt(){ var sp=M.spot('limbo','light'); if (!sp[2]) sp=[150,8,100,96]; return [sp[0]+(sp[2]>>1)+4, Math.min(112,sp[1]+sp[3]+6)]; }
async function intoLight(A,id,lines){ var G=A.npc(id), lp=lightPt(); A.sfx('shimmer'); await A.crossOpen(lp[0],lp[1]+2,{w:22,h:96,wait:900});
  for (var i=0;i<(lines||[]).length;i++){ await lines[i](); }
  if (G.actor){ G.set('speed',110); var w=G.walk(lp[0],lp[1]); await A.wait(900); G.actor.fadeOut=A.gt; A.sfx('shimmer'); await w; }
  await A.wait(1200); G.hide(); A.S.gone=true; await A.crossClose(); await A.wait(700); }
// ---------------------------------------------------------------- Begrüßung
var intro0=M.limboIntro;
M.limboIntro=async function(A,w){ if (w!=='bato') return intro0(A,w); var B=A.npc('bato');
  await A.narrate('Ein Ponton aus grauen Planken, mit einem Geländer, zwischen den schwebenden Steinen. Ein Seil, straff gespannt, führt von ihm ins Licht.');
  await A.wait(800); await A.narrate('Darunter ist kein Wasser. Nur Licht, das sich bewegt wie Wasser. Und es ist laut wie Wasser.');
  await A.wait(900); await B.say('Hochwasser.'); await A.wait(1000); await B.say('Bei Hochwasser braucht es zwei.');
  await A.wait(800); await A.g('Ich kann das Seil nicht halten. Ich habe es einmal gehalten. Das reicht.');
  await A.wait(700); await A.m('Ich?'); await A.wait(500); await B.say('Sie haben geläutet, Übersetzer. Wer läutet, zieht mit.'); };
// ---------------------------------------------------------------- das Seil: zusammen ziehen
async function pullRope(A){ var B=A.npc('bato'); if (A.S.given) return A.m('Das Seil ist still. Es zieht keiner mehr daran.');
  A.S.given=true; A.S.pulled=true; A.rebuild(); if (A.reach) await A.reach();
  await A.m('Ich nehme das Seil.'); await A.wait(700); await A.m('Es ist kalt. So kalt, dass es brennt.'); await A.wait(800); await A.g('Ja. So.');
  await A.wait(700); await B.say('Hand über Hand. Nicht loslassen.');
  for (var i=0;i<3;i++){ A.sfx('rope'); await A.wait(1200); }
  await A.narrate('Wir ziehen. Bato vorn, ich hinten. Der Ponton gleitet, und das Licht kommt näher, ohne dass wir uns bewegen.');
  await A.wait(1000); A.sfx('ferryCreak'); await A.narrate('Am Rand des Lichts stößt er an. Holz an etwas, das kein Holz ist.');
  await A.wait(1000); await B.say('Da.'); await A.wait(800); await B.say('Das andere Ufer. Da steht keiner und läutet.');
  await intoLight(A,'bato',[async function(){ await A.wait(1000); await B.face('L'); await A.wait(600); await B.say('Oprosti, mala.'); await A.wait(1000); await A.m('„Verzeih, Kleine.“'); await A.wait(700); await A.m('Mala heißt Kleine. Bei ihm ist es dasselbe Wort.');
      await A.wait(1400); await A.g('Du bist gekommen.'); await A.wait(1000); await A.g('Nur später.');
      await A.wait(1300); await A.narrate('Den Satz kenne ich. Sie hat ihn mir gesagt, in der Drei, im Schnee.'); await A.wait(900); await B.say('Ja.'); await A.wait(600); await B.say('Später.'); }]);
  A.setFlag('k3.a.limbo'); await A.wait(1000);
  await A.narrate('Mala bleibt am Rand des Lichts stehen. Sie geht keinen Schritt weiter.'); await A.wait(900);
  await A.g('Ich bleibe hier. Am Rand.'); await A.wait(800); await A.g('Diesmal, weil ich es so will.'); await A.wait(1000); await A.g('Komm. Durch das Tor.'); }
// ---------------------------------------------------------------- Gespräch in der Zwischenwelt
async function talkB(A){ var B=A.npc('bato'); if (A.S.given) return B.say('Gleich bin ich drüben.'); await A.menuLoop(function(){ return [
  {t:'Haben Sie Angst?',once:'lbt1',go:async function(A){ await B.say('Vor dem Wasser? Vierzig Jahre nicht.'); await A.wait(700); await B.say('Heute ein bisschen.'); }},
  {t:'Was sehen Sie im Licht?',once:'lbt2',go:async function(A){ await B.say('Einen Anleger. Und niemanden, der läutet.'); await A.wait(600); await B.say('Gut so.'); }},
  {t:'Soll ich Zlata etwas sagen?',once:'lbt3',go:async function(A){ await B.say('Sagen Sie ihr: Sie hatte recht. Ich hatte einen tiefen Schlaf.'); await A.wait(1000); await B.say('Nur in der einen Nacht nicht.'); }},
  {t:'(Schweigen.)',bye:true} ]; }); }
// ---------------------------------------------------------------- Requisit und Geister-Hotspot ergänzen
var prop=R.byId.prop;
if (prop){ var n0=prop.name, l0=prop.look, u0=prop.use, p0=prop.push, t0=prop.take, gl0=prop.g&&prop.g.look;
  prop.name=function(S){ return who(S)==='bato'?'Fährseil':(typeof n0==='function'?n0(S):n0); };
  prop.look=function(A){ if (who(A.S)==='bato') return A.m(A.S.pulled?'Der Ponton liegt am Rand des Lichts. Das Seil hängt still.':'Ein Stahlseil, straff, mit Frost darauf. Es führt vom Ponton ins Licht. Daneben eine lange Stange, wie die im Schuppen.'); return typeof l0==='function'?l0(A):A.m(l0); };
  prop.use=function(A){ if (who(A.S)==='bato') return pullRope(A); return typeof u0==='function'?u0(A):A.m(u0); };
  prop.push=function(A){ if (who(A.S)==='bato') return pullRope(A); return typeof p0==='function'?p0(A):A.m(p0||'Es bewegt sich nicht.'); };
  prop.take=function(A){ if (who(A.S)==='bato') return pullRope(A); return typeof t0==='function'?t0(A):A.m(t0); };
  if (prop.g){ prop.g.look=function(A){ if (who(A.S)==='bato') return A.g('Das Seil. Ich weiß, wie kalt es ist.'); return typeof gl0==='function'?gl0(A):A.g(gl0); }; } }
var hb={id:'ghost_bato',npc:'bato',name:'Bato',hgt:50,talk:talkB,look:'Bato in seiner Wathose, die Mütze in der Hand. Er sieht nicht mehr zur Glocke. Er sieht auf das Seil.',
  give:{ deka:'Bato: „Die bleibt drüben. Bei Zlata.“', olovka:'Bato: „Den hat sie an der Glocke liegen lassen. Den hätte ich ihr bringen sollen.“' },
  g:{look:'Er ist leicht. Zum ersten Mal ist er leicht.',talk:async function(A){ await A.npc('bato').say('Gleich, Mädchen. Erst das Seil.'); }}};
hb.room='limbo'; hb.vis=function(S){ return !S.gone && who(S)==='bato'; }; R.hotspots.push(hb); R.byId[hb.id]=hb;
// ---------------------------------------------------------------- zurück durch das Tor: kurz der Hof, dann der Epilog (Gerüst)
M.afterLimbo_bato=async function(A){ var G=A.G; G.flags['mala.lock']=false;
  var sh=M.stand('skela_l','shed')||[330,120,'B']; await A.goto('skela_l',{x:sh[0]-22,y:sh[1]+3,f:'R',fade:false,noEnter:true}); await A.fade(0,900);
  await A.wait(800); await A.narrate('Der Hof. Der Frost. Die Laterne im Schuppen ist aus, und am Steg liegt keine Fähre mehr.');
  var Z=A.npc('zlata'); if (Z.actor){ await A.wait(1000); await Z.say('Ugasila se.'); await A.m('„Sie ist ausgegangen.“'); await A.wait(1200); await Z.say('Laku noć, Bato.'); await A.m('„Gute Nacht, Bato.“'); }
  var V=A.npc('vlado'); if (V.actor){ await A.wait(1100); await V.say('Ich fahre Sie zurück.'); }
  var K=A.npc('kata'); if (K.actor){ await A.wait(500); await K.say('Papa fährt. Nachts.'); }
  if (A.malaHere()){ await A.wait(900); await A.g('Hin und zurück.'); await A.m('Hin und zurück.'); }
  await A.wait(900); if (M.k3DayCheck) await M.k3DayCheck(A); };
})(M);
