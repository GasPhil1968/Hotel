# MALA – Kapitel 1: Split
### Konzept für ein Point-and-Click-Adventure nach dem Vorbild der Blackwell-Reihe

> Arbeitstitel der Reihe: **MALA**. Kapitel 1: **„Split – Was das Meer behält“**.
> Weitere Kapitel (Sarajevo, Mostar, Dubrovnik …) sind vorbereitet, kommen hier aber nicht vor.
> Der spielbare Prototyp dieses Kapitels liegt im Ordner `web/` (siehe `README.md`).

---

## Inhalt

1. Analyse des Originalspiels „Twenty to Four“
2. Wie die Blackwell-Mechanik umgesetzt wird
3. Rahmen, Ton und Zeit
4. Die Geschichte des Kapitels
5. Figuren
6. Orte in Split
7. Die drei Geister-Fälle (Rätsel, Schritte, Lösungen)
8. Wie zwei bis drei Stunden Spielzeit entstehen
9. Malas Geheimnis – Andeutungen und offene Fragen

---

## 1. Analyse des Originalspiels „Twenty to Four“

Das beigelegte Spiel ist eine einzige HTML-Datei (rund 25.000 Zeilen JavaScript, keine einzige Bilddatei). Alles, was man sieht und hört, wird zur Laufzeit erzeugt.

**Grafik und Stil**
- Feste Auflösung **320 × 200** wie bei VGA-Adventures; die Szene ist 320 × 144 groß, darunter liegt eine 56 px hohe Bedienleiste. Gezeichnet wird ausschließlich in ganzzahligen Vielfachen und ohne Glättung (`image-rendering: pixelated`).
- **Indexierter Framebuffer** mit einer handverlesenen Palette (120 Farben), die in Farbrampen von dunkel nach hell organisiert ist. Licht und Schatten sind keine Transparenzen, sondern **Schritte auf diesen Rampen**; weiche Übergänge entstehen durch **geordnetes Bayer-Dithering**. Daraus ergibt sich der typische LucasArts/Wadjet-Eye-Look: satte Abendhimmel, warme Lampenkegel und körnige Dämmerung.
- Räume werden **prozedural gemalt**: Fluchtpunkt-Innenräume (Rückwand, Seitenwände, Boden mit Dielen), Texturfunktionen (Bretter, Ziegel, Kopfstein, Putz, Tapete), Himmel mit Wolkenbänken, animiertes Wasser mit Spiegelungen, Regen und Nebel als Overlay. Requisiten liegen als tiefensortierte Ebenen über dem Hintergrund, sodass Figuren hinter und vor Möbeln gehen können.
- Farb-**Lookup-Tabellen** (Mondlicht, Sepia, „Staub“) färben ganze Bildbereiche nach Helligkeit um, etwa für Nacht und Erinnerungen.
- **Figuren** bestehen aus handgepixelten Kopf- und Torso-Stempeln (Seite, vorne, hinten) und **Armen und Beinen mit fester Länge über inverse Kinematik**. Alle Animationen (Gehen in 8 Phasen, Greifen hoch/mittel/tief, Bücken, Lesen, Sitzen, Erschrecken, Reden) sind Posen-Listen, die jede Figur nutzen kann. Ein dunkler Umriss und ein Kontaktschatten lassen sie vor jedem Hintergrund lesbar bleiben.
- Schriften sind **eigene Bitmap-Fonts** (7 px Großbuchstaben mit Ober- und Unterlängen, dazu eine 3 × 5 px Mikroschrift für Schilder in der Szene).

**Engine-Logik**
- Eine **SCUMM-artige Verb-Engine**: Räume sind Datenobjekte mit `paint`, `layers`, einer Lauffläche `walk(x,y)`, Eingängen, Figuren und **Hotspots** (Rechteck, Standpunkt, Antworten je Verb, `with`-Tabelle für Gegenstände, Ausgänge, Sichtbarkeitsbedingung).
- **Wegfindung** per A\* auf einem 2-px-Raster mit anschließendem „String-Pulling“ für natürliche Laufwege.
- Skripte laufen als `async`-Funktionen über eine kleine API (`say`, `walk`, `anim`, `give`, `take`, `flag`, `choose`, `menuLoop` …); dadurch lesen sich Szenen wie ein Drehbuch.
- **Breite Räume scrollen** (640 px) mit weich nachziehender Kamera; Figuren werden je nach Raumtiefe skaliert und je nach Ort getönt.
- Zustand liegt in einem Spielstand-Objekt (Flags, Inventar, Raumzustände, gesehene Texte); **automatisches Speichern** bei jedem Raumwechsel, **drei Speicherplätze**, Kapitelwahl und eine „Was bisher geschah“-Rückblende beim Fortsetzen.

**Interface und Interaktion (iPad-Fassung)**
- Antippen eines Objekts öffnet ein **kleines Verb-Menü, das nur Verben zeigt, die wirklich etwas bewirken**. Die Engine probt dafür jede Verb-Antwort im Hintergrund „trocken“ und blendet reine Witzantworten aus. Personen bekommen „Rede mit“ und „Schau an“, und ein Ausgang wird mit Doppeltipp sofort betreten.
- **Inventar** in einer Reihe; Gegenstände werden mit dem Finger **auf das Ziel gezogen** (Objekt, Person oder ein anderer Gegenstand) oder über „Benutze“ und dann das Ziel benutzt.
- Knöpfe über dem Inventar: **Tipp** (Notizbuch mit gestuften Tipps), **Aufgaben** (Ziel, offene Spuren, Fortschrittsbalken), **Zeigen** (alle Hotspots blinken kurz auf) und **Menü**.
- **Beobachtungs-Effekt**: Bei wichtigen Funden zoomt das Bild sanft auf einen Kreis, wie eine Lupe.

**Dialogsystem**
- Im Gespräch erscheinen **Porträts links (Held) und rechts (Gegenüber)**, und wer spricht, bewegt den Mund. Die **Antwortmöglichkeiten stehen auf einem Notizblock** in der Mitte, und bereits gestellte Fragen werden grau. Dialoge sind Schleifen aus Optionen mit Bedingungen (`if`), Einmal-Optionen (`once`) und einem „Tschüss“.
- Erzählertext steht frei im Bild, Sprechtext farbig über der Figur auf abgedunkeltem Grund. Die Textgeschwindigkeit ist wählbar oder auf „wartet auf Tippen“ stellbar.

**Rätselmechaniken**
- Klassische Inventar-Rätsel (Gegenstand + Umgebung, Gegenstand + Gegenstand), Dialog-Rätsel (eine Person gibt erst nach dem richtigen Gegenstand oder der richtigen Frage nach), räumliche Rätsel (etwas verschieben, an etwas Hohes herankommen) und pro Kapitel ein „Escape-Room“. Ein Tipp-System in Stufen verhindert, dass man festsitzt.

**Audio**
- Jeder Klang wird **live mit WebAudio synthetisiert**: Geräuscheffekte aus gefiltertem Rauschen und Oszillatoren, **Klangteppiche pro Raum** (Meer, Regen, Wind, Menschenmenge, Brummen) und zufällig verteilte, **im Stereofeld platzierte Einzelgeräusche** (Möwen, Nebelhorn, Glocken, Autos). Die Schritte klingen je nach Boden anders (Holz, Stein, Fliesen, Teppich, Metall), dazu kommt ein kleiner datengetriebener Musik-Sequenzer mit eigenen Instrumenten.

**Was „Mala“ übernimmt und was nicht.** Übernommen werden der technische und ästhetische Ansatz: VGA-Auflösung, indexierte Palette mit Rampen und Dithering, prozedural gemalte Räume, ein Figuren-Rig mit IK, die Verb-Engine mit kontextsensitivem Tipp-Menü, Inventar zum Ziehen, „Zeigen“, Speicherplätze und synthetisierter Raumklang. Die gestuften Tipps des Originals übernimmt „Mala“ bewusst nicht: Das Spiel verrät nie, was als Nächstes zu tun ist. Die Gespräche folgen dagegen der Blackwell-Reihe: großes gemaltes Brustbild, Satz im Kasten daneben. Engine, Palette, Schrift, Figuren, Räume, Musik und Texte sind für „Mala“ **komplett neu geschrieben**. Kein Asset, keine Figur und keine Zeile Inhalt stammt aus „Twenty to Four“, und der Ton ist bewusst ein anderer: ernst statt Noir-Komödie.

---

## 2. Wie die Blackwell-Mechanik umgesetzt wird

### 2.1 Zwei Figuren, ein Band
- Gesteuert wird meist **Marko**. Erst wenn Marko die Stimme zum ersten Mal zulässt (im Hafenbüro, Fall 1), erscheint unten links ein Porträt-Knopf. Ein Tipp darauf **wechselt zu Mala**, ein zweiter zurück. Bis dahin ist Mala nur eine Stimme, die er überhört (siehe 2.6b). Wechsel sind danach an fast allen Orten möglich, außer in einigen Szenen, in denen Mala bewusst fehlt, und in der Zwischenwelt.
- **Mala ist an Marko gebunden.** Wenn Marko einen Ort verlässt, kommt sie mit. Allein kann sie keine normalen Ausgänge nehmen („Ohne ihn komme ich nicht weit.“), wohl aber **Geisterwege**: durch Wände, verschlossene Türen und eingestürzte Treppen in angrenzende Räume, die Marko nicht betreten kann (Archiv, Schuppen, Hinterzimmer, Kühlraum, das Obergeschoss der Ledana).
- Wechselt man zu Marko zurück, während Mala in einem solchen Nebenraum steht, springt die Kamera zu ihm, und Mala bleibt dort, bis man sie zurückholt oder Marko geht.

### 2.2 Wer kann was?

| Fähigkeit | Marko (lebend) | Mala (Geist) |
|---|---|---|
| Mit lebenden Menschen sprechen | ja | nein. Sie kann nur **lauschen**, wenn Menschen miteinander, am Telefon oder vor sich hin reden |
| Mit Geistern sprechen | ja, sobald Mala ihn auf sie aufmerksam gemacht hat | ja, oft vertrauter („von Geist zu Geist“) |
| Gegenstände nehmen, benutzen, kombinieren, geben | ja | nein. Sie hat nur ihre **Blechdose**, und die gibt sie nicht her |
| Türen öffnen, schieben, suchen, Dokumente lesen | ja | nein |
| Durch Wände und Türen gehen | nein | ja |
| Unsichtbares sehen (Geistersicht) | nein | ja: alte Gräber, übermalte Kreidebilder, Dinge hinter Mauern |
| Erinnerungen spüren (**Nachhall**) | nein | ja. An manchen Orten und Dingen sieht sie kurze Bruchstücke der Vergangenheit |
| Geister finden | nur als Kopfschmerz und Druck | ja: „Du kannst mit ihnen reden. Ich kann sie finden.“ |
| Geister hinüberbringen | nein | ja, aber erst, wenn der Geist selbst losgelassen hat (Verb **Hinüberbringen**) |

Mala kann außerdem Gegenstände **ansehen, die Marko ihr zeigt** (Gegenstand auf Mala ziehen). So liest sie zum Beispiel verwaschene Worte in einem Brief aus dessen Nachhall.

