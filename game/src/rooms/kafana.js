/* ===== rooms/kafana.js — Kafana „Kula“: Emina, Lejla, Šaćir. Was an jenem Abend geschah, wer gewartet hat, und was hinter dem Spiegel liegt ===== */
(function(M){
'use strict';
var P=M.P;
function open(G){ return G.phase==='k2_s1'||G.phase==='k2_s2'; }
function eminaHere(G){ return open(G) && !(G.flags['k2.s1.eminaAway'] && !G.flags['k2.s1.eminaBack']); }
// ---------------------------------------------------------------- Emina
async function talkEmina(A){ var E=A.npc('emina'), p=A.G.phase;
  if (p==='k2_s2') return E.say(A.cycle('emS2',['Kaffee? Heute für Sie umsonst. Morgen nicht mehr.','Lejla übt Geige, seit sie den Brief abgeschickt hat. Die Nachbarn beschweren sich. Ich nicht.','Die Bank unter der Uhr ist kalt geworden. Ich sitze trotzdem manchmal drauf.']));
  if (A.flag('k2.s1.emina')) return E.say('Heute Nacht. Wenn die Kula sieben schlägt. Gehen Sie jetzt, bevor ich es mir anders überlege.');
  if (A.flag('k2.s1.eminaBack') && A.has('letters_tz') && !A.flag('k2.s1.given')) return eminaGive(A,E);
  if (A.flag('k2.s1.given')) return eminaTruth(A,E);
  await A.menuLoop(function(){ return [
    {t:'Einen Kaffee, bitte.',once:'em0',go:async function(A){ await E.anim('pour'); await E.say('Bosanska kafa. Eins fünfzig. Hier wird nicht umgerührt, und hier wird nicht gefragt, ob es Espresso gibt.'); A.sfx('cup'); await A.m('Ich frage nicht.'); await E.say('Gut. Sie sind nicht von hier, aber Sie benehmen sich wie von hier.'); }},
    {t:'Wie lange haben Sie die Kafana schon?',once:'em1',go:async function(A){ await E.say('Mein Vater hat sie achtundfünfzig aufgemacht. Ich habe sie seit sechsundachtzig. Und Lejla bekommt sie, ob sie will oder nicht.'); await A.wait(400); await E.say('Sie will nicht.'); }},
    {t:'Erinnern Sie sich an den November 1972?',if:A.hasNote('s1_tomaz')&&!A.flag('k2.s1.eminaAsked'),go:async function(A){ await E.say('Was?'); await A.wait(800); await E.say('Kaffee, mein Herr. Mehr gibt es hier nicht.'); A.setFlag('k2.s1.eminaAsked'); await A.m('Sie ist blass geworden.'); }},
    {t:'Kannten Sie einen Tomaž Zupan?',if:A.hasNote('s1_name')||A.hasNote('s1_bracelet'),go:async function(A){ A.setFlag('k2.s1.eminaAsked'); await E.say('Raus.'); await A.wait(600); await E.say('Raus aus meiner Kafana. Lejla, der Herr geht.'); await A.m('…'); return 'bye'; }},
    A.askOpt({ s1_missed:function(A){ return eminaMissed(A,E); }, s1_both:function(A){ return eminaMissed(A,E); }, s1_2316:function(A){ return eminaMissed(A,E); },
      s1_waited:async function(A){ await E.say('Wer hat Ihnen das erzählt?'); await A.wait(600); await E.say('Lejla. Natürlich.'); await A.wait(500); await E.say('Ich habe nichts dazu zu sagen.'); },
      s1_alaturka:'Die Kula geht richtig. Die anderen Uhren gehen falsch.', s1_married:'Das geht Sie nichts an.', s1_curfew:'Soldaten. Die mussten immer irgendwo sein.',
      s1_note:async function(A){ await E.say('…'); await A.wait(900); await E.say('„Kad kula udari sedam.“ Das habe ich geschrieben.'); await A.wait(700); await E.say('Woher wissen Sie das?'); await A.m('Er hat den Zettel noch.'); await E.say('Raus.'); return 'bye'; } },'Kaffee. Mehr gibt es hier nicht.'),
    ...M.k2Extra('emina',A,E),
    {t:'Danke.',bye:true}
  ]; }); }
async function eminaMissed(A,E){ if (A.flag('k2.s1.nowriteAsked')){ await E.say('Und warum hat er nie geschrieben? Sagen Sie mir das.'); return; }
  if (!A.hasNote('s1_missed')){ await E.say('Das ist alles lange her. Lassen Sie es.'); return; }
  await A.m('Er war da, Emina. Ab fünf vor sieben. In dieser Kafana. Er hat jede Viertelstunde nach der Zeit gefragt.'); await A.m('Ihr Vater hat um elf zugemacht. Um halb zwölf musste er in der Kaserne sein. Er ist um fünf nach elf gegangen.'); await A.m('Die Kula hat an dem Abend um sechzehn nach elf sieben geschlagen.');
  await A.wait(1000); await E.say('…'); await E.say('Elf Minuten.'); await A.wait(900); await E.say('Das ist eine schöne Geschichte. Wer erzählt Ihnen solche Geschichten?'); await A.wait(700);
  await E.say('Und warum hat er nie geschrieben? Kein einziges Mal? Ich habe zwei Jahre lang auf den Briefträger gewartet.'); A.note('s1_nowrite'); A.setFlag('k2.s1.nowriteAsked'); }
async function eminaGive(A,E){ await A.m('Emina. Das hier lag hinter dem Spiegel in Ihrer Kammer.'); await A.animM('give'); A.take('letters_tz'); A.take('bracelet'); A.setFlag('k2.s1.given');
  await A.wait(800); await E.say('…'); await A.narrate('Sie nimmt die Briefe, als wären sie heiß. Das Armband legt sie auf die Theke und sieht es nicht an.'); await E.say('Die Schrift.'); await A.wait(900);
  await E.say('Die kenne ich. Ich habe sie neununddreißig Jahre nicht gesehen und kenne sie.'); await A.wait(600); return eminaTruth(A,E); }
// die Wahrheit, in der richtigen Reihenfolge: erst wann, dann warum er nie schrieb
async function eminaTruth(A,E){ var S=A.S; S.truth=S.truth||0;
  if (S.truth===0) await E.say('Erzählen Sie. Und wehe, Sie erzählen falsch.');
  for (var guard=0;guard<8 && S.truth<2;guard++){
    var n=await A.askNote(S.truth===0?'Was sage ich ihr zuerst?':'Und dann?'); if (!n){ await E.say('Ich warte. Ich kann warten. Ich habe es gelernt.'); return; }
    if (S.truth===0 && (n==='s1_missed'||n==='s1_both'||n==='s1_2316')){ S.truth=1; await A.m('Er war da. Ab fünf vor sieben, bis fünf nach elf. Die Kula schlug sieben, als er schon weg war. Elf Minuten.'); await E.say('Elf Minuten.'); await A.wait(800); continue; }
    if (S.truth===1 && (n==='s1_betrayal'||n==='s1_letters')){ S.truth=2; await A.m('Und er hat geschrieben. Sechsmal. Ihr Vater hat die Briefe genommen und hinter den Spiegel gesteckt. Zusammen mit dem Armband, das Šaćir ihm für Sie gegeben hat.'); break; }
    if (S.truth===0 && (n==='s1_betrayal'||n==='s1_letters')){ await E.say('Briefe! Briefe! Was helfen mir Briefe, wenn er nicht kam? Er kam nicht!'); await E.face('B'); await A.wait(700); await A.m('Falsch angefangen. Sie hört nichts mehr, solange sie glaubt, er kam nicht.'); S.truth=0; return; }
    await E.say(['Das ist nicht, was ich wissen will.','Hören Sie auf damit.','Was soll mir das sagen?'][guard%3]); }
  if (S.truth<2) return;
  await A.wait(1200); await E.say('Mein Vater.'); await A.wait(900); await E.say('Er hat mich am nächsten Morgen gefunden, auf der Bank, und mich nach Hause getragen. Und er hat nie ein Wort gesagt. Neununddreißig Jahre.');
  await E.say('Er ist sechsundachtzig gestorben. Ich habe ihm den Sarg ausgesucht. Einen schönen.'); await A.wait(1000); await E.anim('wipe'); await E.say('…');
  await A.wait(900); await E.say('Was wollen Sie von mir, Übersetzer?'); await A.m('Kommen Sie heute Nacht unter die Uhr. Wenn die Kula sieben schlägt.'); await A.wait(800); await E.say('Und dann?'); await A.m('Dann wartet keiner mehr.');
  await A.wait(1100); await E.say('Heute Nacht.'); await E.say('Wenn die Kula sieben schlägt.'); A.setFlag('k2.s1.emina'); A.sfx('note'); A.save();
  if (A.G.malaOn){ await A.wait(600); await A.g('Sie zieht das Armband an. Unter der Theke, wo sie glaubt, dass es keiner sieht.'); }
  await A.wait(600); await M.k2StartS1Night(A); }
// ---------------------------------------------------------------- Lejla
async function talkLejla(A){ var L=A.npc('lejla'), p=A.G.phase;
  if (p==='k2_s2'){ return L.say(A.cycle('ljS2',['Ich habe den Brief abgeschickt! Mit Ihren Kommas!','Oma redet seit gestern mit dem Armband. Ich tue so, als merke ich es nicht.','Der Übersetzer aus Split. Haben Sie noch mehr Geister? Ich meine: Geschichten.'])); }
  await A.menuLoop(function(){ return [
    {t:'Warum geht die Uhr an der Kula falsch?',if:!A.hasNote('s1_alaturka'),go:async function(A){ await L.anim('phone'); await L.say('Die geht nicht falsch. Die geht alaturka.'); await A.m('Alaturka?'); await L.say('Nach dem Mond, sagen die Touristen. Eigentlich nach der Sonne: Zwölf ist bei Sonnenuntergang. Jeden Tag ein bisschen anders.');
        await L.say('Ein Mann stellt sie von Hand. Der Muvekit. Er steigt jede Woche die Treppe hinauf, sechsundsiebzig Stufen. Ich war mal mit, in der Grundschule.'); A.note('s1_alaturka'); }},
    {t:'Was ist mit Ihrer Großmutter? Sie war blass.',once:'lj1',if:A.flag('k2.s1.eminaAsked'),go:async function(A){ await L.say('Oma? Die ist immer so, wenn jemand nach früher fragt. Früher ist bei uns verboten.'); await L.say('Sie hat Opa 1975 geheiratet. Ihr Vater hat es so gewollt. Opa war nett. Sie hat ihn nicht geliebt, das weiß jeder, nur er nicht.'); A.note('s1_married'); }},
    {t:'Was war früher die Kaserne „Maršal Tito“?',once:'lj2',if:A.hasNote('s1_curfew'),go:async function(A){ await L.say('Die Kaserne? Das ist jetzt der Campus. Die Uni. Meine Schule ist gleich daneben.'); await L.say('Da, wo früher die Soldaten exerziert haben, sitzen jetzt Studenten und rauchen. Opa sagt, das ist auch eine Art Fortschritt.'); A.note('s1_campus'); }},
    {t:'Was machen Sie, wenn Sie nicht hier sind?',once:'lj3',go:async function(A){ await L.say('Geige. Und Hausaufgaben. Und weg wollen.'); await L.say('Ich bewerbe mich in Wien. Musikgymnasium. Den Brief muss ich auf Deutsch schreiben. Mein Deutsch ist … Google.'); A.setFlag('k2.s1.lejlaLetter'); }},
    {t:'Zeigen Sie mir Ihren Brief nach Wien.',if:A.flag('k2.s1.lejlaLetter')&&!A.flag('k2.s1.letterFixed'),go:function(A){ return lejlaLetter(A,L); }},
    {t:'Kommen Sie in die Kammer?',if:A.hasNote('s1_hidden')&&!A.flag('k2.s1.ostavaOpen'),go:async function(A){ if (!A.flag('k2.s1.letterFixed')){ await L.say('In die Ostava? Da hat Oma den Schlüssel. Um den Hals. Wie eine Nonne.'); await L.say('Warum sollte ich Ihnen da rein helfen? Sie sind ein Fremder mit einem Dalmatiner-Akzent.'); return; }
        if (!A.flag('k2.s1.eminaAway')){ await L.say('Wenn Oma weg ist. Nicht vorher. Sie hört alles, sogar wenn sie schläft.'); return; } return lejlaOpens(A,L); }},
    A.askOpt({ s1_waited:'Das hat sie gesagt? Zu mir? Ich dachte, sie redet vom Wetter. Bei Oma ist alles Wetter.', s1_tomaz:'Ein Soldat unter der Uhr? Sie sehen auch zu viele Filme.',
      s1_note:'„Wenn die Kula sieben schlägt“? Das ist so altmodisch, dass es schon wieder schön ist.', s1_twosevens:async function(A){ await L.say('Ha. Zwei Siebenen. Das ist wie bei meinen Eltern: Sie sagt sieben, er kommt um neun.'); await L.say('Wenn du wissen willst, wann damals die Sonne unterging: Der alte Kabiljo in der Passage an der Ferhadija hat alte Takvime. Er hat alles Alte. Er ist selbst alt.'); A.unlock('ferhadija'); },
      s1_nowrite:'Briefe? Oma bekommt keine Briefe. Nur Rechnungen. Und die versteckt sie.', s1_father:'Uropa Halid. Den kenne ich nur vom Foto. Er sieht auf allen Fotos aus, als würde er gleich jemanden rauswerfen.' },'Keine Ahnung. Ich bin sechzehn.'),
    ...M.k2Extra('lejla',A,L),
    {t:'Bis später, Lejla.',bye:true,go:async function(A){ await L.say('Ciao, Übersetzer.'); }}
  ]; }); }
async function lejlaLetter(A,L){ await L.say('Okay. Aber nicht lachen.'); A.give('lejla_letter'); await A.m('Ich lache nie über Briefe.'); return M.k2LejlaLetter(A); }
M.k2LejlaLetter=async function(A){ var L=A.npc('lejla'); if (A.flag('k2.s1.letterFixed')) return A.m('Der Brief ist fertig. Lejla hat ihn abgeschrieben, mit ihrer schönsten Schrift.');
  await A.doc({style:'letter',title:'Bewerbung – Lejla Kadić',lines:['Sehr geehrte Damen und Herren,','','ich bin sechzehn Jahre und spiele Geige seit neun Jahren.','Ich will bekommen ein Platz in Ihrer Schule.','Mein Lehrer sagt, ich bin begabt, aber faul.','Ich freue mich auf Ihre Antwort und küsse Sie.','','Lejla Kadić, Sarajevo']});
  var res=await A.puzzle({title:'Lejlas Brief verbessern',hint:'Drei Sätze klingen falsch. Tippe auf eine Zeile, um eine bessere Fassung zu wählen, dann „Fertig“.',button:'Fertig',
    slots:[['Ich will bekommen ein Platz in Ihrer Schule.','Ich möchte mich um einen Platz an Ihrer Schule bewerben.','Ich nehme einen Platz in Ihrer Schule.'],
      ['Mein Lehrer sagt, ich bin begabt, aber faul.','Mein Lehrer hält mich für begabt und fleißig.','Mein Lehrer sagt, ich bin begabt und arbeite gern.'],
      ['Ich freue mich auf Ihre Antwort und küsse Sie.','Ich freue mich auf Ihre Antwort. Mit freundlichen Grüßen','Ich warte auf Ihre Antwort, sonst komme ich.']],
    init:[0,0,0],
    check:function(sel){ var ok=[1,2,1], msg=['Lejla: „Das klingt wie ein Roboter, sagt sogar Google.“','Lejla: „Faul ist ehrlich. Aber vielleicht nicht in der ersten Zeile?“ Und „fleißig“ ist gelogen, sagt sie.','Lejla: „Küssen? Im Ernst? Das habe ich aus einem Film. Nein?“'];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i]}; return {ok:true}; }});
  if (!res){ await L.say('Was ist? Ist es so schlimm?'); return; }
  A.take('lejla_letter'); A.setFlag('k2.s1.letterFixed'); await A.m('„Ich möchte mich um einen Platz an Ihrer Schule bewerben. Mein Lehrer sagt, ich bin begabt und arbeite gern. Mit freundlichen Grüßen.“');
  await L.say('Das klingt wie eine Erwachsene!'); await L.say('Das klingt wie jemand, der nach Wien darf.'); await A.wait(500); await L.say('Okay, Übersetzer. Ich schulde Ihnen was. Sagen Sie, was.'); A.save(); };
