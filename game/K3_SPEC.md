# Kapitel 3 (Mostar) – Vorgabe für die Skripte

Verbindlich für alle, die an Kapitel 3 schreiben. Grundlage ist `KAPITEL3_KONZEPT.md` (Fassung 2). Die Handlung, alle Zitate und die Rätsellogik stehen dort. Dieses Papier legt fest:
- wer welche Datei schreibt;
- die IDs von Schaltern, Notizen, Gegenständen, Musik und Geräuschen;
- welche Gerüstfunktionen es gibt;
- wann ein Tag endet;
- wie die Zwischenstände im Finale funktionieren.

Kunst: `game/ROOM_SPECS3.md` (Spots, actorPos, Zustände `S.xxx`). Figuren: `game/CAST3.md` (IDs, Animationsnamen). Engine: `game/ART_API.md`, die Räume aus Kapitel 2 (`game/src/rooms/*.js`) und `game/src/96_k2_story.js` als Vorbild.

## 1. Grundsätze (gelten überall)

- **Ton:** Kurze Sätze und Pausen (`await A.wait(ms)`). Kein Satz ist klüger als die Figur. Die bosnischen und kroatischen Sätze aus dem Konzept bleiben auch im deutschen Spiel so (Zlata, Bato, Jela, Lena). Danach folgt die Übersetzung, meist durch Marko („Sie sagt: …“).
- **Keine Volkszugehörigkeiten,** keine Schuld nach Seiten. Kriegsspuren erzählen nichts selbst; Mala wird dort still.
- **Fairness:**
  - Was zwingend ist, sagt eine Figur offen. Keine Pixelsuche, keine unsichtbaren Bedingungen.
  - Jeder Fehlversuch hat eine eigene Antwort und öffnet den Weg wieder.
  - Raten wird nicht belohnt: Kata lässt nicht raten.
  - Bei `A.puzzle` gibt `check` für jede falsche Zeile eine eigene Antwort.
- **Ansicht und Anrede:**
  - Marko sieht einen Geist erst, wenn Mala ihn gefunden hat. Das ist dasselbe Prinzip wie in Kapitel 1 und 2: `ghostVisible` und `found.<id>`, siehe die Räume aus Kapitel 2.
  - Unbekannte heißen „???“, bis sie sich vorstellen: `M.INTRO[id]`, siehe `98_k2_intros.js`.
  - Beim ersten Betreten eines Ortes mit Menschen gibt es ein kurzes Gespräch, wie in Kapitel 2.
- **Geisterregeln** (bestätigt, nicht brechen):
  - Wer einem Geist direkt sagt, er sei tot, wird nicht gehört: „Was? Der Fluss ist zu laut.“
  - Vor der Erkenntnis wird der Geist unruhig: `npc(id).agitate(ms)`. Die Erkenntnis selbst kommt an einem Ding oder Zeichen und läuft über `A.realize(id, cb)`, wie bei Tomaž und Zora.
  - Danach löst sich die Leine, und Mala öffnet die Schwelle zur Zwischenwelt. Dort spielt man Marko, und er tut das Letzte. Mala bleibt am Rand.
- **Mala ist Partnerin, keine Hinweisgeberin.** Sie setzt Grenzen und sagt, was sie nicht tut:
  - keine Brücke, bis sie die Straßenbrücke „als Straße“ nimmt;
  - nicht über den Fluss an der Stelle, an der sie starb;
  - das Seil („Das ist meins.“);
  - den Fährmann zuerst nicht hinüberbringen („Den nicht.“).
- **Ihre Fähigkeiten** sind nur die bestätigten:
  - Leinen und Geister sehen; spüren (`g.sense`), lauschen (`g.listen`);
  - durch Wände und Zäune gehen (`walkG`);
  - Gegenstände ansehen, die Marko ihr zeigt (`mala`-Feld der Gegenstände oder `give` an Mala).
- **Umfang:** Etwa 2100 Dialog- und Erzählzeilen für das Kapitel, davon Mala etwa 450. Etwa 560 Beschreibungen. Jeder Hotspot hat `look`; die meisten haben auch `g:{look}` für Malas Blick, viele `use`, `take` oder `open` mit eigener Antwort. Jede Figur hat ein Gesprächsmenü mit mehreren Zweigen, die sich mit neuem Wissen ändern (Notizen zeigen: `give` mit Gegenständen, Notizen über `A.askNote`).

## 2. Zuständigkeiten (wer schreibt was)

| Agent | Räume (Logik `game/src/rooms/<id>.js`) | Szenen und Funktionen | weitere Dateien |
|---|---|---|---|
| **S1 Ostufer** | `ostbus`, `herberge`, `zimmer`, `kujundziluk`, `starimost`, `koski`, `minarett`, `tepa`, `strassenbr` | `M.k3Arrive`, `M.k3Wake`, `M.k3Talk1` (Gespräch 1), `M.k3Father`, `M.k3NadaSms`, `M.k3SanjaCall`, `M.k3LjerkaCall`, `M.k3NadaCall2`, Malas Gesprächsmenüs (`M.k3LookAtMala`, `M.k3TalkToMala`, `M.k3MalaToMarko`, `M.k3MalaLooksAtMarko`), Brücke im Epilog, `M.k3NadaCallEpi`, `M.k3NadaArrives`, `M.k3BusHome` | `game/src/97_k3_mala.js` (Mala-Gespräche), `game/src/98_k3_intros_ost.js` |
| **S2 Westufer** | `bulevar`, `partizan`, `westbus`, `kafic`, `vulkanizer`, `vhof`, `zelenika`, `zelenika_in`, `vermisst` | Fall B (Mate) mit Zwischenwelt (Mate), alle Teile mit Vlado und Kata, `M.k3Talk2` (Gespräch 2, „Wie Großmutter“), die Botschaft an Vlado, Abfahrt in der Finalnacht (`M.k3FinDeparture`), Vermisstenstelle, `M.k3MotherCall` | `game/src/97_k3_limbo_mate.js`, `game/src/98_k3_intros_west.js` |
| **S3 Skela** | `skela_d`, `skela_most`, `skela_l`, `zlata_k` | Zweite Nacht, Rekonstruktion am dritten Tag (Lichtprobe, Reihenfolge, Batos Satz, Bleistift, Decke), das ganze Finale ab der Ankunft in Skela (`M.k3FinArrive`), `M.k3FinResume`, Zwischenwelt (Bato), zwei Mütter im Epilog | `game/src/97_k3_limbo_bato.js`, `game/src/98_k3_intros_skela.js` |
| **Gerüst** (schon vorhanden oder entsteht parallel) | – | Phasen, Kapitelstart, alle Phasenwechsel, Tagesende-Prüfung, Stadtplan, Reiseregeln, Leine, „Mala fragen“, Peilung (Overlay), alte Karte, Notizen und Schlüsse, Gegenstände, Zwischenstände, Abspann | `96_k3_story.js`, `97_k3_peil.js`, `13_k3_notes.js`, `12_k3_items.js` |

