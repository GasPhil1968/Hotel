/* ===== rooms/k5_haus7.js — Kapitel 5: Haus 7 in Alipašino Polje. Hof (neboder5), Eingangshalle (haustor5), Treppenhaus im
   siebten Stock (stiege5, neues Bild), Nadas Wohnung im neunten Stock (stan5). Bilder aus Kapitel 2 über M.ART-Aliase. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function f(G,k){ return !!G.flags[k]; }
function ph(G){ return G.phase; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
['neboder','haustor','stan'].forEach(function(id){ if (M.ART[id] && !M.ART[id+'5']) M.ART[id+'5']=M.ART[id]; });
function jasnaFollows(G){ return ph(G)==='k5_pro' && has(G,'b5_hand') && !f(G,'k5.p.seventh'); }

// ================================================================ Hof
var HS_NB=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},canExit:async function(A){ return M.k5NeboderExit?await M.k5NeboderExit(A):true; },
   look:'Die Straße, die Haltestelle, die Stadt.',g:{look:'Da geht es zur Drei.'}},
 {id:'kiosk_spot',name:'Kiosk',look:'Der Kiosk, an dem früher Alija verkauft hat. Jetzt verkauft ein Junge mit Kopfhörern Lose und Kaugummi.',
   talk:'„Fahrscheine?“ – „Nur beim Fahrer.“ Alija hätte drei Sätze dazu gesagt.',g:{look:'Alija hatte eine Zange mit einem Stern. Der Junge hat Kopfhörer.'}},
 {id:'tram_stop',name:'Haltestelle',look:'Die Haltestelle der Drei, dreihundert Meter weiter westlich als früher. Ein Häuschen aus Glas.',
   use:function(A){ return M.k5TramStop?M.k5TramStop(A):A.m('Heute nicht.'); },g:{look:'Hier sind wir eingestiegen. Er am Fenster.'}},
 {id:'tram',name:'Gleise',look:'Die Gleise der Drei. Zwischen den Schienen wächst im März schon Gras.',g:{look:'Hier fährt sie. Immer noch.'}},
 {id:'tower7',name:'Haus 7',look:function(A){ return A.m(jasnaFollows(A.G)?'Haus 7. Mama legt den Kopf in den Nacken und zählt. „Dritte von links.“ Unsere Loggia.':'Haus 7. Zwölf Stockwerke. Im siebten haben wir gewohnt, im neunten wohnt Nada.'); },
   g:{look:'Neunter Stock, Fenster rechts. Da habe ich gesessen. Acht Wochen.'}},
 {id:'roofclock',name:'Uhr auf dem Dach',look:'Auf dem Dach des Hochhauses gegenüber die ausgebrannte Uhr. Sie zeigt seit zwanzig Jahren dieselbe Zeit. Keiner repariert sie, weil keiner sich einigen kann, welche.',
   g:{look:'Sie steht. Wie ich. Fast.'}},
 {id:'haustor_door',name:'Hauseingang',exit:{to:'haustor5'},look:'Der Hauseingang mit der Gegensprechanlage, auf der die Hälfte der Namen mit Kugelschreiber geschrieben ist.',
   g:{look:'Die Tür. Er ist hier jeden Tag rausgerannt. Ich jeden Samstag rein.'}},
 {id:'balconies',name:'Loggien',look:'Die Loggien. In der dritten von links im siebten Stock hängt Wäsche, die nicht unsere ist.',g:{look:'Seine Loggia. Da hat er auf mich gewartet, samstags. Er hat so getan, als ob nicht.'}},
 {id:'towers',name:'Hochhäuser',look:'Die anderen Hochhäuser, grau, mit Einschusslöchern, die jemand mit hellerem Putz zugespachtelt hat. Wie Pflaster.',g:{look:'Die Pflaster sieht man von weitem.'}},
 {id:'playground',name:'Spielplatz',look:'Der Spielplatz. Ein Klettergerüst, neu, mit Plastikrutsche. Das alte war aus Eisen und hat im Winter an den Händen geklebt.',g:{look:'Das alte war besser. Es hat geklebt.'}},
 {id:'sandpit',name:'Sandkasten',look:'Ein Sandkasten voller Schneematsch.',g:{look:'Darin habe ich eine Stadt gebaut. Er hat sie bombardiert. Mit Tannenzapfen.'}},
 {id:'hatch',name:'Kellerluke',look:'Eine Kellerluke, mit Draht zugebunden. Dahinter der Schutzraum.',g:{look:'Da unten war es warm. Und laut.'}},
 {id:'bench',name:'Bank',look:'Eine Bank. Zwei alte Männer haben sie mit Zeitungen belegt, damit keiner sie nimmt, bevor sie wiederkommen.',g:{look:'Die kommen wieder. Jeden Tag.'}},
 {id:'cars',name:'Autos',look:'Ein Golf und ein Yugo. Der Yugo hat ein Lenkradschloss. Das sagt viel über die Gegend und mehr über den Yugo.',g:{look:'Papa hatte einen roten Zastava. Er hat seinen Namen nicht draufgeschrieben. Den einzigen.'}},
 {id:'trees',name:'Pappeln',look:'Pappeln, kahl. Darin Krähen, die alles kommentieren.',g:{look:'Die Krähen reden über uns.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne mit einem Aufkleber: „Volim te, Sarajevo“.',g:{look:'Sie auch.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },look:'Mama vor Haus 7. Sie hält den Koffergriff, obwohl der Koffer in Kovači steht. Sie hält nur den Griff ihrer Tasche, so fest.',
   g:{look:'Sie zählt die Loggien. Ich zähle mit.'}}
];
M.room('neboder5',{ name:'Alipašino Polje', scape:'k2_neboder', music:function(G){ return ph(G)==='k5_sat'?'k2_mala':'k2_istraga'; },
  state:function(G){ return {tramIn:false}; },
  load:function(A){ var r=M.ROOMS['neboder5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var L=[]; if (jasnaFollows(G)) L.push({id:'jasna',ch:'jasnaC',x:304,y:122,f:'R',name:'Mama',idle:'waitF',speechY:46}); return L; },
  hotspots:HS_NB,
  entries:{ haustor5:[330,116,'F'], tramvaj5:[118,120,'R'] },
  enter:async function(A,from){ if (M.k5NeboderEnter) await M.k5NeboderEnter(A,from); }
});

// ================================================================ Eingangshalle
function hallCast(G){ var p=ph(G), L=[]; if (p==='k5_pro'||p==='k5_d1'||p==='k5_d2'){ L.push('dragica'); L.push('sehic'); } return L; }
var HS_HT=[
 {id:'exit',name:'Hinaus',exit:{to:'neboder5'},look:'Die Glastür zum Hof.',g:{look:'Draußen ist der Hof.'}},
 {id:'sehic_door',name:'Šehićs Tür',look:'Šehićs Wohnungstür, mit einem Messingschild: „ŠEHIĆ · Kućni savjet“. Hausrat. Er ist es seit 1979.',g:{look:'Hinter der Tür tickt eine Uhr. Laut.'}},
 {id:'mailboxes',name:'Briefkästen',look:'Briefkästen. Auf einem steht noch „DELIĆ“, auf dem für den siebten Stock „—“.',read:'DELIĆ, 9. Darunter, auf Klebeband: „Molim bez reklama“. Bitte keine Werbung.',
   g:{look:'In Mamas Kasten liegt jeden Januar ein Brief vom Suchdienst. Dieses Jahr nicht.'}},
 {id:'housebook',name:'Hausbuch',look:'Das Hausbuch hinter Glas, in Šehićs Handschrift. Er führt es seit 1979.',read:function(A){ return M.k5Housebook?M.k5Housebook(A):A.m('Namen.'); },
   g:{look:'Lauter Namen. Bei manchen steht ein Kreuz. Bei mir stand siebzehn Jahre nichts.'}},
 {id:'notices',name:'Aushänge',look:'Aushänge: Stromabschaltung am Dienstag, Hausversammlung am Mittwoch, ein Kater entlaufen, „Mačak, sehr dick, hört auf nichts“. Hajras ist es nicht.',
   g:{look:'Ein Kater. Er kommt zurück. Kater kommen immer zurück.'}},
 {id:'elevator',name:'Aufzug',look:'Der Aufzug. Auf der Tür ein Zettel: „VAN FUNKCIJE“. Außer Betrieb. Derselbe Zettel wie vor achtzehn Jahren, nur weißer.',
   use:'Ich drücke trotzdem. Es passiert, was seit achtzehn Jahren passiert.',g:{look:'Der ging nie. Wir sind immer gelaufen. Ich schneller.'}},
 {id:'stairs',name:'Treppe',exit:{to:'stiege5'},look:'Die Treppe. Grün gestrichen bis auf Schulterhöhe, darüber weiß. Neun Stockwerke.',
   g:{look:'Neun. Ich bin sie jeden Samstag gelaufen. Zum siebten. Dann wieder runter, mit ihm.'}},
 {id:'chair',name:'Stuhl',look:'Dragicas Stuhl neben dem Eingang, mit einem Kissen. Von hier aus sieht sie alles, was kommt und geht.',g:{look:'Sie hat mich nie gesehen. Sie hat alles gesehen.'}},
 {id:'birdcage',name:'Vogelkäfig',look:'Ein Kanarienvogel im Käfig. Dragica sagt, er heißt Tito. Er singt nur, wenn der Aufzug geht. Also nie.',g:{look:'Er sieht mich. Vögel sehen mich. Er sagt nichts.'}},
 {id:'radiator',name:'Heizkörper',look:'Ein Heizkörper. Darauf trocknen Handschuhe, die keinem gehören.',g:{look:'Warm.'}},
 {id:'domar_door',name:'Hausmeistertür',look:'Die Tür des Hausmeisters. „Domar“. Seit Jahren ohne Domar.',g:{look:'Dahinter ist es staubig und ruhig.'}},
 {id:'shelter_door',name:'Schutzraum',look:'Die Stahltür zum Schutzraum. Zu.',g:{look:'Da waren alle. Ich nicht. Ich war samstags woanders.'}},
 {id:'bell_button',name:'Klingel',look:'Die Klingel des Schutzraums. Keiner klingelt mehr.',g:{look:'…'}},
 {id:'stroller',name:'Kinderwagen',look:'Ein Kinderwagen unter der Treppe. Im siebten Stock wohnt jetzt eine Familie mit Zwillingen, sagt Dragica.',g:{look:'Neue Kinder. Gut.'}},
 {id:'lightswitch',name:'Lichtschalter',look:'Ein Lichtschalter mit Zeitschaltung. Man hat genau zwei Stockwerke Zeit, dann ist es dunkel.',use:'Klick. Zwei Stockwerke Licht. Für neun reicht es nie.',g:{look:'Im Dunkeln bin ich schneller.'}},
 {id:'plant',name:'Pflanze',look:'Ein Gummibaum, dem man ansieht, dass ihn alle gießen und keiner zuständig ist.',g:{look:'Er hat zu viel Wasser. Er ist trotzdem froh.'}},
 {id:'dragica',npc:'dragica',name:'Dragica',talk:function(A){ return M.k5TalkDragica?M.k5TalkDragica(A):A.m('Dragica.'); },look:'Dragica auf ihrem Stuhl, die Strickjacke über den Schultern, das Kreuzworträtsel auf den Knien. Sie hat es seit 1984 nicht zu Ende gelöst.',
   g:{look:'Sie hat mich nie gesehen. Sie hat jeden gesehen.'}},
 {id:'sehic',npc:'sehic',name:'Herr Šehić',talk:function(A){ return M.k5TalkSehic?M.k5TalkSehic(A):A.m('Herr Šehić.'); },look:'Herr Šehić, Strickjacke, Krawatte, Brille mit Hornrand. Der Hausrat. Er trägt die Krawatte auch sonntags.',
   g:{look:'Er schreibt alles auf. Mich hat er aufgeschrieben, als ich klein war: „Delić, Lana“.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },look:'Mama in der Eingangshalle. Sie sieht auf das Hausbuch, als stünde dort ihr Urteil.',
   g:{look:'Sie war hier. Jeden Tag, bis zweiundneunzig.'}}
];
M.room('haustor5',{ name:'Haus 7', scape:'k2_haustor', music:'k2_istraga',
  state:function(G){ return {shelterOpen:false,strollerGone:false}; },
  load:function(A){ var r=M.ROOMS['haustor5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var L=[], c=hallCast(G);
    if (c.indexOf('dragica')>=0){ var d=M.apos('haustor','dragica',[82,120,'R']); L.push({id:'dragica',ch:'dragica',x:d[0],y:d[1],f:d[2]||'R',name:'Dragica',idle:'sit',talk:'sitTalk',speechY:36}); }
    if (c.indexOf('sehic')>=0){ var s=M.apos('haustor','sehic',[264,113,'L']); L.push({id:'sehic',ch:'sehic',x:s[0],y:s[1],f:s[2]||'L',name:'Herr Šehić',speechY:46}); }
    if (jasnaFollows(G)) L.push({id:'jasna',ch:'jasnaC',x:122,y:118,f:'R',name:'Mama',idle:'waitF',speechY:46});
    return L; },
  hotspots:HS_HT,
  entries:{ neboder5:[24,130,'R'], stiege5:[180,107,'F'] },
  enter:async function(A,from){ if (M.k5HallEnter) await M.k5HallEnter(A,from); }
});

// ================================================================ Treppenhaus, siebter Stock
function satAt7(G){ return ph(G)==='k5_sat' && !f(G,'k5.sat.tickets'); }
var HS_SG=[
 {id:'down',name:'Treppe hinunter',exit:{to:'haustor5'},canExit:async function(A){ return M.k5StairsDown?await M.k5StairsDown(A):true; },look:'Die Treppe hinunter. Sieben Stockwerke.',g:{look:'Runter bin ich immer gerannt. Mit ihm an der Hand.'}},
 {id:'up',name:'Treppe hinauf',exit:{to:'stan5'},canExit:async function(A){ return M.k5StairsUp?await M.k5StairsUp(A):true; },look:'Die Treppe hinauf, zum neunten Stock. Zwei Stockwerke. Zwanzig Stufen pro Stockwerk.',
   g:{look:'Zum neunten. Zu Mama. Zwanzig Stufen. Vierzig.'}},
 {id:'door7',name:'Wohnungstür',look:function(A){ return A.m(A.S.open7?'Die Tür steht offen. Eine leere Wohnung, Licht vom Balkon, ein Geruch nach frischer Farbe. Am Türrahmen zur Küche Bleistiftstriche, „M“ und „A“.':'Unsere alte Tür. Gepolstert, mit braunem Kunstleder und Ziernägeln. Das Schild ist ab. Man sieht noch die zwei Löcher.'); },
   use:function(A){ return M.k5Door7?M.k5Door7(A):A.m('Zu.'); },open:function(A){ return M.k5Door7?M.k5Door7(A):A.m('Zu.'); },
   g:{look:'Hier habe ich geklopft. Zweimal kurz, einmal lang. Seine Mama hat aufgemacht. Immer seine Mama.',sense:function(A){ return M.k5Door7Sense?M.k5Door7Sense(A):A.g('Hier.'); }}},
 {id:'door7b',name:'Nachbartür',look:'Die Tür der Nachbarn. Ein Kranz aus Plastik und ein Schild: „Obitelj Begić“. Dahinter weinen Zwillinge, abwechselnd.',g:{look:'Neue Leute. Die Zwillinge sehen mich. Deshalb weinen sie nicht. Sie lachen. Dann weinen sie wieder.'}},
 {id:'lift',name:'Aufzugstür',look:'Die Aufzugstür im siebten Stock. „VAN FUNKCIJE“. Hier oben ist der Zettel noch der alte, gelb.',g:{look:'Ging nie.'}},
 {id:'window',name:'Treppenfenster',look:'Das Treppenhausfenster. Durch das Drahtglas sieht man den Hof, die Haltestelle, die Gleise der Drei.',g:{look:'Von hier habe ich die Drei kommen sehen. Dann bin ich los.'}},
 {id:'seven',name:'Stockwerknummer',look:'Eine große „7“ an der Wand, mit Schablone gemalt. Darunter hat ein Kind etwas eingeritzt. Ein Kind von heute.',g:{look:'Sieben.'}},
 {id:'bell',name:'Klingel',look:'Die Klingel neben unserer alten Tür. Sie geht nicht. Sie ging nie. Darum hat Lana geklopft.',g:{look:'Darum habe ich geklopft.'}},
 {id:'light',name:'Licht',look:'Eine Glühbirne an einem Draht. Sie brennt am Tag, weil sie nachts nicht brennt.',g:{look:'Licht.'}},
 {id:'mat',name:'Fußmatte',look:'Keine Fußmatte. Da, wo unsere lag, ist der Boden heller.',g:{look:'Da hat er seine Schuhe ausgezogen, wenn er zu spät war. Damit seine Mama ihn nicht hört.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },
   look:function(A){ return A.m(satAt7(A.G)?'Mama an der offenen Tür. Sie hat die Hand am Rahmen, als müsste sie ihn festhalten.':'Mama vor unserer alten Tür. Sie berührt sie mit der flachen Hand.'); },
   give:{ dose_lana:function(A){ return M.k5GiveTin7?M.k5GiveTin7(A):A.m('…'); } },
   g:{look:'Sie hat mir aufgemacht. Jeden Samstag.'}},
 {id:'sehic',npc:'sehic',name:'Herr Šehić',talk:function(A){ return M.k5TalkSehic?M.k5TalkSehic(A):A.m('Herr Šehić.'); },look:'Herr Šehić mit einem Schlüsselbund, an dem jeder Schlüssel ein Schildchen hat.',
   g:{look:'Er hat alle Schlüssel. Auch die, für die es keine Türen mehr gibt.'}}
];
M.room('stiege5',{ name:'Treppenhaus, siebter Stock', scape:'k2_haustor', music:function(G){ return ph(G)==='k5_sat'?'k2_mala':'k2_istraga'; },
  state:function(G){ return {open7:ph(G)==='k5_sat'}; },
  load:function(A){ var r=M.ROOMS['stiege5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var L=[], p=M.ART.stiege5&&M.ART.stiege5.actorPos||{};
    if (jasnaFollows(G)){ var j=p.jasna||[100,121,'R']; L.push({id:'jasna',ch:'jasnaC',x:j[0],y:j[1],f:j[2],name:'Mama',idle:'waitF',speechY:46}); var s=p.sehic||[192,121,'L']; if (f(G,'k5.p.sehicUp')) L.push({id:'sehic',ch:'sehic',x:s[0],y:s[1],f:s[2],name:'Herr Šehić',speechY:46}); }
    if (satAt7(G)){ var j2=p.jasna_door||[116,119,'L']; L.push({id:'jasna',ch:'jasnaC',x:j2[0],y:j2[1],f:j2[2],name:'Mama',idle:'waitF',speechY:46}); var s2=p.sehic||[192,121,'L']; L.push({id:'sehic',ch:'sehic',x:s2[0],y:s2[1],f:s2[2],name:'Herr Šehić',speechY:46}); }
    return L; },
  hotspots:HS_SG,
  enter:async function(A,from){ if (M.k5StairsEnter) await M.k5StairsEnter(A,from); }
});

// ================================================================ Nadas Wohnung, neunter Stock
function stanCast(G){ var p=ph(G);
  if (p==='k5_pro'||p==='k5_d1') return ['nada'];
  if (p==='k5_n1') return f(G,'k5.n1.eve')?(f(G,'k5.n1.kids')?['nada','zlata','vlado','ana','mia','niko']:['nada','zlata','vlado']):['nada'];
  if (p==='k5_d2'){ var L=['nadaK','zlataB']; if (f(G,'k5.s.engraved') && !f(G,'k5.s.mounted')) L.push('vlado'); return L; }
  if (p==='k5_d2_n') return f(G,'k5.meal.started')&&!f(G,'k5.n2.started')?['nada','zlata','vlado','jasna','ana','mia','niko','hajra']:[];
  if (p==='k5_sat') return f(G,'k5.sat.knock')?['nadaK','jasna']:['nadaK'];
  return []; }
var SPOS={ nada:[76,124,'R'], nadaK:[96,116,'L'], zlata:[132,126,'L'], zlataB:[150,116,'L'], vlado:[206,124,'L'], jasna:[118,128,'R'], ana:[230,124,'L'], mia:[186,128,'L'], niko:[204,128,'L'], hajra:[60,118,'R'] };
var SCH={ nada:'nada', nadaK:'nada', zlata:'zlata', zlataB:'zlata', vlado:'vlado', jasna:'jasna', ana:'ana', mia:'mia', niko:'niko', hajra:'hajra' };
var SNAME={ nada:'Nada', zlata:'Zlata', vlado:'Vlado', jasna:'Mama', ana:'Ana', mia:'Mia', niko:'Niko', hajra:'Hajra' };
function boardVis(S,G){ return f(G,'k5.n1.eve') && !f(G,'k5.s.mounted'); }
var HS_SN=[
 {id:'door',name:'Wohnungstür',exit:{to:'stiege5'},canExit:async function(A){ return M.k5StanExit?await M.k5StanExit(A):true; },
   look:'Die gepolsterte Wohnungstür. Innen hängt ein Kalender von einer Apotheke, aufgeschlagen beim März.',g:{look:'Die Tür. Hinter der habe ich acht Wochen gewartet, dass einer klopft.'}},
 {id:'board',name:'Zlatas Brett',vis:boardVis,r:[50,92,14,26],st:[60,122,'L'],look:'Zlatas Brett, an die Wand gelehnt, halb aus der Wolldecke gewickelt. Eingeschnitten, mit dem Taschenmesser: MALA · 15.1.1994.',
   use:'Ich fasse es nicht an. Es ist Zlatas. Und es ist Lanas.',g:{look:'Mein Name. Wie ich ihn gesagt habe.',sense:function(A){ return M.k5SenseBoard?M.k5SenseBoard(A):A.g('Holz.'); }}},
 {id:'table',name:'Tisch',look:function(A){ var p=ph(A.G); return A.m(p==='k5_d2_n'?'Der Tisch, ausgezogen auf die volle Länge. Pita, Sarma, Brot, Halva. Und Kaffee, immer Kaffee.':'Nadas Tisch mit dem Wachstuch. Darauf eine Liste in ihrer Handschrift: Blumen, Brot, Halva, Kaffee.'); },
   g:{look:'Mein Platz war links. Mama hat ihn nie besetzt.'}},
 {id:'kitchen',name:'Küche',look:'Nadas Küchenzeile. Die Džezva auf dem Herd, daneben eine zweite, kleinere. Für wen, sagt sie nicht.',use:function(A){ return M.k5StanKitchen?M.k5StanKitchen(A):A.m('Nadas Küche.'); },
   g:{look:'Sie kocht zwei Kaffee. Den zweiten trinkt sie kalt, abends.'}},
 {id:'radiator',name:'Heizkörper',look:'Der Heizkörper unter dem Fenster bullert. Nada hängt ein Handtuch drüber, damit die Luft nicht so trocken wird.',g:{look:'Warm.'}},
 {id:'tv',name:'Fernseher',look:'Ein Fernseher mit Häkeldecke. Er läuft ohne Ton. Ein Kochprogramm.',g:{look:'Sie lässt ihn laufen, damit es nicht so still ist.'}},
 {id:'sideboard',name:'Anrichte',look:'Die Anrichte. Gläser, die man nur zu Beerdigungen und Hochzeiten herausholt. Morgen werden sie herausgeholt.',g:{look:'Die guten Gläser. Für mich.'}},
 {id:'photo',name:'Foto',look:'Das Foto von Lana mit zwölf, die Haare zu kurz geschnitten, sie lacht trotzdem. Daneben eine Kerze, die heute nicht brennt.',g:{look:'Das war nach dem Friseur. Ich habe geweint. Dann gelacht. Mama hat das Lachen fotografiert.'}},
 {id:'calendar',name:'Kalender',look:'Der Apothekenkalender. Am dritten März ist ein Kreis. Am zweiten ein Kreuz. Am fünften steht „Vuković“.',g:{look:'Dritter März. Sie hat ihn jedes Jahr eingekreist.'}},
 {id:'balcony',name:'Balkontür',look:function(A){ return A.m(ph(A.G)==='k5_sat'&&F(A,'k5.sat.knock')?'Die Balkontür aus Glas, neben der Küche. Kalt, außen ein Rand von Frost. Nada steht am Herd, den Rücken zu uns.':'Die Balkontür, Glas in weißem Rahmen. Dahinter die Loggia mit Nadas Wäscheständer.'); },
   use:function(A){ return M.k5Balcony?M.k5Balcony(A):A.m('Kalt.'); },
   g:{look:'Glas. Auf Glas habe ich es acht Wochen versucht. Auf ihrem Spiegel.',draw:function(A){ return M.k5BalconyG?M.k5BalconyG(A):A.g('Klar. Da geht nichts.'); },drawIf:function(S,G){ return ph(G)==='k5_sat' && f(G,'k5.sat.knock') && !f(G,'k5.sat.drawn'); }}},
 {id:'view',name:'Fenster',look:'Das Fenster. Unten der Hof, die Gleise, das Glasdach der Haltestelle. Weiter hinten die Stadt.',g:{look:'Hier saß ich auf dem Fensterbrett. Acht Wochen. Von hier sieht man die Drei kommen.',sense:function(A){ return M.k5Sill?M.k5Sill(A):A.g('Mein Platz.'); }}},
 {id:'lana_door',name:'Tür zu Lanas Zimmer',look:function(A){ return A.m(A.S.lanaOpen?'Die Tür zu Lanas Zimmer steht offen. Nada lüftet jeden Tag. Auch heute.':'Die Tür zu Lanas Zimmer. Zu. Nada geht jeden Morgen hinein und macht das Fenster auf und wieder zu.'); },
   use:function(A){ return M.k5LanaDoor?M.k5LanaDoor(A):A.m('Zu.'); },open:function(A){ return M.k5LanaDoor?M.k5LanaDoor(A):A.m('Zu.'); },g:{look:'Meine Tür. Ich gehe durch. Ich muss nicht fragen.'}},
 {id:'lana_bed',name:'Bett',look:'Lanas Bett, mit einer Tagesdecke, auf der Sterne gestickt sind. Glatt gezogen. Jeden Tag glatt gezogen.',g:{look:'Darauf habe ich gelesen. Bücher, die Mama nicht kannte.'}},
 {id:'lana_desk',name:'Schreibtisch',look:'Lanas Schreibtisch. Stifte in einer Blechdose, ein angefangenes Bild: eine Straßenbahn auf einer Brücke, ohne Räder. Daneben eine graue Mappe.',
   read:function(A){ return M.k5ReadMappe?M.k5ReadMappe(A):A.m('Briefe.'); },open:function(A){ return M.k5ReadMappe?M.k5ReadMappe(A):A.m('Briefe.'); },
   g:{look:'Meine Stifte. Die Brücke ohne Räder. Die Räder hätte er machen sollen. Er konnte sie nicht.',sense:function(A){ return M.k5SenseMappe?M.k5SenseMappe(A):A.g('Papier.'); }}},
 {id:'drawings_l',name:'Zeichnungen',look:'Zeichnungen an der Wand: Straßenbahnen, eine nach der anderen, und in jedem Fenster ein Gesicht. Bei manchen hat einer Räder dazugemalt. Eiförmig.',
   g:{look:'Die eiförmigen sind von ihm. Er war zwölf. Er hat sich so angestrengt.'}},
 {id:'posters',name:'Plakate',look:'Plakate: Plavi orkestar, Dino Merlin, ein Pferd. Mit Reißzwecken, an den Ecken ausgebleicht.',g:{look:'Das Pferd war Mamas Idee. Die anderen meine.'}},
 {id:'wardrobe_l',name:'Kleiderschrank',look:'Ein Kleiderschrank. Ich mache ihn nicht auf.',g:{look:'Darin ist mein Wintermantel. Den habe ich nicht angehabt. Es war ja nicht weit.'}},
 {id:'lana_window',name:'Lanas Fenster',look:'Lanas Fenster. Nada hat es heute früh geöffnet und wieder geschlossen. Auf dem Fensterbrett ein Kaktus, der achtzehn Jahre überlebt hat, weil Kakteen das so machen.',g:{look:'Der Kaktus. Der ist von Baka. Er ist älter als ich. Und jünger.'}},
 {id:'postcard',name:'Postkarte',look:'Eine Postkarte über dem Bett: Dubrovnik, 1989. Auf der Rückseite: „Lana, more je toplo. Tata.“ Das Meer ist warm. Papa.',g:{look:'Papa. Am Meer. Er hat geschrieben, als wäre das Meer ein Mensch.'}}
].concat(Object.keys(SNAME).map(function(id){ return {id:id,npc:id,name:SNAME[id],talk:function(A){ return M.k5StanTalk?M.k5StanTalk(A,id):A.m('…'); },
  look:function(A){ return M.k5StanLook?M.k5StanLook(A,id):A.m(SNAME[id]+'.'); },
  give:{ dose_lana:function(A){ return M.k5GiveTinStan?M.k5GiveTinStan(A,id):A.m('Nicht hier.'); }, dose_voll:function(A){ return M.k5GiveCookies?M.k5GiveCookies(A,id):A.m('Später.'); },
    liste:function(A){ return A.m('Die Liste gehört zu Frau Kolar. Nicht hierher.'); } },
  g:{look:function(A){ return M.k5StanLookG?M.k5StanLookG(A,id):A.g('…'); },sense:function(A){ return M.k5StanSenseG?M.k5StanSenseG(A,id):A.g('…'); }}}; }));
M.room('stan5',{ name:'Nadas Wohnung', scape:'k2_stan', music:function(G){ var p=ph(G); return p==='k5_d2_n'?'vecer':(p==='k5_sat'?'k2_otkrice':(p==='k5_n1'?'k2_noc':'k2_mala')); },
  state:function(G){ return {lanaOpen:f(G,'k5.d1.lana')||ph(G)!=='k5_pro'&&ph(G)!=='k5_d1'}; },
  load:function(A){ var r=M.ROOMS['stan5']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ return stanCast(G).map(function(k){ var p=SPOS[k], id=k.replace(/K$|B$/,''); var sitting=(k==='nada'||k==='jasna'||k==='zlata'||k==='ana');
    return {id:id,ch:SCH[k],x:p[0],y:p[1],f:p[2],name:SNAME[id],idle:sitting?'sit':null,talk:sitting?'sitTalk':null,speechY:sitting?36:(id==='mia'||id==='niko'?30:46)}; }); },
  hotspots:HS_SN,
  entries:{ stiege5:[40,122,'R'] },
  enter:async function(A,from){ if (M.k5StanEnter) await M.k5StanEnter(A,from); }
});
})(M);
