/* ===== rooms/garaze.js — Garagen in der Lipova (früher Bratstva i jedinstva), Revision K3, Regel 2: B → A.
   Mit Mates kleinem Schlüssel (rote Sieben) und dem Straßennamen vom Kartenvergleich. Die Nummern über dem dritten und vierten Tor sind
   abgeblättert; Marko probiert an fremden Toren nicht herum (gegenüber schaut eine Frau aus dem Fenster). Mala sieht durch das Blech:
   im vierten Tor der helle Mercedes mit der Thermoskanne. Marko schließt auf, öffnet die Haube und nimmt die Batterie, die Mate jeden
   Winter abgeklemmt hat. Kata baut sie in den TAM (rooms/vulkanizer.js). ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; }
var MALA_SEES={ g1:'Drinnen ein Moped ohne Räder und Säcke mit Zement.', g2:'Ein kleines rotes Auto, sehr sauber. Jemand liebt es mehr als seine Frau.', g3:'Gerümpel. Ein Kinderwagen, Autoreifen, ein Fernseher mit einem Sprung.',
  g4:null, g5:'Leer. Nur ein Ölfleck in der Form von Afrika.', g6:'Holz für den Winter, bis unter die Decke.' };
var NUM={g1:'Vier',g2:'Fünf',g5:'Acht',g6:'Neun'};
async function doorLook(A,id){ var S=A.S;
  if (id==='g4' && S.g7open) return A.m('Garage sieben, offen. Drinnen der helle Mercedes. Es riecht nach Öl und kaltem Tee.');
  if (NUM[id]) return A.m('Ein Kipptor, über dem Tor eine '+NUM[id]+'. Ein Vorhängeschloss.');
  return A.m('Über diesem Tor ist die Nummer abgeblättert. Eine Sechs oder eine Sieben. Oder gar nichts mehr.'); }
async function doorKey(A,id){ var G=A.G, S=A.S;
  if (id==='g4' && S.g7open) return A.m('Sie ist offen.');
  if (NUM[id]) return A.m('Auf dem Tor steht eine '+NUM[id]+'. Der Schlüssel hat eine Sieben.');
  if (!F(G,'k3.b.g7')){ await A.m('Eine von den beiden abgeblätterten ist die Sieben. Welche, weiß ich nicht.'); await A.m('Und gegenüber steht eine Frau am Fenster und sieht her. Wenn ich an der falschen Garage herumschließe, ruft sie die Polizei.');
    if (G.malaOn && A.malaHere()){ await A.wait(400); await A.g('Ich sehe nach. Durch das Blech.'); } return; }
  if (id==='g3') return A.m('Nicht diese. Mala hat gesagt: die vierte.');
  A.sfx('click'); await A.wait(300); A.sfx('door'); A.S.g7open=true; A.set('g7open',true); A.setFlag('k3.b.garageOpen'); A.rebuild();
  await A.narrate('Der Schlüssel dreht sich, als hätte er gewartet. Das Kipptor schwingt nach oben, laut genug für die ganze Straße.');
  await A.m('Ein heller Mercedes, Baujahr um achtzig, an der Heckscheibe der Aufkleber eines Münchner Autohauses. Auf dem Armaturenbrett eine Thermoskanne.'); A.note('b3_car');
  if (G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Hier hat er gesessen. Mit dem Radio. Wenn Jela zu laut war.'); } }
async function malaDoor(A,id){ var G=A.G, S=A.S;
  if (id==='g4'){ if (S.g7open) return A.g('Seine Garage. Er hat hier gesessen und so getan, als würde er gleich losfahren.');
    await A.g('Drinnen steht ein helles Auto. Lang, mit runden Lampen.'); await A.wait(500); await A.g('Auf dem Armaturenbrett eine Thermoskanne.'); await A.wait(500); await A.g('Seine.'); A.setFlag('k3.b.g7');
    if (G.pos.marko.room==='garaze'){ await A.wait(300); await A.m('Die vierte. Das ist die Sieben.'); } return; }
  return A.g(MALA_SEES[id]); }
function doorHS(i){ var id='g'+i; return {id:id,name:function(S,G){ return (i===4&&S.g7open)?'Garage sieben':'Garagentor'; },look:function(A){ return doorLook(A,id); },
  open:function(A){ var S=A.S; if (id==='g4' && S.g7open) return A.m('Offen.'); return A.has('kljuc_garaza')?doorKey(A,id):A.m('Abgeschlossen. Ein Vorhängeschloss.'); },
  use:function(A){ return A.room.byId[id].open(A); },
  with:{ kljuc_garaza:function(A){ return doorKey(A,id); }, odvijac:'Ein Schraubenzieher an einem fremden Garagentor, am Sonntagvormittag, unter den Augen der Nachbarin. Nein.' },
  g:{look:function(A){ return malaDoor(A,id); }}}; }
async function hoodOpen(A){ var S=A.S; if (!S.g7open) return; if (S.hood) return A.m('Die Haube ist offen.');
  A.sfx('click'); A.S.hood=true; A.set('hood',true); A.rebuild(); await A.m('Die Fahrertür ist nicht abgeschlossen. Ich ziehe den Hebel unter dem Armaturenbrett, und die Haube springt einen Fingerbreit auf. Dann ganz.');
  if (!S.batTaken) await A.m('Die Batterie sitzt links, ein schwarzer Kasten. Die Klemmen liegen daneben, abgezogen und mit einem Lappen umwickelt.'); }
async function batTake(A){ var S=A.S, G=A.G; if (!S.g7open) return; if (!S.hood) return A.m('Erst die Haube.'); if (S.batTaken) return A.m('Die Batterie habe ich.');
  await A.reach(); A.S.batTaken=true; A.set('batTaken',true); A.give('akumulator'); A.setFlag('k3.b.batFrom','mate'); A.sfx('keyDrop'); A.rebuild();
  await A.m('Die Klemmen sind schon ab. Er hat sie jeden Winter abgeklemmt, damit sie nicht leer wird. Das kleine grüne Auge oben drauf sagt: voll.'); await A.m('Schwer wie ein Kind.');
  if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Er hat sie geschont. Für eine Fahrt, die er nicht gemacht hat.'); await A.wait(400); await A.g('Jetzt macht sie eine.'); } }
var HS=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},look:'Die Straße zurück, am Bahndamm entlang.',g:{look:'Weg hier. Zu den anderen.'}},
 {id:'sign',name:'Straßenschild',look:'Ein neues blaues Schild: LIPOVA. Darunter, an derselben Stange, ein altes Emailschild, halb mit grauer Farbe überstrichen. Vorn ist noch zu lesen: BRATST… Jemand hat den alten Namen nicht ganz zugestrichen.',
   read:'LIPOVA. Und darunter, halb überstrichen: BRATSTVA I JEDINSTVA.',g:{look:'Zwei Namen übereinander. Der alte schaut unter der Farbe hervor. Wie bei mir.'}},
 {id:'woman',name:'Frau am Fenster',look:'Gegenüber im ersten Stock eine Frau im Morgenmantel, die Arme auf dem Fensterbrett. Sie sieht her. Sie sieht hier alles.',g:{look:'Sie langweilt sich. Wir sind heute ihr Fernsehen.'}},
 doorHS(1), doorHS(2), doorHS(3), doorHS(4), doorHS(5), doorHS(6),
 {id:'car',name:'Mercedes',vis:function(S){ return !!S.g7open; },look:'Mates Mercedes. Beige, rund, mit Chrom. Die Reifen haben Luft, die Sitze sind mit Handtüchern abgedeckt. Auf dem Armaturenbrett die Thermoskanne.',
   use:'Ich fahre nicht mit dem Auto eines Toten durch Mostar. Ich brauche nur, was unter der Haube ist.',open:function(A){ return hoodOpen(A); },
   g:{look:'Er ist nie mehr gefahren. Er hat nur darin gesessen.',sense:'Tee. Radio. Ein Mann, der wartet, bis es dunkel ist, damit keiner fragt, wo er war.'}},
 {id:'hood',name:'Motorhaube',vis:function(S){ return !!S.g7open; },look:function(A){ return A.m(A.S.hood?(A.S.batTaken?'Die Haube ist offen. Wo die Batterie saß, ist jetzt ein sauberes Rechteck im Staub.':'Die Haube ist offen. Links die Batterie, die Klemmen abgezogen.'):'Die Motorhaube, blank geputzt.'); },
   open:function(A){ return hoodOpen(A); },use:function(A){ return hoodOpen(A); }},
 {id:'battery',name:'Batterie',vis:function(S){ return !!S.g7open && !!S.hood && !S.batTaken; },look:'Eine Autobatterie, zwölf Volt, achtundachtzig Amperestunden. Oben ein kleines grünes Auge. Die Pole sauber mit Fett eingeschmiert.',
   take:function(A){ return batTake(A); },use:function(A){ return batTake(A); }},
 {id:'thermos',name:'Thermoskanne',vis:function(S){ return !!S.g7open; },look:'Mates Thermoskanne auf dem Armaturenbrett. Rot, mit einem Sprung im Deckel. Zdravko hat gesagt, er hatte immer eine dabei.',take:'Die bleibt hier. Die gehört zu ihm, nicht zu mir.',
   g:{look:'Leer. Aber sie riecht noch nach Tee.'}},
 {id:'calendar',name:'Kalender',vis:function(S){ return !!S.g7open; },look:'Ein Kalender einer Reifenfirma an der Seitenwand. Aufgeschlagen: März 2010. Am Vierzehnten ein Kreis mit Kugelschreiber.',
   read:'März 2010. Der Vierzehnte, ein Sonntag, eingekreist.',g:{look:'Der Kreis. Da wollte er fahren.'}}
];
M.room('garaze',{ name:'Lipova (Garagen)', scape:'k3_vhof', music:function(G){ return 'k3_istraga'; },
  state:function(G){ return {g7open:false,hood:false,batTaken:false}; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G; if (A.isMala()) return;
    if (A.first('grIn')){ await A.narrate('Eine Reihe Garagen unter einer Betonplatte, dahinter der Bahndamm. Am Pfosten ein neues blaues Schild. Darunter schaut ein altes hervor.');
      if (G.malaOn && A.malaHere()) await A.g('Bratstva i jedinstva. Das steht da noch. Halb.'); } }
});
})(M);
