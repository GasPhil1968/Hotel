# MALA – Kapitel 3: Mostar

### Konzept für Geschichte, Figuren und Rätsel (Entwurf, nicht umgesetzt)

Dieses Dokument beschreibt Kapitel 3 einer fünfteiligen Reihe. Es ist ein Konzept. Keine Spieldatei wurde geändert, nichts wurde programmiert, es gibt keine neue Spiel-ZIP. Grundlage ist der Stand `ae3c21e` auf dem Branch `claude/split-adventure-game-concept-inxuzp`.

**Kennzeichnung im ganzen Text**

- **[B] Bestätigter Spielinhalt:** steht so im Code der aktuellen Version. Fundstelle als `Datei:Zeile`, Pfade ab `game/src/`.
- **[I] Interpretation:** ein Schluss aus bestätigtem Inhalt, den das Spiel nicht ausspricht.
- **[N] Neue Idee:** ein Vorschlag dieses Konzepts.

Entwurfsdokumente (`KONZEPT.md`, `KAPITEL2.md`) und Kommentare im Code gelten nicht automatisch als Kanon. Wo sie vom Spiel abweichen, steht das in Abschnitt 1.8.

**Worauf die Aussagen beruhen**

- **Code gelesen:** Ich habe den Quelltext von Finale und Epilog in Kapitel 2 gelesen, außerdem die Stellen in Kapitel 1, auf die er zurückgreift.
- **Kein menschlicher Spieltest:** Ein Spieltest durch Menschen hat nicht stattgefunden.
- **Automatischer Durchlauf:** `tools/walkthrough2.js` lief in der letzten Runde auf genau diesem Stand durch, mit 67 Schritten bis zum Abspann. Das belegt, dass die Pflichtszenen erreichbar sind. Wie sie wirken, belegt es nicht.
- **Geschichte:** Historische Angaben stehen in Abschnitt 10.4, getrennt nach geprüft (mit Quelle) und ungeprüft.

---

## Inhalt

1. Womit Kapitel 2 tatsächlich endet
2. Die Aufgabe von Kapitel 3 in der Reihe
3. Drei Richtungen und die Wahl
4. Kapitel 3 vollständig: „Was der Fluss behält“
5. Figuren und Beziehungen
6. Spielbare Struktur und Rätselabhängigkeiten
7. Drei Kooperationsrätsel, ausgearbeitet
8. Zwei Dialogszenen
9. Enthüllungen und Fortsetzung
10. Kritische Prüfung
11. Schlussprüfung

---

## 1. Womit Kapitel 2 tatsächlich endet

### 1.1 Die letzte Ermittlung: „Finale – Malas Spur“ (Mittwoch, 23. November 2011)

Phase `k2_fin` mit der Karte „Finale · Malas Spur · Mittwoch, 23. November · klar und kalt“ [B] (`96_k2_story.js:15`, `:108`). Die Pflichtschritte laufen so:

1. **Der Karton aus Split.** Nach Sanjas SMS („Paket 4471“) holt Marko am Busbahnhof den Karton „SARAJEVO“ ab. Öffnen lässt er sich erst, wenn Marko Lanas Namen kennt und der dritte Fall abgeschlossen ist [B] (`97_k2_mala.js:63–64`). Darin liegen:
   - Sanjas Zettel;
   - Markos Fotohälfte;
   - der gestreifte Pullover;
   - eine Kinderzeichnung und ein verkohltes Blatt;
   - ein Fahrschein der Linie 3 mit sternförmigem Loch. Hinten steht: „Za prvu trojku poslije rata. 12.11.93.“
2. **Die zwei Hälften.** Mala öffnet ihre Dose ganz. Das Foto wird zusammengelegt [B] (`97_k2_mala.js:86ff.`). Hinten steht „Mala i Mali · 1988 · N. R.“. Mala sagt: „Die konnte ich loslassen. Sie hat immer dir gehört.“
3. **Die Erinnerung.** Die Erinnerungsfolge [B] (`97_k2_mala.js:108–118`):
   - Samstage um 11:10, das Klopfen im siebten Stock, „Halt dich fest, Mali.“;
   - Keller und schwarzes Blatt, falls Marko sie noch nicht gesehen hat;
   - „zwei Fahrscheine“: November 1993, Großmutters Tor. Lana hat einen Platz in einem Bus, Großmutter einen zweiten für Marko. Das Foto wird zerrissen. „Kommst du?“ – „Ich komme.“

   Danach folgen die Sätze, die das Kapitel tragen:
   - „Lana.“ – „Ja.“
   - „Ich habe dir den Namen gegeben. Mala. Weil du mich Mali genannt hast.“ (`:115`)
   - „Ich habe gewartet. Auf der Treppe in Split. Jeden Abend. Dann bin ich gegangen. … Ich weiß nicht, wohin.“ – „Zu mir.“
4. **Nada Delić, neunter Stock** [B] (`rooms/stan.js`):
   - Lanas Zimmer ist seit 1993 verschlossen.
   - „Für das Rote Kreuz ist sie vermisst. Seit siebzehn Jahren schreibe ich jeden Januar einen Brief an den Suchdienst. Sie schreiben zurück: Wir suchen noch.“ (`:12`)
   - Postkarte: „Ich komme nach Hause. Ich hole Mali. Lana · Split, 6.1.1994“ (`:34`).
5. **Großmutter Ružas Küche** [B] (`rooms/kuca.js`). Im Wärmefach des Herds liegt die Rotkreuz-Nachricht vom 18.12.1993 (`:10`): „Mali, ich warte jeden Abend auf der Treppe im Hotel Palma. Wenn du nicht kommst, komme ich dich holen. Meinen Fahrschein habe ich noch. Hast du deinen? Mala“. Mala sagt dazu: „Sie wollte dich schützen. … Vor mir. Vor dem Warten. … Ich bin losgelaufen.“ (`:13`)
6. **Schlüsse im Notizbuch** [B]. Aus Rotkreuz-Nachricht und Postkarte folgt „Sie kam mich holen“ (`13_k2_notes.js:115`). Daraus folgt „Darum steht bei Abreise nichts … Sie ist aufgebrochen. Zu mir.“ (`:116`)
7. **Mala bietet die Nacht an** [B] (`97_k2_mala.js:55ff.`): „Ich bin losgefahren, um dich zu holen. Ich bin nie angekommen. Fahr mit mir. Mit der Drei. Einmal.“

### 1.2 Der Höhepunkt: die letzte Drei und die Bank (Mittwochnacht, erster Schnee)

- **Malas Fahrschein** [B] (`97_k2_mala.js:47`): „Den Fahrschein halte ich seit achtzehn Jahren fest. … Ich glaube, ich lasse gerade los.“ Der Fahrschein bleibt in Markos Hand. Er ist ein Geisterding, das stofflich geworden ist.
- **Die Fahrt** [B] (`rooms/tramvaj.js:38–62`):
  - Damir fährt: „Letzte Drei für heute. … Die alte.“
  - Unterwegs kommen Erinnerungen an die Türme und an das Dosendenkmal.
  - Dann „die Nacht des Busses“ (`:49`): Großmutter hat Fieber, Marko sagt Lana nichts. Um Mitternacht hupt ein Bus zweimal. „Ich stehe am Fenster und gehe nicht hinunter.“
  - Danach gesteht Marko in einer von drei Fassungen (Flag `k2.f2.confess`, `:54`).
  - „Ich habe dich in Split gesucht. Im Mai vierundneunzig. Alle Hotels.“ – „Ich war schon nicht mehr dort.“ – „… Du bist gekommen. Nur später.“ (`:59–60`)
- **Die Bank an der Endstation** [B] (`rooms/carsija.js:71–80`):
  - Marko legt beide Fahrscheine in ihre Dose.
  - „Ich bin Lana. Lana Delić, neunter Stock.“
  - „Ich bin im Januar losgefahren. Von Split. Ich wollte dich holen.“
  - „Ein Lastwagen hat mich mitgenommen. Mit Mehl und Decken. Es war Nacht. Der Fahrer hat geraucht und nichts gesagt.“
  - Der Splitter: „Ein Fluss, grün und laut, tief unten. / Eine Brücke, die nicht mehr da war. / Wasser.“ (Notiz `f2_bridge`, `13_k2_notes.js:117`)
  - „Dann weiß ich nichts mehr.“ – „Ich finde es heraus.“
  - „Meine Leine. Sie zeigt nicht mehr nach Osten. … Sie zeigt nach Südwesten.“ – „Mostar.“ – „Ich glaube, ja.“ (`:79`)
  - Im Code verliert die Leine nach dieser Szene ihre Bindung an Marko und zeigt in eine feste Richtung (`97_k2_mala.js:7`).
- **Rade zählt** [B] (`rooms/carsija.js:53`): „Dva putnika.“ – „Zwei Fahrgäste?“ – „Ich zähle, was ich sehe. … Heute sehe ich schlecht.“

### 1.3 Der Epilog „Der erste Schnee“ (Donnerstag, 24. November, Morgen)

`M.k2StartEpilogue` [B] (`96_k2_story.js:112–113`). Reisen ist nur noch zum Busbahnhof und nach Alipašino möglich (`:79`), dazu in die Pension (`97_k2_talk.js:163`).

- **Nada (Pflicht)** [B] (`rooms/stan.js:23–32`). Marko gibt ihr die Rotkreuz-Nachricht. „Ich finde heraus, wo sie geblieben ist. Ich fahre heute nach Mostar.“ Auf Nadas Frage „Warum Mostar?“ gibt es drei Antworten:
  - Brücke: „Im November dreiundneunzig ist die Alte Brücke gefallen. Das weiß jeder.“
  - Spüren: „Esad hat immer gespürt, wo sie ist. … im Westen.“ (`:29`)
  - Lastwagen: „Im Januar vierundneunzig. Durch die Front. Mein Gott, Kind.“

  Dann sagt Nada: „Mali. … Bring sie mir nach Hause.“ – „Ja.“ (`:31`). Mala sagt: „Mama.“ Nada sieht zum Fenster, „wo niemand steht. … als wäre es kalt geworden. Oder warm.“ Im Nachgespräch (`97_k2_talk.js:209ff.`): „Du musst mir sagen, was du findest. Auch wenn es nichts ist.“ Über Lanas Zimmer: „Ich lüfte es jetzt. Jeden Morgen. Damit es nach jetzt riecht und nicht nach damals.“
- **Die Fahrkarte** [B] (`rooms/stanica.js:67–74`): „Kamo?“ – „Mostar.“ – „Povratna?“ Wer „Nur hin“ wählt, hört Marko sich korrigieren: „Nein. Hin und zurück. Ich habe jemandem versprochen zurückzukommen.“ Beide Wege führen zur Rückfahrkarte (`busticket2`). Das Rückfahrtversprechen ist also fester Kanon, keine Wahl.
- **Optional: Hajra** [B] (`97_k2_talk.js:158–161`). Sie gibt Marko Pita mit, dazu einen Zettel: „Für zwei.“ Sie sagt: „Ich bin alt, Kind, nicht blind. Ich sehe, wie du zur Seite schaust, wenn du redest. … Grüß sie von mir. Und von Ruža.“
- **Optional: Anruf bei Ana in München** [B] (`rooms/pansion.js:63ff.`): „Komm uns besuchen, Marko. Oder lass dich besuchen. Irgendwas.“
- **Die Abfahrt** [B] (`rooms/stanica.js:139–152`):
  - Auf der Bank: „Hin und zurück.“ – „Hin und zurück.“
  - Optional: „Hast du Angst vor Mostar?“ – „Ja. … Vor dem Fluss. Er war so laut.“ – „Ich bin da.“ – „Ich weiß. Diesmal bist du da.“ (`:143`)
  - Optional: „Lana oder Mala?“ – „… Mala nur du.“ – „Dann bleibe ich bei Mala.“ – „Dann bleibe ich bei dir.“
  - Das Bild „Im Bus nach Mostar“: „Mala sitzt am Fenster. Ich sitze daneben, damit sie nicht herausfällt. … Darin liegen jetzt nur noch zwei Fahrscheine, beide entwertet. Das Foto habe ich. Ihre Leine zeigt nach Südwesten. Die Straße auch.“ (`:151`)
  - Karte „Ende des zweiten Kapitels · Fortsetzung: Mostar“ (`:152`).
- **Abspann** [B] (`96_k2_story.js:116–118`). Er dankt Tomaž, Ivan, Zora und Alija. „Für alle, die in Kellern Schule hielten, und für alle, die noch gesucht werden.“ Am Schluss: „FORTSETZUNG · Kapitel 3: Mostar“.
- **Technisch** [B] (`96_k2_story.js:120`). `M.endChapter2` speichert nur einen Zeitstempel und löscht den Spielstand. Anders als am Ende von Kapitel 1 (`M.storeC1End`, `:25`) wird keine Entscheidung übernommen.

### 1.4 Zustand von Marko

| | Stand am Ende von Kapitel 2 |
|---|---|
| **Wissen** | [B] Mala ist Lana Delić. Er kennt die Samstage, die Kellerschule, das Gedicht und die zwei Fahrscheine. Er weiß, dass er in der Nacht des Busses nicht kam. Er kennt die versteckte Rotkreuz-Nachricht und weiß, dass Lana im Januar 1994 aufbrach, um ihn zu holen. Er kennt den Lastwagen, den Fluss und die fehlende Brücke, und dass Lana als vermisst gilt. Über die eigene Familie: Der Vater war Ingenieur, „hat Brücken berechnet“. Er ging im Frühjahr 1993 an der Brauerei Wasser holen und „ist nicht zurückgekommen“ (`rooms/vratnik.js:24`, nur bei dieser Gesprächswahl). Mutter und Ana leben in Deutschland. Die Mutter „schickt jedes Jahr Geld für das Dach. Sie kommt nicht.“ (`rooms/pansion.js:31`) und „ruft an. Zu Weihnachten.“ (`97_k2_talk.js:77`) |
| **Fähigkeiten** | [B] Er übersetzt aus dem Deutschen, Italienischen und Englischen, liest Slowenisch und mit der Tafel auch Kurrent. Er redet mit Lebenden und zieht Schlüsse im Notizbuch. Er sieht Geister, sobald Mala sie gefunden hat. In ihrer Nähe bekommt er Kopfschmerz und Schwindel. In die Zwischenwelt geht er mit und tut dort das Letzte, das ein Geist braucht. |
| **Verantwortung** | [B] Er hat Nada versprochen, Lana „nach Hause“ zu bringen. Mit der Rückfahrkarte hat er versprochen zurückzukommen. |
| **Selbstbild** | [I] Er hält sich nicht mehr für jemanden, der vergessen hat, sondern für jemanden, der es wiedergutmacht. Die Schuld der Busnacht ist ausgesprochen, nicht aufgelöst. Er „übt“ das „Wir“ (`97_k2_talk.js:113`). |
| **Offene Fragen** | Wie und wo ist Lana gestorben? Wo liegt sie? Warum hat sie niemand gefunden? Was heißt „nach Hause bringen“? [I] Seinen eigenen Vater hat er nie gesucht. Mit der Mutter hat er seit Jahren kaum geredet. |

### 1.5 Zustand von Mala

| | Stand am Ende von Kapitel 2 |
|---|---|
| **Identität** | [B] Lana Delić, geboren am 3. März 1976, neunter Stock in Haus 7. „Beide. Lana war ich für die anderen. Mala war ich für dich.“ (`97_k2_talk.js:114`). Von Marko will sie „Mala“ genannt werden. |
| **Vergangenheit** | [B] Wie in 1.1 und 1.2. Dazu das Hotel Palma: die knarrende siebte Stufe, Brunos Tee, ihre Zeichnung einer Drei mit „KUĆA“ (`97_k2_talk.js:112`, optional). |
| **Tod** | [B] Unbekannt: „Und ich weiß immer noch nicht, wo ich gestorben bin.“ (`97_k2_mala.js:50`). Der letzte Splitter endet mit „Wasser.“ |
| **Verbindung zu Marko** | [B] „Ich bin an dich gebunden.“ (`rooms/terminal.js:37`, Kapitel 1). Ihr Gedächtnis hängt an seinem, so sagt Zora: „Wir Toten erinnern uns mit den Lebenden, Kind. Du bist so leer, weil einer dich vergessen hat.“ (`13_k2_notes.js:89`). Seit der Bank zeigt die Leine nicht mehr auf Marko, sondern nach Südwesten. |
| **Was sie weiß, was der Spieler weiß** | [B] Spieler und Mala wissen dasselbe wie Marko. Das Spiel schneidet nie zu einer Szene, die Marko nicht erlebt. [I] Ob Mala vom Tod ihres Vaters Esad (2005) weiß, hängt davon ab, ob Marko Nada nach ihm gefragt hat (`rooms/stan.js:13`, optional). Nadas „Bring sie mir nach Hause“ hat sie mitgehört. |
| **Wünsche** | [B] Sie will der Mutter sagen, dass es ihr leidtut, „dass ich die Tür immer zugeknallt habe … Sag du es ihr. Irgendwann. Nicht heute.“ (`97_k2_talk.js:111`, optional). Sie will wissen, wo sie gestorben ist. |
| **Ängste** | [B] Sie hat Angst vor dem Fluss („Er war so laut.“, optional). Bei Glocken zuckt sie zusammen, ohne zu wissen, warum: „Sie haben auch geläutet, als … Ich weiß nicht mehr, als was.“ (`rooms/ferhadija.js:21`). [B] Sie fürchtet, dass alles nichts bedeutet („Ich habe Angst, dass es nichts bedeutet.“, `97_k2_mala.js:35`). |
| **Fähigkeiten** | [B] Sie geht durch Wände und Türen. Sie sieht Geister und ihre Leinen. Mit „Spüren“ liest sie den Nachhall an Orten und Dingen, mit „Lauschen“ hört sie zu. Anfassen kann sie nichts. Weit von Marko weg kommt sie nur unter Schmerzen: „Ein paar Straßen, dann zieht es.“ (Kapitel 1). In Sarajevo ging sie trotzdem allein durch die Stadt: „Darum tut es weh, wenn du gehst.“ Sie bringt Geister hinüber. Wer losgelassen hat, kann etwas hergeben, so wurden Fotohälfte und Fahrschein stofflich. |

### 1.6 Die Beziehung

- **Vertrauen** [B]: „Wir.“ – „Ja. Wir.“ (`97_k2_mala.js:50`). „Du sagst das jetzt so leicht.“ – „Ich übe.“ (`97_k2_talk.js:113`).
- **Gelöste Konflikte** [B]: Marko erinnert sich wieder, er hat gestanden, der Karton ist offen, sie hat ihren Namen.
- **Spannungen** [I]:
  - Mala hat verstanden, warum Marko nicht kam. Verziehen hat sie es nicht ausdrücklich. In der Fassung „Großmutter war krank“ sagt sie: „Ich hätte es verstanden.“ – „Das denkst du heute noch.“
  - Marko hat Nada etwas über Lanas Körper versprochen, ohne Mala zu fragen. Mala hat dazu nur „Mama.“ gesagt.
  - Ungeklärt bleibt, warum Mala selbst nicht hinübergehen kann („Noch nicht.“, Kapitel 1).
- **Umgekehrte Rollen** [B]/[I]: In der Drei saß Lana neben Mali, „damit du nicht herausfällst“. Im Bus nach Mostar sitzt Marko neben ihr, „damit sie nicht herausfällt“. Er beschützt jetzt sie.

### 1.7 Offene Fäden und das angekündigte Ziel

- **Ziel** [B]: Mostar (`rooms/carsija.js:79`, `rooms/stanica.js:152`, `96_k2_story.js:116`).
- **Vorbereitung im Prolog von Kapitel 2** [B] (`96_k2_story.js:44`): „Bei Mostar hält der Bus zwanzig Minuten. Mala steigt nicht aus. Sie sieht auf den Fluss hinunter, bis wir weiterfahren.“
- **Offene Fäden** [B]:
  - Tod, Ort, Fahrer und Brücke;
  - die Glocken und der Fluss;
  - die Leine;
  - „Bring sie mir nach Hause“ und „Hin und zurück“;
  - Zoras Satz in der Zwischenwelt: „Er erinnert sich jetzt. … Lass ihm Zeit. Aber nicht zu viel.“ (`97_k2_limbo.js:48`). Warum nicht zu viel, sagt sie nicht;
  - Rades „Dva putnika“ und Hajras „Für zwei“;
  - Malas Blick auf die Abfahrtstafel: „Früher stand hier ‚Dubrovnik‘ ganz oben. Glaube ich.“ (`rooms/stanica.js:100`);
  - Markos Vater, Mutter und Ana.

### 1.8 Widersprüche, Lücken, nicht Übernommenes

