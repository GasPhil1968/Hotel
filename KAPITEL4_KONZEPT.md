# MALA – Kapitel 4: München

### Konzept für Geschichte, Figuren und Rätsel (Entwurf, Fassung 1, nicht umgesetzt)

Stand: 6. November 2026 · Branch `claude/split-adventure-game-concept-inxuzp`

**Grundlage** ist die aktuelle Spielfassung: Commit `b4b943e`, Bau `web/index.html`, Offline-Speicher `mala-split-542f0c32b4`. Für diesen Entwurf habe ich keine Spieldatei geändert, nichts programmiert und kein ZIP gebaut.

**So sind Aussagen gekennzeichnet**

| Zeichen | Bedeutung |
|---|---|
| **[B·beob.]** | Bestätigter Spielinhalt, im laufenden Spiel beobachtet. Grundlage ist ein automatischer Durchlauf von Kapitel 3 mit Spielerhandlungen (113 Schritte, keine JS-Fehler). Dabei wurde jede gesprochene Zeile mitgeschnitten, 1725 Zeilen. Beobachtet ist damit ein Weg: Versprechen „Versprochen.“, Zustimmung b, Probe abgegeben, Davor am Samstag begleitet. Den Auszug ab dem Finale enthält `KAPITEL4_ANHANG_MITSCHNITT.md`. |
| **[B·Code]** | Bestätigter Spielinhalt, aus dem Code rekonstruiert: andere Varianten, optionale Zeilen, Kapitel 1 und 2. Belegt mit `Datei:Zeile` unter `game/src/`. |
| **[I]** | Interpretation: plausibel, vom Spiel nahegelegt, aber nicht eindeutig gesagt. |
| **[N]** | Neue Idee für Kapitel 4 oder 5. |
| **[P]** | Frühere Planung im Ausblick von `KAPITEL3_KONZEPT.md` (2.1, 9.3). Das ist kein Spielinhalt und auch nicht verbindlich. |

**Wie geprüft wurde**
- **Kapitel 3:**
  - Finale und Epilog im Code gelesen: `96_k3_story.js`, `rooms/vhof.js`, `rooms/skela_d.js`, `rooms/skela_l.js`, `97_k3_limbo_bato.js`, `97_k3_mala.js`, `rooms/starimost.js`, `rooms/ostbus.js`, `rooms/zlata_k.js`, `rooms/vermisst.js`, `13_k3_notes.js`.
  - Dazu der Mitschnitt aus dem Durchlauf.
- **Kapitel 1 und 2:** Räume, Notizen und Gespräche gezielt nach Markos Familie, Malas Grenzen, Geisterregeln und offenen Fäden durchsucht. Das waren zwei getrennte Durchsichten mit Fundstellen, wichtige Fundstellen habe ich selbst nachgelesen.
- **Nicht gemacht:**
  - kein Spieltest mit Menschen;
  - kein Durchlauf aller Varianten (optionale Zeilen und andere Zustimmungen sind nur im Code geprüft);
  - kein Spieltest dieses Entwurfs.
- **Recherche:** Für München, die Vermisstensuche und Sarajevo 1993 gibt es eine Websuche. Die Quellen stehen in 11.5, offene Fragen sind dort markiert.

---

## Inhalt

1. Womit Kapitel 3 tatsächlich endet
2. Die Aufgabe von Kapitel 4 in der Reihe
3. Drei Fortsetzungsrichtungen und die Wahl
4. Kapitel 4 vollständig: „Nicht zurückgekommen“
5. Figuren und Beziehungen
6. Spielbare Struktur
7. Drei Kooperationsrätsel, ausgearbeitet
8. Zwei Schlüsseldialoge
9. Antworten und Vorbereitungen
10. Übergang und Finale-Perspektive
11. Kritische Prüfung

---

## 1. Womit Kapitel 3 tatsächlich endet

### 1.1 Das Ende in Kürze (mit allen Spoilern)

**Sonntagnacht, 27. November 2011, in Skela.**

- **Die Überfahrt:**
  - Vlado fährt mit seinem TAM zum ersten Mal seit siebzehn Jahren nachts. Mit ihm fahren Kata, Marko und Mala.
  - Am Ufer läutet Marko die Fährglocke dreimal, mit Pausen, wie Lana damals.
  - Drüben flammt eine Laterne auf. Batos Geisterfähre legt an. Bato erkennt das Mädchen und seinen eigenen Tod („Zweitausendsechs. Im Winter.“). Er sagt: „Steig ein. Diesmal fahre ich.“
  - Mala fährt mit ihm über den Fluss, ihre Dose in beiden Händen. Am anderen Ufer sagt sie: „Darum die Glocken. Ich habe geläutet, und keiner kam.“ Marko antwortet: „Heute ist einer gekommen.“
- **Zlata:**
  - Zlata kommt mit der Lampe und bricht ihr Versprechen. Lana lebte bis Samstag. Sie sagte ihren Namen, „Mala“, und dazu „Mali čeka“.
  - Sie bat: „Sagt es keinem. Ich will selbst nach Hause kommen. Nicht als Nachricht.“
  - Marko sagt Zlata, dass Bato in jener Nacht wach war. Mala erinnert sich an den Herd.
  - Ihre Leine löst sich: „Es zieht nichts mehr.“
- **Am Grab unter dem Quittenbaum:**
  - Marko verspricht nicht mehr, er fragt: „Was willst du?“
  - Mala entscheidet:
    - Die Mutter soll alles wissen, auch Lanas eigene Bitte um Schweigen.
    - Nada und Zlata entscheiden gemeinsam, wo sie liegt.
    - Sie bringt Bato hinüber.
    - Sie könnte gehen. Sie will noch bleiben, bis die Mutter sie begräbt, und mit Marko dorthin, wohin er jetzt fährt.
  - Weil das Marko Kopfschmerzen kostet, fragt sie ihn: „Willst du das?“ Dafür gibt es drei Antworten.
  - Ein neuer Faden entsteht: „Den haben wir gemacht.“
- **In der Zwischenwelt** ziehen Marko und Bato das Fährseil. Bato sagt: „Oprosti, mala.“ Mala antwortet: „Du bist gekommen. Nur später.“ Mala bleibt am Rand, „weil ich es so will“.

**Montag, 28. November, der Epilog.**
- **Morgens:**
  - Marko ruft Nada an: „Ich habe sie gefunden.“ Nada: „Sag es mir, wenn ich da bin. Ins Gesicht.“
  - Mala geht allein auf den Scheitel der Alten Brücke. Sie hat Angst: „Aber es ist meine.“
  - Sie sagt, seit wann sie bei Marko ist: „Seit dem Winter. … Seit du mich siehst. Vorher war ich auch da. Nur leer.“
- **In Skela:**
  - Nada kommt. Vlado fährt sie nach Skela.
  - Zlata gibt Nada den Brief von 1996, zurückgekommen mit „Adresse unzureichend“, und das am Herd getrocknete Skizzenbuch.
  - Marko erzählt alles. Nada: „Das ist genau sie. … Sie kommt nach Hause.“ Zlata: „Aber den Quittenbaum behalte ich.“
  - Am Grab sieht Nada nicht zum Brett, sondern auf den leeren Platz neben Marko.
- **In der Vermisstenstelle:**
  - Frau Kolar beantragt die Exhumierung („Das dauert. Wochen.“). Nada gibt einen Tropfen Blut.
  - Marko schreibt ins Formular seinen eigenen Satz: „Sie hat mich mit der Straßenbahn zur Großmutter gebracht.“
  - Kolar fragt: „Und Sie? Haben Sie jemanden?“ Marko: „Meinen Vater. Zoran Vuković. Sarajevo, Frühjahr dreiundneunzig.“ Er gibt eine Probe ab, oder er lehnt zweimal ab.
- **Der Anruf bei der Mutter in München:** „Mama. Ich komme zu Weihnachten.“ Die Mutter: „Achtzehn Jahre reden wir nicht über ihn. … Komm. Wir reden, wenn du hier bist.“
- **Danach:**
  - Nada: „Mütter warten nicht gern, Mali. Wir können es nur.“
  - Mala: „München. … Ich komme mit.“
- **Schluss:**
  - Im Bus nach Sarajevo sitzt Mala neben Nada, Marko dahinter. „Eine von beiden weiß es. Vielleicht beide.“
  - Karte „Ende des dritten Kapitels · Fortsetzung: München“. Der Abspann endet mit „FORTSETZUNG · Kapitel 4: München“.

### 1.2 Die letzte Ermittlung und der spielbare Höhepunkt, mit Fundstellen

| Schritt | Was geschieht | Fundstelle | Status |
|---|---|---|---|
| Bedingungen für das Finale | Notizen `l3_survived`, `a3_awake`, `a3_girl`; Schalter `k3.bato.uneasy`, `k3.v.free`, `k3.b.done`. Davor muss Bato Bleistift und Zlata gehört haben, Vlado „Dann fahr still.“, und Mates Fall muss abgeschlossen sein. | `96_k3_story.js:187` | B·Code |
| Karte „Finale · Die letzte Fähre · Sonntag, 27. November · Nacht“ | Marko: „Es ist bald elf. Vlado wartet.“ | `96_k3_story.js:236–237` | B·beob. (Schritt 93) |
| Fahrt, Glocke, Geisterfähre, Batos Erkenntnis | „Zweitausendsechs. Im Winter. Ich bin eingeschlafen.“ – „Steig ein. Diesmal fahre ich.“ (Zwischenstand 1) | `rooms/skela_d.js:154ff., :197` | B·beob. (94–96) |
| Malas Überfahrt | „Halt dich fest.“ – „Ich halte meine Dose.“ – „Hier habe ich losgelassen.“ | `rooms/skela_d.js:221` | B·beob. (97) |
| Am linken Ufer | „Darum die Glocken. Ich habe geläutet, und keiner kam.“ – „Heute ist einer gekommen.“ (Zwischenstand 2) | `rooms/skela_l.js:202–203` | B·beob. (98) |
| Zlatas Erzählung | Lana lebte bis Samstag. Bitte um Schweigen: „Ich will selbst nach Hause kommen. Nicht als Nachricht.“ | `rooms/skela_l.js:229–238` | B·beob. (98) |
| „Bato war wach.“ | Spielerauswahl in einer Schleife. Mala: „Jetzt. Sie hat ihr Stück gesagt. Sag du deins.“ | `rooms/skela_l.js:239–249` | B·beob. (99) |
| Erinnerung „Der Ofen“, Notiz `l3_oven` | „Samstag.“ – „Samstag.“ | `rooms/skela_l.js:250–252`, `13_k3_notes.js:51` | B·beob. (99) |
| Die Leine löst sich | „Weg. … Es zieht nichts mehr. … Zum ersten Mal seit dem Fluss.“ (Zwischenstand 3) | `rooms/skela_l.js:253–262` | B·beob. (99) |
| Am Grab | Versprechen wird abgewiesen („Schon wieder.“), dann „Was willst du?“ | `rooms/skela_l.js:267–277` | B·beob. (100) |
| Malas Entscheidung | Alles für die Mutter. Die zwei Mütter wählen das Grab. Bato hinüberbringen. „Ich könnte gehen. … Ich will noch nicht. Ich will bei Mama sein, bis sie mich begräbt. Und mit dir mitkommen, wohin du jetzt fährst.“ – „Wenn ich bei dir bin, tut dir der Kopf weh. Manchmal mehr.“ – „Willst du das?“ | `rooms/skela_l.js:278–287` | B·beob. (100) |
| Drei Antworten | a „Ja.“ – „Einfach so?“ – „Nein. Aber ja.“ / b „Ja. Und wenn es zu schwer wird, sagen wir es.“ – „Beide.“ / c „Frag mich in München noch mal.“ – „Das mache ich.“ – „Dann ja. Bis München.“ | `rooms/skela_l.js:288–292` | b beobachtet, a und c B·Code |
| Der neue Faden (Zwischenstand 4) | „Den habe ich nicht festgemacht. Den haben wir gemacht.“ – „Und wenn einer von uns nicht mehr will?“ – „Dann reden wir. Wie heute.“ – „Es ist nicht leichter. Aber es ist unseres.“ | `rooms/skela_l.js:293–298` | B·beob. (101) |
| Zwischenwelt mit Bato | „Bei Hochwasser braucht es zwei.“ Marko zieht mit. „Oprosti, mala.“ – „Du bist gekommen.“ – „Nur später.“ Mala: „Ich bleibe hier. Am Rand. Diesmal, weil ich es so will.“ | `97_k3_limbo_bato.js` | B·beob. (102) |
| Anruf bei Nada | „Teta Nada. Ich habe sie gefunden.“ – „Nein. Sag es mir, wenn ich da bin. Ins Gesicht.“ | `97_k3_mala.js:207–216` | B·beob. (103) |
| Alte Brücke | „Hast du Angst?“ – „Ja. Aber es ist meine.“ Notiz `e3_since`: „Danach war ich bei dir. In Vratnik, im Winter. … Dann hast du den Karton zugeklebt. Dann war ich leer.“ | `rooms/starimost.js:142–158`, `13_k3_notes.js:115` | B·beob. (104) |
| Nada kommt | „Mali.“ … „Unter einem Quittenbaum. … Sie mochte keine Quitten.“ – Vlado fährt. | `rooms/ostbus.js:88–105` | B·beob. (104) |
| Die zwei Mütter | Brief von 1996, Skizzenbuch („Dubrovnik. Unser letzter Sommer am Meer.“, „Der Junge mit den Ohren.“). Marko erzählt alles. „Das ist genau sie.“ Zlata behält den Quittenbaum. Nada sieht auf den leeren Platz neben Marko. | `rooms/zlata_k.js:40–60`, `rooms/skela_l.js:337` | B·beob. (105–107) |
| Vermisstenstelle | Exhumierung beantragt: „Staatsanwaltschaft, Gerichtsmedizin, dann der Abgleich. Das dauert. Wochen.“ Nadas Probe. Das Formular: „Dann brauche ich ein größeres Feld.“ | `rooms/vermisst.js:17–50` | B·beob. (108–109) |
| Die Frage nach dem Vater | „Und Sie? Haben Sie jemanden?“ – „Zoran Vuković. Sarajevo, Frühjahr dreiundneunzig.“ | `rooms/vermisst.js:56–60` | B·beob. (110) |
| Probe ja | „Ich mache das.“ – „Gut.“ – „Mehr sagst du nicht?“ – „Das ist dein Vater.“ – „Achtzehn Jahre. Und es dauert eine Sekunde.“ Kolar: „Ihre Probe zusammen mit Ihrer, dann wird der Abgleich sicherer.“ Mala: „Du hast ihn gesucht. Gerade eben. Das war die Sekunde.“ | `rooms/vermisst.js:61–71` | B·beob. (110) |
| Probe nein (zweimal) | Mala: „Du suchst mich, damit du ihn nicht suchen musst.“ Kolar: „Ihre Probe allein hilft uns wenig. … Dazu braucht es eines seiner Kinder.“ – „Meine Schwester. Ana. Auch in München.“ Notiz `e3_mothersample`, Schalter `k3.e.sampleAna`. | `rooms/vermisst.js:72–82` | B·Code |
| Anruf bei der Mutter | „Mama. Ich komme zu Weihnachten.“ – „Und sie brauchen eine Probe von dir. Für Tata.“ (ohne eigene Probe: „… von Ana. Und alles, was du weißt.“) – „Deshalb rufst du an.“ – „Nicht nur.“ – „Achtzehn Jahre reden wir nicht über ihn. Und jetzt am Telefon.“ – „Komm. Wir reden, wenn du hier bist. Nicht am Telefon.“ | `rooms/vermisst.js:84–95` | B·beob. (111) |
| Danach | Nada: „Mütter warten nicht gern, Mali. Wir können es nur.“ Kolar: „Wir rufen Sie an. Es dauert. Aber wir rufen an.“ Mala: „Ich habe dich am Grab gefragt, ob du das willst. Ich komme mit.“ | `rooms/vermisst.js:96–98` | B·beob. (111) |
| Bus nach Sarajevo | Großmutters Džezva wieder in Markos Hand. Erinnerungsbild: Nada am Fenster, Mala neben ihr, Marko dahinter. „Eine von beiden weiß es. Vielleicht beide.“ | `rooms/ostbus.js:107–120` | B·beob. (112) |
| Kapitelende | Speichert `mala.c3end`: Zustimmung, Versprechen, Gespräch 2, Probe, Zahl der Nachfragen und der übergangenen Fragen. Karte „Ende des dritten Kapitels“ / „Fortsetzung: München“. Abspann bis „FORTSETZUNG · Kapitel 4: München“. | `96_k3_story.js:313–317` | B·beob. (113) |

### 1.3 Was eingetreten ist und was aussteht

| Eingetreten (am Ende von Kapitel 3) | Steht aus |
|---|---|
| Lanas Tod ist vollständig geklärt: Seil, Fluss, Schilf, Herd, Samstag. | Exhumierung, Abgleich und Identifizierung: „Das dauert. Wochen.“ (`rooms/vermisst.js:23`) |
| Nada weiß alles über den Tod, auch Lanas eigene Bitte. | Lanas Begräbnis. Mala will dabei sein (`rooms/skela_l.js:285`). |
| Zlatas Versprechen ist gebrochen, Bato ist hinübergebracht, Vlado ist nachts gefahren. Mates Fall ist abgeschlossen, Davor bekommt den Schlüssel, Lena den Feigenzweig. | Was Nada über Lanas Anwesenheit ahnt („Eine von beiden weiß es. Vielleicht beide.“, `rooms/ostbus.js:119`) |
| Mala ist frei. Sie bleibt aus eigenem Willen. Der neue Faden zieht nicht. | Was dieses Band im Alltag kostet: Markos Kopf. In Fassung c ist die Antwort in München noch einmal zu geben. |
| Marko hat nach seinem Vater gefragt und eine Probe abgegeben (oder nicht). Er hat die Mutter angerufen und Weihnachten zugesagt. | Das Gespräch mit der Mutter, die Probe der Mutter oder von Ana, Kolars Rückruf, die Antwort auf Malas „Woher?“ |

### 1.4 Markos Stand

**Wissen**
- Er weiß alles über Lanas Tod. Er weiß, dass nicht seine Busnacht allein sie getötet hat, sondern viele Entscheidungen, auch ihre eigene.
- **Über seinen Vater:**
  - „Frühjahr dreiundneunzig. Er ist an der Brauerei Wasser holen gegangen. Er ist nicht zurückgekommen.“ (`rooms/herberge.js:119`, Pflicht in Kapitel 3; in Kapitel 2 optional `rooms/vratnik.js:24`)
  - Dazu der Satz, der nicht aufgelöst ist: „Hast du deinen Vater gesucht? Damals?“ – „Nein.“ – „Warum nicht?“ – „Weil ich wusste, dass er tot ist.“ – „Woher?“ Marko schweigt (`rooms/herberge.js:121`).
  - Das Notizbuch hält es fest: Notiz `e3_father` „Ich habe ihn nie gesucht … ‚Woher?‘ Darauf habe ich nichts gesagt.“ (`13_k3_notes.js:111`) [B]
- [I] **Marko weiß also mehr über den Tod seines Vaters, als er je gesagt hat.** Was und woher, sagt das Spiel nicht.

**Fähigkeiten und Erfahrung**
- **Beruf:** Übersetzer für Deutsch, Italienisch und Englisch (`rooms/flat.js:143`). Er schreibt Nachrufe für „Die Stillen“ in Vesnas Zeitung: „Menschen, die allein sterben, bekommen in Vesnas Zeitung zweitausend Zeichen.“ (`rooms/flat.js:199`)
- **Mit Geistern:**
  - Er sieht Geister, sobald Mala sie gefunden hat (`rooms/neboder.js:39–40`).
  - Er geht mit in die Zwischenwelt und tut dort das Letzte, das ein Geist braucht.
  - Er zieht Schlüsse im Notizbuch.
- **In Kapitel 3 gelernt:**
  - „Mala fragen“: Er fragt, bevor er über ihre Geschichte entscheidet.
  - Er übersetzt zwischen Generationen. Lena sollte „dida“ sagen, nicht „djede“. Für Mate sagte er die Durchsage auf Deutsch an.
- **Alter:** 33 („Ich bin dreiunddreißig, nicht dreizehn.“, `rooms/matejuska.js:95`, optional). Mit „Ich war fünfzehn“ für den Herbst 1993 (`rooms/haustor.js:166`) ergibt das [I] etwa das Geburtsjahr 1978.

**Verantwortung**
- Er hat Nada versprochen, Lana nach Hause zu bringen. Gefunden ist sie, das Begräbnis steht aus.
- Er hat der Mutter zugesagt: „Ich komme zu Weihnachten.“
- Vesna hält ihm seit Sarajevo eine Seite frei: „Die Stillen, Teil zwei. … Die Seite wird langsam ungeduldig.“ (`97_k3_mala.js:223`, optional)

**Haltung**
- **Bestätigt:** Die Wahrheit gehört der, die sie betrifft. Lana entscheidet über ihre Geschichte.
- **Verändert:** Er verspricht nicht mehr, er fragt.
- **Erschüttert:** Die tröstende Vorstellung, er allein sei an Lanas Tod schuld.
- [I] **Unberührt geblieben:** seine eigene Art, über den Vater zu sprechen. „Nicht zurückgekommen“ ist sein Wort, in Kapitel 2 wie in Kapitel 3.

**Ziel am Ende**
- Er will nach München, zur Mutter und zu Ana.
- Er braucht eine zweite Probe für den Vater: die der Mutter zusammen mit seiner, oder ohne eigene Probe die von Ana.
- Und er will reden: „Nicht nur.“ (`rooms/vermisst.js:92`)
- **Warum:** Kolars Frage hat ihn erreicht. In der Fassung mit Probe sagt Mala: „Du hast ihn gesucht. Gerade eben.“ In der Fassung ohne Probe sagt sie: „Du suchst mich, damit du ihn nicht suchen musst.“

### 1.5 Malas Stand

**Geklärt**
- **Wer sie ist:** Lana Delić, geboren am 3. März 1976, neunter Stock in Haus 7 (`13_k2_notes.js:162`, `rooms/haustor.js:27`, `rooms/stan.js:16`).
- **Wie sie starb:** Sie wollte im Januar 1994 Mali holen. Sie fuhr mit Vlados Lastwagen und schickte ihn weg. Sie läutete die Fährglocke, hing sich ans Seil und ließ los. Zlata fand sie im Schilf. Sie starb am Samstag am Herd.
- **Ihre eigene Rolle:** Sie selbst hat um das Schweigen gebeten (`rooms/skela_l.js:233`).
- **Warum Glocken und Fluss:** geklärt im Finale.
- **Seit wann sie bei Marko ist:** seit dem Winter 1994, leer, sichtbar seit November 2011 (`rooms/starimost.js:158`).

**Wer was weiß**
- Spieler, Mala und Marko wissen dasselbe. Das Spiel zeigt keine Szene, die Marko nicht erlebt. [B·Code, Erzählform in allen drei Kapiteln]
- Nada weiß alles über den Tod und nichts über den Geist.

**Ziele und Befürchtungen**
- Sie will bei der Mutter sein, bis die sie begräbt, und mit Marko gehen, wohin er fährt (`rooms/skela_l.js:285`).
- Sie fürchtet, ihm wehzutun: „Wenn ich bei dir bin, tut dir der Kopf weh. Manchmal mehr.“ (`:286`)
- Mostar hat sie gelehrt: Schweigen kostet die, für die man schweigt. Ihr „Sagt es keinem“ kostete Nada siebzehn Jahre. [I]

**Unerledigt**
- das Begräbnis;
- die Dose mit den zwei Fahrscheinen „für die erste Drei nach dem Krieg“, ihr letzter Geistergegenstand (`rooms/skela_d.js:221`; Kapitel 2: `97_k2_mala.js:110–114`);
- ihr Samstagsritual: um 11:10 zweimal kurz und einmal lang klopfen (`97_k2_mala.js:110`).

**Fähigkeiten und Grenzen**
- **Was sie kann:**
  - Sie geht durch Wände und Türen.
  - Sie sieht Geister und ihre Leinen.
  - Sie liest Nachhall an Orten und Dingen, auch von Lebenden (Kapitel 2: Halid, Ruža), und lauscht.
  - Sie liest durch Glas und Deckel (`rooms/antikvarijat.js:76`).
- **Was sie nicht kann:**
  - Sie kann nichts anfassen.
  - Lebende hören sie nicht (`05_engine.js:378–379`).
- **Wer sie sieht:** „Katzen. Manchmal ein Kind, das zu lange hinsieht.“ (`rooms/flat.js:312`, optional)
- **Reichweite:**
  - Kapitel 1: „Ein paar Straßen, dann zieht es.“ (`rooms/flat.js:314`)
  - Die Engine verbietet ihr allein den Gang durch einen Ausgang: „Ohne Marko komme ich nicht weit.“ (`05_engine.js:388`)
  - Seit dem Finale von Kapitel 3: „Es zieht nichts mehr.“ Der neue Faden „zieht nicht“ (`rooms/skela_l.js:261, :294`).
  - [I] Dass sie seitdem allein weiter gehen kann, ist eine Folge des Finales. Gespielt wurde es noch nicht.
- **Sprachen:** Sie liest eine deutsche Rilke-Zeile vor (`rooms/vijecnica.js:11`). Ob sie Deutsch versteht, sagt das Spiel nicht.

### 1.6 Die Beziehung

**Vertrauen**
- Aus „Mich hast du nicht gefragt“ (Kapitel 3, Gespräch 1) ist „Du fragst.“ geworden (`rooms/skela_l.js:279`).
- Das Band ist von beiden gewählt und darf von beiden wieder aufgemacht werden: „Dann reden wir. Wie heute.“

**Bearbeitet**
- wer über Lanas Tod, Körper und Geschichte entscheidet;
- Markos Schuld der Busnacht, nicht gelöscht, aber geteilt;
- Bato hat sie verziehen. [I] Ohne es auszusprechen, damit auch Marko: „Du bist gekommen. Nur später.“

**Weiter offen**
- **Der Preis des Bandes:** Markos Kopf. Das Spiel ist hier nicht einheitlich (siehe 1.8, Punkt 3).
- **Fassung c:** „Frag mich in München noch mal.“ – „Das mache ich.“ Das ist eine Verpflichtung für Kapitel 4.
- **Markos unbeantwortetes „Woher?“:** Mala hat zugesagt: „Ich frage nicht noch mal. Aber ich vergesse es nicht.“ (`rooms/herberge.js:123`)

### 1.7 Offene Handlung: tragend, vorbereitet oder beiläufig

