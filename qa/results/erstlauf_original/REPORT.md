# MALA – Erstlauf gegen die gelieferte Originalfassung

_Automatisch erzeugt aus `qa/results/erstlauf_original/runs.jsonl` (4000 Läufe) von `qa/report.js`._

## Version und Rahmen

- Geprüfte Datei: `qa/originals/index_original.html`, SHA-256 `e380ec8b8c796301b2adba8f4a0a06bb3b5ef3168ca9f606a1b28fc7975320d3`
- Start 2026-11-07T12:10:00.137Z, Ende 2026-11-07T15:42:37.007Z, 3 parallele Prozesse, Node v22.23.4
- Endpunkt des implementierten Umfangs: **K4 Abspann → Titelbild ohne „Weiter mit Kapitel 5“ (Ende des implementierten Umfangs)**
- Simulationsart: Produktionsskript in Node-VM, virtuelle Uhr, Zufall mit Seed, eigener localStorage je Lauf (siehe `qa/README.md`).

## Läufe

| | geplant | gestartet | abgeschlossen | bestanden | fehlgeschlagen | unentschieden | abgebrochen/Infrastruktur |
|---|---|---|---|---|---|---|---|
| **Gesamt** | 4000 | 4000 | 4000 | 3026 | 584 | 390 | 0 |
| A | 1000 | 1000 | 1000 | 1000 | 0 | 0 | 0 |
| B | 1000 | 1000 | 1000 | 729 | 0 | 271 | 0 |
| C | 800 | 800 | 800 | 761 | 0 | 39 | 0 |
| D | 600 | 600 | 600 | 36 | 564 | 0 | 0 |
| E | 600 | 600 | 600 | 500 | 20 | 80 | 0 |

A = kritischer Pfad ab Spielbeginn · B = Zufallserkundung · C = variierte Reihenfolge/verfrühte Versuche · D = Speichern/Laden · E = Belastung/Fehlbedienung

### Nach Startkapitel

| Startkapitel | Läufe | bestanden | fehlgeschlagen | unentschieden |
|---|---|---|---|---|
| 1 | 1761 | 1511 | 144 | 106 |
| 2 | 722 | 499 | 133 | 90 |
| 3 | 743 | 475 | 150 | 118 |
| 4 | 774 | 541 | 157 | 76 |

### Nach Kapitel (ein Lauf spielt alle Kapitel ab seinem Start bis K4)

| Kapitel | gespielt | Ende erreicht | gescheitert | davon gestört |
|---|---|---|---|---|
| 1 | 1761 | 1651 | 110 | 596 |
| 2 | 2373 | 2281 | 92 | 583 |
| 3 | 3024 | 2895 | 129 | 571 |
| 4 | 3669 | 3583 | 86 | 603 |

### Nach Spielversion

- `e380ec8b8c79`: 4000 Läufe, 3026 bestanden, 584 fehlgeschlagen, 390 unentschieden

## Vollständige Durchläufe bis zum Endpunkt

- Läufe ab Spielbeginn (Kapitel 1): 1761, davon Endpunkt erreicht: **1511**
- Alle Läufe mit erreichtem Endpunkt (beliebiger Start): 3583
- Durchschnitt erfolgreicher Volldurchläufe: 1458 Spieleraktionen (M.TA-Ebene, inkl. Dialogwahlen), 327 Skriptschritte, 480.8 min Spielzeit, 11.8 s Rechenzeit

## Vielfalt

- unterschiedliche Aktionsfolgen: **2758** · unterschiedliche Phasen-/Raumpfade: 1512 · Varianten-Kombinationen: 1684 · Seeds: 4000

## Abdeckung

- Räume: 77/78 (98.7 %); Raumübergänge: 559
- Phasen (Story-Abschnitte): 49/49; Phasenübergänge: 129
- Schlüsse (Notizen verbinden): 47/91 (51.6 %)
- Hotspots: 905/951 (95.2 %); Hotspot×Verb×Figur: 6392; Dialogzeilen gewählt: 2876
- Geister-Erkenntnisse (Kapitel:Geist → Läufe): k4:gerda 3601, c1:ivka 1684, c2:luka 1664, c3:bruno 1656, k2:tomaz 2317, k2:ivan 2314, k2:zora 2283, k2:alija 2283, k3:mate 2919, k3:bato 2915
- Hinüberbringen (Schwelle geöffnet, Raum → Läufe): gleis11 3628, limbo 3711, heim_flur 3601, riva 1688, ledana 1670, salon 1658, kula 2331, vijecnica 2316, skloniste 2290, zelenika 2920, skela_l 2899

