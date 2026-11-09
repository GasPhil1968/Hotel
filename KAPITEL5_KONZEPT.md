# MALA – Kapitel 5: Sarajevo

### Konzept für Geschichte, Figuren und Rätsel des Gesamtfinales (Fassung 2: im Spiel umgesetzt, Abweichungen in Abschnitt 13)

Arbeitstitel des Kapitels: **„Angekommen“**

Dieses Dokument ist ein Story- und Quest-Konzept. Es enthält keinen Code. Das Spiel setzt es um (`game/src/96_k5_story.js`, `97_k5_*.js`, `rooms/k5_*.js`); wo die Umsetzung abweicht, steht es in Abschnitt 13. Der Geist an der Brauerei heißt im Spiel und hier Hamdija Selimović (im Entwurf: Fikret Mulić).

---

## Grundlage und Kennzeichnung

**Was ich geprüft habe**
- **Code gelesen:** Kapitel 4 vollständig: Phasen und Abschluss (`96_k4_story.js`), Familienhandlung (`97_k4_fam_a.js`, `97_k4_fam_b.js`), Mala (`97_k4_mala.js`), Notizen (`13_k4_notes.js`), Gegenstände (`12_k4_items.js`), Zwischenwelt Gerda (`97_k4_limbo_gerda.js`), Räume `ana.js`, `jwohnung.js`, `heim*.js`, `ostbus.js`. Aus Kapitel 1 bis 3 habe ich die Stellen gelesen, auf die das Finale aufbaut (Fundstellen jeweils angegeben).
- **Im laufenden Spiel beobachtet:** Ich habe die Musterlösung von Kapitel 4 automatisch im Browser durchlaufen lassen (`game/tools/walkthrough4.js`) und alle Sprechzeilen mitgeschnitten (Sprechprotokoll der Engine, `05_engine.js:193`). Das ist **ein** Pfad: Zustimmung „b“ aus Kapitel 3, Probe „ja“, Pantoffeln angenommen, Dose gefüllt, kein gefälschter Brief. Ein Spieltest durch einen Menschen ist das nicht. Andere Varianten habe ich nur aus dem Code rekonstruiert.
- **Nicht geprüft:** Ob jede optionale Zeile zur Laufzeit erreichbar ist, habe ich nicht einzeln ausgeführt.

**Kennzeichnung im ganzen Dokument**

| Zeichen | Bedeutung |
|---|---|
| **[B·beob.]** | Bestätigter Spielinhalt, im automatischen Durchlauf beobachtet |
| **[B·Code]** | Bestätigter Spielinhalt, aus dem Code rekonstruiert (mit Fundstelle) |
| **[E]** | Früherer Entwurf (`KAPITEL3_KONZEPT.md`, `KAPITEL4_KONZEPT.md`). Nicht verbindlich freigegeben, kein Kanon |
| **[I]** | Interpretation: plausibel, nicht ausdrücklich bestätigt |
| **[N]** | Neue Idee dieses Entwurfs |

- **Verbindlich freigegebener Entwurf für Kapitel 5:** keiner gefunden.
  - Der Vorschlag „Die erste Drei“ in `KAPITEL4_KONZEPT.md:1675–1760` ist dort selbst als „[N]“ markiert, also als Vorschlag.
  - Verbindlich ist nur eine Entscheidung zur Oberfläche: Die Ankündigung „Kapitel 5: Sarajevo“ im Abspann von Kapitel 4 bleibt (`design/UI_KONZEPT.md:21`). Kapitel 5 spielt deshalb in Sarajevo.
- **Fundstellen:** Pfade ohne Ordner beziehen sich auf `game/src/` (Räume auf `game/src/rooms/`). Dokumente im Hauptordner stehen mit Namen da.
- **Aussagen von Figuren** sind Aussagen, keine Tatsachen. Wo es darauf ankommt, steht „sagt“ statt „ist“.

---

## Inhalt

1. Womit Kapitel 4 tatsächlich endet
2. Die Aufgabe des Gesamtfinales
3. Drei Finalrichtungen und die Wahl
4. Kapitel 5 vollständig: „Angekommen“
5. Abschließende Figurenentwicklung
6. Spielbare Kapitelstruktur
7. Drei Kooperationsrätsel, ausgearbeitet
8. Der spielbare Gesamthöhepunkt
9. Zwei Schlüsseldialoge und die letzte Szene
10. Auflösungsübersicht
11. Epilog und Endzustände
12. Kritische Prüfung und Schlussfragen
13. Umsetzung im Spiel: was anders geworden ist

---

## 1. Womit Kapitel 4 tatsächlich endet

### 1.1 Das Ende in Kürze (mit allen Spoilern)

Kapitel 4 heißt „Nicht zurückgekommen“ und spielt in München, von Heiligabend 2011 bis Neujahr 2012 (`BERICHT_K4.md`; Phasen `96_k4_story.js:7–21`). Mala ist dabei. Sie bewegt sich tagsüber allein durch die Stadt.

**Die letzte große Ermittlung: ein Satz aus zwei Städten** [B·Code]
- **Dienstag, 27. Dezember.** Frau Kolar ruft aus Mostar an. Ein Grab ohne Namen an der Brauerei in Sarajevo, April 1993, wurde 2003 exhumiert. Darin lag ein Rechenschieber mit „Z. V.“ (`97_k4_fam_a.js:180–182`; Notiz `z4_kolar`, `13_k4_notes.js:30`).
  - Mit Probe „ja“ ist der Abgleich da. Mit Probe „nein“ gibt es einen Kandidaten, und Marko gibt seine Probe am Mittwoch im Konsulat ab (`97_k4_fam_a.js:97`; Merker `k4.e.sample2`).
  - Kolar: „Im Frühjahr ist die Gerichtsmedizin so weit. Dann rufe ich wieder an.“ Und: „Sagen Sie es Ihrer Mutter nicht am Telefon.“ (`97_k4_fam_a.js:202–203`)
- **Malas Geheimnis aus Mamas Kiste.** In einer Rotkreuz-Nachricht vom Mai 1993 schreibt Ruža: „Zoran nije se vratio.“ Im Nachhall hört Mala, dass Ruža „poginuo“ schreiben wollte und dass ein Junge sie bat, „nicht zurückgekommen“ zu schreiben. Mala schweigt fünf Tage (`z4_nachricht`, `13_k4_notes.js:26`; Auflösung `97_k4_fam_a.js:278–286`).
- **Freitag, 30. Dezember, nachts, Hackerbrücke.** Marko erzählt den 19. April 1993 (`97_k4_fam_b.js:34–47`):
  - zwei blaue Kanister, auf die der Vater „VUKOVIĆ“ mit roter Farbe geschrieben hat;
  - „Er hat mich hinten anstehen lassen, für Dragica. Er wollte vorn fragen, ob der Druck wieder da ist.“
  - „Einer hat mich festgehalten und gesagt: Nemoj gledati, mali.“ – „Ich habe hingeschaut.“
  - Danach füllt er beide Kanister und trägt sie zu Baka nach Vratnik, „keinen Tropfen verschüttet“.
  - Die Abmachung: „Nicht ‚nicht zurückgekommen‘. Den richtigen Satz.“ (`97_k4_fam_b.js:69`)

**Der spielbare Höhepunkt: Silvester, Zimmer 214** [B·Code], teilweise [B·beob.]
- Im Haus am Bavariapark sitzt Jasna am Fenster, Alois schläft mit der grünen Kanne. Der Spieler führt das Gespräch in Zügen (`97_k4_fam_b.js:140–212`):
  - „Ich war dabei.“
  - der Tag und der Satz, vermisst gegen tot;
  - Jasnas Stück: „Ich bin ohne dich gefahren.“ (`:161`);
  - die Kurve: „Du hast immer zu viel gewusst. Schon als Kind.“ (`:173`);
  - Anas Probe von 2004: „Hinter meinem Rücken.“ (`:183–184`);
  - „Er wartet nicht. Wir haben gewartet.“ (`:193`)
- **Mitternacht.** Jasna: „Ich will ihn sehen.“ – „Ich fahre hin.“ Marko: „Ich komme mit.“ (oder er nimmt nur ihre Hand). Jasna: „Im März.“ – „Ich setze mich ans Fenster.“ (`:198–201`)
- **Ana kommt.** „Dann jetzt. Alle.“ – „Bis es hell wird.“ Jasna: „Du hast das Wasser nach Hause getragen?“ – „Ja.“ – „Dann bist du zurückgekommen.“ Mala: „Zurückgekommen.“ (`:209–212`)

**Der Epilog „Neujahr“, Sonntag, 1. Januar 2012** (`96_k4_story.js:21`) [B·Code], teilweise [B·beob.]
- **Pantoffeln.** Jasna: „Vierundvierzig.“ – „Du hast seine Größe.“ (`97_k4_fam_b.js:240`; [B·beob.])
- **Jasna ruft Nada an.** „Nada? Jasna.“ – „Vukovićka, sa sedmog.“ Sie füllt Nadas Keksdose mit eigenen Vanillekipferln: „Bring sie ihr zurück. Voll.“ (`:247–251`; Gegenstand `dose_voll`, `12_k4_items.js:28`; [B·beob.])
- **Das Dach.** „Das Dach in Vratnik. Achtzehn Jahre bezahlt. Damit er reinkann, wenn er kommt.“ Marko: „Wir können im März drunter sitzen.“ – „Im März.“ (`:255–256`)
- **Der Nachruf** „Die Stillen, Teil zwei · Zoran Vuković, 1951–1993“ für Vesna und „Glas Rive“ (`:259–260`):
  - Bauingenieur, Rechenschieber, ein roter Zastava, den er sonntags wusch und nie fuhr;
  - der Konvoi im Mai 1992: „Fahrt“, rief er. „Wir kommen nach.“ „Er blieb mit seinem Sohn in Vratnik.“;
  - „Im März fährt sie zu ihm. Er ist gefunden. Vermisst war er nie.“ (Variante „nein“: „Sie haben ihn wahrscheinlich gefunden.“)
  - Vesna antwortet: „Seite vierzehn. Ein paar Zeichen zu viel. Ich lasse sie drin.“ (`:262–263`)
- **Optional:** Den gefälschten Brief an Carmela wirft Marko weg oder schickt ihn mit zwei Zeilen (`:264–270`).
- **Malas Gespräch** (`:271–291`; Zustimmungsfassungen siehe 1.7). Es endet so:
  - Mala: „Nach dem Begräbnis frage ich mich selbst noch einmal.“ – „Und dann sagst du mir ehrlich, was du willst. Nicht ‚nur müde‘.“
  - Marko: „Den richtigen Satz.“ – Mala: „Den richtigen.“ (`:284–285`)
- **SMS von Nada:** „Ekshumacija desetog januara. Javit će nam se. N.“ Mala: „Mama.“ – „Sie holt mich.“ (`:287–288`; [B·beob.])
- **Letztes Erinnerungsbild:** „Drei Tassen. Eine Kiste, die offen bleiben darf. […] Im März fahren wir nach Sarajevo. Alle. Mama setzt sich ans Fenster.“ (`:290`)
- **Ana**, auf Nachfrage: „Ich habe zum ersten Mal einen Vater, der tot ist. Nicht einen, der fehlt.“ (`:307`). Mit Zeichnungsszene: „Ich habe sie dabei. Für Nada. Im März.“ (`:306`). Gemeint ist Lanas Straßenbahn von 1990 (`z4_stiefel`, `13_k4_notes.js:23`).
- **Abschluss:** Endkarte „Ende des vierten Kapitels“ mit „Fortsetzung: Sarajevo“ (`96_k4_story.js:323`). Der Abspann endet mit der Widmung „Für alle, die nicht zurückgekommen sind, und für alle, die es aussprechen mussten.“ und „FORTSETZUNG / Kapitel 5: Sarajevo“ (`:318`).

Nach dem Abspann gibt es keine weitere Szene.

### 1.2 Was gelöst ist, was geschehen, aber nicht verarbeitet ist, und was bleibt

| Bereich | Gelöst | Geschehen, nicht verarbeitet | Bleibt für das Finale |
|---|---|---|---|
| Zoran | Tod am 19.4.1993 an der Brauerei; Marko war dabei; die Familie hat es ausgesprochen | Er liegt seit 2003 „mit einer Nummer“ in Sarajevo (`97_k4_fam_b.js:193`) | Förmliche Identifizierung, Jasna „will ihn sehen“, Begräbnis |
| Jasna | Ihr Stück von 1992 („ohne dich gefahren“); Pantoffeln abgegeben | Sie war seit 1992 nicht in Sarajevo; „Sie hat nur nie wieder hingesehen.“ (`z4_kurve`, `13_k4_notes.js:41`) | Rückkehr, Haus 7, Ružas Dach, Nada |
| Lana | Gefunden unter dem Quittenbaum in Skela; Nada weiß alles (`13_k4_notes.js:12`) | Exhumierung am 10. Januar angekündigt | Das Begräbnis, „Mama und Zlata, zusammen“ |
| Mala | Ursache von Markos Kopfweh geklärt (`r4_ursache`, `13_k4_notes.js:44`) | Sie hat bei Gerda gesehen, wie Bleiben festhält | **Ihre Entscheidung nach dem Begräbnis** |
| Die Dose | – | „Wenn ich sie hergebe, dann der, die sie braucht.“ – „Das weiß ich noch nicht.“ (`97_k4_mala.js:51`) | Wer sie braucht |
| Die Mütter (7. und 9. Stock) | Erster Anruf nach achtzehn Jahren, eine Viertelstunde über Plätzchen (`97_k4_mala.js:45`) | Die Dose ist gefüllt, aber nicht zurückgebracht | Das Treffen |
| Marko | Der Satz für den Vater ist gesagt und gedruckt | „Nemoj gledati, mali“: Wer ihn hielt, ist unbekannt | Seine ehrliche Antwort an Mala; die Kanister |

### 1.3 Markos Stand

- **Was er weiß:**
  - Lanas ganzes Leben und Sterben bis zum 15.1.1994 (Kapitel 2 und 3);
  - dass ungefundene Geister sein Kopfweh machen, manchmal auch Malas Nähe (`r4_ursache`; `skela_l.js:286`);
  - dass sein Satz „nije se vratio“ die Familie achtzehn Jahre hoffen ließ;
  - dass sein Vater gefunden ist (Variante „nein“: wahrscheinlich).
- **Welche Verantwortung er übernommen hat:**
  - Er hat der Mutter in der Silvesternacht alles gesagt.
  - Er hat versprochen mitzukommen („Ich komme mit“) und Mala ehrlich zu antworten.
  - Seit Kapitel 3 gilt sein Versprechen an Nada und an Mala: „Ich bringe dich nach Hause. Wie versprochen.“ (`skela_l.js:270`)
- **Welche Überzeugungen sich geändert haben:**
  - Schonen sperrt ein. Die Wahrheit kann in der Sprache des anderen trösten („Endstation. Feierabend.“, `98_k4_intros_heim.js:30`).
- **Was entschieden ist:**
  - Er fährt im März mit nach Sarajevo.
  - Er trägt die Pantoffeln des Vaters (wenn angenommen).
- **Was aussteht:**
  - Was er Mala nach dem Begräbnis sagt.
  - Was er mit dem anfängt, was er am 19. April gesehen hat.
- **Was er am Ende von Kapitel 4 will, und warum:**
  - Lana nach Hause bringen, wie versprochen.
  - Den Vater begraben, mit dem richtigen Wort.
  - Dabei nicht wieder schweigen. Kapitel 4 hat ihm gezeigt, was Schweigen kostet.

### 1.4 Malas Stand

- **Geklärt sind:**
  - Sie ist **Lana Delić**, geboren am 3.3.1976, aus dem neunten Stock von Haus 7 in Alipašino Polje (`stan.js:16`; `carsija.js:75`).
  - „Mala“ ist der Name, den Marko ihr gab, weil sie ihn „Mali“ nannte (`97_k2_mala.js:116`). Am Herd in Skela nannte sie sich selbst so: „Ich sage es, weil ich zu ihm will. Er soll mich so finden.“ (`skela_l.js:256`)
  - Sie ist im Januar 1994 von Split losgefahren, um Mali zu holen. Sie stürzte dort, wo die Brücke nicht mehr war, und starb am Samstag, dem 15.1.1994, bei Zlata am Herd (`carsija.js:76–78`; `skela_l.js:240`; Brett „MALA · 15.1.1994“, `skela_l.js:417`).
  - Seit Kapitel 3 hält sie nichts mehr: „Ich könnte gehen. Heute Nacht noch.“ (`skela_l.js:284`). Das neue Band zu Marko haben beide gemacht (`:295`).
- **Was sie will:**
  - bei Mama sein, bis sie begraben ist (`skela_l.js:285`);
  - dabei sein, wenn Mama und Zlata entscheiden, wo sie liegt (`:282`);
  - „selbst nach Hause kommen. Nicht als Nachricht.“ (`:256`; [B·Code], Erinnerung in Kapitel 3).
- **Was für sie offen ist:**
  - wem sie die Fahrscheine gibt;
  - ob sie das kann, was Gerda konnte: „Gehen, weil ich bleibe.“ (`97_k4_mala.js:52`);
  - Hansi ging „ohne Schwelle“, darum beneidet sie ihn ein wenig (`:50`).
- **Was ihr niemand abnehmen darf:** die Entscheidung, ob und wann sie geht. Sie hat sie selbst an das Begräbnis gebunden (`97_k4_fam_b.js:284`; [E] Regel `KAPITEL3_KONZEPT.md:334–340`).

### 1.5 Die Beziehung

- **Was sie verbindet:**
  - die Samstage der Kindheit;
  - vier gemeinsame Kapitel;
  - ein Band, das „nicht zieht“ und das beide gemacht haben (`skela_l.js:294–295`).
  - Seit der Hackerbrücke wissen beide, wie der andere schont: sie aus Treue, er aus Angst, gesehen zu werden ([E] `KAPITEL4_KONZEPT.md`, 9.2; im Spiel `97_k4_fam_b.js:34–69`).
- **Bearbeitet:**
  - die Busnacht 1993 („Du bist gekommen. Nur später.“, Kapitel 2);
  - Malas fünf Tage Schweigen;
  - Markos Kopfweh als ausgesprochener Preis.
- **Offen:** Er hat ihr noch nie gesagt, was **er** will. Sie hat noch nicht gesagt, was sie nach dem Begräbnis tut.
- **Was sie einander zugesagt haben:**
  - „Wenn einer von uns nicht mehr will? – Dann reden wir. Wie heute.“ (`skela_l.js:296`)
  - nach dem Begräbnis die Frage und die ehrliche Antwort, „den richtigen Satz“ (`97_k4_fam_b.js:284–285`).

### 1.6 Konkreter Ausgangszustand für das Finale

- **Wo sind beide?**
  - Am 1. Januar sind beide in Jasnas Wohnung in München.
  - Mala kündigt an, zu Nada zu gehen: „Sie holt mich. Am zehnten.“ (`97_k4_mala.js:45`)
  - [N] Für den Beginn von Kapitel 5 nehme ich an: Marko hat Mala Anfang Januar nach Sarajevo begleitet und ist allein nach Split zurückgefahren, wo er wohnt („der Onkel aus Split“, `ana.js:204`). Seitdem ist Mala bei Nada. Im März holt Marko die Mutter in München ab, und sie fahren zusammen mit dem Bus. Eine neue Annahme, ausgewiesen in 12.4.
- **Angekündigte Reise:**
  - „Im März fahren wir nach Sarajevo. Alle.“ (`97_k4_fam_b.js:290`)
  - Jasna setzt sich ans Fenster (`:201`).
  - Ana bringt Nada die Zeichnung (`:306`).
- **Gegenstände (Kapitel 4):**
  - Pantoffeln Größe 44 (`pantoffeln`);
  - Nadas Dose, voll (`dose_voll`);
  - Malas Dose mit zwei Fahrscheinen: ein Geisterding, gehört Mala (`carsija.js:73`).
- **Kontakte:**
  - Nada; Zlata (über Nada); Frau Kolar; Vesna.
  - In Sarajevo aus Kapitel 2: Hajra (Pension in Kovači, Schlüssel zu Ružas Haus, `vratnik.js:40`), Rade (Endstation), Damir (Fahrer der Drei), Nedžad (Kupferschmied und Graveur, `kazandziluk.js:1`), Šehić und Dragica (Haus 7).
- **Pflichtwissen und optionales Wissen:**
  - Pflicht in Kapitel 4: Brauerei, Kanister, „Nemoj gledati, mali“, der Satz, das Dach, die Dose, Nadas SMS.
  - Optional: die Zeichnungsszene mit Ana (Merker `k4.d1.drawing`), der Brief an Carmela, das Klopfzeichen als Notiz (`u4_klopfen`).
  - Optional in Kapitel 2: Nadas „Keiner von euch hat je geschrieben“ (`stan.js:15`).
  - Kapitel 5 macht alles Nötige davon neu zugänglich (6.6).
- **Gespeicherte Entscheidungen** [B·Code]:
  - Kapitel 4 speichert am Ende `sample`, `sample2`, `kurve`, `slippers`, `nada`, `fake`, `davor`, `consent2`, `playMs` (`96_k4_story.js:320–321`).
  - Kapitel 3 speichert `consent`, `promise`, `talk2`, `sample` (`96_k3_story.js:315`). Kapitel 4 liest diese Werte und setzt bei Fehlen Standardwerte, darunter Zustimmung „b“ (`96_k4_story.js:38–53`).
  - **Nicht** gespeichert werden:
    - ob der Brief an Carmela weggeworfen oder geschickt wurde (`k4.e.letter`);
    - ob die Zeichnungsszene stattfand;
    - welche Züge in Zimmer 214 gespielt wurden.
  - Kapitel 2 speichert nur den Zeitpunkt (`96_k2_story.js:120`). Wie Kapitel 5 damit umgeht, steht in 11.3.

### 1.7 Die Zustimmungsfassungen am Neujahrsmorgen [B·Code]

Malas letztes Gespräch in Kapitel 4 hängt von der Antwort am Grab in Kapitel 3 ab (`skela_l.js:288`):

| Kapitel 3 | Neujahr (`97_k4_fam_b.js:274–283`) |
|---|---|
| a „Ja.“ | „Am Grab hast du ‚Ja‘ gesagt. ‚Einfach so?‘, habe ich gefragt.“ – „Es war nicht einfach.“ – „Jetzt weißt du, wie wenig.“ |
| b „Ja. Und wenn es zu schwer wird, sagen wir es.“ | „Auf der Brücke haben wir es gesagt. Beide.“ – „Spät.“ – „Aber gesagt.“ ([B·beob.]) |
| c „Frag mich in München noch mal.“ | Mala fragt neu. Marko wählt: „Ja. Und wenn es zu schwer wird, sage ich es. Den richtigen Satz.“ / „Ja. Diesmal weiß ich, wozu.“ / „Ich weiß es nicht. Das ist die ehrliche Antwort.“ (`consent2`) |

In allen Fassungen folgt derselbe Schluss: die Frage nach dem Begräbnis und „den richtigen Satz“.

### 1.8 Widersprüche und Lücken (offengelegt, nicht übermalt)

1. **Malas Spuren in Kapitel 1 gegen „Ich nicht.“**
   - In Markos Wohnung in Split ist eine Straßenbahn mit einer Drei auf die beschlagene Scheibe gemalt: „Ich habe sie nicht gemalt.“ (`flat.js:232`; Notiz `m_tram`, `11_notes.js:54`). Auf „Die Straßenbahn auf der Scheibe.“ antwortet Mala „Ja.“ (`office.js:59`).
   - Auch das Foto liegt plötzlich mit dem Bild nach oben: „Ich habe es nicht umgedreht.“ (`flat.js:148`).
   - In Kapitel 2 sagt Mala dagegen: „Er kann anfassen. Ich nicht.“ (`92_story2.js:100`).
   - Kapitel 5 braucht diese Stelle. Es erklärt sie nicht nachträglich, sondern grenzt sie früh und überprüfbar ein (4.2, 12.4).
2. **Wo Marko 1992 bis 1993 wohnte.**
   - „Siebter Stock. Bis zweiundneunzig.“ (`neboder.js:69`)
   - Der Nachruf: „Er blieb mit seinem Sohn in Vratnik.“ (`97_k4_fam_b.js:259`)
   - Dagegen steht eine Erinnerung aus dem August 1992 im Treppenhaus des siebten Stocks (`97_k2_mem_b.js:360`).
   - Kapitel 5 legt keinen Umzugstag fest.
3. **Ružas Haus.** Ruža ist 1994 gestorben (`carsija.js:34`), das Haus steht „seit 2003 leer“ (`13_k4_notes.js:18`). Wer dort 1994 bis 2003 wohnte, sagt das Spiel nicht. [N] Hajra erwähnt es in Kapitel 5 in einem Satz (4.5).
4. **„Für Dragica“.** Warum Zoran 1993 an der Brauerei für Dragica anstehen ließ, die in Kapitel 2 in Haus 7 wohnt (`haustor.js:12`), ist ungeklärt. Kapitel 5 erklärt es nicht.
5. **Wer Marko festhielt** („Einer hat mich festgehalten“, `97_k4_fam_b.js:41`) und wer „vorn die Hand hebt“ (`:142`), sagt das Spiel nicht. Kapitel 5 beantwortet beides als neue Idee [N] (7.2), ohne dem Wortlaut zu widersprechen.
6. **Herkunft von Malas Dose:** nicht festgelegt. Sie sagt nur: „Meins.“ (`riva.js:187`). Das bleibt offen (10).
7. **Lanas Grab und Termin, Zorans Grab:** im Spiel nicht festgelegt. [N] Kapitel 5 legt beides fest (4.3).
8. **Übernahmen:** Ohne gespeichertes Kapitelende (Testschalter, alte Stände) braucht Kapitel 5 Standardwerte wie Kapitel 4 (11.3).
9. **Sprache:** Kapitel 4 gibt es nur auf Deutsch (`BERICHT_K4.md`). Kapitel 5 sollte zunächst ebenso entstehen.

### 1.9 Welche abschließende Handlung sich aus diesem Ende ergibt

- **Am Ende von Kapitel 4 ist alles für eine Reise vorbereitet:**
  - Zwei Tote kommen nach Hause, Lana und Zoran.
  - Eine Mutter fährt zum ersten Mal seit zwanzig Jahren zurück und setzt sich ans Fenster.
  - Eine zweite Mutter wartet im neunten Stock und lüftet jeden Tag das Zimmer ihrer Tochter (`97_k4_fam_a.js:328`).
  - Mala hat ihre Entscheidung an das Begräbnis gebunden. Marko hat ihr eine ehrliche Antwort versprochen.
