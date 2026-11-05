# MALA – Hinweistexte (Entwicklerübersicht)

Erzeugt mit `node game/tools/hintdoc.js` aus `game/src/15_hints_k1.js` und `game/src/15_hints_k2.js`. Enthält Lösungen.

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
3. **Konkreter Ansatz:** Im Nähkorb liegen Stricknadeln.
4. **Nächster Schritt:** *je nach Stand:* „Den Schuhkarton mit der Stricknadel benutzen, dann öffnen.“ / „Eine Stricknadel aus dem Nähkorb nehmen und den Schuhkarton damit benutzen.“

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

Offen, wenn: `ph(G,['c1','c1_night']) && N(G,'c1_matejuska') && !N(G,'c1_brother')`

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
3. **Konkreter Ansatz:** Mala sieht hinter die Fischkisten an der Matejuška. *(Mala: Ich sehe hinter die Fischkisten an der Matejuška.)*
4. **Nächster Schritt:** Zu Mala wechseln und die Fischkisten ansehen. *(Mala: Zu mir wechseln und die Fischkisten ansehen.)*

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

Offen, wenn: `G.phase==='c2' && N(G,'c2_paper') && !I(G,'note_n')`

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

Offen, wenn: `G.phase==='c2' && F(G,'c2.lukaKnows') && I(G,'note_n') && I(G,'radioT') && !F(G,'c2.tonight')`

1. **Problem einordnen:** Nina muss es hören: den Zettel, die Tickets, das Lied.
2. **Denkrichtung:** Sie will nicht an die Rampe, seit Jahren nicht. Sie kommt nur, wenn sie merkt, dass jemand verstanden hat, worauf sie wartet.
3. **Konkreter Ansatz:** Erst die Ledana, dann ihr eigener Zettel, Lukas Tickets, die Kassette. Und wenn sie zögert, etwas über ihr Warten: was Mira gesehen hat, oder was ihre Bilder zeigen.
4. **Nächster Schritt:** Mit Nina reden: „Ich war in der Ledana“, ihr Zettel, die Tickets, die Kassette, „Wollen Sie es hören?“, und dann nach ihrem Warten fragen.

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
4. **Nächster Schritt:** *je nach Stand:* „Bruno das Tanzfoto zeigen.“ / „Das Tanzfoto von der Wand in der Halle nehmen und Bruno zeigen.“ / „Erst Bruno mit Musik in den Salon holen.“ / „Bruno im Salon die Klavierschule zeigen.“ / „Im Salon das Tuch vom Flügel nehmen, die Klavierschule nehmen und Bruno zeigen.“ / „Bruno den Umschlag aus Zagreb zeigen.“ / „Den Klavierhocker mit dem Schlüsselring öffnen und Bruno den Umschlag zeigen.“

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

## Kapitel 2: Sarajevo (51 Themen)

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
3. **Konkreter Ansatz:** Lejla auf der Terrasse der Kafana kennt die Kula.
4. **Nächster Schritt:** Lejla nach Tomažs Zettel fragen, dem „Wenn die Kula sieben schlägt“, und hören, was sie über die Mondzeit sagt.

### Sieben nach der Kula, aber wann genau? `s1b`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_twosevens') && !N(G,'s1_2316')`

1. **Problem einordnen:** Die Kula zählt ab Sonnenuntergang. Ohne den Sonnenuntergang an jenem Tag bleibt „sieben“ ungenau.
2. **Denkrichtung:** Zwei Dinge fehlen: das genaue Datum und ein Kalender, der den Sonnenuntergang für dieses Datum nennt.
3. **Konkreter Ansatz:** Das Datum steht in einem Auftragsbuch in der Čaršija. Alte Kalender, auch Takvime, hat das Antiquariat an der Ferhadija.
4. **Nächster Schritt:** Mit dem Datum aus Nedžads Auftragsbuch den Takvim von 1972 bei Jakob lesen, dann beides im Notizbuch verbinden.

### Woher stammt das Armband? `s1c`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_bracelet') && !N(G,'s1_date')`

1. **Problem einordnen:** Tomaž trägt ein graviertes Armband aus der Čaršija. Wer hat es graviert, und wann?
2. **Denkrichtung:** Graveure führen Bücher über ihre Aufträge. Die alten Werkstätten sind in einer Gasse.
3. **Konkreter Ansatz:** In Kazandžiluk graviert die Familie Kazandžić seit hundert Jahren. Nedžad hat die alten Bücher, aber keine Zeit.
4. **Nächster Schritt:** Nedžad bei seiner deutschen Gravur helfen. Dann schlägt er das Buch auf.