1. **Seit wann ist Mala bei Marko?** In Kapitel 1 sagt sie: „Seit gestern. Seit der Kirchentreppe in Varoš.“ (`rooms/flat.js:315`). Sie weiß aber, dass er den Karton „nie aufgemacht“ hat (`rooms/flat.js:156`, `92_story2.js:63`, `rooms/vratnik.js:34`). In Kapitel 2 sagt sie, sie sei aus Split weggegangen, „Zu mir.“ Das Spiel klärt den Widerspruch nicht. [I] Er lässt sich auflösen: Sie war länger da, aber leer und für ihn unsichtbar. „Seit gestern“ heißt dann „seit du mich siehst“. Kapitel 3 beantwortet die Frage (Abschnitt 9.1).
2. **Abfahrtszeit im Epilog.** Die Tafel nennt „Mostar 6:30, 9:15, 14:00“ (`rooms/stanica.js:100`). Die Uhr zeigt „Kurz vor sieben“ (`:115`), und Fadila sagt „in zwanzig Minuten“. Der Bus fährt also gegen 7:15. Diese Abfahrt gibt es auf der Tafel nicht. Der Widerspruch ist klein. Kapitel 3 sollte keine Uhrzeit von dort übernehmen.
3. **Nicht im Spiel, also kein Kanon.** `KONZEPT.md` §9.1 Punkt 2 („Ich bin schon länger in deiner Nähe“) steht nicht im Code. `KONZEPT.md` §9.3 schlägt Dubrovnik und Fährenhörner für spätere Kapitel vor. Das ist eine Entwurfsidee. Im Spiel steht dazu nur Malas Satz zur Abfahrtstafel. Er hat bisher keine Funktion.
4. **Ružas Tod.** Das Spiel sagt „vierundneunzig“. `KAPITEL2.md` sagt „im Februar“. Beides verträgt sich, der Monat steht aber nur im Entwurf.
5. **Folgenlose Entscheidungen.** Das Geständnis (`k2.f2.confess`), Nadas „Warum Mostar?“ und Hajras Abschied wirken nach der Szene nicht weiter. Wegen 1.3 können sie auch nicht nach Kapitel 3 gelangen.
6. **Optionales, das Kapitel 3 nicht voraussetzen darf.** Den Vater (`rooms/vratnik.js:24`), Malas Angst vor dem Fluss (`rooms/stanica.js:143`), „Lana oder Mala“, Hajra und Ana kann ein Spieler verpasst haben. Marko weiß das alles, es ist sein Leben. Der Spieler vielleicht nicht. Kapitel 3 muss es deshalb neu, aber knapp sagen.
7. **Nadas Vermutung.** „Durch die Front“ ist Nadas Vermutung, keine Tatsache des Spiels.
8. **Erreichbarkeit.** In Finale, letzter Fahrt, Bank und Epilog habe ich keine unerreichbare Szene gefunden. Die Pflichtkette erreicht der automatische Durchlauf. Ob jede optionale Zeile zur Laufzeit erreichbar ist, habe ich nicht einzeln geprüft.

### 1.9 Was Kapitel 3 deshalb leisten muss

1. **Malas Tod vollständig beantworten.** Wie, wo, wann, wer dabei war, wo sie liegt und warum man sie nie fand. Die Antworten sollen früh genug kommen, damit sie Folgen haben können.
2. **Das Versprechen an Nada zum Konflikt machen.** Wem gehört die Entscheidung, was mit Lana geschieht?
3. **Glocken und Fluss erklären.** Diese Fäden laufen seit Kapitel 1.
4. **Das Band zwischen Marko und Mala verändern.** Bisher ist es ein Symptom: Er hat vergessen, sie war leer. Danach soll es eine Entscheidung sein.
5. **Kapitel 4 und 5 über Folgen öffnen.** Kein neuer Leinentrick soll die Richtung vorgeben, und keine Antwort soll zurückgehalten werden.
6. **Nicht Kapitel 2 wiederholen.** Also nicht drei Fälle und daneben eine Spur.

---

## 2. Die Aufgabe von Kapitel 3 in der Reihe

### 2.1 Überblick über alle fünf Kapitel

| Kapitel | Ort und Zeit | Leitfrage | Eigener Konflikt | Wendepunkt am Ende | Status |
|---|---|---|---|---|---|
| **1 Split** | Split, Dienstag bis Samstag, November 2011 | Wer ist sie? | Marko wehrt sich gegen seine Gabe und lernt, was Warten aus Menschen macht | Er kauft eine Fahrkarte nach Sarajevo, „nur hin“ | [B] |
| **2 Sarajevo** | Sarajevo, 19. bis 24.11.2011 | Wer war sie für mich? | Marko hat Lana verdrängt und trägt die Schuld der Busnacht | Mala heißt Lana. Marko verspricht Nada etwas. Die Leine zeigt nach Südwesten. „Hin und zurück“ | [B] |
| **3 Mostar** | Mostar und der Weiler Skela, 24. bis 28.11.2011 | Wem gehört ihr Tod? | Marko will wiedergutmachen, Mala will über ihren Tod selbst bestimmen. Wahrheit steht gegen Schonung | Lana wird gefunden, Nada erfährt alles. Malas Leine löst sich, und Mala bindet sich bewusst an Marko. Marko gibt eine Probe für seinen vermissten Vater ab und ruft seine Mutter an | [N] |
| **4 München** | München, Weihnachten 2011 | Wem gehört Marko? | Marko und seine Mutter, der Vater, das Leben, das er vertagt hat. Was das Band zu Mala ihn kostet | Marko entscheidet, wohin er gehört, und erfährt, was mit seinem Vater geschah | [N] |
| **5 Sarajevo** | Sarajevo, März 2012 | Wohin gehört sie, und wohin er? | Loslassen, ohne zu verlassen | Lana wird begraben. Mala entscheidet über ihren Weg selbst | [N] |

### 2.2 Gesamtrichtung [N]

Die ersten drei Kapitel fragen nach Mala: wer sie ist, wer sie für Marko war, wie sie gestorben ist. Die letzten beiden fragen, was Lebende und Tote mit der Wahrheit anfangen.

Kapitel 3 ist die Achse der Reihe. Es beendet die Suche nach Malas Vergangenheit vollständig. Danach ist kein Geheimnis über ihr Leben oder ihren Tod mehr übrig. Zugleich stellt es die Frage, die das Finale beantworten muss:

> **Kann man jemanden nach Hause bringen, ohne ihn festzuhalten?**

Die Frage hat ihre Wurzeln im Spiel:

- Nadas „Bring sie mir nach Hause“;
- die Leine („Wer nicht weiterkommt, hält sich an etwas fest“, Kapitel 1);
- Malas „An etwas, das ich nicht loslassen will“ (`92_story2.js:64`);
- die Rückfahrkarte.

### 2.3 Was Kapitel 3 dafür leisten muss

- **Ein eigener Konflikt.** Kapitel 3 ist keine Station auf dem Weg. Es streitet über eine echte Frage: Wer entscheidet über Lanas Tod, ihren Körper und ihre Geschichte?
- **Echte Antworten.** Tod, Ort und Umstände, der Fahrer, das Grab, die Glocken, der Fluss. Dazu, warum Lana nie gefunden wurde und seit wann Mala bei Marko ist.
- **Ein Wendepunkt mit Folgen.** Die Leine löst sich, und Mala bindet sich aus freien Stücken. Nada wird zur Mitwisserin des Fundes, nicht des Geistes. Marko wendet sich seinen eigenen Vermissten zu.
- **Kapitel 4 und 5 aus Folgen begründen.** Die Identifizierung dauert und führt zum Begräbnis in Kapitel 5. Markos Probe führt zu seinem Vater und zu seiner Mutter in Kapitel 4. Malas gewähltes Band ist die Frage des Finales.

---

## 3. Drei Richtungen und die Wahl

### Richtung A – „Was der Fluss behält“

- **Verbindung zu Sarajevo:** Malas letzter Splitter (Lastwagen, Fluss, fehlende Brücke, Wasser), die Leine nach Südwesten und Nadas Auftrag.
- **Konflikt:** Marko kommt, um sein Versprechen zu halten und seine Schuld abzutragen. Mala will zuerst wissen, wie sie gestorben ist. Danach will sie selbst entscheiden, was davon nach Hause geht.
- **Ort:** Mostar auf beiden Ufern und ein erfundener Weiler, zehn Kilometer flussab. Dort ersetzte im Winter 1993/94 eine Seilfähre eine zerstörte Brücke.
- **Herausforderung:** Lanas letzte Stunden halten nur Lebende. Sie sind alt, schweigen aus Gründen, die man verstehen kann, und vergessen schon.
- **Rätselpotenzial:**
  - Malas Leine über die ganze Stadt anpeilen;
  - ein Anker, der wandert, und damit erweist, dass er ein Mensch ist;
  - eine Nacht über einen Fluss hinweg rekonstruieren, mit je einer Hälfte der Wahrheit auf jedem Ufer;
  - übersetzen, was jemand meint, nicht nur, was er schreibt;
  - zwei Fassungen derselben Nacht gegeneinander halten.

**Wie gut trägt die Richtung Kapitel 4 und 5?** Stark. Die Identifizierung braucht Wochen, daraus entsteht das Begräbnis in Kapitel 5. Die Vermisstenstelle stellt Marko die Frage nach seinem eigenen Vater, daraus entsteht Kapitel 4. Malas gewähltes Band wird zur Frage des Finales.

### Richtung B – „Zwei Hälften einer Stadt“

- **Verbindung zu Sarajevo:** Lanas Spur liegt in zwei Verwaltungen, die nicht miteinander reden. Auf jedem Ufer gibt es eigene Register, Ämter, Busbahnhöfe und Post.
- **Konflikt:** Marko übersetzt „zwischen zwei Sprachen, die eine sind“. Er muss zwei Familien zusammenbringen, die seit dem Krieg nicht miteinander sprechen, und zwei Akten zu einer machen.
- **Ort:** Mostar, Ostufer und Westufer, der Bulevar.
- **Herausforderung:** Mala weigert sich, den Fluss zu überqueren. Jeder Schritt führt über eine Grenze, die niemand sieht.
- **Rätselpotenzial:**
  - geteilte Dokumente;
  - Übergänge;
  - Zuständigkeiten;
  - Wortwahl als Herkunftsbeweis.

**Wie gut trägt die Richtung Kapitel 4 und 5?** Mittel. Sie hat viel Ortsfarbe und starke Kooperationsrätsel. Der Wendepunkt bliebe aber eher behördlich als persönlich. Außerdem liegt die Politik der Stadt nah an echten Wunden, und Lana droht dahinter zu verschwinden.

### Richtung C – „Hin und zurück“

- **Verbindung zu Sarajevo:** Nada fährt mit nach Mostar. Die Mutter sitzt im Bus am Fenster, die Tochter neben ihr, Marko dazwischen.
- **Konflikt:** Marko muss Malas Gegenwart verbergen oder offenbaren. Nadas Erinnerungen füllen Lanas Kindheit, denn die Toten erinnern sich mit den Lebenden.
- **Ort:** die Straße entlang der Neretva, Mostar.
- **Herausforderung:** Mutter und Tochter sind in einem Raum und können nicht miteinander reden.
- **Rätselpotenzial:** vermitteln, ohne sich zu verraten.

**Wie gut trägt die Richtung Kapitel 4 und 5?** Schwach. Sie verbraucht die stärkste Begegnung der Reihe zu früh. Mala wird zur Reagierenden, und Kapitel 5 fehlte seine Mitte.

### Die Wahl

**Richtung A.** Sie beantwortet die Frage, die Kapitel 2 offen lässt, vollständig und schafft dabei neue Folgen statt neuer Rätsel. Zwei Elemente aus den anderen Richtungen übernimmt sie, ohne deren Risiken:

- **Aus B die geteilte Stadt.** Sie bleibt alltäglicher Hintergrund und Quelle trockenen Humors, kein Motor: zwei Busbahnhöfe und ein Witz über das Übersetzen.
- **Aus C ein einziges Bild.** Am Ende sitzt Nada im Bus, und Mala sitzt neben ihr. Nada erfährt dabei nichts über den Geist.

---

## 4. Kapitel 3 vollständig: „Was der Fluss behält“

### 4.1 Arbeitstitel, Prämisse, Thema

**Arbeitstitel:** Kapitel 3: Mostar – *Was der Fluss behält* [N]

**Prämisse [N].** Marko hat Lanas Mutter versprochen, ihre Tochter nach Hause zu bringen. In Mostar finden er und Mala heraus, was in der Nacht vom 14. auf den 15. Januar 1994 geschah:

- Lana starb nicht an der berühmten Alten Brücke, sondern an einer Seilfähre, die niemand gezählt hat.
- Sie überlebte den Fluss und starb am nächsten Tag im Haus einer Fremden.
- Man fand sie nie, weil sie sich mit dem Namen nannte, den nur Marko kannte. Er hatte ihn vergessen.
- Wer sie hätte retten können, kam zu spät: der Fahrer um zwei Uhr nachts, der Fährmann am Morgen, Marko im Mai.
- Um Schweigen hat Lana selbst gebeten.

Marko und Mala müssen entscheiden, wem diese Wahrheit gehört.

**Thema [N]:** *Finden heißt nicht festhalten.* Wem gehört ein Tod: der Toten, der Mutter, der Fremden, die das Grab pflegte, oder dem Mann, der sich schuldig fühlt?

### 4.2 Der zentrale Konflikt

**Warum jetzt?**

- **Die Leine.** Seit Mittwochnacht zeigt Malas Leine nicht mehr auf Marko, sondern nach Südwesten [B]. Mala kommt nicht zur Ruhe, solange sie nicht weiß, woran sie jetzt hängt.
- **Das Versprechen.** Marko hat es Donnerstagfrüh gegeben und die Rückfahrkarte gekauft [B]. Nada wartet: „Du musst mir sagen, was du findest. Auch wenn es nichts ist.“
- **Die Zeit.** Zlata Brkić hält als einziger lebender Mensch Lanas letzte Stunden. Sie ist 74 und vergisst seit dem Frühjahr Dinge [N]. Das gibt Zoras Satz „Lass ihm Zeit. Aber nicht zu viel.“ [B] einen Sinn: Die Toten erinnern sich mit den Lebenden [B]. Wenn die Lebenden vergessen, ist es für immer verloren [N].

**Warum die beiden?**

- **Nur Marko kennt den Namen.** Nur er weiß, dass „Mala“ Lana Delić ist, denn er hat ihr den Namen gegeben [B]. Unter genau diesem Namen ist sie gestorben [N].
- **Nur Mala sieht die Leine.** Sie allein kann ihr folgen.
- **Beide sind gebunden.** Er hat es versprochen. Sie ist die, um die es geht.

**Warum können sie nicht ausweichen?**

- **Mala kann nicht mehr zurück.** Sie war siebzehn Jahre leer. Jetzt ist sie „voll, Stück für Stück … Es tut weh. Es tut gut.“ [B] (`97_k2_mala.js:44`). Die fehlende Nacht ist ein Loch, das zieht.
- **Marko müsste lügen.** Ohne Antwort zu Nada zurückzukehren hieße, ihr zu tun, was Ruža ihm getan hat: Schweigen aus Schonung [B] (`rooms/kuca.js:13`).

**Die Formel**

> **Zu Beginn glauben Marko und Mala,** Lana sei im Januar 1994 an der Alten Brücke von Mostar in die Neretva gestürzt und allein und namenlos ertrunken. Marko halte sein Versprechen, wenn er den Ort findet und Nada ihre Tochter bringt. Marko hält Lanas Tod für die Rechnung seiner Nacht im November 1993. Mala hält den, der ihr Läuten hörte und nicht kam, für schuldig.
>
> **Durch ihre Ermittlungen und Handlungen erkennen sie,**
> - dass Lana an einer vergessenen Seilfähre starb, nicht an der berühmten Brücke;
> - dass sie den Fluss überlebte und am nächsten Mittag im Haus einer Fremden starb, gewärmt mit den Decken aus ihrem eigenen Lastwagen;
> - dass sie selbst den Fahrer wegschickte, selbst ans Seil ging und selbst um Schweigen bat;
> - dass man sie nur deshalb nie fand, weil sie sich „Mala“ nannte. Den Namen kannte nur Marko, und er hatte ihn vergessen;
> - dass alle, die sie retten wollten, zu spät kamen, jeder auf seine Art;
> - dass eine Schuld nicht leichter wird, wenn man sie allein trägt, nur unsichtbarer;
> - und dass Mala gerade dasselbe tut wie Ruža: verschweigen, um zu schützen.
>
> **Deshalb entscheiden sie sich am Ende,** Lanas Tod nicht länger als Markos Schuld oder als Malas Geheimnis zu behandeln, sondern ihn zurückzugeben:
> - Nada erfährt alles, auch Lanas eigene Bitte.
> - Nada und Zlata entscheiden zusammen, wo Lana liegen soll.
> - Mala lässt den Fährmann kommen und bringt ihn hinüber.
> - Marko fragt, statt zu versprechen, und beginnt, seine eigenen Vermissten zu suchen.
> - Mala ist frei. Sie bindet sich selbst an Marko, weil sie es will, nicht weil sie muss.

Jeder Teil der Veränderung geschieht durch eine spielbare Handlung (Abschnitt 6).

### 4.3 Was im Januar 1994 geschah [N]

Diese Geschichte erfährt der Spieler erst nach und nach. Alle Namen, der Weiler Skela, seine Brücke und seine Fähre sind erfunden. Skela liegt an einem Flussabschnitt, der keine Front ist (10.4, Punkt 1). Der historische Rahmen und was daran ungeprüft ist, steht in 10.4.

| Wann | Was geschah | Wer es heute hält |
|---|---|---|
| Fr 14.1.1994, Nachmittag | Lana verlässt das Hotel Palma ohne Abschied. Unter Ljerkas Tür schiebt sie eine Zeichnung von Bruno mit seinem Teeglas, unterschrieben „Mala“. Den Schlüssel von Zimmer 31 nimmt sie mit. | Ljerka (lebt, Split) |
| Fr, ~17:00 | Vlado Rajić fährt einen alten TAM mit Mehl und Decken für Familien in den Dörfern an der Neretva. Eine kleine Hilfsgruppe von Mostarern in Split hat ihn geschickt. Lana hat ihn so lange bekniet, bis er sie mitnimmt. Sie nennt sich „Mala“. Er raucht und sagt nichts. Sie zeichnet ihn im Licht des Armaturenbretts: „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“ | Vlado (lebt, Mostar) |
| Fr, ~22:40 | Ankunft an der Anlegestelle von Skela, rechtes Ufer. Die Straßenbrücke ist seit dem Sommer zerstört. Über den Fluss fährt bei Tag eine Seilfähre: ein Ponton an einem Stahlseil. Vlado lädt in der Hütte ab, die Dorfleute holen die Ware morgens. Nachts fährt niemand, es gilt Sperrstunde, und der Fluss führt Hochwasser. | Vlado; der Nachhall an der Hütte |
| Fr, ~23:10 | Vlado will Lana zu seiner Schwester nach Mostar zurücknehmen, bis die Fähre fährt. Sie schickt ihn weg: „Ich habe genug gewartet. Für ein ganzes Leben. Fahr.“ Sie schenkt ihm die Zeichnung, „für später“. Er fährt. | Vlado |
| Sa 15.1., 0:10 / 0:25 / 0:45 | Lana läutet die Rufglocke am rechten Ufer, dreimal mit Pausen. Sie ruft: „Halo! Ima li koga?“ Drüben geht um 0:20 im Dachfenster des Fährmanns Licht an. Bato steht am Fenster und hört. Im Dunkeln sieht er nichts. Er hält den Rufer für einen Soldaten, einen Schmuggler, irgendeinen, der nachts nichts Gutes will. Um 0:40 macht er das Licht aus. | Bato (Geist); der Nachhall an der Glocke |
| Sa, ~0:50 | Lana hängt sich an das Fährseil und will sich Hand über Hand hinüberziehen. In der Mitte des Flusses lässt sie los. | Nur der Nachhall am Seilanker |
| Sa, ~2:00 | Vlado ist bis zur Kontrolle vor der Stadt gefahren und umgekehrt. Er ruft an der Anlegestelle. Niemand antwortet. Er fährt nach Hause und sitzt bis zum Morgen im Führerhaus. Seine Tochter Kata ist zwölf und sieht ihn dort sitzen. | Vlado, Kata |
| Sa, ~6:30 | Zlata findet Lana vierhundert Meter flussab im Schilf, halb aus dem Wasser, in den Wurzeln einer Weide. Sie lebt kaum noch. Bato und Zlata tragen sie in die Küche. Bato holt mit der Fähre die Ware vom rechten Ufer: die Decken aus Vlados Lastwagen. An der Glocke findet er einen angekauten Bleistift. Jetzt weiß er, wer geläutet hat. | Zlata |
| Sa, ~10:00 | Lana wacht kurz auf. Zlata fragt: „Kako se zoveš, dušo?“ – „Mala.“ Lana fragt, wie spät es ist, und sagt: „Mali wartet.“ Dann bittet sie: „Sagt es keinem. Ich will selbst nach Hause kommen. Nicht als Nachricht.“ Zlata verspricht es. | Zlata |
| Sa, gegen Mittag | Lana stirbt neben dem Herd, in die Decken gewickelt. Im Radio sagt jemand die Uhrzeit. Es ist ein Samstag. | Zlata |
| 15./16.1. | Wegen Sperrstunde, gefrorener Wege und Angst kommen sie nicht zum Friedhof. Bato hebt im Garten unter dem Quittenbaum ein Grab aus. Er schnitzt ein Brett: MALA · 15.1.1994. Er sagt Zlata nie, dass er wach war. Zlata glaubt bis heute, er habe geschlafen. | Zlata |
| 1996 | Zlata hat Lanas Skizzenbuch auf dem Herd getrocknet. Darin sind eine Drei, ein Hochhaus mit Uhr und das Schild „Alipašino“. Sie schreibt einen Brief „an die Familie eines Mädchens, das sich Mala nannte“, adressiert an die Ortsgemeinschaft Alipašino Polje. Drei Monate später kommt er zurück: „Adresse unzureichend.“ Sie nimmt es als Zeichen. | Zlata, der Brief in ihrer Schublade |
| 1998 | Spender bauen eine neue Brücke, dreihundert Meter flussauf. Die Fähre stellt den Dienst ein, die Glocke bleibt hängen. | Tafel an der neuen Brücke |
| 2006 | Bato stirbt. Seitdem sitzt er als Geist in seinem Schuppen am linken Ufer. Für ihn ist es die Nacht des 15. Januar 1994: Hochwasser, Sperrstunde. Seine Leine geht über den Fluss zur Glocke. | – |
| 2006 bis 2011 | Zlata lebt allein. Samstags verkauft sie Eier und Walnüsse auf der Tepa in Mostar. Jeden Fünfzehnten bringt sie Blumen unter den Quittenbaum. Seit dem Frühjahr vergisst sie Dinge. Seit Mittwochnacht, dem 23. November, träumt sie jede Nacht von dem Mädchen. | – |

