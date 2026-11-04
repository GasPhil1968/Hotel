/* ===== 11_notes.js — das Notizbuch: Hinweise (c = zu welchem Fall) und Schlussfolgerungen (zwei Notizen verbinden) ===== */
(function(M){
'use strict';
M.defineNotes({
  // Prolog
  pro_auftrag:{c:'c1',t:'Auftrag: 2.000 Zeichen über Ivka Perić (85), Veli Varoš 14. Keine bekannten Verwandten.'},
  pro_zdenka:{c:'c1',t:'Die Nachbarin, Gospođa Zdenka, hat den Schlüssel.'},
  pro_riva:{c:'c1',t:'Zdenka: Ivka ging jeden Abend um sieben zur Riva. Seit 1984.'},
  pro_sohn:{c:'c1',t:'Zdenka: Ivkas Sohn kam 1984 nicht nach Hause. „Die Bura.“'},
  pro_noone:{c:'c1',t:'Vesna, aus der Notiz der Stadt: „alleinstehend, keine Kontakte zur Nachbarschaft.“',s:'Laut Stadt: keine Kontakte.'},
  pro_knit:{c:'c1',t:'Zdenka: Ivka hat für die halbe Gasse gestrickt, Socken, Mützen, alles. Nur für sich nie.'},
  pro_list:{c:'c1',t:'Ivkas Strickheft „Za Božić 2011.“: eine Mütze für Ante, Socken für Zdenkas Enkelinnen, ein Schal, Socken für die Armen von Sv. Nikola, eine Decke für den Kater, Schals für den Chor.',s:'Ivkas Strickheft.'},
  pro_people:{c:'c1',t:'Keine Familie heißt nicht: niemand. Ivka hatte keine Angehörigen mehr – aber eine ganze Gasse, für die sie strickte.',s:'Keine Familie heißt nicht: niemand.'},
  pro_gasse:{c:'c1',t:'Zdenka: „Fragen Sie in der Gasse, wer nichts von ihr trägt. Da müssen Sie lange fragen.“'},
  pro_spia:{c:'c1',t:'Seite 31: „Warten, bis die Leuchte erlischt.“ Welche? Die Maschine hat zwei. Die Zeichnung auf Seite 12 fehlt.',s:'S. 31: Welche Leuchte?'},
  pro_red:{c:'c1',t:'Seite 30: Die rote Leuchte (5) zeigt den Druck im Kessel, die grüne (6) heißt: betriebsbereit.',s:'S. 30: Rot heißt Druck.'},
  pro_notice:{c:'c1',t:'Todesanzeige an Ivkas Tür: „Nach kurzer Krankheit verstarb im Alter von 85 Jahren Ivka Perić.“ Beerdigung am 13.11.2011.'},
  c1_boat7:{c:'c1',t:'Tonći wollte am 22.12.1984 mit dem Boot um sieben aus Supetar kommen.',s:'Tonći wollte mit dem Boot um sieben kommen.'},
  c1_dinko:{c:'c1',t:'Tonći auf der Postkarte: „Dinko kommt mit.“'},
  c1_gift:{c:'c1',t:'Tonći schrieb: „Ich bringe dir etwas mit.“'},
  c1_ankica:{c:'c1',t:'Foto: Tonći und Dinko auf dem Fischerboot ANKICA, Sommer 1984.'},
  c1_radio:{c:'c1',t:'Ivkas Radio schaltete sich von selbst ein. Eine alte Bura-Warnung.'},
  // Fall 1
  c1_waits:{c:'c1',t:'Ivka wartet am Ende der Mole auf das Siebenuhrboot aus Supetar.'},
  c1_date:{c:'c1',t:'Für Ivka ist heute der 22. Dezember 1984.'},
  c1_askoffice:{c:'c1',t:'Ivka: „Fragen Sie im Hafenbüro, warum das Boot so spät ist.“'},
  c1_years:{c:'c1',t:'Nachhall an der Mole: Jahr für Jahr dieselbe Frau, an derselben Stelle.'},
  c1_nobook:{c:'c1',t:'Der Band 1984 ist nicht im Regal. Mladen findet ihn nicht.'},
  c1_1948:{c:'c1',t:'Mala: Der Band 1984 steht im Archiv bei „1948“.'},
  c1_ferry:{c:'c1',t:'Fahrtenbuch: Am 22.12.1984 fiel die Fähre aus Supetar wegen der Bura aus.',s:'Die Fähre fiel wegen der Bura aus.'},
  c1_capsized:{c:'c1',t:'Fahrtenbuch: Um 21:40 kenterte das Fischerboot ANKICA vor Sustipan.'},
  c1_rescued:{c:'c1',t:'Fahrtenbuch: Gerettet Dinko Matić (19). Vermisst Antonio Perić (22).'},
  c1_matejuska:{c:'c1',t:'Mladen: Dinko Matić flickt seine Netze an der Matejuška.'},
  c1_came:{c:'c1',t:'Tonći hat nicht auf die Fähre gewartet – er kam mit Dinko auf der ANKICA.',s:'Tonći kam mit der ANKICA.'},
  c1_aboard:{c:'c1',t:'Tonći und Dinko waren auf der ANKICA, als sie kenterte.'},
  c1_never:{c:'c1',t:'Zdenka: Dinko war in 27 Jahren nie bei Ivka. Auf der Beerdigung blieb er an der Mauer stehen.'},
  c1_noglove:{c:'c1',t:'Zdenka: Ivka trug nie Handschuhe. „Sonst spüre ich nicht, wann die Bura kommt.“'},
  c1_brother:{c:'c1',t:'Dinko über Tonći: „Er war wie ein Bruder.“'},
  c1_bag:{c:'c1',t:'In Dinkos Schuppen liegt ein alter Seesack mit den Buchstaben T.P.'},
  c1_words:{c:'c1',t:'Tonćis letzte Worte im Wasser: „Halt die Tasche! Sie ist für Mama!“',s:'Tonćis letzte Worte.'},
  c1_candle:{c:'c1',t:'An Dinkos Wand: Tonćis Foto, ein Kerzenstummel. Jedes Jahr am 22. Dezember.'},
  c1_story:{c:'c1',t:'Dinko: Tonći wollte sein Versprechen halten. Sie fuhren trotz Bura mit der ANKICA los.'},
  c1_stuck:{c:'c1',t:'Tonćis Brief: Das Salz hat die Seiten zusammengebacken. Trocken bekomme ich ihn nicht auf, ohne dass er reißt.'},
  c1_letter:{c:'c1',t:'Tonćis Brief: „Warte nicht mehr an der Mole auf mich. Warte zu Hause, im Warmen.“',s:'Tonćis Brief, ganz gelesen.'},
  c1_plaque:{c:'c1',t:'In Sustipan steht Tonćis Name auf der Tafel „Denen, die das Meer behielt“.'},
  c1_jakov:{c:'c1',t:'Jakov: „Jedes Jahr kommt ein Mann und steht vor dieser Tafel.“'},
  // Mala
  m_find:{c:'mala',t:'Nachts, in der Scheibe: „Du kannst mit ihnen reden. Ich kann sie finden.“'},
  m_window:{c:'mala',t:'Nachts, in der Scheibe: ein Mädchen hinter mir. Dann mein Name.'},
  m_first:{c:'mala',t:'Mala fragte nach meinem ersten richtigen Schwindel. Am letzten Poller. „Und vor dir war auch jemand.“'},
  m_limits:{c:'mala',t:'Mala geht durch Türen und hört, was an Dingen hängt. Anfassen kann sie nichts, nicht einmal ein Glas Wasser. Weit weg von mir kann sie nicht.',s:'Was Mala kann und was nicht.'},
  i1_note:{c:'mala',t:'Mala hat Sanjas Zettel hinter dem Tresen gelesen: „Montag geschlossen – Inventur. Stipe und Frane sagen!!“',s:'Sanjas Zettel.'},
  m_voice:{c:'mala',t:'Auf der Mole, hinter mir, eine Stimme: „Du siehst sie also auch.“ Hinter mir war niemand.'},
  m_tram:{c:'mala',t:'Auf der beschlagenen Scheibe in meiner Wohnung: eine Straßenbahn mit einer Drei. Ich habe sie nicht gemalt.'},
  m_name:{c:'mala',t:'Sie hat einen Namen: Mala. „So sagt man zu kleinen Mädchen.“ – „Es reicht.“'},
  m_horn:{c:'mala',t:'Mala hält inne, wenn ein Fährenhorn tutet.'},
  m_bells:{c:'mala',t:'Bei den Glocken von Sveti Duje verschwindet Mala für einen Moment. „Zu laut.“'},
  m_leash:{c:'mala',t:'Mala sieht an Ivka eine Leine aus Licht, festgemacht am Poller. „Wie ein Boot, das niemand mehr losmacht.“'},
  m_tin:{c:'mala',t:'Mala trägt eine verbeulte Blechdose. Sie sagt nur: „Meins.“'},
  m_mother:{c:'mala',t:'Ivka zu Mala: „Kind, du frierst ja. Wo ist deine Mutter?“ Mala schwieg.'},
  m_flight:{c:'mala',t:'Luka: „Bist du auch auf der Flucht?“ Mala: „Nicht mehr.“'},
  m_sarajevo:{c:'mala',t:'Mala kennt Sarajevo: die Linie 3, die Kohleöfen im Winter.'},
  m_jakov:{c:'mala',t:'Jakov grüßte Mala wie eine alte Bekannte: „Du schon wieder, Kleine?“'},
  m_waited:{c:'mala',t:'Mala: „Ich glaube, ich habe auf jemanden gewartet. Ich weiß nicht mehr, ob er gekommen ist.“'},
  m_31:{c:'mala',t:'Bruno nannte Mala „die Kleine aus 31“: „Du bist zurückgekommen.“'},
  m_register:{c:'mala',t:'Flüchtlingsregister 1993, Zimmer 31: „…ić, L., 17, Sarajevo. Ankunft 28.11.1993. Abreise: –“'},
  m_journal:{c:'mala',t:'Brunos Nachtbuch, 2.12.1993: „Die Kleine aus 31 wartet wieder auf der Treppe.“'},
  m_chalk:{c:'mala',t:'Im Salon, unter der Farbe: eine Straßenbahn mit der Nummer 3, ein Mädchen mit Zopf, „KUĆA“.'},
  // Fall 2
  c2_demolish:{c:'c2',t:'Die alte Ledana am Fischerhafen wird am Montag abgerissen.'},
  c2_boy:{c:'c2',t:'Stipe: 1999 ist in der Ledana ein junger Mann gestorben.'},
  c2_stairs:{c:'c2',t:'Dinko: „Pass auf die Treppe in der Ledana auf. Die ist morsch.“'},
  c2_gap:{c:'c2',t:'Mala: Hinter den Fischkisten ist ein loses Zaunfeld.'},
  c2_luka:{c:'c2',t:'Oben in der Ledana sitzt ein junger Geist mit Gitarre: Luka.'},
  c2_meet:{c:'c2',t:'Luka will Nina um halb neun am Kiosk am Fährterminal treffen.',s:'Treffpunkt: der Kiosk am Fährterminal.'},
  c2_ferry:{c:'c2',t:'Luka und Nina wollen mit der Nachtfähre um 21:00 nach Ancona.'},
  c2_date:{c:'c2',t:'Für Luka ist heute der 23. August 1999.'},
  c2_guitar:{c:'c2',t:'Luka hat seine Gitarre im Kühlraum der Ledana versteckt.'},
  c2_mailbox:{c:'c2',t:'Luka und Nina lassen sich Zettel im „Briefkasten“: dem lockeren Ziegel an der Rampe.'},
  c2_dark:{c:'c2',t:'Im Kühlraum ist es stockdunkel. Ich sehe meine eigene Hand nicht.'},
  c2_under:{c:'c2',t:'Mala: Unter dem Schutt im Kühlraum liegt ein Koffer. Er hat ihn dort versteckt, bevor die Decke kam.'},
  c2_case:{c:'c2',t:'Mala: Im Kühlraum liegt Lukas Gitarrenkoffer. Darin zwei Tickets und eine Kassette.'},
  c2_paper:{c:'c2',t:'Mala: Hinter dem lockeren Ziegel steckt ein gefaltetes Papier.'},
  c2_thin:{c:'c2',t:'Der Ziegel sitzt fest in der Fuge. Mit dem Brecheisen käme die halbe Wand mit.'},
  c2_died:{c:'c2',t:'Sanja: Luka wurde drei Tage später gefunden, am Fuß der Treppe in der Ledana.',s:'Luka starb an der Treppe.'},
  c2_stayed:{c:'c2',t:'Sanja: Nina ist nie aus Split weggegangen.'},
  c2_shop:{c:'c2',t:'Nina hat einen kleinen Rahmenladen in der Altstadt: „Okvir“.'},
  c2_riva:{c:'c2',t:'Sanja: Luka spielte im Sommer an der Riva Gitarre. Nina hörte immer zu.'},
  c2_unused:{c:'c2',t:'Hinterzimmer: Ninas Fährticket vom 23.08.1999 – gerahmt, nie entwertet.',s:'Ninas Ticket wurde nie entwertet.'},
  c2_paintings:{c:'c2',t:'Nina malt seit Jahren dieselbe Fähre und eine Gestalt, die am Kiosk wartet.'},
  c2_echo:{c:'c2',t:'Nachhall: Nina wartete am Kiosk, bis die Fähre weg war. Dann auf der Bank, bis zum Morgen.'},
  c2_waited:{c:'c2',t:'Nina ist nicht gefahren – sie hat am Kiosk auf Luka gewartet.',s:'Nina hat am Kiosk gewartet.'},
  c2_mira1:{c:'c2',t:'Mira: Ein Mädchen wartete bis zum Morgen. Ich gab ihr einen Kaffee. Sie sagte kein Wort.'},
  c2_mira2:{c:'c2',t:'Mira: Der Junge kaufte am Vormittag zwei Tickets. Er hat gestrahlt.'},
  c2_note:{c:'c2',t:'Ninas Zettel: „Ich habe bis zum letzten Schiff gewartet. Ich bin nicht wütend. Morgen bin ich wieder da.“',s:'Ninas Zettel von 1999.'},
  c2_tape:{c:'c2',t:'Luka: „Sag ihr, ich hab ein Lied für sie. Die Kassette ist im Koffer. Sie soll es hören.“'},
  c2_tonight:{c:'c2',t:'Nina: „Heute Abend. An der Rampe. Wenn die Fähre ablegt.“'},
  // Fall 3
  c3_job:{c:'c3',t:'Ljerka Lalić vom Hotel Palma braucht Übersetzungen für den Verkauf am Montag.'},
  c3_father:{c:'c3',t:'Ljerkas Vater Bruno war 32 Jahre Nachtportier im Palma. „Er hat hinter dem Tresen gewohnt.“'},
  c3_salon:{c:'c3',t:'Der Salon ist seit 1993 verschlossen. Damals wohnten Flüchtlinge darin.'},
  c3_dance:{c:'c3',t:'Nachtbuch: Sonntags nach Mitternacht tanzten Bruno und Danica im Salon. „Večer na Rivi“.'},
  c3_danica:{c:'c3',t:'Nachtbuch: Danica starb am 3.3.1975 um 4:10. „Ich war nicht bei ihr. Ich war am Empfang.“'},
  c3_zagreb:{c:'c3',t:'Nachtbuch, 21.6.1975: „Brief aus Zagreb für Lj. Ich kann nicht. Noch nicht. Ich habe ihn dorthin gelegt, wo sie nicht mehr spielt.“',s:'„…dorthin gelegt, wo sie nicht mehr spielt.“'},
  c3_kids:{c:'c3',t:'Nachtbuch, 11.1993: 22 Menschen im Salon. „Die Kinder malen an die Wände. Sollen sie.“'},
  c3_stroke:{c:'c3',t:'Das Nachtbuch bricht am 14.12.1993 mitten im Satz ab.'},
  c3_bruno:{c:'c3',t:'In der Portiersloge sitzt Brunos Geist. Ihm fehlen die Worte.'},
  c3_f13:{c:'c3',t:'Bruno: „trinaest … Mantel … Haken“'},
  c3_fcrank:{c:'c3',t:'Bruno: „nema glazbe … ručka“ – keine Musik … Kurbel.'},
  c3_fletter:{c:'c3',t:'Bruno: „Ljerka … pismo“ – Ljerka … Brief.'},
  c3_img_coat:{c:'c3',t:'Mala sieht in Brunos Bruchstücken einen Mantel an Haken 13.'},
  c3_img_crank:{c:'c3',t:'Mala sieht eine Kurbel in einer Schublade, unter dem Telefonbuch.'},
  c3_img_hands:{c:'c3',t:'Mala sieht kleine Hände auf Klaviertasten.'},
  c3_img_env:{c:'c3',t:'Mala sieht einen Umschlag mit rotem Stempel. Zagreb.'},
  c3_sunday:{c:'c3',t:'Bruno: „Danica. Jeden Sonntag. Nach Mitternacht.“'},
  c3_wanted:{c:'c3',t:'Bruno: „Sie hat so schön gespielt … sie wollte nach Zagreb.“'},
  c3_bench:{c:'c3',t:'Mala: Im Klavierhocker liegt etwas Schweres. „Papier. Und Angst.“'},
  c3_accept:{c:'c3',t:'Im Klavierhocker: die Zusage der Musikakademie Zagreb für Ljerka, Juni 1975.',s:'Die Zusage aus Zagreb.'},
  c3_unfinished:{c:'c3',t:'Brunos Brief an Ljerka bricht nach drei Wörtern ab: „Ljerka, ja sam …“'},
  c3_hid:{c:'c3',t:'Bruno hat Ljerkas Zusage versteckt – aus Angst, mit dem Hotel allein zu bleiben.',s:'Bruno hat die Zusage versteckt.'},
  c3_message:{c:'c3',t:'Brunos Botschaft: „Ljerka, verzeih mir. Ich habe deinen Brief aus Zagreb versteckt, weil ich Angst hatte, allein zu sein. Spiel wieder.“',s:'Brunos Botschaft, übersetzt.'}
});
M.defineDeductions({
  // Prolog: die Notiz der Stadt gegen Ivkas eigenes Heft
  'pro_noone+pro_list':{to:'pro_people',say:'Die Stadt hat Verwandte gezählt. Menschen hat sie nicht gezählt.'},
  'pro_knit+pro_list':{to:'pro_people',if:function(GS){ return GS.notes.indexOf('pro_noone')>=0; },no:'Zdenka hatte recht. Nur: Wem widerspricht das?',say:'Zdenka hatte recht. Und die Stadt schreibt trotzdem: keine Kontakte.'},
  'pro_noone+pro_knit':function(A){ return {ok:false,t:'Zdenka sagt das eine, die Stadt das andere. Ich brauche etwas, das Ivka selbst geschrieben hat.'}; },
  'pro_spia+pro_red':function(A){ return {ok:false,t:'Rot heißt Druck. Beim Kesseldeckel geht es um Druck. Also die rote. So schreibe ich es.'}; },
  'c1_boat7+c1_ferry':{to:'c1_came',say:'Die Fähre fuhr nicht. Und Tonći hat trotzdem versprochen zu kommen. Er hat nicht gewartet.'},
  'c1_ferry+c1_capsized':{to:'c1_came',if:function(GS){ return GS.notes.indexOf('c1_boat7')>=0; },no:'Da fehlt noch, wer auf dem Boot war.',say:'Keine Fähre, aber ein Fischerboot in der Bura. Er hat nicht gewartet.'},
  'c1_ankica+c1_capsized':{to:'c1_aboard',say:'Das Boot auf dem Foto. Das Boot im Fahrtenbuch. Dasselbe.'},
  'c1_aboard+c1_boat7':{to:'c1_came',say:'Er wollte um sieben da sein. Die Fähre fuhr nicht. Also nahm er die ANKICA.'},
  'c2_unused+c2_meet':{to:'c2_waited',say:'Ein Ticket, nie entwertet. Ein Treffpunkt am Kiosk. Sie ist nicht gefahren. Sie hat gewartet.'},
  'c2_echo+c2_meet':{to:'c2_waited',say:'Sie stand am Kiosk, bis die Fähre weg war. Sie hat auf ihn gewartet.'},
  'c2_unused+c2_ferry':{to:'c2_waited',if:function(GS){ return GS.notes.indexOf('c2_meet')>=0; },no:'Wo hätte sie warten sollen?',say:'Sie hatte ein Ticket für dieselbe Fähre und hat es nie benutzt. Sie hat auf ihn gewartet.'},
  'c3_zagreb+c3_accept':{to:'c3_hid',say:'„Dorthin, wo sie nicht mehr spielt.“ In den Klavierhocker. Er hat es ihr nie gesagt.'},
  'c3_zagreb+c3_wanted':{to:'c3_hid',if:function(GS){ return GS.notes.indexOf('c3_accept')>=0; },no:'Ich ahne es. Aber ich habe den Brief noch nicht gefunden.',say:'Sie wollte nach Zagreb. Und der Brief aus Zagreb kam nie bei ihr an.'}
});
// ---------------------------------------------------------------- Register: Gruppe, kurzer Titel, wann eine Notiz erledigt ist
M.NOTE_GROUPS={ c1:['Ivka','Tonći','Das Boot','Dinko','Arbeit'], c2:['Luka','Nina','Die Ledana'], c3:['Bruno','Ljerka','Das Nachtbuch','Brunos Bilder'], mala:['Die Stimme','Mala'] };
function inv(id){ return function(G){ return G.inv.indexOf(id)>=0; }; }
function flag(k){ return function(G){ return !!G.flags[k]; }; }
function rs(room,k){ return function(G){ return !!(G.rooms[room]&&G.rooms[room][k]); }; }
var META={
  pro_auftrag:['Ivka','Der Auftrag: 2.000 Zeichen',flag('pro.article')], pro_zdenka:['Ivka','Zdenka hat den Schlüssel',flag('pro.visited')], pro_riva:['Ivka','Jeden Abend zur Riva'],
  pro_sohn:['Tonći','Der Sohn kam nicht heim'], pro_notice:['Ivka','Die Todesanzeige'],
  pro_noone:['Ivka','Laut Stadt: keine Kontakte',['pro_people']], pro_knit:['Ivka','Strickte für die halbe Gasse',['pro_people']], pro_list:['Ivka','Ivkas Strickheft',['pro_gasse']],
  pro_people:['Ivka','Keine Familie heißt nicht: niemand',flag('pro.article')], pro_gasse:['Ivka','„Wer trägt nichts von ihr?“',flag('pro.article')],
  pro_spia:['Arbeit','S. 31: Welche Leuchte?',flag('pro.translated')], pro_red:['Arbeit','S. 30: Rot heißt Druck',flag('pro.translated')],
  m_window:['Die Stimme','Ein Mädchen in der Scheibe'], m_first:['Mala','Der erste Schwindel'], m_limits:['Mala','Was sie kann und was nicht'], i1_note:['Mala','Sanjas Zettel',flag('split.afterIvka.verified')],
  c1_boat7:['Tonći','Das Boot um sieben'], c1_dinko:['Tonći','„Dinko kommt mit.“'], c1_gift:['Tonći','„Ich bringe dir etwas mit.“'], c1_ankica:['Das Boot','Foto: die ANKICA, 1984'],
  c1_radio:['Ivka','Das Radio ging an'], c1_waits:['Ivka','Sie wartet an der Mole'], c1_date:['Ivka','Für sie ist der 22.12.1984'], c1_askoffice:['Ivka','„Fragen Sie im Hafenbüro.“',['c1_ferry']],
  c1_years:['Ivka','Nachhall am Poller'], c1_nobook:['Das Boot','Der Band 1984 fehlt',['c1_1948','c1_ferry']], c1_1948:['Das Boot','Der Band steht bei „1948“',['c1_ferry']],
  c1_ferry:['Das Boot','Die Fähre fiel aus'], c1_capsized:['Das Boot','21:40: die ANKICA kentert'], c1_rescued:['Das Boot','Gerettet: nur Dinko'],
  c1_matejuska:['Dinko','Dinko an der Matejuška',['c1_brother','c1_story','c1_bag']], c1_came:['Tonći','Tonći kam mit der ANKICA'], c1_aboard:['Das Boot','Beide auf der ANKICA'],
  c1_never:['Dinko','Dinko war nie bei Ivka'], c1_noglove:['Ivka','Ivka trug nie Handschuhe'], c1_brother:['Dinko','„Er war wie ein Bruder.“',['c1_story']], c1_bag:['Dinko','Der Seesack mit T.P.',['c1_story']],
  c1_words:['Dinko','Tonćis letzte Worte',['c1_story']], c1_candle:['Dinko','Die Kerze am 22. Dezember',['c1_story']], c1_story:['Dinko','Dinkos Geschichte'], c1_letter:['Tonći','Tonćis Brief, ganz gelesen'],
  c1_plaque:['Tonći','Die Tafel in Sustipan'], c1_jakov:['Tonći','Ein Mann vor der Tafel'],
  m_find:['Die Stimme','„Ich kann sie finden.“'], m_voice:['Die Stimme','Eine Stimme hinter mir'], m_tram:['Die Stimme','Straßenbahn am Fenster'], m_name:['Mala','Sie heißt Mala'],
  c1_stuck:['Tonći','Der Brief klebt zusammen',flag('c1.letterOpen')], c2_dark:['Die Ledana','Der Kühlraum ist dunkel',['c2_case']], c2_under:['Luka','Unter dem Schutt: ein Koffer',['c2_case']], m_horn:['Mala','Das Fährhorn'], m_bells:['Mala','Die Glocken sind ihr zu laut'], m_leash:['Mala','Die Leine aus Licht'], m_tin:['Mala','Die Blechdose: „Meins.“'],
  m_mother:['Mala','„Wo ist deine Mutter?“'], m_flight:['Mala','„Auch auf der Flucht?“'], m_sarajevo:['Mala','Sie kennt Sarajevo'], m_jakov:['Mala','Jakov kennt sie'], m_waited:['Mala','Sie hat gewartet'],
  m_31:['Mala','„Die Kleine aus 31“'], m_register:['Mala','Register 1993, Zimmer 31'], m_journal:['Mala','Die Kleine auf der Treppe'], m_chalk:['Mala','Kreide: Straßenbahn 3'],
  c2_demolish:['Die Ledana','Abriss am Montag'], c2_boy:['Die Ledana','1999 starb dort ein Junge',['c2_luka','c2_died']], c2_stairs:['Die Ledana','Die morsche Treppe'], c2_gap:['Die Ledana','Loses Zaunfeld',rs('matejuska','cratesMoved')],
  c2_luka:['Luka','Luka oben auf der Galerie'], c2_meet:['Luka','Treffpunkt: der Kiosk'], c2_ferry:['Luka','Die Fähre um 21:00'], c2_date:['Luka','Für ihn ist der 23.8.1999'],
  c2_guitar:['Luka','Die Gitarre im Kühlraum',['c2_case']], c2_mailbox:['Luka','Der Briefkasten-Ziegel',['c2_note']], c2_case:['Luka','Tickets und Kassette'], c2_paper:['Die Ledana','Papier hinter dem Ziegel',['c2_note']],
  c2_thin:['Die Ledana','Der Ziegel sitzt fest',['c2_note']], c2_died:['Luka','Luka starb an der Treppe'], c2_stayed:['Nina','Nina ist geblieben'], c2_shop:['Nina','Ninas Laden „Okvir“'], c2_riva:['Nina','Nina hörte ihm zu'],
  c2_unused:['Nina','Ninas Ticket, unbenutzt'], c2_paintings:['Nina','Ninas Bilder'], c2_echo:['Nina','Nachhall am Kiosk'], c2_waited:['Nina','Nina hat am Kiosk gewartet'],
  c2_mira1:['Nina','Mira: das Mädchen am Kiosk'], c2_mira2:['Luka','Mira: zwei Tickets'], c2_note:['Nina','Ninas Zettel von 1999'], c2_tape:['Luka','„Sag ihr, ich hab ein Lied.“'], c2_tonight:['Nina','„Heute Abend.“'],
  c3_job:['Ljerka','Übersetzungen bis Montag'], c3_father:['Ljerka','Bruno, der Nachtportier'], c3_salon:['Ljerka','Der Salon, seit 1993 zu'], c3_dance:['Das Nachtbuch','Sonntags Tanz im Salon'],
  c3_danica:['Das Nachtbuch','3.3.1975: Danica stirbt'], c3_zagreb:['Das Nachtbuch','„…wo sie nicht mehr spielt.“'], c3_kids:['Das Nachtbuch','1993: Kinder im Salon'], c3_stroke:['Das Nachtbuch','Das Buch bricht ab'],
  c3_bruno:['Bruno','Bruno in der Portiersloge'], c3_f13:['Bruno','„trinaest … Haken“',inv('keyring')], c3_fcrank:['Bruno','„nema glazbe … ručka“',rs('palma','crankFound')], c3_fletter:['Bruno','„Ljerka … pismo“'],
  c3_img_coat:['Brunos Bilder','Ein Mantel an Haken 13',inv('keyring')], c3_img_crank:['Brunos Bilder','Die versteckte Kurbel',rs('palma','crankFound')], c3_img_hands:['Brunos Bilder','Kleine Hände am Klavier'], c3_img_env:['Brunos Bilder','Umschlag mit rotem Stempel'],
  c3_sunday:['Bruno','„Danica. Jeden Sonntag.“'], c3_wanted:['Bruno','„Sie wollte nach Zagreb.“'], c3_bench:['Brunos Bilder','Etwas im Klavierhocker',['c3_accept']], c3_accept:['Ljerka','Die Zusage aus Zagreb'],
  c3_unfinished:['Bruno','„Ljerka, ja sam …“'], c3_hid:['Bruno','Bruno hat sie versteckt'], c3_message:['Bruno','Brunos Botschaft']
};
Object.keys(META).forEach(function(id){ var n=M.NOTES[id], m=META[id]; if (!n) return; n.g=m[0]; n.s=m[1]; if (Array.isArray(m[2])) n.doneBy=m[2]; else if (typeof m[2]==='function') n.doneIf=m[2]; });
Object.keys(M.NOTES).forEach(function(id){ if (!M.NOTES[id].g) console.warn('Notiz ohne Gruppe: '+id); });
// ---------------------------------------------------------------- Kartenbilder (p:Porträt, i:Gegenstand) und strengeres Ausdünnen
var PIC={ pro_auftrag:'i:newspaper', pro_zdenka:'p:zdenka', pro_riva:'p:ivka', pro_sohn:'i:photo1', pro_notice:'p:ivka',
  c1_boat7:'i:postcard', c1_dinko:'i:postcard', c1_gift:'i:postcard', c1_ankica:'i:photo1', c1_radio:'i:radio', c1_waits:'p:ivka', c1_date:'p:ivka', c1_askoffice:'p:ivka', c1_years:'p:ivka',
  c1_nobook:'p:mladen', c1_1948:'p:mala', c1_ferry:'p:mladen', c1_capsized:'p:mladen', c1_rescued:'p:dinko', c1_matejuska:'p:dinko', c1_came:'i:photo1', c1_aboard:'i:photo1',
  c1_never:'p:zdenka', c1_noglove:'i:gloves', c1_brother:'p:dinko', c1_bag:'p:dinko', c1_words:'p:dinko', c1_candle:'p:dinko', c1_story:'p:dinko', c1_stuck:'i:letter_t', c1_letter:'i:letter_t',
  c1_plaque:'p:jakov', c1_jakov:'p:jakov',
  c2_demolish:'p:sanja', c2_boy:'p:stipe', c2_stairs:'p:dinko', c2_gap:'p:mala', c2_luka:'p:luka', c2_meet:'p:luka', c2_ferry:'i:tickets', c2_date:'p:luka', c2_guitar:'p:luka', c2_mailbox:'p:luka',
  c2_case:'i:tickets', c2_paper:'p:mala', c2_thin:'i:crowbar', c2_dark:'p:mala', c2_under:'p:mala', c2_died:'p:sanja', c2_stayed:'p:sanja', c2_shop:'p:nina', c2_riva:'p:sanja', c2_unused:'i:tickets',
  c2_paintings:'p:nina', c2_echo:'p:nina', c2_waited:'p:nina', c2_mira1:'p:mira', c2_mira2:'p:mira', c2_note:'i:note_n', c2_tape:'i:cassette', c2_tonight:'p:nina',
  c3_job:'p:ljerka', c3_father:'p:ljerka', c3_salon:'p:ljerka', c3_dance:'i:photo2', c3_danica:'i:documents', c3_zagreb:'i:documents', c3_kids:'i:documents', c3_stroke:'i:documents',
  c3_bruno:'p:bruno', c3_f13:'p:bruno', c3_fcrank:'p:bruno', c3_fletter:'p:bruno', c3_img_coat:'i:keyring', c3_img_crank:'i:crank', c3_img_hands:'i:musicbook', c3_img_env:'i:envelope',
  c3_sunday:'i:photo2', c3_wanted:'i:musicbook', c3_bench:'p:mala', c3_accept:'i:envelope', c3_unfinished:'i:brunoletter', c3_hid:'p:bruno', c3_message:'p:bruno' };
Object.keys(M.NOTES).forEach(function(id){ var n=M.NOTES[id]; n.p=PIC[id]||(n.c==='mala'?'p:mala':null); });
// was überholt ist, verschwindet aus den Karten (bleibt im Tagebuch)
var MORE={ pro_sohn:['c1_boat7'], pro_riva:['c1_waits'], c1_dinko:['c1_rescued','c1_story'], c1_gift:['c1_story'], c1_radio:['c1_ferry'], c1_date:['c1_ferry'], c1_years:['c1_ferry'],
  c1_boat7:['c1_came'], c1_capsized:['c1_came','c1_story'], c1_rescued:['c1_story'], c1_ankica:['c1_came','c1_story'], c1_aboard:['c1_came'], c1_never:['c1_story'],
  c2_boy:['c2_luka','c2_died'], c2_date:['c2_died'], c2_riva:['c2_waited'], c2_stayed:['c2_shop'], c2_echo:['c2_waited'], c2_unused:['c2_waited'], c2_mira1:['c2_waited'], c2_mira2:['c2_waited'],
  c3_f13:['c3_img_coat'], c3_fcrank:['c3_img_crank'], c3_fletter:['c3_message'], c3_dance:['c3_sunday'], c3_wanted:['c3_hid'], c3_zagreb:['c3_hid'], c3_accept:['c3_hid'], c3_img_env:['c3_hid'], c3_img_hands:['c3_wanted'] };
Object.keys(MORE).forEach(function(id){ var n=M.NOTES[id]; if (!n) return; n.doneBy=(n.doneBy||[]).concat(MORE[id]); });
M.NOTES.pro_notice.doneIf=function(G){ return !!G.flags['c1.release']; };
// Ins Notizbuch kommt nur, was man wirklich braucht: zum Verbinden und für das Gespräch mit Ivka am Ende.
// Alles andere merkt sich das Spiel im Hintergrund (Gesprächsoptionen hängen weiter davon ab).
['c1_boat7','c1_ferry','c1_came','c1_story','c1_letter','c2_meet','c2_unused','c2_waited','c3_zagreb','c3_accept','c3_hid','c3_message'].forEach(function(id){ M.NOTES[id].show=true; });
// Prolog: die Recherche für den Nachruf wird im Notizbuch verbunden (Notiz der Stadt + Ivkas Strickheft)
['pro_noone','pro_knit','pro_list','pro_people'].forEach(function(id){ M.NOTES[id].show=true; });
M.NOTES.c1_ferry.doneIf=function(G){ return !!G.flags['c1.release']; }; M.NOTES.c1_came.doneIf=M.NOTES.c1_ferry.doneIf; M.NOTES.c1_story.doneIf=M.NOTES.c1_ferry.doneIf; M.NOTES.c1_letter.doneIf=M.NOTES.c1_ferry.doneIf;
M.NOTES.c1_story.doneBy=[]; M.NOTES.c2_meet.doneBy=['c2_waited']; M.NOTES.c2_unused.doneBy=['c2_waited'];

})(M);
