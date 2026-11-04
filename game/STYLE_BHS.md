# Bosnisch/Kroatisch (BHS) – Stilvorgaben für die Übersetzung von Kapitel 1 (Split)

Verbindlich für alle Übersetzungsdateien `game/src/lang/bhs_k1_*.js`. Ziel ist eine natürliche, literarische Fassung, keine Wort-für-Wort-Übertragung. Der Ton des Originals bleibt erhalten: ruhig, genau, trocken, manchmal komisch, nie pathetisch.

## 1. Wer spricht was (vom Auftraggeber festgelegt)

| Sprecher (ID im Code) | Sprachform |
|---|---|
| **Marko** (`marko`, `A.m`) mit allen anderen | **Standardkroatisch** (ijekavisch): *što, tko, kava, kruh, tjedan, točno, tisuća, vlak, kat*, Infinitiv „moram ići“ |
| **Marko mit Mala** | **Sarajevo-Bosnisch** (ijekavisch): *šta, ko, kahva, hljeb, sedmica, tačno, hiljada, voz, sprat*, „Hajde.“, „Jah.“, „Ma nemoj.“ – mit ihr klingt er wie der Junge aus Sarajevo, der er war |
| **Mala** (`mala`, `A.g`, auch `g:{…}`-Texte) | **Sarajevo-Bosnisch der frühen Neunziger** (17 Jahre, Lana aus Alipašino Polje): *šta, ko, kahva*, Partikeln sparsam: *ba, jah, haman, baš, e*; Turzismen sparsam: *merak, dert, sevdah, avlija, pendžer, komšija, džaba, akšam*. Kurz, direkt, manchmal scharf |
| **Ivka** (`ivka`), **Zdenka** (`zdenka`), **Jakov** (`jakov`) | **Čakavisch (Split, Veli Varoš), gut lesbar** – siehe Abschnitt 3 |
| alle anderen: **Bruno, Ljerka, Dinko, Luka, Sanja, Nina, Mira, Mladen, Vesna, Stipe, Frane** | **Standardkroatisch mit leichter Split-Färbung**: nur einzelne Split-Wörter, kein durchgehender Dialekt (Abschnitt 4) |
| Erzähler (`A.narrate`, Markos Ich-Stimme) | Standardkroatisch, literarisch |
| Oberfläche, Notizbuch, Gegenstände, Karten, Abspann | Standardkroatisch |

**Ansehen-Texte:** `look:'…'` spricht Marko → Standardkroatisch. `g:{look:'…', sense:'…', listen:'…'}` ist Malas Wahrnehmung → Bosnisch. Gegenstände: `look` (Marko) Standard, `mala:'…'` (Mala über den Gegenstand) Bosnisch.

**Dokumente** (`A.doc`): Was im Original schon kroatisch ist (Tonćis Briefe und Postkarten, Register, Schilder), bleibt **unverändert** und wird trotzdem eingetragen (Text auf sich selbst abbilden). Deutsche Dokumenttexte werden in die Sprache ihres Verfassers übersetzt (Brunos Nachtbuch: Kroatisch mit Split-Färbung; Behördliches: Amtskroatisch).

**Italienisch/Kroatisch-Brocken im Original** (z. B. Brunos „perdonami“, „tvoje pismo“) bleiben, wie sie sind.

## 2. Standardkroatisch (Marko, Erzähler, Oberfläche)

- Ijekavisch, kroatische Lexik und Orthografie. Anführungszeichen „…“, Gedankenstrich –, Auslassung … wie im Original.
- Marko spricht wenig, präzise wie ein Übersetzer, trockene Selbstironie, höflich zu Alten. Er sagt nie „opsada“, sondern „onda“ / „tada“.
- Anrede wie im Original: deutsches *Sie* → *vi* (klein in direkter Rede), *du* → *ti*. Ältere Frauen: „gospođo“, Marko zu Ivka „gospođo Ivka“. Ivka und Zdenka duzen Marko („sinko“, „mali“).
- Kurze Bestätigungen natürlich: „Da.“, „Ne.“, „Dobro.“, „Hvala.“, „Molim?“

