/* ===== rooms/kazandziluk.js — die Kupferschmiede: Nedžad, eine deutsche Gravur, das Auftragsbuch von 1972, das Stemmeisen ===== */
(function(M){
'use strict';
var P=M.P;
function here(G){ return G.phase==='k2_s1'||G.phase==='k2_s2'||G.phase==='k2_fin'; }
async function talkNedzad(A){ var N=A.npc('nedzad'), p=A.G.phase;
  if (p==='k2_fin'){ if (A.has('chisel') && A.flag('k2.f2.rcmRead')){ return returnChisel(A,N); } return N.say(A.cycle('ndF',['Das Stemmeisen? Behalten Sie es, solange Sie es brauchen.','Kupfer vergisst nichts. Jeder Schlag bleibt drin.'])); }
  if (p==='k2_s2') return N.say(A.cycle('ndS2',['Der Wiener hat sich gefreut. Mit ß! Er hat gesagt, sonst schreiben alle „ss“.','Mein Großvater wäre stolz gewesen. Auf Sie, nicht auf mich.','Regen ist gut für Kupfer. Es wird dunkler. Ehrlicher.']));
  await A.menuLoop(function(){ return [
    {t:'Haben Sie dieses Armband gemacht?',if:A.hasNote('s1_bracelet')&&!A.hasNote('s1_date'),go:async function(A){ await N.anim('hammer'); await N.say('Ich? Ich mache keine Armbänder. Mein Großvater hat Armbänder gemacht. Für Verliebte und für Soldaten, die verliebt waren.');
        await N.say('Wenn es von uns ist, steht es im Auftragsbuch. Die Bücher sind oben, auf dem Dachboden. Achtzig Jahre Bücher.'); await A.m('Siebziger Jahre. Eine Gravur mit E.'); await N.say('Siebziger. Zehn Bücher, Staub, Mäuse.');
        await N.say('Ich habe keine Zeit. Ein Kunde aus Wien will bis heute Abend eine Džezva mit deutscher Gravur. Ich kann die Buchstaben nicht. Wenn ich die verhaue, ist das Kupfer hin.'); A.setFlag('k2.s1.nedzadBusy'); }},
    {t:'Ich helfe Ihnen mit der deutschen Gravur.',if:A.flag('k2.s1.nedzadBusy')&&!A.flag('k2.s1.engraved'),go:function(A){ return engraving(A,N); }},
    {t:'Holen Sie das Buch von 1972?',if:A.flag('k2.s1.engraved')&&!A.hasNote('s1_date'),go:function(A){ return orderBook(A,N); }},
    {t:'Können Sie mir etwas Schmales, Festes leihen?',if:(A.flag('k2.s1.needChisel')||A.hasNote('s1_hidden'))&&!A.has('chisel')&&!A.flag('k2.s1.tin'),go:async function(A){ if (!A.flag('k2.s1.engraved')){ await N.say('Nach der Gravur. Erst die Arbeit, dann die Freundschaft.'); return; }
        await N.say('Schmal und fest?'); await N.anim('engrave'); await N.say('Hier. Das Stemmeisen von meinem Großvater. Damit hat er Fugen aufgemacht, die keiner aufmachen sollte.'); A.give('chisel'); await N.say('Bringen Sie es mir zurück. Es ist das Einzige, was ich von ihm habe, außer den Büchern.'); }},
    {t:'Wie lange arbeiten Sie schon hier?',once:'nd1',go:async function(A){ await N.say('Seit ich einen Hammer halten kann. Mein Urgroßvater hat die Werkstatt 1912 aufgemacht. Wir haben zwei Kriege überlebt und den dritten auch.'); await N.say('Im dritten haben wir Granathülsen graviert. Für Journalisten. Davon haben wir gegessen.'); }},
    {t:'Was graviert man auf eine Džezva?',once:'nd2',go:async function(A){ await N.say('Namen. Daten. Eine Rose. Eine Brücke. Manchmal einen Satz.'); await N.say('Die Leute wollen, dass etwas bleibt. Kupfer bleibt.'); if (A.has('dzezva')){ await A.m('Auf meiner ist eine Rose und ein R.'); await N.say('Zeigen Sie mal.'); await A.wait(700); await N.say('Das ist von uns. Die Rose ist von meinem Großvater. Er hat sie immer mit sieben Blättern gemacht. Für Glück.'); } }},
    A.askOpt({ s1_name:'Zupan? Ein Slowene. Wir hatten viele Soldaten als Kunden. Die haben für Mädchen gekauft, die sie nie wiedergesehen haben.', s1_date:'Der vierzehnte November zweiundsiebzig. Großvater hat an dem Tag elf Aufträge eingetragen. Er war fleißig, wenn er verliebt war. In die Arbeit.',
      s1_father:'Halid Kadić von der Kula? Großvater hat ihm einmal einen Kupferkessel gemacht. Halid hat nie bezahlt. Großvater hat ihn trotzdem gegrüßt.', s1_bracelet:'Ein Armband mit Gravur? Dann steht es im Buch.' },'Fragen Sie mich nach Kupfer.'),
    ...M.k2Extra('nedzad',A,N),
    {t:'Danke, Nedžad.',bye:true,go:async function(A){ await N.say('Hvala Vama.'); }}
  ]; }); }
async function engraving(A,N){ await N.say('Der Kunde hat es am Telefon diktiert. Ich habe es aufgeschrieben, wie ich es gehört habe.'); await A.doc({style:'letter',title:'Nedžads Zettel',lines:['„Fur imer – E.“','„Zum 40. Hochzeitstag, Gruse aus Wien“']});
  await A.m('Das wird so nicht gehen.');
  var res=await A.puzzle({title:'Die Gravur',hint:'Nedžad graviert genau, was ich ihm vorgebe. Tippe auf eine Zeile, um eine andere Schreibung zu wählen.',button:'So gravieren',
    slots:[['Fur imer – E.','Für immer – E.','Füher immer – E.'],['Zum 40. Hochzeitstag,','Zum 40. Hochzeitstag','Zum 40. Hochzeitsstag,'],['Gruse aus Wien','Grüße aus Wien','Grüsse aus Wienn']],
    init:[0,1,0],
    check:function(sel){ var ok=[1,0,1], msg=['Nedžad: „Für? Mit zwei Punkten? Zeigen Sie mir, wo.“ (Es fehlt ein Umlaut, und „immer“ hat zwei m.)','Nedžad: „Komma oder kein Komma? Der Wiener hat ein Komma gesagt. Glaube ich.“','Nedžad: „Grüße mit ß? So ein Buchstabe! Wie ein B, das schwanger ist.“'];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i]}; return {ok:true}; }});
  if (!res){ await N.say('Überlegen Sie. Kupfer verzeiht nicht.'); return; }
  A.setFlag('k2.s1.engraved'); await N.anim('engrave'); A.sfx('engrave'); await A.wait(800); await N.say('„Für immer – E. Zum 40. Hochzeitstag, Grüße aus Wien.“'); await N.say('Mit ß. Das ist der schönste Buchstabe, den ich je graviert habe.');
  await A.wait(400); await N.say('Gut. Sie haben mir einen Tag gerettet. Ich hole Ihnen das Buch.'); return orderBook(A,N); }
