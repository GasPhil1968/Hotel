# Kapitel 4 (München) – Vorgabe für Gerüst, Kunst und Skripte

Verbindlich für alle, die an Kapitel 4 arbeiten. **Grundlage ist `KAPITEL4_KONZEPT.md`.** Handlung, Zitate, Rätsellogik und die beiden Schlüsseldialoge stehen dort:
- 4.5 Handlung;
- 5 Figuren;
- 6 Struktur;
- 7 Rätsel;
- 8 Dialoge.

Dieses Papier legt fest:
- wer welche Datei schreibt;
- alle IDs (Räume, Schalter, Notizen, Gegenstände, Musik, Geräusche, Erinnerungsbilder);
- die Funktionen zwischen den Teilen;
- wann ein Tag endet;
- wie die Silvesternacht geladen wird.

Kunst: `game/ROOM_SPECS4.md`. Figuren: `game/CAST4.md`. Engine: `game/ART_API.md`, `game/PORTRAIT_API.md`. Vorbild für alles Übrige ist Kapitel 3: `game/K3_SPEC.md`, `game/src/96_k3_story.js`, die Räume aus Kapitel 3 in `game/src/rooms/`.

## 1. Grundsätze

**Ton und Sprache**
- Kurze Sätze, Pausen (`await A.wait(ms)`), trockener Humor, Wärme. Nicht jeder Satz ist ein Aphorismus.
- Marko erzählt in der ersten Person, im Präsens.
- **Bairisch, Italienisch und Bosnisch** stehen so im Spiel, wie die Figuren sprechen. Danach kommt die Übersetzung, meist durch Marko („Er sagt: …“), oder in Anführungszeichen als Markos Wiedergabe, wie in Kapitel 3.
- Mala versteht Schuldeutsch, aber kein Bairisch und kein Italienisch. Deutsch spricht sie selten und einfach.
- Bairisch maßvoll schreiben, lesbar für alle: „Sie san ned vo do.“, „Servus“, „Passt scho“.

**Keine Zeichen von Religion, Volkszugehörigkeit oder Nation**
- keine Kirchen- oder Moscheeszenen, keine Kreuze;
- keine Zuordnung des Vaters oder der Opfer zu einer Seite;
- die Bahnhofsmission nur als Einrichtung;
- Weihnachten als Familienfest, Neujahr mit Tannenbaum und Djed Mraz.

**Fairness**
- Was zwingend ist, sagt eine Figur offen. Keine Pixelsuche.
- Jeder Fehlversuch hat eine eigene Antwort und öffnet den Weg wieder. Keine Sackgassen.
- **Wissen nur aus dem Spiel:** Figuren und Marko nennen nichts, was der Spieler noch nicht erfahren hat. Vor allem „Brauerei“, „19. April“, „Kanister“, „Gleis 11“ und „Giuseppe“ erst nach der passenden Notiz oder dem Schalter (Lehre aus Kapitel 3, E-01 und K3-06).
- **Keine Wegweisung in automatischen Reaktionen.** Mala widerspricht mit Werten, nicht mit nächsten Schritten.
- Im Gespräch zeigt das Notizbuch höchstens vier passende Notizen (Gerüst).

**Geisterregeln** (bestätigt, nicht brechen)
- Marko sieht einen Geist erst, wenn Mala ihn gefunden hat (`A.found(id)`).
- Ein ungefundener Geist in der Nähe macht Kopfschmerz. Die Vignette zeichnet die Engine.
- Lebende hören Mala nicht. Katzen sehen sie, und manchmal ein Kind, das zu lange hinsieht (Niko).
- Hinübergehen kann nur, wer losgelassen hat. Mala öffnet die Schwelle und bleibt am Rand. In der Zwischenwelt spielt man Marko, er tut das Letzte.
- „Wer losgelassen hat, kann etwas hergeben“: Gerdas Kanne wird stofflich.
- Hansi geht ohne Zwischenwelt. Er braucht nur seinen Feierabend.

**Mala in München** (neu, Folge des Finales von Kapitel 3)
- Sie geht allein durch Ausgänge und reist allein über den Stadtplan. Das Gerüst schaltet es frei (Abschnitt 4).
- Sie fasst nichts an und telefoniert nicht.
- Sie ist Partnerin, keine Hinweisgeberin. Ihre Grenzen und ihr Nein stehen im Konzept (5.2).

**Kein langer Ablauf ohne Spieler**
- Höchstens etwa 12 Zeilen hintereinander ohne Auswahl, Ausnahme die Erzählungen in Erinnerungsbildern.
- Lange Gespräche (Kolar, Carmela, Silvesternacht) bekommen Auswahl dazwischen.

**Umfang** (Richtwert; Kapitel 3 hat 3048 Zeilen)
- etwa 2900 bis 3300 Dialog- und Erzählzeilen, davon Mala etwa 600;
- jeder Hotspot hat `look`, fast alle `g:{look}`, viele `use`, `take`, `open` mit eigener Antwort;
- jede Figur hat ein Gesprächsmenü, das sich mit neuem Wissen ändert.

## 2. Zuständigkeiten

| Teil | Räume (Logik `game/src/rooms/<id>.js`) | Szenen und Funktionen | weitere Dateien |
|---|---|---|---|
| **S1 Familie** | `zob`, `hacker`, `jhaus`, `jwohnung`, `jschlaf`, `ana`, `wiesn`, `konsulat` | Ankunft und Hansi; Jasna kommt heim; Heiligabend; Schlüsseldialog 1; Spaziergang; Džezva-Abend; Malas Kiste; Kolars Anruf; Ana am Dienstag; Jasna erkennt Sepp; Probe im Konsulat (Fassung nein); Streit; Ana am Freitag; Hackerbrücke (Dialog 2); Silvesterabend, Spur, **das Silvestergespräch** (`M.k4Silvester`); Epilog; alle Mala-Gesprächsmenüs | `97_k4_mala.js`, `98_k4_intros_fam.js` |
| **S2 Bahnhof** | `gleis11`, `bmission`, `bunker`, `barsport`, `friedamt`, `balkon` | Fall A (Sepp) ganz, mit Anruf bei Carmela, Zwischenwelt und Abschied am Donnerstag; Davor und Lena (Anruf, Balkon, Jela, Angebot zu fahren) | `97_k4_limbo_sepp.js`, `98_k4_intros_bhf.js` |
| **S3 Heim** | `heim`, `heim_flur`, `heim_raum`, `heim214` | Fall B (Gerda) ganz, mit Versuch, Gerdas Entschluss, Abschied, Zwischenwelt, Kanne; Jasna bei der Arbeit (Tag 1 bis 4); das Heim in der Silvesternacht (Zustände, Kevin, Zimmer 214). Ruft `M.k4Silvester` auf. | `97_k4_limbo_gerda.js`, `98_k4_intros_heim.js` |
| **Gerüst** | – | Phasen, Kapitelstart, Übernahmen, Tageswechsel, Bett, Stadtplan, Reiseregeln, Mala allein, Notizen und Schlüsse, Gegenstände, Zwischenstände, Abspann, Kapitelwahl | `96_k4_story.js`, `13_k4_notes.js`, `12_k4_items.js`, `15_hints_k4.js`, Engine-Anschlüsse |
| **K1 bis K3 Kunst** | `rooms/art/<id>.js` nach `ROOM_SPECS4.md` | – | K3 zusätzlich: Stadtplan, Erinnerungsbilder (`97_k4_mem.js`), Zwischenwelt-Requisiten (`rooms/art/limbo.js` erweitern) |
| **F Figuren** | – | Spielfiguren (`14_k4_cast.js`), Porträts (`portraits/<id>.js`) | nach `CAST4.md` |
| **T Ton** | – | Musik, Klangkulissen, Geräusche (`16_k4_audio.js`) | |

