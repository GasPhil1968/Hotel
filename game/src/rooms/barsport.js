/* ===== rooms/barsport.js — „Bar Sport“ im Bahnhofsviertel: Signor Enzo Caruso („Come il tenore. Ma stonato.“), der 1962 im selben
   Zug kam wie Peppino; die Fotowand mit dem Bild vom Bahnsteig 1962 und dem Zeitungsausschnitt „Der letzte Gepäckträger“; ein alter
   Mann mit Zeitung. Enzo kennt Peppino, aber keinen Nachnamen: „Per noi era Peppino. Basta.“ (s4_enzo) ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
var DAY=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'];
function rid(A){ return A.room?A.room.id:''; }
function here(A){ return !!(A.G.malaOn && A.G.pos.mala.room===rid(A)); }
function markoHere(A){ return A.G.pos.marko.room===rid(A); }
function alone(A){ return A.G.active==='mala' && !markoHere(A); }
function askOpt(title,also,table,fb){ return {t:'Nach etwas aus dem Notizbuch fragen …',silent:true,noGray:true,go:async function(A){
  var id=await A.askNote(title,{also:also}); if (!id) return; var h=table[id]; if (h===undefined) h=fb; if (typeof h==='function') return await h(A,id); }}; }
// ---------------------------------------------------------------- Peppino (s4_enzo)
async function enzoDead(A,E){ var G=A.G; if (F(G,'k4.s.enzoKnows')) return; A.setFlag('k4.s.enzoKnows');
  await A.m('È morto. Il sedici dicembre.'); await A.wait(1200); await E.anim('wipe');
  await E.say('Lo sapevo.'); await A.wait(500);
  await E.say(G.phase==='k4_d1'?'Martedì non è venuto. Peppino viene sempre di martedì. Un caffè, da quarantanove anni.':'Due martedì che non viene. Peppino viene sempre di martedì. Un caffè, da quarantanove anni.');
  await A.m('Er hat es gewusst. Peppino kam jeden Dienstag auf einen Kaffee, neunundvierzig Jahre lang. Und jetzt kam er nicht mehr.'); }
async function enzoPeppino(A,E){ var G=A.G; if (N(G,'s4_enzo')) return E.say('Peppino. Diciassette. Il cognome non lo so. Per noi era Peppino.');
  await E.anim('polish'); await E.say('Peppino?'); await A.wait(700); await E.say('Peppino il facchino. Diciassette, sulla berretta.');
  await A.m('Peppino der Gepäckträger. Siebzehn, auf der Mütze.');
  await E.say('Siamo arrivati insieme. Sessantadue, marzo. Stesso treno, stesso vagone. Lui aveva una valigia di cartone e una paura che non finiva più.');
  await A.m('Sie sind zusammen angekommen, im März zweiundsechzig. Derselbe Zug, derselbe Wagen. Er hatte einen Pappkoffer und eine Angst, die nicht aufhörte.');
  await E.say('Io sono tornato a casa ogni estate. Lui mai. Peppino non è mai tornato.');
  var c=await A.choose([{t:'Warum nicht?',id:'why'},{t:'Er ist tot.',id:'dead'},{t:'(Zuhören.)',id:'listen',silent:true}],{title:'Enzo'});
  if (c==='why'){ await A.m('Perché no?'); await E.say('Vergogna, forse. A casa pensavano che facesse chissà che cosa. Un ufficio. Una cravatta.'); await A.m('Scham, vielleicht. Zu Hause dachten sie, er hat ein Büro. Eine Krawatte.'); }
  else if (c==='dead') await enzoDead(A,E);
  await A.wait(400); await E.say('Ha imparato il bavarese. Meglio di loro. Perché nessuno gli chiedesse da dove veniva.');
  await A.m('Er hat Bairisch gelernt. Besser als die Bayern. Damit keiner fragt, woher er kommt.');
  await A.wait(400); await A.m('E il cognome?'); await E.anim('point'); await E.say('Il cognome …'); await A.wait(800); await E.say('Per noi era Peppino. Basta.');
  A.note('s4_enzo'); A.setFlag('k4.s.enzo');
  await A.m('Den Nachnamen weiß er nicht. Für sie war er Peppino. Basta.');
  if (here(A)){ await A.wait(400); await A.g('Er wischt die Theke, wo nichts ist. Das macht man, wenn man nicht weinen will.'); } }
async function enzoInvite(A,E){ A.setFlag('k4.s.enzoInv');
  await A.m('Giovedì lo salutiamo. Alla missione della stazione, al binario undici. La mattina.');
  await A.wait(600); await E.say('Giovedì.'); await A.wait(500); await E.say('Ci sarò. Porto il caffè. Quello buono, non quello che gli davo.');
  await A.m('Er kommt. Er bringt Kaffee mit. Den guten, nicht den, den er ihm immer gegeben hat.'); }
async function coffee(A,E){ A.sfx('cups'); await E.anim('espresso');
  await E.say(A.cycle('enCoffee',['Un caffè. Subito.','Un altro? Lei beve come un napoletano.','Caffè. L’unica cosa che qui faccio bene.']));
  await A.m(A.cycle('enCoffeeM',['Der Espresso ist gut. Enzo sieht mir beim Trinken zu, als wäre das eine Prüfung.','Er will kein Geld. „Domani“, sagt er. Morgen. Das sagt er offenbar zu jedem.','Ich trinke ihn in zwei Schlucken, wie man es hier macht. Enzo nickt.'])); }
var EN_ALSO=['s4_peppino','s4_name','s4_bunker','s4_umschlag','s4_ausweis','s4_wusste','s4_fluch','s4_bairisch','s4_tarnung','s4_derselbe','s4_genommen'];
async function talkEnzo(A){ var E=A.npc('enzo'), G=A.G;
  var table={
    s4_peppino:function(A){ return enzoPeppino(A,E); },
    s4_name:async function(A){ await E.say('Ruggiero …'); await A.wait(600); await E.say('Giuseppe Ruggiero.'); await A.wait(800); await E.say('Quarantanove anni, e non sapevo il suo cognome. Che amico sono?'); await A.m('Neunundvierzig Jahre, und er kannte seinen Nachnamen nicht. Was für ein Freund, fragt er.'); },
    s4_bunker:async function(A){ await E.say('Il bunker. Sì. Ci siamo passati tutti. Un timbro, un nome.'); await A.wait(500); await E.say('A me hanno lasciato Enzo. Facile. Quattro lettere.'); await A.m('Durch den Bunker sind sie alle gegangen. Ein Stempel, ein Name. Ihm haben sie Enzo gelassen. Vier Buchstaben, einfach.'); },
    s4_umschlag:async function(A){ await E.say('Pietrafonda? Il paese della frana. Quello vecchio non c’è più. Hanno fatto quello nuovo, più su.'); await A.m('Pietrafonda. Das Dorf mit dem Erdrutsch. Das alte gibt es nicht mehr, sie haben ein neues gebaut, weiter oben.'); },
    s4_ausweis:async function(A){ await E.say('Josef?'); await A.wait(500); await E.say('Peppino un Josef? Allora io sono Heinz.'); await A.m('Peppino ein Josef? Dann ist er Heinz, sagt er.'); },
    s4_wusste:async function(A){ await E.say('La sorella lo sapeva? Dal settantanove?'); await E.anim('wipe'); await A.wait(500); await E.say('Allora si sono protetti a vicenda. Quarantanove anni. Due cretini.'); await A.m('Dann haben sie einander geschützt. Neunundvierzig Jahre. Zwei Dummköpfe, sagt er. Er sagt es zärtlich.'); },
    s4_fluch:async function(A){ await E.say('Imprecava, sì. In dialetto. Solo qui da me, mai fuori.'); await A.m('Geflucht hat er. Im Dialekt. Nur hier, bei ihm.'); },
    s4_bairisch:async function(A){ await E.say('Urmünchner!'); await A.wait(400); await E.say('Ha ha. Sì. Parlava come un bavarese. Io dopo cinquant’anni parlo ancora come un barese.'); await A.m('Er hat geredet wie ein Bayer, sagt Enzo. Er selbst redet nach fünfzig Jahren noch wie einer aus Bari.'); },
    s4_tarnung:async function(A){ await E.say('Due lingue. Una per farsi lasciare in pace, una per vivere.'); await A.m('Zwei Sprachen. Eine, damit man ihn in Ruhe lässt. Eine zum Leben.'); },
    s4_derselbe:async function(A){ await E.say('Diciassette. Sì. Il numero lo portava come un nome.'); await A.m('Die Siebzehn hat er getragen wie einen Namen.'); },
    s4_genommen:async function(A){ await E.say('Il nome preso … al binario undici?'); await A.wait(500); await E.say('Sotto c’era l’ufficio. Lì ci hanno messo tutti in fila.'); await A.m('Unter dem Gleis war ein Büro, sagt er. Da standen sie alle in einer Reihe.'); }
  };
  await A.menuLoop(function(){ var know=N(G,'s4_peppino'), sepp=F(G,'k4.s.wimmer'), after=F(G,'k4.s.call')||F(G,'k4.s.wimmerFw')||F(G,'k4.s.crossed'); return [
    {t:'Un caffè, per favore.',go:function(A){ return coffee(A,E); }},
    {t:'Kennen Sie einen Peppino? Gepäckträger, Nummer siebzehn.',if:know&&!N(G,'s4_enzo'),go:function(A){ return enzoPeppino(A,E); }},
    {t:'Kennen Sie einen Sepp? Vom Bahnhof.',once:'en1',if:sepp,go:async function(A){ await E.say('Sepp? Qui non c’è nessun Sepp.'); await A.wait(400); await E.say('Qui ci sono Peppe, Pino, Totò. Sepp no.'); await A.m('Einen Sepp gibt es hier nicht. Hier gibt es Peppe, Pino, Totò.'); }},
    {t:'Peppino ist tot.',if:N(G,'s4_enzo')&&!F(G,'k4.s.enzoKnows'),go:function(A){ return enzoDead(A,E); }},
    {t:'Am Donnerstag verabschieden wir ihn.',if:after&&N(G,'s4_enzo')&&!F(G,'k4.s.enzoInv')&&!F(G,'k4.s.farewell')&&G.phase!=='k4_d5',go:async function(A){ if (!F(G,'k4.s.enzoKnows')) await enzoDead(A,E); await enzoInvite(A,E); }},
    {t:'Am Christtag haben Sie offen?',once:'en2',if:G.phase==='k4_d1',go:async function(A){ await E.say('Natale? A casa mia non c’è nessuno. Qui almeno passa gente.'); await A.m('Bei ihm zu Hause ist keiner mehr. Hier kommen wenigstens Leute vorbei.'); }},
    {t:'Wie lange haben Sie die Bar schon?',once:'en3',go:async function(A){ await E.say('Dal settantuno. Prima ho fatto il muratore, otto anni. Poi ho detto: basta mattoni. Caffè.'); await A.m('Seit einundsiebzig. Vorher acht Jahre Maurer. Dann: Schluss mit Ziegeln. Kaffee.'); }},
    askOpt('Wonach frage ich ihn?',EN_ALSO,table,async function(A){ await E.say(A.cycle('enNo',['Non lo so. Io faccio il caffè, non le informazioni.','Boh. Chieda a lui.'])); if (A.cycle('enNo2',[0,1])===1) await A.m('„Er“ ist der alte Mann mit der Zeitung. Der sagt nie etwas.'); }),
    {t:'Arrivederci, signor Enzo.',bye:true,go:async function(A){ await E.say(A.cycle('enBye',['Arrivederci. E si copra, fa freddo.','Ciao, ciao. Torni quando vuole.'])); }}
  ]; }); }
async function talkGast3(A){ var O=A.npc('gast3'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Buongiorno.',once:'g3a',go:async function(A){ await O.say('Mh.'); await A.wait(800); await O.say('Buongiorno.'); }},
    {t:'Kannten Sie Peppino?',once:'g3b',if:N(G,'s4_enzo'),go:async function(A){ await O.anim('read'); await A.wait(900); await O.say('Peppino portava le valigie come portava la testa.'); await A.wait(500); await O.say('Dritta.'); await A.m('Er hat die Koffer getragen, wie er den Kopf getragen hat. Gerade.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function photo62(A){ var G=A.G;
  await A.m('Ein Schwarzweißfoto: junge Männer auf einem Bahnsteig, Mäntel, Pappkoffer. Einer lacht in die Kamera. Hinten, unscharf, ein Schild mit einer Elf.');
  if (N(G,'s4_enzo') && A.first('bsPhoto')){ var E=A.npc('enzo'); await E.anim('point'); await E.say('Questo con i capelli sono io. E questo, con la valigia legata con lo spago, è Peppino.'); await A.m('Der mit den Haaren, das ist Enzo. Und der mit dem Koffer, mit Schnur zugebunden, das ist Peppino.'); } }
async function clipping(A){ await A.doc({style:'news',title:'Der letzte Gepäckträger',lines:['Abendzeitung, 14. März 1985','','Peppino (46) trägt seit 23 Jahren','Koffer am Hauptbahnhof. Nächstes','Jahr ist Schluss. „Rollkoffer“, sagt','er und lacht, „die tragen sich','selber.“ Seinen Nachnamen will er','nicht in der Zeitung. „Peppino reicht.“']});
  if (A.first('bsClip')) await A.m('Kein Nachname. Auch hier nicht.'); }
var HS=[
 {id:'door',name:'In die Stadt',exit:{to:'map'},look:'Die Tür mit einer Glocke, die schellt, wenn einer kommt. Draußen das Bahnhofsviertel im Schnee: Gemüseläden, Telefonläden, ein Hotel mit drei Sternen, von denen einer leuchtet.',g:{look:'Draußen die Straße. Die Glocke hat nicht geschellt, als ich kam.'}},
 {id:'counter',name:'Theke',look:'Eine Theke aus Marmorimitat, darauf Zuckertüten in einem Glas, ein Teller mit Cornetti unter einer Haube, die Zeitungen von gestern.',use:function(A){ return coffee(A,A.npc('enzo')); },take:'Die Cornetti sind von heute früh. Enzo sieht mich an, als wüsste er das.',
   g:{look:'Er hat die Theke heute schon dreimal gewischt. Sie ist sauber. Er wischt trotzdem.'}},
 {id:'machine',name:'Espressomaschine',look:'Eine Espressomaschine aus Chrom, so alt wie die Bar und viel besser gepflegt als der Rest.',use:function(A){ return coffee(A,A.npc('enzo')); },
   g:{look:'Sie zischt wie ein Zug, der gleich fährt.'}},
 {id:'photos',name:'Fotowand',look:'Fotos an der Wand: Fußballmannschaften, eine Hochzeit, Enzo jung mit Schnurrbart vor der Bar. Dazwischen ein vergilbter Zeitungsausschnitt.',read:function(A){ return clipping(A); },use:function(A){ return clipping(A); },
   g:{look:'Lauter Leute, die lachen, weil einer „Cheese“ gesagt hat. Oder was man hier sagt.',sense:'Hier haben Männer Fußball geschaut und nach Hause telefoniert. Mit Münzen, die nie gereicht haben.'}},
 {id:'photo1962',name:'Foto von 1962',look:function(A){ return photo62(A); },
   g:{look:'Einer lacht. Einer nicht. Der, der nicht lacht, hält seinen Koffer fest, als könnte ihn einer nehmen.',sense:'Sie haben gesungen, im Zug. Bis zum Brenner. Danach war es still.'}},
 {id:'tv',name:'Fernseher',look:'Italienisches Fernsehen, ohne Ton. Eine Quizshow, bei der alle gleichzeitig reden.',use:'Lauter macht es nicht besser.',
   g:{look:'Sie lachen alle. Ich weiß nicht, worüber. Es ist trotzdem schön.'}},
 {id:'tables',name:'Tische',look:'Zwei kleine runde Tische mit Marmorplatte. An einem sitzt ein sehr dünner alter Mann mit Hut hinter einer Zeitung.',
   g:{look:'An dem freien Tisch ist einer jeden Dienstag gesessen. Der Stuhl steht noch so, wie er ihn hingestellt hat.'}},
 {id:'window',name:'Fenster',look:'Durch das Fenster: Schnee auf geparkten Autos, ein Mann mit Gemüsekisten, eine Straßenbahn in der Ferne.',
   g:{look:'Draußen geht einer vorbei, der genauso aussieht wie einer, den ich gekannt habe. Er ist es nicht. Er ist es nie.'}},
 {id:'enzo',npc:'enzo',name:'Signor Enzo',hgt:40,talk:talkEnzo,
   look:'Ein kleiner runder Mann hinter der Theke: Glatze mit weißem Haarkranz, eine dicke schwarze Brille, weißer Schnurrbart. Weißes Hemd, weinrote Strickweste, Hosenträger.',
   give:{ aushang:function(A){ var E=A.npc('enzo'); return (async function(){ await E.say('È lui.'); await A.wait(600); await E.say('Peppino. Con la berretta.'); await A.m('Das ist er, sagt Enzo. Peppino, mit der Mütze.'); })(); }, photo_full:'Enzo: „Bella! La sua famiglia?“ Ob das meine Familie ist.', vanilice:'Enzo: „Biscotti? No, no. Li porti a sua madre.“' },
   g:{look:'Er ist traurig und stolz zugleich. Beides steht ihm.',listen:'Er summt etwas Altes. Er kann die Melodie nicht. Er summt sie trotzdem.'}},
 {id:'gast3',npc:'gast3',name:'Mann mit Zeitung',hgt:32,talk:talkGast3,look:'Ein sehr dünner alter Mann mit Hut und Mantel, hinter einer rosa Zeitung. Er hat in einer halben Stunde nicht umgeblättert.',
   g:{look:'Er liest nicht. Er hält die Zeitung, damit ihn keiner anspricht.'}}
];
M.room('barsport',{ name:'Bar Sport', scape:'k4_barsport', music:'k4_sepp',
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (DAY.indexOf(G.phase)<0) return L;
    var e=M.apos('barsport','enzo',[230,112,'L']), o=M.apos('barsport','gast3',[110,126,'R']);
    L.push({id:'enzo',ch:'enzo',x:e[0],y:e[1],f:e[2]||'L',name:'Signor Enzo',speechY:40,routine:[['idle',null,6,12],['anim','polish'],['idle',null,5,9],['anim','espresso']]});
    L.push({id:'gast3',ch:'gast3',x:o[0],y:o[1],f:o[2]||'R',name:'Mann mit Zeitung',idle:'read',speechY:34,routine:false});
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (alone(A)){ if (A.first('bsMala')) await A.g('Eine kleine Bar. Es riecht nach Kaffee. Das weiß ich noch, wie das riecht. Ich rieche es nicht mehr.'); return; }
    if (A.first('bsFirst')) await A.narrate('Eine kleine Bar mit einer Espressomaschine aus Chrom und einem Spiegel, auf dem „BAR SPORT“ steht. An der Wand Fotos, im Fernseher eine Quizshow ohne Ton. Es riecht nach Kaffee und nassen Mänteln.');
    if (G.phase==='k4_d5' && F(G,'k4.s.farewell') && F(G,'k4.s.enzoInv') && A.first('bsD5')){ var E=A.npc('enzo'); await E.say('Signor Marko! Peppino è a casa. O quasi. La sorella ha telefonato al consolato. Che donna.'); await A.m('Peppino ist zu Hause, oder fast. Die Schwester hat beim Konsulat angerufen. Was für eine Frau, sagt er.'); } }
});
})(M);