| Faden | Fundstelle | Einordnung |
|---|---|---|
| **München zu Weihnachten** | `rooms/vermisst.js:90–96`; Abspann `96_k3_story.js:313`; Karte `:317`; „Ich fahre nicht nach München. Noch nicht.“ `rooms/westbus.js:59` | **Tragend.** Festes Ziel und fester Zeitpunkt, vom Spiel selbst angekündigt. |
| **Das Gespräch mit der Mutter** | „Komm. Wir reden, wenn du hier bist.“ `rooms/vermisst.js:94` | **Tragend.** |
| **Die Probe „für Tata“** | `rooms/vermisst.js:90`; Notiz `e3_mothersample` `13_k3_notes.js:114` | **Tragend.** Es gibt zwei Ausgangslagen: Probe ja oder nein. |
| **„Woher?“** | `rooms/herberge.js:121–123`; `e3_father` | **Tragend.** Im Spiel ausdrücklich unbeantwortet. |
| **Kolars Rückruf** | „Wir rufen Sie an.“ `rooms/vermisst.js:97` | **Vorbereitet.** |
| **Malas Bleiben, Markos Kopf, Fassung c** | `rooms/skela_l.js:284–298` | **Tragend.** |
| **Lanas Begräbnis** | `rooms/vermisst.js:23`; `rooms/skela_l.js:285`; Nada: „Und Sie kommen zur Beerdigung.“ (Mitschnitt Schritt 107) | **Tragend für Kapitel 5.** |
| **Davors Karte, Lenas Feigenzweig** | `rooms/zelenika.js:176–177`; Gegenstand `vizitka` `12_k3_items.js:26` | **Vorbereitet.** Ein Kontakt in München, nicht zwingend. |
| **Mates Botschaft an Lena** | „Im August sind die Feigen reif. Sie soll sie warm essen.“ (Mitschnitt Schritt 91) | **Beiläufig.** |
| **Nadas Ahnung** | `rooms/ostbus.js:119`; `rooms/skela_l.js:337` | **Tragend für Kapitel 5**, nicht für Kapitel 4. |
| **Die Dose mit den zwei Fahrscheinen** | `rooms/skela_d.js:221`; Kapitel 2 `97_k2_mala.js:110–114` | **Tragend für Kapitel 5.** |
| **Großmutters Džezva** | `rooms/ostbus.js:112`; Kapitel 1 `rooms/flat.js:158–160` | **Beiläufig**, kann eine Funktion bekommen. |
| **„Die Stillen, Teil zwei“** | `97_k2_talk.js:153`; `97_k3_mala.js:223` | **Vorbereitet**, offen seit Kapitel 2. |
| **Nada: „Keiner von euch hat je geschrieben.“** | `rooms/stan.js:15` (Kapitel 2, optional) | **Beiläufig**, kann eine Funktion bekommen: die Mütter aus dem siebten und dem neunten Stock. |
| **Rades „Dva putnika“** | `rooms/carsija.js:53` | **Atmosphäre** (Kapitel 5) |
| **Zoras „Aber nicht zu viel“** | `97_k2_limbo.js:48` | **Unaufgelöst, nicht zwingend.** Kapitel 3 hat es nicht aufgegriffen. |
| **Ivkas Botschaft an Zdenka** | `rooms/limbo.js:35` (Kapitel 1) | **Beiläufig.** |

### 1.8 Widersprüche und Lücken (offengelegt, nicht übermalt)

1. **Malas Reichweite.**
   - In Kapitel 1 heißt es „Ein paar Straßen, dann zieht es.“ In Kapitel 2 geht sie allein durch die Stadt („Für mich ist nichts weit, außer dir.“, `97_k2_mala.js:27`).
   - Seit Kapitel 3 zieht nichts mehr. Die Engine verbietet ihr aber weiter den Ausgang allein.
   - Kapitel 4 muss das einmal festlegen (4.2).
2. **Wo Marko 1992 bis 1994 wohnte.**
   - „Siebter Stock. Bis zweiundneunzig.“ (`rooms/neboder.js:69`)
   - Dagegen stehen der Umzug zu Ruža erst nach dem Frühjahr 1993 (`rooms/vratnik.js:24`) und die Kellerschule in Haus 7 im Winter 1993/94 (`rooms/skloniste.js:36`).
   - Kapitel 4 braucht keinen genauen Wohnort und legt keinen fest.
3. **Der Kopfschmerz.**
   - Nach der Mechanik pocht der Kopf, wenn ein *ungefundener* Geist nah ist (`06_ui.js:55–57`).
   - In Kapitel 1 hört er auf, sobald Marko Mala sieht („Zum ersten Mal seit einer Woche kein Kopfweh.“, `rooms/flat.js:357`).
   - In Kapitel 3 sagt Mala: „Wenn ich bei dir bin, tut dir der Kopf weh. Manchmal mehr.“
   - Kapitel 4 nutzt beides und macht den Unterschied zum Thema (5.2).
4. **Die Abreise von Mutter und Ana.** Das Spiel sagt nur „Mama und Ana waren schon in Deutschland“ (`rooms/vratnik.js:24`, optional). Wann und wie sie gingen, steht nicht im Spiel. Der Morgen im Frühjahr 1992 aus `KAPITEL3_KONZEPT.md` ist [P].
5. **Der Name der Mutter.**
   - Sichtbar steht er nur im Hausbuch von 1991: „Vuković (Zoran, Jasna, Marko, Ana)“ (`rooms/haustor.js:27`). Diese Notiz ist Pflicht in Kapitel 2.
   - Am Telefon in Kapitel 3 erscheint kein Name, nur „☎“ (`06_ui.js:290–295`, Stimmkennung `jasna`).
6. **Übernahmen.**
   - Kapitel 3 speichert für Kapitel 4: Zustimmung, Versprechen, Gespräch 2, Probe, Zahl der Nachfragen und der übergangenen Fragen (`96_k3_story.js:315`).
   - Nicht gespeichert werden Davor-Hilfe, Vesna-Anruf und Hajra.
   - Von den Übernahmen aus Kapitel 2 liest Kapitel 3 nur `hajra` und `father`. `confess`, `whyMostar` und `ana` werden gespeichert, aber nirgends ausgewertet.
7. **Optional Erlebtes.** Wer in Kapitel 2 nie nach dem Vater oder Ana gefragt hat, erfährt in Kapitel 3 Pflicht nur vom Vater und von München. Ana kommt in Kapitel 3 nur in der Fassung „Probe nein“ vor. **Kapitel 4 muss Ana deshalb neu einführen.**

### 1.9 Was nach Mostar als Nächstes erzählt werden muss

**Kapitel 4 muss die Geschichte erzählen, der Marko achtzehn Jahre ausgewichen ist: den Tod seines Vaters.**
- Es geht nicht um noch eine Tote im Fluss. Es geht um eine Frage unter Lebenden: Was macht eine Familie mit einer Wahrheit, die jeder vor dem anderen bewahrt hat?
- Ort und Zeit gibt das Spiel selbst vor: München zu Weihnachten, bei Mutter und Schwester.
- Mala kommt aus eigenem Entschluss mit. Sie muss herausfinden, was ihr Bleiben unter wirklichen Bedingungen bedeutet.

**Seine Aufgabe in der Reihe:**
- die Wende von Malas Tod zu den Lebenden;
- ein eigener Konflikt mit echtem Abschluss: das Schweigen der Familie Vuković;
- die Voraussetzungen für das Finale: zwei Heimkehren nach Sarajevo und die Frage, ob Mala bleibt.

---

## 2. Die Aufgabe von Kapitel 4 in der Reihe

### 2.1 Die fünf Kapitel

| Kapitel | Ort und Zeit | Leitfrage | Eigener Konflikt | Wendepunkt am Ende | Status |
|---|---|---|---|---|---|
| **1 Split** | Split, 15. bis 19.11.2011 | Wer ist sie? | Marko wehrt sich gegen seine Gabe und lernt, was Warten aus Menschen macht. | Fahrkarte nach Sarajevo, „Nur hin“. „Ich weiß nur, dass ich nicht mehr warten will.“ | B |
| **2 Sarajevo** | Sarajevo, 19. bis 24.11.2011 | Wer war sie für mich? | Marko hat Lana vergessen und trägt die Busnacht. | Mala heißt Lana. Marko verspricht Nada, sie nach Hause zu bringen. „Hin und zurück.“ | B |
| **3 Mostar** | Mostar und Skela, 24. bis 28.11.2011 | Wem gehört ihr Tod? | Marko will wiedergutmachen, Mala will selbst bestimmen. Wahrheit steht gegen Schonung. | Lana ist gefunden, Nada weiß alles. Mala ist frei, bleibt und fragt Marko. Er fragt nach dem Vater und ruft die Mutter an. | B |
| **4 München** | München, 24.12.2011 bis 1.1.2012 | **Wem gehört ein Schweigen?** | Ein Satz, mit dem eine Familie achtzehn Jahre gelebt hat: „Er ist nicht zurückgekommen.“ Marko weiß, was der Satz verdeckt. | Die Familie sagt sich die Wahrheit. Der Vater bekommt seinen Namen zurück. Die Mutter fährt im März zum ersten Mal nach Sarajevo. Mala hat gesehen, was Bleiben kosten kann. | N |
| **5 Sarajevo** | Sarajevo, 1. bis 5.3.2012, mit Samstag, dem 3. März, Lanas Geburtstag | Kann man jemanden nach Hause bringen, ohne ihn festzuhalten? | Lanas Heimkehr „selbst, nicht als Nachricht“; Malas Entscheidung danach | Zwei Begräbnisse. Die erste Drei. Mala entscheidet. | N |

### 2.2 Was Kapitel 4 leisten muss, in fünf Sätzen

- **Aus Mostar bringen Marko und Mala mit:**
  - die gemeinsame Erfahrung, dass Schonung kostet: Lanas „Sagt es keinem“ kostete Nada siebzehn Jahre;
  - Markos erste Frage nach dem Vater, mit oder ohne Probe;
  - das Versprechen an die Mutter, zu Weihnachten zu kommen;
  - ein frei gewähltes Band, dessen Preis Markos Kopf ist.
- **In Kapitel 4 müssen sie deshalb** in München die zweite Probe für den Vater klären. Sie müssen das Gespräch führen, das die Mutter „nicht am Telefon“ führen will. Und sie müssen herausfinden, ob Malas Bleiben Marko schadet.
- **Dabei stoßen sie auf** einen einzigen Satz. Seit 1993 hat ihn die ganze Familie verschieden verstanden: „Nije se vratio“, „Er ist nicht zurückgekommen“.
  - Marko hat ihn als Vierzehnjähriger selbst in die Rotkreuz-Nachricht an die Mutter diktiert. Er war dabei, als sein Vater starb.
  - Die Mutter hat ihn in München als „vermisst“ gelesen. Darauf hat sie achtzehn Jahre Hoffnung gebaut.
  - Ana hat ohne Wissen der Mutter 2004 Blut für den Abgleich gegeben.
  - Daneben stehen zwei Münchner Geisterfälle: ein Mann, der neunundvierzig Jahre Briefe mit einer Lüge geschrieben hat, und eine Tote, die aus Liebe bleibt und dem Lebenden damit schadet.
- **Durch ihre eigenen Handlungen erreichen sie:**
  - **Marko** erfährt am eigenen Leib, wie es ist, geschont zu werden: Mala hat fünf Tage geschwiegen. Er sieht zweimal, dass die Wahrheit in der Sprache des anderen trösten kann statt zu verletzen. Dann sagt er der Mutter in der Silvesternacht alles.
  - **Die Mutter** sagt ihr eigenes Stück: Sie ist 1992 ohne ihn gefahren.
  - **Der Vater** wird identifiziert, oder seine Identifizierung wird möglich.
  - **Mala** erkennt, dass ihr erstes Urteil über Markos Kopf zum Teil falsch war. Sie sieht aber an Gerda, dass Bleiben einen Lebenden festhalten kann.
- **Daraus entsteht die konkrete Aufgabe von Kapitel 5:** Im März kommen beide Toten nach Hause. Lana wird begraben, Zoran wird identifiziert und begraben. Und Mala hat ihr eigenes „bis Mama mich begräbt“ erreicht und muss entscheiden.

### 2.3 Abgrenzung: was Kapitel 4 nicht ist

- **Keine neue Suche nach Lana.** Ihre Geschichte ist erzählt. Kapitel 4 nimmt ihr nichts weg und öffnet keine Frage zu ihrer Identität.
- **Kein „Alles ist anders“.** Der Vater ist gestorben, wie Marko immer wusste. Neu ist, dass er es gesehen hat und es nicht gesagt hat. Neu ist auch, was dieses Nichtsagen bei den anderen angerichtet hat.
- **Keine Wiederholung von Mostar.**
  - Kein Fluss, keine Glocke, keine Durchsage als Lösung.
  - Keine Nacht, die aus vielen Zeugenaussagen gebaut wird. Der Tod des Vaters hat einen einzigen lebenden Zeugen: Marko.
  - Die Ermittlung richtet sich auf das Verstehen zwischen Lebenden, nicht auf den Tathergang.
- **Kein neuer Geist mit Markos Gesicht.** Der Vater ist kein Geist. Er ist nicht in München und hat nicht gewartet. Mala findet ihn nicht, und genau das ist eine Antwort (4.2).
- **Kein Vorraum für das Finale.** Das Schweigen der Familie wird in Kapitel 4 gebrochen, und beide Fälle schließen ab. Kapitel 5 bekommt die Folgen, nicht die offenen Rechnungen.

### 2.4 Was durch Kapitel 4 möglich, verständlich oder notwendig wird

- **Möglich:** Die Mutter fährt nach Sarajevo. Zoran kann begraben werden. Die Mütter aus dem siebten und dem neunten Stock reden wieder miteinander.
- **Verständlich:**
  - warum Marko seinen Vater nie gesucht hat;
  - warum er in Split blieb;
  - warum die Mutter „nicht kommt“ und jedes Jahr Geld für das Dach in Vratnik schickt (`rooms/pansion.js:31`).
- **Notwendig:**
  - Mala muss nach dem Begräbnis neu entscheiden. Sie weiß jetzt, wie Bleiben aussehen kann, wenn es festhält.
  - Marko hat versprochen, ihr dann ehrlich zu antworten. Diesmal ohne den Satz, mit dem seine Familie achtzehn Jahre geschont wurde.

### 2.5 Die frühere Planung [P] und was ich davon übernehme

`KAPITEL3_KONZEPT.md` hatte für Kapitel 4 skizziert:
- München zu Weihnachten;
- die Mutter, die die Probe verweigert;
- einen Morgen im Frühjahr 1992, an dem Marko sich vor der Abfahrt versteckte;
- Malas Rolle umgekehrt.

| Punkt der Planung | Entscheidung | Grund |
|---|---|---|
| München, Weihnachten | **übernommen** | Das Spiel selbst kündigt es an (1.7). |
| Die Mutter verweigert die Probe („Solange ich keine gebe, ist er irgendwo.“) | **übernommen, aber nicht entscheidend** | Mit Anas Probe von 2004 und Markos aus Mostar ist der Abgleich auch ohne sie möglich (4.2). Die Verweigerung wird zur Haltung, nicht zum Schloss. |
| Marko versteckte sich 1992 und blieb wegen Lana; der Vater blieb seinetwegen | **verworfen** | Das wiederholt die Schuld der Busnacht mit neuen Namen. Marko hätte dann zweimal einen Bus nicht genommen und zweimal wäre jemand gestorben. Neu ist jetzt eine andere Last: nicht die Schuld der Tat, sondern die des Schweigens. |
| Malas Rolle umgekehrt: sie versteht die Geister nicht | **abgewandelt** | Dass Mala kein Deutsch versteht, belegt das Spiel nicht (1.5). Sie versteht Schuldeutsch, aber kein Bairisch und kein Italienisch. In München übersetzt Marko auch für sie. |
| Kapitel 5 im März 2012 in Sarajevo, Lanas Begräbnis | **übernommen und verdichtet** | Der 3. März 2012, Lanas Geburtstag, ist ein Samstag. Samstag um 11:10 ist Lanas Zeit (`97_k2_mala.js:110`). |

---

## 3. Drei Fortsetzungsrichtungen und die Wahl

Alle drei spielen in München, denn das Spiel legt den Ort fest. Sie unterscheiden sich im Konflikt, nicht in der Kulisse.

### Richtung A – „Nicht zurückgekommen“ (die Familie und ein Satz)

- **Anschluss:** der Anruf, die Probe, „Woher?“, „Ich komme mit“.
- **Zentraler Konflikt:** Eine Familie schont sich seit 1993 mit einem Satz.
  - Marko weiß, was der Satz verdeckt.
  - Die Mutter hat ihn als Hoffnung gelesen.
  - Die Schwester hat heimlich gehandelt.
  - Der Konflikt hat keinen Bösewicht. Jeder hat aus Liebe geschwiegen, und genau das ist das Problem.
- **Schauplatz:**
  - Westend, Hauptbahnhof mit Gleis 11, ein Altenheim, Giesing, die Theresienwiese;
  - Weihnachten und Silvester, Schnee, Feuerwerk.
- **Marko:** Er muss die Erkenntnis aus Mostar („Mama soll alles wissen“) gegen sich selbst anwenden.
- **Mala:**
  - Sie erlebt Markos Familie, die sie als Lana kannte.
  - Sie findet eigene Fälle und überprüft ihr Urteil über Markos Kopf.
  - Sie muss lernen, mit Wissen umzugehen, das ihr nicht gehört.
- **Rätselpotenzial:**
  - Übersetzung als Ermittlung: Namen, Dialekt, ein Satz mit zwei Bedeutungen;
  - Nachhall in Dokumenten;
  - ein Versuch mit der Anwesenheit einer Toten;
  - ein Gespräch, das man mit den richtigen Worten führen muss.
- **Trägt ein einziges Finale?** Ja.
  - Das Schweigen wird in Kapitel 4 gebrochen.
  - Kapitel 5 bekommt zwei Begräbnisse und Malas Entscheidung, beide in Kapitel 1 bis 3 vorbereitet.
  - Neue Organisationen oder Regeln braucht es nicht.
- **Risiken:**
  - Das Kapitel wird zu sehr Familiendrama. Gegenmittel: zwei echte Geisterfälle mit eigenem Gewicht.
  - Marko verschweigt dem Spieler etwas. Gegenmittel: Das Spiel zeigt sein Ausweichen offen, die Wahrheit kommt durch Spielhandlung ans Licht (5.1, 11.2).

### Richtung B – „Was der Faden kostet“ (das Band unter wirklichen Bedingungen)

- **Anschluss:** „Wenn ich bei dir bin, tut dir der Kopf weh“; Fassung c.
- **Zentraler Konflikt:**
  - In München werden Markos Kopfschmerzen schlimmer.
  - Mutter und Schwester halten ihn für krank, ein Arzt findet nichts.
  - Mala glaubt, sie sei schuld, und geht. Sie trennt sich auf Zeit von ihm und lebt allein in einer fremden Stadt.
  - Ein Münchner Geist ist seit Jahrzehnten bei einer lebenden Witwe, und die Witwe verfällt.
  - Marko und Mala streiten, ob man diesen Geist zum Gehen bewegen darf.
- **Schauplatz:** dieselben Orte, dazu eine Arztpraxis und ein Mietshaus mit der Witwe.
- **Marko:** Er muss sagen, was ihm wehtut, statt „nur müde“.
- **Mala:** Selbstständigkeit durch eine Trennung; eine neue Sicht auf Geister, die bleiben.
- **Rätselpotenzial:** Zwei getrennte Figuren, die sich nicht erreichen können. Ein Fall, in dem nicht das Hinüberbringen die Lösung ist.
- **Trägt ein einziges Finale?** Nur schwer.
  - Richtung B nimmt die Frage vorweg, die das Finale tragen soll: Bleibt Mala?
  - Der Faden der Familie, den der Anruf in Kapitel 3 angelegt hat, würde zur Kulisse.
  - Eine Trennung über weite Strecken ersetzt das Zusammenspiel, das Herz des Spiels.

### Richtung C – „Halle vier“ (Diaspora und Heimkehr)

- **Anschluss:** Davors Karte, Lenas Feigenzweig, Mates „Dreißig Jahre München, am Band, Halle vier“ (`rooms/kafic.js:16`).
- **Zentraler Konflikt:**
  - Ein Fall aus der Welt der Gastarbeiter: ein Geist in einer Werkhalle, ein Kollege von Mate.
  - Davor muss entscheiden, ob er das Haus in der Herzegowina verkauft.
  - Marko stellt sich die Frage, wohin er selbst gehört: nach Split, München oder Sarajevo.
  - Die Familie steht daneben.
- **Schauplatz:** ein Werksgelände, Sendling, der Bahnhof, ein Vereinslokal.
- **Marko:** die Frage nach dem Zuhause.
- **Mala:** wenig Eigenes. Sie wäre Begleiterin in einer fremden Geschichte.
- **Rätselpotenzial:** Archive, Schichtpläne, Dialekte.
- **Trägt ein einziges Finale?** Nein.
  - „Woher?“ und die Probe blieben unbeantwortet oder würden nebenbei erledigt.
  - Mates Motive (warten, Bus, Sohn, Durchsage) kämen zum zweiten Mal.
  - Kapitel 5 müsste die Familie, Lanas Begräbnis und Malas Entscheidung zugleich tragen.

### Die Wahl: Richtung A, mit je einem Element aus B und C

**A trägt am besten.**
- **Kontinuität:** Fast alles, was Kapitel 3 für den Schluss anlegt, zielt auf die Familie Vuković: der Anruf, die Probe, „Woher?“, „Nicht nur.“, die Karte „Fortsetzung: München“.
- **Figurenentwicklung:** A stellt Markos Erkenntnis aus Mostar persönlich auf die Probe, ohne ihn zum Anfänger zu machen. Mala bekommt ein eigenes Anliegen, ohne dass ihre Identität wieder geöffnet wird.
- **Spiel:**
  - Übersetzung wird zur Ermittlungsmechanik, passend zu Markos Beruf.
  - Mala kann seit Mostar allein gehen. Daraus entstehen neue Formen der Zusammenarbeit.
- **Umfang der Reihe:** Nach A bleibt für Kapitel 5 eine klare, eigenständige Aufgabe übrig, ohne Nachholbedarf.

**Aus B übernommen:**
- Markos Kopf als ehrlich verhandelter Preis;
- Gerdas Fall: eine Tote, die bleibt und einem Lebenden schadet.

Mala trennt sich nicht über weite Strecken. Sie geht nur zeitweise allein.

**Aus C übernommen:** Davor und Lena als Münchner Kontakt mit kleiner, eigener Fortsetzung.

---

## 4. Kapitel 4 vollständig: „Nicht zurückgekommen“

### 4.1 Arbeitstitel, Prämisse, Thema

**Arbeitstitel:** *Nicht zurückgekommen* · Kapitel 4: München

**Prämisse**
- Marko fährt über Weihnachten zu Mutter und Schwester nach München. Er will eine zweite Probe, damit sein Vater identifiziert werden kann, der seit April 1993 vermisst ist.
- In München hört er den Satz, mit dem seine Familie seit achtzehn Jahren lebt: „Er ist nicht zurückgekommen.“ Er weiß, was der Satz verdeckt, denn er war dabei.
- Mala ist seit Mostar frei und aus eigenem Entschluss mitgekommen. Sie sieht in München, was die Lebenden nicht sehen. Sie muss entscheiden, was sie mit Wissen tut, das nicht ihr gehört.
- Zwei Tote in der Stadt zeigen beiden, was Schonung und Bleiben kosten können:
  - ein alter Gepäckträger am Gleis 11, der neunundvierzig Jahre lang „Mir geht es gut“ nach Hause schrieb;
  - eine Frau im Altenheim, die jeden Nachmittag um drei ihren Mann besucht, obwohl sie seit September tot ist.

**Thema:** *Wem gehört ein Schweigen?*
- In Mostar war die Frage, wem ein Tod gehört. Die Antwort war: der Toten.
- In München geht es um eine Wahrheit, die mehrere betrifft: den, der sie gesehen hat, die, die gewartet hat, und die, die zu klein war. Wer sie für sich behält, entscheidet für die anderen.
- Der Gegensatz ist nicht Lüge gegen Wahrheit. Es geht darum, ob man die Wahrheit **in der Sprache des anderen** sagen kann.
- Das ist Markos Beruf, und genau das hat er bei sich selbst nie getan.

### 4.2 Der zentrale Konflikt

**Drei Schweigen in einer Familie, ein viertes daneben**

| Wer | Was sie oder er weiß | Was sie oder er sagt | Warum geschwiegen wird |
|---|---|---|---|
| **Marko** (33) | Er war am 19. April 1993 an der Brauerei, als die Granate in die Schlange fiel. Er hat seinen Vater liegen sehen. Er hat die Kanister gefüllt und nach Hause getragen. [N] | „Er ist Wasser holen gegangen und nicht zurückgekommen.“ [B] | Mit vierzehn wollte er nicht sagen müssen, dass er dabei war. Später wurde der Satz zu seinem Wort für das, was er nicht ansehen will. |
| **Jasna** (58) | Sie ist im Mai 1992 mit Ana ohne Marko gefahren [N]. Seit 1993 hält sie an dem Satz aus Ružas Rotkreuz-Nachricht fest: „nije se vratio“, er ist nicht zurückgekommen. In München las sie ihn als „vermisst“. [N] | „Achtzehn Jahre reden wir nicht über ihn.“ [B] Sie sagt nie, dass sie gefahren ist, obwohl Marko nicht da war. [N] | Solange er vermisst ist, hat sie ihn nicht im Stich gelassen. Und solange sie nichts weiß, muss sie nicht wissen, wie. |
| **Ana** (27) | Im Oktober 2004 hat sie in München bei einer Sammelaktion für den DNA-Abgleich Blut gegeben, ohne es der Mutter zu sagen. [N, Rahmen in 11.5] | Nichts. | Sie wollte es wissen, ohne der Mutter wehzutun. Sie hoffte, die Nachricht käme irgendwann „von selbst“. |
| **Mala** (daneben) | Ab dem ersten Weihnachtstag weiß sie aus dem Nachhall einer Rotkreuz-Nachricht, dass Marko dabei war und den Satz selbst wollte. [N] | Nichts, fünf Tage lang. | Sie hat versprochen, nicht mehr zu fragen. Sie will ihn schonen. Genau das wirft er ihr später vor. |

**Was 1992 und 1993 geschah** (Chronologie für alle Szenen; Anker im Spiel als [B])