Ändere keine Datei eines anderen Agenten und keine Gerüstdatei. Fehlt dir eine Gerüstfunktion, rufe sie trotzdem so auf, wie sie hier steht, und schreib es in deinen Bericht.

## 3. Phasen und Tageswechsel

Phasen (in `96_k3_story.js`): `k3_pro`, `k3_pro_n`, `k3_d1`, `k3_d1_n`, `k3_d2`, `k3_d2_n`, `k3_d3`, `k3_fin_n`, `k3_epi` (Morgengrauen), `k3_epi_d` (Montag am Tag). In Räumen fragst du die Phase mit `A.G.phase` oder `G.phase` ab.

Das Gerüst wechselt die Phasen. Skripte rufen nie `A.phase(...)` selbst. Sie setzen ihre Schalter und rufen am Ende einer Szene, die einen Tag abschließen kann, **`await M.k3DayCheck(A)`** auf. Diese Funktion läuft auch bei jedem Raumwechsel.

| Wechsel | Bedingung (Schalter) | Was das Gerüst tut |
|---|---|---|
| `k3_pro` → `k3_pro_n` | Notizen `l3_notbridge` und `l3_onedir`, Schalter `k3.p.checkin` | Marko: „Es wird dunkel.“ Karte „Am Abend“. Dann Herberge, Terrasse, `await M.k3Talk1(A)` (S1) |
| `k3_pro_n` → `k3_d1` | `k3.p.talk1` | im `zimmer` das Bett (S1 ruft `M.k3Bed(A)`) |
| `k3_d1` → `k3_d1_n` | Notiz `l3_skela` und `k3.v.drawer` | Karte „Freitag · Nacht“, Herberge. Ist `k3.d1.sanja` gesetzt und `k3.d1.ljerka` noch nicht, kommt zuerst `M.k3LjerkaCall(A)`. Die Australier sind da, `M.k3Father(A)` startet auf der Terrasse (S1) |
| `k3_d1_n` → `k3_d2` | `k3.d1.father` | Bett |
| `k3_d2` → `k3_d2_n` | (`k3.z.mala` oder `k3.z.lost`) und `k3.v.part1` und `k3.b.arrived`; hat Marko Davor „Ich komme mit.“ zugesagt (`k3.b.helper`), auch `k3.b.jela` | das Telefon: `M.k3NadaCall2(A)` (S1), Karte „Die Glocke · Samstag · Nacht“, Herberge |
| `k3_d2_n` → `k3_d3` | `k3.bato.found` und `k3.z.tomorrow`, Marko wieder bei Mala in `skela_d` | Taxi zurück, Karte „Dritter Tag – Zwei Ufer“, `zimmer` |
| `k3_d3` → `k3_fin_n` | Notizen `l3_survived`, `a3_awake`, `a3_girl`, Schalter `k3.bato.uneasy` (Bato hat beide Belege gehört), `k3.v.free` und `k3.b.done` | Marko: „Es ist bald elf.“ Karte „Finale – Die letzte Fähre“, `vhof` bei Nacht, `await M.k3FinDeparture(A)` (S2). Danach Fahrt und `skela_d`, `await M.k3FinArrive(A)` (S3) |
| `k3_fin_n` → `k3_epi` | `k3.a.limbo` (Bato ist hinübergegangen) | Karte „Epilog – Hin und zurück“, Herberge im Morgengrauen, `await M.k3NadaCallEpi(A)` (S1) |
| `k3_epi` → `k3_epi_d` | `k3.e.bridge` | Abblende „Gegen Mittag“, `ostbus`, `await M.k3NadaArrives(A)` (S1) |
| Ende | `k3.e.mother` und Abfahrt (`M.k3BusHome(A)`, S1) | `M.endChapter3(A)`, Abspann |

Fehlt eine Bedingung, sagt Marko oder Mala offen, was noch fehlt. Das gilt bei `M.k3Bed(A)` und beim Reiseversuch nach Skela am Samstag. Beispiel: „Vlado hat gesagt: Kommen Sie morgen. Das ist heute.“ Die Sätze stehen im Gerüst; S1 und S2 können eigene Zeilen in ihren Szenen ergänzen.

**Ortswechsel-Zähler:** `A.G.flags['k3.moves']` zählt jeden Raumwechsel. S2 braucht ihn für Vlados Laden: „Kommen Sie in einer Stunde wieder.“ Der Laden öffnet wieder, wenn `k3.moves` größer ist als `k3.v.closedAt + 1`.

## 4. Stadtplan und Reisen

`M.MAPLOCS3` (Gerüst). Ort-IDs, Ziel und Eingang `map`:

| ID | Ziel | Name |
|---|---|---|
| `ostbus` | `ostbus` | Ostbusbahnhof |
| `herberge` | `herberge` | Herberge „Neretva“ |
| `kujundziluk` | `kujundziluk` | Kujundžiluk |
| `starimost` | `starimost` | Alte Brücke |
| `koski` | `koski` | Koski-Mehmed-Pascha-Moschee |
| `tepa` | `tepa` | Tepa (Markt) |
| `strassenbr` | `strassenbr` | Straßenbrücke |
| `bulevar` | `bulevar` | Bulevar |
| `partizan` | `partizan` | Partisanenfriedhof |
| `westbus` | `westbus` | Westbusbahnhof |
| `zelenika` | `zelenika` | Haus Zelenika |
| `vermisst` | `vermisst` | Vermisstenstelle |
| `skela` | `skela_d` | Skela |

Freischalten mit **`A.unlock('<id>')`**. Wer was freischaltet:

| Ort | Wer schaltet frei | Wann |
|---|---|---|
| `ostbus` | Gerüst | bei Kapitelbeginn |
| `herberge`, `kujundziluk`, `starimost` | S1 | mit dem Stadtplan vom Kiosk (Gegenstand `plan`) |
| `koski` | S1 | nach der ersten Messung |
| `strassenbr`, `partizan` | Gerüst | nach dem Schluss `l3_flat` |
| `bulevar`, `westbus` | Gerüst | nach Malas Überquerung (`k3.mala.crossed`) |
| `tepa` | S1 | Notiz `l3_tepa` oder `l3_person` |
| `zelenika` | S2 | wenn der Bus aus München da war |
| `skela` | Gerüst | mit dem Schluss `l3_skela` |
| `vermisst` | S2 | im Epilog |

