/* ===== 97_k4_fam_b.js — Kapitel 4, Familie (S1), Teil B: Schlüsseldialog 2 „Ich war dabei“ auf der Hackerbrücke
   (M.k4Bridge, M.k4BridgeResume, z4_dabei gibt das Skript), der Silvesterabend (M.k4SilvesterEve, M.k4FinAResume; Bleigießen
   und Spur in rooms/ana.js), die Fahrt (M.k4Ride), das Silvestergespräch in Zimmer 214 in acht Zügen (M.k4Silvester,
   Zwischenstände 1–3, M.k4FinResume) und der Epilog (M.k4Epilogue). Konzept 4.5, 7.3 C, 8.2, 9.2, 10.3. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function N(A,id){ return A.hasNote(id); }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function yes(A){ return M.k4Variant(A.G)==='yes'; }
function consent(){ return (M.k4Carry&&M.k4Carry.consent)||'b'; }
async function lock(A,fn){ var G=A.G, lk=G.flags['mala.lock']; G.flags['mala.lock']=true; try{ await fn(); } finally { G.flags['mala.lock']=lk||false; } }
// ---------------------------------------------------------------- Schlüsseldialog 2: „Ich war dabei“ (Freitagnacht, Hackerbrücke, Nebel)
var bridgeRun=false;
M.k4Bridge=async function(A,resumed){ var G=A.G; if (F(A,'k4.d5.bridge') || bridgeRun) return; bridgeRun=true;
  try{ await lock(A,async function(){
    var mr=M.apos('hacker','mala_rail',M.apos('hacker','mala',[200,108,'L'])), mk=M.apos('hacker','marko_rail',[178,124,'R']);
    A.placeM(mk[0],mk[1],mk[2]||'R'); if (G.malaOn){ A.placeG(mr[0],mr[1],mr[2]||'L'); A.idleG('sit'); }
    A.music('k4_bruecke'); await A.wait(600);
    await A.narrate(resumed?'Die Hackerbrücke, nachts, im Nebel. Mala sitzt wieder auf dem Geländer. Ich stehe daneben.':'Die Hackerbrücke, nachts. Unter uns kommen die Züge herein und fahren wieder, als wäre das nichts. Mala sitzt auf dem Geländer. Ich nicht.');
    await A.m('Du sitzt auf einem Geländer über vierzig Gleisen.'); await A.g('Ich falle nicht. Das ist noch eins von den guten Dingen.');
    var c1=await A.choose([{t:'Ich habe dich gesucht. Am Gleis elf. Im Heim. Bei Ana.',id:'a'},{t:'Komm da runter. Bitte.',id:'b'}],{title:'Mala'});
    if (c1==='b'){ await A.g('Nein. Hier ist es gut.'); await A.m('Ich habe dich gesucht. Am Gleis elf. Im Heim. Bei Ana.'); }
    await A.g('Ich war hier. Ich habe Züge gezählt. Hundertvier.'); await A.m('Seit wann?'); await A.g('Seit du gesagt hast: Du hast in meinem Leben gelesen wie in einem Ort.');
    var c2=await A.choose([{t:'Das war gemein.',id:'a'},{t:'(Schweigen.)',id:'b',silent:true}],{title:'Mala'});
    if (c2==='b'){ await A.wait(1200); await A.g('Du willst sagen, das war gemein.'); await A.m('Das war gemein.'); }
    await A.g('Es war gemein und richtig. Das geht.');
    A.sfx('trainIn'); await A.wait(900); await A.narrate('Ein Zug fährt unter uns durch. Dann ist es wieder still.');
    await A.m('Ich will dir etwas erzählen. Du hast nicht gefragt. Deshalb.'); await A.g('Ich weiß, was du erzählen willst.');
    await A.m('Nein. Du weißt, was du gehört hast. Aus Mamas Kiste. Baka, ich, der Zettel. Das ist nicht dasselbe.'); await A.wait(800); await A.g('…');
    for (var w=0;w<6;w++){ var c3=await A.choose([{t:'(Erzählen.)',id:'go',silent:true},{t:'(Noch warten.)',id:'wait',silent:true}],{title:'',conv:false}); if (c3==='go') break;
      await A.wait(1300); await A.narrate(A.cycle('brW',['Ein Güterzug, endlos. Mala zählt die Wagen nicht laut.','Der Nebel kommt die Treppe herauf. Unten summt die Oberleitung.','Mala wartet. Sie kann das. Sie hat siebzehn Jahre geübt.'])); }
    await A.m('Es war ein Montag. Neunzehnter April. Das erste Mal warm in dem Jahr. Ich hatte eine Jacke an und habe geschwitzt, und er hat gelacht, weil ich sie nicht ausziehen wollte.');
    await A.m('Wir hatten zwei Kanister. Blau. Er hat VUKOVIĆ draufgeschrieben, mit roter Farbe, damit sie keiner mitnimmt. Als ob einer Kanister mitnimmt, auf denen ein Name steht.');
    await A.m('Die Schlange ging bis zur Brücke. Er hat mich hinten anstehen lassen, für Dragica. Er wollte vorn fragen, ob der Druck wieder da ist. Er hat „Druck“ gesagt. Wie bei einer Brücke.');
    await A.memory({title:'Erinnerung – der Neunzehnte April',tint:'memory',draw:M.mem&&M.mem.k4_april,lines:[
      'Eine Mauer. Frühling. Die Schlange geht bis zur Brücke, mit Kanistern, Flaschen, einem Kinderwagen ohne Kind.',
      'Vor mir zwei blaue Kanister, VUKOVIĆ in roter Schrift. Ich stehe für Dragica an. Die Jacke klebt mir am Rücken.',
      'Vorn, ganz vorn, ein Mann mit hochgekrempelten Ärmeln. Er dreht sich um und hebt die Hand.',
      'Er sagt etwas, das ich nicht höre. Ich glaube, er sagt: Druck.']});
    await A.wait(900); await A.m('Dann war es laut. Dann war es nicht mehr laut. Einer hat mich festgehalten und gesagt: Nemoj gledati, mali. Schau nicht hin, Kleiner.');
    await A.wait(1600); await A.m('Ich habe hingeschaut.'); A.note('z4_dabei');
    await A.wait(2400); A.sfx('trainIn'); await A.narrate('Lange sagt keiner etwas. Ein Zug fährt aus, Richtung Salzburg.'); await A.wait(800);
    await A.m('Danach habe ich die Kanister gefüllt. Beide. Ich habe angestanden, als wäre nichts. Und ich habe sie zu Baka getragen, hinauf nach Vratnik, und keinen Tropfen verschüttet.');
    if (M.k4Carry && M.k4Carry.father) await A.m('Den Weg kennst du. In Sarajevo bin ich ihn mit dir hinaufgegangen, nach Vratnik, und habe nichts gesagt.');
    await A.g('Du bist zurückgekommen.'); await A.m('Mit dem Wasser.');
    await A.g('Und Baka wollte „poginuo“ schreiben.');
    var c4=await A.choose([{t:'Und ich habe gesagt: Schreib „nije se vratio“.',id:'a'},{t:'(Nicken.)',id:'b',silent:true}],{title:'Mala'});
    if (c4==='b'){ await A.wait(900); await A.m('Ja. Und ich habe gesagt: Schreib „nije se vratio“.'); }
    await A.m('Dann fragt Mama nicht, woher wir es wissen. Dann muss keiner sagen, dass ich dabei war.');
    await A.m('Ich war vierzehn. Ich habe gedacht, das ist ein Wort für „tot“, das man aushalten kann.'); await A.g('Für dich.'); await A.m('Für mich.');
    await A.wait(900); await A.g('Ich habe es gehört. In der Kiste. Deine Stimme. Du hattest noch die hohe.'); await A.m('Und hast nichts gesagt.');
    await A.g('Du hast in Mostar gesagt: frag nicht. Ich habe nicht gefragt. Und dann habe ich nichts gesagt. Ich wollte dich schonen. Fünf Tage.');
    var c5=await A.choose([{t:'Fünf Tage.',id:'a'},{t:'(Schweigen.)',id:'b',silent:true}],{title:'Mala'});
    if (c5==='b') await A.wait(1200);
    await A.g('Bei dir sind es achtzehn Jahre. Bei mir waren es siebzehn. Bei Sepp neunundvierzig. Ich bin billig davongekommen.');
    await A.m('Es war schlimm. Zu merken, dass du es weißt, und ich weiß nicht, seit wann.'); await A.g('Ja.');
    await A.m('So wird es für sie. Für Mama. Dass ich es weiß. Seit achtzehn Jahren.');
    await A.g(F(A,'k4.d2.wait')?'Ana will nach Neujahr.':'Ana will warten. Bis Silvester vorbei ist.');
    var c6=await A.choose([{t:'Ich nicht. Morgen. In diesem Jahr.',id:'a'},{t:'Nach Neujahr ist zu spät. Morgen.',id:'b'}],{title:'Mala'});
    if (c6==='b') await A.m('In diesem Jahr noch.');
    await A.g('Du hast es selbst aufgeschrieben. Derselbe Satz, zwei Städte.'); await A.m('Ich übersetze seit achtzehn Jahren. Diesen einen nie.'); await A.g('Dann morgen.');
    await A.wait(1300); await A.g('Und noch etwas. Weil wir jetzt nichts mehr schonen. Dein Kopf.'); await A.m('Was ist mit meinem Kopf?');
    await A.g('Am Bahnhof war es Sepp. Im Heim war es Gerda. Da habe ich mich geirrt, ich dachte, ich bin es. Aber gestern, als wir gestritten haben, war keiner da außer mir. Und du hast dir die Schläfe gehalten.');
    await A.m('Ja.'); if (!N(A,'r4_ursache')) A.note('r4_ursache',true);
    await A.g('Wenn ich dir wehtue, sage ich es. Auch wenn du „nur müde“ sagst.');
    var c7=await A.choose([{t:'Und wenn ich nicht mehr kann, sage ich es.',id:'a'},{t:'Und ich sage es dir auch.',id:'b'}],{title:'Mala'});
    if (c7==='b') await A.m('Wenn ich nicht mehr kann.');
    await A.m('Nicht „nicht zurückgekommen“. Den richtigen Satz.'); await A.g('Den richtigen.');
    var cs=consent(); await A.wait(700);
    if (cs==='c') await A.g('Gefragt habe ich dich noch nicht. In München, habe ich gesagt. Ich frage dich, wenn deine Mutter es weiß. Sonst sagst du Ja, damit wenigstens eine Sache leicht ist.');
    else if (cs==='a') await A.g('Am Grab hast du „Ja“ gesagt. Einfach so. Jetzt weißt du, wie es nicht einfach ist.');
    else await A.g('Am Grab hast du gesagt: Wenn es zu schwer wird, sagen wir es. Wir haben es beide nicht gesagt. Bis heute.');
    await A.wait(1100); A.setFlag('k4.bond'); A.sfx('shimmer'); A.rebuild();
    await A.narrate('Unten fährt ein Zug ein, mit Schnee auf dem Dach, aus Salzburg vielleicht. Mala steigt vom Geländer, ohne dass es einen Laut macht.');
    A.idleG(null); await A.walkG(mk[0]+20,mk[1]-2); await A.faceG('L');
    await A.g('Gehen wir. Gegenüber bügelt sicher wieder eine.'); await A.m('Die bügelt immer.'); await A.g('Dann ist wenigstens auf eine Verlass.');
    A.setFlag('k4.d5.bridge'); await A.wait(900); delete G.flags['k4.bond']; A.rebuild(); }); }
  finally { bridgeRun=false; }
  await M.k4DayCheck(A); };
M.k4BridgeResume=async function(A){ if (F(A,'k4.d5.bridge')) return M.k4DayCheck(A); return M.k4Bridge(A,true); };
// ---------------------------------------------------------------- Silvesterabend bei Ana (das Bleigießen und Mamas Weggang startet der Spieler am Tisch, rooms/ana.js)
M.k4SilvesterEve=async function(A){ var G=A.G; if (F(A,'k4.fin.eve')) return; A.setFlag('k4.fin.eve');
  var An=A.npc('ana'), T=A.npc('tobias'), Mi=A.npc('mia'), Ni=A.npc('niko'), J=A.npc('jasna');
  await lock(A,async function(){
    if (G.malaOn && A.malaHere()){ var w=M.apos('ana','mala',[440,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    await A.narrate('Silvester. Mittags habe ich es bei Mama versucht. Sie hat Vanilice gebacken, drei Bleche, für Anas Fest. Jedes Mal, wenn ich „Mama“ gesagt habe, hat sie ein Blech aus dem Ofen gezogen.');
    await A.narrate('Jetzt ist es sieben, Anas Wohnung, Raclette. Luftschlangen an der Lampe, und der Baum von Weihnachten, mit allen Sternen bis auf einen.');
    await Mi.say('Onkel Marko! Ich darf bis zwölf aufbleiben!'); await T.say('Sretna Nova godina! Heute stimmt es!'); await A.wait(300); await A.narrate('Mama lacht. Zweimal.');
    if (G.malaOn && A.malaHere()){ if (Ni.actor) Ni.anim('stare'); await Ni.say('Das Mädchen ist wieder da.'); await An.say('Bobo ist wieder da?'); await Ni.say('Sie heißt nicht Bobo.'); await A.wait(400); await A.g('Er weiß, dass ich nicht Bobo heiße.'); }
    await An.say('Um elf gießen wir Blei. Tobias hat ein Buch. Bis dahin: Käse.');
    var c=await A.choose([{t:'Mama.',id:'mama'},{t:'(Zum Käse.)',id:'cheese',silent:true}],{title:''});
    if (c==='mama'){ await A.wait(500); await J.say('Später. Iss.'); if (G.malaOn && A.malaHere()){ await A.wait(400); await A.g('Sie weiß, dass etwas kommt.'); } }
    else await A.narrate('Ich schiebe ein Pfännchen unter den Grill. Mama schiebt meins zurecht, ohne hinzusehen.'); }); };
M.k4FinAResume=async function(A){ var G=A.G; G.flags['mala.lock']=false; if (F(A,'k4.fin.gone')) return M.k4DayCheck(A);
  if (!A.room || A.room.id!=='ana') await M.k4Bring(A,'ana'); if (!F(A,'k4.fin.eve')) return M.k4SilvesterEve(A); };
// ---------------------------------------------------------------- Die Fahrt zum Bavariapark (das Gerüst fragt nach dem Weg, k4.fin.ride)
M.k4Ride=async function(A){ var G=A.G, r=A.flag('k4.fin.ride')||'tram'; G.flags['mala.lock']=true;
  try{ A.music('k4_silvester');
    if (r==='walk'){ await A.narrate('Ich gehe zu Fuß. Über die Isar, durch eine Stadt, die knallt und raucht. Über mir zerplatzt der Himmel in Farben. Ich zähle nicht.');
      if (G.malaOn){ await A.g('Du zählst doch.'); await A.m('Nur die Straßen.'); }
      await A.narrate('Um Mitternacht stehe ich auf einer Brücke über der Isar, und um mich herum küssen sich Fremde. Es ist zwanzig nach zwölf, als ich am Bavariapark ankomme.'); }
    else if (r==='davor'){ A.sfx('engine');
      await A.narrate('Davor ist nach zwölf Minuten da. Auf dem Rücksitz Lena, im Schlafanzug unter dem pinken Anorak. Sie hat darauf bestanden.');
      await A.npc('davor').say('Diesmal ist keiner zu spät.'); await A.npc('lena').say('Papa fährt sonst nie so schnell. Nie.');
      if (G.malaOn) await A.g('Er fährt, als wüsste er, wohin.'); await A.narrate('Um Viertel vor zwölf hält er vor dem Haus am Bavariapark. Er stellt den Motor nicht ab. „Ich warte“, sagt er.'); }
    else { A.sfx('tramBell');
      await A.narrate('Die Nachttram ist voll mit Leuten, die singen. Einer bietet mir Sekt aus der Flasche an. Ich stehe an der Tür, die Hand an der Stange, wie Mama.');
      if (G.malaOn){ await A.narrate('Mala sitzt am Fenster und zählt bei jeder Rakete bis drei.'); await A.g('Jedan, dva, tri.'); await A.m('Hör auf.'); await A.g('Sie hat es auch gemacht. Ich will wissen, wie es sich anfühlt.'); await A.wait(400); await A.g('Es fühlt sich an wie Warten.'); }
      await A.narrate('Kurz vor Mitternacht steige ich am Bavariapark aus.'); } }
  finally { G.flags['mala.lock']=false; } };
function late(A){ return A.flag('k4.fin.ride')==='walk'; }
// ---------------------------------------------------------------- Das Silvestergespräch, Zimmer 214 (S3 ruft es beim Betreten auf; Konzept 7.3 C3)
var finRun=false;
function jasnaH(A){ var ids=['jasnaC','jasna','jasnaW']; for (var i=0;i<ids.length;i++){ var h=A.npc(ids[i]); if (h.actor) return h; }
  var p=M.apos('heim214','jasna_window',[262,118,'L']); return A.spawn({id:'jasnaC',ch:'jasnaC',x:p[0],y:p[1],f:p[2]||'L',name:'Mama',idle:'sit',talk:'sitTalk',speechY:36,fadeIn:false}); }
async function setup(A){ var G=A.G, c=M.apos('heim214','marko_chair',[150,124,'R']); A.placeM(c[0],c[1],c[2]||'R'); A.idleM('sit');
  if (G.malaOn && A.malaHere()){ var m=M.apos('heim214','mala',[290,118,'L']); A.placeG(m[0],m[1],m[2]||'L'); }
  A.music('k4_fin'); return jasnaH(A); }
async function step(A,n){ A.setFlag('k4.fin.step',n); }
// Zug 1: der Einstieg
var ALSO1=['z4_dabei','z4_vermisst','z4_kolar','z4_ana2004'];
async function move1(A,J){ for (var guard=0;guard<12;guard++){
    var n=await A.askNote('Womit fange ich an?',{also:ALSO1});
    if (n==='z4_dabei'){ await A.m('Ich war dabei.'); await A.wait(1500); await J.say('Wobei?'); return step(A,1); }
    if (n==='z4_kolar'||n==='z4_ana2004'){ await A.m('Sie haben ihn gefunden.'); await A.wait(1300); await J.say('Ich habe keine Probe gegeben.'); await A.wait(900);
      await A.m('Ana. Zweitausendvier.'); A.setFlag('k4.fin.anaEarly'); await A.wait(1200); await J.say('Dann wisst ihr ja alles.');
      await A.narrate('Sie steht auf und geht hinaus, auf den Flur. Die Tür bleibt offen.'); if (J.actor) J.hide();
      if (A.G.malaOn){ await A.wait(600); await A.g('Nicht so.'); await A.wait(400); await A.g('Fang bei dir an.'); }
      await A.wait(1600); await A.narrate('Eine halbe Minute. Draußen knallt es. Dann kommt sie zurück und setzt sich wieder ans Fenster.'); if (J.actor) J.show(); await J.say('Noch einmal. Von vorn.'); continue; }
    if (n==='z4_vermisst'){ await A.m('Baka hat geschrieben, er ist nicht zurückgekommen. Und du hast „vermisst“ gelesen.'); await A.wait(1100); await J.say('Das weiß ich seit achtzehn Jahren.');
      if (A.G.malaOn){ await A.wait(500); await A.g('Nicht den Satz. Was er bedeutet hat.'); } continue; }
    if (!n){ await J.say('Ich warte. Ich kann warten. Ich habe achtzehn Jahre geübt.'); continue; }
    await J.say('Deswegen bist du nicht hier, Marko.'); }
  await A.m('Ich war dabei.'); await J.say('Wobei?'); return step(A,1); }
// Zug 2: der Tag
async function move2(A,J){ var c=await A.choose([{t:'(Erzählen. Alles.)',id:'all',silent:true},{t:'(Erzählen. Nur, was war.)',id:'short',silent:true}],{title:'Mama'});
  await A.m('Am neunzehnten April. An der Brauerei. Wasser holen. Ich war mit ihm dort. Er hat mich hinten anstehen lassen, für Dragica.');
  if (c==='all') await A.m('Es war warm. Er hat gelacht, weil ich die Jacke nicht ausziehen wollte. Er hat VUKOVIĆ auf die Kanister geschrieben, mit roter Farbe.');
  await A.memory({title:'Erinnerung – der Neunzehnte April',tint:'memory',draw:M.mem&&M.mem.k4_april,lines:['Die Schlange bis zur Brücke. Zwei blaue Kanister, VUKOVIĆ in roter Schrift.','Vorn hebt einer die Hand.','Dann ist es laut. Dann ist es nicht mehr laut.']});
  await A.m('Einer hat mich festgehalten. Nemoj gledati, mali.'); await A.wait(1200); await A.m('Ich habe hingeschaut.');
  await A.wait(1300); await A.narrate('Mama dreht sich vom Fenster weg. Zum ersten Mal sieht sie mich an.'); if (J.actor) J.face('R');
  await A.wait(900); await A.m('Danach habe ich die Kanister gefüllt und zu Baka getragen. Keinen Tropfen verschüttet.'); await A.wait(1100); await J.say('…'); return step(A,2); }
// Zug 3: der Satz
var ALSO3=['z4_zweistaedte','z4_tot','z4_vermisst','z4_lesart'];
async function move3(A,J){ for (var guard=0;guard<12;guard++){
    var n=await A.askNote('Was sage ich ihr über den Satz?',{also:ALSO3});
    if (n==='z4_zweistaedte'){ await A.m('Baka wollte „poginuo“ schreiben. Ich habe gesagt: „nije se vratio“.'); await A.wait(700);
      await A.m('In Sarajevo hieß das damals: tot, und keiner kann es aussprechen. Du hast es in München gelesen.'); await A.wait(2300);
      await J.say('Ich habe „vermisst“ gelesen.'); await A.wait(900); await J.say('Achtzehn Jahre. Ich habe „vermisst“ gelesen, und ihr habt „tot“ geschrieben.'); return step(A,3); }
    if (n==='z4_tot'){ await A.m('In Sarajevo hieß „nije se vratio“ tot. Baka wusste es.'); await A.wait(1000); await J.say('Dann hat Ruža gelogen.'); if (A.G.malaOn){ await A.wait(500); await A.g('Nicht Ruža. Er.'); } continue; }
    if (n==='z4_vermisst'||n==='z4_lesart'){ await J.say('Ich kann lesen, Marko. Da stand nicht „tot“.'); if (A.G.malaOn){ await A.wait(500); await A.g('Das ist ihre Hälfte. Deine fehlt.'); } continue; }
    if (!n){ await J.say('Was hast du gesagt? Du warst vierzehn. Was hast du zu ihr gesagt?'); continue; }
    await J.say('Nein. Der Satz, Marko. Ihr Satz.'); }
  await A.m('Ich habe Baka gebeten, „nije se vratio“ zu schreiben. Es hieß tot.'); return step(A,3); }
// Zug 4: ihr Stück
async function move4(A,J){ var c=await A.choose([{t:'(Warten.)',id:'wait',silent:true},{t:'Mama …',id:'mama'}],{title:''});
  await A.wait(c==='wait'?2600:1200); await A.narrate('Draußen blitzt es grün. Sie zählt nicht.'); await A.wait(900);
  await J.say('Ich bin ohne dich gefahren.'); await A.wait(1300);
  await J.say('Zweiundneunzig. Ich habe Ana genommen und bin in den Bus gestiegen, und du warst bei Baka. Zoran hat gesagt, ihr kommt nach.'); await A.wait(1100);
  await J.say('Ich bin ohne dich gefahren.'); return step(A,4); }
// Zug 5: die Kurve
var ALSO5=['z4_kurve','z4_passierschein','z4_kurve_ana','z4_ankunft'];
async function move5(A,J){ var G=A.G;
  if (G.malaOn){ await A.wait(900); await A.g('Sag ihr das mit der Kurve.'); if (!N(A,'z4_kurve') && N(A,'z4_passierschein') && N(A,'z4_kurve_ana')) A.note('z4_kurve'); }
  for (var guard=0;guard<10;guard++){
    var c=await A.choose([{t:'(Etwas aus dem Notizbuch sagen.)',id:'note',silent:true,noGray:true},{t:'Ihr musstet fahren. Ich war bei Baka.',id:'plain'}],{title:'Mama'});
    if (c==='plain'){ await A.wait(900); await J.say('Ich hätte bleiben können.'); await A.wait(800); await J.say('Ich hätte aussteigen können.'); A.setFlag('k4.fin.kurve',false); return step(A,5); }
    var n=await A.askNote('Was sage ich ihr?',{also:ALSO5});
    if (n==='z4_kurve'||n==='z4_passierschein'){ await A.m('Du hast aus dem Fenster gesehen. Bis zur Kurve.'); await A.wait(1500); await J.say('Woher …'); await A.wait(700); await A.m('Ich weiß es.');
      await A.wait(1600); await J.say('Du hast immer zu viel gewusst. Schon als Kind.'); A.setFlag('k4.fin.kurve'); return step(A,5); }
    if (n==='z4_kurve_ana'){ await A.m('Ana sagt, du hast nie wieder am Fenster gesessen.'); await A.wait(900); await J.say('Ana redet zu viel.'); if (G.malaOn){ await A.wait(400); await A.g('Nicht was sie danach getan hat. Was sie gesehen hat.'); } continue; }
    if (n==='z4_ankunft'){ await J.say('Die Ankunft. Ja. Die habe ich dir erzählt. Die ist leicht.'); continue; }
    if (!n) continue; await J.say('Nein. Nicht das.'); }
  return step(A,5); }
// Zug 6: der Fund
async function move6(A,J){ var y=yes(A);
  var c=await A.choose([{t:y?'Sie haben ihn gefunden.':'Sie haben ihn wahrscheinlich gefunden. Ich habe meine Probe gegeben.',id:'a'},{t:'Frau Kolar hat angerufen. Aus Mostar.',id:'b'}],{title:'Mama'});
  if (c==='b') await A.m(y?'Sie haben ihn gefunden.':'Sie haben ihn wahrscheinlich gefunden. Ich habe meine Probe gegeben.');
  await A.wait(1100);
  if (F(A,'k4.fin.anaEarly')){ await J.say('Ana. Zweitausendvier. Das hast du schon gesagt.'); await A.wait(500); await J.say('Hinter meinem Rücken.'); }
  else { await J.say('Ich habe keine Probe gegeben.'); await A.m('Ana. Zweitausendvier. Und ich.'); await A.wait(900); await J.say('Hinter meinem Rücken.'); }
  await A.m('Ja. Weil wir dich schonen wollten. Alle.'); return step(A,6); }
// Zug 7: Alois
async function move7(A,J){ await A.wait(900); await A.narrate('Mama sieht zum Bett, wo Alois schläft, die grüne Kanne im Arm.'); await A.wait(600);
  await J.say('Schonen.'); await A.wait(700); await J.say('Ich bin Pflegerin, Marko. Man sagt „später“ und hofft, dass sie es vergessen.'); await A.wait(900);
  await J.say('Er wartet nicht mehr. Seit Donnerstag. Seit der Kanne.');
  var c=await A.choose([{t:'Weil er weiß, wo sie ist.',id:'a'},{t:'Weil ihm einer die Wahrheit gesagt hat. In seiner Sprache.',id:'b'}],{title:'Mama'});
  if (c==='b'){ await J.say('In seiner Sprache.'); await A.wait(500); await A.m('Er weiß, wo sie ist.'); }
  await A.wait(1200); await J.say('Und wo ist Zoran?'); await A.wait(1300);
  await A.m('In Sarajevo. Seit zweitausenddrei mit einer Nummer.'); await A.wait(900); await A.m('Er wartet nicht. Wir haben gewartet.'); return step(A,7); }
// Zug 8: Mitternacht
async function move8(A,J){ var y=yes(A);
  await A.wait(1200); A.sfx('fireworks'); A.sfx('firework');
  await A.narrate(late(A)?'Halb eins. Draußen schießen sie die letzten Raketen ab, die von Mitternacht übrig sind.':'Mitternacht. Draußen geht die ganze Stadt auf einmal los. Das Zimmer wird rot, grün, weiß. Alois schläft weiter, mit der Kanne.');
  await A.wait(1600); await J.say('Ich will ihn sehen.'); await A.wait(1300); await J.say('Ich fahre hin.'); A.setFlag('k4.fin.decide');
  var c=await A.choose([{t:y?'Ich komme mit.':'Ich komme mit. Meine Probe ist schon dort.',id:'a'},{t:'(Ihre Hand nehmen.)',id:'b',silent:true}],{title:'Mama'});
  if (c==='b'){ await A.narrate('Ich nehme ihre Hand. Sie ist kalt vom Fenster. Sie zieht sie nicht weg.'); await A.wait(700); await A.m('Ich komme mit.'); }
  await A.wait(900); await J.say('Im März.'); await A.wait(500); await J.say('Ich setze mich ans Fenster.'); return step(A,8); }
// Anas Ankunft und der Schluss
async function finEnd(A,J){ var G=A.G;
  await A.wait(1300); A.sfx('door'); var d=M.stand('heim214','door')||[40,124,'R'];
  var An=A.npc('anaC'); if (!An.actor) An=A.spawn({id:'anaC',ch:'anaC',x:d[0],y:d[1],f:'R',name:'Ana',speechY:44});
  await A.narrate(late(A)?'Zehn nach eins. Ana kommt herein, Schnee im Haar, die Mütze in der Hand.':'Zwanzig vor eins. Ana kommt herein, Schnee im Haar, die Mütze in der Hand.'); A.setFlag('k4.fin.ana');
  if (An.actor) await An.walk(d[0]+40,d[1]);
  await J.say('Du hast zweitausendvier Blut gegeben.'); await A.wait(900); await An.say('Ja.'); await A.wait(500); await An.say('Du hast mir auch nichts gesagt. Keiner sagt hier was.');
  await A.wait(1300); await J.say('Dann jetzt. Alle.'); await A.wait(700); await J.say('Bis es hell wird.');
  if (An.actor) An.anim('hug'); await A.wait(1500); await A.narrate('Ana setzt sich auf die Bettkante, vorsichtig, wegen Alois. Mama rückt ihr den Schal zurecht. Draußen pfeift eine letzte Rakete.');
  await A.wait(1300); await J.say('Marko.'); await A.wait(500); await J.say('Du hast das Wasser nach Hause getragen?'); await A.m('Ja.'); await A.wait(1300); await J.say('Dann bist du zurückgekommen.');
  if (G.malaOn && A.malaHere()){ await A.wait(1300); await A.g('Zurückgekommen.'); }
  A.setFlag('k4.fin.done'); }
async function talkFrom(A,from){ var G=A.G; if (finRun) return; finRun=true;
  try{ G.flags['mala.lock']=true; var J=await setup(A); A.setFlag('k4.fin.talk');
    if (from<=1){ if (from<1){
        await A.narrate(late(A)?'Zimmer 214. Dunkel, nur das Nachtlicht über dem Bett. Alois schläft, die grüne Kanne im Arm. Am Fenster sitzt Mama, im Mantel. Das neue Jahr ist zwanzig Minuten alt.':'Zimmer 214. Dunkel, nur das Nachtlicht über dem Bett. Alois schläft, die grüne Kanne im Arm. Am Fenster sitzt Mama, im Mantel, und draußen blitzt es.');
        await J.say('Kevin hat dich reingelassen.'); await A.m('Ja.'); await J.say('Kevin lässt jeden rein. Deshalb mögen ihn die Alten.');
        await A.narrate('Ich setze mich auf den Stuhl neben dem Bett. Gerdas Stuhl. Er ist kalt, und dann nicht mehr.');
        if (G.malaOn && A.malaHere()) await A.g('Ich bleibe am Rand. Hier ist dein Platz.');
        await J.say('Hierher komme ich jedes Jahr. Hier knallt es leiser.'); await A.wait(800); await J.say('Du wolltest reden. Den ganzen Tag. Jetzt rede.');
        A.setFlag('k4.fin.intro'); await M.k4Checkpoint(A,1); }
      else await J.say('Du wolltest reden. Rede.');
      await move1(A,J); await move2(A,J); await move3(A,J); await move4(A,J); await M.k4Checkpoint(A,2); }
    if (from<=5){ if (from===5) await J.say('Ich bin ohne dich gefahren. Das habe ich gesagt. Jetzt du.');
      await move5(A,J); await move6(A,J); await move7(A,J); await move8(A,J); await M.k4Checkpoint(A,3); }
    await finEnd(A,J);
  } finally { finRun=false; G.flags['mala.lock']=false; A.idleM(null); }
  await M.k4DayCheck(A); }
// Einstieg nach dem Fortschritt (S3 setzt Zwischenstand 1 schon beim Betreten): Zug 1 ohne Eröffnung, Zug 5, oder Anas Ankunft
function fromStep(A){ var s=A.flag('k4.fin.step')||0; return s>=8?9:(s>=4?5:(F(A,'k4.fin.intro')?1:0)); }
M.k4Silvester=async function(A){ if (F(A,'k4.fin.done')) return; return talkFrom(A,fromStep(A)); };
M.k4FinResume=async function(A){ var G=A.G; G.flags['mala.lock']=false; if (F(A,'k4.fin.done')) return M.k4DayCheck(A);
  if (!F(A,'k4.fin.trail')){ if (!A.room || A.room.id!=='ana') await M.k4Bring(A,'ana'); G.malaOn=true; if (G.pos.mala.room!=='ana') A.malaJoin({fadeIn:false});
    await A.narrate('Anas Wohnung, kurz nach Viertel nach elf. An der Garderobe fehlt Mamas Mantel.'); if (M.k4TrailStart) await M.k4TrailStart(A); return; }
  if (A.room && A.room.id==='heim214') return talkFrom(A,fromStep(A)); };
// ---------------------------------------------------------------- Epilog: Neujahr (Konzept 4.5, 9.2, 10.3)
async function slippers(A,J){ if (F(A,'k4.e.slippers')) return;
  await A.wait(800); await A.narrate('Mama steht auf, geht in den Flur und kommt mit den Pantoffeln zurück. Sie hält sie mit beiden Händen.'); if (J.actor) J.anim('give');
  await J.say('Vierundvierzig.'); await A.wait(700); await J.say('Du hast seine Größe.'); A.give('pantoffeln'); A.setFlag('k4.e.slippers'); A.set('slippers',false); A.rebuild();
  await A.wait(900); await A.narrate('Ich ziehe sie an. Sie passen.'); await J.say('Natürlich passen sie.');
  if (gHere(A)){ await A.wait(600); await A.g('Sie glänzen nicht mehr. Jetzt sind es nur noch Pantoffeln.'); } }
async function nadaCall(A,J){ var G=A.G; if (F(A,'k4.e.nada')) return;
  if (A.has('vanilice')){ await M.k4GiveVanilice(A); await A.wait(500); }
  await A.m('Nada wartet auch. Seit neunzehn Jahren auf einen Anruf aus dem siebten Stock.'); await A.wait(900);
  await J.say('Gib her.'); await A.narrate('Mama nimmt mein Handy. Sie wählt die Nummer, ohne nachzusehen. Sie kann sie auswendig.'); A.sfx('dial'); await A.wait(1600);
  await J.say('Nada? Jasna.'); await A.wait(500); await J.say('Vukovićka, sa sedmog.'); await A.m('„Die Vuković, aus dem Siebten.“'); await A.wait(1600);
  await A.narrate('Pause. Aus dem Handy eine Stimme, sehr leise, und dann gar keine.'); await A.wait(800);
  await J.say('Ich weiß.'); await A.wait(500); await J.say('Keiner von uns hat je geschrieben.'); await A.wait(800); await J.say('Ich rufe an.');
  await A.wait(1300); await A.narrate('Sie reden. Bosnisch, schnell, wie zwei, die neunzehn Jahre in eine Viertelstunde packen müssen. Ich übersetze es nicht. Es ist nicht für mich.'); A.sfx('hangup');
  await A.wait(900); if (J.actor) J.anim('giveTin'); await J.say('Die Dose. Ich habe sie gefüllt. Mit meinen.'); A.give('dose_voll'); await J.say('Bring sie ihr zurück. Voll.'); A.setFlag('k4.e.nada');
  if (gHere(A)){ await A.wait(700); await A.g('Mama.'); await A.wait(600); await A.g('Sie hat gelacht. Am Telefon. Ich habe es gehört.'); } }
M.k4EpiRoof=async function(A){ var J=A.npc('jasna');
  await A.doc({style:'register',title:'VRATNIK – KROV',lines:['Überweisung · Sparkasse München → Sarajevo','Verwendungszweck: krov · Dach','','03.1994 · 200 DM','… jeden Monat …','12.2011 · 100 €']});
  await J.say('Das Dach in Vratnik.'); await A.wait(600); await J.say('Achtzehn Jahre bezahlt. Damit er reinkann, wenn er kommt.'); await A.wait(1100);
  await A.m('Wir können im März drunter sitzen.'); await A.wait(800); await J.say('Im März.'); A.setFlag('k4.e.roof'); };
async function obit(A){ var G=A.G, y=yes(A); if (F(A,'k4.e.obit')) return;
  await A.narrate('Ich setze mich mit dem Notizbuch an den Tisch. Mama sieht nicht hin. Ana schon.'); await A.wait(500);
  await A.doc({style:'news',title:'Die Stillen, Teil zwei · Zoran Vuković, 1951–1993',lines:['Zoran Vuković hat Brücken berechnet. Er war Bauingenieur in Sarajevo,','und auch die Einkaufsliste rechnete er mit dem Rechenschieber aus.','Er wusch jeden Sonntag einen roten Zastava und fuhr nie damit.','Im Mai 1992 schickte er seine Frau und seine Tochter mit dem Konvoi fort.','„Fahrt“, rief er. „Wir kommen nach.“','Er blieb mit seinem Sohn in Vratnik.']});
  await A.doc({style:'news',title:'Die Stillen, Teil zwei · Fortsetzung',lines:['Am 19. April 1993, dem ersten warmen Tag des Jahres, stand er an der','Brauerei in der Schlange, um Wasser zu holen. Er kam nicht zurück.','Sein Sohn war dabei. Er trug das Wasser nach Hause.','Achtzehn Jahre stand für ihn ein Satz: nicht zurückgekommen.','Seine Frau stellte ihm jeden Tag die Pantoffeln an die Tür.',y?'Im März fährt sie zu ihm. Er ist gefunden. Vermisst war er nie.':'Im März fährt sie zu ihm. Sie haben ihn wahrscheinlich gefunden. Vermisst war er nie.']});
  A.sfx('click'); await A.m('Zweitausend Zeichen. An Vesna, Glas Rive.'); A.setFlag('k4.e.obit'); await A.wait(1400);
  A.sfx('sms'); await A.doc({style:'letter',title:'SMS · Vesna',lines:['Bekommen. Seite vierzehn. Elf Zeichen zu viel. Ich lasse sie drin.']});
  if (gHere(A)){ await A.wait(600); await A.g('Elf Zeichen.'); await A.m('„Er ist gefunden.“ Mit Punkt.'); await A.g('Die lässt sie drin.'); } }
async function letter(A){ if (!A.has('brief_falsch') || A.flag('k4.e.letter')) return;
  await A.narrate('In meiner Jackentasche, unter dem Handy, der Brief an Carmela. „Cara Carmela, sto bene …“ In meiner Schrift.');
  var c=await A.choose([{t:'(Den Brief wegwerfen.)',id:'trash',silent:true},{t:'(Ihn Carmela schicken, mit zwei Zeilen dazu.)',id:'send',silent:true}],{title:'Der Brief'});
  A.take('brief_falsch'); A.setFlag('k4.e.letter',c);
  if (c==='trash'){ await A.narrate('Ich zerreiße ihn zweimal und werfe ihn in Mamas Mülleimer, unter die Kartoffelschalen.'); if (gHere(A)) await A.g('Gut. Er hat ihn nicht gebraucht.'); }
  else { await A.narrate('Ich schreibe zwei Zeilen darunter: „Questa l’ho scritta io, prima di sapere che Lei sapeva. Giuseppe non ne aveva bisogno. M. V.“');
    await A.m('„Den habe ich geschrieben, bevor ich wusste, dass Sie es wussten. Giuseppe hat ihn nicht gebraucht.“'); if (gHere(A)) await A.g('Dann darf sie ihn haben. Als das, was er ist.'); } }
async function malaTalk(A){ var G=A.G, cs=consent(); if (F(A,'k4.e.mala')) return;
  await lock(A,async function(){
    await A.narrate('Mama und Ana gehen mit den Kindern zur Wiesn, den Schnee ansehen, bevor er schmilzt. Die Wohnung ist still. Mala sitzt auf dem Fensterbrett. Ich trage Papas Pantoffeln.');
    if (G.malaOn && G.pos.mala.room==='jwohnung'){ var w=M.apos('jwohnung','mala',[340,118,'L']); A.placeG(w[0],w[1],w[2]||'L'); }
    await A.g('Sie passen dir.'); await A.m('Natürlich passen sie.'); await A.wait(900);
    if (cs==='c'){ await A.g('Ich habe gesagt, ich frage dich in München noch mal.'); await A.wait(800); await A.g('Jetzt weißt du, was es kostet. Den Kopf. Gerda. Das Schweigen.'); await A.wait(900); await A.g('Willst du das?');
      var c=await A.choose([{t:'Ja. Und wenn es zu schwer wird, sage ich es. Den richtigen Satz.',id:'a'},{t:'Ja. Diesmal weiß ich, wozu.',id:'b'},{t:'Ich weiß es nicht. Das ist die ehrliche Antwort.',id:'c'}],{title:'Mala'});
      A.setFlag('k4.e.consent2',c);
      if (c==='a'){ await A.wait(600); await A.g('Den richtigen. Gut.'); }
      else if (c==='b'){ await A.wait(600); await A.g('Wozu?'); await A.m('Damit du nach Hause kommst. Und damit ich es nicht allein trage.'); await A.g('Beides. Gut.'); }
      else { await A.wait(900); await A.g('Das ist mehr wert als ein schnelles Ja.'); } }
    else if (cs==='a'){ await A.g('Am Grab hast du „Ja“ gesagt. „Einfach so?“, habe ich gefragt.'); await A.m('Es war nicht einfach.'); await A.g('Jetzt weißt du, wie wenig.'); }
    else { await A.g('„Wenn es zu schwer wird, sagen wir es.“ Auf der Brücke haben wir es gesagt. Beide.'); await A.m('Spät.'); await A.g('Aber gesagt.'); }
    await A.wait(1100); await A.g('Nach dem Begräbnis frage ich mich selbst noch einmal.'); await A.wait(700); await A.g('Und dann sagst du mir ehrlich, was du willst. Nicht „nur müde“.');
    await A.m('Den richtigen Satz.'); await A.g('Den richtigen.'); A.setFlag('k4.e.mala');
    await A.wait(1500); A.sfx('sms'); await A.m('Nada.');
    await A.doc({style:'letter',title:'SMS · Nada',lines:['Ekshumacija desetog januara. Javit će nam se. N.']});
    await A.m('„Die Exhumierung ist am zehnten Januar. Sie melden sich.“'); await A.wait(1200); await A.g('Mama.'); await A.wait(900); await A.g('Sie holt mich.');
    await A.wait(1200);
    await A.memory({title:'Neujahr',tint:'memory',draw:M.mem&&M.mem.k4_home,lines:['Mamas Küche, Neujahrssonne auf dem Wachstuch. Drei Tassen. Eine Kiste, die offen bleiben darf.','An der Tür kein Paar Pantoffeln mehr. Sie sind an meinen Füßen.','Im März fahren wir nach Sarajevo. Alle. Mama setzt sich ans Fenster.']}); });
  A.setFlag('k4.e.done'); await M.k4DayCheck(A); }
M.k4TalkJasnaEpi=async function(A){ var J=A.npc('jasna');
  await A.menuLoop(function(){ return [
    {t:'Nada wartet auch.',silent:true,if:!F(A,'k4.e.nada'),go:function(A){ return nadaCall(A,J); }},
    {t:'Das Dach in Vratnik.',once:'epR',go:function(A){ return M.k4EpiRoof(A); }},
    {t:'Bist du wütend? Auf mich?',once:'epW',go:async function(A){ await J.say('Ja.'); await A.wait(700); await J.say('Auf dich, auf Ana, auf Ruža. Auf mich am meisten.'); await A.wait(600); await J.say('Trink deinen Kaffee. Wütend sein kann ich auch, wenn du trinkst.'); }},
    {t:'Woran denkst du?',once:'epK',if:!F(A,'k4.fin.kurve'),go:async function(A){ await J.say('An den Bus.'); await A.wait(900); await J.say('Ich hätte aussteigen können.'); await A.wait(800); await A.m('Du hattest Ana auf dem Schoß.'); await A.wait(900); await J.say('Ich hätte aussteigen können.'); }},
    {t:'Woran denkst du?',once:'epK2',if:F(A,'k4.fin.kurve'),go:async function(A){ await J.say('Dass ich zurückgesehen habe. Bis zur Kurve. Woher du das weißt, frage ich nicht.'); await A.wait(600); await J.say('Ich will es gar nicht wissen. Ich will nur, dass es einer weiß.'); }},
    {t:'(Den Nachruf schreiben.)',silent:true,if:!F(A,'k4.e.obit'),go:function(A){ return obit(A); }},
    {t:'Später.',bye:true,go:async function(A){ await J.say('Ich bin da. Ich sitze heute nur.'); }}
  ]; });
  await epiCheck(A); };
M.k4TalkAnaEpi=async function(A){ var An=A.npc('ana');
  await A.menuLoop(function(){ return [
    {t:'Was steht da? In der Nachricht.',once:'eaN',go:async function(A){ await An.say('„Zoran je otišao po vodu i nije se vratio.“'); await A.wait(800); await An.say('Ich habe es dreimal gelesen. Beim dritten Mal habe ich es verstanden. In beiden Sprachen.'); }},
    {t:'Die Straßenbahn.',once:'eaT',if:F(A,'k4.d1.drawing'),go:async function(A){ await An.say('Ich habe sie dabei. Für Nada. Im März.'); await A.wait(500); await An.say('Wenn sie sie will. Sie war ja von ihrer Tochter.'); if (gHere(A)) await A.g('Sie will sie.'); }},
    {t:'Wie geht es dir?',once:'eaW',go:async function(A){ await An.say('Ich habe zum ersten Mal einen Vater, der tot ist. Nicht einen, der fehlt.'); await A.wait(700); await An.say('Es ist schlimmer. Und besser.'); }},
    {t:'Später.',bye:true,go:async function(A){ await An.say('Geh. Ich lese noch.'); }}
  ]; });
  await epiCheck(A); };
async function epiCheck(A){ if (F(A,'k4.e.nada') && F(A,'k4.e.obit') && !F(A,'k4.e.mala')){ await letter(A); await malaTalk(A); } }
M.k4Epilogue=async function(A){ var G=A.G; if (F(A,'k4.e.done')) return M.k4DayCheck(A); var J=A.npc('jasna');
  await lock(A,async function(){
    if (!F(A,'k4.e.intro')){ A.setFlag('k4.e.intro');
      await A.narrate('Neujahr. Sonne auf altem Schnee. In Mamas Küche drei Tassen, die Kiste offen auf dem Tisch, und Ana, die die Nachricht vom Roten Kreuz zum dritten Mal liest.');
      await A.narrate('Wir sind um fünf heimgekommen, alle drei. Keiner hat geschlafen. Mama hat die Kiste aus dem Schrank geholt, ohne etwas zu sagen, und aufgeschlossen.');
      if (gHere(A)) await A.g('Sie ist still jetzt. Die Kiste. Alle Stimmen sind draußen.'); }
    await slippers(A,J); await A.wait(500); await J.say('Und jetzt trink deinen Kaffee. Er wird kalt.');
    if (A.first('!k4.e.todo')){ await A.wait(600); await A.m('Zwei Dinge sind heute noch dran. Nada wartet auf ein Wort aus dem siebten Stock. Und Vesna hält mir eine Seite frei.'); } });
  await epiCheck(A); };
})(M);
