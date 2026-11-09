/* ===== rooms/k5_mitte.js — Kapitel 5: Baščaršija mit der Endstation der Drei (carsija5), Nedžads Werkstatt (kazandziluk5),
   die Straßenbahn (tramvaj5, nur die Fahrt am Samstag). Bilder aus Kapitel 2 über M.ART-Aliase. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function f(G,k){ return !!G.flags[k]; }
function ph(G){ return G.phase; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
['carsija','kazandziluk','tramvaj'].forEach(function(id){ if (M.ART[id] && !M.ART[id+'5']) M.ART[id+'5']=M.ART[id]; });

// ================================================================ Baščaršija, Endstation
function radeHere(G){ var p=ph(G); return p==='k5_d1'||p==='k5_d2'||(p==='k5_sat'&&f(G,'k5.sat.rode')); }
function damirHere(G){ return ph(G)==='k5_d1'; }
function satEnd(G){ return ph(G)==='k5_sat' && f(G,'k5.sat.rode') && !f(G,'k5.sat.gate'); }
var HS_CA=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},canExit:async function(A){ if (satEnd(A.G)){ await A.m('Nicht der Stadtplan. Heute gehen wir zu Fuß. Hinauf.'); return false; } return true; },
   look:'Die Straße am Fluss entlang.',g:{look:'Da geht es zur Stadt.'}},
 {id:'lane_kula',name:'Gasse nach Vratnik',look:function(A){ return A.m(satEnd(A.G)?'Die Gasse nach Vratnik hinauf. Treppen, dann die Biegung, dann die Mauer. Dann Ružas Tor.':'Eine Gasse, die nach Vratnik hinaufführt. Steil. Großmutter hat auf jeder Stufe „Polako“ gesagt.'); },
   use:function(A){ return M.k5WalkUp?M.k5WalkUp(A):A.m('Später.'); },
   g:{look:'Hinauf. Zu Großmutter. Da hat jeder Samstag aufgehört.'}},
 {id:'lane_kazan',name:'Kazandžiluk',exit:{to:'kazandziluk5'},canExit:async function(A){ if (satEnd(A.G)){ await A.m('Heute nicht. Nedžad hat seine Arbeit getan.'); return false; } return true; },
   look:'Die Gasse der Kupferschmiede. Es klopft und hämmert, als würde dort einer mit der Zeit streiten.',g:{look:'Da klopft es. Das hat mir immer gefallen.'}},
 {id:'malaBench',name:'Bank an der Haltestelle',look:'Die Bank an der Endstation. Hier hat Mala im Winter gesessen und ist nicht eingestiegen. Keine Drei war die richtige.',
   g:{look:'Hier habe ich gesessen. „Dann ist es die falsche Zeit.“ Heute ist es die richtige.'}},
 {id:'bench',name:'Bank',look:'Eine Bank. Ein Mann füttert Tauben mit dem Rest von seinem Simit und schimpft mit ihnen.',g:{look:'Er schimpft mit den Tauben, weil keiner sonst zuhört.'}},
 {id:'tram_stop',name:'Endstation',look:function(A){ return A.m(satEnd(A.G)?'Die Endstation. Die Drei steht da, mit offenen Türen. Mama und Nada steigen aus, langsam, wie aus einem Bus nach fünfzehn Stunden.':'Die Endstation der Drei. Eine Schleife, ein Häuschen, ein Fahrplan, den keiner liest, weil die Drei kommt, wann sie kommt.'); },
   use:function(A){ return M.k5CarsijaStop?M.k5CarsijaStop(A):A.m('Die Drei kommt, wann sie kommt.'); },
   g:{look:'Endstation. Hier ist die Drei immer umgekehrt. Ich bin hier immer ausgestiegen.'}},
 {id:'tracks',name:'Schleife',look:'Die Gleisschleife. Die Drei fährt im Kreis um ein Blumenbeet, in dem nichts blüht, und fährt zurück.',g:{look:'Im Kreis. Und zurück. Ich nicht mehr.'}},
 {id:'booth',name:'Häuschen',look:'Das Häuschen des Dispatchers. Darin Rade, mit seinem Heft und einer Thermoskanne.',g:{look:'Rade zählt. Er hat mich nie gezählt. Er hat mich gesehen. Glaube ich.'}},
 {id:'booth_window',name:'Fenster des Häuschens',look:'Durch das Fenster: ein Heft, eine Thermoskanne, ein Radio, das Fußball sagt.',g:{look:'Das Heft. Da stehen alle Samstage drin.'}},
 {id:'timetable',name:'Fahrplan',look:'Der Fahrplan der Drei. Samstags alle zwölf Minuten. 11:10 steht da nicht. Da steht 11:08 und 11:20.',read:'Samstag: 11:08, 11:20. Es war immer zehn nach. Lana hat gesagt, es ist zehn nach. Dann war es zehn nach.',
   g:{look:'Zehn nach elf. Das stand nie da. Es stimmte trotzdem.'}},
 {id:'wires',name:'Oberleitung',look:'Die Oberleitung, ein Netz über dem Platz. Wenn eine Bahn kommt, singen die Drähte.',g:{look:'Die Drähte singen. Ich habe immer gesagt, die singen für mich.'}},
 {id:'tram',name:'Straßenbahn',vis:function(S,G){ return !!S.tramIn; },look:'Die Drei, mit offenen Türen. Gelb und rot, mit Rost an den Kanten.',g:{look:'Die Drei.'}},
 {id:'sebilj',name:'Sebilj',look:'Der Sebilj, der hölzerne Brunnen. Wer daraus trinkt, kommt wieder, sagen die Leute. Ich habe als Kind getrunken.',
   use:'Ich trinke nicht. Ich bin ja schon wiedergekommen.',g:{look:'Er hat getrunken. Darum ist er wiedergekommen. Ich habe nicht getrunken. Ich war ja nie weg.'}},
 {id:'pigeons',name:'Tauben',look:'Tauben, viele. Sie gehören dem Platz, und der Platz gehört ihnen.',g:{look:'Die Tauben sehen mich. Sie fliegen nicht weg.'}},
 {id:'mosque',name:'Moschee',look:'Die Moschee mit dem Brunnen im Hof. Ein Junge wäscht sich die Füße, als hätte er alle Zeit der Welt.',g:{look:'Hier waren wir nie. Großmutter sagte, Gott hört dich überall. Auch in der Drei.'}},
 {id:'shops',name:'Läden',look:'Läden: Teppiche, Kupfer, Postkarten, Kaffeemühlen, die keiner mehr dreht.',g:{look:'Wie früher. Nur mit Kartenleser.'}},
 {id:'cevabdzinica',name:'Ćevabdžinica',look:'Eine Ćevabdžinica. Es riecht nach Holzkohle und Zwiebeln, und es ist erst elf.',use:'Später. Hajra kocht. Hajra würde es merken.',g:{look:'Er hatte immer zehn. Ich fünf. Er hat mir zwei abgegeben.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne, schwarz, mit Glas. Unten hat einer „ZOKI“ eingeritzt. Nicht Papa. Hoffe ich.',g:{look:'Nicht sein Papa. Der hat seinen Namen nur auf Kanister geschrieben.'}},
 {id:'rade',npc:'rade',name:'Rade',talk:function(A){ return M.k5TalkRade?M.k5TalkRade(A):A.m('Rade.'); },look:'Rade, der Dispatcher, in seinem Häuschen. Er zählt die Bahnen, wie er sie seit 1979 zählt. Mit Bleistift.',
   g:{look:'Rade. Er hat alle gezählt. Einmal hat er „zwei“ geschrieben, als er einen sah.'}},
 {id:'damir',npc:'damir',name:'Damir',talk:function(A){ return M.k5TalkDamir?M.k5TalkDamir(A):A.m('Damir.'); },look:'Damir, in der Uniform der Verkehrsbetriebe. Pause zwischen zwei Runden. Er trinkt Kaffee aus dem Deckel der Thermoskanne.',
   g:{look:'Er fährt die Drei. Er hat mich einmal gesehen, im Spiegel. Er hat gelacht, als wäre das normal.'}},
 {id:'hajra',npc:'hajra',name:'Hajra',talk:function(A){ return M.k5TalkHajra?M.k5TalkHajra(A):A.m('Hajra.'); },look:'Hajra an der Endstation, mit zwei Taschen. Sie steht da, wie Großmutter dastand. Mama hat sie darum gebeten.',
   g:{look:'Zwei Taschen. Wie Baka.'}}
];
M.room('carsija5',{ name:'Baščaršija', scape:'k2_carsija', music:function(G){ return ph(G)==='k5_sat'?'k2_mala':'k2_sarajevo'; },
  state:function(G){ return {tramIn:satEnd(G)}; },
  actors:function(S,G){ var L=[];
    if (radeHere(G)){ var r=M.apos('carsija','rade',[198,116,'R']); L.push({id:'rade',ch:'rade',x:r[0],y:r[1],f:r[2]||'R',name:'Rade',speechY:46}); }
    if (damirHere(G)){ var d=M.apos('carsija','damir',[136,113,'L']); L.push({id:'damir',ch:'damir',x:d[0],y:d[1],f:d[2]||'L',name:'Damir',speechY:46}); }
    if (satEnd(G)) L.push({id:'hajra',ch:'hajra',x:252,y:120,f:'L',name:'Hajra',speechY:42});
    return L; },
  hotspots:HS_CA,
  entries:{ tramvaj5:[120,124,'R'], kazandziluk5:[626,124,'L'] },
  enter:async function(A,from){ if (M.k5CarsijaEnter) await M.k5CarsijaEnter(A,from); }
});

// ================================================================ Kazandžiluk, Nedžads Werkstatt
var HS_KZ=[
 {id:'exit',name:'Zurück zur Baščaršija',exit:{to:'carsija5'},look:'Zurück auf den Platz.',g:{look:'Da ist der Platz.'}},
 {id:'shop',name:'Werkstatt',look:'Nedžads Werkstatt: eine offene Front, drinnen Kupfer, so weit man sieht, und ein Geruch nach Metall und Kaffee.',g:{look:'Er klopft. Es klingt wie Regen auf einem Dach.'}},
 {id:'workbench',name:'Werkbank',look:function(A){ return A.m(F(A,'k5.s.engraved')?'Auf der Werkbank die fertige Tafel, in Zeitungspapier gewickelt. Nedžad hat sie poliert, bis man sich darin spiegelt.':'Die Werkbank. Darauf eine Messingtafel, zweiunddreißig mal zwölf Zentimeter, noch leer. Daneben ein Zettel: „Delić, bis Freitag“.'); },
   use:function(A){ return M.k5Engrave?M.k5Engrave(A):A.m('Nedžads Werkbank.'); },g:{look:'Eine leere Tafel. Für mich. Noch steht nichts drauf. Gut.'}},
 {id:'anvil',name:'Amboss',look:'Ein kleiner Amboss, blank vom Hämmern. Daneben ein Zollstock, gelb, mit abgebrochener Spitze.',use:function(A){ return M.k5Measure?M.k5Measure(A):A.m('Ein Zollstock.'); },
   g:{look:'Ein Zollstock. Damit misst er alles zweimal.'}},
 {id:'tools',name:'Werkzeug',look:'Werkzeug an der Wand, jedes an seinem Haken, nach Größe. Über einem leeren Haken ein Zettel: „Stemmeisen. Ausgeliehen 2011. Nie zurück.“',g:{look:'Das Stemmeisen hat er. Marko. Seit Dezember. Er hat es vergessen.'}},
 {id:'copper',name:'Kupferwaren',look:'Kupferwaren: Tabletts, Kannen, Teller, mit Mustern, die Nedžad mit einem Nagel und einem Hammer schlägt. Tausend Schläge pro Teller.',g:{look:'Tausend Schläge. Jeder an der richtigen Stelle.'}},
 {id:'dzezve',name:'Džezve',look:'Džezve in allen Größen, von einer Tasse bis zu zwölf. Meine ist von Großmutter. Sie ist nicht von hier.',g:{look:'Seine Džezva ist von Baka. Die hat sie nicht hier gekauft. In Mostar, sagt er.'}},
 {id:'trays',name:'Tabletts',look:'Tabletts mit Gravur: Hochzeitsdaten, Namen, ein „Za Mamu“. Nedžad graviert, was man ihm sagt.',g:{look:'„Za Mamu“. Für Mama.'}},
 {id:'ladder',name:'Leiter',look:'Eine Leiter zum Dachboden. Dort oben lagert Nedžad, was keiner abgeholt hat.',g:{look:'Oben liegen Sachen, die keiner abgeholt hat. Sie warten.'}},
 {id:'attic',name:'Dachboden',look:'Der Dachboden über der Werkstatt. Dunkel.',g:{look:'Da oben liegt ein Teller mit einem Namen, den keiner abgeholt hat. Seit zweiundneunzig.'}},
 {id:'sign',name:'Schild',look:'Ein Schild: „NEDŽAD · bakrorezac · od 1958“. Seit 1958. Das war sein Vater.',g:{look:'Seit 1958. Der Vater. Dann der Sohn. Dann keiner.'}},
 {id:'neighbor',name:'Nachbarladen',look:'Der Nachbarladen. Ein Mann verkauft Kugelschreiber mit „Sarajevo“ drauf, und Tücher. Er sieht immer zu, wenn Nedžad graviert.',g:{look:'Er sieht zu. Er hat nie selbst graviert.'}},
 {id:'lantern',name:'Laterne',look:'Eine Kupferlaterne mit Sternmuster. Wenn sie brennt, liegen Sterne auf dem Pflaster.',g:{look:'Sterne. Wie das Loch in den Fahrscheinen.'}},
 {id:'nedzad',npc:'nedzad',name:'Nedžad',talk:function(A){ return M.k5TalkNedzad?M.k5TalkNedzad(A):A.m('Nedžad.'); },look:'Nedžad, die Brille auf der Stirn, eine zweite auf der Nase. Seine Hände sind grün vom Kupfer, bis zum Handgelenk.',
   give:{ dose_lana:function(A){ return A.npc('nedzad').say('Eine alte Dose. Darauf graviere ich nichts. Die ist schon fertig.'); } },
   g:{look:'Er hat zwei Brillen. Eine für die Arbeit, eine fürs Zuschauen, sagt er.'}}
];
M.room('kazandziluk5',{ name:'Kazandžiluk', scape:'k2_kazan', music:'k2_istraga',
  state:function(G){ return {ladderUp:false,bookOut:false}; },
  actors:function(S,G){ var p=ph(G); if (!(p==='k5_d1'||p==='k5_d2')) return []; var n=M.apos('kazandziluk','nedzad',[200,116,'R']); return [{id:'nedzad',ch:'nedzad',x:n[0],y:n[1],f:n[2]||'R',name:'Nedžad',speechY:46}]; },
  hotspots:HS_KZ,
  entries:{ carsija5:[14,124,'R'] },
  enter:async function(A,from){ if (M.k5KazanEnter) await M.k5KazanEnter(A,from); }
});

// ================================================================ Die Drei (Samstag)
var HS_TR=[
 {id:'door',name:'Tür',look:'Die Tür. Sie öffnet sich nur an den Haltestellen, und dann mit einem Seufzer.',g:{look:'Raus ist erst an der Endstation.'}},
 {id:'validator',name:'Entwerter',look:'Der orange Entwerter. Klack. Ein Datum, eine Uhrzeit, kein Stern.',use:function(A){ return M.k5Validate?M.k5Validate(A):A.m('Klack.'); },g:{look:'Klack. Bei Alija gab es einen Stern dazu.'}},
 {id:'seat',name:'Sitz',look:'Die Sitze. Am Fenster sitzt Mama, daneben Nada.',g:{look:'Am Fenster. Und daneben.'}},
 {id:'window',name:'Fenster',look:'Hinter der Scheibe die Stadt: Hochhäuser, dann das gelbe Holiday, dann der Fluss.',g:{look:'Das war sein Fenster. Heute ist es ihres.'}},
 {id:'route',name:'Linienplan',look:'Der Linienplan der Drei: Ilidža – Baščaršija. Jede Haltestelle ein Punkt. Die letzte ist rot.',g:{look:'Die letzte ist rot. Da steige ich aus.'}},
 {id:'cab',name:'Fahrerkabine',look:'Die Fahrerkabine hinter Glas.',g:{look:'Vorn fährt einer. Er weiß nicht, was er heute fährt.'}},
 {id:'joint',name:'Gelenk',look:'Das Gelenk zwischen den Wagen. Es knarrt in den Kurven wie ein Akkordeon.',g:{look:'Da haben wir gestanden und geschaukelt, bis Lana schimpfte. Lana war ich.'}},
 {id:'ad',name:'Werbung',look:'Werbung für ein Mobilfunknetz: „Uvijek blizu.“ Immer nah.',g:{look:'Immer nah. Haha.'}},
 {id:'lamp',name:'Lampe',look:'Eine Neonröhre, die flackert, wenn die Bahn über eine Weiche fährt.',g:{look:'Sie flackert. Ich auch.'}}
];
var TPOS={ jasna:[122,108,'R'], nada:[160,108,'R'], ana:[234,126,'L'], mia:[212,128,'L'], niko:[196,127,'L'] };
M.room('tramvaj5',{ name:'Straßenbahn, Linie 3', noMap:'Nicht während der Fahrt.', scape:'k2_tram', music:'k2_otkrice',
  state:function(G){ return {line:'3',moving:true,view:'towers'}; },
  actors:function(S,G){ if (ph(G)!=='k5_sat') return []; return Object.keys(TPOS).map(function(id){ var p=TPOS[id], sit=id==='jasna'||id==='nada';
    return {id:id,ch:id==='jasna'?'jasnaC':(id==='ana'?'anaC':(id==='mia'?'miaC':(id==='niko'?'nikoC':id))),x:p[0],y:p[1],f:p[2],name:{jasna:'Mama',nada:'Nada',ana:'Ana',mia:'Mia',niko:'Niko'}[id],idle:sit?'sit':null,talk:sit?'sitTalk':null,speechY:sit?36:(id==='ana'?46:30)}; }); },
  hotspots:HS_TR.concat(['jasna','nada','ana','mia','niko'].map(function(id){ return {id:id,npc:id,name:{jasna:'Mama',nada:'Nada',ana:'Ana',mia:'Mia',niko:'Niko'}[id],
    talk:function(A){ return M.k5TramTalk?M.k5TramTalk(A,id):A.m('…'); },look:function(A){ return M.k5TramLook?M.k5TramLook(A,id):A.m('…'); },g:{look:'…'}}; })),
  entries:{ neboder5:[252,126,'L'] },
  enter:async function(A,from){ if (M.k5TramEnter) await M.k5TramEnter(A,from); }
});
})(M);