- **Die abschließende Handlung:**
  - Marko und Mala müssen Lana so nach Hause bringen, wie sie es wollte: selbst, nicht als Nachricht.
  - Danach muss Marko sie gehen lassen, ohne sie festzuhalten. Er sagt ihr die Wahrheit über das, was er will.
- **Warum nur dieses Kapitel das kann:**
  - Das Begräbnis, die Identifizierung und Jasnas Rückkehr finden im März in Sarajevo statt. So hat es das Spiel selbst angekündigt.
  - Malas Entscheidung darf es erst nach dem Begräbnis geben, nach ihrem eigenen Wort.
  - Alles, was die Reihe verspricht, trifft an einem Ort und in einer Woche zusammen: die Drei, die Samstage, die Dose, die Mütter, der Vater.

---

## 2. Die Aufgabe des Gesamtfinales

### 2.1 Was Kapitel 5 abschließen muss

| Ebene | Was abgeschlossen werden muss |
|---|---|
| **Äußere Handlung** | Lana wird begraben, so wie sie es bestimmt hat: Mama und Zlata entscheiden zusammen, Mala ist dabei. Zoran wird identifiziert und begraben. Jasna kehrt zurück. |
| **Erkenntnisse** | Wie kann Lana „selbst nach Hause kommen“, wenn die Lebenden sie nicht hören? Wer braucht die zwei Fahrscheine? Wer hat Marko am 19. April festgehalten? |
| **Figuren** | Mala entscheidet über ihren Weg, aus eigenem Grund. Marko sagt, was er will, und lässt sie dann entscheiden. |
| **Beziehung** | Was der gemeinsam gemachte Faden bedeutet und wie er endet: nicht als Abriss, nicht als Verzicht, sondern als letzte gemeinsame Handlung. |
| **Spielerlebnis** | Der Spieler erarbeitet den Abschluss mit den bekannten Mitteln: Malas Nachhall und ihr Gang durch Wände, Markos Hände und Sprache, Notizbuch, Gespräch, Gegenstand. |

- **Die Leitfrage**, aus der früheren Planung übernommen [E] (`KAPITEL4_KONZEPT.md:303`):
  - „Kann man jemanden nach Hause bringen, ohne ihn festzuhalten?“
  - Ich schärfe sie zu: **„Wann ist jemand angekommen?“**
- **Ein offenes Leben nach dem Ende ist erlaubt, ein offener Hauptkonflikt nicht.** Nach Kapitel 5 gibt es keine offene Frage über Lana, Zoran, Mala oder das Band mehr.

### 2.2 Das Finale in sechs Sätzen

- **Aus Kapitel 4 bringen Marko und Mala mit:**
  - die Erfahrung, dass der richtige Satz erst gefunden werden muss;
  - Markos Zusage, nach dem Begräbnis ehrlich zu sagen, was er will;
  - Malas Satz über die Dose, „der, die sie braucht“;
  - Jasnas Entschluss, im März ans Fenster zu sitzen.
- **Deshalb versuchen sie jetzt:**
  - Lanas Begräbnis so vorzubereiten, wie sie es verlangt hat, mit beiden Frauen zusammen;
  - herauszufinden, wem die Fahrscheine gehören;
  - Lana „selbst“ zu ihrer Mutter kommen zu lassen.
- **Das entscheidende Hindernis besteht darin:**
  - Nada kann Mala weder sehen noch hören.
  - Alles, was Marko an ihrer Stelle sagt, ist genau die Nachricht, die Lana nie sein wollte.
  - Und Mala kann nichts anfassen.
- **Durch ihre Ermittlungen verstehen sie:**
  - Die Fahrscheine gehören zu den Samstagen. Wer sie braucht, ist die Frau, die an den Samstagen die Tür aufgemacht hat und seit 1992 nicht mehr hinaufgehen kann: **Jasna**.
  - Malas Finger hinterlässt auf einer Scheibe eine Spur, aber nur im Beschlag von Markos Atem. Das zeigt sich am ersten Abend [N].
  - Der Mann, der Marko festhielt, wartet noch an der Brauerei.
- **Um tatsächlich etwas zu verändern, müssen sie:**
  - Jasna an Lanas Samstag um zehn nach elf in den siebten Stock bringen und ihr die Fahrscheine geben. Dann müssen sie sie selbst handeln lassen.
  - In Nadas Küche die Straßenbahn zeichnen, mit Markos Atem und Lanas Hand.
  - Danach muss Marko sie an Ružas Tor bis an den Rand begleiten und loslassen.
- **Ihre Handlung führt schließlich dazu:**
  - Nada sagt ihren eigenen Satz: „Stigla si.“, „Du bist angekommen.“ Achtzehn Jahre hieß ihr Satz: „Sie ist nie angekommen.“ (`stan.js:11–12`)
  - Die Mütter fahren zusammen die Drei.
  - Mala geht aus eigener Entscheidung durch Ružas offene Tür.
  - Am Montag trägt Marko das Wasser von der Brauerei nach Vratnik und zeichnet zum ersten Mal selbst eine Straßenbahn, mit Rädern.

### 2.3 Wahrheit und Handlung sind nicht dasselbe

- **Die Wahrheit über die Fahrscheine kann der Spieler am Donnerstag oder Freitag verstehen.**
  - Handeln kann er erst, wenn Mala losgelassen hat. Das geschieht nach dem Begräbnis und hängt an ihrer Entscheidung, nicht an einem Rätsel.
  - Danach muss er Jasna die Fahrscheine so geben, dass **sie** handelt. Er darf ihr nicht sagen, was sie tun soll.
- **Die Wahrheit über das Zeichnen kennt er ab Donnerstagnacht.**
  - Benutzen darf er sie nicht früher. Vor dem Begräbnis wäre eine Straßenbahn auf Nadas Scheibe ein Gespenst gewesen: ein Zeichen, auf das Nada von neuem wartet. Gerdas Fall hat gezeigt, wohin das führt.
  - Mala sagt das selbst (9.1).

### 2.4 Abgrenzung: was Kapitel 5 nicht ist

- **Kein neues Rätsel um Malas Identität.** Wer sie war und wie sie starb, ist seit Kapitel 3 geklärt. Kapitel 5 fügt keine Erinnerungslücke hinzu.
- **Kein Gegenspieler.** Die Widerstände sind menschlich: zwei Frauen, die denselben Menschen verschieden genannt haben, und eine, die nicht hinaufgehen kann.
- **Keine Rundreise.** Split und Mostar werden nicht besucht. Zlata kommt nach Sarajevo, weil Lanas Bestimmung es verlangt („zusammen“).
- **Kein Reset.** Kein früherer Fall wird entwertet. Alle erlösten Geister bleiben erlöst.
- **Keine Vorbereitung eines sechsten Kapitels.** Kein Abspannteaser.

---

## 3. Drei Finalrichtungen und die Wahl

Die drei Richtungen sind Alternativen auf Autorenebene. Sie bedeuten nicht drei wählbare Enden im Spiel.

### Richtung A – „Die erste Drei“ (früherer Entwurf [E], hier zu Ende gedacht)

- **Grundlage:** `KAPITEL4_KONZEPT.md:1675–1760`.
- **Anschluss an Kapitel 4:** Sarajevo, 1. bis 5. März; Lanas Begräbnis, Zorans Identifizierung und Begräbnis, die Dose.
- **Zentraler Konflikt:** Lana will selbst nach Hause kommen, ein Begräbnis ist aber eine Feier der Lebenden.
- **Spielerleistung:**
  - ein Fall um einen Totengräber und seine Liste;
  - eine fremde Familie im siebten Stock, an deren Tür Mala „klopft“;
  - die Fahrt mit der Drei zur Endstation;
  - die Dose wird stofflich, Marko legt sie in Lanas Zimmer, Nada findet sie am Abend;
  - am Montag füllt Marko die Kanister an der Brauerei.
- **Figurenabschluss:** Mala geht nach der Fahrt an der Endstation, Marko begleitet sie bis an den Rand. Der Entwurf empfiehlt das, mit „Weg 2: Mala bleibt“ als Alternative.
- **Endzustand:** Mala ist hinübergegangen, Nada hat die Dose, Marko trägt das Wasser allein.
- **Schwächen:**
  - **Regelproblem:** „Mala klopft im siebten Stock“ widerspricht „Er kann anfassen. Ich nicht.“ (`92_story2.js:100`).
  - **Wiederholung:** Die Fahrt zu zweit mit der Drei zur Endstation gab es schon in Kapitel 2, nachts, mit Damir und mit beiden Fahrscheinen (`tramvaj.js:35`; `carsija.js:53`).
  - **Die Dose:** Nada ist die naheliegende Empfängerin, und Kapitel 4 lässt Mala sagen: „Das weiß ich noch nicht.“ Außerdem findet Nada die Dose allein, ohne dass Lana und Marko etwas zusammen tun.

### Richtung B – „Drinnen“ (Mala bleibt bei Nada)

- **Anschluss an Kapitel 4:** Mala war acht Wochen bei Nada. Nach dem Begräbnis entscheidet sie, zu bleiben, nicht bei Marko, sondern bei ihrer Mutter im neunten Stock.
- **Zentraler Konflikt:** Bleiben, ohne festzuhalten. Mala weiß von Gerda, dass Bleiben einen Lebenden frieren lassen kann (`97_k4_mala.js:52`). Sie muss einen Weg finden, bei Nada zu sein, ohne dass Nada weiter wartet.
- **Spielerleistung:**
  - Nadas Warten beenden: ein letzter Brief an den Suchdienst, das Zimmer, die Dose;
  - das Band zu Marko gemeinsam lösen, damit sein Kopf frei ist.
- **Figurenabschluss:**
  - Marko geht ohne sie nach Hause.
  - Mala „wartet drinnen, nicht auf der Treppe“ und geht erst, wenn Nada geht.
- **Endzustand:** Mala bleibt in Sarajevo und ist an Nada gebunden, bis zu deren Tod.
- **Stärken und Schwächen:**
  - Sehr leise, warm, aus Malas acht Wochen bei Nada begründet.
  - Malas Weg bleibt auf unbestimmte Zeit offen.
  - Gerdas Lehre wird umgangen statt beantwortet.
  - Der Höhepunkt wäre ein Gespräch und eine Trennung ohne gemeinsame Tat.

### Richtung C – „Nemoj gledati“ (die Brauerei als Mitte)

- **Anschluss an Kapitel 4:** „Einer hat mich festgehalten und gesagt: Nemoj gledati, mali.“ (`97_k4_fam_b.js:41`). Kolars Grab an der Brauerei.
- **Zentraler Konflikt:** Marko kehrt an den Ort zurück, an dem er hingeschaut hat. Der Mann, der ihn festhielt, ist dort ein Geist. Er hat die Toten jener Nacht an der Mauer begraben und eine Liste geschrieben, die nie jemand bekam.
- **Spielerleistung:**
  - Nachhall und Rekonstruktion des 19. April;
  - die Liste finden;
  - drei Namenlosen einen Namen zurückgeben;
  - Zorans Begräbnis.
- **Figurenabschluss:**
  - Marko schließt seinen Bogen über den Vater.
  - Malas Entscheidung kommt am Rand, als Folge davon, dass sie den Brunnenmann gehen sieht.
- **Endzustand:** Mala geht an der Brauerei, im Wasser, das wieder fließt.
- **Schwächen:**
  - Kapitel 5 würde Kapitel 4 fortsetzen statt die Reihe abschließen.
  - Lana, um die es seit Split geht, würde zur Nebenfigur ihres eigenen Finales.

### Bewertung

| | Kontinuität | Vorbereitung | Spielbarkeit | Emotionale Wirkung | Abschlussfähigkeit |
|---|---|---|---|---|---|
| **A „Die erste Drei“** | hoch: alle Fäden aus Kapitel 4 | hoch, aber mit Regelbruch beim Klopfen | gut: Fall, Begräbnis, Fahrt | gut, wiederholt aber Kapitel 2 | hoch |
| **B „Drinnen“** | hoch für Nada, schwach für die Drei und die Dose | mittel: braucht keine neue Regel, beantwortet aber Gerda nicht | schwach: wenig gemeinsame Tat | leise, ernst | mittel: Malas Weg bleibt offen |
| **C „Nemoj gledati“** | hoch für Kapitel 4, schwach für die Reihe | gut: Haken aus Kapitel 4 | gut: Nachhall, Rekonstruktion | stark für Marko, schwach für Mala | mittel: Lanas Faden wird Nebensache |

### Die Wahl: „Angekommen“

Ich wähle **Richtung A, umgebaut zu „Angekommen“**. Aus B übernehme ich Nadas Küche und den Gedanken, dass Nadas Warten enden muss. Aus C übernehme ich die Brauerei als Nebenstrang.

**Warum:**
- **A folgt am genauesten aus dem Spiel.** Alles, was Kapitel 4 für März ankündigt, findet statt: Begräbnis, Identifizierung, Fenster, Dach, Dose, Zeichnung.
- **Die Schwächen von A werden mit Mitteln des Spiels behoben, nicht mit Ausnahmen:**
  - **Das Klopfen:** Nicht Mala klopft, sondern Jasna. Sie klopft Lanas Zeichen, zweimal kurz, einmal lang, das sie nach achtzehn Jahren noch kennt (`u4_klopfen`, `13_k4_notes.js:20`). Sie klopft im neunten Stock, um Nada zu holen, so wie Lana jeden Samstag Mali geholt hat.
  - **Die Dose:** Sie geht an **Jasna**. Damit wird Malas „Das weiß ich noch nicht.“ zur echten Frage, die der Spieler mit mehreren Schlussstufen beantwortet (7.3).
  - **Die Drei:** Nicht Marko und Mala fahren, sondern die beiden Mütter, auf den Plätzen ihrer Kinder. In Kapitel 2 hieß es: „In der Drei sitze ich am Fenster und sie daneben.“ (`97_k2_mala.js:110`). Jetzt sitzt Jasna am Fenster, wie sie es angekündigt hat (`97_k4_fam_b.js:201`).
  - **Selbst, nicht als Nachricht:** Lana kommt nicht durch eine Dose, die Nada abends findet. Sie kommt durch eine Zeichnung, die sie vor Nadas Augen auf die Scheibe macht: ihre Hand, Markos Atem. Das ist die letzte gemeinsame Handlung der beiden. Sie stützt sich auf Kapitel 1, mit einer früh gezeigten und begrenzten Ergänzung [N] (4.2).
  - **Malas Abschied:** Er findet nicht an der Endstation statt. Er geschieht an **Ružas Tor**, wo Lana im November 1993 fragte: „Kommst du?“ und Mali log: „Ich komme.“ (`97_k2_mala.js:114`). Diesmal sagt er die Wahrheit.
- **Die Brauerei aus C** bekommt einen eigenen Fall mit eigenem Abschluss. Sie gibt Markos Haken aus Kapitel 4 („Nemoj gledati“) eine Antwort und Mala einen letzten Fund. Lanas Finale stiehlt sie nicht.

---
## 4. Kapitel 5 vollständig: „Angekommen“

### 4.1 Arbeitstitel, Prämisse, Thema

- **Arbeitstitel:** „Angekommen“. Er antwortet auf „Nicht zurückgekommen“ (Kapitel 4) und auf Nadas Satz aus Kapitel 2: „Sie ist nie angekommen.“ (`stan.js:11–12`)
- **Leitfrage:** „Wann ist jemand angekommen?“
- **Prämisse:**
  - Anfang März 2012 kommen zwei Tote nach Sarajevo zurück.
    - Lana Delić wurde im Januar in Skela exhumiert und wird am Freitag, dem 2. März, begraben. Das ist der Tag vor ihrem 36. Geburtstag.
    - Zoran Vuković lag seit 2003 als Nummer in der Gerichtsmedizin. Er wird identifiziert und am Montag, dem 5. März, begraben.
  - Marko kommt mit seiner Mutter. Seine Schwester Ana kommt mit den Kindern nach.
  - Mala ist seit Januar bei Nada, die sie weder sieht noch hört.
  - Nach dem Begräbnis will Mala sich selbst fragen, ob sie geht. Marko hat versprochen, ihr ehrlich zu sagen, was er will.
- **Thema: Ankommen heißt, nicht mehr zu warten.** In Kapitel 5 wartet fast jeder noch auf etwas:
  - Nada lüftet jeden Tag Lanas Zimmer.
  - Zlata stand achtzehn Jahre an jedem Fünfzehnten am Brett.
  - Jasna hat seit 1992 „nie wieder hingesehen“.
  - Hajra stapelt Holz „für niemanden“ (`vratnik.js:52`).
  - Ein Mann an der Brauerei wartet auf die Familien.
  - Mala hat auf Treppen und Bänken gewartet.
  - Das Kapitel endet, wenn keiner mehr wartet. Für Mala heißt das, dass sie geht.

### 4.2 Der zentrale Konflikt

**Lanas Bedingung gegen die Wirklichkeit**
- Lana will „selbst nach Hause kommen. Nicht als Nachricht.“ (`skela_l.js:256`). Ein Sarg ist nicht „selbst“.
- Alles, was Marko Nada über Lana sagen kann, wäre eine Nachricht. Im Januar 1994 wollte Lana genau das nicht, und Kapitel 3 hat gezeigt, was ihr „Sagt es keinem“ Nada gekostet hat.

**Malas Entscheidung gegen Markos Wunsch**
- Marko will, dass sie bleibt, ob er es sich eingesteht oder nicht.
- Mala will ankommen.
- Beides ist berechtigt. Daraus entsteht kein Streit, aber eine echte Spannung: zwei Menschen mit verschiedenen Zielen, die sich versprochen haben, ehrlich zu sein.

**Die Mütter**
- Lana ist losgefahren, um den Sohn aus dem siebten Stock zu holen. Nada hat das nie verwunden: „Sie ist losgefahren, um dich zu holen. Natürlich.“ (`stan.js:18`)
- Jasna ist 1992 ohne diesen Sohn gefahren (`97_k4_fam_b.js:161`). Achtzehn Jahre hat keine der beiden geschrieben (`stan.js:15`; `97_k4_fam_b.js:247`).

**Die Ergänzung, die das Finale braucht** [N], früh, überprüfbar und begrenzt (§13 des Auftrags)
- **Was das Spiel zeigt:**
  - [B·Code] Mala kann nichts anfassen (`92_story2.js:100`).
  - [B·Code] In Kapitel 1 ist in Markos Wohnung trotzdem eine Straßenbahn mit einer Drei auf der beschlagenen Scheibe. Marko hat sie nicht gemalt (`11_notes.js:54`), Mala bestätigt mit „Ja.“ (`office.js:59`). Wie das ging, sagt das Spiel nicht.
- **Die Ergänzung** [N]:
  - Auf einer Scheibe, die **Markos Atem** beschlagen hat, hinterlässt Malas Finger eine Linie.
  - Nur dort, nicht auf Dampf, nicht auf dem Atem anderer.
  - Die Linie vergeht mit dem Beschlag nach wenigen Sekunden. Mala kann damit nichts bewegen.
  - Sie zeichnet, schreibt aber keine Buchstaben. Das ist ihre eigene Wahl: „Buchstaben sind eine Nachricht.“
- **Wann sie sichtbar wird:**
  - in der ersten Nacht (Donnerstag), beiläufig und lange vor dem Höhepunkt (9.1);
  - zweimal geprüft: auf dem beschlagenen Spiegel im Bad und am Fenster, das Mia anhaucht. Beides misslingt.
  - Damit wird auch klar, warum Mala in acht Wochen bei Nada nie gezeichnet hat: Sie hat es auf Nadas Badezimmerspiegel versucht, ohne Erfolg.
- **Was ich nicht behaupte:** dass Kapitel 1 die Bedingung „Markos Atem“ vorbereitet hat. Belegt ist nur, dass es in seiner Wohnung einmal geschah. [I] Damals schlief er in diesem Zimmer.
- **Ersatzlösung**, falls die Ergänzung abgelehnt wird: 12.4.

### 4.3 Zeit, Wetter, Kalender

| Tag | Datum | Ereignis | Wetter [N, Recherche 12.5] |
|---|---|---|---|
| Prolog, Tag 1 | Donnerstag, 1. März 2012 | Ankunft 6:40 Busbahnhof; Vratnik, Haus 7, Nada; abends kommen Zlata und Ana | grau, Schneehaufen vom Februar an den Straßenrändern, Tauwetter |
| Nacht 1 | Donnerstag auf Freitag | Pension Hajra: der Atem. Brauerei mit dem Kanister | klar, Frost |
| Tag 2 | Freitag, 2. März | 9:00 Gerichtsmedizin; Brauerei; Gravur; **14:00 Lanas Begräbnis**, Friedhof Bare; abends Totenmahl bei Nada | kalt, trocken, am Nachmittag Sonne |
| Nacht 2 | Freitag auf Samstag | Žuta tabija, „bis es hell wird“ | klar |
| Höhepunkt | **Samstag, 3. März** | **Lanas 36. Geburtstag.** 11:10 das Klopfen; die Drei; Ružas Tor | Sonne, Schmelzwasser |
| – | Sonntag, 4. März | Karte: Zlata fährt nach Hause | Regen |
| Epilog | Montag, 5. März | Wasser von der Brauerei; Zorans Begräbnis; Ružas Küche bei Sonnenuntergang | mild, Abendsonne |

- **Wochentage geprüft:** Der 3.3.2012 ist ein Samstag, der 1.3. ein Donnerstag, der 5.3. ein Montag.
- **Samstag, 11:10** ist Lanas Zeit (`97_k2_mala.js:110`; `carsija.js:47–49`).
- **Freitag statt Samstag für das Begräbnis** [N]: Nada und Zlata wollen, dass Lana an ihrem Geburtstag „schon zu Hause“ ist.
- Die erste Drei nach dem Stillstand fuhr laut Rade „im März vierundneunzig“ (`carsija.js:52`), zwei Monate nach Lanas Tod. Das Kapitel spielt achtzehn Jahre später im selben Monat.

### 4.4 Schauplätze und ihre Funktion

Kein neuer Stadtname. Sarajevo kehrt mit veränderter Bedeutung zurück, dazu kommen sechs neue Räume mit klarer Aufgabe.

| Ort | Status | Was dort untersucht, verstanden oder verändert wird | Warum gerade dort |
|---|---|---|---|
| **Busbahnhof** | neu [N] | Ankunft, Jasna am Fenster, Mala wartet am Bahnsteig | Mala hat immer gewartet, auf der Treppe in Split, auf der Bank. Diesmal kommt der, auf den sie wartet. |
| **Pension Hajra, Kovači** (`pansion.js`) | Kapitel 2 | Standort; Hajra, Schlüssel, Mačak; das kalte Fenster: der Atem; frühes Schlüsselgespräch | Markos Zimmer, „Mačak liegt auf deinem Bett“ (`97_k3_mala.js:246`) |
| **Ružas Haus, Vratnik** (`vratnik.js`, `kuca.js`), dazu **Dachboden** | Kapitel 2, Dachboden neu ([E]-Idee `KAPITEL4_KONZEPT.md`, 9.1) | das Dach, das Jasna achtzehn Jahre bezahlt hat; die Kanister; **das Tor** (1993 „Kommst du?“); die Küche als Ende des Samstagswegs und als letztes Bild | Hier endete jeder Samstag, Ruža wartete mit zwei Taschen (`97_k2_mala.js:110`). Hier log Mali „Ich komme“ (`:114`). |
| **Žuta tabija** (Teil von `vratnik.js`) | Kapitel 2 | spätes Schlüsselgespräch, Malas Entscheidung | über der Stadt, „bis es hell wird“ |
| **Haus 7, Alipašino Polje** (`neboder.js`, `haustor.js`, `stan.js`), dazu **Treppenhaus 7./9. Stock** | Kapitel 2, Treppenhaus neu | Jasnas Rückkehr; Šehić und das Hausbuch von 1991; Jasna kann nicht hinauf; **das Klopfen**; Nadas Küche, **die Zeichnung**; Lanas Zimmer | Siebter und neunter Stock: der Weg, den Lana jeden Samstag ging |
| **Brauerei** | neu [N] | der Brunnenmann; Nachhall des 19. April; die Liste; am Montag das Wasser | Ort von Zorans Tod und seines ersten Grabes (`97_k4_fam_a.js:180`) |
| **Gerichtsmedizin** | neu [N] | Zorans Identifizierung; der Rechenschieber; Kolar | Jasnas „Ich will ihn sehen“ |
| **Kazandžiluk, Nedžad** (`kazandziluk.js`) | Kapitel 2 | die Gravur für Lanas Grab | Nedžad graviert, „wie ich es ihm vorgebe“ (`kazandziluk.js:35`). Der richtige Wortlaut ist hier Rätsel und Inhalt zugleich. |
| **Friedhof Bare** | neu [N, Recherche] | Lanas Begräbnis (Freitag), Zorans Begräbnis (Montag) | städtischer Friedhof für alle Konfessionen (zu prüfen, 12.5) |
| **Baščaršija, Endstation der Drei** (`carsija.js`) | Kapitel 2 | Rade zählt; Hajra mit zwei Taschen; Beginn des Wegs nach Vratnik | In Kapitel 2 saß Mala hier und stieg nie ein: „Dann ist es die falsche Zeit.“ (`carsija.js:16`) |
| **Straßenbahn Linie 3** (`tramvaj.js`) | Kapitel 2 | die Fahrt der Mütter | In Kapitel 2 fuhr die letzte Drei bei Nacht. Jetzt fährt die Drei am Samstag, bei Tag, mit den Müttern. |

### 4.5 Die Handlung

#### Prolog „Ankunft“ (Donnerstag, 1. März, 6:40)

- **Im Bus.** Erinnerungsbild. Jasna sitzt am Fenster, seit Ljubljana schweigt sie. Bei Tarčin wird es hell [Recherche: Route].
  - Mit `kurve`: Marko denkt an die Kurve, bis zu der sie 1992 zurücksah (`z4_kurve`).
  - Ohne `kurve` erzählt Jasna es in Kapitel 5 selbst, beim Blick aus dem Fenster.