### 2.3 Geistersicht
Beim Wechsel zu Mala wird das Bild über eine eigene Farbtabelle in kalte, entsättigte Blau-Cyan-Töne umgefärbt. Danach erscheinen **Geisterebenen**: die Grabsteine des eingeebneten Friedhofs Sustipan, Kinderzeichnungen unter der Farbe im Hotelsalon und ein Papier hinter einem lockeren Ziegel. Gegenstände mit **Nachhall** schimmern leicht. Auch der Klang ändert sich: Die Welt wird dumpf (Tiefpass), und darunter liegt ein leiser, kalter Ton.

### 2.3a Wie die Geister diese Welt verlassen: Leine, Leugnen, Erkennen, Hinüber
- **Die Leine.** Wer nicht weiterkommt, ist irgendwo festgemacht, wie ein Boot an einem Poller. In Malas Sicht läuft von jedem Geist ein dünner Faden aus Licht zu dem Ort oder Ding, an dem er hängt. Ivka ist an den Poller am Ende der Mole gebunden, Luka an die Kühlraumtür, hinter der sein Versprechen liegt, Bruno an die Portiersglocke auf dem Tresen. Marko sieht die Leinen nicht. Mala erklärt sie einmal, wenn Marko fragt: „Wer nicht weiterkommt, hält sich an etwas fest. An einem Ort, einem Ding, einem Versprechen. Wenn er loslässt, bringe ich ihn hinüber.“
- **Leugnen.** Die Geister wissen zu Beginn nicht, dass sie tot sind, oder sie übergehen es. Ivka spürt den Wind nicht mehr („Das macht das Alter“) und erklärt ihre eigene Todesanzeige zur Anzeige einer Nachbarin. Luka hält die Ruine für „immer schon kaputt“ und die Leute, die durch ihn hindurchsehen, für komisch. Bruno besteht auf seinem Dienst, „das Palma ist immer offen“, und glaubt, es sei Dezember 1993. Wer es ihnen direkt sagt („Sie sind gestorben“), wird nicht gehört.
- **Erkennen.** Erst ganz am Ende jedes Falls merken sie es selbst, plötzlich und an einem Ding, das sie berühren oder sehen: Ivka will die Handschuhe ihres Sohnes nehmen, und sie fallen ihr durch die Finger. Luka hört seine eigene Stimme vom Band und sieht Nina, zwölf Jahre älter. Bruno hört seine Tochter nach 36 Jahren spielen und sieht, dass ihr Haar grau ist.
- **Loslassen und Hinüber.** Mit dem Erkennen löst sich die Leine. Dann ist Mala dran: Das Spiel wechselt zu ihr, und der Spieler öffnet mit **Hinüberbringen** die **Schwelle**, ein warmes, aufrechtes Licht an einem Ort, der zum Geist gehört (das Ende der Mole, die Rampe, an der die Nachtfähre ablegt, die Salontür, die Bruno ein letztes Mal aufhält).
- **Die Zwischenwelt.** Mala nimmt Marko mit: „Nimm meine Hand. Du wirst sie nicht spüren. Nimm sie trotzdem.“ Das Bild wird weiß, und die drei stehen auf schwebenden Platten aus hellem Kalkstein in einer schwarzen Leere voller Sternenstaub. Links steht ein steinernes Tor, in dem blass der Ort zu sehen ist, von dem sie gekommen sind. In der Mitte leuchtet das Licht. Auf den Platten liegt ein Stück des Ortes, an dem der Geist hing: Ivkas Poller, drei Stufen von Lukas Treppe, Brunos Tresen mit der Glocke. Hier spielt man **Marko**, und der Geist geht erst, wenn Marko das Letzte getan hat:
  - **Ivka** spürt zum ersten Mal seit Jahren die Kälte an den Händen. Marko gibt ihr die Handschuhe, die in der Welt durch ihre Finger gefallen sind. Hier kann sie sie halten.
  - **Luka** will nicht ohne Ticket fahren. Marko gibt ihm die beiden Tickets aus dem Koffer. Eins nimmt er mit, das andere soll Marko Nina geben: „Sie soll selbst entscheiden, ob sie fährt.“
  - **Bruno** kann nicht gehen, solange niemand ihn ablöst. Die Ablösung kommt um sieben und läutet die Glocke. Marko läutet sie.

  Danach geht der Geist ins Licht. Mala bleibt am Rand („Noch nicht.“), und Marko kehrt durch das Tor zurück.
- **Malas eigene Leine.** Auch von Mala läuft ein Faden, schwach, schräg nach oben, und er verliert sich immer im Osten. Sie kommentiert ihn nie. Fragt Marko, woran sie festgemacht ist, sagt sie nur: „An etwas, das ich nicht loslassen will.“

### 2.4 Das Notizbuch: Hinweise sammeln, verbinden, ansprechen
- Was Marko und Mala erfahren, landet als kurzer Satz im **Notizbuch**, etwa „Die Fähre fiel am 22.12.1984 wegen der Bura aus.“
- **Karten wie in Blackwell und Ace Attorney:** Jeder offene Hinweis ist eine Karte mit Bild (das Gesicht der Person aus ihrem Porträt oder der Gegenstand) und einem Titel aus wenigen Wörtern, acht Karten je Seite. Unten steht der ganze Satz der angetippten Karte. **Eine Karte auf eine andere ziehen** verbindet sie; eine Schlussfolgerung bekommt einen grünen Rand und rückt nach vorn.
- **Konsequent ausdünnen:** Was überholt ist (der fehlende Band nach dem Fund, das Boot um sieben nach der ANKICA-Schlussfolgerung, die Teile von Dinkos Geschichte, nachdem er sie erzählt hat), verschwindet aus den Karten. So liegen selten mehr als zehn Karten offen.
- **Reiter:** *Hinweise* (der laufende Fall), *Mala* (was sie betrifft) und *Tagebuch*, in dem alles noch einmal in ganzen Sätzen steht, neueste zuerst. Im Gespräch liegen die Karten zur Person, mit der Marko redet, vorn.
- **Zwei Notizen verbinden:** Passen sie zusammen, entsteht eine **Schlussfolgerung** wie „Tonći hat nicht auf die Fähre gewartet – er kam mit der ANKICA.“ Passen sie nicht, sagt Marko nur: „Das hängt nicht zusammen.“ Das ist das Herzstück der Blackwell-Rätsel.
- **Im Gespräch fragen:** Jede Unterhaltung hat die Option „Nach etwas aus dem Notizbuch fragen …“. Wer die richtige Notiz anspricht, öffnet neue Antworten. Dialogoptionen hängen also direkt davon ab, was man schon weiß.
- **Konfrontationen:** Am Ende jedes Falls muss der Geist begreifen, was geschehen ist. Im Finale wählt man nacheinander die passenden Notizen oder Gegenstände. Eine falsche Wahl beunruhigt den Geist, er wiederholt sich oder wendet sich kurz ab, und man versucht es noch einmal. Niemand sagt dabei, was richtig wäre. **Es gibt kein Game Over.**

### 2.5 Inventar
Eine Reihe mit sieben Feldern, Ziehen auf ein Ziel oder „Benutze“ und dann das Ziel, wie im Original. Viele Gegenstände tragen Erinnerung: eine Postkarte, ein Foto auf einem Fischerboot, ein Paar graue Handschuhe, zwei nie benutzte Fährtickets, eine Kassette, eine Klavierschule mit Kinderschrift. Kombinationen ergeben sich aus der Situation, zum Beispiel:
- Stricknadel aus Ivkas Nähkorb + verknoteter Schuhkarton
- Džezva + Spüle + Herd, um einen vom Salz verbackenen Brief über Dampf zu öffnen (oder Sanja hält ihn an ihre Espressomaschine)
- Radio + Batterien + Kassette, Brecheisen + klemmende Kühlraumtür, Brecheisen + Schutthaufen, Spachtel + lockerer Ziegel, Kurbel + Grammofon

Manche Gegenstände wirken erst in der Zwischenwelt, wie die Handschuhe oder Lukas Tickets.

### 2.6 Keine Lenkung, wenige Hilfen
- **Das Spiel verrät nicht, was als Nächstes zu tun ist oder wohin man gehen muss.** Es gibt keine Ziel-Anzeige, keine Spurenliste und keine Tipps. Marko und Mala sprechen Beobachtungen und Gefühle aus, keine Anweisungen. Orte erscheinen auf dem Stadtplan, wenn jemand von ihnen erzählt hat.
- **Notizen:** Karten mit Bild und Titel, Tagebuch mit ganzen Sätzen (siehe 2.4).
- **Zeigen:** Alle Hotspots blinken einige Sekunden lang auf.
- **Menü:** Speichern und Laden (drei Plätze), Textgeschwindigkeit, Musik, Geräusche, Röhrenbild-Effekt, Anleitung.

### 2.6b Die Stimme und der Kopfschmerz
Marko nimmt Mala nicht einfach an. Er überhört sie, und das kostet ihn etwas.
- **Die Stimme:** Vom Ende des Prologs bis in die Mitte von Fall 1 ist Mala für Marko nur eine Stimme und ein Flimmern in der Luft. Ihre Sätze stehen kalt und leicht zitternd oben im Bild, ohne Porträt und ohne Körper. Klickt man das Flimmern an, heißt es „Schimmer“, und Marko weigert sich: „Ich rede nicht mit Lichtflecken.“
- **Kopfschmerz als Preis:** Jeder Satz, den er überhört, verstärkt den Kopfschmerz: einen pochenden, dunklen Rand am Bild und ein feines Pfeifen.
- **Andere Zeichen:**
  - Auf der beschlagenen Fensterscheibe ist eine Straßenbahn mit einer Drei gemalt.
  - Das Foto im Regal liegt mit dem Bild nach oben.
  - Seine Uhr steht genau auf sieben.
  - Die Katze in Varoš sieht hinter ihn.
  - Sein Atem dampft, Ivkas nicht.

  Marko erklärt alles weg: Tinnitus, Jugo, zu wenig Schlaf.
- **Der Übergang:** Im Hafenbüro fehlt der Band von 1984, und die Stimme bietet an nachzusehen. Sie drängt weiter, wenn er schweigt. Erst wenn der Spieler Marko antworten lässt, leise, damit Mladen nichts hört („Wenn du da bist, dann sieh nach.“), ist der Kopfschmerz schlagartig weg. Mala wird sichtbar, nennt ihren Namen, und der Wechsel-Knopf erscheint. Marko nennt es eine Probe, keine Annahme: „Und wenn da nichts ist, bist du der Jugo.“
- **Dunkle Orte:** Im Kühlraum der Ledana sieht Marko nur, was im Lichtkeil der Tür oder in Malas kaltem Schein liegt. Ohne sie ist er blind.

