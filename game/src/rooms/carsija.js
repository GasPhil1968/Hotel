/* ===== rooms/carsija.js — Baščaršija: die Endstation der Drei, Mala auf der Bank, Rade im Häuschen, Damir in der Pause, die letzte Nacht ===== */
(function(M){
'use strict';
var P=M.P;
function day(G){ return ['k2_pro','k2_s1','k2_s2','k2_s3','k2_fin'].indexOf(G.phase)>=0; }
function radeHere(G){ return day(G) || G.phase==='k2_fin_n'; }
function damirHere(G){ return G.phase==='k2_s3'; }
function benchMala(G){ return G.phase==='k2_pro' && G.flags['k2.p1.rode'] && !G.flags['k2.p2.back']; }
// ---------------------------------------------------------------- Mala auf der Bank (Prolog)
async function talkBench(A){ var B=A.npc('malaBench');
  if (A.first('mbFirst')){ await A.m('Mala.'); await A.wait(800); await B.say('Ich warte auf die Drei.'); await A.m('Hier fährt alle zehn Minuten eine Drei.'); await B.say('Ich weiß. Ich steige nicht ein.'); await A.m('Worauf wartest du dann?');
    await A.wait(900); await B.say('Ich weiß nicht, auf wen.'); A.note('p2_bench'); await A.wait(500); await B.say('Ich bin aus dem Bus gestiegen, als die Hochhäuser kamen. Ich bin einfach gegangen, durch die Stadt, bis hierher. Ich weiß nicht, warum hierher.'); return; }
  await A.menuLoop(function(){ return [
    {t:'Komm mit. Wir suchen uns ein Zimmer.',once:'mb1',go:async function(A){ await B.say('Geh du. Ich bleibe noch.'); await A.m('Du bist an mich gebunden. Hast du gesagt.'); await B.say('Ich weiß. Darum tut es weh, wenn du gehst. Geh trotzdem nicht.'); }},
    {t:'Kennst du diese Haltestelle?',once:'mb2',go:async function(A){ await B.say('Die Bank kenne ich. Die Bank war immer kalt.'); await A.wait(600); await B.say('Man hat sich trotzdem hingesetzt, weil man zu zweit war.'); }},
    {t:'Warum steigst du nicht ein?',once:'mb3',go:async function(A){ await B.say('Weil es die falsche ist. Jede ist die falsche.'); await A.m('Rade sagt, jede ist die Drei.'); await B.say('Dann ist es die falsche Zeit.'); }},
    {t:'(Neben ihr stehen bleiben.)',once:'mb4',silent:true,go:async function(A){ await A.wait(1600); A.sfx('tramBell'); await A.wait(1200); await B.say('Hörst du? Die Glocke.'); await A.m('Sie läutet, wenn sie anfährt.'); await B.say('Samstags hat sie für uns geläutet.'); await A.m('Für wen?'); await B.say('…'); }},
    {t:'Ich gehe ein Stück.',bye:true,go:async function(A){ await B.say('Komm wieder.'); }}
  ]; }); }
async function showTicket(A){ var B=A.npc('malaBench'); A.setFlag('k2.p2.shown');
  await A.m('Hier. Mein Fahrschein. Ich habe ihn in der Eins entwertet.'); await A.wait(700); await B.say('Löcher.'); await A.wait(900);
  await A.memory({title:'Splitter',tint:'ghost',draw:M.mem&&M.mem.k2_saturday,lines:['Ein Fahrschein mit Löchern, in einer Kinderhand.','Ein Samstag. Die Bahn schaukelt. Zwei Hände an derselben Stange, eine große und eine kleine.','„Wir.“']});
  await B.say('Samstags.'); await B.say('Wir.'); A.note('m2_f_saturday'); await A.wait(700); await A.m('Wer, wir?'); await B.say('Ich weiß es nicht. Aber es war ein Wir.');
  await A.wait(800); await B.say('Ich komme mit.'); // Mala steht auf, wird wieder die Begleiterin
  var x=B.actor?Math.round(B.actor.x):80, y=B.actor?Math.round(B.actor.y):122; if (B.actor) B.actor.fadeOut=A.gt; await A.wait(300); A.despawn('malaBench');
  A.malaJoin({x:x,y:y,f:'R',fadeIn:false}); A.setFlag('k2.p2.back'); A.sfx('shimmer'); await A.wait(400); await A.g('Danke, dass du mich nicht in die Bahn gesetzt hast.'); await A.m('Du hättest dich nicht setzen lassen.'); await A.g('Nein.');
  A.save(); }
// ---------------------------------------------------------------- Rade
async function talkRade(A){ var R=A.npc('rade'), p=A.G.phase;
  if (p==='k2_fin_n') return radeNight(A,R);
  await A.menuLoop(function(){ return [
    {t:'Fährt heute noch eine besondere Drei?',once:'rd1',if:p==='k2_pro',go:async function(A){ await R.say('Besondere?'); await R.say('Jede ist die Drei. Ilidža – Baščaršija, alle zehn Minuten, seit hundertdreißig Jahren. Fast.'); await R.say('Die Pferde waren langsamer. Und es gab Jahre, in denen keine fuhr.'); }},
    {t:'Ich suche Kovači. Eine Pension, Hajra Mešić.',once:'rd2',if:p==='k2_pro',go:async function(A){ await R.say('Hajra! Die Tante von halb Sarajevo. Die Gasse da hinauf, dann rechts, wo die Grabsteine sind. Sie wird Sie füttern, bis Sie platzen.'); A.unlock('pansion'); A.unlock('carsija'); A.setFlag('k2.p3.way');
        await R.say('Wie heißen Sie eigentlich?'); await A.m('Vuković. Marko.'); await A.wait(600); await R.say('Vuković.'); await R.say('Ich hatte eine Ruža Vuković, aus Vratnik. Jeden Samstag mit der Drei, und dann zu Fuß den Berg hinauf, mit zwei Taschen. Ihr Enkel …');
        await A.wait(700); await R.say('Ihr Enkel war ein kleiner Kerl. Er wollte immer vorn sitzen.'); await A.m('…'); await A.m('Das war meine Großmutter.'); await R.say('Dann grüßen Sie sie.'); await A.m('Sie ist vierundneunzig gestorben.'); await R.say('Ah.'); await A.wait(700); await R.say('Dann grüßen Sie sie trotzdem.'); A.note('p2_rade_ruza'); }},
    {t:'Wie geht die Uhr an der Sahat-kula?',once:'rd3',if:A.hasNote('s1_clock')&&!A.hasNote('s1_alaturka'),go:async function(A){ await R.say('Nach dem Mond. Nach der Sonne. Nach Gott, was weiß ich. Ich habe Fahrpläne, ich brauche keine Kula.'); await R.say('Fragen Sie in der Kafana daneben. Die leben unter der Uhr.'); }},
    {t:'(Ihm das Foto zeigen.)',if:A.has('photo_stop')&&!A.hasNote('m2_clocktower'),go:function(A){ return radePhoto(A,R); }},
    {t:'Fuhren im November dreiundneunzig Straßenbahnen?',if:A.hasNote('m2_ticket')&&!A.hasNote('m2_notrams'),go:function(A){ return radeNoTrams(A,R); }},
    {t:'Kannten Sie Alija, den Kiosk in Alipašino?',once:'rd5',if:A.hasNote('m2_alija'),go:async function(A){ await R.say('Alija Hodžić? Jeder kannte Alija. Er hat die Fahrscheine mit einer Sternzange gelocht, damit man sie nicht zweimal verkaufen konnte. Mit einem Stern!'); await R.say('Fünfundneunzig. Im Sommer. Vor seinem Kiosk.'); await A.wait(800); await R.say('Danach hat keiner mehr den Kiosk aufgemacht.'); }},
    A.askOpt({ m2_photo:function(A){ return radePhoto(A,R); }, m2_ticket:function(A){ return radeNoTrams(A,R); }, m2_f_voice:async function(A){ await R.say('„Halt dich fest“? Das hat jede Mutter in meiner Bahn gerufen. Und jede große Schwester.'); },
      m2_kids:'Zwei Kinder, jeden Samstag. Ich weiß, ich bin alt. Aber ich vergesse keine Fahrgäste.', p2_rade_ruza:'Ruža hatte immer Bonbons in der Manteltasche. Für mich, sagte sie. Für den Fahrer.',
      s1_alaturka:'Die Kula? Fragen Sie mich nach der Drei.', m2_building:'Das Siebener. Das war das Haus mit der Uhr. Ich habe sie von der Haltestelle aus gesehen, wenn wir zu spät waren. Wir waren immer zu spät.',
      m2_mali:async function(A){ await R.say('Mali.'); await A.wait(800); await R.say('Das waren Sie?'); await A.m('Ich glaube, ja.'); await R.say('Dann haben Sie sich nicht verändert. Sie sitzen immer noch so, als wollten Sie aussteigen.'); } },'Dazu weiß ich nichts. Ich weiß nur Fahrpläne.'),
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await R.say(A.cycle('rdBye',['Die nächste kommt in sieben Minuten.','Sretno.','Nicht auf die Gleise treten. Die Bahn bremst nicht für Übersetzer.'])); }}
  ]; }); }