- **Bahnsteig.** Mala steht unter der Anzeigetafel, den grauen Schal um den Hals. Jasna sieht sie nicht. Marko darf sich nichts anmerken lassen. Das ist Kleinkomik mit Gewicht: „Du siehst ausgeschlafen aus.“ – „Acht …“ – Jasna: „Was?“ – „Acht Grad.“
- **Taxi.** Jasna soll dem Fahrer das Ziel sagen und bringt das Wort nicht heraus. Marko sagt es: „Kovači.“
- **Pension Hajra.**
  - Frühstück. Mačak, der Kater, starrt auf den leeren Stuhl neben Marko. Hajra: „Mačak gleda nekoga.“ – „Der Kater sieht jemanden an.“
  - Hajra gibt den Schlüssel zu Ružas Haus: „Ich habe gestern Feuer gemacht. Für niemanden ist vorbei.“
  - Ein Satz zu den Jahren 1994 bis 2003 [N]: „Bis zweitausenddrei hat eine Familie aus Foča drin gewohnt. Ružas Sachen haben sie auf den Dachboden getan. Angefasst haben sie nichts.“
- **Vratnik.**
  - Am Tor bleibt Mala stehen: „Hier.“ Sie erklärt es nicht.
  - Jasna geht unter das Dach, das sie achtzehn Jahre bezahlt hat. Sie berührt die Wände, nicht das Dach.
  - **Der Dachboden ist der frühe Erfolg** (6.2): Die Kanister „VUKOVIĆ“, Ružas Quitten auf Zeitungen von 1994, Zorans Schlüssel zum roten Zastava an einem Nagel und das leere Etui des Rechenschiebers.
  - Malas Nachhall der Kanister reißt am Knall ab. Es bleibt eine Hand auf Markos Augen, ein nasser Ärmel und eine Stimme: „Nemoj gledati, mali.“ Die neue Frage: Wer war das?
  - Jasna sieht die roten Buchstaben: „Er hat auf alles seinen Namen geschrieben.“ Und: „Ich will sehen, wo es war.“
- **Haus 7**, mit dem Taxi, nicht mit der Drei. Jasna: „Nicht die Drei. Noch nicht.“
  - Dragica erkennt Jasna: „Jasna! Vukovićka!“ Šehić zeigt das Hausbuch von 1991 (`haustor.js:27`).
  - Treppen, der Aufzug geht immer noch nicht (`haustor.js:20`).
  - Im siebten Stock legt Jasna die Hand an die alte Tür: „Zweimal kurz, einmal lang. Jeden Samstag.“ Sie sieht die Treppe zum neunten Stock hinauf und geht nicht: „Ich kann da nicht hinauf. Ihre Tochter ist losgefahren, um meinen Sohn zu holen. Und ich bin ohne ihn gefahren.“
  - Šehić bietet an: „Die Wohnung steht leer. Samstag um elf bin ich da, dann sperre ich auf.“
  - Marko geht allein zu Nada hinauf.

#### Tag 1 „Donnerstag“ (frei, parallel)

- **Nada, neunter Stock.**
  - Sie bereitet das Begräbnis vor. Bei Nedžad hat sie eine Messingtafel bestellt und den Text offengelassen: „Bis Freitag. Es kommt noch jemand.“
  - **Lanas Zimmer:** der Schreibtisch mit den Stiften in einer Blechdose und das angefangene Bild, eine Straßenbahn auf einer Brücke (`stan.js:59`).
  - Die **Mappe mit den Briefen an den Suchdienst**, siebzehn Durchschläge. Nada: „Im Januar habe ich zum ersten Mal keinen geschrieben.“
  - Über die Samstage: „Fahrscheine? Die hat sie bei Alija gekauft. Samstags war sie bei euch. Ich war nie dabei. Das war euer Samstag.“
  - Ihr alter Satz, neu zugänglich: „Sie ist losgefahren, um dich zu holen. Natürlich.“
  - Mala zeigt Marko ihren Platz der letzten acht Wochen, das Fensterbrett.
- **Kazandžiluk.**
  - Nedžad, trocken: „Sie schon wieder. Was brechen Sie diesmal auf?“ Im ersten Gespräch erinnert er sich nur an das Stemmeisen aus Kapitel 2.
  - Er braucht den Text der Tafel bis Freitag, zwölf Uhr: „Ich graviere, was man mir sagt. Nicht, was man meint.“
- **Brauerei.**
  - Marko geht allein hin. Hajra: „Wasser holt man an der Pivara. Das beste der Stadt.“
  - Der Kopf pocht. Mala: „Hier ist einer. Aber er zeigt sich nicht.“
  - Nachhall am Hahn: Nacht, klappernde Kanister, eine Männerstimme: „Kanisteri u red! Jedan po jedan!“ Marko übersetzt: „Kanister in die Reihe! Einer nach dem anderen!“ Daraus folgt: Er zeigt sich Kanistern.
- **Endstation**, optional. Rade schlägt ein altes Fahrtenheft auf: „Subota, 11:10. Dvoje djece.“ Wer will, erfährt auch, wo sie saßen: „Der Kleine am Fenster. Sie daneben. Immer.“ Damit ist das Bild aus Kapitel 2 neu zugänglich.
- **Kolar ruft an:** Identifizierung am Freitag um neun. „Bringen Sie Ihre Mutter mit, wenn sie will.“
- **Abends bei Nada.**
  - Zlata kommt mit Vlado. Sie bringt das Brett aus Skela mit, in eine Wolldecke gewickelt: „MALA · 15.1.1994“.
  - Höflichkeit auf beiden Seiten, unbeweglich. Nada: „Na grobu moje kćerke piše kako se zove.“ – „Auf dem Grab meiner Tochter steht, wie sie heißt.“ Zlata: „Kod mene se zvala Mala. Tako je htjela.“ – „Bei mir hieß sie Mala. So wollte sie es.“
  - Mala: „Ich sage nichts. Ich habe gesagt: zusammen.“ (Rätsel 7.1)
- **Ana, Mia und Niko** kommen spät mit dem Taxi vom Flughafen [Recherche]. Niko sieht Mala: „Das Mädchen!“ Er winkt, sie winkt zurück. Ana: „Niko, das ist Onkel Marko.“

#### Nacht 1 „Atem“

- **Pension, Markos Zimmer.** Marko haucht die kalte Scheibe an, um hinauszusehen. Mala zieht im Beschlag eine Drei. Beide erstarren, dann die zwei Proben. Darauf folgt das frühe Schlüsselgespräch (9.1).
- **Brauerei, nachts, mit dem blauen Kanister.**
  - Ein Mann in Gummischürze, die Ärmel nass bis zum Ellbogen: „Kanister? U red.“ Er stellt Marko hinten an.
  - Er liest „VUKOVIĆ“: „Vuković? Inženjer je otišao naprijed pitati za pritisak. Ti čekaj.“ – „Der Ingenieur ist nach vorn, nach dem Druck fragen. Du wartest.“
  - Er lebt im 19. April 1993. An den Kasten hinter dem Hahn lässt er niemanden: „Ne diraj kutiju!“ – „Fass den Kasten nicht an!“ (Rätsel 7.2)

#### Tag 2 „Freitag“

- **9:00 Gerichtsmedizin.**
  - Kolar, ein heller Gang, eine weiße Kiste mit einer Nummer. Der Rechenschieber „Z. V.“ liegt in einem Beutel. Jasna: „Ich will ihn sehen.“ Sie legt die Hand auf den Deckel. Gezeigt wird nichts weiter.
  - Jasna: „Zdravo, Zorane.“
  - Mala, nur zu Marko: „Hier ist keiner. Er ist nirgends geblieben.“ Zoran war nie ein Geist; Kapitel 4: „Er wartet nicht.“
  - Kolar übergibt den Rechenschieber. Jasna: „Er hat auf alles seinen Namen geschrieben.“
  - Zum Grab an der Brauerei: „Sieben Tote. Vier haben einen Namen. Drei nicht.“
  - Auf Markos Frage: „Eine Liste mit Beschreibungen? Dann hätten wir eine Spur.“
  - Je nach Variante sagt Kolar: „Mit Ihrer Probe aus Mostar …“ oder „Mit Ihrer Probe aus dem Konsulat …“. In der Variante „nein“ ergänzt sie: „Nicht mehr wahrscheinlich. Sicher.“
- **Brauerei:** die Liste und der Abschied des Brunnenmanns (7.2). Die Liste geht vor zwölf zu Kolar.
- **Bis 13:30 der Stein** (7.1): Nedžad graviert, Vlado montiert Tafel und Brett an einen Eichenpfosten.
- **14:00 Lanas Begräbnis, Friedhof Bare.**
  - Anwesend sind Nada, Zlata, Vlado, Jasna, Ana und die Kinder, Marko, Hajra, Dragica, Šehić, Kolar. Damir kommt in Uniform, in seiner Pause, wenn Marko ihn eingeladen hat.
  - Mala steht neben Nada. Sie sieht den Pfosten: „LANA DELIĆ · 3. 3. 1976“, darunter das Brett „MALA · 15.1.1994“. Mala: „Jetzt passen sie zusammen.“ Das ist Lanas Satz über die Fotohälften von 1993 (`97_k2_mala.js:114`).
  - Zlata setzt einen Ableger vom Quittenbaum aus Skela ([E] `KAPITEL4_KONZEPT.md:1699`). Mala: „Schief.“ Zlata rückt ihn gerade, ohne zu wissen, warum.
  - Niko winkt zum leeren Platz neben Nada. Nada sieht hin, wie in Skela (`skela_l.js:337`).
  - Wahl für Marko: „(Eine Schaufel Erde.)“ oder „(Stehen bleiben.)“. Beides ist richtig. Mala, später: „Du hast nicht weggesehen.“
- **Abends Totenmahl bei Nada.**
  - Jasna gibt die Dose zurück, wenn `nada` gesetzt ist: „Voll.“ Nada: „Hvala.“ Mehr nicht. Danach eine Viertelstunde über Plätzchen.
  - Ana gibt Nada **Lanas Zeichnung von 1990**, eine Straßenbahn mit einem Gesicht in jedem Fenster (`13_k4_notes.js:23`; `97_k4_fam_b.js:306`). Nada sieht lange hin: „Tako je crtala. Uvijek lica u prozorima.“ – „So hat sie gezeichnet. Immer Gesichter in den Fenstern.“
  - Jasna sitzt nah an der Tür und geht früh. Zlata und Nada spülen zusammen ab.
  - Spätestens hier kann der Spieler die Fahrscheine zuordnen (7.3).

#### Nacht 2 „Bis es hell wird“ (Žuta tabija)

- Malas Frage an sich selbst und Markos ehrliche Antwort (9.2).
- Mala entscheidet: Am Samstag geht sie. Davor will sie noch einmal ihren Samstag.
- Sie gibt ihm die Dose. Im Licht der Morgendämmerung wird sie in seiner Hand stofflich.
- Morgengrauen. Marko: „Sretan rođendan.“ – „Sechsunddreißig.“ – „Siebzehn.“ – „Beides.“
- **Punkt ohne Rückkehr**, mit Warnung und eigenem Spielstand (6.9).

#### Höhepunkt „Zehn nach elf“ (Samstag, 3. März, Lanas 36. Geburtstag)

Die genaue Abfolge steht in 7.3 und 8. In Kürze:
- 11:00 siebter Stock, Šehić sperrt auf. 11:05 gibt Marko Jasna die Fahrscheine.
- 11:10 klopft **Jasna** bei Nada, zweimal kurz, einmal lang. Drinnen hört Mala zum ersten Mal ihr eigenes Klopfen von innen.
- Nadas Küche: Marko haucht, Lana zeichnet, Marko setzt die Räder. Nada: „Stigla si.“
- 11:44 die Drei. Jasna am Fenster, Nada daneben, beide Fahrscheine entwertet.
- Endstation: Hajra mit zwei Taschen. Rade zählt: „Dva.“
- Der Weg nach Vratnik. Ružas Tor: „Kommst du?“ – „Nein.“ Mala geht durch die offene Tür.
- **Nachklang:** Mittagessen unter dem Dach. Nada stellt sechs Tassen hin, nicht sieben.

#### Sonntag (Karte)

„Sonntag. Zlata fährt mit Vlado nach Hause. Sie lässt Nada einen zweiten Ableger da, falls der erste nicht angeht.“

#### Epilog „Montag“ (5. März)

- **Am Morgen** füllt Marko den Kanister an der Brauerei. Keiner steht an, der Kopf ist still. Er trägt ihn hinauf nach Vratnik, spielbar, ohne Hindernis. „Keinen Tropfen verschüttet.“
- **Zorans Begräbnis auf Bare.**
  - Auf der Tafel steht „ZORAN VUKOVIĆ · 1951 – 1993 · poginuo 19. 4. 1993“. Es ist Ružas Wort, das sie 1993 schreiben wollte (`13_k4_notes.js:26`). Wie es auf die Tafel kommt, steht in 11.1.
  - Jasna hat ein Doppelgrab gekauft: „Ich bin ohne dich gefahren. Zurück nicht.“
- **Unter Ružas Dach.** Kaffee aus Ružas Džezva, mit dem Wasser von der Brauerei. Dazu SMS und Varianten (11.1).
- **Die letzte Handlung:** Marko zeichnet auf die beschlagene Küchenscheibe eine Straßenbahn mit einer Drei, und die Räder stimmen (9.4).

### 4.6 Die Ermittlungen

| Strang | Frage | Hauptorte | Kooperationsrätsel |
|---|---|---|---|
| **A „Lana und Mala“** | Was steht auf Lanas Grab, wenn zwei Frauen sie verschieden genannt haben? | Nada, Kazandžiluk, Bare | 7.1 (widersprüchliche Aussagen, Übersetzung, Nachhall) |
| **B „Nemoj gledati“** | Wer hielt Marko fest, und was hat er seitdem getan? | Brauerei, Ružas Dachboden, Gerichtsmedizin | 7.2 (Nachhall und Rekonstruktion, Innen und Außen) |
| **C „Zehn nach elf“** | Wer braucht die Fahrscheine? Wie kommt Lana selbst nach Hause? | Haus 7, Pension, Žuta tabija, die Drei, Vratnik | 7.3 (mehrstufige Schlussfolgerung, räumliches Zusammenspiel, gemeinsame Zeichnung; trägt den Höhepunkt) |
| Nebenstrang Jasna | Kann sie zurück? | Busbahnhof, Vratnik, Haus 7 | Gespräch, Ortswahl |
| Nebenstrang Zoran | Identifizierung, Begräbnis, das Wort | Gerichtsmedizin, Bare, Brauerei | Epilog |
| Nebenfiguren | Rade, Damir, Dragica, Šehić, Hajra, Nedžad | Endstation, Haus 7, Kovači | kurze Szenen, teils optional |

### 4.7 Die Enthüllungen und was sie neu ordnen

1. **Der Atem** (Donnerstagnacht).
   - Mala zeichnet in Markos Atem und nur dort.
   - Neu geordnet wird die Straßenbahn auf der Scheibe in Split (`flat.js:232`). Das Rätsel aus Kapitel 1 bekommt eine Bedingung, ohne dass Kapitel 1 umgedeutet wird. [N]
2. **Der Brunnenmann** (Donnerstagnacht und Freitag).
   - Der Mann, der vorn die Hand hob (`97_k4_fam_b.js:142`), und der Mann, der Marko festhielt (`:41`), sind derselbe: Hamdija Selimović, der Abfüller der Brauerei, der 1993 den Hahn verwaltete [N].
   - Er begrub in der Nacht die sieben Toten an der Mauer. Jedem steckte er in die Tasche, was ihn erkennbar machte, und er schrieb eine Liste.
   - Neu geordnet wird Kolars Satz aus Kapitel 4: Dass man Zoran am Rechenschieber „Z. V.“ erkannte, war kein Zufall. Hamdija hat ihn ihm aus der Hand genommen und in die Brusttasche gesteckt.
3. **Zwei Namen, ein Zweck** (Donnerstag und Freitag).
   - Zlata ließ „MALA“ ins Brett schneiden, „damit man sie findet“. Nada schrieb siebzehn Jahre „Lana Delić“, „damit man sie findet“.
   - Neu geordnet werden das Brett aus Kapitel 3 und Nadas Briefe aus Kapitel 2. Beide waren Suche, nicht Besitz.
4. **Die Fahrscheine gehören Jasna** (Donnerstag und Freitag).
   - Neu geordnet werden „der, die sie braucht“ (Kapitel 4), „Ich setze mich ans Fenster“ (Kapitel 4) und „In der Drei sitze ich am Fenster und sie daneben“ (Kapitel 2).
5. **Lanas Straßenbahn** (Samstag).
   - Nada erkennt die Gesichter in den Fenstern aus Anas Zeichnung wieder. Ihr Satz „Sie ist nie angekommen“ wird zu „Stigla si.“
6. **Was Lana im Licht sieht** (Samstag).
   - Ružas Küche und ihren Vater. Esads Satz aus Kapitel 2, „Die Kleine kommt, wenn sie fertig ist. Sie war nie pünktlich.“ (`stan.js:13`), wird zu Lanas letztem Satz: „Jetzt bin ich fertig.“

Keine dieser Wendungen ändert eine Tatsache aus Kapitel 1 bis 4. Jede ordnet etwas Belegtes neu.

### 4.8 Höhepunkt und Ende in Kürze

- **Höhepunkt:** Lanas letzter Samstag. Jasna holt Nada mit Lanas Klopfen. Lana zeichnet in Markos Atem ihre Straßenbahn auf Nadas Küchenscheibe, und Nada sagt: „Stigla si.“ Die Mütter fahren die Drei. An Ružas Tor sagt Marko die Wahrheit, „Nein“, und lässt los. Lana geht selbst über die Schwelle.
- **Ende:** Zoran wird mit Ružas Wort begraben. Unter dem Dach trinkt die Familie Kaffee mit dem Wasser, das Marko getragen hat. Marko zeichnet zum ersten Mal selbst eine Straßenbahn, mit Rädern. Der Beschlag vergeht, die Zeichnung mit ihm, dahinter liegt die Stadt.

---
## 5. Abschließende Figurenentwicklung

### 5.1 Marko

- **Ausgangshaltung:**
  - „Ich bringe sie nach Hause.“ Das ist seit Mostar sein Versprechen (`skela_l.js:270`).
  - Er hat 1993 das Wasser getragen, er hat 2011 den Satz für die Familie getragen. Er ist einer, der trägt.
  - Aus Kapitel 4 bringt er dazu die Überzeugung mit, dass die Wahrheit, richtig gesagt, genügt.
- **Letzte Herausforderung:** Hier reichen Tragen und Wahrheitsagen nicht.
  - Lana will nicht gebracht werden. Sie will kommen.
  - Und seine Wahrheit ist diesmal ein Wunsch: dass sie bleibt. Wer einen Wunsch ausspricht, kann damit festhalten.
  - Zugleich muss der Übersetzer, der „übersetzt, was Menschen meinen“ (`97_k2_limbo.js:42`), im entscheidenden Moment **nicht** übersetzen. Sonst wird Lana zur Nachricht.
- **Eigene Entscheidungen**, die ihm keiner abnimmt:
  1. Was er Mala in der Freitagnacht antwortet. Die Antworten sind ehrlich und verschieden, keine ist falsch (9.2).
  2. Dass er Jasna die Fahrscheine gibt und dann zurücktritt. Er sagt ihr nicht, was sie tun soll.
  3. Dass er an Ružas Tor „Nein“ sagt und ihre Hand loslässt.
  4. Dass er am Montag das Wasser selbst trägt.
- **Sichtbare Handlung** (statt Erklärung):
  - Er gibt seinen Atem für ihre Zeichnung.
  - In Nadas Küche schweigt er.
  - Am Tor sagt er „Nein“ und lässt los.
  - Den Brunnenmann erlöst er, indem er ihm sagt, wozu der Rechenschieber in der Tasche gut war.
  - Am Ende zeichnet er Räder, die stimmen.
- **Endzustand:**
  - Er hat eine Familie, mit der er redet, und einen Vater mit Grab und Wort.
  - Er hat eine Stadt, in der er gewesen ist, ohne zu fliehen.
  - Er weiß, dass er mit den Toten reden kann. Finden kann er sie ohne Mala nicht, so verteilt die Reihe die Gaben seit Kapitel 1 ([E] `KONZEPT.md:81–83`; im Spiel `m_find`, „Ich kann sie finden.“, `11_notes.js:159`). Das Kopfweh bedeutet von jetzt an: Da wartet einer. Er hält dann an, statt es wegzudrücken.
  - Er bleibt Übersetzer. Den dritten Teil der „Stillen“ schreibt er über Lana (11.1).
- **Was von früher bleibt:**
  - Der trockene Ton bleibt.
  - Die schiefe Mütze bleibt auch: Lana rückte sie jeden Samstag gerade, und er zog sie wieder schief (`97_k2_mala.js:110`). Am Tor wählt der Spieler, ob er sie schief lässt. Beides ist Marko.

### 5.2 Mala

- **Was sie über sich versteht:**
  - Wer sie war, wie sie starb, warum sie „Mala“ hieß (Kapitel 2 und 3).
  - Dass ihre Nähe Marko etwas kostet (`skela_l.js:286`).
  - Dass Bleiben festhalten kann (Gerda) und dass man auch ohne Schwelle gehen kann (Hansi) (`97_k4_mala.js:50–52`).
- **Was für sie ungeklärt ist:**
  - wie sie „selbst“ ankommt, wenn Mama sie nicht hört;
  - wem die Fahrscheine gehören;
  - ob sie gehen will, und aus welchem Grund. Sie misstraut dem Grund „wegen seines Kopfes“, weil er nach Gerda klingt.
- **Was sie erreichen oder beenden will:**
  - dabei sein, wenn Mama und Zlata entscheiden;
  - noch einmal Samstag haben, um zehn nach elf, und diesmal ist Mali fertig;
  - die Fahrscheine der geben, die sie braucht;
  - selbst zu Mama kommen;
  - dann ankommen.
- **Welche Handlung von ihr ausgeht:**
  - Nachhall des Bretts, der Briefe, des Hahns, der Kanister;
  - der Gang durch die Wand in den Kasten der Brauerei;
  - die Zurückhaltung bei der Grabtafel: Sie entscheidet nicht für die Mütter. Das ist eine Handlung;
  - die Zeichnung in Markos Atem;
  - die Entscheidung in der Freitagnacht;
  - das Öffnen der eigenen Schwelle und der letzte Schritt.
- **Was sie bewusst annimmt oder ablehnt:**
  - Sie lehnt Markos Wunsch ab, wenn er sagt, dass sie bleiben soll. Sie tut es ohne Vorwurf.
  - Sie lehnt das Gehen als Opfer ab („Nicht wegen deines Kopfes.“).
  - Sie nimmt an, dass sie angekommen ist.
- **Endzustand:**
  - Am Samstag, dem 3. März 2012, gegen 12:40, geht Lana durch die offene Tür von Ružas Haus in Vratnik. Sie öffnet die Schwelle selbst und macht den letzten Schritt allein.
  - Im Licht sieht sie Ružas Küche, den warmen Herd, die Quitten auf dem Schrank und ihren Vater am Tisch. Er sagt, sie sei zu spät.
  - Sie ist nicht mehr in der Welt.
  - Zurück bleiben die Fahrscheine bei Jasna, die Zeichnung von 1990 bei Nada, ihr Name zweimal auf einem Pfosten und Markos Räder.

### 5.3 Die Beziehung

- **Was beide voneinander gelernt haben, und wo es im Finale entscheidet:**
  - **Er von ihr:** dass man jemanden nicht holen kann, man kann nur da sein, wenn er kommt (die Busnacht; Lanas „Ich hole Mali“). Darum gibt er Jasna die Fahrscheine und tritt zurück.
  - **Sie von ihm:** dass Schonen einsperrt (Kapitel 4, Hackerbrücke). Darum verlangt sie seine ehrliche Antwort, bevor sie sagt, was sie tut, und sie sagt ihm ihren wirklichen Grund.
  - **Beide:** wo die Grenzen des anderen liegen. Er kann ihre Toten nicht finden, sie kann nichts anfassen. Darum zeichnen sie die Straßenbahn **zusammen**: sein Atem, ihre Linie, seine Räder.
- **Kein später Streit.** Die Spannung kommt aus echten Zielen. Er will, dass sie bleibt, sie will ankommen. Beide sagen es.
- **Mala verändert Markos Haltung.**
  - „Du bringst mich nicht. Ich komme.“ Damit wird aus dem, der trägt, einer, der begleitet.
  - Und als er das Kopfweh als ihren Grund anbietet: „Den Grund suche ich mir selbst aus.“
- **Marko prüft Malas Deutung.**
  - Ihre Vermutung, die Dose sei für Nada, stellt er in Frage: „Nada war nie samstags dabei.“
  - Ihren Grund prüft er auch: „Ist es wegen meines Kopfes? Dann bleib.“ Sie muss den Grund finden, der ihrer ist.
- **Zusammenarbeit bis zuletzt.** Im Höhepunkt handeln beide bis zum letzten Schritt. Die Trennung kommt erst an der Schwelle.
- **Was die Beziehung am Ende erreicht hat:**
  - Zwei Kinder, die einander eine Fahrt versprochen haben, haben sie zu Ende gebracht. Eine Lüge („Ich komme“) wurde durch eine Wahrheit („Nein“) ersetzt.
  - Der Faden, den sie gemacht haben, wird nicht abgerissen. Sie lassen ihn zusammen los: Er öffnet die Hand, sie geht.

### 5.4 Lebende Nebenfiguren