### 2.6a Gespräche
Wie in den Blackwell-Spielen erscheint bei jeder gesprochenen Zeile ein gemaltes Brustbild der Figur oben links oder oben rechts (je nachdem, wo sie im Bild steht), daneben der Satz in einem schwarzen Kasten mit hellem Rand, in der Farbe der Figur. Die Antwortmöglichkeiten stehen als Liste im unteren Bildbereich. Geister haben einfarbige Porträts mit kaltem Schein: Mala blau-türkis, die anderen fahl-lavendel. In Markos Sicht ist auch Malas Gestalt einfarbig kalt, durchscheinend, mit einem schimmernden Rand und aufsteigenden Lichtpunkten; sie berührt den Boden nicht ganz.

### 2.8 Leben in der Stadt
Nebenfiguren stehen nicht bloß herum, sie tun etwas, und ab und zu wechseln sie die Tätigkeit:
- **Zdenka** strickt vor ihrer Tür, sieht die Gasse hinauf, steht auf und reckt sich.
- **Mladen** löst Kreuzworträtsel, stempelt, holt etwas aus dem Regal und trinkt Tee.
- **Dinko** flickt Netze, sieht aufs Wasser, steht auf und rollt eine Leine auf.
- **Sanja** poliert Gläser, wischt den Tresen und holt eine Flasche.
- **Stipe und Frane** spielen Briškula, knallen Karten auf den Tisch und trinken.
- **Nina** rahmt, misst und holt Leisten. **Mira** liest im Kiosk und sortiert. **Ljerka** blättert in Papieren und stempelt.

Auch die Geister wiederholen, was sie immer getan haben: Ivka geht ein paar Schritte auf der Mole, sieht mit der Hand über den Augen aufs Meer und reibt sich die Hände, ohne es zu merken. Luka sieht beim Spielen zum Hafen. Bruno poliert die Glocke. Jakov fegt den Weg ab. Spricht man jemanden an, hält er inne. Während Szenen ruht alles.

### 2.7 Zeit
Das Kapitel spielt an fünf Tagen. Die Tageszeit (Tag, Dämmerung, Nacht, Morgengrauen) wird von der Geschichte weitergeschaltet, nicht von einer Uhr. Jeder Ort hat vier Lichtstimmungen: Bei Nacht wird umgefärbt, und Fenster, Laternen und Schiffslichter leuchten auf. Manche Menschen und Geister sind nur zu bestimmten Zeiten da: Ivka am Abend auf der Mole, Bruno in der Nacht in der Portiersloge.

---

## 3. Rahmen, Ton und Zeit

- **Ort:** ausschließlich Split und die unmittelbare Umgebung.
- **Zeit:** Dienstag, 15., bis Samstag, 19. November 2011. Erst Jugo mit warmem Regen, dann klare, kalte Bura, am Ende wieder Regen.
- **Ton:** ernst, zurückhaltend, melancholisch. Keine Erotik, kein Flirt, kein Humor auf Kosten der Toten oder der Kriegserfahrungen. Nähe entsteht durch Vertrauen, Schweigen und gemeinsames Aushalten. Trockene Selbstironie Markos ist erlaubt, Spott nicht.
- **Klang als Erzählmittel:** Wellen, Fährenhörner, die Glocken von Sveti Duje, die kleine Glocke von Sveti Nikola, Möwen, Tassen, Kartenspieler, Vespas, Radio. Mala hält bei Fährenhörnern inne und zuckt bei Kirchenglocken zusammen, und bei den großen Glocken auf dem Peristil verschwindet sie kurz.
- **Sprache:** Deutsch, mit kroatischen und bosnischen Einsprengseln (Grüße, Namen, kurze Sätze, immer verständlich aus dem Zusammenhang) – wie in einem gut synchronisierten Film.

---

## 4. Die Geschichte des Kapitels

### Prolog – „Die Stillen“ (Dienstag, Nachmittag, Regen)
Marko Vuković, freier Übersetzer, schläft über einer italienischen Bedienungsanleitung ein. Auf dem Anrufbeantworter liegt eine Nachricht von Vesna Kralj, Redakteurin beim Lokalblatt *Glas Rive*: Für die Rubrik „Die Stillen“ – kurze Texte über Menschen, die allein gestorben sind – soll er bis morgen 2.000 Zeichen über **Ivka Perić** schreiben, 85, Veli Varoš, keine bekannten Verwandten. Die Wohnung wird am Freitag geräumt, und die Nachbarin Zdenka hat den Schlüssel.

Marko kocht sich in seiner Džezva einen bosnischen Kaffee (Bedienungs-Tutorial) und geht hinauf nach Veli Varoš. Zdenka Bašić sitzt vor ihrer Tür und mustert ihn: Siebenundzwanzig Jahre habe niemand nach Ivka gefragt, und jetzt komme die Zeitung. Sie erzählt, dass Ivka jeden Abend um sieben zur Riva ging. Seit 1984, seit „der Junge“ nicht nach Hause kam.

In Ivkas Wohnung spürt Marko zum ersten Mal etwas sehr Deutliches: Druck hinter den Augen, Stimmenfetzen, das Gefühl, nicht allein zu sein. Ein Stuhl steht am Fenster mit Blick auf die Mole, zwei Tassen auf dem Tisch, eine davon nie benutzt. Den Schuhkarton hält ein rotes Band mit einem harten, alten Knoten zu. Marko will es nicht zerschneiden und lockert es mit einer Stricknadel aus Ivkas Nähkorb. Darin liegen Briefe ihres Sohnes **Tonći** von der Insel Brač. Auf der letzten Postkarte steht: „Ich komme am 22. mit dem Boot um sieben. Dinko kommt mit.“ Ein Foto zeigt zwei junge Männer auf einem Fischerboot namens ANKICA. Das alte Radio schaltet sich von selbst ein: Rauschen und dann eine Bura-Warnung aus einem anderen Jahrzehnt. Marko nimmt Postkarte und Foto mit und schreibt am Abend den Text. Die Wahl seines ersten Satzes erscheint später gedruckt in der Zeitung.

Mala kündigt sich leise an, und Marko wehrt jedes Zeichen ab. In Veli Varoš steht für einen Augenblick ein Mädchen oben an der Kirchentreppe und ist fort, als er genauer hinsieht. In der Nacht ist das Fenster offen, obwohl er es zugemacht hat. Als er es schließt, steht in der dunklen Scheibe, hinter seinem eigenen Spiegelbild, ein Mädchen in Kleidung aus den frühen Neunzigern. Es sagt nur drei Sätze: „Es gibt Leute, die nicht weiterkommen. Du kannst mit ihnen reden. Ich kann sie finden.“ Ein Fährenhorn tutet; als Marko sich umdreht, ist niemand da. Er macht Licht und erklärt es sich: zu wenig Schlaf, zu viel Kaffee, zu viele Nachrufe. Am Morgen ist das Fenster zu („Der Riegel ist alt“), und er nennt es einen Traum.

### Erster Fall – „Das Boot um sieben“ (Mittwoch, Abend bis Nacht)
Marko erwacht am späten Nachmittag mit Kopfschmerzen. Auf der beschlagenen Scheibe hat jemand eine Straßenbahn mit einer Drei gemalt, und das Foto im Regal liegt mit dem Bild nach oben. Eine Stimme sagt: „Das war kein Traum.“ Marko schiebt es auf den Kühlschrank, der manchmal so brummt, dass man Wörter hört.

Am Abend steht am Ende der Mole eine alte Frau in einem schwarzen Mantel. Marko kennt den Mantel; er hing gestern an Ivkas Garderobe. „Nein. In Split tragen viele alte Frauen schwarze Mäntel.“ Kopfschmerz, Druck, dann eine Stimme hinter ihm: „Du siehst sie also auch.“ Er dreht sich nicht um, oder er fragt „Wer ist da?“ und sieht nur die Riva, oder er summt laut das Lied seiner Großmutter, und die Stimme sagt: „Das kenne ich.“ Er nennt es Tinnitus und geht zu der alten Frau, um zu beweisen, dass sie lebt. Ivka wartet auf das Siebenuhrboot aus Supetar; für sie ist es der 22. Dezember 1984. Ihr Atem dampft nicht in der Kälte, seiner schon. „Ich sehe schlecht im Dunkeln.“

Bis ins Hafenbüro bleibt Mala eine Stimme, die Marko überhört, und jedes Überhören tut weh. Erst als der Band von 1984 fehlt und die Stimme anbietet nachzusehen, lässt er sie zu, leise, als Probe. Der Kopfschmerz ist sofort weg, zum ersten Mal seit drei Tagen. Jetzt sieht er sie, und sie nennt sich Mala. „Das ist kein Name. So sagt man zu kleinen Mädchen.“ – „Es reicht.“ Den ganzen ersten Fall über will Marko sie trotzdem nicht annehmen. Er sieht nicht hin, wenn er sie ansehen soll, und nennt sie eine Einbildung. Doch was sie ihm sagt, stimmt: Der verschwundene Band steht im Archiv tatsächlich bei „1948“ („Zufall.“), und als Dinko Tonćis letzte Worte hört, die niemand außer ihm kennen kann, sagt Marko leise: „Das konnte ich nicht wissen.“ – „Nein.“ Erst auf der Bank an der Riva, nachdem er mit Ivka in der Zwischenwelt war, gibt er nach: „Ich glaube nicht an Geister.“ – „Musst du nicht.“ – „…Und das Schlimmste ist: Es war richtig so.“

Marko und Mala setzen die Nacht zusammen. Im Hafenbüro steht das alte Fahrtenbuch falsch einsortiert; nur Mala findet es, nur der Beamte kann es holen. Darin steht, dass die Fähre wegen der Bura ausfiel und das Fischerboot ANKICA vor Sustipan kenterte. Gerettet wurde Dinko Matić, vermisst ist Antonio Perić. Dinko flickt bis heute seine Netze an der Matejuška. Er schweigt, bis Mala in seinem verschlossenen Schuppen Tonćis alten Seesack findet und im Nachhall Tonćis letzte Worte hört: „Halt die Tasche! Sie ist für Mama!“ Als Marko ihm diese Worte sagt, bricht Dinko nach 27 Jahren sein Schweigen. Im Seesack liegen ein Brief und ein Paar graue Wollhandschuhe. Das Salz hat die Seiten des Briefs zusammengebacken. Trocken bekommt Marko ihn nicht auf, ohne dass er reißt. Zu Hause hält er ihn über den Dampf der Džezva, oder Sanja hält ihn an das Dampfrohr ihrer Espressomaschine. Dann ist der Brief offen, aber verwaschen. Die fehlenden Worte liest Mala aus seinem Nachhall: „Warte nicht mehr an der Mole auf mich. Warte zu Hause, im Warmen.“

Am Ende der Nacht hört Ivka die Wahrheit in der richtigen Reihenfolge: Die Fähre fuhr nicht, Tonći kam trotzdem, mit Dinkos Boot. Dann liest Marko ihr den Brief vor und gibt ihr die Handschuhe. Sie fallen ihr durch die Finger, und daran merkt sie, dass sie nicht mehr lebt. Marko hebt sie auf. Mala öffnet die Schwelle und nimmt Marko mit in die Zwischenwelt. Dort friert Ivka zum ersten Mal seit siebenundzwanzig Jahren an den Händen, und Marko gibt ihr die Handschuhe noch einmal. Diesmal kann sie sie halten. „Sie sind warm.“ Aus dem Licht ruft jemand „Mama!“, und sie geht hinein.