Ändere keine Datei eines anderen Teils und keine Gerüstdatei. Fehlt dir eine Gerüstfunktion, rufe sie so auf, wie sie hier steht, und schreib es in deinen Bericht. Fehlende Funktionen anderer Teile prüfst du mit `if (M.k4Xyz) await M.k4Xyz(A); else …` und einem kurzen Ersatz.

## 3. Phasen und Tageswechsel

| Phase | Zeit | Tageszeit (`tod`) | Wetter-Schlüssel |
|---|---|---|---|
| `k4_pro` | Sa 24.12., Heiligabend, Morgen bis Nachmittag | `day` | `snow` (Neuschnee, leichter Schneefall) |
| `k4_pro_n` | Sa 24.12., Abend und Nacht | `night` | `snowlie` (Schnee liegt, klar) |
| `k4_d1` | So 25.12., Christtag | `day` | `snowlie` (klar, kalt) |
| `k4_d1_n` | So 25.12., Abend und Nacht | `night` | `snowlie` |
| `k4_d2` | Di 27.12. | `day` | `thaw` (grau, Tauwetter, Matsch) |
| `k4_d2_n` | Di 27.12., Abend | `night` | `thaw` |
| `k4_d3` | Mi 28.12. | `day` | `snow` |
| `k4_d4` | Do 29.12. | `day` | `snowlie` |
| `k4_d4_n` | Do 29.12., Abend | `night` | `snowlie` |
| `k4_d5` | Fr 30.12. | `day` | `fog` (Nebel) |
| `k4_d5_n` | Fr 30.12., Nacht | `night` | `fog` |
| `k4_fin_a` | Sa 31.12., Silvesterabend bei Ana | `night` | `frost` (klar, Schnee liegt) |
| `k4_fin_n` | Sa 31.12., Silvesternacht | `night` | `frost`, dazu Feuerwerk |
| `k4_epi` | So 1.1.2012, Neujahr, Vormittag | `day` | `sun` (Sonne auf altem Schnee) |

**Schnee:** Draußen liegt in allen Phasen Schnee. Nur in `thaw` ist er grau und nass, in `sun` glitzert er. Die Kunst liest `M.scn.weather(GS)`. Unbekannte Schlüssel behandelt sie wie `snowlie`.

**Wer wechselt die Phasen?** Nur das Gerüst. Skripte setzen ihre Schalter und rufen am Ende einer Szene, die einen Abschnitt beenden kann, **`await M.k4DayCheck(A)`** auf. Das Gerüst ruft es auch bei jedem Raumwechsel. Ins Bett geht man in `jwohnung` (Couch, Spot `sofa`). S1 ruft dort `M.k4Bed(A)` auf.

| Wechsel | Bedingung | Was das Gerüst tut |
|---|---|---|
| `k4_pro` → `k4_pro_n` | `k4.p.hansi`, `k4.p.jasna` | Marko: „Ana wartet.“ Karte „Heiligabend · Abend“. `ana` bei Nacht, dann `await M.k4Eve(A)` (S1). |
| `k4_pro_n` → `k4_d1` | `k4.p.eve`, `k4.p.talk1` | `M.k4Eve` endet mit der Rückkehr nach `jwohnung` und ruft `M.k4Talk1` auf (S1). Danach Bett. Karte „Erster Tag · Christtag“, Aufwachen in `jwohnung`, `await M.k4Wake(A,'k4_d1')` (S1). |
| `k4_d1` → `k4_d1_n` | Notizen `s4_peppino`, `g4_gerda`, `z4_stiefel` | Karte „Christtag · Abend“, `jwohnung`, `await M.k4Dzezva(A)` (S1). |
| `k4_d1_n` → `k4_d2` | `k4.d1.dzezva`, `k4.d1.box` (Mala hat gelesen) | Bett. Karte „Zweiter Feiertag“ mit dem Satz aus dem Konzept (4.5), dann Karte „Zweiter Tag · Dienstag“, `jwohnung`, `await M.k4KolarCall(A)` (S1). |
| `k4_d2` → `k4_d2_n` | `z4_ana2004`, `s4_name`, `g4_drei` | Karte „Dienstag · Abend“, `jwohnung`, `await M.k4JasnaNotice(A)` (S1, braucht `s4_name`). |
| `k4_d2_n` → `k4_d3` | `z4_ankunft` | Bett. Karte „Dritter Tag · Mittwoch“, `M.k4Wake(A,'k4_d3')`. |
| `k4_d3` → `k4_d4` | `k4.s.crossed`, `k4.g.decided`; in Fassung „Probe nein“ auch `k4.e.sample2` | von selbst (es gibt keine Mittwochnacht): Marko: „Morgen ist Donnerstag.“ Karte „Vierter Tag · Abschiede“, Aufwachen in `jwohnung`, `M.k4Wake(A,'k4_d4')`. |
| `k4_d4` → `k4_d4_n` | `k4.s.farewell`, `k4.g.thermos` | Karte „Donnerstag · Abend“, `jwohnung`, `await M.k4Fight(A)` (S1). |
| `k4_d4_n` → `k4_d5` | `k4.d4.fight` | Bett (Mala ist fort). Karte „Fünfter Tag · Freitag“, `M.k4Wake(A,'k4_d5')`. Mala bleibt unauffindbar, bis die Bedingungen für die Nacht erfüllt sind (Abschnitt 4). |
| `k4_d5` → `k4_d5_n` | `k4.d5.ana` und der Schluss `z4_zweistaedte` | Karte „Freitag · Nacht“, `hacker`, `await M.k4Bridge(A)` (S1, Dialog 2) |
| `k4_d5_n` → `k4_fin_a` | `k4.d5.bridge` | von selbst nach der Brücke: Karte „Finale · Silvester“, dann `ana` bei Nacht, `await M.k4SilvesterEve(A)` (S1). |
| `k4_fin_a` → `k4_fin_n` | `k4.fin.gone` (Jasna ist fort; setzt S1 in `M.k4SilvesterEve`) | kein Bildwechsel: S1 ruft nach dem Setzen `await M.k4DayCheck(A)`, das Gerüst stellt nur die Phase um (`M.k4FinGone`). Die Suche beginnt (S1). |
| `k4_fin_n` → `k4_epi` | `k4.fin.done` | Abblende. Karte „Epilog · Neujahr · Sonntag, 1. Januar 2012“, `jwohnung` (Küche), `await M.k4Epilogue(A)` (S1). |
| Ende | `k4.e.done` (setzt S1 am Ende des Epilogs) | `M.endChapter4(A)`: Karte „Ende des vierten Kapitels“ / „Fortsetzung: Sarajevo“, Abspann |