**Warum diese Geschichte das Spiel ernst nimmt**

Sie stimmt Wort für Wort mit Malas Splitter [B] überein:

- Lastwagen, Mehlsäcke, Decken, Diesel;
- „Der Fahrer hat geraucht und nichts gesagt“;
- „Ein Fluss, grün und laut, tief unten“: Vom Hochufer an der Anlegestelle blickt man tief hinunter;
- „Eine Brücke, die nicht mehr da war“: die Pfeilerstümpfe von Skela;
- „Wasser.“

Sie erklärt außerdem, warum hinter dem Wasser nichts mehr kommt. Was danach geschah, hält nur Zlata, eine Lebende, und die Toten erinnern sich mit den Lebenden [B].

### 4.4 Zeit, Wetter, Kalender

Die Kapitel 1 und 2 liegen im November 2011. Kapitel 3 schließt ohne Lücke an [B]: Der Bus fährt am Donnerstagmorgen ab.

| Tag | Phase [N] | Wetter [N] | Funktion |
|---|---|---|---|
| Do 24.11. | Prolog, Tag und Nacht | Regen, warmer Jugo, der Fluss hoch und laut | Ankunft. Malas Angst ist hörbar. |
| Fr 25.11. | Erster Tag | Die Bura vertreibt den Regen. Klar und windig, man sieht bis zu den Bergen. | Die Peilung braucht klare Sicht. 25.11. ist in der Föderation Feiertag [geprüft]. Ämter sind zu [ungeprüft]. |
| Sa 26.11. | Zweiter Tag | Klar, kalt | Markttag auf der Tepa. Der Bus aus München kommt an. |
| So 27.11. | Dritter Tag, Finale in der Nacht | Für die Nacht ist Frost angesagt. Die Nacht ist sehr dunkel. | Die Feigen müssen vor dem Frost eingepackt werden. Die dunkle Nacht gleicht der vom Januar 1994 (Mondphase zu prüfen). |
| Mo 28.11. | Epilog | Grau, mild | Die Ämter sind offen. Nada kommt. |

### 4.5 Orte und ihre Funktion

Achtzehn begehbare Orte, dazu Stadtplan und Zwischenwelt, wie in den Kapiteln 1 und 2.

| Ort | Funktion im Kapitel | Real oder erfunden |
|---|---|---|
| **Ostbusbahnhof** (neben dem Bahnhof) | Ankunft. Kiosk mit Stadtplan. Tafel mit „München, subota“. Am Ende die Abfahrt mit Nada | real [geprüft, dass es ihn gibt; Fahrpläne 2011 ungeprüft] |
| **Herberge „Neretva“** (Altstadt, Ostufer) | Markos Basis: Zimmer, Terrasse über dem Fluss, Maja, die Rucksackreisenden. Hier schläft Marko, und die Phasen wechseln | erfunden |
| **Kujundžiluk** | Altstadtgasse mit Kopfstein, Läden und Touristen. Weg zur Brücke, Alltagsleben | real |
| **Alte Brücke** (Stari most) mit Springerhütte | Die falsche Annahme: „Das ist sie nicht.“ Dino. Erste Peilung. Im Epilog Malas Gang über die Brücke | real |
| **Koski-Mehmed-Pascha-Moschee**, Hof und Minarett | Zweite Peilung von oben. Ein stiller Ort | real [ob 2011 für Besucher bestiegen werden konnte, prüfen] |
| **Tepa** (Markt) | Der wandernde Anker. Zlatas Eierstand | real (Stand und Figur erfunden) |
| **Straßenbrücke** (moderne Brücke im Zentrum) | Malas erster Übergang: „Das ist keine Brücke. Das ist eine Straße mit Geländer.“ | real (welche Brücke, bei der Umsetzung festlegen) |
| **Bulevar** | Die frühere Frontlinie. Bankruine, restauriertes Gymnasium. Übergang zwischen den Stadthälften, ein stiller Moment | real |
| **Partisanenfriedhof** (Westhang) | Dritte Peilung. Ein Ort, den keiner mehr besucht. Markos Erinnerung an seinen Vater | real (Zustand 2011 prüfen) |
| **Westbusbahnhof** mit Zdravkos Café | Fall „Der Bus aus München“. Die alte Karte an der Wand. Hinweis auf Vlado | real (Café erfunden) |
| **Vulkanizer Rajić** (Westufer): Laden, Büro, Hof mit dem TAM | Vlado und Kata. Nachhall im Führerhaus. Die Schublade | erfunden |
| **Haus Zelenika** mit Feigengarten, dazu Jelas Küche | Davor, Lena, Jela. Briefe, Feigen, der Schlüssel | erfunden |
| **Vermisstenstelle** (Büro) | Epilog: Anzeige, Proben, Formular, die Frage nach dem Vater | angelehnt an das Institut für vermisste Personen BiH [Büro in Mostar 2011 prüfen] |
| **Skela, rechtes Ufer:** Anlegestelle, Hütte, Glocke, Seilanker, Pfeilerstümpfe | Lanas letzter Ort. Nachhall. Die Glocke | erfunden |
| **Skela, neue Brücke** | Übergang für die Lebenden. Spendertafel von 1998 | erfunden |
| **Skela, linkes Ufer:** Zlatas Hof, Batos Schuppen, Quittenbaum | Bato, Zlata, das Grab | erfunden |
| **Zlatas Küche** | Lanas Sterbezimmer: Herd, Radio, Schublade mit Bleistift, Skizzenbuch, Brief | erfunden |
| **Stadtplan Mostar und Umland** | Reisen. Die Peilung wird eingezeichnet | – |
| **Zwischenwelt** | Neue Bruchstücke: eine Bushaltebank mit Feigenkübel (Mate), ein Ponton an einem Seil ins Licht (Bato) | [B] Prinzip aus den Kapiteln 1 und 2 |

**Ton der Orte [N]**

- **Mostar ist warm und laut.** Touristen in Regenponchos, Rucksackreisende, die „awesome“ sagen, ein Springer, der im November für zwanzig Euro springt, Kaffee, Lamm in Jablanica.
- **Die Teilung bleibt Alltag, keine Kulisse.** Zwei Busbahnhöfe; Maja: „Sie sind der älteste Gast seit August.“; Marko verdient zwanzig Mark mit einer „Übersetzung“ vom Kroatischen ins Bosnische, und Maja sagt: „Dafür zahlen die hier wirklich Geld.“
- **Kriegsspuren erzählen nichts selbst.** Die Bankruine und der Bulevar sind Orte, an denen Mala still wird. Das Spiel erklärt dort keine Geschichte und verteilt keine Schuld nach Seiten. Es nennt keine Volkszugehörigkeiten [B] (Grundsatz aus `KAPITEL2.md` §1).

### 4.6 Die Handlung

#### Prolog – „Die Brücke, die alle kennen“ (Donnerstag, Mittag bis Nacht)

1. **Im Bus** (Erinnerungsbild, schließt an das letzte Bild von Kapitel 2 an). In Jablanica hält der Bus zwanzig Minuten, der Fahrer isst Lamm. Dann kommt die Neretva, grün. Mala zieht die Knie auf den Sitz, „als könnte das Wasser bis in den Bus kommen“.
   - Falls Marko Hajra besucht hat: Er bricht die Pita in zwei Hälften und legt eine auf den leeren Sitz neben sich. Die Frau gegenüber reicht ihm wortlos eine Serviette.
   - Mala: „Ich habe hier auf den Fluss gesehen. Vor einer Woche. Ich wusste nicht, warum.“ (Das greift `96_k2_story.js:44` auf.)
2. **Ostbusbahnhof, Regen.**
   - Die Leine zieht „flussab“. Am Kiosk kauft Marko einen Stadtplan. Auf der Tafel steht „MÜNCHEN · subota“. Mala: „Jeden Samstag nach München.“ – Marko: „Und jeden Samstag einer zurück.“
   - Nada schreibt per SMS: „Jesi li stigao? N.“ Marko kann antworten oder schweigen. Nada erinnert sich im Epilog daran.
3. **Herberge.** Maja trägt ihn ein. Das Zimmer hat ein Fenster zum Fluss. Mala geht nicht ans Fenster.
4. **Alte Brücke.**
   - Dino, 23, springt für Touristen. Spricht Marko ihn in seiner Sprache an, sagt Dino: „A, naš si.“ Dino erzählt kurz die Geschichte: gefallen im November 1993, danach eine Seilbrücke spanischer Pioniere, 2004 wieder aufgebaut [geprüft]. „Die Neretva ist im November ein Pferd, das dich nicht mag.“
   - Mala bleibt am Brückenkopf stehen und betritt die Brücke nicht. Sie sieht hinunter: „Tief unten. Grün. Laut.“ Fragt Marko „Ist sie es?“, sagt sie: „Nein. Meine hatte keine Mitte mehr. Die hier ist ganz.“
   - Das widerlegt die naheliegende Annahme, die in Kapitel 2 auch Nada nahelegt („Die Alte Brücke ist gefallen.“).
5. **Die Leine.** Am Brückenkopf sagt Mala: „Sie zeigt nicht auf die Brücke. Flussab. Aus der Stadt hinaus.“ Wer ihr am Ufer nach Süden folgt, kommt nicht weit. Mala bleibt stehen: „Weiter nicht. Nicht ohne dich. Und du gehst nicht zu Fuß bis irgendwohin.“ Marko: „Eine Richtung reicht nicht.“
6. **Terrasse, Abend.** Das erste Schlüsselgespräch, „Mich hast du nicht gefragt“ (Abschnitt 8.1). Marko verspricht Mala, sie zu fragen. Danach erscheinen an Entscheidungspunkten neue Gesprächszeilen („Was willst du?“).
7. **Nacht, kurz und freiwillig.** Mala allein an den Uferstufen, so weit die Leine reicht. Ein Springer in Badehose aus den Sechzigern springt jedes Mal, wenn die Laternen angehen. Er ist ein Geist, aber kein Fall. Mala klatscht, ohne Ton. Dann schläft Marko.

#### Erster Tag – „Die Peilung“ (Freitag)

1. **Die Peilung** (Kooperationsrätsel 1, Abschnitt 7.1).
   - Erste Messung am Brückenkopf, zweite vom Minarett. Die beiden Linien laufen fast parallel. „Wir stehen auf derselben Seite.“
   - Mala weigert sich, über den Fluss zu gehen. Sie überquert ihn schließlich doch, auf ihre Weise, über die Straßenbrücke („eine Straße mit Geländer“), mit geschlossenen Augen. „Ich halte mich an deinem Ärmel fest. Du merkst es nicht. Ich schon.“
   - Dritte Messung am Partisanenfriedhof. Der Schnittpunkt liegt außerhalb des Stadtplans.
2. **Die Glocken.** Mittags läuten die Glocken auf der Westseite. Mala ist einen Moment fort und sagt: „Zu laut.“ (Diese Reaktion ist aus den Kapiteln 1 und 2 bestätigt.) Marko: „Wann sagst du mir, was die Glocken sind?“ – „Wenn ich es weiß.“
3. **Westbusbahnhof.**
   - An der Wand von Zdravkos Café hängt eine alte Karte von 1985: „Damals wusste man noch, wo was ist.“ Der Schnittpunkt liegt an einer Flussbiegung südlich der Stadt. Daneben steht ein Brückensymbol und ein Name: **Skela**. Marko: „Skela heißt Fähre.“ Mala: „Eine Fähre.“ Sie wird unruhig. „In Split habe ich auf Boote gewartet. Jedes Mal, wenn eins getutet hat, wollte ich mit.“ Damit verbindet sie die Fährenhörner aus Kapitel 1 [B, `rooms/terminal.js:54`] mit Skela, noch bevor sie es weiß.
   - Mala sieht einen alten Mann mit Hut und Thermoskanne am Fenstertisch. Es ist **Mate Zelenika**, ein Geist. Er wartet auf den Bus aus München: „Morgen um sechs. Mein Sohn kommt.“ Der Fall „Der Bus aus München“ beginnt.
   - Mate kennt jeden: „Rajić? Der Raucher? Ist früher Mehl gefahren. Seit dem Krieg fährt er nachts nicht mehr. Vulkanizer hinter dem Bulevar.“
4. **Split am Telefon.** Marko fragt sich: Wer hat Lana in Split auf einen Lastwagen gelassen? Er ruft Sanja an, Sanja ruft Ljerka an, Ljerka ruft am Abend zurück:
   - „Die Kleine aus 31. Sie ist an einem Freitag im Januar weg, ohne Abschied. Mit Vlado, dem Raucher. Der hat für die Mostarer Mehl in die Dörfer an der Neretva gefahren. Ich habe es ihr verboten.“
   - „Unter meiner Tür lag morgens ein Bild von meinem Vater. Mit seinem Teeglas. Unterschrieben mit Mala.“
   - „Der Schlüssel von 31 fehlt seitdem.“
   - „Bei ‚Abreise‘ habe ich nichts eingetragen. Was hätte ich schreiben sollen? ‚Weggelaufen‘?“

   Das bestätigt den Schluss aus Kapitel 2 von der Seite der Lebenden: Sie ist nicht abgereist. Diese Spur und Mates Hinweis führen unabhängig voneinander zu Vlado.
5. **Vulkanizer Rajić** (Kooperationsrätsel 2, Teil 1).
   - Vlado, 64, raucht und hustet. „Ich habe nie jemanden mitgenommen. Nie.“ Kata, 29, sagt: „Mein Vater redet mit Reifen. Mit Menschen nicht.“
   - Mala geht durch den Zaun in den Hof. Am TAM unter der Plane liegt Nachhall im Führerhaus: „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“ Mala: „Er war es. Er hat die Zigarette immer noch zwischen den Zähnen.“
   - Durch die verschlossene Schreibtischschublade sieht Mala ein gefaltetes Blatt und einen Schlüssel mit Holzanhänger: „Einunddreißig.“
   - Kata will den alten Lastwagen an ein Oldtimermuseum in Graz verkaufen und hat dazu eine E-Mail auf Deutsch. Marko übersetzt. Kata braucht den Typenschein und öffnet die Schublade. Heraus fallen Zeichnung und Schlüssel.
   - Vlado sieht die Zeichnung und geht nach hinten. „Morgen. Kommen Sie morgen.“
6. **Nacht in der Herberge.** Die Australier singen auf der Terrasse. Mala: „Die singen falsch. Schön falsch.“ Ein kurzes Gespräch:
   - Mala: „Hast du deinen Vater gesucht? Damals?“ – Marko: „Nein.“ – „Warum nicht?“ – „Weil ich wusste, dass er tot ist.“ – „Woher?“ – Marko schweigt.

   Das Gespräch bereitet etwas vor und hat schon hier eine Funktion: Es zeigt Markos Widerspruch. Er sucht eine Vermisste für eine Mutter und hat den eigenen Vater nie gesucht.

#### Zweiter Tag – „Markttag“ (Samstag)

1. **Die Leine wandert.** Am Morgen sagt Mala: „Sie zeigt heute woandershin. In die Stadt.“
   - Im Notizbuch wird daraus ein Widerspruch: Gestern zeigte sie nach Skela, heute in die Altstadt. Die Hypothese ändert sich: Die Leine hängt nicht an einem Ort, sondern an einem Menschen, der heute in der Stadt ist.
   - Maja sagt beiläufig: „Samstags kommen die Leute aus den Dörfern auf die Tepa.“
   - Daraus folgt eine Handlung: zum Markt gehen und der Leine folgen.
2. **Die Tepa.** Die Leine endet an einem Stand mit Eiern und Walnüssen bei einer alten Frau mit Kopftuch: **Zlata**. Sie fröstelt in der Sonne: „Hladno je danas.“ Wie sie reagiert, hängt von Markos Frage ab:
   - Fragt er nach „Lana Delić“, sagt sie wahrheitsgemäß „Ne“. Den Namen kennt sie nicht.
   - Fragt er „ein Mädchen, siebzehn, Januar vierundneunzig“, sagt sie „Jede Mutter sucht ein Kind.“
   - Sagt er „Mala“, fällt ihr ein Ei herunter. „Ko ste vi?“ Dann packt sie zusammen und geht.
   - Mala lauscht ihr bei der Nachbarin am nächsten Stand: „Sanjam je opet. Treću noć.“ (Ich träume wieder von ihr. Die dritte Nacht.)
   - Die Leine folgt Zlata aus der Stadt.
3. **Vlado, Teil 1** (Kooperationsrätsel 2).
   - Die Zeichnung liegt auf seinem Tisch. Auf ihrer Rückseite steht: „Für später. Wenn du nach Sarajevo kommst, zeichne ich dich ohne Zigarette.“
   - Er erzählt: Freitag, 14. Januar, Split. „Sie hat gesagt, sie heißt Mala. Wie jede.“ Die Fahrt, Skela gegen 22:40, die Brücke seit dem Sommer weg, die Fähre nur bei Tag. „Ich bin um Viertel nach elf gefahren.“
   - Er sagt nicht, dass sie ihn weggeschickt hat, und nicht, dass er zurückkam.
   - Den Schlüssel 31 hat er aufgehoben: „Ihre Tasche lag noch im Führerhaus. Die Kleider habe ich verschenkt. Den Schlüssel nicht.“
   - Mala hört ihm zu und erinnert sich dabei mit, denn Vlado erinnert sich ganz [B]. Sie sagt nur: „Er ist gefahren.“ Das ist wahr und unvollständig. Fragt Marko nach, sagt sie: „Mehr will ich jetzt nicht.“
4. **Der Bus aus München** (Fall B, parallel).
   - Am Westbusbahnhof steigen Davor Zelenika (52) und seine Tochter Lena (14) aus. Mate sieht an ihnen vorbei: „Er kommt mit dem nächsten. Mein Sohn ist jung.“
   - Am Haus wartet die Nachbarin Jela mit dem Schlüssel: „Sad je došao. Kad treba prodavat.“ (Jetzt kommt er. Wenn es ums Verkaufen geht.)
   - Lena spricht Deutsch, Jela nur Herzegowinisch, und Marko übersetzt.
   - Die Feigenbäume stehen uneingepackt da. Für Sonntagnacht ist Frost angesagt.
   - Am Montag will Davor beim Notar unterschreiben.
5. **Abends ruft Nada an.** „Weißt du etwas?“ Marko kann die Wahrheit sagen („Ich habe eine Spur“), ausweichen („Noch nichts“) oder Mala fragen. Mala: „Sag ihr nichts, was du nicht weißt. Aber sag ihr nicht nichts.“

#### Zweite Nacht – „Die Glocke“ (Samstagnacht, Skela)

1. Dino fährt Marko auf dem Roller nach Skela („Für zehn Mark und eine Geschichte.“). Rechtes Ufer: die Hütte ist eine Ruine, die Glocke hängt am Pfosten, der Seilanker ist rostig, die Pfeilerstümpfe der alten Brücke stehen im Fluss. Flussauf leuchtet die neue Brücke.
2. **Bato wird gefunden.** Mala sieht drüben eine Sturmlaterne im Schuppen und einen alten Mann in Wathose. Seine Leine geht über den Fluss bis zur Glocke neben ihr. „Seine Leine hängt an der Glocke. An meiner Seite.“ Weil Mala ihn gefunden hat, sieht Marko ihn jetzt auch, von Weitem.
3. **Nachhall** (Kooperationsrätsel 3, Teil 1).
   - In der Hütte: Ein Mädchen sitzt auf einem Mehlsack und zeichnet bei einer Kerze.
   - An der Glocke: Sie läutet dreimal und ruft „Halo! Ima li koga?“.
   - Am Seilanker bleibt Mala stehen. Sie hat gesehen, wie sie ans Seil ging. „Nicht. Das ist meins.“
4. **Das Naheliegende scheitert.** Marko läutet. Drüben bewegt sich die Laterne, und Bato ruft: „Bei Nacht fährt keiner! Bei Hochwasser nicht! Wer läutet da? Soldaten? Geht!“ Ein lebender Nachbar mit Hund kommt heraus: „Die Skela fährt seit achtundneunzig nicht mehr, Herr. Da ist eine Brücke.“
5. **Marko auf dem anderen Ufer.** Mala betritt die neue Brücke nicht („Nicht hier. Nicht an dieser Stelle.“). Marko geht allein hinüber. Das geht, denn der Weg ist kürzer als „ein paar Straßen“.
   - Bato (Geist) im Schuppen: „Es ist Januar. Die Brücke ist weg. Haben Sie geläutet? Bei Nacht fahre ich nicht. Es war ein Mann. Er hat gerufen wie ein Soldat.“
   - Zlata kommt mit der Lampe heraus und erkennt ihn vom Markt: „Vi.“ Sie bittet ihn zu gehen. Dann, nach einer Pause, weil sie seit drei Nächten träumt: „Sutra. Danju.“ (Morgen. Bei Tag.)

#### Dritter Tag – „Zwei Ufer“ (Sonntag)