### Zwischenspiel – Die Bank an der Riva (Nacht, die Bura frischt auf)
Ein langes, ruhiges Gespräch. Mala fragt, warum Marko in Split geblieben ist und warum er nicht nach Sarajevo zurückgeht. Marko weicht aus, antwortet knapp oder schweigt. Was der Spieler wählt, verändert Malas Erwiderungen und wie offen Marko in späteren Gesprächen ist. Auf die Frage nach ihrer Blechdose sagt sie nur: „Meins.“ Zum Schluss: „Bei der alten Eisfabrik ist noch einer. Er ist unruhig.“

### Zweiter Fall – „Das letzte Schiff nach Ancona“ (Donnerstag, Tag bis Nacht)
In Markos Stammbar „Bura“ liegt die Zeitung mit seinem Text, und die Kartenspieler reden über den Abriss der alten **Ledana**. „Da ist doch damals der Junge gestorben, '99.“ Hinter dem Bauzaun liegt die halb verfallene Eisfabrik. Oben, auf der Empore mit der eingestürzten Treppe, sitzt **Luka Radić** mit seiner Gitarre am kaputten Fenster und sieht zu den Fähren. Für ihn ist es der 23. August 1999. Um halb neun will er Nina am Kiosk treffen, um neun geht die Nachtfähre nach Ancona.

Sanja, die Wirtin, kannte beide und rückt erst heraus, als Marko etwas Greifbares hat. Luka wurde drei Tage später gefunden, am Fuß der Treppe. Nina ist nie weggegangen; sie hat einen kleinen Rahmenladen in der Altstadt. Dort ist Nina höflich und verschlossen, und wer zu früh nach Luka fragt, wird hinauskomplimentiert. Im Hinterzimmer sieht Mala, was niemand sehen soll: Bilder vom Hafen bei Nacht, immer mit einer wartenden Gestalt am Kiosk, und ein gerahmtes Fährticket von 1999, nie entwertet. Mira vom Kiosk am Fährterminal erinnert sich an das Mädchen, das bis zum Morgen auf der Bank saß, und an den Jungen, der am Vormittag strahlend zwei Tickets kaufte.

In der Ledana liegt im „Briefkasten“ der beiden, hinter einem lockeren Ziegel an der Rampe, noch Ninas Zettel vom Morgen danach: „Ich habe bis zum letzten Schiff gewartet. Ich bin nicht wütend. Morgen bin ich wieder da.“ Im Kühlraum, den nur Dinkos Brecheisen öffnet, liegen in Lukas Gitarrenkoffer zwei Tickets und eine Kassette: „Za Ninu“. Als Luka den Zettel hört und Mala ihn sanft auf die Treppe blicken lässt, versteht er. Er bittet Marko, Nina die Kassette vorzuspielen. Abspielen kann man sie nur auf Ivkas altem Radiorekorder, den Zdenka Marko zum Dank für den Zeitungstext schenkt. Batterien gibt es bei Mira.

Um neun legt die Fähre nach Ancona ab. Nina steht an der Rampe der Ledana und drückt auf „Play“. Lukas Stimme sagt: „Nina. Wenn du das hörst, sind wir schon auf dem Schiff …“ Dann kommt die Gitarre. Luka sieht sie an, sie sieht ihn nicht. Er geht den Lichtern der Fähre nach und verblasst. „Zwölf Jahre dachte ich, er ist einfach nicht gekommen.“ – „Er war auf dem Weg.“

### Zwischenspiel – Sustipan (späte Nacht)
Im Park auf dem ehemaligen Friedhof sieht nur Mala die alten Gräber. Der Geist des alten Totengräbers Jakov fegt Wege, die es nicht mehr gibt, und grüßt Mala wie eine Bekannte. Marko erzählt zum ersten Mal von Sarajevo: von der Straßenbahn Linie 3, vom Kaffee der Großmutter. Mala ergänzt ein Detail, das sie nicht wissen kann. Marko fragt: „Hast du jemanden, der auf dich wartet?“ – „Ich glaube, ich habe auf jemanden gewartet. Ich weiß nicht mehr, ob er gekommen ist.“

### Dritter Fall – „Der Nachtportier“ (Freitag, Abend bis Morgengrauen)
Ljerka Lalić, Besitzerin des verblassten **Hotel Palma** am Wasser, braucht Übersetzungen alter Dokumente. Das Haus soll am Montag verkauft werden. Unter den Papieren liegt das Nachtbuch ihres Vaters **Bruno**, 32 Jahre lang Nachtportier. Nachts klingelt die Portiersglocke von selbst. Bruno sitzt wieder in seiner Loge, höflich wie immer. Seit seinem Schlaganfall 1993 fehlen ihm die Worte. Er spricht in Bruchstücken aus Kroatisch, Italienisch und Deutsch.

Marko, der Übersetzer, und Mala, die Brunos Bruchstücke als Bilder sieht, setzen Erinnerung um Erinnerung zusammen. Sie finden den Mantel an Haken 13 mit dem Salonschlüssel, die Grammofonkurbel unter dem Telefonbuch, das Tanzfoto von Bruno und Danica, die Schellackplatte „Večer na Rivi“ und Ljerkas Kinder-Klavierschule. Jedes Stück gibt Bruno Worte zurück. Im Klavierhocker des seit 1993 verschlossenen Salons liegt die **Zusage der Musikakademie Zagreb für Ljerka, datiert Juni 1975**. Bruno hat sie in der Woche nach dem Tod seiner Frau versteckt, aus Angst, mit dem Hotel allein zu bleiben, und dann nie die Kraft gefunden, es zu sagen.

Bruno bringt seine Botschaft nur noch als Wortsalat in drei Sprachen heraus. Marko muss sie **übersetzen**: In einem Satzbau-Rätsel ordnet er die Teile, und Bruno schüttelt den Kopf, wo etwas nicht stimmt. Um zwei Uhr nachts klopft Marko an Ljerkas Tür. Sie liest, schweigt, steigt hinauf in den Salon und setzt sich nach 36 Jahren wieder ans Klavier. Bruno steht an der Tür, richtet seine Uniform, verbeugt sich wie vor einem Gast und verblasst.

Im selben Hotel kommt Mala ihrer Vergangenheit zu nah. Bruno erkennt sie („Mala! Trideset i jedan … du bist zurückgekommen.“). In seinem Nachtbuch steht „Die Kleine aus 31 wartet wieder auf der Treppe“, und im Flüchtlingsregister von 1993 ist Zimmer 31 durch Wasser fast unleserlich: „…ić, L., 17, Sarajevo. Ankunft: 28.11.1993. Abreise: –“. Mala sagt: „Du verwechselst mich.“ Dann ist sie fort.

### Epilog – „Die Straße nach Osten“ (Samstag, Morgengrauen)
Marko geht im ersten Licht zum Busbahnhof am Fährhafen. Mala ist nicht da, und der Wechsel-Knopf bleibt leer. Am Bahnsteig wartet der Bus Split – Mostar – Sarajevo, 7:00 Uhr. Mit Ljerkas Honorar kauft Marko eine Fahrkarte, nur hin. Auf der Bank sitzt Mala. „Du fährst also.“ – „Ich weiß nicht, ob ich fahre. Ich weiß nur, dass ich nicht mehr warten will.“ Sie sagt, sie sei schon einmal hier gewesen, im Winter, und habe auf einen Bus gewartet, „auf einen, der nach Hause fährt“. Der Bus fährt los. Als Marko aus dem Fenster sieht, öffnet Mala zum ersten Mal ihre Dose. Der Spieler sieht kurz hinein: ein Straßenbahnticket aus Sarajevo und ein halbes Foto mit einem gestreiften Ärmel und einem Stück Straßenbahn. Dann schließt sie die Dose wieder. *Ende des ersten Kapitels.*

### Die Entwicklung zwischen Marko und Mala
| Abschnitt | Marko | Mala |
|---|---|---|
| Prolog | sieht sie nur als Schimmer (Kirchentreppe, Spiegelung im Fenster) und erklärt sie weg: Traum, Schlafmangel | sagt nur ihre drei Sätze, zeigt sich kaum |
| Fall 1, erste Hälfte | überhört die Stimme, dreht sich nicht um, summt, nennt es Tinnitus; der Kopfschmerz wird mit jedem Satz stärker | ist nur Stimme und Flimmern, bleibt in seiner Nähe, kann warten |
| Fall 1, Hafenbüro | lässt sie zum ersten Mal zu, als Probe, damit sie nachsieht; der Kopfschmerz ist weg | wird sichtbar, nennt ihren Namen: „Mala. – Es reicht.“ |
| Fall 1, zweite Hälfte | lehnt sie weiter ab, sieht nicht hin, nennt alles Zufall; die Risse kommen mit dem Archiv und mit Dinko | hilft, ohne zu erklären, und drängt nicht; Ivka fragt sie „Wo ist deine Mutter?“, sie schweigt |
| Zwischenspiel 1 | nimmt sie widerwillig an, nachdem er in der Zwischenwelt war („Ich glaube nicht an Geister.“ – „Musst du nicht.“) | stellt Fragen, beantwortet keine |
| Fall 2 | beginnt, ihr zu vertrauen; fragt nach | zeigt Mitgefühl für Luka („Ich weiß, wie es ist zu warten.“) |
| Zwischenspiel 2 | erzählt von Sarajevo | verrät sich durch ein Detail; erste eigene Verletzlichkeit |
| Fall 3 | stellt sie zur Rede | wird erkannt, weicht aus, verschwindet |
| Epilog | entscheidet sich, nicht mehr zu warten | kehrt zurück; öffnet die Dose, wenn er nicht hinsieht |

---

## 5. Figuren

### 5.1 Marko Vuković (33)
- **Herkunft:** 1978 in Sarajevo geboren. Kindheit in einem Hochhausviertel, die Großmutter wohnte in der Altstadt nahe der Straßenbahnlinie 3. Während der Belagerung (1992–1996) war er Jugendlicher. Teile der Familie flohen, andere blieben oder starben. Er kam 1994 allein nach Split und blieb.
- **Heute:** freier Übersetzer (Deutsch, Italienisch, Englisch), dazu gelegentlich kurze Texte für *Glas Rive*. Kleine, unordentliche Wohnung in einer Gasse hinter der Riva, Fenster zum Hafen. Auf dem Schreibtisch liegen Übersetzungsaufträge (eine 48-seitige Espressomaschinen-Anleitung), Kaffeetassen und ein voller Aschenbecher.
- **Gewohnheiten:** trinkt viel Kaffee, gekocht in der Džezva seiner Großmutter, dem einzigen Gegenstand aus Sarajevo, den er benutzt. Raucht, wenn er nicht schlafen kann. Sitzt morgens in der Bar „Bura“ immer am selben Tisch. Wenige enge Kontakte: Vesna, Sanja, ein paar Kartenspieler.
- **Aus Sarajevo:** ein Karton auf dem Schrank mit „SARAJEVO“ in Filzstift, den er nie geöffnet hat. Dazu ein Foto, das umgedreht im Regal liegt: ein Junge im gestreiften Pullover mit seiner Großmutter vor einer Straßenbahn der Linie 3.
- **Die Gabe:** Bisher waren es nur Kopfschmerzen, Schlaflosigkeit und das Gefühl, beobachtet zu werden. Er hat sie nie akzeptiert. Im Spiel zeigt sich das als pochende Vignette am Bildrand und ein feines Pfeifen, wenn ein Geist nah ist.
- **Sprechweise:** wenig Worte, präzise wie ein Übersetzer, trockene Selbstironie, höflich zu Alten, abweisend bei Fragen nach dem Krieg. Er sagt nie „Belagerung“, sondern „damals“.
- **Entwicklung:** von „Das ist ein Kontaktfehler“ über widerwillige Mitarbeit zu stiller Verantwortung. Am Ende kauft er eine Fahrkarte nach Sarajevo, weil er gesehen hat, was Warten aus Menschen macht.

