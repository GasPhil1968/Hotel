/* ===== rooms/ostbus.js — Ostbusbahnhof: Ankunft im Regen, der Stadtplan vom Kiosk, „MÜNCHEN · subota“, Nadas SMS,
   der Taxistand (der Weg nach Skela, der an niemandem hängt), im Epilog Nadas Ankunft und die Abfahrt nach Sarajevo ===== */
(function(M){
'use strict';
var P=M.P;
function ph(G){ return G.phase; }
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
var DAY=['k3_pro','k3_d1','k3_d2','k3_d3','k3_epi_d'], NIGHT=['k3_pro_n','k3_d1_n','k3_d2_n'];
function kioskOpen(G){ return inP(G,['k3_pro','k3_d1','k3_d2','k3_d3','k3_epi_d']); }
function taxiHere(G){ return G.phase!=='k3_pro_n' && G.phase!=='k3_fin_n' && G.phase!=='k3_epi'; }
function nadaHere(G){ return G.phase==='k3_epi_d' && (!G.flags['k3.e.nada'] || (G.flags['k3.e.mother'] && !G.flags['k3.e.bus'])); }
function loc(id){ return (M.mapLoc&&M.mapLoc(id))||null; }

// ---------------------------------------------------------------- Ankunft (aus 96_k3_story.js: M.startChapter3 ruft das nach dem Bild „Im Bus“)
M.k3Arrive=async function(A){ if (A.flag('k3.p.arrived')) return; A.setFlag('k3.p.arrived');
  A.sfx('busBrake'); await A.wait(500);
  await A.narrate('Mostar. Der Regen kommt schräg unter das Vordach, warm, als hätte jemand das Wetter verwechselt. Den Fluss sieht man von hier nicht. Man hört ihn trotzdem.');
  await A.m('Mala?'); await A.wait(500); await A.g('Hier.'); await A.wait(700);
  await A.g('Sie zieht.'); await A.m('Die Leine?'); await A.faceG('L'); await A.wait(400);
  await A.g('Dahin. Flussab. Weg von hier. Als hätte jemand am anderen Ende gezogen, gerade als wir ausgestiegen sind.');
  await A.m('Wie weit?'); await A.g('Das weiß ich nicht. Für mich ist nichts weit.'); await A.m('Für mich schon.'); await A.wait(400);
  await A.m('Ich brauche einen Plan. Und ein Bett. Am Kiosk drehen sich Stadtpläne im Wind.');
  await M.k3NadaSms(A); };
// Nadas SMS: antworten oder schweigen (k3.p.sms). Nada erinnert sich im Epilog daran.
M.k3NadaSms=async function(A){ if (A.flag('k3.p.sms')!==undefined) return;
  A.sfx('sms'); await A.wait(700); await A.m('Mein Handy. Eine SMS.');
  await A.doc({style:'letter',title:'SMS · Nada',lines:['Jesi li stigao? N.']}); A.note('p3_sms');
  await A.m('„Bist du angekommen?“ Mit einem N. Als könnte es eine andere sein.');
  var c=await A.choose([{t:'(Antworten.) „Stigao sam. Javim se. M.“',id:'yes',silent:true},{t:'(Nicht antworten.)',id:'no',silent:true}],{title:'Nada'});
  A.setFlag('k3.p.sms',c);
  if (c==='yes'){ A.sfx('click'); await A.narrate('Ich schreibe: „Stigao sam. Javim se.“ Angekommen. Ich melde mich. Ich lese es zweimal, bevor ich es abschicke.');
    if (A.G.malaOn){ await A.wait(400); await A.g('Sie liest es auch zweimal.'); await A.m('Woher weißt du das?'); await A.g('Sie hat alles zweimal gelesen. Meine Zeugnisse. Meine Zettel am Kühlschrank.'); } }
  else { await A.m('Später. Wenn ich etwas weiß.');
    if (A.G.malaOn){ await A.wait(500); await A.g('Sie wollte nicht wissen, was du weißt.'); await A.g('Sie wollte wissen, ob du da bist.'); } } };

// ---------------------------------------------------------------- Kiosk: der Stadtplan
async function buyPlan(A){ var K=A.npc('kioskm');
  if (A.has('plan')) return K.say(A.cycle('kmHave',['Sie haben schon einen. Der hält länger als der Regen.','Noch einen? Mostar ist nicht so groß, wie es sich anfühlt.']));
  await A.m('Einen Stadtplan, bitte.'); await K.say('Plan grada. Pet maraka.'); A.sfx('coin'); await A.wait(300);
  A.give('plan'); A.setFlag('k3.p.plan'); ['herberge','kujundziluk','starimost'].forEach(function(l){ A.unlock(l); });
  await A.narrate('Ich falte ihn unter dem Vordach auf. Mostar von der Nordeinfahrt bis zum Südrand, eins zu zehntausend. Der Fluss geht mitten hindurch, grün gedruckt.');
  await K.say('Schlafen? Die Herberge „Neretva“ in der Altstadt. Billig und warm. Sagen Sie Maja, die vom Kiosk schickt Sie. Dann gibt sie Ihnen das Zimmer mit dem Fenster.');
  await A.m('Die Herberge, die Altstadt, die Alte Brücke. Für heute reicht das.');
  if (A.G.malaOn){ await A.wait(400); await A.g('Wo ist der Fluss auf dem Plan?'); await A.m('In der Mitte. Grün.'); await A.g('Er ist nicht grün. Er ist laut.'); } }
// ---------------------------------------------------------------- die Kioskfrau
async function talkKiosk(A){ var K=A.npc('kioskm'), G=A.G, p=G.phase;
  if (p==='k3_epi_d') return kioskEpi(A,K);
  await A.menuLoop(function(){ return [
    {t:'Einen Stadtplan, bitte.',silent:true,if:!A.has('plan'),go:async function(A){ await buyPlan(A); }},
    {t:'Haben Sie alte Postkarten? Von vor dem Krieg?',once:'km1',go:async function(A){ await K.say('Alte? Ich habe neue. Die Brücke von heute. Sieht aus wie die Brücke von früher, nur sauberer.');
        await K.say('Alte hat der Alte im Kujundžiluk. Der verkauft, was keiner will. Manchmal will es doch einer.'); }},
    {t:'Was steht heute in der Zeitung?',once:'km2',go:async function(A){ await K.say(p==='k3_pro'?'Regen. Morgen Bura. Steht da, und mein Knie sagt es auch. Mein Knie ist pünktlicher.':(p==='k3_d1'?'Bura. Dass die Bura weht. Die Zeitung schreibt, was man aus dem Fenster sieht.':'Frost für Sonntag. Und ein Minister. Es ist immer ein Minister.'));
        if (G.malaOn) await A.g('Zeitungen riechen überall gleich. Nach nassem Papier und Leuten, die warten.'); }},
    {t:'Wo hängt eine alte Karte? Eine mit den Dörfern südlich der Stadt.',if:N(A,'l3_area')&&!N(A,'l3_oldmap'),go:async function(A){ await K.say('Mit Dörfern? Ich verkaufe Pläne von heute. Die hören auf, wo die Stadt aufhört.');
        await K.say('Die von früher hängen bei Zdravko an der Wand. Im Café am Westbusbahnhof. Der hat nie etwas abgehängt. Nicht einmal den Kalender von neunzig.'); A.setFlag('k3.oldmap.told'); }},
    {t:'Wann fährt ein Bus nach München?',once:'km3',if:N(A,'p3_munich'),go:async function(A){ await K.say('Samstags. Von hier und von drüben. Hin voll, zurück voll. Dazwischen leer, wie die Häuser.'); }},
    A.askOpt({ p3_munich:'München, samstags, ja. Ich verkaufe denen Zigaretten für die Fahrt. Zwei Stangen, immer zwei.', p3_sms:'Antworten Sie ihr. Wer so schreibt, wartet.', l3_area:'Das ist hinter dem Rand. Meine Pläne haben keinen Süden. Bei Zdravko hängt eine alte Karte, die hat einen.' },'Das steht in keiner Zeitung, die ich habe.'),
    {t:'Danke.',bye:true,go:async function(A){ await K.say(A.cycle('kmBye',['Bitte.','Nehmen Sie eine Zeitung. Gegen den Regen.','Gute Reise, oder gutes Bleiben.'])); }}
  ]; }); }
async function kioskEpi(A,K){ if (A.first('kmEpi')){ await K.say('Fahren Sie?'); await A.m('Nach Sarajevo. Mit dem Bus.'); await K.say('Nehmen Sie eine Postkarte mit. Die Brücke. Damit Sie wiederkommen.'); await A.narrate('Sie schiebt mir eine Karte über die Theke. Die Brücke von heute, im Sommer, mit einem Springer in der Luft. Sie nimmt kein Geld dafür.'); return; }
  return K.say(A.cycle('kmEpi2',['Der Bus wartet nicht. Er tut nur so.','Kommen Sie wieder, wenn es nicht regnet. Es regnet immer, wenn Sie kommen.'])); }
// ---------------------------------------------------------------- der Taxifahrer
async function toSkela(A){ var L=loc('skela'); if (!L||!A.G.map.skela){ await A.npc('taxist').say('Wohin? Sie müssen mir schon sagen, wohin.'); return false; }
  if (!M.ROOMS.skela_d){ await A.m('Skela. Ich weiß, wo es ist. Aber noch nicht, was ich dort soll.'); return false; }
  if (M.k3TravelWhy && M.k3TravelWhy(A.G,L)){ await M.canTravel(A,L); return false; }
  var ok=await M.canTravel(A,L); if (!ok) return false; await A.goto(L.to,{via:'map'}); return true; }
async function talkTaxi(A){ var T=A.npc('taxist'), G=A.G, p=G.phase;
  if (p==='k3_epi_d'){ if (A.first('txEpi')){ await T.say('Sarajevo? Mit dem Bus?'); await A.m('Mit dem Bus.'); await T.say('Ich hätte Sie gefahren. Nach Skela waren Sie mir lieber. Da war wenigstens Schweigen im Auto.'); return; } return T.say(A.cycle('txE2',['Sretan put.','Grüßen Sie Sarajevo. Ich war seit einundneunzig nicht da.'])); }
  await A.menuLoop(function(){ return [
    {t:'Fahren Sie mich nach Skela?',if:!!G.map.skela,go:async function(A){ await T.say(A.first('txSk')?'Skela? Unten an der Biegung. Kenne ich.':'Skela. Steigen Sie ein.'); var ok=await toSkela(A); if (ok) return 'bye'; }},
    {t:'Wo ist im Januar vierundneunzig ein Mädchen ertrunken?',once:'tx1',if:!G.flags['k3.d1.skela'],go:async function(A){ await T.anim('smoke'); await T.say('Hier sind viele ertrunken, Herr.'); await A.wait(500);
        await T.say('Damals hat keiner gezählt. Und die gezählt haben, haben irgendwann aufgehört.'); if (G.malaOn){ await A.wait(400); await A.g('So kommen wir nicht weiter.'); await A.m('Nein. Nicht mit Fragen. Mit etwas, das man messen kann.'); } }},
    {t:'Kennen Sie einen Vlado? Ein Raucher. Er ist früher Mehl gefahren.',if:(N(A,'v3_ljerka')||N(A,'v3_mate'))&&!N(A,'v3_where'),go:async function(A){ await T.say('Vlado.'); await A.wait(400); await T.say('Rajić. Vulkanizer hinter dem Bulevar, drüben. Er flickt mir die Reifen, seit ich Reifen habe.');
        await T.say('Raucht wie ein Ofen und redet wie ein Grab. Früher ist er gefahren, Mehl, im Krieg auch. Seitdem fährt er nachts nicht mehr. Sagt er nicht. Weiß jeder.'); A.note('v3_where');
        if (!G.flags['k3.mala.crossed'] && G.malaOn){ await A.wait(400); await A.g('Drüben.'); await A.m('Drüben.'); } }},
    {t:'Wissen Sie, wo eine alte Karte hängt? Mit den Dörfern im Süden.',if:N(A,'l3_area')&&!N(A,'l3_oldmap'),go:async function(A){ await T.say('Eine alte?'); await T.say('Bei Zdravko. Im Café am Westbusbahnhof. Da hängt eine von fünfundachtzig an der Wand, mit Fliegendreck auf den Dörfern. Ich trinke da meinen Kaffee, wenn ich drüben warte.');
        await T.say('Auf der Karte gibt es Straßen, die es nicht mehr gibt. Und Brücken.'); A.setFlag('k3.oldmap.told'); }},
    {t:'Wie lange fahren Sie schon?',once:'tx2',go:async function(A){ await T.say('Seit achtzig. Mit einer Pause.'); await A.wait(500); await T.say('Die Pause war vier Jahre lang. Danach habe ich wieder angefangen. Der Mercedes auch.'); }},
    {t:'Kennen Sie Zdravko? Vom Café am Westbahnhof.',once:'tx6',if:N(A,'b3_zdravko')||A.flag('k3.x.zdTaxi'),go:async function(A){ await T.say('Zdravko.'); await A.wait(600); await T.say('Wir waren eine Firma. Ein Depot, ein Kaffee um sechs, vor der ersten Tour.'); await A.wait(500); await T.say('Jetzt sind wir zwei Bahnhöfe. Ich fahre von hier. Er schenkt drüben aus.'); await A.wait(600); await T.say('Wenn ich an seinem Fenster vorbeifahre, hebe ich die Hand. Er auch. Das ist unser Gespräch. Seit sechzehn Jahren.'); A.setFlag('k3.x.taxiZd');
        if (G.malaOn){ await A.wait(500); await A.g('Zwei Männer, die winken.'); await A.wait(400); await A.g('Das ist mehr als nichts. Und weniger als ein Kaffee.'); } }},
    {t:'Was läuft im Radio?',once:'tx3',go:async function(A){ await T.say('Sevdah. Und Nachrichten.'); await T.say('Ich höre nur die Musik. Die Nachrichten sind seit zwanzig Jahren dieselben, nur die Namen wechseln.'); if (G.malaOn) await A.g('Das Lied kenne ich. Meine Mutter hat es beim Bügeln gesungen. Falsch.'); }},
    {t:'Zur Herberge „Neretva“, wie weit ist das?',once:'tx4',if:p==='k3_pro',go:async function(A){ await T.say('Fünf Minuten zu Fuß. Ich fahre Sie trotzdem hin. Für zehn Mark.'); await A.m('Ich gehe zu Fuß.'); await T.say('Dann werden Sie nass. Für umsonst.'); }},
    {t:'Kennen Sie den Bus aus München?',once:'tx5',if:N(A,'p3_munich'),go:async function(A){ await T.say('Samstags kommt er. Mit Leuten, die einmal im Jahr nach Hause kommen und dann ein Taxi zum Friedhof wollen. Und dann zum Notar.'); }},
    A.askOpt({ l3_skela:'Skela. Zehn Kilometer, dann Schotter. Da ist eine Brücke, ein paar Häuser und Hunde. Ich fahre Sie hin, wann Sie wollen. Auch nachts.', p3_munich:'München. Der kommt samstags am Westbahnhof an. Die Leute steigen aus und wollen gleich ins Dorf. Mit mir.',
      v3_where:'Rajić, ja. Sagen Sie ihm nicht, dass ich Sie geschickt habe. Er flickt meine Reifen.', l3_area:'Südlich der Stadt? Da sind Dörfer, Pappeln und der Fluss. Auf meiner Karte ist da nichts. Auf der alten bei Zdravko schon.', l3_current:'Dino erzählt das. Der Fluss gibt alles wieder her, sagt er. Ich sage: nicht alles.' },'Davon weiß ich nichts. Ich fahre nur.'),
    {t:'Danke. Ein andermal.',bye:true,go:async function(A){ await T.say(A.cycle('txBye',['Ich bin hier.','Ich stehe hier. Das Taxi auch.','Bis später. Später fahre ich auch.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Epilog: Nada kommt (96_k3_story.js: M.k3StartEpiDay)
M.k3NadaArrives=async function(A){ if (A.flag('k3.e.nada')) return; var G=A.G; G.flags['mala.lock']=true;
  try{ var N0=A.npc('nada'); if (N0.actor) N0.hide();
    var st=M.stand('ostbus','bus')||[96,118,'B']; A.placeM(st[0]+30,st[1],'L'); if (G.malaOn) A.placeG(st[0]+50,st[1]-2,'L');
    A.set('busIn',false); await A.wait(600); await A.m('Gegen Mittag. Der Himmel ist grau und tief, und es ist mild. Der erste Bus aus Sarajevo.'); await A.wait(500);
    A.sfx('busBrake'); A.set('busIn',true); A.set('busTo','sarajevo'); await A.wait(1400);
    var N=A.npc('nada'); if (N.actor){ N.show(); N.actor.fadeIn=A.gt; }
    await A.narrate('Sie steigt als Letzte aus. Der Mantel ist ihr zu groß, wie im Winter in Sarajevo. Sie hat eine Tasche dabei, sonst nichts.');
    await A.wait(500); await N.say('Mali.'); await A.m('Teta Nada.'); await A.wait(700);
    await N.say('Ich habe die ganze Fahrt aus dem Fenster gesehen. An der Neretva entlang. Ich habe gedacht: Hier ist sie gefahren. Oder hier. Oder hier.');
    await A.wait(900); await N.say('Wo ist sie?'); await A.wait(500); await A.m('In Skela. Unter einem Quittenbaum.'); await A.wait(1400);
    await N.say('Unter einem Quittenbaum.'); await A.wait(800); await N.say('Sie mochte keine Quitten. Zu hart. Sie hat gesagt, die sind nur zum Riechen.');
    if (G.malaOn){ await A.wait(700); await A.g('Sie hat sie auf den Schrank gelegt. Jeden Herbst. Das ganze Zimmer hat danach gerochen.'); await A.wait(500); await A.narrate('Mala steht neben ihr, so nah, wie man neben jemandem steht, den man lange nicht gesehen hat. Nada zieht den Mantel enger.'); }
    await A.wait(700); await A.m('Vlado fährt uns hin. Der Mann, der sie damals gefahren hat.'); await A.wait(500); await N.say('Der Fahrer.'); await A.wait(900); await N.say('Dann soll er fahren.');
    A.sfx('truckStart'); await A.wait(600);
    await A.narrate('Am Taxistand hält ein alter Lastwagen, ein TAM, frisch gewaschen. Vlado steigt aus und macht die Beifahrertür auf. Er sagt nichts. Die Zigarette hält er in der Hand, nicht im Mund.');
    A.setFlag('k3.e.nada'); if (N.actor){ N.actor.fadeOut=A.gt; await A.wait(500); N.hide(); }
    await A.m('Skela.');
  } finally { G.flags['mala.lock']=false; } };
// ---------------------------------------------------------------- Epilog: der Bus nach Sarajevo (das „Zurück“ der Rückfahrkarte)
M.k3BusHome=async function(A){ var G=A.G; if (A.flag('k3.e.bus')) return;
  if (!A.flag('k3.e.mother')){ await A.m(!A.flag('k3.e.nada')?'Erst kommt Nada.':(!A.flag('k3.e.mothers')?'Erst Skela. Nada will zu ihr.':'Noch nicht. Es gibt noch etwas, das ich tun muss. Mit dem Handy.')); return; }
  A.setFlag('k3.e.bus'); G.flags['mala.lock']=true; var N=A.npc('nada');
  await N.say('Komm, Mali. Der Fahrer wartet nicht auf Übersetzer.');
  if (A.has('rueckfahrt')){ await A.m('Die Rückfahrkarte. Das Zurück.'); A.take('rueckfahrt'); A.sfx('ticket'); await A.wait(400); }
  var Z=G.rooms&&G.rooms.zimmer; if (Z && Z.dzezva){ Z.dzezva=false; A.give('dzezva'); await A.m('Großmutters Džezva. Maja hat sie mir vom Fensterbrett geholt und in die Hand gedrückt. „Die vergessen Sie nicht.“'); }
  if (G.malaOn){ await A.g('Hin und zurück.'); await A.m('Hin und zurück.'); }
  await A.wait(500); A.sfx('bus'); await A.fade(8,1500); A.music('k3_epi'); M.E.fade=0;
  await A.memory({title:'Im Bus nach Sarajevo',tint:'memory',draw:M.mem&&M.mem.k3_home,lines:[
    'Der Bus fährt aus der Stadt, an der Neretva entlang nach Norden. Grün, tief unten. Diesmal sieht Mala hinunter, ohne die Knie anzuziehen.',
    'Nada sitzt am Fenster. Mala sitzt neben ihr. Ich sitze eine Reihe dahinter.',
    'Nada hat die Hand auf den Sitz neben sich gelegt, als hielte sie ihn frei. Einmal dreht sie sich zum Gang und sieht auf den leeren Platz, und dann wieder hinaus.',
    'Eine von beiden weiß es. Vielleicht beide.']});
  G.flags['mala.lock']=false; await M.endChapter3(A); };
// ---------------------------------------------------------------- Hotspots
function busLook(A){ var G=A.G, S=A.S, p=G.phase;
  if (p==='k3_pro') return A.m(A.cycle('busP',['Der Bus aus Sarajevo. Er steht zwanzig Minuten, dann fährt er weiter, bis Split. Der Fahrer raucht unter dem Vordach.','„SPLIT“ auf dem Leuchtschild. Dieselbe Strecke, die sie gefahren ist. Nur umgekehrt.']));
  if (p==='k3_epi_d' && S.busIn) return A.m(G.flags['k3.e.mother']?'Der Bus nach Sarajevo. Die Gepäckklappe ist zu. Nada steht neben der Tür und wartet auf mich.':'Der Bus aus Sarajevo, „MOSTAR – SARAJEVO“. Der Motor tickt, als er abkühlt.');
  return A.m(A.cycle('busE',['Der Bussteig ist leer. Ein Ölfleck in der Form eines Busses, wo sonst einer steht.','Steig eins. Niemand wartet hier, außer einer Taube.'])); }
async function busUse(A){ var G=A.G, p=G.phase;
  if (p==='k3_epi_d'){ if (G.flags['k3.e.mother']) return M.k3BusHome(A); return A.m(!G.flags['k3.e.nada']?'Nada kommt mit diesem Bus. Ich warte.':'Noch nicht. Erst Skela, dann das Amt, dann das Zurück.'); }
  if (p==='k3_pro') return A.m(A.cycle('busPU',['Der fährt weiter nach Split. Ohne mich. Ich bin angekommen.','Zurück nach Split? Nein. Ich habe eine Rückfahrkarte. Nach Sarajevo, und erst, wenn ich etwas weiß.']));
  return A.m('Hier fährt gerade nichts. Und ich will noch nicht weg.'); }
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Die Straße in die Stadt. Wohnblocks mit Narben im Putz, dahinter der Velež, kahl und hell.',
   canExit:async function(A){ if (!A.has('plan')){ await A.m(A.cycle('exNo',['Ohne Plan finde ich hier nicht einmal den Fluss. Am Kiosk gibt es welche.','Erst der Plan. Am Kiosk.'])); return false; } return true; },
   g:{look:'Da lang ist die Stadt. Die Leine geht woandershin.'}},
 {id:'bus',name:function(S){ return S.busIn?'Bus':'Bussteig'; },look:busLook,use:busUse,open:busUse,
   g:{look:function(A){ var G=A.G; if (G.phase==='k3_pro') return A.g('Ich bin da drin gesessen und habe die Knie angezogen. Bis Jablanica habe ich nicht hinausgesehen. Danach nur noch.'); if (G.phase==='k3_epi_d') return A.g('Nach Hause. Mit ihr. Das habe ich mir anders vorgestellt. Ich habe es mir gar nicht vorgestellt.'); return A.g('Ein leerer Steig. Hier kommen Leute an, die sich die Stadt kleiner vorgestellt haben.'); }}},
 {id:'board',name:'Abfahrtstafel',look:'„POLASCI“. Sarajevo, Split, Dubrovnik, Zagreb, Beograd. Darunter auf einem Emailleschild, gut lesbar: „MÜNCHEN · subota“.',
   read:async function(A){ await A.doc({style:'register',title:'POLASCI · Abfahrten',lines:['Sarajevo · 7:00 · 10:30 · 15:00 · 18:15','Split · 9:15 · 14:30','Dubrovnik · 10:00','Zagreb · 21:00','Beograd · 22:00','','MÜNCHEN · subota']});
     if (!N(A,'p3_munich')){ A.note('p3_munich'); if (A.G.malaOn){ await A.wait(400); await A.g('Jeden Samstag nach München.'); await A.m('Und jeden Samstag einer zurück.'); await A.g('Für die, die zurückwollen.'); } else await A.m('Jeden Samstag einer nach München. Und jeden Samstag einer zurück.'); } },
   use:function(A){ return A.m('Ich fahre mit dem Finger die Zeilen entlang, wie ein Kind. Sarajevo, Split, Dubrovnik. München, samstags.'); },
   g:{look:async function(A){ if (A.first('gDub')){ await A.g('Dubrovnik.'); await A.wait(500); await A.g('Hier steht es noch. In Sarajevo stand es nicht mehr.'); await A.m('Warst du da?'); await A.g('Ich glaube, ja. Ich weiß nicht mehr, mit wem.'); return; } return A.g('München, samstags. Die Leute fahren hin und schicken Geld zurück. Und an Weihnachten sich selbst.'); }}},
 {id:'kiosk',name:'Kiosk',look:function(A){ return A.m(kioskOpen(A.G)?'Ein Kiosk aus Blech und Glas. Zeitungen, Zigaretten, Telefonkarten, Postkarten von der Brücke. Drinnen eine Frau mit Brille, die liest.':'Der Kiosk ist zu. Hinter dem Rollladen ein Lichtstreifen, ein Radio läuft.'); },
   use:function(A){ if (!kioskOpen(A.G)) return A.m('Zu. Bis morgen früh.'); return talkKiosk(A); },
   g:{look:'Kioske riechen überall gleich. Nach Papier und Kälte und Leuten, die schnell etwas brauchen.'}},
 {id:'maps',name:'Stadtpläne',look:function(A){ return A.m(A.has('plan')?'Der Drehständer mit Stadtplänen. Meiner ist schon nass.':'Ein Drehständer voller Stadtpläne, in Folie, die im Wind knistert. „MOSTAR · plan grada“.'); },
   take:function(A){ if (!kioskOpen(A.G)) return A.m('Der Kiosk ist zu.'); if (A.has('plan')) return A.m('Einer reicht.'); return buyPlan(A); },
   use:async function(A){ A.sfx('creak'); await A.m('Ich drehe den Ständer. Er quietscht. Die Kioskfrau sieht über die Brille.'); if (!A.has('plan') && kioskOpen(A.G)) await A.m('Ich sollte einen kaufen, statt ihn zu drehen.'); },
   g:{look:'Lauter Blätter mit der Stadt darauf. Für mich ist eine Stadt kein Blatt. Sie ist ein Geräusch.'}},
 {id:'taxi',name:'Taxi',look:function(A){ return A.m(A.G.phase==='k3_pro'?'Ein alter weißer Mercedes mit Taxischild. Die Scheibenwischer laufen, obwohl niemand drinsitzt. Das Radio auch.':'Der Mercedes. Weiß, alt, sauber. Auf dem Armaturenbrett ein Wackeldackel, der zu allem nickt.'); },
   use:async function(A){ if (!taxiHere(A.G)) return A.m('Der Wagen ist abgeschlossen. Der Fahrer schläft, irgendwo.'); if (!A.G.map.skela) return A.m(A.cycle('taxNo',['Wohin denn? Ich weiß noch nicht, wohin. Die Stadt gehe ich zu Fuß.','Ein Taxi wohin? Erst muss ich wissen, wohin.'])); return toSkela(A); },
   open:'Die Tür ist nicht abgeschlossen. Der Fahrer sieht mich an, als wäre sie es doch.',
   talk:function(A){ if (!taxiHere(A.G)) return A.m('Niemand da.'); return talkTaxi(A); },
   g:{look:'Ein Hund aus Plastik, der nickt. Er nickt zu allem. Ich mag ihn.'}},
 {id:'bench',name:'Bank',look:function(A){ return A.m(A.G.phase==='k3_pro'?'Eine Bank unter der Tafel. Nass bis auf einen trockenen Streifen, wo das Vordach reicht.':'Eine Bank unter der Abfahrtstafel. Wer hier sitzt, sieht die Busse kommen und gehen und fährt selbst nicht.'); },
   use:async function(A){ if (A.G.phase==='k3_pro') return A.m('Im Regen? Ich setze mich nicht. Ich setze mich, wenn ich ein Bett habe.'); await A.m('Ich setze mich eine Minute. Die Tafel klappert, ein Bus kommt, ein Bus fährt.'); if (A.G.malaOn) await A.g('In Sarajevo hast du auf so einer gesessen und „Hin und zurück“ gesagt.'); },
   g:{look:'Auf Bänken an Busbahnhöfen sitzen Leute, die noch nicht wissen, ob sie fahren. Ich kenne das.'}},
 {id:'station',name:'Bahnhof',look:'Der Bahnhof, Flachdach, hohe Fenster, eine Uhr. Zweimal am Tag ein Zug nach Sarajevo, sagt der Fahrplan. Drinnen ist es dunkel.',
   open:'Die Tür geht auf. Drinnen eine Halle, ein Schalter, niemand. Ich mache sie wieder zu.',use:'Heute fahre ich keinen Zug. Ich bin mit dem Bus gekommen, und so fahre ich auch zurück.',
   g:{look:'Züge. Ich bin als Kind mit dem Zug ans Meer gefahren. Glaube ich. Es hat nach Pfirsichen gerochen.'}},
 {id:'puddle',name:'Pfütze',look:function(A){ return A.m(A.G.phase==='k3_pro'?'Eine Pfütze, so groß wie ein Teppich. Der Regen macht Ringe hinein, schneller, als sie vergehen.':'Eine Pfütze vom Regen am Donnerstag. Darin der Himmel, der heute anders aussieht.'); },
   use:'Ich trete hinein. Das war ein Fehler. Meine Schuhe sind jetzt aus Mostar.',take:'Wasser kann man nicht einstecken. Ich habe es versucht, als Kind.',
   g:{look:'Pfützen sind Spiegel ohne mich. Kalt. Ich sehe nur den Himmel darin, keinen Kopf.'}},
 {id:'clock',name:'Bahnhofsuhr',look:function(A){ var t={k3_pro:'Halb eins.',k3_d1:'Zehn nach neun.',k3_d2:'Kurz nach zehn.',k3_d3:'Elf.',k3_epi_d:'Zehn vor zwölf.',k3_d1_n:'Kurz nach elf in der Nacht.',k3_d2_n:'Halb zehn am Abend.'}[A.G.phase]||'Sie geht.'; return A.m('Die Uhr am Bahnhof. '+t+' Sie geht genau. Das ist hier schon etwas.'); },
   g:{look:'Uhren sind für Leute, die zu spät kommen können.'}},
 {id:'kioskm',npc:'kioskm',name:'Kioskfrau',hgt:30,vis:function(S,G){ return kioskOpen(G); },talk:talkKiosk,
   look:'Die Kioskfrau. Rotblondes Haar, toupiert, eine Brille an der Kette, eine Strickjacke. Sie liest eine Illustrierte und sieht trotzdem jeden, der aussteigt.',
   give:{ km:function(A){ if (!A.has('plan')) return buyPlan(A); return A.npc('kioskm').say('Wofür? Sie haben doch alles.'); }, photo_full:async function(A){ var K=A.npc('kioskm'); await K.say('Ein schönes Foto. Alt.'); await A.wait(400); await K.say('Die Kleine kenne ich nicht. Ich kenne nur die, die hier aussteigen.'); },
     plan:'Kioskfrau: „Der ist schon bezahlt. Den behalten Sie.“' },
   g:{look:'Sie hat hier im Krieg auch gestanden. Mit anderen Zeitungen. Sie sieht jeden an, der aussteigt, als könnte er es sein.',listen:async function(A){ await A.g('Sie liest ihr Horoskop halblaut. „Ein Wiedersehen bringt Klarheit.“'); await A.wait(300); await A.g('Sie glaubt es nicht. Sie liest es trotzdem jede Woche.'); }}},
 {id:'taxist',npc:'taxist',name:'Taxifahrer',hgt:46,vis:function(S,G){ return taxiHere(G); },talk:talkTaxi,
   look:function(A){ return A.m(A.G.tod==='night'?'Der Taxifahrer sitzt im Wagen, die Tür offen, das Radio leise. Die Zigarette glimmt.':'Der Taxifahrer. Glatze, grauer Schnauzbart, Lederjacke. Die Zeitung unter dem Arm hat er seit dem Morgen nicht aufgeschlagen.'); },
   give:{ photo_full:async function(A){ var T=A.npc('taxist'); await T.say('Ein Foto mit einer Straßenbahn. Das ist nicht Mostar. Mostar hatte keine Straßenbahn.'); await T.say('Wir hatten Busse und den Fluss.'); }, km:'Taxifahrer: „Bezahlt wird nach der Fahrt. Nicht vorher, nicht dafür.“' },
   g:{look:'Er hört Lieder, in denen jemand am Fenster wartet. Er wartet auch. Auf Fahrgäste. Das ist leichter.',listen:async function(A){ await A.g('Er summt das Lied im Radio mit. Er summt besser, als er redet.'); }}},
 {id:'nada',npc:'nada',name:'Nada',hgt:44,vis:function(S,G){ return nadaHere(G); },
   talk:async function(A){ var N=A.npc('nada'); if (A.flag('k3.e.mother')) return M.k3BusHome(A); if (!A.flag('k3.e.nada')) return M.k3NadaArrives(A); return N.say('Fahren wir.'); },
   look:'Nada. Der zu große Mantel, die Tasche mit beiden Händen. Sie sieht aus wie jemand, der siebzehn Jahre auf einen Bus gewartet hat und jetzt nicht weiß, wohin mit den Händen.',
   g:{look:'Mama.',listen:async function(A){ await A.g('Sie zählt. Leise, unter dem Atem. Die Fenster des Busses. Das hat sie immer gemacht, wenn sie nervös war.'); }}}
];
M.room('ostbus',{ name:'Ostbusbahnhof', scape:'k3_ostbus',
  music:function(G){ return G.phase==='k3_epi_d'?'k3_epi':(G.tod==='night'?'k3_noc':'k3_mostar'); },
  state:function(G){ return {busIn:false,busTo:null}; },
  actors:function(S,G){ var L=[], p=G.phase;
    if (p==='k3_pro'){ S.busIn=true; S.busTo='split'; }
    else if (p==='k3_epi_d'){ S.busIn=!G.flags['k3.e.nada'] || !!G.flags['k3.e.mother']; S.busTo=S.busIn?'sarajevo':null; }   // Nadas Bus, dann die Abfahrt
    else { S.busIn=false; S.busTo=null; }
    if (kioskOpen(G)){ var k=M.apos('ostbus','kioskm',[273,110,'F']); L.push({id:'kioskm',ch:'kioskm',x:k[0],y:k[1],f:k[2]||'F',name:'Kioskfrau',idle:'read',speechY:34}); }
    if (taxiHere(G)){ var t=M.apos('ostbus','taxist',[404,118,'L']); L.push({id:'taxist',ch:'taxist',x:t[0],y:t[1],f:t[2]||'L',name:'Taxifahrer',idle:G.tod==='night'?'smoke':'read',speechY:46,
      routine:[['idle','read',6,11],['idle','smoke',5,9],['face','R',2,4],['idle','smoke',4,7],['face','L',1,2]]}); }
    if (nadaHere(G)){ var n=M.apos('ostbus','nada',[110,114,'R']); L.push({id:'nada',ch:'nada',x:n[0],y:n[1],f:n[2]||'R',name:'Nada',speechY:46}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase;
    // Kann-Liste (Hinweisthema e3c): Wurde Nadas Ankunft beim Laden unterbrochen, kommt ihr Bus, sobald Marko wieder hier ist (vorher kam sie nie)
    if (p==='k3_epi_d' && !G.flags['k3.e.nada'] && !A.isMala() && M.k3NadaArrives) return M.k3NadaArrives(A);
    if (!A.malaHere() || A.isMala() || G.flags['mala.lock']) return;
    if (p==='k3_d1' && A.first('obD1')){ await A.m('Bei Bura sieht der Busbahnhof aus wie frisch gewaschen. Man sieht bis zum Velež, jeden Stein.'); await A.g('Der Wind geht durch mich durch. Das kitzelt.'); }
    else if (p==='k3_d2' && A.first('obD2')){ await A.g('Hier zieht es nicht. Es zieht in die Altstadt. Heute.'); }
    else if (p==='k3_d2_n' && A.first('obN2')){ await A.m('Der Taxistand bei Nacht. Ein Wagen, ein Fahrer, ein Radio.'); await A.g('Skela. Sag es ihm.'); }
    else if (p==='k3_d3' && A.first('obD3')){ await A.m('Sonntag. Der Kiosk hat nur die Hälfte der Zeitungen, und die Hälfte davon von gestern.'); }
    else if (p==='k3_d1_n' && A.first('obN1')){ await A.m('Nachts ist hier nur das Taxi. Und ein Hund, der unter der Bank wohnt.'); }
    else if (p==='k3_epi_d' && from!==undefined && G.flags['k3.e.mother'] && A.first('obEpiBus')){ await A.m('Der Bus nach Sarajevo steht schon da. Nada wartet an der Tür, die Tasche vor dem Bauch.'); await A.g('Ich setze mich neben sie.'); await A.m('Und ich?'); await A.g('Hinter uns. Damit du siehst, dass ich nicht herausfalle.'); } }
});
})(M);