| Zeit | Ereignis | Status |
|---|---|---|
| 1978 | Marko geboren. Er ist 33 („dreiunddreißig“, `rooms/matejuska.js:95`) und war im Herbst 1993 fünfzehn (`rooms/haustor.js:166`). | I aus B |
| 1984 | Ana geboren | N |
| 1988 | Foto „Mala i Mali · 1988 · N. R.“ | B (`97_k2_mala.js:96`) |
| **Mai 1992** | Jasna fährt mit Ana in einem Bus für Frauen und Kinder aus der Stadt. Der Bus fährt einen Tag früher als angesagt. Marko ist an diesem Morgen bei Großmutter Ruža in Vratnik, und der Weg quer durch die Stadt liegt unter Beschuss. Zoran klopft an die Scheibe: „Fahrt. Wir kommen nach.“ Sie kommen nicht nach. | N (Rahmen in 11.5) |
| Juni 1992 | Ankunft am Münchner Hauptbahnhof. Ein Mann mit alter Gepäckträgermütze trägt die Tasche und will kein Geld. (Er wird Fall A, 4.6.) | N |
| August 1992 | Lana bringt Marko das verkohlte Blatt aus der Bibliothek. | B (`97_k2_mala.js:106`) |
| 1992–93 | Zoran und Marko in Sarajevo, Mutter und Ana „schon in Deutschland“ | B (`rooms/vratnik.js:24`) |
| **19. April 1993, Montag** | Wasserstelle an der Brauerei, lange Schlange. Zoran schickt Marko ans Ende, um für Dragica anzustehen. Er selbst fragt vorn, „ob der Druck wieder da ist“. Eine Granate schlägt ein. Einer hält Marko fest: „Nemoj gledati, mali.“ Marko schaut hin. Danach füllt er beide Kanister (blau, „VUKOVIĆ“ in roter Farbe) und trägt sie nach Vratnik, ohne einen Tropfen zu verschütten. | N (Datum erfunden; Beschuss von Wasserstellen 1993 belegt, 11.5) |
| April/Mai 1993 | Ruža sucht tagelang in den Leichenhallen. Sie findet Zoran nicht: Er hatte keine Papiere bei sich und wurde ohne Namen in einem Notgrab beerdigt. Ruža will in die Rotkreuz-Nachricht „poginuo“ schreiben, gefallen. Marko bittet: „Napiši ‚nije se vratio‘.“ | N |
| 1994 | Jasna stellt beim Suchdienst einen Antrag: „vermisst seit April 1993“. | N |
| November 1993 | Die Busnacht | B |
| Januar 1994 | Lana stirbt in Skela. | B |
| 12. Februar 1994 | Ruža stirbt. | B (`rooms/kuca.js:32`, `rooms/pansion.js:12`) |
| Mai 1994 | Marko sucht Lana in den Hotels von Split und bleibt dort. Jasna will ihn nach München holen, er sagt: „Ich warte hier.“ Auf wen, sagt er nicht. | B (Suche, `rooms/tramvaj.js:59`); N (Bleiben, Mutter) |
| 1997 | Jasna wird Pflegehelferin im Altenheim. Ab 2000 hat sie ein Bleiberecht; davor lebte sie mit Duldung. | N (Rahmen in 11.5) |
| 2003 | Das Notgrab wird exhumiert. Die Überreste werden als „NN“ aufbewahrt, in der Jackentasche ein Rechenschieber, eingeritzt „Z. V.“. | N |
| Oktober 2004 | Ana gibt bei einer Sammelaktion für Angehörige von Vermissten in München Blut. Jasna lehnt ab: „Solange ich keine gebe, ist er irgendwo.“ | N (Sammelaktionen in Deutschland 2004 belegt, 11.5); Satz aus P |
| 28.11.2011 | Marko gibt in Mostar seine Probe ab, oder er lehnt ab. | B |

**Warum der Abgleich jetzt möglich ist**
- Für einen Abgleich braucht es nach Angaben der ICMP in der Regel mehr als einen Angehörigen (11.5).
- Mit einer einzigen Probe, der von Ana aus dem Jahr 2004, blieb der Mann ohne Namen.
- **Fassung „Probe ja“:** Mit Markos Probe aus Mostar kommen zwei Kinder zusammen. Am 27. Dezember ruft Frau Kolar an: Die Übereinstimmung ist hoch. Die förmliche Identifizierung macht die Gerichtsmedizin in Sarajevo im neuen Jahr, mit der Familie.
- **Fassung „Probe nein“:** Kolar hat einen Kandidaten mit Datum, Ort und Rechenschieber. Ihr fehlt die zweite Probe eines Kindes. Marko gibt sie in München ab (4.5, Tag 2). Die Bestätigung kommt nach dem Kapitel.
- [N] **Die Folge für die Geschichte:** Die Verweigerung der Mutter entscheidet nichts mehr. Die Wahrheit kommt so oder so. Offen ist nur, *wie* sie bei ihr ankommt und wer sie ihr sagt.

**Warum der Vater kein Geist ist** [N]
- In Jasnas Wohnung sucht Mala nach ihm. Sie findet keinen Geist und keine Leine, nur den Nachhall einer Wartenden: „Hier ist keiner. Nur sie.“
- Später sagt sie: „Manche gehen gleich. Die, die nichts festhält.“
- **Das ist eine bewusste Entscheidung:**
  - Ein Vater, der als Geist auf seinen Sohn wartet, wiederholte Mates Fall aus Kapitel 3.
  - Er würde dem Kapitel außerdem eine Antwort aus dem Jenseits geben, wo es um die Lebenden geht.
  - Dass er *nicht* gewartet hat, ist für Marko die erste Erleichterung des Kapitels. Für Jasna ist es die schwerste Wahrheit, denn nur die Lebenden haben gewartet.

**Malas Freiheit in München** (Regel, aus dem Finale von Kapitel 3 abgeleitet, [N] als Umsetzung)
- **Was neu ist:** Seit „Es zieht nichts mehr“ kann Mala allein durch Ausgänge gehen und allein über den Stadtplan reisen.
- **Was nicht neu ist:**
  - Sie kann nichts anfassen. Lebende hören sie nicht. Telefonieren kann sie nicht.
  - Wer etwas von ihr wissen soll, braucht Marko.
  - Getrennte Wege heißen also: hingehen, sehen, zurückkommen, erzählen.
  - Markos Geistersicht hängt weiter daran, dass sie einen Geist gefunden hat.
- **Sprache** [N, verträglich mit 1.5]: Mala hatte „vier Jahre Deutsch, bei Frau Kovač“. Bairisch und Italienisch versteht sie nicht. In München übersetzt Marko auch für sie.

### 4.3 Zeit, Wetter, Kalender

| Tag | Datum | Wetter | Kalender |
|---|---|---|---|
| Prolog | Sa 24.12.2011, Heiligabend | Neuschnee in der Nacht, morgens −4 °C | Läden bis 14 Uhr; Jasna hat Frühdienst bis 14 Uhr. |
| Tag 1 | So 25.12. | klar, kalt | Feiertag; Jasna hat Frühdienst. |
| (Karte) | Mo 26.12. | Schneeregen | Feiertag; Jasna schläft nach dem Nachtdienst. |
| Tag 2 | Di 27.12. | grau, Tauwetter | Ämter und Bahnhofsmission offen; Kolar ruft an. |
| Tag 3 | Mi 28.12. | Schnee | Anruf in Italien; Versuch im Heim |
| Tag 4 | Do 29.12. | trocken, kalt | Sepps Abschied; Gerdas letzter Nachmittag |
| Tag 5 | Fr 30.12. | Nebel | kurzer Tag, nachts die Hackerbrücke |
| Finale | Sa 31.12., Silvester | Frost, klare Nacht | Feuerwerk ab etwa 23 Uhr |
| Epilog | So 1.1.2012 | Sonne auf altem Schnee | Neujahr |

**Feiertage ohne religiöse Zeichen**
- Ana feiert mit den Kindern deutsche Weihnachten: Baum, Bescherung.
- Jasna hält es wie früher in Jugoslawien: Die große Familienfeier ist Neujahr, mit Tannenbaum und Djed Mraz (11.5).
- So lebt die Familie die Spannung zwischen zwei Kalendern, ohne dass das Spiel eine Religion zeigen muss. Kapitel 1 bis 3 vermeiden das ebenfalls (`BERICHT_K3.md` 5.6).

### 4.4 Orte und ihre Funktion

| Ort | Was man dort untersucht, verändert oder versteht | Menschen | Wie er sich verändert |
|---|---|---|---|
| **ZOB an der Hackerbrücke** (Fernbusbahnhof, seit 2009) | Ankunft. Der kurze erste Fall mit Hansi zeigt das Können der beiden und eine neue Grenze: Bairisch. | Taxifahrer Wastl, Reinigungskraft; Geist Hansi | Am Ende des Kapitels ist er Abfahrtsort. |
| **Hackerbrücke** | Brücke über vierzig Gleise, Blick auf Hauptbahnhof und Theresienwiese. Hier sagt Marko Mala die Wahrheit (8.2). | – | Morgens Durchgang, in der letzten Nacht der Ort des Gesprächs |
| **Westend, Jasnas Haus** (Treppenhaus, Wohnküche mit Flur, Schlafzimmer) | Pantoffeln in Größe 44, Zorans Foto mit dem roten Zastava, die Mappe „Vratnik – krov“, die verschlossene Kiste im Schrank. Mala liest durch den Deckel. | Jasna; Nachbarin Frau Huber mit Katze Mucki | Im Epilog gibt Jasna Marko die Pantoffeln. Die Kiste steht offen auf dem Tisch. |
| **Anas Wohnung in Giesing** | Heiligabend und Silvester. Anas Schuhkarton mit Fotos und Lanas Straßenbahn-Zeichnung. Niko sieht Mala. | Ana, ihr Mann Tobias, Mia (7), Niko (3) | Silvester: Jasnas leerer Stuhl, um 23:15 fehlt ihr Mantel. |
| **Theresienwiese und Bavaria** | Leere Festwiese im Schnee, Rodelhang. Gespräch mit Ana. Jasnas täglicher Weg zur Arbeit. | Ana, Kinder | – |
| **Hauptbahnhof, Gleis 11, Bahnhofsmission** | Fall A: Sepp, der Gepäckträger. Frau Wimmer und sein Koffer. | Frau Wimmer (Ehrenamt), Reisende; Geist Sepp | Am Donnerstag findet hier sein Abschied statt. |
| **Bunker unter Gleis 11** (nur Mala) | Nachhall der Weiterleitungsstelle für ausländische Arbeitskräfte, 1962: Hier wird Giuseppes Name falsch geschrieben. | – | Wird zur Zwischenwelt: Bahnsteig 1962, ein Zug nach Süden. |
| **„Bar Sport“ im Bahnhofsviertel** | Signor Enzo kam 1962 im selben Zug wie Peppino. Er ist der Zeuge für den Widerspruch Bairisch gegen Italienisch. | Enzo (78) | – |
| **Städtische Friedhöfe, Verwaltung** | Die Bestattung von Amts wegen, Termin Donnerstag. Die Akte „Josef Rugiero“. | Herr Obermaier | Mit dem richtigen Namen wird der Termin abgesagt. |
| **Haus am Bavariapark** (Altenheim: Eingang, Aufzug mit Flur, Gemeinschaftsraum, Zimmer 214, Dienstzimmer) | Fall B: Gerda und Alois, drei Uhr, der Versuch. Jasnas Arbeitswelt. Silvesternacht. | Jasna, Pflegedienstleiterin Frau Ertl, Pfleger Kevin, Hausmeister Kraus; Alois Lechner (89); Geist Gerda | Um drei kein Warten mehr am Aufzug, Alois hält die Kanne. In der Silvesternacht der Höhepunkt. |
| **Davors Balkon in Moosach** (freiwillig) | Lenas Feigenzweig, ertränkt. Anruf bei Jela in Mostar. Davors Angebot zu fahren. | Davor, Lena | – |
| **Zwischenwelten** | Sepp: Bahnsteig 1962. Gerda: Trambahn-Depot bei Nacht. | – | – |

### 4.5 Die Handlung

#### Prolog „Heiligabend“ (Samstag, 24. Dezember)

**Ankunft**
- **Busfahrt:** Kapitelkarte, dann das Erinnerungsbild „Im Bus nach München“ auf dunklem Grund. Die Sätze hängen von den Übernahmen ab (6.2). Mala zählt die ganze Nacht Lichter.
- **Nadas Gruß:** Nada hat Marko eine Dose Vanilice für die Mutter mitgegeben: „Sag ihr: von Nada, vom Neunten.“
- **ZOB, 7:40:**
  - Schnee. Eine SMS von Ana: „Mama arbeitet bis 14 Uhr. Schlüssel bei Frau Huber, 2. Stock. Ich hol dich NICHT ab, ich muss Plätzchen backen. A.“
  - Am Bussteig pocht Markos Kopf: Ein Geist ist in der Nähe.
- **Hansi am Bussteig:**
  - Mala findet einen alten Mann im Fahrkartenmantel. Er verkauft am Pfeiler Fahrkarten, wo früher sein Häuschen stand: „Sarajewo, Schplit, Sagreb!“
  - Mala versteht nur Bruchstücke. Marko kann mit ihm reden, aber Hansi wartet auf seine Ablösung, und Markos Hochdeutsch nimmt er nicht an: „Sie san ned vo do.“
  - Marko bittet den alten Taxifahrer Wastl, der Hansi kannte, einen Satz zu einem leeren Pfeiler zu sagen. Wastl tut es, amüsiert: „Feierabend, Hansi. I übernimm.“ Hansi antwortet: „Na also. Servus, Burschi.“ Dann geht er.
  - Das ist der erste Erfolg: Die beiden können das inzwischen. Und das neue Problem zeigt sich gleich mit: In München übersetzt Marko auch für Mala, und manchmal braucht er die Münchner selbst. Mala: „In Sarajevo hast du für die Toten übersetzt. Hier musst du es für mich tun.“

**Jasnas Wohnung**
- **Der Weg:** über die Hackerbrücke. Mala: „Eine Brücke über Züge. Er hätte sie gemocht.“ Marko: „Er hat Brücken über Wasser berechnet.“
- **Frau Huber** gibt den Schlüssel. Ihre Katze sieht Mala. Frau Huber erzählt: Jasna arbeite jedes Silvester, und die Pantoffeln an der Tür stünden dort, „seit sie eingezogen ist. Ich hab nie gefragt.“
- **Erkunden** (ohne Pflichtreihenfolge):
  - Pantoffeln in Größe 44;
  - Zoran mit dem roten Zastava (`97_k2_talk.js:77`);
  - die Mappe „Vratnik – krov“ mit Überweisungen für Ružas Dach;
  - Anas Kinderzeichnungen;
  - die verschlossene Kiste im Schrank: Marko sagt „Nicht ihre Kiste.“, und Mala lässt sie in Ruhe.
- **Kein Geist:** Mala sucht nach einem Geist. „Hier ist keiner. Nur sie. Ihr Warten liegt auf allem wie Staub, der nicht fällt.“
- **11:10:** Mala klopft von innen an die Wohnungstür, zweimal kurz, einmal lang. „Samstag.“ Marko: „Du klopfst noch.“ Mala: „Jeden Samstag. Wo du gerade bist. Du hast es nur nie gehört.“
- **Kaffee:** in Großmutters Džezva. „Kaffee kocht man nicht. Man wartet auf ihn.“ (`rooms/flat.js:160`)

**Jasna kommt nach Hause**
- 14:20, Wiedersehen. Sie sieht die Džezva: „Ružina.“
- **Nadas Dose:**
  - „Nada Delić. Nach neunzehn Jahren. Und sie schickt Vanilice.“
  - Marko erzählt, dass er Lana gefunden hat. Jasna setzt sich und erinnert sich: „Sie hat dich jeden Samstag abgeholt. Zehn nach elf. Zweimal kurz, einmal lang. Ich habe aufgemacht, bevor du die Schuhe anhattest.“ Mala, leise: „Sie weiß es noch.“
- **Die Probe:** Marko fängt mit der Probe an. Jasna steht auf: „Nicht heute. Heute ist Heiligabend. Ana wartet mit dem Essen. Zieh ein Hemd an.“
- Damit ist Markos erster Plan gescheitert (6.2 endet hier).

**Heiligabend bei Ana**
- Würstel mit Kartoffelsalat, dazu Jasnas Sarma und viel zu viele Plätzchen.
- **Tobias** übt Bosnisch aus einem Buch und wünscht „Sretna Nova godina“, eine Woche zu früh.
- **Niko** (3) sieht Mala am Fenster: „Da ist ein Mädchen mit Schal. Sie zählt die Lichter.“ Ana lacht: „Sein unsichtbarer Freund.“ Jasna hört „Schal“ und wird still. Mala, berührt: „Er sieht mich.“ Marko: „Sag nichts.“ Mala: „Ich kann gar nichts sagen. Er hört mich nicht. Er sieht nur.“ (Regel aus Kapitel 1, `rooms/flat.js:312`)
- **In der Küche** sagt Ana, ohne sich umzudrehen: „Wir müssen reden. Ohne Mama.“ Mehr nicht, denn die Kinder kommen.
- Bei Anas Kindern ist Marko „der Onkel aus Split, der nie kommt“.

**Nachts** auf Jasnas Couch, die zu kurz ist: Schlüsseldialog 1 (8.1).

#### Tag 1 „Christtag“ (Sonntag, 25. Dezember)

Am Vormittag gibt es drei Spuren, frei in der Reihenfolge.

- **Jasna im Heim.** Jasna hat Frühdienst und ihr Brot vergessen. Marko bringt es ins Haus am Bavariapark.
  - Markos Kopf pocht im Flur vor dem Aufzug. Mala findet Gerda (Fall B).
  - Wenn Marko bis drei bleibt oder wiederkommt, sieht er Alois am Aufzug warten. Eine Pflegerin sagt: „Ihre Gerda kommt später, Herr Lechner.“
  - Jasna sieht Marko bei Alois sitzen: „Du redest mit ihm, als würde er antworten.“ „Er antwortet ja.“
- **Mala allein.** In der Wohnung pocht Markos Kopf weiter, wenn auch schwächer. Er sagt „nur müde“. Mala hält sich für die Ursache und geht.
  - Sie reist allein zum Hauptbahnhof. Das ist neu und ihr eigener Entschluss.
  - Am Gleis 11 trägt ein alter Mann Koffer, die keiner sieht (Fall A).
  - Mala kommt zurück und erzählt. Marko fährt mit ihr hin und spricht mit Sepp auf Italienisch.
- **Spaziergang mit Ana.** Rodeln an der Bavaria, die Kinder voraus. Ana zeigt auf dem Telefon ein Foto: Zoran mit dem roten Zastava, Ana auf der Motorhaube, 1990.
  - **Nach Zoras Regel** erinnern sich die Toten mit den Lebenden (`rooms/skloniste.js:63`). Mala bekommt ein Stück ihres Lebens zurück, das Erinnerungsbild „Die gelben Stiefel“: Ana mit sechs, weinend an der Haltestelle der Drei, weil sie samstags nicht mitdurfte. Lana hat ihr eine Straßenbahn gemalt.
  - Marko gibt es weiter: „Lana hat dir eine Straßenbahn gemalt. Damit du nicht weinst.“ Ana: „Die habe ich noch.“ Die Zeichnung liegt in ihrem Schuhkarton.
  - Ana erfährt, dass Lana tot ist, und sagt: „Ich habe sie geliebt. Mehr als dich, damals.“
  - Danach ist sie mit Marko weicher, aber nicht versöhnt: „Du hast für Nada gesucht. Für uns nie.“

**Am Abend und in der Nacht**
- **Džezva und Ruža:** Marko kocht in der Džezva. Jasna erzählt von Ruža und hält an der Lesart fest, die sie seit 1993 trägt: „Ruža hat geschrieben, er ist nicht zurückgekommen. Nicht, dass er tot ist. Ich kann lesen.“ (Notiz `z4_lesart`)
- **Die Kiste:** Nachts, als Mala allein ist, liest sie durch den Deckel der Kiste. Spielerhandlung als Mala, mit ihrem Zögern: „Das ist nicht meine Kiste. Aber das ist auch nicht ihre Wahrheit allein.“
  - **Die Rotkreuz-Nachricht vom Mai 1993:** „Zoran je otišao po vodu i nije se vratio. Marko je kod mene, zdrav je. Ne brini. Ruža.“ Dazu ihr Nachhall: Ruža will „poginuo“ schreiben, und eine Jungenstimme sagt „Ne. Napiši ‚nije se vratio‘. Molim te.“
  - **Der Suchantrag beim DRK** von 1994: „vermisst“.
  - **Der Passierschein von 1992** mit Jasnas Nachhall: Sie sieht am Busfenster zurück bis zur Kurve und fragt „Zorane, gdje je Marko?“. Zoran antwortet: „Fahrt. Wir kommen nach.“
- **Malas Entscheidung:** Sie sagt Marko nichts, aus ihrer Figur heraus und nicht wählbar: „Er hat gesagt: frag nicht. Ich frage nicht. Ich sage auch nichts. Noch nicht.“

#### Karte „Zweiter Feiertag“ (Montag, 26. Dezember)

„Schneeregen, Reste, Fernsehen. Mama schläft nach dem Nachtdienst. Ana schreibt nicht. Mala sitzt am Fenster und zählt nichts.“ Der Tag wird nicht gespielt.

#### Tag 2 „Dienstag“ (Dienstag, 27. Dezember)

- **Kolars Anruf um 9:10** (Wortlaut in 7.3):
  - **Fassung „Probe ja“:** Übereinstimmung mit Markos Probe und „einer Probe aus München, von 2004, Ana Vuković“. Kolar nennt die Angaben aus der NN-Akte: „Brauerei, April dreiundneunzig, ein Rechenschieber, eingeritzt Z. V.“ Dann fragt sie: „Wann haben Sie ihn zuletzt gesehen?“ Marko: „Am Neunzehnten. Am Vormittag.“ Kolar: „Sie waren dabei.“ Sie schreibt nur: „Familie kann Datum bestätigen.“
  - Als Fachfrau setzt sie hinzu: „In den Akten von dreiundneunzig steht oft ‚nije se vratio‘. Das schreiben Familien, die es wissen und nicht schreiben können.“ (Notiz `z4_kode`)
  - **Fassung „Probe nein“:** Kolar nennt denselben Kandidaten und Anas Probe von 2004. „Sie sagten in Mostar: heute nicht. Ist heute ein anderer Tag?“ Marko entscheidet sich ohne Auswahl, als Folge seines Weges: „Ja.“ Kolar schickt eine Probenkarte an das Generalkonsulat (11.5). Marko gibt dort am Mittwoch seine Probe ab.
- **Mittag mit Ana** in ihrer Praxis; sie ist Logopädin.
  - Marko spricht sie auf 2004 an, mit der Notiz `z4_ana2004` aus Kolars Anruf.
  - Ana gibt es zu, wütend und erleichtert zugleich: „Ich bringe Kindern Wörter bei. Bei uns zu Hause hat keiner eins.“
  - Sie will der Mutter erst nach Neujahr etwas sagen: „Nicht vor Silvester. Silvester hat sie schon genug.“ Marko stimmt zu. Das ist Schonung, aus Liebe.
  - Mala sagt ihre Meinung („Nada hat siebzehn Jahre gewartet, weil einer es gut gemeint hat.“), entscheidet aber nicht für Marko.
- **Fall A:**
  - Bahnhofsmission, Bar Sport, die Akte bei den Städtischen Friedhöfen, Malas Gang in den Bunker.
  - Ergebnis: Der Name steht fest, „Giuseppe Ruggiero“.
  - Dann die Bitte des Geistes: Marko soll den Januarbrief schreiben, „sto bene“.
  - Marko will helfen, Mala sagt nein (7.1).
- **Fall B:** um drei die erste Beobachtung (7.2).
- **Am Abend:**
  - Frau Wimmer hat einen Aushang gemacht: „Wer kannte diesen Mann?“, mit Foto. Marko bringt ihn mit, um Jasna zu fragen.
  - Jasna erkennt ihn: „Der hat 1992 unsere Tasche getragen. Am Bahnhof. Er wollte kein Geld. Er hat zwei Wörter von uns gekonnt: ‚Polako, gospođo.‘“
  - Zum ersten Mal erzählt sie von 1992: von der Ankunft, nicht von der Abfahrt (Notiz `z4_ankunft`).

#### Tag 3 „Mittwoch“ (Mittwoch, 28. Dezember)

- **Fall A, der Anruf in der Basilicata:** Rosa (24), dann Carmela (67). Carmela sagt: „Lo sapevo. Da trent'anni.“
  - 1979 war sie in München und sah ihren Bruder am Bahnhof Koffer tragen. Sie sagte nie etwas und schrieb zurück: „Sono fiera di te.“
  - Sie will, dass er nach Hause kommt, als Urne.
  - Sepp hört zu, denn Mala ist bei ihm am Gleis. Er ist erlöst und geht in die Zwischenwelt, auf den Bahnsteig von 1962: Marko trägt *seinen* Koffer in den Zug.
- **Fall B:** Versuch am zweiten Nachmittag, dann Malas schweres Gespräch mit Gerda (7.2).
- **Freiwillig: Davor und Lena** auf dem Balkon in Moosach.
  - Der Feigenzweig ist ertränkt. Marko ruft Jela in Mostar an: „Pusti ga. Zimi spava. Ne zalijevaj.“ Lena: „Also nichts tun?“ Marko: „Nichts tun. Bis August.“
  - Davor über seinen Vater: „Er hat dreißig Jahre ‚Bitte einsteigen‘ gehört und nie gesagt, dass er es hasst.“
  - Davor bietet an: „Wenn Sie was brauchen. Ich habe ein Auto. Und ich trinke nicht, Lena passt auf.“
- **Nur Fassung „Probe nein“:** Marko gibt im Generalkonsulat seine Probe ab. Mala: „Das war die Sekunde.“

#### Tag 4 „Donnerstag“ (Donnerstag, 29. Dezember)

- **Vormittag: Abschied für Giuseppe in der Bahnhofsmission.**
  - Statt der Bestattung von Amts wegen steht da seine Urne vor der Überführung.
  - Anwesend sind Frau Wimmer, Enzo, zwei Gäste der Bahnhofsmission, Marko und Mala, und Jasna, die mitkommen wollte.
  - Marko liest zweitausend Zeichen. Es ist sein erster Nachruf seit Ivka.
  - Jasna steht vor der Urne: „Ich war auf keiner Beerdigung seit 1992. Ich wusste nicht, für wen.“ Das ist der erste Riss.
- **Um drei: Gerdas letzter Besuch** (7.2).
  - Marko spricht mit Alois in Trambahnersprache: „Endstation, Herr Lechner. Feierabend. Die Gerda wartet am Depot, mit der Kanne.“ Alois: „Dann fahr i ei.“
  - In der Zwischenwelt am Depot steigt Gerda zum ersten Mal selbst in die Bahn. Ihre Kanne wird stofflich (Regel aus Kapitel 2, `rooms/kula.js:69`). Marko gibt sie Alois.
  - Jasna sieht es: „Wo kommt die her? Die hatte Frau Lechner immer dabei.“ „Ich habe sie gefunden.“ Dann: „Was hast du ihm gesagt?“ „Die Wahrheit. In seiner Sprache.“
- **Am Abend: Mala verrät sich.**
  - Beim Spülen sagt sie zu Marko: „Blau, mit roter Schrift. Wie die Kanister.“ Das Wort hat Marko nie gesagt. Er stellt sie zur Rede.
  - Streit (Wortwechsel in 5.3): „Du hast in meinem Leben gelesen wie in einem Ort.“ – „Du hast in meinem Tod gelesen.“
  - Mala geht. Markos Kopf tut weh, und diesmal ist kein anderer Geist in der Nähe.

#### Tag 5 „Freitag“ (Freitag, 30. Dezember)

- **Vormittag:** Marko sucht Mala. Am Gleis 11, im Heim und bei Ana findet er sie nicht.
- **Ana und Marko:** Ana erzählt, was sie als Kind von der Abfahrt weiß: „Ich weiß nur, dass Mama bis zur Kurve am Fenster stand. Und dass sie danach nie wieder am Fenster gesessen hat. Nie. In keinem Bus.“
- **Notizbuch:** Damit hat der Spieler alle Teile für den Schluss „Derselbe Satz, zwei Städte“ (7.3). Ohne diesen Schluss beginnt die Nacht nicht, denn das Tagesende verlangt ihn.
- **Nacht, Hackerbrücke:** Schlüsseldialog 2 (8.2). Marko erzählt Mala den 19. April, ungefragt. Dazu kommt das Erinnerungsbild „Der Neunzehnte April“. Mala gesteht ihr Schweigen. Die beiden vereinbaren, sich gegenseitig nichts mehr zu ersparen, auch beim Kopf.

#### Finale „Silvester“ (Samstag, 31. Dezember)

