/* ===== rooms/k5_stadt.js — Kapitel 5: Busbahnhof, Pension in Kovači, Vratnik (mit der Žuta tabija), Ružas Küche.
   Die Bilder sind die aus Kapitel 2 (M.ART-Aliase); die Räume haben eigene Kennungen, damit Kapitel 2 unberührt bleibt.
   Szenen: 97_k5_a.js (Ankunft bis Freitag), 97_k5_b.js (Freitagabend bis Montag). ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function f(G,k){ return !!G.flags[k]; }
function ph(G){ return G.phase; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function has(G,id){ return G.notes.indexOf(id)>=0; }
function run(name){ return function(A){ var fn=M[name]; return fn?fn(A):A.m('…'); }; }
['stanica','pansion','vratnik','kuca'].forEach(function(id){ if (M.ART[id] && !M.ART[id+'5']) M.ART[id+'5']=M.ART[id]; });

// ================================================================ Busbahnhof (nur im Prolog wichtig)
var HS_ST=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},canExit:async function(A){ if (ph(A.G)==='k5_pro' && !F(A,'k5.p.taxi')){ await A.m('Mama steht mit den Koffern am Bahnsteig. Erst ein Taxi.'); return false; } return true; },
   look:'Der Ausgang zur Straße. Draußen hupt einer, weil ein anderer hupt.', g:{look:'Da draußen ist die Stadt. Ich kenne sie. Sie mich nicht mehr.'}},
 {id:'bus',name:'Bus aus München',look:function(A){ return A.m(ph(A.G)==='k5_pro'?'Der Bus aus München. Fünfzehn Stunden, zweimal Grenze, einmal Kaffee aus dem Automaten. Der Fahrer raucht schon, bevor der Motor aus ist.':'Ein Bus mit Wiener Kennzeichen. Leute steigen aus und sehen sich um, als wäre die Stadt kleiner geworden.'); },
   g:{look:'Den ganzen Weg hat sie hinausgesehen. Ich weiß es. Ich war nicht im Bus und weiß es trotzdem.',sense:'Viele, die hier ankommen, kommen zum ersten Mal zurück. Es ist laut davon.'}},
 {id:'timetable',name:'Anzeigetafel',look:'Die Anzeigetafel. Mostar, Tuzla, Beograd, Zagreb, München. Die Buchstaben klappen um, wenn einer abfährt. Darunter steht Mala, den grauen Schal um den Hals.',
   read:'MÜNCHEN 18:30. Den nimmt Mama am Dienstag zurück. Ich nicht.',
   g:{look:'Hier stehe ich, seit es hell ist. Ich habe gewartet. Das kann ich.',sense:'Abfahrten, Ankünfte. Die Tafel weiß nicht, wer wiederkommt.'}},
 {id:'kiosk',name:'Kiosk',look:'Ein Kiosk mit Zeitungen, Zigaretten, Kaugummi und Fahrscheinen für die Straßenbahn.',
   use:function(A){ return M.k5Kiosk?M.k5Kiosk(A):A.m('Später.'); }, talk:function(A){ return M.k5Kiosk?M.k5Kiosk(A):A.m('Später.'); },
   g:{look:'Bei Alija gab es die Fahrscheine mit dem Sternloch. Hier gibt es sie ohne Stern.'}},
 {id:'newspapers',name:'Zeitungen',look:'Oslobođenje, Dnevni avaz. Auf einer Titelseite: „Identifikovano još sedam“. Noch sieben identifiziert. Ich lese nicht weiter.',
   g:{look:'Sieben. Immer sind es sieben, die man noch findet.'}},
 {id:'burek',name:'Burek-Stand',look:'Burek aus dem Blech, in Papier. Der Mann schneidet mit einem Messer, das größer ist als sein Unterarm.',use:'Nicht jetzt. Hajra hat Burek. Hajra hat immer Burek.',
   g:{look:'Riecht nach Samstag.'}},
 {id:'exchange',name:'Wechselstube',look:'Mjenjačnica. Mama hat ihre Euro schon in München gewechselt. „Damit ich nicht an so einem Schalter stehe.“',g:{look:'Geld für ein Land, das es nicht mehr gibt. Dann für eines, das neu war.'}},
 {id:'atm',name:'Geldautomat',look:'Ein Geldautomat, der freundlich in vier Sprachen nichts ausgibt.',g:{look:'Er piepst. Das ist alles.'}},
 {id:'parcel',name:'Gepäckaufbewahrung',look:'Gepäckaufbewahrung. Ein Mann schläft auf einem Stuhl zwischen Koffern, die nicht seine sind.',g:{look:'Er träumt vom Meer. Ich sehe es nicht. Ich weiß es.'}},
 {id:'taxi',name:'Taxistand',look:'Taxis, gelb und weiß. Ein Fahrer lehnt an der Tür und raucht. Er hebt das Kinn, als ich hinsehe.',
   use:function(A){ return M.k5Taxi?M.k5Taxi(A):A.m('Später.'); }, talk:function(A){ return M.k5Taxi?M.k5Taxi(A):A.m('Später.'); },
   g:{look:'Mama steigt nie in ein Auto, das sie nicht kennt. Heute schon.'}},
 {id:'station',name:'Bahnhofsgebäude',look:'Das Bahnhofsgebäude, Glas und Beton. Vorn eine Uhr, die stimmt. Das war früher nicht so.',g:{look:'Hier war ich nie. Ich war immer am anderen Ende der Drei.'}},
 {id:'clock',name:'Uhr',look:function(A){ return A.m(ph(A.G)==='k5_pro'?'Sechs Uhr vierzig. Es wird hell.':'Die Uhr geht. Ich sehe trotzdem auf mein Telefon.'); },g:{look:'Zehn nach elf ist erst am Samstag.'}},
 {id:'tram_stop',name:'Haltestelle',look:'Die Haltestelle der Eins. Mama sieht nicht hin.',g:{look:'Die Eins. Nicht die Drei.'}},
 {id:'tram',name:'Gleise',look:'Gleise, nass vom Tauwetter. Am Rand Schneehaufen vom Februar, grau wie alte Zeitungen.',g:{look:'Darauf fährt die Drei auch. Irgendwann.'}},
 {id:'bench',name:'Bank',look:'Eine Bank unter dem Vordach. Auf so einer Bank habe ich nie gesessen. Mala schon.',use:'Ich habe fünfzehn Stunden gesessen.',g:{look:'Ich habe auf vielen Bänken gewartet. Auf dieser nicht. Heute nicht mehr.'}},
 {id:'pigeons',name:'Tauben',look:'Tauben zwischen den Bussen. Sie haben keine Angst vor Rädern, nur vor Kindern.',g:{look:'Die sehen mich. Tauben sehen alles. Sie sagen es keinem.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },
   look:'Mama, im dunklen Wintermantel, den Koffergriff in der Hand. Sie sieht sich um wie jemand, der eine Wohnung besichtigt, in der er einmal gewohnt hat.',
   give:{ dose_lana:function(A){ return M.k5GiveTinEarly?M.k5GiveTinEarly(A):A.m('Nicht hier.'); } },
   g:{look:'Sie sieht mich nicht. Sie sieht hin, wo ich stehe, und sieht die Tafel.'}}
];
M.room('stanica5',{ name:'Busbahnhof', scape:'k2_stanica', music:'k2_sarajevo',
  state:function(G){ return {tramIn:false,busTo:'muenchen'}; },
  load:function(A){ var r=M.ROOMS['stanica5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var L=[]; if (ph(G)==='k5_pro' && !f(G,'k5.p.taxi')) L.push({id:'jasna',ch:'jasnaC',x:74,y:122,f:'R',name:'Mama',idle:'waitF',speechY:46}); return L; },
  hotspots:HS_ST,
  enter:async function(A,from){ if (ph(A.G)!=='k5_pro' && A.first('k5stLater')) await A.m('Der Busbahnhof. Von hier fährt Mama am Dienstag zurück.'); }
});

// ================================================================ Pension Hajra, Kovači
function hajraHere(G){ var p=ph(G); if (p==='k5_n1'||p==='k5_d2_n'||p==='k5_fun') return false; if (p==='k5_pro') return f(G,'k5.p.hajra')||f(G,'k5.p.taxi'); return true; }
function jasnaInPension(G){ return (ph(G)==='k5_pro' && f(G,'k5.p.taxi') && !f(G,'k5.p.hajra')) || (ph(G)==='k5_sat' && !f(G,'k5.sat.left')); }
var HS_PA=[
 {id:'door',name:'Tür',exit:{to:'map'},canExit:async function(A){ return M.k5PensionExit?await M.k5PensionExit(A):true; },
   look:'Die Tür zur Treppe. Unten der Hof, die Gasse, dahinter die Grabsteine von Kovači.',g:{look:'Unten liegt Kovači. Weiße Steine, wie Zähne.'}},
 {id:'bed',name:'Bett',look:function(A){ return A.m(ph(A.G)==='k5_n1'?'Mačak liegt quer auf dem Bett, als hätte er es gemietet.':'Das Bett. Hajra hat es frisch bezogen. Es riecht nach Waschpulver und ein bisschen nach Kater.'); },
   use:function(A){ return M.k5Bed(A); }, g:{look:'Darauf liegt Mačak. Er hat mich vermisst. Sagt er.'}},
 {id:'window',name:'Fenster',look:function(A){ return A.m(ph(A.G)==='k5_n1'?'Das Fenster ist kalt. Draußen Frost auf den Grabsteinen von Kovači, weiß vom Februar.':'Das Fenster. Draußen Dächer, Minarette und weiter oben die Grabsteine von Kovači.'); },
   use:function(A){ return M.k5PensionWindow?M.k5PensionWindow(A):A.m('Kalt.'); },
   g:{look:'In acht Wochen habe ich es an Mamas Fenster versucht. Jeden Abend.',draw:function(A){ return M.k5PensionWindowG?M.k5PensionWindowG(A):A.g('Die Scheibe ist klar.'); },drawIf:function(S,G){ return ph(G)==='k5_n1'; }}},
 {id:'stove',name:'Ofen',look:'Ein Kachelofen. Hajra heizt mit dem Holz, das sie zwanzig Jahre für niemanden gestapelt hat.',use:'Er ist warm. Ich halte die Hände dran, wie Großmutter.',g:{look:'Warm. Ich weiß noch, wie warm ist.'}},
 {id:'table',name:'Tisch',look:function(A){ return A.m(ph(A.G)==='k5_sat'?'Frühstück. Hajra hat für drei gedeckt. Sie hat sich verzählt, sagt sie. Sie hat sich nicht verzählt.':'Ein Tisch mit Wachstuch. Darauf eine Schale mit Äpfeln und eine Džezva, die nicht meine ist.'); },
   use:function(A){ return M.k5PensionTable?M.k5PensionTable(A):A.m('Später.'); },g:{look:'Der leere Stuhl neben ihm. Mačak sitzt davor und starrt. Mich an.'}},
 {id:'phone',name:'Telefon',look:'Hajras altes Telefon mit Wählscheibe. Es klingelt nie. Alle rufen sie auf dem Handy an.',use:'Ich wüsste nicht, wen. Alle, die ich anrufen würde, sind in dieser Stadt.',g:{look:'Schwarz. Daran hat einer im Krieg auf Anrufe gewartet.'}},
 {id:'socket',name:'Steckdose',look:'Eine Steckdose. Mein Ladegerät steckt drin. Das Telefon hat noch neunzehn Prozent.',g:{look:'Strom. Ich spüre ihn nicht. Mačak schon.'}},
 {id:'photos',name:'Fotos',look:'Hajras Fotos: Hochzeiten, eine Schulklasse, ein Mann mit Schnurrbart vor einem Lastwagen. Keiner ist mehr da, sagt sie, außer ihr und dem Lastwagen.',
   g:{look:'Lauter Leute, die gegangen sind. Keiner ist geblieben. Das ist gut.'}},
 {id:'cat',name:'Mačak',look:function(A){ return A.m(ph(A.G)==='k5_n1'?'Mačak liegt auf dem Bett und sieht zur Fensterbank. Dort sitzt Mala.':'Mačak, der Kater. Er ist dicker geworden. Er starrt auf den leeren Platz neben mir.'); },
   use:'Ich kraule ihn hinter dem Ohr. Er sieht dabei an mir vorbei.', talk:'„Mačak.“ Er sieht mich an, als wäre das kein Name, sondern eine Unterstellung.',
   g:{look:'Er sieht mich. Er hat mich immer gesehen.',talk:'Mačak. Ich bin wieder da. Er blinzelt. Das heißt: Ich weiß.'}},
 {id:'wardrobe',name:'Schrank',look:'Ein Schrank mit einem Spiegel, der alles ein bisschen grüner macht. Darin meine zwei Hemden und Mamas guter Mantel für Freitag.',g:{look:'Im Spiegel bin ich nicht. Das weiß ich seit Split.'}},
 {id:'shelf',name:'Regal',look:'Ein Regal mit Büchern auf Bosnisch, Deutsch und einem auf Schwedisch. Hajra hatte Gäste aus aller Welt. Einer hat ein Kochbuch dagelassen.',g:{look:'Ein Kochbuch für Schweden. Für Pita steht nichts drin.'}},
 {id:'rug',name:'Teppich',look:'Ein Kelim, ausgetreten in der Mitte, wo alle stehen bleiben, bevor sie gehen.',g:{look:'Hier stehen alle kurz, bevor sie gehen. Ich auch.'}},
 {id:'hajra',npc:'hajra',name:'Hajra',talk:function(A){ return M.k5TalkHajra?M.k5TalkHajra(A):A.m('Hajra.'); },
   look:'Hajra, in Strickjacke und Hausschuhen. Sie wischt die Hände an der Schürze ab, auch wenn sie trocken sind.',
   give:{ kanister:'Hajra: „Den von Zoran? Den lass dir nicht wegnehmen. An der Pivara stehen sie mit Plastikflaschen an wie Touristen.“',
     dose_lana:function(A){ return A.npc('hajra').say('Die ist nicht für mich, sine. Das sehe ich an deinem Gesicht.'); } },
   g:{look:'Hajra. Sie hat für mich nie gedeckt. Heute schon. Sie weiß es nicht.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },
   look:function(A){ return A.m(ph(A.G)==='k5_sat'?'Mama, im guten Mantel, obwohl wir drinnen sitzen. Sie hat ihn heute früh schon angezogen. Sie sieht alle fünf Minuten auf die Uhr.':'Mama am Tisch, die Hände um eine Tasse. Sie hat den Mantel nicht ausgezogen.'); },
   give:{ dose_lana:function(A){ return M.k5GiveTinEarly?M.k5GiveTinEarly(A):A.m('Nicht hier.'); }, pantoffeln:'Mama: „Die sind für Ružas Haus. Nicht für Hajras Teppich.“' },
   g:{look:'Sie hat Angst. Sie hatte noch nie solche Angst vor einer Treppe.'}}
];
M.room('pansion5',{ name:'Pension in Kovači', scape:'k2_pansion', music:function(G){ return ph(G)==='k5_n1'?'k2_noc':(ph(G)==='k5_epi'?'k4_epi':'k2_sarajevo'); },
  state:function(G){ return {coffee:ph(G)==='k5_sat',charging:true,catAt:ph(G)==='k5_n1'?'bed':'window'}; },
  load:function(A){ var r=M.ROOMS['pansion5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var L=[];
    if (hajraHere(G)){ var h=M.apos('pansion','hajra',[132,113,'L']); L.push({id:'hajra',ch:'hajra',x:h[0],y:h[1],f:h[2]||'L',name:'Hajra',speechY:42}); }
    if (jasnaInPension(G)) L.push({id:'jasna',ch:ph(G)==='k5_sat'?'jasnaC':'jasna',x:206,y:126,f:'L',name:'Mama',idle:'sit',talk:'sitTalk',speechY:36});
    return L; },
  hotspots:HS_PA,
  enter:async function(A,from){ if (M.k5PensionEnter) await M.k5PensionEnter(A,from); }
});

// ================================================================ Vratnik: die Gasse, Ružas Tor, der Garten, die Žuta tabija
function vratnikTod(G){ return f(G,'k5.n2.dawn')?'dawn':G.tod; }
var HS_VR=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},canExit:async function(A){ return M.k5VratnikExit?await M.k5VratnikExit(A):true; },
   look:'Die Gasse hinunter, zur Stadt.',g:{look:'Da hinunter ist die Stadt. Ich bin oft hinuntergerannt. Hinauf nie.'}},
 {id:'alley',name:'Gasse',look:'Eine steile Gasse, Kopfsteinpflaster, in den Fugen Schmelzwasser. Am Rand liegt der Februar in grauen Haufen.',g:{look:'Hier bin ich immer vorausgerannt. Polako, hat Großmutter gerufen. Langsam.'}},
 {id:'houses',name:'Häuser',look:'Kleine Häuser mit Ziegeldächern und hohen Mauern. Hinter den Mauern Gärten, in denen im März noch nichts ist außer Hoffnung und Holz.',g:{look:'In jedem Haus hat einer gewartet. Fast keiner wartet mehr.'}},
 {id:'mosque',name:'Moschee',look:'Eine kleine Moschee mit Holzminarett. Ein Mann fegt den Hof, obwohl da nichts liegt.',g:{look:'Der Mann fegt jeden Tag. Sein Vater hat auch gefegt.'}},
 {id:'ruza_house',name:'Ružas Haus',look:function(A){ return A.m(F(A,'k5.sat.gate')?'Ružas Haus. Die Tür steht offen. Drinnen knackt der Herd.':'Großmutters Haus. Weiß, klein, das neue Dach dunkelrot. Mama hat es achtzehn Jahre bezahlt, jeden Monat, ohne es zu sehen.'); },
   g:{look:'Das Dach ist neu. Darunter ist alles alt. Gut so.'}},
 {id:'ruza_gate',name:'Ružas Tor',exit:{to:'kuca5'},canExit:async function(A){ return M.k5GateExit?await M.k5GateExit(A):true; },
   look:'Das Tor in der Mauer, grün gestrichen, die Farbe blättert. Im Sommer 1993 hat hier einer „Ich komme“ gesagt.',
   g:{look:'Hier.',sense:function(A){ return A.g(F(A,'k5.sat.gate')?'Offen.':'Hier habe ich „Kommst du?“ gefragt. Und er hat gelogen. Er war vierzehn.'); }}},
 {id:'garden',name:'Garten',look:function(A){ return A.m(F(A,'k5.p.tarp')?'Die Plane ist zurückgeschlagen. Darunter der zweite blaue Kanister und Hajras Holz.':'Ružas Garten. Der Quittenbaum, kahl. An der Mauer ein Haufen unter einer grünen Plane, mit Ziegeln beschwert.'); },
   use:function(A){ return M.k5Garden?M.k5Garden(A):A.m('Eine Plane.'); },open:function(A){ return M.k5Garden?M.k5Garden(A):A.m('Eine Plane.'); },
   g:{look:function(A){ return A.g(F(A,'k5.p.tarp')?'Der andere Kanister. Den hat er nicht getragen.':'Unter der Plane ist etwas Blaues. Und Holz. Hajras Holz.'); },
     sense:function(A){ return M.k5GardenSense?M.k5GardenSense(A):A.g('Blau.'); }}},
 {id:'wall',name:'Stadtmauer',look:'Die alte Stadtmauer. Von hier aus sieht man über die ganze Stadt, bis Ilidža.',g:{look:'Über die Mauer haben wir gespuckt. Weit. Er weiter. Er war ja älter.'}},
 {id:'tabija',name:'Žuta tabija',look:function(A){ return A.m(ph(A.G)==='k5_d2_n'?'Die Žuta tabija, die gelbe Bastei. Unter uns die Stadt, Lichter bis Ilidža.':'Die Žuta tabija. Leute mit Kaffee aus Pappbechern, die sich über die Stadt beugen.'); },
   use:function(A){ return M.k5TabijaUse?M.k5TabijaUse(A):A.m('Später.'); },
   g:{look:'Bis es hell wird, hat Großmutter gesagt. Dann gehen wir.',sense:'Viele haben hier gestanden und geschossen. Viele haben hier gestanden und geschwiegen. Die zweiten sind lauter.'}},
 {id:'bench',name:'Bank',look:function(A){ return A.m(F(A,'k5.n2.done')&&!F(A,'k5.sat.started')?'Die Bank auf der Bastei. Hinter dem Trebević wird es grau.':'Eine Bank auf der Bastei. Kalt.'); },
   use:function(A){ return M.k5TabijaBench?M.k5TabijaBench(A):A.m('Kalt.'); },
   g:{look:'Hier haben wir gesessen, er, Großmutter und ich, mit Bonbons aus der Tasche.'}},
 {id:'cannon',name:'Kanone',look:'Eine alte Kanone, blank gerieben von Kindern, die draufsitzen. Sie zeigt auf die Stadt, wie alles hier oben.',g:{look:'Wir haben draufgesessen. Er vorn. Er war ja älter.'}},
 {id:'view',name:'Blick auf die Stadt',look:function(A){ return A.m(ph(A.G)==='k5_d2_n'?'Die Stadt in der Nacht. Dort unten liegt Bare, dort unten Alipašino Polje, dort unten die Brauerei. Alles, was diese Woche war, hat ein Licht.':'Die Stadt in ihrem Tal. Rauch aus Schornsteinen, Dunst über der Miljacka, Minarette und Kräne.'); },
   g:{look:'Von hier sieht man alles, wo ich war. Siebzehn Jahre und zwei Monate.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne, die schon brennt, obwohl es noch hell ist. Oder noch, obwohl es schon hell ist.',g:{look:'Licht. Ein kleines.'}},
 {id:'dog',name:'Hund',look:'Ein gelber Hund schläft in der Sonne, die er sich gesucht hat.',talk:'Er hebt ein Ohr. Das zweite spart er sich.',g:{look:'Er sieht mich nicht. Hunde sehen nur Wurst.',talk:'Hej. Er wedelt im Schlaf.'}}
];
function vratnikActors(S,G){ var L=[];
  if (ph(G)==='k5_pro' && f(G,'k5.p.hajra') && !f(G,'k5.p.inside')) L.push({id:'jasna',ch:'jasnaC',x:230,y:118,f:'R',name:'Mama',idle:'waitF',speechY:46});
  if (ph(G)==='k5_pro' && f(G,'k5.p.taxi')==='v' && f(G,'k5.p.hajra') && !f(G,'k5.p.inside')) L.push({id:'hajra',ch:'hajra',x:272,y:116,f:'L',name:'Hajra',speechY:42});
  return L; }
var HS_VR2=HS_VR.concat([
 {id:'hajra',npc:'hajra',name:'Hajra',talk:function(A){ return M.k5TalkHajra?M.k5TalkHajra(A):A.m('Hajra.'); },look:'Hajra, außer Atem vom Hang, den Schlüssel in der Faust.',g:{look:'Hajra. Sie ist den ganzen Hang gelaufen.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },
   look:'Mama vor dem grünen Tor. Sie fasst die Klinke nicht an. Sie sieht hinauf, zum Dach.',
   give:{ dose_lana:function(A){ return M.k5GiveTinEarly?M.k5GiveTinEarly(A):A.m('Nicht hier.'); } },g:{look:'Sie hat das Dach bezahlt. Das Tor nie gesehen.'}}
]);
M.room('vratnik5',{ name:'Vratnik', scape:'k2_vratnik', tod:vratnikTod,
  music:function(G){ var p=ph(G); return p==='k5_d2_n'?'k2_noc':(p==='k5_sat'?'k2_mala':(p==='k5_epi'?'k4_epi':'k2_sjecanje')); },
  state:function(G){ return {}; },
  load:function(A){ var r=M.ROOMS['vratnik5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:vratnikActors,
  hotspots:HS_VR2,
  entries:{ kuca5:[254,115,'F'] },
  enter:async function(A,from){ if (M.k5VratnikEnter) await M.k5VratnikEnter(A,from); }
});

// ================================================================ Ružas Küche
function kucaCast(G){ var p=ph(G); if (p==='k5_pro') return (f(G,'k5.p.inside') && !has(G,'b5_hand'))?['jasna']:[]; if (p==='k5_sat' && f(G,'k5.sat.gate')) return ['jasna','nada','hajra','ana','mia','niko'];
  if (p==='k5_epi' && f(G,'k5.e.funeral')) return ['jasna','nada','hajra','ana','mia','niko']; return []; }
var KPOS={ jasna:[100,120,'R'], nada:[178,122,'L'], hajra:[210,110,'L'], ana:[80,127,'R'], mia:[124,131,'R'], niko:[138,130,'R'] };
var KCH={ jasna:'jasna', nada:'nada', hajra:'hajra', ana:'ana', mia:'mia', niko:'niko' };
var KNAME={ jasna:'Mama', nada:'Nada', hajra:'Hajra', ana:'Ana', mia:'Mia', niko:'Niko' };
var HS_KU=[
 {id:'door',name:'Tür',exit:{to:'vratnik5'},canExit:async function(A){ return M.k5KucaExit?await M.k5KucaExit(A):true; },
   look:'Die Haustür. Durch den Spalt kommt Märzluft und der Geruch von nassem Holz.',g:{look:'Die Tür. Hier hat Großmutter immer gewartet, mit zwei Taschen.'}},
 {id:'stove',name:'Herd',look:'Ružas Holzherd. Er ist warm. Hajra hat gestern Feuer gemacht, und heute wieder.',use:'Ich lege ein Scheit nach. Es knackt. Großmutter hat dabei immer gesagt: „Tako.“ So.',
   g:{look:'Der Herd. Dahinter hat sie die Hakenstange hingestellt. Da stört sie keinen.',sense:'Hier hat sie Kaffee gekocht, jeden Samstag um halb zwölf. Für drei.'}},
 {id:'compartment',name:'Wärmefach',look:'Das Wärmefach im Herd. Leer. Darin hat Großmutter die Teller warm gehalten, für uns.',open:'Leer und warm. Es riecht nach Blech.',g:{look:'Leer. Früher war Pita drin.'}},
 {id:'pipe',name:'Ofenrohr',look:'Das Ofenrohr, schwarz, mit einer Klappe. Es tickt, wenn es warm wird.',g:{look:'Es tickt. Wie früher.'}},
 {id:'table',name:'Tisch',look:function(A){ return A.m(ph(A.G)==='k5_sat'?'Der Tisch. Hajras Pita, Mamas Sarma, Brot. Nada hat Tassen hingestellt. Sechs.':(ph(A.G)==='k5_epi'?'Der Tisch. Tassen, Plätzchen, Ružas Džezva in der Mitte.':'Der Tisch unter einem Tuch. Darunter ein Wachstuch mit Kirschen. Das Muster habe ich vergessen und sofort wiedererkannt.')); },
   use:function(A){ return M.k5KucaTable?M.k5KucaTable(A):A.m('Später.'); },g:{look:'Drei Stühle. Einer war meiner.'}},
 {id:'chairs',name:'Stühle',look:'Stühle mit Bastsitz. Einer wackelt. Es war immer derselbe.',use:'Ich setze mich auf den, der wackelt. Er wackelt noch.',g:{look:'Meiner wackelt. Er hat ihn immer genommen, damit ich nicht wackle.'}},
 {id:'cupboard',name:'Küchenschrank',look:'Der Küchenschrank. Oben drauf Quitten auf Zeitungspapier von 1994, gelb und runzlig, und sie riechen noch.',open:'Teller, Gläser, ein Glas mit Zucker, das so hart ist wie ein Stein.',
   g:{look:'Quitten. Sie legt sie immer auf den Schrank. Damit es riecht.',sense:'Sie hat gewartet, dass wir kommen. Dann hat sie gewartet, dass einer kommt. Dann hat sie aufgehört zu warten. Dann kamen die aus Foča.'}},
 {id:'cups',name:'Tassen',look:'Kleine Tassen mit Goldrand, zwei mit Sprung. Wer zu Großmutter kam, bekam eine mit Sprung, damit er wiederkommt.',g:{look:'Mit Sprung. Damit man wiederkommt.'}},
 {id:'window',name:'Fenster',look:function(A){ return A.m(ph(A.G)==='k5_epi'&&F(A,'k5.e.funeral')?'Das Fenster neben dem Tisch ist beschlagen, vom Kaffee und von uns allen.':'Das Küchenfenster. Dahinter das Tal, die Stadt, die Hänge des Trebević.'); },
   use:function(A){ return M.k5KucaWindow?M.k5KucaWindow(A):A.m('Später.'); },
   g:{look:'Durch das Fenster hat sie uns kommen sehen. Ich war immer zuerst da.'}},
 {id:'calendar',name:'Kalender',look:'Ein Kalender, Februar 1994. Darauf der Trebević im Schnee. Seitdem hat keiner umgeblättert. Die Familie aus Foča auch nicht.',
   g:{look:'Februar vierundneunzig. Da hat Baka aufgehört umzublättern. Ich weiß, warum.'}},
 {id:'sofa',name:'Sofa',look:'Das Sofa unter dem Fenster. Hier hat sie Mittagsschlaf gehalten, mit dem Radio auf dem Bauch.',use:'Ich setze mich. Die Feder in der Mitte ist noch da.',g:{look:'Darauf habe ich gesessen und auf den Kaffee gewartet. Er auch.'}},
 {id:'photo',name:'Foto',look:'Ein Foto über dem Sofa: Ruža mit Zoran als Kind, beide mit der gleichen Mütze.',g:{look:'Sie hat ihn ausgeschimpft, weil die Mütze schief saß. Seine auch.'}},
 {id:'sheets',name:'Tücher',vis:function(S,G){ return ph(G)==='k5_pro'; },look:'Weiße Tücher über den Möbeln. Die Familie aus Foča hat nichts angefasst. Sie haben alles zugedeckt, als wäre es ein Haus, in das einer zurückkommt.',
   use:'Ich lasse sie. Das macht Mama. Oder keiner.',g:{look:'Weiß. Wie Schnee auf Möbeln.'}}
].concat(Object.keys(KPOS).map(function(id){ return {id:id,npc:id,name:KNAME[id],talk:function(A){ return M.k5KucaTalk?M.k5KucaTalk(A,id):A.m('…'); },
  look:function(A){ return M.k5KucaLook?M.k5KucaLook(A,id):A.m(KNAME[id]+'.'); },
  give:{ dose_lana:function(A){ return A.m('Die Dose ist nicht mehr meine.'); } },g:{look:'…'}}; }));
M.room('kuca5',{ name:'Ružas Küche', scape:'k2_kuca', music:function(G){ return ph(G)==='k5_epi'?'k4_epi':'k2_sjecanje'; },
  state:function(G){ return {compOpen:false,msgTaken:true,sheetsOff:ph(G)!=='k5_pro'}; },
  load:function(A){ var r=M.ROOMS['kuca5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ return kucaCast(G).map(function(id){ var p=KPOS[id]; var sit=id==='jasna'||id==='nada'||id==='ana'; return {id:id,ch:KCH[id],x:p[0],y:p[1],f:p[2],name:KNAME[id],idle:sit&&ph(G)!=='k5_pro'?'sit':null,talk:sit&&ph(G)!=='k5_pro'?'sitTalk':null,speechY:sit?36:(id==='mia'||id==='niko'?30:44)}; }); },
  hotspots:HS_KU,
  entries:{ vratnik5:M.ART.kuca&&M.ART.kuca.entries?M.ART.kuca.entries.vratnik:undefined },
  enter:async function(A,from){ if (M.k5KucaEnter) await M.k5KucaEnter(A,from); }
});
})(M);
