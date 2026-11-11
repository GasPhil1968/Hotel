/* ===== rooms/herberge.js — Herberge „Neretva“: Maja und das Gästebuch, die Terrasse über dem Fluss, die Australier,
   Gespräch 1 („Mich hast du nicht gefragt“), die Nacht mit dem Vater, der Weg für Mala hinunter zu den Uferstufen ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
function majaHere(G){ return G.phase!=='k3_epi' && G.phase!=='k3_fin_n'; }
function aussiesHere(G){ return inP(G,['k3_pro','k3_pro_n','k3_d1_n','k3_d2_n']); }
function night(G){ return inP(G,['k3_pro_n','k3_d1_n','k3_d2_n']); }
// ---------------------------------------------------------------- Maja: das Gästebuch
async function checkIn(A){ var J=A.npc('maja'), G=A.G;
  await A.m('Ich möchte mich eintragen.'); await J.say('Pass, bitte. Und dann ins Buch. Wir haben einen Computer, aber dem Buch glaubt die Polizei eher.');
  A.sfx('page'); await A.doc({style:'register',title:'KNJIGA GOSTIJU · Gästebuch',lines:['Josh Carter · Australia · 21.11. · ?','Rebecca Hale · Australia · 21.11. · ?','Liam Doyle · Australia · 21.11. · ?','','Ime i prezime · Odakle · Dolazak · Odlazak','Marko Vuković · Split · 24.11.2011 · …']});
  await A.m('Name, woher, Ankunft. Und „Odlazak“. Abreise.');
  var c=await A.choose([{t:'(Bei Abreise „28.11.“ eintragen.)',id:'date',silent:true},{t:'(Bei Abreise nichts eintragen.)',id:'blank',silent:true}],{title:'Abreise'});
  A.setFlag('k3.p.abreise',c);
  if (c==='date'){ await A.narrate('Ich schreibe „28.11.“. Montag. Die Rückfahrkarte gilt einen Monat, aber Montag klingt nach jemandem, der weiß, was er tut.'); await J.say('Montag. Gut. Dann weiß ich, wann ich das Bett neu beziehe.');
    if (G.malaOn){ await A.wait(400); await A.g('Du schreibst ein Datum hin, bevor du weißt, ob es stimmt.'); await A.m('Das macht man so.'); await A.g('Ja. Das macht man so.'); } }
  else { await A.narrate('Ich lasse das Feld leer.'); await J.say('Abreise?'); await A.m('Weiß ich noch nicht.'); await J.say('Das schreiben die Australier auch. Die sind seit Montag da.');
    if (G.malaOn){ await A.wait(500); await A.g('Bei Abreise nichts.'); await A.wait(600); await A.g('Wie bei mir. Im Palma stand bei Abreise auch nichts.'); } }
  A.setFlag('k3.p.checkin'); A.sfx('keys'); await J.say('Zimmer drei. Oben unter dem Dach. Das mit dem Fenster zum Fluss.'); await A.wait(300);
  await J.say('Sie sind übrigens der älteste Gast seit August.'); await A.m('Danke.'); await J.say('Das war kein Kompliment. Das war Statistik.');
  if (G.malaOn){ await A.wait(500); await A.g('Ein Fenster zum Fluss.'); await A.wait(600); await A.g('Ich gehe nicht ans Fenster.'); }
  await M.k3DayCheck(A); }
// ---------------------------------------------------------------- Maja: „Zwei Sprachen“ (freiwillig)
async function twoLanguages(A,J){ await J.say('Sie sind Übersetzer?'); await A.m('Ja.'); await J.say('Dann habe ich etwas für Sie. Ein Schreiben vom Amt drüben, für die Kurtaxe. Kroatisch. Hier im Amt nehmen sie es nur auf Bosnisch. Ein Übersetzer will dafür vierzig Mark.');
  A.sfx('paper'); await A.narrate('Sie schiebt mir ein Blatt über den Tresen. Ich lese es zweimal. Es ist dasselbe Schreiben. Bis auf drei Wörter.');
  await A.m('„Tjedan“ wird „sedmica“. „Tisuću“ wird „hiljadu“. „Točno“ wird „tačno“.'); await A.wait(400); await A.m('Fertig.');
  await J.say('Das war alles?'); await A.m('Das war alles.'); await A.wait(500); A.sfx('coin'); await J.say('Zwanzig Mark. Ohne Stempel. Mit Stempel wären es vierzig.');
  await A.wait(400); await J.say('Dafür zahlen die hier wirklich Geld.'); A.setFlag('k3.p.twolang');
  if (A.G.malaOn){ await A.wait(400); await A.g('In Sarajevo hast du für einen ganzen Brief zehn bekommen.'); await A.m('Ich werde teurer.'); await A.g('Du wirst kürzer.'); } }
async function tepaLine(A,J){ await J.say('Samstags kommen die Leute aus den Dörfern auf die Tepa. Mit Eiern, Honig, Käse. Wenn Sie etwas Gutes wollen, gehen Sie früh. Später gibt es nur noch Kohl.');
  A.note('l3_tepa'); A.setFlag('k3.p.tepaKnown'); A.unlock('tepa');
  if (A.G.malaOn){ await A.wait(500); await A.g('Aus den Dörfern.'); if (N(A,'l3_city')){ await A.wait(400); await A.g('Sie zieht in die Stadt, Marko. Genau dahin, glaube ich.'); } } }
async function talkMaja(A){ var J=A.npc('maja'), G=A.G, p=G.phase;
  await A.menuLoop(function(){ return [
    {t:'Ich möchte mich eintragen.',silent:true,if:!A.flag('k3.p.checkin'),go:async function(A){ await checkIn(A); }},
    {t:'Was ist heute los in der Stadt?',once:'mjT',if:p==='k3_d2'&&!N(A,'l3_tepa'),go:async function(A){ await tepaLine(A,J); }},
    {t:'Kann man hier irgendwo hoch hinauf? Über die Dächer sehen?',if:A.flag('k3.peil.bridgehead')&&!A.flag('k3.peil.minaret'),go:async function(A){ await J.say('Auf das Minarett der Koski-Moschee. Gleich flussab, im Hof gibt es Karten. Fünf Mark.');
        await J.say('Bei Bura sieht man von da oben bis zu den Bergen im Süden. Die Australier waren oben und haben „awesome“ gesagt. Was sonst.'); A.unlock('koski'); }},
    {t:'Wissen Sie, wo eine alte Karte hängt? Mit den Dörfern südlich der Stadt.',if:N(A,'l3_area')&&!N(A,'l3_oldmap'),go:async function(A){ await J.say('Eine alte Landkarte?'); await A.wait(300);
        await J.say('Zdravko. Café am Westbusbahnhof, drüben. Da hängt eine an der Wand, so alt wie Zdravko und genauso vergilbt. Die Taxifahrer trinken da Kaffee und streiten, welche Straße es noch gibt.'); A.setFlag('k3.oldmap.told'); }},
    {t:'Wie lange gibt es die Herberge schon?',once:'mj1',go:async function(A){ await J.say('Zwei Jahre. Vorher war es das Haus meiner Großmutter. Sie hat Zimmer vermietet, an Leute, die keine Zimmer hatten.');
        await J.say('Ich vermiete an Leute, die keine Hotels mögen. Das ist der Fortschritt.'); }},
    {t:'Kommen viele Gäste im November?',once:'mj2',go:async function(A){ await J.say('Im November kommen drei Australier, die den Sommer verpasst haben. Und Sie.'); await A.wait(300); await J.say('Sie haben keinen Rucksack. Das ist hier verdächtig.'); }},
    {t:'Ist das Ihre Brücke da unten?',once:'mj3',go:async function(A){ await J.say('Meine? Die gehört allen und jedem Touristen ein bisschen. Auf jedem Foto ist sie. Auf meinen nicht mehr.');
        await A.wait(400); await J.say('Ich war zehn, als sie gefallen ist. Ich habe es gehört, nicht gesehen. Danach war es so still, dass meine Mutter das Radio angemacht hat. Nur damit etwas ist.'); if (G.malaOn) await A.g('…'); }},
    {t:'Sie sprechen gut Englisch.',once:'mj4',if:aussiesHere(G),go:async function(A){ await J.say('Ich spreche Australisch. Das ist Englisch mit „awesome“ alle drei Wörter.'); }},
    {t:'Brauchen Sie einen Übersetzer?',once:'mjX',if:A.flag('k3.p.checkin'),go:function(A){ return twoLanguages(A,J); }},
    {t:'Frost heute Nacht?',once:'mj5',if:p==='k3_d3',go:async function(A){ await J.say('Sagt das Radio. Minus vier. Die Australier wollen trotzdem auf den Velež, mit Turnschuhen.'); await J.say('Ich habe gesagt, sie sind verrückt. Sie haben „awesome“ gesagt.'); }},
    {t:'Ich fahre heute.',once:'mjE',if:p==='k3_epi_d',go:async function(A){ await J.say('Sie fahren?'); await A.wait(300); await J.say('Dann waren Sie der älteste Gast seit August und der stillste.');
        await J.say('Sie haben auf der Terrasse geredet, jeden Abend. Ich habe niemanden gesehen.'); await A.m('Ich übe Sprachen.'); await J.say('Welche?'); await A.m('Eine, die nur zwei sprechen.');
        await A.wait(500); await J.say('Dann kommen Sie wieder und üben weiter. Zimmer drei halte ich Ihnen frei. Mit dem Fenster.'); if (G.malaOn) await A.g('Mit dem Fenster. Nächstes Mal gehe ich hin.'); }},
    A.askOpt({ l3_tepa:'Die Tepa. Hinter der Altstadt, wo die Gasse breiter wird. Samstags mit allem, sonst mit Kohl.', p3_munich:'München, jeden Samstag. Mein Bruder ist mit dem gefahren. Er kommt jetzt an Weihnachten. Mit einem Auto, das größer ist als mein Zimmer.',
      l3_onearch:'Ein Bogen, ja. Der Baumeister soll Angst gehabt haben, dass er einstürzt, als man das Gerüst weggenommen hat. Er hat gehalten. Vierhundert Jahre lang.', p3_history:'Dino erzählt das jedem. Er erzählt es gut. Er hat es von seinem Opa, der hat es auch gut erzählt.',
      l3_skela:'Skela? Das ist ein Dorf flussab. Da war ich nie. Da ist man, wenn man da wohnt.', l3_city:'Ihre … Leine? Ich verstehe Sie nicht. Aber heute ist Markttag, wenn Sie das meinen.' },'Da fragen Sie die Falsche. Ich kenne Betten und Australier.'),
    {t:'Danke, Maja.',bye:true,go:async function(A){ await J.say(A.cycle('mjBye',['Bitte.','Frühstück ab acht. Kaffee immer.','Der Schlüssel hängt, wenn Sie gehen. Sie sind ja nie weg.'])); }}
  ]; }); }
// ---------------------------------------------------------------- die Australier
async function talkAussies(A){ var J=A.npc('aussie1'), B=A.npc('aussie2'), L=A.npc('aussie3'), G=A.G, p=G.phase;
  await A.menuLoop(function(){ return [
    {t:'Where are you heading?',once:'au1',go:async function(A){ await J.say('Wherever the bus goes. Dubrovnik next, maybe. Or Kotor. Or Sarajevo again, Bec loved the burek.'); await B.say('I didn’t love it. I married it.'); await A.m('Sie fahren dahin, wo der Bus hinfährt. Das kenne ich.'); }},
    {t:'How do you like Mostar?',once:'au2',go:async function(A){ await B.say('The bridge is awesome. A guy wanted twenty euros to jump. Then it rained, and he said the river doesn’t like him in November.'); await J.say('Awesome, though.'); if (G.malaOn) await A.g('Das war Dino. Er sagt das jedem. Es stimmt trotzdem.'); }},
    {t:'What’s that song?',if:p!=='k3_pro',once:'au3',go:async function(A){ A.sfx('strum'); await L.say('Some old Yugoslav song. A guy in Sarajevo taught us. In a bar. We don’t know what it means.');
        var c=await A.choose([{t:'(Übersetzen.) It’s about a girl waiting at a window. He doesn’t come.',id:'tr',silent:true},{t:'(Nicht übersetzen.) It’s a happy song.',id:'lie',silent:true}],{title:'Liam'});
        await A.m(c==='tr'?'It’s about a girl waiting at a window. He doesn’t come.':'It’s a happy song.');
        if (c==='tr'){ await L.say('Oh.'); await A.wait(400); await L.say('That’s … sad, man.'); await J.say('Awesome, though.'); if (G.malaOn) await A.g('Sie singen es wie ein Trinklied. Das ist auch eine Art, es auszuhalten.'); }
        else { await L.say('See? I told you, Bec.'); if (G.malaOn) await A.g('Du lügst schlecht auf Englisch.'); } }},
    {t:'Do you want the words?',if:p!=='k3_pro'&&!A.flag('k3.s.words'),go:async function(A){ A.sfx('strum'); await L.say('You know it? The whole thing? The guy in Sarajevo only sang the first bit. Then he cried, then he bought us a round.');
        await B.say('Write it down for us. Slowly. I’ll do the sounds, you do the meaning.'); await A.m('Jeder in Sarajevo kennt es. Ich auch. Die Frage ist nur, in welcher Reihenfolge die Geschichte geht.');
        var ok=await M.K3X.songOrder(A); if (!ok) return;
        await B.say('Got it. Water, lamb, gates, window, good evening, come tonight.'); await L.say('Come tonight. That’s the last line? That’s it?'); await A.m('That’s it. The song stops there.');
        await A.wait(500); await J.say('Awesome, though.'); if (G.malaOn && A.malaHere()){ await A.wait(600); await A.g('Das Lied ist nicht über ein Mädchen, das wartet.'); await A.m('Doch. Am Ende sagt sie: Komm. Und das Lied hört auf.'); await A.wait(500); await A.g('Dann wartet sie danach.'); } }},
    {t:'Did you climb the minaret?',once:'au4',if:p!=='k3_pro'&&A.flag('k3.peil.bridgehead'),go:async function(A){ await J.say('The one by the river? Yeah! Super narrow stairs. Bec counted. How many?'); await B.say('Eighty-nine. Then I stopped counting and started praying I wouldn’t fall.'); await J.say('The view is awesome.'); }},
    {t:'Good night.',bye:true,go:async function(A){ await J.say(A.cycle('auBye',['Night, mate!','See ya. Bring a drink next time.','Cheers.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Gespräch 1: „Mich hast du nicht gefragt“ (Konzept 8.1; 96_k3_story.js ruft das auf der Terrasse auf)
M.k3Talk1=async function(A){ if (A.flag('k3.p.talk1')) return; var G=A.G; G.flags['mala.lock']=true;
  try{
    var t=M.stand('herberge','table')||[300,124,'R']; A.placeM(t[0],t[1],t[2]||'R'); A.faceM('R'); if (G.malaOn) A.placeG(t[0]-14,t[1]-3,'R');
    var J=A.npc('aussie1'), B=A.npc('aussie2'), L=A.npc('aussie3');
    A.music('k3_noc'); await A.wait(500);
    await A.narrate('Donnerstagabend, die Terrasse der Herberge. Unten ist die Neretva zu hören, nicht zu sehen. Am anderen Tisch drei Australier mit einer Gitarre und Bier aus Dosen.');
    await J.say('Did you see that bridge today? Awesome.'); await A.wait(300); await B.say('So awesome.'); A.sfx('strum'); await A.wait(600);
    await A.narrate('Ich schreibe in mein Notizbuch. Mala steht hinter mir und liest mit.'); A.idleM('writeS'); await A.wait(1100);
    await A.g('Du hast es aufgeschrieben.'); await A.m('Was?'); await A.g('„Bring sie nach Hause.“ Mit Datum. Wie einen Auftrag.'); await A.m('Es ist ein Auftrag.');
    await A.g('Von wem?'); await A.m('Von deiner Mutter.'); await A.g('Und ich? Bin ich der Auftrag oder die, die man fragt?'); A.idleM(null);
    await A.wait(1400); await L.say('Awesome.'); await A.wait(700);
    await A.g('Das war das dritte Mal. Ich zähle mit.'); await A.wait(500);
    await A.m('Ich dachte, du willst nach Hause.'); await A.g('Du dachtest. Du hast „Ja“ gesagt, bevor sie fertig geweint hatte. Ich stand daneben.');
    await A.m('Du hast nichts gesagt.'); await A.g('Sie hat geweint, Marko. Da sagt man nichts. Jetzt sage ich es.'); await A.m('Dann sag es.'); await A.wait(500);
    await A.g('Ich weiß nicht, was „nach Hause“ ist. Mein Zimmer? Das lüftet sie jetzt. Ein Kasten auf einem Friedhof, zu dem sie jeden Sonntag mit dem Bus fährt? Ich weiß nicht mal, ob ich da liegen will.');
    await A.m('Wo dann?'); await A.g('Das ist es ja. Ich weiß nicht, wo ich liege. Ich weiß nicht, wie ich gestorben bin. Und du weißt schon, wo ich hinkomme.');
    await A.wait(2200);
    await A.m('Ich habe es ihr versprochen. Ich halte es.'); await A.g('Ich weiß, dass du es hältst. Das ist das Problem. Du hältst es so fest, dass ich nicht mehr drin vorkomme.');
    await A.m('Das ist nicht fair.'); await A.g('Nein. Aber es stimmt.'); await A.wait(500);
    await A.m('Ich bin damals nicht gekommen. Jetzt komme ich. Für dich, für sie, für alle. Was soll ich sonst machen?'); await A.wait(700);
    await A.g('Fragen.'); await A.m('Fragen.');
    await A.g('Ich will wissen, wie ich gestorben bin. Das zuerst. Und dann entscheide ich, was davon nach Hause geht. Ich.'); await A.g('Du hast siebzehn Jahre für mich vergessen. Du musst jetzt nicht auch noch für mich entscheiden.');
    await A.wait(1200); await A.g('Versprich es mir. Dass du mich fragst. Bei allem.');
    var c=await A.choose([{t:'Versprochen.',id:'a'},{t:'Bei allem kann ich nicht. Manchmal muss es schnell gehen.',id:'b'},{t:'Und wenn du falsch entscheidest?',id:'c'}],{title:'Mala'});
    A.setFlag('k3.p.promise',c);
    if (c==='a'){ await A.g('Du sagst das so schnell.'); await A.m('Ich übe.'); await A.g('Das hast du in Sarajevo auch gesagt.'); await A.m('Ich übe immer noch.'); }
    else if (c==='b'){ await A.g('Dann frag schnell.'); await A.m('Und wenn keine Zeit ist?'); await A.g('Für mich ist immer Zeit. Ich bin tot.'); }
    else { await A.g('Dann ist es meins. Das Falsche auch.'); await A.m('Das klingt wie Großmutter.'); await A.g('Nein. Großmutter hat für dich entschieden. Ich entscheide für mich. Das ist der Unterschied.'); }
    A.setFlag('k3.p.talk1'); A.setFlag('k3.ask',true); await A.wait(800);
    await A.g('Morgen suchen wir die Brücke. Die richtige.'); await A.m('Die mit den Beinen im Wasser.'); await A.g('Die mit den Beinen im Wasser.'); await A.wait(700);
    A.music('k3_aussie'); A.sfx('guitar');
    await A.narrate('Die Australier fangen ein neues Lied an. Es ist ein altes jugoslawisches, und sie singen es falsch.'); await A.wait(1200);
    await A.g('Die singen falsch.'); await A.m('Ja.'); await A.wait(600); await A.g('Schön falsch.');
    await A.wait(1200); await A.g('Geh schlafen. Ich bleibe noch ein bisschen. Vielleicht gehe ich hinunter ans Wasser. Zu den Stufen an der Brücke. So weit es zieht.');
    await A.m('Allein?'); await A.g('Allein. Das darf ich. Du hast es gerade versprochen.');
  } finally { G.flags['mala.lock']=false; A.idleM(null); } };
// ---------------------------------------------------------------- Nacht 1: die Australier singen, das Vatergespräch (96_k3_story.js: M.k3StartD1Night)
M.k3Father=async function(A){ if (A.flag('k3.d1.father')) return; var G=A.G; G.flags['mala.lock']=true;
  try{
    var t=M.stand('herberge','table')||[300,124,'R']; A.placeM(t[0],t[1],t[2]||'R'); if (G.malaOn){ var mp=M.apos('herberge','mala',[t[0]+30,t[1]-4,'L']); A.placeG(mp[0],mp[1],mp[0]<t[0]?'R':'L'); A.faceM(mp[0]<t[0]?'L':'R'); }
    A.music('k3_aussie'); A.sfx('guitar'); await A.wait(800);
    await A.narrate('Freitag, spät. Die Australier sind wieder da und singen dasselbe Lied wie gestern. Liam hat inzwischen zwei Akkorde mehr.');
    await A.g('Sie singen wieder falsch.'); await A.m('Schön falsch?'); await A.g('Schön falsch. Immer noch.'); await A.wait(1200);
    if (M.k3Carry && M.k3Carry.father){ await A.g('In Vratnik hast du gesagt, dein Vater ist Wasser holen gegangen. Und nicht zurückgekommen.'); await A.m('Ja.'); }
    else { await A.g('Heute am Fluss hast du von deinem Vater geredet. Von den Linien.'); await A.m('Er hat Brücken berechnet.'); await A.g('Was ist mit ihm passiert?');
      await A.m('Frühjahr dreiundneunzig. Er ist an der Brauerei Wasser holen gegangen. Er ist nicht zurückgekommen.'); }
    await A.wait(1200);
    await A.g('Hast du deinen Vater gesucht? Damals?'); await A.m('Nein.'); await A.g('Warum nicht?'); await A.m('Weil ich wusste, dass er tot ist.'); await A.wait(600); await A.g('Woher?');
    await A.wait(2600); await A.narrate('Ich sage nichts. Unten rauscht der Fluss. Am anderen Tisch hört Liam mitten im Lied auf, weil er den Text nicht mehr weiß.'); A.note('e3_father'); A.setFlag('k3.d1.father');
    await A.wait(1000); await A.g('Ich frage nicht noch mal.'); await A.wait(500); await A.g('Aber ich vergesse es nicht.'); await A.m('Ich weiß.');
    await A.wait(700); await A.g('Geh schlafen. Morgen ist Samstag.');
  } finally { G.flags['mala.lock']=false; } };
// ---------------------------------------------------------------- Hotspots
function bellUse(A){ A.sfx('bellSmall'); if (!majaHere(A.G)) return A.m('Die Glocke klingt durch das ganze Haus. Niemand kommt. Es ist zu früh für alle außer mir.');
  return A.npc('maja').say(A.cycle('mjBell',['Ja, ja. Ich bin doch da.','Ich stehe vor Ihnen.','Wenn Sie noch einmal läuten, läute ich zurück.'])); }
var HS=[
 {id:'door',name:'Haustür',exit:{to:'map'},look:'Die Haustür aus dunklem Holz, mit einem Messingknauf, den hundert Hände blank gemacht haben. Dahinter die Gasse.',
   g:{look:'Durch diese Tür gehen Leute mit Rucksäcken hinein und mit nassen Rucksäcken wieder hinaus.'}},
 {id:'desk',name:'Tresen',look:'Ein Holztresen mit Prospekten: Kravice, Blagaj, Rafting. Ein Laptop, ein Telefon, eine Schale mit Bonbons, die keiner nimmt. Dahinter ein Schlüsselbrett mit sieben Haken.',
   use:function(A){ if (!majaHere(A.G)) return A.m('Niemand da. Auf dem Tresen ein Zettel: „Frühstück ab acht. M.“'); return talkMaja(A); },
   take:'Ein Bonbon. Er schmeckt nach Zimt und nach einem Jahr in der Schale.',
   g:{look:'Sie hat alles in Kästchen sortiert. Die Prospekte, die Schlüssel, die Gäste.'}},
 {id:'bell',name:'Tischglocke',look:'Eine Tischglocke aus Messing, so eine, auf die man mit der flachen Hand schlägt.',use:bellUse,
   g:{look:'Glocken.',listen:'Sie klingt nur, wenn jemand drückt. Das ist eine ehrliche Glocke.'}},
 {id:'register',name:'Gästebuch',look:function(A){ return A.m(A.flag('k3.p.checkin')?'Das Gästebuch, aufgeschlagen bei meinem Namen. Drei Australier über mir, unter mir noch niemand.':'Ein dickes Gästebuch mit Leinenrücken, aufgeschlagen. Name, woher, Ankunft, Abreise.'); },
   read:async function(A){ if (!A.flag('k3.p.checkin') && majaHere(A.G)) return checkIn(A); var c=A.flag('k3.p.abreise');
     await A.doc({style:'register',title:'KNJIGA GOSTIJU · Gästebuch',lines:['Josh Carter · Australia · 21.11. · ?','Rebecca Hale · Australia · 21.11. · ?','Liam Doyle · Australia · 21.11. · ?','','Marko Vuković · Split · 24.11.2011 · '+(c==='date'?'28.11.':'')]});
     if (A.G.malaOn && A.first('gRegAb')) await A.g(c==='date'?'Achtundzwanzigster. Du hast es so geschrieben, als stünde es schon fest.':'Bei Abreise nichts. Gut. Dann weiß noch keiner, wann du gehst.'); },
   use:function(A){ if (!A.flag('k3.p.checkin') && majaHere(A.G)) return checkIn(A); return A.m('Ich habe mich schon eingetragen. Zweimal einchecken macht die Polizei nervös.'); },
   g:{look:'Lauter Namen von Leuten, die gekommen und gegangen sind. Bei „Abreise“ stehen Fragezeichen. Das gefällt mir.'}},
 {id:'stairs',name:'Treppe zum Zimmer',exit:{to:'zimmer'},look:'Eine steile Holztreppe nach oben. Die dritte Stufe knarrt. Ich habe es gezählt.',
   canExit:async function(A){ if (!A.flag('k3.p.checkin')){ await A.m(majaHere(A.G)?'Ohne Schlüssel? Erst eintragen, dann das Zimmer. Maja hat den Schlüssel.':'Mein Zimmer ist oben. Aber ich habe keinen Schlüssel.'); return false; } return true; },
   g:{look:'Die Treppe knarrt bei ihm, nicht bei mir. Im Palma hat die siebte Stufe geknarrt. Bei mir auch nicht.'}},
 {id:'railing',name:'Geländer',look:function(A){ return A.m(A.G.tod==='night'?'Das Geländer der Terrasse. Unten ist es schwarz, und aus dem Schwarzen kommt das Rauschen. Weiter rechts die Brücke, angestrahlt.':(A.G.phase==='k3_pro'?'Das Geländer, nass. Tief unten die Neretva, grün und schnell und lauter als der Regen.':'Das Geländer der Terrasse. Tief unten der Fluss, grün wie Flaschenglas. Drüben das Westufer, Häuser, ein Kran.')); },
   use:async function(A){ await A.m('Ich lehne mich ans Geländer und sehe hinunter. Mir wird nicht schwindlig. Mir wird nur kalt.'); if (A.G.malaOn && A.first('railM')) await A.g('Lehn dich nicht so weit vor. Bitte.'); },
   gexit:function(S,G){ if (G.phase!=='k3_pro_n' || !G.flags['k3.p.talk1']) return null; var s=M.stand('starimost','steps')||[72,135,'L']; return {to:'starimost',x:s[0],y:s[1],f:s[2]||'L'}; },
   g:{look:async function(A){ if (A.G.phase==='k3_pro_n' && A.flag('k3.p.talk1')) return A.g('Hier unten an der Brücke sind Stufen zum Wasser. So weit reicht es. So weit gehe ich, allein.'); return A.g('Am Geländer viele Hände. Alle haben sich hier festgehalten und hinuntergesehen. Keiner ist gesprungen. Gut.'); },
     sense:'Abdrücke von Händen, viele, warm und kalt durcheinander. Liebespaare. Einer, der hier eine Zigarette geraucht und nicht gesprungen ist.'}},
 {id:'table',name:'Tisch',look:function(A){ return A.m(A.G.tod==='night'?'Mein Tisch, sagt Maja, weil ich jeden Abend daran sitze. Ein Teelicht im Glas, eine Dose Bier, die mir die Australier hingestellt haben.':'Ein Plastiktisch mit zwei Plastikstühlen. Im Regen sammelt sich auf ihm ein kleiner See.'); },
   use:async function(A){ var G=A.G; if (G.phase==='k3_pro_n' && !A.flag('k3.p.talk1')) return M.k3Talk1(A); if (G.phase==='k3_d1_n' && !A.flag('k3.d1.father')) return M.k3Father(A);
     if (G.phase==='k3_pro') return A.m('Im Regen? Später. Wenn es dunkel ist, setze ich mich hierher.'); await A.m(A.cycle('tabU',['Ich setze mich und schreibe ein paar Zeilen ins Notizbuch. Keine davon ist für mich.','Ich setze mich. Der Stuhl wackelt. Ich bleibe trotzdem sitzen.'])); },
   g:{look:'Hier hast du es aufgeschrieben. „Bring sie nach Hause.“ Mit Datum.'}},
 {id:'guitar',name:'Tisch der Australier',look:function(A){ return A.m(aussiesHere(A.G)?'Der Tisch der Australier: Bierdosen, eine Gitarre mit drei neuen Saiten und drei alten, und eine Mütze, die keiner vermisst.':'Der Tisch der Australier. Bierdosen, eine Gitarre, eine vergessene Mütze. Die drei sind unterwegs, irgendwo, wo der Bus hinfährt.'); },
   use:function(A){ return A.m(aussiesHere(A.G)?'Das ist Liams Gitarre. Ich spiele nicht. Ich habe es einmal versucht, mit zwölf, für ein Mädchen, das gelacht hat.':'Ich lasse die Mütze, wo sie ist. Sie kommen wieder.'); },
   take:'Nicht meins.',
   g:{look:'Die Gitarre ist verstimmt. Die Leute nicht. Das ist schön.'}},
 {id:'lights',name:'Lichterkette',look:function(A){ return A.m(A.G.tod==='night'?'Eine Lichterkette, quer über die Terrasse gespannt. Jede dritte Birne flackert, als hätte sie eine eigene Meinung.':'Eine Lichterkette, tagsüber nur Draht mit kleinen Glasbirnen. Am Weinstock hängt sie fest.'); },
   use:'Der Schalter ist drinnen bei Maja. Ich lasse ihr das Licht.',
   g:{look:'Lauter kleine Lichter. Wie eine Stadt, die man in der Hand halten kann.'}},
 {id:'bridge_view',name:'Die Alte Brücke',look:function(A){ return A.m(A.G.tod==='night'?'Weiter flussab die Alte Brücke, angestrahlt. Ein heller Bogen über einem schwarzen Loch.':'Weit rechts die Alte Brücke, klein, im Profil. Ein einziger Bogen, wie aus Papier geschnitten. Wie sie aufsitzt, sieht man nur von nahem.'); },
   g:{look:'Von hier ist sie klein. Ich mag sie von hier. Von hier muss ich nicht hinauf.'}},
 {id:'maja',npc:'maja',name:'Maja',hgt:40,vis:function(S,G){ return majaHere(G); },talk:talkMaja,
   look:function(A){ return A.m(A.G.tod==='night'?'Maja, am Laptop, die Brille auf der Stirn. Sie schreibt E-Mails an Leute, die im Sommer kommen sollen.':'Maja, achtundzwanzig. Grüner Pullover, Bleistift im Haarknoten. Sie tippt, telefoniert und sieht dabei jeden an, der hereinkommt.'); },
   give:{ km:'Maja: „Bezahlt wird am Ende. Wie im Leben, sagt meine Tante. Meine Tante bezahlt nie.“', plan:async function(A){ var J=A.npc('maja'); await J.say('Den Plan? Der ist gut. Nur der Süden fehlt. Der Süden fehlt auf allen Plänen.'); },
     photo_full:async function(A){ var J=A.npc('maja'); await J.say('Eine Straßenbahn. Das ist Sarajevo.'); await A.wait(300); await J.say('Das Mädchen sieht aus, als hätte es gleich etwas vor. Wer ist das?'); await A.m('Eine Nachbarin.'); await J.say('So sehen Nachbarinnen nicht aus. So sehen große Schwestern aus.'); if (A.G.malaOn) await A.g('…'); },
     dzezva:'Maja: „Eine Džezva aus Sarajevo. Kochen Sie oben nicht damit, der Feuermelder ist empfindlich. Er ist das Teuerste im Haus.“' },
   g:{look:'Sie ist müde und lacht trotzdem über ihre eigenen Witze. Das hat mir immer gefallen an Leuten.',listen:async function(A){ await A.g('Sie telefoniert mit ihrer Mutter. „Ne, mama. Da, jela sam. Ne, nema snijega.“'); await A.wait(300); await A.g('Sie sagt, sie hat gegessen. Sie hat nicht gegessen.'); }}},
 {id:'aussie1',npc:'aussie1',name:'Josh',hgt:34,vis:function(S,G){ return aussiesHere(G); },talk:talkAussies,
   look:'Josh, oranges Funktionsjackett, ein Bart, der noch übt. Er erzählt eine Geschichte, die er schon zweimal erzählt hat.',
   give:{ plan:'Josh: „A map? Awesome. We just follow the bus.“', km:'Josh: „No, mate, keep it. Buy yourself a beer. Or a map.“' },
   g:{look:'Er redet laut, damit keiner merkt, dass er Heimweh hat.'}},
 {id:'aussie2',npc:'aussie2',name:'Bec',hgt:34,vis:function(S,G){ return aussiesHere(G); },talk:talkAussies,
   look:'Bec, blaue Jacke, die Mütze tief in der Stirn. Sie schreibt Postkarten und liest sie den anderen nicht vor.',
   g:{look:'Sie schreibt an ihre Mutter. Jeden Tag eine Karte. Ich habe auch Karten geschrieben.'}},
 {id:'aussie3',npc:'aussie3',name:'Liam',hgt:34,vis:function(S,G){ return aussiesHere(G); },talk:talkAussies,
   look:'Liam, die Gitarre auf dem Schoß. Er stimmt sie, seit ich hier bin, und sie klingt nicht besser.',
   g:{look:'Er spielt, damit die anderen singen. Das ist nett von ihm.',listen:'Er summt eine Melodie, die er nicht kennt, und trifft sie trotzdem fast.'}}
];
M.room('herberge',{ name:'Herberge „Neretva“', scape:'k3_herberge',
  music:function(G){ if (G.phase==='k3_epi'||G.phase==='k3_epi_d') return 'k3_epi'; return G.tod==='night'?'k3_noc':'k3_mostar'; },
  state:function(G){ return {aussies:false,candles:false}; },
  actors:function(S,G){ var L=[]; S.aussies=aussiesHere(G); S.candles=night(G);
    if (majaHere(G)){ var m=M.apos('herberge','maja',[60,118,'R']); L.push({id:'maja',ch:'maja',x:m[0],y:m[1],f:m[2]||'R',name:'Maja',idle:'type',speechY:44,
      routine:[['idle','type',6,11],['idle','phone',4,7],['idle','type',5,9],['face','R',2,4],['idle','type',4,8]]}); }
    if (aussiesHere(G)){ var a1=M.apos('herberge','aussie1',[300,122,'R']), a2=M.apos('herberge','aussie2',[330,122,'L']), a3=M.apos('herberge','aussie3',[360,122,'L']);
      L.push({id:'aussie1',ch:'aussie1',x:a1[0],y:a1[1],f:a1[2]||'R',name:'Josh',idle:'sit',speechY:36});
      L.push({id:'aussie2',ch:'aussie2',x:a2[0],y:a2[1],f:a2[2]||'L',name:'Bec',idle:'sit',speechY:36});
      L.push({id:'aussie3',ch:'aussie3',x:a3[0],y:a3[1],f:a3[2]||'L',name:'Liam',idle:G.tod==='night'?'guitar':'sit',talk:G.tod==='night'?'guitarTalk':'sitTalk',speechY:36,
        routine:[['idle','guitar',6,12],['idle','sit',3,5],['idle','guitar',5,9]]}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase, J=A.npc('maja');
    if (A.isMala()) return;
    if (p==='k3_pro' && A.first('hbArr')){ await A.narrate('Ein altes Steinhaus in einer Gasse der Altstadt, eine Rezeption, so groß wie ein Flur, und dahinter eine Terrasse über dem Fluss. Es riecht nach Kaffee und nassen Jacken.'); return; }
    if (p==='k3_d1' && A.first('hbD1') && majaHere(G)){ await J.say('Dobro jutro! Bura. Haben Sie das Fenster gehört? Die ganze Nacht.'); await J.say('Bei Bura sieht man vom Minarett der Koski-Moschee bis zu den Bergen im Süden. Die Australier sind schon oben gewesen. Vor dem Frühstück!'); return; }
    if (p==='k3_d2' && !N(A,'l3_tepa') && majaHere(G) && A.first('hbD2')){ await J.say('Dobro jutro. Samstag.'); await tepaLine(A,J); return; }
    if (p==='k3_d3' && A.first('hbD3') && majaHere(G)){ await J.say('Sonntag. Frost heute Nacht, sagt das Radio. Ziehen Sie sich etwas an, Sie sehen aus, als hätten Sie in einem Auto geschlafen.'); await A.m('Fast.'); return; }
    if (p==='k3_epi_d' && A.first('hbEpiD') && majaHere(G)){ await J.say('Sie sind noch da! Ich dachte, Sie sind weg, ohne zu zahlen. Das machen nur die Australier, und die zahlen mit Liedern.'); if (A.flag('k3.s.words')){ await A.wait(500); await J.say('Diesmal mit einem Video. Liam singt, und Bec hält einen Zettel ins Bild. Mit Ihrer Schrift.'); } return; }
    if (!A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k3_pro_n' && A.flag('k3.p.talk1') && from!=='zimmer' && A.first('hbN0')){ await A.g('Ich gehe gleich hinunter. Zu den Stufen.'); await A.m('Und ich ins Bett.'); }
    else if (p==='k3_d1_n' && A.flag('k3.d1.father') && A.first('hbN1')){ await A.g('Sie singen immer noch.'); }
    else if (p==='k3_d2_n' && A.flag('k3.s.words') && aussiesHere(G) && A.first('hbN2song')){ A.music('k3_aussie'); A.sfx('guitar'); await A.wait(900);
      if (M.k3HostelSong) await M.k3HostelSong(A); else await A.narrate('Die Australier singen das Lied. Mit Bec\' Zettel auf dem Knie, Strophe für Strophe, bis zur letzten Zeile.'); await A.wait(800);   // gesungen, mit Noten über der Terrasse (97_k3_auftritt.js)
      await A.g('Jetzt singen sie richtig.'); await A.m('Schade?'); await A.wait(700); await A.g('Nein. Schön richtig.');
      if (A.hasNote('v3_cab')){ await A.wait(900); await A.g('Im Führerhaus habe ich es ihm vorgesungen. Er sagt, falsch.'); await A.wait(400); await A.g('Ich habe nie falsch gesungen.'); } }
    else if (p==='k3_epi' && A.first('hbEpi')){ await A.g('Ganz still. Sogar der Fluss ist leiser.'); } }
});
})(M);
