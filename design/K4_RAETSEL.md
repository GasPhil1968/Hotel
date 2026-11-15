# Kapitel 4 (München): vom Gespräch zum Rätsel

Stand 15.11.2026. Code: `rooms/jhaus.js`, `rooms/friedamt.js`, `rooms/bmission.js`, `rooms/jwohnung.js`, `rooms/gleis11.js`, `rooms/heim_flur.js`, `rooms/heim_raum.js`, `rooms/balkon.js`, `rooms/barsport.js`, `12_k4_items.js`, `13_k4_notes.js`, `15_hints_k4.js`, Kunst `rooms/art/heim_flur.js`. Prüfung: `qa/regress/bug_037_k4_raetsel.js`, Musterlösung `game/tools/walkthrough4.js`.

## 1. Befund

Die Musterlösung von Kapitel 4 (vor dieser Änderung) besteht aus:

| Handlung | Anzahl |
|---|---|
| Gesprächsabläufe (`drive`) | 47 |
| „Reden mit …“ | 28 |
| Notizen verbinden | 10 |
| Benutzen (fast nur Szenen-Auslöser: Uhr, Couch, Tisch, Herd) | 10 |
| Ansehen und Spüren (Mala) | 10 |
| Geben | 2 |
| Nehmen | 1 |
| **Gegenstände kombinieren** | **0** |

Die beiden Fälle (Sepp, Gerda) waren gut geschrieben, aber fast jedes Tor öffnete sich durch die richtige Gesprächszeile oder die richtige Notiz, die man jemandem zeigte. Mala „fand“ und „spürte“ und erzählte es dann. Ein Zusammenspiel, in dem Marko etwas tun muss, *weil* Mala etwas gesehen hat, und umgekehrt, gab es fast nicht.

Die Familienszenen (Heiligabend, Džezva, Streit, Hackerbrücke, Silvester, Neujahr) bleiben Gespräche. Das ist dort richtig: Sie sind die Handlung, kein Hindernis. Geändert werden die **Ermittlungen**.

## 2. Grundsätze

1. **Jede Kette braucht beide.** Mala sieht, hört und geht dorthin, wo Marko nicht hinkann. Sie fasst nichts an (Regel aus `K4_SPEC.md`). Marko nimmt, trägt, verbindet, übersetzt. Keine Kette lässt sich von einem allein lösen.
2. **Gegenstände aus der Welt, nicht aus dem Rätselbaukasten.** Jedes Ding gehört zu einer Figur und erzählt etwas über sie: Sepps Manteltasche, Frau Wimmers Teekessel, Enzos Kaffeesäcke, der Papierstern im Heim.
3. **Das Rätsel ist die Figurenszene.** Wer das Rätsel löst, erlebt dabei den emotionalen Kern: Carmela hat Sepp im letzten Brief ihre Nummer geschickt. Er hat nie angerufen. Gerda hat unter einer Lampe gewartet. Nada hat jeden Herbst ihren Oleander in Kaffeesäcke gewickelt.
4. **Fair.** Was zwingend ist, sagt jemand offen. Jeder Fehlversuch hat eine eigene Antwort. Wo es geht, gibt es zwei Wege (Teekessel *oder* Herd). Keine Sackgasse.
5. **Hinweise in vier Stufen** für jede neue Kette, wie im ganzen Kapitel.

## 3. Die vier Ketten

### Kette 1 – „Mucki wartet auch“ (Prolog, Treppenhaus, Pflicht)

Frau Huber gibt den Schlüssel wie bisher. Aber auf der Treppe liegt Mucki, quer, und faucht jeden an. Sie wartet seit dem Morgen auf Frau Vuković.