1. **Skela bei Tag** (Kooperationsrätsel 3, Teil 2).
   - Marko ist bei Zlata auf dem linken Ufer, Mala bleibt an der Anlegestelle auf dem rechten.
   - Zlata erzählt nur wenig: „Ja. Es gab eine Mala.“ – „Was wollen Sie von ihr? Sie gehört niemandem mehr.“ Ihr Mann? „Er hat geschlafen. Er hatte einen tiefen Schlaf. Er hat nichts gehört.“
   - Unter dem Quittenbaum liegt ein Beet mit frischen Chrysanthemen und einem Stein. Mala von drüben: „Da zieht es hin. Zu ihr. Sie steht genau da.“
   - **Die Lichtprobe:** Marko hält in jedem Fenster von Zlatas Haus sein Handylicht hoch. Mala vergleicht von drüben mit ihrem Nachhall und erkennt das kleine Dachfenster.
   - **Die Zeitleiste:** Marko legt die Nacht in Ordnung, aus Malas Nachhall, Vlados Zeiten, Batos Aussage und Zlatas Morgen. Daraus ergibt sich: Das Licht ging zwischen dem ersten und dem dritten Läuten an und vor dem letzten aus. Jemand war wach.
   - **Die Stimme:** Malas Nachhall „Halo! Ima li koga?“ ist eine Mädchenstimme. In Zlatas Küchenschublade liegt ein angekauter Bleistift. „Bato hat ihn mitgebracht, als er morgens die Decken holte. Er lag an der Glocke.“
   - **Batos Unruhe:** „Nein. Ne … Es war ein Soldat.“ Er flackert. Erkannt hat er seinen Tod noch nicht.
   - **Eine Frage für Marko:** Soll er Zlata sagen, dass ihr Mann wach war? Fragt er Mala, sagt sie jetzt noch: „Lass ihr ihren Mann.“ Am Abend wird sie anders entscheiden.
2. **Vlado, Teil 2.** Marko erzählt ihm von der Glocke, dem Licht und dem Bleistift. Da sagt Vlado alles:
   - „Sie hat mich weggeschickt. Ich wollte sie zu meiner Schwester bringen. Sie hat gesagt: Ich habe genug gewartet. Für ein ganzes Leben. Fahr.“
   - „Ich bin bis zur Kontrolle gefahren. Dann bin ich umgekehrt. Um zwei war ich wieder da. Ich habe gerufen. Da war nur der Fluss.“

   Kata hört es zum ersten Mal: „Papa. Warum hast du das nie erzählt?“ – „Weil mich keiner gefragt hat.“
3. **Der Widerspruch und das zweite Schlüsselgespräch.** Vlado sagt: „Sie hat mich weggeschickt.“ Mala hatte gesagt: „Er ist gefahren.“ Marko stellt Mala zur Rede. Das zweite Schlüsselgespräch, „Wie Großmutter“, steht in Abschnitt 8.2.
   - Mala erzählt das Seil.
   - Sie entscheidet, dass ihre Mutter alles erfahren soll.
   - Sie lässt Vlado ausrichten, dass er keine Schuld trägt. Marko richtet es mit einem Satz aus, den nur Lana und Vlado kennen: „Dann fahr still.“ Vlado: „Woher …?“ – Marko: „Ich bin Übersetzer.“
   - Vlado: „Heute Nacht fahre ich. Sie wollen nach Skela.“ Kata: „Den Lastwagen verkaufen wir nicht.“
4. **Der Bus aus München, Auflösung** (Fall B).
   - Die Briefe: Mate schrieb jedes Jahr „Smokve su rodile. Kad ćete doći?“, und Davor las darin einen Vorwurf. Im Obergeschoss steht ein Kinderzimmer, 1998 eingerichtet, mit einem deutschen Kinderbuch. Der Feigenbaum wurde 1997 gepflanzt, in Lenas Geburtsjahr. Marko übersetzt, was Mate meinte: „Das ist keine Frage nach dem Datum. Das ist eine Einladung, die sich nicht traut.“
   - Lena will ihrem Großvater etwas sagen, „in seiner Sprache“. Marko hilft beim Satz: „Došli smo, dida.“ Mate hört seine Enkelin seine Sprache sprechen und erkennt seinen Tod.
   - Jela zeigt, wie man Feigen einpackt, Davor packt ein, Lena hilft, Marko übersetzt.
   - Mate lässt den Hausschlüssel los. Der Schlüssel wird stofflich und liegt in der Astgabel. Marko gibt ihn Davor. Davor: „Ich verkaufe nicht. Noch nicht.“
   - In der Zwischenwelt sagt Marko auf Deutsch an: „Bitte einsteigen.“ Mate lacht: „Dreißig Jahre habe ich das gehört.“
   - Davor gibt Marko seine Karte: „Falls Sie mal in München sind.“
5. **Abends.** Mala: „Ich lasse ihn kommen. Ob ich ihm verzeihe, weiß ich, wenn er da ist.“ Fragt Marko jetzt noch einmal nach Zlata, sagt Mala: „Sag es ihr. Auch ihr.“

#### Finale – „Die letzte Fähre“ (Sonntagnacht)

1. **Vlado fährt nachts.** Zum ersten Mal seit 1994. Kata hat den TAM für den Verkauf flottgemacht. Unterwegs, leise: „Sie hat gesungen. Im Führerhaus. Falsch.“ Mala: „Ich habe nie falsch gesungen.“
2. **Die Glocke.** Marko läutet. Diesmal weiß Bato, wer geläutet hat. Drüben wird die Laterne angezündet, und die Geisterfähre gleitet an einem Seil, das es nicht mehr gibt, über den Fluss.
3. **Batos Erkenntnis.** Er legt an und sieht im Lampenlicht Mala. „Ti.“ … „Ich habe dich unter die Quitte gelegt. Mit diesen Händen.“ Er sieht auf seine Hände, und es folgt der Erkenntniseffekt [B, Prinzip]. „Dann bin ich …“ – Mala: „Ja.“ Bato: „Steig ein. Diesmal fahre ich.“
4. **Malas Entscheidung.** Der Spieler spielt Mala. Sie kann einsteigen oder nicht. Steigt sie nicht ein, wartet Bato: „Ich warte. Diesmal warte ich.“ Steigt sie ein, setzt er über. Der Fluss ist laut, Mala hält ihre Dose fest. Marko, Vlado und Kata gehen über die neue Brücke. Von oben sieht Marko die Fähre, die nur er sehen kann. Am linken Ufer sagt Mala: „Darum die Glocken. Ich habe geläutet, und keiner kam.“ – Marko: „Heute ist einer gekommen.“ Damit ist die Frage beantwortet, die seit Kapitel 1 offen ist [B, `rooms/ferhadija.js:21`].
5. **Linkes Ufer.** Zlata steht mit der Lampe am Schuppen. „Zvono.“ Sie hat die Glocke zum ersten Mal seit 1994 gehört. Vlado und Zlata stehen sich gegenüber. „Vi ste je doveli.“ (Sie haben sie gebracht.) – „Ja sam je ostavio.“ (Ich habe sie stehen lassen.)
6. **Zlata erzählt alles.** Den Morgen, das Schilf, die Decken, den Herd, das Radio, „Mala“, die Bitte, den Mittag, das Grab, das Brett, den Bleistift, das Skizzenbuch, den Brief von 1996. Dazu jeden Fünfzehnten. Und, als Marko es ihr sagt: „Bato war wach?“ Pause. „Dann hat er es siebzehn Jahre allein getragen. Der Dummkopf.“
7. **„Erinnerung – der Ofen“** (Malas letzte Erinnerung, Erinnerungsbild) [N]:
   - „Ein Herd. Jemand reibt meine Hände, fest, als wären sie Wäsche.“
   - „Decken, die nach Diesel riechen. Unsere Decken.“
   - „‚Kako se zoveš, dušo?‘ – ‚Mala.‘ Ich sage es, weil ich zu ihm will. Er soll mich so finden.“
   - „‚Sagt es keinem. Ich will selbst nach Hause kommen.‘“
   - „Im Radio sagt einer die Uhrzeit. Ich höre nicht mehr, welche.“

   Danach Mala: „Samstag.“ – Marko: „Samstag.“
8. **Die Leine löst sich.** Der Faden von Mala zu Zlata wird lose und treibt fort. Zum ersten Mal seit 1994 hat Mala keine Leine. Mala erinnert sich jetzt auch an die Zeit danach, so weit Marko sie mit ihr teilt: „Danach war ich bei dir. In Vratnik, im Winter. Du hast Holz gehackt. Wie ich hingekommen bin, weiß ich nicht. Dann Split. Dann hast du den Karton zugeklebt. Dann war ich leer.“ Damit ist der Widerspruch aus 1.8, Punkt 1 aufgelöst: Sie war seit 1994 bei ihm, aber leer und unsichtbar. „Seit gestern“ hieß „seit du mich siehst“.
9. **Unter dem Quittenbaum.** Mala steht an ihrem Grab, lange und ohne Musik. Dann zeigt sich, ob Marko gelernt hat zu fragen. Bietet er an: „Ich bringe dich nach Hause. Wie versprochen“, sagt sie: „Schon wieder.“ Fragt er: „Was willst du?“, sagt sie:
   - „Mama soll alles wissen. Auch das mit dem Seil. Und dass ich gesagt habe: Sag es keinem.“
   - „Wo ich liegen soll, entscheiden Mama und Zlata. Zusammen. Ich will dabei sein.“
   - „Und ihn bringe ich hinüber.“
10. **Zwischenwelt (Bato).** Ein Ponton an einem Seil, das ins Licht führt. „Bei Hochwasser braucht es zwei.“ Marko nimmt das Seil, und sie ziehen zusammen. Am Rand des Lichts sagt Bato: „Oprosti, mala.“ Mala: „Du bist gekommen. Nur später.“ Marko hört den Satz, den sie in der Drei zu ihm gesagt hat. Bato geht.
11. **Der Anruf.** Es ist zwei Uhr nachts. „Teta Nada. Ich habe sie gefunden.“ Lange Stille. „Ich komme. Mit dem ersten Bus.“
12. **Der Wendepunkt.** Mala: „Jetzt weiß ich, woran ich festgemacht bin.“ – „Woran?“ – „An dir. Diesmal habe ich es selbst gemacht.“ Ein neuer Faden geht von ihr zu ihm, heller als der alte. In Kapitel 1 sagte sie: „Wenn ich es wüsste, wäre es leichter.“ Jetzt sagt sie: „Es ist nicht leichter.“

#### Epilog – „Hin und zurück“ (Montag)

1. **Alte Brücke, Morgengrauen.** Mala betritt die Brücke und geht bis zum Scheitel. „Tief unten.“ – „Hast du Angst?“ – „Ja. Aber es ist meine.“ Dino springt zum Training. Mala lacht.
2. **Nada kommt** mit dem Bus aus Sarajevo. „Wo ist sie?“ – „In Skela. Unter einem Quittenbaum.“ Vlado fährt sie hin.
3. **Zwei Mütter.**
   - „Siebzehn Jahre. Jeden Fünfzehnten.“ – „Siebzehn Jahre. Jeden Januar ein Brief.“
   - Nada blättert im Skizzenbuch: die Treppe im Palma, eine Drei, „KUĆA“, Bruno, ein Junge mit Ohren wie ein Pokal, der Fahrer, der Fluss mit einem Licht. Auf einer Seite steht „Dubrovnik 1991“. Nada: „Unser letzter Sommer am Meer.“ Damit hat Malas Satz an der Abfahrtstafel eine Erklärung.
   - Marko erzählt alles, wie Mala es entschieden hat. Bei der Bitte um Schweigen sagt Nada: „… Das ist sie. Das ist genau sie.“ Diesen Satz sagte sie in Kapitel 2 über die Rotkreuz-Nachricht.
   - Nada zu Zlata: „Sie kommt nach Hause. Und Sie kommen zur Beerdigung. Und danach kommen Sie mich besuchen. Jeden Fünfzehnten, wenn Sie wollen.“ Zlata: „Nehmen Sie sie mit. Aber den Quittenbaum behalte ich.“
   - Mala: „Mama.“ Nada sieht nicht zum Grab, sondern auf den leeren Platz neben Marko. Sie sagt nichts. Das bleibt offen.
4. **Die Vermisstenstelle.** Frau Kolar nimmt die Anzeige des Grabes auf. Die Exhumierung muss beantragt werden. Nada gibt eine Blutprobe.
   - Marko füllt das Formular aus. Bei „Beziehung zur vermissten Person“ schreibt er: „Sie hat mich mit der Straßenbahn zur Großmutter gebracht.“ Frau Kolar: „Das passt nicht ins Feld.“ – „Dann brauche ich ein größeres Feld.“ Sie gibt ihm die Rückseite.
   - Frau Kolar: „Und Sie? Haben Sie jemanden?“ – „Meinen Vater. Zoran Vuković. Sarajevo, Frühjahr dreiundneunzig.“ – „Haben Sie eine Probe abgegeben?“ – „Nein.“ Er gibt eine ab.
   - „Lebt Ihre Mutter? Mit ihrer Probe geht es schneller. Wenn er irgendwo liegt, finden wir ihn.“
5. **Der letzte Pflichtschritt.** Marko ruft seine Mutter an. „Marko? … Ist etwas passiert?“ – „Mama. Ich komme zu Weihnachten.“ Stille. „Komm. Wir reden, wenn du hier bist. Nicht am Telefon.“
6. **Der Bus nach Sarajevo.** Das „Zurück“ der Rückfahrkarte. Nada sitzt am Fenster, Mala neben ihr, Marko eine Reihe dahinter. „Eine von beiden weiß es. Vielleicht beide.“ Dann die Karte: **„Ende des dritten Kapitels · Fortsetzung: München“**.

### 4.7 Was am Ende anders ist

- **Lanas Tod ist bekannt,** vollständig und ohne Rest. Das Grab ist gefunden, die Identifizierung beginnt.
- **Nada** weiß alles, was man wissen kann, und hat in Zlata eine Verbündete.
- **Mala** hat keine Leine mehr, die sie hält. Sie bleibt, weil sie es gewählt hat. Diese Wahl kann sie auch zurücknehmen.
- **Marko** fragt, bevor er verspricht. Er hat eine Probe für seinen Vater abgegeben und fährt zu seiner Mutter.
- **Vlado** fährt wieder nachts. **Zlata** muss kein Geheimnis mehr allein hüten. Bato und Mate sind hinübergegangen.

---

## 5. Figuren und Beziehungen

### 5.1 Marko: Bogen in Kapitel 3

Marko ist kein Anfänger mehr und zweifelt nicht mehr an Mala. Er hat sechs Fälle und Alija hinter sich [B]. Kapitel 3 nutzt, was er kann. Es stellt ihn vor ein Problem, das er mit Können allein nicht lösen kann.

| | |
|---|---|
| **Ziel** | Er will das Versprechen an Nada halten: Lana finden und „nach Hause bringen“. |
| **Innerer Widerspruch** | Er will wiedergutmachen, dass er im November 1993 nicht kam, und kommt deshalb jetzt für alle. Dabei entscheidet er über Lanas Tod, ihren Körper und ihre Geschichte, ohne sie zu fragen. Damit tut er, was Ruža ihm tat. Er übersetzt beruflich die Worte anderer und schreibt nie etwas für sich auf [B] (`97_k2_talk.js:239`: „Das ist Aufschreiben, nur mit den Wörtern von anderen.“). Er sucht eine Vermisste und hat seinen eigenen vermissten Vater nie gesucht [I]. |
| **Herausforderung** | Die Zeugen schweigen. Mala setzt Grenzen. In Bato, der nicht kam, und in Davor, der wegging und nicht zurückkam, begegnet er sich selbst. Am Ende braucht es ein Amt, Formulare und eine Blutprobe. |
| **Entscheidung** | Er gibt die Entscheidung über Lana an die zurück, denen sie gehört: an Mala, Nada und Zlata. Er schreibt zum ersten Mal in eigenen Worten. Er sucht den eigenen Vater. Er fährt zur Mutter. |

**Wo sich der Bogen im Spiel zeigt [N]**

| Moment | Spielbare Form |
|---|---|
| Nach dem ersten Schlüsselgespräch | An Entscheidungspunkten erscheint die Zeile „Mala fragen“: Zlata die Wahrheit sagen? Nada etwas sagen? Was kommt ins Formular? Wer nicht fragt, bekommt eine Reaktion („Du hast mich nicht gefragt.“) und keine Strafe. Spätere Sätze greifen das auf. |
| Malas Grab | Eine Gesprächsauswahl entweder mit dem Versprechen („Ich bringe dich nach Hause“) oder mit der Frage („Was willst du?“). Das Versprechen beantwortet Mala mit „Schon wieder.“, und die Szene geht erst weiter, wenn er fragt. |
| Die Vermisstenstelle | Ein kleines Rätsel im Formularfeld „Beziehung“. Die amtliche Wahl („Nachbarin“) ist richtig, aber zu klein. Er schreibt einen eigenen Satz. |
| Die Probe für den Vater | Die Frage von Frau Kolar kann Marko nicht übergehen. Ob er eine Probe gibt, entscheidet er selbst. Gibt er keine, sagt Mala nur: „Du suchst mich, damit du ihn nicht suchen musst.“ Er wird dann noch einmal gefragt. |
| Der Anruf bei der Mutter | Der letzte Pflichtschritt des Kapitels. |

**Markos Können im Kapitel [B, Fähigkeiten] mit [N, Anwendung]**

- **Übersetzen:** Katas E-Mail an das Museum in Graz; Lenas Postkarten an den Opa und Mates Bleistift-Übersetzungen darunter; Mates Satz „Kad ćete doći?“ (übersetzen, was er meint); Lenas Satz in Mates Mundart; die Spendertafel an der neuen Brücke; Vlados Lieferliste von 1994.
- **Mit Lebenden reden:** Vlado, Kata, Zlata, Jela, Davor, Lena, Zdravko, Dino, Maja, Frau Kolar, Ljerka und Nada am Telefon.
- **Karten lesen und peilen:** Marko hat bei seinem Vater gelernt, eine Karte zu lesen. „Er hat Brücken berechnet. Er hat mir gezeigt, wie man eine Linie zieht, die nicht wackelt.“ [N] (baut auf `rooms/vratnik.js:24` auf).
- **Schlüsse ziehen:** im Notizbuch (Abschnitt 6.4).

### 5.2 Mala: ihre eigene Agenda

Mala ist keine Hinweisgeberin und spuckt keine Erinnerungen in Serie aus. Gelöstes bleibt gelöst: Name, Herkunft, das Band zu Marko und die Busnacht werden nicht neu verhandelt.

| | |
|---|---|
| **Eigenes Ziel** | (1) Herausfinden, wer hinter dem Licht auf der anderen Seite stand und nicht kam. (2) Was am Seil geschah, für sich behalten, um Marko und sich zu schützen. (3) Später selbst entscheiden, was ihre Mutter erfährt und wo ihr Körper liegt. (4) Dem Fahrer sagen lassen, dass er keine Schuld trägt. |
| **Irrtümer** | Ihre Brücke sei die Alte Brücke. Die Leine hänge an einem Ort. Der Fährmann sei allein schuld. Verschweigen schütze Marko. |
| **Grenzen, die sie setzt** | Keine Brücken (bis sie sich die Straßenbrücke „als Straße“ erlaubt). Nicht über den Fluss an der Stelle, an der sie starb (bis zur Fähre). Über das Seil redet sie zunächst nicht („Das ist meins.“). Den Fährmann will sie zuerst nicht hinüberbringen („Den nicht.“). |
| **Selbstbestimmung** | Sie zeigt sich Bato aus eigenem Entschluss. Sie steigt selbst auf die Fähre. Sie entscheidet, was Nada erfährt. Sie bindet sich selbst an Marko. |
| **Was sie nicht bekommt** | Keine neuen Kräfte. Alles, was sie tut, beruht auf Bestätigtem [B]: Leine und Geistersicht, Spüren, Lauschen, durch Wände gehen, Hinüberbringen und die Regel, dass wer losgelassen hat, etwas hergeben kann. Neu ist nur, was folgt, weil sich die Leine in Kapitel 2 verändert hat [B]: Mala darf sich in Mostar ein Stück weiter von Marko entfernen, ohne dass es wehtut. Die Grenze von „ein paar Straßen“ bleibt. |
| **Was offenbleibt** | Kein Abschied. Ob sie in Kapitel 5 geht, entscheidet sie selbst. Kapitel 3 legt nichts fest. |

### 5.3 Der neue Beziehungskonflikt: „Wem gehört mein Tod?“

**Kern [N].** Marko hat Nada ein Versprechen über Lanas Körper gegeben, ohne Lana zu fragen. Mala beansprucht ihren Tod als ihren eigenen: die Entscheidungen jener Nacht, ihre Vergebung, ihren Ort. Das ist kein Missverständnis, das eine einzige ungestellte Frage aufklären würde. Beide haben gute Gründe:

- **Marko** will nicht noch einmal zu spät kommen.
- **Mala** will nicht, dass jemand anders über sie bestimmt, auch nicht aus Liebe.

**Stufen**

1. **„Mich hast du nicht gefragt“** (Prolog, Abschnitt 8.1). Der Konflikt wird benannt, Marko verspricht zu fragen.
2. **Die Grenze am Seil** (zweite Nacht). Mala verschweigt etwas und sagt das offen.
3. **„Den nicht“** (dritter Tag). Mala weigert sich, Bato hinüberzubringen. Marko kann sie nicht zwingen. Er kann nur zeigen, was Bato danach tat: das Grab, das Brett, den Bleistift. Er weiß selbst, wie es ist, zu spät zu kommen.
4. **„Wie Großmutter“** (dritter Tag, Abschnitt 8.2). Marko deckt das Verschwiegene auf und benennt das Muster. Mala entscheidet sich für die Wahrheit. Marko lernt, nicht für sie zu entscheiden.
5. **Am Grab.** Er fragt. Sie entscheidet. Dann bindet sie sich selbst an ihn.

**Stille Momente** (ohne Rätsel, mit Pausen und ohne Musik oder mit der Musik des Ortes):

- Pita „für zwei“ im Bus;
- die Australier, „schön falsch“;
- der Partisanenfriedhof („Hier besucht keiner mehr jemanden.“ – „Doch. Wir.“);
- Malas Knie auf dem Sitz;
- die Küche, in der sie starb;
- die Brücke im Morgengrauen;
- Nada im Bus.

**Eine Kette, in der sie voneinander lernen**

