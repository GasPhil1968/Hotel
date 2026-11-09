# „Die Stillen“ (MALA) – Rätseldesign, Geschichte und Figuren nach Ron Gilbert

**Analyse aller fünf Kapitel** · Stand 9. November 2026 · Commit `366c256` · keine Spieldateien geändert

> **Nachtrag (Umsetzung):** Die Muss-Liste P01–P12 aus Abschnitt G ist umgesetzt und geprüft. Was geändert wurde, wie es geprüft ist und was die neue Hinweisprobe gefunden hat, steht in **Abschnitt J**. Die Abschnitte A–I beschreiben unverändert den Stand vor der Umsetzung.

Grundlage ist Ron Gilberts Essay „Why Adventure Games Suck And What We Can Do About It“ (1989, veröffentlicht 2004). Untersucht ist die aktuelle Fassung des Spiels; im Auftrag heißt es noch MALA. Der Bericht trennt drei Dinge: was im Essay steht, wie ich es auf ein heutiges Point-and-Click-Adventure übertrage, und welche Maßstäbe eigens für dieses Spiel gelten (M1–M5).

**Lesehilfe.**
- Befunde tragen Kennungen wie **K2-B01** (Kapitel 2, Befund 1), Rätselketten wie **K2-R19**, Vorschläge wie **P01**.
- Fundstellen sind relativ zu `game/src/` angegeben, sofern nicht anders vermerkt.
- Belegarten: **[beobachtet]** im laufenden Spiel bzw. an echten Spielständen gemessen · **[Code]** im Code nachgewiesen · **[abgeleitet]** aus Indizien geschlossen · **[zu prüfen]** offen. „nachgeprüft“ heißt: von mir selbst an der Fundstelle oder im Spiel bestätigt.
- Beispielsätze in den Vorschlägen sind **Neuentwurf**.

**Inhalt:** A. Gesamturteil · B. Material- und Prüfstatus · C. Prüfraster · D. Kapitelübersicht · E. Rätselinventar und Detailanalyse · F. Kapitelübergreifende Analyse · G. Konkrete Überarbeitungen · H. Umsetzungs- und Prüfplan · I. Offene Punkte

## A. Gesamturteil

**Kurz:** „Die Stillen“ folgt Gilberts Grundsätzen in der Anlage weitgehend und an mehreren Stellen vorbildlich. Die größten Abweichungen liegen nicht in der Struktur, sondern in der **Rückmeldung**: Das Spiel erkennt richtige Ideen oft nicht an, an einigen Stellen weist es sie sogar mit einer falschen Begründung ab. Dazu kommt eine echte Sackgasse in Kapitel 2. Und viele Schlüsse spricht das Spiel selbst aus, bevor der Spieler sie zieht.

**Stärken, die den Kern des Spiels ausmachen:**

1. **Kein Tod, keine Echtzeitfalle, keine Uhr gegen den Spieler.** Tage und Tageszeiten wechseln nur durch Handlungen. Die wenigen Zeitfenster sind großzügig und wiederholbar (Muster 4). Gilberts G3 und G7 sind erfüllt; Speichern dient zum Aufhören, nicht als Verteidigung (mit der einen Ausnahme K2-B01).
2. **Jede Sperre hat einen Grund in der Welt**, und fast jede Ortsfreigabe hängt an einer Handlung, die damit zu tun hat (Brotdose → Heim, Malas Zettel → Bank). G11 ist überwiegend erfüllt.
3. **Rätsel tragen die Geschichte.** Es gibt praktisch keine Füllrätsel; jede Kette erzählt etwas über einen Menschen, der wartet (G6). Die Nebenfiguren haben eigene Motive.
4. **Die beiden Figuren sind wirklich verschieden und brauchen einander.** Malas Grenzen werden gezeigt, bevor sie entscheiden (keine Brücke, kein Anfassen, Licht im Dunkeln). Die besten Rätsel des Spiels sind Kooperationen: Schutzraum (K2), Lichtprobe über zwei Ufer (K3), die zwei Versuche im Heim (K4), Hamdija (K5).
5. **Das Verbmenü bietet nur wirksame Verben an**, „Zeigen“ hebt alle Stellen hervor, Hinweise gibt es nur auf Wunsch in vier Stufen. Gilberts „second guess the parser“ kommt nicht vor (G10 bei Verben erfüllt).

**Schwächen, nach Gewicht:**

1. **Eine echte Sackgasse (Kritisch, im Spiel nachgestellt):** Gibt man im Finale von Kapitel 2 die ungelesene Rotkreuz-Nachricht Nada, ist das Kapitel nicht mehr abschließbar (K2-B01).
2. **Absagen, die richtige Ideen abweisen (Hoch, alle Kapitel ab K2):** Die Satzpools für falsche Notizpaare behaupten Dinge – „Mit Mala hat das nichts zu tun“, „Ich suche einen Zusammenhang, den ich mir wünsche“, „Ich sollte sie nicht ineinanderschieben“ – und treffen dabei genau die Verbindungen, um die es geht (Muster 7; K2-B03, K3-B05, K4-B02, K5-B01). Das ist der deutlichste Verstoß gegen *Reward Intent*.
3. **Versteckte Auslöser und formale Schlösser (Hoch):** Emina geht nur nach einem zweiten Lauschen (K2-B04). Der „neue Nachmittag“ im Heim ist unsichtbar, und der Text widerspricht ihm (K4-B01). „Bato war wach“ hängt hinter einem technischen Zwischenschritt (K3-B01, seit dem Prüfbericht K3 bekannt). Der Karton im Finale von K2 verlangt einen Notizbuch-Schluss für etwas, das die Geschichte gerade gesagt hat (K2-B02).
4. **Vorgesagte Erkenntnisse (Mittel, systemisch):** In allen Kapiteln sprechen Figuren – oft Marko – Schlüsse aus, bevor das Notizbuch sie verlangt; in Kapitel 3 neun von zehn Pflichtschlüssen (Muster 8). Das Notizbuch prüft dann Suchgeduld, nicht Denken.
5. **Hinweise, die dem Code widersprechen (Mittel bis Hoch):** In jedem Kapitel raten einzelne Hinweisstufen Erledigtes oder Unmögliches; in Kapitel 5 führt ein Hinweis in eine Schleife (K5-B02). Ursache: Die Hinweisprüfung kennt nur die Stände der Musterlösung (Muster 10).

**Risiken.** Die Befunde sind fast alle mit wenigen Zeilen Text oder einer Bedingung zu beheben (Abschnitt G). Größer ist das Risiko, dass neue Korrekturen wieder nur entlang der Musterlösung geprüft werden. Deshalb steht im Plan (H) eine Prüfung abseits davon und ein Spieltest mit Menschen, die das Spiel nicht kennen.

**Grundsätze im Überblick** (✔ erfüllt · ◐ teilweise · ✘ verletzt · – nicht anwendbar)

| Grundsatz | K1 | K2 | K3 | K4 | K5 | Wichtigste Belege |
|---|---|---|---|---|---|---|
| G1 Übergeordnetes Ziel | ✔ | ✔ | ✔ | ✔ | ✔ | Nachruf → Fälle; Malas Spur; Malas Brücke; Weihnachten bei Mama; Begräbnis und letzte Fahrt |
| G2 Teilziele | ✔ | ◐ | ◐ | ◐ | ◐ | Bett/Couch sagen, was fehlt; Lücken K2-B04, K3-B07, K4-B01, K5-B02 |
| G3 Lernen ohne Scheitern | ✔ | ✔ | ◐ | ✔ | ✔ | kein Tod, Fehlwahlen wiederholbar; K3-B04: Mala weiß, was sie nicht wissen kann |
| G4 Problem vor Lösung | ◐ | ✔ | ◐ | ✔ | ◐ | Musterbeispiele K1-R01, K1-R05; kleine Umkehrungen K1-B12, K3-B04, K5-B13 |
| G5 Nichts unwiederbringlich verpassbar | ◐ | **✘** | ◐ | ◐ | ◐ | K2-B01 Sackgasse; sonst nur Optionales (K4-B04, K5-B14) |
| G6 Rätsel treiben die Geschichte | ◐ | ✔ | ✔ | ✔ | ✔ | K1: Notizbuch-Schlüsse in den Fällen ohne Funktion (K1-B06) |
| G7 Dramatische statt Echtzeit | ✔ | ✔ | ✔ | ✔ | ◐ | Muster 4; K5-B07: 6-Sekunden-Fenster |
| G8 Spürbarer Fortschritt | ✔ | ✔ | ◐ | ✔ | ✔ | K3: Fortschritt oft vorgesagt (K3-B03) |
| G9 Nachvollziehbare Lösungen | ◐ | ◐ | ◐ | ◐ | ◐ | K1-B01, K2-B02–B04, K3-B01, K4-B01, K5-B01 |
| G10 Absicht anerkennen | ◐ | ◐ | ◐ | ◐ | ◐ | Verben ✔; Gegenstände an Personen 9–53 % eigene Reaktion; Muster 7 |
| G11 Kausale Freischaltungen | ◐ | ◐ | ◐ | ◐ | ✔ | K1-B02, K2-B04, K3-B02, K4-B06 |
| G12 Mehrere Möglichkeiten | ◐ | ✔ | ✔ | ✔ | ◐ | offene Themen im Median: 1 / 1 / 2 / 2 / 1; Samstag und Montag in K5 bewusst geführt |
| Schluss: Speichern, Füllrätsel | ✔ | ◐ | ✔ | ✔ | ✔ | K2-B01 macht Laden zur einzigen Rettung; Füllrätsel nicht gefunden |

**Antwort auf die Leitfrage.** „Die Stillen“ entspricht Gilberts Grundsätzen dort, wo sie das Spiel als Ganzes betreffen: Ziel, Zeit, Tod, Speichern, Geschichte, Sperren mit Grund. Am weitesten entfernt ist es bei G10 und G9, also dort, wo die Grundsätze den Augenblick des Versuchs betreffen. Ein Spieler mit der richtigen Idee bekommt zu oft keine Bestätigung, gelegentlich sogar eine falsche Belehrung. Der Grund liegt meist in Antworttexten, nicht in der Rätselstruktur. Genau deshalb ist das Verbesserungspotenzial groß und der Aufwand klein.

## B. Material- und Prüfstatus

### B.1 Untersuchte Fassung

| Angabe | Wert |
|---|---|
| Spiel | „Die Stillen“ (Arbeitstitel MALA; so heißt es im Auftrag) |
| Repository, Zweig | `GasPhil1968/Hotel`, `claude/gifted-keller-rsg4ye` |
| Commit | `366c256` vom 9. 11. 2026 („Kapitelauswahl am Anfang …“) |
| Spieldatei | `web/index.html`, SHA-256 `4af335ec7b42…`, Service-Worker-Cache `mala-split-50b969196d` |
| Quelltext | `game/src/` (Engine `00`–`07`, Kapitel 1 `10`/`11`/`90`–`95`, Kapitel 2–5 `12`–`16`, `96`–`98`, Räume `rooms/`) |
| Essay | „Why Adventure Games Suck“ (PDF, 9 Seiten, Blogfassung vom 12. 5. 2004 mit Originaltext von 1989) |

Es gibt nur diese eine Entwicklungslinie. Ältere Fassungen (z. B. `qa/originals/index_original.html`, das ZIP vom 7. 11.) habe ich nur dort herangezogen, wo frühere Testergebnisse zitiert werden; das ist jeweils mit Fassung und Datum vermerkt. Es werden keine Stände vermischt.

### B.2 Status der fünf Kapitel

| Kapitel | Ort, Zeit | Status | Beleg |
|---|---|---|---|
| 1 | Split, 15.–19. 11. 2011 | spielbar, vollständig | automatischer Durchlauf `game/tools/walkthrough.js` heute bis zum Kapitelende; `LOESUNG1.md` |
| 2 | Sarajevo, 19.–24. 11. 2011 | spielbar, vollständig | `walkthrough2.js` heute bis zum Abspann; `LOESUNG2.md` |
| 3 | Mostar, 24.–28. 11. 2011 | spielbar, vollständig (mit Varianten) | `walkthrough3.js` heute bis zum Abspann; `LOESUNG3.md` |
| 4 | München, 24. 12. 2011 – 1. 1. 2012 | spielbar, vollständig (mit Varianten) | `walkthrough4.js` heute: 85 Schritte ohne JS-Fehler; `LOESUNG4.md` |
| 5 | Sarajevo, 1.–5. 3. 2012 (Finale) | spielbar, vollständig (mit Variante) | `walkthrough5.js` heute: 55 Schritte ohne JS-Fehler; `LOESUNG5.md` |

Kein Kapitel ist nur Konzept. Die Konzeptdokumente (`KONZEPT.md`, `KAPITEL2.md`, `KAPITEL3_KONZEPT.md`, `KAPITEL4_KONZEPT.md`, `KAPITEL5_KONZEPT.md`) habe ich als Hintergrund gelesen, bewertet wird das umgesetzte Spiel. Wo Dokument und Code auseinandergehen, gilt der Code.

### B.3 Methoden

1. **Essay** vollständig gelesen; daraus das Prüfraster in Abschnitt C (mit Seitenangaben).
2. **Code- und Dokumentenprüfung je Kapitel.** Für jedes Kapitel ein eigener Prüfdurchgang mit demselben Raster und denselben Fragen (fünf getrennte Teilprüfungen, parallel), danach von mir zusammengeführt. Alle als *Kritisch* oder *Hoch* eingestuften Befunde und alle Befunde, auf denen die Vorher-nachher-Entwürfe beruhen, habe ich selbst an den genannten Fundstellen nachgelesen bzw. im Spiel nachgestellt; das steht jeweils dabei.
3. **Messungen in der Engine an echten Spielständen.** Die fünf vorhandenen automatischen Durchläufe habe ich heute mit `MALA_DUMPALL` laufen lassen; sie legen nach jedem Schritt den Spielstand ab. Ein eigenes, nur lesendes Messskript lädt jeden dieser Stände in das gebaute Spiel und zählt, ohne eine Aktion auszuführen: welche Gegenstand-auf-Hotspot-Versuche eine eigene Antwort haben, welche Verben Marko und Mala an den sichtbaren Hotspots angeboten bekommen, wie viele Notizen das Notizbuch zum Verbinden zeigt und wie viele Paare davon einen Schluss ergeben, wie viele Hinweisthemen gleichzeitig offen sind. Das sind Zählungen an Spielständen entlang des Lösungswegs, kein Spieltest.
   Die Skripte liegen im Repository: `qa/analyse/messung.js` und `qa/analyse/messung_auswertung.js` (Messung), `qa/analyse/k2_rotkreuz.js` und `qa/analyse/k5_menue.js` (Nachstellung der beiden im Spiel bestätigten Fehler). Sie brauchen die Stände aus den Durchläufen (`MALA_DUMPALL=<ordner>/k1 node game/tools/walkthrough.js` usw.).
4. **Frühere Testergebnisse** aus dem Repository, mit Fassung: 4.000 simulierte Läufe über Kapitel 1–4 vom 7. 11. 2026 auf der damaligen Fassung `5ddc4f3c` (`qa/results/final/`), Regressionstests `qa/regress/` (heute 9/9 grün), UI-Tests `qa/ui/` (heute grün, siehe Bericht zur Kapitelauswahl).

### B.4 Grenzen dieser Untersuchung (ehrlich)

- **Kein unvoreingenommener Erstdurchgang.** Ich kenne die Lösungen: Kapitel 5 habe ich selbst gebaut, Kapitel 1–4 habe ich in früheren Arbeitsgängen getestet und umgebaut (Bedienung, Touch, QA). Die Perspektive „aufmerksamer Erstspieler ohne Lösungswissen“ ist deshalb eine begründete Rekonstruktion: Ich prüfe an den Fundstellen, welche Information vor einer Handlung zugänglich ist. Ob ein Mensch sie dort findet und versteht, kann nur ein Spieltest zeigen.
- **Keine Spieltests mit Menschen.** Alle Zahlen stammen aus Code, Engine und automatischen Läufen. Sie belegen Zustände und Erreichbarkeit, nicht Spaß, Verständlichkeit oder Wirkung.
- **Die automatischen Durchläufe folgen dem Lösungsweg.** Die Messungen zeigen, was entlang dieses Wegs angeboten wird, nicht in jedem denkbaren Zustand.
- **Die 4.000 Läufe** stammen von einer älteren Fassung und enden vor Kapitel 5; sie können Sackgassen nur widerlegen, nicht ausschließen (so steht es auch in `qa/README.md`).
- Die bosnisch-kroatische Sprachfassung (nur Kapitel 1 vollständig) habe ich nicht gesondert geprüft.

## C. Prüfraster

### C.1 Die Quelle und wie sie hier benutzt wird

Ron Gilbert, „Why Adventure Games Suck And What We Can Do About It“, Copyright 1989. Das vorliegende PDF (9 Seiten) ist der Blogeintrag „Why Adventure Games Suck“ vom 12. Mai 2004 auf *Grumpy Gamer*. Es besteht aus zwei Teilen, die ich auseinanderhalte:

- **Vorwort von 2004** (S. 1): Gilbert schrieb den Text 1989, während er *Monkey Island* entwarf. Fünfzehn Jahre später sei er „nicht sicher, ob ich allem darin noch zustimme“. Er habe viel aus *Monkey Island 1* und *2* und den Kinderspielen bei Humongous gelernt; eine kommentierte Fassung kündigt er an. Inhaltliche Korrekturen an den Regeln enthält das Vorwort nicht.
- **Originaltext von 1989** (S. 1–9): Einleitung, zwölf „Rules of Thumb“, Schluss.

Was der Originaltext selbst über den Status der Regeln sagt, gilt für diese Prüfung:

- Es sind **Faustregeln mit Ausnahmen**. Gilbert hofft, dass er sie nur „aus künstlerischen Gründen“ bricht und nicht aus Bequemlichkeit (S. 3). In *Maniac Mansion* habe er alle bis auf eine verletzt, manche absichtlich, manche aus Schlamperei (S. 3).
- Der Maßstab ist die **„suspension of disbelief“**: Jedes Neuladen und jedes frustrierte Kopf-auf-den-Tisch reißt den Spieler aus der Geschichte (S. 3).
- Die Regeln machen Spiele **nicht zu leicht**. Schwer sind die meisten Spiele, weil ihre Rätsel „willkürlich und unverbunden“ sind und durch Zufall oder stures Durchprobieren gelöst werden („light candle with match“, „light paper with match“ … bis etwas passiert). Ein Rätsel ohne Begründung ist kein „fortgeschrittenes Rätsel“, sondern ein schlechtes (Kaugummipapier-Beispiel, S. 3).

Ich trenne in diesem Bericht ausdrücklich drei Ebenen:

1. **Gilbert (Essay):** Was im Text steht – sinngemäß wiedergegeben, mit Seitenzahl des PDF.
2. **Übertragung:** Wie ich die Regel auf ein heutiges Point-and-Click-Adventure mit Verbmenü, Ziehen von Gegenständen, Notizbuch-Schlüssen, Autosave und Hinweissystem anwende. Das ist meine Auslegung, nicht Gilberts Wortlaut.
3. **MALA-Kriterien (M1–M5):** Zusätzliche Maßstäbe für dieses Spiel (Zusammenarbeit der zwei Figuren, Ermittlung, Geisterregeln, Figurenentwicklung, Bogen über fünf Kapitel). Gilbert hat sie so nicht formuliert.

### C.2 Die zwölf Grundsätze

| Nr. | Regel (Originaltitel) | Fundstelle | Was der Essay sagt (sinngemäß) | Prüffrage für „Die Stillen“ (Übertragung) |
|---|---|---|---|---|
| G1 | End objective needs to be clear | S. 3–4 | Zu Beginn muss klar sein, was man erreichen will. Das Ziel darf sich unterwegs ändern. Nicht zu wissen, worum es geht, kann ein Kunstmittel sein, ist aber selten und schwer. | Weiß der Spieler in jedem Kapitel, was Marko (und Mala) wollen und warum es wichtig ist? Das Geheimnis um Mala darf offen bleiben; das aktuelle Handlungsmotiv nicht. |
| G2 | Sub-goals need to be obvious | S. 4 | Mindestens das erste Teilziel muss klar sein; eine Figur darf es aussprechen („get off the island“). Designer werden blind dafür, was der Spieler nicht weiß. | Ist das unmittelbare Hindernis aus der Handlung erkennbar? Unterschieden wird: das Problem kennen (muss sein) – die Lösung kennen (darf nicht geschenkt werden). |
| G3 | Live and learn | S. 4 | Ein sorgfältiger, aufmerksamer Spieler muss ohne Tod und ohne Neuladen durchkommen. Gefahr gehört zum Drama, muss aber überlebbar sein. Übung: einen Durchgang als Geschichte nacherzählen; wo eine Figur etwas weiß, das sie nicht wissen kann, ist ein Plotloch. | Verlangt eine Stelle Wissen, das man nur durch Scheitern oder aus einem früheren Durchgang hat? Benutzt Marko Wissen, das nur Mala hat, oder umgekehrt, ohne dass es weitergegeben wurde? |
| G4 | Backwards Puzzles | S. 4–5 | Die Lösung darf nicht vor dem Problem gefunden werden. Erst die Spalte, dann das Seil – dann geht „ein Licht an“. | Kennt der Spieler den Bedarf, bevor ihm Werkzeug oder Lösung begegnen? Wird ein Bedarf erst nachträglich erklärt? (Frühe Funde sind nicht automatisch falsch, wenn sie Neugier wecken.) |
| G5 | I forgot to pick it up | S. 5 | Nie einen Gegenstand verlangen, der später nicht mehr zu holen ist. „Adventure-Spieler nehmen eh alles mit“ ist eine Ausrede. Abhilfe: früher Gebrauch am Fundort oder ein Hinweis, ihn mitzunehmen. | Kann ein Pflichtgegenstand oder Pflichthinweis durch Orts-, Tages-, Phasen- oder Kapitelwechsel unerreichbar werden? |
| G6 | Puzzles should advance the story | S. 5–6 | Jedes gelöste Rätsel soll dem Verständnis der Geschichte näherbringen; es soll erkennbar sein, wie es zum unmittelbaren Ziel beiträgt. | Ändert die Lösung Wissen, Beziehungen, Möglichkeiten oder die Lage? Gibt es Hindernisse, die nur Zeit kosten? |
| G7 | Real time is bad drama | S. 6 | Eine Uhr, die unabhängig vom Spieler läuft, verhindert dramatisches Timing. „Hollywood-Zeit“: Absicht erkennen und warten, bis der Hut gegriffen ist. Faustformel 10 % zu schnell, 10 % zu langsam, 80 % „gerade noch“. | Gibt es Zeitfenster, Uhren oder Tagesabläufe, die unabhängig vom Spieler laufen? Ist ein Scheitern verständlich und ohne Neuladen wiederholbar? |
| G8 | Incremental reward | S. 6 | Der Spieler muss merken, dass er vorankommt: neue Orte, neue Figuren, neue Wendungen der Geschichte. | Gibt es lange Strecken ohne neue Erkenntnis, neuen Ort oder neue Reaktion? |
| G9 | Arbitrary puzzles | S. 6–7 | Lösungen müssen Sinn ergeben, nicht offensichtlich sein. Gute Reaktion: „Natürlich, warum bin ich nicht früher darauf gekommen!“ Schlechte: „Darauf wäre ich nie gekommen.“ Was nur durch Probieren oder Glück lösbar ist, ist ein schlechtes Rätsel. | Ist die Lösung aus vorher zugänglichen Informationen und aus Regeln ableitbar, die das Spiel etabliert hat? |
| G10 | Reward Intent | S. 7 | Herausfinden, was der Spieler versucht, und es zulassen, wenn es das ist, was das Spiel will. Kein „second guess the parser“; Synonyme; im Grafikadventure die Nähe der Figur berücksichtigen. | Erkennt das Spiel plausible Versuche – die richtige Idee mit einem ähnlichen Gegenstand, am falschen Ort, zu früh, mit der falschen Figur, die richtige Notiz im falschen Gespräch – und antwortet es so, dass der Spieler etwas lernt, statt nur „Das passt nicht zusammen.“? |
| G11 | Unconnected events | S. 7 | Bereiche zu sperren ist in Ordnung, oft nötig. Das öffnende Ereignis muss aber sachlich mit dem Gesperrten verbunden sein (sechs Gegenstände und die Geheimtür). | Öffnen sich Orte, Abschnitte und Tageswechsel wegen Handlungen, die damit zu tun haben – oder wegen eines unabhängigen Zählers („alles erledigt“)? Wie begründet die Welt die Sperre? |
| G12 | Give the player options | S. 7–8 | Keine Folge kleiner Käfige. Besser: Der Spieler steht außerhalb, die Rätsel sind eingesperrt, und er wählt, welchen Käfig er öffnet. Sperren sind in Ordnung, aber die Bereiche sollen groß und interessant sein. Starke Linearität ist ein Warnzeichen. Am einfachsten: andere Interaktionen je nach Reihenfolge. | Gibt es in jedem Abschnitt mehrere offene Spuren? Wenn ein Rätsel klemmt – gibt es etwas anderes Sinnvolles zu tun? |
| – | Conclusion | S. 8–9 | Speichern abschaffen oder nur zum Aufhören benutzen; es dürfe kein Teil des Spiels sein und verführe zu schlampigem Design. Kein Füllstoff, um Spielzeit zu strecken; lieber vier bis fünf intensive Stunden. | Wird Speichern zur Verteidigung gegen unfaire Konstruktionen gebraucht? Gibt es Rätsel, die nur Länge erzeugen? Daraus folgt weder, dass die Speicherfunktion verschwinden, noch, dass das Spiel pauschal kürzer werden soll. |

**Übertragung im Einzelnen.** Den Parser von 1989 ersetzen heute Verbmenü, Ziehen von Gegenständen auf Hotspots, Fragen nach Notizen im Gespräch und das Verbinden zweier Notizen zu einem Schluss. „Second guess the parser“ heißt hier deshalb: das richtige Ding, das richtige Wort, die richtige Figur oder die richtige Notizkombination treffen müssen, obwohl die Idee schon stimmt. „Tod“ gibt es in „Die Stillen“ nicht; die Entsprechung sind verpasste Zeitfenster, verbrauchte Versuche, eine Szene, die man nur durch Laden wiederholen kann, und Sackgassen. Das vierstufige Hinweissystem auf Wunsch ist kein Gegenstand der Regeln von 1989. Ich bewerte es als Sicherheitsnetz, nicht als Ersatz für faire Rätsel.

