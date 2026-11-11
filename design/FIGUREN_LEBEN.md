# Figuren: mehr Zeichnung, lockerer Marko, Eigenleben

Stand 11.11.2026. Alle Figuren werden vom Rig gezeichnet (`game/src/02_rig.js`, 106 Figuren); die Verbesserungen sitzen deshalb im
Zeichner selbst und wirken auf die ganze Besetzung. Marko ist zusätzlich von Hand nachgezeichnet. Bewegung und Eigenleben stecken in
`02_rig.js` (Posen), `05_engine.js` (wann was gespielt wird) und `08_life.js` (Pausen bei Tätigkeiten).

## 1 Mehr Zeichnung

| Was | Wie | Wo |
|---|---|---|
| Licht auf Stoff | Statt drei harter Streifen bekommt jeder Pixel von Torso, Mantelschoß und Rock eine Helligkeit aus einer gedachten Wölbung und einem Licht von vorn oben (Seite) bzw. links oben (vorn/hinten): fünf Stufen (tiefer Schatten, Schatten, Mitte, Licht, Glanz), die Übergänge gerastert wie in den Hintergründen; unten zum Saum dunkler | `lightAt`, `level`, `shadeCol` |
| Falten und Nähte | Falten von den Achseln schräg zur Mitte, Querfalte über dem Bund, Rückenfalte in der Seitenansicht, Zugfalte vom Gesäß zum vorderen Knie beim Gehen, Kniekehle und Kniescheibe, Ellbogenfalte | `crease`, `kneeFold`, `elbowFold` |
| Mantel | Taschenklappen (vorn und seitlich), Gehschlitz hinten, Saumkante, offene Vorderkante mit heller Kante | `coatS`, `coatF` |
| Ärmel und Hände | Bündchen am Ärmelende (eigene Farbe `cols.cuff`, sonst eine Stufe dunkler; Marko: graues Hemd), Hände mit Fingerspitzen in Richtung des Unterarms | `cuff`, `hand` |
| Schuhe | Oberleder in der Schuhfarbe, Glanz an der Kappe, dunkle Ferse, schwarze Sohle (vorher fast nur schwarz) | `SHOES` |
| Schatten zwischen Teilen | Jeder Pixel merkt sich beim Zeichnen sein Körperteil. Danach: schmaler Schatten hinter und unter dem nahen Arm auf Körper und Mantel, Schatten unter dem Kinn, Saum über der Hose, Bein hinter Bein; Oberlicht auf Schultern und Ärmeln; Lichtkante vorn, Schattenkante hinten | `SprBuf`, `detailPass` |
| Köpfe (alle) | Augenbrauen (mittlere Haarfarbe; beim Lidschlag an derselben Stelle, erschrocken eine Zeile höher), Schatten unter der Nase, Glanz oben im Haar zur Lichtseite, Schatten unter dem Pony und am Kiefer, Wange auf der Schattenseite; je Figur abschaltbar (`headAuto`) | `headEnh` |
| Marko (von Hand) | Haar in Strähnen mit Glanz, Ohr mit Muschel, Nasenflügel, Bartstoppeln locker gestreut, Schatten unter dem Pony | `03_cast.js` |
| Licht der Räume | Die Raumtabellen (Nacht, Lampenlicht) färben Figuren um und ließen benachbarte Stufen auf dieselbe Farbe fallen – die Zeichnung verschwamm. `M.detailLut` macht daraus eine Figurentabelle, in der hellere Stufen heller bleiben (im selben Farbton), einmal je Tabelle berechnet | `M.detailLut` |

Rechenzeit: 0,17 ms je neu gezeichneter Pose (vorher 0,17 ms), danach aus dem Zwischenspeicher.

## 2 Marko weniger steif

* **Stand**: Gewicht auf dem hinteren Bein, Arme locker angewinkelt; Atmen etwa alle drei Sekunden, Lidschlag, Wechsel des Standbeins.
* **Gehen**: leicht vorgeneigt, die Arme schwingen weiter gegen die Beine, der vordere angewinkelt, der hintere fast gestreckt; der
  Kopf wippt mit.
* **Umdrehen**: beim Wechsel von links nach rechts ein kurzes Bild von vorn (95 ms), auch im Gehen.
* **Gesten im Leerlauf** (wenn der Spieler ihn ein paar Sekunden stehen lässt, alle 10–22 s eine): Hände in die Manteltaschen und
  eine Weile so stehen, über die Schulter sehen, auf die Uhr sehen, sich übers Kinn streichen, seufzen, den Kragen richten, Arme
  verschränken, Gewicht verlagern; von vorn: Blick nach links und rechts, Hände in die Taschen, Arme verschränken.
* **Sprechen**: je Satz eine von vier Gesten (mit einer Hand erklären, mit beiden, ruhig mit Nicken, offene Hand); von vorn drei.
* **Mala** (wenn sie nicht geführt wird und stillsteht): sieht über die Schulter, umarmt sich selbst, späht nach vorn – immer schwebend.

## 3 Eigenleben der Nebenfiguren

