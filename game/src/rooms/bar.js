/* ===== rooms/bar.js — Bar „Bura“: Sanja, Stipe & Frane, Markos Ecktisch, die Zeitung ===== */
(function(M){
'use strict';
var P=M.P;
function open(GS){ return ['pro','c1','c1_night','i1m','c2','cj','c3'].indexOf(GS.phase)>=0; }
function regulars(GS){ return GS.phase==='c2'||GS.phase==='c1'||GS.phase==='pro'||GS.phase==='cj'; }   // am Donnerstagmorgen kommen Stipe und Frane erst um elf
var MCHAIR=[298,101,'L'], OCHAIR=[259,102,'R'];   // Markos Stuhl am Fenster, der Stuhl gegenüber
async function sitDown(A){ if (A.S.sat) return; await A.walk(286,114); A.placeM(MCHAIR[0],MCHAIR[1],'L'); A.idleM('sit'); A.S.sat=true; }
async function talkSanja(A){ var S=A.npc('sanja'), p=A.G.phase;
  if (p==='pro') return sanjaPro(A,S);
  if (p==='i1m') return sanjaMorning(A,S);
  if (p==='c2' && A.first('saC2')){ await S.say('Wie immer?'); await A.m('Wie immer.'); A.sfx('espresso'); await A.wait(900); A.sfx('cup'); await S.say('Du warst in der Zeitung. „Die Stillen“. Hab’s gelesen.'); await S.say('Hast du gut gemacht. Sie hätte sich gefreut. Glaube ich.'); }
  else if (A.first('saHello')) await S.say('Marko. Wie immer?');
  if (A.S.angry){ await S.say('Trink deinen Kaffee, Marko.'); return; }
  await A.menuLoop(function(){ return [
    {t:'Was ist mit der alten Ledana?',once:'sa1',if:p==='c2',go:async function(A){ await S.say('Abriss am Montag. Ein Hotel. Hundertzwanzig Zimmer.'); await S.say('Gut so.'); A.note('c2_demolish'); if (A.hasNote('c2_boy')) await A.m('Sie hat „gut so“ gesagt wie jemand, der etwas wegsperrt.'); }},
    {t:'Kanntest du den Jungen, der dort gestorben ist?',once:'sa2',if:p==='c2'&&A.hasNote('c2_boy')&&!lukaKnown(A),go:async function(A){ await S.say('Warum willst du das wissen?');
        var c=await A.choose([{t:'Ich schreibe vielleicht über den Abriss.',id:'job'},{t:'Ich frage nur.',id:'just'}],{title:'Sanja'});
        if (c==='job') await S.say('Dann schreib über Beton, Marko.'); else await S.say('Dann frag nicht.'); }},
    {t:'Luka. Luka und Nina. Erzähl mir von ihnen.',if:p==='c2'&&lukaKnown(A)&&!A.hasNote('c2_shop'),go:function(A){ return sanjaStory(A,S); }},
    {t:'Ich glaube, Luka wartet immer noch auf sie.',once:'saWrong',if:p==='c2'&&lukaKnown(A),go:async function(A){ await S.say('…'); await S.say('So redet man nicht über Tote. Nicht in meiner Bar.'); A.S.angry=true; A.G.seen['dlg:saWrong']=0; return 'bye'; }},
    {t:'Wo finde ich Nina?',if:p==='c2'&&A.hasNote('c2_shop'),once:'sa4',go:async function(A){ await S.say('In der Altstadt, hinter dem Peristil. „Okvir“. Sie rahmt Bilder. Andere Leute ihre Erinnerungen.'); await S.say('Lass sie in Ruhe, Marko. Sie hat zwölf Jahre gebraucht, um wieder an der Riva vorbeigehen zu können.'); }},
    {t:'Wer war damals noch am Hafen?',once:'sa5',if:p==='c2'&&A.hasNote('c2_shop'),go:async function(A){ await S.say('Mira am Kiosk beim Fährterminal. Die war damals schon da. Die sieht immer alles. Sie hat damals mit der Polizei geredet.'); A.unlock('terminal'); }},
    // Jakovs Fall (92_jakov.js): Kreide von der Tafel
    {t:'Hast du ein Stück Kreide für mich?',once:'saKr',if:p==='cj'&&A.hasNote('cj_where')&&!A.has('kreide'),go:async function(A){ await S.say('Kreide? Wofür?'); await A.m('Für einen Namen.');
        await A.wait(700); await S.say('Nimm. Die Tageskarte schreibe ich heute sowieso nicht. Es gibt nur Brodet.'); A.give('kreide'); }},
    {t:'Kanntest du einen Jakov? Totengräber in Sustipan.',once:'saJk',if:p==='cj'&&(A.hasNote('cj_1958')||A.hasNote('cj_stone')||A.hasNote('cj_anka')),go:async function(A){ await S.say('In Sustipan gibt es seit fünfzig Jahren keine Toten mehr, Marko.'); await S.say('Frag die zwei da. Die kennen jeden Toten von Split persönlich.'); }},
    {t:'Wie geht’s dir, Sanja?',once:'sa6',go:async function(A){ await S.say('Die Bura treibt mir die Gäste weg und den Staub herein. Wie immer.'); await S.say('Und dir? Du siehst aus, als hättest du nicht geschlafen.'); await A.m('Wie immer.'); }},
    A.askOpt({ c2_demolish:'Montag. Da kommen die Bagger.', c2_meet:async function(A){ await S.say('Der Kiosk am Fährterminal.'); await A.wait(800); await S.say('Woher weißt du das?'); await A.m('Ich weiß es einfach.'); await S.say('Du machst mir Angst, Marko.'); },
      c2_luka:async function(A){ return sanjaStory(A,S); }, c2_ferry:async function(A){ return sanjaStory(A,S); },
      c2_died:'Drei Tage. Drei Tage haben wir ihn gesucht, und er lag da die ganze Zeit.', c2_stayed:'Sie ist geblieben. Ich weiß nicht, ob aus Trotz oder aus Treue.',
      c2_tape:'Eine Kassette? Er hat immer Kassetten aufgenommen. Mit einem Rekorder vom Flohmarkt, der alles schneller abspielte.' },'Weiß ich nicht, Marko.'),
    {t:'Danke für den Kaffee.',bye:true,go:async function(A){ await S.say('Du hast nicht bezahlt.'); await A.m('Ich bezahle morgen.'); await S.say('Wie immer.'); }}
  ]; }); }
function lukaKnown(A){ return A.hasNote('c2_luka')||A.hasNote('c2_meet')||A.has('tickets'); }
async function sanjaStory(A,S){ if (A.hasNote('c2_shop')) return S.say('Ich habe dir alles gesagt.');
  await S.say('Woher kennst du die Namen?'); await A.m('Aus der Ledana.'); await S.say('…');
  await S.say('Luka hat im Sommer an der Riva Gitarre gespielt, für die Touristen. Nina hat immer zugehört, da drüben auf der Bank. Ich habe hier gekellnert. Achtzehn war ich.'); A.note('c2_riva');
  await S.say('Sie wollten weg. Nach Italien, auf die Kunstschule in Venedig. Ninas Vater war … dagegen. Gegen alles.');
  await S.say('An dem Abend, an dem sie fahren wollten, kam Luka nicht. Drei Tage später haben sie ihn in der Ledana gefunden. Unten an der Treppe.'); A.note('c2_died');
  await S.say('Nina ist nie weggegangen. Nicht nach Venedig, nicht nach Zagreb. Sie hat einen kleinen Laden in der Altstadt. „Okvir“. Bilderrahmen.'); A.note('c2_stayed',true); A.note('c2_shop'); A.unlock('oldtown');
  await S.say('Sie redet nicht über damals. Mit niemandem. Mit mir auch nicht.'); }
// ---------------------------------------------------------------- Dienstag: Sanjas Brief aus Triest (Marko hat ein Leben außerhalb des Falls)
async function sanjaPro(A,S){ var F=A.G.flags;
  if (!F['split.intro.sanja']){ await S.say(A.cycle('saBusy',['Gleich, Marko. Setz dich. Ich komme.','Ich habe zwei Hände, und beide sind voll. Setz dich.','Setz dich. Ich bringe ihn dir.'])); return; }
  await A.menuLoop(function(){ return [
    {t:'Hat Triest schon angerufen?',once:'saP1',go:async function(A){ await S.say('Um vier. Ich lese ihm deinen Satz vor. Auf Italienisch.'); await S.say('Er wird weinen. Oder um Prozente feilschen. Bei Triestinern ist das dasselbe.'); }},
    {t:'Kanntest du Ivka Perić?',once:'saP2',if:A.hasNote('pro_auftrag'),go:async function(A){ await S.say('Die alte Frau von der Mole? Jeder kannte sie. Keiner kannte sie.');
        await S.say('Herein kam sie nie. Einmal hat sie draußen unter der Markise gewartet, als es geschüttet hat. Ich habe ihr einen Kaffee rausgebracht.'); await S.say('Sie hat ihn getrunken und mir die Tasse gespült zurückgegeben. Gespült.'); }},
    {t:'Ich muss los.',bye:true,go:async function(A){ await S.say('Geh. Und iss etwas. Du siehst aus wie dein eigener Nachruf.'); }}
  ]; }); }
async function proTable(A){ var Sa=A.npc('sanja'), F=A.G.flags; await sitDown(A);
  if (F['split.intro.sanja']) return A.m('Mein Platz. Von hier sieht man die Tür und ein Stück Hafen.');
  await A.wait(900); A.sfx('espresso'); await A.wait(1500);
  // Sanja kommt, wenn sie so weit ist – mit Kaffee und Brief, und setzt sich auf den Stuhl gegenüber
  await A.fade(5,260); if (Sa.actor){ Sa.place(OCHAIR[0],OCHAIR[1],OCHAIR[2]); Sa.idle('sit'); } A.sfx('cup'); await A.fade(0,260);
  await Sa.say('Du sitzt da wie einer, der auf ein Urteil wartet.'); await A.m('Ich warte auf einen Kaffee. Das Urteil kommt später.'); await Sa.say('Ich meinte nicht den Kaffee.');
  await A.wait(600); await Sa.say('Da. Der Brief. Lies.'); A.sfx('paper');
  await A.doc({style:'letter',title:'Torrefazione Giuliana · Trieste',w:244,lines:['Gentile Signora Sanja,','dal 1° dicembre il prezzo del nostro caffè','aumenterà del nove per cento.','Ci scusiamo per l’inconveniente.','Le consegne restano il martedì.','Cordiali saluti, Paolo Giuliani']});
  await A.m('„Ab dem ersten Dezember wird unser Kaffee um neun Prozent teurer. Wir bitten die Unannehmlichkeit zu entschuldigen. Geliefert wird weiter dienstags.“');
  await Sa.say('Neun Prozent. Und dafür ein Satz Entschuldigung.'); await Sa.say('Schreib ihm. Schreib: Wenn er mit neun Prozent kommt, kaufe ich ab Januar bei den Neapolitanern.');
  await A.m('So schreibe ich das nicht.'); await Sa.say('Warum nicht?'); await A.m('Weil er es so liest, wie du es meinst.');
  for (var k=0;k<6;k++){ var c=await A.choose([
      {t:'Wörtlich: „Neun Prozent? Dann eben die Neapolitaner.“',id:'blunt',silent:true},
      {t:'Höflich: „Wir verstehen und nehmen die Erhöhung an.“',id:'soft',silent:true},
      {t:'Fest: „Ab Januar ja. Sonst prüfen wir andere Angebote.“',id:'firm',silent:true}],{title:'Die Antwort nach Triest',conv:false});
    if (c==='firm') break;
    if (c==='blunt'){ await Sa.say('Genau das.'); await A.m('Dann liefert er dir ab morgen gar nichts mehr. Er ist aus Triest. Die sind empfindlich, wenn es um Neapel geht.'); await Sa.say('Ich will ihn ärgern. Nicht verlieren.'); }
    else { await Sa.say('„Annehmen“? Ich nehme gar nichts an.'); await A.m('So klingt es aber.'); await Sa.say('Dann schreib es nicht.'); } }
  A.sfx('paper'); await A.m('„Possiamo accettare un aumento a partire da gennaio. Altrimenti valuteremo altre offerte.“');
  await Sa.say('„Andere Angebote prüfen.“ Klingt, als hätte ich welche.'); await A.m('Klingt so. Meistens reicht das.'); await Sa.say('Du bist gefährlich, Marko.'); F['split.intro.sanja']=true;
  // mitten im Gespräch: die Übelkeit. Sanja sieht nur, dass er die Tasse abstellt
  await A.animM('sitDrink'); await A.wait(300); A.sfx('cup'); await A.animM('sitSick'); await A.wait(900);
  await A.m('…'); await A.m('Wo war ich?'); await Sa.say('Bei den anderen Angeboten.'); await A.wait(500); await Sa.say('Marko. Du bist grau im Gesicht.');
  var h=await A.choose([{t:'Mir ist seit Tagen schwindlig. Wahrscheinlich der Jugo.',id:'honest'},{t:'Ich bin Übersetzer. Uns geht es nie gut, nur genau.',id:'joke'},{t:'Nichts. Dein Kaffee.',id:'deflect'}],{title:'Sanja'});
  F['split.intro.health']=h;
  if (h==='honest'){ await Sa.say('Seit Tagen? Dann geh zum Arzt. Nicht zum Jugo.'); await A.m('Wenn es bis Freitag nicht weg ist.'); await Sa.say('Das hast du letzten Freitag auch gesagt.'); }
  else if (h==='joke'){ await Sa.say('Witzig.'); await A.wait(600); await Sa.say('Geh trotzdem zum Arzt. Genau.'); }
  else await Sa.say('Mein Kaffee ist nicht schuld. Mein Kaffee ist das Einzige hier, das nie schuld ist.');
  await Sa.say('Warst du am Wochenende draußen? Unter Menschen?'); await A.m('Ich war mit einem Wörterbuch spazieren.'); await Sa.say('Mit welchem?'); await A.m('Mit dem dicken.');
  await Sa.say('Der Kaffee geht aufs Haus. Wegen Triest.'); await A.m('Seit wann?'); await Sa.say('Seit heute. Die elf vom Oktober schreibe ich trotzdem weiter an.');
  await A.fade(5,260); if (Sa.actor){ var sp=M.apos('bar','sanja',[120,106,'F']); Sa.place(sp[0],sp[1],sp[2]||'F'); Sa.idle('polish'); } await A.fade(0,260);
  await A.m('Elf Kaffee. Ich führe auch Buch. Nur nicht so genau.'); A.save(); }
// ---------------------------------------------------------------- Donnerstagmorgen: ein gewöhnlicher Morgen – bis zum Stuhl gegenüber
async function sanjaGreetMorning(A){ var S=A.npc('sanja'), F=A.G.flags, h=F['split.intro.health'], wasC1=!!A.G.seen['bar:barC1'];
  await A.m('Die „Bura“ am Morgen. Vor elf gehört sie fast mir.'); await A.wait(300);
  if (h==='honest') await S.say('Und? Dreht sich der Boden noch?'); else if (h==='joke') await S.say('Na, Herr Übersetzer. Heute genau oder heute gut?'); else if (h==='deflect') await S.say('Mein Kaffee war es übrigens nicht. Ich habe ihn selbst getrunken. Mir geht es blendend.'); else await S.say('Marko. Wie immer?');
  if (h==='honest') await A.m('Heute steht er.'); else if (h==='joke') await A.m('Heute gut. Ausnahmsweise.'); else await A.m('Wie immer.');
  if (wasC1) await S.say('Gestern Abend warst du noch grau. Heute nur blass.');
  await S.say('Du bist in der Zeitung. Seite vierzehn. „Die Stillen“.');
  if (F.leadKnit===1){ await S.say('Das mit den Mützen. Den kleinen Ante kenne ich. Der trägt sie jeden Tag.'); await S.say('Hast du gut gemacht. Sie hätte sich gefreut. Glaube ich.'); }
  else if (F.leadKnit===0){ await S.say('„Angehörige sind nicht bekannt.“ Klingt wie die Stadt, Marko.'); await S.say('Aber der Anfang ist schön.'); }
  else await S.say('Hast du gut gemacht. Sie hätte sich gefreut. Glaube ich.');
  await S.say('Setz dich. Ich bringe ihn dir. Stipe und Frane kommen erst um elf, du hast deine Ruhe.');
  A.setFlag('split.afterIvka.bar'); A.G.seen['bar:saC2']=1; A.G.seen['bar:saHello']=1; }
async function sanjaMorning(A,S){ var F=A.G.flags;
  if (!F['split.afterIvka.back']){ await S.say(A.cycle('saMo',['Setz dich, Marko. Ich bringe ihn dir.','Dein Tisch ist frei. Wie immer um diese Zeit.'])); return; }
  await A.menuLoop(function(){ return [
    {t:'Du machst am Montag zu? Inventur?',if:A.hasNote('i1_note')&&!F['split.afterIvka.verified'],go:async function(A){ await verifyNote(A,S); return 'bye'; }},
    {t:'Wie geht’s dir, Sanja?',once:'saM1',go:async function(A){ await S.say('Die Maschine pfeift. Die Bura kommt. Stipe schuldet mir Geld. Wie immer.'); }},
    A.askOpt({ i1_note:async function(A){ if (F['split.afterIvka.verified']) return S.say('Ja. Montag zu. Sag es nicht weiter, bevor ich es Stipe gesagt habe.'); await verifyNote(A,S); } },'Weiß ich nicht, Marko.'),
    {t:'Danke für den Kaffee.',bye:true,go:async function(A){ await S.say('Zwölf.'); await A.m('Zwölf?'); await S.say('Kaffee. Seit Oktober. Ich führe Buch.'); }}
  ]; }); }
async function verifyNote(A,S){ var F=A.G.flags; await S.say('…'); await S.say('Woher weißt du das?'); await A.m('Es steht auf deinem Zettel.');
  await S.say('Den habe ich um halb acht geschrieben. Da war hier noch zu.'); await S.say('Und von deinem Tisch aus kann man den nicht lesen. Ich kann ihn von hier kaum lesen.');
  await A.wait(700); await S.say('Da.'); A.sfx('paper'); await readNote(A);
  await S.say('Montag zu. Inventur. Ich wollte es Stipe und Frane nachher sagen. Sie werden jammern.'); await S.say('Und jetzt sag mir, wie du das gemacht hast.');
  var c=await A.choose([{t:'„Gute Augen.“',id:'eyes'},{t:'„Jemand hat es mir vorgelesen.“',id:'true'},{t:'(Nur lächeln.)',id:'smile',silent:true}],{title:'Sanja'});
  if (c==='true') await S.say('Wer? Dein Kaffee?'); else if (c==='eyes') await S.say('Du hältst die Zeitung eine Armlänge weit weg, Marko.'); else await S.say('Lächle nicht so. Das kenne ich von dir nicht.');
  F['split.afterIvka.verified']=true; await A.wait(500); await S.say('Und sag Stipe nichts. Das ist meine Sache.');
  if (A.malaHere()){ await A.g('Und?'); await A.m('Da liegt ein Zettel. Und darauf steht, was du gesagt hast.'); await A.wait(700); await A.m('Und jetzt weiß ich etwas, das Sanja selbst sagen wollte.');
    await A.g('So ist es jeden Tag. Ich sehe, was keiner zeigen will.'); await A.m('Und was machst du damit?'); await A.g('Meistens nichts.'); await A.wait(700);
    await A.m('Und über dich? Was siehst du da?'); await A.wait(1100); await A.g('…'); await A.wait(500); await A.g('Ich will ans Wasser. Nicht weit.'); }
  A.save(); }
var NOTE_LINES=['ČETVRTAK','mlijeko 6 l, limun 2 kg','nazvati Ivicu – aparat opet pišti!','PONEDJELJAK ZATVORENO – inventura','(reći Stipi i Frani!!)'];
async function readNote(A){ await A.doc({style:'letter',title:'Ein Zettel, mit Kugelschreiber',w:210,lines:NOTE_LINES}); }
async function morningTable(A){ var F=A.G.flags; await sitDown(A);
  if (F['split.afterIvka.back']) return A.m(F['split.afterIvka.verified']?'Mein Platz. Gegenüber Mala. Sanja wischt den Tresen und tut, als sähe sie nichts.':'Mein Platz. Gegenüber sitzt Mala. Der Stuhl merkt nichts davon.');
  if (!F['split.afterIvka.bar']) await sanjaGreetMorning(A);
  await A.wait(900); A.sfx('espresso'); await A.wait(1400); A.sfx('cup');
  await A.m('Sanja stellt die Tasse hin und geht zurück hinter den Tresen. Sie weiß, wann man mich lässt.');
  await A.animM('sitDrink'); await A.wait(500); await A.m('Der erste Kaffee seit Tagen, den nicht ich gemacht habe.'); await A.wait(1200);
  await M.malaReturns(A); }
// Mala sitzt auf dem Stuhl gegenüber: leise, klar zu sehen, ohne Schreck (nicht das Flackern der Geister, die ihren Tod erkennen)
M.malaReturns=async function(A){ var G=A.G; delete G.flags['split.afterIvka.away']; G.flags['split.afterIvka.back']=true;
  A.malaJoin({x:OCHAIR[0],y:OCHAIR[1],f:'R',force:true}); A.idleG('sit'); G.flags['mala.lock']=true; await A.wait(2200);
  await A.m('…'); await A.m('Der Stuhl gegenüber ist nicht mehr leer.'); await A.wait(800); await A.g('Morgen, Marko.');
  await A.m('Ich habe dich geträumt.'); await A.g('Du hast geschlafen. Das ist nicht dasselbe.');
  await A.m('Heute Morgen warst du nicht da.'); await A.g('Du hast mich nicht gesehen. Das ist auch nicht dasselbe.');
  var c=await A.choose([{t:'„Steh auf. Ich hatte einen guten Morgen. Den ersten seit einer Woche.“',id:'away'},{t:'„Dann zeig mir, dass du jetzt hier bist. Wirklich hier.“',id:'test'},{t:'(Lange ausatmen.) „Dann bin ich wenigstens nicht verrückt geworden. Oder nicht nur.“',id:'relief'}],{title:'Mala',conv:false});
  G.flags['split.afterIvka.reaction']=c;
  if (c==='away'){ await A.g('Du hast mich heute Morgen weggeträumt. Das war nicht schön.'); await A.g('Ich habe neben deinem Bett gesessen und gewartet, dass du mich wieder siehst.'); }
  else if (c==='test'){ await A.g('Gleich. Erst frag mich, wo ich war.'); }
  else { await A.g('Nicht verrückt.'); await A.wait(700); await A.g('Ich war froh, als du die Tasse abgestellt hast. Da hast du hochgesehen.'); }
  await A.m('Wo warst du?'); await A.g('Hier. Bei dir. Weit weg kann ich nicht, das weißt du.');
  await A.g('Seit wir durch das Tor zurück sind, ist es … dünner. Als wäre unterwegs etwas verrutscht. Ich habe gerufen. Du hast durch mich hindurchgesehen.');
  await A.m('Und jetzt?'); await A.g('Jetzt nicht mehr. Ich weiß nicht, warum. Ich weiß nicht, ob es wiederkommt.');
  // kein zweiter Wahrnehmungstest (Prüfbericht): Marko glaubt ihr. Die Frage ist, was es heißt, über die Lebenden Dinge zu wissen
  await A.wait(600); await A.m('Ich glaube dir. Das ist ja das Problem.'); await A.m('Wenn ich dir glaube, glaube ich auch alles, was du über andere siehst. Über Sanja. Über jeden hier.'); await A.g('Dann fang mit etwas Kleinem an. Etwas, das niemandem wehtut.');
  G.flags['mala.lock']=false; A.save(); };
async function talkRegulars(A){ var St=A.npc('stipe'), Fr=A.npc('frane');
  if (A.G.phase==='cj' && M.jkRegulars) return M.jkRegulars(A,St,Fr);   // Jakovs Fall: Briškula um eine Geschichte
  if (A.G.phase!=='c2'){ await St.say('Briškula. Wir reden nicht beim Spielen.'); return; }
  if (A.first('regC2')){ await St.say('Montag reißen sie die Ledana ab.'); await Fr.say('Gut. Da ist sowieso nur Unglück drin.'); await St.say('Neunundneunzig, der Junge.'); await Fr.say('Spiel, Stipe.'); A.note('c2_demolish'); A.note('c2_boy'); return; }
  await A.menuLoop(function(){ return [
    {t:'Was für ein Junge war das, neunundneunzig?',once:'rg1',go:async function(A){ await St.say('Einer mit Gitarre. Hat an der Riva gespielt, „Moja mala nima mana“ und so, für die Deutschen.'); await Fr.say('Für die Italiener.'); await St.say('Für alle. Dann ist er in der Ledana die Treppe runtergefallen. Die Treppe war damals schon morsch.'); A.note('c2_boy',true); }},
    {t:'Wer gewinnt?',once:'rg2',go:async function(A){ await Fr.say('Ich.'); await St.say('Seit vierzig Jahren sagt er das.'); await Fr.say('Seit vierzig Jahren stimmt es.'); }},
    {t:'Wie geht’s Hajduk?',once:'rg3',go:async function(A){ await St.say('Frag nicht.'); await Fr.say('Frag wirklich nicht.'); }},
    {t:'Ich lasse euch spielen.',bye:true}
  ]; }); }
var HS=[
 {id:'door',name:'Tür',exit:{to:'map'},look:'Die Tür zur Gasse. Ein Glöckchen bimmelt, wenn jemand kommt, und schweigt, wenn jemand geht.'},
 {id:'sanja',npc:'sanja',name:'Sanja',hgt:40,vis:function(S,GS){ return open(GS); },talk:talkSanja,r:function(S,GS,a){ return [Math.round(a.x)-9,Math.round(a.y)-50,18,30]; },
   look:'Sanja. Kurze schwarze Haare, eine Schürze, ein Blick, der seit fünfzehn Jahren Gäste sortiert.',
   g:{look:'Sie mag ihn. Sie würde es nie sagen.',listen:async function(A){ if (A.G.phase==='i1m') return A.g('Sie zählt Milchflaschen, halblaut. Bei sechs hört sie auf.'); if (!A.hasNote('c2_shop')) return A.g('Sie summt beim Spülen. Ein Lied von der Riva. Dann hört sie plötzlich auf.'); await A.g('Sie redet leise mit sich selbst: „Zwölf Jahre. Und jetzt kommt er mit den Namen.“'); }},
   give:{ letter_t:async function(A){ var Sa=A.npc('sanja'); if (A.hasNote('c1_letter')) return Sa.say('Den hast du doch gelesen. Das sehe ich dir an.');   // Sanja sieht, in welchem Zustand der Brief ist
       if (A.flag('c1.letterOpen')){ await Sa.say('Offen ist er. Lesen kann ihn so keiner mehr. Das Salz nimmt die Tinte zuerst.'); return A.m('Ich weiß.'); } return M.steamLetter(A,'bar'); },
     newspaper:'„Behalt sie. Ich habe zwei.“', tickets:async function(A){ var S=A.npc('sanja'); await S.say('Zwei Tickets nach Ancona …'); await A.wait(900); await S.say('Woher hast du die?'); await A.m('Aus der Ledana.'); return sanjaStory(A,S); } }},
 {id:'stipe',npc:'stipe',name:'Stipe',hgt:36,vis:function(S,GS){ return regulars(GS); },talk:talkRegulars,look:'Stipe, Schiebermütze, braunes Sakko, siebzig Jahre Briškula in den Fingern.',g:{look:function(A){ if (A.G.phase==='cj' && M.jkPeek) return M.jkPeek(A); return A.g('Er schummelt. Nur ein bisschen. Seit vierzig Jahren.'); },listen:'Er zählt die Punkte laut und falsch.'}},
 {id:'frane',npc:'frane',name:'Frane',hgt:36,vis:function(S,GS){ return regulars(GS); },talk:talkRegulars,look:'Frane, Glatze mit weißem Kranz, die Karten fächerförmig vor der Nase.',g:{look:'Er lässt Stipe gewinnen, wenn Stipe traurig ist. Stipe merkt es nicht.',listen:'„Meine Frau hat immer gesagt, ich spiele schlecht.“ Er lächelt dabei.'}},
 {id:'counter',name:'Tresen',look:'Ein Tresen aus Zink und Holz, mit Ringen von zehntausend Tassen.',g:{look:'Hier lehnen sie alle, wenn sie nicht nach Hause wollen.'}},
 {id:'espresso',name:'Espressomaschine',look:'Eine verchromte Espressomaschine, älter als Sanja. Sie faucht wie ein Drache, der Kaffee macht. Aus dem Dampfrohr zischt es.',use:'Niemand außer Sanja fasst diese Maschine an. Niemand.',
   with:{ letter_t:async function(A){ if (A.flag('c1.letterOpen')) return A.m('Er ist schon offen.'); if (!A.npc('sanja').actor) return A.m('Ohne Sanja fasse ich diese Maschine nicht an.'); await A.m('Darf ich?'); await A.npc('sanja').say('Finger weg von meiner Maschine, Marko.'); return M.steamLetter(A,'bar'); } },
   g:{look:'Sie zischt. Ich mag das Geräusch.'}},
 {id:'bottles',name:'Flaschen',look:'Travarica, Pelinkovac, Maraschino, ein Whisky, den nie jemand bestellt.',g:{look:'Sie stehen da wie Zuschauer.'}},
 {id:'radio',name:'Radio',look:'Ein Radio, auf Sport gestellt. Hajduk verliert wahrscheinlich gerade. Auch wenn sie nicht spielen.',use:'Ich lasse es laufen. Das Radio gehört zur Bar wie die Bura.',g:{listen:'Fußball. Ein Mann schreit, weil ein anderer Mann gegen einen Ball getreten hat.',look:'Es redet für alle, die schweigen.'}},
 {id:'photos',name:'Mannschaftsfotos',look:'Hajduk, 1971, 1979, 1994. Männer mit Schnurrbärten und Hoffnung.',g:{look:'Alle lächeln. Fotos von damals lächeln immer.'}},
 {id:'window',name:'Fenster',look:'Durchs Fenster: die Gasse, ein Stück Riva, die Bura, die Plastikstühle über das Pflaster jagt.',g:{look:'Draußen geht das Leben vorbei. Es grüßt nicht.'}},
 {id:'marko_table',name:'Markos Tisch',look:'Mein Tisch, am Fenster. Hier habe ich mehr Seiten übersetzt als zu Hause.',
   use:async function(A){ var p=A.G.phase; if (p==='pro') return proTable(A); if (p==='i1m') return morningTable(A); await sitDown(A); await A.m('Ich setze mich kurz. Der Stuhl kennt mich.'); },g:{look:'Hier sitzt er jeden Morgen. Ich setze mich ihm gegenüber. Niemand setzt sich je auf meinen Stuhl.'}},
 {id:'chair_opp',name:'Stuhl gegenüber',r:[251,74,13,28],st:[280,112,'B'],
   look:function(A){ var G=A.G; if (G.phase==='i1m' && G.flags['split.afterIvka.back'] && A.malaHere()) return A.m('Mala sitzt darauf. Der Stuhl merkt nichts davon.'); return A.m('Der Stuhl gegenüber. Wenn sich jemand zu mir setzt, dann dort. Meistens Sanja, wenn sie etwas will.'); },
   use:'Das ist nicht mein Platz. Meiner ist gegenüber.', g:{look:'Sein Gegenüber. Hier sitze ich gern.'}},
 {id:'note',name:'Zettel hinter dem Tresen',vis:function(S,GS){ return GS.phase==='i1m'; },r:[111,73,14,9],st:[118,119,'B'],gst:[117,104,'B'],reach:'none',
   look:function(A){ if (A.flag('split.afterIvka.verified')) return readNote(A); return A.m('Ein Zettel auf dem Tresen, auf Sanjas Seite, direkt unter der Lampe. Mit Kugelschreiber, mit vielen Ausrufezeichen. Von hier kann ich ihn nicht lesen. Und hinter Sanjas Tresen geht niemand.'); },
   take:'Hinter Sanjas Tresen greife ich nicht. Niemand tut das, der hier noch Kaffee will.', read:function(A){ return A.flag('split.afterIvka.verified')?readNote(A):A.m('Zu weit weg. Und er liegt mit der Schrift zu Sanja.'); },
   g:{look:async function(A){ await readNote(A); await A.g('„Donnerstag. Milch, sechs Liter. Zitronen, zwei Kilo. Ivica anrufen – die Maschine pfeift schon wieder. Montag geschlossen, Inventur. Stipe und Frane sagen, mit zwei Ausrufezeichen.“');
       if (!A.hasNote('i1_note')){ A.note('i1_note'); await A.g('Ich fasse ihn nicht an. Ich kann ihn nur lesen.'); } }}},
 {id:'cards_table',name:'Kartentisch',look:'Ein Tisch, an dem seit Jahrzehnten Briškula gespielt wird. Die Karten sind so alt wie die Spieler.',g:{look:'Die Karten sind weich wie Stoff.'}},
 {id:'newspaper',name:'Zeitung',vis:function(S,GS){ return !S.paperTaken && (GS.phase==='c2'||GS.phase==='i1m'); },look:'Glas Rive von heute. Seite 14: „Die Stillen“.',
   take:async function(A){ await A.reach(function(){ A.set('paperTaken',true); A.give('newspaper'); }); await A.npc('sanja').say('Nimm sie mit. Ich habe zwei.'); await A.m('Zdenka wollte sie sehen.'); },
   read:function(A){ return M.readNewspaper(A); }, g:{look:'Sein Text. Ganz unten auf der Seite, wo man ihn fast übersieht.'}}
];
M.room('bar',{ name:'Bar „Bura“', scape:'bar',
  music:function(GS){ return GS.phase==='c2'?'case2':'flat'; },
  actors:function(S,GS){ var L=[]; if (open(GS)){ var p=M.apos('bar','sanja',[120,106,'F']); L.push({id:'sanja',ch:'sanja',x:p[0],y:p[1],f:p[2]||'F',name:'Sanja',idle:'polish'}); }
    if (regulars(GS)){ var s=M.apos('bar','stipe',[214,124,'R']), f=M.apos('bar','frane',[252,124,'L']); L.push({id:'stipe',ch:'stipe',x:s[0],y:s[1],f:s[2]||'R',name:'Stipe',idle:'cards',speechY:40}); L.push({id:'frane',ch:'frane',x:f[0],y:f[1],f:f[2]||'L',name:'Frane',idle:'cards',speechY:40}); }
    return L; },
  hotspots:HS,
  tick:function(A){ if (A.S.sat && A.marko && A.marko.mode==='walk'){ A.S.sat=false; A.marko.idle=null; } if (A.mala && A.mala.mode==='walk' && A.mala.idle==='sit') A.mala.idle=null; },
  enter:async function(A,from){ A.S.angry=false; A.S.sat=false;
    if (A.G.phase==='pro' && A.first('barPro')){ await A.m('Die Bar „Bura“. Hier habe ich mehr Seiten übersetzt als zu Hause. Das Licht ist besser. Der Kaffee auch, aber das sage ich Sanja nicht.'); await A.npc('sanja').say('Marko! Setz dich. Gleich.'); }
    if ((A.G.phase==='c1'||A.G.phase==='c1_night') && A.first('barC1')){ await A.m('Die Bar „Bura“. Mein Ecktisch, mein Kaffee. Sanja sieht mich an, als wüsste sie, dass ich nicht geschlafen habe.'); if (A.malaHere()) await A.g('Hier riecht es nach dir.'); }
    if (A.G.phase==='i1m' && !A.flag('split.afterIvka.bar')) await sanjaGreetMorning(A);
    if (A.G.phase==='c2' && A.first('barC2')){ if (A.flag('split.afterIvka.bar')) await A.m('Inzwischen sind Stipe und Frane da. Und die Bura auch. Sie drückt gegen die Scheiben.'); else await A.m('Die Bar „Bura“. Bei Bura ist sie immer voll. Heute sind es zwei alte Männer und ich.'); } }
});
M.defineScape('bar',function(o){ return { beds:['crowdFar','room'], step:'tile', ev:[['cups',3,8,0.8,-0.6,0.2],['cards',4,9,0.9,0.4,0.7],['espresso',20,45,0.7,-0.6,-0.3],['radio',8,16,0.6,-0.8,-0.5],['door',40,90,0.4,-1,-0.8]] }; });
// die Zeitung zeigt, was Marko am Dienstag gewählt hat: den ersten Satz und (neu) den Satz über die anderen; sent=true: sein Text im Postausgang
M.readNewspaper=async function(A,sent){ var lead=['Ivka Perić hat siebenundzwanzig Jahre lang auf ein Schiff gewartet.','Jeden Abend um sieben ging Ivka Perić zur Riva.','Ivka Perić hinterlässt zwei Tassen und einen Stuhl am Fenster.'][A.G.flags.lead||0];
  var k=A.G.flags.leadKnit, lines=[lead,'','In der Wohnung in Veli Varoš stehen zwei Tassen auf dem Tisch, eine davon nie benutzt. Am Fenster ein Stuhl, zur Mole gedreht. 1984 kam ihr Sohn Tonći in der Weihnachtsbura nicht nach Hause. Sie hat nie aufgehört, das Boot um sieben abzuholen.'];
  if (k===1) lines.push('','Familie hatte sie keine mehr. Aber in Veli Varoš tragen die Kinder ihre Mützen, die Nachbarn ihre Socken, und der Kater schläft auf einer Decke aus ihren Resten.');
  else if (k===0) lines.push('','Angehörige sind nicht bekannt.');
  lines.push('','Ivka Perić starb am 10. November. Sie wurde 85 Jahre alt.','— M. V.');
  await A.doc({style:'news',title:sent?'Gesendet · Di., 23:48 · Die Stillen':'GLAS RIVE · Die Stillen',w:244,lines:lines}); };
})(M);
