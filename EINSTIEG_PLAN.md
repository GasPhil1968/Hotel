# Split: Markos Einstieg, das Kennenlernen und die Wiederkehr nach Ivka

Diese Übersicht entstand vor dem Umbau. Sie hält fest, welche Funktionen sich ändern und welche Zustände dazukommen. Was am Ende tatsächlich umgesetzt und getestet ist, steht in `BERICHT_EINSTIEG.md`.

**Grundlage:**
- Repository-Stand `7ddcc03`, gleich der zuletzt gelieferten `mala_kapitel1-2_web.zip`. Eine neue ZIP lag dem Auftrag nicht bei.
- Der Hauptauftrag nennt „The Blackwell Deception“; beigefügt ist die Komplettlösung zu „The Blackwell Legacy“. Ausgewertet sind deren Seiten 4–10. Die Ergänzung zum Auftrag geht vor.

## Ablauf alt → neu

| Zeit | Alt | Neu |
|---|---|---|
| Di. Nachmittag, Wohnung (`pro`) | Anrufbeantworter, Kaffee, Tür | Wie bisher. Dazu: Anrufbeantworter mit Sanjas Erinnerung. Pflicht ist die Übersetzung von Seite 31 (Welche Leuchte? Die Antwort steht auf Seite 30). Sie endet mit der Wahl zwischen schneller Abgabe und sorgfältiger Korrektur. Beim Aufstehen kommt der erste Schwindel. |
| Di., Bar „Bura“ | geschlossen | Offen. Sanja ist beschäftigt, Marko setzt sich an seinen Tisch. Danach hilft er ihr beim Antwortbrief an die Rösterei in Triest (drei Fassungen, eine trifft Sanjas Ziel). Ihm wird übel; Sanja fragt nach ihm (ehrlich, Witz oder ausweichen). Der leere Stuhl gegenüber ist hier noch ganz gewöhnlich. |
| Di., Varoš | erster Besuch mit `malaGlimpse` | Zdenka wie bisher. Die Erscheinung an der Kirchentreppe kommt erst nach der Rückgabe des Schlüssels, also nach der ganzen Recherche. Gespeichert wird sie in `split.intro.glimpse`. |
| Di., Ivkas Wohnung | Postkarte, Foto, Radio | Dazu Ivkas Strickheft im Nähkorb mit Namen aus der Gasse. Die Tür verlangt jetzt auch „etwas, das von ihr erzählt, nicht nur von ihrem Warten“. Stärkere Symptome und ein Geruch nach Fritule. |
| Di., Recherche | – | Zwei Notizen werden verbunden: „Keine Kontakte, sagt die Stadt“ und „das Strickheft“ ergeben „Keine Familie heißt nicht: niemand“. Danach fragt Marko Zdenka gezielt nach den Namen. Erst dann gibt er den Schlüssel zurück. Eine falsche Verbindung ist keine Sackgasse. |
| Di. Abend, Riva (`pro_eve`) | – | Marko will die Stelle sehen. Am letzten Poller kommt der erste klare Schwindelanfall. Ivkas Geist erscheint noch nicht. |
| Di. Abend, Nachruf | erster Satz (3 Fassungen) | Erster Satz wie bisher. Neu ist die Abwägung zwischen „Angehörige nicht bekannt“ und dem genauen Detail mit den Mützen. Die Zeitung zeigt beides so, wie es gewählt wurde. |
| Di. Nacht | Mala erklärt in der Scheibe die Prämisse | Nur noch beunruhigend: ein Spiegelbild, dann der eigene Name. Keine Rollenverteilung. Die Antwort „Ich träume“ fällt weg. |
| Mi. Abend, Wohnung (`M.startCase1`) | „Ich habe von einem Mädchen geträumt“ und gleich „Das war kein Traum“ | Ohne Traumzweifel. Marko wacht auf, die Veränderungen im Zimmer sind beunruhigend, Vesna ruft an. **Neu: das erste lange Kennenlernen in der Wohnung.** Marko prüft die Tür, geht um Mala herum und stellt ihr ein Glas Wasser hin, das sie nicht nehmen kann. Er merkt, dass der Boden stillsteht. Dann fragt er nach Namen, Wahrnehmung und Grenzen und nach dem ersten Anfall (Ortsfrage mit klärender Rückfrage). |
| Mi., Riva | Malas Stimme hinter ihm, Marko leugnet sie | Mala geht sichtbar neben ihm. Marko sieht Ivka; seine Zweifel richten sich jetzt gegen den Geist, nicht gegen Mala. |
| Mi., Hafenamt (`M.voiceTest`) | Erstvorstellung, Name, „Der Kopfschmerz ist weg“, Figurenwechsel | **Nur noch Praxistest:** „Dann sieh nach.“ schaltet den Wechsel frei, danach folgt das Archiv. Keine zweite Vorstellung. Alte Spielstände ohne Kennenlernen behalten die alte Fassung. |
| Mi. spät, Riva (`M.afterLimbo_ivka`) | „Ich muss mich setzen“, dann sofort das ganze Bankgespräch mit `mk.accept` und `M.startCase2` | Eine kurze Pause auf der Bank, nur Rauchen und Schweigen. Danach der Heimweg als klarer Übergang und das Zubettgehen. Mala verliert kurz vor dem Schlaf seine Aufmerksamkeit. |
| **Do. Morgen (neu: `i1m`)** | – | Marko wacht auf; Mala ist nicht da. Er erklärt sich alles als Traum. Allein spielbar: das Glas vom Vorabend, die Antwort des Kunden (je nach Abgabe), der versandte Nachruf, das Notizbuch, die leere Mole. Danach die Bar. |
| Do. Morgen, Bar | – | Sanja begrüßt ihn, je nach bisherigem Verlauf. Er setzt sich an seinen Tisch, und auf dem Stuhl gegenüber sitzt Mala. Drei mögliche Reaktionen. Dann der Zettel hinter dem Tresen: Mala liest ihn, Marko fragt Sanja, Sanja bestätigt. |
| Do. Morgen, Riva-Bank | (vorher nachts) | Das bisherige Zwischenspiel am Morgen, mit angepassten Zeilen: Dose, Erinnerungen, `i1.answer`, `i1.sarajevo`. **`mk.accept` setzt erst Markos ausgesprochener Entschluss.** |
| Do. Mittag (`M.startCase2`) | Titelkarte, dann die Bar wie beim ersten Betreten | Titelkarte „Mittag“. Marko bleibt an der Riva. In der Bar heißt es jetzt „Inzwischen sind Stipe und Frane da“. Sanjas Begrüßung und ihr Satz zur Zeitung kommen nicht doppelt. |

