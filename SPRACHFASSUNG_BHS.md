# MALA – bosnisch-kroatische Sprachfassung (BHS)

Stand: **Kapitel 1 (Split) vollständig übersetzt, einschließlich des neuen Einstiegs und des Morgens nach Ivka.** Kapitel 2 (Sarajevo) läuft in dieser Sprachfassung vorerst auf Deutsch; das Spiel sagt das bei der Wahl des Speicherplatzes für Kapitel 2.

## Einschalten

Im Titelmenü oder im Spielmenü **„Sprache: Deutsch“** antippen. Dann steht dort **„Jezik: bosanski / hrvatski“**. Die Wahl bleibt gespeichert. Spielstände gelten für beide Sprachen, man kann auch mitten im Spiel umschalten.

## Wer spricht was

| Figur | Sprachform | Beispiel aus dem Spiel |
|---|---|---|
| **Marko** mit allen anderen | Standardkroatisch | „…Glavobolja. Naravno.“ |
| **Marko mit Mala** | Sarajevo-Bosnisch: mit ihr klingt er wie der Junge aus Sarajevo, der er war | „Niko. Naravno da niko.“ |
| **Mala** | Sarajevo-Bosnisch der frühen Neunziger | „Tu. Kod tebe. Daleko ne mogu, znaš to.“ |
| **Ivka, Zdenka, Jakov** | Čakavisch aus Split (Veli Varoš), gut lesbar | Ivka: „Je li brod iz Supetra već doša? Ne vidin ga.“ · Zdenka: „Ča je, mali? Tražiš koga?“ · Jakov: „Dobra večer. Kasno je za špacir. Pazi di staješ.“ |
| alle anderen Splitter | Standardkroatisch mit einzelnen Split-Wörtern | Sanja: „Marko. Ka i uvik?“ · Stipe: „Ili sjedni ili aj, samo mi ne stoj na svjetlu.“ |
| Erzähler, Menüs, Notizbuch, Gegenstände | Standardkroatisch | „Već tri dana jugo. Topla kiša, težak zrak i glava kao od olova.“ |
| Briefe, Postkarten, Register, Schilder | wie im Original (schon kroatisch) | „Draga mama, dolazim 22. s brodom u sedam.“ |

Die verbindlichen Stilvorgaben stehen in `game/STYLE_BHS.md`.

## Umfang

- 11 Dateien in `game/src/lang/` mit rund 3.390 Einträgen: die Oberfläche, neun Teile von Kapitel 1 und ein Abgleich.
  - Neu für den Einstieg und den Morgen nach Ivka sind `bhs_k1_h.js` (Wohnung), `bhs_k1_i.js` (Bar „Bura“) und `bhs_k1_j.js` (Riva, Varoš, Ivkas Wohnung, Hafenamt, Übergänge, Notizen, Gegenstände).
  - Einträge zu Sätzen, die es im deutschen Text nicht mehr gibt (die alte Nacht, das alte Zwischenspiel), sind entfernt.
- Gezählt sind alle 3.440 sichtbaren Texte aus den 29 Quelldateien von Kapitel 1 und der Oberfläche. Kein Text ist ohne Übersetzung.
- `bhs_k1_z.js` gleicht 20 Sätze ab, die in mehreren Räumen vorkommen und dort zuerst verschieden übersetzt waren.

## Technik

- Übersetzt wird erst bei der Anzeige (`game/src/00z_i18n.js`). Spiellogik, Rätselprüfung, Spielstände und Tests arbeiten weiter mit den deutschen Texten. Deshalb kann die Sprachfassung keine Rätsel und keine Spielstände beschädigen.
- Gleiche deutsche Sätze verschiedener Sprecher haben eigene Einträge, zum Beispiel `'@ivka:…'` für Ivkas Čakavisch.
- Markos Sätze an Mala können eine bosnische Fassung haben (`{ hr, bs }`). Ob Marko gerade mit Mala spricht, erkennt das Spiel am Gesprächspartner und an Malas letztem Satz (nur wenige Sekunden lang, beim Ortswechsel vergessen).
- Bei einer Auswahl gilt der Angesprochene vom Moment, in dem die Auswahl aufgeht. Wer lange überlegt, bekommt die Antwort trotzdem in derselben Sprachform, in der das Menü sie zeigt.
- Fehlt eine Übersetzung, erscheint der deutsche Text. Die Tests unten finden solche Stellen.
- Video vom ersten Fall in Echtzeit mit Ton: `game/tools/video_fall1.js`. Die Schritte stehen oben in der Datei.

