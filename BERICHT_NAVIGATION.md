# MALA – Stadtplan, Hinweise in vier Stufen, Doppelklick auf Ausgänge

Bericht zur Umsetzung des Entwicklungsauftrags „Stadtkarte, mehrstufiges Hinweissystem und sofortiges Verlassen von Schauplätzen“. Alle drei Teile sind im Spiel umgesetzt (`web/index.html`). Die vollständigen Hinweistexte mit Lösungen stehen getrennt in [`HINWEISE.md`](HINWEISE.md).

## 1. Bestandsaufnahme vor dem Umbau

| Bereich | Vorher | Lücke |
|---|---|---|
| Stadtplan | Ein eigener Raum `map`. Ein Ausgang „In die Stadt“ wechselte in diesen Raum, die Wahl eines Ortes wechselte ein zweites Mal. | Zwei Übergänge pro Reise. Kein Zurück: Der Knopf `back` hatte die Fläche 0 × 0, man musste den aktuellen Ort wählen und betrat ihn neu. Kein Kartenknopf. Unbekannte Orte waren als blasse Symbole sichtbar und verrieten spätere Schauplätze. Gründe für Sperren erfuhr man erst beim Antippen. |
| Ortswissen | `GS.map[id]` hieß „freigeschaltet“. | Kein Zustand „bekannt, aber noch nicht erreichbar“. |
| Hinweise | Nur Kapitel 2, drei Stufen, nur über das Menü. | Kapitel 1 ohne Hinweise. Kein Gespräch mit Mala. Keine Rückfrage vor dem Schritt. Der Stand stand in `flags`. Einige Thementitel verrieten Schlüsse vorab (schon im Trailer-Bericht vermerkt). |
| Doppelklick | Im Code vorhanden (700 ms). | Wirkte fast nie: 54 von 56 Ausgängen öffneten beim ersten Klick ein Menü („Hingehen / Schau an“). Der zweite Klick setzte die Figur sprunghaft um und rief die Ausgangsprüfung (`canExit`) ein zweites Mal auf. |
| Testzugang | `M.TA.travel` setzte den Raum direkt, ohne Prüfungen. | Das verdeckte einen echten Fehler, siehe unten. |

**Gefundener und behobener Spielfehler (Kapitel 2, Fall 2):**
- Die Miljacka (Obala) mit Milka und der Restauratorin am Bauzaun ist am Montag Pflicht. Auf dem Stadtplan erschien sie aber erst am Abend.
- Ein Spieler kam dort deshalb nicht weiter. Der alte Testdurchlauf merkte das nicht, weil er per Teleport reiste.
- Jetzt erscheint die Obala, sobald ihre Adresse bekannt ist: aus Jakobs Ankaufbuch („Obala 14“) oder aus Ivans „Ich wohne an der Obala“.
- Ältere Spielstände bekommen die Freigabe beim Laden aus denselben Notizen nachgetragen.

**Ebenfalls behoben:** Die Menüüberschrift zeigte in Kapitel 2 „Kapitel 1: Split“.

## 2. Was umgesetzt ist

### A. Stadtplan (`game/src/17_map.js`)

- **Overlay statt Raum:** Der Plan liegt über dem Raum, in dem Marko steht. Er öffnet sich über einen Ausgang „In die Stadt“, über den neuen Knopf **Karte** in der Leiste oder mit der Taste **K**. Geschlossen wird er mit **Schließen** (78 × 24 Spielpixel) oder **Esc**.
- **Ortszustände:**

  | Zustand | Darstellung und Verhalten |
  |---|---|
  | unbekannt | Kein Symbol, kein Name, keine Silhouette, keine Trefferfläche. |
  | bekannt, gesperrt | Blasses Symbol mit Schloss und gedämpftem Namen. Ein Tipp gibt Markos Grund, zum Beispiel „Vratnik. Dort hat Großmutter gewohnt. So weit bin ich noch nicht.“ |
  | erreichbar | Normales Symbol und Name. Ein Tipp reist sofort, ohne Bestätigung. |
  | aktueller Ort | Pulsierender Ring. Ein Tipp schließt nur den Plan, der Raum startet nicht neu. |
  | gerade nicht erreichbar | Gestrichelter Ring, grauer Name. Der Grund kommt aus derselben Prüfung wie beim Reisen (`M.canTravel`), etwa Tageszeit, Begleitung oder ein ausstehendes Ereignis. Ein Tipp spricht genau diesen Satz. |

