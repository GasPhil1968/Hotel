/* ===== 15_hints_k2.js — Hinweise Kapitel 2 (Sarajevo): je Rätselabschnitt vier Stufen =====
   Stufen: 1 Problem einordnen · 2 Denkrichtung · 3 Konkreter Ansatz · 4 Nächster Schritt.
   Texte sind so geschrieben, dass Mala und Marko sie sprechen können (kein „ich/du“ in der Sache). {m,g}: g ist Malas Fassung.
   Titel nennen nur, was Marko schon weiß; ein Thema geht erst auf, wenn seine Voraussetzungen erfüllt sind (open). */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; } function I(G,id){ return G.inv.indexOf(id)>=0; }
// Rade steht nur tagsüber an der Haltestelle (rooms/carsija.js); das Auftragsbuch liegt nach der Gravur auf Nedžads Werkbank
function radeAway(G){ return ['k2_pro','k2_s1','k2_s2','k2_s3','k2_fin','k2_fin_n'].indexOf(G.phase)<0; }
function bookOut(G){ return !!(G.rooms&&G.rooms.kazandziluk&&G.rooms.kazandziluk.bookOut); }
// der nächste Schritt zum Datum von 1972 (s1b, s1c, s1d): Armband spüren → Nedžad helfen → Buch holen lassen → Buch lesen
function dateStep(G){ if (!N(G,'s1_bracelet')) return {m:'Zu Mala wechseln und Tomaž spüren: Er hält ein graviertes Armband.',g:'Zu mir wechseln und Tomaž spüren: Er hält ein graviertes Armband.'};
  if (bookOut(G)) return 'In Kazandžiluk das Auftragsbuch auf Nedžads Werkbank lesen.'; if (F(G,'k2.s1.engraved')) return 'Nedžad bitten, das Auftragsbuch von 1972 zu holen.';
  return 'Nedžad nach dem Armband fragen und ihm bei der deutschen Gravur helfen. Dann schlägt er das Auftragsbuch von 1972 auf.'; }