Reiseregeln (Gerüst, `M.canTravel`):

- **Westufer** (`bulevar`, `partizan`, `westbus`, `zelenika`): erst nach `k3.mala.crossed`. Vorher weigert sich Mala. Geht Marko allein, zieht die Leine nach ein paar Straßen, und er kehrt um.
- **Skela:** nur über den Stadtplan, erzählt als Taxifahrt vom Ostbusbahnhof. Hat Marko Dino nach dem Roller gefragt (`k3.dino.ride`), wählt er in einer Auswahl Taxi oder Roller. Unterwegs erzählt Dino dann von der Strömung: das ist `M.k3DinoRide(A)` (S1), Notiz `l3_current`. Bedingungen:
  - Freitag: Mala will nicht („Nicht heute.“).
  - Samstag tags: erst, wenn die Tagesbedingungen erfüllt sind; dann beginnt ohnehin der Abend.
  - Samstagnacht und Sonntag: frei.
  - Finalnacht: Vlado fährt.
  - Epilog: der Reihe nach.
- **Aus Skela weg** geht es nur von `skela_d`, wo das Taxi an der Straße wartet. Mala bleibt in `skela_d`, wenn Marko über die neue Brücke geht. Das steuert das Gerüst über `M.malaStays`: in `k3_d2_n` und `k3_d3` immer, im Finale bis zur Überfahrt.
- **Nacht:** In `k3_pro_n`, `k3_d1_n` und `k3_d2_n` sind nur `herberge`, `starimost`, `ostbus` und in der Samstagnacht `skela` erlaubt.
- **Epilog:** Brücke, dann Ostbusbahnhof (Nada), dann Skela, dann Vermisstenstelle, dann Ostbusbahnhof (Abfahrt).

## 5. Gerüstfunktionen, die die Skripte aufrufen

| Funktion | Zweck |
|---|---|
| `await M.k3DayCheck(A)` | Am Ende jeder Szene aufrufen, die eine Tagesbedingung setzt. Wechselt, wenn alles erfüllt ist |
| `await M.k3Bed(A)` | das Bett im Zimmer (S1). Schläft oder sagt, was fehlt |
| `M.k3AskOpt(A, key)` | Gesprächsoption „(Mala fragen.)“ oder `null`. Siehe Abschnitt 6 |
| `M.k3Asked(A, key)` | ob Marko Mala zu `key` gefragt hat (true/false) |
| `await M.k3Skipped(A, key)` | aufrufen, wenn Marko an einem Entscheidungspunkt entscheidet, ohne gefragt zu haben. Mala reagiert einmal („Du hast mich nicht gefragt.“) |
| `await M.k3Peil(A, station)` | die Peilung an `'bridgehead'`, `'minaret'` oder `'partizan'`: Mala beschreibt die Richtung über zwei Landmarken, Marko wählt sie auf der Kartenansicht. Gibt `true` zurück, wenn gemessen. Setzt `k3.peil.<station>` und die Notiz `l3_m1`, `l3_m2` oder `l3_m3`. Davor spielt dein Skript den Gang zum Ort; die Glocken am Partisanenfriedhof spielt S2 **vor** dem Aufruf (Mala ist kurz fort) |
| `M.k3PeilWords(station)` | Malas Satz für diese Station, z. B. „Links am Glockenturm vorbei, rechts vom zweiten Kran.“ |
| `await M.k3OldMap(A)` | Zdravkos alte Karte von 1985 ansehen (S2, Spot `oldmap`). Zeigt die Karte, mit den Fächern, wenn `l3_area` da ist. Gibt die Notiz `l3_oldmap` |
| `await M.k3Checkpoint(A, n)` | fester Zwischenstand im Finale: `k3.fin.cp = n`, dann `A.save()`. Siehe Abschnitt 9 |
| `M.k3Leash(G)` | Malas Leinenziel als Text, für Malas Zeilen: `'down'`, `'city'`, `'zlata'`, `'none'` oder `'bond'` |
| `M.k3Carry` | was aus Kapitel 2 übernommen wurde: `{confess, whyMostar, hajra, ana, father}`; fehlt der Stand, gelten Vorgaben |

Phasenstarts (nur das Gerüst ruft sie): `M.startChapter3`, `M.k3StartEvening0`, `M.k3StartD1`, `M.k3StartD1Night`, `M.k3StartD2`, `M.k3StartD2Night`, `M.k3StartD3`, `M.k3StartFinale`, `M.k3StartEpilogue`, `M.k3StartEpiDay`, `M.endChapter3`.

## 6. „Mala fragen“

Nach Gespräch 1 setzt S1 `k3.ask=true` und `k3.p.promise` auf `'a'`, `'b'` oder `'c'`. Ab dann erscheint an Entscheidungspunkten die Zeile „(Mala fragen.)“:

```js
var ask=M.k3AskOpt(A,'nada2');   // null, solange k3.ask fehlt; erscheint nur einmal je key
await A.menuLoop(function(){ return [ ask, {t:'Ich habe eine Spur.', go:…}, … ].filter(Boolean); });
```

`M.k3AskOpt` ruft beim Wählen `M.K3ASK[key](A)` auf, setzt `k3.asked.<key>` und zählt `k3.askCount` hoch. Die Antworten schreibt der Agent, dem die Szene gehört: `M.K3ASK.nada2=async function(A){ … }`. Entscheidet Marko, ohne gefragt zu haben, rufe `await M.k3Skipped(A,key)`.

Entscheidungspunkte (key, Agent, Malas Antwort laut Konzept):

| key | Agent | Malas Antwort |
|---|---|---|
| `nada2` | S1 | Nadas Anruf am Samstag: „Sag ihr nichts, was du nicht weißt. Aber sag ihr nicht nichts.“ |
| `zlata_awake` | S3 | Sonntag, über den Fluss per Zeichen (zwei Finger, sie schüttelt den Kopf): „Lass ihr ihren Mann.“ Nach Gespräch 2 im Mala-Menü (S1): „Sag es ihr. Auch ihr.“ (`k3.z.tellOk`) |
| `vlado_msg` | S2 | vor der Botschaft: Mala sagt nicht den Satz, nur „Du weißt es. Du warst dabei, als ich es dir gezeigt habe.“ |
| `form` | S2 | Formular, Feld „Beziehung“: „Schreib nicht Nachbarin. Schreib, was ich war.“ |
| `sample` | S2 | die Probe für den Vater. Ohne Probe: „Du suchst mich, damit du ihn nicht suchen musst.“ |
| `mothers` | S3 | was Nada im Epilog erfährt: „Alles. Auch das Seil. Auch, dass ich gesagt habe: Sag es keinem.“ |