async function lejlaOpens(A,L){ await L.say('Oma ist bei Tante Sabira. Das dauert, die reden über Krankheiten.'); await L.say('Den Schlüssel hat sie vergessen. Zum ersten Mal in meinem Leben.'); A.sfx('lock'); A.set('ostavaOpen',true); A.setFlag('k2.s1.ostavaOpen');
  await L.say('Zehn Minuten. Wenn Sie was kaputt machen, waren Sie es, nicht ich.'); A.rebuild(); }
// ---------------------------------------------------------------- Šaćir
async function talkSacir(A){ var Sc=A.npc('sacir');
  if (A.first('scLoud')){ await Sc.say('Was?'); await A.m('Guten Tag!'); await Sc.say('WAS?'); }
  await A.menuLoop(function(){ return [
    {t:'(Lauter.) Waren Sie hier Kellner?',once:'sc1',go:async function(A){ await Sc.say('Kellner? Fünfundvierzig Jahre, mein Sohn! Unter Halid und unter Emina. Ich habe hier Kaffee getragen, als die Kula noch richtig ging.'); await Sc.say('Sie geht immer noch richtig. Wir gehen falsch.'); }},
    {t:'(Lauter.) Erinnern Sie sich an einen jungen Soldaten? 1972?',if:!A.hasNote('s1_soldier'),go:async function(A){ if (!A.hasNote('s1_date')&&!A.hasNote('s1_name')){ await Sc.say('Soldaten? Es gab tausend Soldaten. Jeder Soldat hat hier Kaffee getrunken und nicht bezahlt.'); await Sc.say('Welcher Tag? Sagen Sie mir den Tag.'); return; }
        await Sc.say('Der vierzehnte November …'); await Sc.anim('domino'); await A.wait(900); await Sc.say('Damals, mein Sohn. Damals saß da ein junger Soldat, da, an diesem Tisch. Ein Slowene. Ab sieben.');
        await Sc.say('Jede Viertelstunde hat er gefragt, wie spät es ist. Ich habe ihm die Uhrzeit gesagt, und er hat zur Tür gesehen.'); A.note('s1_soldier');
        await Sc.say('Und Halid hat um elf zugemacht. Um elf! Sonst immer um Mitternacht. Er hat gesagt, er hat Kopfschmerzen. Halid hatte nie Kopfschmerzen.'); A.note('s1_closed'); }},
    {t:'(Lauter.) Hat der Soldat etwas dagelassen?',if:A.hasNote('s1_nowrite')&&!A.hasNote('s1_gave'),go:async function(A){ await Sc.say('Dagelassen …'); await A.wait(1100); await Sc.say('Ja. Ja! Ein Kästchen. Er hat es mir in die Hand gedrückt, an der Tür. „Für Emina, wenn sie kommt.“'); await A.wait(800);
        await Sc.say('Ich habe es Halid gegeben. Wem sonst? Es war seine Tochter.'); await A.wait(700); await Sc.say('Ich dachte, er gibt es ihr.'); A.note('s1_gave'); await A.wait(900); await Sc.say('Hat er es ihr nicht gegeben?'); await A.m('…'); }},
    {t:'(Lauter.) Wie war Halid?',once:'sc2',go:async function(A){ await Sc.say('Halid war ein Vater. Ein Vater von damals. Er hat seine Tochter mehr geliebt als sie ihn.'); await Sc.say('Das ist kein Lob, mein Sohn.'); }},
    A.askOpt({ s1_tomaz:'Unter der Uhr? Da steht keiner. Da stand nur einmal einer, lange.', s1_alaturka:'Die Kula! Ich habe nach der Kula gelebt. Bei Sonnenuntergang war Feierabend, egal was die Uhr sagte.', s1_waited:'Emina hat gewartet? Wann? Sie hat immer gewartet. Auf was, weiß keiner.',
      s1_curfew:'Halb zwölf, ja, die Soldaten. Wie Aschenputtel.', s1_missed:'Elf Minuten …? Ach, mein Sohn. Ach.', s1_hidden:'Hinter den Spiegel? Halid? Der hat da sein Geld versteckt. Und nicht nur Geld, wie es scheint.' },'WAS? Sagen Sie es lauter.'),
    ...M.k2Extra('sacir',A,Sc),
    {t:'(Lauter.) Danke, Gospodine Šaćir.',bye:true,go:async function(A){ await Sc.say('Spielen Sie Domino? Nein? Schade. Keiner spielt mehr.'); }}
  ]; }); }