### C.3 Zusätzliche MALA-Kriterien (nicht von Gilbert)

| Nr. | Kriterium | Prüffragen |
|---|---|---|
| M1 | Zusammenarbeit Marko–Mala | Brauchen Rätsel die unterschiedlichen Fähigkeiten beider Figuren sinnvoll? Hat der Figurenwechsel eine erkennbare Funktion? Sind Grenzen übernatürlicher Fähigkeiten etabliert, bevor sie entscheiden? Wie wandert Wissen zwischen den Figuren? |
| M2 | Ermittlung | Entstehen Erkenntnisse durch eigenes Beobachten und Kombinieren – oder werden Schlüsse ungefragt im Dialog geliefert? |
| M3 | Geister und Übergang | Wird die Erkenntnis eines Geistes, dass er tot ist, durch Spuren, Erinnerungen und glaubwürdige Reaktionen vorbereitet? Ist der Übergang verdient und folgt er verständlichen Regeln? |
| M4 | Figurenentwicklung | Zeigen Rätsel Wünsche, Ängste, Irrtümer, Konflikte? Entwickelt gemeinsames Handeln die Beziehung? Haben Nebenfiguren eigene Motive oder geben sie nur Gegenstände gegen Gefälligkeiten heraus? Bewirken Spielerhandlungen sichtbare Veränderungen? |
| M5 | Bogen über fünf Kapitel | Lehrt Kapitel 1 die Regeln über verständliche Situationen? Vertiefen 2 und 3 Mechaniken und Beziehungen? Verändert 3 die Ausgangslage, ohne das Finale vorwegzunehmen? Bereitet 4 die entscheidenden Konflikte und Fähigkeiten vor? Verlangt 5 die eigenständige Anwendung erworbenen Wissens und führt die Fäden zusammen? |

### C.4 Bewertungsstufen

Kriterien: **erfüllt · teilweise erfüllt · verletzt · nicht anwendbar · nicht überprüfbar.**
Befunde: **Kritisch** (verhindert Fortschritt oder Abschluss) · **Hoch** (zentrale Lösung unfair, unverständlich oder nur durch Raten erreichbar) · **Mittel** (vermeidbare Reibung, schwaches Feedback, unnötige Wiederholung, geringe erzählerische Wirkung) · **Niedrig** (begrenzter Feinschliff).
Belegarten: **[beobachtet]** im laufenden Spiel bzw. in der Engine an echten Spielständen gemessen · **[Code]** im Code oder Dokument nachgewiesen · **[abgeleitet]** aus Indizien geschlossen · **[zu prüfen]** offen.

## D. Kapitelübersicht

| Kapitel | Prüfstatus | Rätselstruktur | Zentrale Stärken | Wichtigste Probleme | Priorität |
|---|---|---|---|---|---|
| **1 Split** | spielbar; Code, heutiger Durchlauf (61 Stände gemessen) | 24 Ketten; Prolog und Fall 1 linear, Fall 2 stark parallel, Fall 3 nachts parallel; 79 % der Stände mit höchstens einem offenen Thema | Problem vor Lösung (Knoten, Seite 31); Archiv führt „Spüren“ ein; begründete Fehlwahlen; Entscheidungen mit Folgen | Radio und Batterien hängen nicht an der naheliegenden Idee (B01, B02); Rückmeldungen widersprechen der Lösung (B03, B04); Schlüsse in den Fällen ohne Funktion (B06); Lauschen und Finden nie geübt (B08) | Mittel |
| **2 Sarajevo** | spielbar; Code, heutiger Durchlauf (67 Stände), Sackgasse im Spiel nachgestellt | 20 Ketten; Fall 1 mit fünf parallelen Ketten; Finale linear | Synchronrätsel im Schutzraum; Rettungsnetze; begründete Absagen; Emina-Reihenfolge; Beziehung | Sackgasse mit der Rotkreuz-Nachricht (B01); „Lana Delić?“ als Formalsperre und abgewiesene richtige Schlüsse (B02, B03); versteckter Auslöser bei Emina (B04) | **Kritisch** |
| **3 Mostar** | spielbar; Code, heutiger Durchlauf (113 Stände) | 22 Ketten; Samstag und Sonntag mit zwei bis drei Spuren; Median zwei offene Themen | Lichtprobe über zwei Ufer; Grenzen vor dem Bedarf; Fehlversuche mit Inhalt; „fragen statt versprechen“ | „Bato war wach“ hinter einem Zwischenschritt (B01, bekannt als E-02); Skela als Formalie (B02, E-01); neun von zehn Schlüssen vorgesagt (B03); irreführende Pool-Sätze (B05) | Hoch |
| **4 München** | spielbar; Code, heutiger Durchlauf (85 Stände) | 20 Ketten; Tage mit drei parallelen Spuren; Median zwei offene Themen | kausale Ortsfreigaben; Versuchslogik; Malas Geheimnisse als Wissensmodell; Fehlwege mit Antwort | „neuer Nachmittag“ unsichtbar und widersprochen (B01); These des Kapitels als Wunschdenken abgewiesen (B02); Lanas Geschichte verpassbar (B04); Kurve falsch an K5 übergeben (B05) | Hoch |
| **5 Sarajevo (Finale)** | spielbar; Code, heutiger Durchlauf (55 Stände), Menü-Fehler im Spiel nachgestellt | 15 Ketten; Freitag mit drei Spuren; Samstag und Montag bewusst geführt | Hamdija-Kette; Atem-Regel; Malas Ethik als Regel; Punkt ohne Rückkehr mit eigenem Stand | Fahrscheine: plausible Paare abgewiesen (B01); Hinweis-Schleife bei „Zwei Namen“ (B02); Menü nach Abschnittswechsel (B04); Zeichenfenster 6 s (B07) | Hoch |

## E. Rätselinventar und Detailanalyse

Zuerst die Muster, die in mehreren Kapiteln wiederkehren (E.0); danach je Kapitel das Inventar der Rätselketten, die Abhängigkeiten, die Befunde, was erhalten bleiben soll, und die Grenzfälle (E.1–E.5). Reine Laufwege, automatische Szenen und einzelne Klicks sind keine eigenen Ketten. P/O heißt Pflicht/optional.

### E.0 Wiederkehrende Grundmuster (gilt für alle Kapitel)

Diese Muster stecken in der Engine und in der Oberfläche, nicht in einzelnen Rätseln. Ich beschreibe sie einmal ausführlich; die Kapitelabschnitte verweisen darauf.

#### Messung an echten Spielständen [beobachtet]

Grundlage: die heutigen automatischen Durchläufe aller fünf Kapitel, nach jedem Schritt ein Spielstand (zusammen 381 Stände; 374 auswertbar, die übrigen liegen mitten in Zwischenwelt-Szenen). Das Messskript lädt jeden Stand und zählt, ohne zu handeln. Alle Zahlen gelten entlang des Lösungswegs.

| Messgröße | K1 | K2 | K3 | K4 | K5 |
|---|---|---|---|---|---|
| ausgewertete Stände | 58 | 67 | 111 | 83 | 55 |
| Gegenstand auf eine **Person** gezogen: eigene Reaktion statt Standardsatz | **53 %** (65 von 123) | **10 %** (84 von 807) | **21 %** (306 von 1.449) | **19 %** (180 von 969) | **9 %** (110 von 1.212) |
| Gegenstand auf irgendeinen Hotspot: eigene Reaktion | 4,9 % | 1,7 % | 4,4 % | 4,0 % | 2,5 % |
| „Schau an“ mit eigenem Text (Marko / Mala) | 100 / 94 % | 100 / 99 % | 100 / 100 % | 100 / 100 % | 100 / 100 % |
| sichtbare Hotspots, an denen Mala „Spüren“ angeboten bekommt | 16 % | 10 % | 43 % | 21 % | 24 % |
| gleichzeitig offene Hinweisthemen: Median · Anteil der Stände mit höchstens einem | 1 · 79 % | 1 · 54 % | 2 · 40 % | 2 · 46 % | 1 · 69 % |
| Notizen, die das Notizbuch zum Verbinden anbietet: Median / Maximum | 1 / 4 | 8 / 19 | 16 / 36 | 14 / 26 | 11 / 20 |
| daraus mögliche Paare: Median / Maximum | 0 / 6 | 28 / 171 | 120 / 630 | 91 / 325 | 55 / 190 |

Lesart und Grenzen:

- Die Gegenstand-Zeile zählt **alle** Kombinationen aus Inventar und sichtbaren Hotspots, auch unsinnige. Aussagekräftig ist vor allem die Zeile „auf eine Person“: Einer Figur etwas zu zeigen ist der häufigste Versuch, wenn man nicht weiterweiß. Dort fällt der Unterschied zwischen Kapitel 1 (jeder zweite Versuch bekommt eine eigene Antwort) und Kapitel 2 und 5 (jeder zehnte) auf.
- Die Hinweisthemen sind ein **Näherungswert** für gleichzeitig offene Probleme: Jedes Thema in `15_hints_k*.js` ist an einen Rätselabschnitt gebunden und nur offen, solange dieser Abschnitt ansteht (`open(G)`). Viele Stände mit nur einem offenen Thema sprechen für einen linearen Ablauf. Ein Beweis sind sie nicht, weil ein Thema mehrere Schritte bündeln kann.
- Die Notizbuchzahlen zeigen den **Suchraum** für das Verbinden. Ein Schluss in Kapitel 1 ist mit höchstens sechs Paaren auch ohne Nachdenken zu finden; in Kapitel 3 sind es bis zu 630.

#### Muster 1 – Verben nur dort, wo es eine Antwort gibt [Code]

Das Tipp-Menü bietet Marko „Nimm“, „Öffne“, „Benutze“, „Schiebe“, „Lies“ und „Rede mit“ nur an, wenn der Hotspot dafür einen eigenen Text oder eine eigene Handlung hat; Mala bekommt „Spüren“, „Lauschen“, „Zeichne“ und „Rede mit“ nur, wo sie definiert sind, und „Hinüberbringen“ nur, wenn `crossIf` erfüllt ist (`game/src/06_ui.js:200–210`; die Aktionsleiste für Finger nutzt dieselbe Liste, `06_ui.js:855`). „Schau an“ steht immer da und hat praktisch überall einen eigenen Text (Tabelle oben). Dazu kommt der Knopf „Zeigen“, der alle antippbaren Stellen hervorhebt (`06_ui.js:145`).

- **G10 erfüllt:** Das Gegenstück zu Gilberts „second guess the parser“ – das richtige Verb raten – gibt es nicht. Pixelsuche ebenfalls nicht.
- **Kehrseite (M2, G9):** Das Menü verrät, *wo* etwas ist und *wann* etwas geht. „Spüren“ erscheint nur an den 10–43 % der Hotspots mit Nachhall; der Spieler muss nicht entscheiden, wo Mala hinfühlen soll. „Hinüberbringen“ erscheint genau in dem Moment, in dem der Geist bereit ist; die Frage „Ist er so weit?“ stellt sich nicht. Die Standardsätze für „Spüren“ („Da ist nichts. Kein Nachhall.“, `05_engine.js:389`) sind über die Oberfläche praktisch nicht erreichbar.
- **Bewertung:** eine bewusste Komfortentscheidung, die zur ruhigen, erzählenden Absicht passt. Ich empfehle nicht, sie zurückzunehmen. Wo ein Rätsel aber gerade davon leben soll, dass der Spieler *selbst* auf die Idee kommt, Mala hinfühlen zu lassen, nimmt das Menü die Idee vorweg (siehe die Kapitelbefunde zu „Spüren“). Abhilfe ohne Systemumbau: „Spüren“ an mehr Stellen mit kurzen, stimmigen Leertexten anbieten, damit das Angebot nicht mehr gleichbedeutend mit „hier ist etwas“ ist.

#### Muster 2 – Standardsätze treffen fast nur Gegenstände und Notizpaare [Code, beobachtet]

Weil die Verben gefiltert sind, sieht ein Spieler Standardsätze fast nur in zwei Lagen:

1. **Gegenstand auf Hotspot oder Person ohne eigene Reaktion:** „Das passt nicht zusammen.“ / „So nicht.“ / „Damit erreiche ich nichts.“ bzw. an Personen „Das will hier niemand.“ (`05_engine.js:388`, Auswahl in `:422–423`). Der Satz an Personen klingt nach Geben, nicht nach Zeigen; wer einer Zeugin ein Foto *zeigen* will, liest „Das will hier niemand.“ – das ist die häufigste Stelle, an der eine richtige Absicht ins Leere läuft.
2. **Zwei Notizen, die keinen Schluss ergeben:** in Kapitel 1 immer „Das hängt nicht zusammen.“ (`05_engine.js:224`), ab Kapitel 2 wechselnde Sätze aus kleinen Pools je nach Fallbezug (`13_k2_notes.js:177–181`, `13_k3_notes.js:195–200`, `13_k4_notes.js:157–163`, `13_k5_notes.js:90–94`). Ein **Beinahe-Treffer** (richtige erste Notiz, falsche zweite) wird nicht von einem Fehlgriff unterschieden. Eigens beantwortet wird nur der Fall, dass ein Schluss eine Voraussetzung hat, die noch fehlt (`if`/`no` → standardmäßig „Da fehlt noch etwas.“, `05_engine.js:225`), und in Kapitel 4, dass eine Notiz nur Mala gehört (`13_k4_notes.js:102–107`).

Wirkung: G10 ist bei Verben erfüllt, bei Gegenständen und Schlüssen nur teilweise. In den Kapitelabschnitten nenne ich die Stellen, an denen ein konkreter, plausibler Fehlversuch eine eigene Antwort braucht.

#### Muster 3 – Hinweise nur auf Wunsch, in vier Stufen [Code]

`15_hints.js`: Problem einordnen → Denkrichtung → konkreter Ansatz → nächster Schritt nur nach Rückfrage („Soll ich dir den konkreten nächsten Schritt verraten?“). Ein Hinweis verändert keinen Spielzustand; Themen gelten nur, solange ihr Abschnitt offen ist. Ist Mala da, spricht sie; sonst „ordnet Marko seine Gedanken“. Das entspricht genau der Vorgabe des Auftrags: keine automatischen Lösungen, keine Zielpfeile. `game/tools/hintcheck.js` prüft, dass an jedem Stand mindestens ein Thema offen ist. **Erfüllt;** ich bewerte die Rätsel deshalb so, als gäbe es das Hinweissystem nicht.

#### Muster 4 – Zeit läuft mit dem Spieler, nicht mit der Uhr [Code]

Tageszeiten und Tage wechseln nur über Story-Abschnitte (`setPhase`, `05_engine.js:513`), also durch Handlungen des Spielers. Die Tagesabläufe der Nebenfiguren sind Bewegung und Beschäftigung; sie ruhen, solange eine Szene läuft oder jemand mit der Figur spricht, und machen niemanden unerreichbar (`08_life.js:1–3`). Echtzeit gibt es nur an wenigen Stellen:

| Stelle | Was läuft | Folge bei „zu spät“ | Einordnung |
|---|---|---|---|
| K1, Markos Wohnung: Brief über Dampf öffnen | 45 s Dampf nach dem Aufsetzen (`rooms/flat.js:234`; Kaffee: 4,5 s, `:235`) | Wasser verkocht; Džezva bleibt, neuer Versuch möglich (Regressionstest BUG-003) | fair: verständlich und wiederholbar |
| K3, Partisanenfriedhof: Glocken | Mala 9 s fort (`rooms/partizan.js:7`, `:12–18`), Ausgang gesperrt („Ich gehe nicht ohne sie.“) | keine; nur Warten | dramatische Pause, kein Scheitern; leicht zäh beim zweiten Mal (sie kommt nur einmal, `k3.bells1`) |
| K1, Hafenbüro (alter Ablauf für frühe Spielstände) | Malas Stimme drängt alle 24 s (`rooms/office.js:95–96`) | – | Tutorial-Stupser; nur für Stände aus der Zeit vor dem neuen Einstieg |
| K1, Ivkas Wohnung: Radio | schaltet sich nach 16 s von selbst ein (`rooms/ivka.js:8`, `:50`) | – | Stimmung, kein Rätsel |

**G7 ist erfüllt.** Gilberts Schreckbild – eine Uhr, die unabhängig vom Spieler das Scheitern herbeiführt – kommt nicht vor.

#### Muster 5 – Speichern ist keine Verteidigung [Code]

Autosave bei jedem Ortswechsel, drei Plätze, Lesezeichen, Rückgängig nach dem Laden, feste Zwischenstände in den Finalgesprächen (K3, K4) und der eigene Stand „Vor dem Samstag“ (K5). Es gibt keinen Tod und keine Szene, die man nur durch Laden wiederholen kann; Fehlversuche werden in der Welt beantwortet und lassen sich wiederholen. Die Ausnahme, die man kennen sollte, ist Kapitel 4: Ein verfrühter Versuch im Heim verbraucht den Nachmittag, und erst Weggehen und Wiederkommen gibt einen neuen (`rooms/heim_flur.js:36–40`; in den 4.000 Läufen vom 7. 11. blieben 43 Läufe am Mittwoch ohne Tageswechsel, die von Hand geprüfte Stichprobe zeigte genau diesen Mechanismus, `qa/results/final/TRIAGE.md`). Das ist eine Regel der Welt, kein Laden – aber eine, die man kennen muss (siehe K4). Gilberts Schluss, Speichern solle nur zum Aufhören dienen, ist damit **weitgehend erfüllt**, ohne dass die Funktion fehlt.

#### Muster 6 – Das Notizbuch wächst schneller als seine Ordnung [beobachtet, Code]

Das Notizbuch zeigt die offenen Notizen der Fälle des Abschnitts; erledigte (`doneBy`/`doneIf`) verschwinden (`06_ui.js:468–476`). In Kapitel 1 bleiben es fast immer ein bis vier – Schlüsse sind dort mit einem Fingertipp „gefunden“, und das Verbinden lehrt eher die Bedienung als das Denken. Ab Kapitel 3 liegen meist 14–16, in Spitzen 26–36 Notizen zur Wahl. Einzelne Ausgangsnotizen bleiben offen, obwohl ihr Schluss erzählerisch erledigt ist: Das Paar für „Eine Brücke, die keiner gezählt hat“ (`l3_notbridge` + `k3_c_bridge` → `l3_uncounted`, `13_k3_notes.js:153`) steht nach dem Durchlauf vom Prolog bis zum Epilog zur Wahl, weil der Durchlauf den Schluss nicht zieht und nur das Ziel, nicht die Quellen, als erledigt markiert wird (`13_k3_notes.js:136`). Mit hundert und mehr möglichen Paaren wird Probieren mühsam – das ist gut gegen Raten (G9), schadet aber der Übersicht (G12, „unübersichtliche Offenheit“). Abhilfe: Quellen eines Schlusses mit erledigen, sobald dessen Inhalt auf anderem Weg bekannt ist; Notizen nach Personen oder Fragen gruppieren (die Ansicht „Nachdenken“ ist dafür schon da).

#### Muster 7 – Absagen, die eine falsche Richtung behaupten [Code]

Der schwerste Ausläufer von Muster 2: Die Satzpools für falsche Notizpaare sagen nicht nur „nein“, sie behaupten etwas. Trifft ein solcher Satz eine richtige Idee, schickt er den Spieler aktiv weg.

| Kapitel | Satz | trifft z. B. | Fundstelle |
|---|---|---|---|
| K2 | „Mit Mala hat das nichts zu tun. Oder ich will es nicht sehen.“ | Register + „Helferin: Lana Delić“ – genau die Verbindung, um die es geht | `13_k2_notes.js:174`, `:180` |
| K3 | „Mit Mala hat das nichts zu tun.“ / „Klingt gut. Stimmt nicht.“ | Paare über die Fälle l3, v3, a3 – alle handeln von Lana | `13_k3_notes.js:189–199` |
| K4 | „Ich suche einen Zusammenhang, den ich mir wünsche. Nicht den, der da ist.“ | Ružas Satz + Mamas Lesart – die These des Kapitels | `13_k4_notes.js:154` |
| K5 | „Das sind zwei verschiedene Geschichten. Ich sollte sie nicht ineinanderschieben.“ | jedes Paar mit einer Notiz aus Mamas Fall – obwohl die Lösung genau so ein Paar ist | `13_k5_notes.js:86` |

Gilbert verlangt, die Absicht des Spielers zu erkennen und zu unterstützen (G10). Ein Satz, der eine richtige Idee als Wunschdenken oder als falsche Vermischung abtut, ist das Gegenteil. **Abhilfe in einem Schritt für alle Kapitel:** neutrale Pool-Sätze („Das bringt mich hier nicht weiter.“, „Noch nicht. Etwas fehlt dazwischen.“) und für jeden Pflichtschluss die zwei bis drei naheliegendsten Fehlpaare als eigene Beinahe-Treffer, so wie es Kapitel 4 (Versuche) und Kapitel 5 (`NEAR`, `13_k5_notes.js:69–79`) schon an einzelnen Stellen tun.

#### Muster 8 – Das Spiel spricht Schlüsse aus, bevor der Spieler sie zieht [Code]

In allen fünf Kapiteln sagen Figuren – oft Marko selbst – die Erkenntnis, bevor das Notizbuch sie verlangt: Dinkos Monolog in K1 (K1-B06), Jakob und Mirza in K2 (K2-B08), in K3 neun von zehn Pflichtschlüssen (K3-B03), in K5 die erste Stufe der Fahrschein-Kette (K5-B09). Das Verbinden im Notizbuch wird dann zur Formsache: Man sucht die zwei Kärtchen, die zum eben gehörten Satz passen. Gerade in Kapitel 3 und 4, wo das Notizbuch 14–16 Notizen im Median zeigt, wird daraus Suchgeduld statt Denken. Für Gilbert ist das G8 (der Fortschritt gehört nicht dem Spieler) und für „Die Stillen“ das MALA-Kriterium M2 (Ermittlung durch eigenes Kombinieren). Zwei Wege führen heraus: Entweder die Zeile auf die **Beobachtung** kürzen und den Schluss dem Spieler lassen, oder den Schluss beim Aussprechen **selbst ziehen** und ihn nicht noch einmal als Schloss verwenden (K3-B02).

#### Muster 9 – Abschnittswechsel mitten aus der Szene [Code, beobachtet]

Kapitel 3, 4 und 5 wechseln den Abschnitt automatisch, sobald die Bedingungsliste erfüllt ist (`96_k3_story.js:182–201`, `96_k4_story.js:306–312`, `96_k5_story.js:143`). Das ist bequem, hat aber drei Folgen:
- **Optionales geht ohne Ankündigung verloren.** Lanas Straßenbahn und ihr Tod in K4 (K4-B04), Szenen und Fragen in K3 (K3-B12), Damir in K5 (K5-B14).
- **Ansagen veralten.** „Die Stadt muss es wissen. Herr Obermaier …“, gleich danach „Morgen ist Donnerstag.“ (K4-B06).
- **Technische Reste.** Ein offenes Gesprächsmenü läuft nach dem Wechsel weiter; in K5 im Spiel nachgestellt (K5-B04). Ein Wechsel, während Mala aktiv ist, kann Marko am alten Ort lassen (K3-B10, zu prüfen).

Gilbert hält Sperren für nötig, verlangt aber, dass das öffnende Ereignis sachlich verbunden ist (G11). Der letzte Pflichtschritt eines Tages ist meist gut verbunden. Das *Ende* des Tages sollte trotzdem der Spieler auslösen – über Bett, Couch oder Heimweg, wie es die Nächte schon tun.

#### Muster 10 – Hinweise, die dem Code widersprechen [Code]

Das Hinweissystem ist das Sicherheitsnetz. In jedem Kapitel gibt es aber Themen, die zur Unzeit schließen, Erledigtes raten oder Handlungen empfehlen, die das Spiel ablehnt: K1-B05/B14, K2-B05/B06/B07 (darunter f4 zum leeren Wärmefach), K4-B11, K5-B02 (Schleife beim Vorschlag). Ursache ist in allen Fällen dieselbe: `game/tools/hintcheck.js` prüft nur die Stände entlang der Musterlösung. Stände abseits davon – andere Reihenfolge, früher Schluss, verpasster Schritt – sieht es nie. Abhilfe ist ein Prüfschritt, der Hinweisthemen gegen Stände aus den Zufallsläufen der QA (`qa/sim.js`, Kategorien B und C) prüft und dabei verlangt: Die Handlung, die Stufe 4 nennt, muss im jeweiligen Stand ausführbar sein.

### E.1 Kapitel 1 – Split

**Kurzbild.** Ein sauber gebautes Einstiegskapitel mit vorbildlichen Einzelrätseln (Knoten und Stricknadel, Seite 31 und Seite 30, Kühlraum, Satzbau mit Brunos Kopfschütteln). Es gibt keine Sackgasse; jede Sperre nennt einen Grund in der Welt. Schwach sind drei Dinge: In Fall 2 hängen zwei Pflichtbeschaffungen nicht an der naheliegenden Idee. Mehrere Rückmeldungen widersprechen der richtigen Lösung. Und das Kapitel bringt zwei Grundregeln, die Kapitel 2 voraussetzt, nicht bei: Lauschen und „einen Geist erst finden“.

**Struktur** (Phasen `90_story.js:5–19`). Prolog linear mit kurzen Parallelstücken (Seite 31 ∥ Kaffee; Karton ∥ Foto ∥ Strickheft) → Fall 1 linear bis zum Hafenamt, danach Matejuška/Schuppen als Pflicht, Sustipan, Zdenka und der Schluss ANKICA optional → Zwischenspiel linear (Mala fort bis zum Tisch in der „Bura“) → Fall 2 **stark parallel** (Bar, Brecheisen, Zaun; nach Luka: Kühlraum, Sanja → Nina/Altstadt, Terminal, Zdenka/Radio, Ziegel) → Fall 3 linear bis zur Mappe, nachts parallel im Hotel → Epilog linear. Die Messung bestätigt das Bild: In 79 % der Stände ist höchstens ein Hinweisthema offen; der Ausreißer nach oben ist Fall 2.

#### Rätselinventar

Fundstellen relativ zu `game/src/`. Alle Einträge [Code] aus der Teilprüfung; ✔ = Kriterien erfüllt, ◐ = teilweise.

