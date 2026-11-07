/* ===== rooms/wiesn.js — Theresienwiese, Christtag: Spaziergang mit Ana und den Kindern, Rodeln an der Bavaria. Anas Foto
   (Papa, der rote Zastava, 1990), Zoras Regel: Mala erinnert sich mit Ana (Bild „Die gelben Stiefel“, z4_stiefel), die
   Straßenbahn (k4.d1.drawing), Ana erfährt von Lana („Ich habe sie geliebt. Mehr als dich, damals.“), k4.d1.walk.
   „Mala fragen“: M.K4ASK.lana_ana (97_k4_mala.js). ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function N(A,id){ return A.hasNote(id); }
function walkHere(G){ return G.phase==='k4_d1'; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
// ---------------------------------------------------------------- die gelben Stiefel (Mala erinnert sich mit Ana)
async function stiefel(A){ var G=A.G; if (N(A,'z4_stiefel') || !G.malaOn || !A.malaHere() || !F(A,'k4.d1.anaLana')) return false;
  var lk=G.flags['mala.lock']; G.flags['mala.lock']=true;
  try{ A.music('k4_duh'); await A.wait(700); await A.g('Marko.'); await A.wait(600); await A.g('Wenn sie so redet …'); await A.wait(800);
    await A.memory({title:'Erinnerung – die gelben Stiefel',tint:'memory',draw:M.mem&&M.mem.k4_stiefel,lines:[
      'Neunzehnhundertneunzig. Samstag, zehn nach elf. Die Haltestelle der Drei.',
      'Ein kleines Mädchen in gelben Gummistiefeln, zwei Nummern zu groß. Es weint, weil es nicht mitdarf. Nur der Bruder darf mit.',
      'Ich setze mich neben sie auf den Bordstein und reiße ein Blatt aus meinem Heft. Ich male ihr eine Straßenbahn. In jedes Fenster ein Gesicht.',
      '„Die nächste nimmt dich mit. Versprochen.“',
      'Sie hört auf zu weinen. Sie zählt die Fenster.']});
    A.note('z4_stiefel'); await A.wait(800);
    await A.g('Ana.'); await A.wait(600); await A.g('Sie hat jeden Samstag geweint. Ich habe ihr eine Straßenbahn gemalt. Mit Gesichtern in den Fenstern.'); await A.wait(500);
    await A.g('Das hatte ich vergessen. Sie hat es für mich aufgehoben.'); A.music('k4_ana');
  } finally { G.flags['mala.lock']=lk; }
  await M.k4DayCheck(A); return true; }
M.k4Stiefel=stiefel;
// ---------------------------------------------------------------- Ana
async function photo(A,An){ var G=A.G; A.setFlag('k4.d1.anaLana');
  await An.say('Hier. Schau.'); if (An.actor) An.anim('phone'); await A.wait(500);
  await A.narrate('Auf ihrem Handy ein abfotografiertes Foto: Papa mit Schnurrbart, an den roten Zastava gelehnt. Auf der Motorhaube Ana, sechs, in gelben Gummistiefeln.');
  await An.say('Neunzehnhundertneunzig. Das Bild hängt bei Mama auch. Ich habe es abfotografiert, heimlich. Sie hätte es mir nie gegeben.'); await A.wait(500);
  await An.say('Siehst du die Stiefel? Die habe ich ein ganzes Jahr getragen. Auch im Sommer.'); await A.wait(400);
  await An.say('Weißt du noch, die Große aus dem Neunten? Lana? Die hat dich jeden Samstag abgeholt. Zur Drei. Zu Baka.'); await A.wait(500);
  await An.say('Ich durfte nie mit. Ich habe jedes Mal an der Haltestelle geheult. Jedes Mal.');
  if (G.malaOn && A.malaHere()) await stiefel(A);
  else { await A.wait(300); await A.m('Lana.'); await A.wait(400); await A.m('Das müsste Mala hören. Sie ist nicht hier.'); } }
async function tram(A,An){ A.setFlag('k4.d1.drawing');
  await A.m('Lana hat dir eine Straßenbahn gemalt. Damit du nicht weinst. In jedem Fenster ein Gesicht.'); await A.wait(1300);
  await An.say('…'); await A.wait(800); await An.say('Die habe ich noch.'); await A.wait(600);
  await An.say('In meinem Schuhkarton. Mit meinen Zeugnissen und Mias erstem Zahn.'); await A.wait(700);
  await An.say('Woher weißt du das? Das habe ich nie jemandem erzählt. Nicht mal Tobias.');
  var c=await A.choose([{t:'Ich weiß es eben.',id:'just'},{t:'Von jemandem, der dabei war.',id:'there'}],{title:'Ana'});
  if (c==='just') await An.say('Du weißt es eben. Wie Mama. Bei euch weiß man immer alles und sagt nie, woher.');
  else { await An.say('Dabei war nur sie.'); await A.wait(900); await An.say('Und ich.'); }
  if (gHere(A)){ await A.wait(500); await A.g('Sie hat sie aufgehoben. Zwanzig Jahre.'); } }
async function tellAna(A,An){ var done=false;
  await A.menuLoop(function(){ if (done) return []; var ask=M.k4AskOpt?M.k4AskOpt(A,'lana_ana'):null; return [ ask,
    {t:'Lana ist tot. Seit Januar vierundneunzig.',silent:true,go:async function(A){ await lanaDead(A,An); done=true; return 'bye'; }},
    {t:'(Doch nicht jetzt.)',silent:true,bye:true,go:async function(A){ await An.say('Doch nicht jetzt. Klar. Das kenne ich von euch.'); }} ].filter(Boolean); }); }
async function lanaDead(A,An){ var G=A.G;
  await A.m('Ich habe sie gesucht. Den ganzen Herbst. Ich habe sie gefunden.'); await A.wait(600); await A.m('Sie ist tot. Seit Januar vierundneunzig. An der Neretva. Nada holt sie nach Hause.');
  await A.wait(1600); if (An.actor) An.anim('arms'); await A.narrate('Ana sieht zum Hang, wo Mia den Schlitten hinaufzieht. Sie sieht lange hin.'); await A.wait(1100);
  await An.say('Ich habe sie geliebt.'); await A.wait(900); await An.say('Mehr als dich, damals.'); A.setFlag('k4.d1.walk');
  if (gHere(A)){ await A.wait(1200); await A.g('…'); await A.wait(500); await A.g('Ich weiß.'); }
  await A.wait(900); await An.say('Und du hast sie gesucht. Den ganzen Herbst.'); await A.wait(500); await An.say('Du hast für Nada gesucht. Für uns nie.');
  var c=await A.choose([{t:'Das ist nicht wahr.',id:'no'},{t:'(Schweigen.)',id:'quiet',silent:true},{t:'Ich bin jetzt hier.',id:'here'}],{title:'Ana'});
  if (c==='no'){ await An.say('Nicht? Wann hast du das letzte Mal angerufen, ohne dass einer Geburtstag hatte?'); await A.wait(600); await A.m('…'); await An.say('Siehst du.'); }
  else if (c==='quiet'){ await A.wait(1400); await An.say('Ja. Schweigen kannst du. Das hast du von Mama.'); }
  else { await An.say('Jetzt.'); await A.wait(700); await An.say('Ja. Jetzt bist du hier. Es ist Weihnachten. Da kommen sie alle.'); }
  await A.wait(700); await An.say('Komm. Mia will, dass du mit dem Schlitten fährst. Sie hat allen erzählt, du kannst das. Ich habe nicht widersprochen.');
  await M.k4DayCheck(A); }
async function talkAna(A){ var An=A.npc('anaC'), G=A.G;
  if (A.first('wnHello')){ await An.say(F(A,'k4.d1.bread')?'Da seid ihr. Mama hat geschrieben, du hast ihr Brot gebracht. Mit drei Ausrufezeichen. Mama schreibt keine Ausrufezeichen.':'Da bist du ja. Mia fährt seit einer Stunde und will, dass du zuschaust.'); }
  var ph0=G.phase; await A.menuLoop(function(){ if (G.phase!==ph0) return [];   // der Tag ist inzwischen zu Ende (lanaDead → Tageswechsel): das Gespräch nicht in die Nacht weiterführen
    return [
    {t:'Zeigst du mir das Foto? Von Papa und dem Auto.',if:!F(A,'k4.d1.anaLana'),go:function(A){ return photo(A,An); }},
    {t:'Lana hat dir eine Straßenbahn gemalt.',silent:true,if:N(A,'z4_stiefel')&&!F(A,'k4.d1.drawing'),go:function(A){ return tram(A,An); }},
    {t:'Ich muss dir etwas sagen. Über Lana.',if:F(A,'k4.d1.anaLana')&&!F(A,'k4.d1.walk'),go:async function(A){ await tellAna(A,An); if (F(A,'k4.d1.walk')) return 'bye'; }},
    {t:'Du wolltest reden. Gestern, in der Küche.',once:'wnTalk',go:async function(A){ await An.say('Nicht hier.'); await A.wait(400); await An.say('Nicht vor den Kindern. Und nicht heute, heute ist Weihnachten.'); await A.wait(700); await An.say('Ja. Ich weiß, wie das klingt. Wie Mama.'); }},
    {t:'Du hast das Foto heimlich abfotografiert?',once:'wnHeim',if:F(A,'k4.d1.anaLana'),go:async function(A){ await An.say('Mama hat nur das eine. Wenn ich sie frage, ob ich es scannen darf, sagt sie: Was willst du damit?'); await A.wait(400); await An.say('Ich will meinen Vater auf dem Handy haben. Das will ich damit.'); }},
    {t:'Wie geht es dir? Wirklich.',once:'wnHow',go:async function(A){ await An.say('Wirklich? Ich habe zwei Kinder, einen Mann, der Bosnisch lernt, und eine Mutter, die an Silvester arbeitet, damit sie das Knallen nicht hören muss.'); await A.wait(400); await An.say('Mir geht es gut. Danke der Nachfrage. Sie kommt selten.'); }},
    {t:'Ich gehe noch ein Stück.',bye:true,go:async function(A){ await An.say(A.cycle('wnBye',['Geh. Wir sind bis Mittag da. Danach will Niko schlafen und schreit vorher.','Bis später. Und sag Mama nicht, dass ich ihr Foto abfotografiert habe.'])); }}
  ]; }); }
// ---------------------------------------------------------------- die Kinder
async function talkMia(A){ var Mi=A.npc('miaC');
  await Mi.say(A.cycle('wnMia',['Onkel Marko! Schau! Ich fahr ohne Hände!','Mama sagt, du kannst Schlitten fahren. Kannst du?','Niko redet schon wieder mit Luft. Er ist drei. Mit drei darf man das.']));
  if (A.first('wnMiaSled')){ var c=await A.choose([{t:'(Mit dem Schlitten fahren.)',id:'sled',silent:true},{t:'Später.',id:'later'}],{title:'Mia'});
    if (c==='sled'){ A.sfx('snowStep'); await A.narrate('Ich setze mich auf Mias Schlitten. Er ist für eine Siebenjährige gebaut. Ich komme vier Meter weit, dann liege ich im Schnee.'); await Mi.say('Du bist umgefallen!'); await A.m('Absichtlich.');
      await Mi.say('Nein!'); if (gHere(A)){ await A.wait(300); await A.g('Du warst früher schneller. Und kürzer.'); } A.setFlag('k4.d1.sled'); }
    else await Mi.say('Später ist immer, wenn ihr Großen nicht wollt.'); } }
async function talkNiko(A){ var Ni=A.npc('nikoC'), G=A.G;
  if (G.malaOn && A.malaHere()){ if (Ni.actor) Ni.anim('stare'); await Ni.say(A.cycle('wnNi',['Das Mädchen ist wieder da.','Sie hat keine Handschuhe. Ihr ist nicht kalt.','Warum hat sie keinen Schlitten?']));
    if (A.first('wnNiG')){ await A.wait(400); await A.g('Er sieht mich. Am hellen Tag.'); await A.m('Er ist drei.'); await A.g('Mit drei sieht man noch richtig.'); } return; }
  await Ni.say(A.cycle('wnNi2',['Schnee!','Wo ist das Mädchen?','Ich hab einen Schneemann. Er hat kein Gesicht.'])); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Am Rand der Wiese die Straße, dahinter das Westend. Die Häuser sehen von hier aus wie Zuschauer.',
   g:{look:'Da drüben ist die Stadt. Hier ist nur Weiß und Platz.'}},
 {id:'bavaria',name:'Bavaria',look:'Oben auf der Anhöhe eine riesige Frau aus Bronze, einen Löwen neben sich, einen Kranz in der erhobenen Hand. Mia sagt, man kann in ihren Kopf hinaufsteigen.',
   use:'Im Winter ist der Kopf zu. Sagt Mia. Mia weiß alles, was an Schildern steht.',
   g:{look:'Sie ist so groß, dass sie nicht zählt. Sie sieht über alles hinweg. Ich mag das nicht.'}},
 {id:'slope',name:'Rodelhang',look:function(A){ return A.m(walkHere(A.G)?'Der Hang vor der Ruhmeshalle. Kinder in bunten Schneeanzügen, Schlitten, ein Vater, der lauter schreit als alle Kinder zusammen.':'Der Hang, leer. Spuren von Schlitten, die schon zu Hause sind.'); },
   use:function(A){ return walkHere(A.G)?talkMia(A):A.m('Ohne Schlitten rutsche ich auf der Hose. Das mache ich nicht. Nicht mit dreiunddreißig.'); },
   g:{look:'Sie fahren hinunter und ziehen den Schlitten wieder hinauf. Immer wieder. Als wäre unten nicht das Ende.'}},
 {id:'field',name:'Festwiese',look:'Die Festwiese, leer, eine riesige weiße Fläche. Im September stehen hier Zelte für Tausende. Jetzt steht hier nur der Wind.',
   g:{look:'Auf der Wiese liegen Abdrücke. So viele Leute. Wie ein Jahrmarkt, den jemand verblassen lässt.',sense:'Gelächter, ganz weit weg. Und Musik, viel zu laut. Lauter Leute, die hier glücklich waren und es vergessen haben.'}},
 {id:'path',name:'Weg',look:'Ein Weg mit Laternen, geräumt bis auf einen schmalen Streifen. Jemand hat mit dem Absatz ein Herz in den Schnee gemalt.',
   g:{look:'Ein Herz. Mit einem Absatz. Wer so was macht, wartet auf jemanden.'}},
 {id:'bench',name:'Bank',look:'Eine Bank, auf der eine dicke Schneehaube sitzt. Niemand sitzt sonst darauf.',use:'Ich wische den Schnee weg und setze mich nicht. Jetzt ist sie wenigstens frei.',
   g:{look:'Hier hat einer Kastanien gezählt, im Herbst. Ich zähle mit, nachträglich.'}},
 {id:'sled',name:'Schlitten',vis:function(S,G){ return walkHere(G); },look:'Mias Schlitten, ein Holzschlitten mit rotem Seil. Auf dem Brett hat jemand mit Filzstift geschrieben: MIA. NICHT NIKO.',
   use:function(A){ return talkMia(A); },take:'Das ist Mias. Sie hat es draufgeschrieben.',
   g:{look:'MIA. NICHT NIKO. Sie schreibt, wem was gehört. Das ist klug.'}},
 {id:'tracks',name:'Fußspuren',look:'Fußspuren im Schnee. Große und kleine, und eine Spur, die im Kreis geht. Niko.',
   g:{look:'Seine Spuren und meine. Meine sind nicht da.'}},
 {id:'city',name:'Westend',look:'Hinter der Wiese die Häuser vom Westend, dazwischen irgendwo Mamas Fenster. Von hier aus sieht man nicht, welches.',
   g:{look:'Da wohnt sie. Ich zähle die Fenster. Zu viele, um ihres zu finden.'}},
 {id:'ana',npc:'anaC',name:'Ana',vis:function(S,G){ return walkHere(G); },talk:talkAna,
   look:'Ana im grünen Parka, die gestreifte Mütze schief. Sie hat die Arme verschränkt und sieht Mia zu, wie jemand, der jeden Sturz schon vorher spürt.',
   give:{ vanilice:'Ana: „Die sind für Mama. Gib sie ihr, nicht mir. Ich esse sie sonst auf, alle.“', photo_full:async function(A){ var An=A.npc('anaC'); await An.say('Wer ist das?'); await A.wait(600); await An.say('Baka. Und du. Und …'); await A.wait(900); await An.say('Lana.'); await A.wait(700); await An.say('Die hat genauso geguckt. Als wüsste sie, wie es weitergeht.'); },
     brot:'Ana: „Mamas Brot? Bring es ihr. Sie isst sonst den ganzen Tag nichts und sagt dann, sie hat gegessen.“' },
   g:{look:async function(A){ if (await stiefel(A)) return; await A.g(N(A,'z4_stiefel')?'Das Entchen. Sie trägt keine gelben Stiefel mehr. Grüne. Das ist auch gut.':'Die kleine Ana. Sie verschränkt die Arme wie ihre Mutter.'); },
     listen:'Sie summt etwas für die Kinder. Ein Lied aus dem Kindergarten. Auf Deutsch. Sie kennt keins auf Bosnisch. Oder sie singt es nicht.'}},
 {id:'mia',npc:'miaC',name:'Mia',vis:function(S,G){ return walkHere(G); },talk:talkMia,
   look:'Mia im lila Schneeanzug, die Bommelmütze über den Augen. Sie zieht den Schlitten den Hang hinauf, als hätte sie ihn gerade gefangen.',
   g:{look:'Sie sieht mich nicht. Sie ist sieben. Mit sieben sieht man schon zu viel anderes.'}},
 {id:'niko',npc:'nikoC',name:'Niko',vis:function(S,G){ return walkHere(G); },talk:talkNiko,
   look:'Niko im roten Schneeanzug, die Mütze mit Ohrenklappen. Er hat Schnee im Gesicht und findet das richtig.',
   g:{look:async function(A){ var Ni=A.npc('nikoC'); if (Ni.actor) Ni.anim('wave'); await A.g('Er winkt mir. Mit der ganzen Hand.'); await A.wait(300); await A.g('Ich winke zurück. Er sieht es. Er ist der Einzige.'); }}}
];
M.room('wiesn',{ name:'Theresienwiese', scape:'k4_wiesn',
  music:function(G){ return walkHere(G)?'k4_ana':'k4_muenchen'; },
  state:function(G){ return {walk:false}; },
  actors:function(S,G){ var L=[]; S.walk=walkHere(G);
    if (S.walk){ var a=M.apos('wiesn','ana',[400,124,'L']), m=M.apos('wiesn','mia',[180,118,'R']), n=M.apos('wiesn','niko',[424,126,'L']);
      L.push({id:'anaC',ch:'anaC',x:a[0],y:a[1],f:a[2]||'L',name:'Ana',idle:'arms',speechY:44});
      L.push({id:'miaC',ch:'miaC',x:m[0],y:m[1],f:m[2]||'R',name:'Mia',idle:'sled',speechY:38,routine:[['idle','sled',5,9],['anim','jump'],['idle','sled',6,10]]});
      L.push({id:'nikoC',ch:'nikoC',x:n[0],y:n[1],f:n[2]||'L',name:'Niko',idle:'play',speechY:30,routine:[['idle','play',5,9],['anim','point'],['idle','play',4,8]]}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (A.isMala()){ if (walkHere(G) && await stiefel(A)) return; if (A.first('gWn')) await A.g('Die große weiße Wiese. Allein ist sie noch größer.'); return; }
    if (!walkHere(G)) return;
    if (A.first('wnArr')){ await A.narrate('Die Theresienwiese, weiß bis zum Horizont. Oben an der Bavaria rodeln Kinder. Ana steht am Weg, die Arme verschränkt. Mia zieht einen Schlitten, Niko isst Schnee.');
      if (G.malaOn && A.malaHere()){ var Ni=A.npc('nikoC'); if (Ni.actor) Ni.anim('stare'); await A.wait(400); await A.g('Der Kleine sieht mich wieder an.'); } return; }
    if (G.malaOn && A.malaHere() && !G.flags['mala.lock']) await stiefel(A); }
});
})(M);