- **Mittag bei Jasna:** Marko will es am Abend sagen. Jasna merkt, dass etwas kommt, und weicht in Arbeit aus: Sie backt für Anas Fest.
- **Abend bei Ana:**
  - Kinder, Raclette, Bleigießen. Tobias deutet die Formen falsch.
  - Ab 23 Uhr knallt es draußen. Jasna wird blass.
  - Um 23:15 sind ihr Mantel und sie fort. Ana: „Sie geht jedes Jahr. Sonst arbeitet sie Silvester. Dieses Jahr hat sie getauscht, wegen dir.“
- **Die Suche** (räumliches Zusammenspiel, 7.3, Teil C):
  - Mala folgt dem Nachhall: Jasna zählt, wenn sie Angst hat, Sekunden zwischen Blitz und Knall, so wie man es 1992 tat. Das Zählen hängt an den Ecken.
  - Marko braucht einen Weg durch die Silvesterstadt: Nachttram, Fußweg, oder Davors Auto, falls er ihn angerufen hat. Davor: „Diesmal ist keiner zu spät.“
- **Haus am Bavariapark, kurz vor Mitternacht:**
  - Pfleger Kevin: „Ihre Mama ist bei Herrn Lechner. Wie jedes Jahr. Nur dass sie dieses Jahr frei hat.“
  - Zimmer 214, dunkel. Alois schläft mit der Kanne im Arm. Jasna sitzt am Fenster, draußen blitzt es. Marko setzt sich auf Gerdas Stuhl.
- **Das Gespräch:** Es wird gespielt, mit Notizen und Auswahl (Ablauf und Fehlwege in 7.3).
  - Marko fängt bei sich an: „Ich war dabei.“
  - Er übersetzt den Satz: „Baka wollte ‚poginuo‘ schreiben. Ich habe gesagt: ‚nije se vratio‘. In Sarajevo hieß das damals …“
  - Jasna sagt ihr Stück: „Ich bin ohne dich gefahren.“
  - Mala gibt Marko im richtigen Moment, was nur sie weiß: „Sag ihr das mit der Kurve.“ Marko: „Du hast aus dem Fenster gesehen. Bis zur Kurve.“ Jasna: „Woher …“ Marko: „Ich weiß es.“ Mehr erklärt er nicht. [I] Das ist die eine Wahrheit, die er nicht übersetzen kann. Jasna nimmt sie hin: „Du hast immer zu viel gewusst. Schon als Kind.“
  - Dann: „Sie haben ihn gefunden.“ Jasna: „Ich habe keine Probe gegeben.“ Marko: „Ana. 2004. Und ich.“ Jasna: „Hinter meinem Rücken.“ Marko: „Ja. Weil wir dich schonen wollten. Alle.“
  - Jasna sieht zu Alois: „Schonen. Ich bin Pflegerin, Marko. Man sagt ‚später‘ und hofft, dass sie es vergessen.“ Und weiter: „Er wartet nicht mehr seit Donnerstag. Seit der Kanne.“
  - Marko: „Weil er weiß, wo sie ist.“ Jasna: „Und wo ist Zoran?“ Marko: „In Sarajevo. Seit 2003 mit einer Nummer. Er wartet nicht. Wir haben gewartet.“
  - **Um Mitternacht:** Jasna: „Ich will ihn sehen. Ich fahre hin.“ Sie entscheidet das selbst.
- **00:40, Ana kommt,** mit Schnee im Haar.
  - Jasna: „Du hast 2004 Blut gegeben.“ Ana: „Ja. Du hast mir auch nichts gesagt. Keiner sagt hier was.“ Jasna: „Dann jetzt. Alle. Bis es hell wird.“
  - Zum Schluss Jasna zu Marko: „Du hast das Wasser nach Hause getragen?“ „Ja.“ „Dann bist du zurückgekommen.“

#### Epilog „Neujahr“ (Sonntag, 1. Januar 2012)

- **Frühstück in Jasnas Küche:**
  - Jasna gibt Marko die Pantoffeln: „Vierundvierzig. Du hast seine Größe.“ Sie passen. „Natürlich passen sie.“
  - Die Kiste steht offen auf dem Tisch, Ana liest die Rotkreuz-Nachricht.
- **Jasna ruft Nada an:** „Nada? Jasna. Vukovićka, sa sedmog.“ Pause. „Ich weiß. Keiner von uns hat je geschrieben. Ich rufe an.“ (Gegenstück zu `rooms/stan.js:15`) Die leere Vanilice-Dose füllt Jasna mit eigenen Plätzchen: „Bring sie ihr zurück. Voll.“
- **Vratnik:** „Das Dach in Vratnik. Achtzehn Jahre bezahlt, damit er reinkann, wenn er kommt.“ Marko: „Wir können im März drunter sitzen.“
- **„Die Stillen, Teil zwei: Zoran Vuković, 1951–1993“:** Marko schreibt zweitausend Zeichen und schickt sie an Vesna (Dokument, 9.2). Vesna per SMS: „Bekommen. Seite vierzehn. Elf Zeichen zu viel. Ich lasse sie drin.“
- **Marko und Mala allein:**
  - **Fassung c:** Mala löst ihr Versprechen vom Grab ein: „Ich habe gesagt, ich frage dich in München noch mal. Jetzt weißt du, was es kostet. Willst du das?“ Markos Antwort kennt jetzt den Kopf, Gerda und das Schweigen (8.2, Ende).
  - **Fassungen a und b:** Das Gespräch greift „Einfach so?“ oder „wenn es zu schwer wird“ auf.
  - **In allen Fassungen** sagt Mala: „Nach dem Begräbnis frage ich mich selbst noch einmal. Und dann sagst du mir ehrlich, was du willst. Nicht ‚nur müde‘.“
- **Nadas SMS:** „Ekshumacija desetog januara. Javit će nam se.“ Die Exhumierung ist am 10. Januar, sie melden sich.
- **Schluss:** Karte „Ende des vierten Kapitels“ / „Fortsetzung: Sarajevo“.

### 4.6 Die Fälle

**Kleiner Fall zum Auftakt: Hansi, der Fahrkartenverkäufer** [N]
- Johann „Hansi“ Kirchmaier verkaufte bis 1998 Fahrkarten für die Busse nach Jugoslawien, an einer Bude beim alten Busabfahrtsplatz am Hauptbahnhof (Lage 11.5).
- An einem Dezemberabend starb er in seiner Bude. Seine Ablösung kam am Morgen, zu spät.
- Er will „Kasse machen“, aber nur, wenn einer von hier ihn ablöst.
- **Funktion:**
  - eine kurze Erkenntnis ohne Zwischenwelt, dass manche einfach gehen;
  - Malas Abhängigkeit von Markos Übersetzung;
  - Markos Abhängigkeit von Münchnern;
  - Humor zum Auftakt.

**Fall A: „Sepp“ – Giuseppe Ruggiero, der Gepäckträger vom Gleis 11** [N] (Rätsel 7.1)
- **Wer er war:**
  - geboren 1939 in Pietrafonda Vecchia, einem erfundenen Dorf in der Basilicata, das nach einem Erdrutsch verlassen wurde;
  - am 14. März 1962 an Gleis 11 angekommen; in der Weiterleitungsstelle im Bunker wurde aus ihm „Josef Rugiero“;
  - Gepäckträger Nr. 17 bis 1986, danach Gelegenheitsarbeit, seit etwa 2003 ohne Wohnung;
  - in der Bahnhofsmission „der Sepp“, mit tadellosem Bairisch, „damit keiner fragt, woher ich bin“.
- **Die Briefe:** Neunundvierzig Jahre schrieb er jeden Monat an seine Schwester Carmela: „Cara Carmela, sto bene, il lavoro va bene.“ Ihre Antworten kamen an die Bahnhofsmission und liegen in seinem Koffer.
- **Sein Tod:** In der Nacht zum 16. Dezember 2011 erfror er in einem Hauseingang. Er hatte keine Papiere bei sich. Die Stadt ordnete eine Bestattung von Amts wegen für den 29. Dezember an. Angehörige fand sie unter „Josef Rugiero“ nicht.
- **Was ihn hält:** der Januarbrief. Er hat in neunundvierzig Jahren keinen Monat ausgelassen, und wenn keiner kommt, weiß Carmela Bescheid.
- **Der menschliche Konflikt:** eine Schonung zwischen Geschwistern, die beidseitig war. Carmela wusste es seit 1979.
- **Abschluss:**
  - Sein Name ist zurückgegeben, die Urne fährt nach Hause.
  - Marko trägt in der Zwischenwelt seinen Koffer, „Facchino!“.
  - Für Marko ist das die erste Probe, dass die Wahrheit nicht zerstören muss, wenn beide sie teilen.

**Fall B: Gerda Lechner, drei Uhr** [N] (Rätsel 7.2)
- **Wer sie war:**
  - Gerda (84) starb am 3. September 2011 zu Hause an einem Schlaganfall.
  - Ihr Mann Alois (89), früher Trambahnfahrer, lebt mit Demenz im Haus am Bavariapark.
  - Vier Jahre lang besuchte sie ihn jeden Tag um drei. Fünfunddreißig Jahre lang wartete sie abends mit einer Kanne Tee am Depot auf ihn.
- **Die Schonung im Heim:** Die Pflegedienstleitung hat entschieden, Alois ihren Tod nicht zu sagen: „Er vergisst es und trauert jeden Tag neu.“ Die Antwort lautet „Sie kommt später.“ Auch Jasna sagt das, jeden Tag.
- **Was sie hält:** Gerda kommt weiter jeden Tag um drei. Sie ist an die Verabredung gebunden, nicht an den Ort (Regel aus Kapitel 2, `rooms/kula.js:111`).
- **Der menschliche Konflikt:**
  - Gerda glaubt, sie beruhige ihn. Der Versuch zeigt, dass ihre Nähe ihn friert. Mit dem Aufzuggong und dem „später“ hält sie ihn im Warten.
  - Sie bleibt aus Liebe, und genau das schadet ihm.
- **Abschluss:** Gerda entscheidet selbst zu gehen, „Diesmal geh ich voraus“. Alois hält um drei die Kanne statt zu warten.
- **Für Mala** ist das die Begegnung mit einer Toten, die bleibt wie sie. Sie muss ihr etwas Hartes sagen und versteht dabei ihr eigenes Bleiben neu.

### 4.7 Wendungen und das tatsächliche Ende

1. **Erste Wendung, Prolog:** Die Mutter weicht aus, der Plan „Probe abholen“ scheitert am ersten Tag.
2. **Zweite Wendung, Tag 1:** Mala findet in der Kiste die Wahrheit über Marko und schweigt.
3. **Dritte Wendung, Tag 2:** Kolars Anruf. Die Wahrheit über den Vater kommt ohne die Mutter: durch Anas heimliche Probe und Markos eigene. Damit wird die Frage „Wie kommt die Probe?“ zur Frage „Wie kommt die Wahrheit bei ihr an?“.
4. **Vierte Wendung, Tag 3:** Carmela wusste es. Schonung kann gelingen, wenn beide wissen.
5. **Fünfte Wendung, Tag 4:** Gerdas Nähe schadet. Für Mala und für Jasnas „später“ ist das ein Spiegel. Am Abend fliegt Malas Schweigen auf, Marko erlebt das Geschontwerden.
6. **Höhepunkt, Silvesternacht:** Marko sagt die Wahrheit in der Sprache der Mutter. Die Mutter sagt ihre.

**Das tatsächliche Ende**
- Die Familie hat sich alles gesagt.
- Zoran ist identifiziert (Fassung „Probe ja“) oder steht kurz davor („Probe nein“).
- Jasna fährt im März zur Identifizierung und zum Begräbnis nach Sarajevo. Es ist ihre erste Rückkehr seit 1992.
- Marko hat den Tod seines Vaters zum ersten Mal ausgesprochen und aufgeschrieben.
- Mala weiß, was Bleiben kosten kann, und hat Marko eine ehrliche Antwort abverlangt. Entschieden hat sie noch nicht.

### 4.8 Was am Ende anders ist

| Vorher | Nachher |
|---|---|
| „Er ist nicht zurückgekommen.“ | „Er ist gestorben. Ich war dabei.“ Und: „Dann bist du zurückgekommen.“ |
| Jasna wartet, die Pantoffeln stehen an der Tür. | Jasna fährt nach Sarajevo. Die Pantoffeln trägt Marko. |
| Ana weiß fast nichts und handelt heimlich. | Ana weiß alles. Ihre Probe von 2004 ist kein Geheimnis mehr. |
| Die Mütter aus dem siebten und dem neunten Stock schweigen. | Jasna ruft Nada an, die Dose geht voll zurück. |
| Mala weiß nicht, ob sie Marko wehtut. | Sie weiß es: Ungefundene Geister tun ihm weh, sie selbst manchmal auch. Beide sagen es jetzt. |
| Malas „Ich frage nicht“ | Marko erzählt, ohne gefragt zu sein. |
| Vesnas leere Seite | „Die Stillen, Teil zwei: Zoran Vuković“ |

---

## 5. Figuren und Beziehungen

### 5.1 Marko

| | |
|---|---|
| **Ziel** | Die zweite Probe für den Vater klären und mit der Mutter reden, ohne sagen zu müssen, was er gesehen hat. |
| **Ausgangshaltung** | Seit Mostar weiß er: „Die Wahrheit gehört dem, den sie betrifft.“ Er wendet das auf andere an. Für sich selbst behält er seinen Satz: „Das ist meins.“ |
| **Grenze** | Die Wahrheit über Zorans Tod gehört auch Jasna und Ana. Sein Satz hat die Mutter achtzehn Jahre in Hoffnung gehalten. Sein Grundsatz stößt mit seinem Schutzinstinkt und seiner Angst zusammen: „Warum hast du es mir nie gesagt?“ |
| **Handlung** | Er entscheidet sich gegen Anas „nach Neujahr“ und für die Silvesternacht. Er fängt bei sich an, übersetzt den Satz in die Sprache der Mutter und entscheidet nicht für sie. Ob sie nach Sarajevo fährt, fragt er. |
| **Folge** | Die Familie kann gemeinsam trauern, und Jasna fährt nach Sarajevo. Marko schreibt den Tod auf. Er hat erlebt, wie Schonen sich von innen anfühlt. Das braucht er im Finale, wenn er Mala ehrlich antworten muss. |

**Die Entwicklung, an Handlungen gezeigt**

| Moment | Was der Spieler tut oder erlebt | Was sich in Marko verschiebt |
|---|---|---|
| Hansi (Prolog) | Er löst einen Fall mit Routine und stößt an eine Grenze: Seine Sprache reicht nicht, er braucht Wastl. | Übersetzen heißt manchmal, einen anderen sprechen zu lassen. |
| Sepps Januarbrief (Tag 2) | Er will die Lüge schreiben, das ist Hilfe als Erfüllung. Mala sagt nein. Weil er für den Brief Name und Adresse braucht, beginnt die Ermittlung. | Er fragt nicht mehr, wie er helfen kann, sondern welche Hilfe gerechtfertigt ist. |
| Carmela (Tag 3) | Am Telefon findet er Worte, die weder lügen noch zerschlagen. | Die Wahrheit kann trösten, wenn sie in der Sprache des anderen kommt. |
| Alois (Tag 4) | „Endstation. Feierabend.“ in Trambahnersprache, vor den Augen der Mutter | Er hat der Mutter vorgemacht, was er ihr noch sagen muss. |
| Malas Schweigen (Tag 4, Abend) | Er merkt, dass sie es seit fünf Tagen weiß. Wütend sagt er den Satz, der auch ihn trifft. | Er weiß jetzt, wie Jasna sich fühlen wird. |
| Hackerbrücke (Tag 5) | Er erzählt ungefragt, und das Erinnerungsbild kommt. | Zum ersten Mal sagt er „gestorben“, nicht „nicht zurückgekommen“. |
| Silvesternacht | Er führt das Gespräch mit Auswahl und Notizen. | Er entscheidet nicht mehr für die anderen, was sie wissen dürfen. |

**Was er am Ende noch nicht ist:**
- Er war noch nicht an der Brauerei und noch nicht am Grab.
- Er hat Mala noch nicht gehen lassen müssen.
- Er weiß nicht, wohin er gehört.

Das gehört ins Finale.

### 5.2 Mala

**Ihr eigenes Anliegen**
- **Ana.** Lana kannte Markos Familie, den siebten Stock, die kleine Ana mit den gelben Stiefeln.
  - In München will sie die erwachsene Ana sehen und von ihr erinnert werden. Nach Zoras Regel kommt dadurch auch ein Stück ihres eigenen Lebens zurück.
  - Sie sieht an Ana, was ein Leben ist, das weiterging: Arbeit, Kinder, Wut, Plätzchen. [N, aus Regel B]
- **Gesehen werden.** Niko sieht sie.
- **Verstehen, was ihr Bleiben ist.** Seit Mostar könnte sie gehen und bleibt doch. Gerda zeigt ihr, wie Bleiben aussehen kann.
- **Sehnsucht nach der Mutter.** Weihnachten verbringt sie in München statt bei Nada. Das ist ihr Opfer, nicht Markos Entscheidung: „Mama feiert nicht. Sie lüftet das Zimmer. Ich wäre gern da. Ich bin hier.“

**Was das für die Zusammenarbeit bedeutet**
- Sie geht allein, findet allein und kommt zurück.
- Das Spiel bekommt Abschnitte, in denen der Spieler als Mala allein durch die Stadt reist (Tag 1, Tag 4 Abend, Silvester).
- Marko kann nicht mitkommen und nicht mithören.

**Was Marko ihr nicht abnehmen darf**
- ob sie in Jasnas Kiste liest; das ist ihre Grenzüberschreitung, und sie trägt sie;
- ob sie Gerda die harte Wahrheit sagt;
- ob sie nach dem Begräbnis bleibt.

**Wo sie ihr erstes Urteil überprüfen muss**
- **Erstes Urteil:** „Ich tue dir weh.“ Sie hält sich für die Ursache der Kopfschmerzen und geht.
- **Was sich zeigt:**
  - Wo sie allein hingeht, findet sie die Ursachen: Sepp am Gleis 11, Gerda am Aufzug. Ungefundene Geister lösen den Kopfschmerz aus, wie es die Mechanik aus Kapitel 1 sagt.
  - Am Abend des Streits ist aber kein anderer Geist da, und Markos Kopf tut trotzdem weh.
- **Ihr neues Urteil:** „Am Bahnhof war es Sepp. Im Heim war es Gerda. Da habe ich mich geirrt. Aber gestern war keiner da außer mir.“
- **Das ist keine Entlastung und keine Verurteilung.** Der Preis ist kleiner, als sie fürchtete, und größer als null. Diese Genauigkeit braucht das Finale.

**Ihre eigenen, entscheidenden Handlungen**
1. Sie geht allein und findet beide Fälle (Tag 1). Ohne ihren Entschluss hätte das Kapitel keine Fälle.
2. Sie liest die Kiste (Tag 1, Nacht). Ohne sie hätte Marko im Finale die Kurve nicht.
3. Sie sagt Nein zum falschen Brief: „Ich war die, die ‚Sagt es keinem‘ gesagt hat. Ich weiß, was das kostet. Ich helfe nicht bei noch einem.“ Damit urteilt sie über ihre eigene Bitte von 1994.
4. Sie sagt Gerda, dass sie gehen muss. Das ist ein anderer Umgang mit einer Toten als bisher: nicht „Ich kann Sie hinüberbringen“, sondern „Sie müssen gehen. Für ihn.“
5. Sie findet Jasna in der Silvesternacht und gibt Marko im richtigen Moment die Kurve.
6. Sie hält ihr Versprechen vom Grab (Fassung c) und verlangt eine ehrliche Antwort.

**Grenzen, die bleiben**
- Sie verschweigt nichts Hilfreiches ohne Grund. Ihr Schweigen an den Tagen 1 bis 4 hat einen Grund: ihr Versprechen. Das Spiel macht es zum Thema, nicht zum Trick.
- Neue Kräfte bekommt sie nicht. Neu ist nur, dass sie allein durch Ausgänge geht, und das folgt aus Kapitel 3.

### 5.3 Die Beziehung

**Der Konflikt: Privatsphäre gegen Wahrheit, und Schonung unter ihnen selbst**
- Mala weiß etwas über Marko, das er ihr nie gesagt hat. Sie weiß es nicht durch Fragen, sondern durch ihre Wahrnehmung.
- Sie hat versprochen, nicht zu fragen. Aus diesem Versprechen wird ein Schweigen, und das Schweigen ist Schonung.
- **Beide haben recht und unrecht:**
  - Er hat ihre Grenze in Mostar einmal überschritten, sie seine jetzt.
  - Sie hat ihn geschont, wie er seine Mutter.
- **Der Streit am Donnerstagabend, gekürzt:**
  - Marko: „Du hast in meinem Leben gelesen wie in einem Ort.“
  - Mala: „Du hast in meinem Tod gelesen. Siebzehn Jahre wolltest du nichts wissen, und dann hast du alles gelesen. Den Fluss, das Seil, das Schilf.“
  - Marko: „Du hast es fünf Tage gewusst.“
  - Mala: „Und du achtzehn Jahre.“
  - Marko: „Das ist etwas anderes.“
  - Mala: „Ja. Bei mir waren es nur fünf Tage.“

  Sie geht, und Markos Kopf tut weh.

**Kleine Dinge, die zeigen, was sie verbindet**
- Samstag um 11:10 das Klopfen, zweimal kurz und einmal lang. Marko hat es nie gehört, jetzt hört er es.
- „Wenn du rechnest, denkst du auf Deutsch.“ (`97_k3_mala.js:38`)
- Sie zählt Lichter, Fenster, Züge. Er zählt Zeichen.
- Die Džezva, die er für sie mitkocht, obwohl sie nichts trinkt: „Für den Geruch.“
- Humor, der in Split nicht möglich war. Mala: „Ich kann mich überall hinlegen. Das ist das einzig Gute daran.“ Marko: „Du warst damals kürzer.“
- Sie sitzt auf Geländern über Abgründen, und er sagt jedes Mal etwas dazu.

**Wo die Rätsel vom gewachsenen Verständnis leben**
- Rätsel 7.3 setzt voraus, dass Mala in Markos Kindheit liest und er ihr am Ende ungefragt den Rest gibt. Das geht nur zwischen zwei Menschen, die einander kennen.
- Wo Zusammenarbeit nicht Zustimmung ist (7.1): Beim falschen Brief deutet Marko Sepps Wunsch als Auftrag, Mala als Falle. Erst die Ermittlung zeigt, dass beide halb recht hatten.

**Die Veränderung**
- Sie wird nicht erklärt, sie wird vereinbart, in Schlüsseldialog 2.
- Sie ersparen sich nichts mehr: nicht den Kopf, nicht das Wissen, nicht die Entscheidung nach dem Begräbnis.
- Es gibt keine Vertrauensanzeige und keine Romanze.

### 5.4 Lebende Nebenfiguren

| Figur | Eigenes Ziel | Warum sie teilt oder zurückhält | Was sie im Lauf tut |
|---|---|---|---|
| **Jasna Vuković** (58, Pflegehelferin) | den Alltag halten; nicht wissen müssen, wie | Schuld wegen 1992, Hoffnung seit 1993, Angst vor der Gewissheit | Weicht aus, erkennt Sepp, geht zu seinem Abschied, sieht Alois mit der Kanne. In der Silvesternacht sagt sie ihr Stück und entscheidet, nach Sarajevo zu fahren. |
| **Ana Brandl, geb. Vuković** (27, Logopädin) | ihren Vater kennen; die Mutter schützen | hat aus Liebe heimlich gehandelt, ist wütend auf Marko | Schickt die SMS, sagt „Wir müssen reden“, gesteht 2004 und will bis nach Neujahr warten. Kommt um 00:40. Bekommt Lana zurück, als Erinnerung und als Zeichnung. |
| **Tobias Brandl** (Lehrer) | dazugehören | – | Übt Bosnisch, falsch und rührend. Fährt Silvester die Kinder heim. |
| **Mia (7), Niko (3)** | Kinder sein | – | Niko sieht Mala, Mia nicht. Niko winkt Mala an der Tür zu. |
| **Frau Huber** (81, Nachbarin) | Gesellschaft | redet gern | Schlüssel, Gerede über Jasnas Silvester und die Pantoffeln. Ihre Katze sieht Mala. |
| **Frau Wimmer** (66, Bahnhofsmission) | Sepp anständig verabschieden | Datenschutz, Misstrauen gegen Fremde | Bittet Marko um eine Übersetzung, öffnet Sepps Koffer, organisiert den Abschied. |
| **Signor Enzo** (78, Bar Sport) | dass einer sich an Peppino erinnert | Scham für den Freund | Erzählt von 1962 und von der Tarnung durch Bairisch. Kommt zum Abschied. |
| **Herr Obermaier** (Städtische Friedhöfe) | Vorschriften und Termine | Amtsgeheimnis | Akte „unbekannt / Josef Rugiero“, Termin Donnerstag. Sagt mit dem richtigen Namen ab. |
| **Carmela Ruggiero** (67) und **Rosa** (24), am Telefon | den Bruder heimholen | hat selbst geschont | „Lo sapevo.“ Will die Urne. |
| **Frau Ertl** (Pflegedienstleitung) | Ruhe im Haus, Schutz der Bewohner | fachliche Haltung zur Schonung | Ordnet das „später“ an. Nach dem Versuch erlaubt sie einen Versuch mit der Wahrheit. |
| **Pfleger Kevin, Hausmeister Kraus** | ihre Arbeit | – | Kraus stellt den Gong ab, „aber nicht lang, Brandschutz“. Kevin lässt Marko in der Silvesternacht hinein. |
| **Davor, Lena** (freiwillig) | Davor weiß nicht, was er mit dem Haus will; Lena möchte, dass der Zweig wächst | – | Feigenzweig, Anruf bei Jela, Fahrt in der Silvesternacht |
| **Frau Kolar** (Telefon) | „Wir zählen.“ | Fachliche Diskretion: Sie lässt Marko nicht antworten. | Anruf mit der Übereinstimmung und der Erklärung von „nije se vratio“ |
| **Nada** (Telefon und SMS) | Lanas Heimkehr | – | Vanilice, der Neujahrsanruf, der Termin der Exhumierung |

### 5.5 Geister

| Geist | Erscheinung | Was ihn hält | Erkennen, Wollen, Gehen | Besonderheit |
|---|---|---|---|---|
| **Hansi** | grauer Kittel, Wechselgeldtasche, Bleistift hinter dem Ohr | die Ablösung | Er weiß, dass er tot ist („Do bin i umgfalln“). Er will Feierabend und geht allein. | Keine Zwischenwelt. Bairisch. |
| **Sepp / Peppino** | Gepäckträgermütze Nr. 17, blank gewetzte Uniformjacke, sehr gerader Rücken | der Januarbrief | Er weiß, dass er tot ist. Er will, dass die Lüge weitergeht. Er geht, als er hört, dass sie nie nötig war. | Spricht Italienisch, Bairisch und kaum Hochdeutsch. Seinen Namen hat er „hier verloren“. |
| **Gerda** | Wintermantel, Kopftuch gegen den Wind, Thermoskanne | die Verabredung um drei | Sie weiß es und will bleiben. Sie geht, als sie sieht, dass sie ihn festhält. | Bleibt aus Liebe. Am Ende ist die Kanne stofflich. |
| **Zoran** | – | – | Kein Geist. | Mala findet ihn nicht, und das ist die Antwort. |

### 5.6 Rückbezüge mit Funktion