## Betroffene Funktionen

- `90_story.js`:
  - neue Phase `i1m`;
  - `M.startGame` (Sanja, Stipe und Frane gelten als bekannt; Kennzeichen `split.intro.v`);
  - `M.endProVisit` (Abend in Varoš, Riva freischalten);
  - `M.startCase1` neu.
- `rooms/flat.js`:
  - Laptop (Übersetzung), Anrufbeantworter (zweite Nachricht);
  - neue Hotspots für Glas und Wasser;
  - `writeArticle` (zweite Wahl), `goToSleep` (Nacht entschärft);
  - Kennenlernen `M.flatMeeting`, Morgen nach Ivka.
- `rooms/bar.js`:
  - Öffnungszeiten (`pro`, `i1m`);
  - Prologbesuch, Stuhl gegenüber, Zettel, Wiederkehr;
  - Anpassung von `c2`; `M.readNewspaper` mit neuem Detail.
- `rooms/art/bar.js`: Zettel hinter dem Tresen, `walkG` für Mala hinter den Tresen.
- `rooms/varos.js`:
  - Glimpse verschoben, Schlüsselrückgabe als Gespräch;
  - gezielte Rückfrage, Zdenka auch am Abend.
- `rooms/ivka.js`: Strickheft, Türbedingung, Symptome, Fritule.
- `rooms/riva.js`:
  - Poller-Anfall (`pro_eve`);
  - `meeting` mit sichtbarer Mala (alte Fassung bleibt für Stimmen-Spielstände);
  - `M.afterLimbo_ivka`, Heimweg, Morgenbank, Wiederaufnahme beim Laden.