### 5.2 Mala
- **Erscheinung:** wirkt wie 17 oder 18. Übergroße Jeansjacke mit geflicktem Ärmel, ein handgestrickter grauer Schal, Jeans, weiße Leinenturnschuhe, dunkles Haar in einem lockeren Zopf. Durchscheinend, mit einem kalten Schimmer an den Rändern. Wenn man sie spielt, sieht man die Welt durch ihre Augen: kalt und still.
- **Verhalten:** ruhig, direkt, manchmal scharf. Keine Witze über den Tod. Sie stellt Fragen über Markos Leben, beantwortet aber fast nichts über sich. Sie erinnert sich nicht an alles, oder sie will es nicht.
- **Reaktionen:** Bei **Fährenhörnern** hält sie inne und sieht aufs Meer. Bei **Kirchenglocken** zuckt sie zusammen und schließt die Augen. Bei den großen Glocken von Sveti Duje verschwindet sie für einen Moment, und auf Nachfrage sagt sie nur: „Zu laut.“
- **Die Blechdose:** eine verbeulte Konservendose mit verblasstem Aufdruck, wie aus einer Hilfslieferung. Sie trägt sie immer bei sich, kommentiert sie nie und gibt sie nicht her. Wenn man Mala spielt, liegt die Dose als einziger Gegenstand im Inventar. „Schau an“ ergibt nur Schweigen oder „Nicht.“
- **Was sie verrät, ohne es zu sagen:** dass sie Sarajevo kennt (Straßenbahn, Kohleöfen im Winter) und den Karton auf Markos Schrank („Du hast ihn nie aufgemacht.“). Ein toter Totengräber grüßt sie wie eine alte Bekannte, ein toter Nachtportier erkennt sie mit Namen und Zimmernummer. Den Rest erzählt Kapitel 9 dieses Dokuments.

### 5.3 Lebende Nebenfiguren
| Figur | Alter | Ort | Rolle |
|---|---|---|---|
| **Vesna Kralj** | 52 | nur am Telefon | Redakteurin *Glas Rive*, knapp und herzlich; gibt die Aufträge |
| **Zdenka Bašić** | 78 | Veli Varoš | Ivkas Nachbarin, schwarze Kleidung, Katze Mrki; scharfe Zunge, weiches Herz; hat den Schlüssel, schenkt später das Radio |
| **Mladen Šimić** | 63 | Hafenbüro | Beamter seit 1975, müde, korrekt, erinnert sich an die „Weihnachtsbura von '84“ |
| **Dinko Matić** | 46 | Matejuška | Fischer, Tonćis bester Freund, Überlebender des Unglücks; trägt seit 27 Jahren Schuld und einen Seesack |
| **Sanja Lozić** | 32 | Bar „Bura“ | Wirtin, Markos „Wie immer?“, war Ninas Freundin; schützt sie |
| **Stipe & Frane** | 70+ | Bar „Bura“ | Kartenspieler (Briškula), Gerüchte, Stadtgedächtnis |
| **Nina Barić** | 31 | Rahmenwerkstatt „Okvir“, Altstadt | Lukas Freundin; malt seit zwölf Jahren dieselbe Fähre |
| **Mira** | 61 | Kiosk am Fährterminal | seit 1990 am Kiosk; Zeugin der Nacht im August 1999; verkauft Batterien |
| **Ljerka Lalić** | 56 | Hotel Palma | Besitzerin, Brunos Tochter; stolz, müde, verkauft das Haus |

### 5.4 Geister
| Geist | Gestorben | Ort | Woran er festhält |
|---|---|---|---|
| **Ivka Perić** | 2011, mit 85 | Ende der Mole an der Riva | am Warten auf das Siebenuhrboot vom 22.12.1984 |
| **Luka Radić** | 23.8.1999, mit 20 | Empore der Ledana | am Treffen mit Nina vor der Nachtfähre nach Ancona |
| **Bruno Lalić** | Februar 1994, mit 66 | Portiersloge, Hotel Palma | an einem Satz, den er seiner Tochter nie gesagt hat |
| **Jakov** (Nebenfigur) | 1959 | Sustipan | an Gräbern, die es nicht mehr gibt |

---

## 6. Orte in Split

Alle Orte erreicht man über **Markos Stadtplan** (wie eine auf dem Tisch ausgebreitete Karte), der sich mit der Geschichte füllt.

| # | Ort | Atmosphäre & Klang | Interaktionen und Hinweise |
|---|---|---|---|
| 1 | **Markos Wohnung** (Gasse hinter der Riva) | Regen am Fenster, Fährenhörner, Kühlschrankbrummen, nachts Stille | Anrufbeantworter (Aufträge), Džezva/Spüle/Herd (Kaffee-Tutorial), Schreibtisch/Laptop (Text schreiben, Übersetzungen), umgedrehtes Foto, Karton „SARAJEVO“, Fenster zum Hafen, Bett (Nachtszene) |
| 2 | **Veli Varoš** (Gasse am Marjan-Hang) | Steinstufen, Wäscheleinen, Katzen, die kleine Glocke von Sveti Nikola, Radio aus einem Fenster | Zdenka (Schlüssel, Ivkas Gewohnheiten, Dinko, Radio), Ivkas grüne Tür, Kirchlein Sv. Nikola (Schutzpatron der Seeleute) |
| 3 | **Ivkas Wohnung** | Staub im Licht durch Fensterläden, Uhrticken, Radiorauschen | Stuhl am Fenster, zwei Tassen, Schuhkarton mit Briefen (Postkarte), Fotos (ANKICA), Radio (Bura-Warnung), Kalender mit einer „7“ an jedem Tag, schwarzer Mantel |
| 4 | **Riva & Mole** (breit, scrollend) | Palmen, Bänke, Wellen an der Kaimauer, Möwen, Fähren, Glocken von Sveti Duje | Ivkas Geist am Ende der Mole, Bank (Zwischenspiel), Fähre aus Supetar, Eingang Hafenbüro |
| 5 | **Hafenbüro** | Funkgerät knistert, Neonröhre, Uhr | Mladen, Fahrpläne, alte Schiffsfotos, Tür „ARHIVA – SAMO OSOBLJE“ |
| 6 | **Archiv** (nur Mala) | kalt, Staub, Papier | Regale nach Jahrgängen, der Band 1984 falsch bei „1948“ |
| 7 | **Matejuška** (Fischerhafen, breit) | Tauknarren, tuckernde Motoren, Netze, Laterne | Dinko, sein verschlossener Schuppen, Boote, der Bauzaun der Ledana mit Loch hinter Fischkisten |
| 8 | **Dinkos Schuppen** (nur Mala) | Teer, Netze, Kerzenstummel | Tonćis Seesack „T.P.“ (Nachhall der Sturmnacht), Foto mit Kerze |
| 9 | **Die alte Ledana** (verfallene Eisfabrik) | Wind pfeift durch Scheiben, Tropfen, Tauben | eingestürzte Treppe, Empore mit Luka (nur Mala), Kühlraum (Brecheisen), Rampe zum Meer mit „Briefkasten“-Ziegel (Spachtel) |
| 10 | **Kühlraum** (Mala zuerst) | Eisenhaken, Dunkelheit | Gitarrenkoffer: zwei Tickets, Kassette „Za Ninu“ |
| 11 | **Bar „Bura“** | Espressomaschine, Tassen, Karten auf Holz, Fußball im Radio | Sanja, Stipe & Frane (Gerüchte über die Ledana), Zeitung mit Markos Text, Markos Stammtisch |
| 12 | **Altstadt – Peristil** | Säulen, Tauben, Hall auf Stein, die großen Glocken | Glockenturm (Mala verschwindet kurz), Gasse zu Ninas Laden, Zeitungsstand, Stadtführerin ohne Touristen |
| 13 | **Ninas Werkstatt „Okvir“** | Glasschneider, Leim, Radio leise | Nina, Rahmen, Bilder vom Hafen, Spachtel kaufen, Tür „Privat“ |
| 14 | **Hinterzimmer** (nur Mala) | Terpentin, Leinwände | Bilder der Wartenden, gerahmtes, nie entwertetes Ticket von 1999, Skizze von Luka |
| 15 | **Hotel Palma – Halle** | Regen, stehende Standuhr, Neonsummen, nachts die Glocke | Ljerka, Portiersloge (Bruno), Schlüsselfächer, Garderobenhaken 1–20, Tanzfoto, Büro mit Flüchtlingsregister, Treppe zum Salon |
| 16 | **Hotel Palma – Salon** (verschlossen) | Staubtücher, Regen auf dem Oberlicht, Grammofon-Knistern | Flügel, Klavierhocker, Grammofon, Kreidezeichnungen der Flüchtlingskinder (nur Geistersicht) |
| 17 | **Sustipan** (Park auf dem alten Friedhof) | Wind in den Pinien, offenes Meer, ferne Glocke | Pavillon, Gedenktafel „Denen, die das Meer behielt“, Jakov, die unsichtbaren Gräber (Geistersicht) |
| 18 | **Fährterminal & Busbahnhof** | Motoren im Leerlauf, Lautsprechergong, Möwen, Busse | Mira am Kiosk (Batterien, Zeugin), Bänke, Nachtfähre nach Ancona, Bus nach Sarajevo, Fahrkartenschalter |
| 19 | **Die Zwischenwelt** (nur beim Hinübergehen) | Stille, ein heller Ton, Wind ohne Wind | schwebende Kalksteinplatten in schwarzer Leere, steinernes Tor zurück, das Licht; je Geist ein Bruchstück seines Ortes (Poller, Treppenstufen, Tresen mit Glocke) |

Die Ledana, Ivkas Wohnung, das Hotel Palma und Sustipan sind erfundene oder verfremdete Orte; Riva, Matejuška, Veli Varoš, Peristil und Fährhafen sind der Topografie von Split nachempfunden.

---

## 7. Die drei Geister-Fälle

Legende: **[M]** = Marko, **[G]** = Mala (Geist), **[M+G]** = Zusammenarbeit.

### Fall 1 – „Das Boot um sieben“ (Ivka Perić)

