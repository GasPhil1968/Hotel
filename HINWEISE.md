# Die Stillen – Hinweistexte (Entwicklerübersicht)

Erzeugt mit `node game/tools/hintdoc.js` aus `game/src/15_hints_k1.js` bis `game/src/15_hints_k5.js`. Enthält Lösungen.

Jedes Thema ist ein Rätselabschnitt. „Offen, wenn“ ist die Bedingung im Quelltext (F = Schalter, N = Notiz, I = Inventar). Die Stufen: 1 Problem einordnen · 2 Denkrichtung · 3 Konkreter Ansatz · 4 Nächster Schritt. Stufe 4 kommt nur nach der Rückfrage.

## Kapitel 1: Split (76 Themen)

### Was liegt heute an? `k1_msg`

Offen, wenn: `G.phase==='pro' && !F(G,'pro.msg')`

1. **Problem einordnen:** Ein verregneter Dienstag, und noch ist nichts angefangen.
2. **Denkrichtung:** In der Wohnung wartet etwas darauf, gehört zu werden.
3. **Konkreter Ansatz:** Auf dem Schreibtisch blinkt etwas rot.
4. **Nächster Schritt:** Den Anrufbeantworter benutzen und die Nachrichten abhören.

### Seite einunddreißig `k1_p31a`

Offen, wenn: `G.phase==='pro' && fresh(G) && F(G,'pro.msg') && !F(G,'pro.translated') && !N(G,'pro_spia')`

1. **Problem einordnen:** Die Übersetzung für Graz muss heute raus. Auf Seite 31 hängt noch ein Satz.
2. **Denkrichtung:** Erst genau lesen, was dasteht, und was fehlt.
3. **Konkreter Ansatz:** Der Laptop auf dem Schreibtisch, der letzte Satz der Seite.
4. **Nächster Schritt:** Den Laptop benutzen und „Der letzte Satz auf Seite 31“ wählen.

### Welche Leuchte? `k1_p31b`

Offen, wenn: `G.phase==='pro' && fresh(G) && N(G,'pro_spia') && !N(G,'pro_red') && !F(G,'pro.translated')`

1. **Problem einordnen:** „Warten, bis die Leuchte erlischt.“ Die Maschine hat aber zwei.
2. **Denkrichtung:** Die Zeichnung fehlt. Eine Anleitung erklärt dasselbe oft an mehreren Stellen.
3. **Konkreter Ansatz:** Eine Seite weiter vorn beschreibt die Leuchten.
4. **Nächster Schritt:** Am Laptop „Weiter vorn nachlesen: Seite 30“ wählen.

### Den Satz fertig übersetzen `k1_p31c`

Offen, wenn: `G.phase==='pro' && fresh(G) && N(G,'pro_red') && !F(G,'pro.translated')`

1. **Problem einordnen:** Jetzt ist klar, welche Leuchte gemeint ist. Der Satz kann fertig werden.
2. **Denkrichtung:** Seite 30: die rote Leuchte zeigt den Druck im Kessel.
3. **Konkreter Ansatz:** Genau schreiben, welche Leuchte. Der Kunde merkt den Unterschied.
4. **Nächster Schritt:** Am Laptop „Den Satz fertig übersetzen“ wählen, die Fassung mit der roten Druckleuchte.

### Noch nicht wach `k1_coffee`

Offen, wenn: `G.phase==='pro' && F(G,'pro.msg') && !F(G,'pro.coffee')`

1. **Problem einordnen:** Mit diesem Kopf geht es nicht aus dem Haus.
2. **Denkrichtung:** Ein Kaffee. In der Kochnische steht alles dafür.
3. **Konkreter Ansatz:** Die Džezva braucht Wasser und Hitze, in dieser Reihenfolge.
4. **Nächster Schritt:** *je nach Stand:* „Die volle Džezva auf den Herd stellen.“ / „Die Džezva an der Spüle füllen, dann auf den Herd.“ / „Die Džezva nehmen, an der Spüle füllen, dann auf den Herd stellen.“

### Sanjas Brief nach Triest `k1_sanja`

Offen, wenn: `G.phase==='pro' && fresh(G) && F(G,'split.intro.v') && F(G,'pro.msg') && !F(G,'split.intro.sanja')`

1. **Problem einordnen:** Sanja wartet auf die Antwort nach Triest. Um vier ruft der Lieferant an.
2. **Denkrichtung:** In der Bar hat Sanja keine Hand frei. Wer sich an seinen Platz setzt, wird bedient.
3. **Konkreter Ansatz:** Markos Tisch in der Bar „Bura“. Beim Brief gilt: Sanja will den Lieferanten nicht verlieren, aber auch nicht einfach nachgeben.
4. **Nächster Schritt:** In der Bar Markos Tisch benutzen und für den Brief die feste Fassung wählen.

### Ivkas Wohnung `k1_key`

Offen, wenn: `G.phase==='pro' && F(G,'pro.msg') && !I(G,'key_ivka') && !N(G,'pro_list') && (!fresh(G)\|\|!F(G,'split.intro.v')\|\|F(G,'split.intro.sanja'))`

1. **Problem einordnen:** Ivkas Wohnung in Veli Varoš ist zu. Den Schlüssel hat die Nachbarin.
2. **Denkrichtung:** Gospođa Zdenka gibt ihn nicht jedem. Es kommt darauf an, wozu.
3. **Konkreter Ansatz:** Wer nur Zeichen zählen will, bekommt keinen Schlüssel. Wer über Ivka schreiben will, schon.
4. **Nächster Schritt:** Zdenka nach der Wohnung fragen und als Grund nennen: ein paar Zeilen, damit jemand weiß, dass sie gelebt hat.

### Ivkas Tür `k1_enter`

Offen, wenn: `G.phase==='pro' && I(G,'key_ivka') && !seen(G,'ivka')`

1. **Problem einordnen:** Der Schlüssel ist da. Die Wohnung wartet.
2. **Denkrichtung:** Ivka wohnte gleich hier in der Gasse.
3. **Konkreter Ansatz:** Ihre Tür in Veli Varoš, mit der Todesanzeige daran.
4. **Nächster Schritt:** Ivkas Tür öffnen.

### Der verschnürte Schuhkarton `k1_knot`

Offen, wenn: `G.phase==='pro' && I(G,'key_ivka') && !I(G,'postcard') && seen(G,'ivka')`

1. **Problem einordnen:** Ein Schuhkarton, mit einem festen Knoten verschnürt. Schneiden würde zerstören, was Ivka so sorgfältig verschnürt hat.
2. **Denkrichtung:** Einen festen Knoten löst man mit etwas Dünnem, Spitzem, nicht mit Gewalt. In einer Wohnung, in der gestrickt wurde, liegt so etwas herum.
3. **Konkreter Ansatz:** *je nach Stand:* „Der Knoten ist offen.“ / „Im Nähkorb liegen Stricknadeln.“
4. **Nächster Schritt:** *je nach Stand:* „Den Schuhkarton öffnen.“ / „Den Schuhkarton mit der Stricknadel benutzen, dann öffnen.“ / „Eine Stricknadel aus dem Nähkorb nehmen und den Schuhkarton damit benutzen.“

### Das Foto im Regal `k1_photo`

Offen, wenn: `G.phase==='pro' && I(G,'postcard') && !I(G,'photo1')`

1. **Problem einordnen:** Die Postkarte nennt ein Boot und einen Freund. Ein Bild fehlt noch dazu.
2. **Denkrichtung:** Ivka hat aufgehoben, was ihr wichtig war. Nicht nur im Karton.
3. **Konkreter Ansatz:** Ein Foto: zwei Männer im Boot.
4. **Nächster Schritt:** Das Foto mit den zwei Männern im Boot nehmen.

### Wofür hat Ivka gelebt? `k1_list`

Offen, wenn: `G.phase==='pro' && I(G,'key_ivka') && seen(G,'ivka') && !N(G,'pro_list')`

1. **Problem einordnen:** Bis jetzt erzählt in der Wohnung alles vom Warten. Für einen Nachruf ist das zu wenig.
2. **Denkrichtung:** Was hat Ivka den ganzen Tag getan, und für wen?
3. **Konkreter Ansatz:** Zdenka sagt: Sie strickte für die halbe Gasse. Im Nähkorb liegt mehr als Nadeln.
4. **Nächster Schritt:** Den Nähkorb lesen: Ivkas Strickheft.

### Keine Kontakte? `k1_people`

Offen, wenn: `G.phase==='pro' && N(G,'pro_list') && N(G,'pro_noone') && !N(G,'pro_people')`

1. **Problem einordnen:** Die Stadt schreibt: alleinstehend, keine Kontakte. Das Strickheft erzählt etwas anderes.
2. **Denkrichtung:** Zwei Aussagen über Ivka, die nicht zusammenpassen. Das Notizbuch kann sie gegeneinander halten.
3. **Konkreter Ansatz:** Die Notiz der Stadt und Ivkas Strickheft gehören zusammen.
4. **Nächster Schritt:** Im Notizbuch „Laut Stadt: keine Kontakte“ mit „Ivkas Strickheft“ verbinden.

### Die Namen im Heft `k1_gasse`

Offen, wenn: `G.phase==='pro' && N(G,'pro_people') && !N(G,'pro_gasse')`

1. **Problem einordnen:** Im Heft stehen Namen aus der Gasse. Wer sind diese Leute?
2. **Denkrichtung:** Wer kennt die Gasse besser als jede Behörde?
3. **Konkreter Ansatz:** Zdenka wohnt hier seit Jahrzehnten.
4. **Nächster Schritt:** Zdenka fragen: „In ihrem Heft stehen Namen aus der Gasse. Kennen Sie die Leute?“

### Ivkas Schlüssel `k1_return`

Offen, wenn: `G.phase==='pro' && I(G,'key_ivka') && N(G,'pro_gasse')`

1. **Problem einordnen:** Genug gesehen. Der Schlüssel gehört nicht Marko.
2. **Denkrichtung:** Zdenka wartet darauf, dass er zurückkommt.
3. **Konkreter Ansatz:** Zurück zu Zdenka in der Gasse.
4. **Nächster Schritt:** Zdenka sagen: „Hier ist Ihr Schlüssel.“ Oder den Schlüssel auf sie ziehen.

### Die Stelle an der Riva `k1_dizzy`

Offen, wenn: `G.phase==='pro_eve' && fresh(G) && F(G,'split.intro.v') && !F(G,'split.intro.dizzy')`

1. **Problem einordnen:** Bevor der Text entsteht: die Stelle, an der Ivka jeden Abend stand.
2. **Denkrichtung:** Zdenka hat gesagt, wohin Ivka um sieben ging.
3. **Konkreter Ansatz:** Die Riva, die Mole entlang, bis ganz ans Ende.
4. **Nächster Schritt:** An der Riva bis zum letzten Poller am Ende der Mole gehen.

### Zweitausend Zeichen `k1_article`

Offen, wenn: `ph(G,['pro_eve','pro_night']) && (!fresh(G)\|\|!F(G,'split.intro.v')\|\|F(G,'split.intro.dizzy')) && !F(G,'pro.article')`

1. **Problem einordnen:** Der Nachruf muss bis morgen früh fertig sein.
2. **Denkrichtung:** Alles Nötige ist gesammelt. Jetzt fehlt nur noch das Schreiben.
3. **Konkreter Ansatz:** Zu Hause, am Laptop.
4. **Nächster Schritt:** In der Wohnung den Laptop benutzen und den Nachruf schreiben.

### Ein langer Tag `k1_bed`

Offen, wenn: `ph(G,['pro_eve','pro_night']) && F(G,'pro.article')`

1. **Problem einordnen:** Der Text ist geschrieben. Für heute ist es genug.
2. **Denkrichtung:** Was jetzt noch fehlt, ist Schlaf.
3. **Konkreter Ansatz:** Das Bett in der Wohnung.
4. **Nächster Schritt:** Das Bett benutzen.

### Jemand in der Wohnung `k1_meet`

Offen, wenn: `G.phase==='c1' && fresh(G) && F(G,'split.intro.v') && !F(G,'split.intro.met')`

1. **Problem einordnen:** Etwas stimmt nicht in der Wohnung. Jemand ist da, den es nicht geben kann.
2. **Denkrichtung:** Erst prüfen, was wirklich ist: die Tür, und die Gestalt selbst.
3. **Konkreter Ansatz:** *je nach Stand:* „Beim Gehen zieht es. Von hinten.“ / „Die Tür. Ist sie wirklich abgeschlossen?“ / „Von nahem sieht man mehr. Gegen die Lampe zum Beispiel.“ / „Besuch bietet man etwas an. Aus Gewohnheit: ein Glas Wasser.“
4. **Nächster Schritt:** *je nach Stand:* „Zur Wohnungstür gehen.“ / „Noch einmal zur Wohnungstür gehen.“ / „Die Gestalt ansehen.“ / „Ihr das Glas Wasser geben, dann fragen: Wer bist du?“ / „Das Glas an der Spüle füllen.“ / „Ein Glas aus dem Regal über der Kochnische nehmen, an der Spüle füllen und ihr geben.“

### Vor Marko war auch jemand `k1_mole`

Offen, wenn: `G.phase==='c1' && (F(G,'split.intro.met')\|\|!fresh(G)\|\|!F(G,'split.intro.v')) && !F(G,'c1.met')`

1. **Problem einordnen:** „Und vor dir war auch jemand.“ Am Ort des ersten richtigen Schwindels.
2. **Denkrichtung:** Der Schwindel kam an der Riva.
3. **Konkreter Ansatz:** Am Ende der Mole, beim letzten Poller.
4. **Nächster Schritt:** An der Riva bis ans Ende der Mole gehen.

### Worauf wartet Ivka? `k1_ivka1`

Offen, wenn: `ph(G,['c1','c1_night']) && F(G,'c1.met') && !N(G,'c1_askoffice')`

1. **Problem einordnen:** Ivka wartet auf ein Boot.
2. **Denkrichtung:** Wer wartet, erzählt gern, worauf.
3. **Konkreter Ansatz:** Welches Boot, welcher Tag, und warum es so spät ist.
4. **Nächster Schritt:** Mit Ivka reden: welches Boot, welcher Tag, und dass das Boot spät ist.

### Warum ist das Boot so spät? `k1_office`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_askoffice') && !F(G,'c1.searched')`

1. **Problem einordnen:** Ivka will wissen, warum das Boot so spät ist.
2. **Denkrichtung:** Wer führt Buch über Boote und Fähren?
3. **Konkreter Ansatz:** Das Hafenbüro an der Riva. Mladen sucht erst, wenn er das genaue Datum hat.
4. **Nächster Schritt:** Im Hafenbüro mit Mladen reden: eine Frage zu einer Fähre, für einen Text, und das Datum von der Postkarte.

### Der fehlende Band `k1_test`

Offen, wenn: `ph(G,['c1','c1_night']) && F(G,'c1.searched') && !F(G,'mk.test') && !N(G,'c1_1948')`

1. **Problem einordnen:** Der Band 1984 ist nicht im Regal. Mladen findet ihn nicht, und ins Archiv geht er nicht noch einmal.
2. **Denkrichtung:** Das Archiv ist abgeschlossen. Für Lebende.
3. **Konkreter Ansatz:** *je nach Stand:* „Das Flimmern hat angeboten nachzusehen. Es wartet auf ein Ja.“ / „Mala hat angeboten nachzusehen. Sie braucht nur ein Ja.“ / „Ich kann nachsehen. Du musst es nur sagen.“
4. **Nächster Schritt:** *je nach Stand:* „Das Flimmern ansprechen und leise sagen: „Dann sieh nach.““ / „Mala ansprechen und leise sagen: „Dann sieh nach.““ / „Mich ansprechen und leise sagen: „Dann sieh nach.““

### Wo steht der Band 1984? `k1_archive`

Offen, wenn: `ph(G,['c1','c1_night']) && F(G,'mk.test') && !N(G,'c1_1948')`

1. **Problem einordnen:** Irgendwo im Archiv steht der Band 1984. Nur nicht da, wo er hingehört.
2. **Denkrichtung:** Ein ausgeblichenes Rückenschild verrät mit Augen nichts mehr. Es braucht ein anderes Gespür.
3. **Konkreter Ansatz:** Mala geht durch die Tür „SAMO OSOBLJE“. Bei einem ausgeblichenen Ordner reicht Ansehen nicht. *(Mala: Ich gehe durch die Tür „SAMO OSOBLJE“. Bei einem ausgeblichenen Ordner reicht Ansehen nicht.)*
4. **Nächster Schritt:** Zu Mala wechseln, ins Archiv gehen und den Ordner im Fach „1948“ spüren. *(Mala: Zu mir wechseln, ins Archiv gehen und den Ordner im Fach „1948“ spüren.)*

### Mladen und das Regal `k1_log`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_1948') && !F(G,'c1.logRead')`

1. **Problem einordnen:** Der Band ist gefunden. Herausziehen kann ihn nur einer, der lebt.
2. **Denkrichtung:** Mladen holt ihn, wenn er weiß, wo er suchen soll.
3. **Konkreter Ansatz:** Ein Zahlendreher: 1984 steht bei 1948.
4. **Nächster Schritt:** Als Marko Mladen sagen: „Schauen Sie mal im Regal bei 1948.“

### Die Fähre fiel aus `k1_came`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_ferry') && N(G,'c1_boat7') && !N(G,'c1_came')`

1. **Problem einordnen:** Die Fähre fuhr an dem Abend nicht. Und doch wollte Tonći um sieben kommen.
2. **Denkrichtung:** Zwei Notizen, die zusammen etwas Neues ergeben.
3. **Konkreter Ansatz:** Tonćis Versprechen auf der Postkarte und der Eintrag im Fahrtenbuch.
4. **Nächster Schritt:** Im Notizbuch „Boot um sieben“ mit „Fähre fiel aus“ verbinden.

### Dinko an der Matejuška `k1_dinko1`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_matejuska') && !N(G,'c1_brother') && !F(G,'c1.dinkoTold')`

1. **Problem einordnen:** Dinko Matić war dabei. Er flickt seine Netze an der Matejuška und will nicht reden.
2. **Denkrichtung:** Fragen helfen bei ihm nicht. Etwas aus der Zeit von damals vielleicht.
3. **Konkreter Ansatz:** Das Foto aus Ivkas Wohnung zeigt Tonći und Dinko auf der ANKICA.
4. **Nächster Schritt:** An der Matejuška Dinko das Foto mit den zwei Männern im Boot zeigen.

### Dinkos Schweigen `k1_shed`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_brother') && !N(G,'c1_words')`

1. **Problem einordnen:** Dinko wird weicher, aber über die Nacht schweigt er.
2. **Denkrichtung:** Was er nicht sagt, hat er vielleicht aufgehoben. Hinter einer Tür, die zu bleibt.
3. **Konkreter Ansatz:** Mala geht durch die verschlossene Tür seines Schuppens. Am Seesack hängt etwas. *(Mala: Ich gehe durch die verschlossene Tür seines Schuppens. Am Seesack hängt etwas.)*
4. **Nächster Schritt:** Zu Mala wechseln, in den Schuppen gehen und den Seesack spüren. *(Mala: Zu mir wechseln, in den Schuppen gehen und den Seesack spüren.)*

### Was Tonći im Wasser sagte `k1_dinko2`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_words') && !F(G,'c1.dinkoTold')`

1. **Problem einordnen:** Tonćis letzte Worte sind bekannt. Dinko hat sie nie jemandem erzählt.
2. **Denkrichtung:** Wer es weiß, kann Dinko sein Schweigen nehmen.
3. **Konkreter Ansatz:** Mit Dinko reden. Was im Wasser gesagt wurde, und dass Ivka noch wartet.
4. **Nächster Schritt:** Mit Dinko reden: „Ich weiß, was Tonći im Wasser gesagt hat“, dann „Ivka wartet noch“.

### Der verklebte Brief `k1_steam`

Offen, wenn: `ph(G,['c1','c1_night']) && I(G,'letter_t') && !F(G,'c1.letterOpen')`

1. **Problem einordnen:** Tonćis Brief ist zu. Das Salz hat die Seiten zusammengebacken.
2. **Denkrichtung:** Trocken reißt er. Papier, das klebt, löst sich mit Wärme und Feuchtigkeit.
3. **Konkreter Ansatz:** Dampf. Zu Hause gibt es Džezva, Spüle und Herd. Eine offene Flamme verbrennt ihn nur.
4. **Nächster Schritt:** *je nach Stand:* „In der Wohnung die volle Džezva auf den Herd stellen und dann den Brief am Herd benutzen.“ / „In der Wohnung die Džezva an der Spüle füllen, auf den Herd stellen und dann den Brief am Herd benutzen.“

### Ausgewaschene Schrift `k1_read`

Offen, wenn: `ph(G,['c1','c1_night']) && F(G,'c1.letterOpen') && !N(G,'c1_letter')`

1. **Problem einordnen:** Der Brief ist offen, aber das Wasser hat die Schrift fast gelöscht.
2. **Denkrichtung:** Was nicht mehr auf dem Papier steht, hängt vielleicht noch an der Hand, die es schrieb.
3. **Konkreter Ansatz:** Mala liest, was das Wasser gelöscht hat, wie im Archiv. *(Mala: Ich lese, was das Wasser gelöscht hat, wie im Archiv.)*
4. **Nächster Schritt:** Den Brief auf Mala ziehen. *(Mala: Den Brief auf mich ziehen.)*

### Ivka die Wahrheit sagen `k1_ivka2`

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_came') && N(G,'c1_letter') && I(G,'gloves') && !F(G,'c1.release')`

1. **Problem einordnen:** Alles für Ivka ist beisammen: was mit der Fähre war, wie Tonći kam, sein Brief, die Handschuhe.
2. **Denkrichtung:** Ivka glaubt nur, was sie selbst nachprüfen kann. Schritt für Schritt, vom Boot bis zum Geschenk.
3. **Konkreter Ansatz:** Erst die Fähre, dann die ANKICA, dann der Brief, zuletzt die Handschuhe.
4. **Nächster Schritt:** An der Mole Tonćis Brief auf Ivka ziehen, dann nacheinander: die ausgefallene Fähre, die ANKICA, den Brief vorlesen, die Handschuhe.

### Ivka kann gehen `k1_cross1`

Offen, wenn: `F(G,'c1.release') && !F(G,'c1.done') && !inLimbo(G)`

1. **Problem einordnen:** Ivka weiß es jetzt. Die Leine hat sich vom Poller gelöst.
2. **Denkrichtung:** Allein findet sie den Weg nicht.
3. **Konkreter Ansatz:** Mala kann sie hinüberbringen. *(Mala: Ich kann sie hinüberbringen.)*
4. **Nächster Schritt:** Als Mala bei Ivka „Hinüberbringen“ wählen. *(Mala: Bei Ivka „Hinüberbringen“ wählen.)*

### Ivka friert `k1_limbo1`

Offen, wenn: `F(G,'c1.release') && !F(G,'c1.done') && inLimbo(G)`

1. **Problem einordnen:** Ivka steht vor dem Licht und geht nicht weiter.
2. **Denkrichtung:** Was hat sie ihr Leben lang nie getragen, und was hat Tonći ihr mitgebracht?
3. **Konkreter Ansatz:** Hier kann sie halten, was ihr vorher durch die Finger fiel.
4. **Nächster Schritt:** Ivka die Handschuhe geben.

### Ein gewöhnlicher Morgen `k1_morning`

Offen, wenn: `G.phase==='i1m' && !F(G,'split.afterIvka.back')`

1. **Problem einordnen:** Kein Kopfweh, kein Mädchen, keine Stimme. Ein gewöhnlicher Morgen.
2. **Denkrichtung:** Heute ein Kaffee, den jemand anders gemacht hat.
3. **Konkreter Ansatz:** In der Bar „Bura“ wartet der Platz am Fenster.
4. **Nächster Schritt:** In der Bar Markos Tisch benutzen.

### Etwas Kleines `k1_note`

Offen, wenn: `G.phase==='i1m' && F(G,'split.afterIvka.back') && !N(G,'i1_note')`