| ID | Kette | P/O | Kern (Problem → Lösung) | Hinweis vor Bedarf? | Reaktion auf Fehlversuche | Bewertung |
|---|---|---|---|---|---|---|
| K1-R01 | Seite 31 | P | „Warten, bis die Leuchte erlischt“ – welche? → Seite 30 (Rot = Druck), „sorgfältig“ übersetzen (`rooms/flat.js:205–223`) | ja; S. 30 wird erst nach S. 31 wählbar | „Ich rate nicht …“ (`:219`) | ✔ G4, G9 – Musterbeispiel „Problem vor Lösung“ |
| K1-R02 | Kaffee | P | „Nicht mit diesem Kopf“ → Džezva, Spüle, Herd (`:157–169`, `:235`) | ja | „Erst Wasser.“ (`:169`) | ✔ |
| K1-R03 | Sanjas Brief nach Triest | P | Varoš ist zu, bis der Brief steht → Fassung wählen (`rooms/bar.js:59–67`) | ja | begründet; nach sechs Fehlwahlen geht es weiter | ✔ G3 |
| K1-R04 | Zdenkas Schlüssel | P | Antwort wählen (`rooms/varos.js:25–30`) | – | wiederholbar | ✔ |
| K1-R05 | Schuhkarton | P | Knoten hält → Stricknadel aus dem Nähkorb im selben Raum (`rooms/ivka.js:29–37`) | ja | – | ✔ G4 vorbildlich |
| K1-R06 | Ivkas Wohnung verlassen | P | Tür verlangt Postkarte, Foto, Strickheft (`rooms/ivka.js:12–15`) | teilweise | derselbe Satz, egal was fehlt (B03) | ◐ G10 |
| K1-R07 | „Keine Familie heißt nicht: niemand“ | P | `pro_noone` + `pro_list` (oder `pro_knit` + Heft) → Zdenka → Schlüssel zurück (`11_notes.js:125–127`, `rooms/varos.js:44–45`) | ja; Marko benennt den Widerspruch | eigener Satz bei falschem Paar | ✔ – einziger Pflichtschluss in K1 |
| K1-R08 | Kennenlernen | P | Glas Wasser für Mala, Fragen, Malas Frage (`rooms/flat.js:283–339`) | ja | klärende Rückfragen | ✔ M1: Grenzen werden gezeigt, nicht erklärt |
| K1-R09 | Hafenamt und Archiv | P | Mladen braucht Zweck und Datum; Band fehlt; Malas Angebot; im Archiv reicht Ansehen nicht, Spüren liest die Jahreszahl (`rooms/office.js:8–48`, `:108–111`) | ja | „privat“ → neu wählbar; Ablehnen nur im Hafenamt nachholbar | ✔ – gute Einführung von „Spüren“ |
| K1-R10 | Schluss „Tonći kam mit der ANKICA“ | O | `11_notes.js:129`; das Finale nimmt auch Dinkos Erzählung an (`rooms/riva.js:105`) | – | – | ◐ M2 (B06) |
| K1-R11 | Dinkos Schweigen | P | Mala spürt den Seesack → neue Gesprächsoption → Geständnis (`rooms/matejuska.js:15`, `:32–54`, `:120–123`) | ja: Schuppen „fünf Meter weiter“, Malas Satz, Lauschen „drži …“ | – | ✔ M1 |
| K1-R12 | Brief öffnen und lesen | P | Dampf: Herd (45 s) oder Espressomaschine in der Bar; Mala liest, was „nicht mehr da ist“ (`rooms/flat.js:170`, `:234`; `rooms/bar.js:151–158`; `91_case1.js:19–23`) | ja | Flamme → Asche-Satz; Spüle/Džezva → Standardsatz | ✔ G7 (Fenster fair und wiederholbar) |
| K1-R13 | Ivkas Wahrheit, Zwischenwelt | P | vier Runden mit Notizen; Erkennen; Handschuhe in der Zwischenwelt (`rooms/riva.js:99–140`; `rooms/limbo.js:25–44`) | ja | Ivka variiert ihren Satz | ✔ M3 |
| K1-R14 | Zettel und Bank | P | Mala liest Sanjas Zettel hinter dem Tresen; Sanja; Bank (`rooms/bar.js:113–173`; `rooms/riva.js:174–212`) | ja | „Gib mir noch einen Tag“ wiederholbar | ✔ M1, M4 |
| K1-R15 | Brecheisen und Bauzaun | P | Dinko gibt das Brecheisen; Mala sieht das lose Feld; Kisten wegschieben (`rooms/matejuska.js:63–66`, `:99–102`) | ja | Zaun + Brecheisen: Standardsatz (B09); Kisten ohne Malas Wissen: schiefer Satz (B10) | ◐ G10 |
| K1-R16 | Luka | P | nur Mala kommt hinauf (`rooms/ledana.js:14–38`, `:92`) | – | wiederholbar | ✔ M1 |
| K1-R17 | Kühlraum | P | Brecheisen; im Dunkeln nur, was in Malas Licht liegt; Mala spürt Schutt, Marko gräbt (`rooms/ledana.js:108–161`) | ja | Graben ohne Wissen begründet | ✔ M1 vorbildlich |
| K1-R18 | Wer ist Nina? | P | Sanja erzählt bei Lukas Namen, Treffpunkt oder Tickets (`rooms/bar.js:20–38`) | ja | Sperre bis zum Wiederbetreten, ohne dass das Spiel es sagt | ◐ |
| K1-R19 | Briefkasten-Ziegel | P | Hand reicht nicht, Brecheisen „bricht die halbe Wand heraus“ → Spachtel aus Ninas Laden (`rooms/ledana.js:115–117`) | ja | gute Ablehnungen | ✔ (Spachtel wird aber schon vorher angeboten, B12) |
| K1-R20 | Abspielgerät | P | Radio nur als Dank für die Zeitung an Zdenka; Batterien nur bei Mira am Terminal, das erst Sanjas Zeugenfrage öffnet (`rooms/varos.js:76–82`; `rooms/terminal.js:10`; `rooms/bar.js:23`) | teilweise | die naheliegende Idee (Ivkas Radiorekorder hat ein Kassettenfach) wird nicht anerkannt | ◐ G9, G10, G11 (B01, B02) |
| K1-R21 | Nina überzeugen, Rampe | P | Gesprächsfolge, dann eine Notiz zu ihren Bildern oder ihrem Warten; Radio an Nina, Tickets an Luka (`rooms/shop.js:11–37`; `rooms/limbo.js:54–58`) | ja | „Das ändert nichts“, wiederholbar; das Hinweisthema verschwindet zur Unzeit (B05) | ◐ |
| K1-R22 | Hotel bei Nacht | P | Haken 13 → Ring → Salon; Telefonbuch; Kurbel und Platte (faktisch optional) (`rooms/palma.js:47–273`) | ja | Salonschlüssel an Treppe oder Kette → Standardsatz (B04) | ◐ G10 |
| K1-R23 | Hocker, Erinnerungen, Satzbau | P | Spieldosenschlüssel; drei Erinnerungen in freier Reihenfolge; Satzbau, Bruno schüttelt bei jedem falschen Teil genau dort den Kopf (`rooms/palma.js:7–11`, `:96–108`, `:265–268`) | ja | vorbildlich | ✔ G9, G10 |
| K1-R24 | Ljerka, Brunos Abschied | P | Satz nach dem Umschlag; Kerzen; Glocke (`rooms/palma.js:128–184`) | ja | – | ✔ |

#### Abhängigkeiten (gekürzt)

```
PROLOG  Anrufbeantworter ─┬─ S.31 ─┐
                          └─ Kaffee ┴─[Tür]─ Bar: Triest ─[Varoš]─ Schlüssel ─ Ivkas Wohnung (Karton | Foto | Heft) ─[Tür]
        ─ Schluss „niemand“ ─ Zdenka ─[Rückgabe]─ Riva ─ Nachruf ─ Bett
FALL 1  Kennenlernen ─ Riva (Ivka) ─ Mladen (Datum) ─ „Dann sieh nach“ ─ [Mala] Archiv spüren ─ Fahrtenbuch
        ─ Matejuška: [Mala] Seesack ─ Geständnis (Brief, Handschuhe) ─ Dampf ─ [Mala] liest ─ Finale ─ Zwischenwelt
FALL 2  Bar/Zaun ─┬─ Brecheisen ─────────────┐
                  └─ [Mala] Kisten ─ Ledana ─ [Mala] Luka ─┬─ Kühlraum ([Mala] Schutt + Brecheisen) → Tickets, Kassette
                                                          ├─ Sanja → Nina (Spachtel) → Ziegel → Zettel
                                                          ├─ Sanja „wer noch?“ → Terminal → Batterien     ◄ Engstelle Sanja
                                                          └─ Zeitung → Zdenka → Radio
        alles + Notiz (Bilder | Warten) → Rampe ─ [Mala] hinüber ─ Tickets an Luka
FALL 3  Anruf ─ Mappe ─ Nacht ─ Haken 13 → Ring → Salon ─ Hocker ─ drei Erinnerungen ─ Satzbau ─ Ljerka ─ hinüber
```

#### Befunde

| ID | Schwere | Kette · Grundsatz | Beleg | Warum ein Erstspieler hängen bleibt | Kleinste Korrektur |
|---|---|---|---|---|---|
| K1-B01 | Mittel | R20 · G9, G10, G11 | Radio nur gegen die Zeitung (`rooms/varos.js:76–82`); Zdenka hat in Fall 2 keine Option zum Radio und keine Reaktion auf die Kassette (`:69–75`, `:89–93`) [Code] | Wer die Kassette hat, denkt an Ivkas Radiorekorder mit Kassettenfach (`rooms/ivka.js:23`). Die richtige Idee läuft ins Leere; der Weg führt nur über einen Botengang. | Bei Zdenka eine Option mit `has('cassette')`: „Ivkas Radio – hatte es nicht ein Kassettenfach?“ → Radio (oder „Bringen Sie mir erst die Zeitung“) |
| K1-B02 | Mittel | R20 · G10, G11 | Batterien nur bei Mira; das Terminal öffnet erst „Wer war damals noch am Hafen?“ (`rooms/bar.js:23`); die Kartensperre sagt „Ich wüsste nicht, wen ich dort fragen soll“ (`17_map.js:16–17`, `:71`) [Code] | Wer Batterien sucht, sucht einen Laden, keinen Zeugen. Die Sperre nennt einen sachfremden Grund. | Sperrsatz abhängig vom Inventar („Mono-Batterien? Am Fährhafen ist ein Kiosk.“) oder der Zeitungsstand verweist ans Terminal |
| K1-B03 | Mittel | R06 · G10 | Fehlt Foto oder Postkarte, sagt die Tür „Irgendetwas, das von ihr erzählt. Nicht nur von ihrem Warten.“ (`rooms/ivka.js:15`) – das zeigt aufs Heft, auch wenn es schon gelesen ist [Code] | Die Rückmeldung zeigt auf das Falsche. | getrennte Sätze je fehlendem Stück |
| K1-B04 | Mittel | R22 · G10 | Treppe und Kette im Hotel haben kein `with` für den Schlüsselring „SALON“ (`rooms/palma.js:209–212`; `10_items.js:51–52`) → „Das passt nicht zusammen.“ [Code] | Der richtige Schlüssel am richtigen Ort bekommt ein Nein. | `with:{keyring:…}` an Treppe und Kette, dieselbe Wirkung wie `canExit` |
| K1-B05 | Mittel | R21, R19 · Hinweise | Thema `k2_nina2` verlangt den Zettel im Inventar, Nina behält ihn aber (`15_hints_k1.js:155`; `rooms/shop.js:13`); `k2_brick` öffnet danach wieder und rät zum Spachtel, den es dann nicht mehr gibt (`:139`; `rooms/shop.js:18`) [Code] | Das Sicherheitsnetz verschwindet an der schwierigsten Stelle bzw. rät Erledigtes. | Bedingungen an den Code anpassen |
| K1-B06 | Mittel | R10, R21, R23 · M2, G6 | In allen drei Fällen ist kein Notizbuch-Schluss Pflicht: das Finale nimmt Dinkos Erzählung (`rooms/riva.js:105`), `c2_waited` ist eine von vier Antworten (`rooms/shop.js:30–32`), `c3_hid` braucht niemand (`rooms/palma.js:15`) [Code]; gemessen: das Notizbuch zeigt meist eine, höchstens vier Notizen [beobachtet] | Die im Prolog gelernte Mechanik verliert sofort ihren Sinn; Erkenntnisse liefern Dinko und Malas Bilder. | Fall 1: Dinko gesteht nur seinen Teil, das „Warum“ zieht Marko selbst; Runde 2 im Finale verlangt `c1_came` |
| K1-B07 | Mittel | G5, G8 | Von den K1-Notizen zeigt das Notizbuch nur 16 (`11_notes.js:198–202`; Filter `06_ui.js:473`); „trinaest … Haken“ ist nur einmal hörbar (`rooms/palma.js:65`) [Code] | Gesprochene Pflichthinweise sind nicht nachlesbar. | eine Seite „Gehört“ nur zum Lesen |
| K1-B08 | Mittel | M1, M5 | Alle Lauschen-Antworten in K1 sind Stimmung ohne Notiz oder Schalter (`rooms/varos.js:88`, `rooms/bar.js:150`, `rooms/office.js:80`, `rooms/matejuska.js:81`, `rooms/shop.js:47`); nur Ivka ist zunächst unsichtbar und wird durch Markos eigenen Gang gefunden (`rooms/riva.js:25`, `:251`, `:262`); Luka und Bruno sind sofort sichtbar [Code] | Kapitel 2 verlangt Lauschen (Emina, Šehić) und das Finden über die „Leere Stelle“, ohne dass K1 es geübt hat. | Dinkos „drži …“ beim Lauschen als Notiz, die die Gesprächsoption mit öffnet; Bruno erst durch Spüren an der Loge finden |
| K1-B09 – B17 | Niedrig | G10, G4, G5, G7, Pflege | Brecheisen am Zaun → Standardsatz (`rooms/matejuska.js:94–96`); „Weil sie da sind?“ an den Kisten (`:98–99`); Mala sieht den offenen Brief mit Markos Text (`05_engine.js:461`); Spachtel und Batterien werden vor dem Problem angeboten (`rooms/shop.js:18`, `rooms/terminal.js:10`); Zettel an Nina zuerst → Lukas Bitte entfällt (`rooms/shop.js:13`); weitere Hinweisbedingungen widersprechen dem Code (`15_hints_k1.js:83`, `:189–194`); tote Antworten auf ausgeblendete Notizen; Nachholregel für `pro_night` ohne `when` (`90_story.js:69`, `:88`); Dampf läuft bei offenem Notizbuch weiter (`05_engine.js:606`) [Code] | Feinschliff | je ein Satz oder eine Bedingung |

#### Was erhalten bleiben soll

- **Problem vor Lösung** bei Knoten und Nadel und bei Seite 31/30 – genau Gilberts Spalte vor dem Seil.
- **Begründete Fehlwahlen ohne Strafe:** Triest-Brief, Malas Frage, Ivkas Runden, Brunos Kopfschütteln je Feld.
- **Einführung von „Spüren“ im Archiv:** Ansehen reicht nicht, Spüren schon – die Regel entsteht aus einer Situation (`rooms/office.js:108–111`).
- **Zwei gleichwertige Wege** zum Öffnen des Briefs (Herd, Espressomaschine).
- **Entscheidungen mit sichtbaren Folgen:** Nachruf, Übersetzung, Gesundheitsantwort wirken am Donnerstag nach.
- Die Punkte aus dem externen Prüfbericht von 2026 (`BERICHT_PRUEFBERICHT.md`) zu K1 stehen so im Code (Zdenka nimmt den Schlüssel als Gegenstand, Schreibtisch-Rückfrage, Archiv, Kerzen, drei Erinnerungen, Handschuh-Reaktion).

#### Grenzfälle

- Keine Sackgasse in normaler Spielfolge [abgeleitet]. Wer im Hafenamt Malas Angebot ablehnt, kann es nur dort über Malas Gesprächsmenü nachholen (`92_story2.js:54`) – schwierig, aber lösbar.
- Dinkos Geständnis beendet Zdenkas Anwesenheit (`rooms/varos.js:6`); „Ivka trug nie Handschuhe“ und „Dinko war nie bei ihr“ sind danach nicht mehr zu bekommen. Beides ist optional, bereitet aber Ivkas Erkennen vor.
- Sanja und Nina sperren nach einer zu frühen Frage bis zum nächsten Betreten (`rooms/bar.js:21`/`:186`; `rooms/shop.js:21`/`:62`); dass Wiederkommen genügt, sagt das Spiel nicht.

### E.2 Kapitel 2 – Sarajevo

**Kurzbild.** Das reichste Kapitel an Rätselformen (Gravur, Takvim, Briefe ordnen, Fotohälften, Kurrent, Synchronrätsel im Schutzraum) und das Kapitel, das die Beziehung am stärksten vertieft. Fall 1 und Fall 3 sind breit und parallel, das Finale ist linear. Hier liegt die **einzige echte Sackgasse** des Spiels (K2-B01, im Spiel nachgestellt). Daneben hängt das Finale an einer Notizbuch-Formalie, die die Geschichte schon beantwortet hat. Und in Fall 1 hängt der Weg in die Kammer an einem unsichtbaren Auslöser.

**Struktur** (Phasen `96_k2_story.js:5–17`). Prolog linear (Geld, Fahrschein, Entwerten), dann Mala an der Drei ∥ Rade → Pension → Nacht → Tomaž. Fall 1 (Sonntag) mit **fünf parallelen Ketten** (R03–R07), Engstellen Datum und Kammer. Fall 2 (Montag) mit vier Teilketten, parallel dazu Malas Spur ab Alija. Zwischenspiel auf der Bastei. Fall 3 (Dienstag) parallel nach Sanjas Anruf (Schlüssel, Zora, drei Schüler, Malas Spur). Finale (Mittwoch) **linear**: Paket → Karton → Fotohälften → Nada → Küche → Rotkreuz-Nachricht → Nacht → letzte Fahrt → Epilog. Übernommen werden zwei Antworten aus Split und die Notizen `m_*` (`96_k2_story.js:24–36`); sie färben nur das Gespräch auf der Bastei.

#### Rätselinventar

| ID | Kette | P/O | Kern (Problem → Lösung) | Hinweis vor Bedarf? | Reaktion auf Fehlversuche | Bewertung |
|---|---|---|---|---|---|---|
| K2-R01 | Mark statt Kuna | P | Senada nimmt keine Kuna → Fikrets Brief Zeile für Zeile übersetzen, 10 KM → Fahrschein, in der Bahn entwerten (`rooms/stanica.js:25–50`; `rooms/tramvaj.js:7–28`) | ja; Wechselstube, Automat, Taxi lehnen mit Grund ab | Fikret antwortet auf jede falsche Zeile eigens; der Kontrolleur bringt einen zum Entwerten | ✔ |
| K2-R02 | Mala an der Drei | P | Mala steigt nicht ein → entwerteten Fahrschein auf Mala (`rooms/carsija.js:10–27`, `:94`) | ja: „erst richtig, wenn er Löcher hat“ (`12_k2_items.js:16`) | eigene Sätze für ungültigen Schein, KM, Džezva | ✔ M4 |
| K2-R03 | Wann ist „sieben“? | P | Zettel + Mondzeit → „Zwei Siebenen“ (`13_k2_notes.js:143`); öffnet Ferhadija, Lejla, Hajra | ja (Tafel am Turm, Lejla) | Alternative mit „Uhr geht falsch“ tot, weil `s1_clock` nicht im Notizbuch erscheint | ◐ (B09) |
| K2-R04 | Das Datum | P | Mala spürt Tomaž → Armband → Nedžad, Gravur, Auftragsbuch (`rooms/kula.js:113–115`; `rooms/kazandziluk.js:18–47`) | teilweise: Hinweis s1b nennt das Auftragsbuch vor dem Armband | ohne Armband keine Gesprächsöffnung bei Nedžad (B05) | ◐ |
| K2-R05 | 23:16 und „Elf Minuten“ | P | Takvim mit Datum, Šaćir, Zapfenstreich → drei Schlüsse (`13_k2_notes.js:145–147`) | ja | klare Antworten bei „zu früh“; Beinahe-Treffer bekommen nur Pool-Sätze | ◐ G10 |
| K2-R06 | Emina schweigt | P | Mala lauscht nach Markos Frage → „Elf Minuten“ an Emina (`rooms/kafana.js:16–29`, `:124–125`) | ja | „Sie redet mit dem Kaffee“; Rauswurf ohne Folgen | ✔ M1 |
| K2-R07 | Briefe hinter dem Spiegel | P | Šaćir → Mala durch die Kammertür, spürt die Leiste → Lejla öffnet erst mit korrigiertem Brief **und** Emina fort; Emina geht nur nach einem **zweiten Lauschen** (`rooms/kafana.js:59–60`, `:126`) → Stemmeisen → Briefe ordnen | teilweise | zu frühes zweites Lauschen: „Sie zählt die Löffel“ (`:127`) | ◐ G11 (B04, nachgeprüft) |
| K2-R08 | Die Wahrheit, die Nacht | P | Emina: Gegenstände, dann zwei Notizen in fester Reihenfolge; Tomaž: zwei Argumente in beliebiger Reihenfolge; Zifferblatt in der Zwischenwelt (`rooms/kafana.js:30–48`; `rooms/kula.js:40–60`; `97_k2_limbo.js:21–30`) | ja | falscher Anfang setzt mit Begründung zurück; Gehörtes zählt weiter | ✔ M3 vorbildlich |
| K2-R09 | Malas Spur A: Foto, Siebener, „Mali“ | O | Foto aus der Kiste, Rade → „Mala kennt das Siebener“, später „Mali“ (`13_k2_notes.js:157–161`) | ja | Rade weiß nichts zum Uhr-Splitter (B06) | ◐ |
| K2-R10 | Malas Spur B: Alija, Versprechen, „Neunter Stock“ | P (Finale) | Leere Stelle in Alipašino → Mala spricht Alija an → Dose → Rade → „Ein Versprechen“ → Splitter „Neunter Stock“ erst im nächsten Gespräch mit Mala (`97_k2_mala.js:9–23`) | teilweise; kein Hinweisthema für Alija und den letzten Schritt | – | ◐ (B06) |
| K2-R11 | Wem gehört das Buch? | P | Mala liest Leihzettel und Stempel durchs Glas → Jakob, Ankaufbuch → „gehört der Bibliothek“ (`rooms/antikvarijat.js:18–62`) | ja | begründete Absagen ohne Wissen | ✔ M1 |
| K2-R12 | Im Buch liegen die Seiten | P | Petar, Milka → Schluss → Jakob gibt das Buch nur mit beiden Schlüssen (`rooms/antikvarijat.js:21–34`) | ja | „Bringen Sie mir einen Grund“ | ✔ |
| K2-R13 | Passierschein, Rückgabe | P | Kurrent bei Amra; Ilija; Vijećnica: Mala liest die Zeile, Marko trägt „Vraćeno 21. XI 2011“ ein (`rooms/obala.js:34–57`; `rooms/vijecnica.js:7–21`) | ja | Zeile wird in der Zwischenwelt nachgeliefert | ✔ (den letzten Schritt sagt Marko selbst, B08) |
| K2-R14 | „Lana Delić?“ | P (Finale) | Hausbuch + Register + Splitter „Neunter Stock“ (`13_k2_notes.js:162–163`) | Stockwerk dreimal gesagt, aber nicht als Notiz | „Viele Namen enden auf ‚ić‘. Welches Stockwerk?“; Register + „Helferin: Lana Delić“ → „Mit Mala hat das nichts zu tun.“ | ◐ G9, G10 (B03, nachgeprüft) |
| K2-R15 | Šehićs Schlüssel | P | Mala schlägt Lauschen vor → „Hanka“ → drei Antworten, eine kränkt (`rooms/haustor.js:36–51`) | ja | wiederholbar | ✔ |
| K2-R16 | Klingel und Schrank | P | Mala unten lassen, oben drücken, zu Mala wechseln: Nachhall; Marko sieht unten nur in Malas Licht (`rooms/haustor.js:92–96`; `rooms/skloniste.js:25–42`, `:108`) | mehrfach (Zora, Pult, Kabel, Mirza) | „Gehört hat es keiner.“ | ✔ M1 – bestes Kooperationsrätsel des Spiels |
| K2-R17 | Schüler, Stempel, letzte Stunde | P | Mirza, Selma, Damir; Stempel aufs Pult; Namensaufruf, Mala antwortet „Prisutna“ (`rooms/skloniste.js:46–64`) | ja | „Nicht hier. Unten, an ihrem Pult.“ | ✔ M3 |
| K2-R18 | Paket, Karton, Hälften | P | Handy laden → SMS → Paket; Karton nur mit `m2_lana` **und** Fall 3 erledigt (`97_k2_mala.js:64–65`); Hälften zusammenlegen | ja | „Noch nicht. Ich weiß noch nicht genug, um es auszuhalten.“ | ◐ G8, G11 (B02, nachgeprüft) |
| K2-R19 | Nada, Küche, Rotkreuz-Nachricht | P | Foto → Nada; Postkarte; Mala spürt den Herd; Stemmeisen; Nachricht **lesen**; „Sie kam mich holen“ (`rooms/kuca.js:5–17`; `13_k2_notes.js:164`) | ja | – | ✘ G5 (B01, im Spiel bestätigt) |
| K2-R20 | Letzte Drei, Epilog | P | Malas Fahrschein; beide entwerten; Geständnis; Epilog bei Nada (`rooms/tramvaj.js:32–72`; `rooms/stan.js:24–33`) | ja | „Warte. Du brauchst meinen Fahrschein.“ | ✔ |

#### Abhängigkeiten (gekürzt)

```
PROLOG  Brief → KM → Fahrschein → entwerten → [Schein → Mala] ∥ Rade → Pension → Nacht → Tomaž
FALL 1  [Mala] Zettel + Mondzeit → 2×7 ────────────────────────────────────────────┐
        [Mala] spürt Tomaž → Nedžad → Gravur → DATUM ─┬→ Takvim → 23:16 ──────────┐ │
                                                      └→ Šaćir → „ging nach 11“ ──┴→ ELF MINUTEN
        Emina fragen → [Mala] lauscht → „hat gewartet“
        Šaćir → [Mala] Spiegel ─┐ Lejlas Brief ─┐
                                └───────────────┴→ [Mala] ZWEITES Lauschen (unsichtbar) → Lejla öffnet → Briefe → ordnen
        Briefe → Emina → Nacht → [Mala] hinüber
FALL 2  [Mala] Leihzettel → Jakob → Ankaufbuch ┐ Petar + Milka ┴→ Buch → Amra → Abend → Theke → Stift → Zeile
FALL 3  Sanja → Haus 7; [Mala] lauscht → Šehić → Schlüssel → Zora → Klingel synchron → Klassenbuch → Schüler → Nacht
        Hausbuch + Register + „Neunter Stock“ (nur über Mala) → LANA DELIĆ? ──┐ (nur fürs Finale nötig)
FINALE  Handy → Paket → [LANA DELIĆ?] → Karton → Hälften → Nada → Postkarte → Schlüssel → [Mala] Herd → Nachricht (LESEN!) → „Sie kam mich holen“ → Nacht
```

