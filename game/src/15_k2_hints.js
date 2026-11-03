/* ===== 15_k2_hints.js — Hinweise auf Wunsch (Menü „Hinweis …“): je offenes Problem drei Stufen =====
   Stufe 1 erinnert an das Problem, Stufe 2 nennt Ort, Person oder Ding, Stufe 3 gibt einen konkreten Denkanstoß. Nie ungefragt, nie gelöst. */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; } function I(G,id){ return G.inv.indexOf(id)>=0; }
function ph(G,list){ return list.indexOf(G.phase)>=0; }
var H=[
 // ---------------- Prolog
 {id:'p1',t:'Ich habe keine Mark',open:function(G){ return G.phase==='k2_pro' && !F(G,'k2.p1.km'); },
  h:['Der Fahrschein kostet 1,60 Mark, und mit Kuna komme ich hier nicht weit.','Fikret in der Buregdžinica schimpft über einen Brief, den er nicht lesen kann.','Ich bin Übersetzer. Wenn ich ihm den Brief richtig vorlese, zahlt er mich vielleicht dafür.']},
 {id:'p1b',t:'In die Altstadt kommen',open:function(G){ return G.phase==='k2_pro' && F(G,'k2.p1.km') && !F(G,'k2.p1.rode'); },
  h:['Die Eins fährt vom Bahnhof in die Baščaršija.','Am Kiosk gibt es Fahrscheine, die Haltestelle ist vor dem Bahnhof.','Fahrschein kaufen, einsteigen, und im Wagen am Entwerter entwerten.']},
 {id:'p2',t:'Mala wartet an der Drei',open:function(G){ return G.phase==='k2_pro' && F(G,'k2.p1.rode') && !F(G,'k2.p2.back'); },
  h:['Mala sitzt an der Haltestelle der Drei und wartet, ohne zu wissen worauf.','Was hat sie früher mit der Drei verbunden? Etwas, das ich in der Tasche habe.','Zeig ihr meinen entwerteten Fahrschein.']},
 {id:'p3',t:'Wohin für die Nacht?',open:function(G){ return ph(G,['k2_pro']) && F(G,'k2.p2.back') && !F(G,'k2.p3.hajra'); },
  h:['Sanja hat mir ein Zimmer bei ihrer Tante besorgt.','Hajra Mešić, eine Pension in Kovači. Rade kennt den Weg.','Über den Stadtplan nach Kovači.']},
 {id:'p4',t:'Der Gesang in der Nacht',open:function(G){ return G.phase==='k2_pro_n' && !F(G,'k2.pro.tomaz'); },
  h:['Mala hat jemanden singen hören.','Es kam von der Sahat-kula, dem Uhrturm hinter der Baščaršija.','Zur Kula gehen und den jungen Mann unter der Uhr ansprechen.']},
 // ---------------- Fall 1
 {id:'s1a',t:'Wann ist „sieben“?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_twosevens'); },
  h:['Tomaž wartet auf „sieben“. Die Uhr am Turm zeigt etwas ganz anderes als meine.','Lejla auf der Terrasse der Kafana weiß, wie die Kula geht.','Verbinde Tomažs Zettel mit dem, was Lejla über die Mondzeit erzählt.']},
 {id:'s1b',t:'Sieben Uhr nach der Kula, aber wann genau?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_twosevens') && !N(G,'s1_2316'); },
  h:['Die Kula zählt ab Sonnenuntergang. Ich brauche den Sonnenuntergang an dem Tag.','Jakob im Antiquariat an der Ferhadija hat alte Kalender, auch Takvime. Und ich brauche das genaue Datum.','Mit dem Datum aus Nedžads Auftragsbuch den Takvim von 1972 lesen, dann beides verbinden.']},
 {id:'s1c',t:'Woher stammt das Armband?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_bracelet') && !N(G,'s1_date'); },
  h:['Tomaž hat ein graviertes Armband aus der Čaršija.','In Kazandžiluk graviert die Familie Kazandžić seit hundert Jahren. Nedžad hat die alten Bücher.','Nedžad hat keine Zeit. Hilf ihm mit seiner deutschen Gravur.']},
 {id:'s1d',t:'Was ist an jenem Abend passiert?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_left'); },
  h:['Jemand muss an jenem Abend in der Kafana gewesen sein.','Šaćir am Fenstertisch war damals Kellner. Frag ihn nach dem Soldaten. Und Tomaž nach seiner Nacht.','Verbinde, wann die Kafana zumachte, mit Tomažs Zapfenstreich.']},
 {id:'s1e',t:'Emina redet nicht',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && !N(G,'s1_waited'); },
  h:['Emina will über 1972 nicht reden.','Mit ihrer Enkelin redet sie anders, hinter der Theke.','Lass Mala hinter der Theke lauschen.']},
 {id:'s1f',t:'Wo sind die Briefe?',open:function(G){ return ph(G,['k2_s1','k2_s1_n']) && N(G,'s1_nowrite') && !I(G,'letters_tz') && !F(G,'k2.s1.tin'); },
  h:['Emina fragt, warum er nie geschrieben hat. Vielleicht hat er geschrieben.','Šaćir hat etwas weitergegeben. Mala sieht in der Kammer, wohin es ging. Die Kammer ist verschlossen.','Lejla hilft, wenn ich ihr helfe. Wenn Emina weg ist, kommt man in die Kammer. Nedžads Stemmeisen hilft am Spiegel.']},
 {id:'s1g',t:'Emina die Wahrheit sagen',open:function(G){ return ph(G,['k2_s1']) && N(G,'s1_missed') && N(G,'s1_betrayal') && !F(G,'k2.s1.emina'); },
  h:['Ich habe alles zusammen. Emina muss es hören.','Erst die Briefe und das Armband, dann die Wahrheit, in der richtigen Reihenfolge.','Zuerst, warum sie sich verpasst haben. Dann, warum er nie schrieb.']},
 {id:'s1h',t:'Tomaž halten',open:function(G){ return G.phase==='k2_s1_n' && !F(G,'k2.s1.free'); },
  h:['Um elf will Tomaž gehen, wie damals.','Er glaubt, er müsse in die Kaserne. Lejla hat erzählt, was aus der Kaserne geworden ist.','Sag ihm, dass es die Kaserne nicht mehr gibt, und dass sie kommt, wenn die Kula sieben schlägt.']},
 // ---------------- Malas Spur
 {id:'m1a',t:'Das Foto mit der Uhr',open:function(G){ return N(G,'m2_photo') && !N(G,'m2_clocktower') && !ph(G,['k2_fin_n','k2_epi']); },
  h:['Auf Jakobs Foto steht ein Hochhaus mit einer Uhr auf dem Dach.','Rade an der Baščaršija kennt jede Haltestelle von damals.','Zeig Rade das Foto.']},
 {id:'m1b',t:'Wo war die leuchtende Uhr?',open:function(G){ return N(G,'m2_f_clock') && !N(G,'m2_building'); },
  h:['Mala erinnert sich an eine Uhr mit leuchtenden Ziffern.','Rade weiß, welches Hochhaus eine Uhr hatte.','Verbinde Malas Splitter mit dem, was Rade über das Siebener sagt.']},
 {id:'m1c',t:'Malas Dose',open:function(G){ return N(G,'m2_alija') && !N(G,'m2_ticket'); },
  h:['Alija sagt, die Kleine habe zwei Fahrscheine gekauft.','Mala trägt ihre Dose immer bei sich.','Frag Mala nach dem, was Alija gesagt hat.']},
 {id:'m1d',t:'Ein Fahrschein von 1993',open:function(G){ return N(G,'m2_ticket') && !N(G,'m2_promise'); },
  h:['Malas Fahrschein ist am 12.11.1993 entwertet.','Rade weiß, welche Bahnen damals fuhren.','Verbinde den Fahrschein mit dem, was Rade über November dreiundneunzig sagt.']},
 {id:'m1e',t:'Der Junge in der Drei',open:function(G){ return N(G,'m2_kids') && N(G,'m2_marko7') && !N(G,'m2_mali'); },
  h:['Rade erinnert sich an zwei Kinder.','Ich habe selbst im Siebener gewohnt.','Verbinde die zwei Kinder mit dem, was ich über mich weiß.']},
 // ---------------- Fall 2
 {id:'s2a',t:'Der Spuk im Antiquariat',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && !N(G,'s2_stamp'); },
  h:['In Jakobs Laden liest jemand, der nicht da ist.','Mala sieht ihn im Lesesessel. Und sie kann lesen, was in einem verschlossenen Buch steht.','Mala soll das Buch in der Vitrine ansehen.']},
 {id:'s2b',t:'Wem gehört das Buch?',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_stamp') && !N(G,'s2_provenance'); },
  h:['Wer war Leser 2204?','Jakob schreibt in sein Ankaufbuch, von wem er kauft.','Verbinde den Leihzettel mit dem Eintrag im Ankaufbuch.']},
 {id:'s2c',t:'Warum gab er es nie zurück?',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_due') && !N(G,'s2_noreturn'); },
  h:['Für ihn läuft die Frist ab. Was ist im August 1992 mit der Bibliothek geschehen?','Jakob erzählt es, wenn man ihn nach der Bibliothek fragt.','Verbinde die Frist mit dem Brand.']},
 {id:'s2d',t:'Was ist im Buch?',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_provenance') && !N(G,'s2_fragments'); },
  h:['Warum war ihm gerade dieses Buch so wichtig?','Sein Sohn in Wien und eine alte Nachbarin an der Obala erinnern sich an ihn.','Ruf Petar aus der Pension an, frag Milka an der Miljacka, und verbinde beides.']},
 {id:'s2e',t:'In die Vijećnica',open:function(G){ return ph(G,['k2_s2']) && !I(G,'pass'); },
  h:['Nachts kommt niemand in die Vijećnica.','Die Restauratorin am Bauzaun braucht jemanden, der alte deutsche Schrift lesen kann.','Jakob hat eine Tafel mit der Kurrentschrift.']},
 {id:'s2f',t:'Das Buch zurückgeben',open:function(G){ return ph(G,['k2_s2','k2_s2_n']) && N(G,'s2_fragments') && N(G,'s2_provenance') && !F(G,'k2.s2.free'); },
  h:['Das Buch muss dorthin, wo es ausgeliehen wurde.','Jakob gibt es nur her, wenn er weiß, wem es gehört und warum. Abends braucht es den Passierschein.','Leg das Buch in der Vijećnica auf die Ausleihtheke.']},
 // ---------------- Fall 3
 {id:'s3a',t:'Wer war L.?',open:function(G){ return ph(G,['k2_s3','k2_s3_n']) && !N(G,'m2_lana'); },
  h:['In Haus 7 stehen im Hausbuch die alten Mieter.','Malas Splitter sagt: neunter Stock. Im Register in Split stand „…ić, L.“.','Verbinde das Register mit dem Hausbuch.']},
 {id:'s3b',t:'In den Schutzraum',open:function(G){ return ph(G,['k2_s3']) && !I(G,'key_shelter') && !F(G,'k2.s3.inShelter'); },
  h:['Šehić gibt den Schlüssel nicht her.','Er spricht mit jemandem, wenn er allein ist. Mala kann an seiner Tür lauschen.','Sprich mit ihm über das, was Mala gehört hat. Vorsichtig.']},
 {id:'s3c',t:'Der Schrank im Keller',open:function(G){ return ph(G,['k2_s3','k2_s3_n']) && F(G,'k2.s3.inShelter') && !F(G,'k2.s3.cabinet'); },
  h:['Der Schrank ist verschlossen. Zora weiß, wo der Schlüssel ist.','Mirza erinnert sich an die Klingel. Mala hört im Keller, was oben geschieht.','Mala im Schutzraum lassen, mit Marko oben in der Halle den Klingelknopf drücken, dann zu Mala wechseln.']},
 {id:'s3d',t:'Die Zeugnisse',open:function(G){ return ph(G,['k2_s3']) && I(G,'svjedocanstva') && !F(G,'k2.s3.stamped'); },
  h:['Zora hat versprochen: Zeugnisse mit Stempel.','Die Schule gibt es nicht mehr. Mirza hat Dinge aus ihr aufgehoben.','Den Stempel im Schutzraum auf die Zeugnisse drücken.']},
 {id:'s3e',t:'Wer kommt zur letzten Stunde?',open:function(G){ return ph(G,['k2_s3']) && N(G,'s3_register') && !(F(G,'k2.s3.mirza') && F(G,'k2.s3.selma') && F(G,'k2.s3.damir')); },
  h:['Zora will, dass alle da sind. Drei aus dem Klassenbuch leben noch hier.','Mirza, Selma und Damir. Jeder braucht einen anderen Grund.','Mirza muss erfahren, was Zora über ihn geschrieben hat. Selma braucht eine Hand. Damir seine eigene Zeichnung.']},
 // ---------------- Finale
 {id:'f1',t:'Der Karton aus Split',open:function(G){ return G.phase==='k2_fin' && !I(G,'karton') && !F(G,'k2.f2.opened'); },
  h:['Sanja hat den Karton geschickt. Die Nummer kommt per SMS.','Mein Handy ist leer. In der Pension gibt es eine Steckdose. Der Paketschalter ist am Busbahnhof.','Handy laden, SMS lesen, mit der Nummer zum Paketschalter.']},
 {id:'f2',t:'Die andere Hälfte',open:function(G){ return G.phase==='k2_fin' && I(G,'photo_m') && !N(G,'f2_photo'); },
  h:['Mein Foto ist an einer Kante gerissen.','Mala hat in ihrer Dose etwas, das sie keinem zeigt. Vielleicht zeigt sie es, wenn ich ihr etwas Gleiches zeige.','Zeig Mala den alten Fahrschein aus dem Karton.']},
 {id:'f3',t:'Lanas Mutter',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_photo') && !N(G,'f2_postcard'); },
  h:['Nada im neunten Stock öffnet keinem.','Sie öffnet vielleicht, wenn sie sieht, wer ich bin.','Zeig Nada das ganze Foto.']},
 {id:'f4',t:'Großmutters Haus',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_postcard') && !N(G,'f2_rcm'); },
  h:['Lana wollte mich holen. Ich war damals bei Großmutter in Vratnik.','Hajra hat den Schlüssel zu Großmutters Haus. In der Küche spürt Mala etwas.','Das Wärmefach am Herd klemmt. Nedžads Stemmeisen.']},
 {id:'f5',t:'Was geschah im Januar 1994?',open:function(G){ return G.phase==='k2_fin' && N(G,'f2_rcm') && !N(G,'f2_cameback'); },
  h:['Lana hat mir geschrieben, und ihrer Mutter auch.','Die Nachricht vom Roten Kreuz und die Postkarte sagen dasselbe.','Verbinde die beiden.']},
 {id:'f6',t:'Die letzte Fahrt',open:function(G){ return ph(G,['k2_fin_n']) && !F(G,'k2.f2.ride'); },
  h:['Zwei Fahrscheine für die erste Drei nach dem Krieg.','Mala gibt mir ihren, wenn ich sie darum bitte. Entwertet werden beide in der Bahn.','In der Drei beide Fahrscheine am Entwerter entwerten.']}
];
M.K2HINTS=H;
M.hintsOpen=function(){ var G=M.GS; if (M.chapterOf(G)!==2) return []; return H.filter(function(h){ try{ return h.open(G); }catch(e){ return false; } }); };
M.showHints=async function(){ var E=M.E, A=M.API; if (E.busy||E.screen!=='game') return; var list=M.hintsOpen(); if (!list.length){ M.flash('Gerade fällt mir nichts ein, woran ich hänge.'); return; }
  E.busy=true; try{
    var opts=list.map(function(h,i){ var lv=A.G.flags['hint.'+h.id]||0; return {t:h.t+(lv?'  ('+lv+'/3)':''),id:i}; }); opts.push({t:'Doch nicht.',id:-1,bye:true});
    var c=await A.choose(opts,{title:'Woran hänge ich?'}); if (c===-1||c===undefined||c===null) return; var h=list[c]; if (!h) return;
    var lv=Math.min(3,(A.G.flags['hint.'+h.id]||0)+1); A.G.flags['hint.'+h.id]=lv;
    for (var i=0;i<lv;i++) await A.narrate('Hinweis '+(i+1)+' von 3: '+h.h[i]);
  } finally { E.busy=false; } };
})(M);