1. **Problem einordnen:** „Dann fang mit etwas Kleinem an.“ Etwas, das sich nachprüfen lässt.
2. **Denkrichtung:** Etwas, das nur jemand wissen kann, der dorthin sieht, wohin Gäste nicht kommen.
3. **Konkreter Ansatz:** Hinter dem Tresen hängt ein Zettel. Vom Tisch aus nicht zu lesen. Mala kann hinter den Tresen. *(Mala: Hinter dem Tresen hängt ein Zettel. Vom Tisch aus nicht zu lesen. Ich kann hinter den Tresen.)*
4. **Nächster Schritt:** Zu Mala wechseln und den Zettel hinter dem Tresen ansehen. *(Mala: Zu mir wechseln und den Zettel hinter dem Tresen ansehen.)*

### Stimmt es? `k1_verify`

Offen, wenn: `G.phase==='i1m' && N(G,'i1_note') && !F(G,'split.afterIvka.verified')`

1. **Problem einordnen:** Was auf dem Zettel steht, ist bekannt. Stimmt es auch?
2. **Denkrichtung:** Wer hat den Zettel geschrieben?
3. **Konkreter Ansatz:** Sanja, beiläufig gefragt.
4. **Nächster Schritt:** Sanja fragen: „Du machst am Montag zu?“

### Ans Wasser `k1_bench`

Offen, wenn: `G.phase==='i1m' && F(G,'split.afterIvka.verified') && !F(G,'mk.accept')`

1. **Problem einordnen:** Mala will ans Wasser. *(Mala: Ich will ans Wasser.)*
2. **Denkrichtung:** Ein Ort zum Sitzen und Reden, mit Blick aufs Meer.
3. **Konkreter Ansatz:** An der Riva steht eine Bank.
4. **Nächster Schritt:** An der Riva die Bank benutzen und mit Mala reden. *(Mala: An der Riva die Bank benutzen und mit mir reden.)*

### „Da ist noch einer.“ `k2_news`

Offen, wenn: `G.phase==='c2' && !N(G,'c2_demolish') && !N(G,'c2_boy')`

1. **Problem einordnen:** Mala sagt: Da ist noch einer. Aber wo? *(Mala: Da ist noch einer. Aber wo?)*
2. **Denkrichtung:** In der Bar wird über alles geredet, was in der Stadt passiert.
3. **Konkreter Ansatz:** Sanja weiß, was abgerissen wird. Stipe und Frane wissen, was dort einmal war.
4. **Nächster Schritt:** In der Bar Sanja nach der alten Ledana fragen und mit Stipe reden.

### Werkzeug für die Ledana `k2_tool`

Offen, wenn: `G.phase==='c2' && N(G,'c2_demolish') && !I(G,'crowbar') && !I(G,'tickets')`

1. **Problem einordnen:** Die alte Ledana ist verfallen. Mit bloßen Händen kommt man da nicht weit.
2. **Denkrichtung:** Wer am Hafen hat Werkzeug und hat Hilfe angeboten?
3. **Konkreter Ansatz:** Dinko an der Matejuška: „Wenn du was brauchst, ich bin hier.“
4. **Nächster Schritt:** Dinko nach einem Brecheisen fragen, für die alte Ledana.

### Der Bauzaun `k2_fence`

Offen, wenn: `G.phase==='c2' && N(G,'c2_demolish') && !N(G,'c2_gap') && !seen(G,'ledana')`

1. **Problem einordnen:** Die Ledana ist eingezäunt.
2. **Denkrichtung:** Ein Zaun hat Lücken. Nicht jede ist von vorn zu sehen.
3. **Konkreter Ansatz:** Mala sieht hinter die Fischkisten am Zaun. *(Mala: Ich sehe hinter die Fischkisten am Zaun.)*
4. **Nächster Schritt:** Zu Mala wechseln und die Fischkisten am Zaun ansehen. *(Mala: Zu mir wechseln und die Fischkisten am Zaun ansehen.)*

### Durch den Zaun `k2_crawl`

Offen, wenn: `G.phase==='c2' && N(G,'c2_gap') && !seen(G,'ledana')`

1. **Problem einordnen:** Hinter den Kisten ist ein loses Zaunfeld.
2. **Denkrichtung:** Mala kann nichts bewegen. Marko schon.
3. **Konkreter Ansatz:** Die Kisten müssen weg, dann geht es durch die Lücke.
4. **Nächster Schritt:** Als Marko die Fischkisten schieben und durch die Lücke kriechen.

### Oben in der Ledana `k2_luka`

Offen, wenn: `G.phase==='c2' && seen(G,'ledana') && !F(G,'found.luka')`

1. **Problem einordnen:** Oben auf der Empore war einmal jemand. Ist er noch da?
2. **Denkrichtung:** Die Treppe ist morsch. Hinauf kommt nur, wer nichts wiegt.
3. **Konkreter Ansatz:** Mala geht hinauf. *(Mala: Ich gehe hinauf.)*
4. **Nächster Schritt:** Zu Mala wechseln, hinauf zur Empore und mit dem Jungen dort reden. *(Mala: Zu mir wechseln, hinauf zur Empore und mit dem Jungen dort reden.)*

### Der Kühlraum `k2_case`

Offen, wenn: `G.phase==='c2' && F(G,'found.luka') && I(G,'crowbar') && !I(G,'tickets')`

1. **Problem einordnen:** Lukas Gitarre liegt im Kühlraum. Die Tür ist verrostet, drinnen ist es dunkel.
2. **Denkrichtung:** Einer geht durch Türen und sieht im Dunkeln, der andere hat Werkzeug.
3. **Konkreter Ansatz:** *je nach Stand:* „Unter dem Schutt liegt ein Koffer. Das Brecheisen öffnet die Tür und hebt die Brocken.“ / „Erst schaut Mala im Kühlraum nach, wo etwas liegt. Dann öffnet Marko die Tür.“ / „Erst schaue ich im Kühlraum nach, wo etwas liegt. Dann öffnest du die Tür.“
4. **Nächster Schritt:** *je nach Stand:* „Als Marko das Brecheisen an der Kühlraumtür benutzen, hineingehen, mit dem Brecheisen den Schutt beiseiteräumen und den Koffer öffnen.“ / „Zu Mala wechseln, durch die Kühlraumtür gehen und den Schutt spüren.“ / „Zu mir wechseln, durch die Kühlraumtür gehen und den Schutt spüren.“

### Wer ist Nina? `k2_sanja`

Offen, wenn: `G.phase==='c2' && F(G,'found.luka') && !N(G,'c2_shop')`

1. **Problem einordnen:** Luka wartet auf Nina. Wer ist sie, und wo ist sie heute?
2. **Denkrichtung:** Wer in Split kennt die Leute von damals?
3. **Konkreter Ansatz:** Sanja. Sie erzählt, wenn es etwas Greifbares gibt.
4. **Nächster Schritt:** In der Bar Sanja auf Luka und Nina ansprechen und fragen, wo Nina zu finden ist.

### Ninas Laden `k2_shop`

Offen, wenn: `G.phase==='c2' && N(G,'c2_shop') && !seen(G,'shop')`

1. **Problem einordnen:** Nina hat einen Rahmenladen in der Altstadt: „Okvir“.
2. **Denkrichtung:** Wer zu früh nach Luka fragt, steht wieder draußen.
3. **Konkreter Ansatz:** Erst einmal Kunde sein. Und sehen, was sie aufhebt.
4. **Nächster Schritt:** In der Altstadt zu „Okvir“ gehen und mit Nina reden.

### Was Nina aufhebt `k2_back`

Offen, wenn: `G.phase==='c2' && seen(G,'shop') && !N(G,'c2_unused')`

1. **Problem einordnen:** Nina redet nicht über Luka. Was bewahrt sie auf?
2. **Denkrichtung:** Hinter dem Laden ist ein Zimmer, das Kunden nicht betreten.
3. **Konkreter Ansatz:** Mala geht durch die Tür „Privat“. *(Mala: Ich gehe durch die Tür „Privat“.)*
4. **Nächster Schritt:** Zu Mala wechseln, ins Hinterzimmer gehen und die gerahmte Reservierung ansehen und spüren. *(Mala: Zu mir wechseln, ins Hinterzimmer gehen und die gerahmte Reservierung ansehen und spüren.)*

### Ist Nina gefahren? `k2_waited`

Offen, wenn: `G.phase==='c2' && N(G,'c2_unused') && !N(G,'c2_waited')`

1. **Problem einordnen:** Ninas Reservierung wurde nie eingelöst.
2. **Denkrichtung:** Wo hätte sie an dem Abend sein sollen?
3. **Konkreter Ansatz:** Luka wollte sie am Kiosk treffen.
4. **Nächster Schritt:** Im Notizbuch die nie eingelöste Reservierung mit dem Treffpunkt am Kiosk verbinden.

### Der Briefkasten `k2_brick`

Offen, wenn: `G.phase==='c2' && N(G,'c2_paper') && !I(G,'note_n') && !F(G,'c2.brickDone')`

1. **Problem einordnen:** Hinter dem lockeren Ziegel an der Rampe steckt ein Papier.
2. **Denkrichtung:** *je nach Stand:* „Mit dem Brecheisen käme die halbe Wand mit. Es braucht etwas Dünnes, Flaches.“ / „Der Ziegel sitzt fest in der Fuge. Gewalt reißt die Wand ein.“
3. **Konkreter Ansatz:** *je nach Stand:* „Der Spachtel ist dünn genug.“ / „Etwas Dünnes, Flaches. So etwas verkauft ein Laden, der Bilder rahmt.“
4. **Nächster Schritt:** *je nach Stand:* „An der Rampe den Spachtel am lockeren Ziegel benutzen.“ / „In Ninas Laden „Okvir“ nach einem Spachtel fragen.“ / „Erst herausfinden, wer einen Rahmenladen hat. Sanja kennt die Leute.“

### Ein Lied auf Kassette `k2_radio1`

Offen, wenn: `G.phase==='c2' && I(G,'cassette') && !I(G,'radio') && !I(G,'radioB') && !I(G,'radioT')`

1. **Problem einordnen:** Auf der Kassette ist Lukas Lied. Nur womit abspielen?
2. **Denkrichtung:** Ein Kassettenrekorder. Jemand hat jeden Abend damit den Seewetterbericht gehört.
3. **Konkreter Ansatz:** Zdenka hat Ivkas Radiorekorder. Sie freut sich über die Zeitung mit dem Nachruf.
4. **Nächster Schritt:** *je nach Stand:* „Zdenka in Veli Varoš die Zeitung geben.“ / „In der Bar die Zeitung vom Tresen nehmen und sie Zdenka in Veli Varoš bringen.“

### Der Rekorder schweigt `k2_radio2`

Offen, wenn: `G.phase==='c2' && I(G,'radio') && !I(G,'radioB') && !I(G,'radioT')`

1. **Problem einordnen:** Ivkas Rekorder ist da, aber er schweigt.
2. **Denkrichtung:** Ohne Strom spielt er nichts.
3. **Konkreter Ansatz:** *je nach Stand:* „Die Batterien sind gekauft.“ / „Am Kiosk im Fährhafen verkauft Mira Batterien.“ / „Batterien gibt es am Kiosk im Fährhafen. Wer dort arbeitet, weiß Sanja.“
4. **Nächster Schritt:** *je nach Stand:* „Die Batterien in den Rekorder legen.“ / „Bei Mira am Kiosk Batterien kaufen und in den Rekorder legen.“ / „Sanja fragen, wer damals noch am Hafen war.“

### Abspielbereit `k2_radio3`

Offen, wenn: `G.phase==='c2' && I(G,'radioB') && I(G,'cassette')`

1. **Problem einordnen:** Der Rekorder läuft, die Kassette ist da.
2. **Denkrichtung:** Zwei Dinge, die zusammengehören.
3. **Konkreter Ansatz:** Die Kassette gehört in den Rekorder.
4. **Nächster Schritt:** Die Kassette mit dem Rekorder benutzen.

### Ninas Zettel `k2_luka2`

Offen, wenn: `G.phase==='c2' && I(G,'note_n') && !F(G,'c2.lukaKnows')`

1. **Problem einordnen:** Ninas Zettel von 1999 ist gefunden. Er war für Luka.
2. **Denkrichtung:** Wer einen Brief nie bekommen hat, sollte ihn jetzt hören.
3. **Konkreter Ansatz:** Luka sitzt noch oben in der Ledana.
4. **Nächster Schritt:** In der Ledana mit Luka reden und vom Briefkasten erzählen.

### Nina überzeugen `k2_nina2`

Offen, wenn: `G.phase==='c2' && (I(G,'note_n')\|\|ninaShown(G,'note')) && I(G,'tickets') && I(G,'radioT') && !F(G,'c2.tonight')`

1. **Problem einordnen:** Nina muss es hören: den Zettel, die Tickets, das Lied.
2. **Denkrichtung:** Sie will nicht an die Rampe, seit Jahren nicht. Sie kommt nur, wenn sie merkt, dass jemand verstanden hat, worauf sie wartet.
3. **Konkreter Ansatz:** Erst die Ledana, dann ihr eigener Zettel, Lukas Tickets, die Kassette. Und wenn sie zögert, etwas über ihr Warten: was Mira gesehen hat, oder was ihre Bilder zeigen.
4. **Nächster Schritt:** *je nach Stand:* „Mit Nina reden: „Ich war in der Ledana“, ihr Zettel, die Tickets, die Kassette, „Wollen Sie es hören?“, und dann nach ihrem Warten fragen.“ / „Lukas Tickets“ / „Mit Nina reden und ihr zeigen: “ / „. Dann „Wollen Sie es hören?““ / „Mit Nina reden: „Wollen Sie es hören?“, und dann nach ihrem Warten fragen.“

### An der Rampe `k2_ramp`

Offen, wenn: `G.phase==='c2_night' && !F(G,'c2.release')`

1. **Problem einordnen:** Nina ist gekommen. Die Fähre legt bald ab.
2. **Denkrichtung:** Luka hat ein Lied für sie.
3. **Konkreter Ansatz:** Der Rekorder mit der Kassette.
4. **Nächster Schritt:** Nina den Rekorder mit der Kassette geben.

### Luka kann gehen `k2_cross`

Offen, wenn: `F(G,'c2.release') && !F(G,'c2.done') && !inLimbo(G)`

1. **Problem einordnen:** Luka weiß es jetzt. Die Leine ist gerissen.
2. **Denkrichtung:** Allein findet er den Weg nicht.
3. **Konkreter Ansatz:** Mala kann ihn hinüberbringen. *(Mala: Ich kann ihn hinüberbringen.)*
4. **Nächster Schritt:** Als Mala bei Luka „Hinüberbringen“ wählen. *(Mala: Bei Luka „Hinüberbringen“ wählen.)*

### Ohne Ticket `k2_limbo`

Offen, wenn: `F(G,'c2.release') && !F(G,'c2.done') && inLimbo(G)`

1. **Problem einordnen:** Luka sucht die Fähre. Ohne Ticket lassen sie ihn nirgends rein.
2. **Denkrichtung:** Die Tickets von damals sind nicht verloren.
3. **Konkreter Ansatz:** Sie lagen in seinem Koffer.
4. **Nächster Schritt:** Luka die Tickets geben.

### Ninas Ticket `k2_ticket`

Offen, wenn: `F(G,'c2.done') && I(G,'ticket_n')`

1. **Problem einordnen:** Luka hat ein Ticket mitgenommen. Das andere ist für Nina.
2. **Denkrichtung:** Sie soll selbst entscheiden, ob sie fährt.
3. **Konkreter Ansatz:** Nina steht noch an der Rampe.
4. **Nächster Schritt:** Nina ihr Ticket geben.

### Spät in der Nacht `k2_i2`

Offen, wenn: `G.phase==='i2'`

1. **Problem einordnen:** Der Fall ist vorbei. Es ist spät.
2. **Denkrichtung:** Mala ist noch da. *(Mala: Ich bin noch da.)*
3. **Konkreter Ansatz:** Reden, oder nach Hause gehen.
4. **Nächster Schritt:** Mit Mala reden. *(Mala: Mit mir reden.)*

### Das Telefon `k3_call`

Offen, wenn: `G.phase==='c3' && !F(G,'c3.call')`

1. **Problem einordnen:** Das Telefon klingelt.
2. **Denkrichtung:** Jemand will etwas.
3. **Konkreter Ansatz:** Das Telefon in der Wohnung.
4. **Nächster Schritt:** Ans Telefon gehen.

### Ein Auftrag im Palma `k3_ljerka`

Offen, wenn: `G.phase==='c3' && F(G,'c3.call') && !I(G,'documents') && !F(G,'c3.read')`

1. **Problem einordnen:** Ljerka Lalić vom Hotel Palma braucht Übersetzungen.
2. **Denkrichtung:** Ein Auftrag beginnt mit einem Gespräch.
3. **Konkreter Ansatz:** Ljerka ist an der Rezeption. Sie ist immer an der Rezeption.
4. **Nächster Schritt:** Im Hotel Palma mit Ljerka reden und fragen, was zu übersetzen ist.

### Die Mappe `k3_read`

Offen, wenn: `G.phase==='c3' && I(G,'documents') && !F(G,'c3.read')`

1. **Problem einordnen:** Die Dokumentenmappe ist da. Übersetzt ist noch nichts.
2. **Denkrichtung:** Ein Übersetzer braucht einen Tisch.
3. **Konkreter Ansatz:** In der Halle steht ein Lesetisch.
4. **Nächster Schritt:** Den Lesetisch in der Halle benutzen.

### Die Glocke klingelt allein `k3_bell`

Offen, wenn: `G.phase==='c3_night' && !F(G,'found.bruno')`

1. **Problem einordnen:** Ljerka schläft. Die Glocke der Portiersloge klingelt trotzdem.
2. **Denkrichtung:** Wer hier noch Dienst tut, ist für Lebende nicht zu sehen.
3. **Konkreter Ansatz:** Mala spürt am Portiersstuhl, wer da sitzt. *(Mala: Ich spüre am Portiersstuhl, wer da sitzt.)*
4. **Nächster Schritt:** Zu Mala wechseln und die Portiersloge spüren. *(Mala: Zu mir wechseln und die Portiersloge spüren.)*

### Bruno fehlen die Worte `k3_bruno1`

Offen, wenn: `G.phase==='c3_night' && F(G,'found.bruno') && !N(G,'c3_f13')`

1. **Problem einordnen:** Bruno antwortet nur in Bruchstücken.
2. **Denkrichtung:** Bruchstücke können Hinweise sein, wenn man die richtigen Fragen stellt.
3. **Konkreter Ansatz:** Fragen nach dem Salon. Was oben ist, und womit er aufgeht.
4. **Nächster Schritt:** Als Marko mit Bruno reden: nach dem Schlüssel für den Salon fragen und danach, was oben im Salon ist.

### Dreizehn, Mantel, Haken `k3_coat`

Offen, wenn: `G.phase==='c3_night' && N(G,'c3_f13') && !I(G,'keyring')`

1. **Problem einordnen:** „trinaest … Mantel … Haken“: dreizehn, Mantel, Haken.
2. **Denkrichtung:** Wo hängen in einem Hotel Mäntel an nummerierten Haken?
3. **Konkreter Ansatz:** In der Garderobe der Halle, Haken 13.
4. **Nächster Schritt:** Den Mantel am Haken 13 benutzen.

### Keine Musik `k3_crank`

Offen, wenn: `G.phase==='c3_night' && (N(G,'c3_fcrank')\|\|N(G,'c3_img_crank')) && !I(G,'crank') && !F(G,'c3.brunoUp') && !(G.rooms&&G.rooms.salon&&G.rooms.salon.crank)`

1. **Problem einordnen:** „nema glazbe … ručka“: keine Musik, Kurbel.
2. **Denkrichtung:** Wer etwas versteckt, damit niemand mehr Musik macht, legt es dorthin, wo er jeden Tag sitzt.
3. **Konkreter Ansatz:** In der Portiersloge, unter dem Telefonbuch.
4. **Nächster Schritt:** Das Telefonbuch in der Loge nehmen.

### Der Salon `k3_salon`

Offen, wenn: `G.phase==='c3_night' && I(G,'keyring') && !seen(G,'salon')`

1. **Problem einordnen:** Der Salon ist seit 1993 verschlossen.
2. **Denkrichtung:** Am Schlüsselring aus dem Mantel hängt ein großer Schlüssel.
3. **Konkreter Ansatz:** Die Treppe hinauf, die Kette aushaken.
4. **Nächster Schritt:** Mit dem Schlüsselring die Treppe zum Salon hinaufgehen.

### Musik für Bruno `k3_music`

Offen, wenn: `G.phase==='c3_night' && seen(G,'salon') && !F(G,'c3.brunoUp')`

1. **Problem einordnen:** Bruno sitzt unten in der Loge. Der Salon ist still.
2. **Denkrichtung:** Musik hat ihn früher jeden Sonntag hinaufgeholt.
3. **Konkreter Ansatz:** Das Grammofon braucht seine Kurbel und eine Platte.
4. **Nächster Schritt:** *je nach Stand:* „Die Kurbel ans Grammofon stecken, dann die Platte aus dem Plattenschrank auflegen.“ / „Die Kurbel aus der Loge holen und ans Grammofon stecken.“ / „Die Platte auf das Grammofon legen.“ / „Den Plattenschrank öffnen und die Platte auf das Grammofon legen.“

### Brunos Erinnerungen `k3_ins`

Offen, wenn: `G.phase==='c3_night' && F(G,'found.bruno') && lvl(G)<3`

1. **Problem einordnen:** Bruno bekommt seinen Satz nicht zusammen. Ihm fehlen Erinnerungen.
2. **Denkrichtung:** Drei Dinge rufen sie zurück: woran er jeden Sonntag dachte, wie seine Tochter spielte, und was er versteckt hat.
3. **Konkreter Ansatz:** *je nach Stand:* „das Tanzfoto in der Halle“ / „Ljerkas Klavierschule im Salon“ / „der Umschlag aus Zagreb im Klavierhocker“
4. **Nächster Schritt:** *je nach Stand:* „Bruno das Tanzfoto zeigen.“ / „Das Tanzfoto von der Wand in der Halle nehmen und Bruno zeigen.“ / „Bruno die Klavierschule zeigen.“ / „Im Salon das Tuch vom Flügel nehmen, die Klavierschule nehmen und Bruno zeigen.“ / „Mit dem Schlüsselring die Treppe zum Salon hinaufgehen. Auf dem Flügel liegt Ljerkas Klavierschule.“ / „Erst den Schlüsselring aus dem Mantel an Haken 13 holen. Dann in den Salon, zu Ljerkas Klavierschule.“ / „Bruno den Umschlag aus Zagreb zeigen.“ / „Den Klavierhocker mit dem Schlüsselring öffnen und Bruno den Umschlag zeigen.“

### Brunos Satz `k3_translate`

Offen, wenn: `G.phase==='c3_night' && lvl(G)>=3 && !F(G,'c3.translated')`

1. **Problem einordnen:** Bruno kann seinen Satz jetzt sagen, als Wortsalat aus drei Sprachen.
2. **Denkrichtung:** Fünf Teile, je drei Fassungen. Bruno schüttelt den Kopf genau dort, wo es nicht stimmt.
3. **Konkreter Ansatz:** Die Wörter tragen den Sinn: perdonami heißt verzeih, tvoje pismo dein Brief, paura Angst, sam allein, sviraj spiel.
4. **Nächster Schritt:** Mit Bruno reden, „Ich versuche, Ihren Satz zu übersetzen“, und zusammensetzen: „Ljerka, verzeih mir. Ich habe deinen Brief aus Zagreb versteckt, weil ich Angst hatte, allein zu sein. Spiel wieder.“

### Ljerka muss es erfahren `k3_wake`

Offen, wenn: `G.phase==='c3_night' && I(G,'envelope') && I(G,'brunoletter') && F(G,'c3.translated') && !F(G,'c3.release')`

1. **Problem einordnen:** Umschlag, Brief und Satz sind beisammen. Ljerka weiß von alldem nichts.
2. **Denkrichtung:** Es ist mitten in der Nacht, aber das hier ist es wert.
3. **Konkreter Ansatz:** Ljerka schläft hinter der Tür „PRIVAT“ in der Halle.
4. **Nächster Schritt:** An Ljerkas Tür „PRIVAT“ klopfen, ihr den Umschlag geben, dann Brunos Brief, dann den Satz sagen.

