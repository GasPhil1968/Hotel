/* Bosnisch/Kroatisch – Oberfläche (Menüs, Knöpfe, Verben, Notizbuch, Speicherplätze, Spielanleitung, Standardsätze).
   Oberfläche und Marko: Standardkroatisch; Malas Sätze: Sarajevo-Bosnisch. */
(function(M){ if (!M.trAdd) return;
M.trAdd('bhs', {
  // Verben und Knöpfe
  'Schau an':'Pogledaj', 'Nimm':'Uzmi', 'Benutze':'Upotrijebi', 'Öffne':'Otvori', 'Schiebe':'Pomakni', 'Rede mit':'Razgovaraj s', 'Lies':'Pročitaj',
  'Hingehen':'Idi tamo', 'Gib':'Daj', 'Sprich mit':'Razgovaraj s', 'Spüre':'Osjeti', 'Lausche':'Osluhni', 'Hindurchgehen':'Prođi kroz', 'Hinüberbringen':'Prevedi',
  'Notizen':'Bilješke', 'Zeigen':'Pokaži', 'Menü':'Izbornik', 'Nachdenken':'Razmisli', '(Tippen zum Schließen)':'(Dodirni za zatvaranje)',
  'Schimmer':'Odsjaj', 'Mala':'Mala', 'Marko':'Marko',
  // Überlagerungen
  'Nachhall':'Odjek', 'Übersetzung':'Prijevod', 'Tippe auf eine Zeile, um eine andere Fassung zu wählen.':'Dodirni redak da odabereš drugu inačicu.',
  'Vorlesen':'Pročitaj naglas', 'Zurück':'Natrag', 'Da fehlt noch etwas.':'Još nešto nedostaje.', 'Ordnen':'Poredaj', 'Zusammenlegen':'Spoji', 'Tauschen':'Zamijeni', 'Schrift lesen':'Čitanje rukopisa', 'Tafel':'Tablica',
  // Notizbuch
  'Notizbuch':'Bilježnica', 'Noch nichts, was zusammengehören könnte.':'Još ništa što bi moglo ići zajedno.', 'Danach fragen':'Pitaj o tome',
  'Antippen, dann „Danach fragen“.':'Dodirni, pa „Pitaj o tome“.', 'Eine Notiz antippen, dann eine zweite, die dazu passt.':'Dodirni bilješku, pa drugu koja ide uz nju.',
  'Mir geht nichts im Kopf herum. Noch nicht.':'Ništa mi se ne vrti po glavi. Još ne.', '(Nicht mehr nachdenken.)':'(Prestani razmišljati.)',
  'Worüber denke ich nach?':'O čemu razmišljam?', '(Das passt zu nichts.)':'(To ne ide ni uz što.)', 'Und was gehört dazu?':'A što ide uz to?',
  '(Doch nichts.)':'(Ipak ništa.)', 'Wonach frage ich?':'Što da pitam?', 'Wonach fragen?':'Što pitati?', 'Nach etwas aus dem Notizbuch fragen …':'Pitaj o nečemu iz bilježnice …',
  'Das hängt nicht zusammen.':'To nije povezano.', 'Da fehlt noch etwas.':'Tu još nešto nedostaje.', 'Das habe ich schon verstanden.':'To sam već shvatio.',
  'Liste':'popis',
  // Spielmenü
  'Weiterspielen':'Nastavi igru', 'Gespeichert.':'Spremljeno.', 'Hier geht Speichern nicht.':'Ovdje se ne može spremiti.', 'Geladen.':'Učitano.', 'Kein Spielstand.':'Nema spremljene igre.',
  'wartet auf Tippen':'čeka dodir', 'langsam':'sporo', 'normal':'normalno', 'schnell':'brzo', 'an':'uključeno', 'aus':'isključeno',
  'Vollbild':'Cijeli zaslon', 'Hinweis …':'Savjet …', 'Spielanleitung':'Upute', 'Zum Titelbild':'Na naslovnu stranu', 'MALA – Kapitel 1: Split':'MALA – Poglavlje 1: Split',
  'Sprache: Bosanski / Hrvatski':'Jezik: bosanski / hrvatski',
  // Titel
  'Fortsetzen':'Nastavi', 'Kapitel 1: Split':'Poglavlje 1: Split', 'Kapitel 2: Sarajevo':'Poglavlje 2: Sarajevo', 'Mitgelieferter Spielstand':'Priložena spremljena igra', 'Mitgelieferte Spielstände':'Priložene spremljene igre', 'Welchen Spielstand laden?':'Koju igru učitati?', 'Split: kurz vor Ivkas Wahrheit':'Split: tik prije Ivkine istine', 'Sarajevo: vor dem Ankaufbuch':'Sarajevo: prije knjige otkupa',
  'Über das Spiel':'O igri', 'Kapitel 1: Split  ·  Kapitel 2: Sarajevo':'Poglavlje 1: Split  ·  Poglavlje 2: Sarajevo',
  'MALA – Kapitel 1: Split · Kapitel 2: Sarajevo':'MALA – Poglavlje 1: Split · Poglavlje 2: Sarajevo',
  'Ein Point-and-Click-Adventure über Menschen,':'Avantura o ljudima',
  'die nicht weiterkommen, und über einen,':'koji ne mogu dalje i o jednome',
  'der mit ihnen reden kann.':'koji s njima može razgovarati.',
  'Marko lebt. Mala nicht.':'Marko je živ. Mala nije.',
  'Er spricht mit den Lebenden, sie geht durch Wände.':'On razgovara sa živima, ona prolazi kroz zidove.',
  'Alle Grafik, Musik und Geräusche entstehen':'Sva grafika, glazba i zvukovi nastaju',
  'im Spiel selbst. Kopfhörer lohnen sich.':'u samoj igri. Slušalice se isplate.',
  'Weiter mit Kapitel 2: Sarajevo':'Dalje: poglavlje 2, Sarajevo', 'Split ist zu Ende. Weiter nach Sarajevo?':'Split je gotov. Dalje u Sarajevo?',
  'Überschreiben?':'Prebrisati?', 'Neu beginnen?':'Početi ispočetka?', 'Welchen Spielstand fortsetzen?':'Koju igru nastaviti?', 'Auf welchen Platz laden?':'Na koje mjesto učitati?',
  'Sarajevo (bisher nur auf Deutsch): auf welchem Platz?':'Sarajevo (zasad samo na njemačkom): na kojem mjestu?',
  'Split: auf welchem Platz spielen?':'Split: na kojem mjestu igrati?', 'Nein, behalten':'Ne, zadrži', 'Spielstand beschädigt.':'Spremljena igra je oštećena.',
  'Platz':'Mjesto', 'leer':'prazno', 'Min.':'min', 'Std.':'h',
  // Spielanleitung (Marko erklärt, Mala ergänzt)
  'Tippe etwas an: Ist nur etwas zu sehen, schaue ich es mir an. Kann man etwas damit tun, kommt ein kleines Menü.':'Dodirni nešto: ako se samo može pogledati, pogledam. Ako se s time može nešto učiniti, otvori se mali izbornik.',
  'Gegenstände ziehst du aus der Leiste auf ihr Ziel. Auch auf Mala, wenn sie sich etwas ansehen soll.':'Predmete povučeš iz trake na cilj. I na Malu, ako treba nešto pogledati.',
  'Unten links kannst du zu mir wechseln. Ich gehe durch Wände, sehe, was er nicht sieht, und spüre, was an den Dingen hängt. Und wer losgelassen hat, den bringe ich hinüber.':'Dolje lijevo možeš prebaciti na mene. Ja prolazim kroz zidove, vidim šta on ne vidi i osjetim šta se drži stvari. A ko je pustio, tog ja prevedem.',
  '„Nachdenken“: Ich wähle einen Gedanken und dann einen zweiten, der dazugehört. Passt es, ziehe ich einen Schluss. Im Gespräch kann ich nach jedem Gedanken fragen. Im Menü lässt sich auf ein Notizbuch umschalten.':'„Razmisli“: odaberem jednu misao, pa drugu koja ide uz nju. Ako se slažu, izvučem zaključak. U razgovoru mogu pitati o svakoj misli. U izborniku se može prebaciti na bilježnicu.',
  '„Notizen“ ist mein Notizbuch. Es steht nur drin, was noch offen ist. Zwei Notizen nacheinander antippen verbindet sie. Im Gespräch kann ich nach jeder Notiz fragen. Im Menü lässt sich auf „Nachdenken“ umschalten.':'„Bilješke“ su moja bilježnica. U njoj je samo ono što je još otvoreno. Dodirneš li dvije bilješke jednu za drugom, povežeš ih. U razgovoru mogu pitati o svakoj bilješci. U izborniku se može prebaciti na „Razmisli“.',
  '„Zeigen“ markiert kurz alles, was man hier anfassen kann. Doppeltipp auf einen Ausgang bringt mich sofort hin.':'„Pokaži“ nakratko označi sve što se ovdje može dirati. Dvostruki dodir na izlaz odmah me odvede onamo.',
  // Standardsätze Marko
  'Nichts Besonderes.':'Ništa posebno.', 'Ich sehe es an. Es bleibt, was es ist.':'Gledam. Ostaje ono što jest.', 'Da ist nichts, was mir weiterhilft.':'Tu nema ničega što bi mi pomoglo.',
  'Das lasse ich, wo es ist.':'To ostavljam gdje jest.', 'Das brauche ich nicht.':'To mi ne treba.', 'Ich wüsste nicht, wie.':'Ne bih znao kako.', 'Damit kann ich nichts anfangen.':'S tim ne mogu ništa.',
  'Das lässt sich nicht öffnen.':'To se ne da otvoriti.', 'Es bewegt sich nicht.':'Ne miče se.', 'Es antwortet nicht. Zum Glück.':'Ne odgovara. Srećom.', 'Da steht nichts.':'Tu ništa ne piše.',
  'Das passt nicht zusammen.':'To ne ide zajedno.', 'So nicht.':'Ne tako.', 'Damit erreiche ich nichts.':'Time ništa ne postižem.', 'Das will hier niemand.':'To ovdje nitko ne želi.',
  'Die beiden haben nichts miteinander zu tun.':'Ta dva nemaju veze jedno s drugim.', 'Das ergibt nichts.':'Od toga ništa.',
  'Das ist ein und dasselbe.':'To je jedno te isto.',
  'Ich halte einem Lichtfleck etwas hin. So weit ist es schon.':'Pružam nešto mrlji svjetla. Dotle je već došlo.',
  'Mala. Durchscheinend, wenn das Licht von hinten kommt.':'Mala. Prozirna kad svjetlo dolazi odostraga.',
  'Dort geht es hinaus.':'Tuda se izlazi.', 'Da geht es hinaus.':'Ovuda van.',
  // Standardsätze Mala (Sarajevo-Bosnisch)
  'Für mich ist das nur ein Ding.':'Za mene je to samo stvar.', 'Da ist nichts, das sich an etwas erinnert.':'Tu nema ničeg što se nečega sjeća.', 'Stumm. Wie fast alles.':'Nijemo. Ko skoro sve.',
  'Dinge antworten nicht. Nicht einmal mir.':'Stvari ne odgovaraju. Ni meni.', 'Da ist nichts. Kein Nachhall.':'Tu nema ništa. Nikakvog odjeka.', 'Kalt, aber leer.':'Hladno, ali prazno.',
  'Nur das Meer.':'Samo more.', 'Nichts, was gesagt wird.':'Ništa se ne govori.', 'Ich kann es nicht anfassen. Das weißt du.':'Ne mogu to dirnuti. Znaš to.', 'Meine Hand geht hindurch.':'Ruka mi prođe kroz to.',
  'Er hört mich nicht.':'Ne čuje me.', 'Sie hört mich nicht. Niemand von ihnen.':'Ne čuje me. Niko od njih.', 'Ohne Marko komme ich nicht weit.':'Bez Marka ne mogu daleko.',
  'Dorthin gehe ich nicht ohne ihn.':'Tamo ne idem bez njega.', 'Die bleibt bei mir.':'Ona ostaje kod mene.',
  'Er hört mich. Das reicht.':'Čuje me. To je dosta.', 'Er sieht müde aus. Er sieht immer müde aus.':'Izgleda umorno. Uvijek izgleda umorno.',
  '@mala:Nein.':'Ne.', 'Nein.':'Ne.',
  // Hinweise der Seite (Offline-Speicher, Update)
  'Offline bereit ✓':'Spremno i bez interneta ✓', 'Wird für offline gespeichert …':'Sprema se za igru bez interneta …',
  'Neue Fassung geladen – sie startet beim nächsten Titelbild':'Učitana je nova inačica – pokreće se na sljedećoj naslovnoj strani'
});
// Zusammengesetzte Texte
var tr2=function(re,fn){ M.trPattern('bhs',re,fn); };
tr2(/^Benutze (.+) mit (.+)$/, function(m,tr){ return 'Upotrijebi: '+tr(m[1])+' ▸ '+tr(m[2]); });
tr2(/^Neue Notiz: (.+)$/, function(m,tr){ return 'Nova bilješka: '+tr(m[1]); });
tr2(/^Schlussfolgerung: ([\s\S]+)$/, function(m,tr){ return 'Zaključak: '+tr(m[1]); });
tr2(/^Das ist (.+)\.$/, function(m,tr){ return 'To je '+tr(m[1])+'.'; });
tr2(/^Speichern \(Platz (\d+)\)$/, function(m){ return 'Spremi (mjesto '+m[1]+')'; });
tr2(/^Laden \(Platz (\d+)\)$/, function(m){ return 'Učitaj (mjesto '+m[1]+')'; });
tr2(/^Text: (.+)$/, function(m,tr){ return 'Tekst: '+tr(m[1]); });
tr2(/^Notizbuch: (.+)$/, function(m,tr){ return 'Bilježnica: '+(m[1]==='Nachdenken'?'razmišljanje':(m[1]==='Liste'?'popis':tr(m[1]))); });
tr2(/^Musik: (an|aus)$/, function(m,tr){ return 'Glazba: '+tr(m[1]); });
tr2(/^Geräusche: (an|aus)$/, function(m,tr){ return 'Zvukovi: '+tr(m[1]); });
tr2(/^Röhrenbild: (an|aus)$/, function(m,tr){ return 'Stari ekran: '+tr(m[1]); });
tr2(/^Ja, Platz (\d+) überschreiben$/, function(m){ return 'Da, prebriši mjesto '+m[1]; });
tr2(/^Ja, Platz (\d+) neu beginnen$/, function(m){ return 'Da, kreni ispočetka na mjestu '+m[1]; });
tr2(/^Auf Platz (\d+) liegt ein Spielstand\. (.+)$/, function(m,tr){ return 'Na mjestu '+m[1]+' već je spremljena igra. '+tr(m[2]); });
// Oberfläche nach dem UI-Konzept (Phase 1)
M.trAdd('bhs', {
  'MALA wird quer gespielt':'MALA se igra vodoravno', 'Dreh dein Gerät ins Querformat.':'Okreni uređaj vodoravno.',
  'Ist die Drehsperre an? Dann spiel hier weiter: Das Bild liegt richtig, sobald du das Gerät drehst.':'Je li uključeno zaključavanje rotacije? Onda igraj ovdje: slika je ispravna čim okreneš uređaj.',
  'Gedreht weiterspielen':'Nastavi igrati okrenuto'
});
// Oberfläche nach dem UI-Konzept (Phase 2): HTML-Schicht für Titel, Spielstände, Einstellungen, Pause
M.trAdd('bhs', {
  'Fortsetzen':'Nastavi', 'Neues Spiel':'Nova igra', 'Spiel laden':'Učitaj igru', 'Einstellungen':'Postavke', 'Über MALA':'O igri MALA', 'Hauptmenü':'Glavni izbornik',
  'Beispielstände':'Ogledne igre', 'Beispiel':'Primjer', 'Kapitel':'Poglavlje', 'von vorn':'ispočetka', 'mit Vorgaben':'s pretpostavkama', 'bisher nur auf Deutsch':'zasad samo na njemačkom',
  'noch nicht erschienen':'još nije objavljeno', 'Alle drei Plätze sind belegt: Du wählst gleich, welcher überschrieben wird.':'Sva tri mjesta su zauzeta: odmah biraš koje će se prebrisati.',
  'Auf welchem Platz?':'Na kojem mjestu?', 'Der Beispielstand wird auf diesen Platz geladen.':'Ogledna igra učitava se na ovo mjesto.', 'Das neue Spiel beginnt auf diesem Platz.':'Nova igra počinje na ovom mjestu.',
  'Der automatische Stand auf diesem Platz geht verloren. Lesezeichen bleiben.':'Automatski spremljena igra na ovom mjestu bit će izgubljena. Oznake ostaju.',
  'Überschreiben':'Prebriši', 'Abbrechen':'Odustani', 'Bisher':'Dosad', 'Neu':'Novo', 'Lesezeichen':'Oznaka', 'Automatisch':'Automatski', 'Kapitelende':'Kraj poglavlja',
  'Beschädigt':'Oštećeno', 'Inkompatibel':'Nekompatibilno', 'Lässt sich nicht lesen':'Ne može se pročitati', 'Lässt sich nicht lesen.':'Ne može se pročitati.', 'Aus einer neueren Fassung':'Iz novije verzije',
  'Aus einer neueren Fassung – bitte aktualisieren.':'Iz novije verzije – molimo ažuriraj igru.', 'Fortsetzung folgt':'Nastavak slijedi', 'Weiter mit Kapitel':'Dalje s poglavljem', 'fertig':'završeno',
  'Neues Spiel hier':'Nova igra ovdje', 'dieses Spiel':'ova igra', 'Andere Plätze …':'Ostala mjesta …', 'Enthalten Handlung aus den genannten Kapiteln.':'Sadrže radnju iz navedenih poglavlja.',
  'Spielstände liegen nur in diesem Browser auf diesem Gerät.':'Spremljene igre postoje samo u ovom pregledniku na ovom uređaju.',
  'Sicherung exportieren …':'Izvezi sigurnosnu kopiju …', 'Sicherung importieren …':'Uvezi sigurnosnu kopiju …',
  'Speichern':'Spremi', 'Laden':'Učitaj', 'Hier speichern':'Spremi ovdje', 'jetzt':'sada', 'Das bisherige Lesezeichen geht verloren.':'Dosadašnja oznaka bit će izgubljena.',
  'Automatisch gespeichert':'Automatski spremljeno', 'bei jedem Ortswechsel neu. Lesezeichen bleiben, bis du sie überschreibst.':'iznova pri svakoj promjeni mjesta. Oznake ostaju dok ih ne prebrišeš.',
  'Rückgängig':'Poništi', 'Zurückgeholt.':'Vraćeno.', 'Rückgängig ging nicht.':'Poništavanje nije uspjelo.', 'Laden fehlgeschlagen. Das laufende Spiel ist unverändert.':'Učitavanje nije uspjelo. Igra u tijeku ostaje nepromijenjena.',
  'Spielstand löschen?':'Izbrisati spremljenu igru?', 'Löschen':'Izbriši', 'Löschen …':'Izbriši …', 'Gelöscht.':'Izbrisano.', 'Zum Titelbild.':'Na naslovnu stranu.',
  'Nach der Szene wieder möglich.':'Ponovno moguće nakon scene.', 'Speichern fehlgeschlagen: Der Browser-Speicher ist voll.':'Spremanje nije uspjelo: memorija preglednika je puna.',
  'Gerade nicht möglich.':'Trenutno nije moguće.', 'Das Kapitel ist zu Ende.':'Poglavlje je završilo.', 'Speichern fehlgeschlagen.':'Spremanje nije uspjelo.',
  'Dieser Spielstand lässt sich nicht lesen.':'Ova spremljena igra ne može se pročitati.', 'Dieser Spielstand stammt aus einer neueren Fassung. Bitte das Spiel aktualisieren.':'Ova spremljena igra potječe iz novije verzije. Molimo ažuriraj igru.',
  'Der Browser-Speicher ist nicht lesbar.':'Memorija preglednika nije čitljiva.',
  'Ton':'Zvuk', 'Musik':'Glazba', 'Geräusche':'Zvukovi', 'Umgebung':'Okolina', 'Text':'Tekst', 'Tempo':'Brzina', 'Weiter erst nach Tippen':'Dalje tek nakon dodira', 'Zeilen bleiben, bis du tippst':'Retci ostaju dok ne dodirneš',
  'Textgröße':'Veličina teksta', 'groß':'veliko', 'Schrift':'Pismo', 'Pixel':'Piksel', 'Lesbar':'Čitko', 'Darstellung':'Prikaz', 'Bewegung reduzieren':'Smanji pokrete', 'kein Wackeln, Pulsieren, Flackern':'bez drmanja, pulsiranja i treperenja',
  'Röhrenbild':'Stari ekran', 'umschalten':'prebaci', 'Ansicht':'Prikaz', 'Nachdenken: Marko fragt sich durch':'Razmišljanje: Marko se propituje', 'Liste: alle offenen Notizen auf einer Seite':'Popis: sve otvorene bilješke na jednoj stranici',
  'Sprache':'Jezik', 'Deutsch':'Njemački', 'Bos./Hrv.':'Bos./Hrv.', 'Bosanski / Hrvatski: Kapitel 2–4 bisher nur auf Deutsch':'Bosanski / Hrvatski: poglavlja 2–4 zasad samo na njemačkom',
  'Der Anrufbeantworter blinkt. Zwei neue Nachrichten.':'Telefonska sekretarica trepće. Dvije nove poruke.',
  'Abspann':'Odjavna špica', 'Ein Point-and-Click-Adventure über Menschen, die nicht weiterkommen, und über einen, der mit ihnen reden kann.':'Point-and-click avantura o ljudima koji ne mogu dalje i o jednome koji može razgovarati s njima.',
  'Marko lebt. Mala nicht. Er spricht mit den Lebenden, sie geht durch Wände.':'Marko je živ. Mala nije. On razgovara sa živima, ona prolazi kroz zidove.',
  'Alle Grafik, Musik und Geräusche entstehen im Spiel selbst. Kopfhörer lohnen sich.':'Sva grafika, glazba i zvukovi nastaju u samoj igri. Slušalice se isplate.',
  'Steuerung':'Upravljanje', 'Etwas antippen: Ist nur etwas zu sehen, schaut Marko es an. Kann man etwas damit tun, kommt ein kleines Menü.':'Dodirni nešto: ako se samo ima što vidjeti, Marko to pogleda. Ako se s tim može nešto učiniti, pojavi se mali izbornik.',
  'Gegenstände aus der Leiste auf ihr Ziel ziehen – auch auf Mala, wenn sie sich etwas ansehen soll.':'Predmete iz trake povuci na cilj – i na Malu, ako treba nešto pogledati.',
  'Unten links wechselst du zwischen Marko und Mala (Tab oder M).':'Dolje lijevo mijenjaš između Marka i Male (Tab ili M).',
  '„Notizen“: zwei Notizen nacheinander antippen verbindet sie (N).':'„Bilješke“: dodirni dvije bilješke jednu za drugom i povežeš ih (N).',
  '„Zeigen“ markiert kurz alles, was man hier anfassen kann (Z).':'„Pokaži“ nakratko označi sve što se ovdje može dirati (Z).',
  '„Karte“ öffnet den Stadtplan (K). Ein Tipp auf einen Ort, und Marko geht hin.':'„Karta“ otvara plan grada (K). Dodir na mjesto, i Marko ide onamo.',
  'Ein Tipp auf einen Ausgang, und Marko geht hin; zweimal schnell, und er ist sofort draußen.':'Dodir na izlaz, i Marko ide onamo; dvaput brzo, i odmah je vani.',
  'Antworten: Ziffern 1–9, Pfeiltasten und Enter; das Mausrad blättert.':'Odgovori: znamenke 1–9, strelice i Enter; kotačić miša lista.',
  'Esc schließt immer nur das Oberste; ist nichts offen, öffnet Esc dieses Menü.':'Esc uvijek zatvara samo ono najgornje; ako ništa nije otvoreno, Esc otvara ovaj izbornik.',
  'Rechtsklick: Schau an. Leertaste oder Enter: Satz überspringen.':'Desni klik: pogledaj. Razmak ili Enter: preskoči rečenicu.',
  'Pause':'Pauza', 'Hinweise …':'Savjeti …', 'speichert automatisch':'sprema automatski', 'nach der Szene':'nakon scene', 'hier nicht':'ovdje ne',
  'Spielzeit':'Vrijeme igre', 'Ton startet mit dem ersten Tipp':'Zvuk počinje prvim dodirom', 'Überspringen ▸':'Preskoči ▸', 'heute':'danas', 'gestern':'jučer', 'gerade eben':'upravo', 'vor':'prije', 'Kein Spielstand.':'Nema spremljene igre.'
});
tr2(/^Startet auf Platz (\d) \(frei\)\. Deine anderen Spielstände bleiben\.$/, function(m){ return 'Počinje na mjestu '+m[1]+' (slobodno). Ostale spremljene igre ostaju.'; });
tr2(/^Startet auf Platz (\d)\.$/, function(m){ return 'Počinje na mjestu '+m[1]+'.'; });
tr2(/^nach Kapitel (\d)$/, function(m){ return 'nakon poglavlja '+m[1]; });
tr2(/^mit deinem Ende von Kapitel (\d)$/, function(m){ return 's tvojim krajem poglavlja '+m[1]; });
tr2(/^Platz (\d) überschreiben\?$/, function(m){ return 'Prebrisati mjesto '+m[1]+'?'; });
tr2(/^Lesezeichen (\d) überschreiben\?$/, function(m){ return 'Prebrisati oznaku '+m[1]+'?'; });
tr2(/^Gespeichert ✓ Lesezeichen (\d)$/, function(m){ return 'Spremljeno ✓ oznaka '+m[1]; });
tr2(/^Gespeichert – Platz (\d)$/, function(m){ return 'Spremljeno – mjesto '+m[1]; });
tr2(/^Geladen: (.+)$/, function(m){ return 'Učitano: '+m[1]; });
tr2(/^Weiter mit Kapitel (\d): (.+)$/, function(m){ return 'Dalje s poglavljem '+m[1]+': '+m[2]; });
tr2(/^Ende des (ersten|zweiten|dritten|vierten) Kapitels$/, function(m){ return 'Kraj '+{ersten:'prvog',zweiten:'drugog',dritten:'trećeg',vierten:'četvrtog'}[m[1]]+' poglavlja'; });
tr2(/^Fortsetzung: (.+)$/, function(m){ return 'Nastavak: '+m[1]; });
tr2(/^Abspann Kapitel (\d)$/, function(m){ return 'Odjavna špica, poglavlje '+m[1]; });
// Phase 4: Sicherung als Datei, „Zuletzt“-Karte, Namen für Lesezeichen, Schnellvorlauf
M.trAdd('bhs', {
  'Diese Datei ist keine MALA-Sicherung.':'Ova datoteka nije sigurnosna kopija igre MALA.', 'Die Sicherung ist beschädigt (Prüfsumme stimmt nicht).':'Sigurnosna kopija je oštećena (kontrolni zbroj se ne slaže).',
  'Sicherung einspielen?':'Vratiti sigurnosnu kopiju?', 'Einspielen':'Vrati', 'Sicherung eingespielt. Einstellungen gelten ab dem nächsten Start.':'Sigurnosna kopija je vraćena. Postavke vrijede od sljedećeg pokretanja.',
  'Sicherung fehlgeschlagen.':'Sigurnosna kopija nije uspjela.', 'Zuletzt':'Prethodno',
  'Lesezeichen benennen':'Imenuj oznaku', 'Name (leer lassen für den Ort):':'Ime (ostavi prazno za mjesto):', 'Benennen …':'Imenuj …', 'Benannt.':'Imenovano.', 'Name entfernt.':'Ime je uklonjeno.',
  'Esc gedrückt halten, während eine Szene läuft: Sie läuft schneller ab.':'Drži Esc dok traje scena: odvija se brže.'
});
var unosa=function(n){ n=+n; return (n%10===1&&n%100!==11)?'unos':'unosa'; };
tr2(/^Alle Spielstände und Einstellungen in diesem Browser werden durch die Sicherung ersetzt: (\d+) (?:Eintrag|Einträge), gespeichert (.+)\.$/, function(m,tr){ return 'Sve spremljene igre i postavke u ovom pregledniku zamijenit će sigurnosna kopija: '+m[1]+' '+unosa(m[1])+', spremljeno '+tr(m[2])+'.'; });
tr2(/^Sicherung als Datei gespeichert \((\d+) (?:Eintrag|Einträge)\)\.$/, function(m){ return 'Sigurnosna kopija spremljena je kao datoteka ('+m[1]+' '+unosa(m[1])+').'; });
// Touch-Umsetzung (Touch-Konzept E1–E6): Gründe beim Figurenwechsel, Nachfrage, Aktionsleiste, Hinweise für iPhone und iPad, Feinwahl
M.trAdd('bhs', {
  'Gerade nicht – die Szene läuft.':'Ne sada – scena je u tijeku.', 'Erst das Gespräch beenden.':'Najprije završi razgovor.', 'Erst schließen.':'Najprije zatvori.', 'Hier geht das gerade nicht.':'Ovdje to sada ne ide.',
  'Welches?':'Koje od ovoga?', 'Schließen':'Zatvori', 'Verstanden':'Razumijem', 'iPhone und iPad':'iPhone i iPad', 'Spielstände':'Spremljene igre',
  'Wischen nach unten beendet es wieder':'Povuci prema dolje za izlaz', 'MALA läuft schon als App vom Home-Bildschirm.':'MALA već radi kao aplikacija s početnog zaslona.',
  'Auf dem iPhone: Teilen → „Zum Home-Bildschirm“. Dann startet MALA ohne Browserleisten.':'Na iPhoneu: Dijeli → „Dodaj na početni zaslon“. Tada se MALA pokreće bez traka preglednika.',
  'Tipp für iPhone und iPad: Teilen → „Zum Home-Bildschirm“. Dann startet MALA ohne Browserleisten, und Safaris Löschung nach sieben Tagen ohne Besuch gilt dort nicht.':'Savjet za iPhone i iPad: Dijeli → „Dodaj na početni zaslon“. Tada se MALA pokreće bez traka preglednika, a Safarijevo brisanje nakon sedam dana bez posjeta tamo ne vrijedi.',
  'Als App vom Home-Bildschirm hat MALA einen eigenen Speicher. Spielstände aus Safari holst du mit „Sicherung exportieren …“ in Safari und „Sicherung importieren …“ hier herüber (Spiel laden).':'Kao aplikacija s početnog zaslona MALA ima vlastitu memoriju. Spremljene igre iz Safarija preneseš s „Izvezi sigurnosnu kopiju …“ u Safariju i „Uvezi sigurnosnu kopiju …“ ovdje (Učitaj igru).',
  'Ist das iPhone stummgeschaltet (Schalter, Aktionstaste oder Kontrollzentrum), bleibt auch MALA stumm.':'Ako je iPhone utišan (prekidač, tipka Radnja ili Kontrolni centar), i MALA ostaje bez zvuka.',
  'Safari kann sie löschen, wenn MALA sieben Tage nicht geöffnet wird. Sicher sind sie in der App vom Home-Bildschirm oder als Datei („Sicherung exportieren …“ unter „Spiel laden“).':'Safari ih može izbrisati ako MALA sedam dana nije otvorena. Sigurne su u aplikaciji s početnog zaslona ili kao datoteka („Izvezi sigurnosnu kopiju …“ pod „Učitaj igru“).',
  'Die App vom Home-Bildschirm speichert getrennt von Safari. Übertragen: „Sicherung exportieren …“ und „… importieren“ unter „Spiel laden“.':'Aplikacija s početnog zaslona sprema odvojeno od Safarija. Prijenos: „Izvezi sigurnosnu kopiju …“ i „Uvezi sigurnosnu kopiju …“ pod „Učitaj igru“.',
  'Feinwahl':'Precizan odabir', 'Finger kurz ruhig halten: Fadenkreuz über dem Finger, Loslassen wählt':'Kratko zadrži prst: križić iznad prsta, otpuštanje odabire'
});
M.trIgnore && M.trIgnore(['Gegenstand doppelt: ','Notiz doppelt: ','kein Raum ','unbekannte Notiz ','unbekannter Gegenstand ','keine Phase ','kein Hotspot ',' in ','kein Ausgang ','keine Auswahl offen',
  'Option nicht gefunden: ','Gedanke nicht in der Auswahl: ','kein Notizbuch offen','Notiz steht im Notizbuch nicht zur Wahl: ','kein Ort ','Kunst fehlt für ','Spot fehlt: ','keine Farbe ','Escape','Enter','Tab','to left','to bottom','(pointer: coarse)',
  'translate(-50%,-50%) rotate(90deg)','Neue Notiz: ','Das ist ','Benutze ',' mit ','Schlussfolgerung: ','Speichern (Platz ','Laden (Platz ','Text: ','Notizbuch: ','Musik: ','Geräusche: ','Röhrenbild: ',
  ':  leer',' Min.',' Std. ','Ja, Platz ',' überschreiben',' neu beginnen','Auf Platz ',' liegt ein Spielstand. ','Sprache: Deutsch','Sarajevo: auf welchem Platz spielen?','MALA']);
})(M);
