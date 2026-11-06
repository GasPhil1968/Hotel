/* ===== 98_k4_intros_bhf.js — Kapitel 4, Bahnhof (S2): Vorstellungen der neuen Figuren („???“ bis zum ersten Gespräch):
   Frau Wimmer, die Kioskfrau, Toni und die Reisende in der Bahnhofsmission, Signor Enzo und der Mann mit der Zeitung, Herr Obermaier.
   Sepp stellt sich nicht vor; seinen Namen zeigt rooms/gleis11.js („???“, dann „Peppino“, dann „Giuseppe“).
   Dazu: Mala erzählt Marko, was sie allein gefunden hat, sobald beide wieder in einem Raum sind (Reaktionen über M.k4Queue),
   und die Reiseregel für die Städtischen Friedhöfe am Christtag (das Amt hat zu). ===== */
(function(M){
'use strict';
function eat(A,k){ A.first(k); }
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
Object.assign(M.INTRO,{
  wimmer:{auto:true, u:'Eine Frau um die sechzig hinter der Theke, grauer Bob, Lesebrille. Sie schenkt Tee aus einem Kessel, so groß wie ein Feuerlöscher.',
    m:async function(A){ var W=A.npc('wimmer'); eat(A,'wiHello'); await W.say('Grüß Gott. Tee? Der is umsonst. D’Plätzchen auch, solang’s welche gibt.'); await A.m('Danke. Marko Vuković.');
      await W.say('Wimmer. Bahnhofsmission.'); await W.anim('pour'); await W.say('Wenn S’ was brauchen, sagen S’ es. Wenn S’ nix brauchen, setzen S’ Ihnen trotzdem hin. Draußen is kalt.'); }},
  kioskg:{auto:false, u:'Eine Frau um die sechzig im Kiosk, blond gefärbtes Haar, hochgesteckt, Fingerhandschuhe. Sie liest und sieht trotzdem jeden.',
    m:async function(A){ var K=A.npc('kioskg'); eat(A,'kiHello'); await K.say('Grüß Gott. Zeitung, Brezn, Kaffee to go. Kaffee to go sagt ma jetzt, hat mei Enkel g’sagt.'); await A.m('Grüß Gott.');
      await K.say('Sie san ned vo do, gell? Des hör i an jedem Wort.'); await A.m('Aus Split.'); await K.say('Split! Do war i neunasiebzge. Schee war’s. Hoaß war’s.'); }},
  gast1:{auto:false, u:'Ein alter Mann mit grauem Vollbart und Wollmütze. Er hält seine Tasse mit beiden Händen.',
    m:async function(A){ var T=A.npc('gast1'); await T.say('Servus.'); await A.m('Servus. Marko.'); await T.say('Toni. Wenn d’Frau Wimmer fragt: I bin scho lang do. Des stimmt a.'); }},
  gast2:{auto:false, u:'Eine junge Frau in gelber Daunenjacke, neben sich ein großer Rucksack.',
    m:async function(A){ var J=A.npc('gast2'); await J.say('Hi. Ich bin nur auf der Durchreise.'); await A.wait(300); await J.say('Wie alle hier, oder?'); }},
  enzo:{auto:true, u:'Ein kleiner runder Mann hinter der Theke, Glatze mit weißem Haarkranz, dicke schwarze Brille, weißer Schnurrbart.',
    m:async function(A){ var E=A.npc('enzo'); eat(A,'enHello'); await E.say('Buongiorno! Entri, entri, fuori si gela.'); await A.m('Buongiorno.');
      await E.say('Italiano?'); await A.m('No. Ma lo parlo.'); await E.say('Bravo! Enzo Caruso. Come il tenore. Ma io canto solo quando perde la mia squadra.');
      await A.m('Enzo Caruso. Wie der Tenor, sagt er. Er singt nur, wenn seine Mannschaft verliert.'); await A.m('Piacere. Marko.'); }},
  gast3:{auto:false, u:'Ein sehr dünner alter Mann mit Hut und Mantel, hinter einer rosa Zeitung.',
    m:async function(A){ var O=A.npc('gast3'); await O.say('Mh.'); await A.wait(900); await A.m('Mehr sagt er nicht. Er blättert um, zum ersten Mal seit einer halben Stunde.'); }},
  obermaier:{auto:true, u:'Ein hagerer Mann am Schreibtisch, der Seitenscheitel wie mit dem Lineal gezogen, Lesebrille, Krawatte.',
    m:async function(A){ var O=A.npc('obermaier'); eat(A,'obHello'); await O.say('Obermaier. Städtische Friedhöfe, Bestattungen von Amts wegen. Haben Sie einen Termin?');
      await A.m('Nein. Marko Vuković. Frau Wimmer von der Bahnhofsmission …'); await O.anim('file'); await O.say('Frau Wimmer hat angerufen. Zweimal. Sie sind der Übersetzer.');
      await O.say('Setzen Sie sich. Der Stuhl wackelt, das ist Absicht. Dann bleibt keiner zu lange.'); }}
});

// ---------------------------------------------------------------- Reiseregel: am Christtag haben die Städtischen Friedhöfe zu
var ct0=M.canTravel;
M.canTravel=async function(A,L){ var G=A.G;
  if (M.chapterOf(G)===4 && L && L.id==='friedhof' && G.phase==='k4_d1'){ if (G.active==='mala') await A.g('Heute ist dort keiner. Heute ist Feiertag.'); else await A.m('Christtag. Da hat kein Amt offen. Ab Dienstag ist wieder jemand da.'); return false; }
  return ct0?ct0(A,L):true; };

// ---------------------------------------------------------------- Wiedersehen: Mala erzählt Marko, was sie allein gefunden hat
// Das Gerüst ruft Reaktionen im Leerlauf (M.K4REACT); hier wird nur vorgemerkt, sobald beide in einem Raum sind.
function together(G){ return !!(G.malaOn && G.pos.mala.room && G.pos.mala.room===G.pos.marko.room); }
function seppRoom(G){ return G.pos.marko.room==='gleis11'; }
var orc0=M.onRoomChange;
M.onRoomChange=function(G,id,from,o){ if (orc0) orc0(G,id,from,o); if (M.chapterOf(G)!==4 || !M.k4Queue) return;
  try{ if (!together(G)) return; var day=(M.K4_DAYS||[]).indexOf(G.phase)>=0;
    if (day && F(G,'k4.s.found') && !F(G,'k4.s.told') && !F(G,'k4.s.talk') && !seppRoom(G)) M.k4Queue('s4:told');
    if (day && F(G,'k4.s.bunker') && !F(G,'k4.s.bunkerTold')) M.k4Queue('s4:bunker');
    if (day && F(G,'k4.s.hall') && !F(G,'k4.s.hallTold')) M.k4Queue('s4:hall');
  }catch(e){ console.error(e); } };
function both(A){ return together(A.G) && A.malaHere(); }
M.K4REACT=M.K4REACT||{};
M.K4REACT['s4:told']=async function(A){ var G=A.G; if (F(G,'k4.s.told')||F(G,'k4.s.talk')||!both(A)) return; A.setFlag('k4.s.told');
  await A.g('Marko. Am Bahnhof. Am Ende von Gleis elf.'); await A.m('Was ist dort?');
  await A.g('Ein alter Mann mit einer Mütze. Er trägt Koffer, die keiner sieht. Er bietet es jedem an, und keiner bleibt stehen.');
  await A.wait(400); await A.g('Er redet drei Sprachen auf einmal. Ich verstehe keine.'); await A.m('Welche?');
  await A.g('Eine klingt wie die Durchsagen. Eine wie Musik. Und eine wie Fluchen.'); await A.wait(500); await A.m('Dann fahren wir hin.'); };
M.K4REACT['s4:bunker']=async function(A){ var G=A.G; if (F(G,'k4.s.bunkerTold')||!both(A)) return;
  if (M.k4BunkerTell) return M.k4BunkerTell(A);
  A.setFlag('k4.s.bunkerTold'); await A.g('Unter dem Gleis war einer mit einem Stempel. „Das schreibt keiner. Josef.“'); };
M.K4REACT['s4:hall']=async function(A){ var G=A.G; if (F(G,'k4.s.hallTold')||!both(A)) return; A.setFlag('k4.s.hallTold');
  await A.g('Der kurze Brief. Von neunundsiebzig.'); await A.wait(400); await A.g('Eine Frau sitzt an einem Küchentisch und schreibt. Sie weint. Und sie lächelt dabei.');
  await A.m('Beides?'); await A.g('Das geht. Ich habe es gesehen.'); };
})(M);