Die Peilung (Kooperationsrätsel 1). Marko lernt, Malas Wahrnehmung als Messwert zu behandeln, nicht als Gefühl. Mala lernt Markos Geduld: drei Linien statt einer und noch einmal messen, statt hinzulaufen. Mala: „Ich sehe, du misst.“ – „Und wenn es nicht passt, messen wir noch mal.“ – „Du bist so langweilig, Mali.“ – „Ich weiß.“

In der Rekonstruktion (Kooperationsrätsel 3) braucht Marko Malas Nachhall, und sie braucht seine Zeitleiste. Dabei lernt sie, dass ihre Erinnerung nicht die ganze Nacht ist.

**Ausgeschlossen**

- Keine Vertrauensanzeige, keine Punkte.
- Keine Romanze: Mala ist siebzehn, sie war die große Nachbarin, die ihm die Räder beibrachte. Das Band ist Freundschaft von der Art, die Geschwister haben, ohne verwandt zu sein.
- Keine erzwungene Trennung.

### 5.4 Die Fälle

Das Kapitel hat ein Hauptgeschehen, Lanas Nacht, und zwei Geisterfälle. Einer ist mit dem Hauptgeschehen verwoben (Bato), einer spiegelt Marko (Mate). Dazu kommt ein lebender Strang (Vlado und Kata).

| | Lanas Nacht | Fall A: „Die Glocke“ | Fall B: „Der Bus aus München“ |
|---|---|---|---|
| **Geist** | Mala/Lana († 15.1.1994, 17) | Bato Brkić, Fährmann († 2006, 71) | Mate Zelenika, früher Gastarbeiter († März 2010, 81) |
| **Ort** | Skela, Anlegestelle und Grab | Batos Schuppen am linken Ufer | Westbusbahnhof (Café), abends sein Garten |
| **Leine** | [B] früher Marko, seit der Bank Südwesten. [N] Sie hängt an Zlata, die Lanas letzte Stunden hält. | Über den Fluss zur Rufglocke, also an dem Ruf, den er nicht beantwortete | An seinem Hausschlüssel („für Davor, wenn er kommt“) |
| **Leugnen** | – (Mala weiß, dass sie tot ist) | Für ihn ist es die Nacht zum 15.1.1994, Hochwasser, Sperrstunde. Die neue Brücke sieht er nicht. Der Rufer war „ein Soldat“. | Für ihn ist es Frühjahr 2010. Den grauen Mann aus dem Bus hält er nicht für seinen Sohn („Mein Sohn ist jung.“). |
| **Irrtum** | „Meine Brücke ist die Alte Brücke.“ / „Er hat mich stehen lassen.“ | „Es war ein Mann.“ | „Mein Sohn will nicht kommen.“ |
| **Lebende** | Vlado, Kata, Zlata, Ljerka, Nada, Frau Kolar | Zlata (seine Witwe) | Davor (Sohn), Lena (Enkelin), Jela (Nachbarin), Zdravko (Wirt) |
| **Menschlicher Konflikt** | Wem gehört ein Tod? Wahrheit gegen Schonung | Schuld, die einer allein trug, und das Geheimnis einer Ehe | Wegziehen und Bleiben. Ein Vater und ein Sohn, die beide auf eine Einladung warteten |
| **Art der Ermittlung** | Peilung, wandernder Anker, Namensfrage, Zeugenfassungen | Rekonstruktion über den Fluss: Licht, Zeitleiste, Stimme | Übersetzen, was jemand meint (Briefe), ein Satz in der richtigen Mundart, ein Ritual (die Feigen) |
| **Erkennen** | – | Er sieht das Mädchen, das er begraben hat: „Mit diesen Händen.“ | Seine Enkelin spricht seine Sprache: „Došli smo, dida.“ |
| **Bereit zu gehen** | Nein (Mala bleibt) | Erst, als er die Überfahrt gemacht hat, die er 1994 verweigerte | Erst, als sein Sohn die Feigen einpackt |
| **Hinüber** (Markos letzte Handlung) | – | Mit Bato am Seil ziehen: „Bei Hochwasser braucht es zwei.“ | Die Abfahrt ansagen, auf Deutsch: „Bitte einsteigen.“ |
| **Abschluss bei den Lebenden** | Nada und Zlata. Die Identifizierung beginnt. | Zlata erfährt die Wahrheit über ihren Mann und verzeiht ihm laut. | Davor verkauft nicht. Lena nimmt einen Steckling mit nach München. |

Jeder Fall unterscheidet vier Dinge, die die Vorlage trennt:

- **einen Tod rekonstruieren:** Lanas Nacht;
- **den eigenen Zustand erkennen:** Bato, Mate;
- **eine Beziehung verstehen:** Bato und Zlata, Mate und Davor, Lana und Marko;
- **bereit sein zu gehen:** Bato, Mate. Mala nicht.

Nicht jeder Geist kannte Mala. Mate nie. Bato nur für einen Vormittag, denn sie starb in seinem Haus. Ein Zufall ist das nicht, es ist seine Anlegestelle.

**Der lebende Strang „Der Fahrer“ (Vlado und Kata) [N].** Vlado ist kein Schurke. Er schweigt aus drei Gründen:

- Er hat verbotenerweise eine Mitfahrerin genommen.
- Er hat sie allein gelassen, auch wenn sie es so wollte.
- Niemand hat ihn je gefragt.

Seit 1994 fährt er nachts nicht mehr. Kata hat das immer für eine Marotte gehalten. Abschluss: Er fährt nachts nach Skela, erzählt es seiner Tochter und behält den Lastwagen.

**Ein Nebengeist ohne Fall:** der Springer aus den Sechzigern. Er springt jeden Abend, wenn die Laternen angehen. Er ist Stimmung, kein Rätsel, und er sagt nie etwas.

### 5.5 Lebende Nebenfiguren [N]

| Figur | Alter | Ort | Stimme | Funktion, Geheimnis |
|---|---|---|---|---|
| **Vlado Rajić** | 64 | Vulkanizer, Westufer | kurze Hauptsätze, Husten, kein Nebensatz ohne Zigarette | der Fahrer von 1994. Kam um zwei zurück und hat es nie erzählt |
| **Kata Rajić** | 29 | ebenda | schnell, spöttisch, praktisch: „Mein Vater redet mit Reifen.“ | macht nachts die Notdienste, weil der Vater nicht fährt. Will den TAM verkaufen |
| **Zlata Brkić** | 74 | Skela, linkes Ufer. Samstags Tepa | redet konkret: Eier, Wetter, Wasserstand. Wird bei Gefühlen streng | hat Lana gefunden, gepflegt und begraben. Hält ein Versprechen und ein Grab. Vergisst seit dem Frühjahr |
| **Davor Zelenika** | 52 | München, jetzt im Haus des Vaters | müde, verteidigt sich, im Dialekt eingerostet | kam 2010 zu spät zum Begräbnis. Will verkaufen |
| **Lena Zelenika** | 14 | ebenda | Münchner Deutsch, Teenager: „Voll komisch hier. Aber schön komisch.“ | spricht die Sprache ihres Großvaters nicht und will einen Satz lernen |
| **Jela** | 78 | Nachbarhaus | direkt und vorwurfsvoll, füttert alle | hatte den Schlüssel und hat die Feigen im letzten Winter eingepackt. Ist wütend auf den Sohn |
| **Zdravko** | 61 | Café am Westbusbahnhof | Kellnerweisheit ohne Weisheit: „Ein Kaffee, zwei Stunden. Das war Dida Mate.“ | Erinnerung an Mate. Die alte Karte an der Wand |
| **Dino** | 23 | Brückenspringer | frech und warm, halb Englisch für Touristen | Ortskenntnis (der Fluss, der Roller). Will vielleicht weg, wie alle |
| **Maja** | 28 | Herberge „Neretva“ | knapp, freundlich, Englisch mit Australiern | Alltag, Hinweise auf den Markt, der Witz über das Übersetzen |
| **Frau Kolar** | um 50 | Vermisstenstelle | genau, menschlich, ohne Pathos: „Wir sind keine Richter. Wir zählen.“ | der amtliche Weg. Fragt Marko nach seinem Vater |
| **Ljerka Lalić** [B] | 56 | Split, Telefon | stolz, wehmütig | weiß, mit wem Lana fuhr. Hat Brunos Bild. Ließ „Abreise“ leer |
| **Nada Delić** [B] | 61 | Sarajevo, am Ende in Mostar | scharf, müde, sagt, was sie denkt | die Mutter. Entscheidet mit Zlata. Ahnt vielleicht etwas |
| **Sanja, Vesna, Hajra, Ana** [B] | – | Telefon | wie in den Kapiteln 1 und 2 | Sanja vermittelt Ljerka. Vesna fragt nach „Die Stillen, Teil zwei“ (optional). Hajra ruft wegen der Pita an (optional). Ana gehört zu Kapitel 4. |

Die Namen sind vorläufig. Bei der Ausarbeitung mit Muttersprachlern prüfen, dass sie für Region und Zeit stimmen und keine realen Personen treffen (10.4).

---

## 6. Spielbare Struktur und Rätselabhängigkeiten

### 6.1 Phasen [N]

| Phase | Titelkarte | Abschnitt |
|---|---|---|
| `k3_pro` | „Kapitel 3 · Mostar · Prolog – Die Brücke, die alle kennen · Donnerstag, 24. November 2011 · Mittag“ | Ankunft bis Terrasse |
| `k3_pro_n` | „In der Nacht · Donnerstag · spät“ | Malas Uferstufen (kurz, freiwillig) |
| `k3_d1` | „Erster Tag – Die Peilung · Freitag, 25. November · Bura“ | Peilung, Mate, Ljerka, Vlado (Leugnen) |
| `k3_d1_n` | „Freitag · Nacht“ | Herberge, Vatergespräch |
| `k3_d2` | „Zweiter Tag – Markttag · Samstag, 26. November · klar“ | Wandernder Anker, Zlata, Vlado Teil 1, Bus aus München |
| `k3_d2_n` | „Die Glocke · Samstag · Nacht“ | Skela, rechtes Ufer, und Bato |
| `k3_d3` | „Dritter Tag – Zwei Ufer · Sonntag, 27. November · Frost angesagt“ | Rekonstruktion, Vlado Teil 2, Schlüsselgespräch 2, Mate |
| `k3_fin_n` | „Finale – Die letzte Fähre · Sonntag · Nacht“ | Glocke, Fähre, Zlata, Grab, Zwischenwelt, Anruf |
| `k3_epi` | „Epilog – Hin und zurück · Montag, 28. November“ | Brücke, Nada, Vermisstenstelle, Mutter, Bus |

Die Phasen wechseln beim Schlafen in der Herberge oder durch eine Szene, wie in Kapitel 2 [B, Prinzip]. Das Finale beginnt erst, wenn die drei Sonntagsstränge abgeschlossen sind: Rekonstruktion, Vlado Teil 2 und Mates Übergang. Das Spiel sagt das offen: „Heute Nacht um elf hole ich Sie ab.“ – „Vorher muss ich noch zu den Feigen.“

### 6.2 Rätselketten (Überblick)

| Nr. | Kette | Schritte | Wechsel Marko/Mala | Ergebnis |
|---|---|---|---|---|
| P1 | Ankunft und Karte | 3 | – | Stadtplan, erste Leinenrichtung |
| P2 | Die Alte Brücke ist es nicht | 3 | M→G→M | Notiz „Nicht die Alte Brücke“, Hypothese gewechselt |
| P3 | „Mich hast du nicht gefragt“ | Gespräch | – | Versprechen, die Zeile „Mala fragen“ wird freigeschaltet |
| M1 | **Die Peilung** (Kooperation 1) | 9 | 5 | Skela |
| M2 | Split am Telefon (Sanja → Ljerka) | 4 | – | Vlado, Freitag, Schlüssel 31, Brunos Bild, leere „Abreise“ |
| M3 | **Der Fahrer** (Kooperation 2): Leugnen, Nachhall, Schublade, Kata, Teil 1, Teil 2 | 12 | 6 | Vlados ganze Fassung, Malas Wahrheit, Vlado fährt |
| M4 | Der wandernde Anker | 3 | G→M | „Ein Mensch, kein Ort“ |
| M5 | Zlata auf der Tepa (Namensfrage) | 3 | M→G | „Die Eierfrau kennt eine Mala“, „Sie träumt“ |
| M6 | Skela, rechtes Ufer bei Nacht | 5 | 3 | Bato gefunden, Nachhall, die Glocke scheitert |
| M7 | Skela, linkes Ufer | 4 | 2 | Zlatas „Er hat geschlafen“, das Grab |
| M8 | **Die Nacht rekonstruieren** (Kooperation 3) | 8 | 5 | „Er war wach“, „Es war das Mädchen“ |
| M9 | Der Name | 3 (Schlüsse) | – | „Nur ich wusste, wer Mala ist“ |
| M10 | Die letzte Fähre (Finale) | 8 | 4 | Batos Erkenntnis, Überfahrt, Zlatas Erzählung, Leine frei |
| M11 | Grab und Zwischenwelt (Bato) | 4 | 2 | Malas Entscheidungen, Bato geht |
| M12 | Epilog: Nada, Vermisstenstelle, Mutter | 6 | 1 | Proben, Formular, Anruf |
| B1 | Der Wartende | 3 | G→M | Mate gefunden, Hinweis auf Vlado |
| B2 | Ankunft aus München | 2 | – | Davor und Lena, Mate erkennt sie nicht |
| B3 | Jela und das Haus | 4 | – | Übersetzen zwischen Lena und Jela, der Schlüssel zum Haus |
| B4 | Die Briefe | 4 | M→G→M | „Eine Einladung, die sich nicht traut“ |
| B5 | Lenas Satz | 3 | M→G | Mates Erkenntnis |
| B6 | Die Feigen | 4 | 2 | Schlüssel stofflich, Zwischenwelt |
| S1 | Dino (optional) | 2 | – | Alternative Spur zu Skela über die Strömung |
| S2 | Vesna (optional) | 1 | – | Marko schreibt, mit Malas Erlaubnis |
| S3 | Hajra, Pita (optional) | 1 | – | stiller Moment |
| S4 | „Zwei Sprachen“ (optional) | 2 | – | Humor, zwanzig Mark |

Das sind 25 Ketten (Kapitel 2 laut Entwurf: 24 [B, `KAPITEL2.md`]). Die drei Kooperationsrätsel stehen in Abschnitt 7.

### 6.3 Abhängigkeiten

```
PROLOG   Ankunft ─ Herberge ─ Alte Brücke („nicht die“) ─ Leine „flussab“ ─ Gespräch 1 ─ (Nacht) ─ Schlaf

TAG 1    M1 Peilung:  Brückenkopf ┐
                      Minarett ───┴─ „parallel“ ─ Übergang West (Straßenbrücke) ─ Partisanenfriedhof ─┐
         B1 Mate am Westbusbahnhof ───────────────────────────────────────────── Karte bei Zdravko ◄─┘ ─► SKELA
              └─► Hinweis „Vlado, Vulkanizer“ ─┐
         M2 Sanja → Ljerka (abends) ───────────┴─► M3a Vulkanizer: Leugnen │ Nachhall Führerhaus │ Schublade
                                                    └─ Kata + Übersetzung ─► Zeichnung, Schlüssel 31 ─► „Morgen“
TAG 2    M4 Leine wandert (+ Skela) ─► „ein Mensch“ ─(Maja: Markt)─► M5 Tepa: Zlata ─┐
         M3b Vlado, Teil 1 (Name „Mala“, 23:15) ─────────────────────────────────────┤ (beliebige Reihenfolge)
         B2/B3 Davor, Lena, Jela ─► B4 Briefe (bis Sonntag) ─────────────────────────┤
NACHT 2  M6 Skela rechts: Nachhall │ Glocke scheitert │ Bato gefunden ─► Marko drüben: Bato („Soldat“), Zlata („Morgen.“)
TAG 3    M7/M8 Skela, zwei Ufer: Lichtprobe ─ Zeitleiste ─ Bleistift ─► „wach“ + „Mädchen“ ─► Bato unruhig
         M3c Vlado, Teil 2 („weggeschickt“, „um zwei zurück“) ─► Widerspruch ─► Gespräch 2 ─► Malas Botschaft ─► Vlado fährt
         B5 Lenas Satz ─► Mate erkennt ─► B6 Feigen ─► Schlüssel ─► Zwischenwelt (Mate)
FINALE   [M8 + M3c + B6] ─► Fahrt ─► Glocke ─► Bato erkennt ─► (Mala steigt ein) ─► Zlata erzählt
                            ─► Erinnerung „Ofen“ ─► Leine frei ─► Grab: Fragen ─► Zwischenwelt (Bato) ─► Anruf Nada
EPILOG   Brücke ─► Nada ─► Skela (zwei Mütter) ─► Vermisstenstelle (Proben, Formular, Vater) ─► Anruf Mutter ─► Bus
```

**Parallele Spuren**

- **Tag 1:** Peilung und Vlado-Spur laufen in beliebiger Reihenfolge. Zu Vlado führen zwei unabhängige Wege, Mate und Ljerka.
- **Tag 2:** Markt, Vlado und der Bus aus München sind frei kombinierbar.
- **Tag 3:** Die drei Sonntagsstränge sind frei kombinierbar.

### 6.4 Das Notizbuch als Ermittlung

Wie in Kapitel 2 [B]: A + B = C, C + D = E, Widersprüche als eigene Notizen, Antworten je Figur bei falschen Kombinationen. Geplant sind 28 Schlüsse (Kapitel 2: 24 [B]). Die tragenden:

| Schluss | aus | Folge im Spiel |
|---|---|---|
| **„Eine Brücke, die keiner gezählt hat“** | „Nicht die Alte Brücke“ + Malas Splitter (`f2_bridge`) | Die Hypothese wechselt, die Peilung beginnt |
| **„Wir stehen auf derselben Linie“** | Messung 1 + Messung 2 | Eigene Antwort für den Fehlschlag. Marko braucht eine Messung vom Westufer |
| **„Skela heißt Fähre“** | Schnittpunkt + alte Karte | Skela erscheint auf dem Stadtplan |
| **„Ein Mensch, kein Ort“** | Skela + „Die Leine zeigt heute in die Stadt“ | Hypothesenwechsel. Zusammen mit Majas Satz: zum Markt |
| **„Nur ich wusste, wer Mala ist“** | Vlado: „Sie sagte, sie heißt Mala“ + „Ich habe ihr den Namen gegeben“ (`f2_memory`) | Eine Zeile für Marko, die ihn trifft (siehe unten) |
| **„Man suchte Lana. Man hätte Mala finden müssen.“** | „Nur ich wusste …“ + Nada: „Wir suchen noch“ (`f2_missing`) | Nadas siebzehn Jahre bekommen einen Grund. Am Markt fragt Marko nach „Mala“ |
| **„Wer hat wen stehen lassen?“** (Widerspruch) | Vlado: „Sie hat mich weggeschickt“ + Mala: „Er ist gefahren“ | Lässt sich mit Mala ansprechen und löst das zweite Schlüsselgespräch aus |
| **„Jemand war wach“** (Widerspruch) | Lichtprobe „0:20 an, 0:40 aus“ + Zlata: „Er hat geschlafen“ | Spricht man Bato damit an, wird er unruhig |
| **„Es war das Mädchen“** | Nachhall „Halo! Ima li koga?“ + Bleistift an der Glocke | Die Glocke wirkt in der Finalnacht |
| **„Eine Einladung, die sich nicht traut“** | Mates Briefe + Kinderzimmer von 1998 | Davor sieht seinen Vater anders. Jela gibt nach |
| **„Du suchst mich, damit du ihn nicht suchen musst“** | Vatergespräch (Nacht 1) + Frau Kolars Frage | Malas Satz, falls Marko die Probe verweigert |

**Ein mehrstufiger Schluss: der Anker**

1. **Hypothese:** Die Leine zeigt zum Ort ihres Todes.
2. **Bestätigung:** Die Peilung führt nach Skela.
3. **Widerspruch:** Am Samstag zeigt die Leine in die Stadt.
4. **Änderung:** Sie hängt an einem Menschen.
5. **Handlung:** Marko folgt der Leine über den Markt.
6. **Bestätigung:** Zlata zuckt beim Namen „Mala“.

Ein zweiter mehrstufiger Schluss betrifft den Namen. Hypothese: Man fand sie nicht, weil keiner suchte. Änderung: Man suchte unter dem falschen Namen. Handlung: mit „Mala“ fragen.

**Gespräche ändern sich mit neuem Wissen [N, Beispiele]**

- **Zlata:** Auf „Lana Delić“ sagt sie „Ne“. Auf das Mädchen von siebzehn sagt sie „Jede Mutter sucht ein Kind“. Auf „Mala“ fällt das Ei. Zeigt Marko ihr Lanas Foto von 1988, sagt sie: „Das ist ein Kind. Ich kenne keine Kinder mehr.“ Zeigt er die Zeichnung von Vlado, setzt sie sich hin. Fragt er nach der Glocke, kommt nach dem Finale: „Zvono.“
- **Vlado:** Auf das Foto von 1988 sagt er: „Das ist ein Kind.“ Auf die Zeichnung schweigt er. Auf den Schlüssel 31 erzählt er Teil 1. Auf Glocke, Licht und Bleistift erzählt er Teil 2.
- **Bato:** Wer ihm direkt sagt, er sei tot, wird nicht gehört [B, Regel]: „Was? Der Fluss ist zu laut.“ Auf „Es war ein Mädchen“ ohne Beweis sagt er: „Ein Mädchen läutet nicht um Mitternacht.“ Mit Bleistift und Lichtprobe wird er unruhig.

**Fehlversuche mit eigener Antwort [N, Beispiele]**

