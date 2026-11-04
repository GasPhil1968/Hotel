/* Bosnisch/Kroatisch – Kapitel 1: rooms/bar.js, Nachtrag (Dienstag: Sanja und der Brief aus Triest; Donnerstagmorgen: Sanjas Zettel,
   Malas Rückkehr auf den Stuhl gegenüber; Hotspots Stuhl, Zettel, Zeitung; M.readNewspaper)
   Sprachformen (STYLE_BHS.md): Sanja = Standardkroatisch mit leichter Split-Färbung, duzt Marko; Marko = Standardkroatisch,
   an Mala { hr, bs } (bs = Sarajevo-Bosnisch); Mala und g:{…} = Sarajevo-Bosnisch; Erzähler, Namen, Titel = Standardkroatisch.
   Dokumente: der Brief aus Triest und Markos italienischer Satz bleiben italienisch, Sanjas Zettel ist schon kroatisch (Einträge auf sich selbst). */
(function(M){ 'use strict'; if (!M.trAdd) return;
M.trAdd('bhs', {

  // ================================================================ Dienstag: Sanja (Menü vor und nach dem Brief)
  'Gleich, Marko. Setz dich. Ich komme.': 'Samo malo, Marko. Sjedni. Dolazim.',
  'Ich habe zwei Hände, und beide sind voll. Setz dich.': 'Imam dvije ruke i obje su mi pune. Sjedni.',
  'Setz dich. Ich bringe ihn dir.': 'Sjedni. Donijet ću ti je.',
  'Hat Triest schon angerufen?': 'Je li Trst već zvao?',
  'Um vier. Ich lese ihm deinen Satz vor. Auf Italienisch.': 'U četiri. Pročitat ću mu tvoju rečenicu. Na talijanskom.',
  'Er wird weinen. Oder um Prozente feilschen. Bei Triestinern ist das dasselbe.': 'Plakat će. Ili će se cjenkati oko postotaka. Kod Tršćana je to isto.',
  'Kanntest du Ivka Perić?': 'Jesi li poznavala Ivku Perić?',
  'Die alte Frau von der Mole? Jeder kannte sie. Keiner kannte sie.': 'Onu staricu s mola? Svi su je znali. Nitko je nije poznavao.',
  'Herein kam sie nie. Einmal hat sie draußen unter der Markise gewartet, als es geschüttet hat. Ich habe ihr einen Kaffee rausgebracht.': 'Unutra nikad nije ulazila. Jednom je čekala vani pod tendom dok je pljuštalo. Iznijela sam joj kavu.',
  'Sie hat ihn getrunken und mir die Tasse gespült zurückgegeben. Gespült.': 'Popila ju je i vratila mi šalicu opranu. Opranu.',
  'Ich muss los.': 'Moram ići.',
  'Geh. Und iss etwas. Du siehst aus wie dein eigener Nachruf.': 'Idi. I pojedi nešto. Izgledaš kao vlastiti nekrolog.',

  // ================================================================ Dienstag: Markos Tisch, der Brief aus Triest
  'Mein Platz. Von hier sieht man die Tür und ein Stück Hafen.': 'Moje mjesto. Odavde se vide vrata i komadić luke.',
  'Du sitzt da wie einer, der auf ein Urteil wartet.': 'Sjediš tu kao netko tko čeka presudu.',
  'Ich warte auf einen Kaffee. Das Urteil kommt später.': 'Čekam kavu. Presuda dolazi kasnije.',
  'Ich meinte nicht den Kaffee.': 'Nisam mislila na kavu.',
  'Da. Der Brief. Lies.': 'Evo. Pismo. Čitaj.',
  // der Brief (italienisch, bleibt); „1°“ ist ausgeschrieben, weil die Prüfung das Zeichen ° nicht zulässt – gleiches Italienisch
  'Torrefazione Giuliana · Trieste': 'Torrefazione Giuliana · Trieste',
  'Gentile Signora Sanja,': 'Gentile Signora Sanja,',
  'dal 1° dicembre il prezzo del nostro caffè': 'dal primo dicembre il prezzo del nostro caffè',
  'aumenterà del nove per cento.': 'aumenterà del nove per cento.',
  'Ci scusiamo per l’inconveniente.': 'Ci scusiamo per l’inconveniente.',
  'Le consegne restano il martedì.': 'Le consegne restano il martedì.',
  'Cordiali saluti, Paolo Giuliani': 'Cordiali saluti, Paolo Giuliani',
  // Marko gibt den Brief für Sanja auf Kroatisch wieder
  '„Ab dem ersten Dezember wird unser Kaffee um neun Prozent teurer. Wir bitten die Unannehmlichkeit zu entschuldigen. Geliefert wird weiter dienstags.“': '„Od prvog prosinca naša će kava poskupjeti za devet posto. Ispričavamo se zbog neugodnosti. Isporuke su i dalje utorkom.“',
  'Neun Prozent. Und dafür ein Satz Entschuldigung.': 'Devet posto. I za to jedna rečenica isprike.',
  'Schreib ihm. Schreib: Wenn er mit neun Prozent kommt, kaufe ich ab Januar bei den Neapolitanern.': 'Napiši mu. Napiši: ako mi dođe s devet posto, od siječnja kupujem kod onih iz Napulja.',
  'So schreibe ich das nicht.': 'Tako to neću napisati.',
  'Weil er es so liest, wie du es meinst.': 'Zato što će to pročitati onako kako ti to misliš.',
  // die drei Antwortfassungen (nur Auswahl, Marko spricht sie nicht)
  'Wörtlich: „Neun Prozent? Dann eben die Neapolitaner.“': 'Doslovno: „Devet posto? Onda kod onih iz Napulja.“',
  'Höflich: „Wir verstehen und nehmen die Erhöhung an.“': 'Uljudno: „Razumijemo i prihvaćamo poskupljenje.“',
  'Fest: „Ab Januar ja. Sonst prüfen wir andere Angebote.“': 'Odlučno: „Od siječnja da. Inače ćemo razmotriti druge ponude.“',
  'Die Antwort nach Triest': 'Odgovor za Trst',
  'Genau das.': 'Baš to.',
  'Dann liefert er dir ab morgen gar nichts mehr. Er ist aus Triest. Die sind empfindlich, wenn es um Neapel geht.': 'Onda ti od sutra neće isporučiti više ništa. On je iz Trsta. Oni su osjetljivi kad je riječ o Napulju.',
  'Ich will ihn ärgern. Nicht verlieren.': 'Hoću ga naljutiti. Ne izgubiti.',
  '„Annehmen“? Ich nehme gar nichts an.': '„Prihvaćamo“? Ma ja ništa ne prihvaćam.',
  'So klingt es aber.': 'Ali tako zvuči.',
  'Dann schreib es nicht.': 'Onda to ne piši.',
  // Markos Satz nach Triest (italienisch, bleibt)
  '„Possiamo accettare un aumento a partire da gennaio. Altrimenti valuteremo altre offerte.“': '„Possiamo accettare un aumento a partire da gennaio. Altrimenti valuteremo altre offerte.“',
  '„Andere Angebote prüfen.“ Klingt, als hätte ich welche.': '„Razmotriti druge ponude.“ Zvuči kao da ih imam.',
  'Klingt so. Meistens reicht das.': 'Tako zvuči. Obično je to dovoljno.',
  'Du bist gefährlich, Marko.': 'Opasan si, Marko.',

  // ---- Übelkeit, Sanjas Frage nach seinem Befinden, Smalltalk, Rechnungen
  'Wo war ich?': 'Gdje sam stao?',
  'Bei den anderen Angeboten.': 'Kod drugih ponuda.',
  'Marko. Du bist grau im Gesicht.': 'Marko. Siv si u licu.',
  'Mir ist seit Tagen schwindlig. Wahrscheinlich der Jugo.': 'Već mi se danima vrti u glavi. Vjerojatno jugo.',
  'Ich bin Übersetzer. Uns geht es nie gut, nur genau.': 'Ja sam prevoditelj. Nama nikad nije dobro, samo točno.',
  'Nichts. Dein Kaffee.': 'Ništa. Tvoja kava.',
  'Seit Tagen? Dann geh zum Arzt. Nicht zum Jugo.': 'Danima? Onda idi doktoru. Ne jugu.',
  'Wenn es bis Freitag nicht weg ist.': 'Ako ne prođe do petka.',
  'Das hast du letzten Freitag auch gesagt.': 'To si rekao i prošlog petka.',
  'Witzig.': 'Duhovito.',
  'Geh trotzdem zum Arzt. Genau.': 'Svejedno idi doktoru. Točno.',
  'Mein Kaffee ist nicht schuld. Mein Kaffee ist das Einzige hier, das nie schuld ist.': 'Moja kava nije kriva. Moja kava je jedino ovdje što nikad nije krivo.',
  'Warst du am Wochenende draußen? Unter Menschen?': 'Jesi li za vikend izlazio? Među ljude?',
  'Ich war mit einem Wörterbuch spazieren.': 'Šetao sam s rječnikom.',
  'Mit welchem?': 'S kojim?',
  'Mit dem dicken.': 'S onim debelim.',
  'Der Kaffee geht aufs Haus. Wegen Triest.': 'Kava je na račun kuće. Zbog Trsta.',
  'Seit wann?': 'Otkad?',
  'Seit heute. Die elf vom Oktober schreibe ich trotzdem weiter an.': 'Od danas. Onih jedanaest iz listopada ipak ti i dalje zapisujem.',
  'Elf Kaffee. Ich führe auch Buch. Nur nicht so genau.': 'Jedanaest kava. I ja vodim knjige. Samo ne tako točno.',

  // ================================================================ Donnerstagmorgen: Sanja begrüßt ihn (je nach Antwort vom Dienstag)
  'Die „Bura“ am Morgen. Vor elf gehört sie fast mir.': '„Bura“ ujutro. Prije jedanaest gotovo je samo moja.',
  'Und? Dreht sich der Boden noch?': 'I? Vrti li se još pod?',
  'Na, Herr Übersetzer. Heute genau oder heute gut?': 'E, gospodine prevoditelju. Danas točno ili danas dobro?',
  'Mein Kaffee war es übrigens nicht. Ich habe ihn selbst getrunken. Mir geht es blendend.': 'Usput, nije bilo do moje kave. Sama sam je pila. Meni je odlično.',
  'Heute steht er.': 'Danas stoji.',
  'Heute gut. Ausnahmsweise.': 'Danas dobro. Za promjenu.',
  'Gestern Abend warst du noch grau. Heute nur blass.': 'Sinoć si još bio siv. Danas si samo blijed.',
  'Du bist in der Zeitung. Seite vierzehn. „Die Stillen“.': 'U novinama si. Stranica četrnaest. „Tihi“.',
  'Das mit den Mützen. Den kleinen Ante kenne ich. Der trägt sie jeden Tag.': 'Ono s kapama. Maloga Antu znam. On svoju nosi svaki dan.',   // wie Vesna in bhs_k1_j.js
  '„Angehörige sind nicht bekannt.“ Klingt wie die Stadt, Marko.': '„Nema poznate rodbine.“ Zvuči kao grad, Marko.',   // Zitat aus der Zeitung (wie Markos Auftragsnotiz); „grad“ wie in bhs_k1_j.js („Grad je napisao …“)
  'Aber der Anfang ist schön.': 'Ali početak je lijep.',
  'Setz dich. Ich bringe ihn dir. Stipe und Frane kommen erst um elf, du hast deine Ruhe.': 'Sjedni. Donijet ću ti je. Stipe i Frane dolaze tek u jedanaest, imaš mira.',

  // ---- Donnerstagmorgen: Menü, Sanjas Zettel
  'Setz dich, Marko. Ich bringe ihn dir.': 'Sjedni, Marko. Donijet ću ti je.',
  'Dein Tisch ist frei. Wie immer um diese Zeit.': 'Stol ti je slobodan. Kao i uvijek u ovo doba.',
  'Du machst am Montag zu? Inventur?': 'Zatvaraš u ponedjeljak? Inventura?',
  'Die Maschine pfeift. Die Bura kommt. Stipe schuldet mir Geld. Wie immer.': 'Aparat pišti. Bura dolazi. Stipe mi je dužan. Kao i uvijek.',
  'Ja. Montag zu. Sag es nicht weiter, bevor ich es Stipe gesagt habe.': 'Da. U ponedjeljak zatvoreno. Nemoj nikome reći dok to ne kažem Stipi.',
  'Zwölf.': 'Dvanaest.',
  'Zwölf?': 'Dvanaest?',
  'Kaffee. Seit Oktober. Ich führe Buch.': 'Kava. Od listopada. Vodim knjige.',
  'Es steht auf deinem Zettel.': 'Piše na tvojoj ceduljici.',
  'Den habe ich um halb acht geschrieben. Da war hier noch zu.': 'Napisala sam je u pola osam. Tad je ovdje još bilo zatvoreno.',
  'Und von deinem Tisch aus kann man den nicht lesen. Ich kann ihn von hier kaum lesen.': 'A s tvog stola ne može se pročitati. Ja je i odavde jedva čitam.',
  'Da.': 'Evo.',                            // Sanja reicht ihm den Zettel
  'Montag zu. Inventur. Ich wollte es Stipe und Frane nachher sagen. Sie werden jammern.': 'U ponedjeljak zatvoreno. Inventura. Htjela sam to poslije reći Stipi i Frani. Kukat će.',
  'Und jetzt sag mir, wie du das gemacht hast.': 'A sad mi reci kako si to izveo.',
  '„Gute Augen.“': '„Dobre oči.“',
  '„Jemand hat es mir vorgelesen.“': '„Netko mi je to pročitao.“',
  '(Nur lächeln.)': '(Samo se nasmiješiti.)',
  'Wer? Dein Kaffee?': 'Tko? Tvoja kava?',
  'Du hältst die Zeitung eine Armlänge weit weg, Marko.': 'Novine držiš na ispruženoj ruci, Marko.',
  'Lächle nicht so. Das kenne ich von dir nicht.': 'Ne smiješi se tako. Takvog te ne poznajem.',
  // danach Mala (Bosnisch) und Marko an Mala
  'Und?': 'I?',
  'Da liegt ein Zettel. Und darauf steht, was du gesagt hast.': { hr:'Ondje je ceduljica. I na njoj piše ono što si rekla.', bs:'Tamo je ceduljica. I na njoj piše ono šta si rekla.' },
  'Das ist ein Anfang.': 'To je početak.',
  'Ich will ans Wasser. Nicht weit.': 'Hoću do vode. Ne daleko.',
  // Sanjas Zettel (schon kroatisch im Original)
  'ČETVRTAK': 'ČETVRTAK',
  'mlijeko 6 l, limun 2 kg': 'mlijeko 6 l, limun 2 kg',
  'nazvati Ivicu – aparat opet pišti!': 'nazvati Ivicu – aparat opet pišti!',
  'PONEDJELJAK ZATVORENO – inventura': 'PONEDJELJAK ZATVORENO – inventura',
  '(reći Stipi i Frani!!)': '(reći Stipi i Frani!!)',
  'Ein Zettel, mit Kugelschreiber': 'Ceduljica, kemijskom olovkom',

  // ================================================================ Donnerstagmorgen: Markos Tisch, Mala kehrt zurück (M.malaReturns)
  'Mein Platz. Gegenüber Mala. Sanja wischt den Tresen und tut, als sähe sie nichts.': 'Moje mjesto. Preko puta je Mala. Sanja briše šank i pravi se da ništa ne vidi.',
  'Mein Platz. Gegenüber sitzt Mala. Der Stuhl merkt nichts davon.': 'Moje mjesto. Preko puta sjedi Mala. Stolica ništa ne primjećuje.',
  'Sanja stellt die Tasse hin und geht zurück hinter den Tresen. Sie weiß, wann man mich lässt.': 'Sanja spusti šalicu i vrati se za šank. Zna kad me treba pustiti na miru.',
  'Der erste Kaffee seit Tagen, den nicht ich gemacht habe.': 'Prvi put nakon više dana pijem kavu koju nisam sam skuhao.',
  'Der Stuhl gegenüber ist nicht mehr leer.': 'Stolica preko puta više nije prazna.',
  // Malas Gruß heißt im deutschen Quelltext jetzt „Morgen, Marko.“ (vorher „Morgen.“, gleichlautend mit „morgen“ in Sustipan)
  'Morgen, Marko.': 'Jutro, Marko.',   // Mala
  // Marko an Mala: { hr, bs }, auch wo beide Fassungen gleich lauten
  'Ich habe dich geträumt.': { hr:'Sanjao sam te.', bs:'Sanjao sam te.' },
  'Du hast geschlafen. Das ist nicht dasselbe.': 'Spavao si. To nije isto.',
  'Heute Morgen warst du nicht da.': { hr:'Jutros te nije bilo.', bs:'Jutros te nije bilo.' },
  'Du hast mich nicht gesehen. Das ist auch nicht dasselbe.': 'Nisi me vidio. Ni to nije isto.',
  '„Steh auf. Ich hatte einen guten Morgen. Den ersten seit einer Woche.“': { hr:'„Ustani. Imao sam dobro jutro. Prvo nakon cijelog tjedna.“', bs:'„Ustani. Imao sam dobro jutro. Prvo nakon cijele sedmice.“' },
  '„Dann zeig mir, dass du jetzt hier bist. Wirklich hier.“': { hr:'„Onda mi pokaži da si sada ovdje. Stvarno ovdje.“', bs:'„Onda mi pokaži da si sad tu. Stvarno tu.“' },
  '(Lange ausatmen.) „Dann bin ich wenigstens nicht verrückt geworden. Oder nicht nur.“': { hr:'(Dugo izdahnuti.) „Onda barem nisam poludio. Ili ne samo to.“', bs:'(Dugo izdahnuti.) „Onda bar nisam poludio. Ili ne samo to.“' },
  'Du hast mich heute Morgen weggeträumt. Das war nicht schön.': 'Jutros si me pretvorio u san. To nije bilo lijepo.',
  'Ich habe neben deinem Bett gesessen und gewartet, dass du mich wieder siehst.': 'Sjedila sam pored tvog kreveta i čekala da me opet vidiš.',
  'Gleich. Erst frag mich, wo ich war.': 'Samo malo. Prvo me pitaj gdje sam bila.',
  'Nicht verrückt.': 'Nisi poludio.',
  'Ich war froh, als du die Tasse abgestellt hast. Da hast du hochgesehen.': 'Bilo mi je drago kad si spustio šoljicu. Tad si podigao pogled.',
  'Hier. Bei dir. Weit weg kann ich nicht, das weißt du.': 'Tu. Kod tebe. Daleko ne mogu, znaš to.',
  'Seit wir durch das Tor zurück sind, ist es … dünner. Als wäre unterwegs etwas verrutscht. Ich habe gerufen. Du hast durch mich hindurchgesehen.': 'Otkad smo se vratili kroz kapiju, nekako je … tanje. Kao da se usput nešto pomjerilo. Zvala sam te. Gledao si kroz mene.',
  'Und jetzt?': { hr:'A sad?', bs:'A sad?' },
  'Jetzt nicht mehr. Ich weiß nicht, warum. Ich weiß nicht, ob es wiederkommt.': 'Sad više ne. Ne znam zašto. Ne znam da li će se vratiti.',
  'Ich will nicht nur glauben, was du sagst. Ich will es prüfen. Hier. Jetzt.': { hr:'Ne želim ti samo vjerovati na riječ. Želim to provjeriti. Ovdje. Sada.', bs:'Neću samo da ti vjerujem na riječ. Hoću da provjerim. Ovdje. Sad.' },
  'Dann such dir etwas aus.': 'Onda izaberi nešto.',

  // ================================================================ Hotspots (Namen = Oberfläche, look/use/take/read = Marko, g = Mala)
  'Sie zählt Milchflaschen, halblaut. Bei sechs hört sie auf.': 'Broji flaše mlijeka, poluglasno. Na šestoj stane.',
  'Stuhl gegenüber': 'Stolica preko puta',
  'Mala sitzt darauf. Der Stuhl merkt nichts davon.': 'Na njoj sjedi Mala. Stolica ništa ne primjećuje.',
  'Der Stuhl gegenüber. Wenn sich jemand zu mir setzt, dann dort. Meistens Sanja, wenn sie etwas will.': 'Stolica preko puta. Ako mi netko prisjedne, onda tamo. Najčešće Sanja, kad nešto hoće.',
  'Das ist nicht mein Platz. Meiner ist gegenüber.': 'To nije moje mjesto. Moje je preko puta.',
  'Sein Gegenüber. Hier sitze ich gern.': 'Preko puta njega. Tu volim da sjedim.',
  'Zettel hinter dem Tresen': 'Ceduljica iza šanka',
  'Ein Zettel auf dem Tresen, auf Sanjas Seite, direkt unter der Lampe. Mit Kugelschreiber, mit vielen Ausrufezeichen. Von hier kann ich ihn nicht lesen. Und hinter Sanjas Tresen geht niemand.': 'Ceduljica na šanku, sa Sanjine strane, točno ispod lampe. Pisana kemijskom olovkom, s puno uskličnika. Odavde je ne mogu pročitati. A iza Sanjina šanka nitko ne ide.',
  'Hinter Sanjas Tresen greife ich nicht. Niemand tut das, der hier noch Kaffee will.': 'Iza Sanjina šanka ne posežem. To ne radi nitko tko ovdje još želi kavu.',
  'Zu weit weg. Und er liegt mit der Schrift zu Sanja.': 'Predaleko je. I okrenuta je tekstom prema Sanji.',
  // Mala liest Marko den (kroatischen) Zettel vor, in ihren Worten
  '„Donnerstag. Milch, sechs Liter. Zitronen, zwei Kilo. Ivica anrufen – die Maschine pfeift schon wieder. Montag geschlossen, Inventur. Stipe und Frane sagen, mit zwei Ausrufezeichen.“': '„Četvrtak. Mlijeko, šest litara. Limun, dvije kile. Nazvati Ivicu – aparat opet pišti. Ponedjeljak zatvoreno – inventura. Reći Stipi i Frani, s dva uzvičnika.“',
  'Ich fasse ihn nicht an. Ich kann ihn nur lesen.': 'Ne diram je. Mogu je samo pročitati.',

  // ================================================================ Raum betreten
  'Die Bar „Bura“. Hier habe ich mehr Seiten übersetzt als zu Hause. Das Licht ist besser. Der Kaffee auch, aber das sage ich Sanja nicht.': 'Bar „Bura“. Ovdje sam preveo više stranica nego doma. Svjetlo je bolje. I kava je bolja, ali to Sanji ne govorim.',
  'Marko! Setz dich. Gleich.': 'Marko! Sjedni. Samo malo.',
  'Inzwischen sind Stipe und Frane da. Und die Bura auch. Sie drückt gegen die Scheiben.': 'U međuvremenu su stigli Stipe i Frane. I bura. Upire u stakla.',

  // ================================================================ Zeitung (M.readNewspaper): neue Zeilen
  'Familie hatte sie keine mehr. Aber in Veli Varoš tragen die Kinder ihre Mützen, die Nachbarn ihre Socken, und der Kater schläft auf einer Decke aus ihren Resten.': 'Obitelji više nije imala. Ali u Velom Varošu djeca nose njezine kape, susjedi njezine čarape, a mačak spava na dekici od ostataka njezine vune.',
  'Angehörige sind nicht bekannt.': 'Nema poznate rodbine.',
  'Gesendet · Di., 23:48 · Die Stillen': 'Poslano · uto., 23:48 · Tihi'
});
})(M);
