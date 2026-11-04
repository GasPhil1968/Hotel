/* Bosnisch/Kroatisch – Kapitel 1, neuer Einstieg (Soloauftakt am Dienstag, Kennenlernen, Morgen nach Ivka):
   rooms/riva.js, rooms/varos.js, rooms/ivka.js, rooms/office.js, 90_story.js, 92_story2.js, 11_notes.js, 10_items.js
   Marko: Standardkroatisch; mit Mala Bosnisch ({ hr, bs }, wo sich beide Fassungen unterscheiden). Mala: Sarajevo-Bosnisch.
   Zdenka: Čakavisch (gut lesbar), duzt Marko wie bisher. Vesna: Standard. Erzähler, Notizbuch, Gegenstände: Standardkroatisch.
   Ivkas Strickheft „Za Božić 2011.“ ist schon kroatisch (auf sich selbst); Markos Wiedergabe fasst es zusammen, statt es zu übersetzen. */
(function(M){ 'use strict'; if (!M.trAdd) return;
M.trAdd('bhs', {
  // ---------------------------------------------------------------- rooms/riva.js
  'Der Boden kippt. Nicht der Wind. Der Boden.': 'Tlo se naginje. Nije to vjetar. Tlo.',   // Marko (allein)
  'Ich halte mich an einem Poller fest wie einer, der zu viel getrunken hat.': 'Držim se za bitvu kao netko tko je previše popio.',   // Marko (allein)
  'Vorbei.': 'Prošlo je.',   // Marko (allein)
  'Hier hat sie jeden Abend gestanden. Siebenundzwanzig Jahre. Mir reichen zehn Sekunden.': 'Ovdje je stajala svake večeri. Dvadeset i sedam godina. Meni je dosta deset sekundi.',   // Marko (allein)
  'Nach Hause. Schreiben, solange ich noch weiß, wo oben ist.': 'Kući. Pisati, dok još znam gdje je gore.',   // Marko (allein)
  'Am letzten Poller. Genau da, wo mir gestern der Boden weggekippt ist.': 'Kod zadnje bitve. Točno ondje gdje mi se jučer tlo izmaknulo pod nogama.',   // Marko (für sich, bevor Mala spricht)
  '„Eine alte Frau. Sie friert nur nicht.“': '„Starica. Samo joj nije hladno.“',   // Marko an Mala (Option)
  '(Nicht hinsehen.)': '(Ne gledati.)',   // Option (still)
  '„Seit wann steht sie da?“': '„Otkad ona tu stoji?“',   // Marko an Mala (Option)
  'Sie friert nicht, weil ihr nicht mehr kalt sein kann.': 'Nije joj hladno jer joj više ne može biti hladno.',   // Mala
  'Das sagst du.': 'To ti kažeš.',   // Marko an Mala
  'Ich sehe aufs Wasser. Das Wasser ist wenigstens nass.': 'Gledam u vodu. Voda je barem mokra.',   // Marko (hr = bs)
  'Du kannst so tun, als wäre sie nicht da. Das können die meisten gut.': 'Možeš se praviti da je nema. To većini baš dobro ide.',   // Mala
  'Jeden Abend. Seit einer Woche schon, glaube ich. Und vorher auch.': 'Svako veče. Već sedmicu dana, mislim. A i prije toga.',   // Mala
  'Ich glaube, sie weiß nicht, dass sie es nicht mehr muss.': 'Mislim da ne zna da više ne mora.',   // Mala
  'Eine alte Frau, die nicht friert. Dafür gibt es Erklärungen. Gute Mäntel zum Beispiel.': 'Starica kojoj nije hladno. Za to postoje objašnjenja. Dobar kaput, na primjer.',   // Marko (hr = bs)
  'Ich will nach Hause.': 'Hoću kući.',   // Marko an Mala (hr = bs)
  'Die Riva entlang, die Gasse hinauf, drei Stockwerke. Mala geht neben ihm. Ihre Schritte hört man nicht.': 'Duž Rive, uličicom gore, tri kata. Mala hoda pokraj njega. Njezini se koraci ne čuju.',   // Erzähler
  'Die Bank an der Riva, am Morgen. Die Fähre nach Supetar legt ab, voller Leute, die zur Arbeit fahren.': 'Klupa na Rivi, ujutro. Trajekt za Supetar isplovljava, pun ljudi koji idu na posao.',   // Erzähler
  'Heute Nacht hast du hier geraucht.': 'Noćas si ovdje pušio.',   // Mala
  'Heute Morgen nicht.': 'Jutros ne.',   // Marko an Mala
  'Das ist neu.': 'To je novo.',   // Mala
  'Ich war an einem Ort, den es nicht gibt. Ich habe einer alten Frau Handschuhe gegeben, die sie nicht halten konnte. Und dort konnte sie es.': 'Bio sam na mjestu kojeg nema. Dao sam jednoj starici rukavice koje nije mogla držati. A tamo je mogla.',   // Marko an Mala (hr = bs)
  'Und heute Morgen habe ich versucht, einen Traum daraus zu machen.': 'A jutros sam pokušao od toga napraviti san.',   // Marko an Mala (hr = bs)
  'Hat es geklappt?': 'Je li upalilo?',   // Mala
  'Bis zum Kaffee.': { hr:'Do kave.', bs:'Do kahve.' },   // Marko an Mala
  'Hörst du das? Die Fähre nach Supetar.': 'Čuješ li? Trajekt za Supetar.',   // Mala
  'Ich höre sie jeden Morgen.': 'Čujem ga svako jutro.',   // Marko an Mala (hr = bs)
  'Bist du so weit?': 'Jesi li spreman?',   // Mala
  '„Ich weiß immer noch nicht, was du bist. Aber ich höre auf, so zu tun, als wärst du nicht da.“': { hr:'„Još uvijek ne znam što si. Ali prestajem se praviti da te nema.“', bs:'„Još uvijek ne znam šta si. Ali prestajem se praviti da te nema.“' },   // Marko an Mala (Option)
  '„Gib mir noch einen Tag.“': '„Daj mi još jedan dan.“',   // Marko an Mala (Option)
  'Einen Tag hattest du. Heute Morgen.': 'Jedan dan si već imao. Jutros.',   // Mala
  'Gut. Ich sitze hier, wenn du so weit bist.': 'Dobro. Ja sjedim ovdje, pa kad budeš spreman.',   // Mala
  'Das reicht mir.': 'Meni je to dovoljno.',   // Mala
  'Dann hören wir uns an, was die Stadt über ihn weiß. Die Stadt redet in der „Bura“.': { hr:'Onda da čujemo što grad zna o njemu. Grad priča u „Buri“.', bs:'Onda hajde da čujemo šta grad zna o njemu. Grad priča u „Buri“.' },   // Marko an Mala
  'Die Bank, auf der ich heute Nacht gesessen habe. Im Morgenlicht sieht sie aus wie jede andere Bank.': 'Klupa na kojoj sam noćas sjedio. Na jutarnjem svjetlu izgleda kao svaka druga klupa.',   // Marko
  'Gleich. Erst will ich wissen, ob ich mir das alles nur einrede.': 'Samo malo. Prvo hoću znati umišljam li sve to.',   // Marko (hr = bs)
  'Hier habe ich heute Nacht gesessen. Und geraucht. Allein, wie es aussieht.': 'Ovdje sam noćas sjedio. I pušio. Sam, po svemu sudeći.',   // Marko (allein)
  'Am Ende der Mole: niemand.': 'Na kraju mola: nikoga.',   // Marko
  'Niemand. Diesmal, weil sie gegangen ist.': 'Nikoga. Ovaj put zato što je otišla.',   // Marko
  'Natürlich niemand. Da hat nie jemand gestanden.': 'Naravno da nikoga. Ondje nikad nitko nije stajao.',   // Marko (allein)
  'Ein Poller. Eisen, Rost, ein nasses Tau. Am Dienstag war mir hier schwindlig. Mehr war da nicht.': 'Bitva. Željezo, hrđa, mokar konop. U utorak mi se ovdje zavrtjelo. Ništa više od toga.',   // Marko
  'Ein Poller. Eisen, Rost, ein nasses Tau. Mehr ist da nicht.': 'Bitva. Željezo, hrđa, mokar konop. Ništa više.',   // Marko
  'Die Riva in der Dämmerung, im Regen. Um diese Zeit gehen alle nach Hause. Ich gehe zur Mole.': 'Riva u sumrak, po kiši. U ovo doba svi idu kući. Ja idem na mol.',   // Marko
  'Die Riva am Morgen. Die Bura hat sie leergefegt. Die Palmen rascheln wie Zeitungspapier.': 'Riva ujutro. Bura ju je ispraznila. Palme šuškaju kao novinski papir.',   // Marko
  // ---------------------------------------------------------------- rooms/varos.js
  'In ihrem Heft stehen Namen aus der Gasse. Kennen Sie die Leute?': 'U njezinoj bilježnici su imena iz ove ulice. Poznajete li te ljude?',   // Marko an Zdenka (Option)
  'Hier ist Ihr Schlüssel.': 'Evo vam ključ.',   // Marko an Zdenka (Option)
  'Keine Kontakte? Wer schreibt so etwas? Die Stadt. Die Stadt war nie hier oben.': 'Bez kontakata? Ko to piše? Grad. Grad nikad ni bija ovdi gore.',   // Zdenka (askOpt)
  'Socken, Mützen, Schals. Jeden Winter. Fragen Sie in der Gasse.': 'Bičve, kape, šalovi. Svaku zimu. Pitaj po ulici.',   // Zdenka (askOpt)
  'Ihr Heft. Das hat sie jedes Jahr ab Oktober geführt. Mit Häkchen, wenn etwas fertig war.': 'Njena teka. Vodila ju je svake godine od oktobra. Kad bi nešto dovršila, uvik bi stavila kvačicu.',   // Zdenka (askOpt)
  'Das habe ich doch gesagt.': 'Pa rekla san ti.',   // Zdenka (askOpt)
  'Das habe ich Ihnen doch gesagt. Fragen Sie in der Gasse.': 'Pa rekla san ti već. Pitaj po ulici.',   // Zdenka
  'Zeigen Sie. Ich meine: Sagen Sie.': 'Daj da vidin. Mislin: reci mi.',   // Zdenka
  'Ante, ein Stockwerk tiefer. Ihre Enkelinnen. Don Petar. Und eine Decke für Mrki.': 'Ante, kat niže. Vaše unuke. Don Petar. I dekica za Mrkoga.',   // Marko an Zdenka
  'Ante trägt die blaue Mütze auch im Sommer. Seine Mutter hat es aufgegeben.': 'Ante nosi plavu kapu i priko lita. Mater mu je digla ruke.',   // Zdenka
  'Meine Enkelinnen, dreißig und zweiunddreißig, das stimmt. Die Kleine wächst zu schnell.': 'Moje unuke, broj trideset i trideset dva, tako je. Ona manja raste ka iz vode.',   // Zdenka
  'Don Petar gibt die Socken an die Armen von Sveti Nikola. Jeden Winter zehn Paar.': 'Don Petar daje bičve sirotinji kod Svetoga Nikole. Svaku zimu deset pari.',   // Zdenka
  'Und für den Kater hat sie gestrickt. Für sich selbst nie.': 'I za mačka je plela. A za sebe nikad.',   // Zdenka
  'Die Stadt schreibt: keine Kontakte.': 'Grad piše: bez kontakata.',   // Marko an Zdenka
  'Die Stadt.': 'Grad.',   // Zdenka
  'Fragen Sie in der Gasse, wer nichts von ihr trägt. Da müssen Sie lange fragen.': 'Pitaj po ulici ko ne nosi ništa njeno. Dugo ćeš pitat.',   // Zdenka
  'Einen Moment noch.': 'Samo trenutak.',   // Marko
  'Die Stadt schreibt: keine Kontakte. In ihrem Korb liegt ein Heft voller Namen. Beides kann nicht stimmen.': 'Grad piše: bez kontakata. A u njezinoj košarici leži bilježnica puna imena. Oboje ne može biti točno.',   // Marko
  'Eine Frage habe ich noch. Dann gebe ich ihn zurück.': 'Imam još jedno pitanje. Onda vam ga vraćam.',   // Marko an Zdenka
  'Bevor ich schreibe, will ich die Stelle sehen, an der sie jeden Abend stand. Unten an der Riva, am Ende der Mole.': 'Prije nego što počnem pisati, hoću vidjeti mjesto na kojem je stajala svake večeri. Dolje na Rivi, na kraju mola.',   // Marko
  'Und die Mützen. Das stimmt. Das hat sonst niemand gewusst.': 'I kape. Tako je. To nitko drugi ni zna.',   // Zdenka
  'Fast.': 'Skoro.',   // Marko an Zdenka
  'Ein Heft voller Namen. Und die Stadt schreibt: keine Kontakte.': 'Bilježnica puna imena. A Grad piše: bez kontakata.',   // Marko
  // ---------------------------------------------------------------- rooms/ivka.js
  'Bis jetzt erzählt hier alles vom Warten. Sie hat auch gelebt. Irgendwo muss das stehen.': 'Zasad ovdje sve govori o čekanju. A ona je i živjela. To negdje mora pisati.',   // Marko
  'Stricknadeln, graue Wolle und ein halber Pullover in Männergröße. Darunter ein Schulheft, die Ecken weich vom Umblättern.': 'Igle za pletenje, siva vuna i pola muškog džempera. Ispod toga školska bilježnica, uglova omekšalih od listanja.',   // Marko
  'Für einen Moment riecht es nach Fritule. Nach heißem Öl und Zitronenschale. In einer Wohnung, in der seit einer Woche niemand gekocht hat.': 'Na trenutak zamiriše na fritule. Na vruće ulje i limunovu koricu. U stanu u kojem već tjedan dana nitko nije kuhao.',   // Marko
  'Mir wird schlecht. Das ist der Lavendel. Oder der Geruch, den es nicht gibt.': 'Muka mi je. Od lavande je. Ili od mirisa kojeg nema.',   // Marko
  'Stricknadeln, Wolle. Und ein Heft, das mich nichts angeht.': 'Igle za pletenje, vuna. I bilježnica koja se mene ne tiče.',   // Marko
  'Za Božić 2011.': 'Za Božić 2011.',   // Dokument (Titel, schon kroatisch)
  'Ante (kat ispod) – kapa, plava  ✓': 'Ante (kat ispod) – kapa, plava  ✓',   // Dokument (schon kroatisch)
  'Zdenkine unuke – čarape, 30 i 32  ✓': 'Zdenkine unuke – čarape, 30 i 32  ✓',   // Dokument (schon kroatisch)
  'gđa Marija, pekara – šal': 'gđa Marija, pekara – šal',   // Dokument (schon kroatisch)
  'don Petar – čarape za siromašne, 10 pari (6 ✓)': 'don Petar – čarape za siromašne, 10 pari (6 ✓)',   // Dokument (schon kroatisch)
  'Mrki – dekica za košaru, od ostataka  ✓': 'Mrki – dekica za košaru, od ostataka  ✓',   // Dokument (schon kroatisch)
  'zbor sv. Nikole – 4 šala': 'zbor sv. Nikole – 4 šala',   // Dokument (schon kroatisch)
  '„Für Weihnachten 2011.“ Ante, ein Stockwerk tiefer: eine blaue Mütze. Zdenkas Enkelinnen: Socken, Größe dreißig und zweiunddreißig.': 'Božićni popis: u svakom retku netko iz susjedstva i ono što mu je plela.',   // Marko (fasst das kroatische Heft zusammen, statt es zu übersetzen)
  'Frau Marija von der Bäckerei: ein Schal. Don Petar: zehn Paar Socken für die Armen, sechs sind fertig. Eine Decke für Mrki, aus Resten. Vier Schals für den Chor.': 'Uz gotove stvari stoji kvačica, a šalovi i četiri para čarapa još čekaju.',   // Marko (fasst zusammen)
  'Sie hat für dieses Weihnachten gestrickt. Für eines, das sie nicht mehr erlebt.': 'Plela je za ovaj Božić. Za Božić koji više neće dočekati.',   // Marko
  'Ich schreibe die Namen ab. Das Heft lege ich zurück unter die Wolle, wo sie es hingelegt hat.': 'Prepisujem imena. Bilježnicu vraćam pod vunu, gdje ju je i ostavila.',   // Marko
  // ---------------------------------------------------------------- rooms/office.js
  '(Leise:) „Nicht hier. Er hört uns.“': '(Tiho:) „Ne ovdje. Čuje nas.“',   // Marko an Mala (Option)
  'Er hört nur sein Kreuzworträtsel. Sag es, wenn du willst.': 'On čuje samo svoju ukrštenicu. Reci kad hoćeš.',   // Mala
  'Ich warte. Sag es, wenn du willst.': 'Čekam. Reci kad hoćeš.',   // Mala
  'Bei vierundachtzig?': 'Kod osamdeset četvrte?',   // Mala
  // ---------------------------------------------------------------- 90_story.js
  'Zwischenspiel – Ein gewöhnlicher Morgen': 'Međuigra – Obično jutro',   // Titel
  'Zwischenspiel, Morgen': 'Međuigra, jutro',   // Kurztitel
  'Donnerstag, 17. November · Morgen': 'Četvrtak, 17. studenoga · jutro',   // Zeit (auch Karte in flat.js)
  'Seite einunddreißig von achtundvierzig. Eine Espressomaschine aus Mailand, die man in Graz verkaufen will. Auf Deutsch.': 'Trideset i prva stranica od četrdeset i osam. Aparat za espresso iz Milana, koji žele prodavati u Grazu. Na njemački.',   // Marko
  'Aufstehen. Langsam. Der Boden ist heute weich wie ein Bootsdeck.': 'Ustati. Polako. Pod se danas ljulja kao paluba.',   // Marko
  '„Das mit den Mützen hat mir gefallen. Die Stadt hatte „keine Kontakte“ geschrieben. Gut, dass du gefragt hast.“': '„Ono s kapama mi se svidjelo. Grad je napisao „bez kontakata“. Dobro da si pitao.“',   // Vesna (Telefon)
  // ---------------------------------------------------------------- 92_story2.js
  'Donnerstag, 17. November · Mittag, Bura': 'Četvrtak, 17. studenoga · podne, bura',   // Zeit (Karte)
  'Sanja wartet auf mich. Um vier ruft Triest an, und sie hat niemanden, der Italienisch kann. Ich habe es ihr versprochen.': 'Sanja me čeka. U četiri zove Trst, a ona nema nikoga tko zna talijanski. Obećao sam joj.',   // Marko
  'Nach Hause? Nicht, bevor ich die Stelle gesehen habe, an der sie jeden Abend stand. Sonst schreibe ich über eine Frau, die ich nur aus einem Heft kenne.': 'Kući? Ne prije nego što vidim mjesto gdje je stajala svake večeri. Inače pišem o ženi koju znam samo iz jedne bilježnice.',   // Marko
  'Heute nicht mehr.': 'Danas više ne.',   // Marko
  'Nicht jetzt. Nicht, bevor ich weiß, ob ich mir das alles nur einrede.': 'Ne sad. Ne dok ne saznam umišljam li sve to.',   // Marko
  'Heute Morgen nicht. Ohne Kaffee komme ich nicht weit.': 'Ne jutros. Bez kave neću daleko.',   // Marko (allein)
  '(Leise:) „Dann sieh nach.“': '(Tiho:) „Onda pogledaj.“',   // Marko an Mala (Option; auch office.js)
  // ---------------------------------------------------------------- 11_notes.js
  'Vesna, aus der Notiz der Stadt: „alleinstehend, keine Kontakte zur Nachbarschaft.“': 'Vesna, iz službene bilješke Grada: „živjela sama, bez kontakata sa susjedstvom.“',   // Notiz
  'Laut Stadt: keine Kontakte.': 'Prema Gradu: bez kontakata.',   // Notiz (kurz)
  'Zdenka: Ivka hat für die halbe Gasse gestrickt, Socken, Mützen, alles. Nur für sich nie.': 'Zdenka: Ivka je plela za pola ulice: čarape, kape, sve. Samo za sebe nikad.',   // Notiz
  'Ivkas Strickheft „Za Božić 2011.“: eine Mütze für Ante, Socken für Zdenkas Enkelinnen, ein Schal, Socken für die Armen von Sv. Nikola, eine Decke für den Kater, Schals für den Chor.': 'Ivkina bilježnica za pletenje, „Za Božić 2011.“: kapa za Antu, čarape za Zdenkine unuke, šal, čarape za siromašne kod Sv. Nikole, dekica za mačka, šalovi za zbor.',   // Notiz
  'Ivkas Strickheft.': 'Ivkina bilježnica za pletenje.',   // Notiz (kurz)
  'Keine Familie heißt nicht: niemand. Ivka hatte keine Angehörigen mehr – aber eine ganze Gasse, für die sie strickte.': 'Bez obitelji ne znači: bez ikoga. Ivka više nije imala rodbine – ali imala je cijelu ulicu za koju je plela.',   // Notiz (Schluss)
  'Keine Familie heißt nicht: niemand.': 'Bez obitelji ne znači: bez ikoga.',   // Notiz (kurz)
  'Zdenka: „Fragen Sie in der Gasse, wer nichts von ihr trägt. Da müssen Sie lange fragen.“': 'Zdenka: „Pitaj po ulici tko ne nosi ništa njezino. Dugo ćeš pitati.“',   // Notiz (Zdenka duzt Marko)
  'Seite 31: „Warten, bis die Leuchte erlischt.“ Welche? Die Maschine hat zwei. Die Zeichnung auf Seite 12 fehlt.': 'Stranica 31: „Pričekati da se lampica ugasi.“ Koja? Aparat ima dvije. Crtež sa stranice 12 nedostaje.',   // Notiz
  'S. 31: Welche Leuchte?': 'Str. 31: Koja lampica?',   // Notiz (kurz, auch Kurztitel)
  'Seite 30: Die rote Leuchte (5) zeigt den Druck im Kessel, die grüne (6) heißt: betriebsbereit.': 'Stranica 30: Crvena lampica (5) pokazuje tlak u kotlu, zelena (6) znači: spreman za rad.',   // Notiz
  'S. 30: Rot heißt Druck.': 'Str. 30: Crvena znači tlak.',   // Notiz (kurz)
  'Nachts, in der Scheibe: ein Mädchen hinter mir. Dann mein Name.': 'Noću, u prozorskom staklu: djevojka iza mene. Onda moje ime.',   // Notiz
  'Mala fragte nach meinem ersten richtigen Schwindel. Am letzten Poller. „Und vor dir war auch jemand.“': 'Mala me pitala za moju prvu pravu vrtoglavicu. Kod zadnje bitve. „I ispred tebe je bilo nekoga.“',   // Notiz
  'Mala geht durch Türen und hört, was an Dingen hängt. Anfassen kann sie nichts, nicht einmal ein Glas Wasser. Weit weg von mir kann sie nicht.': 'Mala prolazi kroz vrata i čuje ono što ostane na stvarima. Ništa ne može dotaknuti, čak ni čašu vode. Ne može daleko od mene.',   // Notiz
  'Was Mala kann und was nicht.': 'Što Mala može, a što ne.',   // Notiz (kurz)
  'Mala hat Sanjas Zettel hinter dem Tresen gelesen: „Montag geschlossen – Inventur. Stipe und Frane sagen!!“': 'Mala je pročitala Sanjinu ceduljicu iza šanka: „Ponedjeljak zatvoreno – inventura. Reći Stipi i Frani!!“',   // Notiz (zitiert Sanjas kroatischen Zettel)
  'Sanjas Zettel.': 'Sanjina ceduljica.',   // Notiz (kurz)
  'Sie hat einen Namen: Mala. „So sagt man zu kleinen Mädchen.“ – „Es reicht.“': 'Ima ime: Mala. „Tako se kaže djevojčicama.“ – „Dovoljno je.“',   // Notiz
  'Die Stadt hat Verwandte gezählt. Menschen hat sie nicht gezählt.': 'Grad je brojao rodbinu. Ljude nije brojao.',   // Marko (denkt laut)
  'Zdenka hatte recht. Nur: Wem widerspricht das?': 'Zdenka je bila u pravu. Samo: komu to proturječi?',   // Marko (denkt laut)
  'Zdenka hatte recht. Und die Stadt schreibt trotzdem: keine Kontakte.': 'Zdenka je bila u pravu. A Grad ipak piše: bez kontakata.',   // Marko (denkt laut)
  'Zdenka sagt das eine, die Stadt das andere. Ich brauche etwas, das Ivka selbst geschrieben hat.': 'Zdenka kaže jedno, Grad drugo. Treba mi nešto što je Ivka sama napisala.',   // Marko (denkt laut)
  'Rot heißt Druck. Beim Kesseldeckel geht es um Druck. Also die rote. So schreibe ich es.': 'Crvena znači tlak. A kod poklopca kotla radi se upravo o tlaku. Dakle, crvena. Tako ću i napisati.',   // Marko (denkt laut)
  'Arbeit': 'Posao',   // Gruppe
  'Laut Stadt: keine Kontakte': 'Prema Gradu: bez kontakata',   // Kurztitel
  'Strickte für die halbe Gasse': 'Plela je za pola ulice',   // Kurztitel
  'Ivkas Strickheft': 'Ivkina bilježnica',   // Kurztitel
  'Keine Familie heißt nicht: niemand': 'Bez obitelji ne znači: bez ikoga',   // Kurztitel
  '„Wer trägt nichts von ihr?“': '„Tko ne nosi ništa njezino?“',   // Kurztitel
  'S. 30: Rot heißt Druck': 'Str. 30: Crvena znači tlak',   // Kurztitel
  'Ein Mädchen in der Scheibe': 'Djevojka u staklu',   // Kurztitel
  'Der erste Schwindel': 'Prva vrtoglavica',   // Kurztitel
  'Was sie kann und was nicht': 'Što može, a što ne',   // Kurztitel
  'Sanjas Zettel': 'Sanjina ceduljica',   // Kurztitel
  // ---------------------------------------------------------------- 10_items.js
  'Wasserglas': 'Čaša za vodu',   // Name
  'Ein leeres Wasserglas. Noch leer.': 'Prazna čaša za vodu. Zasad prazna.',   // Marko
  'Ein Glas. Ich weiß noch, wie sich Glas anfühlt. Kalt und glatt.': 'Čaša. Još znam kakvo je staklo pod prstima. Hladno i glatko.',   // Mala
  'Glas Wasser': 'Čaša vode',   // Name (auch flat.js: Hotspot auf dem Schreibtisch)
  'Ein Glas Leitungswasser. Mehr habe ich nicht anzubieten.': 'Čaša vode iz slavine. Više nemam što ponuditi.',   // Marko
  'Ich kann es nicht halten. Das weißt du doch.': 'Ne mogu je držati. Pa znaš to.'   // Mala
});
M.trIgnore && M.trIgnore(['pro_noone+pro_list', 'pro_knit+pro_list', 'pro_noone+pro_knit', 'pro_spia+pro_red']);   // Schluss-IDs (zwei Notizen verbinden), nie angezeigt
})(M);
