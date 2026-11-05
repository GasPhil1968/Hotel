/* ===== 13_k3_notes.js — Kapitel 3: Notizen, Schlussfolgerungen (A+B=C, C+D=E), Widersprüche, Antworten bei falschen Verbindungen =====
   Fälle: p3 Ankunft · l3 Lanas Nacht (das ganze Kapitel) · v3 Der Fahrer · a3 Die Glocke (Skela, Bato) · b3 Der Bus aus München (Mate) · e3 Epilog.
   Aus Kapitel 2 übernommen: k3_c_* (Fall l3). IDs fest, siehe game/K3_SPEC.md §8. */
(function(M){
'use strict';
var N={};
function n(id,c,g,s,t,o){ N[id]=Object.assign({c:c,g:g,s:s,t:t,show:true},o||{}); }
function flag(k){ return function(G){ return !!G.flags[k]; }; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
// ---------------------------------------------------------------- Aus Sarajevo (Kapitel 2)
n('k3_c_bridge','l3','Aus Sarajevo','Malas Splitter','Aus Sarajevo: Malas letzter Splitter. Ein Lastwagen, Mehlsäcke, Decken, Diesel. „Der Fahrer hat geraucht und nichts gesagt.“ Ein Fluss, grün und laut, tief unten. Eine Brücke, die nicht mehr da war. Wasser.',{p:'p:mala'});
n('k3_c_name','l3','Aus Sarajevo','Ich habe ihr den Namen gegeben','Aus Sarajevo: Lana Delić vom neunten Stock. Sie nannte mich Mali, ich sie Mala. Den Namen habe ich ihr gegeben.',{p:'p:mala'});
n('k3_c_missing','l3','Aus Sarajevo','Vermisst','Aus Sarajevo: Nada: „Sie ist nie angekommen. Für das Rote Kreuz ist sie vermisst. Seit siebzehn Jahren.“',{p:'p:nada'});
n('k3_c_promise','l3','Aus Sarajevo','„Bring sie nach Hause“','Aus Sarajevo: Ich habe Nada versprochen, Lana nach Hause zu bringen. Ich habe „Ja“ gesagt, bevor sie fertig geweint hatte.',{p:'p:nada'});
// ---------------------------------------------------------------- Ankunft
n('p3_sms','p3','Ankunft','Nadas SMS','SMS von Nada: „Jesi li stigao? N.“ Bist du angekommen?',{p:'i:mobitel'});
n('p3_munich','p3','Ankunft','München, samstags','Auf der Abfahrtstafel: „MÜNCHEN · subota“. Jeden Samstag einer nach München. Und jeden Samstag einer zurück.',{p:'p:mala'});
n('p3_history','p3','Ankunft','Die Brücke fiel 1993','Dino: Die Alte Brücke fiel im November 1993. Danach hing eine Seilbrücke da, von spanischen Pionieren. 2004 haben sie sie wieder aufgebaut, Stein für Stein.',{p:'p:dino'});
// ---------------------------------------------------------------- Lanas Nacht: die Brücke
n('l3_mybridge','l3','Die Brücke','Malas Brücke stand im Wasser','Mala am Brückenkopf: „Meine stand im Wasser. Auf Stümpfen, im Licht vom Lastwagen. Wie abgebrochene Zähne.“',{p:'p:mala'});
n('l3_onearch','l3','Die Brücke','Ein einziger Bogen','Die Alte Brücke ist ein einziger Steinbogen, von Fels zu Fels. Kein Pfeiler im Fluss. So war sie vor dem Krieg, und so ist sie wieder. Sie stand nie im Wasser.',{p:'p:dino'});
n('l3_notbridge','l3','Die Brücke','Nicht die Alte Brücke','Malas Brücke stand auf Pfeilern im Wasser. Die Alte Brücke hatte nie einen. Zerstört oder nicht: Es war nicht die Alte Brücke.',{p:'p:mala'});
n('l3_uncounted','l3','Die Brücke','Eine Brücke, die keiner gezählt hat','Eine Brücke auf Pfeilern, die nicht mehr da war, an einem Fluss, grün und laut, tief unten. Eine Brücke, die keiner gezählt hat. Irgendwo flussab.',{p:'p:mala'});
// ---------------------------------------------------------------- Lanas Nacht: die Leine und die Peilung
n('l3_down','l3','Die Leine','Spur: Die Leine zeigt flussab','Mala: „Sie zeigt nicht auf die Brücke. Flussab. Aus der Stadt hinaus.“ Eine Richtung. Woran die Leine hängt, ist offen.',{p:'p:mala'});
n('l3_onedir','l3','Die Leine','Eine Richtung reicht nicht','Am Ufer nach Süden kommen wir nicht weit. Mala: „Weiter nicht. Nicht ohne dich.“ Eine Richtung reicht nicht. Ich brauche einen zweiten Blick.',{p:'p:mala'});
n('l3_m1','l3','Die Peilung','Erste Messung: Brückenkopf','Vom Brückenkopf am Ostufer: Malas Leine zeigt zwischen zwei Landmarken hindurch, nach Süden. Auf dem Plan ein schmaler Fächer.',{p:'i:plan'});
n('l3_m2','l3','Die Peilung','Zweite Messung: Minarett','Vom Minarett der Koski-Moschee: wieder nach Süden, fast gleich. Die beiden Standorte liegen nur ein paar Hundert Meter auseinander.',{p:'i:plan'});
n('l3_flat','l3','Die Peilung','Zu flach geschnitten','Zwei nahe Standorte, zwei Richtungen auf ein fernes Ziel: Die Fächer schneiden sich so flach, dass ein Streifen bleibt, von der Stadtgrenze bis hinter den Rand. Ich brauche einen Standort weit seitlich. Drüben, und hoch.',{p:'i:plan'});
n('l3_m3','l3','Die Peilung','Dritte Messung: Westhang','Vom Partisanenfriedhof am Westhang, gut einen Kilometer seitlich und höher: Die Leine kommt aus einer ganz anderen Richtung.',{p:'i:plan'});
n('l3_area','l3','Die Peilung','Hinter dem Kartenrand','Der dritte Fächer schneidet den Streifen in einem großen Winkel. Übrig bleibt ein Stück Fluss von ein paar Kilometern, südlich der Stadt, hinter dem Rand meines Plans.',{p:'i:plan'});
n('l3_oldmap','l3','Die Peilung','Zdravkos Karte von 1985','An der Wand in Zdravkos Café hängt eine Straßenkarte von 1985, mit den Dörfern südlich der Stadt. „Damals wusste man noch, wo was ist.“',{p:'p:zdravko'});
n('l3_skela','l3','Die Peilung','Skela heißt Fähre','In dem Stück Fluss zeigt die alte Karte genau eine Übergangsstelle: ein Brückensymbol an einer Biegung, und der Name Skela. Skela heißt Fähre.',{p:'p:mala'});
n('l3_current','l3','Die Peilung','Die Strömung','Dino: „Was in Mostar in den Fluss fällt, kommt an der Biegung bei Skela wieder ans Ufer. Da holen sie jedes Jahr Holz raus. Und anderes.“',{p:'p:dino'});
n('l3_city','l3','Die Leine','Die Leine zeigt in die Stadt','Samstagmorgen, Mala: „Sie zeigt heute woandershin. In die Stadt.“ Gestern zeigte sie nach Skela, heute in die Altstadt.',{p:'p:mala'});
n('l3_person','l3','Die Leine','Ein Mensch, kein Ort','Ein Ort wandert nicht. Die Leine hängt an einem Menschen, der heute in der Stadt ist und sonst in Skela.',{p:'p:mala'});
n('l3_tepa','l3','Die Leine','Markttag','Maja: „Samstags kommen die Leute aus den Dörfern auf die Tepa.“',{p:'p:maja'});
n('l3_eggwoman','l3','Die Leine','Die Eierfrau kennt eine Mala','Auf der Tepa, eine alte Frau mit Eiern und Walnüssen. Auf „Lana Delić“ sagt sie „Ne“. Auf „Mala“ fällt ihr ein Ei herunter. „Ko ste vi?“ Dann packt sie zusammen und geht.',{p:'p:zlata'});
n('l3_dreams','l3','Die Leine','„Treću noć“','Mala, an der Nachbarin: Die Eierfrau sagt leise: „Sanjam je opet. Treću noć.“ Ich träume wieder von ihr. Die dritte Nacht.',{p:'p:mala'});
n('l3_zlata_gone','l3','Die Leine','Die Eierfrau ist fort','Der Stand der Eierfrau ist leer. Mala: „Die Leine geht ihr nach. Aus der Stadt hinaus, nach Süden.“',{p:'p:mala'});
// ---------------------------------------------------------------- Lanas Nacht: zwei Namen
n('l3_ljerka_pic','l3','Zwei Namen','„Unterschrieben mit Mala“','Ljerka am Telefon: „Unter meiner Tür lag morgens ein Bild von meinem Vater. Mit seinem Teeglas. Unterschrieben mit Mala.“',{p:'p:ljerka'});
n('l3_key31','l3','Zwei Namen','Der Schlüssel von 31','Ljerka: „Der Schlüssel von 31 fehlt seitdem.“',{p:'p:ljerka'});
n('l3_abreise','l3','Zwei Namen','„Was hätte ich schreiben sollen?“','Ljerka: „Bei Abreise habe ich nichts eingetragen. Was hätte ich schreiben sollen? Weggelaufen?“',{p:'p:ljerka'});
n('l3_onetrail','l3','Zwei Namen','Mala und Lana sind eine Spur','Sie hat sich Mala genannt. Den Namen habe ich ihr gegeben. Wer sie in ihren letzten Tagen kannte, kannte Mala, nicht Lana Delić. Ich bin der Einzige, der weiß, dass das eine ist.',{p:'p:mala'});
n('l3_twosearches','l3','Zwei Namen','Zwei Suchen, die sich nie trafen','Nada sucht seit siebzehn Jahren Lana Delić. Die Spuren liegen unter „Mala“. Das ist ein Grund, warum man sie nicht fand. Vielleicht nicht der einzige.',{p:'p:nada'});
// ---------------------------------------------------------------- Lanas Nacht: was geschah
n('l3_survived','l3','Lanas Nacht','Sie hat den Fluss überlebt','Die Decke kommt aus Zlatas Haus, und Mala hat in ihr gelegen, an einem Herd, zitternd. Lana ist nicht im Fluss gestorben. Zlata hat sie lebend gefunden.',{p:'p:mala'});
n('l3_rope','l3','Lanas Nacht','Das Seil','Lana hat Vlado weggeschickt. Sie hat dreimal geläutet, drüben ging ein Licht an und wieder aus. Dann hat sie sich an das Fährseil gehängt, Hand über Hand. In der Mitte hat sie losgelassen.',{p:'p:mala'});
n('l3_bells','l3','Lanas Nacht','Darum die Glocken','Mala am linken Ufer: „Darum die Glocken. Ich habe geläutet, und keiner kam.“ Heute ist einer gekommen.',{p:'p:mala'});
n('l3_oven','l3','Lanas Nacht','Samstag','Am Vormittag hat sie einmal die Augen aufgemacht. „Kako se zoveš, dušo?“ – „Mala.“ Sie hat gebeten: „Sagt es keinem. Ich will selbst nach Hause kommen.“ Am Samstag ist sie am Herd gestorben, in die Decken gewickelt.',{p:'p:zlata'});
// ---------------------------------------------------------------- Der Fahrer
n('v3_mate','v3','Der Fahrer','„Rajić? Der Raucher?“','Mate im Café: „Rajić? Der Raucher? Ist früher Mehl gefahren. Seit dem Krieg fährt er nachts nicht mehr. Vulkanizer hinter dem Bulevar.“',{p:'p:mate'});
n('v3_ljerka','v3','Der Fahrer','„Mit Vlado, dem Raucher“','Ljerka: „Die Kleine aus 31 ist an einem Freitag im Januar weg, ohne Abschied. Mit Vlado, dem Raucher. Der hat für die Mostarer Mehl in die Dörfer an der Neretva gefahren. Ich habe es ihr verboten.“',{p:'p:ljerka'});
n('v3_where','v3','Der Fahrer','Vlado Rajić','Vlado, der Raucher, heißt Rajić. Er hat einen Vulkanizer hinter dem Bulevar, auf dem Westufer.',{p:'p:taxist'});
n('v3_denial','v3','Der Fahrer','„Nie.“','Vlado Rajić, Vulkaniseur: „Ich habe nie jemanden mitgenommen. Nie.“',{p:'p:vlado'});
n('v3_cab','v3','Das Führerhaus','Sie hat ihn gezeichnet','Nachhall im Führerhaus des TAM: Sie zeichnet ihn im Licht des Armaturenbretts. „Halt still.“ – „Ich fahre.“ – „Dann fahr still.“',{p:'p:mala'});
n('v3_hewas','v3','Das Führerhaus','„Er war es“','Mala: „Er war es. Er hat die Zigarette immer noch zwischen den Zähnen.“',{p:'p:mala'});
n('v3_typenschein','v3','Die Schublade','Der Typenschein','Kata will den TAM an ein Museum in Graz verkaufen. Dafür braucht sie den Typenschein. „Der liegt in einer von den drei Schubladen. Ich kann ihn um einen Schlüssel bitten, nicht um drei. Welche?“',{p:'p:kata'});
n('v3_drawer','v3','Die Schublade','Die unterste Schublade','Mala sieht durch das Holz: oben Rechnungen, in der Mitte Reifenkataloge, unten eine Mappe „TAM 4500“, dazwischen ein gefaltetes Blatt und ein Schlüssel mit Holzanhänger. „Einunddreißig.“',{p:'p:mala'});
n('v3_tomorrow','v3','Die Schublade','„Morgen.“','Aus der Mappe fallen eine Zeichnung und der Schlüssel von 31. Vlado sieht beides und geht nach hinten. „Morgen. Kommen Sie morgen.“',{p:'p:vlado'});
n('v3_forlater','v3','Zwei Fassungen','„Für später“','Auf der Rückseite der Zeichnung: „Für später. Wenn du nach Sarajevo kommst, zeichne ich dich ohne Zigarette.“',{p:'p:vlado'});
n('v3_mala','v3','Zwei Fassungen','„Sie hat gesagt, sie heißt Mala“','Vlado: „Freitag, vierzehnter Januar, Split. Sie hat gesagt, sie heißt Mala. Wie jede.“',{p:'p:vlado'});
n('v3_part1','v3','Zwei Fassungen','Ankunft und Abfahrt','Vlado: In Skela waren sie „gegen zwanzig vor elf“. Die Brücke war seit dem Sommer weg, die Fähre fuhr nur bei Tag. „Ich bin um Viertel nach elf gefahren.“',{p:'p:vlado'});
n('v3_bag','v3','Zwei Fassungen','Die Tasche','Vlado: „Ihre Tasche lag noch im Führerhaus. Die Kleider habe ich verschenkt. Den Schlüssel nicht.“',{p:'p:vlado'});
n('v3_mala_left','v3','Zwei Fassungen','„Er ist gefahren.“','Mala, nachdem Vlado erzählt hat: „Er ist gefahren.“ Mehr will sie jetzt nicht sagen.',{p:'p:mala'});
n('v3_sent','v3','Zwei Fassungen','„Sie hat mich weggeschickt“','Vlado: „Sie hat mich weggeschickt. Ich wollte sie zu meiner Schwester bringen. Sie hat gesagt: Ich habe genug gewartet. Für ein ganzes Leben. Fahr.“',{p:'p:vlado'});
n('v3_two','v3','Zwei Fassungen','„Um zwei war ich wieder da“','Vlado: „Ich bin bis zur Kontrolle gefahren. Dann bin ich umgekehrt. Um zwei war ich wieder da. Ich habe gerufen. Da war nur der Fluss.“',{p:'p:vlado'});
n('v3_who','v3','Zwei Fassungen','Wer hat wen stehen lassen?','Widerspruch: Vlado sagt, sie hat ihn weggeschickt. Mala sagt: „Er ist gefahren.“ Beides stimmt. Aber nur eins ist die ganze Geschichte.',{p:'p:mala'});
n('v3_message','v3','Zwei Fassungen','Eine Botschaft für Vlado','Mala: „Sag Vlado, dass er nicht schuld ist. Sag es so, dass er weiß, von wem es kommt. Nicht mit einem Zettel. Mit etwas, das nur wir zwei hatten. Im Führerhaus.“',{p:'p:mala'});
n('v3_tonight','v3','Zwei Fassungen','„Heute Nacht fahre ich“','Vlado: „Heute Nacht fahre ich. Sie wollen nach Skela. Um elf hole ich Sie ab.“ Kata: „Den Lastwagen verkaufen wir nicht.“',{p:'p:vlado'});
// ---------------------------------------------------------------- Die Glocke (Skela)
n('a3_stumps','a3','Skela','Die Stümpfe','In Skela stehen drei Pfeilerstümpfe der alten Brücke im Fluss. Wie abgebrochene Zähne. Mala: „Das ist meine.“',{p:'p:mala'});
n('a3_bato','a3','Der Fährmann','Der Fährmann im Schuppen','Drüben, am linken Ufer, ein alter Mann in Wathose mit einer Sturmlaterne, ein Geist. Mala: „Seine Leine hängt an der Glocke. An meiner Seite.“',{p:'p:bato'});
n('a3_hut','a3','Skela','Nachhall: die Hütte','Mala in der Hütte: Ein Mädchen sitzt auf einem Mehlsack und zeichnet bei einer Kerze. Ein Bleistift.',{p:'p:mala'});
n('a3_bell3','a3','Skela','Nachhall: dreimal','Mala an der Glocke: Jemand läutet. Dreimal, mit langen Pausen dazwischen.',{p:'p:mala'});
n('a3_voice','a3','Skela','Eine Mädchenstimme','Mala an der Glocke: Zwischen dem Läuten ruft jemand über den Fluss: „Halo! Ima li koga?“ Eine Mädchenstimme.',{p:'p:mala'});
n('a3_mine','a3','Skela','„Das ist meins.“','Am Seilanker bleibt Mala stehen. „Nicht. Das ist meins.“ Was sie dort gesehen hat, sagt sie nicht.',{p:'p:mala'});
n('a3_neighbor','a3','Skela','Seit achtundneunzig','Der Nachbar mit dem Hund: „Die Skela fährt seit achtundneunzig nicht mehr, Herr. Da ist eine Brücke.“',{p:null});
n('a3_plaque','a3','Skela','Die Tafel an der neuen Brücke','Tafel an der neuen Brücke: gebaut 1998, mit Spenden. Seitdem fährt die Fähre nicht mehr. Die Glocke ist hängen geblieben.',{p:null});
n('a3_soldier','a3','Der Fährmann','„Es war ein Mann“','Bato im Schuppen: „Es ist Januar. Die Brücke ist weg. Bei Nacht fahre ich nicht. Es war ein Mann. Er hat gerufen wie ein Soldat.“',{p:'p:bato'});
n('a3_tomorrow','a3','Zlata','„Sutra. Danju.“','Zlata kommt mit der Lampe heraus und kennt mich vom Markt. Sie bittet mich zu gehen. Dann, nach einer Pause: „Sutra. Danju.“ Morgen. Bei Tag.',{p:'p:zlata'});
n('a3_slept','a3','Zlata','„Er hat geschlafen“','Zlata: „Ja. Es gab eine Mala.“ Ihr Mann? „Er hat geschlafen. Er hatte einen tiefen Schlaf. Er hat nichts gehört.“',{p:'p:zlata'});
n('a3_grave','a3','Zlata','Unter dem Quittenbaum','Unter dem Quittenbaum: ein Beet mit frischen Chrysanthemen, ein flacher Stein, ein Brett: „MALA · 15.1.1994“. Mala, von drüben: „Da zieht es hin. Zu ihr.“',{p:'p:mala'});
n('a3_morning','a3','Zlata','„Als ich die Hühner rausließ“','Zlata: „Am Morgen, als ich die Hühner rausließ. Im Schilf, unten bei der Weide.“',{p:'p:zlata'});
n('a3_roof','a3','Die Lichtprobe','Das Dachfenster','Lichtprobe: Mala vergleicht von drüben, welches Fenster damals hell war. „Zu tief. Zu breit. Das kleine unter dem Dach. Das war es.“ Das Dachfenster gehört zu Batos Kammer. Zlata schlief damals unten am Herd.',{p:'p:mala'});
n('a3_lightseq','a3','Die Lichtprobe','Dunkel, hell, dunkel','Mala ordnet ihren Nachhall: Beim ersten Läuten war das Fenster dunkel. Beim zweiten brannte das Licht. Beim dritten war es wieder aus.',{p:'p:mala'});
n('a3_lightroom','a3','Die Lichtprobe','Licht in Batos Kammer','Die Reihenfolge stimmt: Vlado fährt. Erstes Läuten. Licht an. Zweites Läuten. Licht aus. Drittes Läuten. Zwischen dem ersten und dem dritten Läuten hat in Batos Kammer jemand Licht gemacht. Mehr belegt das nicht.',{p:'p:bato'});
n('a3_thrice','a3','Der Fährmann','„Dreimal hat er geläutet“','Bato: „Licht? Ich habe es gleich wieder ausgemacht. Wer nachts Licht macht, hat bald ein Loch im Fenster. Dreimal hat er geläutet, dann war Ruhe.“',{p:'p:bato'});
n('a3_awake','a3','Der Fährmann','Bato war wach','Widerspruch: Zlata sagt, er hat geschlafen. Bato hat die Schläge gezählt. Wer zählt, war wach. Er stand am Fenster und hat gehört.',{p:'p:bato'});
n('a3_pencil','a3','Zlata','Der Bleistift','Zlata, aus der Küchenschublade: ein angekauter Bleistift. „Bato hat ihn mitgebracht, als er morgens die Decken holte. Er lag an der Glocke.“',{p:'p:zlata'});
n('a3_girl','a3','Der Fährmann','Es war das Mädchen','Eine Mädchenstimme an der Glocke. Ein Bleistift, der dort lag. Es war kein Soldat, der geläutet hat. Es war das Mädchen.',{p:'p:mala'});
n('a3_fromzlata','a3','Zlata','Zlatas Decke','Zlata gibt mir eine graue Decke mit, Armeewolle mit einem schwarzen Streifen. „Uzmite deku. Hladno je kod vode.“ Nehmen Sie eine Decke. Am Wasser ist es kalt.',{p:'i:deka'});
n('a3_blanket','a3','Zlata','Nachhall der Decke','Mala, an der Decke: „Die riecht nach Diesel. Nach unserem Lastwagen. … Ein Mädchen in dieser Decke, an einem Herd. Sie zittert.“ Und: „Ich war noch da, Marko. Nach dem Fluss war ich noch da.“',{p:'p:mala'});
n('a3_alive','a3','Zlata','„Sie hat noch gelebt“','Zlata, nach langer Stille: „Ja. Im Schilf. Sie hat noch gelebt.“ Mehr sagt sie nicht. „Ich habe ihr etwas versprochen.“',{p:'p:zlata'});
// ---------------------------------------------------------------- Der Bus aus München (Mate)
n('b3_mate','b3','Mate','Der Wartende','Am Fenstertisch in Zdravkos Café sitzt ein alter Mann mit Hut und Thermoskanne, ein Geist. Mate Zelenika. „Morgen um sechs. Mein Sohn kommt.“',{p:'p:mate'});
n('b3_notson','b3','Mate','„Mein Sohn ist jung“','Aus dem Bus aus München steigen ein grauer Mann und ein Mädchen. Mate sieht an ihnen vorbei: „Er kommt mit dem nächsten. Mein Sohn ist jung.“',{p:'p:mate'});
n('b3_gate','b3','Die Zelenikas','Am Pfosten','Jela: „Mate stand immer am Tor, wenn ein Bus kam. Da, am Pfosten. Den Schlüssel bekam der Kleinste.“',{p:'p:jela'});
n('b3_lenakey','b3','Die Zelenikas','„Ich war ja nie da“','Lena: „Den hab ich nie gekriegt. Ich war ja nie da.“',{p:'p:lena'});
n('b3_figs','b3','Die Zelenikas','Die Feigen','Die beiden Feigenbäume stehen uneingepackt. Für Sonntagnacht ist Frost angesagt. Jela hat sie letzten Winter eingepackt. Dieses Jahr wartet sie.',{p:'p:jela'});
n('b3_sell','b3','Die Zelenikas','Montag beim Notar','Davor will am Montag beim Notar unterschreiben. Das Haus wird verkauft.',{p:'p:davor'});
n('b3_letters','b3','Die Briefe','Mates Briefe','Ein Schuhkarton voller Briefe von Mate an Davor, einer pro Jahr. In jedem: „Smokve su rodile. Kad ćete doći?“ Die Feigen haben getragen. Wann kommt ihr? Davor las darin einen Vorwurf.',{p:'p:davor'});
n('b3_kidsroom','b3','Die Briefe','Das Kinderzimmer','Oben ein Kinderzimmer, eingerichtet 1998. Ein Kinderbett, Ballontapete, ein deutsches Kinderbuch im Regal. Der große Feigenbaum wurde 1997 gepflanzt, in Lenas Geburtsjahr.',{p:'p:lena'});
n('b3_invite','b3','Die Briefe','Eine Einladung, die sich nicht traut','„Kad ćete doći?“ ist keine Frage nach dem Datum. Ein Zimmer für ein Kind, das nie kam, ein Baum aus seinem Geburtsjahr: Das ist eine Einladung, die sich nicht traut.',{p:'p:mate'});
n('b3_cards','b3','Die Briefe','Lenas Postkarten','In Mates Schublade: Lenas Postkarten aus München, an den „Opa“. Jedes Jahr eine, mit Schulfoto.',{p:'p:lena'});
n('b3_pencil','b3','Die Briefe','„Dragi dida“','Unter jedes „Lieber Opa“ auf Lenas Karten hat Mate mit Bleistift geschrieben: „Dragi dida.“',{p:'p:mate'});
n('b3_zdravko','b3','Mate','„Dida Mate“','Zdravko: „Ein Kaffee, zwei Stunden. Das war Dida Mate.“',{p:'p:zdravko'});
n('b3_dida','b3','Die Briefe','So wollte er heißen','„Opa“ hat Lena geschrieben, „dida“ hat Mate darunter geschrieben. So wollte er heißen. So hat ihn Davor genannt, als er klein war.',{p:'p:mate'});
// ---------------------------------------------------------------- Epilog
n('e3_father','e3','Der Vater','Ich habe ihn nie gesucht','Mala: „Hast du deinen Vater gesucht? Damals?“ – „Nein.“ – „Warum nicht?“ – „Weil ich wusste, dass er tot ist.“ – „Woher?“ Darauf habe ich nichts gesagt.',{p:'p:mala'});
n('e3_kolar','e3','Der Vater','„Und Sie?“','Frau Kolar: „Und Sie? Haben Sie jemanden?“',{p:'p:kolar'});
n('e3_avoid','e3','Der Vater','Damit ich ihn nicht suchen muss','Ich suche eine Vermisste für eine Mutter, und den eigenen Vater habe ich nie gesucht. Mala: „Du suchst mich, damit du ihn nicht suchen musst.“',{p:'p:mala'});
n('e3_mothersample','e3','Der Vater','Die Probe der Mutter','Frau Kolar: „Lebt Ihre Mutter?“ Ihre Probe hilft nur zusammen mit der eines Kindes, meiner oder Anas. „Wir suchen. Wenn er gefunden wurde, können wir ihn zuordnen.“',{p:'p:kolar'});
n('e3_since','e3','Der Vater','Seit dem Winter','Mala, auf der Brücke: „Danach war ich bei dir. In Vratnik, im Winter. Dann Split. Dann hast du den Karton zugeklebt. Dann war ich leer.“',{p:'p:mala'});
M.defineNotes(N);
// ---------------------------------------------------------------- Gruppen und Erledigung
M.NOTE_GROUPS.p3=['Ankunft']; M.NOTE_GROUPS.l3=['Die Brücke','Die Peilung','Die Leine','Zwei Namen','Lanas Nacht','Aus Sarajevo'];
M.NOTE_GROUPS.v3=['Der Fahrer','Das Führerhaus','Die Schublade','Zwei Fassungen']; M.NOTE_GROUPS.a3=['Skela','Der Fährmann','Die Lichtprobe','Zlata'];
M.NOTE_GROUPS.b3=['Mate','Die Zelenikas','Die Briefe']; M.NOTE_GROUPS.e3=['Der Vater'];
function by(id,list){ var x=M.NOTES[id]; x.doneBy=(x.doneBy||[]).concat(list); }
function done(id,fn){ M.NOTES[id].doneIf=fn; }
function after(f){ return function(G){ return !!G.flags[f]; }; }
// erledigt durch den Schluss, der sie verbindet
by('l3_mybridge',['l3_notbridge']); by('l3_onearch',['l3_notbridge']); by('l3_notbridge',['l3_uncounted']);
by('l3_m1',['l3_flat']); by('l3_m2',['l3_flat']); by('l3_flat',['l3_area']); by('l3_m3',['l3_area']); by('l3_area',['l3_skela']); by('l3_oldmap',['l3_skela']);
by('l3_onedir',['l3_flat']); by('l3_down',['l3_city']); by('l3_city',['l3_person']); by('l3_skela',['l3_person']);
by('v3_mala',['l3_onetrail']); by('l3_ljerka_pic',['l3_onetrail']); by('l3_onetrail',['l3_twosearches']);
by('v3_sent',['v3_who']); by('v3_mala_left',['v3_who']);
by('a3_thrice',['a3_awake']); by('a3_slept',['a3_awake']); by('a3_voice',['a3_girl']); by('a3_pencil',['a3_girl']); by('a3_bell3',['a3_lightseq']);
by('a3_blanket',['l3_survived']); by('a3_fromzlata',['l3_survived']); by('a3_lightseq',['a3_lightroom']); by('a3_roof',['a3_lightseq']);
by('b3_letters',['b3_invite']); by('b3_kidsroom',['b3_invite']); by('b3_cards',['b3_dida']); by('b3_pencil',['b3_dida']); by('b3_zdravko',['b3_dida']);
by('e3_father',['e3_avoid']); by('e3_kolar',['e3_avoid']);
// erledigt durch den Fortgang
done('p3_sms',function(G){ return G.flags['k3.p.sms']!==undefined; }); done('p3_munich',after('k3.b.arrived')); done('p3_history',after('k3.peil.minaret'));
done('l3_uncounted',after('k3.d1.skela')); done('l3_current',after('k3.d1.skela')); done('l3_person',after('k3.bato.found')); done('l3_tepa',function(G){ return !!(G.flags['k3.z.mala']||G.flags['k3.z.lost']); });
['l3_eggwoman','l3_dreams','l3_zlata_gone'].forEach(function(id){ done(id,after('k3.z.tomorrow')); });
['l3_key31','l3_abreise','l3_twosearches'].forEach(function(id){ done(id,after('k3.fin.free')); });
['v3_mate','v3_ljerka','v3_where','v3_denial'].forEach(function(id){ done(id,after('k3.v.drawer')); });
['v3_hewas','v3_typenschein','v3_drawer','v3_tomorrow'].forEach(function(id){ done(id,after('k3.v.part1')); });
['v3_bag','v3_part1','v3_forlater','v3_two'].forEach(function(id){ done(id,after('k3.v.free')); });
done('v3_who',after('k3.d3.talk2')); done('v3_message',after('k3.v.free')); done('v3_cab',after('k3.v.free')); done('v3_tonight',after('k3.fin.drive'));
['a3_stumps','a3_hut','a3_mine','a3_neighbor','a3_plaque','a3_tomorrow'].forEach(function(id){ done(id,after('k3.fin.free')); });
['a3_soldier','a3_bato','a3_awake','a3_girl','a3_lightroom'].forEach(function(id){ done(id,after('k3.fin.bato')); });
['a3_grave','a3_morning','a3_alive'].forEach(function(id){ done(id,after('k3.fin.free')); });
['b3_mate','b3_notson'].forEach(function(id){ done(id,after('k3.b.son')); }); ['b3_gate','b3_lenakey','b3_figs','b3_sell','b3_invite','b3_dida'].forEach(function(id){ done(id,after('k3.b.done')); });
['l3_survived','l3_rope','l3_bells'].forEach(function(id){ done(id,after('k3.e.mothers')); });
['e3_avoid','e3_mothersample','e3_kolar'].forEach(function(id){ done(id,after('k3.e.mother')); });
// ---------------------------------------------------------------- Schlussfolgerungen und Widersprüche
M.defineDeductions({
  'l3_mybridge+l3_onearch':{to:'l3_notbridge',say:'Ihre Brücke stand im Wasser. Diese nie. Zerstört oder heil, sie hatte nie einen Pfeiler im Fluss. Es war nicht die Alte Brücke.'},
  'l3_mybridge+p3_history':{to:'l3_notbridge',if:function(G){ return has(G,'l3_onearch'); },no:'Sie fiel dreiundneunzig. Im Januar war sie kaputt. Aber stand sie je im Wasser? Das muss ich mir ansehen.',say:'Kaputt war sie. Aber ein Bogen bleibt ein Bogen. Sie hat nie im Wasser gestanden.'},
  'l3_notbridge+k3_c_bridge':{to:'l3_uncounted',say:'Ein Lastwagen, ein Fluss tief unten, eine Brücke auf Pfeilern, die nicht mehr da war. Nicht die berühmte. Eine, die keiner gezählt hat.'},
  'l3_m1+l3_m2':{to:'l3_flat',say:'Zwei Linien von fast derselben Stelle. Sie laufen fast nebeneinander her. Irgendwo zwischen hier und dem Meer. Das ist keine Adresse.'},
  'l3_flat+l3_m3':{to:'l3_area',say:'Die dritte Linie kommt von der Seite. Sie schneidet den Streifen fast quer. Übrig bleibt ein Stück Fluss. Südlich der Stadt, hinter dem Rand meines Plans.'},
  'l3_m1+l3_m3':{to:'l3_area',if:function(G){ return has(G,'l3_flat'); },no:'Zwei Linien. Ich brauche alle drei auf einem Blatt.',say:'Brückenkopf, Minarett, Westhang. Drei Linien, ein kurzes Stück Fluss.'},
  'l3_area+l3_oldmap':{to:'l3_skela',say:'Auf der alten Karte, genau in dem Stück Fluss: ein Brückensymbol an einer Biegung. Und ein Name. Skela. Skela heißt Fähre.'},
  'l3_area+l3_current':{to:'l3_skela',if:function(G){ return has(G,'l3_oldmap'); },no:'Dino sagt: an der Biegung bei Skela. Aber wo ist das? Auf meinem Plan gibt es kein Skela. Ich brauche eine Karte, die weiter reicht.',say:'Dino hat recht. Die Biegung, das Stück Fluss, der Name auf der alten Karte. Skela.'},
  'l3_skela+l3_city':{to:'l3_person',say:'Gestern Skela, heute die Altstadt. Ein Ort wandert nicht. Die Leine hängt an jemandem, der heute in der Stadt ist.'},
  'l3_down+l3_city':{to:'l3_person',if:function(G){ return has(G,'l3_skela'); },no:'Gestern flussab, heute in die Stadt. Etwas hat sich bewegt. Aber was liegt flussab?',say:'Gestern flussab, heute in die Stadt. Die Leine hängt an einem Menschen.'},
  'v3_mala+k3_c_name':{to:'l3_onetrail',say:'„Sie hat gesagt, sie heißt Mala.“ Den Namen habe ich ihr gegeben. Wer sie zuletzt kannte, kannte Mala. Nicht Lana Delić.'},
  'l3_ljerka_pic+k3_c_name':{to:'l3_onetrail',say:'Unterschrieben mit Mala. Der Name, den ich ihr gegeben habe. Ljerka kannte eine Mala, keine Lana Delić.'},
  'l3_onetrail+k3_c_missing':{to:'l3_twosearches',say:'Nada sucht Lana Delić. Die Spuren liegen unter Mala. Zwei Suchen, die sich nie getroffen haben. Ich frage nach Mala.'},
  'v3_sent+v3_mala_left':{to:'v3_who',say:'„Sie hat mich weggeschickt.“ – „Er ist gefahren.“ Beides kann stimmen. Aber einer von beiden lässt etwas weg. Ich muss mit Mala reden.'},
  'a3_thrice+a3_slept':{to:'a3_awake',if:function(G){ return has(G,'a3_lightroom'); },no:'Bato zählt die Schläge. Zlata sagt, er hat geschlafen. Aber wann soll er das gehört haben?',say:'„Er hat geschlafen“, sagt Zlata. „Dreimal hat er geläutet“, sagt Bato. Wer mitzählt, schläft nicht. Er war wach.'},
  'a3_lightroom+a3_slept':{to:'a3_awake',if:function(G){ return has(G,'a3_thrice'); },no:'In seiner Kammer hat jemand Licht gemacht. Das kann auch der Wind an der Lampe gewesen sein. Was sagt Bato selbst?',say:'Licht in seiner Kammer, und er hat die Schläge gezählt. Er war wach.'},
  'a3_voice+a3_pencil':{to:'a3_girl',say:'Eine Mädchenstimme ruft über den Fluss. Am Morgen liegt an der Glocke ein angekauter Bleistift. Kein Soldat. Es war das Mädchen.'},
  'a3_voice+a3_soldier':{to:'a3_girl',if:function(G){ return has(G,'a3_pencil'); },no:'Bato sagt: ein Soldat. Mala hat eine Mädchenstimme gehört. Wer hat recht? Ich brauche etwas, das am Morgen noch da war.',say:'Er hielt sie für einen Soldaten. Die Stimme war ein Mädchen. Der Bleistift lag an der Glocke. Es war das Mädchen.'},
  'a3_blanket+a3_fromzlata':{to:'l3_survived',say:'Zlatas Decke. Mala hat in ihr gelegen, an einem Herd, zitternd. Sie ist nicht im Fluss gestorben. Sie hat noch gelebt, als Zlata sie fand.'},
  'b3_letters+b3_kidsroom':{to:'b3_invite',say:'„Wann kommt ihr?“ Und oben ein Zimmer für ein Kind, das nie da war. Das ist keine Frage nach dem Datum. Das ist eine Einladung, die sich nicht traut.'},
  'b3_cards+b3_pencil':{to:'b3_dida',say:'„Lieber Opa“, schreibt Lena. „Dragi dida“, schreibt Mate darunter, mit Bleistift, ganz klein. So wollte er heißen.'},
  'b3_zdravko+b3_pencil':{to:'b3_dida',say:'„Dida Mate“, sagt Zdravko. „Dragi dida“, schreibt Mate. Er hat sich das Wort selbst gegeben.'},
  'e3_father+e3_kolar':{to:'e3_avoid',say:'Ich suche eine Vermisste für eine Mutter. Meinen Vater habe ich nie gesucht. Ich weiß, was Mala sagen würde.'}
});
// Reihenfolge der Nacht: kein fester Schluss, sondern das Ordnen (Overlay) nach dem Schließen des Notizbuchs (97_k3_peil.js, M.k3OrderNight)
M.DEDUCE['a3_lightseq+v3_part1']=function(A){ if (A.G.notes.indexOf('a3_lightroom')>=0) return {ok:false,t:'Das habe ich schon geordnet.'}; if (M.k3Queue) M.k3Queue('order');
  return {ok:true,t:'Das lässt sich ordnen. Vlados Zeiten, Malas Läuten, das Licht. Ich lege die Nacht der Reihe nach hin.'}; };
M.DEDUCE['a3_lightseq+a3_bell3']=function(A){ if (A.G.notes.indexOf('a3_lightroom')>=0) return {ok:false,t:'Das habe ich schon geordnet.'}; if (A.G.notes.indexOf('v3_part1')<0) return {ok:false,t:'Läuten, Licht, Läuten. Aber wann fing die Nacht an? Das weiß nur der Fahrer.'};
  if (M.k3Queue) M.k3Queue('order'); return {ok:true,t:'Das lässt sich ordnen. Ich lege die Nacht der Reihe nach hin.'}; };
// ---------------------------------------------------------------- nach Schlüssen: Orte, Malas Antworten (Szenen laufen nach dem Schließen des Notizbuchs, 96_k3_story.js)
var od0=M.onDeduce;
M.onDeduce=function(to,G){ if (M.chapterOf(G)!==3){ if (od0) return od0(to,G); return; }
  if (to==='l3_flat'){ G.map.strassenbr=true; G.map.partizan=true; }
  if (to==='l3_skela'){ G.map.skela=true; G.flags['k3.d1.skela']=true; }
  if (to==='l3_person'){ G.map.tepa=true; }
  if (M.k3Queue) M.k3Queue('ded:'+to); };
// ---------------------------------------------------------------- Antworten bei falschen Verbindungen: je nach Fall und Wiederholung
var POOL={
  same:['Zwei Dinge, die nebeneinander liegen. Mehr nicht.','Ich drehe es hin und her. Es greift nicht.','Das passt nicht. Noch nicht, oder gar nicht.','Nein. Ein Faden, der nirgends festgemacht ist.','Klingt gut. Stimmt nicht. Das kenne ich vom Übersetzen.'],
  cross:['Das sind zwei verschiedene Geschichten. Die eine weiß nichts von der anderen.','Mate wartet auf seinen Sohn, nicht auf Lana. Ich sollte das nicht vermischen.','Nein. Jeder hier hat seine eigene Nacht.'],
  mala:['Mala würde sagen: „Du rechnest wieder.“','Mit Mala hat das nichts zu tun. Oder ich will es nicht sehen.','Ich suche überall nach ihr. Hier ist sie nicht.'],
  peil:['Eine Linie und noch eine Linie. Mein Vater hätte gesagt: Erst messen, dann denken.','Das ist keine Messung. Das ist eine Hoffnung.'],
  again:['Das habe ich schon versucht.','Noch einmal dasselbe. Es wird nicht richtiger.']
};
var nc0=M.noCombo;
M.noCombo=function(a,b,G){ if (M.chapterOf(G)!==3) return nc0?nc0(a,b,G):'Das hängt nicht zusammen.';
  var A=M.NOTES[a]||{}, B=M.NOTES[b]||{}, key='nc.'+[a,b].sort().join('+'); G.cyc=G.cyc||{};
  if (G.flags[key]){ var k0=G.cyc.nc3A=(G.cyc.nc3A||0)+1; return POOL.again[k0%POOL.again.length]; } G.flags[key]=true;
  var pool=((A.g==='Die Peilung')||(B.g==='Die Peilung'))?POOL.peil:((A.c===B.c)?POOL.same:((A.c==='b3'||B.c==='b3')?POOL.cross:POOL.mala)), k=G.cyc['nc3_'+pool.length]=(G.cyc['nc3_'+pool.length]||0)+1;
  return pool[k%pool.length]; };
})(M);