| Aus | Rückbezug in Kapitel 4 | Funktion |
|---|---|---|
| Kapitel 1: „Die Stillen“ (`rooms/flat.js:199`) | Nachrufe für Sepp und für Zoran | Markos Beruf wird Teil der Handlung. Der offene Faden „Teil zwei“ (Kapitel 2, 3) schließt sich. |
| Kapitel 1: „Sie wartet auf einen Satz“ (`rooms/riva.js:219`) | Mala über Jasna: „Sie wartet nicht auf ihn. Sie wartet auf einen Satz. Wie Ivka.“ | Das Kernthema des Kapitels in einer alten Regel |
| Kapitel 1: „Manchmal ein Kind, das zu lange hinsieht“ (`rooms/flat.js:312`) | Niko | Mala wird gesehen, Jasna wird still. |
| Kapitel 1: Džezva und Ružas Satz (`rooms/flat.js:158–160`), Kapitel 3: Rückgabe (`rooms/ostbus.js:112`) | Kaffee bei Jasna | Öffnet Jasnas Erinnerung an Ruža und führt zur Kiste. |
| Kapitel 2: Samstag 11:10, zweimal kurz, einmal lang (`97_k2_mala.js:110`) | Malas Klopfen; Jasna kennt es noch. | Zärtlichkeit; bereitet Kapitel 5 vor (der 3. März 2012 ist ein Samstag). |
| Kapitel 2: Hausbuch „Jasna“ (`rooms/haustor.js:27`) | Jasnas Name | Kontinuität |
| Kapitel 2: Dragica und der rote Zastava (`97_k2_talk.js:77`) | Foto in Jasnas Flur; Marko stand für Dragica an | Der Vater wird konkret. |
| Kapitel 2: „Wir Toten erinnern uns mit den Lebenden“ (`rooms/skloniste.js:63`) | Anas Erinnerungen geben Mala Stücke zurück. | Malas eigenes Anliegen |
| Kapitel 2: „Wer losgelassen hat, kann etwas hergeben“ (`rooms/kula.js:69`) | Gerdas Kanne wird stofflich. | Lösung von Fall B |
| Kapitel 2: „an die Verabredung gebunden“ (`rooms/kula.js:111`) | Gerda um drei | Regel statt Erfindung |
| Kapitel 2: Nada „Keiner von euch hat je geschrieben“ (`rooms/stan.js:15`) | Jasnas Neujahrsanruf | Bereitet Kapitel 5 vor. |
| Kapitel 3: „Woher?“ (`rooms/herberge.js:121`) | Hackerbrücke, Silvesternacht | wird beantwortet |
| Kapitel 3: „Frag mich in München noch mal“ (`rooms/skela_l.js:288`) | Epilog, Fassung c | wird eingelöst |
| Kapitel 3: Davors Karte, Lenas Zweig (`rooms/zelenika.js:176–177`) | Balkon, Fahrt in der Silvesternacht | kleine Fortsetzung mit eigener Bedeutung: „Diesmal ist keiner zu spät.“ |
| Kapitel 3: „Mama soll alles wissen“ (`rooms/skela_l.js:280`) | Malas Einwand und Markos Grenze | Der Kernkonflikt |
| Kapitel 3: Kolar „Wir zählen“ | Anruf am 27.12. | Fachliche Wahrheit, keine Erlösung von außen. Den Rest muss die Familie tun. |

---

## 6. Spielbare Struktur

### 6.1 Phasen und Tagesbedingungen [N]

Wie in Kapitel 3 endet ein Abschnitt nur, wenn die Pflichtschritte erledigt sind. Das Bett verweigert sich sonst mit einem Satz, der sagt, *was* fehlt, aber nicht *wo*.

| Phase | Tag | Pflicht für den Wechsel | Wechsel |
|---|---|---|---|
| `k4_pro` | Sa 24.12., Heiligabend | Hansi gelöst; Jasna zurück und Gespräch abgewiesen; Heiligabend bei Ana; Schlüsseldialog 1 | Schlaf → Karte „Christtag“ |
| `k4_d1` | So 25.12. | Sepp gefunden und gesprochen (`s4_peppino`); Gerda gefunden (`g4_gerda`); Spaziergang mit Ana (`z4_stiefel`); Jasnas Lesart (`z4_lesart`); Mala hat die Kiste gelesen (`z4_nachricht`, `z4_passierschein`) | Karte „Zweiter Feiertag“ → Di 27.12. |
| `k4_d2` | Di 27.12. | Kolars Anruf (`z4_kolar`, `z4_kode`); Ana gesteht 2004 (`z4_ana2004`); Name gesichert (`s4_name`); erste Beobachtung um drei (`g4_drei`); Jasnas Ankunft 1992 (`z4_ankunft`) | Schlaf |
| `k4_d3` | Mi 28.12. | Anruf bei Carmela und Sepps Übergang (`s4_heim`); Versuch und Gespräch Mala/Gerda (`g4_entschluss`); in Fassung „Probe nein“ Markos Probe (`z4_probe2`) | Schlaf |
| `k4_d4` | Do 29.12. | Sepps Abschied mit Jasna (`z4_riss`); Gerdas letzter Nachmittag (`g4_kanne`); Malas Schweigen aufgeflogen (`r4_streit`) | Schlaf (Mala fort) |
| `k4_d5` | Fr 30.12. | Gespräch mit Ana (`z4_kurve_ana`); Schluss „Derselbe Satz, zwei Städte“ (`z4_zweistaedte`); Schlüsseldialog 2 (`r4_bruecke`) | Karte „Silvester“ |
| `k4_fin` | Sa 31.12. | Suche, Gespräch, Ana kommt | Abblende → „Neujahr“ |
| `k4_epi` | So 1.1.2012 | Pantoffeln, Anruf bei Nada, Nachruf, Gespräch mit Mala (Fassung c: die Frage) | Karte „Ende des vierten Kapitels · Fortsetzung: Sarajevo“ |

### 6.2 Die ersten 15 bis 20 Minuten

Die Minutenangaben sind Planungswerte für Erstspieler, keine Messung.

| Min. | Szene | Was der Spieler tut | Was sich erschließt | Was er selbst verstehen muss | Was danach möglich wird |
|---|---|---|---|---|---|
| 0–1 | Karte „Kapitel 4 · München · Prolog – Heiligabend · Samstag, 24. Dezember 2011 · Morgen“, Erinnerungsbild „Im Bus nach München“ | liest (eine Tippbewegung pro Satz) | Zehn Stunden Fahrt, Schnee ab Salzburg, Mala zählt Lichter. Übernahmen siehe unten. Nadas Dose: „von Nada, vom Neunten“. | – | – |
| 1–2 | ZOB, Bussteig | Telefon: Anas SMS lesen | Mama arbeitet bis 14 Uhr, Schlüssel bei Frau Huber. Ana kommt nicht. | Ana ist kurz angebunden. Das ist Familie. | Stadtplan mit Westend |
| 2–3 | ZOB | Der Kopfschmerz pocht. Wechsel zu Mala, umsehen. | Ein Geist am Pfeiler | Die Mechanik aus Kapitel 1 gilt weiter. | Hansi |
| 3–7 | Hansi | Mala hört zu, versteht Bruchstücke. Marko redet mit ihm. Zwei falsche Versuche: „Feierabend, Herr Kirchmaier.“ ergibt „Sie san ned vo do.“; „Ihre Schicht ist vorbei.“ ergibt „Des sagt mei Chef ned so.“ | Er will eine Ablösung, und zwar eine von hier. | Nicht der Satz fehlt, sondern die richtige Stimme. | Wastl am Taxistand ansprechen. Er kannte Hansi („Der hat uns allen die Karten verkauft, wenn ma im Sommer runter san.“). |
| 7–8 | Wastl | Marko bittet ihn, einen Satz zu einem Pfeiler zu sagen. Wastl lacht und tut es. | „Na also. Servus, Burschi.“ Hansi geht. | Es gibt einen ersten Erfolg, und Mala braucht in München Markos Übersetzung. | Hackerbrücke, Westend |
| 8–9 | Hackerbrücke | gehen oder per Doppelklick abkürzen | Mala: „Eine Brücke über Züge. Er hätte sie gemocht.“ | Der Vater ist im Raum, ohne dass einer ihn nennt. | – |
| 9–10 | Frau Huber, Treppenhaus | reden, Schlüssel bekommen; die Katze sieht Mala | Jasna arbeitet jedes Silvester. Die Pantoffeln stehen „seit sie eingezogen ist“. | – | Wohnung |
| 10–14 | Jasnas Wohnung | ansehen: Pantoffeln, Foto mit dem Zastava, Mappe „Vratnik – krov“, Schrank mit Kiste. Mala: nach einem Geist suchen | „Hier ist keiner. Nur sie.“ Die Kiste ist verschlossen. Marko: „Nicht ihre Kiste.“ | Jasna wartet. Was in der Kiste ist, geht ihn nichts an, noch nicht. | – |
| um 11:10 im Spiel | Flur | (läuft von selbst, wenn beide in der Wohnung sind) | Malas Klopfen: „Samstag.“ | – | – |
| 14–15 | Küche | Džezva benutzen, Kaffee kochen | „Kaffee kocht man nicht. Man wartet auf ihn.“ | – | Jasna kommt. |
| 15–18 | Jasna kommt | reden; Nadas Dose geben; „Ich habe Lana gefunden“; Notiz zur Probe ansprechen | Jasna kennt Lanas Klopfen. Zur Probe: „Nicht heute. Heute ist Heiligabend.“ | Der Plan scheitert nicht am Nein, sondern am Ausweichen. | Heiligabend bei Ana (Pflicht) |

**Was die beiden inzwischen können, und das neue Problem:** Hansi zeigt das Können. Jasna zeigt das Problem: ein Gespräch, das sich nicht erzwingen lässt, und eine Familie, die Sprachen spricht, die Marko nie übersetzt hat.

**Übernahmen im Erinnerungsbild**
- **Zustimmung a:** „Am Grab habe ich ‚Ja‘ gesagt. ‚Einfach so?‘, hat sie gefragt. Seitdem frage ich mich, ob es einfach war.“
- **Zustimmung b:** „‚Wenn es zu schwer wird, sagen wir es.‘ Bisher hat keiner etwas gesagt.“
- **Zustimmung c:** „‚Frag mich in München noch mal.‘ Ab Salzburg sieht sie mich an, als wäre München ein Datum.“
- **Probe ja:** „In der Jackentasche die Quittung aus Mostar: vier Kreise, oben mein Name, darunter seiner.“
- **Probe nein:** „In der Jackentasche nichts aus Mostar. ‚Heute nicht‘, habe ich gesagt. Zweimal.“
- **Ohne Spielstand aus Kapitel 3:** b und ja, wie der Musterweg in Kapitel 3.

### 6.3 Rätselketten im Überblick

| Kette | Art | Wer trägt | Hängt ab von | Ergebnis |
|---|---|---|---|---|
| **H** Hansi | Gespräch, Stimme eines Dritten | Mala findet, Marko redet, Wastl spricht | – | Auftakt |
| **W** Jasnas Wohnung | Beobachtung | beide | – | Notizen zu Warten, Dach und Kiste |
| **A1** Peppino finden und verstehen | Übersetzung, Widerspruch | Mala findet und hört, Marko spricht Italienisch | Tag 1 | `s4_peppino` |
| **A2** Name | Widersprüchliche Aussagen, Archiv, Nachhall (7.1) | Marko bei den Lebenden, Mala im Bunker | A1 | `s4_name` |
| **A3** Der Januarbrief | Moralische Entscheidung, Ermittlung | Marko schreibt beinahe, Mala sagt nein | A2 | Briefe lesen |
| **A4** Carmela | Brief deuten, Nachhall, Telefonat | Mala spürt, Marko deutet und ruft an | A3 | `s4_heim`, Übergang |
| **B1** Gerda finden | Kopfschmerz, Suche | Mala | Tag 1 | `g4_gerda` |
| **B2** Drei Uhr | Räumliches Zusammenspiel, Versuch (7.2) | Marko bei den Lebenden, Mala bei Gerda | B1 | `g4_beides` |
| **B3** Gerdas Entschluss, Alois' Feierabend | Gespräch unter Toten, Wahrheit in Trambahnersprache | Mala zuerst, dann Marko | B2 | `g4_kanne` |
| **F1** Die Kiste | Nachhall durch den Deckel | nur Mala | Tag 1, Nacht | Nachricht, Antrag, Passierschein |
| **F2** Der Satz | Rekonstruktion (7.3, Teile A und B) | Mala, Kolar, Jasna, Ana, Marko | F1, Kolars Anruf | `z4_zweistaedte` |
| **F3** Silvester | Spur, Weg, Gespräch (7.3, Teil C) | Mala sucht, Marko spricht | F2, R | Höhepunkt |
| **R** Beziehung | Schweigen, Streit, Hackerbrücke | beide | F1, A4, B3 | `r4_bruecke` |
| **D** Davor und Lena (freiwillig) | Telefon nach Mostar | Marko | Tag 3 | Abkürzung in der Silvesternacht |

### 6.4 Abhängigkeiten

```
Prolog (fester Ablauf: H → W → Jasna → Heiligabend → Dialog 1)
   │
Tag 1 ── parallel ─┬─ A1 Peppino (Mala allein → Marko am Gleis 11)
                   ├─ B1 Gerda (Heim, Brot bringen)
                   ├─ Spaziergang mit Ana (Erinnerung „gelbe Stiefel“)
                   └─ Abend: Džezva → Jasnas Lesart
                      Nacht: F1 Kiste (Mala)
   │
Tag 2 ── Kolars Anruf (fest, morgens) ─→ Ana gesteht 2004
       └ parallel ─┬─ A2 Name (Bahnhofsmission ↔ Bar Sport ↔ Friedhöfe ↔ Bunker, beliebige Reihenfolge)
                   │      └→ A3 Brief (Entscheidung) → Briefe gelesen
                   └─ B2 Beobachtung um drei
       Abend: Aushang → Jasna erkennt Sepp (braucht A2)
   │
Tag 3 ── parallel ─┬─ A4 Carmela → Sepps Übergang
                   ├─ B2 Versuch → B3 Mala spricht mit Gerda
                   └─ D (freiwillig)
   │
Tag 4 ── Vormittag: Abschied für Sepp (braucht A4) → Jasnas Riss
       └ 15 Uhr: Gerdas letzter Besuch (braucht B3) → Kanne
       Abend: Malas Verrat (braucht F1 und Kolars Anruf) → Streit
   │
Tag 5 ── Ana: „bis zur Kurve“ → Schluss F2 (braucht F1, Kolar, Lesart) → Dialog 2
   │
Silvester ── F3: Spur → Weg → Gespräch → Ana
   │
Neujahr
```

**Wo die Stränge zusammenlaufen**
- **Sepps Abschied (A)** bringt Jasna zum ersten Mal zum Reden.
- **Gerdas Kanne (B)** zeigt ihr, was die Wahrheit in der richtigen Sprache kann.
- **Malas Schweigen (F1)** und Carmelas „Lo sapevo“ (A4) bereiten Marko vor.
- **Die Silvesternacht** findet im Haus von Fall B statt, mit dem Satz aus F2.

### 6.5 Das Notizbuch: Beobachtung, Annahme, gesicherte Erkenntnis

Annahmen stehen mit „(?)“ im Titel. Eine gesicherte Erkenntnis ersetzt sie, sobald die Grundlage da ist. Für die Engine ist das nur das Austauschen einer Notiz.

| Schluss | aus | Stufe | Wann möglich |
|---|---|---|---|
| `s4_tarnung` „Er konnte beides“ | `s4_bairisch` (Kiosk: „Urmünchner“) + `s4_fluch` (Frau Wimmer: „italienisch geflucht“) | Widerspruch aufgelöst | Tag 2 |
| `s4_derselbe?` „Peppino ist der Sepp (?)“ | `s4_peppino` (Mütze 17) + `s4_ausweis` (Gepäckträgerausweis Nr. 17, „Josef Rugiero“) | Annahme | Tag 2 |
| `s4_name` „Josef Rugiero ist Giuseppe Ruggiero“ | `s4_derselbe?` + `s4_bunker` (Nachhall der Weiterleitungsstelle) **oder** + `s4_umschlag` (Briefe an „Giuseppe Ruggiero“, Absender Pietrafonda) | gesichert | Tag 2 |
| `s4_wusste?` „Carmela ahnt etwas (?)“ | `s4_brief79` (1979: „Ti ho visto con le valigie.“) | Annahme | Tag 2/3 |
| `s4_wusste` „Carmela wusste es seit 1979“ | `s4_wusste?` + `s4_nachhall_carmela` (Mala spürt am Brief von 1979: eine Frau, die beim Schreiben weint und „Anche io sto bene“ schreibt) | gesichert | Tag 3 |
| `g4_ursache?` „Der Gong? Gerda? das ‚später‘? (?)“ | `g4_drei` + `g4_gong` + `g4_kalt` + `g4_spaeter` | Annahme (vier mögliche Ursachen) | Tag 2 |
| `g4_beides` „Er wartet auf den Gong und friert, wenn sie bei ihm ist.“ | Versuch 1 + Versuch 2 (7.2) | gesichert | Tag 3 |
| `z4_lesart` → `z4_vermisst` „Mama hat ‚nicht zurückgekommen‘ als ‚vermisst‘ gelesen“ | `z4_lesart` (Jasna) + `z4_antrag` (Suchantrag 1994) | gesichert | Tag 1/2 |
| `z4_kode` → `z4_tot` „In Sarajevo hieß es: tot“ | `z4_nachricht` (Ruža und die Jungenstimme) + `z4_kode` (Kolar) | gesichert | Tag 2 |
| `z4_zweistaedte` „Derselbe Satz, zwei Städte“ | `z4_vermisst` + `z4_tot` | gesichert, Schlüssel für das Finale | Tag 2–5 |
| `z4_dabei` „Ich war dabei“ | `z4_kolar` (Datum) + Erinnerungsbild „Der Neunzehnte April“ | gesichert, Markos eigene Erkenntnis | Tag 5 |
| `z4_kurve` „Sie hat zurückgesehen“ | `z4_passierschein` (Mala) + `z4_kurve_ana` (Ana) | gesichert | Tag 5 |

**Wer was weiß**
- **Was nur Mala hat:** die Notizen aus Nachhall, `z4_nachricht` und `z4_passierschein`.
  - Sie stehen in **ihrem** Notizbuch. Die Engine kennt das aus Kapitel 3 als „Malas Sicht“.
  - Marko bekommt sie erst, wenn sie sie ihm sagt: im Streit und auf der Hackerbrücke.
- **Was nur Marko weiß:** der 19. April. Er ist bis Tag 5 nicht im Notizbuch, nur als Ausweichen in seinen Sätzen (11.2).
- **Was der Spieler sieht:** beides, denn er spielt beide. So entsteht Spannung ohne falsches Spiel: Der Spieler weiß an Tag 1 durch Mala mehr als Marko sagt. Er sieht, wie Marko ausweicht und wie Mala schweigt.

### 6.6 Dialoge, die auf Erkenntnisse reagieren

Statt nach jedem Fund alle Themen neu anzuklicken, spricht der Spieler gezielt einen Widerspruch an, mit einer Notiz im Gespräch wie in Kapitel 3. Die Auswahl ist auf vier Notizen begrenzt (Lehre aus E-11).

| Bei wem | Notiz | Antwort |
|---|---|---|
| Frau Wimmer | `s4_tarnung` | „Bairisch, wenn einer fragt, woher er kommt. Italienisch, wenn er sich die Finger klemmt. Das stimmt. Das habe ich nie zusammengezählt.“ |
| Frau Wimmer | `s4_name` | „Giuseppe … das ist der Josef? Dann sind das seine Briefe. Ich dachte, die hat er für einen Freund aufbewahrt.“ |
| Herr Obermaier | `s4_name` (vorher nur „Sepp“ und „Rugiero“) | „Mit zwei g? Dann suche ich anders. Das ist nicht dieselbe Person für uns, Herr Vuković. Für uns ist das ein neuer Mensch.“ |
| Ana (Tag 2) | `z4_ana2004` | „Du hast mit Mostar telefoniert.“ – „Ja.“ – „Dann weißt du es.“ |
| Jasna (Tag 2, Abend) | Sepps Aushang | Erinnerung an 1992, aber nur die Ankunft. Fragt Marko nach der Abfahrt: „Iss. Es wird kalt.“ |
| Jasna (vor Silvester) | `z4_vermisst` | „Ich kann lesen, Marko. Da stand nicht ‚tot‘.“ Das Spiel lässt Marko hier noch nicht weiter. Es ist eine Probe, kein Schluss. |
| Kolar (Tag 2) | – | Ihre Frage nach dem Datum ist der Wendepunkt. Marko antwortet ohne Auswahl, weil er hier nicht lügen kann. |

### 6.7 Umfang, Schwierigkeit, Freiheit

**Vergleich mit der tatsächlichen Fassung von Kapitel 3** (`BERICHT_K3.md`, Abschnitt 4: 3048 Dialog- und Erzählzeilen, 48 383 Wörter, 333 Gesprächsoptionen, 22 Schauplätze, 86 Hinweisthemen, Spieltakt der Musterlösung rund 151 Minuten)

| Größe | Kapitel 3 (gemessen) | Kapitel 4 (Schätzung) | Begründung |
|---|---|---|---|
| Schauplätze | 22 | 19 bis 21 | Das Heim zählt fünf Räume, die Wohnung zwei, dazu zwei Zwischenwelten. |
| Dialog- und Erzählzeilen | 3048 | 2900 bis 3300 | drei lange Gespräche mit Auswahl (Kolar, Carmela, Silvester), zwei Fälle, Familie |
| Gesprächsoptionen | 333 | 330 bis 380 | mehr Widerspruchsoptionen statt Themenlisten |
| Schlüsse im Notizbuch | 23 | 20 bis 24 | mit Annahme-Stufen |
| Rätsel-Overlays | 6 Einsätze | 4 bis 6 | Briefe, Akte, Formular; kein Ordnen mit acht Karten nötig |
| Hinweisthemen | 86 | 70 bis 85 | |
| Spieltakt der Musterlösung | 151 min | 140 bis 165 min | Bei gleicher Gesprächsdichte geschätzt, nicht gemessen |

**Spielzeit für Menschen:** nur geschätzt.
- Das Verhältnis aus `BERICHT_K3.md` ergibt für erkundende Spieler **etwa 5½ bis 8 Stunden**. Zielstrebige brauchen weniger.
- Dialogzahl ist keine Dauer. Die Schätzung gilt nur, wenn die Fälle so dicht werden wie geplant.

**Schwierigkeit:** anspruchsvoller in der Verzahnung, nicht in jeder Hinsicht.
- Das schwerste Rätsel ist 7.2, weil man dort selbst Bedingungen ändert.
- Das emotionalste ist 7.3, das am längsten zu lösende 7.1.
- Zwischen ihnen gibt es Ruhephasen: Spaziergang, Heiligabend, Balkon.

**Freiheit:** An Tag 1 bis 3 laufen je zwei bis drei Stränge parallel. Feste Ereignisse wie Kolars Anruf und Jasnas Abende geben Orientierung. Kein Strang kann den anderen blockieren.

### 6.8 Stadtplan, Hinweise, Doppelklick, Wege

- **Stadtplan von München:** ZOB/Hackerbrücke, Hauptbahnhof (Gleis 11), Bahnhofsviertel, Westend (Jasna), Theresienwiese, Haus am Bavariapark, Giesing (Ana), Moosach (Davor, nach dem Anruf), Städtische Friedhöfe (nach dem Hinweis auf die Bestattung), Generalkonsulat (nur Fassung „Probe nein“).
  - Fahrten werden erzählt (Tram 19, S-Bahn).
  - **Kein Rätsel hängt an Laufzeit oder Wegwahl.**
  - Gesperrte Orte nennen den Grund, ohne den Weg zu verraten (Lehre aus E-15).
- **Mala reist allein** über denselben Plan. Unterwegs kann Marko nicht gewechselt werden, weil er woanders ist. Das Spiel zeigt, wo er ist.
- **Drei Uhr im Heim:** Die Uhrzeit wird über „(Bis drei Uhr warten.)“ angesteuert, wie die Warte-Optionen in Kapitel 3. Bedingungen des Versuchs, die vorher gesetzt wurden, bleiben bis zum Ende des Wartens bestehen.
- **Hinweise:** vier Stufen wie bisher, freiwillig. Für die drei großen Rätsel stehen sie in Kapitel 7. Kein Hinweis nennt einen Ort, den Marko noch nicht kennt (wie `hintcheck.js` prüft).
- **Keine ungefragten Lösungshinweise:**
  - Automatische Reaktionen sagen, was ist, nicht wohin.
  - Mala denkt nicht vor. Ihre Einwände betreffen Werte, nicht nächste Schritte (Lehre aus E-06 und K3-07).

---

## 7. Drei Kooperationsrätsel, ausgearbeitet

### 7.1 Kooperationsrätsel 1 – „Josef, Giuseppe, Peppino“ (widersprüchliche Aussagen, Übersetzung, Nachhall)

**Ausgangslage**
- Am Tag 1 hat Mala allein am Gleis 11 einen Geist gefunden: Gepäckträgermütze Nr. 17, ein gerader Rücken. Er bietet Reisenden an, die Koffer zu tragen, und keiner sieht ihn.
- Mala versteht sein Gemisch nicht: „Er redet drei Sprachen auf einmal, und keine davon für mich.“
- Marko kommt mit und spricht Italienisch. Der Geist nennt sich „Peppino“.
  - Er muss „la lettera di gennaio“ schreiben, kann aber keinen Stift halten.
  - Nach seinem Nachnamen gefragt, zeigt er auf den Boden: „Me l'hanno preso qui. Al binario undici.“ (Den hat man mir hier genommen.)
  - Wo er herkommt, sagt er nicht: „Non ne parlo.“ Er will nicht, dass jemand zu Hause anruft. Die Lüge soll bleiben.

**Ziel:** Wer ist er? Warum findet die Stadt keine Angehörigen? Was soll aus dem Januarbrief werden?

**Voraussetzungen:** Tag 2, Ämter offen. `s4_peppino` aus Tag 1.

**Handlungsschritte** (Reihenfolge der Schritte 1 bis 4 frei)
1. **Bahnhofsmission (Marko).** Frau Wimmer erzählt, nachdem Marko sagt, dass er Übersetzer ist.
   - Ein Stammgast, „der Sepp“, ist am 16. Dezember erfroren. Die Stadt findet niemanden.
   - Er hat hier jeden Tag Tee getrunken und „italienisch geflucht, wenn er dachte, keiner hört es“ (`s4_fluch`).
   - Sein Koffer steht im Lager. Darin liegen Briefe in einer Sprache, die sie nicht lesen kann, an „einen Giuseppe“. „Für einen Freund, glaube ich.“
   - Den Koffer öffnet sie nur, wenn sie dabei ist.
2. **Kiosk am Gleis (Marko).** Die Kioskfrau sagt: „Der Sepp? A Urmünchner. Der hat Bairisch g'redt wie mei Schwiegervater.“ (`s4_bairisch`)
3. **Bar Sport (Marko).** Signor Enzo kam 1962 im selben Zug.
   - „Peppino non è mai tornato.“ Er habe Bairisch gelernt, „damit keiner fragt, woher er kommt“.
   - Er weiß „Gepäckträger, siebzehn“, aber keinen Nachnamen: „Per noi era Peppino. Basta.“