- Bei Tag läuten: Der Nachbar sagt: „Die Skela fährt seit achtundneunzig nicht mehr.“
- Nachts vor der Rekonstruktion läuten: Bato ruft: „Bei Hochwasser nicht!“
- Nur Ost-Messungen auf der Karte: „Zwei Linien, die sich nicht treffen wollen. Wie hier alle.“
- Mala auf die Alte Brücke drängen: „Nein. Frag mich nicht noch mal.“ Danach fragt Marko nicht mehr, und die Zeile verschwindet.
- Lenas Satz mit „djede“: Mate sagt: „Djede? Wer sagt hier djede? Bin ich der Bischof?“
- Lenas Satz auf Deutsch: Mate sagt: „Schön. Aber das ist nicht für mich.“

**Hinweise auf Wunsch:** drei Stufen je offenem Problem wie in Kapitel 2 [B, `15_k2_hints.js`]. Erst erinnert der Hinweis an das Problem, dann nennt er Ort, Person oder Ding, dann gibt er einen konkreten Denkanstoß. Ziel sind wieder mindestens 50 Themen. Beispiel Peilung:

1. „Malas Leine zeigt eine Richtung. Aber nicht, wie weit.“
2. „Zwei Richtungen von zwei Orten, die weit auseinanderliegen, schneiden sich irgendwo.“
3. „Eine Messung vom Westufer fehlt. Mala geht über keine Brücke, aber vielleicht über eine Straße.“

### 6.5 Fairness und Tempo

- **Keine Pixelsuche.** Was zählt, nennt eine Figur. Die Leine zeigt Mala im Gespräch an („Sie zeigt heute woandershin“), nicht als winziges Bilddetail.
- **Keine versteckten Bedingungen.** Was das Finale verlangt, sagt Vlado offen. Alles, was zwingend ist, wird im Gespräch gefordert.
- **Keine Sackgassen ohne Rückweg.**
  - Wer Vlado vergrault (mit „Nada sucht sie“ zu früh), dem öffnet Kata den Weg wieder („Er kommt morgen wieder runter. Er kommt immer wieder runter.“).
  - Wer Zlata auf dem Markt verliert, findet sie in Skela.
  - Die Glocke lässt sich jederzeit läuten, mit jeweils eigener Antwort.
  - Die Feigen frieren nicht, solange der Fall offen ist. Der Frost kommt erst in der Finalnacht.
- **Optionales bleibt optional.** Dino, Vesna, Hajra und der Übersetzungswitz liefern nichts Zwingendes. Dinos Strömungswissen ist ein zweiter Weg zu einer Einsicht, die auch der Hauptweg liefert.
- **Zeitdruck ohne Reflex.** Der Druck ist erzählt: Zlata vergisst, Frost ist angesagt, Nada wartet. Es gibt keine tickende Uhr, keine Reaktionsprobe und keine Szene, die man verpassen kann. Der Bus aus München kommt, wenn Marko am Samstag zum ersten Mal am Westbusbahnhof ist („Er hatte Verspätung. Er hat immer Verspätung.“).

### 6.6 Umfang im Vergleich mit Kapitel 2

Kapitel 2 ist gemessen [B, `BERICHT_K2.md` §4]. Die Werte für Kapitel 3 sind Planziele [N].

| Größe | Kapitel 2 (gemessen) | Kapitel 3 (Ziel) |
|---|---|---|
| Begehbare Orte | 18 + Stadtplan + Zwischenwelt | 18 + Stadtplan + Zwischenwelt |
| Dialog- und Erzählzeilen | 2032 (davon Mala 437) | ≥ 2100 (davon Mala ≥ 450) |
| Beschreibungen („Schau an“) | 564 | ≥ 560 |
| Gesprächsoptionen | 308 | ≥ 320 |
| Schlüsse im Notizbuch | 24 | 28 |
| Rätselketten | 24 (laut Entwurf) | 25 |
| Rätsel-Overlays | 7 | 7 (vorhandene Typen, dazu die Kartenansicht der Peilung) |
| Erinnerungs- und Nachhallszenen | 23 | ≥ 20 |
| Gemalte Erinnerungsbilder | 22 | ≥ 18 |
| Dokumente | 17 | ≥ 18 |
| Hinweise | 50 × 3 | ≥ 50 × 3 |
| Musikstücke / Klangkulissen | 12 / 18 | ≥ 10 neue / ≥ 16 |

**Spielzeit, geschätzt und nicht gemessen.**

- Kapitel 2 wird auf 4 bis 5 Stunden geschätzt [B, `web/LIESMICH.txt`, dort als Schätzung]. Sein automatischer Durchlauf hat 67 Schritte und 95 bis 100 Minuten Spieltakt.
- Kapitel 3 kommt nach der Kettenplanung auf etwa 70 bis 75 Schritte.
- Gleiches Verhältnis angenommen, ergibt das **4,5 bis 5,5 Stunden** für Menschen.

Diese Zahl ist eine begründete Schätzung. Sie muss in einem echten Spieltest bestätigt werden.

### 6.7 Die ersten 15 bis 20 Minuten

| Minute (ca.) | Szene | Was der Spieler tut | Was er versteht | Was möglich wird |
|---|---|---|---|---|
| 0:00 | Titelkarte. Erinnerungsbild „Im Bus“: Jablanica, Lamm, der Fluss, Malas Knie, Pita für zwei | schaut, klickt weiter | Mala hat Angst vor dem Fluss. Sie spürt etwas an dieser Stelle | – |
| 1:30 | Ostbusbahnhof im Regen. Kiosk, Tafel „MÜNCHEN · subota“, Taxifahrer, Nadas SMS | kauft den Stadtplan, liest die Tafel, antwortet Nada oder nicht | Malas Leine zieht flussab. Nada wartet | Stadtplan mit drei Orten |
| 4:00 | Herberge: Maja, das Zimmer, die Australier | trägt sich ein, legt die Džezva aufs Fensterbrett | Ein Ort zum Schlafen. Mala meidet das Fenster | Herberge als Basis |
| 6:30 | Kujundžiluk, Regen, Touristen | schaut sich um, spricht mit einem Händler | Mostar lebt | Weg zur Brücke |
| 8:00 | Alte Brücke: Dino springt (nicht), erzählt | redet mit Dino, auf Englisch oder in der Landessprache | Geschichte der Brücke [geprüft]. Der November-Fluss | Notiz „Die Brücke fiel 1993“ |
| 10:00 | Mala am Brückenkopf | fragt sie, sieht mit ihr hinunter | „Nicht die.“ Die naheliegende Annahme ist falsch | Hypothesenwechsel im Notizbuch |
| 12:00 | Die Leine | folgt ihr am Ufer nach Süden, Mala bleibt stehen | „Eine Richtung reicht nicht.“ | Idee der Peilung (Tag 1) |
| 14:00 | Terrasse am Abend: Gespräch 1 | führt das Gespräch, wählt eine Antwort | Der Konflikt: Wem gehört Lanas Tod? | Die Zeile „Mala fragen“ an Entscheidungspunkten |
| 18:00 | Nacht: Mala an den Uferstufen, der Springer aus den Sechzigern | spielt Mala, sieht zu, klatscht | Auch hier gibt es Tote, die nichts wollen | Schlafen, Freitag |

---

## 7. Drei Kooperationsrätsel, ausgearbeitet

Alle drei Rätsel nutzen nur bestätigte Fähigkeiten [B]: Malas Sicht auf Leinen und Geister, Spüren und Lauschen, Durchgehen durch Wände, die Grenze von „ein paar Straßen“. Dazu kommen Markos Karten, Gespräche und Notizbuch. Gewechselt wird so wie in den Kapiteln 1 und 2 [B]: durch Antippen der Figur oder des Wechselknopfs.

### 7.1 Kooperationsrätsel 1 – „Die Peilung“ (Raum und Wahrnehmung)

**Ausgangslage.** Freitagmorgen, Bura, klare Sicht. Mala sieht ihre Leine, kann aber keine Karte halten und hat kein Gefühl für Entfernung („Für mich ist nichts weit“, [B] `97_k2_mala.js`, Prolog Kapitel 2). Marko hat einen Stadtplan und einen Bleistift vom Kiosk, sieht die Leine aber nicht [B].

**Ziel.** Herausfinden, wo die Leine endet.

**Voraussetzungen.** Notiz „Eine Richtung reicht nicht“ (Prolog). Stadtplan.

**Schritte und Wechsel**

1. **[G] Brückenkopf am Ostufer.** Mala beschreibt, wohin die Leine zeigt, und zwar nur über Landmarken: „Links am Glockenturm vorbei, rechts vom zweiten Kran.“ Marko kann sie nicht sehen.
2. **[M] Erste Linie.** Marko zeichnet sie ein. Auf der Kartenansicht wählt der Spieler die beiden Landmarken, die Mala genannt hat. Die Linie zieht die Ansicht dann selbst, ohne genaues Ziehen mit dem Finger.
3. **[M] Minarett.** Marko zahlt am Minarett der Koski-Mehmed-Pascha-Moschee und steigt die Treppe hinauf. Wechsel zu **[G]**: Mala geht durch die Treppenwand voraus. „Wie viele Stufen? – Für mich keine.“
4. **[G] Oben.** Mala beschreibt die zweite Richtung über die Dächer.
5. **[M] Zweite Linie.** Sie läuft fast parallel zur ersten. Notiz „Wir stehen auf derselben Linie“, dazu die eigene Fehlschlagsantwort (6.4). Marko: „Ich brauche eine Messung von drüben.“
6. **[M→G] Über den Fluss.**
   - Mala weigert sich, über die Alte Brücke oder überhaupt über den Fluss zu gehen.
   - Lässt Marko sie stehen und geht allein, zieht die Leine nach „ein paar Straßen“. Er muss zurück.
   - Über die Straßenbrücke kommt sie mit: „Das ist keine Brücke. Das ist eine Straße mit Geländer.“ Sie geht mit geschlossenen Augen. Wechsel zu **[G]**: Der Spieler führt Mala Schritt für Schritt hinüber. Bleibt er stehen, öffnet sie die Augen und erstarrt einen Herzschlag lang. Ohne Strafe, aber spürbar.
7. **[G] Partisanenfriedhof, Westhang.** Dritte Richtung. Mittags läuten die Glocken der Westseite. Mala ist für einen Moment fort: „Zu laut.“ Der Spieler muss warten, bis sie wieder da ist. Diese Pause bereitet die Auflösung vor.
8. **[M] Der Schnittpunkt.** Linie 1 und Linie 3 schneiden sich südlich der Stadt, außerhalb des Stadtplans. Notiz „Der Schnittpunkt liegt hinter dem Kartenrand“.
9. **[M] Westbusbahnhof.** An Zdravkos Wand hängt die alte Karte. Marko überträgt die Linien. Der Schnittpunkt liegt an einer Flussbiegung, daneben steht ein Brückensymbol und der Name **Skela**. Schluss „Skela heißt Fähre“.

**Hinweise** (auf Wunsch, drei Stufen, siehe 6.4).

**Zwischenschlüsse.** „Nicht die Alte Brücke“ → „Die Leine zeigt aus der Stadt“ → „Zwei Linien vom selben Ufer reichen nicht“ → „Der Schnittpunkt liegt außerhalb“ → „Skela“.

**Ergebnis.** Skela erscheint auf dem Stadtplan. Mala wird unruhig, als sie den Namen hört.

**Wirkung.**

- **Malas erster Übergang über einen Fluss.** Das ist ein Teil ihres Bogens.
- **Der Fall „Der Bus aus München“ beginnt**, weil Marko für die Karte zum Westbusbahnhof muss.
- **Die Glockenpause.** Sie hat eine Funktion für die spätere Antwort.

**Warum keiner allein.** Mala sieht die Richtung, kann sie aber nicht festhalten und nicht messen. Marko kann messen und sieht nichts.

**Warum das Naheliegende scheitert.**

- **Der Leine folgen:** Mala kommt ohne Marko nicht weit. Marko kann nicht zu Fuß an einem Faden entlang über Land laufen, der durch Häuser und über den Fluss geht.
- **Leute fragen:** „Wo ist 1994 ein Mädchen ertrunken?“ bringt nichts: „Hier sind viele ertrunken, Herr.“
- **Zwei Messungen vom selben Ufer:** Sie ergeben eine Linie, keinen Punkt.

**Umsetzung in der vorhandenen Engine.** Die Kartenansicht ist ein Bild, das eine Zeichenfunktion erzeugt, wie die Erinnerungsbilder [B, `A.memory` mit `draw`]. Die Wahl der Landmarken läuft über ein Auswahl-Overlay wie `A.puzzle` [B]. Eine neue Architektur ist nicht nötig. Ob die Kartenansicht ein eigener Overlay-Typ wird (wie `arrange`, `halves`, `glyphs` [B]), entscheidet die Umsetzung.

### 7.2 Kooperationsrätsel 2 – „Zwei Fassungen“ (Gespräch und Widerspruch)

**Ausgangslage.** Freitagnachmittag, Vulkanizer Rajić. Vlado leugnet alles. Kata ist genervt von ihrem Vater und braucht ihn trotzdem.

**Ziel.** Vlados ganze Fassung der Nacht. Zuletzt, unerwartet: Malas ganze Fassung.

**Voraussetzungen.** Hinweis auf Vlado, von Mate oder von Ljerka (eine der beiden Quellen genügt).

**Schritte und Wechsel**

1. **[M] Vlado.** „Ich habe nie jemanden mitgenommen. Nie.“
   - Zeigt Marko Lanas Foto von 1988: „Das ist ein Kind.“
   - Sagt er zu früh „Ihre Mutter sucht sie“: Vlado macht den Laden zu. Kata öffnet den Weg am nächsten Morgen wieder.
2. **[G] Der Hof.** Mala geht durch den Zaun zum TAM unter der Plane. Spüren im Führerhaus ergibt den Nachhall „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“ Notiz „Sie hat ihn gezeichnet“. Mala erkennt ihn: „Er war es. Er hat die Zigarette immer noch zwischen den Zähnen.“
3. **[G] Das Büro.** Mala steckt den Kopf durch die verschlossene Schublade: „Ein gefaltetes Blatt. Und ein Schlüssel mit Holzanhänger. Einunddreißig.“ Notiz „Die Schublade“.
4. **[M] Kata.** Sie hat eine E-Mail auf Deutsch von einem Oldtimermuseum in Graz. Marko übersetzt in einer kleinen Auswahl, bei der österreichische Begriffe zählen: „Typenschein“ ist nicht „Typenschild“, „Zulassung“ ist nicht „Zulassen“. Für den Typenschein öffnet Kata die Schublade. Zeichnung und Schlüssel fallen heraus.
5. **[M] Vlado sieht beides.** „Morgen.“ Ende von Tag 1.
6. **[M] Teil 1** (Samstag). Die Fahrt, „Sie hat gesagt, sie heißt Mala. Wie jede.“, Skela gegen 22:40, „Ich bin um Viertel nach elf gefahren.“ Die Tasche, der Schlüssel.
7. **[G] Mala hört mit und erinnert sich mit** [B, Regel: „Wir Toten erinnern uns mit den Lebenden“]. Sie sagt: „Er ist gefahren.“ Fragt Marko nach, sagt sie: „Mehr will ich jetzt nicht.“ Das ist eine offen benannte Grenze, keine Lüge.
8. **[M] Teil 2** (Sonntag, nach der Rekonstruktion in Skela). Glocke, Licht und Bleistift bringen ihn zum Reden: „Sie hat mich weggeschickt.“ Und: „Um zwei war ich wieder da.“
9. **[M] Widerspruch im Notizbuch.** „Wer hat wen stehen lassen?“ aus Vlados „Sie hat mich weggeschickt“ und Malas „Er ist gefahren“.
10. **[M→G] Mala ansprechen.** Das zweite Schlüsselgespräch (8.2). Mala erzählt das Seil und gibt Marko eine Botschaft für Vlado.
11. **[M] Die Botschaft überbringen.** Marko kann nicht sagen: „Ein Geist lässt Ihnen ausrichten …“. Er braucht einen Satz, den nur Lana und Vlado kennen. Er wählt aus dem, was er weiß:
    - „Für später.“: Das steht auf der Zeichnung, Vlado kennt es schon. Er sagt: „Das haben Sie gelesen.“
    - „Fahr.“: „Das kann jeder sagen.“
    - **„Dann fahr still.“** aus dem Nachhall im Führerhaus: „Woher …?“ – „Ich bin Übersetzer.“
12. **[M] Folge.** Vlado: „Heute Nacht fahre ich. Sie wollen nach Skela.“ Kata: „Den Lastwagen verkaufen wir nicht.“

**Hinweise.**

1. „Vlado redet nicht mit mir. Vielleicht redet sein Hof.“
2. „Kata braucht etwas aus dieser Schublade. Und sie braucht einen Übersetzer.“
3. „Vlado und Mala erzählen dieselbe Nacht. Nicht gleich. Im Notizbuch beides zusammen ansehen.“

**Zwischenschlüsse.** „Sie hat ihn gezeichnet“ → „Er hat ihre Sachen behalten“ → „Sie nannte sich Mala“ → „Nur ich wusste, wer Mala ist“ → „Wer hat wen stehen lassen?“ → „Sie ist selbst gegangen“.

**Ergebnis.** Vlados vollständige Fassung. Malas vollständige Fassung. Vlado ist von der Schuld frei, und er fährt.

**Warum keiner allein.**

- **Marko allein** bekommt nur Leugnen. Ohne Malas Nachhall weiß er weder von der Zeichnung noch vom Satz im Führerhaus.
- **Mala allein** kann weder mit Vlado reden noch die Schublade öffnen. Ohne Markos Notizbuch bleibt auch ihre eigene Lücke unbenannt.

**Warum das Naheliegende scheitert.**

- **Das Foto:** Es zeigt Lana mit zwölf, Vlado kennt sie mit siebzehn.
- **Druck:** „Ihre Mutter sucht sie“ treibt ihn in die Werkstatt zurück.
- **„Fahr.“ als Beweis:** Den Satz könnte jeder sagen.

### 7.3 Kooperationsrätsel 3 – „Die Nacht an der Fähre“ (Nachhall und Rekonstruktion)

**Ausgangslage.** Sonntag in Skela, bei Tag.

- **Mala** steht am rechten Ufer, bei Hütte, Glocke und Seilanker. Dort liegt ihr Nachhall. An dieser Stelle geht sie nicht über den Fluss.
- **Marko** ist am linken Ufer bei Zlata, im Hof, bei Batos Schuppen und am Haus mit dem Dachfenster.
- **Bato** (Geist) leugnet und erinnert sich falsch.
- **Zlata** glaubt, ihr Mann habe geschlafen.

**Ziel.**

- die Nacht vom 14. auf den 15. Januar 1994 vollständig ordnen;
- Batos Irrtum korrigieren (Soldat oder Mädchen);
- belegen, dass er wach war;
- die Glocke für die Finalnacht vorbereiten.

**Voraussetzungen.** Nacht 2: Bato gefunden, Nachhall an Hütte und Glocke. Zlatas „Morgen. Bei Tag.“ Vlados Teil 1 (Ankunft 22:40, Abfahrt 23:15).

**Schritte und Wechsel**

1. **[M] Zlata.** Das Gespräch hat Grenzen: „Ja. Es gab eine Mala.“ – „Er hat geschlafen. Er hatte einen tiefen Schlaf.“ Notiz „Zlata: Er hat geschlafen“.
2. **[G] Nachhall** am rechten Ufer, einzeln abrufbar:
   - Hütte: „Ein Mädchen auf einem Mehlsack, eine Kerze, ein Bleistift.“
   - Glocke: dreimal, mit Pausen dazwischen, dazu „Halo! Ima li koga?“. Daran hängt die Notiz „eine Mädchenstimme“.
   - Am Seilanker sagt Mala: „Das ist meins.“ Dieser Nachhall gehört nicht zum Rätsel. Er wird erst im zweiten Schlüsselgespräch erzählt.
3. **[M→G] Die Lichtprobe.** Zlata lässt Marko hinauf: „Das war seine Kammer. Ich gehe da nicht mehr hinein.“ Marko hält in jedem Fenster von Zlatas Haus das Licht seines Handys hoch. Nach jedem Fenster wechselt der Spieler zu Mala am rechten Ufer, und Mala vergleicht mit ihrem Nachhall: „Zu tief.“ – „Zu breit.“ – „Das kleine unter dem Dach. Das war es.“ Das Dachfenster gehört zu Batos Kammer. Zlata schlief damals unten am Herd, weil es dort warm war.
4. **[G] Wann das Licht anging.** Mala ordnet ihren Nachhall: Beim ersten Läuten war es dunkel, beim zweiten brannte das Licht, beim dritten war es wieder aus.
5. **[M] Die Zeitleiste.** Ein Overlay zum Ordnen von Karten [B, Typ `arrange`, bisher für Tomažs Briefe]. Die Karten:
   - 22:40 Ankunft (Vlado);
   - 23:15 Vlado fährt (Vlado);
   - erstes Läuten (Mala);
   - Licht an (Lichtprobe);
   - zweites Läuten (Mala);
   - Licht aus (Lichtprobe);
   - drittes Läuten (Mala);
   - Zlata im Schilf, 6:30 (Zlata, ihre einzige Auskunft über den Morgen).

   Liegt die Reihenfolge richtig, entsteht der Widerspruch „Jemand war wach“, also Licht zwischen erstem und drittem Läuten gegen „Er hat geschlafen“.