| Schritt | wer | was |
|---|---|---|
| 1 | Marko | will nach oben: Mucki faucht. Frau Huber: „Do kimmt koana vorbei. Mi beißt’s aa.“ |
| 2 | Marko | Fehlwege: Katze nehmen (Kratzer), Plätzchen anbieten, Frau Huber bitten („Mit am Mannsbild geht’s ned mit.“) |
| 3 | Mala | Katzen sehen Mala. Sie spricht mit Mucki: Sie wartet auch. Sie geht vor, Mucki folgt ihr zu Frau Hubers Tür. |
| 4 | Marko | Die Treppe ist frei. Frau Huber: „Wia wenn’s oana führt.“ |

Funktion: Die Regel „Katzen sehen sie“ wird zum ersten Mal zur Handlung. Der Spieler lernt gleich am Anfang, dass er in München oft zu Mala wechseln muss. Und Mucki ist die Erste, die in diesem Haus auf Jasna wartet.

### Kette 2 – „Der nasse Brief“ (Fall Sepp, Dienstag/Mittwoch, Pflicht)

Bisher ging der Anruf bei Carmela, sobald die Briefe gelesen waren. Jetzt fehlt eine Nummer: Pietrafonda Nuova ist ein Dorf, die Briefe haben nur eine Adresse.

| Schritt | wer | was |
|---|---|---|
| 1 | Marko | Herr Obermaier: In der Manteltasche lag ein Kuvert, aufgeweicht, festgefroren, „nicht lesbar“. Nur für Angehörige. |
| 2 | Marko | Mit dem richtigen Namen *und* den Briefen der Schwester (s4_name, s4_umschlag): „Dann gehört es ihr.“ Gegenstand **Kuvert**. |
| 3 | Marko | Aufreißen zerreißt den Brief. Dampf löst ihn: **Kuvert auf Frau Wimmers Teekessel** oder **auf Mamas Herd** (mit der Džezva). Kuvert + Džezva allein: „Dafür brauche ich Feuer darunter.“ |
| 4 | Marko | **Carmelas Dezemberbrief** lesen: „Rosa hat ein neues Telefon. Wenn du eines Tages anrufen willst: 0971 …“, danach ist die Tinte verlaufen (Notiz s4_dezember). |
| 5 | Mala | Marko zeigt ihr den Brief. Nachhall: Carmela am Küchentisch, sie sagt die Ziffern beim Schreiben laut, Rosa: „Nonna, più grande!“ Mala versteht kein Italienisch und spricht nach: „Sätte. Tre. Tschinkwe. Otto. Duhe. Duhe.“ (Notiz s4_ziffern) |
| 6 | Marko | Notizen verbinden: Vorwahl und Malas Laute → **Rosas Nummer** (s4_nummer). Marko übersetzt: sieben, drei, fünf, acht, zwei, zwei. |
| 7 | Marko | Erst jetzt erscheint Carmela im Handy. Rosa fragt, woher er die Nummer hat. „Aus dem Dezemberbrief. Er hatte ihn in der Manteltasche.“ – „La nonna gliel’ha scritto. Lui non ha mai chiamato.“ |

Funktion: Die Kette macht den Anruf zur Antwort auf Carmelas Einladung, die Sepp nie angenommen hat. Mala ist auf Marko angewiesen (Italienisch), Marko auf Mala (Nachhall).

### Kette 3 – „Die Lampe am Tor“ (Fall Gerda, Mittwoch, Pflicht)

Für den zweiten Versuch muss Gerda um drei woanders warten. Bisher überredete Mala sie mit einem Satz über die Depotfotos.

| Schritt | wer | was |
|---|---|---|
| 1 | Mala | Nachhall am Foto in Zimmer 214 (wie bisher): Gerda am Depottor, **unter der Lampe**. |
| 2 | Mala | Bittet Gerda, am Fenster zu warten. Gerda: „Am Fenster? Do is’s finster. Am Tor war a Lampn. Unter da Lampn hat er mi gsehn, scho von da Kurv’n.“ |
| 3 | Marko | Im Gemeinschaftsraum hängt ein **Papierstern mit Batterielicht**. Moni: „Nehmen S’ ihn, der hängt eh schief.“ |
| 4 | Marko | **Stern auf das Fenster am Flurende**: gelbes Licht auf dem Boden (gezeichnet). |
| 5 | Mala | Noch einmal zu Gerda. „A Lampn.“ … „Einmal.“ |