- **Bekannte Orte:** „Bekannt“ ergibt sich nur aus dem, was Marko wirklich erfahren hat (`M.MAP_KNOW`), zum Beispiel:
  - Fährhafen aus Lukas Treffpunkt „Kiosk am Fährterminal“;
  - Baščaršija nach der Ankunft mit der Straßenbahn;
  - Pension aus Sanjas Zimmer;
  - Vratnik aus Rades „Ruža aus Vratnik“;
  - Alipašino Polje aus Jakobs Foto.

  Freigeschaltet wird weiterhin nur durch die Geschichte (`A.unlock`).
- **Innenräume:** Sie haben keinen eigenen Kartenpunkt. Sie gehören zu ihrer Straße, und Ankunftsort ist der reguläre Eingang. Aus einem Innenraum heraus zeigt der Plan den Standort, reist aber nicht: „Von hier drinnen nicht. Erst muss ich hinaus auf die Straße.“ So läuft man nicht an Ereignissen auf den Zwischenwegen vorbei, etwa beim Verlassen von Ivkas Wohnung.
- **Gleiche Prüfungen wie zu Fuß:**
  - Über den Knopf laufen zuerst die Prüfung des Straßenausgangs (`canExit`, mit allen Pflichtszenen) und dann `M.canTravel`.
  - Über einen Ausgang ist dessen Prüfung schon gelaufen; sie wird nicht wiederholt.
  - Mala allein reist nicht („Ohne Marko gehe ich nirgends hin.“). Mala kommt mit, wenn sie auch bei einem normalen Ausgang mitkäme.
- **Gesperrt mit Meldung:** In der Zwischenwelt, in der Straßenbahn, während Szenen, Auswahlen, Karten und Menü.
- **Touch:**
  - Jeder Ort hat eine Trefferfläche von 20 Spielpixeln Radius um sein Symbol. Bei zwei nahen Orten entscheidet der nähere.
  - Das Bar-Symbol wurde um 9 Pixel von der Wohnung abgerückt.
  - Gerechnet für das iPad-Querformat (1024 × 768, 3 CSS-Pixel je Spielpixel): Radius ≥ 37 CSS-Pixel, „Schließen“ 234 × 72 CSS-Pixel.
  - Beim Darüberfahren mit der Maus erscheinen Name und Grund in der Leiste. Das ist nur ein Zusatz: Ein Tipp liefert dieselbe Auskunft.
- **Beschriftung:** Die Namen setzt der Plan selbst, ohne Überlappung. Eine Zeichenerklärung („hier · gerade nicht · noch nicht“) steht unten.
- **Keine Checkliste:** Keine Prozente und keine Aufgabenmarker.

### B. Hinweise in vier Stufen (`15_hints.js`, Daten in `15_hints_k1.js` und `15_hints_k2.js`)

- **Stufen:** Je Rätselabschnitt gibt es vier Stufen:
  1. Problem einordnen
  2. Denkrichtung
  3. Konkreter Ansatz
  4. Nächster Schritt

  Vor Stufe 4 fragt Mala: „Soll ich dir den konkreten nächsten Schritt verraten?“ Allein fragt sich Marko: „Will ich den nächsten Schritt wirklich schon wissen?“
- **Zugang:**
  - Im Gespräch mit Mala über „Ich komme gerade nicht weiter.“ (Kapitel 1 und 2);
  - über das Menü „Hinweis …“. Das ist dasselbe System, mit Mala, wenn sie da ist.
- **Ohne Mala:** Wenn Mala fehlt, etwa morgens nach Ivka, in der Stimmenphase, vor dem Kennenlernen oder in einem anderen Raum, heißt es „Gedanken ordnen“. Dann gibt es nur Markos Stimme, kein Bild und keine Stimme von Mala, und es ist vom Notizbuch-Nachdenken getrennt.
- **In jeder Stufe wählbar:** „Noch einmal“, die nächste Stufe, „Etwas anderes“ oder Ende.
- **Umfang:** 76 Themen für Kapitel 1 und 51 für Kapitel 2 decken alle Pflichträtsel ab. Ein gelöster Abschnitt verschwindet. Der nächste ist ein eigenes Thema und beginnt bei Stufe 1.
- **Stand der Hinweise:**
  - Vor jeder Ausgabe wird der Spielstand neu geprüft („Das hat sich erledigt.“).
  - Stufentexte, die vom Inventar abhängen, lesen den Stand, zum Beispiel ob die Zeitung, der Rekorder oder die Batterien schon da sind und ob der Kiosk bekannt ist.
  - Thementitel nennen nur, was Marko schon weiß. „Der Junge in der Drei“ heißt jetzt „Zwei Kinder in der Drei“.
