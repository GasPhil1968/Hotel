/* Bosnisch/Kroatisch – Kapitel 1: rooms/varos.js, rooms/flat.js, rooms/office.js
   Zdenka: Čakavisch (gut lesbar), Mala und Marko im Gespräch mit Mala: Sarajevo-Bosnisch, Marko sonst, Erzähler, Oberfläche:
   Standardkroatisch, Mladen und Vesna: Standard (leichte Split-Färbung). Hinweis: Notizbuch-Antworten (askOpt) und give-Texte
   als reiner Text spricht die Engine mit der gerade gespielten Figur; übersetzt ist hier, wer sie inhaltlich sagt. */
(function(M){ if (!M.trAdd) return;
M.trAdd('bhs', {
  // ---------------------------------------------------------------- varos.js
  'Gute Nacht, junger Mann.': 'Laku noć, sinko.',   // Zdenka
  'Sie sind der von der Zeitung.': 'Ti si onaj od novina.',   // Zdenka
  'Marko Vuković. Vesna Kralj hat mich geschickt. Wegen Gospođa Perić.': 'Marko Vuković. Poslala me Vesna Kralj. Zbog gospođe Perić.',   // Marko
  'Siebenundzwanzig Jahre hat niemand nach ihr gefragt. Und jetzt kommt die Zeitung.': 'Dvadeset i sedan godina nitko nije pita za nju. A sad dolaze novine.',   // Zdenka
  'Haben Sie, was Sie brauchen?': 'Jesi naša ča ti triba?',   // Zdenka
  'Wie war sie?': 'Kakva je bila?',   // Marko
  'Stur. Zu Kindern freundlich, zum Wetter nicht. Sie hat für die halbe Gasse gestrickt, Socken, Mützen, alles. Nur für sich nie.': 'Tvrda glava. Prema dici dobra, prema vrimenu ne. Plela je za pola ulice: bičve, kape, sve. Samo za sebe nikad.',   // Zdenka
  'Hatte sie wirklich niemanden mehr?': 'Zar stvarno više nije imala nikoga?',   // Marko
  'Einen Sohn. Tonći.': 'Sina. Tonćija.',   // Zdenka
  'Vierundachtzig. Die Bura. Er kam nicht nach Hause.': 'Osamdeset četvrte. Bura. Ni doša doma.',   // Zdenka
  'Das tut mir leid.': 'Žao mi je.',   // Marko
  'Ihr hat es leid getan. Siebenundzwanzig Jahre lang.': 'Njoj je bilo žao. Dvadeset i sedan godina.',   // Zdenka
  'Was hat sie den Tag über gemacht?': 'Što je radila preko dana?',   // Marko
  'Morgens die Messe bei Sveti Nikola. Mittags der Markt. Und abends die Riva.': 'Ujutro misa kod Svetog Nikole. Na podne Pazar. A navečer Riva.',   // Zdenka
  'Jeden Abend um sieben. Bei Regen mit Schirm, bei Bura ohne. Seit vierundachtzig.': 'Svaku večer u sedan. Po kiši s ombrelon, po buri bez. Od osamdeset četvrte.',   // Zdenka
  'Warum um sieben?': 'Zašto u sedam?',   // Marko
  'Um sieben kam früher das Boot aus Supetar. Irgendwann haben wir aufgehört zu fragen, worauf sie wartet.': 'U sedan je nekad dolazija brod iz Supetra. Jednom smo prestali pitat na ča čeka.',   // Zdenka
  'Man fragt ja auch nicht das Meer, warum es da ist.': 'Ni more ne pitaš zač je tu.',   // Zdenka
  'Kann ich mir die Wohnung ansehen? Sie haben den Schlüssel.': 'Mogu li pogledati stan? Ključ je kod vas.',   // Marko
  'Erst will ich wissen, was Sie über sie schreiben.': 'Prvo oću znat ča ćeš o njoj pisat.',   // Zdenka
  'Ein paar Zeilen, damit jemand weiß, dass sie gelebt hat.': 'Nekoliko redaka, da netko zna da je živjela.',   // Marko
  'Zweitausend Zeichen. Mehr ist es nicht.': 'Dvije tisuće znakova. Ništa više.',   // Marko
  'Das weiß ich erst, wenn ich die Wohnung gesehen habe.': 'To ću znati tek kad vidim stan.',   // Marko
  'Zweitausend Zeichen. Für fünfundachtzig Jahre.': 'Dvi tisuće znakova. Za osamdeset i pet godina.',   // Zdenka
  'Dann schreiben Sie die mal ohne Schlüssel.': 'Onda ih lipo napiši bez ključa.',   // Zdenka
  'Das war das Falsche.': 'To nije trebalo.',   // Marko
  'Wenigstens lügen Sie nicht.': 'Bar ne lažeš.',   // Zdenka
  '…Gut.': '…Dobro.',   // Zdenka
  'Fassen Sie nichts an, was Sie nicht brauchen. Und bringen Sie ihn mir wieder.': 'Ne diraj ništa ča ti ne triba. I vrati mi ga.',   // Zdenka
  'Die Stillen. So heißt das in Ihrer Zeitung? Hier hieß sie einfach Ivka.': 'Tihi. Tako se to zove u tvojin novinama? Kod nas se zvala samo Ivka.',   // Zdenka (askOpt)
  'Fragen Sie mich nicht nach Tonći. Fragen Sie ihre Wohnung.': 'Ča mene pitaš za Tonćija? Pitaj njen stan.',   // Zdenka (askOpt)
  'Jeden Abend. Ich habe es irgendwann nicht mehr gesehen. So sieht man den Glockenturm auch nicht mehr.': 'Svaku večer. Jednom to više nisan ni vidila. Isto ka zvonik: ni njega više ne vidiš.',   // Zdenka (askOpt)
  'Dazu weiß ich nichts, junger Mann.': 'O tome ne znan ništa, mali.',   // Zdenka (askOpt)
  'Danke, Gospođa Zdenka.': 'Hvala, gospođo Zdenka.',   // Marko
  'Hm.': 'Hm.',   // Zdenka
  'Der von der Zeitung. Steht es morgen drin?': 'Onaj od novina. Hoće li izać sutra?',   // Zdenka
  'Morgen, ja.': 'Sutra, da.',   // Marko
  'Dann kaufe ich mir zwei. Eine für mich, eine für sie.': 'Onda kupin dvoje. Jedne za sebe, jedne za nju.',   // Zdenka
  'Kennen Sie Dinko Matić?': 'Poznajete li Dinka Matića?',   // Marko
  'Den Jungen vom alten Matić? Natürlich. Er flickt unten an der Matejuška Netze, seit er laufen kann.': 'Maloga od staroga Matića? Kako ne. Krpa mreže doli na Matejuški otkad zna hodat.',   // Zdenka
  'Er war nie bei ihr. Nicht ein einziges Mal in siebenundzwanzig Jahren. Und er war Tonćis bester Freund.': 'Nikad ni bija kod nje. Ni jedan jedini put u dvadeset i sedan godina. A bija je Tonćijev najbolji prijatelj.',   // Zdenka
  'Am Sonntag auf dem Friedhof stand er hinten an der Mauer. Als der Pfarrer fertig war, war er weg.': 'U nedilju na groblju stoja je straga, kod zida. Kad je župnik završija, njega više ni bilo.',   // Zdenka
  'Wie war Tonći?': 'Kakav je bio Tonći?',   // Marko
  'Ein lieber Junge. Steinmetz auf Brač, in Pučišća. Immer zu spät und immer am Lachen.': 'Dobro dite. Klesar na Braču, u Pučišćima. Uvik je kasnija i uvik se smija.',   // Zdenka
  'Er hat ihr jeden Freitag geschrieben. Jeden. Sie hat mir die Briefe vorgelesen, bis ich sie auswendig konnte.': 'Pisa joj je svaki petak. Svaki. Čitala mi je ta pisma dok ih nisan znala napamet.',   // Zdenka
  'Wie hat sie auf der Riva gewartet?': 'Kako je čekala na Rivi?',   // Marko
  'Am Ende der Mole, beim letzten Poller. Mantel zu, Hände in den Taschen. Nie Handschuhe.': 'Na kraju mola, kod zadnje bitve. Kaput zakopčan, ruke u žepima. Rukavice nikad.',   // Zdenka
  'Ich habe ihr drei Paar gestrickt. Sie hat gesagt: „Mit Handschuhen spüre ich nicht, wann die Bura kommt.“': 'Isplela san joj tri para. A ona je rekla: „S rukavicama ne osjetin kad dolazi bura.“',   // Zdenka
  'Haben Sie jemals mit ihr über Tonći gesprochen?': 'Jeste li ikad s njom razgovarali o Tonćiju?',   // Marko
  'Einmal. Neunundachtzig. Ich habe gesagt: Ivka, er kommt nicht. Sie hat mich angesehen, als hätte ich vom Wetter geredet.': 'Jednom. Osamdeset devete. Rekla san: Ivka, on neće doć. Pogledala me ka da san govorila o vrimenu.',   // Zdenka
  'Danach haben wir über das Wetter geredet. Zweiundzwanzig Jahre lang.': 'Posli smo govorile o vrimenu. Dvadeset i dvi godine.',   // Zdenka
  'Die ANKICA? Das Boot vom alten Matić. Hieß nach seiner Frau.': 'ANKICA? Barka staroga Matića. Nazva ju je po ženi.',   // Zdenka (askOpt)
  'An die Bura im Dezember vierundachtzig erinnert sich hier jeder. Drei Tage kein Schiff. Die Fenster haben gesungen.': 'Buru od dicembra osamdeset četvrte ovdi svi pamte. Tri dana ni bilo broda. Ponistre su pivale.',   // Zdenka (askOpt)
  'Auf der Mole? Junger Mann, Ivka ist am Donnerstag gestorben.': 'Na molu? Ča govoriš, mali? Ivka je umrla u četvrtak.',   // Zdenka
  '…Ich meinte, früher.': '…Mislio sam, nekad.',   // Marko
  'Früher, ja. Da hat sie dort gestanden.': 'E, nekad. Nekad je tamo stala.',   // Zdenka
  'Er hat ihr immer geschrieben, sie soll nicht in der Kälte warten. Sie hat es immer vorgelesen und dann trotzdem ihren Mantel angezogen.': 'Uvik joj je pisa da ne čeka na zimi. Ona bi to pročitala naglas i onda isto obukla kaput.',   // Zdenka (askOpt)
  'Er konnte ihr nicht in die Augen sehen. Das versteht man. Und man versteht es nicht.': 'U oči je ni moga pogledat. To se razumi. I ne razumi se.',   // Zdenka (askOpt)
  'Das klingt nach Tonći. Er hat immer an sie gedacht, bevor er an sich gedacht hat.': 'To je cili Tonći. Uvik je prvo mislija na nju, pa tek onda na sebe.',   // Zdenka (askOpt)
  'Drei Paar. Sie liegen noch in ihrer Kommode.': 'Tri para. Još stoju u njenoj komodi.',   // Zdenka (askOpt)
  'Ich bin eine alte Frau. Fragen Sie mich nach dem Wetter.': 'Ja san stara žena. Pitaj me za vrime.',   // Zdenka (askOpt)
  'Gute Nacht.': 'Laku noć.',   // Marko
  'Gehen Sie nicht zu spät nach Hause. Die Bura kommt.': 'Nemoj ić kasno doma. Dolazi bura.',   // Zdenka
  'Da ist ja der Herr Journalist. Der Wind hat Sie den Hügel hinaufgeweht.': 'Evo nan gospodina novinara. Vitar te dopuha uz brdo.',   // Zdenka
  'Ich habe Ihnen die Zeitung mitgebracht.': 'Donio sam vam novine.',   // Marko
  'Wie geht es Ihnen?': 'Kako ste?',   // Marko
  'Gestern habe ich um sieben aus dem Fenster gesehen. Aus Gewohnheit. Da war niemand.': 'Jučer san u sedan pogledala kroz ponistru. Iz navike. Nikoga ni bilo.',   // Zdenka
  'Ich glaube, sie ist jetzt zu Hause.': 'Mislim da je sad kod kuće.',   // Marko
  'Wo sonst.': 'A di drugo.',   // Zdenka
  'Wissen Sie etwas über die alte Ledana?': 'Znate li nešto o staroj Ledani?',   // Marko
  'Die Eisfabrik? Da haben die Fischer früher ihr Eis geholt. Seit dem Krieg verrottet sie. Jetzt wollen sie ein Hotel bauen.': 'Ledana? Tamo su ribari prija dolazili po led. Od rata propada. Sad bi tamo tili hotel.',   // Zdenka
  'Da ist ein Junge gestorben, vor Jahren. Die Treppe. Seine Mutter wohnte unten bei der Pjaca. Sie ist nach Zagreb gezogen.': 'Tamo je umra jedan mladić, ima tomu godina. Pa je niz skale. Mater mu je živila doli kod Pjace. Preselila se u Zagreb.',   // Zdenka
  'Luka? Der mit der Gitarre an der Riva? Ich habe ihm im Sommer immer zehn Kuna in den Hut gelegt. Für die Lieder von früher.': 'Luka? Onaj s gitaron na Rivi? Svako lito san mu stavila deset kuna u šešir. Za stare pisme.',   // Zdenka (askOpt)
  'Ein Sturz. Drei Tage hat ihn niemand gefunden. Seine Mutter hat nie wieder gesungen, sagt man.': 'Pa je, jadan. Tri dana ga nitko ni naša. Mater mu više nikad ni zapivala, kažu.',   // Zdenka (askOpt)
  'Fragen Sie mich lieber nach Ivka. Da weiß ich Bescheid.': 'Radije me pitaj za Ivku. O njoj ti znan sve.',   // Zdenka (askOpt)
  'Bis bald.': 'Vidimo se.',   // Marko
  'Ziehen Sie sich was an, bei der Bura.': 'Obuci se lipo, po ovoj buri.',   // Zdenka
  '„Ivka Perić hat siebenundzwanzig Jahre lang auf ein Schiff gewartet.“': '„Ivka Perić čekala je jedan brod dvadeset i sedam godina.“',   // Markos erster Satz (Option; Zdenka liest ihn vor)
  '„Jeden Abend um sieben ging Ivka Perić zur Riva.“': '„Svake večeri u sedam Ivka Perić išla je na Rivu.“',   // Markos erster Satz
  '„Ivka Perić hinterlässt zwei Tassen und einen Stuhl am Fenster.“': '„Ivka Perić iza sebe ostavlja dvije šalice i stolicu uz prozor.“',   // Markos erster Satz
  'Zeigen Sie.': 'Pokažite.',   // Standard (auch Nina, Rade)
  '@zdenka:Zeigen Sie.': 'Daj da vidin.',   // Zdenka
  '…Das hat sie verdient.': '…To je zaslužila.',   // Zdenka
  'Warten Sie.': 'Čekajte.',   // Mladen (Standard)
  '@zdenka:Warten Sie.': 'Čekaj malo.',   // Zdenka
  'Nehmen Sie das Radio. Freitag kommt sowieso alles weg. Sie hat damit jeden Abend den Seewetterbericht gehört.': 'Uzmi radio. U petak ionako sve ide van. Svaku večer je na njemu slušala vrime za pomorce.',   // Zdenka
  'Danke. Ich passe darauf auf.': 'Hvala. Pazit ću na njega.',   // Marko
  'Batterien hat es keine. Die hat sie immer rausgenommen, damit sie nicht auslaufen. So war sie.': 'Baterija nima. Uvik ih je vadila da ne iscure. Takva je bila.',   // Zdenka
  'Zur Stadt': 'U grad',   // Name
  'Die Gasse hinunter, zur Stadt.': 'Niz uličicu, prema gradu.',   // Marko
  'Zdenka': 'Zdenka',   // Name
  'Eine alte Frau ganz in Schwarz, auf einem Schemel vor ihrer Tür. Sie schaut mich an, als hätte sie mich schon vor Jahren erwartet und sei enttäuscht.': 'Starica sva u crnom, na stolčiću pred svojim vratima. Gleda me kao da me je čekala još prije mnogo godina, pa je sad razočarana.',   // Marko
  'Gospođa Zdenka, auf ihrem Posten. In der Gasse passiert nichts, was sie nicht sieht.': 'Gospođa Zdenka na svojoj straži. U uličici se ne dogodi ništa što ona ne vidi.',   // Marko
  'Sie trägt Schwarz seit ihrem Mann. Sie wird es tragen, bis jemand für sie Schwarz trägt.': 'Nosi crninu za mužem. Nosit će je dok neko ne bude nosio crninu za njom.',   // Mala
  'Sie redet mit der Katze. „Jetzt sind wir nur noch zwei, Mrki.“': 'Priča s mačkom. „Sad smo ostali samo nas dvoje, Mrki.“',   // Mala
  'Sind Sie fertig?': 'Jesi gotov?',   // Zdenka
  'Noch nicht ganz.': 'Još ne sasvim.',   // Marko
  'Tonći und der kleine Matić. Auf der ANKICA. Sie waren unzertrennlich.': 'Tonći i mali Matić. Na ANKICI. Bili su ka nokat i meso.',   // Zdenka
  '„Napravi fritule.“ Das hat er jedes Jahr geschrieben. Und sie hat jedes Jahr Fritule gemacht. Auch danach.': '„Napravi fritule.“ To je pisa svake godine. I ona je svake godine pravila fritule. I posli.',   // Zdenka (give-Text, Engine zeigt ihn als Marko)
  'Graue Handschuhe … Woher haben Sie die?': 'Sive rukavice … Di si ih naša?',   // Zdenka
  'Von jemandem, der sie siebenundzwanzig Jahre aufbewahrt hat.': 'Od nekoga tko ih je čuvao dvadeset i sedam godina.',   // Marko
  'Zdenkas Tür': 'Zdenkina vrata',   // Name
  'Zdenkas Tür, mit einem Fliegenvorhang aus Plastikstreifen. Im November hängt er immer noch.': 'Zdenkina vrata, sa zavjesom od plastičnih traka protiv muha. U studenom još visi.',   // Marko
  'Das ist nicht meine Tür. Und Zdenka sitzt davor.': 'To nisu moja vrata. A i Zdenka sjedi pred njima.',   // Marko
  'Drinnen läuft der Fernseher. Sie hört nicht hin. Sie lässt ihn nur laufen, damit jemand redet.': 'Unutra radi televizor. Ne sluša ga. Pušta ga samo da neko priča.',   // Mala
  'Schemel': 'Stolčić',   // Name
  'Ein Holzschemel. Belegt.': 'Drveni stolčić. Zauzet.',   // Marko
  'Ein leerer Holzschemel. Ohne Zdenka sieht die Gasse falsch aus.': 'Prazan drveni stolčić. Bez Zdenke uličica izgleda krivo.',   // Marko
  'Sie sitzt hier, seit ihr Mann tot ist. Er hat ihn gebaut.': 'Sjedi ovdje otkad joj je umro muž. On ga je napravio.',   // Mala
  'Pflanzen': 'Biljke',   // Name
  'Basilikum und Geranien in alten Olivenöldosen. Hier wirft niemand eine Dose weg.': 'Bosiljak i pelargonije u starim limenkama od maslinova ulja. Ovdje nitko ne baca limenke.',   // Marko
  'Das Basilikum gehört der Gasse.': 'Bosiljak pripada uličici.',   // Marko
  'Sie gießt jeden Morgen auch Ivkas Pflanzen. Ich glaube, sie wird nicht damit aufhören.': 'Svako jutro zalije i Ivkino cvijeće. Mislim da neće prestati.',   // Mala
  'Ivkas Tür': 'Ivkina vrata',   // Name
  'Grün, abgeblättert, Nummer 14. Unter der Klinke ist die Farbe ganz weg, von siebenundzwanzig Jahren Hinausgehen.': 'Zelena, oljuštena, broj 14. Ispod kvake boje uopće nema, od dvadeset i sedam godina izlaženja.',   // Marko
  'Ivkas Tür. Zu.': 'Ivkina vrata. Zatvorena.',   // Marko
  'Abgeschlossen. Und Zdenka hat den Schlüssel wieder.': 'Zaključano. A ključ je opet kod Zdenke.',   // Marko
  'Abgeschlossen. Zdenka hat den Schlüssel.': 'Zaključano. Ključ je kod Zdenke.',   // Marko
  'Dahinter ist es still. Nicht leer. Still.': 'Iza je tiho. Nije prazno. Tiho.',   // Mala
  'Jemand ist jeden Abend um Viertel vor sieben hier hinausgegangen. So oft, dass die Tür es sich gemerkt hat.': 'Neko je svako veče u petnaest do sedam izlazio odavde. Toliko puta da su vrata to zapamtila.',   // Mala
  'Fensterläden': 'Kapci',   // Name
  'Die Läden sind geschlossen. Seit Donnerstag.': 'Kapci su zatvoreni. Od četvrtka.',   // Marko
  'Ich mache nicht die Fenster einer Toten auf. Nicht von außen.': 'Ne otvaram prozore pokojnici. Ne izvana.',   // Marko
  'Hinter den Läden sitzt niemand mehr am Fenster.': 'Iza kapaka više niko ne sjedi na pendžeru.',   // Mala
  'Briefkasten': 'Sandučić',   // Name
  '„PERIĆ“, mit einem Stück Klebeband. Drin steckt ein Prospekt für Waschmittel. Die Welt hat nicht mitbekommen, dass hier niemand mehr wäscht.': '„PERIĆ“, na komadu ljepljive trake. Unutra je letak za deterdžent. Svijet nije primijetio da ovdje više nitko ne pere.',   // Marko
  'Ich nehme einer Toten nicht die Post weg.': 'Ne uzimam poštu pokojnici.',   // Marko
  'Jahrelang kamen hier Briefe von Brač an. Und dann keine mehr.': 'Godinama su ovdje stizala pisma s Brača. A onda više nijedno.',   // Mala
  'Todesanzeige': 'Osmrtnica',   // Name
  'Sie haben ihr Bild nicht dazugetan. Es gab keines, auf dem sie allein war.': 'Nisu stavili njenu sliku. Nije bilo nijedne na kojoj je sama.',   // Mala
  'Sveti Nikola': 'Sveti Nikola',   // Name
  'Sveti Nikola. Der Heilige der Seeleute. Die Kirche ist kleiner als meine Wohnung und älter als fast alles, was ich kenne.': 'Sveti Nikola. Zaštitnik pomoraca. Crkva je manja od mog stana i starija od gotovo svega što poznajem.',   // Marko
  'Zu. Der Pfarrer kommt nur morgens.': 'Zatvoreno. Župnik dolazi samo ujutro.',   // Marko
  'Hier haben sie für die gebetet, die draußen waren. Manchmal haben die draußen es gehört. Glaube ich.': 'Ovdje su se molili za one na moru. Ponekad su ih oni na moru i čuli. Mislim.',   // Mala
  'Glocke': 'Zvono',   // Name
  'Eine einzige Glocke im Giebel. Sie schlägt die Messe und die Toten.': 'Jedno jedino zvono na preslici. Zvoni za misu i za mrtve.',   // Marko
  'Ich läute keine Kirchenglocken.': 'Ne zvonim crkvenim zvonima.',   // Marko
  'Nein.': 'Ne.',   // Mala / Marko
  'Stufen': 'Stube',   // Name
  'Die Stufen hinauf zum Marjan. Oben nur Pinien, Wind und die Stadt unter einem.': 'Stube prema Marjanu. Gore samo borovi, vjetar i grad pod nogama.',   // Marko
  'Heute nicht. Meine Knie sind älter als ich.': 'Danas ne. Koljena su mi starija od mene.',   // Marko
  'Oben auf dem Hügel ist es nachts sehr hell. Man sieht alle Lichter auf einmal.': 'Gore na brdu je noću jako svijetlo. Vide se sva svjetla odjednom.',   // Mala
  'Wäscheleine': 'Uže za rublje',   // Name
  'Wäsche in der Nacht. Hier hängt man sie auf, wenn der Wind gut ist, egal wie spät.': 'Rublje u noći. Ovdje se vješa kad je vjetar dobar, koliko god bilo kasno.',   // Marko
  'Wäsche quer über der Gasse. Hier wissen alle alles voneinander. Fast alles.': 'Rublje preko cijele uličice. Ovdje svi sve znaju jedni o drugima. Gotovo sve.',   // Marko
  'Das sind Zdenkas Laken. Ich hänge an meinem Leben.': 'To su Zdenkine plahte. Ne bih htio da mi život visi o koncu.',   // Marko
  'Ein Kinderhemd. Hier wohnt also doch noch jemand Junges.': 'Dječija košuljica. Znači, ipak ovdje živi još neko mlad.',   // Mala
  'Laterne': 'Svjetiljka',   // Name
  'Eine Laterne an einem Eisenarm. Sie geht an, wenn sie will.': 'Svjetiljka na željeznom nosaču. Upali se kad joj se hoće.',   // Marko
  'Licht. Ich mag es nicht mehr so wie früher.': 'Svjetlo. Ne volim ga više kao prije.',   // Mala
  'Katze': 'Mačak',   // Name
  'Eine schwarze Katze auf einer Stufe. Mrki. Er gehört Zdenka oder niemandem, was hier dasselbe ist.': 'Crni mačak na stubi. Mrki. Pripada Zdenki ili nikome, što je ovdje isto.',   // Marko
  '„Mic, mic.“ Mrki sieht nicht mich an. Er sieht hinter mich. Ich drehe mich nicht um.': '„Mic, mic.“ Mrki ne gleda mene. Gleda iza mene. Ne okrećem se.',   // Marko
  '„Mic, mic.“ Mrki sieht mich an und dann an mir vorbei. Genau an die Stelle, wo Mala steht.': '„Mic, mic.“ Mrki me pogleda, a onda mimo mene. Točno onamo gdje stoji Mala.',   // Marko
  '„Mic, mic.“ Mrki sieht mich an, als wäre ich ein schlechter Witz.': '„Mic, mic.“ Mrki me gleda kao da sam loš vic.',   // Marko
  'Er würde mich zerkratzen. Mit Recht.': 'Izgrebao bi me. I s pravom.',   // Marko
  'Er sieht mich. Katzen sehen mich immer.': 'Vidi me. Mačke me uvijek vide.',   // Mala
  'Er blinzelt langsam. Das heißt, er hat keine Angst.': 'Polako trepće. To znači da se ne boji.',   // Mala
  '✝  OSMRTNICA': '+  OSMRTNICA',   // Dokument (Titel; ✝ fehlt in der Schrift und im Prüf-Zeichensatz)
  'Nach kurzer Krankheit verstarb im Alter von 85 Jahren': 'Nakon kratke bolesti, u dobi od 85 godina, preminula je',   // Dokument
  'IVKA PERIĆ': 'IVKA PERIĆ',   // Dokument
  'geb. 1926.': 'rođena 1926.',   // Dokument
  'Die Beerdigung fand am Sonntag, 13.11.2011,': 'Sprovod je održan u nedjelju 13.11.2011.',   // Dokument
  'auf dem Friedhof Lovrinac statt.': 'na groblju Lovrinac.',   // Dokument
  'Es trauern die Nachbarn aus Veli Varoš.': 'Tuguju susjedi iz Velog Varoša.',   // Dokument
  '„Es trauern die Nachbarn.“ Sonst niemand. Sonst war niemand mehr da.': '„Tuguju susjedi.“ Nitko drugi. Nitko drugi nije ni ostao.',   // Marko
  'Veli Varoš': 'Veli Varoš',   // Name
  'Mehr, als in zweitausend Zeichen passt.': 'Više nego što stane u dvije tisuće znakova.',   // Marko
  'Das ist immer so.': 'Uvik je tako.',   // Zdenka
  'Veli Varoš. Hier sind die Gassen so eng, dass sich die Nachbarn über die Straße das Salz reichen.': 'Veli Varoš. Ovdje su uličice tako uske da susjedi jedni drugima dodaju sol preko ulice.',   // Marko
  'Oben an der Kirchentreppe stand eben jemand.': 'Gore na crkvenim stubama upravo je netko stajao.',   // Marko
  'Jetzt nicht mehr.': 'Sad više ne.',   // Marko
  'Zdenka sitzt wieder auf ihrem Posten.': 'Zdenka je opet na svojoj straži.',   // Marko
  // ---------------------------------------------------------------- flat.js
  'SARAJEVO': 'SARAJEVO',   // Aufschrift
  'Fenster': 'Prozor',   // Name
  'Der Hafen im Regen. Die Fähre nach Supetar legt ab, als hätte sie es nicht eilig. Seit drei Tagen Jugo. Seit drei Tagen Kopfschmerzen.': 'Luka na kiši. Trajekt za Supetar isplovljava kao da mu se nikamo ne žuri. Već tri dana jugo. Već tri dana glavobolja.',   // Marko
  'Unten liegen die Lichter der Riva im Wasser. Draußen ist alles still, nur das Meer nicht.': 'Dolje u vodi leže svjetla Rive. Vani je sve tiho, samo more nije.',   // Marko
  'Der Hafen. Fähren kommen, Fähren fahren. Ich habe aufgehört mitzuzählen.': 'Luka. Trajekti dolaze, trajekti odlaze. Prestao sam brojati.',   // Marko
  'Ich wische die Scheibe mit dem Ärmel ab. Dahinter ist nur der Hafen.': 'Obrišem staklo rukavom. Iza je samo luka.',   // Marko
  'Ich lehne die Stirn an die Scheibe. Sie ist kalt. Das hilft ein bisschen.': 'Naslonim čelo na staklo. Hladno je. To malo pomaže.',   // Marko
  'Ich mache es zu.': 'Zatvorim ga.',   // Marko
  'Die Läden sind offen. Das Fenster bleibt zu. Der Jugo drückt den Regen sonst bis aufs Bett.': 'Kapci su otvoreni. Prozor ostaje zatvoren. Inače mi jugo natjera kišu sve do kreveta.',   // Marko
  'Von hier sieht man die Mole. Ich stehe oft hier, wenn er schläft.': 'Odavde se vidi mol. Često stojim ovdje kad on spava.',   // Mala
  'Hier hat er viele Nächte gestanden. Der Nachhall ist müde, nicht mehr.': 'Ovdje je stajao mnogo noći. Odjek je umoran, ništa više.',   // Mala
  'Laptop': 'Laptop',   // Name
  'Der Text über Ivka Perić. Noch kein erster Satz. Der erste Satz ist immer der schwerste.': 'Tekst o Ivki Perić. Još nema prve rečenice. Prva rečenica uvijek je najteža.',   // Marko
  'Eine italienische Bedienungsanleitung für eine Espressomaschine. Seite 31 von 48. „Die Maschine ist kein Spielzeug.“ Das glaube ich ihr.': 'Talijanske upute za uporabu aparata za espresso. Stranica 31 od 48. „Aparat nije igračka.“ U to mu vjerujem.',   // Marko
  'Die Maschine wartet. Maschinen können das.': 'Aparat čeka. Strojevi to znaju.',   // Marko
  'Ich übersetze zwei Sätze und lese sie dreimal. Heute wird das nichts.': 'Prevedem dvije rečenice i pročitam ih triput. Danas od toga ništa.',   // Marko
  'Ich tippe einen Satz. Ich lösche ihn wieder. Das ist mein Beruf.': 'Utipkam rečenicu. Pa je obrišem. To mi je posao.',   // Marko
  'Er schreibt fremde Sätze in seine Sprache. Seine eigenen schreibt er nicht.': 'Tuđe rečenice prevodi na svoj jezik. Svoje ne piše.',   // Mala
  'Übersetzungsaufträge': 'Narudžbe prijevoda',   // Name
  'Ein Stapel Aufträge. Ein Mietvertrag aus Graz, ein Beipackzettel, ein Liebesbrief, den jemand für eine Scheidung übersetzt haben will.': 'Hrpa narudžbi. Ugovor o najmu iz Graza, uputa o lijeku, ljubavno pismo koje netko želi dati prevesti zbog razvoda.',   // Marko
  'Die bleiben hier. Sie laufen mir nicht weg. Leider.': 'One ostaju ovdje. Neće mi pobjeći. Nažalost.',   // Marko
  'Papier, das darauf wartet, in eine andere Sprache zu gehen. Wie fast alles hier.': 'Papir koji čeka da pređe u drugi jezik. Kao skoro sve ovdje.',   // Mala
  'Kaffeetassen': 'Šalice za kavu',   // Name
  'Drei Tassen. Alle leer, alle von gestern. Oder von vorgestern.': 'Tri šalice. Sve prazne, sve od jučer. Ili od prekjučer.',   // Marko
  'Ich spüle sie morgen. Das sage ich seit Sonntag.': 'Oprat ću ih sutra. To govorim od nedjelje.',   // Marko
  'Drei Tassen. Er trinkt nie aus.': 'Tri šolje. Nikad ne popije do kraja.',   // Mala
  'Aschenbecher': 'Pepeljara',   // Name
  'Voll. Ich rauche nicht viel. Nur nachts, wenn ich nicht schlafen kann. Also viel.': 'Puna. Ne pušim puno. Samo noću, kad ne mogu spavati. Dakle, puno.',   // Marko
  'Den leere ich, wenn er überläuft. Er läuft über.': 'Ispraznit ću je kad bude prepuna. Prepuna je.',   // Marko
  'Er raucht, wenn er wach liegt. Dann ist der Rauch das Einzige, das sich im Zimmer bewegt. Außer mir.': 'Puši kad leži budan. Tad je dim jedino što se miče u sobi. Osim mene.',   // Mala
  'Schreibtischlampe': 'Stolna lampa',   // Name
  'Die Lampe hat drei Stellungen: zu hell, zu dunkel und kaputt.': 'Lampa ima tri položaja: presvijetlo, pretamno i pokvareno.',   // Marko
  'Ich lasse sie, wie sie ist.': 'Ostavit ću je kakva jest.',   // Marko
  'Das Licht, unter dem er nachts die fremden Sätze schreibt.': 'Svjetlo pod kojim noću piše tuđe rečenice.',   // Mala
  'Anrufbeantworter': 'Sekretarica',   // Name
  'Das rote Licht blinkt. Eine Nachricht. Wahrscheinlich Vesna. Es ist immer Vesna.': 'Crveno svjetlo trepće. Jedna poruka. Vjerojatno Vesna. Uvijek je Vesna.',   // Marko
  'Keine neuen Nachrichten. So ist es mir am liebsten.': 'Nema novih poruka. Tako mi je najdraže.',   // Marko
  'Keine neuen Nachrichten.': 'Nema novih poruka.',   // Marko
  'Eine Maschine, die für ihn zuhört. Ich kenne das.': 'Mašina koja sluša umjesto njega. Znam kako je to.',   // Mala
  'Bücherregal': 'Polica za knjige',   // Name
  'Wörterbücher. Deutsch, Italienisch, Englisch. Die einzigen, die mir nie widersprechen.': 'Rječnici. Njemački, talijanski, engleski. Jedini koji mi nikad ne proturječe.',   // Marko
  'Ich brauche heute keine Wörter. Ich habe zu viele.': 'Danas mi ne trebaju riječi. Imam ih previše.',   // Marko
  'Bücher voller Wörter für Dinge, die man trotzdem nicht sagt.': 'Knjige pune riječi za stvari koje se ipak ne kažu.',   // Mala
  'umgedrehtes Foto': 'okrenuta fotografija',   // Name
  'Das Foto liegt mit dem Bild nach oben. Ein Junge, eine alte Frau, eine Straßenbahn.': 'Fotografija leži licem prema gore. Dječak, starica, tramvaj.',   // Marko
  'Ich habe es nicht umgedreht. Ich weiß, dass ich es nicht umgedreht habe.': 'Nisam je okrenuo. Znam da je nisam okrenuo.',   // Marko
  'Der Pullover war dir zu groß.': 'Džemper ti je bio prevelik.',   // Mala
  'Ein Foto, mit dem Bild nach unten. Das liegt da schon lange so.': 'Fotografija, licem prema dolje. Tako leži već dugo.',   // Marko
  'Es liegt richtig so.': 'Tako i treba ležati.',   // Marko
  'Ich drehe es wieder um. Mit dem Bild nach unten. So gehört es.': 'Opet je okrenem. Licem prema dolje. Tako treba.',   // Marko
  'Einmal reicht.': 'Jednom je dosta.',   // Marko
  'Ein altes Foto': 'Stara fotografija',   // Titel (Erinnerung)
  'Ein Junge in einem gestreiften Pullover. Neben ihm eine alte Frau mit Kopftuch.': 'Dječak u prugastom puloveru. Pokraj njega starica s maramom.',   // Marko (Erinnerung)
  'Hinter ihnen eine Straßenbahn. Auf der Tafel: 3.': 'Iza njih tramvaj. Na ploči: 3.',   // Marko (Erinnerung)
  'Ich lege es zurück. Mit dem Bild nach unten.': 'Vratim je na mjesto. Licem prema dolje.',   // Marko (Erinnerung)
  'Er dreht es nicht um. Ich weiß trotzdem, was darauf ist.': 'Ne okreće je. Ja ipak znam šta je na njoj.',   // Mala
  'Ein Winter. Kohlenrauch. Jemand lacht über den Pullover, weil er zu groß ist.': 'Neka zima. Dim od uglja. Neko se smije džemperu jer je prevelik.',   // Mala
  '…Mehr will ich nicht sehen.': '…Više neću da gledam.',   // Mala
  'Schrank': 'Ormar',   // Name
  'Ein Schrank aus Nussholz, älter als das Haus. Er gehörte schon zur Wohnung.': 'Ormar od orahovine, stariji od kuće. Došao je sa stanom.',   // Marko
  'Hemden. Zwei gute, fünf andere. Ein Anzug für Beerdigungen. Er hängt öfter draußen, als mir lieb ist.': 'Košulje. Dvije dobre, pet ostalih. Odijelo za sprovode. Češće visi vani nego što bih volio.',   // Marko
  'Ein Schrank. Darauf der Karton.': 'Ormar. Na njemu kutija.',   // Mala
  'Karton „SARAJEVO“': 'Kutija „SARAJEVO“',   // Name
  'Ein Umzugskarton. SARAJEVO, mit Filzstift. Meine Schrift, sechzehn Jahre alt.': 'Kutija za selidbu. SARAJEVO, flomasterom. Moj rukopis, sa šesnaest godina.',   // Marko (Wechselsatz 1)
  'Zugeklebt. Seit siebzehn Jahren.': 'Zalijepljena. Već sedamnaest godina.',   // Marko (Wechselsatz 2)
  'Der bleibt oben. Da gehört er hin.': 'Ostaje gore. Tamo joj je mjesto.',   // Marko
  'Du hast ihn nie aufgemacht.': 'Nikad je nisi otvorio.',   // Mala
  'Da drin ist kein Nachhall. Nur Staub. Der Nachhall ist in dir.': 'Unutra nema odjeka. Samo prašina. Odjek je u tebi.',   // Mala
  'Džezva': 'Džezva',   // Name
  'Die Džezva meiner Großmutter. Messing, innen verzinnt, der Griff zweimal geklebt. Das Einzige aus Sarajevo, das ich jeden Tag benutze.': 'Džezva moje bake. Mjed, iznutra pokositrena, drška dvaput lijepljena. Jedina stvar iz Sarajeva kojom se služim svaki dan.',   // Marko
  'Kaffee kocht man nicht, sagte sie. Man wartet auf ihn.': '„Kahva se ne kuha“, govorila je. „Kahva se čeka.“',   // Marko (zitiert die Großmutter)
  'Sie riecht nach Kaffee und nach jemandem, der nicht mehr da ist.': 'Miriše na kahvu i na nekog koga više nema.',   // Mala
  'Kaffeedose': 'Limenka kave',   // Name
  'Gemahlener Kaffee, fein wie Mehl. Fast leer. Für eine Kanne reicht es.': 'Mljevena kava, fina kao brašno. Gotovo prazna. Za jednu džezvu dosta.',   // Marko
  'Ich nehme nur, was in die Džezva passt. Wenn es so weit ist.': 'Uzet ću samo koliko stane u džezvu. Kad dođe vrijeme.',   // Marko
  'Eine Dose. Nicht meine.': 'Limenka. Nije moja.',   // Mala
  'Spüle': 'Sudoper',   // Name
  'Eine Spüle, eine Tasse von gestern, ein tropfender Hahn. Er tropft im Takt des Regens.': 'Sudoper, šalica od jučer, slavina koja kaplje. Kaplje u ritmu kiše.',   // Marko
  'Ich drehe den Hahn zu. Er tropft weiter.': 'Zavrnem slavinu. I dalje kaplje.',   // Marko
  'Kaltes Wasser, bis knapp unter den Rand.': 'Hladna voda, do malo ispod ruba.',   // Marko
  'Da ist schon Wasser drin.': 'U njoj već ima vode.',   // Marko
  'Wasser, das nirgends hinwill.': 'Voda koja nikud neće.',   // Mala
  'Herd': 'Štednjak',   // Name
  'Zwei Platten. Eine funktioniert.': 'Dvije ploče. Jedna radi.',   // Marko
  'Den Herd anstellen und nichts darauf? So weit bin ich noch nicht.': 'Upaliti štednjak, a ništa ne staviti na njega? Nisam još dotle došao.',   // Marko
  'Erst Wasser. Sonst kocht nur das Messing.': 'Prvo voda. Inače se kuha samo mjed.',   // Marko
  'Er ist schon offen.': 'Već je otvoreno.',   // Marko (auch bar.js: Brief, palma.js: Klavierhocker)
  'Direkt über die Flamme? Dann habe ich Asche statt eines Briefs.': 'Ravno iznad plamena? Onda ću umjesto pisma imati pepeo.',   // Marko (Wechselsatz 1)
  'Über eine kalte Platte? Da passiert gar nichts.': 'Iznad hladne ploče? Tu se neće dogoditi ništa.',   // Marko (Wechselsatz 2)
  'Er stellt jeden Morgen dasselbe darauf. Das ist schön, glaube ich.': 'Svako jutro na njega stavi isto. To je lijepo, mislim.',   // Mala
  'Kühlschrank': 'Hladnjak',   // Name
  'Ein Kühlschrank, der seit 1987 brummt.': 'Hladnjak koji bruji od 1987.',   // Marko
  'Eine Zitrone, ein Glas Senf, zwei Bier. Ein Stillleben.': 'Limun, staklenka senfa, dva piva. Mrtva priroda.',   // Marko
  'Er brummt. Für mich klingt das wie ein Lied ohne Worte.': 'Bruji. Meni to zvuči kao pjesma bez riječi.',   // Mala
  'Bett': 'Krevet',   // Name
  'Ungemacht. Ich schlafe schlecht, also lohnt sich das Machen nicht.': 'Nenamješten. Loše spavam, pa se ne isplati namještati ga.',   // Marko
  'Ich bin nicht müde. Nur leer.': 'Nisam umoran. Samo prazan.',   // Marko
  'Nicht jetzt. Mein Kopf würde nur wieder über dem Kissen kreisen.': 'Ne sad. Glava bi mi opet samo kružila iznad jastuka.',   // Marko
  'Er schläft nicht. Er liegt nur.': 'Ne spava. Samo leži.',   // Mala
  'Garderobe': 'Vješalica',   // Name
  'Ein Haken. Sonst hängt mein Mantel hier. Ich habe ihn an.': 'Kuka. Inače ovdje visi moj kaput. Sad je na meni.',   // Marko
  'Ein Haken für einen Mantel.': 'Kuka za kaput.',   // Mala
  'Wohnungstür': 'Ulazna vrata',   // Name
  'Ich bleibe noch. Hinter mir blinkt etwas rot.': 'Ostajem još malo. Iza mene nešto trepće crveno.',   // Marko
  'Nicht mit diesem Kopf. Der ist noch nicht wach.': 'Ne s ovom glavom. Još se nije probudila.',   // Marko
  'Heute gehe ich nirgendwo mehr hin.': 'Danas više nikamo ne idem.',   // Marko
  'Das Telefon. Es klingelt schon wieder.': 'Telefon. Opet zvoni.',   // Marko
  'Die Tür. Drei Schlösser, von denen ich zwei benutze.': 'Vrata. Tri brave, od kojih koristim dvije.',   // Marko
  'Seine Tür. Für mich ist sie keine.': 'Njegova vrata. Za mene nisu vrata.',   // Mala
  '„Marko, Vesna. Für die Stillen. Ivka Perić, fünfundachtzig, Veli Varoš, Hausnummer vierzehn. Keine Verwandten, jedenfalls keine bekannten.“': '„Marko, Vesna ovdje. Za Tihe. Ivka Perić, osamdeset pet, Veli Varoš, kućni broj četrnaest. Rodbine nema, barem ne poznate.“',   // Vesna (Telefon)
  '„Freitag kommt die Stadt und räumt die Wohnung. Die Nachbarin, Gospođa Zdenka, hat den Schlüssel. Zweitausend Zeichen, bis morgen früh. Danke dir.“': '„U petak dolazi Grad i prazni stan. Ključ ima susjeda, gospođa Zdenka. Dvije tisuće znakova, do sutra ujutro. Aj, hvala ti.“',   // Vesna (Telefon)
  'Die Stillen. Menschen, die allein sterben, bekommen in Vesnas Zeitung zweitausend Zeichen. Mehr, als die meisten im Leben bekommen.': 'Tihi. Ljudi koji umru sami dobiju u Vesninim novinama dvije tisuće znakova. Više nego što većina dobije za života.',   // Marko
  'Auf der beschlagenen Scheibe hat jemand eine Straßenbahn gemalt. Mit dem Finger. Vorne eine Drei.': 'Netko je na zamagljenom staklu nacrtao tramvaj. Prstom. Sprijeda trojka.',   // Marko
  'Die Drei fährt bis ganz nach hinten.': 'Trojka ide skroz do kraja.',   // Mala (Stimme)
  'Ich war es. Im Halbschlaf. Wer sonst.': { hr:'Ja sam to bio. U polusnu. Tko bi drugi.', bs:'Ja sam to bio. U polusnu. Ko bi drugi.' },   // Marko antwortet Malas Stimme (bs), wie „Niko. Naravno da niko.“
  'Wasser aufsetzen. Kein Kaffee diesmal. Nur Dampf.': 'Staviti vodu. Ovaj put bez kave. Samo para.',   // Marko
  'Wasser aufsetzen. Kaffee hinein, wenn es summt. Warten, bis er steigt. Nicht rühren.': 'Staviti vodu. Kavu unutra kad zašumi. Čekati da se digne. Ne miješati.',   // Marko
  'Unten tutet die Fähre nach Supetar. Der Kaffee ist zu stark. So muss er sein.': 'Dolje trubi trajekt za Supetar. Kava je prejaka. Takva i mora biti.',   // Marko
  'Zweitausend Zeichen über eine Frau, die siebenundzwanzig Jahre lang zur Riva gegangen ist. Womit fange ich an?': 'Dvije tisuće znakova o ženi koja je dvadeset i sedam godina odlazila na Rivu. Čime da počnem?',   // Marko
  'Der erste Satz': 'Prva rečenica',   // Titel
  'Der Rest kommt fast von allein. Das ist das Traurige an diesen Texten.': 'Ostatak dođe gotovo sam od sebe. To je ono tužno kod ovakvih tekstova.',   // Marko
  'Danach schreibt sich der Rest. Leider.': 'Ostatak se onda napiše sam. Nažalost.',   // Marko
  'Der Rest ist leicht. Die zwei Tassen waren das Schwerste.': 'Ostatak je lak. Najteže su bile one dvije šalice.',   // Marko
  'Abgeschickt. Jetzt schlafen. Vielleicht.': 'Poslano. Sad spavati. Možda.',   // Marko
  'Nachts. Irgendwann nach zwei.': 'Noću. Negdje iza dva.',   // Erzähler
  'Kalt.': 'Hladno.',   // Marko
  'Das Fenster ist offen. Ich habe es zugemacht. Ich weiß, dass ich es zugemacht habe.': 'Prozor je otvoren. Zatvorio sam ga. Znam da sam ga zatvorio.',   // Marko
  'In der dunklen Scheibe, hinter seinem eigenen Spiegelbild, steht jemand. Ein Mädchen. Ganz still.': 'U tamnom staklu, iza njegova vlastitog odraza, netko stoji. Djevojka. Sasvim mirno.',   // Erzähler
  'Es gibt Leute, die nicht weiterkommen.': 'Ima ljudi koji ne mogu dalje.',   // Mala
  'Du kannst mit ihnen reden.': 'Ti možeš razgovarati s njima.',   // Mala
  'Ich kann sie finden.': 'Ja ih mogu naći.',   // Mala
  '„Wer ist da?“': { hr:'„Tko je tu?“', bs:'„Ko je tu?“' },   // Marko (Option; nach Malas Sätzen → bs; auch riva.js)
  '(Licht machen.)': '(Upaliti svjetlo.)',   // Option
  '„Ich träume.“': '„Sanjam.“',   // Marko (Option)
  'Nachts': 'Noću',   // Titel
  'Niemand.': 'Niko.',   // Marko an die Erscheinung (bs; auch Zora in K2)
  'Niemand. Natürlich niemand.': 'Niko. Naravno da niko.',   // Marko (bs)
  'Ja. Ich träume.': 'Da. Sanjam.',   // Marko
  'Ich schlafe zu wenig. Ich trinke zu viel Kaffee. Und ich schreibe zu viele Nachrufe.': 'Premalo spavam. Pijem previše kave. I pišem previše nekrologa.',   // Marko (erklärt es sich: wieder Kroatisch)
  'Das ist alles.': 'To je sve.',   // Marko
  'Markos Wohnung': 'Markov stan',   // Name
  'Wieder zu Hause. Der Regen hat aufgehört, der Kopf nicht.': 'Opet doma. Kiša je prestala, glava nije.',   // Marko
  // ---------------------------------------------------------------- office.js
  'Dobra večer.': 'Dobra večer.',   // Marko
  'Die letzte Fähre nach Supetar geht um halb zehn. Die nach Šolta ist weg. Und nein, ich weiß nicht, warum der Automat keine Münzen nimmt.': 'Zadnji trajekt za Supetar ide u pola deset. Onaj za Šoltu je otišao. I ne, ne znam zašto automat ne prima kovanice.',   // Mladen
  'Ich habe eine Frage zu einer Fähre. Von 1984.': 'Imam pitanje o jednom trajektu. Iz 1984.',   // Marko
  'Neunzehnhundertvierundachtzig. Junger Mann, ich weiß nicht einmal, wo meine Brille ist.': 'Tisuću devetsto osamdeset četvrta. Mladiću, ja ne znam ni gdje su mi naočale.',   // Mladen
  'Wozu brauchen Sie das?': 'A zašto vam to treba?',   // Mladen
  'Für einen Text über eine Frau, die letzte Woche gestorben ist.': 'Za tekst o ženi koja je umrla prošlog tjedna.',   // Marko
  'Das ist privat.': 'To je privatno.',   // Marko
  'Für die Zeitung. Glas Rive.': 'Za novine. Glas Rive.',   // Marko
  'Dann bleibt das Archiv auch privat.': 'Onda i arhiva ostaje privatna.',   // Mladen
  'Die Zeitung. Die schreiben über alles, nur nicht über die Fahrpläne.': 'Novine. Pišu o svemu, samo ne o redu plovidbe.',   // Mladen
  '…Wer?': '…Tko?',   // Mladen
  'Ivka Perić. Aus Veli Varoš.': 'Ivka Perić. Iz Velog Varoša.',   // Marko
  'Die Perić. Die jeden Abend auf der Mole stand.': 'Perićka. Ona koja je svake večeri stajala na molu.',   // Mladen
  'Gut. Welcher Tag?': 'Dobro. Koji dan?',   // Mladen
  'Der Tag: der 22. Dezember 1984.': 'Dan: 22. prosinca 1984.',   // Marko
  'Schauen Sie mal im Regal bei „1948“.': 'Pogledajte na polici kod „1948“.',   // Marko
  'Können Sie mir den Eintrag noch einmal vorlesen?': 'Možete li mi još jednom pročitati taj zapis?',   // Marko
  'Wie lange arbeiten Sie schon hier?': 'Koliko dugo već radite ovdje?',   // Marko
  'Seit fünfundsiebzig. Drei Staaten, vier Uniformen. Die Fähre nach Supetar fährt immer noch um dieselbe Zeit.': 'Od sedamdeset pete. Tri države, četiri uniforme. A trajekt za Supetar i dalje plovi u isto vrijeme.',   // Mladen
  'Kannten Sie Gospođa Perić?': 'Jeste li poznavali gospođu Perić?',   // Marko
  'Jeder hier kannte sie. Jeden Abend, die Mole, der letzte Poller.': 'Ovdje ju je svatko poznavao. Svake večeri, mol, zadnja bitva.',   // Mladen
  'Das Boot aus Supetar legt seit zwanzig Jahren drüben am Fährhafen an, nicht mehr an der Mole. Ich habe es ihr einmal gesagt.': 'Brod iz Supetra već dvadeset godina pristaje preko, u trajektnoj luci, a ne više na molu. Jednom sam joj to rekao.',   // Mladen
  'Sie hat gesagt: „Dann weiß er ja, wo ich bin.“': 'Rekla je: „Pa onda zna di san.“',   // Mladen (zitiert Ivka čakavisch)
  'Die alte Perić? Ja. Jeden Abend. Man gewöhnt sich an so etwas, wie an die Glocken.': 'Stara Perićka? Da. Svake večeri. Na to se čovjek navikne, kao na zvona.',   // Mladen (askOpt)
  'Das Siebenuhrboot aus Supetar. Gibt es seit 1962. Was ist damit?': 'Brod u sedam iz Supetra. Vozi od 1962. Što je s njim?',   // Mladen
  'Der zweiundzwanzigste Dezember? Was soll an dem Tag gewesen sein?': 'Dvadeset drugi prosinca? A što bi tog dana trebalo biti?',   // Mladen
  'Warum das Boot spät ist? Weil es Abend ist, junger Mann, und das Meer nicht auf Fahrpläne hört.': 'Zašto brod kasni? Zato što je večer, mladiću, a more ne sluša red plovidbe.',   // Mladen (askOpt)
  'Neunzehnhundertachtundvierzig? Da war ich noch nicht geboren.': 'Tisuću devetsto četrdeset osma? Tada još nisam bio ni rođen.',   // Mladen
  'Die ANKICA. Ein Fischerboot. Fischerboote stehen nicht in meinem Buch, außer wenn etwas passiert.': 'ANKICA. Ribarska brodica. Ribarskih brodica nema u mojoj knjizi, osim kad se nešto dogodi.',   // Mladen (askOpt)
  'Ich habe ihn gesehen, damals. Sie haben ihn mit einer Decke um die Schultern hier hereingebracht. Neunzehn Jahre alt. Er hat nicht geredet.': 'Vidio sam ga, tada. Doveli su ga ovamo s dekom oko ramena. Devetnaest godina. Nije govorio.',   // Mladen (askOpt)
  'Das Seewetter? Läuft immer noch jeden Abend. Neunzehn Uhr zwanzig. Hat sich nie jemand beschwert.': 'Pomorska prognoza? I dalje ide svake večeri. U devetnaest i dvadeset. Nikad se nitko nije žalio.',   // Mladen (askOpt)
  'Dazu steht nichts in meinem Buch.': 'O tome u mojoj knjizi ne piše ništa.',   // Mladen (askOpt)
  'Danke. Laku noć.': 'Hvala. Laku noć.',   // Marko
  'Laku noć. Machen Sie die Tür zu, es zieht.': 'Laku noć. Zatvorite vrata, propuh je.',   // Mladen
  'Der Band ist nicht da. Ich habe es Ihnen gesagt.': 'Knjige nema. Rekao sam vam.',   // Mladen
  'Ich weiß den Tag nicht genau. Im Dezember.': 'Ne znam točno dan. U prosincu.',   // Marko
  'Im Dezember. Kommen Sie wieder, wenn Sie es wissen.': 'U prosincu. Dođite kad budete znali.',   // Mladen
  'Der zweiundzwanzigste Dezember. Das Boot um sieben aus Supetar.': 'Dvadeset drugi prosinca. Brod u sedam iz Supetra.',   // Marko
  'Der zweiundzwanzigste … Die Weihnachtsbura. Drei Tage kein Schiff. Die Fenster haben gesungen.': 'Dvadeset drugi … Božićna bura. Tri dana nijednog broda. Prozori su pjevali.',   // Mladen
  'Der Band 1984 ist nicht da. Irgendwer hat das Regal durcheinandergebracht. Ich suche doch nicht fünfzig Jahre durch.': 'Knjige za 1984. nema. Netko je ispremetao policu. Neću valjda pretraživati pedeset godina.',   // Mladen
  'Da drin ist es immer kalt. Ich gehe nicht gern hinein.': 'Unutra je uvijek hladno. Ne ulazim rado.',   // Mladen
  'Da drin ist es nicht kalt. Da drin ist es still.': 'Unutra nije hladno. Unutra je tiho.',   // Mala
  'Ich kann nachsehen.': 'Mogu ja pogledati.',   // Mala
  '(Leise:) „Wenn du da bist, dann sieh nach.“': '(Tiho:) „Ako si tu, onda pogledaj.“',   // Marko an Mala (Option)
  '(Leise:) „Hör auf.“': '(Tiho:) „Prestani.“',   // Marko an Mala (Option)
  '(Weiter so tun, als wäre nichts.)': '(I dalje se praviti da ništa nije.)',   // Option
  'Ich habe noch gar nicht angefangen.': 'Nisam još ni počela.',   // Mala
  'Das tut weh. Ich weiß.': 'Boli. Znam.',   // Mala
  'Der Kopfschmerz ist weg. Einfach weg. Zum ersten Mal seit drei Tagen.': 'Glavobolja je nestala. Jednostavno nestala. Prvi put u tri dana.',   // Marko
  'Du.': 'Ti.',   // Marko an Mala (auch Dinko)
  'Ich.': 'Ja.',   // Mala (auch Frane)
  'Die Kirchentreppe in Varoš. Das Fenster. Die Straßenbahn auf der Scheibe.': 'Stepenice kod crkve u Varošu. Prozor. Tramvaj na staklu.',   // Marko an Mala (bs)
  'Die Kirchentreppe in Varoš. Das Fenster letzte Nacht.': 'Stepenice kod crkve u Varošu. Prozor sinoć.',   // Marko an Mala (bs)
  'Ja.': 'Da.',   // Mala (Standard für alle)
  'Wer bist du?': 'Ko si ti?',   // Marko an Mala (bs)
  'Mala.': 'Mala.',   // Mala
  'Das ist kein Name. So sagt man zu kleinen Mädchen.': 'To nije ime. Tako se govori malim curicama.',   // Marko an Mala (bs)
  'Es reicht.': 'Dovoljno je.',   // Mala
  'Damit das klar ist: Ich glaube nicht an dich.': 'Da se razumijemo: ne vjerujem u tebe.',   // Marko an Mala
  'Musst du nicht. Lass mich nur nachsehen.': 'Ne moraš. Samo me pusti da pogledam.',   // Mala
  'Bei vierundachtzig. Und wenn da nichts ist, bist du der Jugo, und ich gehe morgen zum Arzt.': 'Kod osamdeset četvrte. A ako tamo nema ničega, ti si jugo, a ja sutra idem kod doktora.',   // Marko an Mala (bs)
  'Abgemacht.': 'Važi.',   // Mala
  'Unten links kannst du jetzt zu Mala wechseln.': 'Dolje lijevo sad se možeš prebaciti na Malu.',   // Hinweis (UI)
  'Schauen Sie mal bei achtundvierzig.': 'Pogledajte kod četrdeset osme.',   // Marko
  'Bei achtundvierzig? Warum sollte …': 'Kod četrdeset osme? Zašto bi …',   // Mladen
  'Na gut. Weil Sie es sind.': 'Dobro. Samo zbog vas.',   // Mladen
  'Tatsächlich. Irgendein Praktikant mit einem Zahlendreher. Neunzehnvierundachtzig bei achtundvierzig.': 'Doista. Neki pripravnik zamijenio je znamenke. Osamdeset četvrta stajala je kod četrdeset osme.',   // Mladen
  'Hier. Zweiundzwanzigster Dezember.': 'Evo. Dvadeset drugi prosinca.',   // Mladen
  'Matić … Dinko Matić. Der flickt heute noch seine Netze an der Matejuška. Fragen Sie ihn, wenn Sie den Mut haben.': 'Matić … Dinko Matić. On i danas krpa mreže na Matejuški. Pitajte njega, ako imate hrabrosti.',   // Mladen
  'Danke, Gospodine Šimić.': 'Hvala, gospodine Šimiću.',   // Marko
  'Bedanken Sie sich nicht. Das ist kein schöner Eintrag.': 'Nemojte zahvaljivati. To nije lijep zapis.',   // Mladen
  'Bei achtundvierzig.': 'Kod četrdeset osme.',   // Mala
  'Zufall.': 'Slučajnost.',   // Marko an Mala
  'Lučka kapetanija Split · Brodski dnevnik 1984': 'Lučka kapetanija Split · Brodski dnevnik 1984',   // Dokument (schon kroatisch)
  'Bura, 9–10 Bf. Linija Supetar–Split:': 'Bura, 9–10 Bf. Linija Supetar–Split:',   // Dokument (schon kroatisch)
  'polazak 17:00 otkazan.  Sljedeći: 23.12., 06:00.': 'polazak 17:00 otkazan.  Sljedeći: 23.12., 06:00.',   // Dokument (schon kroatisch)
  '21:40  Ribarska brodica ANKICA (vl. M. Matić)': '21:40  Ribarska brodica ANKICA (vl. M. Matić)',   // Dokument (schon kroatisch)
  'prevrnuta pred Sustipanom.': 'prevrnuta pred Sustipanom.',   // Dokument (schon kroatisch)
  'Spašen: Dinko Matić (19).  Nestao: Antonio Perić (22).': 'Spašen: Dinko Matić (19).  Nestao: Antonio Perić (22).',   // Dokument (schon kroatisch)
  'Potraga obustavljena 27.12.': 'Potraga obustavljena 27.12.',   // Dokument (schon kroatisch)
  'Am zweiundzwanzigsten Dezember: Bura, Stärke neun bis zehn. Die Fähre aus Supetar um fünf fiel aus.': 'Dvadeset drugoga prosinca: bura, jačine devet do deset. Trajekt iz Supetra u pet nije isplovio.',   // Marko
  'Um 21:40 kenterte das Fischerboot ANKICA vor Sustipan. Gerettet: Dinko Matić, neunzehn. Vermisst: Antonio Perić, zweiundzwanzig.': 'U 21:40 pred Sustipanom se prevrnula ribarska brodica ANKICA. Spašen: Dinko Matić, devetnaest. Nestao: Antonio Perić, dvadeset dvije.',   // Marko
  'Antonio. Tonći. Sie hat ihn nie anders genannt.': 'Antonio. Tonći. Nikad ga nije drugačije zvala.',   // Mala
  'Tür zur Riva': 'Vrata na Rivu',   // Name
  'Die Tür zur Riva.': 'Vrata prema Rivi.',   // Marko
  'Mladen Šimić': 'Mladen Šimić',   // Name
  'Ein Beamter mit Halbglatze, Schnurrbart und Brille auf der Stirn. Er löst ein Kreuzworträtsel, als hinge der Hafen davon ab.': 'Proćelav službenik s brkovima i naočalama na čelu. Rješava križaljku kao da o njoj ovisi cijela luka.',   // Marko
  'Er ist müde. Er ist seit sechsunddreißig Jahren müde.': 'Umoran je. Umoran je već trideset i šest godina.',   // Mala
  'Er murmelt Wörter mit sieben Buchstaben. „Leuchtturm“ hat zehn.': 'Mrmlja riječi od sedam slova. „Svjetionik“ ima deset.',   // Mala (Wortspiel: Svjetionik = 10 Buchstaben)
  'Er murmelt: „Vierundachtzig … der kleine Matić … mit einer Decke um die Schultern …“': 'Mrmlja: „Osamdeset četvrta … mali Matić … s dekom oko ramena …“',   // Mala (zitiert Mladen)
  'Supetar, achtzehnter Dezember vierundachtzig. Das Boot um sieben. Ich verstehe.': 'Supetar, osamnaesti prosinca osamdeset četvrte. Brod u sedam. Razumijem.',   // Mladen
  '„Die ANKICA. Das Boot vom alten Matić.“': '„ANKICA. Brodica staroga Matića.“',   // Mladen (give-Text, Engine zeigt ihn als Marko)
  'Tresen': 'Pult',   // Name (auch bar.js)
  'Ein Holztresen mit Glasaufsatz und einer Durchreiche, durch die seit Jahrzehnten Fahrkarten und Beschwerden wandern.': 'Drveni pult sa staklenom pregradom i okancem kroz koje desetljećima putuju karte i pritužbe.',   // Marko
  'Holz, das Tausende Hände gehalten hat. Alle hatten es eilig.': 'Drvo koje su držale hiljade ruku. Svima se žurilo.',   // Mala
  'Fahrpläne': 'Red plovidbe',   // Name
  'Fahrpläne. Supetar, Stari Grad, Rogač, Ancona. Die Winterzeiten, mit Kugelschreiber korrigiert.': 'Red plovidbe. Supetar, Stari Grad, Rogač, Ancona. Zimski polasci, ispravljeni kemijskom olovkom.',   // Marko
  'Supetar: 6:00, 7:30, 9:30, … 19:00, 21:30. Das Boot um sieben gibt es immer noch.': 'Supetar: 6:00, 7:30, 9:30, … 19:00, 21:30. Brod u sedam još uvijek postoji.',   // Marko
  'Lauter Zeiten, zu denen jemand irgendwo ankommt.': 'Sve sama vremena u koja neko negdje stiže.',   // Mala
  'Schiffsfotos': 'Slike brodova',   // Name
  'Alte Fotos von Fähren, mit Datum: 1958, 1967, 1979. Auf einem winken Menschen von Deck. Niemand winkt mehr von Fähren.': 'Stare fotografije trajekata, s datumima: 1958., 1967., 1979. Na jednoj ljudi mašu s palube. S trajekata više nitko ne maše.',   // Marko
  'Auf einem steht ein Mädchen an der Reling. Es ist nicht wichtig. Ich sehe es trotzdem an.': 'Na jednoj neka cura stoji uz ogradu. Nije važno. Ipak je gledam.',   // Mala
  'Funkgerät': 'Radiostanica',   // Name
  'Ein Seefunkgerät. Es knistert und sagt dann wieder nichts.': 'Pomorska radiostanica. Zakrči, pa opet ništa ne kaže.',   // Marko
  'Ich funke nicht im Hafenamt herum.': 'Neću se igrati radiostanicom u lučkoj kapetaniji.',   // Marko
  'Kanal 16. Ein Fischer fragt nach dem Wetter. Niemand antwortet.': 'Kanal 16. Neki ribar pita za vrijeme. Niko ne odgovara.',   // Mala
  'Es rauscht wie das Radio in Ivkas Wohnung.': 'Krči kao radio u Ivkinom stanu.',   // Mala
  'Wanduhr': 'Zidni sat',   // Name
  'Die Amtsuhr: zehn nach sieben. Meine Uhr: sieben. Sie steht. Genau auf sieben.': 'Službeni sat: sedam i deset. Moj sat: sedam. Stao je. Točno na sedam.',   // Marko
  'Eine Amtsuhr. Sie geht drei Minuten vor. Wahrscheinlich absichtlich.': 'Službeni sat. Žuri tri minute. Vjerojatno namjerno.',   // Marko
  'Wartebank': 'Klupa',   // Name
  'Eine Wartebank aus Kunststoff, orange. Wer hier sitzt, hat eine Fähre verpasst.': 'Narančasta plastična klupa za čekanje. Tko ovdje sjedi, propustio je trajekt.',   // Marko
  'Ich warte lieber im Stehen.': 'Radije čekam stojeći.',   // Marko
  'Hier sitzt nachts manchmal jemand, der nirgends hin kann.': 'Ovdje noću nekad sjedi neko ko nema kud.',   // Mala
  'Gummibaum': 'Fikus',   // Name
  'Ein Gummibaum, der seit Jahrzehnten so tut, als wäre er glücklich.': 'Fikus koji se desetljećima pravi da je sretan.',   // Marko
  'Er lebt. Das ist hier drin schon viel.': 'Živ je. I to je ovdje mnogo.',   // Mala
  'Tür „Arhiva“': 'Vrata „Arhiva“',   // Name
  '„ARHIVA – SAMO OSOBLJE.“ Archiv, nur Personal. Abgeschlossen. Natürlich.': '„ARHIVA – SAMO OSOBLJE.“ Zaključano. Naravno.',   // Marko
  'Abgeschlossen. Und Mladen sieht mich an.': 'Zaključano. A i Mladen me gleda.',   // Marko
  'Dahinter ist es kalt. Mich stört das nicht.': 'Iza je hladno. Mene to ne smeta.',   // Mala
  'Hafenbüro': 'Lučka kapetanija',   // Name
  'Mladen': 'Mladen',   // Name
  'Lass mich nachsehen.': 'Pusti me da pogledam.',   // Mala (Wechselsatz)
  'Ich kann durch Türen gehen. Du nicht.': 'Ja mogu kroz vrata. Ti ne možeš.',   // Mala (Wechselsatz)
  'Du musst nichts sagen. Nur nicken.': 'Ne moraš ništa reći. Samo klimni.',   // Mala (Wechselsatz)
  'Je länger du so tust, desto lauter werde ich.': 'Što se duže praviš, to sam glasnija.',   // Mala (Wechselsatz)
  'Neonlicht und Kaffeegeruch. Ein Amt, das nie ganz schließt, weil das Meer nie ganz schließt.': 'Neonsko svjetlo i miris kave. Ured koji se nikad sasvim ne zatvara, jer se ni more nikad sasvim ne zatvara.',   // Marko
  'Ich habe ihn gefunden. Ich kann ihn nur nicht herausholen.': 'Našla sam ga. Samo ga ne mogu izvaditi.',   // Mala
  'Tür': 'Vrata',   // Name
  'Die Tür.': 'Vrata.',   // Marko
  'Zurück zu ihm.': 'Nazad k njemu.',   // Mala
  'Regal: 1946–1959': 'Polica: 1946.–1959.',   // Name
  'Neunzehnhundertsechsundvierzig, siebenundvierzig, achtundvierzig … Die Jahre nach dem Krieg sind dünn. Es fuhr nicht viel.': 'Hiljadu devetsto četrdeset šesta, sedma, osma … Godine poslije rata su tanke. Malo se plovilo.',   // Mala
  'Hier sind die Ordner kalt wie Stein. Niemand hat sie je wieder angefasst.': 'Ovdje su registratori hladni kao kamen. Niko ih više nikad nije dirnuo.',   // Mala
  'Ordner bei „1948“': 'Registrator kod „1948“',   // Name
  'Ein Ordner im Fach „1948“. Auf dem Rücken steht 1984. Jemand hat die Ziffern vertauscht.': 'Registrator u pregratku „1948“. Na hrptu piše 1984. Neko je zamijenio cifre.',   // Mala
  'Ich kann ihn nicht herausziehen.': 'Ne mogu ga izvući.',   // Mala
  'Darin ist eine Seite, die jemand mit zitternder Hand geschrieben hat. Nachts. Mit einer Decke um jemanden, der nicht redet.': 'Unutra je stranica koju je neko pisao drhtavom rukom. Noću. S dekom oko nekoga ko ne priča.',   // Mala
  'Regal: 1980–1989': 'Polica: 1980.–1989.',   // Name
  'Die Achtziger. Dicke Ordner. Damals fuhren viele.': 'Osamdesete. Debeli registratori. Tad se puno putovalo.',   // Mala
  'Lücke': 'Praznina',   // Name
  'Zwischen 1983 und 1985 ist eine Lücke. So breit wie ein Jahr.': 'Između 1983. i 1985. je praznina. Široka kao jedna godina.',   // Mala
  'Schreibtisch': 'Pisaći stol',   // Name
  'Eine Schreibmaschine unter einer Haube aus Staub.': 'Pisaća mašina pod kapom od prašine.',   // Mala
  'Hier hat jemand jahrelang Tee getrunken und Abfahrtszeiten abgeschrieben. Mladen. Er war einmal jung.': 'Ovdje je neko godinama pio čaj i prepisivao vremena polazaka. Mladen. I on je nekad bio mlad.',   // Mala
  'Fensterchen': 'Prozorčić',   // Name
  'Ein kleines Fenster hoch oben. Draußen geht der Mond über die Mole.': 'Mali prozor visoko gore. Napolju mjesec prelazi preko mola.',   // Mala
  'Kartons': 'Kutije',   // Name
  'Kartons mit Fundsachen: Schirme, ein Kinderschuh, eine Brille. Alles, was die Fähren nicht wieder mitgenommen haben.': 'Kutije s izgubljenim stvarima: kišobrani, dječija cipela, naočale. Sve što trajekti nisu odvezli nazad.',   // Mala
  'Der Kinderschuh. Jemand hat sehr lange nach ihm gesucht.': 'Ta dječija cipela. Neko ju je jako dugo tražio.',   // Mala
  'Archiv': 'Arhiva',   // Name
  'Hier drin ist es kalt. Mladen hat recht. Für Lebende.': 'Ovdje unutra je hladno. Mladen je u pravu. Za žive.'   // Mala
});
M.trIgnore && M.trIgnore(['c2zdHint', '!logReadMala', '!backFromArchive']);   // interne Schlüssel (A.first), nie angezeigt
})(M);
