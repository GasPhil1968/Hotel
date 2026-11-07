# MALA – Abschlusslauf auf der korrigierten Fassung

_Automatisch erzeugt aus `qa/results/final/runs.jsonl` (4000 Läufe) von `qa/report.js`._

## Version und Rahmen

- Geprüfte Datei: `web/index.html`, SHA-256 `5ddc4f3c29d8d46332504bc8cea2ecc78b406729f93e77a7bad572c9df2be115`
- Start 2026-11-07T16:39:06.700Z, Ende 2026-11-07T19:42:00.272Z, 3 parallele Prozesse, Node v22.23.4
- Endpunkt des implementierten Umfangs: **K4 Abspann → Titelbild ohne „Weiter mit Kapitel 5“ (Ende des implementierten Umfangs)**
- Simulationsart: Produktionsskript in Node-VM, virtuelle Uhr, Zufall mit Seed, eigener localStorage je Lauf (siehe `qa/README.md`).
- Jeder Lauf in `runs.jsonl`: Lauf-ID, Kategorie, deterministischer Seed (aus Salz `final` und Lauf-ID), Startkapitel, Variante, Ziel, Schrittlimit (12000–12000), Zeitrahmen (900–900 s Rechenzeit), Aktionsfolge (trace), Ergebnis mit Grund, geprüfter Endzustand (Kapitelenden, Titelbild), Harness-Prüfsumme (45bb4beaf7).
- Spielerhandlungen laufen über die Test-API des Spiels (dieselben Funktionen wie die Oberfläche) bzw. bei Belastung über Zeigerereignisse; es werden keine Flags gesetzt, keine Gegenstände eingefügt, nicht teleportiert. Zufällige Handlungen nutzen nur Hotspots, die an dieser Stelle antippbar sind, Hinüberbringen nur, wenn das Spiel es anbietet, Figurenwechsel nur, wenn der Wechselknopf es erlaubt (Verstöße würden als Infrastruktur gezählt: 0).

## Läufe

| | geplant | gestartet | abgeschlossen | bestanden | fehlgeschlagen | unentschieden | abgebrochen/Infrastruktur |
|---|---|---|---|---|---|---|---|
| **Gesamt** | 4000 | 4000 | 4000 | 3482 | 2 | 516 | 0 |
| A | 1000 | 1000 | 1000 | 1000 | 0 | 0 | 0 |
| B | 1000 | 1000 | 1000 | 691 | 0 | 309 | 0 |
| C | 800 | 800 | 800 | 693 | 0 | 107 | 0 |
| D | 600 | 600 | 600 | 598 | 2 | 0 | 0 |
| E | 600 | 600 | 600 | 500 | 0 | 100 | 0 |

A = kritischer Pfad ab Spielbeginn · B = Zufallserkundung · C = variierte Reihenfolge/verfrühte Versuche · D = Speichern/Laden · E = Belastung/Fehlbedienung

### Nach Startkapitel

| Startkapitel | Läufe | bestanden | fehlgeschlagen | unentschieden |
|---|---|---|---|---|
| 1 | 1733 | 1629 | 1 | 103 |
| 2 | 748 | 659 | 0 | 89 |
| 3 | 754 | 636 | 1 | 117 |
| 4 | 765 | 558 | 0 | 207 |

### Nach Kapitel (ein Lauf spielt alle Kapitel ab seinem Start bis K4)

| Kapitel | gespielt | Ende erreicht | gescheitert | davon gestört |
|---|---|---|---|---|
| 1 | 1733 | 1630 | 103 | 575 |
| 2 | 2378 | 2289 | 89 | 602 |
| 3 | 3043 | 2926 | 117 | 592 |
| 4 | 3691 | 3484 | 207 | 580 |

### Nach Spielversion

- `5ddc4f3c29d8`: 4000 Läufe, 3482 bestanden, 2 fehlgeschlagen, 516 unentschieden

## Vollständige Durchläufe bis zum Endpunkt

- Läufe ab Spielbeginn (Kapitel 1): 1733, davon Endpunkt erreicht: **1629**
- Alle Läufe mit erreichtem Endpunkt (beliebiger Start): 3484
- Durchschnitt erfolgreicher Volldurchläufe: 1458 Spieleraktionen (M.TA-Ebene, inkl. Dialogwahlen), 327 Skriptschritte, 459.9 min Spielzeit, 9.7 s Rechenzeit

## Vielfalt

- unterschiedliche Aktionsfolgen: **2939** · unterschiedliche Phasen-/Raumpfade: 1513 · Varianten-Kombinationen: 1666 · Seeds: 4000

## Abdeckung