async function radePhoto(A,R){ A.setFlag('k2.m1.radePhoto'); await R.say('Zeigen Sie.'); await R.anim('write'); await A.wait(600); await R.say('Alipašino Polje. Die alte Haltestelle. Die ist nach dem Krieg verlegt worden, dreihundert Meter nach Westen.'); A.note('m2_stop');
  await R.say('Und das hier, die Uhr auf dem Dach … nur ein Hochhaus hatte so eine. Das Siebener, in der B-Phase. Leuchtende Ziffern, grün. Man sah sie von der ganzen Strecke.'); await R.say('Zweiundneunzig ist sie ausgebrannt. Seitdem steht sie.'); A.note('m2_clocktower');
  await A.wait(700); await R.say('Samstags um 11:10 bin ich da jahrelang gefahren. Da stiegen immer zwei Kinder ein. Ein Mädchen und ein kleiner Junge. Sie hat ihn „Mali“ genannt, und er sie „Mala“, damit sie sich ärgert.'); A.note('m2_kids');
  await R.say('Sie hat sich nie geärgert. Sie hat gelacht.'); if (A.G.malaOn){ await A.wait(800); await A.g('…'); } }
async function radeNoTrams(A,R){ await R.say('Im November dreiundneunzig?'); await A.wait(700); await R.say('Mein Herr. Im November dreiundneunzig fuhr keine einzige Straßenbahn. Nicht eine. Die Wagen standen ausgebrannt im Depot, die Leitungen lagen auf der Straße.');
  await R.say('Die erste Drei nach dem Krieg ist im März vierundneunzig gefahren. Ich saß drin, als Fahrer. Die Leute haben geweint. Erwachsene Leute, wegen einer Straßenbahn.'); A.note('m2_notrams'); }