async function orderBook(A,N){ if (!A.S.ladderUp){ A.set('ladderUp',true); A.sfx('creak'); await A.narrate('Nedžad stellt die Leiste an die Luke und verschwindet im Dachboden. Staub rieselt. Ein Fluch, ein Niesen, noch ein Fluch.'); await A.wait(900); }
  A.set('bookOut',true); A.sfx('thud'); await N.say('Neunzehnhundertzweiundsiebzig. Großvaters Schrift. Suchen Sie selbst, ich muss den Wiener anrufen.'); A.rebuild(); }
async function readBook(A){ if (!A.S.bookOut) return A.m('Die Bücher sind oben auf dem Dachboden.');
  await A.doc({style:'log',title:'Narudžbe 1972 – Kazandžić',lines:['13.XI. Ibrik, gravura ruža – Begović','14.XI. Narukvica bakar, gravura „E. · 14. XI. 1972“','        – T. Zupan, vojnik, Ljubljana. Plaćeno: 3 mj. plata (!)','        – preuzeto 14.XI. u 18:40','14.XI. Tepsija, gravura most – Hadžiomerović','15.XI. Fildžani 6 kom. – Kadić, kafana Kula (neplaćeno)']});
  if (!A.hasNote('s1_date')){ A.note('s1_date'); A.note('s1_name'); await A.m('„Armband, Kupfer, Gravur: E. · 14. XI. 1972. T. Zupan, Soldat, Ljubljana. Bezahlt: drei Monatssolde. Abgeholt am 14. November um 18:40.“'); await A.m('Der vierzehnte November zweiundsiebzig. Und um 18:40 war er hier.'); }
  else await A.m('Der vierzehnte November. 18:40. Und am fünfzehnten hat Halid sechs Tassen bestellt und nicht bezahlt.'); }