**Was wirklich geschah:** Tonći Perić, 22, Steinmetzlehrling auf Brač, hatte seiner Mutter versprochen, am 22. Dezember 1984 mit dem Siebenuhrboot nach Hause zu kommen. Er brachte ihr graue Wollhandschuhe mit, weil sie bei jedem Wetter ohne Handschuhe an der Mole auf ihn wartete. Die Fähre fiel wegen der Bura aus. Tonći wollte sein Versprechen trotzdem halten. Mit seinem Freund Dinko nahm er das Fischerboot von Dinkos Vater, die ANKICA. Vor Sustipan setzte der Motor aus, und das Boot kenterte. Tonći drückte Dinko den Seesack in die Hand – „Halt die Tasche! Sie ist für Mama!“ – und wurde von der See weggezogen. Dinko wurde im Morgengrauen gerettet. Er ging zweimal bis zu Ivkas Tür. Beim zweiten Mal öffnete sie und sagte: „Tonći kommt mit dem Boot um sieben.“ Er ging und kam nie wieder. Ivka wartete 27 Jahre lang jeden Abend an der Mole, und nach ihrem Tod wartete sie weiter.

**Schritte und Rätsel**
1. **[M] Ivkas Wohnung (Prolog):** Den Knoten am Schuhkarton mit der Stricknadel aus dem Nähkorb lösen. Postkarte im Schuhkarton (Datum, „Boot um sieben“, „Dinko kommt mit“, „Ich bringe dir etwas mit“) und das Foto mit der ANKICA mitnehmen. Notizen: *Boot um sieben*, *Dinko*, *ANKICA*.
2. **[M] Ivka auf der Mole:** Sie fragt nach dem Boot und hält den 22.12.1984 für heute. Sie friert nicht („Heute spüre ich nicht einmal den Wind. Das macht das Alter.“), und ihre Todesanzeige an der Tür in Varoš hält sie für die einer Nachbarin. Sagt Marko ihr, dass sie gestorben ist, schickt sie ihn nach Hause („Sie haben getrunken.“). Sie bittet ihn, im Hafenbüro nachzufragen. **[G]** Mala sieht ihre Leine: einen Faden aus Licht bis zum Poller.
3. **[G] Nachhall an Ivkas Poller:** Mala sieht in schnellen Bildern dieselbe Frau, Jahr für Jahr älter, an derselben Stelle.
4. **[M] Hafenbüro:** Mladen sucht erst, wenn Marko das genaue Datum nennt (Postkarte vorzeigen oder die Notiz ansprechen). Er findet den Band 1984 nicht.
4a. **[M+G] Der Übergang:** Die Stimme bietet an nachzusehen und drängt, solange Marko schweigt. Das Archiv ist abgeschlossen, und Mladen geht nicht noch einmal hinein. Spricht man das Flimmern an, kann Marko weiter schweigen (der Kopfschmerz bleibt) oder leise sagen: „Wenn du da bist, dann sieh nach.“ Dann wird Mala sichtbar, nennt ihren Namen, und man kann zu ihr wechseln.
5. **[G] Archiv:** Mala geht durch die Tür „SAMO OSOBLJE“ und findet den Band 1984 im Regal bei 1948, mit vertauschten Ziffern. Sie kann ihn nicht herausziehen.
6. **[M] Mladen** den richtigen Platz sagen. Er holt den Band und liest vor: Die Fähre fiel aus, die ANKICA kenterte um 21:40 vor Sustipan, gerettet wurde D. Matić, vermisst ist A. Perić. Dabei erwähnt er: „Der Dinko flickt heute noch Netze an der Matejuška.“ Die Matejuška erscheint auf der Karte.
7. **Notizen verbinden:** *Tonći wollte mit dem Boot um sieben kommen* + *Die Fähre fiel aus* → **„Tonći wartete nicht auf die Fähre – er kam mit der ANKICA.“**
8. **[M] Zdenka (Abend):** Dinko war 27 Jahre lang nie bei Ivka, und auf der Beerdigung stand er an der Friedhofsmauer. Ivka trug nie Handschuhe: „Damit spüre ich nicht, wann die Bura kommt.“
9. **[M] Dinko an der Matejuška:** Er ist abweisend. Zeigt Marko das Foto, wird er weicher („Er war wie ein Bruder“), schweigt aber über die Nacht.
10. **[G] Dinkos Schuppen:** Mala geht durch die verschlossene Tür. Am Seesack „T.P.“ sieht sie im Nachhall die Sturmnacht und hört Tonćis letzte Worte. An der Wand hängt Tonćis Foto mit Kerzenstummel („Jedes Jahr am 22. Dezember“).
11. **[M] Dinko konfrontieren:** Mit der Notiz *Tonćis letzte Worte* bricht er sein Schweigen. Er erzählt alles und gibt Marko den Seesack. Darin liegen der **verwaschene Brief** und die **Handschuhe** in Zeitungspapier von 1984. Ab jetzt sagt Dinko: „Wenn du was brauchst, ich bin hier.“ Das bereitet Fall 2 vor.
12. **[M] Den Brief öffnen:** Das Salz hat die Seiten verbacken. Trocken reißt er. Zu Hause Džezva + Spüle + Herd, dann den Brief in den Dampf halten. Oder Sanja den Brief geben, die ihn an ihre Espressomaschine hält.
12a. **[M+G] Den Brief lesen:** Marko kann nur Bruchstücke entziffern. Er zieht den Brief auf Mala, und sie liest die verwaschenen Worte aus dem Nachhall der schreibenden Hand. Marko übersetzt: „Warte nicht mehr an der Mole auf mich. Warte zu Hause, im Warmen. Ich komme.“
13. *(optional)* **[M] Sustipan:** Auf der Gedenktafel steht Tonćis Name. **[G]** Jakov erzählt: „Jedes Jahr kommt ein Mann und steht hier.“ Dinko darauf angesprochen: „Das war ich. Zehn Jahre danach.“
14. **Finale an der Mole (Konfrontation):** Ivka wartet. In vier Runden wählt Marko:
    - *„Die Fähre fuhr an diesem Abend nicht.“* → „Dann kommt er mit der ersten morgen früh.“
    - *Schlussfolgerung ANKICA* → „Mit Matićs kleinem Boot? Bei der Bura? … Und Dinko?“ – „Dinko hat es geschafft.“ – „… und Tonći nicht.“
    - Den **Brief vorlesen** → „Zu Hause. Im Warmen. Und wenn er dann hier ankommt, und niemand ist da?“
    - Die **Handschuhe** geben → „Grau. Er wusste doch, dass ich nie welche trage.“ Sie greift danach, und die Handschuhe fallen ihr durch die Finger auf die Steine.

    Falsche Wahl: Ivka wiederholt ihre Frage, wendet sich kurz ab oder wird unruhig. Dann versucht man es noch einmal.
15. **Erkennen:** „Ich kann sie nicht halten. Warum kann ich sie nicht halten?“ Sie erinnert sich: krank am Fenster, kurz die Augen zugemacht, und dann trotzdem gegangen, wie jeden Abend. „Die Anzeige an meiner Tür. Das war ich.“ – „Siebenundzwanzig Jahre habe ich auf ihn gewartet. Und eine Woche, ohne es zu merken. … Er kommt nicht mehr. Und ich muss nicht mehr kommen.“ Die Leine löst sich vom Poller. Ivka erkennt Mala: „Du bist ja auch eine von uns.“
16. **[G] Hinüber:** Das Spiel wechselt zu Mala. Marko hebt die Handschuhe auf. Mit **Hinüberbringen** öffnet Mala die Schwelle am Ende der Mole. „Ist es kalt da drüben?“ – „Nein.“ Ivka will, dass der junge Mann mitkommt, „er hat mir den Brief vorgelesen“. Mala nimmt Marko an der Hand.
17. **[M] Zwischenwelt:** Ivka friert an den Händen. Marko kann mit ihr reden („Was sehen Sie im Licht?“, „Soll ich Zdenka etwas ausrichten?“) und gibt ihr die **Handschuhe**. Hier kann sie sie halten. Aus dem Licht ruft es „Mama!“, und sie geht. Durch das steinerne Tor zurück zur Riva.

**Zusammenarbeit im Überblick:** Mala findet, was hinter Türen liegt (Archiv, Schuppen) und liest, was das Wasser gelöscht hat. Marko bringt Lebende zum Reden (Mladen, Zdenka, Dinko) und trägt, was Mala nicht tragen kann (Seesack, Handschuhe, Brief).

### Fall 2 – „Das letzte Schiff nach Ancona“ (Luka Radić)

**Was wirklich geschah:** Luka (20) und Nina (19) wollten am 23. August 1999 mit der Nachtfähre um 21:00 nach Ancona, weg von Ninas Vater, hin zu einer Kunstschule in Venedig. Am Vormittag kaufte Luka zwei Tickets. Er versteckte sie zusammen mit einer Kassette, auf der ein Lied für Nina war, in seinem Gitarrenkoffer im Kühlraum der Ledana, ihrem Treffpunkt. Am Abend wollte er die Gitarre holen. Die morsche Treppe zur Empore brach, und er stürzte. Nina wartete am Kiosk, bis die Fähre weg war, dann bis zum Morgen auf der Bank. Am Morgen legte sie einen Zettel in ihren „Briefkasten“ hinter dem lockeren Ziegel an der Rampe. Drei Tage später fand man Luka. Nina blieb in Split und malte seitdem dieselbe Fähre. Luka blieb auf der Empore und wartete auf halb neun.