<details><summary>Ungeprüfte Räume, Phasen und Schlüsse</summary>

- Räume nie betreten: map
- Phasen nie erreicht: –
- Schlüsse nie gezogen: pro_noone+pro_knit, pro_spia+pro_red, c1_ferry+c1_capsized, c1_ankica+c1_capsized, c1_aboard+c1_boat7, c2_echo+c2_meet, c2_unused+c2_ferry, c3_zagreb+c3_wanted, s1_note+s1_clock, s1_letters+s1_gave, s2_stamp+s2_fire, m2_f_clock+m2_photo, m2_alija+m2_notrams, m2_f_ninth+m2_housebook, f2_rcm+m2_split_journal, l3_m1+l3_m3, l3_area+l3_current, l3_down+l3_city, v3_mala+k3_c_name, a3_lightroom+a3_slept, a3_voice+a3_soldier, b3_zdravko+b3_pencil, e3_father+e3_kolar, a3_lightseq+v3_part1, a3_lightseq+a3_bell3, s4_derselbe+s4_umschlag, s4_bunker+s4_umschlag, s4_bunker+s4_ausweis, s4_peppino+s4_fluch, s4_peppino+s4_bairisch, s4_peppino+s4_enzo, s4_genommen+s4_ausweis, s4_genommen+s4_peppino, g4_drei+g4_gong, g4_drei+g4_kalt, g4_gong+g4_kalt, g4_spaeter+g4_doku, g4_versuch1+g4_depot, g4_versuch2+g4_depot, z4_lesart+z4_kode, z4_kolar+z4_kode, z4_ana2004+z4_kolar, u4_pantoffeln+z4_lesart, u4_dach+z4_lesart

</details>

## Störungen und Speichern/Laden

- Störstellen (B/C/E): 6381, davon 457 übersprungen (Spiel nicht ruhig), Rückkehr zum Anker 4227, ohne Rückkehr 343; zufällige/gestörte Aktionen insgesamt 131062
- Speicherpunkte (D): 1333; gespeichert 1300; abgelehnt 33; verglichen 1300; identisch 497; Modi {"double":321,"same":314,"fresh":698}

Abweichungen nach dem Laden:
- D-0000 (double, K4 Schritt 58): GS.flags.split.intro.legacy: undefined ≠ true
- D-0001 (same, K2 Schritt 48): GS.flags.split.intro.legacy: undefined ≠ true
- D-0001 (same, K3 Schritt 39): GS.flags.split.intro.legacy: undefined ≠ true
- D-0001 (same, K4 Schritt 82): GS.flags.split.intro.legacy: undefined ≠ true
- D-0002 (same, K2 Schritt 30): GS.flags.split.intro.legacy: undefined ≠ true
- D-0002 (double, K3 Schritt 89): GS.flags.split.intro.legacy: undefined ≠ true
- D-0002 (double, K4 Schritt 58): GS.flags.split.intro.legacy: undefined ≠ true
- D-0003 (fresh, K4 Schritt 6): GS.flags.split.intro.legacy: undefined ≠ true
- D-0004 (fresh, K4 Schritt 58): GS.flags.split.intro.legacy: undefined ≠ true
- D-0005 (fresh, K4 Schritt 37): GS.flags.split.intro.legacy: undefined ≠ true
- D-0006 (fresh, K4 Schritt 34): GS.flags.split.intro.legacy: undefined ≠ true
- D-0007 (fresh, K4 Schritt 44): GS.flags.split.intro.legacy: undefined ≠ true
- D-0008 (fresh, K2 Schritt 24): GS.flags.split.intro.legacy: undefined ≠ true
- D-0008 (same, K4 Schritt 6): GS.flags.split.intro.legacy: undefined ≠ true
- D-0009 (fresh, K3 Schritt 47): GS.flags.split.intro.legacy: undefined ≠ true
- D-0010 (fresh, K4 Schritt 38): GS.flags.split.intro.legacy: undefined ≠ true
- D-0011 (fresh, K4 Schritt 6): GS.flags.split.intro.legacy: undefined ≠ true
- D-0012 (fresh, K4 Schritt 15): GS.flags.split.intro.legacy: undefined ≠ true
- D-0013 (fresh, K4 Schritt 29): GS.flags.split.intro.legacy: undefined ≠ true
- D-0014 (double, K3 Schritt 28): GS.flags.split.intro.legacy: undefined ≠ true

