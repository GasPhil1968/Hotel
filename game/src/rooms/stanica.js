/* ===== rooms/stanica.js — Busbahnhof und Bahnhof: Ankunft (Mark statt Kuna), der Karton aus Split, die Fahrt nach Mostar ===== */
(function(M){
'use strict';
var P=M.P;
function ph(G){ return G.phase; }
function pro(G){ return G.phase==='k2_pro'; }
// ---------------------------------------------------------------- Fikret und der Brief aus Graz
async function talkFikret(A){ var F=A.npc('fikret');
  if (!pro(A.G)) return fikretLater(A,F);
  if (A.flag('k2.p1.km')){ await F.say(A.cycle('fkAfter',['Burek ist nur mit Fleisch. Sagen Sie das den Grazern.','Montag um halb acht. Ich stehe um vier auf. Für Österreicher!','Wenn Sie wieder einen Brief haben, kommen Sie zu Fikret. Ich zahle in Burek.'])); return; }
  await A.menuLoop(function(){ return [
    {t:'Was ist das für ein Brief?',if:!A.flag('k2.p1.letterRead'),go:function(A){ return fikretLetter(A,F); }},
    {t:'Ich lese ihn Ihnen noch einmal vor.',if:A.flag('k2.p1.letterRead'),go:function(A){ return fikretLetter(A,F); }},
    {t:'Wo kann ich hier Geld wechseln?',once:'fk1',go:async function(A){ await F.say('Samstag? Die Wechselstube macht um zwei zu. Der Automat ist seit Donnerstag kaputt. Willkommen in Sarajevo.'); await F.say('Am Montag ist alles wieder offen. Am Montag.'); }},
    {t:'Wie komme ich in die Baščaršija?',once:'fk2',go:async function(A){ await F.say('Mit der Eins. Da vorne, vor dem Bahnhof. Oder zu Fuß, eine Stunde, im Nebel. Wenn Sie Ihre Lunge nicht mögen.'); }},
    {t:'Gute Geschäfte.',bye:true,go:async function(A){ await F.say('Gute Geschäfte gibt es nicht. Es gibt Burek.'); }}
  ]; }); }
async function fikretLetter(A,F){ if (!A.flag('k2.p1.letterRead')){ await F.anim('gesture'); await F.say('Schauen Sie sich das an! Aus Österreich! Seit zwanzig Jahren backe ich hier, und jetzt schreiben sie mir Briefe!');
    await F.say('Bestimmt eine Beschwerde. Die Österreicher beschweren sich immer. Zu fettig, zu salzig, zu sarajevoerisch.'); await A.m('Darf ich?'); }
  A.setFlag('k2.p1.letterRead');
  await A.doc({style:'letter',title:'Reisebüro Murauer · Graz',lines:['Sehr geehrter Herr Hadžić,','','am Montag, dem 21. November, kommen wir mit einer','Reisegruppe von 40 Personen nach Sarajevo.','Bitte bereiten Sie für halb acht Uhr früh','40 Portionen Burek vor, davon 12 ohne Fleisch','(mit Käse oder Spinat), wenn das möglich ist.','Wir bezahlen bar.','','Mit freundlichen Grüßen','Monika Url']});
  await A.m('Das ist keine Beschwerde.'); await F.say('Nein? Was dann? Sagen Sie es mir richtig. Ich will kein „ungefähr“.');
  var res=await A.puzzle({title:'Fikret den Brief übersetzen',hint:'Fikret will es genau wissen. Tippe auf eine Zeile, um eine andere Fassung zu wählen, und lies dann vor.',button:'Vorlesen',
    slots:[['Eine Gruppe aus Graz beschwert sich:','Eine Gruppe aus Graz kommt am Montag,','Das Gesundheitsamt kommt am Montag,'],['vierzehn Leute,','vierzig Leute,','vier Busse voll,'],
      ['um halb neun,','um acht Uhr dreißig,','um halb acht in der Früh,'],['alle mit doppeltem Fleisch,','zwölf davon ohne Fleisch,','zwölf Prozent billiger,'],['und sie zahlen später.','und sie zahlen in der Bar.','und sie zahlen bar.']],
    init:[0,0,0,0,0],
    check:function(sel){ var ok=[1,1,2,1,2], msg=['Fikret: „Beschwerde? Wo steht da Beschwerde? Lesen Sie doch richtig!“','Fikret: „Vierzehn? Das ist ein Kleinbus. Graz schickt keinen Kleinbus.“','Fikret: „Halb acht, halb neun … Bei euch heißt halb acht doch sieben Uhr dreißig, oder nicht? Wie bei uns: pola osam.“','Fikret: „Mit doppeltem Fleisch? Das hätte ich gern. Steht da aber nicht.“','Fikret: „In der Bar? Ich habe keine Bar. Ich habe Burek.“'];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i]}; return {ok:true}; }});
  if (!res){ await F.say('Was ist? Haben Sie es sich anders überlegt? Lesen Sie, lesen Sie.'); return; }
  await A.m('„Eine Gruppe aus Graz kommt am Montag, vierzig Leute, um halb acht in der Früh. Zwölf davon ohne Fleisch. Und sie zahlen bar.“');
  await A.wait(600); await F.say('Vierzig.'); await F.say('Vierzig Burek. Am Montag. Bar.'); await A.wait(500);
  await F.say('Und zwölf ohne Fleisch?'); await A.m('Mit Käse oder Spinat.'); await F.anim('gesture'); await F.say('Burek ist nur mit Fleisch! Mit Käse heißt das Sirnica, mit Spinat Zeljanica! Das muss man denen doch sagen!');
  await A.m('Schreiben Sie es auf die Rechnung.'); await A.wait(400); await F.say('Ha. Gut. Sie sind gut.');
  await F.say('Was macht einer wie Sie am Samstag am Busbahnhof, ohne Mark in der Tasche? Ich sehe das. Ich sehe alles.'); await A.m('Ich bin eben angekommen. Aus Split.');
  await F.say('Aus Split.'); await F.anim('wipe'); await F.say('Hier. Zehn Mark. Für den Brief. Und keine Widerrede.'); A.give('km'); A.setFlag('k2.p1.km'); A.sfx('coin');
  await F.say('Und einen Burek. Mit Fleisch. Der echte.'); await A.wait(500); await A.narrate('Er ist heiß, fettig und genau so, wie er sein muss. Ich esse ihn im Stehen, wie mit fünfzehn.');
  await A.m('…Danke, Fikret.'); await F.say('Fikret Hadžić. Wenn Sie wieder Hunger haben oder einen Brief: Ich bin hier. Seit zwanzig Jahren bin ich hier.'); A.save(); }
