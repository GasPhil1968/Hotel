/* ===== rooms/vermisst.js — Vermisstenstelle, Epilog (Montag): Frau Kolar nimmt die Anzeige des Grabes auf, Nada gibt eine Blutprobe,
   das Formular (Feld „Beziehung“: „Nachbarin“ stimmt und ist zu klein), „Und Sie? Haben Sie jemanden?“, Markos Probe, der Anruf bei der Mutter.
   Vorgaben: K3_SPEC.md §6 (form, sample), Konzept 4.6 Epilog 5 und 6, 5.1 ===== */
(function(M){
'use strict';
// „(Mala fragen.)“ ist eine Handlung, kein Satz: Marko spricht die Zeile nicht aus (das Gerüst setzt silent nicht)
function askM(A,k){ var o=M.k3AskOpt(A,k); if (o) o.silent=true; return o; }
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function epi(G){ return G.phase==='k3_epi_d'; }
var WIN_ST=[252,121,'B'];   // vor dem Fenster, neben Frau Kolars Stuhl (nicht auf ihm)
// ---------------------------------------------------------------- „Mala fragen“
M.K3ASK=M.K3ASK||{};
M.K3ASK.form=async function(A){ await A.m('Was schreibe ich?'); await A.wait(700); await A.g('Schreib nicht Nachbarin.'); await A.wait(600); await A.g('Schreib, was ich war.'); };
M.K3ASK.sample=async function(A){ await A.m('Soll ich?'); await A.wait(900); await A.g('Das frage ich dich nicht. Das ist dein Vater.'); await A.wait(700); await A.g('Ich sage dir nur, was ich gesehen habe. Du hast mich drei Tage lang gesucht. Ohne zu schlafen. Ohne zu fragen, ob es sich lohnt.'); };
// ---------------------------------------------------------------- Die Anzeige
async function report(A){ var K=A.npc('kolar'), N=A.npc('nada'); if (A.flag('k3.e.report')) return;
  await A.m('In Skela, am linken Ufer, im Garten von Zlata Brkić. Unter einem Quittenbaum. Ein Brett: MALA, fünfzehnter Januar vierundneunzig.');
  await K.anim('write'); A.sfx('typing'); await A.wait(700); await K.say('Skela. Linkes Ufer. Privatgrundstück. Ein Brett.'); await A.wait(500); await K.say('Wer hat das Grab angelegt?');
  // Prüfbericht K3: gestorben ist sie am selben Tag (Fund am Morgen, Tod nach dem Vormittag, Grab 15.1.); „im Schilf“ nur, wenn Zlata es gesagt hat
  await A.m('Bato Brkić, der Fährmann. Er ist tot. Seine Frau hat sie gefunden, am Morgen'+((A.hasNote('a3_morning')||A.hasNote('a3_alive'))?', im Schilf':'')+'. Lebend. Sie ist noch am selben Tag gestorben. In ihrer Küche.');
  await A.wait(900); await K.say('Ein Gartengrab.'); await A.wait(500); await K.say('Das ist keine Schande, Herr Vuković. Das war Krieg. Viele haben ihre Toten im Hof begraben, weil der Weg zum Friedhof zu weit war. Oder zu gefährlich.');
  await A.wait(600); await K.say('Wir beantragen die Exhumierung. Staatsanwaltschaft, Gerichtsmedizin, dann der Abgleich. Das dauert. Wochen.');
  await A.wait(800); await N.say('Wochen.'); await A.wait(900); await N.say('Ich habe siebzehn Jahre gewartet.'); await K.say('Dann zählen Sie die Wochen nicht. Das machen wir.'); await A.wait(400); await K.say('Wir sind keine Richter. Wir zählen.');
  await A.wait(700); await K.say('Frau Delić. Für den Abgleich brauchen wir eine Blutprobe von Ihnen. Ein Stich in den Finger. Ein Tropfen auf ein Papier.'); await N.say('Nehmen Sie.');
  await A.narrate('Frau Kolar sticht Nada in die Fingerkuppe. Ein Tropfen auf eine Karte mit vier vorgedruckten Kreisen. Nada sieht nicht weg.'); A.sfx('click'); await A.wait(800);
  await N.say('Ein Tropfen.'); await A.wait(700); await N.say('Für siebzehn Jahre.'); A.setFlag('k3.e.report');
  if (A.G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Mama.'); } }
// ---------------------------------------------------------------- Das Formular: Feld „Beziehung zur vermissten Person“
async function form(A){ var K=A.npc('kolar'), N=A.npc('nada'), G=A.G; if (A.flag('k3.e.form')) return;
  await K.say('Sie haben sie gefunden. Dann füllen Sie das aus. Was Sie wissen.'); A.give('formular'); A.sfx('paper');
  await A.doc({style:'register',title:'PRIJAVA NESTALE OSOBE',lines:['(Meldung einer vermissten Person)','','Ime i prezime: Lana Delić','Datum rođenja: 3. 3. 1976., Sarajevo','Posljednji put viđena: 15. 1. 1994., Skela (Z. Brkić)','','Odnos prema nestaloj osobi:','  [ ] srodnik   [ ] susjed/a   [ ] prijatelj/ica   [ ] ostalo','','(Beziehung zur vermissten Person: Verwandt · Nachbar/in · Freund/in · Sonstiges)']});
  await A.m('Name, Geburtsdatum, zuletzt gesehen. Das kann ich. Dann das Feld „Beziehung“. Vier Kästchen.');
  var done=false;
  await A.menuLoop(function(){ return [ askM(A,'form'),
    {t:'(Ankreuzen: „Nachbarin“.)',silent:true,go:async function(A){ await A.narrate('Ich halte den Kugelschreiber über das Kästchen „susjeda“.'); await K.say('Nachbarin. Gut. Das stimmt?'); await A.m('Es stimmt.'); await A.wait(1000); await A.m('Es ist zu klein.'); A.setFlag('k3.e.formSmall'); }},
    {t:'(Ankreuzen: „Verwandte“.)',once:'vmRel',silent:true,go:async function(A){ await A.m('Verwandt waren wir nicht. Nicht auf Papier.'); }},
    {t:'(Ankreuzen: „Freundin“.)',once:'vmFr',silent:true,go:async function(A){ await A.m('Freundin. Sie war zwei Jahre älter. Sie hat mir die Jacke zugemacht, bis oben. Das ist mehr als eine Freundin. Oder etwas anderes.'); }},
    {t:'(Ankreuzen: „Sonstiges“.)',once:'vmEtc',silent:true,go:async function(A){ await K.say('Sonstiges kreuzen alle an, die es nicht sagen wollen.'); await A.wait(500); await A.m('Ich will es sagen.'); }},
    {t:'(Einen eigenen Satz schreiben.)',silent:true,go:async function(A){ await ownLine(A,K,N); done=true; return 'bye'; }}   // Prüfbericht K3: keine Rüge, er schreibt, was sie war
  ].filter(Boolean); });
  if (!done){ await K.say('Lassen Sie sich Zeit. Das Feld läuft nicht weg.'); } }
async function ownLine(A,K,N){ var G=A.G;
  await A.narrate('Ich schreibe nicht ins Kästchen. Ich schreibe daneben, so klein ich kann.');
  await A.m('„Sie hat mich mit der Straßenbahn zur Großmutter gebracht.“');
  await A.wait(1000); await K.say('Das passt nicht ins Feld.'); await A.wait(700); await A.m('Dann brauche ich ein größeres Feld.');
  await A.wait(1200); await A.narrate('Frau Kolar sieht mich über die Lesebrille an. Dann dreht sie das Formular um und schiebt es mir wieder hin.'); await K.say('Die Rückseite ist leer.');
  await A.narrate('Ich schreibe auf die Rückseite. Nicht ihre Worte, nicht Vlados, nicht Zlatas. Meine.'); A.sfx('paper');
  if (G.flags['k3.d3.talk2v']==='c') await A.m('Zum zweiten Mal in drei Tagen. Es wird nicht leichter. Es wird richtiger.');
  A.take('formular'); A.setFlag('k3.e.form'); A.sfx('stamp'); await A.wait(600); await K.say('Gut.');
  await A.wait(800); await N.say('Lass mich sehen.'); await A.narrate('Nada liest die Rückseite. Lange. Sie liest sie zweimal.');
  await N.say('Mit der Straßenbahn zur Großmutter.'); await A.wait(900); await N.say('Jeden Samstag. Um zehn nach elf. Ich habe vom Fenster aus zugesehen.');
  if (G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Ja.'); await A.wait(500); await A.g('Das war ich.'); }
  await kolarAsks(A,K); }
// ---------------------------------------------------------------- „Und Sie? Haben Sie jemanden?“ – die Probe für den Vater
async function kolarAsks(A,K){ if (A.hasNote('e3_kolar')) return;
  await A.wait(1200); await K.say('Und Sie?'); await A.wait(800); await K.say('Haben Sie jemanden?'); A.note('e3_kolar');
  await A.wait(1300); await A.m('Meinen Vater.'); await A.wait(600); await A.m('Zoran Vuković. Sarajevo, Frühjahr dreiundneunzig.');
  await A.wait(800); await K.say('Haben Sie eine Probe abgegeben?'); await A.wait(700); await A.m('Nein.');
  await sample(A,K); }
async function giveSample(A,K){ var G=A.G;
  await K.say('Gut.'); await K.anim('write'); await A.narrate('Ein Stich in die Fingerkuppe. Ein Tropfen auf eine Karte mit vier Kreisen, oben mein Name, darunter seiner.'); A.sfx('click');
  await A.wait(900); await A.m('Achtzehn Jahre. Und es dauert eine Sekunde.'); A.setFlag('k3.e.sample'); A.setFlag('k3.e.sampleDone');
  if (!A.hasNote('e3_mothersample')){ await A.wait(800); await K.say('Lebt Ihre Mutter?'); await A.m('Ja. In München.'); await K.say('Ihre Probe zusammen mit Ihrer, dann wird der Abgleich sicherer.'); await A.wait(500); await K.say('Wir suchen. Wenn er gefunden wurde, können wir ihn zuordnen.'); A.note('e3_mothersample'); }
  if (G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Du hast ihn gesucht. Gerade eben. Das war die Sekunde.'); } }
async function sample(A,K){ var G=A.G; if (F(G,'k3.e.sampleDone')) return;
  var c=null;
  await A.menuLoop(function(){ return [ askM(A,'sample'),
    {t:'(Eine Probe abgeben.)',silent:true,go:async function(A){ c='yes'; return 'bye'; }},
    {t:'„Heute nicht.“',go:async function(A){ c='no'; return 'bye'; }}
  ].filter(Boolean); });
  if (c==='yes'){ if (!M.k3Asked(A,'sample') && G.malaOn && A.malaHere()){ await A.m('Ich mache das.'); await A.wait(700); await A.g('Gut.'); await A.wait(600); await A.m('Mehr sagst du nicht?'); await A.wait(900); await A.g('Das ist dein Vater.'); }   // Prüfbericht K3: seine Entscheidung, keine Rüge
    await giveSample(A,K); return; }
  if (c==='no'){ if (!F(G,'k3.e.sampleNo')){ A.setFlag('k3.e.sampleNo');
      if (G.malaOn){ await A.wait(1100); await A.g('Du suchst mich, damit du ihn nicht suchen musst.'); await A.wait(900); }
      await K.say('Ich frage noch einmal, Herr Vuković. Ich frage immer zweimal. Beim ersten Mal sagen fast alle nein.'); await A.wait(500); await K.say('Wollen Sie eine Probe abgeben?');
      return sample(A,K); }
    await K.say('Gut. Ich frage nicht ein drittes Mal. Das mache ich nie. Die Karte liegt hier, bis Sie gehen.'); A.setFlag('k3.e.sampleDone');
    await A.wait(800); await K.say('Aber lebt Ihre Mutter?'); await A.m('Ja. In München.'); await K.say('Ihre Probe allein hilft uns wenig. Sie ist mit ihm nicht verwandt. Dazu braucht es eines seiner Kinder.'); await A.wait(600); await A.m('Meine Schwester. Ana. Auch in München.');
    await A.wait(500); await K.say('Dann fragen Sie die beiden. Ihre Mutter kann uns auch so helfen. Mit dem, was sie weiß: wann, wo, was er anhatte.'); await A.wait(500); await K.say('Wir suchen. Wenn er gefunden wurde, können wir ihn zuordnen.'); A.note('e3_mothersample'); A.setFlag('k3.e.sampleAna');
    return; }
  await K.say('Überlegen Sie. Ich bin hier.'); }
// ---------------------------------------------------------------- Der letzte Pflichtschritt: der Anruf bei der Mutter (Konzept 4.6, Epilog 6)
M.k3MotherCall=async function(A){ var G=A.G; if (F(G,'k3.e.mother')) return A.m('Ich habe sie angerufen. Weihnachten.');
  if (A.room && A.room.id==='vermisst'){ await A.walk(WIN_ST[0],WIN_ST[1]); await A.face('B'); }
  await A.narrate('Ich gehe ans Fenster. Die Lamellen werfen Streifen auf meine Hand. Ich wähle die Nummer, die ich auswendig kann und nie wähle.'); A.sfx('dial'); await A.wait(1800);
  await A.phoneVoice('„Marko?“','jasna'); await A.wait(900); await A.phoneVoice('„… Ist etwas passiert?“','jasna');
  await A.wait(500); await A.m('Mama. Ich komme zu Weihnachten.');
  await A.wait(2000); await A.narrate('Stille.'); await A.wait(600);
  await A.m(F(G,'k3.e.sampleAna')&&!F(G,'k3.e.sample')?'Und sie brauchen eine Probe von Ana. Und alles, was du weißt. Für Tata.':'Und sie brauchen eine Probe von dir. Für Tata.');
  await A.wait(1400); await A.phoneVoice('„… Deshalb rufst du an.“','jasna');
  await A.wait(500); await A.m('Nicht nur.');
  await A.wait(1000); await A.phoneVoice('„Achtzehn Jahre reden wir nicht über ihn. Und jetzt am Telefon.“','jasna');
  await A.wait(1700); await A.narrate('Pause.'); await A.wait(500); await A.phoneVoice('„Komm. Wir reden, wenn du hier bist. Nicht am Telefon.“','jasna');
  A.sfx('hangup'); A.setFlag('k3.e.mother'); await A.wait(900);
  if (A.room && A.room.id==='vermisst'){ var N=A.npc('nada'); await N.say('Deine Mutter?'); await A.m('Ich fahre zu Weihnachten nach München.'); await A.wait(600); await N.say('Gut.'); await A.wait(500); await N.say('Mütter warten nicht gern, Mali. Wir können es nur.');
    await A.wait(700); await A.npc('kolar').say('Wir rufen Sie an. Es dauert. Aber wir rufen an.'); }
  if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('München.'); await A.wait(600); await A.g('Ich habe dich am Grab gefragt, ob du das willst. Ich komme mit.'); } };
// ---------------------------------------------------------------- Frau Kolar
async function talkKolar(A){ var K=A.npc('kolar'), G=A.G;
  if (F(G,'k3.e.mother')) return K.say(A.cycle('kvBye',['Wir rufen an. Versprochen ist das falsche Wort. Wir rufen an.','Gute Reise, Herr Vuković. Und grüßen Sie Ihre Mutter. Sie kennt mich nicht. Grüßen Sie sie trotzdem.']));
  await A.menuLoop(function(){ return [
    {t:'Ich möchte ein Grab anzeigen.',if:!A.flag('k3.e.report'),go:function(A){ return report(A); }},
    {t:'Das Formular.',if:A.flag('k3.e.report')&&!A.flag('k3.e.form'),go:async function(A){ await form(A); if (A.flag('k3.e.form')) return 'bye'; }},
    {t:'Wegen der Probe. Für meinen Vater.',if:A.hasNote('e3_kolar')&&!A.flag('k3.e.sample'),go:async function(A){ if (A.flag('k3.e.sampleDone')){ await K.say('Doch?'); await A.wait(500); await A.m('Doch.'); await giveSample(A,K); return; } await K.say('Wollen Sie eine Probe abgeben?'); await sample(A,K); }},
    {t:'Entschuldigen Sie. Ich muss telefonieren.',if:A.hasNote('e3_mothersample')&&!A.flag('k3.e.mother'),go:async function(A){ await M.k3MotherCall(A); return 'bye'; }},
    {t:'Wie viele sind es noch?',once:'kv1',go:async function(A){ await K.say('In diesem Land? Ein paar Tausend.'); await A.wait(500); await K.say('In diesem Büro? Jeder, der durch diese Tür kommt, bringt einen mit.'); }},
    {t:'Wie lange machen Sie das schon?',once:'kv2',go:async function(A){ await K.say('Seit zweitausendvier. Vorher war ich Lehrerin. Mathematik.'); await A.wait(500); await K.say('Ich zähle immer noch. Nur anders.'); }},
    A.askOpt({
      e3_father:'Sie haben ihn nie gesucht. Das sagen viele, die hier sitzen. Es gibt hier keinen, der das nicht irgendwann sagt.',
      e3_avoid:'Ich bin keine Psychologin, Herr Vuković. Ich zähle. Aber ich höre zu.',
      l3_survived:'Das schreibe ich nicht ins Formular. Das schreibe ich in mein Heft. Das Heft gehört mir.',
      a3_grave:'MALA, fünfzehnter Januar. Wir haben Menschen nach weniger gefunden. Nach einem Knopf.',
      photo_full:'Das ist ein Kind. Für die Akte brauchen wir das Mädchen mit siebzehn. Frau Delić hat ein Foto dabei.',
      brief1996:'Adresse unzureichend. Damals war keine Adresse ausreichend. Nicht in diesem Land.',
      skizzenbuch:'Das ist für die Familie. Nicht für die Akte.',
      rueckfahrt:'Sarajevo. Gut. Fahren Sie zurück. Wir rufen an.' },
      ['Dazu habe ich kein Formular.','Das weiß ich nicht. Ich weiß nur, was in den Akten steht. Und manchmal das, was daneben steht.']),
    {t:'(Warten.)',bye:true,silent:true}
  ]; }); }
async function talkNada(A){ var N=A.npc('nada'), G=A.G;
  if (F(G,'k3.e.mother')) return N.say(A.cycle('ndV3',['Der Bus fährt bald. Ich will am Fenster sitzen.','Wochen. Ich zähle sie nicht. Sie zählt sie.']));
  if (F(G,'k3.e.form')) return N.say(A.cycle('ndV2',['Mit der Straßenbahn zur Großmutter. Das schreibe ich auch. In meinen Brief an den Suchdienst. Den letzten.','Du hast eine schöne Schrift bekommen, Mali. Früher hast du wie ein Huhn geschrieben.']));
  if (F(G,'k3.e.report')) return N.say('Ein Tropfen. Siebzehn Jahre und ein Tropfen.');
  return N.say(A.cycle('ndV1',['Mach du. Ich habe heute schon zu viel geredet.','Ich sitze. Mehr kann ich gerade nicht.'])); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Zum Flur',exit:{to:'map'},look:'Die Tür zum Flur. Draußen Schritte, ein Telefon, das keiner abnimmt.',
   canExit:async function(A){ var G=A.G; if (!epi(G)) return true;
     if (!F(G,'k3.e.report')){ await A.m('Ich bin wegen Lana hier. Erst die Anzeige.'); return false; }
     if (!F(G,'k3.e.form')){ await A.m('Das Formular ist noch nicht fertig. Ein Feld fehlt.'); return false; }
     if (!F(G,'k3.e.sampleDone')){ await A.m('Frau Kolar hat mich etwas gefragt. Ich habe noch nicht geantwortet.'); return false; }
     if (!F(G,'k3.e.mother')){ await A.m('Bevor ich gehe, rufe ich sie an. Jetzt, bevor ich es mir anders überlege.'); await M.k3MotherCall(A); return false; }
     return true; },
   g:{look:'Draußen warten noch andere. Auf Stühlen im Flur. Sie haben Fotos in der Hand.'}},
 {id:'kolar',npc:'kolar',name:'Frau Kolar',hgt:38,talkDist:28,vis:function(S,G){ return epi(G); },talk:talkKolar,
   look:'Eine Frau um die fünfzig, aufrecht, kurzes graues Haar, die Lesebrille an einer Kette, dunkelblauer Blazer über einer hellen Bluse. Sie schreibt mit dem Kugelschreiber, als müsste jedes Wort einzeln gefunden werden.',
   give:{ formular:'Frau Kolar: „Erst ausfüllen. Ich warte.“', photo_full:'Frau Kolar: „Das ist ein Kind. Für die Akte brauchen wir das Mädchen mit siebzehn.“', brief1996:'Frau Kolar: „Das ist für die Familie, nicht für mich. Aber ich schreibe in die Akte, dass es ihn gibt.“' },
   g:{look:'Sie hat ein Heft unter der Akte. Darin schreibt sie, was nicht ins Formular passt.',listen:'Sie rechnet. Wochen. Proben. Wie viele vor uns dran sind. Sie lässt es sich nicht anmerken.'}},
 {id:'nada',npc:'nada',name:'Nada',hgt:36,talkDist:26,vis:function(S,G){ return epi(G); },talk:talkNada,
   look:'Nada auf dem Besucherstuhl, den Mantel noch an, die Handtasche auf dem Schoß. An der Fingerkuppe ein Pflaster, wenn sie es schon hat. Sie sitzt sehr gerade.',
   give:{ photo_full:'Nada: „Für die Akte. Ja. Nehmen Sie das. Nein, behalt es, Mali. Ich habe meins.“', skizzenbuch:'Nada: „Später. Im Bus. Ich will es im Bus ansehen.“', brief1996:'Nada: „Den habe ich. Zlata hat ihn mir gegeben. Er gehört mir jetzt.“' },
   g:{look:'Mama.',listen:'Sie denkt: Wochen. Sie zählt schon.'}},
 {id:'desk',name:'Schreibtisch',look:'Frau Kolars Schreibtisch: ein Röhrenmonitor, eine Tastatur, Formularstapel, ein Stempel und ein Stempelkissen, ein Ablagekorb mit der Aufschrift „HITNO“, dringend. Er ist leer.',
   g:{look:'Ihr Stempel ist rund. Wie der von Zora. Damit es zählt.'}},
 {id:'form',name:'Formular',look:function(A){ return A.m(A.flag('k3.e.form')?'Das Formular, gestempelt. Auf der Rückseite meine Schrift.':'Ein Formular auf dem Stapel: „Prijava nestale osobe / Meldung einer vermissten Person“.'); },
   use:async function(A){ if (!A.flag('k3.e.report')) return A.m('Erst die Anzeige. Dann das Formular.'); if (!A.flag('k3.e.form')) return form(A); return A.m('Ausgefüllt. Beide Seiten.'); },
   read:async function(A){ if (!A.flag('k3.e.report')) return A.m('Name, Geburtsdatum, zuletzt gesehen, Beziehung. Noch leer.'); if (!A.flag('k3.e.form')) return form(A); return A.m('Vorn: Lana Delić, 3. 3. 1976. Hinten: „Sie hat mich mit der Straßenbahn zur Großmutter gebracht.“'); },
   g:{look:'„Zuletzt gesehen.“ Das warst nicht du. Das war Zlata.'}},
 {id:'wall',name:'Wand mit Fotos',look:'Eine Wand voller Fotos, klein, in Reihen. Darunter Kärtchen mit Namen und Jahreszahlen. Von Weitem sehen sie aus wie Fenster in einem Hochhaus.',
   g:{look:'So viele. Und jeder wartet auf jemanden mit einem Formular.',sense:'Keiner von ihnen ist hier. Hier sind nur ihre Bilder. Und die, die sie suchen.'}},
 {id:'poster',name:'Plakat',look:'Ein Plakat mit einem roten Tropfen: „KRVNI UZORAK – Blutprobe. Jede Probe kann einen Namen zurückgeben.“',
   g:{look:'Ein Tropfen. So wenig braucht es, um jemanden wiederzufinden. Und so viel.'}},
 {id:'cabinet',name:'Aktenschrank',look:'Ein grauer Aktenschrank mit Etiketten, nach Jahren und Orten geordnet. Obenauf ein Wasserkocher und drei Tassen, eine mit Sprung.',open:'Abgeschlossen. Darin sind Akten. Und in den Akten Namen.',
   g:{look:'Da drin sind mehr Namen als in jedem Klassenbuch.'}},
 {id:'chairs',name:'Besucherstühle',look:'Zwei Besucherstühle aus Stahlrohr. Auf einem sitzt Nada. Der andere ist für mich.',use:'Ich bleibe stehen. Sitzen kann ich im Bus.',
   g:{look:'Mama sitzt da. Ich stehe hinter ihr. Sie merkt es nicht.'}},
 {id:'window',name:'Fenster',st:WIN_ST,look:'Ein Fenster mit Lamellen. Draußen ein grauer Montag, ein Parkplatz, ein Baum ohne Blätter.',
   use:async function(A){ if (A.hasNote('e3_mothersample') && !A.flag('k3.e.mother')) return M.k3MotherCall(A); return A.m('Ich ziehe die Lamellen ein Stück auf. Draußen bleibt es grau.'); },
   with:{ mobitel:async function(A){ if (A.hasNote('e3_mothersample') && !A.flag('k3.e.mother')) return M.k3MotherCall(A); return A.m(A.flag('k3.e.mother')?'Ich habe sie angerufen.':'Noch nicht. Erst bin ich wegen Lana hier.'); } },
   g:{look:'Draußen ist es grau. Das Grau ist gut. Es tut nicht so, als wäre alles hell.'}}
];
M.room('vermisst',{ name:'Vermisstenstelle', scape:'k3_vermisst', music:'k3_epi',
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (epi(G)){ var k=M.apos('vermisst','kolar',[200,116,'L']), n=M.apos('vermisst','nada',[120,118,'R']);
      L.push({id:'kolar',ch:'kolar',x:k[0],y:k[1],f:k[2]||'L',name:'Frau Kolar',idle:'write',talk:'sitTalk',speechY:38});
      L.push({id:'nada',ch:'nada',x:n[0],y:n[1],f:n[2]||'R',name:'Nada',idle:'sit',talk:'sitTalk',speechY:36}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G; if (!epi(G)) return;
    if (A.first('vmFirst')){ await A.narrate('Ein Büro in einem Verwaltungsbau, zweiter Stock. Unten ölgrün, oben weiß, eine Neonröhre, die summt. An der Wand Fotos, viele, klein. Nada sitzt schon da, den Mantel an.');
      if (G.malaOn && A.malaHere()){ await A.wait(600); await A.g('So viele.'); } } }
});
})(M);
