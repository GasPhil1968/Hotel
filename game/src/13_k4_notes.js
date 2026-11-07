/* ===== 13_k4_notes.js — Kapitel 4: Notizen, Schlussfolgerungen, Antworten bei falschen Verbindungen =====
   Fälle: h4 Ankunft (Hansi) · z4 Die Familie (das ganze Kapitel) · s4 Sepp (Gleis 11) · g4 Gerda (Haus am Bavariapark).
   IDs fest, siehe game/K4_SPEC.md §9. Malas geheime Notizen aus der Kiste (M.k4NoteMala) gehören bis zum Streit ihr allein:
   Im Gespräch als Marko erscheinen sie erst nach k4.r.shared, und Schlüsse mit ihnen gehen erst danach. */
(function(M){
'use strict';
var N={};
function n(id,c,g,s,t,o){ N[id]=Object.assign({c:c,g:g,s:s,t:t,show:true},o||{}); }
function has(G,id){ return G.notes.indexOf(id)>=0; }
function shared(G){ return !!G.flags['k4.r.shared']; }
// ---------------------------------------------------------------- Aus Mostar (Kapitel 3)
n('k4_c_lana','z4','Aus Mostar','Lana ist gefunden','Aus Mostar: Lana liegt unter dem Quittenbaum in Skela, bei Zlata. Nada holt sie nach Hause. Ich habe es ihr versprochen, und ich habe es gehalten.',{p:'p:mala'});
n('k4_c_vater','z4','Aus Mostar','Mein Vater','Aus Mostar: Frau Kolar hat gefragt: „Und Sie? Haben Sie jemanden?“ Ich habe gesagt, ich wusste, dass er tot ist. Woher, habe ich nicht gesagt.',{p:'p:kolar'});
// ---------------------------------------------------------------- Ankunft
n('u4_sms','h4','Ankunft','Anas SMS','SMS von Ana: „Mama arbeitet bis 14 Uhr. Schlüssel bei Frau Huber, unten links. Ich hol dich NICHT ab, ich muss Plätzchen backen. A.“',{p:'i:mobitel'});
// ---------------------------------------------------------------- Zu Hause
n('u4_pantoffeln','z4','Zu Hause','Pantoffeln, Größe 44','An Mamas Wohnungstür stehen Herrenpantoffeln, Größe 44, gerade nebeneinander, die Spitzen zur Tür. Frau Huber: „Die stehen da, seit sie eingezogen ist. Ich hab nie gefragt.“',{p:'p:huber'});
n('u4_dach','z4','Zu Hause','„Vratnik – krov“','Im Regal eine Mappe: „Vratnik – krov“. Überweisungen nach Sarajevo, achtzehn Jahre lang, für Großmutters Dach. Das Haus steht seit 2003 leer.',{p:null});
n('u4_kiste','z4','Zu Hause','Eine Kiste im Schrank','Oben in Mamas Kleiderschrank steht eine Holzkiste mit Schloss. Den Schlüssel trägt sie an ihrem Bund.',{p:null});
n('u4_klopfen','z4','Lana','Zweimal kurz, einmal lang','Mama, als ich von Lana erzähle: „Zweimal kurz, einmal lang. So hat sie geklopft. Jeden Samstag um zehn nach elf.“ Sie weiß es nach achtzehn Jahren noch.',{p:'p:jasna'});
n('u4_nichtheute','z4','Zu Hause','„Nicht heute“','Ich wollte mit Mama über die Probe reden. „Nicht heute. Heute ist Heiligabend.“ Dann hat sie den Kaffee umgerührt, der schon umgerührt war.',{p:'p:jasna'});
// ---------------------------------------------------------------- Lana und Ana
n('z4_stiefel','z4','Lana','Die gelben Stiefel','Mala auf der Theresienwiese: 1990, an der Haltestelle der Drei, ein kleines Mädchen in gelben Gummistiefeln weint. Lana malt ihr eine Straßenbahn. Das Mädchen war Ana. Ana hat die Zeichnung noch.',{p:'p:mala'});
// ---------------------------------------------------------------- Die Kiste (Mala, geheim)
n('z4_lesart','z4','Zwei Städte','„Ich kann lesen“','Mama am Abend, beim Kaffee aus Großmutters Džezva: „Ruža hat geschrieben, er ist nicht zurückgekommen. Nicht, dass er tot ist. Ich kann lesen.“',{p:'p:jasna'});
n('z4_nachricht','z4','Die Kiste','Nachricht vom Roten Kreuz','In der Kiste (Mala): eine Rotkreuz-Nachricht, Mai 1993, von Ruža aus Sarajevo: „Zoran nije se vratio.“ Im Nachhall: Ruža wollte „poginuo“ schreiben, gefallen. Eine Jungenstimme bat: „Schreib: nicht zurückgekommen.“',{p:'p:mala'});
n('z4_antrag','z4','Die Kiste','Suchantrag 1994','Ein Suchantrag von 1994 beim Suchdienst, in Mamas Schrift: „Vuković, Zoran. Vermisst seit April 1993.“',{p:'p:mala'});
n('z4_passierschein','z4','Die Kiste','Passierschein, Mai 1992','In der Kiste (Mala): ein Passierschein für den Konvoi im Mai 1992, für eine Frau und ein Kind. Im Nachhall: Mama am Busfenster, bis zur Kurve. Eine Männerstimme draußen: „Fahrt. Wir kommen nach.“',{p:'p:mala'});
// ---------------------------------------------------------------- Der Anruf
n('z4_kolar','z4','Der Anruf','Die Brauerei','Frau Kolar am Telefon: In einem Grab an der Brauerei, April 1993, lag ein Rechenschieber mit den Buchstaben „Z. V.“. Die Proben werden verglichen.',{p:'p:kolar'});
n('z4_kode','z4','Der Anruf','Was „nije se vratio“ heißt','Frau Kolar: „In den Akten von dreiundneunzig steht oft ‚nije se vratio‘. Das schreiben Familien, die es wissen und es nicht schreiben können.“',{p:'p:kolar'});
n('z4_ana2004','z4','Der Anruf','Ana, 2004','Ana hat 2004 in München heimlich eine Probe gegeben. Für Papa. Mama weiß es nicht.',{p:'p:ana'});
n('z4_ankunft','z4','Zu Hause','„Polako, gospođo“','Mama erkennt Sepp auf dem Aushang: Juni 1992, Hauptbahnhof, sie mit Ana an der Hand, eine Tasche, kein Deutsch. Ein Gepäckträger trug die Tasche bis zur Tram. „Polako, gospođo.“ Langsam, gnädige Frau.',{p:'p:jasna'});
n('z4_riss','z4','Zwei Städte','Keine Beerdigung seit 1992','Mama nach Sepps Abschied: „Ich war auf keiner Beerdigung seit zweiundneunzig. Ich wusste nicht, für wen.“',{p:'p:jasna'});
n('z4_kurve_ana','z4','Die Kurve','„Bis zur Kurve“','Ana: „Mama stand bis zur Kurve am Fenster. Danach hat sie nie wieder am Fenster gesessen. Nicht im Bus, nicht im Zug, nirgends.“',{p:'p:ana'});
// Schlüsse
n('z4_vermisst','z4','Zwei Städte','In München hieß es „vermisst“','Mama hat Ružas Satz als „vermisst“ gelesen und so beim Suchdienst eingetragen. Seit 1994 sucht sie einen Lebenden.',{p:'p:jasna'});
n('z4_tot','z4','Zwei Städte','In Sarajevo hieß es „tot“','Ruža wollte „gefallen“ schreiben. Sie hat „nicht zurückgekommen“ geschrieben, weil jemand sie darum gebeten hat. In Sarajevo hieß das: tot.',{p:'p:mala'});
n('z4_zweistaedte','z4','Zwei Städte','Derselbe Satz, zwei Städte','„Nije se vratio.“ In Sarajevo hieß das tot. In München hieß es vermisst. Achtzehn Jahre hat derselbe Satz zwei Dinge bedeutet. Ich übersetze seit achtzehn Jahren. Diesen einen Satz habe ich nie übersetzt.',{p:null});
n('z4_dabei','z4','Zwei Städte','Ich war dabei','19. April 1993, Brauerei. Wasser holen. Ich war dabei. Ich habe die Kanister gefüllt, und ich habe Ruža gebeten, „nicht zurückgekommen“ zu schreiben.',{p:null});
n('z4_kurve','z4','Die Kurve','Sie hat zurückgesehen','Mama hat bis zur Kurve zurückgesehen. Papa hat „Wir kommen nach“ gesagt. Sie ist nicht gegangen, ohne zurückzusehen. Sie hat nur nie wieder hingesehen.',{p:'p:jasna'});
// ---------------------------------------------------------------- Markos Kopf
n('r4_kopf','z4','Markos Kopf','„Nur müde“','Heiligabend, nachts: Mala fragt nach meinem Kopf. „Nur müde.“ Sie sagt: „Du sagst das seit Split.“',{p:'p:mala'});
n('r4_ursache','z4','Markos Kopf','Woher der Kopfschmerz kommt','Am Bahnhof Sepp, im Heim Gerda: Seit Mala sie gefunden hat, ist der Druck dort weg. Ungefundene Geister machen den Kopfschmerz. Nicht meine Müdigkeit.',{p:'p:mala'});
// ---------------------------------------------------------------- Sepp
n('s4_peppino','s4','Peppino','„Mi chiamo Peppino“','Am Ende von Gleis 11 ein alter Mann in Gepäckträgeruniform, ein Geist. Mütze Nr. 17. „Mi chiamo Peppino.“ Er wartet auf „la lettera di gennaio“, den Brief vom Januar.',{p:'p:sepp'});
n('s4_genommen','s4','Peppino','„Hier genommen“','Sepp, nach seinem Nachnamen gefragt: „Me l\'hanno preso qui. Al binario undici.“ Den haben sie mir hier genommen. An Gleis 11.',{p:'p:sepp'});
n('s4_fluch','s4','Der Sepp','Italienisch geflucht','Frau Wimmer: „Der Sepp hat italienisch geflucht, wenn er dachte, keiner hört es.“',{p:'p:wimmer'});
n('s4_bairisch','s4','Der Sepp','„A Urmünchner“','Die Kioskfrau an Gleis 11: „Der Sepp? A Urmünchner. Der hat Bairisch g\'redt wie mei Schwiegervater.“',{p:null});
n('s4_enzo','s4','Der Sepp','„Per noi era Peppino“','Signor Enzo in der Bar Sport: „Per noi era Peppino.“ 1962 im selben Zug aus dem Süden. Er hat Bairisch gelernt, „damit keiner fragt, woher er kommt“.',{p:'p:enzo'});
n('s4_ausweis','s4','Der Name','Josef Rugiero','Herr Obermaier, Friedhofsverwaltung: Gepäckträgerausweis in der Akte. „Josef Rugiero, Gepäckträger Nr. 17.“ Keine Angehörigen bekannt.',{p:'p:obermaier'});
n('s4_termin','s4','Der Name','Donnerstag','Herr Obermaier: Bestattung von Amts wegen am Donnerstag. „Wenn sich bis dahin niemand meldet.“',{p:'p:obermaier'});
n('s4_bunker','s4','Der Name','Nachhall im Bunker','Mala im Bunker unter Gleis 11, 1962: Ein Beamter mit Stempel. „Giuseppe? Das schreibt keiner. Josef. Und Rugiero, ein G reicht.“ Ein junger Mann mit Pappkoffer: „Sì, sì. Josef.“',{p:'p:mala'});
n('s4_umschlag','s4','Carmela','Briefe aus dem Süden','In Sepps Koffer: Briefe an „Giuseppe Ruggiero, c/o Bahnhofsmission, Gleis 11“. Absender: C. Ruggiero, Pietrafonda Nuova.',{p:'p:wimmer'});
n('s4_bitte','s4','Carmela','„Cara Carmela, sto bene“','Sepp, als er hört, dass wir seinen Namen kennen: „Adesso scriva. Cara Carmela, sto bene.“ Jetzt schreiben Sie. Liebe Carmela, mir geht es gut.',{p:'p:sepp'});
n('s4_brief79','s4','Carmela','Carmela, 1979','Carmela 1979: „Ti ho visto con le valigie. Eri bello come papà. Anche io sto bene.“ Ich habe dich mit den Koffern gesehen. Du warst schön wie Papa. Auch mir geht es gut.',{p:null});
n('s4_carmela_hall','s4','Carmela','Eine Frau, die weint','Mala am Brief von 1979: Eine Frau sitzt an einem Küchentisch und schreibt. Sie weint und lächelt dabei.',{p:'p:mala'});
// Schlüsse
n('s4_tarnung','s4','Der Sepp','Er konnte beides','Bairisch wie ein Urmünchner, italienisch geflucht, wenn keiner zuhörte. Er konnte beides. Das Bairische war eine Tarnung.',{p:'p:sepp'});
n('s4_derselbe','s4','Der Name','Peppino ist der Sepp (?)','Mütze Nr. 17 an Gleis 11, Gepäckträger Nr. 17 in der Akte. Peppino und Josef Rugiero sind vielleicht derselbe Mann. Vielleicht.',{p:'p:sepp'});
n('s4_name','s4','Der Name','Giuseppe Ruggiero','Josef Rugiero ist Giuseppe Ruggiero. Ein Beamter hat 1962 den Namen eingedeutscht, und er hat „Sì“ gesagt. Für die Stadt ist er seitdem ein anderer.',{p:'p:sepp'});
n('s4_wusste','s4','Carmela','Carmela wusste es','Carmela hat ihn 1979 gesehen, mit den Koffern. Sie wusste seit über dreißig Jahren, was er hier war. Sie hat „Auch mir geht es gut“ zurückgeschrieben.',{p:'p:sepp'});
// ---------------------------------------------------------------- Gerda
n('g4_gerda','g4','Gerda','„Bis ich da bin“','Im Haus am Bavariapark, auf der Bank am Aufzug, eine kleine alte Frau mit Kopftuch und Thermoskanne, ein Geist. „Das macht er immer, der Alois. Bis ich da bin.“',{p:'p:gerda'});
n('g4_drei','g4','Drei Uhr','Um drei','Um drei steht Herr Lechner auf, geht zum Aufzug und wartet. „Die Gerda!“ Er friert und läuft bis halb fünf auf und ab.',{p:'p:alois'});
n('g4_gong','g4','Drei Uhr','Der Gong','Der Aufzug gongt, wenn er hält. Hausmeister Kraus: „Da laufen manche hin, als hätt einer geklingelt.“',{p:'p:kraus'});
n('g4_kalt','g4','Drei Uhr','Wenn sie seine Hand nimmt','Mala: Gerda steigt mit dem Gong aus dem Aufzug, setzt sich und nimmt seine Hand. Genau dann friert er.',{p:'p:mala'});
n('g4_spaeter','g4','Drei Uhr','„Sie kommt später“','Eine Pflegerin, jeden Tag um drei: „Ihre Gerda kommt später, Herr Lechner.“ Mama sagt es auch.',{p:'p:jasna'});
n('g4_doku','g4','Alois','Die Pflegedokumentation','Im Dienstzimmer zeigt mir Mama die Akte: „Ehefrau verst. 3.9. Laut PDL nicht mitteilen. Bei Nachfrage: kommt später.“',{p:'p:jasna'});
n('g4_depot','g4','Alois','Am Depot','In Zimmer 214 Fotos: eine Trambahn der Linie 19, ein junger Fahrer. Eine Frau mit Thermoskanne am Depottor. Fünfunddreißig Jahre hat Gerda draußen gewartet, wenn er Feierabend hatte. Nie ist sie hineingegangen.',{p:'p:alois'});
n('g4_versuch1','g4','Der Versuch','Gong aus, Gerda bei ihm','Erster Versuch: Der Gong ist aus, Gerda sitzt bei ihm. Er steht nicht auf. Aber als sie seine Hand nimmt, friert er und ruft nach ihr.',{p:'p:alois'});
n('g4_versuch2','g4','Der Versuch','Gong an, Gerda im Flur','Zweiter Versuch: Der Gong ist an, Gerda wartet am Fenster am Ende des Flurs. Er steht beim Gong auf und geht zum Aufzug. Aber er friert nicht.',{p:'p:alois'});
// Schlüsse
n('g4_beides','g4','Der Versuch','Gong und Nähe','Der Gong holt ihn zum Aufzug. Gerdas Nähe lässt ihn frieren. Er wartet auf sie, und sie hält ihn fest, weil sie jeden Tag kommt.',{p:'p:gerda'});
n('g4_worte','g4','Alois','In seiner Sprache','Ihm „tot“ zu sagen, hilft nicht, er vergisst es und trauert jeden Tag neu. Aber er versteht seine Sprache: Endstation. Feierabend. Sie wartet am Depot, mit der Kanne.',{p:'p:alois'});
M.defineNotes(N);

// ---------------------------------------------------------------- Gruppen und Erledigung
M.NOTE_GROUPS.h4=['Ankunft'];
M.NOTE_GROUPS.z4=['Zu Hause','Lana','Die Kiste','Der Anruf','Zwei Städte','Die Kurve','Markos Kopf','Aus Mostar'];
M.NOTE_GROUPS.s4=['Peppino','Der Sepp','Der Name','Carmela'];
M.NOTE_GROUPS.g4=['Gerda','Drei Uhr','Der Versuch','Alois'];
function by(id,list){ var x=M.NOTES[id]; x.doneBy=(x.doneBy||[]).concat(list); }
function done(id,fn){ M.NOTES[id].doneIf=fn; }
function after(f){ return function(G){ return !!G.flags[f]; }; }
by('z4_lesart',['z4_vermisst']); by('z4_antrag',['z4_vermisst']); by('z4_nachricht',['z4_tot']); by('z4_kode',['z4_tot']);
by('z4_vermisst',['z4_zweistaedte']); by('z4_tot',['z4_zweistaedte']); by('z4_passierschein',['z4_kurve']); by('z4_kurve_ana',['z4_kurve']);
by('s4_bairisch',['s4_tarnung']); by('s4_fluch',['s4_tarnung']); by('s4_peppino',['s4_derselbe']); by('s4_ausweis',['s4_name']); by('s4_derselbe',['s4_name']);
by('s4_bunker',['s4_name']); by('s4_umschlag',['s4_name']); by('s4_brief79',['s4_wusste']); by('s4_carmela_hall',['s4_wusste']);
by('g4_versuch1',['g4_beides']); by('g4_versuch2',['g4_beides']); by('g4_beides',['g4_worte']); by('g4_depot',['g4_worte']);
done('u4_sms',after('k4.p.key')); done('u4_nichtheute',after('k4.p.talk1')); done('u4_kiste',after('k4.d1.box'));
done('s4_genommen',function(G){ return has(G,'s4_name'); }); done('s4_termin',after('k4.s.farewell')); done('s4_bitte',after('k4.s.crossed'));
done('g4_gerda',after('k4.g.decided')); done('g4_drei',function(G){ return has(G,'g4_beides'); }); done('g4_gong',function(G){ return has(G,'g4_beides'); }); done('g4_kalt',function(G){ return has(G,'g4_beides'); });
done('g4_spaeter',after('k4.g.ertl')); done('g4_doku',after('k4.g.ertl')); done('g4_worte',after('k4.g.goodbye'));
done('k4_c_lana',after('k4.p.lana')); done('k4_c_vater',function(G){ return has(G,'z4_dabei'); });
done('r4_kopf',function(G){ return has(G,'r4_ursache'); }); done('z4_dabei',after('k4.fin.done')); done('z4_zweistaedte',after('k4.d5.bridge'));

// ---------------------------------------------------------------- Malas Geheimnis: was sie in der Kiste gelesen hat
// z4_antrag kommt auch von Mama (Tag 2, Frage nach dem Suchdienst): dann setzt S1 k4.n.antragJasna, und die Notiz gehört Marko.
var SECRET={ z4_nachricht:1, z4_antrag:1, z4_passierschein:1, z4_tot:1 };   // z4_tot zieht zuerst Mala allein (Konzept 7.3 B2)
M.k4NoteMala=function(id,G){ G=G||M.GS; if (!SECRET[id]) return false; if (id==='z4_antrag' && G && G.flags['k4.n.antragJasna']) return false; return true; };
M.k4NoteHidden=function(id,G){ G=G||M.GS; return !!(G && M.chapterOf(G)===4 && M.k4NoteMala(id,G) && !shared(G)); };
function secretOk(a,b){ return function(G){ return !M.k4NoteHidden(a,G) && !M.k4NoteHidden(b,G); }; }
var SECRET_NO='Das hat Mala in der Kiste gelesen, nicht ich. Sie hat es mir nicht gesagt.';
// Malas eigener Schluss: Als Mala darf der Spieler ihn ziehen; die Notiz bleibt ihr Geheimnis bis zum Streit
function malaOk(a,b){ return function(G){ return G.active==='mala' || secretOk(a,b)(G); }; }
function secretNo(malaSays){ return function(G){ return G.active==='mala'?malaSays:SECRET_NO; }; }

// ---------------------------------------------------------------- Schlüsse
M.defineDeductions({
  'z4_lesart+z4_antrag':{to:'z4_vermisst',if:secretOk('z4_lesart','z4_antrag'),no:secretNo('Das muss er von ihr hören. Nicht von mir, nicht aus ihrer Kiste.'),say:'„Nicht zurückgekommen“, hat Ruža geschrieben. „Vermisst“, hat Mama daraus gemacht, mit Stempel und Unterschrift. Sie hat gelesen, was sie lesen konnte.'},
  'z4_nachricht+z4_kode':{to:'z4_tot',if:malaOk('z4_nachricht','z4_kode'),no:SECRET_NO,say:'Ruža wollte „gefallen“ schreiben und hat „nicht zurückgekommen“ geschrieben, weil jemand sie darum gebeten hat. So schreiben Familien, die es wissen. In Sarajevo hieß das: tot.'},
  'z4_vermisst+z4_tot':{to:'z4_zweistaedte',if:secretOk('z4_vermisst','z4_tot'),no:secretNo('Das muss Marko selbst zusammenlegen. Es ist sein Satz.'),say:'Derselbe Satz. In Sarajevo hieß er tot, in München vermisst. Achtzehn Jahre lang. Und ich weiß, wer um diesen Satz gebeten hat.'},
  'z4_passierschein+z4_kurve_ana':{to:'z4_kurve',if:secretOk('z4_passierschein','z4_kurve_ana'),no:secretNo('Das sage ich ihm. Aber nicht so, zwischen zwei Zetteln.'),say:'Bis zur Kurve. Mama hat zurückgesehen, bis nichts mehr zu sehen war. „Wir kommen nach“, hat er gerufen. Sie ist nicht einfach gegangen.'},
  's4_bairisch+s4_fluch':{to:'s4_tarnung',say:'Bairisch für die Kollegen, italienisch für sich. Er konnte beides. Das eine war eine Tarnung, das andere war er.'},
  's4_peppino+s4_ausweis':{to:'s4_derselbe',say:'Nummer 17 auf der Mütze, Nummer 17 in der Akte. Peppino an Gleis 11, Josef Rugiero beim Amt. Derselbe Mann? Es wäre zu einfach, wenn eine Nummer reicht.'},
  's4_derselbe+s4_bunker':{to:'s4_name',say:'„Giuseppe? Das schreibt keiner.“ Ein Beamter, ein Stempel, ein junger Mann, der „Sì“ sagt. Josef Rugiero ist Giuseppe Ruggiero.'},
  's4_derselbe+s4_umschlag':{to:'s4_name',say:'Die Briefe gehen an Giuseppe Ruggiero, Gleis 11. Der Ausweis sagt Josef Rugiero, Gleis 11, Nummer 17. Derselbe Mann, zwei Namen.'},
  's4_bunker+s4_umschlag':{to:'s4_name',say:'Die Briefe gehen an Giuseppe Ruggiero. Im Bunker macht ein Beamter daraus Josef Rugiero, und er sagt „Sì“. Derselbe Mann. Den Namen hat man ihm hier genommen.'},   // Blindtest K4: der Hinweis nannte dieses Paar
  's4_bunker+s4_ausweis':{to:'s4_name',say:'Im Bunker wird aus Giuseppe ein Josef, aus Ruggiero ein Rugiero. Im Ausweis steht genau das. Josef Rugiero ist Giuseppe Ruggiero.'},
  's4_brief79+s4_carmela_hall':{to:'s4_wusste',say:'„Ich habe dich mit den Koffern gesehen.“ Und eine Frau, die beim Schreiben weint und lächelt. Carmela wusste es. Seit 1979.'},
  'g4_versuch1+g4_versuch2':{to:'g4_beides',say:'Ohne Gong steht er nicht auf, aber er friert, wenn sie bei ihm ist. Mit Gong steht er auf, aber ohne sie friert er nicht. Der Gong holt ihn. Ihre Hand hält ihn fest.'},
  'g4_beides+g4_depot':{to:'g4_worte',say:'„Tot“ vergisst er. Aber Feierabend kennt er. Fünfunddreißig Jahre hat sie am Depot gewartet. So muss ich es ihm sagen. In seiner Sprache.'}
});
// Wege, die nahe liegen, aber nicht reichen (Konzept 7.1 bis 7.3, Fehlversuche)
var NEAR={
  's4_peppino+s4_fluch':'Er flucht italienisch, er heißt Peppino. Ein Italiener am Bahnhof. Das sind viele.',
  's4_peppino+s4_bairisch':'Ein Urmünchner, sagt die Kioskfrau. Ein Peppino, sagt er selbst. Einer von beiden irrt. Oder keiner.',
  's4_peppino+s4_enzo':'Enzo nennt ihn Peppino. Das weiß ich schon von ihm selbst. Was ich nicht weiß, ist sein Nachname.',
  's4_genommen+s4_ausweis':'„Hier genommen“, sagt er. Im Ausweis steht ein Name. Aber wie wird aus einem Namen ein anderer?',
  's4_genommen+s4_peppino':'Peppino ist ein Rufname. Den Nachnamen hat man ihm hier genommen. Wo, sagt er: an Gleis 11.',
  'g4_drei+g4_gong':'Um drei, beim Gong. Vielleicht ist es der Gong. Vielleicht ist es die Uhrzeit. Das sagt mir keine Beobachtung, nur ein Versuch.',
  'g4_drei+g4_kalt':'Er friert, wenn sie kommt. Aber er stand schon auf, bevor sie da war. Zwei Dinge auf einmal. Ich muss sie trennen.',
  'g4_gong+g4_kalt':'Gong und Kälte kommen im selben Moment. Was davon ist was? Das sehe ich nur, wenn ich eins weglasse.',
  'g4_spaeter+g4_doku':'„Kommt später.“ So steht es in der Akte, und so sagen sie es. Das ist die Regel. Nicht der Grund, warum er friert.',
  'g4_versuch1+g4_depot':'Ein Versuch allein sagt mir nur die Hälfte. Ich brauche beide.',
  'g4_versuch2+g4_depot':'Ein Versuch allein sagt mir nur die Hälfte. Ich brauche beide.',
  'z4_lesart+z4_kode':'„Nicht zurückgekommen“ und „die es wissen“. Mama sagt, sie kann lesen. Aber was hat sie daraus gemacht? Das steht auf Papier, das ich nicht habe.',
  'z4_kolar+z4_kode':'Die Brauerei. Und ein Satz aus den Akten. Ich will die beiden nicht nebeneinanderlegen.',
  'z4_ana2004+z4_kolar':'Ana hat eine Probe gegeben, und Frau Kolar hat ein Grab. Das passt zusammen. Das ist kein Schluss. Das ist ein Ergebnis.',
  'u4_pantoffeln+z4_lesart':'Sie stellt ihm die Hausschuhe hin. Jeden Tag. Weil „nicht zurückgekommen“ heißt: noch nicht.',
  'u4_dach+z4_lesart':'Achtzehn Jahre Geld für ein Dach, unter dem keiner mehr wohnt. Für den Fall, dass er nach Hause kommt.'
};
Object.keys(NEAR).forEach(function(k){ var t=NEAR[k]; if (!M.DEDUCE[k] && !M.DEDUCE[k.split('+').reverse().join('+')]) M.DEDUCE[k]=function(A){ M.sfx&&M.sfx('nope'); return {ok:false,t:M.k4NoteHidden(k.split('+')[0])||M.k4NoteHidden(k.split('+')[1])?SECRET_NO:t}; }; });

// ---------------------------------------------------------------- nach Schlüssen: Reaktionen (laufen nach dem Schließen des Notizbuchs, 96_k4_story.js)
var od0=M.onDeduce;
M.onDeduce=function(to,G){ if (M.chapterOf(G)!==4){ if (od0) return od0(to,G); return; } if (M.k4Queue) M.k4Queue('ded:'+to); };

// ---------------------------------------------------------------- Antworten bei falschen Verbindungen
var POOL={
  same:['Zwei Dinge, die nebeneinander liegen. Mehr nicht.','Ich drehe es hin und her. Es greift nicht.','Nein. Ein Faden, der nirgends festgemacht ist.','Klingt gut. Stimmt nicht. Das kenne ich vom Übersetzen.','Das passt nicht. Noch nicht, oder gar nicht.'],
  cross:['Sepp, Gerda, Mama. Jeder hat seine eigene Geschichte. Ich sollte sie nicht ineinanderschieben.','Das sind zwei verschiedene Menschen. Die eine weiß nichts vom anderen.','Nein. Das gehört nicht zusammen, nur weil es in derselben Woche passiert.'],
  family:['Das ist meine Familie. Da will ich, dass alles zusammenpasst. Tut es nicht.','Ich suche einen Zusammenhang, den ich mir wünsche. Nicht den, der da ist.','Mama würde sagen: „Ne miješaj.“ Misch nicht alles zusammen.'],
  again:['Das habe ich schon versucht.','Noch einmal dasselbe. Es wird nicht richtiger.']
};
var nc0=M.noCombo;
M.noCombo=function(a,b,G){ if (M.chapterOf(G)!==4) return nc0?nc0(a,b,G):'Das hängt nicht zusammen.';
  if (M.k4NoteHidden(a,G)||M.k4NoteHidden(b,G)) return SECRET_NO;
  var A=M.NOTES[a]||{}, B=M.NOTES[b]||{}, key='nc.'+[a,b].sort().join('+'); G.cyc=G.cyc||{};
  if (G.flags[key]){ var k0=G.cyc.nc4A=(G.cyc.nc4A||0)+1; return POOL.again[k0%POOL.again.length]; } G.flags[key]=true;
  var pool=(A.c===B.c)?(A.c==='z4'?POOL.family:POOL.same):POOL.cross, k=G.cyc['nc4_'+pool.length]=(G.cyc['nc4_'+pool.length]||0)+1;
  return pool[k%pool.length]; };
})(M);