## 3. Čakavisch für Ivka, Zdenka, Jakov („gut lesbar“)

In jedem Satz ein bis zwei Merkmale, nie alles auf einmal. Lesbar für alle BHS-Leser, wie in Fernsehserien aus Split.

- **ča** statt što („Ča je?“, „Ča govoriš?“), *zač* (zašto) gelegentlich.
- 1. Person Präsens auf **-n**: *san, nisan, iman, čekan, znan, volin, vidin*.
- **Ikavisch**: *lipo, dite, dica, mliko, vrime, misto, svit, rič, di* (gdje), *pisma* (pjesma), *cvit*.
- Partizip auf **-a**: *reka, doša, bija, čeka, vidija*.
- Infinitiv ohne -i: *čekat, vidit, ić, doć*.
- *ni* = nije („Još ni doša.“), *nima* = nema, *jopet*, *fala*, *judi*, *ćer*.
- Wenige Lehnwörter: *barka, kužina, ponistra, škura, armerun, šugaman*, Ausrufe *ajme meni, Bože moj, aj*.
- **Ivka** (85, wartet seit 1984 auf das Boot um sieben, sanft, verwirrt, beharrlich): „Je li brod iz Supetra već doša? Ne vidin ga.“ – „Moj Tonći dolazi danas.“
- **Zdenka** (78, Ivkas Nachbarin, scharfe Zunge, weiches Herz, Katze Mrki): „Ča me gledaš ka tele? Mrki, aj vamo!“
- **Jakov** (Geist, † 1959, Totengräber in Sustipan; grüßt Mala wie eine alte Bekannte): ruhig, altmodisch, „Faljen Isus“, „ča“, „di su ti grobi?“ – das älteste Čakavisch im Spiel.

## 4. Leichte Split-Färbung (alle übrigen Splitter)

Grundsätzlich Standardkroatisch (ijekavisch). Erlaubt sind **einzelne** Split-Wörter, wo sie natürlich klingen: *ajme, ma, evo, aj, Bok, fjaka, bura, jugo, bonaca, lebić, kantun, ponistra, đir, ćakula*. Höchstens ein solches Wort pro Satz, viele Sätze ganz ohne.

- **Bruno** (Nachtportier, † 1994, 66): höflich, alte Hotelwelt, italienische Brocken wie im Original.
- **Ljerka** (56, Besitzerin des Hotels Palma, Brunos Tochter): gepflegt, stolz, müde.
- **Dinko** (46, Fischer, Tonćis Freund, Schuld seit 27 Jahren): wortkarg, Seemannswörter.
- **Luka** († 1999, 20): jung, schnell: „brate“, „ma daj“, „ajme“.
- **Sanja** (32, Wirtin der Bar „Bura“): schnell und herzlich. Ihr Satz „Wie immer?“ darf „Ka i uvik?“ heißen (ihre eine Split-Wendung).
- **Nina** (31, Rahmenwerkstatt): leise, genau. **Mira** (61, Kiosk am Fährhafen): gesprächig.
- **Mladen** (63, Hafenbüro): Amtssprache, korrekt, müde. **Vesna** (52, Redaktion, am Telefon): knapp und herzlich.
- **Stipe & Frane** (70+, Briškula): necken sich, Kartenwörter (*briškula, trešeta, punat, aš*).

## 5. Feste Begriffe (überall gleich)