## 7. Schalter (`G.flags`)

Alle mit `k3.`. Wer setzt sie, wer braucht sie:

**Gerüst, kapitelweit**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.q` | Gerüst | die Warteschlange der automatischen Reaktionen (Liste). Sie steht im Spielstand, damit eine Reaktion beim Laden nicht verloren geht; eine Reaktion verlässt sie erst, wenn sie fertig ist. Beim Laden, bei „Neues Spiel“ und beim Titelbild wird der Läufer zurückgesetzt (`M.RESET_HOOKS`). |

**Prolog**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.p.sms` | S1 | `'yes'` / `'no'`: auf Nadas SMS geantwortet |
| `k3.p.plan` | S1 | Stadtplan gekauft |
| `k3.p.checkin` | S1 | bei Maja eingetragen |
| `k3.p.src` | S1 | `'abutment'` / `'dino'` / `'card'`: woher „Die Alte Brücke stand nie im Wasser“ kam |
| `k3.p.objection` | S1 | der Einwand „damals auch kaputt“ ist beantwortet |
| `k3.p.followed` | S1 | der Leine am Ufer gefolgt |
| `k3.p.talk1` | S1 | Gespräch 1 geführt |
| `k3.ask` | S1 | „Mala fragen“ ist offen |
| `k3.p.promise` | S1 | `'a'` / `'b'` / `'c'`, die Antwort in Gespräch 1 |
| `k3.p.springer` | S1 | optional: Mala hat dem Springer applaudiert |
| `k3.p.nobridge` | S1 | Mala auf die Brücke gedrängt; die Zeile verschwindet danach |

**Tag 1**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.peil.bridgehead`, `k3.peil.minaret`, `k3.peil.partizan` | Gerüst | die drei Messungen |
| `k3.koski.ticket` | S1 | Ticket fürs Minarett |
| `k3.mala.refused` | Gerüst | Mala hat sich geweigert, über den Fluss zu gehen |
| `k3.mala.crossed` | S1 | Mala hat die Straßenbrücke überquert, mit geschlossenen Augen |
| `k3.bells1` | S2 | die Glocken am Partisanenfriedhof |
| `k3.d1.skela` | Gerüst | Skela ist gefunden |
| `k3.d1.sanja`, `k3.d1.ljerka` | S1 | Sanja angerufen; Ljerka hat zurückgerufen |
| `k3.b.mate` | S2 | Mate getroffen |
| `k3.b.promise` | S2 | Marko hat Mate gesagt, er schaut morgen, ob der Bus kommt |
| `k3.v.known` | S2 | weiß von Vlado Rajić und dem Vulkanizer |
| `k3.v.met` | S2 | Vlado getroffen |
| `k3.v.angry`, `k3.v.closedAt` | S2 | Laden zu, mit `k3.moves` zur Zeit des Ärgers |
| `k3.v.cab` | S2 | Nachhall im Führerhaus gelesen |
| `k3.v.mail` | S2 | Katas E-Mail übersetzt |
| `k3.v.which` | S2 | Kata hat „Welche?“ gefragt |
| `k3.v.drawer` | S2 | die unterste Schublade ist offen, Vlado hat „Morgen“ gesagt |
| `k3.v.cabHeard` | S2 | Marko hat Vlado die Führerhaus-Sätze vor der Zeit gesagt (Freitag oder Samstag). Vlado will es nicht hören; beim zweiten Mal: „Das haben Sie schon einmal gesagt.“ Am Sonntag erinnert er sich: „Das haben Sie schon am Freitag gesagt.“ |
| `k3.d1.father` | S1 | das Vatergespräch in der Nacht |

**Tag 2**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.d2.wake` | S1 | Mala: „Sie zeigt heute woandershin.“ |
| `k3.z.asked` | S1 | Zlata gefragt |
| `k3.z.mala` | S1 | auf „Mala“ fiel das Ei |
| `k3.z.lost` | S1 | Zlata ist gegangen, ohne dass „Mala“ fiel |
| `k3.z.dream` | S1 | Mala hat ihr Gespräch mit der Nachbarin belauscht |
| `k3.v.part1` | S2 | Vlado, Teil 1 |
| `k3.b.arrived` | S2 | der Bus aus München ist da |
| `k3.b.jela` | S2 | Jela getroffen und übersetzt |
| `k3.b.jelaSun` | S2 | Sonntag ohne den Samstag (Davor abgesagt, nie bei Jela gewesen): Jela hat Marko selbst vom Tor, vom Schlüssel und von den Feigen erzählt (`b3_gate`, `b3_figs`, `b3_sell`) |
| `k3.d2.nada` | S1 | `'truth'` / `'evade'`: Nadas Anruf am Samstag |
| `k3.dino.ride` | S1 | Dino bietet den Roller an |
| `k3.dino.owed` | S1 | Marko hat Dino von einer Fähre erzählt, die nachts nicht fuhr, bevor er die Nacht kennt; Dino: „Dann schuldest du sie mir.“ |

