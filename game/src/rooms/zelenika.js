/* ===== rooms/zelenika.js — Haus Zelenika mit Feigengarten: Jela mit dem Schlüssel („Sad je došao. Kad treba prodavat.“), Marko übersetzt
   zwischen Lena und Jela; am Sonntag Mate am Pfosten, Lenas Satz („Došli smo, dida.“), der Schlüssel am Tor, die Feigen, der Schlüssel
   in der Astgabel, die Schwelle zur Zwischenwelt, Davors offene Entscheidung. Vorgaben: K3_SPEC.md, Konzept 4.6, 5.4, 6.2 B1–B7 ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
function sat(G){ return G.phase==='k3_d2'; } function sun(G){ return G.phase==='k3_d3'; }
function mateHere(G){ return sun(G) && !F(G,'k3.b.limbo'); }
function jelaHere(G){ return (sat(G)&&F(G,'k3.b.arrived')) || sun(G); }
function davorHere(G){ return (sat(G) && F(G,'k3.b.arrived') && !F(G,'k3.b.jela')) || (sun(G) && F(G,'k3.b.invite')); }
function lenaHere(G){ return davorHere(G); }
M.k3ZelOutside=davorHere;
function spotC(id){ var s=M.spot('zelenika',id); return s[2]?[s[0]+(s[2]>>1),s[1]+(s[3]>>1)]:null; }
// ---------------------------------------------------------------- Samstag: Jela mit dem Schlüssel
async function satArrival(A){ var G=A.G, J=A.npc('jela'), Dv=A.npc('davor'), Ln=A.npc('lena'); A.music('k3_mate');
  await A.narrate('Ein Gastarbeiterhaus am Südrand: unten verputzt, oben roher Ziegel, ein Balkon mit Eisengeländer. Ein grünes Tor, ein gemauerter Pfosten, zwei kahle Feigenbäume. Vor dem Tor ein Koffer.');
  await A.narrate('Aus dem kleinen Haus nebenan kommt eine alte Frau mit braunem Kopftuch, einen Schlüssel in der Hand. Sie bleibt vor Davor stehen und sieht ihn an, von unten bis oben.');
  await J.say('Sad je došao.'); await A.wait(1000); await J.say('Kad treba prodavat.');
  await A.wait(800); await Dv.say('Dobar dan, teta Jela.'); await A.wait(600); await A.narrate('Jela antwortet nicht. Sie gibt ihm den Schlüssel, ohne ihn anzusehen.'); G.flags['met.jela']=true;
  await A.wait(500); await Ln.say('Was hat sie gesagt?');
  var c=await A.choose([{t:'„Jetzt kommt er. Wenn es ums Verkaufen geht.“',id:'true'},{t:'„Sie sagt, schön, dass ihr da seid.“',id:'soft'}],{title:'Lena'});
  A.setFlag('k3.b.jelaTr',c==='soft'?'soft':'true');
  if (c==='soft'){ await Ln.say('Das klang aber nicht nach schön.'); await A.wait(600); await A.m('Nein. Sie hat gesagt: Jetzt kommt er. Wenn es ums Verkaufen geht.'); }
  await Ln.say('Oh.'); await A.wait(700); await Dv.say('Sie hat recht. Das ist das Schlimme daran.');
  await A.wait(700); await J.say('Trideset godina sam mu bila komšinica. Ja sam mu i oči zatvorila.'); await A.m('Dreißig Jahre war sie seine Nachbarin. Sie hat ihm die Augen zugedrückt.');
  await A.wait(800); await Ln.say('Kannst du sie was fragen? Wo Opa immer war. Wenn man ihn besucht hat.'); await A.wait(400); await A.m('Lena fragt, wo ihr Großvater immer war.');
  await J.anim('point'); await J.say('Mate je uvik stajo na kapiji kad bi autobus doša. Eno tu, kod stupa.'); await A.wait(500); await J.say('Ključ je uvik dobijo najmlađi.');
  await A.m('Sie sagt: Mate stand immer am Tor, wenn ein Bus kam. Da, am Pfosten. Den Schlüssel bekam der Kleinste.'); A.note('b3_gate');
  await A.wait(900); await Ln.say('Den hab ich nie gekriegt.'); await A.wait(700); await Ln.say('Ich war ja nie da.'); A.note('b3_lenakey');
  await A.wait(1000); await J.say('A smokve, vidiš li ih? Neumotane.'); await J.say('Lani sam ih ja umotala. Ove godine neću. Neka on.'); await J.say('U nedilju noću udara mraz. Smokve to ne podnose.');
  await A.m('Die Feigen sind nicht eingepackt. Letzten Winter hat sie das gemacht. Dieses Jahr nicht. Er soll es tun. Sonntagnacht kommt Frost, und den halten Feigen nicht aus.'); A.note('b3_figs');
  await A.wait(600); await J.say('Ovu veliku je posadio devedeset sedme. Kad se mala rodila.'); await A.m('Den großen hat Mate siebenundneunzig gepflanzt. Als die Kleine geboren wurde.'); await Ln.say('Ich? Für mich?'); A.setFlag('k3.b.tree97');
  await A.wait(800); await Dv.say('Teta Jela. U ponedjeljak idem kod notara. Kuća … prodaje se.'); await A.wait(900); await J.say('Znam.'); await A.wait(600); await J.say('Sve ja znam. Ti ništa ne znaš.');
  await A.m('Er geht am Montag zum Notar. Das Haus wird verkauft. Und sie sagt: Ich weiß. Ich weiß alles. Du weißt nichts.'); A.note('b3_sell');
  await Ln.say('Papa?'); await Dv.say('Montag. Das war so ausgemacht.');
  A.setFlag('k3.b.jela');
  await A.wait(700); await J.say('Jeste li jeli? Imam pitu.'); await A.m('Ob wir gegessen haben. Sie hat Pita.'); await Ln.say('Was ist Pita?'); await Dv.say('Komm. Erst bringen wir den Koffer rein.');
  await Dv.say('Herr Marko. Morgen, wenn Sie wollen. Heute … heute will ich mit dem Haus allein sein.');
  var hd=M.stand('zelenika','house_door')||[312,116,'B']; var w1=Dv.walk(hd[0],hd[1]-2), w2=Ln.walk(hd[0]-10,hd[1]); await w1; await w2;
  if (Dv.actor) Dv.actor.fadeOut=A.gt; if (Ln.actor) Ln.actor.fadeOut=A.gt; A.sfx('door'); await A.wait(950); Dv.hide(); Ln.hide();
  if (G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Er ist nicht hier. Mate. Nicht heute.'); await A.m('Er sitzt im Café. Er wartet auf den nächsten Bus.'); await A.g('Und sein Sohn trägt einen Koffer in sein Haus.'); }
  A.music('k3_mate'); await M.k3DayCheck(A); }
// ---------------------------------------------------------------- Jela
async function talkJela(A){ var J=A.npc('jela'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Sie waren lange seine Nachbarin?',once:'je1',go:async function(A){ await J.say('Trideset godina. Ja sam mu kuhala kad je bio bolestan, on mi je popravljao krov.'); await A.m('Dreißig Jahre. Sie hat für ihn gekocht, wenn er krank war. Er hat ihr das Dach geflickt.'); await J.say('Krov još uvik curi.'); await A.m('Das Dach tropft immer noch.'); }},
    {t:'Wann ist er gestorben?',once:'je2',go:async function(A){ await J.say('U ožujku. Lani.'); await A.wait(600); await J.say('Hladno je bilo za ožujak.'); await A.m('Im März. Letztes Jahr. Es war kalt für März.'); A.setFlag('k3.b.when'); }},
    {t:'Helfen Sie ihm mit den Feigen?',if:sun(G)&&!A.flag('k3.b.invite'),go:async function(A){ await J.say('Neću.'); await A.wait(500); await J.say('Neka on. Ako ga je briga.'); await A.m('Nein. Er soll. Wenn es ihn kümmert.'); }},
    {t:'Zeigen Sie ihm, wie man die Feigen einpackt?',if:sun(G)&&A.flag('k3.b.invite')&&!A.flag('k3.b.figs'),go:async function(A){ await figs(A); return 'bye'; }},
    {t:'Haben Sie Mate noch gesehen? Am Ende?',once:'je3',if:A.flag('k3.b.jela'),go:async function(A){ await J.say('Do zadnjeg dana je stajo na kapiji. S termosicom. Govorio je: danas će.'); await A.m('Bis zum letzten Tag stand er am Tor. Mit der Thermoskanne. Er hat gesagt: Heute kommt er.'); }},
    A.askOpt({
      b3_invite:async function(A){ await J.say('Pozivnica?'); await A.wait(700); await J.say('Mate nikad nije znao reć: dođi. Znao je reć: smokve su rodile.'); await A.m('Mate konnte nie „komm“ sagen. Er konnte sagen: Die Feigen haben getragen.'); },
      b3_letters:async function(A){ await J.say('Svake godine je pisao. Ja sam mu nosila na poštu.'); await A.m('Jedes Jahr hat er geschrieben. Sie hat die Briefe zur Post gebracht.'); },
      b3_kidsroom:async function(A){ await J.say('Sobu je napravio za malu. Krevet je sam bojao. Dvaput.'); await A.m('Das Zimmer hat er für die Kleine gemacht. Das Bett hat er selbst gestrichen. Zweimal.'); },
      b3_sell:async function(A){ await J.say('Neka proda. Kuća nije smokva.'); await A.m('Soll er verkaufen. Ein Haus ist kein Feigenbaum.'); },
      b3_figs:async function(A){ await J.say('Mraz je u nedilju. Ne pričaj, nego umotaj.'); await A.m('Der Frost kommt Sonntag. Nicht reden, einpacken.'); },
      b3_dida:async function(A){ await J.say('Dida.'); await A.wait(600); await J.say('Tako ga je mali zvao. Davor. Dok je bio ovoliki.'); await A.m('So hat ihn der Kleine genannt. Davor. Als er so klein war.'); },
      photo_full:async function(A){ await J.say('Lipo dite.'); await A.m('Ein hübsches Kind.'); },
      km:async function(A){ await J.say('Neću ja tvoje pare. Jesi li jeo?'); await A.m('Mein Geld will sie nicht. Ob ich gegessen habe.'); } },
      async function(A){ await J.say(A.cycle('jeNo',['Šta ti znaš.','Pitaj njega. Ja sam samo komšinica.'])); await A.m(A.cycle('jeNoT',['Was weißt du schon.','Frag ihn. Sie ist nur die Nachbarin.'])); }),
    {t:'Hvala, teta Jela.',bye:true,go:async function(A){ await J.say(A.cycle('jeBye',['Ajde. I jedi nešto.','Ajde, ajde.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Die Feigen (Jela zeigt, Davor packt ein, Lena hilft, Marko übersetzt)
async function figs(A){ var G=A.G, J=A.npc('jela'), Dv=A.npc('davor'), Ln=A.npc('lena'), Mt=A.npc('mate'); if (A.flag('k3.b.figs')) return;
  await A.wait(500); await J.say('E.'); await A.wait(700); await J.say('Sad si se sitio.'); await A.m('Sie sagt: Jetzt ist es dir eingefallen.');
  var fs=M.stand('zelenika','figs')||[196,122,'B']; await J.walk(fs[0]-22,fs[1]); await J.face('R');
  await J.say('Donesi jutu. I špagu. Eno je u kući, di je uvik bila.'); await A.m('Jute und Schnur. Im Haus, wo sie immer war.'); await Dv.say('Ich weiß, wo sie ist.');
  await A.narrate('Davor geht ins Haus und kommt mit einer Rolle Jute und einem Knäuel Schnur zurück. Er hat nicht suchen müssen.'); await A.wait(500);
  if (Dv.actor) await Dv.walk(fs[0]+14,fs[1]); await J.anim('wrap'); await J.say('Gledaj. Odozdo prema gori. Ko zavoj na nogi.');
  await Ln.say('Was sagt sie?');
  var c=await A.choose([{t:'„Von unten nach oben. Wie einen Verband am Bein.“',id:'lit'},{t:'„Sie sagt, er macht das schon.“',id:'soft'}],{title:'Lena'});
  if (c==='soft'){ await Ln.say('Das hat sie nicht gesagt. Das war viel länger.'); await A.m('Von unten nach oben. Wie einen Verband am Bein.'); }
  await A.narrate('Davor wickelt. Die Jute rutscht, er fängt sie wieder ein. Jela sieht zu, mit verschränkten Armen.');
  await J.say('Ne tako! I nemoj stezat, nije ti to kravata.'); await A.m('Nicht so fest. Das ist keine Krawatte.'); await Ln.say('Haha. Papa.');
  await A.narrate('Lena hält die Schnur, Davor wickelt, Jela zeigt mit dem Finger, wo es noch kalt hereinkommt. Der große Baum zuerst, dann der kleine.'); A.sfx('tarp'); await A.wait(700);
  await J.say('Tako.'); await A.wait(800); await J.say('Tako je Mate radio.'); await A.m('So. So hat Mate es gemacht.');
  await A.wait(900); await Dv.say('So hat er es mir gezeigt. Da war ich sechs.'); await A.wait(500); await Dv.say('Ich hatte es vergessen. Meine Hände nicht.');
  A.setFlag('k3.b.figs'); A.rebuild(); var jp=M.apos('zelenika','jela',[60,117,'R']); J.walk(jp[0],jp[1]);
  if (mateHere(G) && A.isFound('mate')){ await A.wait(800);
    if (A.flag('k3.b.son')) await Mt.say('Mein Sohn packt die Feigen ein. Wie ich.');
    else await Mt.say('Der graue Mann packt meine Feigen ein. So, wie ich es mache. Wer hat ihm das gezeigt?'); }
  if (A.flag('k3.b.dead')) await release(A); }
// ---------------------------------------------------------------- Lenas Satz (Anrede aus Mates eigener Schrift, nicht aus dem Wörterbuch)
async function lenaSentence(A){ var G=A.G, Ln=A.npc('lena'), Mt=A.npc('mate');
  if (A.first('lnSent0')){ await Ln.say('Ich will ihm was sagen. In seiner Sprache. Ich weiß, er hört es nicht. Ist mir egal.'); await A.wait(500);
    await Ln.say('Was sagt man, wenn einer immer gefragt hat, wann man kommt?'); await A.m('Man sagt: Wir sind gekommen. „Došli smo.“'); await Ln.say('Došli smo.'); await A.wait(400); await Ln.say('Und wie sag ich zu ihm? Opa?'); }
  var o=[{t:'„Djede, došli smo.“ So steht es im Wörterbuch.',id:'djede'},{t:'Sag es auf Deutsch: „Opa, wir sind da.“',id:'de'}];
  if (A.hasNote('b3_dida')) o.push({t:'„Došli smo, dida.“',id:'dida'});
  o.push({t:'Ich weiß es noch nicht.',id:'no'});
  var c=await A.choose(o,{title:'Lenas Satz'});
  if (c==='no'){ await Ln.say('Okay. Sag Bescheid. Ich bleib am Tor.'); return; }
  if (c==='djede'){ await A.wait(300); await Ln.say('Djede, došli smo.'); await A.wait(1100); if (mateHere(G)){ await Mt.say('Djede …'); await A.wait(800); await Mt.say('So sagt man in der Schule.'); await A.wait(500); await Mt.say('Ein höfliches Mädchen. Wessen Kind ist das?'); }
    await Ln.say('Und? War das richtig?'); await A.m('Es war richtig. Aber es war nicht seins.'); if (!A.hasNote('b3_dida')){ await A.wait(400); await A.m('Er wollte anders heißen. Ich weiß nur noch nicht, wie.'); } return; }
  if (c==='de'){ await A.wait(300); await Ln.say('Opa, wir sind da.'); await A.wait(1100); if (mateHere(G)){ await Mt.say('Schön.'); await A.wait(700); await Mt.say('Aber das ist nicht für mich.'); }
    await Ln.say('Das war jetzt doof, oder?'); await A.m('Nein. Es war nur nicht in seiner Sprache.'); return; }
  // „Došli smo, dida.“ – die erste Erkenntnis: der Sohn
  A.music('k3_duh'); await A.wait(400); await Ln.say('Došli smo, dida.'); await A.wait(1500);
  if (!mateHere(G)) return;
  Mt.agitate(3200); await Mt.say('Dida …'); await A.wait(1000); await Mt.say('So hat Davor mich genannt. Als er klein war.'); await A.wait(1000);
  await A.narrate('Mate dreht sich um. Er sieht den grauen Mann im Hof an, an dem er gestern vorbeigesehen hat. Lange.');
  await A.wait(900); await Mt.say('Das ist Davor.'); A.setFlag('k3.b.son'); await A.wait(900);
  await Mt.say('Er ist alt geworden. Wann ist er so alt geworden?');
  if (A.flag('k3.b.figs')){ await A.wait(500); await Mt.say('Und er hat meine Feigen eingepackt.'); }
  await A.wait(700); await Ln.say('Und?'); await A.m('Er hat es gehört.'); await Ln.say('Echt?'); await A.wait(600); await A.m('Echt.');
  if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Er hat seinen Sohn gesehen. Sich selbst noch nicht.'); }
  A.music('k3_mate'); }
// ---------------------------------------------------------------- Der Schlüssel am Tor – die zweite Erkenntnis: der eigene Tod
async function keyGate(A){ var G=A.G, Ln=A.npc('lena'), Mt=A.npc('mate'); if (A.flag('k3.b.dead')) return;
  await Ln.say('Wie Jela gesagt hat? Den Schlüssel kriegt der Kleinste?'); await A.m('Ja. Stell dich ans Tor.'); await Ln.say('Voll komisch.'); await A.wait(400); await Ln.say('Okay.');
  var g=M.stand('zelenika','gate')||[124,120,'R']; await Ln.walk(g[0]-6,g[1]+1); await Ln.face('R');
  var mp=M.apos('zelenika','mate',[150,115,'R']); await A.walkM(mp[0]+30,mp[1]+7); await A.faceM('L'); await Ln.anim('hand',null,true);
  await A.narrate('Lena steht am Tor und hält die Hand auf, die Handfläche nach oben, so wie man es kleinen Kindern zeigt.'); await A.wait(1100);
  if (!mateHere(G)){ await Ln.say('Und jetzt?'); Ln.freeze(null); return; }
  A.music('k3_duh'); Mt.agitate(2600); await Mt.say('Die Kleinste.'); await A.wait(700);
  if (Mt.actor){ Mt.idle(null); await Mt.walk(Math.round(Ln.x)+16,Math.round(Ln.y)-1); await Mt.face('L'); }
  await Mt.anim('key',null,true); await A.wait(500);
  await A.narrate('Mate holt den Schlüssel aus der Jackentasche und legt ihn ihr in die Hand. Seine Hand geht durch ihre hindurch. Der Schlüssel bleibt in seiner.'); A.sfx('shimmer');
  await A.wait(1300); await A.narrate('Lena sieht nicht ihn an. Sie sieht auf den Platz am Pfosten, an dem er immer stand.'); await Ln.say('Hier hat er immer gestanden, oder?');
  await A.wait(1400); Mt.agitate(3800); await A.narrate('Mate sieht auf seine Hand.'); await A.wait(800);
  await A.realize('mate');
  await A.wait(700); await Mt.say('Ich bin nicht mehr da.'); await A.wait(1400); await Mt.say('Seit wann?'); await A.wait(900); await A.m('Seit dem Frühjahr. Letztes Jahr.'); A.setFlag('k3.b.dead');
  await A.wait(1100); await Mt.say('Im März.'); await A.wait(600); await Mt.say('Es war noch kalt für März.'); await A.wait(800); await Mt.say('Und ich habe am Tor gestanden und auf einen jungen Mann gewartet.');
  Ln.freeze(null); Mt.freeze(null); await A.wait(600); await Ln.say('Hab ich was falsch gemacht?'); await A.m('Nein. Du hast genau das Richtige gemacht.');
  if (A.flag('k3.b.figs')) await release(A);
  else { await A.wait(800); await Mt.say('Die Feigen.'); await A.wait(500); await Mt.say('Heute Nacht kommt Frost. Und keiner hat sie eingepackt.'); }
  A.music('k3_mate'); }
// ---------------------------------------------------------------- Mate lässt los: der Schlüssel liegt stofflich in der Astgabel
async function release(A){ var Mt=A.npc('mate'); if (A.flag('k3.b.keyFree')) return; A.music('k3_duh');
  await A.wait(1000); await A.narrate('Mate sieht seinem Sohn zu, wie er die letzte Schnur verknotet. Dann sieht er auf den Schlüssel in seiner Hand.');
  await Mt.say('Er hat sie eingepackt.'); await A.wait(900); await Mt.say('Dann muss ich nicht mehr warten.');
  var fk=M.stand('zelenika','fork')||[206,118,'B']; if (Mt.actor){ Mt.idle(null); await Mt.walk(fk[0]-12,fk[1]); await Mt.face('R'); }
  await Mt.anim('key'); await A.narrate('Er legt den Schlüssel in die Astgabel des großen Feigenbaums, so behutsam, als könnte er herunterfallen.'); A.sfx('keyDrop'); A.setFlag('k3.b.keyFree'); A.rebuild(); A.sfx('shimmer');
  await A.wait(1300); await A.narrate('Der Schlüssel bleibt liegen. Er ist kein Licht mehr. Er ist aus Eisen, ein Ding, das man aufheben kann.');
  if (A.G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Die Leine ist los.'); await Mt.say('Ich merke es. Ich bin ganz leicht.'); }
  await A.wait(500); await A.m('Den Schlüssel bekam der Kleinste, hat Jela gesagt.'); Mt.idle('wait'); A.music('k3_mate'); }
// ---------------------------------------------------------------- Der Schlüssel für Lena, dann die Schwelle
async function takeKey(A){ if (A.has('kljuc_mate')) return A.m('Ich habe ihn.'); if (A.flag('k3.b.keyLena')) return A.m('Lena hat ihn.'); if (!A.flag('k3.b.keyFree')) return A.m('Eine Astgabel. Leer.');
  await A.reach(); A.give('kljuc_mate'); A.setFlag('k3.b.keyTaken'); A.rebuild(); await A.m('Der Schlüssel. Schwer, alt, mit einem Ring. Er ist warm, obwohl er in der Kälte lag.'); }
async function keyToLena(A){ var Ln=A.npc('lena'), Mt=A.npc('mate'); if (!A.has('kljuc_mate')) return;
  await A.animM('give'); A.take('kljuc_mate'); A.setFlag('k3.b.keyLena'); A.sfx('keyDrop');
  await A.m('Der ist für dich. Er hat ihn für den Kleinsten aufgehoben.'); await A.wait(700); await Ln.say('Für mich?'); await A.wait(900); await Ln.say('Der ist ja warm.'); await A.wait(700); await Ln.say('Den hab ich nie gekriegt.'); await A.m('Jetzt schon.');
  if (mateHere(A.G)){ await A.wait(1000); await Mt.say('Gut.'); await A.wait(700); await Mt.say('So ist es richtig. Den Schlüssel bekommt der Kleinste.'); }
  if (A.G.malaOn && A.malaHere()){ await A.wait(800); await A.switchTo('mala'); await A.wait(500); await A.g('Mate. Ich kann Sie hinüberbringen. Es ist nicht weit.'); await Mt.say('Fährt jetzt einer?'); await A.g('Ja. Jetzt fährt einer.'); } }
async function crossMate(A){ var Mt=A.npc('mate'); A.G.flags['mala.lock']=true; A.music('k3_duh'); var p=Mt.actor?[Math.round(Mt.x),Math.round(Mt.y)]:M.apos('zelenika','mate',[150,115,'R']);
  await A.g('Kommen Sie.'); await Mt.say('Kommt der Übersetzer mit? Ohne ihn verstehe ich die Durchsagen nicht.'); await A.g('Wenn er will.');
  await A.crossOpen(p[0]+22,p[1]+3,{w:18,h:74}); await A.g('Marko. Nimm meine Hand.');
  var c=await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true},{t:'„Wieder bis an den Rand?“',id:'edge'}],{title:'',conv:false});
  if (c==='edge') await A.g('Bis an den Rand.'); A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'mate'); }
// zurück aus der Zwischenwelt: Davors offene Entscheidung, Lenas Steckling, Davors Karte
M.afterLimbo_mate=async function(A){ A.G.flags['mala.lock']=false; var st=M.stand('zelenika','figs')||[196,122,'B'];
  await A.goto('zelenika',{x:st[0],y:st[1]+2,f:'L',fade:false,noEnter:true}); await A.fade(0,900); A.music('k3_mate');
  var Dv=A.npc('davor'), Ln=A.npc('lena'), J=A.npc('jela');
  await A.wait(800); await A.narrate('Der Hof. Die Feigen in Jute, verschnürt wie zwei Pakete. Am Pfosten steht niemand mehr.');
  await A.wait(700); await Ln.say('Papa. Was machen wir jetzt mit dem Haus?');
  await A.wait(1100); await Dv.say('Ich kann hier nicht leben.'); await A.wait(900); await Dv.say('Aber ich kann kommen.');
  await A.wait(800); await J.say('U avgustu su smokve zrile.'); await A.m('Sie sagt: Im August sind die Feigen reif.'); await A.wait(500); await Dv.say('Dann im August.');
  await A.wait(900); await A.narrate('Lena zieht eine Gartenschere aus Jelas Schürzentasche, ohne zu fragen, und schneidet einen Zweig vom großen Feigenbaum. Jela lässt sie.');
  await Ln.say('Für den Balkon. In München. Geht das?'); await J.say('Ako ga ne utopiš.'); await A.m('Sie sagt: Wenn du ihn nicht ertränkst.'); await Ln.say('Ich geb mir Mühe.');
  await A.wait(800); await Dv.say('Herr Vuković.'); await A.narrate('Davor gibt mir eine Visitenkarte, an den Ecken weich vom Portemonnaie.'); A.give('vizitka'); await Dv.say('Falls Sie mal in München sind.');
  A.setFlag('k3.b.done');
  if (A.G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Er hat seinen Bus gekriegt.'); await A.m('Den richtigen?'); await A.g('Den, der immer pünktlich ist.'); }
  await M.k3DayCheck(A); };
// ---------------------------------------------------------------- Mate am Pfosten (Sonntag)
async function talkMate(A){ var Mt=A.npc('mate'), G=A.G;
  if (!A.isFound('mate')) return A.m('Am Pfosten ist es kälter als anderswo.');
  if (A.flag('k3.b.keyFree')) return Mt.say(A.cycle('mzF',['Ich bin ganz leicht. Ist das so, wenn man fährt?','Sagen Sie dem Mädchen, sie soll den Schlüssel nicht verlieren. Einen zweiten gibt es nicht.']));
  if (A.flag('k3.b.dead')) return Mt.say(A.cycle('mzD',['Ich bin nicht mehr da. Und trotzdem stehe ich hier.','Die Feigen. Heute Nacht kommt Frost.']));
  await A.menuLoop(function(){ var son=A.flag('k3.b.son'); return [
    {t:'Auf wen warten Sie?',once:'mz1',if:!son,go:async function(A){ await Mt.say('Auf Davor. Gestern kam er nicht. Der Bus hatte Verspätung, und er war nicht drin.'); await A.wait(500); await Mt.say('Heute bestimmt.'); }},
    {t:'Ihr Sohn ist im Haus.',once:'mz2',if:!son,go:async function(A){ Mt.agitate(1800); await Mt.say('Im Haus?'); await A.wait(600); await Mt.say('Im Haus ist ein grauer Mann aus München. Der will das Haus sehen. Jela hat ihm aufgemacht. Jela macht jedem auf.'); }},
    {t:'Die Feigen sind nicht eingepackt.',once:'mz3',if:!A.flag('k3.b.figs'),go:async function(A){ await Mt.say('Das macht Davor. Er hat es als Kind so gern gemacht. Die Jute, die Schnur.'); await A.wait(500); await Mt.say('Ich lasse sie ihm.'); }},
    {t:'Er ist da. Davor.',once:'mz4',if:son,go:async function(A){ await Mt.say('Davor ist da.'); await A.wait(700); await Mt.say('Und ich stehe am Tor und warte. Wie ein Dummkopf. Auf einen, der schon da ist.'); }},
    {t:'Herr Zelenika. Sie sind …',go:async function(A){ await Mt.say(A.cycle('mzDead',['Was? Der Hund bellt so laut.','Was? Da kommt ein Bus. Nein. Der fährt vorbei.'])); }},
    A.askOpt({
      b3_invite:async function(A){ Mt.agitate(1600); await Mt.say('Eine Einladung?'); await A.wait(600); await Mt.say('Ich habe nur gefragt, wann sie kommen. Mehr nicht. Man drängt keinen.'); },
      b3_letters:'Die Briefe. Hat er sie gelesen? Er hat nie geantwortet. Doch. Zweimal.',
      b3_cards:'Lenas Karten. Jedes Jahr eine. Mit einem Foto. Sie wird groß auf den Fotos, und ich nicht.',
      b3_pencil:'Das war für mich. Damit es richtig heißt.',
      b3_dida:async function(A){ await A.m('Dida.'); await A.wait(800); await Mt.say('Das sagen Sie. Ein Fremder darf das nicht sagen. Das darf nur einer.'); },
      b3_gate:'Am Tor, ja. Hier sieht man den Bus schon an der Kurve.',
      photo_full:'Ein Kind. Meine Enkelin ist auch so groß. Auf den Karten.',
      b3_notson:'Mein Sohn ist jung. Gestern war er nicht im Bus.' },
      'Ich weiß nicht. Ich warte.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function talkMateG(A){ var Mt=A.npc('mate');
  if (A.flag('k3.b.keyLena') && !A.flag('k3.b.limbo')) return Mt.say('Fährt jetzt einer, Mädchen?');
  if (A.flag('k3.b.dead')) return Mt.say('Du hast es gewusst, Mädchen. Die ganze Zeit.');
  await A.menuLoop(function(){ return [
    {t:'Er ist da, Mate. Ihr Sohn.',once:'mzg1',go:async function(A){ await Mt.say('Mädchen. Du redest wie Jela.'); await A.wait(500); await Mt.say('Jela sagt auch immer: Er ist da. Und dann ist er nicht da.'); }},
    {t:'Woran halten Sie sich fest?',once:'mzg2',go:async function(A){ await Mt.say('An meinem Schlüssel.'); await A.wait(600); await Mt.say('Den bekommt der Kleinste. Wenn er kommt.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
// ---------------------------------------------------------------- Lena und Davor im Hof
async function talkLena(A){ var Ln=A.npc('lena'), G=A.G;
  if (sat(G)) return Ln.say('Was ist Pita?');
  await A.menuLoop(function(){ return [
    {t:'Du wolltest deinem Großvater etwas sagen.',if:A.flag('k3.b.invite')&&!A.flag('k3.b.son'),go:async function(A){ await lenaSentence(A); if (A.flag('k3.b.son')) return 'bye'; }},
    {t:'Stell dich ans Tor. Halt die Hand auf.',if:A.flag('k3.b.son')&&!A.flag('k3.b.dead'),go:async function(A){ await keyGate(A); return 'bye'; }},
    {t:'Wie ist es hier für dich?',once:'ln1',go:async function(A){ await Ln.say('Voll komisch. Aber schön komisch.'); await A.wait(400); await Ln.say('Alle reden so laut. Und keiner ist sauer, obwohl es so klingt.'); }},
    {t:'Kanntest du deinen Opa?',once:'ln2',go:async function(A){ await Ln.say('Von Postkarten. Ich hab ihm jedes Jahr eine geschrieben. Mit Schulfoto. Papa hat gesagt, das freut ihn.'); await A.wait(600); await Ln.say('Er hat nie zurückgeschrieben. Also, an mich. An Papa schon.'); }},
    A.askOpt({
      b3_gate:'Den Schlüssel kriegt der Kleinste. Und ich war nie da. Voll unfair, oder?',
      b3_kidsroom:'Das Zimmer oben? Das ist für mich? Mit Ballons? Ich bin vierzehn.',
      b3_cards:'Meine Karten! Die hat er aufgehoben? Alle?',
      b3_dida:'Dida. Klingt wie ein Kosename. Ist das einer?',
      b3_invite:'Er hat sich nicht getraut, „kommt“ zu schreiben? Echt? Papa traut sich das auch nie.',
      photo_full:'Ist das deine Schwester? Nein? Wer dann?' },
      'Keine Ahnung. Frag Papa. Oder lieber nicht.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function talkDavor(A){ var Dv=A.npc('davor'), G=A.G;
  if (sat(G)) return Dv.say('Morgen, wenn Sie wollen.');
  await A.menuLoop(function(){ return [
    {t:'Wie war Ihr Vater?',once:'dv1',go:async function(A){ await Dv.say('Streng. Pünktlich. Er war immer zu früh, überall. Am Bahnhof, beim Zahnarzt, bei meiner Hochzeit.'); await A.wait(500); await Dv.say('Er hat mir das Schwimmen beigebracht. In Skela, an der Fähre. Ich bin gesprungen und habe gefroren, und er hat gelacht.'); }},
    {t:'Und das Haus?',once:'dv2',if:!A.flag('k3.b.done'),go:async function(A){ await Dv.say('Montag. Notar. Das war so ausgemacht.'); await A.wait(800); await Dv.say('Ich weiß nicht mehr, mit wem.'); }},
    {t:'Ihre Hände.',once:'dv3',if:A.flag('k3.b.figs'),go:async function(A){ await Dv.say('Sie riechen nach Jute. Wie früher.'); }},
    {t:'Im August?',once:'dv4',if:A.flag('k3.b.done'),go:async function(A){ await Dv.say('Im August. Wenn die Feigen reif sind. Jela will, dass wir sie essen, solange sie warm sind von der Sonne.'); }},
    A.askOpt({
      b3_dida:'Dida. So habe ich ihn genannt, als ich klein war. Später nicht mehr. Später habe ich Vater gesagt. Und dann gar nichts mehr.',
      b3_letters:'Die Briefe liegen drinnen. Ich habe sie alle gelesen. Jetzt anders.',
      b3_sell:'Montag. Vielleicht. Vielleicht ruft der Notar umsonst an.',
      b3_figs:'Eingepackt. Wenn es heute Nacht friert, haben sie wenigstens eine Jacke.',
      kljuc_mate:'Der Schlüssel? Nein. Den bekommt der Kleinste. Das war hier immer so.' },
      'Ich weiß es nicht. Ich weiß hier gar nichts mehr.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},look:'Die Gasse zurück, zur Straße.',g:{look:'Die Straße hinunter. Da kommen die Busse her.'}},
 {id:'gate',name:'Gartentor',look:'Ein grünes Eisentor, ein Flügel in den Hof gedreht. Der Lack ist abgeblättert, wo Hände es tausendmal aufgemacht haben.',
   open:'Es ist offen. Es ist immer offen, sagt Jela.',use:'Ich stehe am Tor. Von hier sieht man die Straße bis zur Kurve.',
   g:{look:'Ein Tor, an dem einer gewartet hat. Das sieht man an Toren.'}},
 {id:'post',name:'Pfosten',look:function(A){ var G=A.G; if (mateHere(G) && A.isFound('mate') && !A.flag('k3.b.dead')) return A.m('Der gemauerte Pfosten neben dem Tor. Mate steht daran, die Hände auf dem Rücken, wie einer, der dort hingehört.'); return A.m('Der gemauerte Pfosten neben dem Tor. In Schulterhöhe ist der Putz abgeschabt, als hätte sich jemand jahrelang daran gelehnt.'); },
   use:'Ich lehne mich nicht daran. Das ist sein Platz.',
   g:{look:'Hier hat er gestanden. Jeden Abend, wenn der Bus vorbeikam. Der Stein ist ganz glatt davon.',sense:'Warten. Und eine Thermoskanne, die immer warm war.'}},
 {id:'figs',name:'Feigenbäume',look:function(A){ return A.m(A.flag('k3.b.figs')?'Die beiden Feigenbäume, in Jute gewickelt und mit Schnur verschnürt. Sie sehen aus wie zwei Pakete, die auf die Post warten.':'Zwei Feigenbäume, kahl, mit glatter grauer Rinde und dicken Ästen. Der große hat eine Astgabel wie eine Hand. Uneingepackt. Heute Nacht soll es frieren.'); },
   use:async function(A){ if (A.flag('k3.b.figs')) return A.m('Eingepackt. Gut eingepackt.'); await A.m(A.cycle('zfUse',['Ich weiß nicht, wie man Feigen einpackt. Jela weiß es.','Wenn ich es mache, erfrieren sie in der Jute. Jela weiß, wie es geht.'])); },
   take:'Im November gibt es keine Feigen. Nur Bäume, die frieren.',
   g:{look:function(A){ return A.g(A.flag('k3.b.figs')?'Jetzt frieren sie nicht.':'Der große ist für das Mädchen gepflanzt. Er weiß es nicht. Sie auch nicht.'); },sense:'Ein Mann, der im Frühjahr ein Loch gräbt und dabei singt. Schlecht. Und ein Datum: siebenundneunzig.'}},
 {id:'fork',name:'Astgabel',vis:function(S,G){ return F(G,'k3.b.keyFree') && !F(G,'k3.b.keyTaken'); },look:'In der Astgabel des großen Feigenbaums liegt ein Schlüssel. Schwer, alt, mit einem Ring.',
   take:function(A){ return takeKey(A); },use:function(A){ return takeKey(A); },
   g:{look:'Er hat ihn losgelassen. Jetzt kann ihn jemand nehmen.'}},
 {id:'house_door',name:'Haustür',exit:{to:'zelenika_in'},look:'Die Haustür, zwei Stufen, ein Fußabtreter mit einem verblassten Muster. Daneben der Weinstock am Draht.',
   canExit:async function(A){ var G=A.G; if (sat(G)){ await A.m(F(G,'k3.b.jela')?'Davor hat die Tür zugemacht. Heute will er mit dem Haus allein sein.':'Erst Jela. Sie hat den Schlüssel.'); return false; } return true; },
   g:{look:'Drinnen ist es still. Und oben ist ein Zimmer, das wartet.'}},
 {id:'jela_door',name:'Jelas Haus',look:'Jelas kleines Haus: verputzt, ein Ziegeldach, am Küchenfenster eine Gardine und eine Topfpflanze. Es riecht nach Pita, bis auf die Gasse.',
   open:'Ich klopfe nicht bei Jela. Sie kommt sowieso heraus, wenn sie will.',
   g:{look:'Sie hat ihn jeden Tag gesehen. Dreißig Jahre.',listen:'Drinnen läuft ein Radio. Volksmusik, leise. Und eine Uhr, die zu schnell geht.'}},
 {id:'bench',name:'Bank',look:'Eine Holzbank an der Hauswand, verwittert. Auf der Lehne hat jemand mit einem Messer ein D geschnitzt.',use:'Ich setze mich kurz. Von hier sieht man das Tor und den Pfosten.',
   g:{look:'Das D hat ein Junge geschnitzt. Er hat Ärger bekommen. Dann hat sein Vater es so gelassen.'}},
 {id:'vine',name:'Weinstock',look:'Ein Weinstock am Draht, ohne Blätter, mit ein paar vertrockneten Trauben, die keiner geerntet hat.',take:'Die Trauben sind Rosinen geworden. Die Vögel wollen sie auch nicht.',
   g:{look:'Den hat er auch gepflanzt. Den hat er öfter gegossen als sich selbst.'}},
 {id:'jela',npc:'jela',name:'Jela',hgt:40,vis:function(S,G){ return jelaHere(G); },talk:talkJela,
   look:'Eine sehr alte Frau mit braunem Kopftuch, schwarzem Rock und Schürze, gedrungen, die Hände rot von der Kälte. Sie sieht aus, als hätte sie heute schon alle gefüttert, die es nicht wollten.',
   give:{ photo_full:'Jela: „Lipo dite.“ Ein hübsches Kind.', km:'Jela: „Neću ja tvoje pare. Jesi li jeo?“', kljuc_mate:'Jela: „Ne meni. Maloj.“ Nicht mir. Der Kleinen.', vizitka:'Jela: „München. Neka. Samo neka dođu.“ Soll sein. Hauptsache, sie kommen.' },
   g:{look:'Sie ist wütend, weil sie traurig ist. Bei alten Frauen ist das dasselbe.',listen:function(A){ return A.g(sat(A.G)?'Sie redet mit ihm. Leise. „Vidiš, Mate, došao je.“ Sieh mal, Mate, er ist gekommen.':'Sie zählt die Juteschnüre in ihrer Schürze. Sie hat sie seit Tagen bereit.'); }}},
 {id:'davor',npc:'davor',name:'Davor',hgt:46,vis:function(S,G){ return davorHere(G); },talk:talkDavor,
   look:function(A){ return A.m(A.flag('k3.b.figs')?'Davor, Jutefasern am Mantel. Er sieht auf die eingepackten Bäume, als hätte er etwas zusammengesetzt, das lange zerbrochen war.':'Davor im beigen Trenchcoat, die Brille in der Hand. Er sieht auf das Haus wie auf einen Brief, den er nicht aufmachen will.'); },
   give:{ kljuc_mate:'Davor: „Nein. Den bekommt der Kleinste. Das war hier immer so.“', photo_full:'Davor: „Wer ist das? Und der Kleine mit den Ohren, das sind Sie?“' },
   g:{look:'Er hat die Haare von damals verloren. Das Lachen auch.',listen:'Er rechnet. Wie viel das Haus wert ist. Und was es kostet, wenn man es behält.'}},
 {id:'lena',npc:'lena',name:'Lena',hgt:44,vis:function(S,G){ return lenaHere(G); },talk:talkLena,
   look:'Lena im pinken Anorak, die Kopfhörer um den Hals. Sie hält das Handy, ohne draufzusehen.',
   give:{ kljuc_mate:function(A){ return keyToLena(A); }, photo_full:'Lena: „Ist das deine Schwester? Nein? Wer dann?“' },
   g:{look:'Sie hat die Augen von ihm. Von Mate.',listen:'Sie übt ein Wort. Leise. Sie spricht es falsch aus und versucht es noch einmal.'}},
 {id:'mate',npc:'mate',name:'Mate',hgt:46,vis:function(S,G){ return mateHere(G); },talk:talkMate,
   look:function(A){ if (!A.isFound('mate')) return A.m('Am Pfosten ist es kälter als anderswo.'); if (A.flag('k3.b.keyFree')) return A.m('Mate, ohne Schlüssel, die Hände leer. Er steht nicht mehr, als würde er warten.'); return A.m('Mate am Pfosten, den Hut auf, die Thermoskanne unter dem Arm. Er sieht die Straße hinunter, bis zur Kurve. Er sieht durch seinen Sohn hindurch.'); },
   give:{ kljuc_mate:'Mate: „Nicht mir. Ich habe ihn losgelassen. Der Kleinsten.“', photo_full:'Mate: „Ein Kind. Meine Enkelin ist auch so groß. Auf den Karten.“' },
   g:{look:function(A){ if (A.flag('k3.b.keyFree')) return A.g('Keine Leine mehr. Er ist frei. Er weiß es noch nicht ganz.'); return A.g('Seine Leine geht zur Haustür, zum Schloss. Und in der Faust hält er den Schlüssel dazu.'); },
     talk:function(A){ return talkMateG(A); },
     cross:function(A){ return crossMate(A); },crossIf:function(S,G){ return F(G,'k3.b.keyLena') && !F(G,'k3.b.limbo'); }}}
];
M.room('zelenika',{ name:'Haus Zelenika', scape:'k3_zelenika',
  music:function(G){ return 'k3_mate'; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[];
    if (jelaHere(G)){ var j=M.apos('zelenika','jela',[60,117,'R']); L.push({id:'jela',ch:'jela',x:j[0],y:j[1],f:j[2]||'R',name:'Jela',idle:sun(G)&&!F(G,'k3.b.figs')?'wrap':null,speechY:40,
      routine:sun(G)&&!F(G,'k3.b.figs')?[['idle','wrap',8,14],['idle',null,3,5],['anim','point'],['idle','wrap',6,10]]:false}); }
    if (davorHere(G)){ var d=M.apos('zelenika','davor',[232,121,'L']); L.push({id:'davor',ch:'davor',x:d[0],y:d[1],f:d[2]||'L',name:'Davor',speechY:46}); }
    if (lenaHere(G)){ var l=M.apos('zelenika','lena',[118,121,'R']); L.push({id:'lena',ch:'lena',x:l[0],y:l[1],f:l[2]||'R',name:'Lena',idle:'phone',speechY:44}); }
    if (mateHere(G)){ var m=M.apos('zelenika','mate',[150,115,'R']), free=F(G,'k3.b.keyFree'), fk=M.stand('zelenika','fork')||[206,118,'B'];
      L.push({id:'mate',ch:'mate',x:free?fk[0]-12:m[0],y:free?fk[1]:m[1],f:m[2]||'R',name:'Mate',ghost:true,reveal:true,idle:'wait',speechY:46,routine:false,
        anchor:function(S,G){ if (G.flags['k3.b.keyFree']) return null; return spotC('house_door'); }}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (from==='zelenika_in') return;
    if (sat(G) && F(G,'k3.b.arrived') && !F(G,'k3.b.jela')){ await satArrival(A); return; }
    if (sun(G) && A.first('zeD3')){ await A.narrate('Sonntag. Der Himmel ist hart und blau, und die Luft riecht schon nach Frost. Die Feigenbäume stehen nackt im Hof.');
      if (mateHere(G) && G.malaOn && A.malaHere()){ if (!A.isFound('mate')) A.found('mate'); await A.wait(500); await A.g('Marko. Am Pfosten.'); await A.wait(600);
        await A.narrate('Am Pfosten neben dem Tor steht Mate, die Hände auf dem Rücken, den Hut auf. Er sieht die Straße hinunter.'); await A.g('Heute wartet er hier. Am Tor.'); await A.npc('mate').say('Heute kommt er. Bestimmt.'); }
      return; } }
});
})(M);
