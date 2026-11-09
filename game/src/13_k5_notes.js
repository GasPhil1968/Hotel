/* ===== 13_k5_notes.js — Kapitel 5: Notizen, Schlussfolgerungen, Antworten bei falschen Verbindungen =====
   Fälle: j5 Jasna (Rückkehr) · s5 Der Stein (Lanas Grabzeichen) · b5 Die Brauerei (Hamdija) · f5 Die Fahrscheine (Malas Dose, die Samstage, der Atem).
   Mehrstufige Kette (Konzept 7.3): f5_dose (Vermutung) + f5_eursamstag → f5_wem (geändert); f5_wem + j5_treppe → f5_jasna (belastbar). ===== */
(function(M){
'use strict';
var N={};
function n(id,c,g,s,t,o){ N[id]=Object.assign({c:c,g:g,s:s,t:t,show:true},o||{}); }
function has(G,id){ return G.notes.indexOf(id)>=0; }
// ---------------------------------------------------------------- Aus München
n('k5_c_muenchen','j5','Aus München','Im März','Aus München: Papa ist gefunden. „Im März fahre ich hin“, hat Mama gesagt. „Ich setze mich ans Fenster.“ Jetzt ist März.',{p:'p:jasna'});
n('k5_c_mala','f5','Die Dose','Nach dem Begräbnis','Aus München, Malas Satz: „Nach dem Begräbnis frage ich mich selbst noch einmal. Und dann sagst du mir ehrlich, was du willst. Nicht ‚nur müde‘.“ Den richtigen Satz.',{p:'p:mala'});
// ---------------------------------------------------------------- Jasna
n('j5_wo','j5','Vratnik','„Wo es war“','Mama unter Ružas Dach, vor den Kanistern: „Ich will sehen, wo es war.“',{p:'p:jasna'});
n('j5_nichtdrei','j5','Haus 7','Nicht die Drei','Mama will nicht mit der Drei fahren. „Nicht die Drei. Noch nicht.“ Wir nehmen ein Taxi, quer durch die Stadt.',{p:'p:jasna'});
n('j5_treppe','j5','Haus 7','Mama kann nicht hinauf','Mama im siebten Stock, an unserer alten Tür: „Ich kann da nicht hinauf. Ihre Tochter ist losgefahren, um meinen Sohn zu holen. Und ich bin ohne ihn gefahren.“',{p:'p:jasna'});
n('j5_samstag','j5','Haus 7','Samstag um elf','Šehić: „Die Wohnung im siebten Stock steht leer. Samstag um elf bin ich da, dann sperre ich auf.“',{p:'p:sehic'});
// ---------------------------------------------------------------- Der Stein
n('s5_tafel','s5','Die Tafel','Nadas Tafel','Nada hat bei Nedžad eine Messingtafel für Lanas Grab bestellt. Den Text hat sie offengelassen: „Bis Freitag. Es kommt noch jemand.“',{p:'p:nada'});
n('s5_frist','s5','Die Tafel','Bis Freitag, zwölf','Nedžad: „Ich graviere, was man mir sagt. Nicht, was man meint.“ Er braucht den Text bis Freitag, zwölf Uhr.',{p:'p:nedzad'});
n('s5_brett','s5','Das Brett','Zlatas Brett','Zlatas Brett aus Skela, in eine Wolldecke gewickelt: MALA · 15.1.1994. Bato hat es mit dem Taschenmesser geschnitten. Zlata: „Bei mir hieß sie Mala. So wollte sie es.“ Nada: „Auf dem Grab meiner Tochter steht, wie sie heißt.“',{p:'p:zlata'});
n('s5_nh_brett','s5','Das Brett','Die Lampennacht','Malas Nachhall am Brett: Januar 1994, Skela, im Schuppen. Bato schneidet, Zlata hält die Lampe: „Piši kako je rekla. Mala. Da je nađu.“ – „Schreib, wie sie gesagt hat. Mala. Damit man sie findet.“',{p:'p:mala'});
n('s5_mappe','s5','Nadas Briefe','Siebzehn Januare','In Lanas Zimmer Nadas Mappe: siebzehn Durchschläge an den Suchdienst, einer für jeden Januar. Jeder fängt gleich an: „Tražim svoju kćer Lanu Delić, rođenu 3. 3. 1976.“ – „Ich suche meine Tochter Lana Delić, geboren am 3. 3. 1976.“',{p:'p:nada'});
n('s5_nh_mappe','s5','Nadas Briefe','Den Namen laut','Malas Nachhall an der Mappe: Jeden Januar sitzt Mama am Küchentisch und sagt den Namen laut, bevor sie schreibt. „Lana Delić. Da je nađu.“ – „Damit man sie findet.“',{p:'p:mala'});
// ---------------------------------------------------------------- Die Brauerei
n('b5_hand','b5','Die Hand','Nemoj gledati','Malas Nachhall an Papas Kanistern: zuerst Papa, der am Küchentisch VUKOVIĆ draufmalt. Dann eine Hand auf meinen Augen. Ein nasser Ärmel, Geruch nach Malz. „Nemoj gledati, mali.“',{p:'p:mala'});
n('b5_reihe','b5','Der Hahn','Kanister in die Reihe','Malas Nachhall am Hahn der Brauerei: Nacht, Kanister klappern, eine Männerstimme: „Kanisteri u red! Jedan po jedan!“ – „Kanister in die Reihe! Einer nach dem anderen!“ Er zeigt sich nicht. Er wartet auf Kanister.',{p:'p:mala'});
n('b5_hamdija','b5','Hamdija','Der Mann am Hahn','An der Brauerei, mit dem blauen Kanister: ein Mann in Gummischürze, die Ärmel nass bis zum Ellbogen. Hamdija, von der Abfüllung. Für ihn ist April 1993. An den Kasten hinter dem Hahn lässt er keinen.');
n('b5_kasten','b5','Hamdija','Im Kasten','Mala im Blechkasten hinter dem Hahn: ein Einmachglas, darin Papier, zusammengerollt. Und ein Nachhall: Kerzenlicht, ein Mann schreibt und zählt halblaut. „Sedam.“ Sieben.',{p:'p:mala'});
n('b5_tag','b5','Der Hahn','Der neunzehnte April','Malas Nachhall an drei Stellen. Am Hahn hebt Hamdija die Hand: „Ima pritiska!“, der Druck ist da. Ein Mann in blauer Jacke dreht sich um, zu mir, und ruft. Dann ist es laut. Hamdija läuft nach hinten und hält mir die Augen zu. Später füllt er mir am Hahn beide Kanister. Keiner sagt etwas.',{p:'p:mala'});
n('b5_drei','b5','Die Liste','Drei ohne Namen','Frau Kolar: Im Grab an der Brauerei lagen sieben. Vier haben einen Namen, drei nicht. „Eine Liste mit Beschreibungen? Dann hätten wir eine Spur.“',{p:'p:kolar'});
n('b5_liste','b5','Die Liste','Sieben Zeilen','Hamdijas Liste aus dem Einmachglas: sieben Tote an der Mauer unter der Linde, sieben Dinge in sieben Taschen. Nummer drei: „Rechenschieber ‚Z. V.‘ in der Tasche. Der Sohn hat das Wasser nach Hause getragen.“',{p:'i:liste'});
// ---------------------------------------------------------------- Die Fahrscheine
n('f5_dose','f5','Die Dose','„Wer sonst?“','Mala über ihre Dose mit den zwei Fahrscheinen: „Für Mama. Wer sonst?“ So sagt sie es. Ich bin nicht sicher.',{p:'p:mala'});
n('f5_eursamstag','f5','Die Samstage','„Euer Samstag“','Nada über die Fahrscheine: „Die hat sie bei Alija gekauft. Samstags war sie bei euch. Ich war nie dabei. Das war euer Samstag.“',{p:'p:nada'});
n('f5_plaetze','f5','Die Samstage','Am Fenster und daneben','Samstags, zehn nach elf, Linie 3: ich am Fenster, Lana daneben. „Halt dich fest, Mali.“ An der Endstation wartete Großmutter mit zwei Taschen.');
n('f5_tuer','f5','Die Samstage','Die Tür im siebten Stock','Jeden Samstag um zehn nach elf hat Lana bei uns geklopft, zweimal kurz, einmal lang. Mama hat ihr die Tür aufgemacht. Sie kennt das Klopfen noch.',{p:'p:jasna'});
n('f5_schuld','f5','Mama','Mamas Satz','Malas Nachhall an Mama, beim Totenmahl: „Wenn ich ihn mitgenommen hätte, wäre sie nicht losgefahren.“ Mama glaubt, sie ist schuld. An Lana.',{p:'p:mala'});
n('f5_bild','f5','Mama','Gesichter in den Fenstern','Lanas Zeichnung von 1990, die Ana mitgebracht hat: eine Straßenbahn, in jedem Fenster ein Gesicht. Nada: „So hat sie gezeichnet. Immer Gesichter in den Fenstern.“',{p:'p:nada'});
n('f5_stigla','f5','Mama','„Stigla si.“','Nadas Küche, Samstag, zehn nach elf: Mala hat in meinem Atem ihre Straßenbahn auf die Balkontür gezeichnet, ich die Räder. Nada hat sich umgedreht und es gesehen. „Stigla si.“ Du bist angekommen.',{p:'p:nada'});
n('f5_rad','f5','Der Atem','Mit Rädern','Auf der beschlagenen Scheibe in Ružas Küche: eine Straßenbahn mit einer Drei. Ich habe sie gemalt. Mit Rädern.');
n('a5_atem','f5','Der Atem','In meinem Atem','In meinem Atem kann sie zeichnen, auf einer kalten Scheibe. Nur in meinem: auf dem Spiegel nicht, bei Mia nicht. Die Linie hält ein paar Sekunden. Buchstaben schreibt sie nicht. „Buchstaben sind eine Nachricht.“',{p:'p:mala'});
// ---------------------------------------------------------------- Schlüsse (Notizen, die erst durch Verbinden entstehen)
n('s5_beide','s5','Zusammen','Damit man sie findet','Beide haben ihren Namen geschrieben, damit man sie findet. Zlata „Mala“, weil Lana es selbst gesagt hat. Nada „Lana Delić“, siebzehn Januare lang. Jede einen anderen.');
n('s5_teile','s5','Zusammen','Zwei Hälften','Das Brett hat den Tod: den Fünfzehnten und den Namen, den sie am Ende selbst gesagt hat. Nadas Tafel braucht nur den Namen, mit dem sie gerufen wurde, und die Geburt. Oben das Messing, unten das Holz.');
n('b5_wer','b5','Die Hand','Wer mich festhielt','Der vorn die Hand gehoben hat, ist nach hinten gelaufen und hat mich festgehalten. Danach hat er meine Kanister gefüllt. Hamdija.');
n('f5_wem','f5','Die Dose','Nicht Nada','Nada war nie samstags dabei. Die Fahrscheine gehören nicht zu Nada. Sie gehören zu den Samstagen.');
n('f5_jasna','f5','Mama','Für Mama','Die Fahrscheine sind für Mama. Sie kann nicht in den neunten Stock hinauf. Mit Lanas Fahrscheinen kann sie Nada holen, wie Lana mich jeden Samstag geholt hat. Zwei Plätze: am Fenster und daneben.');
M.defineNotes(N);
M.NOTE_GROUPS.j5=['Aus München','Vratnik','Haus 7'];
M.NOTE_GROUPS.s5=['Die Tafel','Das Brett','Nadas Briefe','Zusammen'];
M.NOTE_GROUPS.b5=['Die Hand','Der Hahn','Hamdija','Die Liste'];
M.NOTE_GROUPS.f5=['Die Dose','Die Samstage','Mama','Der Atem'];
function by(id,list){ var x=M.NOTES[id]; x.doneBy=(x.doneBy||[]).concat(list); }
function done(id,fn){ M.NOTES[id].doneIf=fn; }
function after(fl){ return function(G){ return !!G.flags[fl]; }; }
by('s5_nh_brett',['s5_beide']); by('s5_nh_mappe',['s5_beide']); by('s5_beide',['s5_teile']); by('b5_hand',['b5_wer']); by('b5_tag',['b5_wer']); by('f5_dose',['f5_wem']); by('f5_eursamstag',['f5_wem']); by('f5_wem',['f5_jasna']); by('j5_treppe',['f5_jasna']);
done('j5_wo',after('k5.e.water')); done('s5_tafel',after('k5.s.mounted')); done('s5_frist',after('k5.s.mounted')); done('s5_brett',after('k5.s.mounted')); done('s5_mappe',after('k5.s.mounted'));
done('b5_hamdija',after('k5.b.gone')); done('b5_kasten',after('k5.b.gone')); done('b5_drei',after('k5.b.gone')); done('b5_liste',after('k5.b.gone')); done('b5_reihe',function(G){ return has(G,'b5_hamdija'); });
done('j5_samstag',after('k5.sat.tickets')); done('k5_c_muenchen',after('k5.e.funeral')); done('k5_c_mala',after('k5.n2.done'));
// ---------------------------------------------------------------- Schlüsse
M.defineDeductions({
  's5_nh_brett+s5_nh_mappe':{to:'s5_beide',say:'„Damit man sie findet“, hat Zlata gesagt. „Damit man sie findet“, sagt Nada jeden Januar. Beide haben ihren Namen geschrieben, damit man sie findet. Jede einen anderen.'},
  's5_beide+s5_brett':{to:'s5_teile',say:'Das Brett hat den Tod: der Fünfzehnte, und der Name, den sie am Ende selbst gesagt hat. Nadas Tafel braucht nur, was nur Nada hat: den Namen, mit dem sie gerufen wurde, und die Geburt. Zwei Hälften.'},
  's5_beide+s5_tafel':{to:'s5_teile',say:'Nadas Tafel, der Text offen bis Freitag. Und beide wollten, dass man sie findet. Die Tafel braucht nur, was nur Nada hat: den Namen, mit dem sie gerufen wurde, und die Geburt. Den Tod und „Mala“ hat das Brett. Zwei Hälften.'},   // Analyse K5-B03 (P16)
  'b5_hand+b5_tag':{to:'b5_wer',say:'Der vorn die Hand gehoben hat, ist nach hinten gelaufen und hat mich festgehalten. Dann hat er meine Kanister gefüllt. Hamdija.'},
  'f5_dose+f5_eursamstag':{to:'f5_wem',say:'„Für Mama. Wer sonst?“ Aber Nada war nie samstags dabei. Die Fahrscheine gehören nicht zu Nada. Sie gehören zu den Samstagen.'},
  'f5_wem+j5_treppe':{to:'f5_jasna',say:'Wer war samstags dabei? Mali, Ruža. Und Mama, die die Tür aufgemacht hat. Mama, die nicht in den neunten Stock hinaufkann. Die Fahrscheine sind für sie: damit sie hinaufgeht und Nada holt, wie Lana jeden Samstag mich geholt hat. Zwei Plätze. Am Fenster und daneben.'}
});
var NEAR={
  's5_brett+s5_tafel':'Zwei Frauen, zwei Namen. Beide haben recht. Das hilft mir noch nicht. Warum hat jede ihren geschrieben?',
  's5_nh_brett+s5_brett':'Zlata wollte, dass man sie findet. Und Nada? Was sie wollte, steht in ihren Briefen. Die habe ich noch nicht gespürt.',
  's5_mappe+s5_brett':'Siebzehn Briefe mit „Lana“, ein Brett mit „Mala“. Das ist der Streit. Noch nicht die Lösung.',
  'f5_dose+j5_treppe':'Nada braucht keine Treppe. Sie wohnt oben. Erst muss ich wissen, wem die Dose nicht gehört.',
  'f5_plaetze+s5_mappe':'Nada hat Briefe geschrieben, keine Fahrscheine gekauft.',
  'f5_dose+f5_tuer':'Mama hat ihr die Tür aufgemacht. Und die Dose? Erst muss ich wissen, ob sie überhaupt Nada gehört.',
  // Analyse K5-B01: richtige Ideen zu „Wem gehören die Fahrscheine?“ anerkennen und auf das fehlende Stück zeigen
  'f5_wem+f5_tuer':'Mama. Sie hat jeden Samstag aufgemacht. Aber wozu dann Fahrscheine? Was hat sie an der Treppe gesagt?',
  'f5_wem+k5_c_muenchen':'„Ich setze mich ans Fenster.“ Zwei Plätze, am Fenster und daneben. Für wen ist der zweite? Und warum fährt sie nicht?',
  'f5_wem+f5_plaetze':'Lana hat mich jeden Samstag geholt. Wer holt heute wen? Und wer kann wohin nicht?',
  'f5_wem+j5_nichtdrei':'„Nicht die Drei. Noch nicht.“ Mama weicht aus. Der Drei – und wem noch?',
  'f5_wem+j5_samstag':'Samstag um elf sperrt Šehić den siebten Stock auf. Mama wird dort sein. Und dann? Was hat sie an der Treppe gesagt?',
  'f5_eursamstag+j5_treppe':'„Euer Samstag“ und eine Treppe, die Mama nicht hinaufkommt. Fast. Mala sagt aber noch: für Nada.',
  'b5_hand+b5_reihe':'Ein Mann, der Kanister ordnet. Und eine Hand auf meinen Augen. Vielleicht derselbe. Das weiß nur der Tag selbst. Mala soll ihn spüren.',
  'b5_hamdija+b5_drei':'Drei ohne Namen. Und ein Mann, der an einem Kasten wacht. Was ist im Kasten?'
};
Object.keys(NEAR).forEach(function(k){ var t=NEAR[k]; if (!M.DEDUCE[k] && !M.DEDUCE[k.split('+').reverse().join('+')]) M.DEDUCE[k]=function(A){ M.sfx&&M.sfx('nope'); return {ok:false,t:t}; }; });
// nach Schlüssen: Reaktionen (laufen nach dem Schließen des Notizbuchs, 96_k5_story.js)
var od0=M.onDeduce;
M.onDeduce=function(to,G){ if (M.chapterOf(G)!==5){ if (od0) return od0(to,G); return; } if (M.k5Queue) M.k5Queue('ded:'+to); };
// ---------------------------------------------------------------- Antworten bei falschen Verbindungen
// Analyse Muster 7 (P09): Absagen bleiben neutral. Sie behaupten keine Richtung (‚hat nichts mit Mala zu tun‘, ‚nicht vermischen‘, ‚Wunschdenken‘),
// weil sie sonst gerade die richtige Idee abweisen; Beinahe-Treffer bekommen eigene Sätze.
var POOL={
  same:['Zwei Dinge, die nebeneinander liegen. Mehr sagen sie mir nicht.','Ich drehe es hin und her. Es greift nicht.','So komme ich nicht weiter. Noch nicht.'],
  cross:['Das bringt mich hier nicht weiter.','Noch nicht. Etwas fehlt dazwischen.'],
  again:['Das habe ich schon versucht.','Noch einmal dasselbe. Es wird nicht richtiger.']
};
var nc0=M.noCombo;
M.noCombo=function(a,b,G){ if (M.chapterOf(G)!==5) return nc0?nc0(a,b,G):'Das hängt nicht zusammen.';
  var A=M.NOTES[a]||{}, B=M.NOTES[b]||{}, key='nc.'+[a,b].sort().join('+'); G.cyc=G.cyc||{};
  if (G.flags[key]){ var k0=G.cyc.nc5A=(G.cyc.nc5A||0)+1; return POOL.again[k0%POOL.again.length]; } G.flags[key]=true;
  var pool=(A.c===B.c)?POOL.same:POOL.cross, k=G.cyc['nc5_'+pool.length]=(G.cyc['nc5_'+pool.length]||0)+1;
  return pool[k%pool.length]; };
})(M);