### Bruno kann gehen `k3_cross`

Offen, wenn: `F(G,'c3.release') && !F(G,'c3.gone') && !inLimbo(G)`

1. **Problem einordnen:** Bruno ist nicht mehr im Dienst. Die Leine hat sich gelöst.
2. **Denkrichtung:** Er will die Tür selbst öffnen, wie immer.
3. **Konkreter Ansatz:** Mala kann ihn hinüberbringen. *(Mala: Ich kann ihn hinüberbringen.)*
4. **Nächster Schritt:** Als Mala bei Bruno „Hinüberbringen“ wählen. *(Mala: Bei Bruno „Hinüberbringen“ wählen.)*

### Keine Ablösung `k3_limbo`

Offen, wenn: `F(G,'c3.release') && !F(G,'c3.gone') && inLimbo(G)`

1. **Problem einordnen:** Bruno kann nicht gehen. „Nema smjene.“ Es gibt keine Ablösung.
2. **Denkrichtung:** Wann kam früher die Ablösung, und woran erkannte er sie?
3. **Konkreter Ansatz:** Um sieben. Dann läutete die Glocke.
4. **Nächster Schritt:** Bruno fragen, wer ihn ablöst, und die Glocke läuten.

### Zurück durch das Tor `k1_gate`

Offen, wenn: `inLimbo(G) && ((F(G,'c1.done') && ph(G,['c1','c1_night'])) \|\| (F(G,'c2.done') && G.phase==='c2_night'))`

1. **Problem einordnen:** Es ist vorbei. Sie ist gegangen.
2. **Denkrichtung:** Hier ist nichts mehr zu tun.
3. **Konkreter Ansatz:** Das steinerne Tor führt zurück.
4. **Nächster Schritt:** Durch das steinerne Tor zurückgehen.

### Zurück durch das Tor `k3_back`

Offen, wenn: `F(G,'c3.gone') && !F(G,'c3.done')`

1. **Problem einordnen:** Bruno ist gegangen.
2. **Denkrichtung:** Hier ist nichts mehr zu tun.
3. **Konkreter Ansatz:** Das Tor führt zurück.
4. **Nächster Schritt:** Durch das steinerne Tor zurückgehen.

### Die Straße nach Osten `e_ticket`

Offen, wenn: `G.phase==='epi' && !I(G,'busticket')`

1. **Problem einordnen:** Mit dem Honorar in der Tasche steht Marko am Busbahnhof.
2. **Denkrichtung:** Die Leine zeigt nach Osten.
3. **Konkreter Ansatz:** Am Schalter gibt es Fahrkarten nach Sarajevo.
4. **Nächster Schritt:** Den Fahrkartenschalter benutzen.

### Der Bus `e_bus`

Offen, wenn: `G.phase==='epi' && I(G,'busticket') && !G.ended`

1. **Problem einordnen:** Die Fahrkarte ist gekauft.
2. **Denkrichtung:** Der Bus wartet nicht ewig.
3. **Konkreter Ansatz:** Mala sitzt auf der Bank. Ein letztes Gespräch. *(Mala: Ich sitze auf der Bank. Ein letztes Gespräch.)*
4. **Nächster Schritt:** Den Bus benutzen.

## Kapitel 2: Sarajevo (54 Themen)

### Ohne Mark `p1`

Offen, wenn: `G.phase==='k2_pro' && !F(G,'k2.p1.km')`

1. **Problem einordnen:** Der Fahrschein kostet 1,60 Mark. Kuna nimmt hier niemand.
2. **Denkrichtung:** Geld verdienen, mit dem, was ein Übersetzer kann. Jemand am Busbahnhof hat ein Problem mit einem Text.
3. **Konkreter Ansatz:** Fikret in der Buregdžinica schimpft über einen Brief, den er nicht lesen kann. Ein deutscher Brief.
4. **Nächster Schritt:** Mit Fikret reden und ihm den Brief richtig übersetzen, Zeile für Zeile.

### In die Altstadt `p1b`

Offen, wenn: `G.phase==='k2_pro' && F(G,'k2.p1.km') && !F(G,'k2.p1.rode')`

1. **Problem einordnen:** Die Mark ist da. Jetzt fehlt der Weg in die Altstadt.
2. **Denkrichtung:** Zu Fuß ist es weit, im Nebel noch weiter. Die Straßenbahn fährt vom Bahnhof.
3. **Konkreter Ansatz:** Die Eins fährt in die Altstadt. Ein Fahrschein gilt erst, wenn er entwertet ist.
4. **Nächster Schritt:** Am Kiosk einen Fahrschein kaufen, in die Straßenbahn steigen und im Wagen am Entwerter entwerten.

### Mala an der Haltestelle `p2`

Offen, wenn: `G.phase==='k2_pro' && F(G,'k2.p1.rode') && !F(G,'k2.p2.back')`

1. **Problem einordnen:** Mala sitzt an der Haltestelle der Drei und wartet. Ansprechen allein holt sie nicht zurück.
2. **Denkrichtung:** Was hat sie früher mit der Drei verbunden? Etwas, das mit dieser Fahrt zu tun hat.
3. **Konkreter Ansatz:** Ein entwerteter Fahrschein ist in der Tasche, von der Fahrt eben.
4. **Nächster Schritt:** Mala den entwerteten Fahrschein zeigen.

### Wohin für die Nacht? `p3`

Offen, wenn: `G.phase==='k2_pro' && F(G,'k2.p2.back') && !F(G,'k2.p3.hajra')`

1. **Problem einordnen:** Es wird Abend, und noch gibt es kein Dach über dem Kopf.
2. **Denkrichtung:** Sanja hat ein Zimmer besorgt: bei Hajra Mešić, einer Pension in Kovači. Fehlt nur der Weg.
3. **Konkreter Ansatz:** *je nach Stand:* „Der Weg ist bekannt. Kovači steht jetzt auf dem Stadtplan.“ / „Rade an der Baščaršija kennt jede Gasse. Nach Kovači fragen.“
4. **Nächster Schritt:** *je nach Stand:* „Über den Stadtplan nach Kovači gehen und Hajra begrüßen.“ / „Mit Rade reden und nach Kovači und der Pension fragen.“

### Der erste Abend `p3b`

Offen, wenn: `G.phase==='k2_pro' && F(G,'k2.p3.hajra') && !F(G,'k2.pro.night')`

1. **Problem einordnen:** Ein Zimmer, ein Dach. Mehr geht heute nicht.
2. **Denkrichtung:** Der Tag war lang genug. Sarajevo kann bis morgen warten.
3. **Konkreter Ansatz:** Hajra hat oben in der Pension ein Zimmer gegeben.
4. **Nächster Schritt:** In der Pension ins Bett gehen.

### Der Gesang in der Nacht `p4`

Offen, wenn: `G.phase==='k2_pro_n' && !F(G,'k2.pro.tomaz')`

1. **Problem einordnen:** Mitten in der Nacht hat Mala jemanden singen hören. *(Mala: Mitten in der Nacht singt jemand.)*
2. **Denkrichtung:** Der Gesang kam von unten, aus der Altstadt.
3. **Konkreter Ansatz:** Von der Sahat-kula, dem Uhrturm hinter der Baščaršija.
4. **Nächster Schritt:** Zur Kula gehen und den jungen Mann unter der Uhr ansprechen.

### Mitten in der Nacht `p4b`

Offen, wenn: `G.phase==='k2_pro_n' && F(G,'k2.pro.tomaz') && !F(G,'k2.s1.started')`

1. **Problem einordnen:** Der junge Mann unter der Uhr wartet auf jemanden. Heute Nacht ist nicht mehr zu erfahren.
2. **Denkrichtung:** Es ist spät, und die Pension ist nicht weit.
3. **Konkreter Ansatz:** Schlaf. Am Morgen sieht die Kula anders aus.
4. **Nächster Schritt:** Zurück in die Pension und ins Bett.

### Wann ist „sieben“? `s1a`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_twosevens')`

1. **Problem einordnen:** Tomaž wartet auf „sieben“. Die Uhr am Turm zeigt etwas ganz anderes als jede Armbanduhr.
2. **Denkrichtung:** Die Kula geht nach einer alten Zeit. Wer hier lebt, weiß, wie.
3. **Konkreter Ansatz:** *je nach Stand:* „Lejla auf der Terrasse der Kafana kennt die Kula. Am Turm hängt auch eine Tafel.“ / „Tomaž hält einen Zettel. Mala kann ihn lesen.“ / „Tomaž hält einen Zettel. Ich kann ihn lesen.“ / „Sein Zettel und die Mondzeit gehören zusammen.“
4. **Nächster Schritt:** *je nach Stand:* „Lejla fragen, warum die Uhr an der Kula falsch geht, oder an der Kula die Tafel lesen.“ / „Zu Mala wechseln und Tomaž unter der Uhr ansehen.“ / „Zu mir wechseln und Tomaž unter der Uhr ansehen.“ / „Im Notizbuch „Kad kula udari sedam“ mit „Mondzeit“ verbinden.“

### Sieben nach der Kula, aber wann genau? `s1b`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_twosevens') && !N(G,'s1_2316')`

1. **Problem einordnen:** Die Kula zählt ab Sonnenuntergang. Ohne den Sonnenuntergang an jenem Tag bleibt „sieben“ ungenau.
2. **Denkrichtung:** Zwei Dinge fehlen: das genaue Datum und ein Kalender, der den Sonnenuntergang für dieses Datum nennt.
3. **Konkreter Ansatz:** *je nach Stand:* „Das Datum steht in einem Auftragsbuch in der Čaršija. Tomaž trägt etwas Graviertes; Mala kann spüren, was.“ / „Das Datum steht in einem Auftragsbuch in der Čaršija. Tomaž trägt etwas Graviertes; ich kann spüren, was.“ / „Das Datum steht in Nedžads Auftragsbuch: Dort ist das Armband graviert worden.“ / „Alte Kalender, auch Takvime, hat das Antiquariat an der Ferhadija.“ / „Datum und Sonnenuntergang sind beisammen.“
4. **Nächster Schritt:** *je nach Stand:* „Zu Mala wechseln und Tomaž spüren: Er hält ein graviertes Armband.“ / „Zu mir wechseln und Tomaž spüren: Er hält ein graviertes Armband.“ / „Bei Jakob im Antiquariat nach Takvimen von 1972 fragen und den Takvim lesen.“ / „Im Notizbuch „Zwei Siebenen“ mit „Takvim 1972“ verbinden.“

### Woher stammt das Armband? `s1c`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_bracelet') && !N(G,'s1_date')`

1. **Problem einordnen:** Tomaž trägt ein graviertes Armband aus der Čaršija. Wer hat es graviert, und wann?
2. **Denkrichtung:** Graveure führen Bücher über ihre Aufträge. Die alten Werkstätten sind in einer Gasse.
3. **Konkreter Ansatz:** In Kazandžiluk graviert die Familie Kazandžić seit hundert Jahren. Nedžad hat die alten Bücher, aber keine Zeit.
4. **Nächster Schritt:** *je nach Stand:* 

### Was war an jenem Abend? `s1d`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_left')`

1. **Problem einordnen:** Jemand muss an jenem Abend in der Kafana gewesen sein.
2. **Denkrichtung:** Zwei Seiten fehlen: was die Kafana damals erlebt hat, und was Tomaž selbst von seiner Nacht weiß.
3. **Konkreter Ansatz:** Šaćir am Fenstertisch war damals Kellner. Tomaž erinnert sich an seinen Zapfenstreich.
4. **Nächster Schritt:** *je nach Stand:* „Šaćir laut nach dem jungen Soldaten von 1972 fragen. Dann im Notizbuch verbinden, wann die Kafana zumachte und wann Tomaž zurück musste.“ / „Šaćir erinnert sich erst mit dem Datum. “ / „Šaćir erinnert sich erst mit dem Datum. “ / „Šaćir erinnert sich erst mit dem Datum. “ / „Tomaž nach seiner Nacht fragen: Wann musste er zurück in die Kaserne?“ / „Im Notizbuch „Halid sperrte um elf zu“ mit „Zapfenstreich“ verbinden.“

### Emina schweigt `s1e`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_waited')`

1. **Problem einordnen:** Emina will über 1972 nicht reden. Nicht mit einem Fremden.
2. **Denkrichtung:** Mit jemandem aus der Familie redet sie anders. Und zuhören kann auch, wen sie nicht sieht.
3. **Konkreter Ansatz:** Emina spricht mit ihrer Enkelin hinter der Theke. Mala kann dort unbemerkt stehen. *(Mala: Emina spricht mit ihrer Enkelin hinter der Theke. Dort kann ich stehen, ohne dass sie mich sieht.)*
4. **Nächster Schritt:** *je nach Stand:* „k2.s1.eminaAsked“ / „Zu Mala wechseln und bei Emina hinter der Theke lauschen.“ / „Zu mir wechseln und bei Emina hinter der Theke lauschen.“ / „Erst Emina nach dem November 1972 fragen. Danach zu Mala wechseln und bei Emina hinter der Theke lauschen.“ / „Frag Emina erst nach dem November 1972. Danach lausche ich bei ihr hinter der Theke.“

### Was Emina nicht weiß `s1k`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_missed') && !N(G,'s1_nowrite')`

1. **Problem einordnen:** Emina glaubt bis heute, Tomaž sei nicht gekommen.
2. **Denkrichtung:** Sie muss die elf Minuten von Marko hören.
3. **Konkreter Ansatz:** Emina sitzt in der Kafana. Mit ihr über etwas aus dem Notizbuch reden.
4. **Nächster Schritt:** Emina in der Kafana nach „Elf Minuten“ fragen.

### Wo sind die Briefe? `s1f`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_nowrite') && !I(G,'letters_tz') && !F(G,'k2.s1.tin')`

1. **Problem einordnen:** Emina fragt, warum er nie geschrieben hat. Vielleicht hat er geschrieben.
2. **Denkrichtung:** Briefe gehen durch Hände. Wer hat damals etwas angenommen und weitergegeben?
3. **Konkreter Ansatz:** Šaćir hat etwas weitergegeben. Mala sieht in der verschlossenen Kammer, wohin. Hinein geht es erst, wenn Emina nicht da ist. *(Mala: Šaćir hat etwas weitergegeben. Ich sehe in der verschlossenen Kammer nach, wohin. Hinein geht es erst, wenn Emina nicht da ist.)*
4. **Nächster Schritt:** *je nach Stand:* „k2.s1.letterFixed“ / „k2.s1.eminaAway“ / „Emina geht nachher zu Tante Sabira: die Kafana einmal verlassen und wieder hineingehen (oder als Mala hinter der Theke lauschen). Dann öffnet Lejla die Kammer.“ / „k2.s1.letterFixed“ / „Zu Mala wechseln und durch die Tür der Kammer gehen: Dort sieht sie, wohin die Briefe kamen.“ / „Zu mir wechseln und durch die Tür der Kammer gehen: Dort sehe ich, wohin die Briefe kamen.“ / „k2.s1.eminaAway“ / „k2.s1.eminaBack“ / „In die Kammer gehen und am Spiegel das Stemmeisen ansetzen.“ / „Nedžad um sein Stemmeisen bitten, dann in der Kammer am Spiegel ansetzen.“ / „Lejla helfen, damit Emina geht. Dann in die Kammer, und am Spiegel das Stemmeisen ansetzen.“ / „Lejla helfen, damit Emina geht. Dann in die Kammer. Am Spiegel hilft ein Stemmeisen: Nedžad leiht seines aus.“

### Emina die Wahrheit sagen `s1g`

Offen, wenn: `ph(G,['k2_s1']) && N(G,'s1_missed') && N(G,'s1_betrayal') && !F(G,'k2.s1.emina')`

1. **Problem einordnen:** Alles ist beisammen. Emina muss es hören.
2. **Denkrichtung:** Erst Beweise in die Hand, dann die Wahrheit. Die Reihenfolge zählt.
3. **Konkreter Ansatz:** Briefe und Armband zuerst. Dann zwei Sätze: warum sie sich verpasst haben, und warum er nie schrieb.
4. **Nächster Schritt:** Mit Emina reden: zuerst sagen, warum sie sich verpasst haben, dann, warum er nie schrieb.

### Tomaž halten `s1h`

Offen, wenn: `G.phase==='k2_s1_n' && !F(G,'k2.s1.free')`

1. **Problem einordnen:** Um elf will Tomaž gehen, wie damals.
2. **Denkrichtung:** Er glaubt, er müsse zurück in die Kaserne. Gibt es die überhaupt noch?
3. **Konkreter Ansatz:** Lejla weiß, was aus der Kaserne geworden ist. Heute Nacht sitzt sie vor der Kafana.
4. **Nächster Schritt:** Tomaž sagen, dass es die Kaserne nicht mehr gibt, und dass sie kommt, wenn die Kula sieben schlägt.

### Tomaž kann gehen `s1i`

Offen, wenn: `G.phase==='k2_s1_n' && F(G,'k2.s1.free') && !F(G,'k2.s1.gone')`

1. **Problem einordnen:** Die Kula hat sieben geschlagen. Tomaž weiß jetzt, wie spät es ist.
2. **Denkrichtung:** Den Weg findet er allein nicht.
3. **Konkreter Ansatz:** Mala kann ihn hinüberführen. *(Mala: Ich kann ihn hinüberführen.)*
4. **Nächster Schritt:** Zu Mala wechseln und bei Tomaž „Hinüberbringen“ wählen. *(Mala: Zu mir wechseln und bei Tomaž „Hinüberbringen“ wählen.)*

### Nach dem ersten Fall `s1j`

Offen, wenn: `G.phase==='k2_s1_n' && F(G,'k2.s1.gone') && !F(G,'k2.s2.started')`

1. **Problem einordnen:** Tomaž ist gegangen. Es ist Nacht.
2. **Denkrichtung:** Für heute ist nichts mehr zu tun.
3. **Konkreter Ansatz:** Die Pension in Kovači.
4. **Nächster Schritt:** Zurück in die Pension und ins Bett.

### Das Foto mit der Uhr `m1a`

Offen, wenn: `N(G,'m2_photo') && !N(G,'m2_clocktower') && !ph(G,['k2_fin_n','k2_epi'])`

1. **Problem einordnen:** Auf Jakobs Foto steht ein Hochhaus mit einer Uhr auf dem Dach. Welches?
2. **Denkrichtung:** Wer kennt die Haltestellen und Hochhäuser von damals?
3. **Konkreter Ansatz:** Rade an der Baščaršija kennt jede Haltestelle.
4. **Nächster Schritt:** *je nach Stand:* „Morgen, wenn Rade wieder an der Haltestelle steht, ihm das Foto zeigen.“ / „Rade das Foto zeigen.“

### Die leuchtende Uhr `m1b`

Offen, wenn: `N(G,'m2_f_clock') && !N(G,'m2_building')`

1. **Problem einordnen:** Mala erinnert sich an eine Uhr mit leuchtenden Ziffern. *(Mala: Ich erinnere mich an eine Uhr mit leuchtenden Ziffern.)*
2. **Denkrichtung:** Eine Erinnerung und ein Foto. Passen sie zusammen?
3. **Konkreter Ansatz:** Rade weiß, welches Hochhaus eine Uhr hatte.
4. **Nächster Schritt:** *je nach Stand:* „Morgen Rade nach Malas Splitter mit der leuchtenden Uhr fragen.“ / „Morgen Rade nach meinem Splitter mit der leuchtenden Uhr fragen.“ / „Rade nach Malas Splitter mit der leuchtenden Uhr fragen (oder ihm Jakobs Foto zeigen).“ / „Rade nach meinem Splitter mit der leuchtenden Uhr fragen (oder ihm Jakobs Foto zeigen).“ / „Im Notizbuch Malas Splitter mit „Das Hochhaus mit der Uhr“ verbinden.“ / „Im Notizbuch meinen Splitter mit „Das Hochhaus mit der Uhr“ verbinden.“

### Das Siebener `m1b2`

Offen, wenn: `N(G,'m2_building') && !N(G,'m2_alija') && !ph(G,['k2_fin_n','k2_epi'])`

1. **Problem einordnen:** Mala hat am Siebener jemanden getroffen. Wen? *(Mala: Ich habe am Siebener jemanden getroffen. Wen?)*
2. **Denkrichtung:** Das Siebener steht in Alipašino Polje, an der alten Haltestelle der Drei.
3. **Konkreter Ansatz:** Neben der Haltestelle stand ein Kiosk. Wer dort noch wartet, sieht nur Mala. *(Mala: Neben der Haltestelle stand ein Kiosk. Wer dort noch wartet, sehe nur ich.)*
4. **Nächster Schritt:** *je nach Stand:* „Ab morgen: in Alipašino Polje als Mala mit dem Mann am Kiosk reden.“ / „Ab morgen: in Alipašino Polje mit dem Mann am Kiosk reden.“ / „Nach Alipašino Polje gehen, zu Mala wechseln und mit dem Mann am Kiosk reden.“ / „Nach Alipašino Polje gehen und mit dem Mann am Kiosk reden.“

### Zwei Fahrscheine `m1c`

Offen, wenn: `N(G,'m2_alija') && !N(G,'m2_ticket')`

1. **Problem einordnen:** Alija sagt, die Kleine habe zwei Fahrscheine gekauft.
2. **Denkrichtung:** Wo bewahrt jemand einen alten Fahrschein auf?
3. **Konkreter Ansatz:** Mala trägt ihre Dose immer bei sich. *(Mala: Meine Dose.)*
4. **Nächster Schritt:** Mala nach dem fragen, was Alija gesagt hat. *(Mala: Mich nach dem fragen, was Alija gesagt hat.)*

### Ein Fahrschein von 1993 `m1d`

Offen, wenn: `N(G,'m2_ticket') && !N(G,'m2_promise')`

1. **Problem einordnen:** Der Fahrschein ist am 12.11.1993 entwertet. Im Krieg.
2. **Denkrichtung:** Welche Bahnen fuhren im November 1993 überhaupt?
3. **Konkreter Ansatz:** Rade weiß, welche Bahnen damals fuhren.
4. **Nächster Schritt:** *je nach Stand:* „Morgen Rade fragen, ob im November dreiundneunzig Straßenbahnen fuhren.“ / „Rade fragen, ob im November dreiundneunzig Straßenbahnen fuhren.“ / „Im Notizbuch „Malas Fahrschein“ mit „Keine Bahn im November 1993“ verbinden.“

### Ein Versprechen `m1f`

Offen, wenn: `N(G,'m2_promise') && !N(G,'m2_f_ninth') && !ph(G,['k2_fin_n','k2_epi'])`

1. **Problem einordnen:** Malas Fahrschein war ein Versprechen. An wen? *(Mala: Mein Fahrschein war ein Versprechen. An wen?)*
2. **Denkrichtung:** Mala erinnert sich in Splittern. Ein Versprechen ist ein Ort, zu dem man zurückwollte. *(Mala: Ich erinnere mich in Splittern. Ein Versprechen ist ein Ort, zu dem man zurückwollte.)*
3. **Konkreter Ansatz:** Wenn Marko sie danach fragt, kommt vielleicht der nächste Splitter. *(Mala: Wenn du mich danach fragst, kommt vielleicht der nächste Splitter.)*
4. **Nächster Schritt:** Mit Mala reden. *(Mala: Mit mir reden.)*

### Zwei Kinder in der Drei `m1e`

Offen, wenn: `N(G,'m2_kids') && N(G,'m2_marko7') && !N(G,'m2_mali')`

1. **Problem einordnen:** Rade erinnert sich an zwei Kinder, samstags um 11:10.
2. **Denkrichtung:** Ein Mädchen und ein kleiner Junge, aus Alipašino Polje. Wer wohnte damals dort?
3. **Konkreter Ansatz:** Die eigene Erinnerung an das Siebener gehört dazu.
4. **Nächster Schritt:** Im Notizbuch die zwei Kinder mit dem verbinden, was über die eigene Kindheit im Siebener feststeht.

### Der Spuk im Antiquariat `s2a`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && !N(G,'s2_stamp')`

