/* ===== rooms/kafic.js — Café „Zdravko“ am Westbusbahnhof: die alte Karte von 1985, Zdravko („Ein Kaffee, zwei Stunden. Das war Dida Mate.“),
   und am Fenstertisch Mate Zelenika, ein Geist, der auf den Bus aus München wartet. Mala findet ihn beim ersten Betreten. ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function mateHere(G){ return (G.phase==='k3_d1'||G.phase==='k3_d2') && !F(G,'k3.b.limbo'); }
function seen(A){ return mateHere(A.G) && A.isFound('mate'); }
// ---------------------------------------------------------------- Mala findet Mate
async function mateFind(A){ var Mt=A.npc('mate'); if (A.isFound('mate')) return;
  await A.wait(700); await A.g('Marko.'); await A.wait(500); await A.g('Am Fenstertisch. Da sitzt einer.');
  A.found('mate'); if (Mt.actor) Mt.actor.fadeIn=A.gt; await A.wait(1200);
  await A.narrate('Am Fenstertisch, wo eben nur ein leerer Stuhl war, sitzt ein alter Mann. Hut, grauer Anzug, eine Thermoskanne vor sich. Er sieht zu den Bussen hinaus.');
  await Mt.say('Setz dich ruhig, Mädchen. Aber nicht auf den Stuhl da. Der ist für meinen Sohn.');
  await A.g('Auf wen warten Sie?'); await Mt.say('Auf den Bus aus München.'); await A.wait(600); await Mt.say('Morgen um sechs. Mein Sohn kommt.'); A.note('b3_mate'); A.setFlag('k3.b.mate');
  await Mt.say('Mate. Mate Zelenika. Dreißig Jahre München, am Band, Halle vier. Jetzt bin ich wieder hier und warte.'); A.G.flags['met.mate']=true;
  await A.wait(700); await Mt.say('Und Sie, junger Mann? Warten Sie auch?'); await A.m('Ich suche jemanden.'); await Mt.say('Das ist dasselbe. Nur mit Schuhen.'); }
M.k3MateFind=mateFind;
// ---------------------------------------------------------------- Mate (mit Marko)
async function driverHint(A,Mt,how){ if (A.hasNote('v3_mate')){ await Mt.say('Rajić, habe ich gesagt. Hinter dem Bulevar. Er flickt Reifen und redet nicht.'); return; }
  if (how==='ljerka') await Mt.say('Vlado? Der Raucher?'); await A.wait(600);
  await Mt.say('Rajić? Der Raucher? Ist früher Mehl gefahren.'); await A.wait(500); await Mt.say('Seit dem Krieg fährt er nachts nicht mehr. Vulkanizer hinter dem Bulevar.');
  A.note('v3_mate'); A.setFlag('k3.v.known'); await A.wait(500); await Mt.say('Grüßen Sie ihn nicht von mir. Er grüßt nie zurück.');
  if (A.G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Der Raucher.'); } }
async function promise(A,Mt){ if (A.flag('k3.b.promise')) return;
  await Mt.say('Junger Mann.'); await A.wait(500); await Mt.say('Sind Sie morgen hier? Sehen Sie nach, ob er kommt. Meine Augen sind nicht mehr so gut. Ich erkenne ihn am Gang.');
  var c=await A.choose([{t:'Ich sehe nach.',id:'yes'},{t:'Ich weiß nicht, ob ich morgen hier bin.',id:'no'}],{title:'Mate'});
  if (c==='yes'){ A.setFlag('k3.b.promise'); await Mt.say('Gut. Um sechs. Oder später. Er hat immer Verspätung, der Bus.'); }
  else await Mt.say('Dann sehe ich allein. Das bin ich gewohnt.'); }
async function talkMate(A){ var Mt=A.npc('mate'), p=A.G.phase;
  if (!A.isFound('mate')) return A.m('Ein leerer Stuhl am Fenster. Kalt, als hätte gerade jemand darauf gesessen.');
  await A.menuLoop(function(){ var d2=p==='k3_d2'; return [
    {t:'Ihr Sohn kommt aus München?',once:'mt1',go:async function(A){ await Mt.say('Davor. Er ist Ingenieur. Er hat eine Tochter, die ich nur von Postkarten kenne.'); await A.wait(500); await Mt.say('Ich schreibe ihm jedes Jahr. Er schreibt nicht oft zurück. Er hat viel zu tun.'); }},
    {t:'Wie lange warten Sie schon?',once:'mt2',go:async function(A){ await Mt.say('Seit heute früh.'); await A.wait(800); await Mt.say('Oder seit gestern. Ich bin immer zu früh. Das habe ich in Deutschland gelernt. Da ist man zu früh, oder man ist weg.'); }},
    {t:'Sie kennen hier jeden?',once:'mt3',go:async function(A){ await Mt.say('Jeden, der einen Bus nimmt. Und jeden, der keinen mehr nimmt.'); }},
    {t:'Ich suche einen Fahrer. Er ist im Krieg Mehl gefahren, in die Dörfer am Fluss. Er hat geraucht und nichts gesagt.',if:!A.hasNote('v3_mate'),go:function(A){ return driverHint(A,Mt); }},
    {t:'Welches Jahr ist heute?',once:'mt4',go:async function(A){ await Mt.say('Zweitausendzehn. März.'); await A.wait(500); await Mt.say('Es ist noch kalt für März. Darum habe ich den Tee dabei.'); }},
    {t:'Der Bus aus München war da.',once:'mt5',if:d2&&A.flag('k3.b.arrived'),go:async function(A){ await Mt.say('Ja. Er hatte Verspätung.'); await A.wait(700); await Mt.say('Er kommt mit dem nächsten. Mein Sohn ist jung.'); }},
    {t:'Der graue Mann aus dem Bus. Das war vielleicht Ihr Sohn.',once:'mt6',if:d2&&A.flag('k3.b.arrived'),go:async function(A){ Mt.agitate(1600); await Mt.say('Der?'); await A.wait(600); await Mt.say('Der ist alt. Mein Sohn hat Haare wie ein Igel und lacht laut. Der da hat nicht gelacht.'); }},
    {t:'Und das Mädchen bei ihm? Im rosa Anorak?',once:'mt7',if:d2&&A.flag('k3.b.arrived'),go:async function(A){ await Mt.say('Meine Enkelin ist klein. So klein.'); await A.narrate('Er hält die Hand über den Tisch, auf der Höhe einer Kaffeetasse.'); await Mt.say('Auf den Postkarten ist sie immer so klein.'); }},
    {t:'Herr Zelenika. Sie sind nicht mehr …',go:async function(A){ await Mt.say(A.cycle('mtDead',['Was? Die Busse sind so laut hier. Sagen Sie es noch einmal, wenn keiner einfährt.','Was? … Da kommt einer. Nein. Der fährt nach Split.'])); }},
    A.askOpt({
      k3_c_bridge:function(A){ return driverHint(A,Mt); },
      v3_ljerka:function(A){ return driverHint(A,Mt,'ljerka'); },
      v3_where:'Rajić. Sag ich doch. Hinter dem Bulevar.',
      p3_munich:'Jeden Samstag einer nach München. Jeden Samstag einer zurück. Und ich jeden Samstag hier.',
      b3_zdravko:'Zdravko. Der sagt Dida zu mir, weil er keinen eigenen hatte.',
      photo_full:async function(A){ await Mt.say('Ein schönes Kind.'); await A.wait(500); await Mt.say('Meine Enkelin ist auch so. Glaube ich. Ich kenne sie nur von Postkarten.'); },
      l3_skela:'Skela? Da war eine Fähre. Vor dem Krieg sind wir sonntags hingefahren. Davor ist immer ins Wasser gesprungen und hat gefroren.',
      l3_oldmap:'Die Karte von Zdravko? Da ist noch mein Dorf drauf. Und die Straße nach München. Die geht über den Rand.' },
      'Das weiß ich nicht. Ich weiß nur, wann die Busse kommen.'),
    {t:'Auf Wiedersehen, Herr Zelenika.',bye:true,go:async function(A){ if (p==='k3_d1' && !A.flag('k3.b.promise')) return promise(A,Mt); await Mt.say(A.cycle('mtBye',['Mit Gott. Oder mit dem Bus.','Grüßen Sie meinen Sohn, wenn Sie ihn sehen.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Mate (mit Mala)
async function talkMateG(A){ var Mt=A.npc('mate'); if (!A.isFound('mate')) return mateFind(A);
  await A.menuLoop(function(){ return [
    {t:'Warum warten Sie hier und nicht zu Hause?',once:'mg1',go:async function(A){ await Mt.say('Zu Hause wartet man nicht richtig. Da macht man sich Kaffee und vergisst die Uhr.'); await A.wait(400); await Mt.say('Hier vergisst man nichts. Hier fährt alle zehn Minuten einer ab.'); }},
    {t:'Was ist in Ihrer Jackentasche?',once:'mg2',go:async function(A){ await Mt.say('Mein Hausschlüssel.'); await A.wait(600); await Mt.say('Ich halte ihn fest, damit ich ihn nicht verlege, wenn er kommt. Ein alter Mann verlegt alles.'); }},
    {t:'Ich habe auch gewartet. In Split. Auf einer Treppe.',once:'mg3',go:async function(A){ await Mt.say('Und? Ist er gekommen?'); await A.wait(900); await A.g('Ich bin gegangen. Vorher.'); await A.wait(600); await Mt.say('Das ist das Schlimmste. Man geht immer einen Bus zu früh.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
// ---------------------------------------------------------------- Zdravko
async function coffee(A,Z){ A.sfx('cups'); await Z.anim('polish'); await Z.say(A.cycle('zdCoffee',['Domaća. Mit Zucker oder mit Geduld?','Kafa. Die Tasse ist heiß, der Kaffee heißer.','Noch eine? Sie sitzen ja gar nicht. Sie stehen nur.']));
  if (A.first('zdCoffeeM')){ await A.m('Ohne.'); await Z.say('Dann mit Geduld.'); } await A.narrate('Der Kaffee ist dick und süß und zu heiß. Zdravko nimmt keine Mark dafür. „Das nächste Mal.“'); }
async function windowTable(A,Z){ if (A.hasNote('b3_zdravko')){ await Z.say('Der Tisch von Dida Mate. Ich räume ihn nicht ab. Man weiß ja nie.'); return; }
  await Z.say('Am Fenster? Keiner.'); await A.wait(900); await Z.say('Das war der Tisch von Dida Mate.'); await A.wait(500);
  await Z.say('Ein Kaffee, zwei Stunden. Das war Dida Mate.'); A.note('b3_zdravko');
  await Z.say('Er hat auf den Bus aus München gewartet. Jeden Samstag, zwanzig Jahre lang. Sein Sohn ist da unten.'); await A.wait(700);
  await Z.say('Letztes Frühjahr ist er gestorben. Im März.'); await A.wait(600); await Z.say('Ich decke den Tisch nicht ab. Die Tasse stelle ich jeden Morgen umgedreht hin, wie er es gemocht hat.');
  if (A.G.malaOn && A.malaHere() && seen(A)){ await A.wait(800); await A.g('Er hört dich nicht, Mate. Er sieht dich nicht.'); await A.npc('mate').say('Zdravko poliert zu viel. Das war schon immer so.'); } }
async function talkZdravko(A){ var Z=A.npc('zdravko'), p=A.G.phase;
  await A.menuLoop(function(){ return [
    {t:'Eine Kafa, bitte.',go:function(A){ return coffee(A,Z); }},
    {t:A.isFound('mate')?'Wer sitzt da am Fenster?':'Warum steht da eine umgedrehte Tasse am Fenster?',if:!A.hasNote('b3_zdravko'),go:function(A){ return windowTable(A,Z); }},
    {t:'Die Karte an der Wand?',once:'zd1',go:async function(A){ await Z.say('Von fünfundachtzig. Damals wusste man noch, wo was ist.'); await A.wait(400); await Z.say('Die Dörfer, die Fähren, jeder Feldweg. Schauen Sie sie an. Sie ist umsonst. Der Kaffee nicht.'); A.setFlag('k3.zd.map'); }},
    {t:'Der Mann mit dem Mädchen. Aus dem Bus aus München.',once:'zd2',if:p==='k3_d2'&&A.flag('k3.b.arrived'),go:async function(A){ await Z.say('Davor. Der Sohn von Dida Mate.'); await A.wait(600); await Z.say('Ich habe ihn erkannt. Am Gang. Er hat mich nicht erkannt. Ich habe zugenommen. Er auch.'); }},
    {t:'Kommt heute ein Bus aus München?',once:'zd3',if:p==='k3_d3',go:async function(A){ await Z.say('Sonntags? Nein. Sonntags kommt aus München nur das Fernsehen.'); }},
    A.askOpt({
      v3_ljerka:async function(A){ await Z.say('Vlado, der Raucher?'); await A.wait(500); await Z.say('Vlado Rajić. Vulkanizer hinter dem Bulevar. Er kommt jeden Morgen um sieben auf einen Kaffee, steht an der Theke, zahlt und geht.'); await Z.say('Zehn Jahre, und ich weiß nicht, wie seine Stimme klingt.'); if (!A.hasNote('v3_where')) A.note('v3_where'); A.setFlag('k3.v.known'); },
      v3_mate:'Rajić? Der Vulkaniseur? Der kommt jeden Morgen. Wer hat Ihnen von ihm erzählt?',
      v3_where:'Rajić. Ja. Sieben Uhr, Kaffee, Mark auf die Theke, weg.',
      b3_mate:async function(A){ await Z.say('Mate Zelenika?'); await A.wait(800); await Z.say('Woher kennen Sie den Namen?'); await A.wait(600); if (!A.hasNote('b3_zdravko')) await windowTable(A,Z); else await Z.say('Dida Mate. Er ist tot. Und ich decke trotzdem für ihn.'); },
      k3_c_bridge:'Fahrer, die im Krieg geraucht haben? Alle. Die meisten fahren heute Taxi.',
      p3_munich:'Der Bus aus München kommt samstags um sechs. Sagt der Fahrplan. Er kommt, wann er will.',
      photo_full:'Achtundachtzig? Da hatte ich noch Haare. Und das Café hatte noch keinen Fernseher.',
      l3_skela:'Skela? Da sind wir früher zum Baden hingefahren. Mit dem Bus. Den Bus gibt es nicht mehr, die Fähre auch nicht.',
      l3_area:'Südlich der Stadt? Da ist nur noch Fluss und Dorf. Schauen Sie auf die Karte. Die weiß mehr als ich.' },
      ['Das weiß ich nicht. Ich weiß, wann die Busse fahren.','Fragen Sie mich was Leichteres. Kaffee oder Rakija.']),
    {t:'Danke, Zdravko.',bye:true,go:async function(A){ await Z.say(A.cycle('zdBye',['Bitte. Busse fahren, ich bleibe.','Kommen Sie wieder. Die Tasse steht.'])); }}
  ]; }); }
// ---------------------------------------------------------------- die alte Karte
async function oldMap(A){ var Z=A.npc('zdravko');
  if (!A.flag('k3.zd.map') && A.first('zdMapLine')){ await Z.say('Die Karte? Von fünfundachtzig. Damals wusste man noch, wo was ist.'); A.setFlag('k3.zd.map'); await A.wait(300); }
  await M.k3OldMap(A); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Zum Bussteig',exit:{to:'westbus'},look:'Die Glastür zum Bussteig. Draußen fährt ein Bus ab, ohne dass einer winkt.',g:{look:'Draußen sind die Busse. Hier drin die, die auf sie warten.'}},
 {id:'zdravko',npc:'zdravko',name:'Zdravko',hgt:30,talkDist:30,talk:talkZdravko,
   look:'Ein runder Mann hinter der Theke, kahl, mit Brauen wie zwei Bürsten. Weißes Hemd, schwarze Weste, ein Geschirrtuch über der Schulter. Er poliert ein Glas, das längst sauber ist.',
   give:{ km:async function(A){ await A.npc('zdravko').say('Behalten Sie die. Das nächste Mal.'); }, photo_full:'Zdravko: „Achtundachtzig? Da hatte ich noch Haare.“', vizitka:'Zdravko: „Zelenika, München. Dann kommt er also wieder. Gut.“' },
   g:{look:'Er schaut manchmal zum Fenstertisch. Er weiß nicht, warum.',listen:'Er zählt halblaut die Busse, die einfahren. Er tut das, seit er denken kann.'}},
 {id:'mate',npc:'mate',name:'Mate',hgt:36,vis:function(S,G){ return mateHere(G); },talk:talkMate,
   look:function(A){ if (!A.isFound('mate')) return A.m('Ein leerer Stuhl am Fenstertisch. Daneben eine Thermoskanne, die niemandem gehört.'); return A.m('Ein alter Mann am Fenstertisch, schmal, gebeugt, grauer Filzhut, grauer Anzug aus den Siebzigern, Krawatte. Vor ihm eine Thermoskanne. Durch ihn hindurch sehe ich den Bussteig.'); },
   give:{ photo_full:'Mate: „Ein schönes Kind. Meine Enkelin ist auch so. Glaube ich.“', km:'Mate: „Lassen Sie. Ich habe meinen Tee.“', rueckfahrt:'Mate: „Sarajevo. Da fährt einer um sieben. Der ist immer pünktlich. Komisch.“' },
   g:{look:function(A){ if (!A.isFound('mate')) return mateFind(A); return A.g('Mate. Seine Leine geht zum Fenster hinaus, nach Süden. Zu einem Haus, glaube ich. Und in seiner Jackentasche ist etwas Schweres. Ein Schlüssel.'); },
     talk:function(A){ return talkMateG(A); },
     sense:async function(A){ if (!A.isFound('mate')) return mateFind(A); if (A.flag('k3.b.mateSensed')) return A.g('Ein Tor. Ein Pfosten. Ein Bus, der nicht hält.'); A.setFlag('k3.b.mateSensed');
       await A.memory({title:'Nachhall – Mate',tint:'ghost',draw:M.mem&&M.mem.k3_mate,lines:['Ein Gartentor, Abend. Ein Mann mit Hut lehnt am Pfosten, eine Thermoskanne unter dem Arm.','In der Hand ein Schlüssel. Er dreht ihn, steckt ihn ein, holt ihn wieder heraus.','Ein Bus fährt vorbei. Er hält nicht. Der Mann bleibt stehen, bis die Rücklichter weg sind.']});
       await A.g('Er wartet nicht nur hier. Er wartet auch an einem Tor. Mit dem Schlüssel in der Hand.'); }}},
 {id:'oldmap',name:'Alte Landkarte',look:function(A){ return oldMap(A); },use:function(A){ return oldMap(A); },read:function(A){ return oldMap(A); },
   g:{look:function(A){ return A.g(A.hasNote('l3_skela')?'Skela. Da ist ein kleines Zeichen am Fluss. Ich sehe nicht gern hin.':'Eine Karte. Für mich sind Karten Bilder von Orten, an denen ich nie war.'); }}},
 {id:'bar',name:'Theke',look:'Eine Theke aus Resopal, eine Espressomaschine aus den Achtzigern, Rakijaflaschen mit handgeschriebenen Etiketten. Daneben ein Glas saure Gurken, das niemand bestellt.',
   use:function(A){ return coffee(A,A.npc('zdravko')); },take:'Die Rakija gehört Zdravko. Und um diese Uhrzeit auch noch dem Teufel.',
   g:{look:'Er poliert dasselbe Glas seit einer halben Stunde.'}},
 {id:'window_table',name:'Fenstertisch',look:function(A){ var G=A.G; if (seen(A)) return A.m('Am Fenstertisch sitzt Mate, den Hut auf, die Thermoskanne vor sich. Er sieht zu den Bussen.');
     return A.m(G.phase==='k3_d3'?'Der Fenstertisch. Leer. Die Tasse steht umgedreht auf der Untertasse.':'Ein Tisch am Fenster, mit Blick auf den Bussteig. Eine Tasse steht darauf, umgedreht auf der Untertasse, wie für einen, der gleich kommt.'); },
   use:function(A){ return A.m(seen(A)?'Der Platz ist besetzt. Auch wenn es keiner sieht.':'Ich setze mich nicht dahin. Zdravko sieht mich an, als hätte ich etwas vor.'); },
   g:{look:function(A){ return A.g(mateHere(A.G)?'Seine Thermoskanne dampft. Sie ist leer und dampft trotzdem.':'Der Stuhl ist leer. Heute wartet er woanders.'); }}},
 {id:'tv',name:'Fernseher',look:'Ein Fernseher in der Ecke, ohne Ton. Ein Fußballspiel aus einer Liga, die keiner kennt. Es steht null zu null.',use:'Lauter will ich ihn nicht. Und Zdravko auch nicht.',
   g:{look:'Er läuft, damit es nicht so still ist.'}},
 {id:'photos',name:'Fotos',look:function(A){ return A.m(A.isFound('mate')?'Fotos an der Wand. Auf einem sitzt Mate am Fenstertisch und lacht in die Kamera, die Thermoskanne vor sich. Derselbe Tisch wie jetzt. Derselbe Hut.':'Fotos an der Wand: Busfahrer vor ihren Bussen, eine Hochzeit im Café, eine Fußballmannschaft. Auf einem sitzt ein alter Mann mit Hut am Fenstertisch und lacht in die Kamera, eine Thermoskanne vor sich.'); },
   take:'Die Fotos gehören an die Wand. Sonst wüsste keiner mehr, wer hier gesessen hat.',
   g:{look:'Auf dem Foto lacht er. Jetzt lacht er nicht.',sense:'Ein Samstag. Er hat gelacht, weil Zdravko gesagt hat: Lach mal, Dida, du wartest doch sowieso.'}}
];
M.room('kafic',{ name:'Café „Zdravko“', scape:'k3_kafic',
  music:function(G){ return mateHere(G)?'k3_mate':'k3_istraga'; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[], z=M.apos('kafic','zdravko',[192,95,'L']);
    L.push({id:'zdravko',ch:'zdravko',x:z[0],y:z[1],f:z[2]||'L',name:'Zdravko',idle:'polish',speechY:34});
    if (mateHere(G)){ var m=M.apos('kafic','mate',[250,118,'R']), w=M.spot('kafic','window_table');
      L.push({id:'mate',ch:'mate',x:m[0],y:m[1],f:m[2]||'R',name:'Mate',ghost:true,reveal:true,idle:'sit',talk:'sitTalk',speechY:38,
        anchor:w[2]?[w[0]+w[2]-6,w[1]+4]:null}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (A.first('kfFirst')){ await A.narrate('Ein kleines Café aus den Achtzigern. Resopaltische, ein Fernseher ohne Ton, eine alte Landkarte an der Wand. Es riecht nach Kaffee und nach nassen Jacken.'); }
    if (M.INTRO && M.INTRO.zdravko && M.isMet && !M.isMet(G,'zdravko') && M.introduce) await M.introduce(A,'zdravko');
    if (mateHere(G) && !A.isFound('mate') && G.malaOn && A.malaHere()) await mateFind(A);
    if (G.phase==='k3_d2' && mateHere(G) && A.isFound('mate') && A.first('kfD2')){ await A.narrate('Mate sitzt wieder am Fenstertisch. Er hat die Thermoskanne aufgeschraubt und wieder zugeschraubt.'); if (A.flag('k3.b.promise')){ await A.npc('mate').say('Sie haben nachgesehen. Danke.'); await A.npc('mate').say('Er kommt mit dem nächsten.'); } }
    if (G.phase==='k3_d3' && A.first('kfD3')){ await A.m('Der Fenstertisch ist leer. Die Tasse steht umgedreht auf der Untertasse.'); if (G.malaOn && A.malaHere()) await A.g('Er ist nicht hier. Heute wartet er woanders.'); } }
});
})(M);