**Samstagnacht**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.bato.found` | S3 | Mala hat Bato gesehen; seine Leine geht zur Glocke |
| `k3.n2.hut`, `k3.n2.bell`, `k3.n2.anchor` | S3 | der Nachhall an der Hütte, an der Glocke, am Seilanker |
| `k3.n2.rung` | S3 | Marko hat bei Nacht geläutet |
| `k3.n2.rings` | S3 | wie oft er bei Nacht geläutet hat; ist es gesetzt, sagt Zlata im Finale „Čula sam zvono. Tri puta. Kao tada.“ statt „Noću. Prvi put od tada.“ |
| `k3.n2.neighbor` | S3 | der Nachbar mit dem Hund |
| `k3.n2.batoTalk` | S3 | mit Bato geredet („Soldat“) |
| `k3.z.tomorrow` | S3 | Zlata: „Sutra. Danju.“ |

**Tag 3**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.lit` | S3 | `'kitchen'` / `'stube'` / `'roof'` / `null`: in welchem Fenster Markos Handylicht ist; die Kunst liest es als `S.lit` |
| `k3.lp.kitchen`, `k3.lp.stube`, `k3.lp.roof` | S3 | Mala hat das Fenster verglichen |
| `k3.z.upstairs` | S3 | Zlata lässt Marko in die Kammer |
| `k3.d3.order` | S3 | die Reihenfolge ist gelegt |
| `k3.bato.slip` | S3 | Batos Satz „Dreimal …“ |
| `k3.z.pencil` | S3 | der Bleistift |
| `k3.z.deka` | S3 | Zlata hat die Decke mitgegeben |
| `k3.mala.deka` | S3 | Mala hat die Decke gelesen |
| `k3.z.alive` | S3 | Zlata: „Sie hat noch gelebt.“ |
| `k3.bato.uneasy` | S3 | Bato hat beide Belege gehört, den Bleistift und Zlata, und ist unruhig; Pflicht für das Tagesende |
| `k3.bato.lantern` | S3 | Bato hat danach am Tag seine Laterne angezündet; die Kunst liest es als `S.lantern` |
| `k3.v.part2` | S2 | Vlado, Teil 2 |
| `k3.d3.talk2` | S2 | Gespräch 2 geführt |
| `k3.d3.talk2v` | S2 | `'a'` / `'b'` / `'c'`, die Antwort in Gespräch 2 |
| `k3.v.msgTry` | S2 | Zahl der falschen Botschaften |
| `k3.v.free` | S2 | „Dann fahr still.“ ist angekommen; Vlado fährt heute Nacht |
| `k3.z.tellOk` | S1 | Mala: „Sag es ihr. Auch ihr.“ |
| `k3.b.letters` | S2 | Mates Briefe gelesen |
| `k3.b.kids` | S2 | das Kinderzimmer gesehen |
| `k3.b.invite` | S2 | Davor hat die Einladung verstanden |
| `k3.b.cards` | S2 | Lenas Postkarten gefunden |
| `k3.b.son` | S2 | Mate erkennt seinen Sohn („Došli smo, dida“) |
| `k3.b.dead` | S2 | Mate erkennt seinen Tod (der Schlüssel am Tor) |
| `k3.b.figs` | S2 | die Feigen sind eingepackt; die Kunst liest den Schalter |
| `k3.b.keyFree` | S2 | der Schlüssel liegt in der Astgabel; die Kunst liest den Schalter |
| `k3.b.keyLena` | S2 | Marko hat Lena den Schlüssel gegeben |
| `k3.b.limbo` | S2 | Mate ist hinübergegangen |
| `k3.b.done` | S2 | Fall B ist abgeschlossen: der Abschied, Davors Karte |