Fehlt eine Bedingung, sagt `M.k4Bed` mit einem Satz, *was* fehlt, aber nicht *wo* (Gerüst, `M.k4Missing(G)`). Ins Bett geht man nur in den Nächten `k4_pro_n`, `k4_d1_n`, `k4_d2_n`, `k4_d4_n`; alle anderen Wechsel laufen von selbst.

## 4. Stadtplan und Reisen

`M.MAPLOCS4` (Gerüst):

| Ort-ID | Ziel | Name auf dem Plan | freigeschaltet |
|---|---|---|---|
| `zob` | `zob` | Hackerbrücke / ZOB | Kapitelbeginn |
| `westend` | `jhaus` | Westend (Mama) | Kapitelbeginn (Anas SMS) |
| `giesing` | `ana` | Giesing (Ana) | Gerüst, mit `k4.p.jasna` |
| `wiesn` | `wiesn` | Theresienwiese | S1, am Tag 1 mit Anas Vorschlag |
| `heim` | `heim` | Haus am Bavariapark | S1, Tag 1, wenn Jasnas Brot gefunden ist (`k4.d1.bread`) |
| `hbf` | `gleis11` | Hauptbahnhof | Kapitelbeginn (sichtbar vom ZOB) |
| `bhfviertel` | `barsport` | Bahnhofsviertel | S2, mit `s4_fluch` oder `s4_peppino` |
| `friedhof` | `friedamt` | Städtische Friedhöfe | S2, wenn Frau Wimmer die Bestattung erwähnt (`k4.s.wimmer`) |
| `moosach` | `balkon` | Moosach (Davor) | S2, nach dem Anruf bei Davor (`k4.v.called`) |
| `konsulat` | `konsulat` | Generalkonsulat | S1, nur Fassung „Probe nein“, nach Kolars Anruf |
| `hacker` | `hacker` | Hackerbrücke (Brücke) | nicht auf dem Plan. Vom `zob` aus zu Fuß (Ausgang), in `k4_d5_n` setzt das Gerüst Marko dorthin. |

Freischalten mit `A.unlock('<ort>')`.

**Reiseregeln** (Gerüst, `M.canTravel`)
- **Nachtphasen** (`k4_pro_n`, `k4_d1_n`, `k4_d2_n`, `k4_d4_n`, `k4_d5_n`): kein Reisen. „Es ist Abend. Mama hat gekocht.“ In `k4_d5_n` ist Marko auf der Brücke, dort gilt nur der Rückweg.
- **Silvester:**
  - `k4_fin_a`: nur `ana`.
  - `k4_fin_n`: erst nach `k4.fin.trail` (Mala weiß die Richtung), dann nur `heim`. Bei der Reise fragt das Gerüst nach dem Weg: Nachttram, zu Fuß, oder Davor, wenn `k4.v.car`. Es setzt `k4.fin.ride`. S1 erzählt die Fahrt in `M.k4Ride(A)`.
- **Epilog:** kein Reisen.
- **Heim:** Am Tag 1 erst mit `k4.d1.bread`. Sonst gilt im Heim Besuchszeit 10 bis 18 Uhr, also immer im Tag.
- **Freitag (`k4_d5`):** frei.

**Mala allein** (Gerüst, neu)
- In allen Tagesphasen von Kapitel 4 darf die aktive Mala Ausgänge nehmen und den Stadtplan benutzen. Marko bleibt, wo er ist.
- Wechselt der Spieler zu Marko, wird dessen Raum geladen.
- Geht Marko, während Mala in einem anderen Raum ist, bleibt sie dort. Ist sie im selben Raum, folgt sie wie immer.
- `A.malaHere()` sagt, ob sie bei Marko ist.
- Am Abend jeder Phase setzt das Gerüst beide in den Startraum.
- **Ausnahmen:**
  - `k4_d4_n` bis `k4_d5`: Mala ist fort. Sie ist nicht wählbar und unsichtbar, bis die Bedingungen für `k4_d5_n` erfüllt sind. Dann wartet sie auf der Hackerbrücke.
  - `k4_fin_n`: Mala ist bei Marko. Bei der Spur darf sie als Aktive aus `ana` hinausgehen; das regelt S1.
- `M.k4MalaAway(G)` liefert `true`, solange Mala fort ist. Das Gerüst setzt dann `G.malaOn=false`: Sie ist nirgends zu sehen, und der Wechsel zu ihr geht nicht.
- **Nachts** darf Mala allein nur durch die Türen in Mamas Wohnung (`jwohnung`, `jschlaf`, `jhaus`); so kommt sie am Christtag-Abend an die Kiste.
- **Was das für die Skripte heißt:** `enter`, `canExit` und Gespräche laufen auch, wenn Mala allein kommt (`A.G.active==='mala'`, Marko ist woanders). Dann spricht keine lebende Figur sie an, und Marko sagt nichts. Lebende hören sie nicht, Katzen sehen sie. Prüft `A.G.active` in jedem `enter` und `canExit`.
- **Szenenwechsel:** `await M.k4Bring(A,'raum',{at:[x,y,'L'],enter:false})` bringt Marko (und Mala, wenn sie da ist) an einen Ort, auch wenn gerade Mala in einem anderen Raum die Aktive ist.

**Leine:** In Kapitel 4 zeichnet die Engine keine Leine. Der neue Faden erscheint nur, wenn Mala und Marko im selben Raum sind und eine Szene ihn ausdrücklich zeigt (Gerüst, `M.k4Leash(G)` = `'bond'` oder `'none'`).