- Räume: 77/78 (98.7 %); Raumübergänge: 556
- Phasen (Story-Abschnitte): 49/49; Phasenübergänge: 129
- Schlüsse (Notizen verbinden): 48/91 (52.7 %)
- Hotspots: 906/951 (95.3 %); Hotspot×Verb×Figur: 6206; Dialogzeilen gewählt: 2837
- Geister-Erkenntnisse (Kapitel:Geist → Läufe): k4:gerda 3515, c1:ivka 1676, c2:luka 1650, c3:bruno 1642, k2:tomaz 2325, k2:ivan 2317, k2:zora 2291, k2:alija 2289, k3:mate 2945, k3:bato 2941
- Hinüberbringen (Schwelle geöffnet, Raum → Läufe): gleis11 3552, limbo 3640, heim_flur 3514, riva 1674, ledana 1646, salon 1639, kula 2323, vijecnica 2314, skloniste 2291, zelenika 2945, skela_l 2930

<details><summary>Ungeprüfte Räume, Phasen und Schlüsse</summary>

- Räume nie betreten: map
- Phasen nie erreicht: –
- Schlüsse nie gezogen: pro_noone+pro_knit, pro_spia+pro_red, c1_ferry+c1_capsized, c1_ankica+c1_capsized, c1_aboard+c1_boat7, c2_echo+c2_meet, c2_unused+c2_ferry, c3_zagreb+c3_wanted, s1_note+s1_clock, s1_letters+s1_gave, s2_stamp+s2_fire, m2_f_clock+m2_photo, m2_alija+m2_notrams, m2_f_ninth+m2_housebook, f2_rcm+m2_split_journal, l3_m1+l3_m3, l3_area+l3_current, l3_down+l3_city, v3_mala+k3_c_name, a3_lightroom+a3_slept, a3_voice+a3_soldier, b3_zdravko+b3_pencil, e3_father+e3_kolar, a3_lightseq+v3_part1, a3_lightseq+a3_bell3, s4_derselbe+s4_umschlag, s4_bunker+s4_umschlag, s4_peppino+s4_fluch, s4_peppino+s4_bairisch, s4_peppino+s4_enzo, s4_genommen+s4_ausweis, s4_genommen+s4_peppino, g4_drei+g4_gong, g4_drei+g4_kalt, g4_gong+g4_kalt, g4_spaeter+g4_doku, g4_versuch1+g4_depot, g4_versuch2+g4_depot, z4_lesart+z4_kode, z4_kolar+z4_kode, z4_ana2004+z4_kolar, u4_pantoffeln+z4_lesart, u4_dach+z4_lesart

</details>

## Störungen und Speichern/Laden

- Störstellen (B/C/E): 6324, davon 433 übersprungen (Spiel nicht ruhig), Rückkehr zum Anker 4152, ohne Rückkehr 361; zufällige/gestörte Aktionen insgesamt 130290
- Speicherpunkte (D): 1378; gespeichert 1352; abgelehnt 26; verglichen 1352; identisch 1350; Modi {"same":335,"fresh":712,"double":331}
- Im Spiel vorgesehene Rücksetzungen beim Laden (protokolliert, kein Fehler): 5× Straßenbrücke: Laden setzt die geführte Überquerung zurück (strassenbr.load), sie beginnt neu; 1× Partisanenfriedhof: Glocken-Szene läuft nach dem Laden weiter, Mala kehrt nach 3 s zurück (partizan.resume/bellsEnd); danach wie ein Spieler fortgesetzt: 5×
- Verfrühte Versuche (C): 1495 Lösungsschritte vor ihrer Zeit ausgeführt, davon 390 mit Zustandsänderung (Notiz/Inventar/Phase/Flag); 631 Störstellen ohne passenden verfrühten Schritt

Abweichungen nach dem Laden:
- D-0071 (double, K3 Schritt 27): GS.rooms.partizan.bellBack: 1509800 ≠ 22600; GS.rooms.partizan.nextBell: 1509600 ≠ 26400
- D-0450 (double, K3 Schritt 27): GS.rooms.partizan.bellBack: 5045000 ≠ 22600; GS.rooms.partizan.nextBell: 5044800 ≠ 26400

## Fehlschläge, Ausnahmen, Invarianten