| Figur | Eigenes Interesse in Kapitel 5 | Konkrete Folge |
|---|---|---|
| **Jasna** | Zurückkommen, ohne wegzusehen; Zoran sehen; Nada gegenübertreten | Sie klopft Lanas Zeichen im neunten Stock, sitzt in der Drei am Fenster und kauft ein Doppelgrab. „Drunter“ |
| **Nada** | Lana begraben; das Warten beenden; nicht schon wieder eine Nachricht bekommen | Sie lehnt „STIGLA JE“ auf der Tafel ab: „Das sage ich, wenn es stimmt.“ Am Samstag sagt sie „Stigla si.“ Im Januar 2013 schreibt sie keinen Brief (Abspannbild) |
| **Zlata** | Dass der Name bleibt, den Lana selbst gesagt hat, und dass ihre achtzehn Jahre zählen | Das Brett steht unter der Tafel. Sie spült mit Nada ab und lässt einen Ableger da |
| **Ana** | Ihrem Vater ein Grab geben; Lanas Zeichnung dorthin bringen, wo sie hingehört | Sie gibt Nada die Zeichnung. „Es tropft nicht.“ |
| **Mia (7)** | Straßenbahn fahren | Sie entwertet ihren Fahrschein lauter als alle |
| **Niko** | Das Mädchen | Er winkt am Grab und in der Drei. „Das Mädchen ist weg.“ am Montag |
| **Hajra** | Ružas Haus warm halten; dass einer kommt | Feuer im Herd, die Tür offen, zwei Taschen an der Endstation |
| **Nedžad** | Genau gravieren | Die Tafel, die ins Brett passt |
| **Rade** | Zählen, was er sieht | „Dva.“ |
| **Damir** | Fahren | Er fährt die Drei um 11:44. Zu Nada: „Lieber zu viele Fenster als zu wenige.“ (`97_k2_talk.js:138`) |
| **Šehić** | Dass man weiß, wer hier gewohnt hat (`haustor.js:16`) | Er sperrt die leere Wohnung im siebten Stock auf |
| **Dragica** | Jasna wiedersehen | Ein Satz zum 19. April, ohne die Frage „für Dragica“ zu klären (1.8) |
| **Frau Kolar** | Namen | Drei weitere Identifizierungen aus Hamdijas Liste (SMS im Epilog) |
| **Vlado** | Zlata fahren, etwas mit den Händen tun | Er montiert den Pfosten |
| **Vesna** | Seite vierzehn | „Die Stillen, Teil drei“ (Epilog) |

### 5.5 Geister

- **Mala.** Siehe 5.2. Ihr Übergang ist ein eigener Vorgang: keine Erkenntnis des Todes (die hat sie längst), keine Instabilität, sondern eine bewusste Schwelle, die sie selbst öffnet.
- **Hamdija Selimović, der Brunnenmann** [N], Abfüller der Brauerei, 1949 bis 1993 (zu prüfen auf ungewollte reale Namensgleichheit, 12.5):
  - **Eigenes Interesse:** Er will den Familien sagen, wo ihre Toten liegen. Und er will dem Jungen, den er festhielt und dann allein mit dem Wasser weggehen ließ, sagen, wo der Vater begraben ist.
  - **Seine Scham:** „Ich habe gezählt, statt zu weinen.“ Das ist eine [E]-Idee für den früheren Totengräber, `KAPITEL4_KONZEPT.md:1696`.
  - **Sein Zustand:** Er glaubt, es sei April 1993. Er zeigt sich nur Kanistern und lässt niemanden an den Kasten hinter dem Hahn.
  - **Erkenntnis:** Als Marko ihm sagt, dass die Gräber 2003 gefunden wurden und dass die Liste jetzt drei Namen zurückgibt, fragt er: „Koja je godina?“ – „Welches Jahr?“
  - **Übergang:** Mala öffnet die Schwelle, Marko macht den letzten Schritt mit ihm. Im Licht sieht er: „Česma. Teče. I niko ne čeka.“ – „Der Hahn. Er läuft. Und keiner wartet.“
  - **Hamdija ist kein Retter.** Er löst keinen Konflikt der Hauptfiguren. Zorans Identität steht durch den Abgleich fest. Er gibt drei anderen Familien einen Namen und Marko einen Zeugen.
- **Keine erlösten Geister kehren zurück.** Jakov, Ivka, Zora, Alija, Bato, Sepp, Gerda und Hansi bleiben gegangen oder, wie Jakov, freiwillig an ihrem Ort.
  - Erwähnt werden sie nur in Malas Sätzen: „Jakov hat gefragt, wo ich hin soll.“ (`sustipan.js`, „Und du, mala? Wo sollst du hin?“)

### 5.6 Rückbezüge mit Funktion

| Rückbezug | Fundstelle | Funktion in Kapitel 5 |
|---|---|---|
| Straßenbahn auf der beschlagenen Scheibe, Split | `flat.js:232`; `office.js:59` | Grundlage der Zeichnung; das letzte Bild kehrt sie um: „Ich habe sie gemalt.“ |
| „Ich habe dir das Zeichnen beigebracht, und du hast es nie gelernt.“ – „Die Räder.“ | `carsija.js:75` | Markos Räder am Samstag schief, am Montag richtig |
| Samstag 11:10, zweimal kurz, einmal lang; Fenster und daneben | `97_k2_mala.js:110`; `13_k4_notes.js:20` | Jasnas Klopfen; die Plätze der Mütter |
| Großmutters Tor, „Kommst du?“ – „Ich komme.“ | `97_k2_mala.js:114` | „Kommst du?“ – „Nein.“ |
| „Für die erste Drei nach dem Krieg.“ | `12_k2_items.js:83` | die Fahrt der Mütter |
| „Die Kleine kommt, wenn sie fertig ist.“ | `stan.js:13` | „Jetzt bin ich fertig.“ |
| „Sie ist nie angekommen.“ | `stan.js:11–12` | „Stigla si.“ |
| „Wo ich liegen soll, entscheiden Mama und Zlata. Zusammen.“ | `skela_l.js:282` | Rätsel 7.1 |
| „Wenn wir uns wiedersehen, passen sie zusammen.“ | `97_k2_mala.js:114` | Tafel und Brett |
| Nada hält den Platz neben sich frei; sieht auf den leeren Platz | `ostbus.js:118`; `skela_l.js:337` | Küche: „Stigla si.“, zum leeren Platz gesagt |
| „Nemoj gledati, mali.“ – „Ich habe hingeschaut.“ | `97_k4_fam_b.js:41–42` | Hamdija; Marko sieht am Tor hin, bis nichts mehr zu sehen ist |
| „Vorn hebt einer die Hand.“ | `97_k4_fam_b.js:142` | Hamdijas Hand: „Ima pritiska!“, „Der Druck ist da!“ |
| Rechenschieber „Z. V.“ | `13_k4_notes.js:30` | Hamdija steckte ihn in die Tasche; Jasna bekommt ihn zurück |
| Kanister „VUKOVIĆ“ | `97_k4_fam_b.js:34` | Auslöser für Hamdija; Wasser am Montag |
| Ruža wollte „poginuo“ schreiben | `13_k4_notes.js:26` | Zorans Tafel |
| „Damit er reinkann, wenn er kommt.“ – „Wir können im März drunter sitzen.“ | `97_k4_fam_b.js:255–256` | Mittag am Samstag, Kaffee am Montag |
| „Dann jetzt. Alle. Bis es hell wird.“ | `97_k4_fam_b.js:209` | die Nacht auf der Žuta tabija |
| Gerda: „Gehen, weil ich bleibe.“ | `97_k4_mala.js:52` | Malas eigene Antwort in der Freitagnacht |
| Hansi: „Ohne Schwelle.“ | `97_k4_mala.js:50` | Mala wählt die Schwelle: „Die Stufe will ich selbst gehen.“ |
| „Wer losgelassen hat, kann etwas hergeben.“ | `97_k2_mala.js:48`; `97_k4_limbo_gerda.js:34` | Die Dose wird stofflich |
| Rade: „Dva putnika. Ich zähle, was ich sehe.“ | `carsija.js:53` | „Dva.“ an der Endstation |
| Mala in Kapitel 2 auf der Bank: „Dann ist es die falsche Zeit.“ | `carsija.js:16` | Samstag: die richtige Zeit |
| Hajra: „Wir können gehen. Hajra lässt die Tür offen.“ | `vratnik.js:7` | die offene Tür, durch die Lana geht |
| Lanas Zeichnung von 1990, Gesichter in den Fenstern | `13_k4_notes.js:23`; `wiesn.js:22` | Nada erkennt die Hand |
| Drei Tassen | `97_k4_fam_b.js:290` | Sechs Tassen. Nada weiß es, ohne zu fragen |

---

## 6. Spielbare Kapitelstruktur

### 6.1 Phasen und Tagesbedingungen [N]

| Phase | Karte | Bedingung zum Weitergehen |
|---|---|---|
| Prolog | „Ankunft · Donnerstag, 1. März 2012 · früh“ | Dachboden besucht; Haus 7: Jasna im siebten Stock; Nada begrüßt |
| Tag 1 | „Donnerstag“ | Abend bei Nada mit Zlata erlebt; Brauerei besucht (Kopfweh, Nachhall am Hahn) |
| Nacht 1 | „Donnerstag · Nacht“ | Atem entdeckt (Gespräch 9.1); Hamdija mit dem Kanister gesehen |
| Tag 2 | „Freitag, 2. März“ | Gerichtsmedizin; Hamdija erlöst und Liste bei Kolar (7.2); Tafel graviert und montiert (7.1) |
| Begräbnis | „Freitag · 14 Uhr · Friedhof Bare“ | durchgehend, ohne Rätsel |
| Abend 2 | „Freitag · Abend“ | Totenmahl; Zuordnung der Fahrscheine gezogen (7.3, Stufe 1) |
| Nacht 2 | „Freitag · Nacht · Žuta tabija“ | Gespräch 9.2; danach Punkt ohne Rückkehr |
| Höhepunkt | „Samstag, 3. März · Lanas Geburtstag“ | geführte Kette (7.3, Stufen 3 bis 6) |
| Sonntag | Karte | – |
| Epilog | „Montag, 5. März“ | Wasser, Begräbnis, Ružas Küche, letzte Handlung |

**Wenn die Fahrscheine bis zum Totenmahl noch nicht zugeordnet sind:**
- Der Freitagabend endet nicht, bevor die Zuordnung gezogen ist. Die nötigen Beobachtungen sind dann alle im Notizbuch (6.5).
- Das Hinweissystem führt in vier Stufen zur Verbindung (7.3).
- Es gibt keine Sackgasse. Fehlende Beobachtungen holt das Totenmahl nach: Jasna an der Tür, Nada mit der Zeichnung, Rades Satz als Wiedergabe durch Mala.

### 6.2 Die ersten 15 bis 20 Minuten

Ziel: kein Tutorial. Der Spieler soll merken, dass Marko und Mala eingespielt sind. Ein früher Erfolg öffnet eine neue Frage.

**Szene 1 – Im Bus** (Erinnerungsbild, etwa 1 Minute, ohne Steuerung)
- „Seit Ljubljana sagt Mama nichts. Bei Tarčin wird es hell. Sie sitzt am Fenster und sieht hinaus, die ganze Zeit. Diesmal sieht sie hin.“
- Mit `kurve`: „Bis zur Kurve hat sie damals zurückgesehen. Jetzt kommt sie von der anderen Seite.“

**Szene 2 – Busbahnhof, Bahnsteig** (etwa 3 Minuten)
- Hotspots: Koffer (zwei, beide schwer), Anzeigetafel, Kiosk (Fahrscheine, Zeitung), Mama, Taxistand. Mala steht unter der Tafel und ist nur für Marko sichtbar.
- **Kleiner Zwang ohne Rätsel:** Wenn Marko Mala vor Mama anspricht, reagiert Mama.
  - „Mit wem redest du?“ – „Mit dem Kiosk.“
  - Mala: „Du lügst schlecht. Immer noch.“
  - Man kann Mala mit „Später.“ vertrösten. Sie geht dann ein Stück voraus.
- **Taxi:** Mama soll sagen, wohin. Sie öffnet den Mund und schließt ihn wieder. Der Spieler wählt für Marko: „Kovači.“ oder „Vratnik.“ Beides geht. Mit „Vratnik“ fahren sie erst zum Haus, Hajra kommt mit dem Schlüssel nach.
- Am Kiosk kann man einen Fahrschein für die Drei kaufen. Er wird erst am Samstag gebraucht. Ohne ihn kauft Marko einen beim Fahrer, das ist kein Fehler (7.3).

**Szene 3 – Pension Hajra** (etwa 3 Minuten)
- Hajra umarmt Jasna, ohne zu fragen, wer sie ist: „Ružina snaha.“ – „Ružas Schwiegertochter.“
- Burek. Mačak setzt sich vor den leeren Stuhl neben Marko und starrt. Hajra: „Mačak gleda nekoga.“ Mala: „Er hat mich vermisst.“ Marko: „Er hat das Burek vermisst.“
- Schlüssel zu Ružas Haus; ein Satz zur Familie aus Foča.
- Optional Hajras Frage, wo Mala sei: „Die Kleine von damals? Die mit dem Mali?“ Hajra weiß aus Kapitel 2 nur, was Marko ihr gesagt hat. Marko: „Morgen ist ihr Begräbnis.“

**Szene 4 – Vratnik, Ružas Tor und Haus** (etwa 5 Minuten, früher Erfolg)
- **Tor:** Mala bleibt stehen: „Hier.“ Fragt Marko nach: „Später.“ Das Tor ist ab jetzt ein Ort mit Gewicht. Erklärt wird nichts.
- **Küche:** Herd warm, Tücher über den Möbeln (`kuca.js:38`), Quitten auf dem Schrank.
  - Jasna steht unter der Decke und sieht hinauf: „Achtzehn Jahre.“ Ana ist noch nicht da.
  - Jasna bittet: „Ružas Sachen. Zorans Sachen. Wo sind die?“ – Hajra: „Oben.“
- **Der Dachboden, ein kleines Kooperationsstück ohne Hinweisbedarf:**
  - Die Luke ist hinter dem verhängten Schrank nicht zu sehen.
  - Mala spürt sie: „Oben ist etwas Blaues.“ Marko zieht das Tuch weg und findet die Luke.
  - Die Hakenstange steht nicht da. Mala weiß aus dem Nachhall von Ružas Küche, wo Ruža sie hinstellte: „Hinter dem Herd. Sie hat immer gesagt, da stört sie keinen.“ Ein Satz von Mala, kein Suchen.
  - Oben liegen die zwei blauen Kanister mit „VUKOVIĆ“ in roter Farbe, Zeitungen von 1994 mit vertrockneten Quitten, der Schlüssel zum Zastava an einem Nagel und das leere Etui des Rechenschiebers mit „Z. V.“ auf dem Deckel.
- **Der Erfolg öffnet eine neue Frage:**
  - Marko nimmt einen Kanister. Sein Erinnerungsbild ist kurz, die Schlange und das Rot.
  - Mala liest den Nachhall: „Er malt die Buchstaben am Küchentisch. Er pfeift. Ruža schimpft wegen der Farbe.“ Dann: „Und da ist noch einer. Später. Eine Hand auf deinen Augen. Der Ärmel ist nass. Nemoj gledati, mali.“
  - Marko: „Wer?“ – Mala: „Ich weiß es nicht. Er riecht nach Malz.“ Neue Notiz `b5_hand` [Beobachtung].
  - Jasna steigt die Leiter hinauf, sieht die Kanister: „Er hat auf alles seinen Namen geschrieben.“ Dann: „Ich will sehen, wo es war.“ Neue Notiz `j5_wo` [Auftrag].

**Szene 5 – Haus 7** (etwa 5 Minuten)
- Mit dem Taxi. Jasna: „Nicht die Drei. Noch nicht.“ Neue Notiz `j5_nichtdrei` [Beobachtung].
- **Hof:** Das Hochhaus mit der ausgebrannten Uhr (`carsija.js:48`). Jasna zählt die Loggien: „Dritte von links.“ (`neboder.js:47`)
- **Eingangshalle:** Dragica: „Jasna! Vukovićka!“ Šehić und das Hausbuch von 1991: „Vuković (Zoran, Jasna, Marko, Ana)“. Jasna liest ihren eigenen Namen in fremder Schrift.
- **Treppe**, der Aufzug geht nicht. Dragica: „Fünfundzwanzig Jahre Aufzug …“
- **Siebter Stock:**
  - Jasna legt die Hand an die Tür: „Zweimal kurz, einmal lang. Jeden Samstag.“
  - Sie sieht die Treppe hinauf. „Ich kann da nicht hinauf. Ihre Tochter ist losgefahren, um meinen Sohn zu holen. Und ich bin ohne ihn gefahren.“ Neue Notiz `j5_treppe` [Beobachtung].
  - Mala hört es. Sie sagt nichts. Der Spieler sieht sie an der Wand stehen.
- Šehić: „Samstag um elf sperre ich die Wohnung auf, wenn Sie wollen.“ Neue Notiz `j5_samstag` [Gelegenheit].

**Ende der ersten 20 Minuten:** Marko geht allein zu Nada hinauf. Damit beginnt der freie Tag mit drei offenen Fragen:
- Wer hielt Marko fest?
- Wo war es, Mama will es sehen.
- Warum kann Mama nicht hinauf?

### 6.3 Rätselketten im Überblick

| Kette | Beginn | Schritte (Kurzform) | Ergebnis | Zusammenlauf |
|---|---|---|---|---|
| **A „Lana und Mala“** | Do Abend, Zlata kommt | Nachhall Brett → Nadas Mappe, Nachhall → Übersetzen an beide → Einigung → Nedžads Gravur → Vlado montiert | Pfosten mit Tafel und Brett | Begräbnis Fr 14:00 |
| **B „Nemoj gledati“** | Do, Dachboden: die Hand | Brauerei: Kopfweh, Nachhall „Kanisteri u red“ → nachts mit dem Kanister: Hamdija → Gerichtsmedizin: „drei ohne Namen“ → Kasten: Mala durch die Wand, Hamdija überzeugen → Liste → Kolar → Hamdijas Erkenntnis und Übergang | Drei Namen; Marko hat einen Zeugen | Begräbnis (Kolar kommt); Montag (Wasser) |
| **C „Zehn nach elf“** | Do, Gespräch 9.1: „Für Mama. Wer sonst?“ | Vermutung Nada → Nada: „euer Samstag“ → Jasna: Treppe, „Nicht die Drei“ → Fenster und daneben → Zuordnung Jasna → Entscheidung Fr Nacht → Samstag: 7. Stock, Klopfen, Küche (Zeichnung), Drei, Tor | Lana kommt selbst nach Hause; Mala geht | Höhepunkt |
| Nebenkette „Atem“ | Do Nacht | Entdeckung → zwei Proben → Grenzen | Werkzeug für C | Küche am Samstag |
| Nebenkette Jasna | Do früh | Dachboden → Haus 7 → Šehićs Angebot → Gerichtsmedizin → Totenmahl | Jasna im siebten Stock am Samstag | C |

### 6.4 Abhängigkeiten und Zusammenlauf

```
Donnerstag früh (geführt): Bus → Hajra → Vratnik/Dachboden ──┐
                                                              ├─► Haus 7: Jasna im 7. Stock (j5_treppe, j5_samstag)
                                                              │
Donnerstag (frei, beliebige Reihenfolge):                     │
  Nada (9. Stock): Zimmer, Mappe, „euer Samstag“ ─────────────┤
  Kazandžiluk: Nedžad, Frist Fr 12:00 ────────────────────────┤
  Brauerei: Kopfweh, Nachhall „Kanisteri u red“ ──────────────┤
  (opt.) Endstation: Rades Heft „Fenster und daneben“ ────────┤
  Abend: Zlata + Brett (Pflicht) ─────────────────────────────┘
                     │
Donnerstagnacht: Pension: ATEM (Pflicht) ── Brauerei mit Kanister: FIKRET (Pflicht)
                     │                                    │
Freitag früh:  Gerichtsmedizin („drei ohne Namen“) ───────┤
                     │                                    ▼
               A: Nachhall Brett + Mappe → Einigung     B: Kasten → Liste → Kolar → Hamdija geht
                     │        (beide vor 13:30, Reihenfolge frei)
                     ▼
Freitag 14:00: BEGRÄBNIS (setzt A voraus; B empfohlen, Pflicht vor der Nacht)
                     │
Freitag Abend: Totenmahl → C Stufe 1: Zuordnung „Jasna“ (Pflicht vor der Nacht)
                     │
Freitagnacht: Gespräch 9.2 → Entscheidung → Dose stofflich → PUNKT OHNE RÜCKKEHR
                     │
Samstag (geführte Kette): 7. Stock → Klopfen → Küche/Zeichnung → Drei → Endstation → Tor
                     │
Sonntag (Karte) → Montag: Wasser → Bare → Ružas Küche → letzte Handlung
```

- **Parallel möglich:** Am Donnerstag sind alle vier Ziele frei: Nada, Nedžad, Brauerei, Endstation. Am Freitagvormittag sind A und B in beliebiger Reihenfolge lösbar.
- **Zusammenlauf:** Das Begräbnis braucht A. Die Freitagnacht braucht B und die Zuordnung aus C. Der Samstag braucht den Atem und die Dose.
- **Ohne Sackgasse:**
  - Der Kanister bleibt im Inventar, bis Hamdija gegangen ist.
  - Die Tafel kann nicht falsch graviert werden. Nedžad fragt nach, bevor er graviert (7.1).
  - Wenn der Spieler die Brauerei am Freitag nicht vor 14:00 beendet, geht es nach dem Begräbnis weiter. Kolar ist bis zum Abend erreichbar, und Hamdija wartet sowieso.

### 6.5 Das Notizbuch: Beobachtung, Vermutung, gesicherte Erkenntnis [N]

Fallkürzel nach dem Muster der früheren Kapitel: `s5` Stein (A), `b5` Brauerei (B), `f5` Fahrscheine (C), `j5` Jasna, `a5` Atem.

| Notiz | Art | Inhalt (Notizbuchtext, gekürzt) | Quelle |
|---|---|---|---|
| `a5_atem` | Erkenntnis | „In meinem Atem kann sie zeichnen. Nur in meinem.“ | Nacht 1 |
| `a5_grenze` | Erkenntnis | „Auf dem Spiegel nicht, bei Mia nicht. Die Linie hält ein paar Sekunden.“ | Nacht 1, zwei Proben |
| `s5_brett` | Beobachtung | „Zlatas Brett: MALA · 15.1.1994. Bato hat es geschnitten.“ | Do Abend |
| `s5_tafel` | Beobachtung | „Nadas Tafel bei Nedžad: Text offen. ‚Es kommt noch jemand.‘“ | Do |
| `s5_nh_brett` | Beobachtung (Mala) | „Zlata hält die Lampe: ‚Schreib, wie sie gesagt hat. Mala. Damit man sie findet.‘“ | Nachhall |
| `s5_mappe` | Beobachtung | „Siebzehn Briefe an den Suchdienst. Jeder fängt an mit: Lana Delić, geboren 3. 3. 1976.“ | Do |
| `s5_nh_mappe` | Beobachtung (Mala) | „Mama sagt den Namen laut, bevor sie schreibt. ‚Da je nađu.‘ – ‚Damit man sie findet.‘“ | Nachhall |
| `s5_beide` | Erkenntnis (Verbindung) | „Beide haben ihren Namen geschrieben, damit man sie findet. Jede einen anderen.“ | `s5_nh_brett` + `s5_nh_mappe` |
| `s5_teile` | Erkenntnis (Verbindung) | „Das Brett hat den Tod. Nadas Tafel braucht nur die Geburt.“ | `s5_beide` + `s5_brett` |
| `b5_hand` | Beobachtung (Mala) | „Eine Hand auf meinen Augen. Nasser Ärmel. Malz.“ | Dachboden |
| `b5_reihe` | Beobachtung (Mala) | „Am Hahn, nachts: ‚Kanisteri u red!‘ Er zeigt sich Kanistern.“ | Brauerei Do |
| `b5_hamdija` | Beobachtung | „Ein Mann in Schürze. Er lebt im April 1993. ‚Fass den Kasten nicht an!‘“ | Nacht 1 |
| `b5_drei` | Beobachtung | „Kolar: sieben Tote im Grab an der Brauerei, drei ohne Namen.“ | Gerichtsmedizin |
| `b5_kasten` | Beobachtung (Mala) | „Im Kasten ein Einmachglas, darin Papier, zusammengerollt.“ | Mala durch die Wand |
| `b5_liste` | Erkenntnis | „Hamdijas Liste: sieben Tote, sieben Dinge in sieben Taschen. Nummer drei: Rechenschieber, Z. V.“ | Kasten |
| `f5_dose` | Vermutung | „Die Dose ist für Nada. Sagt Mala.“ | Gespräch 9.1 |
| `f5_eursamstag` | Beobachtung | „Nada: ‚Das war euer Samstag. Ich war nie dabei.‘“ | Nada Do |
| `j5_treppe` | Beobachtung | „Mama kann nicht in den neunten Stock.“ | Haus 7 |
| `j5_nichtdrei` | Beobachtung | „Mama will nicht mit der Drei fahren. ‚Noch nicht.‘“ | Taxi |
| `f5_plaetze` | Beobachtung | „Samstags: ich am Fenster, sie daneben.“ | Erinnerung aus Kapitel 2 (`97_k2_mala.js:110`), automatisch im Notizbuch; neu: Rades Heft |
| `f5_tuer` | Beobachtung | „Mama hat Lana jeden Samstag die Tür aufgemacht.“ | Kapitel 4 (`97_k4_mala.js:83`); neu: Jasna im 7. Stock |
| `f5_wem` | Vermutung, geändert | „Nicht Nada. Die Fahrscheine gehören zu den Samstagen.“ | `f5_dose` + `f5_eursamstag` |
| `f5_jasna` | Erkenntnis | „Die Fahrscheine sind für Mama. Zwei Plätze, Fenster und daneben. Damit sie Nada holt, wie Lana den Mali.“ | 7.3 |

### 6.6 Dialoge, die auf Erkenntnisse reagieren

- **Kein Durchklicken nach jedem Fund.** Neue Gesprächszeilen erscheinen nur bei den Figuren, die etwas dazu wissen, und verschwinden, wenn die Frage beantwortet ist.
- **Mala kommentiert Verbindungen einmal:**
  - zu `s5_beide`: „Dann hatten sie beide recht. Das ist schlimmer.“
  - zu `f5_wem`: „…Du hast recht. Mama war nie samstags dabei.“
- **Wieder zugänglich, was früher optional war:**
  - **Nadas „Keiner von euch hat je geschrieben“** sagt Nada am Donnerstag noch einmal, wenn Marko nach den Samstagen fragt.
  - **Das Klopfzeichen** zeigt Jasna an der Tür im siebten Stock. Es ist nicht nur Notiz aus Kapitel 4.
  - **Lanas Zeichnung von 1990** bringt Ana in jedem Fall mit. Ohne Zeichnungsszene in Kapitel 4 erklärt sie beim Totenmahl in zwei Sätzen, woher sie sie hat.
  - **Fenster und daneben** liefert Rades Heft. Ohne Besuch bei Rade gibt Mala es beim Totenmahl als Erinnerung wieder.
  - **„Poginuo“:** Marko weiß es in jedem Fall aus Kapitel 4, Pflicht (`z4_dabei`, `13_k4_notes.js:40`). Ob Jasna es weiß, hängt von Zimmer 214 ab und wird nicht gespeichert. Deshalb erzählt Marko es ihr am Montag (11.1).