**Schritte und Rätsel**
1. **[M] Bar „Bura“ (Morgen):** Die Zeitung mit Markos Text liegt auf dem Tresen (**Zeitung**). Stipe und Frane reden über den Abriss der Ledana am Montag und „den Jungen von '99“. Sanja wird einsilbig.
2. **[M] Dinko:** Wer ihn nach Werkzeug fragt, bekommt das **Brecheisen** und eine Warnung: „Pass auf die Treppe auf. Die ist morsch.“
3. **[G→M] Bauzaun:** Mala geht durch den Zaun und findet das lose Feld hinter den Fischkisten, aber den Draht kann sie nicht lösen. **[M]** schiebt die Kisten weg und kriecht durch.
4. **[G] Empore:** Nur Mala kommt hinauf. Sie findet Luka, danach sieht ihn auch Marko von unten. Luka ist misstrauisch („Hat dich Ninas Vater geschickt?“) und wird bei Mala ruhiger („Bist du auch auf der Flucht?“ – „Nicht mehr.“). Er leugnet alles, was nicht passt: Die Ledana „war immer schon kaputt“, und die Leute, die durch ihn hindurchsehen, sind eben komisch. Seine Leine läuft vom Geländer bis zur Kühlraumtür. Notizen: *Treffpunkt Kiosk 20:30*, *Nachtfähre 21:00*, *Gitarre im Kühlraum*, *Für Luka ist es der 23.08.1999*, *der „Briefkasten“*.
5. **[G] Kühlraum:** Mala geht durch die verrostete Tür. Für sie ist es nicht dunkel. Unter dem Schutthaufen glimmt etwas: „Darunter liegt ein Koffer.“
6. **[M] Kühlraum öffnen:** Brecheisen an der Tür. Drinnen ist es stockdunkel. Marko sieht nur, was im Lichtkeil der Tür oder in Malas Schein liegt. Ohne Malas Hinweis stochert er sinnlos im Schutt. Mit ihm hebelt er die Brocken mit dem Brecheisen beiseite und findet den Gitarrenkoffer. Darin liegen **zwei Tickets** (gekauft am 23.08.1999 um 10:14) und die **Kassette**. Die Gitarre mit gebrochenem Hals bleibt liegen. **[G]** Am offenen Koffer sieht Mala im Nachhall, wie Luka am Morgen alles einsteckte: „Za Ninu.“
7. **[G] Briefkasten:** Mit Geistersicht sieht Mala ein gefaltetes Papier hinter dem Ziegel. **[M]** Mit dem Brecheisen ginge die halbe Wand mit, also braucht er etwas Dünnes.
8. **[M] Sanja:** Hat Marko etwas Greifbares (Tickets oder Notizen von Luka), erzählt sie: Luka spielte an der Riva Gitarre, Nina hörte immer zu, und man fand ihn drei Tage später an der Treppe. Nina ist geblieben und hat den Laden „Okvir“ in der Altstadt. „Lass sie in Ruhe, Marko.“ Wer behauptet, Luka „warte“ noch, verärgert sie und muss später wiederkommen.
9. **[M] Altstadt:** Die Mittagsglocken läuten, und Mala verschwindet für einen Moment. „Zu laut.“
10. **[M] Nina (erster Besuch):** Höflich, verschlossen. Marko kauft einen alten **Spachtel** für 20 Kuna. Fragt er zu früh nach Luka, beendet sie das Gespräch, bis Marko etwas mitbringt.
11. **[G] Hinterzimmer:** Bilder vom nächtlichen Hafen mit einer wartenden Gestalt, eine Skizze von Luka und ein **gerahmtes, nie entwertetes Ticket**. Der Nachhall zeigt Nina am Kiosk und später auf der Bank bis zum Morgen.
12. **Notizen verbinden:** *Ninas Ticket nie entwertet* + *Treffpunkt Kiosk* → **„Nina ist nicht gefahren – sie hat am Kiosk auf ihn gewartet.“**
13. **[M] Mira am Kiosk:** bestätigt beides, die wartende Nina und den strahlenden Luka mit den zwei Tickets. Sie verkauft **Batterien**.
14. **[M] Zdenka:** Marko gibt ihr die **Zeitung**, und sie liest seinen ersten Satz laut vor. Zum Dank schenkt sie ihm **Ivkas Radiorekorder**: „Sie hat damit jeden Abend den Seewetterbericht gehört.“
15. **Kombination:** Radio + Batterien, dann Radio + Kassette.
16. **[M] Briefkasten öffnen:** Mit dem Spachtel kommt **Ninas Zettel** von 1999 heraus.
17. **[M] Luka den Zettel vorlesen:** Er weicht aus („Das muss ein alter Zettel sein. Von einem anderen Mal.“), aber er bittet Marko: „Sag ihr, ich hab ein Lied für sie. Die Kassette ist im Koffer. Sie soll es hören. Dann weiß sie es.“ Dass er tot ist, begreift er noch nicht.
18. **[M] Nina (zweiter Besuch, Konfrontation):** Zuerst *„Ich war in der Ledana“*, dann Ninas eigenen **Zettel** zeigen, dann **Lukas Ticket**, dann das **Radio mit Kassette**. Fragt Nina, woher er von dem Ziegel wusste, kann Marko die Wahrheit sagen („Er hat es mir gesagt“) oder eine halbe Wahrheit. Beides führt weiter, nur mit anderem Nachklang. Nina: „Heute Abend. An der Rampe. Wenn die Fähre ablegt.“
19. **Finale an der Rampe der Ledana (21:00):** Marko gibt Nina das Radio, sie drückt auf „Play“. Es läuft Lukas Stimme, dann das Lied.
20. **Erkennen:** Oben auf der Galerie hört Luka seine eigene Stimme und sieht hinunter: „Nina? … Sie ist älter. Wie lange …?“ Im Nachhall sieht er den Sturz von der siebten Stufe. „Ich bin nie unten angekommen. Sie hat gewartet. Und ich war die ganze Zeit hier oben. … Ich muss nicht mehr auf halb neun warten.“ Er legt die Gitarre weg, die Leine reißt.
21. **[G] Hinüber:** Das Spiel wechselt zu Mala. Mit **Hinüberbringen** führt sie ihn „die Treppe hinunter, die es nicht mehr gibt“, bis zur Rampe. Die Nachtfähre legt ab, die Schwelle öffnet sich über dem Wasser. Luka steht neben Nina, die ihn nicht sieht: „Es ist kalt geworden.“ – „Sie weiß es jetzt.“ Er fragt Marko, ob er mitkommt, bis zur Fähre.
22. **[M] Zwischenwelt:** Luka sucht die Fähre, und ohne Ticket „lassen sie ihn nirgends rein“. Marko gibt ihm die **zwei Tickets**. Eins nimmt er mit, das andere gibt er Marko für Nina: „Sie soll selbst entscheiden, ob sie fährt.“ Dann geht Luka ins Licht: „Diesmal bin ich pünktlich.“
23. **[M] Rampe:** Nina ist noch da. Marko gibt ihr **ihr Ticket**. „Venedig.“ Das Lied soll einen Namen bekommen, und sie nennt es „Halb neun“.

### Fall 3 – „Der Nachtportier“ (Bruno Lalić, Hotel Palma)

**Was wirklich geschah:** Bruno war von 1962 bis 1993 Nachtportier des Hotel Palma. Jeden Sonntag nach Mitternacht tanzte er mit seiner Frau Danica im Salon zu einer Schellackplatte. Danica starb am 3. März 1975 um 4:10, während er Nachtdienst hatte. Im Juni kam ein Brief aus Zagreb: Ljerka war an der Musikakademie angenommen. Bruno hatte Angst, allein mit dem Hotel zurückzubleiben, und legte den Brief in den Klavierhocker des Salons, „wo sie nicht mehr spielt“. Er wollte ihn ihr später geben und fand nie die Kraft dazu. Ljerka glaubte, sie sei abgelehnt worden. Sie blieb, und das Klavier verstummte. 1993 wohnten Flüchtlinge aus Bosnien im Salon. Im Dezember 1993 traf Bruno ein Schlaganfall, der ihm die Sprache nahm, und im Februar 1994 starb er. Seitdem versucht er, einen Satz zu Ende zu bringen.

**Schritte und Rätsel**
1. **[M] Markos Wohnung:** Ljerka ruft an. Vesna hat ihr Markos Nummer gegeben, und sie braucht bis Montag Übersetzungen für den Verkauf.
2. **[M] Hotelhalle (Abend):** Gespräch mit Ljerka: der Vater, der Salon seit 1993, der Verkauf. Marko bekommt die **Dokumentenmappe**.
3. **[M] Übersetzen:** Mappe am Lesetisch benutzen. Zwischen Kaufvertrag (1938, italienisch) und Reisebürobrief (1972, deutsch) liegt Brunos **Nachtbuch** mit diesen Einträgen:
   - „Sonntag. Tanz im Salon nach Mitternacht. D. und ich. ‚Večer na Rivi‘.“
   - „3.3.1975 – Danica ist um 4:10 gestorben. Ich war nicht bei ihr. Ich war am Empfang.“
   - „21.6.1975 – Brief aus Zagreb für Lj. Ich kann nicht. Noch nicht. Ich habe ihn dorthin gelegt, wo sie nicht mehr spielt.“
   - „11.1993 – Der Salon ist voll. 22 Menschen. Die Kinder malen an die Wände. Sollen sie.“
   - „2.12.1993 – Die Kleine aus 31 wartet wieder auf der Treppe. Ich habe ihr Tee gegeben.“
   - „14.12.1993 – …“ (die Schrift bricht ab)
4. **[M] Büro:** Das **Flüchtlingsregister 1992–1995** liegt im Büro. Bei Zimmer 31 ist der Eintrag fast unleserlich (siehe Kapitel 9). Ist Mala dabei, sagt sie: „Hör auf zu lesen.“
5. **Nacht:** Ljerka geht schlafen, und die Glocke der Loge klingelt von selbst. **[G]** Mala spürt den Portiersstuhl, und Bruno erscheint in Uniform: „Buona sera … Dobra večer … Sie wünschen?“
6. **[M] Mit Bruno reden:** Er antwortet in Bruchstücken: „trinaest … Mantel … Haken“, „nema glazbe … ručka“, „Ljerka … pismo“. Jede Antwort wird als Notiz festgehalten. Er glaubt, es sei Dezember 1993, und besteht auf seinem Dienst: „Palma … uvijek … otvoreno.“ Seine Leine läuft zur Portiersglocke.
7. **[G] Von Geist zu Geist:** Mala sieht Brunos Bruchstücke als Bilder: einen Mantel an Haken 13, eine Kurbel unter dem Telefonbuch, kleine Hände auf Tasten, einen Umschlag mit rotem Stempel aus Zagreb. Bruno erkennt sie: „Mala! Trideset i jedan … du bist zurückgekommen. Tee?“ Mala: „Du verwechselst mich.“
8. **[M] Garderobe, Haken 13:** In Brunos Mantel steckt der **Schlüsselring** mit dem Salonschlüssel und einem winzigen Messingschlüssel.
9. **[M] Loge, Schublade:** Unter dem Telefonbuch liegt die **Grammofonkurbel**. Bruno hat sie 1975 versteckt, damit niemand mehr ihre Platte spielt.
10. **[M] Tanzfoto** von der Wand nehmen und Bruno zeigen. „Danica. Jeden Sonntag. Nach Mitternacht.“ Seine Worte kommen deutlicher zurück.
11. **[G] Salon (vor Marko):** Mala geht durch die verschlossene Tür. Unter der Farbe sieht sie die Kreidezeichnungen der Flüchtlingskinder: eine Straßenbahn mit der Nummer 3, ein Mädchen mit Zopf, das Wort „KUĆA“ (Zuhause). Sie sagt „Nicht.“ und wendet sich ab. Im Klavierhocker spürt sie „etwas Schweres. Papier. Und Angst.“
12. **[M] Salon aufschließen** (Schlüsselring). Kurbel ans Grammofon, die **Platte** aus dem Schrank auflegen. Die Musik ruft Bruno herauf in den Salon.
13. **[M] Flügel:** **Ljerkas Klavierschule** („Ljerka Lalić, 1966“ in Kinderschrift) Bruno zeigen. „Sie hat so schön gespielt … Zagreb … sie wollte nach Zagreb.“
14. **[M] Klavierhocker** mit dem kleinen Messingschlüssel öffnen. Darin liegen der **Umschlag der Musikakademie** (Zusage, Juni 1975) und **Brunos unvollendeter Brief** („Ljerka, ja sam …“).
15. **Notizen verbinden:** *Nachtbuch: „wo sie nicht mehr spielt“* + *Zusage im Klavierhocker* → **„Bruno hat die Zusage versteckt – aus Angst, allein zu bleiben.“**
16. **[M+G] Übersetzungsrätsel:** Bruno sagt seine Botschaft nur noch als Wortsalat: „Ljerka … perdonami … ich habe … tvoje pismo … versteckt … weil … paura … sam … sviraj.“ Marko setzt den Satz aus fünf Teilen zusammen: **„Ljerka, – verzeih mir. – Ich habe deinen Brief aus Zagreb versteckt, – weil ich Angst hatte, allein zu sein. – Spiel wieder.“** Für jeden Teil gibt es drei Möglichkeiten. Liest Marko eine falsche Fassung vor, schüttelt Bruno genau bei dem Teil den Kopf, der nicht stimmt („Ne … ne hotel … ja … sam.“).
17. **Finale:** Marko klopft um zwei Uhr nachts an Ljerkas Tür. Erst gibt er ihr den Umschlag, dann Brunos Brief, und zuletzt sagt er ihr den übersetzten Satz. Auf ihre Frage, woher er wissen will, was ihr Vater sagen wollte, antwortet Marko entweder „Ich bin Übersetzer. Ich habe gelesen, was dasteht – und was nicht.“ oder „Er hat es mir gesagt.“ Ljerka geht in den Salon und spielt mit einer Hand, dann mit beiden.
18. **Erkennen:** Bruno hört zu. „Ljerka … sviraš.“ (Du spielst.) Dann sieht er ihr graues Haar: „Sijeda … koliko godina?“ (Grau … wie viele Jahre?) Er sieht auf seine Hände: „Ja nisam više ovdje.“ (Ich bin nicht mehr hier.) Und zum ersten Mal ein ganzer Satz, auf Deutsch: „Ich bin nicht mehr im Dienst.“ Er nimmt die Mütze ab, die Leine löst sich.
19. **[G] Hinüber:** Das Spiel wechselt zu Mala. Bruno will die Tür selbst öffnen, „wie immer“. Mit **Hinüberbringen** geht er zur Salontür, hinter der die Schwelle leuchtet, und verbeugt sich vor Mala („Izvolite.“ – „Nach dir, Bruno.“). „Und der Herr?“ – „Er kommt mit. Bis an den Rand.“
20. **[M] Zwischenwelt:** Ein Stück Tresen mit Brunos Glocke. Bruno kann nicht gehen, „nema smjene“, es gibt keine Ablösung. Fragt Marko nach, erfährt er, dass die Ablösung um sieben kommt und die Glocke läutet. Marko **läutet die Glocke**. „Sedam sati. Smjena.“ (Sieben Uhr. Ablösung.) Bruno nimmt die Mütze ab, zeigt auf seinen Schlüsselring in Markos Tasche („Ključevi … Ljerki.“) und geht zu Danica ins Licht. „Nedjelja je.“ (Es ist Sonntag.)
21. **[M] Salon, Morgengrauen:** Marko gibt Ljerka den Schlüsselring. „Er hat den Dienst übergeben.“ Ljerka zahlt ihm sein **Honorar**: „Ich weiß noch nicht, ob ich verkaufe.“

