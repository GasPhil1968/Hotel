/* ===== 97_k4_limbo_sepp.js — Kapitel 4 in der Zwischenwelt: Giuseppe Ruggiero. Ein Bahnsteig von 1962 im Licht, grüne Wagen, Dampf,
   ein Zug nach Süden. Er trägt einen fremden Koffer, wie immer; sein eigener Pappkoffer steht abseits. Marko trägt ihn in den Zug.
   „Facchino!“ Requisit und Ansicht malt rooms/art/limbo.js unter S.who==='sepp'. Danach M.afterLimbo_sepp (zurück an Gleis 11). ===== */
(function(M){
'use strict';
var R=M.ROOMS.limbo; if (!R) return;
var lm=R.music; R.music=function(G){ return M.chapterOf(G)===4?'k4_limbo':(typeof lm==='function'?lm(G):lm); };
M.LIMBO_GHOST.sepp={name:'Sepp',idle:'carry'};
function who(S){ return S.who||''; }
function lightPt(){ var sp=M.spot('limbo','light'); if (!sp[2]) sp=[150,8,100,96]; return [sp[0]+(sp[2]>>1)+4, Math.min(112,sp[1]+sp[3]+6)]; }
async function intoLight(A,id,lines){ var G=A.npc(id), lp=lightPt(); A.sfx('shimmer'); await A.crossOpen(lp[0],lp[1]+2,{w:22,h:96,wait:900});
  for (var i=0;i<(lines||[]).length;i++){ await lines[i](); }
  if (G.actor){ G.set('speed',110); var w=G.walk(lp[0],lp[1]); await A.wait(900); G.actor.fadeOut=A.gt; A.sfx('shimmer'); await w; }
  await A.wait(1200); G.hide(); A.S.gone=true; await A.crossClose(); await A.wait(700); }
// ---------------------------------------------------------------- Begrüßung
var intro0=M.limboIntro;
M.limboIntro=async function(A,w){ if (w!=='sepp') return intro0(A,w); var Sp=A.npc('sepp');
  await A.narrate('Ein Bahnsteig im Licht. Alte grüne Wagen, Dampf zwischen den Rädern, ein Zug nach Süden. Neben einem Gepäckkarren steht ein einzelner Pappkoffer, mit Schnur zugebunden.');
  await Sp.say('Binario undici. Sessantadue.'); await A.wait(500); await Sp.say('Qui sono sceso. E da qui partiva il treno per il sud, ogni sera alle nove.');
  await A.m('Gleis elf, zweiundsechzig. Hier ist er ausgestiegen. Und von hier fuhr jeden Abend um neun der Zug nach Süden.');
  await A.wait(600); await A.narrate('Er trägt einen Koffer, der nicht seiner ist. Er hält ihn, wie man ein Kind hält, das schläft.');
  await Sp.say('Ventiquattro anni ho portato le valigie di tutti. Tutti tornavano a casa per Natale. Io no.');
  await A.g('Er steigt nicht ein, Marko.'); await A.wait(400); await Sp.anim('point'); await Sp.say('La mia valigia. Quella non l’ho mai portata.');
  await A.m('Seinen eigenen Koffer hat er nie getragen.'); };
// ---------------------------------------------------------------- Marko trägt den Koffer: „Facchino!“
async function carry(A){ var Sp=A.npc('sepp'); if (A.S.given) return Sp.say('Avanti, facchino!');
  A.S.given=true; A.rebuild(); await A.animM('pickup'); A.sfx('suitcase');
  await A.narrate('Ich hebe den Koffer an der Schnur. Er ist leicht. Ein Hemd, ein Rasierpinsel, neunundvierzig Jahre Briefe.');
  Sp.agitate(1500); await A.wait(600); Sp.idle(null);
  await A.narrate('Peppino stellt den fremden Koffer ab, den er die ganze Zeit gehalten hat. Er sieht mich an, wie ich seinen trage.');
  await A.wait(500); await Sp.say('Facchino!'); await A.wait(400); await A.narrate('Er lacht. Laut, mit dem ganzen geraden Rücken.');
  await Sp.say('Facchino! Ma guarda. Il signore porta la valigia a me.'); await A.m('„Schau dir das an. Der Herr trägt mir den Koffer.“');
  var lp=lightPt(); await A.walkM(lp[0]-26,lp[1]+4); await A.faceM('R');
  await A.narrate('Ich stelle den Koffer an die offene Wagentür. Drinnen ist es warm, das sieht man an den Scheiben.');
  await Sp.say('La mancia.'); await A.narrate('Er drückt mir etwas in die Hand. Da ist nichts. Ich schließe die Hand trotzdem.'); await Sp.say('Diciassette lire. Come il mio numero.');
  await intoLight(A,'sepp',[async function(){ await A.wait(700); await Sp.face('L'); await Sp.say('Grazie, facchino.'); await A.wait(600); await Sp.say('Dica a Carmela …'); await A.wait(1100); await Sp.say('No. Lo sa già. Lo ha sempre saputo.'); }]);
  A.setFlag('k4.s.crossed'); await A.wait(500); await A.m('„Sagen Sie Carmela …“ Und dann: Nein. Sie weiß es schon. Sie hat es immer gewusst.');
  await A.wait(700); await A.g('Er ist eingestiegen.'); await A.m('Mit seinem eigenen Koffer.'); await A.g('Den hat er nie getragen. Heute hat er ihn tragen lassen.');
  await A.wait(800); await A.g('Komm. Durch das Tor.'); }
async function talkS(A){ var Sp=A.npc('sepp'); if (A.S.given) return Sp.say('Avanti, facchino!');
  await A.menuLoop(function(){ return [
    {t:'Was sehen Sie im Licht?',once:'ls1',go:async function(A){ await Sp.say('La stazione di Potenza. E mia madre che dice: Giuseppe, scrivi.'); await A.m('Den Bahnhof von Potenza. Und seine Mutter, die sagt: Giuseppe, schreib.'); }},
    {t:'Haben Sie Angst?',once:'ls2',go:async function(A){ await Sp.say('Paura? Di viaggiare senza valigia. Un facchino senza valigia è solo un uomo.'); await A.m('Angst hat er, ohne Koffer zu reisen. Ein Gepäckträger ohne Koffer ist nur ein Mann.'); }},
    {t:'Soll ich Carmela etwas ausrichten?',once:'ls3',go:async function(A){ await Sp.say('Che arrivo. In una scatola piccola, ma arrivo.'); await A.m('Dass er kommt. In einer kleinen Schachtel, aber er kommt.'); }},
    {t:'Steigen Sie doch einfach ein.',once:'ls4',go:async function(A){ await Sp.say('Senza valigia? Un facchino non sale mai a mani vuote.'); await A.m('Ohne Koffer? Ein Gepäckträger steigt nie mit leeren Händen ein.'); }},
    {t:'(Den Koffer tragen.)',silent:true,go:async function(A){ await carry(A); return 'bye'; }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Requisit (der Pappkoffer) und Geister-Hotspot ergänzen
var prop=R.byId.prop;
if (prop){ var n0=prop.name, l0=prop.look, u0=prop.use, p0=prop.push, t0=prop.take, g0=prop.g||{}, gl0=g0.look;
  prop.name=function(S){ if (who(S)==='sepp') return 'Pappkoffer'; return typeof n0==='function'?n0(S):n0; };
  prop.look=function(A){ if (who(A.S)==='sepp') return A.m(A.S.given?'Der Koffer steht an der Wagentür. Er ist da, wo er hingehört.':'Ein Pappkoffer, mit Schnur zugebunden, die Ecken weich. Neunundvierzig Jahre hat er im Lager der Bahnhofsmission gestanden. Hier steht er auf einem Bahnsteig von 1962.'); return typeof l0==='function'?l0(A):A.m(l0); };
  prop.use=function(A){ if (who(A.S)==='sepp') return carry(A); return typeof u0==='function'?u0(A):A.m(u0); };
  prop.take=function(A){ if (who(A.S)==='sepp') return carry(A); return typeof t0==='function'?t0(A):A.m(t0); };
  prop.push=function(A){ if (who(A.S)==='sepp') return A.m('Er rutscht ein Stück. Er ist leicht. Er war immer leicht.'); return typeof p0==='function'?p0(A):A.m(p0||'Es bewegt sich nicht.'); };
  prop.g=prop.g||{}; prop.g.look=function(A){ if (who(A.S)==='sepp') return A.g('Sein Koffer. Er hat ihn nie getragen. Er hat ihn nur behalten.'); return typeof gl0==='function'?gl0(A):A.g(gl0||'…'); }; }
var h={id:'ghost_s',npc:'sepp',name:'Giuseppe',hgt:46,talk:talkS,room:'limbo',vis:function(S){ return !S.gone && who(S)==='sepp'; },
  look:'Giuseppe Ruggiero in seiner Uniform, die Mütze mit der Siebzehn. Er hält einen fremden Koffer und sieht auf den Zug wie auf eine Rechnung, die er nie bezahlen durfte.',
  give:{ brief_falsch:'Giuseppe: „Non serve più. Lei lo sa.“ Den braucht es nicht mehr.', aushang:'Giuseppe: „Quello sono io? Sembro vecchio.“', photo_full:'Giuseppe: „Tenga stretta questa foto, facchino.“ Ich soll das Foto gut festhalten.', vizitka:'Giuseppe: „Moosach. Zwanzg Mark Trinkgeld. Nia vergess’n.“' },
  g:{look:'Er ist ganz leicht. Er wartet nur noch darauf, dass ihm einer etwas abnimmt.'}};
R.hotspots.push(h); R.byId[h.id]=h;
// das Tor zurück: „Nicht ohne ihn“ (das Grundgerüst sagt „sie“)
var arch=R.byId.arch;
if (arch){ var ce0=arch.canExit; arch.canExit=async function(A){ if (who(A.S)==='sepp' && !A.S.gone){ await A.m(A.cycle('notYetS',['Nicht ohne ihn. Noch nicht.','Erst, wenn er drüben ist.'])); return false; } return ce0?ce0(A):true; }; }
// zurück an Gleis 11: keiner mehr am Prellbock
M.afterLimbo_sepp=async function(A){ var G=A.G; G.flags['mala.lock']=false; var st=M.stand('gleis11','buffer')||[226,114,'B'];
  await A.goto('gleis11',{x:st[0],y:st[1]+4,f:'R',fade:false,noEnter:true}); await A.fade(0,900); A.music('k4_bahnhof');
  await A.wait(800); await A.narrate('Gleis 11. Ein Zug fährt aus, nach Süden. Am Prellbock steht keiner mehr.');
  if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Er hat sich nicht umgedreht.'); await A.m('Gepäckträger drehen sich nicht um. Sie sehen nach vorn, wo der Koffer hin muss.'); }
  await A.wait(600); await A.m('Die Stadt muss es wissen. Herr Obermaier. Und Frau Wimmer.');
  await M.k4DayCheck(A); };
})(M);
