# MALA – bosnisch-kroatische Sprachfassung (BHS)

Stand: **Kapitel 1 (Split) vollständig übersetzt.** Kapitel 2 (Sarajevo) läuft in dieser Sprachfassung vorerst auf Deutsch; das Spiel sagt das bei der Wahl des Speicherplatzes für Kapitel 2.

## Einschalten

Im Titelmenü oder im Spielmenü **„Sprache: Deutsch“** antippen. Dann steht dort **„Jezik: bosanski / hrvatski“**. Die Wahl bleibt gespeichert. Spielstände gelten für beide Sprachen, man kann auch mitten im Spiel umschalten.

## Wer spricht was

| Figur | Sprachform | Beispiel aus dem Spiel |
|---|---|---|
| **Marko** mit allen anderen | Standardkroatisch | „…Glavobolja. Naravno.“ |
| **Marko mit Mala** | Sarajevo-Bosnisch: mit ihr klingt er wie der Junge aus Sarajevo, der er war | „Niko. Naravno da niko.“ |
| **Mala** | Sarajevo-Bosnisch der frühen Neunziger | „Ima ljudi koji ne mogu dalje.“ |
| **Ivka, Zdenka, Jakov** | Čakavisch aus Split (Veli Varoš), gut lesbar | Ivka: „Je li brod iz Supetra već doša? Ne vidin ga.“ · Zdenka: „Ča je, mali? Tražiš koga?“ · Jakov: „Dobra večer. Kasno je za špacir. Pazi di staješ.“ |
| alle anderen Splitter | Standardkroatisch mit einzelnen Split-Wörtern | Sanja: „Marko. Ka i uvik?“ · Stipe: „Ili sjedni ili aj, samo mi ne stoj na svjetlu.“ |
| Erzähler, Menüs, Notizbuch, Gegenstände | Standardkroatisch | „Već tri dana jugo. Topla kiša, težak zrak i glava kao od olova.“ |
| Briefe, Postkarten, Register, Schilder | wie im Original (schon kroatisch) | „Draga mama, dolazim 22. s brodom u sedam.“ |

Die verbindlichen Stilvorgaben stehen in `game/STYLE_BHS.md`.

## Umfang

- 8 Dateien in `game/src/lang/` mit rund 2.950 Einträgen: die Oberfläche, sechs Teile von Kapitel 1 und ein Abgleich.
- Gezählt sind alle 2.980 sichtbaren Texte aus den 29 Quelldateien von Kapitel 1 und der Oberfläche. Kein Text ist ohne Übersetzung.
- `bhs_k1_z.js` gleicht 20 Sätze ab, die in mehreren Räumen vorkommen und dort zuerst verschieden übersetzt waren.

## Technik

- Übersetzt wird erst bei der Anzeige (`game/src/00z_i18n.js`). Spiellogik, Rätselprüfung, Spielstände und Tests arbeiten weiter mit den deutschen Texten. Deshalb kann die Sprachfassung keine Rätsel und keine Spielstände beschädigen.
- Gleiche deutsche Sätze verschiedener Sprecher haben eigene Einträge, zum Beispiel `'@ivka:…'` für Ivkas Čakavisch.
- Markos Sätze an Mala können eine bosnische Fassung haben (`{ hr, bs }`). Ob Marko gerade mit Mala spricht, erkennt das Spiel am Gesprächspartner und an Malas letztem Satz (nur wenige Sekunden lang, beim Ortswechsel vergessen).
- Fehlt eine Übersetzung, erscheint der deutsche Text. Die Tests unten finden solche Stellen.

## Tatsächlich ausgeführte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Statische Prüfung aller Quelldateien von Kapitel 1 (`i18n_check.js`) | 2.980 sichtbare Texte, **0 fehlen**, keine Tippfehler in Schlüsseln, keine fremden Schriftzeichen |
| Kompletter Durchlauf von Kapitel 1 **auf BHS** (`MALA_LANG=bhs walkthrough.js`) | 53 Schritte bis zum Abspann, keine JS-Fehler, **kein angezeigter Text auf Deutsch**, kein Text läuft aus dem Bild |
| Bilder: der erste Satz jeder Figur in ihrer Sprachform | 18 Figuren, alle richtig (Galerie im Bericht der Sitzung) |
| Deutsche Fassung danach | Kapitel 1 und 2 laufen weiter komplett durch (siehe `BERICHT_K2.md`) |

## Was beim Übersetzen am Original verbessert wurde

- **Sprecher:** Antworten auf Notizbuch-Fragen und auf übergebene Gegenstände, die als einfacher Text hinterlegt sind, sprach bisher Marko mit seinem eigenen Porträt, etwa Dinkos „Ich sage es nicht noch einmal.“ Jetzt spricht sie die gefragte Figur. Das gilt für beide Sprachen und beide Kapitel.
- **Datum:** Die Postkarte ist am 18. Dezember gestempelt. Marko sagte dazu „Vier Tage vor Weihnachten“, jetzt sagt er „Vier Tage vor dem Boot um sieben“, denn das Boot ging am 22.
- **1984:** In Dinkos Erinnerung heißt die Polizei jetzt „milicija“, wie damals in Jugoslawien.

## Grenzen und Bitte um Gegenlesen

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