async function radeNight(A,R){ if (A.first('rdN')){ await R.say('Die letzte Drei. 23 Uhr 40, Damir, pünktlich.'); await R.anim('write'); await R.say('Ich trage jede Fahrt ein. Seit einunddreißig Jahren.'); await A.wait(700); await R.say('Dva putnika.'); await A.m('Zwei Fahrgäste?'); await R.say('Ich zähle, was ich sehe.'); await A.wait(800); await R.say('Heute sehe ich schlecht.'); return; }
  await R.say(A.cycle('rdN2',['Gehen Sie nach Hause, Vuković. Es schneit.','Sretno, Mali.'])); }
// ---------------------------------------------------------------- Damir (Dritter Fall)
async function talkDamir(A){ var D=A.npc('damir');
  if (A.flag('k2.s3.damir')) return D.say(A.cycle('dmY',['Um neun. Ich hab’s gesagt.','Ich komme. Ich fahre ja sowieso nach Alipašino.']));
  await A.menuLoop(function(){ return [
    {t:'Sie waren in der Kellerschule in Haus 7.',if:A.hasNote('s3_register'),once:'dm1',go:async function(A){ await D.say('Wer sagt das?'); await A.m('Das Klassenbuch. Damir Kovač, dritte Klasse.'); await D.anim('smoke'); await D.say('Dritte Klasse. Bei Kerzenlicht. Ja. Und?'); }},
    {t:'Zora ruft heute Abend die Namen auf. Ein letztes Mal.',if:A.hasNote('s3_register')&&A.hasNote('s3_stamp'),go:async function(A){ await D.say('Zora ist seit dreizehn Jahren tot.'); await A.m('Ich weiß.'); await D.say('Ich fahre nach vorn, nicht zurück. Wer zurückschaut, fährt gegen die nächste Bahn.');
        if (!A.has('dnevnik')){ await A.m('…'); return; } await A.m('Darf ich Ihnen etwas zeigen?'); }},
    {t:'(Ihm das Klassenbuch zeigen.)',if:A.has('dnevnik'),go:function(A){ return damirBook(A,D); }},
    A.askOpt({ s3_guilt:'Mirza? Der hat nie darüber geredet. Ich auch nicht.', s3_rescued:'Sie ist raus. In die Splitter. Das weiß jeder aus dem Keller. Keiner hat es ihr je gesagt.', s3_zora:'Zora. Wir haben sie „Kreide“ genannt. Sie hatte immer welche an den Fingern.' },'Ich bin Straßenbahnfahrer, kein Pfarrer.'),
    {t:'Gute Fahrt.',bye:true,go:async function(A){ await D.say('Die Drei fährt immer gut. Es sind die Leute.'); }}
  ]; }); }