- **Hinweise verändern nichts:** Es wird nur die Hinweisgeschichte geschrieben. Keine Notiz, kein Schalter, kein Gegenstand, kein „gesehen“-Vermerk und kein Ortswechsel. Normales Reden mit Mala ändert keine Stufe.
- **Speichern:**
  - Der Stand liegt getrennt in `GS.hints[thema] = {s: Stufe, n: Abrufe}`.
  - Alte Stände werden übernommen: die Schalter `hint.<id>`, wobei die alte Stufe 3 („Schritt verraten“) zu 4 wird.
- **Sprachen:** Für Kapitel 1 gibt es alle Texte auch auf Bosnisch/Kroatisch (`lang/bhs_nav.js`, rund 570 Einträge). Kapitel 2 bleibt in dieser Sprachfassung wie bisher deutsch.

### C. Doppelklick und Doppeltipp auf Ausgänge (`05_engine.js`, `06_ui.js`, `99_main.js`)

- **Erster und zweiter Klick:**
  - Reine Ausgänge gehen jetzt beim ersten Klick los, ohne Menü.
  - Ein zweiter Klick auf **denselben Ausgang** (Raum- und Hotspot-Kennung) innerhalb von `M.DBL_MS = 350` ms überspringt den Rest des Weges und startet den regulären Wechsel. Das Fenster ist einstellbar.
- **Prüfungen:**
  - `canExit` läuft einmal, beim ersten Klick. Eine Absage kommt genau einmal.
  - Der zweite Tipp eines Doppeltipps überspringt keinen Satz.
- **Nach dem Wechsel:** Für 350 ms wirkt kein Klick im neuen Raum, ein dritter Klick löst also nichts aus. Veraltete Aufträge verfallen über `exitTok`: ein neuer Klick, ein anderer Raum oder ein Wechsel, der schon läuft.
- **Kein falscher Doppeltipp:**
  - Nur der erste Finger zählt (`isPrimary`).
  - Ziehen über das Bild ist kein Tippen.
  - Ziehen aus dem Inventar bleibt Benutzen.
  - Overlays (Karte, Dialog, Menü, Inventar) haben Vorrang.
- **Zoom:** Doppeltipp-Zoom ist am Canvas zusätzlich verhindert (`dblclick`, schnelles `touchend`).
- **Erklärung:**
  - Einmal pro Gerät beim ersten längeren Weg zu einem Ausgang (`localStorage`, nicht im Spielstand).
  - Dauerhaft in der Spielanleitung: Doppelklick, Karte, Taste K und Hinweise.
- **Ausnahme:** Ausgänge mit eigenen Verben (zum Beispiel „Öffne“ an Archiv-, Kühlraum- und Schuppentür) behalten ihr Menü. Dort gibt es keinen Doppelklick.

### D. Ein Weg für alle Ortswechsel

- **Ein Übergang:** Ausgang, Doppelklick und Karte enden alle in `M.transition(ziel, optionen)`. Dort gilt: höchstens ein Übergang zur Zeit, danach `gotoRoom` mit `leave`, Überblendung, Eingang, `enter`, Vorstellungen und Autosave.
- **Herkunft „vom Stadtplan“:** Sie bleibt erhalten (`via:'map'`). Eingänge und Ereignisse wie die Mittagsglocken am Peristil funktionieren deshalb wie vorher.
- **Kein Dauerzustand:** Laden, neues Spiel und Titelbild setzen „Übergang läuft“ und „zweiter Klick erwartet“ zurück. Gefunden hat das der Test: Wurde mitten im Wechsel geladen, blieben vorher alle Ausgänge gesperrt.
- **Gespeichert werden** nur `GS.mapKnown` (bekannte Orte) und `GS.hints` (Hinweisgeschichte), beide getrennt.
- **Migration:**
  - Sie leitet bekannte Orte aus Notizen ab und holt die Obala-Freigabe nach.
  - Sie schaltet nie pauschal frei und setzt keinen Fall zurück.