4. **Städtische Friedhöfe (Marko).** Herr Obermaier hat eine Akte: „unbekannter Mann, ca. 70“.
   - Darin liegt ein alter Gepäckträgerausweis der Bahn aus der Mütze: „Josef Rugiero, Gepäckträger Nr. 17“ (`s4_ausweis`).
   - Die Bestattung von Amts wegen ist für Donnerstag angeordnet. „Rugiero“ ergibt in keinem Register einen Treffer.
5. **Schluss 1 (Spieler):** `s4_bairisch` + `s4_fluch` ergibt `s4_tarnung`, „Er konnte beides“. Damit ist der Widerspruch aufgelöst.
6. **Schluss 2 (Spieler):** `s4_peppino` (Mütze 17) + `s4_ausweis` (Nr. 17) ergibt `s4_derselbe?`, „Peppino ist der Sepp (?)“.
7. **Der Name (zwei gleichwertige Wege):**
   - **Weg a, Bunker (Mala allein):** Marko bleibt oben am Gleis. Mala geht durch den Boden in den alten Bunker der Weiterleitungsstelle.
     - Dort hört sie den Nachhall von 1962. Ein Beamter: „Name? Giuseppe? Das schreibt keiner. Josef. Und Rugiero, ein G reicht.“ Ein junger Mann: „Sì, sì. Josef.“ (`s4_bunker`)
     - Mala kommt hoch und erzählt. Sie versteht „Josef“, nicht „Giuseppe“. Marko muss den Rest übersetzen.
   - **Weg b, Koffer (Marko mit Frau Wimmer):** Mit `s4_derselbe?` im Gespräch öffnet Frau Wimmer den Koffer. Darin sind Umschläge, adressiert an „Giuseppe Ruggiero, c/o Bahnhofsmission, Gleis 11, München“, Absender „C. Ruggiero, Pietrafonda Nuova (MT)“ (`s4_umschlag`).
   - Beide Wege führen zu `s4_name`, „Josef Rugiero ist Giuseppe Ruggiero“. Wer beide geht, bekommt beide Seiten: wie der Name verloren ging und wo er herkommt.
8. **Folgen des Namens:**
   - Obermaier sucht neu („Für uns ist das ein neuer Mensch.“).
   - Frau Wimmer gibt die Briefe zum Lesen.
   - Jetzt kommt Peppinos Bitte (A3).

**Hinweise im Spiel**
- **Die Mütze:** Sie ist der einzige sichtbare Gegenstand. Die Nummer 17 steht groß darauf. Mala: „Siebzehn. Wie ich, als ich aufgehört habe.“
- **Peppinos Satz** „Me l'hanno preso qui“ verweist auf den Ort.
- **Enzos „Per noi era Peppino“** verweist darauf, dass es mehrere Namen gibt.

**Zwischenfolgerungen:**
- Sepp und Peppino könnten derselbe sein. Bairisch und Italienisch widersprechen sich nicht.
- Der Name wurde nicht vergessen, er wurde gewechselt.

**Ergebnis:** Der richtige Name ist gefunden, die Stadt kann suchen. Die Briefe verlangen eine Entscheidung (A3).

**Warum der Schluss nicht aus einem Hinweis folgt**
- „Sepp“ ist bairisch für Josef, „Peppino“ italienisch für Giuseppe. Jeder Name allein führt in eine andere Sprache.
- Erst die Nummer 17 verbindet die Personen. Der Bunker oder die Briefe erklären die Schreibweise.
- Ohne diese Erklärung sucht die Stadt weiter unter „Rugiero“, und Marko kann nicht sicher sein, dass die Briefe dieselbe Person meinen.

**Fehlversuche und Antworten**
- **`s4_bairisch` + `s4_peppino`:** „Ein Münchner, der Peppino heißt?“ Mala: „Münchner fluchen anders. Ich habe ihn gehört, als ihm einer auf den Fuß getreten ist.“ Nur wenn Mala am Tag 1 dabei war; sonst eine neutrale Antwort.
- **Beim Italienischen Konsulat mit „Josef Rugiero“ anrufen** (Telefon, freiwillig): „Non risulta nessun Josef Rugiero.“ Das ist der Hinweis, dass der Name verändert sein kann.
- **Frau Wimmer die Briefe zu früh zuschreiben** (ohne `s4_derselbe?`): „Die sind für einen Giuseppe. Der Sepp hieß Josef. Das weiß ich aus der Akte.“
- **Peppino direkt nach dem Dorf fragen:** „Non ne parlo. Scriva la lettera.“
- **Peppino nach „Josef“ fragen:** Er zuckt zusammen: „Così mi chiamavano. Qui.“ So nannten sie mich, hier. Das ist eine Bestätigung, kein Beweis.

**Erlaubte Reihenfolgen und Abkürzungen**
- Die Schritte 1 bis 4 sind frei.
- Wer zuerst zu Obermaier geht, hat den Ausweis früher.
- Wer Mala gleich in den Bunker schickt, bekommt `s4_bunker` vor `s4_derselbe?`. Der Schluss geht dann direkt: `s4_bunker` + `s4_ausweis` ergibt `s4_name`.

**Warum keine Figur es allein lösen kann**
- **Mala:** versteht Peppino nicht, kann keine Lebenden befragen und keine italienischen Briefe lesen.
- **Marko:** sieht Peppino erst, nachdem Mala ihn gefunden hat. In den Bunker kommt er nicht, und der Nachhall ist ohnehin nur für Mala.

**Naheliegende andere Lösungen und warum sie nicht greifen**
- **Die Polizei fragen:** Sie hat die Sache an die Stadt abgegeben. „Ohne Ausweis kein Fall.“
- **Den Koffer einfach nehmen:** Frau Wimmer lässt nicht, und Marko tut es nicht. Das ist eine Entscheidung der Figur, keine Sperre.
- **Im Internet nach „Peppino München Gepäckträger“ suchen:** 2011 möglich, ergibt einen Zeitungsartikel von 1985 („Der letzte Gepäckträger“) mit Foto, aber ohne Nachnamen. Das ist eine Bestätigung von `s4_derselbe?` statt eines Ersatzes für den Namen (freiwillig).

**Teil A3: der Januarbrief (Entscheidung mit Folge)**
- Mit dem Namen bittet Peppino: „Adesso scriva. Cara Carmela, sto bene.“
- Der Spieler kann „(Den Brief schreiben.)“ wählen.
  - Marko schreibt. Peppino verbessert sein Italienisch.
  - Mala sagt Nein (5.2, Handlung 3). Marko: „Du hast selbst gesagt: Sagt es keinem.“ Mala: „Ja. Und es war falsch.“
  - Unterschreiben kann Marko nicht: „Wessen Namen schreibe ich drunter?“
  - Der Brief bleibt im Notizbuch, ungeschickt.
- Erst die Briefe Carmelas zeigen den dritten Weg. Der Brief von 1979 lautet: „Ti ho visto con le valigie. Eri bello come papà. Anche io sto bene.“ Mala spürt daran eine Frau, die beim Schreiben weint (`s4_wusste`).
- Marko ruft an (A4). Wer den falschen Brief nicht geschrieben hat, kommt direkt dorthin.

**Teil A4: das Telefonat**
- Ein Gespräch mit Auswahl auf Italienisch, im Spiel mit deutscher Übersetzung wie die bosnischen Sätze in Kapitel 3.
- **Die drei Einstiege:**
  - „Ihr Bruder ist gestorben.“ Das ist zu hart. Rosa legt fast auf, Carmela nimmt den Hörer.
  - „Ihr Bruder lässt grüßen.“ Das ist eine Lüge, Mala rügt sie.
  - „Ich habe seine Briefe gelesen. Und Ihre.“ Das ist der richtige Ton.
- Carmela sagt: „Lo sapevo. Da trent'anni.“ Sie will ihn heimholen.

**Gestufte Hinweise** (Themen „Der Gepäckträger“, „Der Name, den man ihm genommen hat“, „Der Januarbrief“)
- **Der Gepäckträger:**
  1. „Am Gleis elf trägt einer Koffer, die keiner sieht.“
  2. „Die Lebenden nennen ihn anders, als er sich selbst nennt.“
  3. „Die Nummer auf der Mütze steht auch woanders.“
  4. „Bei den Städtischen Friedhöfen nach der Akte fragen und den Ausweis mit ‚Peppino‘ verbinden.“
- **Der Name, den man ihm genommen hat:**
  1. „Er sagt, sein Name wurde ihm hier genommen.“
  2. „Hier heißt: am Gleis elf. Darunter war früher eine Stelle für Ankommende.“
  3. „Mala kann spüren, was dort geschah. Oder die Briefe in seinem Koffer nennen den Namen.“
  4. „Als Mala am Gleis elf in den Bunker gehen. Oder Frau Wimmer mit ‚Peppino ist der Sepp‘ bitten, den Koffer zu öffnen.“
- **Der Januarbrief:**
  1. „Er will, dass seine Schwester weiter glaubt, es gehe ihm gut.“
  2. „Was hat Carmela all die Jahre zurückgeschrieben?“
  3. „Einer ihrer Briefe ist anders als die anderen.“
  4. „Den Brief von 1979 lesen, Mala daran spüren lassen und Carmela anrufen.“

### 7.2 Kooperationsrätsel 2 – „Drei Uhr“ (räumliches Zusammenspiel, Versuch)

**Ausgangslage**
- **Haus am Bavariapark, Wohnbereich 2:**
  - Um drei Uhr gibt es Kaffee im Gemeinschaftsraum.
  - Der Aufzug gongt, wenn er hält.
  - Alois Lechner (89) steht jeden Tag um drei auf und geht zum Aufzug. Er sagt „Die Gerda!“, friert, wird unruhig und läuft bis halb fünf.
  - Die Pflegerinnen, auch Jasna, sagen: „Ihre Gerda kommt später, Herr Lechner.“
- **Was Mala sieht:** Gerda kommt um drei durch die Aufzugtür, setzt sich zu ihm und nimmt seine Hand.
- **Gerda** glaubt, sie beruhige ihn: „Das macht er immer, der Alois. Bis ich da bin.“

**Ziel:** herausfinden, was Alois um drei so unruhig macht, und etwas daran ändern, ohne ihm wehzutun.

**Voraussetzungen:** `g4_gerda` (Tag 1). Marko kennt das Heim über Jasna, und Frau Ertl duldet ihn als „Sohn von der Vuković“.

**Handlungsschritte**
1. **Beobachtung (Tag 2, um drei):**
   - **Marko** beobachtet Alois: Er ignoriert den Kaffee, steht beim Gong auf, schaudert, als hätte jemand ein Fenster geöffnet. Die Pflegerin sagt das „später“.
   - **Mala** beobachtet Gerda: Sie steigt mit dem Gong aus dem Aufzug, setzt sich und nimmt die Hand. Alois schaudert genau in diesem Moment.
   - Notizen: `g4_drei`, `g4_gong`, `g4_kalt` (nur Mala), `g4_spaeter`.
2. **Annahme (Spieler):** Vier Notizen ergeben `g4_ursache?`: der Gong? Gerda? das „später“? der Kaffee? Ein Hinweis auf den Kaffee kommt von Frau Ertl: „Kaffeezeit ist Unruhezeit. Das ist überall so.“
3. **Bedingungen setzen (Tag 3, vor drei):** Es gelten zwei Versuche an einem Nachmittag, je einer vor und einer nach der halben Stunde. Beide müssen nicht am selben Tag gelingen.
   - **Gong ab (Marko):**
     - Hausmeister Kraus stellt ihn ab, „aber nicht lang, Brandschutz“.
     - Er tut es nur, wenn Marko einen Grund nennt, den ein Hausmeister versteht: „Herr Lechner erschrickt.“ Wer „ein Geist“ sagt, bekommt einen langen Blick und kein Abstellen.
   - **Gerda im Flur (Mala):**
     - Gerda misstraut „dem Preißn“ Marko. Mit Mala redet sie, „weil Sie so jung sind, Fräulein“.
     - Mala muss etwas aus Gerdas Leben nutzen: Fünfunddreißig Jahre hat sie am Depot draußen gewartet, nie ist sie hineingegangen. Die Geschichte kennt man aus Alois' Fotos und seinem Erzählen (Zimmer 214).
     - Mala sagt: „Sie haben immer draußen gewartet. Warten Sie heute draußen.“ Gerda: „Einmal.“
   - **Das „später“ (Marko bei Jasna):**
     - Er bittet die Mutter, heute etwas anderes zu sagen. Sie lehnt ab: „Das hat die PDL so angeordnet. Und du hast keine Ahnung, was es heißt, jemandem jeden Tag zu sagen, dass seine Frau tot ist.“
     - Hier geht es nicht weiter. Das ist ein Spiegel ihrer eigenen Schonung, kein Rätselschloss.
4. **Versuch 1, Gong ab, Gerda bei ihm:** Alois steht nicht auf. Um 15:10 setzt Gerda sich, nimmt die Hand, und er friert und ruft nach ihr. Notiz: Der Gong löst das Aufstehen aus, Gerdas Nähe das Frieren.
5. **Versuch 2, Gong an, Gerda im Flur:** Er steht beim Gong auf und geht zum Aufzug, aber er friert nicht. Nach zehn Minuten setzt er sich und sieht hinaus.
6. **Schluss (Spieler):** Versuch 1 + Versuch 2 ergibt `g4_beides`, „Er wartet auf den Gong und friert, wenn sie bei ihm ist.“ Mala zieht den Schluss, den nur sie ziehen kann: „Sie hält ihn im Warten. Wie ich …“ Den Satz beendet sie nicht.
7. **Gerdas Entschluss (Mala allein):**
   - Gerda wehrt sich: „Vierundsechzig Jahre verheiratet, und dann soll ich ihn allein lassen?“
   - Mala muss den Versuch erzählen, nicht nur behaupten. Gerda glaubt es erst, als Mala sie fragt: „Hat er früher gefroren, wenn Sie da waren?“ „Nie. Er war ein Ofen.“
   - Dann sagt Gerda: „Dann geh ich voraus. Diesmal ich.“
8. **Der Abschied (Tag 4, um drei, Marko):**
   - Marko braucht Worte in Alois' Sprache. Die Fotos in Zimmer 214 (Linie 19, Depot) und Alois' Ritual „Endstation, alles aussteigen“ liefern sie.
   - Marko: „Endstation, Herr Lechner. Feierabend. Die Gerda wartet am Depot, mit der Kanne.“ Alois: „Dann fahr i ei.“
   - Zwischenwelt: Gerda steigt in die Bahn, Mala bleibt am Rand. Gerdas Kanne wird stofflich, Marko gibt sie Alois.

**Hinweise im Spiel:** Alois' Fotos, die Pflegedokumentation im Dienstzimmer und Kraus' Bemerkung über den Gong („Da laufen manche hin, als hätt einer geklingelt“).

Die Pflegedokumentation darf Marko nur sehen, wenn Jasna sie ihm zeigt. Das tut sie, als er nach dem „später“ fragt: „Hier steht es. Schwarz auf weiß.“

**Ergebnis:**
- Gerda geht von sich aus. Alois wartet nicht mehr und hält um drei die Kanne.
- Jasna sieht, dass die Wahrheit in der richtigen Sprache ruhiger macht als ihr „später“.
- Mala hat gesehen, wie Bleiben festhält.

**Warum der Schluss nicht aus einem Hinweis folgt**
- Um drei geschehen vier Dinge zugleich: Kaffee, Gong, „später“ und Gerda.
- Jede Erklärung ist für sich plausibel. Frau Ertl glaubt an den Kaffee, Kraus an den Gong, Marko an das „später“, Mala fürchtet Gerda.
- Erst wenn man eine Bedingung nach der anderen ändert, trennen sich die Ursachen.

**Fehlversuche und Antworten**
- **Alois direkt sagen „Ihre Frau ist tot“:** Er weint, und fünf Minuten später fragt er wieder. Jasna kommt dazu: „Das habe ich auch einmal gemacht. Im ersten Jahr. Nie wieder.“ Danach ist er eine Stunde lang nicht ansprechbar. Kein Versuch an diesem Tag, am nächsten geht es weiter.
- **Gerda ohne Beleg wegschicken:** „Sie wollen mir meinen Mann wegnehmen?“ Sie bleibt.
- **Nur den Gong abstellen und daraus schließen** „Der Gong ist schuld“: Mala: „Er hat trotzdem gefroren. Ich habe es gesehen.“
- **„Der Kaffee“:** Mala: „Er trinkt keinen. Er wartet.“
- **Kraus mit „Geist“ kommen:** kein Abstellen an diesem Tag.

**Erlaubte Reihenfolgen und Abkürzungen**
- Die Versuche gehen in beiden Reihenfolgen.
- Wer Gerda schon am ersten Tag in den Flur bittet und dabei beobachtet, kann Versuch 2 vorziehen.
- Ohne Gong-Versuch reicht der Schluss nicht. Mala sagt dann: „Er steht trotzdem auf. Es ist nicht nur sie.“

**Warum keine Figur es allein lösen kann**
- **Mala:** kann Lebende nicht befragen, den Gong nicht abstellen und Alois nicht ansprechen.
- **Marko:** sieht Gerda erst, nachdem Mala sie gefunden hat. Die Kälte sieht er nur von außen. Gerda hört nicht auf ihn.
- Den Schluss zieht nur, wer beide Seiten zugleich sieht. Deshalb müssen beide um drei an verschiedenen Stellen stehen.

**Naheliegende andere Lösungen und warum sie nicht greifen**
- **Alois anderswo hinsetzen:** Die Pflege lehnt ab. „Er geht trotzdem zum Aufzug.“
- **Gerda einfach hinüberbringen:** Mala kann niemanden hinüberbringen, der nicht losgelassen hat. Das ist eine Regel aus Kapitel 1 (`06_ui.js:511`).

**Gestufte Hinweise** (Thema „Drei Uhr“)
1. „Um drei Uhr wird Herr Lechner unruhig. Jeden Tag.“
2. „Was geschieht um drei Uhr alles gleichzeitig?“
3. „Kaffee, Gong, ‚später‘ und Gerda. Ändere jeweils nur eines und sieh hin, beide zugleich.“
4. „Mala bittet Gerda, im Flur zu warten. Marko lässt den Gong abstellen. Dann bis drei Uhr warten.“

### 7.3 Kooperationsrätsel 3 – „Nije se vratio“ (Nachhall und Rekonstruktion; trägt den Höhepunkt)

**Ausgangslage**
- Ein Satz, drei Lesarten.
- Was Mala am Tag 1 in der Kiste gefunden hat, weiß Marko nicht. Was Marko weiß, sagt er nicht.

**Ziel:** verstehen, was der Satz 1993 in Sarajevo hieß und was er in München hieß. Und ihn der Mutter so sagen, dass sie ihn verstehen kann.

**Teil A: Quellen sammeln** (Tag 1 bis 5, teils fest, teils frei)

| Quelle | Wer | Was | Notiz |
|---|---|---|---|
| Rotkreuz-Nachricht, Mai 1993 | Mala, durch den Kistendeckel | „Zoran je otišao po vodu i nije se vratio. Marko je kod mene, zdrav je. Ne brini. Ruža.“ Nachhall: Ruža: „Napisat ću ‚poginuo‘.“ Jungenstimme: „Ne. Napiši ‚nije se vratio‘. Molim te.“ | `z4_nachricht` (Mala) |
| DRK-Suchantrag, 1994 | Mala | „Gesuchte Person: Zoran Vuković … vermisst seit April 1993 … Umstände: ist Wasser holen gegangen und nicht zurückgekommen (laut Nachricht der Schwiegermutter)“ | `z4_antrag` (Mala) |
| Passierschein, Mai 1992 | Mala | Nachhall: Jasna am Busfenster bis zur Kurve. „Zorane, gdje je Marko?“ – „Fahrt. Wir kommen nach.“ | `z4_passierschein` (Mala) |
| Jasna, Abend Tag 1 | Marko | „Ruža hat geschrieben, er ist nicht zurückgekommen. Nicht, dass er tot ist. Ich kann lesen.“ | `z4_lesart` |
| Kolar, Tag 2 | Marko | Datum, Ort, Rechenschieber. „In den Akten von dreiundneunzig steht oft ‚nije se vratio‘. Das schreiben Familien, die es wissen und nicht schreiben können.“ | `z4_kolar`, `z4_kode` |
| Ana, Tag 5 | Marko | „Mama stand bis zur Kurve am Fenster. Danach hat sie nie wieder am Fenster gesessen.“ | `z4_kurve_ana` |
| Markos Erinnerung, Tag 5 | Marko | Erinnerungsbild „Der Neunzehnte April“: die Schlange, „Druck“, der Knall, „Nemoj gledati, mali“, die Kanister, Vratnik | `z4_dabei` |

**Teil B: Rekonstruktion** (Notizbuch)
1. **`z4_lesart` + `z4_antrag` ergibt `z4_vermisst`:** Mama hat „nicht zurückgekommen“ als „vermisst“ gelesen. Das ist Marko möglich, ohne Malas Wissen; den Antrag kann er von Jasna erfahren, wenn er sie am Tag 2 nach dem Suchdienst fragt.
2. **`z4_nachricht` + `z4_kode` ergibt `z4_tot`:** In Sarajevo hieß es „tot“, und Ruža wollte „poginuo“ schreiben.
   - Diesen Schluss kann zuerst nur Mala ziehen, denn sie hat die Nachricht.
   - Sie zieht ihn am Tag 2, Notiz in ihrem Buch, und schweigt.
   - Marko bekommt `z4_nachricht` im Streit am Tag 4. Der Spieler kann den Schluss dann auch als Marko ziehen.
3. **`z4_vermisst` + `z4_tot` ergibt `z4_zweistaedte`:** „Derselbe Satz, zwei Städte“.
   - Das ist die zentrale Erkenntnis. Marko übersetzt seit achtzehn Jahren, und diesen einen Satz hat er nie übersetzt.
   - Ohne diesen Schluss beginnt die Nacht von Tag 5 nicht.
4. **`z4_kolar` + Erinnerungsbild ergibt `z4_dabei`:** „Ich war dabei“.
   - Das Erinnerungsbild kommt erst, wenn Marko auf der Hackerbrücke ungefragt erzählt (8.2). Es ist keine verdrängte Erinnerung. Er sieht nur zum ersten Mal hin.
5. **`z4_passierschein` + `z4_kurve_ana` ergibt `z4_kurve`:** „Sie hat zurückgesehen“.
   - Das Wort dafür gibt Mala ihm in der Nacht, oder spätestens in der Silvesternacht.

**Teil C: die Silvesternacht** (räumlich, dann Gespräch)

**C1, die Spur:**
- Um 23:15 ist Jasna fort. Ana weiß, dass sie sonst arbeitet: „Dieses Jahr hat sie getauscht.“
- Mala folgt dem Nachhall des Zählens an Hausecken: „Jedan, dva, tri …“, Sekunden zwischen Blitz und Knall. Sie kommt zurück und erzählt die Richtung, Bavariapark.
- Wer die Spur nicht abwartet, kann Ana fragen. Das reicht für die Vermutung, aber nicht für die Gewissheit, und Marko zögert: „Und wenn sie nicht dort ist?“

**C2, der Weg:**
- Möglich sind die Nachttram, zu Fuß (Ankunft nach Mitternacht, das Gespräch verschiebt sich, sonst ändert sich nichts) oder Davor, falls angerufen („Diesmal ist keiner zu spät.“).
- Keine Variante ist falsch.

**C3, das Gespräch:** in Zimmer 214, mit Notizen und Auswahl. Pro Zug stehen bis zu vier Notizen zur Wahl. Der Ablauf wird gespielt, nicht abgespielt.

| Zug | Bester Weg | Andere Wege und was geschieht |
|---|---|---|
| 1 Einstieg | `z4_dabei`: „Ich war dabei.“ – „Wobei?“ | „Sie haben ihn gefunden.“ Jasna: „Ich habe keine Probe gegeben.“ Anas Geheimnis fällt vorzeitig, Jasna steht auf: „Dann wisst ihr ja alles.“ Mala: „Nicht so. Fang bei dir an.“ Jasna kommt nach einer halben Minute vom Flur zurück. / `z4_vermisst` ohne `z4_dabei`: „Das weiß ich seit achtzehn Jahren.“ Mala: „Nicht den Satz. Was er bedeutet hat.“ |
| 2 Der Tag | Marko erzählt; das Erinnerungsbild läuft noch einmal, kurz | – |
| 3 Der Satz | `z4_zweistaedte`: „Baka wollte ‚poginuo‘ schreiben. Ich habe gesagt: ‚nije se vratio‘. In Sarajevo hieß das damals: tot, und keiner kann es aussprechen. Du hast es in München gelesen.“ | `z4_tot` allein: Jasna: „Dann hat Ruža gelogen.“ Mala: „Nicht Ruža. Er.“ Marko muss seinen Teil sagen. |
| 4 Ihr Stück | (Pause) Jasna: „Ich bin ohne dich gefahren.“ | – |
| 5 Die Kurve | `z4_kurve`: „Du hast aus dem Fenster gesehen. Bis zur Kurve.“ – „Woher …“ – „Ich weiß es.“ | Ohne `z4_kurve`: „Ihr musstet fahren. Ich war bei Baka.“ Trägt auch, aber Jasnas Schuld bleibt schwerer. Im Epilog sagt sie dann: „Ich hätte aussteigen können.“ |
| 6 Der Fund | „Sie haben ihn gefunden.“ (Fassung nein: „Sie haben ihn wahrscheinlich gefunden. Ich habe meine Probe gegeben.“) – „Hinter meinem Rücken.“ – „Ja. Weil wir dich schonen wollten. Alle.“ | – |
| 7 Alois | Jasna sieht zur Kanne. „Man sagt ‚später‘ und hofft, dass sie es vergessen.“ – „Er weiß, wo sie ist.“ – „Und wo ist Zoran?“ | – |
| 8 Mitternacht | „Ich will ihn sehen. Ich fahre hin.“ | Jasna entscheidet selbst. Marko bittet nicht, er antwortet: „Ich komme mit.“ (Fassung nein: „Ich gebe meine Probe auch.“) |

**Hinweise im Spiel:** keine ungefragten. Mala greift nur bei Fehlwegen ein, mit Werten, nicht mit Lösungen: „Fang bei dir an.“, „Nicht den Satz.“

**Ergebnis:** der Höhepunkt (9.2).

**Warum der Schluss nicht aus einem Hinweis folgt**
- `z4_lesart` allein klingt wie Jasnas Starrsinn.
- `z4_kode` allein ist eine Akten-Weisheit.
- `z4_nachricht` allein ist Malas Wissen ohne Gegenstück.
- Erst zusammen wird sichtbar, dass dieselben Wörter in zwei Städten Verschiedenes bedeuteten und dass Marko die Wahl der Wörter selbst getroffen hat.

**Warum keine Figur es allein lösen kann**
- **Nur Mala** hört die Jungenstimme und Jasnas Kurve.
- **Nur Marko** hat Kolar, Jasna und Ana als Gesprächspartner und den 19. April als Erinnerung. Nur er kann der Mutter etwas sagen.
- **Ohne Malas Schweigen und den Streit** hätte Marko nicht erlebt, wie Geschontwerden sich anfühlt. Das Kapitel macht daraus die Voraussetzung für Teil C.