6. **[M] Der Bleistift.** Marko fragt Zlata nach Dingen von damals, nicht nach Menschen. „Was lag morgens an der Glocke?“ Zlata holt aus der Küchenschublade einen angekauten Bleistift: „Bato hat ihn mitgebracht, als er morgens die Decken holte.“ Zusammen mit dem Nachhall der Mädchenstimme ergibt das den Schluss „Es war das Mädchen“.
7. **[M] Bato.** Marko spricht ihn mit beiden Schlüssen an. Bato wird unruhig, flackert und verschiebt sich um einen Pixel [B, Prinzip „Unruhe davor“]: „Nein. Ne … Es war ein Soldat. Ein Soldat läutet so.“ Erkannt hat er seinen Tod noch nicht, das geschieht erst in der Finalnacht.
8. **[M] Die Entscheidung über Zlata.** Soll Marko ihr sagen, dass Bato wach war? Mit „Mala fragen“ fragt er Mala über den Fluss hinweg per Zeichen. Er hält zwei Finger hoch, sie nickt oder schüttelt den Kopf. Sie schüttelt ihn und erklärt es später: „Lass ihr ihren Mann.“ Am Abend sagt sie das Gegenteil.

**Hinweise.**

1. „Malas Nachhall ist auf dem einen Ufer, Zlatas Haus auf dem anderen. Wer hat damals was gesehen?“
2. „Ein Licht in einem Fenster kann man auch heute zeigen.“
3. „Die Zeitleiste mit Vlados Zeiten, Malas Läuten und den Fenstern füllen.“

**Ergebnis.** Die Nacht ist geordnet bis auf das Seil, das Mala für sich behält. Bato ist bereit, nach einem Mädchen zu suchen. Die Glocke wirkt in der Finalnacht.

**Wirkung.** Der Weg zu Vlados Teil 2 öffnet sich: Marko kann ihm jetzt Glocke, Licht und Bleistift nennen. Zlata vertraut Marko. Sie sieht, dass er Dinge weiß, die niemand wissen kann: „Sie haben mit jemandem geredet, der da war.“ – „Ja.“

**Warum keiner allein.**

- **Der Nachhall** liegt am rechten Ufer, und nur Mala kann ihn lesen.
- **Die Zeugin und der Geist** sind am linken Ufer. Mit beiden reden kann nur Marko, und Mala geht nicht hinüber.
- **Die Lichtprobe** braucht einen, der leuchtet, und eine, die vergleicht.

**Warum das Naheliegende scheitert.**

- **Läuten, sobald man da ist:** Bato kommt nicht, bei Tag fährt keine Fähre.
- **Bato sagen, er sei tot:** „Was? Der Fluss ist zu laut.“ [B, Regel]
- **Zlata nach dem Mädchen fragen:** „Sie gehört niemandem mehr.“ Weiter kommt nur, wer nach Dingen fragt.

---

## 8. Zwei Dialogszenen

Die Szenen folgen dem Ton der Kapitel 1 und 2: kurze Sätze, Pausen als Regieangabe, kein Satz, der klüger ist als die Figur. Beide Szenen haben Auswahlmomente, aber keine falsche Antwort.

### 8.1 Frühes Schlüsselgespräch: „Mich hast du nicht gefragt“

*Donnerstagabend, Terrasse der Herberge. Unten ist die Neretva zu hören, nicht zu sehen. Am anderen Tisch drei Australier mit Gitarre. Marko schreibt in sein Notizbuch. Mala steht hinter ihm und liest mit.*

> **MALA:** Du hast es aufgeschrieben.
> **MARKO:** Was?
> **MALA:** „Bring sie nach Hause.“ Mit Datum. Wie einen Auftrag.
> **MARKO:** Es ist ein Auftrag.
> **MALA:** Von wem?
> **MARKO:** Von deiner Mutter.
> **MALA:** Und ich? Bin ich der Auftrag oder die, die man fragt?
> *(Pause. Einer der Australier sagt „awesome“.)*
> **MALA:** Das war das dritte Mal. Ich zähle mit.
> **MARKO:** Ich dachte, du willst nach Hause.
> **MALA:** Du dachtest. Du hast „Ja“ gesagt, bevor sie fertig geweint hatte. Ich stand daneben.
> **MARKO:** Du hast nichts gesagt.
> **MALA:** Sie hat geweint, Marko. Da sagt man nichts. Jetzt sage ich es.
> **MARKO:** Dann sag es.
> **MALA:** Ich weiß nicht, was „nach Hause“ ist. Mein Zimmer? Das lüftet sie jetzt. Ein Kasten auf einem Friedhof, zu dem sie jeden Sonntag mit dem Bus fährt? Ich weiß nicht mal, ob ich da liegen will.
> **MARKO:** Wo dann?
> **MALA:** Das ist es ja. Ich weiß nicht, wo ich liege. Ich weiß nicht, wie ich gestorben bin. Und du weißt schon, wo ich hinkomme.
> *(Lange Pause.)*
> **MARKO:** Ich habe es ihr versprochen. Ich halte es.
> **MALA:** Ich weiß, dass du es hältst. Das ist das Problem. Du hältst es so fest, dass ich nicht mehr drin vorkomme.
> **MARKO:** Das ist nicht fair.
> **MALA:** Nein. Aber es stimmt.
> **MARKO:** Ich bin damals nicht gekommen. Jetzt komme ich. Für dich, für sie, für alle. Was soll ich sonst machen?
> **MALA:** Fragen.
> **MARKO:** Fragen.
> **MALA:** Ich will wissen, wie ich gestorben bin. Das zuerst. Und dann entscheide ich, was davon nach Hause geht. Ich. Du hast siebzehn Jahre für mich vergessen. Du musst jetzt nicht auch noch für mich entscheiden.
> *(Pause.)*
> **MALA:** Versprich es mir. Dass du mich fragst. Bei allem.

*Auswahl (keine falsche Antwort, jede färbt spätere Zeilen):*

> **[a] „Versprochen.“**
> **MALA:** Du sagst das so schnell.
> **MARKO:** Ich übe.
> **MALA:** Das hast du in Sarajevo auch gesagt.
> **MARKO:** Ich übe immer noch.
>
> **[b] „Bei allem kann ich nicht. Manchmal muss es schnell gehen.“**
> **MALA:** Dann frag schnell.
> **MARKO:** Und wenn keine Zeit ist?
> **MALA:** Für mich ist immer Zeit. Ich bin tot.
>
> **[c] „Und wenn du falsch entscheidest?“**
> **MALA:** Dann ist es meins. Das Falsche auch.
> **MARKO:** Das klingt wie Großmutter.
> **MALA:** Nein. Großmutter hat für dich entschieden. Ich entscheide für mich. Das ist der Unterschied.

*Für alle drei:*

> **MALA:** Morgen suchen wir die Brücke. Die richtige.
> **MARKO:** Woher weißt du, dass es nicht die hier ist?
> **MALA:** Weil die hier ganz ist.
> *(Die Australier fangen ein neues Lied an. Es ist ein altes jugoslawisches, und sie singen es falsch.)*
> **MALA:** Die singen falsch.
> **MARKO:** Ja.
> **MALA:** Schön falsch.

**Folgen [N].** Die Flagge „Mala fragen“ wird gesetzt. Variante a, b oder c wird gespeichert, wie `k2.f2.confess` in Kapitel 2 [B]. Am Grab greift Mala die Variante auf:

- a: „Du hast es versprochen. Schnell.“
- b: „Jetzt ist Zeit.“
- c: „Das hier ist meins. Auch wenn es falsch ist.“

### 8.2 Spätes Schlüsselgespräch: „Wie Großmutter“

*Sonntagnachmittag, Hof des Vulkanizers. Vlado ist gerade nach hinten gegangen. Kata sitzt im Büro und starrt auf den Schlüssel mit der 31. Mala steht neben dem TAM und hat die Hand auf dem Kotflügel, ohne ihn zu berühren.*

> **MARKO:** Er sagt, du hast ihn weggeschickt.
> **MALA:** Er sagt viel, für einen, der siebzehn Jahre nichts gesagt hat.
> **MARKO:** Mala.
> **MALA:** …
> **MARKO:** Gestern hast du gesagt: „Er ist gefahren.“
> **MALA:** Er ist gefahren. Das stimmt.
> **MARKO:** Weil du ihn weggeschickt hast.
> *(Lange Pause. Im Büro schiebt Kata einen Stuhl zurück.)*
> **MALA:** Er wollte mich mitnehmen. Zu seiner Schwester, in ein Zimmer mit Ofen. Bis morgens die Fähre fährt.
> **MALA:** Ich habe gesagt: Ich habe genug gewartet. Für ein ganzes Leben. Fahr.
> **MARKO:** Und dann hast du geläutet.
> **MALA:** Dreimal. Drüben ging ein Licht an. Und wieder aus.
> **MARKO:** Und dann?
> **MALA:** Dann habe ich mich an das Seil gehängt.
> *(Pause.)*
> **MALA:** Hand über Hand. Das Seil war kalt, so kalt, dass es brennt. In der Mitte war der Fluss lauter als alles. Ich habe losgelassen. Ich weiß nicht, ob ich es wollte. Ich weiß nur, dass meine Hände nicht mehr da waren.
> **MARKO:** Seit wann weißt du das?
> **MALA:** Seit gestern Nacht. Am Anker.
> **MARKO:** Und du hast es mir nicht gesagt.
> **MALA:** Nein.
> **MARKO:** Warum?
> **MALA:** Weil du rechnen kannst. Du bist Übersetzer, du zählst immer mit. Du hättest gerechnet: vier Wochen auf der Treppe, und dann nicht eine Nacht mehr. Und am Ende der Rechnung stehst du.
> **MARKO:** Da stehe ich sowieso.
> **MALA:** Nein. Da stand ich. Ich habe mich an das Seil gehängt. Nicht du. Nicht Vlado. Nicht der mit dem Licht.
> *(Pause.)*
> **MARKO:** Du hast es versteckt, damit ich es nicht tragen muss.
> **MALA:** Ja.
> **MARKO:** Wie Großmutter.
> *(Mala sieht ihn an. Lange.)*
> **MALA:** Wie Großmutter.
> **MARKO:** Sie hat einen Zettel in einen Ofen gelegt, damit ich nicht losrenne. Ich bin trotzdem nicht gerannt. Ich bin nur stehen geblieben. Siebzehn Jahre.
> **MALA:** Ich weiß.
> **MARKO:** Dann mach es nicht auch.
> **MALA:** Und was machst du jetzt damit? Mit dem Seil und den vier Wochen?

*Auswahl (keine falsche Antwort):*

> **[a] „Ich frage dich, was ich damit machen soll.“**
> **MALA:** Du fragst.
> **MARKO:** Ich habe es versprochen.
>
> **[b] „Ich trage mein Stück. Du trägst deins.“**
> **MALA:** Und Vlado seins. Und der mit dem Licht.
> **MARKO:** Und keiner trägt alles.
>
> **[c] „Ich schreibe es auf. In meinen Worten. Und du sagst mir, wo es falsch ist.“**
> **MALA:** In deinen Worten. Das hast du noch nie gemacht.
> **MARKO:** Nein.

*Für alle drei:*

> **MALA:** Dann sag Mama alles. Auch das mit dem Seil. Ich will nicht, dass sie siebzehn Jahre die falsche Geschichte hatte und jetzt noch eine falsche bekommt.
> **MARKO:** Gut.
> **MALA:** Und sag Vlado, dass er nicht schuld ist. Er glaubt es nicht, wenn du es sagst. Sag es so, dass er es glaubt.
> **MARKO:** Wie?
> **MALA:** Du warst nicht im Führerhaus. Ich schon.
> *(Sie sieht zum Lastwagen.)*
> **MALA:** „Dann fahr still.“ Das habe ich gesagt, als ich ihn gezeichnet habe. Das weiß keiner außer ihm.
> **MARKO:** Und der Fährmann?
> *(Lange Pause.)*
> **MALA:** Ich lasse ihn kommen. Ob ich ihm verzeihe, weiß ich, wenn er da ist.
> **MARKO:** Das ist ehrlich.
> **MALA:** Ich übe.

**Folgen [N].**

- Die Botschaft an Vlado wird möglich (7.2, Schritt 11).
- Fragt Marko nun nach Zlata, ändert Mala ihre Antwort: „Sag es ihr. Auch ihr.“
- Das Seil wird in Markos Notizbuch eingetragen, Variante c in eigenen Worten.
- „Ich übe“ geht von Marko auf Mala über. In Kapitel 2 sagt es Marko [B, `97_k2_talk.js:113`].

---

## 9. Enthüllungen und Fortsetzung

### 9.1 Offene Fragen: was bekannt ist, was Kapitel 3 beantwortet, was weitergeht

Spalten: **S** = Spieler, **M** = Marko, **G** = Mala. „Wann und wie“ nennt die Szene, in der das Wissen geteilt wird.

| Frage | Stand nach Kapitel 2 | In Kapitel 3 beantwortet (wann und wie, wer erfährt es) | Weiter in K4/K5, und warum |
|---|---|---|---|
| Wie ist Lana gestorben? | S/M/G: Lastwagen, Fluss, fehlende Brücke, Wasser [B] | **Ja.** Seil, Fluss, Weide, Herd, Mittag. G zuerst am Seilanker (Nacht 2, Nachhall). M im zweiten Schlüsselgespräch (Tag 3). Den Rest erfahren S, M und G durch Zlatas Erzählung (Finale) | – |
| Wo ist sie? | unbekannt | **Ja.** Skela, unter dem Quittenbaum. Die Leine zeigt zuerst, das Finale bestätigt | Begräbnis in Kapitel 5, als Folge der Identifizierung. Die Antwort wird nicht zurückgehalten |
| Wer war der Fahrer, was wurde aus ihm? | „hat geraucht und nichts gesagt“ [B] | **Ja.** Vlado Rajić, er lebt. Er kam um zwei Uhr zurück. Tag 1 bis 3 | – |
| Warum fand man sie nie? | Nada: „Wir suchen noch“ [B] | **Ja.** Sie nannte sich „Mala“. Den Namen kannte nur Marko. Bato und Zlata schwiegen, und Lana hatte selbst darum gebeten. Der Brief von 1996 kam zurück. Notizbuch-Schluss am Tag 2, ergänzt im Finale | – |
| Warum zuckt Mala bei Glocken? | offen [B, `rooms/ferhadija.js:21`] | **Ja.** Sie läutete die Fährglocke, und keiner kam. G und M erfahren es nach der Überfahrt im Finale | – |
| Warum hat sie Angst vor dem Fluss? | „Er war so laut.“ [B, optional] | **Ja.** Sie ist im Fluss gestorben. Sie überquert ihn auf der Fähre und geht im Epilog über die Brücke | – |
| Fährenhörner in Split | K1: „Wenn sie tutet, will ich weg“ [B, `rooms/terminal.js:54`]. K2 optional: das Boot, das Marko bringen sollte | **Ja**, verbunden mit Skela, als Marko sagt „Skela heißt Fähre“ (Tag 1) | – |
| Woran ist Malas Leine festgemacht? | K1: „An etwas, das ich nicht loslassen will.“ K2: an Marko, dann nach Südwesten [B] | **Ja.** An Zlata, die als letzte Lebende ihr Sterben hält [N, folgt aus Zoras Regel]. Wandernder Anker am Tag 2, Lösung im Finale. Danach an Marko, aus eigener Wahl | **K4/K5:** Was diese Wahl beide kostet. Das ist die Frage der zweiten Hälfte, nicht zurückgehalten, weil sie erst jetzt entsteht |
| Seit wann ist Mala bei Marko? | Widerspruch, siehe 1.8, Punkt 1 | **Ja.** Seit dem Winter 1994 in Vratnik, dann Split. Leer, seit er den Karton zuklebte. Sichtbar seit November 2011. Im Finale, nach der Leine | – |
| Warum kann sie nicht hinübergehen? | „Noch nicht.“ [B, Kapitel 1] | **Teilweise.** Bisher hielt sie etwas: das Vergessen, dann die fehlende Nacht. Ab dem Finale hält sie nur ihre eigene Wahl | **K5:** Ob sie geht, kann sie erst entscheiden, wenn sie begraben ist und Marko lebt, statt auf sie zu warten. Die Frage folgt aus dem neuen Zustand |
| Was weiß Nada? | vermisst, Rotkreuz-Nachricht, Postkarte [B] | **Alles über den Tod**, auch Lanas eigene Bitte. Epilog, in Skela. Über den Geist nichts, Nada sieht nur einmal auf den leeren Platz | **K5:** Ob Nada ahnt, dass Lana da ist. Die Frage bleibt offen, weil sie in die Schlussszene gehört (siehe 3, Richtung C) |
| Was wird aus Lanas Körper? | – | **Entschieden:** Sie kommt nach Hause, Nada und Zlata entscheiden gemeinsam. Die Exhumierung wird beantragt, Nada gibt ihre Probe ab | **K5:** Die Identifizierung braucht Wochen [geprüft: Verfahren über DNA-Abgleich mit Proben von Angehörigen]. Das Begräbnis ist eine Folge, keine zurückgehaltene Antwort |
| Markos Vater | „nicht zurückgekommen“ [B, optional] | **Gestellt, nicht beantwortet.** Marko gibt eine Probe ab (Epilog). Malas Satz und das Vatergespräch in Nacht 1 bereiten das vor | **K4:** Was mit Zoran geschah, kann erst der Abgleich zeigen. Dazu braucht es die Probe der Mutter. Daraus folgt die Reise |
| Markos Mutter und Ana | Ana: „Komm uns besuchen.“ Die Mutter kommt nicht [B] | **Der Anruf** ist der letzte Pflichtschritt. Davor und Lena spiegeln die Lage | **K4:** München, Weihnachten |
| Der Satz zu „Dubrovnik“ an der Tafel in Sarajevo | ohne Funktion [B, `rooms/stanica.js:100`] | **Ja.** Im Skizzenbuch steht „Dubrovnik 1991“, Nada sagt dazu: „Unser letzter Sommer am Meer.“ (Epilog) | – |
| Zoras „Aber nicht zu viel“ | offen [B, `97_k2_limbo.js:48`] | **Ja.** Die Lebenden, die Erinnerungen halten, werden alt und vergessen (Zlata) | – |
| Rades „Dva putnika“ | offen [B, `rooms/carsija.js:53`] | nein | **K5:** Rade zählt bei der letzten Fahrt nach dem Begräbnis. Ein Zeichen fürs Finale, nicht nötig für die Handlung |
| Hajras „Für zwei“ | optional [B] | **Aufgegriffen:** die Pita im Bus (stiller Moment) | – |
| Was passierte mit Lanas Habe? | – | **Ja.** Skizzenbuch und Bleistift hat Zlata, Schlüssel 31 und Zeichnung Vlado, Brunos Bild Ljerka | Der Schlüssel 31 kann in K5 an Ljerka zurückgehen (optional) |

### 9.2 Der Höhepunkt von Kapitel 3

**Drei Schritte**

1. **Verdienter Erfolg.** Die Glocke wirkt, weil der Spieler am Tag 3 Batos Irrtum korrigiert hat. Vlado fährt, weil der Spieler die Botschaft mit „Dann fahr still.“ überbracht hat. Zlata erzählt, weil der Spieler sie nach Dingen gefragt hat statt nach Menschen und weil der Name stimmte. Malas letzte Erinnerung kommt, weil die Lebende spricht. Nichts davon geschieht, ohne dass der Spieler vorher gearbeitet hat.
2. **Folgenreiche Einsicht und Entscheidung.**
   - Mala erfährt, dass sie selbst um das Schweigen gebeten hat, das ihre Mutter siebzehn Jahre kostete.
   - Marko erfährt, dass nicht nur seine Busnacht sie tötete, sondern viele kleine Entscheidungen, auch ihre eigenen.
   - Er hört auf, für sie zu entscheiden, und fragt.
   - Sie entscheidet: Die Mutter soll alles wissen, die zwei Mütter entscheiden über ihr Grab, Bato wird hinübergebracht.
   - Dann bindet sie sich selbst an Marko.
3. **Konkrete Verbindung zu Kapitel 4.** Die Vermisstenstelle stellt Marko die Frage nach dem Vater, er gibt seine Probe ab, man braucht die Probe der Mutter, und Marko ruft sie an: „Ich komme zu Weihnachten.“

**Was wurde gelöst?** Lanas Tod, Ort und Name. Batos Schuld und Übergang. Vlados Schweigen. Mates Warten. Die Glocken, der Fluss, die Leine, seit wann Mala bei Marko ist.

**Was hat es gekostet?**

- **Zlata** verliert ihr Grab und ihr Ritual. Sie erfährt, dass ihr Mann wach war.
- **Mala** erlebt ihren Tod ganz, die Kälte und die eigenen Hände. Sie erfährt ihre eigene Rolle im Schweigen.
- **Marko** verliert die tröstende Vorstellung, er allein sei schuld. Eine Schuld, die man allein trägt, kann man auch allein abtragen. Eine geteilte nicht.
- **Nada** verliert die letzte Hoffnung, die Vermisste noch lebend zu finden. Dafür bekommt sie ein Grab.

**Was hat sich zwischen ihnen verändert?**

- Er fragt, sie sagt die Wahrheit.
- Das Band ist gewählt, nicht mehr erzwungen.
- Er kennt sie jetzt, wie sie war: ungeduldig, stolz, eine, die lieber erfriert, als noch eine Nacht zu warten. Keine Heilige.
- Sie hat einem Mann verziehen, der nicht kam („Du bist gekommen. Nur später.“), und damit, ohne es zu sagen, auch Marko.

**Was tun sie als Nächstes?** Sie fahren mit Nada nach Sarajevo zurück, das ist das „Zurück“ der Rückfahrkarte. Zu Weihnachten fahren sie nach München, Mala aus eigenem Entschluss mit. Sie warten auf die Identifizierung.

### 9.3 Ausblick auf Kapitel 4 und 5 [N]

**Kapitel 4: München – „Die Lebenden“ (Weihnachten 2011)**

