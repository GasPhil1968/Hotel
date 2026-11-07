/* ===== rooms/gleis11.js — Hauptbahnhof, Gleis 11: am Prellbock Sepp, ein Geist in Gepäckträgeruniform („Mi chiamo Peppino.“),
   der Kiosk mit der Kioskfrau („A Urmünchner.“), die Luke zum Bunker (nur Mala), die Tür zur Bahnhofsmission.
   Hier geschieht: Mala findet Sepp, Markos erstes Gespräch (s4_peppino), sein Name (s4_bitte), der falsche Brief, der Anruf bei Carmela
   (M.K4PHONE.carmela) und die Schwelle. Vorgaben: game/K4_SPEC.md §8–§12, KAPITEL4_KONZEPT.md 7.1 und 4.6 ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
var DAYS=['k4_d1','k4_d2','k4_d3'], NOTICE=['k4_d2','k4_d3','k4_d4','k4_d5'];
// Sepp wartet vom Christtag bis zu seinem Übergang am Prellbock
function seppHere(G){ return DAYS.indexOf(G.phase)>=0 && !F(G,'k4.s.crossed'); }
M.k4SeppHere=seppHere;
function seen(A){ return seppHere(A.G) && A.isFound('sepp'); }
function rid(A){ return A.room?A.room.id:''; }
function here(A){ return !!(A.G.malaOn && A.G.pos.mala.room===rid(A)); }          // Mala ist in diesem Raum (gespielt oder nicht)
function markoHere(A){ return A.G.pos.marko.room===rid(A); }
function alone(A){ return A.G.active==='mala' && !markoHere(A); }                    // Mala allein: Marko ist woanders
function seppName(S,G){ if (N(G,'s4_name')) return 'Giuseppe'; if (N(G,'s4_peppino')) return 'Peppino'; return '???'; }
// eine Frage mit dem Notizbuch (K4: die gültigen Antworten stehen in also)
function askOpt(title,also,table,fb){ return {t:'Nach etwas aus dem Notizbuch fragen …',silent:true,noGray:true,go:async function(A){
  var id=await A.askNote(title,{also:also}); if (!id) return; var h=table[id]; if (h===undefined) h=fb; if (typeof h==='function') return await h(A,id); }}; }

// ---------------------------------------------------------------- Mala findet Sepp
async function seppFind(A){ var G=A.G, Sp=A.npc('sepp'); if (A.isFound('sepp')||!seppHere(G)) return;
  if (alone(A)){
    await A.wait(600); await A.g('Hier.'); await A.wait(500); await A.g('Hier zieht es. Wie an einem Faden, der nicht meiner ist.');
    A.found('sepp'); A.setFlag('k4.s.found'); A.music('k4_sepp'); await A.wait(800);
    await A.narrate('Am Ende des Bahnsteigs, beim Prellbock, steht ein alter Mann in einer blauen Uniformjacke. Eine Mütze mit Messingschild, der Rücken gerade wie ein Signalmast.');
    await A.narrate('Er geht den Reisenden entgegen, zeigt auf ihre Koffer, tippt an den Mützenschirm. Keiner bleibt stehen. Einer geht durch ihn hindurch.');
    await Sp.say('Facchino! Valigia, signorina? Koffer? Tragen?'); await A.wait(500);
    await Sp.say('Ah. Sie ham ja nix. Brava. Mit nix reist ma am leichtesten.');
    await A.wait(700); await A.g('Er redet drei Sprachen auf einmal. Und keine davon für mich.');
    await A.wait(500); await A.g('Auf seiner Mütze steht siebzehn.'); await A.wait(400); await A.g('Siebzehn. Wie ich, als ich aufgehört habe.');
    await A.wait(700); await A.g('Marko muss ihn hören. Marko versteht so etwas.'); return; }
  if (markoHere(A)){ await A.m('Mein Kopf.'); await A.wait(400); }
  await A.g('Marko. Warte.'); await A.wait(600); await A.g('Am Ende vom Bahnsteig. Beim Prellbock.');
  A.found('sepp'); A.setFlag('k4.s.found'); A.setFlag('k4.s.told'); if (Sp.actor) Sp.actor.fadeIn=A.gt; A.music('k4_sepp'); await A.wait(1100);
  await A.narrate('Wo eben nur der Prellbock war, steht ein alter Mann in einer blauen Uniformjacke. Eine Mütze mit Messingschild, die Siebzehn darauf. Er hält sich so gerade, als hätte er es so gelernt und nie wieder verlernt.');
  await Sp.say('Facchino! Valigia, signore?');
  if (markoHere(A)){ await A.wait(400); await A.m('Der Druck hinter meinen Augen ist weg. Einfach weg.'); }
  await A.g('Er bietet jedem an, die Koffer zu tragen. Keiner sieht ihn.'); await A.wait(400); await A.g('Siebzehn. Wie ich, als ich aufgehört habe.'); }
M.k4SeppFind=seppFind;
// Mala hat ihn allein gefunden; jetzt steht Marko mit ihr am Gleis
async function toldHere(A){ var G=A.G; if (F(G,'k4.s.told')) return; A.setFlag('k4.s.told');
  await A.g('Da bist du.'); await A.wait(400); await A.g('Am Prellbock. Siehst du ihn?'); await A.m('Jetzt ja.');
  await A.narrate('Am Prellbock steht ein alter Mann in einer blauen Uniformjacke, eine Mütze mit Messingschild. Er tippt an den Schirm, wenn einer vorbeigeht. Keiner sieht es.');
  await A.m('Und der Druck in meinem Kopf ist weg.'); await A.g('Er redet drei Sprachen. Ich verstehe keine.'); await A.m('Mal sehen, ob ich eine verstehe.'); }
// Mala kommt aus dem Bunker herauf, und Marko steht am Gleis
async function bunkerTell(A){ if (A.flag('k4.s.bunkerTold')) return; A.setFlag('k4.s.bunkerTold');
  await A.g('Marko. Unter dem Gleis ist ein Gang. Mit einem Tisch.'); await A.wait(400);
  await A.g('Da sitzt einer mit einem Stempel und fragt einen Jungen nach dem Namen. Den Namen verstehe ich nicht. Dschu… Dschusep…');
  await A.m('Giuseppe?'); await A.g('So ähnlich. Und der Mann sagt: „Das schreibt keiner. Josef.“ Und „Rugiero, ein G reicht.“');
  await A.wait(500); await A.g('Und der Junge sagt: „Sì, sì. Josef.“');
  await A.wait(700); await A.m('Sì heißt ja. Er hat ja gesagt. Zu einem Namen, der nicht seiner war.'); }
M.k4BunkerTell=bunkerTell;

// ---------------------------------------------------------------- Markos erstes Gespräch mit Sepp (s4_peppino)
async function seppMeet(A){ var Sp=A.npc('sepp'), G=A.G; if (F(G,'k4.s.talk')) return;
  await Sp.say('Facchino, signore? Valigia? Porto io.'); await A.wait(500); await A.m('Non ho valigie.');
  Sp.agitate(1800); await A.wait(700); await Sp.say('Lei … mi sente?'); await A.m('Sì.');
  await A.wait(600); await Sp.say('Mamma mia. Dieci giorni che parlo, e nessuno mi sente.');
  if (here(A)){ await A.g('Was sagt er?'); await A.m('Zehn Tage redet er schon. Und keiner hört ihn.'); }
  else await A.m('Zehn Tage, sagt er. Zehn Tage redet er, und keiner hört ihn.');
  await A.wait(500); await Sp.anim('cap'); await Sp.say('Peppino. Facchino numero diciassette.');
  await A.wait(400); await Sp.say('Devo scrivere la lettera di gennaio. Ogni mese una lettera, quarantanove anni. Mai saltato un mese.');
  await A.narrate('Er hebt die Hand, als hielte er einen Stift. Die Finger schließen sich um nichts.'); await Sp.say('Ma la penna non la tengo più.');
  await A.m('Peppino. Gepäckträger Nummer siebzehn. Er muss den Brief vom Januar schreiben, wie jeden Monat seit neunundvierzig Jahren. Aber er kann keinen Stift mehr halten.');
  A.note('s4_peppino'); A.setFlag('k4.s.talk'); A.setFlag('k4.s.told');
  if (here(A)){ await A.wait(500); await A.g('Neunundvierzig Jahre. Jeden Monat.'); await A.g('Das ist länger, als ich gelebt habe. Fast dreimal.'); } }

// ---------------------------------------------------------------- Sein Name (s4_bitte)
async function nameReturn(A){ var Sp=A.npc('sepp'), G=A.G; if (N(G,'s4_bitte')) return Sp.say('Giuseppe. Sì. Adesso scriva.');
  A.music('k4_duh'); await A.m('Giuseppe Ruggiero.'); Sp.agitate(3200); await A.wait(900); await Sp.say('Come?');
  await A.m('Giuseppe Ruggiero. Con due g.'); await A.wait(1200);
  await A.narrate('Er nimmt die Mütze ab. Darunter ist sein Haar weiß und sehr kurz, als hätte er es heute Morgen schneiden lassen.');
  await Sp.say('Giuseppe.'); await A.wait(800); await Sp.say('Nessuno mi chiama così da quarantanove anni. L’ultima è stata mia madre, alla stazione di Potenza. „Giuseppe, scrivi.“');
  await A.m('So hat ihn seit neunundvierzig Jahren keiner genannt. Zuletzt seine Mutter, am Bahnhof von Potenza. „Giuseppe, schreib.“');
  if (here(A)){ await A.wait(500); await A.g('Er ist heller geworden. Nur ein bisschen. Wie ein Fenster, wenn drinnen einer das Licht anmacht.'); }
  await A.wait(700); await Sp.anim('cap'); await Sp.say('Adesso scriva. Cara Carmela, sto bene.'); A.note('s4_bitte');
  await A.m('„Jetzt schreiben Sie. Liebe Carmela, mir geht es gut.“'); await A.wait(400); await A.m('Carmela?');
  await Sp.say('Mia sorella. Ogni mese: sto bene, il lavoro va bene, qui fa freddo ma ho il cappotto.'); await A.m('Seine Schwester. Jeden Monat: Mir geht es gut, die Arbeit geht gut, hier ist es kalt, aber ich habe den Mantel.');
  A.music('k4_sepp'); }

// ---------------------------------------------------------------- Der falsche Brief (Fehlweg mit eigener Antwort)
async function fakeLetter(A){ var Sp=A.npc('sepp'), G=A.G; if (F(G,'k4.s.fake')) return A.m('Ich habe ihn geschrieben. Er liegt in meiner Tasche, ohne Unterschrift.');
  if (!A.has('olovka')) return A.m('Ich habe keinen Stift dabei.');
  var c;
  if (here(A)){ await A.g('Nein.'); await A.m('Mala.'); await A.wait(400);
    await A.g('Ich war die, die „Sagt es keinem“ gesagt hat. Ich weiß, was das kostet. Ich helfe nicht bei noch einem.');
    await A.m('Du hast selbst gesagt: Sagt es keinem.'); await A.wait(600); await A.g('Ja. Und es war falsch.');
    c=await A.choose([{t:'(Trotzdem schreiben.)',id:'yes',silent:true},{t:'(Nicht schreiben.)',id:'no',silent:true}],{title:'Der Brief'}); }
  else { await A.m('Mala würde nein sagen. Ich weiß, wie sie es sagen würde.');
    c=await A.choose([{t:'(Schreiben.)',id:'yes',silent:true},{t:'(Nicht schreiben.)',id:'no',silent:true}],{title:'Der Brief'}); }
  if (c!=='yes'){ await A.m('Nicht so. Nicht heute.'); await Sp.say('Allora aspetto. Sono bravo ad aspettare.'); await A.m('Dann wartet er. Warten kann er gut, sagt er.'); return; }
  await A.narrate('Ich reiße eine Seite aus meinem Notizbuch und lege sie auf die Bank. Er diktiert, und ich schreibe.');
  await Sp.say('Cara Carmela, sto bene. Il lavoro va bene.'); await A.wait(400); await Sp.say('A Monaco fa un freddo cane, ma ho il cappotto buono.');
  await A.wait(400); await Sp.say('No! Non „cane“. Lo cancelli. Carmela non vuole le parolacce.'); await A.m('Ich streiche den Hund. Carmela mag keine Schimpfwörter.');
  await Sp.say('Saluti a Rosa. Tuo fratello …'); await A.wait(900);
  await A.narrate('Mein Stift bleibt über der letzten Zeile stehen.'); await A.m('Und dann? Wessen Namen schreibe ich drunter?');
  await Sp.say('Il mio.'); await A.wait(600); await A.m('Ich habe viel übersetzt. Unterschrieben habe ich nur für mich.');
  A.give('brief_falsch'); A.setFlag('k4.s.fake');
  await A.wait(700); await Sp.say('Senza firma.'); await A.wait(600); await Sp.say('E a febbraio? Lei viene a febbraio, vero? E a marzo.');
  await A.m('Im Februar. Im März. Jeden Monat einen, für einen Toten, ohne Unterschrift.');
  if (here(A)){ await A.wait(500); await A.g('Siehst du.'); await A.wait(400); await A.g('Er wartet jetzt eben auf den Februar.'); }
  await Sp.say('Grazie lo stesso.'); }

// ---------------------------------------------------------------- Der Anruf bei Carmela (M.K4PHONE.carmela)
async function carmelaCall(A){ var G=A.G, Sp=A.npc('sepp'), mh=here(A), tone=null, CAR={lied:false,dead:false};
  var lk=G.flags['mala.lock']; G.flags['mala.lock']=true;
  try{ A.music('k4_sepp');
    var bf=M.stand('gleis11','buffer'); if (bf) await A.walkM(bf[0]-10,bf[1]+4);
    await A.narrate('Ich stelle mich neben den Prellbock. Peppino sieht auf mein Telefon, als wäre es ein Koffer, den einer stehen gelassen hat.');
    await Sp.say('Chi chiama?'); await A.m('Casa sua.'); Sp.agitate(1800); await Sp.say('No … nessuno deve telefonare. Nessuno!');
    if (mh){ await A.g('Bleib. Hör zu.'); await A.wait(500); await Sp.say('Is scho recht, Madl. Is scho recht.'); await A.g('Ich habe kein Wort verstanden. Aber er bleibt.'); }
    else { await A.m('Hören Sie einfach zu. Nur zuhören.'); await Sp.anim('turn'); }
    A.sfx('dial'); await A.wait(2200);
    await A.phoneVoice('„Pronto?“','rosa'); await A.m('Buongiorno. Parlo con la famiglia Ruggiero? Mi chiamo Marko Vuković. Chiamo da Monaco.');
    await A.wait(600); await A.phoneVoice('„Da Monaco?“','rosa'); await A.wait(500); await A.phoneVoice('„Sono Rosa. La nipote. Chi cerca?“','rosa');
    await A.m('Rosa, die Enkelin. Sie fragt, wen ich suche.'); await A.m('La signora Carmela.'); await A.phoneVoice('„La nonna? Di che si tratta?“','rosa');
    // die drei Einstiege (Konzept 7.1, A4)
    for (var guard=0;guard<4 && !tone;guard++){
      var o=[{t:'„Ihr Bruder ist gestorben.“',id:'hard'}];
      if (!CAR.lied) o.push({t:'„Ihr Bruder lässt grüßen.“',id:'lie'});
      o.push({t:'„Ich habe seine Briefe gelesen. Und Ihre.“',id:'letters'});
      var c=await A.choose(o,{title:'Rosa'});
      if (c==='lie'){ CAR.lied=true; await A.m('Suo fratello la saluta.');
        if (mh){ await A.wait(400); await A.g('Marko.'); await A.g('Ich verstehe kein Wort. Aber ich kenne dein Gesicht, wenn du lügst.'); }
        await A.phoneVoice('„Lo zio Peppino? Ci scrive ogni mese. Lei è un suo amico?“','rosa'); await A.m('Onkel Peppino, sagt sie. Er schreibt jeden Monat. Ob ich ein Freund bin.');
        await A.wait(500); await A.m('Nicht so. Nicht mit noch einer Lüge.'); continue; }
      tone=c; }
    if (tone==='hard'){ await A.m('Suo fratello … Giuseppe. È morto.'); await A.wait(900);
      await A.phoneVoice('„Cosa? … Ma lei chi è? Come si permette, così, al telefono?“','rosa'); await A.m('Wer ich bin, fragt sie. Wie ich mir das erlauben kann, so, am Telefon.');
      await A.phoneVoice('„Io riattacco.“','rosa'); await A.wait(700); await A.phoneVoice('„Rosa. Dammi il telefono.“','carmela');
      await A.m('Eine zweite Stimme, weiter weg. Älter. „Rosa. Gib mir das Telefon.“'); }
    else { await A.m('Ho letto le lettere di suo fratello. E le sue.'); await A.wait(1400);
      await A.phoneVoice('„…“','rosa'); await A.phoneVoice('„Nonna. È per te. Uno di Monaco. Ha letto le lettere.“','rosa'); await A.m('Sie ruft ihre Großmutter. Einer aus München. Er hat die Briefe gelesen.'); }
    await A.wait(1200); await A.phoneVoice('„Pronto. Sono Carmela.“','carmela');
    Sp.agitate(2400); await A.wait(400); await Sp.say('Carmela.'); if (mh) await A.g('Er zittert.');
    if (tone==='hard'){ await A.phoneVoice('„Ho sentito. È morto.“','carmela'); await A.m('Sì. Il sedici dicembre. Di freddo. Mi dispiace.'); await A.wait(1500); await A.phoneVoice('„Il sedici.“','carmela'); CAR.dead=true; }
    else { await A.phoneVoice('„Ha letto le lettere.“','carmela'); await A.m('Sì.'); await A.phoneVoice('„Allora sa.“','carmela'); }
    await A.wait(900); await A.phoneVoice('„Lo sapevo. Da trent’anni.“','carmela'); await A.m('Sie hat es gewusst. Seit dreißig Jahren.');
    Sp.agitate(2600); await A.wait(500); await Sp.say('Sapeva?');
    // Was sie wusste, und dass er tot ist
    var asked={};
    for (var g2=0;g2<4;g2++){ var q=[];
      if (!asked.since) q.push({t:'„Seit neunzehnhundertneunundsiebzig?“',id:'since'});
      if (!asked.what) q.push({t:'„Was haben Sie gewusst?“',id:'what'});
      if (!CAR.dead) q.push({t:'„Er ist tot. Am sechzehnten Dezember.“',id:'dead'});
      if (!q.length || (asked.since||asked.what) && CAR.dead) break;
      var a=await A.choose(q,{title:'Carmela'});
      if (a==='dead'){ CAR.dead=true; await A.m('È morto. Il sedici dicembre. Di freddo.'); await A.wait(2000);
        await A.phoneVoice('„Il sedici.“','carmela'); await A.wait(700); await A.phoneVoice('„A gennaio non sarebbe arrivata la lettera. Così l’avrei saputo.“','carmela');
        await A.m('Im Januar wäre kein Brief gekommen. So hätte sie es erfahren.'); continue; }
      asked.since=asked.what=true;
      if (a==='since') await A.m('Dal settantanove?'); else await A.m('Che cosa sapeva?');
      await A.phoneVoice('„Agosto settantanove. Mio marito aveva un cugino a Monaco. Siamo venuti in treno.“','carmela');
      await A.phoneVoice('„Alla stazione l’ho visto. Con la divisa. Portava le valigie di una signora tedesca. Dritto, come papà.“','carmela');
      await A.m('August neunundsiebzig. Sie war mit ihrem Mann in München. Am Bahnhof hat sie ihn gesehen, in Uniform, mit den Koffern einer deutschen Dame. Gerade wie ihr Vater.');
      await A.phoneVoice('„Non l’ho chiamato. Se mi vedeva, si vergognava. E io non volevo che si vergognasse.“','carmela'); await A.m('Sie hat ihn nicht gerufen. Er hätte sich geschämt. Und das wollte sie nicht.');
      await A.phoneVoice('„A casa gli ho scritto: ti ho visto con le valigie. Pensavo che capisse.“','carmela');
      await A.wait(500); await Sp.say('Con le valigie …'); await A.wait(700); await Sp.say('Io pensavo … la partenza. Sessantadue. Le due valigie alla stazione di Potenza.');
      if (mh) await A.m('Er hat gedacht, sie meint seine Abfahrt. Zweiundsechzig, mit zwei Koffern.'); else await A.m('Er hat gedacht, sie meint seine Abfahrt. Neunzehnhundertzweiundsechzig.');
      await A.phoneVoice('„E poi ho scritto: anche io sto bene. Non era vero neanche quello. Mai del tutto.“','carmela'); await A.m('Und dann hat sie geschrieben: Auch mir geht es gut. Das war auch nicht wahr. Nie ganz.'); }
    var t=await A.choose([{t:'„Er hört zu.“',id:'hears'},{t:'(Das nicht sagen.)',id:'quiet',silent:true}],{title:'Carmela'});
    if (t==='hears'){ await A.m('Signora … lui la sente. Adesso.'); await A.wait(1200); await A.phoneVoice('„Lo so. Ha sempre sentito tutto. Anche quello che non scrivevo.“','carmela');
      await A.m('Sie weiß es, sagt sie. Er hat immer alles gehört. Auch das, was sie nicht geschrieben hat.'); await Sp.anim('cap'); }
    else await A.wait(900);
    await A.phoneVoice('„Lo voglio a casa. Che torni. Anche piccolo così.“','carmela'); await A.m('Sie will ihn nach Hause holen. Auch so klein.');
    await A.m('La città … ci penso io. Glielo prometto.'); await A.wait(500);
    await A.phoneVoice('„Rosa! Vieni. Il signore ha bisogno delle carte.“','carmela'); await A.wait(600);
    await A.phoneVoice('„Ich … spreche ein bisschen Deutsch. Von der Schule. Ich schicke ein Fax. Für die Stadt. Heute.“','rosa'); await A.m('Danke, Rosa.');
    await A.phoneVoice('„Signor Marko. Gli dica …“','carmela'); await A.wait(1300); await A.phoneVoice('„No. Niente. Lo sa.“','carmela');
    A.sfx('hangup'); A.setFlag('k4.s.call');
    await A.wait(1400); await Sp.say('Lo sapeva.'); await A.wait(800); await Sp.say('Trent’anni.'); await A.wait(900);
    await A.narrate('Er lacht. Leise zuerst, dann mit dem ganzen geraden Rücken.'); await Sp.say('Ja mei.'); await A.wait(500);
    await Sp.say('Quarantanove anni sto bene. E lei pure.'); await A.wait(600); await Sp.say('Allora la lettera di gennaio non serve più.');
    await A.m('Neunundvierzig Jahre geht es ihm gut. Und ihr auch. Dann braucht es den Brief vom Januar nicht mehr.');
    Sp.idle('carry'); A.music('k4_duh');
    if (mh){ await A.wait(700); await A.g('Marko. Er lässt los.'); await A.wait(400); await A.switchTo('mala'); await A.wait(400);
      await A.g('Peppino. Ich kann dich hinüberbringen. Es ist nicht weit.'); await Sp.say('Hinüber? Mit’m Zug?'); await A.wait(400); await A.g('Ich habe dich nicht verstanden. Aber ich glaube, du hast ja gesagt.'); }
    else { await A.wait(700); await A.m('Er lässt los. Ich sehe es an seinen Händen.'); await A.m('Jetzt braucht er Mala. Ohne sie geht er nirgends hin.'); }
  } finally { G.flags['mala.lock']=lk; } }
// das Handy: Carmela. Nur am Gleis, bei ihm, und erst wenn wir wissen, was sie weiß
M.K4PHONE.carmela=async function(A){ var G=A.G;
  if (F(G,'k4.s.crossed')){ A.sfx('dial'); await A.wait(1400);
    if (G.phase==='k4_d3'){ await A.phoneVoice('„Pronto? … Ah, il signore di Monaco. La nonna è in cucina. Piange e ride. Tutt’e due insieme.“','rosa'); await A.m('Rosa. Die Nonna sitzt in der Küche, sagt sie. Sie weint und lacht. Beides zugleich.'); }
    else { await A.phoneVoice('„Pronto? Signor Marko! La nonna ha arieggiato la sua camera. Per quando arriva.“','rosa'); await A.m('Rosa. Die Nonna hat sein Zimmer gelüftet, sagt sie. Für wenn er ankommt.'); }
    A.sfx('hangup'); return; }
  if (F(G,'k4.s.call')) return A.m('Wir haben alles gesagt. Jetzt ist er dran.');
  if (!N(G,'s4_wusste')){ if (!N(G,'s4_brief79')) return A.m('Pietrafonda Nuova. Ich wähle und lege wieder auf, bevor es klingelt. Was sage ich ihr? Dass ihr Bruder neunundvierzig Jahre gelogen hat? Erst will ich wissen, was sie ihm geschrieben hat.');
    if (!N(G,'s4_carmela_hall')) return A.m('Der kurze Brief von neunundsiebzig. Was darin steht, verstehe ich. Was er bedeutet, noch nicht.');
    return A.m('Ein Brief, eine Frau, die beim Schreiben weint. Das gehört zusammen. Erst will ich es zu Ende denken.'); }
  if (!N(G,'s4_bitte')) return A.m('Erst muss er seinen Namen hören. Von mir. Dann rufe ich seine Schwester an.');
  if (rid(A)!=='gleis11' || !seen(A)) return A.m('Nicht von hier. Wenn ich sie anrufe, dann bei ihm, am Gleis. Er soll ihre Stimme hören.');
  return carmelaCall(A); };

// ---------------------------------------------------------------- Sepp (mit Marko)
var SEPP_ALSO=['s4_name','s4_ausweis','s4_bunker','s4_umschlag','s4_enzo','s4_fluch','s4_bairisch','s4_tarnung','s4_derselbe','s4_termin','s4_brief79','s4_wusste','s4_genommen'];
async function talkSepp(A){ var Sp=A.npc('sepp'), G=A.G;
  if (!A.isFound('sepp')) return A.m('Am Prellbock ist es kälter als anderswo.');
  if (!F(G,'k4.s.talk')){ await seppMeet(A); if (await M.k4DayCheck(A)) return; }
  if (F(G,'k4.s.call')){ await Sp.say(A.cycle('spGo',['Lo sapeva. Trent’anni. Ja mei.','Is scho recht. I wart auf’s Madl.'])); if (here(A)) await A.g('Er wartet auf mich.'); return; }
  var table={
    s4_name:function(A){ return nameReturn(A); },
    s4_ausweis:async function(A){ Sp.agitate(1400); await A.m('Josef?'); await A.wait(500); await Sp.anim('turn'); await Sp.say('Così mi chiamavano. Qui.'); await A.m('So haben sie ihn genannt. Hier.'); await A.wait(400); await A.m('Rugiero?'); await Sp.say('Non lo so più. Me l’hanno preso.'); },
    s4_bunker:async function(A){ await Sp.say('Il tavolo … il timbro …'); await A.wait(500); await Sp.say('Sì, sì. Ho detto sì. Avevo ventidue anni e dicevo sì a tutto. Pure al nome.'); await A.m('Er hat ja gesagt. Er war zweiundzwanzig und hat zu allem ja gesagt. Auch zum Namen.'); },
    s4_umschlag:async function(A){ await Sp.say('Le lettere sono mie.'); await A.wait(400); await Sp.say('Le legga, se deve. Ma non le risponda.'); await A.m('Die Briefe sind seine. Ich darf sie lesen, wenn es sein muss. Nur nicht beantworten.'); },
    s4_enzo:async function(A){ await Sp.say('Enzo! È ancora vivo, quello? Fa il caffè peggiore di Monaco.'); await A.wait(400); await Sp.say('Gli dica … no. Non gli dica niente.'); await A.m('Enzo macht den schlechtesten Kaffee von München. Ich soll ihm nichts sagen.'); },
    s4_fluch:async function(A){ await Sp.say('Porca …'); await A.wait(500); await Sp.say('Chi gliel’ha detto?'); await A.m('Frau Wimmer.'); await Sp.say('La signora del tè. Brava donna. Non doveva sentire.'); },
    s4_bairisch:async function(A){ await Sp.say('Freilich hab i Bairisch g’redt. Sonst fragt di a jeder, wo’st herkimmst.'); await A.m('Natürlich hat er Bairisch geredet. Sonst fragt einen jeder, woher man kommt.'); },
    s4_tarnung:async function(A){ await Sp.say('Due lingue. Una per lavorare, una per arrabbiarsi.'); await A.m('Zwei Sprachen. Eine zum Arbeiten, eine zum Wütendsein.'); },
    s4_derselbe:async function(A){ await Sp.anim('cap'); await Sp.say('Diciassette.'); await A.wait(500); await Sp.say('Il numero me l’hanno lasciato.'); await A.m('Die Nummer haben sie ihm gelassen.'); },
    s4_termin:async function(A){ await Sp.say('Giovedì. Lo so. Mi mettono in un campo senza nome.'); await A.wait(400); await Sp.say('Non importa. Basta la lettera.'); await A.m('Donnerstag. Ein Feld ohne Namen. Egal, sagt er. Hauptsache, der Brief.'); },
    s4_genommen:async function(A){ await Sp.anim('point'); await Sp.say('Qui. Sotto i binari.'); await A.m('Hier, sagt er. Unter den Gleisen.'); },
    s4_brief79:async function(A){ await Sp.say('„Ti ho visto con le valigie.“'); await A.wait(500); await Sp.say('Si ricordava di quando sono partito. Avevo due valigie, e mia madre piangeva.'); await A.m('Er glaubt, sie hat sich an seine Abfahrt erinnert. Zwei Koffer, und die Mutter hat geweint.'); },
    s4_wusste:async function(A){ await Sp.say('Sapeva? No. Carmela non sa niente. Per lei io sto bene.'); await A.wait(500); await A.m('Er glaubt es nicht. Nicht von mir.'); }
  };
  await A.menuLoop(function(){ var nm=N(G,'s4_name'), bt=N(G,'s4_bitte'); return [
    {t:'Giuseppe Ruggiero.',if:nm&&!bt,silent:true,go:function(A){ return nameReturn(A); }},
    {t:'Wie heißen Sie weiter? Il cognome?',once:'sp1',if:!nm,go:async function(A){ await Sp.anim('turn'); await A.wait(600); await Sp.anim('point');
      await Sp.say('Il cognome?'); await A.wait(500); await Sp.say('Me l’hanno preso qui. Al binario undici.'); A.note('s4_genommen');
      if (here(A)){ await A.g('Was hat er gesagt?'); await A.m('Seinen Nachnamen haben sie ihm hier genommen. An Gleis elf.'); await A.g('Wer nimmt einem den Namen?'); await A.m('Meistens jemand mit einem Stempel.'); }
      else await A.m('Seinen Nachnamen haben sie ihm hier genommen. An Gleis elf.'); }},
    {t:'Woher kommen Sie?',once:'sp2',go:async function(A){ await Sp.anim('turn'); await Sp.say('Non ne parlo.'); await A.wait(500); await Sp.say('Scriva la lettera.'); await A.m('Darüber redet er nicht. Ich soll den Brief schreiben.'); }},
    {t:'An wen geht der Brief?',once:'sp3',if:!bt,go:async function(A){ await Sp.say('A casa.'); await A.wait(500); await Sp.say('Se a gennaio non arriva niente, a casa capiscono.'); await A.m('Nach Hause. Wenn im Januar nichts kommt, wissen sie zu Hause Bescheid.'); }},
    {t:'Soll ich bei Ihnen zu Hause anrufen?',once:'sp4',if:!F(G,'k4.s.letters'),go:async function(A){ Sp.agitate(1400); await Sp.say('No! Nessuno deve telefonare.'); await A.wait(400); await Sp.say('Lassen S’ as, junger Mann. Lassen S’ as.'); await A.m('Nein. Keiner soll anrufen. Zur Sicherheit sagt er es noch einmal auf Bairisch.'); }},
    {t:'Wissen Sie, dass Sie nicht mehr …?',once:'sp5',go:async function(A){ await Sp.say('Morto? Sì, lo so.'); await A.wait(700); await Sp.say('Il sedici. Faceva freddo, e io dormivo in un portone. Mi sono svegliato qui. Al lavoro.'); await A.m('Er weiß es. Am Sechzehnten. Es war kalt, er hat in einem Hauseingang geschlafen und ist hier aufgewacht. Bei der Arbeit.'); }},
    {t:'Warum tragen Sie noch Koffer?',once:'sp6',go:async function(A){ await Sp.say('Perché è il mio lavoro.'); await A.wait(400); await Sp.anim('cap'); await Sp.say('Diciassette. Il numero me l’hanno dato qui, il primo giorno. Il nome me l’hanno preso, il numero me l’hanno dato.'); await A.m('Weil es seine Arbeit ist. Die Nummer haben sie ihm hier gegeben, am ersten Tag. Den Namen genommen, die Nummer gegeben.'); }},
    {t:'Sie wollen, dass sie weiter glaubt, es gehe Ihnen gut.',once:'sp7',if:bt,go:async function(A){ await Sp.say('Sì. Quarantanove anni sto bene. Non smetto adesso.'); await A.m('Neunundvierzig Jahre geht es ihm gut. Er hört jetzt nicht damit auf.'); }},
    {t:'(Den Brief schreiben.)',silent:true,if:bt&&!F(G,'k4.s.fake'),go:function(A){ return fakeLetter(A); }},
    {t:'Ich rufe Carmela an. Hier. Hören Sie zu.',if:bt&&F(G,'k4.s.letters'),go:async function(A){ await M.K4PHONE.carmela(A); if (A.flag('k4.s.call')) return 'bye'; }},
    askOpt('Was sage ich ihm?',SEPP_ALSO,table,async function(A){ await Sp.say(A.cycle('spNo',['Non capisco. Scriva la lettera.','Des woaß i ned.','Mh. La lettera, signore. La lettera.'])); }),
    {t:'Arrivederci.',bye:true,go:async function(A){ await Sp.say(A.cycle('spBye',['Arrivederci. Se vede una valigia, me la porti.','Pfiat di. Und schaun S’ auf die Koffer.'])); }}
  ]; }); }

// ---------------------------------------------------------------- Sepp (mit Mala)
async function talkSeppG(A){ var Sp=A.npc('sepp'), G=A.G;
  if (!A.isFound('sepp')) return seppFind(A);
  if (F(G,'k4.s.call')){ await A.g('Ich kann dich hinüberbringen, Peppino.'); await Sp.say('Wenn’s recht is, Madl.'); return; }
  await A.menuLoop(function(){ return [
    {t:'Warum trägst du Koffer?',once:'sg1',go:async function(A){ await Sp.say('Weil’s mei Arbat is, Madl. Siebzehn. Des hams ma do drunt geb’n.'); await A.wait(500); await A.g('Das war fast Deutsch. Fast.'); }},
    {t:'Weißt du, dass sie dich nicht sehen?',once:'sg2',go:async function(A){ await Sp.say('Lo so, lo so.'); await A.wait(600); await Sp.say('Ma una valigia è una valigia. Qualcuno la deve portare.'); await A.g('„Valigia.“ Er sagt es, als wäre es etwas Schönes.'); }},
    {t:'Ich bin auch nicht von hier.',once:'sg3',go:async function(A){ await Sp.say('Ned vo do? Na, wer is scho vo do.'); await A.wait(500); await Sp.say('I bin vo do. Seit zweiasechzg.'); await A.g('Kein Wort. Aber er hat gelacht, als er es gesagt hat.'); }},
    {t:'Wartest du auf jemanden?',once:'sg4',if:!N(G,'s4_peppino'),go:async function(A){ await Sp.say('Auf an Brief. La lettera. Lettera di gennaio.'); await A.g('„Lettera.“ Das kenne ich. Das heißt Brief.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function senseSepp(A){ if (!A.isFound('sepp')) return seppFind(A);
  if (A.first('spSense')){ await A.g('Ein Junge mit einem Pappkoffer steigt aus einem Zug, der die ganze Nacht gefahren ist. Er hat Angst. Er lacht trotzdem, damit es keiner merkt.');
    await A.wait(400); await A.g('Und dann ein Brief. Immer wieder derselbe. „Sto bene.“ Ich weiß nicht, was das heißt.'); await A.g('Er hat es so oft geschrieben, dass es nichts mehr heißt.'); return; }
  return A.g('„Sto bene.“ Neunundvierzig Jahre lang. Es ist ganz glatt geworden, wie ein Stein im Fluss.'); }
// die Schwelle (wie Mate in Kapitel 3)
async function crossSepp(A){ var Sp=A.npc('sepp'), G=A.G; G.flags['mala.lock']=true; A.music('k4_duh');
  var p=Sp.actor?[Math.round(Sp.x),Math.round(Sp.y)]:M.apos('gleis11','sepp',[202,113,'L']);
  await A.g('Komm.'); await Sp.say('Und da Übersetzer? Der soll mitkemma. Der hod ma mei Schwester z’ruckbracht.'); await A.g('Er kommt mit. Bis an den Rand.');
  await A.crossOpen(p[0]-22,p[1]+3,{w:18,h:74}); await A.g('Marko. Nimm meine Hand.');
  var c=await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true},{t:'„Wieder bis an den Rand?“',id:'edge'}],{title:'',conv:false});
  if (c==='edge') await A.g('Bis an den Rand. Wie immer.');
  A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'sepp'); }

// ---------------------------------------------------------------- Die Kioskfrau (Bairisch; Mala versteht sie nicht)
function aushangHere(G){ return NOTICE.indexOf(G.phase)>=0; }
async function kioskSepp(A,K,how){ var G=A.G;
  if (how==='cap'){ await K.say('An Gepäckträger? De gibt’s seit Jahr und Tag nimmer. Seit de Koffer Radl ham.'); await A.wait(500);
    await K.say('Bloß da Sepp hod no so a Mützn aufg’habt. A oide, mit a Nummer drauf. Der is aber tot. Seit a Wochn.'); await A.wait(400); }
  await K.say('Der Sepp? A Urmünchner. Der hod Bairisch g’redt wia mei Schwiegervater.'); await A.wait(400);
  await K.say('Jeden Tag a Semmel und d’Abendzeitung. Und nia a Wort z’vui.'); A.note('s4_bairisch'); A.setFlag('k4.s.kiosk');
  if (here(A)){ await A.g('Was hat sie gesagt? Ich habe nur „Sepp“ verstanden. Und „Mützn“.'); await A.m('Ein Urmünchner, sagt sie. Er hat Bairisch geredet wie ihr Schwiegervater. Jeden Tag eine Semmel und die Abendzeitung, und nie ein Wort zu viel.'); }
  else await A.m('Ein Urmünchner, sagt sie. Bairisch wie ihr Schwiegervater. Jeden Tag eine Semmel und die Abendzeitung.'); }
async function kioskPeppino(A,K){ await K.say('A Peppino? Na. Kenn i ned.'); await A.wait(400);
  await K.say('Italiener hockan im Bahnhofsviertel. Beim Enzo, in da Bar Sport, glei hinterm Bahnhof. Do hockan’s den ganzn Tag und schrein, wer Meister wird.');
  A.unlock('bhfviertel'); A.setFlag('k4.s.barKnown'); await A.m('Italiener sitzen im Bahnhofsviertel, sagt sie. In der Bar Sport, bei einem Enzo.'); }
async function kioskBunker(A,K){ await K.say('Unter Gleis elf? Do drunt war früher a Bunker.'); await A.wait(400);
  await K.say('Do hams de Gastarbeiter hig’schickt, wia s’ kemma san. Stempel drauf, und weiter. Heit spuin s’ do drunt Theater, hob i g’lesen.');
  A.setFlag('k4.s.bunkerKnown'); await A.m('Unter dem Gleis war ein Bunker. Dort hat man die Gastarbeiter hingeschickt, als sie ankamen. Stempel drauf, und weiter.');
  if (here(A)){ await A.wait(400); await A.g('Unter dem Gleis.'); await A.wait(300); await A.g('Da komme ich hin. Du nicht.'); } }
async function kioskNotice(A,K){ await K.say('Den Zettel hod d’Frau Wimmer bracht. Nehmen S’ oan mit, i hob an ganzn Stapel.'); A.give('aushang'); A.setFlag('k4.s.notice');
  await A.m('„Wer kannte diesen Mann?“ Darunter ein Foto, so oft kopiert, dass von dem Gesicht vor allem die Mütze übrig ist.'); }
var KIOSK_ALSO=['s4_peppino','s4_genommen','s4_fluch','s4_enzo','s4_ausweis','s4_name','s4_tarnung','s4_bairisch'];
async function talkKiosk(A){ var K=A.npc('kioskg'), G=A.G;
  var table={
    s4_peppino:function(A){ return kioskPeppino(A,K); },
    s4_genommen:function(A){ return kioskBunker(A,K); },
    s4_fluch:async function(A){ if (!N(G,'s4_bairisch')) return kioskSepp(A,K,'sepp'); await K.say('G’flucht hod er? Da Sepp? Wenn, dann leis. I hob nix g’hört.'); },
    s4_bairisch:async function(A){ await K.say('Bairisch wia mei Schwiegervater. Und der war aus Giesing. Mehr Münchner geht ned.'); },
    s4_enzo:async function(A){ await K.say('Da Enzo? Der vo da Bar Sport? Der kimmt oamal im Johr und kauft a Zeitung aus Italien.'); },
    s4_ausweis:async function(A){ await K.say('Josef? Ja mei. Sepp is Josef. Des woaß a jeds Kind.'); await A.m('Sepp ist Josef, sagt sie. Das weiß jedes Kind.'); },
    s4_name:async function(A){ await K.say('Giuseppe? Da Sepp?'); await A.wait(600); await K.say('Jetzt schau her. Und i hob eam fünfazwanzg Johr d’Abendzeitung verkauft.'); },
    s4_tarnung:async function(A){ await K.say('Dass der a Italiener war? Mei.'); await A.wait(400); await K.say('G’redt hod er wia mia. Mehr woaß ma ja von koam.'); }
  };
  await A.menuLoop(function(){ var know=F(G,'k4.s.wimmer')||N(G,'s4_fluch'); return [
    {t:'Kannten Sie einen alten Gepäckträger? Mütze, Nummer siebzehn.',if:F(G,'k4.s.talk')&&!N(G,'s4_bairisch'),go:function(A){ return kioskSepp(A,K,'cap'); }},
    {t:'Der Sepp, der in der Bahnhofsmission Tee getrunken hat. Kannten Sie ihn?',if:know&&!N(G,'s4_bairisch'),go:function(A){ return kioskSepp(A,K,'sepp'); }},
    {t:'Kennen Sie einen Peppino?',if:N(G,'s4_peppino')&&!A.unlocked('bhfviertel'),go:function(A){ return kioskPeppino(A,K); }},
    {t:'Was war früher unter dem Gleis?',if:N(G,'s4_genommen')&&!F(G,'k4.s.bunkerKnown'),go:function(A){ return kioskBunker(A,K); }},
    {t:'Darf ich einen von den Zetteln mitnehmen?',if:aushangHere(G)&&!A.has('aushang')&&!F(G,'k4.s.notice'),go:function(A){ return kioskNotice(A,K); }},
    {t:'Eine Abendzeitung, bitte.',once:'ki1',go:async function(A){ await K.anim('sell'); await K.say('Bittschön. Heit is’s dünn, is ja Feiertag. Mehr Werbung als Zeitung.'); await A.m('Auf Seite drei ein Foto vom Christkindlmarkt, der schon abgebaut wird. Ich lese es nicht.'); }},
    {t:'Wie lange stehen Sie schon hier?',once:'ki2',go:async function(A){ await K.say('Am Gleis? Neunzehn Johr. Im Kiosk a. Davor bei da Post.'); await A.wait(400); await K.say('I kenn jeden, der zwoamal kimmt. Und de, de bloß oamal kemma, de vergiss i glei.'); }},
    askOpt('Wonach frage ich sie?',KIOSK_ALSO,table,async function(A){ await K.say(A.cycle('kiNo',['Des woaß i ned. I verkauf Zeitungen, koa Auskünfte.','Fragen S’ d’Frau Wimmer. De woaß mehr als d’Polizei.'])); }),
    {t:'Wiederschauen.',bye:true,go:async function(A){ await K.say(A.cycle('kiBye',['Pfiat Eana.','Servus. Und frieren S’ ned.'])); }}
  ]; }); }

// ---------------------------------------------------------------- die Abfahrtstafel
async function board(A){ await A.doc({style:'register',title:'ABFAHRT · GLEIS 11–16',lines:['11:31  EC 85   Verona · Bologna','11:48  RE      Mühldorf','12:02  IC 2082 Augsburg · Würzburg','12:16  RB      Kochel','12:31  EC 113  Salzburg · Klagenfurt','','EC 85 heute 10 Min. später']});
  if (seen(A) && A.first('g11boardS')){ await A.m('Der Zug nach Verona. Peppino sieht zu ihm hin, wie man zu einem Haus sieht, in dem man einmal gewohnt hat.'); } }

// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Die Querhalle, dahinter der Ausgang zur Stadt. Taxis, Trambahn, Schnee.',g:{look:'Da draußen ist München. Groß. Und keiner, der auf mich wartet.'}},
 {id:'mission',name:'Bahnhofsmission',exit:{to:'bmission'},look:'Eine Tür an der Querhalle, darüber ein Schild: „BAHNHOFSMISSION“. Dahinter Licht und das Klappern von Tassen.',
   g:{look:function(A){ return A.g(seen(A)?'Seine Leine geht dorthin. Zu der Tür. Nicht zu einem Haus, nicht zu einem Menschen. Zu einer Tür, hinter der Post ankommt.':'Hinter der Tür trinken Leute Tee, die nirgends hinfahren.'); }}},
 {id:'platform',name:'Bahnsteig',look:'Der Bahnsteig von Gleis 11, lang und grau. Reisende mit Rollkoffern, Tauben, eine Durchsage, die keiner versteht.',
   g:{look:'Hier sind sie alle angekommen. Tausende. Der Boden erinnert sich an die Schritte.',sense:'Viele Füße, vor langer Zeit. Holzkoffer, Pappkoffer, ein Akkordeon. Und alle sehen sich um, ob sie hier richtig sind.'}},
 {id:'sign11',name:'Gleisschild „11“',look:'Eine große Elf auf blauem Grund. Darunter die Wagenstandsanzeige, auf der heute nichts steht, was stimmt.',
   g:{look:'Elf. Keine Zahl, die man sich merkt. Außer man ist hier angekommen.'}},
 {id:'kiosk',name:'Kiosk',look:function(A){ return A.m(aushangHere(A.G)?'Ein Kiosk: Zeitungen, Zigaretten, Brezen unter Plastik. An der Scheibe klebt ein Zettel: „Wer kannte diesen Mann?“':'Ein Kiosk: Zeitungen, Zigaretten, Brezen unter Plastik, ein Schild „PRESSE“. Dahinter eine Frau mit Fingerhandschuhen.'); },
   take:function(A){ if (aushangHere(A.G) && !A.has('aushang') && !A.flag('k4.s.notice')) return kioskNotice(A,A.npc('kioskg')); return A.m('Zeitungen kosten. Und die Kioskfrau sieht alles.'); },
   use:function(A){ return A.m('Ich kaufe nichts, was ich nicht lese. Meistens.'); },
   g:{look:'Papier, das jeden Tag neu ist und abends alt.'}},
 {id:'board',name:'Anzeigetafel',look:function(A){ return board(A); },read:function(A){ return board(A); },g:{look:'Lauter Städte. Für mich sind das Wörter, die blinken.'}},
 {id:'train',name:'Zug',look:'Ein Zug am Bahnsteig, die Türen offen, drinnen warm. Er atmet, wie Züge atmen, bevor sie fahren.',use:'Ich fahre nirgendwohin. Nicht heute.',
   g:{look:'Züge fahren. Das kann ich nicht mehr. Ich gehe nur noch.'}},
 {id:'buffer',name:'Prellbock',look:function(A){ return A.m(seen(A)?'Der Prellbock, rot und weiß. Davor steht Peppino, die Hände auf dem Rücken, gerade wie ein Signal.':'Ein Prellbock aus Stahl, rot und weiß. Hier ist Schluss für jeden Zug.'); },
   push:'Er bewegt sich nicht. Das ist sein Beruf.',use:'Ich lehne mich nicht daran. Hier hat einer jahrelang gestanden.',
   g:{look:function(A){ return A.g(seppHere(A.G)?'Am Prellbock ein Strom aus alten Koffern, nur Umrisse. Wie Ankommende, die nie ganz angekommen sind.':'Am Prellbock ist niemand mehr. Nur die Umrisse der Koffer, ganz blass.'); },
     sense:function(A){ if (seppHere(A.G) && !A.isFound('sepp')) return seppFind(A); return A.g('Hier hat einer gestanden. Jeden Tag. Er hat Koffer getragen, die ihm nicht gehört haben.'); }}},
 {id:'bench',name:'Bank',look:'Eine Bank aus Metall, kalt bis durch den Mantel.',use:function(A){ return A.m(seen(A)?'Ich setze mich kurz. Gegenüber wartet Peppino auf Koffer, die keiner bringt.':'Ich setze mich kurz. Eine Taube sieht mich an, als wäre ich ihr Platz.'); },
   g:{look:'Auf Bänken an Bahnhöfen wartet man. Das kann ich.'}},
 {id:'tree',name:'Weihnachtsbaum',vis:function(S,G){ return G.phase==='k4_d1'||G.phase==='k4_d2'; },look:'Ein großer Tannenbaum in der Querhalle, mit Lichterketten und Strohsternen. Unten liegen leere Geschenkkartons, schön verpackt.',
   take:'Die Kartons sind leer. Das ist der Trick.',g:{look:'Ein Baum im Haus. Ich habe nie verstanden, warum man das macht. Schön ist es trotzdem.'}},
 {id:'hatch',name:'Eiserne Luke',gexit:{to:'bunker'},
   look:function(A){ return A.m(A.flag('k4.s.bunkerKnown')?'Die eiserne Luke im Boden. Darunter war ein Bunker, sagt die Kioskfrau. Für die, die hier ankamen.':'Eine eiserne Luke im Boden, mit einem Gitter. Darunter Dunkelheit und ein Geruch nach Keller.'); },
   open:'Ein Vorhängeschloss, rostig. Hier ist seit Jahren keiner hinunter. Jedenfalls keiner mit Schuhen.',use:'Abgeschlossen. Und mein Schlüsselbund passt nicht auf die Vergangenheit.',push:'Sie bewegt sich nicht.',
   g:{look:'Eine Klappe im Boden. Darunter ist es kälter als hier oben. Da unten ist etwas, das nicht vergeht.',sense:'Ein Stempel, der aufschlägt. Immer wieder. Darunter, nicht hier.'}},
 {id:'kioskg',npc:'kioskg',name:'Kioskfrau',hgt:26,talkDist:22,talk:talkKiosk,vis:function(S,G){ return M.K4_DAYS.indexOf(G.phase)>=0; },
   look:'Eine Frau um die sechzig im Kiosk, blond gefärbtes Haar, hochgesteckt, eine dicke Strickjacke, Fingerhandschuhe. Sie liest und sieht trotzdem jeden.',
   give:{ aushang:'Kioskfrau: „Den hob i doch scho. Den ganzn Stapel.“', vizitka:'Kioskfrau: „Zelenika? Kenn i ned. Moosach? Do war i nia.“', photo_full:'Kioskfrau: „Schee. Wer is des? Sie? Mit dene Ohren?“' },
   g:{look:'Sie liest Zeitung und sieht trotzdem jeden, der vorbeigeht.',listen:'Sie redet mit einer Kundin. Ich verstehe kein Wort. Das ist kein Deutsch. Das ist Kies in einem Eimer.'}},
 {id:'sepp',npc:'sepp',name:seppName,hgt:46,vis:function(S,G){ return seppHere(G); },talk:talkSepp,
   look:function(A){ if (!A.isFound('sepp')) return A.m('Am Prellbock ist es kälter als anderswo.');
     if (A.flag('k4.s.call')) return A.m('Peppino am Prellbock. Er trägt einen Koffer, den keiner sieht, und zum ersten Mal sieht er dabei nicht auf die Reisenden. Er sieht auf das Gleis.');
     return A.m('Ein alter Mann in einer blauen Uniformjacke mit Messingknöpfen, blank gewetzt an den Ellbogen. Die Mütze mit der Siebzehn. Schuhe, die einer jeden Tag geputzt hat. Durch ihn hindurch sehe ich den Prellbock.'); },
   give:{ aushang:'Peppino: „Quello sono io? Sembro vecchio.“ Ob er das ist, fragt er. Er sieht alt aus, findet er.', brief_falsch:'Peppino: „Senza firma. Non vale.“ Ohne Unterschrift gilt er nicht.', photo_full:'Peppino: „Bella famiglia. Tenga stretta questa foto.“ Ich soll das Foto gut festhalten.', vizitka:'Peppino: „Moosach. Da hab i amal an Koffer hintrag’n. Zwanzg Mark Trinkgeld. Nia vergess’n.“' },
   g:{look:function(A){ if (!A.isFound('sepp')) return seppFind(A); return A.g('Ein alter Mann in Uniform. Seine Leine geht nicht zu einem Haus. Sie geht zu der Tür da drüben, zur Bahnhofsmission.'); },
     talk:function(A){ return talkSeppG(A); }, sense:function(A){ return senseSepp(A); },
     cross:function(A){ return crossSepp(A); }, crossIf:function(S,G){ return F(G,'k4.s.call') && !F(G,'k4.s.crossed'); }}}
];
M.room('gleis11',{ name:'Hauptbahnhof, Gleis 11', scape:'k4_gleis11',
  music:function(G){ return (seppHere(G) && G.flags['found.sepp'])?'k4_sepp':'k4_bahnhof'; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; S.sepp=seppHere(G); S.tree=(G.phase==='k4_d1'||G.phase==='k4_d2');
    if (M.K4_DAYS.indexOf(G.phase)>=0){ var k=M.apos('gleis11','kioskg',[408,108,'F']); L.push({id:'kioskg',ch:'kioskg',x:k[0],y:k[1],f:k[2]||'F',name:'Kioskfrau',idle:'read',speechY:30,routine:false}); }
    if (seppHere(G)){ var s=M.apos('gleis11','sepp',[202,113,'L']), call=F(G,'k4.s.call');
      L.push({id:'sepp',ch:'sepp',x:s[0],y:s[1],f:s[2]||'L',name:'Sepp',ghost:true,reveal:true,idle:call?'carry':'wait',speechY:46,routine:false,
        anchor:call?null:function(){ var m=M.spot('gleis11','mission'); return m[2]?[m[0]+(m[2]>>1),m[1]+(m[3]>>1)]:null; }}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (from==='bunker'){ if (markoHere(A) && A.flag('k4.s.bunker') && !A.flag('k4.s.bunkerTold')) await bunkerTell(A); return; }
    if (alone(A)){   // Mala allein: keine lebende Figur spricht sie an, Marko ist woanders
      if (seppHere(G) && !A.isFound('sepp')) return seppFind(A);
      if (p==='k4_d4' && A.first('g11malaD4')) await A.g('Am Prellbock steht keiner mehr. Nur ich, und ich trage nichts.');
      return; }
    if (p==='k4_pro'){ if (A.first('g11pro')){ await A.narrate('Heiligabend am Hauptbahnhof. Alle fahren nach Hause, mit Taschen voller Geschenke und Gesichtern voller Verspätung.'); await A.m('Ich bin gerade erst angekommen. Erst Mama.'); } return; }
    if (A.first('g11first')) await A.narrate('Die Halle des Hauptbahnhofs: Stahl, Glas, Tauben. Gleis 11 endet an einem rot-weißen Prellbock. An der Querhalle eine Tür: „BAHNHOFSMISSION“. Ein Kiosk. Im Boden eine eiserne Luke.');
    if (seppHere(G) && !A.isFound('sepp')){
      if (here(A)) return seppFind(A);
      if (A.first('g11ache'+p)){ await A.m('Mein Kopf. Hinter den Augen, wie ein Daumen, der drückt.'); await A.wait(400); await A.m('Hier ist einer. Ich sehe ihn nicht. Mala würde ihn sehen.'); }
      return; }
    if (seppHere(G) && A.isFound('sepp') && here(A) && !F(G,'k4.s.told')) await toldHere(A);
    if (F(G,'k4.s.call') && !F(G,'k4.s.crossed') && A.first('g11wait')){ if (here(A)) await A.g('Er wartet. Auf mich.'); else await A.m('Peppino wartet am Prellbock, den unsichtbaren Koffer in der Hand. Er wartet auf Mala.'); }
    if (p==='k4_d4' && F(G,'k4.s.crossed') && A.first('g11d4')) await A.m('Gleis 11. Am Prellbock steht keiner. Ich sehe trotzdem hin.');
    if (p==='k4_d5' && A.first('g11d5')){ await A.m('Gleis 11. Am Prellbock steht keiner mehr.'); await A.wait(500); await A.m('Und Mala ist auch nicht hier.'); if (M.k4D5Search) await M.k4D5Search(A); } }
});
})(M);