## 5. Gerüstfunktionen

| Funktion | Zweck |
|---|---|
| `await M.k4DayCheck(A)` | Am Ende jeder Szene, die eine Bedingung setzt. Wechselt, wenn alles erfüllt ist. |
| `await M.k4Bed(A)` | die Couch in `jwohnung` (S1). Schläft oder sagt, was fehlt. |
| `M.k4Carry` | Übernahmen (Abschnitt 6) |
| `M.k4AskOpt(A,key)`, `M.k4Asked(A,key)` | „(Mala fragen.)“ (Abschnitt 7) |
| `await M.k4Checkpoint(A,n)` | fester Zwischenstand in der Silvesternacht (Abschnitt 11) |
| `M.k4MalaAway(G)` | ob Mala fort ist (Donnerstagabend bis Freitagnacht) |
| `M.k4Variant(G)` | `'yes'` oder `'no'`, die Probe aus Kapitel 3 |
| `M.k4NoteMala(id)`, `M.k4NoteHidden(id)` | ob eine Notiz Malas Geheimnis ist (Abschnitt 9). Im Gespräch als Marko zeigt das Gerüst diese Notizen erst nach `k4.r.shared`. |
| `await M.k4Bring(A,room,{at,enter,noMala})` | Szenenwechsel mit Marko, auch wenn Mala anderswo aktiv ist |
| `M.k4Missing(G)` | was am Tag noch fehlt (ein Satz ohne Ort), für Bett und Hinweise |
| `M.k4Queue(key)`, `M.K4REACT[key]` | Reaktionen im Leerlauf, z. B. `'ded:s4_name'` nach einem Schluss. Skripte dürfen eigene Reaktionen eintragen (`M.K4REACT['ded:…']=async function(A){…}`); sie ersetzen die Grundreaktion des Gerüsts. |
| `M.k4Phone(A)`, `M.K4PHONE[key]` | das Handy („Anrufen“): Kontakte `jasna`, `ana`, `nada`, `kolar`, `davor`, `carmela` erscheinen nach dem Stand der Geschichte. Die Skripte tragen ihre Gespräche ein, z. B. `M.K4PHONE.davor=async function(A){…}` (S2; die Karte `vizitka` ruft `M.k4UseCard`, falls es sie gibt). |
| `M.k4Fireworks(GS)` | Feuerwerk sichtbar: in `k4_fin_n` immer, in `k4_fin_a` ab dem Schalter `k4.fin.late` (S1 setzt ihn kurz vor 23:15) |
| Schalter `k4.bond` | zeigt den neuen Faden zwischen beiden, solange er gesetzt ist (S1 setzt und löscht ihn in Szenen) |

Phasenstarts ruft nur das Gerüst auf: `M.startChapter4`, `M.k4StartEve`, `M.k4StartD1`, `M.k4StartD1Night`, `M.k4StartD2`, `M.k4StartD2Night`, `M.k4StartD3`, `M.k4StartD4`, `M.k4StartD4Night`, `M.k4StartD5`, `M.k4StartD5Night`, `M.k4StartFinale`, `M.k4StartEpilogue`, `M.endChapter4`.

**Die Funktionen der Skripte**, die das Gerüst aufruft (alle `async (A)`):

| Funktion | Teil | Wann |
|---|---|---|
| `M.k4Arrive` | S1 | Kapitelstart am ZOB, nach dem Erinnerungsbild |
| `M.k4Eve` | S1 | Heiligabend bei Ana. Endet in `jwohnung` mit `M.k4Talk1`. |
| `M.k4Talk1` | S1 | Schlüsseldialog 1, setzt `k4.p.talk1` |
| `M.k4Wake(A,phase)` | S1 | Morgen in `jwohnung` (Tag 1, 3, 4, 5) |
| `M.k4Dzezva` | S1 | Abend Tag 1. Am Ende geht die Nacht weiter: Mala allein, Spieler wechselt zu ihr. Schlafzimmer `jschlaf`, Kiste (setzt `k4.d1.box`). |
| `M.k4KolarCall` | S1 | Morgen Tag 2 |
| `M.k4JasnaNotice` | S1 | Abend Tag 2 |
| `M.k4Fight` | S1 | Abend Tag 4 |
| `M.k4Bridge` | S1 | Nacht Tag 5, auf der Hackerbrücke |
| `M.k4SilvesterEve` | S1 | Silvesterabend bei Ana bis „Jasna ist fort“ |
| `M.k4Ride` | S1 | die Fahrt zum Heim (Gerüst ruft sie bei der Reise in `k4_fin_n`) |
| `M.k4Silvester` | S1 | das Gespräch in Zimmer 214 (S3 ruft es beim Betreten auf) |
| `M.k4FinResume` | S1 | nach dem Laden in `k4_fin_n` (Abschnitt 11) |
| `M.k4FinAResume` | S1 | nach dem Laden am Silvesterabend (`k4_fin_a`, vor `k4.fin.gone`) |
| `M.k4BridgeResume` | S1 | nach dem Laden auf der Brücke (`k4_d5_n`, vor `k4.d5.bridge`); ohne sie startet `M.k4Bridge` neu |
| `M.k4LookAtMala`, `M.k4TalkToMala`, `M.k4MalaToMarko`, `M.k4MalaLooksAtMarko` | S1 | Malas Gesprächsmenüs in Kapitel 4 (`97_k4_mala.js`), wie die `k3…`-Gegenstücke |
| `M.k4Epilogue` | S1 | Neujahr bis `k4.e.done` |

## 6. Übernahmen

**Aus Kapitel 3** liest das Gerüst `localStorage['mala.c3end']`, aus Kapitel 2 `localStorage['mala.c2end']`. Beim Start legt es die Werte als Schalter ab:

| Schalter | Werte | Vorgabe ohne Stand |
|---|---|---|
| `k4.c3.consent` | `'a'`, `'b'`, `'c'` | `'b'` |
| `k4.c3.promise` | `'a'`, `'b'`, `'c'` | `'a'` |
| `k4.c3.talk2` | `'a'`, `'b'`, `'c'` | `'a'` |
| `k4.c3.sample` | `true` / `false` | `true` |
| `k4.c3.asks`, `k4.c3.skips` | Zahl | 3, 0 |
| `k4.c2.ana`, `k4.c2.father` | `true` / `false` | `false` |
| `k4.c3.fromSave` | ob ein Stand da war | – |

`M.k4Carry` gibt sie als Objekt zurück: `{consent, promise, talk2, sample, asks, skips, ana, father, fromSave}`.

