/* ===== rooms/jschlaf.js — Mamas Schlafzimmer: der Schrank mit der verschlossenen Kiste (u4_kiste, „Nicht unsere Kiste“),
   das Hochzeitsfoto, der Pflegekittel. In der Christtagsnacht liest Mala allein durch den Deckel (Konzept 4.5, 7.3 A):
   Passierschein 1992, Rotkreuz-Nachricht 1993, Suchantrag 1994. Notizen z4_passierschein, z4_nachricht, z4_antrag (Malas
   Geheimnis bis zum Streit), Schalter k4.d1.box. Nachhall-Bilder M.mem.k4_kurve und M.mem.k4_kiste. ===== */
(function(M){
'use strict';
var NIGHTS=['k4_pro_n','k4_d1_n','k4_d2_n','k4_d4_n','k4_d5_n'];
function F(A,k){ return !!A.flag(k); }
function night(G){ return NIGHTS.indexOf(G.phase)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function readNight(G){ return G.phase==='k4_d1_n' && !!G.flags['k4.d1.dzezva']; }
// ---------------------------------------------------------------- Marko vor dem Schrank
async function boxLookM(A){ var G=A.G;
  if (G.phase==='k4_epi') return A.m('Oben im Schrank ist jetzt eine Lücke. Die Kiste steht in der Küche, offen.');
  if (!A.hasNote('u4_kiste')){ A.note('u4_kiste');
    await A.m('Oben im Schrank, hinter den Wollpullovern, eine Holzkiste mit einem kleinen Messingschloss.'); await A.wait(400); await A.m('Den Schlüssel trägt sie am Bund. Ich weiß es, ohne nachzusehen.');
    if (gHere(A)){ await A.wait(500); await A.g('Darin ist etwas, das spricht.'); await A.m('Mamas Kiste. Nicht meine. Nicht deine.'); await A.wait(600); await A.g('Ich lasse sie in Ruhe.'); }
    return; }
  return A.m(F(A,'k4.r.shared')?'Die Kiste. Ich weiß jetzt, was darin liegt. Ich mache sie trotzdem nicht auf. Das soll sie tun.':'Die Kiste im Schrank. Abgeschlossen. Mamas Kiste.'); }
// ---------------------------------------------------------------- Mala liest (Christtagsnacht)
async function readBox(A){ var G=A.G;
  if (F(A,'k4.d1.box')) return A.g(A.cycle('gBoxDone',['Ich habe gelesen. Ich lese nicht noch einmal.','Sie ist still jetzt. Für mich. Für sie nicht.']));
  if (!readNight(G)) return A.g(A.cycle('gBoxNo',['Das ist nicht meine Kiste.','Darin sprechen Stimmen. Nicht für mich.']));
  G.flags['mala.lock']=true;
  try{
    var w=M.apos('jschlaf','mala',[200,122,'L']); await A.walkG(w[0],w[1]); await A.faceG(w[2]||'L'); await A.wait(500);
    if (!F(A,'k4.d1.boxTry')){ A.setFlag('k4.d1.boxTry');
      await A.g('Das ist nicht meine Kiste.'); await A.wait(900); await A.g('Aber das ist auch nicht ihre Wahrheit allein.'); }
    else { await A.g('Er hat gesagt: frag nicht.'); await A.wait(600); await A.g('Er hat nicht gesagt: lies nicht.'); }
    // Analyse K4-B10 (P24): „(Nicht lesen.)“ war keine Wahl, die Kiste muss heute Nacht gelesen werden; die Antwort sagt jetzt, was sie ist: ein Aufschub
    var c=await A.choose([{t:'(Lesen.)',id:'read',silent:true},{t:'(Noch nicht.)',id:'no',silent:true}],{title:'Die Kiste',conv:false});
    if (c!=='read'){ await A.wait(400); await A.g(A.cycle('gBoxBack',['Nicht so. Nicht wie eine Diebin.','Noch nicht. Ihr Bett ist leer, und trotzdem ist sie überall im Zimmer.'])); return; }
    await readIt(A);
  } finally { G.flags['mala.lock']=false; } }
async function readIt(A){ var G=A.G; A.music('k4_duh');
  await A.narrate('Mala legt die Hand an die Schranktür. Durch das Holz, durch den Deckel. Papier, viele Lagen. Unten das Älteste.'); await A.wait(700);
  // 1. der Passierschein, Mai 1992
  A.sfx('paper');
  await A.doc({style:'ghost',title:'PROPUSNICA · Passierschein',lines:['Konvoj Sarajevo – Split, 14. 5. 1992','Vuković Jasna, 1953','Vuković Ana, 1984 (dijete · Kind)','','Ein Stempel. Eine Unterschrift. Ein Fleck,','der Kaffee sein kann oder etwas anderes.']});
  await A.g('Eine Frau und ein Kind. Ein Kind.'); await A.wait(500);
  await A.memory({title:'Nachhall – das Busfenster',tint:'ghost',draw:M.mem&&M.mem.k4_kurve,lines:[
    'Ein Bus, die Fenster voller Hände. Es riecht nach Diesel und nach Angst, die man nicht zeigen darf.',
    'Eine Frau, ein Mädchen auf dem Schoß. Sie sieht nicht nach vorn. Sie sieht zurück.',
    '„Zorane, gdje je Marko?“ – Zoran, wo ist Marko?',
    'Draußen ein Mann mit erhobener Hand. „Fahrt. Wir kommen nach.“',
    'Sie sieht zurück, bis zur Kurve. Dann ist da nur noch Fenster.']});
  A.note('z4_passierschein'); await A.wait(600);
  await A.g('Wir kommen nach.'); await A.wait(400); await A.g('Er hat „wir“ gesagt.'); await A.wait(800);
  // 2. die Nachricht vom Roten Kreuz, Mai 1993
  A.sfx('paper');
  await A.doc({style:'ghost',title:'Rotkreuz-Nachricht · Mai 1993',lines:['Von: Ruža, Vratnik, Sarajevo','An: Jasna Vuković, München','','„Zoran je otišao po vodu i nije se vratio.','Marko je kod mene, zdrav je. Ne brini.','Ruža.“']});
  await A.g('„Zoran ist Wasser holen gegangen und nicht zurückgekommen. Marko ist bei mir, er ist gesund. Mach dir keine Sorgen. Ruža.“');
  await A.wait(900);
  await A.memory({title:'Nachhall – Ružas Küche',tint:'ghost',draw:M.mem&&M.mem.k4_kiste,lines:[
    'Eine Küche in Vratnik. Kein Strom, eine Kerze in einer Untertasse.',
    'Eine alte Frau am Tisch, ein Formular vom Roten Kreuz, ein Kugelschreiber, der nicht schreiben will.',
    '„Napisat ću ‚poginuo‘.“ Ich schreibe: gefallen.',
    'Neben der Tür zwei Kanister. Blau, mit roter Schrift. Voll bis oben.',
    'Ein Junge steht neben ihr. Er hat noch die hohe Stimme. „Ne. Napiši ‚nije se vratio‘. Molim te.“',
    'Schreib: nicht zurückgekommen. Bitte.']});
  A.note('z4_nachricht'); await A.wait(1100);
  await A.g('Die Stimme.'); await A.wait(1000); await A.g('Ich kenne die Stimme.'); await A.wait(1400);
  // 3. der Suchantrag, 1994
  A.sfx('paper');
  await A.doc({style:'ghost',title:'DRK-Suchdienst · Suchantrag',lines:['Gesuchte Person: Vuković, Zoran, geb. 1951','vermisst seit: April 1993','Umstände: ist Wasser holen gegangen und nicht','zurückgekommen (laut Nachricht der Schwiegermutter)','','Antragstellerin: Jasna Vuković, München, Januar 1994']});
  await A.g('Vermisst.'); await A.wait(700); await A.g('Sie hat „vermisst“ daraus gemacht. Mit Stempel und Unterschrift.'); A.note('z4_antrag');
  A.setFlag('k4.d1.box'); await A.wait(1500);
  A.music('k4_nacht');
  // Analyse K4-B07 (P24): In der Christtagsnacht hat Mama Nachtdienst (jwohnung.js); vorher „atmete“ sie hier im Bett
  await A.narrate('Mala nimmt die Hand von der Schranktür. Das Bett ist leer, die gehäkelte Decke glatt gezogen. Mama ist im Nachtdienst.'); await A.wait(900);
  await A.g('Er hat gesagt: frag nicht.'); await A.wait(800); await A.g('Ich frage nicht.'); await A.wait(700); await A.g('Ich sage auch nichts.'); await A.wait(1100); await A.g('Noch nicht.'); }
M.k4ReadBox=readBox;
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Zur Wohnküche',exit:{to:'jwohnung'},look:'Die Tür zur Wohnküche. Von hier hört man den Kühlschrank.',
   g:{look:'Draußen schläft er. Oder er tut so.'}},
 {id:'wardrobe',name:'Kleiderschrank',look:function(A){ return A.m(A.G.phase==='k4_epi'?'Der Kleiderschrank. Oben fehlt etwas.':'Ein Kleiderschrank mit zwei Türen, Eiche furniert. Er riecht nach Mottenkugeln und nach ihr.'); },
   open:async function(A){ if (night(A.G)) return A.m('Nachts mache ich ihren Schrank nicht auf.'); A.sfx('creak'); await A.m('Pullover, nach Farben. Zwei Kittel. Oben eine Holzkiste.'); if (!A.hasNote('u4_kiste')) await boxLookM(A); },
   g:{look:function(A){ return A.g(readNight(A.G)&&!F(A,'k4.d1.box')?'Durch die Tür sehe ich sie. Oben, hinter den Pullovern. Sie ist voller Stimmen.':'Ein Schrank. Für mich ist er aus Glas.'); },
     sense:function(A){ return readBox(A); }}},
 {id:'box',name:'Kiste',look:boxLookM,
   open:function(A){ return A.m(A.G.phase==='k4_epi'?'Sie ist offen. In der Küche.':'Abgeschlossen. Und selbst wenn nicht: Mamas Kiste. Nicht meine.'); },
   take:'Nein. Die bleibt, wo sie steht, bis sie sie selbst herunterholt.',
   use:function(A){ return A.m('Nein. Nicht meine Kiste.'); },
   g:{look:function(A){ return readBox(A); },sense:function(A){ return readBox(A); },
     listen:function(A){ return A.g(F(A,'k4.d1.box')?'Still. Für mich ist sie still.':'Papier. Und darunter Stimmen, ganz leise, als redeten Leute in einem anderen Zimmer.'); }}},
 {id:'bed',name:'Bett',look:function(A){ return A.m(night(A.G)?(readNight(A.G)?'Das Bett ist leer. Mama ist im Nachtdienst.':'Mama schläft. Unter der gehäkelten Decke ist sie kleiner als am Tag.'):'Das Bett, glatt gezogen, die gehäkelte Decke darauf. Eine Seite ist benutzt. Die andere nie.'); },
   use:'Nein.',
   g:{look:function(A){ return A.g(night(A.G)?(readNight(A.G)?'Leer. Heute Nacht arbeitet sie. Die andere Hälfte lässt sie trotzdem frei.':'Sie schläft auf der Seite, zur Wand. Die andere Hälfte lässt sie frei.'):'An der einen Seite ein ruhiger Abdruck. Die andere Seite ist kalt. Seit dreiundneunzig.'); }}},
 {id:'nightstand',name:'Nachttisch',look:'Ein Nachttisch mit Lampe und einem kleinen Hochzeitsfoto im Silberrahmen: Mama mit Locken, Papa mit Schnurrbart, beide lachen über etwas außerhalb des Bildes.',
   take:'Das Foto nehme ich nicht. Das sieht sie jeden Abend als Letztes.',
   g:{look:'Sie lachen. Über den Fotografen, glaube ich. Er hatte einen Hut auf, der ihm zu groß war.'}},
 {id:'smock',name:'Pflegekittel',look:'Auf dem Stuhl ein hellblauer Kittel mit Namensschild: „Jasna V., Pflege“. Sorgfältig gefaltet.',
   take:'Den braucht sie für die Arbeit.',
   g:{look:'Ihr Kittel. Er riecht nach anderen Leuten, die sie wäscht und füttert und anlügt, wenn es sein muss.'}},
 {id:'window',name:'Fenster',look:function(A){ return A.m(night(A.G)?'Hinter dem Vorhang fällt Schnee im Laternenlicht.':'Ein Fenster zum Hof, mit einem Vorhang, den sie tagsüber nicht aufzieht.'); },
   open:'Nein. Es ist ihr Zimmer.',
   g:{look:'Hier sieht sie nie hinaus. Der Vorhang ist immer zu. Ich habe Staub in den Falten gezählt.'}}
];
M.room('jschlaf',{ name:'Mamas Schlafzimmer', scape:'k4_jschlaf',
  music:function(G){ return G.tod==='night'?'k4_nacht':'k4_wohnung'; },
  state:function(G){ return {}; },
  // Analyse K4-B07 (P24): nach dem Kaffee springt Mama zum Nachtdienst ein (97_k4_fam_a.js); dann ist das Bett leer (Bild: S.sleeper)
  actors:function(S,G){ S.sleeper=!readNight(G); return []; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (A.isMala()){ if (readNight(G) && A.first('gJsN')){ await A.narrate('Mamas Schlafzimmer, dunkel. Im Bett schläft sie, zur Wand gedreht. Der Schrank steht da wie jemand, der etwas weiß.'); await A.g('Sie schläft.'); await A.wait(400); await A.g('Ich bin leise. Ich bin immer leise.'); } return; }
    if (G.flags['mala.lock']) return;
    if (A.first('jsIn')) await A.narrate('Mamas Schlafzimmer. Schmal, ein Bett, ein Schrank, ein Nachttisch. Es ist das Zimmer von jemandem, der hier nur schläft.'); }
});
})(M);
