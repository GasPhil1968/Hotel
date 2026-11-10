/* ===== rooms/vulkanizer.js — Vulkanizer Rajić, Laden und Büro: Vlado leugnet, Kata will den TAM nach Graz verkaufen, die E-Mail,
   drei Schubladen, die Zeichnung und der Schlüssel 31, Teil 1 (Samstag) und Teil 2 (Sonntag) der Nacht, die Botschaft.
   Vorgaben: game/K3_SPEC.md, KAPITEL3_KONZEPT.md 7.2 („Zwei Fassungen“) ===== */
(function(M){
'use strict';
// „(Mala fragen.)“ ist eine Handlung, kein Satz: Marko spricht die Zeile nicht aus (das Gerüst setzt silent nicht)
function R2(G){ return !!(M.k3R2 && M.k3R2(G)); }
function askM(A,k){ var o=M.k3AskOpt(A,k); if (o) o.silent=true; return o; }
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
function day(G){ return ['k3_d1','k3_d2','k3_d3'].indexOf(G.phase)>=0; }
// weiß Marko, wer Vlado ist und wo er ihn findet? (Mate, Zdravko oder der Taxifahrer; Ljerka allein nennt nur den Vornamen)
M.k3KnowsVlado=function(G){ return F(G,'k3.v.known')||N(G,'v3_mate')||N(G,'v3_where'); };
// der Laden ist zu, bis Marko einmal woanders war (K3_SPEC §3: offen, wenn k3.moves > k3.v.closedAt + 1)
function closedNow(G){ return F(G,'k3.v.angry') && !F(G,'k3.v.drawer') && (G.flags['k3.moves']||0)<=(G.flags['k3.v.closedAt']||0)+1; }
M.k3VladoClosed=closedNow;
// beim Betreten wird k3.moves erst nach dem Aufbau des Raums hochgezählt (05_engine.js: loadRoom, dann onRoomChange); deshalb hier ein Wechsel weniger
var LOADING=false;
function closedOnLoad(G){ return F(G,'k3.v.angry') && !F(G,'k3.v.drawer') && (G.flags['k3.moves']||0)<=(G.flags['k3.v.closedAt']||0); }
function closedAny(G){ return LOADING?closedOnLoad(G):closedNow(G); }
function vladoHere(G){ if (!day(G) || closedAny(G)) return false;
  if (G.phase==='k3_d1' && F(G,'k3.v.drawer')) return false;                          // „Morgen.“ Er ist hinten.
  if (G.phase==='k3_d3' && F(G,'k3.v.part2') && !F(G,'k3.d3.talk2')) return false;     // nach Teil 2 ist er hinten
  return true; }
M.k3VladoHere=vladoHere;
function yardOpen(G){ return F(G,'k3.v.yard'); }
function hideBack(A,V){ return (async function(){ if (!V.actor) return; var yd=M.stand('vulkanizer','yard_door')||[216,116,'B']; V.idle(null); await V.walk(yd[0],yd[1]-3); V.actor.fadeOut=A.gt; await A.wait(950); V.hide(); })(); }
function malaNear(A){ if (!A.G.malaOn) return false; if (!A.malaHere()){ var mk=A.marko; if (!mk) return false; A.malaJoin({x:Math.round(mk.x)-20,y:Math.round(mk.y)-1,f:'R'}); } return true; }

// ---------------------------------------------------------------- Vlado
async function talkVlado(A){ var V=A.npc('vlado'), p=A.G.phase;
  if (!vladoHere(A.G)) return A.m('Vlado ist hinten.');
  if (p==='k3_d2') return vladoD2(A,V);
  if (p==='k3_d3') return vladoD3(A,V);
  return vladoD1(A,V); }
// Freitag: er leugnet
async function vladoD1(A,V){
  if (!M.k3KnowsVlado(A.G)){ await V.say('Reifen?'); await A.m('Nein. Ich sehe mich nur um.'); await V.say('Hier gibt es nichts zu sehen. Nur Reifen.'); return; }
  await A.menuLoop(function(){ return [
    {t:'Sie sind früher Mehl gefahren. Im Krieg.',once:'vl1',go:async function(A){ await V.say('Mehl.'); await A.wait(500); A.sfx('cough'); await V.anim('cough'); await V.say('Mehl, Öl, Decken. Für die Dörfer am Fluss.'); await A.wait(400); await V.say('Das ist lange her.'); }},
    // Skela nennt Marko erst, wenn die Peilung es ergeben hat (Prüfbericht K3)
    {t:A.hasNote('l3_skela')?'Im Januar vierundneunzig. Von Split nach Skela. Ein Mädchen, siebzehn.':'Im Januar vierundneunzig. Von Split hierher. Ein Mädchen, siebzehn.',if:!A.hasNote('v3_denial'),go:async function(A){ await A.wait(900); await A.narrate('Vlado hört auf zu hebeln. Das Rad dreht sich noch ein Stück weiter, ohne ihn.'); await A.wait(700);
        await V.say('Ich habe nie jemanden mitgenommen.'); await A.wait(800); await V.say('Nie.'); A.note('v3_denial'); A.setFlag('k3.v.met'); A.sfx('wrench');
        await A.wait(600); await A.npc('kata').say('Hören Sie? Nie. So redet er mit allen. Mit mir auch.');
        if (A.G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Seine Hände.'); await A.wait(500); await A.g('Ich kenne die Hände. Ich weiß nicht, woher.'); } }},
    {t:'Ihre Mutter sucht sie. Seit siebzehn Jahren.',if:A.hasNote('v3_denial')&&!A.flag('k3.v.angry'),go:async function(A){ await anger(A,V); return 'bye'; }},
    {t:'Wegen vorhin. Das war zu früh.',once:'vl2',if:A.flag('k3.v.angry'),go:async function(A){ await V.say('Reifen.'); await A.wait(700); await A.m('Wie bitte?'); await V.say('Ich rede über Reifen. Über anderes nicht.'); }},
    {t:'Warum fahren Sie nachts nicht mehr?',once:'vl3',if:A.hasNote('v3_mate'),go:async function(A){ await V.say('Wer sagt das?'); await A.wait(600); await V.say('Nachts sieht man nichts. Was soll man da fahren.'); await A.npc('kata').say('Seit dem Krieg nicht. Nicht einmal zur Apotheke. Die Nachtdienste mache ich.'); }},
    A.askOpt({
      k3_c_bridge:async function(A){ await A.m('Ein Fahrer, der geraucht hat und nichts gesagt hat. Ein Lastwagen mit Mehl und Decken.'); await V.say('Das sind alle Fahrer.'); await V.anim('cough'); await V.say('Fragen Sie am Busbahnhof.'); },
      v3_mate:async function(A){ await V.say('Mate?'); await A.wait(700); await V.say('Mate Zelenika ist tot. Letztes Frühjahr.'); await A.wait(500); await V.say('Der hat immer viel geredet. Über alle.'); },
      v3_ljerka:async function(A){ await V.say('Split.'); await A.wait(800); await V.say('Kenne ich nicht.'); await A.npc('kata').say('Papa, du warst doch nie in Split.'); await V.say('Eben.'); },
      v3_where:'Rajić. Steht draußen dran.',
      l3_skela:async function(A){ A.sfx('wrench'); await A.wait(500); await V.say('Skela.'); await A.wait(700); await V.say('Da ist eine Brücke. Seit achtundneunzig. Was wollen Sie da?'); },
      l3_key31:async function(A){ await V.say('Schlüssel?'); await A.wait(500); await V.say('Ich habe viele Schlüssel. Für Autos, die keiner abholt.'); },
      v3_cab:function(A){ return cabEarly(A,V); },
      v3_typenschein:'Typenschein. Das ist Katas Sache. Der Laster ist Katas Sache, sagt sie.' },
      ['Weiß ich nicht.','Ich bin Vulkaniseur. Fragen Sie mich nach Reifen.','…']),
    {t:'(Gehen.)',bye:true,silent:true,go:async function(A){ await V.say(A.cycle('vlBye1',['Reifen brauchen Sie keine. Das sehe ich.','…'])); }}
  ]; }); }
async function anger(A,V){ var K=A.npc('kata'); A.sfx('wrench'); await A.wait(500); await V.say('Raus.'); await A.wait(500); A.sfx('cough'); await V.anim('cough'); await V.say('Raus aus meinem Laden.');
  A.setFlag('k3.v.angry'); A.setFlag('k3.v.closedAt',A.G.flags['k3.moves']||0);
  await hideBack(A,V); A.sfx('click'); A.set('closed',true); A.rebuild();
  await A.narrate('Hinten schlägt eine Tür. Kata zieht an einer Kette, und der Rollladen an der Straßentür rasselt halb herunter.');
  await K.say('Gut gemacht.'); await A.wait(700); await K.say('Kommen Sie in einer Stunde wieder. Er beruhigt sich beim Flicken.');
  if (A.G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Er hat Angst. Nicht vor dir.'); } }
// Samstag: der Schlüssel, die Zeichnung, Teil 1
async function vladoD2(A,V){
  if (!A.flag('k3.v.part1') && A.first('vlD2')){ await V.say('Sie.'); await A.wait(700); await V.say('Ich habe gesagt: morgen.'); await A.m('Heute ist morgen.'); await A.wait(900); A.sfx('cough'); await V.say('Ja.'); }
  await A.menuLoop(function(){ return [
    {t:'Der Schlüssel auf Ihrem Tisch. Einunddreißig.',if:!A.flag('k3.v.part1'),go:async function(A){ await part1(A,V); return 'bye'; }},
    {t:'Die Zeichnung.',if:!A.flag('k3.v.part1'),go:async function(A){ await drawingSilence(A,V); }},
    {t:'Warum haben Sie sie mitgenommen?',once:'vl2a',if:A.flag('k3.v.part1'),go:async function(A){ await V.say('Sie hat gefragt. Jeden Morgen am Lager. Ich habe nein gesagt. Sie hat wieder gefragt.'); await A.wait(500); await V.say('Am vierten Morgen habe ich ja gesagt, damit sie aufhört.'); await A.wait(800); await V.say('Sie hat nicht aufgehört. Sie hat dann im Laster weitergeredet.'); }},
    {t:'Was hat sie gezeichnet? Unterwegs.',once:'vl2b',if:A.flag('k3.v.part1'),go:async function(A){ await V.say('Alles. Den Fluss, als er unten auftauchte. Die Kontrollen. Mich.'); await A.wait(600); await V.say('Einmal hat sie den Laster von innen gezeichnet. Ich habe gesagt: Der sieht von innen aus wie von außen. Sie hat gesagt: Nein.'); }},
    {t:'Warum fahren Sie nachts nicht mehr?',once:'vl2c',if:A.flag('k3.v.part1'),go:async function(A){ await A.wait(900); await V.say('Nachts sieht man nichts.'); await A.wait(1000); await A.npc('kata').say('Das sagt er seit siebzehn Jahren. Ich habe es ihm geglaubt.'); }},
    A.askOpt({
      l3_key31:async function(A){ if (A.flag('k3.v.part1')) return V.say('Den Schlüssel behalte ich. Den hat sie liegen lassen. Nicht mir gegeben. Liegen lassen.'); await A.m('In Split fehlt seit dem Januar vierundneunzig ein Schlüssel. Zimmer einunddreißig.'); await part1(A,V); return 'bye'; },
      v3_drawer:async function(A){ if (A.flag('k3.v.part1')) return V.say('Ich weiß, was in meiner Schublade war.'); await part1(A,V); return 'bye'; },
      v3_forlater:function(A){ return drawingSilence(A,V,true); },
      l3_ljerka_pic:async function(A){ await V.say('Ein Bild.'); await A.wait(600); await V.say('Sie hat immer gezeichnet. Alles. Auch das, was man nicht zeichnen soll.'); },
      v3_mala:'Mala. Wie jede. Das habe ich gesagt.',
      v3_part1:'Viertel nach elf. Das bleibt so.',
      v3_cab:function(A){ return cabEarly(A,V); },
      v3_bed:function(A){ return veraBed(A,V); }, v3_log:function(A){ return logShown(A,V); }, v3_sack:function(A){ return sackShown(A,V); },
      k3_c_bridge:async function(A){ await V.say('Mehl und Decken.'); await A.wait(500); await V.say('Graue Decken, mit einem schwarzen Streifen. Armeedecken. Wir hatten zweihundert.'); } },
      ['…','Das weiß ich nicht mehr.','Fragen Sie Kata. Kata weiß alles, was ich vergesse.']),
    {t:'(Gehen.)',bye:true,silent:true,go:async function(A){ await V.say(A.cycle('vlBye2',['…','Morgen ist Sonntag. Sonntags flicke ich trotzdem.'])); }}
  ]; }); }
// Die Phrase aus dem Führerhaus, bevor Mala sie als Botschaft freigegeben hat (Freitag, Samstag, Sonntag vor Gespräch 2).
// Vlado hört sie, glaubt aber nicht, dass sie von ihr kommt. Das merkt sich das Spiel (k3.v.cabHeard): am Sonntag erinnert er sich daran.
async function cabEarly(A,V){ if (A.flag('k3.v.cabHeard')){ await V.say('…'); await A.wait(600); return V.say('Das haben Sie schon einmal gesagt. Lassen Sie das.'); }
  A.setFlag('k3.v.cabHeard'); await A.m('„Halt still.“ – „Ich fahre.“ – „Dann fahr still.“'); await A.wait(1500); await V.say('…'); await A.wait(800); await V.say('Lassen Sie das.'); await A.wait(400);
  await A.m('Er hat es gehört. Aber er glaubt nicht, dass es von ihr kommt. Woher auch.'); }
// Ausbau P3: die Batterie vom Taxi
async function batteryToKata(A){ var K=A.npc('kata'); if (A.flag('k3.v.battery')) return K.say('Die ist schon drin. Zwei. Er springt an.');
  if (A.flag('k3.b.batFrom')==='mate'){ await A.animM('give'); A.take('akumulator'); A.setFlag('k3.v.battery'); A.sfx('keyDrop'); await A.wait(600); await K.say('Eine Batterie.'); await A.wait(500); await K.say('Woher?');
    await A.m('Aus Mate Zelenikas Mercedes. Garage sieben, in der Lipova. Sein Sohn hat es erlaubt.'); await A.wait(800);
    await K.say('Zelenika. Der vom Café, mit der Thermoskanne? Der hat bei uns jeden Herbst Reifen gekauft. Für ein Auto, das er nie gefahren ist.');
    await A.wait(600); await K.say('Zwölf Volt, achtundachtzig Amperestunden. Eigentlich zu klein für den TAM. Aber mit der neuen zusammen reicht sie für einmal Anlassen.'); await A.wait(500); await K.say('Mehr brauchen wir nicht. Einmal.');
    if (A.G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Mate fährt mit. Ein Stück von ihm.'); } return; }
  await A.animM('give'); A.take('akumulator'); A.setFlag('k3.v.battery'); A.sfx('keyDrop'); await A.wait(600); await K.say('Eine Batterie.'); await A.wait(500); await K.say('Woher?'); await A.m('Vom Taxi am Ostbahnhof. Aus dem Kofferraum. Er will sie morgen zurück.');
  await A.wait(900); await K.say('Vom Taxi.'); await A.wait(600); await K.say('Der flickt seine Reifen bei uns, seit ich denken kann. Und redet mit Papa über Reifen. Nur über Reifen.'); await A.wait(500); await K.say('Zwei. Jetzt sind es zwei. Er springt an.');
  await A.wait(600); await A.m('Er sagt: Sagen Sie ihm, von wem sie ist.'); await A.wait(800); await K.say('Das sage ich ihm. Mal sehen, was er dann sagt.');
  if (A.G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Zwei Batterien. Zwei Bahnhöfe. Ein Lastwagen.'); } }
// Ausbau P1/P2: Fahrtenbuch, Spendertafel, Mehlsack bei Vlado
async function logShown(A,V){ var K=A.npc('kata'); if (A.flag('k3.v.logShown')) return V.say('Mein Buch. Ich habe es gesehen.');
  await A.m('Ihr Fahrtenbuch. Aus dem Handschuhfach. Vierzehnter Januar: plus eins. Fünfzehnter, zwei Uhr: niemand.'); await A.wait(1500); await V.say('Mein Buch.'); await A.wait(900); A.sfx('cough'); await V.anim('cough');
  await K.say('Ich habe ihm den Schraubenzieher gegeben, Papa. Ich.'); await A.wait(900); await V.say('Plus eins.'); await A.wait(700); await V.say('So schreibt man das. Lieferung, Ladung, plus eins. Man schreibt keinen Namen in ein Fahrtenbuch.');
  await A.wait(1000); await V.say('Zwei Uhr. Ja.'); await A.wait(600); await V.say('Ich war noch mal unten. Ich habe gerufen. Da war nur der Fluss.'); if (!A.hasNote('v3_two')) A.note('v3_two'); A.setFlag('k3.v.logShown');
  await A.wait(800); await V.say('Das steht da, weil ich es aufgeschrieben habe. Nicht, weil ich es erzählt habe.'); if (A.G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Plus eins. Ich bin in seinem Buch.'); } }
async function donorShown(A,V){ var K=A.npc('kata'); if (A.flag('k3.v.donor')) return V.say('Zweihundert Mark. Das habe ich gesagt.');
  await A.m('Die Tafel an der neuen Brücke in Skela. Zwischen den Spendern: V. Rajić, Mostar.'); await A.wait(1600); await V.say('…'); await A.wait(900); await V.say('Zweihundert Mark. Mehr hatte ich nicht.'); await A.wait(700);
  await V.say('Damit keiner mehr nachts läuten muss.'); A.setFlag('k3.v.donor'); await A.wait(900); await K.say('Papa. Du hast für eine Brücke gezahlt?'); await A.wait(600); await V.say('Für eine Straße mit Geländer.');
  if (A.G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Er hat sie gebaut. Ein bisschen. Für mich.'); await A.wait(500); await A.g('Zu spät. Aber er hat.'); } }
async function sackShown(A,V){ var K=A.npc('kata'); if (A.flag('k3.v.sack')) return V.say('Mein Mehl. Ja.');
  await A.narrate('Ich lege das Stück Jute auf die Montiermaschine. Der Stempel ist zu lesen: Split, Dezember dreiundneunzig.'); await A.wait(1200); await V.say('Mein Mehl.'); await A.wait(800); A.sfx('cough'); await V.anim('cough');
  await V.say('Vierzig Sack. Die Hütte war trocken, damals. Die Leute haben es im Frühjahr geholt.'); await A.wait(600); await V.say('Nicht alles, wie ich sehe.'); A.setFlag('k3.v.sack'); if (!A.hasNote('v3_sack')) A.note('v3_sack');
  if (!A.flag('k3.v.part1')){ await A.wait(900); await V.say('Also war ich da. Das wollen Sie hören.'); await A.wait(600); await V.say('Ich war da. Mit Mehl. Mehr sage ich heute nicht.'); A.setFlag('k3.v.sackAdmit'); } }
// Ausbau N1: Veras Notiz und Veras Brief bei Vlado
async function veraBed(A,V){ var K=A.npc('kata'); if (A.flag('k3.v.bedHeard')){ await V.say('Vera.'); await A.wait(600); return V.say('Das reicht. Einmal reicht.'); } A.setFlag('k3.v.bedHeard');
  await A.m('Vera hat ein Bett gemacht. In der Nacht. Mit dem guten Bezug.'); await A.wait(1500); await V.say('Vera.'); await A.wait(900);
  await V.say('Siebzehn Jahre, und sie erzählt es einem Fremden am Kohlstand.'); await A.wait(800); A.sfx('cough'); await V.anim('cough');
  if (A.flag('k3.v.part2')){ await V.say('Ja. Ich habe gesagt: Macht ein Bett. Und um zwei habe ich gesagt: Ich habe nie jemanden mitgenommen.'); await A.wait(600); await V.say('Einer von beiden Sätzen war gelogen. Sie wissen, welcher.'); }
  else { await V.say('Das geht Sie nichts an. Das geht sie nichts an.'); await A.wait(500); await V.say('Reifen. Reden wir über Reifen.'); }
  await A.wait(700); await K.say('Tante Vera? Du hast nie gesagt, dass sie davon weiß.'); await V.say('Sie weiß nichts. Sie weiß nur, dass ich gelogen habe. Das ist nicht dasselbe.'); }
async function veraLetter(A,V){ var K=A.npc('kata'); if (A.flag('k3.v.veraLetter')) return V.say('Den habe ich. In der Tasche.');
  if (!A.flag('k3.v.part2')){ await A.m('Von Vera. Ihrer Schwester.'); await A.wait(900); await V.say('Nicht jetzt.'); await A.wait(500); await V.say('Was sie zu sagen hat, weiß ich. Was ich zu sagen habe, haben Sie noch nicht gehört.'); return; }
  await A.m('Von Vera.'); await A.animM('give'); A.take('pismo'); A.sfx('paper'); await A.wait(800);
  if (V.actor) V.idle('quiet'); await A.narrate('Er liest. Er liest es zweimal. Dann faltet er es und steckt es in die Brusttasche, zu den Zigaretten.'); await A.wait(1600);
  await V.say('…'); await A.wait(1200); await K.say('Was steht drin?'); await A.wait(700); await A.m('Dass sie ein Bett gemacht hat.'); await A.wait(600); await A.m('Und: Komm es holen.');
  await A.wait(1200); await K.say('Papa.'); await A.wait(900); await V.say('Ich habe es gelesen.'); A.setFlag('k3.v.veraLetter');
  if (A.G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Er hat nichts gesagt.'); await A.m('Bei ihm ist das ein Satz.'); } }
async function drawingSilence(A,V,back){ if (back) await A.m('Auf der Rückseite steht: „Für später. Wenn du nach Sarajevo kommst, zeichne ich dich ohne Zigarette.“');
  await A.wait(800); await A.narrate('Vlado sieht auf die Zeichnung. Er sagt nichts. Er zündet sich eine neue Zigarette an, obwohl die alte noch brennt.'); A.sfx('lighter'); await A.wait(900);
  await A.npc('kata').say('Papa. Du hast zwei.'); await A.wait(500); await V.say('Ich weiß.'); }
async function part1(A,V){ var K=A.npc('kata'); A.music('k3_duh');
  if (V.actor) V.idle('quiet'); await A.wait(1200); await V.say('Hotel Palma.'); await A.wait(900);
  await V.say('Freitag, vierzehnter Januar. Split. Gegen fünf sind wir los. Freitag, gegen fünf.'); await A.wait(500);
  await V.say('Sie stand drei Tage am Lager. Jeden Morgen. Am vierten habe ich ja gesagt.'); await A.wait(600);
  await V.say('Sie hat gesagt, sie heißt Mala.'); await A.wait(900); await V.say('Wie jede.'); A.note('v3_mala');
  await A.wait(700); await V.say('Wir sind gefahren. Die Küste hinunter, dann ins Land. Sie hat gezeichnet. Im Dunkeln, beim Licht vom Armaturenbrett.');
  await A.wait(500); await V.say('In Skela waren wir gegen zwanzig vor elf.'); await V.say('Die Brücke war seit dem Sommer weg. Die Fähre ging nur bei Tag. Nachts fährt da keiner. Sperrstunde. Und der Fluss war hoch.');
  await V.say('Ich habe abgeladen. In die Hütte am Ufer. Die Leute holen es morgens.'); await A.wait(1000);
  await V.say('Ich bin um Viertel nach elf gefahren.'); A.note('v3_part1');
  await A.wait(1200); await K.say('Und sie?'); await A.wait(1400); await A.narrate('Vlado sagt nichts. Er sieht auf seine Hände, als hätte er sie verlegt.');
  await A.m('Und der Schlüssel?'); await A.wait(800);
  await V.say('Ihre Tasche lag noch im Führerhaus.'); await A.wait(600); await V.say('Die Kleider habe ich verschenkt. Den Schlüssel nicht.'); A.note('v3_bag');
  A.setFlag('k3.v.part1');
  await A.wait(900); await K.say('Siebzehn Jahre. Ich wusste nicht mal, dass du je in Split warst.'); await V.say('Du warst zwölf.'); if (V.actor) V.idle('smoke');
  if (malaNear(A)){ await A.wait(1200); await A.g('Er ist gefahren.'); A.note('v3_mala_left');
    var c=await A.choose([{t:'Und dann?',id:'more'},{t:'(Sie lassen.)',id:'let',silent:true}],{title:'Mala'});
    if (c==='more'){ await A.wait(500); await A.g('Mehr will ich jetzt nicht.'); await A.wait(600); await A.m('Gut.'); }
    else { await A.wait(900); await A.g('Danke.'); } }
  else A.note('v3_mala_left',true);
  A.music('k3_istraga'); await M.k3DayCheck(A); }
// Sonntag: Skela, Teil 2, die Botschaft
async function vladoD3(A,V){
  if (A.flag('k3.v.free')){ await V.say(A.cycle('vlF',['Um elf. Im Hof.','Ich habe die Batterie geladen. Kata hat geschimpft. Das ist gut.','Ich fahre. Ich habe es gesagt.']));
    return A.menuLoop(function(){ return [
      A.askOpt({ v3_log:function(A){ return logShown(A,V); }, a3_donor:function(A){ return donorShown(A,V); }, v3_sack:function(A){ return sackShown(A,V); }, a3_asked:'Ich habe gefragt. Am Sonntag. Er hat gesagt: niemand.', v3_battery:'Zwei Batterien. Kata macht das. Kata macht alles, was ich nicht mache.', v3_letter:function(A){ return A.has('pismo')?veraLetter(A,V):V.say('Ein Brief. Dann geben Sie ihn her.'); }, v3_bed:function(A){ return veraBed(A,V); } },['Heute Nacht. Fragen Sie mich morgen.','…']),
      {t:'Bis elf.',bye:true,go:async function(A){ await V.say('Bis elf.'); }} ]; }); }
  if (A.first('vlD3')){ await V.say('Sonntag.'); await A.wait(500); await V.say('Sonntags flicke ich trotzdem.'); }
  await A.menuLoop(function(){ return [
    {t:'Ich war in Skela.',if:!A.flag('k3.v.part2'),go:async function(A){ var done=await skela(A,V); if (done) return 'bye'; }},
    {t:'Ich soll Ihnen etwas sagen. Von ihr.',if:A.flag('k3.d3.talk2')&&!A.flag('k3.v.free'),go:async function(A){ var ok=await message(A,V); if (ok) return 'bye'; }},
    {t:'Ihre Schwester. Wohnt sie noch in Mostar?',once:'vl3a',if:A.flag('k3.v.part2'),go:async function(A){ await V.say('Sie ist tot. Zweitausendzwei.'); await A.wait(700); await V.say('Das Zimmer mit dem Ofen gibt es noch. Da wohnt jetzt ein Student. Er heizt nicht.'); if (A.G.flags['met.vera']){ await A.wait(900); await V.say('Die andere lebt. Vera. Das wissen Sie. Sie haben Kohl bei ihr gekauft.'); await A.wait(500); await V.say('Sie hat das Bett gemacht. Das weiß ich auch.'); } }},
    {t:'Haben Sie es noch einmal versucht? Später, bei Tag?',once:'vl3b',if:A.flag('k3.v.part2'),go:async function(A){ await V.say('Ich bin am Sonntag mit der Fähre hinüber. Mit dem Mehl für das andere Dorf.'); await A.wait(800); await V.say('Der Fährmann hat nicht geredet. Seine Frau hat nicht geredet. Ich habe nicht gefragt.'); await A.wait(900); await V.say('Ich habe gedacht: Sie ist ins Wasser. Wer fragt da noch.'); }},
    A.askOpt({
      photo_full:async function(A){ await V.say('Das ist ein Kind.'); await A.wait(700); if (A.flag('k3.v.part2')) await V.say('Mit siebzehn hatte sie denselben Zopf. Und dieselben Augen, wenn sie etwas wollte.'); },
      v3_forlater:'Für später.',
      v3_who:'Wer wen stehen lassen hat? Ich weiß, wer gefahren ist.',
      v3_log:function(A){ return logShown(A,V); }, a3_donor:function(A){ return donorShown(A,V); }, v3_sack:function(A){ return sackShown(A,V); }, a3_asked:'Ich habe gefragt. Am Sonntag. Er hat gesagt: niemand. Das steht in seinem Buch? Dann hat er es auch aufgeschrieben.',
      v3_bed:function(A){ return veraBed(A,V); }, v3_letter:function(A){ return A.has('pismo')?veraLetter(A,V):V.say('Ein Brief. Dann geben Sie ihn her.'); },
      // nach Gespräch 2 ist der Satz Malas Botschaft: über das Notizbuch gesagt, wirkt er wie über „Ich soll Ihnen etwas sagen“
      v3_cab:async function(A){ if (A.flag('k3.d3.talk2') && !A.flag('k3.v.free')){ await freeVlado(A,V); return 'bye'; } return cabEarly(A,V); } },
      ['…','Das sagt mir nichts.','Kata. Was redet der Mann?']),
    {t:'(Gehen.)',bye:true,silent:true,go:async function(A){ if (A.flag('k3.v.part2')) await V.say('…'); }}
  ]; }); }
var SKELA_ALSO=['a3_girl','a3_voice','a3_pencil','a3_bell3','a3_lightroom','a3_awake','a3_roof','a3_lightseq','a3_thrice','a3_slept','l3_survived','a3_alive','a3_blanket','a3_fromzlata','a3_grave','a3_stumps','a3_soldier','a3_morning','a3_hut','a3_mine','a3_neighbor','a3_plaque'];
var PARTIAL={
  a3_voice:'Gerufen haben in der Zeit viele. Soldaten auch. Wer hat da gerufen?',
  a3_pencil:'Ein Bleistift an einer Glocke. Den kann jeder verlieren.',
  a3_bell3:'Dreimal geläutet. Wer?',
  a3_hut:'In der Hütte hat sie gesessen, ja. Bei den Säcken. Das war, bevor ich gefahren bin.',
  a3_roof:'Ein Fenster. Und? Fenster haben alle.', a3_lightseq:'Ein Fenster, das hell wird und wieder dunkel. Das kann der Wind an der Lampe sein.',
  a3_thrice:'Dreimal geläutet. Wer sagt das? Einer, der mitgezählt hat?', a3_slept:'Geschlafen. Ja. Nachts schläft man. Ich nicht.',
  a3_blanket:'Eine graue Decke mit einem schwarzen Streifen?', a3_fromzlata:'Graue Decken. Wir hatten zweihundert davon auf dem Laster. Und?',
  a3_grave:'Ein Brett, auf dem Mala steht. Mala heißt jede.',
  a3_stumps:'Die Stümpfe. Die hat sie gesehen, im Licht vom Laster. Sie hat gesagt: wie Zähne.',
  a3_soldier:'Ein Soldat? Da war kein Soldat. Da war nur sie.',
  a3_morning:'Am Morgen. Da war ich zu Hause.',
  a3_mine:'Am Anker? Was soll da sein? Ein Stück Seil.',
  a3_neighbor:'Seit achtundneunzig fährt da keine Fähre. Das weiß ich.', a3_plaque:'Die Brücke. Die haben andere bezahlt.' };
function vAsk(got){ if (!got.bell) return 'Wer hat geläutet? Sagen Sie mir, wer da geläutet hat.'; if (!got.light) return 'Und drüben? Hat einer Licht gemacht? Hat einer aufgemacht?'; if (!got.alive) return 'Und sie? Was war mit ihr?'; return null; }
// Marko erzählt, was er in Skela weiß. Teil 2 erst mit a3_girl, a3_lightroom und l3_survived (K3_SPEC, Konzept 7.2 Schritt 8)
async function skela(A,V){ var S=A.S, got=S.vtold||{};
  if (A.first('vlSk')){ await A.wait(600); await V.say('Skela.'); await A.wait(800); await V.say('Was wollten Sie da? Da ist eine Brücke. Seit achtundneunzig. Da fährt keiner mehr über.'); }
  else if (got.bell||got.light||got.alive){ await V.say(vAsk(got)||'Weiter.'); }
  for (var guard=0; guard<14; guard++){ if (got.bell&&got.light&&got.alive) break;
    var n=await A.askNote('Was erzähle ich ihm von Skela?',{also:SKELA_ALSO});
    if (!n){ await A.m('Mehr weiß ich noch nicht.'); await A.wait(500); var q=vAsk(got); if (q) await V.say(q); await V.say('Wenn Sie es wissen, kommen Sie wieder. Wenn nicht, nicht.'); S.vtold=got; return false; }
    if (n==='a3_girl'){ if (got.bell){ await V.say('Das haben Sie gesagt.'); continue; } got.bell=1;
      await A.m('In der Nacht hat dort jemand geläutet. Dreimal. Eine Mädchenstimme hat über den Fluss gerufen: „Halo! Ima li koga?“'); await A.m('Am Morgen lag an der Glocke ein Bleistift. Angekaut.');
      await A.wait(1100); await V.say('Ein Bleistift.'); await A.wait(700); await V.say('Sie hatte so einen Stummel. Den hatte sie zwischen den Zähnen, wenn sie nicht gezeichnet hat. Wie ich die Zigarette.'); var q1=vAsk(got); if (q1){ await A.wait(500); await V.say(q1); } continue; }
    if (n==='a3_lightroom'||n==='a3_awake'){ if (got.light){ await V.say('Das haben Sie gesagt.'); continue; } got.light=1;
      await A.m('Drüben, im Haus des Fährmanns, ging Licht an. Nach dem ersten Läuten. Vor dem dritten ging es wieder aus.'); await A.wait(1000); await V.say('Licht.'); await A.wait(700); await V.say('Dann war einer wach. Drüben.');
      A.sfx('cough'); var q2=vAsk(got); if (q2){ await A.wait(500); await V.say(q2); } continue; }
    if (n==='l3_survived'||n==='a3_alive'){ if (got.alive){ await V.say('Das haben Sie gesagt.'); continue; } got.alive=1;
      await A.m((A.hasNote('a3_morning')||A.hasNote('a3_alive'))?'Sie ist nicht im Fluss gestorben. Am Morgen hat eine Frau sie gefunden, unten im Schilf. Sie hat noch gelebt.':'Sie ist nicht im Fluss gestorben. Eine Frau hat sie gefunden und an ihren Herd gelegt. Sie hat noch gelebt.'); await A.wait(1400); A.sfx('wrench'); await V.say('Gelebt.'); await A.wait(900);
      var q3=vAsk(got); if (q3){ await A.wait(400); await V.say(q3); } continue; }
    if (PARTIAL[n]){ await V.say(PARTIAL[n]); continue; }
    if (/^v3_/.test(n)){ await V.say('Das haben Sie von mir. Erzählen Sie mir nicht, was ich erzählt habe.'); continue; }
    await V.say(A.cycle('vlSkN',['Das sagt mir nichts.','Was hat das mit ihr zu tun?','Weiter.'])); }
  S.vtold=got; if (!(got.bell&&got.light&&got.alive)) return false;
  await part2(A,V); return true; }
async function part2(A,V){ var K=A.npc('kata'); A.music('k3_duh'); if (V.actor) V.idle('quiet');
  await A.wait(1400); await A.narrate('Vlado legt den Montierhebel weg. Er setzt sich auf den Reifenstapel, als hätte ihm jemand die Beine weggenommen.'); await A.wait(800);
  await V.say('Sie hat mich weggeschickt.'); await A.wait(1000);
  await V.say('Ich wollte sie zu meiner Schwester bringen. Nach Mostar. Ein Zimmer mit Ofen, bis morgens die Fähre fährt.');
  await V.say('Sie hat gesagt: Ich habe genug gewartet. Für ein ganzes Leben. Fahr.'); A.note('v3_sent');
  await A.wait(1100); await V.say('Ich bin gefahren.'); await A.wait(900);
  await V.say('Ich bin bis zur Kontrolle gefahren. Dann bin ich umgekehrt. Um zwei war ich wieder da.'); if (A.flag('k3.v.logShown')){ await A.wait(500); await V.say('Das wissen Sie aus dem Buch. Jetzt wissen Sie es von mir.'); } await A.wait(500); await V.say('Ich habe gerufen. Da war nur der Fluss.'); A.note('v3_two');
  await A.wait(1500); await V.say('Sie hat noch gelebt.'); await A.wait(900); await V.say('Und ich bin nach Hause gefahren.');
  await A.wait(1600); await K.say('Papa.'); await A.wait(800); await K.say('Warum hast du das nie erzählt?'); await A.wait(1200); await V.say('Weil mich keiner gefragt hat.'); A.setFlag('k3.v.part2');
  await A.wait(1000); await K.say('Ich war zwölf. Du hast bis zum Morgen im Laster gesessen, im Hof. Ich habe vom Fenster aus zugesehen.'); await A.wait(500); await K.say('Ich dachte, du hast Streit mit Mama.');
  await A.wait(900); await V.say('Ich gehe nach hinten.'); await hideBack(A,V);
  A.setFlag('k3.v.yard'); A.set('yardOpen',true); A.rebuild(); A.sfx('tarp');
  await A.wait(700); await K.say('Lassen Sie ihn. Das Rolltor ist offen. Gehen Sie ruhig zum Laster, wenn Sie wollen. Heute ist es egal.');
  await A.wait(600); await A.m('„Sie hat mich weggeschickt.“');   // Analyse K3-B03 (P17): Malas Gegensatz („Er ist gefahren.“) erinnert der Spieler selbst (v3_who)
  if (A.G.malaOn && A.malaHere()){ await A.wait(700); await A.narrate('Mala steht am Rolltor. Sie sieht mich nicht an.'); }
  A.music('k3_istraga'); }
// die Botschaft (Konzept 7.2 Schritt 11): der Spieler wählt aus dem Notizbuch; Mala nennt den Satz nie
var MSG_ALSO=['v3_cab','v3_forlater','v3_sent','v3_two','v3_mala','v3_bag','v3_part1','v3_hewas','v3_denial','v3_tomorrow','v3_message','v3_mala_left','v3_who','v3_drawer','l3_rope','a3_girl','l3_survived','photo_full'];
var WRONG={
  v3_forlater:'Das haben Sie gelesen.',
  v3_sent:'Das habe ich Ihnen selbst erzählt.',
  v3_two:'Das habe ich Ihnen auch erzählt. Vorhin. Da saß ich hier.',
  v3_mala:'„Wie jede.“ Das war ich. Nicht sie.',
  v3_bag:'Die Tasche. Das wissen Sie von mir.',
  v3_part1:'Uhrzeiten. Die kann jeder nachrechnen.',
  v3_hewas:'Die Zigarette. Die sieht jeder, der mich ansieht.',
  v3_denial:'Nie. Das habe ich gesagt. Das war gelogen. Das wissen Sie.',
  v3_tomorrow:'Morgen. Das habe ich gesagt. Nicht sie.',
  v3_message:'Dass ich nicht schuld bin. Das kann jeder sagen.',
  v3_mala_left:'Er ist gefahren. Ja. Das sagen alle. Das sage ich auch.',
  v3_who:'Wer wen stehen lassen hat? Ich war es. Ich bin gefahren.',
  v3_drawer:'Den Schlüssel haben Sie gesehen. Das war meine Schublade, nicht ihre.',
  l3_rope:'Sie wollen mir sagen, sie ist selbst gegangen. Das kann jeder sagen, der nicht dabei war.',
  a3_girl:'Dass sie es war, an der Glocke, weiß ich jetzt. Von Ihnen.',
  l3_survived:'Dass sie noch gelebt hat, weiß ich jetzt. Das macht es nicht leichter.' };
async function message(A,V){ var res=false;
  if (A.first('vlMsg0')){ await A.wait(700); await V.say('Von ihr.'); await A.wait(1000); await V.say('Wie soll das gehen?'); await A.wait(500); await A.m('Ich weiß es. Glauben Sie mir einfach, dass ich es weiß.'); await V.say('Dann sagen Sie.'); }
  await A.menuLoop(function(){ return [ askM(A,'vlado_msg'),
    {t:'(Ihm sagen, was nur die beiden hatten.)',silent:true,noGray:true,go:async function(A){ var ok=await deliver(A,V); if (ok){ res=true; return 'bye'; } }},   // Prüfbericht K3: Mala hat den Auftrag selbst gegeben, keine Rüge
    {t:'(Noch nicht.)',bye:true,silent:true,go:async function(A){ await V.say('Ich laufe nicht weg. Ich laufe nirgends mehr hin.'); }}
  ].filter(Boolean); });
  return res; }
async function deliver(A,V){ var n=await A.askNote('Was sage ich ihm?',{also:MSG_ALSO});
  if (!n){ await A.m('Noch nicht.'); return false; }
  if (n==='v3_cab') return freeVlado(A,V);
  A.setFlag('k3.v.msgTry',(A.flag('k3.v.msgTry')||0)+1);
  if (WRONG[n]){ await A.wait(600); await V.say(WRONG[n]); }
  else { await A.wait(600); await V.say(A.cycle('vlMsgN',['Das kann jeder sagen.','Das ist nicht von ihr. Das ist von Ihnen.','Wer hat Ihnen das erzählt?'])); }
  await A.wait(400); await V.say(A.cycle('vlMsgW',['Weiter. Ich höre.','Ich höre.','Ich bin noch da.'])); return false; }
async function freeVlado(A,V){ var K=A.npc('kata'); A.music('k3_duh');
  await A.m('„Halt still.“'); await A.wait(800); await A.m('„Ich fahre.“'); await A.wait(800); await A.m('„Dann fahr still.“');
  if (A.flag('k3.v.cabHeard')){ await A.wait(1500); await V.say('Das haben Sie schon am Freitag gesagt.'); await A.wait(900); await V.say('Da wollte ich es nicht hören.'); await A.wait(1100); await V.say('Woher wissen Sie es?'); }
  else { await A.wait(1800); await V.say('Woher …?'); }
  await A.wait(1000); await A.m('Ich bin Übersetzer.');
  await A.wait(1500); if (V.actor) V.idle('quiet'); await A.narrate('Vlado nimmt die Zigarette aus dem Mund. Zum ersten Mal, seit ich ihn kenne. Er hält sie zwischen zwei Fingern und sieht sie an, als gehörte sie einem anderen.');
  await A.wait(900); await V.say('Dann fahr still.'); await A.wait(1000); await V.say('Das hat sie gesagt. Irgendwo im Dunkeln. Und ich habe gelacht. Das einzige Mal auf der ganzen Fahrt.');
  await V.say('Das weiß keiner. Das war im Führerhaus.'); await A.wait(1300);
  await V.say('Heute Nacht fahre ich.'); await A.wait(700); await V.say('Sie wollen nach Skela.'); await A.wait(500); await V.say('Um elf hole ich Sie ab. Hier im Hof.');
  await A.wait(700); await K.say('Den Lastwagen verkaufen wir nicht.'); await A.wait(500); await V.say('Nein.'); await K.say('Graz kriegt eine E-Mail. Auf Deutsch. Die schreiben Sie mir.');
  A.note('v3_tonight'); A.setFlag('k3.v.free'); A.setFlag('k3.v.yard');
  if (!A.flag('k3.b.done')){ await A.wait(600); await A.m('Vorher muss ich noch zu den Feigen.'); await V.say('Feigen.'); await A.wait(400); await K.say('Papa. Er meint das ernst.'); }
  if (A.G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Er hat gelacht. Ich wusste nicht, dass er sich daran erinnert.'); }
  A.music('k3_istraga'); await M.k3DayCheck(A); return true; }
// ---------------------------------------------------------------- Kata
async function talkKata(A){ var K=A.npc('kata'), G=A.G, p=G.phase;
  if (closedNow(G)) return K.say(A.cycle('ktC',['Eine Stunde. Ich sage ihm, dass Sie nichts Böses wollten. Er glaubt mir sowieso nicht.','Kommen Sie wieder, wenn er drei Reifen geflickt hat. Das dauert eine Stunde. Ungefähr.']));
  await A.menuLoop(function(){ return [
    {t:'Was steht da hinten unter der Plane?',once:'kt1',go:async function(A){ await K.say('Ein TAM 4500. Achtundsiebzig. Papas Laster.'); await K.say('Er fährt ihn nicht, und er verkauft ihn nicht. Er steht seit dem Krieg da und frisst Platz.');
        await K.say('Jetzt will ihn ein Museum in Graz. Für Geld. Echtes Geld.'); await A.wait(500); await K.say('Nur schreiben die mir auf Deutsch. Mein Deutsch ist aus dem Fernsehen. Für Krimis reicht es. Für ein Museum nicht.'); A.setFlag('k3.v.tam'); }},
    {t:'Ich bin Übersetzer. Zeigen Sie mir die E-Mail.',if:A.flag('k3.v.tam')&&!A.flag('k3.v.mail'),go:function(A){ return mail(A,K); }},
    {t:'Die Schublade.',if:A.flag('k3.v.which')&&!A.flag('k3.v.drawer'),go:async function(A){ await K.say('Welche?'); await which(A,K); if (A.flag('k3.v.drawer')) return 'bye'; }},
    {t:'Ihr Vater redet nicht viel.',once:'kt2',go:async function(A){ await K.say('Mit Ihnen nicht. Mit Reifen schon.'); await A.wait(500); await K.say('Mit Reifen ist er sehr gesprächig. Hören Sie mal hin, wenn er flickt. Er flucht in drei Sprachen.'); }},
    {t:'Sie machen die Nachtdienste?',once:'kt3',if:!!A.G.seen['dlg:kt2']||A.hasNote('v3_mate'),go:async function(A){ await K.say('Seit ich achtzehn bin. Nachts platzt immer einem ein Reifen, auf der Straße nach Split oder nach Sarajevo.'); await K.say('Papa fährt nachts nicht. Nie. Ich dachte immer, das ist eine Marotte. Wie andere nicht fliegen.'); }},
    {t:'Liegt das noch auf dem Tisch? Die Zeichnung.',once:'kt4',if:p==='k3_d2'&&A.flag('k3.v.drawer'),go:async function(A){ await K.say('Er hat sie nicht wieder weggeschlossen. Er sitzt seit heute früh davor. Und raucht.'); await A.wait(500); await K.say('Wer ist das, die das gezeichnet hat? Sie wissen es. Ich sehe es Ihnen an.'); await A.m('Ein Mädchen aus Sarajevo.'); await K.say('Ein Mädchen. Mit Papa. Im Krieg.'); await A.wait(700); await K.say('Ich will das hören. Aber von ihm.'); }},
    {t:'Haben Sie den Typenschein gefunden? In der Mappe.',if:p!=='k3_d1'&&A.flag('k3.v.drawer')&&!A.hasNote('v3_blatt'),go:async function(A){ await K.say('Ich habe die Mappe durchgesehen. Zulassung, Rechnungen, Stempel von achtundsiebzig.'); await A.wait(600); await K.say('Der Typenschein ist nicht drin. Das eine Blatt fehlt.');
        await A.wait(700); await K.say('Der Laster war von meinem Onkel. Das Blatt hat die Tante. Vera. Drüben, am Markt, mit Kohl.'); await A.wait(600); await K.say('Papa und sie reden nicht. Seit vierundneunzig. Ich bin das Telefon zwischen ihnen. Ein schlechtes.');
        await A.wait(500); await K.say('Papa fährt nicht rüber. Nicht, weil er nicht darf. Weil er dann weiß, was er alles nicht weiß.'); A.note('v3_blatt');
        if (A.G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Drüben.'); await A.wait(400); await A.g('Das sagen hier alle, und jeder meint eine andere Seite.'); } }},
    {t:'Kann ich den Laster sehen?',if:A.flag('k3.v.part1')&&!A.flag('k3.v.yard'),go:async function(A){ await openYard(A,K); }},
    {t:'Er war zwölf Stunden im Laster. Damals.',once:'kt5',if:A.flag('k3.v.part2'),go:async function(A){ await K.say('Bis es hell war.'); await A.wait(800); await K.say('Mama hat mich vom Fenster weggezogen. Sie hat gesagt: Lass ihn. Ich habe ihn gelassen. Siebzehn Jahre.'); }},
    {t:'Fährt er wirklich? Heute Nacht?',if:A.flag('k3.v.free')&&!A.hasNote('v3_battery')&&!A.flag('k3.v.battery'),go:async function(A){ var r2=R2(A.G); await K.say('Er fährt. Wenn er anspringt.'); await A.wait(600);
        // Prüfbericht K3-05: Regel 2 – die zweite Batterie ist tot, ohne Ersatz kein Start; Regel 1 (alte Spielstände) – schwach, drei Versuche
        await K.say(r2?'Vierundzwanzig Volt. Zwei Batterien hintereinander. Eine habe ich neu, die zweite ist tot wie ein Stein. Ohne zweite dreht der Anlasser keinen Millimeter.':'Vierundzwanzig Volt. Zwei Batterien hintereinander. Eine habe ich neu, die zweite ist schwach. Mit Glück springt er beim dritten Mal an. Mit einer zweiten beim ersten.');
        await A.wait(500); await K.say('Sonntag. Keiner hat offen, und die, die offen haben, haben keine für einen Lastwagen.');
        await A.wait(600); await K.say(r2?'Eine Autobatterie würde reichen. Zwölf Volt. Für einmal Anlassen.':'Papa sagt: Dann schieben wir. Papa ist vierundsechzig.'); A.note('v3_battery');
        if (A.G.malaOn && A.malaHere()){ await A.wait(600); await A.g(r2?'Eine Batterie, die keiner braucht. In einem Auto, das keiner mehr fährt.':'Wer hat hier eine Batterie und ein Auto, das er liebt?'); } }},
    {t:'Der TAM. Fährt er?',once:'kt6',if:A.flag('k3.v.free'),go:async function(A){ await K.say('Er fährt. Batterie, Öl, Bremsen, Reifen. Zwei Tage habe ich an ihm geschraubt, für Graz.'); await A.wait(400); await K.say('Ich wusste nicht, wofür.'); }},
    A.askOpt({
      v3_drawer:async function(A){ if (!A.flag('k3.v.which')||A.flag('k3.v.drawer')) return K.say('Schubladen? Fragen Sie Papa. Ich frage ihn nie nach Schubladen.'); await K.say('Welche?'); await which(A,K); if (A.flag('k3.v.drawer')) return 'bye'; },
      v3_typenschein:'Der Typenschein. Ohne den will Graz ihn nicht. Ohne den will ihn niemand.',
      photo_full:async function(A){ await K.say('Wer ist das?'); await A.wait(500); await K.say('Ein Kind mit Zopf. Und ein kleiner Junge mit Ohren.'); await A.wait(400); await K.say('Sind das Sie? Die Ohren?'); await A.m('Ja.'); },
      k3_c_bridge:'Ein Laster mit Mehl? Papa? Er hat nie davon erzählt. Er erzählt nie.',
      v3_denial:'Nie, sagt er. Bei ihm heißt nie: Fragen Sie nicht weiter.',
      v3_tomorrow:'Morgen heißt bei ihm morgen. Das ist das Einzige, worauf man sich verlassen kann.',
      v3_sent:'Er hat es erzählt. Endlich. Und mir hat er es nicht erzählt, sondern Ihnen.',
      v3_cab:'„Dann fahr still“? Das klingt nach ihm. Das klingt nach jemandem, der ihn kannte.',
      v3_battery:function(A){ return K.say(R2(A.G)?'Zwei Batterien. Ja. Ich habe eine. Ohne die zweite fährt heute Nacht keiner. Eine Autobatterie reicht. Wenn Sie eine finden, bin ich Ihnen was schuldig. Reifen fürs Leben.':'Zwei Batterien. Ja. Ich habe eine. Wenn Sie eine zweite finden, bin ich Ihnen was schuldig. Reifen fürs Leben.'); },
      v3_log:'Das Fahrtenbuch? Aus dem Handschuhfach? Ich wusste nicht mal, dass es noch da ist. Plus eins. Er hat sie dazugezählt.',
      a3_donor:'Papa hat für eine Brücke gezahlt? Er zahlt nicht mal für den Kaffee bei Zdravko.',
      v3_blatt:'Das Blatt. Bei Tante Vera. Ich kann es holen, sie gibt es mir nicht. „Er soll kommen“, sagt sie. Er kommt nicht. So geht das seit siebzehn Jahren.',
      v3_bed:'Ein Bett? Davon weiß ich nichts. Ich war zwölf. Ich habe nur gesehen, dass er im Laster saß.',
      v3_letter:'Ein Brief von Tante Vera? Geben Sie ihn ihm selbst. Von mir nimmt er nichts an, was von ihr kommt.' },
      ['Keine Ahnung.','Fragen Sie Papa. Oder lieber nicht.','Ich mache hier nur die Rechnungen.']),
    {t:'(Gehen.)',bye:true,silent:true,go:async function(A){ await K.say(A.cycle('ktBye',['Ćao.','Und wenn Sie einen Reifen brauchen: Wir haben welche.','Bis morgen. Bei uns ist immer morgen.'])); }}
  ]; }); }
async function openYard(A,K){ await K.say('Den TAM?'); await A.wait(600); await K.say('Warum nicht. Die Grazer wollen ihn auch sehen. Kommen Sie.'); A.sfx('tarp'); A.setFlag('k3.v.yard'); A.set('yardOpen',true); A.rebuild();
  await A.narrate('Kata drückt einen Knopf an der Wand. Das Rolltor zum Hof rattert hoch und bleibt auf halber Höhe hängen. Sie tritt dagegen. Es geht ganz hoch.'); }
// die E-Mail aus Graz: österreichische Begriffe zählen (Typenschein ist nicht Typenschild, Zulassung ist nicht Zulassen)
async function mail(A,K){ await K.say('Hier. Lesen Sie. Langsam, bitte. Ich will jedes Wort.'); A.sfx('typing');
  await A.doc({style:'letter',title:'E-Mail aus Graz',lines:['Sehr geehrte Frau Rajić,','','vielen Dank für Ihr Angebot. Wir sind an dem TAM 4500,','Baujahr 1978, sehr interessiert.','Für den Ankauf benötigen wir den originalen Typenschein.','Ohne Typenschein ist eine Zulassung in Österreich','nicht möglich, auch nicht als historisches Fahrzeug.','Die Überstellung nach Graz übernehmen wir; das Fahrzeug','muss dafür nicht fahrbereit sein.','','Mit freundlichen Grüßen','E. Pichler · Sammlung alter Nutzfahrzeuge, Graz']});
  await A.m('Österreichisch. Das ist Deutsch mit eigenen Wörtern.'); await K.say('Und? Wollen die ihn, oder nicht?');
  var res=await A.puzzle({title:'Kata die E-Mail übersetzen',hint:'Kata will jedes Wort. Österreichisch hat eigene Wörter. Tippe auf eine Zeile, um eine andere Fassung zu wählen, dann „Vorlesen“.',button:'Vorlesen',
    slots:[['Sie brauchen das Blechschild mit der Fahrgestellnummer.','Sie brauchen das Werkspapier, in dem steht, was für ein Fahrzeug er ist.','Sie brauchen ein Foto von seinem Typ.'],
      ['Ohne das lassen sie ihn nicht ins Land,','Ohne das können sie ihn in Österreich nicht anmelden,','Ohne das lassen sie ihn nicht ins Museum,'],
      ['auch nicht als Oldtimer.','auch nicht als Ersatzteil.','auch nicht mit Geschichte.'],
      ['Abholen tun sie ihn selbst, auch wenn er nicht fährt.','Wir müssen ihn selbst nach Graz fahren.','Vorher muss er wieder fahren.']],
    init:[0,0,1,1],
    check:function(sel){ var ok=[1,1,0,0], msg=[
        [ 'Kata: „Ein Schild? Das ist an die Kabine genietet. Das schickt man doch nicht mit der Post.“','', 'Kata: „Ein Foto? Für ein Foto schreiben die nicht so lang.“' ],
        [ 'Kata: „Ins Land lassen? Im Fernsehen heißt Zulassung was mit Auto und Amt. Nicht mit Grenze.“','', 'Kata: „Nicht ins Museum? Die wollen ihn doch ausstellen.“' ],
        [ '', 'Kata: „Ersatzteil? Er ist doch ganz. Er steht nur.“', 'Kata: „Mit Geschichte? Er hat keine Geschichte. Er steht seit siebzehn Jahren unter einer Plane.“' ],
        [ '', 'Kata: „Selbst fahren? Papa fährt nicht. Nicht nach Graz und nicht nach Hause.“', 'Kata: „Da war ein „nicht“. Ich habe ein „nicht“ gehört.“' ] ];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i][sel[i]]||'Kata: „Das klingt falsch.“'}; return {ok:true}; }});
  if (!res){ await K.say('Was ist? Steht da was Schlimmes? Dann sagen Sie es lieber gleich.'); return; }
  await A.m('Sie wollen ihn. Aber nur mit dem Typenschein, dem Papier vom Werk. Ohne das Papier können sie ihn in Österreich nicht anmelden, auch nicht als Oldtimer. Abholen tun sie ihn selbst.');
  await A.wait(500); await K.say('Der Typenschein.'); await A.wait(600); await K.say('Den hat Papa. Der liegt in einer von den drei Schubladen da. Alle abgeschlossen.'); await K.say('Ich kann ihn um einen Schlüssel bitten. Nicht um drei. Sonst fragt er, wozu.');
  A.setFlag('k3.v.mail'); A.note('v3_typenschein'); await A.wait(600); await K.say('Welche?'); A.setFlag('k3.v.which'); await which(A,K); }
// Kata fragt offen „Welche?“; ohne Malas Blick weiß Marko es nicht, und Kata lässt nicht raten
async function which(A,K){ var o=[];
  if (A.hasNote('v3_drawer')) o.push({t:'Die unterste.',id:'low'});
  o.push({t:'Ich weiß es nicht.',id:'no'});
  if (!A.hasNote('v3_drawer')) o.push({t:'Eine davon wird es schon sein. Fragen Sie nach irgendeiner.',id:'guess'});
  var c=await A.choose(o,{title:'Kata'});
  if (c==='no'){ await K.say('Dann warte ich.'); await A.wait(500); await K.say('Wenn ich ihn frage, muss es die richtige sein. Er gibt mir einen Schlüssel. Einen zweiten gibt er mir nicht.'); return; }
  if (c==='guess'){ await K.say('Irgendeine?'); await A.wait(500); await K.say('Wenn ich ihn frage, muss es die richtige sein. Raten Sie bei Ihren Übersetzungen auch?'); return; }
  await drawerScene(A,K); }
async function drawerScene(A,K){ var V=A.npc('vlado');
  if (!vladoHere(A.G)){ await K.say('Die unterste. Gut. Wenn er wieder vorn ist.'); return; }
  await K.say('Die unterste.'); await A.wait(700); await K.say('Sie sind sich sicher.'); await A.m('Ja.'); await A.wait(600);
  await K.say('Papa. Den Schlüssel für die unterste Schublade. Für die Papiere vom TAM.'); await A.wait(900);
  await A.narrate('Vlado sieht nicht auf. Er zieht einen Schlüsselbund aus dem Overall, sucht mit dem Daumen einen kleinen Schlüssel heraus und hält ihn hin, ohne hinzusehen. Kata steht auf und holt ihn sich.');
  A.sfx('drawer'); await A.wait(800); await K.say('Da. Typenschein, Zulassung, alles von achtundsiebzig.');
  await A.narrate('Sie hebt eine Mappe heraus: „TAM 4500“. Dabei rutscht etwas zwischen den Papieren hervor und fällt auf den Tisch.'); A.sfx('keyDrop'); A.set('drawerOpen',true); A.rebuild(); await A.wait(900);
  await A.narrate('Ein gefaltetes Blatt. Und ein Schlüssel mit einem Holzanhänger. In den Anhänger ist eine Zahl gebrannt: 31.');
  await K.say('Was ist das?'); await A.wait(600); await K.say('Einunddreißig.'); await A.wait(500);
  await A.narrate('Sie faltet das Blatt auf. Eine Bleistiftzeichnung: ein Mann am Steuer, eine Zigarette zwischen den Zähnen, das Licht kommt von unten.'); await K.say('Das bist du, Papa.');
  await A.wait(1300); if (V.actor){ var d=M.stand('vulkanizer','desk')||[352,122,'B']; V.idle(null); await V.walk(d[0]-24,d[1]); }
  await A.wait(900); await A.narrate('Vlado steht am Schreibtisch. Er sieht auf die Zeichnung. Dann auf den Schlüssel. Er fasst beides nicht an.');
  if (A.G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Meine Zeichnung.'); await A.wait(900); await A.g('Und mein Schlüssel.'); }
  await A.wait(1300); if (!A.hasNote('v3_denial')){ await A.m('Herr Rajić. Ich suche ein Mädchen. Sie ist im Januar vierundneunzig mit Ihnen gefahren.'); await A.wait(900); }
  await V.say('Morgen.'); await A.wait(1000); await V.say('Kommen Sie morgen.'); A.note('v3_tomorrow'); A.setFlag('k3.v.drawer'); A.setFlag('k3.v.met');
  await hideBack(A,V);
  await A.wait(700); await K.say('Wenn er nichts sagen will, geht er nach hinten. Er ist oft hinten.'); await A.wait(500); await K.say('Morgen heißt bei ihm morgen. Nicht irgendwann.');
  await M.k3DayCheck(A); }
// ---------------------------------------------------------------- Schreibtisch, Zeichnung, Schubladen
async function deskLook(A){ var S=A.S, p=A.G.phase;
  if (!S.drawerOpen) return A.m('Ein Schreibtisch aus Metall mit drei Schubladen untereinander, jede mit einem eigenen Schloss. Darauf Ordner, ein Telefon, ein Bildschirm, auf dem eine E-Mail offen ist.');
  if (p==='k3_d1') return A.m('Auf dem Schreibtisch liegen die Mappe, das gefaltete Blatt und der Schlüssel mit der 31. Keiner fasst sie an.');
  return readDrawing(A); }
async function readDrawing(A){ var S=A.S, p=A.G.phase;
  if (!S.drawerOpen) return A.m('Rechnungen und Lieferscheine. Nichts, was ich lesen muss.');
  if (p==='k3_d1') return A.npc('kata').say('Lassen Sie das liegen. Er hat gesagt: morgen. Ich will nicht, dass er heute noch einmal so schaut.');
  await A.doc({style:'faded',title:'Bleistift auf Packpapier',lines:['Ein Mann am Steuer, von der Seite.','Die Zigarette zwischen den Zähnen, die Augen auf der Straße.','Das Licht kommt von unten, vom Armaturenbrett.','','Daneben ein Schlüssel mit Holzanhänger: 31.','','Auf der Rückseite, schnell und schräg:','„Za kasnije. Kad dođeš u Sarajevo,','nacrtat ću te bez cigarete.“']});
  if (!A.hasNote('v3_forlater')){ await A.m('„Für später. Wenn du nach Sarajevo kommst, zeichne ich dich ohne Zigarette.“'); A.note('v3_forlater');
    if (A.G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Meine Schrift. Ich habe immer zu schnell geschrieben.'); await A.wait(500); await A.g('Er ist nie nach Sarajevo gekommen.'); } } }
async function malaDrawer(A,k){ var has=A.hasNote('v3_drawer');
  if (k===1) return A.g(has?'Oben die Rechnungen.':'Oben: Rechnungen. Hunderte. Für Reifen, für Öl, für Strom. Und ein Kaugummipapier von neunzehnhundertirgendwas.');
  if (k===2) return A.g(has?'In der Mitte die Kataloge.':'In der Mitte: Reifenkataloge. Bunte Hefte. Ein Reifen sieht aus wie der andere.');
  if (has) return A.g(A.S.drawerOpen?'Die Schublade ist leer. Was darin war, liegt jetzt auf dem Tisch.':'Unten: die Mappe, das Blatt, der Schlüssel. Einunddreißig.');
  if (k===0){ await A.g('Drei Schubladen. Ich sehe durch das Holz.'); await A.wait(400); await A.g('Oben Rechnungen. In der Mitte Reifenkataloge.'); }
  await A.g('Unten liegt eine Mappe. „TAM 4500“. Alte Papiere, mit Stempeln.'); await A.wait(600); await A.g('Dazwischen ein Blatt, gefaltet. Und ein Schlüssel mit einem Holzanhänger.'); await A.wait(1000); await A.g('Einunddreißig.');
  A.note('v3_drawer'); await A.wait(900); await A.g('Einunddreißig war mein Zimmer. Im Palma.'); await A.wait(600); await A.g('Ich habe den Schlüssel mitgenommen. Damit ich zurückkann, glaube ich.'); }
async function drawerUse(A,k){ var S=A.S; if (k===3 && S.drawerOpen) return A.m('Die unterste Schublade steht offen. Leer bis auf Staub und eine Büroklammer.');
  return A.m(A.cycle('drL'+k,['Abgeschlossen. Den Schlüssel trägt Vlado am Overall.','Abgeschlossen. Ich breche keine Schubladen auf, schon gar nicht unter Katas Augen.'])); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Straßentür',exit:{to:'bulevar'},look:function(A){ return A.m(A.S.closed?'Die Straßentür, der Rollladen halb unten. Draußen die Seitengasse.':'Die Straßentür mit Glas. Draußen die Seitengasse und ein Stück Bulevar.'); },
   g:{look:'Draußen ist der Bulevar. Da will ich nicht noch einmal stehen bleiben.'}},
 {id:'yard_door',name:'Rolltor',exit:function(S){ return S.yardOpen?{to:'vhof'}:null; },gexit:{to:'vhof'},
   look:function(A){ return A.m(A.S.yardOpen?'Das Rolltor zum Hof steht offen. Draußen der Lastwagen.':'Ein Rolltor aus Wellblech, heruntergelassen. Dahinter der Hof.'); },
   open:async function(A){ var K=A.npc('kata'); if (A.S.yardOpen) return A.m('Es ist offen.'); if (closedNow(A.G)) return K.say('Nicht jetzt.');
     if (A.flag('k3.v.part1')) return openYard(A,K); await K.say(A.cycle('ktYard',['Das bleibt zu. Papa mag nicht, dass einer hinten herumläuft.','Da hinten ist nur der alte Laster. Und Papa, wenn er schlechte Laune hat.'])); },
   use:function(A){ return A.room.byId.yard_door.open(A); },
   g:{look:async function(A){ await A.g('Durch das Wellblech sehe ich den Hof. Und etwas Großes unter einer Plane.'); await A.g(A.flag('k3.v.cab')?'Unser Lastwagen.':'Es ist dunkel da drunter. Für mich nicht.'); }}},
 {id:'vlado',npc:'vlado',name:'Vlado',hgt:46,vis:function(S,G){ return vladoHere(G); },talk:talkVlado,
   look:function(A){ var p=A.G.phase; if (p==='k3_d2') return A.m('Vlado steht an der Maschine und arbeitet nicht. Er raucht und sieht zum Schreibtisch hinüber, wo die Zeichnung liegt.');
     if (A.flag('k3.v.free')) return A.m('Vlado, ohne Zigarette. Er sieht aus wie jemand, der eine Last abgestellt hat und nicht weiß, wohin mit den Armen.');
     return A.m('Ein großer hagerer Mann im blauen Overall, gebeugt über eine Montiermaschine. Graue Stoppeln, tiefe Falten, die Hände schwarz vom Gummi. Die Zigarette im Mundwinkel wippt, wenn er hustet.'); },
   give:{ pismo:function(A){ return veraLetter(A,A.npc('vlado')); }, putni_nalog:function(A){ return logShown(A,A.npc('vlado')); }, vreca:function(A){ return sackShown(A,A.npc('vlado')); }, kaseta:'Vlado: „Die Kassette. Sie hat sie reingeschoben und laut gestellt. Ich habe leiser gestellt. Dreimal.“', odvijac:'Vlado: „Meiner. Legen Sie ihn hin, wo er war.“', akumulator:'Vlado: „Eine Batterie. Geben Sie sie Kata. Kata macht den Laster.“', vaga:'Vlado: „Eine Waage. Für Eier. Hier wiegt man Reifen.“', photo_full:async function(A){ var V=A.npc('vlado'); await V.say('Das ist ein Kind.'); await A.wait(600); if (!A.flag('k3.v.part1')) await V.say('Ich kenne keine Kinder. Ich kenne Reifen.'); else await V.say('Mit siebzehn hatte sie denselben Zopf.'); },
     km:'Vlado: „Für einen Reifen ist das zu wenig. Für nichts ist es zu viel.“', plan:'Vlado: „Ich brauche keinen Plan. Ich weiß, wo die Straßen sind.“', rueckfahrt:'Vlado: „Sarajevo.“ Er sieht lange auf die Karte. „Da wollte sie hin.“' },
   g:{look:function(A){ if (A.flag('k3.v.free')) return A.g('Er ist leiser innen. Zum ersten Mal.'); return A.g(A.flag('k3.v.cab')?'Er ist alt geworden. Die Zigarette nicht.':'Seine Hände. Ich kenne die Hände.'); },
     listen:function(A){ var p=A.G.phase; if (p==='k3_d1') return A.g('Er denkt an nichts. Ganz fest an nichts.'); if (p==='k3_d2' && !A.flag('k3.v.part1')) return A.g('Er sagt in sich hinein: morgen, morgen. Als müsste er es auswendig lernen.'); if (!A.flag('k3.v.part2')) return A.g('Er zählt Schrauben. Halblaut. Wie einer, der nicht denken will.'); return A.g('Er sagt immer wieder: um zwei. Um zwei.'); },
     sense:'An seinen Händen ist Kälte. Alte Kälte, von einer Nacht, in der er gewartet hat.'}},
 {id:'kata',npc:'kata',name:'Kata',hgt:40,talkDist:30,vis:function(S,G){ return day(G); },talk:talkKata,
   look:'Eine junge Frau im Büro hinter der Glaswand. Kurzes dunkelblondes Haar, an der Seite länger, schwarze Fleecejacke mit „RAJIĆ“ auf der Brust. Sie tippt schneller, als ihr Bildschirm mitkommt.',
   give:{ akumulator:function(A){ return batteryToKata(A); }, odvijac:function(A){ A.take('odvijac'); A.rebuild(); return A.npc('kata').say('Danke. Dann fehlt heute Abend keiner.'); }, putni_nalog:'Kata: „Das Fahrtenbuch. Behalten Sie es, bis Sie mit ihm geredet haben. Dann gebe ich es ihm zurück. Oder er holt es sich.“', pismo:'Kata: „Von Tante Vera? Geben Sie ihn ihm selbst. Von mir nimmt er nichts, was von ihr kommt.“', photo_full:'Kata: „Wer ist das? Ein Kind mit Zopf. Und ein kleiner Junge mit Ohren.“', km:'Kata: „Wir nehmen auch Mark. Für Reifen.“' },
   g:{look:'Sie ist wütend auf ihn, seit sie zwölf ist. Sie weiß nicht, worauf genau.',listen:'Sie schreibt eine E-Mail, löscht sie und schreibt sie wieder. Dieselbe.'}},
 {id:'desk',name:'Schreibtisch',look:function(A){ return deskLook(A); },read:function(A){ return readDrawing(A); },take:async function(A){ if (A.S.drawerOpen) return A.m('Die Zeichnung und der Schlüssel gehören ihm. Ich nehme sie nicht. Er soll sie nehmen.'); return A.m('Nichts, was mir gehört.'); },
   open:'Drei Schubladen, drei Schlösser.',
   g:{look:function(A){ return malaDrawer(A,0); },sense:async function(A){ if (!A.S.drawerOpen) return A.g('Er hat siebzehn Jahre an diesem Tisch gesessen und nie die unterste Schublade aufgemacht.'); return A.g('Die Zeichnung riecht noch nach dem Führerhaus. Nach Diesel und nach mir.'); }}},
 {id:'drawer1',name:'Obere Schublade',look:'Die oberste von drei Schubladen, mit Schloss. Eine Ecke Papier klemmt im Spalt.',open:function(A){ return drawerUse(A,1); },use:function(A){ return drawerUse(A,1); },g:{look:function(A){ return malaDrawer(A,1); }}},
 {id:'drawer2',name:'Mittlere Schublade',look:'Die mittlere Schublade. Abgeschlossen. Der Griff ist abgegriffen, als würde sie oft benutzt.',open:function(A){ return drawerUse(A,2); },use:function(A){ return drawerUse(A,2); },g:{look:function(A){ return malaDrawer(A,2); }}},
 {id:'drawer3',name:'Untere Schublade',look:function(A){ return A.m(A.S.drawerOpen?'Die unterste Schublade steht offen.':'Die unterste Schublade. Abgeschlossen. Am Griff liegt Staub, als hätte sie seit Jahren keiner angefasst.'); },open:function(A){ return drawerUse(A,3); },use:function(A){ return drawerUse(A,3); },g:{look:function(A){ return malaDrawer(A,3); }}},
 {id:'tires',name:'Reifen',look:'Reifen, gestapelt bis unter die Decke: neu, alt, abgefahren, mit Kreidezeichen darauf. Es riecht nach Gummi.',take:'Ich nehme keinen Reifen. Ich habe kein Auto.',use:'Ich setze mich nicht auf fremde Reifen. Auch wenn sie bequem aussehen.',
   g:{look:'Die alten riechen nach Straßen, die es nicht mehr gibt.'}},
 {id:'machine',name:'Montiermaschine',look:function(A){ return A.m((A.has('odvijac')?'Die Montiermaschine, darauf ein Rad.':'Die Montiermaschine, darauf ein Rad. Auf dem Rand liegt ein Schraubenzieher mit rotem Griff.')+' Vlado hebelt den Reifen von der Felge, als hätte er nie etwas anderes getan.'); },
   take:async function(A){ var K=A.npc('kata'); if (A.has('odvijac')) return A.m('Den habe ich schon.'); if (!A.flag('k3.v.yard')) return A.m('Vlados Werkzeug. Ich nehme nichts, solange ich hier nur Besucher bin.'); await A.m('Der Schraubenzieher. Kata?'); await K.say('Nehmen Sie. Bringen Sie ihn zurück. Papa zählt sie, jeden Abend.'); A.give('odvijac'); A.rebuild(); A.sfx('click'); },use:'Ich fasse keine Maschine an, die schneller ist als ich.',
   g:{look:'Seine Hände wissen, was sie tun. Der Rest von ihm nicht.'}},
 {id:'compressor',name:'Kompressor',look:'Ein roter Kompressor mit einem Schlauch, der sich durch die halbe Werkstatt schlängelt. Er zittert, wenn er anspringt.',use:async function(A){ A.sfx('compressor'); await A.m('Ich drücke nichts. Er springt von selbst an und erschreckt mich trotzdem.'); },
   g:{look:'Er atmet. Wie ein Tier, das schläft und schlecht träumt.'}},
 {id:'calendar',name:'Kalender',look:'Ein Werkstattkalender: Reifen vor Bergen, November 2011. Daneben, an einem Nagel, ein zweiter, viel älterer, ohne Bild. Das oberste Blatt ist ein Januar. Das Jahr ist abgerissen.',take:'Den nimmt hier keiner ab. Das sieht man.',
   g:{look:'Er hat ihn nie abgenommen. Er sieht ihn auch nie an.'}},
 {id:'window',name:'Fenster',look:function(A){ var t=A.R('vhof').tarpOff; return A.m(t?'Durch das Fenster: der TAM im Hof, ohne Plane.':'Ein Fenster nach hinten. Draußen im Hof eine olivgrüne Plane, mit Seilen festgezurrt. Darunter die Form eines Lastwagens.'); },open:'Es klemmt. Und draußen ist es kalt.',
   g:{look:function(A){ return A.g(A.flag('k3.v.cab')?'Unser Lastwagen.':'Da draußen, unter der Plane. Etwas, das ich kenne.'); }}},
 {id:'ashtray',name:'Aschenbecher',look:'Ein Aschenbecher aus einer Radkappe, voll bis zum Rand. Eine Zigarette brennt darin. Keiner raucht sie.',take:'Nein. Nicht einmal die Kippen.',
   g:{look:'Er raucht, damit er nicht reden muss.'}}
];
M.room('vulkanizer',{ name:'Vulkanizer Rajić', scape:'k3_vulkanizer',
  music:function(G){ return closedOnLoad(G)?'':'k3_istraga'; },
  state:function(G){ return {closed:false,yardOpen:false,drawerOpen:false}; },
  actors:function(S,G){ var L=[]; LOADING=true; S.closed=closedOnLoad(G); S.drawerOpen=F(G,'k3.v.drawer'); S.yardOpen=yardOpen(G);
    var here=vladoHere(G); LOADING=false;
    if (here){ var v=M.apos('vulkanizer','vlado',[116,111,'L']), d2=G.phase==='k3_d2'&&!F(G,'k3.v.part1'), quiet=F(G,'k3.v.free');
      L.push({id:'vlado',ch:'vlado',x:v[0],y:v[1],f:v[2]||'L',name:'Vlado',idle:quiet?'quiet':(d2?'smoke':'work'),speechY:46,
        routine:quiet?[['idle','quiet',8,14],['face','R',2,4],['idle','quiet',6,10]]:(d2?[['idle','smoke',8,14],['anim','cough'],['idle','smoke',6,10]]:[['idle','work',8,14],['anim','cough'],['idle','work',6,10],['idle','smoke',4,7],['idle','work',8,12]])}); }
    if (day(G)){ var k=M.apos('vulkanizer','kata',[340,114,'L']); L.push({id:'kata',ch:'kata',x:k[0],y:k[1],f:k[2]||'L',name:'Kata',idle:'type',talk:'sitTalk',speechY:40,routine:[['idle','type',10,16],['idle','sitPhone',3,5],['idle','type',8,12]]}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (p==='k3_d1' && A.first('vuD1')){ await A.narrate('Eine Reifenwerkstatt aus Wellblech und Ziegeln. Es riecht nach Gummi, Öl und Zigaretten. Ein Radio spielt etwas, das keiner hört.'); }
    if (F(G,'k3.v.angry') && !closedNow(G) && !F(G,'k3.v.drawer') && A.first('vuReopen')){ var K=A.npc('kata'); await K.say('Er ist wieder vorn. Drei Reifen hat er geflickt. Das reicht meistens.'); await A.wait(400); await K.say('Fragen Sie ihn nicht nach der Mutter. Fragen Sie ihn gar nichts. Fragen Sie mich.'); }
    if (p==='k3_d2' && A.first('vuD2')){ await A.narrate('Samstag. Die Montiermaschine steht still. Vlado arbeitet nicht. Er raucht und sieht auf seinen Schreibtisch, wo die Zeichnung liegt und der Schlüssel.'); }
    if (p==='k3_d3' && A.first('vuD3')){ await A.narrate('Sonntag. Die Werkstatt ist zu, aber die Tür ist offen. Kata sitzt im Büro. Vlado wechselt einen Reifen, der keinen Wechsel braucht.'); }
    if (p==='k3_d3' && F(G,'k3.d3.talk2') && !F(G,'k3.v.free') && A.first('vuBack')){ await A.narrate('Vlado ist wieder vorn. Er steht an der Maschine und tut nichts.'); } }
});
})(M);