## Tatsächlich ausgeführte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Statische Prüfung aller Quelldateien von Kapitel 1 (`i18n_check.js`) | 2.980 sichtbare Texte, **0 fehlen**, keine Tippfehler in Schlüsseln, keine fremden Schriftzeichen |
| Kompletter Durchlauf von Kapitel 1 **auf BHS** (`MALA_LANG=bhs walkthrough.js`) | 53 Schritte bis zum Abspann, keine JS-Fehler, **kein angezeigter Text auf Deutsch**, kein Text läuft aus dem Bild |
| Bilder: der erste Satz jeder Figur in ihrer Sprachform | 18 Figuren, alle richtig (Galerie im Bericht der Sitzung) |
| Transkript des Durchlaufs (`MALA_LANG=bhs MALA_TX=datei walkthrough.js`): 858 Sätze mit Sprecher und Angesprochenem, gezielt durchsucht nach kroatischen Wörtern bei Mala und bei Marko an Mala (*tko, kava, hladnjak, tjedan, tisuća …*) | 4 Stellen gefunden und korrigiert, danach keine mehr |
| Video „Kapitel 1, erster Fall“ auf BHS: alle 346 Texte gegengelesen | „na moli“ und die 4 Stellen oben korrigiert, sonst keine Fehler gefunden |
| Deutsche Fassung danach | Kapitel 1 und 2 laufen weiter komplett durch (siehe `BERICHT_K2.md`) |
| **Neuer Einstieg** (November 2026): statische Prüfung | 3.440 sichtbare Texte, **0 fehlen**, keine Tippfehler in Schlüsseln, keine fremden Zeichen; 20 bekannte Doppelte, alle in `bhs_k1_z.js` abgeglichen, keine neuen |
| **Neuer Einstieg**: Durchlauf auf BHS | 61 Schritte bis zum Abspann, keine JS-Fehler, kein angezeigter Text auf Deutsch, kein Text läuft aus dem Bild; Transkript mit 1.083 Sätzen; bei Mala und Marko an Mala noch ein kroatisches Wort gefunden („stol“) und korrigiert |

## Was beim Übersetzen am Original verbessert wurde

- **Sprecher:** Antworten auf Notizbuch-Fragen und auf übergebene Gegenstände, die als einfacher Text hinterlegt sind, sprach bisher Marko mit seinem eigenen Porträt, etwa Dinkos „Ich sage es nicht noch einmal.“ Jetzt spricht sie die gefragte Figur. Das gilt für beide Sprachen und beide Kapitel.
- **Datum:** Die Postkarte ist am 18. Dezember gestempelt. Marko sagte dazu „Vier Tage vor Weihnachten“, jetzt sagt er „Vier Tage vor dem Boot um sieben“, denn das Boot ging am 22.
- **1984:** In Dinkos Erinnerung heißt die Polizei jetzt „milicija“, wie damals in Jugoslawien.
- **Tonćis Brief:** Dort stand „nemoj me više čekati na moli“. Das Wort ist *mol*, also „na molu“, so wie es auch Mladen und Dinko sagen. Der Brief ist auch in der deutschen Fassung kroatisch, die Korrektur gilt also für beide.

## Nachträge beim Gegenlesen

- **Marko an Mala:** In den ersten Szenen antwortet Marko Malas Stimme jetzt durchgehend bosnisch, wie schon bei „Niko. Naravno da niko.“ und „Ko si ti?“:
  - „Ko bi drugi.“ (vorher „Tko“)
  - „Ko se okrene …“ (vorher „Tko“)
  - „previše kahve“ (vorher „kave“)
  - „Frižider.“ (vorher „Hladnjak.“)
  - Mit anderen Leuten bleibt es Standardkroatisch.
- **Ivka:** Im Zwischenreich sagt sie jetzt „Moren ih držat.“ Das antwortet auf ihr „Ne moren ih držat.“ an der Mole; vorher stand dort „Mogu“.

## Nachträge nach dem Prüfbericht (November 2026)

Neue oder geänderte Texte in Kapitel 1, alle übersetzt (statische Prüfung: 0 fehlen):

- **Bruno:**
  - drei neue Bruchstücke (*„… pa je otišla … a ja … sam …“*, *„Sviraj, mala …“*, *„… ne … još ne …“*);
  - die neue Erkenntnis über Danica und die Kerze.
  - Markos deutsche Übersetzungen dieser Bruchstücke sind in BHS, wie bisher, ganze Sätze von Marko.
- **Ljerka:** der Moment nach Brunos Satz, „Studirala bih na Akademiji …“, sowie ihr „Danas ne“ am Morgen.
- **Nina:** ihr Zögern vor der Rampe; Markos zwei Sätze über ihre Bilder und ihr Warten.
- **Sanja:**
  - zum geöffneten Brief: „Sol prvo pojede tintu.“;
  - zum Zettel: „I ne govori ništa Stipi.“