Funktion: Gerda gibt nicht nach, weil ein Satz stimmt, sondern weil ihr jemand ihren Ort wiederherstellt. Der Stern hängt in der Silvesternacht noch im Fenster.

### Kette 4 – „Winterschlaf“ (Davor und Lena, freiwillig, Belohnung: Davor fährt an Silvester)

Bisher bot Davor die Fahrt gleich nach dem Anruf bei Jela an. Jetzt sagt Jela noch etwas: „I skini tu kesu! Uguši se. Umotaj ga u jutu, k’o mi smokve.“ Die Plastiktüte erstickt den Zweig. Jute, wie die Feigen in Mostar.

| Schritt | wer | was |
|---|---|---|
| 1 | Marko | übersetzt Jela. Lena: „Jute? Wo krieg ich Jute her?“ |
| 2 | Mala | erinnert sich: Nada hat jeden Herbst den Oleander im neunten Stock in **Kaffeesäcke** gewickelt, „nicht zu fest, oben Luft“. |
| 3 | Marko | In der Bar Sport stehen Kaffeesäcke. Enzo: „Per un fico si fa tutto.“ **Jutesack**. |
| 4 | Marko | Am Kiosk an Gleis 11: die **Schnur** von den Zeitungsbündeln. |
| 5 | Marko | **Jutesack + Schnur** → Wintermantel. |
| 6 | Marko (+Mala) | **Wintermantel auf den Feigenzweig**. Mala: „Nicht so fest.“ Lena: „Sieht aus wie ein kleiner Mönch.“ Dann bietet Davor die Fahrt an. |

Funktion: Eine Kette quer durch die Stadt (Moosach, Bahnhofsviertel, Gleis 11), die Mostar (Feigen, Jela), Sarajevo (Nada) und München (Enzo) verbindet. Die Abkürzung in der Silvesternacht ist verdient, nicht geschenkt.

## 4. Abhängigkeiten (neu)

```
Prolog:   Schlüssel ─→ Mucki (Mala) ─→ Treppe frei ─→ Wohnung
Sepp:     s4_name + s4_umschlag ─→ Kuvert ─→ Dampf (Teekessel | Herd) ─→ Dezemberbrief ─→ Mala (Nachhall) ─→ s4_ziffern
          s4_dezember + s4_ziffern ─→ s4_nummer ─┐
          s4_wusste + s4_bitte ──────────────────┴─→ Anruf bei Carmela ─→ Schwelle
Gerda:    g4_depot (Lampe) ─→ Gerda: „finster“ ─→ Stern (Gemeinschaftsraum) ─→ Fenster ─→ Gerda am Fenster ─→ Versuch 2
Davor:    Jela ─→ Mala: Kaffeesäcke ─→ Jutesack (Bar Sport) + Schnur (Kiosk) ─→ Wintermantel ─→ Zweig ─→ Davors Angebot
```

## 5. Neue Gegenstände, Notizen, Schalter

- Gegenstände: `kuvert`, `brief_dez`, `stern`, `jute`, `schnur`, `wintermantel`.
- Notizen: `s4_dezember`, `s4_ziffern` (Mala), Schluss `s4_nummer`.
- Schalter: `k4.p.catMoved`, `k4.s.kuvert`, `k4.s.steam`, `k4.g.lampAsk`, `k4.g.lamp`, `k4.v.jute`, `k4.v.wrapped`.
- Hinweisthemen: `h4m` (Mucki), `s4n` (Rosas Nummer), `g4l` (die Lampe), `v4w` (Winterschlaf).
