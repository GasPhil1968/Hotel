/* ===== 97_k4_mala.js — Kapitel 4: Marko und Mala in München. Mala ansehen, mit ihr reden (Marko), Marko ansehen und
   ansprechen (Mala), „Mala fragen“ für Lana (M.K4ASK.lana_jasna, lana_ana). Ihr Geheimnis aus der Kiste behält sie bis zum
   Streit; danach ist sie fort, bis die Brücke kommt. r4_ursache gibt sie, wenn Sepp und Gerda gefunden sind. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); } function N(A,id){ return A.hasNote(id); }
function ph(A){ return A.G.phase; } function inP(A,l){ return l.indexOf(A.G.phase)>=0; }
function rid(A){ return A.room?A.room.id:''; }
function o(key,t,cond,fn){ return {t:t,once:key,if:cond,go:fn}; }
var NIGHTS=['k4_pro_n','k4_d1_n','k4_d2_n','k4_d4_n','k4_d5_n'];
function secret(A){ return F(A,'k4.d1.box') && !F(A,'k4.r.shared'); }
function consent(){ return (M.k4Carry&&M.k4Carry.consent)||'b'; }
// ---------------------------------------------------------------- Mala ansehen (Marko)
M.k4LookAtMala=async function(A){ var p=ph(A), r=rid(A);
  if (F(A,'k4.bond')) return A.m('Zwischen ihr und mir ein heller Faden. Er zieht nicht. Er ist einfach da.');
  if (r==='hacker' && p==='k4_d5_n') return A.m(F(A,'k4.d5.bridge')?'Mala steht neben mir. Der Nebel geht durch sie hindurch und kommt auf der anderen Seite heller heraus.':'Mala auf dem Geländer, die Beine über den Gleisen. Der Nebel macht sie weicher. Ich sehe jedes Mal hin, wenn ein Zug kommt.');
  if (r==='ana' && p==='k4_pro_n') return A.m('Mala am Fenster. Sie zählt die Lichter am Baum, und Niko zählt mit, ohne es zu wissen.');
  if (r==='heim214') return A.m('Mala an der Wand neben dem Fenster. Sie ist ganz still. Sie hält sich an den Rand.');
  if (p==='k4_pro') return A.m(A.cycle('kLp',['Mala im Schnee. Er fällt durch sie hindurch und bleibt nicht liegen. Sie hält den Kopf schief, als hörte sie ihm zu.','Der graue Schal, die Jeansjacke, die Dose in der Hand. Im Winter sieht sie aus, als hätte sie die Jacke vergessen.']));
  if (inP(A,NIGHTS)) return A.m(A.cycle('kLn',['Nachts steht sie am Fenster und zählt. Sie hört nicht auf, wenn ich hinsehe.','Im Licht von gegenüber ist sie fast nicht da. Nur der Schal.']));
  if (secret(A)) return A.m(A.cycle('kLs',['Sie sieht mich an und dann weg. Seit Sonntag macht sie das. Ich weiß nicht, warum.','Mala. Sie hält die Dose mit beiden Händen, als müsste sie etwas festhalten.']));
  if (p==='k4_d1') return A.m(A.cycle('kL1',['Die Sonne geht durch sie hindurch. Sie blinzelt trotzdem.','Sie ist unruhig. Sie sieht oft zur Tür, als wollte sie gehen und wüsste nicht, ob sie darf.']));
  if (p==='k4_epi') return A.m('Mala auf dem Fensterbrett, in der Neujahrssonne. Sie sieht aus wie jemand, der geschlafen hat. Sie schläft nie.');
  return A.m(A.cycle('kL0',['Mala.','Sie zählt etwas. Fenster, Schritte, mich.'])); };
// ---------------------------------------------------------------- Mala sieht Marko an (gespielt als Mala)
M.k4MalaLooksAtMarko=async function(A){ var p=ph(A);
  if (F(A,'k4.d5.bridge')) return A.g(A.cycle('gL5',['Er hat es gesagt. Gestorben. Er sieht nicht leichter aus. Aber gerader.','Er reibt sich die Schläfe. Wenn er nicht mehr kann, sagt er es. Das hat er versprochen.']));
  if (secret(A)) return A.g(A.cycle('gLs',['Er hatte damals noch die hohe Stimme. Jetzt hat er die tiefe und sagt dasselbe nicht.','Er weiß nicht, dass ich es weiß. Ich weiß nicht, ob das gut ist.']));
  if (inP(A,NIGHTS)) return A.g('Er schläft auf der Seite, die Füße über der Lehne. Wie damals, nur länger.');
  return A.g(A.cycle('gL0',['Er reibt sich die Schläfe, wenn er glaubt, ich sehe es nicht.','Er sieht aus wie einer, der in seiner Muttersprache übersetzen muss. Das ist schwerer als jede andere.'])); };
// ---------------------------------------------------------------- Mala spricht Marko an (gespielt als Mala)
M.k4MalaToMarko=async function(A){ var G=A.G, p=G.phase;
  if (G.pos.marko.room!==G.pos.mala.room) return A.g(A.cycle('gTx',['Er ist woanders. Er hört mich nicht.','Ich rede mit einem leeren Zimmer. Er ist nicht hier.']));
  if (p==='k4_d1_n' && !F(A,'k4.d1.box')) return A.g('Er schläft. Fast. Ich wecke ihn nicht.');
  if (p==='k4_d1_n') return A.g('Er schläft. Ich sage nichts. Noch nicht.');
  if (p==='k4_d1' && !N(A,'s4_peppino')) return A.g('Ich gehe allein zum Bahnhof. Du merkst es, wenn ich wieder da bin.');
  if (secret(A)) return A.g(A.cycle('gTs',['Ich bin da.','Frag mich etwas. Nein. Frag nicht.']));
  return A.g(A.cycle('gT0',['Ich bin da.','Geh vor. Ich komme nach. Oder ich gehe allein. Ich kann das jetzt.','Wenn du rechnest, denkst du auf Deutsch. Wenn du träumst, auf Bosnisch.'])); };
// ---------------------------------------------------------------- Gesprächsteile
async function aloneTalk(A){ await A.g('Wie Fallen. Nur langsamer.'); await A.wait(400); await A.g('Und unten ist kein Wasser. Nur Straßen. Ich kann jede nehmen.'); await A.m('Hast du Angst?'); await A.g('Ein bisschen. Das ist das Neue daran. Früher hatte ich keine Wahl, also auch keine Angst.'); }
async function causeTalk(A){ await A.m('Mein Kopf. Am Bahnhof hat es aufgehört, als du Sepp gefunden hast. Im Heim, als du Gerda gefunden hast.'); await A.wait(800);
  await A.g('Dann war ich es nicht.'); await A.wait(500); await A.m('Nicht nur du.'); await A.wait(600); await A.g('Die, die keiner gefunden hat. Die tun dir weh. Wie in Split. Das hatte ich vergessen.'); A.note('r4_ursache');
  await A.wait(500); await A.g('Ich habe gedacht, ich bin es. Ich bin weggegangen, damit es aufhört.'); await A.m('Und hast zwei gefunden.'); await A.g('Ja. Wenn man geht, findet man was.'); }
async function nadaTalk(A){ var p=ph(A);
  if (p==='k4_epi'){ await A.g('Sie holt mich. Am zehnten.'); await A.wait(500); await A.g('Und Mama hat mit deiner Mutter telefoniert. Ich habe zugehört. Sie haben über Plätzchen geredet. Eine Viertelstunde. Über Plätzchen.'); return; }
  if (inP(A,['k4_pro','k4_pro_n','k4_d1','k4_d1_n'])){ await A.g('Mama feiert nicht.'); await A.wait(500); await A.g('Sie lüftet das Zimmer.'); await A.wait(700); await A.g('Ich wäre gern da.'); await A.wait(500); await A.g('Ich bin hier.'); return; }
  await A.g('Sie bügelt den Mantel. Den zu großen. Für den Januar.'); await A.wait(400); await A.g('Ich denke an sie, wenn deine Mutter die Pantoffeln gerade stellt. Das ist dieselbe Bewegung.'); }
async function nikoTalk(A){ await A.g('Ja.'); await A.wait(500); await A.g('Er hat gewinkt. Ich habe zurückgewinkt. Siebzehn Jahre hat mir keiner gewinkt.'); await A.wait(500); await A.m('Und Mama hat „Schal“ gehört.'); await A.g('Sie hat die Gabel hingelegt. Ganz leise. Sie weiß nichts. Sie ahnt nur, dass es Mädchen mit Schal gab.'); }
async function anaTalk(A){ await A.g('Das Entchen.'); await A.wait(400); await A.g('Sie hat Kinder, Arbeit, eine Wut und sieben Sorten Plätzchen.'); await A.wait(500); await A.g('So sieht ein Leben aus, das weiterging. Ich wusste es nicht. Ich habe nur das Ende gekannt.'); }
async function hansiTalk(A){ await A.g('Er ist einfach gegangen. Ich musste nichts tun. Nur einer musste „Feierabend“ sagen, in seiner Sprache.'); await A.wait(400); await A.g('Ich wusste nicht, dass man so gehen kann. Ohne Schwelle. Ich bin ein bisschen neidisch.'); }
async function tinTalk(A){ await A.g('Zwei Fahrscheine. Für die erste Drei nach dem Krieg.'); await A.wait(800); await A.g('Gerda hat ihre Kanne hergegeben. Wer losgelassen hat, kann etwas hergeben.'); await A.wait(700); await A.g('Wenn ich sie hergebe, dann der, die sie braucht.'); await A.m('Wer ist das?'); await A.g('Das weiß ich noch nicht.'); }
async function gerdaTalk(A){ await A.g('Ich habe ihr gesagt, dass sie gehen muss. Für ihn.'); await A.wait(800); await A.g('Sie ist geblieben, weil sie ihn liebt. Genau das hat ihn frieren lassen.'); await A.wait(700); await A.g('Ich weiß nicht, ob ich das bei mir auch könnte. Gehen, weil ich bleibe.'); }
async function seppTalk(A){ await A.g('Carmela hat es gewusst. Seit neunundsiebzig. Und hat „Auch mir geht es gut“ geschrieben.'); await A.wait(600); await A.g('Zwei, die sich schonen, und beide wissen es. Vielleicht geht das. Wenn beide es wissen.'); }
async function knowTalk(A){ await A.m('Weißt du etwas, das ich wissen sollte?'); await A.wait(1300); await A.g('Ich weiß vieles.'); await A.wait(500); await A.g('Ich frage nicht. Das hast du so gewollt.'); await A.wait(600); await A.m('Das ist keine Antwort.'); await A.g('Nein.'); }
async function bondTalk(A){ var c=consent();
  if (c==='a'){ await A.g('Am Grab hast du Ja gesagt. Einfach so.'); await A.m('Nicht einfach so.'); await A.g('Hier merkst du, wie wenig einfach.'); }
  else if (c==='b'){ await A.g('Bis einer sagt, es ist zu schwer.'); await A.wait(400); await A.g('Noch hat keiner etwas gesagt. Das heißt nicht, dass es leicht ist.'); }
  else { await A.g('In München fragst du mich noch mal. Das habe ich gesagt.'); await A.wait(500); await A.g('Wir sind in München. Ich frage noch nicht. Erst, wenn deine Mutter es weiß.'); } }
async function afterBridge(A){ await A.g('Wir schonen uns nicht mehr.'); await A.wait(400); await A.m('Nein.'); await A.g('Dann sage ich dir: Ich habe Angst vor heute Nacht. Für dich.'); await A.m('Ich auch.'); await A.g('Gut. Dann sind wir zwei.'); }
// ---------------------------------------------------------------- Mit Mala reden (Marko)
M.k4TalkToMala=async function(A){ var G=A.G, p=G.phase, r=rid(A);
  if (r==='hacker' && p==='k4_d5_n' && !F(A,'k4.d5.bridge') && M.k4Bridge) return M.k4Bridge(A);
  if (p==='k4_fin_n' && r==='ana' && !F(A,'k4.fin.trail')) return A.g('An der Tür hängt etwas. Lass mich gehen. Ich finde sie.');
  if (r==='heim214' && p==='k4_fin_n' && !F(A,'k4.fin.done')) return A.g('Nicht mit mir. Mit ihr.');
  await A.menuLoop(function(){ var both=A.isFound('sepp')&&A.isFound('gerda'); return [
    M.hintTalkOpt(A),
    o('mgA','Wie ist es, allein unterwegs zu sein?',F(A,'k4.m.alone1'),aloneTalk),
    {t:'Mein Kopf. Am Bahnhof und im Heim hat es aufgehört.',silent:true,if:both&&!N(A,'r4_ursache'),go:causeTalk},
    o('mgN'+(p==='k4_epi'?'E':(inP(A,['k4_pro','k4_pro_n','k4_d1','k4_d1_n'])?'W':'2')),'Denkst du an deine Mutter?',true,nadaTalk),
    o('mgNi','Niko sieht dich.',F(A,'k4.p.niko'),nikoTalk),
    o('mgAn','Ana.',F(A,'k4.d1.walk'),anaTalk),
    o('mgHa','Hansi.',F(A,'k4.p.hansi'),hansiTalk),
    o('mgKn','Weißt du etwas, das ich wissen sollte?',secret(A)&&F(A,'k4.d2.kolar'),knowTalk),
    o('mgSe','Sepp ist zu Hause.',F(A,'k4.s.crossed'),seppTalk),
    o('mgGe','Gerda ist gegangen.',F(A,'k4.g.decided'),gerdaTalk),
    o('mgTi','Was ist in deiner Dose?',F(A,'k4.g.thermos'),tinTalk),
    o('mgBo','Wie ist es mit uns? Seit Mostar.',!F(A,'k4.d4.fight'),bondTalk),
    o('mgBr','Und jetzt?',F(A,'k4.d5.bridge')&&p==='k4_fin_a',afterBridge),
    {t:'Komm.',bye:true,go:async function(A){ await A.g(A.cycle('k4gBye',['Ich komme.','Geh vor.','Ja.'])); }}
  ].filter(Boolean); }); };
// ---------------------------------------------------------------- „Mala fragen“: Lana (96_k4_story.js zeigt die Option)
M.K4ASK=M.K4ASK||{};
M.K4ASK.lana_jasna=async function(A){ await A.m('Soll ich es ihr sagen? Von dir?'); await A.wait(900); await A.g('Sag es ihr.'); await A.wait(600); await A.g('Sie hat mir die Tür aufgemacht. Jeden Samstag.'); };
M.K4ASK.lana_ana=async function(A){ await A.m('Ana weiß es noch nicht. Soll ich?'); await A.wait(900);
  if (N(A,'z4_stiefel') && !F(A,'k4.d1.drawing')){ await A.g('Sag ihr das mit der Straßenbahn.'); await A.wait(500); await A.g('Das war ihres.'); }
  else if (F(A,'k4.d1.drawing')){ await A.g('Sie hat die Straßenbahn noch. Dann kann sie auch den Rest tragen.'); }
  else await A.g('Sag ihr, dass ich sie mochte. Die Kleine mit den Stiefeln.'); };
})(M);
