/* ===== 13_k2_notes.js — Kapitel 2: Notizen, Schlussfolgerungen (A+B=C, C+D=E), Widersprüche, Antworten bei falschen Verbindungen =====
   Fälle: p2 Prolog · s1 Sieben am Turm · s2 Die Leihfrist · s3 Das verschlossene Zimmer · m2 Malas Vergangenheit · f2 Finale.
   Jede Notiz: c (Fall), t (ganzer Satz), s (kurzer Titel), g (Gruppe), show (steht im Notizbuch), p (Bild), doneBy/doneIf (wann sie verschwindet). */
(function(M){
'use strict';
var N={};
function n(id,c,g,s,t,o){ N[id]=Object.assign({c:c,g:g,s:s,t:t},o||{}); }
function flag(k){ return function(G){ return !!G.flags[k]; }; }
var SH={show:true};
// ---------------------------------------------------------------- Aus Split (aus dem Spielstand von Kapitel 1 übernommen)
n('m2_split_register','m2','Aus Split','Register Hotel Palma, Zimmer 31','Aus Split: Flüchtlingsregister 1993, Zimmer 31: „…ić, L., 17, Sarajevo. Ankunft 28.11.1993. Abreise: –“',{show:true,p:'p:mala'});
n('m2_split_journal','m2','Aus Split','Die Kleine auf der Treppe','Aus Split: Brunos Nachtbuch, Dezember 1993: „Die Kleine aus 31 wartet wieder auf der Treppe.“',{show:true,p:'p:bruno'});
n('m2_split_chalk','m2','Aus Split','Kreide: die Drei','Aus Split: Im Salon, unter der Farbe, Kreide von 1993: eine Straßenbahn mit der Nummer 3, ein Mädchen mit Zopf, „KUĆA“.',{show:true,p:'p:mala'});
n('m2_split_tin','m2','Aus Split','Die Blechdose','Aus Split: Mala trägt eine verbeulte Blechdose. Sie sagt nur: „Meins.“',{p:'p:mala'});
n('m2_split_waited','m2','Aus Split','Sie hat gewartet','Aus Split: Mala: „Ich glaube, ich habe auf jemanden gewartet. Ich weiß nicht mehr, ob er gekommen ist.“',{p:'p:mala'});
n('m2_split_bells','m2','Aus Split','Glocken','Aus Split: Bei Kirchenglocken verschwindet Mala für einen Moment. „Zu laut.“',{p:'p:mala'});
// ---------------------------------------------------------------- Prolog
n('p2_km','p2','Ankunft','Mark statt Kuna','Senada am Kiosk: Fahrschein 1,60 KM. Kuna nimmt hier niemand.',{show:true,p:'p:senada',doneIf:flag('k2.p1.km')});
n('p2_letter','p2','Ankunft','Fikrets Brief','Fikret hält einen Brief aus Graz für eine Beschwerde. Er kann kein Deutsch.',{show:true,p:'p:fikret',doneIf:flag('k2.p1.km')});
n('p2_mala_gone','p2','Mala','Mala ist fort','Bei der Einfahrt nach Sarajevo war der Platz neben mir leer. Mala ist verschwunden.',{show:true,p:'p:mala',doneIf:flag('k2.p2.back')});
n('p2_bench','p2','Mala','Mala an der Drei','Mala sitzt an der Endhaltestelle der Linie 3 und steigt in keine Bahn ein. „Ich warte auf die Drei. Ich weiß nicht, auf wen.“',{show:true,p:'p:mala',doneIf:flag('k2.p2.back')});
n('p2_rade_ruza','p2','Ankunft','Rade kannte Ruža','Rade, der Fahrdienstleiter, kannte eine Ruža Vuković aus Vratnik. „Jeden Samstag mit der Drei.“',{p:'p:rade'});
n('p2_hajra','p2','Ankunft','Ružas Džezva','Hajra erkennt die Gravur meiner Džezva: „Das ist Ružas.“ Sie war Großmutters Nachbarin.',{p:'p:hajra'});
// ---------------------------------------------------------------- Fall 1: Sieben am Turm
n('s1_tomaz','s1','Tomaž','Der Soldat unter der Uhr','Unter der Sahat-kula wartet ein junger Mann in Cordjacke, ein Geist. Er fragt jeden nach der Uhrzeit.',{p:'p:tomaz'});
n('s1_note','s1','Tomaž','„Kad kula udari sedam“','Tomažs Zettel: „Sutra, kad kula udari sedam, pod satom. – E.“ Morgen, wenn die Kula sieben schlägt, unter der Uhr.',{show:true,p:'p:tomaz'});
n('s1_clock','s1','Die Uhr','Die Uhr geht falsch','Die Sahat-kula zeigt eine ganz andere Zeit als meine Uhr. Um halb acht steht sie auf Viertel nach drei.',{p:'p:tomaz'});
n('s1_alaturka','s1','Die Uhr','Mondzeit','Lejla: Die Sahat-kula geht „alaturka“. Zwölf Uhr ist bei Sonnenuntergang, jeden Tag ein bisschen anders. Ein Muvekit stellt sie von Hand.',{show:true,p:'p:lejla'});
n('s1_twosevens','s1','Die Uhr','Zwei Siebenen','Eminas „sieben“ war die Sieben der Kula: sieben Stunden nach Sonnenuntergang. Tomaž kam um sieben Uhr abends.',{show:true,p:'p:tomaz'});
n('s1_sunset','s1','Die Uhr','Takvim 1972','Takvim für 1972: Am 14. November ging die Sonne in Sarajevo um 16:16 unter.',{show:true,p:'p:jakob'});
n('s1_2316','s1','Die Uhr','23:16','Am 14.11.1972 schlug die Kula sieben um 23:16.',{show:true,p:'p:tomaz'});
n('s1_soldier','s1','Der Abend','Šaćir: der Soldat','Šaćir, damals Kellner: Ein junger Soldat saß an jenem Abend in der Kafana und fragte jede Viertelstunde nach der Uhrzeit.',{show:true,p:'p:sacir'});
n('s1_closed','s1','Der Abend','Halid sperrte um elf zu','Šaćir: An jenem Abend schloss Halid die Kafana schon um elf. Sonst immer erst um Mitternacht.',{show:true,p:'p:sacir'});
n('s1_curfew','s1','Tomaž','Zapfenstreich','Tomaž: „Um halb zwölf muss ich in der Kaserne sein.“',{show:true,p:'p:tomaz'});
n('s1_left','s1','Der Abend','Er ging kurz nach elf','Tomaž musste kurz nach elf gehen: Die Kafana war zu, um halb zwölf war Zapfenstreich.',{show:true,p:'p:tomaz'});
n('s1_missed','s1','Der Abend','Elf Minuten','Tomaž ging um 23:05. Die Kula schlug sieben um 23:16. Elf Minuten.',{show:true,p:'p:tomaz'});
n('s1_bracelet','s1','Tomaž','Das Kästchen','In Malas Blick hält Tomaž ein Kästchen mit einem gravierten Kupferarmband.',{p:'p:tomaz'});
n('s1_date','s1','Tomaž','14. November 1972','Auftragsbuch Kazandžić, 1972: Armband, Gravur „E. · 14. XI. 1972“, abgeholt am 14.11.1972 um 18:40.',{show:true,p:'p:nedzad'});
n('s1_name','s1','Tomaž','Tomaž Zupan','Im Auftragsbuch: „T. Zupan, vojnik, Ljubljana.“ Tomaž Zupan, Soldat aus Ljubljana.',{p:'p:nedzad'});
n('s1_father','s1','Emina','„Heute sagt sie es ihrem Vater“','Nachhall an Nedžads Werkbank, 1972: Tomaž beim Abholen: „Heute Abend sagt sie es ihrem Vater.“',{p:'p:mala'});
n('s1_waited','s1','Emina','Emina hat gewartet','Emina zu Lejla, hinter der Theke: „Ich habe die ganze Nacht unter der Uhr gewartet. Er kam nicht.“',{show:true,p:'p:emina'});
n('s1_both','s1','Emina','Beide haben gewartet','Widerspruch: Emina wartete unter der Uhr, der Soldat wartete in der Kafana. Beide waren da. Nicht zur selben Zeit.',{show:true,p:'p:emina'});
n('s1_married','s1','Emina','Verheiratet 1975','Lejla: Eminas Vater hat sie 1975 verheiratet. Mit dem Sohn eines Freundes.',{p:'p:lejla'});
n('s1_campus','s1','Tomaž','Die Kaserne gibt es nicht mehr','Lejla: Die alte Kaserne „Maršal Tito“ ist heute der Campus der Universität.',{show:true,p:'p:lejla'});
n('s1_nowrite','s1','Emina','„Warum hat er nie geschrieben?“','Emina: „Und warum hat er nie geschrieben? Kein einziges Mal?“',{show:true,p:'p:emina'});
n('s1_gave','s1','Der Abend','Für Emina','Šaćir: „Der Soldat gab mir etwas für Emina. Ich habe es Halid gegeben.“',{show:true,p:'p:sacir'});
n('s1_hidden','s1','Der Abend','Hinter dem Spiegel','Mala, in der Kammer: Nachhall 1973. Halid schiebt eine Blechkasse hinter den großen Spiegel.',{show:true,p:'p:mala'});
n('s1_away','s1','Emina','Emina geht zur Schwester','Emina zu Lejla: „Ich gehe nachher zu Tante Sabira. Pass auf die Kafana auf.“',{p:'p:emina'});
n('s1_letters','s1','Tomaž','Sechs Briefe','Tomažs Briefe aus Ljubljana: „Ich habe bis elf gewartet. Um halb zwölf musste ich in der Kaserne sein. Ich schreibe, bis du antwortest.“',{show:true,p:'i:letters_tz'});
n('s1_betrayal','s1','Emina','Halid hat sie versteckt','Halid hat Tomažs Briefe und das Armband versteckt. Emina hat sie nie bekommen.',{show:true,p:'i:letters_tz'});
// ---------------------------------------------------------------- Fall 2: Die Leihfrist
n('s2_spook','s2','Das Antiquariat','Es spukt','Jakob: Seit er im Oktober ein Buch ausgestellt hat, fallen nachts Bücher aus den Regalen, und die Türglocke läutet.',{p:'p:jakob'});
n('s2_ivan','s2','Der Leser','Der Leser im Sessel','Mala: Im Lesesessel sitzt ein alter Mann mit runder Brille und liest durch das Glas der Vitrine.',{p:'p:ivan'});
n('s2_due','s2','Der Leser','„Die Frist läuft ab“','Der Geist: „Ich muss es zurückgeben. Die Frist läuft ab.“ Für ihn ist August 1992.',{show:true,p:'p:ivan'});
n('s2_stamp','s2','Das Buch','Leihzettel','Leihzettel im Buch: „Narodna i univerzitetska biblioteka BiH · Leser 2204 · Rückgabe 7. IX 1992“.',{show:true,p:'i:rilke'});
n('s2_buyer','s2','Das Buch','Der Sammler aus Frankfurt','Ein Sammler aus Frankfurt will das Buch nächste Woche kaufen. 900 KM.',{p:'p:jakob'});
n('s2_fire','s2','Das Buch','Die Bibliothek brannte','Jakob: In der Nacht zum 26. August 1992 brannte die Nationalbibliothek in der Vijećnica. Fast alles verbrannte.',{show:true,p:'p:jakob'});
n('s2_noreturn','s2','Der Leser','Er konnte es nicht zurückgeben','Die Frist lief am 7. September ab. Die Bibliothek brannte am 26. August. Er konnte das Buch nie zurückgeben.',{show:true,p:'p:ivan'});
n('s2_ledger','s2','Das Buch','Jakobs Ankaufbuch','Jakobs Ankaufbuch, 2004: „Nachlass Prof. I. B., Obala 14. Verkauft von P. Barać, Wien.“ Mit Telefonnummer.',{show:true,p:'p:jakob'});
n('s2_obit','s2','Der Leser','Der Nachruf','Oslobođenje, 2003: „Prof. Ivan Barać, Germanist und Übersetzer Rilkes, ist im Alter von 82 Jahren gestorben.“',{p:'p:ivan'});
n('s2_provenance','s2','Das Buch','Das Buch gehört der Bibliothek','Das Buch ist ein Leihexemplar der Nationalbibliothek. Barać hat es 1992 ausgeliehen. Es gehört nicht in eine Vitrine.',{show:true,p:'i:rilke'});
n('s2_relic','s2','Der Leser','„Wie eine Reliquie“','Petar Barać am Telefon: „Vater hat es gehütet wie eine Reliquie. Er sagte immer, er müsse es zurückgeben.“',{show:true,p:'p:ivan'});
n('s2_ash','s2','Der Leser','Asche auf dem Balkon','Milka: Am Morgen nach dem Brand stand der Professor auf dem Balkon und fing die Asche mit beiden Händen.',{show:true,p:'p:milka'});
n('s2_fragments','s2','Das Buch','Im Buch liegen die Seiten','Im Buch liegen die verbrannten Seiten der Bibliothek, die Barać vom Himmel gefangen hat. Er wollte sie zurückgeben.',{show:true,p:'i:rilke'});
n('s2_desk','s2','Der Leser','Die Ausleihtheke','Mala, in der Vijećnica: Der Professor steht an der verkohlten Ausleihtheke. „Geschlossen. Wieder geschlossen.“',{show:true,p:'p:ivan'});
n('s2_kurrent','s2','Die Wache','Kurrentschrift','Amra hat eine Bauakte von 1894 in deutscher Kurrentschrift gefunden und kann sie nicht lesen.',{p:'p:amra'});
// ---------------------------------------------------------------- Malas Spur
n('m2_f_saturday','m2','Malas Splitter','Splitter: Samstags','Malas Splitter, als sie meinen Fahrschein sah: „Die Löcher. Samstags. Wir.“',{show:true,p:'p:mala',frag:true});
n('m2_f_clock','m2','Malas Splitter','Splitter: die leuchtende Uhr','Malas Splitter unter der Kula: „Wir trafen uns auch unter einer Uhr. Einer mit leuchtenden Ziffern.“',{show:true,p:'p:mala',frag:true});
n('m2_f_voice','m2','Malas Splitter','Splitter: „Halt dich fest, Mali!“','Malas Splitter beim Foto der Haltestelle: Eine Stimme, ihre eigene: „Halt dich fest, Mali!“ Samstag, 11:10.',{show:true,p:'p:mala',frag:true});
n('m2_f_snow','m2','Malas Splitter','Splitter: der schwarze Schnee','Malas Splitter an der Lateinerbrücke: „Ich habe auch eins gefangen, ein schwarzes Blatt. Ich habe es jemandem geschenkt.“',{show:true,p:'p:mala',frag:true});
n('m2_f_ninth','m2','Malas Splitter','Splitter: neunter Stock','Malas Splitter: „Neunter Stock. Der Aufzug ging nie. Ich habe die Stufen gezählt.“',{show:true,p:'p:mala',frag:true});
n('m2_photo','m2','Die Drei','Foto: Haltestelle 1987','Ein Foto aus Jakobs Kiste: Haltestelle Alipašino Polje, 1987. Hinter der Straßenbahn ein Hochhaus mit einer Uhr auf dem Dach.',{show:true,p:'i:photo_stop'});
n('m2_stop','m2','Die Drei','Die alte Haltestelle','Rade: Die Haltestelle Alipašino Polje lag früher anders. Nach dem Krieg wurde sie verlegt.',{p:'p:rade'});
n('m2_clocktower','m2','Die Drei','Das Hochhaus mit der Uhr','Rade: Nur ein Hochhaus hatte eine Uhr auf dem Dach: das Siebener in der B-Phase. Die Uhr brannte 1992 aus.',{show:true,p:'p:rade'});
n('m2_kids','m2','Die Drei','Die zwei Kinder um 11:10','Rade: Samstags um 11:10 stiegen in Alipašino immer zwei Kinder ein. Ein Mädchen und ein kleiner Junge. Sie nannte ihn „Mali“.',{show:true,p:'p:rade'});
n('m2_building','m2','Die Drei','Mala kennt das Siebener','Die Uhr mit den leuchtenden Ziffern war die Dachuhr des Hochhauses Nr. 7. Mala hat dort jemanden getroffen.',{show:true,p:'p:mala'});
n('m2_alija','m2','Die Drei','Alija vom Kiosk','Alija, der Geist an der alten Kioskstelle: „Das letzte Mal kaufte die Kleine zwei Fahrscheine. Für später, hat sie gesagt.“',{show:true,p:'p:alija'});
n('m2_ticket','m2','Die Drei','Malas Fahrschein','In Malas Dose: ein Fahrschein der Linie 3, mit einem sternförmigen Loch. Hinten: „12.11.93“.',{show:true,p:'i:ticket_m'});
n('m2_notrams','m2','Die Drei','Keine Bahn im November 1993','Rade: „Im November dreiundneunzig fuhr keine einzige Straßenbahn. Nicht eine.“',{show:true,p:'p:rade'});
n('m2_promise','m2','Die Drei','Ein Versprechen','Widerspruch: ein entwerteter Fahrschein für eine Fahrt, die es nicht gab. Kein Fahrschein. Ein Versprechen.',{show:true,p:'i:ticket_m'});
n('m2_marko7','m2','Die Drei','Ich habe im Siebener gewohnt','Ich habe als Kind im Hochhaus Nr. 7 gewohnt. Siebter Stock.',{show:true,p:'p:marko'});
n('m2_mali','m2','Die Drei','Mali','Das Mädchen und der kleine Junge in der Drei, samstags um 11:10, aus dem Siebener. Ich bin samstags zu Großmutter gefahren. Nicht allein.',{show:true,p:'p:marko'});
n('m2_housebook','m2','Haus 7','Das Hausbuch','Hausbuch von Haus 7, 1991: 7. Stock: Vuković, Zoran, Jasna, Marko, Ana. 9. Stock: Delić, Esad, Nada, Lana.',{show:true,p:'p:dragica'});
n('m2_lana','m2','Mala','Lana Delić?','Im Register in Split stand „…ić, L., 17, Sarajevo“. Im neunten Stock von Haus 7 wohnte 1991 Lana Delić, geboren 1976.',{show:true,p:'p:mala'});
n('m2_pupil','m2','Haus 7','Ich war in der Kellerschule','Im Klassenbuch der Kellerschule, 8. Klasse: „Vuković, Marko“. Ich war hier unten. Ich erinnere mich an nichts.',{show:true,p:'p:marko'});
n('m2_drewtrams','m2','Mala','Dieselbe Drei','Die Straßenbahn an Zoras Tafel ist dieselbe wie die Kreide im Salon in Split. Dieselbe Hand.',{show:true,p:'p:mala'});
n('m2_lana_teacher','m2','Mala','„Lana und der kleine Vuković“','Zora zu Mala: „Lana. Du und der kleine Vuković, immer die Straßenbahnen.“',{show:true,p:'p:zora'});
n('m2_lore','m2','Mala','Die Toten erinnern sich mit den Lebenden','Zora: „Wir Toten erinnern uns mit den Lebenden, Kind. Du bist so leer, weil einer dich vergessen hat.“',{show:true,p:'p:zora'});
// ---------------------------------------------------------------- Fall 3: Das verschlossene Zimmer
n('s3_dragica','s3','Haus 7','„Mali Marko vom Siebten“','Dragica, auf ihrem Posten in der Halle, erkennt mich: „Mali Marko vom Siebten!“',{p:'p:dragica'});
n('s3_zora','s3','Zora','Die Lehrerin im Keller','Dragica: Im Krieg hat die Lehrerin Zora unten im Schutzraum Schule gehalten. „Drei Jahre lang. Bei Kerzenlicht.“',{show:true,p:'p:dragica',doneIf:flag('k2.s3.inShelter')});
n('s3_nada','s3','Haus 7','Nada vom Neunten','Dragica: „Nada vom Neunten redet mit keinem mehr. Seit ihre Tochter weg ist.“',{show:true,p:'p:dragica',doneIf:flag('k2.f2.nadaOpen')});
n('s3_roll','s3','Zora','Jemand ruft Namen auf','Mala, hinter der Stahltür: Im Dunkeln steht eine Frau an einer Tafel und ruft Namen auf. Keiner antwortet.',{show:true,p:'p:zora'});
n('s3_locked','s3','Der Schlüssel','Šehić hat den Schlüssel','Šehić, Vorsitzender des Hausrats, hat den Schlüssel zum Schutzraum. „Nur mit Beschluss!“',{show:true,p:'p:sehic',doneIf:function(G){ return G.inv.indexOf('key_shelter')>=0||!!G.flags['k2.s3.inShelter']; }});
n('s3_hanka','s3','Der Schlüssel','Hanka','Mala, an Šehićs Tür: Er spricht mit dem Foto seiner Frau. „Ich habe den Keller zugesperrt, Hanka. Damit keiner mehr da unten sitzen muss.“',{show:true,p:'p:sehic',doneIf:function(G){ return G.inv.indexOf('key_shelter')>=0||!!G.flags['k2.s3.inShelter']; }});
n('s3_bell','s3','Zora','Die Klingel','Mirza: „Früher klingelte es unten, wenn oben jemand den Knopf drückte. Damit die Kinder kamen.“',{show:true,p:'p:mirza',doneIf:flag('k2.s3.deskkey')});
n('s3_deskkey','s3','Zora','Unter dem Pult','Mala: Als die Klingel ging, holte Zora einen kleinen Schlüssel unter dem Pult hervor. „Pause vorbei!“',{show:true,p:'p:zora',doneIf:function(G){ return G.inv.indexOf('deskkey')>=0||!!G.flags['k2.s3.cabinet']; }});
n('s3_register','s3','Zora','Die Namen','Im Klassenbuch: die Namen der Kinder der Kellerschule, 1993/94. Mirza Hodžić, Selma Karić, Damir Kovač und viele andere.',{show:true,p:'i:dnevnik'});
n('s3_guilt','s3','Zora','„Moja krivica“','Klassenbuch, 22.1.1994, Zoras Schrift: „Mirza H. – ranjen. Moja krivica.“ Verwundet. Meine Schuld.',{show:true,p:'i:dnevnik'});
n('s3_helper','s3','Zora','Die Helferin','Klassenbuch: „Pomoćnica, crtanje: Lana Delić“. Helferin, Zeichnen.',{show:true,p:'i:dnevnik'});
n('s3_stamp','s3','Zora','„Mit Stempel“','Zora: „Wenn alle da sind, verteile ich die Zeugnisse. Mit Stempel. Damit es zählt.“',{show:true,p:'p:zora',doneIf:flag('k2.s3.stamped')});
n('s3_rescued','s3','Zora','„Sie hat mich hineingetragen“','Mirza: „Ihre Schuld? Sie ist hinausgelaufen, in die Splitter, und hat mich hineingetragen.“',{show:true,p:'p:mirza'});
n('s3_truth','s3','Zora','Keine Schuld','Widerspruch: Zora hielt für ihre Schuld, was ihre Tat war. Sie hat Mirza das Leben gerettet. Er lebt.',{show:true,p:'p:zora'});
n('s3_board','s3','Zora','Die Tafel','Mala sieht an Zoras Tafel, unter Rechnungen und Namen, eine Straßenbahn mit der Nummer 3, mit Kreide gezeichnet.',{show:true,p:'p:mala'});
// ---------------------------------------------------------------- Finale
n('f2_parcel','f2','Der Karton','Paket 4471','Sanjas SMS: „Paket 4471, Busbahnhof Sarajevo, ab Mittwoch 14 Uhr. Pass auf dich auf.“',{show:true,p:'i:mobitel',doneIf:function(G){ return G.inv.indexOf('karton')>=0||!!G.flags['k2.f2.opened']; }});
n('f2_photo','f2','Lana','Das ganze Foto','Die beiden Hälften passen: Großmutter Ruža, ich mit zehn, und ein Mädchen mit Zopf. „Mala i Mali · 1988“.',{show:true,p:'i:photo_full'});
n('f2_memory','f2','Lana','Ich erinnere mich','Lana Delić vom neunten Stock. Samstags die Drei. Sie nannte mich Mali, ich sie Mala. Ich habe ihr diesen Namen gegeben.',{show:true,p:'p:mala'});
n('f2_room','f2','Lana','Lanas Zimmer','Nada hat Lanas Zimmer seit 1993 nicht geöffnet. Für mich hat sie es aufgeschlossen.',{p:'p:nada'});
n('f2_postcard','f2','Lana','Die Postkarte','Postkarte aus Split an Nada, Januar 1994: „Mama, ich komme nach Hause. Ich hole Mali.“',{show:true,p:'p:nada'});
n('f2_missing','f2','Lana','Vermisst','Nada: „Sie ist nie angekommen. Für das Rote Kreuz ist sie vermisst. Seit siebzehn Jahren.“',{show:true,p:'p:nada'});
n('f2_oven','f2','Lana','Am Ofen','Mala, in Großmutters Küche: Nachhall Januar 1994. Großmutter liest ein Formular, weint, und legt es in das Wärmefach des Herds.',{show:true,p:'p:mala',doneIf:function(G){ return G.inv.indexOf('rcm')>=0||!!G.flags['k2.f2.rcmRead']; }});
n('f2_rcm','f2','Lana','Die Rotkreuz-Nachricht','Rotkreuz-Nachricht vom 18.12.1993: „Mali, ich warte jeden Abend auf der Treppe im Hotel Palma. Wenn du nicht kommst, komme ich dich holen.“',{show:true,p:'i:rcm'});
n('f2_cameback','f2','Lana','Sie kam mich holen','Lana ist im Januar 1994 von Split losgefahren, um mich zu holen. Ich habe ihre Nachricht nie bekommen.',{show:true,p:'p:mala'});
n('f2_whyabreise','f2','Lana','Darum steht bei Abreise nichts','Im Register steht bei „Abreise“ nichts, weil sie nicht abgereist ist. Sie ist aufgebrochen. Zu mir.',{show:true,p:'p:mala'});
n('f2_bridge','f2','Lana','Die Brücke','Malas letzter Splitter: ein Lastwagen, eine Brücke, die nicht mehr da war, und Wasser. Ihre Leine zeigt jetzt nach Südwesten.',{show:true,p:'p:mala'});
M.defineNotes(N);
// ---------------------------------------------------------------- Gruppen und Erledigung
M.NOTE_GROUPS.p2=['Ankunft','Mala']; M.NOTE_GROUPS.s1=['Tomaž','Die Uhr','Der Abend','Emina']; M.NOTE_GROUPS.s2=['Der Leser','Das Buch','Das Antiquariat','Die Wache'];
M.NOTE_GROUPS.s3=['Haus 7','Zora','Der Schlüssel']; M.NOTE_GROUPS.m2=['Malas Splitter','Die Drei','Haus 7','Mala','Aus Split']; M.NOTE_GROUPS.f2=['Der Karton','Lana'];
function by(id,list){ var x=M.NOTES[id]; x.doneBy=(x.doneBy||[]).concat(list); }
function done(id,fn){ M.NOTES[id].doneIf=fn; }
by('s1_note',['s1_twosevens']); by('s1_alaturka',['s1_twosevens']); by('s1_sunset',['s1_2316']); by('s1_2316',['s1_missed']); by('s1_closed',['s1_left']); by('s1_curfew',['s1_left']); by('s1_left',['s1_missed']);
by('s1_soldier',['s1_both']); by('s1_waited',['s1_both']); by('s1_letters',['s1_betrayal']); by('s1_hidden',['s1_betrayal','s1_betrayal']); by('s1_gave',['s1_hidden']);
['s1_missed','s1_both','s1_betrayal','s1_nowrite','s1_date'].forEach(function(id){ done(id,flag('k2.s1.emina')); });
['s1_twosevens','s1_campus'].forEach(function(id){ done(id,flag('k2.s1.free')); });
by('s2_stamp',['s2_provenance']); by('s2_ledger',['s2_provenance']); by('s2_ash',['s2_fragments']); by('s2_relic',['s2_fragments']); by('s2_due',['s2_noreturn']); by('s2_fire',['s2_noreturn']);
['s2_provenance','s2_fragments'].forEach(function(id){ done(id,function(G){ return G.inv.indexOf('rilke')>=0||!!G.flags['k2.s2.free']; }); });
['s2_noreturn','s2_desk'].forEach(function(id){ done(id,flag('k2.s2.free')); });
by('m2_f_clock',['m2_building']); by('m2_clocktower',['m2_building']); by('m2_ticket',['m2_promise']); by('m2_notrams',['m2_promise']); by('m2_kids',['m2_mali']); by('m2_marko7',['m2_mali']);
by('m2_photo',['m2_clocktower']); done('m2_building',flag('k2.s3.arrived')); done('m2_alija',function(G){ return G.notes.indexOf('m2_ticket')>=0; });
by('m2_split_register',['m2_lana','f2_whyabreise']); by('m2_housebook',['m2_lana']); by('m2_f_ninth',['m2_lana']); by('m2_split_chalk',['m2_drewtrams']); by('s3_board',['m2_drewtrams']);
by('m2_f_saturday',['m2_mali']); by('m2_f_voice',['m2_mali']); by('m2_f_snow',['f2_memory']); by('m2_split_journal',['f2_whyabreise']);
['m2_promise','m2_mali','m2_lana','m2_pupil','m2_drewtrams','m2_lana_teacher','m2_lore'].forEach(function(id){ done(id,flag('k2.f2.opened')); });
by('s3_guilt',['s3_truth']); by('s3_rescued',['s3_truth']); done('s3_truth',flag('k2.s3.free')); ['s3_register','s3_helper','s3_roll'].forEach(function(id){ done(id,flag('k2.s3.free')); });
by('f2_rcm',['f2_cameback']); by('f2_postcard',['f2_cameback']); by('f2_cameback',['f2_whyabreise']); ['f2_photo','f2_memory','f2_missing','f2_whyabreise'].forEach(function(id){ done(id,flag('k2.f2.ride')); });
done('f2_bridge',flag('k2.epi.done'));
Object.keys(N).forEach(function(id){ var x=M.NOTES[id]; if (!x.p) x.p=x.c==='m2'?'p:mala':null; });
// ---------------------------------------------------------------- Schlussfolgerungen und Widersprüche
function has(G,id){ return G.notes.indexOf(id)>=0; }
M.defineDeductions({
  's1_note+s1_alaturka':{to:'s1_twosevens',say:'„Wenn die Kula sieben schlägt.“ Nicht sieben Uhr. Sieben Stunden nach Sonnenuntergang. Sie haben dieselbe Zahl gesagt und verschiedene Zeiten gemeint.'},
  's1_note+s1_clock':{to:'s1_twosevens',if:function(G){ return has(G,'s1_alaturka'); },no:'Die Uhr geht anders. Aber nach welcher Regel?',say:'Ihre Sieben war die Sieben der Kula. Er hat nach seiner Uhr gewartet.'},
  's1_twosevens+s1_sunset':{to:'s1_2316',say:'Sonnenuntergang 16:16, dazu sieben Stunden: 23:16. Da hat die Kula sieben geschlagen.'},
  's1_closed+s1_curfew':{to:'s1_left',say:'Die Kafana war um elf zu, und um halb zwölf musste er in der Kaserne sein. Er ist gegangen, weil er musste.'},
  's1_left+s1_2316':{to:'s1_missed',say:'Er ging kurz nach elf. Sie kam um 23:16. Elf Minuten.'},
  's1_soldier+s1_waited':{to:'s1_both',say:'Sie sagt, er kam nicht. Šaćir sagt, er saß den ganzen Abend in der Kafana. Beide haben gewartet. Nur nicht zur selben Zeit.'},
  's1_letters+s1_hidden':{to:'s1_betrayal',say:'Er hat geschrieben. Sechsmal. Und Halid hat jeden Brief hinter den Spiegel gesteckt.'},
  's1_letters+s1_gave':{to:'s1_betrayal',if:function(G){ return has(G,'s1_hidden'); },no:'Halid hat etwas bekommen. Aber wo ist es geblieben?',say:'Šaćir gab es Halid, und Halid gab es nie weiter. Die Briefe lagen hinter dem Spiegel.'},
  's2_stamp+s2_ledger':{to:'s2_provenance',say:'Ein Bibliotheksstempel und ein Nachlass. Der Professor hat es ausgeliehen, sein Sohn hat es verkauft. Es gehört der Bibliothek.'},
  's2_due+s2_fire':{to:'s2_noreturn',say:'Frist am 7. September. Am 26. August brannte die Bibliothek. Er konnte es nicht zurückgeben, weil es niemanden mehr gab, dem er es geben konnte.'},
  's2_stamp+s2_fire':{to:'s2_noreturn',if:function(G){ return has(G,'s2_due'); },no:'Ein Leihzettel und ein Feuer. Was hat er selbst dazu gesagt?',say:'Er wollte zurückgeben, was es nicht mehr gab. Die Frist lief nach dem Feuer ab.'},
  's2_ash+s2_relic':{to:'s2_fragments',say:'Er fing die Asche auf, und er hütete das Buch wie eine Reliquie. Die verbrannten Seiten sind im Buch.'},
  's3_guilt+s3_rescued':{to:'s3_truth',say:'„Meine Schuld“, schreibt sie. „Sie hat mich hineingetragen“, sagt er. Sie hat ihr Leben lang für eine Schuld gehalten, was eine Rettung war.'},
  'm2_split_chalk+s3_board':{to:'m2_drewtrams',say:'Dieselbe Drei. Dieselben zu vielen Fenster. Wer im Salon in Split gezeichnet hat, hat auch hier gezeichnet.'},
  'm2_f_clock+m2_clocktower':{to:'m2_building',say:'Eine Uhr mit leuchtenden Ziffern. Die Uhr auf dem Siebener. Mala hat sich dort mit jemandem getroffen.'},
  'm2_f_clock+m2_photo':{to:'m2_building',if:function(G){ return has(G,'m2_clocktower'); },no:'Eine Uhr auf einem Hochhaus. Aber auf welchem?',say:'Die Uhr auf dem Foto ist die Uhr aus Malas Splitter.'},
  'm2_ticket+m2_notrams':{to:'m2_promise',say:'Ein Fahrschein, entwertet für eine Fahrt im November dreiundneunzig. Aber da fuhr keine Bahn. Das war kein Fahrschein. Das war ein Versprechen.'},
  'm2_alija+m2_notrams':{to:'m2_promise',if:function(G){ return has(G,'m2_ticket'); },no:'Zwei Fahrscheine, „für später“. Aber ich habe keinen gesehen.',say:'Zwei Fahrscheine für eine Bahn, die nicht fuhr. Für später. Für nach dem Krieg.'},
  'm2_kids+m2_marko7':{to:'m2_mali',say:'Das Mädchen und der kleine Junge aus dem Siebener, samstags um 11:10. Ich bin samstags zu Großmutter gefahren. Ich war der Junge. Ich war Mali.'},
  'm2_split_register+m2_housebook':{to:'m2_lana',if:function(G){ return has(G,'m2_f_ninth'); },no:'Viele Namen enden auf „ić“. Welches Stockwerk?',say:'„…ić, L., 17.“ Delić, Lana, neunter Stock, geboren 1976. Sie war siebzehn im Winter dreiundneunzig.'},
  'm2_f_ninth+m2_housebook':{to:'m2_lana',if:function(G){ return has(G,'m2_split_register'); },no:'Im neunten Stock wohnten die Delić. Aber was hat das mit Mala zu tun?',say:'Neunter Stock: Delić. Lana. Und im Register in Split: „…ić, L., 17, Sarajevo.“'},
  'f2_rcm+f2_postcard':{to:'f2_cameback',say:'„Wenn du nicht kommst, komme ich dich holen.“ Und an ihre Mutter: „Ich hole Mali.“ Sie ist losgefahren. Zu mir.'},
  'f2_cameback+m2_split_register':{to:'f2_whyabreise',say:'Darum steht bei „Abreise“ nichts. Sie ist nicht abgereist. Sie ist aufgebrochen.'},
  'f2_rcm+m2_split_journal':{to:'f2_whyabreise',if:function(G){ return has(G,'f2_cameback'); },no:'Sie hat auf der Treppe gewartet. Und dann?',say:'Sie wartete auf der Treppe, jeden Abend. Bis sie aufhörte zu warten und losging.'}
});
// nach bestimmten Schlüssen öffnet sich ein Ort auf dem Stadtplan
M.onDeduce=function(to,G){ if (to==='m2_building'){ G.map.neboder=true; } if (to==='s1_twosevens'){ G.map.ferhadija=true; } };
// ---------------------------------------------------------------- Antworten bei falschen Verbindungen: je nach Figur, Fall und Wiederholung
var POOL={
  same:['Zwei Dinge, die nebeneinander liegen. Mehr nicht.','Ich drehe es hin und her. Es greift nicht.','Das passt nicht. Noch nicht, oder gar nicht.','Nein. Da ziehe ich einen Faden, der nirgends festgemacht ist.','Klingt gut, stimmt aber nicht. Das kenne ich vom Übersetzen.'],
  cross:['Das sind zwei verschiedene Geschichten. Die eine weiß nichts von der anderen.','Zwei Fälle, zwei Tote. Ich sollte sie nicht vermischen.','Nein. Jeder wartet auf etwas Eigenes.'],
  mala:['Mala würde sagen: „Du denkst zu viel.“ Vielleicht hat sie recht.','Mit Mala hat das nichts zu tun. Oder ich will es nicht sehen.','Ich suche überall nach ihr. Hier ist sie nicht.'],
  again:['Das habe ich schon versucht.','Noch einmal dasselbe. Es wird nicht richtiger.']
};
M.noCombo=function(a,b,G){ var A=M.NOTES[a]||{}, B=M.NOTES[b]||{}; if (M.chapterOf(G)!==2) return 'Das hängt nicht zusammen.';
  var key='nc.'+[a,b].sort().join('+'); G.cyc=G.cyc||{};
  if (G.flags[key]){ var k0=G.cyc.ncA=(G.cyc.ncA||0)+1; return POOL.again[k0%POOL.again.length]; } G.flags[key]=true;
  var pool=(A.c===B.c)?POOL.same:((A.c==='m2'||B.c==='m2')?POOL.mala:POOL.cross), k=G.cyc['nc_'+pool.length]=(G.cyc['nc_'+pool.length]||0)+1;
  return pool[k%pool.length]; };
})(M);