- **Konflikt.** Marko und seine Mutter Jasna. Sie ging 1992 mit Ana nach Deutschland und lebt heute, wie Ana, in München (Vorschlag). Marko blieb beim Vater und dann bei Ruža.
- **Neue Idee:** Er blieb wegen Lana. Er wollte nicht ohne seine große Freundin weg. Das verbindet die Familiengeschichte mit Lana, ohne einen Zufall zu brauchen.
- **Der Vater.** Die Mutter hat nie eine Probe gegeben. „Solange ich keine gebe, ist er irgendwo.“ Das ist dasselbe Leugnen wie bei den Geistern, nur bei einer Lebenden. Während des Kapitels kommt der Anruf mit dem Ergebnis des Abgleichs.
- **Malas Rolle, umgekehrt.** In München versteht sie die Sprache der Geister nicht. Marko muss für sie übersetzen, und sie braucht ihn auf eine neue Weise. Ana war als Kind eifersüchtig auf Lana und ist es vielleicht noch, ohne zu wissen, warum.
- **Die Kosten des Bandes.** Markos Kopfschmerz ist seit Kapitel 1 bestätigt [B]. Hier wird er zum Thema. Kann man mit einer Toten an der Seite ein Leben führen?
- **Vorbereitet in Kapitel 3** und dort schon mit Funktion:
  - Davors Karte und Lena;
  - der Anruf bei der Mutter;
  - Markos Probe;
  - das Vatergespräch und Malas Satz „Du suchst mich, damit du ihn nicht suchen musst“;
  - Malas gewähltes Band.
- **Wendepunkt (Vorschlag).** Marko erfährt, was mit seinem Vater geschah, und entscheidet, wohin er gehört. Mala sieht, was ihr Bleiben ihn kostet.

**Kapitel 5: Sarajevo – „Die erste Drei“ (März 2012)**

- **Anlass.** Lana ist identifiziert. Begräbnis in Sarajevo, vielleicht um ihren Geburtstag am 3. März.
- **Wer kommt.** Nada, Zlata, Vlado und Kata, Hajra, Rade, Damir, Dragica. Vielleicht auch Markos Mutter, wenn der Vater ebenfalls heimkommt.
- **Die Schlussfrage.** Kann man jemanden nach Hause bringen, ohne ihn festzuhalten, und kann sie bleiben, ohne ihn festzuhalten?
- **Nötige Vorbereitungen, alle bereits gelegt:**
  - die Dose mit den zwei Fahrscheinen. Sie ist Malas letzter Geistergegenstand. Wer losgelassen hat, kann etwas hergeben [B]. Gibt sie die Dose ab, ist das eine Entscheidung, kein Zwang;
  - das gewählte Band aus Kapitel 3;
  - Nadas Blick auf den leeren Platz;
  - Rades Zählen;
  - die Rückfahrkarte;
  - Markos Wohnung in Split und der offene Karton;
  - Vesnas „Die Stillen, Teil zwei“.
- **Nicht erzwingen.** Kapitel 5 muss beide Enden tragen können:
  - Mala geht nach ihrem Begräbnis, mit Abschied und ohne Bruch;
  - Mala bleibt, frei, als Partnerin bei Markos Arbeit mit den Toten.

  Was geschieht, entscheiden die Figuren aus dem, was sie in fünf Kapiteln geworden sind. Ob die Entscheidungen des Spielers mitwirken (etwa „Mala fragen“), legt Kapitel 5 fest.

---

## 10. Kritische Prüfung

### 10.1 Kontinuität

Geprüft gegen den Code [B].

- **Malas Splitter** (`13_k2_notes.js:117`, `rooms/carsija.js:79`). Jedes Element wird wörtlich erfüllt: Lastwagen, Mehl, Decken, Diesel, Rauch, Schweigen, „grün und laut, tief unten“, „nicht mehr da“, „Wasser“, „Dann weiß ich nichts mehr“.
- **Dose und Gegenstände.** In der Dose liegen zwei entwertete Fahrscheine, das Foto hat Marko (`rooms/stanica.js:151`). Die Rotkreuz-Nachricht ist bei Nada. Marko hat die Rückfahrkarte.
- **Daten.**
  - Ankunft im Palma am 28.11.1993, Brunos Eintrag am 2.12.1993, Brunos Tod am 14.12.1993 (`rooms/palma.js:53`).
  - Die Rotkreuz-Nachricht ist vom 18.12.1993, die Postkarte vom 6.1.1994. Lana fährt am 14.1.1994 ab, nach der Postkarte und einen Monat nach Brunos Tod [N].
  - Marko kommt im Mai 1994 nach Split. „Ich war schon nicht mehr dort“ stimmt, sie war tot.
- **Regeln für Geister** [B, `KONZEPT.md` §2.3a als gebauter Inhalt, im Code bestätigt]:
  - Leugnen. Wer es direkt hört, hört es nicht.
  - Unruhe vor der Erkenntnis, dann die Erkenntnis an einem Ding oder Zeichen, mit Effekt.
  - Die Leine löst sich, Mala öffnet die Schwelle.
  - In der Zwischenwelt spielt man Marko, er tut das Letzte. Mala bleibt am Rand.
  - Wer losgelassen hat, kann etwas hergeben.
  - Die Toten erinnern sich mit den Lebenden.

  Kapitel 3 bricht keine dieser Regeln. Nur ihre Anwendung ist neu: Eine Leine kann an einem Menschen hängen, der umhergeht. Das war bei Marko in Kapitel 2 schon der Fall (`97_k2_mala.js:7`).
- **Nachhall und Erinnerung.** Beides wird getrennt behandelt. Nachhall liegt an Orten und Dingen, Mala liest ihn auch ohne Lebende [B, Spüren]. Erinnerung kommt mit den Lebenden zurück [B]. Deshalb kennt Mala das Seil (Nachhall) vor dem Herd (Zlatas Erinnerung).
- **Markos Haltung.** Er zweifelt nicht mehr und lernt nicht noch einmal, was ein Geist ist. Die Gabe ist Alltag, die Prüfung ist moralisch.
- **Gelöstes bleibt gelöst.** Name, Herkunft, Busnacht, Geständnis und Karton werden nicht neu verhandelt.
  - Malas „Er ist gefahren“ ist eine benannte Grenze, keine Lüge, und widerruft nichts aus Kapitel 2.
  - Ljerkas leere „Abreise“ bestätigt den Schluss `f2_whyabreise` von der Seite der Lebenden.
- **Optionales aus Kapitel 2.** Den Vater, Malas Flussangst und Hajra setzt Kapitel 3 nicht voraus. Wo es darauf ankommt, sagt es das neu, knapp und in Markos Worten (Vatergespräch in Nacht 1, Malas Knie im Bus).

### 10.2 Fairness

- **Jede Pflichtinformation hat zwei Quellen oder einen klaren Ort.**
  - Vlado: Mate oder Ljerka.
  - Skela: Peilung oder Dinos Strömungswissen (optional).
  - Der Name „Mala“: Vlado, oder selbst geschlossen über „Ich habe ihr den Namen gegeben“.
- **Wechsel zwischen den Figuren** sind nötig und angekündigt. Mala sagt, was sie nicht tun wird.
- **Kein Rätsel braucht Glück oder Tempo.** Die Peilung wählt Landmarken, sie zielt nicht mit dem Finger. Die Zeitleiste ordnet, sie misst keine Zeit.
- **Gesprächsrätsel strafen nicht.** Falsche Ansätze bringen eigene Antworten und öffnen den Weg wieder.
- **Hinweise:** drei Stufen, nur auf Wunsch [B, Prinzip aus Kapitel 2].

### 10.3 Umsetzbarkeit in der vorhandenen Engine

Was vorhanden ist [B] und genügt:

- Phasen und Räume mit Hotspots, Geisterdarstellung mit Unruhe und `A.realize`;
- die Zwischenwelt mit Bruchstücken je Geist;
- die Overlays `doc`, `memory`, `puzzle`, `arrange`, `halves`, `glyphs`;
- das Notizbuch mit Schlüssen und Widersprüchen, Hinweise in drei Stufen;
- Stadtplan, Telefon (`phoneVoice`), Musik und Klangkulissen, Wetter wie Nebel und Schnee;
- die Wechselmechanik.

Was neu zu bauen wäre (Inhalt, keine neue Architektur):

- 18 Raumbilder;
- Figuren mit Rig und Porträts: Vlado, Kata, Zlata, Bato, Mate, Davor, Lena, Jela, Zdravko, Dino, Maja, Frau Kolar und der Springer;
- etwa 18 Erinnerungsbilder;
- Klänge: Fluss in drei Stärken, Fährglocke, Seil, Roller, Markt, Busbahnhof, Bura;
- die Kartenansicht der Peilung, entweder als Bild mit Zeichenfunktion oder als kleiner neuer Overlay-Typ wie `arrange` [B].

Technische Folgen, nur festgehalten und nicht umgesetzt:

- **Übernahme aus Kapitel 2.** `M.endChapter2` speichert heute nur einen Zeitstempel (`96_k2_story.js:120`). Kapitel 3 kann keine Entscheidung aus Kapitel 2 lesen. Für Kapitel 3 brauchte es eine Übernahme wie `M.storeC1End` (`:25`) mit diesen Werten: Geständnis, Nadas „Warum Mostar“, Hajra besucht, Ana angerufen, Vater erzählt. Bis dahin gelten Vorgaben. Kapitel 3 ist so geschrieben, dass es ohne diese Werte funktioniert.
- **Sprachfassung.** Kapitel 3 entsteht zuerst auf Deutsch, wie Kapitel 2 [B, `SPRACHFASSUNG_BHS.md`]. Die bosnischen und kroatischen Sätze im Konzept (Zlata, Bato, Jela, Lena) sind auch im deutschen Spiel so gewollt, wie in Kapitel 2.
- **Tests.** Durchlauf für Kapitel 3 mit zwei Reihenfolgen. Laden in jeder Phase. Der Bus aus München muss unabhängig von der Uhrzeit ankommen. Fehlversuche an der Glocke vor und nach der Rekonstruktion.

### 10.4 Annahmen und Recherchebedarf

**Geprüft (mit Quelle):**

- **Die Alte Brücke** fiel am 9. November 1993 nach Beschuss. Danach gab es eine provisorische Seilbrücke spanischer UNPROFOR-Pioniere. Eine Quelle nennt die Eröffnung am 30.12.1993, die Angaben zur Bauform weichen voneinander ab. Der Wiederaufbau begann am 7.6.2001, die Wiedereröffnung war am 23.7.2004. Quellen: [Wikipedia: Stari Most](https://Www.Wikipedia.org/wiki/Stari_most), [Britannica](https://britannica.com/topic/Old-Bridge-Mostar-Bosnia-and-Herzegovina), [archiweb.cz](https://www.archiweb.cz/en/n/foreign/pred-20-lety-byl-otevren-znovu-postaveny-stari-most-v-mostaru), [Strangers Guide](https://strangersguide.com/articles/the-destruction-of-stari-most/).
- **Die Belagerung von Ost-Mostar** dauerte von Mai oder Juni 1993 bis Februar 1994. Der Waffenstillstand kam am 23.2.1994, das Washingtoner Abkommen am 18.3.1994 (eine Quelle nennt den 16.3.). Die Front verlief entlang der Neretva und des Bulevar. Quellen: [Wikipedia: Siege of Mostar](https://en.wikipedia.org/wiki/Siege_of_Mostar), [Wikipedia: Washington Agreement](https://Www.Wikipedia.org/wiki/Washington_agreement), [Cambridge, Rebuilding Mostar](https://www.cambridge.org/core/books/abs/rebuilding-mostar/foreword/127DCEC67DCBB8F79BC7377DD55D9F47). **Folge für das Konzept:** Lanas Fahrt geschah mitten in diesem Krieg. Skela liegt deshalb bewusst nicht an der Front. Der Fluss dort ist keine Frontlinie.
- **Identifizierung Vermisster.** Die ICMP gleicht DNA aus Knochenproben mit Blutproben von Angehörigen ab. Bis 2011 gab es in Bosnien und Herzegowina rund 13.600 DNA-gestützte Identifizierungen. Exhumierungen führen die Behörden mit technischer Hilfe der ICMP durch. Das Institut für vermisste Personen erhält die Ergebnisse. Quellen: [ICMP (13.000 Identifizierungen)](https://icmp.int/?p=33232), [ICMP Pressemitteilung 2011](https://icmp.int/?p=33235), [tportal](https://www.tportal.hr/vijesti/clanak/icmp-some-8-100-killed-in-srebrenica-20110710).
- **Zwei Busbahnhöfe** in Mostar: Ost, der Hauptbahnhof neben dem Bahnhof, und West. Heute fahren Busse nach München von beiden ab. Quellen: [In Your Pocket](https://inyourpocket.com/mostar/arrival-transport), [12go](https://12go.asia/uk/station/136469-mostar-west-bus-station). Die Quellen beschreiben den heutigen Stand, nicht 2011.
- **25. November.** Der Tag der Staatlichkeit ist Feiertag in der Föderation, nicht in der Republika Srpska. Ob und wie er in den kroatisch geprägten Teilen begangen wird, ist nicht belegt. Quellen: [Wikipedia: Statehood Day](https://en.wikipedia.org/wiki/Statehood_Day_(Bosnia_and_Herzegovina)), [N1](https://n1info.ba/english/news/a489767-Bosnia-marks-Statehood-Day-in-only-half-of-the-country/).
- **Doppelte Einrichtungen** in Mostar: zwei Universitäten, zwei Stromversorger, parallele Post. Quellen: [Balkan Diskurs](https://balkandiskurs.com/en/2020/12/14/a-second-chance-for-mostar/), [Crisis Group](https://www.crisisgroup.org/sites/default/files/90-reunifying-mostar-opportunities-for-progress.pdf), [Chronicle](https://www.chronicle.com/article/2-universities-in-mostar-mirror-a-nations-ethnic-divisions/). Die Quellen stammen meist aus 2015 bis 2020.

**Ungeprüft, vor der Umsetzung klären:**

1. **Skela.** Ob eine Seilfähre an der Neretva bei Mostar im Januar 1994 innerhalb eines Gebiets denkbar ist (Lage, Sperrstunde, Nachtverbot, Hochwasser). Ob private Hilfstransporte von Split in Dörfer an der Neretva damals fuhren. Rückfalllösung: eine erfundene Brücke an einem Zufluss.
2. **Rufglocken an Fähren** in der Region. Alternative: eine Glocke an einer Kapelle neben der Anlegestelle, mit der man rief.
3. **Unterkühlung.** Ob ein Mensch bei etwa 6 °C Wassertemperatur, mehrere Stunden halb im Wasser, bis zum nächsten Mittag überleben kann. Medizinisch prüfen und gegebenenfalls die Zeiten anpassen.
4. **Post 1996.** Ob ein Brief von dort nach Sarajevo als „Adresse unzureichend“ zurückkommen konnte (getrennte Postsysteme).
5. **Verfahren 2011** bei einem privaten Gartengrab: Polizei, Staatsanwaltschaft, Institut für vermisste Personen, ICMP, Dauer. Ob es 2011 ein Büro in Mostar gab. Wie Blutproben damals entnommen wurden.
6. **Orte 2011.** Das Minarett der Koski-Mehmed-Pascha-Moschee für Besucher (auch im November). Zustand und Aussicht des Partisanenfriedhofs. Springer, die im November für Trinkgeld springen.
7. **Bus München–Mostar 2011.** Tage, Ankunftszeit, Bahnhof.
8. **Feigen einpacken** im Klima von Mostar.
9. **Mondphase** in der Nacht zum 28.11.2011 (vermutlich kurz nach Neumond).
10. **Namen** für Region und Zeit mit Muttersprachlern prüfen, ohne reale Personen zu treffen. Ebenso den Ton des Witzes über das Übersetzen.
11. **Kleinigkeiten:** das restaurierte Gymnasium, der TAM-Lastwagen, das Oldtimermuseum in Graz (erfunden).

**Takt.**

- Reale Geschichte ist Rahmen. Alle Schicksale sind erfunden, keine reale Opfergeschichte wird verwendet.
- Keine Volkszugehörigkeiten, keine Seite ist schuld.
- Kriegsspuren erzählen nichts selbst.
- Die Suche nach Vermissten ist das Thema und wird nicht zur Kulisse. Die Behörden erscheinen sachkundig und menschlich.
- Zlatas Vergessen wird ohne Diagnose und mit Würde gezeigt.
- Für Anmerkungen von Ortskundigen und Betroffenen ist eine Prüfung vor der Umsetzung vorgesehen.

### 10.5 Referenzen (nur Handwerk)

- **Blackwell-Reihe (Wadjet Eye Games):** das Vorbild der Reihe für Medium und Geist, den Figurenwechsel und das Verbinden von Notizen [B, `KONZEPT.md` §1–2]. Übernommen ist nur die Struktur.
- **„Rashomon“ (Kurosawa, 1950):** mehrere Zeugen, jeder mit einer unvollständigen Fassung, die ihn schont. Hier als Prinzip für die Nacht an der Fähre, nicht als Handlung.
- **Der Fährmann als Motiv** (Charon in der griechischen Sage): Mala, die Tote hinüberbringt, trifft einen, der einmal nicht übersetzte. Nur als Anklang.
- **Ivo Andrić, „Die Brücke über die Drina“ (1945):** die Brücke als Zeugin von Generationen. Nur als Motiv.

Figuren, Dialoge und Rätselketten sind aus keiner dieser Quellen übernommen.

---

## 11. Schlussprüfung

### 11.1 Gefundene Schwächen und wie der Text sie jetzt behandelt

1. **Zu viele, die zu spät kamen.** Die Gefahr ist eine Wiederholung derselben Aussage. Deshalb kommt jeder auf eine andere Art zu spät:
   - Vlado kehrte um und kam um zwei.
   - Bato kam am Morgen, begrub sie und fuhr nie mehr.
   - Marko kam im Mai und suchte.
   - Esad glaubte, sie komme, „wenn sie fertig ist“.

   „Du bist gekommen. Nur später.“ fällt in Kapitel 3 nur ein einziges Mal, am Rand des Lichts.
2. **Mala verschweigt.** Sie verschweigt nur das Seil, und das für etwa einen Spieltag. Sie sagt es offen („Das ist meins.“). Sie lügt nicht, und die Grenze hat einen Grund. Deshalb bleibt sie glaubwürdig.
3. **Plausibilität der Front.** Skela liegt bewusst an einem Flussabschnitt ohne Front. Die Gründe, nicht zu kommen, sind Sperrstunde, Hochwasser und Angst. Ob die Lage taugt, ist Rechercheauftrag 1. Eine Rückfalllösung ist genannt.
4. **Überlebenszeit im Wasser.** Lana liegt halb im Wasser in Weidenwurzeln, nicht stundenlang darin. Das muss medizinisch geprüft werden.
5. **Kitsch.** Die Uhrzeit ihres Todes wird nicht genannt („Im Radio sagt einer die Uhrzeit. Ich höre nicht mehr, welche.“). Es gibt keinen Satz über „11:10“. Der Samstag wird einmal erwähnt, leise.
6. **Leinentrick wiederholt.** Kapitel 2 endete mit „Die Leine zeigt nach …“. Kapitel 3 endet nicht so. Die Leine löst sich, die nächste Richtung kommt aus Markos eigener Entscheidung und einem Amt.
7. **Fall B ohne Bezug.** Fall B liefert die Spur zu Vlado, die alte Karte, die Glockenpause und Markos Spiegel. Damit trägt er die Hauptlinie mit und begründet Kapitel 4, statt nur daneben zu stehen.
8. **Nada erfährt zu früh von Mala.** Bewusst nicht: ein einziger Blick auf den leeren Platz, keine Offenbarung. Die Szene gehört Kapitel 5.
9. **Umfang.** Falls gekürzt werden muss, in dieser Reihenfolge: Dino, Vesna und der Witz über das Übersetzen, dann Hajra. Die drei Kooperationsrätsel, Fall B und das Finale bleiben.

### 11.2 Die drei Fragen

**Ist Kapitel 3 für sich ein vollständiges, lohnendes Abenteuer?** Ja.

- Es hat eine eigene Frage („Wem gehört ihr Tod?“) und beantwortet sie.
- Es hat zwei abgeschlossene Geisterfälle mit Lebenden, die sich verändern: Zlata, Davor und Lena, Vlado und Kata.
- Es hat drei verschiedene Kooperationsrätsel und einen Höhepunkt, den der Spieler sich erarbeitet.
- Wer nur dieses Kapitel spielt, erlebt einen Fall von der falschen Annahme bis zum Grab.

**Verändert es die Hauptfiguren und die Richtung der Reihe?** Ja.

- **Mala** geht von „Mich hast du nicht gefragt“ zu „Ich entscheide, und ich sage die Wahrheit“. Ihr Band ist danach gewählt, nicht erzwungen.
- **Marko** geht vom Wiedergutmachen zum Fragen und von fremden Vermissten zu seinem eigenen.
- **Die Reihe** fragt ab hier nicht mehr „Wer war sie?“, sondern „Was tun wir mit der Wahrheit?“.

**Entstehen Kapitel 4 und 5 aus Folgen statt aus zurückgehaltenen Antworten?** Ja.

- Kapitel 4 folgt aus Markos Probe, der nötigen Probe seiner Mutter und seinem Anruf.
- Kapitel 5 folgt aus der Identifizierung, die Wochen braucht, und aus Malas gewähltem Band.
- Keine Antwort über Lanas Tod wird aufgespart. Offen bleibt nur, was erst nach Kapitel 3 entstehen kann: was die Wahl der beiden kostet und wie sie enden soll.

> Kapitel 3 beantwortet genug, um zu befriedigen: Tod, Ort, Name, Glocken, Fluss, Leine. Es verändert genug, um nötig zu sein: das Band, Markos Fragen, Nadas Wissen. Und seine Folgen begründen die letzten beiden Kapitel: die Probe für den Vater und das Grab, das nach Hause kommt.