### 6.7 Umfang, Schwierigkeit, Freiheit

| Größe | Kapitel 4 (gemessen) | Kapitel 5 (Schätzung) | Grundlage |
|---|---|---|---|
| Spieltakt der Musterlösung | 150,7 min (`BERICHT_K4.md:25`) | 140 bis 160 min | gleiche Gesprächsdichte; drei Ketten; zwei geführte Abschnitte (Begräbnis, Samstag) |
| Räume | 18 (`BERICHT_K4.md:7`) | 16 bis 17 (10 aus Kapitel 2, 6 bis 7 neu) | 4.4 |
| Orte auf dem Stadtplan | 10 | 9 (Sarajevo-Plan aus Kapitel 2, erweitert) | Busbahnhof, Brauerei, Gerichtsmedizin, Bare neu |
| Erinnerungsbilder | 8 | 7 | Bus, Kanister, 19. April (Hamdijas Blick), Brett, Mappe, Samstag (Lana), Dämmerung |
| Zwischenwelten | 2 | 1 (Hamdija, kurz) und Malas Schwelle an Ort und Stelle | – |
| Hinweisthemen | 48 | etwa 40 | weniger Streufälle, dafür mehrstufige Ketten |

- **Schwierigkeit:** Die Rätsel sind nicht schwerer als in Kapitel 4, aber dichter verzahnt. Die schwierigste Leistung ist die mehrstufige Zuordnung der Fahrscheine (7.3).
- **Freiheit:** Donnerstag und Freitagvormittag sind offen. Begräbnis, Nacht und Samstag sind bewusst geführt.

### 6.8 Stadtplan, Hinweise, Schnellwechsel, Wege

- **Stadtplan:** Der Plan von Sarajevo aus Kapitel 2 kommt mit vier neuen Orten zurück. Doppelklick verkürzt Wege wie bisher. Kein Rätsel hängt an einer Laufanimation.
  - Der Weg nach Vratnik am Samstag ist eine Gesprächsstrecke ohne Lösung.
  - Der Weg mit dem Wasser am Montag ist ein Weg ohne Hindernis.
- **Schnellwechsel:** Marko und Mala wie bisher. Mala bewegt sich frei („Es zieht nichts mehr“). Nachts ist sie bei Nada oder bei Marko, wie es die Szene verlangt.
- **Hinweise:** freiwillig, in vier Stufen, für jede Kette (7). Das Hinweissystem nennt nie die Fahrschein-Lösung, bevor der Spieler die Beobachtungen hat.

### 6.9 Punkt ohne Rückkehr

- **Wo:** am Ende der Freitagnacht, nach Gespräch 9.2, im Morgengrauen.
- **Warnung**, ohne Inhalt zu verraten: „Mit dem Samstag beginnt der letzte Teil der Geschichte. Danach führt kein Weg zurück in die Tage davor. Das Spiel legt einen eigenen Spielstand an.“
- **Spielstand:** eigener Platz „Vor dem Samstag“. Er bleibt bestehen und dient zugleich als Wiederholungspunkt (11.5).
- **Was davor erreichbar sein muss:**
  - die Dose (stofflich);
  - Šehićs Angebot. Fehlt es, bietet Šehić es am Samstagmorgen telefonisch an. Das ist keine Sackgasse;
  - der Atem (Pflicht).
- **Was danach wegfällt:** nur Optionales, nämlich Dragicas zweites Gespräch und Rades Heft. Beides wird im Höhepunkt nicht gebraucht.

---
## 7. Drei Kooperationsrätsel, ausgearbeitet

### 7.1 Kooperationsrätsel 1 – „Zwei Namen“ (widersprüchliche Aussagen, Übersetzung, Nachhall)

**Ausgangslage** (Donnerstagabend, Nadas Wohnung, neunter Stock)
- Zlata hat das Brett aus Skela mitgebracht: „MALA · 15.1.1994“, mit dem Taschenmesser geschnitten (`skela_l.js:417`). Es lehnt im Flur, in eine Wolldecke gewickelt.
- Nada hat bei Nedžad eine Messingtafel bestellt und den Text offengelassen.
- Beide Frauen sind höflich und gehen keinen Schritt.
  - Nada: „Auf dem Grab meiner Tochter steht, wie sie heißt.“
  - Zlata: „Bei mir hieß sie Mala. So wollte sie es.“
- Mala: „Ich sage nichts. Ich habe gesagt: zusammen.“ Sie hält sich an ihr Wort aus Skela (`skela_l.js:282`).

**Spielerziel:** Bis Freitag, 13:30, steht ein Grabzeichen, auf das sich beide Frauen geeinigt haben, ohne dass Marko oder Mala für sie entscheiden.

**Voraussetzungen**
- Nedžad besucht (Frist Freitag, 12:00; „Ich graviere, was man mir sagt.“).
- Lanas Zimmer zugänglich: Nada erlaubt es Marko, sobald er nach den Samstagen gefragt hat.

**Schritte**

1. **Die beiden Stellungen hören** (Marko).
   - Mit Nada in der Küche, mit Zlata auf dem Balkon. Der Spieler hört zwei berechtigte Gründe:
     - Nada hatte ihre Tochter siebzehn Jahre.
     - Zlata hatte sie zwei Tage lebend und achtzehn Jahre unter dem Quittenbaum, an jedem Fünfzehnten („Svakog petnaestog“, `skela_l.js:326`).
   - **Fehlversuch:** Schlägt Marko gleich vor, beide Namen zu nehmen, lehnen beide ab, weil sie den Grund der anderen nicht kennen.
     - Nada: „Damit auf ihrem Grab steht, wie **du** sie genannt hast?“
     - Zlata: „Dann steht sie da wie eine Fremde mit zwei Namen.“
2. **Nachhall des Bretts** (Wechsel zu Mala, im Flur). Erinnerungsbild:
   - Januar 1994, Skela, Nacht. Bato schneidet im Schuppen mit dem Taschenmesser, Zlata hält die Lampe.
   - Zlata: „Piši kako je rekla. Mala. Da je nađu.“
   - Notiz `s5_nh_brett`. Mala, leise: „Damit man mich findet. Sie wusste nicht, wer ich bin. Sie wusste nur, wie ich gefunden werden wollte.“
3. **Nadas Mappe** (Marko, in Lanas Zimmer). Siebzehn Durchschläge an den Suchdienst, einer für jeden Januar.
   - Jeder fängt gleich an: „Tražim svoju kćer Lanu Delić, rođenu 3. 3. 1976. u Sarajevu …“
   - Marko übersetzt im Kopf: „Ich suche meine Tochter Lana Delić, geboren am 3. 3. 1976 in Sarajevo.“ Notiz `s5_mappe`.
4. **Nachhall der Mappe** (Wechsel zu Mala, am Schreibtisch).
   - Jeden Januar sitzt Nada am Küchentisch und sagt den Namen laut, bevor sie schreibt: „Lana Delić. Da je nađu.“
   - Notiz `s5_nh_mappe`.
5. **Verbinden** im Notizbuch: `s5_nh_brett` + `s5_nh_mappe` ergibt `s5_beide`: „Beide haben ihren Namen geschrieben, damit man sie findet. Jede einen anderen.“
   - Mala: „Dann hatten sie beide recht. Das ist schlimmer.“
6. **Übersetzen**, einzeln, an jede die Absicht der anderen (Marko).
   - **An Zlata:** „Siebzehn Briefe. Jeder fängt mit ihrem Namen an. Damit man sie findet.“
   - **An Nada:** „In Skela hat sie selbst ‚Mala‘ gesagt. Zlata hat geschrieben, was sie gehört hat. Damit man sie findet.“
   - Die Quelle ist Zlatas eigene Erzählung aus Kapitel 3, keine Botschaft der Toten. Marko verrät nichts, was er nur von Mala weiß.
   - **Fehlversuch:** „Mala ist der Name, den ich ihr gegeben habe.“ Das stimmt (`97_k2_mala.js:116`), schadet aber.
     - Nada: „Dein Name. Auf ihrem Grab.“
     - Mala: „Das war ungeschickt.“
     - Das ist keine Sackgasse: Die Zeile verschwindet, die richtige bleibt.
7. **Die Form finden** (Marko, Verbindung `s5_beide` + `s5_brett` ergibt `s5_teile`).
   - „Das Brett hat den Tod. Nadas Tafel braucht nur die Geburt.“
   - Marko schlägt es beiden gemeinsam in der Küche vor.
     - Nada: „Oben ihr Name. Wie ich sie gerufen habe.“
     - Zlata: „Unten das Brett. Wie Bato es geschnitten hat.“
   - Beide sehen sich an, „nicht zu nah“ wie in Skela (`skela_l.js:324`), und nicken.
   - Mala: „Jetzt passen sie zusammen.“ Die Zeile kommt erst am Grab, damit sie dort wirkt (4.5).
8. **Gravur bei Nedžad** (Marko; Rätselform wie „Die Gravur“ in Kapitel 2, `kazandziluk.js:35–38`).
   - Drei Zeilen mit je drei Möglichkeiten. Nedžad fragt vor dem Gravieren nach, daher gibt es keinen unumkehrbaren Fehler.

     | Zeile | Möglichkeiten | Richtig | Rückmeldung bei falscher Wahl |
     |---|---|---|---|
     | 1 | „LANA DELIĆ“ / „LANA ‚MALA‘ DELIĆ“ / „MALA“ | „LANA DELIĆ“ | Zlata: „Mala steht doch schon auf dem Brett. Zweimal ist einmal zu viel.“ – Nada zu „MALA“: „Nein.“ |
     | 2 | „3. 3. 1976“ / „1976 – 1994“ / „3. 3. 1976 – 15. 1. 1994“ | „3. 3. 1976“ | Nedžad: „Dann steht der Fünfzehnte zweimal da. Einmal auf dem Messing, einmal auf dem Holz. Einmal reicht.“ – Nada zu „1976 – 1994“: „Sie hatte einen Geburtstag. Den dritten März.“ |
     | 3 | leer / „STIGLA JE“ / „MALI ČEKA“ | leer | Nada zu „STIGLA JE“: **„Das sage ich, wenn es stimmt. Nicht vorher.“** – Mala zu „MALI ČEKA“: „Nein. Er wartet nicht mehr.“ |

   - Nadas Satz zu „STIGLA JE“ bereitet den Höhepunkt vor.
   - Vorher misst Marko die Breite des Bretts mit Nedžads Zollstock: „Zweiunddreißig Zentimeter.“ So passt die Tafel genau darüber.
9. **Montage** (Marko mit Vlado). Ein Eichenpfosten, oben die Tafel, darunter das Brett. Vlado: „Drži.“ – „Halt fest.“ Marko hält, Vlado schraubt.

**Zwischenfolgerungen, für den Spieler sichtbar**
- Nach Schritt 1: Beide haben recht. Das ist das Problem.
- Nach Schritt 5: Beide hatten denselben Zweck.
- Nach Schritt 7: Die zwei Stücke ergänzen sich, Geburt und Name oben, Name und Tod unten.

**Alternative Reihenfolgen**
- Die Nachhall-Schritte 2 und 4 sind in beliebiger Folge möglich.
- Nedžad kann zuerst besucht werden. Er nennt dann die Frist und fragt nach der Breite.
- Die Einigung in Schritt 7 gelingt nur nach Schritt 6. Ohne die Übersetzung lehnen beide ab, mit denselben Sätzen wie im Fehlversuch zu Schritt 1.

**Warum beide gebraucht werden**
- **Mala:** Nur sie hört, warum jede Frau den Namen schrieb: Zlatas Lampennacht, Nadas Januare.
- **Marko:**
  - Nur er kann den Frauen davon sagen, und zwar so, dass es aus Quellen der Lebenden stammt: Zlatas Erzählung, Nadas eigene Briefe.
  - Nur er kann gravieren lassen und den Pfosten halten.
- **Zurückhaltung als Handlung:** Beide entscheiden nicht für die Frauen. Ein Satz Malas über Marko ließe sich als Botschaft nehmen. Mala verweigert ihn ausdrücklich.

**Hinweise** (freiwillig, vier Stufen)

| Stufe | Text |
|---|---|
| Orientierung | „Nada und Zlata müssen sich einigen. Mala entscheidet nicht für sie, ich auch nicht.“ |
| Denkrichtung | „Warum hat jede diesen Namen geschrieben? Das Brett weiß es. Und Nadas Briefe.“ |
| Konkreter Ansatz | „Mala soll das Brett im Flur spüren und die Mappe in Lanas Zimmer.“ |
| Nächster Schritt | „Die beiden Nachhall-Notizen verbinden und es jeder einzeln sagen. Dann zu Nedžad: Name und Geburt aufs Messing, der Tod steht schon auf dem Brett.“ |

**Ergebnis**
- Am Begräbnis steht der Pfosten: „LANA DELIĆ · 3. 3. 1976“, darunter „MALA · 15.1.1994“.
- Nada und Zlata stehen nebeneinander, nicht mehr „nicht zu nah“.
- Für den Höhepunkt ist Nadas Satz „Das sage ich, wenn es stimmt.“ gelegt.

---

### 7.2 Kooperationsrätsel 2 – „Nemoj gledati“ (Nachhall und Rekonstruktion, innen und außen)

**Ausgangslage**
- Auf dem Dachboden hat Malas Nachhall eine Hand auf Markos Augen gezeigt, nasser Ärmel, Geruch nach Malz (`b5_hand`).
- An der Brauerei pocht Markos Kopf, aber keiner zeigt sich.
- Kapitel 4 belegt: „Einer hat mich festgehalten“ (`97_k4_fam_b.js:41`), „Vorn hebt einer die Hand.“ (`:142`), ein Grab ohne Namen an der Brauerei (`97_k4_fam_a.js:180`).

**Spielerziel:** Den Geist finden, verstehen, was er bewacht, und ihn gehen lassen.

**Voraussetzungen**
- Dachboden besucht (Kanister im Inventar oder dort abholbar).
- Brauerei bei Tag besucht.
- Für Schritt 6: Gerichtsmedizin am Freitag.

**Schritte**

1. **Brauerei bei Tag** (Marko, dann Mala).
   - Kopfweh: der pochende Rand am Bild wie in allen Kapiteln (`06_ui.js:65`).
   - Mala sucht und findet keinen: „Er ist hier. Er zeigt sich nicht. Er wartet auf etwas.“
   - **Nachhall am Hahn** (Mala): Nacht, Klappern von Kanistern, eine Männerstimme: „Kanisteri u red! Jedan po jedan!“ Marko übersetzt: „Kanister in die Reihe! Einer nach dem anderen!“ Notiz `b5_reihe`.
   - **Fehlversuch:** Marko kauft am Kiosk eine Plastikflasche und stellt sich an den Hahn. Mala: „Das ist eine Flasche. Er will Kanister.“
2. **Folgerung:** Er zeigt sich Kanistern. Auf Ružas Dachboden stehen zwei. Wenn der Spieler keinen mitgenommen hat, sagt Mala: „Auf dem Dachboden stehen zwei. Blau.“
3. **Nachts mit dem Kanister** (Marko).
   - Ein Mann in Gummischürze erscheint, die Ärmel nass bis zum Ellbogen. Er stellt Marko hinten an.
   - Er liest „VUKOVIĆ“: „Der Ingenieur ist nach vorn, nach dem Druck fragen. Du wartest.“ Notiz `b5_hamdija`.
   - **Gespräch:**
     - Nach dem Jahr gefragt: „Was reden Sie da. Es ist April.“
     - Nach seinem Namen: „Hamdija. Von der Abfüllung.“
     - Nach dem Kasten hinter dem Hahn: „Ne diraj kutiju!“
   - **Fehlversuch:** Greift Marko trotzdem nach dem Kasten, flackert Hamdija und verschwindet. Er erscheint erst wieder, wenn Marko mit dem Kanister neu anstellt. Das ist sichtbare Instabilität, kein Spielverlust.
   - **Fehlversuch:** „Sie sind tot.“ ergibt: „Was reden Sie da!“ Flackern.
4. **Durch die Wand** (Wechsel zu Mala).
   - Mala geht in den Blechkasten hinein (sie geht durch Wände, Kapitel 1 bis 4): „Da drin ist ein Einmachglas. Darin Papier, zusammengerollt.“ Notiz `b5_kasten`.
   - Nachhall des Glases: Kerzenlicht in der Mälzerei, ein Mann schreibt und zählt halblaut: „Sedam.“ – „Sieben.“
5. **Rekonstruktion des 19. April** (Mala an drei Stellen, Marko geht mit).
   - **Am Hahn:** Hamdija hebt die Hand: „Ima pritiska!“ – „Der Druck ist da!“ Ein Mann in blauer Jacke dreht sich um, nach hinten, und ruft etwas.
   - **In der Mitte der alten Schlange:** Mala bleibt stehen: „Da will ich nicht hin.“ Marko: „Ich gehe mit.“ Wählbar: „(Neben ihr stehen.)“ Hier ist nur ein Ton: laut, dann nicht mehr laut. Mala zeigt nichts weiter. Das Spiel zeigt den Einschlag nicht.
   - **Am Ende der Schlange, an der Brücke:** Ein Junge mit zwei blauen Kanistern. Von vorn kommt einer gelaufen, die Ärmel nass, und legt ihm die Hand über die Augen. „Nemoj gledati, mali.“ Später steht der Junge wieder in der Reihe, und derselbe Mann füllt ihm am Hahn beide Kanister. Keiner sagt etwas.
   - **Folgerung im Notizbuch:** „Der vorn die Hand hob, hat mich festgehalten. Dann hat er meine Kanister gefüllt.“
   - **Und:** „Papa hat sich umgedreht. Zu mir. Er hat ‚Druck‘ gerufen, weil der Druck da war.“
   - Das deckt sich mit Markos eigener Erinnerung: „Er sagt etwas, das ich nicht höre. Ich glaube, er sagt: Druck.“ (`97_k4_fam_b.js:40`)
6. **Gerichtsmedizin** (Freitag, Marko). Kolar: „Sieben Tote. Vier haben einen Namen. Drei nicht.“ Auf Markos Frage: „Eine Liste mit Beschreibungen? Dann hätten wir eine Spur.“ Notiz `b5_drei`.
7. **Hamdija überzeugen** (Marko, mit Kanister).
   - Er glaubt nicht, dass dieser Mann der Junge ist: „Der Kleine ist vierzehn.“
   - Marko braucht etwas, das nur der Junge und Hamdija wissen. Aus Schritt 5 kann er es sagen: „Sie haben mir danach beide Kanister gefüllt. Keiner hat etwas gesagt.“
   - Und aus Schritt 4 und Kolars Fund: „Den Rechenschieber haben Sie ihm in die Tasche gesteckt.“
   - Hamdija, lange: „Ti si mali.“ – „Du bist der Kleine.“ Dann: „Otvori.“ – „Mach auf.“
   - **Alternative:** Ohne den Satz über die Kanister reicht der über den Rechenschieber nicht. Hamdija: „Das kann jeder sagen, der beim Graben dabei war.“ Beide Sätze zusammen genügen.
8. **Die Liste** (Marko öffnet den Kasten; Dokument).
   - „Pivara, 19./20. 4. 1993. Ukopani uz zid, ispod lipe.“ – „Begraben an der Mauer, unter der Linde.“
   - Darunter sieben Zeilen, je ein Mensch und ein Ding in der Tasche. Nummer drei: „Muškarac, oko 40, plava jakna. Šiber ‚Z. V.‘ u džepu. Sin (~13) nosio vodu kući.“ – „Mann, etwa 40, blaue Jacke. Rechenschieber ‚Z. V.‘ in der Tasche. Der Sohn (~13) hat das Wasser nach Hause getragen.“
   - Mala liest den Nachhall des Papiers: „Er hat sich geschämt. Weil er gezählt hat statt zu weinen.“ [E-Idee, `KAPITEL4_KONZEPT.md:1696`]
   - Notiz `b5_liste`.
9. **Zu Kolar** (Stadtplan, Gerichtsmedizin). „Drei Beschreibungen passen zu Nummern ohne Namen. Das reicht für einen Abgleich mit den Familien, die noch suchen.“
10. **Hamdijas Erkenntnis** (Marko). „Sie sind gefunden. Alle sieben. Zweitausenddrei. Und die letzten drei bekommen jetzt ihre Namen.“ – „Koja je godina?“ – „Zweitausendzwölf.“ Hamdija wird ruhig. Das Flackern hört auf.
    - Hamdija: „Rekao sam ti da ne gledaš.“ – „Ich habe dir gesagt, du sollst nicht hinschauen.“
    - Marko: „Ich habe hingeschaut.“
    - Hamdija: „Znam. Ti si gledao, a ja sam pisao.“ – „Ich weiß. Du hast hingeschaut, und ich habe geschrieben.“
    - Marko: „Der Rechenschieber. Daran haben sie ihn erkannt.“
    - Hamdija: „Bio je u ruci. Stavio sam mu ga u džep, da ga ne izgubi.“ – „Er war in seiner Hand. Ich habe ihn ihm in die Tasche gesteckt, damit er ihn nicht verliert.“
11. **Übergang.** Mala öffnet die Schwelle am Hahn. Marko geht mit ihm bis an den Rand (wie `skela_l.js:305–307`).
    - „Was sehen Sie im Licht?“ – „Česma. Teče. I niko ne čeka.“ – „Der Hahn. Er läuft. Und keiner wartet.“
    - Hamdija geht. Der Kopf ist still.

**Warum beide gebraucht werden**
- **Mala** findet ihn und rekonstruiert den Tag an drei Orten. Sie sieht ins Innere des Kastens.
- **Marko** stellt sich mit dem Kanister an und redet mit dem Geist. Er holt bei Kolar das fehlende Wissen, öffnet den Kasten, trägt die Liste zur Gerichtsmedizin und begleitet Hamdija bis an den Rand.
- Marko allein hätte den Mann nie gesehen. Mala allein hätte nie den Kasten geöffnet oder Kolar erreicht.

**Hinweise** (vier Stufen, für drei Teilziele)

| Teilziel | Orientierung | Denkrichtung | Konkreter Ansatz | Nächster Schritt |
|---|---|---|---|---|
| Ihn sichtbar machen | „Hier ist einer. Er zeigt sich nicht.“ | „Was wollte man hier früher? Hör auf den Hahn.“ | „Mala soll den Hahn spüren.“ | „Mit einem Kanister kommen. Der blaue vom Dachboden.“ |
| An den Kasten | „Er lässt mich nicht an den Kasten.“ | „Was ist drin, und wer bin ich für ihn?“ | „Mala geht durch die Wand in den Kasten. Und sie soll den Tag spüren, am Hahn, in der Mitte, an der Brücke.“ | „Ihm sagen, was nur der Junge wissen kann: die gefüllten Kanister. Und der Rechenschieber.“ |
| Ihn gehen lassen | „Er glaubt, es ist April 1993.“ | „Wofür hat er die Liste geschrieben?“ | „Frau Kolar fragen, wie viele noch keinen Namen haben.“ | „Die Liste zu Kolar bringen und ihm sagen, dass sie gefunden sind.“ |

**Ergebnis**
- Drei Familien bekommen eine Spur. Kolar meldet sich am Montag (11.1).
- Marko weiß, wer ihn hielt, und dass der Vater sich zu ihm umgedreht hat.
- Hamdija ist gegangen. Mala hat ihren letzten Geist für jemand anderen gefunden.
- Mala, auf dem Rückweg: „Er ist geblieben, bis sie gefunden waren. Ich bin geblieben, bis Mama mich begräbt.“

---

### 7.3 Kooperationsrätsel 3 – „Zehn nach elf“ (mehrstufige Kette, trägt den Höhepunkt)

Die Kette läuft über drei Tage. Sie verbindet Schlussfolgerung (Stufe 1), Entscheidung (Stufe 2), räumliches Zusammenspiel (Stufen 3 und 6) und eine gemeinsame Tat (Stufe 4).

#### Stufe 1 – Wem gehören die Fahrscheine? (Donnerstag bis Freitagabend; mehrere Schlussstufen nach §13)

1. **Erste Vermutung** (Gespräch 9.1).
   - Mala: „Für Mama. Wer sonst?“ Notiz `f5_dose` [Vermutung].
   - Marko darf prüfen: „Nada war nie samstags dabei.“ Mala: „Sie ist meine Mutter.“ Die Vermutung bleibt, aber angekratzt.
2. **Eine Untersuchung ändert sie** (Nada, Donnerstag).
   - „Fahrscheine? Die hat sie bei Alija gekauft. Samstags war sie bei euch. Ich war nie dabei. Das war euer Samstag.“ Notiz `f5_eursamstag`.
   - **Verbindung** `f5_dose` + `f5_eursamstag` ergibt `f5_wem`: „Nicht Nada. Die Fahrscheine gehören zu den Samstagen.“
   - Mala: „…Du hast recht. Mama war nie samstags dabei.“
3. **Wer gehört zu den Samstagen?** Marko (Mali) und Ruža, die tot ist. Und:
   - **`f5_tuer`:** „Mama hat Lana jeden Samstag die Tür aufgemacht.“ Jasna im siebten Stock; Kapitel 4, `97_k4_mala.js:83`.
   - **`f5_plaetze`:** „Samstags: ich am Fenster, sie daneben.“ Kapitel 2, `97_k2_mala.js:110`; neu zugänglich über Rades Heft oder als Malas Erinnerung beim Totenmahl.
4. **Ein Gespräch gibt zusätzliche Bedeutung** (Jasna, Donnerstag).
   - „Ich kann da nicht hinauf. Ihre Tochter ist losgefahren, um meinen Sohn zu holen. Und ich bin ohne ihn gefahren.“ (`j5_treppe`)
   - Im Taxi: „Nicht die Drei. Noch nicht.“ (`j5_nichtdrei`)
5. **Nachhall bestätigt die Schuld** (Wechsel zu Mala beim Totenmahl, Jasna an der Tür).
   - „Wenn ich ihn mitgenommen hätte, wäre sie nicht losgefahren.“
   - Mala: „Sie glaubt, sie ist schuld. An mir.“