**Naheliegende andere Lösungen und warum sie nicht greifen**
- **Es Jasna am Tag 2 nach Kolars Anruf sagen:** Ana bittet, bis nach Neujahr zu warten, und Marko stimmt zu.
  - Der Spieler kann es trotzdem versuchen. Jasna steht dann auf, „Ich muss zum Dienst“, und Marko hat nur `z4_vermisst`. Das Gespräch scheitert, ohne Folgen für später.
  - Das Spiel zeigt, warum es zu früh ist: Ihm fehlt der Satz.
- **Die Kiste selbst öffnen:** Marko tut es nicht. „Nicht ihre Kiste.“ Am Neujahrsmorgen öffnet Jasna sie selbst.

**Gestufte Hinweise** (Themen „Ein Satz“ und „Silvester“)
- **Ein Satz:**
  1. „Alle in der Familie sagen denselben Satz über Zoran.“
  2. „Hat er für alle dasselbe bedeutet?“
  3. „Was hat Frau Kolar über die Akten von dreiundneunzig gesagt? Und wie hat Jasna die Nachricht gelesen?“
  4. „‚Mama hat es als vermisst gelesen‘ mit ‚In Sarajevo hieß es: tot‘ verbinden.“
- **Silvester:**
  1. „Jasna ist gegangen, als die ersten Raketen kamen.“
  2. „Wo verbringt sie sonst Silvester?“
  3. „Ana weiß es. Mala kann ihrer Spur folgen.“
  4. „Als Mala der Spur folgen, dann ins Haus am Bavariapark. Im Gespräch zuerst ‚Ich war dabei‘.“

---

## 8. Zwei Schlüsseldialoge

### 8.1 Frühes Schlüsselgespräch: „Nur müde“ (Heiligabend, Nacht, Jasnas Wohnzimmer)

Jasna schläft, sie hat Frühdienst. Marko liegt auf der Couch, die zu kurz ist. Mala steht am Fenster. Das Gespräch zeigt den zentralen Konflikt, ohne ihn auszusprechen: zwei Menschen in einer Wohnung, die denselben Satz nicht sagen. Daneben steht ein dritter Satz, den Marko zu Mala sagt: „nur müde“.

> **ERZÄHLER:** Mamas Wohnzimmer. Die Couch ist zu kurz, die Decke riecht nach Lavendel und nach Schrank. Draußen schießt einer eine einzelne Rakete ab, eine Woche zu früh.
> **MALA:** Eine Woche zu früh.
> **MARKO:** In München sind sie ungeduldig.
> **MALA:** Deine Mutter ist zusammengezuckt. Beim Essen. Als Tobias den Korken gezogen hat.
> **MARKO:** Ich weiß.
> **MALA:** Du auch.
> **MARKO:** …
> **MALA:** Die Pantoffeln an der Tür. Vierundvierzig.
> **MARKO:** Seine Größe.
> **MALA:** Sie stehen gerade. Jemand stellt sie jeden Tag gerade.
> **MARKO:** Sie putzt. Sie putzt alles.
> **MALA:** Unter den Pantoffeln ist kein Staub. Unter der Kommode schon.
> **MARKO:** Du hast dich unter die Kommode gelegt.
> **MALA:** Ich kann mich überall hinlegen. Das ist das einzig Gute daran.
> *(Marko reibt sich die Schläfe.)*
> **MALA:** Tut es weh?
> **MARKO:** Nur müde.
> **MALA:** Du sagst „nur müde“, wie andere „nichts“ sagen.
> **MARKO:** Dann sage ich eben nichts.
> **MALA:** In Mostar hast du gesagt: Mama soll alles wissen.
> **MARKO:** Das war deine Mama.
> **MALA:** Ja.
> **MALA:** Und deine wartet.
> **MARKO:** Auf den Bus nach Sarajevo. Seit zweiundneunzig. Sie steigt nur nie ein.
> **MALA:** Nicht auf den Bus.
> *(Stille. Unten fährt ein Auto im Schnee, ganz leise.)*
> **MALA:** In Split hat eine Frau jeden Abend an einem Poller gewartet. Nicht auf ein Schiff. Auf einen Satz.
> **MARKO:** Ivka.
> **MALA:** Deine Mutter wartet auch auf einen Satz.
> **MARKO:** Sie will keinen. Du hast sie gehört. „Nicht heute.“
> **MALA:** Sie hat „nicht heute“ gesagt. Nicht „nie“.
> **MARKO:** Mala.
> **MALA:** Ich frage nicht. Das habe ich versprochen. Ich frage nicht, woher du es weißt.
> **MARKO:** Gut.
> **MALA:** Ich sage nur, was ich sehe. Das darf ich.
> **MARKO:** Was siehst du?
> **MALA:** Zwei Leute in einer Wohnung, die denselben Satz nicht sagen. Und einen, der auf ihrer Couch schläft, mit den Füßen in der Luft, weil sie zu kurz ist.
> **MARKO:** Sie war schon immer zu kurz.
> **MALA:** Du warst damals kürzer.
> **MARKO:** Morgen frage ich sie. Nach der Probe.
> **MALA:** Nach der Probe.
> **MARKO:** Damit fängt es an.
> **MALA:** Damit fängst du an, weil es dann nicht um dich geht.
> **MARKO:** Es geht um Tata.
> **MALA:** Ja.
> *(Pause.)*
> **MALA:** Schlaf. Ich zähle die Fenster gegenüber. Bei dreiunddreißig ist noch eins hell.
> **MARKO:** Wer ist da noch wach?
> **MALA:** Eine Frau. Sie bügelt. An Heiligabend.
> **MARKO:** Vielleicht hat sie morgen Dienst.
> **MALA:** Wie deine Mutter.
> **MARKO:** Wie meine Mutter.
> **ERZÄHLER:** Mala bleibt am Fenster. Mein Kopf pocht gleichmäßig, wie ein Zug, der nicht ankommt. Ich sage ihr nicht, dass es nicht vom Müdesein kommt.

**Funktion**
- Der Konflikt ist da: der Satz, das Warten, Mala, die nicht fragt.
- Daneben steht der zweite Satz zwischen den beiden: Markos „nur müde“.
- Die Ivka-Regel aus Kapitel 1 wird zur Brille für Jasna.
- Am Ende steht keine Lösung, nur eine Haltung. Die letzte Zeile sagt dem Spieler, was Marko Mala verschweigt.

### 8.2 Spätes Schlüsselgespräch: „Ich war dabei“ (Freitag, 30. Dezember, Nacht, Hackerbrücke)

Das Gespräch beginnt erst, wenn der Spieler `z4_zweistaedte` hat. Davor liegen:
- der Streit am Donnerstag;
- Carmelas „Lo sapevo“;
- Gerdas Kanne;
- Anas „bis zur Kurve“.

Das Gespräch kehrt keinen früheren Satz um. Es zeigt, was diese Erfahrungen verändert haben.

> **ERZÄHLER:** Die Hackerbrücke, nachts. Unter uns kommen die Züge herein und fahren wieder, als wäre das nichts. Mala sitzt auf dem Geländer. Ich nicht.
> **MARKO:** Du sitzt auf einem Geländer über vierzig Gleisen.
> **MALA:** Ich falle nicht. Das ist noch eins von den guten Dingen.
> **MARKO:** Ich habe dich gesucht. Am Gleis elf. Im Heim. Bei Ana.
> **MALA:** Ich war hier. Ich habe Züge gezählt. Hundertvier.
> **MARKO:** Seit wann?
> **MALA:** Seit du gesagt hast: Du hast in meinem Leben gelesen wie in einem Ort.
> **MARKO:** Das war gemein.
> **MALA:** Es war gemein und richtig. Das geht.
> *(Ein Zug. Dann wieder still.)*
> **MARKO:** Ich will dir etwas erzählen. Du hast nicht gefragt. Deshalb.
> **MALA:** Ich weiß, was du erzählen willst.
> **MARKO:** Nein. Du weißt, was du gehört hast. Aus Mamas Kiste. Baka, ich, der Zettel. Das ist nicht dasselbe.
> **MALA:** …
> **MARKO:** Es war ein Montag. Neunzehnter April. Das erste Mal warm in dem Jahr. Ich hatte eine Jacke an und habe geschwitzt, und er hat gelacht, weil ich sie nicht ausziehen wollte.
> **MARKO:** Wir hatten zwei Kanister. Blau. Er hat VUKOVIĆ draufgeschrieben, mit roter Farbe, damit sie keiner mitnimmt. Als ob einer Kanister mitnimmt, auf denen ein Name steht.
> **MARKO:** Die Schlange ging bis zur Brücke. Er hat mich hinten anstehen lassen, für Dragica. Er wollte vorn fragen, ob der Druck wieder da ist. Er hat „Druck“ gesagt. Wie bei einer Brücke.
> *(Erinnerungsbild „Der Neunzehnte April“ – Markos eigene Erinnerung, Sepia wie in Kapitel 2.)*
> **MARKO:** Dann war es laut. Dann war es nicht mehr laut. Einer hat mich festgehalten und gesagt: Nemoj gledati, mali. Schau nicht hin, Kleiner.
> **MARKO:** Ich habe hingeschaut.
> *(Lange Pause. Ein Zug fährt aus, Richtung Salzburg.)*
> **MARKO:** Danach habe ich die Kanister gefüllt. Beide. Ich habe angestanden, als wäre nichts. Und ich habe sie zu Baka getragen, hinauf nach Vratnik, und keinen Tropfen verschüttet.
> **MALA:** Du bist zurückgekommen.
> **MARKO:** Mit dem Wasser.
> **MALA:** Und Baka wollte „poginuo“ schreiben.
> **MARKO:** Und ich habe gesagt: Schreib „nije se vratio“. Dann fragt Mama nicht, woher wir es wissen. Dann muss keiner sagen, dass ich dabei war.
> **MARKO:** Ich war vierzehn. Ich habe gedacht, das ist ein Wort für „tot“, das man aushalten kann.
> **MALA:** Für dich.
> **MARKO:** Für mich.
> **MALA:** Ich habe es gehört. In der Kiste. Deine Stimme. Du hattest noch die hohe.
> **MARKO:** Und hast nichts gesagt.
> **MALA:** Du hast in Mostar gesagt: frag nicht. Ich habe nicht gefragt. Und dann habe ich nichts gesagt. Ich wollte dich schonen. Fünf Tage.
> **MARKO:** Fünf Tage.
> **MALA:** Bei dir sind es achtzehn Jahre. Bei mir waren es siebzehn. Bei Sepp neunundvierzig. Ich bin billig davongekommen.
> **MARKO:** Es war schlimm. Zu merken, dass du es weißt, und ich weiß nicht, seit wann.
> **MALA:** Ja.
> **MARKO:** So wird es für sie. Für Mama. Dass ich es weiß. Seit achtzehn Jahren.
> **MALA:** Ana will nach Neujahr.
> **MARKO:** Ich nicht. Morgen. In diesem Jahr.
> **MALA:** Du hast es selbst aufgeschrieben. Derselbe Satz, zwei Städte.
> **MARKO:** Ich übersetze seit achtzehn Jahren. Diesen einen nie.
> **MALA:** Dann morgen.
> *(Pause.)*
> **MALA:** Und noch etwas. Weil wir jetzt nichts mehr schonen. Dein Kopf.
> **MARKO:** Was ist mit meinem Kopf?
> **MALA:** Am Bahnhof war es Sepp. Im Heim war es Gerda. Da habe ich mich geirrt, ich dachte, ich bin es. Aber gestern, als wir gestritten haben, war keiner da außer mir. Und du hast dir die Schläfe gehalten.
> **MARKO:** Ja.
> **MALA:** Wenn ich dir wehtue, sage ich es. Auch wenn du „nur müde“ sagst.
> **MARKO:** Und wenn ich nicht mehr kann, sage ich es. Nicht „nicht zurückgekommen“. Den richtigen Satz.
> **MALA:** Den richtigen.
> **ERZÄHLER:** Unten fährt ein Zug ein, mit Schnee auf dem Dach, aus Salzburg vielleicht. Mala steigt vom Geländer, ohne dass es einen Laut macht.
> **MALA:** Gehen wir. Gegenüber bügelt sicher wieder eine.
> **MARKO:** Die bügelt immer.
> **MALA:** Dann ist wenigstens auf eine Verlass.

**Fassungen**
- **Zustimmung c:** Mala setzt nach „Den richtigen.“ hinzu: „Gefragt habe ich dich noch nicht. In München, habe ich gesagt. Ich frage dich, wenn deine Mutter es weiß. Sonst sagst du Ja, damit wenigstens eine Sache leicht ist.“
- **Zustimmung a:** „Am Grab hast du ‚Ja‘ gesagt. Einfach so. Jetzt weißt du, wie es nicht einfach ist.“
- **Zustimmung b:** „Am Grab hast du gesagt: Wenn es zu schwer wird, sagen wir es. Wir haben es beide nicht gesagt. Bis heute.“

**Was sich gegenüber 8.1 verändert hat**
- **Marko** erzählt ungefragt, nachdem er erlebt hat, wie Schonung von innen aussieht: Malas fünf Tage.
- **Mala** gesteht ihr Schweigen und korrigiert ihr Urteil über seinen Kopf.
- **Beide** vereinbaren, sich nichts mehr zu ersparen. Kein Gefühl wird erklärt, sondern eine Regel unter ihnen geschaffen, aus dem, was sie in diesen Tagen erlebt haben.
- Der Humor ist der von zwei Menschen, die sich gegenseitig aushalten.

---

## 9. Antworten und Vorbereitungen

### 9.1 Offene Stränge

| Eingeführt (wo, Status) | In Kapitel 4 beantwortet oder verändert | Für Kapitel 5 übrig, und warum |
|---|---|---|
| Der Vater „nicht zurückgekommen“ (Kapitel 2 opt. `rooms/vratnik.js:24`; Kapitel 3 Pflicht `rooms/herberge.js:119`) | **Beantwortet:** 19. April 1993, Brauerei, Marko war dabei. Ohne Namen begraben, 2003 exhumiert, jetzt zugeordnet oder kurz davor. | Die förmliche Identifizierung mit der Familie und das Begräbnis. Ein Begräbnis passt nicht in Weihnachten. Es braucht die Gerichtsmedizin und Jasnas Reise. |
| „Woher?“ (`rooms/herberge.js:121`) | **Beantwortet**, auf der Hackerbrücke und in der Silvesternacht | – |
| Die Mutter: „Sie kommt nicht“, „Achtzehn Jahre reden wir nicht über ihn“ (`rooms/pansion.js:31`, `rooms/vermisst.js:93`) | **Beantwortet:** ihr Stück von 1992, ihre Lesart von 1993. Sie entscheidet, zu fahren. | Ihre erste Rückkehr nach Sarajevo, Haus 7, Ružas Dach |
| Ana, „Komm uns besuchen“ (Kapitel 2 opt.) | **Neu eingeführt und verändert:** ihre Probe von 2004, Lanas Zeichnung, ihre Wut | Ana gibt Nada die Zeichnung (Kapitel 5, freiwillig). |
| Die Probe für Tata (`rooms/vermisst.js:90`) | **Erledigt:** Ana 2004 und Marko (Mostar oder München). Jasnas Verweigerung entscheidet nichts mehr. | – |
| Das Band, Markos Kopf, die Zustimmungsfassungen (`rooms/skela_l.js:284–298`) | **Verändert:** Die Ursachen sind geklärt (ungefundene Geister, manchmal Mala). Beide sagen es jetzt. Fassung c ist eingelöst. | **Die Entscheidung nach dem Begräbnis.** Mala hat sie selbst an „bis Mama mich begräbt“ gebunden (`:285`). |
| Lanas Begräbnis (`rooms/vermisst.js:23`) | Nur Nachricht: Exhumierung am 10. Januar. | **Das Begräbnis.** Es ist der Anlass von Kapitel 5. |
| Nadas Ahnung (`rooms/ostbus.js:119`, `rooms/skela_l.js:337`) | Nicht berührt. Jasnas Ruhe bei Nikos „Mädchen mit Schal“ ist ein stiller Widerhall, ohne Folge. | Gehört in die Schlussszene: Lana kommt „selbst nach Hause“. |
| Die Dose mit den zwei Fahrscheinen (`rooms/skela_d.js:221`; Kapitel 2 `97_k2_mala.js:110–114`) | Mala hält sie. Einmal sieht sie hinein, nachdem Gerda ihre Kanne hergegeben hat: „Wenn ich sie hergebe, dann der, die sie braucht.“ | Malas letzter Geistergegenstand, die erste Drei |
| Samstag 11:10 (`97_k2_mala.js:110`) | Malas Klopfen; Jasna kennt es noch. | Der 3. März 2012 ist ein Samstag. |
| „Die Stillen, Teil zwei“ (`97_k2_talk.js:153`, `97_k3_mala.js:223`) | **Erledigt:** Nachrufe für Sepp und für Zoran | – |
| Nada: „Keiner von euch hat je geschrieben“ (`rooms/stan.js:15`) | **Verändert:** Jasna ruft an. | Die beiden Mütter treffen sich. |
| Davor und Lena (`rooms/zelenika.js:176–177`) | Kleine Fortsetzung: Der Zweig schläft, Davor fährt. | Nicht nötig. August liegt nach dem Finale. |
| Zoras „Aber nicht zu viel“ (`97_k2_limbo.js:48`) | Nicht beantwortet. Gerdas Fall berührt die Frage, ohne sie zu deuten. | Nicht nötig. Atmosphäre. |
| Rades „Dva putnika“ (`rooms/carsija.js:53`) | – | Ein Zeichen für die Schlussfahrt, nicht nötig für die Handlung |
| Ivkas Botschaft an Zdenka (Kapitel 1, `rooms/limbo.js:35`) | – | Nicht nötig. Beiläufig. |

**Neue Fragen, die Kapitel 4 öffnet** (bewusst wenige)
- Wird Jasna die Rückkehr aushalten?
- Was macht Marko mit den blauen Kanistern auf Ružas Dachboden? Ihre Existenz wird erst in Kapitel 5 gezeigt, Kapitel 4 erwähnt sie nur in der Erinnerung.

Beides sind Folgen, keine neuen Rätsel.

### 9.2 Der Höhepunkt

**Erarbeiteter Erfolg**
- Der Spieler hat für die Silvesternacht alles selbst zusammengesetzt:
  - `z4_zweistaedte` aus Jasnas Lesart, Kolars Akten-Satz und Malas Nachhall;
  - `z4_dabei` aus Markos eigener Erinnerung;
  - `z4_kurve` aus Malas Nachhall und Anas Satz.
- Er hat Jasnas Weg gefunden und das Gespräch mit Auswahl geführt.
- Die lokalen Geschichten sind vorher abgeschlossen: Sepp ist zu Hause, Gerda am Depot, Alois hält die Kanne.

**Dauerhafte Veränderung**
- Die Familie hat sich alles gesagt. Der Vater ist ein Toter mit Namen, kein Vermisster mehr.
- Jasna fährt nach Sarajevo.
- Mala weiß, dass Bleiben festhalten kann. Marko weiß, dass Schonen einsperren kann.
- Der Erfolg wird nicht entwertet: Was gesagt ist, bleibt gesagt.

**Entschluss für das letzte Kapitel**
- Im März fahren alle nach Sarajevo, zu zwei Begräbnissen.
- Mala wird danach entscheiden. Marko hat zugesagt, ehrlich zu antworten, ohne zu entscheiden.

**Die vier Fragen**
- **Was wurde gelöst?** Das Schweigen der Familie Vuković, Zorans Name, Sepps Heimkehr, Gerdas Warten.
- **Was hat es gekostet oder verändert?**
  - **Jasna** verliert ihre Hoffnung und mit ihr ihre Rechtfertigung, nicht zurückzukehren.
  - **Marko** verliert sein Wort für das, was er nicht ansehen wollte.
  - **Ana** verliert ihr Geheimnis und gewinnt ihren Vater als Geschichte.
  - **Mala** verliert die Gewissheit, Marko nicht zu schaden.
- **Was haben Marko und Mala voneinander verstanden?**
  - Er weiß, wie sie schont: aus Treue zu einem Versprechen.
  - Sie weiß, wie er schont: aus Angst, gesehen zu werden.
  - Beide wissen, dass Schonen zwischen ihnen nicht mehr geht.
- **Was müssen sie gemeinsam zu Ende bringen?** Lana nach Hause bringen, ohne sie festzuhalten, und Zoran begraben.

### 9.3 Warum die letzte Aufgabe nicht sofort lösbar ist

- **Sachlich:**
  - Exhumierung, Abgleich und Identifizierung brauchen Wochen. So sagt es Frau Kolar in Kapitel 3 (`rooms/vermisst.js:23`), und es stimmt mit dem Verfahren überein (11.5).
  - Zorans förmliche Identifizierung macht die Gerichtsmedizin in Sarajevo mit der Familie.
- **Erzählerisch:**
  - Mala hat ihr Bleiben selbst an Lanas Begräbnis gebunden: „bis sie mich begräbt“.
  - Eine Entscheidung vor dem Begräbnis wäre gegen ihr eigenes Wort.
  - Diese Grenze ist ihre eigene, keine des Spiels.

---

## 10. Übergang und Finale-Perspektive

### 10.1 Der Übergabezustand

| | Am Ende von Kapitel 4 (Sonntag, 1. Januar 2012) |
|---|---|
| **Aufenthalt und Zeit** | Marko ist in München und fährt am 2. Januar mit dem Bus nach Split, zu Wohnung, Arbeit und Vesna. Mala fährt nicht mit ihm, sondern zu Nada nach Sarajevo, aus eigenem Entschluss. Das zeigt ihre Freiheit und ihr eigenes Anliegen („Ich will bei Mama sein“). Kapitel 5 beginnt gut acht Wochen später, am Donnerstag, dem 1. März 2012, in Sarajevo. Jasna und Ana fliegen ein, Marko kommt mit dem Bus. [N] |
| **Wissen** | Beide wissen alles über Zoran, die Familie auch. Jasna und Nada haben telefoniert. Lanas Exhumierung ist am 10. Januar; Kolar erwartet die Identifizierung im Februar. Zorans Identifizierung mit der Familie ist für den 1. März angesetzt. |
| **Beziehung** | Abmachung: sich nichts ersparen, auch den Kopf nicht. Fassung c ist beantwortet, a und b sind bestätigt. Mala entscheidet nach dem Begräbnis neu und will dann Markos ehrliche Antwort. Marko hat versprochen, sie nicht zu halten und nicht zu schonen. |
| **Was noch nicht geklärt ist** | Was Mala tun wird. Was Marko will. Ob Nada etwas weiß. Wohin Marko gehört. |
| **Spielerische Voraussetzungen** | Großmutters Džezva; Jasnas volle Plätzchendose für Nada; Anas Straßenbahn-Zeichnung (bei Ana); Malas Dose mit den zwei Fahrscheinen; Zorans Pantoffeln bei Marko. Kontakte: Kolar, Nada, Jasna und Ana, Vesna, Davor. Der Rechenschieber liegt in Sarajevo bei der Gerichtsmedizin. |
| **Offene Aufgabe** | Lanas Begräbnis um ihren Geburtstag, Zorans Identifizierung und Begräbnis, Malas Entscheidung |
| **Varianten** | Siehe 10.3 |

### 10.2 Kapitel 5 „Die erste Drei“ (Vorschlag, [N])

**Zeit und Ort:** Sarajevo, Donnerstag 1. März bis Montag 5. März 2012. Die Mitte ist **Samstag, der 3. März**: Lanas 36. Geburtstag, um 11:10.

**Der zentrale Konflikt**
- Lana wollte „selbst nach Hause kommen. Nicht als Nachricht.“ (`rooms/skela_l.js:233`)
- Ein Begräbnis ist genau das: eine Nachricht, eine Feier für die Lebenden.
- Kapitel 5 fragt, wie Lana selbst nach Hause kommen kann und was danach mit Mala wird.
- **Die persönliche Herausforderung:**
  - **Mala** muss eine Entscheidung treffen, die sie an ihr eigenes Wort gebunden hat.
  - **Marko** muss sie entscheiden lassen. Er muss ehrlich sagen, was er will, und darf sie nicht halten.

**Die Handlung in Grundzügen**
- **Donnerstag:**
  - Ankunft. Haus 7, der neunte Stock, Nada.
  - Jasna in Sarajevo zum ersten Mal seit 1992. Ružas Haus in Vratnik, unter dem Dach, das achtzehn Jahre bezahlt wurde.
  - Zorans Identifizierung in der Gerichtsmedizin: Jasna erkennt den Rechenschieber.
- **Freitag:**
  - **Ein eigener Fall in Sarajevo:** Der Totengräber, der 1993 die Namenlosen begrub, führte gegen die Vorschrift eine Liste mit Kleidung und Dingen („šiber u džepu“, „Rechenschieber in der Tasche“).
  - Die Liste hat nie jemand abgeholt. Sein Geist wartet in der Friedhofsverwaltung.
  - Marko und Mala bringen die Liste zu Kolars Institut. Andere Familien bekommen dadurch eine Spur.
  - Das ist ein menschlicher Konflikt mit eigenem Abschluss: Er hat sich geschämt, weil er gezählt und nicht geweint hat.
  - Es erweitert, was Marko kann: übersetzen für die Stillen, „Wir zählen“.
- **Freitag oder Samstag:** Lanas Begräbnis.
  - Nada und Zlata entscheiden zusammen. Zlata bringt einen Ableger vom Quittenbaum.
  - Vlado fährt Zlata im TAM nach Sarajevo. Hajra bringt Pita „für zwei“.
  - Ana bringt Nada die Straßenbahn-Zeichnung.
- **Samstag, 3. März, 11:10:**
  - Mala klopft im siebten Stock, zweimal kurz, einmal lang. Dort wohnt jetzt eine fremde Familie, und das Rätsel ist, wie Marko dort stehen darf.
  - Danach fahren Marko und Mala die Drei zur Endstation, wo Großmutter mit zwei Taschen wartete. Damir fährt „die alte“.
  - Die zwei Fahrscheine aus der Dose, „für die erste Drei nach dem Krieg. Wenn wir uns wiedersehen, passen sie zusammen“, passen zusammen.
- **Montag:** Zorans Begräbnis.
  - Marko füllt an der Brauerei die blauen Kanister vom Dachboden in Vratnik. Er war seit 1993 nicht dort.
  - Mit diesem Wasser schließt das Kapitel: „Ich bin zurückgekommen.“

**Die entscheidende Spielerleistung**
- Herausfinden, was „selbst nach Hause kommen“ für Lana heißt. Dafür gibt es Belege aus allen Kapiteln:
  - die Samstage;
  - die Dose;
  - das Zimmer, das Nada jeden Morgen lüftet (`97_k2_talk.js:213`);
  - Zlatas Herd;
  - die Zeichnungen.
- Daraus macht der Spieler die Schlussfahrt so, wie Lana sie gewollt hätte, gegen die Logistik eines Begräbnisses.
- **Abschlussrätsel als Zusammenspiel:**
  - Mala gibt die Dose her. Das kann sie nur, wenn sie losgelassen hat (Regel aus Kapitel 2).
  - Die Dose wird stofflich. Marko legt sie in Lanas Zimmer, wo Nada sie am Abend findet.
  - Nada liest „Za prvu trojku poslije rata“ und weiß, dass Lana selbst gekommen ist.
  - Das löst Nadas offene Ahnung, ohne dass sie den Geist sieht.