async function returnChisel(A,N){ A.take('chisel'); await A.m('Ihr Stemmeisen. Es hat zwei Fugen aufgemacht, die keiner aufmachen sollte.'); await N.say('Zwei? Dann hat es sich gelohnt.'); await N.say('Großvater hätte gesagt: Werkzeug, das nichts aufmacht, ist nur Eisen.'); A.setFlag('k2.f2.chiselBack'); }
var HS=[
 {id:'exit',name:'Zur Baščaršija',exit:{to:'carsija'},look:'Die Gasse zurück zur Baščaršija.'},
 {id:'nedzad',npc:'nedzad',name:'Nedžad',hgt:36,vis:function(S,G){ return here(G); },talk:talkNedzad,
   look:'Ein breiter Mann mit kurzem Bart und Lederschürze, über ein Kupferteil gebeugt. Er hämmert, als würde er mit dem Metall reden und das Metall antworten.',
   give:{ chisel:function(A){ return returnChisel(A,A.npc('nedzad')); }, dzezva:async function(A){ var N=A.npc('nedzad'); await N.say('Die Rose mit sieben Blättern. Von uns. Von meinem Großvater, für eine Hochzeit in Vratnik.'); await A.m('Meine Großeltern.'); await N.say('Dann ist das ein Erbstück. Benutzen Sie sie. Erbstücke, die man nicht benutzt, werden traurig.'); },
     bracelet:'Nedžad: „Das ist Großvaters Arbeit. Seht ihr die Punkte am E? So hat er geschrieben. Wie eine Unterschrift.“' },
   g:{look:'Er hört nicht auf zu hämmern, wenn er redet. So redet er leichter.',listen:async function(A){ await A.g('Er zählt die Schläge. Sieben, acht, neun. Und er denkt an seinen Großvater.'); }}},
 {id:'shop',name:'Werkstatt',look:'Die offene Werkstatt: Kupfer überall, an Haken, in Kisten, auf dem Boden. Es riecht nach Metall und nach Feuer.',g:{look:'Hier ist ein Junge gewesen, der gelacht hat. 1972. Er hat auf etwas gewartet, das man ihm einpackt.'}},
 {id:'workbench',name:'Werkbank',look:function(A){ return A.m(A.S.bookOut?'Auf der Werkbank liegt ein dickes Auftragsbuch, aufgeschlagen bei November 1972.':'Die Werkbank, zerkratzt und schwarz von hundert Jahren Arbeit. Ein Schraubstock, Feilen, ein halbfertiges Tablett.'); },
   read:function(A){ return readBook(A); },use:function(A){ return readBook(A); },
   g:{look:'Hier hat einer gestanden und gewartet, dass man ihm etwas einpackt.',sense:async function(A){ if (A.flag('k2.s1.benchSensed')) return A.g('Er ist gegangen, mit dem Kästchen in der Jacke. Er hat gesungen.');
       A.setFlag('k2.s1.benchSensed'); await A.memory({title:'Nachhall – die Werkbank',tint:'ghost',draw:M.mem&&M.mem.k2_bench,lines:['November 1972, kurz vor sieben. Ein alter Meister poliert ein Kupferarmband.','Ein junger Soldat mit Koteletten zählt Geld auf die Bank, drei Monate Sold, Schein für Schein.','„Heute Abend sagt sie es ihrem Vater“, sagt er. „Heute sagt sie es ihm.“','Der Meister lacht und schenkt ihm das Kästchen dazu.']}); A.note('s1_father'); }}},
 {id:'anvil',name:'Amboss',look:'Ein eiserner Dorn in einem Holzklotz. Darauf wird das Kupfer in Form geschlagen. Er ist blank, wo der Hammer trifft.',use:'Ohne zu wissen, was ich tue, mache ich nur Lärm.',g:{look:'Jeder Schlag bleibt im Kupfer. Das ist schön und schrecklich.'}},
 {id:'tools',name:'Werkzeug',look:'Gravierstichel, Punzen, kleine Hämmer, Feilen, ordentlich an der Wand, jedes an seinem Nagel. Ein Nagel ist leer, wenn das Stemmeisen fehlt.',take:'Das ist Nedžads Werkzeug. Ich frage.',g:{look:'Die Werkzeuge erinnern sich an Hände. Dieselben Hände, drei Generationen.'}},
 {id:'copper',name:'Kupferwaren',look:'Kupferteller mit Gravuren: die Brücke von Mostar, die Sebilj, die Vijećnica, eine Rose. Das Licht wandert darüber, wenn man vorbeigeht.',
   g:{look:'Die Brücke. Ich kenne diese Brücke. Ich weiß nicht, woher.',sense:'Kalt und warm zugleich. Als hätte jemand an einem Fluss gestanden, der zu laut war.'}},
 {id:'dzezve',name:'Džezve',look:'Džezve in allen Größen, an Schnüren, wie Glocken ohne Klöppel.',take:'Ich habe eine. Die beste.',g:{look:'In jeder steckt ein Morgen. Ich habe das schon einmal gesagt. Ich sage es gern.'}},
 {id:'trays',name:'Tabletts',look:'Gravierte Tabletts im Nachbarfenster: „Sarajevo 1984“, Olympiaringe, ein kleiner Wolf. Die Touristen kaufen sie, weil sie sich erinnern wollen, woran auch immer.',g:{look:'Der kleine Wolf. Er war überall, als ich klein war. Auf Mützen, auf Bechern.'}},
 {id:'ladder',name:'Leiter',look:function(A){ return A.m(A.S.ladderUp?'Die Leiter lehnt an der Luke. Oben ist es staubig und dunkel.':'Eine Holzleiter, an die Wand gelehnt.'); },use:'Nedžads Dachboden ist Nedžads Dachboden. Ich frage, bevor ich hinaufsteige.',g:{look:'Oben liegen achtzig Jahre Bücher. Und eine Maus, die sie liest.'}},
 {id:'attic',name:'Dachboden',look:'Eine Luke über der Werkstatt. Oben die Auftragsbücher von vier Generationen.',open:'Ich steige nicht ungefragt in fremde Dachböden. Nicht mehr.',g:{look:'Papier, Papier, Papier. Und Staub, der einmal etwas war.'}},
 {id:'sign',name:'Schild',look:'„KAZANDŽIĆ · od 1912“. Darunter, kleiner: „Gravure po narudžbi“. Gravuren auf Bestellung.',g:{look:'Neunzehnhundertzwölf. Vor allem.'}},
 {id:'neighbor',name:'Nachbarladen',look:'Der Nachbarladen ist zu. Ein Zettel: „Na hadžiluku. Vraćam se u decembru.“ Auf Pilgerfahrt, zurück im Dezember.',g:{look:'Er kommt zurück. Er hat es aufgeschrieben.'}},
 {id:'lantern',name:'Laterne',look:'Eine Kupferlaterne mit ausgestanzten Sternen. Wenn sie brennt, liegt die Gasse voller kleiner Lichter.',g:{look:'Sterne aus Kupfer. Die hat mir jemand gezeigt. Er hat gesagt, die gehen nie aus.'}}
];
M.room('kazandziluk',{ name:'Kazandžiluk', scape:'k2_kazan', music:'k2_istraga',
  state:function(G){ return {ladderUp:false,bookOut:false}; },
  actors:function(S,G){ var L=[]; if (here(G)){ var n=M.apos('kazandziluk','nedzad',[150,122,'R']); L.push({id:'nedzad',ch:'nedzad',x:n[0],y:n[1],f:n[2]||'R',name:'Nedžad',idle:'hammer',talk:'sitTalk',speechY:38}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ if (A.first('k2kzF')){ await A.m('Kazandžiluk. Kupfer, so weit man sieht, und Hämmer, die sich gegenseitig antworten.'); } }
});
})(M);
