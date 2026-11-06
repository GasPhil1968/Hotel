/* ===== 97_k4_limbo_gerda.js — Kapitel 4 in der Zwischenwelt: Gerda. Ein Trambahn-Depot bei Nacht, die Linie neunzehn, eine hohe Stufe =====
   Fünfunddreißig Jahre hat Gerda am Depottor gewartet und ist nie hineingegangen. Jetzt steigt sie selbst ein. Marko hilft ihr die hohe
   Stufe hinauf, oben gibt sie ihm die Kanne: „Wer losgelassen hat, kann etwas hergeben.“ Mala bleibt am Rand. Beim Zurückkommen ist
   die Kanne stofflich (A.give('kanne')); Marko gibt sie Alois (rooms/heim_flur.js). Requisit und Ansicht malt rooms/art/limbo.js unter
   S.who==='gerda'. Vorbild: 97_k3_limbo_mate.js. ===== */
(function(M){
'use strict';
var P=M.P, R=M.ROOMS.limbo; if (!R) return;
var lm=R.music; R.music=function(G){ return M.chapterOf(G)===4?'k4_limbo':(typeof lm==='function'?lm(G):lm); };
M.LIMBO_GHOST.gerda={name:'Gerda',idle:'wait'};
function who(S){ return S.who||''; }
function lightPt(){ var sp=M.spot('limbo','light'); if (!sp[2]) sp=[150,8,100,96]; return [sp[0]+(sp[2]>>1)+4, Math.min(112,sp[1]+sp[3]+6)]; }
async function intoLight(A,id,lines){ var G=A.npc(id), lp=lightPt(); A.sfx('shimmer'); await A.crossOpen(lp[0],lp[1]+2,{w:22,h:96,wait:900});
  for (var i=0;i<(lines||[]).length;i++){ await lines[i](); }
  if (G.actor){ G.set('speed',110); var w=G.walk(lp[0],lp[1]); await A.wait(900); G.actor.fadeOut=A.gt; A.sfx('shimmer'); await w; }
  await A.wait(1200); G.hide(); A.S.gone=true; await A.crossClose(); await A.wait(700); }
// ---------------------------------------------------------------- Begrüßung
var intro0=M.limboIntro;
M.limboIntro=async function(A,w){ if (w!=='gerda') return intro0(A,w); var Gd=A.npc('gerda');
  await A.narrate('Ein Depot bei Nacht. Gleise im Schnee, ein Tor mit einer Lampe darüber. Davor eine Trambahn, blau und weiß, vorn die Neunzehn. Die Tür steht offen.');
  await A.wait(800); await Gd.say('Da ist es.'); await A.wait(700);
  await Gd.say('Fünfunddreißig Jahre hab ich hier draußen gewartet. Am Tor.'); await A.wait(600); await Gd.say('Hinein bin ich nie. Das war seine Arbeit.');
  await A.wait(900); await A.g('Ich bleibe hier. Am Rand.');
  await A.wait(700); await Gd.say('Die Stufen waren mir immer zu hoch.'); await A.wait(500); await Gd.say('Er hat gelacht, wenn ich gesagt hab: Da komm ich nie hinauf.'); };
// ---------------------------------------------------------------- die Stufe hinauf, die Kanne
async function helpStep(A){ var Gd=A.npc('gerda'); if (A.S.given) return A.m('Die Stufe ist leer. In der Tür brennt Licht.');
  A.S.given=true; A.rebuild(); if (A.reach) await A.reach();
  await A.m('Geben Sie mir Ihren Arm, Frau Lechner.'); await A.wait(600); await Gd.say('Ein Preiß. Ausgerechnet.'); await A.wait(500); await Gd.say('Na gut.');
  await A.narrate('Ich nehme ihren Ellbogen. Sie wiegt nichts. Wie ein Mantel, in dem keiner steckt.'); await Gd.anim('step');
  await A.wait(500); await A.narrate('Eine Stufe. Sie steht oben, in der offenen Tür, und dreht sich um.'); await A.wait(800);
  await Gd.say('Die Kanne.'); await A.wait(600); await Gd.say('Nehmen Sie sie. Für den Alois. Da ist noch Tee drin. Pfefferminz.');
  Gd.freeze(null); await Gd.anim('give'); Gd.idle('waitEmpty');
  await A.narrate('Sie hält mir die grüne Kanne hin. Ich nehme sie, ohne nachzudenken.'); A.sfx('shimmer'); await A.wait(1000);
  await A.m('Sie ist schwer.'); await A.wait(500); await A.m('Sie ist warm.'); await A.g('Wer losgelassen hat, kann etwas hergeben.'); A.setFlag('k4.g.kanne');
  await intoLight(A,'gerda',[async function(){ A.sfx('tramBell'); await A.wait(900); await Gd.say('Diesmal fahr ich voraus, Alois.'); await A.wait(800); await Gd.face('L'); await Gd.say('Servus, Fräulein. Und Sie, Preiß …'); await A.wait(700); await Gd.say('Danke.'); }]);
  A.setFlag('k4.g.limbo'); await A.wait(800); await A.g('Sie ist eingestiegen.'); await A.m('Zum ersten Mal.'); await A.wait(700); await A.g('Komm. Durch das Tor.'); }
// ---------------------------------------------------------------- Gespräch in der Zwischenwelt
async function talkGd(A){ var Gd=A.npc('gerda'); if (A.S.given) return Gd.say('Gleich fahr ich.');
  await A.menuLoop(function(){ return [
    {t:'Haben Sie Angst?',once:'h4lg1',go:async function(A){ await Gd.say('Vor einer Trambahn? Ich war vierundsechzig Jahre mit einem Trambahner verheiratet.'); await A.wait(500); await Gd.say('Ein bisschen. Vor der Stufe.'); }},
    {t:'Was sehen Sie im Licht?',once:'h4lg2',go:async function(A){ await Gd.say('Eine Endhaltestelle. Mit einem Häusl, und drin brennt Licht.'); await A.wait(600); await Gd.say('Diesmal wart ich dort. Und er kommt nach. Er war nie pünktlich nach Feierabend.'); }},
    {t:'Soll ich ihm etwas ausrichten?',once:'h4lg3',go:async function(A){ await Gd.say('Dass er sich einen Pullover mehr anziehen soll.'); await A.wait(700); await Gd.say('Nein. Jetzt braucht er keinen mehr.'); }},
    {t:'(Ihr die Stufe hinaufhelfen.)',silent:true,go:async function(A){ await helpStep(A); return 'bye'; }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Requisit (die hohe Einstiegsstufe) und Geister-Hotspot ergänzen
var prop=R.byId.prop;
if (prop){ var n0=prop.name, l0=prop.look, u0=prop.use, p0=prop.push, t0=prop.take, g0=prop.g||{}, gl0=g0.look;
  prop.name=function(S){ return who(S)==='gerda'?'Trambahnstufe':(typeof n0==='function'?n0(S):n0); };
  prop.look=function(A){ if (who(A.S)==='gerda') return A.m(A.S.given?'Die Stufe ist leer. In der Tür brennt Licht.':'Die Trambahn der Linie neunzehn, die Tür offen. Die Einstiegsstufe ist hoch, höher als ein Knie. Davor liegt Schnee, unberührt.'); return typeof l0==='function'?l0(A):A.m(l0); };
  prop.use=function(A){ if (who(A.S)==='gerda') return helpStep(A); return typeof u0==='function'?u0(A):A.m(u0); };
  prop.push=function(A){ if (who(A.S)==='gerda') return A.m('Eine Trambahn schiebt man nicht.'); return typeof p0==='function'?p0(A):A.m(p0||'Es bewegt sich nicht.'); };
  prop.take=function(A){ if (who(A.S)==='gerda') return A.m('Die Stufe bleibt, wo sie ist. Sie ist für Gerda.'); return typeof t0==='function'?t0(A):A.m(t0); };
  prop.g=prop.g||{}; prop.g.look=function(A){ if (who(A.S)==='gerda') return A.g('Ihre Stufe. Fünfunddreißig Jahre hat sie davor gestanden.'); return typeof gl0==='function'?gl0(A):A.g(gl0||'…'); }; }
var h={id:'ghost_gd',npc:'gerda',name:'Gerda',hgt:44,talk:talkGd,room:'limbo',vis:function(S){ return !S.gone && who(S)==='gerda'; },
  look:'Gerda vor der offenen Tür der Trambahn, die Kanne in beiden Händen. Sie sieht die Stufe an wie einen alten Bekannten.',
  give:{ photo_full:'Schöne Kinder. Passen Sie gut auf das Bild auf.', brot:'Brot? Da drüben gibt es sicher was.' },
  g:{look:'Sie ist leicht. Nur die Kanne ist schwer.', talk:async function(A){ await A.npc('gerda').say('Gleich, Fräulein. Erst die Stufe.'); }}};
R.hotspots.push(h); R.byId[h.id]=h;
// ---------------------------------------------------------------- zurück durch das Tor: der Flur, zehn nach drei, die Kanne ist stofflich
M.afterLimbo_gerda=async function(A){ var G=A.G; G.flags['mala.lock']=false;
  var l=M.apos('heim_flur','alois_lift',[48,116,'L']); await A.goto('heim_flur',{x:l[0]+40,y:l[1]+4,f:'L',fade:false,noEnter:true}); await A.fade(0,900);
  if (!A.has('kanne') && !G.flags['k4.g.thermos']) A.give('kanne');
  await A.wait(700); await A.narrate('Der Flur. Die Wanduhr zeigt zehn nach drei. Herr Lechner sitzt auf der Bank und sieht den Flur hinunter. Er wartet nicht.');
  await A.wait(600); await A.m('In meiner Hand ist die Kanne. Grünes Blech, ein Becher als Deckel. Warm.');
  if (A.malaHere()){ await A.wait(500); await A.g('Sie ist geblieben. Die Kanne.'); } };
})(M);