- **Mala:**
  - die genauere Frage nach dem ersten Schwindel;
  - das ausgeblichene Ordnerschild im Hafenamt;
  - die Antworten in der Bura.
- **Marko:**
  - umformulierte Wegeansagen;
  - die Sätze an Mala in der Bura, mit eigener bosnischer Fassung.
- **Lukas Fahrkarten:** Bei Nina steht jetzt eine *rezervacija za dvoje*, keine *karta*.
- **Oberfläche:** *Da fehlt noch etwas* (Još nešto nedostaje); die neuen Rätselformen (*Poredaj*, *Spoji*, *Zamijeni*, *Čitanje rukopisa*, *Tablica*).

## Grenzen und Bitte um Gegenlesen

**Neue Texte (Einstieg, Morgen nach Ivka):** Die Übersetzer haben selbst als unsicher markiert:
- **Mala:**
  - *akšam* (Dämmerung), *pendžer*, *juče*, *ukrštenica*, *šoljica*, *kapija*, *pomjerilo*;
  - „pretvorio me u san“ (für „weggeträumt“);
  - „One gledaju kroz mene i naježe se. Misle da je propuh.“
- **Zdenka (Čakavisch):** *priko lita*, *od oktobra*, *digla ruke*, *sirotinji kod Svetoga Nikole*, *teka* (Ivkas Heft).
- **Marko:**
  - *prepisala/propisala* (für „verordnet“);
  - „U protusvjetlu lampe“;
  - *lampica, kotao, tlak* in der Espresso-Anleitung;
  - „kod onih iz Napulja“ (für die Neapolitaner).
- **Sanja:** *zapisujem* (anschreiben), *vodim knjige* (Buch führen), *tenda* (Markise).
- Ivkas Strickheft und Sanjas Zettel sind schon kroatisch. Statt einer zweiten Übersetzung fasst Marko das Heft in zwei Sätzen zusammen, und Mala liest den Zettel einfach vor.
- Einige kurze Sätze („Mit freundlichen Grüßen“, „Ich komme mit.“, „Marko?“, „Und?“, „Und jetzt?“, „Seit wann?“) kommen auch in Kapitel 2 vor. Dort erscheinen sie jetzt übersetzt, obwohl Kapitel 2 sonst noch deutsch ist.

**Ältere Texte:**

Die Übersetzung haben KI-Übersetzer nach festen Regeln erstellt; geprüft wurde sie automatisch. Eine Durchsicht durch Muttersprachler ist empfehlenswert, besonders für folgende Stellen, die die Übersetzer selbst als unsicher markiert haben:

- **Čakavisch:**
  - Ivka: Partizipien wie *donija, napravija, pročita*, Instrumental auf *-n* (*s brodon, s barkicon*), Wörter wie *jist, šolde, ura kucka*.
  - Zdenka: *stoja je straga, od dicembra, s ombrelon, bičve, ponistru*.
  - Jakov: *mišan, grobe, prid, doli, vanka, sidila, ki, negdi*, dazu der Abschiedsgruß „Faljen Isus“.
- **Sarajevo-Bosnisch:**
  - Mala: *pendžer, furune, šemsije, haman, mehke, skontao*.
  - Marko zu Mala: *kahva, nana* (Großmutter), *trojka* (Linie 3), „Hajmo kući“.
- **Anrede:** Ivka und Zdenka duzen Marko („sinko“, „mali“), wie es eine alte Splitterin täte; im Deutschen siezen sie ihn.
- **Weggefallene Erklärungen:** Wo das deutsche Original kroatische Sätze für deutsche Spieler übersetzt (Tonćis Postkarte, Brunos Satzbruchstücke, Schilder), steht in der BHS-Fassung nur noch das Kroatische, oder Marko reagiert mit einem ganzen Satz.
- **Brunos Rätsel:**
  - Brunos Bruchstücke bleiben dreisprachig: Kroatisch, Italienisch und die deutschen Wörter „versteckt“ und „weil“.
  - Die fünf Teile haben je drei Fassungen, in derselben Reihenfolge wie im Original. Die richtige Auswahl ergibt „Ljerka, oprosti mi. Sakrio sam tvoje pismo iz Zagreba jer sam se bojao da ću ostati sam. Sviraj opet.“
- **Schrift:** Die Schrift kennt kein Kreuz; in der Todesanzeige steht deshalb „+“.
- **Kapitel 2:** bisher nur Deutsch.