**Finalnacht**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.fin.drive` | S2 | die Abfahrt mit Vlado |
| `k3.fin.rung` | S3 | Marko hat in der Finalnacht geläutet |
| `k3.fin.ferry` | S3 | die Geisterfähre: `'far'`, `'mid'`, `'here'`, `'left'` (am linken Anleger) |
| `k3.fin.bato` | S3 | Batos Erkenntnis |
| `k3.fin.cp` | Gerüst | der letzte Zwischenstand: 1, 2, 3, 4 |
| `k3.fin.boarded` | S3 | Mala ist eingestiegen |
| `k3.fin.crossed` | S3 | die Überfahrt ist zu Ende |
| `k3.fin.zvono` | S3 | Zlata: „Zvono.“ |
| `k3.fin.story` | S3 | Zlatas Erzählung |
| `k3.fin.told` | S3 | Marko hat Zlata gesagt, dass Bato wach war |
| `k3.fin.oven` | S3 | die Erinnerung „Ofen“ |
| `k3.fin.free` | S3 | die Leine ist los |
| `k3.fin.ask` | S3 | Marko hat am Grab gefragt („Was willst du?“) |
| `k3.fin.promised` | S3 | Zahl der Versuche mit „Ich bringe dich nach Hause.“ |
| `k3.fin.consent` | S3 | `'a'` / `'b'` / `'c'`, wie `k2.f2.confess` |
| `k3.fin.bond` | S3 | der neue Faden |
| `k3.a.limbo` | S3 | Bato ist hinübergegangen |

**Epilog**

| Schalter | Wer setzt | Bedeutung |
|---|---|---|
| `k3.e.call` | S1 | Anruf bei Nada |
| `k3.e.bridge` | S1 | Malas Gang über die Brücke |
| `k3.e.nada` | S1 | Nada ist angekommen |
| `k3.e.mothers` | S3 | die zwei Mütter in Skela |
| `k3.e.report` | S2 | Anzeige bei Frau Kolar |
| `k3.e.form` | S2 | das Formular mit Markos eigenem Satz |
| `k3.e.sample` | S2 | Marko hat eine Probe abgegeben |
| `k3.e.sampleAna` | S2 | Marko hat die Probe zweimal abgelehnt; Frau Kolar braucht dann die Probe eines anderen Kindes (Ana), die der Mutter hilft nur zusammen damit |
| `k3.e.mother` | S2 | Anruf bei der Mutter |
| `k3.e.bus` | S1 | Abfahrt |

## 8. Notizen und Schlüsse

Alle Notizen stehen in `game/src/13_k3_notes.js`. Die IDs sind fest. Skripte rufen `A.note('<id>')` an der Stelle, die die Tabelle nennt. Schlüsse (`l3_notbridge` und so weiter) ziehen Spieler im Notizbuch, nie das Skript. Das Gerüst reagiert auf Schlüsse: Es schaltet Orte frei und lässt Mala dazu sprechen.

Fälle:
- `p3`: Ankunft
- `l3`: Lanas Nacht, das ganze Kapitel
- `v3`: Der Fahrer
- `a3`: Die Glocke, Bato und Skela
- `b3`: Der Bus aus München
- `e3`: Epilog
- `k3_c_*`: aus Kapitel 2 übernommen

| Notiz | Wer gibt sie, wo | Inhalt (Kurzform) |
|---|---|---|
| `k3_c_bridge` | Kapitelstart | Malas Splitter aus K2: Lastwagen, Brücke, die nicht mehr da war, Wasser |
| `k3_c_name` | Kapitelstart | „Ich habe ihr den Namen gegeben“ |
| `k3_c_missing` | Kapitelstart | Nada: vermisst, seit siebzehn Jahren |
| `k3_c_promise` | Kapitelstart | „Bring sie nach Hause“, Markos Versprechen an Nada |
| `p3_sms` | S1, ostbus | Nadas SMS |
| `p3_munich` | S1, ostbus Tafel | „MÜNCHEN · subota“ |
| `p3_history` | S1, Dino | Die Brücke fiel 1993, Seilbrücke, 2004 wieder aufgebaut |
| `l3_mybridge` | S1, Mala am Brückenkopf | „Meine stand im Wasser. Auf Stümpfen …“ |
| `l3_onearch` | S1 | **eine** der drei Quellen: Widerlager (`abutment`), Dino, Postkarte 1974 (`postcards`). Setze dazu `k3.p.src` |
| `l3_down` | S1, Mala am Brückenkopf | Spur: Die Leine zeigt flussab |
| `l3_onedir` | S1, der Leine folgen (Uferstufen `steps`) | Eine Richtung reicht nicht |
| `l3_notbridge` | Schluss | `l3_mybridge` + `l3_onearch` |
| `l3_uncounted` | Schluss | `l3_notbridge` + `k3_c_bridge`: eine Brücke, die keiner gezählt hat |
| `l3_m1` | Gerüst (`M.k3Peil` am Brückenkopf) | erste Messung |
| `l3_m2` | Gerüst (`M.k3Peil` am Minarett) | zweite Messung |
| `l3_flat` | Schluss | `l3_m1` + `l3_m2`: zu flach geschnitten |
| `l3_m3` | Gerüst (`M.k3Peil` am Partisanenfriedhof) | dritte Messung |
| `l3_area` | Schluss | `l3_flat` + `l3_m3`: der Bereich liegt hinter dem Kartenrand |
| `l3_oldmap` | Gerüst (`M.k3OldMap`, S2 ruft es am Spot `oldmap`) | die alte Karte von 1985 |
| `l3_skela` | Schluss | `l3_area` + `l3_oldmap`: Skela heißt Fähre |
| `l3_current` | S1 (`M.k3DinoRide`, optional) | Dino: Was in den Fluss fällt, kommt an der Biegung wieder ans Ufer |
| `l3_bells` | S3 (nach der Überfahrt) | Darum die Glocken |
| `l3_city` | S1 (`M.k3Wake` am Samstag) | Die Leine zeigt heute in die Stadt |
| `l3_person` | Schluss | `l3_skela` + `l3_city`: ein Mensch, kein Ort |
| `l3_tepa` | S1, Maja am Samstag | Samstags kommen die Leute aus den Dörfern auf die Tepa |
| `l3_eggwoman` | S1, Zlata auf „Mala“ | Die Eierfrau kennt eine Mala |
| `l3_dreams` | S1, Mala lauscht an der Nachbarin | „Sanjam je opet. Treću noć.“ |
| `l3_zlata_gone` | S1, wenn `k3.z.lost` | Die Eierfrau ist fort, die Leine folgt ihr aus der Stadt |
| `l3_ljerka_pic` | S1, Ljerkas Rückruf | Brunos Bild, unterschrieben mit Mala |
| `l3_key31` | S1, Ljerka | Der Schlüssel von 31 fehlt seitdem |
| `l3_abreise` | S1, Ljerka | Bei „Abreise“ hat sie nichts eingetragen |
| `l3_onetrail` | Schluss | (`v3_mala` oder `l3_ljerka_pic`) + `k3_c_name`: Mala und Lana sind eine Spur |
| `l3_twosearches` | Schluss | `l3_onetrail` + `k3_c_missing`: zwei Suchen, die sich nie trafen. Danach hat Marko auf dem Markt die Frage nach „Mala“ |
| `l3_survived` | Schluss | `a3_blanket` + `a3_fromzlata`: Sie hat den Fluss überlebt |
| `l3_rope` | S2, Gespräch 2 | das Seil, in Markos Worten |
| `l3_oven` | S3, Finale | Ofen, Samstag |
| `v3_mate` | S2, Mate | „Rajić? Der Raucher? … Vulkanizer hinter dem Bulevar.“ |
| `v3_ljerka` | S1, Ljerka | mit Vlado, dem Raucher; Mehl für die Dörfer an der Neretva |
| `v3_where` | S1 (Taxifahrer) oder S2 (Zdravko) | Vlado ist Rajić, Vulkanizer hinter dem Bulevar; der zweite Weg, wenn Ljerka zuerst kam |
| `v3_denial` | S2 | „Ich habe nie jemanden mitgenommen. Nie.“ |
| `v3_cab` | S2, Mala im Führerhaus | Sie hat ihn gezeichnet: „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“ |
| `v3_hewas` | S2, Mala | „Er war es. Er hat die Zigarette immer noch zwischen den Zähnen.“ |
| `v3_typenschein` | S2, nach der E-Mail | Kata braucht den Typenschein aus einer der drei Schubladen |
| `v3_drawer` | S2, Mala sieht durch das Holz | die unterste Schublade: Mappe „TAM 4500“, ein Blatt, Schlüssel „31“ |
| `v3_tomorrow` | S2 | Vlado: „Morgen. Kommen Sie morgen.“ |
| `v3_forlater` | S2, Rückseite der Zeichnung (Samstag) | „Für später. Wenn du nach Sarajevo kommst, zeichne ich dich ohne Zigarette.“ |
| `v3_mala` | S2, Teil 1 | „Sie hat gesagt, sie heißt Mala. Wie jede.“ |
| `v3_part1` | S2, Teil 1 | Ankunft gegen zwanzig vor elf, um Viertel nach elf gefahren |
| `v3_bag` | S2, Teil 1 | Tasche im Führerhaus, Kleider verschenkt, den Schlüssel behalten |
| `v3_mala_left` | S2, Mala nach Teil 1 | Mala: „Er ist gefahren.“ |
| `v3_sent` | S2, Teil 2 | „Sie hat mich weggeschickt. … Ich habe genug gewartet. Für ein ganzes Leben. Fahr.“ |
| `v3_two` | S2, Teil 2 | „Um zwei war ich wieder da.“ |
| `v3_who` | Schluss (Widerspruch) | `v3_sent` + `v3_mala_left`: Wer hat wen stehen lassen? Mit Mala ansprechen → Gespräch 2 |
| `v3_message` | S2, Gespräch 2 | Sag Vlado, dass er nicht schuld ist. Mit etwas, das nur wir zwei hatten |
| `v3_tonight` | S2 | „Heute Nacht um elf hole ich Sie ab.“ |
| `a3_stumps` | S3, Nacht 2 | die Pfeilerstümpfe: Malas Brücke |
| `a3_bato` | S3 | der Fährmann im Schuppen, seine Leine zur Glocke |
| `a3_hut` | S3, Nachhall Hütte | ein Mädchen auf einem Mehlsack, Kerze, Bleistift |
| `a3_bell3` | S3, Nachhall Glocke | dreimal mit Pausen geläutet |
| `a3_voice` | S3, Nachhall Glocke | „Halo! Ima li koga?“, eine Mädchenstimme |
| `a3_mine` | S3, am Seilanker | „Nicht. Das ist meins.“ |
| `a3_neighbor` | S3 | Die Skela fährt seit achtundneunzig nicht mehr |
| `a3_soldier` | S3, Bato | Bato: Es war ein Mann, ein Soldat |
| `a3_plaque` | S3, Spendertafel | Brücke 1998, die Fähre stellte den Dienst ein |
| `a3_tomorrow` | S3, Zlata | „Sutra. Danju.“ |
| `a3_slept` | S3, Zlata (Sonntag) | „Er hat geschlafen. Er hatte einen tiefen Schlaf.“ |
| `a3_grave` | S3 | ein Beet unter dem Quittenbaum, ein Brett „MALA · 15.1.1994“ |
| `a3_morning` | S3, Zlata | „Am Morgen, als ich die Hühner rausließ.“ (gefunden im Schilf) |
| `a3_roof` | S3, Lichtprobe | das kleine Dachfenster: Batos Kammer |
| `a3_lightseq` | S3, Mala ordnet ihren Nachhall | beim ersten Läuten dunkel, beim zweiten Licht, beim dritten wieder dunkel |
| `a3_lightroom` | Schluss | `a3_lightseq` + `v3_part1`, über die Reihenfolge (Overlay `arrange`): Licht in Batos Kammer |
| `a3_thrice` | S3, Bato auf `a3_lightroom` | „Licht? Ich habe es gleich wieder ausgemacht. … Dreimal hat er geläutet, dann war Ruhe.“ |
| `a3_awake` | Schluss (Widerspruch) | `a3_thrice` + `a3_slept`: Bato war wach |
| `a3_pencil` | S3, Zlata | der angekaute Bleistift von der Glocke |
| `a3_girl` | Schluss | `a3_voice` + `a3_pencil`: Es war das Mädchen |
| `a3_fromzlata` | S3, Zlata gibt die Decke | „Uzmite deku. Hladno je kod vode.“ |
| `a3_blanket` | S3, Mala liest die Decke | ein Mädchen in dieser Decke, an einem Herd. „Ich war noch da.“ |
| `a3_alive` | S3, Zlata mit `l3_survived` | „Ja. Im Schilf. Sie hat noch gelebt.“ Sie hat ihr etwas versprochen |
| `b3_mate` | S2 | „Morgen um sechs. Mein Sohn kommt.“ |
| `b3_notson` | S2, am Bus | „Er kommt mit dem nächsten. Mein Sohn ist jung.“ |
| `b3_gate` | S2, Jela | Mate stand am Tor, am Pfosten. Den Schlüssel bekam der Kleinste |
| `b3_lenakey` | S2, Lena | „Den hab ich nie gekriegt. Ich war ja nie da.“ |
| `b3_figs` | S2 | uneingepackte Feigen, Frost Sonntagnacht |
| `b3_sell` | S2, Davor | Montag beim Notar |
| `b3_letters` | S2 | Mates Briefe: „Smokve su rodile. Kad ćete doći?“ |
| `b3_kidsroom` | S2 | Kinderzimmer von 1998, deutsches Kinderbuch; Feigenbaum 1997 |
| `b3_invite` | Schluss | `b3_letters` + `b3_kidsroom`: eine Einladung, die sich nicht traut |
| `b3_cards` | S2, Mates Schublade | Lenas Postkarten an den Opa |
| `b3_pencil` | S2, Mates Schublade | unter jedem „Lieber Opa“: „Dragi dida.“ |
| `b3_zdravko` | S2, Zdravko | „Ein Kaffee, zwei Stunden. Das war Dida Mate.“ |
| `b3_dida` | Schluss | `b3_cards` + `b3_pencil` (oder `b3_zdravko` + `b3_pencil`): So wollte er heißen |
| `e3_father` | S1, Vatergespräch | Marko hat seinen Vater nie gesucht |
| `e3_kolar` | S2 | Frau Kolar: „Und Sie? Haben Sie jemanden?“ |
| `e3_avoid` | Schluss | `e3_father` + `e3_kolar`: Du suchst mich, damit du ihn nicht suchen musst |
| `e3_mothersample` | S2 | „Lebt Ihre Mutter? Mit ihrer Probe geht es schneller.“ |
| `e3_since` | S1, Brücke im Epilog | seit dem Winter 1994 bei ihm, leer und unsichtbar |

Falsche Verbindungen beantwortet das Gerüst. Wer im Gespräch eine Notiz zeigt, nutzt `A.askNote()` wie in Kapitel 2, siehe `rooms/kula.js`.

## 9. Gegenstände

In `game/src/12_k3_items.js`. Alle haben `look` und `mala`.

**Aus Kapitel 2 weiter:**
- `dzezva`, `mobitel`, `olovka`, `km` (Mark)
- `photo_full`: Foto 1988. Vlado und Zlata sagen: „Das ist ein Kind.“

**Neu:**

| Gegenstand | Bedeutung |
|---|---|
| `rueckfahrt` | Rückfahrkarte Mostar–Sarajevo; sie wird im Epilog benutzt |
| `plan` | Stadtplan Mostar, vom Kiosk (S1). Mit ihm öffnet sich der Stadtplan; `M.k3Peil` braucht ihn |
| `ulaznica` | Eintritt Minarett (S1) |
| `deka` | Zlatas graue Decke (S3). Wird Mala gezeigt (`give` an Mala oder `use` mit Mala) |
| `kljuc_mate` | Mates Hausschlüssel aus der Astgabel; Marko gibt ihn Lena (S2) |
| `vizitka` | Davors Karte („Falls Sie mal in München sind.“) |
| `brief1996` | Zlatas Brief von 1996, Epilog (S3). Geht an Nada |
| `skizzenbuch` | Lanas Skizzenbuch, Epilog (S3) |
| `formular` | das Formular der Vermisstenstelle (S2) |

Der Schlüssel von Zimmer 31 und die Zeichnung bleiben bei Vlado: Sie liegen ab Freitag auf seinem Schreibtisch im Büro (Raumzustand `S.drawerOpen`). Sie sind kein Gegenstand.

Wer etwas gibt oder nimmt, nutzt `A.give(id)` und `A.take(id)`.

## 10. Finale: Zwischenstände und Laden

Das Finale ist eine Folge von Szenen mit Spielerhandlungen dazwischen: läuten, als Mala einsteigen, über die Brücke gehen, mit Zlata reden, am Grab fragen. Drei feste Zwischenstände plus einer vor der Zwischenwelt. **S3 ruft `await M.k3Checkpoint(A,n)` genau hier:**

| cp | Wann | Was beim Laden stimmen muss |
|---|---|---|
| 1 | nach Batos Erkenntnis („Steig ein. Diesmal fahre ich.“), vor Malas Entscheidung | `skela_d`, Fähre `here` (`k3.fin.ferry`), Bato auf der Fähre, Vlado und Kata an der Straße, Marko bei der Glocke |
| 2 | nach der Überfahrt am linken Ufer („Heute ist einer gekommen.“) | `skela_l`, Fähre `left`, Mala am Anleger, Marko, Vlado und Kata im Hof |
| 3 | nach Zlatas vollständiger Aussage, wenn die Leine frei ist (`k3.fin.free`) | `skela_l`, Mala am Grab, Zlata an der Tür |
| 4 | nach der Zustimmung am Grab (`k3.fin.bond`), vor der Zwischenwelt | `skela_l`, dann gleich die Zwischenwelt mit Bato |

**Raumaufbau aus Schaltern:** Wer wo steht, ergibt sich in `actors(S,G)` und `state(G)` **aus den Schaltern**, nicht aus dem Ablauf. Dann stimmt ein geladener Stand von selbst.

**`M.k3FinResume(A)` (S3)** ruft das Gerüst nach dem Laden in `k3_fin_n` auf, sobald `k3.fin.drive` gesetzt ist:
- Sie setzt automatische Szenen fort, die dort fehlen, zum Beispiel Zlatas Erzählung nach cp 2.
- Nach cp 4 betritt sie die Zwischenwelt neu.
- Wartet der Spieler auf eine eigene Handlung (einsteigen, am Grab reden), tut sie nichts.

Ohne `k3.fin.drive` startet das Gerüst die Finalnacht neu (`vhof`, Abfahrt).

**Prüfung:** Das Laden an jedem Zwischenstand, auch nach einem Neustart, wird automatisch getestet.

## 11. Musik und Geräusche

**Musik** (`A.music(id)`, vom Audio-Agenten):

| ID | Wofür |
|---|---|
| `k3_bus` | Busfahrt |
| `k3_mostar` | Ostufer bei Tag |
| `k3_istraga` | Westufer, Werkstatt |
| `k3_noc` | Nacht in der Herberge |
| `k3_aussie` | die Australier singen |
| `k3_skela` | Skela |
| `k3_mate` | Mates Thema |
| `k3_duh` | Geister und Erkenntnis |
| `k3_limbo` | Zwischenwelt |
| `k3_fin` | Finale, Glocke und Fähre |
| `k3_grob` | nach der Entscheidung am Grab |
| `k3_epi` | Epilog |
| `k3_end` | Abspann |

Das Grab ist zuerst ohne Musik: `A.music(null)`, oder die Raummusik ist leer.

**Klangkulisse** je Raum: `scape:'k3_<raumid>'` in `M.room(...)`.

**Neue Geräusche** (`A.sfx(name)`):
- Fähre und Wasser: `ferrybell`, `rope`, `ferryCreak`, `splash`
- Fahrzeuge: `scooter`, `taxi`, `truckStart`, `busBrake`
- Werkstatt: `compressor`, `wrench`, `tarp`
- Dinge: `egg`, `lighter`, `lantern`, `keyDrop`, `drawer`, `typing`
- Menschen und Tiere: `cough`, `guitar`, `hens`
- Ofen und Radio: `stoveFire`, `radioPips`
- Wetter und Ferne: `windGust`, `bellsFar`

Dazu die vorhandenen aus Kapitel 1 und 2: `shimmer`, `click`, `paper`, `page`, `whoosh`, `dog`, `cups` und andere, siehe `04_audio.js` und `16_k2_audio.js`.

## 12. Technische Muster (aus Kapitel 2 übernehmen)

**Raum:**

```js
M.room('<id>',{name:'…', scape:'k3_<id>', music:function(G){ … }, state:function(G){ return {…}; },
  actors:function(S,G){ return [ {id:'vlado',x:M.apos('vulkanizer','vlado')[0],y:…,f:'L',idle:'work'}, … ].filter(…); },
  enter:async function(A,from){ … }, hotspots:[ … ] });
