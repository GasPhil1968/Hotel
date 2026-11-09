/* ===== rooms/skela_d.js — Skela, rechtes Ufer: die Anlegestelle. Hütte, Glocke, Seilanker, Pfeilerstümpfe; drüben Zlatas Haus und Batos Schuppen =====
   Zweite Nacht: Ankunft mit dem Taxi, die Stümpfe („Das ist meine.“), Bato gefunden (Mala sieht über den Fluss), der Nachhall an Hütte,
   Glocke und Seilanker, die Glocke scheitert (Bato ruft, der Nachbar mit dem Hund), Mala geht nicht über die neue Brücke.
   Dritter Tag: Mala bleibt hier und vergleicht Markos Licht drüben mit ihrem Nachhall, ordnet das Läuten, liest die Decke.
   Finale ab M.k3FinArrive: die Glocke, die Geisterfähre, Batos Erkenntnis (Zwischenstand 1), Malas Entscheidung und Überfahrt.
   Epilog: Ankunft mit Nada. Wer wo steht und was die Kunst zeigt, folgt aus den Schaltern (sync, actors), nicht aus dem Ablauf. ===== */
(function(M){
'use strict';
var P=M.P, K3S=M.K3S=M.K3S||{};
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function n2(G){ return G.phase==='k3_d2_n'; } function d3(G){ return G.phase==='k3_d3'; } function fin(G){ return G.phase==='k3_fin_n'; } function epi(G){ return G.phase==='k3_epi_d'; }
function night(G){ return n2(G)||fin(G); }
function ferry(G){ return G.flags['k3.fin.ferry']||null; }
function crossing(G){ return fin(G) && F(G,'k3.fin.boarded') && !F(G,'k3.fin.crossed'); }
function waiting(G){ return fin(G) && F(G,'k3.fin.bato') && !F(G,'k3.fin.boarded'); }   // Bato wartet mit der Fähre, Mala entscheidet
function ap(id,fb){ return M.apos('skela_d',id,fb); }
function sd(id,fb){ return M.stand('skela_d',id)||fb; }
// ---------------------------------------------------------------- Raumzustand aus den Schaltern
function sync(S,G){ S.lit=d3(G)?(G.flags['k3.lit']||null):null;
  S.lantern=n2(G)||(fin(G)&&F(G,'k3.fin.rung')&&!F(G,'k3.a.limbo')&&(ferry(G)==='far'||ferry(G)==='left'));   // auf der Fähre trägt Bato sie selbst
  var f=ferry(G); S.ferry=fin(G)?(F(G,'k3.a.limbo')?'gone':(f==='left'?'far':(f||null))):(f?'gone':null);   // nach dem Finale bleibt der Schalter stehen: die Kunst soll keine Fähre mehr zeigen
  S.zvono=false; return S; }
K3S.syncD=sync;
function resync(A){ if (A.room && A.room.id==='skela_d') sync(A.S,A.G); A.rebuild(); }
// ---------------------------------------------------------------- kleine Bausteine
async function peal(A,after){ A.set('zvono',true); A.sfx('ferrybell'); await A.wait(1200); A.set('zvono',false); if (after) await A.wait(after); }
function flinch(A){ var a=A.mala; if (a && A.malaHere() && a.mode==='idle') A.animG('surprise'); }
function bato(A){ return A.npc('bato'); }   // steht er nicht hier, ist er eine Stimme von drüben
async function reach(A){ if (A.reach) await A.reach(); }
// ---------------------------------------------------------------- Ankunft
async function arriveN2(A){ var G=A.G;
  if (!A.first('!k3.sd.n2')){ await A.narrate(A.cycle('sdN2b',['Das Taxi hält wieder, wo der Schotter aufhört. Der Fluss ist noch genauso laut.','Skela. Die Glocke, die Hütte, drüben die Laterne. Der Fahrer lässt den Motor laufen.'])); return; }
  await A.narrate('Das Taxi hält, wo der Schotter aufhört. Der Fahrer dreht das Radio leiser und lässt den Motor laufen.');
  await A.wait(500); await A.narrate('Eine Hütte mit halbem Dach. Ein Pfosten mit einer Glocke. Unten der Fluss, schwarz und laut, und flussauf eine Brücke mit einer einzigen Laterne.');
  if (A.malaHere()){ var m=ap('mala',[144,118,'R']); await A.walkG(m[0],m[1]); await A.faceG('R'); }
  await A.wait(900); await A.m('Im Fluss stehen Steine. Drei Stümpfe, gemauert, in einer Reihe.'); await A.wait(600); await A.m('Wie abgebrochene Zähne.');
  if (A.malaHere()){ await A.wait(1400); await A.g('Das ist meine.'); A.note('a3_stumps'); await A.wait(900); await A.g('Die Brücke, die nicht mehr da war.'); await A.wait(600); await A.m('Skela.'); await A.g('Ja.'); }
  await A.wait(800); await A.m('Drüben brennt ein Licht. Im Schuppen am Wasser. Um diese Zeit.');
  if (A.malaHere()){ await A.wait(500); await A.g('Ich sehe es.'); } }
async function arriveD3(A){
  if (!A.first('!k3.sd.d3')){ await A.narrate(A.cycle('sdD3b',['Skela bei Tag. Das Taxi wartet an der Straße.','Die Glocke, grün im Licht. Mala steht schon daneben.'])); return; }
  await A.narrate('Skela bei Tag. Raureif auf dem Gras, die Hütte grau, die Glocke grün. Unten der Fluss, heller als in der Nacht und genauso laut.');
  await A.wait(600); await A.m('Drüben ein weißes Haus mit drei Fenstern. Ein Schuppen am Steg, ein Baum. Hühner.');
  if (A.malaHere()){ var m=ap('mala',[144,118,'R']); await A.walkG(m[0],m[1]); await A.wait(800); await A.g('Bei Tag ist es kleiner.'); await A.wait(600); await A.g('Ich bleibe hier. Über den Fluss gehe ich nicht. Nicht an dieser Stelle.');
    await A.m('Ich weiß.'); await A.g('Ich sehe dich von hier. Das reicht.'); } }
async function explainSign(A){ A.setFlag('k3.z.signSaid');
  await A.g('Ich habe den Kopf geschüttelt.'); await A.m('Ich habe es gesehen. Warum?'); await A.wait(900);
  await A.g('Lass ihr ihren Mann.'); await A.wait(900); await A.g('Siebzehn Jahre hat sie geglaubt, er hat geschlafen. Er hat nichts gehört. Lass ihn ihr. Heute noch.');
  await A.m('Und später?'); await A.g('Später weiß ich mehr. Frag mich dann.'); }
async function backFromBridge(A){ var G=A.G; if (!A.malaHere()) return;
  if (n2(G) && F(G,'k3.z.tomorrow') && A.first('!k3.sd.n2back')){ await A.g('Sie war draußen. Mit einer Lampe.'); await A.m('Zlata. Sie hat gesagt: Sutra. Danju.'); await A.g('Morgen. Bei Tag.');
    await A.wait(700); await A.g('Sie hat nicht zu dir gesehen. Sie hat zur Glocke gesehen. Lange.'); await A.wait(500); await M.k3DayCheck(A); return; }
  if (n2(G) && F(G,'k3.n2.batoTalk') && A.first('!k3.sd.n2bato')){ await A.g('Du hast mit ihm geredet.'); await A.m('Er sagt, es war ein Soldat.'); await A.wait(800); await A.g('…'); return; }
  if (d3(G) && F(G,'k3.z.askSign') && !F(G,'k3.z.signSaid')){ await explainSign(A); await A.wait(700); }
  if (d3(G) && F(G,'k3.z.deka') && !F(G,'k3.mala.deka') && A.first('!k3.sd.dekaSeen')){ await A.g('Was trägst du da?'); await A.m('Eine Decke. Von Zlata. Sie sagt, am Wasser ist es kalt.'); await A.g('Zeig sie mir.'); return; }
  if (d3(G) && F(G,'k3.bato.uneasy') && A.first('!k3.sd.uneasy')){ await A.g('Er flackert. Drüben, im Schuppen. Ich sehe es bis hier.'); await A.m('Er sagt immer noch: ein Soldat.'); await A.g('Er weiß es. Er will es nur noch nicht.'); } }
// ---------------------------------------------------------------- Bato finden (Mala sieht über den Fluss)
async function findBato(A,via){ if (A.isFound('bato')) return false;
  if (via==='bell') await A.g('An der Glocke hängt eine Leine. Nicht meine. Sie geht über das Wasser.');
  else if (via==='river') await A.g('Über dem Wasser hängt etwas. Eine Leine, dünn wie ein Haar. Sie geht hinüber, in den Schuppen.');
  else if (via==='house'||via==='tree') await A.g('Drüben, neben dem Haus, im Schuppen am Steg. Die Laterne.');
  await A.wait(700); await A.g('Da steht einer.'); await A.wait(600); await A.g('Ein alter Mann in Wathose, Hosenträger über dem Pullover. Er hält eine Sturmlaterne hoch und sieht herüber.');
  A.found('bato'); A.setFlag('k3.bato.found'); A.note('a3_bato'); A.rebuild();
  await A.wait(800); await A.g('Seine Leine geht über den Fluss. Bis hierher.'); await A.wait(500); await A.g('Seine Leine hängt an der Glocke. An meiner Seite.');
  if (A.marko){ await A.wait(700); await A.m('Jetzt sehe ich ihn auch. Drüben im Schuppen, ein alter Mann mit einer Laterne. Nicht größer als mein Daumen.'); await A.m('Er sieht herüber. Zu uns. Zur Glocke.'); }
  return true; }
K3S.findBato=findBato;
// ---------------------------------------------------------------- Nachhall: Hütte, Glocke, Seilanker
async function hutEcho(A){ var G=A.G;
  if (N(G,'a3_hut')) return A.g(A.cycle('hutE2',['Mehl, Decken, eine Kerze. Und ich, mit dem Bleistift im Mund.','Ich habe hier gesessen, bis der Motor weg war. Dann bin ich hinaus.','Die grauen Decken lagen bis unter das Dach. Ich habe mich auf keine gesetzt. Sie waren für die Dörfer.']));
  await A.g('Hier drin …'); await A.wait(500);
  await A.memory({title:'Nachhall – die Hütte',tint:'ghost',draw:M.mem&&M.mem.k3_hut,lines:['Die Hütte hat noch ein Dach. Mehlsäcke bis an die Balken, Ballen mit grauen Decken.','Ein Mädchen sitzt auf einem Mehlsack und zeichnet bei einer Kerze. Sie kaut am Bleistift.','Draußen brummt ein Motor. Dann nicht mehr. Sie sieht nicht auf.','Sie zeichnet weiter. Einen Fluss, schwarz, und darauf ein kleines Licht.']});
  A.note('a3_hut'); A.setFlag('k3.n2.hut');
  await A.wait(600); await A.g('Ich habe gezeichnet. Hier, auf dem Mehl.'); await A.wait(500); await A.g('Ich hatte einen Bleistift. Ich habe immer daran gekaut. Mama hat geschimpft.');
  if (A.marko){ await A.m('Und der Motor?'); await A.wait(500); await A.g('Das war er. Er ist gefahren.'); } }
async function bellEcho(A){ var G=A.G;
  if (N(G,'a3_roof') && !N(G,'a3_lightseq')){ if (!N(G,'a3_bell3')){ A.note('a3_bell3'); A.note('a3_voice'); A.setFlag('k3.n2.bell'); } return lightSeq(A); }   // Analyse K3-B04: ältere Stände
  if (N(G,'a3_bell3')) return A.g(A.cycle('bellE2',['Dreimal. Mit Pausen. Ich habe jedes Mal gewartet, bis der Ton weg war.','„Halo! Ima li koga?“ Ist da jemand? Da war jemand. Ich weiß es jetzt.','Drüben war ein Licht. In einem Fenster. Welchem, weiß ich nicht mehr. Ich weiß es, wenn ich es sehe.']));
  flinch(A); await A.wait(400);
  await A.memory({title:'Nachhall – die Glocke',tint:'ghost',draw:M.mem&&M.mem.k3_bell,lines:['Nacht. Frost am Pfosten. Ein Mädchen zieht am Glockenseil, und die Glocke schlägt.','Sie wartet, bis der Ton über dem Wasser verschwunden ist.','Dann ruft sie hinüber: „Halo! Ima li koga?“ Ist da jemand?','Drüben, in einem der Fenster, ist ein Licht.','Sie läutet noch einmal. Und noch einmal. Dreimal, mit langen Pausen dazwischen.']});
  A.note('a3_bell3'); A.note('a3_voice'); A.setFlag('k3.n2.bell');
  await A.wait(600); await A.g('Dreimal.'); await A.wait(800); await A.g('Ich habe gerufen. Halo, ima li koga.');
  if (A.marko){ await A.m('Eine Mädchenstimme.'); await A.wait(500); await A.g('Meine.'); } else { await A.wait(500); await A.g('Meine Stimme. Ich habe sie gehört wie die von einer Fremden.'); }
  await A.wait(600); await A.g('Und drüben war ein Licht. Irgendwo.'); }
async function lightSeq(A){ await A.g('Noch einmal. Jetzt weiß ich, wo ich hinsehen muss.'); await A.wait(500);
  await A.memory({title:'Nachhall – dreimal',tint:'ghost',draw:M.mem&&M.mem.k3_lightorder,lines:['Das erste Läuten. Drüben ist alles dunkel, auch das kleine Fenster unter dem Dach.','Sie wartet. Da geht unter dem Dach ein Licht an.','Das zweite Läuten. Das Licht brennt. „Halo! Ima li koga?“','Sie wartet. Das Licht geht aus.','Das dritte Läuten, im Dunkeln. Danach nichts mehr.']});
  A.note('a3_lightseq'); await A.wait(600);
  await A.g('Beim ersten Läuten war es dunkel, beim zweiten brannte das Licht, beim dritten war es wieder aus.'); await A.wait(800);
  await A.g('Einer hat Licht gemacht. Und es wieder ausgemacht. Während ich geläutet habe.');
  if (A.marko) await A.m('Dann lege ich das neben Vlados Zeiten. Der Reihe nach.');
  else { await A.wait(500); await A.g('Das muss ich Marko sagen. Er zählt so gern.'); } }
async function anchorEcho(A){ var G=A.G;
  if (N(G,'a3_mine')){ if (F(G,'k3.d3.talk2')||fin(G)||epi(G)) return A.g(A.cycle('ancE3',['Hand über Hand. Du weißt es jetzt.','Es ist kalt. Immer noch. Aber es ist nur ein Seil.']));
    return A.g(A.cycle('ancE2',['Das ist meins. Ich habe es gesagt.','Nein.','Später. Vielleicht.'])); }
  await A.idleG(null); await A.g('…'); await A.wait(1300); await A.g('Nicht.'); await A.wait(1500); await A.g('Das ist meins.');
  A.note('a3_mine'); A.setFlag('k3.n2.anchor');
  if (A.marko){ await A.wait(600); await A.m('Mala?'); await A.wait(500); await A.g('Frag nicht. Nicht jetzt. Ich habe gesehen, was ich gesehen habe. Es gehört mir.'); } }
// ---------------------------------------------------------------- Die Lichtprobe von hier aus: Mala vergleicht (Marko hält drüben das Licht)
var LP={ kitchen:{t:'Zu breit.',more:'Das Fenster damals war klein. Und höher.'}, stube:{t:'Zu tief.',more:'Zu nah am Boden. Das Licht damals war oben.'} };
async function compare(A){ var G=A.G, lit=G.flags['k3.lit'];
  if (!lit){ if (N(G,'a3_roof')) return A.g('Das kleine Fenster unter dem Dach. Seine Kammer. Jetzt ist es dunkel.');
    return A.g(A.cycle('cmp0',['Das Haus. Bei Tag sind alle Fenster gleich.','Damals war eins davon hell. Welches, weiß ich, wenn ich es sehe.','Drei Fenster. Unten ein breites, daneben ein schmales, oben unter dem Dach ein kleines.'])); }
  if (lit==='roof'){ if (N(G,'a3_roof')) return A.g('Das ist es. Das kleine unter dem Dach.');
    await A.g('Da.'); await A.wait(1100); await A.g('Das kleine unter dem Dach. Das war es.');
    A.setFlag('k3.lp.roof'); A.note('a3_roof'); await A.wait(800); await A.g('Dort hat damals einer Licht gemacht. Ich muss es noch einmal hören. An der Glocke.'); return; }
  var L=LP[lit]; if (!L) return; var first=!F(G,'k3.lp.'+lit); A.setFlag('k3.lp.'+lit);
  await A.g(L.t); if (first){ await A.wait(600); await A.g(L.more); } }
K3S.compare=compare;
// ---------------------------------------------------------------- Läuten
async function ring(A){ var G=A.G;
  if (fin(G)) return finRing(A);
  if (n2(G)) return ringNight(A);
  if (d3(G)) return ringDay(A);
  if (epi(G)) return A.m(A.cycle('ringE',['Ich läute nicht. Drüben ist keiner mehr, der aufsteht.','Nein. Die Glocke hat genug geläutet.']));
  return A.m('Nicht jetzt.'); }
async function ringNight(A){ var G=A.G, k=(G.flags['k3.n2.rings']||0)+1, B=bato(A); A.setFlag('k3.n2.rings',k); await reach(A);
  if (k===1){ A.setFlag('k3.n2.rung'); await peal(A,0); flinch(A);
    await A.m('Ich ziehe am Seil. Die Glocke schlägt einmal, grün und rau, und der Ton geht über das Wasser und kommt vom anderen Ufer zurück.'); await A.wait(900);
    if (A.isFound('bato')){ await A.narrate('Drüben im Schuppen hebt sich die Laterne.'); await A.wait(500); await B.say('Bei Nacht fährt keiner!'); await B.say('Bei Hochwasser nicht!'); await A.wait(600); await B.say('Wer läutet da? Soldaten?'); await A.wait(500); await B.say('Geht!'); }
    else { await A.narrate('Drüben im Schuppen bewegt sich das Licht. Ich höre nichts außer dem Fluss.'); if (A.malaHere()){ await A.wait(400); await A.g('Da ruft einer. Drüben. Er sagt: Bei Nacht fährt keiner. Bei Hochwasser nicht.'); } }
    if (A.malaHere()){ await A.wait(700); await A.g('Hör auf. Bitte.'); }
    await neighborComes(A,false); return; }
  await peal(A,300);
  if (A.isFound('bato')) await B.say(A.cycle('btRing',['Ich habe gesagt: Geht! Bei Hochwasser fährt keiner!','Hört ihr nicht? Nachts nicht!','…']));
  if (k===2 && A.npc('komsija').actor){ await A.npc('komsija').say('Herr. Bitte. Es ist Nacht.'); return; }
  await A.narrate(A.cycle('ringN3',['Drüben geht das Licht im Schuppen aus, als hätte jemand die Hand davorgehalten. Dann ist es wieder da.','Der Ton geht über das Wasser. Oben an der Straße bellt Žuća.','Nichts. Nur der Fluss, der lauter ist als die Glocke.']));
  if (A.malaHere()) await A.g(A.cycle('ringNg',['Er kommt nicht. Er ist nie gekommen.','Lass es, Marko.'])); }
async function ringDay(A){ var G=A.G, k=(G.flags['k3.d3.rings']||0)+1; A.setFlag('k3.d3.rings',k); await reach(A); await peal(A,400); flinch(A);
  if (k===1){ await A.narrate('Der Ton geht über das Wasser, hell im Frost. Drüben hebt eine Frau den Kopf.'); await neighborComes(A,true); return; }
  await A.narrate(A.cycle('ringD',['Nichts. Drüben hebt Zlata den Kopf. Dann wirft sie den Hühnern weiter Körner hin.','Nichts. Nur der Ton über dem Wasser, und oben an der Straße ein Hund.','Nichts. Bei Tag fährt keiner. Das hat er gesagt.']));
  if (A.malaHere()) await A.g(A.cycle('ringDg',['Bei Tag kommt er nicht. Bei Tag schläft er im Schuppen, glaubt er.','Nicht so oft. Bitte.'])); }
// ---------------------------------------------------------------- Der Nachbar mit dem Hund
async function neighborComes(A,day){ var G=A.G, p=ap('komsija',[38,124,'R']); if (A.npc('komsija').actor) A.despawn('komsija');
  var K=A.spawn({id:'komsija',ch:'komsija',x:2,y:p[1],f:'R',name:'Nachbar',idle:'stand',speechY:46});
  A.ambient('dog',-0.8,1); await A.wait(500); await K.walk(p[0],p[1]); await K.face('R');
  if (!day){ await K.say('Herr.'); await A.wait(500); await K.say('Die Skela fährt seit achtundneunzig nicht mehr, Herr. Da ist eine Brücke.'); await A.wait(400); await K.say('Da oben. Mit der Laterne.'); }
  else await K.say(N(G,'a3_neighbor')?'Wieder Sie. Bei Tag auch nicht, Herr. Die Skela fährt seit achtundneunzig nicht mehr.':'Die Skela fährt seit achtundneunzig nicht mehr, Herr. Bei Tag auch nicht. Da oben ist eine Brücke.');
  if (!N(G,'a3_neighbor')) A.note('a3_neighbor'); A.setFlag('k3.n2.neighbor');
  if (!M.isMet(G,'komsija') && M.introduce) await M.introduce(A,'komsija');
  if (day){ await A.wait(500); await K.say('Ich gehe wieder. Žuća will ihr Frühstück.'); K.walk(10,p[1]); await A.wait(1500); if (K.actor) K.actor.fadeOut=A.gt; await A.wait(800); A.despawn('komsija'); } }
async function talkKomsija(A){ var K=A.npc('komsija');
  await A.menuLoop(function(){ return [
    {t:'Wer wohnt da drüben?',once:'kj1',go:async function(A){ await K.say('Zlata. Zlata Brkić. Die Frau vom Fährmann.'); await A.wait(500); await K.say('Bato ist seit fünf Jahren tot. Sie wohnt allein. Hühner, Walnüsse, samstags fährt sie auf den Markt.'); A.setFlag('k3.n2.zlataName'); }},
    {t:'Wer hat die Fähre gefahren?',once:'kj2',go:async function(A){ await K.say('Bato. Vierzig Jahre. Bei Tag, jeden Tag, auch im Krieg.'); await K.say('Nachts nie. Nachts hat er nicht einmal das Fenster aufgemacht.'); }},
    {t:'Warum hängt die Glocke noch?',once:'kj3',go:async function(A){ await K.say('Achtundneunzig kam die Brücke. Seitdem braucht keiner mehr eine Fähre.'); await A.wait(500); await K.say('Die Glocke hat Bato hängen lassen. Er hat gesagt: Vielleicht läutet ja noch einer.'); }},
    {t:'War hier im Krieg die Front?',once:'kj4',go:async function(A){ await K.say('Hier? Nein. Hier war Sperrstunde. Und im Winter Hochwasser.'); await K.say('Wer nachts unterwegs war, war verrückt oder wollte nichts Gutes. So hat man gedacht.'); }},
    {t:'Kennen Sie eine Mala?',once:'kj5',go:async function(A){ await K.say('Mala? Jede Kleine heißt hier Mala.'); await A.wait(500); await K.say('Ich war damals nicht da, Herr. Ich war in Deutschland, auf dem Bau. Fragen Sie Zlata. Oder lassen Sie sie schlafen.'); }},
    A.askOpt({ photo_full:'Ein Kind. Nein. Kinder kenne ich nur die von meiner Tochter, und die wohnen in Linz.', a3_bato:async function(A){ await K.say('Bato? Wie kommen Sie auf Bato?'); await A.wait(600); await K.say('Der ist tot, Herr. Zweitausendsechs. Im Winter, im Schuppen. Zlata hat ihn gefunden.'); },
      a3_soldier:'Soldaten? Hier? Seit fünfzehn Jahren nicht mehr.', a3_stumps:'Die alte Brücke. Im Sommer dreiundneunzig weg. Die Steine stehen noch. Steine bleiben.',
      a3_voice:'Eine Stimme? Bei dem Wasser hört man nicht einmal den eigenen Hund.', l3_skela:'Skela heißt Fähre, ja. Und das Dorf heißt wie die Fähre. Einfallsreich, was?' },'Das weiß ich nicht, Herr. Ich weiß nur, wann Žuća Hunger hat.'),
    {t:'Gute Nacht.',bye:true,go:async function(A){ await K.say('Laku noć. Und nicht mehr läuten, ja? Žuća bellt sonst bis zum Morgen.'); }}
  ]; }); }
// ---------------------------------------------------------------- Finale: Ankunft (das Gerüst ruft das nach der Fahrt), die Glocke, die Fähre, Batos Erkenntnis
M.k3FinArrive=async function(A){ var G=A.G; if (F(G,'k3.fin.arrived')) return; A.setFlag('k3.fin.arrived'); A.found('bato'); G.flags['met.bato']=true; resync(A);
  var V=A.npc('vlado'), K=A.npc('kata'); A.music('k3_fin');
  await A.narrate('Vlado fährt bis dorthin, wo der Schotter aufhört. Die Scheinwerfer liegen einen Atemzug lang auf der Hütte. Dann macht er sie aus.');
  await A.wait(800); await A.narrate('Dunkel. Kein Mond. Frost auf dem Pfosten, auf dem Gras, auf dem Seil am Anker.');
  await A.wait(700); await V.say('Hier.'); await A.wait(900); await V.say('Hier habe ich abgeladen. In die Hütte. Da hatte sie noch ein Dach.');
  await A.wait(600); await V.say('Und um zwei habe ich hier gestanden und gerufen.'); await K.say('Papa.'); await V.say('Schon gut.');
  if (A.malaHere()){ await A.wait(900); await A.g('Es ist so dunkel wie damals.'); await A.wait(500); await A.g('Nur der Fluss ist leiser.'); }
  await A.wait(700); await A.m('Heute weiß er, wer läutet.');
  if (A.malaHere()){ await A.wait(500); await A.g('Läute, Marko. Dreimal. Mit Pausen. So wie ich.'); } };
async function finRing(A){ var G=A.G;
  if (F(G,'k3.fin.boarded')) return A.m('Die Glocke schweigt. Diesmal ist einer gekommen.');
  if (F(G,'k3.fin.rung')) return A.m(A.cycle('fRing2',['Er ist ja da. Er wartet.','Nicht noch einmal. Er hat es gehört.']));
  A.setFlag('k3.fin.rung'); G.flags['mala.lock']=true; var V=A.npc('vlado'), K=A.npc('kata');
  try{ await reach(A); A.music('k3_fin');
    await peal(A,1600); await A.m('Einmal.'); await A.wait(1500);
    await peal(A,1600); flinch(A); await A.m('Zweimal.'); await A.wait(1500);
    await peal(A,1800); await A.m('Dreimal.'); await A.wait(1600);
    await A.narrate('Stille. Der Fluss. Kata hält den Atem an, oder friert.'); await A.wait(1200);
    A.setFlag('k3.fin.ferry','far'); A.sfx('lantern'); resync(A); await A.narrate('Drüben im Schuppen flammt ein Licht auf. Jemand hebt eine Laterne.');
    await A.wait(700); await bato(A).say('Dolazim!'); await A.m('„Ich komme!“'); await A.wait(500); A.sfx('rope'); await A.wait(900);
    await A.narrate('Am Steg drüben bewegt sich etwas Dunkles. Ein Ponton mit einem Geländer, und vorn die Laterne.');
    await K.say('Was ist?'); await A.m('Die Fähre.'); await K.say('Hier ist keine Fähre. Da ist nur Wasser.'); await V.say('Lass ihn.');
    A.setFlag('k3.fin.ferry','mid'); resync(A); A.sfx('ferryCreak'); await A.wait(1200);
    await A.narrate('Sie gleitet an einem Seil, das es nicht mehr gibt. Das Seil ist aus Licht, und es summt.');
    if (A.malaHere()){ await A.animG('tinF'); await A.g('…'); }
    await A.wait(2500); A.setFlag('k3.fin.ferry','here'); resync(A); A.sfx('rope'); await A.wait(2600);
    await A.narrate('Die Laterne wird größer. Man hört das Wasser am Schwimmkörper, und eine Stange, die in den Grund stößt.'); await A.wait(2200); A.sfx('ferryCreak'); await A.wait(800);
    var b=ap('bato',[236,99,'L']); A.spawn({id:'bato',ch:'bato',x:b[0],y:b[1],f:b[2]||'L',name:'Bato',ghost:true,reveal:true,idle:'lamp',speechY:50,anchor:batoAnchor});
    await A.wait(900); await A.narrate('Die Fähre legt an. Holz an Beton, ein Stoß. Auf dem Ponton steht ein alter Mann in Wathose und hält die Laterne hoch.');
    await finRealize(A);
  } finally { G.flags['mala.lock']=false; } }
function batoAnchor(S,G){ if (G.flags['k3.fin.crossed']) return null; var sp=M.spot('skela_d','bell'); return sp[2]?[sp[0]+sp[2]-4,sp[1]+10]:null; }
async function finRealize(A){ var G=A.G, B=bato(A);
  await B.say('Wer hat geläutet?'); await A.wait(1100);
  if (A.malaHere()){ await A.narrate('Mala geht an den Anleger, ins Licht der Laterne. Sie tut es selbst. Ich sage nichts.'); var art=M.ART.skela_d, rp=(art&&art.ferry&&art.ferry.here)||[236,99,1]; await A.walkG(rp[0]-22,rp[1]+13); await A.faceG('R'); }
  await A.wait(1000); await B.say('Ti.'); await A.wait(1500); await A.g('…');
  await B.say('Du hast geläutet. Dreimal.'); await A.wait(600); await A.g('Dreimal.');
  B.agitate(3200); await A.wait(500); await B.say('Ich habe am Fenster gestanden.'); await A.wait(800); await B.say('Und am Morgen …'); await A.wait(1300);
  await B.say('Ich habe dich unter die Quitte gelegt. Mit diesen Händen.');
  await A.wait(800); await A.narrate('Er sieht auf seine Hände. Die Laterne zittert.'); A.music('k3_duh');
  await A.realize('bato'); A.setFlag('k3.fin.bato');
  await A.wait(800); await B.say('Siebzehn Jahre.'); await A.wait(900); await B.say('Zweitausendsechs. Im Winter. Ich bin eingeschlafen. Zlata sagt immer, ich hatte einen tiefen Schlaf.');
  await A.wait(700); await B.say('Und dann war wieder Januar.'); await A.wait(1100); await B.say('Dann bin ich …'); await A.wait(1300); await A.g('Ja.');
  await A.wait(1500); await B.say('Steig ein.'); await A.wait(700); await B.say('Diesmal fahre ich.'); B.mood('sad');
  G.flags['mala.lock']=false; if (G.malaOn && G.pos.mala.room==='skela_d') await A.switchTo('mala');
  await M.k3Checkpoint(A,1); }
K3S.finRealize=finRealize;
// ---------------------------------------------------------------- Malas Entscheidung: einsteigen oder nicht
async function boardMenu(A){ var B=bato(A), G=A.G; if (!waiting(G)) return B.say(F(G,'k3.fin.boarded')?'Halt dich fest.':'Gleich.');
  await A.menuLoop(function(){ return [
    {t:'(Einsteigen.)',silent:true,go:async function(A){ await board(A); return 'bye'; }},
    {t:'Du hast am Fenster gestanden.',once:'btF1',go:async function(A){ await B.say('Ja.'); await A.wait(600); await B.say('Ich habe gezählt. Eins. Zwei. Beim dritten habe ich das Licht ausgemacht.'); await A.wait(500); await A.g('Ich habe es gesehen.'); }},
    {t:'Warum bist du nicht gekommen?',once:'btF2',go:async function(A){ await A.wait(600); await B.say('Weil ich gedacht habe, ich weiß, wer nachts läutet.'); await A.wait(900); await B.say('Vierzig Jahre Fähre. Und ich habe es nicht gewusst.'); }},
    {t:'Wohin fährst du mich?',once:'btF3',go:async function(A){ await B.say('Hinüber. Wohin sonst.'); await A.wait(500); await B.say('Zu Zlata.'); }},
    {t:'(Noch nicht.)',silent:true,go:async function(A){ await notYet(A); return 'bye'; }}
  ]; }); }
async function notYet(A){ var B=bato(A), n=(A.flag('k3.fin.waits')||0)+1; A.setFlag('k3.fin.waits',n);
  if (n===1){ await A.wait(600); await B.say('Ich warte.'); await A.wait(800); await B.say('Diesmal warte ich.'); return; }
  await B.say(A.cycle('btWait',['Ich warte. Ich habe Zeit. Jetzt habe ich Zeit.','Die Fähre bleibt hier. Ich bleibe hier.','Ich warte, Mädchen.'])); }
async function boardChoice(A){ var c=await A.choose([{t:'(Einsteigen.)',id:'in',silent:true},{t:'(Noch nicht.)',id:'no',silent:true}],{title:'Die Fähre'}); if (c==='in') return board(A); return notYet(A); }
async function rideAlong(A,ms){ var art=M.ART.skela_d, E=M.E, t0=A.gt, off={}, here=(art&&art.ferry&&art.ferry.here)||[236,99,1];
  var p0=(art&&art.ferryAt&&art.ferryAt(A.S,A.G))||here; ['bato','mala'].forEach(function(id){ var a=E.ACT[id]; if (a) off[id]=[a.x-p0[0],a.y-p0[1]]; });
  while (A.gt-t0<ms){ var p=art&&art.ferryAt?art.ferryAt(A.S,A.G):null; if (p) Object.keys(off).forEach(function(id){ var a=E.ACT[id]; if (a){ a.x=p[0]+off[id][0]*p[2]; a.y=p[1]+off[id][1]*p[2]; } }); await A.wait(50); } }
async function board(A){ var G=A.G, B=bato(A); if (F(G,'k3.fin.boarded')) return;
  A.setFlag('k3.fin.boarded'); G.flags['mala.noSwitch']=true; A.music('k3_fin');
  var deck=ap('bato',[236,99,'L']); await A.walkG(deck[0]-12,deck[1]+1); await A.faceG('R');
  await A.narrate('Mala steigt auf den Ponton. Ihre Füße machen kein Geräusch auf dem Holz.'); await A.wait(500);
  await B.say('Halt dich fest.'); await A.wait(500); await A.g('Ich halte meine Dose.'); await A.animG('tinF');
  await A.wait(700); A.sfx('rope'); await B.anim('pole'); A.sfx('ferryCreak');
  A.setFlag('k3.fin.ferry','mid'); resync(A); await rideAlong(A,1800);
  if (A.mala) A.mala.fadeOut=A.gt; if (B.actor) B.actor.fadeOut=A.gt; await rideAlong(A,1000); A.despawn('bato');
  await A.narrate('Die Fähre legt ab. Das Seil aus Licht spannt sich über den Fluss, und der Fluss schiebt dagegen.'); await A.wait(900);
  var Bv=bato(A);
  await Bv.say('Hochwasser. Das Wasser will nach Süden, und wir wollen hinüber.'); await A.wait(600); await A.g('Er ist so laut.'); await Bv.say('Er war immer so laut. Im Januar.');
  await A.wait(1500); await A.g('Hier.'); await A.wait(1000); await A.g('Hier habe ich losgelassen.'); await A.wait(1400);
  await Bv.say('Ich halte das Seil. Halt du deine Dose.'); await A.wait(1100);
  await A.g('Du hast gezählt.'); await Bv.say('Ja. Eins. Zwei. Drei.'); await A.wait(800); await A.g('Ich auch.');
  await A.wait(1300); await A.narrate('Mitten im Fluss. Die Laterne schaukelt. Mala hält die Dose mit beiden Händen und sieht nicht hinunter.');
  var lp=M.stand('skela_l','landing')||[300,124,'L']; G.pos.mala={room:'skela_l',x:lp[0],y:lp[1],f:'L'};
  await A.switchTo('marko'); var V=A.npc('vlado'), K=A.npc('kata');
  await A.wait(500); await A.m('Sie ist auf dem Fluss. Auf einer Fähre, die es nicht gibt.'); await K.say('Wer? Wo?'); await A.wait(600); await V.say('Lass ihn, Kata.');
  await A.wait(500); await A.m('Über die Brücke. Schnell.'); await V.say('Ich komme mit. Kata, komm.'); }
K3S.board=board;
// ---------------------------------------------------------------- Epilog: mit Nada
async function arriveEpi(A){ var G=A.G; if (F(G,'k3.e.mothers')) return A.narrate('Vlado wartet am Lastwagen. Er raucht nicht. Er sieht auf den Fluss.');
  if (F(G,'k3.e.skela')) return;
  A.setFlag('k3.e.skela'); var V=A.npc('vlado'), p=M.E.ACT.marko?[Math.round(A.marko.x)+22,Math.round(A.marko.y)+2]:[56,126];
  var Nd=A.spawn({id:'nada',ch:'nada',x:p[0],y:p[1],f:'R',name:'Nada',speechY:44});
  await A.narrate('Vlado hält an der Hütte. Er stellt den Motor ab und bleibt sitzen, die Hände am Lenkrad.');
  await A.wait(500); await A.narrate('Nada ist ausgestiegen, bevor der Motor ganz still war. Sie steht an der Kante und sieht auf den Fluss.');
  await A.wait(900); await Nd.say('Hier?'); await A.wait(500); await A.m('Hier hat sie geläutet.'); await A.wait(800); await A.m('Drüben liegt sie. Unter dem Quittenbaum.');
  await A.wait(900); await Nd.say('Dann gehen wir dorthin.');
  var br=sd('to_bridge',[466,122,'R']); Nd.walk(br[0],br[1]);
  if (A.malaHere()){ await A.wait(600); await A.g('Mama geht schnell. Wie immer.'); }
  await A.wait(900); if (Nd.actor) Nd.actor.fadeOut=A.gt; await A.wait(900); A.despawn('nada');
  await A.m('Sie geht voraus. Über die neue Brücke.'); await V.say('Ich bleibe beim Lastwagen. Gehen Sie.'); }
// ---------------------------------------------------------------- Mala am rechten Ufer (Raum-Haken für das Gespräch mit ihr)
function malaTalk(A){ var G=A.G;
  if (fin(G) && !F(G,'k3.fin.rung')) return (async function(){ await A.m('Bist du bereit?'); await A.wait(500); await A.g('Nein.'); await A.wait(500); await A.g('Läute trotzdem.'); })();
  if (waiting(G)) return (async function(){ await A.m('Willst du?'); await A.wait(600); await A.g('Frag mich das nicht. Nicht jetzt. Das ist meins.'); })();
  if ((n2(G)||d3(G)) && F(G,'k3.z.askSign') && !F(G,'k3.z.signSaid')) return explainSign(A);
  return null; }
function malaLook(A){ var G=A.G;
  if (waiting(G)) return A.m('Mala am Anleger, im Licht der Laterne. Sie hält ihre Dose und sieht auf das Wasser, nicht auf ihn.');
  if (fin(G)) return A.m('Mala. In dieser Nacht sieht sie aus wie das Mädchen auf dem Mehlsack. Nur ohne Bleistift.');
  if (n2(G)) return A.m(A.cycle('mlN2',['Mala, an der Glocke. Sie steht so still, dass der Frost durch sie hindurch auf das Gras fällt.','Sie sieht hinüber. Sie sieht nicht hinunter.']));
  if (d3(G)) return A.m(A.cycle('mlD3',['Mala am Pfosten. Bei Tag sieht man durch sie hindurch das andere Ufer.','Sie wartet. Sie kann warten. Das hat sie gelernt.']));
  return null; }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'road',name:function(S,G){ return fin(G)||epi(G)?'Straße':'Straße (Taxi)'; },exit:{to:'map'},
   look:function(A){ var G=A.G; if (fin(G)) return A.m('Die Schotterstraße. Vlados TAM steht da, ohne Licht. Der Motor knackt in der Kälte.'); if (epi(G)) return A.m('Vlados Lastwagen an der Straße. Er hat den TAM gewaschen. Für Nada.');
     return A.m(n2(G)?'Die Schotterstraße endet hier. Das Taxi wartet mit laufendem Motor, die Scheinwerfer auf das Gras.':'Das Taxi wartet an der Straße. Der Fahrer liest Zeitung und hat das Radio an.'); },
   canExit:async function(A){ var G=A.G; if (fin(G)){ await A.m('Heute fahre ich nicht weg. Wir sind hier, bis es vorbei ist.'); return false; }
     if (epi(G) && !F(G,'k3.e.mothers')){ await A.m('Erst zu ihr. Nada wartet nicht.'); return false; } return true; },
   g:{look:'Die Straße nach Mostar. Zehn Kilometer, sagt er. Für mich ist nichts weit.',sense:'Reifenspuren. Ein Lastwagen, der hier gewendet hat, schwer beladen. Und später noch einmal, leer.',listen:'Der Motor. Ein Radio, das einer leiser gedreht hat. Und der Fluss, der alles andere zudeckt.'}},
 {id:'hut',name:'Hütte',look:function(A){ var G=A.G; return A.m(night(G)?'Die Hütte, eine Ruine. Bruchsteinmauern, das halbe Dach aus Steinplatten, die andere Hälfte nur noch Sparren gegen den Himmel.':'Die Hütte bei Tag: Brennnesseln in der Tür, ein verrosteter Haken an der Wand. Hier haben sie damals das Mehl gelagert, für die Dörfer.'); },
   open:'Keine Tür mehr. Nur ein Loch in der Mauer, durch das der Wind geht.', use:'Drinnen nur Brennnesseln und ein Mehlsack, der zu Stein geworden ist.',
   g:{look:'Sie hatte ein Dach. Damals. Und es roch nach Mehl.',sense:function(A){ return hutEcho(A); },listen:'Mäuse. Und der Wind in den Sparren. Damals war es hier drin ganz still.'}},
 {id:'bell',name:'Glocke',look:function(A){ var G=A.G; if (fin(G) && F(G,'k3.fin.rung')) return A.m('Die Glocke hängt still. Das Seil schwingt noch ein wenig.'); return A.m(night(G)?'Eine Schiffsglocke aus Messing an einem Holzpfosten, grün angelaufen, mit einem Seilzug. Frost auf dem Rand.':'Die Glocke. Grün, mit einer Delle am Rand. In den Pfosten hat jemand Kerben geschnitten, viele, in Reihen.'); },
   use:function(A){ return ring(A); }, push:function(A){ return ring(A); }, take:'Die hängt fest. Seit achtundneunzig, sagt der Nachbar.',
   g:{look:function(A){ var G=A.G; if (!A.isFound('bato')) return findBato(A,'bell'); if (fin(G)) return A.g('Er ist gekommen. Die Glocke hat es endlich geschafft.'); return A.g('Seine Leine endet hier. An der Glocke. Daran, dass er nicht kam.'); },
     sense:function(A){ return bellEcho(A); },listen:function(A){ return A.g(A.flag('k3.fin.rung')?'Sie summt noch. Ganz leise. Wie eine, die endlich Antwort bekommen hat.':'Sie summt im Wind. Ganz leise. Oder ich bilde es mir ein.'); }}},
 {id:'anchor',name:'Seilanker',look:'Ein Betonblock mit einem Eisenring. Ein Stück Stahlseil hängt die Rampe hinunter ins Wasser, rostig, und verschwindet.',
   use:async function(A){ await A.m('Ich ziehe am Seil. Es kommt kein Stück. Es geht irgendwohin, unter Wasser.'); if (A.malaHere() && !A.hasNote('a3_mine')) await A.g('Lass das.'); }, take:'Das Seil ist festgerostet. Es gehört dem Fluss.',
   g:{look:'Der Anker. Ein Ring. Ein Seil, das ins Wasser geht.',sense:function(A){ return anchorEcho(A); },listen:'Das Seil singt, wenn das Wasser daran zieht. Ich mag das Lied nicht.'}},
 {id:'stumps',name:'Pfeilerstümpfe',look:async function(A){ await A.m('Drei Pfeilerstümpfe der alten Brücke, mitten im Fluss. Das Wasser bricht sich weiß an ihnen. Wie abgebrochene Zähne.'); if (!A.hasNote('a3_stumps') && A.malaHere()){ await A.wait(900); await A.g('Das ist meine.'); A.note('a3_stumps'); } },
   g:{look:'Meine Brücke. Im Licht vom Lastwagen standen sie da wie jetzt. Nur oben war nichts mehr.',sense:'Sie haben eine Straße getragen. Busse, Kühe, Hochzeiten. Jetzt tragen sie nur noch Wasser.',listen:'Das Wasser schlägt an die Steine. Immer an dieselbe Stelle.'}},
 {id:'river',name:'Neretva',look:function(A){ return A.m(night(A.G)?'Die Neretva, schwarz und laut, tief unten. Man sieht sie nicht. Man hört sie.':'Die Neretva. Grün, schnell, mit weißen Strudeln an den Stümpfen. Unten am Ufer Schilf und eine Weide.'); },
   g:{look:function(A){ if (!A.isFound('bato') && night(A.G)) return findBato(A,'river'); return A.g('Grün und laut, tief unten. So habe ich ihn mir gemerkt.'); },sense:'Nein. Das spüre ich nicht. Das will ich nicht spüren.',listen:'Er ist so laut. Wie damals. Er hört nie auf.'}},
 {id:'far_house',name:'Zlatas Haus',look:function(A){ var G=A.G, l=G.flags['k3.lit']; if (d3(G) && l) return A.m('Drüben, in einem Fenster, mein Handylicht. Von hier sieht es aus wie ein Stern, der falsch hängt.');
     return A.m(night(A.G)?'Drüben ein Haus, weiß im Dunkeln. Die Fenster sind dunkel. Jemand schläft dort, oder liegt wach.':'Ein weißes Haus mit Steindach. Unten ein breites Fenster, daneben ein tiefes, schmales, oben unter dem Dach ein kleines.'); },
   with:{ mobitel:'Das Licht reicht nicht über den Fluss. Ich müsste drüben sein, im Haus.' },
   g:{look:function(A){ var G=A.G; if (!A.isFound('bato') && night(G)) return findBato(A,'house'); if (d3(G)) return compare(A); if (fin(G)||epi(G)) return A.g('Das Haus, wo ich am Herd lag. Ich sehe es jetzt, und es tut nicht weh.'); return A.g('Da drüben wohnt die Frau vom Markt. Da zieht es hin.'); },
     sense:'Zu weit. Ich spüre nur, wohin es zieht. Dahin.',listen:'Hühner. Ein Radio. Und jemand, der Holz nachlegt.'}},
 {id:'far_shed',name:'Schuppen drüben',look:function(A){ var G=A.G; if (A.isFound('bato') && !fin(G) && !epi(G)) return A.m(n2(G)?'Drüben im Schuppen der alte Mann mit der Laterne. Er steht und sieht herüber. Nicht größer als mein Daumen.':'Drüben im Schuppen steht er, auch bei Tag, die Laterne in der Hand. Für ihn ist immer Nacht.');
     return A.m(night(G)?'Drüben am Steg ein offener Schuppen. Darin brennt eine Laterne.':'Ein offener Holzschuppen am Steg. Ruder, ein Netz, eine Wathose an einem Haken.'); },
   g:{look:function(A){ var G=A.G; if (!A.isFound('bato')) return findBato(A,'shed'); if (fin(G)) return A.g('Sein Schuppen. Er ist leer. Er ist hier, auf der Fähre.'); return A.g(n2(G)?'Er steht im Schuppen und hält die Laterne hoch. Er wartet, ob noch einer läutet.':'Er steht im Schuppen, die Laterne in der Hand, am hellen Tag.'); },
     sense:'Ein Mann, der am Fenster stand. Das spüre ich bis hier.',listen:function(A){ return A.g(A.isFound('bato')?'Er murmelt. „Bei Nacht nicht. Bei Hochwasser nicht.“ Immer wieder.':'Da drüben ist jemand. Er atmet, wie einer, der zuhört.'); }}},
 {id:'far_tree',name:'Quittenbaum drüben',look:function(A){ return A.m(night(A.G)?'Ein Baum neben dem Haus, schwarz gegen das Weiß der Wand.':'Ein Quittenbaum neben dem Haus. Unter ihm etwas Buntes. Blumen, im November.'); },
   g:{look:function(A){ var G=A.G; if (!A.isFound('bato') && night(G)) return findBato(A,'tree'); if (A.hasNote('a3_grave')) return A.g('Da. Unter dem Baum. Da liege ich.'); return A.g('Da zieht es hin. Zu ihr. Zum Baum. Ich weiß nicht, warum.'); },
     sense:'Unter dem Baum ist es warm. Warm wie unter einer Decke.',listen:'Eine Quitte fällt. Dann nichts.'}},
 {id:'to_bridge',name:'Zur neuen Brücke',exit:{to:'skela_most',gok:true,get leaveMala(){ return crossing(M.GS); }},
   look:'Flussauf die neue Brücke von achtundneunzig. Beton, ein Rohrgeländer, eine Laterne. Dreihundert Meter von hier.',
   canExit:async function(A){ var G=A.G;
     if (A.isMala()){ if (epi(G)){ if (A.first('!k3.sd.gBridge')) await A.g('Jetzt geht es. Jetzt ist es nur eine Brücke.'); return true; }
       await A.g(A.cycle('gBr',['Nicht hier. Nicht an dieser Stelle.','Nein. Über diesen Fluss nicht. Nicht hier.'])); return false; }
     if (fin(G)){ if (!F(G,'k3.fin.rung')){ await A.m('Erst die Glocke. Deshalb sind wir hier.'); return false; }
       if (!F(G,'k3.fin.boarded')){ await A.m(A.cycle('finBr',['Ich warte. Das ist ihre Entscheidung, nicht meine.','Nicht ohne sie. Ich bleibe, bis sie sich entschieden hat.'])); return false; } return true; }
     if ((A.G.phase==='k3_d2_n'||d3(G)) && A.malaHere() && A.first('!k3.sd.brFirst')){ await A.g('Nicht hier.'); await A.wait(500); await A.g('Nicht an dieser Stelle.');
       await A.m('Es ist eine Brücke. Eine neue.'); await A.g('Es ist der Fluss. Derselbe.'); await A.wait(600); await A.m('Dann gehe ich allein. Es ist nicht weit.'); await A.g('Geh. Ich sehe dich von hier.'); }
     return true; },
   g:{look:'Die neue Brücke. Ich sehe sie. Für mich ist da nur Wasser.',sense:'Beton. Er hat nichts erlebt. Er ist zu jung für diesen Fluss.',listen:'Ein Auto, ganz oben. Dann wieder der Fluss.'}},
 {id:'landing',name:'Anlegestelle',look:function(A){ var G=A.G; if (fin(G) && ferry(G)==='here') return A.m('Am Ende der Rampe liegt die Fähre. Ein Ponton aus Licht und alten Brettern. Man sieht das Wasser durch ihn hindurch.');
     return A.m('Eine Betonrampe hinunter zum Wasser. Hier hat die Fähre angelegt. Unten schwarze Bretter, Algen, ein Ring für das Tau.'); },
   use:function(A){ return A.m(waiting(A.G)?'Das ist ihre Fähre. Nicht meine.':'Ich gehe nicht ans Wasser. Nicht hier, nicht nachts.'); },
   g:{look:async function(A){ var G=A.G; if (waiting(G)){ await A.g('Die Fähre. Er hält sie mit der Stange fest, gegen den Fluss.'); await A.g('Wenn ich einsteige, fährt er.'); return boardChoice(A); }
       return A.g('Hier hätte sie angelegt. Wenn er gekommen wäre.'); },
     sense:'Viele Füße. Kühe, Säcke, Fahrräder, Hochzeiten. Vierzig Jahre lang. Und keiner in der Nacht.',listen:'Das Wasser schlägt gegen die Rampe. Wie einer, der an eine Tür klopft.'}},
 {id:'komsija',npc:'komsija',name:'Nachbar',hgt:46,vis:function(S,G){ return n2(G) && F(G,'k3.n2.neighbor'); },talk:function(A){ return talkKomsija(A); },
   look:'Der Nachbar, Arbeitsjacke, Stirnlampe. Neben ihm sitzt ein kleiner gelber Hund und sieht zur Glocke.',
   g:{look:'Er hat einen Hund. Der Hund sieht mich. Hunde sehen mich immer.',sense:'Er riecht nach Holzrauch und Hund. Er war damals nicht hier. Ich spüre es an ihm.',listen:'Er denkt an seinen Ofen. Und an seine Tochter in Linz.'}},
 {id:'vlado',npc:'vlado',name:'Vlado',hgt:48,vis:function(S,G){ return (fin(G) && !F(G,'k3.fin.crossed') && (!F(G,'k3.fin.boarded')||G.pos.marko.room==='skela_d')) || epi(G); },
   talk:async function(A){ var V=A.npc('vlado'), G=A.G; if (epi(G)) return V.say(F(G,'k3.e.mothers')?'Wohin jetzt? Ich fahre, wohin Sie wollen.':'Gehen Sie mit ihr. Ich bleibe beim Lastwagen.');
     if (!F(G,'k3.fin.rung')) return V.say(A.cycle('vlF0',['Läuten Sie. Ich kann es nicht.','Ich habe damals nicht geläutet. Ich habe nur gerufen.']));
     if (waiting(G)) return V.say('Ich sehe nichts. Aber Sie sehen etwas. Das reicht mir.'); return V.say('Gehen wir. Über die Brücke.'); },
   look:function(A){ return A.m(fin(A.G)?'Vlado, die Mütze tief im Gesicht, ohne Zigarette. Er hat die Hände in den Taschen und sieht auf das Wasser.':'Vlado am Lastwagen. Er hat sich rasiert.'); },
   g:{look:'Er hat nicht falsch gemacht, was er falsch gemacht hat. Er hat nur nicht gewusst, wie.',sense:'Diesel und Tabak. Unser Führerhaus. Er hat es siebzehn Jahre mit sich getragen.',listen:'Er zählt. Bis drei, immer wieder. Wie ich.'}},
 {id:'kata',npc:'kata',name:'Kata',hgt:46,vis:function(S,G){ return fin(G) && !F(G,'k3.fin.crossed') && (!F(G,'k3.fin.boarded')||G.pos.marko.room==='skela_d'); },
   talk:async function(A){ var K=A.npc('kata'); return K.say(A.cycle('ktF',['Ich verstehe nichts davon. Ich bin nur wegen ihm hier.','Papa fährt nachts. Zum ersten Mal, seit ich zwölf war.','Wenn Sie etwas sehen, sagen Sie es. Ich sehe nur Wasser.'])); },
   look:'Kata, die Arme verschränkt gegen die Kälte. Sie sieht nicht auf den Fluss. Sie sieht auf ihren Vater.',
   g:{look:'Sie hat ihn damals im Führerhaus sitzen sehen. Bis zum Morgen. Sie war zwölf.',sense:'Öl an den Händen. Und Angst, die sie für Wut hält.',listen:'Sie hat Angst um ihn. Nicht vor dem Dunkel.'}},
 {id:'bato',npc:'bato',name:'Bato',hgt:50,vis:function(S,G){ return fin(G) && ferry(G)==='here'; },
   talk:async function(A){ var B=bato(A), G=A.G; if (!F(G,'k3.fin.bato')) return B.say('Wer hat geläutet?'); return B.say(A.cycle('btM',['Das ist ihre Fähre heute. Nicht Ihre.','Ich warte auf sie, Übersetzer. Nicht auf Sie.'])); },
   look:function(A){ return A.m(F(A.G,'k3.fin.bato')?'Bato auf seiner Fähre, die Stange in der Hand. Er sieht Mala an wie einer, der eine Schuld gefunden hat, die er lange gesucht hat.':'Ein alter Mann in Wathose auf einem Ponton aus Licht, eine Sturmlaterne in der erhobenen Hand.'); },
   g:{look:'Er hat mich begraben. Unter der Quitte. Und er hat am Fenster gestanden.',talk:function(A){ return boardMenu(A); },
     sense:'Siebzehn Jahre Januar. Er ist so müde.',listen:'Er sagt nichts. Er wartet. Ich höre, wie er wartet.'}}
];
M.room('skela_d',{ name:'Skela', scape:'k3_skela_d',
  music:function(G){ if (fin(G)){ if (F(G,'k3.fin.bato') && !F(G,'k3.fin.boarded')) return 'k3_duh'; return 'k3_fin'; } if (epi(G)) return 'k3_epi'; return 'k3_skela'; },
  state:function(G){ return sync({},G); },
  actors:function(S,G){ sync(S,G); var L=[];
    if (n2(G) && F(G,'k3.n2.neighbor')){ var k=ap('komsija',[38,124,'R']); L.push({id:'komsija',ch:'komsija',x:k[0],y:k[1],f:k[2]||'R',name:'Nachbar',idle:'stand',speechY:46}); }
    if ((fin(G) && !F(G,'k3.fin.crossed') && (!F(G,'k3.fin.boarded')||G.pos.marko.room==='skela_d')) || epi(G)){ var v=ap('vlado',[46,121,'R']); L.push({id:'vlado',ch:'vlado',x:v[0],y:v[1],f:v[2]||'R',name:'Vlado',idle:fin(G)?'quiet':'smoke',speechY:46}); }
    if (fin(G) && !F(G,'k3.fin.crossed') && (!F(G,'k3.fin.boarded')||G.pos.marko.room==='skela_d')){ var c=ap('kata',[68,127,'R']); L.push({id:'kata',ch:'kata',x:c[0],y:c[1],f:c[2]||'R',name:'Kata',idle:'arms',speechY:44}); }
    if (fin(G) && ferry(G)==='here'){ var b=ap('bato',[236,99,'L']); L.push({id:'bato',ch:'bato',x:b[0],y:b[1],f:b[2]||'L',name:'Bato',ghost:true,reveal:true,idle:F(G,'k3.fin.bato')?'pole':'lamp',speechY:50,anchor:batoAnchor}); }
    return L; },
  hotspots:HS, malaTalk:malaTalk, malaLook:malaLook,
  onSwitch:async function(A,who){ var G=A.G; if (who==='mala' && d3(G) && G.flags['k3.lit'] && !F(G,'k3.lp.'+G.flags['k3.lit']) && A.first('!k3.sd.litSeen.'+G.flags['k3.lit'])) await A.g('Drüben ist ein Licht. Er hält es ins Fenster.'); },
  enter:async function(A,from){ var G=A.G;
    if (n2(G)){ if (from==='map') return arriveN2(A); if (from==='skela_most') return backFromBridge(A); }
    if (d3(G)){ if (from==='map') return arriveD3(A); if (from==='skela_most') return backFromBridge(A); }
    if (epi(G) && from==='map') return arriveEpi(A); }
});
})(M);