1. **Problem einordnen:** In Jakobs Laden liest jemand, der nicht da ist.
2. **Denkrichtung:** Wer nicht da ist, ist für Lebende unsichtbar. Für eine andere nicht.
3. **Konkreter Ansatz:** Mala sieht ihn im Lesesessel. Und sie kann lesen, was in einem verschlossenen Buch steht. *(Mala: Ich sehe ihn im Lesesessel. Und ich kann lesen, was in einem verschlossenen Buch steht.)*
4. **Nächster Schritt:** Zu Mala wechseln und das Buch in der Vitrine ansehen. *(Mala: Zu mir wechseln und das Buch in der Vitrine ansehen.)*

### Wem gehört das Buch? `s2b`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_stamp') && !N(G,'s2_provenance')`

1. **Problem einordnen:** *je nach Stand:* „Leser 2204 und der Nachlass im Ankaufbuch: Dass beides derselbe Mann ist, weißt du. Im Notizbuch wird es erst ein Schluss.“ / „Wer war Leser 2204?“
2. **Denkrichtung:** Woher kam das Buch in den Laden?
3. **Konkreter Ansatz:** Jakob schreibt in sein Ankaufbuch, von wem er kauft. Hineinschauen darf man, wenn man ihn fragt, woher er das Buch hat.
4. **Nächster Schritt:** *je nach Stand:* „Im Notizbuch den Leihzettel mit dem Eintrag im Ankaufbuch verbinden.“ / „Jakob fragen, woher er das Buch hat, dann das Ankaufbuch auf seinem Schreibtisch lesen.“

### Warum gab er es nie zurück? `s2c`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_due') && !N(G,'s2_noreturn')`

1. **Problem einordnen:** Für ihn läuft die Frist ab. Seit Jahren.
2. **Denkrichtung:** Was ist im August 1992 mit der Bibliothek geschehen?
3. **Konkreter Ansatz:** Jakob erzählt es, wenn man ihn nach der Bibliothek fragt.
4. **Nächster Schritt:** *je nach Stand:* „Im Notizbuch „Die Frist läuft ab“ mit „Die Bibliothek brannte“ verbinden.“ / „Jakob nach der Nationalbibliothek fragen. Dann im Notizbuch die Frist mit dem Brand verbinden.“

### Was ist im Buch? `s2d`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_provenance') && !N(G,'s2_fragments')`

1. **Problem einordnen:** Warum war ihm gerade dieses Buch so wichtig?
2. **Denkrichtung:** Menschen, die ihn kannten, erinnern sich an Bruchstücke.
3. **Konkreter Ansatz:** Sein Sohn in Wien, und eine alte Nachbarin an der Obala.
4. **Nächster Schritt:** Petar aus der Pension anrufen, Milka an der Miljacka fragen, und beides im Notizbuch verbinden.

### In die Vijećnica `s2e`

Offen, wenn: `ph(G,['k2_s2']) && !I(G,'pass')`

1. **Problem einordnen:** Nachts kommt niemand in die Vijećnica.
2. **Denkrichtung:** Wer darf hinein? Und was braucht diese Person gerade?
3. **Konkreter Ansatz:** Die Restauratorin am Bauzaun braucht jemanden, der alte deutsche Schrift lesen kann.
4. **Nächster Schritt:** *je nach Stand:* „k2.s2.amraAsk“ / „Die Restauratorin am Bauzaun der Vijećnica fragen, was sie dort macht.“ / „Bei Jakob nach seiner Kurrent-Tafel fragen.“ / „Der Restauratorin sagen: „Ich lese Kurrent.“ Und mit der Tafel die Schrift lesen.“

### Das Buch zurückgeben `s2f`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_fragments') && N(G,'s2_provenance') && !F(G,'k2.s2.free')`

1. **Problem einordnen:** Das Buch muss dorthin, wo es ausgeliehen wurde.
2. **Denkrichtung:** Jakob gibt es nur her, wenn er weiß, wem es gehört und warum.
3. **Konkreter Ansatz:** *je nach Stand:* „Er will einen Stempel. Einen Stempel gibt es nicht mehr. Aber der Leihzettel hat ein Feld für die Rückgabe.“ / „Mit dem Passierschein geht es abends in die Vijećnica, zur alten Ausleihe.“ / „Abends geht es nur mit einem Passierschein in die Vijećnica.“
4. **Nächster Schritt:** *je nach Stand:* „Den Kugelschreiber auf die Ausleihtheke ziehen und die Rückgabe eintragen.“ / „Jakob sagen: „Das Buch gehört der Bibliothek.“ Dann gibt er es her.“ / „Das Buch in der Vijećnica auf die Ausleihtheke legen, dann mit dem Kugelschreiber die Rückgabe eintragen.“ / „Mit dem Passierschein der Restauratorin abends in die Vijećnica, das Buch auf die Ausleihtheke legen und mit dem Kugelschreiber die Rückgabe eintragen.“

### Ivan kann gehen `s2g`

Offen, wenn: `G.phase==='k2_s2_n' && F(G,'k2.s2.free') && !F(G,'k2.s2.gone')`

1. **Problem einordnen:** Das Buch liegt wieder auf der Ausleihtheke. Ivan hat es gesehen.
2. **Denkrichtung:** Er steht noch da, als wüsste er nicht, wohin.
3. **Konkreter Ansatz:** Mala kann ihn hinüberführen. *(Mala: Ich kann ihn hinüberführen.)*
4. **Nächster Schritt:** Zu Mala wechseln und bei Ivan „Hinüberbringen“ wählen. *(Mala: Zu mir wechseln und bei Ivan „Hinüberbringen“ wählen.)*

### Die ganze Stadt `i1`

Offen, wenn: `G.phase==='k2_i' && !F(G,'k2.i.done')`

1. **Problem einordnen:** Mala wollte irgendwohin, wo man die ganze Stadt sieht. *(Mala: Irgendwohin, wo man die ganze Stadt sieht.)*
2. **Denkrichtung:** Hier oben in Vratnik ist so ein Ort.
3. **Konkreter Ansatz:** Auf der Gelben Bastei steht eine Bank.
4. **Nächster Schritt:** Mit Mala auf die Bank setzen und reden. *(Mala: Mit mir auf die Bank setzen und reden.)*

### Spät geworden `i2`

Offen, wenn: `G.phase==='k2_i' && F(G,'k2.i.done') && !F(G,'k2.s3.started')`

1. **Problem einordnen:** Es ist spät, und der Tag war lang.
2. **Denkrichtung:** Für heute ist nichts mehr zu tun.
3. **Konkreter Ansatz:** In Kovači wartet das Zimmer bei Hajra.
4. **Nächster Schritt:** Zurück in die Pension und ins Bett.

### Sanja anrufen `s3z`

Offen, wenn: `G.phase==='k2_s3' && !F(G,'k2.s3.called')`

1. **Problem einordnen:** Bevor es irgendwohin geht, steht ein Anruf an. Wegen des Kartons.
2. **Denkrichtung:** Sanja ist in Split.
3. **Konkreter Ansatz:** In der Pension gibt es ein Telefon.
4. **Nächster Schritt:** Mit dem Telefon in der Pension Sanja anrufen.

### Wer war L.? `s3a`

Offen, wenn: `ph(G,['k2_s3','k2_s3_n']) && !N(G,'m2_lana')`

1. **Problem einordnen:** In Split stand im Register „…ić, L.“. Wer verbirgt sich dahinter?
2. **Denkrichtung:** Ein Haus führt Buch über seine Mieter.
3. **Konkreter Ansatz:** In Haus 7 stehen im Hausbuch die alten Mieter. Malas Splitter sagt: neunter Stock. *(Mala: In Haus 7 stehen im Hausbuch die alten Mieter. Mein Splitter sagt: neunter Stock.)*
4. **Nächster Schritt:** *je nach Stand:* „Im Notizbuch das Register aus Split mit dem Hausbuch verbinden.“ / „Im Hausflur von Haus 7 das Hausbuch lesen. Dann im Notizbuch das Register aus Split mit dem Hausbuch verbinden.“

### In den Schutzraum `s3b`

Offen, wenn: `ph(G,['k2_s3']) && !I(G,'key_shelter') && !F(G,'k2.s3.inShelter')`

1. **Problem einordnen:** Šehić gibt den Schlüssel nicht her.
2. **Denkrichtung:** Was bewegt ihn? Er redet, wenn er sich allein glaubt.
3. **Konkreter Ansatz:** Mala kann an seiner Tür lauschen. *(Mala: Ich kann an seiner Tür lauschen.)*
4. **Nächster Schritt:** *je nach Stand:* „Mit Šehić reden und ihn nach „Hanka“ fragen, vorsichtig: nach dem, was an seiner Tür zu hören war.“ / „Zu Mala wechseln und an Šehićs Tür lauschen.“ / „Zu mir wechseln und an Šehićs Tür lauschen.“

### Die Stahltür `s3b2`

Offen, wenn: `G.phase==='k2_s3' && I(G,'key_shelter') && !F(G,'k2.s3.inShelter')`

1. **Problem einordnen:** Šehićs Schlüssel ist in der Tasche.
2. **Denkrichtung:** Es gibt nur eine Tür, für die er passt.
3. **Konkreter Ansatz:** Die Stahltür zum Schutzraum, hinten im Hausflur.
4. **Nächster Schritt:** Die Stahltür mit Šehićs Schlüssel öffnen.

### Der Schrank im Keller `s3c`

Offen, wenn: `ph(G,['k2_s3','k2_s3_n']) && F(G,'k2.s3.inShelter') && !F(G,'k2.s3.cabinet')`

1. **Problem einordnen:** Der Schrank ist verschlossen. Zora weiß, wo der Schlüssel ist.
2. **Denkrichtung:** Oben und unten müssen zusammen arbeiten. Mirza erinnert sich an eine Klingel.
3. **Konkreter Ansatz:** Mala hört im Keller, was oben geschieht. Marko kann oben in der Halle klingeln. *(Mala: Ich höre im Keller, was oben geschieht. Du kannst oben in der Halle klingeln.)*
4. **Nächster Schritt:** Mala im Schutzraum lassen, mit Marko oben in der Halle den Klingelknopf drücken, dann zu Mala wechseln. *(Mala: Mich im Schutzraum lassen, oben in der Halle den Klingelknopf drücken, dann zu mir wechseln.)*

### Die Zeugnisse `s3d`

Offen, wenn: `ph(G,['k2_s3']) && I(G,'svjedocanstva') && !F(G,'k2.s3.stamped')`

1. **Problem einordnen:** Zora hat versprochen: Zeugnisse mit Stempel.
2. **Denkrichtung:** Die Schule gibt es nicht mehr. Ihr Stempel vielleicht schon.
3. **Konkreter Ansatz:** *je nach Stand:* „Der Stempel ist da. Die Zeugnisse gehören auf Zoras Pult im Schutzraum.“ / „Mirza hat den alten Schulstempel aufgehoben.“
4. **Nächster Schritt:** *je nach Stand:* „Im Schutzraum den Stempel auf Zoras Pult benutzen.“ / „Mirza sagen: „Zora wollte Zeugnisse mit Stempel verteilen.“ Er hat den Stempel.“

### Wer kommt zur letzten Stunde? `s3e`

Offen, wenn: `ph(G,['k2_s3']) && N(G,'s3_register') && !(F(G,'k2.s3.mirza') && F(G,'k2.s3.selma') && F(G,'k2.s3.damir'))`

1. **Problem einordnen:** Zora will, dass alle da sind. Drei aus dem Klassenbuch leben noch hier.
2. **Denkrichtung:** Mirza, Selma und Damir. Jeder braucht einen anderen Grund, zu kommen.
3. **Konkreter Ansatz:** *je nach Stand:* „Mirza muss erfahren, was Zora über ihn geschrieben hat“ / „Selma braucht eine Hand“ / „Damir braucht seine eigene Zeichnung, und die steht im Klassenbuch“
4. **Nächster Schritt:** *je nach Stand:* „Mirza zeigen, was im Klassenbuch über ihn steht“ / „Selma Hilfe anbieten“ / „Damir das Klassenbuch zeigen“

### Die letzte Stunde `s3g`

Offen, wenn: `G.phase==='k2_s3_n' && !F(G,'k2.s3.free')`

1. **Problem einordnen:** Mirza, Selma und Damir sind gekommen. Zora wartet unten auf ihre Klasse.
2. **Denkrichtung:** Wie beginnt eine Lehrerin ihre Stunde?
3. **Konkreter Ansatz:** Mit dem Klassenbuch auf dem Pult.
4. **Nächster Schritt:** Im Schutzraum das Klassenbuch auf Zoras Pult legen.

### Zora kann gehen `s3h`

Offen, wenn: `G.phase==='k2_s3_n' && F(G,'k2.s3.free') && !F(G,'k2.s3.gone')`

1. **Problem einordnen:** Alle sind da. Zora hat ihre Klasse gesehen.
2. **Denkrichtung:** Sie steht noch am Pult.
3. **Konkreter Ansatz:** Mala kann sie hinüberführen. *(Mala: Ich kann sie hinüberführen.)*
4. **Nächster Schritt:** Zu Mala wechseln und bei Zora „Hinüberbringen“ wählen. *(Mala: Zu mir wechseln und bei Zora „Hinüberbringen“ wählen.)*

### Nach der letzten Stunde `s3i`

Offen, wenn: `G.phase==='k2_s3_n' && F(G,'k2.s3.done') && !F(G,'k2.f2.started')`

1. **Problem einordnen:** Die Kinder von damals sind nach Hause gegangen. Zora auch.
2. **Denkrichtung:** Es ist tief in der Nacht.
3. **Konkreter Ansatz:** Die Pension in Kovači.
4. **Nächster Schritt:** Zurück in die Pension und ins Bett.

### Der Karton aus Split `f1`

Offen, wenn: `G.phase==='k2_fin' && !I(G,'karton') && !F(G,'k2.f2.opened')`

1. **Problem einordnen:** Sanja hat den Karton geschickt. Die Nummer kommt per SMS.
2. **Denkrichtung:** *je nach Stand:* „Die Nummer ist da. Jetzt fehlt der Schalter.“ / „Ohne Strom keine SMS.“
3. **Konkreter Ansatz:** *je nach Stand:* „Der Paketschalter ist am Busbahnhof.“ / „Das Handy ist leer. In der Pension gibt es eine Steckdose.“
4. **Nächster Schritt:** *je nach Stand:* „Mit der Paketnummer zum Paketschalter am Busbahnhof.“ / „Das Handy in der Pension laden und die SMS lesen.“

### Der Karton ist da `f1b`

Offen, wenn: `G.phase==='k2_fin' && I(G,'karton') && !F(G,'k2.f2.opened')`

1. **Problem einordnen:** Der Karton aus Split ist abgeholt. Zugeklebt, seit siebzehn Jahren.
2. **Denkrichtung:** Was darin ist, gehört zu der Zeit vor Split.
3. **Konkreter Ansatz:** Nur aufmachen muss ihn jemand.
4. **Nächster Schritt:** Den Karton in der Leiste öffnen.

### Das gerissene Foto `f2`

Offen, wenn: `G.phase==='k2_fin' && I(G,'photo_m') && !N(G,'f2_photo')`

1. **Problem einordnen:** Das Foto ist an einer Kante gerissen. Es fehlt eine Hälfte.
2. **Denkrichtung:** Mala zeigt nicht alles, was in ihrer Dose ist. *(Mala: In meiner Dose ist etwas, das ich niemandem zeige.)*
3. **Konkreter Ansatz:** Vielleicht zeigt sie es, wenn sie etwas Gleiches sieht. Im Karton lag ein alter Fahrschein. *(Mala: Vielleicht zeige ich es, wenn ich etwas Gleiches sehe. Im Karton lag ein alter Fahrschein.)*
4. **Nächster Schritt:** Mala den alten Fahrschein aus dem Karton zeigen. *(Mala: Mir den alten Fahrschein aus dem Karton zeigen.)*

### Der neunte Stock `f3`

Offen, wenn: `G.phase==='k2_fin' && N(G,'f2_photo') && !N(G,'f2_postcard')`

1. **Problem einordnen:** Nada im neunten Stock öffnet keinem.
2. **Denkrichtung:** Sie öffnet vielleicht, wenn sie sieht, wer vor der Tür steht.
3. **Konkreter Ansatz:** Das ganze Foto zeigt, wer das ist. Mit ihm öffnet sie.
4. **Nächster Schritt:** In Haus 7 die Treppe hinauf zu Nada, sie nach Lanas Zimmer fragen und dort die Postkarte lesen.

### Großmutters Haus `f4`

Offen, wenn: `G.phase==='k2_fin' && N(G,'f2_postcard') && !N(G,'f2_rcm')`

1. **Problem einordnen:** Lana wollte jemanden holen. Damals war das Ziel Großmutters Haus in Vratnik.
2. **Denkrichtung:** *je nach Stand:* „Der Schlüssel zu Großmutters Haus ist da. In der Küche ist etwas zu spüren.“ / „Wer hat einen Schlüssel zu Großmutters Haus? Jemand, der dreißig Jahre gegenüber wohnte.“
3. **Konkreter Ansatz:** *je nach Stand:* „Hajra hat den Schlüssel.“ / „Mala soll in Großmutters Küche den Kohleherd spüren.“ / „Ich soll in Großmutters Küche den Kohleherd spüren.“ / „Die Nachricht aus dem Wärmefach ist da. Ich habe sie noch nicht gelesen.“ / „Die Nachricht liegt jetzt bei Nada.“ / „Das Wärmefach am Herd klemmt. Es braucht einen Hebel.“
4. **Nächster Schritt:** *je nach Stand:* „Hajra nach Großmutters Haus fragen.“ / „Als Mala den Kohleherd oder das Wärmefach spüren. Dann weiß Marko, was darin liegt.“ / „Den Kohleherd oder das Wärmefach spüren. Dann weiß Marko, was darin liegt.“ / „Die Nachricht vom Roten Kreuz lesen.“ / „Nada hat die Nachricht. Sie mit Nada besprechen.“ / „Das Wärmefach mit dem Stemmeisen öffnen.“ / „Nedžads Stemmeisen holen. Wer es zurückgegeben hat, leiht es noch einmal. Dann das Wärmefach öffnen.“

### Zwei Nachrichten `f5`

Offen, wenn: `G.phase==='k2_fin' && N(G,'f2_rcm') && !N(G,'f2_cameback')`

1. **Problem einordnen:** Lana hat geschrieben, und ihrer Mutter auch.
2. **Denkrichtung:** Zwei Schriftstücke, die dasselbe erzählen könnten.
3. **Konkreter Ansatz:** Die Nachricht vom Roten Kreuz und die Postkarte.
4. **Nächster Schritt:** Im Notizbuch die Rotkreuz-Nachricht mit der Postkarte verbinden.

### Die erste Drei nach dem Krieg `f7`

Offen, wenn: `G.phase==='k2_fin' && N(G,'f2_cameback') && !F(G,'k2.f2.night')`

1. **Problem einordnen:** Auf Lanas Fahrschein steht: für die erste Drei nach dem Krieg.
2. **Denkrichtung:** Mala will fahren. Mit Marko und mit den alten Fahrscheinen. *(Mala: Ich will fahren. Mit dir und mit den alten Fahrscheinen.)*
3. **Konkreter Ansatz:** Heute Nacht. Was noch fehlt, ist der Entschluss.
4. **Nächster Schritt:** Mit Mala reden oder Großmutters Haus verlassen. *(Mala: Mit mir reden oder Großmutters Haus verlassen.)*

### Die letzte Fahrt `f6`

Offen, wenn: `ph(G,['k2_fin_n']) && !F(G,'k2.f2.ride')`

1. **Problem einordnen:** Zwei Fahrscheine für die erste Drei nach dem Krieg.
2. **Denkrichtung:** Einer ist in der Tasche, den anderen hat Mala. *(Mala: Einen hast du, den anderen habe ich.)*
3. **Konkreter Ansatz:** Entwertet werden beide in der Bahn.
4. **Nächster Schritt:** *je nach Stand:* „k2.f2.rideEnd“ / „An der Baščaršija aussteigen und sich mit Mala auf die Bank setzen.“ / „An der Baščaršija aussteigen und dich mit mir auf die Bank setzen.“ / „An der Haltestelle in die Drei steigen und beide Fahrscheine am Entwerter entwerten.“ / „Mala um ihren Fahrschein bitten und in der Drei beide am Entwerter entwerten.“ / „Mich um meinen Fahrschein bitten und in der Drei beide am Entwerter entwerten.“

### Lanas Nachricht `e1`

Offen, wenn: `G.phase==='k2_epi' && I(G,'rcm') && !F(G,'k2.epi.nada')`

1. **Problem einordnen:** Lanas Nachricht vom Roten Kreuz lag siebzehn Jahre versteckt. Sie gehört nicht einem allein.
2. **Denkrichtung:** Wer wartet seit siebzehn Jahren auf ein Wort von Lana?
3. **Konkreter Ansatz:** Nada Delić, neunter Stock, Haus 7 in Alipašino Polje.
4. **Nächster Schritt:** Zu Nada hinaufgehen und ihr die Rotkreuz-Nachricht geben.

### Nach Mostar `e2`

Offen, wenn: `G.phase==='k2_epi' && F(G,'k2.epi.nada') && !F(G,'k2.epi.done')`

1. **Problem einordnen:** Ein Versprechen an Nada. Und die Leine zeigt nach Südwesten.
2. **Denkrichtung:** Busse fahren vom Busbahnhof.
3. **Konkreter Ansatz:** Bei Fadila am Busbahnhof gibt es Fahrkarten nach Mostar.
4. **Nächster Schritt:** Bei Fadila eine Fahrkarte nach Mostar kaufen und in den Bus steigen.

## Kapitel 3: Mostar (86 Themen)

### Ankommen `p3a`

Offen, wenn: `G.phase==='k3_pro' && !I(G,'plan')`

1. **Problem einordnen:** Mostar, Regen, kein Plan. Hinter dem Busbahnhof fängt eine Stadt an, die Marko nicht kennt.
2. **Denkrichtung:** Zum Ankommen braucht es zwei Dinge: einen Plan und ein Bett.
3. **Konkreter Ansatz:** Am Kiosk am Ostbusbahnhof stehen Stadtpläne im Drehständer.
4. **Nächster Schritt:** Am Kiosk einen Stadtplan kaufen.

### Ein Bett `p3b`

Offen, wenn: `G.phase==='k3_pro' && I(G,'plan') && !F(G,'k3.p.checkin')`

1. **Problem einordnen:** Für die Nacht fehlt noch ein Zimmer.
2. **Denkrichtung:** Die Altstadt liegt am Fluss. Dort gibt es Herbergen.
3. **Konkreter Ansatz:** Die Herberge „Neretva“ steht auf dem Stadtplan.
4. **Nächster Schritt:** Zur Herberge gehen und sich bei Maja eintragen.

### Die Brücke, die alle kennen `p3c`

Offen, wenn: `G.phase==='k3_pro' && I(G,'plan') && !N(G,'l3_mybridge')`

1. **Problem einordnen:** Mala erinnert sich an eine Brücke, die nicht mehr da war. Die berühmteste Brücke der Stadt war im Krieg auch nicht mehr da.
2. **Denkrichtung:** Ob es diese Brücke war, kann nur Mala sagen. Sie muss sie sehen.
3. **Konkreter Ansatz:** Die Alte Brücke liegt am Ende des Kujundžiluk.
4. **Nächster Schritt:** An der Alten Brücke mit Mala über die Brücke reden.

### Was sich an einer Brücke nie ändert `p3d`

Offen, wenn: `P(G,['k3_pro','k3_pro_n']) && N(G,'l3_mybridge') && !N(G,'l3_onearch')`

1. **Problem einordnen:** Malas Brücke stand im Wasser. Die Alte Brücke war im Januar 1994 kaputt. Zerstört oder nicht: Was an einer Brücke ändert sich nie?
2. **Denkrichtung:** Ob eine Brücke Pfeiler im Fluss hat, ändert weder ein Krieg noch ein Wiederaufbau.
3. **Konkreter Ansatz:** Man sieht es vom Ufer aus, dort, wo die Brücke aufsitzt. Dino, der Springer, weiß es auch. Und im Kujundžiluk gibt es alte Postkarten.
4. **Nächster Schritt:** Am Brückenkopf das Widerlager ansehen. Oder Dino fragen, oder im Laden im Kujundžiluk die alten Postkarten ansehen.

