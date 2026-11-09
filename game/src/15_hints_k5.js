/* ===== 15_hints_k5.js — Hinweise Kapitel 5 (Sarajevo): je Rätselabschnitt vier Stufen =====
   Stufen: 1 Orientierung · 2 Denkrichtung · 3 Konkreter Ansatz · 4 Nächster Schritt (Konzept 7.1–7.3).
   {m,g}: g ist Malas Fassung. Ein Thema geht erst auf, wenn seine Voraussetzungen erfüllt sind (open). ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; } function I(G,id){ return G.inv.indexOf(id)>=0; }
function P(G,list){ return list.indexOf(G.phase)>=0; }
M.HINTS_K5=[
 // ---------------- Prolog
 {id:'h5a',t:'Ankunft',open:function(G){ return G.phase==='k5_pro' && !F(G,'k5.p.hajra'); },
  s:['Mama ist seit fünfzehn Stunden unterwegs. Erst ein Dach über dem Kopf.','Hajra hat eine Pension in Kovači. Dort wohne ich, wenn ich in Sarajevo bin.','Am Busbahnhof wartet ein Taxi.','Mit dem Taxi nach Kovači fahren.']},
 {id:'h5b',t:'Unter Ružas Dach',open:function(G){ return G.phase==='k5_pro' && F(G,'k5.p.hajra') && !N(G,'b5_hand'); },
  s:['Mama will unter das Dach, das sie achtzehn Jahre bezahlt hat.','Vratnik, Ružas Haus. Hajra hat den Schlüssel gegeben.',{m:'Im Garten liegt etwas unter einer Plane. Mala spürt mehr als ich.',g:'Im Garten liegt etwas unter der Plane. Ich spüre es.'},
     {m:'Zu Mala wechseln und den Garten spüren. Dann als Marko die Plane heben.',g:'Ich spüre den Garten. Dann soll er die Plane heben.'}]},
 {id:'h5c',t:'Haus 7',open:function(G){ return G.phase==='k5_pro' && N(G,'b5_hand') && !F(G,'k5.p.nada'); },
  s:['Mama will Haus 7 sehen. Und Nada wartet im neunten Stock.','Alipašino Polje, die Hochhäuser.',function(G){ return F(G,'k5.p.seventh')?'Mama bleibt im siebten Stock. Nada wohnt zwei Stockwerke höher.':'Durch die Eingangshalle die Treppe hinauf. Im siebten Stock bleibt Mama stehen.'; },
     function(G){ return F(G,'k5.p.seventh')?'Die Treppe weiter hinauf zu Nada, allein.':'Mit Mama in den siebten Stock, dann allein weiter hinauf zu Nada.'; }]},   // Hinweisprobe: nach der Szene im siebten Stock nennt der Satz den Rest des Wegs
 // ---------------- Donnerstag
 {id:'h5d',t:'Nadas Tafel',open:function(G){ return G.phase==='k5_d1' && !N(G,'s5_frist'); },
  s:['Nada hat für Lanas Grab eine Tafel bestellt.','Bei einem Kupferschmied, der genau graviert, was man ihm sagt.','Nedžad, in der Kazandžiluk.','Zu Nedžad fahren und nach Nadas Tafel fragen.']},
 {id:'h5e',t:'Die Hand',open:function(G){ return G.phase==='k5_d1' && !N(G,'b5_reihe'); },
  s:['Eine Hand auf meinen Augen, ein nasser Ärmel, Malz.','Malz riecht man an der Brauerei. Dort war es.',{m:'An der Brauerei pocht mein Kopf. Mala soll den Hahn spüren.',g:'Ich spüre den Hahn an der Brauerei.'},{m:'Zur Brauerei fahren und als Mala den Hahn spüren.',g:'An der Brauerei den Hahn spüren.'}]},
 // ---------------- Donnerstagnacht
 {id:'h5f',t:'Das kalte Fenster',open:function(G){ return G.phase==='k5_n1' && F(G,'k5.n1.home') && !F(G,'k5.n1.atem'); },
  s:['Es ist spät. In meinem Zimmer bei Hajra ist das Fenster kalt.','Draußen liegt Kovači unter Frost. Ich will hinaussehen.','Das Fenster in meinem Zimmer.','Im Zimmer das Fenster benutzen.']},
 {id:'h5g',t:'Der Mann am Hahn',open:function(G){ return G.phase==='k5_n1' && F(G,'k5.n1.home') && N(G,'b5_reihe') && !N(G,'b5_hamdija'); },
  s:['Er zeigt sich nicht. Er wartet auf etwas.','„Kanisteri u red!“ Er ordnet Kanister.',function(G){ return I(G,'kanister')?'Ich habe Papas blauen Kanister.':'Papas blaue Kanister. Einer liegt in Ružas Garten unter der Plane.'; },
     function(G){ return I(G,'kanister')?'Mit dem Kanister nachts zur Brauerei fahren und sich am Hahn anstellen.':'In Vratnik den Kanister holen, dann nachts zur Brauerei.'; }]},
 {id:'h5g2',t:'Schlafen',open:function(G){ return G.phase==='k5_n1' && F(G,'k5.n1.atem') && N(G,'b5_hamdija'); },
  s:['Für heute ist alles getan.','Morgen um neun bei Frau Kolar.','Zurück zu Hajra.','In der Pension ins Bett gehen.']},
 {id:'h5f0',t:'Gute Nacht',open:function(G){ return G.phase==='k5_n1' && F(G,'k5.n1.eve') && !F(G,'k5.n1.home'); },
  s:['Es ist spät. Ana bringt die Kinder zu Hajra.','Ich schlafe in der Pension, in Kovači.','Nadas Wohnungstür.','An der Wohnungstür gute Nacht sagen.']},
 // ---------------- Freitag
 {id:'h5h',t:'Frau Kolar',open:function(G){ return G.phase==='k5_d2' && !F(G,'k5.d2.inst'); },
  s:['Um neun bei Frau Kolar.','In der Gerichtsmedizin.','Mama kommt mit. Sie will ihn sehen.','Mit dem Stadtplan zur Gerichtsmedizin fahren.']},
 {id:'h5i',t:'Zwei Namen',open:function(G){ return P(G,['k5_d2','k5_n1']) && N(G,'s5_brett') && !N(G,'s5_beide'); },
  s:['Nada und Zlata müssen sich einigen. Mala entscheidet nicht für sie, ich auch nicht.','Warum hat jede diesen Namen geschrieben? Das Brett weiß es. Und Nadas Briefe.',
     {m:'Mala soll das Brett im Flur spüren. Und die Mappe in Lanas Zimmer.',g:'Ich spüre das Brett. Und Mamas Mappe.'},
     // Hinweisprobe (P12): Stufe 4 riet zum Verbinden, solange ein Nachhall noch fehlte
     function(G){ if (!N(G,'s5_nh_brett')) return {m:'Als Mala das Brett im Flur spüren.',g:'Als Mala das Brett im Flur spüren.'}; if (!N(G,'s5_nh_mappe')) return {m:'Als Mala die Mappe in Lanas Zimmer spüren.',g:'Als Mala die Mappe in Lanas Zimmer spüren.'}; return 'Die beiden Nachhall-Notizen im Notizbuch verbinden.'; }]},
 {id:'h5j',t:'Die Tafel',open:function(G){ return G.phase==='k5_d2' && N(G,'s5_beide') && !F(G,'k5.s.mounted'); },
  s:[function(G){ return F(G,'k5.s.agreed')?'Sie haben sich geeinigt. Jetzt muss es graviert werden.':'Beide haben recht. Jede muss hören, was die andere wollte.'; },
     function(G){ return F(G,'k5.s.agreed')?'Was steht schon auf dem Brett?':'Was hat Zlata gewollt, was Nada? Und was steht schon auf dem Brett?'; },
     function(G){ if (!F(G,'k5.s.toZlata')) return 'Zlata sagen, warum Nada siebzehn Jahre geschrieben hat.'; if (!F(G,'k5.s.toNada')) return 'Nada sagen, warum Zlata „Mala“ geschrieben hat.'; if (!F(G,'k5.s.agreed') && !N(G,'s5_teile')) return 'Was steht schon auf dem Brett, und was hat nur Nada? Das muss ich erst selbst zusammenlegen.'; if (!F(G,'k5.s.agreed')) return 'Beiden die zwei Hälften vorschlagen: oben die Tafel, unten das Brett.'; return 'Zu Nedžad: Name und Geburt aufs Messing. Der Tod steht schon auf dem Brett.'; },
     function(G){ if (!F(G,'k5.s.agreed') && !N(G,'s5_teile')) return 'Im Notizbuch „Damit man sie findet“ und „Zlatas Brett“ verbinden.'; if (!F(G,'k5.s.agreed')) return 'Mit Nada und Zlata reden, jeder sagen, was die andere wollte, dann die zwei Hälften vorschlagen.'; if (!F(G,'k5.s.engraved')) return 'Bei Nedžad gravieren lassen: „LANA DELIĆ“, „3. 3. 1976“, keine dritte Zeile.'; return 'Zurück zu Nada: Vlado montiert Tafel und Brett.'; }]},
 // Hinweisprobe (P12): nach „Otvori.“ nennt Stufe 4 das Öffnen des Kastens, nicht wieder das Gespräch
 {id:'h5k',t:'Hamdija',open:function(G){ return G.phase==='k5_d2' && N(G,'b5_hamdija') && !F(G,'k5.b.gone'); },
  s:[function(G){ if (!N(G,'b5_kasten')) return 'Er lässt mich nicht an den Kasten hinter dem Hahn.'; if (!N(G,'b5_tag')) return 'Er glaubt mir nicht, dass ich der Junge bin.'; if (!N(G,'b5_wer')) return 'Einer hat mich damals festgehalten. Wer, habe ich noch nicht zu Ende gedacht.'; if (!N(G,'b5_drei')) return 'Für ihn ist April 1993. Er weiß nicht, was aus den Gräbern wurde.'; if (!I(G,'liste')&&!F(G,'k5.b.listKolar')) return 'Er muss mich erkennen.'; if (!F(G,'k5.b.listKolar')) return 'Die Liste muss zu Frau Kolar.'; if (!F(G,'k5.b.ready')) return 'Er muss hören, was aus den sieben geworden ist.'; return 'Er ist bereit zu gehen.'; },
     function(G){ if (!N(G,'b5_kasten')) return 'Was ist im Kasten?'; if (!N(G,'b5_tag')) return 'Was weiß nur der Junge von damals?'; if (!N(G,'b5_wer')) return 'Die Hand auf den Augen roch nach Malz. Und vorn am Hahn hob einer die Hand.'; if (!N(G,'b5_drei')) return 'Frau Kolar weiß, was aus dem Grab an der Brauerei wurde.'; if (!I(G,'liste')&&!F(G,'k5.b.listKolar')) return 'Die gefüllten Kanister. Und der Rechenschieber.'; if (!F(G,'k5.b.listKolar')) return 'Drei Tote haben noch keinen Namen.'; if (!F(G,'k5.b.ready')) return 'Sie sind gefunden. Alle sieben.'; return 'Er kann jetzt gehen.'; },
     function(G){ if (!N(G,'b5_kasten')) return {m:'Mala geht durch Wände. Auch in einen Blechkasten.',g:'Ich gehe durch den Kasten.'}; if (!N(G,'b5_tag')) return {m:'Mala soll den Tag spüren: am Hahn, in der Mitte, an der Brücke.',g:'Ich spüre den Tag: am Hahn, in der Mitte, an der Brücke.'}; if (!N(G,'b5_wer')) return 'Die Hand an den Kanistern und der Tag am Hahn gehören zusammen.'; if (!N(G,'b5_drei')) return 'In der Gerichtsmedizin nach dem Grab an der Brauerei fragen.'; if (!I(G,'liste')&&!F(G,'k5.b.listKolar')) return 'Ihm beides sagen: die Kanister und den Rechenschieber.'; if (!F(G,'k5.b.listKolar')) return 'Die Liste in die Gerichtsmedizin bringen.'; if (!F(G,'k5.b.ready')) return 'Zu Hamdija an den Hahn.'; return {m:'Mala öffnet die Schwelle. Am Hahn.',g:'Ich mache ihm Licht. Am Hahn.'}; },
     function(G){ if (!N(G,'b5_kasten')) return 'Als Mala den Kasten hinter dem Hahn ansehen.'; if (!N(G,'b5_tag')) return 'Als Mala den Hahn, die Mitte und die Brücke spüren.'; if (!N(G,'b5_wer')) return 'Im Notizbuch „Nemoj gledati“ und „Der neunzehnte April“ verbinden.'; if (!N(G,'b5_drei')) return 'Frau Kolar nach dem Grab an der Brauerei fragen.'; if (F(G,'k5.b.trust')&&!I(G,'liste')&&!F(G,'k5.b.listKolar')) return 'Den Blechkasten hinter dem Hahn öffnen.'; if (!I(G,'liste')&&!F(G,'k5.b.listKolar')) return 'Mit Hamdija reden und die Kanister und den Rechenschieber nennen.'; if (!F(G,'k5.b.listKolar')) return 'Frau Kolar die Liste geben.'; if (!F(G,'k5.b.ready')) return 'Mit Hamdija reden: Sie sind gefunden.'; return 'Als Mala Hamdija hinüberbringen.'; }]},
 {id:'h5fun',t:'Lanas Begräbnis',open:function(G){ return G.phase==='k5_fun' && !F(G,'k5.fun.done'); },
  s:['Heute wird Lana begraben.','Alle sind gekommen. Nada und Zlata stehen am Pfosten.','Am Grab gibt es nichts zu lösen.','Eine Wahl am Grab treffen. Beide sind richtig.']},
 // ---------------- Freitagabend
 {id:'h5l',t:'Wem gehören die Fahrscheine?',open:function(G){ return G.phase==='k5_d2_n' && !N(G,'f5_jasna'); },
  s:[function(G){ return N(G,'f5_wem')?'Nicht Nada. Wem dann?':'Mala sagt: für Nada. Stimmt das?'; },
     function(G){ return N(G,'f5_wem')?'Wer war samstags dabei? Und wer kann nicht hinauf?':'Wer war samstags dabei? Wer nicht?'; },
     function(G){ if (!N(G,'f5_eursamstag')) return 'Nada nach den Samstagen fragen.'; if (!N(G,'f5_wem')) return '„Für Mama. Wer sonst?“ und „Das war euer Samstag“ verbinden.'; return 'Was hat Mama an der Treppe im siebten Stock gesagt, bevor Šehić kam?'; },
     function(G){ if (!N(G,'f5_wem')) return 'Im Notizbuch „Wer sonst?“ und „Euer Samstag“ verbinden.'; return 'Im Notizbuch „Nicht Nada“ und „Mama kann nicht hinauf“ verbinden.'; }]},
 {id:'h5l2',t:'Das Totenmahl',open:function(G){ return G.phase==='k5_d2_n' && !F(G,'k5.e.meal'); },
  s:['Alle sitzen an Nadas Tisch.','Zwei Frauen, die achtzehn Jahre nicht miteinander geredet haben.','Mit Mama reden. Und mit Nada.','Mit Mama und mit Nada reden, bis der Abend weitergeht.']},
 {id:'h5l4',t:'Bis es hell wird',open:function(G){ return G.phase==='k5_d2_n' && F(G,'k5.n2.started') && !F(G,'k5.n2.done'); },
  s:['Die Žuta tabija. Mala hat sich gefragt.','Erst ich. Was will ich? Ehrlich.','„Es gibt kein Falsches. Es gibt nur ‚nur müde‘.“','Antworten. Jede der drei Antworten ist ehrlich.']},
 {id:'h5l3',t:'Der Samstag',open:function(G){ return G.phase==='k5_d2_n' && F(G,'k5.n2.done') && !F(G,'k5.sat.started'); },
  s:['Es wird hell. Morgen ist heute.','Ab hier gibt es kein Zurück in die Tage davor.','Auf der Bastei, wenn du bereit bist.','Die Bank auf der Žuta tabija benutzen und den Samstag beginnen.']},
 // ---------------- Samstag
 {id:'h5m',t:'Zehn nach elf',open:function(G){ return G.phase==='k5_sat' && !F(G,'k5.sat.tickets'); },
  s:['Heute ist ihr Samstag.','Wo hat Mama Lana die Tür aufgemacht?','Um elf in den siebten Stock. Šehić sperrt auf.','Im siebten Stock Mama an der alten Tür Malas Dose geben. Dann nichts mehr tun.']},
 {id:'h5n',t:'Nadas Küche',open:function(G){ return G.phase==='k5_sat' && F(G,'k5.sat.knock') && !F(G,'k5.sat.drawn'); },
  s:['Nada muss es selbst sehen.',{m:'Was kann Mala, wenn ich dabei bin?',g:'Was kann ich, wenn er dabei ist?'},'Die Balkontür aus Glas. Nada steht in der Küche.',
     // Hinweisprobe (P12): die Stelle heißt im Spiel „Balkontür“
     function(G){ var s=G.flags['k5.sat.draw']||0; return s>=4?'Als Marko die Räder zeichnen: die Balkontür benutzen.':(s%2===0?'Als Marko die Balkontür anhauchen (benutzen).':'Als Mala auf die beschlagene Balkontür zeichnen.'); }]},
 {id:'h5q',t:'Hinauf zu Ruža',open:function(G){ return G.phase==='k5_sat' && F(G,'k5.sat.rode') && !F(G,'k5.sat.gate'); },
  s:['Jeder Samstag hat oben aufgehört. Bei Großmutter, in Vratnik.','Mala will hinauf. Zu Fuß, wie früher.','Die Gasse nach Vratnik, am oberen Ende des Platzes.','Die Gasse nach Vratnik benutzen.']},
 {id:'h5r',t:'Unter Ružas Dach',open:function(G){ return G.phase==='k5_sat' && F(G,'k5.sat.gate') && !F(G,'k5.sat.done'); },
  s:['Alle sitzen in Ružas Küche. Sechs Tassen.','Mama hat etwas auf dem Herzen. Ich sehe es an ihren Händen.','Mama am Tisch.','Mit Mama reden.']},
 // ---------------- Montag
 {id:'h5o',t:'Das Wasser',open:function(G){ return G.phase==='k5_epi' && !F(G,'k5.e.water'); },
  s:['Heute wird Papa begraben. Am Abend sitzen wir unter Ružas Dach.','Kaffee braucht Wasser. Das beste der Stadt kommt aus dem Hahn an der Brauerei.',function(G){ return I(G,'kanister_voll')?'Der Kanister ist voll. Er muss nach Vratnik.':'Den blauen Kanister am Hahn füllen.'; },
     function(G){ return I(G,'kanister_voll')?'Mit dem vollen Kanister nach Vratnik gehen.':'An der Brauerei den Kanister mit dem Hahn benutzen.'; }]},
 {id:'h5p',t:'Die Scheibe',open:function(G){ return G.phase==='k5_epi' && F(G,'k5.e.funeral') && !F(G,'k5.e.done'); },
  s:['Das Fenster neben dem Tisch ist beschlagen.','Lana hat mir das Zeichnen beigebracht. Die Räder habe ich nie gekonnt.','Das Fenster in Ružas Küche.','Das Fenster benutzen.']},
 // ---------------- zwischen zwei Abschnitten
 {id:'x5day',t:'Der Tag geht weiter',open:function(G){ return P(G,['k5_pro','k5_d1','k5_d2','k5_d2_n','k5_epi','k5_fun','k5_sat']) && !!(M.k5DayReady && M.k5DayReady(G)); },
  s:[function(G){ return ({k5_pro:'Mama hat Haus 7 gesehen, Nada weiß, dass wir da sind.',k5_d1:'Für den Donnerstag ist alles getan. Es wird Abend.',k5_d2:'Hamdija ist gegangen, die Tafel ist fertig. Es ist bald zwei.',k5_d2_n:'Ich weiß, wem die Fahrscheine gehören. Der Abend geht zu Ende.',k5_epi:'Das Wasser ist in Ružas Küche. Gleich ist elf.',k5_fun:'Das Begräbnis ist vorbei.',k5_sat:'Der Samstag ist zu Ende.'})[G.phase]||'Für jetzt ist alles getan.'; },
     'Der Rest kommt von selbst.','Nichts mehr suchen.','Einen Moment warten: Der nächste Abschnitt beginnt von selbst.']}
];
})(M);
