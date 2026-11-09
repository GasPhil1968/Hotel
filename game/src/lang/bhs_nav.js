/* Bosnisch/Kroatisch – Navigation und Hilfe: Stadtplan (17_map.js, noMap in rooms/limbo.js), Knopf „Karte“, Spielanleitung und
   einmalige Erklärung (06_ui.js), Hinweissystem (15_hints.js) und die Hinweise für Kapitel 1 (15_hints_k1.js).
   Kapitel 2 (15_hints_k2.js, Gründe für Sarajevo in M.MAP_KNOW, rooms/tramvaj.js) bleibt bewusst deutsch.
   Sprachformen (STYLE_BHS.md): Oberfläche, Titel und Marko = Standardkroatisch; Mala = Sarajevo-Bosnisch.
   Hinweistexte: Ein einfacher Stufentext spricht Mala (A.g) oder Marko allein (A.m). Deshalb steht unter dem normalen Schlüssel
   die kroatische Fassung (Marko) und, wo Mala anders spricht, ein Sondereintrag '@mala:…'. Bei {m,g} spricht m nur Marko
   (kroatisch, zu sich selbst), g nur Mala (bosnisch, zu Marko). Zitate aus dem Spiel (Antwortsätze, Notiztitel, Verben)
   sind wörtlich aus den vorhandenen Tabellen übernommen. */
