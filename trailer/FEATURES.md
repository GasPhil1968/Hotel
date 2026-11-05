# MALA – Trailer 90 s: Feature-Abdeckung

Zeitcodes im Format `mm:ss:Bild` bei 30 Bildern/s, bezogen auf `MALA_Trailer_90s_DE.mp4` (erzeugt mit `werkzeug/doku.py`). Grundlage ist der Build `web/index.html` (SHA-1 `f4b32c501563…`, Stand Commit `ae3c21e`). Jede Zeile ist entweder im Video zu sehen oder ausdrücklich als Text belegt und vorher geprüft. Prüfprotokolle liegen in `pruefung/`.

## Beworbene Funktionen

| Feature | Tatsächlich vorhanden? | Szene und Nachweis | Timecode |
|---|---|---|---|
| Zwei spielbare Figuren | Ja | Wechselknopf unten links. Marko ist lebend, Mala ist ein Geist. Der Wechsel ist an der Riva und im Hafenbüro als echte Klickaktion zu sehen. | 00:02:05, 00:34:21 |
| Unterschiedliche Fähigkeiten | Ja | **Mala:** eigene Sicht, in der die Welt kalt wird und die Leine aus Licht zu sehen ist. Sie geht durch die verschlossene Archivtür und hat „Spüren“ (Nachhall). **Marko:** redet mit Lebenden, nimmt und benutzt Gegenstände. | 00:00:00–00:06:00, 00:35:10–00:41:17, 00:44:03 |
| Mehrstufige Rätsel | Ja | Pflichtsequenz Hafenbüro: (1) Marko kommt nicht weiter, (2) Wechsel zu Mala, (3) Mala geht ins Archiv und spürt die Schrift, (4) Marko setzt fort. Der Schnitt liegt vor dem Ergebnis. | 00:27:17–00:44:03 |
| Kooperation beider Figuren | Ja, im Einzelspiel | Eine Person steuert beide Figuren nacheinander. Es gibt keinen Mehrspielermodus, und der Trailer deutet auch keinen an. | 00:27:17–00:44:03 |
| Dialog und Ermittlung | Ja | Echte Dialogauswahl mit Porträts: Mala („Du bist eine Einbildung.“), Hafenbüro („Dann sieh nach.“), Zdenka („Wie war sie?“) | 00:11:19, 00:32:27, 00:58:20 |
| Inventar | Ja | Die Stricknadel wird aus der Leiste auf den Schuhkarton gezogen, mit der Anzeige „Benutze Stricknadel mit Schuhkarton“. Das ist echte Zeigereingabe, nichts ist nachgestellt. | 00:44:03–00:46:27 (Anzeige ab 00:45:18) |
| Notizbuch-Schlussfolgerungen | Ja | Zwei Notizen werden verbunden. Zuerst erscheint die graue Rückmeldung (reicht nicht), dann die grüne Schlussfolgerung. | 00:47:04, 00:49:13 |
| Übersetzungsrätsel | Ja | „Fikret den Brief übersetzen“: Marko liest eine Zeile vor, Fikret widerspricht. Die richtige Lösung wird nicht gezeigt. | 00:55:05–00:58:20 |
| Geisterwahrnehmung | Ja | Malas Sicht mit Leine, Geister in eigener Farbe, Spüren im Archiv, Tomaž an der Kula | 00:02:05, 00:25:07, 00:37:17 |
| Orte | Ja | **Split:** Riva, Markos Wohnung, Veli Varoš, Hotel Palma, Hafenbüro mit Archiv, Ivkas Wohnung. **Sarajevo:** Busbahnhof, Straßenbahn, Kazandžiluk, Sahat-kula, Hajras Pension, Baščaršija. | Ortsfolge 00:18:13–00:27:17, sonst durchgehend |
| Musik | Ja | Eigene Stücke der Engine, live synthetisiert und vom Master-Ausgang aufgenommen: Titelthema, Fall 1, Malas Thema, Geisterfläche | durchgehend |
| Klangkulisse | Ja | Raumklang und Geräusche der jeweiligen Aufnahme, zum Beispiel Wellen an der Riva, der dumpfe Klang in Malas Sicht und Menüklicks | durchgehend |
| Kapitel | Kapitel 1 und 2 spielbar | Das Titelbild zeigt „Kapitel 1: Split · Kapitel 2: Sarajevo“. Weitere Kapitel werden weder gezeigt noch angekündigt. | 01:09:26, Endkarte 01:23:27 |
| Speichern | Ja | Menü „Speichern (Platz 1)“ → „Gespeichert.“ Es gibt drei Plätze: `SLOTS=3` in `05_engine.js` und die Platzwahl im Titelmenü. Automatisches Speichern beim Ortswechsel ist geprüft (`verify3.js`): Hafenbüro-Tür → Platz 2 mit neuem Raum und neuem Zeitstempel. Speichern und Laden über ein Neuladen der Seite ist geprüft (`verify.js`). | 01:14:14–01:17:08 (Text „Drei Speicherplätze · speichert auch automatisch“) |
| Maus | Ja | Alle Aufnahmen sind mit dem spieleigenen Cursor über die echten Zeigerfunktionen gemacht. | durchgehend |
| Touch | Ja, in Emulation geprüft | Ein Tippen im Touch-Kontext bewegt Marko (x 188 → 76, `verify.js`). Ein echtes Touch-Gerät ist **nicht** getestet. | Text 01:09:26 |
| Im Browser | Ja | Das Spiel ist eine HTML-Datei. Die Aufnahmen stammen aus Chromium. | Text 01:09:26 |
| Offline | Ja, **nach vollständigem Erstladen** | Über http(s) geladen und der Service Worker meldet sich. Danach funktionieren Neuladen und ein neuer Tab ohne Netz. Ein Kaltstart ohne vorheriges Laden funktioniert nicht, deshalb lautet die Formulierung im Video genau so. Die Datei-Fassung startet zusätzlich auch ohne Netz (`verify2.js`). | Text 01:17:08 („Nach vollständigem Erstladen auch offline“) |
| Sprachen | Deutsch, Kapitel 1 auch Bosnisch/Kroatisch | Der Sprachschalter im Titelbild wird live umgeschaltet. Laut `SPRACHFASSUNG_BHS.md` ist Kapitel 1 vollständig übersetzt; Kapitel 2 läuft in dieser Sprachfassung auf Deutsch. | 01:12:14–01:14:14 |
| „Zeigen“ | Ja | Der Knopf blendet alle anklickbaren Stellen der Baščaršija ein: Oberleitung, Haltestelle, Bank und weitere. | 01:17:20 |

## Nicht beworben, weil es nicht vorhanden oder nicht geprüft ist

| Aussage | Status | Im Trailer |
|---|---|---|
| Sprachausgabe/Vertonung | Gibt es nicht, alle Dialoge sind Text | Keine Stimme, keine vorgetäuschte Vertonung, kein Sprecher |
| iPad, iOS, Safari, echte Tablets/Telefone | Nicht getestet | Nicht erwähnt |
| Spielzeit | Nicht gemessen | Nicht erwähnt |
| Preise, Auszeichnungen, Wertungen | Keine | Nicht erwähnt |
| Veröffentlichung, Store, Datum, Preis, Webadresse | Nichts bestätigt | Keine Logos, kein Datum, keine URL. Aufruf: „Entdecke MALA.“ |
| Kapitel 3–5 | Kapitel 3 ist nur Konzept (`KAPITEL3_KONZEPT.md`), 4 und 5 sind geplant | Nicht gezeigt, keine „Reihe“ angekündigt |
| Mehrspieler | Gibt es nicht | Nicht angedeutet |