## Fehlschläge, Ausnahmen, Invarianten

- **288×** Save/Load-Abweichung (fresh, K# Schritt #): GS.flags.split.intro.legacy: undefined ≠ true (z. B. D-0003, D-0004, D-0005, D-0006, D-0007, D-0008)
- **141×** Save/Load-Abweichung (same, K# Schritt #): GS.flags.split.intro.legacy: undefined ≠ true (z. B. D-0001, D-0002, D-0021, D-0029, D-0032, D-0038)
- **124×** Save/Load-Abweichung (double, K# Schritt #): GS.flags.split.intro.legacy: undefined ≠ true (z. B. D-0000, D-0014, D-0015, D-0016, D-0023, D-0033)
- **5×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum skela_d, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0019, E-0075, E-0196, E-0259, E-0570)
- **4×** Regulärer Pfad gescheitert: FEHLER bei Schritt # Erwartung verfehlt: nicht über der Flamme |  (z. B. D-0077, D-0175, D-0331, D-0534)
- **3×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum gleis#, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0239, E-0386, E-0418)
- **2×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum wiesn, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0008, E-0392)
- **2×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum vulkanizer, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0054, E-0429)
- **2×** Save/Load-Abweichung (double, K# Schritt #): GS.flags.mala.noSwitch: true ≠ false | GS.flags.split.intro.legacy: undefined ≠ true | GS.rooms.strassenbr.crossing (z. B. D-0379, D-0594)
- **2×** Save/Load-Abweichung (same, K# Schritt #): GS.flags.mala.noSwitch: false ≠ undefined | GS.flags.split.intro.legacy: undefined ≠ true (z. B. D-0507, D-0561)
- **1×** UNHANDLED TypeError: Cannot read properties of undefined (reading 'x') (z. B. E-0159)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum kafana, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0205)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum starimost, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0209)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum jwohnung, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0221)
- **1×** Save/Load-Abweichung (same, K# Schritt #): GS.flags.mala.noSwitch: true ≠ false | GS.flags.split.intro.legacy: undefined ≠ true | GS.rooms.strassenbr.crossing:  (z. B. D-0223)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum heim_flur, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0303)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum heim#, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0323)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum bmission, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0332)
- **1×** Save/Load-Abweichung (fresh, K# Schritt #): GS.flags.mala.noSwitch: false ≠ undefined | GS.flags.split.intro.legacy: undefined ≠ true (z. B. D-0335)
- **1×** Save/Load-Abweichung (fresh, K# Schritt #): GS.flags.k#.bellsOut: true ≠ false | GS.flags.mala.noSwitch: true ≠ false | GS.flags.k#.bells#: undefined ≠ true | G (z. B. D-0376)
- **1×** Aktion hängt: E.acting=# seit # s Spielzeit ohne Szene (Raum skloniste, nach Aktion [#,"tap",#,#,"game"]) (z. B. E-0573)

### Unentschieden (Fortsetzung nach Störung nicht gefunden / Limit)

- 26× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Flag mala.voice |  (z. B. B-0012, B-0023, B-0071, C-0077, C-0125, E-0158)
- 19× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „abend“ nach Schritt #: Erwartung verfehlt: Raum herberge (ist starimost)
  Zustand: {"room":"starimo (z. B. E-0001, E-0120, E-0143, B-0146, E-0166, B-0173)
- 15× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „freitag“ nach Schritt #: Erwartung verfehlt: Raum vulkanizer (ist bulevar)
  Zustand: {"room":"bulev (z. B. B-0074, E-0116, B-0163, C-0221, E-0237, B-0242)
- 12× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum kafana (ist carsija) |  (z. B. C-0010, C-0067, C-0089, B-0209, E-0335, C-0342)
- 11× Fortsetzung nach Störung gescheitert: ABBRUCH: Zeitüberschreitung: Rätsel |  (z. B. B-0007, B-0027, B-0032, B-0108, B-0245, B-0424)
- 11× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Tür: noch nichts, das von ihr erzählt |  (z. B. B-0059, B-0125, B-0298, B-0362, B-0398, B-0482)
- 10× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „sonntag“ nach Schritt #: Erwartung verfehlt: Raum skela_l (ist skela_d)
  Zustand: {"room":"skela_d" (z. B. B-0057, E-0071, E-0139, C-0153, E-0395, E-0458)
- 10× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „finale“ nach Schritt #: Erwartung verfehlt: Mala gespielt
  Zustand: {"room":"skela_d","phase":"k#_f (z. B. E-0226, B-0252, B-0413, B-0558, E-0580, B-0633)
- 9× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum map (ist pansion) |  (z. B. C-0028, B-0122, C-0355, B-0443, E-0447, C-0481)
- 9× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum haustor (ist map) |  (z. B. B-0058, E-0269, C-0302, C-0331, B-0437, B-0519)
- 8× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „samstag_nacht“ nach Schritt #: Erwartung verfehlt: Raum zimmer (ist skela_d)
  Zustand: {"room":"ske (z. B. C-0042, C-0050, E-0265, B-0488, C-0614, B-0615)
- 8× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum skloniste (ist neboder) |  (z. B. B-0050, E-0289, E-0298, E-0407, E-0508, E-0591)
- 7× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Sanja ist beschäftigt |  (z. B. B-0140, B-0249, B-0436, B-0457, E-0544, B-0630)
- 6× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „samstag“ nach Schritt #: Zeitüberschreitung: Auswahl „Ich komme mit“ |  (z. B. E-0084, E-0288, B-0313, B-0316, B-0369, B-0692)
- 6× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Notizbuch zeigt die Notiz der Stadt und das Strickheft zum Verbinden: n:pro_peopl (z. B. B-0119, B-0132, B-0239, B-0284, B-0310, B-0582)
- 5× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „donnerstag“ nach Schritt #: Erwartung verfehlt: Raum heim_flur (ist heim)
  Zustand: {"room":"heim", (z. B. E-0009, B-0201, B-0312, B-0597, B-0752)
- 5× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „sonntag“ nach Schritt #: Erwartung verfehlt: Raum vulkanizer (ist bulevar)
  Zustand: {"room":"bulev (z. B. B-0029, B-0181, C-0189, C-0500, C-0530)
- 5× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Flag c#.done |  (z. B. B-0038, B-0089, E-0231, B-0375, B-0821)
- 5× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Zeitüberschreitung: Morgen |  (z. B. B-0044, E-0132, E-0236, B-0267, B-0805)
- 5× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Raum tramvaj (ist carsija) |  (z. B. B-0193, B-0238, B-0319, B-0648, B-0758)
- 5× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „finale“ nach Schritt #: Erwartung verfehlt: Raum skela_most (ist skela_l)
  Zustand: {"room":"skela_ (z. B. B-0273, B-0571, B-0572, B-0624, B-0994)
- 5× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Flag k#.s#.selma |  (z. B. B-0315, B-0380, B-0456, B-0589, B-0881)
- 5× Fortsetzung nach Störung gescheitert: ABBRUCH: Erwartung verfehlt: Notiz s#_deskkey |  (z. B. B-0378, B-0430, B-0845, B-0900, B-0973)
- 4× Fortsetzung nach Störung gescheitert: FEHLER bei Schritt # Erwartung verfehlt: Flag c#.tonight |  (z. B. B-0001, B-0004, B-0266, B-0808)
- 4× Fortsetzung nach Störung gescheitert: ABBRUCH in Abschnitt „dienstag“ nach Schritt #: Erwartung verfehlt: Notiz s#_bitte
  Zustand: {"room":"gleis#","phase":"k# (z. B. B-0005, B-0031, B-0265, B-0727)

### Infrastruktur/abgebrochen

- keine

- Läufe mit JS-Ausnahmen: 1; mit Invariantenverletzung: 19
  - E-0159: UNHANDLED TypeError: Cannot read properties of undefined (reading 'x')
  - E-0008: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum wiesn, nach Aktion [1931200,"tap",283,15,"game"])
  - E-0019: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum skela_d, nach Aktion [4803200,"tap",1,97,"game"])
  - E-0054: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum vulkanizer, nach Aktion [5275200,"tap",11,25,"game"])
  - E-0075: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum skela_d, nach Aktion [4518000,"tap",301,37,"game"])
  - E-0196: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum skela_d, nach Aktion [3824000,"tap",1,91,"game"])
  - E-0205: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum kafana, nach Aktion [1380800,"tap",69,38,"game"])
  - E-0209: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum starimost, nach Aktion [772800,"tap",0,13,"game"])
  - E-0221: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum jwohnung, nach Aktion [1597200,"tap",19,28,"game"])
  - E-0239: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum gleis11, nach Aktion [3990800,"tap",283,15,"game"])
  - E-0259: Aktion hängt: E.acting=1 seit 120 s Spielzeit ohne Szene (Raum skela_d, nach Aktion [3775200,"tap",1,91,"game"])

### Gegenstände, die aus dem Inventar verschwanden (Gegenstand @Phase → Läufe)

`vanilice @k4_pro` 3666 · `brot @k4_d1` 3652 · `kanne @k4_d4` 3596 · `gloves @c1_night` 3365 · `kljuc_mate @k3_d3` 2919 · `ulaznica @k3_fin_n` 2915 · `deka @k3_fin_n` 2915 · `brief1996 @k3_epi_d` 2897 · `skizzenbuch @k3_epi_d` 2897 · `formular @k3_epi_d` 2895 · `rueckfahrt @k3_epi_d` 2895 · `km @k4_pro` 2895 · `plan @k4_pro` 2895 · `tramkarta @k2_pro` 2366 · `lejla_letter @k2_s1` 2338 · `letters_tz @k2_s1` 2320 · `bracelet @k2_s1` 2320 · `note_e @k2_s1_n` 2316 · `rilke @k2_s2_n` 2314 · `kurrent @k2_i` 2312 · `pass @k2_i` 2312 · `deskkey @k2_s3` 2297 · `pecat @k2_s3` 2283 · `svjedocanstva @k2_s3_n` 2283 · `dnevnik @k2_fin` 2283 · `karton @k2_fin` 2283 · `photo_m @k2_fin` 2283 · `ticket_m @k2_fin_n` 2283 · `ticket_l @k2_fin_n` 2283 · `olovka @k2_epi` 2283 · `km @k2_epi` 2283 · `tramkarta_v @k2_epi` 2283 · `photo_stop @k2_epi` 2283 · `chisel @k2_epi` 2283 · `key_shelter @k2_epi` 2283 · `sweater @k2_epi` 2283 · `ashpage @k2_epi` 2283 · `drawing @k2_epi` 2283 · `key_kuca @k2_epi` 2283 · `rcm @k2_epi` 2281

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
| UI-001 | niedrig | offen (Designentscheidung) | Riva (K1) und Straßenbrücke (K3): Hotspots überdecken den gesamten begehbaren Weg | UI-Volldurchlauf uiNotes „Boden verdeckt“ |
| UI-002 | niedrig | offen (kosmetisch) | Meldung „Offline bereit ✓“ überdeckt beim ersten Start 4 s lang die Inventarleiste und dreht sich hochkant nicht mit | qa/results/browser/scen_webkit/W06_inventar.png, qa/results/browser/scen_webkit/W11_spiel.png |

Nach Schweregrad/Status: niedrig/behoben 3, mittel/behoben 4, niedrig/offen (Designentscheidung) 1, niedrig/offen (kosmetisch) 1