6. **Die belastbare Folgerung** (Verbindung `f5_wem` + `j5_treppe` + `f5_plaetze`) ergibt `f5_jasna`:
   - „Die Fahrscheine sind für Mama. Zwei Plätze, Fenster und daneben. Damit sie Nada holt, wie Lana den Mali.“
   - Mala, nach einer Pause: „Ja. So.“
   - Und: „Sie hat ‚Ich setze mich ans Fenster‘ gesagt. Das war dein Platz.“ (`97_k4_fam_b.js:201`)
- **Falsche Verbindungen**, mit Antwort, ohne Strafe:
  - `f5_dose` + `j5_treppe`: „Nada braucht keine Treppe. Sie wohnt oben.“
  - `f5_plaetze` + `s5_mappe`: „Nada hat Briefe geschrieben, keine Fahrscheine gekauft.“
  - `j5_nichtdrei` allein, als Lösung angeboten: „Dass sie nicht fahren will, heißt noch nicht, für wen.“
- **Wissensstände:**
  - Jasna erfährt nichts von Mala.
  - Marko weiß Jasnas Schuld aus ihrem eigenen Satz (Schritt 4). Den Nachhall (Schritt 5) kennt nur er, durch Mala, und er sagt ihn Jasna nie.

#### Stufe 2 – Loslassen (Freitagnacht, Žuta tabija)

- **Kein Rätsel, eine Entscheidung.** Die Dose kann nur hergegeben werden, wenn Mala losgelassen hat. Das ist die Regel aus Kapitel 2 und Kapitel 4 (`97_k2_mala.js:48`; `97_k4_limbo_gerda.js:34`).
- Mala lässt los, nachdem
  - (a) das Begräbnis war (ihr eigenes Wort),
  - (b) Marko ihr ehrlich geantwortet hat (9.2),
  - (c) sie weiß, wem die Fahrscheine gehören (Stufe 1).
- **Ergebnis:** Die Dose wird in Markos Hand stofflich. „Sie ist leicht.“ – „Sie war nie schwer.“
- Inhalt: zwei vergilbte Fahrscheine der Linie 3 mit sternförmigem Loch. Auf einem steht mit Bleistift: „Za prvu trojku poslije rata. 12.11.93“ (`12_k2_items.js:83`; Alijas Sternzange, `carsija.js:39`).

#### Stufe 3 – Siebter Stock, 11:05 bis 11:10 (Samstag; räumliches Zusammenspiel)

- **Ausgangslage:**
  - Jasna geht am Morgen mit Šehić in die leere Wohnung im siebten Stock (`j5_samstag`).
  - **Mala ist oben bei Nada**, seit dem Morgengrauen. Sie wollte den Morgen ihres Geburtstags mit ihrer Mutter verbringen.
  - Marko ist bei Jasna.
- **Spielerziel:** Jasna die Fahrscheine dort geben, wo sie Lana die Tür aufgemacht hat, und sie dann selbst handeln lassen.
- **Schritte:**
  1. **Die Wohnung, optional.** Küche, dritte Loggia von links, am Türrahmen Bleistiftstriche mit „M“ und „A“.
     - Jasna: „Du warst immer kleiner, als du gedacht hast.“
     - Mala ist nicht hier. Ein Wechsel zu ihr zeigt Nada in der Küche oben, die das Fenster aufmacht und wieder zu.
  2. **Die Fahrscheine geben** (Marko: Dose an Jasna, **an der Wohnungstür**).
     - Jasna liest. Die Sternlöcher: „Alija.“ Die Schrift: „Lana.“
     - „Woher hast du die?“ Marko wählt:
       - „Von Lana.“ (wahr; beide Fahrscheine kamen von ihr);
       - „Einen hat sie mir am Tor bei Baka gegeben. Den anderen hatte sie selbst.“ (wahr, ausführlicher);
       - „(Nichts sagen.)“
     - Jasna fragt nicht weiter. Niko, das Mädchen mit dem Schal: Sie ahnt es seit Weihnachten (`97_k4_mala.js:48`).
  3. **Zurücktreten.** Jasna sieht auf die Uhr, 11:08, dann die Treppe hinauf. Marko wählt:
     - „(Zurücktreten.)“: Jasna geht.
     - „Geh hinauf und klopf.“ Jasna: „Sag mir nicht, was ich tun soll. Das habe ich achtzehn Jahre selbst entschieden.“ Eine Pause. Dann geht sie doch, weil sie es wollte. Mala, später: „Du hast es ihr gesagt. Sie wäre auch so gegangen.“
     - Kein Passwort. Beide Wege führen zum Klopfen. Der zweite kostet eine kleine Reibung und einen Satz.
  4. **11:10: das Klopfen** (automatischer Wechsel zu Mala, in Nadas Flur).
     - Zweimal kurz, einmal lang. Zum ersten Mal hört Lana ihr eigenes Klopfen von innen. Mala: „Mama. Das bin ich.“ Nada hört sie nicht.
     - Der Spieler steuert Mala: „(Zur Tür gehen.)“ Sie steht hinter Nada, als Nada öffnet.
     - Jasna: „Nada. Jasna. Vukovićka, sa sedmog.“ Sie hält die Fahrscheine hoch: „Za prvu trojku poslije rata.“
     - Nada liest die Bleistiftschrift ihrer Tochter. Sie sagt nichts. Dann: „Uđi.“ – „Komm rein.“
- **Fehlversuche:**
  - Fahrscheine schon beim Frühstück geben: Jasna steckt sie ein und fragt: „Was soll ich damit hier?“ Mala, wenn erreichbar, oder Marko selbst: „Nicht hier. An der Tür.“ Die Dose bleibt in Markos Hand, bis die Situation stimmt.
  - Selbst im neunten Stock klopfen: Marko kennt das Zeichen (`u4_klopfen`), wählt es aber nicht. „Das ist nicht mein Klopfen.“

#### Stufe 4 – Nadas Küche: die Zeichnung (11:10 bis 11:30; gemeinsame Tat)

- **Ausgangslage:**
  - Nada kocht in ihrer Džezva Kaffee für Jasna. Marko kommt nach.
  - Am Kühlschrank hängt seit dem Totenmahl Lanas Zeichnung von 1990: eine Straßenbahn mit einem Gesicht in jedem Fenster.
  - Das Küchenfenster ist klar, die Heizung trocken.
- **Spielerziel:** Lana kommt selbst zu ihrer Mutter, vor Nadas Augen und ohne Nachricht.
- **Schritte**, abwechselnd und ohne Zeitdruck. Jeder Beschlag hält bis zur nächsten Handlung, verblasst aber sichtbar:
  1. **Marko:** „Fenster anhauchen.“ Beschlag.
  2. **Mala:** „Zeichnen.“ Die Oberleitung, der lange Wagen, vorn eine Drei.
  3. **Marko:** noch einmal anhauchen, neben die erste Stelle.
  4. **Mala:** die Fenster, in jedes ein Gesicht.
  5. **Mala:** „Die Räder sind deine.“
  6. **Marko:** „Räder zeichnen.“ Sie werden eiförmig. Mala lacht: „Immer noch nicht.“
  7. **Nada** dreht sich vom Herd um. Sie sieht die Straßenbahn auf ihrer Scheibe, die Gesichter in den Fenstern und daneben, an der Linie entlang, nichts. Sie sieht zum Kühlschrank, dann auf den leeren Platz neben Marko. „Stigla si.“ – „Du bist angekommen.“
  8. Mala: „Jesam, mama.“ – „Ja, Mama.“ Nur Marko hört es.
  9. **Marko** wählt: „(Nichts sagen.)“ oder „Das ist …“. Sagt er etwas, legt Nada ihm die Hand auf den Arm: „Šuti, Mali.“ – „Sei still, Mali.“ Der Moment ist derselbe.
  10. Jasna nimmt Nadas Hand. Der Beschlag vergeht, die Zeichnung mit ihm.
- **Fehlversuche:**
  - Anhauchen, während Nada nicht in der Küche ist: Die Zeichnung vergeht ungesehen. Mala: „Sie muss es sehen. Nicht ich.“
  - Marko zeichnet die Straßenbahn selbst: eine Straßenbahn ohne Gesichter. Mala: „Das ist deine. Ich will meine.“
  - Anhauchen ohne Mala am Fenster: Marko steht vor seinem eigenen Atem.

#### Stufe 5 – Die Drei (11:44 bis 12:10; geführt, mit kleinen Handlungen)

- An der Haltestelle, dreihundert Meter weiter westlich als früher (`carsija.js:47`), warten Ana, Mia und Niko.
- **Jasna setzt sich ans Fenster. Nada setzt sich daneben.** Marko sitzt eine Reihe dahinter, wie im Bus aus Mostar (`ostbus.js:117`).
- Jasna entwertet beide Fahrscheine. Klack. Klack.
- Marko hat am Busbahnhof einen Fahrschein gekauft oder kauft ihn bei Damir. Mala: „Kauf dir einen. Du bist nicht mehr zwölf.“
- Mia entwertet ihren lauter als alle.
- Mala steht neben dem Platz ihrer Mutter, die Hand an der Stange. Als die Bahn bremst: „Drži se, mama.“ – „Halt dich fest, Mama.“ Nada greift im selben Augenblick nach dem Griff. Ob sie es gehört hat, bleibt offen. Es ändert nichts an dem, was geschieht.
- Niko winkt Mala zu. Ana: „Niko, wem winkst du?“ – „Dem Mädchen.“ Jasna legt nicht die Gabel hin. Sie hat keine. Sie sieht aus dem Fenster.
- Optional: Damir am Steuer, wenn Marko ihn am Freitag eingeladen hat. Er sieht im Spiegel die zwei Frauen: „Lieber zu viele Fenster als zu wenige.“

#### Stufe 6 – Endstation, Weg, Tor (12:10 bis 12:40; räumlich, dann Vollzug)

1. **Endstation.**
   - Hajra steht mit zwei Taschen da. Jasna hat sie am Freitag darum gebeten: „Ruža hat immer mit zwei Taschen gewartet. Das wollte ich noch einmal sehen.“
   - Rade sieht Marko an, dann lange den leeren Platz neben ihm, und schreibt: „Dva.“ – „Zwei?“ – „Ich zähle, was ich sehe.“ (`carsija.js:53`)
   - Die Mütter gehen mit Hajra nach Kovači, Ana mit den Kindern. Marko und Mala gehen nach Vratnik hinauf.
2. **Der Weg**, eine Gesprächsstrecke mit drei Haltepunkten:
   - die Treppe: „Ruža hat immer gesagt: Polako.“ – „Langsam.“;
   - die Biegung, an der Lana immer vorausrannte;
   - die Mauer mit Blick auf die Stadt.
3. **Ružas Tor.** Hajra hat am Morgen den Herd angeheizt und die Tür offen gelassen (`vratnik.js:7`). Der Abschied steht in 9.3.
   - Mala öffnet ihre Schwelle selbst, in der offenen Tür.
   - „Kommst du?“ – „Nein.“
   - **Letzte steuerbare Handlung des Höhepunkts:** „(Loslassen.)“. Daneben steht „(Noch nicht.)“, das ohne Strafe zurückführt, wie in Skela (`skela_l.js:276`).
   - Lana geht über die Schwelle. „Jetzt bin ich fertig.“

**Warum beide gebraucht werden, Stufe für Stufe**

| Stufe | Mala | Marko |
|---|---|---|
| 1 | Nachhall von Jasnas Schuld; die Erinnerung an die Plätze | prüft ihre Vermutung; hört Jasnas Satz; verbindet |
| 2 | entscheidet, lässt los | antwortet ehrlich |
| 3 | weiß, wo es richtig ist (die Tür); ist oben bei Nada | gibt die Dose; tritt zurück |
| 4 | zeichnet mit eigener Hand | gibt den Atem; zeichnet die Räder; schweigt |
| 6 | öffnet die eigene Schwelle; geht selbst | begleitet bis an den Rand; sagt „Nein“; lässt los |

**Hinweise** (vier Stufen, für die Stufen mit Rätselanteil)

| Teilziel | Orientierung | Denkrichtung | Konkreter Ansatz | Nächster Schritt |
|---|---|---|---|---|
| Stufe 1: Wem? | „Mala sagt: für Nada. Stimmt das?“ | „Wer war samstags dabei? Wer nicht?“ | „Nada nach den Samstagen fragen. Und was hat Mama im siebten Stock gesagt?“ | „‚Euer Samstag‘, ‚Mama kann nicht hinauf‘ und ‚Fenster und daneben‘ verbinden.“ |
| Stufe 3: Übergabe | „Heute ist ihr Samstag.“ | „Wo hat Mama ihr die Tür aufgemacht?“ | „Mit Mama um elf in den siebten Stock.“ | „Ihr an der Tür die Dose geben. Dann nichts mehr tun.“ |
| Stufe 4: Küche | „Nada muss es selbst sehen.“ | „Was kann Mala, wenn ich dabei bin?“ | „Die Scheibe anhauchen, wenn Nada in der Küche ist.“ | „Abwechselnd: anhauchen, Mala zeichnet. Die Räder sind meine.“ |

**Ergebnis**
- Nada sagt ihren eigenen Satz. Die Mütter fahren zusammen.
- Lana ist angekommen und gegangen, beides selbst.
- Marko hat sie begleitet, ohne sie zu tragen, und losgelassen.

---
## 8. Der spielbare Gesamthöhepunkt

Der letzte große Abschnitt ist Lanas Samstag (7.3, Stufen 3 bis 6). Er wird nach den Prüffragen des Auftrags gegliedert.

**Vorbereitung**
- Was der Spieler herausgefunden und bereitgestellt hat:
  - wem die Fahrscheine gehören (`f5_jasna`);
  - dass Mala in Markos Atem zeichnen kann, und nur dort (`a5_atem`, `a5_grenze`);
  - dass Nada Lanas Zeichnung von 1990 hat und die Gesichter in den Fenstern kennt;
  - dass Šehić um elf die Wohnung im siebten Stock aufsperrt.
- Dazu hat er Lanas Begräbnis „zusammen“ ermöglicht (7.1). Nada hat dabei ihren Satz gesagt: „Das sage ich, wenn es stimmt.“
- In der Nacht hat er Mala ehrlich geantwortet und die stoffliche Dose bekommen.

**Erkenntnis**
- Lana kann nicht durch Marko nach Hause kommen. Sie kann nur mit ihm kommen.
- Was Nada braucht, ist keine Botschaft, sondern Lanas Hand: eine Straßenbahn mit Gesichtern in den Fenstern, vor ihren Augen.
- Was Jasna braucht, ist kein Zuspruch, sondern ein Anlass, die Treppe hinaufzugehen: zwei Fahrscheine in Lanas Schrift.
- Beide Einsichten hat der Spieler selbst verbunden: 7.3, Stufe 1, und die Nacht des Atems.

**Handlung**
- **Marko:** gibt Jasna an der Tür die Dose und tritt zurück; haucht an; zeichnet die Räder; schweigt; geht mit Mala hinauf nach Vratnik; sagt „Nein“; lässt los.
- **Mala:** ist am Morgen bei ihrer Mutter; hört ihr eigenes Klopfen; zeichnet ihre Straßenbahn; öffnet ihre Schwelle; geht selbst.
- **Jasna und Nada** handeln selbst: das Klopfen, „Uđi“, „Stigla si“, die Plätze in der Drei.

**Schwierigkeit: weshalb Wissen allein nicht genügt**
- Marko kann Jasna nicht sagen, was sie tun soll, ohne ihr die Entscheidung zu nehmen. Er muss den Ort und den Augenblick wählen und dann zurücktreten.
- Die Zeichnung verlangt Wechsel und Abstimmung: sein Atem, ihre Linie, wieder sein Atem. Und Nada muss in der Küche sein, sonst sieht es keiner.
- Marko muss im entscheidenden Moment schweigen, gegen seinen Beruf.
- Mala kann die Dose nur hergeben, wenn sie losgelassen hat. Das kann kein Rätsel erzwingen.

**Entscheidung und bewusster Vollzug**
- **Markos Moment:** „Kommst du?“ – „Nein.“
  - Am selben Tor log der Vierzehnjährige 1993 „Ich komme.“ (`97_k2_mala.js:114`; Alter: „Ich war vierzehn.“, `97_k4_fam_b.js:51`).
  - Jetzt sagt der Mann die Wahrheit und öffnet die Hand: „(Loslassen.)“
- **Malas Moment:** Sie öffnet die Schwelle selbst und geht die Stufe selbst: „Jetzt bin ich fertig.“

**Ergebnis: woran der Spieler sofort sieht, dass sich die Lage dauerhaft geändert hat**
- Die Tür von Ružas Haus steht offen. In der Küche ist niemand.
- Marko hat kein Kopfweh, und Mala ist nicht da.
- Beim Mittagessen stellt Nada sechs Tassen hin. Sie fragt nicht, wo Lana ist.
- Die Fahrscheine sind entwertet. Sie stecken jetzt in Jasnas Manteltasche.

**Warum die Lösung mit den bekannten Regeln funktioniert**
- **„Wer losgelassen hat, kann etwas hergeben.“** Kapitel 2 und 4 (`97_k2_mala.js:48`; `97_k4_limbo_gerda.js:34`).
- **Mala öffnet Schwellen; Marko begleitet bis an den Rand.** Kapitel 2 bis 4 (`skela_l.js:305–307`). Seit Kapitel 3 kann sie gehen, wann sie will (`skela_l.js:284`).
- **Kinder und Katzen, die lange hinsehen, sehen sie:** Niko (`97_k4_mala.js:48`), Mačak.
- **Lebende hören sie nicht.** Darum muss Nada aus eigenem Erkennen sprechen.
- **Mala kann nichts anfassen.** Darum klopft Jasna, und darum braucht die Zeichnung Markos Atem: die einzige Ergänzung, früh gezeigt, zweimal geprüft, begrenzt (4.2).

**Warum es nicht früher möglich war**
- In Kapitel 1 bis 4 fehlte jedes der vier Teile:
  - Das Begräbnis war nicht geschehen. Vor dem Begräbnis wäre eine Zeichnung ein Gespenst gewesen, auf dessen Wiederkehr Nada wartet. Gerdas Lehre.
  - Mala wusste nicht, wem die Fahrscheine gehören, und hatte nicht losgelassen.
  - Jasna war seit 1992 nicht in Sarajevo.
  - Nada hatte Lanas Zeichnung von 1990 nicht. Ana bringt sie erst „im März“ (`97_k4_fam_b.js:306`).
- Den Atem kannten beide nicht als Bedingung. Mala hielt die Drei auf Markos Scheibe in Split für etwas Einmaliges, und bei Nada gelang es acht Wochen lang nicht.

**Beide unverzichtbar.** Keiner verbringt das Finale als Zielperson. Mala handelt von der ersten Stufe bis zum letzten Schritt, Marko ebenso. Die Trennung kommt erst an der Schwelle.

---

## 9. Zwei Schlüsseldialoge und die letzte Szene

Schreibweise wie im Spiel: Bosnische Sätze stehen im Original, Marko übersetzt sie unmittelbar in Anführungszeichen. Erzählzeilen stehen kursiv. Wahlmöglichkeiten stehen als Liste.

### 9.1 Frühes Schlüsselgespräch: „Acht Wochen“ (Donnerstag, Nacht, Pension Hajra)

*Markos Zimmer unter dem Dach. Mačak liegt quer auf dem Bett, als hätte er es gemietet. Draußen die Grabsteine von Kovači, weiß vom Februar.*

**Mala:** Er hat mich vermisst.

**Marko:** Er vermisst jeden, der ihm Burek gibt.

*Ich gehe ans Fenster. Die Scheibe ist kalt. Ich hauche sie an, damit ich hinaussehe.* (Steuerbar: „Fenster: anhauchen“. Die Szene beginnt mit dieser Handlung.)

*Im Beschlag erscheint eine Linie. Dann eine zweite. Eine Drei.*

**Marko:** …

**Mala:** …

**Mala:** Das war ich.

**Marko:** In Split. Auf meinem Fenster. Ich habe sie weggewischt.

**Mala:** Ich dachte, das war nur einmal. Damals, als ich noch nicht wusste, wer ich bin.

**Marko:** Hast du es wieder versucht?

**Mala:** Bei Mama. Acht Wochen lang.

- Auswahl:
  - „Versuch es auf dem Spiegel.“ → *Ich drehe im Bad das heiße Wasser auf. Der Spiegel beschlägt. Mala hebt die Hand. Nichts.* **Mala:** Wie bei Mama. Jeden Abend, wenn sie geduscht hatte.
  - „Noch einmal.“ → *Ich hauche, sie zieht einen Strich. Er hält, bis der Beschlag geht. Drei Sekunden, vielleicht vier.*
- Im Flur, automatisch nach beiden: *Mia steht im Schlafanzug am Flurfenster und haucht eine Sonne. Mala zeichnet daneben. Nichts.* **Mia:** Onkel Marko, mit wem redest du? **Marko:** Mit dem Kater. **Mia:** Der Kater heißt Mačak. Das heißt Kater. *Sie geht.*

**Marko:** Nur bei mir.

**Mala:** Nur in deinem Atem. Das ist kein Kompliment. Du hattest Zwiebeln.

**Marko:** Du könntest ihr etwas schreiben. Auf meine Scheibe, wenn ich bei ihr bin.

**Mala:** Nein.

**Marko:** Warum nicht?

**Mala:** Buchstaben sind eine Nachricht.

**Mala:** Und vor dem Begräbnis wäre alles ein Gespenst. Sie würde warten, dass es wiederkommt. Wie Alois auf Gerda.

**Marko:** Und danach?

**Mala:** Danach sehen wir.

*Sie setzt sich auf die Fensterbank. Mačak sieht sie an. Ich auch.*

**Mala:** Du siehst ausgeschlafen aus.

**Marko:** Das hast du am Bahnhof schon gesagt.

**Mala:** Am Bahnhof war es höflich. Jetzt ist es eine Frage.

- Auswahl:
  - „Acht Wochen kein Kopfweh.“
  - „Ich habe viel gearbeitet.“ → **Mala:** Nur müde? **Marko:** … Nein. Acht Wochen kein Kopfweh.
  - „(Nichts sagen.)“ → **Mala:** Ich warte. Darin bin ich gut. **Marko:** Acht Wochen kein Kopfweh.

**Marko:** Ich habe geschlafen wie ein Stein. Und jeden Morgen habe ich mich dafür geschämt.

**Mala:** Geschämt.

**Marko:** Weil es mir ohne dich gut ging.

**Mala:** …

**Mala:** Mama redet jeden Abend mit mir. Beim Bügeln. Was die Kolar gesagt hat. Was der Bäcker gesagt hat. Ich antworte.

**Marko:** Und?

**Mala:** Keine hört die andere. Acht Wochen lang. Es war trotzdem schön.

**Marko:** Frag mich jetzt.

**Mala:** Nein. Nach dem Begräbnis. Das war abgemacht.

**Marko:** Und wenn ich dann das Falsche sage?

**Mala:** Es gibt kein Falsches. Es gibt nur „nur müde“.

*Sie hält die Dose auf dem Schoß, wie immer, eine Hand darauf.*

**Marko:** Und die Dose?

**Mala:** Für Mama. Wer sonst?

**Marko:** Nada war nie samstags dabei.

**Mala:** Sie ist meine Mutter.

**Marko:** Das ist kein Samstag.

**Mala:** Du bist heute sehr genau.

**Marko:** Ich bin Übersetzer.

**Mala:** … Weißt du, was ich will? Nicht Mama. Nicht Zlata. Ich.

**Marko:** Was?

**Mala:** Noch einmal Samstag. Zehn nach elf. Und diesmal bist du fertig.

**Marko:** Ich war nie fertig.

**Mala:** Eben.

*Mačak dreht sich auf den Rücken. Der Beschlag ist weg, die Drei auch.*

- **Notizen:** `a5_atem`, `a5_grenze`, `f5_dose` (Vermutung).
- **Was das Gespräch leistet:**
  - Die Ergänzung ist früh, beiläufig, zweimal geprüft und begrenzt.
  - Die Spannung ist konkret: Er hat ohne sie gut geschlafen, sie hat neben einer Mutter gelebt, die sie nicht hört.
  - Malas eigenes Ziel ist genannt („Ich“).
  - Marko prüft ihre Deutung. Die Antwort auf „Und wenn ich das Falsche sage?“ nimmt der späteren Wahl das Passworthafte.

### 9.2 Spätes Schlüsselgespräch: „Bis es hell wird“ (Freitag, Nacht, Žuta tabija)

*Die Žuta tabija. Unter uns die Stadt, Lichter bis Ilidža. Mala sitzt auf der Mauer, die Beine über dem Hang, als wäre sie zwölf. Heute Mittag haben sie sie begraben.*

**Mala:** Ich habe mich gefragt.

**Marko:** Und?

**Mala:** Erst du. So war es abgemacht.

- **Auswahl, „Was willst du?“** Alle drei sind ehrlich, keine ist falsch:
  - **A** „Ich will, dass du bleibst.“
    - **Mala:** Warum?
    - **Marko:** Weil ich achtzehn Jahre ohne dich war und es nicht gemerkt habe. Jetzt merke ich alles.
    - **Mala:** Danke. Das wollte ich hören. Nicht, damit ich bleibe. Damit ich es weiß.
  - **B** „Ich will schlafen. Und ich will, dass du da bist. Das geht nicht zusammen.“
    - **Mala:** Doch. Eine Weile. Gerda hat es fünfunddreißig Jahre versucht.
    - **Marko:** Und?
    - **Mala:** Alois hat gefroren.
  - **C** „Ich weiß nicht, was ich will. Ich weiß, was ich nicht will: dich festhalten.“
    - **Mala:** Das ist nicht, was du willst. Das ist, was du nicht willst.
    - **Marko:** … Ich will, dass du da bist. Und ich will, dass du nicht meinetwegen da bist.
    - **Mala:** Siehst du. Geht doch.

- **Malas Rückbezug**, nach Übernahme (11.3):
  - Zustimmung **a:** „Am Grab hast du ‚Ja‘ gesagt. Einfach so. Heute war es nicht einfach. Das ist besser.“
  - **b:** „‚Wenn es zu schwer wird, sagen wir es.‘ Heute hast du es gesagt, bevor es zu schwer war.“
  - **c**, nach `consent2`:
    - a: „In München hast du gesagt: den richtigen Satz. Das war er.“
    - b: „In München hast du gesagt, diesmal weißt du, wozu. Jetzt weiß ich es auch.“
    - c: „In München hast du gesagt: Ich weiß es nicht. Heute weißt du mehr.“