- `rooms/office.js`: `M.voiceTest`, das Angebot in `askDay`, der Praxistest.
- `92_story2.js`:
  - `M.startCase2`, `M.canTravel` (`pro`, `pro_eve`, `i1m`);
  - Malas Gespräche (neue Fragen, Praxistest);
  - `M.ambientTick` bleibt auf `mala.voice` beschränkt.
- `05_engine.js`:
  - Sperre `A.g` und `malaJoin` während `split.afterIvka.away` (unterdrückte Zeilen werden für Tests gezählt);
  - `canSwitch` beachtet `mala.noSwitch`;
  - keine steigenden Kopfschmerzen mehr für neue Spiele;
  - Migrationshaken beim Laden.
- `06_ui.js`: `drawSwitch` und Hilfe-Text beachten `mala.noSwitch`; Notizbuch-Kommentar am Morgen.
- `02_rig.js`: neue Körperanimationen `steady` (abstützen), `dizzy` (Hand an der Stirn, leichtes Schwanken), `nausea`.
- `10_items.js`, `11_notes.js`: Glas, neue Notizen und Schlussfolgerungen.
- `95_preset.js`: mit dem neuen Durchlauf neu erzeugt. Der alte Stand wird in einem Test weiter geladen.

## Zustandsplan

```
Soloauftakt ─────────────── split.intro.v=2 (neues Spiel), .translation (quick|careful), .sanja, .health (honest|joke|deflect),
                            .knit (Rückfrage), .dizzy (Poller), .glimpse (Kirchentreppe), .night (Fensterszene)
erste Wahrnehmung ──────── split.intro.glimpse, split.intro.night; Mi.: mala.unknown + mala.voice (nur Flimmern, keine Schmerzspirale)
bewusstes Kennenlernen ─── split.intro.met, split.intro.glass, split.intro.first (Ortsantwort); mala.unknown/mala.voice gelöscht;
                            mala.noSwitch gesetzt (bekannt, aber noch kein Wechsel)
erster gemeinsamer Test ── mk.test (Hafenamt); mala.noSwitch gelöscht → Figurenwechsel
Ivka gelöst ────────────── c1.release → c1.done (erst nach der Zwischenwelt)
Rückkehr/Schlaf ────────── split.afterIvka.bench (kurze Pause), .home (zu Bett), Phase i1m
Marko allein ───────────── split.afterIvka.away=true, GS.malaOn=false (A.g, malaJoin, Wechsel, Porträt, Hotspot, Leuchten gesperrt)
Mala wieder sichtbar ───── split.afterIvka.back (am Tisch in der Bura), .reaction (abwehrend|prüfend|erleichtert); away gelöscht
Überprüfung ────────────── split.afterIvka.read (Mala hat den Zettel gelesen), .verified (Sanja bestätigt)
Akzeptanz ──────────────── mk.accept (Entschluss auf der Bank), i1.answer, i1.sarajevo, m_tin, i1.done
Lukas Fall ─────────────── Phase c2 (M.startCase2, einmalig)
```

Alte Spielstände ohne `split.intro.v` werden beim Laden als `split.intro.legacy` markiert:

- Neue Pflichtschritte im Prolog gelten für sie nicht.
- `mk.test` belegt das Kennenlernen; dann wird `split.intro.met` gesetzt.
- Wer in der alten Stimmenphase steht, bekommt im Hafenamt die alte Erstvorstellung. Für diese Spieler ist sie die erste, also keine doppelte.
- Ein Stand nach der Zwischenwelt, aber vor `i1.done`, läuft beim Laden in die neue Passage weiter.
- Stände in Fall 2, Fall 3, im Epilog und in Sarajevo bleiben unberührt.