**Notwendige Handlungsvarianten**
- **Probe:** Kolars Anruf in zwei Fassungen, im Konsulat nur bei „nein“. Im Silvestergespräch steht eine andere Zeile.
- **Zustimmung c:** Die Frage im Epilog ist Pflicht.

Alles Übrige sind Dialogfarben (Konzept 10.3).

## 7. „Mala fragen“ in Kapitel 4

Das System bleibt nur für **Malas eigene Geschichte**, wenn Marko Ana oder Jasna von Lana erzählt. Für Markos Familie gibt es **keine** Rüge.

Aufruf:

```js
var ask=M.k4AskOpt(A,'lana_jasna');
await A.menuLoop(function(){ return [ask, …].filter(Boolean); });
```

Die Antworten schreibt S1 in `M.K4ASK.<key>`.

| key | Wann | Malas Antwort (Sinn) |
|---|---|---|
| `lana_jasna` | Prolog: Marko will Jasna sagen, dass er Lana gefunden hat | „Sag es ihr. Sie hat mir die Tür aufgemacht. Jeden Samstag.“ |
| `lana_ana` | Tag 1: Ana erfährt, dass Lana tot ist | „Sag ihr das mit der Straßenbahn. Das war ihres.“ |

`M.k4Skipped` gibt es nicht. Wer nicht fragt, wird nicht gerügt; Mala sagt höchstens später etwas Eigenes.

## 8. Schalter (`G.flags`, alle mit `k4.`)

**Gerüst:** `k4.moves` (Raumwechsel), `k4.c3.*` und `k4.c2.*` (Abschnitt 6), `k4.fin.cp`, `k4.r.shared` (setzt S1 im Streit: Malas Notizen sind jetzt Markos).

**S1 Familie**

| Schalter | Bedeutung |
|---|---|
| `k4.p.arrived` | Ankunft am ZOB |
| `k4.h.found`, `k4.h.wastl`, `k4.p.hansi` | Hansi gefunden; Wastl gefragt; Hansi hat Feierabend |
| `k4.p.key` | Frau Huber hat den Schlüssel gegeben |
| `k4.p.knock` | Malas Klopfen um 11:10 |
| `k4.p.coffee` | Kaffee in der Džezva |
| `k4.p.vanilice` | Nadas Dose an Jasna gegeben |
| `k4.p.lana` | Jasna weiß, dass Lana tot ist |
| `k4.p.jasna` | Jasna ist heim und hat „Nicht heute“ gesagt |
| `k4.p.niko` | Niko hat Mala gesehen |
| `k4.p.eve` | Heiligabend vorbei |
| `k4.p.talk1` | Schlüsseldialog 1 |
| `k4.d1.bread` | Jasnas Brot gefunden; geben setzt S3 `k4.g.bread` |
| `k4.d1.walk` | Spaziergang mit Ana |
| `k4.d1.drawing` | Ana hat Lanas Zeichnung erwähnt |
| `k4.d1.dzezva` | Abendgespräch über Ruža |
| `k4.d1.box` | Mala hat die Kiste gelesen |
| `k4.d2.kolar` | Kolars Anruf |
| `k4.d2.ana` | Ana hat 2004 zugegeben |
| `k4.d2.wait` | die Geschwister warten bis nach Neujahr |
| `k4.d2.notice` | Jasna hat Sepp erkannt |
| `k4.e.sample2` | Fassung „nein“: Probe in München abgegeben |
| `k4.d4.fight`, `k4.d4.slip` | Streit; Malas Satz über die Kanister |
| `k4.d5.ana` | Ana: „bis zur Kurve“ |
| `k4.d5.bridge` | Schlüsseldialog 2 |
| `k4.fin.eve`, `k4.fin.gone`, `k4.fin.trail`, `k4.fin.ride` | Silvesterabend; Jasna fort; Spur gelesen; Weg (`'tram'`, `'walk'`, `'davor'`) |
| `k4.fin.talk`, `k4.fin.step` | Gespräch begonnen; Fortschritt 1 bis 8 (Konzept 7.3, Teil C) |
| `k4.fin.kurve` | Marko hat die Kurve gesagt |
| `k4.fin.decide` | Jasna: „Ich fahre hin.“ |
| `k4.fin.ana` | Ana ist gekommen |
| `k4.fin.done` | Gespräch beendet |
| `k4.e.slippers`, `k4.e.nada`, `k4.e.obit`, `k4.e.mala`, `k4.e.consent2`, `k4.e.done` | Epilog |

**S2 Bahnhof**

| Schalter | Bedeutung |
|---|---|
| `k4.s.found`, `k4.s.talk` | Mala hat Sepp gefunden; Marko hat mit ihm geredet |
| `k4.s.wimmer`, `k4.s.kiosk`, `k4.s.enzo`, `k4.s.amt` | Gespräche |
| `k4.s.suitcase`, `k4.s.bunker` | Koffer offen; Mala im Bunker |
| `k4.s.fake` | falscher Brief geschrieben (Gegenstand `brief_falsch`) |
| `k4.s.letters` | Carmelas Briefe gelesen |
| `k4.s.call`, `k4.s.crossed` | Carmela angerufen; Sepp hinübergegangen |
| `k4.s.notice` | Frau Wimmers Aushang mitgenommen (Gegenstand `aushang`) |
| `k4.s.farewell`, `k4.s.jasna` | Abschied am Donnerstag; Jasna war dabei |
| `k4.v.called`, `k4.v.visit`, `k4.v.jela`, `k4.v.car` | Davor angerufen; Balkon; Jela angerufen; Davor fährt an Silvester |

**S3 Heim**

| Schalter | Bedeutung |
|---|---|
| `k4.g.bread` | Brot bei Jasna abgegeben (Tag 1) |
| `k4.g.found`, `k4.g.met` | Mala hat Gerda gefunden; Marko hat mit ihr geredet |
| `k4.g.obs` | Beobachtung um drei |
| `k4.g.chimeOff`, `k4.g.hall` | Versuchsbedingungen für den laufenden Nachmittag |
| `k4.g.test1`, `k4.g.test2` | Versuche gelungen |
| `k4.g.told`, `k4.g.decided` | Mala hat es Gerda gesagt; Gerda geht |
| `k4.g.goodbye`, `k4.g.thermos`, `k4.g.jasnaSaw` | letzter Besuch; Kanne bei Alois; Jasna hat es gesehen |
| `k4.g.blunt` | Marko hat Alois den Tod direkt gesagt (Fehlweg) |
| `k4.g.ertl` | Frau Ertl erlaubt einen Versuch mit der Wahrheit |

## 9. Notizen und Schlüsse