#### Befunde

| ID | Schwere | Kette · Grundsatz | Beleg | Warum ein Erstspieler hängen bleibt | Kleinste Korrektur |
|---|---|---|---|---|---|
| **K2-B01** | **Kritisch** | R19/R20 · G5, G10, Gilberts Schluss (Speichern als Verteidigung) | Das Wärmefach gibt die Nachricht, ohne sie zu lesen (`rooms/kuca.js:10`); die Notiz `f2_rcm` entsteht nur beim Lesen (`:15`). Nada nimmt die Nachricht im Finale an und spielt ihre Epilog-Szene ohne Abschnittsprüfung (`rooms/stan.js:41` → `:24–33`, `A.take('rcm')`). „Sie kam mich holen“ braucht `f2_rcm` (`13_k2_notes.js:164`), Malas Angebot für die letzte Nacht braucht diesen Schluss (`97_k2_mala.js:50`, `:56`). **[beobachtet]:** Stand nach dem Öffnen des Wärmefachs, Nachricht ungelesen, Nada gegeben → Gegenstand weg, Notiz nicht mehr zu bekommen, Malas Menü ohne „Fahren wir. Mit der Drei.“, Hinweis f4 rät weiter „Das Wärmefach mit dem Stemmeisen öffnen“, obwohl es leer ist. | Einer Mutter die letzte Nachricht ihrer Tochter zu bringen, ist die naheliegendste Handlung des ganzen Kapitels. | Nachricht beim Fund vorlesen (`M.k2ReadRCM` nach `A.give('rcm')`); Nada nimmt sie vor dem Epilog nicht an („Nicht jetzt, Mali …“); f4 an `!msgTaken` binden. Ausgearbeitet in G.2, Entwurf 1. |
| K2-B02 | Hoch | R14/R18 · G8, G11, G2 | Karton nur mit `m2_lana` (`97_k2_mala.js:65`); Fall 3 ist ohne diesen Schluss abschließbar (`rooms/skloniste.js:10`); beim Namensaufruf antwortet Mala „Prisutna.“, Zora sagt „Lana, Kind.“ (`:59`); Hinweis f1b Stufe 4: „Den Karton in der Leiste öffnen.“ (`15_hints_k2.js:201`) [Code, nachgeprüft] | Die Geschichte hat gerade gesagt, dass Mala Lana ist; das Spiel verlangt trotzdem ein Notizbuch-Kärtchen und der Hinweis rät genau zu der Handlung, die abgelehnt wird. | Nach „Prisutna“ `m2_lana` vergeben, wenn sie fehlt; f1b zustandsabhängig |
| K2-B03 | Hoch | R10/R14 · G9, G10 | Register + Hausbuch ohne Splitter: „Viele Namen enden auf ‚ić‘. Welches Stockwerk?“ (`13_k2_notes.js:162`), obwohl das Stockwerk dreimal fiel (Alija, `rooms/neboder.js:10`; Mala am Aufzug, `rooms/haustor.js:130`; Dragica, `:12`); die Splitter-Notiz gibt es nur im Gespräch mit Mala (`97_k2_mala.js:23`). Register + „Helferin: Lana Delić“ → Pool-Satz „Mit Mala hat das nichts zu tun. Oder ich will es nicht sehen.“ [Code, nachgeprüft; denselben Pool-Satz zeigte im Versuch auch Postkarte + Register] | Die richtige Schlussfolgerung wird mit einer falschen Begründung abgewiesen. | Malas Satz am Aufzug vergibt `m2_f_ninth`; Register + Helferin → `m2_lana` |
| K2-B04 | Hoch | R07 · G11, G9 | Emina geht nur, wenn Mala nach Brief und `s1_hidden` **noch einmal** lauscht (`rooms/kafana.js:126`); Lejla: „Wenn Oma weg ist. Nicht vorher.“ (`:60`); Hinweis: „Lejla helfen, damit Emina geht.“ (`15_hints_k2.js:78`) [Code, nachgeprüft] | Der Weggang hängt an einer unsichtbaren Wiederholung; die Hilfe nennt eine Ursache, die längst erfüllt ist. Gilberts „unconnected event“ in Reinform. | sichtbarer Weggang beim nächsten Betreten. Ausgearbeitet in G.2, Entwurf 5. |
| K2-B05 | Mittel | R04 · G9, G10 | Ohne Malas Spüren an Tomaž kein Gesprächseinstieg bei Nedžad (`rooms/kazandziluk.js:18`, `:28–29`); Hinweis s1b nennt das Auftragsbuch trotzdem (`15_hints_k2.js:55–56`) | Hinweis zeigt auf eine verschlossene Tür | Frage nach alten Auftragsbüchern ab „Zwei Siebenen“ oder s1b Stufe 3 auf Tomažs Armband lenken |
| K2-B06 | Mittel | R09/R10 · G10, Hinweise | Rade kennt keine Antwort auf den Uhr-Splitter (`rooms/carsija.js:40–43`), der Hinweis behauptet das Gegenteil (`15_hints_k2.js:105`); kein Thema zwischen „Siebener“ und Alija und zwischen „Versprechen“ und „Neunter Stock“ | Lücke im Sicherheitsnetz an Malas Spur | Notizfrage bei Rade; zwei neue Themen |
| K2-B07 | Mittel | Hinweise | s3d: Stempel „im Schutzraum“ (er kommt von Mirza, `rooms/haustor.js:66–67`); s3e: „Damir seine Zeichnung geben“ (es gibt sie nicht, man zeigt das Klassenbuch, `rooms/carsija.js:62`); f4 rät zum leeren Wärmefach (`15_hints_k2.js:179`, `:184`, `:213`) | Hinweise widersprechen dem Spiel | Texte an den Code anpassen |
| K2-B08 | Mittel | M2, G9 | Figuren sprechen Schlüsse aus, bevor der Spieler sie zieht: Jakob „Dann hat er es geliehen.“ (`rooms/antikvarijat.js:26`); Mirza „Ihre Schuld? Sie hat mich gerettet.“ (`rooms/haustor.js:73`); Fall 3 hat keinen Pflicht-Schluss (`rooms/skloniste.js:10`) | Der Erkenntnismoment gehört der Figur, nicht dem Spieler | Mirzas Zusage an „Keine Schuld“ binden, seinen Satz auf die Tat kürzen |
| K2-B09 – B13 | Niedrig | G10, Pflege, Kontinuität | Antworten auf ausgeblendete Notizen sind tot (`06_ui.js:473`; z. B. `rooms/kula.js:23`); Erledigt-Regeln versehentlich hinter einem Kommentar (`13_k2_notes.js:133`); Haus 7 nachts ohne Nada betretbar (`rooms/haustor.js:131–137`); Widersprüche (Fotograf, Zifferblatt, Gründungsjahr der Kafana, Aufzugsantrag); Lejlas Briefzeilen kaum unterscheidbar (`rooms/kafana.js:72`, `:75`) | Feinschliff | je eine Zeile |

#### Was erhalten bleiben soll

- **Synchronrätsel im Schutzraum (R16):** mehrere Hinweise, eine früh etablierte Grenze (Marko sieht unten nur in Malas Licht) und echte Arbeitsteilung – Gilberts G9 und das MALA-Kriterium M1 in bester Form.
- **Rettungsnetze gegen Verpassen:** Lejla nachts auf der Stufe, Nedžad leiht das Stemmeisen erneut, die Zeile in der Zwischenwelt wird nachgeliefert, Erinnerungen werden beim Foto nachgeholt, was Tomaž gehört hat, bleibt gültig.
- **Begründete Absagen bei „zu früh“** (Takvim, Šaćir, Spiegel, Stempel, Klingel, Kontrolleur).
- **Emina:** die feste Reihenfolge ist psychologisch begründet und lässt sich ohne Strafe neu beginnen.
- **Erkenntnis an einem Ding** (Armband, Datum, Mirzas Dank) und die Entwicklung der Beziehung (Malas Fahrschein, die Nacht des Busses erst auf der letzten Fahrt).

#### Grenzfälle

- **Echte Sackgasse:** nur K2-B01. **Variante mit gelesener Nachricht:** kein Abbruch, aber Nadas Epilog-Szene kommt vorgezogen; Marko sagt dann „Ich fahre heute nach Mostar“ und nennt Brücke oder Lastwagen, die erst auf der letzten Fahrt erzählt werden (`rooms/stan.js:28–31`) [Code].
- Fall 3 ohne „Lana Delić?“ führt im Finale vor den gesperrten Karton (B02) – schwierig, aber lösbar.
- Ist Mala beim Namensaufruf nicht im Keller, fehlt anders als an der Kula und in der Vijećnica ein Nachholen [zu prüfen]; keine Sackgasse, Mala kann durch die Stahltür.

### E.3 Kapitel 3 – Mostar

**Kurzbild.** Das breiteste Kapitel: Samstag und Sonntag laufen auf zwei bis drei Spuren gleichzeitig (Median zwei offene Hinweisthemen, 60 % der Stände mit mindestens zwei). Malas Grenzen werden früh gesetzt und dann klug genutzt (keine Brücke, über den Fluss nur mit geschlossenen Augen, die Lichtprobe über zwei Ufer). Das Thema „fragen statt versprechen“ wird am Grab zur Spielregel. Die Schwächen sind zum Teil seit dem Prüfbericht vom 5. 11. 2026 bekannt (`PRUEFBERICHT_K3.md`, E-01, E-02, E-04) und im Code noch vorhanden. Am Sonntag hängt „Bato war wach“ hinter einem technischen Zwischenschritt, dessen einziger Anstoß im Normalablauf wegfällt. Fast alle Pflicht-Schlüsse spricht das Spiel aus, bevor der Spieler sie zieht. Und das Notizbuch wächst auf bis zu 36 Notizen.

**Struktur** (Phasen `96_k3_story.js:7–17`; Abschnitte enden automatisch, sobald `dayReady()` erfüllt ist, `:182–201`). Prolog parallel (Brücke ∥ Leine ∥ Plan und Bett) → Freitag linear bis zur Überquerung (Peilung 1 → 2 → „Zu flach“ → Straßenbrücke → Peilung 3), danach parallel (alte Karte und Mate, Fahrer, Vulkanizer) → Samstag **parallel** (Eierfrau ∥ Vlado Teil 1 ∥ Bus aus München) → Samstagnacht (Bato finden ∥ Zlata) → Sonntag **zwei große Spuren** (A: Zlata, Lichtprobe, Decke, Bato, Vlado Teil 2, Botschaft; B: Zelenika) → Finale linear mit festen Zwischenständen → Epilog linear. Aus Kapitel 2 wirken nur zwei Werte (`hajra`, `father`, `96_k3_story.js:33–55`).

#### Rätselinventar

| ID | Kette | P/O | Kern (Problem → Lösung) | Hinweis vor Bedarf? | Reaktion auf Fehlversuche | Bewertung |
|---|---|---|---|---|---|---|
| K3-R01 | Die Brücke, die alle kennen | P | „Ist sie es?“ → `l3_mybridge`; drei Wege zu „Ein einziger Bogen“ (Widerlager, Postkarte 1974, Dino) → `l3_notbridge` (`13_k3_notes.js:151`) | ja | passende Antwort auf mybridge + Geschichte (`:152`) | ✔ (Marko spricht den Schluss vorher aus, B03) |
| K3-R02 | Der Leine nach | P | Uferstufen → Richtung (`rooms/starimost.js:24–43`) | ja | „Frag mich, wohin die Leine zeigt.“ | ✔ |
| K3-R03 | Peilung 1 und 2 | P | Plan + Mala im selben Raum → zwei Landmarken; Minarett → „Zu flach geschnitten“ (`97_k3_peil.js:22–98`; `13_k3_notes.js:154`) | ja (Maja, Kassierer) | Mala sagt „Nein.“ und wiederholt; m2 + m3: „Das ist keine Messung. Das ist eine Hoffnung.“ | ◐ – fair, aber reine Ausführung (B13) |
| K3-R04 | Über den Fluss | P | Mala geht nicht über Brücken → Straßenbrücke mit geschlossenen Augen, Spieler führt (`rooms/strassenbr.js:27–88`) | ja: „Vielleicht über etwas, das keine Brücke ist.“ | Stehenbleiben ohne Strafe, Neuansatz möglich | ✔ M1 – starke Szene, wenig Denkarbeit |
| K3-R05 | Peilung 3 | P | Glocken: Mala 9 s fort, warten; dann „Hinter dem Kartenrand“ (`rooms/partizan.js:7–24`; `13_k3_notes.js:155`) | ja | – | ✔ (G7: Pause, kein Scheitern) |
| K3-R06 | Alte Karte → Skela | P | vier Figuren nennen Zdravkos Café; die Karte zeigt den Namen, Marko sagt „Skela.“; danach ist trotzdem der Schluss nötig (`97_k3_peil.js:105–108`; `13_k3_notes.js:157`) | ja | sinnvolle Antwort bei zu frühem Lesen | ◐ G8, G11 (B02 = E-01) |
| K3-R07 | Den Fahrer finden | P | Sanja (nur Freitag) → Ljerka; oder Mate; oder Zdravko/Taxi mit Ljerkas Notiz (`97_k3_mala.js:134`; `rooms/kafic.js:20–36`) | ja | logischstes Paar `v3_ljerka` + `k3_c_bridge` bekommt „Mit Mala hat das nichts zu tun.“ (B05) | ◐ G10 |
| K3-R08 | Vlado, Kata, die Schublade | P | Vlado leugnet; Kata; E-Mail übersetzen (Rückmeldung je Zeile); Mala sieht durch die Schubladen → „Die unterste.“ (`rooms/vulkanizer.js:42–326`) | ja | Raten lehnt Kata begründet ab | ✔ M1 |
| K3-R09 | Die Eierfrau | P | „Kannten Sie eine Mala?“ nur mit `l3_onetrail` (`rooms/tepa.js:53`; `13_k3_notes.js:161–162`) | ja (Maja nennt die Tepa selbst) | „Ich muss erst selbst verstehen …“; die Eierfrau geht nach zwei Fragen (B09) | ◐ |
| K3-R10 | Skela bei Nacht | P | Mala sieht übers Wasser, fünf Einstiege; Zlata (`rooms/skela_d.js:58–140`) | ja | Kopfweh am linken Ufer vor dem Fund | ✔ |
| K3-R11 | Zlata bei Tag | P | nach Dingen fragen statt nach dem Mädchen; Bleistift; „Er hat geschlafen“ → `a3_girl` (`rooms/skela_l.js:124–142`; `13_k3_notes.js:167`) | ja | Marko korrigiert sich selbst; passende Absage für die Soldaten-Variante | ✔ – einziger Pflicht-Schluss, den der Spieler wirklich selbst zieht |
| K3-R12 | Lichtprobe | P | Marko wählt das Fenster in Zlatas Haus, Mala vergleicht von drüben → Dachfenster `a3_roof` (`rooms/skela_l.js:108–123`; `rooms/skela_d.js:99–107`) | ja | „Zu breit“, „Zu tief“; Handy vom falschen Ufer: „Ich müsste drüben sein.“ | ✔ M1 vorbildlich – aber ohne Bindung an den Glocken-Nachhall (B04) |
| K3-R13 | Die Nacht ordnen → „Bato war wach“ | P | Glocke erneut spüren → `a3_lightseq`; Ordnen über Vlados Zeiten (`13_k3_notes.js:176–179`; `97_k3_peil.js:110–126`) → `a3_lightroom` → Bato „Dreimal …“ → Schluss → Konfrontation | nur, wenn Marko an der Glocke steht (`rooms/skela_d.js:90–91`) | Bato zu Dachfenster und Lichtfolge: Ausflüchte (`rooms/skela_l.js:92`); Dachfenster + geschlafen: Pool-Satz | ◐ G9, G10, G2 (B01 = E-02, nachgeprüft) |
| K3-R14 | Die Decke | P | Zlata gibt die Decke mit; Decke auf Mala → „Sie hat den Fluss überlebt“ (`rooms/skela_l.js:158–171`) | ja: „Zeig sie mir.“ | – | ✔ |
| K3-R15 | Vlado Teil 2, Gespräch 2 | P | „Ich war in Skela.“ → Notizen; halbe Treffer mit eigener Antwort; zwei Fassungen (`rooms/vulkanizer.js:135–186`) | ja | Vlado fragt nach dem fehlenden Beleg | ✔ G10 vorbildlich |
| K3-R16 | Botschaft für Vlado | P | „(Mala fragen.)“ → Notiz wählen; falsche Notizen je mit Begründung (`rooms/vulkanizer.js:189–219`) | ja: „Nicht mit einem Zettel.“ | zu frühe Botschaft aufgefangen, Vlado erinnert sich am Sonntag | ✔ |
| K3-R17 | Zelenika: Einladung | P | Briefe + Kinderzimmer → Schluss → „Kad ćete doći?“ (`rooms/zelenika_in.js:10–64`) | ja | Davor auf die Notiz → nur allgemeine Antwort (B06) | ◐ |
| K3-R18 | Zelenika: „Došli smo, dida“ | P | Postkarten → Schluss → Lenas Satz; „Djede“ und Deutsch bekommen eigene Antworten (`rooms/zelenika.js:100–122`) | ja | eigene Antworten | ✔ |
| K3-R19 | Tor, Feigen, Schlüssel, Durchsage | P | Lena ans Tor; Feigen; Schlüssel an Lena; Durchsage in der Zwischenwelt mit Begründung je Fehlwahl (`rooms/zelenika.js:124–161`; `97_k3_limbo_mate.js:24–35`) | ja | alle anderen lehnen den Schlüssel mit Grund ab | ✔ M3 |
| K3-R20 | Finale: Glocke, Fähre, Zlata | P | geführt, feste Zwischenstände (`rooms/skela_d.js:163–213`; `rooms/skela_l.js:245–249`) | – | kein Scheitern möglich | ✔ |
| K3-R21 | Am Grab: fragen statt versprechen | P | „Ich bringe dich nach Hause. Wie versprochen.“ → „Schon wieder.“; „Was willst du?“ → Zustimmung a/b/c (`rooms/skela_l.js:270–300`) | ja: „Versprich es mir. Dass du mich fragst.“ (`rooms/herberge.js:96–102`) | „Wem? … Nicht mir.“ | ✔ M4 – Thema als Spielregel |
| K3-R22 | Epilog: Formular und Probe | P/Wahl | jedes Kästchen mit eigener Antwort; Probe ja oder zweimal nein (`rooms/vermisst.js:30–98`) | ja | eigene Antworten | ✔ |

#### Abhängigkeiten (gekürzt)

```
PROLOG  ∥ [mybridge + onearch] → notbridge  ∥ down → onedir  ∥ Plan → Bett   ⇒ Abend → Gespräch 1
FR      M1 → (Koski) → M2 → flat ─→ Straßenbrücke ─→ M3 → area ─┬→ Café: alte Karte → [Schluss] skela
        Sanja (nur Fr) → Ljerka ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴→ Vlado → Kata → [Mala] Schublade
SA      ∥ Tepa → [onetrail?] → Eierfrau   ∥ Vlado Teil 1   ∥ Bus → Jela
SO  A   roof (Lichtprobe) → [Mala] Glocke → lightseq → ORDNEN (+ Vlados Zeiten) → lightroom → Bato „Dreimal“ → awake
        Zlata: slept + pencil → girl ─────────────────────────────────────────────────────┐
        roof → Decke → survived ───────────────────────────────────────────────────────────┴→ Vlado Teil 2 → Gespräch 2 → Botschaft
    B   Briefe + Kinderzimmer → Einladung; Karten → dida → Lena → Tor → Feigen → Schlüssel → Mate hinüber
FINALE  Glocke → Fähre → Brücke → Zlata → Grab „Was willst du?“
```

#### Befunde

| ID | Schwere | Kette · Grundsatz | Beleg | Warum ein Erstspieler hängen bleibt | Kleinste Korrektur |
|---|---|---|---|---|---|
| K3-B01 | Hoch | R13 · G9, G10, G2 | Der einzige Anstoß zum Ordnen („Dann lege ich das neben Vlados Zeiten. Der Reihe nach.“) fällt nur, wenn Marko an der Glocke steht; sonst sagt Mala „Das muss ich Marko sagen. Er zählt so gern.“ (`rooms/skela_d.js:90–91`). Bei der Lichtprobe steht Marko am anderen Ufer. Bato weicht bei Dachfenster und Lichtfolge aus (`rooms/skela_l.js:92`); Dachfenster + „geschlafen“ bekommt einen Pool-Satz. Schon im Prüfbericht K3 als E-02 (P1) beschrieben, im Code unverändert. [Code, nachgeprüft] | Nach Lichtprobe und Lichtfolge hält der Spieler die Lösung in der Hand: In Batos Kammer brannte Licht, während Lana läutete. Das Spiel verlangt noch einen technischen Zwischenschritt. | Bato reagiert auf Dachfenster **und** Lichtfolge zusammen; eigener Absagetext für Dachfenster + geschlafen; Ordnen freiwillig. Ausgearbeitet in G.2, Entwurf 2. |
| K3-B02 | Mittel | R06 · G8, G11 | Die alte Karte nennt den Namen, Marko sagt „Skela.“ (`97_k3_peil.js:105–108`); der Plan zeigt Skela schon als gesperrten Ort; das Tagesende verlangt trotzdem den Schluss `l3_skela` (`96_k3_story.js:184`); E-01 im Prüfbericht | Der Schluss ist Formsache, aber er sperrt den Tag | Schluss beim Lesen der Karte selbst ziehen, wenn `l3_area` vorliegt |
| K3-B03 | Mittel | M2, G8 | Neun von zehn Pflicht-Schlüssen spricht das Spiel vorher aus (z. B. „Er hat mitgezählt.“, `rooms/skela_l.js:72`; `97_k3_peil.js:88–101`; `rooms/vulkanizer.js:184`; `rooms/zelenika_in.js:16`, `:26`); nur `a3_girl` erschließt der Spieler selbst [Code, Zählung der Teilprüfung]; gemessen: 16 Notizen im Median zur Wahl, bis zu 36 [beobachtet] | Das Notizbuch prüft Suchgeduld, nicht Denken: Man sucht die zwei Kärtchen zu dem Satz, den Marko gerade gesagt hat. | Peilungsschlüsse beim Schließen des Blatts automatisch ziehen; an den übrigen Stellen die Zeilen auf die Beobachtung kürzen |
| K3-B04 | Mittel | R11/R12 · G4, G3 (Plotloch-Übung) | `lightTest` prüft den Glocken-Nachhall nicht (`rooms/skela_l.js:108–117`, nachgeprüft); Mala erkennt das Fenster aus einer Erinnerung, die sie noch nicht hatte (`rooms/skela_d.js:103–105`); danach liefert die Glocke nur die Lichtfolge, ohne den Ruf, und `a3_voice` fehlt (`:77`, `:85–91`) [Code] | Eine Figur weiß, was sie nicht wissen kann; danach fehlt ein Pflichtstück | Lichtprobe an `a3_bell3` binden: „Ich weiß nicht, ob damals eins brannte. Ich muss erst an die Glocke.“ |
| K3-B05 | Mittel | R03/R07/R13 · G10 | Der Pool „mala“ („Mit Mala hat das nichts zu tun.“, „Hier ist sie nicht.“) greift für Paare über die Fälle l3, v3, a3 – die alle von Lana handeln (`13_k3_notes.js:191`, `:199`); „Klingt gut. Stimmt nicht.“ kann bei richtigen Ideen fallen; E-04 im Prüfbericht [Code] | Die Absage behauptet eine falsche Richtung | neutrale Pool-Sätze; eigene Einträge für `v3_ljerka` + `k3_c_bridge` und `l3_m2` + `l3_m3` |
| K3-B07 | Mittel | G2 | Am Sonntag schweigt das Bett, obwohl der Tag sechs Pflichtbedingungen hat (`96_k3_story.js:212` gegen `:187`) | Am längsten Tag fehlt die Orientierung | `d3Missing` analog zu `d2Missing` |
| K3-B06, B08 – B13 | Niedrig | G10, G4, G5, Technik | richtige Notiz im richtigen Gespräch nur allgemein beantwortet (Davor, Eierfrau, Lena); Bett am Freitag nennt „Vlado“, bevor Marko den Namen kennt (`96_k3_story.js:209`); Eierfrau geht nach zwei Fragen (`rooms/tepa.js:80`); Abschnittswechsel als Mala lässt Marko zurück [abgeleitet, zu prüfen] (`96_k3_story.js:192–201`); veraltete Landmarken in LOESUNG3.md; optionale Szenen entfallen ohne Ankündigung; Peilung ohne Denkanteil | Feinschliff | je eine Zeile oder Bedingung |

#### Was erhalten bleiben soll

- **Fähigkeitsgrenzen vor dem Bedarf:** Mala betritt keine Brücke (`rooms/starimost.js:238`), geht nicht allein über den Fluss (`96_k3_story.js:121–124`) – lange bevor die Straßenbrücke sie braucht.
- **Lichtprobe:** echte räumliche Zusammenarbeit über zwei Ufer, mit begründeten Antworten.
- **Fehlversuche mit Inhalt:** Botschaft, Vlado Teil 2 mit halben Treffern, E-Mail je Zeile, Lenas Satz, Durchsage, Ordnen, Grab.
- **Zu frühe Lösungen werden aufgefangen** (`cabEarly`; Vlado erinnert sich am Sonntag).
- **Thema als Spielregel:** „(Mala fragen.)“ und am Grab „fragen statt versprechen“; die Zustimmung wirkt in K4 und K5 weiter.
- **Nebenhandlung spiegelt die Haupthandlung** (Mate wartet auf den Bus seines Sohnes; eine Einladung, die sich nicht traut).

#### Grenzfälle

