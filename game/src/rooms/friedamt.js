/* ===== rooms/friedamt.js — Städtische Friedhöfe, Verwaltung: Herr Obermaier und die Akte „unbekannter Mann, ca. 70“.
   In der Mütze lag ein Gepäckträgerausweis: „Josef Rugiero, Gepäckträger Nr. 17“ (s4_ausweis). Bestattung von Amts wegen am
   Donnerstag (s4_termin). Mit dem richtigen Namen sucht er neu („Für uns ist das ein neuer Mensch.“), mit Carmelas Wunsch sagt er
   die Bestattung ab (k4.s.amtOff). Am Christtag ist das Amt zu (98_k4_intros_bhf.js, Reiseregel). ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
var OPEN=['k4_d2','k4_d3','k4_d4','k4_d5'];
function rid(A){ return A.room?A.room.id:''; }
function here(A){ return !!(A.G.malaOn && A.G.pos.mala.room===rid(A)); }
function markoHere(A){ return A.G.pos.marko.room===rid(A); }
function alone(A){ return A.G.active==='mala' && !markoHere(A); }
function askOpt(title,also,table,fb){ return {t:'Nach etwas aus dem Notizbuch fragen …',silent:true,noGray:true,go:async function(A){
  var id=await A.askNote(title,{also:also}); if (!id) return; var h=table[id]; if (h===undefined) h=fb; if (typeof h==='function') return await h(A,id); }}; }
// ---------------------------------------------------------------- Die Akte (s4_ausweis, s4_termin)
async function file(A,O){ var G=A.G; if (N(G,'s4_ausweis')) return O.say('Josef Rugiero, Nummer siebzehn. Sonst haben wir nichts. Und Rugiero gibt es nicht.');
  await O.anim('file'); await O.say('Der unbekannte Mann vom sechzehnten Dezember. Etwa siebzig. Hauseingang in der Schillerstraße.');
  await O.say('Keine Papiere, kein Geld, kein Schlüssel. Nur die Mütze.'); await A.wait(500);
  await O.say('Und in der Mütze, hinter dem Futter, das hier.');
  await A.doc({style:'register',title:'DEUTSCHE BUNDESBAHN',lines:['Gepäckträgerausweis Nr. 17','Bahnhof München Hbf','','Name: Rugiero, Josef','geb.: 1939','','gültig bis 31.12.1986','(Lichtbild, fast weiß)']});
  await O.say('Josef Rugiero, Gepäckträger Nummer siebzehn. Seit fünfundzwanzig Jahren ungültig. Er hat ihn trotzdem getragen. In der Mütze, am Kopf.');
  A.note('s4_ausweis'); A.setFlag('k4.s.amt');
  await A.wait(400); await O.say('Rugiero. Ergibt in keinem Register einen Treffer. Kein Melderegister, keine Rente, keine Krankenkasse.');
  await O.say('Das italienische Konsulat schreibt: „Non risulta.“'); await A.m('Nicht bekannt.'); await O.say('Danke. So viel Italienisch kann ich inzwischen.');
  if (here(A)){ await A.wait(400); await A.g('Er hat seinen Ausweis in der Mütze getragen. Am Kopf. Wie einen Gedanken, den man nicht los wird.'); } }
async function termin(A,O){ if (N(A.G,'s4_termin')) return O.say('Donnerstag. Ohne Grund verschiebe ich nichts. Das ist kein Herz aus Stein, Herr Vuković. Das ist eine Frist.');
  await O.say('Bestattung von Amts wegen. Donnerstag, zwölf Uhr. Feuerbestattung, die Urne ins Gemeinschaftsfeld.'); await A.wait(400);
  await O.say('Wenn sich bis dahin niemand meldet.'); await A.wait(600); await O.say('Es meldet sich fast nie jemand.'); A.note('s4_termin'); A.setFlag('k4.s.amt'); }
// ---------------------------------------------------------------- Der richtige Name: ein neuer Mensch
async function newName(A,O){ var G=A.G; if (F(G,'k4.s.amtName')) return O.say('Giuseppe Ruggiero, mit zwei g. Das Konsulat sucht. Die sind langsam, aber gründlich.');
  await O.say('Ruggiero. Mit zwei g?'); await A.m('Mit zwei g. Und Giuseppe statt Josef. Ein Beamter hat ihn 1962 eingedeutscht, bei der Ankunft.');
  await A.wait(500); await O.anim('write'); await O.say('Dann suche ich anders.'); await A.wait(700);
  await O.say('Das ist nicht dieselbe Person für uns, Herr Vuković. Für uns ist das ein neuer Mensch.');
  await O.say('Geboren neununddreißig, Italien. Ich schreibe noch heute ans Konsulat.'); A.setFlag('k4.s.amtName');
  if (here(A)){ await A.wait(400); await A.g('Ein neuer Mensch. Mit neunundvierzig Jahren Verspätung.'); } }
// ---------------------------------------------------------------- Carmelas Wunsch: die Bestattung von Amts wegen wird abgesagt
async function cancel(A,O){ var G=A.G; if (F(G,'k4.s.amtOff')) return O.say('Abgesagt. Ich habe es zweimal gestempelt. Das mache ich sonst nie.');
  if (!F(G,'k4.s.amtName')){ await A.m('Er hieß Giuseppe Ruggiero. Mit zwei g.'); await O.say('Ruggiero.'); await O.anim('write'); await O.say('Dann ist das für uns ein neuer Mensch.'); A.setFlag('k4.s.amtName'); await A.wait(400); }
  await O.say('Eine Schwester. In Italien.'); await A.m('Carmela Ruggiero. Sie will die Urne. Ihre Enkelin schickt heute ein Fax, auf Deutsch.');
  await A.wait(900); await O.say('Ein Fax. Auf Deutsch. Aus Italien.'); await A.wait(700);
  await O.anim('stamp'); A.sfx('click'); await O.say('Dann sage ich die Bestattung von Amts wegen ab.');
  await A.wait(500); await O.say('Das mache ich nicht oft. Meistens meldet sich keiner.'); await A.wait(500); await O.say('Meistens.');
  if (G.phase==='k4_d4') await O.say('Sie haben Glück. Um zwölf wäre es gewesen. Die Urne gebe ich frei, Frau Wimmer kann sie gleich holen lassen.');
  else await O.say('Die Urne geht zur Überführung. Frau Wimmer rufe ich an. Die will ihn vorher sicher noch einmal bei sich haben. Die macht so etwas.');
  A.setFlag('k4.s.amtOff'); A.setFlag('k4.s.amt');
  if (here(A)){ await A.wait(500); await A.g('Er hat zweimal gestempelt.'); await A.m('Ich habe es gesehen.'); } }
var OB_ALSO=['s4_name','s4_umschlag','s4_bunker','s4_derselbe','s4_peppino','s4_enzo','s4_fluch','s4_bairisch','s4_tarnung','s4_termin','s4_wusste','s4_ausweis','s4_genommen'];
async function talkOber(A){ var O=A.npc('obermaier'), G=A.G;
  if (F(G,'k4.s.farewell')) return O.say(A.cycle('obAfter',['Die Überführung ist raus. Ich habe ihn abgeheftet. Unter R. Mit zwei g.','Frau Wimmer hat angerufen. Sie hat sich bedankt. Das passiert mir sonst nie.']));
  var table={
    s4_name:async function(A){ await newName(A,O); if (F(G,'k4.s.call') && !F(G,'k4.s.amtOff')) await cancel(A,O); },
    s4_umschlag:async function(A){ if (N(G,'s4_name')) return newName(A,O); await O.say('Briefe an einen Giuseppe Ruggiero. Mein Mann heißt Josef Rugiero.'); await A.wait(400); await O.say('Zwei Namen, zwei Akten, Herr Vuković. Bis mir einer zeigt, dass es einer ist.'); },
    s4_bunker:async function(A){ await O.say('Ein Beamter, zweiundsechzig, unter Gleis elf. Woher wissen Sie das?'); await A.m('Ich habe es … gehört.'); await A.wait(500); await O.say('Gehört. Von wem?'); await A.wait(800); await O.say('Lassen Sie. Ich brauche Papier, keine Geschichten.'); },
    s4_derselbe:async function(A){ await O.say('Siebzehn ist eine Nummer. Für einen Namen reicht mir das nicht. Nummern haben viele.'); },
    s4_peppino:async function(A){ await O.say('Peppino. Ein Rufname. Rufnamen stehen in keinem Register.'); },
    s4_enzo:async function(A){ await O.say('Ein Herr aus einer Bar, der ihn Peppino nennt. Das schreibe ich so nicht in die Akte.'); },
    s4_fluch:async function(A){ await O.say('Wie einer geflucht hat, steht nicht in der Akte.'); },
    s4_bairisch:async function(A){ await O.say('Wie einer geredet hat, steht auch nicht in der Akte. Leider. Es stünde viel Interessantes drin.'); },
    s4_tarnung:async function(A){ await O.say('Zwei Sprachen. Und kein Name, der passt. Sie glauben nicht, wie oft ich das habe.'); },
    s4_termin:function(A){ return termin(A,O); },
    s4_ausweis:function(A){ return file(A,O); },
    s4_genommen:async function(A){ await O.say('Den Namen genommen. An Gleis elf.'); await A.wait(500); await O.say('Da war früher die Weiterleitungsstelle vom Arbeitsamt. Da hat man viel geschrieben, und wenig gefragt.'); },
    s4_wusste:async function(A){ if (F(G,'k4.s.call')) return cancel(A,O); await O.say('Eine Schwester, die etwas gewusst hat. Hat sie angerufen? Bei mir nicht.'); }
  };
  await A.menuLoop(function(){ var call=F(G,'k4.s.call'); return [
    {t:'Es geht um den Gepäckträger. Den Sepp, von der Bahnhofsmission.',if:!N(G,'s4_ausweis'),go:function(A){ return file(A,O); }},
    {t:'Was passiert jetzt mit ihm?',if:N(G,'s4_ausweis')&&!N(G,'s4_termin'),go:function(A){ return termin(A,O); }},
    {t:'Seine Schwester will ihn heimholen.',if:call&&!F(G,'k4.s.amtOff'),go:function(A){ return cancel(A,O); }},
    {t:'Kann ich die Akte sehen?',once:'ob1',go:async function(A){ await O.say('Nein.'); await A.wait(600); await O.say('Was ich Ihnen zeigen darf, habe ich Ihnen gezeigt. Der Rest ist Amtsgeheimnis. Auch für Übersetzer.'); }},
    {t:'Ich bin … ein Verwandter.',once:'ob2',go:async function(A){ await O.anim('file'); await A.wait(500); await O.say('Herr Vuković. Sie heißen Vuković.'); await A.wait(400); await O.say('Und Frau Wimmer hat Sie mir als Übersetzer angekündigt. Zweimal. Verwandte kündigt sie nicht an. Die kommen nicht.'); }},
    {t:'Wie oft kommt das vor? Dass keiner kommt?',once:'ob3',go:async function(A){ await O.say('Jede Woche. Im Winter öfter.'); await A.wait(500); await O.say('Ich schreibe jeden Namen zweimal. Damit wenigstens einer ihn richtig geschrieben hat.'); }},
    askOpt('Was sage ich ihm?',OB_ALSO,table,async function(A){ await O.say(A.cycle('obNo',['Dazu habe ich nichts in der Akte.','Herr Vuković. Ich brauche Papier. Nicht Vermutungen.'])); }),
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await O.say(A.cycle('obBye',['Wiedersehen. Die Tür bitte zu, es zieht.','Auf Wiedersehen. Und fragen Sie sich nicht zu viel. Davon wird man so wie ich.'])); }}
  ]; }); }
var HS=[
 {id:'door',name:'In die Stadt',exit:{to:'map'},look:'Die schwere Holztür. Daneben ein Zettel mit Sprechzeiten, in drei Farben unterstrichen.',g:{look:'Draußen die Altstadt. Drinnen Namen.'}},
 {id:'desk',name:'Schreibtisch',look:'Ein grauer Amtsschreibtisch: Aktenstapel, ein Telefon, eine Lampe, ein Stempelkarussell. Obenauf eine aufgeschlagene Akte, die ich nicht lesen soll.',
   take:'Die Akte gehört der Stadt. Und Herr Obermaier sieht über seine Brille.',read:'Ich lese nicht über fremde Schultern. Nicht hier.',
   g:{look:'Eine Akte. Auf dem Rücken steht „unbekannt“. Ich kann sie nicht aufmachen.'}},
 {id:'files',name:'Aktenschrank',look:'Ein hoher Aktenschrank aus Holz, oben Glastüren mit Ordnern, obenauf Archivkartons. Auf einem steht „1987–1989“.',open:'Abgeschlossen. Natürlich.',
   g:{look:'Hinter dem Glas Ordner voller Leute, die keiner abgeholt hat. So viele.',sense:'Kein Nachhall. Nur Papier. Die Toten sind nicht hier. Nur ihre Namen, und oft nicht einmal die.'}},
 {id:'forms',name:'Formulare',look:'Fächer mit Formularen: „Antrag auf Überführung“, „Erklärung der Angehörigen“, „Bestattung von Amts wegen – Kostenbescheid“.',take:'Ich brauche keins. Noch nicht. Hoffentlich lange nicht.',
   g:{look:'Papier für jeden Fall. Für keinen Fall Papier, das tröstet.'}},
 {id:'calendar',name:'Kalender',look:'Ein Wandkalender mit einem Winterfoto vom Friedhof: Bäume, Schnee, schlichte runde Steine. Der Donnerstag ist rot eingekreist.',
   g:{look:'Ein roter Kreis um einen Donnerstag. Für einen Mann ohne Namen.'}},
 {id:'window',name:'Fenster',look:'Ein hohes Fenster. Gegenüber ein Altstadthaus mit Schnee auf den Simsen. Auf einem Sims sitzt eine Taube und sieht herein.',
   g:{look:'Die Taube sieht mich. Tauben sehen mehr, als man denkt.'}},
 {id:'chair',name:'Besucherstuhl',look:'Ein Besucherstuhl, der wackelt.',use:'Ich setze mich. Der Stuhl wackelt. Herr Obermaier hat recht: Man bleibt nicht zu lange.',
   g:{look:'Auf diesem Stuhl haben Leute gesessen, die gerade erfahren haben, dass keiner kommt.'}},
 {id:'stamp',name:'Stempelkarussell',look:'Ein Stempelkarussell mit zwölf Stempeln. „Eingegangen“, „Erledigt“, „Zur Akte“, und einer, der ganz neu aussieht: „Abgesagt“.',use:'Ich stemple nichts. Das ist sein Beruf.',
   g:{look:'Stempel. Unter Gleis elf hat auch einer gestempelt.'}},
 {id:'obermaier',npc:'obermaier',name:'Herr Obermaier',hgt:36,talk:talkOber,vis:function(S,G){ return OPEN.indexOf(G.phase)>=0; },
   look:'Ein hagerer Mann am Schreibtisch, der Seitenscheitel wie mit dem Lineal gezogen, grauer Schnurrbart, Lesebrille. Beiges Hemd, dunkle Krawatte, graue Strickjacke. Genau, ohne Wärme, nicht böse.',
   give:{ aushang:'Herr Obermaier: „Den hat mir Frau Wimmer gefaxt. Zweimal.“', brief_falsch:'Herr Obermaier: „Ohne Unterschrift ist das kein Dokument, Herr Vuković. Das ist ein Wunsch.“', vizitka:'Herr Obermaier: „Zelenika. Den habe ich nicht in der Akte. Gut so.“' },
   g:{look:'Er schreibt jeden Namen zweimal. Damit er stimmt.',listen:'Er summt. Ganz leise. Er weiß nicht, dass er summt.'}}
];
M.room('friedamt',{ name:'Städtische Friedhöfe, Verwaltung', scape:'k4_friedamt', music:'k4_muenchen',
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (OPEN.indexOf(G.phase)<0) return L; var o=M.apos('friedamt','obermaier',[234,110,'L']);
    L.push({id:'obermaier',ch:'obermaier',x:o[0],y:o[1],f:o[2]||'L',name:'Herr Obermaier',idle:'write',talk:'sitTalk',speechY:36,routine:[['idle','write',8,14],['anim','stamp'],['idle','write',6,10],['anim','file']]});
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (alone(A)){ if (A.first('faMala')) await A.g('Ein Zimmer voller Namen. Keiner davon ruft.'); return; }
    if (OPEN.indexOf(G.phase)<0){ if (A.first('faClosed'+G.phase)) await A.m('Das Zimmer ist leer. Auf dem Schreibtisch ein Zettel: „Ab Dienstag wieder erreichbar.“'); return; }
    if (A.first('faFirst')) await A.narrate('Ein Amtszimmer mit hoher Decke, ein Aktenschrank aus Holz, ein Kalender mit einem Winterfoto. Am Schreibtisch ein Mann, der aussieht, als hätte er schon jede Frage einmal gehört.'); }
});
})(M);