| Deutsch | BHS |
|---|---|
| Notizbuch | bilježnica |
| Notiz / Schlussfolgerung | bilješka / zaključak |
| Nachdenken (Notizbuch-Ansicht) | razmišljanje |
| Liste | popis |
| Geistersicht | duhovni pogled |
| Zwischenwelt | međusvijet |
| Nachhall (Erinnerung an Dingen) | odjek |
| Splitter (Erinnerungsfragment) | krhotina |
| Erkenntnis | spoznaja |
| Leine (Lichtband zum Geist) | uzica |
| Hinüberbringen / hinübergehen | prevesti / prijeći |
| Kopfschmerz | glavobolja |
| Schau an / Sprich mit / Nimm / Öffne / Benutze / Drücke / Lies / Gib | Pogledaj / Razgovaraj s / Uzmi / Otvori / Upotrijebi / Pritisni / Pročitaj / Daj |
| Spüre / Lausche / Hindurchgehen | Osjeti / Osluhni / Prođi kroz |
| Fähre / Mole / Hafenbüro | trajekt / mol / lučka kapetanija |
| „Die Stillen“ (Markos Rubrik) | „Tihi“ |
| *Glas Rive*, Bar „Bura“, Hotel Palma, Ledana, Matejuška, Sustipan, Veli Varoš, Riva, Sveti Duje | bleiben |

Fallnamen: „Das Boot um sieben“ → „Brod u sedam“, „Das letzte Schiff nach Ancona“ → „Zadnji brod za Anconu“, „Der Nachtportier“ → „Noćni portir“.

## 6. Technische Regeln

- **Schlüssel** sind die deutschen Texte **exakt** wie im Quelltext (jedes Zeichen, auch „…“, Gedankenstriche, Leerzeichen, `\n`). Kopiere sie, tippe sie nicht ab.
- Format der Datei (eine je Agent):

```js
/* Bosnisch/Kroatisch – Kapitel 1: <Dateien> */
(function(M){ if (!M.trAdd) return;
M.trAdd('bhs', {
  'Deutscher Text': 'Prijevod',
  'Gleicher Satz an Mala und an andere': { hr:'Kroatisch', bs:'Bosnisch (an Mala)' },
  '@ivka:Danke.': 'Fala.'            // gleicher deutscher Text, aber dieser Sprecher braucht eine andere Fassung
});
M.trIgnore && M.trIgnore(['interner Text, der nie angezeigt wird']);
})(M);
```

- **Marko**: Zeilen an Mala (im Gespräch mit ihr, im Menü „Mala“, wenn sie gerade gesprochen hat) bosnisch als einfacher Text. Steht derselbe deutsche Satz auch in Gesprächen mit anderen, dann als Objekt `{ hr, bs }`.
- **Gleicher deutscher Text, verschiedene Sprecher** (kurze Sätze wie „Danke.“, „Ja.“): Standardfassung unter dem normalen Schlüssel, dazu Sondereinträge `'@ivka:…'`, `'@zdenka:…'`, `'@jakov:…'`, `'@mala:…'`.
- **Listen im Code** (Rätselzeilen, Dokumentzeilen, `A.cycle`): jeden Eintrag einzeln übersetzen; Anzahl und Reihenfolge bleiben, denn die Rätselprüfung vergleicht Positionen.
- Länge: Namen von Hotspots und Gegenständen, Notiztitel und Menüpunkte höchstens wenig länger als deutsch (Platz ist knapp). Sätze dürfen umbrechen.
- Nicht übersetzen: IDs, Flags, Dateinamen, Klangnamen, alles, was nie angezeigt wird (in `M.trIgnore` eintragen, damit die Prüfung es nicht meldet).
- Zeichensatz: nur Buchstaben inkl. *č ć đ š ž Č Ć Đ Š Ž*, Ziffern, übliche Satzzeichen, „ “ ‚ ‘ – … · ✓.

## 7. Prüfen

```
node game/tools/i18n_check.js game/src/lang/bhs_k1_X.js game/src/rooms/riva.js game/src/rooms/ivka.js …
```
Meldet: Schlüssel, die es im Quelltext nicht gibt (Tippfehler), sichtbare Texte ohne Übersetzung, fremde Zeichen, verdächtig unübersetzte lange Texte. Erst fertig, wenn keine Meldung mehr kommt. Mit `--list` vorher eine Liste aller sichtbaren Texte samt Zeile und Sprecher-Hinweis.