- **2×** Save/Load-Abweichung (double, K# Schritt #): GS.rooms.partizan.bellBack: # ≠ # | GS.rooms.partizan.nextBell: # ≠ # (z. B. D-0071, D-0450)

### Unentschieden (Fortsetzung nach Störung nicht gefunden / Limit)

- 19× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „abend“ nach Schritt #: Erwartung verfehlt: Raum herberge (ist starimost)
  Zustand: {"room":"starimo (z. B. B-0019, E-0150, B-0158, C-0164, E-0166, B-0186)
- 17× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Flag mala.voice |  (z. B. E-0011, E-0024, B-0025, E-0069, E-0138, B-0160)
- 14× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „silvester“ nach Schritt #: drive (Bleigießen): das Spiel wartet, aber die Bedingung ist nicht erfüll (z. B. C-0036, B-0096, B-0106, B-0183, C-0296, C-0393)
- 14× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum kafana (ist carsija) |  (z. B. E-0067, E-0265, E-0267, B-0270, B-0275, E-0316)
- 12× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „samstag_nacht“ nach Schritt #: Erwartung verfehlt: Raum zimmer (ist skela_d)
  Zustand: {"room":"ske (z. B. B-0256, E-0313, E-0319, B-0411, E-0509, E-0599)
- 11× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Tür: noch nichts, das von ihr erzählt |  (z. B. B-0000, B-0004, C-0110, B-0403, B-0512, B-0557)
- 11× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „mittwoch“ nach Schritt #: drive (Gerdas Entschluss): das Spiel wartet, aber die Bedingung ist nicht  (z. B. B-0007, B-0048, E-0049, E-0054, E-0143, E-0362)
- 11× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „freitag“ nach Schritt #: Erwartung verfehlt: Raum vulkanizer (ist bulevar)
  Zustand: {"room":"bulev (z. B. C-0011, C-0200, E-0213, B-0253, B-0355, C-0457)
- 10× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Zeitüberschreitung: Morgen |  (z. B. C-0026, E-0187, B-0438, C-0465, E-0527, C-0562)
- 10× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Flag k#.p#.back |  (z. B. C-0029, B-0192, B-0245, B-0501, C-0518, C-0612)
- 10× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „sonntag“ nach Schritt #: Erwartung verfehlt: Raum skela_l (ist skela_d)
  Zustand: {"room":"skela_d" (z. B. E-0097, E-0137, E-0301, C-0317, E-0350, E-0383)
- 10× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „dienstag“ nach Schritt #: Erwartung verfehlt: Notiz g#_kalt
  Zustand: {"room":"jwohnung","phase":"k (z. B. B-0109, B-0132, B-0159, B-0333, E-0394, B-0695)
- 10× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „christtag“ nach Schritt #: Erwartung verfehlt: Notiz z#_stiefel
  Zustand: {"room":"wiesn","phase":" (z. B. E-0354, B-0400, B-0412, B-0414, B-0485, E-0494)
- 9× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „finale“ nach Schritt #: Erwartung verfehlt: Mala gespielt
  Zustand: {"room":"skela_d","phase":"k#_f (z. B. B-0020, B-0418, B-0434, B-0489, B-0531, C-0636)
- 9× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum tramvaj (ist carsija) |  (z. B. B-0027, B-0217, B-0385, C-0501, B-0549, B-0560)
- 9× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Sanja ist beschäftigt |  (z. B. C-0052, B-0308, B-0392, B-0473, C-0484, B-0913)
- 9× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „heiligabend“ nach Schritt #: Erwartung verfehlt: Raum jwohnung (ist ana)
  Zustand: {"room":"ana","p (z. B. B-0232, C-0314, B-0359, B-0384, C-0439, B-0503)
- 8× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Mala aktiv |  (z. B. C-0031, C-0059, C-0108, B-0278, C-0502, C-0729)
- 8× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Zwischenwelt (Bruno) |  (z. B. C-0039, B-0292, B-0347, C-0365, C-0588, C-0788)
- 8× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „dienstag“ nach Schritt #: Erwartung verfehlt: Gegenstand aushang
  Zustand: {"room":"jwohnung","phas (z. B. C-0129, B-0299, C-0379, C-0406, C-0515, C-0555)
- 7× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Flag c#.tonight |  (z. B. C-0102, C-0139, C-0190, C-0205, B-0519, C-0744)
- 7× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „mittwoch“ nach Schritt #: drive (Versuch #): das Spiel wartet, aber die Bedingung ist nicht erfüllt
 (z. B. E-0127, E-0167, E-0376, B-0379, E-0414, B-0769)
- 7× Fortsetzung nach Störung gescheitert: ABBRUCH: Zeitüberschreitung: Rätsel |  (z. B. B-0174, C-0221, B-0320, B-0397, B-0539, B-0615)
- 6× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „silvester“ nach Schritt #: Erwartung verfehlt: zurück bei Marko
  Zustand: {"room":"ana","phase":"k# (z. B. B-0001, B-0050, B-0286, B-0294, E-0364, B-0530)
- 6× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum haustor (ist map) |  (z. B. E-0055, B-0198, E-0263, B-0367, B-0541, C-0720)

### Infrastruktur/abgebrochen

- keine

- Läufe mit JS-Ausnahmen: 0; mit Invariantenverletzung: 0

### Gegenstände, die aus dem Inventar verschwanden (Gegenstand @Phase → Läufe)

`vanilice @k4_pro` 3682 · `brot @k4_d1` 3654 · `kanne @k4_d4` 3511 · `gloves @c1_night` 3350 · `kljuc_mate @k3_d3` 2945 · `ulaznica @k3_fin_n` 2942 · `deka @k3_fin_n` 2942 · `brief1996 @k3_epi_d` 2926 · `skizzenbuch @k3_epi_d` 2926 · `formular @k3_epi_d` 2926 · `rueckfahrt @k3_epi_d` 2926 · `km @k4_pro` 2926 · `plan @k4_pro` 2926 · `tramkarta @k2_pro` 2373 · `lejla_letter @k2_s1` 2340 · `letters_tz @k2_s1` 2326 · `bracelet @k2_s1` 2326 · `note_e @k2_s1_n` 2317 · `rilke @k2_s2_n` 2317 · `kurrent @k2_i` 2314 · `pass @k2_i` 2314 · `deskkey @k2_s3` 2305 · `pecat @k2_s3` 2291 · `svjedocanstva @k2_s3_n` 2291 · `dnevnik @k2_fin` 2289 · `karton @k2_fin` 2289 · `photo_m @k2_fin` 2289 · `ticket_m @k2_fin_n` 2289 · `ticket_l @k2_fin_n` 2289 · `olovka @k2_epi` 2289 · `km @k2_epi` 2289 · `tramkarta_v @k2_epi` 2289 · `photo_stop @k2_epi` 2289 · `chisel @k2_epi` 2289 · `sweater @k2_epi` 2289 · `ashpage @k2_epi` 2289 · `drawing @k2_epi` 2289 · `key_kuca @k2_epi` 2289 · `rcm @k2_epi` 2289 · `busticket2 @k3_pro` 2289

## Softlocks (Sackgassen)

Jeder unentschiedene Lauf (das Lösungsskript fand nach der Störung nicht weiter) wurde vom erreichten Zustand aus mit einer begrenzten Suche über reguläre Spielerhandlungen weitergespielt (Lösungsschritte des Kapitels in der Nähe der Abbruchstelle, Notizen, Dialogwahlen, Kombinationen, Reisen, Rätsel über die sichtbaren Bedienelemente; höchstens 600 Aktionen). Geprüfte Läufe: 516.

| Einordnung der Sonde | Läufe |
|---|---|
| kein Softlock (Phase/Kapitel geht weiter) | 371 |
| Fortschritt möglich (kein Phasenwechsel in N Aktionen) | 144 |
| Sonde gescheitert | 1 |

„kein Softlock“ = von dort aus wurde ein Phasen- oder Kapitelwechsel erreicht. „Fortschritt möglich“ = neue Notiz, neuer Gegenstand, neuer Ort oder neues Story-Flag, aber kein Phasenwechsel im Budget (kein Beweis, Stichproben von Hand geprüft). „Verdacht“ = kein Fortschritt; jeder Verdacht wird einzeln von Hand untersucht.

Verdachtsfälle und Läufe ohne Sondenergebnis (einzeln von Hand nachgeprüft, Ergebnis in `TRIAGE.md` dieses Ordners):
- B-0913: Sonde gescheitert (Zeitrahmen überschritten (Spielzeit)) – Fortsetzung nach Störung gescheitert: FEHLER bei Schritt 5 Erwartung verfehlt: Sanja ist beschäftigt

Die von Hand geprüfte Einordnung (Stichproben je Gruppe, Mechanismen, nicht bewiesene Gruppen) steht in `TRIAGE.md` dieses Ordners.

Einordnung bekannter Stellen:

- **bestätigter Softlock** – BUG-009 (behoben): Softlock: Figurenwechsel auf dem Weg zu einem Geisterausgang bringt Marko in einen Raum, den nur Mala betreten kann (K1 Archiv)
- **Umweg** – BUG-003 (behoben): Verkochtes Wasser: Die Džezva verschwindet, der Herdweg zum verklebten Brief ist zu, alle Hinweise verweisen weiter darauf
- **Umweg** – BUG-007 (behoben): Kapitel 3, Straßenbrücke: Mala lässt sich nicht durch Tippen auf den Weg ans Westende führen
- **kein Softlock (beabsichtigt)** – Laden während der Überquerung der Straßenbrücke setzt sie zurück; Marko tippt das Westufer erneut an (strassenbr.load).
- **kein Softlock (beabsichtigt)** – Kühlraum (K1) ist nur in Malas Schein zu sehen („Bleib bei mir“); dunkle Hotspots werden erst im Licht antippbar.

## Regressionstests (`qa/regress/run.js`)

Fassung `web/index.html`, SHA-256 `5ddc4f3c29d8d46332504bc8cea2ecc78b406729f93e77a7bad572c9df2be115`; zum Vergleich gegen die Originalfassung `e380ec8b8c79…`

| Test | korrigierte Fassung | Originalfassung | Ergebnis |
|---|---|---|---|
| BUG-001 Laden eines K2–K4-Stands verändert keine Kapitel-1-Marken | bestanden | schlägt fehl (Fehler vorhanden) |  |
| BUG-002 Figurenwechsel während eines Wegs lässt keine Aktion hängen (E.acting) | bestanden | schlägt fehl (Fehler vorhanden) | Mala in gleis11 geht zu „tree“, Wechsel zu Marko (wiesn): E.acting=0; Kapitel danach bis zum Ende gespielt |
| BUG-003 Verkochtes Wasser: Džezva bleibt verfügbar, Brief über Dampf weiter lösbar | bestanden | schlägt fehl (Fehler vorhanden) | nach Verfall: Brief offen=false, Džezva sichtbar=true, zweiter Versuch öffnet den Brief=true |
| BUG-004 Laden in frischem Kontext macht alten Dampf nicht wieder wirksam | bestanden | schlägt fehl (Fehler vorhanden) | nach Laden (frischer Kontext) Brief am Herd ohne Dampf: geöffnet=false („Direkt über die Flamme? Dann habe ich Asche statt eines Briefs.“) |
| BUG-005 Emina ist nach ihrer angekündigten Rückkehr sichtbar und antippbar | bestanden | schlägt fehl (Fehler vorhanden) | nach „Emina. Zurück von Tante Sabira. Früher als gedacht.“: Figur=true, sichtbar=true, antippbar=true |
| BUG-006 K2-Finale: „Darum steht bei Abreise nichts“ ist mit sichtbaren Notizen ziehbar | bestanden | schlägt fehl (Fehler vorhanden) | im Finale sichtbar: Weg 1 (cameback+register)=true, Weg 2 (rcm+journal)=false; Kapitel bis zum Ende gespielt |
| BUG-007 Straßenbrücke: Mala lässt sich durch Tippen auf den Weg bis ans Westende führen | bestanden | schlägt fehl (Fehler vorhanden) | Tipps auf den Gehweg (x=290, links der Laterne): Mala-Positionen 40 → [Boden] → 290 → [Boden] → 370; drüben=true |
| BUG-008 Figurenwechsel während des Zudrehens zu einer Person wirft keinen TypeError (Wiederholung E-0159) | bestanden | schlägt fehl (Fehler vorhanden) | E-0159 (Salz erstlauf): Ergebnis pass; doVerb0-Fehler: 0; Kapitel 4✓ |
| BUG-009 Figurenwechsel auf dem Weg zu einem Geisterausgang bringt Marko nicht in einen Mala-Raum (Softlock) | bestanden | schlägt fehl (Fehler vorhanden) | k=0 Bilder: Marko in office, Mala in office; k=3 Bilder: Marko in office, Mala in office; k=8 Bilder: Marko in office, Mala in office |

## Korrekturen am eigenen Prüfwerkzeug (während der Prüfung gefunden)

- **Kanon ohne Schrittzähler** – makeCanon gab den Schritt-Haken nicht weiter; alle Kanon-Einträge standen auf Schritt 1. Dadurch fanden die verfrühten Versuche der Kategorie C im Erstlauf nie einen Kandidaten (767× „premature-none“, 0 Versuche); C prüfte dort nur Umwege/Abwesenheit. Korrektur: Schritt-Haken übergeben; Kanon um Ausgänge, Notizwahlen, Kombinationen und Dialogwahlen ergänzt (für die Sonde). Im Abschlusslauf laufen die verfrühten Versuche tatsächlich.
- **Erzwungene Figurenwechsel** – returnTo/randomAction riefen M.TA.switchTo ohne Prüfung von canSwitch; so entstanden Zustände, die die Oberfläche nicht zulässt (z. B. Mala aktiv in der Zwischenwelt bei mala.lock → Marko kann Ivka die Handschuhe nicht geben). Korrektur: Wechsel nur, wenn E.canSwitch() wie beim Porträtknopf erlaubt; jeder dennoch unerlaubte Wechsel wird protokolliert und der Lauf als Infrastruktur gezählt.
- **Hinüberbringen ohne Angebot des Spiels** – LIST_ACTIONS bot „Hinüberbringen“ an, auch wenn crossIf nicht galt; die Test-API prüft das nicht. Folge u. a.: Zora vor dem Appell hinübergebracht, danach TypeError in rollcall (Fehlalarm, kein Spielfehler). Korrektur: LIST_ACTIONS bildet hsOpts der Oberfläche nach (crossIf).
- **Nicht antippbare Hotspots** – Zufallsaktionen konnten dunkle (unbeleuchtete) oder vollständig überdeckte Hotspots über die Test-API benutzen. Korrektur: Nur Hotspots, die E.hotspotAt an mindestens einem Punkt liefert.
- **Belastung über doppelte Test-API-Aufrufe** – Die Test-API umgeht die Sperre E.busy der Oberfläche; doppelte Aufrufe erzeugten „Aktion hängt“, das ein Spieler nicht auslösen kann. Korrektur: Belastung (Kategorie E) nur über Zeigerereignisse/Tasten auf Bildschirmpunkte.
- **Save/Load-Vergleich zu streng** – Abgeleitete Raumschlüssel, absichtlich entfernte Sitzungsstempel (steam, nudge, ferryAt, ferryGo, radioT), Flags false/undefined und im Spiel vorgesehene Szenen-Rücksetzungen (Straßenbrücke, Glocken) wurden als Abweichung gezählt. Korrektur: Normalisierung vor dem Vergleich; vorgesehene Rücksetzungen werden mit Begründung protokolliert und wie ein Spieler fortgesetzt (Westufer erneut antippen).
- **Navigation mit Mala** – Die Wegplanung nutzt Markos Ausgänge; war Mala aktiv, lief die Navigation ins Leere („Ohne Marko komme ich nicht weit“). Korrektur: Vor dem Navigieren zu Marko wechseln, sofern erlaubt.

## Browser- und Geräteprüfungen

Engines: chromium 153.0.8010.12, firefox 155.0, webkit 26.6. Geräte sind Playwright-Emulationen (iPhone 13 quer/hochkant, iPad gen 7 quer), keine echten Geräte.

### Vollständige UI-Durchläufe (nur sichtbare Bedienelemente, Kapitel 1 → K4-Abspann)

| Engine | Gerät | Ergebnis | Aktionen | Dauer | Kapitelenden (s) | Seitenfehler | Konsolenfehler | fehlgeschl. Anfragen | Bedienhinweise |
|---|---|---|---|---|---|---|---|---|---|
| chromium 153.0.8010.12 | desktop 1280×800 Maus | **bestanden** | 1420 | 1261 s | K1 238, K2 524, K3 938, K4 1261 | 0 | 0 | 0 | Boden verdeckt ×3; Boden verdeckt (Scrollen) ×1; Wechsel nicht angeboten (Skript prüft Sperre) ×1; Tipp traf anderen Hotspot (Figur bewegte sich) ×1; Dunkler Hotspot: Marko geht hin, Mala folgt ×1; Peilung blieb aus, Aktion neu angetippt (z. B. nach der Glockenszene) ×1 |
| firefox 155.0 | tablet 1080×810 Touch | **bestanden** | 1420 | 1404 s | K1 306, K2 606, K3 1055, K4 1404 | 0 | 0 | 0 | Overlay blieb aus, Aktion neu angetippt ×1; Boden verdeckt ×3; Boden verdeckt (Scrollen) ×3; Aktion ohne Reaktion, erneut angetippt ×15; Wechsel nicht angeboten (Skript prüft Sperre) ×1; Dunkler Hotspot: Marko geht hin, Mala folgt ×1; Ausgang ohne Reaktion, erneut angetippt ×6; Peilung blieb aus, Aktion neu angetippt (z. B. nach der Glockenszene) ×1 |
| webkit 26.6 | phone 750×342 Touch | **bestanden** | 1420 | 2338 s | K1 427, K2 1066, K3 1779, K4 2337 | 0 | 2 | 1 | Aktion ohne Reaktion, erneut angetippt ×54; Boden verdeckt ×3; Boden verdeckt (Scrollen) ×15; Wechsel nicht angeboten (Skript prüft Sperre) ×1; Dunkler Hotspot: Marko geht hin, Mala folgt ×1; Ausgang ohne Reaktion, erneut angetippt ×19; Peilung blieb aus, Aktion neu angetippt (z. B. nach der Glockenszene) ×1 |
| webkit 26.6 | phone 750×342 Touch | nicht bestanden: page.evaluate: Target crashed  | 1351 | 2151 s | K1 421, K2 1048, K3 1730 | 0 | 2 | 1 | Aktion ohne Reaktion, erneut angetippt ×52; Boden verdeckt ×3; Boden verdeckt (Scrollen) ×10; Wechsel nicht angeboten (Skript prüft Sperre) ×1; Dunkler Hotspot: Marko geht hin, Mala folgt ×1; Ausgang ohne Reaktion, erneut angetippt ×10; Peilung blieb aus, Aktion neu angetippt (z. B. nach der Glockenszene) ×1 |

### Einzelszenarien

| ID | Engine | Gerät | Szenario | Ergebnis | Prüfungen | Screenshots |
|---|---|---|---|---|---|---|
| C01 | chromium | desktop | Start: Titelbild, ganzzahlige Skalierung, kein Überlauf | bestanden | 6/6 | 1 |
| C02 | chromium | desktop | Neues Spiel Kapitel 1 per Tippen, „Zeigen“, Boden antippen = gehen | bestanden | 6/6 | 1 |
| C03 | chromium | tablet | Dialog: alle Antwortzeilen im Bild, lesbar, antippbar, Gespräch verlassen und fortsetzen | bestanden | 11/11 | 1 |
| C04 | chromium | desktop | Notizbuch per Knopf und Taste N: Zeilen im Bild, Auswahl, Schließen | bestanden | 6/6 | 1 |
| C05 | chromium | tablet | Stadtplan: Orte antippbar, gesperrte Orte mit Begründung, Schließen | bestanden | 5/5 | 1 |
| C06 | chromium | desktop | Inventarleiste: blättern, Gegenstand antippen → Verben, auf Mala ziehen | bestanden | 6/6 | 1 |
| C07 | chromium | desktop | Größenänderung: Spielbild passt sich an, bleibt vollständig sichtbar | bestanden | 8/8 | 1 |
| C08 | chromium | desktop | Speichern im Menü, neuer Browserkontext mit gespeicherten Daten, Fortsetzen: gleicher Stand | bestanden | 6/6 | 2 |
| C09 | chromium | tablet | Fehlbedienung: Doppeltipps auf Ausgänge, Tastenfeuer, Figurenwechsel im Gehen – Spiel bleibt bedienbar | bestanden | 6/6 | 1 |
| C10 | chromium | desktop | Mala: Wechsel per Porträt, kalte Geistersicht, Geist sichtbar | bestanden | 4/4 | 2 |
| C11 | chromium | desktop | Trefferflächen-Prüfung: jeder sichtbare Hotspot in 16 erspielten Ständen hat einen antippbaren Punkt | bestanden | 4/4 | 0 |
| C12 | chromium | desktop | PWA: Service Worker registriert, offline nach Caching neu starten, Update wird beim Titelbild übernommen | bestanden | 9/9 | 1 |
| C13a | chromium | desktop | BUG-002 per Klick (Originalfassung): Figurenwechsel während Mala geht | Fehler BUG-002 reproduziert (erwartet) | 4/5 | 1 |
| C13b | chromium | desktop | BUG-002 per Klick (korrigierte Fassung): Figurenwechsel während Mala geht | bestanden | 5/5 | 1 |
| C14a | chromium | desktop | BUG-009 per Klick (Originalfassung): Wechsel auf dem Weg zur Archivtür | Fehler BUG-009 reproduziert (erwartet) | 4/5 | 1 |
| C14b | chromium | desktop | BUG-009 per Klick (korrigierte Fassung): Wechsel auf dem Weg zur Archivtür | bestanden | 5/5 | 1 |
| F01 | firefox | desktop | Start: Titelbild, ganzzahlige Skalierung, kein Überlauf | bestanden | 6/6 | 1 |
| F02 | firefox | desktop | Neues Spiel Kapitel 1 per Tippen, „Zeigen“, Boden antippen = gehen | bestanden | 6/6 | 1 |
| F03 | firefox | tablet | Dialog: alle Antwortzeilen im Bild, lesbar, antippbar, Gespräch verlassen und fortsetzen | bestanden | 11/11 | 1 |
| F04 | firefox | desktop | Notizbuch per Knopf und Taste N: Zeilen im Bild, Auswahl, Schließen | bestanden | 6/6 | 1 |
| F05 | firefox | tablet | Stadtplan: Orte antippbar, gesperrte Orte mit Begründung, Schließen | bestanden | 5/5 | 1 |
| F06 | firefox | desktop | Inventarleiste: blättern, Gegenstand antippen → Verben, auf Mala ziehen | bestanden | 6/6 | 1 |
| F07 | firefox | desktop | Größenänderung: Spielbild passt sich an, bleibt vollständig sichtbar | bestanden | 8/8 | 1 |
| F08 | firefox | desktop | Speichern im Menü, neuer Browserkontext mit gespeicherten Daten, Fortsetzen: gleicher Stand | bestanden | 6/6 | 2 |
| F09 | firefox | tablet | Fehlbedienung: Doppeltipps auf Ausgänge, Tastenfeuer, Figurenwechsel im Gehen – Spiel bleibt bedienbar | bestanden | 6/6 | 1 |
| F10 | firefox | desktop | Mala: Wechsel per Porträt, kalte Geistersicht, Geist sichtbar | bestanden | 4/4 | 2 |
| F11 | firefox | desktop | Neues Spiel Kapitel 3 und 4 per Tippen: Erinnerungsbild, erste Szene, Hinweis-Menü | bestanden | 5/5 | 3 |
| W01 | webkit | phone | Start: Titelbild, ganzzahlige Skalierung, kein Überlauf | bestanden | 6/6 | 1 |
| W02 | webkit | phone | Neues Spiel Kapitel 1 per Tippen, „Zeigen“, Boden antippen = gehen | bestanden | 6/6 | 1 |
| W03 | webkit | tablet | Dialog: alle Antwortzeilen im Bild, lesbar, antippbar, Gespräch verlassen und fortsetzen | bestanden | 11/11 | 1 |
| W04 | webkit | phone | Notizbuch per Knopf und Taste N: Zeilen im Bild, Auswahl, Schließen | bestanden | 4/4 | 1 |
| W05 | webkit | tablet | Stadtplan: Orte antippbar, gesperrte Orte mit Begründung, Schließen | bestanden | 5/5 | 1 |
| W06 | webkit | phone | Inventarleiste: blättern, Gegenstand antippen → Verben, auf Mala ziehen | bestanden | 6/6 | 1 |
| W07 | webkit | desktop | Größenänderung: Spielbild passt sich an, bleibt vollständig sichtbar | bestanden | 8/8 | 1 |
| W08 | webkit | phone | Speichern im Menü, neuer Browserkontext mit gespeicherten Daten, Fortsetzen: gleicher Stand | bestanden | 6/6 | 2 |
| W09 | webkit | tablet | Fehlbedienung: Doppeltipps auf Ausgänge, Tastenfeuer, Figurenwechsel im Gehen – Spiel bleibt bedienbar | bestanden | 6/6 | 1 |
| W10 | webkit | phone | Mala: Wechsel per Porträt, kalte Geistersicht, Geist sichtbar | bestanden | 4/4 | 2 |
| W13a | webkit | phone | BUG-002 per Klick (Originalfassung): Figurenwechsel während Mala geht | Fehler BUG-002 reproduziert (erwartet) | 4/5 | 1 |
| W13b | webkit | phone | BUG-002 per Klick (korrigierte Fassung): Figurenwechsel während Mala geht | bestanden | 5/5 | 1 |
| W14a | webkit | phone | BUG-009 per Klick (Originalfassung): Wechsel auf dem Weg zur Archivtür | Fehler BUG-009 reproduziert (erwartet) | 4/5 | 1 |
| W14b | webkit | phone | BUG-009 per Klick (korrigierte Fassung): Wechsel auf dem Weg zur Archivtür | bestanden | 5/5 | 1 |
| W11 | webkit | phonePortrait | iPhone hochkant (emuliert): Bild dreht sich, Tipps treffen trotzdem | bestanden | 5/5 | 2 |

Summe: 42 Einzelszenarien (42 wie erwartet) und 4 UI-Volldurchläufe (3 bestanden).

## Gefundene Fehler

| ID | Schwere | Status | Titel | Belege |
|---|---|---|---|---|
| BUG-001 | niedrig | behoben | Laden eines Stands aus Kapitel 2–4 setzt die Kapitel-1-Altstandsmarke split.intro.legacy | qa/regress/bug_001_legacy_flag.js, Erstlauf Kategorie D (Save/Load-Abweichung) |
| BUG-002 | niedrig | behoben | Figurenwechsel, während die Figur zu einem Hotspot geht und der Wechsel einen anderen Raum lädt, lässt die Aktion ewig offen | qa/regress/bug_002_dangling_walk.js, Browser C13a (Original, per Klick reproduziert) / C13b (korrigiert) |
| BUG-003 | mittel | behoben | Verkochtes Wasser: Die Džezva verschwindet, der Herdweg zum verklebten Brief ist zu, alle Hinweise verweisen weiter darauf | qa/regress/bug_003_dzezva_lost.js |
| BUG-004 | mittel | behoben | Spielzeit-Stempel im Spielstand: Nach Laden in einem frischen Kontext gilt alter Dampf als frisch – der verklebte Brief öffnet sich am kalten Herd | qa/regress/bug_004_stale_steam.js, Erstlauf D-Lauf mit Abbruch „nicht über der Flamme“ |
| BUG-005 | mittel | behoben | Kapitel 2: Emina wird bei ihrer Rückkehr angekündigt, ist aber unsichtbar und nicht ansprechbar | qa/regress/bug_005_emina_invisible.js, qa/uireach.js (results/uireach_original.json), UI-Volldurchlauf Chromium/Desktop (Abbruch Eintrag 650 vor der Korrektur) |
| BUG-006 | niedrig | behoben | Kapitel 2, Finale: Der Schluss „Darum steht bei Abreise nichts“ ist über die Oberfläche nicht ziehbar | qa/regress/bug_006_whyabreise_hidden.js, qa/uireach.js |
| BUG-007 | mittel | behoben | Kapitel 3, Straßenbrücke: Mala lässt sich nicht durch Tippen auf den Weg ans Westende führen | qa/regress/bug_007_bridge_lead.js, UI-Volldurchlauf Chromium/Desktop und Firefox/Tablet (Abbruch an Eintrag 1085 vor der Korrektur) |
| BUG-008 | niedrig | behoben | Figurenwechsel im selben Moment, in dem die Figur eine Person erreicht: unbehandelter TypeError in doVerb0 | qa/regress/bug_008_switch_race.js, Erstlauf E-0159 (UNHANDLED TypeError … at doVerb0) |
| BUG-009 | hoch | behoben | Softlock: Figurenwechsel auf dem Weg zu einem Geisterausgang bringt Marko in einen Raum, den nur Mala betreten kann (K1 Archiv) | qa/regress/bug_009_ghost_exit_switch.js, Erstlauf E-0026 (Sackgassen-Sonde: Verdacht → bestätigt) |
| UI-001 | niedrig | offen (Designentscheidung) | Riva (K1) und Straßenbrücke (K3): Hotspots überdecken den gesamten begehbaren Weg | UI-Volldurchlauf uiNotes „Boden verdeckt“ |
| UI-002 | niedrig | offen (kosmetisch) | Meldung „Offline bereit ✓“ überdeckt beim ersten Start 4 s lang die Inventarleiste und dreht sich hochkant nicht mit | qa/results/browser/scen_webkit/W06_inventar.png, qa/results/browser/scen_webkit/W11_spiel.png |

Nach Schweregrad/Status: niedrig/behoben 4, mittel/behoben 4, hoch/behoben 1, niedrig/offen (Designentscheidung) 1, niedrig/offen (kosmetisch) 1