Alle Notizen stehen in `game/src/13_k4_notes.js` (Gerüst). Skripte rufen `A.note('<id>')` an der genannten Stelle. **Schlüsse zieht der Spieler im Notizbuch, nie das Skript.** Ausnahmen sind ausdrücklich markiert: „gibt das Skript“.

**Malas Geheimnis.** Was Mala in der Kiste liest, behält sie bis zum Streit für sich: `z4_nachricht`, `z4_antrag` (außer Mama sagt es Marko selbst, dann setzt S1 `k4.n.antragJasna`), `z4_passierschein` und ihr eigener Schluss `z4_tot` (`M.k4NoteMala`).
- Diese Notizen stehen im Notizbuch, aber im Gespräch als Marko erst nach `k4.r.shared` (S1 setzt es im Streit).
- Schlüsse mit ihnen gehen erst danach. Als Mala darf der Spieler `z4_tot` schon vorher ziehen (Konzept 7.3, B2).
- Die übrigen Notizen mit **(Mala)** (`s4_bunker`, `s4_carmela_hall`, `g4_kalt`, `r4_ursache`) erzählt sie Marko sofort. Sie gehören beiden.

**Aus Mostar** legt das Gerüst beim Start `k4_c_lana` (Lana ist gefunden) und `k4_c_vater` (Kolars Frage, Markos Antwort) ins Notizbuch.

**Im Gespräch** (`A.askNote(titel,{also:[…]})`) zeigt das Notizbuch in Kapitel 4 die gültigen Antworten aus `also` und füllt mit anderen offenen Notizen auf höchstens vier auf. Gebt deshalb bei jeder Frage `also` an.

| Notiz | Wer gibt sie, wo | Inhalt (Kurzform) |
|---|---|---|
| `u4_sms` | S1, ZOB | Anas SMS: Mama arbeitet bis 14 Uhr, Schlüssel bei Frau Huber |
| `u4_pantoffeln` | S1, `jwohnung` | Pantoffeln in Größe 44 an der Tür, gerade gestellt |
| `u4_dach` | S1, `jwohnung` | Mappe „Vratnik – krov“: achtzehn Jahre Geld für Ružas Dach |
| `u4_kiste` | S1, `jschlaf` | eine verschlossene Kiste im Schrank |
| `u4_klopfen` | S1, Jasna | Sie kennt Lanas Klopfen noch: zweimal kurz, einmal lang |
| `u4_nichtheute` | S1, Jasna | „Nicht heute. Heute ist Heiligabend.“ |
| `z4_stiefel` | S1, Spaziergang (Mala) | Erinnerung „Die gelben Stiefel“: Lana malte Ana eine Straßenbahn. Ana hat sie noch. |
| `z4_lesart` | S1, Džezva-Abend | Jasna: „Ruža hat geschrieben, er ist nicht zurückgekommen. Nicht, dass er tot ist. Ich kann lesen.“ |
| `z4_nachricht` | S1, Kiste **(Mala)** | Rotkreuz-Nachricht Mai 1993: „nije se vratio“; Nachhall: Ruža wollte „poginuo“, die Jungenstimme bat um „nije se vratio“ |
| `z4_antrag` | S1, Kiste **(Mala)**; zweiter Weg: Jasna auf die Frage nach dem Suchdienst (Tag 2) | Suchantrag 1994: „vermisst seit April 1993“ |
| `z4_passierschein` | S1, Kiste **(Mala)** | Passierschein Mai 1992; Nachhall: Jasna am Busfenster bis zur Kurve, „Fahrt. Wir kommen nach.“ |
| `z4_kolar` | S1, Kolars Anruf | Brauerei, April 1993, Rechenschieber „Z. V.“; Fassung ja: Übereinstimmung mit Anas Probe von 2004; Fassung nein: Kandidat |
| `z4_kode` | S1, Kolars Anruf | „In den Akten von dreiundneunzig steht oft ‚nije se vratio‘. Das schreiben Familien, die es wissen und nicht schreiben können.“ |
| `z4_ana2004` | S1, Kolars Anruf (Fassung ja) bzw. Ana (Fassung nein) | Ana hat 2004 in München eine Probe gegeben. |
| `z4_ankunft` | S1, Jasna erkennt Sepp | Juni 1992 am Bahnhof: Ein Mann mit Gepäckträgermütze trug ihre Tasche. „Polako, gospođo.“ |
| `z4_riss` | S2, Sepps Abschied | Jasna: „Ich war auf keiner Beerdigung seit 1992. Ich wusste nicht, für wen.“ |
| `z4_kurve_ana` | S1, Freitag | Ana: „Mama stand bis zur Kurve am Fenster. Danach hat sie nie wieder am Fenster gesessen.“ |
| `z4_vermisst` | Schluss | `z4_lesart` + `z4_antrag`: Mama hat es als „vermisst“ gelesen. |
| `z4_tot` | Schluss | `z4_nachricht` + `z4_kode`: In Sarajevo hieß es „tot“. |
| `z4_zweistaedte` | Schluss | `z4_vermisst` + `z4_tot`: Derselbe Satz, zwei Städte |
| `z4_dabei` | **gibt das Skript** (S1, Dialog 2, mit dem Erinnerungsbild) | Ich war dabei. 19. April 1993, Brauerei. |
| `z4_kurve` | Schluss | `z4_passierschein` + `z4_kurve_ana`: Sie hat zurückgesehen. |
| `r4_kopf` | S1, Dialog 1 | „Nur müde.“ Markos Kopf und Malas Sorge |
| `r4_ursache` | S1, Mala-Gespräch nach Sepp und Gerda (Mala) | Am Bahnhof Sepp, im Heim Gerda: Ungefundene Geister machen den Kopfschmerz. |
| `s4_peppino` | S2, Gleis 11 (Marko mit Sepp) | „Mi chiamo Peppino.“ Mütze Nr. 17, „la lettera di gennaio“ |
| `s4_genommen` | S2, Sepp | „Me l'hanno preso qui. Al binario undici.“ (sein Nachname) |
| `s4_fluch` | S2, Frau Wimmer | Der Sepp hat italienisch geflucht, wenn er dachte, keiner hört es. |
| `s4_bairisch` | S2, Kioskfrau | „A Urmünchner. Der hat Bairisch g'redt wie mei Schwiegervater.“ |
| `s4_enzo` | S2, Enzo | „Per noi era Peppino.“ 1962 im selben Zug. Bairisch gelernt, „damit keiner fragt, woher er kommt“. |
| `s4_ausweis` | S2, Herr Obermaier | Gepäckträgerausweis: „Josef Rugiero, Gepäckträger Nr. 17“ |
| `s4_termin` | S2, Herr Obermaier | Bestattung von Amts wegen am Donnerstag |
| `s4_bunker` | S2, Bunker **(Mala)** | 1962: „Giuseppe? Das schreibt keiner. Josef. Und Rugiero, ein G reicht.“ – „Sì, sì. Josef.“ |
| `s4_umschlag` | S2, Koffer | Briefe an „Giuseppe Ruggiero, c/o Bahnhofsmission, Gleis 11“, Absender C. Ruggiero, Pietrafonda Nuova |
| `s4_bitte` | S2, Sepp nach dem Namen | „Adesso scriva. Cara Carmela, sto bene.“ |
| `s4_brief79` | S2, Briefe lesen | Carmela 1979: „Ti ho visto con le valigie. Eri bello come papà. Anche io sto bene.“ |
| `s4_carmela_hall` | S2, Mala am Brief von 1979 **(Mala)** | eine Frau, die beim Schreiben weint |
| `s4_tarnung` | Schluss | `s4_bairisch` + `s4_fluch`: Er konnte beides. |
| `s4_derselbe` | Schluss | `s4_peppino` + `s4_ausweis`: „Peppino ist der Sepp (?)“ |
| `s4_name` | Schluss | `s4_derselbe` + `s4_bunker`, oder `s4_derselbe` + `s4_umschlag`, oder `s4_bunker` + `s4_ausweis`: Josef Rugiero ist Giuseppe Ruggiero. |
| `s4_wusste` | Schluss | `s4_brief79` + `s4_carmela_hall`: Carmela wusste es seit 1979. |
| `g4_gerda` | S3, Mala findet Gerda | „Das macht er immer, der Alois. Bis ich da bin.“ |
| `g4_drei` | S3, Beobachtung | Um drei steht Alois auf und geht zum Aufzug. |
| `g4_gong` | S3, Beobachtung | Der Aufzug gongt, wenn er hält. |
| `g4_kalt` | S3, Beobachtung **(Mala)** | Wenn Gerda seine Hand nimmt, friert er. |
| `g4_spaeter` | S3, Beobachtung | „Ihre Gerda kommt später, Herr Lechner.“ Jeden Tag |
| `g4_doku` | S3, Dienstzimmer (Jasna zeigt sie) | Pflegedoku: „Ehefrau verst. 3.9. Laut PDL nicht mitteilen. Bei Nachfrage: kommt später.“ |
| `g4_depot` | S3, Zimmer 214 | Fotos: Trambahn Linie 19, eine Frau mit Thermoskanne am Depottor. Fünfunddreißig Jahre hat sie draußen gewartet. |
| `g4_versuch1` | S3, Versuch Gong aus, Gerda bei ihm | Er steht nicht auf, aber er friert, als sie seine Hand nimmt. |
| `g4_versuch2` | S3, Versuch Gong an, Gerda im Flur | Er steht beim Gong auf, aber er friert nicht. |
| `g4_beides` | Schluss | `g4_versuch1` + `g4_versuch2`: Er wartet auf den Gong und friert, wenn sie bei ihm ist. |
| `g4_worte` | Schluss | `g4_beides` + `g4_depot`: In seiner Sprache: Feierabend, sie wartet am Depot. |