- **Service Worker:** Die Version ergibt sich beim Bauen aus dem Inhalt. Neu ist `mala-split-…` (siehe `web/sw.js`). Karten- und Hinweisdaten stecken in `index.html` und sind damit offline verfügbar.

## 3. Steuerung (Kurzfassung)

| Aktion | Maus | Touch | Taste |
|---|---|---|---|
| Ausgang nehmen | Klick | Tipp | – |
| Weg zum Ausgang überspringen | Doppelklick | Doppeltipp | – |
| Stadtplan öffnen | Knopf „Karte“ | Knopf „Karte“ | K |
| Stadtplan schließen | „Schließen“ | „Schließen“ | Esc oder K |
| Hinweis | Mala: „Ich komme gerade nicht weiter.“ / Menü „Hinweis …“ | ebenso | – |

## 4. Drei Beispiele mit allen vier Stufen

Aus dem automatischen Test (`game/tools/navtests.js`), mit den Texten, wie sie im Spiel gesprochen wurden (`game/tools/navtests_beispiele.json`):

**Inventarrätsel: Der verschnürte Schuhkarton** · Prolog, Ivkas Wohnung · Marko allein („Gedanken ordnen“, Mala ist noch nicht da)

1. *Problem einordnen:* „Ein Schuhkarton, mit einem festen Knoten verschnürt. Schneiden würde zerstören, was Ivka so sorgfältig verschnürt hat.“
2. *Denkrichtung:* „Einen festen Knoten löst man mit etwas Dünnem, Spitzem, nicht mit Gewalt. In einer Wohnung, in der gestrickt wurde, liegt so etwas herum.“
3. *Konkreter Ansatz:* „Im Nähkorb liegen Stricknadeln.“
4. *Nächster Schritt (nach „Ja“ auf die Rückfrage):* „Eine Stricknadel aus dem Nähkorb nehmen und den Schuhkarton damit benutzen.“

**Notizbuchaufgabe: Keine Kontakte?** · Prolog, Veli Varoš · Marko allein

1. *Problem einordnen:* „Die Stadt schreibt: alleinstehend, keine Kontakte. Das Strickheft erzählt etwas anderes.“
2. *Denkrichtung:* „Zwei Aussagen über Ivka, die nicht zusammenpassen. Das Notizbuch kann sie gegeneinander halten.“
3. *Konkreter Ansatz:* „Die Notiz der Stadt und Ivkas Strickheft gehören zusammen.“
4. *Nächster Schritt (nach „Ja“ auf die Rückfrage):* „Im Notizbuch „Laut Stadt: keine Kontakte“ mit „Ivkas Strickheft“ verbinden.“

**Kooperationsrätsel: Wo steht der Band 1984?** · Erster Fall, Hafenbüro · Mala spricht (Gespräch mit Mala → „Ich komme gerade nicht weiter.“)

1. *Problem einordnen:* „Irgendwo im Archiv steht der Band 1984. Nur nicht da, wo er hingehört.“
2. *Denkrichtung:* „Ein ausgeblichenes Rückenschild verrät mit Augen nichts mehr. Es braucht ein anderes Gespür.“
3. *Konkreter Ansatz:* „Ich gehe durch die Tür „SAMO OSOBLJE“. Bei einem ausgeblichenen Ordner reicht Ansehen nicht.“
4. *Nächster Schritt (nach „Ja“ auf die Rückfrage):* „Zu mir wechseln, ins Archiv gehen und den Ordner im Fach „1948“ spüren.“

In allen drei Fällen geprüft:
- Jede Stufe ist ein neuer Satz.
- „Nein“ auf die Rückfrage bleibt bei Stufe 3.
- Danach hat sich am Spielstand nur `GS.hints` geändert: keine Schalter, Notizen, Gegenstände, „gesehen“-Vermerke oder Zähler.

## 5. Prüfungen

Die Angaben sind getrennt nach der Art der Prüfung. Alle Läufe stammen vom endgültigen Build.

**Statische Codeprüfung**
- Syntaxprüfung jeder Quelldatei beim Bauen (`game/build.js`).
- `game/tools/i18n_check.js` für die neuen BHS-Texte: keine Tippfehler, keine fremden Zeichen. Bewusst offen bleiben nur die drei Kapitel-2-Gründe.
- `game/tools/hintcheck.js` an 128 echten Zwischenständen beider Musterlösungen:
  - jeder Stufentext für Mala und Marko vorhanden;
  - kein offenes Thema nennt einen unbekannten Ort;
  - kein Thema aus dem anderen Kapitel.
  - Ergebnis: **OK**. 8 Treffer „verbrauchter Gegenstand“ sind gesichtet und sind Fehlalarme: Gemeint sind Malas und Lanas Fahrscheine, nicht Markos alter.