### Zwei Brücken `p3e`

Offen, wenn: `N(G,'l3_mybridge') && N(G,'l3_onearch') && !N(G,'l3_notbridge')`

1. **Problem einordnen:** Zwei Dinge über Brücken stehen im Notizbuch.
2. **Denkrichtung:** Malas Brücke und die Alte Brücke: Passt das zusammen?
3. **Konkreter Ansatz:** Im Notizbuch „Malas Brücke stand im Wasser“ und „Ein einziger Bogen“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen im Notizbuch verbinden.

### Wohin die Leine zeigt `p3f`

Offen, wenn: `P(G,['k3_pro','k3_pro_n']) && N(G,'l3_mybridge') && !N(G,'l3_down')`

1. **Problem einordnen:** Wenn es nicht die Alte Brücke ist: Woran hängt Mala dann?
2. **Denkrichtung:** Mala sieht ihre Leine. Marko nicht. *(Mala: Ich sehe meine Leine. Du nicht.)*
3. **Konkreter Ansatz:** Am Brückenkopf Mala nach ihrer Leine fragen. *(Mala: Frag mich am Brückenkopf nach der Leine.)*
4. **Nächster Schritt:** Mit Mala am Brückenkopf über die Leine reden.

### Der Leine nach `p3g`

Offen, wenn: `N(G,'l3_down') && !N(G,'l3_onedir')`

1. **Problem einordnen:** Die Leine zeigt flussab, aus der Stadt hinaus.
2. **Denkrichtung:** Eine Richtung kann man ausprobieren: ihr ein Stück folgen.
3. **Konkreter Ansatz:** Unten an der Alten Brücke führen Stufen ans Wasser. Dort geht es am Ufer nach Süden.
4. **Nächster Schritt:** An den Uferstufen der Alten Brücke der Leine folgen.

### Der Abend `p3h`

Offen, wenn: `G.phase==='k3_pro_n' && !F(G,'k3.p.talk1')`

1. **Problem einordnen:** Es ist Abend. Mala hat etwas auf dem Herzen.
2. **Denkrichtung:** Sie wartet darauf, dass Marko zuhört. *(Mala: Ich will mit dir reden.)*
3. **Konkreter Ansatz:** Auf der Terrasse der Herberge.
4. **Nächster Schritt:** Auf der Terrasse mit Mala reden.

### Schlafen `p3i`

Offen, wenn: `G.phase==='k3_pro_n' && F(G,'k3.p.talk1')`

1. **Problem einordnen:** Der erste Tag in Mostar ist vorbei.
2. **Denkrichtung:** Mala kann noch an die Uferstufen, wenn sie will. Dann ist Schlafenszeit. *(Mala: Ich gehe vielleicht noch ans Wasser. Du musst schlafen.)*
3. **Konkreter Ansatz:** Das Zimmer ist oben in der Herberge.
4. **Nächster Schritt:** Im Zimmer ins Bett gehen.

### Eine Richtung reicht nicht `d1a`

Offen, wenn: `G.phase==='k3_d1' && !F(G,'k3.peil.bridgehead')`

1. **Problem einordnen:** Die Leine zeigt eine Richtung. Aber nicht, wie weit.
2. **Denkrichtung:** Wer eine Richtung von einem Ort kennt und eine zweite von einem anderen, findet die Stelle, wo sie sich kreuzen. Messen, auf dem Plan.
3. **Konkreter Ansatz:** Am Brückenkopf beschreibt Mala die Richtung über Dinge, die man sieht. Marko zeichnet sie ein. *(Mala: Am Brückenkopf sage ich dir, woran die Leine vorbeigeht. Du zeichnest.)*
4. **Nächster Schritt:** Am Brückenkopf der Alten Brücke peilen: Mala nennt zwei Landmarken, die auf der Karte wählen.

### Von oben `d1b`

Offen, wenn: `F(G,'k3.peil.bridgehead') && !F(G,'k3.peil.minaret')`

1. **Problem einordnen:** Eine Linie ist eingezeichnet. Für einen Schnitt braucht es eine zweite.
2. **Denkrichtung:** Von oben sieht man weiter, und die Dinge liegen anders.
3. **Konkreter Ansatz:** Das Minarett der Koski-Moschee darf man besteigen. Die Kasse ist im Hof.
4. **Nächster Schritt:** *je nach Stand:* „Mit der Karte durch die Tür im Hof aufs Minarett steigen und oben peilen.“ / „Im Hof der Koski-Moschee ein Ticket kaufen, hinaufsteigen und oben peilen.“

### Zwei Linien `d1c`

Offen, wenn: `F(G,'k3.peil.minaret') && !N(G,'l3_flat')`

1. **Problem einordnen:** Zwei Linien sind eingezeichnet.
2. **Denkrichtung:** Was ergeben die beiden Messungen zusammen?
3. **Konkreter Ansatz:** Im Notizbuch die erste und die zweite Messung zusammen ansehen.
4. **Nächster Schritt:** „Erste Messung“ und „Zweite Messung“ im Notizbuch verbinden.

### Über den Fluss `d1d`

Offen, wenn: `N(G,'l3_flat') && !F(G,'k3.mala.crossed')`

1. **Problem einordnen:** Für die dritte Linie muss es auf die andere Seite gehen. Mala geht nicht über den Fluss, und allein kommt Marko nicht weit. *(Mala: Ich gehe nicht über den Fluss. Und ohne mich kommst du nicht weit.)*
2. **Denkrichtung:** Sie geht über keine Brücke. Aber ist für sie jede Brücke eine Brücke? *(Mala: Ich gehe über keine Brücke. Über eine richtige.)*
3. **Konkreter Ansatz:** Die Straßenbrücke im Zentrum: Beton, Geländer, Autos. Keine Brücke, die man anschaut.
4. **Nächster Schritt:** Mit Mala zur Straßenbrücke gehen und sie hinüberführen, ohne stehen zu bleiben.

### Ein Standort weit seitlich `d1e`

Offen, wenn: `N(G,'l3_flat') && F(G,'k3.mala.crossed') && !F(G,'k3.peil.partizan')`

1. **Problem einordnen:** Die beiden Linien schneiden sich zu flach. Es bleibt ein Streifen bis zum Meer.
2. **Denkrichtung:** Ein Standort weit seitlich, auf dem anderen Ufer und höher, schneidet in einem größeren Winkel.
3. **Konkreter Ansatz:** Der Partisanenfriedhof liegt hoch am Westhang.
4. **Nächster Schritt:** Zum Partisanenfriedhof gehen und dort mit Mala peilen. Wenn die Glocken läuten, auf Mala warten.

### Drei Linien `d1f`

Offen, wenn: `F(G,'k3.peil.partizan') && !N(G,'l3_area')`

1. **Problem einordnen:** Drei Linien sind eingezeichnet.
2. **Denkrichtung:** Wo schneiden sich alle drei?
3. **Konkreter Ansatz:** Im Notizbuch „Zu flach geschnitten“ und die dritte Messung zusammen ansehen.
4. **Nächster Schritt:** „Zu flach geschnitten“ und „Dritte Messung“ verbinden.

### Hinter dem Kartenrand `d1g`

Offen, wenn: `N(G,'l3_area') && !N(G,'l3_oldmap')`

1. **Problem einordnen:** Der Bereich liegt hinter dem Rand des Stadtplans.
2. **Denkrichtung:** Nötig ist eine Karte, die weiter reicht. Eine alte, mit den Dörfern.
3. **Konkreter Ansatz:** Maja, die Kioskfrau, der Taxifahrer oder Dino wissen, wo eine solche Karte hängt.
4. **Nächster Schritt:** Im Café von Zdravko am Westbusbahnhof die alte Karte an der Wand ansehen.

### Ein Name auf der alten Karte `d1h`

Offen, wenn: `N(G,'l3_area') && N(G,'l3_oldmap') && !N(G,'l3_skela')`

1. **Problem einordnen:** Die alte Karte und der eingegrenzte Bereich.
2. **Denkrichtung:** Was zeigt die alte Karte genau dort, wo sich die Linien schneiden?
3. **Konkreter Ansatz:** Im Notizbuch „Hinter dem Kartenrand“ und „Zdravkos Karte von 1985“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Der Fahrer, der rauchte `d1i`

Offen, wenn: `G.phase==='k3_d1' && !N(G,'v3_mate') && !N(G,'v3_where') && !N(G,'v3_ljerka')`

1. **Problem einordnen:** Mala erinnert sich an einen Lastwagen und einen Fahrer, der rauchte und nichts sagte. Wer war das?
2. **Denkrichtung:** Wer wusste damals, mit wem Lana fuhr? In Split jemand. In Mostar jemand, der jeden kennt.
3. **Konkreter Ansatz:** *je nach Stand:* „Ljerka hat in Split das Hotel geführt, und Sanja kennt sie. Im Café am Westbusbahnhof sitzt ein alter Mann am Fenster, der jeden kennt.“ / „Ljerka hat in Split das Hotel geführt, und Sanja kennt sie.“
4. **Nächster Schritt:** *je nach Stand:* „ Oder im Café am Westbusbahnhof den alten Mann nach dem Fahrer fragen.“ / „Ljerka ruft zurück, sobald ich zweimal den Ort gewechselt habe. Bis dahin weiter peilen.“ / „Mit dem Handy Sanja anrufen.“

### Vlado, der Raucher `d1j`

Offen, wenn: `N(G,'v3_ljerka') && !N(G,'v3_mate') && !N(G,'v3_where') && !F(G,'k3.v.met')`

1. **Problem einordnen:** Ljerka kennt nur einen Vornamen: Vlado, der Raucher. Er fuhr Mehl in die Dörfer.
2. **Denkrichtung:** Wer in Mostar kennt einen Vlado, der früher Mehl gefahren ist? Jemand, der selbst fährt.
3. **Konkreter Ansatz:** *je nach Stand:* „Der Taxifahrer am Ostbusbahnhof. Oder Zdravko im Café am Westbusbahnhof.“ / „Der Taxifahrer am Ostbusbahnhof.“
4. **Nächster Schritt:** Den Taxifahrer nach Vlado, dem Raucher, fragen.

### Vlados Werkstatt `d1o`

Offen, wenn: `G.phase==='k3_d1' && (N(G,'v3_mate')\|\|N(G,'v3_where')) && !F(G,'k3.v.met')`

1. **Problem einordnen:** Vlado Rajić, der Raucher, hat eine Werkstatt für Reifen.
2. **Denkrichtung:** *je nach Stand:* „Die Werkstatt heißt Vulkanizer Rajić. Sie liegt hinter dem Bulevar.“ / „Die Werkstatt liegt drüben, auf dem anderen Ufer. Mala geht nicht über den Fluss.“
3. **Konkreter Ansatz:** *je nach Stand:* „Vom Bulevar geht eine Seitengasse ab, mit einem Schild.“ / „Erst muss Mala über den Fluss. Dann geht es zu Vlado.“
4. **Nächster Schritt:** *je nach Stand:* „Im Vulkanizer mit Vlado reden.“ / „Zum Bulevar gehen und in die Seitengasse zum Vulkanizer.“ / „Erst mit Mala über den Fluss, dann zu Vlados Werkstatt.“

### Vlado leugnet `d1k`

Offen, wenn: `F(G,'k3.v.met') && !N(G,'v3_cab') && !vClosed(G)`

1. **Problem einordnen:** Vlado redet nicht. „Nie.“
2. **Denkrichtung:** Vlado redet nicht mit Marko. Vielleicht redet sein Hof. *(Mala: Er redet nicht mit dir. Vielleicht redet sein Hof.)*
3. **Konkreter Ansatz:** Hinter dem Rolltor steht ein alter Lastwagen unter einer Plane. Mala geht durch Zäune.
4. **Nächster Schritt:** Als Mala in den Hof gehen und im Führerhaus des Lastwagens spüren.

### Katas E-Mail `d1l`

Offen, wenn: `F(G,'k3.v.met') && !F(G,'k3.v.mail') && !vClosed(G)`

1. **Problem einordnen:** Kata will etwas verkaufen und hat eine E-Mail, die sie nicht ganz versteht.
2. **Denkrichtung:** Die E-Mail ist auf Deutsch, aus Graz. Marko ist Übersetzer.
3. **Konkreter Ansatz:** Österreichisch ist nicht ganz Deutsch: Ein Typenschein ist kein Typenschild.
4. **Nächster Schritt:** Kata fragen, was da hinten unter der Plane steht, und ihr die E-Mail übersetzen („Ich bin Übersetzer“).

### Welche Schublade? `d1m`

Offen, wenn: `F(G,'k3.v.which') && !F(G,'k3.v.drawer') && !vClosed(G)`

1. **Problem einordnen:** Kata braucht den Schlüssel zu genau einer von drei Schubladen. Raten lässt sie nicht.
2. **Denkrichtung:** Drei abgeschlossene Schubladen. Wer sieht durch Holz?
3. **Konkreter Ansatz:** Mala kann hineinsehen. *(Mala: Ich kann hineinsehen.)*
4. **Nächster Schritt:** *je nach Stand:* „Kata sagen: die unterste.“ / „Als Mala die drei Schubladen im Büro ansehen, dann Kata antworten.“

### Der Laden ist zu `d1n`

Offen, wenn: `vClosed(G)`

1. **Problem einordnen:** Vlado hat den Laden zugemacht.
2. **Denkrichtung:** Kata hat gesagt: in einer Stunde. Er beruhigt sich beim Flicken.
3. **Konkreter Ansatz:** Woanders hingehen und wiederkommen.
4. **Nächster Schritt:** Einen anderen Ort besuchen, dann zum Vulkanizer zurück.

### Die Nacht `n1a`

Offen, wenn: `G.phase==='k3_d1_n' && !F(G,'k3.d1.father')`

1. **Problem einordnen:** Auf der Terrasse singen die Australier.
2. **Denkrichtung:** Mala will etwas fragen. *(Mala: Ich will dich etwas fragen.)*
3. **Konkreter Ansatz:** Auf der Terrasse, bei Mala.
4. **Nächster Schritt:** Auf der Terrasse mit Mala reden.

### Schlafen `n1b`

Offen, wenn: `G.phase==='k3_d1_n' && F(G,'k3.d1.father')`

1. **Problem einordnen:** Der Freitag ist vorbei.
2. **Denkrichtung:** Morgen ist Samstag.
3. **Konkreter Ansatz:** Das Zimmer ist oben.
4. **Nächster Schritt:** Im Zimmer ins Bett gehen.

### Ein Ort, der wandert `d2a`

Offen, wenn: `N(G,'l3_city') && !N(G,'l3_person')`

1. **Problem einordnen:** Gestern zeigte die Leine nach Skela, heute in die Stadt. Ein Ort wandert nicht.
2. **Denkrichtung:** Was an einer Leine hängt, muss kein Ort sein.
3. **Konkreter Ansatz:** Im Notizbuch „Skela heißt Fähre“ und „Die Leine zeigt in die Stadt“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Wer kommt samstags in die Stadt? `d2b`

Offen, wenn: `G.phase==='k3_d2' && N(G,'l3_person') && !F(G,'k3.z.asked') && !F(G,'k3.z.mala') && !F(G,'k3.z.lost')`

1. **Problem einordnen:** Die Leine hängt an jemandem, der heute in der Stadt ist.
2. **Denkrichtung:** Wer kommt samstags aus den Dörfern in die Stadt?
3. **Konkreter Ansatz:** Maja in der Herberge weiß, was samstags los ist. Der Markt heißt Tepa.
4. **Nächster Schritt:** Zur Tepa gehen und der Leine bis zu ihrem Ende folgen.

### Die Eierfrau `d2c`

Offen, wenn: `G.phase==='k3_d2' && F(G,'k3.z.asked') && !F(G,'k3.z.mala') && !F(G,'k3.z.lost')`

1. **Problem einordnen:** Die alte Frau am Eierstand sagt „Ne“.
2. **Denkrichtung:** Unter welchem Namen hätten die Leute damals Lana gekannt?
3. **Konkreter Ansatz:** Lana nannte sich unterwegs nicht Lana. Im Notizbuch stehen Spuren dazu.
4. **Nächster Schritt:** *je nach Stand:* „Die Eierfrau nach „Mala“ fragen.“ / „Im Notizbuch „Sie hat gesagt, sie heißt Mala“ oder Ljerkas Bild mit „Ich habe ihr den Namen gegeben“ verbinden. Dann nach „Mala“ fragen.“

### Zwei Namen `d2d`

Offen, wenn: `(N(G,'v3_mala')\|\|N(G,'l3_ljerka_pic')) && !N(G,'l3_onetrail')`

1. **Problem einordnen:** Lana hat sich unterwegs Mala genannt.
2. **Denkrichtung:** Wer hat ihr diesen Namen gegeben?
3. **Konkreter Ansatz:** Im Notizbuch Vlados oder Ljerkas Satz und „Ich habe ihr den Namen gegeben“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Warum man sie nie fand `d2e`

Offen, wenn: `N(G,'l3_onetrail') && !N(G,'l3_twosearches')`

1. **Problem einordnen:** Nada sucht seit siebzehn Jahren. Warum hat sie nichts gefunden?
2. **Denkrichtung:** Unter welchem Namen hat sie gesucht, und unter welchem lagen die Spuren?
3. **Konkreter Ansatz:** „Mala und Lana sind eine Spur“ und „Vermisst“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Vlado, Teil 1 `d2f`

Offen, wenn: `G.phase==='k3_d2' && F(G,'k3.v.drawer') && !F(G,'k3.v.part1')`

1. **Problem einordnen:** Vlado hat gesagt: Kommen Sie morgen. Heute ist morgen.
2. **Denkrichtung:** Die Zeichnung und der Schlüssel liegen jetzt auf seinem Tisch.
3. **Konkreter Ansatz:** Zum Vulkanizer gehen.
4. **Nächster Schritt:** Mit Vlado über den Schlüssel von 31 und die Zeichnung reden.

### Der Bus aus München `d2g`

Offen, wenn: `G.phase==='k3_d2' && !F(G,'k3.b.arrived')`

1. **Problem einordnen:** Mate wartet auf seinen Sohn.
2. **Denkrichtung:** Der Bus aus München kommt samstags.
3. **Konkreter Ansatz:** Am Westbusbahnhof.
4. **Nächster Schritt:** Zum Westbusbahnhof gehen.

### Das Haus Zelenika `d2h`

Offen, wenn: `G.phase==='k3_d2' && F(G,'k3.b.arrived') && !!G.map.zelenika && !F(G,'k3.b.jela')`

1. **Problem einordnen:** Davor und Lena fahren zum Haus des Vaters.
2. **Denkrichtung:** Dort wartet jemand mit dem Schlüssel, der nur Herzegowinisch spricht. Lena spricht nur Deutsch.
3. **Konkreter Ansatz:** Das Haus Zelenika steht auf dem Plan.
4. **Nächster Schritt:** Zum Haus Zelenika gehen und zwischen Jela und Lena übersetzen.

### Nach Skela `n2a`

Offen, wenn: `G.phase==='k3_d2_n' && !inSkela(G) && !(F(G,'k3.z.tomorrow') && F(G,'k3.bato.found'))`

1. **Problem einordnen:** Die Leine zieht nach Skela.
2. **Denkrichtung:** Skela liegt zehn Kilometer südlich, hinter dem Rand des Plans.
3. **Konkreter Ansatz:** Vom Ostbusbahnhof fährt ein Taxi, jederzeit.
4. **Nächster Schritt:** Auf dem Stadtplan Skela wählen.

### Am rechten Ufer `n2b`

Offen, wenn: `G.phase==='k3_d2_n' && inSkela(G) && !F(G,'k3.bato.found')`

1. **Problem einordnen:** Eine Hütte, eine Glocke, ein Anker, Stümpfe im Fluss. Drüben ein Licht.
2. **Denkrichtung:** Mala sieht mehr als Marko. *(Mala: Ich sehe mehr als du.)*
3. **Konkreter Ansatz:** Über den Fluss sehen, zum anderen Ufer.
4. **Nächster Schritt:** Als Mala das andere Ufer ansehen.

### Was die Dinge behalten `n2c`

Offen, wenn: `P(G,['k3_d2_n','k3_d3']) && F(G,'k3.bato.found') && !(N(G,'a3_hut')&&N(G,'a3_bell3'))`

1. **Problem einordnen:** Hier ist etwas geschehen. Dinge erinnern sich.
2. **Denkrichtung:** Mala kann spüren, was an Dingen hängt. *(Mala: Ich kann spüren, was an Dingen hängt.)*
3. **Konkreter Ansatz:** Die Hütte. Die Glocke.
4. **Nächster Schritt:** Als Mala an der Hütte und an der Glocke spüren.

### Das andere Ufer `n2d`

Offen, wenn: `G.phase==='k3_d2_n' && F(G,'k3.bato.found') && !F(G,'k3.n2.batoTalk')`

1. **Problem einordnen:** Der Fährmann ist drüben. Mala geht nicht hinüber.
2. **Denkrichtung:** Flussauf steht eine neue Brücke.
3. **Konkreter Ansatz:** Marko kann allein hinübergehen. Der Weg ist kurz.
4. **Nächster Schritt:** Über die neue Brücke gehen und mit dem Fährmann im Schuppen reden.

### Die Frau mit der Lampe `n2e`

Offen, wenn: `G.phase==='k3_d2_n' && F(G,'k3.n2.batoTalk') && !F(G,'k3.z.tomorrow')`

1. **Problem einordnen:** Im Haus am linken Ufer brennt Licht.
2. **Denkrichtung:** Jemand wohnt hier noch.
3. **Konkreter Ansatz:** Vor dem Haus.
4. **Nächster Schritt:** Mit der Frau vor dem Haus reden.

### Zurück zu Mala `n2f`

Offen, wenn: `G.phase==='k3_d2_n' && F(G,'k3.z.tomorrow') && inSkela(G)`

1. **Problem einordnen:** Morgen. Bei Tag.
2. **Denkrichtung:** Mala wartet am rechten Ufer.
3. **Konkreter Ansatz:** Über die neue Brücke zurück.
4. **Nächster Schritt:** Zu Mala ans rechte Ufer gehen.

### Bei Tag `d3a`

Offen, wenn: `G.phase==='k3_d3' && !N(G,'a3_slept')`

1. **Problem einordnen:** Die Frau in Skela hat gesagt: Morgen. Bei Tag.
2. **Denkrichtung:** Heute ist bei Tag.
3. **Konkreter Ansatz:** Mit dem Taxi nach Skela, dann über die neue Brücke.
4. **Nächster Schritt:** In Skela mit der Frau am linken Ufer reden.

### Nach Dingen fragen `d3b`

Offen, wenn: `G.phase==='k3_d3' && N(G,'a3_slept') && !N(G,'a3_pencil')`

1. **Problem einordnen:** Nach dem Mädchen fragt man Zlata vergeblich. „Sie gehört niemandem mehr.“
2. **Denkrichtung:** Menschen schweigen. Dinge nicht.
3. **Konkreter Ansatz:** Was lag am Morgen an der Glocke?
4. **Nächster Schritt:** Zlata fragen, was am Morgen an der Glocke lag.

### Das Licht drüben `d3c`

Offen, wenn: `G.phase==='k3_d3' && N(G,'a3_slept') && !N(G,'a3_roof')`

1. **Problem einordnen:** Malas Nachhall liegt am einen Ufer, Zlatas Haus steht am anderen. Wer hat damals was gesehen?
2. **Denkrichtung:** In Malas Erinnerung an die Glocke brannte drüben ein Licht. Aber in welchem Fenster?
3. **Konkreter Ansatz:** Ein Licht in einem Fenster kann man auch heute zeigen. Das Handy hat eine Lampe.
4. **Nächster Schritt:** Das Handy in ein Fenster von Zlatas Haus halten, dann zu Mala wechseln und sie vergleichen lassen. So lange, bis es passt.

### Dunkel, hell, dunkel `d3d`

Offen, wenn: `N(G,'a3_roof') && !N(G,'a3_lightseq')`

1. **Problem einordnen:** Es war das Dachfenster. Aber wann war es hell?
2. **Denkrichtung:** Mala hat dreimal läuten hören. Und das Licht? *(Mala: Ich habe dreimal läuten hören. Und das Licht?)*
3. **Konkreter Ansatz:** An der Glocke noch einmal spüren.
4. **Nächster Schritt:** Als Mala an der Glocke spüren.