**Mala:** Jetzt ich.

**Mala:** Ich gehe.

*Lange nichts. Unten bellt ein Hund, dann ein zweiter, weiter weg.*

**Marko:** Wegen meines Kopfes?

**Mala:** Nein.

**Mala:** Ein bisschen. Aber nicht deswegen.

**Marko:** Wenn es wegen meines Kopfes ist, dann bleib. Den halte ich aus.

**Mala:** Den Grund suche ich mir selbst aus.

**Marko:** Dann sag ihn.

**Mala:** Heute Mittag stand mein Name zweimal auf einem Pfosten. Mama und Zlata haben nebeneinander gestanden. Hamdija ist gegangen, weil die anderen gefunden sind.

**Mala:** Auf mich wartet keiner mehr. Und ich warte auf keinen. Das ist neu.

**Mala:** Ich war achtzehn Jahre unterwegs. Auf Treppen. Auf Bänken. Ich will ankommen.

- **Versprechen aus Kapitel 3**, nach `promise` (`herberge.js:96–101`):
  - **a** („Versprochen.“): **Mala:** Du hast versprochen, mich zu fragen. Bei allem. Heute frage ich mich selbst. Das gilt auch.
  - **b** („Manchmal muss es schnell gehen.“): **Mala:** Du hast gesagt, manchmal muss es schnell gehen. Heute muss es nicht schnell gehen. Morgen reicht.
  - **c** („Und wenn du falsch entscheidest?“): **Mala:** Du hast gefragt, was ist, wenn ich falsch entscheide. Dann ist es meins. Das Falsche auch. Es ist nicht falsch.

**Marko:** Und Gerda? „Gehen, weil ich bleibe.“

**Mala:** Bei Gerda wusste ich nicht, was das heißt. Jetzt weiß ich es. Ich bleibe auf einem Pfosten. In Mamas Mappe. In Zlatas Garten. Dafür muss ich nicht hier sein.

**Marko:** Und bei mir?

**Mala:** Bei dir in den Rädern. Die kannst du immer noch nicht.

**Marko:** Und Hansi? Ohne Schwelle wäre es leichter.

**Mala:** Leichter, ja. Die Stufe will ich selbst gehen.

**Marko:** Wann?

**Mala:** Morgen ist Samstag.

**Mala:** Noch einmal zehn nach elf. Die Drei. Bis zur Endstation. Und dann hinauf zu Ruža.

**Marko:** Zu Ruža.

**Mala:** Da hat jeder Samstag aufgehört. Da höre ich auch auf.

**Mala:** Jakov hat in Split gefragt, wo ich hin soll. Ich habe es nicht gewusst.

**Marko:** Und jetzt?

**Mala:** Hinauf. Ist nicht weit.

*Sie macht die Dose auf. Zwei Fahrscheine, nebeneinander, so wie sie sie auf der Bank hineingelegt hat.*

**Mala:** Wer losgelassen hat, kann etwas hergeben.

**Mala:** Für deine Mutter. Sie soll Mama holen. So wie ich dich.

- Auswahl: „(Die Dose nehmen.)“ / „Bist du sicher?“
  - Bei „Bist du sicher?“: **Mala:** Nein. Nimm sie trotzdem. → „(Die Dose nehmen.)“

*Sie liegt in meiner Hand. Blech, kalt, mit einer Delle im Deckel.*

**Marko:** Sie ist leicht.

**Mala:** Sie war nie schwer. Nur festgehalten.

*Hinter dem Trebević wird es grau. Dann hell.*

**Marko:** Sretan rođendan.

**Mala:** Sechsunddreißig.

**Marko:** Siebzehn.

**Mala:** Beides.

- **Was das Gespräch leistet:**
  - Marko sagt, was er will. Mala sagt, was sie tut und warum.
  - Er prüft ihren Grund zweimal, und sie muss ihn als ihren ausweisen.
  - Ihre Antworten auf Gerda und Hansi sind ihre eigenen.
  - Frühere Entscheidungen (Zustimmung, Versprechen) werden gehört, ändern aber nicht ihren Entschluss.
  - Kein Streit: Beide bleiben bei sich.

### 9.3 Am Tor (Samstag, 3. März, etwa 12:40, Vratnik)

*Ružas Tor. Der Weg hinter uns ist nass vom Schnee, der schmilzt. Die Haustür steht offen. Drinnen knackt der Herd, Hajra hat ihn am Morgen angeheizt.*

**Mala:** Hier.

**Marko:** Ich weiß.

**Mala:** Hier hast du „Ich komme“ gesagt.

**Marko:** Ich weiß.

*Sie geht zur Tür. In der Tür wird es hell. Nicht viel. Wie wenn drinnen einer das Licht anmacht.*

- Auswahl: „Was siehst du im Licht?“ / „(Warten.)“. Bei „(Warten.)“ antwortet Mala nach einer Weile auf die ungestellte Frage.

**Mala:** Ružas Küche. Der Herd ist an. Auf dem Schrank liegen Quitten.

**Mala:** Und am Tisch sitzt einer und sagt, ich bin zu spät.

**Marko:** Wer?

**Mala:** Tata. Er hat immer gesagt, die Kleine kommt, wenn sie fertig ist.

*Sie dreht sich um.*

**Mala:** Kommst du?

- Auswahl, alle wahr:
  - „Nein.“
  - „Nein. Ich bleibe hier.“
  - „(Den Kopf schütteln.)“
  - „Noch nicht.“ → **Mala:** Ich weiß. Ich meine heute. → zurück zur Auswahl ohne „Noch nicht.“

**Mala:** Gut. Diesmal ist es wahr.

**Marko:** Den richtigen Satz.

**Mala:** Den richtigen.

*Sie hebt die Hände, als würde sie mir die Jacke zumachen. Bis oben. Ich mache sie selbst zu. Dann sieht sie auf meine Mütze.*

- Auswahl: „(Die Mütze gerade rücken.)“ / „(Sie schief lassen.)“
  - gerade: **Mala:** Wer bist du?
  - schief: **Mala:** Gut. Sonst erkenne ich dich nicht.

**Mala:** Drži se, Mali. – „Halt dich fest, Mali.“

**Mala:** Nimm meine Hand. Bis an den Rand.

*Ich nehme ihre Hand. Sie wiegt nichts. Wir gehen bis zur Schwelle. Weiter geht es für mich nicht.*

- **Letzte steuerbare Handlung des Höhepunkts:**
  - „(Loslassen.)“
  - „(Noch nicht.)“ → **Mala:** Ich bin hier. → *Eine Weile stehen wir.* → wieder die Auswahl.

*Ich lasse los.*

**Mala:** Jetzt bin ich fertig.

*Sie geht hinein. Allein. Die Stufe nimmt sie mit einem Schritt, so wie früher die letzte Treppe vor Ružas Tür, immer zuerst oben.*

*Ich sehe hin, bis nichts mehr zu sehen ist.*

*Das Licht geht aus, wie wenn drinnen einer es ausmacht. In der Küche knackt der Herd. Auf dem Schrank liegen Quitten. Am Tisch sitzt keiner.*

*Mein Kopf ist still.*

- Danach: Marko setzt sich in die Küche. Die Stimmen der anderen kommen die Gasse herauf, Hajra, Mia, die Mütter (Mittagessen, 11.1).

### 9.4 Letzte Szene, letzte Handlung, letztes Bild (Montag, 5. März, Abend, Ružas Küche)

- **Ort:** Ružas Küche in Vratnik, unter dem Dach, das Jasna achtzehn Jahre bezahlt hat.
- **Zeit:** nach Zorans Begräbnis, Sonnenuntergang.
- **Anwesend:** Jasna, Ana, Mia, Niko, Nada, Hajra. Zlata ist am Sonntag abgefahren.

*Mama hat die Džezva auf dem Herd. Ružas Džezva, die ich seit Split überall dabeihabe. Das Wasser ist das von heute früh, von der Brauerei. Keinen Tropfen verschüttet.* (Džezva: `flat.js:158`, „Das Einzige aus Sarajevo, das ich jeden Tag benutze.“; mitgenommen in Kapitel 3, `ostbus.js:112`)

**Ana:** Es tropft nicht.

**Jasna:** Achtzehn Jahre bezahlt. Natürlich tropft es nicht.

**Hajra:** Ich habe trotzdem einen Eimer auf den Dachboden gestellt.

*Nada sitzt am Fenster. Sie hat die Hände um die Tasse und sieht hinaus, nicht auf den leeren Platz. Mama und Nada reden über Plätzchen. Eine Viertelstunde lang.*

**Niko:** Das Mädchen ist weg.

**Ana:** Welches Mädchen?

**Niko:** Mit dem Schal. Sie hat gewinkt.

*Mama legt die Gabel hin. Ganz leise. Nada sieht Niko an und dann mich. Keiner sagt etwas. Mia isst Nikos Kuchen.*

*Das Fenster neben dem Tisch ist beschlagen, vom Kaffee und von uns allen.*

- **Letzte steuerbare Handlung:** „Fenster: zeichnen“ (Marko). Es ist die einzige Handlung im Raum, die etwas tut. Alle anderen Hotspots geben nur Blicke frei.

*Ich zeichne eine Straßenbahn. Die Oberleitung. Den langen Wagen. Vorn eine Drei. In jedes Fenster ein Gesicht, so gut ich kann.*

*Dann die Räder.*

*Sie stimmen.*

- **Notizbuch, letzter Eintrag** (Fall „Malas Spur“, wie `m_tram` in Kapitel 1): „Auf der beschlagenen Scheibe in Ružas Küche: eine Straßenbahn mit einer Drei. Ich habe sie gemalt. Mit Rädern.“
  - Das kehrt Kapitel 1 um: „Ich habe sie nicht gemalt.“ (`11_notes.js:54`)

**Mia:** Onkel Marko kann malen!

**Ana:** Seit wann?

- Auswahl, die letzte Dialogwahl des Spiels:
  - „Seit Samstag.“
  - „Schon immer. Nur die Räder nicht.“
  - „(Nichts sagen.)“

*Draußen gehen in der Stadt die Lichter an, eins nach dem anderen, bis Ilidža. Der Beschlag wird dünner. Die Straßenbahn geht mit ihm, erst die Räder, dann die Gesichter, zuletzt die Drei.*

*Dahinter ist die Stadt.*

- **Letztes Bild:**
  - das Küchenfenster, klar geworden;
  - dahinter das Tal von Sarajevo in der Dämmerung;
  - im Vordergrund der Rand der Džezva, Dampf.
- **Ton:** Der Herd knackt, die Gespräche sind leise geworden. Keine Musik in den letzten vier Sekunden.
- Abblende. Endkarte: „Ende“.
- **Abspann**, Widmung: „Für alle, die angekommen sind, und für alle, die sie gehen ließen.“ Keine Fortsetzungszeile, keine Szene nach dem Abspann.
- **Warum dieser Rückbezug etwas verändert und nicht wiederholt:**
  - In Kapitel 1 malte jemand anderes die Straßenbahn auf Markos Scheibe, und er wischte sie weg (`flat.js:108`).
  - In Kapitel 5 malt er sie selbst, mit den Rädern, die er in Kapitel 2 nie konnte.
  - Er wischt sie nicht weg. Sie vergeht von allein, und das ist in Ordnung.

---
## 10. Auflösungsübersicht

### 10.1 Zentrale Fragen

| Handlungsstrang oder Frage | Belegte Grundlage in Kapitel 1–4 | Bisher geklärt | Auflösung in Kapitel 5 | Spielerhandlung oder Szene | Folge |
|---|---|---|---|---|---|
| Wer ist Mala? | Kapitel 2: `carsija.js:75`; `97_k2_mala.js:114–116` | vollständig (Lana Delić; „Mala“ von Mali) | nichts Neues, mit Absicht (2.4) | – | Ihr Name steht zweimal auf dem Pfosten |
| Wie kommt Lana „selbst nach Hause, nicht als Nachricht“? | `skela_l.js:256`; `13_k4_notes.js:12` | Sie ist gefunden und exhumiert, Nada weiß alles | Sie zeichnet in Markos Atem ihre Straßenbahn auf Nadas Küchenscheibe; Nada erkennt die Gesichter in den Fenstern | Kooperationsrätsel 7.3, Stufe 4 | Nada sagt „Stigla si.“ statt „Sie ist nie angekommen“ (`stan.js:11–12`) |
| Wo und wie wird Lana begraben? „Mama und Zlata, zusammen“ | `skela_l.js:282`; Nadas SMS `97_k4_fam_b.js:287` | Termin und Ort offen | Freitag, 2. März, Bare; Pfosten mit Nadas Tafel und Zlatas Brett | Kooperationsrätsel 7.1; Begräbnis | „Jetzt passen sie zusammen.“ Die Frauen stehen nebeneinander |
| Malas Entscheidung nach dem Begräbnis | `97_k4_fam_b.js:284`; `skela_l.js:284–285` | an das Begräbnis gebunden | Sie geht am Samstag, aus eigenem Grund: angekommen, keiner wartet, die Stufe selbst | Gespräch 9.2; Tor 9.3 | Mala ist nicht mehr in der Welt (5.2) |
| Markos ehrliche Antwort, „nicht nur müde“ | `97_k4_fam_b.js:284–285` | versprochen | eine von drei ehrlichen Antworten, dann am Tor „Nein“ | 9.2; 9.3 | „Den richtigen Satz.“ – „Den richtigen.“ |
| Wem gehört die Dose mit den zwei Fahrscheinen? | `97_k4_mala.js:51`; `12_k2_items.js:83`; `carsija.js:73` | „Das weiß ich noch nicht.“ | Jasna, damit sie Nada holt, wie Lana Mali holte | 7.3, Stufen 1 bis 3 | Die Mütter fahren zusammen die Drei, Jasna am Fenster |
| Zoran: Identifizierung und Begräbnis | `97_k4_fam_a.js:180–203`; `97_k4_fam_b.js:260` | gefunden (Variante: wahrscheinlich) | Freitag Gerichtsmedizin (in beiden Varianten sicher); Montag Begräbnis auf Bare | Szenen 4.5 | „poginuo 19. 4. 1993“ auf der Tafel |
| Jasnas Rückkehr: „Ich setze mich ans Fenster“ | `97_k4_fam_b.js:198–201`; `13_k4_notes.js:41` | Entschluss gefasst | im Bus am Fenster; in der Drei am Fenster, auf Malis Platz | Prolog; Samstag | Sie „sieht wieder hin“ |
| Das Band zwischen Marko und Mala | `skela_l.js:286–298`; `13_k4_notes.js:44` | beide haben es gemacht; der Preis ist ausgesprochen | Sie lassen es zusammen los: Er öffnet die Hand, sie geht | 9.3 | Markos Kopf ist still; er behält seine Gabe |

### 10.2 Wichtige Nebenstränge

| Handlungsstrang oder Frage | Belegte Grundlage in Kapitel 1–4 | Bisher geklärt | Auflösung in Kapitel 5 | Spielerhandlung oder Szene | Folge |
|---|---|---|---|---|---|
| „Nemoj gledati, mali“: Wer hielt Marko fest? | `97_k4_fam_b.js:41`; `:142` | offen | Hamdija Selimović, der Abfüller am Hahn [N] | 7.2 | Marko hat einen Zeugen; drei Namen für Kolar |
| Was rief der Vater? „Druck“ | `97_k4_fam_b.js:35`; `:40` | Marko glaubt „Druck“ | Zoran drehte sich zu ihm um und rief, dass der Druck da ist | 7.2, Schritt 5 | Der letzte Ruf des Vaters galt ihm |
| Die blauen Kanister | `97_k4_fam_b.js:34`; `97_k4_fam_a.js:278–281` | nur Erinnerung | Ružas Dachboden ([E]-Idee, `KAPITEL4_KONZEPT.md:1612`); Auslöser für Hamdija | 6.2; 7.2 | Marko trägt am Montag Wasser nach Vratnik |
| Der Rechenschieber „Z. V.“ | `13_k4_notes.js:30` | Fund im Grab | Hamdija steckte ihn in die Tasche; Jasna bekommt ihn | Gerichtsmedizin; 7.2 | „Er hat auf alles seinen Namen geschrieben.“ |
| Ružas „poginuo“ | `13_k4_notes.js:26`; `97_k4_fam_b.js:47` | Marko bat sie, es nicht zu schreiben | Es steht auf Zorans Tafel | Epilog | Ihr Wort, nach neunzehn Jahren |
| Ružas Dach | `97_k4_fam_b.js:255–256`; `vratnik.js:48` | bezahlt | Mittag am Samstag, Kaffee am Montag | Epilog | „Es tropft nicht.“ |
| Die Mütter vom 7. und 9. Stock | `stan.js:15`; `97_k4_fam_b.js:247–251` | ein Anruf | Dose zurück; das Klopfen; „Uđi“; die Drei | Totenmahl; Samstag | Eine Viertelstunde über Plätzchen, freiwillig |
| Nadas Ahnung | `ostbus.js:118–119`; `skela_l.js:337` | „Eine von beiden weiß es.“ | Sie sagt „Stigla si.“ zum leeren Platz; sechs Tassen | Samstag | Sie fragt nicht, und sie wartet nicht mehr |
| Lanas Zeichnung von 1990 | `13_k4_notes.js:23`; `97_k4_fam_b.js:306` | bei Ana | Ana gibt sie Nada | Totenmahl | Nada erkennt am Samstag die Hand |
| Niko sieht Mala | `97_k4_mala.js:48`; `ana.js:144` | an Weihnachten | Er winkt am Grab und in der Drei; „Das Mädchen ist weg.“ | Freitag, Samstag, Montag | Der einzige Lebende, der sie sieht, sieht sie gehen |
| „Die Stillen“ | `97_k4_fam_b.js:259–263` | Teil zwei gedruckt | Teil drei: Lana Delić | Epilog (SMS Vesna) | „Seite vierzehn.“ |
| Das Klopfen, Samstag 11:10 | `97_k2_mala.js:110`; `13_k4_notes.js:20` | Jasna kennt es | Jasna klopft im neunten Stock | 7.3, Stufe 3 | Mala hört sich zum ersten Mal von innen |
| „Kommst du?“ – „Ich komme.“ | `97_k2_mala.js:114` | die Busnacht in Kapitel 2 bearbeitet | „Kommst du?“ – „Nein.“ | 9.3 | Eine Lüge wird durch eine Wahrheit ersetzt |
| „Die Räder.“ | `carsija.js:75` | – | samstags schief, montags richtig | 7.3; 9.4 | Er hat es gelernt |
| Gerda: „Gehen, weil ich bleibe.“ | `97_k4_mala.js:52` | offen für Mala | Malas eigene Antwort | 9.2 | – |
| Hansi: „Ohne Schwelle.“ | `97_k4_mala.js:50` | Mala neidisch | „Die Stufe will ich selbst gehen.“ | 9.2; 9.3 | – |

### 10.3 Bewusst offene oder atmosphärische Motive

| Motiv | Grundlage | Umgang in Kapitel 5 | Warum offen oder nur atmosphärisch |
|---|---|---|---|
| Rade, „Dva putnika“ | `carsija.js:53` | „Dva.“ an der Endstation | Ob Rade sie sieht, war in Kapitel 2 offen und bleibt es. Keine Handlung hängt daran |
| Nada greift in der Drei nach dem Griff | neu | „Drži se, mama.“ | Ob sie es gehört hat, bleibt offen. Was geschieht, ist eindeutig |
| Herkunft von Malas Dose | `riva.js:187` | nicht erklärt | Für keine Handlung nötig. Eine nachgeschobene Herkunft wäre Erfindung ohne Beleg |
| Zoras „Aber nicht zu viel“ | `97_k2_limbo.js:48` | nicht aufgegriffen | Schon Kapitel 3 und 4 haben es nicht gebraucht (`KAPITEL4_KONZEPT.md`, 9.1) |
| Was im Licht wirklich ist | Kapitel 2 bis 4: jeder sieht sein eigenes Bild (Zora die Schule, `97_k2_limbo.js:48`; Gerda die Endhaltestelle, `97_k4_limbo_gerda.js:41`) | Lana sieht Ružas Küche und den Vater | Die Reihe hat nie gesagt, was dahinter liegt. Was Lana sieht und tut, ist eindeutig. Was es metaphysisch ist, bleibt offen |
| „Für Dragica“ | `97_k4_fam_b.js:35` | Dragica erwähnt den Tag, die Frage bleibt | Widerspruch zur Wohnlage ist offengelegt (1.8), nicht übermalt |
| Davor und Lena; Ivka und Zdenka | `KAPITEL4_KONZEPT.md`, 9.1 | höchstens eine SMS (Davor, 11.3) | Beiläufig; August liegt nach dem Finale |

---

## 11. Epilog und Endzustände

### 11.1 Der Nachklang

**Samstag, Mittag, unter Ružas Dach** (etwa 4 Minuten, spielbar, ohne Rätsel)
- Hajras Pita, Jasnas Sarma. Mia sucht unter dem Tisch nach Mačak, der in Kovači geblieben ist.
- Nada stellt **sechs Tassen** hin, nicht sieben. Sie fragt nicht.
- Jasna: „Drunter.“ Mehr sagt sie nicht.
- Wenn man Marko zu Mama gehen lässt: Sie legt die zwei entwerteten Fahrscheine auf den Tisch. „Behalte ich.“ – „Ja.“
- Hotspots für Blicke: der Herd, die Quitten, die offene Tür, Nadas Hände.

**Sonntag** (Karte): „Sonntag. Zlata fährt mit Vlado nach Hause. Sie lässt Nada einen zweiten Ableger da, falls der erste nicht angeht.“

**Montag** (etwa 10 Minuten, spielbar, ohne zusätzliches Hindernis)
1. **Brauerei, früh.** Marko füllt den Kanister am Hahn. Keiner steht an, der Kopf ist still. Wer will, kann den zweiten Kanister vom Dachboden holen und beide füllen. Dann trägt Marko das Wasser hinauf nach Vratnik.
2. **Bare, 11 Uhr.** Zorans Begräbnis: Jasna, Ana, die Kinder, Marko, Nada, Hajra, Šehić, Kolar.
   - Der Friedhofsbeamte fragt nach dem Text für die Tafel. Jasna sieht Marko an: „Was wollte Ruža schreiben?“ Marko: „Poginuo.“ Jasna: „Dann schreiben wir es.“ Das ist keine Wahl. Den richtigen Satz hat Kapitel 4 gefunden, Kapitel 5 prüft ihn nicht noch einmal.
   - Wenn in Zimmer 214 schon davon die Rede war (nicht gespeichert), sagt Jasna nur: „Ružas Wort.“
   - Das Doppelgrab: „Ich bin ohne dich gefahren. Zurück nicht.“
   - Marko trägt mit Šehić und Damir den kleinen Sarg.
3. **Ružas Küche, Sonnenuntergang:** Kaffee, Rückmeldungen, letzte Handlung (9.4). Die Rückmeldungen:
   - **SMS Kolar** (immer): „Tri imena s vašeg spiska. Porodice su obaviještene. K.“ – „Drei Namen von Ihrer Liste. Die Familien sind benachrichtigt.“ Marko denkt an den Hahn, der läuft, und an keinen, der wartet.
   - **SMS Vesna** (immer): „Die Stillen, Teil drei: Lana Delić. Bekommen. Seite vierzehn. Diesmal kein Zeichen zu viel.“
     - Der Artikel ist ein Dokument zum Aufschlagen, sechs Zeilen.
     - Der letzte Satz: „Sie ist am 3. März 2012 angekommen. Ihre Mutter hat es gesagt.“
     - Den Satz schreibt Marko, nachdem Nada ihn gesagt hat. Er ist kein Ersatz für ihren, sondern eine Abschrift.
   - **Varianten aus früheren Kapiteln:** 11.3.

### 11.2 Wer wie endet

- **Marko:**
  - Er sitzt in Ružas Küche bei seiner Familie und bei Nada. Er hat das Wasser getragen und die Straßenbahn gezeichnet.
  - Er fährt am Dienstag nach Split zurück, als Übersetzer, mit der Gabe, mit den Toten zu reden. Das Kopfweh heißt für ihn jetzt: Da wartet einer.
  - Die Handlung, die seine Veränderung zeigt: „Nein“ am Tor, das Loslassen, die Räder.
- **Mala:**
  - Sie hat entschieden zu gehen, nachdem sie ihr Begräbnis erlebt, die Fahrscheine vergeben und ihre Mutter erreicht hat.
  - Sie ist am Samstag durch Ružas Tür gegangen, selbst, über die eigene Schwelle. Dort hat jeder Samstag ihrer Kindheit geendet.
  - Ihr Endzustand bedeutet: Sie ist angekommen. Sie wartet auf keinen, und keiner wartet auf sie.
- **Ihre Verbindung:**
  - Was endet: das Band, das Kopfweh durch ihre Nähe, die Zusammenarbeit beim Finden.
  - Was bleibt: das, was sie ihm beigebracht hat, die Räder, und das Wissen, dass sie die Fahrt zu Ende gebracht haben.
  - Was sich verändert: Er kann über sie reden. In „Die Stillen, Teil drei“ tut er es zum ersten Mal öffentlich.
- **Die übrige Welt:**
  - Nada wartet nicht mehr und schreibt im Januar keinen Brief.
  - Jasna war in Sarajevo und hat hingesehen.
  - Zlata hat ihre achtzehn Jahre auf einem Pfosten.
  - Ana hat einen Vater mit Grab.
  - Drei Familien haben eine Spur.
  - Hajras Holz hat einen Zweck, und Ružas Dach ist dicht.

### 11.3 Frühere Entscheidungen

Nur gespeicherte Werte können zuverlässig wirken (1.6). Ohne gespeichertes Kapitelende gelten die Standardwerte in der rechten Spalte, so wie Kapitel 4 mit Kapitel 3 umgeht (`96_k4_story.js:38–53`).

