# Prüfbericht Kapitel 3 „Mostar“

Story, Spannung, Rätsellogik, Figurenentwicklung und Spielspaß

- **Stand:** 5. November 2026
- **Geprüfte Fassung:** Commit `cb26f89`, Build `web/index.html`, Service-Worker-Version `mala-split-bcbd14be46`
- **Änderungen am Spiel:** keine. Neu ist nur dieser Bericht.

> **Nachtrag nach der zweiten Prüfung (5. November 2026)**
>
> Dieser Bericht meldet in A.6 und in Teil E keinen Blocker (P0). Das war falsch. Ein zweiter Prüfer hat mit echten Mausklicks zwei Blocker gefunden:
> - **Ordnen mit acht Karten:** Hat Marko Zlata nach den Hühnern gefragt, liegt „So war es“ unter dem Bildrand.
> - **Stadtplan:** Er liegt über der Auswahl „Allein gehen / Bei ihr bleiben“ und fängt jeden Klick ab.
>
> **Warum dieser Bericht sie übersehen hat:** Die Spielerkonsole aus A.3 löste Auswahlen und Rätselknöpfe über die Test-API aus, nicht über einen Klick an der sichtbaren Stelle. Deshalb konnten A1 und A3 den Knopf und die Auswahl bedienen, die ein Spieler nicht erreicht. Die Einschränkung stand nicht in A.5, und das hätte sie müssen.
>
> **Stand jetzt:** Beide Blocker und die übrigen Befunde der zweiten Prüfung sind behoben. Neue Klicktests mit echten Mausklicks (`game/tools/klicktests.js`) prüfen sie. Einzelheiten stehen in `BERICHT_K3.md`, Abschnitt 10. Der übrige Bericht beschreibt weiter die Fassung `cb26f89`.

**So sind Aussagen gekennzeichnet**

| Kennzeichen | Bedeutung |
|---|---|
| [beobachtet] | Tatsächlich beobachtet: im laufenden Spiel ausgelöst und gesehen (Durchgang A, Konsolenprotokoll oder Bildschirmfoto). |
| [Code] | Im Code nachvollzogen: Ablauf oder Bedingung in der Implementierung geprüft, im Spiel aber nicht vollständig ausgelöst. |
| [Verdacht] | Begründeter Verdacht: Es gibt konkrete Hinweise, reproduziert ist es noch nicht. |
| [Einschätzung] | Gestalterische Einschätzung. |
| [Vorschlag] | Neuer Vorschlag. Das ist nicht Teil des Spiels. |

Fundstellen sind relativ zu `game/src/` angegeben. „A1 B228“ heißt: Tester A1, Befehl 228 seines Protokolls. A2 bis A4 zählen mit „#“.

---

## A. Testgrundlage und Prüfumfang

### A.1 Fassung

In dieser Sitzung ist kein Anhang angekommen. Geprüft habe ich deshalb die Fassung im Repository: Commit `cb26f89` auf dem Branch `claude/split-adventure-game-concept-inxuzp`. Sie entspricht der zuletzt ausgelieferten ZIP-Datei.

### A.2 Befangenheit

Ich habe Kapitel 3 selbst geschrieben und kenne jede Lösung. Ein eigener Spieldurchgang wäre also kein unvoreingenommener Test. Beide Durchgänge haben deshalb unabhängige Prüfer übernommen. Ihre wichtigsten Behauptungen habe ich danach selbst im Code und an den Bildschirmfotos nachgeprüft.

### A.3 Durchgang A: blinder Spieltest

- **Tester:** vier unabhängige KI-Testagenten, keine Menschen.
  - Sie kannten weder Quelltext noch Lösung, Hinweisübersicht oder Konzept. Erlaubt war nur das Spielerhandbuch `web/LIESMICH.txt`.
  - Alle vier geben an, nichts außerhalb der Spielersicht gelesen zu haben.
- **Aussagekraft:** Was die Tester über Rührung, Langeweile oder Spaß schreiben, ist ihre Einschätzung des Gelesenen. Gemessene Reaktionen echter Spieler sind das nicht. Ich nenne den Durchgang deshalb blinden Spieltest und nicht Erstspielertest.
- **Werkzeug:** eine eigens gebaute Spielerkonsole. Sie ist eine temporäre Diagnosehilfe (`scratchpad/review/playserver.js`) und liegt nicht im Repository.
  - Sie steuert das echte Spiel in einem Chromium ohne Fenster.
  - Ausgegeben wird nur, was auch auf dem Bildschirm steht: Sätze mit Sprecher, Zwischentitel, Ort, gespielte Figur, antippbare Dinge mit Verben, offene Auswahl, Text eines Overlays und das Inventar. Bildschirmfotos gab es auf Wunsch.
  - Eingaben sind die regulären Spielhandlungen.
- **Regeln:**
  - Einen Hinweis durften die Tester erst nach mindestens zehn verschiedenen sinnvollen Versuchen nehmen, und nur Stufe für Stufe.
  - Naheliegende falsche Ideen sollten sie ausprobieren.
  - Alles wurde laufend protokolliert.

| Tester | Abschnitt | Start | Befehle | Fotos | Hinweise | Ende erreicht |
|---|---|---|---|---|---|---|
| A1 | Prolog bis Samstagmorgen | neues Spiel, Kapitel 3 aus dem Titelmenü | 267 | 31 | keine | ja, B266 „Zweiter Tag · Markttag“ |
| A2 | Samstag und Samstagnacht | Stand Samstagmorgen | 175 | 13 | keine | ja, #174 „Dritter Tag · Zwei Ufer“ |
| A3 | Sonntag | Stand Sonntagmorgen | 298 | 17 | 6 Stufen zu 3 Themen | ja, #297 „Finale · Die letzte Fähre“ |
| A4 | Finale und Epilog | Stand Sonntag, kurz vor elf | 145 | 26 | keine | ja, #143 „Ende des dritten Kapitels · Fortsetzung: München“ |

- **Startstände:**
  - Die Stände für A2 bis A4 stammen aus dem automatischen Lösungsdurchlauf `game/tools/walkthrough3.js`.
  - Er löst nur reguläre Handlungen aus: Reisen über den Stadtplan, sichtbare Auswahltexte, Ansehen, Benutzen, Geben und Notizen verbinden. Fortschrittsmarken setzt er nicht direkt.
  - A2 bis A4 begannen also auf dem Standardweg. Die Vortage kannten sie nur aus dem Notizbuch.
- **Isolation:**
  - Jede Konsole lief mit eigenem, frischem Browserprofil.
  - Persönliche Spielstände wurden weder gelesen noch überschrieben.
  - Protokolle, Fotos und Startstände liegen im Scratchpad. Die Konsolen sind beendet.

### A.4 Durchgang B: Struktur und Ursachen

- **Zwei weitere unabhängige Prüfer** haben den Code gelesen, ohne etwas zu ändern.
  - B1 prüfte Wissensverteilung und Rätselbedingungen, B2 Figuren, Dialoge und Rhythmus.
  - Lösung, Hinweisübersicht und frühere Berichte waren für sie gesperrt. Das Konzept durften sie erst am Ende lesen.
- **Eigene Nachprüfung:** Jeden Befund in Teil E habe ich selbst im Code nachvollzogen, die Darstellungsfehler zusätzlich an den Bildschirmfotos.
- **Umfangszahlen:** Die Zahlen in D.12 zählt ein einziges Skript für alle drei Kapitel.

### A.5 Grenzen der Konsole: Meldungen, die keine Spielfehler sind