| Verhalten | Wer | Regel |
|---|---|---|
| Gesten im Leerlauf | alle Lebenden, die ohne eigene Tätigkeit dastehen (oder gerade Pause machen) | umsehen, Gewicht verlagern, Arme verschränken, Hände auf den Rücken oder in die Taschen, Kinn, Uhr, Seufzen, Gähnen; von vorn Blicke, Hände reiben … |
| Pausen | wer im Stehen nur einer Tätigkeit nachgeht und keinen eigenen Tagesablauf hat (Gläser polieren, lesen, stempeln, fegen, Kaffee einschenken …) | 9–16 s Tätigkeit, 3–6 s Pause (dann Gesten und Hinsehen wie alle), weiter; nicht im Sitzen, nicht bei Tätigkeiten, die keine Pause vertragen (Telefonieren, Warten, Halten …), nie bei Geistern |
| Blicke | Figuren von vorn (Theke, Schalter) | die Augen gehen zu Marko, wenn er nah ist – ein paar Sekunden hin, dann wieder zur Sache; wer spricht, wird angesehen |
| Umdrehen | Figuren ohne Tätigkeit in der Seitenansicht | bleibt Marko hinter ihnen stehen, drehen sie sich nach einem Moment um und nach einer Weile wieder zurück; die Blickrichtung ist nur gezeichnet (`a.lookF`), `a.f` bleibt, Szenen merken davon nichts |
| Schulterblick | Figuren mit Tätigkeit (auch im Sitzen: Zdenka beim Stricken, Dinko beim Flicken …) | nur der Kopf dreht sich über die Schulter, die Hände arbeiten weiter |
| Plaudern | zwei, die nah beieinander stehen und sich zugewandt sind | ab und zu redet einer stumm (Mund und Hände), der andere sieht zu |

**Sicherheit**: nichts davon läuft während einer Szene (`E.busy`), eines Gesprächsmenüs, eines Overlays oder einer Auswahl; mit der
Figur, mit der Marko gerade redet, auch nicht. Gesten sind nur eine vorübergehende Leerlauffolge (`a.fid`), der Modus bleibt `idle`;
`setIdle` (Szenen, Umdrehen per Skript, Ankunft) beendet sie sofort. Geister wiederholen weiter, was sie immer getan haben.

## Werkzeuge und Tests

* `node design/tools/figurenbogen.js <png> [ids|alle] [--scale 5] [--grid 12] [--lut nacht] [--html alt.html]` – Figuren in mehreren
  Posen nebeneinander, mit `--html` auch aus einem älteren Build (vorher/nachher)
* `node design/tools/lebenvideo.js <ordner> [raum@phase@figur,…]` – Video vom Spielbild: Marko geht hinter Leute, steht, spricht
* `node qa/ui/figuren_leben.js` – 14 Prüfpunkte: alle Figuren × Kopfvarianten × Animationen (über 56 000 Bilder) ohne Fehler,
  Feinheiten vorhanden, Detailtabelle hält Stufen auseinander, Geste im Leerlauf (nicht in Szenen, nicht beim Gehen), Umdrehen und
  Zurückdrehen, Schulterblick bei Tätigkeit, Blick von vorn, wechselnde Sprechgesten, Pausen, Drehbild, keine JS-Fehler

## Bilder und Video (`design/figuren/`)

`figuren_vorher_nachher.png` (Marko, Mala, Sanja, Mladen in sieben Posen), `spielbild_riva_…`, `spielbild_bar_…`,
`spielbild_varos_vorher_nachher.png` (im Spiel, mit Raumlicht), `besetzung_vorher.png` / `besetzung_nachher.png` (alle 106),
`gesten_marko.png`, `gesten_mala.png`, `leben.mp4` (Eigenleben in sechs Räumen, 190 s, Spielbild vierfach, ohne Ton) und Standbilder
daraus (`leben_kraus_dreht_sich_um.png`, `leben_dinko_schulterblick.png`, `leben_mladen_blick.png`, `leben_kafana.png`,
`leben_riva_marko_steht.png`).

## Prüfung (Build 11.11.2026 · 892be1)

| Prüfung | Ergebnis |
|---|---|
| `node qa/ui/figuren_leben.js` (neu) | 14 von 14 OK (56 424 Bilder aller Figuren, Kopfvarianten und Animationen ohne Fehler; Gesten, Umdrehen, Schulterblick, Blicke, Sprechgesten, Pausen, Drehbild) |
| Regression `node qa/regress/run.js` | 33 von 33 OK |
| UI-Tests Phase 1–5 | 33/33, 90/90, 52/52, 92/92, 31/31 |
| `qa/ui/k3_revision.js`, `qa/ui/intro_titel.js`, `qa/ui/musik_nach_titel.js`, Offline-Test | 40/40, OK, OK, OK |
| Musterlösungen Kapitel 1–5 (`game/tools/walkthrough*.js`) | alle fünf OK, keine JS-Fehler |
| `qa/ui/savecompat.js` | 27/33 – dieselben drei K3-Stände auf beiden Geräten wie vor dieser Änderung (Build 962623 und a9714e); nicht durch sie |
| Übersetzungsprüfung | keine neuen Texte, keine neuen Lücken |
| Rechenzeit je neu gezeichneter Pose | 0,17 ms (vorher 0,17 ms) |

Protokolle: `qa/protokolle/figuren_2026-11-11/`.