**Automatisierte Tests im Browser (Chromium, ohne Bildschirm, echte Maus- und Touch-Ereignisse auf dem Canvas)**

| Testreihe | Ergebnis |
|---|---|
| `navtests.js`: Stadtplan, Doppelklick, Hinweise, Übergänge, Speichern (neu, entlang der Testtabelle) | **51 / 51** |
| `walkthrough.js`: Kapitel 1 ganz, jetzt mit echten Kartenreisen statt Teleport | **OK**, keine JS-Fehler |
| `walkthrough2.js`: Kapitel 2 ganz, ebenso | **OK**, keine JS-Fehler |
| Hinweisprotokoll beider Durchläufe (nach jeder Aktion) | Kein spielbarer Zwischenstand ohne offenes Hinweisthema. 119 von 127 Themen waren im Lauf offen. Die übrigen 8 kommen nur innerhalb laufender Gespräche oder auf Nebenwegen vor, etwa „Dann sieh nach“ erst ablehnen. |
| `offlinetest.js`: über http laden, Netz trennen, neu laden | **OK**. Neue Version `mala-split-647fc4e180` im Offline-Speicher; Spielstand, Hinweisgeschichte und bekannte Orte laden offline. |
| `einstiegtests.js` (vorhanden) | **39 / 39** |
| `k2tests.js` (vorhanden, auf vier Stufen umgestellt) | **33 / 33** |
| `pruefbericht.js` (vorhanden) | **80 / 80** |

**Abgedeckte Bereiche der Testtabelle (`navtests.js`)**
- **Neues Spiel:** Nur die Wohnung ist bekannt.
- **Neu bekanntes Ziel:**
  - Bar und Varoš nach dem Anrufbeantworter, Varoš zunächst „gerade nicht“ mit Sanjas Grund.
  - Ein Tipp darauf gibt genau einen Satz.
- **Verschlossener Innenraum:**
  - Doppelklick aufs geschlossene Hafenbüro gibt kein Übergang und genau eine Absage.
  - Die Karte hat keinen Punkt für Innenräume.
  - Aus dem Hafenbüro reist man nicht, mit Begründung.
- **Aktueller Ort:** Ein Tipp schließt nur die Karte.
- **Wichtiger Übergang:** Tür, Doppelklick und Karte lösen in der Wohnung am Mittwoch dasselbe Kennenlernen aus. Keiner der drei Wege verlässt die Wohnung.
- **Doppelklick nahe am Ausgang:**
  - Gehen, Doppelklick, Dreifachklick und Doppelklick direkt am Ausgang ergeben je genau einen Übergang.
  - Kein Klick wirkt im neuen Raum.
- **Zustandsvergleich:**
  - Gehen, Doppelklick und Dreifachklick zum Laden „Okvir“ ergeben denselben Spielstand.
  - Ausgang + Karte, Doppelklick + Karte und Knopf + Karte zur Riva ebenso, Mala inklusive. Jeweils mit Autosave.
- **Mala nicht verfügbar:**
  - Allein heißt es „Gedanken ordnen“, nur mit Markos Stimme.
  - Eine Kartenreise erzeugt keine Erscheinung, keine Stimme und keinen Wechsel.
- **Mala allein:** Sie reist nicht über die Karte.
- **Sperren:** In der Zwischenwelt (mit Meldung) und während einer Gesprächsauswahl geht die Karte nicht auf.
- **Hinweisstufen:** drei Beispiele, siehe oben.
- **Gelöster Teilschritt:**
  - Ein gelöstes Thema verschwindet, das nächste beginnt bei Stufe 1.
  - Wird ein Thema während einer offenen Sitzung gelöst, kommt „Das hat sich erledigt.“