async function fikretLater(A,F){ var p=A.G.phase;
  if (p==='k2_fin'){ if (A.first('fkFin')){ await F.say('Der Übersetzer! Die Grazer waren da. Vierzig Burek, zwölf Sirnica. Sie haben applaudiert. Applaudiert, für Burek!'); await F.say('Ich habe ihnen gesagt, ich habe einen Übersetzer. Jetzt wollen sie wiederkommen.'); return; }
    return F.say(A.cycle('fkF',['Burek? Für Sie immer.','Das Paket? Da hinten, bei Fadila. Sie beißt nicht. Meistens.'])); }
  if (p==='k2_epi'){ if (A.first('fkEpi')){ await F.say('Sie fahren?'); await A.m('Nach Mostar. Und zurück.'); await F.say('Zurück ist gut. Zurück ist das Wichtigste.'); return; } return F.say('Gute Reise, Übersetzer.'); }
  return F.say('Burek ist nur mit Fleisch.'); }
// ---------------------------------------------------------------- Senada und der Fahrschein
async function talkSenada(A){ var S=A.npc('senada');
  if (!pro(A.G)) return S.say(A.cycle('snL',['Novine? Zeitung?','Oslobođenje, Avaz, Dani. Sonst nichts.']));
  if (A.has('tramkarta')||A.has('tramkarta_v')) return S.say('Sie haben Ihre Karte. Entwerten nicht vergessen. Die Kontrolleure sind schneller als die Bahn.');
  await A.menuLoop(function(){ return [
    {t:'Einen Fahrschein, bitte.',go:async function(A){ if (!A.has('km')){ await S.say('Eins sechzig.'); await A.m('Ich habe nur Kuna.'); await S.say('Kune? Ne.'); await A.wait(400); await S.say('Hier ist Bosnien. Hier nimmt man Mark.'); A.note('p2_km'); A.setFlag('k2.p1.noKm'); return 'bye'; }
        await S.say('Eins sechzig.'); A.sfx('coin'); A.give('tramkarta'); A.setFlag('k2.p1.ticket'); await S.say('Im Wagen entwerten. Der Entwerter ist orange.'); await A.m('Danke.'); return 'bye'; }},
    {t:'Fährt die Eins in die Baščaršija?',once:'sn1',go:async function(A){ await S.say('Die Eins fährt immer in die Baščaršija. Seit hundert Jahren. Fast immer.'); }},
    {t:'Danke.',bye:true}
  ]; }); }
