/* ===== 97_k4_fam_a.js — Kapitel 4, Familie (S1), Teil A: Heiligabend bei Ana (M.k4Eve), Schlüsseldialog 1 „Nur müde“
   (M.k4Talk1), die Morgen (M.k4Wake), der Džezva-Abend (M.k4Dzezva), Kolars Anruf in zwei Fassungen (M.k4KolarCall),
   Mama erkennt Sepp (M.k4JasnaNotice), der Streit (M.k4Fight); Mamas Abendgespräche (M.k4TalkJasna), das Handy
   (M.K4PHONE.jasna/ana/nada/kolar) und die Sicherungen nach dem Laden (M.K4REACT['s1.*']). Konzept 4.5, 7.3, 8.1. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function N(A,id){ return A.hasNote(id); }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function rid(A){ return A.room?A.room.id:''; }
function yes(A){ return M.k4Variant(A.G)==='yes'; }
async function lock(A,fn){ var G=A.G, lk=G.flags['mala.lock']; G.flags['mala.lock']=true; try{ await fn(); } finally { G.flags['mala.lock']=lk||false; } }
// ---------------------------------------------------------------- Heiligabend bei Ana (das Gerüst bringt Marko und Mala hin; das Essen startet der Spieler am Tisch, rooms/ana.js)
M.k4Eve=async function(A){ var G=A.G; if (F(A,'k4.p.eveIntro')) return; A.setFlag('k4.p.eveIntro');
  var An=A.npc('ana'), T=A.npc('tobias'), Mi=A.npc('mia'), Ni=A.npc('niko'), J=A.npc('jasna'), c2=M.k4Carry||{};
  await lock(A,async function(){
    A.music('k4_ana');
    await A.narrate('Anas Wohnung in Giesing, dritter Stock ohne Aufzug. Es riecht nach Würstchen, nach Mamas Sarma und nach viel zu vielen Plätzchen. Im Flur sechs Paar Schuhe, zwei davon so klein, dass sie nicht echt aussehen.');
    if (G.malaOn && A.malaHere()){ var w=M.apos('ana','mala',[440,118,'L']); A.walkG(w[0],w[1]); }
    await An.say(A.flag('k4.p.smsReply')==='yes'?'„Bin da.“ Zwei Wörter. Für deine Verhältnisse ein Roman.':'Da bist du. Geantwortet hast du natürlich nicht.');
    if (c2.ana){ await A.wait(300); await An.say('Im November hast du angerufen. Aus Sarajevo. Das erste Mal seit Jahren. Und jetzt stehst du in meinem Flur.'); }
    await Mi.say('Bist du der Onkel aus Split?'); await A.m('Der bin ich.'); await Mi.say('Mama sagt, der kommt nie.'); await A.m('Jetzt bin ich da.'); await A.wait(500); await Mi.say('Dann bist du ja nicht der.');
    await A.wait(400); if (T.actor) T.anim('read'); await T.say('Moment. Moment …'); await A.wait(400); await T.say('Sretna Nova godina!');
    var c=await A.choose([{t:'Hvala. Ali Nova godina je tek za sedam dana.',id:'fix'},{t:'(Ihm die Hand geben.)',id:'hand',silent:true}],{title:'Tobias'});
    if (c==='fix'){ await T.say('Was hat er gesagt?'); await An.say('Danke. Aber Neujahr ist erst in sieben Tagen.'); await T.say('Ich weiß. Ich übe vor.'); await A.wait(300); await J.say('Er übt seit Oktober. Er ist der Einzige in dieser Familie, der unsere Sprache lernt.'); await An.say('Danke, Mama.'); }
    else { await A.narrate('Ich gebe ihm die Hand. Er schüttelt sie, als hätte ich ihn gerade gelobt.'); if (G.malaOn){ await A.g('Er wünscht dir ein gutes neues Jahr. Eine Woche zu früh.'); await A.m('Ich weiß.'); await A.g('Er meint es aber so.'); } }
    if (G.malaOn && A.malaHere()){ await A.wait(800); if (Ni.actor) Ni.anim('stare'); await A.wait(600);
      await Ni.say('Da ist ein Mädchen mit Schal.'); if (Ni.actor) Ni.anim('point'); await A.wait(500); await Ni.say('Sie zählt die Lichter.');
      await A.wait(300); await An.say('Sein unsichtbarer Freund. Seit dem Sommer. Mal heißt er Bobo, mal Kiki.'); await T.say('Heute ist es ein Mädchen. Das ist neu.');
      await A.wait(500); await A.narrate('Mama am Tisch hört „Schal“. Sie legt die Gabel hin, ganz leise, als könnte die Gabel etwas verraten.');
      await A.wait(800); await A.g('Er sieht mich.'); await A.m('Sag nichts.'); await A.wait(300); await A.g('Ich kann gar nichts sagen. Er hört mich nicht.'); await A.wait(500); await A.g('Er sieht nur.');
      A.setFlag('k4.p.niko'); if (Ni.actor) Ni.anim('wave'); await A.wait(300); await A.narrate('Niko winkt zum Fenster. Mala winkt zurück, mit der ganzen Hand, wie er.'); }
    await A.wait(500); await An.say('Setzt euch. Es gibt Würstel. Wer nicht sitzt, kriegt keine.'); }); };
// ---------------------------------------------------------------- Schlüsseldialog 1: „Nur müde“ (Konzept 8.1; Heiligabend, Nacht, auf Mamas Couch)
M.k4Talk1=async function(A){ var G=A.G; if (F(A,'k4.p.talk1')) return;
  await lock(A,async function(){
    var s=M.stand('jwohnung','sofa')||[300,126,'L']; A.placeM(s[0],s[1],s[2]||'L'); A.idleM('sit');
    if (G.malaOn){ var w=M.apos('jwohnung','mala',[340,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    A.music('k4_nacht'); await A.wait(700);
    await A.narrate('Mamas Wohnzimmer. Die Couch ist zu kurz, die Decke riecht nach Lavendel und nach Schrank. Draußen schießt einer eine einzelne Rakete ab, eine Woche zu früh.');
    A.sfx('firework'); await A.wait(900); await A.g('Eine Woche zu früh.');
    var c1=await A.choose([{t:'In München sind sie ungeduldig.',id:'a'},{t:'(Nichts sagen.)',id:'b',silent:true}],{title:'Mala'});
    if (c1==='b'){ await A.wait(1000); await A.g('In München sind sie ungeduldig. Wolltest du das sagen?'); await A.m('So ungefähr.'); }
    await A.g('Deine Mutter ist zusammengezuckt. Beim Essen. Als Tobias den Korken gezogen hat.'); await A.m('Ich weiß.'); await A.wait(600); await A.g('Du auch.');
    await A.wait(1300); await A.m('…'); await A.wait(700); await A.g('Die Pantoffeln an der Tür. Vierundvierzig.');
    var c2=await A.choose([{t:'Seine Größe.',id:'a'},{t:'(Nichts sagen.)',id:'b',silent:true}],{title:'Mala'});
    if (c2==='b'){ await A.wait(1000); await A.g('Seine Größe.'); await A.m('Ja.'); }
    await A.g('Sie stehen gerade. Jemand stellt sie jeden Tag gerade.'); await A.m('Sie putzt. Sie putzt alles.'); await A.g('Unter den Pantoffeln ist kein Staub. Unter der Kommode schon.');
    await A.m('Du hast dich unter die Kommode gelegt.'); await A.g('Ich kann mich überall hinlegen. Das ist das einzig Gute daran.');
    await A.wait(900); A.headache(1800); await A.narrate('Ich reibe mir die Schläfe.'); await A.wait(400); await A.g('Tut es weh?');
    var c3=await A.choose([{t:'Nur müde.',id:'a'},{t:'Es geht.',id:'b'}],{title:'Mala'});
    if (c3==='b'){ await A.wait(500); await A.g('Es geht. Das heißt bei dir dasselbe wie nur müde.'); }
    await A.g('Du sagst „nur müde“, wie andere „nichts“ sagen.'); await A.m('Dann sage ich eben nichts.'); await A.wait(400); await A.g('Du sagst das seit Split.'); A.note('r4_kopf');
    await A.wait(800); await A.g('In Mostar hast du gesagt: Mama soll alles wissen.'); await A.m('Das war deine Mama.'); await A.g('Ja.'); await A.wait(900); await A.g('Und deine wartet.');
    var c4=await A.choose([{t:'Auf den Bus nach Sarajevo. Seit zweiundneunzig. Sie steigt nur nie ein.',id:'a'},{t:'(Nichts sagen.)',id:'b',silent:true}],{title:'Mala'});
    if (c4==='b'){ await A.wait(1200); await A.g('Worauf wartet sie, Marko?'); await A.m('Auf den Bus nach Sarajevo. Seit zweiundneunzig. Sie steigt nur nie ein.'); }
    await A.wait(500); await A.g('Nicht auf den Bus.');
    await A.wait(1700); await A.narrate('Stille. Unten fährt ein Auto im Schnee, ganz leise.'); await A.wait(800);
    await A.g('In Split hat eine Frau jeden Abend an einem Poller gewartet. Nicht auf ein Schiff. Auf einen Satz.'); await A.m('Ivka.'); await A.g('Deine Mutter wartet auch auf einen Satz.');
    var c5=await A.choose([{t:'Sie will keinen. Du hast sie gehört. „Nicht heute.“',id:'a'},{t:'(Schweigen.)',id:'b',silent:true}],{title:'Mala'});
    if (c5==='b'){ await A.wait(1300); await A.g('Sie hat „nicht heute“ gesagt. Ich war dabei.'); await A.g('Nicht „nie“.'); } else await A.g('Sie hat „nicht heute“ gesagt. Nicht „nie“.');
    await A.m('Mala.'); await A.g('Ich frage nicht. Das habe ich versprochen. Ich frage nicht, woher du es weißt.'); await A.m('Gut.'); await A.g('Ich sage nur, was ich sehe. Das darf ich.');
    var c6=await A.choose([{t:'Was siehst du?',id:'a'},{t:'(Die Augen zumachen.)',id:'b',silent:true}],{title:'Mala'});
    if (c6==='b'){ await A.wait(900); await A.g('Ich sage es trotzdem.'); }
    await A.g('Zwei Leute in einer Wohnung, die denselben Satz nicht sagen. Und einen, der auf ihrer Couch schläft, mit den Füßen in der Luft, weil sie zu kurz ist.');
    await A.m('Sie war schon immer zu kurz.'); await A.g('Du warst damals kürzer.');
    await A.wait(900); await A.m('Morgen frage ich sie. Nach der Probe.'); await A.g('Nach der Probe.'); await A.m('Damit fängt es an.'); await A.g('Damit fängst du an, weil es dann nicht um dich geht.'); await A.m('Es geht um Tata.'); await A.g('Ja.');
    await A.wait(1500); await A.g('Schlaf. Ich zähle die Fenster gegenüber. Bei dreiunddreißig ist noch eins hell.');
    var c7=await A.choose([{t:'Wer ist da noch wach?',id:'a'},{t:'(Nicht mehr fragen.)',id:'b',silent:true}],{title:'Mala'});
    if (c7==='b'){ await A.wait(900); await A.g('Eine Frau. Falls du es wissen willst.'); } else await A.g('Eine Frau.');
    await A.g('Sie bügelt. An Heiligabend.'); await A.m('Vielleicht hat sie morgen Dienst.'); await A.g('Wie deine Mutter.'); await A.m('Wie meine Mutter.');
    await A.wait(1300); await A.narrate('Mala bleibt am Fenster. Mein Kopf pocht gleichmäßig, wie ein Zug, der nicht ankommt. Ich sage ihr nicht, dass es nicht vom Müdesein kommt.');
    A.setFlag('k4.p.talk1'); });
  A.idleM(null); await A.wait(900); await M.k4Bed(A); };
// ---------------------------------------------------------------- Die Morgen (Tag 1, 3, 4, 5)
async function wakeD1(A,g){ var G=A.G;
  await A.narrate('Christtag. Als ich aufwache, steht die Sonne schon über den Dächern. Die Wohnung ist leer. Mama hat Frühdienst, seit sechs.');
  await A.narrate('Auf dem Tisch steht ihre Brotdose. Blau, mit einem Zettel. Sie hat sie vergessen.');
  A.sfx('sms'); await A.wait(600); await A.m('Ana.');
  await A.doc({style:'letter',title:'SMS · Ana',lines:['Wir gehen um elf rodeln. Theresienwiese, an der Bavaria. Die Kinder wollen den Onkel sehen. Ich nicht. Komm trotzdem. A.']});
  A.unlock('wiesn'); await A.m('Rodeln an der Bavaria. „Ich nicht. Komm trotzdem.“ Das ist Ana.');
  if (!g) return;
  await A.g('Die kleine Ana fährt Schlitten.'); await A.m('Ihre Kinder.'); await A.g('Dann eben die.');
  await A.wait(700); A.headache(2400); await A.animM('headache'); await A.wait(300);
  await A.g('Dein Kopf.'); await A.m('Nur müde.'); await A.wait(600);
  await A.g('Hier ist keiner. Ich habe die ganze Nacht nachgesehen. Im Treppenhaus, bei der Katze, hinter den Wänden.'); await A.wait(600); await A.g('Keiner außer mir.');
  await A.m('Mala.'); await A.wait(500); await A.g('Vielleicht bin ich es.'); await A.wait(500); await A.g('Wenn ich weg bin und es hört auf, dann weiß ich es.');
  var c=await A.choose([{t:'Du bist es nicht.',id:'not'},{t:'Bleib hier.',id:'stay'},{t:'(Nichts sagen.)',id:'quiet',silent:true}],{title:'Mala'});
  if (c==='not') await A.g('Woher weißt du das? Du weißt es nicht. Du sagst nur müde.');
  else if (c==='stay'){ await A.g('Ich bin keine Katze, die man in der Wohnung lässt.'); await A.wait(400); await A.g('Ich komme wieder. Das kann ich jetzt.'); }
  else { await A.wait(900); await A.g('Siehst du. Du weißt es auch nicht.'); }
  await A.wait(500); await A.g('Gestern habe ich von der Brücke aus die Züge gezählt. Da drüben kommen sie alle an. Wo Züge ankommen, warten Leute.');
  await A.g('Ich gehe heute zum Bahnhof. Allein. Mal sehen, wie weit ich komme.');
  await A.m('Und wenn du nicht weit kommst?'); await A.g('Dann komme ich zurück. Ich kenne den Weg. Ich habe ihn gezählt.'); }
async function wakeD3(A,g){ var G=A.G;
  await A.narrate('Mittwoch. Es schneit wieder, dicht und ohne Wind. Mama ist schon weg. Auf dem Tisch ein Zettel in ihrer Druckschrift: „Suppe im Kühlschrank. Iss.“');
  if (!yes(A) && !F(A,'k4.e.sample2')){ await A.m('Heute ist Frau Kolars Karte im Konsulat.'); if (g){ await A.g('Sie hat dich gefragt, ob heute ein anderer Tag ist.'); await A.m('Ja.'); await A.g('Dann ist heute der andere Tag.'); } }
  if (!g) return;
  await A.wait(500); await A.g('Die Frau gegenüber hat heute Nacht nicht gebügelt. Zum ersten Mal.'); await A.m('Vielleicht hat sie frei.'); await A.g('Vielleicht ist sie fertig. Mit allem, was zu bügeln war.');
  if (F(A,'k4.d2.ana') && A.first('!k4.w3ana')){ await A.wait(500); await A.g('Ana will warten. Bis nach Neujahr.'); await A.m('Ich weiß.'); await A.g('Ich sage nichts dazu. Ich habe es gestern gesagt.'); } }
async function wakeD4(A,g){ var G=A.G;
  await A.narrate('Donnerstag. Klarer Himmel, harter Schnee. Die Fenster gegenüber sind voller Sonne.');
  if (F(A,'k4.d2.notice')){ await A.narrate('Auf dem Tisch ein Zettel in Mamas Druckschrift: „Ich komme mit, zu dem Mann vom Aushang. Um zehn am Bahnhof. Mama.“');
    if (g){ await A.g('Sie kommt mit.'); await A.m('Zu einer Beerdigung.'); await A.g('Zu einem Abschied. Sie hat „mit“ geschrieben. Nicht „hin“.'); } }
  if (!g) return;
  await A.wait(500); await A.g('Heute gehen zwei. Sepp am Morgen und Gerda um drei.'); await A.wait(400); await A.g('Ich habe noch nie zwei an einem Tag gehen sehen.'); }
async function wakeD5(A){ var G=A.G;
  await A.narrate('Freitag. Nebel. Ich wache auf, und das Fenster ist leer. Niemand zählt die Fenster gegenüber.');
  await A.m('Mala?'); await A.wait(1200); await A.m('Mala.'); await A.wait(900);
  await A.narrate('Mama ist zur Arbeit gegangen, ohne mich zu wecken. Auf dem Tisch eine Thermoskanne mit Kaffee und ein Zettel: „Du hast im Schlaf geredet. Auf Bosnisch. Iss etwas. M.“');
  A.headache(3200); await A.animM('headache'); await A.narrate('Mein Kopf. Und hier ist keiner. Kein Geist im Treppenhaus, keiner hinter den Wänden. Nur ich.');
  A.sfx('sms'); await A.wait(700); await A.m('Ana.');
  await A.doc({style:'letter',title:'SMS · Ana',lines:['Komm vorbei. Heute. Tobias geht mit den Kindern raus. A.']});
  await A.m('Erst suche ich sie.'); }
M.k4Wake=async function(A,phase){ var G=A.G; phase=phase||G.phase; if (A.flag('k4.wake.'+phase)) return; A.setFlag('k4.wake.'+phase);
  await lock(A,async function(){ var g=G.malaOn && A.malaHere();
    if (g){ var w=M.apos('jwohnung','mala',[340,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    if (phase==='k4_d1') await wakeD1(A,g); else if (phase==='k4_d3') await wakeD3(A,g); else if (phase==='k4_d4') await wakeD4(A,g); else if (phase==='k4_d5') await wakeD5(A); });
  await M.k4DayCheck(A); };
// ---------------------------------------------------------------- Der Džezva-Abend (Christtag): Ruža, „Ich kann lesen“ (z4_lesart); danach geht die Nacht als Mala weiter
async function dzBaka(A,J){ A.setFlag('k4.d1.baka');
  await A.m('Erzähl mir von Baka.'); await A.wait(800);
  await J.say('Von Ruža.'); await A.wait(600); await J.say('Sie hat nie geweint. Nicht, als mein Vater gestorben ist. Nicht im Krieg. Sie hat geputzt. Wenn es schlimm war, hat sie die Fenster geputzt, auch im Winter.');
  await A.wait(500); await J.say('Sie hat das Dach geflickt, mit Planen vom Roten Kreuz. Ich habe ihr Geld geschickt, für ein richtiges Dach. Die Planen hat sie nie abgenommen.');
  await J.say('Seit zweitausenddrei zahle ich weiter.'); await A.m('Für wen?'); await A.wait(900); await J.say('Für das Dach.');
  if (gHere(A)){ await A.wait(400); await A.g('Für das Dach.'); } }
async function dzLesart(A,J){ var G=A.G;
  await A.m('Was hat sie dir damals geschrieben? Dreiundneunzig.'); await A.wait(1400);
  await J.say('Über das Rote Kreuz. Drei Sätze. Mehr ging nicht auf das Formular.'); await A.wait(700);
  await J.say('Dass er Wasser holen gegangen ist. Und nicht zurückgekommen.'); await A.wait(1300);
  await A.narrate('Sie sieht mich an. Gerade, wie Frau Kolar über die Lesebrille.');
  await J.say('Ruža hat geschrieben, er ist nicht zurückgekommen.'); await A.wait(700); await J.say('Nicht, dass er tot ist.'); await A.wait(900); await J.say('Ich kann lesen.');
  A.note('z4_lesart'); A.setFlag('k4.d1.dzezva'); await A.wait(1300);
  var c=await A.choose([{t:'Mama …',id:'mama'},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Mama'});
  if (c==='mama'){ await J.say('Trink. Er wird kalt.'); } else { await A.wait(1300); await J.say('Siehst du. Jetzt schweigst du wie sie.'); }
  if (gHere(A)){ await A.wait(700); await A.g('…'); } }
M.k4Dzezva=async function(A){ var G=A.G; if (F(A,'k4.d1.dzezva')) return;
  var J=A.npc('jasna'), gone=false;
  await lock(A,async function(){
    if (G.malaOn){ var w=M.apos('jwohnung','mala',[340,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    await A.narrate('Christtag, abends. Mama sitzt am Tisch, die Hände um eine leere Tasse, und sieht auf Großmutters Džezva in meiner Hand.');
    await J.say('Mach du. Du kannst das.');
    var s=M.stand('jwohnung','stove')||[260,124,'B']; await A.walkM(s[0],s[1]); await A.faceM('B'); A.set('dzezva',true); A.sfx('boil'); await A.wait(900);
    await J.say('Kaffee kocht man nicht.'); await A.m('Man wartet auf ihn.'); await A.wait(500);
    await A.narrate('Mama lacht. Kurz, durch die Nase.'); await J.say('Das hat sie dir auch gesagt.'); await A.m('Jeden Samstag.');
    await J.say('Mir hat sie es gesagt, als ich sieben war. Ich habe den Kaffee überkochen lassen. Sie hat den Herd geputzt, eine Stunde lang, und kein Wort gesagt.');
    A.sfx('pour'); await A.wait(400); var t=M.stand('jwohnung','table')||[200,124,'B']; await A.walkM(t[0],t[1]); await A.faceM('L'); A.sfx('cup'); });
  await A.menuLoop(function(){ if (F(A,'k4.d1.dzezva')) return []; return [
    {t:'Du hast heute dein Brot vergessen.',once:'dzBr',if:F(A,'k4.g.bread'),go:async function(A){ await J.say('Du hast es mir zur Arbeit gebracht. Die Kolleginnen wollten wissen, wer der Mann ist.'); await A.wait(400); await J.say('Ich habe gesagt: mein Sohn. Sie haben gesagt: Du hast einen Sohn?'); await A.wait(800); await J.say('Iss die Vanilice. Sonst esse ich sie.'); }},
    {t:'Ana hat mich mitgenommen. Zum Rodeln.',once:'dzWa',if:F(A,'k4.d1.walk'),go:async function(A){ await J.say('Sie hat geschrieben. Du bist hingefallen. Mit Absicht, sagt Mia.'); await A.wait(300); await J.say('Mia lügt nicht. Sie ist sieben.'); }},
    {t:'Wie war der Dienst?',once:'dzDi',go:async function(A){ await J.say('Weihnachten im Heim. Kartoffelsalat, Musik vom Band, die keiner hören will, und ein Bewohner, der den ganzen Nachmittag am Aufzug steht.'); await A.wait(400); await J.say('Wie jeden Tag.'); }},
    {t:'Erzähl mir von Baka.',silent:true,if:!F(A,'k4.d1.baka'),go:function(A){ return dzBaka(A,J); }},
    {t:'Was hat Baka dir damals geschrieben? Dreiundneunzig.',silent:true,if:F(A,'k4.d1.baka'),go:async function(A){ await dzLesart(A,J); return 'bye'; }}
  ]; });
  if (!F(A,'k4.d1.dzezva')) return;
  await lock(A,async function(){
    await A.wait(700); await J.say('Ich springe heute Nacht noch ein. Um zehn fängt der Dienst an.'); await A.m('Nach dem Frühdienst? An Weihnachten?'); await J.say('Die Kollegin hat Kinder.');
    A.sfx('steps'); await A.wait(500); await A.narrate('Sie zieht den Mantel an, prüft den Herd, das Bügeleisen, das Fenster. An der Tür bleibt sie stehen und sieht auf die Pantoffeln. Sie rückt sie nicht gerade. Sie stehen gerade.');
    A.sfx('door'); if (J.actor){ J.actor.fadeOut=A.gt; } gone=true; await A.wait(900); if (J.actor) J.hide();
    var s=M.stand('jwohnung','sofa')||[300,126,'L']; await A.walkM(s[0],s[1]); A.idleM('sit');
    if (G.malaOn && A.malaHere()){ await A.g('„Ich kann lesen.“'); await A.wait(500); await A.m('Geh schlafen, Mala. Ich meine: geh, wohin du willst.'); await A.g('Geh du schlafen. Ich gehe noch durch die Wohnung. Nachts darf ich das.');
      await A.narrate('Ich lege mich auf die zu kurze Couch. Mala steht am Fenster und sieht der Straße nach, die Mama hinuntergeht.'); }
    else await A.narrate('Ich lege mich auf die zu kurze Couch. Die Wohnung ist still.'); });
  A.idleM(null);
  if (G.malaOn && G.pos.mala.room==='jwohnung'){ await A.wait(600); await A.switchTo('mala'); await A.wait(300); await A.g('Er schläft. Fast.'); await A.wait(400); await A.g('Die Wohnung ist leer. Nur er und ich. Und die Tür zu ihrem Zimmer, angelehnt.'); }
  await M.k4DayCheck(A); };
// ---------------------------------------------------------------- Kolars Anruf, Dienstag 9:10 (zwei Fassungen; Konzept 4.5 Tag 2, 6.6, 7.3)
M.k4KolarCall=async function(A){ var G=A.G; if (F(A,'k4.d2.kolar')) return; var y=yes(A);
  await lock(A,async function(){
    if (G.malaOn){ var w=M.apos('jwohnung','mala',[340,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    await A.narrate('Dienstag. Tauwetter. Der Schnee auf den Autos ist grau geworden und rutscht in Platten von den Dächern. Mama ist im Frühdienst.');
    await A.wait(600); A.sfx('phone'); await A.wait(1000); await A.m('Neun Uhr zehn. Eine Nummer aus Bosnien.');
    await A.phoneVoice('„Herr Vuković? Kolar. Institut für Vermisste, Mostar.“','kolar'); await A.m('Frau Kolar.');
    await A.phoneVoice('„Ich rufe an, weil ich gesagt habe: Wir rufen an. Daran halte ich mich.“','kolar'); await A.wait(500);
    if (y){ await A.phoneVoice('„Wir haben eine Übereinstimmung. Mit Ihrer Probe aus Mostar.“','kolar'); await A.wait(700);
      await A.phoneVoice('„Und mit einer zweiten. Aus München, von zweitausendvier. Ana Vuković. Ihre Schwester, nehme ich an.“','kolar'); A.note('z4_ana2004');
      await A.wait(800); var a=await A.choose([{t:'Ana hat eine Probe gegeben?',id:'ana'},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Frau Kolar'});
      if (a==='ana') await A.phoneVoice('„Zweitausendvier, über das Rote Kreuz in München. Sie hat nichts weiter angegeben. Nur: Tochter.“','kolar');
      else { await A.wait(1100); await A.phoneVoice('„Sie wussten es nicht.“','kolar'); await A.wait(400); await A.phoneVoice('„Das höre ich oft. Familien wissen viel voneinander. Nur das nicht.“','kolar'); }
      await A.phoneVoice('„Der Fund ist von zweitausenddrei. Ein Grab ohne Namen an der Brauerei in Sarajevo, April dreiundneunzig.“','kolar'); }
    else { await A.phoneVoice('„Sie haben in Mostar keine Probe gegeben. Das weiß ich. Ich habe es aufgeschrieben.“','kolar'); await A.wait(500);
      await A.phoneVoice('„Wir haben trotzdem einen Kandidaten. Ein Grab ohne Namen an der Brauerei in Sarajevo, April dreiundneunzig. Exhumiert zweitausenddrei.“','kolar'); }
    await A.wait(600); await A.phoneVoice('„Bei ihm lag ein Rechenschieber. Eingeritzt: Z. V.“','kolar'); A.note('z4_kolar');
    if (!y){ await A.wait(700); await A.phoneVoice('„Und es gibt eine Probe aus München. Von zweitausendvier. Von wem, darf ich Ihnen nicht sagen. Sie gehört nicht Ihnen.“','kolar'); }
    await A.wait(1000); await A.narrate('Ein Rechenschieber. Er hat damit sogar die Einkaufsliste ausgerechnet.');
    var b=await A.choose([{t:'Das ist er.',id:'is'},{t:'Ein Rechenschieber.',id:'slide'},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Frau Kolar'});
    if (b==='is') await A.phoneVoice('„Das sagen wir, wenn die Proben es sagen. Nicht vorher. Ich weiß, wie das klingt.“','kolar');
    else if (b==='slide') await A.phoneVoice('„Holz, mit einem Schieber aus Kunststoff. Gut erhalten. Holz hält, wenn es trocken liegt.“','kolar');
    else { await A.wait(1300); await A.phoneVoice('„Nehmen Sie sich Zeit. Am Telefon ist Schweigen teuer. Ich zahle.“','kolar'); }
    await A.wait(900); await A.phoneVoice('„Herr Vuković. Wann haben Sie ihn zuletzt gesehen?“','kolar');
    await A.wait(2600); await A.m('Am Neunzehnten. Am Vormittag.'); await A.wait(2200);
    await A.phoneVoice('„Sie waren dabei.“','kolar'); await A.wait(900); await A.narrate('Es ist keine Frage. Ich höre, wie sie schreibt.');
    await A.phoneVoice('„Ich schreibe: Familie kann Datum bestätigen. Mehr schreibe ich nicht.“','kolar'); await A.wait(1100);
    var c=await A.choose([{t:'Meine Großmutter hat damals geschrieben: nije se vratio.',id:'baka'},{t:'Was steht noch in der Akte?',id:'akte'}],{title:'Frau Kolar'});
    if (c==='akte'){ await A.phoneVoice('„Was in jeder Akte steht. Ort, Datum, was man bei ihm gefunden hat. Und was die Familie geschrieben hat, wenn sie geschrieben hat.“','kolar'); await A.wait(500);
      await A.phoneVoice('„Was hat Ihre Familie geschrieben? Damals.“','kolar'); await A.wait(1500); await A.m('Nije se vratio.'); }
    await A.wait(900); await A.phoneVoice('„In den Akten von dreiundneunzig steht oft ‚nije se vratio‘.“','kolar'); await A.wait(700);
    await A.phoneVoice('„Das schreiben Familien, die es wissen und es nicht schreiben können.“','kolar'); A.note('z4_kode'); await A.wait(1400);
    if (!y){ await A.phoneVoice('„Sie sagten in Mostar: heute nicht. Zweimal.“','kolar'); await A.wait(800); await A.phoneVoice('„Ist heute ein anderer Tag?“','kolar');
      await A.wait(2000); await A.m('Ja.'); await A.wait(600);
      await A.phoneVoice('„Dann schicke ich eine Probenkarte an das Generalkonsulat in München. Morgen ist sie da. Ein Stich, ein Tropfen. Eine Sekunde.“','kolar'); A.unlock('konsulat'); }
    await A.phoneVoice(y?'„Im Frühjahr ist die Gerichtsmedizin so weit. Dann rufe ich wieder an.“':'„Wenn Ihre Probe da ist, vergleichen wir. Im Frühjahr rufe ich wieder an.“','kolar'); await A.wait(600);
    await A.phoneVoice('„Und Herr Vuković. Sagen Sie es Ihrer Mutter nicht am Telefon.“','kolar'); A.sfx('hangup'); A.setFlag('k4.d2.kolar'); await A.wait(1300);
    if (G.malaOn && A.malaHere()){ await A.g('Am Neunzehnten.'); await A.wait(900); await A.m('Ja.'); await A.wait(1100); await A.g('Ich frage nicht.'); await A.m('Ich weiß.'); await A.wait(800); }
    if (y) await A.m('Ana hat zweitausendvier eine Probe gegeben. Und nie etwas gesagt.'); else { await A.m('Eine Probe aus München, von zweitausendvier. Mama hat nie eine gegeben.'); await A.wait(500); await A.m('Dann bleibt nur eine.'); }
    await A.wait(400); await A.m('Ana. Ich muss mit Ana reden. Nicht am Telefon.'); });
  await M.k4DayCheck(A); };
// ---------------------------------------------------------------- Dienstagabend: Mama erkennt Sepp („Polako, gospođo“, z4_ankunft)
M.k4JasnaNotice=async function(A){ var G=A.G; if (N(A,'z4_ankunft')) return; var J=A.npc('jasna');
  await lock(A,async function(){
    if (G.malaOn){ var w=M.apos('jwohnung','mala',[340,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    var t=M.stand('jwohnung','table')||[200,124,'B']; A.placeM(t[0],t[1],'L');
    await A.narrate('Dienstagabend. Mama sitzt am Tisch und schält Kartoffeln für morgen, obwohl morgen keiner Kartoffeln will.');
    if (A.has('aushang')){ A.sfx('paper'); await A.narrate('Ich lege Frau Wimmers Aushang neben die Schalen. „Wer kannte diesen Mann?“ Darunter Sepps Foto, mit der Mütze.'); await A.wait(900); await J.say('Den kenne ich.'); }
    else { await A.m('Mama. Am Bahnhof ist ein Mann gestorben. Ein alter Gepäckträger, Mütze mit der Nummer siebzehn. Sie haben ihn Sepp genannt.'); await A.m('Er hieß Giuseppe Ruggiero.');
      await A.wait(1100); await J.say('Siebzehn.'); await A.wait(700); await J.say('Mit einem dünnen Schnurrbart? Und so gerade, als hätte er ein Brett im Rücken?'); await A.m('Ja.'); await A.wait(700); await J.say('Den kenne ich.'); }
    await A.wait(600); await A.narrate('Sie legt das Messer hin.'); await J.say('Der hat zweiundneunzig unsere Tasche getragen. Am Bahnhof. Er wollte kein Geld.');
    await A.wait(500); await J.say('Er hat zwei Wörter von uns gekonnt.'); await A.wait(700); await J.say('Polako, gospođo.'); await A.m('„Langsam, gnädige Frau.“');
    var c=await A.choose([{t:'Erzähl weiter.',id:'more'},{t:'(Zuhören.)',id:'listen',silent:true}],{title:'Mama'});
    if (c==='listen') await A.wait(1200);
    await J.say('Juni zweiundneunzig. Wir sind aus dem Zug gestiegen, Ana an der Hand und eine Tasche, in der alles war. Ich konnte kein Wort Deutsch.');
    await J.say('Und dann kommt ein Mann mit Mütze und sagt in unserer Sprache: langsam.'); await A.wait(800);
    await J.say('Er hat die Tasche bis zur Trambahn getragen. Er hat gewartet, bis wir drin waren. Dann hat er an die Mütze getippt.'); await A.wait(900);
    await J.say('Ich habe ihn nie wieder gesehen. Ich bin zwanzig Jahre jeden Tag an dem Bahnhof vorbeigefahren und habe ihn nie wieder gesehen.'); await A.wait(500); await J.say('Verstehst du das?'); await A.m('Ja.');
    A.note('z4_ankunft'); A.setFlag('k4.d2.notice');
    if (gHere(A)){ await A.wait(900); await A.g('Sie erzählt von der Ankunft.'); await A.wait(500); await A.g('Nicht von der Abfahrt.'); }
    var d=await A.choose([{t:'Und die Abfahrt? In Sarajevo?',id:'ab'},{t:'(Nicht fragen.)',id:'no',silent:true}],{title:'Mama'});
    if (d==='ab'){ await A.wait(1000); await J.say('Iss. Es wird kalt.'); } else { await A.wait(900); await J.say('Die Kartoffeln sind für morgen. Iss trotzdem eine.'); }
    await A.wait(600); await J.say('Wann wird er beerdigt?'); if (N(A,'s4_termin')) await A.m('Am Donnerstag.'); else { await A.m('Das weiß ich noch nicht. Bald.'); await J.say('Sag es mir, wenn du es weißt.'); } await A.wait(700); await J.say('Ich komme mit.'); await A.wait(500); await J.say('Ich will ihm danke sagen. Zwanzig Jahre zu spät. Er wird es mir nicht übel nehmen.');
    A.setFlag('k4.d2.jasnaComes');
    if (A.has('aushang')){ await A.wait(300); await J.say('Gib den Zettel der Frau zurück. Sie braucht ihn noch. Für die anderen, die ihn kannten.'); } });
  await M.k4TalkJasna(A); };
// ---------------------------------------------------------------- Mama an den Abenden (vor allem Dienstag): Suchdienst (z4_antrag von ihr), der zu frühe Versuch
async function suchdienst(A,J){ var G=A.G; await A.m('Hast du ihn je suchen lassen? Beim Suchdienst?'); await A.wait(1200);
  await J.say('Warte.'); var b=M.stand('jwohnung','bedroom')||[360,124,'R']; if (J.actor){ J.idle(null); await J.walk(b[0],b[1]); J.hide(); }
  await A.wait(800); A.sfx('lock'); await A.wait(1400); await A.narrate('Aus dem Schlafzimmer das Geräusch eines kleinen Schlosses. Dann Papier. Dann wieder das Schloss.');
  if (J.actor){ J.show(); var t=M.apos('jwohnung','jasna_table',[200,122,'R']); await J.walk(t[0],t[1]); J.face('R'); J.idle('sit'); }
  A.sfx('paper'); await A.doc({style:'register',title:'DRK-Suchdienst · Suchantrag',lines:['Gesuchte Person: Vuković, Zoran, geb. 1951','vermisst seit: April 1993','Umstände: ist Wasser holen gegangen und nicht','zurückgekommen (laut Nachricht der Schwiegermutter)','','Antragstellerin: Jasna Vuković, München, Januar 1994']});
  A.setFlag('k4.n.antragJasna'); A.note('z4_antrag');
  await J.say('Neunzehnhundertvierundneunzig. Beim Roten Kreuz hier. Jedes Jahr im März schreiben sie: keine neuen Erkenntnisse.'); await A.wait(500); await J.say('Achtzehn Briefe. Ich habe alle.');
  await A.wait(700); await J.say('Und jetzt leg es zurück auf den Tisch. Ich räume es selbst weg.');
  if (gHere(A)){ await A.wait(700); await A.g('…'); } }
var TELL_ALSO=['z4_vermisst','z4_kolar','z4_lesart','z4_ana2004'];
async function tooEarly(A,J){ var n=await A.askNote('Was sage ich ihr?',{also:TELL_ALSO});
  if (!n){ await A.m('Nichts. Noch nicht.'); await J.say('Dann iss.'); return false; }
  if (n==='z4_ana2004'){ await A.m('…'); await A.wait(700); await A.m('Nein. Das ist Anas. Das sagt Ana selbst.'); return false; }
  if (n==='z4_lesart'){ await A.m('Du sagst, Ruža hat nicht geschrieben, dass er tot ist.'); await A.wait(1000); await J.say('Hat sie nicht. Ich kann lesen.'); await A.wait(800); await A.narrate('Sie steht auf.'); await J.say('Ich muss morgen früh zum Dienst.'); return true; }
  if (n==='z4_vermisst'){ await A.m('Ruža hat geschrieben, er ist nicht zurückgekommen. Du hast vermisst daraus gemacht.'); await A.wait(1100);
    await J.say('Ich kann lesen, Marko. Da stand nicht „tot“.'); await A.wait(900); await A.narrate('Sie steht auf. Die Kartoffelschalen bleiben liegen.'); await J.say('Ich muss morgen früh zum Dienst.'); return true; }
  if (n==='z4_kolar'){ await A.m('Frau Kolar hat angerufen. Aus Mostar. Ein Grab an der Brauerei. Ein Rechenschieber.'); await A.wait(1500);
    await J.say('Wer sagt das?'); await A.m('Frau Kolar.'); await A.wait(900); await J.say('Ich habe keine Probe gegeben.'); await A.wait(700); await A.narrate('Sie steht auf.'); await J.say('Ich muss morgen früh zum Dienst.'); return true; }
  await J.say('Was willst du mir sagen, Marko? Das?'); await A.wait(500); await J.say('Iss.'); return false; }
async function toBed(A,J){ A.setFlag('k4.d2.bed'); await J.say('Gute Nacht. Deck dich zu. Die Couch ist kalt.'); var b=M.stand('jwohnung','bedroom')||[360,124,'R']; if (J.actor){ J.idle(null); await J.walk(b[0],b[1]); J.actor.fadeOut=A.gt; } A.sfx('door'); await A.wait(800); if (J.actor) J.hide(); }
M.k4TalkJasna=async function(A){ var J=A.npc('jasna'), G=A.G, p=G.phase;
  if (p==='k4_epi') return M.k4TalkJasnaEpi?M.k4TalkJasnaEpi(A):J.say('Trink deinen Kaffee.');
  if (p==='k4_d1_n' && !F(A,'k4.d1.dzezva')) return M.k4Dzezva(A);
  if (p!=='k4_d2_n') return J.say(A.cycle('tjX',['Iss etwas.','Setz dich. Du stehst wie bei der Post.']));
  var bed=false;
  await A.menuLoop(function(){ if (bed) return []; return [
    {t:'Hast du ihn je suchen lassen? Beim Suchdienst?',silent:true,if:!F(A,'k4.n.antragJasna')&&(N(A,'z4_kode')||N(A,'z4_lesart')),go:function(A){ return suchdienst(A,J); }},
    {t:'Mama. Ich muss dir etwas sagen. Über Tata.',silent:true,once:'tjTell',if:N(A,'z4_kolar'),go:async function(A){ await A.m('Mama. Ich muss dir etwas sagen. Über Tata.'); var gone=await tooEarly(A,J); if (gone){ await toBed(A,J); bed=true; if (gHere(A)){ await A.wait(800); await A.g('Zu früh.'); await A.wait(400); await A.g('Dir fehlt noch etwas. Nicht ihr.'); } return 'bye'; } }},
    {t:'Danke, dass du am Donnerstag mitkommst.',once:'tjDo',if:F(A,'k4.d2.jasnaComes'),go:async function(A){ await J.say('Nicht für dich. Für ihn.'); await A.wait(500); await J.say('Und ein bisschen für mich. Ich war auf keiner Beerdigung seit … ich war lange auf keiner.'); }},
    {t:'War es schlimm, im Heim, heute?',once:'tjHe',go:async function(A){ await J.say('Nicht schlimm. Wie immer. Ein Mann ruft jeden Tag um drei nach seiner Frau.'); await A.wait(500); await J.say('Wir sagen ihm: Sie kommt später. Jeden Tag.'); await A.wait(500); await J.say('Iss.'); }},
    {t:'(Gute Nacht sagen.)',silent:true,bye:true,go:async function(A){ await A.m('Gute Nacht, Mama.'); await toBed(A,J); bed=true; }}
  ]; });
  await M.k4DayCheck(A); };
M.k4GiveVanilice=async function(A){ var J=A.npc('jasna'); if (!A.has('vanilice')) return; await A.animM('give'); A.take('vanilice'); A.setFlag('k4.p.vanilice'); A.sfx('paper');
  await A.m('Die hier ist von Nada. Ich trage sie seit Heiligabend mit mir herum. Sie hat gesagt: von Nada, vom Neunten.'); await A.wait(800);
  await J.say('Seit Heiligabend.'); await A.wait(500); await J.say('Nada Delić. Nach neunzehn Jahren schickt sie Vanilice. Und du trägst sie eine Woche spazieren.'); await A.wait(500); await J.say('Gib her.');
  if (gHere(A)) await A.g('Mama hätte gelacht.'); };
// ---------------------------------------------------------------- Donnerstagabend: Mala verrät sich, der Streit (Konzept 4.5 Tag 4, 5.3)
M.k4Fight=async function(A){ var G=A.G; if (F(A,'k4.d4.fight')) return;
  await lock(A,async function(){
    var s=M.stand('jwohnung','stove')||[260,124,'B']; A.placeM(s[0],s[1],'B');
    if (G.malaOn){ A.placeG(s[0]+22,s[1]-3,'L'); }
    await A.narrate('Donnerstagabend. Mama ist früh ins Bett gegangen. Nach dem Abschied am Bahnhof und dem Nachmittag im Heim hat sie kaum etwas gesagt. Nur an der Tür: „Danke, dass ich mitdurfte.“');
    A.sfx('pour'); await A.wait(600); await A.narrate('Ich spüle. Mamas Brotdose ist dabei, blau, mit dem Zettel auf dem Deckel: „J. V.“, in roter Schrift. Mala steht neben mir und sieht zu, wie ich die Dose abtrockne.');
    await A.wait(1100); await A.g('Blau, mit roter Schrift.'); await A.wait(900); await A.g('Wie die Kanister.');
    await A.wait(1800); await A.narrate('Ich höre auf zu trocknen.'); await A.wait(500);
    await A.m('Welche Kanister?'); await A.wait(1300); await A.g('…'); await A.wait(500);
    await A.m('Ich habe nie von Kanistern geredet. Nicht in Mostar. Nicht hier. Nie.'); await A.g('Marko.');
    var c=await A.choose([{t:'Woher weißt du das?',id:'how'},{t:'Du warst in Mamas Kiste.',id:'box'},{t:'(Die Dose hinstellen.)',id:'quiet',silent:true}],{title:'Mala'});
    if (c==='how') await A.g('Aus der Kiste.'); else if (c==='box') await A.g('Am Sonntag. In der Nacht.'); else { await A.wait(1100); await A.g('Aus der Kiste. Am Sonntag, als du geschlafen hast.'); }
    A.setFlag('k4.d4.slip'); await A.wait(700); await A.m('Was hast du gelesen?'); await A.wait(800);
    await A.g('Eine Nachricht vom Roten Kreuz. Von Ruža. „Nije se vratio.“'); await A.wait(500);
    await A.g('Ruža wollte „poginuo“ schreiben. Ein Junge hat sie gebeten, es nicht zu tun. Mit deiner Stimme. Mit der hohen.'); await A.wait(700);
    await A.g('Einen Suchantrag. „Vermisst seit April dreiundneunzig.“ Und einen Passierschein. Deine Mutter am Busfenster. Bis zur Kurve.');
    A.setFlag('k4.r.shared'); await A.wait(1200);
    await A.narrate('Ich stelle die Dose ab. Sehr vorsichtig, als könnte sie zerbrechen. Sie ist aus Plastik.');
    await A.m('Seit Sonntag.'); await A.g('Seit Sonntag.');
    var d=await A.choose([{t:'Du hast in meinem Leben gelesen wie in einem Ort.',id:'ort'},{t:'Warum hast du nichts gesagt?',id:'why'}],{title:'Mala'});
    if (d==='why'){ await A.g('Du hast gesagt: frag nicht. Ich habe nicht gefragt.'); await A.m('Und gelesen.'); await A.wait(600); await A.m('Du hast in meinem Leben gelesen wie in einem Ort.'); }
    await A.wait(900); await A.g('Du hast in meinem Tod gelesen.'); await A.wait(600);
    await A.g('Siebzehn Jahre wolltest du nichts wissen, und dann hast du alles gelesen. Den Fluss, das Seil, das Schilf.');
    await A.m('Du hast es fünf Tage gewusst.'); await A.g('Und du achtzehn Jahre.'); await A.m('Das ist etwas anderes.');
    await A.wait(900); await A.g('Ja.'); await A.wait(800); await A.g('Bei mir waren es nur fünf Tage.');
    await A.wait(2200); A.music('k4_streit'); await A.narrate('Mala geht. Nicht durch die Tür. Sie geht einfach, und wo sie stand, ist nur noch die Küche.');
    A.malaLeave(); await A.wait(1100); A.headache(4000); await A.animM('headache');
    await A.narrate('Mein Kopf tut weh. Und diesmal ist kein anderer Geist in der Nähe.'); A.setFlag('k4.d4.fight');
    await A.wait(900); await A.m('Mala?'); await A.wait(1600); await A.narrate('Nichts. Gegenüber geht das Licht aus, bei der Frau, die bügelt.'); });
  await M.k4DayCheck(A); };
// ---------------------------------------------------------------- Das Handy (12_k4_items.js zeigt die Kontakte)
var DAYS=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'];
M.K4PHONE=M.K4PHONE||{};
M.K4PHONE.jasna=async function(A){ var G=A.G, p=G.phase; A.sfx('dial'); await A.wait(900);
  if (DAYS.indexOf(p)<0){ await A.m(p==='k4_epi'?'Sie sitzt mir gegenüber. Ich rufe nicht an.':'Sie ist im Zimmer nebenan. Oder sie schläft. Ich rufe nicht an.'); A.sfx('hangup'); return; }
  if (p==='k4_d1' && !F(A,'k4.d1.bread')){ await A.phoneVoice('„Marko? Ich bin bei der Arbeit. Ist was passiert?“','jasna'); await A.m('Nein. Ich wollte nur …'); await A.phoneVoice('„Ich habe mein Brot vergessen. Egal. Frau Obermüller hat Kuchen. Ich esse Kuchen.“','jasna'); }
  else if (p==='k4_d1' && !F(A,'k4.g.bread')){ await A.phoneVoice('„Du hast meine Brotdose? Dann bring sie. Oder iss sie selbst. Nein. Bring sie.“','jasna'); }
  else if (p==='k4_d4'){ await A.phoneVoice('„Um zehn am Bahnhof. Ich bin schon unterwegs. Zieh das blaue Hemd an.“','jasna'); }
  else if (p==='k4_d5'){ await A.phoneVoice('„Marko? Du klingst wie nach zehn Stunden Bus.“','jasna'); await A.wait(400); await A.phoneVoice('„Hast du gegessen? Auf dem Tisch steht Kaffee.“','jasna'); await A.m('Ja, Mama.'); }
  else { await A.phoneVoice('„Marko? Ich bin bei der Arbeit. Ist was passiert?“','jasna'); await A.m('Nein. Nichts.'); await A.phoneVoice('„Dann bis heute Abend. Es gibt Suppe.“','jasna'); }
  A.sfx('hangup'); };
M.K4PHONE.ana=async function(A){ var G=A.G, p=G.phase; A.sfx('dial'); await A.wait(900);
  if (p==='k4_pro') await A.phoneVoice('„Ich backe. Mehl bis zu den Ellbogen. Wir sehen uns heute Abend. Bring Mama mit, pünktlich, sie kommt sonst nie pünktlich.“','ana');
  else if (p==='k4_d1' && !F(A,'k4.d1.walk')) await A.phoneVoice('„Wir sind auf der Wiesn. An der Bavaria. Komm, bevor Niko den ganzen Schnee gegessen hat.“','ana');
  else if (p==='k4_d2' && !F(A,'k4.d2.ana')) await A.phoneVoice('„Ich habe um zwölf Mittagspause. Bei mir zu Hause, die Praxis ist um die Ecke. Was immer es ist: nicht am Telefon.“','ana');
  else if (p==='k4_d5' && !F(A,'k4.d5.ana')) await A.phoneVoice('„Ich hab’s dir geschrieben. Komm vorbei. Heute.“','ana');
  else if (DAYS.indexOf(p)<0){ await A.m('Ana ist hier. Oder schläft. Ich rufe nicht an.'); A.sfx('hangup'); return; }
  else await A.phoneVoice('„Ich hab gerade beide Hände voll Kind. Schreib mir.“','ana');
  A.sfx('hangup'); };
M.K4PHONE.nada=async function(A){ var G=A.G, p=G.phase; A.sfx('dial'); await A.wait(1300);
  if (p==='k4_epi'){ await A.m(A.flag('k4.e.nada')?'Mama hat sie angerufen. Heute rede ich nicht dazwischen.':'Nicht ich. Nada wartet seit neunzehn Jahren auf einen Anruf aus dem siebten Stock. Von Mama.'); A.sfx('hangup'); return; }
  if (A.first('!k4.nada1')){ await A.phoneVoice('„Mali? Bist du angekommen?“','nada'); await A.m('Ja. In München.');
    await A.phoneVoice(F(A,'k4.p.vanilice')?'„Hat sie die Dose bekommen?“':'„Hast du ihr die Dose gegeben?“','nada');
    if (F(A,'k4.p.vanilice')){ await A.m('Sie hat eins gegessen. Sie sagt, du nimmst zu viel Zucker.'); await A.wait(900); await A.phoneVoice('„Immer noch?“','nada'); await A.m('Immer noch.'); await A.wait(700); await A.phoneVoice('„Gut.“','nada'); }
    else { await A.m('Noch nicht.'); await A.phoneVoice('„Dann gib sie ihr. Vanilice werden nicht besser, wenn sie reisen.“','nada'); }
    if (gHere(A)){ await A.wait(700); await A.g('Mama.'); await A.wait(500); await A.g('Sag ihr nichts von mir. Sag ihr, es schneit.'); await A.m('Hier schneit es, teta Nada.'); await A.phoneVoice('„Bei uns auch. Seit gestern. Ich habe ihr Zimmer gelüftet. Der Schnee ist hereingekommen.“','nada'); } }
  else { await A.phoneVoice(A.cycle('k4nd',['„Mali. Ich lüfte ihr Zimmer. Jeden Tag. Die Kolar sagt: Januar. Kein Datum. Ich habe trotzdem den Mantel gebügelt.“','„Mali? Ist etwas passiert?“ – „Nein.“ – „Dann ruf nicht an, wenn nichts passiert ist. Ich erschrecke jedes Mal.“']),'nada');
    if (gHere(A) && A.first('!k4.nada2')){ await A.wait(600); await A.g('Sie bügelt den Mantel. Den zu großen.'); } }
  A.sfx('hangup'); };
M.K4PHONE.kolar=async function(A){ var G=A.G; A.sfx('dial'); await A.wait(1100);
  if (!yes(A) && !F(A,'k4.e.sample2')) await A.phoneVoice('„Institut, Kolar. Die Karte ist im Konsulat, ab Mittwoch. Ein Stich, eine Sekunde, Herr Vuković.“','kolar');
  else await A.phoneVoice(A.cycle('k4kl',['„Institut, Kolar. Ich melde mich im Frühjahr. Sie wissen, was Sie wissen. Mehr weiß ich auch nicht.“','„Kolar. Wir zählen, Herr Vuković. Das dauert. Ich rufe an.“']),'kolar');
  A.sfx('hangup'); };
// ---------------------------------------------------------------- nach dem Laden: Szenen, die unterbrochen wurden, laufen weiter, sobald nichts anderes läuft (rooms/*.js: resume)
M.K4REACT=M.K4REACT||{};
function inRoom(A,r){ return A.room && A.room.id===r; }
M.K4REACT['s1.eve']=async function(A){ if (inRoom(A,'ana') && A.G.phase==='k4_pro_n' && !F(A,'k4.p.eveIntro')) await M.k4Eve(A); };
M.K4REACT['s1.talk1']=async function(A){ if (inRoom(A,'jwohnung') && A.G.phase==='k4_pro_n' && F(A,'k4.p.eve') && !F(A,'k4.p.talk1')) await M.k4Talk1(A); };
M.K4REACT['s1.wake']=async function(A){ var p=A.G.phase; if (inRoom(A,'jwohnung') && !F(A,'k4.wake.'+p) && ['k4_d1','k4_d3','k4_d4','k4_d5'].indexOf(p)>=0) await M.k4Wake(A,p); };
M.K4REACT['s1.dzezva']=async function(A){ if (inRoom(A,'jwohnung') && A.G.phase==='k4_d1_n' && !F(A,'k4.d1.dzezva')) await M.k4Dzezva(A); };
M.K4REACT['s1.kolar']=async function(A){ if (inRoom(A,'jwohnung') && A.G.phase==='k4_d2' && !F(A,'k4.d2.kolar')) await M.k4KolarCall(A); };
M.K4REACT['s1.notice']=async function(A){ if (inRoom(A,'jwohnung') && A.G.phase==='k4_d2_n' && !N(A,'z4_ankunft')) await M.k4JasnaNotice(A); };
M.K4REACT['s1.fight']=async function(A){ if (inRoom(A,'jwohnung') && A.G.phase==='k4_d4_n' && !F(A,'k4.d4.fight')) await M.k4Fight(A); };
M.K4REACT['s1.epi']=async function(A){ if (inRoom(A,'jwohnung') && A.G.phase==='k4_epi' && !F(A,'k4.e.done') && M.k4Epilogue) await M.k4Epilogue(A); };
})(M);
