/* ===== rooms/obala.js — die Miljacka: Milka auf der Bank, die Lateinerbrücke (schwarzer Schnee), Amra am Bauzaun, Ilija in der Nacht ===== */
(function(M){
'use strict';
var P=M.P;
function day(G){ return G.phase==='k2_s2'; } function night(G){ return G.phase==='k2_s2_n'; }
// ---------------------------------------------------------------- Milka
async function talkMilka(A){ var Mi=A.npc('milka');
  await A.menuLoop(function(){ return [
    {t:'Wohnen Sie hier?',once:'mk1',go:async function(A){ await Mi.say('Seit neunzehnhundertneunundvierzig. Zweiter Stock, Nummer vierzehn. Ich habe alles gesehen, was man von einem Balkon aus sehen kann.'); await Mi.say('Mehr, als man sehen sollte.'); }},
    {t:'Kannten Sie Professor Barać?',if:A.hasNote('s2_ledger')||A.hasNote('s2_obit')||A.hasNote('s2_ivan'),once:'mk2',go:async function(A){ await Mi.say('Ivan? Natürlich. Er hat gegenüber gewohnt, auf demselben Stock. Vierzig Jahre haben wir uns auf den Balkonen gegrüßt.');
        await Mi.say('Er hat mir Gedichte vorgelesen, auf Deutsch, über die Straße hinweg. Ich habe kein Wort verstanden. Es war das Schönste.'); }},
    {t:'Erinnern Sie sich an den August zweiundneunzig?',if:!!A.G.seen['dlg:mk2'],go:async function(A){ if (A.hasNote('s2_ash')){ await Mi.say('Ich habe es Ihnen erzählt. Ich erzähle es nicht noch einmal. Einmal ist genug für ein Leben.'); return; }
        await Mi.say('Die Nacht, in der die Bibliothek brannte.'); await A.wait(900); await Mi.say('Am Morgen hat es geschneit. Im August. Schwarzer Schnee. Seiten, die noch glühten, mit Buchstaben darauf. Sie sind auf die Balkone gefallen, auf die Straße, in den Fluss.');
        await Mi.say('Ivan stand auf seinem Balkon im Schlafanzug und hat sie gefangen. Mit beiden Händen. Wie ein Kind Schneeflocken.'); await A.wait(800); await Mi.say('Er hat sie in ein Buch gelegt, eine nach der anderen. Ich habe es gesehen. Er hat geweint und gelacht zugleich.'); A.note('s2_ash'); }},
    {t:'Warum füttern Sie die Tauben?',once:'mk3',go:async function(A){ await Mi.say('Weil sie im Krieg auch gehungert haben. Und keiner hat sie gefragt, auf welcher Seite sie stehen.'); }},
    A.askOpt({ s2_relic:'Wie eine Reliquie, ja. Er hat das Buch nie in die Hand genommen, ohne vorher die Hände zu waschen.', s2_stamp:'Leser 2204. Das stand auf seiner Tür. Er hatte die Leserkarte ans Türschild geklebt, wie einen Doktortitel.',
      s2_fire:'Ich habe das Feuer die ganze Nacht gesehen. Es war hell genug zum Lesen. Ich habe nicht gelesen.', s2_fragments:'Dann sind sie noch da. Die Seiten. Ich dachte, er hat sie verbrannt. Er war sehr ordentlich.',
      m2_f_snow:'Ein Mädchen auf der Brücke? Es waren viele Kinder auf der Brücke an dem Morgen. Sie haben die Seiten gefangen, als wäre es ein Spiel. Für sie war es eins.' },'Junger Mann, ich bin fünfundachtzig. Fragen Sie mich, was ich weiß, nicht was ich vergessen habe.'),
    ...M.k2Extra('milka',A,Mi),
    {t:'Danke, Gospođa Milka.',bye:true,go:async function(A){ await Mi.say('Gehen Sie mit Gott. Oder mit wem Sie wollen. Aber gehen Sie warm.'); }}
  ]; }); }
// ---------------------------------------------------------------- Amra und die Kurrent-Akte
async function talkAmra(A){ var Am=A.npc('amra');
  if (A.has('rilke') && A.has('pass')){ await Am.say('Sie haben das Buch? Das Buch aus der Bibliothek?'); await A.m('Es soll heute Abend zurück. Auf die alte Ausleihtheke.'); await Am.say('Dann kommen Sie nach sechs. Ilija lässt Sie mit dem Schein hinein.'); await Am.say('Und morgen bringe ich es der Nationalbibliothek. Mit einem Vermerk. Sie werden es nicht glauben.'); await A.wait(600); return M.k2StartS2Night(A); }
  await A.menuLoop(function(){ return [
    {t:'Kann ich in die Vijećnica?',once:'am1',go:async function(A){ await Am.say('Hinein? Das ist eine Baustelle. Helm, Schein, Versicherung. Und nachts lässt Ilija nicht einmal den Bürgermeister rein.'); await Am.say('Wir eröffnen sie in zwei, drei Jahren. Vielleicht. Wenn das Geld kommt.'); }},
    {t:'Was machen Sie hier?',once:'am2',go:async function(A){ await Am.say('Ich restauriere die Ornamente. Jedes Stück Stuck einzeln. Die Hälfte lag im Schutt, die andere Hälfte in Fotos von 1910.'); await Am.say('Und jetzt habe ich eine Bauakte von 1894 gefunden, in einer Kiste im Keller. Auf Deutsch. In dieser Schrift, die keiner mehr lesen kann.'); A.note('s2_kurrent'); A.setFlag('k2.s2.amraAsk'); }},
    {t:'Ich lese Kurrent. Mit einer Tafel.',if:A.flag('k2.s2.amraAsk')&&!A.flag('k2.s2.pass'),go:function(A){ return kurrentAkte(A,Am); }},
    A.askOpt({ s2_fire:'Die Nacht zum 26. August. Ich war sieben. Mein Vater hat mich auf den Balkon getragen und gesagt: Sieh hin, damit du es weißt. Ich habe hingesehen.', s2_provenance:'Ein Buch aus der alten Bibliothek? Davon gibt es fast keine. Wenn Sie eins haben, gehört es dem Land.',
      s2_desk:'Die Ausleihtheke? Die Reste stehen noch im Lichthof. Wir haben sie nicht weggeräumt. Keiner hat es fertiggebracht.' },'Das weiß ich nicht. Ich weiß nur Stuck.'),
    ...M.k2Extra('amra',A,Am),
    {t:'Viel Glück mit dem Stuck.',bye:true,go:async function(A){ await Am.say('Danke. Glück brauchen wir. Und Gips.'); }}
  ]; }); }
async function kurrentAkte(A,Am){ if (!A.has('kurrent')){ await Am.say('Eine Tafel? Haben Sie eine?'); await A.m('Ich weiß, wo eine hängt.'); await Am.say('Dann holen Sie sie. Ich warte hier. Ich warte immer hier.'); return; }
  await Am.say('Hier. Drei Wörter, die ich nicht lesen kann. Der Rest ist Zahlen.'); await A.doc({style:'faded',title:'Bauakte 1894 · Rathaus Sarajevo',lines:['… die ⟨Grnndmaner⟩ gegen die Miljacka','ist nicht tiefer als ⟨drei⟩ Meter zu führen,','da sonst das ⟨Gnnndwaſſer⟩ eindringt.','gez. Wittek, Architekt']});
  // Schriftvergleich statt Auswahlzeilen: die unsicheren Zeichen so lesen, wie Jakobs Tafel sie zeigt
  var U=['n','u','e'];
  var res=await A.glyphs({title:'Die Bauakte lesen',hint:'Unsichere Zeichen antippen und mit Jakobs Tafel vergleichen.',tableTitle:'Tafel',button:'Vorlesen',
    table:[{k:'e',lat:'e'},{k:'n',lat:'n'},{k:'u',lat:'u'},{k:'r',lat:'r'},{k:'s',lat:'ſ'},{k:'f',lat:'f'}],
    words:[[{c:'Gr'},{k:'u',o:U,ok:1},{c:'ndma'},{k:'u',o:U,ok:1},{k:'e',o:U,ok:2},{c:'r'}],[{c:'d'},{k:'r',o:['n','r'],ok:1},{k:'e',o:['n','e'],ok:1},{c:'i'}],[{c:'Gr'},{k:'u',o:U,ok:1},{c:'ndwa'},{k:'s',o:['f','ſ'],ok:1},{k:'s',o:['f','ſ'],ok:1},{c:'er'}]],
    check:function(rd){ var msg=['Amra: „Grnndmaner? Das klingt wie ein Husten.“ Auf der Tafel trägt das „u“ einen Bogen. Das „e“ ist kleiner als das „n“.','Amra: „Das ist doch eine Zahl, oder? Drn ist keine Zahl.“','Amra: „Waffer? Gibt es auf Deutsch Waffer?“ Das „f“ hat einen Querstrich, das lange „ſ“ nicht.'], W=this.words;
      for (var w=0;w<W.length;w++) for (var c=0;c<W[w].length;c++){ var cell=W[w][c]; if (cell.k && rd[w][c]!==cell.ok) return {ok:false,bad:w,msg:msg[w]}; } return {ok:true}; }});
  if (!res){ await Am.say('Überlegen Sie. Ich habe drei Jahre auf diese drei Wörter gewartet.'); return; }
  await A.m('„Die Grundmauer gegen die Miljacka ist nicht tiefer als drei Meter zu führen, da sonst das Grundwasser eindringt.“'); await Am.say('Drei Meter!'); await Am.say('Wir wollten fünf graben, für die Heizung. Sie haben uns gerade den Keller gerettet. Und mir die Stelle.');
  await A.wait(500); await Am.say('Was wollen Sie? Geld habe ich nicht. Ich bin Restauratorin.'); await A.m('Heute Abend in die Vijećnica. Für zehn Minuten.'); await A.wait(600);
  await Am.say('Heute Abend.'); await Am.anim('folder'); await Am.say('Ein Passierschein, nach achtzehn Uhr, in meiner Begleitung. Ich bin nicht dabei, aber das muss Ilija nicht wissen.'); A.give('pass'); A.setFlag('k2.s2.pass'); A.sfx('stamp'); A.save(); }
// ---------------------------------------------------------------- Ilija
async function talkIlija(A){ var I=A.npc('ilija');
  if (A.flag('k2.s2.free')) return I.say(A.cycle('ilF',['Fertig? Dann gehen Sie nach Hause. Es regnet.','Ich habe nichts gesehen. Ich sehe nachts nie etwas. Das ist mein Beruf.']));
  if (A.S.gateOpen) return I.say('Zehn Minuten. Ich zähle mit.');
  await A.menuLoop(function(){ return [
    {t:'Ich möchte hinein.',go:async function(A){ if (!A.has('pass')){ await I.say('Nein.'); await A.m('Nur kurz.'); await I.say('Nein. Kurz ist das, was alle sagen.'); return 'bye'; }
        await I.say('Schein.'); await A.animM('give'); await A.wait(700); await I.say('Begović. Nach achtzehn Uhr. In Begleitung.'); await I.say('Wo ist Ihre Begleitung?'); var c=await A.choose([{t:'Sie kommt nach.',id:'later'},{t:'Neben mir.',id:'mala'},{t:'Ehrlich gesagt: Sie kommt nicht.',id:'honest'}],{title:'Ilija'});
        if (c==='mala'){ await I.say('Neben Ihnen ist niemand.'); await A.wait(800); if (A.G.malaOn) await A.g('Doch.'); await I.say('…Ich sehe nachts schlecht.'); }
        else if (c==='honest'){ await I.say('Ehrlich. Das hat mir seit Jahren keiner gesagt.'); await I.say('Ich war Polizist. Ehrliche Leute lasse ich rein. Die anderen auch, aber ungern.'); }
        else await I.say('Natürlich kommt sie nach. Alle kommen nach.');
        A.set('gateOpen',true); A.sfx('gate'); await I.say('Zehn Minuten. Fassen Sie nichts an. Treten Sie auf nichts. Und wenn Sie etwas hören: Das ist die Plane.'); A.rebuild(); return 'bye'; }},
    {t:'Wie ist die Nachtwache?',once:'il1',go:async function(A){ await I.say('Ruhig. Ich spiele Schach gegen mich selbst. Ich gewinne immer.'); await A.wait(400); await I.say('Manchmal höre ich da drin Schritte. Und eine Glocke, wie in einer Bibliothek. Das ist die Plane.'); }},
    ...M.k2Extra('ilija',A,I),
    {t:'Gute Nacht.',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Die Uferstraße hinauf zur Stadt.',canExit:async function(A){ if (night(A.G) && A.has('rilke') && !A.flag('k2.s2.free')){ await A.m('Nicht mit dem Buch nach Hause. Es will zurück.'); return false; } return true; }},
 {id:'milka',npc:'milka',name:'Milka',hgt:36,vis:function(S,G){ return day(G); },talk:talkMilka,
   look:'Eine sehr alte Frau im braunen Mantel auf einer Bank, eine Tüte Brot auf dem Schoß. Um sie herum Tauben, wie ein Hofstaat.',
   give:{ rilke:async function(A){ var Mi=A.npc('milka'); await Mi.say('Ivans Buch.'); await A.wait(900); await Mi.say('Bringen Sie es weg von hier, bevor ich weine. Ich weine nicht mehr so gut wie früher.'); }, ashpage:'Milka: „Auch eins? Von damals? Dann waren Sie auch auf der Brücke. Oder jemand, der Sie kannte.“' },
   g:{look:'Sie füttert die Tauben, seit es nichts mehr zu füttern gab. Jetzt gibt es Brot. Sie hört trotzdem nicht auf.',listen:async function(A){ await A.g('„Ivan, Ivan“, sagt sie zu den Tauben. „Das Buch ist zurück in der Stadt. Ich spüre es in den Knien.“'); }}},
 {id:'amra',npc:'amra',name:'Amra',hgt:48,vis:function(S,G){ return day(G); },talk:talkAmra,
   look:'Eine junge Frau mit Bauhelm über den Locken und einer Mappe unter dem Arm, am Tor im Bauzaun. Sie sieht die Vijećnica an wie einen Patienten.',
   give:{ kurrent:function(A){ return kurrentAkte(A,A.npc('amra')); }, rilke:function(A){ return talkAmra(A); } },
   g:{look:'Sie kennt jedes Ornament mit Namen. Sie spricht mit ihnen, wenn keiner zuhört.'}},
 {id:'ilija',npc:'ilija',name:'Ilija',hgt:48,vis:function(S,G){ return night(G); },talk:talkIlija,
   look:'Ein massiger Mann in Wachjacke mit Thermoskanne vor dem Container. Er sieht aus wie jemand, der jede Nacht dieselbe Geschichte nicht glaubt.',
   give:{ pass:function(A){ return talkIlija(A); } }, g:{look:'Er hört die Schritte da drin. Jede Nacht. Er geht nie nachsehen. Das ist klug.'}},
 {id:'river',name:'Miljacka',look:'Die Miljacka. Flach, steinig, grün im Regen. Man könnte fast hindurchgehen. Im Sommer tun es die Kinder.',g:{look:'Sie ist so klein für so viele Brücken.'}},
 {id:'bridge',name:'Lateinerbrücke',look:'Die Lateinerbrücke. Stein, drei Bögen, über den Pfeilern runde Löcher, damit das Hochwasser hindurch kann. Hier hat einmal ein Krieg angefangen. Ein anderer.',
   g:{look:'Auf der Brücke haben Kinder etwas gefangen. Ich auch.'}},
 {id:'bridge_mid',name:'Brückenmitte',look:'Die Mitte der Brücke. Unten das Wasser, oben der Regen, dazwischen ich.',use:'Ich bleibe kurz stehen. Man bleibt auf Brücken immer kurz stehen.',
   g:{look:'Hier. Hier habe ich gestanden.',sense:async function(A){ if (A.hasNote('m2_f_snow')) return A.g('Ein schwarzes Blatt in meiner Hand. Warm. Ich habe es jemandem geschenkt.');
       await A.memory({title:'Splitter',tint:'ghost',draw:M.mem&&M.mem.k2_snow,lines:['Ein Morgen im August 1992. Über der Stadt fällt schwarzer Schnee.','Auf der Brücke stehen Kinder und fangen die Blätter, als wäre es ein Spiel.','Ein Mädchen mit Zopf fängt eins. Es glüht noch an den Rändern. Sie bläst es aus.','Sie liest, was darauf steht. Dann faltet sie es und steckt es ein. „Für Mali.“']}); A.note('m2_f_snow');
       await A.g('Ich habe auch eins gefangen. Ein schwarzes Blatt.'); await A.g('Ich habe es jemandem geschenkt.'); await A.m('Wem?'); await A.g('Jemandem, der Gedichte nicht mochte.'); }}},
 {id:'house14',name:'Obala 14',look:'Ein österreichisch-ungarisches Haus, vier Stockwerke, Stuck, Balkone mit Eisengeländern. Im Erdgeschoss eine Apotheke. An der Fassade kleine Narben, säuberlich verputzt.',
   g:{look:'Hier hat ein alter Mann gewohnt, der jeden Morgen um sieben Brot gekauft und es vergessen hat.'}},
 {id:'balcony',name:'Balkon',look:'Ein Balkon im zweiten Stock, mit einem leeren Blumenkasten. Die Tür dahinter ist zugemauert. Nein, nur zugeklebt.',g:{look:'Er hat hier gestanden. Im Schlafanzug. Mit offenen Händen.',sense:'Hände, die etwas auffangen. Lachen und Weinen zur selben Zeit.'}},
 {id:'bench',name:'Bank',look:function(A){ return A.m(day(A.G)?'Milkas Bank. Die Tauben wissen, wem sie gehört.':'Eine nasse Bank. Leer. Die Tauben schlafen.'); },g:{look:'Sie sitzt hier, seit es wieder Bänke gibt.'}},
 {id:'trees',name:'Platanen',look:'Platanen, kahl, mit Rinde wie Landkarten. Im Krieg hat man sie gefällt, um zu heizen. Diese hier sind nachgepflanzt.',g:{look:'Junge Bäume. Sie wissen nichts. Gut so.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne am Ufer. Ihr Licht fällt in den Fluss und wird davongetragen.',g:{look:'Licht auf Wasser. Das gibt es auch am Meer. Ich habe es gesehen.'}},
 {id:'tracks',name:'Gleise',look:'Die Gleise der Straßenbahn, glänzend im Regen. Die Drei fährt hier am Fluss entlang bis zur Schleife.',g:{look:'Die Drei. Hier ist sie immer schneller geworden. Weil es bergab ging.'}},
 {id:'vijecnica',name:'Vijećnica',look:'Die Vijećnica. Maurische Streifen, ocker und rot, Spitzbögen, Zinnen. Fast ganz unter Gerüst und grüner Plane. Das alte Rathaus. Danach die Bibliothek. Danach nichts. Bald wieder etwas.',
   g:{look:'Von innen leuchtet sie. Für mich.'}},
 {id:'scaffold',name:'Gerüst',look:'Gerüst bis unter die Zinnen, Bretter, Netze, ein Kran. Ein Schild: „Obnova uz podršku …“ und eine Reihe von Flaggen.',g:{look:'Sie bauen sie wieder auf. Stein für Stein. Die Bücher nicht.'}},
 {id:'fence',name:'Bauzaun',look:'Ein Bauzaun aus Gitter, mit Plakaten: wie die Vijećnica 1896 aussah, und wie sie bald aussehen soll.',g:{look:'Ich gehe da einfach durch. Das darf ich.'}},
 {id:'sign',name:'Schild',look:'„OBNOVA GRADSKE VIJEĆNICE“ – Wiederaufbau des Rathauses. „Ulaz zabranjen.“ Zutritt verboten.',read:'„Ulaz zabranjen. Gradilište.“ Baustelle. Darunter ein kleiner Zettel, mit der Hand geschrieben: „Knjige se vraćaju.“ Die Bücher kommen zurück.',g:{look:'„Die Bücher kommen zurück.“ Jemand hat das geglaubt.'}},
 {id:'gate',name:'Tor',exit:function(S){ return S.gateOpen?{to:'vijecnica'}:null; },gexit:{to:'vijecnica'},
   look:function(A){ return A.m(A.S.gateOpen?'Das Tor im Bauzaun steht offen. Dahinter Dunkel und Plane.':'Ein Tor im Bauzaun, mit Kette und Schloss.'); },open:async function(A){ if (A.S.gateOpen) return A.m('Offen.'); if (day(A.G) && A.has('rilke') && A.has('pass')) return talkAmra(A); await A.m(night(A.G)?'Abgeschlossen. Ilija hat den Schlüssel.':(A.has('pass')?'Abgeschlossen. Amra steht davor wie ein Wachhund mit Mappe. Den Passierschein muss ich ihr zeigen, nicht dem Tor.':'Abgeschlossen. Amra steht davor wie ein Wachhund mit Mappe.')); },
   with:{ rilke:function(A){ return (day(A.G)&&A.has('pass'))?talkAmra(A):A.m(night(A.G)?'Das Buch will hinein. Ilija hat den Schlüssel.':'Am Tag lässt mich Amra nicht hinein. Und ohne Schein schon gar nicht.'); }, pass:function(A){ return night(A.G)?talkIlija(A):talkAmra(A); } },
   g:{look:'Für mich ist hier kein Tor.'}},
 {id:'container',name:'Baucontainer',look:function(A){ return A.m(night(A.G)?'Der Container der Nachtwache. Drinnen ein Schachbrett und eine Heizplatte. Das Fenster ist beschlagen.':'Ein Baucontainer, abgeschlossen. Am Fenster ein Kalender mit einer Frau im Badeanzug, Juli 2009.'); },g:{look:'Drinnen spielt einer Schach gegen sich selbst. Er gewinnt immer. Er verliert immer.'}},
 {id:'hills',name:'Trebević',look:'Die Hügel im Süden, dunkel im Regen. Oben stand früher die Seilbahn. Ihre Masten stehen noch, ohne Kabine.',g:{look:'Von da oben haben sie geschossen. Jetzt gehen da Leute spazieren. Beides stimmt.'}}
];
M.room('obala',{ name:'Miljacka', scape:'k2_obala', music:function(G){ return night(G)?'k2_noc':'k2_istraga'; },
  state:function(G){ return {gateOpen:false}; },
  actors:function(S,G){ var L=[]; if (day(G)){ var m=M.apos('obala','milka',[150,122,'R']); L.push({id:'milka',ch:'milka',x:m[0],y:m[1],f:m[2]||'R',name:'Milka',idle:'feed',talk:'sitTalk',speechY:38}); var a=M.apos('obala','amra',[470,124,'L']); L.push({id:'amra',ch:'amra',x:a[0],y:a[1],f:a[2]||'L',name:'Amra',idle:'folder',speechY:46}); }
    if (night(G)){ var i=M.apos('obala','ilija',[520,122,'L']); L.push({id:'ilija',ch:'ilija',x:i[0],y:i[1],f:i[2]||'L',name:'Ilija',idle:'thermos',speechY:46}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ if (day(A.G) && A.first('k2obD')){ await A.m('Die Miljacka im Regen. Am anderen Ende der Uferstraße die Vijećnica, eingerüstet, als hätte jemand sie in Verbände gewickelt.'); }
    if (night(A.G) && A.first('k2obN')){ await A.narrate('Abend. Regen. Im Container der Nachtwache brennt Licht.'); if (A.G.malaOn){ await A.g('Er ist da. Er folgt dem Buch.'); await A.m('Wer?'); await A.g('Der Professor. Er geht hinter dir, seit wir aus dem Laden sind.'); } } }
});
})(M);