async function damirBook(A,D){ await A.m('Hier. Seite drei. Unter „Likovno“, Zeichnen.'); await A.wait(700); await A.narrate('Zwischen den Seiten liegt ein Blatt: eine Straßenbahn mit Buntstift, viel zu viele Fenster. Darunter „Damir K., 3. r.“ und, in einer anderen Schrift, eine Fünf.');
  await D.say('…'); await A.wait(900); await D.say('Das ist meine.'); await D.say('Die Helferin hat uns Straßenbahnen malen lassen. Damit wir an etwas denken, das fährt.'); await A.wait(800);
  await D.say('Ich bin Straßenbahnfahrer geworden.'); await A.wait(700); await D.say('Um neun hab ich Schluss. Ich komme.'); A.setFlag('k2.s3.damir'); A.sfx('note'); A.save(); await M.k2CheckS3Night(A); return 'bye'; }
// ---------------------------------------------------------------- Die letzte Nacht: an der Bank
async function finalBench(A){ if (A.flag('k2.f2.ride')) return; A.setFlag('k2.f2.ride'); A.G.flags['mala.lock']=true;
  var b=M.stand('carsija','bench')||[80,124,'L']; await A.walk(b[0]+18,b[1]); await A.face('L'); var mp=M.apos('carsija','mala',[70,120,'R']); A.placeG(mp[0],mp[1],'R'); A.idleG('sit');
  if (A.has('ticket_l')||A.has('ticket_m')){ await A.m('Ich gebe ihr beide Fahrscheine. Ihren und meinen.'); A.take('ticket_l'); A.take('ticket_m'); await A.narrate('Sie legt sie in ihre Dose, nebeneinander, und macht den Deckel zu.'); }
  await A.wait(800); await A.g('Hier habe ich gesessen, als ich nicht wusste, auf wen ich warte.'); await A.m('Und jetzt?'); await A.g('Jetzt weiß ich es.'); await A.wait(900);
  await A.g('Ich bin Lana. Lana Delić, neunter Stock. Ich habe dir das Zeichnen beigebracht, und du hast es nie gelernt.'); await A.m('Die Räder.'); await A.g('Die Räder.'); await A.wait(1100);
  await A.g('Ich bin im Januar losgefahren. Von Split. Ich wollte dich holen.'); await A.wait(700); await A.g('Ein Lastwagen hat mich mitgenommen. Mit Mehl und Decken. Es war Nacht. Der Fahrer hat geraucht und nichts gesagt.');
  await A.memory({title:'Splitter',tint:'ghost',draw:M.mem&&M.mem.k2_bridge,lines:['Ein Lastwagen in der Nacht. Mehlsäcke, Decken, der Geruch von Diesel.','Ein Fluss, grün und laut, tief unten.','Eine Brücke, die nicht mehr da war.','Wasser.']}); A.note('f2_bridge');
  await A.g('Dann weiß ich nichts mehr.'); await A.wait(900); await A.m('Ich finde es heraus.'); await A.g('Ich weiß.'); await A.wait(800);
  await A.g('Spürst du das?'); await A.m('Was?'); await A.g('Meine Leine. Sie zeigt nicht mehr nach Osten.'); await A.wait(600); A.sfx('shimmer'); await A.g('Sie zeigt nach Südwesten.'); await A.m('Mostar.'); await A.g('Ich glaube, ja.');
  A.idleG(null); A.G.flags['mala.lock']=false; A.save(); await A.wait(800); await M.k2StartEpilogue(A); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Die Straße hinaus, an der Miljacka entlang.',canExit:async function(A){ if (A.G.phase==='k2_pro' && !A.flag('k2.p2.back')){ await A.m('Nicht ohne Mala.'); return false; } if (A.G.phase==='k2_fin_n' && A.flag('k2.f2.rideEnd') && !A.flag('k2.f2.ride')){ await A.g('Noch nicht. Komm zur Bank.'); return false; } return true; }},
 {id:'lane_kula',name:'Gasse zur Sahat-kula',exit:{to:'kula'},look:'Eine Gasse zwischen Holzläden. Über den Dächern der Uhrturm.',canExit:async function(A){ if (A.G.phase==='k2_pro' && !A.flag('k2.p2.back')){ await A.m('Erst Mala.'); return false; } if (A.G.phase==='k2_fin_n'){ await A.g('Nicht heute.'); return false; } A.unlock('carsija'); return true; },
   g:{look:'Da hinten ist ein Turm, der falsch geht. Für mich geht er richtig.'}},
 {id:'lane_kazan',name:'Kazandžiluk',exit:{to:'kazandziluk'},look:'Die Gasse der Kupferschmiede. Man hört sie, bevor man sie sieht.',canExit:async function(A){ if (A.G.phase==='k2_pro'||A.G.phase==='k2_pro_n'){ await A.m('Die Läden sind zu. Morgen.'); return false; } if (A.G.phase==='k2_fin_n'){ await A.g('Nicht heute.'); return false; } return true; },
   g:{look:'Hämmer. Wie ein Herz aus Kupfer.'}},
 {id:'rade',npc:'rade',name:'Rade',hgt:48,vis:function(S,G){ return radeHere(G); },talk:talkRade,
   look:function(A){ return A.m(A.G.phase==='k2_fin_n'?'Rade, im Schnee vor seinem Häuschen, das Heft unter dem Arm. Er wartet auf die letzte Drei.':'Ein hagerer Mann in GRAS-Uniform vor einem Blechhäuschen. Er sieht auf die Uhr, auf das Gleis, auf sein Heft. In dieser Reihenfolge.'); },
   give:{ photo_stop:function(A){ return radePhoto(A,A.npc('rade')); }, tramkarta_v:'Rade: „Entwertet. Sehr gut. Sie wären überrascht, wie wenige das tun.“', ticket_m:function(A){ return radeNoTrams(A,A.npc('rade')); } },
   g:{look:'Er zählt die Bahnen, damit keine verloren geht.',listen:async function(A){ await A.g('Er summt. Ein Lied von früher. Ich kenne es. Ich kenne den Text nicht mehr.'); }}},
 {id:'malaBench',npc:'malaBench',name:'Mala',hgt:40,vis:function(S,G){ return benchMala(G); },talk:talkBench,
   look:'Mala, auf der Bank der Drei. Sie sitzt nicht wie jemand, der wartet. Sie sitzt wie jemand, der auf etwas hört.',
   give:{ tramkarta_v:function(A){ return showTicket(A); }, tramkarta:'Sie sieht den Fahrschein nicht einmal an. Er ist noch ganz.', dzezva:'Mala: „Kaffee. Jemand hat mir Kaffee gekocht. Mit viel zu viel Zucker.“', km:'Mala: „Geld war nie das, was gefehlt hat.“' }},
 {id:'bench',name:'Bank',look:function(A){ return A.m(benchMala(A.G)?'Die Bank der Drei. Mala sitzt darauf.':'Eine kalte Bank an der Haltestelle. Holzlatten auf Eisen. Wer sich setzt, wird gesehen.'); },
   use:async function(A){ if (A.G.phase==='k2_fin_n' && A.flag('k2.f2.rideEnd')) return finalBench(A); return A.m('Ich setze mich nicht. Nicht hier.'); },
   g:{look:function(A){ return A.g(A.G.phase==='k2_fin_n'?'Meine Bank.':'In die Latte hat jemand „L + M“ geritzt. Ganz klein. Ich kenne die Hand nicht. Doch.'); },sense:'Zwei, die sich hier immer hingesetzt haben, weil die Bahn zu spät war. Sie war immer zu spät.'}},
 {id:'tram_stop',name:'Haltestelle',look:'„BAŠČARŠIJA“. Endstation. Die Gleise machen hier eine Schleife und fahren wieder zurück, als hätten sie es sich anders überlegt.',
   use:async function(A){ if (A.G.phase==='k2_fin_n') return A.m('Die Drei ist da gewesen. Heute fährt keine mehr.'); return A.m('Ich will nirgendwohin, wohin die Drei fährt. Noch nicht.'); },
   g:{look:'Da hinten auf dem alten Schild stand eine Drei. Ganz groß. Für Kinder, die noch nicht lesen konnten.'}},
 {id:'tracks',name:'Gleisschleife',look:'Die Gleise biegen um ein Häuschen herum und laufen zurück. Zwischen den Schienen Moos und Taubenfedern.',g:{look:'Wir sind an der Schleife immer sitzen geblieben, damit sie uns umsonst zurückfährt.'}},
 {id:'booth',name:'Fahrdienstleiter',look:'Ein Häuschen aus Blech und Glas, gerade groß genug für einen Stuhl, ein Telefon und einen Mann.',open:'Das ist Rades Reich. Ohne Einladung gehe ich da nicht hinein.',g:{look:'Drinnen hängt ein Kalender von 1987. Er hat ihn nicht abgenommen.'}},
 {id:'booth_window',name:'Fenster',look:'Hinter dem Fenster ein Vorhang, eine Thermoskanne, ein Heft mit Spalten: Uhrzeit, Linie, Fahrer, „putnika“. Fahrgäste.',read:'„23.11.: 23:40, 3, Damir.“ Er schreibt auch die Zukunft auf. Oder den Fahrplan.',g:{look:'Er zählt die Fahrgäste. Bei mir hat er sich immer verzählt.'}},
 {id:'timetable',name:'Fahrplan',look:'„VOZNI RED – LINIJA 3“. Werktags alle sieben Minuten, sonntags alle zwölf. Die letzte um 23:40.',read:'Ilidža – Baščaršija, erste Bahn 5:12, letzte 23:40. Fahrtzeit 42 Minuten.',g:{look:'11:10. Die stand nie auf einem Plan. Die war einfach da.'}},
 {id:'wires',name:'Oberleitung',look:'Die Oberleitung, an Masten aus grünem Eisen. Bei Nebel summt sie.',g:{look:'Die Leitungen lagen damals auf der Straße. Wir sind darüber gesprungen.'}},
 {id:'tram',name:'Straßenbahn',vis:function(S){ return !!S.tramIn; },look:function(A){ return A.m(A.G.phase==='k2_fin_n'?'Die letzte Drei, mit Schnee auf dem Dach. Damir steigt aus und zündet sich eine Zigarette an.':'Eine Drei in der Schleife, Türen offen, Motor brummt. Sie wartet auf ihre Abfahrt wie ein Hund auf seinen Namen.'); },
   use:'Da will ich nicht hin. Noch nicht.',g:{look:'Sie fährt gleich wieder.'}},
 {id:'sebilj',name:'Sebilj',look:'Der Sebilj, ein hölzerner Brunnen mit grüner Kuppel, mitten auf dem Platz. Wer hier trinkt, kommt nach Sarajevo zurück, sagt man.',use:async function(A){ if (A.first('sebDrink')){ await A.m('Ich trinke. Das Wasser ist eiskalt und schmeckt nach Stein.'); await A.m('Ich bin zurückgekommen. Vielleicht wirkt es rückwärts.'); return; } await A.m('Einmal reicht. Hoffe ich.'); },
   g:{look:'Ich habe hier getrunken, mit zwölf. Ich bin trotzdem gegangen.',sense:'So viele, die hier getrunken haben, damit sie wiederkommen. Viele sind gekommen.'}},
 {id:'pigeons',name:'Tauben',look:'Tauben, so viele, dass der Platz atmet, wenn sie auffliegen.',talk:'Ich sage „gru“. Sie sagen nichts. Fair.',use:'Ich habe nichts für sie. Fikrets Burek habe ich selbst gegessen.',g:{look:'Sie sehen mich. Tauben sehen mich immer.'}},
 {id:'mosque',name:'Moschee',look:'Die kleine Moschee der Baščaršija, mit Bleikuppel und Minarett. Im Hof unter dem Baum sitzen zwei alte Männer und reden über Fußball.',g:{look:'Der Hof ist still. Hier war es auch damals still. Fast.'}},
 {id:'shops',name:'Läden',look:'Holzläden mit hochgeklappten Läden: Pantoffeln, Kupfer, Teppiche, Ćevapi. In einem Fenster ein Plakat für den Jazz-Abend am Freitag.',use:'Ich brauche nichts. Ich brauche etwas, das man nicht kaufen kann.',g:{look:'Der Mann mit den Pantoffeln hat damals Kerzen verkauft. Er weiß es noch.'}},
 {id:'cevabdzinica',name:'Ćevabdžinica',look:'„ĆEVABDŽINICA“. Rauch aus dem Kamin, Lepinje im Fenster. Der Geruch zieht über den ganzen Platz.',use:'Später. Mit Mark und Hunger.',g:{look:'Ćevapi, zehn Stück. Du hast nie mehr als fünf geschafft.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne, an deren Mast ein Zettel klebt: „Izgubljena mačka“. Eine Katze wird vermisst. Mit Foto.',g:{look:'Alle suchen hier jemanden. Sogar Katzen.'}},
 {id:'damir',npc:'damir',name:'Damir',hgt:48,vis:function(S,G){ return damirHere(G); },talk:talkDamir,look:'Ein Straßenbahnfahrer in Pause, Zigarette, Uniformjacke offen. Er sieht dem Rauch nach, als wäre der der Einzige, der heute pünktlich ist.',
   give:{ dnevnik:function(A){ return damirBook(A,A.npc('damir')); } }, g:{look:'Er raucht so, wie man durch einen Tunnel geht. Schnell und ohne nach hinten zu sehen.'}}
];
M.room('carsija',{ name:'Baščaršija', scape:'k2_carsija',
  music:function(G){ if (G.phase==='k2_fin_n') return 'k2_finale'; if (G.phase==='k2_pro') return G.flags['k2.p2.back']?'k2_sarajevo':'k2_mala'; return 'k2_sarajevo'; },
  state:function(G){ return {tramIn:false}; },
  actors:function(S,G){ var L=[]; S.tramIn=(G.phase==='k2_pro'&&!G.flags['k2.p2.back'])||(G.phase==='k2_fin_n'&&!G.flags['k2.f2.ride']);
    if (radeHere(G)){ var r=M.apos('carsija','rade',[150,118,'R']); L.push({id:'rade',ch:'rade',x:r[0],y:r[1],f:r[2]||'R',name:'Rade',idle:G.phase==='k2_fin_n'?'write':'cup',speechY:46}); }
    if (damirHere(G)){ var d=M.apos('carsija','damir',[200,124,'L']); L.push({id:'damir',ch:'damir',x:d[0],y:d[1],f:d[2]||'L',name:'Damir',idle:'smoke',speechY:46}); }
    if (benchMala(G)){ var m=M.apos('carsija','mala',[70,120,'R']); L.push({id:'malaBench',ch:'mala',x:m[0],y:m[1],f:m[2]||'R',name:'Mala',ghost:true,idle:'sit',noAche:true,speechY:38}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_pro' && from==='tramvaj' && A.first('k2caArr')){ await A.m('Die Baščaršija. Tauben, Holz, Kupfer, der Geruch von Ćevapi und Kohle. Siebzehn Jahre, und es riecht genauso.'); await A.wait(500);
      await A.m('…'); await A.m('Da. An der Haltestelle der Drei.'); await A.m('Mala.'); }
    if (p==='k2_fin_n' && from==='tramvaj' && A.first('k2caFin')){ await A.narrate('Schnee auf der Baščaršija. Keine Tauben, keine Menschen. Nur Rade vor seinem Häuschen, und die Spuren, die wir machen. Meine. Und neben meinen keine.'); }
    if (p==='k2_s3' && A.first('k2caS3') && !A.flag('k2.s3.damir')){ await A.m('Vor Rades Häuschen raucht ein Fahrer. Die Drei hinter ihm wartet mit offenen Türen.'); } }
});
})(M);