- **Abweichende Reihenfolge:** Der Rekorder-Strang im zweiten Fall richtet den nächsten Schritt nach dem Stand. Fünf Varianten: ohne Zeitung, mit Zeitung, Rekorder ohne bekannten Kiosk, mit Kiosk, Rekorder mit Batterien.
- **Speichern und Laden:**
  - Die Hinweisstufe übersteht Speichern, Neuladen der Seite und Laden.
  - Ein neues Spiel beginnt leer.
  - Ein anderer Speicherplatz bringt seine eigene Geschichte.
  - Ein alter Stand wird übernommen (3 → 4), ohne pauschale Freischaltung, und bekannte Orte werden abgeleitet.
  - Nichts Vorübergehendes steht im Spielstand.
- **Touch und Inventarziehen:**
  - Ein Doppeltipp ergibt einen Übergang aus zwei Eingaben, ohne zusätzliches Mausereignis.
  - Wischen über das Bild löst nichts aus.
  - Ein Gegenstand, der auf den Ausgang gezogen wird, wird benutzt; Marko verlässt den Raum nicht.
  - Ein zweiter Finger zählt nicht.
  - Kein Zoom.
  - Ein Tipp 12 Pixel neben einem Ortssymbol trifft den Ort.

**Browserprüfung (Augenschein):** Bildschirmfotos von beiden Stadtplänen und der Leiste mit „Karte“ in Chromium. Dabei habe ich überlappende Ortsnamen gefunden und behoben.

**Touch-Emulation:** Chromium mit `hasTouch`/`isMobile`, 1024 × 768, Pixelverhältnis 2. Die Touch-Ereignisse kommen über das DevTools-Protokoll. Das ist eine Emulation, kein Gerät.

**Echter Gerätetest:** **keiner.** Es wurde kein iPad und kein anderes reales Gerät verwendet. Safari und Firefox sind nicht geprüft.

**Während der Arbeit durch die Tests gefunden und behoben:**
- Obala-Freigabe in Kapitel 2 (Spielfehler aus der Vorversion).
- Ein Laden mitten im Ortswechsel sperrte alle Ausgänge.
- Die Nachzüge für alte Spielstände liefen nicht, weil `M.migrateSave` später überschrieben wurde; jetzt läuft eine eigene Liste `M.MIGRATE`.
- Ein sehr schneller Tipp direkt nach dem Öffnen der Karte ging ins Leere.
- Überlappende Ortsnamen.
- Zwei Hinweise nannten die Baščaršija vor ihrer Zeit.
- Im Finale fehlte ein Hinweis zwischen „Karton abgeholt“ und „Karton geöffnet“.

## 6. Einschränkungen und offene Punkte

- **Kein echtes Gerät getestet.** Kein iPad, kein iPhone, kein Android, kein Safari, kein Firefox. Touch ist nur in der Chromium-Emulation geprüft. Die Werte für das iPad sind aus der Skalierung des Spiels gerechnet, nicht gemessen.
- **Innenräume:** Aus einem Innenraum heraus zeigt der Stadtplan den Standort, reist aber nicht. Das ist eine bewusste Regel, weil Zwischenwege eigene Ereignisse haben.
- **„Schau an“ an reinen Ausgängen:** Diese 46 Ausgänge haben kein Menü mehr, ihr bisheriger Beschreibungssatz ist im Spiel nicht mehr erreichbar. Das war Zierde, keine Rätselinformation. Ausgänge mit eigenen Verben behalten Menü und Beschreibung.
- **Hinweisabdeckung:** Geprüft ist sie entlang der Musterlösungen beider Kapitel und für gezielt veränderte Reihenfolgen (Inventarvarianten). Jeden denkbaren Umweg kann ein Durchlauf nicht ablaufen. Themen, die nur auf Nebenwegen oder mit alten Spielständen aufgehen, sind im Prüfprotokoll als „nie offen“ aufgeführt.
- **BHS:** Die Übersetzung der neuen Texte (`lang/bhs_nav.js`) stammt aus diesem Arbeitsgang und ist nicht von Muttersprachlern gegengelesen. Die unsicheren Wörter sind in der Datei vermerkt, etwa „Karta“, „kuhinjski kutak“, „predvorje“. Die Gründe für gesperrte Orte in Kapitel 2 bleiben deutsch, wie das ganze Kapitel in dieser Sprachfassung.
- **Beigefügte PDF:** Sie ist die Lösung zu *The Blackwell **Legacy*** (Michael Gray, 2013), nicht zu *Deception*. Der Auftragstext spricht von der Deception-Lösung und Joeys Hilfe im Dialog. Für die Umsetzung spielt das keine Rolle: Das vierstufige System ist, wie im Auftrag gesagt, ein eigener Entwurf für MALA.
