/* ===== rooms/antikvarijat.js — Jakobs Antiquariat: der Takvim von 1972, das Foto der Haltestelle, der Leser im Sessel, das Buch mit dem Bibliotheksstempel ===== */
(function(M){
'use strict';
var P=M.P;
function open(G){ return ['k2_s1','k2_s2','k2_s2_n'].indexOf(G.phase)>=0; }
function ivanHere(G){ return ['k2_s1','k2_s2','k2_s2_n'].indexOf(G.phase)>=0 && !G.flags['k2.s2.bookTaken']; }
// ---------------------------------------------------------------- Jakob
async function talkJakob(A){ var J=A.npc('jakob'), p=A.G.phase;
  await A.menuLoop(function(){ return [
    {t:'Haben Sie alte Takvime? Von 1972?',if:A.hasNote('s1_twosevens')&&!A.hasNote('s1_sunset'),once:'jk1',go:async function(A){ await J.say('Takvime! Endlich jemand, der nach etwas Vernünftigem fragt. Alle wollen Postkarten mit der Brücke.'); await J.say('Das Regal dort. Kalendari, takvimi, almanasi. Neunzehnhundert bis heute, mit Lücken. Die Lücken sind die Kriege.'); }},
    {t:'Sie haben in der Kiste alte Fotos.',once:'jk2',go:async function(A){ await J.say('Fotos von Leuten, die keiner mehr kennt. Ich verkaufe Erinnerungen nach Gewicht, mein Herr. Das Kilo zu zwanzig Mark.'); await J.say('Nehmen Sie eins, wenn Sie eins finden. Das erste ist gratis. Das zweite auch. Ich verdiene an den Büchern nicht, ich verdiene an der Einsamkeit.'); }},
    {t:'Was ist mit dem Buch in der Vitrine?',if:p!=='k2_s1',once:'jk3',go:async function(A){ await J.say('Rilke. Die „Duineser Elegien“, Insel-Verlag, erste Ausgabe 1923. Neunhundert Mark.'); await J.say('Seit ich es ausgestellt habe, spukt es hier.'); await A.m('Es spukt.'); await J.say('Ich bin Antiquar. Ich glaube an Bücher, nicht an Geister.'); await A.wait(600);
        await J.say('Aber nachts fallen Bücher aus den Regalen. Immer dieselben: Rilke, Hölderlin, ein deutsches Wörterbuch. Und die Türglocke läutet, wenn niemand kommt.'); A.note('s2_spook'); }},
    {t:'Sie hatten einen Brief aus Frankfurt?',if:p!=='k2_s1'&&!A.hasNote('s2_buyer'),go:async function(A){ await J.say('Ah, ja. Übersetzen Sie mir das, ich lese Deutsch wie ein Pferd Zeitung.'); await A.doc({style:'letter',title:'Antiquariat Brendel · Frankfurt am Main',lines:['Sehr geehrter Herr Kabiljo,','','wir bestätigen unser Interesse an Rilkes','„Duineser Elegien“ (1923) zum vereinbarten Preis.','Unser Kurier holt das Buch am Montag, dem','28. November, ab. Bitte halten Sie es bereit.','','Mit freundlichen Grüßen, H. Brendel']});
        await A.m('Ein Kurier holt es nächsten Montag ab. Der Preis gilt.'); await J.say('Gut. Dann ist der Spuk nächste Woche in Frankfurt. Sollen die Deutschen sich mit ihm herumschlagen.'); A.note('s2_buyer'); }},
    {t:'Was wissen Sie über die Nationalbibliothek?',if:A.hasNote('s2_stamp')||A.hasNote('s2_due'),once:'jk4',go:async function(A){ await J.say('Die Vijećnica. In der Nacht zum sechsundzwanzigsten August zweiundneunzig.'); await A.wait(700); await J.say('Sie haben die Bibliothek beschossen, mit Brandgranaten. Drei Tage hat es gebrannt. Anderthalb Millionen Bücher.');
        await J.say('Leute sind hineingelaufen, um Bücher herauszuholen. Unter Beschuss. Eine Bibliothekarin ist dabei gestorben.'); await A.wait(800); await J.say('Danach hat es über der ganzen Stadt geschneit. Schwarz. Seiten, die noch glühten.'); A.note('s2_fire'); }},
    {t:'Woher haben Sie das Buch?',if:A.hasNote('s2_stamp')&&!A.hasNote('s2_ledger'),go:async function(A){ await J.say('Woher? Aus einem Nachlass. Ich kaufe Nachlässe. Die Toten verkaufen gut.'); await J.say('Schauen Sie ins Ankaufbuch, wenn Sie es genau wissen wollen. Ich schreibe alles auf. Ich bin Antiquar, kein Hehler.'); A.setFlag('k2.s2.ledgerOk'); }},
    {t:'Das Buch gehört der Bibliothek.',if:A.hasNote('s2_provenance')&&!A.has('rilke')&&!A.flag('k2.s2.free'),go:function(A){ return jakobBook(A,J); }},
    {t:'Kann ich Ihre Kurrent-Tafel ausleihen?',if:A.flag('k2.s2.amraAsk')&&!A.has('kurrent')&&!A.flag('k2.s2.pass'),go:async function(A){ await J.say('Die Kurrent-Tafel? Wozu, um Himmels willen?'); await A.m('Die Restauratorin der Vijećnica hat eine Bauakte, die keiner lesen kann.'); await J.say('Für die Vijećnica.'); await A.wait(500); await J.say('Nehmen Sie. Bringen Sie sie wieder, oder bringen Sie mir eine Geschichte dafür.'); A.give('kurrent'); A.set('kurrentOff',true); A.rebuild(); }},
    A.askOpt({ s1_sunset:'Sechzehn Uhr sechzehn. Sie haben ein Talent für unwichtige Zahlen. Das mag ich.', s2_ivan:async function(A){ await J.say('Ein alter Mann mit runder Brille, im Sessel?'); await A.wait(700); await J.say('…So sah Professor Barać aus. Er hat in diesem Sessel gesessen, jeden Donnerstag, zwanzig Jahre lang. Bis zweitausenddrei.'); A.note('s2_obit',true); },
      s2_relic:'Eine Reliquie. Ja. Sein Sohn hat das auch gesagt, als er verkaufte. Er hat es nicht angesehen, als ich es einpackte.', s2_fragments:'Asche im Buch? Ich habe sie gesehen. Ich dachte, er hat Brandflecken gesammelt. Alte Männer sammeln seltsame Dinge.',
      m2_photo:'Alipašino Polje, achtundsiebzig, Haltestelle. Ein Fotoklub hat das gemacht. Der ganze Kasten ist aus einem Nachlass in der B-Phase.', s2_buyer:'Frankfurt. Sie zahlen gut. Bücher sind keine Menschen, mein Herr, Bücher darf man verkaufen.' },'Ich weiß viel. Darüber nicht.'),
    {t:'Danke, Gospodine Kabiljo.',bye:true,go:async function(A){ await J.say(A.cycle('jkBye',['Kommen Sie wieder. Bringen Sie Baklava mit, wie Hajra. Oder lassen Sie es, wie alle anderen.','Lesen Sie etwas Gutes.','Zu ist nur, was keiner aufmacht.'])); }}
  ]; }); }
async function jakobBook(A,J){ if (!A.hasNote('s2_relic')||!A.hasNote('s2_fragments')){ await J.say('Der Bibliothek? Es gab keine Bibliothek mehr, als er es behielt. Der Sohn hat es mir verkauft. Ich habe es bezahlt.'); await J.say('Bringen Sie mir einen Grund, Übersetzer. Einen, den ich dem Mann aus Frankfurt sagen kann.'); return; }
  await A.m('Er hat es am vierundzwanzigsten August ausgeliehen. Zwei Tage später brannte die Bibliothek. Er konnte es nicht zurückgeben, und er hat es nie verkauft.'); await A.m('Am Morgen nach dem Brand hat er auf seinem Balkon die Asche gefangen. Die verbrannten Seiten liegen im Buch. Er wollte der Bibliothek zurückgeben, was der Himmel ihm gegeben hat.');
  await A.wait(1100); await J.say('…'); await J.anim('read'); await J.say('Mein Vater hat Bücher aus dem Feuer getragen. Damals. Er hat sich die Hände verbrannt.'); await A.wait(900); await J.say('Ich bin Antiquar, kein Hehler.'); await A.wait(600);
  A.sfx('lock'); A.set('vitrineOpen',true); A.set('bookOut',true); A.give('rilke'); A.setFlag('k2.s2.bookTaken'); A.rebuild();
  await J.say('Nehmen Sie es. Dem Mann aus Frankfurt schreibe ich, das Buch sei an seinen Eigentümer zurückgegangen. Er wird es nicht verstehen. Er ist aus Frankfurt.'); A.save(); }
// ---------------------------------------------------------------- Ivan, der Leser
async function talkIvanG(A){ var I=A.npc('ivan'), p=A.G.phase;
  if (p==='k2_s1'){ if (A.first('ivS1')){ await I.say('Bitte. Ich lese.'); await A.g('Entschuldigung.'); await I.say('Junge Leute entschuldigen sich nicht mehr. Danke.'); return; } return I.say('Bitte. Ich lese.'); }
  A.found('ivan'); if (!A.hasNote('s2_ivan')) A.note('s2_ivan');
  await A.menuLoop(function(){ return [
    {t:'Was lesen Sie?',once:'iv1',go:async function(A){ await I.say('Rilke. Durch das Glas. Es ist nicht ideal, aber es ist mein Exemplar. Das heißt, das der Bibliothek.'); await I.say('Ich muss es zurückgeben. Die Frist läuft ab.'); A.note('s2_due'); }},
    {t:'Wann läuft die Frist ab?',once:'iv2',if:A.hasNote('s2_due'),go:async function(A){ await I.say('Am siebten September. Ich habe noch zwei Wochen. Und eine Zeile.'); await I.say('Ich übersetze die Elegien. Seit vierzig Jahren. Eine Zeile fehlt mir noch.'); }},
    {t:'Wer sind Sie?',once:'iv3',go:async function(A){ await I.say('Barać. Ivan. Germanist, pensioniert. Ich wohne an der Obala, Nummer vierzehn, zweiter Stock. Meine Leserkarte ist 2204.'); }},
    {t:'Die Bibliothek ist geschlossen, Professor.',if:A.hasNote('s2_fire')||A.hasNote('s2_noreturn'),go:async function(A){ I.agitate(2600); await I.say('Geschlossen. Ja. Wieder geschlossen. Heute auch.'); await A.wait(700); await I.say('Ich gehe jeden Tag hin. Ich lege das Buch auf die Theke. Und keiner nimmt es.'); A.setFlag('k2.s2.ivanDesk'); }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Takvim, Foto, Ankaufbuch
async function readTakvim(A){ if (!A.hasNote('s1_twosevens')){ return A.m('Alte Takvime: Gebetszeiten, Sonnenauf- und -untergänge, Feiertage. Für jedes Jahr ein Heft. Ich weiß nicht, wonach ich suchen soll.'); }
  if (!A.hasNote('s1_date')){ await A.m('Takvim 1972. Dreihundertsechsundsechzig Sonnenuntergänge, 1972 war ein Schaltjahr. Ohne den genauen Tag lese ich sie alle und weiß nichts.'); A.setFlag('k2.s1.takvimTried'); return; }
  await A.doc({style:'log',title:'TAKVIM ZA 1972. GODINU',lines:['NOVEMBAR','','12.  izlazak 6:42 · zalazak 16:18','13.  izlazak 6:43 · zalazak 16:17','14.  izlazak 6:45 · zalazak 16:16','15.  izlazak 6:46 · zalazak 16:15','','(zalazak = Sonnenuntergang)']});
  if (!A.hasNote('s1_sunset')){ A.note('s1_sunset'); await A.m('Vierzehnter November 1972: Sonnenuntergang um 16:16.'); } }
async function photoBox(A){ if (A.S.photoOut||A.has('photo_stop')) return A.m('Fotos von Hochzeiten, Schulklassen, Fußballmannschaften. Niemand, den ich kenne. Außer auf dem einen.');
  await A.m('Ich blättere. Hochzeiten, Schulklassen, eine Fußballmannschaft von 1964, ein Hund auf einem Motorrad.'); await A.wait(500); await A.m('Und dann …'); await A.wait(700);
  await A.m('Eine Haltestelle. Eine Straßenbahn. Dahinter ein Hochhaus mit einer Uhr auf dem Dach. Hinten gestempelt: „Alipašino Polje, 1987“.'); A.give('photo_stop'); A.set('photoOut',true); A.note('m2_photo');
  await A.m('Ich sehe es lange an. Die Uhr. Die Haltestelle. Ich weiß, dass ich da gestanden habe.'); if (A.G.malaOn){ await A.wait(600); await A.g('Zeig mal.'); } }
M.k2PhotoStopMala=async function(A){ if (A.hasNote('m2_f_voice')) return A.g('Halt dich fest. Ich höre es immer noch.');
  await A.g('…'); await A.wait(900); await A.memory({title:'Splitter',tint:'ghost',draw:M.mem&&M.mem.k2_voice,lines:['Ein Samstag, kurz nach elf. Die Drei hält an der Haltestelle unter der Uhr.','Ein Mädchen zieht einen kleinen Jungen an der Hand in den Wagen, im letzten Moment.','„Halt dich fest, Mali!“','Die Bahn ruckt an. Der Junge lacht.']});
  A.note('m2_f_voice'); await A.g('Halt dich fest, Mali.'); await A.wait(700); await A.g('Das war meine Stimme. Ich habe das gerufen.'); await A.m('Mali.'); await A.g('Kennst du das Wort?'); await A.m('Jeder kennt es. „Kleiner.“'); await A.g('Nein. Ich meine: Kennst du es?'); await A.m('…'); };
async function readLedger(A){ if (!A.flag('k2.s2.ledgerOk')) return A.m('Jakobs Ankaufbuch. Ohne seine Erlaubnis lese ich nicht darin. Ich kenne Leute, die für so etwas aus Läden geworfen werden. Mich zum Beispiel.');
  await A.doc({style:'log',title:'Knjiga otkupa 2004',lines:['12.III. Ostavština prof. I. B., Obala 14/II','        – 212 knjiga, njemačka i austrijska književnost','        – prodavač: P. Barać, Beč, tel. +43 1 …','        – među njima: Rilke, Duineser Elegien, Insel 1923','          (pečat NUB BiH, NE PRODAVATI?)']});
  await A.m('Nachlass Professor I. B., Obala 14. Verkauft von P. Barać, Wien, mit Telefonnummer.'); await A.m('Und neben dem Rilke, mit Bleistift, in Jakobs Schrift: „Stempel NUB BiH. Nicht verkaufen?“'); A.note('s2_ledger'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:{to:'ferhadija'},look:'Die Ladentür zur Passage. Die Glocke darüber hängt still.'},
 {id:'jakob',npc:'jakob',name:'Jakob',hgt:44,vis:function(S,G){ return open(G); },talk:talkJakob,
   look:'Ein schmaler alter Herr mit weißem Bart, Fliege und Lupe an der Schnur. Er sieht über die Brille, als würde er gleich den Preis meiner Seele schätzen.',
   give:{ photo_stop:'Jakob: „Behalten Sie es. Fotos gehören denen, die darauf etwas sehen.“', kurrent:async function(A){ if (!A.flag('k2.s2.pass')) return A.m('Die brauche ich noch.'); A.take('kurrent'); A.set('kurrentOff',false); A.rebuild(); await A.npc('jakob').say('Und die Geschichte?'); await A.m('Ein Bauamt von 1894 wollte wissen, wie tief man graben darf. Es durfte nicht tief.'); await A.npc('jakob').say('Sehr gut. Das ist eine Geschichte für einen Antiquar.'); },
     rilke:'Jakob: „Bringen Sie es dahin, wo es hingehört. Hierher gehört es nicht.“' },
   g:{look:'Er glaubt nicht an Geister. Er stellt dem Sessel trotzdem jeden Abend die Lampe an.',listen:async function(A){ await A.g('„Rilke, Rilke“, murmelt er. „Ich hätte dich nicht ins Fenster stellen sollen.“'); }}},
 {id:'ivan',npc:'ivan',name:'Leser',gname:'Professor Barać',hgt:40,vis:function(S,G){ return ivanHere(G); },talk:function(A){ return A.isMala()?talkIvanG(A):A.m('Ein leerer Sessel. Er ist kalt, als hätte gerade jemand daraufgesessen.'); },
   look:function(A){ return A.m(A.isFound('ivan')?'Ein alter Mann mit runder Brille im Lesesessel. Ich sehe ihn kaum, wie durch Dampf.':'Der Lesesessel. Leer.'); },
   g:{look:'Ein alter Mann, Tweedmantel, Schal. Er liest durch das Glas der Vitrine, als wäre es eine Seite.',talk:function(A){ return talkIvanG(A); }}},
 {id:'shelves',name:'Regale',look:'Regale bis unter die Decke, mit Leitern, die nirgends ganz hinreichen. Deutsch, Bosnisch, Russisch, Ladino, Französisch, alles durcheinander, und Jakob findet trotzdem alles.',
   g:{look:'Bücher, die überlebt haben. Sie riechen nach Kellern.',sense:'So viele Leser. Fast alle tot. Fast keiner festgehalten. Einer schon.'}},
 {id:'almanacs',name:'Takvime',look:'Ein Regal mit alten Kalendern und Takvimen, nach Jahren geordnet. Die Lücken sind die Kriege.',read:function(A){ return readTakvim(A); },use:function(A){ return readTakvim(A); },
   g:{look:'Sonnenuntergänge. Jemand hat sie alle aufgeschrieben, damit man weiß, wann man beten darf. Und wann man sich treffen kann.'}},
 {id:'vitrine',name:'Vitrine',look:function(A){ return A.m(A.S.bookOut?'Die Vitrine ist leer. Der rote Samt hat noch die Form des Buches.':'Eine Glasvitrine mit Messingbeschlägen. Darin, auf rotem Samt, ein altes Buch. „900 KM“.'); },open:'Abgeschlossen. Jakob trägt den Schlüssel an der Uhrkette.',
   g:{look:function(A){ return A.g(A.S.bookOut?'Leer. Endlich leer.':'Eine Leine aus Licht geht vom Sessel zum Buch. Er ist an das Buch gebunden.'); }}},
 {id:'book',name:'Buch',vis:function(S){ return !S.bookOut; },look:'Halbleder, an den Kanten abgestoßen. Auf dem Rücken ein Bibliotheksschild mit einer Nummer. Neunhundert Mark.',take:'Hinter Glas. Und es gehört nicht mir.',
   g:{look:async function(A){ if (A.hasNote('s2_stamp')) return A.g('Leser 2204. Rückgabe 7. September 1992.'); await A.g('Ich kann durch das Glas lesen. Und durch den Deckel.'); await A.g('Ein Stempel: „Narodna i univerzitetska biblioteka BiH“. Ein Leihzettel: „Leser 2204 – Rückgabe 7. IX 1992“.'); A.note('s2_stamp'); },
     sense:'Rauch. Ein Morgen voller Rauch, und zwei Hände, die etwas sehr Leichtes auffangen.'}},
 {id:'photobox',name:'Fotokiste',look:'Eine Holzkiste voller Fotos, Abzüge in allen Größen, Ecken abgegriffen. „1 KM“ auf einem Zettel.',use:function(A){ return photoBox(A); },open:function(A){ return photoBox(A); },take:function(A){ return photoBox(A); },
   g:{look:'So viele Gesichter. Sie sehen alle in die Kamera, als würde sie sie behalten.'}},
 {id:'newspapers',name:'Zeitungsbündel',look:'Zeitungen, mit Schnur gebündelt, nach Jahren. „Oslobođenje“ von 1945 bis gestern, mit Lücken.',
   read:async function(A){ if (!A.hasNote('s2_ivan')&&!A.flag('k2.s2.obitSensed')) return A.m('Tausende Seiten. Ohne zu wissen, wonach ich suche, lese ich nur Wetter.'); A.setFlag('k2.s2.obit'); A.rebuild();
     await A.doc({style:'news',title:'Oslobođenje · 14. II 2003',lines:['IN MEMORIAM','Prof. dr. Ivan Barać (1921–2003)','','Germanist, Übersetzer Rilkes und Hölderlins,','langjähriger Leser der Nationalbibliothek.','Er hinterlässt einen Sohn und eine','unvollendete Übersetzung der „Duineser Elegien“.']}); A.note('s2_obit'); await A.m('Gestorben zweitausenddrei. Eine unvollendete Übersetzung.'); },
   g:{look:function(A){ return A.g(A.flag('k2.s2.obit')?'Jetzt ist es nur noch Papier.':'Ein Bündel glimmt. Zweitausenddrei. Da ist Trauer drin.'); },sense:async function(A){ A.setFlag('k2.s2.obitSensed'); await A.g('Februar zweitausenddrei. Jemand hat eine Todesanzeige ausgeschnitten und wieder hineingelegt. Ein Sohn, glaube ich.'); }}},
 {id:'armchair',name:'Lesesessel',look:function(A){ return A.m(A.isFound('ivan')?'Der grüne Lesesessel, und in ihm, kaum sichtbar, der Professor.':'Ein abgewetzter grüner Lesesessel unter einer Stehlampe. Die Lampe brennt, obwohl niemand liest.'); },use:'Ich setze mich nicht. Der Sessel ist besetzt. Ich weiß nicht, woher ich das weiß.',
   g:{look:'Er sitzt da. Er sieht mich nicht. Er sieht nur das Buch.'}},
 {id:'desk',name:'Schreibtisch',look:'Jakobs Schreibtisch: eine Rechenmaschine, eine Lupe, eine Tasse mit kaltem Tee, das Ankaufbuch. Ein Foto von einem Mann mit verbundenen Händen.',
   g:{look:'Das Foto ist sein Vater. Er hat Bücher aus dem Feuer getragen.'}},
 {id:'ledger',name:'Ankaufbuch',look:'Ein dickes Buch: „Knjiga otkupa“. Was Jakob kauft, von wem, wann.',read:function(A){ return readLedger(A); },use:function(A){ return readLedger(A); },
   g:{look:'Er schreibt alles auf. Auch das, was er bereut.'}},
 {id:'bell',name:'Türglocke',look:'Eine Messingglocke an einer Feder über der Tür. Sie schwingt leicht, obwohl die Tür zu ist.',use:'Sie läutet. Jakob sieht nicht einmal auf.',
   g:{look:'Er läutet sie, wenn er geht. Jede Nacht. Damit jemand merkt, dass er geht.'}},
 {id:'kurrent',name:'Kurrent-Tafel',look:function(A){ return A.m(A.S.kurrentOff?'Ein heller Fleck an der Wand, wo die Kurrent-Tafel hing.':'Eine gerahmte Schrifttafel: „Deutsche Kurrentschrift“. Ein Alphabet, das aussieht wie Wellen.'); },take:'Jakob würde sie mir leihen, wenn ich einen Grund hätte.',
   g:{look:'Diese Schrift hat er auch geschrieben. Der Professor. Er hat sie geliebt.'}},
 {id:'maps',name:'Landkarten',look:'Alte Landkarten: Bosnien unter Österreich, Sarajevo 1914, Jugoslawien mit Bleistiftnotizen, ein Stadtplan von 1984 mit den olympischen Ringen.',g:{look:'Auf dem Plan von 1984 ist die Drei eingezeichnet. Mit einem roten Strich.'}},
 {id:'stove',name:'Ofen',look:'Ein kleiner Kanonenofen. Jakob heizt mit Zeitungen, die er nicht verkaufen kann.',g:{look:'Im Krieg haben sie hier Bücher verbrannt, um nicht zu erfrieren. Er hat nur die schlechten genommen. Sagt er.'}},
 {id:'window',name:'Schaufenster',look:'Das Schaufenster zur Passage. Draußen gehen Leute vorbei und sehen nicht herein.',g:{look:'Von außen sieht man nur Staub. Von innen die Welt.'}}
];
M.room('antikvarijat',{ name:'Antiquariat', scape:'k2_antik', music:function(G){ return G.phase==='k2_s1'?'k2_istraga':'k2_duh'; },
  state:function(G){ return {vitrineOpen:false,bookOut:false,kurrentOff:false,photoOut:false,spook:false}; },
  actors:function(S,G){ var L=[]; S.spook=G.phase!=='k2_s1'&&!G.flags['k2.s2.bookTaken'];
    if (open(G)){ var j=M.apos('antikvarijat','jakob',[230,118,'L']); L.push({id:'jakob',ch:'jakob',x:j[0],y:j[1],f:j[2]||'L',name:'Jakob',idle:'read',speechY:44}); }
    if (ivanHere(G)){ var v=M.apos('antikvarijat','ivan',[80,120,'R']), b=M.spot('antikvarijat','book'); L.push({id:'ivan',ch:'ivan',x:v[0],y:v[1],f:v[2]||'R',name:'Professor Barać',ghost:true,reveal:true,idle:'sitRead',speechY:40,anchor:b[2]?[b[0]+(b[2]>>1),b[1]+(b[3]>>1)]:null}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_s1' && A.first('k2anS1')){ await A.m('Ein Laden, in dem die Zeit nicht vergeht, sondern sich stapelt.'); }
    if (p==='k2_s2' && A.first('k2anS2')){ await A.m('Regen auf dem Schaufenster. Drinnen brennt die Lampe am Lesesessel, obwohl niemand liest.'); if (A.G.malaOn) await A.g('Doch. Da liest jemand.'); } }
});
})(M);