async function talkFadila(A){ var Fa=A.npc('fadila'), p=A.G.phase;
  if (p==='k2_fin'){ if (A.has('karton')||A.flag('k2.f2.opened')) return Fa.say('Sie haben Ihr Paket. Mehr habe ich nicht.');
    await A.menuLoop(function(){ return [
      {t:'Ich möchte ein Paket abholen. Aus Split.',go:async function(A){ await Fa.say('Nummer?'); if (!A.hasNote('f2_parcel')){ await A.m('Die Nummer … kommt per SMS. Mein Handy ist leer.'); await Fa.say('Ohne Nummer kein Paket. Ohne Ausweis auch nicht.'); return 'bye'; }
          await A.m('Viertausendvierhunderteinundsiebzig.'); await Fa.anim('stamp'); await Fa.say('Ausweis.'); await A.narrate('Sie sieht lange auf meinen Ausweis. Dann auf mich. Dann wieder auf den Ausweis.'); await Fa.say('Vuković, Marko. Geboren in Sarajevo.'); await A.m('Ja.');
          await Fa.say('Dann ist es ja nach Hause gekommen.'); A.sfx('thud'); A.give('karton'); A.setFlag('k2.f2.parcel'); await A.m('…'); await A.m('Ein Karton, in Packpapier, mit Paketband. Darunter, in meiner Schrift: SARAJEVO.'); A.save(); return 'bye'; }},
      {t:'Danke.',bye:true}
    ]; }); return; }
  if (p==='k2_epi') return busTicket(A,Fa);
  return Fa.say(A.cycle('faL',['Pakete und Fahrkarten. Gepäck bis achtzehn Uhr.','Nummer, Ausweis, Unterschrift. In dieser Reihenfolge.'])); }
// ---------------------------------------------------------------- Epilog: die Fahrkarte nach Mostar
async function busTicket(A,Fa){ if (A.has('busticket2')) return Fa.say('Bahnsteig vier. In zwanzig Minuten.');
  if (!A.flag('k2.epi.nada')){ await A.m('Erst Nada. Ich habe ihr etwas versprochen.'); return; }
  await Fa.say('Kamo?'); await A.m('Mostar.'); await A.wait(500); await Fa.say('Povratna?'); await A.m('…');
  var c=await A.choose([{t:'Ja. Hin und zurück.',id:'both'},{t:'Nur hin.',id:'one'}],{title:'Schalter'});
  if (c==='one'){ await A.m('…'); await A.wait(900); await A.m('Nein. Hin und zurück. Ich habe jemandem versprochen zurückzukommen.'); } else await A.m('Ja. Hin und zurück.');
  A.sfx('ticket'); A.give('busticket2'); A.setFlag('k2.epi.ticket'); await Fa.say('Dreiundzwanzig Mark. Bahnsteig vier, in zwanzig Minuten.');
  await A.wait(600); if (A.G.malaOn) await A.g('Hin und zurück.'); A.save(); }