- Lichtprobe vor dem Glocken-Nachhall (B04): echter Zustandsfehler, lösbar durch erneutes Spüren, worauf nur der Hinweis n2c verweist.
- Vlados Adresse vor der Überquerung bekannt: Das Westufer steht nicht auf dem Plan; der Hinweis d1o sagt „Erst mit Mala über den Fluss“, die Straßenbrücke kommt aber erst mit `l3_flat`. Schwierig, keine Sackgasse.
- Decke, Eintrittskarte und Mates Schlüssel verschwinden beim Start des Finales ohne Kommentar (`96_k3_story.js:238`); Zlatas „Bringen Sie sie wieder“ bleibt offen.
- Pflichtgegenstände kann man nicht verlieren: Abgaben an falsche Personen werden abgelehnt.

### E.4 Kapitel 4 – München

**Kurzbild.** Das reifste Kapitel im Sinne Gilberts. Die Ortsfreigaben sind kausal (Brotdose → Heim, Wimmer und Kioskfrau → Friedhöfe und Bahnhofsviertel). Die Tage sind parallel angelegt (Median zwei offene Themen). „Um drei“ ist dramatische, keine echte Zeit. Und das Kapitel enthält das beste Wissensmodell des Spiels: Was Mala in der Kiste liest, gehört ihr, bis sie es im Streit teilt (`13_k4_notes.js:100–107`). Genau Gilberts Übung „Weiß eine Figur etwas, das sie nicht wissen kann?“ ist hier als Regel gebaut. Die Schwächen: Der „neue Nachmittag“ ist unsichtbar, und der Text widerspricht ihm. Am Höhepunkt weist das Notizbuch die These des Kapitels als Wunschdenken ab. Lanas Geschichte lässt sich verpassen, und eine Entscheidung kommt falsch in Kapitel 5 an.

**Struktur** (Phasen `96_k4_story.js:7–21`; Tageswechsel automatisch, sobald die Liste erfüllt ist, `:157–168`, `:306–312`). Prolog linear (Hansi → Schlüssel → Kaffee → Mama) → Heiligabend linear → Christtag **parallel** (Ana auf der Wiesn ∥ Sepp am Hauptbahnhof ∥ Gerda im Heim) → Kiste (nur Mala) → Dienstag parallel (Ana, Sepps Name auf drei Wegen, Beobachtung um drei) → Mittwoch parallel (Sepp: Briefe, Nachhall, Anruf, Übergang ∥ Gerda: zwei Versuche, Entschluss ∥ bei „Probe nein“ das Konsulat) → Donnerstag (Abschied ∥ Gerda um drei) → Streit → Freitag ohne Mala (Ana ∥ Schlusskette) → Brücke → Silvester → Epilog. Übernommen aus Kapitel 3: Zustimmung, Probe (`96_k4_story.js:38–53`); weitergegeben an Kapitel 5: `sample, sample2, kurve, slippers, nada, fake, davor, consent2` (`:320–321`).

#### Rätselinventar

| ID | Kette | P/O | Kern (Problem → Lösung) | Hinweis vor Bedarf? | Reaktion auf Fehlversuche | Bewertung |
|---|---|---|---|---|---|---|
| K4-R01 | Hansis Ablösung | P | Mala findet ihn am Pfeiler; Marko fragt nach der Ablösung; Wastl sagt „Feierabend“ (`rooms/zob.js:28–107`) | ja | „Feierabend“ aus Markos Mund: „Sie san ned vo do“ | ✔ M1, M3 |
| K4-R02 | Ankunft und Mama | P | Schlüssel bei Frau Huber; Kaffee holt Mama heim; Probe ansprechen (`rooms/jwohnung.js:35–117`) | ja | „Ich laufe ihr nicht davon“ | ◐ (Lana erzählen verpassbar, B04) |
| K4-R03 | Brotdose → Heim | P | Dose nehmen, Heim erscheint auf dem Plan (`rooms/jwohnung.js:120–124`) | ja | „Ohne Grund?“ (`96_k4_story.js:109`) | ✔ G11 vorbildlich |
| K4-R04 | Die gelben Stiefel | P | Ana „Zeigst du mir das Foto?“, während Mala da ist (`rooms/wiesn.js:28–35`) | ja | „Das müsste Mala hören. Sie ist nicht hier.“ | ✔ M1 |
| K4-R05 | Peppino finden | P | Mala findet ihn allein oder mit Marko; Mala erzählt beim Wiedersehen (`rooms/gleis11.js:26–71`; `98_k4_intros_bhf.js:53–57`) | ja | – | ✔ M1 (Wissen wandert sichtbar) |
| K4-R06 | Gerda finden | P | Mala sieht Bank, Aufzug oder Gerda an (`rooms/heim_flur.js:72–83`) | ja: „Hier vor dem Aufzug pocht es am stärksten.“ | – | ✔ |
| K4-R07 | Die Kiste | P | nur Mala; „(Lesen.)“ → drei geheime Notizen (`rooms/jschlaf.js:21–33`) | ja | „(Nicht lesen.)“ schiebt nur auf (B10) | ✔ M1 – Wissensmodell |
| K4-R08 | Wer war der Mann an Gleis 11? | P/O | Kioskfrau, Frau Wimmer (Rollenwahl „Übersetzer“) → Friedhöfe, Koffer; Schluss `s4_tarnung` optional (`rooms/bmission.js:21–47`) | ja | falsche Rolle mit eigenen Antworten; Beinahe-Treffer | ✔ |
| K4-R09 | Sepps Name | P | drei Wege über Ausweis, Bunker (nur Mala), Umschlag (`13_k4_notes.js:116–120`) | ja | `ausweis` + `umschlag` (Josef ↔ Giuseppe) wird abgewiesen (B03) | ◐ G10 |
| K4-R10 | Carmela, Anruf, Übergang | P | Wimmer → Briefe; Mala spürt den Koffer; Schluss; Anruf am Prellbock; Hinüberbringen (`rooms/bmission.js:66–102`; `rooms/gleis11.js:126–232`) | ja; das Handy begründet jede Sperre einzeln | falscher Brief mit Malas Widerspruch; Lüge führt zurück | ✔ G10 |
| K4-R11 | Bestattung absagen, Abschied | P | „Seine Schwester will ihn heimholen.“ → Abschied am Donnerstag (`rooms/friedamt.js:69`; `rooms/bmission.js:282`) | ja, mit Warnung | – | ✔ |
| K4-R12 | Beobachtung um drei | P | Bank oder Uhr: „(Bis drei warten.)“; Notiz nur, wenn Marko im Flur steht (`rooms/heim_flur.js:349–410`) | ja (Gerda, Pinnwand, Uhr) | – | ✔ G7 (warten statt Uhr) |
| K4-R13 | Die zwei Versuche | P | Versuch 1 mit Kraus; Versuch 2 mit Mala und Marko; **dazwischen ein neuer Nachmittag** (`rooms/heim_flur.js:36–40`, `:226–245`; `rooms/heim.js:79`) | nur Hinweisstufe 4 nennt „einmal hinaus und wieder herein“ (`15_hints_k4.js:121`) | „Kein Gong und Gerda am Fenster → welches von beiden … weiß ich so nicht“ – vorbildlich; aber „Für heute ist es vorbei.“ (B01) | ◐ G2, G9 (B01, nachgeprüft) |
| K4-R14 | Gerdas Entschluss | P | Mala sagt ihr, was die Versuche gezeigt haben (`rooms/heim_flur.js:109–167`) | ja | als Marko: „Schicken S' ma des Fräulein“ | ✔ M1 |
| K4-R15 | In seiner Sprache, Kanne | P | Schluss `g4_worte` → Ertl → um drei „Endstation …“ → Zwischenwelt → Kanne an Alois (`rooms/heim_flur.js:432–457`) | ja; die Prüfung vor drei sagt, was fehlt | – | ✔ |
| K4-R16 | Ana 2004, Konsulat | P je nach Probe | bei „nein“ Pflicht (`rooms/ana.js:56–95`; `rooms/konsulat.js:9–19`) | ja | Ersatz am Freitag | ✔ |
| K4-R17 | Dienstagabend | O | Suchdienst; zu frühes Gespräch als Fehlweg: „Zu früh. Dir fehlt noch etwas.“ (`97_k4_fam_a.js:234–263`) | – | Mala ordnet ein | ✔ |
| K4-R18 | Derselbe Satz, zwei Städte | P (Freitag, ohne Mala) | `lesart` + `antrag` → „vermisst“; `nachricht` + `kode` → „tot“; beide → „zwei Städte“ (`13_k4_notes.js:111–113`) | ja (Couch „Ein Satz. Zwei Städte.“, Fingerzeig nach der Suche) | die naheliegenden Paare (z. B. Ružas Satz + Mamas Lesart) bekommen „Ich suche einen Zusammenhang, den ich mir wünsche.“ (B02) | ◐ G10 (B02, nachgeprüft) |
| K4-R19 | Silvester: die Spur | P | Blei → Wechsel zu Mala → Spur → Heim → Kevin → Zimmer 214 (`rooms/ana.js:104–171`) | ja (Huber „jedes Silvester“, Kalender) | – | ✔ |
| K4-R20 | Silvestergespräch | P | acht Züge mit Fehlzügen und Rückführung; Sicherung nach zwölf Fehlern; feste Zwischenstände (`97_k4_fam_b.js:125–226`) | ja | jede Fehlwahl beantwortet | ✔ G3, G10 |

#### Abhängigkeiten (gekürzt)

```
PROLOG  Hansi ─ Schlüssel ─ Kaffee ─ Mama (Probe) ─ Abend ─ Dialog 1
TAG 1   Brotdose → Heim → [Mala] Gerda ∥ [Mala] Hbf → Peppino → Kioskfrau/Wimmer ∥ Ana-Foto + Mala → Stiefel  ⇒ Abend → [Mala] Kiste
TAG 2   Kolar (auto) ─┬ Ana 2004 (nur „nein“) ├ Sepps Name (drei Wege) └ um drei (Marko im Flur)
TAG 3   Name → Briefe → [Mala] Koffer → Schluss → Anruf → [Mala] hinüber
        Versuch 1 (Kraus) ┐
        Versuch 2 (Mala + Marko) ┴─(NEUER NACHMITTAG: unsichtbar)─→ Schluss → [Mala] Entschluss
TAG 4   Absage → Abschied ; Worte → Ertl → um drei → Kanne        ⇒ Streit: Malas Notizen gehören jetzt Marko
TAG 5   Ana (Kurve) ∥ lesart+antrag, nachricht+kode → zwei Städte → Brücke → Silvester → Epilog
```

#### Befunde

| ID | Schwere | Kette · Grundsatz | Beleg | Warum ein Erstspieler hängen bleibt | Kleinste Korrektur |
|---|---|---|---|---|---|
| K4-B01 | Hoch | R12/R13 · G2, G9 | Ein Versuch je Nachmittag; ein neuer beginnt nur, wenn **beide** das Haus verlassen und zurückkommen (`rooms/heim_flur.js:36–40`; `rooms/heim.js:79`). Der Text sagt das Gegenteil: „Drei war schon. Für heute ist es vorbei.“ (`:356`), Mama: „Für heute ist es vorbei, Marko.“, Marko: „Um drei ist jeden Tag drei. Ich komme wieder …“ (`:334`). Die Couch verweigert den Schlaf („Gerda kommt jeden Tag um drei. Noch.“, `96_k4_story.js:188`). Bleibt Mala in einem anderen Heimraum, beginnt kein neuer Nachmittag, ohne Rückmeldung (`rooms/heim_flur.js:37–39`). In den 4.000 Läufen vom 7. 11. blieben 43 Läufe am Mittwoch ohne Tageswechsel; die von Hand geprüfte Stichprobe zeigte genau diesen Mechanismus (`qa/results/final/TRIAGE.md`). [Code, nachgeprüft] | Wer dem Text glaubt, will bis morgen warten – und das Spiel lässt ihn nicht schlafen. | Sätze an die Regel anpassen, Mala beim Verlassen mitzählen, Kraus' Sperre bei jeder Ankunft löschen. Ausgearbeitet in G.2, Entwurf 3. |
| K4-B02 | Hoch | R18 · G10, G9 | Naheliegende Paare bekommen den Familien-Pool „Ich suche einen Zusammenhang, den ich mir wünsche. Nicht den, der da ist.“ / „Mama würde sagen: ‚Ne miješaj.‘ Misch nicht alles zusammen.“ (`13_k4_notes.js:154`, `:162`): Ružas Satz + Mamas Lesart (die These des Kapitels), Ružas Satz + Suchantrag (Mala sagte an der Kiste wörtlich „Sie hat ‚vermisst‘ daraus gemacht“, `rooms/jschlaf.js:65`), Kode + Antrag, „Vater“ + Lesart [Code, nachgeprüft] | Am Höhepunkt, ohne Mala, wird die richtige Idee als Wunschdenken abgewiesen. | Beinahe-Treffer für diese vier Paare, z. B. „Das ist es – Ružas Satz und Mamas Lesart. Aber erst jede Hälfte für sich: Was hat Mama daraus gemacht? Was hieß er in Sarajevo?“ (Neuentwurf) |
| K4-B03 | Mittel | R09 · G10 | `ausweis` („Josef Rugiero“) + `umschlag` („Briefe an Giuseppe Ruggiero“) und `peppino` + `umschlag` bekommen Pool-Sätze, etwa „Klingt gut. Stimmt nicht.“ (`13_k4_notes.js:152`), obwohl Wimmer und die Kioskfrau „Josef = Sepp“ selbst sagen | Ein Übersetzer erkennt Josef = Giuseppe sofort | `ausweis` + `umschlag` als vierten Weg zulassen |
| K4-B04 | Mittel (erzählerisch schwer) | R02/R04 · G5, G11 | Sind Peppino und Gerda erledigt, beendet die Stiefel-Erinnerung den Tag sofort (`rooms/wiesn.js:25`; `96_k4_story.js:159`) – Straßenbahn und Lanas Tod (`rooms/wiesn.js:67–68`) sind für immer weg; im Prolog beendet „(Ein Hemd anziehen.)“ das Gespräch, bevor „Ich habe Lana gefunden“ fällt (`rooms/jwohnung.js:110–117`) | Wahrscheinlich gerade bei der Reihenfolge, die Malas Morgenplan nahelegt | Tag 1 erst beim Heimweg werten; im Prolog `k4.p.lana` verlangen |
| K4-B05 | Mittel | R20 → K5 · Kontinuität | Mala gibt `z4_kurve` **vor** der Wahl (`97_k4_fam_b.js:167`); die Entscheidung steht in `k4.fin.kurve` (`:170`, `:173`); exportiert wird aber `kurve:has(G,'z4_kurve')` (`96_k4_story.js:320`) – praktisch immer wahr [Code, nachgeprüft] | Kapitel 5 lässt Mama von der Kurve sprechen, auch wenn sie im Epilog „Ich hätte aussteigen können“ sagte | `kurve:!!G.flags['k4.fin.kurve']` |
| K4-B06 – B11 | Niedrig | G11, Kontinuität, Feinschliff | Tageswechsel nach Zählerstand mitten aus Szenen, mit überholten Ansagen (`97_k4_limbo_sepp.js:71–72`); Mama nachts im Dienst und zugleich „atmet im Bett“ (`rooms/jschlaf.js:68`); Reihenfolge am Donnerstag (`rooms/bmission.js:141`); Carmelas Nachhall ohne Fingerzeig, wenn Mala fehlt (`rooms/bmission.js:86`); „(Nicht lesen.)“ ist keine Wahl (`rooms/jschlaf.js:30–31`); Handy oder Kuli auf Sepp → „Das will hier niemand.“; veraltete Hinweise (`15_hints_k4.js:23`, `:87`) | Feinschliff | je eine Zeile oder Bedingung |

#### Was erhalten bleiben soll