(function(M){ 'use strict'; if (!M.trAdd) return;
M.trAdd('bhs', {
  // ---------------------------------------------------------------- 06_ui.js: Knopf, Menüüberschrift, Spielanleitung, Doppelklick
  'Karte': 'Karta',   // Knopf
  'Die Stillen – Kapitel 2: Sarajevo': 'Tihi – Poglavlje 2: Sarajevo',   // Menüüberschrift
  '„Zeigen“ markiert kurz alles, was man hier anfassen kann.': '„Pokaži“ nakratko označi sve što se ovdje može dirati.',   // Marko (Anleitung)
  'Ein Tipp auf einen Ausgang, und ich gehe hin. Ein zweiter schneller Tipp, ein Doppelklick mit der Maus, und ich bin sofort draußen.': 'Jedan dodir na izlaz i idem onamo. Još jedan brzi dodir, ili dvostruki klik mišem, i odmah sam vani.',   // Marko (Anleitung)
  '„Karte“ öffnet den Stadtplan, mit der Maus auch die Taste K. Ein Tipp auf einen Ort, und ich gehe hin. „Schließen“ oder Esc, und ich bleibe.': '„Karta“ otvara plan grada, a uz miš i tipka K. Jedan dodir na mjesto i idem onamo. „Zatvori“ ili Esc i ostajem.',   // Marko (Anleitung)
  'Komme ich nicht weiter, frage ich Mala: „Ich komme gerade nicht weiter.“ Oder im Menü: „Hinweis …“. Sie verrät erst den Weg, dann den Schritt, und nur, wenn ich will.': 'Kad zapnem, pitam Malu: „Zapeo sam.“ Ili u izborniku: „Savjet …“. Ona mi prvo oda smjer, onda korak, i samo ako to želim.',   // Marko (Anleitung)
  'Komme ich nicht weiter, ordne ich meine Gedanken: im Menü unter „Hinweis …“. Erst der Weg, dann der Schritt, und nur, wenn ich will.': 'Kad zapnem, posložim misli: u izborniku pod „Savjet …“. Prvo smjer, onda korak, i samo ako to želim.',   // Marko (Anleitung)
  'Zweimal schnell auf einen Ausgang tippen: Ich gehe sofort hinaus.': 'Dvaput brzo dodirni izlaz: odmah izlazim.',   // einmalige Erklärung (Touch)
  'Doppelklick auf einen Ausgang: Ich gehe sofort hinaus.': 'Dvostruki klik na izlaz: odmah izlazim.',   // einmalige Erklärung (Maus)

  // ---------------------------------------------------------------- 17_map.js: Stadtplan
  'Schließen': 'Zatvori',   // Knopf
  'Wohin? Ein Ort genügt.': 'Kamo? Dovoljan je jedan dodir.',   // Leiste ('Wohin?' steht schon in bhs_k1_z.js)
  'hier': 'ovdje', 'erreichbar': 'dostupno', 'gerade nicht': 'sad ne', 'noch nicht': 'još ne',   // Zeichenerklärung
  'Der Kiosk am Fährterminal. Nach zwölf Jahren? Ich wüsste nicht, wen ich dort fragen soll.': 'Kiosk kod trajektnog terminala. Nakon dvanaest godina? Ne bih znao koga bih ondje pitao.',   // Marko (Grund, Kapitel 1)
  'Da kann ich noch nicht hin.': 'Onamo još ne mogu.',   // Marko (Grund, allgemein)
  'Ohne Marko gehe ich nirgends hin.': 'Bez Marka ne idem nikud.',   // Mala
  'Von hier drinnen nicht. Erst muss ich hinaus auf die Straße.': 'Ne odavde, iznutra. Prvo moram izaći na ulicu.',   // Marko
  'Gerade nicht.': 'Sad ne.',   // Meldung
  'Hier gibt es keinen Stadtplan.': 'Ovdje nema plana grada.',   // Meldung
  'Hier gibt es keinen Stadtplan. Hier gibt es keine Stadt.': 'Ovdje nema plana grada. Ovdje nema ni grada.',   // Meldung (rooms/limbo.js)

  // ---------------------------------------------------------------- 15_hints.js: Rahmen mit Mala (Mala bosnisch; Markos Antworten an sie bosnisch)
  'Ich komme gerade nicht weiter.': 'Zapeo sam.',   // Option: Marko an Mala
  'Womit?': 'S čim?',   // Mala
  'Woran hängst du?': 'Gdje si zapeo?',   // Titel (Malas Frage)
  'Ich sehe gerade nichts, woran du hängst.': 'Sad ne vidim ništa na čemu si zapeo.',   // Mala
  'Etwas anderes.': 'Nešto drugo.',   // Option (Marko an Mala und allein)
  'Schon gut. Danke.': 'Dobro je. Hvala ti.',   // Option: Marko an Mala
  'Sag das noch einmal.': 'Reci to još jednom.',   // Option: Marko an Mala
  'In welche Richtung soll ich denken?': 'U kom pravcu da razmišljam?',   // Option: Marko an Mala
  'Wie könnte ich das angehen?': 'Kako da tome priđem?',   // Option: Marko an Mala
  'Was ist der nächste Schritt?': 'Šta je sljedeći korak?',   // Option: Marko an Mala
  'Soll ich dir den konkreten nächsten Schritt verraten?': 'Hoćeš da ti kažem tačno šta je sljedeći korak?',   // Mala
  'Ja. Sag es mir.': 'Da. Reci mi.',   // Option: Marko an Mala
  'Nein, noch nicht.': 'Ne, još ne.',   // Option: Marko an Mala
  'Gut. Dann denk noch ein bisschen.': 'Dobro. Onda još malo razmisli.',   // Mala
  'Das hat sich erledigt. Das hast du schon.': 'To je riješeno. To već imaš.',   // Mala
  'Mehr weiß ich dazu auch nicht.': 'Više o tome ni ja ne znam.',   // Mala
  // ---------------------------------------------------------------- 15_hints.js: Marko allein (Gedanken, kroatisch)
  'Gedanken ordnen: Woran hänge ich?': 'Slažem misli: gdje sam zapeo?',   // Titel
  'Gerade fällt mir nichts ein, woran ich hänge.': 'Trenutno se ne mogu sjetiti ničega na čemu sam zapeo.',   // Marko
  '(Genug nachgedacht.)': '(Dosta razmišljanja.)',   // Option
  '(Noch einmal von vorn.)': '(Još jednom ispočetka.)',   // Option
  '(In welche Richtung muss ich denken?)': '(U kojem smjeru moram razmišljati?)',   // Option
  '(Wie könnte ich das angehen?)': '(Kako bih tome mogao pristupiti?)',   // Option
  '(Und der nächste Schritt?)': '(A sljedeći korak?)',   // Option
  'Will ich den nächsten Schritt wirklich schon wissen?': 'Želim li doista već znati sljedeći korak?',   // Titel
  '(Ja.)': '(Da.)', '(Nein, noch nicht.)': '(Ne, još ne.)',   // Optionen
  'Noch nicht. Ich denke selbst weiter.': 'Još ne. Razmislit ću sam.',   // Marko
  'Das hat sich erledigt.': 'To je riješeno.',   // Marko
  'Weiter komme ich so nicht.': 'Ovako dalje ne mogu.',   // Marko

  // ================================================================ 15_hints_k1.js: Titel (Oberfläche, kroatisch) und Stufentexte
  // ---------------------------------------------------------------- Prolog · Dienstag
  'Was liegt heute an?': 'Što je danas na redu?',
  'Ein verregneter Dienstag, und noch ist nichts angefangen.': 'Kišni utorak, a još ništa nije započeto.',
  'In der Wohnung wartet etwas darauf, gehört zu werden.': 'U stanu nešto čeka da bude saslušano.',
  'Auf dem Schreibtisch blinkt etwas rot.': 'Na radnom stolu nešto treperi crveno.',
  'Den Anrufbeantworter benutzen und die Nachrichten abhören.': 'Upotrijebiti sekretaricu i preslušati poruke.',
  'Seite einunddreißig': 'Trideset i prva stranica',
  'Die Übersetzung für Graz muss heute raus. Auf Seite 31 hängt noch ein Satz.': 'Prijevod za Graz danas mora otići. Na stranici 31 zapela je još jedna rečenica.',
  'Erst genau lesen, was dasteht, und was fehlt.': 'Najprije točno pročitati što piše i što nedostaje.',
  '@mala:Erst genau lesen, was dasteht, und was fehlt.': 'Prvo tačno pročitati šta piše i šta fali.',
  'Der Laptop auf dem Schreibtisch, der letzte Satz der Seite.': 'Laptop na radnom stolu, zadnja rečenica na stranici.',
  'Den Laptop benutzen und „Der letzte Satz auf Seite 31“ wählen.': 'Upotrijebiti laptop i odabrati „Zadnja rečenica na stranici 31“.',
  'Welche Leuchte?': 'Koja lampica?',
  '„Warten, bis die Leuchte erlischt.“ Die Maschine hat aber zwei.': '„Pričekajte da se lampica ugasi.“ Ali aparat ih ima dvije.',
  'Die Zeichnung fehlt. Eine Anleitung erklärt dasselbe oft an mehreren Stellen.': 'Crtež nedostaje. Upute često isto objašnjavaju na više mjesta.',
  'Eine Seite weiter vorn beschreibt die Leuchten.': 'Stranica prije opisuje lampice.',
  'Am Laptop „Weiter vorn nachlesen: Seite 30“ wählen.': 'Na laptopu odabrati „Listati unatrag: stranica 30“.',
  'Den Satz fertig übersetzen': 'Prevesti rečenicu do kraja',
  'Jetzt ist klar, welche Leuchte gemeint ist. Der Satz kann fertig werden.': 'Sad je jasno na koju se lampicu misli. Rečenica se može dovršiti.',
  'Seite 30: die rote Leuchte zeigt den Druck im Kessel.': 'Stranica 30: crvena lampica pokazuje tlak u kotlu.',
  '@mala:Seite 30: die rote Leuchte zeigt den Druck im Kessel.': 'Stranica 30: crvena lampica pokazuje pritisak u kotlu.',
  'Genau schreiben, welche Leuchte. Der Kunde merkt den Unterschied.': 'Napisati točno koja lampica. Klijent primijeti razliku.',
  '@mala:Genau schreiben, welche Leuchte. Der Kunde merkt den Unterschied.': 'Napisati tačno koja lampica. Klijent primijeti razliku.',
  'Am Laptop „Den Satz fertig übersetzen“ wählen, die Fassung mit der roten Druckleuchte.': 'Na laptopu odabrati „Prevesti rečenicu do kraja i poslati“, pa inačicu s crvenom lampicom tlaka.',
  '@mala:Am Laptop „Den Satz fertig übersetzen“ wählen, die Fassung mit der roten Druckleuchte.': 'Na laptopu odabrati „Prevesti rečenicu do kraja i poslati“, pa verziju s crvenom lampicom tlaka.',
  'Noch nicht wach': 'Još nisam budan',
  'Mit diesem Kopf geht es nicht aus dem Haus.': 'S ovakvom glavom ne ide se iz kuće.',
  'Ein Kaffee. In der Kochnische steht alles dafür.': 'Kava. U kuhinjskom kutku ima sve što treba.',
  '@mala:Ein Kaffee. In der Kochnische steht alles dafür.': 'Kahva. U kuhinjskom kutku ima sve što treba.',
  'Die Džezva braucht Wasser und Hitze, in dieser Reihenfolge.': 'Džezvi treba voda pa vatra, tim redom.',
  'Die volle Džezva auf den Herd stellen.': 'Staviti punu džezvu na štednjak.',
  'Die Džezva an der Spüle füllen, dann auf den Herd.': 'Napuniti džezvu na sudoperu, pa na štednjak.',
  'Die Džezva nehmen, an der Spüle füllen, dann auf den Herd stellen.': 'Uzeti džezvu, napuniti je na sudoperu, pa je staviti na štednjak.',
  'Sanjas Brief nach Triest': 'Sanjino pismo za Trst',
  'Sanja wartet auf die Antwort nach Triest. Um vier ruft der Lieferant an.': 'Sanja čeka odgovor za Trst. U četiri zove dobavljač.',
  'In der Bar hat Sanja keine Hand frei. Wer sich an seinen Platz setzt, wird bedient.': 'U baru Sanja nema slobodne ruke. Tko sjedne na svoje mjesto, bude poslužen.',
  '@mala:In der Bar hat Sanja keine Hand frei. Wer sich an seinen Platz setzt, wird bedient.': 'U baru Sanja nema slobodne ruke. Ko sjedne na svoje mjesto, bude poslužen.',
  'Markos Tisch in der Bar „Bura“. Beim Brief gilt: Sanja will den Lieferanten nicht verlieren, aber auch nicht einfach nachgeben.': 'Markov stol u baru „Bura“. Za pismo vrijedi: Sanja ne želi izgubiti dobavljača, ali ni tek tako popustiti.',
  '@mala:Markos Tisch in der Bar „Bura“. Beim Brief gilt: Sanja will den Lieferanten nicht verlieren, aber auch nicht einfach nachgeben.': 'Markov stol u baru „Bura“. Za pismo važi: Sanja neće da izgubi dobavljača, ali ni da tek tako popusti.',
  'In der Bar Markos Tisch benutzen und für den Brief die feste Fassung wählen.': 'U baru upotrijebiti Markov stol i za pismo odabrati „Odlučno“.',
  'Ivkas Wohnung in Veli Varoš ist zu. Den Schlüssel hat die Nachbarin.': 'Ivkin stan u Velom Varošu je zaključan. Ključ ima susjeda.',
  '@mala:Ivkas Wohnung in Veli Varoš ist zu. Den Schlüssel hat die Nachbarin.': 'Ivkin stan u Velom Varošu je zaključan. Ključ ima komšinica.',
  'Gospođa Zdenka gibt ihn nicht jedem. Es kommt darauf an, wozu.': 'Gospođa Zdenka ga ne daje svakome. Ovisi za što.',
  '@mala:Gospođa Zdenka gibt ihn nicht jedem. Es kommt darauf an, wozu.': 'Gospođa Zdenka ga ne daje svakom. Zavisi za šta.',
  'Wer nur Zeichen zählen will, bekommt keinen Schlüssel. Wer über Ivka schreiben will, schon.': 'Tko samo želi brojati znakove, ne dobije ključ. Tko želi pisati o Ivki, dobije.',
  '@mala:Wer nur Zeichen zählen will, bekommt keinen Schlüssel. Wer über Ivka schreiben will, schon.': 'Ko samo hoće brojati znakove, ne dobije ključ. Ko hoće pisati o Ivki, dobije.',
  'Zdenka nach der Wohnung fragen und als Grund nennen: ein paar Zeilen, damit jemand weiß, dass sie gelebt hat.': 'Pitati Zdenku za stan i kao razlog reći: „Nekoliko redaka, da netko zna da je živjela.“',
  'Der Schlüssel ist da. Die Wohnung wartet.': 'Ključ je tu. Stan čeka.',
  'Ivka wohnte gleich hier in der Gasse.': 'Ivka je živjela tu, u ovoj ulici.',
  'Ihre Tür in Veli Varoš, mit der Todesanzeige daran.': 'Njezina vrata u Velom Varošu, s osmrtnicom na njima.',
  '@mala:Ihre Tür in Veli Varoš, mit der Todesanzeige daran.': 'Njena vrata u Velom Varošu, s osmrtnicom na njima.',
  'Ivkas Tür öffnen.': 'Otvoriti Ivkina vrata.',
  'Der verschnürte Schuhkarton': 'Svezana kutija za cipele',
  'Ein Schuhkarton, mit einem festen Knoten verschnürt. Schneiden würde zerstören, was Ivka so sorgfältig verschnürt hat.': 'Kutija za cipele, svezana čvrstim čvorom. Rezanje bi uništilo ono što je Ivka tako pažljivo svezala.',
  'Einen festen Knoten löst man mit etwas Dünnem, Spitzem, nicht mit Gewalt. In einer Wohnung, in der gestrickt wurde, liegt so etwas herum.': 'Čvrst čvor razvezuje se nečim tankim i šiljatim, ne silom. U stanu u kojem se pletlo takvo što leži uokolo.',
  'Im Nähkorb liegen Stricknadeln.': 'U košarici su igle za pletenje.',
  'Den Schuhkarton mit der Stricknadel benutzen, dann öffnen.': 'Upotrijebiti pletaću iglu na kutiji za cipele, pa je otvoriti.',
  'Eine Stricknadel aus dem Nähkorb nehmen und den Schuhkarton damit benutzen.': 'Uzeti pletaću iglu iz košarice i upotrijebiti je na kutiji za cipele.',
  'Das Foto im Regal': 'Fotografija na polici',
  'Die Postkarte nennt ein Boot und einen Freund. Ein Bild fehlt noch dazu.': 'Razglednica spominje brod i prijatelja. Uz to još nedostaje slika.',
  'Ivka hat aufgehoben, was ihr wichtig war. Nicht nur im Karton.': 'Ivka je čuvala ono što joj je bilo važno. Ne samo u kutiji.',
  'Ein Foto: zwei Männer im Boot.': 'Fotografija: dvojica na brodici.',
  'Das Foto mit den zwei Männern im Boot nehmen.': 'Uzeti fotografiju s dvojicom na brodici.',
  'Wofür hat Ivka gelebt?': 'Za što je Ivka živjela?',
  'Bis jetzt erzählt in der Wohnung alles vom Warten. Für einen Nachruf ist das zu wenig.': 'Zasad sve u stanu govori o čekanju. Za nekrolog je to premalo.',
  'Was hat Ivka den ganzen Tag getan, und für wen?': 'Što je Ivka radila cijeli dan, i za koga?',
  '@mala:Was hat Ivka den ganzen Tag getan, und für wen?': 'Šta je Ivka radila cijeli dan, i za koga?',
  'Zdenka sagt: Sie strickte für die halbe Gasse. Im Nähkorb liegt mehr als Nadeln.': 'Zdenka kaže: plela je za pola ulice. U košarici ima više od igala.',
  'Den Nähkorb lesen: Ivkas Strickheft.': 'Pročitati što je u košarici: Ivkinu bilježnicu za pletenje.',
  'Keine Kontakte?': 'Bez kontakata?',
  'Die Stadt schreibt: alleinstehend, keine Kontakte. Das Strickheft erzählt etwas anderes.': 'Grad piše: živjela sama, bez kontakata. Bilježnica za pletenje govori nešto drugo.',
  'Zwei Aussagen über Ivka, die nicht zusammenpassen. Das Notizbuch kann sie gegeneinander halten.': 'Dvije tvrdnje o Ivki koje se ne slažu. U bilježnici ih se može suprotstaviti.',
  'Die Notiz der Stadt und Ivkas Strickheft gehören zusammen.': 'Bilješka Grada i Ivkina bilježnica za pletenje idu zajedno.',
  'Im Notizbuch „Laut Stadt: keine Kontakte“ mit „Ivkas Strickheft“ verbinden.': 'U bilježnici povezati „Prema Gradu: bez kontakata“ s „Ivkina bilježnica“.',
  'Die Namen im Heft': 'Imena u bilježnici',
  'Im Heft stehen Namen aus der Gasse. Wer sind diese Leute?': 'U bilježnici su imena iz ulice. Tko su ti ljudi?',
  '@mala:Im Heft stehen Namen aus der Gasse. Wer sind diese Leute?': 'U bilježnici su imena iz ulice. Ko su ti ljudi?',
  'Wer kennt die Gasse besser als jede Behörde?': 'Tko poznaje ulicu bolje od ijednog ureda?',
  '@mala:Wer kennt die Gasse besser als jede Behörde?': 'Ko poznaje ulicu bolje od ijedne službe?',
  'Zdenka wohnt hier seit Jahrzehnten.': 'Zdenka ovdje živi desetljećima.',
  '@mala:Zdenka wohnt hier seit Jahrzehnten.': 'Zdenka tu živi decenijama.',
  'Zdenka fragen: „In ihrem Heft stehen Namen aus der Gasse. Kennen Sie die Leute?“': 'Pitati Zdenku: „U njezinoj bilježnici su imena iz ove ulice. Poznajete li te ljude?“',
  'Genug gesehen. Der Schlüssel gehört nicht Marko.': 'Dosta je viđeno. Ključ nije Markov.',
  'Zdenka wartet darauf, dass er zurückkommt.': 'Zdenka čeka da joj se ključ vrati.',
  'Zurück zu Zdenka in der Gasse.': 'Natrag do Zdenke u ulici.',
  '@mala:Zurück zu Zdenka in der Gasse.': 'Nazad do Zdenke u ulici.',
  'Zdenka sagen: „Hier ist Ihr Schlüssel.“ Oder den Schlüssel auf sie ziehen.': 'Reći Zdenki: „Evo vam ključ.“ Ili povući ključ na nju.',
  'Die Stelle an der Riva': 'Mjesto na Rivi',
  'Bevor der Text entsteht: die Stelle, an der Ivka jeden Abend stand.': 'Prije nego što tekst nastane: mjesto na kojem je Ivka stajala svake večeri.',
  'Zdenka hat gesagt, wohin Ivka um sieben ging.': 'Zdenka je rekla kamo je Ivka išla u sedam.',
  '@mala:Zdenka hat gesagt, wohin Ivka um sieben ging.': 'Zdenka je rekla gdje je Ivka išla u sedam.',
  'Die Riva, die Mole entlang, bis ganz ans Ende.': 'Riva, pa duž mola, sve do samog kraja.',
  'An der Riva bis zum letzten Poller am Ende der Mole gehen.': 'Na Rivi otići do zadnje bitve na kraju mola.',
  'Zweitausend Zeichen': 'Dvije tisuće znakova',
  'Der Nachruf muss bis morgen früh fertig sein.': 'Nekrolog mora biti gotov do sutra ujutro.',
  'Alles Nötige ist gesammelt. Jetzt fehlt nur noch das Schreiben.': 'Sve potrebno je skupljeno. Sad još samo treba pisati.',
  'Zu Hause, am Laptop.': 'Kod kuće, za laptopom.',
  'In der Wohnung den Laptop benutzen und den Nachruf schreiben.': 'U stanu upotrijebiti laptop i napisati nekrolog.',
  'Ein langer Tag': 'Dug dan',
  'Der Text ist geschrieben. Für heute ist es genug.': 'Tekst je napisan. Za danas je dosta.',
  'Was jetzt noch fehlt, ist Schlaf.': 'Sad još nedostaje samo san.',
  '@mala:Was jetzt noch fehlt, ist Schlaf.': 'Sad još fali samo san.',
  'Das Bett in der Wohnung.': 'Krevet u stanu.',
  'Das Bett benutzen.': 'Upotrijebiti krevet.',
  // ---------------------------------------------------------------- Erster Fall · Mittwoch
  'Jemand in der Wohnung': 'Netko u stanu',
  'Etwas stimmt nicht in der Wohnung. Jemand ist da, den es nicht geben kann.': 'Nešto nije u redu u stanu. Tu je netko tko ne može postojati.',
  '@mala:Etwas stimmt nicht in der Wohnung. Jemand ist da, den es nicht geben kann.': 'Nešto nije u redu u stanu. Tu je neko ko ne može postojati.',
  'Erst prüfen, was wirklich ist: die Tür, und die Gestalt selbst.': 'Najprije provjeriti što je stvarno: vrata i samu priliku.',
  '@mala:Erst prüfen, was wirklich ist: die Tür, und die Gestalt selbst.': 'Prvo provjeriti šta je stvarno: vrata i samu priliku.',
  'Beim Gehen zieht es. Von hinten.': 'U hodu nešto puše. Odostraga.',
  'Die Tür. Ist sie wirklich abgeschlossen?': 'Vrata. Jesu li stvarno zaključana?',
  '@mala:Die Tür. Ist sie wirklich abgeschlossen?': 'Vrata. Da li su stvarno zaključana?',
  'Von nahem sieht man mehr. Gegen die Lampe zum Beispiel.': 'Izbliza se vidi više. U protusvjetlu lampe, recimo.',
  'Besuch bietet man etwas an. Aus Gewohnheit: ein Glas Wasser.': 'Gostu se nešto ponudi. Iz navike: čaša vode.',
  'Zur Wohnungstür gehen.': 'Otići do ulaznih vrata.',
  'Noch einmal zur Wohnungstür gehen.': 'Još jednom otići do ulaznih vrata.',
  'Die Gestalt ansehen.': 'Pogledati priliku.',
  'Ihr das Glas Wasser geben, dann fragen: Wer bist du?': 'Dati joj čašu vode, pa pitati: „Ko si ti?“',
  'Das Glas an der Spüle füllen.': 'Napuniti čašu na sudoperu.',
  'Ein Glas aus dem Regal über der Kochnische nehmen, an der Spüle füllen und ihr geben.': 'Uzeti čašu s police iznad kuhinjskog kutka, napuniti je na sudoperu i dati joj.',
  'Vor Marko war auch jemand': 'I ispred Marka je bilo nekoga',
  '„Und vor dir war auch jemand.“ Am Ort des ersten richtigen Schwindels.': '„I ispred tebe je bilo nekoga.“ Na mjestu prve prave vrtoglavice.',
  'Der Schwindel kam an der Riva.': 'Vrtoglavica je došla na Rivi.',
  'Am Ende der Mole, beim letzten Poller.': 'Na kraju mola, kod zadnje bitve.',
  'An der Riva bis ans Ende der Mole gehen.': 'Na Rivi otići do kraja mola.',
  'Worauf wartet Ivka?': 'Što Ivka čeka?',
  'Ivka wartet auf ein Boot.': 'Ivka čeka brod.',
  'Wer wartet, erzählt gern, worauf.': 'Tko čeka, rado priča što čeka.',
  '@mala:Wer wartet, erzählt gern, worauf.': 'Ko čeka, rado priča šta čeka.',
  'Welches Boot, welcher Tag, und warum es so spät ist.': 'Koji brod, koji dan i zašto toliko kasni.',
  'Mit Ivka reden: welches Boot, welcher Tag, und dass das Boot spät ist.': 'Razgovarati s Ivkom: „Koji brod?“, „Koji je danas dan?“ i „Brod kasni.“',
  'Warum ist das Boot so spät?': 'Zašto brod toliko kasni?',
  'Ivka will wissen, warum das Boot so spät ist.': 'Ivka želi znati zašto brod toliko kasni.',
  'Wer führt Buch über Boote und Fähren?': 'Tko vodi evidenciju o brodovima i trajektima?',
  '@mala:Wer führt Buch über Boote und Fähren?': 'Ko vodi evidenciju o brodovima i trajektima?',
  'Das Hafenbüro an der Riva. Mladen sucht erst, wenn er das genaue Datum hat.': 'Lučka kapetanija na Rivi. Mladen traži tek kad ima točan datum.',
  '@mala:Das Hafenbüro an der Riva. Mladen sucht erst, wenn er das genaue Datum hat.': 'Lučka kapetanija na Rivi. Mladen traži tek kad ima tačan datum.',
  'Im Hafenbüro mit Mladen reden: eine Frage zu einer Fähre, für einen Text, und das Datum von der Postkarte.': 'U lučkoj kapetaniji razgovarati s Mladenom: pitanje o trajektu, za tekst, i datum s razglednice.',
  'Der fehlende Band': 'Svezak koji nedostaje',
  'Der Band 1984 ist nicht im Regal. Mladen findet ihn nicht, und ins Archiv geht er nicht noch einmal.': 'Svezak iz 1984. nije na polici. Mladen ga ne može naći, a u arhivu više neće ići.',
  'Das Archiv ist abgeschlossen. Für Lebende.': 'Arhiva je zaključana. Za žive.',
  'Das Flimmern hat angeboten nachzusehen. Es wartet auf ein Ja.': 'Titranje se ponudilo da pogleda. Čeka samo jedno „da“.',
  'Mala hat angeboten nachzusehen. Sie braucht nur ein Ja.': 'Mala se ponudila da pogleda. Treba joj samo jedno „da“.',   // m
  'Ich kann nachsehen. Du musst es nur sagen.': 'Mogu ja pogledati. Samo reci.',   // g
  'Das Flimmern ansprechen und leise sagen: „Dann sieh nach.“': 'Obratiti se titranju i tiho reći: „Onda pogledaj.“',
  'Mala ansprechen und leise sagen: „Dann sieh nach.“': 'Obratiti se Mali i tiho reći: „Onda pogledaj.“',   // m
  'Mich ansprechen und leise sagen: „Dann sieh nach.“': 'Obratiti se meni i tiho reći: „Onda pogledaj.“',   // g
  'Wo steht der Band 1984?': 'Gdje je svezak iz 1984.?',
  'Irgendwo im Archiv steht der Band 1984. Nur nicht da, wo er hingehört.': 'Negdje u arhivi stoji svezak iz 1984. Samo ne ondje gdje mu je mjesto.',
  '@mala:Irgendwo im Archiv steht der Band 1984. Nur nicht da, wo er hingehört.': 'Negdje u arhivi stoji svezak iz 1984. Samo ne tamo gdje mu je mjesto.',
  'Ein ausgeblichenes Rückenschild verrät mit Augen nichts mehr. Es braucht ein anderes Gespür.': 'Izblijedjeli natpis na hrptu očima više ništa ne otkriva. Treba neko drugo osjetilo.',
  '@mala:Ein ausgeblichenes Rückenschild verrät mit Augen nichts mehr. Es braucht ein anderes Gespür.': 'Izblijedjeli natpis na hrptu očima više ništa ne otkriva. Treba neko drugo čulo.',
  'Mala geht durch die Tür „SAMO OSOBLJE“. Bei einem ausgeblichenen Ordner reicht Ansehen nicht.': 'Mala prolazi kroz vrata „SAMO OSOBLJE“. Kod izblijedjelog registratora nije dovoljno samo pogledati.',   // m
  'Ich gehe durch die Tür „SAMO OSOBLJE“. Bei einem ausgeblichenen Ordner reicht Ansehen nicht.': 'Ja prođem kroz vrata „SAMO OSOBLJE“. Kod izblijedjelog registratora nije dosta samo pogledati.',   // g
  'Zu Mala wechseln, ins Archiv gehen und den Ordner im Fach „1948“ spüren.': 'Prebaciti na Malu, ući u arhivu i osjetiti registrator u pregratku „1948“.',   // m
  'Zu mir wechseln, ins Archiv gehen und den Ordner im Fach „1948“ spüren.': 'Prebaciti na mene, ući u arhivu i osjetiti registrator u pregratku „1948“.',   // g
  'Mladen und das Regal': 'Mladen i polica',
  'Der Band ist gefunden. Herausziehen kann ihn nur einer, der lebt.': 'Svezak je pronađen. Izvući ga može samo netko živ.',
  '@mala:Der Band ist gefunden. Herausziehen kann ihn nur einer, der lebt.': 'Svezak je nađen. Izvući ga može samo neko živ.',
  'Mladen holt ihn, wenn er weiß, wo er suchen soll.': 'Mladen će ga donijeti kad zna gdje treba tražiti.',
  'Ein Zahlendreher: 1984 steht bei 1948.': 'Zamijenjene znamenke: 1984. stoji kod 1948.',
  '@mala:Ein Zahlendreher: 1984 steht bei 1948.': 'Zamijenjene cifre: 1984. stoji kod 1948.',
  'Als Marko Mladen sagen: „Schauen Sie mal im Regal bei 1948.“': 'Kao Marko reći Mladenu: „Pogledajte na polici kod ‚1948‘.“',
  'Die Fähre fuhr an dem Abend nicht. Und doch wollte Tonći um sieben kommen.': 'Te večeri trajekt nije plovio. A Tonći je ipak htio doći u sedam.',
  'Zwei Notizen, die zusammen etwas Neues ergeben.': 'Dvije bilješke koje zajedno daju nešto novo.',
  'Tonćis Versprechen auf der Postkarte und der Eintrag im Fahrtenbuch.': 'Tonćijevo obećanje na razglednici i upis u brodskom dnevniku.',
  'Im Notizbuch „Boot um sieben“ mit „Fähre fiel aus“ verbinden.': 'U bilježnici povezati „Brod u sedam“ s „Trajekt nije isplovio“.',
  'Dinko Matić war dabei. Er flickt seine Netze an der Matejuška und will nicht reden.': 'Dinko Matić je bio ondje. Krpa mreže na Matejuški i neće razgovarati.',
  '@mala:Dinko Matić war dabei. Er flickt seine Netze an der Matejuška und will nicht reden.': 'Dinko Matić je bio tamo. Krpi mreže na Matejuški i neće da priča.',
  'Fragen helfen bei ihm nicht. Etwas aus der Zeit von damals vielleicht.': 'Pitanja kod njega ne pomažu. Možda nešto iz onog vremena.',
  'Das Foto aus Ivkas Wohnung zeigt Tonći und Dinko auf der ANKICA.': 'Fotografija iz Ivkina stana pokazuje Tonćija i Dinka na ANKICI.',
  '@mala:Das Foto aus Ivkas Wohnung zeigt Tonći und Dinko auf der ANKICA.': 'Fotografija iz Ivkinog stana pokazuje Tonćija i Dinka na ANKICI.',
  'An der Matejuška Dinko das Foto mit den zwei Männern im Boot zeigen.': 'Na Matejuški pokazati Dinku fotografiju s dvojicom na brodici.',
  'Dinkos Schweigen': 'Dinkova šutnja',
  'Dinko wird weicher, aber über die Nacht schweigt er.': 'Dinko omekšava, ali o toj noći šuti.',
  'Was er nicht sagt, hat er vielleicht aufgehoben. Hinter einer Tür, die zu bleibt.': 'Ono što ne kaže, možda je sačuvao. Iza vrata koja ostaju zatvorena.',
  'Mala geht durch die verschlossene Tür seines Schuppens. Am Seesack hängt etwas.': 'Mala prolazi kroz zaključana vrata njegove šupe. Na mornarskoj vreći nešto je ostalo.',   // m
  'Ich gehe durch die verschlossene Tür seines Schuppens. Am Seesack hängt etwas.': 'Ja prođem kroz zaključana vrata njegove šupe. Na mornarskoj vreći nešto je ostalo.',   // g
  'Zu Mala wechseln, in den Schuppen gehen und den Seesack spüren.': 'Prebaciti na Malu, ući u šupu i osjetiti mornarsku vreću.',   // m
  'Zu mir wechseln, in den Schuppen gehen und den Seesack spüren.': 'Prebaciti na mene, ući u šupu i osjetiti mornarsku vreću.',   // g
  'Was Tonći im Wasser sagte': 'Što je Tonći rekao u moru',
  'Tonćis letzte Worte sind bekannt. Dinko hat sie nie jemandem erzählt.': 'Tonćijeve zadnje riječi su poznate. Dinko ih nikad nikome nije ispričao.',
  'Wer es weiß, kann Dinko sein Schweigen nehmen.': 'Tko to zna, može Dinku skinuti teret šutnje.',
  '@mala:Wer es weiß, kann Dinko sein Schweigen nehmen.': 'Ko to zna, može Dinku skinuti teret šutnje.',
  'Mit Dinko reden. Was im Wasser gesagt wurde, und dass Ivka noch wartet.': 'Razgovarati s Dinkom. O tome što je rečeno u moru i da Ivka još čeka.',
  '@mala:Mit Dinko reden. Was im Wasser gesagt wurde, und dass Ivka noch wartet.': 'Razgovarati s Dinkom. O tome šta je rečeno u moru i da Ivka još čeka.',
  'Mit Dinko reden: „Ich weiß, was Tonći im Wasser gesagt hat“, dann „Ivka wartet noch“.': 'Razgovarati s Dinkom: „Znam što je Tonći rekao u moru“, pa „Ivka ga još uvijek čeka“.',
  'Der verklebte Brief': 'Slijepljeno pismo',
  'Tonćis Brief ist zu. Das Salz hat die Seiten zusammengebacken.': 'Tonćijevo pismo je zatvoreno. Sol je slijepila stranice.',
  'Trocken reißt er. Papier, das klebt, löst sich mit Wärme und Feuchtigkeit.': 'Ovako suho se podere. Slijepljeni papir odvaja se toplinom i vlagom.',
  '@mala:Trocken reißt er. Papier, das klebt, löst sich mit Wärme und Feuchtigkeit.': 'Ovako suho se podere. Slijepljeni papir odvaja se toplotom i vlagom.',
  'Dampf. Zu Hause gibt es Džezva, Spüle und Herd. Eine offene Flamme verbrennt ihn nur.': 'Para. Kod kuće ima džezva, sudoper i štednjak. Otvoreni plamen bi ga samo spalio.',
  'In der Wohnung die volle Džezva auf den Herd stellen und dann den Brief am Herd benutzen.': 'U stanu staviti punu džezvu na štednjak, a onda upotrijebiti pismo na štednjaku.',
  'In der Wohnung die Džezva an der Spüle füllen, auf den Herd stellen und dann den Brief am Herd benutzen.': 'U stanu napuniti džezvu na sudoperu, staviti je na štednjak, a onda upotrijebiti pismo na štednjaku.',
  'Ausgewaschene Schrift': 'Isprani rukopis',
  'Der Brief ist offen, aber das Wasser hat die Schrift fast gelöscht.': 'Pismo je otvoreno, ali voda je gotovo izbrisala rukopis.',
  'Was nicht mehr auf dem Papier steht, hängt vielleicht noch an der Hand, die es schrieb.': 'Što više ne piše na papiru, možda se još drži ruke koja je to pisala.',
  '@mala:Was nicht mehr auf dem Papier steht, hängt vielleicht noch an der Hand, die es schrieb.': 'Šta više ne piše na papiru, možda se još drži ruke koja je to pisala.',
  'Mala liest, was das Wasser gelöscht hat, wie im Archiv.': 'Mala čita ono što je voda izbrisala, kao u arhivi.',   // m
  'Ich lese, was das Wasser gelöscht hat, wie im Archiv.': 'Ja pročitam ono što je voda izbrisala, ko u arhivi.',   // g
  'Den Brief auf Mala ziehen.': 'Povući pismo na Malu.',   // m
  'Den Brief auf mich ziehen.': 'Povući pismo na mene.',   // g
  'Ivka die Wahrheit sagen': 'Reći Ivki istinu',
  'Alles für Ivka ist beisammen: was mit der Fähre war, wie Tonći kam, sein Brief, die Handschuhe.': 'Sve za Ivku je na okupu: što je bilo s trajektom, kako je Tonći dolazio, njegovo pismo, rukavice.',
  '@mala:Alles für Ivka ist beisammen: was mit der Fähre war, wie Tonći kam, sein Brief, die Handschuhe.': 'Sve za Ivku je na okupu: šta je bilo s trajektom, kako je Tonći dolazio, njegovo pismo, rukavice.',
  'Ivka glaubt nur, was sie selbst nachprüfen kann. Schritt für Schritt, vom Boot bis zum Geschenk.': 'Ivka vjeruje samo onome što sama može provjeriti. Korak po korak, od broda do poklona.',
  'Erst die Fähre, dann die ANKICA, dann der Brief, zuletzt die Handschuhe.': 'Najprije trajekt, onda ANKICA, onda pismo, na kraju rukavice.',
  '@mala:Erst die Fähre, dann die ANKICA, dann der Brief, zuletzt die Handschuhe.': 'Prvo trajekt, pa ANKICA, pa pismo, na kraju rukavice.',
  'An der Mole Tonćis Brief auf Ivka ziehen, dann nacheinander: die ausgefallene Fähre, die ANKICA, den Brief vorlesen, die Handschuhe.': 'Na molu povući Tonćijevo pismo na Ivku, pa redom: trajekt koji nije isplovio, ANKICA, pročitati pismo naglas, rukavice.',
  'Ivka kann gehen': 'Ivka može otići',
  'Ivka weiß es jetzt. Die Leine hat sich vom Poller gelöst.': 'Ivka sad zna. Uzica se odvezala od bitve.',
  'Allein findet sie den Weg nicht.': 'Sama neće naći put.',
  'Mala kann sie hinüberbringen.': 'Mala je može prevesti.',   // m
  'Ich kann sie hinüberbringen.': 'Ja je mogu prevesti.',   // g
  'Als Mala bei Ivka „Hinüberbringen“ wählen.': 'Kao Mala kod Ivke odabrati „Prevedi“.',   // m
  'Bei Ivka „Hinüberbringen“ wählen.': 'Kod Ivke odabrati „Prevedi“.',   // g
  'Ivka friert': 'Ivki je hladno',
  'Ivka steht vor dem Licht und geht nicht weiter.': 'Ivka stoji pred svjetlom i ne ide dalje.',
  'Was hat sie ihr Leben lang nie getragen, und was hat Tonći ihr mitgebracht?': 'Što nikad u životu nije nosila, i što joj je Tonći donio?',
  '@mala:Was hat sie ihr Leben lang nie getragen, und was hat Tonći ihr mitgebracht?': 'Šta nikad u životu nije nosila, i šta joj je Tonći donio?',
  'Hier kann sie halten, was ihr vorher durch die Finger fiel.': 'Ovdje može držati ono što joj je prije ispadalo iz prstiju.',
  'Ivka die Handschuhe geben.': 'Dati Ivki rukavice.',
  // ---------------------------------------------------------------- Zwischenspiel · Donnerstagmorgen
  'Kein Kopfweh, kein Mädchen, keine Stimme. Ein gewöhnlicher Morgen.': 'Nema glavobolje, nema djevojke, nema glasa. Obično jutro.',
  'Heute ein Kaffee, den jemand anders gemacht hat.': 'Danas kava koju je skuhao netko drugi.',
  '@mala:Heute ein Kaffee, den jemand anders gemacht hat.': 'Danas kahva koju je skuhao neko drugi.',
  'In der Bar „Bura“ wartet der Platz am Fenster.': 'U baru „Bura“ čeka mjesto uz prozor.',
  'In der Bar Markos Tisch benutzen.': 'U baru upotrijebiti Markov stol.',
  'Etwas Kleines': 'Nešto malo',
  '„Dann fang mit etwas Kleinem an.“ Etwas, das sich nachprüfen lässt.': '„Onda počni s nečim malim.“ S nečim što se može provjeriti.',
  'Etwas, das nur jemand wissen kann, der dorthin sieht, wohin Gäste nicht kommen.': 'Nešto što može znati samo netko tko vidi ondje kamo gosti ne dolaze.',
  '@mala:Etwas, das nur jemand wissen kann, der dorthin sieht, wohin Gäste nicht kommen.': 'Nešto što može znati samo neko ko vidi tamo gdje gosti ne dolaze.',
  'Hinter dem Tresen hängt ein Zettel. Vom Tisch aus nicht zu lesen. Mala kann hinter den Tresen.': 'Iza šanka visi ceduljica. Sa stola se ne može pročitati. Mala može iza šanka.',   // m
  'Hinter dem Tresen hängt ein Zettel. Vom Tisch aus nicht zu lesen. Ich kann hinter den Tresen.': 'Iza šanka visi ceduljica. Sa stola se ne da pročitati. Ja mogu iza šanka.',   // g
  'Zu Mala wechseln und den Zettel hinter dem Tresen ansehen.': 'Prebaciti na Malu i pogledati ceduljicu iza šanka.',   // m
  'Zu mir wechseln und den Zettel hinter dem Tresen ansehen.': 'Prebaciti na mene i pogledati ceduljicu iza šanka.',   // g
  'Stimmt es?': 'Je li to točno?',
  'Was auf dem Zettel steht, ist bekannt. Stimmt es auch?': 'Zna se što piše na ceduljici. Ali je li to i točno?',
  '@mala:Was auf dem Zettel steht, ist bekannt. Stimmt es auch?': 'Zna se šta piše na ceduljici. Ali da li je to i tačno?',
  'Wer hat den Zettel geschrieben?': 'Tko je napisao ceduljicu?',
  '@mala:Wer hat den Zettel geschrieben?': 'Ko je napisao ceduljicu?',
  'Sanja, beiläufig gefragt.': 'Sanja, usput upitana.',
  'Sanja fragen: „Du machst am Montag zu?“': 'Pitati Sanju: „Zatvaraš u ponedjeljak?“',
  'Ans Wasser': 'Do mora',
  'Mala will ans Wasser.': 'Mala želi do mora.',   // m
  'Ich will ans Wasser.': 'Hoću do mora.',   // g
  'Ein Ort zum Sitzen und Reden, mit Blick aufs Meer.': 'Mjesto za sjedenje i razgovor, s pogledom na more.',
  'An der Riva steht eine Bank.': 'Na Rivi je klupa.',
  'An der Riva die Bank benutzen und mit Mala reden.': 'Na Rivi upotrijebiti klupu i razgovarati s Malom.',   // m
  'An der Riva die Bank benutzen und mit mir reden.': 'Na Rivi upotrijebiti klupu i razgovarati sa mnom.',   // g
  // ---------------------------------------------------------------- Zweiter Fall · Donnerstag
  '„Da ist noch einer.“': '„Ima još jedan.“',
  'Mala sagt: Da ist noch einer. Aber wo?': 'Mala kaže: ima još jedan. Ali gdje?',   // m
  'Da ist noch einer. Aber wo?': 'Ima još jedan. Ali gdje?',   // g
  'In der Bar wird über alles geredet, was in der Stadt passiert.': 'U baru se priča o svemu što se događa u gradu.',
  '@mala:In der Bar wird über alles geredet, was in der Stadt passiert.': 'U baru se priča o svemu što se dešava u gradu.',
  'Sanja weiß, was abgerissen wird. Stipe und Frane wissen, was dort einmal war.': 'Sanja zna što se ruši. Stipe i Frane znaju što je ondje nekad bilo.',
  '@mala:Sanja weiß, was abgerissen wird. Stipe und Frane wissen, was dort einmal war.': 'Sanja zna šta se ruši. Stipe i Frane znaju šta je tamo nekad bilo.',
  'In der Bar Sanja nach der alten Ledana fragen und mit Stipe reden.': 'U baru pitati Sanju za staru Ledanu i razgovarati sa Stipom.',
  'Werkzeug für die Ledana': 'Alat za Ledanu',
  'Die alte Ledana ist verfallen. Mit bloßen Händen kommt man da nicht weit.': 'Stara Ledana je ruševna. Golim rukama tu se ne može daleko.',
  'Wer am Hafen hat Werkzeug und hat Hilfe angeboten?': 'Tko u luci ima alat i ponudio je pomoć?',
  '@mala:Wer am Hafen hat Werkzeug und hat Hilfe angeboten?': 'Ko u luci ima alat i ponudio je pomoć?',
  'Dinko an der Matejuška: „Wenn du was brauchst, ich bin hier.“': 'Dinko na Matejuški: „Ako ti što zatreba, tu sam.“',
  'Dinko nach einem Brecheisen fragen, für die alte Ledana.': 'Pitati Dinka za pajser, za staru Ledanu.',
  'Der Bauzaun': 'Građevinska ograda',
  'Die Ledana ist eingezäunt.': 'Ledana je ograđena.',
  'Ein Zaun hat Lücken. Nicht jede ist von vorn zu sehen.': 'Ograda ima rupa. Ne vidi se svaka sprijeda.',
  'Mala sieht hinter die Fischkisten an der Matejuška.': 'Mala pogleda iza gajbi za ribu na Matejuški.',   // m
  'Ich sehe hinter die Fischkisten an der Matejuška.': 'Ja pogledam iza gajbi za ribu na Matejuški.',   // g
  'Zu Mala wechseln und die Fischkisten ansehen.': 'Prebaciti na Malu i pogledati gajbe za ribu.',   // m
  'Zu mir wechseln und die Fischkisten ansehen.': 'Prebaciti na mene i pogledati gajbe za ribu.',   // g
  'Durch den Zaun': 'Kroz ogradu',
  'Hinter den Kisten ist ein loses Zaunfeld.': 'Iza gajbi je labavo polje ograde.',
  'Mala kann nichts bewegen. Marko schon.': 'Mala ne može ništa pomaknuti. Marko može.',
  '@mala:Mala kann nichts bewegen. Marko schon.': 'Mala ne može ništa pomjeriti. Marko može.',
  'Die Kisten müssen weg, dann geht es durch die Lücke.': 'Gajbe treba maknuti, pa onda kroz rupu.',
  '@mala:Die Kisten müssen weg, dann geht es durch die Lücke.': 'Gajbe treba skloniti, pa onda kroz rupu.',
  'Als Marko die Fischkisten schieben und durch die Lücke kriechen.': 'Kao Marko pomaknuti gajbe za ribu i provući se kroz rupu.',
  'Oben in der Ledana': 'Gore u Ledani',
  'Oben auf der Empore war einmal jemand. Ist er noch da?': 'Gore na galeriji nekad je netko bio. Je li još tu?',
  '@mala:Oben auf der Empore war einmal jemand. Ist er noch da?': 'Gore na galeriji nekad je neko bio. Da li je još tu?',
  'Die Treppe ist morsch. Hinauf kommt nur, wer nichts wiegt.': 'Stepenice su trule. Gore može samo onaj tko ništa ne teži.',
  '@mala:Die Treppe ist morsch. Hinauf kommt nur, wer nichts wiegt.': 'Stepenice su trule. Gore može samo onaj ko ništa ne teži.',
  'Mala geht hinauf.': 'Mala ide gore.',   // m
  'Ich gehe hinauf.': 'Ja idem gore.',   // g
  'Zu Mala wechseln, hinauf zur Empore und mit dem Jungen dort reden.': 'Prebaciti na Malu, popeti se na galeriju i razgovarati s mladićem ondje.',   // m
  'Zu mir wechseln, hinauf zur Empore und mit dem Jungen dort reden.': 'Prebaciti na mene, popeti se na galeriju i razgovarati s momkom tamo.',   // g
  'Der Kühlraum': 'Hladnjača',
  'Lukas Gitarre liegt im Kühlraum. Die Tür ist verrostet, drinnen ist es dunkel.': 'Lukina gitara leži u hladnjači. Vrata su zahrđala, unutra je mrak.',
  'Einer geht durch Türen und sieht im Dunkeln, der andere hat Werkzeug.': 'Jedno prolazi kroz vrata i vidi u mraku, drugo ima alat.',
  'Unter dem Schutt liegt ein Koffer. Das Brecheisen öffnet die Tür und hebt die Brocken.': 'Pod šutom leži kofer. Pajser otvara vrata i podiže komade.',
  'Erst schaut Mala im Kühlraum nach, wo etwas liegt. Dann öffnet Marko die Tür.': 'Najprije Mala pogleda u hladnjači gdje što leži. Onda Marko otvori vrata.',   // m
  'Erst schaue ich im Kühlraum nach, wo etwas liegt. Dann öffnest du die Tür.': 'Prvo ja pogledam u hladnjači gdje šta leži. Onda ti otvoriš vrata.',   // g
  'Als Marko das Brecheisen an der Kühlraumtür benutzen, hineingehen, mit dem Brecheisen den Schutt beiseiteräumen und den Koffer öffnen.': 'Kao Marko upotrijebiti pajser na vratima hladnjače, ući, pajserom razmaknuti šut i otvoriti kofer.',
  'Zu Mala wechseln, durch die Kühlraumtür gehen und den Schutt spüren.': 'Prebaciti na Malu, proći kroz vrata hladnjače i osjetiti šut.',   // m
  'Zu mir wechseln, durch die Kühlraumtür gehen und den Schutt spüren.': 'Prebaciti na mene, proći kroz vrata hladnjače i osjetiti šut.',   // g
  'Wer ist Nina?': 'Tko je Nina?',
  'Luka wartet auf Nina. Wer ist sie, und wo ist sie heute?': 'Luka čeka Ninu. Tko je ona i gdje je danas?',
  '@mala:Luka wartet auf Nina. Wer ist sie, und wo ist sie heute?': 'Luka čeka Ninu. Ko je ona i gdje je danas?',
  'Wer in Split kennt die Leute von damals?': 'Tko u Splitu poznaje ljude iz onog vremena?',
  '@mala:Wer in Split kennt die Leute von damals?': 'Ko u Splitu poznaje ljude iz onog vremena?',
  'Sanja. Sie erzählt, wenn es etwas Greifbares gibt.': 'Sanja. Ona priča kad ima nešto opipljivo.',
  'In der Bar Sanja auf Luka und Nina ansprechen und fragen, wo Nina zu finden ist.': 'U baru spomenuti Sanji Luku i Ninu i pitati gdje se Nina može naći.',
  'Ninas Laden': 'Ninin dućan',
  'Nina hat einen Rahmenladen in der Altstadt: „Okvir“.': 'Nina ima dućan s okvirima u Starom gradu: „Okvir“.',
  '@mala:Nina hat einen Rahmenladen in der Altstadt: „Okvir“.': 'Nina ima radnju s okvirima u Starom gradu: „Okvir“.',
  'Wer zu früh nach Luka fragt, steht wieder draußen.': 'Tko prerano pita za Luku, opet je vani.',
  '@mala:Wer zu früh nach Luka fragt, steht wieder draußen.': 'Ko prerano pita za Luku, opet je napolju.',
  'Erst einmal Kunde sein. Und sehen, was sie aufhebt.': 'Najprije biti kupac. I vidjeti što čuva.',
  '@mala:Erst einmal Kunde sein. Und sehen, was sie aufhebt.': 'Prvo biti mušterija. I vidjeti šta čuva.',
  'In der Altstadt zu „Okvir“ gehen und mit Nina reden.': 'U Starom gradu otići u „Okvir“ i razgovarati s Ninom.',
  'Was Nina aufhebt': 'Što Nina čuva',
  'Nina redet nicht über Luka. Was bewahrt sie auf?': 'Nina ne govori o Luki. Što čuva?',
  '@mala:Nina redet nicht über Luka. Was bewahrt sie auf?': 'Nina ne govori o Luki. Šta čuva?',
  'Hinter dem Laden ist ein Zimmer, das Kunden nicht betreten.': 'Iza dućana je soba u koju kupci ne ulaze.',
  '@mala:Hinter dem Laden ist ein Zimmer, das Kunden nicht betreten.': 'Iza radnje je soba u koju mušterije ne ulaze.',
  'Mala geht durch die Tür „Privat“.': 'Mala prolazi kroz vrata „Privatno“.',   // m
  'Ich gehe durch die Tür „Privat“.': 'Ja prođem kroz vrata „Privatno“.',   // g
  'Zu Mala wechseln, ins Hinterzimmer gehen und die gerahmte Reservierung ansehen und spüren.': 'Prebaciti na Malu, ući u stražnju sobu, pogledati uokvirenu rezervaciju i osjetiti je.',   // m
  'Zu mir wechseln, ins Hinterzimmer gehen und die gerahmte Reservierung ansehen und spüren.': 'Prebaciti na mene, ući u stražnju sobu, pogledati uokvirenu rezervaciju i osjetiti je.',   // g
  'Ist Nina gefahren?': 'Je li Nina otputovala?',
  'Wo hätte sie an dem Abend sein sollen?': 'Gdje je te večeri trebala biti?',
  'Luka wollte sie am Kiosk treffen.': 'Luka se s njom htio naći kod kioska.',
  'Im Notizbuch die nie eingelöste Reservierung mit dem Treffpunkt am Kiosk verbinden.': 'U bilježnici povezati nikad iskorištenu rezervaciju s mjestom sastanka kod kioska.',
  'Der Briefkasten': 'Sandučić',
  'Hinter dem lockeren Ziegel an der Rampe steckt ein Papier.': 'Iza labave cigle na rampi zataknut je papir.',
  'Mit dem Brecheisen käme die halbe Wand mit. Es braucht etwas Dünnes, Flaches.': 'Pajserom bi se srušilo pola zida. Treba nešto tanko i plosnato.',
  'Der Ziegel sitzt fest in der Fuge. Gewalt reißt die Wand ein.': 'Cigla čvrsto sjedi u fugi. Silom bi se srušio zid.',
  'Der Spachtel ist dünn genug.': 'Špatula je dovoljno tanka.',
  'Etwas Dünnes, Flaches. So etwas verkauft ein Laden, der Bilder rahmt.': 'Nešto tanko i plosnato. Takvo što prodaje dućan koji uokviruje slike.',
  '@mala:Etwas Dünnes, Flaches. So etwas verkauft ein Laden, der Bilder rahmt.': 'Nešto tanko i plosnato. Tako nešto prodaje radnja koja uokviruje slike.',
  'An der Rampe den Spachtel am lockeren Ziegel benutzen.': 'Na rampi upotrijebiti špatulu na labavoj cigli.',
  'In Ninas Laden „Okvir“ nach einem Spachtel fragen.': 'U Nininu dućanu „Okvir“ pitati za špatulu.',
  '@mala:In Ninas Laden „Okvir“ nach einem Spachtel fragen.': 'U Nininoj radnji „Okvir“ pitati za špatulu.',
  'Erst herausfinden, wer einen Rahmenladen hat. Sanja kennt die Leute.': 'Najprije saznati tko ima dućan s okvirima. Sanja poznaje ljude.',
  '@mala:Erst herausfinden, wer einen Rahmenladen hat. Sanja kennt die Leute.': 'Prvo saznati ko ima radnju s okvirima. Sanja zna ljude.',
  'Ein Lied auf Kassette': 'Pjesma na kaseti',
  'Auf der Kassette ist Lukas Lied. Nur womit abspielen?': 'Na kaseti je Lukina pjesma. Samo, na čemu je pustiti?',
  'Ein Kassettenrekorder. Jemand hat jeden Abend damit den Seewetterbericht gehört.': 'Kasetofon. Netko je na njemu svake večeri slušao vremensku prognozu za pomorce.',
  '@mala:Ein Kassettenrekorder. Jemand hat jeden Abend damit den Seewetterbericht gehört.': 'Kasetofon. Neko je na njemu svake večeri slušao vremensku prognozu za pomorce.',
  'Zdenka hat Ivkas Radiorekorder. Sie freut sich über die Zeitung mit dem Nachruf.': 'Zdenka ima Ivkin radiokasetofon. Obradovat će se novinama s nekrologom.',
  'Zdenka in Veli Varoš die Zeitung geben.': 'Dati Zdenki u Velom Varošu novine.',
  'In der Bar die Zeitung vom Tresen nehmen und sie Zdenka in Veli Varoš bringen.': 'U baru uzeti novine s pulta i odnijeti ih Zdenki u Veli Varoš.',
  'Der Rekorder schweigt': 'Kasetofon šuti',
  'Ivkas Rekorder ist da, aber er schweigt.': 'Ivkin kasetofon je tu, ali šuti.',
  'Ohne Strom spielt er nichts.': 'Bez struje ništa ne svira.',
  'Die Batterien sind gekauft.': 'Baterije su kupljene.',
  'Am Kiosk im Fährhafen verkauft Mira Batterien.': 'Na kiosku u trajektnoj luci Mira prodaje baterije.',
  'Batterien gibt es am Kiosk im Fährhafen. Wer dort arbeitet, weiß Sanja.': 'Baterija ima na kiosku u trajektnoj luci. Tko ondje radi, zna Sanja.',
  '@mala:Batterien gibt es am Kiosk im Fährhafen. Wer dort arbeitet, weiß Sanja.': 'Baterija ima na kiosku u trajektnoj luci. Ko tamo radi, zna Sanja.',
  'Die Batterien in den Rekorder legen.': 'Staviti baterije u kasetofon.',
  'Bei Mira am Kiosk Batterien kaufen und in den Rekorder legen.': 'Kupiti baterije kod Mire na kiosku i staviti ih u kasetofon.',
  'Sanja fragen, wer damals noch am Hafen war.': 'Pitati Sanju tko je tada još bio u luci.',
  '@mala:Sanja fragen, wer damals noch am Hafen war.': 'Pitati Sanju ko je tada još bio u luci.',
  'Abspielbereit': 'Spremno za puštanje',
  'Der Rekorder läuft, die Kassette ist da.': 'Kasetofon radi, kaseta je tu.',
  'Zwei Dinge, die zusammengehören.': 'Dvije stvari koje idu zajedno.',
  'Die Kassette gehört in den Rekorder.': 'Kaseta ide u kasetofon.',
  'Die Kassette mit dem Rekorder benutzen.': 'Upotrijebiti kasetu s kasetofonom.',
  'Ninas Zettel von 1999 ist gefunden. Er war für Luka.': 'Pronađena je Ninina ceduljica iz 1999. Bila je za Luku.',
  '@mala:Ninas Zettel von 1999 ist gefunden. Er war für Luka.': 'Nađena je Ninina ceduljica iz 1999. Bila je za Luku.',
  'Wer einen Brief nie bekommen hat, sollte ihn jetzt hören.': 'Tko nikad nije dobio pismo, trebao bi ga sad čuti.',
  '@mala:Wer einen Brief nie bekommen hat, sollte ihn jetzt hören.': 'Ko nikad nije dobio pismo, trebao bi ga sad čuti.',
  'Luka sitzt noch oben in der Ledana.': 'Luka još sjedi gore u Ledani.',
  'In der Ledana mit Luka reden und vom Briefkasten erzählen.': 'U Ledani razgovarati s Lukom i reći mu za sandučić.',
  'Nina überzeugen': 'Uvjeriti Ninu',
  'Nina muss es hören: den Zettel, die Tickets, das Lied.': 'Nina to mora čuti: ceduljicu, karte, pjesmu.',
  'Sie will nicht an die Rampe, seit Jahren nicht. Sie kommt nur, wenn sie merkt, dass jemand verstanden hat, worauf sie wartet.': 'Ne želi na rampu, već godinama. Doći će samo ako osjeti da je netko shvatio što čeka.',
  '@mala:Sie will nicht an die Rampe, seit Jahren nicht. Sie kommt nur, wenn sie merkt, dass jemand verstanden hat, worauf sie wartet.': 'Neće na rampu, već godinama. Doći će samo ako osjeti da je neko shvatio šta čeka.',
  'Erst die Ledana, dann ihr eigener Zettel, Lukas Tickets, die Kassette. Und wenn sie zögert, etwas über ihr Warten: was Mira gesehen hat, oder was ihre Bilder zeigen.': 'Najprije Ledana, onda njezina vlastita ceduljica, Lukine karte, kaseta. A ako oklijeva, nešto o njezinu čekanju: što je Mira vidjela ili što pokazuju njezine slike.',
  '@mala:Erst die Ledana, dann ihr eigener Zettel, Lukas Tickets, die Kassette. Und wenn sie zögert, etwas über ihr Warten: was Mira gesehen hat, oder was ihre Bilder zeigen.': 'Prvo Ledana, pa njena ceduljica, Lukine karte, kaseta. A ako se dvoumi, nešto o njenom čekanju: šta je Mira vidjela ili šta pokazuju njene slike.',
  'Mit Nina reden: „Ich war in der Ledana“, ihr Zettel, die Tickets, die Kassette, „Wollen Sie es hören?“, und dann nach ihrem Warten fragen.': 'Razgovarati s Ninom: „Bio sam u Ledani“, njezina ceduljica, karte, kaseta, „Želite li to poslušati?“, a onda pitati o njezinu čekanju.',
  '@mala:Mit Nina reden: „Ich war in der Ledana“, ihr Zettel, die Tickets, die Kassette, „Wollen Sie es hören?“, und dann nach ihrem Warten fragen.': 'Razgovarati s Ninom: „Bio sam u Ledani“, njena ceduljica, karte, kaseta, „Želite li to poslušati?“, a onda pitati o njenom čekanju.',
  'An der Rampe': 'Na rampi',
  'Nina ist gekommen. Die Fähre legt bald ab.': 'Nina je došla. Trajekt uskoro isplovljava.',
  'Luka hat ein Lied für sie.': 'Luka ima pjesmu za nju.',
  'Der Rekorder mit der Kassette.': 'Kasetofon s kasetom.',
  'Nina den Rekorder mit der Kassette geben.': 'Dati Nini kasetofon s kasetom.',
  'Luka kann gehen': 'Luka može otići',
  'Luka weiß es jetzt. Die Leine ist gerissen.': 'Luka sad zna. Uzica je pukla.',
  'Allein findet er den Weg nicht.': 'Sam neće naći put.',
  'Mala kann ihn hinüberbringen.': 'Mala ga može prevesti.',   // m
  'Ich kann ihn hinüberbringen.': 'Ja ga mogu prevesti.',   // g
  'Als Mala bei Luka „Hinüberbringen“ wählen.': 'Kao Mala kod Luke odabrati „Prevedi“.',   // m
  'Bei Luka „Hinüberbringen“ wählen.': 'Kod Luke odabrati „Prevedi“.',   // g
  'Ohne Ticket': 'Bez karte',
  'Luka sucht die Fähre. Ohne Ticket lassen sie ihn nirgends rein.': 'Luka traži trajekt. Bez karte ga nigdje ne puštaju unutra.',
  'Die Tickets von damals sind nicht verloren.': 'Karte od onda nisu izgubljene.',
  'Sie lagen in seinem Koffer.': 'Bile su u njegovu koferu.',
  '@mala:Sie lagen in seinem Koffer.': 'Bile su u njegovom koferu.',
  'Luka die Tickets geben.': 'Dati Luki karte.',
  'Ninas Ticket': 'Ninina karta',
  'Luka hat ein Ticket mitgenommen. Das andere ist für Nina.': 'Luka je uzeo jednu kartu. Druga je za Ninu.',
  'Sie soll selbst entscheiden, ob sie fährt.': 'Neka sama odluči hoće li otputovati.',
  '@mala:Sie soll selbst entscheiden, ob sie fährt.': 'Neka sama odluči da li će otputovati.',
  'Nina steht noch an der Rampe.': 'Nina još stoji na rampi.',
  'Nina ihr Ticket geben.': 'Dati Nini njezinu kartu.',
  '@mala:Nina ihr Ticket geben.': 'Dati Nini njenu kartu.',
  'Spät in der Nacht': 'Kasno u noći',
  'Der Fall ist vorbei. Es ist spät.': 'Slučaj je gotov. Kasno je.',
  'Mala ist noch da.': 'Mala je još tu.',   // m
  'Ich bin noch da.': 'Još sam tu.',   // g
  'Reden, oder nach Hause gehen.': 'Razgovarati ili otići kući.',
  'Mit Mala reden.': 'Razgovarati s Malom.',   // m
  'Mit mir reden.': 'Razgovarati sa mnom.',   // g
  // ---------------------------------------------------------------- Dritter Fall · Freitag
  'Das Telefon': 'Telefon',
  'Das Telefon klingelt.': 'Telefon zvoni.',
  'Jemand will etwas.': 'Netko nešto hoće.',
  '@mala:Jemand will etwas.': 'Neko nešto hoće.',
  'Das Telefon in der Wohnung.': 'Telefon u stanu.',
  'Ans Telefon gehen.': 'Javiti se na telefon.',
  'Ein Auftrag im Palma': 'Posao u Palmi',
  'Ljerka Lalić vom Hotel Palma braucht Übersetzungen.': 'Ljerki Lalić iz hotela Palma trebaju prijevodi.',
  'Ein Auftrag beginnt mit einem Gespräch.': 'Posao počinje razgovorom.',
  'Ljerka ist an der Rezeption. Sie ist immer an der Rezeption.': 'Ljerka je na recepciji. Uvijek je na recepciji.',
  'Im Hotel Palma mit Ljerka reden und fragen, was zu übersetzen ist.': 'U hotelu Palma razgovarati s Ljerkom i pitati što treba prevesti.',
  '@mala:Im Hotel Palma mit Ljerka reden und fragen, was zu übersetzen ist.': 'U hotelu Palma razgovarati s Ljerkom i pitati šta treba prevesti.',
  'Die Mappe': 'Mapa',
  'Die Dokumentenmappe ist da. Übersetzt ist noch nichts.': 'Mapa s dokumentima je tu. Još ništa nije prevedeno.',
  'Ein Übersetzer braucht einen Tisch.': 'Prevoditelju treba stol.',
  '@mala:Ein Übersetzer braucht einen Tisch.': 'Prevodiocu treba sto.',
  'In der Halle steht ein Lesetisch.': 'U predvorju je stol za čitanje.',
  'Den Lesetisch in der Halle benutzen.': 'Upotrijebiti stol za čitanje u predvorju.',
  'Die Glocke klingelt allein': 'Zvono zvoni samo',
  'Ljerka schläft. Die Glocke der Portiersloge klingelt trotzdem.': 'Ljerka spava. Zvono u portirnici ipak zvoni.',
  'Wer hier noch Dienst tut, ist für Lebende nicht zu sehen.': 'Tko ovdje još dežura, živi ga ne vide.',
  '@mala:Wer hier noch Dienst tut, ist für Lebende nicht zu sehen.': 'Ko ovdje još dežura, živi ga ne vide.',
  'Mala spürt am Portiersstuhl, wer da sitzt.': 'Mala na portirskoj stolici osjeti tko ondje sjedi.',   // m
  'Ich spüre am Portiersstuhl, wer da sitzt.': 'Ja na portirskoj stolici osjetim ko tu sjedi.',   // g
  'Zu Mala wechseln und die Portiersloge spüren.': 'Prebaciti na Malu i osjetiti portirnicu.',   // m
  'Zu mir wechseln und die Portiersloge spüren.': 'Prebaciti na mene i osjetiti portirnicu.',   // g
  'Bruno fehlen die Worte': 'Brunu nedostaju riječi',
  'Bruno antwortet nur in Bruchstücken.': 'Bruno odgovara samo krnjim rečenicama.',
  'Bruchstücke können Hinweise sein, wenn man die richtigen Fragen stellt.': 'I krnje rečenice mogu biti tragovi, ako se postave prava pitanja.',
  'Fragen nach dem Salon. Was oben ist, und womit er aufgeht.': 'Pitanja o salonu. Što je gore i čime se otvara.',
  '@mala:Fragen nach dem Salon. Was oben ist, und womit er aufgeht.': 'Pitanja o salonu. Šta je gore i čime se otvara.',
  'Als Marko mit Bruno reden: nach dem Schlüssel für den Salon fragen und danach, was oben im Salon ist.': 'Kao Marko razgovarati s Brunom: pitati za ključ salona i za to što je gore u salonu.',
  '@mala:Als Marko mit Bruno reden: nach dem Schlüssel für den Salon fragen und danach, was oben im Salon ist.': 'Kao Marko razgovarati s Brunom: pitati za ključ salona i za to šta je gore u salonu.',
  'Dreizehn, Mantel, Haken': 'Trinaest, kaput, kuka',
  '„trinaest … Mantel … Haken“: dreizehn, Mantel, Haken.': '„trinaest … Mantel … Haken“: trinaest, kaput, kuka.',
  'Wo hängen in einem Hotel Mäntel an nummerierten Haken?': 'Gdje u hotelu vise kaputi na numeriranim kukama?',
  'In der Garderobe der Halle, Haken 13.': 'Na vješalici u predvorju, kuka 13.',
  'Den Mantel am Haken 13 benutzen.': 'Upotrijebiti kaput na kuki 13.',
  'Keine Musik': 'Nema glazbe',
  '„nema glazbe … ručka“: keine Musik, Kurbel.': '„nema glazbe … ručka“: bez glazbe, i neka ručka.',
  '@mala:„nema glazbe … ručka“: keine Musik, Kurbel.': '„nema glazbe … ručka“: bez muzike, i neka ručka.',
  'Wer etwas versteckt, damit niemand mehr Musik macht, legt es dorthin, wo er jeden Tag sitzt.': 'Tko nešto sakrije da više nitko ne svira, stavi to ondje gdje svaki dan sjedi.',
  '@mala:Wer etwas versteckt, damit niemand mehr Musik macht, legt es dorthin, wo er jeden Tag sitzt.': 'Ko nešto sakrije da više niko ne svira, stavi to tamo gdje svaki dan sjedi.',
  'In der Portiersloge, unter dem Telefonbuch.': 'U portirnici, ispod imenika.',
  'Das Telefonbuch in der Loge nehmen.': 'Uzeti imenik u portirnici.',
  'Der Salon': 'Salon',
  'Der Salon ist seit 1993 verschlossen.': 'Salon je zaključan od 1993.',
  'Am Schlüsselring aus dem Mantel hängt ein großer Schlüssel.': 'Na svežnju ključeva iz kaputa visi velik ključ.',
  'Die Treppe hinauf, die Kette aushaken.': 'Uz stubište, pa otkvačiti vrpcu.',
  'Mit dem Schlüsselring die Treppe zum Salon hinaufgehen.': 'Sa svežnjem ključeva popeti se stubištem do salona.',
  'Musik für Bruno': 'Glazba za Bruna',
  'Bruno sitzt unten in der Loge. Der Salon ist still.': 'Bruno sjedi dolje u portirnici. U salonu je tišina.',
  'Musik hat ihn früher jeden Sonntag hinaufgeholt.': 'Nekad ga je svake nedjelje glazba dovodila gore.',
  '@mala:Musik hat ihn früher jeden Sonntag hinaufgeholt.': 'Nekad ga je svake nedjelje muzika dovodila gore.',
  'Das Grammofon braucht seine Kurbel und eine Platte.': 'Gramofonu treba ručka i ploča.',
  'Die Kurbel ans Grammofon stecken, dann die Platte aus dem Plattenschrank auflegen.': 'Staviti ručku na gramofon, pa staviti ploču iz ormarića za ploče.',
  'Die Kurbel aus der Loge holen und ans Grammofon stecken.': 'Donijeti ručku iz portirnice i staviti je na gramofon.',
  'Die Platte auf das Grammofon legen.': 'Staviti ploču na gramofon.',
  'Den Plattenschrank öffnen und die Platte auf das Grammofon legen.': 'Otvoriti ormarić za ploče i staviti ploču na gramofon.',
  'Brunos Erinnerungen': 'Brunova sjećanja',
  'Bruno bekommt seinen Satz nicht zusammen. Ihm fehlen Erinnerungen.': 'Bruno ne može složiti svoju rečenicu. Nedostaju mu sjećanja.',
  'Drei Dinge rufen sie zurück: woran er jeden Sonntag dachte, wie seine Tochter spielte, und was er versteckt hat.': 'Tri stvari ih vraćaju: na što je mislio svake nedjelje, kako je svirala njegova kći i što je sakrio.',
  '@mala:Drei Dinge rufen sie zurück: woran er jeden Sonntag dachte, wie seine Tochter spielte, und was er versteckt hat.': 'Tri stvari ih vraćaju: na šta je mislio svake nedjelje, kako je svirala njegova kćerka i šta je sakrio.',
  'das Tanzfoto in der Halle': 'foto s plesa u predvorju',   // Teil von „Noch fehlt: …“ (siehe Muster unten)
  'Ljerkas Klavierschule im Salon': 'Ljerkina škola za klavir u salonu',
  'der Umschlag aus Zagreb im Klavierhocker': 'omotnica iz Zagreba u klavirskoj klupici',
  'Bruno das Tanzfoto zeigen.': 'Pokazati Brunu foto s plesa.',
  'Das Tanzfoto von der Wand in der Halle nehmen und Bruno zeigen.': 'Skinuti foto s plesa sa zida u predvorju i pokazati ga Brunu.',
  'Erst Bruno mit Musik in den Salon holen.': 'Najprije glazbom dovesti Bruna u salon.',
  '@mala:Erst Bruno mit Musik in den Salon holen.': 'Prvo muzikom dovesti Bruna u salon.',
  'Bruno im Salon die Klavierschule zeigen.': 'Pokazati Brunu u salonu školu za klavir.',
  'Im Salon das Tuch vom Flügel nehmen, die Klavierschule nehmen und Bruno zeigen.': 'U salonu skinuti plahtu s klavira, uzeti školu za klavir i pokazati je Brunu.',
  'Bruno den Umschlag aus Zagreb zeigen.': 'Pokazati Brunu omotnicu iz Zagreba.',
  'Den Klavierhocker mit dem Schlüsselring öffnen und Bruno den Umschlag zeigen.': 'Otvoriti klavirsku klupicu svežnjem ključeva i pokazati Brunu omotnicu.',
  'Brunos Satz': 'Brunova rečenica',
  'Bruno kann seinen Satz jetzt sagen, als Wortsalat aus drei Sprachen.': 'Bruno sad može izgovoriti svoju rečenicu, kao salatu od riječi iz tri jezika.',
  'Fünf Teile, je drei Fassungen. Bruno schüttelt den Kopf genau dort, wo es nicht stimmt.': 'Pet dijelova, svaki u tri inačice. Bruno odmahne glavom točno ondje gdje ne valja.',
  '@mala:Fünf Teile, je drei Fassungen. Bruno schüttelt den Kopf genau dort, wo es nicht stimmt.': 'Pet dijelova, svaki u tri verzije. Bruno odmahne glavom tačno tamo gdje ne valja.',
  'Die Wörter tragen den Sinn: perdonami heißt verzeih, tvoje pismo dein Brief, paura Angst, sam allein, sviraj spiel.': 'Riječi nose smisao: perdonami znači oprosti, paura strah, a njemačke riječi versteckt i weil znače sakrio i jer.',
  'Mit Bruno reden, „Ich versuche, Ihren Satz zu übersetzen“, und zusammensetzen: „Ljerka, verzeih mir. Ich habe deinen Brief aus Zagreb versteckt, weil ich Angst hatte, allein zu sein. Spiel wieder.“': 'Razgovarati s Brunom, „Pokušat ću prevesti vašu rečenicu“, i složiti: „Ljerka, oprosti mi. Sakrio sam tvoje pismo iz Zagreba jer sam se bojao da ću ostati sam. Sviraj opet.“',
  'Ljerka muss es erfahren': 'Ljerka to mora saznati',
  'Umschlag, Brief und Satz sind beisammen. Ljerka weiß von alldem nichts.': 'Omotnica, pismo i rečenica su na okupu. Ljerka o svemu tome ništa ne zna.',
  'Es ist mitten in der Nacht, aber das hier ist es wert.': 'Usred je noći, ali ovo je toga vrijedno.',
  'Ljerka schläft hinter der Tür „PRIVAT“ in der Halle.': 'Ljerka spava iza vrata „PRIVATNO“ u predvorju.',
  'An Ljerkas Tür „PRIVAT“ klopfen, ihr den Umschlag geben, dann Brunos Brief, dann den Satz sagen.': 'Pokucati na Ljerkina vrata „PRIVATNO“, dati joj omotnicu, onda Brunovo pismo, onda izgovoriti rečenicu.',
  'Bruno kann gehen': 'Bruno može otići',
  'Bruno ist nicht mehr im Dienst. Die Leine hat sich gelöst.': 'Bruno više nije na dužnosti. Uzica se odvezala.',
  'Er will die Tür selbst öffnen, wie immer.': 'Želi sam otvoriti vrata, kao i uvijek.',
  '@mala:Er will die Tür selbst öffnen, wie immer.': 'Hoće sam otvoriti vrata, ko i uvijek.',
  'Als Mala bei Bruno „Hinüberbringen“ wählen.': 'Kao Mala kod Bruna odabrati „Prevedi“.',   // m
  'Bei Bruno „Hinüberbringen“ wählen.': 'Kod Bruna odabrati „Prevedi“.',   // g
  'Keine Ablösung': 'Nema smjene',
  'Bruno kann nicht gehen. „Nema smjene.“ Es gibt keine Ablösung.': 'Bruno ne može otići. „Nema smjene.“ Nema nikoga da ga zamijeni.',
  'Wann kam früher die Ablösung, und woran erkannte er sie?': 'Kad je nekad dolazila smjena i po čemu ju je prepoznavao?',
  'Um sieben. Dann läutete die Glocke.': 'U sedam. Tad je zazvonilo zvono.',
  'Bruno fragen, wer ihn ablöst, und die Glocke läuten.': 'Pitati Bruna: „Tko vas smjenjuje, gospodine Laliću?“, pa pozvoniti zvonom.',
  'Zurück durch das Tor': 'Natrag kroz kamena vrata',
  'Es ist vorbei. Sie ist gegangen.': 'Gotovo je. Otišla je.',
  'Hier ist nichts mehr zu tun.': 'Ovdje više nema što raditi.',
  '@mala:Hier ist nichts mehr zu tun.': 'Tu više nema šta raditi.',
  'Das steinerne Tor führt zurück.': 'Kamena vrata vode natrag.',
  '@mala:Das steinerne Tor führt zurück.': 'Kamena vrata vode nazad.',
  'Durch das steinerne Tor zurückgehen.': 'Vratiti se kroz kamena vrata.',
  'Bruno ist gegangen.': 'Bruno je otišao.',
  'Das Tor führt zurück.': 'Vrata vode natrag.',
  '@mala:Das Tor führt zurück.': 'Vrata vode nazad.',
  // ---------------------------------------------------------------- Epilog · Samstag
  'Mit dem Honorar in der Tasche steht Marko am Busbahnhof.': 'S honorarom u džepu Marko stoji na autobusnom kolodvoru.',
  '@mala:Mit dem Honorar in der Tasche steht Marko am Busbahnhof.': 'S honorarom u džepu Marko stoji na autobuskoj stanici.',
  'Die Leine zeigt nach Osten.': 'Uzica pokazuje na istok.',
  'Am Schalter gibt es Fahrkarten nach Sarajevo.': 'Na šalteru se prodaju karte za Sarajevo.',
  'Den Fahrkartenschalter benutzen.': 'Upotrijebiti blagajnu.',
  'Der Bus': 'Autobus',
  'Die Fahrkarte ist gekauft.': 'Karta je kupljena.',
  'Der Bus wartet nicht ewig.': 'Autobus ne čeka vječno.',
  'Mala sitzt auf der Bank. Ein letztes Gespräch.': 'Mala sjedi na klupi. Još jedan, posljednji razgovor.',   // m
  'Ich sitze auf der Bank. Ein letztes Gespräch.': 'Sjedim na klupi. Još jedan, zadnji razgovor.',   // g
  'Den Bus benutzen.': 'Upotrijebiti autobus.'
});
// Zusammengesetzte Texte
var tr2=function(re,fn){ M.trPattern('bhs',re,fn); };
// 17_map.js infoFor(): Ortsname (schon übersetzt) + ' – hier bin ich.'
tr2(/^([\s\S]+) – hier bin ich\.$/, function(m,tr){ return tr(m[1])+' – ovdje sam.'; });
// 15_hints_k1.js k3_ins, Stufe 3: 'Noch fehlt: '+Liste+'.'
tr2(/^Noch fehlt: ([\s\S]+)\.$/, function(m,tr){ return 'Još nedostaje: '+m[1].split(', ').map(function(x){ return tr(x); }).join(', ')+'.'; });
// 15_hints.js showHints(): Thementitel + Stufe ('  ·2/4')
tr2(/^([\s\S]+)  ·([1-4])\/4$/, function(m,tr){ return tr(m[1])+'  ·'+m[2]+'/4'; });
M.trIgnore && M.trIgnore([' – hier bin ich.','Noch fehlt: ']);
})(M);