function ph(G,list){ return list.indexOf(G.phase)>=0; }
M.HINTS_K2=[
 // ---------------- Prolog
 {id:'p1',t:'Ohne Mark',open:function(G){ return G.phase==='k2_pro' && !F(G,'k2.p1.km'); },
  s:['Der Fahrschein kostet 1,60 Mark. Kuna nimmt hier niemand.',
     'Geld verdienen, mit dem, was ein Übersetzer kann. Jemand am Busbahnhof hat ein Problem mit einem Text.',
     'Fikret in der Buregdžinica schimpft über einen Brief, den er nicht lesen kann. Ein deutscher Brief.',
     'Mit Fikret reden und ihm den Brief richtig übersetzen, Zeile für Zeile.']},
 {id:'p1b',t:'In die Altstadt',open:function(G){ return G.phase==='k2_pro' && F(G,'k2.p1.km') && !F(G,'k2.p1.rode'); },
  s:['Die Mark ist da. Jetzt fehlt der Weg in die Altstadt.',
     'Zu Fuß ist es weit, im Nebel noch weiter. Die Straßenbahn fährt vom Bahnhof.',
     'Die Eins fährt in die Altstadt. Ein Fahrschein gilt erst, wenn er entwertet ist.',
     'Am Kiosk einen Fahrschein kaufen, in die Straßenbahn steigen und im Wagen am Entwerter entwerten.']},
 {id:'p2',t:'Mala an der Haltestelle',open:function(G){ return G.phase==='k2_pro' && F(G,'k2.p1.rode') && !F(G,'k2.p2.back'); },
  s:['Mala sitzt an der Haltestelle der Drei und wartet. Ansprechen allein holt sie nicht zurück.',
     'Was hat sie früher mit der Drei verbunden? Etwas, das mit dieser Fahrt zu tun hat.',
     'Ein entwerteter Fahrschein ist in der Tasche, von der Fahrt eben.',
     'Mala den entwerteten Fahrschein zeigen.']},
 {id:'p3',t:'Wohin für die Nacht?',open:function(G){ return G.phase==='k2_pro' && F(G,'k2.p2.back') && !F(G,'k2.p3.hajra'); },
  s:['Es wird Abend, und noch gibt es kein Dach über dem Kopf.',
     'Sanja hat ein Zimmer besorgt: bei Hajra Mešić, einer Pension in Kovači. Fehlt nur der Weg.',
     function(G){ return G.map&&G.map.pansion?'Der Weg ist bekannt. Kovači steht jetzt auf dem Stadtplan.':'Rade an der Baščaršija kennt jede Gasse. Nach Kovači fragen.'; },
     function(G){ return G.map&&G.map.pansion?'Über den Stadtplan nach Kovači gehen und Hajra begrüßen.':'Mit Rade reden und nach Kovači und der Pension fragen.'; }]},
 {id:'p3b',t:'Der erste Abend',open:function(G){ return G.phase==='k2_pro' && F(G,'k2.p3.hajra') && !F(G,'k2.pro.night'); },
  s:['Ein Zimmer, ein Dach. Mehr geht heute nicht.',
     'Der Tag war lang genug. Sarajevo kann bis morgen warten.',
     'Hajra hat oben in der Pension ein Zimmer gegeben.',
     'In der Pension ins Bett gehen.']},
 {id:'p4',t:'Der Gesang in der Nacht',open:function(G){ return G.phase==='k2_pro_n' && !F(G,'k2.pro.tomaz'); },
  s:[{m:'Mitten in der Nacht hat Mala jemanden singen hören.',g:'Mitten in der Nacht singt jemand.'},
     'Der Gesang kam von unten, aus der Altstadt.',
     'Von der Sahat-kula, dem Uhrturm hinter der Baščaršija.',
     'Zur Kula gehen und den jungen Mann unter der Uhr ansprechen.']},
 {id:'p4b',t:'Mitten in der Nacht',open:function(G){ return G.phase==='k2_pro_n' && F(G,'k2.pro.tomaz') && !F(G,'k2.s1.started'); },
  s:['Der junge Mann unter der Uhr wartet auf jemanden. Heute Nacht ist nicht mehr zu erfahren.',
     'Es ist spät, und die Pension ist nicht weit.',
     'Schlaf. Am Morgen sieht die Kula anders aus.',
     'Zurück in die Pension und ins Bett.']},
 // ---------------- Fall 1: Sieben am Turm
 {id:'s1a',t:'Wann ist „sieben“?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_twosevens'); },
  s:['Tomaž wartet auf „sieben“. Die Uhr am Turm zeigt etwas ganz anderes als jede Armbanduhr.',
     'Die Kula geht nach einer alten Zeit. Wer hier lebt, weiß, wie.',
     // Hinweisprobe (P12): Stufe 4 riet zu Lejla, auch wenn die Mondzeit schon von der Tafel am Turm bekannt war
     function(G){ if (!N(G,'s1_alaturka')) return 'Lejla auf der Terrasse der Kafana kennt die Kula. Am Turm hängt auch eine Tafel.'; if (!N(G,'s1_note')) return {m:'Tomaž hält einen Zettel. Mala kann ihn lesen.',g:'Tomaž hält einen Zettel. Ich kann ihn lesen.'}; return 'Sein Zettel und die Mondzeit gehören zusammen.'; },
     function(G){ if (!N(G,'s1_alaturka')) return 'Lejla fragen, warum die Uhr an der Kula falsch geht, oder an der Kula die Tafel lesen.'; if (!N(G,'s1_note')) return {m:'Zu Mala wechseln und Tomaž unter der Uhr ansehen.',g:'Zu mir wechseln und Tomaž unter der Uhr ansehen.'}; return 'Im Notizbuch „Kad kula udari sedam“ mit „Mondzeit“ verbinden.'; }]},
 {id:'s1b',t:'Sieben nach der Kula, aber wann genau?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_twosevens') && !N(G,'s1_2316'); },
  s:['Die Kula zählt ab Sonnenuntergang. Ohne den Sonnenuntergang an jenem Tag bleibt „sieben“ ungenau.',
     'Zwei Dinge fehlen: das genaue Datum und ein Kalender, der den Sonnenuntergang für dieses Datum nennt.',
     // Analyse K2-B05: Ohne Malas Spüren an Tomaž hat Nedžad keinen Einstieg; Stufe 3 und 4 nennen jetzt den nächsten möglichen Schritt
     function(G){ if (!N(G,'s1_bracelet')) return {m:'Das Datum steht in einem Auftragsbuch in der Čaršija. Tomaž trägt etwas Graviertes; Mala kann spüren, was.',g:'Das Datum steht in einem Auftragsbuch in der Čaršija. Tomaž trägt etwas Graviertes; ich kann spüren, was.'};
       if (!N(G,'s1_date')) return 'Das Datum steht in Nedžads Auftragsbuch: Dort ist das Armband graviert worden.'; if (!N(G,'s1_sunset')) return 'Alte Kalender, auch Takvime, hat das Antiquariat an der Ferhadija.'; return 'Datum und Sonnenuntergang sind beisammen.'; },
     function(G){ if (!N(G,'s1_bracelet')) return {m:'Zu Mala wechseln und Tomaž spüren: Er hält ein graviertes Armband.',g:'Zu mir wechseln und Tomaž spüren: Er hält ein graviertes Armband.'};
       if (!N(G,'s1_date')) return dateStep(G);
       if (!N(G,'s1_sunset')) return 'Bei Jakob im Antiquariat nach Takvimen von 1972 fragen und den Takvim lesen.'; return 'Im Notizbuch „Zwei Siebenen“ mit „Takvim 1972“ verbinden.'; }]},
 {id:'s1c',t:'Woher stammt das Armband?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_bracelet') && !N(G,'s1_date'); },
  s:['Tomaž trägt ein graviertes Armband aus der Čaršija. Wer hat es graviert, und wann?',
     'Graveure führen Bücher über ihre Aufträge. Die alten Werkstätten sind in einer Gasse.',
     'In Kazandžiluk graviert die Familie Kazandžić seit hundert Jahren. Nedžad hat die alten Bücher, aber keine Zeit.',
     function(G){ return dateStep(G); }]},   // Hinweisprobe (P12): nach der Gravur holt Nedžad das Buch, dann liegt es auf der Werkbank
 {id:'s1d',t:'Was war an jenem Abend?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_left'); },
  s:['Jemand muss an jenem Abend in der Kafana gewesen sein.',
     'Zwei Seiten fehlen: was die Kafana damals erlebt hat, und was Tomaž selbst von seiner Nacht weiß.',
     'Šaćir am Fenstertisch war damals Kellner. Tomaž erinnert sich an seinen Zapfenstreich.',
     // Hinweisprobe (P12): Šaćir erinnert sich erst mit dem Datum; danach nennt Stufe 4 nur, was noch fehlt
     function(G){ if (!N(G,'s1_closed')){ if (N(G,'s1_date')||N(G,'s1_name')) return 'Šaćir laut nach dem jungen Soldaten von 1972 fragen. Dann im Notizbuch verbinden, wann die Kafana zumachte und wann Tomaž zurück musste.';
         var d=dateStep(G); return typeof d==='string'?'Šaćir erinnert sich erst mit dem Datum. '+d:{m:'Šaćir erinnert sich erst mit dem Datum. '+d.m,g:'Šaćir erinnert sich erst mit dem Datum. '+d.g}; }
       if (!N(G,'s1_curfew')) return 'Tomaž nach seiner Nacht fragen: Wann musste er zurück in die Kaserne?'; return 'Im Notizbuch „Halid sperrte um elf zu“ mit „Zapfenstreich“ verbinden.'; }]},
 {id:'s1e',t:'Emina schweigt',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_waited'); },
  s:['Emina will über 1972 nicht reden. Nicht mit einem Fremden.',
     'Mit jemandem aus der Familie redet sie anders. Und zuhören kann auch, wen sie nicht sieht.',
     {m:'Emina spricht mit ihrer Enkelin hinter der Theke. Mala kann dort unbemerkt stehen.',g:'Emina spricht mit ihrer Enkelin hinter der Theke. Dort kann ich stehen, ohne dass sie mich sieht.'},
     // Hinweisprobe (P12): Lauschen an der Theke selbst bringt nichts, bei Emina schon, und erst, wenn Marko sie nach 1972 gefragt hat
     function(G){ return F(G,'k2.s1.eminaAsked')?{m:'Zu Mala wechseln und bei Emina hinter der Theke lauschen.',g:'Zu mir wechseln und bei Emina hinter der Theke lauschen.'}:{m:'Erst Emina nach dem November 1972 fragen. Danach zu Mala wechseln und bei Emina hinter der Theke lauschen.',g:'Frag Emina erst nach dem November 1972. Danach lausche ich bei ihr hinter der Theke.'}; }]},
 {id:'s1k',t:'Was Emina nicht weiß',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_missed') && !N(G,'s1_nowrite'); },   // Blindtest K2: nach „Elf Minuten“ gab es kein Thema
  s:['Emina glaubt bis heute, Tomaž sei nicht gekommen.','Sie muss die elf Minuten von Marko hören.','Emina sitzt in der Kafana. Mit ihr über etwas aus dem Notizbuch reden.','Emina in der Kafana nach „Elf Minuten“ fragen.']},
 {id:'s1f',t:'Wo sind die Briefe?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_nowrite') && !I(G,'letters_tz') && !F(G,'k2.s1.tin'); },
  s:['Emina fragt, warum er nie geschrieben hat. Vielleicht hat er geschrieben.',
     'Briefe gehen durch Hände. Wer hat damals etwas angenommen und weitergegeben?',
     {m:'Šaćir hat etwas weitergegeben. Mala sieht in der verschlossenen Kammer, wohin. Hinein geht es erst, wenn Emina nicht da ist.',g:'Šaćir hat etwas weitergegeben. Ich sehe in der verschlossenen Kammer nach, wohin. Hinein geht es erst, wenn Emina nicht da ist.'},
     function(G){ if (F(G,'k2.s1.letterFixed') && N(G,'s1_hidden') && !F(G,'k2.s1.eminaAway')) return 'Emina geht nachher zu Tante Sabira: die Kafana einmal verlassen und wieder hineingehen (oder als Mala hinter der Theke lauschen). Dann öffnet Lejla die Kammer.';
       // Hinweisprobe (P12): Lejla ist schon geholfen, aber in der Kammer war noch niemand
       if (F(G,'k2.s1.letterFixed') && !N(G,'s1_hidden')) return {m:'Zu Mala wechseln und durch die Tür der Kammer gehen: Dort sieht sie, wohin die Briefe kamen.',g:'Zu mir wechseln und durch die Tür der Kammer gehen: Dort sehe ich, wohin die Briefe kamen.'};
       if (F(G,'k2.s1.eminaAway') && !F(G,'k2.s1.eminaBack')) return I(G,'chisel')?'In die Kammer gehen und am Spiegel das Stemmeisen ansetzen.':'Nedžad um sein Stemmeisen bitten, dann in der Kammer am Spiegel ansetzen.';   // Emina ist fort, Lejla öffnet
       return I(G,'chisel')?'Lejla helfen, damit Emina geht. Dann in die Kammer, und am Spiegel das Stemmeisen ansetzen.':'Lejla helfen, damit Emina geht. Dann in die Kammer. Am Spiegel hilft ein Stemmeisen: Nedžad leiht seines aus.'; }]},
 {id:'s1g',t:'Emina die Wahrheit sagen',open:function(G){ return ph(G,['k2_s1']) && N(G,'s1_missed') && N(G,'s1_betrayal') && !F(G,'k2.s1.emina'); },
  s:['Alles ist beisammen. Emina muss es hören.',
     'Erst Beweise in die Hand, dann die Wahrheit. Die Reihenfolge zählt.',
     'Briefe und Armband zuerst. Dann zwei Sätze: warum sie sich verpasst haben, und warum er nie schrieb.',
     'Mit Emina reden: zuerst sagen, warum sie sich verpasst haben, dann, warum er nie schrieb.']},
 {id:'s1h',t:'Tomaž halten',open:function(G){ return G.phase==='k2_s1_n' && !F(G,'k2.s1.free'); },
  s:['Um elf will Tomaž gehen, wie damals.',
     'Er glaubt, er müsse zurück in die Kaserne. Gibt es die überhaupt noch?',
     'Lejla weiß, was aus der Kaserne geworden ist. Heute Nacht sitzt sie vor der Kafana.',
     'Tomaž sagen, dass es die Kaserne nicht mehr gibt, und dass sie kommt, wenn die Kula sieben schlägt.']},
 {id:'s1i',t:'Tomaž kann gehen',open:function(G){ return G.phase==='k2_s1_n' && F(G,'k2.s1.free') && !F(G,'k2.s1.gone'); },
  s:['Die Kula hat sieben geschlagen. Tomaž weiß jetzt, wie spät es ist.',
     'Den Weg findet er allein nicht.',
     {m:'Mala kann ihn hinüberführen.',g:'Ich kann ihn hinüberführen.'},
     {m:'Zu Mala wechseln und bei Tomaž „Hinüberbringen“ wählen.',g:'Zu mir wechseln und bei Tomaž „Hinüberbringen“ wählen.'}]},
 {id:'s1j',t:'Nach dem ersten Fall',open:function(G){ return G.phase==='k2_s1_n' && F(G,'k2.s1.gone') && !F(G,'k2.s2.started'); },
  s:['Tomaž ist gegangen. Es ist Nacht.','Für heute ist nichts mehr zu tun.','Die Pension in Kovači.','Zurück in die Pension und ins Bett.']},
 // ---------------- Malas Spur
 {id:'m1a',t:'Das Foto mit der Uhr',open:function(G){ return N(G,'m2_photo') && !N(G,'m2_clocktower') && !ph(G,['k2_fin_n','k2_epi']); },
  s:['Auf Jakobs Foto steht ein Hochhaus mit einer Uhr auf dem Dach. Welches?',
     'Wer kennt die Haltestellen und Hochhäuser von damals?',
     'Rade an der Baščaršija kennt jede Haltestelle.',
     function(G){ return radeAway(G)?'Morgen, wenn Rade wieder an der Haltestelle steht, ihm das Foto zeigen.':'Rade das Foto zeigen.'; }]},   // Hinweisprobe (P12): nachts und im Zwischenspiel ist Rade nicht da
 {id:'m1b',t:'Die leuchtende Uhr',open:function(G){ return N(G,'m2_f_clock') && !N(G,'m2_building'); },
  s:[{m:'Mala erinnert sich an eine Uhr mit leuchtenden Ziffern.',g:'Ich erinnere mich an eine Uhr mit leuchtenden Ziffern.'},
     'Eine Erinnerung und ein Foto. Passen sie zusammen?',
     'Rade weiß, welches Hochhaus eine Uhr hatte.',
     // Analyse K2-B06: Ohne Rades Auskunft gab es keinen Schluss; Rade antwortet jetzt auch auf den Splitter selbst
     function(G){ if (!N(G,'m2_clocktower')) return radeAway(G)?{m:'Morgen Rade nach Malas Splitter mit der leuchtenden Uhr fragen.',g:'Morgen Rade nach meinem Splitter mit der leuchtenden Uhr fragen.'}:{m:'Rade nach Malas Splitter mit der leuchtenden Uhr fragen (oder ihm Jakobs Foto zeigen).',g:'Rade nach meinem Splitter mit der leuchtenden Uhr fragen (oder ihm Jakobs Foto zeigen).'};
       return {m:'Im Notizbuch Malas Splitter mit „Das Hochhaus mit der Uhr“ verbinden.',g:'Im Notizbuch meinen Splitter mit „Das Hochhaus mit der Uhr“ verbinden.'}; }]},
 // Analyse K2-B06: Lücke in Malas Spur zwischen „Das Siebener“ und Alija
 {id:'m1b2',t:'Das Siebener',open:function(G){ return N(G,'m2_building') && !N(G,'m2_alija') && !ph(G,['k2_fin_n','k2_epi']); },
  s:[{m:'Mala hat am Siebener jemanden getroffen. Wen?',g:'Ich habe am Siebener jemanden getroffen. Wen?'},
     'Das Siebener steht in Alipašino Polje, an der alten Haltestelle der Drei.',
     {m:'Neben der Haltestelle stand ein Kiosk. Wer dort noch wartet, sieht nur Mala.',g:'Neben der Haltestelle stand ein Kiosk. Wer dort noch wartet, sehe nur ich.'},
     function(G){ var later=['k2_s2','k2_s3','k2_s3_n','k2_fin'].indexOf(G.phase)<0; return later?{m:'Ab morgen: in Alipašino Polje als Mala mit dem Mann am Kiosk reden.',g:'Ab morgen: in Alipašino Polje mit dem Mann am Kiosk reden.'}:{m:'Nach Alipašino Polje gehen, zu Mala wechseln und mit dem Mann am Kiosk reden.',g:'Nach Alipašino Polje gehen und mit dem Mann am Kiosk reden.'}; }]},
 {id:'m1c',t:'Zwei Fahrscheine',open:function(G){ return N(G,'m2_alija') && !N(G,'m2_ticket'); },
  s:['Alija sagt, die Kleine habe zwei Fahrscheine gekauft.',
     'Wo bewahrt jemand einen alten Fahrschein auf?',
     {m:'Mala trägt ihre Dose immer bei sich.',g:'Meine Dose.'},
     {m:'Mala nach dem fragen, was Alija gesagt hat.',g:'Mich nach dem fragen, was Alija gesagt hat.'}]},
 {id:'m1d',t:'Ein Fahrschein von 1993',open:function(G){ return N(G,'m2_ticket') && !N(G,'m2_promise'); },
  s:['Der Fahrschein ist am 12.11.1993 entwertet. Im Krieg.',
     'Welche Bahnen fuhren im November 1993 überhaupt?',
     'Rade weiß, welche Bahnen damals fuhren.',
     function(G){ if (!N(G,'m2_notrams')) return radeAway(G)?'Morgen Rade fragen, ob im November dreiundneunzig Straßenbahnen fuhren.':'Rade fragen, ob im November dreiundneunzig Straßenbahnen fuhren.';   // Hinweisprobe (P12): erst Rades Auskunft
       return 'Im Notizbuch „Malas Fahrschein“ mit „Keine Bahn im November 1993“ verbinden.'; }]},
 // Analyse K2-B06: Lücke in Malas Spur zwischen „Ein Versprechen“ und dem neunten Stock
 {id:'m1f',t:'Ein Versprechen',open:function(G){ return N(G,'m2_promise') && !N(G,'m2_f_ninth') && !ph(G,['k2_fin_n','k2_epi']); },
  s:[{m:'Malas Fahrschein war ein Versprechen. An wen?',g:'Mein Fahrschein war ein Versprechen. An wen?'},
     {m:'Mala erinnert sich in Splittern. Ein Versprechen ist ein Ort, zu dem man zurückwollte.',g:'Ich erinnere mich in Splittern. Ein Versprechen ist ein Ort, zu dem man zurückwollte.'},
     {m:'Wenn Marko sie danach fragt, kommt vielleicht der nächste Splitter.',g:'Wenn du mich danach fragst, kommt vielleicht der nächste Splitter.'},
     {m:'Mit Mala reden.',g:'Mit mir reden.'}]},
 {id:'m1e',t:'Zwei Kinder in der Drei',open:function(G){ return N(G,'m2_kids') && N(G,'m2_marko7') && !N(G,'m2_mali'); },
  s:['Rade erinnert sich an zwei Kinder, samstags um 11:10.',
     'Ein Mädchen und ein kleiner Junge, aus Alipašino Polje. Wer wohnte damals dort?',
     'Die eigene Erinnerung an das Siebener gehört dazu.',
     'Im Notizbuch die zwei Kinder mit dem verbinden, was über die eigene Kindheit im Siebener feststeht.']},
 // ---------------- Fall 2: Die Leihfrist
 {id:'s2a',t:'Der Spuk im Antiquariat',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && !N(G,'s2_stamp'); },
  s:['In Jakobs Laden liest jemand, der nicht da ist.',
     'Wer nicht da ist, ist für Lebende unsichtbar. Für eine andere nicht.',
     {m:'Mala sieht ihn im Lesesessel. Und sie kann lesen, was in einem verschlossenen Buch steht.',g:'Ich sehe ihn im Lesesessel. Und ich kann lesen, was in einem verschlossenen Buch steht.'},
     {m:'Zu Mala wechseln und das Buch in der Vitrine ansehen.',g:'Zu mir wechseln und das Buch in der Vitrine ansehen.'}]},
 {id:'s2b',t:'Wem gehört das Buch?',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_stamp') && !N(G,'s2_provenance'); },
  s:[function(G){ return N(G,'s2_ledger')?'Leser 2204 und der Nachlass im Ankaufbuch: Dass beides derselbe Mann ist, weißt du. Im Notizbuch wird es erst ein Schluss.':'Wer war Leser 2204?'; },'Woher kam das Buch in den Laden?','Jakob schreibt in sein Ankaufbuch, von wem er kauft. Hineinschauen darf man, wenn man ihn fragt, woher er das Buch hat.',
     function(G){ return N(G,'s2_ledger')?'Im Notizbuch den Leihzettel mit dem Eintrag im Ankaufbuch verbinden.':'Jakob fragen, woher er das Buch hat, dann das Ankaufbuch auf seinem Schreibtisch lesen.'; }]},
 {id:'s2c',t:'Warum gab er es nie zurück?',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_due') && !N(G,'s2_noreturn'); },
  s:['Für ihn läuft die Frist ab. Seit Jahren.','Was ist im August 1992 mit der Bibliothek geschehen?',
     'Jakob erzählt es, wenn man ihn nach der Bibliothek fragt.',
     function(G){ return N(G,'s2_fire')?'Im Notizbuch „Die Frist läuft ab“ mit „Die Bibliothek brannte“ verbinden.':'Jakob nach der Nationalbibliothek fragen. Dann im Notizbuch die Frist mit dem Brand verbinden.'; }]},   // Hinweisprobe (P12)
 {id:'s2d',t:'Was ist im Buch?',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_provenance') && !N(G,'s2_fragments'); },
  s:['Warum war ihm gerade dieses Buch so wichtig?','Menschen, die ihn kannten, erinnern sich an Bruchstücke.',
     'Sein Sohn in Wien, und eine alte Nachbarin an der Obala.',
     'Petar aus der Pension anrufen, Milka an der Miljacka fragen, und beides im Notizbuch verbinden.']},
 {id:'s2e',t:'In die Vijećnica',open:function(G){ return ph(G,['k2_s2']) && !I(G,'pass'); },
  s:['Nachts kommt niemand in die Vijećnica.','Wer darf hinein? Und was braucht diese Person gerade?',
     'Die Restauratorin am Bauzaun braucht jemanden, der alte deutsche Schrift lesen kann.',
     // Hinweisprobe (P12): Jakob gibt die Tafel erst, wenn die Restauratorin gesagt hat, was sie braucht
     function(G){ if (!F(G,'k2.s2.amraAsk')) return 'Die Restauratorin am Bauzaun der Vijećnica fragen, was sie dort macht.'; if (!I(G,'kurrent')) return 'Bei Jakob nach seiner Kurrent-Tafel fragen.'; return 'Der Restauratorin sagen: „Ich lese Kurrent.“ Und mit der Tafel die Schrift lesen.'; }]},
 {id:'s2f',t:'Das Buch zurückgeben',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_fragments') && N(G,'s2_provenance') && !F(G,'k2.s2.free'); },
  s:['Das Buch muss dorthin, wo es ausgeliehen wurde.',
     'Jakob gibt es nur her, wenn er weiß, wem es gehört und warum.',
     function(G){ if (F(G,'k2.s2.onDesk')) return 'Er will einen Stempel. Einen Stempel gibt es nicht mehr. Aber der Leihzettel hat ein Feld für die Rückgabe.'; return I(G,'pass')?'Mit dem Passierschein geht es abends in die Vijećnica, zur alten Ausleihe.':'Abends geht es nur mit einem Passierschein in die Vijećnica.'; },
     function(G){ if (F(G,'k2.s2.onDesk')) return 'Den Kugelschreiber auf die Ausleihtheke ziehen und die Rückgabe eintragen.'; if (!I(G,'rilke')) return 'Jakob sagen: „Das Buch gehört der Bibliothek.“ Dann gibt er es her.';   // Hinweisprobe (P12)
       return I(G,'pass')?'Das Buch in der Vijećnica auf die Ausleihtheke legen, dann mit dem Kugelschreiber die Rückgabe eintragen.':'Mit dem Passierschein der Restauratorin abends in die Vijećnica, das Buch auf die Ausleihtheke legen und mit dem Kugelschreiber die Rückgabe eintragen.'; }]},
 {id:'s2g',t:'Ivan kann gehen',open:function(G){ return G.phase==='k2_s2_n' && F(G,'k2.s2.free') && !F(G,'k2.s2.gone'); },
  s:['Das Buch liegt wieder auf der Ausleihtheke. Ivan hat es gesehen.','Er steht noch da, als wüsste er nicht, wohin.',
     {m:'Mala kann ihn hinüberführen.',g:'Ich kann ihn hinüberführen.'},
     {m:'Zu Mala wechseln und bei Ivan „Hinüberbringen“ wählen.',g:'Zu mir wechseln und bei Ivan „Hinüberbringen“ wählen.'}]},
 // ---------------- Zwischenspiel
 {id:'i1',t:'Die ganze Stadt',open:function(G){ return G.phase==='k2_i' && !F(G,'k2.i.done'); },
  s:[{m:'Mala wollte irgendwohin, wo man die ganze Stadt sieht.',g:'Irgendwohin, wo man die ganze Stadt sieht.'},
     'Hier oben in Vratnik ist so ein Ort.','Auf der Gelben Bastei steht eine Bank.',
     {m:'Mit Mala auf die Bank setzen und reden.',g:'Mit mir auf die Bank setzen und reden.'}]},
 {id:'i2',t:'Spät geworden',open:function(G){ return G.phase==='k2_i' && F(G,'k2.i.done') && !F(G,'k2.s3.started'); },
  s:['Es ist spät, und der Tag war lang.','Für heute ist nichts mehr zu tun.','In Kovači wartet das Zimmer bei Hajra.','Zurück in die Pension und ins Bett.']},
 // ---------------- Fall 3: Das verschlossene Zimmer
 {id:'s3z',t:'Sanja anrufen',open:function(G){ return G.phase==='k2_s3' && !F(G,'k2.s3.called'); },
  s:['Bevor es irgendwohin geht, steht ein Anruf an. Wegen des Kartons.','Sanja ist in Split.','In der Pension gibt es ein Telefon.','Mit dem Telefon in der Pension Sanja anrufen.']},
 {id:'s3a',t:'Wer war L.?',open:function(G){ return ph(G,['k2_s3','k2_s3_n']) && !N(G,'m2_lana'); },
  s:['In Split stand im Register „…ić, L.“. Wer verbirgt sich dahinter?',
     'Ein Haus führt Buch über seine Mieter.',
     {m:'In Haus 7 stehen im Hausbuch die alten Mieter. Malas Splitter sagt: neunter Stock.',g:'In Haus 7 stehen im Hausbuch die alten Mieter. Mein Splitter sagt: neunter Stock.'},
     function(G){ return N(G,'m2_housebook')?'Im Notizbuch das Register aus Split mit dem Hausbuch verbinden.':'Im Hausflur von Haus 7 das Hausbuch lesen. Dann im Notizbuch das Register aus Split mit dem Hausbuch verbinden.'; }]},   // Hinweisprobe (P12)
 {id:'s3b',t:'In den Schutzraum',open:function(G){ return ph(G,['k2_s3']) && !I(G,'key_shelter') && !F(G,'k2.s3.inShelter'); },
  s:['Šehić gibt den Schlüssel nicht her.','Was bewegt ihn? Er redet, wenn er sich allein glaubt.',
     {m:'Mala kann an seiner Tür lauschen.',g:'Ich kann an seiner Tür lauschen.'},
     function(G){ return N(G,'s3_hanka')?'Mit Šehić reden und ihn nach „Hanka“ fragen, vorsichtig: nach dem, was an seiner Tür zu hören war.':{m:'Zu Mala wechseln und an Šehićs Tür lauschen.',g:'Zu mir wechseln und an Šehićs Tür lauschen.'}; }]},   // Hinweisprobe (P12)
 {id:'s3b2',t:'Die Stahltür',open:function(G){ return G.phase==='k2_s3' && I(G,'key_shelter') && !F(G,'k2.s3.inShelter'); },
  s:['Šehićs Schlüssel ist in der Tasche.','Es gibt nur eine Tür, für die er passt.','Die Stahltür zum Schutzraum, hinten im Hausflur.','Die Stahltür mit Šehićs Schlüssel öffnen.']},
 {id:'s3c',t:'Der Schrank im Keller',open:function(G){ return ph(G,['k2_s3','k2_s3_n']) && F(G,'k2.s3.inShelter') && !F(G,'k2.s3.cabinet'); },
  s:['Der Schrank ist verschlossen. Zora weiß, wo der Schlüssel ist.',
     'Oben und unten müssen zusammen arbeiten. Mirza erinnert sich an eine Klingel.',
     {m:'Mala hört im Keller, was oben geschieht. Marko kann oben in der Halle klingeln.',g:'Ich höre im Keller, was oben geschieht. Du kannst oben in der Halle klingeln.'},
     {m:'Mala im Schutzraum lassen, mit Marko oben in der Halle den Klingelknopf drücken, dann zu Mala wechseln.',g:'Mich im Schutzraum lassen, oben in der Halle den Klingelknopf drücken, dann zu mir wechseln.'}]},
 {id:'s3d',t:'Die Zeugnisse',open:function(G){ return ph(G,['k2_s3']) && I(G,'svjedocanstva') && !F(G,'k2.s3.stamped'); },
  s:['Zora hat versprochen: Zeugnisse mit Stempel.','Die Schule gibt es nicht mehr. Ihr Stempel vielleicht schon.',
     // Analyse K2-B07: Den Stempel hat Mirza, nicht der Schutzraum; gestempelt wird an Zoras Pult
     function(G){ return I(G,'pecat')?'Der Stempel ist da. Die Zeugnisse gehören auf Zoras Pult im Schutzraum.':'Mirza hat den alten Schulstempel aufgehoben.'; },
     function(G){ return I(G,'pecat')?'Im Schutzraum den Stempel auf Zoras Pult benutzen.':'Mirza sagen: „Zora wollte Zeugnisse mit Stempel verteilen.“ Er hat den Stempel.'; }]},
 {id:'s3e',t:'Wer kommt zur letzten Stunde?',open:function(G){ return ph(G,['k2_s3']) && N(G,'s3_register') && !(F(G,'k2.s3.mirza') && F(G,'k2.s3.selma') && F(G,'k2.s3.damir')); },
  s:['Zora will, dass alle da sind. Drei aus dem Klassenbuch leben noch hier.',
     'Mirza, Selma und Damir. Jeder braucht einen anderen Grund, zu kommen.',
     function(G){ var o=[]; if (!F(G,'k2.s3.mirza')) o.push('Mirza muss erfahren, was Zora über ihn geschrieben hat'); if (!F(G,'k2.s3.selma')) o.push('Selma braucht eine Hand'); if (!F(G,'k2.s3.damir')) o.push('Damir braucht seine eigene Zeichnung, und die steht im Klassenbuch'); return o.join('. ')+'.'; },
     function(G){ var o=[]; if (!F(G,'k2.s3.mirza')) o.push('Mirza zeigen, was im Klassenbuch über ihn steht'); if (!F(G,'k2.s3.selma')) o.push('Selma Hilfe anbieten'); if (!F(G,'k2.s3.damir')) o.push('Damir das Klassenbuch zeigen'); return o.join('. ')+'.'; }]},   // Analyse K2-B07: eine „Zeichnung“ als Gegenstand gibt es nicht
 {id:'s3g',t:'Die letzte Stunde',open:function(G){ return G.phase==='k2_s3_n' && !F(G,'k2.s3.free'); },
  s:['Mirza, Selma und Damir sind gekommen. Zora wartet unten auf ihre Klasse.','Wie beginnt eine Lehrerin ihre Stunde?',
     'Mit dem Klassenbuch auf dem Pult.','Im Schutzraum das Klassenbuch auf Zoras Pult legen.']},
 {id:'s3h',t:'Zora kann gehen',open:function(G){ return G.phase==='k2_s3_n' && F(G,'k2.s3.free') && !F(G,'k2.s3.gone'); },
  s:['Alle sind da. Zora hat ihre Klasse gesehen.','Sie steht noch am Pult.',
     {m:'Mala kann sie hinüberführen.',g:'Ich kann sie hinüberführen.'},
     {m:'Zu Mala wechseln und bei Zora „Hinüberbringen“ wählen.',g:'Zu mir wechseln und bei Zora „Hinüberbringen“ wählen.'}]},
 {id:'s3i',t:'Nach der letzten Stunde',open:function(G){ return G.phase==='k2_s3_n' && F(G,'k2.s3.done') && !F(G,'k2.f2.started'); },
  s:['Die Kinder von damals sind nach Hause gegangen. Zora auch.','Es ist tief in der Nacht.','Die Pension in Kovači.','Zurück in die Pension und ins Bett.']},
 // ---------------- Finale
 {id:'f1',t:'Der Karton aus Split',open:function(G){ return G.phase==='k2_fin' && !I(G,'karton') && !F(G,'k2.f2.opened'); },
  s:['Sanja hat den Karton geschickt. Die Nummer kommt per SMS.',
     function(G){ return N(G,'f2_parcel')?'Die Nummer ist da. Jetzt fehlt der Schalter.':'Ohne Strom keine SMS.'; },
     function(G){ return N(G,'f2_parcel')?'Der Paketschalter ist am Busbahnhof.':'Das Handy ist leer. In der Pension gibt es eine Steckdose.'; },
     function(G){ return N(G,'f2_parcel')?'Mit der Paketnummer zum Paketschalter am Busbahnhof.':'Das Handy in der Pension laden und die SMS lesen.'; }]},
 {id:'f1b',t:'Der Karton ist da',open:function(G){ return G.phase==='k2_fin' && I(G,'karton') && !F(G,'k2.f2.opened'); },
  s:['Der Karton aus Split ist abgeholt. Zugeklebt, seit siebzehn Jahren.','Was darin ist, gehört zu der Zeit vor Split.','Nur aufmachen muss ihn jemand.','Den Karton in der Leiste öffnen.']},
 {id:'f2',t:'Das gerissene Foto',open:function(G){ return G.phase==='k2_fin' && I(G,'photo_m') && !N(G,'f2_photo'); },
  s:['Das Foto ist an einer Kante gerissen. Es fehlt eine Hälfte.',
     {m:'Mala zeigt nicht alles, was in ihrer Dose ist.',g:'In meiner Dose ist etwas, das ich niemandem zeige.'},
     {m:'Vielleicht zeigt sie es, wenn sie etwas Gleiches sieht. Im Karton lag ein alter Fahrschein.',g:'Vielleicht zeige ich es, wenn ich etwas Gleiches sehe. Im Karton lag ein alter Fahrschein.'},
     {m:'Mala den alten Fahrschein aus dem Karton zeigen.',g:'Mir den alten Fahrschein aus dem Karton zeigen.'}]},
 {id:'f3',t:'Der neunte Stock',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_photo') && !N(G,'f2_postcard'); },
  s:['Nada im neunten Stock öffnet keinem.','Sie öffnet vielleicht, wenn sie sieht, wer vor der Tür steht.','Das ganze Foto zeigt, wer das ist. Mit ihm öffnet sie.',
     'In Haus 7 die Treppe hinauf zu Nada, sie nach Lanas Zimmer fragen und dort die Postkarte lesen.']},   // Hinweisprobe (P12): das Foto zeigen allein öffnet Lanas Zimmer nicht
 {id:'f4',t:'Großmutters Haus',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_postcard') && !N(G,'f2_rcm'); },
  s:['Lana wollte jemanden holen. Damals war das Ziel Großmutters Haus in Vratnik.',
     function(G){ return I(G,'key_kuca')||F(G,'k2.f2.kuca')?'Der Schlüssel zu Großmutters Haus ist da. In der Küche ist etwas zu spüren.':'Wer hat einen Schlüssel zu Großmutters Haus? Jemand, der dreißig Jahre gegenüber wohnte.'; },
     function(G){ if (!(I(G,'key_kuca')||F(G,'k2.f2.kuca'))) return 'Hajra hat den Schlüssel.'; if (!N(G,'f2_oven')) return {m:'Mala soll in Großmutters Küche den Kohleherd spüren.',g:'Ich soll in Großmutters Küche den Kohleherd spüren.'}; if (I(G,'rcm')) return 'Die Nachricht aus dem Wärmefach ist da. Ich habe sie noch nicht gelesen.'; if (G.rooms&&G.rooms.kuca&&G.rooms.kuca.msgTaken) return 'Die Nachricht liegt jetzt bei Nada.'; return 'Das Wärmefach am Herd klemmt. Es braucht einen Hebel.'; },
     function(G){ if (!(I(G,'key_kuca')||F(G,'k2.f2.kuca'))) return 'Hajra nach Großmutters Haus fragen.'; if (!N(G,'f2_oven')) return {m:'Als Mala den Kohleherd oder das Wärmefach spüren. Dann weiß Marko, was darin liegt.',g:'Den Kohleherd oder das Wärmefach spüren. Dann weiß Marko, was darin liegt.'}; if (I(G,'rcm')) return 'Die Nachricht vom Roten Kreuz lesen.'; if (G.rooms&&G.rooms.kuca&&G.rooms.kuca.msgTaken) return 'Nada hat die Nachricht. Sie mit Nada besprechen.'; return I(G,'chisel')?'Das Wärmefach mit dem Stemmeisen öffnen.':'Nedžads Stemmeisen holen. Wer es zurückgegeben hat, leiht es noch einmal. Dann das Wärmefach öffnen.'; }]},
 {id:'f5',t:'Zwei Nachrichten',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_rcm') && !N(G,'f2_cameback'); },
  s:['Lana hat geschrieben, und ihrer Mutter auch.','Zwei Schriftstücke, die dasselbe erzählen könnten.','Die Nachricht vom Roten Kreuz und die Postkarte.','Im Notizbuch die Rotkreuz-Nachricht mit der Postkarte verbinden.']},
 {id:'f7',t:'Die erste Drei nach dem Krieg',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_cameback') && !F(G,'k2.f2.night'); },
  s:['Auf Lanas Fahrschein steht: für die erste Drei nach dem Krieg.',
     {m:'Mala will fahren. Mit Marko und mit den alten Fahrscheinen.',g:'Ich will fahren. Mit dir und mit den alten Fahrscheinen.'},
     'Heute Nacht. Was noch fehlt, ist der Entschluss.',
     {m:'Mit Mala reden oder Großmutters Haus verlassen.',g:'Mit mir reden oder Großmutters Haus verlassen.'}]},
 {id:'f6',t:'Die letzte Fahrt',open:function(G){ return ph(G,['k2_fin_n']) && !F(G,'k2.f2.ride'); },
  s:['Zwei Fahrscheine für die erste Drei nach dem Krieg.',
     {m:'Einer ist in der Tasche, den anderen hat Mala.',g:'Einen hast du, den anderen habe ich.'},
     'Entwertet werden beide in der Bahn.',
     // Hinweisprobe (P12): nach dem Entwerten nennt Stufe 4 den letzten Schritt, nicht wieder den ersten
     function(G){ if (F(G,'k2.f2.rideEnd')) return {m:'An der Baščaršija aussteigen und sich mit Mala auf die Bank setzen.',g:'An der Baščaršija aussteigen und dich mit mir auf die Bank setzen.'};
       if (I(G,'ticket_l')) return 'An der Haltestelle in die Drei steigen und beide Fahrscheine am Entwerter entwerten.';
       return {m:'Mala um ihren Fahrschein bitten und in der Drei beide am Entwerter entwerten.',g:'Mich um meinen Fahrschein bitten und in der Drei beide am Entwerter entwerten.'}; }]},
 // ---------------- Epilog
 {id:'e1',t:'Lanas Nachricht',open:function(G){ return G.phase==='k2_epi' && I(G,'rcm') && !F(G,'k2.epi.nada'); },
  s:['Lanas Nachricht vom Roten Kreuz lag siebzehn Jahre versteckt. Sie gehört nicht einem allein.','Wer wartet seit siebzehn Jahren auf ein Wort von Lana?',
     'Nada Delić, neunter Stock, Haus 7 in Alipašino Polje.','Zu Nada hinaufgehen und ihr die Rotkreuz-Nachricht geben.']},
 {id:'e2',t:'Nach Mostar',open:function(G){ return G.phase==='k2_epi' && F(G,'k2.epi.nada') && !F(G,'k2.epi.done'); },
  s:['Ein Versprechen an Nada. Und die Leine zeigt nach Südwesten.','Busse fahren vom Busbahnhof.','Bei Fadila am Busbahnhof gibt es Fahrkarten nach Mostar.','Bei Fadila eine Fahrkarte nach Mostar kaufen und in den Bus steigen.']}
];
})(M);