### Was war an jenem Abend? `s1d`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_left')`

1. **Problem einordnen:** Jemand muss an jenem Abend in der Kafana gewesen sein.
2. **Denkrichtung:** Zwei Seiten fehlen: was die Kafana damals erlebt hat, und was Tomaž selbst von seiner Nacht weiß.
3. **Konkreter Ansatz:** Šaćir am Fenstertisch war damals Kellner. Tomaž erinnert sich an seinen Zapfenstreich.
4. **Nächster Schritt:** Šaćir nach dem Soldaten fragen, Tomaž nach seiner Nacht, und dann im Notizbuch verbinden, wann die Kafana zumachte und wann er zurück musste.

### Emina schweigt `s1e`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_waited')`

1. **Problem einordnen:** Emina will über 1972 nicht reden. Nicht mit einem Fremden.
2. **Denkrichtung:** Mit jemandem aus der Familie redet sie anders. Und zuhören kann auch, wen sie nicht sieht.
3. **Konkreter Ansatz:** Emina spricht mit ihrer Enkelin hinter der Theke. Mala kann dort unbemerkt stehen. *(Mala: Emina spricht mit ihrer Enkelin hinter der Theke. Dort kann ich stehen, ohne dass sie mich sieht.)*
4. **Nächster Schritt:** Zu Mala wechseln und hinter der Theke lauschen. *(Mala: Zu mir wechseln und hinter der Theke lauschen.)*

### Wo sind die Briefe? `s1f`

Offen, wenn: `ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_nowrite') && !I(G,'letters_tz') && !F(G,'k2.s1.tin')`

1. **Problem einordnen:** Emina fragt, warum er nie geschrieben hat. Vielleicht hat er geschrieben.
2. **Denkrichtung:** Briefe gehen durch Hände. Wer hat damals etwas angenommen und weitergegeben?
3. **Konkreter Ansatz:** Šaćir hat etwas weitergegeben. Mala sieht in der verschlossenen Kammer, wohin. Hinein geht es erst, wenn Emina nicht da ist. *(Mala: Šaćir hat etwas weitergegeben. Ich sehe in der verschlossenen Kammer nach, wohin. Hinein geht es erst, wenn Emina nicht da ist.)*
4. **Nächster Schritt:** *je nach Stand:* „Lejla helfen, damit Emina geht. Dann in die Kammer, und am Spiegel das Stemmeisen ansetzen.“ / „Lejla helfen, damit Emina geht. Dann in die Kammer. Am Spiegel hilft ein Stemmeisen: Nedžad leiht seines aus.“

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
4. **Nächster Schritt:** Rade das Foto zeigen.

### Die leuchtende Uhr `m1b`

Offen, wenn: `N(G,'m2_f_clock') && !N(G,'m2_building')`

1. **Problem einordnen:** Mala erinnert sich an eine Uhr mit leuchtenden Ziffern. *(Mala: Ich erinnere mich an eine Uhr mit leuchtenden Ziffern.)*
2. **Denkrichtung:** Eine Erinnerung und ein Foto. Passen sie zusammen?
3. **Konkreter Ansatz:** Rade weiß, welches Hochhaus eine Uhr hatte.
4. **Nächster Schritt:** Im Notizbuch Malas Splitter mit dem verbinden, was Rade über das Siebener sagt. *(Mala: Im Notizbuch meinen Splitter mit dem verbinden, was Rade über das Siebener sagt.)*

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
4. **Nächster Schritt:** Im Notizbuch den Fahrschein mit dem verbinden, was Rade über November dreiundneunzig sagt.

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

1. **Problem einordnen:** Wer war Leser 2204?
2. **Denkrichtung:** Woher kam das Buch in den Laden?
3. **Konkreter Ansatz:** Jakob schreibt in sein Ankaufbuch, von wem er kauft.
4. **Nächster Schritt:** Im Notizbuch den Leihzettel mit dem Eintrag im Ankaufbuch verbinden.

### Warum gab er es nie zurück? `s2c`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_due') && !N(G,'s2_noreturn')`

