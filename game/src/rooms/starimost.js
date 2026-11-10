/* ===== rooms/starimost.js — Die Alte Brücke: „Ist sie es?“ (Malas Brücke stand im Wasser), das Widerlager, Dino und die Geschichte
   der Brücke, die Leine am Brückenkopf und am Ufer, die erste Peilung, nachts der Springer aus den Sechzigern (Mala allein an den
   Uferstufen), im Epilog Malas Gang bis zum Scheitel; dazu Dinos Roller nach Skela (M.k3DinoRide) ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
var PRO=['k3_pro','k3_pro_n'], NIGHT=['k3_pro_n','k3_d1_n','k3_d2_n'];
function dinoHere(G){ return inP(G,['k3_pro','k3_d1','k3_d2','k3_d3','k3_epi','k3_epi_d']); }
function springerHere(G){ return inP(G,NIGHT); }
function oneArch(A,src){ if (!A.flag('k3.p.src')) A.setFlag('k3.p.src',src); if (N(A,'l3_onearch')) return false; A.note('l3_onearch'); return true; }
function malaSpot(){ return M.apos('starimost','mala',[284,117,'R']); }
// Mala klatscht ohne Ton (eigene kleine Folge, Vorderansicht)
(function(){ var F=M.poseF; if (F && M.ANIMS && !M.ANIMS.k3clap) M.ANIMS.k3clap=[[F({lh:[-6,-27],rh:[6,-27]}),150],[F({lh:[-1,-28],rh:[1,-28]}),110],[F({lh:[-6,-27],rh:[6,-27]}),150],[F({lh:[-1,-28],rh:[1,-28]}),110],[F({lh:[-6,-27],rh:[6,-27]}),150],[F({lh:[-1,-28],rh:[1,-28],hd:'b'}),260],[F({}),140]]; })();
// ---------------------------------------------------------------- Prolog: „Ist sie es?“, der Einwand, die Leine, der Leine folgen
M.k3BridgeIsIt=async function(A){ if (N(A,'l3_mybridge')) return A.g('Meine stand im Wasser. Diese nicht. Das habe ich dir gesagt.');
  var mp=malaSpot(); await A.walkG(mp[0],mp[1]); A.faceG('R'); await A.m('Ist sie es?'); await A.wait(900); await A.g('Ich weiß nicht.'); await A.wait(700);
  await A.g('Meine stand im Wasser. Auf Stümpfen, im Licht vom Lastwagen.');
  await A.memory({title:'Splitter – eine Brücke',tint:'ghost',draw:M.mem&&M.mem.k3_mybridge,lines:['Nacht. Zwei Scheinwerfer auf schwarzem Wasser, Regen in den Lichtkegeln.','Drei Steinstümpfe stehen im Fluss. Dazwischen nichts, wo eine Brücke sein sollte.','Wie abgebrochene Zähne.']});
  A.note('l3_mybridge'); await A.g('Wie abgebrochene Zähne.'); await A.wait(500); await A.m('Stümpfe im Wasser.'); await A.g('Im Wasser. Ich weiß nicht, ob die hier so war.'); };
M.k3BridgeObjection=async function(A){ await A.m('Im Januar vierundneunzig war die hier auch kaputt. Seit November.'); await A.wait(600); await A.g('Kaputt schon.'); await A.wait(500); await A.g('Aber stand sie je im Wasser?');
  A.setFlag('k3.p.objection'); await A.wait(400); await A.m(N(A,'l3_onearch')?'Nein. Nie. Ein Bogen, von Fels zu Fels.':'Das kann man nachsehen. Wie sie aufsitzt, ändert kein Krieg.'); };
M.k3BridgeLeash=async function(A){ if (N(A,'l3_down')) return A.g(A.G.phase==='k3_d2'?'Heute nicht flussab. Heute zieht sie in die Stadt.':'Flussab. Immer noch flussab.');
  if (!A.malaHere()) return A.m('Ohne Mala sehe ich keine Leine. Nur Wasser.');
  var mp=malaSpot(); await A.walkG(mp[0],mp[1]); A.faceG('R'); await A.m('Wohin zeigt die Leine?'); await A.wait(800); await A.g('Sie zeigt nicht auf die Brücke.'); await A.wait(600);
  await A.g('Flussab. Aus der Stadt hinaus.'); A.note('l3_down'); await A.m('Wie weit?'); await A.g('Das sieht man nicht. Eine Leine hat keine Zahlen. Sie zieht nur.');
  await A.wait(400); await A.m('Unten führen Stufen ans Wasser. Am Ufer entlang geht es nach Süden.'); };
async function followLeash(A){ var G=A.G;
  if (N(A,'l3_onedir')) return A.m('Bis zur Mauer kommen wir. Dann nicht weiter. Eine Richtung reicht nicht.');
  if (!N(A,'l3_down')){ await A.m('Stufen zum Wasser, nass und glatt. Aber wohin? Ich weiß nicht, wohin es Mala zieht.'); if (A.malaHere()) await A.g('Frag mich, wohin die Leine zeigt. Dann weißt du, wohin.'); return; }
  if (!A.malaHere()) return A.m('Ohne Mala weiß ich nicht, wohin.');
  G.flags['mala.lock']=true;
  try{ var st=M.stand('starimost','steps')||[72,135,'L']; await A.walk(st[0],st[1]); await A.face('L'); A.placeG(st[0]+12,st[1]-2,'L');
    await A.narrate('Wir gehen die Uferstufen hinunter. Unten ist der Fluss so laut, dass ich meinen eigenen Atem nicht höre. Ein schmaler Pfad an den Felsen entlang, nach Süden, flussab.');
    await A.fade(8,800); A.sfx('splash'); await A.wait(900);
    await A.narrate('Zweihundert Meter. Dann hört der Pfad an einer Ufermauer auf, und das Wasser leckt an meinen Schuhen. Mala bleibt stehen.');
    await A.fade(0,800); await A.wait(300);
    await A.g('Weiter nicht.'); await A.wait(700); await A.g('Nicht ohne dich. Und du gehst nicht zu Fuß bis irgendwohin.'); await A.wait(500);
    await A.m('Eine Richtung reicht nicht.'); A.note('l3_onedir'); A.setFlag('k3.p.followed'); await A.wait(500);
    await A.g('Er ist so laut hier unten, Marko.'); await A.m('Komm. Wir gehen hinauf.');
  } finally { G.flags['mala.lock']=false; }
  await M.k3DayCheck(A); }
M.k3PushBridge=async function(A){ await A.m('Komm mit auf die Brücke. Nur bis zur Mitte. Von oben sieht man weiter.'); await A.wait(900); await A.g('Nein.'); await A.wait(900);
  await A.g('Frag mich nicht noch mal.'); A.setFlag('k3.p.nobridge'); await A.wait(500); await A.m('Gut.'); };
// ---------------------------------------------------------------- Peilung 1 am Brückenkopf
async function useBridgehead(A){ var G=A.G;
  if (inP(G,PRO)){ if (!N(A,'l3_down')) return M.k3BridgeLeash(A);
    if (!N(A,'l3_onedir')) return A.m('Flussab, sagt Mala. Ich könnte ihr ein Stück folgen. Unten an den Stufen geht es ans Wasser.');
    return A.m(G.phase==='k3_pro'?'Eine Richtung reicht nicht. Ich bräuchte eine zweite, von woanders. Aber bei dem Regen sehe ich nicht einmal das andere Ufer richtig. Morgen, wenn es klar ist.':'Nachts sehe ich keine Landmarke. Morgen, wenn es hell ist.'); }
  if (inP(G,NIGHT)) return A.m('Nachts sehe ich nichts, woran ich eine Richtung festmachen könnte. Nur Laternen.');
  if (inP(G,['k3_epi','k3_epi_d'])) return A.m('Hier habe ich die erste Linie gezogen. Am Freitag. Es kommt mir vor wie ein Jahr.');
  var st=M.stand('starimost','bridgehead')||[286,114,'R']; await A.walk(st[0],st[1]); await A.face('R');
  if (A.malaHere()){ var mp=malaSpot(); await A.walkG(mp[0]-14,mp[1]+2); A.faceG('R'); }
  var was=!!G.flags['k3.peil.bridgehead'], ok=await M.k3Peil(A,'bridgehead');
  if (ok && !was){ A.unlock('koski'); await A.wait(400); await A.m('Ich brauche einen zweiten Standort. Höher, damit ich über die Dächer sehe.');   // den Ort nennt der Plan, nicht Marko
    if (A.G.malaOn){ await A.g('Hoch ist gut.'); await A.wait(300); await A.g('Hoch ist keine Brücke.'); } } }
M.k3UseBridgehead=useBridgehead;
// ---------------------------------------------------------------- Dino
async function talkDino(A){ var D=A.npc('dino'), G=A.G, p=G.phase;
  if (p==='k3_epi'){ if (A.first('dnEpi')){ await D.say('Training. Im November? Gerade im November. Wer im November springt, springt im Sommer schön.'); return; } return D.say(A.cycle('dnE',['Kalt. Das Wasser ist kälter als die Luft. Das ist gut für die Haut, sagt meine Oma.','Gleich. Ich springe gleich.'])); }
  await A.menuLoop(function(){ return [
    {t:'(In der Landessprache weiterreden.)',silent:true,once:'dnNas',if:!A.flag('k3.dino.nas'),go:async function(A){ await A.m('Pričaj naški. Razumijem.'); await D.say('A, naš si.'); A.setFlag('k3.dino.nas'); await D.say('Warum sagst du das nicht gleich? Jetzt habe ich dir den Touristenpreis gesagt.'); }},
    {t:'Erzähl mir von der Brücke.',if:!N(A,'p3_history'),go:async function(A){ await D.say('Die Brücke? Fast vierhundertfünfzig Jahre alt. Im November dreiundneunzig ist sie gefallen. Ins Wasser, Stein für Stein.');
        await D.say('Danach hing eine Seilbrücke da, von spanischen Pionieren. Ich war fünf. Ich dachte, die Spanier haben die Brücke geklaut und eine aus Wäscheleinen dagelassen.');
        await D.say('Zweitausendvier haben sie sie wieder aufgebaut. Mit Steinen aus dem Fluss und neuen aus demselben Berg. Sie sieht aus wie vorher. Sagen die Alten. Ich kenne sie nur so.'); A.note('p3_history');
        await A.wait(300); await D.say('Und die Neretva ist im November ein Pferd, das dich nicht mag.'); }},
    {t:'Stand die Brücke je im Wasser? Auf Pfeilern?',if:(N(A,'l3_mybridge')||A.flag('k3.p.objection'))&&!N(A,'l3_onearch'),go:async function(A){ await D.say('Stari most? Im Wasser?'); await D.say('Nie. Ein Bogen, von Fels zu Fels. Deshalb kann man ja springen.');
        await D.say('Unter einem Pfeiler springt keiner zweimal.'); oneArch(A,'dino'); if (G.malaOn){ await A.wait(400); await A.g('Meine hatte Pfeiler. Drei.'); } }},
    {t:'Springst du heute?',once:'dnJ',go:async function(A){ if (p==='k3_d1'){ await D.say('Bei Bura? Die drückt dich gegen den Bogen, bevor du unten bist. Heute springt keiner. Heute sitzt man im Café und lügt über den Sommer.'); return; }
        await D.say('Bei dem Wasser? Im November? Für zwanzig Euro springe ich. Für zwanzig Touristen. Heute ist keiner da.'); if (!N(A,'p3_history')) await D.say('Die Neretva ist im November ein Pferd, das dich nicht mag.'); }},
    {t:'Hast du nie Angst?',once:'dnF',go:async function(A){ await D.say('Jedes Mal.'); await A.wait(400); await D.say('Wenn ich keine habe, springe ich nicht. Dann stimmt was nicht. Mit mir oder mit dem Wasser.'); if (G.malaOn) await A.g('Er hat recht. Ich mag ihn.'); }},
    {t:'Willst du hier weg?',once:'dnW',go:async function(A){ await D.say('Alle wollen weg. Ich auch. Nach Deutschland, Schreiner werden. Mein Cousin ist in Stuttgart und hat ein Auto.');
        await D.say('Dann stehe ich im Frühling auf der Brüstung und denke: noch einen Sommer.'); }},
    {t:'Wo ist im Januar vierundneunzig ein Mädchen ertrunken?',once:'dnD',if:!G.flags['k3.d1.skela'],go:async function(A){ await D.say('Vierundneunzig? Da war ich sechs.'); await A.wait(400); await D.say('Mein Opa sagt, damals hat der Fluss viele genommen. Er sagt nicht, wen. Er sagt nur: Der Fluss vergisst nichts, aber er erzählt auch nichts.'); }},
    {t:'Kennst du eine alte Karte? Mit den Dörfern südlich der Stadt.',if:N(A,'l3_area')&&!N(A,'l3_oldmap'),go:async function(A){ await D.say('Eine alte? Bei Zdravko. Im Café am Westbusbahnhof.');
        await D.say('Mein Opa hat da Karten gespielt, unter der Landkarte. Wenn er verloren hat, hat er gesagt, die Karte ist schuld, die hängt schief. Sie hängt wirklich schief.'); A.setFlag('k3.oldmap.told'); }},
    {t:'Kennst du Skela?',if:!!G.map.skela&&!A.flag('k3.dino.ride'),go:async function(A){ await D.say('Skela? Unten an der Biegung. Da holen sie jedes Jahr Holz aus dem Fluss. Und anderes.');
        await D.say('Ich fahr dich hin, wenn du willst. Mit dem Roller. Für zehn Mark und eine Geschichte.'); await A.m('Was für eine Geschichte?'); await D.say('Eine wahre. Unterwegs. Ruf mich an, ich bin in zehn Minuten da.'); A.setFlag('k3.dino.ride'); }},
    {t:'Die Australier wollen am Brückenkopf spielen.',if:tripHere(G)&&!G.flags['k3.s.dinoOk'],go:function(A){ return dinoRule(A); }},
    {t:'Was ist in der Hütte?',once:'dnH',go:async function(A){ await D.say('Der Klub. Handtücher, Fotos von allen, die je gesprungen sind, ein Ofen, der nicht zieht, und der Präsident.'); await D.say('Der Präsident schläft. Er hat dreiundsechzig gesprungen. Jetzt schläft er.'); }},
    A.askOpt({ l3_mybridge:'Pfeiler im Wasser? Nicht hier. Unten in den Dörfern gab es solche. Holz oder Stein, und im Winter hat das Wasser sie geholt.', l3_onearch:'Sag ich doch. Ein Bogen. Mein Opa sagt, wer hier einen Pfeiler bauen wollte, wäre ausgelacht worden. Von der Neretva.',
      l3_down:'Flussab? Da ist nichts. Pappeln, Kies, Dörfer. Und irgendwann das Meer.', p3_munich:'München! Mein Cousin fährt samstags. Er bringt Bier und nimmt Ajvar mit. Das ist der Handel.',
      l3_skela:'Skela. Die Biegung. Da kommt alles an, was oben hineinfällt. Sagt man.', l3_current:'Hab ich dir doch erzählt. An der Biegung. Da holen sie es raus.' },'Da fragst du den Falschen. Ich weiß, wie man springt. Nicht viel mehr.'),
    {t:'Bis später, Dino.',bye:true,go:async function(A){ await D.say(A.cycle('dnBye',['Ćao!','Bis später. Ich bin hier. Die Brücke auch.','Spring nicht ohne mich.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Dinos Roller nach Skela (96_k3_story.js ruft das bei der Fahrt, wenn der Roller gewählt ist)
M.k3DinoRide=async function(A){ var D=A.npc('dino'), G=A.G; A.sfx('scooter');
  if (!A.first('!k3.dino.ride1')){ await A.narrate(A.cycle('dnRide',['Dino fährt. Diesmal redet er nicht. Nur der Motor, die Pappeln und der Fluss rechts unten.','Wieder der rote Roller. Dino singt unter dem Helm, falsch und laut.'])); return; }
  await A.narrate('Ich rufe Dino an. Zehn Minuten später steht er mit einem roten Roller vor der Tür. Zwei Helme, einer davon für ein Kind. Ich nehme den anderen.');
  if (G.malaOn) await A.narrate('Mala setzt sich hinter mich. Sie wiegt nichts. Der Roller merkt es trotzdem.');
  await D.say('Halt dich fest. Nicht an mir. Am Griff.');
  await A.narrate('Wir fahren aus der Stadt, nach Süden, an der Neretva entlang. Der Fluss ist rechts, tief unten, und manchmal blitzt er zwischen den Pappeln auf.');
  await D.say('Weißt du, was das Komische an der Neretva ist? Was in Mostar in den Fluss fällt, kommt an der Biegung bei Skela wieder ans Ufer.');
  await D.say('Da holen sie jedes Jahr Holz raus. Und anderes.'); A.note('l3_current');
  await A.m('Was anderes?'); await D.say('Was der Fluss hergibt. Einmal ein Kühlschrank. Einmal ein Boot ohne Mann.'); await A.wait(400); await D.say('Mein Opa sagt, im Krieg auch Leute. Er sagt es nicht oft.');
  if (G.malaOn){ await A.wait(700); await A.narrate('Hinter mir ist es still. Ich spüre, wie Mala sich an meiner Jacke festhält, und das ist unmöglich.'); }
  await A.wait(500); await D.say('Jetzt du. Die Geschichte.');
  // Die Fährmann-Geschichte setzt voraus, was Marko weiß: vor Malas Nachhall an der Glocke nur das, was Vlado erzählt hat (Prüfbericht K3)
  var knowsNight=A.hasNote('a3_lightseq')||A.hasNote('l3_rope');
  var c=await A.choose([{t:'(Von der Drei in Sarajevo erzählen.)',id:'tram',silent:true},{t:knowsNight?'(Von einem Fährmann erzählen, der nicht kam.)':'(Von einer Fähre erzählen, die nachts nicht fuhr.)',id:'ferry',silent:true},{t:'(Nichts erzählen.)',id:'none',silent:true}],{title:'Dino'});
  if (c==='tram'){ await A.narrate('Ich erzähle von einer Straßenbahn in Sarajevo, samstags um zehn nach elf, und von einem Mädchen, das mir bis oben die Jacke zugemacht hat.'); await D.say('Und dann?'); await A.m('Dann kam der Krieg.'); await D.say('Das ist keine Geschichte. Das ist ein Anfang.'); await A.m('Ich weiß.'); }
  else if (c==='ferry' && knowsNight){ await A.narrate('Ich erzähle von einer Glocke an einem Fluss und von einem Licht in einem Fenster, das wieder ausging.'); await D.say('Das ist traurig, Mann. Für zehn Mark?'); await A.m('Für fünf.'); await D.say('Für fünf ist es in Ordnung.'); }
  else if (c==='ferry'){ await A.narrate('Ich erzähle von einer Fähre, die nur bei Tag fuhr, und von einem Mädchen, das in der Nacht an den Fluss kam.'); await D.say('Und dann?'); await A.m('Das weiß ich noch nicht.'); await D.say('Dann ist sie noch nicht fertig. Erzähl sie mir, wenn sie fertig ist. Für fünf.'); A.setFlag('k3.dino.owed'); }
  else { await D.say('Dann schuldest du sie mir. Ich merk mir das. Ich merk mir alles, außer Telefonnummern.'); A.setFlag('k3.dino.owed'); }
  await A.narrate('Bei Skela hält er an, wo die Schotterstraße am Hochufer endet.'); await D.say('Ich warte nicht. Für zurück ruf das Taxi vom Ostbahnhof. Der kommt überallhin, wenn man ihm Zeit lässt.'); };
// ---------------------------------------------------------------- Nacht: der Springer (Mala allein an den Uferstufen)
var sjT=0;
function springerJump(A,quiet){ var E=M.E, a=E.ACT.springer; if (!a) return Promise.resolve(); var Sp=A.npc('springer');
  return (async function(){ if (!quiet) A.sfx('lantern'); await A.wait(500); await Sp.anim('jump'); await A.wait(250); A.sfx('splash'); await A.wait(1600);
    if (E.ACT.springer===a){ a.fadeIn=A.gt; Sp.anim('stand'); } })(); }
async function springerScene(A){ var G=A.G; if (A.flag('k3.p.springerSeen')) return; A.setFlag('k3.p.springerSeen'); G.flags['mala.noSwitch']=true;
  try{ var st=M.stand('starimost','steps')||[72,135,'L']; if (A.isMala()) await A.walk(st[0],st[1]); await A.face('R');
    await A.g('Bis hierher reicht es.'); await A.wait(700); await A.g('Hier unten ist er noch lauter. Und die Brücke ist ganz weit oben, wie ein Gedanke.'); await A.wait(800);
    A.sfx('lantern'); await A.fade(4,300); await A.wait(900); A.sfx('click'); await A.fade(0,700);
    A.found('springer'); A.music('k3_duh'); await A.wait(500); await A.g('Da.');
    await A.narrate('Oben auf der Brüstung, wo die Brücke anfängt, steht ein junger Mann in einer Badehose. Mitten im November. Er breitet die Arme aus, als wollte er die Laternen umarmen.');
    await A.wait(900); await springerJump(A,true);
    if (M.mem && M.mem.k3_springer) await A.memory({title:'Der Springer',tint:'ghost',draw:M.mem.k3_springer,lines:['Ein junger Mann im Sprung vor dem Bogen. Seitenscheitel mit Pomade, eine Badehose, wie man sie in den Sechzigern trug.','Unten das Wasser. Oben die Laternen.','Er springt jedes Mal, wenn sie angehen.']});
    await A.wait(600); await A.g('Er springt jedes Mal, wenn die Laternen angehen. Ich glaube, seit sehr langer Zeit.'); await A.wait(500);
    await A.g('Er wartet auf niemanden. Er will nichts.'); await A.wait(400); await A.g('Er springt nur.');
  } finally { G.flags['mala.noSwitch']=false; } }
async function springerTalk(A){ var G=A.G;
  await A.menuLoop(function(){ return [
    {t:'(Klatschen.)',if:!A.flag('k3.p.springer'),silent:true,go:async function(A){ await A.face('R'); await A.anim('k3clap'); A.setFlag('k3.p.springer');
        await A.narrate('Sie klatscht. Kein Ton. Unten schlägt das Wasser an die Steine, und oben steht der Springer wieder auf der Brüstung, als hätte er es gehört.');
        await A.wait(500); await A.g('Er hat sich nicht umgedreht.'); await A.wait(400); await A.g('Aber er hat es gehört. Glaube ich.'); }},
    {t:'Du springst schön.',once:'spr1',go:async function(A){ await A.wait(900); await A.g('Er sagt nichts. Er sagt nie etwas. Er sieht nur aufs Wasser, wie einer, der gleich losläuft.'); }},
    {t:'Warum springst du?',once:'spr2',go:async function(A){ await A.wait(900); await A.g('Keine Antwort.'); await A.wait(400); await A.g('Vielleicht weil die Laternen angehen. Vielleicht ist das genug.'); }},
    {t:'Hast du Angst?',once:'spr3',go:async function(A){ await A.wait(900); await A.g('Er breitet die Arme aus. Das ist auch eine Antwort.'); }},
    {t:'(Zusehen.)',bye:true,silent:true,go:async function(A){ await A.wait(1200); }}
  ]; }); }
// ---------------------------------------------------------------- Samstag: Davor und Lena an der Brücke, die Australier, Dinos Regel, das Lied (Ausbau N2, design/K3_AUSBAU.md F.2)
function tripHere(G){ return G.phase==='k3_d2' && !!G.flags['k3.s.trip']; }
function aussiesAtBridge(G){ return tripHere(G); }
var DINO_STORY={ b3_mate:['Ein alter Mann, der zwanzig Jahre auf einen Bus wartet.','Das ist traurig, Mann. Das ist eine gute.'], l3_eggwoman:['Eine Frau, der ein Ei runterfällt, weil einer einen Namen sagt.','Ein Ei. Für ein Ei lass ich jeden spielen.'],
  l3_uncounted:['Eine Brücke, die keiner gezählt hat.','Die kenne ich nicht. Also ist sie wahr.'], v3_mala:['Ein Fahrer, der ein Mädchen mitnimmt, das sich Mala nennt. Wie jede.','Wie jede. Das ist der beste Teil.'],
  v3_part1:['Ein Lastwagen, der um Viertel nach elf wegfährt.','Uhrzeiten sind keine Geschichte. Aber die Nacht dahinter, die schon. Gilt.'], k3_c_bridge:['Ein Lastwagen, Mehl, ein Fahrer, der raucht und nichts sagt.','Das ist mein Opa. Jeder hier hat so einen Opa. Gilt trotzdem.'],
  l3_skela:['Ein Dorf, das Fähre heißt, und keine Fähre hat.','Skela. Da holen sie das Holz raus. Gut, die zählt.'], v3_sent:['Ein Mädchen, das den Fahrer wegschickt. Für ein ganzes Leben.','Das … das ist nicht für zehn Mark, Mann. Das ist umsonst. Spielt.'] };
async function dinoRule(A){ var D=A.npc('dino'), G=A.G; if (G.flags['k3.s.dinoOk']) return D.say('Sie spielen. Ich habe meine Geschichte. Jetzt will ich das Lied.');
  await D.say('Am Brückenkopf spielt keiner umsonst. Nicht bei mir.'); await A.wait(600); await D.say('Eine Geschichte. Eine wahre. Das ist der Preis. Für dich wie für die Australier.');
  await A.m('Die haben keine. Die haben nur das Lied.'); await D.say('Dann du. Du sammelst doch welche. Ich sehe dir das an.');
  var n=await A.askNote('Welche Geschichte erzähle ich Dino?',{also:Object.keys(DINO_STORY)}); if (!n){ await D.say('Dann nicht. Die Brücke läuft nicht weg.'); return; }
  var st=DINO_STORY[n]; if (!st){ await D.say('Das ist keine Geschichte. Das ist eine Notiz.'); await A.wait(400); await D.say('Erzähl mir eine, in der einer etwas tut.'); return; }
  await A.narrate('Ich erzähle. '+st[0]); await A.wait(900); await D.say(st[1]); A.setFlag('k3.s.dinoOk'); await A.wait(500);
  await D.say('He, Perth! Spielt. Aber richtig. Und wenn einer von euch springen will: zwanzig Euro.'); await A.npc('aussie1').say('Awesome!'); }
async function perform(A){ var G=A.G, J=A.npc('aussie1'), B=A.npc('aussie2'), L=A.npc('aussie3'), Ln=A.npc('lena'), Dv=A.npc('davor');
  if (!G.flags['k3.s.dinoOk']) return L.say('The guy with the jacket says no. Something about a story. You speak the language, man, talk to him.');
  if (G.flags['k3.s.perf']) return L.say(G.flags['k3.s.words']?'Again? Sure. Come tonight, that’s the line.':'We stop at the window. That’s all we’ve got.');
  var words=!!G.flags['k3.s.words']; A.music('k3_aussie'); A.sfx('guitar'); if (L.actor) L.idle('guitar');
  await A.narrate(words?'Liam spielt. Bec hält den Zettel, und er singt die Strophen in der richtigen Reihenfolge, mit allen Fehlern, die man mit einem fremden Alphabet machen kann. Touristen bleiben stehen.':'Liam spielt. Er singt die ersten Zeilen, die er kennt, bis zu der Stelle mit dem Fenster. Dann summt er, weil er den Text nicht mehr weiß.');
  await A.wait(1500); await A.narrate('Lena hört auf, aufs Handy zu sehen. Sie hört zu, den Kopf schief.'); await A.wait(800);
  await Ln.say('Das kenn ich.'); await A.wait(500); await Ln.say('Vom Telefon. Opa hat das gesummt. Wenn er nichts mehr wusste, hat er gesummt.');
  await A.wait(800); await Dv.say('Immer dasselbe.'); await A.wait(600); await Dv.say('Und immer vor der Stelle aufgehört. Da, wo sie am Fenster steht. Weiter ist er nie gekommen.'); A.note('b3_hum'); A.setFlag('k3.s.perf');
  if (!words){ await A.wait(900); await Ln.say('Da hört er auch auf? Der mit der Gitarre?'); await A.m('Er kennt den Rest nicht.'); await Ln.say('Und du?'); await A.m('Ich schon. Ich müsste es ihnen aufschreiben.');
    if (L.actor) L.idle(null); A.music('k3_mostar'); return; }
  await A.wait(900); A.sfx('strum'); await A.narrate('Liam singt die letzte Strophe. „Dođi, dragi, doveče.“ Dann hört das Lied auf, so wie es aufhört.'); await A.wait(1000);
  await Ln.say('Was heißt das? Das Letzte. Dođi …'); await A.m('„Dođi, dragi, doveče.“ Komm, Liebster, komm heute Abend.'); await A.wait(700); await Ln.say('Das hat er nie gesungen. Die Stelle.');
  await A.wait(600); await Dv.say('Nein. Die nie.'); await A.wait(900); await Ln.say('Dođi, dragi, doveče.'); await A.wait(500); await Ln.say('Das sag ich ihm. Morgen. Am Tor.'); A.note('s3_verse'); A.setFlag('k3.s.lenaVerse');
  if (G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Sie hat es gleich richtig gesagt.'); await A.wait(400); await A.g('Besser als Liam.'); }
  if (L.actor) L.idle(null); A.music('k3_mostar'); }
async function talkAussiesBridge(A){ var J=A.npc('aussie1'), B=A.npc('aussie2'), L=A.npc('aussie3'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'What are you doing here?',once:'ab1',go:async function(A){ await J.say('Busking! Bridge, tourists, hat on the ground. Bec’s idea.'); await B.say('Liam’s idea. I just said it out loud.'); await L.say('The guy in the jacket says we need a story first. We don’t have a story. We have a song.'); }},
    {t:'Play it.',if:!G.flags['k3.s.perf'],go:async function(A){ await perform(A); }},
    {t:'Do you want the words?',if:!G.flags['k3.s.words'],go:async function(A){ A.sfx('strum'); await L.say('You know it? The whole thing?'); await B.say('Write it down. Slowly.'); var ok=await M.K3X.songOrder(A); if (!ok) return;
        await B.say('Water, lamb, gates, window, good evening, come tonight. Got it.'); if (G.flags['k3.s.perf']){ A.setFlag('k3.s.perf',false); await L.say('Let’s do it again. With the end this time.'); } }},
    {t:'Play it again. With the end.',if:G.flags['k3.s.perf']&&G.flags['k3.s.words']&&!G.flags['k3.s.lenaVerse'],go:async function(A){ A.setFlag('k3.s.perf',false); await perform(A); }},
    {t:'See you.',bye:true,go:async function(A){ await J.say(A.cycle('abBye',['See ya!','Cheers, mate.'])); }}
  ]; }); }
async function talkLenaBridge(A){ var Ln=A.npc('lena'), G=A.G;
  if (G.flags['k3.s.lenaVerse']) return Ln.say(A.cycle('lbV',['Dođi, dragi, doveče. Hab ich mir gemerkt.','Papa schaut die ganze Zeit aufs Wasser. Nicht auf die Brücke.']));
  if (G.flags['k3.s.perf']) return Ln.say('Der mit der Gitarre weiß den Rest nicht. Weißt du ihn?');
  return Ln.say(A.cycle('lb1',['Voll hoch. Springen die da echt runter?','Jela hat gesagt, ich muss die Brücke sehen. Papa wollte nicht. Jetzt steht er da und sagt nichts.'])); }
async function talkDavorBridge(A){ var Dv=A.npc('davor'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Jela hat Sie hergeschickt.',once:'db1',go:async function(A){ await Dv.say('Jela schickt. Man geht.'); await A.wait(600); await Dv.say('Sie hat uns den Weg erklärt wie in eine andere Stadt. Für sie ist es eine.'); await A.wait(500); await Dv.say('Ich war seit zweiundneunzig nicht hier. Zu Fuß waren es zwanzig Minuten. Heute sind wir mit dem Taxi gefahren.'); }},
    {t:'Wie ist es, wieder hier zu stehen?',once:'db2',go:async function(A){ await Dv.say('Ich habe sie im Fernsehen fallen sehen. In München, im Wohnheim. Alle haben geschrien.'); await A.wait(800); await Dv.say('Jetzt steht sie da, als wäre nichts. Das ist das Schlimme. Nicht, dass sie weg war.'); }},
    {t:'Ihr Vater hat gesummt?',if:A.hasNote('b3_hum'),once:'db3',go:async function(A){ await Dv.say('Am Telefon. Einmal im Jahr, zu Weihnachten. Wenn keiner mehr wusste, was er sagen soll, hat er gesummt.'); await A.wait(600); await Dv.say('Bis zu der Stelle. Dann hat er gesagt: Grüß die Kleine. Und aufgelegt.'); }},
    A.askOpt({ b3_mate:'Er hat am Bahnhof gewartet? Jeden Samstag? Das hat mir keiner gesagt. Das hätte mir auch keiner sagen müssen.', b3_zdravko:'Zdravko. Den kenne ich. Ich bin an seinem Fenster vorbeigegangen, als wäre es ein Schaufenster.', s3_words:'Sie haben den Australiern den Text aufgeschrieben? Mein Vater hätte Sie dafür eingeladen. Auf einen Tee.' },'Ich weiß es nicht. Ich weiß hier gar nichts mehr.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
// ---------------------------------------------------------------- Epilog: Malas Gang über die Brücke bis zum Scheitel
async function epiStart(A){ var G=A.G; if (A.flag('k3.e.bridgeOn')) return; A.setFlag('k3.e.bridgeOn'); G.flags['mala.lock']=true;
  try{ await A.narrate('Die Brücke im Morgengrauen. Grau, kein Wind, kein Tourist. Nur der Fluss und ein Mann in Trainingsjacke, der sich vor der Hütte dehnt.');
    if (!A.malaHere()) return; var mp=malaSpot(); await A.walkG(mp[0],mp[1]); A.faceG('R'); await A.wait(800);
    await A.g('Ich will hinauf.'); await A.m('Auf die Brücke?'); await A.g('Bis zur Mitte. Ganz oben.');
    if (A.flag('k3.p.nobridge')){ await A.wait(400); await A.m('Du hast gesagt, ich soll dich nicht noch mal fragen.'); await A.g('Du hast nicht gefragt. Ich gehe.'); }
    A.set('walkBridge',true); A.rebuild(); await A.wait(300); await A.g('Komm nach. Aber langsam. Ich will zuerst allein oben sein.');
    var cs=M.stand('starimost','crest')||[418,50,'R']; await A.walkG(cs[0]+6,cs[1]); A.faceG('R'); await A.wait(300);
    await A.narrate('Sie geht hinauf, die Auffahrt, über die glatten Stufen des Bogens. Sie geht wie jemand, der über Eis geht und es weiß. Oben bleibt sie stehen.');
  } finally { G.flags['mala.lock']=false; } }
M.k3EpiBridge=async function(A){ var G=A.G; if (A.flag('k3.e.bridge')) return A.m('Tief unten. Immer noch. Aber es ist jetzt anders tief.');
  if (!A.flag('k3.e.bridgeOn')) await epiStart(A); G.flags['mala.lock']=true;
  try{ var cs=M.stand('starimost','crest')||[418,50,'R']; await A.walk(cs[0]-10,cs[1]); await A.face('R'); if (A.malaHere()){ A.placeG(cs[0]+6,cs[1],'L'); }
    await A.wait(700); await A.g('Tief unten.'); await A.wait(600); await A.m('Hast du Angst?'); await A.wait(800); await A.g('Ja.'); await A.wait(500); await A.g('Aber es ist meine.');
    await A.wait(1000); var D=A.npc('dino'); if (D.actor) D.hide(); A.set('dinoJump',true); await A.wait(900);
    await A.narrate('Neben uns steigt Dino auf die Brüstung, in der Badehose, blau vor Kälte. Er sieht uns nicht an. Er sieht hinunter, breitet die Arme aus und springt.');
    A.set('dinoJump',false); await A.wait(700); A.sfx('splash'); await A.wait(900);
    await A.narrate('Ein Strich, ein Platschen, ein Kopf im grünen Wasser. Unten schreit er etwas, das nach Kälte klingt.');
    await A.wait(500); await A.narrate('Mala lacht. Laut. Zum ersten Mal, seit wir in Mostar sind.'); await A.g('Er ist verrückt.'); await A.m('Er trainiert.'); await A.g('Für den Sommer.'); await A.wait(1200);
    if (D.actor){ D.show(); D.actor.fadeIn=A.gt; }
    await A.g('Nach dem Herd …'); await A.wait(1100);
    await A.g('Danach war ich bei dir. In Vratnik, im Winter. Du hast Holz gehackt.');
    await A.memory({title:'Erinnerung – Vratnik, Winter',tint:'memory',draw:M.mem&&M.mem.k3_vratnik,lines:['Vratnik, Winter vierundneunzig. Schnee bis an die Knie. Ein Junge hackt Holz vor Großmutters Haus, mit einer Axt, die zu schwer für ihn ist.','Im Fenster ein heller Fleck. Er sieht nicht hin.','Er hackt, bis es dunkel wird. Jeden Tag.']});
    await A.g('Wie ich hingekommen bin, weiß ich nicht.'); await A.wait(500); await A.g('Dann Split. Dann hast du den Karton zugeklebt.'); await A.wait(900); await A.g('Dann war ich leer.');
    A.note('e3_since'); A.setFlag('k3.e.bridge'); await A.wait(900);
    await A.m('Seit dem Winter.'); await A.g('Seit dem Winter. In Split habe ich gesagt: seit gestern. Seit der Kirchentreppe.'); await A.m('Seit gestern.');
    await A.g('Seit du mich siehst. Vorher war ich auch da. Nur leer.'); await A.wait(800);
    await A.m('Nada kommt gegen Mittag.'); await A.g('Dann gehen wir sie abholen.'); await A.wait(400); await A.g('Zusammen. Über die Brücke zurück. Ich zuerst.');
  } finally { G.flags['mala.lock']=false; }
  await M.k3DayCheck(A); };
// ---------------------------------------------------------------- Hotspots
function bridgeLook(A){ var G=A.G, p=G.phase;
  if (p==='k3_pro') return A.m('Die Alte Brücke. Ein einziger hoher Bogen aus hellem Stein, mit einem Buckel in der Mitte, als hielte sie die Luft an. Im Regen glänzen die Steine wie nasse Seife.');
  if (inP(G,NIGHT)) return A.m('Die Brücke bei Nacht, angestrahlt. Ein heller Bogen über einem schwarzen Loch, aus dem das Rauschen kommt.');
  if (p==='k3_d1') return A.m('Bei Bura sieht man jeden Stein. Ein Bogen, schlank, von Fels zu Fels, und darunter so viel Luft, dass einem schwindlig wird.');
  if (p==='k3_epi'||p==='k3_epi_d') return A.m(A.flag('k3.e.bridge')?'Die Brücke im grauen Licht. Mala war oben. Ich auch.':'Die Brücke im Morgengrauen, grau in grau. Kein Mensch darauf. Nur der Bogen und sein Spiegelbild, das der Fluss zerreißt.');
  return A.m('Die Alte Brücke, Stari most. Hell, schlank, alt und neu zugleich. Touristen fotografieren sie, als könnte sie weglaufen.'); }
async function bridgeUse(A){ var G=A.G; if (A.S.walkBridge) return M.k3EpiBridge(A);
  if (inP(G,NIGHT)) return A.m('Nachts? Die Steine sind glatt, und Mala bleibt sowieso unten.');
  await A.narrate('Ich gehe ein paar Schritte die Auffahrt hinauf, bis dahin, wo der Bogen anfängt. Die Steine sind glatt, mit Rillen für die Füße.');
  if (A.malaHere()){ await A.g('Geh ruhig. Ich nicht.'); await A.wait(400); await A.narrate('Mala bleibt am Brückenkopf stehen. Ich gehe zurück zu ihr.'); }
  else await A.narrate('Dann gehe ich zurück. Allein ist es nur eine Brücke.'); }
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Der Platz am Brückenkopf öffnet sich zurück in die Gasse, zum Kujundžiluk und in die Stadt.',
   canExit:async function(A){ if (A.flag('k3.e.bridgeOn') && !A.flag('k3.e.bridge') && A.G.phase==='k3_epi'){ await A.m('Mala ist oben auf der Brücke. Ich gehe nicht ohne sie.'); return false; } return true; },
   g:{look:'Da geht es zurück in die Stadt. Weg vom Wasser.'}},
 {id:'bridge',name:'Alte Brücke',look:bridgeLook,use:bridgeUse,
   g:{look:async function(A){ if (A.S.walkBridge) return A.g('Ich war oben. Ganz oben. Unter mir war nichts als Luft und Fluss, und ich bin nicht gefallen.');
       await A.g('Unter dem Bogen hängt ein Strich aus Licht. Wie ein Seil, über das Wasser gespannt.'); await A.wait(400); await A.g('Hier sind Leute hinübergegangen, als die Brücke weg war. Viele.'); await A.wait(500); await A.g('Ich mag es nicht. Ich weiß nicht, warum.'); },
     sense:'Viele Schritte. Und darunter, ganz zart, eine Brücke aus Seilen, die jemand in den Krieg gehängt hat. Sie schwankt immer noch ein bisschen.'}},
 {id:'abutment',name:'Widerlager',look:async function(A){ await A.m('Das Widerlager, unten links. Der Bogen sitzt direkt auf dem Fels: ein bearbeiteter Kämpferstein auf einer Felsbank, dazwischen nur Fugen. Kein Pfeiler. Kein Stumpf im Wasser.');
     var nw=oneArch(A,'abutment'); if (nw) await A.m('Ein einziger Bogen, von Fels zu Fels. So hat sie gestanden, so steht sie wieder. Daran ändert kein Krieg etwas.');
     if (A.malaHere() && A.first('gAbut')) await A.g('Sie hält sich an den Felsen fest. Nicht am Wasser.'); },
   use:'Ich kann das Widerlager nicht anfassen. Es liegt zehn Meter unter mir, am Fels. Ich kann es nur ansehen. Das reicht.',
   g:{look:'Stein auf Stein, ohne Beine. Meine hatte Beine.'}},
 {id:'river',name:'Neretva',look:function(A){ var G=A.G; if (G.phase==='k3_pro') return A.m('Die Neretva, tief unten. Hoch und schnell, grün mit weißen Strudeln, und so laut, dass man sie auf dem ganzen Platz hört.'); if (inP(G,NIGHT)) return A.m('Unten nur schwarzes Wasser und das Glitzern der Laternen darauf, das immer wieder zerreißt.'); return A.m('Die Neretva. Grün wie Flaschenglas, kalt, schnell. Man sieht bis auf die Steine, wo sie flach ist, und nirgends, wo sie tief ist.'); },
   use:'Bis zum Wasser sind es zwanzig Meter. Dino macht das. Ich nicht.',
   g:{look:async function(A){ await A.g('Tief unten.'); await A.wait(400); await A.g(A.G.phase==='k3_epi'||A.G.phase==='k3_epi_d'?'Er ist immer noch laut. Aber ich höre jetzt auch etwas anderes darin.':'Grün. Laut.'); },
     listen:'Er rauscht so laut, dass ich nichts anderes höre. Kein Wort, keinen Namen. Nur ihn.'}},
 {id:'hut',name:'Springerhütte',look:'Eine kleine Hütte am Brückenkopf, Steinsockel, Holzbalkon, ein Rettungsring. Ein Schild: „KLUB SKAKAČA“. Klub der Springer.',
   open:function(A){ return A.m(dinoHere(A.G)?'Die Tür ist zu. Durch das Fenster: Fotos von Springern an der Wand, Handtücher, ein Ofen. Und ein alter Mann, der schläft.':'Abgeschlossen. Durch das Fenster sieht man Fotos an der Wand, lauter Männer in der Luft.'); },
   use:function(A){ return dinoHere(A.G)?talkDino(A):A.m('Niemand da. Die Springer schlafen.'); },
   g:{look:'Lauter Fotos von Männern in der Luft. Einer davon ist noch hier. Er ist nur auf keinem Foto mehr.'}},
 {id:'bridgehead',name:'Brückenkopf',look:function(A){ return A.m(A.flag('k3.peil.bridgehead')?'Der Brückenkopf. Von hier aus habe ich die erste Linie gezogen, nach Süden, zwischen zwei Landmarken hindurch.':'Der Brückenkopf, wo die Auffahrt beginnt. Von hier sieht man über den Bogen hinweg flussab: Dächer, das Minarett der Koski-Moschee, drüben ein Glockenturm, zwei Kräne.'); },
   use:useBridgehead,
   g:{look:async function(A){ if (inP(A.G,PRO) && !N(A,'l3_down')) return M.k3BridgeLeash(A); return A.g(A.G.phase==='k3_d2'?'Heute zieht es von hier in die Stadt. Nicht flussab.':'Bis hierher. Weiter gehe ich nicht. Von hier sehe ich, wohin es zieht.'); }}},
 {id:'steps',name:'Uferstufen',look:function(A){ return A.m(A.G.tod==='night'?'Die Uferstufen hinunter zum Wasser, nass, mit einer Laterne am Anfang. Unten ist es so laut, dass man nicht reden kann.':'Steinstufen, die links hinunter zum Wasser führen. Glatt getreten, nass, mit einem rostigen Geländer, an dem man sich besser nicht festhält.'); },
   use:async function(A){ if (inP(A.G,PRO) && A.G.tod!=='night') return followLeash(A); if (A.G.tod==='night') return A.m(A.malaHere()?'Nachts gehe ich diese Stufen nicht hinunter. Mala schon. Wenn sie will.':'Die Stufen nachts? Nein.'); return followLeash(A); },
   gexit:function(S,G){ if (G.pos.marko.room==='herberge' && inP(G,NIGHT)){ var r=M.stand('herberge','railing')||[300,124,'R']; return {to:'herberge',x:r[0],y:r[1],f:r[2]||'R'}; } return null; },
   g:{look:async function(A){ var G=A.G; if (G.phase==='k3_pro_n' && !A.flag('k3.p.springerSeen')) return springerScene(A); if (springerHere(G)) return A.g('Bis hierher reicht die Leine, wenn er oben schläft. Die Stufen gehören mir. Nachts.'); return A.g('Stufen zum Wasser. Ich gehe sie hinunter, wenn er nicht hinsieht. Nicht weit.'); },
     sense:'Viele, die hier gesessen haben, die Füße fast im Wasser. Ein Paar, das sich gestritten hat. Ein Junge, der sich nicht getraut hat. Jedes Mal ein anderer.'}},
 {id:'towers',name:'Brückentürme',look:'Die Türme an den Enden der Brücke. Der halbrunde hier heißt Tara, der eckige drüben Halebija. Früher haben Wächter darin gewohnt, die Brückenwächter. Daher heißt die Stadt so.',
   g:{look:'Brückenwächter. Ich habe nie eine Brücke bewacht. Nur Treppen.'}},
 {id:'crest',name:'Scheitel der Brücke',vis:function(S,G){ return !!S.walkBridge; },look:function(A){ return A.m(A.flag('k3.e.bridge')?'Der Scheitel. Hier oben war Mala. Hier hat sie gelacht.':'Der höchste Punkt des Bogens. Oben steht Mala, die Hände auf der Brüstung, und sieht hinunter.'); },
   use:function(A){ return M.k3EpiBridge(A); },
   g:{look:'Ganz oben. Ich habe mich getraut. Du kannst kommen.'}},
 {id:'dino',npc:'dino',name:'Dino',hgt:46,vis:function(S,G){ return dinoHere(G); },talk:talkDino,
   look:function(A){ var p=A.G.phase; return A.m(p==='k3_epi'?'Dino, in Badehose und Trainingsjacke, blau vor Kälte. Er hüpft auf der Stelle und grinst.':(p==='k3_d1'?'Dino, die Kapuze gegen die Bura. Er raucht und sieht der Brücke zu, wie man einem Pferd zusieht, das man nicht reiten darf.':'Dino. Rote Trainingsjacke, Badeschlappen mit Socken, Dreitagebart. Er dehnt sich, als müsste er gleich auf eine Bühne.')); },
   give:{ km:async function(A){ var D=A.npc('dino'); if (A.G.phase==='k3_d1') return D.say('Bei Bura? Behalt dein Geld. Ich springe nicht gegen den Wind.'); await D.say('Zwanzig Euro. Das sind vierzig Mark. Du hast zehn. Das reicht für einen Kopfsprung in eine Pfütze.'); },
     photo_full:async function(A){ var D=A.npc('dino'); await D.say('Eine Straßenbahn! In Mostar gab es nie eine. Nur Busse und den Fluss.'); await D.say('Die Kleine sieht aus, als würde sie dich gleich irgendwo hinziehen.'); if (A.G.malaOn) await A.g('Hat sie auch.'); },
     plan:'Dino: „Ein Stadtplan? In Mostar? Man geht zum Fluss und dann rechts. Oder links.“', ulaznica:'Dino: „Minarett? Fünf Mark für die Aussicht. Ich habe sie umsonst, von der Brüstung.“' },
   g:{look:'Er hat Angst, jedes Mal. Und springt trotzdem. Das ist das Mutigste, was ich kenne.',listen:async function(A){ await A.g('Er zählt leise, bevor er etwas sagt. Bis drei. Wie vor dem Sprung.'); }}},
 {id:'davor_b',npc:'davor',name:'Davor',hgt:46,vis:function(S,G){ return tripHere(G); },talk:talkDavorBridge,
   look:'Davor im beigen Trenchcoat am Brückenkopf. Er sieht aufs Wasser, nicht auf die Brücke.',
   give:{ photo_full:'Davor: „Wer ist das? Und der Kleine mit den Ohren, das sind Sie?“' },
   g:{look:'Er steht vor einer Brücke und sieht sie nicht an. Das kann man lernen.',listen:'Er zählt. Die Jahre, seit er hier war. Er kommt auf neunzehn.'}},
 {id:'lena_b',npc:'lena',name:'Lena',hgt:44,vis:function(S,G){ return tripHere(G); },talk:talkLenaBridge,
   look:'Lena am Geländer, das Handy in der Hand. Sie fotografiert die Brücke, dann die Australier, dann ihren Vater, der nicht hinsieht.',
   give:{ photo_full:'Lena: „Ist das deine Schwester? Nein? Wer dann?“' },
   g:{look:'Sie sieht alles an. Das Wasser, die Steine, die Leute. Wie ich, am Anfang.',listen:'Sie summt mit. Falsch. Aber mit.'}},
 {id:'aussie1_b',npc:'aussie1',name:'Josh',hgt:34,vis:function(S,G){ return aussiesAtBridge(G); },talk:talkAussiesBridge,look:'Josh, die Mütze in der Hand, als Hut für Münzen.',g:{look:'Er wartet, dass einer anfängt. Er fängt nie an.'}},
 {id:'aussie2_b',npc:'aussie2',name:'Bec',hgt:34,vis:function(S,G){ return aussiesAtBridge(G); },talk:talkAussiesBridge,look:function(A){ return A.m(A.flag('k3.s.words')?'Bec mit dem Zettel, auf dem meine Übersetzung steht und darunter ihre Lautschrift.':'Bec mit einem leeren Zettel und einem Stift. Sie wartet auf Text.'); },g:{look:'Sie schreibt alles auf. Sogar das, was sie nicht versteht. Besonders das.'}},
 {id:'aussie3_b',npc:'aussie3',name:'Liam',hgt:34,vis:function(S,G){ return aussiesAtBridge(G); },talk:talkAussiesBridge,look:'Liam mit der Gitarre, am Brückenkopf, wo die Touristen stehen bleiben. Er stimmt sie. Immer noch.',
   g:{look:'Er spielt, damit die anderen singen. Hier singt keiner mit. Noch nicht.',listen:'Er summt die Stelle, an der er nicht weiterweiß. Immer wieder dieselbe.'}},
 {id:'springer',npc:'springer',name:'Springer',hgt:46,vis:function(S,G){ return springerHere(G); },
   look:'Ein Mann auf der Brüstung, in einer Badehose, mitten im November. Durch ihn hindurch sehe ich die Laterne. Er sieht aufs Wasser, nicht zu mir.',
   talk:async function(A){ await A.m('Hallo?'); await A.wait(900); await A.m('Er hört mich nicht. Oder er will nichts hören. Er wartet auf die Laternen.'); },
   g:{look:'Ein junger Mann in einer Badehose aus den Sechzigern, Seitenscheitel, Pomade. Er sieht nicht her. Er sieht nur aufs Wasser.',
     sense:'Kein Faden. Nichts hält ihn, außer dem hier, und das mag er. Er springt nicht, weil er muss. Er springt, weil die Laternen angehen.',
     talk:function(A){ return springerTalk(A); }}}
];
M.room('starimost',{ name:'Alte Brücke', scape:'k3_starimost',
  music:function(G){ if (G.phase==='k3_epi'||G.phase==='k3_epi_d') return 'k3_epi'; return G.tod==='night'?'k3_noc':'k3_mostar'; },
  state:function(G){ return {walkBridge:false,dinoJump:false}; },
  actors:function(S,G){ var L=[], p=G.phase; S.walkBridge=!!(inP(G,['k3_epi','k3_epi_d']) && G.flags['k3.e.bridgeOn']); S.dinoJump=false;   // beim Betreten springt keiner; die Szene setzt es und blendet dann die Figur aus
    if (dinoHere(G) && !S.dinoJump){ var d=M.apos('starimost','dino',[198,115,'R']); L.push({id:'dino',ch:'dino',x:d[0],y:d[1],f:d[2]||'R',name:'Dino',idle:p==='k3_d1'?'smoke':null,speechY:46,
      routine:p==='k3_d1'?[['idle','smoke',6,10],['face','L',2,3],['idle','smoke',5,8],['face','R',2,4]]:[['idle',null,3,6],['anim','stretch'],['idle',null,2,4],['idle','smoke',5,9],['anim','wave'],['idle',null,3,5]]}); }
    if (tripHere(G)){ var dv=M.apos('starimost','davor_b',[120,118,'R']), ln=M.apos('starimost','lena_b',[146,120,'L']);
      L.push({id:'davor',ch:'davor',x:dv[0],y:dv[1],f:dv[2]||'R',name:'Davor',speechY:46}); L.push({id:'lena',ch:'lena',x:ln[0],y:ln[1],f:ln[2]||'L',name:'Lena',idle:'phone',speechY:44});
      var a1=M.apos('starimost','aussie1_b',[292,118,'L']), a2=M.apos('starimost','aussie2_b',[314,120,'L']), a3=M.apos('starimost','aussie3_b',[336,118,'L']);
      L.push({id:'aussie1',ch:'aussie1',x:a1[0],y:a1[1],f:a1[2]||'L',name:'Josh',speechY:36}); L.push({id:'aussie2',ch:'aussie2',x:a2[0],y:a2[1],f:a2[2]||'L',name:'Bec',speechY:36});
      L.push({id:'aussie3',ch:'aussie3',x:a3[0],y:a3[1],f:a3[2]||'L',name:'Liam',idle:'guitar',talk:'guitarTalk',speechY:36,routine:[['idle','guitar',6,12],['idle',null,3,5]]}); }
    if (springerHere(G)){ var s=M.apos('starimost','springer',[299,99,'F']); L.push({id:'springer',ch:'springer',x:s[0],y:s[1],f:s[2]||'F',name:'Springer',ghost:true,reveal:true,idle:'stand',speechY:50,routine:false}); }
    return L; },
  hotspots:HS,
  load:function(A){ sjT=0; },
  tick:function(A,dt){ var G=A.G, E=M.E; if (!springerHere(G)) return; if (E.busy||E.dlg||E.overlay||E.speech||E.card) return;
    sjT+=dt; if (sjT<34000) return; sjT=0; var a=E.ACT.springer; if (!a || !(A.isMala()||A.flag('found.springer'))) return; if (a.mode!=='idle') return; springerJump(A,false); },
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (A.isMala()){ if (p==='k3_pro_n' && !A.flag('k3.p.springerSeen')) await springerScene(A); return; }
    if (!A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k3_pro' && A.first('smArr')){ await A.narrate('Die Alte Brücke. Ein einziger hoher Bogen aus hellem Stein, von Fels zu Fels, mit einem Buckel in der Mitte. Tief unten die Neretva, grün und laut, mit weißen Strudeln.');
      var mp=malaSpot(); await A.walkG(mp[0],mp[1]); A.faceG('R'); await A.wait(700); await A.g('Tief unten.'); await A.wait(700); await A.g('Grün. Laut.'); await A.wait(500);
      await A.narrate('Mala bleibt am Brückenkopf stehen. Sie setzt keinen Fuß auf die Brücke.'); return; }
    if (p==='k3_pro_n' && A.first('smN0')){ await A.m('Die Brücke bei Nacht. Angestrahlt, als hätte sie Angst im Dunkeln.'); if (!A.flag('k3.p.springerSeen')){ await A.g('Bleib oben. Ich gehe allein hinunter. Zu den Stufen.'); await A.m('Allein.'); await A.g('So weit es zieht. Das ist nicht weit.'); } return; }
    if (p==='k3_d1' && A.first('smD1')){ await A.g('Heute ist sie ganz klar. Man sieht jeden Stein.'); await A.g('Ich mag sie trotzdem nicht.'); return; }
    if (p==='k3_d2' && tripHere(G) && A.first('smTrip')){ await A.narrate('Samstagnachmittag am Brückenkopf. Touristen in Regenjacken, ein Mann mit einem Hut voller Münzen, drei Australier mit einer Gitarre. Und am Geländer Davor und Lena.');
      await A.wait(700); await A.narrate('Ein Tourist fragt Dino auf Englisch, ob das hier die Grenze ist. Zwischen den zwei Seiten.'); await A.npc('dino').say('Das hier ist eine Brücke, Mann. Die Grenze ist eine Straße mit einer Bank, die man nicht sieht.');
      if (G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Er hat recht. Ich habe die Straße gesehen.'); }
      if (A.first('smD2')) return; }
    if (p==='k3_d2' && A.first('smD2')){ await A.g('Heute zieht es nicht flussab. Heute zieht es in die Stadt.'); return; }
    if (p==='k3_d3' && A.first('smD3')){ await A.g('Sie ist schön. Das darf ich sagen, oder? Auch wenn sie nicht meine ist.'); return; }
    if ((p==='k3_d1_n'||p==='k3_d2_n') && A.first('smN'+p) && A.flag('found.springer')){ await A.g('Er steht wieder da. Der Springer.'); return; }
    if (p==='k3_epi' && !A.flag('k3.e.bridge')){ await epiStart(A); return; }
    if (p==='k3_epi_d' && A.first('smEpiD')){ await A.g('Ich war oben. Das bleibt.'); } }
});
})(M);
