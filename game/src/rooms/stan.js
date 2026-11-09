/* ===== rooms/stan.js — Nadas Wohnung im neunten Stock: Lanas verschlossenes Zimmer, die Postkarte aus Split, „Bring sie mir nach Hause“ ===== */
(function(M){
'use strict';
var P=M.P;
function fin(G){ return G.phase==='k2_fin'; } function epi(G){ return G.phase==='k2_epi'; }
// Analyse K2-B01: Vor dem Epilog nimmt Nada die Nachricht nicht an (sonst ging sie samt Kapitelende verloren).
async function nadaNotYet(A,N){ await N.say('Nicht jetzt, Mali. Ich kann heute kein Papier mehr lesen.'); await A.wait(500); await N.say('Bring es mir, wenn du weißt, wo sie ist.'); }
// Ältere Spielstände: Nada hat die Nachricht schon, Marko hat sie nie gelesen. Sie gibt sie zurück, der Epilog bei ihr kommt später noch einmal.
function rcmStuck(A){ return fin(A.G) && !A.has('rcm') && !A.hasNote('f2_rcm') && A.flag('k2.epi.nada'); }
async function rcmBack(A,N){ await A.m('Die Nachricht vom Roten Kreuz … ich habe sie Ihnen gegeben, ohne sie selbst zu lesen.'); await A.wait(500); await N.say('Dann lies sie. Hier.');
  A.give('rcm'); A.sfx('paper'); A.setFlag('k2.epi.nada',false); await A.wait(400); await M.k2ReadRCM(A); A.save(); }
async function talkNada(A){ var N=A.npc('nada');
  if (epi(A.G)) return nadaEpi(A,N);
  await A.menuLoop(function(){ return [
    {t:'Die Nachricht vom Roten Kreuz …',if:rcmStuck(A),go:function(A){ return rcmBack(A,N); }},
    {t:'Ich bin Marko. Vom siebten Stock.',once:'nd0',go:async function(A){ await N.say('Ich weiß, wer du bist. Ich habe dich an den Ohren erkannt, nicht am Foto. Du hattest schon damals Ohren wie ein Pokal.'); await A.wait(700); await N.say('Mali.'); }},
    {t:'Darf ich Lanas Zimmer sehen?',if:!A.S.lanaOpen,go:function(A){ return openRoom(A,N); }},
    {t:'Was ist mit Lana geschehen?',if:A.S.lanaOpen&&!A.hasNote('f2_missing'),go:async function(A){ await N.say('Sie ist im November dreiundneunzig mit einem Bus aus der Stadt. Esad hat ihr den Platz besorgt. Sie hat geweint, weil du nicht da warst.');
        await N.say('Im Januar kam eine Karte aus Split. Dann nichts mehr.'); await A.wait(900); await N.say('Sie ist nie angekommen. Für das Rote Kreuz ist sie vermisst. Seit siebzehn Jahren schreibe ich jeden Januar einen Brief an den Suchdienst. Sie schreiben zurück: Wir suchen noch.'); A.note('f2_missing'); }},
    {t:'Wo ist Ihr Mann?',once:'naS1',go:async function(A){ await N.say('Esad ist zweitausendfünf gestorben. Er hat gesagt: Die Kleine kommt, wenn sie fertig ist. Sie war nie pünktlich.'); }},
    {t:'Haben Sie nie das Zimmer aufgemacht?',once:'naS2',if:A.S.lanaOpen,go:async function(A){ await N.say('Wozu? Damit es nach mir riecht statt nach ihr?'); await A.wait(700); await N.say('Jeden Tag stehe ich vor der Tür. Jeden Tag gehe ich wieder in die Küche.'); }},
    A.askOpt({ f2_memory:async function(A){ await N.say('Du erinnerst dich.'); await A.wait(800); await N.say('Ich dachte, du hast sie vergessen. Du hast nie geschrieben. Keiner von euch hat je geschrieben.'); await A.m('Ich habe sie vergessen. Und jetzt nicht mehr.'); },
      f2_postcard:'„Ich hole Mali.“ Ich habe nie verstanden, was sie damit meinte. Du warst doch in Vratnik. Was gab es da zu holen?', m2_lana:'Lana Delić. Geboren am dritten März sechsundsiebzig. Sie hat geschrien wie eine Sirene, ganze Nächte. Esad hat gesagt, das wird eine Sängerin. Es wurde eine Malerin.',
      // Analyse K2-B12 (P24): Ruža ist auf dem Foto, hinter den Kindern die Drei (12_k2_items.js, 13_k2_notes.js f2_photo, Kapitel 4)
      f2_photo:'Mala i Mali. Ruža mit euch zwei, an der Haltestelle der Drei. Hinten hat sie es selbst beschriftet. Lana hat es überall herumgezeigt. Dann war es weg.', f2_missing:'Vermisst. Das Wort sagen sie beim Roten Kreuz. Ich sage: Sie kommt nicht heim.',
      f2_rcm:'Eine Nachricht vom Roten Kreuz? An dich? Und Ruža hat …', f2_cameback:'Sie ist losgefahren, um dich zu holen. Natürlich. Natürlich ist sie das.' },'Ich weiß nichts. Ich weiß seit siebzehn Jahren nichts.'),
    ...M.k2Extra('nada',A,N),
    {t:'Danke, Frau Delić.',bye:true,go:async function(A){ await N.say('Nada. Du hast früher Teta Nada gesagt.'); }}
  ]; }); }
async function openRoom(A,N){ await N.say('…'); await A.wait(1200); await N.say('Siebzehn Jahre habe ich die Tür nicht aufgemacht.'); await A.wait(900); await N.anim('sit'); await N.say('Den Schlüssel trage ich um den Hals. Wie ein Kreuz. Ich glaube nicht an Kreuze.');
  await A.wait(700); A.sfx('lock'); A.set('lanaOpen',true); A.setFlag('k2.f2.lanaOpen'); A.rebuild(); A.note('f2_room'); await A.narrate('Sie schließt auf. Sie geht nicht hinein. Sie bleibt in der Tür stehen und macht Platz.'); await N.say('Geh du. Ich kann nicht.'); A.save(); }
async function nadaEpi(A,N){ if (A.flag('k2.epi.nada')) return N.say(A.cycle('ndE',['Geh. Bevor ich dich festhalte.','Bring sie mir nach Hause, Mali.']));
  if (!A.has('rcm')){ await N.say('Du bist früh. Es schneit.'); return; }
  await A.m('Teta Nada. Das hier hat Lana mir geschrieben, im Dezember dreiundneunzig. Großmutter hat es versteckt. Ich habe es gestern gefunden.'); await A.animM('give'); A.take('rcm'); await A.wait(800);
  await N.say('…'); await A.narrate('Sie liest. Sie liest es zweimal, wie Großmutter. Dann setzt sie sich, ganz langsam.'); await N.say('„Wenn du nicht kommst, komme ich dich holen.“'); await A.wait(1200); await N.say('Das ist sie. Das ist genau sie.');
  await A.wait(900); await A.m('Ich finde heraus, wo sie geblieben ist. Ich fahre heute nach Mostar.'); await A.wait(1000); await N.say('Warum Mostar?'); var c=await A.choose([{t:'Weil sie von einer Brücke erzählt hat, die nicht mehr da war.',id:'bridge'},{t:'Ich weiß es nicht. Ich spüre es.',id:'feel'},{t:'Weil der Lastwagen über Mostar gefahren ist.',id:'truck'}],{title:'Nada'}); A.G.flags['k2.epi.whyMostar']=c;
  if (c==='bridge'){ await N.say('Die Brücke.'); await A.wait(800); await N.say('Im November dreiundneunzig ist die Alte Brücke gefallen. Das weiß jeder. Das weiß jedes Kind.'); }
  else if (c==='feel'){ await N.say('Spüren.'); await A.wait(700); await N.say('Esad hat immer gespürt, wo sie ist. Er hat gesagt: im Westen. Immer im Westen.'); }
  else { await N.say('Ein Lastwagen. Über Mostar.'); await A.wait(700); await N.say('Im Januar vierundneunzig. Durch die Front. Mein Gott, Kind.'); }
  await A.wait(900); await N.say('Mali.'); await A.wait(600); await N.say('Bring sie mir nach Hause.'); await A.m('Ja.'); A.setFlag('k2.epi.nada'); A.save();
  if (A.G.malaOn){ await A.wait(900); await A.g('Mama.'); await A.wait(800); await A.narrate('Nada sieht auf, zum Fenster, wo niemand steht. Sie sagt nichts. Sie zieht den Morgenmantel enger, als wäre es kalt geworden. Oder warm.'); } }
// ---------------------------------------------------------------- Lanas Zimmer
async function postcard(A){ await A.doc({style:'postcard',title:'Pozdrav iz Splita',lines:['Mama,','','mir geht es gut. Das Meer ist grau,','die Leute sind nett, das Hotel ist kalt.','Ich warte jeden Abend auf der Treppe.','Er kommt nicht.','','Ich komme nach Hause. Ich hole Mali.','','Lana · Split, 6.1.1994']});
  if (!A.hasNote('f2_postcard')){ A.note('f2_postcard'); await A.wait(800); await A.m('„Ich komme nach Hause. Ich hole Mali.“'); await A.wait(700); await A.m('Sechster Januar vierundneunzig. Sie war auf dem Weg. Zu mir.'); } }
var HS=[
 {id:'door',name:'Wohnungstür',exit:{to:'haustor'},look:'Die Wohnungstür, mit drei Riegeln und einer Kette.'},
 {id:'nada',npc:'nada',name:'Nada',hgt:36,vis:function(S,G){ return fin(G)||epi(G); },talk:talkNada,
   look:'Nada Delić. Grau, schmal, müde, die Hände verschränkt, als würde sie sie festhalten. Lanas Augen, nur älter.',
   give:{ photo_full:async function(A){ var N=A.npc('nada'); await N.say('Das Foto. Dragica hat es gemacht. Lana hat es im November zerrissen. Ich habe ihr gesagt, sie ist verrückt.'); await N.say('Sie hat gesagt: Damit wir uns wiederfinden.'); }, rcm:function(A){ return epi(A.G)?nadaEpi(A,A.npc('nada')):nadaNotYet(A,A.npc('nada')); },
     drawing:'Nada: „Ihre Straßenbahn. Nein … deine. Mit den schiefen Rädern.“', sweater:'Nada: „Ruža hat ihn gestrickt. Lana hat gesagt, du siehst darin aus wie eine Zuckerstange.“' },
   g:{look:'Mama.',listen:async function(A){ await A.g('Sie redet nicht. Sie denkt meinen Namen. Ganz laut.'); }}},
 {id:'table',name:'Tisch',look:'Ein Küchentisch mit Wachstuch, Kirschmuster. Zwei Stühle. Auf dem einen sitzt Nada, auf dem anderen niemand, seit Jahren.',g:{look:'Mein Stuhl. Er wackelt immer noch.'}},
 {id:'kitchen',name:'Küche',look:'Eine schmale Küchenzeile, ein Gasherd, eine Džezva, ein Teller mit einem halben Apfel. Alles sehr sauber.',g:{look:'Sie hat die Džezva nicht ausgetauscht. Die mit der Delle.'}},
 {id:'radiator',name:'Heizkörper',look:'Ein Heizkörper, auf dem Socken trocknen. Die Fernwärme geht, die meiste Zeit.',g:{look:'Im Winter dreiundneunzig haben wir uns um den Ofen gedrängt. Den gab es nicht hier. Den gab es unten.'}},
 {id:'tv',name:'Fernseher',look:'Ein Fernseher mit Spitzendeckchen darauf. Er läuft ohne Ton: eine Kochsendung.',g:{look:'Sie lässt ihn laufen, damit sich jemand bewegt.'}},
 {id:'sideboard',name:'Anrichte',look:'Eine Anrichte mit Gläsern und gerahmten Fotos: eine Hochzeit, ein Mann mit Schnurrbart, ein Mädchen mit Zopf.',g:{look:'Lauter Leute, die nicht mehr hier sind.'}},
 {id:'photo',name:'Foto',look:'Ein Mädchen mit Zopf, etwa fünfzehn, lachend, mit Farbe an den Fingern. Mala. Lana.',use:'Ich lasse es stehen.',
   g:{look:async function(A){ await A.g('Das bin ich.'); await A.wait(700); await A.g('Ich habe gelacht. Ich wusste nicht, dass ich so lachen konnte.'); }}},
 {id:'calendar',name:'Kalender',look:'Ein Kalender von 2011. Kein Termin. Nur am 6. Januar ein Kreis.',g:{look:'Der sechste Januar. Da habe ich die Karte geschrieben.'}},
 {id:'balcony',name:'Balkontür',look:'Die Balkontür, mit Klebeband an einer Ecke. Draußen Blumenkästen mit vertrockneten Geranien.',open:'Kalte Luft. Unten der Hof, ganz klein.',g:{look:'Von hier habe ich auf deine Loggia hinuntergesehen. Zwei Stockwerke tiefer.'}},
 {id:'view',name:'Ausblick',look:function(A){ return A.m(epi(A.G)?'Schnee auf den Hochhäusern, auf dem Hof, auf dem Tal. Alles ist weiß und still und neu.':'Der Blick über die Hochhäuser und das Tal. Ganz hinten die Altstadt und die Hügel. Zwei Stockwerke tiefer, schräg: unsere Loggia.'); },
   g:{look:'Da unten. Deine Loggia. Du hast immer gewinkt, mit einem Kochlöffel.'}},
 {id:'lana_door',name:'Lanas Tür',look:function(A){ return A.m(A.S.lanaOpen?'Die Tür zu Lanas Zimmer steht offen. Dahinter Staub und Licht.':'Eine geschlossene Tür mit einem Schlüsselloch. Ein Aufkleber: ein Regenbogen, halb abgekratzt.'); },
   open:async function(A){ if (A.S.lanaOpen) return A.m('Sie ist offen.'); if (fin(A.G)) return openRoom(A,A.npc('nada')); return A.m('Abgeschlossen.'); },
   g:{look:'Meine Tür. Ich gehe hindurch. Ich muss nicht fragen.'}},
 {id:'lana_bed',name:'Bett',look:'Ein schmales Bett mit einer Tagesdecke, auf der ein Teddy liegt, dem ein Auge fehlt.',g:{look:'Ich habe ihn Medo genannt. Wie alle.',sense:async function(A){ await A.g('Ich liege hier und höre die Granaten zählen. Eins, zwei. Ich zähle mit. Ich habe keine Angst. Ich habe Angst.'); }}},
 {id:'lana_desk',name:'Schreibtisch',look:'Ein Schreibtisch mit Stiften in einer Blechdose, ein Zeichenblock, ein angefangenes Bild: eine Straßenbahn auf einer Brücke.',
   g:{look:'Mein Block. Mein Bild. Ich habe es nicht fertig gemacht.',sense:async function(A){ A.setFlag('k2.f2.echoRoom'); A.rebuild(); await A.memory({title:'Nachhall – Lanas Zimmer',tint:'ghost',draw:M.mem&&M.mem.k2_lanaroom,lines:['Ein Mädchen mit siebzehn am Schreibtisch. Draußen ist es dunkel und laut.','Sie zeichnet eine Straßenbahn auf einer Brücke. Über ihr ein Schild: „PRVA TROJKA POSLIJE RATA“.','Ihre Mutter ruft aus der Küche. Sie antwortet nicht. Sie zeichnet die Räder, und diesmal sind sie gerade.','„Mama“, sagt sie leise. „Ich gehe morgen.“']});
       await A.wait(500); await A.g('Mama.'); await A.wait(700); await A.narrate('In der Küche dreht Nada sich um, zur offenen Tür. Sie sieht nichts. Sie sieht lange nichts.'); }}},
 {id:'drawings_l',name:'Zeichnungen',look:'Zeichnungen an der Wand: Straßenbahnen, Gesichter, ein Hund, die Brücke von Mostar, und ein Junge mit Ohren wie ein Pokal.',
   g:{look:'Das bist du. Mit zwölf. Ich habe deine Ohren übertrieben. Nicht sehr.'}},
 {id:'posters',name:'Poster',look:'Ein Konzertplakat von 1991, „Plavi Tramvaj“, und ein Filmplakat: „Obala“, ein Gesicht vor dem Abendmeer. Beide mit Reißzwecken, beide verblasst.',g:{look:'Ich war bei dem Konzert. Mit Freundinnen. Ich habe mitgesungen und nie wieder so laut.'}},
 {id:'wardrobe_l',name:'Schrank',look:'Ein Kleiderschrank, halb offen. Pullover, ein Kleid, Turnschuhe. Ein leerer Bügel, auf dem früher eine Jeansjacke hing.',g:{look:'Die Jacke habe ich an. Seit siebzehn Jahren.'}},
 {id:'lana_window',name:'Fenster',look:'Lanas Fenster. Man sieht die Haltestelle und die Stelle, an der der Kiosk stand.',g:{look:'Von hier habe ich gesehen, ob die Drei kommt. Und ob du kommst.'}},
 {id:'postcard',name:'Postkarte',look:'Eine Postkarte an der Wand, mit einer Reißzwecke: Palmen, Meer, ein Hafen. „Pozdrav iz Splita.“',read:function(A){ return postcard(A); },take:function(A){ return postcard(A); },
   g:{look:'Die Karte. Ich habe sie im Hotel geschrieben, auf der Treppe. Ich habe gelogen. Das Meer war nicht grau. Es war schön, und ich konnte es nicht ertragen.'}}
];
M.room('stan',{ name:'Nadas Wohnung', scape:'k2_stan', music:function(G){ return G.flags['k2.f2.lanaOpen']?'k2_sjecanje':'k2_mala'; },
  state:function(G){ return {lanaOpen:false}; },
  actors:function(S,G){ var L=[]; if (G.flags['k2.f2.lanaOpen']) S.lanaOpen=true; if (fin(G)||epi(G)){ var n=M.apos('stan','nada',[180,120,'R']); L.push({id:'nada',ch:'nada',x:n[0],y:n[1],f:n[2]||'R',name:'Nada',idle:'sit',speechY:38}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ if (fin(A.G) && A.first('k2snF')){ await A.narrate('Die Tür geht auf. Nada Delić steht da, das Foto in der Hand. Sie sieht es an. Sie sieht mich an.'); await A.npc('nada').say('Mali.'); await A.wait(900); await A.npc('nada').say('Komm herein. Zieh die Schuhe aus. Wie früher.'); }
    if (epi(A.G) && A.first('k2snE')){ await A.m('Neunter Stock, im Schnee. Nada hat die Tür schon offen, bevor ich klopfe. Der Kaffee ist fertig.'); } }
});
})(M);