### Die Nacht ordnen `d3e`

Offen, wenn: `false`

1. **Problem einordnen:** Läuten, Licht, Läuten. Und davor Vlados Zeiten.
2. **Denkrichtung:** Die Reihenfolge reicht. Minuten braucht es nicht.
3. **Konkreter Ansatz:** *je nach Stand:* „Im Notizbuch „Dunkel, hell, dunkel“ und „Ankunft und Abfahrt“ zusammen ansehen.“ / „Vlados Zeiten fehlen noch: Ankunft und Abfahrt. Er hat sie am Samstag genannt.“
4. **Nächster Schritt:** Die beiden Notizen verbinden und die Karten der Reihe nach legen.

### Batos Licht `d3f`

Offen, wenn: `(N(G,'a3_lightroom')\|\|(N(G,'a3_roof')&&N(G,'a3_lightseq'))) && !N(G,'a3_thrice')`

1. **Problem einordnen:** In Batos Kammer hat jemand Licht gemacht, während Lana läutete. Das beweist noch nicht, dass er wach war.
2. **Denkrichtung:** Was sagt Bato selbst über diese Nacht? Für ihn ist es noch dieselbe Nacht.
3. **Konkreter Ansatz:** Bato im Schuppen auf das Licht ansprechen.
4. **Nächster Schritt:** *je nach Stand:* „Bato die Notiz „Licht in Batos Kammer“ zeigen.“ / „Bato „Das Dachfenster“ oder „Dunkel, hell, dunkel“ zeigen.“

### Geschlafen? `d3g`

Offen, wenn: `N(G,'a3_thrice') && !N(G,'a3_awake')`

1. **Problem einordnen:** Zlata sagt: Er hat geschlafen. Bato sagt: Dreimal hat er geläutet.
2. **Denkrichtung:** Wer mitzählt, schläft nicht.
3. **Konkreter Ansatz:** Im Notizbuch „Dreimal hat er geläutet“ und „Er hat geschlafen“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Wer hat geläutet? `d3h`

Offen, wenn: `N(G,'a3_voice') && N(G,'a3_pencil') && !N(G,'a3_girl')`

1. **Problem einordnen:** Bato sagt: ein Soldat.
2. **Denkrichtung:** Eine Stimme an der Glocke, und am Morgen lag dort etwas.
3. **Konkreter Ansatz:** Im Notizbuch „Eine Mädchenstimme“ und „Der Bleistift“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Zurück zu Mala `d3i0`

Offen, wenn: `G.phase==='k3_d3' && N(G,'a3_roof') && !F(G,'k3.z.deka')`

1. **Problem einordnen:** Mala hat das Fenster erkannt. Sie wartet drüben an der Glocke.
2. **Denkrichtung:** Auf dem linken Ufer ist Marko. Auf dem rechten ist Mala.
3. **Konkreter Ansatz:** Über die neue Brücke zurück ans rechte Ufer.
4. **Nächster Schritt:** Über die neue Brücke zu Mala gehen.

### Eine graue Decke `d3i`

Offen, wenn: `F(G,'k3.z.deka') && !F(G,'k3.mala.deka')`

1. **Problem einordnen:** Zlata hat eine Decke mitgegeben.
2. **Denkrichtung:** Mala kann lesen, was Dinge erlebt haben. *(Mala: Ich kann lesen, was Dinge erlebt haben.)*
3. **Konkreter Ansatz:** Mala wartet am rechten Ufer.
4. **Nächster Schritt:** Zu Mala gehen und ihr die Decke zeigen.

### Nach dem Fluss `d3j`

Offen, wenn: `N(G,'a3_blanket') && !N(G,'l3_survived')`

1. **Problem einordnen:** Mala hat in der Decke etwas gesehen.
2. **Denkrichtung:** Woher stammt die Decke, und was hat Mala in ihr gesehen?
3. **Konkreter Ansatz:** Im Notizbuch „Nachhall der Decke“ und „Zlatas Decke“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Was Zlata versprochen hat `d3k`

Offen, wenn: `N(G,'l3_survived') && !F(G,'k3.z.alive')`

1. **Problem einordnen:** Lana hat den Fluss überlebt. Zlata hat sie gefunden.
2. **Denkrichtung:** Zlata weiß mehr, als sie sagt.
3. **Konkreter Ansatz:** Zlata darauf ansprechen.
4. **Nächster Schritt:** Zlata die Notiz „Sie hat den Fluss überlebt“ zeigen.

### Der Soldat `d3l`

Offen, wenn: `N(G,'a3_awake') && N(G,'a3_girl') && !F(G,'k3.bato.uneasy')`

1. **Problem einordnen:** Bato hält am Soldaten fest.
2. **Denkrichtung:** Zwei Dinge sprechen dagegen.
3. **Konkreter Ansatz:** Bato mit „Bato war wach“ und „Es war das Mädchen“ ansprechen.
4. **Nächster Schritt:** Bato beide Notizen zeigen.

### Vlado, Teil 2 `d3m`

Offen, wenn: `G.phase==='k3_d3' && N(G,'a3_girl') && (N(G,'a3_lightroom')\|\|N(G,'a3_awake')) && N(G,'l3_survived') && !F(G,'k3.v.part2')`

1. **Problem einordnen:** Vlado hat am Samstag nicht alles gesagt.
2. **Denkrichtung:** Jetzt gibt es etwas, das er nicht wegschieben kann: die Glocke, das Licht, den Bleistift, und dass Lana den Fluss überlebt hat.
3. **Konkreter Ansatz:** Zum Vulkanizer.
4. **Nächster Schritt:** Mit Vlado über Glocke, Licht, Bleistift und Lanas Überleben reden.

### Zwei Fassungen `d3n`

Offen, wenn: `N(G,'v3_sent') && N(G,'v3_mala_left') && !N(G,'v3_who')`

1. **Problem einordnen:** Vlado und Mala erzählen dieselbe Nacht. Nicht gleich.
2. **Denkrichtung:** Was sagt Vlado, was hat Mala gesagt?
3. **Konkreter Ansatz:** Im Notizbuch „Sie hat mich weggeschickt“ und „Er ist gefahren“ zusammen ansehen.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Mit Mala reden `d3o`

Offen, wenn: `N(G,'v3_who') && !F(G,'k3.d3.talk2')`

1. **Problem einordnen:** Mala hat etwas für sich behalten. *(Mala: Ich habe dir etwas nicht gesagt.)*
2. **Denkrichtung:** Sie hat gesagt: „Er ist gefahren.“ Vlado sagt etwas anderes. *(Mala: Ich habe gesagt: Er ist gefahren.)*
3. **Konkreter Ansatz:** Im Hof des Vulkanizers, beim Lastwagen.
4. **Nächster Schritt:** Im Hof mit Mala reden: „Er sagt, du hast ihn weggeschickt.“

### Eine Botschaft für Vlado `d3p`

Offen, wenn: `F(G,'k3.d3.talk2') && !F(G,'k3.v.free')`

1. **Problem einordnen:** Vlado soll erfahren, dass er nicht schuld ist. Und von wem es kommt.
2. **Denkrichtung:** Kein Papier überzeugt ihn. Nichts, was er gelesen oder selbst erzählt hat.
3. **Konkreter Ansatz:** Etwas, das im Führerhaus geblieben ist, zwischen den beiden.
4. **Nächster Schritt:** Was hat Mala im Führerhaus gespürt? Vlado diese Notiz zeigen.

### Die Briefe `d3q`

Offen, wenn: `G.phase==='k3_d3' && F(G,'k3.b.arrived') && !N(G,'b3_invite')`

1. **Problem einordnen:** Mate schrieb jedes Jahr dieselbe Frage. Davor las darin einen Vorwurf.
2. **Denkrichtung:** Was hat Mate gemeint? Das Haus erzählt mehr als die Briefe.
3. **Konkreter Ansatz:** In der Stube die Briefe, oben das Kinderzimmer.
4. **Nächster Schritt:** *je nach Stand:* „„Mates Briefe“ und „Das Kinderzimmer“ verbinden.“ / „Im Haus über die Treppe hinauf und das Kinderzimmer ansehen.“ / „Im Haus Davor fragen, ob ich Mates Briefe lesen darf; oben ist das Kinderzimmer.“

### Was Mate gemeint hat `d3q2`

Offen, wenn: `G.phase==='k3_d3' && N(G,'b3_invite') && !F(G,'k3.b.invite')`

1. **Problem einordnen:** Davor liest in Mates Briefen einen Vorwurf.
2. **Denkrichtung:** Er muss hören, was „Kad ćete doći?“ gemeint war. In seiner Sprache.
3. **Konkreter Ansatz:** Davor ist im Haus, bei den Briefen.
4. **Nächster Schritt:** Mit Davor über „Kad ćete doći?“ reden.

### Wie wollte er heißen? `d3r`

Offen, wenn: `N(G,'b3_invite') && !N(G,'b3_dida')`

1. **Problem einordnen:** Lena will Mate etwas sagen, in seiner Sprache. Aber wie redet man ihn an?
2. **Denkrichtung:** Kein Wörterbuch. Mates eigene Schrift.
3. **Konkreter Ansatz:** In Mates Schublade in der Stube liegen Lenas Postkarten.
4. **Nächster Schritt:** *je nach Stand:* „„Lenas Postkarten“ und „Dragi dida“ verbinden.“ / „Die Schublade in der Stube öffnen und die Postkarten ansehen.“

### Lenas Satz `d3s`

Offen, wenn: `N(G,'b3_invite') && N(G,'b3_dida') && F(G,'k3.b.invite') && !F(G,'k3.b.son')`

1. **Problem einordnen:** Lena will Mate antworten, auf „Kad ćete doći?“
2. **Denkrichtung:** Die Antwort auf „Wann kommt ihr?“ ist kurz.
3. **Konkreter Ansatz:** „Došli smo“ heißt: Wir sind gekommen. Die Anrede steht in Mates Schrift.
4. **Nächster Schritt:** Mit Lena am Tor den Satz bauen: „Došli smo, dida.“

### Der Schlüssel am Tor `d3t`

Offen, wenn: `F(G,'k3.b.son') && !F(G,'k3.b.dead')`

1. **Problem einordnen:** Mate erkennt seinen Sohn. Aber nicht, dass er selbst nicht mehr da ist.
2. **Denkrichtung:** *je nach Stand:* „Jela hat erzählt: Mate stand am Tor, und den Schlüssel bekam der Kleinste.“ / „Mate stand am Tor, wenn ein Bus kam. Und den Schlüssel bekam der Kleinste. Lena weiß es von Jela.“
3. **Konkreter Ansatz:** Lena ist die Kleinste.
4. **Nächster Schritt:** Lena bitten, sich ans Tor zu stellen und die Hand aufzuhalten.

### Die Feigen `d3u`

Offen, wenn: `F(G,'k3.b.dead') && !F(G,'k3.b.figs')`

1. **Problem einordnen:** Für heute Nacht ist Frost angesagt.
2. **Denkrichtung:** Jela weiß, wie man Feigen einpackt. Davor kann es lernen.
3. **Konkreter Ansatz:** Mit Jela über die Feigen reden und übersetzen.
4. **Nächster Schritt:** Jela fragen, und übersetzen, während Davor einpackt.

### Für den Kleinsten `d3v`

Offen, wenn: `F(G,'k3.b.keyFree') && !F(G,'k3.b.keyLena')`

1. **Problem einordnen:** In der Astgabel liegt ein Schlüssel.
2. **Denkrichtung:** Für wen war er immer?
3. **Konkreter Ansatz:** Für den Kleinsten.
4. **Nächster Schritt:** *je nach Stand:* „k3.b.keyTaken“ / „Lena den Schlüssel geben.“ / „Den Schlüssel aus der Astgabel nehmen und Lena geben.“

### Mate `d3w`

Offen, wenn: `F(G,'k3.b.keyLena') && !F(G,'k3.b.limbo')`

1. **Problem einordnen:** Mate ist bereit.
2. **Denkrichtung:** Mala kann die Schwelle öffnen. *(Mala: Ich kann ihn hinüberbringen.)*
3. **Konkreter Ansatz:** Mit Mala bei Mate.
4. **Nächster Schritt:** Zu Mala wechseln und bei Mate „Hinüberbringen“ wählen. *(Mala: Zu mir wechseln und bei Mate „Hinüberbringen“ wählen.)*

### Zurück `d3w2`

Offen, wenn: `G.phase==='k3_d3' && F(G,'k3.b.limbo') && !F(G,'k3.b.done')`

1. **Problem einordnen:** Mate ist hinübergegangen.
2. **Denkrichtung:** Mala bleibt am Rand. Für Marko geht es zurück. *(Mala: Ich bleibe am Rand. Du gehst zurück.)*
3. **Konkreter Ansatz:** Das Tor.
4. **Nächster Schritt:** Durch das Tor zurückgehen.

### Bis elf `d3x`

Offen, wenn: `G.phase==='k3_d3' && F(G,'k3.v.free') && !F(G,'k3.b.done')`

1. **Problem einordnen:** Vlado holt um elf ab. Vorher noch die Feigen.
2. **Denkrichtung:** Die Zelenikas.
3. **Konkreter Ansatz:** Haus Zelenika.
4. **Nächster Schritt:** Den Fall der Zelenikas zu Ende bringen.

### Soll Zlata es erfahren? `d3y`

Offen, wenn: `G.phase==='k3_d3' && N(G,'a3_awake') && !F(G,'k3.z.tellOk') && !F(G,'k3.asked.zlata_awake')`

1. **Problem einordnen:** Soll Zlata erfahren, dass ihr Mann wach war?
2. **Denkrichtung:** Das ist nicht nur Markos Entscheidung.
3. **Konkreter Ansatz:** Mala fragen, bevor Marko es Zlata sagt. *(Mala: Frag mich, bevor du es ihr sagst.)*
4. **Nächster Schritt:** Bei Zlata „Ihr sagen, dass Bato wach war“ wählen und dann Mala fragen.

### Die Glocke `f3a`

Offen, wenn: `G.phase==='k3_fin_n' && !F(G,'k3.fin.bato')`

1. **Problem einordnen:** Heute Nacht weiß Bato, wer geläutet hat.
2. **Denkrichtung:** Die Glocke am rechten Ufer.
3. **Konkreter Ansatz:** Läuten.
4. **Nächster Schritt:** An der Glocke läuten.

### Einsteigen `f3b`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.fin.bato') && !F(G,'k3.fin.boarded')`

1. **Problem einordnen:** Bato wartet mit der Fähre. Das ist Malas Entscheidung. *(Mala: Er wartet. Das ist meine Entscheidung.)*
2. **Denkrichtung:** Nur Mala kann einsteigen.
3. **Konkreter Ansatz:** Zu Mala wechseln.
4. **Nächster Schritt:** Als Mala zur Fähre gehen und einsteigen.

### Über die Brücke `f3b2`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.fin.boarded') && !F(G,'k3.fin.crossed')`

1. **Problem einordnen:** Mala ist auf der Fähre. Bato setzt über.
2. **Denkrichtung:** Marko, Vlado und Kata müssen auch ans andere Ufer.
3. **Konkreter Ansatz:** Flussauf steht die neue Brücke.
4. **Nächster Schritt:** Über die neue Brücke zum linken Ufer gehen.

### Am linken Ufer `f3c`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.fin.crossed') && !F(G,'k3.fin.story')`

1. **Problem einordnen:** Zlata steht mit der Lampe am Schuppen.
2. **Denkrichtung:** Sie hat die Glocke gehört.
3. **Konkreter Ansatz:** Zu Zlata gehen.
4. **Nächster Schritt:** Mit Zlata reden.

### Was Zlata nicht weiß `f3c2`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.fin.story') && !F(G,'k3.fin.free')`

1. **Problem einordnen:** Zlata hat gesagt, was sie siebzehn Jahre verschwiegen hat.
2. **Denkrichtung:** Etwas weiß sie nicht. Über ihren Mann.
3. **Konkreter Ansatz:** Mala weiß, ob jetzt die Zeit dafür ist. *(Mala: Sieh mich an. Ich sage dir, ob jetzt die Zeit ist.)*
4. **Nächster Schritt:** *je nach Stand:* „Zuhören. Es geht von selbst weiter.“ / „Zlata sagen, dass Bato wach war.“

### Das Grab `f3d`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.fin.free') && !F(G,'k3.fin.bond')`

1. **Problem einordnen:** Mala steht am Grab unter dem Quittenbaum. *(Mala: Ich stehe an meinem Grab.)*
2. **Denkrichtung:** Was will Mala?
3. **Konkreter Ansatz:** Nicht versprechen. Fragen.
4. **Nächster Schritt:** Am Grab mit Mala reden und sie fragen, was sie will.

### Bei Hochwasser `f3e`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.fin.bond') && !F(G,'k3.a.limbo')`

1. **Problem einordnen:** Bato wartet.
2. **Denkrichtung:** Das Seil.
3. **Konkreter Ansatz:** Bei Hochwasser braucht es zwei.
4. **Nächster Schritt:** Das Seil nehmen und mit Bato ziehen.

### Zurück `f3f`

Offen, wenn: `G.phase==='k3_fin_n' && F(G,'k3.a.limbo')`

1. **Problem einordnen:** Bato ist hinübergegangen.
2. **Denkrichtung:** Mala bleibt am Rand. Für Marko geht es zurück. *(Mala: Ich bleibe am Rand. Du gehst zurück.)*
3. **Konkreter Ansatz:** Das Tor.
4. **Nächster Schritt:** Durch das Tor zurückgehen.

### Nada `e3a`

Offen, wenn: `G.phase==='k3_epi' && !F(G,'k3.e.call')`

1. **Problem einordnen:** Nada wartet seit siebzehn Jahren.
2. **Denkrichtung:** Das Handy.
3. **Konkreter Ansatz:** Nada anrufen.
4. **Nächster Schritt:** Mit dem Handy Nada anrufen.

### Die Brücke `e3b`

Offen, wenn: `G.phase==='k3_epi' && F(G,'k3.e.call') && !F(G,'k3.e.bridge')`

1. **Problem einordnen:** Mala will etwas sehen, bevor Nada kommt. *(Mala: Ich will noch etwas sehen.)*
2. **Denkrichtung:** Die Alte Brücke.
3. **Konkreter Ansatz:** Mit Mala zur Alten Brücke gehen.
4. **Nächster Schritt:** An der Alten Brücke mit Mala über die Brücke gehen.

### Nada kommt `e3c`

Offen, wenn: `G.phase==='k3_epi_d' && !F(G,'k3.e.nada')`

1. **Problem einordnen:** Nada kommt mit dem ersten Bus.
2. **Denkrichtung:** Aus Sarajevo kommen die Busse am Ostbusbahnhof an.
3. **Konkreter Ansatz:** Ostbusbahnhof.
4. **Nächster Schritt:** Zum Ostbusbahnhof gehen.

### Zwei Mütter `e3d`

Offen, wenn: `G.phase==='k3_epi_d' && F(G,'k3.e.nada') && !F(G,'k3.e.mothers')`

1. **Problem einordnen:** Nada will zu ihr.
2. **Denkrichtung:** Skela.
3. **Konkreter Ansatz:** Vlado fährt. In Zlatas Küche liegt etwas für Nada.
4. **Nächster Schritt:** *je nach Stand:* „Nada das Skizzenbuch geben.“ / „Nada Zlatas Brief von 1996 geben, dann das Skizzenbuch.“ / „Nach Skela fahren, in Zlatas Küche die Schublade öffnen und Nada Zlatas Brief von 1996 geben, dann das Skizzenbuch.“

### Das Amt `e3e`

Offen, wenn: `G.phase==='k3_epi_d' && F(G,'k3.e.mothers') && !F(G,'k3.e.report')`

1. **Problem einordnen:** Lana muss amtlich gefunden werden, bevor sie heimkommt.
2. **Denkrichtung:** Die Vermisstenstelle.
3. **Konkreter Ansatz:** Frau Kolar wartet.
4. **Nächster Schritt:** Zur Vermisstenstelle gehen und mit Frau Kolar reden.

### Ein Feld, das zu klein ist `e3f`

Offen, wenn: `G.phase==='k3_epi_d' && F(G,'k3.e.report') && !F(G,'k3.e.form')`

1. **Problem einordnen:** Das Formular fragt nach der Beziehung zur vermissten Person.
2. **Denkrichtung:** Die amtliche Antwort stimmt. Aber sie ist zu klein.
3. **Konkreter Ansatz:** Was war Lana für Marko? In seinen eigenen Worten.
4. **Nächster Schritt:** Ins Feld einen eigenen Satz schreiben.

### „Und Sie?“ `e3g`

Offen, wenn: `G.phase==='k3_epi_d' && N(G,'e3_kolar') && !F(G,'k3.e.sample') && !F(G,'k3.e.sampleDone')`

1. **Problem einordnen:** Frau Kolar hat Marko etwas gefragt.
2. **Denkrichtung:** Marko hat selbst einen Vermissten.
3. **Konkreter Ansatz:** Seinen Vater.
4. **Nächster Schritt:** Frau Kolar sagen, wen Marko vermisst, und eine Probe abgeben.

### Die Mutter `e3h`

Offen, wenn: `G.phase==='k3_epi_d' && (F(G,'k3.e.sample')\|\|F(G,'k3.e.sampleDone')) && !F(G,'k3.e.mother')`

1. **Problem einordnen:** Mit der Probe der Mutter geht es schneller.
2. **Denkrichtung:** Achtzehn Jahre haben die beiden nicht über ihn geredet.
3. **Konkreter Ansatz:** Das Handy.
4. **Nächster Schritt:** Die Mutter anrufen.

### Zurück `e3i`

Offen, wenn: `G.phase==='k3_epi_d' && F(G,'k3.e.mother') && !F(G,'k3.e.bus')`

1. **Problem einordnen:** Die Rückfahrkarte.
2. **Denkrichtung:** Der Bus nach Sarajevo.
3. **Konkreter Ansatz:** Ostbusbahnhof.
4. **Nächster Schritt:** Zum Ostbusbahnhof gehen.

### Der Tag geht zu Ende `x3day`

Offen, wenn: `P(G,['k3_pro','k3_d1','k3_d2','k3_d2_n','k3_d3','k3_epi']) && !!(M.k3DayReady && M.k3DayReady(G))`

1. **Problem einordnen:** *je nach Stand:* „Die Brücke ist geklärt, das Zimmer genommen. Es wird Abend.“ / „Skela steht auf dem Plan, die Schublade ist offen. Für heute reicht es.“ / „Für den Samstag ist alles getan.“ / „Morgen. Bei Tag.“ / „Alles ist bereit. Um elf kommt Vlado.“ / „Mala war auf der Brücke. Gegen Mittag kommt Nada.“ / „Für heute ist alles getan.“
2. **Denkrichtung:** Der Rest des Tages kommt von selbst.
3. **Konkreter Ansatz:** Nichts mehr suchen.
4. **Nächster Schritt:** Einen Moment warten: Der nächste Abschnitt beginnt von selbst.

## Kapitel 4: München (48 Themen)

### Der Kopf pocht `h4a`

Offen, wenn: `G.phase==='k4_pro' && !F(G,'k4.h.found')`

1. **Problem einordnen:** Am Bussteig pocht Markos Kopf. Das kennt er.
2. **Denkrichtung:** So fühlt es sich an, wenn ein Geist in der Nähe ist, den Mala noch nicht gefunden hat.
3. **Konkreter Ansatz:** Mala kann sich am Busbahnhof umsehen. Der Druck ist am Rand am stärksten, wo nichts mehr steht. *(Mala: Ich sehe mich um. Da, wo nichts mehr steht.)*
4. **Nächster Schritt:** Zu Mala wechseln und am Pfeiler am Rand des Busbahnhofs nachsehen.

### Eine Ablösung `h4b`

Offen, wenn: `G.phase==='k4_pro' && F(G,'k4.h.found') && !F(G,'k4.p.hansi')`