| Entscheidung (Quelle) | Gespeichert als | Wirkung in Kapitel 5 | Art | Standard ohne Spielstand |
|---|---|---|---|---|
| Zustimmung am Grab, Kapitel 3 (`skela_l.js:288`) | `c3end.consent` a/b/c | Malas Rückbezug in 9.2 | Dialog | b |
| Neue Antwort in München, Kapitel 4 (`97_k4_fam_b.js:277`) | `c4end.consent2` a/b/c | Rückbezug in 9.2 (nur bei Zustimmung c) | Dialog | – |
| Versprechen „frag mich bei allem“, Kapitel 3 (`herberge.js:97`) | `c3end.promise` a/b/c | Rückbezug in 9.2 | Dialog | a |
| Probe in Mostar, Kapitel 3 | `c3end.sample` / `c4end.sample` | Kolar: „Probe aus Mostar“ oder „aus dem Konsulat“; in Variante „nein“ „nicht mehr wahrscheinlich, sicher“ | Dialog | ja |
| Probe im Konsulat, Kapitel 4 | `c4end.sample2` | wie oben | Dialog | – |
| Die Kurve, Kapitel 4 | `c4end.kurve` | Prolog: Marko denkt an die Kurve; sonst erzählt Jasna sie | Dialog | nein |
| Pantoffeln, Kapitel 4 | `c4end.slippers` | Montag in Ružas Küche trägt Marko sie; Jasna: „Seine Größe.“ Sonst stellt Jasna sie an Ružas Tür und nimmt sie wieder weg: „Er ist ja da.“ | Epilog | ja |
| Dose gefüllt, Kapitel 4 | `c4end.nada` | Totenmahl: die Dose voll zurück. Sonst Plätzchen in Papier: „Die Dose habe ich vergessen. Die Plätzchen nicht.“ | Dialog | ja |
| Gefälschter Brief, Kapitel 4 | `c4end.fake` (nur, ob es ihn gab) | Ob weggeworfen oder geschickt, ist **nicht** gespeichert. Kapitel 5 erwähnt ihn nicht. Keine Variante täuscht ein Wissen vor | – | – |
| Davors Angebot, Kapitel 4 | `c4end.davor` | Montag: SMS mit Foto, Lenas Feigenzweig treibt aus | Epilog | nein |
| Antwort in der Freitagnacht, Kapitel 5 | neu | Malas Erwiderung; im Epilog Markos Gedanke zur Tasse | Dialog | – |
| Mütze am Tor, Kapitel 5 | neu | Malas Satz; im Epilog sitzt sie schief oder gerade | Bild | – |
| Schweigen in der Küche, Kapitel 5 | neu | Mala auf dem Weg nach Vratnik: „Du hast nichts gesagt.“ oder „Du hast etwas gesagt. Sie hat dich gehalten.“ | Dialog | – |

- **Keine Moralwerte, kein Vertrauenssystem.** Keine frühere Antwort verändert Malas Entscheidung oder das Ende. Sie verändern, was gesagt wird und wie es klingt.

### 11.4 Warum es ein Ende gibt und nicht zwei

- **Malas Entscheidung gehört ihr.** Ließe der Spieler Mala wählen, wäre es seine Entscheidung. Hinge sie an Markos Antwort, würde die Antwort zur Passwortfrage: Spieler würden suchen, welche Formulierung sie bleiben lässt.
- **Die Reihe hat diese Linie selbst gelegt.**
  - [E] „Mala wird danach entscheiden. Marko hat zugesagt, ehrlich zu antworten, ohne zu entscheiden.“ (`KAPITEL4_KONZEPT.md:1634`)
  - Im Spiel: „Du musst jetzt nicht auch noch für mich entscheiden.“ (`herberge.js:95`)
- **Richtung B wurde als Autorenalternative geprüft (3).** „Bleiben bei Nada“ beantwortet Gerdas Frage nicht und lässt Malas Weg offen.
- **„Ein einziges überzeugendes Ende ist besser als mehrere oberflächliche Varianten.“** Die Unterschiede liegen in Worten, Bildern und Rückbezügen, nicht darin, ob aufgelöst wird.

### 11.5 Abgeschlossener Spielzustand, Registrierung, Wiederholungspunkt

**Was endgültig gilt**
- Lana Delić liegt auf Bare unter dem Pfosten „LANA DELIĆ · 3. 3. 1976“ / „MALA · 15.1.1994“, mit einem Quittenableger.
- Mala ist am 3. März 2012 gegangen. Sie kehrt nicht zurück.
- Zoran Vuković liegt auf Bare, „poginuo 19. 4. 1993“, in einem Doppelgrab.
- Hamdija ist gegangen. Seine Liste liegt bei Kolar.
- Jasna hat die zwei entwerteten Fahrscheine, Nada Lanas Zeichnung von 1990.
- Marko hat Ružas Džezva und die Kanister.

**Registrierung, beschriebene Logik, keine behauptete Kennung**
- Nach dem Abspann wird ein Kapitelende für Kapitel 5 gespeichert, so wie für Kapitel 2 bis 4 (`96_k2_story.js:120`; `96_k3_story.js:315`; `96_k4_story.js:320`).
- Inhalt:
  - Zeitpunkt und Spielzeit;
  - Markos Antwort in der Freitagnacht;
  - Mütze;
  - Schweigen in der Küche;
  - gesehene optionale Szenen (Rades Heft, Damir, Dragica, Wohnung im siebten Stock).
- Die Kapitelwahl zeigt Kapitel 5 danach als abgeschlossen. Die Ankündigung „noch nicht erschienen“ entfällt (`design/UI_KONZEPT.md:193`).
- Eine Fortsetzung wird nirgends angekündigt.

**Wiederholungspunkt**
- Der eigene Spielstand „Vor dem Samstag“ (6.9) bleibt erhalten. Von dort lässt sich der Schluss mit anderer Antwort, anderer Mütze und anderem Schweigen neu erleben.
- Zusätzlich lässt sich Kapitel 5 in der Kapitelwahl von vorn beginnen.

### 11.6 Abspann

- Endkarte „Ende“. Der Abspann läuft über Bilder aus der Reihe:
  - die Treppe des Hotel Palma, leer;
  - die Bank an der Endstation, leer;
  - der Quittenbaum in Skela;
  - der Pfosten auf Bare.
- Dann die Widmung: „Für alle, die angekommen sind, und für alle, die sie gehen ließen.“
- Keine Szene nach dem Abspann, keine Zeile „Fortsetzung“.

---

## 12. Kritische Prüfung und Schlussfragen

### 12.1 Kontinuität

- **Geprüft gegen den Code:**
  - jede zitierte Zeile aus Kapitel 4;
  - die Zeilen aus Kapitel 1 bis 3, auf denen Rätsel oder Dialoge stehen (Fundstellen im Text);
  - die Wochentage im März 2012;
  - Lanas Todestag (Brett, `skela_l.js:417`, ein Samstag: 15.1.1994);
  - Markos Alter 1993 (`97_k4_fam_b.js:51`).
- **Erlöste Geister bleiben erlöst.** Kein Fall wird entwertet.
- **Zoran ist kein Geist.** Mala bestätigt es in der Gerichtsmedizin. So deckt es sich mit Kapitel 4 („Er wartet nicht.“, `97_k4_fam_b.js:193`).
- **Nichts wird stillschweigend umgeschrieben.** Die offenen Widersprüche aus 1.8 bleiben offen oder werden mit ausgewiesener neuer Idee gefüllt:
  - Wohnort 1992/93 offen;
  - „für Dragica“ offen;
  - Ružas Haus 1994–2003 [N];
  - die Hand am Hahn [N];
  - der Atem [N].
- **Wissensstände:**
  - Jasna und Nada erfahren nie ausdrücklich von Mala. Sie erleben etwas und sprechen aus eigenem Erkennen.
  - Marko verrät nichts, was er nur von Mala weiß, als Tatsache an Lebende. In 7.1 stützt er sich auf Zlatas eigene Erzählung, in 7.3 auf Jasnas eigenen Satz.

### 12.2 Fairness

- **Keine Pixelsuche.** Alle Pflicht-Hotspots haben eigene Namen und liegen in Räumen mit wenigen Dingen.
  - Die Dachbodenluke findet Mala, nicht der Mauszeiger.
  - Der Kasten an der Brauerei ist groß und wird von Hamdija bewacht, also auffällig.
- **Keine versteckten Pflichtgespräche.** Pflichtinformationen kommen aus Gesprächen, die das Spiel ohnehin anstößt: Jasna im siebten Stock, Nada über die Samstage, Kolar. Optionales (Rade, Damir, Dragica) wird nie gebraucht, und was es liefert, gibt es auch auf einem Pflichtweg.
- **Keine Echtzeit.**
  - Der Beschlag verblasst sichtbar, wartet aber auf die nächste Handlung.
  - „Zehn nach elf“ ist Erzählzeit, keine Uhr.
  - Das Begräbnis um 14:00 ist eine Phasengrenze. Wer bis dahin nicht fertig ist, spielt die Brauerei danach zu Ende (6.4).
- **Keine externe Wissensprüfung.**
  - Bosnische Sätze übersetzt Marko immer.
  - Für die Gravur reicht, was der Spieler erfahren hat: Name, Geburt, Tod auf dem Brett.
- **Sackgassen konzeptionell geprüft, ohne Spieltest:**
  - Der Kanister bleibt im Inventar, bis Hamdija gegangen ist.
  - Die Dose bleibt bei Marko, bis die Übergabe stimmt.
  - Falsche Verbindungen kosten nichts.
  - Šehićs Angebot gibt es notfalls am Samstagmorgen.
  - Die Gravur fragt vor jedem Schnitt.
- **Punkt ohne Rückkehr** mit Warnung und eigenem Stand (6.9).
- **Hinweise** in vier Stufen für alle drei Ketten (7). Sie bleiben freiwillig.

### 12.3 Umsetzbarkeit in der vorhandenen Engine

**Wiederverwendbar ohne Neubau**
- Räume aus Kapitel 2: `neboder`, `haustor`, `stan`, `vratnik`, `kuca`, `carsija`, `pansion`, `kazandziluk`, `tramvaj`.
- Phasen (`M.definePhases`), Notizen und Verbindungen (Muster `13_k4_notes.js`), Hinweise (Muster `15_hints_k4.js`).
- Erinnerungsbilder (`A.memory`), Dokumente (`A.doc`), Telefonstimmen (`A.phoneVoice`).
- Schwelle und Begleitung (`crossOpen`, `enterLimbo`, wie `skela_l.js:305–308`).
- Gravur-Rätsel (`A.puzzle`, wie `kazandziluk.js:35–38`).
- Figurenwechsel; Kapitelende und Kapitelwahl (`design/UI_KONZEPT.md`, D1).

**Figuren mit vorhandenen Sprites**
- Jasna, Ana, Mia, Niko (Kapitel 4).
- Nada, Zlata, Kolar (Kapitel 2 und 3).
- Hajra, Rade, Damir, Šehić, Dragica, Nedžad (Kapitel 2).
- Vlado (Kapitel 3, zu prüfen, ob als Sprite vorhanden).

**Neu zu bauen**

| Was | Umfang | Anmerkung |
|---|---|---|
| Räume | Busbahnhof, Treppenhaus 7./9. Stock, Dachboden, Brauerei, Friedhof Bare, Gerichtsmedizin | 6 Räume, dazu Hamdijas kurzes Licht |
| Hamdija | ein Sprite mit Flackern, Ruhe und Übergang | Muster: Geister aus Kapitel 4 |
| Beschlag-Ebene | halbtransparente Fläche auf einem Fenster-Hotspot, Linienzüge in Stufen, Ausblenden | kleiner Canvas-Effekt; keine Zeitlogik im Rätsel, nur kosmetisch |
| Straßenbahn mit Familie | `tramvaj` mit neuer Besetzung und Tagbeleuchtung | – |
| Erinnerungsbilder | etwa 7 | 6.7 |
| Musik | Sarajevo-Themen aus Kapitel 2, dazu ein Stück für den Samstag | – |

- **Risiken:**
  - die Beschlag-Ebene auf Touchgeräten (Zeichenanimation ohne Wischgeste, nur als Handlung „Zeichnen“);
  - die Länge des geführten Samstags. Abhilfe: Wiederholungsstand davor, Zwischensequenzen ohne Wahl überspringbar.

### 12.4 Neue Annahmen

| Nr. | Annahme | Status | Risiko und Begründung |
|---|---|---|---|
| N1 | **Malas Finger hinterlässt nur in Markos Atem eine Linie** | [N], Ergänzung | Einzige Regelergänzung. Gestützt auf das Phänomen aus Kapitel 1 (`flat.js:232`; `office.js:59`), nicht auf eine dort genannte Bedingung. Früh gezeigt (Donnerstagnacht), zweimal geprüft, begrenzt. **Ersatzlösung**, falls abgelehnt: Marko zeichnet die Straßenbahn unter Malas Anleitung („Zuerst die Oberleitung. Vier Fenster. In jedes ein Gesicht.“), Nada erkennt Lanas Art. Das kommt ohne neue Regel aus, ist aber schwächer, weil Lanas Hand fehlt. |
| N2 | Marko hat Mala im Januar nach Sarajevo begleitet und lebt weiter in Split | [N] | Füllt die Lücke zwischen Neujahr und März; widerspricht nichts |
| N3 | Lanas Begräbnis Freitag, 2. März, auf Bare; Zorans Montag, 5. März, auf Bare | [N] | Termin und Ort im Spiel offen; Recherche zu Bare |
| N4 | Hamdija Selimović, Abfüller der Brauerei, hob vorn die Hand, hielt Marko fest, begrub die sieben und schrieb die Liste | [N] | Füllt zwei offene „einer“ aus Kapitel 4, ohne dem Wortlaut zu widersprechen. Ein neuer Geist mit eigenem Interesse, kein Retter |
| N5 | Hamdija steckte den Rechenschieber in Zorans Tasche | [N] | Deutet einen belegten Fund (`13_k4_notes.js:30`) neu, ohne ihn zu ändern |
| N6 | Die Kanister stehen auf Ružas Dachboden | [E]-Idee (`KAPITEL4_KONZEPT.md:1612`), übernommen | Folgt aus Kapitel 4: Marko trug sie zu Baka |
| N7 | Eine Familie aus Foča wohnte 1994 bis 2003 in Ružas Haus | [N] | Füllt die Lücke aus 1.8, ein Satz von Hajra |
| N8 | Die Wohnung im siebten Stock steht leer, Šehić hat den Schlüssel | [N] | Recherche zur Eigentumslage nach dem Krieg; erzählerisch nur ein Zugang |
| N9 | Nada hat bei Nedžad eine Tafel bestellt | [N] | Nedžad graviert in Kapitel 2 auf Bestellung (`kazandziluk.js:33–38`) |
| N10 | Ana kommt mit Mia und Niko; Tobias bleibt in München | [N] | „Alle“ aus Kapitel 4, ohne den Schwager zu brauchen |
| N11 | Vlado fährt Zlata (TAM-Lastwagen aus dem früheren Entwurf) | [E], übernommen | Vlado ist aus Kapitel 3 (`skela_l.js:340`); das Fahrzeug ist Entwurf |
| N12 | Lana sieht im Licht Ružas Küche und ihren Vater | [N] | Folgt dem Muster der Reihe (jeder sieht sein Bild); Esads Satz ist belegt (`stan.js:13`) |
| N13 | Rades altes Fahrtenheft mit „Subota, 11:10. Dvoje djece.“ | [N] | Rade trägt „jede Fahrt“ ein (`carsija.js:53`); das Heft macht Kapitel-2-Wissen neu zugänglich |

### 12.5 Recherchefragen

1. **Sarajevska pivara:**
   - öffentliche Wasserstelle damals und heute;
   - Lage von Mauer, Linde, Hahn;
   - Gedenktafeln.
   - Der 19. April 1993 ist ein Datum des Spiels. Zu prüfen ist, dass kein reales Ereignis falsch zugeordnet wird.
2. **Notgräber 1993, Exhumierungen 2003, Übergabe 2012:** Ablauf bei der Identifizierung in Sarajevo, also welche Stelle, ob die Familie die Überreste sieht und ob persönliche Dinge zurückgegeben werden. Dazu Frau Kolars Behörde (im Spiel „aus Mostar“, `97_k4_fam_a.js:250`).
3. **Friedhof Bare:**
   - Belegung 2012, alle Konfessionen;
   - vorläufige Grabzeichen (Pfosten, Tafel);
   - Doppelgrab;
   - ob man dort einen Quittenableger setzen darf.
4. **Linie 3, 2012:** Strecke Ilidža–Baščaršija, Haltestelle Alipašino Polje (Verlegung nach dem Krieg, `carsija.js:47`), Takt am Samstag, Fahrzeuge, Entwerter, Wendeschleife und Häuschen an der Endstation.
5. **Fernbus München–Sarajevo 2012:** Ankunftsort (Hauptbusbahnhof oder Lukavica), Ankunftszeit, Route über Tarčin.
6. **Wetter 1. bis 5. März 2012** nach dem schneereichen Februar 2012; Sonnenuntergang Anfang März.
7. **Žuta tabija:** nachts zugänglich? Blick bis Ilidža?
8. **Bräuche:** Totenmahl in einer gemischten Familie; Begräbnis am Freitag; Besuch am Geburtstag.
9. **Die erste Straßenbahn nach dem Stillstand im März 1994:** genaues Datum (Rade sagt nur „März“).
10. **Sprache:** alle bosnischen Sätze von einer Sprecherin oder einem Sprecher aus Sarajevo prüfen lassen, ijekavisch: „Stigla si“, „Jesam, mama“, „Šuti, Mali“, „Drži se“, „Ima pritiska!“, „Kanisteri u red!“, „Ne diraj kutiju!“, „Koja je godina?“, „Česma. Teče. I niko ne čeka.“, „Tražim svoju kćer …“.
11. **Namen:** „Hamdija Selimović“ auf ungewollte Übereinstimmung mit realen Personen prüfen.

### 12.6 Qualitätsprüfung (konzeptionell, kein ausgeführter Spieltest)

**Bequeme Zufälle**
- Hajra an der Endstation ist kein Zufall: Jasna hat sie gebeten.
- Kolar ist in Sarajevo, weil sie die Übergabe betreut.
- Damir fährt nur, wenn Marko ihn eingeladen hat. Sonst fährt ein Fremder, und nichts hängt daran.
- Nadas Griff in der Drei bleibt bewusst offen und trägt nichts.
- **Erwogen und verworfen:** Rade als der Mann am Hahn. Das hätte eine Figur mit zu vielen Zufällen beladen (Fahrer der Samstage, Fahrer der ersten Drei, Zeuge). Stattdessen Hamdija: Sein Platz am Hahn ist der Grund, warum er dort war.

**Künstliches Schweigen**
- Mala schweigt bei der Grabtafel, weil sie in Skela gesagt hat, dass Mama und Zlata entscheiden. Das ist ihr Wort, kein Trick.
- Marko schweigt in der Küche aus Einsicht. Spricht er, geschieht dasselbe.
- Keine Figur hält ein Wissen zurück, nur damit ein Rätsel entsteht.

**Wiederholte Enthüllungen**
- Malas Identität wird nicht noch einmal enthüllt.
- Die Fahrt mit der Drei ist keine Wiederholung von Kapitel 2: andere Fahrgäste, anderer Sinn, bei Tag.
- **Erwogen und verworfen:** Mala steigt an der Endstation in eine Straßenbahn aus Licht. Stattdessen Ružas Tor. Das vermeidet ein zweites Mal Endstation und verbindet den Abschied mit dem Ort der Lüge von 1993.

**Rückwirkende Widersprüche**
- Keine Tatsache aus Kapitel 1 bis 4 wird geändert.
- Hamdija füllt zweimal „einer“. Markos Satz „Ich habe die Kanister gefüllt“ (`97_k4_fam_b.js:44`) bleibt wahr: Er stand an, Hamdija füllte am Hahn.
- Lanas „Kommst du?“ bleibt 1993 gesagt und gelogen beantwortet.

**Unbegründete neue Kräfte**
- Nur N1. Begrenzt, früh gezeigt, mit Ersatzlösung.
- Alle anderen Lösungen nutzen belegte Regeln: Loslassen und Hergeben, Schwelle und Rand, Kinder und Katzen, Nachhall, durch Wände gehen, nichts anfassen.

**Abhängigkeiten**
- Jede Pflichtinformation hat eine erreichbare Quelle vor dem Punkt ohne Rückkehr (6.4, 6.6).
- Optionales aus Kapitel 2 und 4 wird neu zugänglich gemacht.

### 12.7 Antworten auf die Schlussfragen

1. **Entsteht Kapitel 5 nachvollziehbar aus dem tatsächlichen Ende von Kapitel 4?**
   - Ja. Alles, was Kapitel 4 für März ankündigt, geschieht: die Reise „alle“, Jasna am Fenster, das Dach, die Dose, Anas Zeichnung, Lanas Begräbnis, Zorans Identifizierung.
   - Malas Frage nach dem Begräbnis und Markos ehrliche Antwort bilden den Kern.
2. **Ist es ein vollständiges Adventure und nicht nur die Erklärung der Geschichte?**
   - Ja. Es gibt drei verflochtene Ketten mit eigenen Orten und Fehlversuchen, freie Tage, einen geführten Höhepunkt mit spielbaren Handlungen und einen Epilog.
   - Geschätzt 140 bis 160 Minuten, wie Kapitel 4.
3. **Erarbeitet der Spieler die zentralen Erkenntnisse und den Abschluss selbst?**
   - Ja. Er verbindet die Gründe der beiden Namen, rekonstruiert den 19. April, ordnet die Fahrscheine in mehreren Stufen zu, wählt Ort und Augenblick der Übergabe und zeichnet mit Mala.
4. **Sind Marko und Mala beide unverzichtbar und eigenständig beteiligt?**
   - Ja, in jeder Kette und in jeder Stufe des Höhepunkts (Tabelle in 7.3).
   - Keine Figur ist Zielperson. Die Trennung kommt erst an der Schwelle.
5. **Werden ihre Entwicklungen durch Handlungen abgeschlossen?**
   - Marko: „Nein“, Loslassen, Schweigen, Wasser, Räder.
   - Mala: Zurückhaltung, Zeichnung, Entscheidung, Schwelle, Stufe.
6. **Sind die wesentlichen Fragen beantwortet?**
   - Ja (10.1, 10.2).
   - Offen bleiben nur ausdrücklich atmosphärische Motive, mit Begründung (10.3).
7. **Bleiben frühere Erfolge, Beziehungen und Entscheidungen bedeutungsvoll?**
   - Ja. Kein Geist kehrt zurück, und die Gespräche aus Kapitel 4 werden nicht wiederholt.
   - Gespeicherte Entscheidungen werden gehört (11.3). Nicht gespeicherte werden nicht vorgetäuscht.
8. **Hat das Ende genügend Nachklang, ohne einen neuen Pflichtkonflikt zu eröffnen?**
   - Ja. Es gibt Mittag unter dem Dach, einen Sonntag, einen spielbaren Montag mit Begräbnis, Küche und letzter Handlung.
   - Kein Teaser, keine Szene nach dem Abspann.
9. **Kann der Spieler nach dem Abspann sagen: „Diese Geschichte ist zu Ende erzählt“?**
   - Ja. Lana ist angekommen und gegangen, Zoran hat sein Wort, die Mütter fahren zusammen, Marko zeichnet Räder.
   - Was weitergeht, ist Leben, kein offener Fall.

---
## 13. Umsetzung im Spiel: was anders geworden ist

Kapitel 5 ist gebaut (`BERICHT_K5.md`, Komplettlösung `LOESUNG5.md`). Die Handlung, die drei Kooperationsrätsel, die Schlüsseldialoge 9.1 bis 9.4 und der Epilog sind umgesetzt wie beschrieben. Abweichungen:

| Konzept | Spiel | Grund |
|---|---|---|
| Der Brunnenmann heißt Fikret Mulić | **Hamdija Selimović**, Liste „H. S., punionica“ | In Kapitel 2 gibt es schon einen Fikret (Busbahnhof). In diesem Dokument ist der Name überall ersetzt. |
| Dachboden mit Kanistern, Hakenstange, Zastava-Schlüssel, Etui | Die Kanister liegen **im Garten unter Hajras Plane** beim Holz; Hajra nennt den Ort bei der Begrüßung. Mala spürt das Blaue, Marko hebt die Plane, Malas Nachhall „Nemoj gledati, mali“. | Kein eigener Raum für den Dachboden; der frühe Erfolg und die neue Frage bleiben erhalten. |
| Nadas Küchenfenster | Die **gläserne Balkontür** neben Nadas Küchenzeile | Nadas Wohnung aus Kapitel 2 hat keine eigene Küche mit Fenster. |
| Mala zeichnet (Handlung „Zeichnen“) | eigenes Verb **„Zeichne“**, nur wo Markos Atem eine Scheibe beschlagen hat; die Zeichnung ist im Bild zu sehen und vergeht | – |
| Zwei Proben des Atems, steuerbar | im Gespräch 9.1 als Auswahl („Versuch es auf dem Spiegel.“ / „Noch einmal.“), Mia erzählt; `a5_grenze` ist Teil von `a5_atem` | weniger Wege für denselben Erkenntnisschritt |
| Rekonstruktion des 19. April mit Wahl „(Neben ihr stehen.)“ | Mala spürt Hahn, Mitte und Brücke; Marko geht in der Mitte erzählt mit | Die Wahl hätte Marko gehört, während Mala gespielt wird. |
| Hamdijas Übergang mit kurzem Licht | Malas „Hinüberbringen“ am Hahn, ohne Zwischenwelt; „Česma. Teče. I niko ne čeka.“ | wie im Konzept „an Ort und Stelle“ |
| Nedžads Zollstock | ein Satz: Vlado hat das Brett gemessen, zweiunddreißig Zentimeter | kein eigener Schritt nötig |
| Punkt ohne Rückkehr mit eigenem Platz | eigener Stand **„Vor dem Samstag“** neben den Lesezeichen (`mala.mark.N.sat`), Abzeichen „Punkt ohne Rückkehr“ | Lesezeichen des Spielers bleiben unberührt |
| Weg nach Vratnik mit drei Haltepunkten | drei erzählte Haltepunkte in einer Folge, danach Ružas Tor | geführt wie im Konzept, ohne freien Weg |
| Kolars Anruf am Donnerstag | zu Beginn des Donnerstags | – |
| Dragicas zweites Gespräch, die Plastikflasche an der Brauerei, ein eigenes Erinnerungsbild für die Dämmerung | nicht umgesetzt; Nachhalle nutzen Bilder aus Kapitel 2 bis 4 | Umfang |
| Spieldauer 140 bis 160 Minuten (Schätzung) | Musterlösung 81 Minuten Spieltakt (gemessen) | Ein erstes Spielen mit Suchen dauert länger; gemessen ist es nicht. |
