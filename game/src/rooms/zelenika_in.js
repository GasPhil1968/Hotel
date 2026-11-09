/* ===== rooms/zelenika_in.js — Im Haus Zelenika: die Stube mit Mates Briefen („Smokve su rodile. Kad ćete doći?“), Mates Schublade mit Lenas
   Postkarten („Dragi dida.“), oben das Kinderzimmer von 1998. Hier übersetzt Marko Davor, was sein Vater gemeint hat. ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function sat(G){ return G.phase==='k3_d2'; } function sun(G){ return G.phase==='k3_d3'; }
function inside(G){ return (sat(G) && F(G,'k3.b.jela')) || (sun(G) && !F(G,'k3.b.invite')); }
// ---------------------------------------------------------------- Die Briefe
async function letters(A){ var Dv=A.npc('davor'), G=A.G;
  if (sat(G)) return Dv.say('Morgen. Heute lese ich sie selbst.');
  if (!A.hasNote('b3_letters') && inside(G) && A.first('zlLet')){ await Dv.say('Ich habe sie mitgebracht. Ich weiß nicht, warum.'); await A.wait(500); await Dv.say('Lesen Sie ruhig. Sie sind Übersetzer. Vielleicht verstehen Sie, was ich nicht verstehe.'); }
  await A.doc({style:'letter',title:'Mate an Davor',lines:['Mostar, 14. 9. 2003','','Dragi sine,','smokve su rodile. Kad ćete doći?','','Tvoj otac','','Darunter im Karton noch elf Briefe, einer pro Jahr, 1998 bis 2009.','Derselbe Satz in jedem. Nur das Datum wechselt.']});
  if (!A.hasNote('b3_letters')){ await A.m('„Lieber Sohn, die Feigen haben getragen. Wann kommt ihr? Dein Vater.“'); await A.m('Jedes Jahr. Zwölf Briefe, derselbe Satz.'); A.note('b3_letters'); A.setFlag('k3.b.letters');
    if (inside(G)){ await A.wait(700); await Dv.say('Jedes Jahr derselbe Satz. Die Feigen haben getragen. Wann kommt ihr.'); await A.wait(600); await Dv.say('Jedes Jahr ein Vorwurf. Warum kommst du nicht. Warum bist du weg.'); }
    if (G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Das ist kein Vorwurf.'); await A.wait(500); await A.g('Das weiß ich, weil ich auch nie gesagt habe, was ich meine.'); } } }
// ---------------------------------------------------------------- Mates Schublade: Lenas Karten, darunter in Bleistift „Dragi dida.“
async function drawer(A){ var Dv=A.npc('davor'), G=A.G;
  if (sat(G)) return A.m('Mates Schublade. Davor sitzt daneben. Heute nicht.');
  if (!A.hasNote('b3_cards') && inside(G) && A.first('zlDr')){ await Dv.say('Das ist Vaters Schublade.'); await A.wait(700); await Dv.say('Machen Sie auf. Ich kann es nicht.'); }
  A.sfx('drawer');
  await A.doc({style:'postcard',title:'Lenas Postkarten an den Opa',lines:['Lieber Opa,','        (darunter, mit Bleistift, ganz klein: Dragi dida.)','ich bin jetzt in der dritten Klasse. Wir haben einen Hasen.','Er heißt Mümmel. Er beißt.','Deine Lena','','Lieber Opa,','        (darunter: Dragi dida.)','ich spiele jetzt Volleyball. Papa sagt, du hast auch gespielt.','Deine Lena']});
  if (!A.hasNote('b3_cards')){ await A.m('Lenas Postkarten aus München. Jedes Jahr eine, mit Schulfoto. „Lieber Opa.“'); A.note('b3_cards'); A.setFlag('k3.b.cards'); await A.wait(600);
    await A.m('Und unter jedem „Lieber Opa“, mit Bleistift, ganz klein, in einer anderen Schrift: „Dragi dida.“'); A.note('b3_pencil');
    if (inside(G)){ await A.wait(700); await Dv.say('Die Karten. Die hat Lena jedes Jahr geschrieben. Ich habe sie zur Post gebracht.'); await A.wait(500); await Dv.say('Ich wusste nicht, dass er sie aufhebt.'); }
    if (G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Er hat sich das Wort selbst darunter geschrieben. Damit es richtig heißt.'); } }
  else A.note('b3_pencil',true); }
// ---------------------------------------------------------------- Das Kinderzimmer (Marko geht die halbe Treppe hinauf)
async function upstairs(A){ var G=A.G, Ln=A.npc('lena');
  if (sat(G)) return A.m('Die Treppe hinauf. Heute nicht. Das ist nicht mein Haus, und Davor hat es mir noch nicht gezeigt.');
  if (A.flag('k3.b.kids')) return A.m('Oben das Kinderzimmer. Die Ballons an der Wand, das Bett, das Buch. Es wartet immer noch.');
  await A.fade(6,450); A.sfx('steps'); await A.wait(650); await A.fade(0,450);
  await A.narrate('Eine halbe Treppe hinauf. Die Tür steht offen. Ein Kinderzimmer: Tapete mit bunten Luftballons, ein weißes Kinderbett mit Decke und Kissen, ein Regal mit Spielzeug, das noch in der Folie steckt.');
  await A.narrate('Im Regal ein Kinderbuch auf Deutsch. Vorn hinein hat jemand mit Bleistift geschrieben: „Za Lenu. 1998.“');
  if (inside(G)){ await A.wait(500); await Ln.say('Neunzehnhundertachtundneunzig? Da war ich eins.'); await A.wait(500); await Ln.say('Papa hat mal erzählt, Opa hat einen Baum gepflanzt, als ich geboren bin. Ich dachte, das ist so ein Spruch.'); }
  else if (A.flag('k3.b.tree97')) await A.m('Und Jela hat gesagt: Den großen Feigenbaum hat er siebenundneunzig gepflanzt. Als die Kleine geboren wurde.');
  A.note('b3_kidsroom'); A.setFlag('k3.b.kids');
  if (G.malaOn && A.malaHere()){ await A.wait(700); await A.g('Hier oben ist es warm. Niemand hat je darin geschlafen.'); }
  await A.fade(6,350); await A.wait(300); await A.fade(0,350); }
// ---------------------------------------------------------------- Davor übersetzen, was Mate gemeint hat (b3_invite); Jela gibt nach
async function invite(A){ var Dv=A.npc('davor'), Ln=A.npc('lena');
  await A.wait(400); await A.m('Oben ist ein Kinderzimmer. Eingerichtet achtundneunzig, für ein Kind, das nie da war. Mit einem deutschen Buch im Regal. Und der große Feigenbaum ist von siebenundneunzig.');
  await A.m('„Kad ćete doći?“ Das ist keine Frage nach dem Datum. Das ist eine Einladung, die sich nicht traut.');
  await A.wait(500); await A.m('Lena. Das heißt: Kommt doch. Er hat sich nur nicht getraut, es so zu schreiben.');
  await A.wait(1300); await A.narrate('Davor nimmt einen Brief aus dem Karton und liest ihn noch einmal. Seine Lippen bewegen sich mit.');
  await Dv.say('Smokve su rodile. Kad ćete doći.'); await A.wait(1000); await Dv.say('Ich habe darin immer gelesen: Warum kommst du nicht.');
  await A.wait(800); await Dv.say('Er hat nie gesagt: Komm. Er hat gesagt: Die Feigen haben getragen.'); await A.wait(700); await Dv.say('Und ich habe nie gesagt: Wir kommen.');
  await A.wait(700); await Ln.say('Jedes Jahr hat er das geschrieben?'); await A.m('Jedes Jahr.'); await Ln.say('Und ihr seid nie gekommen.'); await A.wait(800); await Dv.say('Nein.');
  await A.wait(1000); await Dv.say('Die Feigen.'); await A.wait(500); await Dv.say('Ich muss Jela etwas fragen.');
  A.setFlag('k3.b.invite');
  var st=M.stand('zelenika','house_door')||[312,116,'B']; await A.goto('zelenika',{x:st[0]-30,y:st[1]+6,f:'L',noEnter:true});
  var J=A.npc('jela'), D2=A.npc('davor'), jp=M.apos('zelenika','jela',[60,117,'R']);
  if (D2.actor){ await D2.walk(jp[0]+26,jp[1]+2); await D2.face('L'); }
  await D2.say('Teta Jela.'); await A.wait(500); await D2.say('Smokve. Pokaži mi kako se to radi.'); await A.m('Er bittet sie: Die Feigen. Zeig mir, wie man das macht.');
  await A.wait(1300); await A.narrate('Jela sieht ihn lange an. Dann wischt sie sich die Hände an der Schürze ab, obwohl sie sauber sind.');
  await J.say('E.'); await A.wait(600); await J.say('Ajde. Pokazat ću ti.'); await A.m('Gut. Ich zeige es dir.');
  if (D2.actor){ var dp=M.apos('zelenika','davor',[232,121,'L']); D2.walk(dp[0],dp[1]); }
  if (A.G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Sie war nicht wütend. Sie hat nur gewartet. Wie er.'); } }
// ---------------------------------------------------------------- Davor und Lena in der Stube
async function talkDavor(A){ var Dv=A.npc('davor'), G=A.G;
  if (sat(G)) return Dv.say('Morgen, wenn Sie wollen. Heute will ich mit dem Haus allein sein.');
  await A.menuLoop(function(){ return [
    {t:'Darf ich die Briefe lesen?',if:!A.hasNote('b3_letters'),go:function(A){ return letters(A); }},
    {t:'„Kad ćete doći?“',if:A.hasNote('b3_invite')&&!A.flag('k3.b.invite'),go:async function(A){ await invite(A); return 'bye'; }},
    {t:'Wer hat oben das Kinderzimmer eingerichtet?',once:'dvI1',if:A.hasNote('b3_kidsroom'),go:async function(A){ await Dv.say('Er.'); await A.wait(700); await Dv.say('Ich war nie oben. Ich wusste nicht, dass es das gibt. Er hat nie davon geschrieben.'); }},
    {t:'Warum verkaufen Sie?',once:'dvI2',go:async function(A){ await Dv.say('Weil ich in München lebe. Weil Lena in München lebt. Weil ein Haus, in dem keiner wohnt, verfällt.'); await A.wait(600); await Dv.say('Weil ich zu spät zu seiner Beerdigung gekommen bin. Der Bus. Ich habe nur noch den Sarg gesehen, von hinten.'); }},
    {t:'Sie haben ihn Dida genannt?',once:'dvI3',if:A.hasNote('b3_dida'),go:async function(A){ await Dv.say('Als ich klein war. Alle sagten Djed, ich sagte Dida. Ich konnte das J nicht.'); await A.wait(500); await Dv.say('Später habe ich Vater gesagt. Und dann gar nichts mehr.'); }},
    A.askOpt({
      b3_letters:'Jedes Jahr. Ich habe zweimal geantwortet. Einmal zu Weihnachten und einmal, als Lena in die Schule kam.',
      b3_kidsroom:'Ein Kinderzimmer. Für Lena. Achtundneunzig.',
      b3_cards:'Lenas Karten. Er hat sie alle aufgehoben?',
      b3_sell:'Montag. Notar. Der hat einen Termin, ich habe einen Termin. So einfach ist das. Hoffe ich.',
      b3_gate:'Am Tor, ja. Wenn ich in den Ferien kam, stand er schon da, wenn der Bus noch an der Kurve war.',
      b3_figs:'Die Feigen. Ich habe sie als Kind eingepackt. Mit ihm. Ich weiß nicht mehr, wie.',
      // Analyse K3-B06 (P16): die richtige Notiz im richtigen Gespräch bekommt eine eigene Antwort
      b3_invite:async function(A){ if (!A.flag('k3.b.invite')){ await invite(A); return 'bye'; } await Dv.say('Ich habe es verstanden. Spät. Aber verstanden.'); },
      b3_pencil:'„Dragi dida.“ Unter jeder Karte? So hat ihn nur einer genannt. Ich. Als ich klein war.',
      photo_full:'Wer ist das? Und der Kleine mit den Ohren, das sind Sie?' },
      'Ich weiß es nicht. Ich weiß hier gar nichts mehr.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function talkLena(A){ var Ln=A.npc('lena'), G=A.G;
  if (sat(G)) return Ln.say('Hier gibt es kein WLAN. Nur einen Fernseher, der aussieht wie ein Aquarium.');
  await A.menuLoop(function(){ return [
    {t:'Warst du schon oben?',once:'lnI1',go:async function(A){ await Ln.say('Nein. Papa sagt, das ist nur ein Abstellraum.'); await A.wait(500); await Ln.say('Abstellräume haben keine Luftballons an der Wand. Ich hab durch die Tür geschaut.'); }},
    {t:'Wie findest du das Haus?',once:'lnI2',go:async function(A){ await Ln.say('Es riecht nach alten Leuten. Aber nett alt.'); await A.wait(400); await Ln.say('Und da ist eine Uhr, die tickt so laut, dass man nicht denken kann. Opa konnte bestimmt gut nicht denken.'); }},
    A.askOpt({
      b3_kidsroom:'Das ist für mich gewesen? Mit Ballons? Ich bin vierzehn.',
      b3_cards:'Er hat meine Karten aufgehoben? Alle? Ich hab gedacht, die liest keiner.',
      b3_letters:'Papa liest die die ganze Zeit. Und sagt nichts. Und liest wieder.',
      b3_pencil:'„Dragi dida“? Ich hab immer „Lieber Opa“ geschrieben. Er hat das darunter geschrieben? Für mich?',
      b3_invite:'Ein Zimmer für mich. Und ich wusste nichts davon. Papa auch nicht.' },
      'Keine Ahnung. Frag Papa.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Zum Hof',exit:{to:'zelenika'},look:'Die Tür zum Hof. Draußen die Feigenbäume.',g:{look:'Draußen ist das Tor. Und der Pfosten.'}},
 {id:'letters',name:'Schuhkarton',look:'Ein Schuhkarton auf dem Tisch, voller Briefe, mit einem Gummiband zusammengehalten. Davor hat ihn aus München mitgebracht: alle Briefe, die sein Vater ihm geschrieben hat.',
   read:function(A){ return letters(A); },open:function(A){ return letters(A); },use:function(A){ return letters(A); },take:'Die Briefe gehören Davor. Jetzt.',
   g:{look:'Jedes Jahr ein Brief. Jedes Jahr dieselbe Schrift, nur zittriger.',sense:'Ein alter Mann an diesem Tisch, abends. Er schreibt einen Satz und sieht ihn lange an. Dann schreibt er keinen zweiten.'}},
 {id:'drawer',name:'Mates Schublade',look:'Die Kommode mit vier Schubladen. Die oberste links steht einen Spalt offen. Mates Schublade, sagt Davor.',
   open:function(A){ return drawer(A); },use:function(A){ return drawer(A); },read:function(A){ return drawer(A); },
   g:{look:'Darin liegen Postkarten. Viele. Und ein Bleistiftstummel, so kurz wie meiner.',sense:'Er hat sie gelesen. Immer wieder. Und jedes Mal etwas darunter geschrieben, ganz klein, damit es keiner sieht.'}},
 {id:'photos',name:'Fotos',look:'Gerahmte Fotos über der Kommode: Mate jung, mit Koffer vor einem Bus, „München 1971“ auf dem Rand. Eine Hochzeit. Ein Junge mit Igelfrisur, der so laut lacht, dass man es fast hört.',
   g:{look:'Der Junge mit den Igelhaaren. Das ist der graue Mann aus dem Bus. Vor vierzig Jahren.'}},
 {id:'tv',name:'Fernseher',look:'Ein Röhrenfernseher mit Häkeldeckchen, darauf eine Porzellankatze mit einem abgebrochenen Ohr.',use:'Ich mache ihn nicht an. Das Haus ist still genug.',
   g:{look:'Damit hat er abends die deutschen Nachrichten geschaut. Wegen des Wetters in München.'}},
 {id:'calendar',name:'Kalender',look:'Ein Kalender von 2010. Aufgeschlagen ist der März. Danach hat keiner mehr umgeblättert.',take:'Den lasse ich hängen. Er ist das Genaueste im ganzen Haus.',
   g:{look:'Im März hat er aufgehört umzublättern.'}},
 {id:'stairs',name:'Treppe',look:'Eine Treppe aus Terrazzo mit einem Holzhandlauf, eine halbe Etage hinauf zu einer offenen Tür.',use:function(A){ return upstairs(A); },
   g:{look:'Oben ist es warm. Wärmer als hier.'}},
 {id:'kidsroom',name:'Kinderzimmer',look:'Oben, durch die offene Tür: ein Zimmer mit bunter Tapete. Luftballons.',use:function(A){ return upstairs(A); },open:function(A){ return upstairs(A); },
   g:{look:'Ein Zimmer, das wartet. Mit einem goldenen Schimmer am Bett. Das ist Erwartung. So sieht die aus.',sense:'Jemand hat hier die Tapete geklebt, allein, auf einer Leiter. Er hat dabei gepfiffen.'}},
 {id:'kidsbook',name:'Kinderbuch',look:'Ein buntes Kinderbuch im Regal oben. Von hier lese ich den Titel nicht.',read:function(A){ return upstairs(A); },take:function(A){ return A.flag('k3.b.kids')?A.m('Das Buch bleibt, wo es ist. Es gehört Lena.'):upstairs(A); },
   g:{look:'Deutsch. Er konnte es nicht lesen. Er hat es trotzdem gekauft.'}},
 {id:'kidsbed',name:'Kinderbett',look:'Ein weißes Kinderbett, frisch bezogen, die Decke glatt gestrichen. Wer bezieht ein Bett, in dem nie einer schläft?',use:function(A){ return upstairs(A); },
   g:{look:'Warm. Unbenutzt.',sense:'Wie ein Ofen, den einer jeden Tag anheizt. Für Gäste, die nicht kommen.'}},
 {id:'davor',npc:'davor',name:'Davor',hgt:36,vis:function(S,G){ return inside(G); },talk:talkDavor,
   look:'Davor am Tisch, den Mantel noch an. Vor ihm der Schuhkarton mit den Briefen. Er liest einen, legt ihn zurück, nimmt den nächsten.',
   give:{ photo_full:'Davor: „Wer ist das? Und der Kleine mit den Ohren, das sind Sie?“', vizitka:'Davor: „Die haben Sie schon. Behalten Sie sie.“' },
   g:{look:'Er liest jeden Brief zweimal. Beim zweiten Mal langsamer.',listen:'Er sagt die Sätze leise mit. Smokve su rodile. Er spricht sie aus wie ein Kind.'}},
 {id:'lena',npc:'lena',name:'Lena',hgt:44,vis:function(S,G){ return inside(G); },talk:talkLena,
   look:'Lena an der Treppe, das Handy in der Hand. Sie sieht immer wieder hinauf, zur offenen Tür.',
   g:{look:'Sie will nach oben. Sie traut sich nicht. Das kenne ich.'}}
];
M.room('zelenika_in',{ name:'Haus Zelenika, Stube', scape:'k3_zelenika_in',
  music:'k3_mate',
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (inside(G)){ var d=M.apos('zelenika_in','davor',[120,118,'R']), l=M.apos('zelenika_in','lena',[282,124,'L']);
      L.push({id:'davor',ch:'davor',x:d[0],y:d[1],f:d[2]||'R',name:'Davor',idle:'sit',talk:'sitTalk',speechY:36});
      L.push({id:'lena',ch:'lena',x:l[0],y:l[1],f:l[2]||'L',name:'Lena',idle:'phone',speechY:44}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (sun(G) && A.first('ziD3')){ await A.narrate('Die Stube. Wachstuch auf dem Tisch, eine Pendeluhr, die zu laut tickt, ein Kalender von 2010. Es riecht nach kaltem Ofen und nach Lavendel aus einem Schrank.');
      if (inside(G)) await A.npc('davor').say((F(G,'k3.b.jela')?'':'Sie sind doch gekommen. ')+'Kommen Sie rein. Ziehen Sie die Schuhe nicht aus. Hier hat seit einem Jahr keiner mehr geputzt.'); } }
});
})(M);