**Falsche Verbindungen** beantwortet das Gerüst mit einer eigenen Antwort je Paar, wo es naheliegt (Konzept 7.1 bis 7.3, Fehlversuche), sonst mit einem allgemeinen Satz.

## 10. Gegenstände

`game/src/12_k4_items.js` (Gerüst). Alle haben `look` und `mala`.

**Aus Kapitel 3 weiter:** `dzezva`, `mobitel`, `olovka`, `photo_full`, `vizitka` (Davors Karte, benutzen heißt anrufen; S2 fängt `use` über `M.k4UseCard` ab).

**Neu**

| Gegenstand | wer gibt | wofür |
|---|---|---|
| `vanilice` | Gerüst, Kapitelstart | Nadas Dose für Jasna (S1: an Jasna geben) |
| `brot` | S1, Tag 1 in der Küche | Jasnas vergessene Brotdose; im Heim an Jasna geben (S3) |
| `aushang` | S2, Frau Wimmer, Tag 2 | „Wer kannte diesen Mann?“ mit Foto; abends Jasna (S1, automatisch in `M.k4JasnaNotice`) |
| `brief_falsch` | S2, wenn der falsche Brief geschrieben wurde | bleibt im Inventar; im Epilog wegwerfen oder erklären (S1) |
| `kanne` | S3, Gerda in der Zwischenwelt | an Alois geben (S3) |
| `pantoffeln` | S1, Epilog | Zorans Pantoffeln |
| `dose_voll` | S1, Epilog | Jasnas Plätzchen für Nada |

Wer etwas gibt oder nimmt, nutzt `A.give(id)` und `A.take(id)`.

## 11. Silvesternacht: Zwischenstände und Laden

**Ablauf** (S1 außer dem Heim)
1. **`M.k4SilvesterEve`:** Abend bei Ana. Um 23:15 ist Jasna fort. Das Skript setzt `k4.fin.gone`, das Gerüst wechselt nach `k4_fin_n`.
2. **Spur:**
   - Mala wird aktiv, liest an Anas Wohnungstür und im Treppenhaus den Nachhall des Zählens („Jedan, dva, tri …“).
   - Ana sagt: „Sonst arbeitet sie Silvester.“
   - Das Skript setzt `k4.fin.trail` und schaltet nichts frei, denn `heim` ist bekannt.
3. **Reise:** Das Gerüst fragt nach dem Weg und ruft `M.k4Ride`.
4. **Heim (S3):** Kevin an der Tür, Flur, Zimmer 214. Beim Betreten von `heim214` in `k4_fin_n` ruft S3 `await M.k4Silvester(A)` auf, wenn `k4.fin.done` fehlt.
5. **`M.k4Silvester`:** acht Züge mit Auswahl (Konzept 7.3, Teil C), Ana kommt um 00:40, `k4.fin.done`.

**Zwischenstände** (`await M.k4Checkpoint(A,n)`)

| cp | Wann | Beim Laden |
|---|---|---|
| 1 | Marko betritt Zimmer 214, vor dem ersten Zug | `heim214`: Jasna am Fenster, Alois schläft mit der Kanne, Gerdas Stuhl frei. `M.k4FinResume` startet das Gespräch neu ab Zug 1. |
| 2 | nach Zug 4 („Ich bin ohne dich gefahren.“) | `heim214` wie oben. `M.k4FinResume` macht mit Zug 5 weiter. |
| 3 | nach Zug 8 (Jasnas Entscheidung), vor Anas Ankunft | `heim214`. `M.k4FinResume` spielt Anas Ankunft und den Schluss. |