1. **Problem einordnen:** Der alte Mann am Pfeiler wartet auf seine Ablösung.
2. **Denkrichtung:** Markos Hochdeutsch nimmt er nicht an: „Sie san ned vo do.“ Es fehlt nicht der richtige Satz. Es fehlt die richtige Stimme.
3. **Konkreter Ansatz:** Jemand von hier, der ihn kannte. Am Taxistand lehnt ein alter Münchner.
4. **Nächster Schritt:** *je nach Stand:* „Den Taxifahrer am Taxistand fragen, ob er Hansi kannte, und ihn bitten, etwas für ihn zu tun: „Feierabend“ zum Mann am Pfeiler sagen.“ / „Mit dem Mann am Pfeiler reden: worauf er wartet und wer ihn ablösen darf.“

### Der Schlüssel `h4c`

Offen, wenn: `G.phase==='k4_pro' && N(G,'u4_sms') && !F(G,'k4.p.key')`

1. **Problem einordnen:** Mama arbeitet bis zwei. Den Schlüssel hat die Nachbarin.
2. **Denkrichtung:** Anas SMS: „Schlüssel bei Frau Huber, unten links.“
3. **Konkreter Ansatz:** Im Westend, in Mamas Haus.
4. **Nächster Schritt:** Im Treppenhaus bei Frau Huber klingeln.

### Warten auf Mama `h4d`

Offen, wenn: `G.phase==='k4_pro' && F(G,'k4.p.key') && !F(G,'k4.p.jasna') && !F(G,'k4.p.coffee')`

1. **Problem einordnen:** Mama kommt um zwei. Bis dahin ist Zeit.
2. **Denkrichtung:** Die Wohnung erzählt einiges. Und man kann Kaffee kochen.
3. **Konkreter Ansatz:** Großmutters Džezva ist im Gepäck. In der Küche steht ein Herd.
4. **Nächster Schritt:** In der Küche den Herd benutzen und in Großmutters Džezva Kaffee kochen.

### Mama `h4e`

Offen, wenn: `G.phase==='k4_pro' && F(G,'k4.p.coffee') && !F(G,'k4.p.jasna')`

1. **Problem einordnen:** Mama ist da. Marko hat ihr einiges mitgebracht.
2. **Denkrichtung:** Nadas Gruß. Und eine Nachricht aus Mostar.
3. **Konkreter Ansatz:** Die Dose von Nada geben. Von Lana erzählen. Und das mit der Probe.
4. **Nächster Schritt:** Mit Mama reden: ihr Nadas Dose geben, von Lana erzählen, die Probe ansprechen.

### Heiligabend `p4a`

Offen, wenn: `G.phase==='k4_pro_n' && !F(G,'k4.p.eve')`

1. **Problem einordnen:** Heiligabend bei Ana. Die ganze Familie an einem Tisch.
2. **Denkrichtung:** Jeder hier will etwas: Ana reden, Tobias dazugehören, die Kinder Geschenke.
3. **Konkreter Ansatz:** Ana ruft: Wer nicht sitzt, kriegt keine. Der Tisch ist gedeckt.
4. **Nächster Schritt:** Mit allen reden, wer mag; dann sich an den Tisch setzen (Tisch benutzen).

### Die Nacht `p4b`

Offen, wenn: `G.phase==='k4_pro_n' && F(G,'k4.p.eve') && !F(G,'k4.p.talk1')`

1. **Problem einordnen:** Es ist spät. Mala hat etwas auf dem Herzen.
2. **Denkrichtung:** Sie wartet darauf, dass Marko zuhört. *(Mala: Ich will mit dir reden.)*
3. **Konkreter Ansatz:** In Mamas Wohnzimmer.
4. **Nächster Schritt:** Mit Mala reden.

### Schlafen `p4c`

Offen, wenn: `G.phase==='k4_pro_n' && F(G,'k4.p.eve') && F(G,'k4.p.talk1')`

1. **Problem einordnen:** Heiligabend ist vorbei.
2. **Denkrichtung:** Marko schläft auf Mamas Couch. Sie ist zu kurz.
3. **Konkreter Ansatz:** Die Couch im Wohnzimmer.
4. **Nächster Schritt:** Auf der Couch schlafen.

### Ana und die Kinder `d4a`

Offen, wenn: `G.phase==='k4_d1' && !N(G,'z4_stiefel')`

1. **Problem einordnen:** Ana wollte heute mit den Kindern raus. Mit uns.
2. **Denkrichtung:** Auf eine große Wiese, zum Rodeln.
3. **Konkreter Ansatz:** Die Theresienwiese.
4. **Nächster Schritt:** Zur Theresienwiese gehen und mit Ana spazieren.

### Wieder der Druck `d4b`

Offen, wenn: `G.phase==='k4_d1' && !N(G,'s4_peppino')`

1. **Problem einordnen:** Markos Kopf pocht. Irgendwo in der Stadt wartet einer, den Mala noch nicht gefunden hat.
2. **Denkrichtung:** Wo kommen in München Menschen an und fahren ab?
3. **Konkreter Ansatz:** Der Hauptbahnhof. Mala kann sich dort umsehen. *(Mala: Am Bahnhof. Ich sehe mich um.)*
4. **Nächster Schritt:** *je nach Stand:* „An Gleis 11 mit dem Mann reden: Wie heißt er weiter?“ / „Als Marko zum Hauptbahnhof fahren: Mala zeigt ihm den Mann an Gleis 11.“ / „Als Mala zum Hauptbahnhof gehen und sich an Gleis 11 umsehen. Dann mit Marko hin und mit dem Mann reden.“

### Mamas Brot `d4c`

Offen, wenn: `G.phase==='k4_d1' && !F(G,'k4.d1.bread')`

1. **Problem einordnen:** Mama ist bei der Arbeit. Sie war heute Morgen in Eile.
2. **Denkrichtung:** In der Küche liegt etwas, das sie vergessen hat.
3. **Konkreter Ansatz:** Auf dem Tisch, neben ihrem Zettel.
4. **Nächster Schritt:** In Mamas Wohnküche die Brotdose vom Tisch nehmen.

### Ins Heim `d4d`

Offen, wenn: `P(G,['k4_d1']) && F(G,'k4.d1.bread') && !F(G,'k4.g.bread')`

1. **Problem einordnen:** Mama hat ihr Brot vergessen.
2. **Denkrichtung:** Sie arbeitet im Haus am Bavariapark.
3. **Konkreter Ansatz:** Im Wohnbereich, oben.
4. **Nächster Schritt:** Im Heim Mama die Brotdose geben.

### Im Heim `d4e`

Offen, wenn: `P(G,['k4_d1','k4_d2']) && F(G,'k4.g.bread') && !N(G,'g4_gerda')`

1. **Problem einordnen:** Auch im Heim pocht Markos Kopf.
2. **Denkrichtung:** Ein Geist, den Mala noch nicht gefunden hat.
3. **Konkreter Ansatz:** Mala kann sich im Flur umsehen. Am Aufzug. *(Mala: Ich sehe mich im Flur um. Am Aufzug.)*
4. **Nächster Schritt:** Als Mala im Flur bei der Bank am Aufzug nachsehen.

### Mamas Küche `n4a`

Offen, wenn: `G.phase==='k4_d1_n' && !F(G,'k4.d1.dzezva')`

1. **Problem einordnen:** Mama sitzt in der Küche.
2. **Denkrichtung:** Großmutters Džezva steht auf dem Herd.
3. **Konkreter Ansatz:** Mit Mama am Tisch reden.
4. **Nächster Schritt:** Mit Mama in der Küche reden.

### Die Kiste `n4b`

Offen, wenn: `G.phase==='k4_d1_n' && F(G,'k4.d1.dzezva') && !F(G,'k4.d1.box')`

1. **Problem einordnen:** Marko schläft bald. Mala nicht. *(Mala: Er schläft. Ich nicht.)*
2. **Denkrichtung:** Im Schlafzimmer steht eine Kiste, die Marko nicht öffnet. *(Mala: Im Schlafzimmer steht eine Kiste. Er öffnet sie nicht.)*
3. **Konkreter Ansatz:** Mala braucht keinen Schlüssel. *(Mala: Ich brauche keinen Schlüssel.)*
4. **Nächster Schritt:** Zu Mala wechseln, ins Schlafzimmer gehen und die Kiste im Schrank ansehen.

### Schlafen `n4c`

Offen, wenn: `G.phase==='k4_d1_n' && F(G,'k4.d1.dzezva') && F(G,'k4.d1.box')`

1. **Problem einordnen:** Der Christtag ist vorbei.
2. **Denkrichtung:** Die Couch.
3. **Konkreter Ansatz:** Im Wohnzimmer.
4. **Nächster Schritt:** Auf der Couch schlafen.

### Wer war der Mann an Gleis 11? `s4a`

Offen, wenn: `P(G,['k4_d1','k4_d2']) && N(G,'s4_peppino') && !N(G,'s4_fluch') && !N(G,'s4_bairisch')`

1. **Problem einordnen:** Peppino hat am Bahnhof gearbeitet. Jemand muss ihn gekannt haben.
2. **Denkrichtung:** Leute, die jeden Tag am Gleis sind.
3. **Konkreter Ansatz:** Die Bahnhofsmission an Gleis 11. Und der Kiosk.
4. **Nächster Schritt:** Frau Wimmer in der Bahnhofsmission und die Kioskfrau nach dem Gepäckträger fragen.

### Bairisch oder Italienisch `s4b`

Offen, wenn: `N(G,'s4_fluch') && N(G,'s4_bairisch') && !N(G,'s4_tarnung')`

1. **Problem einordnen:** Die Kioskfrau sagt: ein Urmünchner. Frau Wimmer sagt: Er hat italienisch geflucht.
2. **Denkrichtung:** Einer von beiden irrt. Oder keiner.
3. **Konkreter Ansatz:** Im Notizbuch beide Aussagen nebeneinanderlegen.
4. **Nächster Schritt:** „A Urmünchner“ und „Italienisch geflucht“ verbinden.

### Die Akte `s4c`

Offen, wenn: `P(G,['k4_d2','k4_d3']) && F(G,'k4.s.wimmer') && !N(G,'s4_ausweis') && !N(G,'s4_name')`

1. **Problem einordnen:** Wer ohne Angehörige stirbt, wird von Amts wegen bestattet.
2. **Denkrichtung:** Dafür hat die Stadt eine Akte.
3. **Konkreter Ansatz:** Städtische Friedhöfe, die Verwaltung.
4. **Nächster Schritt:** Bei Herrn Obermaier nach der Akte zum Gepäckträger fragen.

### Nummer 17 `s4d`

Offen, wenn: `N(G,'s4_peppino') && N(G,'s4_ausweis') && !N(G,'s4_derselbe') && !N(G,'s4_name')`

1. **Problem einordnen:** Peppino an Gleis 11. Josef Rugiero in der Akte.
2. **Denkrichtung:** Beide tragen dieselbe Nummer.
3. **Konkreter Ansatz:** Im Notizbuch „Mi chiamo Peppino“ und „Josef Rugiero“.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Wie aus einem Namen ein anderer wird `s4e`

Offen, wenn: `N(G,'s4_peppino') && !N(G,'s4_name') && (N(G,'s4_derselbe')\|\|N(G,'s4_genommen'))`

1. **Problem einordnen:** Peppino und Josef Rugiero: derselbe Mann? Eine Nummer allein ist noch kein Name.
2. **Denkrichtung:** „Me l'hanno preso qui.“ Den Namen hat man ihm hier genommen, an Gleis 11.
3. **Konkreter Ansatz:** Unter Gleis 11 liegt etwas, wo nur Mala hinkommt. Oder in seinem Koffer liegt Post. *(Mala: Unter dem Gleis ist etwas. Ich komme da hin, du nicht. Oder du liest seine Post.)*
4. **Nächster Schritt:** *je nach Stand:* „Im Notizbuch „Peppino ist der Sepp (?)“ mit Malas Nachhall aus dem Bunker verbinden.“ / „Als Mala durch die Luke an Gleis 11 gehen. Oder Frau Wimmer den Koffer öffnen lassen und die Umschläge ansehen. Dann im Notizbuch verbinden.“

### Sein Name `s4f`

Offen, wenn: `N(G,'s4_name') && !N(G,'s4_bitte') && !F(G,'k4.s.crossed')`

1. **Problem einordnen:** Wir kennen jetzt seinen Namen.
2. **Denkrichtung:** Das muss er hören. In seiner Sprache.
3. **Konkreter Ansatz:** An Gleis 11.
4. **Nächster Schritt:** Den Mann an Gleis 11 mit seinem richtigen Namen ansprechen.

### Peppinos Bitte `s4g`

Offen, wenn: `N(G,'s4_bitte') && !F(G,'k4.s.call')`

1. **Problem einordnen:** Er will, dass Marko für ihn schreibt: „Cara Carmela, sto bene.“
2. **Denkrichtung:** Was hat Carmela ihm all die Jahre geschrieben? Und was wusste sie?
3. **Konkreter Ansatz:** Die Briefe im Koffer, besonders einer von 1979. Frau Wimmer gibt sie nur heraus, wenn sie weiß, dass sie ihm gehören. Mala liest mehr darin als Marko.
4. **Nächster Schritt:** *je nach Stand:* „Frau Wimmer fragen, ob ich den Koffer sehen kann, und die Briefe lesen.“ / „Als Mala in der Bahnhofsmission den Koffer mit den Briefen spüren.“ / „„Carmela, 1979“ und „Eine Frau, die weint“ verbinden.“ / „An Gleis 11 mit Peppino reden: „Ich rufe Carmela an.““

### Was Carmela wusste `s4h`

Offen, wenn: `N(G,'s4_brief79') && N(G,'s4_carmela_hall') && !N(G,'s4_wusste')`

1. **Problem einordnen:** Ein Brief von 1979. Und eine Frau, die beim Schreiben weint.
2. **Denkrichtung:** Was sagt das über Carmela?
3. **Konkreter Ansatz:** Im Notizbuch „Carmela, 1979“ und „Eine Frau, die weint“.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Er kann gehen `s4i`

Offen, wenn: `F(G,'k4.s.call') && !F(G,'k4.s.crossed')`

1. **Problem einordnen:** Carmela hat es die ganze Zeit gewusst. Jetzt kann er gehen.
2. **Denkrichtung:** Hinübergehen kann er nur mit Mala. *(Mala: Ich kann ihn hinüberbringen.)*
3. **Konkreter Ansatz:** An Gleis 11, bei ihm.
4. **Nächster Schritt:** Als Mala Peppino hinüberbringen.

### Sepps Donnerstag `s4j`

Offen, wenn: `G.phase==='k4_d4' && !F(G,'k4.s.farewell')`

1. **Problem einordnen:** Heute ist Donnerstag.
2. **Denkrichtung:** Frau Wimmer richtet einen Abschied aus. Die Stadt will ihn heute von Amts wegen bestatten.
3. **Konkreter Ansatz:** *je nach Stand:* „In der Bahnhofsmission.“ / „Herr Obermaier muss den Termin absagen, unter dem richtigen Namen.“
4. **Nächster Schritt:** *je nach Stand:* „In die Bahnhofsmission gehen.“ / „Bei Herrn Obermaier die Bestattung absagen lassen, dann in die Bahnhofsmission gehen.“

### Drei Uhr `g4a`

Offen, wenn: `P(G,['k4_d2','k4_d3']) && N(G,'g4_gerda') && !N(G,'g4_drei')`

1. **Problem einordnen:** Gerda kommt jeden Tag. Aber wann?
2. **Denkrichtung:** „Bis ich da bin“, sagt sie. Am Nachmittag.
3. **Konkreter Ansatz:** Im Flur am Aufzug kann man warten.
4. **Nächster Schritt:** Im Heim im Flur bis drei warten und zusehen.

### Was macht ihn unruhig? `g4b`

Offen, wenn: `N(G,'g4_drei') && !N(G,'g4_versuch1') && !N(G,'g4_versuch2')`

1. **Problem einordnen:** Um drei: der Gong, Gerda, das „später“, der Kaffee. Was davon macht Alois unruhig?
2. **Denkrichtung:** Zuschauen reicht nicht. Man muss eins weglassen und sehen, was passiert.
3. **Konkreter Ansatz:** Herr Kraus kann den Gong abstellen. Und Mala kann Gerda bitten, woanders zu warten. *(Mala: Kraus kann den Gong abstellen. Und ich kann Gerda bitten, woanders zu warten.)*
4. **Nächster Schritt:** *je nach Stand:* „ Oder als Mala Gerda an das Depot erinnern, damit sie am Fenster wartet.“ / „ Gerda dagegen wartet nur woanders, wenn sie an früher denkt: an die Fotos in Zimmer 214.“ / „Morgen: Herrn Kraus bitten, den Gong abzustellen, und bis drei warten.“ / „k4.g.chimeOff“ / „Bis drei warten: die Uhr im Flur benutzen.“ / „An einem neuen Nachmittag (an der Uhr „Später wiederkommen“) Herrn Kraus bitten, den Gong abzustellen, und bis drei warten.“ / „Herrn Kraus bitten, den Gong abzustellen, und bis drei warten.“

### Der zweite Versuch `g4c`

Offen, wenn: `N(G,'g4_drei') && (N(G,'g4_versuch1')!==N(G,'g4_versuch2'))`

1. **Problem einordnen:** Ein Versuch zeigt nur die Hälfte. Für den zweiten braucht es einen neuen Nachmittag.
2. **Denkrichtung:** Jetzt das andere weglassen. Wer geht und wiederkommt, hat wieder drei Uhr vor sich.
3. **Konkreter Ansatz:** *je nach Stand:* „Diesmal mit Gong. Aber Gerda wartet woanders. Bitten hilft nicht; erinnern schon: wo hat sie früher gewartet?“ / „Diesmal mit Gong. Ich bitte Gerda, am Fenster zu warten. Sie hört nur auf das, was früher war.“ / „Diesmal ohne Gong, und Gerda sitzt bei ihm. Herr Kraus.“
4. **Nächster Schritt:** *je nach Stand:* „An einem neuen Nachmittag (an der Uhr „Später wiederkommen“ oder einmal hinaus und wieder herein) Herrn Kraus bitten, den Gong abzustellen, und bis drei warten.“ / „Nach drei, wenn Herr Lechner im Flur ist: als Mala in Zimmer 214 das Foto am Tor spüren. Dann als Mala Gerda an das Depot erinnern.“ / „Bis drei warten: die Uhr im Flur benutzen.“ / „An einem neuen Nachmittag (an der Uhr „Später wiederkommen“ oder einmal hinaus und wieder herein) als Mala Gerda an das Depot erinnern, dann bis drei warten.“

### Gong und Hand `g4d`

Offen, wenn: `N(G,'g4_versuch1') && N(G,'g4_versuch2') && !N(G,'g4_beides')`

1. **Problem einordnen:** Zwei Versuche, zwei Ergebnisse.
2. **Denkrichtung:** Was hat jeder Versuch gezeigt?
3. **Konkreter Ansatz:** Im Notizbuch beide Versuche.
4. **Nächster Schritt:** Die beiden Versuche verbinden.

### Sein Leben `g4e`

Offen, wenn: `N(G,'g4_drei') && !N(G,'g4_depot') && (N(G,'g4_versuch1') \|\| F(G,'k4.g.blunt'))`

1. **Problem einordnen:** „Tot“ vergisst er. Jeden Tag neu.
2. **Denkrichtung:** Was war sein Leben? Welche Wörter hat er? Und wo hat Gerda auf ihn gewartet?
3. **Konkreter Ansatz:** Die Fotos in seinem Zimmer, Nummer 214. Ansehen allein sagt wenig; Mala kann sie spüren, wenn er nicht im Zimmer ist.
4. **Nächster Schritt:** Nach drei, wenn Herr Lechner im Flur ist: als Mala in Zimmer 214 das Foto am Tor spüren.

### Wie man es ihm sagt `g4f`

Offen, wenn: `N(G,'g4_beides') && N(G,'g4_depot') && !N(G,'g4_worte')`

1. **Problem einordnen:** Der Gong holt ihn, ihre Hand hält ihn. Und auf den Fotos wartet sie am Depot.
2. **Denkrichtung:** Feierabend, Endstation.
3. **Konkreter Ansatz:** Im Notizbuch „Gong und Nähe“ und „Am Depot“.
4. **Nächster Schritt:** Die beiden Notizen verbinden.

### Gerda `g4g`

Offen, wenn: `N(G,'g4_beides') && !F(G,'k4.g.decided')`

1. **Problem einordnen:** Gerda glaubt, sie beruhigt ihn.
2. **Denkrichtung:** Das muss ihr jemand sagen. Jemand, den sie hört. *(Mala: Das muss ihr jemand sagen. Mich hört sie.)*
3. **Konkreter Ansatz:** Mala. *(Mala: Ich.)*
4. **Nächster Schritt:** Als Mala mit Gerda reden.

### Endstation `g4h`

Offen, wenn: `G.phase==='k4_d4' && F(G,'k4.g.decided') && !F(G,'k4.g.thermos') && !I(G,'kanne')`

1. **Problem einordnen:** Gerda geht heute. Alois muss es hören.
2. **Denkrichtung:** In seiner Sprache: Endstation, Feierabend, das Depot.
3. **Konkreter Ansatz:** Um drei, im Flur.
4. **Nächster Schritt:** *je nach Stand:* „In der Zwischenwelt mit Gerda reden und ihr die hohe Stufe hinaufhelfen.“ / „Bis drei warten und Alois in Trambahnersprache sagen, wo Gerda wartet.“

### Die Kanne `g4i`

Offen, wenn: `I(G,'kanne') && !F(G,'k4.g.thermos')`

1. **Problem einordnen:** Gerda hat ihre Kanne hergegeben.
2. **Denkrichtung:** Für wen?
3. **Konkreter Ansatz:** Alois.
4. **Nächster Schritt:** Alois die Kanne geben.

### Ana, 2004 `z4a`

Offen, wenn: `G.phase==='k4_d2' && F(G,'k4.d2.kolar') && !N(G,'z4_ana2004')`

1. **Problem einordnen:** Frau Kolar hat von einer Probe aus München gesprochen.
2. **Denkrichtung:** Ana weiß etwas, das Mama nicht weiß.
3. **Konkreter Ansatz:** In Giesing, bei Ana.
4. **Nächster Schritt:** Zu Ana gehen und sie auf die Probe von Frau Kolar ansprechen.

### Die Probenkarte `z4b`

Offen, wenn: `G.phase==='k4_d3' && no(G) && !F(G,'k4.e.sample2')`

1. **Problem einordnen:** Frau Kolar hat eine Probenkarte geschickt.
2. **Denkrichtung:** Abgeben geht nur bei einer Behörde.
3. **Konkreter Ansatz:** Das Generalkonsulat.
4. **Nächster Schritt:** Im Generalkonsulat die Probe abgeben.

### Ana `z4c`

Offen, wenn: `G.phase==='k4_d5' && !F(G,'k4.d5.ana')`

1. **Problem einordnen:** Mala ist fort. Ana hat geschrieben.
2. **Denkrichtung:** Ana weiß Dinge über Mama, die Marko nicht weiß.
3. **Konkreter Ansatz:** Giesing.
4. **Nächster Schritt:** Zu Ana gehen und mit ihr reden.

### Wo ist Mala? Ein Satz `z4d`

Offen, wenn: `P(G,['k4_d4_n','k4_d5']) && F(G,'k4.r.shared') && !N(G,'z4_zweistaedte')`

1. **Problem einordnen:** *je nach Stand:* „Mala ist an keinem Ort, den man absuchen kann. Sie kommt wieder, wenn Marko etwas zu Ende denkt: Alle in der Familie sagen denselben Satz über Papa.“ / „Alle in der Familie sagen denselben Satz über Papa.“
2. **Denkrichtung:** Hat er für alle dasselbe bedeutet?
3. **Konkreter Ansatz:** Was hat Frau Kolar über die Akten von dreiundneunzig gesagt? Und wie hat Mama die Nachricht gelesen?
4. **Nächster Schritt:** *je nach Stand:* „„Ich kann lesen“ mit dem Suchantrag verbinden.“ / „Die Nachricht vom Roten Kreuz mit dem Satz aus den Akten verbinden.“ / „„In München hieß es vermisst“ mit „In Sarajevo hieß es tot“ verbinden.“

### Silvester `f4a`

