/* ===== 08_sense.js — Analyse P21 (Kann-Liste, Muster 1): „Spüren“ an mehr Stellen.
   Bisher bot das Menü Mala „Spüren“ nur dort an, wo ein Nachhall wartet; das Angebot hieß also „hier ist etwas“.
   Jetzt steht es auch an alltäglichen Dingen, die selbst kein Rätsel tragen (Bänke, Tische, Fenster, Türen, Fotos …),
   mit kurzen, festen Leertexten in Malas Stimme. Nicht an Ausgängen, Figuren, Dingen mit eigener Handlung
   (für Marko oder Mala) und nie an Orten oder Dingen, an denen ein „hier ist nichts“ erzählerisch falsch wäre:
   Malas Zuhause und Haus, die Straßenbahn, Vermisstenstelle und Institut, Friedhöfe, Ivkas Mole, Mates Haus. ===== */
(function(M){
'use strict';
// Art des Dings nach seinem Namen; die erste passende Art gilt
var KINDS=[
  ['seat',   /^(Bank|Steinbank|Wartebank|Stuhl|Stühle|Sessel|Lesesessel|Sofa|Couch|Klappstuhl|Schemel|Sitz|Besucherstuhl|Besucherstühle|Stuhlreihen)\b/],
  ['window', /^(Fenster|Fensterchen|Treppenfenster|Treppenhausfenster|Bürofenster|Hohe Fenster|Caféfenster|Fensterbrett|Fensterläden)\b/],
  ['door',   /^(Tür\b|Nachbartür|Hausmeistertür|Balkontür|Gartentor|Klingel|Klingeln|Klingelknopf|Türglocke|Briefkasten|Briefkästen|Fußmatte|Geländer|Handlauf|Treppe|Stufen)/],
  ['picture',/^(Foto|Fotos|Alte Fotos|Fotowand|Tanzfoto|Mannschaftsfotos|Schiffsfotos|Bilder|Heiligenbild|Postkarte|Zeichnungen)\b/],
  ['paper',  /^(Kalender|Wandkalender|Gästebuch|Hausbuch|Telefonbuch|Zeitung|Zeitungen|Formular|Formulare|Aushänge|Pinnwand|Schwarzes Brett)\b/],
  ['device', /^(Uhr|Wanduhr|Standuhr|Bahnhofsuhr|Radio|Telefon|Grammofon|Fernseher|Anrufbeantworter|Funkgerät|Lampe|Schreibtischlampe|Glühbirne|Lichtschalter)\b/],
  ['furniture',/^(Tisch|Tische|Schreibtisch|Nachttisch|Lesetisch|Fenstertisch|Kartentisch|Werkbank|Ladentisch|Theke|Tresen|Pult|Anrichte|Kredenz|Schrank|Kleiderschrank|Aktenschrank|Regal|Regale|Bücherregal|Vitrine|Wandbord|Garderobe|Garderobenhaken|Spiegel|Herd|Ofen|Kaffeeherd|Küchenzeile|Kochecke|Teppich|Kelims)\b/],
  ['thing',  /^(Tassen|Zwei Tassen|Kaffeetassen|Džezve|Džezva|Kaffeedose|Aschenbecher|Gießkanne|Wassergläser|Glas Wasser|Kisten|Schuhkarton|Spielsachen|Kinderwagen|Nähkorb|Tücher|Tuch|Schlitten|Ruder|Werkzeug|Leiter|Amboss|Netze|Fischkisten|Vogelkäfig|Tabletts|Kupfertabletts|Kupferteller)\b/]
];
var NEVER=/Lana|Mala|Grab|Gräber|Urne/;   // Malas eigene Dinge und die Toten: dort darf kein „nichts“ stehen
var NO_ROOMS={ stan:1, stan5:1, kuca:1, kuca5:1, haustor:1, haustor5:1, stiege5:1, neboder:1, neboder5:1, skloniste:1, tramvaj:1, tramvaj5:1, carsija5:1,
  institut:1, vermisst:1, bare:1, riva:1, zelenika_in:1 };
var LINES={
  seat:   ['Hier haben viele gesessen. Keiner ist geblieben.','Warm von vielen. Niemand Bestimmtes.','Nur Warten. Fremdes Warten, schon kalt.'],
  window: ['Viele haben hier hinausgesehen. Keiner ist geblieben.','Glas merkt sich nichts. Nur die Kälte.'],
  door:   ['Viele Hände. Keine, die noch etwas will.','Kommen und Gehen. Sonst nichts.'],
  picture:['Gesichter. Aber ihr Nachhall ist nicht hier.','Nur Papier und Licht. Die Leute darauf sind woanders.'],
  paper:  ['Nur Tinte. Keiner hat sich hineingelegt.','Wörter, aber kein Nachhall.'],
  device: ['Viel ist hindurchgegangen. Nichts ist geblieben.','Es zählt nur. Es merkt sich nichts.'],
  furniture:['Gebraucht, jeden Tag. Aber nichts, was hängen bleibt.','Da ist nichts. Kein Nachhall.','Kalt, aber leer.'],
  thing:  ['Benutzt und vergessen. Sonst nichts.','Es gehört jemandem. Aber der ist nicht darin.','Kalt, aber leer.']
};
function nameOf(hs){ return typeof hs.name==='string'?hs.name:''; }
function kindOf(hs){ var nm=nameOf(hs); if (!nm || NEVER.test(nm)) return null; for (var i=0;i<KINDS.length;i++) if (KINDS[i][1].test(nm)) return KINDS[i][0]; return null; }
var MARKO_VERBS=['talk','take','open','use','push','read','give'], MALA_VERBS=['talk','sense','listen','draw','cross'];
// ein Ding ohne eigene Handlung, für keine der beiden Figuren
M.senseNeutral=function(hs,roomId){ if (!hs || hs.exit || hs.gexit || hs.npc || hs.noSense || hs.who==='m' || NO_ROOMS[roomId]) return false;
  var g=hs.g||{}; for (var i=0;i<MALA_VERBS.length;i++) if (g[MALA_VERBS[i]]!==undefined) return false;
  for (i=0;i<MARKO_VERBS.length;i++) if (hs[MARKO_VERBS[i]]!==undefined) return false;
  return !!kindOf(hs); };
// fester Satz je Ding (Raum und Hotspot entscheiden), damit es wie geschrieben wirkt und beim zweiten Mal gleich bleibt
M.senseLine=function(hs,room){ var L=LINES[kindOf(hs)]||LINES.thing, k=(room&&room.id||'')+':'+(hs.id||''), h=0; for (var i=0;i<k.length;i++) h=(h*31+k.charCodeAt(i))|0; return L[Math.abs(h)%L.length]; };
M.SENSE_LINES=LINES;
})(M);