**Raum aus Schaltern:** S3 baut `heim214` in `k4_fin_n` nur aus Schaltern und Phase auf. Ein geladener Stand stimmt dann von selbst.

**Laden vor dem Heim:** Wird in `k4_fin_n` vor `k4.fin.trail` geladen, steht man bei Ana nach Jasnas Weggang, und S1 lässt die Spur neu beginnen. Nach `k4.fin.trail`, aber vor dem Heim, kann man reisen.

## 12. Zwischenwelten

Nach dem Vorbild von `97_k3_limbo_mate.js` und `rooms/limbo.js`.
- **Requisit:** Die Kunst (K3) malt es unter `S.who==='sepp'` (Bahnsteig 1962, Zug nach Süden, Gepäckkarren, Sepps Pappkoffer) und `S.who==='gerda'` (Trambahn-Depot bei Nacht, Linie 19, Tor, Lampe).
- **Skript:**
  - `M.LIMBO_GHOST.sepp={name:'Sepp',idle:'carry'}`, `M.LIMBO_GHOST.gerda={name:'Gerda',idle:'wait'}`;
  - `M.limboIntro` erweitern;
  - das Requisit `prop` je `who` belegen.
- **Sepp:** Marko trägt Sepps Koffer in den Zug, „Facchino!“.
- **Gerda:** Marko hilft ihr die hohe Stufe hinauf. Sie gibt ihm die Kanne, und die wird stofflich (`A.give('kanne')` beim Zurückkehren). Mala bleibt am Rand.
- Der Eintritt ist wie in Kapitel 3: `await A.crossOpen(…)`, „Marko. Nimm meine Hand.“, `await M.enterLimbo(A,'sepp')`.

## 13. Musik und Geräusche (T)

**Musik** (`A.music(id)`)

| ID | Wofür |
|---|---|
| `k4_bus` | Busfahrt, Kapitelanfang |
| `k4_muenchen` | Stadt bei Tag, Schnee |
| `k4_wohnung` | Jasnas Wohnung, still, gespannt |
| `k4_ana` | Ana und die Kinder, warm |
| `k4_bahnhof` | Hauptbahnhof, Gleis 11 |
| `k4_sepp` | Sepps Thema, eine italienische Wendung |
| `k4_heim` | das Altenheim |
| `k4_gerda` | Gerdas Thema, ein alter Münchner Walzer |
| `k4_duh` | Geister, Erkenntnis |
| `k4_limbo` | Zwischenwelt |
| `k4_nacht` | Nacht, Schnee, allein |
| `k4_streit` | nach dem Streit, Freitag |
| `k4_bruecke` | Hackerbrücke, Dialog 2 |
| `k4_silvester` | Silvesterabend, Spannung unter dem Feiern |
| `k4_fin` | das Gespräch in Zimmer 214, sehr leise |
| `k4_epi` | Neujahrsmorgen |
| `k4_end` | Abspann |

**Klangkulisse** je Raum: `scape:'k4_<raumid>'`.

**Neue Geräusche** (`A.sfx(name)`):
- Bahnhof: `annBus` (Durchsage ZOB), `annTrain` (Bahnsteigdurchsage, Gong vor der Ansage), `trainIn`
- Heim: `chime` (Aufzuggong), `elevator`, `kettle`
- Stadt: `tramBell`, `snowStep`, `doorbellDE`
- Silvester: `firework` (eine Rakete), `fireworks` (Knattern in der Ferne), `cork`
- Dinge: `suitcase` (Schnappschloss), `cat` (Mucki), `cardShuffle` (Kartei)

Dazu die vorhandenen Geräusche aus Kapitel 1 bis 3 (`phone`, `dial`, `hangup`, `paper`, `page`, `shimmer`, `click`, `door`, `steps`, `cups` und andere).

## 14. Erinnerungsbilder (K3, `97_k4_mem.js`, `M.mem.k4_*`)

| ID | Bild |
|---|---|
| `k4_bus` | Nachtbus, Schnee ab Salzburg, Mala am Fenster, Lichter |
| `k4_stiefel` | 1990, Haltestelle der Drei: ein kleines Mädchen in gelben Gummistiefeln weint, eine Jugendliche malt ihr eine Straßenbahn |
| `k4_kiste` | Nachhall (Geisterfärbung): Ruža schreibt an einem Küchentisch, ein Junge steht daneben |
| `k4_kurve` | Nachhall: ein Busfenster von innen, eine Frau mit Kind auf dem Schoß sieht zurück, draußen ein Mann mit erhobener Hand, eine Kurve |
| `k4_bunker` | Nachhall: ein Tisch im Bunker 1962, ein Beamter, ein junger Mann mit Pappkoffer |
| `k4_april` | Markos Erinnerung, Sepia: eine Schlange von Menschen mit Kanistern vor einer Mauer, Frühling, zwei blaue Kanister mit roter Schrift im Vordergrund. **Keine Verletzten, kein Blut.** Das Bild zeigt den Moment davor. |
| `k4_depot` | Gerda als junge Frau am Depottor bei Nacht, Thermoskanne, eine Trambahn fährt ein |
| `k4_home` | Epilog, letztes Bild: Küche, Neujahrssonne, drei Tassen, Pantoffeln |

## 15. Technische Muster und Prüfen

Muster wie `K3_SPEC.md` Abschnitt 12:
- Raum über `M.room(...)`;
- NPC-Hotspots;
- `A.menuLoop`;
- `M.hintTalkOpt(A)` in jedem Mala-Menü;
- Geister mit `ghost:true` und `A.found`;
- Erkenntnis mit `A.realize`;
- Telefon mit `A.phoneVoice(text, who)`;
- Dokumente mit `A.doc({style:'letter'|'register'|'news', title, lines})`. Höchstens 8 Zeilen je Seite, sonst mehrere Dokumente.

Speichern nie selbst, außer über `M.k4Checkpoint`.

Bauen nur isoliert, nie nach `web/`:

```
node game/build.js --out /tmp/claude-0/-home-user-Hotel/c0d2778b-f95c-5a19-86e2-dac79ed281be/scratchpad/<teil>/build
node game/tools/roomshot.js --rooms <id> --room <id> --phase k4_d1 --out …png [--debug] [--who mala]
```

Den gebauten Pfad setzt du mit `MALA_HTML=<build>/index.html`.

Prüfskripte nach dem Vorbild von `game/tools/k3play.js` und `game/tools/driver.js`: Sie spielen deine Ketten mit `M.TA` und setzen Vorbedingungen fremder Teile über Schalter und Notizen. Melde Fehler in fremden Dateien, statt sie zu ändern.
