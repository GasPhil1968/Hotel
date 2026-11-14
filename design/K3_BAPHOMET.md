# Kapitel 3 (Mostar) „wie bei Baphomet“: Fragen über Bilder, Schlüsse durch Zeigen, Tagebuch, Mala-Knopf

Stand 14.11.2026. Code: `game/src/24_k3bf.js`. Kleine Haken:
- `05_engine.js`: `menuLoop` zeigt die Themenleiste statt der Zeile „Nach etwas aus dem Notizbuch fragen …“ (`E.bfBar`, `E.choosePick`); `API.askOpt` gibt seine Antworttabelle mit (`table`); `useWithItem`/`E.giveTo` (Gegenstand im Gespräch zeigen = dieselbe Antwort wie „Gib … an …“); `pickNote` wählt im Modus über Polaroids.
- `06_ui.js`: `M.bfFrame` (Leiste und Mala-Knopf zeichnen), Trefferflächen (`bf:`/`bfh`), „Notizen“ heißt „Tagebuch“, `E.openNotes` öffnet das Tagebuch.
- `07_shell.js`: Einstellung.

Vorbild: Baphomets Fluch 2. Dort gibt es kein Notizbuch zum Bedienen. Was George weiß, liegt im Gespräch als Bild bereit; man fragt, indem man das Bild antippt, und zeigt Gegenstände. Die Remastered-Fassung hat ein Tagebuch zum Lesen und Hinweise, die die Lage kennen. Klickbarer Entwurf: `design/notizbuch/gespraech_baphomet.html`.

## Einstellung

„Gespräche in Kapitel 3“: **wie bei Baphomet** (Vorgabe) oder **klassisch**. Gilt nur in Kapitel 3.
`?k3bf=1` / `?k3bf=0` erzwingt. Unter Testautomatisierung und in der Test-VM klassisch, außer `M.K3BF` ist gesetzt. Musterlösung im Modus: `MALA_K3BF=1 node game/tools/walkthrough3.js`.

## Gespräch: die Themenleiste

- Unter den Antwortsätzen (Breitbild: darüber) liegt eine Leiste mit Bildern. Links die **Themen**: die Notizgruppen des Kapitels (Die Brücke, Die Peilung, Zlata, Der Fährmann …), neueste zuerst. Rechts, nach einem Strich, die **Gegenstände** zum Zeigen.
- Ein Thema mit einer Notiz: ein Tipp fragt danach. Mit mehreren: ein Tipp öffnet darüber die Liste der Notizen dieser Gruppe; ein Tipp auf eine Zeile fragt.
- **Gelber Funke**: In dieser Gruppe ist seit dem letzten Gespräch mit dieser Person etwas Neues (höchstens die sechs jüngsten Notizen), zu dem sie eine eigene Antwort hat.
- **Blass mit Haken**: Zu dieser Gruppe hat die Person alles gesagt. Ein Schluss, der bei ihr noch möglich ist, verhindert den Haken, wird aber nicht durch einen Funken verraten.
- Gegenstände geben dieselbe Antwort wie „Gib … an …“. Gezeigt = blass mit Haken.
- Bei Mala gibt es die Leiste auch (sie hat keine Antworttabelle; ohne Schluss antwortet sie allgemein).
- Andere Notiz-Auswahlen (Dino: „eine wahre Geschichte“) zeigen die Notizen als Polaroids.

## Schlüsse durch Zeigen

Kombinieren gibt es im Modus nicht mehr; das Notizbuch ist durch das Tagebuch ersetzt. Die Schlüsse, die der Spieler bisher selbst verband, entstehen, wenn er der richtigen Person das Richtige zeigt. Die Person reagiert, dann zieht Marko den Schluss: dieselbe Notiz, derselbe Satz, dieselben Folgeszenen (`M.onDeduce`, Warteschlange `k3Queue`). Beide Notizen eines Paares müssen da sein; Bedingungen (`if`) gelten wie beim Verbinden.