- **Kausale Ortsfreigaben mit Begründung:** Heim über die Brotdose, Friedhöfe und Bahnhofsviertel über Wimmer und die Kioskfrau, Konsulat über Kolar, Amt am Feiertag geschlossen.
- **Dramatische statt echter Zeit:** „Um drei“ wartet man ab; Uhrzeiten haben keinen Zeitgeber.
- **Versuchslogik:** Die Beinahe-Treffer bringen das Experimentieren bei („Das sehe ich nur, wenn ich eins weglasse.“, `13_k4_notes.js:132–137`), ein vermischter Versuch wird erkannt (`rooms/heim_flur.js:422`). Das ist das einzige echte Experimentierrätsel des Spiels.
- **Malas Geheimnisse als Wissensmodell** (`13_k4_notes.js:100–107`): „Das hat Mala in der Kiste gelesen, nicht ich. Sie hat es mir nicht gesagt.“
- **Fehlwege mit eigener Antwort und ohne Sackgasse:** falscher Brief, Wahrheit an Alois, Kraus „Geist“, zu frühes Gespräch, Lüge am Telefon, Silvester-Fehlzüge.
- **Rätsel tragen das Thema:** Sepps „sto bene“, Gerdas „später“ und Mamas „vermisst“ spiegeln einander; die Nebenfiguren haben eigene Motive (Wimmers Diskretion, Obermaiers Papier, Kraus' Brandschutz, Ertls „Geländer“).

#### Grenzfälle

- Sepp kann schon am Christtag erlöst werden (Bunker + Umschlag) – zulässig, danach bleibt nur ein veralteter Hinweis.
- Um drei mit nur einer Figur: Der Nachmittag wird verbraucht, das Spiel warnt aber vorher (`rooms/heim_flur.js:359–361`).
- Nachts darf Mala allein nur in Mamas Haus gehen (`96_k4_story.js:131`; `rooms/jhaus.js:89`); in der Silvesternacht kann sie nicht allein los.
- Keine echte Sackgasse gefunden [abgeleitet].

### E.5 Kapitel 5 – Sarajevo (Finale)

**Vorbemerkung.** Dieses Kapitel habe ich selbst gebaut. Die Teilprüfung lief deshalb ausdrücklich mit dem Auftrag, es nicht zu schonen. Die schweren Befunde habe ich danach selbst nachgeprüft. Einen davon (B10) habe ich dabei abgeschwächt, weil der beanstandete Satz erst nach dem Schluss des Spielers fällt.

**Kurzbild.** Die Hamdija-Kette ist die beste Geisterkette des Spiels. Sie ist über vier Abschnitte vorbereitet und verlangt zwei unabhängige Belege mit begründeter Teilablehnung. Leugnen wird umkehrbar beantwortet, und die gefundene Liste führt in die Welt der Lebenden zurück. Der Freitag läuft auf drei echten Spuren. Die Schwächen liegen dort, wo das Finale den Spieler selbst denken lassen will. Bei „Wem gehören die Fahrscheine?“ gilt nur eines von mehreren plausiblen Notizpaaren, und die Absage rät ausgerechnet davon ab, zwei Geschichten zu verbinden. Bei „Zwei Namen“ läuft der Hinweis in eine Schleife. Das neue Verb „Zeichne“ scheitert bei seiner einzigen freien Übung an einem 6-Sekunden-Fenster. Samstag und Montag sind bewusst geführt.

**Struktur** (Phasen `96_k5_story.js:8–16`; Abschnitte enden nach ihren Pflichtschritten, `:133–141`). Prolog linear (Taxi → Hajra → Garten → Haus 7 → Nada) → Donnerstag parallel (Nedžad ∥ Hahn spüren) → Donnerstagnacht parallel (Pensionsfenster/Atem ∥ Kanister nachts → Hamdija) → Freitag **drei Spuren** (Gerichtsmedizin ∥ Hamdija ∥ Tafel und Pfosten) → Begräbnis geführt → Totenmahl in Nadas Wohnung (Schluss `f5_jasna`) → Bank mit Warnung und eigenem Stand „Vor dem Samstag“ → Samstag linear → Montag linear. Übernahmen aus K3/K4 ändern nur Sätze (`96_k5_story.js:33–61`).

#### Rätselinventar

| ID | Kette | P/O | Kern (Problem → Lösung) | Hinweis vor Bedarf? | Reaktion auf Fehlversuche | Bewertung |
|---|---|---|---|---|---|---|
| K5-R01 | Unter der Plane | P | Hajra: Kanister „im Garten, unter der Plane“ → Mala spürt den Garten, dann hebt Marko die Plane (`97_k5_a.js:66`, `:147–173`) | ja | vor dem Spüren: „Darunter Hajras Holz, nehme ich an.“ – Marko tut, als wisse er nicht, was er weiß (B05) | ◐ |
| K5-R02 | Frist für die Tafel | P | Nedžad: „Nadas Tafel …“ → `s5_frist` (`97_k5_b.js:195–197`) | ja | eigene Antwort an der Werkbank | ✔ |
| K5-R03 | Malz → der Hahn | P | Mala spürt den Hahn → `b5_reihe` (`97_k5_b.js:99–101`) | ja (Malzgeruch, Hajra, Kopfweh) | Kanister am Tag: „Nicht am Tag. Nachts war die Schlange.“ (`:36`) | ✔ G10 vorbildlich |
| K5-R04 | Lanas Zimmer, Nadas Briefe | P (Nachhall) | Zimmer öffnet sich über die Frage nach den Fahrscheinen; Mala spürt die Mappe (`97_k5_a.js:273–320`) | teilweise | Tür: „Ich frage Nada erst“ – ohne passende Frage (B13) | ◐ G4 |
| K5-R05 | Der Atem | P | Pensionsfenster → Szene „Acht Wochen“; danach freie Übung: hauchen, Mala zeichnet – nur innerhalb von 6.000 ms (`97_k5_a.js:372–415`) | ja | „Die Scheibe ist klar. Er muss erst hauchen.“ (B07) | ◐ G7 |
| K5-R06 | Der Mann am Hahn | P | Kanister nachts an Hahn oder Mitte → Hamdija (`rooms/k5_neu.js:17`, `:31`; `97_k5_b.js:33–41`) | ja (Mala am Tag, Ende der Atem-Szene, Bettsatz) | ohne Kanister: „Mit den Händen?“; Kanister am Brückenkopf → Standardsatz (B06); „Sie sind tot.“ → er flackert weg, neu anstellen holt ihn zurück | ✔ G3 |
| K5-R07 | Zwei Namen | P | Brett „MALA“ gegen Nadas „wie sie heißt“: Mala spürt Brett und Mappe → `s5_beide`; + Brett → `s5_teile`; Satz an Zlata und an Nada; „Ein Vorschlag“ greift nur mit `s5_teile` (`13_k5_notes.js:62–63`; `97_k5_b.js:252–277`) | ja; beide Nachhall-Notizen enthalten „Damit man sie findet“ | drei Beinahe-Treffer mit eigenem Text; Hinweis-Schleife ohne `s5_teile` (B02) | ◐ G2, G10 (B02, nachgeprüft) |
| K5-R08 | Gravur und Pfosten | P | drei Zeilen, je drei Möglichkeiten; gemeldet wird die erste falsche Zeile mit Begründung (`97_k5_b.js:210–216`) | ja (`s5_teile` enthält die Antwort) | höchstens sechs Versuche; die Begründungen zitieren Sätze, die nie gefallen sind (B12) | ✔ |
| K5-R09 | Hamdija erkennen, Liste, Übergang | P | Mala spürt den 19. April an drei Stellen (nur Freitag) + sieht den Kasten; Marko zwei Sätze in beliebiger Reihenfolge → „Otvori.“ → Liste an Kolar → „Sie sind gefunden.“ → Hinübergehen am Hahn (`97_k5_b.js:61–145`, `:180–188`) | ja; dass die Nachhalle erst am Freitag da sind, sagt die Welt nicht (B08) | jeder Satz allein wird begründet abgelehnt | ✔ M1, M3 – beste Kette des Kapitels |
| K5-R10 | Wer mich festhielt | O | `b5_hand` + `b5_tag` → `b5_wer` (`13_k5_notes.js:64`) | – | folgenlos, Inhalt steht schon vorher da (B09) | ◐ M2 |
| K5-R11 | Wem gehören die Fahrscheine? | P | Stufe 1: `f5_dose` + `f5_eursamstag` → `f5_wem`; Stufe 2: **nur** `f5_wem` + `j5_treppe` → `f5_jasna` (`13_k5_notes.js:65–66`) | ja (Hinweis h5l) | plausible Paare mit „Mama hat ihr die Tür aufgemacht“, „Ich setze mich ans Fenster“, „Am Fenster und daneben“ → Pool-Sätze; Paare mit j5-Notizen: „Das sind zwei verschiedene Geschichten. Ich sollte sie nicht ineinanderschieben.“ (B01) | ◐ G9, G10 (B01, nachgeprüft) |
| K5-R12 | Fahrscheine an der Tür | P | Dose an Mama im siebten Stock, dann klopft Mala (`rooms/k5_haus7.js:111`; `97_k5_c.js:51–92`) | ja | beim Frühstück: „Nicht hier. An der Tür.“; Treppe: „Nicht ich. Das ist nicht mein Klopfen.“ | ✔ G10 |
| K5-R13 | Nadas Küche: die Zeichnung | P | hauchen → zeichnen → hauchen → zeichnen → Räder, ohne Zeitdruck (`97_k5_c.js:102–130`) | ja; Räder-Motiv seit K2 (`rooms/carsija.js:75`) | jede falsche Reihenfolge mit klarem Satz | ✔ M5 (Einlösung) |
| K5-R14 | Hinauf zu Ruža / Am Tor | P | geführt; „Kommst du?“ hat nur Nein-Varianten (`97_k5_c.js:169–195`) | – | – | – (Szene, kein Rätsel) |
| K5-R15 | Wasser und letzte Zeichnung | P | Kanister am Hahn füllen → Küche → Zoran → Fenster (`97_k5_c.js:279–344`) | ja | – | ✔ |

#### Abhängigkeiten (gekürzt)

```
PROLOG  Taxi → Hajra → Vratnik → [Mala] Garten → [Marko] Plane → Haus 7 → Nada
DO      Nedžad (s5_frist) ∥ [Mala] Hahn (b5_reihe)                                ⇒ Abend
DO-N    [Mala] Brett + [Mala] Mappe ⇒ s5_beide ⇒ (+ Brett) s5_teile   (optional schon jetzt)
        Fenster ⇒ Atem ∥ Kanister nachts ⇒ Hamdija                                 ⇒ Bett
FR      A Kolar ─────────────────┐
        B [Mala] Tag ×3 + Kasten ─┴→ zwei Sätze → „Otvori“ → Liste → Kolar → „gefunden“ → [Mala] hinüber
        C s5_beide → Zlata ∧ Nada → Vorschlag [s5_teile!] → Gravur → Vlado               ⇒ Begräbnis
TOTENMAHL „Mama?“ ∧ „Danke, Nada.“ ∧ f5_jasna (nur ein Paar gilt) ⇒ Tabija → Bank → „Vor dem Samstag“
SA      Haus 7 → Dose an Mama → Klopfen → hauchen/zeichnen ×2 → Räder → Drei → Tor
MO      Kanister → Küche → Zoran → Fenster
```

#### Befunde

| ID | Schwere | Kette · Grundsatz | Beleg | Warum ein Erstspieler hängen bleibt | Kleinste Korrektur |
|---|---|---|---|---|---|
| K5-B01 | Hoch | R11 · G9, G10 | Nur `f5_wem` + `j5_treppe` gilt (`13_k5_notes.js:66`); `f5_wem` + `f5_tuer` („Mama hat ihr die Tür aufgemacht“), + `k5_c_muenchen` („Ich setze mich ans Fenster“), + `f5_plaetze` bekommen Pool-Sätze; Paare mit j5-Notizen bekommen „Das sind zwei verschiedene Geschichten. Ich sollte sie nicht ineinanderschieben.“ (`:84–94`) – dabei ist die Lösung selbst fallübergreifend [Code, nachgeprüft] | Drei Notizen zeigen richtig auf Mama; die Absage sagt „falsch“ und rät, nicht zu verbinden. Das ist der Höhepunkt der Ermittlung. | Beinahe-Treffer für die plausiblen Paare, neutraler Pool-Satz. Ausgearbeitet in G.2, Entwurf 4. |
| K5-B02 | Hoch | R07 · G2, Hinweise | „Ein Vorschlag“ erscheint, sobald beide Sätze gesagt sind, auch ohne `s5_teile`; dann: „Ich weiß noch nicht, wie es aussehen soll …“ (`97_k5_b.js:252`, `:267`, `:277`); Hinweis h5j Stufe 3/4 rät genau zum Vorschlag (`15_hints_k5.js:39–42`); kein Thema nennt `s5_beide` + `s5_brett`. Durchlauf und Hinweisprüfung treffen den Stand nie, weil die Musterlösung `s5_teile` schon am Donnerstag bildet [Code, nachgeprüft] | Das Sicherheitsnetz schickt in eine Ablehnung, die nicht aufs Notizbuch zeigt. | h5j prüft zuerst `s5_teile`: „Im Notizbuch ‚Damit man sie findet‘ und ‚Zlatas Brett‘ verbinden.“; den Vorschlag erst mit `s5_teile` anbieten |
| K5-B03 | Mittel | R07 · G10 | Naheliegend `s5_beide` + `s5_tafel` („Was kommt auf die Tafel?“) bekommt nur den Pool (`13_k5_notes.js:63`) | richtige Frage, falsche Antwort | als zweiten gültigen Weg zulassen |
| K5-B04 | Mittel | Technik, G8 | Die Gesprächsschleife endet nicht, wenn eine Option einen Abschnittswechsel auslöst (`05_engine.js:319–327`). **[beobachtet]:** Donnerstag, erst Brauerei, dann Nedžad „Nadas Tafel …“ → der Abend läuft, Marko steht in Nadas Wohnung, und unten erscheint Nedžads Menü („Das Stemmeisen …“, „Bis später, Nedžad.“). Dasselbe gilt laut Code für „Mama?“ und „Danke, Nada.“ am Freitagabend, wenn `f5_jasna` schon gebildet ist [abgeleitet] | bricht die Illusion; keine Sackgasse | in der Engine: `menuLoop` verlassen, wenn sich Raum oder Abschnitt geändert hat (wirkt in allen Kapiteln) |
| K5-B05 | Mittel | R01 · G9, G11 | Hajra und Marko wissen, wo die Kanister liegen (`97_k5_a.js:66`, `:132`); vor Malas Spüren sagt Marko „Darunter Hajras Holz, nehme ich an.“ (`:156`) | lehrt eine falsche Regel: Marko darf Bekanntes nicht tun | „Ich hebe eine Ecke. Nur Holz. Die Kanister müssen weiter hinten sein; Mala sieht durch.“ (Neuentwurf) |
| K5-B06 | Mittel | R06 · G10 | Der Brückenkopf sagt „Bis hierher stand die Schlange damals.“ (`rooms/k5_neu.js:28`), hat aber kein `with` für den Kanister | richtiger Ort aus der Erzählung, Standardsatz | `with:{kanister:…}` am Brückenkopf |
| K5-B07 | Mittel | R05 → R13 · G7, G9 | Zeichnen geht nur bis 6.000 ms nach dem Hauchen (`97_k5_a.js:377`); vorher laufen zwei Sätze mit zusammen etwa 7,6 s Sprechdauer (Formel `05_engine.js:197`, Normaltempo; bei langsamem Text ×1,5) [Code, nachgerechnet]; `drawIf` prüft nur die Phase (`rooms/k5_stadt.js:65`) | Die einzige freie Übung des neuen Verbs scheitert, wenn man die Sätze nicht wegklickt – mit dem Satz „Er muss erst hauchen.“ | Beschlag bis zur nächsten Handlung halten (wie am Samstag); `drawIf` an `k5.n1.atem` binden |
| K5-B08 | Mittel | R09 · G2, G9 | Die Nachhalle des 19. April gibt es nur am Freitag (`97_k5_b.js:102`, `:108`, `:114`); nach „Ich bin der Junge“ → „Du bist ein Mann.“ (`:63`) kommt kein Wink | Wer nachts schon gespürt hat, versucht es am Freitag kaum noch einmal | nach `:63` Mala: „Er glaubt dir nicht. Der Tag weiß es. Am Hahn, in der Mitte, an der Brücke.“ (Neuentwurf) |
| K5-B09 | Mittel | M2, G6 | Stufe 1 der Fahrschein-Kette sprechen Marko und Mala vorher aus („Nada war nie samstags dabei.“, `97_k5_a.js:410`; „Euer Samstag. Sie hat recht. Sie war nie dabei.“, `:321`); `b5_wer` steht schon in `b5_tag` | Von fünf Schlüssen verlangen nur `s5_teile` und `f5_jasna` eigene Leistung | `:410` kürzen; `b5_wer` zur Bedingung für einen Satz an Hamdija machen |
| K5-B11 | Mittel | G2, G6 | „Ich will sehen, wo es war.“ (Mama, `97_k5_a.js:178`) bleibt drei Tage offen ohne Handlungsmöglichkeit; erledigt erst mit dem Wasser am Montag (`13_k5_notes.js:57`) | offener Auftrag ohne Weg | Mama geht am Montag mit zum Hahn |
| K5-B10 | Niedrig (abgeschwächt) | R12–R14 · G12 | Der Samstag ist bewusst geführt. Malas Satz auf der Bastei („Für deine Mutter. Sie soll Mama holen.“, `97_k5_b.js:408`) fällt nur **nach** `f5_jasna` und wiederholt den Schluss des Spielers; Mamas „Um elf … Ich gehe hin.“ (`97_k5_c.js:20`) nennt das Teilziel (G2), nicht die Lösung [Code, nachgeprüft] | – | allenfalls kürzen („Du weißt, für wen.“) |
| K5-B12 – B16 | Niedrig | Pflege, G4, G5 | Gravur zitiert Sätze, die nie fielen (`97_k5_b.js:213–215`); Zimmer öffnet sich über eine Frage ohne Anlass (`97_k5_a.js:318–320`); Damir nur am Donnerstag, ohne Warnung verpassbar (`rooms/k5_mitte.js:13`); Lauschen nur am Hahn, Mala geht in K5 nirgends durch Wände (B15); Malas Gesprächsmenü bietet keine Hinweise (`97_k5_mala.js:26–36`); Kolar „Sie sind pünktlich“ immer; toter Text (`97_k5_b.js:23`) | Feinschliff | je eine Zeile |

#### Was erhalten bleiben soll

- **Hamdija-Kette (R06/R09):** über vier Abschnitte vorbereitet, Leugnen umkehrbar beantwortet, zwei unabhängige Belege mit Teilablehnung, Rückkehr in die Welt der Lebenden über die Liste, Nachklang im Finale.
- **Absichtserkennung bei Gegenständen:** Die Dose und der Kanister haben fast überall eigene Antworten; „Nicht hier. An der Tür.“ ist Gilberts *Reward Intent* in einem Satz.
- **Atem-Regel:** in der Welt begründet (nur sein Atem, keine Buchstaben, erst nach dem Begräbnis) und am Samstag ohne Zeitdruck angewandt; die Räder schlagen den Bogen von Kapitel 2 über den Samstag zum Montag.
- **Malas Ethik als Spielregel:** Sie entscheidet nicht für Nada und Zlata (`97_k5_mala.js:31`); Marko übersetzt Absichten, keine Botschaften.
- **Punkt ohne Rückkehr mit Warnung und eigenem Stand** („Vor dem Samstag“) – Gilberts Schluss zum Speichern, sauber gelöst.

#### Grenzfälle

- Freitag in jeder Reihenfolge lösbar; Flackern und Neu-Anstellen beliebig oft.
- Der Kanister geht bis Montag nie verloren, dazu zwei Rückfälle (`97_k5_a.js:153`; `97_k5_c.js:270`).
- Totenmahl-Szene: wird vor dem Start gespeichert, aber nach dem Laden nicht nachgeholt (`96_k5_story.js:194`) [abgeleitet]; kein Fortschrittsverlust.
- Keine echte Sackgasse gefunden [abgeleitet].

## F. Kapitelübergreifende Analyse

### F.1 Fähigkeiten und Regeln über fünf Kapitel

| Regel / Fähigkeit | K1 Split | K2 Sarajevo | K3 Mostar | K4 München | K5 Finale |
|---|---|---|---|---|---|
| **Spüren** (Nachhall) | eingeführt im Archiv (Ansehen reicht nicht, Spüren schon); Pflicht: Archiv, Seesack, Schutt | Pflicht: Armband, Leiste, Herd, Schutzraum | Kernwerkzeug: an 43 % der Hotspots angeboten; Pflicht: Glocke, Lichtfolge, Führerhaus | Pflicht: Koffer, Fotos | Pflicht: Plane, Hahn, Brett, Mappe, der 19. April |
| **Lauschen** (Lebende) | nur Stimmung, nie nötig (K1-B08) | Pflicht: Emina, Šehić | Nebenrolle | hört Gedanken, z. B. Mamas „in seiner Sprache“ als Fingerzeig (`rooms/heim_flur.js:537`) | nur am Hahn; Gedanken kommen über „Spüre“ (K5-B15) |
| **Durch Wände** | Archiv | Kammer, Stahltür | durch Rolltor und Schubladen sehen | Bunker (nur Mala) | nicht genutzt |
| **Malas Licht im Dunkeln** | Kühlraum | Schutzraum | – | – | – |
| **Einen Geist erst finden** (Kopfschmerz, „Leere Stelle“) | nur Ivka, durch Markos eigenen Gang | Alija | Bato (übers Wasser) | Hansi, Peppino, Gerda | Hamdija |
| **Leugnen → Erkennen an einem Ding** | Ivka (Handschuhe) | Tomaž (Armband), Ivan, Zora | Mate (zweistufig), Bato | Sepp, Gerda/Alois, Hansi | Hamdija (zwei Belege) |
| **„(Mala fragen.)“ / Zustimmung** | – | – | eingeführt; Thema am Grab | nur für Lanas Geschichte; Zustimmung erneut | Malas Ethik: sie entscheidet nicht für andere |
| **Mala allein** | – | – | Mala bleibt in Skela | tagsüber allein durch die Stadt | nur noch erzählt (acht Wochen bei Nada) |
| **Wissen getrennt halten** | gemeinsames Notizbuch | gemeinsames Notizbuch | gemeinsames Notizbuch | **Malas Geheimnisse gehören ihr** bis zum Streit | gemeinsames Notizbuch |
| **Zeichnen in Markos Atem** | Vorbote: eine Straßenbahn mit einer Drei auf der beschlagenen Scheibe – „Ich war es. Im Halbschlaf.“ (`rooms/flat.js:232`) | Lana hat Marko das Zeichnen beigebracht, „Die Räder.“ (`rooms/carsija.js:75`) | – | – | neues Verb, Pflicht am Samstag |

**Lesart.** Die Fähigkeiten wachsen ruhig und folgerichtig. Jedes Kapitel fügt genau eine neue Regel hinzu (Malas Spur, Brücken und Zustimmung, Mala allein und Geheimnisse, Zeichnen). Jede neue Regel wird vor ihrer entscheidenden Anwendung in einer Situation gezeigt, nicht erklärt (Brücken: `rooms/starimost.js:238` lange vor der Straßenbrücke; Kiste: die Regel steht im Notizbuch-Satz). Zwei Lücken: **Lauschen** und **Finden** übt Kapitel 1 nicht, Kapitel 2 setzt beide voraus (K1-B08). Und **Zeichnen** wird in Kapitel 5 eingeführt, aber seine einzige freie Übung scheitert am Zeitfenster (K5-B07). Die schönste Einlösung des Spiels ist die Straßenbahn auf der beschlagenen Scheibe in Markos Wohnung (Kapitel 1). Marko hält sie für seine eigene Zeichnung im Halbschlaf. Vier Kapitel später zeichnet Mala in seinem Atem. Diese Linie sollte bei jeder Überarbeitung erhalten bleiben.

### F.2 Wissen, Notizbuch und Schwierigkeit

- **Suchraum im Notizbuch** (Median / Maximum der Notizen zur Wahl): K1 1/4 · K2 8/19 · K3 16/36 · K4 14/26 · K5 11/20 [beobachtet]. Die Schwierigkeit steigt also bis Kapitel 3 und fällt dann leicht. Das ist eine sinnvolle Kurve, aber sie entsteht vor allem durch **Menge**, nicht durch Tiefe der Schlüsse (Muster 6 und 8).
- **Pflicht-Schlüsse mit eigener Denkleistung:** K1 einer (im Prolog), K2 mehrere (Fall 1, Malas Spur), K3 im Wesentlichen einer (`a3_girl`), K4 mehrere (Versuche, zwei Städte), K5 zwei (`s5_teile`, `f5_jasna`). Der Anteil echter Ermittlung schwankt stärker als die Kurve vermuten lässt.
- **Gleichzeitig offene Spuren** (Median der Hinweisthemen; Anteil der Stände mit höchstens einem): K1 1 · 79 % → K2 1 · 54 % → K3 2 · 40 % → K4 2 · 46 % → K5 1 · 69 % [beobachtet]. Das entspricht Gilberts Bild: Das Einstiegskapitel ist enger, die Mitte breit, das Finale verdichtet sich bewusst.
- **Reaktion von Personen auf gezeigte Gegenstände:** K1 53 % → K2 10 % → K3 21 % → K4 19 % → K5 9 % [beobachtet]. Kapitel 1 setzt hier einen Standard, den die späteren Kapitel nicht halten. Am Finale fällt das am stärksten auf: Man zeigt den Menschen, die einem am nächsten sind, die wichtigsten Dinge, und hört oft nur „Das will hier niemand.“

### F.3 Beziehung Marko–Mala

Die Beziehung entwickelt sich über die Rätsel, nicht nur über Gespräche, und das ist die größte Stärke des Spiels im Sinne des Auftrags (M4):

- **K1:** Vertrauen entsteht durch Zulassen („Dann sieh nach.“ im Hafenamt). Nach Ivka verschwindet Mala, und erst Malas Zettel und die Bank an der Riva bringen die Zusage.
- **K2:** Marko gibt ihr den entwerteten Fahrschein, Mala gibt ihren eigenen her. Ihre Geschichte wird Markos Kindheit („Ich war Mali“).
- **K3:** Das Thema heißt „fragen statt versprechen“. Am Grab entscheidet die richtige Frage, nicht die richtige Notiz. Mala ist frei und bleibt, weil sie es will.
- **K4:** Mala geht allein, hat Geheimnisse, es kommt zum Streit. Die Nacht auf der Hackerbrücke und die Silvesternacht folgen. Erstmals trennt das Spiel ihr Wissen von seinem.
- **K5:** Mala entscheidet nicht für Nada und Zlata. Marko übersetzt Absichten. Am Samstag fährt sie die Drei ein letztes Mal.

Die Nebenfiguren haben fast durchweg eigene Motive. Wimmers Diskretion, Obermaiers Papier, Kraus' Brandschutz, Zdenkas Gasse, Šehićs Hanka und Nedžads „Ich graviere, was man mir sagt“ sind Haltungen, keine Tauschautomaten. Ausnahmen sind einzelne Beschaffungen nach dem Muster „Gefallen gegen Gegenstand“: das Radio gegen die Zeitung (K1-B01) und der Weg in die Kammer (K2-B04).

### F.4 Kontinuität und Gilberts „Live and learn“-Übung

Gilbert schlägt vor, einen Durchgang als Geschichte nachzuerzählen und Stellen zu suchen, an denen eine Figur etwas weiß, das sie nicht wissen kann. Gefunden:

- **Kapitel 4 macht das vorbildlich:** Malas Wissen aus der Kiste bleibt ihres, bis sie es teilt (`13_k4_notes.js:100–107`).
- **K3-B04:** Mala erkennt das Dachfenster aus einer Erinnerung, die sie noch nicht hatte.
- **K5-B12:** Die Gravur-Absagen zitieren Sätze von Nada und Zlata, die nie gefallen sind.
- **K5-B05:** Das Umgekehrte – Marko tut so, als wisse er nicht, was Hajra ihm gerade gesagt hat.
- **K2-Grenzfall:** Liest Marko die Rotkreuz-Nachricht und gibt sie Nada vor dem Epilog, erzählt er von der Brücke und dem Lastwagen, die erst auf der letzten Fahrt vorkommen.
- **K4-B07:** Mama hat nachts Dienst und „atmet im Bett“.
- **K4-B05 (kapitelübergreifend):** Die Entscheidung an der Kurve kommt praktisch immer als „ja“ in Kapitel 5 an. Mama spricht dann im Finale von der Kurve, obwohl sie im Epilog „Ich hätte aussteigen können“ gesagt hat.
- **K2-B12:** kleine Widersprüche (wer das Foto gemacht hat, die Uhrzeit auf dem Zifferblatt, das Gründungsjahr der Kafana).

### F.5 Vorbereitung und Einlösung des Finales (M5)

| Prüffrage | Urteil | Begründung |
|---|---|---|
| Vermittelt Kapitel 1 die Regeln durch Situationen? | **teilweise** | Wechsel, Spüren, Notizbuch, Hinübergehen und Malas Licht werden vorbildlich in Situationen eingeführt. Lauschen und Finden fehlen (K1-B08). Notizbuch-Schlüsse sind nach dem Prolog nie mehr nötig (K1-B06). |
| Vertiefen Kapitel 2 und 3 Mechaniken und Beziehungen? | **erfüllt** | K2 bringt Synchronarbeit, Malas Geschichte und Notizfragen in Gesprächen. K3 bringt räumliche Zusammenarbeit über zwei Ufer, Zustimmung als Regel und mehrere Spuren. |
| Verändert Kapitel 3 die Ausgangslage, ohne das Finale vorwegzunehmen? | **erfüllt** | Mala ist frei und bleibt freiwillig. Das trägt K4 (Mala allein) und K5 (Malas Entscheidungen), ohne Lanas Begräbnis vorwegzunehmen. |
| Bereitet Kapitel 4 die entscheidenden Konflikte und Fähigkeiten vor? | **weitgehend** | Die Exhumierung am 10. Januar, „vermisst“ gegen „tot“, Malas neue Zustimmungsfrage und der Kopfschmerz als Preis ihrer Nähe führen ins Finale. Das Zeichnen ist nicht vorbereitet, außer durch die Straßenbahn auf der Scheibe in Kapitel 1. Die Kurven-Entscheidung kommt falsch an (K4-B05). |
| Verlangt Kapitel 5 die eigenständige Anwendung erworbenen Wissens und führt es die Fäden zusammen? | **teilweise** | Die Fäden laufen zusammen: Lana, Zoran, Nada, Zlata, die Drei, Ruža, der Hahn, Alija. Die Hamdija-Kette verlangt echte Anwendung der Geisterregeln. Der Höhepunkt der Ermittlung (Fahrscheine) bestraft aber richtige Ideen (K5-B01). Die Signatur-Fähigkeit wird nicht frei geübt (K5-B07). Der Samstag ist bewusst geführt. |

## G. Konkrete Überarbeitungen

### G.1 Priorisierte Vorschläge

Aufwand: **XS** bis eine Stunde (Text oder Bedingung) · **S** ein bis vier Stunden · **M** ein halber bis zwei Tage · **L** mehr. Darin enthalten sind jeweils die betroffenen Durchläufe, `hintcheck.js` und ein Regressionstest; ohne sie ist keine Änderung fertig. Ist-Zustand und Begründung stehen bei den Befunden in Abschnitt E.

**Muss – vor einer weiteren Veröffentlichung**

| Nr. | Befund(e) | Grundsatz | Kleinste wirksame Korrektur | Weitergehend | Aufwand | Abnahmekriterium |
|---|---|---|---|---|---|---|
| P01 | K2-B01 | G5, Schluss | Nachricht beim Fund vorlesen; Nada nimmt sie vor dem Epilog nicht an; f4 an das volle Wärmefach binden | Entwurf 1 | S | Regressionstest: ungelesene und gelesene Nachricht im Finale an Nada → Gegenstand bleibt, Kapitel endet |
| P02 | K5-B02 | G2, Hinweise | h5j prüft zuerst `s5_teile`; „Ein Vorschlag“ erst mit `s5_teile` anbieten | – | XS | Stand „beide Sätze gesagt, `s5_teile` fehlt“: Hinweis nennt das Notizbuch, kein Vorschlag im Menü |
| P03 | K2-B02, K2-B03 | G8, G9, G10, G11 | `m2_lana` nach „Prisutna“ vergeben, wenn sie fehlt; Register + Helferin gilt; Malas Satz am Aufzug gibt „Neunter Stock“ | Entwurf 1 | S | Fall 3 ohne Schluss beendet → Karton öffnet sich; die drei Belege für „neunter Stock“ führen zum Schluss |
| P04 | K4-B01 | G2, G9 | Sätze an die Regel anpassen; Mala beim Verlassen mitzählen; Kraus' Sperre bei jeder Ankunft löschen | Entwurf 3 | S | Mittwoch, Versuch 1 vorbei: kein Satz behauptet „für heute“; Weggehen mit Mala in 214 gibt einen neuen Nachmittag |
| P05 | K3-B01, K3-B04 | G9, G10, G2, G4 | Bato reagiert auf Dachfenster **und** Lichtfolge; Lichtprobe erst nach dem Glocken-Nachhall | Entwurf 2 | S–M | Sonntag ohne Ordnen bis zur Konfrontation spielbar; Lichtprobe vor der Glocke wird begründet abgelehnt |
| P06 | K5-B01, K5-B09 | G9, G10, M2 | Beinahe-Treffer für drei plausible Paare; neutraler Pool-Satz; Vorwegnahme kürzen | Entwurf 4 | S | Jedes der fünf plausiblen Paare bekommt eine eigene Antwort; kein Satz vor dem Schluss nennt seinen Inhalt |
| P07 | K4-B02 | G10 | Beinahe-Treffer für Ružas Satz + Lesart, Ružas Satz + Antrag, Kode + Antrag, „Vater“ + Lesart | – | XS | Diese vier Paare zeigen auf den fehlenden Zwischenschluss |
| P08 | K2-B04 | G11, G9 | Emina geht beim nächsten Betreten sichtbar; das zweite Lauschen bleibt freiwillig | Entwurf 5 | S | Kammer erreichbar ohne zweites Lauschen; Hinweis nennt keine falsche Ursache |
| P09 | Muster 7 (K2–K5) | G10 | Pool-Sätze neutral formulieren („Das bringt mich hier nicht weiter.“); keine Behauptung über Richtung oder Wunschdenken | Beinahe-Treffer je Pflichtschluss (siehe P16) | XS | `grep` auf die beanstandeten Sätze leer; Satzpools enthalten keine Aussage über Fälle oder Personen |
| P10 | K5-B04, Muster 9 | Technik, G8 | `menuLoop` (`05_engine.js:319`) verlässt die Schleife, wenn sich nach einer Option Raum oder Abschnitt geändert hat | – | XS | Nachgestellter Fall (Brauerei, dann Nedžad): nach dem Abendwechsel kein fremdes Menü; alle fünf Durchläufe grün |
| P11 | K4-B05 | Kontinuität | `kurve:!!G.flags['k4.fin.kurve']` in `96_k4_story.js:320` | – | XS | „Ihr musstet fahren“ gewählt → `mala.c4end.kurve` ist false; Kapitel 5 spricht nicht von der Kurve |
| P12 | Muster 10 | Hinweise | `hintcheck.js` zusätzlich gegen Stände aus Zufalls- und Variantenläufen (`qa/sim.js` B/C) laufen lassen; Stufe 4 muss im Stand ausführbar sein | – | M | Prüfung meldet die heute bekannten Fälle (K1-B05, K2-B05–B07, K4-B11, K5-B02) und nach den Korrekturen keine |

**Soll – deutliche Verbesserung, geringer Aufwand**

| Nr. | Befund(e) | Grundsatz | Kleinste wirksame Korrektur | Weitergehend | Aufwand | Abnahmekriterium |
|---|---|---|---|---|---|---|
| P13 | K5-B07 | G7, G9 | Beschlag am Pensionsfenster hält bis zur nächsten Handlung (wie am Samstag); „Zeichne“ erst nach der Atem-Szene anbieten | Malas erste Zeichnung in der Donnerstagnacht als Spielerhandlung | XS | Hauchen, Sätze ausreden lassen, zu Mala wechseln, zeichnen → gelingt; auch bei langsamem Text |
| P14 | K4-B04 | G5, G11 | Tag 1 erst beim Heimweg werten; im Prolog „Lana erzählt“ verlangen | – | S | Reihenfolge Bahnhof → Heim → Wiesn: Straßenbahn-Gespräch bleibt erreichbar |
| P15 | K1-B01, K1-B02 | G9, G10, G11 | Zdenka erkennt die Kassetten-Idee; Batterien auch ohne Zeugenfrage zu finden | Kette „Lukas Lied hörbar machen“ um die Absicht herum bauen | S | Kassette bei Zdenka → Radio oder klarer Verweis; Terminal mit Radio im Gepäck erreichbar |
| P16 | K1-B03, K1-B04, K3-B05, K3-B06, K4-B03, K5-B03, K5-B05, K5-B06 | G10 | je ein `with`-Eintrag, Beinahe-Treffer oder eigener Satz an der genannten Stelle | – | S | jeder genannte Versuch bekommt einen Satz, der auf die richtige Spur zeigt |
| P17 | K3-B02, K3-B03, K2-B08, K5-B09 (Muster 8) | M2, G8 | Zeilen auf die Beobachtung kürzen oder den Schluss beim Aussprechen selbst ziehen; formale Schlüsse nicht als Schloss benutzen | – | M | Liste der Pflichtschlüsse: keiner wird vorher ausgesprochen oder er ist kein Schloss mehr |
| P18 | K3-B07, K5-B08 | G2 | Sonntag-Bett nennt, was fehlt; Malas Wink am Freitag „Der Tag weiß es.“ | – | XS | Bett am Sonntag nennt die offenen Spuren ohne Ort |
| P19 | K1-B08 | M1, M5 | Lauschen bei Dinko als Notiz, die die Gesprächsoption öffnet; Bruno erst durch Spüren an der Loge finden | – | S | K1 enthält je einen Pflichtschritt mit Lauschen und mit Finden |
| P20 | K1-B06 | M2, G6 | Fall 1: Dinko gesteht nur seinen Teil; „Tonći kam mit der ANKICA“ wird für Ivkas zweite Runde nötig | – | M | Ohne den Schluss bietet Ivkas Runde 2 keine passende Notiz |

**Kann – Feinschliff und Erweiterungen**

| Nr. | Befund(e) | Vorschlag | Aufwand |
|---|---|---|---|
| P21 | Muster 1 | „Spüren“ an mehr Hotspots mit kurzen, stimmigen Leertexten anbieten, damit das Angebot nicht „hier ist etwas“ bedeutet | M |
| P22 | Muster 6 | Quellen eines Schlusses mit erledigen, wenn sein Inhalt anders bekannt wird; Notizen nach Person oder Frage gruppieren | M |
| P23 | K1-B07 | Seite „Gehört“ im Notizbuch, nur zum Lesen | S |
| P24 | alle *Niedrig*-Befunde | Kontinuität, tote Antworten, Hinweistexte, Feinschliff | S je Kapitel |

**Was ich ausdrücklich nicht empfehle:** das Hinweissystem zurückzubauen, die Verbfilterung abzuschaffen, Speichern einzuschränken, Kapitel pauschal zu kürzen oder Rätsel künstlich zu verlängern. Keiner der Befunde verlangt das.

### G.2 Fünf Rätselketten im Vorher-nachher-Entwurf

Ausgewählt nach Bedeutung, nicht nach Kapiteln. Alle Beispielsätze sind **Neuentwurf** und als Vorschlag gemeint. Sie sind in der Stimme der Figuren gehalten, wie sie im Spiel sprechen.

---

#### Entwurf 1 · K2 · Finale: Rotkreuz-Nachricht, Karton und „Lana Delić?“ (K2-R14, R18, R19)

**1. Ist-Zustand (belegt).**
- Das Wärmefach gibt die Nachricht, ohne dass Marko sie liest (`rooms/kuca.js:5–10`). Die Notiz `f2_rcm` entsteht nur beim Lesen (`M.k2ReadRCM`, `:13–17`).
- Nada nimmt die Nachricht im Finale an und spielt ihre Epilog-Szene, ohne den Abschnitt zu prüfen (`rooms/stan.js:41` → `:24–33`, `A.take('rcm')`).
- „Sie kam mich holen“ braucht `f2_rcm` + Postkarte (`13_k2_notes.js:164`). Malas Angebot für die letzte Nacht braucht diesen Schluss (`97_k2_mala.js:50`, `:56`).
- **[beobachtet]** Nachricht ungelesen an Nada gegeben: Gegenstand weg, Notiz nicht mehr zu bekommen, kein Angebot für die Nacht. Hinweis f4 rät weiter zum leeren Wärmefach (`15_hints_k2.js:213`). Das Kapitel ist nicht abschließbar.
- Davor: Der Karton öffnet sich nur mit „Lana Delić?“ (`97_k2_mala.js:64–65`), obwohl Mala beim Namensaufruf „Prisutna.“ geantwortet und Zora „Lana, Kind.“ gesagt hat (`rooms/skloniste.js:59`). Hinweis f1b Stufe 4: „Den Karton in der Leiste öffnen.“ (`15_hints_k2.js:201`).
- Der Schluss selbst verlangt den „Neunten Stock“ als Notiz, die es nur im Gespräch mit Mala gibt (`13_k2_notes.js:162–163`; `97_k2_mala.js:23`), obwohl das Stockwerk dreimal fiel (`rooms/neboder.js:10`; `rooms/haustor.js:12`, `:130`). Register + „Helferin: Lana Delić“ bekommt „Mit Mala hat das nichts zu tun. Oder ich will es nicht sehen.“

**2. Betroffene Grundsätze.** G5 (verpasster Pflichtgegenstand), Gilberts Schluss (Laden als einzige Rettung), G11 und G8 (Formalsperre), G10 (Absage behauptet das Falsche).

**3. Warum Spieler hängen bleiben.** Einer Mutter die letzte Nachricht ihrer Tochter zu bringen, ist die naheliegendste Handlung des Kapitels. Das Spiel nimmt sie an und zerstört dabei still den einzigen Weg. Davor verlangt es eine Notizbuch-Formalie für etwas, das die Geschichte gerade laut gesagt hat. Der Hinweis rät genau zu der Handlung, die abgelehnt wird.

**4. Kleinste Korrektur.**
- `rooms/kuca.js`: nach `A.give('rcm')` sofort `await M.k2ReadRCM(A)`. Das Vorlesen ist ohnehin der Moment, den der Spieler sehen will.
- `rooms/stan.js`: `give.rcm` nur im Epilog. Im Finale sagt Nada: *„Nicht jetzt, Mali. Ich kann heute kein Papier mehr lesen. Bring es mir, wenn du weißt, wo sie ist.“*
- `rooms/skloniste.js` nach „Prisutna“: `m2_lana` vergeben, wenn sie fehlt. Marko leise: *„Lana. Lana Delić. Neunter Stock.“*
- `15_hints_k2.js`: f4 nur bei vollem Wärmefach; f1b Stufe 4 abhängig vom Stand.

**5. Weitergehende Überarbeitung.** Den Erkenntnismoment dorthin legen, wo die Geschichte ihn schon hat, und den frühen Schluss belohnen statt verlangen:
- Wer „Lana Delić?“ schon **vor** dem Namensaufruf gezogen hat, sagt den Namen selbst, bevor Zora es tut. Gilbert nennt das „different interactions for a given situation depending on the order encountered“ (S. 8).
- Alle anderen erfahren es dort von Zora und Mala.
- Register + Helferin wird ein gültiger Weg. Malas Satz am Aufzug („Neunter Stock. Ich habe die Stufen gezählt.“) gibt die Stockwerk-Notiz.
- Den Karton öffnet nach Fall 3 jeder.

**6. Abfolge vorher und nachher.**

| Schritt | Vorher | Nachher |
|---|---|---|
| Problem | Paket aus Split, Karton zugeklebt | unverändert |
| Hinweise | Mala: „Du weißt mehr, als du denkst.“; Hinweis rät zum Öffnen, das Spiel lehnt ab | Name seit dem Namensaufruf bekannt; der frühe Schluss bringt eine eigene Zeile |
| Schlussfolgerung | „Lana Delić?“ über drei Notizen, eine davon nur über Mala | dieselbe Erkenntnis, auf drei Wegen erreichbar, nicht mehr als Schloss |
| Handlung | Wärmefach aufbrechen; Nachricht liegt ungelesen im Inventar | aufbrechen → Marko liest sofort |
| Rückmeldung | Nada nimmt die ungelesene Nachricht → still verloren | Nada lehnt im Finale ab und verweist auf später |
| Konsequenz | Sackgasse; nur Laden hilft | „Sie kam mich holen“ → letzte Fahrt; Epilog bei Nada wie bisher |

**7. Betroffene Dateien.** `rooms/kuca.js` (pryComp), `rooms/stan.js` (`give.rcm`, `nadaEpi`), `rooms/skloniste.js` (Namensaufruf), `rooms/haustor.js:130` (Malas Satz → Notiz), `13_k2_notes.js` (neuer Weg zu `m2_lana`), `97_k2_mala.js:65` (Bedingung des Kartons), `15_hints_k2.js` (f1b, f4, s3a).

**8. Wirkung und Folgeprobleme.** Die einzige Sackgasse verschwindet. Das Finale fließt, ohne an Gewicht zu verlieren, denn der Namensaufruf ist schon der stärkere Moment. Zu prüfen: Die neue Notiz im Namensaufruf darf die Szene nicht mit einer Einblendung stören (stilles `A.note`). In Kapitel 3 hängt nichts an `m2_lana`; K3 setzt eigene Startnotizen (`96_k3_story.js:46–49`).

**9. Aufwand.** S: etwa 30 Zeilen in sieben Dateien, dazu ein Regressionstest und beide K2-Reihenfolgen im Durchlauf.

**10. Abnahmekriterien.**
- Der nachgestellte Fall (Nachricht ungelesen an Nada) endet nach der Korrektur mit Nadas Absage; die Nachricht bleibt, das Kapitel ist bis zum Abspann spielbar.
- Fall 3 ohne „Lana Delić?“ beendet → der Karton öffnet sich.
- Register + Helferin → „Lana Delić?“.
- f1b und f4 raten in keinem Stand eine unmögliche Handlung (erweiterte Hinweisprüfung, P12).
- `walkthrough2.js` normal und mit `MALA_ORDER=alt` grün.

---

#### Entwurf 2 · K3 · Sonntag: Lichtprobe, Glocke, „Bato war wach“ (K3-R11 – R13)

**1. Ist-Zustand (belegt).**
- „Bato war wach“ (`a3_awake`) entsteht aus „Dreimal“ + „geschlafen“, aber nur mit `a3_lightroom` (`13_k3_notes.js:165`).
- `a3_lightroom` gibt es nur über das Ordnen der Nacht (`13_k3_notes.js:176–179`; `rooms/zlata_k.js:12–17`; `97_k3_peil.js:110–126`).
- „Dreimal“ sagt Bato erst auf `a3_lightroom` (`rooms/skela_l.js:68–72`, `:86`).
- Der einzige Anstoß zum Ordnen fällt, wenn Marko an der Glocke steht; sonst sagt Mala „Das muss ich Marko sagen. Er zählt so gern.“ (`rooms/skela_d.js:90–91`). Bei der Lichtprobe steht Marko am anderen Ufer.
- Auf Dachfenster und Lichtfolge weicht Bato aus: „Meine Kammer. Was ist mit meiner Kammer?“ / „Was zählen Sie da? … Gehen Sie schlafen.“ (`rooms/skela_l.js:92`).
- Die Lichtprobe prüft den Glocken-Nachhall nicht (`rooms/skela_l.js:108–117`); danach fehlt `a3_voice`.
- Im Prüfbericht K3 vom 5. 11. als E-02 (P1) beschrieben.

**2. Betroffene Grundsätze.** G9, G10, G2, G4; MALA-Kriterium M2.

**3. Warum Spieler hängen bleiben.** Nach Lichtprobe und Lichtfolge weiß der Spieler, was in jener Nacht geschah: In Batos Kammer ging Licht an, während Lana läutete, und wieder aus. Die naheliegende Handlung ist die Konfrontation. Bato weicht mit Sätzen aus, die nach Sackgasse klingen. Der verlangte Zwischenschritt ist technisch und sein Anstoß fällt im Normalablauf weg.

**4. Kleinste Korrektur.**
- **Bato** (`rooms/skela_l.js:86`, askOpt): Liegen Dachfenster **und** Lichtfolge vor, führt jede der beiden Notizen zum Ausrutscher: *„Licht. Ja. Ich habe Licht gemacht. Ich wollte sehen, wer da läutet.“ – (Pause.) – „Dreimal hat es geläutet. Dreimal.“* Das vergibt `a3_thrice`.
- Liegt nur eine vor, fragt Bato zurück und zeigt so, was fehlt: *„Meine Kammer hat ein Fenster. Na und? Wann soll da Licht gewesen sein?“* bzw. *„Läuten, Licht, Läuten. Wo soll das Licht gewesen sein?“*
- `a3_thrice` + `a3_slept` → `a3_awake` ohne Bedingung `a3_lightroom`. Das Ordnen bleibt als freiwillige Vertiefung; es bringt in der Konfrontation eine zusätzliche Zeile („Und Vlado war da schon fort.“). Vlado Teil 2 nimmt schon heute `a3_awake` statt `a3_lightroom` an (`rooms/vulkanizer.js:160`).
- **Lichtprobe** an `a3_bell3` binden: Mala von drüben *„Ich weiß nicht, ob damals eins brannte. Ich muss erst an die Glocke.“*
- `a3_roof` + `a3_slept` bekommt einen eigenen Beinahe-Treffer: *„Zlata schlief am Herd. Und oben brannte Licht. Wer war oben? Das muss Bato selbst sagen.“*

**5. Weitergehende Überarbeitung.** Die Konfrontation wird zur Beweisführung, wie bei Emina in K2 und bei Vlado Teil 2, die beide gut funktionieren:
- Drei Belege: Licht im Dachfenster, Lichtfolge beim Läuten, Zlata schlief am Herd.
- Jeder allein bekommt eine eigene Gegenrede, zwei zusammen brechen Bato, die Reihenfolge ist frei, Wiederholen kostet nichts.
- Das Ordnen wird Malas Moment der Gewissheit: freiwillig, und mit einer eigenen Zeile am Grab.

**6. Abfolge vorher und nachher.**

| Schritt | Vorher | Nachher |
|---|---|---|
| Problem | Zlata: „Und drüben war ein Licht. Irgendwo.“ | unverändert |
| Hinweise | Lichtprobe auch ohne Glocke; Anstoß zum Ordnen nur, wenn Marko an der Glocke steht | Glocke zuerst (begründete Absage); Batos Rückfragen zeigen, was fehlt |
| Schlussfolgerung | technischer Zwischenschritt (Ordnen) verlangt | Spieler verbindet selbst: Licht in der Kammer, während sie läutete |
| Handlung | Konfrontation nur mit `a3_lightroom` | Konfrontation mit zwei Belegen, beliebige Reihenfolge |
| Rückmeldung | Ausflüchte, Pool-Satz bei Dachfenster + geschlafen | Gegenrede je Beleg, eigener Beinahe-Treffer |
| Konsequenz | „Dreimal“ → „Bato war wach“ → Unruhe | unverändert; Ordnen bringt nur noch Tiefe |

**7. Betroffene Dateien.** `rooms/skela_l.js` (askOpt Bato, `lightTest`), `rooms/skela_d.js` (`lightSeq`: fehlende `a3_bell3`/`a3_voice` mit vergeben), `13_k3_notes.js` (Bedingung bei `:165`, Beinahe-Treffer), `15_hints_k3.js` (Themen n2c, n3*), `game/tools/walkthrough3.js`, `LOESUNG3.md`.

**8. Wirkung und Folgeprobleme.** Die Hauptkette des längsten Tages hängt nicht mehr an einem technischen Schritt. Der „Natürlich!“-Moment liegt in der Konfrontation. Zu prüfen: ob die festen Zwischenstände im Finale (cp1–cp4) oder Gesprächsoptionen `a3_lightroom` irgendwo voraussetzen; im Code gefunden habe ich nur die Erledigt-Markierung (`13_k3_notes.js:144`), Zlatas Antwort (`rooms/skela_l.js:188`) und Vlados Annahme, die auch `a3_awake` gelten lässt (`rooms/vulkanizer.js:160`). Der Durchlauf muss beide Wege abdecken.

**9. Aufwand.** S bis M: drei Bedingungen, zwei Gesprächszweige, zwei Beinahe-Treffer, Hinweistexte, ein zweiter Durchlaufpfad.

**10. Abnahmekriterien.**
- Vom Stand „Lichtprobe gemacht, Marko am linken Ufer“ ist die Konfrontation ohne Ordnen erreichbar.
- Jeder einzelne Beleg bekommt eine eigene Rückfrage Batos.
- Lichtprobe vor dem Glocken-Nachhall wird mit Begründung abgelehnt; `a3_voice` fehlt in keinem Stand nach der Glocke.
- `walkthrough3.js` grün mit und ohne Ordnen; `hintcheck.js` ohne Lücke.

---

#### Entwurf 3 · K4 · Mittwoch: Der neue Nachmittag (K4-R12 – R14)

**1. Ist-Zustand (belegt).**
- Je Nachmittag gibt es einen Versuch. Ein neuer beginnt nur, wenn Marko **und** Mala das Heim verlassen und vom Stadtplan zurückkommen (`rooms/heim_flur.js:36–40`, aufgerufen in `rooms/heim.js:79`).
- Bleibt Mala in einem anderen Heimraum (der Hinweis schickt sie nach 214, `15_hints_k4.js:120`), beginnt kein neuer Nachmittag – ohne jede Rückmeldung (`rooms/heim_flur.js:37–39`).
- Kraus' „Heut nimmer.“ (`:227`) gilt bis zum nächsten verbrauchten Nachmittag.
- Der Text behauptet etwas anderes:
  - Marko: „Drei war schon. Für heute ist es vorbei.“ (`:356`)
  - Mama: „Für heute ist es vorbei, Marko.“; Marko: „Um drei ist jeden Tag drei. Ich komme wieder, wenn ich weiß, was ich anders mache.“ (`:334`)
- Die Couch verweigert den Schlaf: „Gerda kommt jeden Tag um drei. Noch.“ (`96_k4_story.js:188`).
- Nur Hinweisstufe 4 nennt „einmal hinaus und wieder herein“ (`15_hints_k4.js:121`).
- In den 4.000 Läufen vom 7. 11. blieben 43 Läufe am Mittwoch ohne Tageswechsel stehen; die von Hand geprüfte Stichprobe (C-0072) zeigte genau diesen Mechanismus: Erst Weggehen und Wiederkommen gab einen neuen Versuch (`qa/results/final/TRIAGE.md`).

**2. Betroffene Grundsätze.** G2 (Teilziel unklar), G9 (Regel nicht ableitbar), G7 im weiteren Sinn (eine Zeitregel, die der Spieler nicht kennt).

**3. Warum Spieler hängen bleiben.** Wer dem Text glaubt, wartet auf morgen – und das Spiel lässt ihn nicht schlafen. Die eigentliche Regel ist Gilberts „Hollywood-Zeit“, also gut gedacht: Ein Nachmittag ist eine Spieleinheit und kein Kalendertag. Sie wird aber nirgends gezeigt, und die Sätze widersprechen ihr.

**4. Kleinste Korrektur.**
- Die Sätze sagen die Regel, ohne die Welt zu verlassen:
  - Mama: *„Jetzt ist er eine Stunde für niemanden zu sprechen. Geh eine Runde, Marko.“*
  - Marko: *„Um drei ist jeden Tag drei. Ich gehe eine Runde und komme wieder, wenn ich weiß, was ich anders mache.“*
  - Verbrauchter Nachmittag (`:356`): *„Drei war schon. Er läuft noch bis halb fünf. Ich gehe und versuche es später noch einmal.“*
- Bei der Rückkehr mit neuem Nachmittag eine kurze Erzählzeile: *„Ein anderer Nachmittag. Die Uhr im Flur geht auf drei zu.“*
- `H.arrive`: Mala zählt als „mitgekommen“, wenn Marko das Gebäude verlässt (oder sie folgt ihm wie in den anderen Kapiteln). `k4.g.krausNo` bei jeder Ankunft löschen.
- Couch am Mittwoch nach einem Versuch: *„Gerda kommt jeden Tag um drei. Einen Versuch habe ich gemacht. Einer fehlt.“*

**5. Weitergehende Überarbeitung.** Die Regel als ausdrückliche Handlung anbieten: An Uhr und Bank steht nach einem verbrauchten Nachmittag *„(Später wiederkommen.)“*. Abblende, Karte „Ein anderer Nachmittag“, Mala kommt mit. Damit ist der Zeitsprung eine bewusste Entscheidung des Spielers statt eines versteckten Effekts des Stadtplans. So beschreibt Gilbert dramatische Zeit: Das Spiel wartet auf den Spieler, nicht umgekehrt.

**6. Abfolge vorher und nachher.**

| Schritt | Vorher | Nachher |
|---|---|---|
| Problem | Alois friert, wenn Gerda kommt – Gong oder Kälte? | unverändert |
| Hinweise | Beinahe-Treffer lehren den Versuch („wenn ich eins weglasse“) | unverändert (vorbildlich) |
| Schlussfolgerung | zwei Versuche nötig | unverändert |
| Handlung | Versuch 1; dann versteckt: Haus verlassen, beide zurück | Versuch 1; dann „(Später wiederkommen.)“ oder eine Runde gehen – beides sichtbar |
| Rückmeldung | „Für heute ist es vorbei.“; Couch verweigert | „Ich gehe und versuche es später noch einmal.“; Karte „Ein anderer Nachmittag“; Couch nennt den fehlenden Versuch |
| Konsequenz | Hänger, oft bis zur Hinweisstufe 4 | Versuch 2 → Gerdas Entschluss → Donnerstag |

**7. Betroffene Dateien.** `rooms/heim_flur.js` (Sätze `:334`, `:356`; `H.arrive`; Uhr und Bank), `rooms/heim.js:79`, `96_k4_story.js:188` (Couch), `15_hints_k4.js:116–121`.

**8. Wirkung und Folgeprobleme.** Der Mittwoch verliert seine größte Reibung, das Experimentieren bleibt. Die sichtbare Zeitverdichtung („Ein anderer Nachmittag“ am selben Spieltag) ist eine offene Konvention. Ich halte sie für tragfähig, weil der Abschnitt ohnehin „Dritter Tag – Namen“ heißt und keine Uhrzeit anzeigt. Wer sie vermeiden will, braucht eine größere Umstellung: Versuch 2 erst am Donnerstag, mit verschobenem Abschied. Das empfehle ich nicht.

**9. Aufwand.** S: vier Sätze, eine Erzählzeile, zwei Bedingungen, eine neue Option an der Uhr.

**10. Abnahmekriterien.**
- Kein Satz im Heim behauptet nach einem verbrauchten Nachmittag „für heute“.
- Mala in 214, Marko verlässt das Heim und kommt zurück → neuer Nachmittag.
- „(Später wiederkommen.)“ erzeugt einen neuen Nachmittag ohne Reise.
- Kraus spricht nach einer Ankunft wieder mit Marko.
- Die Couch nennt am Mittwoch den fehlenden Versuch.
- `walkthrough4.js` und die Variante „früher Versuch“ grün; eine Wiederholung der Simulation in Kategorie C zeigt in der Gruppe `k4_d3` keine Läufe mehr, die am Mittwoch ohne Tageswechsel stehen bleiben.

---

#### Entwurf 4 · K5 · Freitagabend: Wem gehören die Fahrscheine? (K5-R11, R12)

**1. Ist-Zustand (belegt).**
- Stufe 1: `f5_dose` + `f5_eursamstag` → `f5_wem` („Nicht Nada“, `13_k5_notes.js:65`).
- Stufe 2 nimmt **nur** `f5_wem` + `j5_treppe` an (`:66`). Plausible Paare bekommen Pool-Sätze:
  - mit „Die Tür im siebten Stock – Mama hat ihr die Tür aufgemacht“ (`f5_tuer`),
  - mit „Ich setze mich ans Fenster“ (`k5_c_muenchen`),
  - mit „Am Fenster und daneben“ (`f5_plaetze`).
- Paare mit Notizen aus Mamas Fall bekommen „Das sind zwei verschiedene Geschichten. Ich sollte sie nicht ineinanderschieben.“ (`:86`, Auswahl `:93`). Die Lösung selbst ist aber so ein Paar.
- Stufe 1 sprechen Marko und Mala vorher aus: „Nada war nie samstags dabei.“ (`97_k5_a.js:410`); „Euer Samstag. Sie hat recht. Sie war nie dabei.“ (`:321`).
- Nach den Fahrscheinen kann Marko Nada fragen, bevor er weiß, was in der Dose ist (`:318–320`).
- Bildet der Spieler `f5_jasna` schon am Donnerstag (möglich, `j5_treppe` stammt aus dem Prolog), erscheint nach dem Wechsel auf die Bastei ein übriges Gesprächsmenü (K5-B04, für Nedžad nachgestellt).

**2. Betroffene Grundsätze.** G9, G10; MALA-Kriterium M2.

**3. Warum Spieler hängen bleiben.** Es ist der Höhepunkt der Ermittlung, und drei Notizen zeigen richtig auf Mama. Das Spiel antwortet mit „Zwei Dinge, die nebeneinander liegen. Mehr nicht.“ oder rät, die Geschichten nicht zu mischen. Die erste Hälfte des Schlusses haben Figuren schon gesagt. Für ein „Natürlich!“ bleibt wenig, für „Darauf wäre ich nie gekommen“ viel.

**4. Kleinste Korrektur.** Neue Einträge in `NEAR` (`13_k5_notes.js:69ff.`) zeigen jeweils auf das fehlende Stück, die Treppe:
- `f5_wem` + `f5_tuer`: *„Mama. Sie hat jeden Samstag aufgemacht. Aber wozu dann Fahrscheine? Was hat sie an der Treppe gesagt?“*
- `f5_wem` + `k5_c_muenchen`: *„‚Ich setze mich ans Fenster.‘ Zwei Plätze, am Fenster und daneben. Für wen ist der zweite? Und warum fährt sie nicht?“*
- `f5_wem` + `f5_plaetze`: *„Lana hat mich jeden Samstag geholt. Wer holt heute wen? Und wer kann wohin nicht?“*
- `f5_wem` + `j5_nichtdrei`: *„‚Nicht die Drei. Noch nicht.‘ Mama weicht aus. Der Drei – und wem noch?“*

Dazu:
- Pool-Satz für fallfremde Paare neutral: *„Das bringt mich hier nicht weiter.“*
- Vorwegnahme kürzen: Marko *„Und samstags?“* statt der Feststellung (`97_k5_a.js:410`); Mala nur *„Euer Samstag.“* (`:321`).
- Frage nach den Fahrscheinen erst mit `f5_dose` (`:318`).
- Gesprächsschleife beim Abschnittswechsel beenden (P10).

**5. Weitergehende Überarbeitung.**
- Den Schluss auf zwei gleichwertigen Wegen zulassen: Treppe (Mama kann nicht hinauf) **oder** Fenster (Mama will am Fenster sitzen, der zweite Platz gehört Nada) führen zum selben Ergebnis, jeweils mit eigenem Satz.
- Ohne Anleitung bleibt dann nur die Übergabe am Samstag. Die ist schon heute gut beantwortet („Nicht hier. An der Tür.“, `97_k5_c.js:24–27`; „Nicht ich. Das ist nicht mein Klopfen.“, `:48`).

**6. Abfolge vorher und nachher.**

| Schritt | Vorher | Nachher |
|---|---|---|
| Problem | Malas Dose mit zwei Fahrscheinen; „Für Mama. Wer sonst?“ | unverändert |
| Hinweise | „Nada war nie samstags dabei“ wird ausgesprochen | Nadas „Euer Samstag“ steht allein; der Spieler zieht Stufe 1 selbst |
| Schlussfolgerung | nur ein Paar gilt | zwei gültige Wege; vier Beinahe-Treffer zeigen auf das fehlende Stück |
| Handlung | Notizbuch | Notizbuch |
| Rückmeldung | Pool-Sätze, „nicht ineinanderschieben“ | Sätze, die die richtige Idee anerkennen und nach der Treppe fragen |
| Konsequenz | Tabija, Bank, Samstag | unverändert; die Übergabe am Samstag ist die Ausführung der eigenen Erkenntnis |

**7. Betroffene Dateien.** `13_k5_notes.js` (`NEAR`, `POOL`), `97_k5_a.js` (`:318–321`, `:410`), `15_hints_k5.js:51–55` (Stufe 3 als Frage: „Was hat Mama an der Treppe gesagt, bevor Šehić kam?“), `05_engine.js:319–327` (P10).

**8. Wirkung und Folgeprobleme.** Der wichtigste Schluss des Finales wird zum eigenen Gedanken des Spielers. Zu prüfen: Die Totenmahl-Szene setzt `f5_eursamstag` notfalls selbst (`97_k5_b.js:348`). Mit der gekürzten Vorwegnahme muss Stufe 1 trotzdem eindeutig bleiben. Die Notiz `f5_eursamstag` trägt den Inhalt allein.

**9. Aufwand.** S: vier Beinahe-Treffer, ein Pool-Satz, drei Textkürzungen, ein Hinweistext, die Engine-Korrektur aus P10.

**10. Abnahmekriterien.**
- Jedes der fünf plausiblen Paare bekommt eine eigene, nicht aus dem Pool stammende Antwort.
- Kein gesprochener Satz vor dem Schluss enthält „nie samstags dabei“.
- `f5_jasna` am Donnerstag gebildet → Freitagabend ohne übriges Menü (Regressionstest analog zum Nedžad-Fall).
- `walkthrough5.js` und `MALA_K5VAR=1` grün; `hintcheck.js` ohne Lücke.

---

#### Entwurf 5 · K2 · Fall 1: Der Weg in die Kammer (K2-R07)

**1. Ist-Zustand (belegt).**
- Lejla öffnet die Kammer nur, wenn ihr Brief korrigiert ist **und** Emina fort ist; sonst: „Wenn Oma weg ist. Nicht vorher. Sie hört alles, sogar wenn sie schläft.“ (`rooms/kafana.js:59–60`).
- Emina geht nur, wenn Mala nach Brief und `s1_hidden` **ein zweites Mal** hinter der Theke lauscht. Erst dieses Lauschen setzt den Weggang, mit Eminas Satz „Ich gehe nachher zu Tante Sabira.“ (`:126`). Davor kommt nur: „Sie zählt die Löffel. Jeden Abend zählt sie die Löffel.“ (`:127`).
- Hinweisstufe 3/4: „Lejla helfen, damit Emina geht. Dann in die Kammer …“ (`15_hints_k2.js:78`). Diese Ursache ist zu dem Zeitpunkt schon erfüllt.

**2. Betroffene Grundsätze.** G11 (das öffnende Ereignis ist nicht sachlich verbunden: Zuhören lässt jemanden gehen), G9, Hinweise.

**3. Warum Spieler hängen bleiben.** Wer Lejla geholfen hat, wartet darauf, dass Emina geht. Nichts in der Welt deutet an, dass Malas erneutes Lauschen den Weggang auslöst. Der Hinweis bestätigt die falsche Annahme. Das ist Gilberts Beispiel der sechs Gegenstände vor der Geheimtür, nur mit einem Verb.

**4. Kleinste Korrektur.**
- Ist der Brief korrigiert und `s1_hidden` bekannt, geht Emina beim **nächsten Betreten** der Kafana sichtbar: kurze Szene, Mantel, *„Lejla, ich gehe zu Tante Sabira. Pass auf die Kafana auf. Und auf die Löffel.“* Das setzt `k2.s1.eminaAway`.
- Lauscht Mala vorher, hört sie den Plan wie heute (`:126`) und Marko weiß, dass er nur kurz warten muss. Lauschen wird so zum Vorsprung, nicht zur Bedingung.
- Hinweis Stufe 4: *„Wenn Lejla geholfen ist, geht Emina zu Tante Sabira. Einmal hinaus und wieder herein. Dann in die Kammer.“*

**5. Weitergehende Überarbeitung.** Den Weggang an das binden, was der Spieler tut: Lejla nimmt den korrigierten Brief und sagt *„Oma geht gleich zu Tante Sabira, das macht sie jeden Abend nach den Löffeln. Dann mache ich Ihnen auf.“* Malas Lauschen bleibt die Abkürzung für die Ungeduldigen: Sie hört, dass Emina schon den Mantel holt. Die Kooperation bleibt erhalten und hat jetzt einen Zweck.

**6. Abfolge vorher und nachher.**

| Schritt | Vorher | Nachher |
|---|---|---|
| Problem | Briefe hinter dem Spiegel in der Kammer; Emina hat den Schlüssel | unverändert |
| Hinweise | „Wenn Oma weg ist.“ | dazu Lejlas Satz über Eminas Abendgang |
| Schlussfolgerung | (verborgen) Mala muss noch einmal lauschen | Emina geht nach ihrer Gewohnheit; Lauschen verrät nur den Zeitpunkt |
| Handlung | zweites Lauschen hinter der Theke | Kafana kurz verlassen oder als Mala lauschen |
| Rückmeldung | „Sie zählt die Löffel.“ (zu früh) | sichtbarer Weggang mit Satz |
| Konsequenz | Lejla öffnet → Stemmeisen → Briefe | unverändert |

**7. Betroffene Dateien.** `rooms/kafana.js` (Betreten, `:59–60`, `:124–127`), `15_hints_k2.js:76–78`, `game/tools/walkthrough2.js` (Pfad ohne zweites Lauschen ergänzen).

**8. Wirkung und Folgeprobleme.** Der erste Fall von Kapitel 2 – in dem Spieler lernen, wie dieses Kapitel tickt – verliert seinen einzigen versteckten Auslöser. Zu prüfen: Eminas Rückkehr (`k2.s1.eminaBack`) und ihre spätere Bereitschaft, die Briefe anzunehmen (`:121`), dürfen sich nicht verschieben.

**9. Aufwand.** S: eine kurze Szene beim Betreten, zwei Sätze, ein Hinweistext, ein zusätzlicher Durchlaufpfad.

**10. Abnahmekriterien.**
- Vom Stand „Brief korrigiert, `s1_hidden` bekannt“ ist die Kammer ohne zweites Lauschen erreichbar: einmal hinaus, wieder herein.
- Mit Lauschen bleibt der heutige Weg gültig.
- Kein Hinweis nennt eine schon erfüllte Ursache.
- `walkthrough2.js` in beiden Pfaden grün.

## H. Umsetzungs- und Prüfplan

### H.1 Reihenfolge

| Schritt | Inhalt | Warum zuerst | Hängt zusammen mit |
|---|---|---|---|
| 1 | **P01** (Sackgasse K2) und **P10** (Gesprächsschleife in der Engine) | Einzige Stelle, an der Fortschritt unmöglich wird; die Engine-Korrektur wirkt in allen Kapiteln und ist eine Zeile | Regressionstest je Fall |
| 2 | **P02, P07, P09, P11** | Reine Text- und Bedingungsänderungen mit großer Wirkung auf Fairness; kaum Risiko | P09 vor P16, damit neue Beinahe-Treffer nicht von alten Pool-Sätzen umgeben sind |
| 3 | **P03, P04, P06, P08** (Entwürfe 1, 3, 4, 5) | Pflichtketten mit falscher Rückmeldung oder versteckter Regel; lokale Änderungen | Entwurf 1 setzt P01 voraus; Entwurf 4 setzt P10 voraus |
| 4 | **P05** (Entwurf 2) | Größter Eingriff in eine Kette; braucht einen zweiten Durchlaufpfad | `walkthrough3.js`, `LOESUNG3.md`, Hinweise K3 |
| 5 | **P12** (Hinweisprüfung abseits der Musterlösung) | Hält das Sicherheitsnetz nach allen Änderungen ehrlich | danach alle Hinweistexte aus Schritt 2–4 erneut prüfen |
| 6 | **Soll-Liste P13–P20** | Verbesserungen ohne Fortschrittsrisiko | P19/P20 verändern Kapitel 1 inhaltlich und sollten zusammen geplant werden |
| 7 | **Kann-Liste P21–P24** | Feinschliff | – |

**Notwendig** sind die Schritte 1 bis 5. Kein Befund rechtfertigt einen Umbau von Kapitelstruktur, Hinweissystem oder Speicherfunktion.

### H.2 Prüfungen je Änderung

1. **Regressionstest je behobenem Befund** nach dem Muster von `qa/regress/` (heute neun Tests). Neu: K2-B01 (Nachricht an Nada), K5-B04 (Menü nach Abschnittswechsel), K4-B01 (neuer Nachmittag mit Mala in 214), K3-B04 (Lichtprobe vor der Glocke), K4-B05 (Export der Kurve).
2. **Alle fünf Durchläufe** (`game/tools/walkthrough*.js`) und ihre Varianten, dazu `hintcheck.js` – heute über die Stände der Musterlösung, nach P12 auch über Stände aus Zufallsläufen.
3. **Beinahe-Treffer-Prüfung (neu, klein):** ein Skript, das für jeden Pflichtschluss die im Bericht genannten plausiblen Paare verbindet und verlangt, dass keine Antwort aus einem Pool stammt.
4. **QA-Simulation** (`qa/sim.js`) in Kategorie C auf die geänderten Abschnitte. Erwartet wird, dass die „unentschieden“-Gruppen `k4_d3` und `k2_fin` verschwinden. Kapitel 5 ist in der Simulation bisher nicht enthalten; es sollte vor der nächsten großen Prüfung aufgenommen werden.
5. **Spieltests mit Menschen** – das Einzige, was Verständlichkeit wirklich zeigt (siehe I). Vorschlag: drei bis fünf Erstspieler je Kapitel, laut denkend, ohne Hinweissystem für die ersten zwanzig Minuten jeder Engstelle. Gemessen werden die Zeit bis zum Lösen und die Zahl der Fehlversuche an den hier genannten Ketten sowie die Antwort auf die Frage, warum die Lösung stimmt. Gilberts Prüfstein ist der Satz nach der Lösung: „Natürlich!“ oder „Darauf wäre ich nie gekommen“.

### H.3 Woran man den Erfolg erkennt

- Keine Pflichtkette lässt sich durch eine naheliegende Handlung unlösbar machen (Regressionstests).
- Jeder Pflichtschluss hat für seine zwei bis drei naheliegendsten Fehlpaare eine eigene Antwort (Beinahe-Treffer-Prüfung).
- Kein Hinweis rät in irgendeinem erreichten Stand eine unmögliche Handlung (erweiterte Hinweisprüfung).
- In Spieltests sinkt an den fünf überarbeiteten Ketten die Zeit bis zur Lösung, ohne dass die Spieler die Lösung vorgesagt bekommen. Die Zahl der Hinweisaufrufe der Stufe 4 ist das schärfste Signal.

## I. Offene Punkte

- **Erstspieler-Erfahrung:** nicht überprüfbar ohne Menschen, die das Spiel nicht kennen. Alle Aussagen über „hängen bleiben“ sind begründete Vorhersagen aus dem Code, keine Beobachtungen.
- **Spaß, Spannung, emotionale Wirkung:** außerhalb dessen, was Code, Messungen und automatische Läufe zeigen können.
- **Abschnittswechsel als Mala in Kapitel 3** (K3-B10): aus dem Code abgeleitet, nicht nachgestellt.
- **Gesprächsschleife am Freitagabend in Kapitel 5** (K5-B04, zweiter Fall): aus dem Code abgeleitet; nachgestellt ist nur der Donnerstag mit Nedžad.
- **Lanas Wissen bei Jasna** (K4-B04): ob Kapitel 5 voraussetzt, dass Mama von Lana weiß, ist nicht geprüft; `mala.c4end` überträgt es nicht.
- **Vollständigkeit der Inventare:** Die Teilprüfungen haben gezielt gelesen, nicht jede Zeile. Optionale Inhalte (Davor und Lena in K4, Vesna, Nebenzweige der Gespräche) sind nur am Rand erfasst.
- **Ältere Prüfergebnisse:** Die 4.000 Läufe stammen von der Fassung `5ddc4f3c` (7. 11.); seither sind Kapitel 5, die Kapitelauswahl und Änderungen an Kapitel 4 und 5 dazugekommen. Eine neue Gesamtsimulation einschließlich Kapitel 5 steht aus.
- **Bosnisch-kroatische Fassung:** Sie umfasst nur Kapitel 1 vollständig und wurde nicht gesondert geprüft. Beinahe-Treffer und neue Sätze aus diesem Bericht müssten übersetzt werden.
- **Doku gegen Code:** Einzelne Lösungsdokumente nennen veraltete Werte (z. B. die Landmarken der Peilung in `LOESUNG3.md`, Huber „2. Stock“ in `LOESUNG4.md`). Sie sind nicht Teil dieser Bewertung, sollten aber mit den Korrekturen nachgezogen werden.

## J. Umsetzung der Muss-Liste (Nachtrag, 9. November 2026)

### J.1 Was geändert ist

| Nr. | Befund | Umsetzung | Prüfung |
|---|---|---|---|
| P01 | K2-B01 | Die Rotkreuz-Nachricht wird beim Aufbrechen des Wärmefachs gleich gelesen (`rooms/kuca.js`). Vor dem Epilog nimmt Nada sie nicht an („Nicht jetzt, Mali.“); ältere Stände, in denen sie Nada schon hat, geben sie über Nada zurück (`rooms/stan.js`). Hinweis f4 kennt das leere Wärmefach. | `qa/regress/bug_010_rcm_nada.js` |
| P02 | K5-B02 | „Ein Vorschlag“ erst mit „Zwei Hälften“; ohne den Schluss sagt Marko, was er zusammenlegen muss (`97_k5_b.js`). Hinweis h5j Stufe 3/4 zeigt aufs Notizbuch. | `bug_011_k5_rueckmeldung.js` |
| P03 | K2-B02, K2-B03 | „Lana Delić?“ auch über Register + „Zoras Helferin“ und über Malas Satz am Aufzug; Zora ruft den Namen, wenn der Schluss fehlt; der Karton öffnet sich auch in älteren Ständen (`rooms/skloniste.js`, `rooms/haustor.js`, `13_k2_notes.js`, `97_k2_mala.js`). | `bug_014_k2_lana_emina.js` |
| P04 | K4-B01 | Ein neuer Nachmittag beginnt auch, wenn Mala in Zimmer 214 bleibt; die Uhr bietet „(Später wiederkommen.)“; Kraus’ Sperre gilt nur für einen Nachmittag; kein Satz behauptet mehr „für heute“ (`rooms/heim_flur.js`, `rooms/heim.js`, `96_k4_story.js`). | `bug_012_k4_nachmittag.js` |
| P05 | K3-B01, K3-B04 | Bato reagiert auf Dachfenster **und** Lichtfolge; mit nur einem Beleg fragt er zurück; die Lichtprobe kommt erst nach dem Glocken-Nachhall (`rooms/skela_l.js`, `rooms/skela_d.js`, `13_k3_notes.js`). Das Ordnen der Nacht bleibt als Weg. | `bug_013_k3_bato.js` |
| P06 | K5-B01, K5-B09 | Fünf Beinahe-Treffer zu „Wem gehören die Fahrscheine?“; Vorwegnahmen gekürzt („Euer Samstag.“, „Und samstags?“) (`13_k5_notes.js`, `97_k5_a.js`). | `bug_011_k5_rueckmeldung.js` |
| P07 | K4-B02 | Vier Beinahe-Treffer zu Ružas Satz, Lesart, Antrag und Kode (`13_k4_notes.js`). | `bug_012_k4_nachmittag.js` |
| P08 | K2-B04 | Emina geht sichtbar, sobald man die Kafana wieder betritt; das zweite Lauschen bleibt eine Abkürzung (`rooms/kafana.js`). | `bug_014_k2_lana_emina.js` |
| P09 | Muster 7 | Neutrale Absagesätze in K2–K5 (`13_k2_notes.js` bis `13_k5_notes.js`). | `grep` auf die beanstandeten Sätze: leer |
| P10 | K5-B04, Muster 9 | `menuLoop` endet, wenn nach einer Option Raum, Abschnitt oder Bildschirm gewechselt hat (`05_engine.js`). | `bug_011_k5_rueckmeldung.js` |
| P11 | K4-B05 | Die Entscheidung an der Kurve geht als Wahl an Kapitel 5 (`96_k4_story.js`). | `bug_012_k4_nachmittag.js` |
| P12 | Muster 10 | Neue Hinweisprobe `qa/hints/hintprobe.js` mit der Zuordnung `qa/hints/stufe4.js` und den Varianten `qa/hints/varianten.js`; `qa/sim.js --states` schreibt Stände aus Zufalls- und Variantenläufen mit. | J.2 |

### J.2 Die Hinweisprobe

**Was sie tut.** Für jeden Spielstand und jedes offene Hinweisthema führt sie die Handlung aus, die der Satz der Stufe 4 nennt (Gespräch samt Optionen und Notizfragen, Gegenstand geben oder benutzen, Stelle benutzen, Notizen verbinden, Reise, Wechsel zu Mala, Rätselfelder wie in den Durchläufen). Die Handlung muss möglich sein und das Thema voranbringen: Das Thema schließt, ein Stufentext ändert sich, oder eine Notiz, ein Gegenstand, ein Schalter oder Raumzustand, den das Thema abfragt, ändert sich. Ein neuer Ort zählt nur bei Geh- und Reiseschritten. Über ganze Folgen prüft sie außerdem: kein Stand ohne offenes Thema, kein Thema, das nach dem Schließen wieder öffnet, keine Lücke in Malas Spur.

**Stände.** Die fünf Musterlösungen (je ein Stand pro Schritt), Stände aus acht Läufen der Kategorien B und C von `qa/sim.js` (ab der ersten Störung bis zum Kapitelende, ohne Dubletten) und vier Varianten an den Stellen, die die Analyse abseits der Musterlösung beschrieben hat.

**Ergebnis gegen den alten Stand** (`b34fa14`, Stände seiner Musterlösungen und die Varianten): **122 Fehler** und 4 zu prüfende Zuordnungen in 386 Ständen (574 ausgeführte Proben), darunter alle bekannten Fälle: K1-B05 (Variante: Nach dem abgebrochenen Gespräch öffnet „Der Briefkasten“ wieder und rät, nach dem Spachtel zu fragen – die Option gibt es nicht mehr), K2-B05 (Variante: „Mit dem Datum aus Nedžads Auftragsbuch …“, Nedžad hat ohne das Armband keinen Einstieg), K2-B06 („Malas Splitter mit dem verbinden, was Rade über das Siebener sagt“ – die Notiz fehlt; Strang m1 setzt nach „Das Siebener“ aus), K2-B07 (Stempel „im Schutzraum“; „Damir seine Zeichnung geben“; Variante: leeres Wärmefach), K4-B11 („Feierabend“ ohne die Vorfrage an Wastl) und K5-B02 (Variante: der Vorschlag bringt nichts).

**Ergebnis gegen den neuen Stand:** **0 Fehler, 0 zu prüfen** in 820 Ständen: 381 Stände der fünf Musterlösungen, 434 Stände aus den Zufalls- und Variantenläufen (Kapitel 1–4) und 5 Stände der Varianten. Bestanden haben 1.279 Themen-Stände (1.002 ausgeführte Proben; gleiche Proben in gleichen Ständen laufen einmal), 133 Themen-Stände sind übersprungen, jeweils mit Begründung (siehe Grenzen). Aufruf: `node qa/hints/hintprobe.js --dumps <d1> … --dumps <d5> --states <sim-ordner> --varianten`.

**Was die Probe zusätzlich gefunden hat.** Über die bekannten Fälle hinaus nannten gut 30 weitere Stufe-4-Sätze einen erledigten oder noch unmöglichen Schritt, etwa: „Wann ist sieben?“ riet zu Lejla, obwohl die Mondzeit von der Tafel bekannt war; „Der verschnürte Schuhkarton“ riet nach dem gelösten Knoten weiter zur Nadel; Šaćir erinnert sich erst mit dem Datum; Lauschen bei Emina wirkt erst nach Markos Frage; Rade ist nachts und im Zwischenspiel nicht da; „Katas E-Mail“ nannte eine Option, die es nicht gibt; in Kapitel 4 riet die Hilfe nach dem abgestellten Gong weiter zu Kraus und nach Malas Fund weiter zum Hauptbahnhof; die Glastür in Kapitel 5 heißt im Spiel „Balkontür“. Insgesamt sind seit der Analyse 53 Hinweisthemen geändert, zwei neu (m1b2 „Das Siebener“, m1f „Ein Versprechen“ gegen die Lücken in Malas Spur). Eine Spieländerung kam hinzu: Rade beantwortet Malas Uhr-Splitter (K2-B06), seine Geschichte von den zwei Kindern bleibt über das Foto erreichbar.

**Grenzen.** Die Probe prüft die erste Handlung eines Satzes und ihre Wirkung, nicht, ob ein Mensch den Satz versteht. Übersprungen werden, mit Begründung in `stufe4.js`: die Peilungen (eigenes Rätselfeld), das Zusammenspiel in zwei Räumen (s3c), geführte Szenen (h5m, h5fun, h5l4), das Sammelthema d3x, das Freitextfeld (e3f), Ljerkas Rückruf nach zwei Ortswechseln (d1i) und Sätze, die selbst „Morgen“ sagen. `qa/sim.js` spielt Kapitel 5 nicht; dort gibt es Stände abseits der Musterlösung nur über die Variante. Spieltests mit Menschen bleiben nötig (Abschnitt I).

### J.3 Übrige Prüfungen

Alle Prüfungen liefen auf dem Stand nach der Umsetzung.

| Prüfung | Ergebnis |
|---|---|
| Regressionstests (`node qa/regress/run.js`) | 14 von 14 bestanden, darunter die neuen Tests BUG-010 bis BUG-014 |
| Durchläufe der Musterlösung (`game/tools/walkthrough*.js`) | bis zum Abspann, ohne JS-Fehler: Kapitel 1 (61 Schritte), Kapitel 2 (67 Schritte, dazu die zweite Reihenfolge mit `MALA_ORDER=alt`), Kapitel 3 (113), Kapitel 4 (85), Kapitel 5 (55, dazu die Variante mit `MALA_K5VAR=1`, 51 Schritte) |
| Zusatztests der Kapitel (`k2tests.js`, `k3tests.js`, `k4tests.js`) | 33 von 33, 180 von 180, 116 von 116, dieselben Zahlen wie in den Kapitelberichten |
| Einstieg (`einstiegtests.js`) | 39 von 39 |
| Hinweisprüfung entlang der Musterlösung (`hintcheck.js`) | bestanden: 1.155 Stände (Durchläufe und Nebenwege der Zusatztests), 264 Themen, davon 253 offen gewesen, keine Lücke. Die 10 Stellen „zu sichten“ sind Wortgleichheiten: „Fahrschein“ heißt auch Markos entwerteter Straßenbahnschein, „Formular“ auch das abgegebene Formular; gemeint sind Malas und Lanas Fahrscheine, der Fahrschein aus dem Karton und das Formular der Vermisstenstelle. Der Stand vor der Umsetzung meldet auf denselben Ständen dieselben 10 Stellen, und die Hinweisprobe hat die genannten Schritte ausgeführt. |
| Hinweisprobe (`qa/hints/hintprobe.js`) | 0 Fehler, siehe J.2 |
| Oberfläche (`qa/ui/phase1.js` bis `phase5.js`, `savecompat.js`) | Phase 1: 33/33, Phase 2: 81/81, Phase 3: 52/52, Phase 4: 92/92, Phase 5: 31/31, alte Spielstände: 33/33. Zwei zeitabhängige Prüfungen schwanken in dieser Umgebung, auf dem neuen wie auf dem alten Stand. In Phase 1 schreibt Chromium den Merker des Hochformat-Hinweises unter Volllast nicht immer rechtzeitig weg; das Spiel löscht ihn nicht (geprüft mit einem Protokoll von `removeItem` und `clear`). In Phase 5 greift die Feinwahl (0,4 s) bei 0,6 s Halten nicht immer. Auf dem freien Rechner bestand Phase 1 im ersten Lauf, Phase 5 in zwei von vier Läufen; im Nachbau der Feinwahl-Prüfung fiel der alte Stand 4 von 11 Mal durch, der neue 1 von 11 Mal. Am Eingabecode hat die Umsetzung nichts geändert. |
| Offline (`offlinetest.js`) | bestanden, alle fünf Kapitel starten offline |
| Übersetzung (`i18n_check.js` über die Kapitel-1-Hinweise) | keine fehlenden, falsch geschlüsselten oder unübersetzten Texte |

Die Durchläufe der Kapitel 1–3 liefen auf dem Build unmittelbar vor der letzten Hinweiskorrektur (m1b2); sie werten keine Hinweistexte aus. Hinweisprüfung und Hinweisprobe liefen auf dem endgültigen Build.

**Angepasste Prüfwerkzeuge.** `k2tests.js`, `k3tests.js` und `k4tests.js` bedienten das Titelmenü noch über das frühere Canvas-Menü und erwarteten die Kapitel direkt im Hauptmenü. Seit der HTML-Schicht und der Kapitelwahl stehen sie unter „Kapitel wählen“; `k2tests` brach deshalb vor den eigentlichen Tests ab. Die Tests wählen die Einträge jetzt über die HTML-Schicht (`M.shell.pick`). `k4tests` Test 8 erwartet an der Uhr den neuen Satz „Jetzt nicht mehr.“ und die Wahl „(Später wiederkommen.)“ (P04).