**Eine mögliche abschließende Lösung** (beide Wege geprüft)
- **Weg 1: Mala geht**, nach der Drei, an der Endstation. Marko begleitet sie bis an den Rand wie immer, und diesmal geht sie hinüber.
  - Was bleibt: Marko erinnert sich, also ist sie nicht leer (Zoras Regel).
  - Er schreibt „Die Stillen, Teil drei: Lana Delić“.
  - Am Montag trägt er das Wasser allein.
- **Weg 2: Mala bleibt**, frei, als Partnerin bei Markos Arbeit für die Stillen.
  - Der Kopf bleibt ein ehrlich ausgesprochener Preis.
  - Die Dose hat sie hergegeben. Sie bleibt, ohne festzuhalten.
- **Empfehlung: Weg 1, als Malas eigene Entscheidung.**
  - Die Reihe führt vom Warten zum Loslassen.
  - Lanas eigene Bedingung, das Begräbnis, ist erfüllt.
  - Gerdas Fall hat gezeigt, wie Bleiben festhalten kann.
  - Die Dose als letzter Geistergegenstand gibt dem Abschied ein Ritual, das im Spiel schon angelegt ist.
- **Weg 2 bleibt erzählerisch möglich.** Kapitel 4 bereitet beide vor:
  - die Abmachung der Ehrlichkeit;
  - Gerdas Entscheidung als Vorbild, nicht als Regel;
  - Jakov in Kapitel 1, der bleibt, „weil die Wege sich nicht von allein fegen“ (`rooms/sustipan.js:14`).
- **Die Zustimmungsfassungen** färben die letzten Gespräche, sie bestimmen das Ende nicht. Malas Entscheidung ist keine Belohnung für Spielerwahlen.

**Rückwärts geplant**

| Was bis zum Ende von Kapitel 4 vorbereitet sein muss | Erledigt durch |
|---|---|
| Jasna will nach Sarajevo, Nada und Jasna reden wieder. | Silvesternacht, Neujahrsanruf |
| Zoran ist zugeordnet, der Rechenschieber ist bekannt. | Kolars Anruf |
| Mala weiß, wie Bleiben aussehen kann, und hat ihre Entscheidung an das Begräbnis gebunden. | Gerda; Epilog |
| Marko kann ehrlich antworten. | Hackerbrücke |
| Die Dose ist im Spiel, Samstag 11:10 ist im Spiel. | Prolog (Klopfen), Tag 3 (Mala sieht in die Dose) |
| Kolars Institut ist Partner, nicht Kulisse. | Anruf, „Wir zählen“ |

**Was bewusst erst ins Finale gehört:**
- Malas Entscheidung;
- Nadas Wissen;
- Markos Gang zur Brauerei;
- Jasnas erster Schritt in Haus 7;
- die Frage, wohin Marko gehört.

### 10.3 Varianten

| Frühere Entscheidung | Woher | In Kapitel 4 | Ins Finale |
|---|---|---|---|
| Zustimmung a, b, c | `mala.c3end.consent` | Dialogfarben; c verlangt die Frage im Epilog (Pflichtszene in dieser Fassung). | Färbt die letzten Gespräche. |
| Probe ja oder nein | `mala.c3end.sample` | **Notwendige Handlungsvariante:** Bei nein gibt Marko die Probe in München ab (Tag 3). Bei ja ist die Zuordnung am 27.12. hoch, bei nein nur der Kandidat. | Kein Unterschied mehr: Im März ist Zoran in beiden Fassungen identifiziert. |
| Versprechen a, b, c (Gespräch 1) und Gespräch 2 | `mala.c3end.promise`, `talk2` | einzelne Zeilen | – |
| Zahl der Nachfragen und der übergangenen Fragen | `mala.c3end.asks`, `skips` | Ein Satz von Mala im Prolog („Du hast in Mostar oft gefragt“ oder „selten“). | – |
| Vater-Gespräch in Kapitel 2 | `mala.c2end.father` | Marko verweist in 8.2 auf Vratnik, sonst nicht. | – |
| Ana angerufen in Kapitel 2 | `mala.c2end.ana` | Ana: „Du hast im November angerufen. Aus Sarajevo. Das erste Mal seit Jahren.“ | – |
| Falscher Brief geschrieben | Kapitel 4 | Er bleibt im Notizbuch. Im Epilog wirft Marko ihn weg, oder er schickt ihn Carmela mit einer Erklärung (zwei Zeilen). | – |
| Davor angerufen | Kapitel 4 | Abkürzung in der Silvesternacht | Davor schickt eine SMS zum Begräbnis (eine Zeile). |
| Weg im Silvestergespräch | Kapitel 4 | Jasnas Epilogsatz („Ich hätte aussteigen können.“ ohne `z4_kurve`) | Jasnas erste Zeile in Sarajevo |

**Ohne Spielstand aus Kapitel 3** gelten Zustimmung b und Probe ja.

Alle zulässigen Ausgangszustände führen auf denselben Pflichtweg. Die Unterschiede liegen in einzelnen Szenen (Probe in München, die Frage im Epilog) und in Dialogfarben.

---

## 11. Kritische Prüfung

### 11.1 Kontinuität

| Prüfpunkt | Ergebnis |
|---|---|
| München und Weihnachten | wie angekündigt (`rooms/vermisst.js:90–96`, `96_k3_story.js:313–317`, `rooms/westbus.js:59`) |
| Name der Mutter | Jasna, wie im Hausbuch (`rooms/haustor.js:27`) |
| Markos Alter | 33, Geburtsjahr etwa 1978 [I]. Damit war er im April 1993 vierzehn, passend zu „Ich war fünfzehn“ im Herbst 1993. |
| Vater | Ingenieur, „Brücken berechnet“, Brauerei, Frühjahr 1993 [B]. Das Datum 19. April ist [N]. |
| „Mama und Ana waren schon in Deutschland“ | eingehalten: Abfahrt im Mai 1992 [N] |
| Ružas Art zu schonen | passt zu Kapitel 2: Sie hat Lanas Nachricht versteckt, „Für später. Wenn er stärker ist.“ (`rooms/kuca.js:20`). Kapitel 4 macht daraus eine Haltung, keinen neuen Fehler: Diesmal wollte Marko das Verschweigen. |
| Kopfschmerz | Die drei Aussagen des Spiels (1.8, Punkt 3) werden nicht geglättet, sondern zum Thema gemacht. |
| Malas Reichweite | Folge des Finales, einmal festgelegt (4.2) |
| Malas Deutsch | nicht widersprüchlich: Schuldeutsch ja, Bairisch nein |
| Lebende sehen Mala nicht | eingehalten; nur Katzen und Niko, nach der Regel aus Kapitel 1 |
| Geistergegenstände | Regel aus Kapitel 2 für die Kanne |
| Bekannte Widersprüche, nicht übernommen | Markos Wohnort 1992–94 (1.8, Punkt 2) wird nicht festgelegt. Die Uhrzeit-Widersprüche aus Kapitel 2 spielen keine Rolle. |
| Religion, Volkszugehörigkeit | wie bisher vermieden: keine Kirchen- oder Moscheeszenen, keine Zuordnung des Vaters oder der Opfer zu einer Seite. Die Bahnhofsmission erscheint als Einrichtung, nicht als Glaubensort. |

### 11.2 Fairness

- **Marko weiß, was der Spieler nicht weiß.**
  - Das ist die heikelste Stelle.
  - **Gegenmittel:**
    - Marko weicht sichtbar aus. Bei bestimmten Dingen sagt er „Nicht das.“: bei der Brauerei auf Kolars Akte, bei blauen Kanistern auf einem Foto bei Ana.
    - Der Spieler erfährt die Wahrheit als Mala schon am Tag 1, also früher als Marko sie ausspricht.
    - Das Geheimnis wird nicht gegen den Spieler eingesetzt. Kein Rätsel verlangt, etwas zu erraten, das nur Marko weiß.
  - Die Enthüllung auf der Hackerbrücke ist keine Überraschung, sondern eine Erleichterung.
- **Kein Spezialwissen nötig.**
  - Italienisch, Bairisch und Bosnisch übersetzt das Spiel, Marko versteht sie.
  - Was „nije se vratio“ 1993 bedeutete, erklärt Kolar im Spiel.
- **Keine Sackgassen.**
  - Jede Entscheidung führt zum Pflichtweg zurück: der falsche Brief, das Gespräch zu früh, die Fehlwege in der Silvesternacht.
  - Versuche im Heim lassen sich am nächsten Tag wiederholen.
- **Kein Pixelhunting.** Wichtige Dinge sind groß: die Mütze 17, die Pantoffeln, die Kiste, die Fotos.
- **Keine versteckten Pflichtgespräche.** Jedes Pflichtgespräch hat eine sichtbare Option oder eine Notiz, die dorthin zeigt.
- **Wissen in freier Reihenfolge.** Figuren reagieren nur auf das, was Marko weiß (Lehre aus E-03 und K3-06).
  - Jasna erkennt Sepp nur nach `s4_name`.
  - Ana gesteht nur nach Kolars Anruf.

### 11.3 Umsetzbarkeit in der vorhandenen Engine

| Bedarf | Vorhanden? | Anmerkung |
|---|---|---|
| Räume, Hotspots, Gespräche, Notizbuch mit Schlüssen, Notizen im Gespräch | ja | wie in Kapitel 3 |
| Erinnerungsbilder (auch Markos eigene) | ja | Kapitel 2 und 3 |
| Nachhall an Dingen, durch Deckel lesen | ja | Kapitel 2 (`rooms/antikvarijat.js:76`) |
| Kopfschmerz-Vignette bei ungefundenem Geist | ja | `06_ui.js:55–57` |
| Zwischenwelt mit eigenem Requisit | ja | zwei neue Requisiten: Bahnsteig 1962 und Depot |
| Geistergegenstand wird stofflich | ja | Kanne |
| Telefon mit Fremdsprache und Übersetzung | ja | wie die bosnischen Sätze in Kapitel 3 |
| **Mala reist allein über den Stadtplan** | **neu** | Die Engine verbietet ihr bisher den Ausgang allein (`05_engine.js:388`). Ab Kapitel 4 gibt es einen Kapitelschalter. |
| Getrennte Notizbücher (Malas Sicht) | teilweise | Kapitel 3 kennt „Malas Sicht“ in Notizen. Kapitel 4 braucht eine Sperre: Mala-Notizen erst nach dem Streit für Marko. |
| Warten bis zu einer Uhrzeit mit vorher gesetzten Bedingungen | teilweise | Warte-Optionen gibt es. Neu ist, dass Bedingungen über das Warten hinaus gelten. |
| Kind sieht Mala | neu, klein | eine Zeichnung von Mala in Nikos Blickrichtung, zwei Reaktionen |
| Feuerwerk, Schnee, Nacht | teils | Wetter und Nacht gibt es; Feuerwerk als Licht- und Klangeffekt ist neu. |
| Musik | neu | Weihnachtsstille, Bahnhof, Heim, Silvester |
| Hinweise, Stadtplan, Doppelklick | ja | wie bisher |
| Lehren aus den Klicktests | ja | Kein Overlay mit mehr als acht Zeilen, Knöpfe unter y = 168 (`game/tools/klicktests.js`) |

### 11.4 Neue Annahmen

| Annahme | notwendig oder freiwillig |
|---|---|
| Abfahrt von Jasna und Ana im Mai 1992 ohne Marko | notwendig |
| Marko an der Brauerei am 19. April 1993; die Kanister; „nije se vratio“ auf seine Bitte | notwendig |
| Zoran ohne Namen begraben, 2003 exhumiert, Rechenschieber „Z. V.“ | notwendig |
| Anas Probe von 2004 | notwendig. Ohne sie bräuchte es Jasnas Probe, und ihre Verweigerung wäre wieder das Schloss. |
| Jasna als Pflegehelferin im Haus am Bavariapark, mit Silvester-Gewohnheit | notwendig |
| Kolars Erklärung von „nije se vratio“ | notwendig |
| Mala reist allein, Schuldeutsch | notwendig |
| Sepp (Fall A), Gerda (Fall B) | notwendig |
| Der Vater ist kein Geist | notwendig (Entscheidung) |
| Hansi, Frau Huber, Niko sieht Mala, Davor fährt, Jasna erkennt Sepp, Nadas Vanilice, Samstagsklopfen, Pantoffeln | freiwillig, aber empfohlen |

Keine Annahme widerspricht dem Spiel. Wo das Spiel schweigt, ist es markiert.

### 11.5 Recherchefragen und Quellen

**Geprüft (Websuche, 6. November 2026)**
- **DNA-Abgleich:**
  - Blutproben von Angehörigen werden gegen Knochenprofile verglichen.
  - In der Regel braucht es mehr als einen Angehörigen. Eltern, Kinder und Geschwister sind am nützlichsten.
  - 2004 gab es eine EU-finanzierte Sammelaktion der ICMP für Angehörige in Europa, auch in Deutschland. Eine mobile Einheit besuchte Städte in sechs EU-Ländern.
  - Quellen: ICMP, „ICMP announces 3,000 DNA Reports for Bosnia and Herzegovina“ (icmp.int/es/?p=33039); ICMP, „Families of the Missing Give Blood Samples to Trace Relatives“ (icmp.int/uk/?p=409); JusticeInfo, „Bosnia: the search for missing persons“; ICMP-Pressemitteilung zum Besuch der Deutschen Botschaft in Tuzla.
- **Bestattungen als NN:** Sie kamen vor, auch weil Familien im Ausland keine Proben gaben. Quellen: RFE/RL (slobodnaevropa.org, „Mnoge bi žrtve zločina mogle ostati neidentifikovane“); N1 zu Bestattungen „NN“.
- **Brauerei in Sarajevo:** Sie war eine der großen Wasserstellen der Belagerung. Wartende wurden mehrfach getroffen; Daten und Opferzahlen weichen in den Quellen voneinander ab. Quellen: FAMA Collection, „Mapping a Besieged City – Brewery“; UPI-Archiv 1993; Atlas Obscura zur Sarajevska pivara.
- **Gleis 11:**
  - Zentrale Sammelstelle für ankommende Arbeitskräfte. Eine Weiterleitungsstelle des Landesarbeitsamts Südbayern lag im ehemaligen Luftschutzbunker darunter, bis zum Anwerbestopp 1973.
  - Heute: Theaterprojekt und Bildungsmaterial.
  - Quellen: t-online, „Gleis 11 am Münchner Hauptbahnhof – Schleuse für Gastarbeiter“; Haus der Bayerischen Geschichte, Unterrichtsmaterial „Gleis 11“; Münchenwiki „Gleis 11“.
- **Bahnhofsmission:** heute an Gleis 11, getragen von katholischem und evangelischem Verband. Quellen: sonntagsblatt.de; evangelisch.de.
- **ZOB München:** eröffnet am 11. September 2009 an der Hackerbrücke. Quellen: Wikipedia „Zentraler Omnibusbahnhof München“; muenchen.de.
- **Bestattung von Amts wegen:**
  - Die Städtischen Friedhöfe ordnen sie an, wenn sich niemand kümmert. Parallel suchen sie Angehörige.
  - Quellen: stadt.muenchen.de, „Bestattung von Amts wegen“; Ärzte Zeitung zu Amtsbestattungen.
- **Tram 19:** fährt über die Landsberger Straße zum Hauptbahnhof. Quellen: muenchen.de; Münchenwiki „Trambahnlinie 19“.
- **Bosnische Kriegsflüchtlinge in Deutschland:**
  - Rückführung ab 1996, Duldung, Fragen zu traumatisierten Flüchtlingen.
  - Quellen: Bundestags-Drucksachen 13/7111 und 13/7702; UNHCR-Mitteilung über presseportal.de; Max-Planck-Institut für ethnologische Forschung, Working Paper 87.
- **Jugoslawische Arbeitsmigration nach München:** Anwerbeabkommen von 1968, Bahnhofsviertel und Westend. Quellen: BLZ-Themenheft „Migration in München“; Abendzeitung.

**Adressen der Quellen**
- ICMP: https://icmp.int/es/?p=33039 · https://icmp.int/uk/?p=409 · https://icmp.int/press-releases/german-embassy-delegation-visits-icmp-tuzla/
- JusticeInfo: https://www.justiceinfo.net/en/316-bosnia-the-search-for-missing-persons.html
- RFE/RL: https://www.slobodnaevropa.org/a/mnoge-bi-zrtve-zlocina-mogle-ostati-neidentifikovane/27778931.html
- N1: https://n1info.ba/english/news/six-war-victims-to-be-buried-in-collective-funeral-including-two-unidentified-remains/
- Brauerei: https://famacollection.org/sarajevo-eng/ktmsa-4-2 · https://www.atlasobscura.com/articles/brewery-sarajevska-pivara-sarajevo-siege · https://www.upi.com/Archives/1993/01/15/Serb-shelling-kills-at-least-eight-in-Sarajevo/6052727074000/
- Gleis 11: https://www.t-online.de/nachrichten/deutschland/gesellschaft/id_51051562/gleis-11-am-muenchner-hauptbahnhof-schleuse-fuer-gastarbeiter.html · https://archiv.hdbg.de/gleis11/downloads/unterrricht/zu-stunde-02/Arbeitsauftraege_zum_Film_Gleis_11.pdf · https://www.muenchenwiki.de/wiki/Gleis_11_im_HBhf
- Bahnhofsmission: https://sonntagsblatt.de/artikel/kirche/das-schicksal-strandet-gleis-11 · https://www.evangelisch.de/inhalte/160365/27-09-2019/125-jahre-bahnhofsmission
- ZOB: https://en.wikipedia.org/wiki/Zentraler_Omnibusbahnhof_M%C3%BCnchen · https://www.muenchen.de/verkehr/zob-zentraler-omnibusbahnhof
- Bestattung von Amts wegen: https://stadt.muenchen.de/infos/bestattungvonamtswegen.html · https://www.aerztezeitung.de/Panorama/Zahl-der-Amtsbestattungen-steigt-294127.html
- Tram 19: https://www.muenchen.de/sehenswuerdigkeiten/sightseeing-muenchen-stadtrundfahrt-mit-der-linie-19 · https://www.muenchenwiki.de/wiki/Trambahnlinie_19
- Kriegsflüchtlinge: https://dserver.bundestag.de/btd/13/071/1307111.pdf · https://dserver.bundestag.de/btd/13/077/1307702.pdf · https://www.presseportal.de/pm/7910/143172 · https://www.eth.mpg.de/cms/en/publications/working_papers/wp0087
- Migration in München: https://www.blz.bayern.de/data/pdf/ep_themenheft-migration-in-munchen_web-0906-0959-12.pdf

**Noch offen** (vor der Umsetzung prüfen)
1. Wie lange dauerte 2011 der Weg von einer neuen Blutprobe bis zur Meldung einer Übereinstimmung? Ist eine hohe Zuordnung schon Ende Dezember plausibel? Wenn nicht: In der Fassung „ja“ meldet Kolar einen Kandidaten mit hoher Wahrscheinlichkeit, die Bestätigung kommt im Januar. Die Handlung ändert sich dadurch nicht.
2. Konnte man 2011 über das Generalkonsulat von Bosnien und Herzegowina in München eine Probe abgeben (Fassung „nein“)? Falls nicht, gibt Marko die Probe im Januar in Sarajevo ab. Die Handlung ändert sich nicht.
3. Konvois mit Frauen und Kindern aus Sarajevo im Mai 1992: Wege, Abfahrtsorte, kurzfristige Änderungen. Und wie kamen Flüchtlinge 1992 in München an?
4. Bleiberecht bosnischer Kriegsflüchtlinge in Bayern um 2000: Regelungen für Erwerbstätige und Traumatisierte, Zeitpunkte.
5. Bestattung von Amts wegen in München: Fristen, Aufbewahrung der Urne, Überführung ins Ausland.
6. Wo fuhren vor 2009 die Fernbusse nach Jugoslawien in München ab (Hansis Bude)?
7. Gab es Trambahnlinie 19 in den 1950er bis 80er Jahren schon? Sonst bekommt Alois eine andere Liniennummer.
8. Umgang mit Todesnachrichten bei Demenz in Heimen um 2011 (Validation oder „später“). Wie sah ein Schichtwechsel aus?
9. Neujahrsbräuche in Familien aus dem früheren Jugoslawien (Tannenbaum, Djed Mraz) in der Wortwahl prüfen.
10. Änderungen an Namen bei der Registrierung in der Weiterleitungsstelle sind plausibel, aber nicht belegt. Die Szene ist erfunden und wird so behandelt.

**Reale Geschichte und erfundene Schicksale**
- Real sind Orte und Zusammenhänge: Belagerung, Brauerei, Gleis 11, ICMP, Bestattung von Amts wegen.
- Alle Personen und ihr Leid sind erfunden. Das Leid ist nicht Dekoration eines Rätsels, sondern der Grund des Rätsels.

### 11.6 Lehren aus den Prüfberichten zu Kapitel 3

| Befund in Kapitel 3 | Wie Kapitel 4 ihn vermeidet |
|---|---|
| E-01 Vorwegnahme (Skela) | „Brauerei“, „19. April“, „Gleis 11“ und „Kanister“ nennt keine Figur, bevor der Spieler davon weiß. Marko weicht aus, statt zu verraten. |
| E-02 technischer Zwischenschritt | Die Versuche im Heim sind wiederholbar. Schlüsse haben zwei Wege (7.1, Schritt 7). |
| E-03 und K3-06 Wissen in freier Reihenfolge | Jede Reaktion hängt an einer Notiz oder einem Schalter (6.5, 6.6). |
| E-04 richtige Ideen abgewiesen | Gleichwertige Schlüsse werden angenommen (Bunker oder Koffer). |
| E-05 Szenen ohne Spieler | Das Silvestergespräch hat acht Züge mit Auswahl. Lange Erzählungen werden von Antworten des Spielers unterbrochen (Carmela, Kolar). |
| E-06 und K3-07 das Spiel denkt vor | Mala widerspricht mit Werten, nicht mit Wegen. Automatische Reaktionen nennen keine Orte. |
| E-07 und K3-05 Rüge trotz Zustimmung | Kein Rügesystem für Markos Familie. „Mala fragen“ bleibt für Malas eigene Geschichte, wenn Marko Ana oder Jasna von Lana erzählt. |
| E-11 Notizauswahl zu lang | höchstens vier Notizen pro Gesprächszug |
| P0 aus der zweiten Prüfung (Bedienung) | Overlays mit höchstens acht Zeilen, kein Stadtplan über einer Auswahl, Klicktests von Anfang an |
| K3-10 Fachdialoge | DNA-Aussagen nur nach Quellenlage (11.5), kein Erfolgsversprechen |

### 11.7 Schwächen, die ich im Entwurf schon behoben habe

| Erste Idee | Problem | Jetzt |
|---|---|---|
| Der Vater als Geist bei der Mutter oder an der Brauerei | Wiederholt Mates Fall (Vater wartet auf Sohn). Antworten kämen aus dem Jenseits statt von den Lebenden. | Kein Geist. Sein Fehlen ist eine Antwort (4.2). |
| Marko versteckte sich 1992 (frühere Planung) | Zweite Bus-Schuld mit neuen Namen | Abfahrt ohne Schuld des Kindes. Markos Last ist das Schweigen, nicht die Tat. |
| Die Mutter wusste es auch, gegenseitige Schonung wie bei Carmela | Fall A und Höhepunkt hätten dieselbe Auflösung. | Carmela wusste es. Jasna wusste es nicht. Ihre Hoffnung war echt, und das macht den Unterschied schwer. |
| Jasnas Probe als Schloss des Kapitels | Warten auf Zustimmung trägt kein Abenteuer. Ihr Nein würde zur Sperre. | Anas Probe von 2004 nimmt der Verweigerung die Macht. Die Frage wird zu: Wie kommt die Wahrheit an? |
| Mala versteht kein Deutsch | Im Spiel nicht belegt, Rilke-Zeile | Schuldeutsch ja, Bairisch und Italienisch nein |
| Mala schweigt ohne Grund | „künstliches Schweigen“ | Ihr Versprechen vom Freitag in Mostar ist der Grund. Das Schweigen wird Thema und Erfahrung für Marko. |
| Malas Selbstbild „Ich tue dir weh“ bestätigt | Das würde das Finale vorentscheiden. | Teilweise widerlegt, teilweise bestätigt (5.2) |
| Die Silvesternacht als Zwischensequenz | E-05 | Gespräch mit Zügen, Fehlwegen und Malas Einwürfen |
| Bleigießen mit Wachs | 2011 war Bleigießen noch üblich, das Verbot kam später. | Bleigießen ohne Kommentar; Tobias deutet die Formen falsch. |

### 11.8 Referenzen

Diesem Auftrag waren keine Komplettlösungen oder anderen Referenzen beigefügt. Handwerkliche Prinzipien wie gestufte Ermittlung, unterschiedliche Fähigkeiten, Dialogrätsel und Ruhephasen stammen aus der Arbeit an Kapitel 1 bis 3. Figuren, Dialoge und Rätselketten sind eigene.

### 11.9 Schlussfragen

1. **Ist Kapitel 4 für sich ein vollständiges, unterhaltsames Adventure mit eigenem Abschluss?**
   - Ja. Es hat einen eigenen Konflikt, das Schweigen einer Familie, mit einem Höhepunkt, der ihn löst.
   - Zwei Fälle schließen ab: Sepp ist zu Hause, Gerda am Depot.
   - Das Ende verändert die Lage dauerhaft. Heiligabend, Davors Balkon und die Kinder bringen Wärme und Humor.
2. **Entsteht seine Handlung nachvollziehbar aus dem Ende von Mostar?** Ja. Der Anruf, die Probe, „Woher?“, „Ich komme mit“, Fassung c, Davors Karte, Kolars „Wir rufen an“ und die Karte „Fortsetzung: München“ führen direkt hinein.
3. **Werden Marko und Mala durch spielbare Erfahrungen verändert?** Ja.
   - **Marko** erlebt Geschontwerden (Malas Schweigen) und zweimal die Wahrheit in der Sprache des anderen (Carmela, Alois), bevor er der Mutter etwas sagt.
   - **Mala** erlebt Gerda und ihr eigenes falsches Urteil über den Kopf.
   - Ihre Veränderung ist eine Abmachung, kein Monolog.
4. **Sind die Rätsel anspruchsvoll, mehrstufig, fair, und brauchen sie beide?** Ja.
   - Drei Ketten mit Annahme, Prüfung, gesicherter Erkenntnis und Handlung.
   - Jede braucht Malas Wahrnehmung und Markos Sprache.
5. **Werden wichtige Zusammenhänge geklärt, ohne das Finale abzuhandeln?** Ja.
   - Der Vater ist vollständig geklärt.
   - Lanas Begräbnis, Malas Entscheidung und Nadas Ahnung bleiben, mit Grund (9.3).
6. **Hat Kapitel 5 ein klares Ziel, genug Vorbereitung und eigene Handlung?** Ja.
   - Ziel: zwei Heimkehren und Malas Entscheidung.
   - Vorbereitet sind Dose, Samstag 11:10, Jasnas Rückkehr und Ehrlichkeit.
   - Eigene Handlung: der Totengräber, Lanas „selbst nach Hause“, die erste Drei.
7. **Kann die Geschichte nach genau fünf Kapiteln verdient enden?** Ja.
   - Kapitel 1 bis 3 klären Mala, Kapitel 4 klärt Markos Familie.
   - Kapitel 5 bringt beide Toten nach Hause und lässt Mala frei entscheiden.
   - Kein Faden braucht ein sechstes Kapitel.