```

- Phasenabhängige Inhalte über `vis:function(S,G){ … }`.
- Ausgänge: `{id:'exit',name:'Stadtplan',exit:{to:'map'}}`; zu anderen Räumen `exit:{to:'<raum>'}`. Gesperrt wird mit `canExit:async function(A){ … return false; }`.

**NPC-Hotspot:**

```js
{id:'vlado',npc:'vlado',name:'Vlado',hgt:44,talk:…,look:…,give:{…},g:{look:…,listen:…,sense:…}}
```

**Gesprächsmenü:** `A.menuLoop(function(){ return [ {t:'…',once:'key',go:async function(A){ … }}, …, {t:'(Gehen.)',bye:true} ]; })`. Dazu in jedem Mala-Menü `M.hintTalkOpt(A)`, das Hinweise auf Wunsch gibt.

**Geister:** `{id:'mate',ch:'mate',ghost:true,…}` in `actors`. Sichtbar für Marko erst nach `A.found('mate')`, das Mala auslöst, wie Tomaž in `rooms/kula.js`. Die Erkenntnis kommt mit `await A.realize('mate', async function(){ … })`. Die Zwischenwelt nach dem Vorbild von `97_k2_limbo.js` (Mates und Batos Requisit und Ansicht malt der Kunst-Agent in `rooms/art/limbo.js` unter `S.who==='mate'` und `'bato'`):
- `M.LIMBO_GHOST.mate={name:'Mate',idle:'wait'}`
- `M.limboIntro` erweitern
- das Requisit `prop` je `who` belegen

**Erinnerungsbilder:**

```js
await A.memory({title:'…',tint:'ghost'|'memory',draw:M.mem.k3_xxx,lines:[…]})
```

Die IDs stehen in `ROOM_SPECS3.md`.

**Telefon:** `A.phoneVoice(text, who)`, wie bei Nada in Kapitel 2. Die SMS als `A.doc` oder in Markos Worten.

**Speichern:** Nie selbst `A.save()` außer an den Zwischenständen im Finale (über `M.k3Checkpoint`).

## 13. Prüfen

Baue isoliert, nie nach `web/`:

```
node game/build.js --out /tmp/claude-0/-home-user-Hotel/c0d2778b-f95c-5a19-86e2-dac79ed281be/scratchpad/<agent>/build
```

Prüfe deine Räume mit:

```
node game/tools/roomshot.js --room <id> --phase <phase> --out …png
```

Den gebauten Pfad setzt du mit `MALA_HTML=<build>/index.html`.

Schreibe ein eigenes Prüfskript nach dem Vorbild von `game/tools/walkthrough2.js` und `game/tools/driver.js`. Es spielt deine Ketten mit `M.TA` (Test-API) durch und setzt Vorbedingungen fremder Teile über Schalter und Notizen. Melde Fehler in fremden Dateien, statt sie zu ändern.