// ---------------------------------------------------------------- Die Straßenbahn
function tramReady(S){ return !!S.tramIn; }
async function boardTram(A){ var p=A.G.phase;
  if (!pro(A.G)) return A.m(p==='k2_epi'?'Heute nehme ich den Bus.':'Die Eins. Heute nicht.');
  if (!A.has('tramkarta') && !A.has('tramkarta_v')){ await A.m(A.cycle('noTk',['Ohne Fahrschein steige ich nicht ein. Das hat mir Großmutter eingebläut.','Erst einen Fahrschein. Am Kiosk.'])); return; }
  if (!A.S.tramIn){ A.set('tramIn',true); A.sfx('tramBell'); await A.wait(600); await A.m('Da kommt sie. Die Eins. Rot und creme, wie früher. Nur älter. Wie ich.'); await A.wait(400); }
  A.sfx('tramDoor'); await A.goto('tramvaj',{noEnter:false}); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},canExit:async function(A){ if (pro(A.G) && !A.flag('k2.p2.back')){ await A.m(A.cycle('exP',['Zu Fuß? Im Nebel? Ich nehme die Straßenbahn.','Die Eins fährt in die Altstadt. Dorthin will ich.'])); return false; } if (!A.unlocked('carsija')) A.unlock('carsija'); return true; },
   look:'Die Straße in die Stadt. Nebel, Rücklichter, ein Hund, der weiß, wohin er will.'},
 {id:'fikret',npc:'fikret',name:'Fikret',hgt:46,vis:function(S,G){ return ['k2_pro','k2_fin','k2_epi'].indexOf(G.phase)>=0; },talk:talkFikret,
   look:function(A){ return A.m(A.flag('k2.p1.km')?'Fikret, in der Tür seiner Buregdžinica. Er sieht aus, als könnte er einen Bus aufhalten, wenn er wollte.':'Ein kräftiger Mann in Bäckerjacke, der einen Brief anschreit. Der Brief gewinnt.'); },
   g:{look:'Er ist laut, weil er Angst hat, dass es ihm keiner sagt.',listen:async function(A){ await A.g('„Zwanzig Jahre. Zwanzig Jahre Burek, und dann ein Brief.“ Er hat Angst vor Briefen. Viele hier haben das.'); }},
   give:{ km:'Fikret: „Behalten Sie das. Das ist Ihr Lohn.“', dzezva:async function(A){ await A.npc('fikret').say('Schöne Džezva. Alt. Aus der Čaršija.'); await A.m('Von meiner Großmutter.'); await A.npc('fikret').say('Dann kochen Sie damit. Nicht ansehen. Kochen.'); } }},
 {id:'senada',npc:'senada',name:'Senada',hgt:30,vis:function(S,G){ return ['k2_pro','k2_fin','k2_epi'].indexOf(G.phase)>=0; },talk:talkSenada,
   look:'Eine Frau mit rot gefärbtem Haar hinter einem Fenster voller Zeitungen. Sie liest eine davon und sieht trotzdem alles.',
   g:{look:'Sie hat hier auch im Krieg Zeitungen verkauft. Damals waren sie einen Bogen lang. Die Leute haben sie trotzdem gekauft.'},
   give:{ km:function(A){ return talkSenada(A); } }},
 {id:'fadila',npc:'fadila',name:'Fadila',hgt:30,vis:function(S,G){ return ['k2_pro','k2_fin','k2_epi'].indexOf(G.phase)>=0; },talk:talkFadila,
   look:'Hinter dem Paketschalter eine Frau mit einer Lesebrille an der Kette. Sie stempelt, als würde jeder Stempel etwas beweisen.',
   g:{look:'Sie schreibt jede Nummer zweimal. Einmal ins Buch, einmal in ihren Kopf.'}},
 {id:'bus',name:function(S,G){ return G.phase==='k2_epi'?'Bus nach Mostar':'Bus aus Split'; },look:function(A){ if (A.G.phase==='k2_epi') return A.m(A.flag('k2.epi.ticket')?'Der Bus nach Mostar. Der Fahrer raucht neben der Tür und sieht auf die Uhr.':'Ein Bus mit dem Schild „MOSTAR“. Ich brauche eine Fahrkarte.');
     return A.m(A.cycle('busL',['Der Bus aus Split. Der Fahrer hat den Motor abgestellt und isst schon. Der Platz in der neunten Reihe ist leer.','Neunte Reihe, Fenster. Da hat Mala gesessen, bis Konjic. Danach nicht mehr.'])); },
   use:async function(A){ if (A.G.phase!=='k2_epi') return A.m('Der fährt zurück nach Split. Ich nicht.'); if (!A.has('busticket2')) return A.m('Ohne Fahrkarte nimmt mich keiner mit. Fadila verkauft sie.'); return M.k2Departure?M.k2Departure(A):A.m('…'); },
   g:{look:'Ich bin da drin gesessen, bis zu den Hochhäusern. Dann war es zu viel.'}},
 {id:'timetable',name:'Abfahrtstafel',look:'„POLASCI“. Mostar, Tuzla, Zagreb, Beograd, München, Wien. Split, 7:00. Die Welt passt auf eine Tafel.',read:'Mostar 6:30, 9:15, 14:00. Split 7:00. Beograd 22:00. München, jeden Freitag.',g:{look:'Früher stand hier „Dubrovnik“ ganz oben. Glaube ich. Ich weiß nicht, woher ich das weiß.'}},
 {id:'kiosk',name:'Kiosk',look:'Ein Kiosk mit Zeitungen, Zigaretten, Fahrscheinen. „KARTE“ auf einem Pappschild.',use:function(A){ return talkSenada(A); },g:{look:'Kioske riechen überall gleich. Nach Papier und Kälte.'}},
 {id:'newspapers',name:'Zeitungen',look:'„Oslobođenje“, „Dnevni avaz“. Auf der ersten Seite ein Minister, ein Fußballspiel und eine Gasrechnung.',take:'Ich habe keine Mark. Und die Nachrichten sind dieselben wie in Split. Nur in anderen Buchstaben.',read:'„Gaspreise steigen im Dezember.“ „Željo verliert in Tuzla.“ Und klein, unten: „Rotes Kreuz: Noch immer 7.000 Vermisste.“',
   g:{look:'Unten steht etwas über Vermisste. Ich lese es nicht. Ich lese es doch.'}},
 {id:'burek',name:'Buregdžinica',look:'„BUREGDŽINICA SARAJ“. Bleche voller Burek im beschlagenen Fenster. Der Geruch hat eine eigene Stimme.',use:'Fikret entscheidet, wer hier etwas bekommt.',open:'Der Laden ist offen. Fikret steht davor.',
   g:{look:'Hier hat es auch im Krieg Burek gegeben. Manchmal ohne Mehl. Ich weiß nicht, wie.',sense:'Warm. Viele Hände. Niemand, der festhängt.'}},
 {id:'exchange',name:'Wechselstube',look:'„MJENJAČNICA – subotom do 14h“. Es ist halb fünf. Natürlich.',open:'Zu. Bis Montag.',g:{look:'Geld, das man wechseln muss. Wir haben damals Zigaretten getauscht.'}},
 {id:'atm',name:'Bankautomat',look:'Ein Bankautomat mit einem Zettel: „VAN FUNKCIJE“. Außer Betrieb. Jemand hat darunter geschrieben: „Kao i mi.“ Wie wir.',use:'Er nimmt meine Karte, denkt nach und gibt sie zurück. Ehrlich.',g:{look:'„Wie wir.“ Ich mag die Leute, die so etwas schreiben.'}},
 {id:'parcel',name:'Paketschalter',look:'„PAKETI – GARDEROBA“. Ein Fenster mit Klappe und eine Klingel, die keiner benutzt.',use:function(A){ return talkFadila(A); },g:{look:'Hier holt man ab, was andere geschickt haben. Und manchmal nicht.'}},
 {id:'taxi',name:'Taxi',look:'Ein alter weißer Mercedes mit „TAXI“ auf dem Dach. Der Fahrer liest die Zeitung von gestern.',
   use:async function(A){ if (!pro(A.G)) return A.m('Ich brauche kein Taxi.'); await A.voice('„Baščaršija? Dvadeset eura.“ Zwanzig Euro.',P.s5); await A.m('Ich habe Kuna.'); await A.voice('„Kune …“ Er lacht und liest weiter.',P.s5); A.setFlag('k2.p1.taxi'); },
   talk:async function(A){ if (!pro(A.G)) return A.m('Er liest. Ich lasse ihn.'); await A.voice('„Dvadeset eura, Baščaršija. Ili trideset maraka.“',P.s5); await A.m('Zwanzig Euro oder dreißig Mark. Für zehn Minuten im Nebel.'); },
   g:{look:'Taxis gab es damals nicht. Es gab Fußwege, auf denen man rennen musste.'}},
 {id:'station',name:'Bahnhof',look:'Der Bahnhof. Glas, Beton, ein langes flaches Dach, gebaut für eine Zukunft, die schneller kommen sollte. Drinnen ist es dunkel.',open:'Heute fährt kein Zug mehr. Es fährt fast nie einer.',
   g:{look:'Von hier ist früher ein Zug ans Meer gefahren. Ich weiß nicht, ob ich drin war.'}},
 {id:'clock',name:'Bahnhofsuhr',look:function(A){ var t={k2_pro:'Zwanzig vor fünf.',k2_fin:'Zehn nach zwei.',k2_epi:'Kurz vor sieben.'}[A.G.phase]||'Sie geht.'; return A.m('Die Bahnhofsuhr. '+t+' Die einzige Uhr in dieser Stadt, die ich verstehe.'); },
   g:{look:'Uhren. Hier sehe ich überall Uhren.'}},
 {id:'tram_stop',name:'Haltestelle',look:'Die Haltestelle der Eins. Ein Wartehäuschen, zwei Gleise, ein Fahrplan, den der Nebel aufweicht.',use:function(A){ return boardTram(A); },
   g:{look:'Die Eins. Nicht meine. Meine war die Drei.'}},
 {id:'tram',name:'Straßenbahn',vis:function(S){ return !!S.tramIn; },look:'Eine Tatra, rot und creme, mit Liniennummer 1. Die Türen stehen offen. Drinnen gelbes Licht.',use:function(A){ return boardTram(A); },open:function(A){ return boardTram(A); },
   g:{look:'Sie riechen alle gleich. Nach Strom und nassen Mänteln.'}},
 {id:'bench',name:'Bank',look:function(A){ return A.m(A.G.phase==='k2_epi'?'Die Bank am Bahnsteig. Sie ist kalt und nass vom Schnee.':'Eine Bank aus Beton. Auf ihr sitzt niemand, der nicht muss.'); },
   use:'Ich setze mich nicht. Wenn ich mich hier setze, stehe ich nicht mehr auf.',g:{look:'Ich habe auf Bänken gewartet. Nicht auf dieser.'}},
 {id:'pigeons',name:'Tauben',look:'Tauben, die den Busbahnhof besser kennen als die Busfahrer.',talk:'„Gru, gru.“ Sie sehen mich an wie einen Tourist.',g:{look:'Sie fliegen auf, wenn Glocken läuten. Ich auch.'}}
];
M.room('stanica',{ name:'Busbahnhof', scape:'k2_stanica',
  music:function(G){ return G.phase==='k2_epi'?'k2_sarajevo':(G.phase==='k2_fin'?'k2_istraga':'k2_sarajevo'); },
  state:function(G){ return {tramIn:false,busTo:'split'}; },
  actors:function(S,G){ var L=[], on=['k2_pro','k2_fin','k2_epi'].indexOf(G.phase)>=0; if (!on) return L; S.busTo=G.phase==='k2_epi'?'mostar':'split';
    var f=M.apos('stanica','fikret',[176,124,'R']); L.push({id:'fikret',ch:'fikret',x:f[0],y:f[1],f:f[2]||'R',name:'Fikret',idle:G.flags['k2.p1.km']?'wipe':'gesture',speechY:44});
    var s=M.apos('stanica','senada',[250,104,'F']); L.push({id:'senada',ch:'senada',x:s[0],y:s[1],f:s[2]||'F',name:'Senada',idle:'read',speechY:34});
    var d=M.apos('stanica','fadila',[96,104,'F']); L.push({id:'fadila',ch:'fadila',x:d[0],y:d[1],f:d[2]||'F',name:'Fadila',idle:G.phase==='k2_pro'?'stamp':null,speechY:34});
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_fin' && A.first('k2stFin')){ await A.m('Der Busbahnhof bei Tag. Ohne Nebel sieht er kleiner aus. Und ehrlicher.'); }
    if (p==='k2_epi' && A.first('k2stEpi')){ await A.m('Schnee auf dem Bahnsteig. Die ersten Spuren sind meine. Neben meinen keine.'); if (A.G.malaOn) await A.g('Doch. Man sieht sie nur nicht.'); } }
});
// ---------------------------------------------------------------- Epilog: die Abfahrt nach Mostar
M.k2Departure=async function(A){ if (A.flag('k2.epi.done')) return; A.setFlag('k2.epi.done'); A.G.flags['mala.lock']=true;
  var b=M.stand('stanica','bench')||[300,124,'B']; await A.walk(b[0]+18,b[1]); await A.face('L'); var mp=M.apos('stanica','mala',[b[0]-6,b[1]-2,'R']); A.placeG(mp[0],mp[1],'R'); A.idleG('sit');
  await A.wait(700); await A.g('Hin und zurück.'); await A.m('Hin und zurück.'); await A.wait(800);
  await A.menuLoop(function(){ return [
    {t:'Hast du Angst vor Mostar?',once:'de1',go:async function(A){ await A.g('Ja.'); await A.wait(700); await A.g('Vor dem Fluss. Er war so laut.'); await A.m('Ich bin da.'); await A.g('Ich weiß. Diesmal bist du da.'); }},
    {t:'Wie soll ich dich nennen? Lana oder Mala?',once:'de2',go:async function(A){ await A.g('Lana haben mich alle genannt.'); await A.wait(600); await A.g('Mala nur du.'); await A.m('Dann bleibe ich bei Mala.'); await A.g('Dann bleibe ich bei dir.'); }},
    {t:'Danke, dass du mich nach Hause gebracht hast.',once:'de3',go:async function(A){ await A.g('Du hast mich nach Hause gebracht. Ich hätte den Weg nicht gefunden. Ich hatte ihn vergessen, mit dir zusammen.'); }},
    {t:'(Schweigen und in den Schnee sehen.)',once:'de4',silent:true,go:async function(A){ await A.wait(2400); A.sfx('tramBellFar'); await A.wait(1000); await A.g('Die Eins.'); await A.m('Die fährt in die Altstadt.'); await A.g('Ich weiß. Wir fahren woandershin.'); }},
    {t:'Steigen wir ein.',bye:true}
  ]; });
  A.sfx('pa'); await A.voice('„Autobus za Mostar, peron četiri.“',P.s4); A.sfx('bus'); await A.wait(700); A.idleG(null); A.G.flags['mala.lock']=false;
  await A.fade(8,1600); A.music('k2_end'); M.E.fade=0;
  await A.memory({title:'Im Bus nach Mostar',tint:'memory',draw:M.mem&&M.mem.k2_road,lines:['Der Bus fährt aus der Stadt, an der Miljacka entlang nach Westen. Hinter uns die Hochhäuser, dann die Hügel, dann der Schnee.','Mala sitzt am Fenster. Ich sitze daneben, damit sie nicht herausfällt.','Sie öffnet ihre Dose. Darin liegen jetzt nur noch zwei Fahrscheine, beide entwertet. Das Foto habe ich.','Ihre Leine zeigt nach Südwesten. Die Straße auch.']});
  await A.card({kicker:'',title:'Ende des zweiten Kapitels',sub:'Fortsetzung: Mostar',ms:5600}); await M.endChapter2(A); };
})(M);