1. **Problem einordnen:** Für ihn läuft die Frist ab. Seit Jahren.
2. **Denkrichtung:** Was ist im August 1992 mit der Bibliothek geschehen?
3. **Konkreter Ansatz:** Jakob erzählt es, wenn man ihn nach der Bibliothek fragt.
4. **Nächster Schritt:** Im Notizbuch die Frist mit dem Brand verbinden.

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
4. **Nächster Schritt:** Bei Jakob die Tafel mit der Kurrentschrift holen und der Restauratorin damit helfen.

### Das Buch zurückgeben `s2f`

Offen, wenn: `ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_fragments') && N(G,'s2_provenance') && !F(G,'k2.s2.free')`

1. **Problem einordnen:** Das Buch muss dorthin, wo es ausgeliehen wurde.
2. **Denkrichtung:** Jakob gibt es nur her, wenn er weiß, wem es gehört und warum.
3. **Konkreter Ansatz:** *je nach Stand:* „Mit dem Passierschein geht es abends in die Vijećnica, zur alten Ausleihe.“ / „Abends geht es nur mit einem Passierschein in die Vijećnica.“
4. **Nächster Schritt:** Das Buch in der Vijećnica auf die Ausleihtheke legen.

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
4. **Nächster Schritt:** Im Notizbuch das Register aus Split mit dem Hausbuch verbinden.

### In den Schutzraum `s3b`

Offen, wenn: `ph(G,['k2_s3']) && !I(G,'key_shelter') && !F(G,'k2.s3.inShelter')`

1. **Problem einordnen:** Šehić gibt den Schlüssel nicht her.
2. **Denkrichtung:** Was bewegt ihn? Er redet, wenn er sich allein glaubt.
3. **Konkreter Ansatz:** Mala kann an seiner Tür lauschen. *(Mala: Ich kann an seiner Tür lauschen.)*
4. **Nächster Schritt:** Mit Šehić vorsichtig über das reden, was an seiner Tür zu hören war.

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
3. **Konkreter Ansatz:** Mirza hat Dinge aus der Schule aufgehoben. Sie liegen im Schutzraum.
4. **Nächster Schritt:** Den Stempel im Schutzraum auf die Zeugnisse drücken.

### Wer kommt zur letzten Stunde? `s3e`

Offen, wenn: `ph(G,['k2_s3']) && N(G,'s3_register') && !(F(G,'k2.s3.mirza') && F(G,'k2.s3.selma') && F(G,'k2.s3.damir'))`

1. **Problem einordnen:** Zora will, dass alle da sind. Drei aus dem Klassenbuch leben noch hier.
2. **Denkrichtung:** Mirza, Selma und Damir. Jeder braucht einen anderen Grund, zu kommen.
3. **Konkreter Ansatz:** *je nach Stand:* „Mirza muss erfahren, was Zora über ihn geschrieben hat“ / „Selma braucht eine Hand“ / „Damir braucht seine eigene Zeichnung“
4. **Nächster Schritt:** *je nach Stand:* „Mirza zeigen, was im Klassenbuch über ihn steht“ / „Selma Hilfe anbieten“ / „Damir seine Zeichnung geben“

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
3. **Konkreter Ansatz:** Das ganze Foto zeigt, wer das ist.
4. **Nächster Schritt:** Nada das ganze Foto zeigen.

### Großmutters Haus `f4`

Offen, wenn: `G.phase==='k2_fin' && N(G,'f2_postcard') && !N(G,'f2_rcm')`

1. **Problem einordnen:** Lana wollte jemanden holen. Damals war das Ziel Großmutters Haus in Vratnik.
2. **Denkrichtung:** *je nach Stand:* „Der Schlüssel zu Großmutters Haus ist da. In der Küche ist etwas zu spüren.“ / „Wer hat einen Schlüssel zu Großmutters Haus? Jemand, der dreißig Jahre gegenüber wohnte.“
3. **Konkreter Ansatz:** *je nach Stand:* „Das Wärmefach am Herd klemmt. Es braucht einen Hebel.“ / „Hajra hat den Schlüssel.“
4. **Nächster Schritt:** *je nach Stand:* „Hajra nach Großmutters Haus fragen.“ / „Das Wärmefach mit dem Stemmeisen öffnen.“ / „Nedžads Stemmeisen holen. Wer es zurückgegeben hat, leiht es noch einmal. Dann das Wärmefach öffnen.“

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
4. **Nächster Schritt:** Mala um ihren Fahrschein bitten und in der Drei beide am Entwerter entwerten. *(Mala: Mich um meinen Fahrschein bitten und in der Drei beide am Entwerter entwerten.)*

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
