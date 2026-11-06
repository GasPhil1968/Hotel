/* ===== rooms/zob.js — ZOB an der Hackerbrücke: Ankunft am Heiligabend (M.k4Arrive), Anas SMS, der Kopfschmerz,
   Hansi am Pfeiler (ein Geist, der auf seine Ablösung wartet), Wastl am Taxistand, der ihn ablöst. Später ein Ort zum Umsteigen.
   Schalter: k4.p.arrived (Gerüst), k4.h.found, k4.h.relief, k4.h.try1/2, k4.h.local, k4.h.wastl, k4.p.hansi. Notiz: u4_sms. ===== */
(function(M){
'use strict';
var DAYS=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'];
function F(A,k){ return !!A.flag(k); }
function pro(G){ return G.phase==='k4_pro'; }
function hansiHere(G){ return G.phase==='k4_pro' && !G.flags['k4.p.hansi']; }
function wastlHere(G){ return DAYS.indexOf(G.phase)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }   // Mala ist dabei, Marko wird gespielt
// ---------------------------------------------------------------- Ankunft (das Gerüst ruft das nach dem Bild „Im Bus nach München“)
M.k4Arrive=async function(A){ var G=A.G; if (A.flag('k4.p.arriveDone')) return; G.flags['mala.lock']=true;
  try{
    await A.narrate('Zentraler Omnibusbahnhof an der Hackerbrücke. Sieben Uhr vierzig. Es schneit, als hätte München es für uns bestellt.');
    if (G.malaOn){ await A.wait(300); await A.g('Schnee.'); await A.wait(400); await A.g('In Sarajevo war er nie so sauber.'); }
    A.sfx('sms'); await A.wait(700); await A.m('Mein Handy. Ana.');
    await A.doc({style:'letter',title:'SMS · Ana',lines:['Mama arbeitet bis 14 Uhr. Schlüssel bei Frau Huber, 2. Stock. Ich hol dich NICHT ab, ich muss Plätzchen backen. A.']});
    A.note('u4_sms');
    await A.m('„NICHT“ in Großbuchstaben. Ana schreibt, wie sie redet.');
    var c=await A.choose([{t:'(Antworten: „Bin da.“)',id:'yes',silent:true},{t:'(Nicht antworten.)',id:'no',silent:true}],{title:'Ana'});
    A.setFlag('k4.p.smsReply',c);
    if (c==='yes'){ A.sfx('click'); await A.narrate('Ich schreibe: „Bin da.“ Dann lösche ich den Punkt. Dann setze ich ihn wieder.'); if (G.malaOn) await A.g('Zwei Wörter. Für dich ist das ein Brief.'); }
    else { await A.m('Später. Sie backt.'); if (G.malaOn) await A.g('Sie hat geschrieben, dass sie dich nicht abholt. Das ist auch eine Art, Hallo zu sagen.'); }
    if (G.malaOn){ await A.wait(400); await A.g('A. Wer ist A.?'); await A.m('Ana. Meine Schwester.'); await A.g('Die kleine Ana? Die immer hinter dir her war, wie ein Entchen?');
      await A.m('Sie ist siebenundzwanzig. Sie hat zwei Kinder und einen Mann, der Bosnisch aus einem Buch lernt.'); await A.wait(300); await A.g('Das Entchen hat Kinder.'); }
    await A.wait(700); A.headache(2600); await A.animM('headache'); await A.wait(300); await A.m('…');
    if (G.malaOn){ await A.g('Dein Kopf.'); await A.m('Zehn Stunden Bus.'); await A.wait(500); await A.g('Nein. Hier wartet einer. Ich spüre ihn auch.'); await A.g('Lass mich nachsehen.'); }
    else await A.m('Mein Kopf. Hier am Bussteig ist etwas. Ich weiß, was das heißt.');
  } finally { G.flags['mala.lock']=false; A.setFlag('k4.p.arriveDone'); } };
// ---------------------------------------------------------------- Mala findet Hansi
M.k4HansiFind=async function(A){ var G=A.G, H=A.npc('hansi'); if (A.isFound('hansi') || !hansiHere(G)) return;
  await A.wait(300); A.found('hansi'); A.setFlag('k4.h.found'); G.flags['met.hansi']=true; if (H.actor) H.actor.fadeIn=A.gt; await A.wait(900);
  await A.narrate('Am Pfeiler steht ein Mann in grauem Kittel, eine lederne Geldtasche am Gürtel, einen Bleistift hinter dem Ohr. Er steht genau auf dem hellen Fleck im Pflaster, als stünde dort noch seine Bude.');
  await H.say('Sarajewo, Schplit, Sagreb! Fahrkartn! Der Achte-Uhr-Bus is no ned voll!');
  await A.g('Ich bin schon angekommen.'); await H.say('Ja mei. A Madl, des nix kafft.');
  await A.wait(400); await H.say('Kirchmaier. Hansi. I bin bloß no bis zur Ablösung do. Nacha is Feierabend.');
  await A.g('Feierabend.'); await A.wait(300); await A.g('Das Wort kenne ich. Den Rest nicht.');
  if (G.pos.marko.room==='zob'){ await A.wait(400); await A.g('Marko. Am Pfeiler. Er heißt Kirchmaier, Hansi, und er verkauft Fahrkarten.'); await A.g('Er redet Deutsch, aber nicht meins. Reden musst du mit ihm.'); } };
// ---------------------------------------------------------------- Hansi (mit Marko)
async function hansiDead(A,H){ await A.m('Herr Kirchmaier. Sie wissen, dass Sie …'); await A.wait(500);
  await H.say('Tot? Freilich woaß i des.'); await H.say('Do bin i umgfalln. Achtadneunzge, im Dezember. Grad wia i d’ Kasse zammzählt hab.');
  await A.wait(400); await A.m('Und trotzdem stehen Sie noch hier.'); await relief(A,H,true); }
async function relief(A,H,after){ if (!after) await A.m('Worauf warten Sie?');
  await H.say('Auf mei Ablösung. Der Schorsch hätt um sechse kemma solln. Is ned kemma.'); await H.say('I mach ned zua, bevor oana kimmt. Des hab i no nia gmacht. In vierzig Jahr ned.');
  A.setFlag('k4.h.relief');
  if (gHere(A) && A.first('hsTr1')){ await A.wait(300); await A.g('Was sagt er?'); await A.m('Er wartet auf seine Ablösung. Er macht nicht zu, bevor einer kommt.'); await A.wait(400); await A.g('Das kenne ich.'); } }
async function try1(A,H){ await A.m('Feierabend, Herr Kirchmaier.'); A.setFlag('k4.h.try1'); await A.wait(500);
  await A.narrate('Hansi sieht mich an, von den Schuhen bis zur Mütze, die ich nicht aufhabe.'); await H.say('Sie?'); await A.wait(500); await H.say('Sie san ned vo do.');
  await A.m('Ich war oft genug hier.'); await H.say('Oft gnua is ned vo do. Des hört ma. Sie redn wia d’ Zeitung.');
  if (gHere(A)){ await A.wait(300); await A.g('Was hat er gesagt?'); await A.m('Ich rede wie die Zeitung.'); await A.g('Du redest wie ein Wörterbuch. Das ist schlimmer.'); } }
async function try2(A,H){ await A.m('Ihre Schicht ist vorbei.'); A.setFlag('k4.h.try2'); await A.wait(400);
  await H.say('Mei Schicht?'); await H.say('Des sagt mei Chef ned so. Der sagt: Kirchmaier, Kasse machen. Und des sagt er erst, wenn d’ Ablösung dasteht.');
  if (gHere(A) && A.first('hsTr2')){ await A.wait(300); await A.g('Wieder nicht?'); await A.m('Wieder nicht. Es liegt nicht am Satz.'); } }
async function whoRelieves(A,H){ await A.m('Wer darf Sie denn ablösen?');
  await H.say('Oana vo do. Oana, der woaß, wia ma des sagt.'); await A.wait(400);
  await A.narrate('Er nickt mit dem Kinn zum Taxistand hinüber.');
  await H.say('Der Wastl, der wo do drüben lehnt. Der is vo do.'); await A.wait(300); await H.say('Aber der red ja ned mit mir. Seit Jahr und Tag ned.');
  A.setFlag('k4.h.local');
  if (gHere(A)){ await A.wait(400); await A.g('Was will er?'); await A.m('Einen von hier. Nicht einen Satz. Eine Stimme.'); await A.g('Dann brauchst du einen Übersetzer.'); await A.m('Für Deutsch.'); await A.g('Für sein Deutsch.'); } }
async function talkHansi(A){ var H=A.npc('hansi');
  if (A.first('hsMk')){ await H.say('Grüß Gott! Sarajewo, Schplit, Sagreb? Der Achte-Uhr-Bus is no ned voll.'); await A.m('Ich bin gerade angekommen. Mit dem Bus.'); await H.say('Ankommen tun’s alle. Wegfahrn, des is des Gschäft.'); }
  await A.menuLoop(function(){ if (!hansiHere(A.G)) return []; return [
    {t:'Herr Kirchmaier. Sie wissen, dass Sie …',silent:true,once:'hsDead',go:function(A){ return hansiDead(A,H); }},
    {t:'Worauf warten Sie?',silent:true,if:!F(A,'k4.h.relief'),go:function(A){ return relief(A,H); }},
    {t:'Feierabend, Herr Kirchmaier.',silent:true,if:F(A,'k4.h.relief')&&!F(A,'k4.h.try1'),go:function(A){ return try1(A,H); }},
    {t:'Ihre Schicht ist vorbei.',silent:true,if:F(A,'k4.h.relief')&&!F(A,'k4.h.try2'),go:function(A){ return try2(A,H); }},
    {t:'Wer darf Sie denn ablösen?',silent:true,if:F(A,'k4.h.relief')&&!F(A,'k4.h.local'),go:function(A){ return whoRelieves(A,H); }},
    {t:'Was kostet eine Fahrkarte nach Sarajevo?',once:'hsFare',go:async function(A){ await H.say('Hundertzwanzig Mark, hin und zruck. Oafach achtzge.'); await H.say('De meisten nehman oafach. Und dann kemman’s doch wieder, jeds Jahr, mit am Kofferraum voller Kaffee.');
        await A.m('Die Mark gibt es nicht mehr.'); await H.say('Freilich gibt’s d’ Mark. I hab’s doch in der Taschn.'); await A.narrate('Er klopft auf die Ledertasche. Es klimpert. Für ihn.'); }},
    {t:'Haben Sie viele verkauft? Nach Sarajevo?',once:'hsMany',if:F(A,'k4.h.relief'),go:async function(A){ await H.say('Tausende. Im Sommer san’s glaufn, im Winter san’s gstandn. Mit Kindern, mit Kartons, mit am Fernseher fürn Onkel.');
        await H.say('Zweianeunzge san’s dann bloß no kemma. Wegfahrn hod koana mehr woin.'); await A.wait(500); await A.m('Zweiundneunzig sind sie nur noch gekommen.'); if (gHere(A)) await A.g('…'); }},
    {t:'Servus.',bye:true,go:async function(A){ await H.say(A.cycle('hsBye',['Servus.','Pfiat Gott. Und vergessn’S Eana Kartn ned.','I bin do. Wo soll i sonst sei.'])); }}
  ]; }); }
async function talkHansiG(A){ var H=A.npc('hansi'); if (!A.isFound('hansi')) return M.k4HansiFind(A);
  await A.g(A.cycle('hsG',['Herr Kirchmaier?','Hansi?']));
  await H.say(A.cycle('hsGa',['Fräulein, i hab koa Zeit, i hab Kundschaft. Wenn oana kimmt.','Sarajewo? Der Achte-Uhr. Oder san’S scho do?','Mei, Madl. Du schaust aus wia oane, de wo was sucht und’s ned findt.']));
  await A.g(A.cycle('hsGb',['Ich verstehe jedes dritte Wort. Und das dritte heißt „ned“.','Er redet wie ein Radio mit schlechtem Empfang. Freundlich, aber schlecht.'])); }
// ---------------------------------------------------------------- Wastl
async function relieve(A,W){ var G=A.G, H=A.npc('hansi'); G.flags['mala.lock']=true;
  try{
    await A.m('Würden Sie etwas für mich sagen? Zu dem Pfeiler da drüben.'); await A.wait(400);
    await W.say('Zu am Pfeiler?'); await W.anim('laugh'); await W.say('Sie san mir a Gspaßiger.');
    await A.m('Bitte. Sagen Sie: Feierabend. Ich übernehme.'); await A.wait(500);
    await W.say('Weil Weihnachten is.'); await W.face('L'); await A.wait(300);
    await W.anim('call'); await W.say('Feierabend, Hansi! I übernimm!'); await A.wait(1100);
    await H.say('Na also.'); await A.wait(500);
    await H.anim('count'); await A.narrate('Hansi zählt die Münzen aus seiner Tasche in die Hand, Stück für Stück, und klappt sie zu. Die Kasse stimmt. Auf den Pfennig.');
    await A.wait(300); await H.anim('wave'); await H.say('Servus, Burschi.'); await A.wait(400);
    await H.anim('go'); if (H.actor) H.actor.fadeOut=A.gt; A.sfx('shimmer'); await A.wait(1100);
    A.setFlag('k4.p.hansi'); A.rebuild();
    await W.say('Und? Hat er was gsagt?');
    var c=await A.choose([{t:'Er hat gesagt: Servus, Burschi.',id:'tell'},{t:'(Nichts sagen.)',id:'quiet',silent:true}],{title:'Wastl'});
    if (c==='tell'){ A.setFlag('k4.h.told'); await A.wait(700); await W.say('Burschi.'); await A.wait(900); await W.say('So hat er mi gnannt. Vierzig Jahr lang. Da war i scho fuchzge.'); await A.wait(500); await W.anim('laugh'); await W.say('Sie san wirklich a Gspaßiger.'); }
    else { await A.m('Nichts. Ein Pfeiler.'); await W.say('Freilich. Aber schee war’s trotzdem.'); }
    if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Er ist einfach gegangen. Ohne Schwelle. Ohne mich.'); await A.m('Er brauchte nur seinen Feierabend.'); await A.g('Und einen, der ihn sagt.'); await A.wait(600);
      await A.g('In Sarajevo hast du für die Toten übersetzt. Hier musst du es für mich tun.'); await A.m('Und manchmal brauche ich selbst einen.'); await A.wait(300); await A.g('Einen mit Schnurrbart.'); }
  } finally { G.flags['mala.lock']=false; }
  await M.k4DayCheck(A); }
async function talkWastl(A){ var W=A.npc('wastl'), G=A.G, p=G.phase;
  await A.menuLoop(function(){ return [
    {t:'Kannten Sie einen Hansi? Er hat hier Fahrkarten verkauft. Am Pfeiler.',if:F(A,'k4.h.found')&&!F(A,'k4.h.wastl')&&hansiHere(G),go:async function(A){
        await W.say('Den Hansi?'); await A.wait(400); await W.say('Freilich. Kirchmaier Hansi. Der hat uns allen d’ Kartn verkauft, wenn ma im Sommer runter san. An d’ Adria, mit Kind und Kegel.');
        await W.say('Achtadneunzge is er gstorbn. In seiner Budn, im Dezember. Sei Ablösung hat’n in der Früh gfundn.'); await A.wait(300); await W.say('D’ Kasse hat gstimmt. Auf’n Pfennig.');
        A.setFlag('k4.h.wastl'); if (G.malaOn && A.malaHere()){ await A.wait(300); await A.g('Was sagt er?'); await A.m('Er kannte ihn. Er weiß, wann er gestorben ist. Und dass die Kasse gestimmt hat.'); } }},
    {t:'Würden Sie etwas für mich sagen? Zu dem Pfeiler da drüben.',silent:true,if:F(A,'k4.h.wastl')&&F(A,'k4.h.local')&&hansiHere(G),go:async function(A){ await relieve(A,W); return 'bye'; }},
    {t:'Würden Sie etwas für mich sagen? Zu dem Pfeiler da drüben.',silent:true,if:F(A,'k4.h.local')&&!F(A,'k4.h.wastl')&&hansiHere(G),go:async function(A){ await A.m('Würden Sie etwas für mich sagen? Zu dem Pfeiler da drüben.'); await W.say('Zu am Pfeiler? Warum soll i mit am Pfeiler redn?'); await A.wait(300); await W.say('Sie san ned der Erste, der nach zehn Stund Bus komisch wird. Schlafen’S Eana aus.'); }},
    {t:'Fahren Sie mich ins Westend?',once:'ws1',if:pro(G),go:async function(A){ await W.say('Ins Westend? Über d’ Bruckn san des zehn Minutn z’Fuaß.'); await W.say('Do fahr i Eana ned. Do lacht mi mei Frau aus.'); }},
    {t:'Viel los an Heiligabend?',once:'ws2',if:pro(G),go:async function(A){ await W.say('Um d’ Zeit? D’ Busse aus’m Süden, dann is a Ruah.'); await W.say('Heit Abend fahr i d’ Leit zu ihre Familien. Und um zehne zu ihre andern Familien. Des is mei Weihnachten.'); }},
    {t:'Wie war es am alten Busbahnhof?',once:'ws3',go:async function(A){ await W.say('Drüben am Bahnhof, an der Arnulfstraß’. Freitags hundert Busse nach Jugoslawien. Kartons am Dach, Kinder am Fenster, Hendl in Alufolie.');
        await W.say('D’ Kartn hat’s an oaner Budn gebn. Do drüben, wo jetzt der Fleck is.'); if (G.malaOn && A.malaHere()){ await A.wait(300); await A.g('Er zeigt auf den Pfeiler.'); } }},
    {t:'Frohe Weihnachten.',once:'ws4',if:p==='k4_d1',go:async function(A){ await W.say('Frohe Weihnacht. Heit fahr i bloß Omas. Zur Familie, von der Familie, und zwischendrin a Wurstsemmel.'); }},
    {t:'Was für ein Wetter.',once:'ws5',if:p==='k4_d2',go:async function(A){ await W.say('Batzwetter, sagt ma do. Der Schnee is grau, d’ Leit san grau, und mei Taxi is aa grau. Des war amoi weiß.'); }},
    {t:'Denken Sie noch an Hansi?',once:'ws6',if:F(A,'k4.p.hansi')&&p!=='k4_pro',go:async function(A){ await W.say('Seit Heiligabend schau i jeden Tag zu dem Pfeiler.'); await A.wait(400); await W.say('Bläd, gell? I bin zweiasiebzge. Do derf ma bläd sei.'); }},
    {t:'Haben Sie ein Mädchen gesehen? Mit grauem Schal.',once:'ws7',if:p==='k4_d5',go:async function(A){ await W.say('A Madl mit Schal?'); await A.wait(300); await W.say('I hab heit an Haufen Madl gsehn. Alle mit Schal. Is Winter.'); await A.wait(400); await W.say('Is Eana oane davo? Dann wartn’S. De kemman wieder. Meistens.'); }},
    {t:'Schönen Tag noch.',bye:true,go:async function(A){ await W.say(A.cycle('wsBye',['Eana aa.','Servus. Und ned zu vui mit Pfeilern redn.','Pfiat Gott.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
function busLook(A){ var G=A.G, S=A.S;
  if (S.busIn) return A.m(A.cycle('zbBus',['Der Bus aus Sarajevo. Der Fahrer fegt mit dem Ärmel Schnee von der Zielanzeige: „SARAJEVO – MÜNCHEN“.','Zehn Stunden. Unter den Sitzen liegen die Sonnenblumenkerne einer ganzen Nacht.']));
  return A.m(A.cycle('zbBus2',['Bussteig 14. Ein Ölfleck in der Form eines Busses.','Hier hält heute Abend der nächste aus Sarajevo. Jetzt hält hier nur der Schnee.'])); }
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Die Straße hinaus, an den Gleisen entlang. Dahinter die Stadt, weiß und still, wie an einem Feiertag.',
   canExit:function(A){ return leaveOk(A); },
   g:{look:'Da lang ist die Stadt. Ich war noch nie in einer Stadt, die so leise ist.'}},
 {id:'to_bridge',name:'Zur Hackerbrücke',exit:{to:'hacker'},look:'Eine Treppe hinauf zur Hackerbrücke. Stahlbögen, genietet, mit Schnee auf jeder Niete.',
   canExit:function(A){ return leaveOk(A); },
   g:{look:'Eine Brücke über Züge. Da oben will ich hin. Später.'}},
 {id:'bus',name:function(S){ return S.busIn?'Bus':'Bussteig'; },look:busLook,
   use:function(A){ return A.m(A.S.busIn?'Zurück? Ich bin gerade erst angekommen. Zehn Stunden reichen für ein Jahr.':'Hier fährt gerade keiner nach Sarajevo. Heute Abend wieder. Ohne mich.'); },
   open:function(A){ return A.m(A.S.busIn?'Die Gepäckklappe ist zu. Meine Tasche habe ich. Nadas Dose auch.':'Da ist nichts zu öffnen. Nur ein leerer Steig.'); },
   g:{look:function(A){ return A.g(pro(A.G)?'Ich habe die ganze Nacht Lichter gezählt. Bei Salzburg war ich bei viertausend. Dann hat es geschneit, und ich habe die Flocken gezählt. Das geht nicht.':'Von hier fahren sie nach Hause. Und kommen wieder, mit Dosen voller Plätzchen.'); }}},
 {id:'board',name:'Abfahrtsanzeige',look:'Eine elektronische Abfahrtsanzeige. Zagreb, Prag, Split, Belgrad, Sarajevo. Orange Buchstaben, die ab und zu ruckeln.',
   read:async function(A){ await A.doc({style:'register',title:'ABFAHRT · Departure',lines:['08:15  Zagreb','09:30  Praha','11:00  Split','13:45  Beograd','21:30  Sarajevo','','Ankunft Bussteig 14: Sarajevo 07:40 (+15)']});
     if (A.G.malaOn && A.malaHere() && A.first('zbBoard')){ await A.g('Plus fünfzehn.'); await A.m('Fünfzehn Minuten Verspätung.'); await A.g('Nach zehn Stunden. Das ist pünktlich.'); } },
   use:function(A){ return A.m('Ich tippe auf die Anzeige. Sie zeigt weiter Belgrad an. Elektronik ist auch nicht besser als Papier.'); },
   g:{look:'Sarajevo, einundzwanzig Uhr dreißig. Jeden Abend. Für die, die zurückwollen.'}},
 {id:'pillar',name:'Pfeiler',look:function(A){ var G=A.G;
     if (hansiHere(G) && A.isFound('hansi')) return A.m('Hansi steht auf seinem Fleck neben dem Pfeiler und reibt die Hände. Er friert nicht. Er macht das aus Gewohnheit.');
     if (G.flags['k4.p.hansi']) return A.m('Der helle Fleck im Pflaster neben dem Pfeiler. Leer. Jetzt ist er wirklich leer.');
     return A.m('Ein Betonpfeiler. Daneben ein heller Fleck im Pflaster, viereckig, als hätte dort lange etwas gestanden und wäre gestern erst weggeräumt worden.'); },
   use:'Ich lehne mich an den Pfeiler. Er ist so kalt, wie Beton im Dezember kalt ist.',
   g:{look:async function(A){ var G=A.G; if (hansiHere(G) && !A.isFound('hansi')) return M.k4HansiFind(A);
       if (hansiHere(G)) return A.g('Die Bude ist noch da. Für mich. Ein Schalterfenster, „FAHRKARTEN“, und Zettel, die keiner mehr liest.');
       return A.g(G.flags['k4.p.hansi']?'Die Bude ist weg. Auch für mich. Nur der Fleck ist noch da.':'Hier hat einer lange gestanden. Jetzt nicht mehr.'); },
     sense:function(A){ return A.g(hansiHere(A.G)?'Münzen. Tausende Münzen, durch dieselbe Hand. Und ein Morgen, an dem keiner kam.':'Kalt. Leer. Wie ein Schalter nach Feierabend.'); }}},
 {id:'taxi',name:'Taxi',look:'Ein cremeweißer Mercedes, das Taxischild auf dem Dach. Das Blinklicht blinkt, obwohl er nirgends hinfährt.',
   use:function(A){ return A.m(wastlHere(A.G)?'Ich frage lieber den Fahrer. Taxis fahren in München nicht von allein.':'Leer. Abgeschlossen.'); },
   g:{look:'Ein Auto, das wartet. Wie alle hier.'}},
 {id:'bench',name:'Bank',look:'Eine Bank aus Metallgittern, Schnee in jedem Loch.',use:'Ich setze mich nicht. Wenn ich mich jetzt setze, stehe ich bis Silvester nicht mehr auf.',
   g:{look:'Hier haben Leute gesessen, die auf Busse gewartet haben. Mit Koffern auf den Knien.'}},
 {id:'shops',name:'Ladenpassage',look:'Die Ladenpassage. Gitter vor allen Türen. Ein Zettel: „24.12. geschlossen. Frohe Weihnachten!“ Nur die Wartehalle hat Licht.',
   open:'Die Gitter sind zu. Heiligabend. Selbst der Bäcker hat ein Zuhause.',
   g:{look:'Hinter den Gittern stehen Weihnachtsbäume aus Plastik. Die leuchten auch, wenn keiner da ist.'}},
 {id:'hbf_view',name:'Hauptbahnhof',look:'In der Ferne die Halle des Hauptbahnhofs. Unter der Brücke Gleise, Dutzende, nebeneinander wie Notenlinien.',
   g:{look:function(A){ return A.g(A.first('gHbf')?'Da kommen Züge an. Viele. Ich zähle sie, wenn du nicht hinsiehst.':'Zweiundzwanzig, seit wir hier stehen. Oder dreiundzwanzig. Einer ist nur durchgefahren.'); }}},
 {id:'snow',name:'Schneehaufen',look:'Ein Schneehaufen, den ein Räumfahrzeug hier liegen gelassen hat. Oben weiß, unten grau.',
   take:'Ich forme einen Schneeball. Dann lege ich ihn zurück. Ich bin dreiunddreißig.',
   use:'Ich trete gegen den Haufen. Er bleibt, wo er ist. Ich auch.',
   g:{look:'Ich kann hineingehen, und er bleibt ganz. Das ist das Einzige, was ich Schnee voraushabe.'}},
 {id:'hansi',npc:'hansi',name:'Hansi',vis:function(S,G){ return hansiHere(G); },talk:talkHansi,
   look:'Hansi Kirchmaier. Grauer Kittel, Ärmelschoner, die Ledertasche am Gürtel. Hinter dem Ohr ein Bleistift, mit dem er seit dreizehn Jahren nichts schreibt.',
   g:{look:function(A){ if (!A.isFound('hansi')) return M.k4HansiFind(A); return A.g('Er hält sich gerade, wie einer, den gleich der Chef ansieht. Ich glaube, es kommt kein Chef mehr.'); },talk:talkHansiG,
     listen:'Er summt. Ein Lied aus dem Radio, von vor dreißig Jahren. Er kennt den Text nicht, nur die Stelle, an der man mitsingt.'}},
 {id:'wastl',npc:'wastl',name:'Wastl',vis:function(S,G){ return wastlHere(G); },talk:talkWastl,
   look:function(A){ return A.m(F(A,'k4.p.hansi')&&A.flag('k4.h.told')?'Wastl. Er lehnt am Taxi und sieht ab und zu zum Pfeiler hinüber. Er tut, als sähe er nach dem Schnee.':'Wastl, der Taxifahrer. Groß, breit, rotes Gesicht, weißer Schnurrbart. Er lehnt am Mercedes, die Arme verschränkt, als hätte er den Schnee persönlich bestellt.'); },
   give:{ vanilice:'Wastl: „Plätzchen? Naa, danke. Mei Frau backt für a ganze Kompanie. I bin d’ Kompanie.“', photo_full:'Wastl: „Sarajewo? Do war i nia. Bloß bis Split, mit’m Wohnwagn. Achtzge. Mei Frau hat gweint, wia ma wieder hoam san.“' },
   g:{look:'Er lacht mit dem Bauch. Das habe ich lange nicht gesehen.',listen:'Er redet mit sich selbst. Über den Schnee, glaube ich. Ich verstehe es nicht. Es klingt freundlich und ein bisschen beleidigt.'}}
];
async function leaveOk(A){ var G=A.G; if (!pro(G) || G.flags['k4.p.hansi']) return true;
  if (A.isMala()){ await A.g('Nicht jetzt. Dein Kopf. Ich lasse dich hier nicht allein mit ihm.'); return false; }
  if (!A.isFound('hansi')){ await A.m(A.cycle('zbNoGo',['Mein Kopf. Hier wartet einer. Ich gehe nicht, bevor ich weiß, wer.','Nicht mit diesem Kopf. Erst will ich wissen, wer hier wartet.'])); return false; }
  await A.m(A.cycle('zbNoGo2',['Hansi wartet auf seine Ablösung. Ich lasse ihn nicht so stehen.','Er macht nicht zu, bevor einer kommt. Ich gehe nicht, bevor er zumacht.'])); return false; }
M.room('zob',{ name:'ZOB an der Hackerbrücke', scape:'k4_zob',
  music:function(G){ return G.phase==='k4_d5'?'k4_streit':'k4_muenchen'; },
  state:function(G){ return {busIn:false,hansi:false}; },
  actors:function(S,G){ var L=[]; S.busIn=pro(G) && !G.flags['k4.p.key']; S.hansi=hansiHere(G);
    if (wastlHere(G)){ var w=M.apos('zob','wastl',[364,120,'L']); L.push({id:'wastl',ch:'wastl',x:w[0],y:w[1],f:w[2]||'L',name:'Wastl',idle:'lean',speechY:46,routine:[['idle','lean',8,14],['face','R',2,4],['idle','lean',6,10]]}); }
    if (hansiHere(G)){ var h=M.apos('zob','hansi',[60,121,'F']); L.push({id:'hansi',ch:'hansi',x:h[0],y:h[1],f:h[2]||'F',name:'Hansi',ghost:true,reveal:true,idle:'wait',speechY:46,routine:[['idle','wait',6,10],['anim','count'],['idle','wait',5,9],['anim','look']]}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (A.isMala()){ if (A.first('gZob')) await A.g('Der Busbahnhof. Ohne Marko ist er größer.'); return; }
    if (p==='k4_d5'){ if (A.first('zbD5')) await A.m('Nebel. Die Busse kommen aus dem Weißen und fahren ins Weiße. Kein Mädchen mit Schal.'); return; }
    if (!A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k4_d1' && A.first('zbD1')){ await A.g('Gestern standen wir hier. Mit Hansi.'); await A.m('Heute steht hier keiner.'); await A.g('Doch. Wastl.'); } }
});
})(M);