- **„Die beiden Notizen passen so nicht zusammen.“ nach gelungenen Verbindungen:** Das war ein Lesefehler der Konsole. Die echten Antworten des Spiels auf falsche Verbindungen zeigte sie dafür nicht an. Diese Antworten habe ich im Code geprüft (`13_k3_notes.js:186–199`).
- **„(Telefon)“ bei Stimmen über den Fluss** (A3, A4): So bezeichnet die Konsole Sprecher außerhalb des Bildes. Das Spiel zeigt dort das normale Porträt (`06_ui.js:257`).
- **Figurwechsel mitten im Gespräch** (A3 #110–112, Mala redet mit Zlata): Das ging nur über die Konsole. Im Spiel sperrt `canSwitch` den Wechsel, solange ein Gespräch offen ist (`05_engine.js:258`).
- **Interne Kürzel** wie „Kioskm“ oder „Aussie1“ und der dauerhaft rote Punkt an „Notizen“: Das ist Darstellung der Konsole. Auf dem Bildschirm ist es nicht bestätigt.

### A.6 Erreichte Abschnitte

- **Kapitel 3 regulär bis zum Ende:** ja, in vier aufeinanderfolgenden Abschnitten. Einen durchgehenden Durchgang durch einen einzigen Tester gab es nicht.
- **Stabilität:** In 885 Konsolenbefehlen trat kein Programmfehler auf, und keine Szene lief doppelt [beobachtet].
- **Nicht geprüft:** menschliche Erstspieler, echte Geräte, Ton und Spielzeit (siehe H).

---

## B. Gesamturteil

### B.1 Kurzantwort

**Spannend: überwiegend ja.** [Einschätzung]
- Die Geschichte stellt früh konkrete Fragen und hält sie wach: Wohin zieht die Leine? Wer war der Fahrer? Warum lässt die Eierfrau beim Namen Mala ein Ei fallen? Wo liegt Lana?
- Die Spannung sinkt, wo das Spiel den nächsten Schritt selbst ausspricht. Sie sinkt auch in den langen Szenen ohne Eingabe: am Samstagnachmittag, im Finale und im Epilog.

**Logisch: im Gerüst ja, im Detail nicht durchgehend.** [Code]
- Kein Pflichtfortschritt ist blockiert. Jeder Tag endet erst nach seinen Pflichtschritten, und für verpasste Gelegenheiten gibt es Rückwege.
- Bei freier Reihenfolge stimmt die Wissensverteilung aber an mehreren Stellen nicht. Zwei zentrale Ketten sind dadurch deutlich beschädigt (E-01, E-02).

**Charakterlich überzeugend: ja. Das ist die größte Stärke.**
- Marko und Mala sind klar zu unterscheiden. Sie sind uneins, ohne unvernünftig zu werden.
- Ihre Beziehung verändert sich sichtbar, vom „Auftrag“ zum gemeinsam gemachten Faden. Am Grab ist das spielbar.
- Schwach ist die Mitte. Malas Widerstand gegen den Fährmann wird behauptet, aber nicht gespielt, und die Mechanik „Mala fragen“ widerspricht sich (E-07).

**Unterhaltsam: ja, vor allem durch Dialoge, Nebenfiguren und Übersetzungsaufgaben.**
- Die Rätsel sind fair, aber meist leicht. Oft führt der Spieler nur aus, was eine Figur gerade gesagt hat.
- Selbst erarbeitete Erkenntnisse gibt es nur an wenigen Stellen, die aber stark sind: Schublade, Eierfrau, Decke, Briefe und Lenas Anrede.

### B.2 Die schwerwiegendsten Schwächen

| Rang | Schwäche | Art | Befund |
|---|---|---|---|
| 1 | Das Ergebnis des Freitags ist „Skela“. Das Spiel nennt den Namen dreimal, bevor der Spieler ihn erschließt, und verlangt die Schlussfolgerung danach trotzdem. | Rätsellogik, Wissen | E-01 (P1) |
| 2 | Am Sonntag hält der Spieler die Lösung „Bato war wach“ schon in der Hand. Das Spiel sperrt sie hinter einem technischen Zwischenschritt, und dessen einziger Hinweis fällt im Normalablauf weg. | Rätsellogik | E-02 (P1) |
| 3 | Bei freier Reihenfolge wissen Figuren Dinge, die sie noch nicht wissen können. Naheliegende richtige Ideen werden abgewiesen oder irreführend beantwortet. | Wissen, Rückmeldung | E-03, E-04 |
| 4 | Die Schlüsselszenen laufen ohne Spieler. Es gibt 30 bis 35 Textfelder am Stück, die Glocke im Finale ist ein einziger Klick, und im Epilog wird die Nacht dreimal erzählt. | Rhythmus | E-05 |
| 5 | Das Spiel spricht Denkschritte selbst aus: Landmarken, Standorte und die nächste Handlung. | Denktiefe | E-06 |
| 6 | „Mala fragen“ rügt auch richtiges Handeln und bleibt im Kapitel folgenlos. Außerdem fehlt Malas Kante in der Mitte. | Figur, Mechanik | E-07 |
| 7 | Sprecher sind falsch zugeordnet, Texte abgeschnitten, Kästchen erscheinen als „?“, und Kernfakten widersprechen sich. | Technik, Kontinuität | E-08 bis E-10 |

**Technik und Gestaltung getrennt betrachtet:**
- **Eindeutige technische Fehler:**
  - die Sprecherzuordnung (E-08);
  - die Darstellung (E-09);
  - der Stadtplan in E-01;
  - die fehlenden Wissensbedingungen (E-03, E-04).
- **Gestalterische Bewertungen:** Rhythmus (E-05), Denktiefe (E-06) und die Mechanik „Mala fragen“ (E-07).
- **Beides:** E-02.

### B.3 Stärken, die erhalten bleiben müssen

1. **Schublade und E-Mail aus Graz** (`rooms/vulkanizer.js:252–279`).
   - Drei Quellen treffen sich: Ljerkas fehlender Schlüssel, Malas Blick durch das Holz und Markos Beruf. Er muss den österreichischen „Typenschein“ vom deutschen „Typenschild“ unterscheiden.
   - Jede falsche Zeile bekommt eine Antwort, die zur Figur passt, und Kata lässt nicht raten („Welche?“).
   - A1 nennt es das beste Rätsel seines Abschnitts [beobachtet, A1 B232–257].
   - Erhalten bleiben muss die dreifache Übergabe: Mala sieht, Marko weiß, Kata öffnet.
2. **Die Eierfrau und das fallende Ei** (`rooms/tepa.js`).
   - Falsche Ideen bekommen Antworten, die weiterhelfen: „Da war ich zwölf. Sie kennt mich nicht mit zwölf.“
   - Die Lösung ist eine echte Verbindung zweier Notizen, die Belohnung ein Bild statt eines Satzes [beobachtet, A2 #37–70].
   - Dazu kommt der Verlustzweig, der später wieder aufgegriffen wird.
3. **Die Lichtprobe über den Fluss** (`rooms/skela_l.js:104–119`, `rooms/skela_d.js:99–107`).
   - Die Zusammenarbeit ist räumlich begründet: Mala geht an dieser Stelle nicht über den Fluss, Marko hält drüben das Licht.
   - Die Rückmeldung kommt als „Zu breit“, „Zu tief“ und als Kopfschütteln [beobachtet, A3 #44–59].
4. **Die zwei Fassungen** (`13_k3_notes.js:66–69`): „Sie hat mich weggeschickt“ gegen „Er ist gefahren.“ In diesem Widerspruch haben beide recht. Das ist reifer als ein Lügner, den man überführt.
5. **Vlado, Teil 2, und die Botschaft** (`rooms/vulkanizer.js:126–160, 180–210`).
   - Vlado reagiert auf jede einzelne Notiz und sagt, was noch fehlt.
   - Die Lösung ist eine gemeinsame Erinnerung, kein Gegenstand: „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“
6. **Mates zwei Erkenntnisse** (`rooms/zelenika.js:102–139`, `97_k3_limbo_mate.js:25–33`).
   - Lenas „Došli smo, dida.“ zeigt ihm den Sohn. Seine Hand, die durch ihre hindurchgeht, zeigt ihm den eigenen Tod.
   - Erkenntnis und Übergang sind getrennt. Markos Beruf löst den Fall: „Bitte einsteigen.“
7. **Das Grab als spielbare Wende** (`rooms/skela_l.js:264–292`).
   - Der alte Reflex „Ich bringe dich nach Hause. Wie versprochen.“ ist wählbar und läuft ins Leere.
   - Mala nennt die Kosten und fragt selbst: „Willst du das?“
8. **Übersetzen als Dramaturgie.**
   - Jela kann wahr oder geschönt übersetzt werden; die Schonfassung wird sofort enttarnt (`rooms/zelenika.js:25, 88`).
   - Dazu kommen das Lied der Australier und das Feld „Beziehung“ im Formular mit seiner Rückseite (`rooms/vermisst.js:34–47`).
9. **Klammern und Motive.**
   - die Knie im Bus (`96_k3_story.js:54` ↔ `rooms/ostbus.js:116`);
   - „Du bist gekommen. Nur später.“ (Kapitel 2, `rooms/tramvaj.js:60` ↔ `97_k3_limbo_bato.js:34–35`);
   - das Zählen bei Lana, Bato, Vlado und Frau Kolar;
   - „Nicht als Nachricht“ bei Lana, Nada und Jasna.
10. **Takt bei Krieg und Teilung.** Dafür stehen der stille Bulevar (`rooms/bulevar.js:21–37`) und die drei Wörter, an denen sich Kroatisch und Bosnisch unterscheiden. Das Spiel bezieht keine Seite und erklärt nichts.
11. **Der schlanke Einstieg.** Ab A1 B10 steuert der Spieler frei, und die Vorgeschichte steckt in vier Notizen [beobachtet].
12. **Markos Vaterfaden.** Er führt bis zur Blutprobe und zum Anruf bei der Mutter. Damit entsteht der Haken zu Kapitel 4 aus der Handlung.

---

## C. Handlung und Funktion als drittes von fünf Kapiteln

### C.1 Der tatsächliche Handlungsbogen

**Anschluss**
- Kapitel 2 endet mit Malas Splittern: ein Lastwagen, ein rauchender Fahrer, eine Brücke, „die nicht mehr da war“. Dazu kommt Nadas Auftrag „Bring sie nach Hause“.
- Kapitel 3 übernimmt das als vier Notizen „[Aus Sarajevo]“ (`13_k3_notes.js:11–14`).
- Es beginnt am Donnerstag, 24. November 2011, mit der Ankunft in Mostar.

**Prolog, Donnerstag**
- **Pflicht:** Die Alte Brücke ist nicht Malas Brücke. Sie hat einen einzigen Bogen und keine Stümpfe.
- **Pflicht:** das erste Schlüsselgespräch auf der Terrasse. Mala fragt: „Bin ich der Auftrag oder die, die man fragt?“ Marko verspricht: „Dass du mich fragst. Bei allem.“
- **Optional:** der Springer-Geist (Mala allein), die Australier, die Kurtaxe.

**Freitag, „Die Peilung“**
- **Pflicht, die Peilung:**
  - Gepeilt wird von drei Standorten: Brückenkopf, Koski-Minarett und Partisanenfriedhof. Zum Friedhof kommt Mala nur über die Straßenbrücke, mit geschlossenen Augen.
  - Die Linien schneiden sich in einem Stück Fluss hinter dem Rand des Plans.
  - Über Zdravkos Karte von 1985 führt das zur Notiz „Skela heißt Fähre“.
- **Pflicht, der Fahrer:**
  - Vlado leugnet: „Nie.“
  - Kata braucht eine Übersetzung. Mala sieht in die unterste Schublade.
  - Darin liegen der Schlüssel von 31 und Lanas Zeichnung. Vlado sagt nur: „Morgen.“
- **Optional:** Sanja und Ljerka am Telefon. Ljerka liefert Vlados Namen, den fehlenden Schlüssel und „Unterschrieben mit Mala“.
- **Pflicht, abends:** Mala fragt nach Markos Vater. Seine Frage „Woher?“ bleibt unbeantwortet.

**Samstag, „Markttag“**
- **Pflicht:** Die Leine führt zur Eierfrau. Mit der Frage „Kannten Sie eine Mala?“ wird sie als Zlata Brkić erkennbar. Wer die Frage nicht findet, landet im Verlustzweig.
- **Pflicht, Vlado, Teil 1:**
  - Freitag, 14. Januar 1994, Split: „Sie hat gesagt, sie heißt Mala.“
  - In Skela waren sie gegen zwanzig vor elf. Abgefahren ist er um Viertel nach elf.
- **Pflicht:** der Bus aus München. Mates Geist erkennt seinen Sohn Davor nicht. Im Haus Zelenika spricht Jela Mundart, und Nada ruft an.
- **Pflicht, nachts in Skela:**
  - die Glocke, der Nachbar und Batos Geist: „Es war ein Mann. Er hat gerufen wie ein Soldat.“
  - der Nachhall an Glocke und Hütte; der Seilanker ist optional;
  - Zlata: „Sutra. Danju.“

**Sonntag, „Zwei Ufer“**
- **Pflicht, Zlata und die Lichtprobe:**
  - Zlata zeigt den Bleistift und sagt: „Er hat geschlafen.“
  - Die Lichtprobe zeigt das Dachfenster, und das ist Batos Kammer.
  - Malas Nachhall ergibt „dunkel, hell, dunkel“.
  - Dann wird die Nacht geordnet, Bato verrät sich, und es folgt der Schluss „Bato war wach“.
- **Pflicht, das Mädchen und die Decke:** Malas Mädchenstimme und der Bleistift ergeben „Es war das Mädchen“. Die Decke führt zu „Sie hat den Fluss überlebt“.
- **Naheliegend, aber keine Pflicht:** das Grab mit der Inschrift „MALA · 15.1.1994“ (`96_k3_story.js:184` verlangt es nicht).
- **Optional:** Zlatas „Im Schilf. Sie hat noch gelebt.“ und Batos Unruhe.
- **Optional, aber naheliegend:** Zlata die Wahrheit sagen. Mala schüttelt über den Fluss hinweg den Kopf.
- **Pflicht, Vlado, Teil 2, und das zweite Schlüsselgespräch im Hof:**
  - Lana hat Vlado weggeschickt. Um zwei war er zurück.
  - Mala erinnert sich an das Seil.
  - Die Botschaft an Vlado lautet „Dann fahr still.“
- **Pflicht, Mates Fall:** Briefe, Kinderzimmer, Feigen, Lenas Anrede und der Schlüssel am Tor. Am Ende steht der Übergang an der Haltestelle.

**Finale, Sonntagnacht**
- **Die Fähre:**
  - Vlado fährt zum ersten Mal seit 1994 nachts.
  - Marko läutet, und Batos Geisterfähre legt an.
  - Bato erkennt seinen Tod, und Mala setzt über.
- **Zlatas Erzählung:**
  - Lana lebte noch am Herd und sagte „Mali čeka“.
  - Sie bat: „Sagt es keinem. Ich will selbst nach Hause kommen. Nicht als Nachricht.“
  - Am Samstag starb sie.
- **Die Wahl:** Marko kann Zlata sagen, dass Bato wach war. Danach löst sich die Leine.
- **Am Grab:** Mala entscheidet, vorerst bei Marko zu bleiben: „Den haben wir gemacht.“
- **Die Zwischenwelt:** Dort ziehen Marko und Bato die Fähre hinüber.

**Epilog, Montag**
- Dino springt, und Mala lacht.
- Die Erinnerung an Vratnik zeigt: Mala war seit Kapitel 2 bei Marko, „leer“.
- Nada kommt.
- Sie bekommt Zlatas Brief von 1996 („ADRESA NEDOVOLJNA“) und Lanas Skizzenbuch.
- **In der Vermisstenstelle:** das Formular, Markos eigener Satz auf der Rückseite, die Blutprobe für Markos Vater (eine Wahl) und der Anruf bei der Mutter in München.
- Zum Schluss fahren sie mit dem Bus zurück.

**Entscheidungen mit Folgen** gibt es wenige [Code]:
- Davor zusagen: Damit tritt Jela am Samstag oder erst am Sonntag auf.
- Nada „Spur“ oder „noch nichts“ sagen: Das kehrt im Epilog wieder.
- Zlata die Wahrheit sagen.
- die Antwort am Grab.
- die Blutprobe: Sie wird für Kapitel 4 gespeichert.

Die übrigen Wahlen färben nur einzelne Zeilen.

### C.2 Was sich zwischen Anfang und Ende verändert

- **Sachlich:**
  - Lanas Tod ist vollständig erzählt: das Seil, die Nacht am Herd, der Tod am Samstag.
  - Das Grab ist gefunden, die Exhumierung beantragt.
  - Bato und Mate sind hinübergegangen.
  - Vlado fährt wieder nachts.
- **Emotional:**
  - Im Bus zieht Mala die Knie an. Auf der Rückfahrt „sieht Mala hinunter, ohne die Knie anzuziehen“ (`rooms/ostbus.js:116`).
  - Auf der Brücke sagt sie über ihre Angst: „Aber es ist meine.“ Und sie lacht zum ersten Mal in Mostar.
  - Marko hat sich anfangs erst gemeldet, wenn er etwas wusste. Am Ende ruft er ohne Ergebnis seine Mutter an.
  - Am Anfang steht der Satz „Ich habe ihn nie gesucht“, am Ende die Blutprobe für den Vater.
- **Beziehung:**
  - Der Bogen geht von „Mit Datum. Wie einen Auftrag.“ (`rooms/herberge.js:82`) zu „Den habe ich nicht festgemacht. Den haben wir gemacht.“ (`rooms/skela_l.js:289`).
  - Die Führung kehrt sich um. Aus Kapitel 2 stammt Markos „Ich daneben, damit du nicht herausfällst.“ Jetzt sagt Mala: „Hinter uns. Damit du siehst, dass ich nicht herausfalle.“ (`rooms/ostbus.js:198`)

[Einschätzung] Die Frage lässt sich klar beantworten. Das Kapitel leistet die Veränderung, die ein Mittelstück braucht. Schwach angelegt sind nur zwei Dinge:
- Zwischen Donnerstagabend und Sonntagnachmittag gibt es keinen neuen Konflikt zwischen den beiden.
- Was das neue Band kostet, nämlich Markos Kopfschmerz, kommt nur als optionales Thema vor (`97_k3_mala.js:121`).

### C.3 Anschluss, Wendepunkte, Höhepunkt, Abschluss

- **Anschluss:**
  - Der Einstieg ist gut [beobachtet, A1].
  - Er greift Vorwissen über die Notizen auf, statt Kapitel 2 nachzuerzählen.
  - Quereinsteiger stolpern über einige unerklärte Namen (Palma, Ljerka, Hajra, Vesna), finden sich aber zurecht.
- **Wendepunkte:**
  - Malas Brücke ist nicht die Alte Brücke. Daraus folgt die Peilung.
  - Skela heißt Fähre.
  - Die Leine hängt an einer lebenden Frau. A2 nennt den Satz „Als würde das, woran sie hängt, herumlaufen.“ einen großartigen Haken, und auf dem Markt löst er sich auf (#6, #69).
  - „Sie hat den Fluss überlebt“ macht aus der Suche nach einem Ort die Suche nach einem Menschen.
  - das Grab;
  - „Mali čeka“ und „Nicht als Nachricht“. Damit lösen sich der Strang der zwei Namen und die fehlende Vermisstenmeldung „auf einen Schlag“ (A4).
  - Die Wendungen sind vorbereitet, zum Beispiel:
    - Malas „Ein Mann, der am Fenster stand.“ (`rooms/skela_d.js:292`);
    - Zlatas Träume „seit Mittwoch“ (`rooms/tepa.js:18–20`).
- **Höhepunkt:** emotional stark, spielerisch überwiegend inszeniert [Einschätzung].
  - Die Glocke ist ein Klick, und alle drei Schläge laufen als Szene ab (A4 #11).
  - In derselben automatischen Szene erkennt Bato seinen Tod.
  - Zlatas Erzählung umfasst rund 34 Textfelder.
  - Selbst erarbeitet ist der Höhepunkt nur am Grab. „Bato war wach“ ist dort eine Gesprächsoption, der Schluss dazu fiel schon am Sonntag.
  - Die Intensität stammt dennoch aus dem vorherigen Spiel (Lichtprobe, Vlado, Grab) und nicht aus bloßer Behauptung.
- **Lokaler Abschluss:** vollständig. Jeder Fall des Kapitels kommt zu einem Ergebnis (siehe C.6).

### C.4 Markos Entwicklung

- **Was er will:** Er will Nadas Auftrag erfüllen und wiedergutmachen: „Ich bin damals nicht gekommen. Jetzt komme ich. Für dich, für sie, für alle.“ (`rooms/herberge.js:93`)
- **Was ihm hilft:**
  - Er misst, statt zu fragen: „Nicht mit Fragen. Mit etwas, das man messen kann.“ (`rooms/ostbus.js:73`)
  - Das hat er vom Vater (`96_k3_story.js:269`).
  - Er übersetzt: Katas E-Mail, Jela, Lena und Mates Durchsage.
- **Wo die Haltung an ihre Grenze kommt:**
  - Mala: „Du willst mich messen.“ (`rooms/zimmer.js:17`)
  - Die direkte Frage bringt Vlado nur zu „Raus.“
  - Zlata: „Sie gehört niemandem mehr.“
  - Im zweiten Gespräch sagt Mala: „Weil du rechnen kannst … Und am Ende der Rechnung stehst du.“ (`rooms/vhof.js:40`)
- **Was er selbst entscheidet:**
  - wahr oder geschönt übersetzen;
  - bei Zlata auf Malas Zeichen warten: „Das entscheide ich nicht allein. Nicht ohne Mala.“ (`rooms/skela_l.js:147`);
  - den eigenen Satz im Formular;
  - die Blutprobe;
  - den Anruf bei der Mutter.
- **Was er am Ende anders macht:** Am Grab fragt er, statt zu versprechen. Er schreibt einen eigenen Satz, gibt die Probe und ruft die Mutter an.
- **Gezeigt oder nur behauptet:** [Einschätzung]
  - **Gezeigt** wird die Entwicklung am Grab und im Formular. Dort wird sie zur Spielerfahrung.
  - **Behauptet** wird sie in Kommentaren:
    - „Er fragt jetzt. Manchmal. Er übt.“ (`97_k3_mala.js:31`)
    - „Du hast ihn gesucht. Gerade eben. Das war die Sekunde.“ (`rooms/vermisst.js:64`)
  - Der Vaterfaden ist am Freitag und Montag Pflicht, am Samstag und Sonntag nur optional. In der Kapitelmitte verschwindet er für viele Spieler [Code, B2].
- **Rückfälle:** Bereits überwundene Konflikte setzt das Kapitel nicht zurück.
  - Marko leugnet Mala nicht wieder.
  - Der alte Reflex „versprechen statt fragen“ kehrt am Grab absichtlich als wählbare Probe zurück. Das ist kein Rückfall.
- **Ungenutztes Potenzial:**
  - Seine Genauigkeit als Übersetzer trägt einige Rätsel und könnte mehr tragen.
  - Sein trockener Humor steht fast nur in optionalen Ansichtstexten.
  - Den stärksten Nachteil hat Marko durch E-06: Wenn er jeden Denkschritt ausspricht, klingt er nach Autor statt nach Ermittler.

### C.5 Malas Entwicklung und die Beziehung

- **Eigenes Anliegen:** „Ich will wissen, wie ich gestorben bin. Das zuerst. Und dann entscheide ich, was davon nach Hause geht. Ich.“ (`rooms/herberge.js:95`) Das ist klar und trägt das ganze Kapitel.
- **Eigene Sicht:**
  - Sie nimmt die Welt über die Sinne wahr: „Er ist nicht grün. Er ist laut.“ (A1 B13)
  - Sie hat Angst vor Fluss, Brücken und Glocken.
  - Sie neckt Marko: „Du bist so langweilig, Mali.“
- **Eigene Grenzen:**
  - „Nicht an dieser Stelle.“
  - am Seilanker: „Frag nicht. Nicht jetzt. … Es gehört mir.“ Diese Stelle ist optional (`rooms/skela_d.js:95–97`).
- **Zurückhalten mit Grund:**
  - Die Seil-Erinnerung behält sie für sich, um Marko vor seiner Rechnung zu schützen (`rooms/vhof.js:38–41`). Marko benennt das: „Wie Großmutter.“
  - Ihr „Er ist gefahren.“ ist eine Teilwahrheit und wird zum Widerspruchsrätsel.
  - Ihr „Lass ihr ihren Mann.“ wird später zu „Sag es ihr. Auch ihr.“ (`97_k3_mala.js:72`)
- **Geklärtes hat Folgen:**
  - Nach „überlebt“ sucht Marko einen Menschen statt eines Ortes.
  - Nach dem Grab ist Mala „voll“. Sie hängt an keiner Leine mehr und bleibt freiwillig.
- **Uneinigkeit ohne Unvernunft:** ja.
  - „Das ist nicht fair.“ – „Nein. Aber es stimmt.“ (`rooms/herberge.js:92`)
  - „Ich frage nicht noch mal. Aber ich vergesse es nicht.“
- **Vertrauen wirkt aufs Handeln:**
  - am stärksten beim Kopfschütteln über den Fluss (A3 #152), gut beim Anruf von Nada (A2 #118);
  - an anderen Stellen nur als Kommentar (E-07).
- **Persönliche Momente jenseits der Aufgabe:** das Vatergespräch in der Freitagnacht (jetzt fragt sie, und er schweigt), der Springer, Dinos Sprung mit Malas Lachen und die Rückfahrt im Bus.
- **Bearbeitet oder vergessen:**
  - Der Konflikt vom Donnerstag wird bis zum Grab getragen und dort gelöst.
  - Dazwischen fehlt aber eine Reibung mit Folgen. Malas Wut auf den Fährmann steht nur im optionalen Anruf bei Vesna: „Ich war wütend. Das ist besser.“ (`97_k3_mala.js:130`)
  - Ihr „Ich lasse ihn kommen. Ob ich ihm verzeihe, weiß ich, wenn er da ist.“ (`rooms/vhof.js:57`) antwortet auf eine Weigerung, die im Spiel nie stattfindet. Die im Konzept vorgesehene Stufe „Den nicht“ fehlt (E-07).
- **Spielbare Veränderung:**
  - Am Grab und beim Kopfschütteln ist sie spielbar.
  - Den Zustand „frei“ erlebt der Spieler nur wenige Minuten. Die schönsten Zeilen dazu können nie erscheinen (`97_k3_mala.js:17, 42`; E-19).
- **Nicht allwissend:** Mala weiß, was sie sieht und spürt. Eine Ausnahme ist die Lichtprobe ohne Glocken-Nachhall (E-03).

### C.6 Kapitel 3 als Mittelstück

- **Lokaler Abschluss:**
  - Lanas Schicksal ist geklärt: der Tod, das Grab, der Antrag auf Exhumierung.
  - Die zwei Namen sind aufgelöst: „Er soll mich so finden.“
  - Die fehlende Meldung ist erklärt: „Nicht als Nachricht.“
  - Bato und Mate sind hinübergegangen, und Vlados Schweigen ist gebrochen.
  - Zlata hat ihr Versprechen gelöst, und Nada hat Gewissheit.
- **Fortschritt der Gesamtgeschichte:**
  - Malas Vergangenheit ist bewusst abgeschlossen.
  - Daraus folgt eine neue Lage: Mala ist an keinen Ort mehr gebunden. Das Band zu Marko beruht auf Zustimmung und kostet etwas.
  - Markos eigener Vermisster, sein Vater, wird zum offenen Fall.
- **Anschluss an Kapitel 4:** [Einschätzung] Er ist ursächlich und kommt aus der Handlung. Er ist nicht angeklebt. Dazu gehören:
  - die Blutprobe, mit der der Abgleich schneller geht;
  - die Mutter in München: „Achtzehn Jahre reden wir nicht über ihn.“;
  - „Ich komme zu Weihnachten.“;
  - Davors Karte;
  - das Schild „MÜNCHEN · subota“ aus der ersten Szene.
- **Zu früh beendet oder ohne Folgen?** [Einschätzung] Beides nicht.
  - Die gemeinsame Geschichte geht auf veränderter Grundlage weiter.
  - Für Mala selbst bleibt im Spiel aber wenig offen: das Begräbnis „in Wochen“ und die Kosten des Bandes, die nur optional vorkommen. Kapitel 4 braucht deshalb ein eigenes Anliegen Malas.
  - Offene Zusagen sind Ljerkas „Ich sage es Ihnen.“ (`97_k3_mala.js:187`) und Markos Versprechen an Ana aus Kapitel 2 (`rooms/pansion.js:66`). Eine Handlung für Kapitel 4 leite ich daraus nicht ab.

---

## D. Szenen- und Rätselprüfung

Die Rätselketten bewerte ich nach den fünf Fragen des Auftrags:
- **Ziel:** Weiß der Spieler, welches Problem er löst?
- **Hinweise:** Sind die nötigen Informationen vorher zugänglich?
- **Schluss:** Ergibt sich die Lösung daraus?
- **Rückmeldung:** Erkennt der Spieler, was er erreicht hat?
- **Belohnung:** Folgt eine neue Erkenntnis, eine Veränderung oder ein emotionaler Moment?

### D.1 Prolog, Donnerstag

**Spannung und Rhythmus** [beobachtet, A1]
- Neugier entsteht früh und konkret:
  - die Leine, die flussab zieht;
  - Nadas SMS mit dem einzelnen „N“ („Als könnte es eine andere sein.“);
  - das Schild „MÜNCHEN · subota“ (B21).
- Ab B10 steuert der Spieler frei.
- **Zwei Bremsen:**
  - Das Eintragen ins Gästebuch springt ohne Vorwarnung in den Abend (B103). Die Idee einer zweiten Peilung lässt sich am Donnerstag deshalb nicht mehr ausprobieren.
  - Das erste Schlüsselgespräch hat rund 31 Textfelder bis zur ersten Wahl [Code, B2]. Inhaltlich ist es stark, in der Form passiv.
- **Ruhephase:** Der Springer ist eine stille, spielbare Szene, in der Mala allein ist.

| Kette | Ziel | Hinweise | Schluss | Rückmeldung | Belohnung | Urteil |
|---|---|---|---|---|---|---|
| Ist das Malas Brücke? | klar: „Das kann man nachsehen.“ | Malas Splitter mit Stümpfen; das Widerlager | selbst: Widerlager ansehen, dann zwei Notizen verbinden | Fehlversuch wird abgewiesen | „Nicht die Alte Brücke“, daraus „Eine Richtung reicht nicht“ | fair, leicht, guter Einstieg ins Verbinden; die Postkarte von 1974 wiederholt den Schluss |

### D.2 Freitag, „Die Peilung“

**Spannung und Rhythmus**
- Der Freitag mischt Erkundung, Rätsel und Gespräch am besten [Einschätzung].
- Das Pendeln zwischen Ost- und Westufer stört kaum, weil die Reise über den Plan sofort geht (A1).
- **Stille Szenen, die tragen:**
  - der Bulevar ohne Musik;
  - die Mittagsglocken am Partisanenfriedhof: „Hier besucht keiner mehr jemanden.“ – „Doch. Wir.“
- Das Vatergespräch am Abend umfasst rund 18 Textfelder ohne Eingabe. Es ist aber eine starke Ruheszene.

| Kette | Ziel | Hinweise | Schluss | Rückmeldung | Belohnung | Urteil |
|---|---|---|---|---|---|---|
| Peilung von drei Standorten | klar, Marko formuliert es selbst (A1 B141) | sehr stark: Mala nennt beide Landmarken mit links und rechts. Maja und Marko nennen das Minarett, Marko erklärt den dritten Standort | vom Spiel vorgegeben | falsche Landmarke: Mala wiederholt ihre Angabe; die Fächer sind auf dem Blatt gut sichtbar | Bereich hinter dem Kartenrand | fair, aber zu leicht, „an der Grenze zur Klickarbeit“ (A1); E-06 |
| Mala über den Fluss | klar: „über etwas, das keine Brücke ist“ | Die Straßenbrücke erscheint zusammen mit dem Schluss | ein Klick | „Das ist eine Straße mit Geländer.“ | Der Friedhof wird erreichbar | ein Figurenmoment, als Rätsel geschenkt |
| Alte Karte und Skela | klar: „eine Karte, die weiter reicht“ | vier Figuren nennen Zdravko; die falsche Fährte über den Händler wird gut aufgefangen | durch Vorwegnahme entwertet (E-01) | Die Absage am Bett führt in die Irre (A1 B262) | „Skela heißt Fähre“ | die Kette ist gut, ihre Auflösung beschädigt |
| Vlado, E-Mail, Schublade | klar: Kata fragt „Welche?“ | Ljerkas Schlüssel, Malas Blick, „Typenschein“ | selbst erarbeitet | Antworten passen zur Figur, zum Beispiel: „Ein Schild? Das ist an die Kabine genietet.“ | Schlüssel 31 und Lanas Zeichnung; Kata: „Das bist du, Papa.“ | das beste Rätsel des Tages |

**Weitere Befunde**
- Die logischste Verbindung des Tages ist „Mit Vlado, dem Raucher“ mit Malas Splitter vom rauchenden Fahrer. Sie bekommt eine irreführende Antwort (A1 B172; E-04).
- „Kommen Sie in einer Stunde wieder.“ Dass dafür ein Ortswechsel reicht, sagt das Spiel nicht (A1 B235–243; E-12).

### D.3 Samstag, „Markttag“

**Spannung und Rhythmus**
- Der Morgen ist spielbar und hat die beste Wendung des Tages: Die Leine hängt an einer lebenden Frau.
- Der Nachmittag dagegen „läuft wie ein Film ab, und der Samstag endet ohne mein Zutun“ (A2) [beobachtet].
  - Am Bussteig kommen rund 27 Sätze am Stück (#103), im Haus Zelenika rund 37 (#117).
  - Zwei Wahlen später wechselt der Tag.
- Jela liefert in wenigen Zeilen alle Bausteine für Sonntag. Das liest sich wie eine Hinweisliste (A2).

| Kette | Ziel | Hinweise | Schluss | Rückmeldung | Belohnung | Urteil |
|---|---|---|---|---|---|---|
| Eierfrau | klar, Mala zeigt auf den Stand (#30) | „Unterschrieben mit Mala“ und „Ich habe ihr den Namen gegeben“; Markos Satz „Ich muss erst selbst verstehen, was der Name heißt.“ lenkt | selbst | falsche Ideen bekommen lenkende Antworten (Foto) | das fallende Ei; „Freunde kommen nicht nach siebzehn Jahren.“ | fair und belohnend, aber abhängig von der Reihenfolge (E-04) |
| Vlado, Teil 1 | durch die Sperre: „Vlado hat gesagt: Kommen Sie morgen. Das ist heute.“ | – | Gespräch, kein Rätsel | – | Zeiten, Name „Mala“, die Zeichnung „Za kasnije“ | starke Szene: „Er sieht auf seine Hände, als hätte er sie verlegt.“ |
| Bus aus München, Jela | durch die Sperre: „Mate wartet …“ | – | Szene läuft ab; eine Wahl, wahr oder geschönt | die Schonfassung wird enttarnt | Davor, Lena, Jelas Vorwurf | gute Wahl, sonst passiv (E-05) |
| Nacht in Skela | klar: „Ihr nach.“ – „Skela.“ | Glocke, Hütte, Anker | Nachhall durch Spüren | – | Bato, Zlata: „Sutra. Danju.“ | Atmosphäre stark; Bato wirkt wie ein offenes Rätsel, die Nacht endet mitten in den Versuchen (#174; E-12) |

**Orientierung:** Wo Vlados Werkstatt und Zdravkos Café liegen, steht am Samstag in keiner offenen Notiz. A2 hat beide Orte geraten (#77, #103; E-12).

### D.4 Sonntag, „Zwei Ufer“

**Spannung und Rhythmus**
- Emotional ist es der stärkste Tag. A3: „Der emotionale Bogen des Sonntags ist hervorragend gebaut.“
- Zugleich trägt er am meisten: die Hauptkette, zwei Geisterfälle und das zweite Schlüsselgespräch. Beide Geisterfälle enden am selben Tag. Das ist begründet: der Frost für die Feigen, Vlados Nachtfahrt. Es macht den Tag aber voll [Einschätzung].
- **Hänger** [beobachtet, A3]:
  - rund 55 Befehle an der Lichtprobe (#62–118);
  - 12 Befehle auf der Suche nach dem nächsten Ziel (#155–167);
  - 28 Befehle an den Briefen (#212–241);
  - 22 Befehle am Schlüssel (#264–286).
- **Leerlauf:**
  - viermal über die neue Brücke in Skela, ohne dass unterwegs etwas Neues kommt;
  - das Führerhaus noch einmal spüren bringt nur den alten Nachhall (#190–193).

| Kette | Ziel | Hinweise | Schluss | Rückmeldung | Belohnung | Urteil |
|---|---|---|---|---|---|---|
| Lichtprobe | klar, fast vorgesagt: „Jetzt muss Mala von drüben hinsehen.“ | Glocken-Nachhall, Zlatas „oben … in seiner Kammer“ | einfach; die Zusammenarbeit ist räumlich nötig | „Zu breit“, „Zu tief“ | Dachfenster, dann „dunkel, hell, dunkel“ | fair und elegant; ohne Glocken-Nachhall unlogisch (E-03) |
| Ordnen der Nacht, „Bato war wach“ | unklar, welcher Schritt fehlt | der Hinweis auf Vlados Zeiten fällt im Normalablauf weg | gesperrt durch einen technischen Zwischenschritt | Bato weist die richtigen Notizen ab | Batos Versprecher: „Er hat mitgezählt.“ (#144) | E-02 (P1) |
| Decke, „überlebt“ | klar: Mala sagt „Zeig sie mir.“ | Zlatas Decke und ihr Nachhall | selbst | – | „Ich war noch da, Marko. Nach dem Fluss war ich noch da.“ (#82) | fair; der stärkste Erkenntnismoment des Tages |
| Grab | offen | das Beet unter dem Quittenbaum | durch Ansehen | Zlata schweigt | „MALA · 15.1.1994“ (#101) | stark |
| Zlata die Wahrheit sagen | klar | – | eine Wahl: zwei Finger hoch, Mala schüttelt den Kopf | „Dann nicht. Heute nicht.“ | „Lass ihr ihren Mann.“ (#163) | die beste Umsetzung von „Mala fragen“ |
| Vlado, Teil 2, und die Botschaft | klar über das zweite Gespräch und Malas Bitte | Vlado fragt jeweils nach dem, was die nächste Notiz beantwortet | selbst | eigene Gründe für jede falsche Botschaft | Vlado fährt heute Nacht | sehr fair; der Satz aus dem Führerhaus wird über das Notizbuch abgewiesen (E-04) |
| Briefe | offen | Postkarten mit „Dragi dida“, Mates Briefe, das Kinderzimmer | mit Hinweisstufe 2 | Floskeln bei Fehlversuchen | „Eine Einladung, die sich nicht traut.“ (#245) | fair; A3 hatte das Kinderzimmer übersehen; Stufe 1 ist zu schwach (E-14) |
| Feigen, Lenas Anrede | klar | „So wollte er heißen“; Mate: „Das darf nur einer.“ | selbst | die Fassung aus dem Wörterbuch scheitert sichtbar | „Došli smo, dida.“ | sehr gut und passt zum Übersetzer |
| Schlüssel am Tor | klar | „Den Schlüssel bekam der Kleinste“ | Lenas Menü bietet die Lösung als fertigen Satz an (`rooms/zelenika.js:217`) | – | Die Hand geht durch ihre, der Schlüssel bleibt in seiner (#287) | starker Moment, aber ohne Denkschritt (E-06); A3 nahm Hinweise schon nach etwa sieben Versuchen |

### D.5 Finale, Sonntagnacht

- **Ziele:** An jeder Stelle klar, weil eine Figur sie ausspricht. Für ein Finale ist das angemessen (A4).
- **Handlungen des Spielers:**
  - ein Klick auf die Glocke, alle drei Schläge laufen ab (A4 #11);
  - die Gesprächsoption „Zlata. Bato war wach.“;
  - die Antwort am Grab;
  - das Seil in der Zwischenwelt. Dort löst selbst das „falsche“ Verb „Schiebe“ das Ziehen aus (A4 #51).
- [Einschätzung] Das Kapitel handelt vom Zählen und von Pausen, also davon, wie man läutet. Gerade dieses Motiv spielt der Spieler im Finale nicht selbst.
- **Erkenntnis und Übergang:** Batos Erkenntnis fällt in die automatische Glockenszene, sein Übergang kommt später in der Zwischenwelt. Die beiden Ereignisse sind also getrennt, die Erkenntnis ist aber gehetzt (A4: „Zu schnell“).
- **„Mali čeka“:** Hier erfährt Marko, dass Lana am Ende an ihn gedacht hat. Darauf folgt nur eine Erzählzeile, dann redet Zlata weiter (`rooms/skela_l.js:230–231`).
- **Der stärkste Augenblick** ist das Grab. Der Spieler fragt oder verspricht, und Mala entscheidet.

### D.6 Epilog, Montag

- **Stärken:**
  - Jeder Faden wird geschlossen, mit leisen Gegenbildern. Nada „sieht auf den leeren Platz neben mir“, und Mala sagt: „Sie hat hingesehen.“ Das antwortet auf das „Er sieht nicht hin.“ in Vratnik.
  - Das Formular ist die beste Entscheidung des Abschnitts (A4).
- **Schwächen:**
  - Die Nacht wird dreimal erzählt: von Zlata, von Marko an Nada und von Marko an Frau Kolar (A4, B2; E-05).
  - Das Ende ist abrupt. Auf die Busfahrt folgen die Schlusskarte und gleich das Titelbild (A4). Ob bei normaler Geschwindigkeit ein Abspann läuft, ist offen (H).

### D.7 Querschnitt: Zusammenarbeit von Marko und Mala

| Stelle | Warum Marko? | Warum Mala? | Was ändert der Wechsel? | Allein lösbar? | Urteil |
|---|---|---|---|---|---|
| Peilung | misst, zahlt, steigt aufs Minarett | die Leine gibt die Richtung | kein Wechsel nötig, alles im Gespräch | nein | Mala dient als Messgerät [Einschätzung] |
| Straßenbrücke | wählt den Ort | geht mit geschlossenen Augen | erzwungener kurzer Mala-Abschnitt | – | Figurenmoment, ein Klick |
| Schublade | übersetzt, kennt dadurch die Antwort auf „Welche?“ | sieht durch das Holz | Mala sieht, Marko weiß, Kata öffnet, beide erfahren Neues | nein | die beste Kooperation, mehrstufig |
| Eierfrau | fragt, verbindet | lauscht („Treću noć“) | liefert Hintergrund, für die Lösung nicht nötig (A2) | ja, Marko allein | schwach |
| Nacht in Skela | läutet, redet mit dem Nachbarn | sieht Batos Leine, spürt den Nachhall | Nachhall gibt es nur als Mala | nein | gut; „Spüre“ und „Lausche“ an allen zwölf Dingen laden aber zum Durchklicken ein (A2) |
| Lichtprobe | hält drüben das Licht | vergleicht von der Glocke aus | gleichzeitiges Handeln, räumlich zwingend | nein | sehr gut |
| Decke | bringt sie | liest den Nachhall | Übergabe | nein | gut |
| Kopfschütteln | fragt mit zwei Fingern | entscheidet | Zustimmung wird zur Handlung | – | sehr gut |
| Botschaft an Vlado | überbringt | kennt den Inhalt: „Mit etwas, das nur wir zwei hatten.“ | – | nein | gut |
| Mate | übersetzt, findet Lenas Satz | bringt ihn hinüber | Mala ist fast nur Kommentatorin (A3) | – | Mala unterfordert |
| Finale | läutet, spricht mit Zlata, zieht am Seil | steigt ein, redet mit Bato | Wechsel kommen meist automatisch | – | inszeniert |

[Einschätzung] Die beiden sind eigenständige Ermittler.
- **Arbeitsteilung:** Marko zieht die Schlüsse und übersetzt. Mala nimmt wahr und entscheidet über das, was ihr gehört. Keine Figur ist bloßes Werkzeug. Bei der Peilung kommt Mala dem aber nahe.
- **Künstliche Einschränkungen** gibt es kaum. Malas Weigerungen sind begründet: Brücken, „Nicht an dieser Stelle“.
- **Anders als in Kapitel 2:** Die Zusammenarbeit ist hier weniger mechanisch und mehr eine Frage der Zustimmung und der Entfernung. Kapitel 2 hatte vier Rätsel-Overlays und 30 Gegenstände, Kapitel 3 hat eins und neun (D.12). Das passt zur gewachsenen Beziehung, ist spielerisch aber weniger fordernd.
- **Malas Verben „Spüre“ und „Lausche“** liefern außerhalb der großen Szenen meist nur Stimmung (A1, A3).

### D.8 Notizbuch, Wissen und Schlussfolgerungen

- **Verständlich:**
  - Die Einträge stehen mit wörtlichen Zitaten und Sprecher da. Damit gelingt der Wiedereinstieg (A2, A3).
  - Widersprüche sind eigens markiert, zum Beispiel „Widerspruch: Zlata sagt, er hat geschlafen …“.
- **Mehrstufig:**
  - Ein gutes Beispiel für eine Vermutung, die erst geprüft werden muss: „In seiner Kammer hat jemand Licht gemacht. Das kann auch der Wind an der Lampe gewesen sein. Was sagt Bato?“ (`13_k3_notes.js:166`).
  - Andere erste Verbindungen liefern sofort die ganze Wahrheit, zum Beispiel „Skela heißt Fähre“.
- **Wissen sauber verteilt?** Nur zum Teil. Siehe E-01 und E-03.
  - Einige Notiztexte behaupten mehr, als geschehen ist. Ein Beispiel ist „Auf ‚Lana Delić‘ sagt sie ‚Ne‘“, auch wenn diese Frage nie gestellt wurde [Code, B1; E-13].
- **Logik blockiert:** Bei E-02 und am Tagesende des Freitags (E-01) hält eine rein technische Zwischenbestätigung die Lösung auf.
- **Lügen und Irrtümer** behandelt das Spiel nachvollziehbar. Das sind keine Kontinuitätsfehler:
  - Bato: „ein Mann, wie ein Soldat“;
  - Mate: „Die Busse sind so laut hier“;
  - Vlado: „Nie.“
- **Länge:**
  - Das Handbuch verspricht „Meist sind es nur drei bis fünf Einträge“ und „Was erledigt ist, verschwindet“ (`web/LIESMICH.txt:108–116`).
  - Beobachtet wurden 15 Einträge am Freitagabend (A1), 29 am Sonntagmorgen und 44 bis 45 in der Auswahl im Gespräch (A3) [beobachtet; E-11].

### D.9 Nebenfiguren, Dialoge und emotionale Wirkung

- **Eigenes Gewicht:**
  - **Zlata:** „Kaffee gibt es keinen. Fragen Sie.“ – „Der Dummkopf.“ – „Ali dunju zadržavam.“
  - **Vlado und Kata:** „Weil mich keiner gefragt hat.“ – „Ich dachte, du hast Streit mit Mama.“
  - **Jela:** „Sad je došao. Kad treba prodavat.“
  - **Nada:** „Ins Gesicht.“ – „Mütter warten nicht gern, Mali. Wir können es nur.“
  - **Mate:** „Auf den Postkarten ist sie immer so klein.“
  - **Davor:** „Ich hatte es vergessen. Meine Hände nicht.“
  - **Lena:** „Ich war ja nie da.“
  - **Frau Kolar:** „Wir sind keine Richter. Wir zählen.“
  - **Dino, Maja:** mehr als Auskunftsstellen.
- **Stimmen:**
  - Gut zu unterscheiden sind Jela, Zlata, Vlado, Lena, Dino und Kata.
  - Die kleinen Rollen am Ostufer teilen denselben geschliffenen Pointenton. Einzeln ist jede Zeile stark, zusammen klingen sie nach einem Autor (A1, B2) [Einschätzung; E-23].
- **Erklärung statt Gespräch:**
  - Davor erzählt einem Fremden am Bussteig alles auf einmal.
  - Jela liefert eine Hinweisliste.
  - Marko hält einen Vortrag über Winkel: „Je weiter die Standorte auseinander liegen …“
  - Mala deutet, was die Szene schon zeigt, etwa „Er hat seinen Sohn gesehen. Sich selbst noch nicht.“ (`rooms/zelenika.js:121`).
- **Fortschritt:** Gespräche über Notizen reagieren auf neue Erkenntnisse. Am besten gelingt das bei Vlado, Teil 2, und bei Batos Versprecher.
- **Spieleranteil:** In Menüs mit acht bis zehn einmaligen Themen klickt man durch (Dino, Maja, Mate). Bei Vlado fragt man dagegen gezielt [Code, B2].
- **Ökonomie:**
  - „Den Schlüssel bekam der Kleinste“ steht neunmal im Haus Zelenika, „Sutra. Danju.“ mindestens sechsmal.
  - Die Nacht wird im Epilog mehrfach nacherzählt (E-18, E-05).
- **Subtext:**
  - Stark wirkt er über Dinge: das Ei, die nie angezündete Zigarette, die eingekreisten Fünfzehnten im Kalender, „Er hat nicht suchen müssen.“
  - Geschwächt wird er, wenn Mala ausdeutet.
- **Tod und Abschied:**
  - Mate begreift über eine Handlung und geht über Sprache und Humor.
  - Bato begreift über die Schuld und geht über gemeinsame Arbeit („Bei Hochwasser braucht es zwei.“).
  - Inhaltlich sind die beiden Fälle verschieden. Den Rahmen teilen sie aber:
    - „Sie sind tot“ weichen beide über Lärm aus;
    - bei beiden folgt auf „Marko. Nimm meine Hand.“ die Antwort „Wieder bis an den Rand?“ [Code, B2].

### D.10 Wiederkehr, Leerlauf und Abwechslung

- **Besuche, die die Bedeutung eines Ortes ändern** [beobachtet]:
  - **Alte Brücke:** Am Donnerstag ist sie „nicht ihre“, am Montag geht Mala bis ganz hinauf und lacht.
  - **Skela:** erst Glocke und Stümpfe in der Nacht, dann zwei Ufer bei Tag, dann die Fähre und schließlich das Grab mit Nada.
  - **Vulkanizer:** erst Leugnen, dann Geständnis, dann Teil 2 und am Ende die Abfahrt.
  - **Ostbusbahnhof:** erst die Ankunft, dann Nadas Ankunft und zuletzt die Abfahrt ohne angezogene Knie.
  - **Terrasse:** erst das Versprechen, dann der Vater und im Epilog das Gästebuch mit „28.11.“.
- **Wege ohne neuen Inhalt:**
  - das Pendeln am Freitag (gering, weil die Reise sofort geht);
  - viermal über die neue Brücke in Skela (A3);
  - Malas Standardfragen, die in jedem Menü stehen und sich abnutzen (A1).
- **Abwechslung der Fälle:**
  - Lanas Spur nutzt Messen, Karten, Übersetzen und Licht.
  - Mates Fall nutzt Briefe, Feigen und eine Anrede.
  - Batos Fall nutzt Leugnen, Versprecher und die Fähre.
  - Die Erlebnisse sind also verschieden. Gleich sind nur die Formeln an der Schwelle zur Zwischenwelt (D.9).

### D.11 Technische Zustände und Komfortfunktionen

- **Zustände** [Code, B1]: Es gibt keine Sackgasse, und Rückwege sind vorhanden:
  - der Verlustzweig auf der Tepa;
  - der Vulkanizer öffnet nach zwei Ortswechseln wieder;
  - der Übergang über die Straßenbrücke lässt sich abbrechen;
  - Wiederaufnahme im Finale.
- **Doppelte Szenen:** keine beobachtet.
- **Laden:** Spielstände luden an jedem Abschnittsanfang korrekt (A2 bis A4) [beobachtet]. Speichern und Laden mitten in Szenen wurde nicht systematisch geprüft (H).
- **Stadtplan:**
  - Er verrät Skela, bevor der Name bekannt ist (E-01).
  - „Erreichbar“ und tatsächlich erlaubte Reise stimmen nicht immer überein (E-15).
  - Sonst zeigt er nur bekannte Orte und prüft beim Reisen dasselbe wie das Spiel (`17_map.js:71, 116–118`) [Code].
- **Hinweise:**
  - Sie sind freiwillig, und das Menü zeigt nur offene Themen (A3 #160) [beobachtet].
  - Sie lösen keinen Rätselzustand automatisch [Code, `15_hints.js`].
  - Schwächen: Stufe 1 ist zum Teil zu schwach, ein Titel verrät etwas, und Mala spricht über sich in der dritten Person (E-14).
- **Doppelklick-Ausgänge:** Die Konsole hat sie nicht geprüft (H).
- **Lesbarkeit:** E-09. Die Nacht in Skela ist sehr dunkel (A2 bild_011). A4 fand die Nachtszenen dagegen gut lesbar.
- **Sprecher:** E-08.
- **Gegenstände:** E-16.

### D.12 Umfang im Vergleich mit Kapitel 2

Alle Zahlen stammen aus demselben Zählskript.

| Messgröße | Kapitel 1 | Kapitel 2 | Kapitel 3 |
|---|---:|---:|---:|
| Räume | 18 | 18 | 22 |
| gesprochene und erzählte Zeilen | 1731 | 2098 | 3048 |
| davon Erzählung | 41 | 106 | 297 |
| davon Mala | 338 | 446 | 758 |
| Wörter | 27 371 | 37 834 | 48 383 |
| Gesprächsoptionen | 266 | 312 | 333 |
| antippbare Dinge | 252 | 287 | 236 |
| Gegenstände | 28 | 30 | 9 |
| Notizen | 112 | 101 | 96 |
| Schlussfolgerungen | 13 | 24 | 23 |
| Rätsel-Overlays, Ordnen | 1 / 0 | 4 / 1 | 1 / 1 |
| Erinnerungsszenen | 8 | 23 | 18 |
| Hinweisthemen, je vier Stufen | 76 | 51 | 86 |

[Einschätzung]
- **Gewachsen ist der Text:**
  - Kapitel 3 hat rund 45 % mehr Zeilen und 28 % mehr Wörter als Kapitel 2.
  - Die Zahl der erzählten Zeilen hat sich fast verdreifacht.
- **Nicht gewachsen sind die Spielerhandlungen:**
  - Es gibt weniger antippbare Dinge als in Kapitel 2 und nur neun statt 30 Gegenstände.
  - Gleich geblieben sind die Schlussfolgerungen (23 statt 24) und, fast, die Gesprächsoptionen.
- **Eigene Identität:** Kapitel 3 hat sie, mit zwei Ufern, Fähre und Glocke, Übersetzen als Dramaturgie und Zustimmung als Thema.
- **Verzahnung:** Lanas Spur läuft durch alle Tage.
- **Bilanz:** Mehr Inhalt bedeutet hier vor allem mehr Lesen. Ein zusätzlicher Dialog vertieft oft, wiederholt aber auch oft (D.9).
- **Spielzeit:** Eine Spielzeit nenne ich nicht. Die vier Abschnitte liefen parallel und mit beschleunigter Spielzeit. Daraus lässt sich keine Erstspieler-Spielzeit ableiten.

---

## E. Priorisierte Befunde

Einen blockierenden Befund (P0) habe ich nicht gefunden. Jeder Tag endet nach seinen Pflichtschritten, und alle vier Abschnitte wurden regulär abgeschlossen [beobachtet, Code].

| ID | Titel | Priorität | Prüfstatus |
|---|---|---|---|
| E-01 | Skela wird vorweggenommen, das Tagesende verlangt den Schluss trotzdem | P1 | beobachtet, Code |
| E-02 | „Bato war wach“ hängt an einem technischen Zwischenschritt, dessen Hinweis wegfällt | P1 | beobachtet, Code |
| E-03 | Figuren wissen bei freier Reihenfolge zu viel | P2 | Code, teils beobachtet |
| E-04 | Richtige Ideen werden abgewiesen oder irreführend beantwortet | P2 | Code, teils beobachtet |
| E-05 | Schlüsselszenen laufen ohne Spieler | P2 | beobachtet, Code, Einschätzung |
| E-06 | Das Spiel spricht Denkschritte selbst aus | P2 | beobachtet, Code, Einschätzung |
| E-07 | „Mala fragen“ widerspricht sich und bleibt folgenlos, Malas Kante fehlt | P2 | Code, Einschätzung |
| E-08 | Falsche Sprecherzuordnung | P2 | beobachtet, Code |
| E-09 | Abgeschnittene Texte, „?“ statt Kästchen, Überlauf | P2 | beobachtet |
| E-10 | Widersprüchliche Kernfakten | P2 | beobachtet, Code |
| E-11 | Notizbuch im Gespräch zu lang und unruhig | P2 | beobachtet, Code |
| E-12 bis E-24 | Feinschliff | P3 | siehe Tabelle |

### E-01 · Skela wird vorweggenommen, das Tagesende verlangt den Schluss trotzdem (P1)

- **Ort:** Freitag. Stadtplan, Café Zdravko (alte Karte), Vulkanizer (Vlado), Bett.
- **Prüfstatus:** beobachtet (A1) und im Code nachvollzogen.
- **Voraussetzungen:**
  - Die dritte Peilung ist gemessen. Die Notiz zum Bereich hinter dem Kartenrand liegt vor (`l3_area`).
  - Die Verbindung mit der alten Karte ist noch nicht gezogen.
  - Vlado ist über Taxi, Mate oder Ljerka bekannt.
- **Beleg:**
  1. **Stadtplan:**
     - Sobald `l3_area` vorliegt, gilt Skela als bekannt (`96_k3_story.js:88`). Der Plan zeichnet bekannte, gesperrte Orte mit ihrem Namen und einem Schloss (`17_map.js:71, 163`).
     - Die Beschriftung des Ortes lautet dann: „Skela: Irgendwo da unten, hinter dem Rand meines Plans. Ohne Namen finde ich dort nichts.“ (`17_map.js:150`)
     - A1 öffnete den Plan direkt nach dem Schluss (B197), noch vor dem Café. Die Konsole meldete Skela als bekannten, gesperrten Ort.
  2. **Café:** Beim Lesen der alten Karte sagt Marko „Skela.“ (A1 B213; `97_k3_peil.js:105–107`). Die Notiz „Skela heißt Fähre“ entsteht aber erst durch die Verbindung zweier Notizen (`13_k3_notes.js:157`).
  3. **Vlado:**
     - Die Option „Im Januar vierundneunzig. Von Split nach Skela. Ein Mädchen, siebzehn.“ prüft nur, ob Vlado schon geleugnet hat (`rooms/vulkanizer.js:41`).
     - A1 hat sie gewählt (B228), bevor „Skela heißt Fähre“ vorlag.
  4. **Bett:** „Am hellen Tag? Die Leine zeigt irgendwohin, und ich weiß noch nicht, wohin.“ (`96_k3_story.js:204`; A1 B262). Das kommt, nachdem Marko „Skela.“ schon gesagt hat.
- **Problem:**
  - Das Ergebnis der Hauptkette des Freitags sagt das Spiel dreimal, bevor der Spieler es erschließt.
  - Danach verlangt es die förmliche Verbindung trotzdem. Die Absage begründet es mit einem Nichtwissen, das Marko sichtbar nicht hat.
- **Spielerwirkung:**
  - Der Erkenntnismoment der Peilung geht verloren. A1 nennt ihn „abgeschwächt … nur ein Wort, trocken“.
  - Marko spricht Wissen aus, das er nicht haben kann.
  - Das Tagesende wird zum Raten (A1: rund fünf Befehle, „die Bett-Absage führt in die Irre“).
- **Empfehlung:**
  - **Stadtplan:** Im gesperrten Zustand keinen Namen zeigen, sondern nur „Hinter dem Kartenrand“, bis „Skela heißt Fähre“ vorliegt.
  - **Vlado:** Ohne die Skela-Notiz heißt die Zeile „Von Split hierher. Ein Mädchen, siebzehn.“
  - **Bett:** Die Absage hängt vom Stand ab. Liegen Bereich und alte Karte vor, aber noch kein Schluss: „Ich habe den Bereich und die alte Karte. Ich habe sie noch nicht nebeneinandergelegt.“
  - **Café**, zwei Möglichkeiten:
    - die kleine Reparatur: Das Lesen der Karte zieht den Schluss gleich selbst;
    - die bessere Lösung: Die Verbindung bekommt einen eigenen Sinn (F2 b).
- **Abnahme:**
  - Spielt man erst die drei Peilungen, dann Vlado und zuletzt das Café, erscheint das Wort „Skela“ vor dem Schluss nirgends: nicht auf dem Plan, nicht im Gespräch, nicht in einer Auswahl.
  - Nach dem Lesen der Karte gilt eines von zwei Dingen. Entweder ist der Schluss gezogen, oder die Absage am Bett nennt den fehlenden Schritt.
  - Ein neuer blinder Tester nennt Skela als eigene Schlussfolgerung.

### E-02 · „Bato war wach“ hängt an einem technischen Zwischenschritt, dessen Hinweis wegfällt (P1)

- **Ort:** Sonntag in Skela. Die Kette geht von der Lichtprobe über die Glocke (als Mala) und „Die Nacht ordnen“ zu Bato und „Bato war wach“.
- **Prüfstatus:** beobachtet (A3) und im Code nachvollzogen.
- **Voraussetzungen:**
  - Die Lichtprobe ist gemacht: Notiz „Das Dachfenster“, also Batos Kammer.
  - Mala hat die Glocke noch einmal gespürt: Notiz „Dunkel, hell, dunkel“.
  - Marko steht am anderen Ufer, wo er für die Lichtprobe stehen muss.
- **Beleg:**
  - **Der verlorene Hinweis:**
    - Den Hinweis auf Vlados Zeiten spricht nur Marko, und nur wenn er an der Glocke steht: „Dann lege ich das neben Vlados Zeiten. Der Reihe nach.“
    - Sonst sagt Mala: „Das muss ich Marko sagen. Er zählt so gern.“ (`rooms/skela_d.js:90–91`)
    - Eine Szene, in der sie es ihm dann sagt, gibt es nicht [Code; die Zeile kommt nur dort vor].
  - **Was A3 erlebte:**
    - A3 bekam genau diese Zeile (#59) und hing danach rund 55 Befehle fest (#62–118).
    - Bato antwortete auf „Dunkel, hell, dunkel“: „Was zählen Sie da? Läuten, Licht, Läuten? Gehen Sie schlafen.“ Auf das Dachfenster: „Meine Kammer. Was ist mit meiner Kammer?“ (`rooms/skela_l.js:88`)
    - Erst Hinweisstufe 1, „Läuten, Licht, Läuten. Und davor Vlados Zeiten.“, löste das Problem (#120–123).
  - **Der versteckte Auslöser:** Das Ordnen öffnet sich nur auf zwei Wegen (`13_k3_notes.js:176–179`, `rooms/zlata_k.js:12–19`):
    - über die Verbindung mit Vlados Zeiten, also über zwei Notizgruppen hinweg;
    - an Zlatas Tisch.
  - **Kein neuer Inhalt:** Das Ergebnis lautet: Zwischen dem ersten und dem dritten Läuten war Licht in Batos Kammer. Genau das sagen das Dachfenster und die Lichtfolge schon. Trotzdem löst erst diese Notiz Batos Versprecher aus (`rooms/skela_l.js:64–68, 82`).
- **Problem:**
  - Nach zwei Notizen hat der Spieler die logische Lösung: In Batos Kammer war Licht, während sie läutete, also war Bato wach.
  - Das Spiel sperrt sie bis zu einem dritten, technisch begründeten Schritt, und dessen einziger Hinweis fällt im Normalablauf weg.
  - Vlados Zeiten fügen nur hinzu, dass das Licht nicht von Vlado kam. Das ist ein schwacher Grund für einen Pflichtschritt.
- **Spielerwirkung:**
  - Es ist der längste beobachtete Hänger des ganzen Durchgangs, und er liegt in der Hauptkette des Sonntags.
  - Wer die richtige Idee hat, wird von Bato abgewiesen („Gehen Sie schlafen“) und hält seine Idee für falsch.
- **Empfehlung:**
  - Bato reagiert schon auf Dachfenster und Lichtfolge zusammen. Marko sagt: „In Ihrer Kammer war Licht. Während sie geläutet hat.“ Darauf folgt der vorhandene Versprecher.
  - Liegt nur eine der beiden Notizen vor, fragt Bato zurück: „Licht? Wann soll das gewesen sein?“
  - Das Ordnen bekommt eine echte Aufgabe (F2 c) oder wird freiwillig.
  - Mindestens aber muss der Hinweis sicher ankommen. Mala sagt ihn Marko beim nächsten Zusammentreffen.
- **Abnahme:**
  - Ein neuer blinder Test des Sonntags verbindet die Lichtbeobachtung ohne Hinweis mit Bato.
  - Zwischen „Dunkel, hell, dunkel“ und Batos Versprecher liegen wenige Handlungen.
  - Kein Zustand weist eine vollständige Begründung ab, ohne den fehlenden Teil zu benennen.

### E-03 · Figuren wissen bei freier Reihenfolge zu viel (P2, gemeinsame Ursache)

- **Ort:** mehrere Szenen, eine Ursache. Zeilen setzen Erkenntnisse voraus, prüfen sie aber nicht.
- **Prüfstatus:** im Code nachvollzogen; die markierten Stellen wurden beobachtet.
- **Voraussetzungen:** Der Spieler wählt eine andere Reihenfolge als der Lösungsweg oder lässt optionale Gespräche aus.
- **Beleg:**
  - **Dinos Rollerfahrt:** „(Von einem Fährmann erzählen, der nicht kam.)“ Dazu der Text: „Ich erzähle von einer Glocke an einem Fluss und von einem Licht in einem Fenster, das wieder ausging.“
    - Die Option hat keine Bedingung (`rooms/starimost.js:98–100`).
    - Die erste Fahrt ist frühestens in der zweiten Nacht möglich, also vor jeder Glocken- und Lichterinnerung [Code, B1].
  - **„Am Morgen, im Schilf“** in drei tragenden Szenen (`rooms/vulkanizer.js:155`, `rooms/zlata_k.js:52`, `rooms/vermisst.js:20`):
    - Die Quelle wären Zlatas Hühnerfrage oder „Sie hat noch gelebt“. Beides ist optional.
    - Die Notiz „Sie hat den Fluss überlebt“ nennt weder Morgen noch Schilf (`13_k3_notes.js:48`).
  - **Lichtprobe ohne Glocken-Nachhall:**
    - Hält Marko das Handy ans Haus, startet die Probe ohne Bedingung (`rooms/skela_l.js:104–113, 360, 395`).
    - Mala erkennt das Dachfenster dann mit einer Erinnerung, die sie noch nicht hat (`rooms/skela_d.js:101–105`).
  - **Zweites Gespräch:** „Seit gestern Nacht. Am Anker.“ (`rooms/vhof.js:38`), auch ohne den optionalen Nachhall am Anker.
  - **Weitere Stellen:**
    - „Das ist Davor, oder?“ ohne vorherigen Namen [beobachtet, A2 #103].
    - Kata nach Vlados Geständnis: „Ich will das hören. Aber von ihm.“ [beobachtet, A2 #86; `rooms/vulkanizer.js:233`].
    - Ljerka am Freitagmorgen: „Ich habe den ganzen Nachmittag nachgedacht.“ [beobachtet, A1 B147; `97_k3_mala.js:172`].
    - „Der Springer. Hast du ihm zugesehen?“ Mala war allein dort [beobachtet, A1 B137].
    - Mala sagt mittags im Prolog „Hier hast du es aufgeschrieben.“, aber aufgeschrieben wird erst am Abend (`rooms/herberge.js:155`).
- **Problem:** Figuren wissen Dinge, die sie nicht wissen können. Auf manchen Wegen verliert dadurch eine Hauptkette ihre Logik, nämlich die Lichtprobe.
- **Spielerwirkung:**
  - Der Spieler legt Marko Wissen in den Mund oder bekommt es vorweg verraten.
  - Optionale Gespräche verlieren ihren Sinn, etwa die Hühnerfrage.
- **Empfehlung:**
  - Jede solche Zeile an ihre Quellnotiz binden oder neutral fassen.
    - **Dino:** nur mit „Dunkel, hell, dunkel“, sonst eine andere Geschichte.
    - **Schilf:** sonst nur „Eine Frau hat sie gefunden. Sie hat noch gelebt.“
    - **Lichtprobe:** ohne Glocken-Nachhall sagt Mala: „Ich weiß nicht, ob damals eins brannte. Ich muss erst an die Glocke.“
    - **Anker:** die Zeile an den Nachhall am Anker binden.
  - Dazu ein automatischer Test, der für jede Faktenzeile die nötigen Notizen prüft.
- **Abnahme:** In Läufen mit den abweichenden Reihenfolgen spricht niemand eine unbekannte Tatsache aus:
  - Sanja auslassen;
  - die Hühnerfrage auslassen;
  - Anker und Glocke in der zweiten Nacht auslassen;
  - Vlado vor dem Café besuchen;
  - mit dem Roller fahren.

### E-04 · Richtige Ideen werden abgewiesen oder irreführend beantwortet (P2)

- **Ort:** Notizbuch und Gespräche.
- **Prüfstatus:** im Code nachvollzogen. Die Versuche selbst wurden beobachtet (A1 B172, A2 #42). Die Antworttexte bei falschen Verbindungen zeigte die Konsole nicht an (A.5).
- **Beleg:**
  - **Der Satz aus dem Führerhaus:** Zeigt man Vlado am Samstag oder Sonntag die Notiz „Sie hat ihn gezeichnet“ über „Nach etwas aus dem Notizbuch fragen“, antwortet er „Das weiß ich nicht mehr.“ oder „Das sagt mir nichts.“ (`rooms/vulkanizer.js:75–83, 118–122`). Am Freitag reagierte er darauf noch deutlich (`rooms/vulkanizer.js:55`).
  - **Fallübergreifende Fehlversuche:**
    - Sie bekommen Sätze aus einem Topf (`13_k3_notes.js:191, 196–199`): „Mit Mala hat das nichts zu tun. Oder ich will es nicht sehen.“ und „Ich suche überall nach ihr. Hier ist sie nicht.“
    - Das gilt in einem Kapitel, in dem fast jede Notiz von ihr handelt.
    - Auch das logischste Paar des Freitags bekommt so eine Antwort: Ljerkas „Vlado, der Raucher“ mit Malas rauchendem Fahrer (A1 B172).
  - **Eierfrau:**
    - Auf „Ich habe ihr den Namen gegeben“ kommt nur „Jaja? Orasi?“ (A2 #42).
    - Hinweisstufen 3 und 4 nennen Notizen, die dem Spieler fehlen können, wenn er Sanja am Freitag nicht angerufen hat (`15_hints_k3.js:152–156`) [Code, B1].
  - **Zlata:** Auf Vlados Zeichnung reagiert sie gar nicht [Code, B1].
- **Problem:** Die richtige Notiz wird auf dem naheliegenden zweiten Weg abgewiesen. Falsche Verbindungen bekommen Sätze, die eine falsche Richtung behaupten.
- **Spielerwirkung:** Der Spieler verwirft richtige Lösungen und lernt, den Rückmeldungen zu misstrauen.
- **Empfehlung:**
  - **Satz aus dem Führerhaus** am Samstag und Sonntag:
    - vor dem zweiten Gespräch so wie am Freitag;
    - danach direkt zur Botschaft.
  - **Der Topf mit Fehlversuchen** bekommt neutrale Sätze, etwa „Das gehört zur selben Geschichte. Aber nicht an dieselbe Stelle.“
  - **Das Raucher-Paar** bekommt eine eigene Antwort: „Ljerkas Vlado raucht. Malas Fahrer hat geraucht. Das beweist nichts. Aber es ist eine Spur.“
  - **Eierfrau:**
    - Die Hinweise verzweigen nach dem Notizstand.
    - Auf „Ich habe ihr den Namen gegeben“ antwortet ein Denkanstoß: „Den Namen habe ich ihr gegeben. Aber wer hier kennt ihn?“
- **Abnahme:**
  - Jedes genannte Paar bekommt eine Antwort, die zur Lage passt.
  - Kein Fehlversuch behauptet bei Notizen über Lana, es habe „nichts mit Mala zu tun“.

### E-05 · Schlüsselszenen laufen ohne Spieler (P2)

- **Ort:** erstes und zweites Schlüsselgespräch, Samstagnachmittag, Glocke und Fähre, Zlatas Erzählung, Epilog.
- **Prüfstatus:** beobachtet (A2, A4) und im Code gezählt (B2). Die Bewertung ist gestalterisch.
- **Beleg:**
  - **Textfelder am Stück** [Code, B2]:
    - erstes Gespräch rund 31;
    - Vatergespräch rund 18;
    - Haus Zelenika am Samstag rund 32;
    - Vlado, Teil 2, rund 19;
    - zweites Gespräch rund 35;
    - Glocke, Fähre und Bato nach einem Klick rund 33;
    - linkes Ufer bis zu Zlatas Frage rund 34;
    - Küche rund 20 und Amt rund 17, jeweils ohne Eingabe.
  - **Der Samstag endet ohne eigenes Zutun** [beobachtet, A2].
  - **Die Glocke ist ein Klick** [beobachtet, A4 #11].
  - **Im Epilog wird die Nacht dreimal erzählt** [beobachtet, A4].
  - **„Mali čeka“** geht mit einer Erzählzeile vorbei (`rooms/skela_l.js:230–231`).
- **Problem:** Die Ermittlung ist in kleinen Schritten spielbar. Beziehung und Höhepunkt sind dagegen Zwischensequenzen mit einer einzigen Wahl am Ende, und die färbt nur Zeilen.
- **Spielerwirkung:**
  - Den Höhepunkt erarbeitet nicht die Hand des Spielers.
  - Die stärksten Momente vergehen schnell, und der Epilog wirkt lang.
- **Empfehlung:** siehe F3. Dazu gehören:
  - die Glocke im Takt des Spielers;
  - eine Haltungswahl in beiden Schlüsselgesprächen;
  - eine Pause bei „Mali čeka“;
  - im Amt erzählt Nada statt Marko;
  - die Nacherzählungen kürzen.
- **Abnahme:**
  - Keine Pflichtszene hat mehr als etwa 15 Textfelder ohne Eingabe.
  - Jeden Glockenschlag löst der Spieler aus.
  - Im Epilog wird die Nacht höchstens einmal ganz erzählt.

### E-06 · Das Spiel spricht Denkschritte selbst aus (P2)

- **Ort:** Peilung, Lichtprobe, Schlüssel am Tor, Reaktionen nach Schlussfolgerungen.
- **Prüfstatus:** beobachtet (A1, A3) und im Code nachvollzogen. Die Bewertung ist gestalterisch.
- **Beleg:**
  - **Peilung, Landmarken:** Mala nennt beide Landmarken nach dem Muster „Zwischen X und Y. X links, Y rechts.“ (`97_k3_peil.js:22–27, 78`).
  - **Peilung, Standorte:** Marko erklärt Winkel und dritten Standort selbst (`96_k3_story.js:269–272`; A1 B141, B173).
  - **Peilungsblatt:** Es zeigt den Schnitt auf dem Blatt, obwohl der Text „hinter dem Rand“ sagt (A1 bild_026).
  - **Lichtprobe:** „Jetzt muss Mala von drüben hinsehen.“ (`rooms/skela_l.js:112`)
  - **Schlüssel am Tor:** Lenas Menü bietet die Lösung als fertigen Satz an (`rooms/zelenika.js:217`).
  - **Doppelte Sätze:** Schlüsse werden zweimal ausgesprochen, einmal im Notizbuch und einmal in der Reaktion danach (`13_k3_notes.js:161` und `96_k3_story.js:277`).
- **Problem:** Selbst erarbeitete Erkenntnisse sind selten. Die Rätsel sind fair, aber meist Ausführung.
- **Spielerwirkung:** A1 beschreibt die Peilung als „fair, zu leicht, an der Grenze zur Klickarbeit“. Marko wirkt wie das Sprachrohr des Autors.
- **Empfehlung:** siehe F2.
- **Abnahme:**
  - Neue blinde Tester wählen den dritten Standort und deuten die alte Karte selbst.
  - Die Zahl der Stellen, an denen eine Figur die nächste Handlung ansagt, sinkt. Das wird vorher und nachher gezählt.

### E-07 · „Mala fragen“ widerspricht sich und bleibt folgenlos, Malas Kante fehlt (P2)

- **Ort:** alle Stellen mit „(Mala fragen.)“, der Sonntag und das zweite Gespräch.
- **Prüfstatus:** im Code nachvollzogen. Die Bewertung ist gestalterisch.
- **Beleg:**
  - **Die Rüge:**
    - Sie steigert sich über alle Stellen hinweg, ohne den Anlass zu prüfen (`96_k3_story.js:165–169`).
    - Die Zähler werden nur für Kapitel 4 gespeichert (`96_k3_story.js:302`).
  - **Rügen, wo Marko richtig handelt:**
    - **Formular:** Mala bittet „Schreib, was ich war.“ (`rooms/vermisst.js:14`). Gerügt wird trotzdem, wenn Marko einen eigenen Satz schreibt (`rooms/vermisst.js:39`).
    - **Blutprobe:** Mala sagt „Das frage ich dich nicht. Das ist dein Vater.“ (`rooms/vermisst.js:15`). Gerügt wird trotzdem (`rooms/vermisst.js:71`).
    - **Botschaft an Vlado:** Den Auftrag gab Mala selbst (`rooms/vhof.js:56`). Gerügt wird trotzdem (`rooms/vulkanizer.js:200`).
  - **Wo die Frage fehlt:** Wo Marko Lanas intimste Geschichte weitergibt, kann er Mala gar nicht fragen. Das betrifft Vlado, Teil 2 (`rooms/vulkanizer.js:142–161`), und Bato (`rooms/skela_l.js:59`).
  - **Malas fehlende Kante:**
    - Ihre Weigerung gegenüber dem Fährmann wird beantwortet, ohne je stattzufinden (`rooms/vhof.js:55–58`).
    - Die Konzeptstufe „Den nicht“ ist nicht umgesetzt (`KAPITEL3_KONZEPT.md:738`).
    - Die Grenze am Seil ist optional (`rooms/skela_d.js:92–97`).
- **Problem:** Das Thema des Kapitels heißt „Wem gehört ein Tod?“, also Zustimmung. Die Mechanik dazu bestraft manchmal das richtige Verhalten und hat im Kapitel keine Folge.
- **Spielerwirkung:**
  - Der Spieler lernt, dass die Option ein Ritual ist und keine Entscheidung.
  - In der Mitte hat Mala keine Reibung mit Folgen.
- **Empfehlung:** siehe F1.
- **Abnahme:**
  - Keine Rüge, wenn Marko nach Malas erklärtem Willen handelt.
  - An mindestens einer Pflichtstelle ändert das Fragen den Inhalt.
  - Auf jedem Weg verweigert sich Mala einmal vor dem zweiten Gespräch, und Marko nimmt das an.

### E-08 · Falsche Sprecherzuordnung (P2)

- **Ort:** Gespräche, in die Mala hineinspricht, und Auswahlen nach einem automatischen Figurwechsel.
- **Prüfstatus:** beobachtet und im Code nachvollzogen.
- **Voraussetzungen:** Mala spricht in einem Gespräch, danach folgt eine Standardantwort auf eine Notizbuchfrage. Oder: Das Spiel wechselt in einer Szene zu Mala, danach wird eine Zeile Markos gewählt.
- **Beleg:**
  - **Kioskfrau** (A1 B25, B27): „Mala: Das steht in keiner Zeitung, die ich habe.“
  - **Maja** (A1 B109): „Mala: Da fragen Sie die Falsche. Ich kenne Betten und Australier.“ Dazu zeigt A1 bild_015 das Menü mit Malas Porträt.
  - **Eierfrau** (A2 #42): „Mala: Jaja? Orasi?“
  - **Zwischenwelt** (A4 #43): „Mala: Wieder bis an den Rand?“, obwohl das Markos Frage ist.
  - **Ursache** [Code]:
    - `05_engine.js:198` setzt den Gesprächspartner auf jeden Sprecher außer der gespielten Figur, also auch auf Mala.
    - Einfache Antworten aus dem Notizbuch (`05_engine.js:327–328`) und Texte beim Geben (`05_engine.js:396–401`) spricht dann dieser Partner.
    - Gewählte Zeilen spricht immer die gerade gespielte Figur (`05_engine.js:207`).
    - Malas Porträt über „Und dann? / (Sie lassen.)“ (A2 bild_006) hat womöglich dieselbe Ursache [Verdacht].
- **Problem:** Antworten landen bei der falschen Figur.
- **Spielerwirkung:** Mala scheint mit Lebenden zu reden und fremde Sätze zu sagen. Das bricht eine Grundregel des Spiels und verwirrt in einem Kapitel voller Gespräche.
- **Empfehlung:**
  - Den Gesprächspartner beim Gesprächsbeginn festlegen und nie auf Marko oder Mala umstellen.
  - Gewählte Zeilen spricht die Figur, der die Zeile gehört.
  - Ein Regressionstest prüft das Sprecherprotokoll, und zwar in allen drei Kapiteln, weil der Motor für alle gilt.
- **Abnahme:**
  - In den Lagen von A1, A2 und A4 spricht jeweils die richtige Figur mit ihrem Porträt.
  - „Wieder bis an den Rand?“ erscheint mit Markos Porträt.

### E-09 · Abgeschnittene Texte, „?“ statt Kästchen, Überlauf (P2)

- **Ort:** Overlays für Peilung, alte Karte, Übersetzungsrätsel, Ordnen und Formular.
- **Prüfstatus:** beobachtet. Die Fotos habe ich selbst angesehen.
- **Beleg:**
  - **Peilung:** Die Anleitung bricht ab: „Die zwei Landmarken“, das Wort „antippen.“ fehlt (A1 bild_018).
  - **Alte Karte:** „Daneben ein“, das Wort „Name.“ fehlt (A1 bild_028).
  - **Übersetzungsrätsel:** Zeile 1 verdeckt die Anleitung und stößt an den Rand. Die E-Mail ist während des Rätsels nicht zu sehen (A1 bild_030).
  - **Ordnen:** Die achte Karte ragt unten über den Rahmen in die Bedienleiste (A3 bild_009).
  - **Formular:** Die Kästchen erscheinen als „?“, die Titelzeile läuft über den Papierrand (A4 bild_023).
  - **Peilungsblatt:** Der Schnitt liegt auf dem Blatt statt dahinter (A1 bild_026).
- **Problem:** Anleitungen und Hinweise sind zum Teil nicht lesbar. Das Formular ist eine emotionale Entscheidung und sieht trotzdem kaputt aus.
- **Spielerwirkung:** Ein erzählerischer Hinweis hilft nicht, wenn man ihn nicht lesen kann. Außerdem wirkt das Spiel dadurch unfertig.
- **Empfehlung:**
  - Höhe und Umbruch der Overlay-Texte berechnen statt fest setzen.
  - Acht Karten mit kleinerem Zeilenabstand oder in zwei Spalten anordnen.
  - Die Kästchen als Grafik zeichnen.
  - Den Schnitt der Peilung außerhalb des Blattrands zeigen.
- **Abnahme:** Bildschirmfotos aller Overlays von Kapitel 3 zeigen nichts Abgeschnittenes. Alle acht Karten liegen im Rahmen, und das Formular zeigt Kästchen.

### E-10 · Widersprüchliche Kernfakten (P2)

- **Ort:** Formular, Amt, Kapitel 1 und 2, Zlata im Epilog.
- **Prüfstatus:** beobachtet (A4: Todestag, Quitten, „Du hast gefragt“) und im Code nachvollzogen.
- **Beleg:**
  - **Alter:**
    - „Sie war fünf Jahre älter.“ (`rooms/vermisst.js:37`)
    - Lana ist am 3.3.1976 geboren. Marko war 1993 fünfzehn und ist jetzt 33. Der Abstand beträgt also zwei Jahre [Code, B1].
  - **Todestag:**
    - „Sie ist am Tag danach gestorben.“ (`rooms/vermisst.js:20`)
    - Gefunden wurde Lana aber am Samstagmorgen, und sie starb am selben Samstag. Das Grab trägt den 15.1. (`rooms/skela_l.js:131, 234`)
  - **Schlüssel 31:**
    - In Kapitel 1 sagt Mala am Schlüsselbrett: „Der Schlüssel für 31 hängt da.“ (`rooms/palma.js:204`)
    - In Kapitel 3 sagt Ljerka: „Der Schlüssel von 31 fehlt seitdem.“ (`97_k3_mala.js:182`)
    - Ob der Blick in Kapitel 1 als Geistersicht in die Vergangenheit gemeint war, ist offen [Verdacht].
  - **Herkunft des Namens:**
    - Kapitel 3: „Du hast mich so genannt. Damals, im Bus. Weil ich größer …“ (`96_k3_story.js:277`)
    - Kapitel 2: die Straßenbahn Linie 3 und „Weil du mich Mali genannt hast“ (`97_k2_mala.js:110, 116`).
  - **„Du hast gefragt, ob ich mitkomme. Am Grab.“** (`rooms/vermisst.js:95`) Am Grab fragt aber Mala.
  - **Quitten:** „Im Sommer, wenn die Quitten gelb sind.“ (`rooms/skela_l.js:172`) Quitten werden im Herbst gelb.
- **Problem:** Die Kernfakten widersprechen einander.
- **Spielerwirkung:**
  - In einem Kapitel über genaues Zählen fallen falsche Zahlen auf.
  - Die zentrale Beziehung steht mit einer falschen Zahl im Spiel, und der Schlüssel 31 ist ein Kernrequisit.
- **Empfehlung:**
  - Die Zeilen korrigieren. Für Kapitel 1 etwa: „Der Haken von 31 ist leer. Ich sehe ihn nicht an.“
  - Ein Faktenblatt anlegen mit Geburtsdaten, Wochentagen von 1994, Batos Todesjahr und der Geschichte der Fähre.
  - Die Texte nach Zahlen und Wochentagen durchsuchen.
- **Abnahme:** Alle Erwähnungen stimmen mit dem Faktenblatt überein.

### E-11 · Notizbuch im Gespräch zu lang und unruhig (P2)

- **Ort:** „Nach etwas aus dem Notizbuch fragen“, vor allem bei Vlado und am Sonntag.
- **Prüfstatus:** beobachtet und im Code nachvollzogen.
- **Beleg:**
  - **Länge:**
    - Beobachtet wurden 15 Einträge am Freitagabend (A1) und 29 am Sonntagmorgen.
    - In der Auswahl im Gespräch waren es 44 bis 45 (A3 #170, #199).
    - Bei Vlado werden absichtlich auch erledigte Notizen angeboten (`rooms/vulkanizer.js:125, 179`).
  - **Reihenfolge:** Sie wechselt mit dem Gesprächspartner (A1 B33).
  - **Handbuch:** Es verspricht „drei bis fünf Einträge“ (`web/LIESMICH.txt:108–109`).
  - **Fehlgriffe:** Fehlgriffe nach Nummer (A3 #74, #159) gehen zum Teil auf die Bedienung über die Konsole zurück. Länge und wechselnde Reihenfolge betreffen aber auch das echte Spiel.
- **Problem:** Die Auswahl ist zu lang, und ihre Reihenfolge wechselt.
- **Spielerwirkung:**
  - Das Suchen in langen Listen verdrängt das Denken.
  - Der Spieler kann die Notizen schlicht durchprobieren. Das schwächt die Denkleistung.
- **Empfehlung:**
  - Im Gespräch nur die offenen Fälle zeigen, und erledigte Einträge nur dort, wo sie Teil des Rätsels sind.
  - Die Botschaft an Vlado bekommt eine eigene, kurze Auswahl: die drei, vier Erinnerungen an das Führerhaus.
  - Die Reihenfolge bleibt fest.
  - Das Handbuch an Kapitel 3 anpassen.
- **Abnahme:**
  - Kein Gespräch bietet mehr als etwa zwölf Einträge an.
  - Die Reihenfolge ist in allen Gesprächen gleich.

### E-12 bis E-24 · Feinschliff (P3)

Abnahme für alle: Die Zeile ist korrigiert oder an ihre Bedingung gebunden, und ein Lauf des betroffenen Abschnitts zeigt den Fehler nicht mehr.

| ID | Titel | Beleg | Status | Empfehlung |
|---|---|---|---|---|
| E-12 | Orientierung und Zeitsprünge | <ul><li>Die Orte von Werkstatt und Café stehen nur in Freitagsnotizen, die am Samstag nicht mehr in der Liste waren (A2 #3, #77, #103).</li><li>Vlados Ort am Sonntag hat A3 geraten (#155–167).</li><li>„In einer Stunde“ vergeht durch einen Ortswechsel (A1 B235–243).</li><li>Das Gästebuch löst den Abend ohne Vorwarnung aus (A1 B103).</li><li>Die Samstagnacht endet beim Betreten des rechten Ufers, mitten in den Versuchen an Bato (A2 #174).</li><li>Nach dem Amt fehlt ein Ziel (A4 #133).</li></ul> | beobachtet | <ul><li>Die Orte in die offene Notiz schreiben.</li><li>Zeitsprünge ankündigen, etwa „Ich trage mich ein. Dann ist der Tag vorbei.“ als Wahl.</li><li>Marko sagt „Heute Nacht nicht mehr.“</li><li>Nach dem Amt nennt Nada die Abfahrt.</li></ul> |
| E-13 | Weitere Kontinuitäts- und Weltfehler | <ul><li>„vier Wochen auf der Treppe“, nach den Daten rund sechs (`rooms/vhof.js:40`).</li><li>Bato: „Vierzig Jahre Fähre“ gegen „Die Brücke. Im Sommer. Seitdem fahre ich“ [Verdacht].</li><li>Zlata: „siebzehn Jahre allein getragen“, aber Bato ist 2006 gestorben.</li><li>„Beim dritten habe ich das Licht ausgemacht“ gegen die geordnete Folge.</li><li>Woher Zlata 1996 die Adresse „MZ Alipašino Polje“ hatte, bleibt offen.</li><li>Ljerkas Bild in der Loge gegen Kapitel 1 [Verdacht].</li><li>„Zwei Wörter“ für vier (`97_k3_mala.js:63`).</li><li>„Heute am Fluss“ für das Minarett (A1 B264).</li><li>Mala im Epilog: „Über diese bin ich nie gegangen.“ (`rooms/skela_most.js:55`)</li><li>Mala wechselt nach der Straßenbrücke kommentarlos das Ufer (A1 B198, B207).</li><li>Frau Kolar spricht Marko mit Namen an, danach stellt er sich vor.</li><li>Batos Auftrag an Zlata lässt sich nicht ausrichten (A4).</li><li>Notiztexte setzen ungestellte Fragen voraus.</li><li>Davor: „Alle sagten Djed, ich sagte Dida.“ über den eigenen Vater (`rooms/zelenika_in.js:67`) [Verdacht].</li></ul> | Code, teils beobachtet | einzeln korrigieren; Faktenblatt aus E-10 |
| E-14 | Hinweise | <ul><li>60 von 305 festen Sätzen nennen Marko oder Mala in der dritten Person. Spricht Mala sie, redet sie über sich selbst.</li><li>Der Titel d3k „Was Zlata versprochen hat“ verrät die Szene (`15_hints_k3.js:245–248`).</li><li>Stufe 1 der „Briefe“ wiederholt nur (A3 #238).</li></ul> | Code, beobachtet | <ul><li>Sätze für Mala in der Ich-Form.</li><li>Titel neutral fassen.</li><li>Stufe 1 lenkt den Blick, zum Beispiel aufs Haus.</li></ul> |
| E-15 | Stadtplan: „erreichbar“, aber abgelehnt | Die Vermisstenstelle steht als erreichbar da, die Reise wird abgelehnt: „Erst zurück über die Brücke.“ (A4 #111). Die Anzeige berücksichtigt den Ausgangsort nicht (`96_k3_story.js:138`). | beobachtet, Code | den Ortszustand mit derselben Prüfung berechnen wie die Reise |
| E-16 | Gegenstände | <ul><li>Die Decke („Bringen Sie sie wieder“), die Eintrittskarte und Mates Schlüssel verschwinden beim Finalstart wortlos (`96_k3_story.js:233`; A3). Die Reaktion auf die Decke in der Zwischenwelt kann deshalb nie laufen.</li><li>Bato nennt Markos Kugelschreiber „Bleistift“ (`rooms/skela_l.js:399`).</li><li>„Lies Brief von 1996“ ergibt „Da steht nichts.“ (A4 #91)</li><li>Der Händler sagt „Nehmen Sie sie mit“, aber die Postkarte lässt sich nicht nehmen (A1 B87).</li></ul> | Code, beobachtet | <ul><li>Die Rückgabe der Decke als kleine Handlung.</li><li>Eigene Texte für Kugelschreiber und Brief.</li></ul> |
| E-17 | Bild und Text widersprechen sich | <ul><li>Vlado steht noch vor dem Lastwagen, obwohl er laut Text einsteigt.</li><li>Mala steht unten statt „oben“.</li><li>„KUĆA“ steht an der falschen Stelle.</li><li>Nada, Vlado und der TAM fehlen im Bild.</li><li>Die Busanzeige zeigt „0“.</li><li>Der Ponton ist braun statt grau (A4).</li><li>Mala ist sichtbar, obwohl es heißt „Sie ist fort.“ (A1 bild_024).</li><li>Der Schreibtisch aus dem Text fehlt (A2 bild_005).</li></ul> | beobachtet | Bild oder Text angleichen |
| E-18 | Wiederholungen | <ul><li>„Den Schlüssel bekam der Kleinste“ steht neunmal da, „Sutra. Danju.“ sechsmal.</li><li>„Du suchst mich, damit du ihn nicht suchen musst.“ fällt zweimal (`rooms/vermisst.js:73`, `96_k3_story.js:284`).</li><li>„Zwei Linien von fast derselben Stelle.“ steht zweimal in drei Zeilen.</li><li>„nach Kaffee und nach nassen Jacken“ kommt an zwei Orten vor, im Café sogar bei trockener Bura (A1).</li></ul> | Code, beobachtet | kürzen; jede Information höchstens zweimal |
| E-19 | Unerreichbare Zeilen | „Zum ersten Mal seit vierundneunzig nirgendwohin …“ und „Keine Leine mehr …“ (`97_k3_mala.js:17, 42`) fängt der Raum am Grab ab (`rooms/skela_l.js:337–343`). | Code | als Frage ins Menü am Grab übernehmen |
| E-20 | Verweise auf optionale Inhalte, ungenutzte Übernahmen | <ul><li>„Seit der Kirchentreppe“ (`rooms/starimost.js:154`) und „Am Terminal. Das hast du mir gesagt.“ (`96_k3_story.js:275`) setzen optionale Szenen aus Kapitel 1 voraus.</li><li>Die Wahlen „Geständnis“, „Warum Mostar?“ und „Ana“ aus Kapitel 2 werden gespeichert, aber nie genutzt (`96_k3_story.js:29–44`).</li><li>Ljerkas und Anas Zusage bleiben offen.</li></ul> | Code | <ul><li>Die Zeilen neutral fassen.</li><li>Eine Prologzeile hängt von „Warum Mostar?“ ab.</li></ul> |
| E-21 | Optionales, das das Finale voraussetzt | <ul><li>Batos Unruhe ist optional, das Finale setzt sie aber voraus („Heute weiß er, wer läutet.“, `rooms/skela_d.js:161`).</li><li>Dinos Strömung gibt es erst nach Skela. Sie ist sofort erledigt, und Dino sagt denselben Satz zweimal (`rooms/starimost.js:78, 93`).</li></ul> | Code | <ul><li>Die Zeile im Finale an eine Bedingung binden.</li><li>Die Strömung früher anbieten oder streichen.</li></ul> |
| E-22 | Kreuzförmige Dachmasten am Ostbusbahnhof | `rooms/art/ostbus.js:91` zeichnet auf jedem zweiten Dach Kreuzformen. Das widerspricht der Vorgabe, keine religiösen Zeichen zu zeigen, und am Ostufer von Mostar kann es als Aussage gelesen werden. | Code, Bildausschnitt | einfache Stäbe zeichnen; vor einer Veröffentlichung |
| E-23 | Gleicher Ton und Erklärsätze | <ul><li>Die kleinen Rollen teilen denselben Pointenton.</li><li>Mala deutet aus (`rooms/westbus.js:25`, `rooms/zelenika.js:121`, `rooms/zelenika_in.js:16, 58`).</li><li>Marko hält einen Vortrag über Winkel.</li></ul> | Einschätzung | Einzelne Pointen streichen; Malas Deutungen durch Blicke ersetzen (F3) |
| E-24 | Handbuch | Laut Handbuch redet Marko „mit Lebenden“. Seit Kapitel 1 redet er aber auch mit Geistern. Die Länge des Notizbuchs stimmt nicht mehr (E-11). | beobachtet | Handbuch anpassen |

---

## F. Ausgearbeitete Verbesserungsvorschläge

Alle drei sind neue Vorschläge [Vorschlag]. Umgesetzt ist davon nichts.

### F1 · Malas Wille als Spielregel

**Zielbefunde:** E-07, ein Teil von E-05. **Umfang:** mittel, eine gestalterische Überarbeitung aus kleinen Eingriffen.

**1. Eine Regel für Rügen**
- **Heute:** Jedes übergangene „(Mala fragen.)“ zählt in einen gemeinsamen Zähler. Die Rügen steigern sich unabhängig vom Anlass (`96_k3_story.js:165–169`).
- **Neu:** Jede Fragestelle bekommt eine von drei Arten.
  - **Offen:** Es geht um Malas Sache, und sie hat sich noch nicht geäußert. Nur hier darf sie rügen.
  - **Gesagt:** Sie hat ihren Willen schon geäußert, wie bei der Botschaft an Vlado (`rooms/vhof.js:56`) oder dem Formular (`rooms/vermisst.js:14`). Handelt Marko danach, sagt sie nur kurz: „Ja. So.“
  - **Seins:** Es geht um Markos Vater. Dort gibt es keine Option „(Mala fragen.)“. Wer Mala anspricht, bekommt „Das frage ich dich nicht.“, ohne Rüge.

**2. Fragen ändert den Inhalt: Nada in der Küche** (`rooms/zlata_k.js:40–53`)

Hat Marko gefragt:

> MARKO: Was soll ich ihr sagen?
> MALA: Alles. Auch das Seil. Auch, dass ich gesagt habe: Sag es keinem.
> *(Pause.)*
> MALA: Und was ich am Herd gesagt habe. Mali čeka.
> MARKO: Das muss sie nicht wissen.
> MALA: Du meinst: Das musst du nicht sagen.
> MARKO: Ja.
> MALA: Sag es trotzdem.

Danach, zu Nada:

> MARKO: Sie hat gefragt, wie spät es ist. Und gesagt: Mali čeka.
> *(Nada sieht auf ihre Hände.)*
> NADA: Bis zum Schluss.

Hat Marko nicht gefragt, lässt er „Mali čeka“ weg, wie heute. Danach sagt Mala nur: „Du hast eins weggelassen.“ – MARKO: „Ja.“

**3. Malas Kante: „Den nicht“**
- **Wann und wo:** am Sonntag, als Pflicht, sobald „Bato war wach“ vorliegt und Marko am rechten Ufer zu Mala zurückkehrt (Einhängepunkt `rooms/skela_d.js:50–56`).

> MARKO: Er war wach. Er hat mitgezählt.
> MALA: Ich weiß. Ich sehe ihn flackern, bis hierher.
> MARKO: Heute Nacht läute ich. Dann kommt er.
> MALA: Und dann soll ich ihn hinüberbringen.
> MALA: Er hat das Licht ausgemacht. Vor dem dritten Läuten.
> *(Lange Pause. Die Glocke summt im Wind.)*
> MALA: Den nicht.
> *(Auswahl: „Ich zwinge dich nicht.“ · „Dann läute ich nicht.“ · Schweigen)*
> [Ich zwinge dich nicht] MALA: Ich weiß. Darum sage ich es dir.
> [Dann läute ich nicht] MALA: Doch. Läute. Ob ich einsteige, entscheide ich da.
> [Schweigen] MALA: Gut. Das war die richtige Antwort.

- **Folgen:**
  - Im zweiten Gespräch fragt Marko: „Und der Fährmann? Heute früh hast du gesagt: Den nicht.“ Damit hat Malas vorhandene Antwort „Ich lasse ihn kommen …“ (`rooms/vhof.js:57`) ihren Vorlauf.
  - Im Finale bekommt „Bist du bereit?“ – „Nein.“ – „Läute trotzdem.“ dadurch Gewicht.
  - Vor „Steig ein.“ sagt Mala einen eigenen Satz zu Bato: „Du hast das Licht ausgemacht.“ – BATO: „Ja.“

**4. Die Grenze am Seil wird Pflicht**
- Die Szene „Frag nicht. Nicht jetzt. … Es gehört mir.“ (`rooms/skela_d.js:92–97`) wird in der zweiten Nacht Teil des Tagesendes.
- Der Hinweis n2c nennt den Anker.

**5. Am Grab zählt, was Marko getan hat**
- Eine Zeile vor „Willst du das?“ greift eine Stelle auf, an der Marko gefragt hat. Die Schalter dafür gibt es schon:

> MALA: Bei Zlata hast du mich gefragt. Mit zwei Fingern. Darum frage ich dich jetzt auch.

- Hat er nie gefragt: „Du hast nicht immer gefragt. Ich frage dich trotzdem.“

**Warum es hilft**
- Das Thema des Kapitels wird spielbar.
- Mala bekommt einen Willen mit Folgen, und die Mitte bekommt Reibung.
- Die Zwischenwelt mit „Oprosti, mala“ wiegt mehr.

**Was erhalten bleibt:** beide Schlüsselgespräche im Wortlaut, das Kopfschütteln, alle Wahlen am Grab und die Zähler für Kapitel 4.

**Neue Voraussetzungen und Nebenwirkungen**
- Es braucht drei neue Schalter und etwa 20 neue Zeilen.
- Das Ende der zweiten Nacht hängt zusätzlich vom Anker ab.
- Der Hinweis n2c ändert sich.
- Ein Test prüft die Rügefälle.
- Die bosnische Sprachfassung braucht Nachträge.

**Abnahme**
- In den drei genannten Fällen gibt es keine Rüge.
- Blinde Tester beschreiben „Mala fragen“ als Entscheidung.
- „Den nicht“ wird auf jedem Weg vor dem zweiten Gespräch erreicht.

### F2 · Denken statt Ausführen

**Zielbefunde:** E-01, E-02, E-04, E-06. **Umfang:** a bis c ist eine gestalterische Überarbeitung, d und e sind kleine Reparaturen.

**a) Peilung**
- **Landmarken, heute:** Mala nennt die Landmarken mit Namen und Seite: „Zwischen dem zweiten Kran und dem Glockenturm …“. Der Spieler tippt sie an.
- **Landmarken, neu:** Mala beschreibt, was sie wahrnimmt, nicht den Namen. Das passt zu ihr („Er ist nicht grün. Er ist laut.“) und zur Bura des Freitags:

> MALA: Links von mir etwas Hohes, das sich dreht, wenn der Wind kommt. Rechts etwas, das zur vollen Stunde schlägt.

- **Falsches Antippen:** „Der steht still. Meiner dreht sich.“ Das Blatt oder das Panorama muss den Unterschied zeigen, zum Beispiel einen Kran mit Warnlicht.
- **Dritter Standort, heute:** Marko erklärt Winkel und Westhang.
- **Dritter Standort, neu:**
  - Marko benennt nur das Problem: „Zwei Linien von fast derselben Stelle. Die schneiden sich überall und nirgends.“
  - Auf dem Plan werden die Orte am Westufer zu möglichen Standorten.
  - Ein zu naher Standort ergibt „Wieder fast parallel.“, erst der Friedhof ergibt den Schnitt.
  - Die bisherigen Erklärsätze wandern in die Hinweisstufen.

**b) Alte Karte und Skela**
- **Heute:** Beim Lesen sagt Marko schon „Skela.“. Die Verbindung von Bereich und alter Karte ist nur noch eine Formalität.
- **Neu, Schritt 1:** Beim Lesen sagt Marko nur: „Im Schnitt ein einziges Brückensymbol. An einer Stelle, wo heute keine Brücke ist.“
- **Neu, Schritt 2:** Der Schluss verbindet die Karte mit Malas Brückennotiz vom Donnerstag, „Malas Brücke stand im Wasser“ beziehungsweise „Nicht die Alte Brücke“:

> MARKO: 1985 eine Brücke. Im Januar 1994 nur noch Stümpfe im Wasser. Der Name daneben: Skela. Skela heißt Fähre.

- **Wirkung:** So verbindet der Spieler einen Fund vom Donnerstag mit dem vom Freitag. Er sieht, dass Malas Brücke dort stand.
- **Dazu:** Plan, Vlado und Bett werden wie in E-01 angepasst.
- **Voraussetzung:** Die Brückennotiz darf dafür noch nicht als erledigt ausgeblendet sein.

**c) Sonntag: Bato und das Ordnen**
- **Bato, heute:** Er weist Dachfenster und Lichtfolge ab. Erst die geordnete Nacht löst seinen Versprecher aus.
- **Bato, neu:**
  - Liegen Dachfenster und Lichtfolge beide vor, sagt Marko: „In Ihrer Kammer war Licht. Während sie geläutet hat.“ Darauf folgt der vorhandene Versprecher.
  - Liegt nur eine vor, fragt Bato zurück: „Licht? In meiner Kammer? Wann soll das gewesen sein?“
- **Das Ordnen bekommt eine echte Aufgabe:** Es soll Batos „Mann, der rief“ klären. Diesen Mann und Vlados „Um zwei war ich wieder da. Ich habe gerufen.“ legt das Spiel heute nebeneinander, ohne sie zu verbinden.
  - Mit Vlados Teil 2 erscheint eine neunte Karte: „Ein Mann ruft über den Fluss.“
  - Richtig liegt sie nach dem dritten Läuten.
  - Das Ergebnis ist eine neue Notiz:

> MARKO: Um elf hat ein Mädchen geläutet. Um zwei hat ein Mann gerufen. Bato hat beides gehört. Und sich das Leichtere gemerkt.

- **Folge im Finale:** Marko kann Bato sagen: „Der Mann, der gerufen hat, war der Fahrer. Er ist zurückgekommen.“ Damit treffen sich Vlados und Batos Strang.
- **Neue Voraussetzung:** Vlado, Teil 2, fragt heute nach der geordneten Nacht. Künftig muss er auch Dachfenster oder Lichtfolge annehmen, sonst entsteht eine Schleife.

**d) Rückmeldungen** (E-04)
- Der Satz aus dem Führerhaus wird am Samstag und Sonntag angenommen.
- Der Topf mit Fehlversuchen bekommt neutrale Sätze.
- Das Raucher-Paar bekommt eine eigene Antwort.
- Die Hinweise zur Eierfrau verzweigen nach dem Notizstand.

**e) Schlüssel am Tor**
- **Heute:** Lenas Menü bietet „Stell dich ans Tor. Halt die Hand auf.“ als fertigen Satz an.
- **Neu:** Hat der Spieler „Den Schlüssel bekam der Kleinste“ mit Lena verbunden, bietet Marko drei Gesten an: „Klopf an.“ · „Ruf ihn.“ · „Halt die Hand auf.“ Nur die dritte setzt das Ritual fort. Die anderen bekommen eigene, leise Antworten von Mate.

**Warum es hilft**
- Der Spieler zieht die Schlüsse selbst, und Marko klingt wie ein Ermittler.
- Die Kette am Sonntag folgt der Logik, die der Spieler schon hat.
- Das Ordnen bringt eine echte neue Erkenntnis und verbindet zwei Figuren.

**Was erhalten bleibt**
- Peilungsblatt, Fächer und Malas Leine;
- Zdravkos Karte;
- das Ordnen als Overlay;
- alle Zeilen Batos;
- Lenas Szene;
- die Schublade, die unverändert bleibt.

**Neue Voraussetzungen und Nebenwirkungen**
- Es kommen etwas mehr Versuche hinzu: höchstens zwei zusätzliche Messungen.
- Neu zu schreiben sind die Hinweise der Peilung, des Ordnens und Batos.
- Neue Notizen braucht es für den Rufer und gegebenenfalls für die Brücke von 1985.
- Lösungsdurchlauf und Tests müssen angepasst werden.

**Abnahme**
- Ein blinder Tester wählt den dritten Standort ohne Hinweis.
- Vor dem Schluss erscheint „Skela“ nirgends.
- Bato verrät sich nach Dachfenster und Lichtfolge.
- Das Ordnen ergibt eine neue Notiz.

### F3 · Schlüsselszenen mit Spielerhand

**Zielbefunde:** E-05, ein Teil von E-23. **Umfang:** a, c und d sind kleine bis mittlere Eingriffe, b und f gestalterisch.

**a) Die Glocke im Finale**
- **Heute:** Ein Klick spielt alle drei Schläge ab, danach folgen rund 33 Textfelder.
- **Neu:** dreimal „Läute“.
  - Nach jedem Schlag zählt Mala, und der Ton klingt zwei bis drei Sekunden aus.
  - Wer zu früh klickt, hört: „Warte. Bis der Ton weg ist.“ Das ist Malas eigene Regel: „Ich habe jedes Mal gewartet, bis der Ton weg war.“ (`rooms/skela_d.js:78`)
  - Zwischen den Schlägen werden die vorhandenen Zeilen verteilt:
    - nach dem ersten Schlag Kata: „Hier ist keine Fähre.“;
    - nach dem zweiten nimmt Vlado die Mütze ab;
    - nach dem dritten ruft Bato: „Dolazim!“
  - Einen Fehlschlag gibt es nicht.

**b) Haltungswahl in beiden Schlüsselgesprächen**
- Die Wahl kommt nach `rooms/herberge.js:83`. Sie verzweigt nicht und färbt eine spätere Zeile am Grab:

> *(Auswahl: „Beides.“ · „Du bist der Auftrag.“ · Schweigen)*
> [Beides] MALA: Beides geht nicht. Eins kommt zuerst.
> [Auftrag] MALA: Wenigstens lügst du nicht.
> [Schweigen] MALA: Das ist auch eine Antwort.

- Im zweiten Gespräch wird Markos „Da stehe ich sowieso.“ (`rooms/vhof.js:41`) auf dieselbe Weise zur Wahl.

**c) Pause bei „Mali čeka“**
- Nach `rooms/skela_l.js:230` kommt eine Wahl statt einer Erzählzeile:

> *(Auswahl: „(Nichts sagen.)“ · „(Mala ansehen.)“)*
> [Nichts sagen] Ich sage nichts. Zlata wartet, bis ich wieder atme.
> [Mala ansehen] Mala sieht nicht zu mir. Sie sieht auf den Herd.

**d) Epilog ohne dritte Nacherzählung**
- Im Amt erzählt Nada, nicht Marko (statt `rooms/vermisst.js:20`). Das beseitigt nebenbei das falsche „am Tag danach“:

> FRAU KOLAR: Wer hat das Grab angelegt?
> NADA: Der Fährmann. Bato Brkić. Er ist tot.
> NADA: Seine Frau hat sie gefunden. Sie hat noch gelebt. Bis Samstag.
> *(Nada sieht auf ihre Hände.)*
> NADA: Schreiben Sie das so.

- Markos Bericht in der Küche wird kürzer und hängt mit F1 zusammen.

**e) Malas Deutungen durch Gesten ersetzen**
- Das betrifft `rooms/westbus.js:25`, `rooms/zelenika.js:121`, `rooms/zelenika_in.js:16, 58` und `rooms/vulkanizer.js:65`.
- Beispiel: Statt „Er hat ihn angesehen. Und nicht erkannt.“ heißt es „Mala sieht zu Mate. Dann zu mir. Sie sagt nichts.“

**f) Der Samstagnachmittag**
- Die Szene im Haus Zelenika endet nach Jelas erstem Vorwurf und der Übersetzungswahl.
- Pfosten, Feigen und Baum erkundet der Spieler selbst und fragt Jela danach.
- Den Tag beendet eine Handlung des Spielers, Nadas Anruf oder das Bett, und nicht der Automatismus.

**Warum es hilft**
- Die stärksten Momente trägt der Spieler mit.
- Das Zählmotiv wird gespielt.
- Der Epilog wird kürzer, ohne Inhalt zu verlieren.

**Was erhalten bleibt**
- alle Zeilen aus Zlatas Erzählung;
- das Gespräch am Grab;
- Jelas Text;
- die Musik und die Abfolge der Nacht.

**Neue Voraussetzungen und Nebenwirkungen**
- Es entstehen mehr Zwischenzustände im Finale. Die Wiederaufnahme (`rooms/skela_l.js:305–314`) muss sie abdecken.
- Ton und Zeitpunkte der Glocke müssen abgestimmt werden.
- Lösungsdurchlauf, Tests und Trailerstellen sind anzupassen.

**Abnahme**
- Keine Pflichtszene hat mehr als etwa 15 Textfelder ohne Eingabe.
- Die drei Glockenschläge löst der Spieler aus.
- Im Epilog wird die Nacht einmal ganz erzählt.

---

## G. Empfohlene Reihenfolge der Überarbeitung

1. **Zuerst: kleine Reparaturen ohne gestalterisches Risiko.** Sie sind voneinander unabhängig, und danach liefert ein neuer blinder Test saubere Ergebnisse.
   - E-08, die Sprecherzuordnung im Motor. Sie wirkt auf alle Kapitel, deshalb danach die Tests für Kapitel 1 und 2.
   - E-09, die Overlays und das Formular.
   - E-10 und E-22, Kernfakten und Dachmasten.
   - E-03 und E-04, Bedingungen und Antworten. Meist reicht eine Zeile pro Stelle.
2. **Dann: die beiden P1-Ketten.** Sie kommen vor jeder neuen Szene, denn auf ihnen bauen Hinweise und Tests auf.
   - E-01 mit F2 b, der Sperre für Skela.
   - E-02 mit F2 c, Bato und dem Ordnen.
   - Abhängigkeit: Vlado, Teil 2, muss dieselben Notizen annehmen.
   - Danach ein neuer blinder Test von Freitag und Sonntag mit frischen Testern.
3. **Danach: Figur und Rhythmus.**
   - F1. Zuerst die Regel für Rügen, die klein ist. Dann „Den nicht“ und die Küche.
   - F3 a, c und d.
   - Abhängigkeit: „Den nicht“ ändert das zweite Gespräch (`rooms/vhof.js:55–58`) und die Zeilen im Finale. Die Glocke aus F3 a berührt die Wiederaufnahme im Finale.
4. **Optional:**
   - F2 a und e, F3 b, e und f;
   - E-11, das Notizbuch;
   - die P3-Liste E-12 bis E-24.

**Nicht beschädigen** (B.3):
- die dreifache Übergabe an der Schublade;
- die Gesten der Lichtprobe;
- den wählbaren alten Reflex am Grab;
- die Spiegelung der beiden Schlüsselgespräche, bei der „Ich übe“ von Marko zu Mala wandert;
- Mates Erkenntnis durch eine Handlung;
- den Verlustzweig auf der Tepa;
- die Klammern über die Kapitelgrenzen;
- den stillen Bulevar.

Nach jeder Stufe laufen der automatische Lösungsdurchlauf, die Tests für Kapitel 3 und ein blinder Test der betroffenen Tage.

---

## H. Offene Prüfungen und Grenzen

- **Keine Menschen:** Durchgang A haben KI-Tester gemacht. Ihre Aussagen über Gefühle sind Einschätzungen, keine Reaktionen echter Spieler. Ob das Kapitel Erstspieler fesselt, zeigt erst ein Test mit Menschen.
- **Abschnittsweise:**
  - Kein Tester hat das ganze Kapitel am Stück gespielt.
  - A2 bis A4 begannen auf Ständen aus dem Lösungsdurchlauf, also auf dem Standardweg.
- **Andere Reihenfolgen nur im Code geprüft:**
  - Sanja auslassen;
  - Glocke oder Anker in der zweiten Nacht auslassen;
  - die Hühnerfrage auslassen;
  - Dinos Roller;
  - den Verlustzweig auf der Tepa;
  - Davor absagen.
- **Nicht gespielte Wahlen:**
  - „(Allein gehen.)“ über den Fluss;
  - „(Schweigen.)“ bei Zlata;
  - das Versprechen am Grab;
  - „Frag mich in München noch mal.“;
  - „Heute nicht.“ bei der Blutprobe;
  - die Schonfassung in der Küche;
  - das Nichtbeantworten der SMS.
- **Grenzen der Konsole:**
  - Die Antworten auf falsche Verbindungen sind nur im Code geprüft.
  - Bewegung, Flackern und Geisterwind der Erkenntnis ließen sich nicht beurteilen, Ton gar nicht.
  - Ob bei normaler Geschwindigkeit ein Abspann läuft, ist offen.
  - Die Doppelklick-Ausgänge wurden nicht geprüft.
  - A1 meldet, die Erinnerung „Im Bus“ sei auf den ersten Fotos nicht zu sehen gewesen, nur die Titelkarte. Ob das am Zeitpunkt der Fotos lag, ist offen.
- **Nicht geprüft:**
  - echte Geräte, Touch, kleine Bildschirme, Hochformat;
  - die bosnische Sprachfassung von Kapitel 3;
  - Speichern und Laden mitten in Szenen;
  - die Spielzeit.
- **Unbestätigte Verdachtsfälle:**
  - Batos „Vierzig Jahre Fähre“;
  - Ljerkas Bild in der Loge;
  - die Zeile mit „Dida“;
  - die Absicht hinter dem Schlüssel 31 in Kapitel 1;
  - Malas Porträt über Vlados Auswahl (A2 bild_006).
- **Kapitel 1 und 2** wurden nur an den Anschlussstellen geprüft.
- **Unvollständig:** Dieser Bericht beruht auf ausgewählten Abläufen und auf Codeprüfung. Er ist keine vollständige Prüfung aller denkbaren Zustände.