### Epilog – Kein Fall, ein Entschluss
Mit dem Honorar kauft Marko am Schalter eine **Fahrkarte nach Sarajevo**. Mala sitzt auf der Bank. Es folgen das letzte Gespräch, die Busfahrt in der Morgendämmerung und der kurze Blick in die Dose.

---

## 8. Wie zwei bis drei Stunden Spielzeit entstehen

| Abschnitt | Orte | Inhalte | Zeit (Erstspieler) |
|---|---|---|---|
| Prolog | Wohnung, Varoš, Ivkas Wohnung, Nacht | Tutorial (Kaffee, Anrufbeantworter, Karte), Zdenka, Erkundung voller Erinnerungsgegenstände, Text schreiben, erste Begegnung mit Mala | 15–25 Min. |
| Fall 1 | Wohnung, Riva, Hafenbüro, Archiv, Varoš, Bar, Matejuška, Schuppen, Sustipan, Zwischenwelt | 19 Schritte, die Stimme und der Übergang, zwei Geisterräume, Brief über Dampf öffnen, Kombination, Konfrontation, Abschied in der Zwischenwelt | 50–65 Min. |
| Zwischenspiel 1 | Riva | langes Gespräch mit Wahlmöglichkeiten | 5–10 Min. |
| Fall 2 | Bar, Matejuška, Ledana, Kühlraum, Altstadt, Werkstatt, Hinterzimmer, Fährterminal, Varoš, Zwischenwelt | 23 Schritte, viele Gesprächspartner, dunkler Kühlraum, zwei Konfrontationen, Abschied in der Zwischenwelt | 50–65 Min. |
| Zwischenspiel 2 | Sustipan | Gespräch, Geistersicht auf die Gräber, Jakov | 5–10 Min. |
| Fall 3 | Wohnung, Hotelhalle, Büro, Salon, Zwischenwelt | Übersetzen, Bruchstück-Dialoge, sechs Erinnerungsstücke, Satzbau-Rätsel, Konfrontation, die Glocke der Ablösung | 40–55 Min. |
| Epilog | Fährterminal & Busbahnhof | Abschluss, Andeutungen | 5–10 Min. |
| **Gesamt** | **19 Orte** | | **≈ 2¾ Stunden (2–3 h)** |

Was die Zeit füllt:
- **Dialoge:** Jede Figur hat mehrere Themen, und jede kann man nach Notizen fragen. Rund zwei Drittel der Gespräche sind optional und vertiefen nur Figuren und Stadt.
- **Erkundung:** Jeder Ort hat zwischen 8 und 20 Hotspots mit eigenen Texten für Marko und für Mala. Dieselbe Sache klingt bei beiden verschieden: Marko beschreibt, was da ist, Mala, was da *war*.
- **Mehrstufige Fälle:** Jeder Fall verlangt Lebende, Geisterwege, Gegenstände und Notiz-Kombinationen. Die Reihenfolge ist innerhalb eines Falls weitgehend frei.
- **Wiederkehrende Orte:** Riva, Varoš, Matejuška und die Bar ändern sich je nach Tag und Tageszeit (Licht, Personen, Gespräche).
- **Ruhige Momente:** Kaffee am Fenster, eine Zigarette auf der Bank, Glocken, die man abwartet. Das kostet nur Sekunden und trägt die Stimmung.
- **Fehlversuche ohne Strafe:** falsch geführte Gespräche, abgewiesene Kombinationen und unruhige Geister.

---

## 9. Malas Geheimnis – Andeutungen und offene Fragen

### 9.1 Was das Kapitel andeutet (und wo)
1. **Kleidung der frühen Neunziger** (Prolog): Jeansjacke, Leinenturnschuhe, gestrickter Schal. Wer hat ihn gestrickt?
2. **„Ich bin schon länger in deiner Nähe.“** (Prolog): Seit wann?
3. **„Du hast ihn nie aufgemacht.“** (Prolog, Nacht) über den Karton „SARAJEVO“: Woher weiß sie das?
4. **Ivka zu Mala:** „Kind, du frierst ja. Wo ist deine Mutter?“ Mala schweigt (Fall 1).
5. **Fährenhörner und Kirchenglocken** (das ganze Kapitel): kurzes Innehalten, Zusammenzucken, auf dem Peristil kurzes Verschwinden. „Zu laut.“
6. **Die Blechdose:** nie kommentiert, nie hergegeben, das einzige „Inventar“ eines Geistes.
7. **„Bist du auch auf der Flucht?“ – „Nicht mehr.“** (Fall 2, zu Luka)
8. **Sarajevo-Wissen** (Zwischenspiel 2): Sie ergänzt Markos Erinnerung an die Linie 3 um die Kohleöfen, „dass man im Winter den Himmel nicht sah“.
9. **Jakov auf Sustipan:** „Ti opet, mala?“ (Du schon wieder, Kleine?)
10. **„Ich glaube, ich habe auf jemanden gewartet. Ich weiß nicht mehr, ob er gekommen ist.“** (Zwischenspiel 2)
11. **Bruno:** „Mala! Trideset i jedan … du bist zurückgekommen. Tee?“ (Fall 3)
12. **Nachtbuch:** „Die Kleine aus 31 wartet wieder auf der Treppe.“ (2.12.1993)
13. **Flüchtlingsregister, Zimmer 31:** „…ić, L., 17, Sarajevo. Ankunft: 28.11.1993. Abreise: –“
14. **Kreidezeichnungen im Salon:** Straßenbahn Nr. 3, Mädchen mit Zopf, „KUĆA“. Mala: „Nicht.“
15. **Epilog:** „Ich habe hier im Winter auf einen Bus gewartet. Auf einen, der nach Hause fährt.“
16. **Der Blick in die Dose:** ein Straßenbahnticket aus Sarajevo und ein **halbes Foto** mit einem **gestreiften Ärmel** und einem Stück Straßenbahn. Es passt zu dem umgedrehten Foto in Markos Regal: Junge im gestreiften Pullover, Großmutter, Linie 3.

### 9.2 Offene Fragen für die nächsten Kapitel
- Wie heißt Mala wirklich? Steht das „L.“ im Register für sie?
- Ist sie in Sarajevo gestorben oder hier in Split, im Winter 1993/94? Warum steht bei „Abreise“ nichts?
- Warum ist sie an Marko gebunden? Weil er etwas versprochen hat? Weil sie etwas von ihm in der Dose trägt? Oder weil er derjenige ist, der zu spät kam?
- Wer ist der Junge auf dem zerrissenen Foto? Ist es Marko, und warum erinnert er sich nicht an sie?
- Warum Fährenhörner? Warum Glocken? Und warum gerade die großen Glocken auf dem Peristil?
- Auf wen hat sie gewartet, und ist er gekommen?
- Was liegt in Markos Karton „SARAJEVO“?

### 9.3 Mögliche Richtungen (Vorschläge, bewusst nicht festgelegt)
- **A – Die Nachbarin:** Mala war Markos ältere Freundin aus dem Hochhaus in Sarajevo. 1993 kam sie mit einem Konvoi nach Split, wohnte in Zimmer 31 und wartete auf Markos Familie, die nachkommen wollte. Marko kam erst 1994, als sie schon tot war, und hat die Zeit davor verdrängt.
- **B – Die Familie:** Mala gehört zu Markos Familie, eine Cousine oder eine nie erwähnte Schwester. Das halbe Foto ist die andere Hälfte eines Familienbildes, das Marko besitzt.
- **C – Die Dose:** Mala ist nicht an Marko gebunden, sondern an das, was in der Dose liegt. Das Foto gehört Marko, und sie folgt ihm, bis er ihr sagen kann, wo sie hingehört.

Die Spuren dieses Kapitels sind so gelegt, dass alle drei Wege offen bleiben. In **Sarajevo** (Kapitel 2) führt der Karton weiter, ebenso die Linie 3 und das Hochhaus. In **Mostar** stehen eine Brücke und ein Konvoi im Mittelpunkt, in **Dubrovnik** die Fähre nach Italien und das, was Fährenhörner bedeuten.