Offen, wenn: `G.phase==='k4_fin_a' && !F(G,'k4.fin.gone')`

1. **Problem einordnen:** Silvester bei Ana. Mama ist still.
2. **Denkrichtung:** Jeder feiert anders. Mama sieht oft zur Tür.
3. **Konkreter Ansatz:** Um elf gießen wir Blei. Am Tisch.
4. **Nächster Schritt:** Mit allen reden, wer mag; dann am Tisch Blei gießen (Tisch benutzen).

### Wohin? `f4b`

Offen, wenn: `G.phase==='k4_fin_n' && !F(G,'k4.fin.trail')`

1. **Problem einordnen:** Mama ist gegangen, als die ersten Raketen kamen.
2. **Denkrichtung:** Wo verbringt sie sonst Silvester?
3. **Konkreter Ansatz:** Ana weiß es. Und Mala kann ihrer Spur folgen. *(Mala: Ana weiß es. Und ich kann ihrer Spur folgen.)*
4. **Nächster Schritt:** Als Mala an der Wohnungstür der Spur folgen.

### Zum Heim `f4c`

Offen, wenn: `G.phase==='k4_fin_n' && F(G,'k4.fin.trail') && !/^heim/.test(room(G))`

1. **Problem einordnen:** Mama ist im Heim.
2. **Denkrichtung:** Haus am Bavariapark.
3. **Konkreter Ansatz:** *je nach Stand:* „Mit der Nachttram, zu Fuß oder mit Davor, der es angeboten hat.“ / „Mit der Nachttram oder zu Fuß.“
4. **Nächster Schritt:** Über den Stadtplan zum Haus am Bavariapark fahren.

### Zimmer 214 `f4d`

Offen, wenn: `G.phase==='k4_fin_n' && F(G,'k4.fin.trail') && /^heim/.test(room(G)) && !F(G,'k4.fin.talk')`

1. **Problem einordnen:** Kevin weiß, wo sie ist.
2. **Denkrichtung:** Bei Herrn Lechner.
3. **Konkreter Ansatz:** Zimmer 214, im Flur oben.
4. **Nächster Schritt:** In Zimmer 214 gehen.

### Das Gespräch `f4e`

Offen, wenn: `G.phase==='k4_fin_n' && F(G,'k4.fin.talk') && !F(G,'k4.fin.done')`

1. **Problem einordnen:** Mama sitzt am Fenster.
2. **Denkrichtung:** Wo fängt man an? *(Mala: Fang bei dir an.)*
3. **Konkreter Ansatz:** *je nach Stand:* „Bei dem, was Marko auf der Brücke erzählt hat.“ / „Bei dem Satz, den Ruža geschrieben hat.“ / „Bei dem, was Mama am Busfenster getan hat.“ / „Bei dem, was Frau Kolar gefunden hat.“
4. **Nächster Schritt:** *je nach Stand:* „„Ich war dabei.“ sagen.“ / „„Derselbe Satz, zwei Städte“ wählen.“ / „„Sie hat zurückgesehen“ wählen, wenn Marko es weiß.“ / „Mama sagen, dass sie ihn gefunden haben.“

### Neujahr `e4a`

Offen, wenn: `G.phase==='k4_epi' && !F(G,'k4.e.done')`

1. **Problem einordnen:** Neujahrsmorgen in Mamas Küche.
2. **Denkrichtung:** Zwei Dinge sind heute noch dran: Nada wartet auf ein Wort, und Vesna hält eine Seite frei.
3. **Konkreter Ansatz:** *je nach Stand:* „Mama kann Nada anrufen.“ / „Der Nachruf. Am Küchentisch, mit dem Notizbuch.“ / „Mala wartet am Fenster.“
4. **Nächster Schritt:** *je nach Stand:* „Mit Mama reden: „Nada wartet auch.““ / „Mit Mama reden und den Nachruf schreiben.“ / „Einen Moment warten.“

### Donnerstagabend `x4fight`

Offen, wenn: `G.phase==='k4_d4_n' && !F(G,'k4.d4.fight')`

1. **Problem einordnen:** Zwei Abschiede an einem Tag. Es wird Abend.
2. **Denkrichtung:** Mama ist zu Hause, in der Küche.
3. **Konkreter Ansatz:** Nichts suchen.
4. **Nächster Schritt:** Einen Moment warten: Der Abend beginnt von selbst.

### Die Brücke `x4bridge`

Offen, wenn: `G.phase==='k4_d5_n' && !F(G,'k4.d5.bridge')`

1. **Problem einordnen:** Mala sitzt auf dem Geländer der Hackerbrücke.
2. **Denkrichtung:** Sie ist zurück. Sie wartet, dass Marko etwas sagt. *(Mala: Ich warte, dass du etwas sagst.)*
3. **Konkreter Ansatz:** Hier, auf der Brücke. Nirgendwo sonst hin.
4. **Nächster Schritt:** Einen Moment warten: Das Gespräch beginnt von selbst.

### Der Tag geht zu Ende `x4day`

Offen, wenn: `P(G,['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5']) && !!(M.k4DayReady && M.k4DayReady(G))`

1. **Problem einordnen:** *je nach Stand:* „Hansi hat Feierabend, Mama ist da. Es wird Abend.“ / „Für den Christtag ist alles getan.“ / „Für den Dienstag ist alles getan.“ / „Sepp ist gegangen, Gerda hat sich entschieden. Morgen ist Donnerstag.“ / „Zwei Abschiede. Es wird Abend.“ / „Ein Satz, zwei Städte. Es wird Nacht.“ / „Für heute ist alles getan.“
2. **Denkrichtung:** Der Rest des Tages kommt von selbst.
3. **Konkreter Ansatz:** Nichts mehr suchen.
4. **Nächster Schritt:** Einen Moment warten: Der nächste Abschnitt beginnt von selbst.

## Kapitel 5: Sarajevo (25 Themen)

### Ankunft `h5a`

Offen, wenn: `G.phase==='k5_pro' && !F(G,'k5.p.hajra')`

1. **Problem einordnen:** Mama ist seit fünfzehn Stunden unterwegs. Erst ein Dach über dem Kopf.
2. **Denkrichtung:** Hajra hat eine Pension in Kovači. Dort wohne ich, wenn ich in Sarajevo bin.
3. **Konkreter Ansatz:** Am Busbahnhof wartet ein Taxi.
4. **Nächster Schritt:** Mit dem Taxi nach Kovači fahren.

### Unter Ružas Dach `h5b`

Offen, wenn: `G.phase==='k5_pro' && F(G,'k5.p.hajra') && !N(G,'b5_hand')`

1. **Problem einordnen:** Mama will unter das Dach, das sie achtzehn Jahre bezahlt hat.
2. **Denkrichtung:** Vratnik, Ružas Haus. Hajra hat den Schlüssel gegeben.
3. **Konkreter Ansatz:** Im Garten liegt etwas unter einer Plane. Mala spürt mehr als ich. *(Mala: Im Garten liegt etwas unter der Plane. Ich spüre es.)*
4. **Nächster Schritt:** Zu Mala wechseln und den Garten spüren. Dann als Marko die Plane heben. *(Mala: Ich spüre den Garten. Dann soll er die Plane heben.)*

### Haus 7 `h5c`

Offen, wenn: `G.phase==='k5_pro' && N(G,'b5_hand') && !F(G,'k5.p.nada')`

1. **Problem einordnen:** Mama will Haus 7 sehen. Und Nada wartet im neunten Stock.
2. **Denkrichtung:** Alipašino Polje, die Hochhäuser.
3. **Konkreter Ansatz:** Durch die Eingangshalle die Treppe hinauf. Im siebten Stock bleibt Mama stehen.
4. **Nächster Schritt:** Mit Mama in den siebten Stock, dann allein weiter hinauf zu Nada.

### Nadas Tafel `h5d`

Offen, wenn: `G.phase==='k5_d1' && !N(G,'s5_frist')`

1. **Problem einordnen:** Nada hat für Lanas Grab eine Tafel bestellt.
2. **Denkrichtung:** Bei einem Kupferschmied, der genau graviert, was man ihm sagt.
3. **Konkreter Ansatz:** Nedžad, in der Kazandžiluk.
4. **Nächster Schritt:** Zu Nedžad fahren und nach Nadas Tafel fragen.

### Die Hand `h5e`

Offen, wenn: `G.phase==='k5_d1' && !N(G,'b5_reihe')`

1. **Problem einordnen:** Eine Hand auf meinen Augen, ein nasser Ärmel, Malz.
2. **Denkrichtung:** Malz riecht man an der Brauerei. Dort war es.
3. **Konkreter Ansatz:** An der Brauerei pocht mein Kopf. Mala soll den Hahn spüren. *(Mala: Ich spüre den Hahn an der Brauerei.)*
4. **Nächster Schritt:** Zur Brauerei fahren und als Mala den Hahn spüren. *(Mala: An der Brauerei den Hahn spüren.)*

### Das kalte Fenster `h5f`

Offen, wenn: `G.phase==='k5_n1' && F(G,'k5.n1.home') && !F(G,'k5.n1.atem')`

1. **Problem einordnen:** Es ist spät. In meinem Zimmer bei Hajra ist das Fenster kalt.
2. **Denkrichtung:** Draußen liegt Kovači unter Frost. Ich will hinaussehen.
3. **Konkreter Ansatz:** Das Fenster in meinem Zimmer.
4. **Nächster Schritt:** Im Zimmer das Fenster benutzen.

### Der Mann am Hahn `h5g`

Offen, wenn: `G.phase==='k5_n1' && F(G,'k5.n1.home') && N(G,'b5_reihe') && !N(G,'b5_hamdija')`

1. **Problem einordnen:** Er zeigt sich nicht. Er wartet auf etwas.
2. **Denkrichtung:** „Kanisteri u red!“ Er ordnet Kanister.
3. **Konkreter Ansatz:** *je nach Stand:* „Ich habe Papas blauen Kanister.“ / „Papas blaue Kanister. Einer liegt in Ružas Garten unter der Plane.“
4. **Nächster Schritt:** *je nach Stand:* „Mit dem Kanister nachts zur Brauerei fahren und sich am Hahn anstellen.“ / „In Vratnik den Kanister holen, dann nachts zur Brauerei.“

### Schlafen `h5g2`

Offen, wenn: `G.phase==='k5_n1' && F(G,'k5.n1.atem') && N(G,'b5_hamdija')`

1. **Problem einordnen:** Für heute ist alles getan.
2. **Denkrichtung:** Morgen um neun bei Frau Kolar.
3. **Konkreter Ansatz:** Zurück zu Hajra.
4. **Nächster Schritt:** In der Pension ins Bett gehen.

### Gute Nacht `h5f0`

Offen, wenn: `G.phase==='k5_n1' && F(G,'k5.n1.eve') && !F(G,'k5.n1.home')`

1. **Problem einordnen:** Es ist spät. Ana bringt die Kinder zu Hajra.
2. **Denkrichtung:** Ich schlafe in der Pension, in Kovači.
3. **Konkreter Ansatz:** Nadas Wohnungstür.
4. **Nächster Schritt:** An der Wohnungstür gute Nacht sagen.

### Frau Kolar `h5h`

Offen, wenn: `G.phase==='k5_d2' && !F(G,'k5.d2.inst')`

1. **Problem einordnen:** Um neun bei Frau Kolar.
2. **Denkrichtung:** In der Gerichtsmedizin.
3. **Konkreter Ansatz:** Mama kommt mit. Sie will ihn sehen.
4. **Nächster Schritt:** Mit dem Stadtplan zur Gerichtsmedizin fahren.

### Zwei Namen `h5i`

Offen, wenn: `P(G,['k5_d2','k5_n1']) && N(G,'s5_brett') && !N(G,'s5_beide')`

1. **Problem einordnen:** Nada und Zlata müssen sich einigen. Mala entscheidet nicht für sie, ich auch nicht.
2. **Denkrichtung:** Warum hat jede diesen Namen geschrieben? Das Brett weiß es. Und Nadas Briefe.
3. **Konkreter Ansatz:** Mala soll das Brett im Flur spüren. Und die Mappe in Lanas Zimmer. *(Mala: Ich spüre das Brett. Und Mamas Mappe.)*
4. **Nächster Schritt:** *je nach Stand:* „Als Mala das Brett im Flur spüren.“ / „Als Mala das Brett im Flur spüren.“ / „Als Mala die Mappe in Lanas Zimmer spüren.“ / „Als Mala die Mappe in Lanas Zimmer spüren.“ / „Die beiden Nachhall-Notizen im Notizbuch verbinden.“

### Die Tafel `h5j`

Offen, wenn: `G.phase==='k5_d2' && N(G,'s5_beide') && !F(G,'k5.s.mounted')`

1. **Problem einordnen:** *je nach Stand:* „Sie haben sich geeinigt. Jetzt muss es graviert werden.“ / „Beide haben recht. Jede muss hören, was die andere wollte.“
2. **Denkrichtung:** *je nach Stand:* „Was steht schon auf dem Brett?“ / „Was hat Zlata gewollt, was Nada? Und was steht schon auf dem Brett?“
3. **Konkreter Ansatz:** *je nach Stand:* „Zlata sagen, warum Nada siebzehn Jahre geschrieben hat.“ / „Nada sagen, warum Zlata „Mala“ geschrieben hat.“ / „Was steht schon auf dem Brett, und was hat nur Nada? Das muss ich erst selbst zusammenlegen.“ / „Beiden die zwei Hälften vorschlagen: oben die Tafel, unten das Brett.“ / „Zu Nedžad: Name und Geburt aufs Messing. Der Tod steht schon auf dem Brett.“
4. **Nächster Schritt:** *je nach Stand:* „Im Notizbuch „Damit man sie findet“ und „Zlatas Brett“ verbinden.“ / „Mit Nada und Zlata reden, jeder sagen, was die andere wollte, dann die zwei Hälften vorschlagen.“ / „Bei Nedžad gravieren lassen: „LANA DELIĆ“, „3. 3. 1976“, keine dritte Zeile.“ / „Zurück zu Nada: Vlado montiert Tafel und Brett.“

### Hamdija `h5k`

Offen, wenn: `G.phase==='k5_d2' && N(G,'b5_hamdija') && !F(G,'k5.b.gone')`

1. **Problem einordnen:** *je nach Stand:* „Er lässt mich nicht an den Kasten hinter dem Hahn.“ / „Er glaubt mir nicht, dass ich der Junge bin.“ / „Für ihn ist April 1993. Er weiß nicht, was aus den Gräbern wurde.“ / „k5.b.listKolar“ / „Er muss mich erkennen.“ / „k5.b.listKolar“ / „Die Liste muss zu Frau Kolar.“ / „Er muss hören, was aus den sieben geworden ist.“ / „Er ist bereit zu gehen.“
2. **Denkrichtung:** *je nach Stand:* „Was ist im Kasten?“ / „Was weiß nur der Junge von damals?“ / „Frau Kolar weiß, was aus dem Grab an der Brauerei wurde.“ / „k5.b.listKolar“ / „Die gefüllten Kanister. Und der Rechenschieber.“ / „k5.b.listKolar“ / „Drei Tote haben noch keinen Namen.“ / „Sie sind gefunden. Alle sieben.“ / „Er kann jetzt gehen.“
3. **Konkreter Ansatz:** *je nach Stand:* „Mala geht durch Wände. Auch in einen Blechkasten.“ / „Ich gehe durch den Kasten.“ / „Mala soll den Tag spüren: am Hahn, in der Mitte, an der Brücke.“ / „Ich spüre den Tag: am Hahn, in der Mitte, an der Brücke.“ / „In der Gerichtsmedizin nach dem Grab an der Brauerei fragen.“ / „k5.b.listKolar“ / „Ihm beides sagen: die Kanister und den Rechenschieber.“ / „k5.b.listKolar“ / „Die Liste in die Gerichtsmedizin bringen.“ / „Zu Hamdija an den Hahn.“ / „Mala öffnet die Schwelle. Am Hahn.“ / „Ich mache ihm Licht. Am Hahn.“
4. **Nächster Schritt:** *je nach Stand:* „Als Mala den Kasten hinter dem Hahn ansehen.“ / „Als Mala den Hahn, die Mitte und die Brücke spüren.“ / „Frau Kolar nach dem Grab an der Brauerei fragen.“ / „k5.b.listKolar“ / „Den Blechkasten hinter dem Hahn öffnen.“ / „k5.b.listKolar“ / „Mit Hamdija reden und die Kanister und den Rechenschieber nennen.“ / „k5.b.listKolar“ / „Frau Kolar die Liste geben.“ / „Mit Hamdija reden: Sie sind gefunden.“ / „Als Mala Hamdija hinüberbringen.“

### Lanas Begräbnis `h5fun`

Offen, wenn: `G.phase==='k5_fun' && !F(G,'k5.fun.done')`

1. **Problem einordnen:** Heute wird Lana begraben.
2. **Denkrichtung:** Alle sind gekommen. Nada und Zlata stehen am Pfosten.
3. **Konkreter Ansatz:** Am Grab gibt es nichts zu lösen.
4. **Nächster Schritt:** Eine Wahl am Grab treffen. Beide sind richtig.

### Wem gehören die Fahrscheine? `h5l`

Offen, wenn: `G.phase==='k5_d2_n' && !N(G,'f5_jasna')`

1. **Problem einordnen:** *je nach Stand:* „Nicht Nada. Wem dann?“ / „Mala sagt: für Nada. Stimmt das?“
2. **Denkrichtung:** *je nach Stand:* „Wer war samstags dabei? Und wer kann nicht hinauf?“ / „Wer war samstags dabei? Wer nicht?“
3. **Konkreter Ansatz:** *je nach Stand:* „Nada nach den Samstagen fragen.“ / „„Für Mama. Wer sonst?“ und „Das war euer Samstag“ verbinden.“ / „Was hat Mama an der Treppe im siebten Stock gesagt, bevor Šehić kam?“
4. **Nächster Schritt:** *je nach Stand:* „Im Notizbuch „Wer sonst?“ und „Euer Samstag“ verbinden.“ / „Im Notizbuch „Nicht Nada“ und „Mama kann nicht hinauf“ verbinden.“

### Das Totenmahl `h5l2`

Offen, wenn: `G.phase==='k5_d2_n' && !F(G,'k5.e.meal')`

1. **Problem einordnen:** Alle sitzen an Nadas Tisch.
2. **Denkrichtung:** Zwei Frauen, die achtzehn Jahre nicht miteinander geredet haben.
3. **Konkreter Ansatz:** Mit Mama reden. Und mit Nada.
4. **Nächster Schritt:** Mit Mama und mit Nada reden, bis der Abend weitergeht.

### Bis es hell wird `h5l4`

Offen, wenn: `G.phase==='k5_d2_n' && F(G,'k5.n2.started') && !F(G,'k5.n2.done')`

1. **Problem einordnen:** Die Žuta tabija. Mala hat sich gefragt.
2. **Denkrichtung:** Erst ich. Was will ich? Ehrlich.
3. **Konkreter Ansatz:** „Es gibt kein Falsches. Es gibt nur ‚nur müde‘.“
4. **Nächster Schritt:** Antworten. Jede der drei Antworten ist ehrlich.

### Der Samstag `h5l3`

Offen, wenn: `G.phase==='k5_d2_n' && F(G,'k5.n2.done') && !F(G,'k5.sat.started')`

1. **Problem einordnen:** Es wird hell. Morgen ist heute.
2. **Denkrichtung:** Ab hier gibt es kein Zurück in die Tage davor.
3. **Konkreter Ansatz:** Auf der Bastei, wenn du bereit bist.
4. **Nächster Schritt:** Die Bank auf der Žuta tabija benutzen und den Samstag beginnen.

### Zehn nach elf `h5m`

Offen, wenn: `G.phase==='k5_sat' && !F(G,'k5.sat.tickets')`

1. **Problem einordnen:** Heute ist ihr Samstag.
2. **Denkrichtung:** Wo hat Mama Lana die Tür aufgemacht?
3. **Konkreter Ansatz:** Um elf in den siebten Stock. Šehić sperrt auf.
4. **Nächster Schritt:** Im siebten Stock Mama an der alten Tür Malas Dose geben. Dann nichts mehr tun.

### Nadas Küche `h5n`

Offen, wenn: `G.phase==='k5_sat' && F(G,'k5.sat.knock') && !F(G,'k5.sat.drawn')`

1. **Problem einordnen:** Nada muss es selbst sehen.
2. **Denkrichtung:** Was kann Mala, wenn ich dabei bin? *(Mala: Was kann ich, wenn er dabei ist?)*
3. **Konkreter Ansatz:** Die Balkontür aus Glas. Nada steht in der Küche.
4. **Nächster Schritt:** *je nach Stand:* „Als Marko die Räder zeichnen: die Balkontür benutzen.“ / „Als Marko die Balkontür anhauchen (benutzen).“ / „Als Mala auf die beschlagene Balkontür zeichnen.“

### Hinauf zu Ruža `h5q`

Offen, wenn: `G.phase==='k5_sat' && F(G,'k5.sat.rode') && !F(G,'k5.sat.gate')`

1. **Problem einordnen:** Jeder Samstag hat oben aufgehört. Bei Großmutter, in Vratnik.
2. **Denkrichtung:** Mala will hinauf. Zu Fuß, wie früher.
3. **Konkreter Ansatz:** Die Gasse nach Vratnik, am oberen Ende des Platzes.
4. **Nächster Schritt:** Die Gasse nach Vratnik benutzen.

### Unter Ružas Dach `h5r`

Offen, wenn: `G.phase==='k5_sat' && F(G,'k5.sat.gate') && !F(G,'k5.sat.done')`

1. **Problem einordnen:** Alle sitzen in Ružas Küche. Sechs Tassen.
2. **Denkrichtung:** Mama hat etwas auf dem Herzen. Ich sehe es an ihren Händen.
3. **Konkreter Ansatz:** Mama am Tisch.
4. **Nächster Schritt:** Mit Mama reden.

### Das Wasser `h5o`

Offen, wenn: `G.phase==='k5_epi' && !F(G,'k5.e.water')`

1. **Problem einordnen:** Heute wird Papa begraben. Am Abend sitzen wir unter Ružas Dach.
2. **Denkrichtung:** Kaffee braucht Wasser. Das beste der Stadt kommt aus dem Hahn an der Brauerei.
3. **Konkreter Ansatz:** *je nach Stand:* „Der Kanister ist voll. Er muss nach Vratnik.“ / „Den blauen Kanister am Hahn füllen.“
4. **Nächster Schritt:** *je nach Stand:* „Mit dem vollen Kanister nach Vratnik gehen.“ / „An der Brauerei den Kanister mit dem Hahn benutzen.“

### Die Scheibe `h5p`

Offen, wenn: `G.phase==='k5_epi' && F(G,'k5.e.funeral') && !F(G,'k5.e.done')`

1. **Problem einordnen:** Das Fenster neben dem Tisch ist beschlagen.
2. **Denkrichtung:** Lana hat mir das Zeichnen beigebracht. Die Räder habe ich nie gekonnt.
3. **Konkreter Ansatz:** Das Fenster in Ružas Küche.
4. **Nächster Schritt:** Das Fenster benutzen.

### Der Tag geht weiter `x5day`

Offen, wenn: `P(G,['k5_pro','k5_d1','k5_d2','k5_d2_n','k5_epi','k5_fun','k5_sat']) && !!(M.k5DayReady && M.k5DayReady(G))`

1. **Problem einordnen:** *je nach Stand:* „Mama hat Haus 7 gesehen, Nada weiß, dass wir da sind.“ / „Für den Donnerstag ist alles getan. Es wird Abend.“ / „Hamdija ist gegangen, die Tafel ist fertig. Es ist bald zwei.“ / „Ich weiß, wem die Fahrscheine gehören. Der Abend geht zu Ende.“ / „Das Wasser ist in Ružas Küche. Gleich ist elf.“ / „Das Begräbnis ist vorbei.“ / „Der Samstag ist zu Ende.“ / „Für jetzt ist alles getan.“
2. **Denkrichtung:** Der Rest kommt von selbst.
3. **Konkreter Ansatz:** Nichts mehr suchen.
4. **Nächster Schritt:** Einen Moment warten: Der nächste Abschnitt beginnt von selbst.