// ---------------------------------------------------------------- Tomažs Briefe (Slowenisch)
M.k2ReadLetters=async function(A){ if (A.hasNote('s1_letters')){ return A.m('„Ich habe bis elf gewartet. Um halb zwölf musste ich in der Kaserne sein. Ich schreibe, bis du antwortest.“ Sechs Briefe. Der letzte ist ganz kurz.'); }
  await A.doc({style:'letter',title:'Ljubljana, 20. novembra 1972',lines:['Draga Emina,','','čakal sem do enajstih. Ob pol dvanajstih sem moral','biti v vojašnici. Nisi prišla. Ne vem, zakaj.','Pisal ti bom, dokler mi ne odgovoriš.','','Tvoj Tomaž']});
  await A.m('Slowenisch. Ich lese es. Aber ich will es richtig sagen, nicht ungefähr.');
  var res=await A.puzzle({title:'Tomažs Brief übersetzen',hint:'Slowenisch ist nah am Bosnischen, aber nicht gleich. „Čakal“ heißt gewartet, „vojašnica“ ist die Kaserne. Tippe auf eine Zeile, um eine andere Fassung zu wählen.',button:'Vorlesen',
    slots:[['„Ich habe bis elf gewartet.','„Ich habe bis sieben gewartet.','„Ich habe elf Jahre gewartet.'],['Um halb zwölf musste ich in der Kaserne sein.','Um halb elf musste ich nach Hause.','Um zwölf hat die Kaserne zugemacht.'],['Du bist nicht gekommen. Ich weiß nicht, warum.','Du bist zu spät gekommen, ich weiß.','Du wolltest nicht kommen.'],['Ich schreibe dir, bis du antwortest.“','Ich schreibe dir nie mehr.“','Schreib mir, wenn du willst.“']],
    init:[1,1,1,1],
    check:function(sel){ var ok=[0,0,0,0], msg=['„Do enajstih“ – bis elf. Nicht sieben, nicht elf Jahre.','„Ob pol dvanajstih“ ist halb zwölf, wie bei uns. Und „vojašnica“ ist die Kaserne.','„Nisi prišla. Ne vem, zakaj.“ Er weiß es nicht. Er wirft ihr nichts vor.','„Pisal ti bom, dokler mi ne odgovoriš.“ Er hört nicht auf.'];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i]}; return {ok:true}; }});
  if (!res){ await A.m('Später. Ich will es nicht falsch sagen.'); return; }
  await A.m('„Ich habe bis elf gewartet. Um halb zwölf musste ich in der Kaserne sein. Du bist nicht gekommen. Ich weiß nicht, warum. Ich schreibe dir, bis du antwortest.“'); A.note('s1_letters');
  await A.wait(600); await A.m('Sechs Briefe. Der letzte, vom März dreiundsiebzig, hat nur eine Zeile: „Ich warte noch.“'); if (A.G.malaOn) await A.g('Er hat geschrieben. Und sie hat gewartet. Und dazwischen ein Spiegel.'); };
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:{to:'kula'},look:'Die Tür zur Kula. Draußen der Nebel, drinnen die Wärme.'},
 {id:'emina',npc:'emina',name:'Emina',hgt:30,vis:function(S,G){ return eminaHere(G); },talk:talkEmina,
   look:function(A){ return A.m(A.flag('k2.s1.emina')?'Emina, hinter der Theke. Am Handgelenk, halb unter der Strickjacke, ein Kupferarmband.':'Eine schlanke Frau hinter der Theke, der Knoten streng, die Brauen streng, der Kaffee stark. Sie heißt Emina, sagt die Preistafel. Sie sagt nichts.'); },
   give:{ letters_tz:function(A){ return A.flag('k2.s1.eminaBack')?eminaGive(A,A.npc('emina')):A.m('Nicht jetzt. Sie würde sie ins Feuer werfen, ohne sie anzusehen.'); }, bracelet:function(A){ return A.flag('k2.s1.eminaBack')&&A.has('letters_tz')?eminaGive(A,A.npc('emina')):A.m('Erst die Briefe. Das Armband allein ist nur ein Ding.'); },
     km:async function(A){ await A.npc('emina').say('Eins fünfzig. Danke.'); A.sfx('coin'); } },
   g:{look:'Sie hat neununddreißig Jahre nicht unter die Uhr gesehen. Sie weiß genau, wie sie aussieht.',
     listen:async function(A){ if (!A.flag('k2.s1.eminaAsked')) return A.g('Sie redet mit dem Kaffee. „Nicht zu schnell. Nicht zu schnell.“');
       if (!A.hasNote('s1_waited')){ await A.memory({title:'Lauschen – hinter der Theke',tint:'ghost',draw:M.mem&&M.mem.k2_listen,lines:['Emina, leise, zu Lejla: „Dieser Mann aus Split. Er fragt nach früher.“','Lejla: „Nach was für früher?“','Emina: „Nach einer Nacht. Ich habe die ganze Nacht unter der Uhr gewartet, Lejla. Ich war neunzehn. Er kam nicht.“','„Und jetzt hör auf zu fragen und bring Šaćir sein Wasser.“']}); A.note('s1_waited'); return; }
       if (A.flag('k2.s1.letterFixed') && A.hasNote('s1_hidden') && !A.hasNote('s1_away')){ await A.memory({title:'Lauschen – hinter der Theke',tint:'ghost',draw:M.mem&&M.mem.k2_listen,lines:['Emina: „Ich gehe nachher zu Tante Sabira. Pass auf die Kafana auf.“','Lejla: „Und der Schlüssel?“','Emina: „Der bleibt hier. Am Haken. Du gehst da nicht hinein.“']}); A.note('s1_away'); A.setFlag('k2.s1.eminaAway'); A.rebuild(); await A.g('Sie geht. Jetzt.'); return; }
       await A.g('Sie zählt die Löffel. Jeden Abend zählt sie die Löffel.'); }}},
 {id:'lejla',npc:'lejla',name:'Lejla',hgt:44,vis:function(S,G){ return open(G); },talk:talkLejla,
   look:'Ein Mädchen mit Pferdeschwanz, weißer Kapuzenjacke und Handy. Sie trägt Kaffee, als wäre es eine Strafe, und tippt dazwischen.',
   give:{ lejla_letter:function(A){ return M.k2LejlaLetter(A); } }, g:{look:'Sechzehn. Sie will weg. Ich wollte auch weg, mit sechzehn. Ich bin weg.'}},
 {id:'sacir',npc:'sacir',name:'Šaćir',hgt:34,vis:function(S,G){ return open(G); },talk:talkSacir,
   look:'Ein alter Mann am Fenstertisch, Glatze, weißer Schnurrbart, Gehstock. Er spielt Domino gegen sich selbst und verliert.',
   g:{look:'Er hat hier fünfundvierzig Jahre Kaffee getragen. Seine Hände tragen ihn noch.',listen:async function(A){ await A.g('„Ich habe es Halid gegeben. Wem sonst?“ Er sagt das oft, zu sich selbst. Er weiß nicht mehr, was.'); }}},
 {id:'counter',name:'Theke',look:'Eine Theke aus dunklem Holz, abgewetzt an der Stelle, an der neununddreißig Jahre lang derselbe Ellbogen lag.',g:{look:'Hinter der Theke haben zwei geredet, die nicht wussten, dass ich zuhöre.'}},
 {id:'stove',name:'Kaffeeherd',look:'Ein Kaffeeherd mit heißem Sand, in dem kleine Džezve stecken. So macht man Kaffee, wenn man Zeit hat.',use:'Das ist Eminas Herd. Hier kocht nur Emina.',g:{look:'Sand. Sie haben im Krieg Kaffee auf Sand gekocht, über Kerzen. Wenn es Kaffee gab.'}},
 {id:'dzezve',name:'Džezve',look:'Ein Regal voller Džezve, die kleinste so groß wie eine Faust, die größte wie ein Kinderkopf.',take:'Ich habe meine eigene. Die von Großmutter.',g:{look:'In jeder steckt ein Morgen.'}},
 {id:'trays',name:'Kupfertabletts',look:'Kupfertabletts mit Gravuren, Ranken, Moscheen, eine Brücke. Auf einem steht klein: „Kazandžić“.',g:{look:'Die Brücke da. Die kenne ich. Woher kenne ich die?'}},
 {id:'window_table',name:'Fenstertisch',look:'Der Tisch am Fenster, von dem aus man die Uhr sieht. Šaćirs Tisch.',g:{look:'Hier hat einer gesessen und auf die Tür gesehen. Den ganzen Abend.',sense:async function(A){ await A.g('Ein junger Mann, fünf vor sieben bis elf. Er bestellt Kaffee, er bezahlt nicht. Bei jedem Schritt draußen dreht er sich um.'); }}},
 {id:'dominoes',name:'Domino',look:'Dominosteine aus Knochen, gelb vom Rauch. Šaćir spielt gegen sich selbst und schummelt.',take:'Šaćir würde es merken. Er merkt alles, was er sehen kann.',g:{look:'Klack, klack. Das Geräusch ist das Älteste hier.'}},
 {id:'photos',name:'Fotos',look:'Schwarzweißfotos: die Belegschaft der Kafana vor der Kula. Unten im Rahmen: 1972. Ein strenger Mann mit Schnurrbart, ein junger Kellner, und ein Mädchen mit schwarzen Haaren, das als Einzige lacht.',
   g:{look:'Das Mädchen ist Emina. Sie lacht, weil am nächsten Abend jemand kommt.'}},
 {id:'radio',name:'Radio',look:function(A){ return A.m(A.S.radioOn?'Das Radio spielt Sevdah. Eine Frau singt von einer Liebe, die nicht kommen durfte.':'Ein altes Radio auf dem Wandbord, aus.'); },use:async function(A){ A.set('radioOn',!A.S.radioOn); A.sfx('click'); if (A.S.radioOn){ A.music('k2_kafana'); await A.m('Sevdah. Natürlich.'); } else { A.music('k2_istraga'); await A.m('Stille.'); } },
   g:{look:'Das Lied kenne ich. Meine Mutter hat es gesungen. Ich glaube, meine Mutter.'}},
 {id:'ostava_door',name:'Kammer',look:function(A){ return A.m(A.S.ostavaOpen?'Die Tür zur Kammer steht offen. Dahinter riecht es nach Kaffeesäcken und Staub.':'Eine schmale Tür hinter der Theke, „OSTAVA“, mit einem Vorhang davor. Abgeschlossen.'); },
   exit:function(S){ return S.ostavaOpen?{to:'ostava'}:null; }, gexit:{to:'ostava'},
   open:async function(A){ if (A.S.ostavaOpen) return A.m('Sie ist offen.'); await A.m('Abgeschlossen. Den Schlüssel trägt Emina um den Hals.'); },
   g:{look:'Hinter der Tür ist etwas, das leuchtet. Ich kann hindurchgehen.'}},
 {id:'pricelist',name:'Preistafel',look:'„BOSANSKA KAFA 1,50 KM · ČAJ 1,50 · SOK 2,00 · RAHATLOKUM 0,50“. Darunter, mit Kreide: „Espresso NEMA!“',g:{look:'„Kein Espresso.“ Sie meint es ernst.'}},
 {id:'stools',name:'Stühle',look:function(A){ return A.m(A.S.closed?'Die Stühle stehen auf den Tischen, Beine nach oben, wie Insekten im Schlaf.':'Niedrige Stühle mit Bastsitzen. Man sitzt hier tief, damit man nicht so schnell aufsteht.'); },g:{look:'Man sitzt hier tief. Man geht nicht so schnell.'}}
];
M.room('kafana',{ name:'Kafana „Kula“', scape:'k2_kafana',
  music:function(G){ return 'k2_istraga'; },
  state:function(G){ return {ostavaOpen:false,closed:false,radioOn:false,truth:0}; },
  actors:function(S,G){ var L=[]; S.closed=!open(G);
    if (eminaHere(G)){ var e=M.apos('kafana','emina',[190,104,'F']); L.push({id:'emina',ch:'emina',x:e[0],y:e[1],f:e[2]||'F',name:'Emina',idle:'pour',speechY:34}); }
    if (open(G)){ var l=M.apos('kafana','lejla',[240,122,'L']); L.push({id:'lejla',ch:'lejla',x:l[0],y:l[1],f:l[2]||'L',name:'Lejla',idle:'phone',speechY:44});
      var s=M.apos('kafana','sacir',[70,120,'R']); L.push({id:'sacir',ch:'sacir',x:s[0],y:s[1],f:s[2]||'R',name:'Šaćir',idle:'domino',talk:'sitTalk',speechY:38}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_s1' && from==='ostava' && A.has('letters_tz') && !A.flag('k2.s1.eminaBack')){ A.setFlag('k2.s1.eminaBack'); A.rebuild(); await A.wait(500); A.sfx('door');
      await A.voice('Von der Tür: „Lejla! Wer war in der Kammer?“',P.s5); await A.wait(600); await A.m('Emina. Zurück von Tante Sabira. Früher als gedacht.'); if (A.malaHere()) await A.g('Jetzt.'); }
    if (p==='k2_s1' && A.first('k2kfS1')){ await A.m('Warm, dunkel, Kupfer an allen Wänden. Es riecht nach Kaffee und nach etwas, das man früher Tabak nannte.'); } }
});
})(M);
