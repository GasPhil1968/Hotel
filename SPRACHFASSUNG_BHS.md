# MALA – bosnisch-kroatische Sprachfassung (BHS)

Stand: Kapitel 1 (Split). Kapitel 2 (Sarajevo) läuft in dieser Sprachfassung vorerst auf Deutsch; das Spiel sagt das beim Start von Kapitel 2.

## Einschalten

Im Titelmenü oder im Spielmenü: **„Sprache: Deutsch“** antippen → **„Jezik: bosanski / hrvatski“**. Die Wahl bleibt gespeichert. Spielstände gelten für beide Sprachen: Man kann mitten im Spiel umschalten.

## Wer spricht was

| Figur | Sprachform |
|---|---|
| **Marko** mit allen anderen | Standardkroatisch |
| **Marko mit Mala** | Sarajevo-Bosnisch (mit ihr klingt er wie der Junge aus Sarajevo, der er war) |
| **Mala** | Sarajevo-Bosnisch der frühen Neunziger |
| **Ivka, Zdenka, Jakov** | Čakavisch aus Split (Veli Varoš), gut lesbar |
| alle anderen Splitter (Bruno, Ljerka, Dinko, Luka, Sanja, Nina, Mira, Mladen, Vesna, Stipe, Frane) | Standardkroatisch mit einzelnen Split-Wörtern |
| Erzähler, Menüs, Notizbuch, Gegenstände | Standardkroatisch |
| Briefe, Register, Schilder | wie im Original (schon kroatisch) |

Die verbindlichen Stilvorgaben für alle Übersetzungen stehen in `game/STYLE_BHS.md`.

## Technik

- Übersetzt wird erst bei der Anzeige (`game/src/00z_i18n.js`). Spiellogik, Rätselprüfung, Spielstände und Tests arbeiten weiter mit den deutschen Texten. Deshalb kann die Sprachfassung keine Rätsel oder Spielstände beschädigen.
- Die Übersetzungen liegen in `game/src/lang/bhs_*.js`: deutsche Sätze als Schlüssel, bosnisch-kroatische als Werte. Gleiche deutsche Sätze verschiedener Sprecher haben eigene Einträge (`'@ivka:…'`), und Markos Sätze an Mala können eine bosnische Fassung haben (`{ hr, bs }`).
- Fehlt eine Übersetzung, erscheint der deutsche Text. Das soll nicht vorkommen; die Tests unten finden solche Stellen.

## Prüfen

```
node game/tools/i18n_check.js game/src/lang <Quelldateien>   # Schlüssel, fehlende Texte, Zeichen
MALA_LANG=bhs node game/tools/walkthrough.js                # ganzes Kapitel 1 auf BHS, meldet jeden noch deutschen Text
```

## Grenzen

- Die Übersetzung ist maschinell-literarisch erstellt und nach festen Regeln geprüft. **Eine Durchsicht durch Muttersprachler, besonders für das Čakavische und das Sarajevo-Bosnische, ist empfehlenswert.** Die Übersetzer haben unsichere Stellen notiert (siehe unten).
- Schilder in den Bildern (gemalte Schrift) sind schon im Original kroatisch und bleiben unverändert.