| Schluss | Paar(e) | wem zeigen |
|---|---|---|
| Nicht die Alte Brücke | Malas Brücke stand im Wasser + Ein einziger Bogen (oder + Die Brücke fiel 1993) | **Dino** oder **Mala** |
| Eine Brücke, die keiner gezählt hat | Nicht die Alte Brücke + Malas Splitter | **Mala** oder **Dino** |
| Ein Mensch, kein Ort | Skela heißt Fähre (oder flussab) + Die Leine zeigt in die Stadt | **Mala** |
| Mala und Lana sind eine Spur | „Sie hat gesagt, sie heißt Mala“ oder Ljerkas Bild + Ich habe ihr den Namen gegeben | **Mala** |
| Zwei Suchen, die sich nie trafen | Mala und Lana sind eine Spur + Vermisst | **Mala** |
| Wer hat wen stehen lassen? | „Sie hat mich weggeschickt“ + „Er ist gefahren“ | **Mala** (Vlado nur, solange er vorn ist) |
| Bato war wach | „Dreimal“, „Nisam išao“ oder Licht in Batos Kammer + „Er hat geschlafen“ (oder „Nisam išao“ + „Es war ein Mann“) | **Zlata** oder **Bato** |
| Es war das Mädchen | Eine Mädchenstimme + Der Bleistift (oder + „Es war ein Mann“) | **Zlata** oder **Mala** |
| Sie hat den Fluss überlebt | Nachhall der Decke + Zlatas Decke | **Mala** oder **Zlata** |
| Eine Einladung, die sich nicht traut | Mates Briefe + Das Kinderzimmer | **Davor** oder **Jela** |
| So wollte er heißen | Lenas Postkarten (oder „Dida Mate“) + „Dragi dida“ | **Lena**, **Davor** oder **Jela** |
| Damit ich ihn nicht suchen muss | Ich habe ihn nie gesucht + „Und Sie?“ | **Mala** oder **Frau Kolar** |

Die Peilung (zu flach, hinter dem Kartenrand) und Skela auf der alten Karte zieht Marko wie bisher selbst; im Modus auch dann, wenn die Reihenfolge anders war. Das Ordnen der Nacht geht über Zlatas Küchentisch wie bisher.

## Markos Tagebuch

- Der Knopf „Notizen“ heißt „Tagebuch“ (auch Taste N). Ein aufgeschlagenes Buch: rechts die Einträge, unter dem Tag, an dem sie kamen (Donnerstag … Montag, „Aus Sarajevo“ für das, was Marko mitbringt). Neue Einträge schreibt der Stift, höchstens die drei neuesten.
- Links höchstens drei **offene Fragen**: die offenen Hinweisthemen, in der Reihenfolge des Hinweissystems.
- Man liest nur. Nichts zum Verbinden, keine Reiter.
- Die Meldung „Neue Notiz: …“ heißt im Modus „Tagebuch: …“.

## Mala-Knopf

- Oben rechts im Bild: Malas Gesicht (ist sie nicht da: Marko, „Nachdenken“). Darunter vier Punkte: die Stufe des aktuellen Themas.
- Ohne Fortschritt (keine neue Notiz, kein neuer Gegenstand, kein Ortswechsel …) flimmert er nach vier Minuten Spielzeit und fragt „Mala?“. Pausen, Szenen und offene Fenster zählen nicht mit.
- Jeder Tipp: die nächste Stufe des ersten offenen Hinweisthemas. Vor Stufe 4 fragt Mala nach. Dieselben Stufen wie im Menü „Hinweis …“ und im Gespräch mit Mala.
- Die Hinweistexte sagen im Modus „zeigen“ statt „verbinden“ (p3e, d2a, d2c, d2d, d2e, d3g, d3h, d3j, d3n, d3q, d3r, x3c; d1c, d1f, d1h: „ergibt sich von selbst“).

## Prüfung

- `qa/regress/bug_036_k3bf.js`: Leiste statt Notizbuch-Frage; anderes Thema bringt nichts; Dino → Nicht die Alte Brücke; ohne beide Notizen kein Schluss; Zlata → Bato war wach; Tagebuch; Mala-Knopf eine Stufe; Hinweistext; klassisch unverändert; keine JS-Fehler.
- Musterlösung im Modus: `MALA_K3BF=1 node game/tools/walkthrough3.js` (die Helfer in `game/tools/k3play.js` fragen über die Leiste und zeigen Schlüsse der Person, die gerade da ist).
